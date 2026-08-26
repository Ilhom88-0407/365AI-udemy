# 📝 50-modul mashqlari

> **20 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ** — mahalliy Chroma bilan.

## ⚙️ Tayyorgarlik

```bash
pip install chromadb sentence-transformers pandas numpy
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, shutil, itertools, uuid
import numpy as np, pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer

BOLIMLAR = "../51-Semantic-Search-Case-Study/course_section_descriptions.csv"


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
```

---

# 🟢 OSON *(1–7)*

**M1.** Kurs qaysi bazani tanlagan va nima uchun?

**M2.** `dimension` nimaga bog'liq?

**M3.** `metric` ni keyin o'zgartirish mumkinmi?

**M4.** `upsert` nima?

**M5.** Chroma va Pinecone natijasi farqi?

**M6.** `streaming=True` nima qiladi?

**M7.** API kalitini qayerda saqlash kerak?

<details>
<summary>✅ Javoblar M1–M7</summary>

**M1.** ## **Pinecone** — **soddaligi** va **boshqariladigan** bo'lgani uchun.

**M2.** ## **Embedding modeliga** — `all-MiniLM-L6-v2` → **384**.

**M3.** ## ❌ **Yo'q** — indeksni **qayta yaratish** kerak.

**M4.** ## `update` + `insert` — bor bo'lsa yangilanadi.

**M5.** ## Pinecone — ## ⭐ **o'xshashlik**, Chroma — ## 💥 **masofa** *(`1 − masofa`)*.

**M6.** ## Ma'lumotni **qatorma-qator** o'qiydi — diskka **yuklamaydi**.

**M7.** ## `.env` faylda, `.gitignore` da.

</details>

---

# 🟡 O'RTA *(8–15)*

**M8.** ⭐ Indeks yaratish va o'chirish.

<details>
<summary>✅ Yechim</summary>

```python
shutil.rmtree("./vdb-m", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-m")

def royxat():
    return [c.name for c in client.list_collections()]

print("boshlang'ich:", royxat())
for nom, metrika in [("my-index", "cosine"), ("my-index-2", "l2")]:
    if nom in royxat():
        client.delete_collection(nom)
        print(f"  {nom} o'chirildi")
    client.create_collection(nom, metadata={"hnsw:space": metrika})
    print(f"  {nom} yaratildi ({metrika})")
print("hozir:", royxat())
client.delete_collection("my-index-2")
print("keyin:", royxat())
```

</details>

**M9.** ⭐ Nom qoidalarini sinang.

<details>
<summary>✅ Yechim</summary>

```python
for n in ["b", "ab", "my-index", "My_Index.2", "my index",
          "index-", "-index", "a" * 600]:
    try:
        client.create_collection(n)
        print(f"  ✅ {n[:20]!r:24s} yaratildi")
        client.delete_collection(n)
    except Exception as e:
        print(f"  ❌ {n[:20]!r:24s} {type(e).__name__}")
```

```
  ❌ 'b'             (juda qisqa)      ❌ 'my index'   (bo'sh joy)
  ❌ 'ab'            (juda qisqa)      ❌ 'index-'     (oxiri '-')
  ✅ 'my-index'                        ❌ '-index'     (boshi '-')
  ✅ 'My_Index.2'                      ❌ 'aaa...'     (juda uzun)
```

</details>

**M10.** ⭐ Hayvonlarni yozing va qidiring.

<details>
<summary>✅ Yechim</summary>

```python
shutil.rmtree("./vdb-hayvon", ignore_errors=True)
c = chromadb.PersistentClient(path="./vdb-hayvon")
coll = c.create_collection("hayvonlar", metadata={"hnsw:space": "cosine"})
coll.add(ids=["Dog", "Cat", "Chicken", "Mantis", "Elephant"],
         embeddings=[[4., 0., 1.], [4., 0., 1.], [2., 2., 1.],
                     [6., 2., 3.], [4., 0., 1.]],
         metadatas=[{"tur": "uy"}, {"tur": "uy"}, {"tur": "parranda"},
                    {"tur": "hasharot"}, {"tur": "yovvoyi"}])
print("vektorlar:", coll.count())
r = coll.query(query_embeddings=[[4., 0., 1.]], n_results=5)
for i in range(len(r["ids"][0])):
    print(f"  {1 - r['distances'][0][i]:.4f}  {r['ids'][0][i]:10s} "
          f"{r['metadatas'][0][i]}")
```

```
  1.0000  Dog · Cat · Elephant
  0.9355  Mantis
  0.7276  Chicken
```

## 🏆 **49-MODULDAGI QO'LDA HISOB BILAN AYNAN BIR XIL.**

</details>

**M11.** ⭐ Metadata filtri.

<details>
<summary>✅ Yechim</summary>

```python
r = coll.query(query_embeddings=[[4., 0., 1.]], n_results=5,
               where={"tur": "uy"})
print("faqat uy hayvonlari:", r["ids"][0])

r = coll.query(query_embeddings=[[4., 0., 1.]], n_results=5,
               where={"tur": {"$in": ["uy", "yovvoyi"]}})
print("uy yoki yovvoyi:", r["ids"][0])
```

## 🏆 **METADATA FILTRI — QIDIRUV MAYDONINI KESKIN QISQARTIRADI.**

</details>

**M12.** ⭐ Metadata tiplarini sinang.

<details>
<summary>✅ Yechim</summary>

```python
c2 = client.get_or_create_collection("meta-sinov")
SINOVLAR = [("str", {"nom": "Python"}), ("int", {"id": 37}),
            ("float", {"ball": 0.95}), ("bool", {"faol": True}),
            ("list", {"teglar": ["python", "ml"]}),
            ("dict", {"q": {"a": 1}}), ("None", {"izoh": None})]
for nom, m in SINOVLAR:
    try:
        c2.upsert(ids=[f"t-{nom}"], embeddings=[[1., 2., 3.]], metadatas=[m])
        print(f"  ✅ {nom:6s}")
    except Exception as e:
        print(f"  💥 {nom:6s} {type(e).__name__}: {str(e)[:50]}")
```

```
✅ str · int · float · bool · list · None      (chromadb 1.5.9)
💥 dict   ValueError
```

## ⚠️ **PINECONE'DA `None` HAM RAD ETILADI** → **doim tozalang**.

</details>

**M13.** ⭐ Takroriy ID xatti-harakati.

<details>
<summary>✅ Yechim</summary>

```python
c3 = client.get_or_create_collection("takror-sinov")

# ── bir chaqiruvda ──
try:
    c3.upsert(ids=["a", "b", "a"], embeddings=[[1., 2., 3.]] * 3)
except Exception as e:
    print("bir chaqiruvda:", type(e).__name__, ":", str(e)[:60])

# ── alohida chaqiruvda ──
c3.upsert(ids=["a"], embeddings=[[1., 2., 3.]], metadatas=[{"v": 1}])
c3.upsert(ids=["a"], embeddings=[[4., 5., 6.]], metadatas=[{"v": 2}])
print("alohida:", c3.count(), c3.get(ids=["a"])["metadatas"])

# ── tasodifiy ID ──
c4 = client.get_or_create_collection("uuid-sinov")
for _ in range(3):
    c4.upsert(ids=[str(uuid.uuid4())], embeddings=[[4., 0., 1.]])
print("tasodifiy ID ×3:", c4.count(), "← 💥 DUBLIKAT")
```

```
bir chaqiruvda: DuplicateIDError
alohida: 1 [{'v': 2}]      ⭐ yangilandi
tasodifiy ID ×3: 3         💥 dublikat
```

</details>

**M14.** ⭐⭐ Batch va bitta-bitta embedding.

<details>
<summary>✅ Yechim</summary>

```python
b = pd.read_csv(BOLIMLAR, encoding="cp1252")
matnlar = b.section_name.head(200).tolist()
model = SentenceTransformer("all-MiniLM-L6-v2")

t0 = time.perf_counter()
E1 = [model.encode(m, show_progress_bar=False) for m in matnlar]
bitta = time.perf_counter() - t0

t0 = time.perf_counter()
E2 = model.encode(matnlar, batch_size=64, show_progress_bar=False)
batch = time.perf_counter() - t0

print(f"❌ bitta-bitta : {bitta:6.2f}s  ({len(matnlar)/bitta:5.0f}/s)")
print(f"✅ batch=64    : {batch:6.2f}s  ({len(matnlar)/batch:5.0f}/s)")
print(f"⭐ tezlanish   : {bitta/batch:.1f}×")
print("natijalar bir xil:", np.allclose(np.array(E1), E2, atol=1e-5))
```

```
❌ bitta-bitta :   0.87s  (  229/s)
✅ batch=64    :   0.11s  ( 1842/s)
⭐ tezlanish   : 8.0×
natijalar bir xil: True
```

</details>

**M15.** ⭐⭐ Mahalliy kechikishni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
rng = np.random.default_rng(365)
V = rng.normal(size=(5000, 384)).astype("float32")
V /= np.linalg.norm(V, axis=1, keepdims=True)

shutil.rmtree("./vdb-lat", ignore_errors=True)
c = chromadb.PersistentClient(path="./vdb-lat")
coll = c.create_collection("lat-test", metadata={"hnsw:space": "cosine"})
coll.add(ids=[str(i) for i in range(len(V))], embeddings=V.tolist())

t0 = time.perf_counter()
for _ in range(50):
    coll.query(query_embeddings=[V[0].tolist()], n_results=10)
mahalliy = (time.perf_counter() - t0) / 50 * 1000

print(f"⚡ mahalliy : {mahalliy:.2f} ms")
print(f"🌐 bulut    : {mahalliy + 80:.2f} ms  (+80 ms tarmoq)")
print(f"   farq     : {(mahalliy + 80) / mahalliy:.0f}×")
```

```
⚡ mahalliy : 0.94 ms
🌐 bulut    : 80.94 ms
   farq     : 86×
```

## 💥 **86× FARQ.** 🇺🇿 O'zbekistondan AQSh serveriga — **yanada ko'p**.

</details>

---

# 🔴 QIYIN *(16–20)*

**M16.** ⭐⭐⭐ Universal baza adapteri.

<details>
<summary>✅ Yechim</summary>

```python
class VektorBaza:
    """☁️ Pinecone yoki ⭐ Chroma — BIR XIL interfeys."""

    def __init__(self, nom="my-index", olcham=384, metrika="cosine",
                 model_nomi=None, yol="./vdb"):
        self.nom, self.olcham, self.metrika = nom, olcham, metrika
        self.model_nomi = model_nomi

        if os.getenv("PINECONE_API_KEY"):
            from pinecone import Pinecone, ServerlessSpec
            self.tur = "pinecone"
            self.pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
            mavjud = {i.name: i for i in self.pc.list_indexes()}
            if nom in mavjud and mavjud[nom].dimension != olcham:
                raise RuntimeError(
                    f"💥 '{nom}' o'lchami {mavjud[nom].dimension}, "
                    f"kerak {olcham}")
            if nom not in mavjud:
                self.pc.create_index(
                    name=nom, dimension=olcham, metric=metrika,
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"))
            self.index = self.pc.Index(nom)
            print(f"☁️ Pinecone: {nom} ({olcham}, {metrika})")
        else:
            self.tur = "chroma"
            self.client = chromadb.PersistentClient(path=yol)
            meta = {"hnsw:space": metrika, "olcham": olcham}
            if model_nomi:
                meta["model"] = model_nomi
            self.index = self.client.get_or_create_collection(nom,
                                                              metadata=meta)
            # ⭐ model mosligini TEKSHIRAMIZ
            m = (self.index.metadata or {}).get("model")
            if model_nomi and m and m != model_nomi:
                raise RuntimeError(f"💥 MODEL MOS EMAS: baza '{m}', "
                                   f"hozir '{model_nomi}'")
            print(f"⭐ Chroma: {nom} ({metrika}) · {self.index.count()} vektor")

    @staticmethod
    def _toza(d):
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

    def yoz(self, ids, vektorlar, metadata=None, batch=1000):
        ids = list(ids)
        n = len(ids)
        if len(set(ids)) < n:
            print(f"⚠️ {n - len(set(ids))} takroriy ID")
        yozildi = 0
        for i in range(0, n, batch):
            j = min(i + batch, n)
            m = [self._toza(x) for x in metadata[i:j]] if metadata else None
            v = [list(map(float, x)) for x in vektorlar[i:j]]
            if self.tur == "pinecone":
                self.index.upsert(vectors=list(zip(ids[i:j], v,
                                                   m or [{}] * (j - i))))
            else:
                self.index.upsert(ids=ids[i:j], embeddings=v, metadatas=m)
            yozildi += j - i
        return yozildi

    def qidir(self, vektor, k=5, filtr=None):
        """⭐ HAR IKKALASIDA: [(id, o'xshashlik, metadata), ...]"""
        v = list(map(float, vektor))
        if self.tur == "pinecone":
            r = self.index.query(vector=v, top_k=k, include_metadata=True,
                                 filter=filtr)
            return [(m["id"], float(m["score"]), m.get("metadata", {}))
                    for m in r["matches"]]
        r = self.index.query(query_embeddings=[v], n_results=k, where=filtr)
        return [(r["ids"][0][i], 1 - r["distances"][0][i],
                 (r["metadatas"][0][i] if r.get("metadatas") else {}))
                for i in range(len(r["ids"][0]))]

    def soni(self):
        if self.tur == "pinecone":
            return self.index.describe_index_stats().get(
                "total_vector_count", 0)
        return self.index.count()


shutil.rmtree("./vdb-adap", ignore_errors=True)
db = VektorBaza("sinov", olcham=3, model_nomi="qollanma",
                yol="./vdb-adap")
db.yoz(["Dog", "Cat", "Chicken", "Mantis", "Elephant"],
       [[4., 0., 1.], [4., 0., 1.], [2., 2., 1.],
        [6., 2., 3.], [4., 0., 1.]],
       [{"tur": "uy"}, {"tur": "uy"}, {"tur": "parranda"},
        {"tur": "hasharot"}, {"tur": "yovvoyi"}])
print("vektorlar:", db.soni())
for i, ball, m in db.qidir([4., 0., 1.], k=3):
    print(f"  {ball:.4f}  {i:10s} {m}")
print("\nfiltr bilan:", db.qidir([4., 0., 1.], k=3, filtr={"tur": "uy"}))
```

## 🏆 **UCH HIMOYA:** o'lcham · **model mosligi** · metadata tozalash.

</details>

**M17.** ⭐⭐⭐ Batch yozuvchi *(progress va xato boshqaruvi)*.

<details>
<summary>✅ Yechim</summary>

```python
import math

class Yozuvchi:
    def __init__(self, coll, batch=1000, qayta=2, verbose=True):
        self.coll, self.batch, self.qayta = coll, batch, qayta
        self.verbose = verbose

    @staticmethod
    def _toza(d):
        r = {}
        for k, v in (d or {}).items():
            if v is None or (isinstance(v, float) and v != v):
                r[k] = ""
            elif isinstance(v, (str, int, float, bool)):
                r[k] = v
            else:
                r[k] = ",".join(map(str, v)) if isinstance(
                    v, (list, tuple, set)) else str(v)
        return r

    def yoz(self, ids, vektorlar, metadata=None):
        ids = list(ids)
        n = len(ids)

        noyob = len(set(ids))
        if noyob < n:
            print(f"💥 {n - noyob} TAKRORIY ID")
            t = pd.Series(ids).value_counts()
            print(f"   {t[t > 1].head(3).to_dict()}")

        olchamlar = {len(v) for v in vektorlar}
        if len(olchamlar) > 1:
            print(f"💥 O'LCHAMLAR HAR XIL: {olchamlar}")
            return None

        yozildi, xatolar = 0, []
        t0 = time.perf_counter()
        for bi in range(math.ceil(n / self.batch)):
            i, j = bi * self.batch, min((bi + 1) * self.batch, n)
            m = [self._toza(x) for x in metadata[i:j]] if metadata else None
            xato = None
            for urinish in range(self.qayta + 1):
                try:
                    self.coll.upsert(
                        ids=ids[i:j],
                        embeddings=[list(map(float, v))
                                    for v in vektorlar[i:j]],
                        metadatas=m)
                    yozildi += j - i
                    xato = None
                    break
                except Exception as e:
                    xato = f"{type(e).__name__}: {str(e)[:56]}"
                    if urinish < self.qayta:
                        time.sleep(2 ** urinish)
            if xato:
                xatolar.append({"boshi": i, "oxiri": j, "xato": xato})
                if self.verbose:
                    print(f"  💥 [{i}:{j}] {xato}")
                continue
            if self.verbose:
                o = time.perf_counter() - t0
                print(f"  {j:7d}/{n}  ({j/n:5.1%})  {o:5.1f}s")

        o = time.perf_counter() - t0
        print(f"\n{'✅' if not xatolar else '⚠️'} {yozildi:,}/{n:,} · "
              f"{o:.1f}s · {yozildi/max(o,1e-9):.0f}/s")
        if xatolar:
            print(f"💥 {len(xatolar)} batch yozilmadi — MA'LUMOT TO'LIQ EMAS")
        if self.coll.count() != n and not xatolar:
            print(f"⚠️ bazada {self.coll.count():,}, kutilgan {n:,}")
        return {"yozildi": yozildi, "xatolar": xatolar}


shutil.rmtree("./vdb-yoz", ignore_errors=True)
c = chromadb.PersistentClient(path="./vdb-yoz")
coll = c.create_collection("yoz-sinov", metadata={"hnsw:space": "cosine"})

rng = np.random.default_rng(365)
N = 5000
V = rng.normal(size=(N, 384)).astype("float32")
V /= np.linalg.norm(V, axis=1, keepdims=True)
Yozuvchi(coll, batch=1000).yoz(
    [f"item-{i}" for i in range(N)], V,
    [{"guruh": f"g{i%5}", "izoh": None if i % 100 == 0 else "matn"}
     for i in range(N)])
```

</details>

**M18.** ⭐⭐⭐ Oqimli indekslovchi.

<details>
<summary>✅ Yechim</summary>

```python
def csv_oqim(yol, encoding="cp1252", chunksize=200):
    """⭐ Katta CSV faylni OQIMLI o'qiydi."""
    for qism in pd.read_csv(yol, encoding=encoding, chunksize=chunksize):
        for _, r in qism.iterrows():
            yield {"id": f"{r.course_id}-{r.section_id}",
                   "text": tozala(r.section_description),
                   "language": "en"}


def oqimli_indeksla(manba, coll, model, jami_kerak=680, batch=200,
                    emb_batch=64):
    it = iter(manba)
    yozildi, oqilgan, xatolar = 0, 0, []
    t0 = time.perf_counter()
    while yozildi < jami_kerak:
        qism = list(itertools.islice(it, batch))
        if not qism:
            break
        oqilgan += len(qism)
        try:
            E = model.encode([x["text"] for x in qism],
                             batch_size=emb_batch, show_progress_bar=False)
            coll.upsert(ids=[str(x["id"]) for x in qism],
                        embeddings=E.tolist(),
                        metadatas=[{"language": x["language"]} for x in qism])
            yozildi += len(qism)
        except Exception as e:
            xatolar.append(f"{type(e).__name__}: {str(e)[:56]}")
            continue
        o = time.perf_counter() - t0
        print(f"  {yozildi:6,}/{jami_kerak:,}  {o:5.1f}s  "
              f"{yozildi/max(o,1e-9):5.0f}/s")
    o = time.perf_counter() - t0
    print(f"\n✅ {yozildi:,} vektor · {o:.1f}s · {yozildi/max(o,1e-9):.0f}/s")
    if xatolar:
        print(f"💥 {len(xatolar)} batch yozilmadi")
    return yozildi


shutil.rmtree("./vdb-oqim", ignore_errors=True)
c = chromadb.PersistentClient(path="./vdb-oqim")
coll = c.create_collection("oqim", metadata={"hnsw:space": "cosine"})
model = SentenceTransformer("all-MiniLM-L6-v2")
oqimli_indeksla(csv_oqim(BOLIMLAR), coll, model, jami_kerak=680)
print("bazada:", coll.count())
```

## 🏆 **XOTIRA DOIMIY** — 680 yoki 10 million, **farqi yo'q**.

</details>

**M19.** ⭐⭐⭐ 256 token chegarasidan oshgan hujjatlarni toping.

<details>
<summary>✅ Yechim</summary>

```python
b = pd.read_csv(BOLIMLAR, encoding="cp1252")
model = SentenceTransformer("all-MiniLM-L6-v2")
maks = model.max_seq_length
print(f"model chegarasi: {maks} token\n")

for ustun in ["section_name", "section_description", "course_description"]:
    uz = b[ustun].map(lambda s: len(tozala(s)))
    tok = uz / 4                              # taxminiy
    oshgan = int((tok > maks).sum())
    kesilgan = float(np.clip(tok - maks, 0, None).sum())
    print(f"{ustun:22s} o'rt {int(uz.mean()):5d} belgi "
          f"(~{int(tok.mean()):4d} token) · "
          f"maks {int(uz.max()):5d} · "
          f"oshgan {oshgan:3d}/{len(b)} ({oshgan/len(b):5.1%})")
    if kesilgan:
        print(f"{'':22s} 💥 ~{int(kesilgan):,} token JIMGINA tashlanadi "
              f"({kesilgan/tok.sum():.1%})")

# ── ⭐ birlashgan matn ──
b["birlashgan"] = b.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.course_description} '
    f'{r.section_name} {r.section_description}'), axis=1)
tok = b.birlashgan.str.len() / 4
print(f"\nbirlashgan (kursning tartibi): o'rt {int(tok.mean())} token · "
      f"oshgan {(tok > maks).sum()}/{len(b)} ({(tok>maks).mean():.0%})")
print("💥 kursda course_description OLDINDA — u UZUN va chegarani yeydi")
print("✅ eng muhim matnni (section_name) OLDINGA qo'ying")
```

## 💥 **BU — JIM MA'LUMOT YO'QOLISHINI O'LCHASHNING ENG TEZ USULI.**

</details>

**M20.** ⭐⭐⭐ 🇺🇿 Indeks tashxis vositasi.

<details>
<summary>✅ Yechim</summary>

```python
class IndeksTashxis:
    """Mavjud indeksni tekshiradi: model mosligi · dublikat · sifat."""

    def __init__(self, coll, model=None):
        self.coll = coll
        self.model = model
        self.n = {}

    def asosiy(self):
        m = self.coll.metadata or {}
        self.n["asosiy"] = {"nom": self.coll.name, "vektorlar": self.coll.count(),
                            "metrika": m.get("hnsw:space", "l2"),
                            "model": m.get("model", "?"),
                            "olcham": m.get("olcham", "?")}
        for k, v in self.n["asosiy"].items():
            print(f"   {k:12s} {v}")
        if m.get("hnsw:space", "l2") == "l2":
            print("   ⚠️ metrika l2 — matn uchun COSINE tavsiya etiladi")
        if m.get("model") in (None, "?"):
            print("   💥 model nomi YOZILMAGAN — noto'g'ri model bilan "
                  "qidirsangiz XATO CHIQMAYDI, natija MA'NOSIZ bo'ladi")
        return self

    def model_moslik(self, model_nomi):
        m = (self.coll.metadata or {}).get("model")
        if not m:
            print("   ⚠️ tekshirib bo'lmadi — model nomi yozilmagan")
        elif m != model_nomi:
            print(f"   💥 MODEL MOS EMAS: baza '{m}', hozir '{model_nomi}'")
        else:
            print(f"   ✅ model mos: {m}")
        return self

    def dublikat(self, namuna=500):
        d = self.coll.get(limit=namuna, include=["embeddings"])
        E = np.array(d["embeddings"])
        if E.size == 0:
            print("   ⚪ vektorlar yo'q")
            return self
        E = E / np.linalg.norm(E, axis=1, keepdims=True)
        M = E @ E.T
        np.fill_diagonal(M, 0)
        juft = [(i, j) for i, j in np.argwhere(M > 0.97) if i < j]
        print(f"   dublikat (>0.97): {len(juft)} juftlik / {len(E)} namuna")
        if len(juft) > len(E) * 0.05:
            print("   ⚠️ ko'p dublikat — bazani tozalash foydali")
        self.n["tarqalish"] = {"o'rt": round(float(M[M != 0].mean()), 4),
                               "std": round(float(M[M != 0].std()), 4)}
        t = self.n["tarqalish"]
        ort, std = t["o'rt"], t["std"]
        print(f"   tarqalish: o'rt {ort} · std {std}")
        return self

    def sifat(self, sinovlar):
        """sinovlar = [(savol, kutilgan_id), ...]"""
        if self.model is None:
            print("   ⚪ model berilmagan")
            return self
        togri, ballar = 0, []
        for savol, kutilgan in sinovlar:
            q = self.model.encode(savol).tolist()
            r = self.coll.query(query_embeddings=[q], n_results=5)
            ids = r["ids"][0]
            ball = 1 - r["distances"][0][0]
            ballar.append(ball)
            if kutilgan in ids:
                togri += 1
                orin = ids.index(kutilgan) + 1
                print(f"   ✅ '{savol[:30]:30s}' → {orin}-o'rin · {ball:.4f}")
            else:
                print(f"   💥 '{savol[:30]:30s}' → TOPILMADI · {ball:.4f}")
        print(f"\n   aniqlik: {togri}/{len(sinovlar)} · "
              f"o'rtacha ball {np.mean(ballar):.4f}")
        if togri < len(sinovlar) * 0.7:
            print("   💥 ANIQLIK PAST — model yoki ma'lumot muammosi")
        return self


model = SentenceTransformer("all-MiniLM-L6-v2")
c = chromadb.PersistentClient(path="./vdb-oqim")
coll = c.get_collection("oqim")

print("═══ INDEKS TASHXISI ═══")
(IndeksTashxis(coll, model)
 .asosiy()
 .model_moslik("all-MiniLM-L6-v2")
 .dublikat()
 .sifat([("regression in Python", "37-369"),
         ("SQL joins", "14-169")]))
```

## 🏆 **TO'RT TEKSHIRUV:** asosiy · **model mosligi** · dublikat · **haqiqiy sifat**.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
Chroma qidiruv 0.94 ms · bulut ~80 ms → 86× farq
Hayvonlar: 1.0000 · 0.9355 · 0.7276 — 49-modul bilan AYNAN
Metadata: str/int/float/bool/list/None ✅ · dict 💥 (chromadb 1.5.9)
Bir chaqiruvda takror ID → DuplicateIDError
Embedding: bitta-bitta 229/s · batch=64 1842/s → ⭐ 8× tez (natija bir xil)
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
