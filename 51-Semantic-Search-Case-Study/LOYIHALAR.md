# 🚀 51-modul mini-loyihalari

> **3 ta tayyor loyiha.** ## ⭐⭐ **Hammasi API kalitisiz** — va **Pinecone bilan ham ishlaydi**.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install chromadb sentence-transformers pandas numpy rank-bm25
# ixtiyoriy: pip install pinecone python-dotenv
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, json, hashlib, shutil
from pathlib import Path
from collections import defaultdict
import numpy as np, pandas as pd, chromadb
from sentence_transformers import SentenceTransformer

KURSLAR = "course_descriptions.csv"
BOLIMLAR = "course_section_descriptions.csv"


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


def norm(A):
    return A / np.linalg.norm(A, axis=1, keepdims=True)
```

---

# 🔎 1-loyiha. To'liq kurs qidiruv xizmati

> **Maqsad:** CSV dan boshlab, chegarali va guruhlangan natijagacha — **butun quvur bitta sinfda**.

```python
class KursQidiruvXizmati:
    """🏆 365 kurs katalogi uchun to'liq semantik qidiruv.

    Pinecone kaliti BO'LSA  →  Pinecone
    BO'LMASA                →  mahalliy Chroma
    Ikkalasida ham AYNAN bir xil API.
    """

    FOYDASIZ = {"conclusion", "introduction", "summary", "welcome",
                "course overview", "what's next",
                "setting up the environment"}

    def __init__(self, nom="kurslar-v1", model_nomi="all-MiniLM-L6-v2",
                 yol="./chroma_kurs_xizmat"):
        self.model = SentenceTransformer(model_nomi)
        self.model_nomi = model_nomi
        self.olcham = self.model.get_sentence_embedding_dimension()
        self.chegara = None
        kalit = os.getenv("PINECONE_API_KEY")

        if kalit:
            from pinecone import Pinecone, ServerlessSpec
            pc = Pinecone(api_key=kalit)
            if nom not in [i["name"] for i in pc.list_indexes()]:
                pc.create_index(name=nom, dimension=self.olcham,
                                metric="cosine",
                                spec=ServerlessSpec(cloud="aws",
                                                    region="us-east-1"))
            self.idx, self.turi = pc.Index(nom), "pinecone"
        else:
            kl = chromadb.PersistentClient(path=yol)
            self.idx = kl.get_or_create_collection(
                name=nom, metadata={"hnsw:space": "cosine",
                                    "model": model_nomi})
            self.turi = "chroma"
        print(f"✅ {self.turi} · {nom} · {self.olcham} o'lcham")

    # ───────────────────────── ma'lumot
    @staticmethod
    def csv_oqi(yol):
        d = pd.read_csv(yol, encoding="cp1252")        # ⭐ utf-8 EMAS
        for c in d.columns:
            if d[c].dtype == object:
                d[c] = d[c].map(tozala)
        return d

    def tayyorla(self, yol=BOLIMLAR):
        d = self.csv_oqi(yol)
        d["unique_id"] = (d.course_id.astype(str) + "-"
                          + d.section_id.astype(str))
        assert d.unique_id.nunique() == len(d), "💥 TAKRORIY ID"

        d["matn"] = d.apply(lambda r: tozala(
            f'{r.course_name} {r.course_technology} {r.course_description} '
            f'{r.section_name} {r.section_description}'), axis=1)
        d["foydali"] = ~d.section_name.str.lower().isin(self.FOYDASIZ)

        tok = d.matn.str.len() / 4
        print(f"  {len(d)} qator · o'rt {int(tok.mean())} tok · "
              f"kesilgan {int((tok > self.model.max_seq_length).sum())}"
              f"/{len(d)}")
        self.df = d
        return d

    # ───────────────────────── indekslash
    @staticmethod
    def _toza(m):
        o = {}
        for k, v in m.items():
            if v is None or (isinstance(v, float) and v != v):
                o[k] = ""
            elif isinstance(v, (str, int, float, bool)):
                o[k] = v
            else:
                o[k] = str(v)
        return o

    @staticmethod
    def _xesh(s):
        return hashlib.md5(s.encode("utf-8")).hexdigest()[:16]

    def _vektor(self, matnlar, hajm=32):
        A = self.model.encode(list(matnlar), batch_size=hajm,
                              show_progress_bar=False)
        return norm(A)

    def indeksla(self, hajm=100):
        d = self.df
        metalar = [{"course_name": r.course_name[:80],
                    "section_name": r.section_name[:80],
                    "course_technology": r.course_technology,
                    "course_id": int(r.course_id),
                    "foydali": bool(r.foydali),
                    "_model": self.model_nomi,
                    "_xesh": self._xesh(r.matn)}
                   for _, r in d.iterrows()]
        A = self._vektor(d.matn.tolist())

        ids, matnlar = d.unique_id.tolist(), d.matn.tolist()
        for b in range(0, len(ids), hajm):
            s = slice(b, b + hajm)
            if self.turi == "pinecone":
                self.idx.upsert(vectors=[
                    {"id": i, "values": list(map(float, v)),
                     "metadata": self._toza(m)}
                    for i, v, m in zip(ids[s], A[s], metalar[s])])
            else:
                self.idx.upsert(
                    ids=ids[s],
                    embeddings=[list(map(float, v)) for v in A[s]],
                    documents=matnlar[s],
                    metadatas=[self._toza(m) for m in metalar[s]])
        n = self.soni()
        print(f"  ✅ {n}/{len(ids)} vektor")
        assert n == len(ids), "💥 TO'LIQ YUKLANMADI"
        return n

    def soni(self):
        return (self.idx.describe_index_stats()["total_vector_count"]
                if self.turi == "pinecone" else self.idx.count())

    # ───────────────────────── chegara
    def chegara_oz(self, bor_savollar, yoq_savollar):
        bor = [self._xom(s, 1)[0]["ball"] for s in bor_savollar]
        yoq = [self._xom(s, 1)[0]["ball"] for s in yoq_savollar]
        oraliq = min(bor) - max(yoq)
        if oraliq <= 0:
            print(f"  💥 ORALIQ MANFIY ({oraliq:.4f}) — MODEL YARAMAYDI")
            return None
        self.chegara = round((min(bor) + max(yoq)) / 2, 4)
        print(f"  BOR o'rt {np.mean(bor):.4f} · "
              f"YO'Q o'rt {np.mean(yoq):.4f}")
        print(f"  🏆 CHEGARA {self.chegara} (oraliq {oraliq:.4f})")
        return self.chegara

    # ───────────────────────── qidiruv
    def _xom(self, savol, k, filtr=None):
        q = self._vektor([savol])[0]
        if self.turi == "pinecone":
            r = self.idx.query(vector=list(map(float, q)), top_k=k,
                               include_metadata=True, filter=filtr)
            return [{"id": m["id"], "ball": float(m["score"]),
                     "meta": m.get("metadata", {})} for m in r["matches"]]
        r = self.idx.query(query_embeddings=[list(map(float, q))],
                           n_results=k, where=filtr)
        return [{"id": i, "ball": 1 - dd, "meta": m}       # ⭐ masofa→ball
                for i, dd, m in zip(r["ids"][0], r["distances"][0],
                                    r["metadatas"][0])]

    def qidir(self, savol, k=12, texnologiya=None, jazo=0.85):
        """🏆 Chegarali · filtrli · kursga guruhlangan qidiruv."""
        if self.chegara is None:
            raise RuntimeError("💥 avval chegara_oz() ni chaqiring")

        filtr = {"course_technology": texnologiya} if texnologiya else None
        xom = self._xom(savol, k, filtr)

        # ⭐ foydasiz bo'limlarga jazo (o'chirmaydi — pastga tushiradi)
        for x in xom:
            if not x["meta"].get("foydali", True):
                x["ball"] *= jazo

        mos = [x for x in xom if x["ball"] >= self.chegara]
        if not mos:
            self._log_topilmadi(savol, xom[0]["ball"] if xom else 0)
            return []

        kurslar = {}
        for x in sorted(mos, key=lambda i: -i["ball"]):
            n = x["meta"]["course_name"]
            if n not in kurslar:
                kurslar[n] = {"ball": round(x["ball"], 4), "bolimlar": []}
            kurslar[n]["bolimlar"].append(x["meta"]["section_name"])
        return [{"kurs": n, **d} for n, d in
                sorted(kurslar.items(), key=lambda i: -i[1]["ball"])]

    @staticmethod
    def _log_topilmadi(savol, eng):
        """⭐ Bepul tadqiqot: katalogda nima yetishmayotgani."""
        with open("topilmadi.log", "a", encoding="utf-8") as f:
            f.write(f"{savol}\t{eng:.4f}\n")

    def chop(self, savol, **kw):
        r = self.qidir(savol, **kw)
        if not r:
            print(f"\n❌ '{savol}' — mos kurs topilmadi")
            return
        print(f"\n🔎 '{savol}' — {len(r)} kurs")
        for x in r:
            print(f"  {x['ball']:.4f}  {x['kurs']}")
            for b in x["bolimlar"][:3]:
                print(f"            +-- {b}")
```

### ▶️ Ishga tushirish

```python
BOR = ["regression in Python", "clustering in Python", "SQL joins",
       "deep learning neural networks", "data visualization Tableau",
       "time series forecasting", "web scraping", "credit risk"]
YOQ = ["how to cook pasta", "weather in Tashkent", "football scores",
       "buy a used car", "history of Rome", "yoga for beginners"]

x = KursQidiruvXizmati()
x.tayyorla()
x.indeksla()
x.chegara_oz(BOR, YOQ)

for s in ["regression in Python", "SQL joins", "neural networks",
          "how to cook pasta"]:
    x.chop(s)

x.chop("regression", texnologiya="python")
```

```
✅ chroma · kurslar-v1 · 384 o'lcham
  680 qator · o'rt 313 tok · kesilgan 351/680
  ✅ 680/680 vektor
  BOR o'rt 0.6552 · YO'Q o'rt 0.1757
  🏆 CHEGARA 0.3758 (oraliq 0.3136)

🔎 'regression in Python' — 4 kurs
  0.7435  Machine Learning in Python
            +-- Linear Regression with sklearn
            ...
❌ 'how to cook pasta' — mos kurs topilmadi
```

> ## 🏆 **NIMA O'RGANDINGIZ:**
> ```
> ⭐ chegara — TAXMIN emas, sinov to'plamida O'LCHANADI
> ⭐ foydasiz bo'limlar — o'chirilmaydi, JAZO oladi
> ⭐ natijalar kurs bo'yicha GURUHLANADI
> ⭐ topilmagan so'rovlar LOGGA yoziladi  ← bepul tadqiqot
> ⭐ Pinecone/Chroma — bir xil kod
> ```

---

# 🔄 2-loyiha. Xeshli sinxronlovchi (arvohsiz indeks)

> **Maqsad:** har kecha `cron` bilan ishlasin, **faqat o'zgarganini** vektorlasin, **o'chirilganini** bazadan olib tashlasin.

```python
class Sinxronlovchi:
    """🏆 Idempotent indekslash: QO'SHISH + YANGILASH + O'CHIRISH."""

    def __init__(self, xizmat):
        self.x = xizmat

    def _bazadagi_xeshlar(self, ids):
        if self.x.turi == "chroma":
            d = self.x.idx.get(include=["metadatas"])
            return {i: (m or {}).get("_xesh", "")
                    for i, m in zip(d["ids"], d["metadatas"])}
        eski = {}
        for b in range(0, len(ids), 100):
            r = self.x.idx.fetch(ids=list(ids[b:b + 100]))
            for i, v in r.get("vectors", {}).items():
                eski[i] = v.get("metadata", {}).get("_xesh", "")
        return eski

    def sinxronla(self, df, hajm=100, quruq=False):
        ids = df.unique_id.tolist()
        yangi = {r.unique_id: self.x._xesh(r.matn)
                 for _, r in df.iterrows()}
        eski = self._bazadagi_xeshlar(ids)

        qoshish = [i for i in ids if i not in eski]
        yangilash = [i for i in ids
                     if i in eski and eski[i] != yangi[i]]
        ochirish = [i for i in eski if i not in yangi]
        ozgarmagan = len(ids) - len(qoshish) - len(yangilash)

        print(f"  ➕ {len(qoshish):5d}  🔄 {len(yangilash):5d}  "
              f"➖ {len(ochirish):5d}  ⏭️ {ozgarmagan:5d}")

        if quruq:
            print("  🔍 QURUQ ISHGA TUSHIRISH — hech narsa o'zgarmadi")
            return {"q": len(qoshish), "y": len(yangilash),
                    "o": len(ochirish), "z": ozgarmagan}

        ishlash = set(qoshish) | set(yangilash)
        if ishlash:
            kichik = df[df.unique_id.isin(ishlash)].copy()
            eski_df, self.x.df = self.x.df, kichik
            self.x.indeksla(hajm=hajm)
            self.x.df = eski_df

        if ochirish:
            # ⚠️ himoya: bir marta 50% dan ko'pini o'chirmaslik
            if len(ochirish) > len(eski) * 0.5:
                print(f"  💥 XAVFSIZLIK: {len(ochirish)}/{len(eski)} "
                      f"o'chirilmoqchi — TO'XTATILDI")
                print("     manba fayl to'liq yuklanganini tekshiring")
                return None
            for b in range(0, len(ochirish), 1000):
                self.x.idx.delete(ids=ochirish[b:b + 1000])
            print(f"  🗑️ {len(ochirish)} o'chirildi")

        print(f"  ✅ bazada {self.x.soni()}")
        return {"q": len(qoshish), "y": len(yangilash),
                "o": len(ochirish), "z": ozgarmagan}

    def arvoh_tekshir(self, df):
        if self.x.turi != "chroma":
            return None
        bazada = set(self.x.idx.get()["ids"])
        arvoh = bazada - set(df.unique_id)
        yetishmas = set(df.unique_id) - bazada
        belgi = "✅" if not (arvoh or yetishmas) else "💥"
        print(f"  {belgi} bazada {len(bazada)} · arvoh {len(arvoh)} · "
              f"yetishmas {len(yetishmas)}")
        return arvoh, yetishmas
```

### ▶️ Ishga tushirish

```python
s = Sinxronlovchi(x)

print("① birinchi")
s.sinxronla(x.df)

print("② qayta — hech narsa o'zgarmagan")
s.sinxronla(x.df)

print("③ QURUQ — 2 tasi olib tashlansa nima bo'ladi?")
s.sinxronla(x.df.iloc[:678], quruq=True)

print("④ haqiqiy")
s.sinxronla(x.df.iloc[:678])
s.arvoh_tekshir(x.df.iloc[:678])
```

```
① ➕   680  🔄     0  ➖     0  ⏭️     0    ✅ bazada 680
② ➕     0  🔄     0  ➖     0  ⏭️   680    ✅ bazada 680
③ ➕     0  🔄     0  ➖     2  ⏭️   678    🔍 QURUQ
④ ➕     0  🔄     0  ➖     2  ⏭️   678    ✅ bazada 678
   ✅ bazada 678 · arvoh 0 · yetishmas 0
```

> ## 🏆 **UCHTA HIMOYA MEXANIZMI:**
> ```
> ⭐ quruq=True       →  o'zgarishni OLDIN ko'rasiz
> ⭐ 50% qoidasi      →  💥 manba fayl buzilgan bo'lsa TO'XTAYDI
> ⭐ arvoh_tekshir()  →  sinxronlashdan keyin TASDIQ
> ```
>
> ## 💥 **"50% QOIDASI" — HAQIQIY HAYOTDAN.** ## CSV yarim yuklansa yoki filtr xato ishlasa — ## sinxronlovchi **butun bazani o'chirib** yuborishi mumkin.

---

# 🧪 3-loyiha. Model va matn tanlash laboratoriyasi

> **Maqsad:** *"Qaysi model? Qaysi matn tartibi? Qaysi chegara?"* — ## ⭐ **taxmin qilmang, o'lchang.**

```python
class QidiruvLaboratoriyasi:
    """🔬 Model × matn varianti × chegara — hammasi bir jadvalda."""

    def __init__(self, df, sinovlar, yoq_savollar):
        self.df, self.sinovlar, self.yoq = df, sinovlar, yoq_savollar
        self.natijalar = []

    def sina(self, model_nomi, variant_nomi, matn_f,
             prefiks_hujjat="", prefiks_savol=""):
        t0 = time.perf_counter()
        m = SentenceTransformer(model_nomi)
        yuk = time.perf_counter() - t0

        matnlar = self.df.apply(lambda r: tozala(matn_f(r)),
                                axis=1).tolist()
        t0 = time.perf_counter()
        A = m.encode([prefiks_hujjat + t for t in matnlar],
                     batch_size=32, show_progress_bar=False)
        emb = time.perf_counter() - t0
        A = A / np.linalg.norm(A, axis=1, keepdims=True)

        togri, mos = 0, []
        for savol, kutilgan in self.sinovlar:
            q = m.encode(prefiks_savol + savol)
            q = q / np.linalg.norm(q)
            b = A @ q
            i = int(np.argmax(b))
            mos.append(float(b[i]))
            togri += int(kutilgan.lower()
                         in str(self.df.iloc[i].course_name).lower())

        nomos = []
        for s in self.yoq:
            q = m.encode(prefiks_savol + s)
            q = q / np.linalg.norm(q)
            nomos.append(float((A @ q).max()))

        oraliq = min(mos) - max(nomos)
        tok = pd.Series(matnlar).str.len() / 4
        nrm = float(np.linalg.norm(m.encode("x")))

        self.natijalar.append({
            "model": model_nomi.split("/")[-1][:24],
            "variant": variant_nomi[:16],
            "olcham": A.shape[1], "maks_tok": m.max_seq_length,
            "norma_1": "✅" if abs(nrm - 1) < 0.01 else "💥",
            "togri": togri,
            "aniqlik": f"{togri}/{len(self.sinovlar)}",
            "ajratish": round(float(np.mean(mos) - np.mean(nomos)), 4),
            "chegara": round((min(mos) + max(nomos)) / 2, 4)
            if oraliq > 0 else None,
            "oraliq": round(oraliq, 4),
            "kesilgan_%": round(float((tok > m.max_seq_length).mean()) * 100),
            "emb_s": round(emb, 1), "yuk_s": round(yuk, 1),
        })
        return self.natijalar[-1]

    def jadval(self):
        d = (pd.DataFrame(self.natijalar)
             .sort_values(["togri", "oraliq"], ascending=False))
        print(d.drop(columns=["togri"]).to_string(index=False))

        yaroqli = d[d.oraliq > 0]
        if len(yaroqli) == 0:
            print("\n💥 HECH BIR KOMBINATSIYA YARAMADI")
            return d
        eng = yaroqli.iloc[0]
        print(f"\n🏆 TAVSIYA: {eng.model} + {eng.variant}")
        print(f"   aniqlik {eng.aniqlik} · chegara {eng.chegara} "
              f"· oraliq {eng.oraliq} · {eng.emb_s}s")

        # ⭐ eng tez YAROQLI variant ham qiziq
        tez = yaroqli.sort_values("emb_s").iloc[0]
        if tez.model != eng.model:
            print(f"   ⚡ eng tez yaroqli: {tez.model} "
                  f"({tez.aniqlik}, {tez.emb_s}s)")
        return d
```

### ▶️ Ishga tushirish

```python
VARIANTLAR = {
    "kurs tartibi": lambda r: (f'{r.course_name} {r.course_technology} '
                               f'{r.course_description} {r.section_name} '
                               f'{r.section_description}'),
    "bo'lim oldin": lambda r: (f'{r.section_name}. {r.course_name}. '
                               f'{r.course_technology}. '
                               f'{r.section_description}'),
    "jumla": lambda r: (f"The course name is {r.course_name}, the "
                        f"technology is {r.course_technology}, the "
                        f"section is {r.section_name}: "
                        f"{r.section_description}"),
}

lab = QidiruvLaboratoriyasi(x.df, list(zip(BOR, [
    "Machine Learning in Python", "Customer Analytics in Python", "SQL",
    "Deep Learning with TensorFlow", "Introduction to Tableau",
    "Time Series Analysis", "Web Scraping", "Credit Risk Modeling"])), YOQ)

for mn in ["all-MiniLM-L6-v2", "all-mpnet-base-v2"]:
    for vn, vf in VARIANTLAR.items():
        print(f"⏳ {mn} + {vn} ...")
        lab.sina(mn, vn, vf)

lab.jadval()
```

### 🇺🇿 O'zbekcha variant

```python
UZ_SINOV = [
    ("Python da regressiya",                "Machine Learning in Python"),
    ("SQL jadvallarni birlashtirish",       "SQL"),
    ("ma'lumotlarni vizualizatsiya qilish", "Tableau"),
    ("chuqur o'rganish neyron tarmoq",      "Deep Learning"),
    ("veb sahifadan ma'lumot yig'ish",      "Web Scraping"),
]
UZ_YOQ = ["osh qanday pishiriladi", "Toshkentda ob-havo",
          "futbol natijalari", "avtomobil sotib olish"]

uz_lab = QidiruvLaboratoriyasi(x.df, UZ_SINOV, UZ_YOQ)
uz_lab.sina("all-MiniLM-L6-v2", "kurs tartibi",
            VARIANTLAR["kurs tartibi"])
uz_lab.sina("paraphrase-multilingual-MiniLM-L12-v2", "kurs tartibi",
            VARIANTLAR["kurs tartibi"])
uz_lab.jadval()
```

> ## 🏆🏆 **BU LABORATORIYA — MODULNING ENG QIMMATLI NATIJASI.**
>
> ## ⭐ **U TO'RTTA SAVOLGA BIRDANIGA JAVOB BERADI:**
> ```
> ① qaysi model?          →  aniqlik + ajratish
> ② qaysi matn tartibi?   →  aniqlik + kesilgan_%
> ③ chegara qancha?       →  o'lchangan, taxmin emas
> ④ oraliq musbatmi?      →  💥 manfiy bo'lsa MODEL YARAMAYDI
> ```
>
> ## 💥 **`chegara = None` CHIQSA** — ## bu **eng muhim signal**: ## o'sha model+matn **umuman ishlamaydi**, ## chegarani **qanday tanlasangiz ham**.
>
> ## ⭐ **VA `prefiks_hujjat` / `prefiks_savol`** — ## `e5` oilasi uchun:
> ```python
> lab.sina("intfloat/multilingual-e5-large", "kurs tartibi",
>          VARIANTLAR["kurs tartibi"],
>          prefiks_hujjat="passage: ", prefiks_savol="query: ")
> ```

---

## 📌 Uch loyihaning bog'lanishi

```
① KursQidiruvXizmati   →  ishlab chiqarish uchun QIDIRUV
② Sinxronlovchi        →  bazani TOZA saqlaydi (arvohsiz)
③ QidiruvLaboratoriyasi →  ① uchun MODEL va CHEGARANI tanlaydi

⭐ TO'G'RI TARTIB:  ③  →  ①  →  ② (har kecha cron)
```

> ## 🏆 **KO'PCHILIK ① DAN BOSHLAYDI VA ③ NI HECH QACHON QILMAYDI.** ## Natijada — **taxmin qilingan model**, **taxmin qilingan chegara**, ## va nima uchun natijalar yomonligini **hech kim bilmaydi**.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
