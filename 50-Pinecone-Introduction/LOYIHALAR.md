# 🚀 50-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham API kalitisiz** — va **Pinecone bilan ham ishlaydi**.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install chromadb sentence-transformers pandas numpy
# ixtiyoriy: pip install pinecone python-dotenv
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, json, shutil, itertools, math
from pathlib import Path
from contextlib import contextmanager
import numpy as np, pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer

BOLIMLAR = "../51-Semantic-Search-Case-Study/course_section_descriptions.csv"


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
```

---

# 🔌 1-loyiha. Universal vektor baza adapteri

> **Maqsad:** bitta kod — **Pinecone**, **Chroma** yoki **numpy** bilan ishlasin. Kalit bo'lsa bulut, bo'lmasa mahalliy.

```python
class VektorBaza:
    """☁️ Pinecone · ⭐ Chroma · 🔢 numpy — BIR XIL interfeys.

    Uchala backendda ham:
      yoz(ids, vektorlar, metadata)  →  yozilgan soni
      qidir(vektor, k, filtr)        →  [(id, O'XSHASHLIK, metadata), ...]
    """

    def __init__(self, nom="my-index", olcham=384, metrika="cosine",
                 model_nomi=None, yol="./vdb", majburiy=None):
        self.nom, self.olcham, self.metrika = nom, olcham, metrika
        self.model_nomi = model_nomi
        self.stat = {"yozildi": 0, "qidiruv": 0, "qidiruv_ms": 0.0}

        tur = majburiy or ("pinecone" if os.getenv("PINECONE_API_KEY")
                           else "chroma")

        if tur == "pinecone":
            self._pinecone_init()
        elif tur == "chroma":
            self._chroma_init(yol)
        else:
            self._numpy_init()

    # ══════ BACKENDLAR ══════

    def _pinecone_init(self):
        from pinecone import Pinecone, ServerlessSpec
        self.tur = "pinecone"
        self.pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        mavjud = {i.name: i for i in self.pc.list_indexes()}

        if self.nom in mavjud:
            i = mavjud[self.nom]
            if i.dimension != self.olcham:
                raise RuntimeError(f"💥 '{self.nom}' o'lchami {i.dimension}, "
                                   f"kerak {self.olcham}")
            if i.metric != self.metrika:
                print(f"⚠️ metrika: baza '{i.metric}', "
                      f"kutilgan '{self.metrika}'")
        else:
            self.pc.create_index(
                name=self.nom, dimension=self.olcham, metric=self.metrika,
                spec=ServerlessSpec(cloud="aws", region="us-east-1"))
            t0 = time.time()
            while not self.pc.describe_index(self.nom).status["ready"]:
                if time.time() - t0 > 60:
                    print("⚠️ 60s ichida tayyor bo'lmadi")
                    break
                time.sleep(2)
        self.index = self.pc.Index(self.nom)
        print(f"☁️ Pinecone: {self.nom} ({self.olcham}, {self.metrika})")

    def _chroma_init(self, yol):
        self.tur = "chroma"
        self.client = chromadb.PersistentClient(path=yol)
        meta = {"hnsw:space": self.metrika, "olcham": self.olcham}
        if self.model_nomi:
            meta["model"] = self.model_nomi
        self.index = self.client.get_or_create_collection(self.nom,
                                                          metadata=meta)
        # ⭐ MODEL MOSLIGI — eng muhim tekshiruv
        m = (self.index.metadata or {}).get("model")
        if self.model_nomi and m and m != self.model_nomi:
            raise RuntimeError(
                f"💥 MODEL MOS EMAS: baza '{m}', hozir '{self.model_nomi}'\n"
                f"   → indeksni QAYTA quring yoki boshqa nom bering")
        print(f"⭐ Chroma: {self.nom} ({self.metrika}) · "
              f"{self.index.count()} vektor")

    def _numpy_init(self):
        self.tur = "numpy"
        self.E = np.zeros((0, self.olcham), dtype="float32")
        self.ids, self.meta = [], []
        print(f"🔢 numpy: {self.nom} ({self.olcham}, kosinus)")

    # ══════ METADATA TOZALASH ══════

    @staticmethod
    def _toza(d):
        """Chroma va Pinecone'da ham ishlaydigan metadata."""
        r = {}
        for k, v in (d or {}).items():
            if v is None or (isinstance(v, float) and v != v):
                r[k] = ""
            elif isinstance(v, (str, int, float, bool)):
                r[k] = v
            elif isinstance(v, (list, tuple, set)):
                r[k] = ",".join(map(str, v))
            else:
                r[k] = str(v)
        return r

    # ══════ YOZISH ══════

    def yoz(self, ids, vektorlar, metadata=None, batch=1000, verbose=False):
        ids = [str(x) for x in ids]
        n = len(ids)

        noyob = len(set(ids))
        if noyob < n:
            print(f"⚠️ {n - noyob} takroriy ID — ular BIR-BIRINI yozib yuboradi")

        olchamlar = {len(v) for v in vektorlar}
        if len(olchamlar) > 1:
            raise ValueError(f"💥 vektor o'lchamlari har xil: {olchamlar}")
        if self.olcham not in olchamlar:
            raise ValueError(f"💥 o'lcham {olchamlar.pop()}, "
                             f"kutilgan {self.olcham}")

        t0 = time.perf_counter()
        yozildi = 0
        for i in range(0, n, batch):
            j = min(i + batch, n)
            v = [list(map(float, x)) for x in vektorlar[i:j]]
            m = [self._toza(x) for x in metadata[i:j]] if metadata else None

            if self.tur == "pinecone":
                self.index.upsert(
                    vectors=list(zip(ids[i:j], v, m or [{}] * (j - i))))
            elif self.tur == "chroma":
                self.index.upsert(ids=ids[i:j], embeddings=v, metadatas=m)
            else:
                A = np.array(v, dtype="float32")
                A /= np.linalg.norm(A, axis=1, keepdims=True)
                self.E = np.vstack([self.E, A])
                self.ids += ids[i:j]
                self.meta += (m or [{}] * (j - i))
            yozildi += j - i
            if verbose:
                print(f"  {j:,}/{n:,}")

        o = time.perf_counter() - t0
        self.stat["yozildi"] += yozildi
        print(f"✅ {yozildi:,} vektor · {o:.1f}s · {yozildi/max(o,1e-9):.0f}/s")
        return yozildi

    # ══════ QIDIRUV ══════

    def qidir(self, vektor, k=5, filtr=None):
        v = list(map(float, vektor))
        t0 = time.perf_counter()

        if self.tur == "pinecone":
            r = self.index.query(vector=v, top_k=k, include_metadata=True,
                                 filter=filtr)
            natija = [(m["id"], float(m["score"]), m.get("metadata", {}))
                      for m in r["matches"]]
        elif self.tur == "chroma":
            r = self.index.query(query_embeddings=[v], n_results=k,
                                 where=filtr)
            natija = [(r["ids"][0][i], 1 - r["distances"][0][i],
                       (r["metadatas"][0][i] if r.get("metadatas") else {}))
                      for i in range(len(r["ids"][0]))]
        else:
            q = np.array(v, dtype="float32")
            q /= np.linalg.norm(q)
            ballar = self.E @ q
            if filtr:
                mask = np.array([all(mm.get(kk) == vv
                                     for kk, vv in filtr.items())
                                 for mm in self.meta])
                ballar = np.where(mask, ballar, -np.inf)
            top = np.argsort(-ballar)[:k]
            natija = [(self.ids[i], float(ballar[i]), self.meta[i])
                      for i in top if ballar[i] > -np.inf]

        ms = (time.perf_counter() - t0) * 1000
        self.stat["qidiruv"] += 1
        self.stat["qidiruv_ms"] += ms
        return natija

    # ══════ STATISTIKA ══════

    def soni(self):
        if self.tur == "pinecone":
            return self.index.describe_index_stats().get(
                "total_vector_count", 0)
        if self.tur == "chroma":
            return self.index.count()
        return len(self.ids)

    def hisobot(self):
        n = self.soni()
        print(f"\n📊 {self.nom} ({self.tur})")
        print(f"   vektorlar : {n:,}")
        print(f"   o'lcham   : {self.olcham} · metrika {self.metrika}")
        if self.model_nomi:
            print(f"   model     : {self.model_nomi}")
        if self.stat["qidiruv"]:
            ort = self.stat["qidiruv_ms"] / self.stat["qidiruv"]
            print(f"   qidiruv   : {self.stat['qidiruv']} ta · "
                  f"o'rtacha {ort:.2f} ms")
            if self.tur == "pinecone":
                print(f"   💡 mahalliy bazada bu ~1 ms bo'lardi "
                      f"({ort/1:.0f}× farq)")
        gb = n * self.olcham * 4 / 1024**3
        print(f"   hajm      : {gb*1024:.1f} MB (f32)")
        if gb > 4:
            print("   ⚠️ 4 GB dan oshdi — kvantlash yoki diskli indeks")
        return self.stat


# ═══ SINOV: uchala backend bir xil natija berishi kerak ═══
b = pd.read_csv(BOLIMLAR, encoding="cp1252")
b["uid"] = b.course_id.astype(str) + "-" + b.section_id.astype(str)
b["matn"] = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1)

model = SentenceTransformer("all-MiniLM-L6-v2")
E = model.encode(b.matn.tolist(), show_progress_bar=False, batch_size=64)
meta = [{"course_name": r.course_name[:60],
         "section_name": r.section_name[:60],
         "technology": r.course_technology}
        for _, r in b.iterrows()]

SOROV = "regression in Python"
qv = model.encode(SOROV)

shutil.rmtree("./vdb-adapter", ignore_errors=True)
natijalar = {}
for backend in ["numpy", "chroma"]:
    print(f"\n═══ {backend.upper()} ═══")
    db = VektorBaza("kurslar-minilm-v1", olcham=384,
                    model_nomi="all-MiniLM-L6-v2", yol="./vdb-adapter",
                    majburiy=backend)
    db.yoz(b.uid.tolist(), E, meta)
    r = db.qidir(qv, k=3)
    natijalar[backend] = r
    for uid, ball, m in r:
        print(f"  {ball:.4f}  {uid:>9s}  {m['course_name'][:34]}")
    db.hisobot()

# ── ⭐ backendlar bir xil javob berdimi? ──
print("\n═══ TAQQOSLASH ═══")
n_ids = {k: [x[0] for x in v] for k, v in natijalar.items()}
bir_xil = len(set(map(tuple, n_ids.values()))) == 1
print(f"{'✅' if bir_xil else '💥'} backendlar {'bir xil' if bir_xil else 'HAR XIL'} "
      f"natija berdi")
for k, v in n_ids.items():
    print(f"   {k:8s} {v}")
if bir_xil:
    ballar = {k: round(v[0][1], 4) for k, v in natijalar.items()}
    print(f"   ballar: {ballar}")
```

> ## 🏆 **UCH BACKEND, BITTA INTERFEYS:**
> ```
> ☁️ pinecone  →  bulut, API kaliti kerak
> ⭐ chroma    →  mahalliy, disk, bepul
> 🔢 numpy     →  RAM, eng tez, < 100 000 vektor uchun
> ```
>
> ## 💥 **VA ENG MUHIM HIMOYA — MODEL MOSLIGI:**
> ```python
> if self.model_nomi and m and m != self.model_nomi:
>     raise RuntimeError(f"💥 MODEL MOS EMAS: baza '{m}', hozir '{...}'")
> ```
> Usiz — **o'lcham mos**, **xato chiqmaydi**, lekin **natijalar ma'nosiz**.
>
> ## ⭐ **`majburiy=` PARAMETRI — TESTLAR UCHUN.** CI'da `majburiy="numpy"` bilan **hech qanday bog'liqliksiz** sinaysiz.

---

# 📥 2-loyiha. Oqimli indekslovchi va tashxis

> **Maqsad:** millionlab hujjatni **doimiy xotirada** indekslash, va **jim ma'lumot yo'qolishini** aniqlash.

```python
class OqimliIndekslovchi:
    """Oqimli · bo'laklash · progress · qayta urinish · TO'LIQ TASHXIS."""

    def __init__(self, db, model, batch=500, emb_batch=64,
                 bolak_hajmi=None, bolak_ustma=80, qayta=2):
        self.db = db
        self.model = model
        self.batch, self.emb_batch = batch, emb_batch
        self.qayta = qayta
        self.maks_token = getattr(model, "max_seq_length", 256)

        self.bolakchi = None
        if bolak_hajmi:
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            self.bolakchi = RecursiveCharacterTextSplitter(
                chunk_size=bolak_hajmi, chunk_overlap=bolak_ustma)

        self.stat = {}

    def _parchala(self, matn):
        return self.bolakchi.split_text(matn) or [matn] \
            if self.bolakchi else [matn]

    # ══════ ASOSIY ══════

    def ishga_tushir(self, manba, jami_kerak=10000, verbose=True):
        it = iter(manba)
        yozildi = oqilgan = kesilgan = 0
        xatolar, uzunliklar, idlar = [], [], set()
        t0 = time.perf_counter()

        while yozildi < jami_kerak:
            qism = list(itertools.islice(it, self.batch))
            if not qism:
                if verbose:
                    print("⚠️ manba tugadi")
                break
            oqilgan += len(qism)

            ids, matnlar, meta = [], [], []
            for x in qism:
                xom = str(x["text"])
                uzunliklar.append(len(xom))
                if not self.bolakchi and len(xom) / 4 > self.maks_token:
                    kesilgan += 1
                for k, p in enumerate(self._parchala(xom)):
                    uid = f"{x['id']}-{k}" if self.bolakchi else str(x["id"])
                    if uid in idlar:
                        continue                      # ⭐ takrorni o'tkazamiz
                    idlar.add(uid)
                    ids.append(uid)
                    matnlar.append(p)
                    m = {kk: vv for kk, vv in x.items()
                         if kk not in ("text",)}
                    m["bolak"] = k
                    meta.append(m)

            if not ids:
                continue

            xato = None
            for urinish in range(self.qayta + 1):
                try:
                    E = self.model.encode(matnlar, batch_size=self.emb_batch,
                                          show_progress_bar=False)
                    self.db.yoz(ids, E, meta, verbose=False)
                    yozildi += len(ids)
                    xato = None
                    break
                except Exception as e:
                    xato = f"{type(e).__name__}: {str(e)[:56]}"
                    if urinish < self.qayta:
                        time.sleep(2 ** urinish)

            if xato:
                xatolar.append({"oqilgan": oqilgan, "xato": xato})
                if verbose:
                    print(f"  💥 [{oqilgan}] {xato}")
                continue

            if verbose:
                o = time.perf_counter() - t0
                qolgan = (jami_kerak - yozildi) / max(yozildi, 1) * o
                print(f"  {yozildi:7,}/{jami_kerak:,}  "
                      f"({min(yozildi/jami_kerak,1):5.1%})  {o:5.1f}s  "
                      f"{yozildi/max(o,1e-9):5.0f}/s  ~{qolgan:.0f}s qoldi")

        o = time.perf_counter() - t0
        self.stat = {
            "yozildi": yozildi, "oqilgan": oqilgan,
            "bolak_nisbati": round(yozildi / max(oqilgan, 1), 2),
            "kesilgan": kesilgan,
            "ort_belgi": int(np.mean(uzunliklar)) if uzunliklar else 0,
            "maks_belgi": int(np.max(uzunliklar)) if uzunliklar else 0,
            "xatolar": len(xatolar), "soniya": round(o, 1),
            "tezlik": round(yozildi / max(o, 1e-9))}
        self.tashxis()
        return self.stat

    # ══════ TASHXIS ══════

    def tashxis(self, kunlik_sorov=1000):
        s = self.stat
        print(f"\n{'═' * 56}")
        print(f"{'✅' if not s['xatolar'] else '⚠️'} "
              f"{s['yozildi']:,} vektor · {s['oqilgan']:,} manba yozuvi · "
              f"{s['soniya']}s · {s['tezlik']}/s")

        print(f"\n📏 MATN")
        print(f"   o'rtacha {s['ort_belgi']:,} belgi "
              f"(~{s['ort_belgi']//4} token)")
        print(f"   maksimal {s['maks_belgi']:,} belgi "
              f"(~{s['maks_belgi']//4} token)")
        print(f"   model chegarasi: {self.maks_token} token")

        if self.bolakchi:
            print(f"   ⭐ bo'laklash: {s['bolak_nisbati']} bo'lak/hujjat")
        elif s["kesilgan"]:
            ulush = s["kesilgan"] / max(s["oqilgan"], 1)
            print(f"\n💥 {s['kesilgan']:,} hujjat ({ulush:.0%}) "
                  f"CHEGARADAN OSHDI")
            print("   → matnning oxirgi qismi JIMGINA TASHLANADI")
            print("   → hech qanday ogohlantirish YO'Q")
            print("   ✅ bolak_hajmi=800 bilan qayta ishga tushiring")
        else:
            print("   ✅ hech bir hujjat chegaradan oshmadi")

        if s["xatolar"]:
            print(f"\n💥 {s['xatolar']} batch yozilmadi — "
                  f"MA'LUMOT TO'LIQ EMAS")

        # ── ⏱️ va 💰 bashorat ──
        print(f"\n⏱️ MIQYOS BASHORATI ({s['tezlik']}/s tezlikda)")
        for n in (100_000, 1_000_000, 10_000_000):
            soat = n / max(s["tezlik"], 1) / 3600
            belgi = "💥" if soat > 24 else ("⚠️" if soat > 4 else "  ")
            print(f"   {belgi} {n:>10,} vektor → {soat:6.1f} soat")

        tok = s["yozildi"] * (s["ort_belgi"] / 4)
        print(f"\n💰 AGAR API EMBEDDING ISHLATILSA")
        print(f"   hozirgi hajm ({tok/1e6:.2f}M token):")
        print(f"     text-embedding-3-small: ${tok/1e6*0.02:.4f}")
        print(f"     text-embedding-3-large: ${tok/1e6*0.13:.4f}")
        print(f"     ⭐ mahalliy            : $0")

        gb = s["yozildi"] * self.db.olcham * 4 / 1024**3
        print(f"\n💾 SAQLASH: {gb*1024:.1f} MB (f32, {self.db.olcham} o'lcham)")
        return s


# ─── manba: katta CSV faylni oqimli o'qish ───
def csv_oqim(yol, encoding="cp1252", chunksize=200):
    """⭐ 10 GB CSV ham RAMni to'ldirmaydi."""
    for qism in pd.read_csv(yol, encoding=encoding, chunksize=chunksize):
        for _, r in qism.iterrows():
            yield {"id": f"{r.course_id}-{r.section_id}",
                   "text": tozala(r.section_description),
                   "technology": r.course_technology,
                   "course_name": str(r.course_name)[:60]}


model = SentenceTransformer("all-MiniLM-L6-v2")

# ═══ ① BO'LAKLASHSIZ — kesilishni ko'ramiz ═══
print("═══ BO'LAKLASHSIZ ═══")
shutil.rmtree("./vdb-oqim1", ignore_errors=True)
db1 = VektorBaza("bolaklashsiz", olcham=384,
                 model_nomi="all-MiniLM-L6-v2", yol="./vdb-oqim1",
                 majburiy="chroma")
OqimliIndekslovchi(db1, model, batch=200).ishga_tushir(
    csv_oqim(BOLIMLAR), jami_kerak=680, verbose=False)

# ═══ ② BO'LAKLASH BILAN ═══
print("\n\n═══ BO'LAKLASH (800 belgi) ═══")
shutil.rmtree("./vdb-oqim2", ignore_errors=True)
db2 = VektorBaza("bolaklangan", olcham=384,
                 model_nomi="all-MiniLM-L6-v2", yol="./vdb-oqim2",
                 majburiy="chroma")
OqimliIndekslovchi(db2, model, batch=200, bolak_hajmi=800).ishga_tushir(
    csv_oqim(BOLIMLAR), jami_kerak=1500, verbose=False)

# ═══ ③ SIFAT TAQQOSLASH ═══
print("\n\n═══ SIFAT TAQQOSLASH ═══")
SOROVLAR = ["regression in Python", "SQL joins", "deep learning",
            "data visualization with Tableau"]
for s in SOROVLAR:
    qv = model.encode(s)
    r1 = db1.qidir(qv, k=1)
    r2 = db2.qidir(qv, k=1)
    print(f"\n🔍 '{s}'")
    print(f"   bo'laklashsiz : {r1[0][1]:.4f}  "
          f"{r1[0][2].get('course_name', '?')[:34]}")
    print(f"   bo'laklangan  : {r2[0][1]:.4f}  "
          f"{r2[0][2].get('course_name', '?')[:34]}")
```

> ## 🏆 **BESH TASHXIS — HAMMASI AVTOMATIK:**
> ```
> 📏 MATN            →  💥 qancha hujjat chegaradan oshgan
> ⭐ bo'lak nisbati  →  bo'laklash qanchalik ko'paytirgan
> 💥 xato batchlar   →  ma'lumot to'liqmi
> ⏱️ miqyos bashorati →  1M/10M vektor necha soat
> 💰 narx bashorati  →  API bilan qancha bo'lardi
> ```
>
> ## 💥 **"CHEGARADAN OSHDI" — ENG QIMMATLI OGOHLANTIRISH.**
> ```
> Hech qanday xato chiqmaydi
> Indekslash "muvaffaqiyatli" tugaydi
> Lekin matnning yarmi EMBEDDINGGA KIRMAGAN
> → qidiruv sifati JIM ravishda past bo'ladi
> ```
>
> ## ⭐ **`idlar` TO'PLAMI — TAKRORNI O'TKAZIB YUBORADI.** Manba oqimida bir xil `id` ikki marta kelsa — `DuplicateIDError` **bo'lmaydi**.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🔌 **Universal adapter** | Pinecone ↔ Chroma ↔ numpy | ## ⭐ **model mosligi tekshiruvi** |
| 2 | 📥 **Oqimli indekslovchi** | Millionlab hujjat · doimiy xotira | ## 💥 **"chegaradan oshdi" tashxisi** |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
