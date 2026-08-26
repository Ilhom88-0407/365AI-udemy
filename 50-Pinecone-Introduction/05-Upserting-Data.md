# 5-dars. Ma'lumot yozish — upsert ⭐⭐

## 🎬 Boshlashdan oldin

> **"`upsert` = `update` + `insert`. Bor bo'lsa YANGILANADI, yo'q bo'lsa QO'SHILADI."**

---

## 1. Kursning kodi

```python
index = pc.Index(name=index_name)

index.upsert([
    ("Dog",      [4., 0., 1.]),
    ("Cat",      [4., 0., 1.]),
    ("Chicken",  [2., 2., 1.]),
    ("Mantis",   [6., 2., 3.]),
    ("Elephant", [4., 0., 1.]),
])
```

```
{'upserted_count': 5}
```

> ## 🔑 **HAR ELEMENT — `(id, vektor)` JUFTLIGI.** Metadata bilan: `(id, vektor, metadata)`.

---

## 2. ⭐ Mahalliy variant — aynan shu ma'lumot

```python
import chromadb, shutil

shutil.rmtree("./vdb-hayvon", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-hayvon")
coll = client.create_collection("hayvonlar",
                                metadata={"hnsw:space": "cosine"})

coll.add(
    ids=["Dog", "Cat", "Chicken", "Mantis", "Elephant"],
    embeddings=[[4., 0., 1.], [4., 0., 1.], [2., 2., 1.],
                [6., 2., 3.], [4., 0., 1.]],
    metadatas=[{"tur": "uy"}, {"tur": "uy"}, {"tur": "parranda"},
               {"tur": "hasharot"}, {"tur": "yovvoyi"}])

print("vektorlar:", coll.count())

r = coll.query(query_embeddings=[[4., 0., 1.]], n_results=5)
for i in range(len(r["ids"][0])):
    oxsh = 1 - r["distances"][0][i]           # ⭐ masofa → o'xshashlik
    print(f"  {oxsh:.4f}  {r['ids'][0][i]:10s} {r['metadatas'][0][i]}")
```

```
vektorlar: 5
  1.0000  Dog        {'tur': 'uy'}
  1.0000  Cat        {'tur': 'uy'}
  1.0000  Elephant   {'tur': 'yovvoyi'}
  0.9355  Mantis     {'tur': 'hasharot'}
  0.7276  Chicken    {'tur': 'parranda'}
```

> ## 🏆🏆 **BALLAR 49-MODULDA QO'LDA HISOBLAGANIMIZ BILAN AYNAN BIR XIL:**
> ```
> Dog/Cat/Elephant  1.0000
> Mantis            0.9355
> Chicken           0.7276
> ```
> ## ✅ **BUTUN ZANJIR TEKSHIRILDI:** kosinus formulasi → Chroma masofasi → `1 − masofa`.

---

## 3. ⭐⭐ `upsert` — nima uchun `insert` emas?

```python
# ① Birinchi yozuv
coll.upsert(ids=["Dog"], embeddings=[[4., 0., 1.]],
            metadatas=[{"tur": "uy"}])

# ② ⭐ AYNI ID bilan qayta — YANGILANADI, dublikat YO'Q
coll.upsert(ids=["Dog"], embeddings=[[5., 1., 2.]],
            metadatas=[{"tur": "uy", "zot": "labrador"}])
print(coll.count())        # hali ham 1
```

> ## 🏆 **BU — 42-MODUL, 13-DARSDAGI "BARQAROR ID" NAQSHINING O'ZI.**
>
> ## 🔑 **QOIDA: ID — MA'LUMOTDAN KELIB CHIQSIN, TASODIFIY BO'LMASIN.**
> ```python
> # ❌ tasodifiy
> import uuid
> uid = str(uuid.uuid4())          # 💥 har safar YANGI → DUBLIKAT
>
> # ✅ ⭐ barqaror
> uid = f"{r['course_id']}-{r['section_id']}"        # kursning usuli
>
> # ✅ ⭐ yoki xesh
> import hashlib
> uid = hashlib.sha256(matn.encode()).hexdigest()[:32]
> ```
>
> ## 💥 **TASODIFIY ID BILAN — QAYTA INDEKSLASHDA BAZA IKKI BARAVAR OSHADI.**

### ⚠️ Takroriy ID — ikki xil holat, o'lchandi

```python
# ── ① BIR chaqiruvda takror ──
coll.upsert(ids=["a", "b", "a"], embeddings=[[1., 2., 3.]] * 3)
```

```
💥 DuplicateIDError: Expected IDs to be unique, found duplicates of: a in upsert.
```

```python
# ── ② ALOHIDA chaqiruvlarda ayni ID ──
coll.upsert(ids=["a"], embeddings=[[1., 2., 3.]], metadatas=[{"v": 1}])
coll.upsert(ids=["a"], embeddings=[[4., 5., 6.]], metadatas=[{"v": 2}])
print(coll.count(), coll.get(ids=["a"])["metadatas"])
```

```
1 [{'v': 2}]         ← ⭐ YANGILANDI, dublikat YO'Q
```

> ## 🏆 **IKKI XIL XATTI-HARAKAT:**
> ```
> BIR chaqiruvda takror ID   →  💥 DuplicateIDError (yaxshi — xato ushlanadi)
> ALOHIDA chaqiruvda ayni ID →  ⭐ YANGILANADI (upsert mantiqi)
> ```
>
> ## 💡 **VA `add` HAM AYNI ID BILAN JIMGINA YANGILAYDI** *(o'lchandi: `count()` = 1)*.
>
> ## 🏆 **INDEKSLASH SKRIPTINGIZDA — DOIM `upsert`.** Skript **qayta ishga tushirilishi** mumkin.

---

## 4. ⭐⭐ Batch — kursning muhim naqshi

```python
batch_size = 1000
for i in range(0, len(vectors_to_upsert), batch_size):
    batch = vectors_to_upsert[i:i + batch_size]
    index.upsert(vectors=batch)
```

> ## 🔑 **NIMA UCHUN BATCH?**
> ```
> ① 💥 SO'ROV HAJMI CHEGARASI — Pinecone: ~2 MB / so'rov
>       384 o'lcham × 4 bayt = 1.5 KB / vektor  →  ~1300 vektor
> ② ⭐ XATO HOLATI — hammasi emas, BITTA batch yo'qoladi
> ③ ⭐ PROGRESS — qancha qolganini KO'RASIZ
> ④ Xotira — 1M vektorni birdan RAMda ushlash 1.5 GB
> ```
>
> ## 💡 **AMALIY BATCH HAJMI:**
> ```
> Pinecone  →  100–500 (hujjat 2 MB chegarasini aytadi)
> Chroma    →  ⭐ 5 000 (mahalliy, chegara yumshoqroq)
> ```

### ⭐ Progress va xato boshqaruvi bilan

```python
import time


def batch_yoz(coll, ids, vektorlar, metadata=None, batch=1000, verbose=True):
    """Progress, xato boshqaruvi va statistika bilan yozish."""
    n = len(ids)
    yozildi, xatolar = 0, []
    t0 = time.perf_counter()

    for i in range(0, n, batch):
        j = min(i + batch, n)
        try:
            coll.upsert(ids=list(ids[i:j]),
                        embeddings=[list(map(float, v))
                                    for v in vektorlar[i:j]],
                        metadatas=(metadata[i:j] if metadata else None))
            yozildi += j - i
        except Exception as e:
            xatolar.append((i, j, f"{type(e).__name__}: {str(e)[:60]}"))
            if verbose:
                print(f"  💥 [{i}:{j}] {type(e).__name__}")
            continue
        if verbose:
            o = time.perf_counter() - t0
            qolgan = (n - j) / max(j, 1) * o
            print(f"  {j:7d}/{n}  ({j/n:5.1%})  {o:5.1f}s  "
                  f"qolgan ~{qolgan:.0f}s")

    o = time.perf_counter() - t0
    print(f"\n✅ {yozildi:,}/{n:,} vektor · {o:.1f}s · "
          f"{yozildi/max(o, 1e-9):.0f}/s")
    if xatolar:
        print(f"💥 {len(xatolar)} batch YOZILMADI:")
        for i, j, x in xatolar[:3]:
            print(f"   [{i}:{j}] {x}")
        print("   ⚠️ ularni QAYTA yozing — ma'lumot TO'LIQ EMAS")
    return {"yozildi": yozildi, "xatolar": xatolar, "soniya": round(o, 1)}
```

> ## 💥 **`continue` — MUHIM DETAL.** Bitta batch yiqilsa, **qolgani davom etadi**. Keyin faqat **yiqilganlarini** qayta yozasiz.

---

## 5. ⭐ Metadata — nima yozish kerak?

```python
coll.add(ids=[...], embeddings=[...],
         metadatas=[{"course_name": "...", "section_name": "...",
                     "course_technology": "python", "section_id": 369}])
```

> ## 🏆 **METADATA IKKI ISH QILADI:**
> ```
> ① ⭐ FILTRLASH   →  where={"course_technology": "python"}
> ② ⭐ KO'RSATISH  →  natijada foydalanuvchiga chiqariladi
> ```
>
> ## ⚠️ **LEKIN METADATA — JOY EGALLAYDI:**
> ```
> 680 vektor × 400 belgi metadata ≈ 270 KB   ✅ arzimas
> 1M vektor × 400 belgi           ≈ 400 MB   ⚠️ sezilarli
> ```
>
> ## 🏆 **AMALIY QOIDA:**
> ```
> ✅ Metadata'ga:  filtrlash uchun kerakli maydonlar + qisqa ko'rsatkichlar
> ❌ Metadata'ga EMAS:  butun matn (u SQL'da yoki fayl tizimida bo'lsin)
> ```
> ```python
> # ⭐ Amaliy naqsh
> metadata = {"course_id": 37, "technology": "python",   # filtrlash uchun
>             "title": r.section_name[:80]}              # ko'rsatish uchun
> # to'liq matn → SQL'dan id bo'yicha olinadi
> ```

### ⚠️ Chroma metadata cheklovlari — o'lchandi

```python
SINOVLAR = [("str", {"nom": "Python"}), ("int", {"id": 37}),
            ("float", {"ball": 0.95}), ("bool", {"faol": True}),
            ("list", {"teglar": ["python", "ml"]}),
            ("dict", {"qoshimcha": {"a": 1}}), ("None", {"izoh": None})]
for nom, m in SINOVLAR:
    try:
        coll.upsert(ids=[f"t-{nom}"], embeddings=[[1., 2., 3.]],
                    metadatas=[m])
        print(f"  ✅ {nom:6s} {m}")
    except Exception as e:
        print(f"  💥 {nom:6s} {type(e).__name__}: {str(e)[:56]}")
```

**Haqiqiy natija *(chromadb 1.5.9)*:**

```
  ✅ str    {'nom': 'Python'}
  ✅ int    {'id': 37}
  ✅ float  {'ball': 0.95}
  ✅ bool   {'faol': True}
  ✅ list   {'teglar': ['python', 'ml']}       ← ⭐ RUXSAT ETILADI
  💥 dict   ValueError: Expected metadata value to be a str, int, float, bool...
  ✅ None   {'izoh': None}                     ← ⭐ RUXSAT ETILADI
```

> ## ⚠️⚠️ **HALOL AYTAMIZ — MEN `list` VA `None` XATO BERADI DEB KUTGAN EDIM.**
>
> ## 🔑 **HAQIQATDA:** `chromadb 1.5.9` da **`list` va `None` ruxsat etiladi**, faqat **`dict`** rad etiladi.
>
> ## ⚠️ **LEKIN BU VERSIYAGA BOG'LIQ.** Eski versiyalarda `list` va `None` **xato berardi**, va Pinecone'da **hozir ham** cheklovlar boshqacha:
> ```
> Pinecone metadata:  str · int · float · bool · list[str]
>                     💥 dict va None — RUXSAT ETILMAYDI
> ```
>
> ## 🏆 **SHUNING UCHUN — BARIBIR TOZALANG.** Kod **ikkala bazada ham** ishlasin:
> ```python
> def toza_metadata(d):
>     r = {}
>     for k, v in (d or {}).items():
>         if v is None or (isinstance(v, float) and v != v):    # None yoki NaN
>             r[k] = ""
>         elif isinstance(v, (str, int, float, bool)):
>             r[k] = v
>         elif isinstance(v, (list, tuple, set)):
>             r[k] = ",".join(map(str, v))
>         else:
>             r[k] = str(v)
>     return r
> ```
>
> ## 💡 **VA CSV'DAGI BO'SH KATAKCHA → `NaN` → BU FUNKSIYA UNI `""` GA AYLANTIRADI.**

---

## 6. 🇺🇿 Amaliy: 365 ma'lumotini yozish

```python
import pandas as pd, numpy as np, time, shutil
from sentence_transformers import SentenceTransformer
import chromadb

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


# ⭐ barqaror ID — kursning usuli
b["unique_id"] = b.course_id.astype(str) + "-" + b.section_id.astype(str)
print("noyob ID:", b.unique_id.nunique(), "/", len(b))

# ⭐ eng muhim matn OLDINDA (256 token chegarasi — 49-modul)
b["matn"] = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1)

model = SentenceTransformer("all-MiniLM-L6-v2")
t0 = time.perf_counter()
E = model.encode(b.matn.tolist(), show_progress_bar=False, batch_size=64)
print(f"embedding: {time.perf_counter()-t0:.1f}s · {E.shape}")

shutil.rmtree("./vdb-365", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-365")
coll = client.create_collection("kurslar-minilm-v1", metadata={
    "hnsw:space": "cosine", "model": "all-MiniLM-L6-v2", "olcham": 384})

meta = [{"course_name": r.course_name[:80],
         "section_name": r.section_name[:80],
         "course_technology": r.course_technology,
         "course_id": int(r.course_id),
         "section_id": int(r.section_id)}
        for _, r in b.iterrows()]

t0 = time.perf_counter()
coll.add(ids=b.unique_id.tolist(), embeddings=E.tolist(), metadatas=meta)
print(f"indekslash: {time.perf_counter()-t0:.1f}s · {coll.count()} vektor")
```

```
noyob ID: 680 / 680
embedding: 6.0s · (680, 384)
indekslash: 0.2s · 680 vektor
```

> ## ✅ **680 NOYOB ID — DUBLIKAT YO'Q.** Bu — **birinchi tekshiruv**.
>
> ## ⚠️ **AGAR `noyob ID < len(b)` BO'LSA** — bir necha qator **bir xil ID** oladi va **bir-birini yozib yuboradi**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `upsert` nima?

**M2.** Nima uchun batch?

**M3.** Chroma metadata'da qanday tiplar ruxsat etilgan?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `update` + `insert` — bor bo'lsa **yangilanadi**, yo'q bo'lsa **qo'shiladi**.

**M2.** ## So'rov hajmi chegarasi · **xato holati** · progress · xotira.

**M3.** ## `str` · `int` · `float` · `bool` — **hamma joyda**. Chroma 1.5.9 da `list` va `None` **ham** ruxsat etiladi, ## 💥 lekin `dict` — **yo'q**. **Pinecone'da `None` ham rad etiladi** → **doim tozalang**.

</details>

### 🟡 O'rta

**M4.** ⭐ Kursning hayvonlarini yozing va qidiring.

<details>
<summary>✅ Yechim</summary>

```python
import chromadb, shutil

shutil.rmtree("./vdb-hayvon", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-hayvon")
coll = client.create_collection("hayvonlar",
                                metadata={"hnsw:space": "cosine"})
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

print("\n── metadata filtri ──")
r = coll.query(query_embeddings=[[4., 0., 1.]], n_results=5,
               where={"tur": "uy"})
print("  faqat uy hayvonlari:", r["ids"][0])
```

</details>

**M5.** ⭐ `upsert` dublikat yaratmasligini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
coll = client.get_or_create_collection("upsert-sinov")

coll.upsert(ids=["Dog"], embeddings=[[4., 0., 1.]],
            metadatas=[{"zot": "noma'lum"}])
print("① birinchi:", coll.count())

coll.upsert(ids=["Dog"], embeddings=[[5., 1., 2.]],
            metadatas=[{"zot": "labrador"}])
print("② ayni ID :", coll.count(), "← dublikat YO'Q")
print("   metadata:", coll.get(ids=["Dog"])["metadatas"])

coll.upsert(ids=["Cat"], embeddings=[[1., 1., 1.]])
print("③ yangi ID:", coll.count())

# ── ⚠️ tasodifiy ID bilan nima bo'ladi ──
import uuid
for _ in range(3):
    coll.upsert(ids=[str(uuid.uuid4())], embeddings=[[4., 0., 1.]])
print("④ tasodifiy ID ×3:", coll.count(), "← 💥 DUBLIKATLAR")
```

## 💥 **TASODIFIY ID — QAYTA INDEKSLASHDA BAZA IKKI BARAVAR OSHADI.**

</details>

**M6.** ⭐⭐ Metadata tiplarini sinang.

<details>
<summary>✅ Yechim</summary>

```python
coll = client.get_or_create_collection("meta-sinov")

SINOVLAR = [
    ("str",   {"nom": "Python"}),
    ("int",   {"id": 37}),
    ("float", {"ball": 0.95}),
    ("bool",  {"faol": True}),
    ("list",  {"teglar": ["python", "ml"]}),
    ("dict",  {"qoshimcha": {"a": 1}}),
    ("None",  {"izoh": None}),
]
for nom, m in SINOVLAR:
    try:
        coll.upsert(ids=[f"t-{nom}"], embeddings=[[1., 2., 3.]],
                    metadatas=[m])
        print(f"  ✅ {nom:6s} {m}")
    except Exception as e:
        print(f"  💥 {nom:6s} {type(e).__name__}: {str(e)[:56]}")


# ⭐ Universal tozalash
def toza_metadata(d):
    r = {}
    for k, v in d.items():
        if v is None or (isinstance(v, float) and v != v):     # None yoki NaN
            r[k] = ""
        elif isinstance(v, (str, int, float, bool)):
            r[k] = v
        elif isinstance(v, (list, tuple, set)):
            r[k] = ",".join(map(str, v))
        else:
            r[k] = str(v)
    return r


print("\n── tozalashdan keyin ──")
for nom, m in SINOVLAR:
    coll.upsert(ids=[f"c-{nom}"], embeddings=[[1., 2., 3.]],
                metadatas=[toza_metadata(m)])
    print(f"  ✅ {nom:6s} {toza_metadata(m)}")
```

**Haqiqiy natija *(chromadb 1.5.9)*:**

```
  ✅ str    · int · float · bool · list · None    ← ruxsat etiladi
  💥 dict   ValueError: Expected metadata value to be a str, int, float, bool...
```

## ⚠️ **FAQAT `dict` RAD ETILDI.** `list` va `None` — bu versiyada **ruxsat etiladi**.

## 🏆 **LEKIN BARIBIR TOZALANG:** Pinecone'da `dict` **va** `None` rad etiladi, va Chroma'ning eski versiyalarida `list` ham. `toza_metadata()` kodni **ikkala bazada ham** ishlatadi.

## 💡 **VA CSV'DAGI BO'SH KATAKCHA → `NaN`** — bu funksiya uni `""` ga aylantiradi.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Progress va xato boshqaruvi bilan yozuvchi.

<details>
<summary>✅ Yechim</summary>

```python
import time, math
import pandas as pd


class Yozuvchi:
    """Batch yozuv: progress · xato boshqaruvi · qayta urinish · statistika."""

    def __init__(self, coll, batch=1000, qayta_urinish=2, verbose=True):
        self.coll = coll
        self.batch = batch
        self.qayta = qayta_urinish
        self.verbose = verbose
        self.jurnal = []

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

    def yoz(self, ids, vektorlar, metadata=None):
        ids = list(ids)
        n = len(ids)

        # ── ① ID tekshiruvi ──
        noyob = len(set(ids))
        if noyob < n:
            print(f"💥 {n - noyob} TAKRORIY ID — ular bir-birini "
                  f"YOZIB YUBORADI")
            takror = pd.Series(ids).value_counts()
            print(f"   masalan: {takror[takror > 1].head(3).to_dict()}")

        # ── ② o'lcham tekshiruvi ──
        olchamlar = {len(v) for v in vektorlar}
        if len(olchamlar) > 1:
            print(f"💥 VEKTOR O'LCHAMLARI HAR XIL: {olchamlar}")
            return None

        yozildi, xatolar = 0, []
        t0 = time.perf_counter()
        batchlar = math.ceil(n / self.batch)

        for bi in range(batchlar):
            i, j = bi * self.batch, min((bi + 1) * self.batch, n)
            m = ([self._toza(x) for x in metadata[i:j]]
                 if metadata else None)
            oxirgi_xato = None

            for urinish in range(self.qayta + 1):
                try:
                    self.coll.upsert(
                        ids=ids[i:j],
                        embeddings=[list(map(float, v))
                                    for v in vektorlar[i:j]],
                        metadatas=m)
                    yozildi += j - i
                    oxirgi_xato = None
                    break
                except Exception as e:
                    oxirgi_xato = f"{type(e).__name__}: {str(e)[:56]}"
                    if urinish < self.qayta:
                        time.sleep(2 ** urinish)      # ⭐ eksponensial kutish
                        if self.verbose:
                            print(f"  ⏳ [{i}:{j}] qayta urinish "
                                  f"{urinish+1}/{self.qayta}")

            if oxirgi_xato:
                xatolar.append({"boshi": i, "oxiri": j, "xato": oxirgi_xato})
                if self.verbose:
                    print(f"  💥 [{i}:{j}] {oxirgi_xato}")
                continue

            if self.verbose:
                o = time.perf_counter() - t0
                print(f"  {j:7d}/{n}  ({j/n:5.1%})  {o:5.1f}s  "
                      f"qolgan ~{(n-j)/max(j,1)*o:.0f}s")

        o = time.perf_counter() - t0
        natija = {"jami": n, "yozildi": yozildi,
                  "xato_batch": len(xatolar), "soniya": round(o, 1),
                  "tezlik": round(yozildi / max(o, 1e-9))}
        self.jurnal.append(natija)

        print(f"\n{'✅' if not xatolar else '⚠️'} "
              f"{yozildi:,}/{n:,} vektor · {o:.1f}s · {natija['tezlik']}/s")
        if xatolar:
            print(f"💥 {len(xatolar)} batch YOZILMADI — ma'lumot TO'LIQ EMAS:")
            for x in xatolar[:3]:
                print(f"   [{x['boshi']}:{x['oxiri']}] {x['xato']}")
            print("   ✅ qayta yozish uchun: yoz(ids[boshi:oxiri], ...)")
        if self.coll.count() != n and not xatolar:
            print(f"⚠️ bazada {self.coll.count():,} vektor, kutilgan {n:,} — "
                  f"takroriy ID bo'lgan bo'lishi mumkin")
        return natija


# ─── sinov ───
import numpy as np, shutil, chromadb

shutil.rmtree("./vdb-yozuv", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-yozuv")
coll = client.create_collection("yozuv-sinov",
                                metadata={"hnsw:space": "cosine"})

rng = np.random.default_rng(365)
N = 5000
V = rng.normal(size=(N, 384)).astype("float32")
V /= np.linalg.norm(V, axis=1, keepdims=True)
ids = [f"item-{i}" for i in range(N)]
meta = [{"guruh": f"g{i % 5}", "ball": float(i) / N,
         "izoh": None if i % 100 == 0 else "matn"}      # ⚠️ None bor
        for i in range(N)]

y = Yozuvchi(coll, batch=1000)
y.yoz(ids, V, meta)
print("\nbazada:", coll.count())

# ── takroriy ID sinovi ──
print("\n═══ TAKRORIY ID SINOVI ═══")
coll2 = client.create_collection("takror-sinov")
Yozuvchi(coll2, batch=100, verbose=False).yoz(
    ["a", "b", "a", "c", "b"], V[:5], None)
print("bazada:", coll2.count(), "← 5 emas, 3")
```

## 🏆 **BESH HIMOYA:**
```
① takroriy ID    →  💥 OGOHLANTIRADI (ular bir-birini yozib yuboradi)
② o'lcham        →  💥 har xil bo'lsa TO'XTAYDI
③ metadata       →  ⭐ None/NaN/list AVTOMATIK tozalanadi
④ qayta urinish  →  ⭐ eksponensial kutish bilan
⑤ yakuniy hisob  →  ⚠️ baza soni kutilganga mos kelmasa aytadi
```

## 💥 **`continue` — BITTA BATCH YIQILSA, QOLGANI DAVOM ETADI.**

</details>

---

## 📌 Xulosa

```python
# ☁️ Pinecone
index.upsert(vectors=[(uid, vektor, metadata), ...])

# ⭐ Chroma
coll.upsert(ids=[...], embeddings=[...], metadatas=[...])
```

```
🔬 O'LCHANGAN (kursning hayvonlari, Chroma):
   Dog/Cat/Elephant 1.0000 · Mantis 0.9355 · Chicken 0.7276
   → 49-moduldagi qo'lda hisob bilan AYNAN BIR XIL ✅

⭐ upsert — BARQAROR ID bilan → dublikat YO'Q
💥 tasodifiy ID (uuid4) → qayta indekslashda baza IKKI BARAVAR oshadi
⭐ batch: Pinecone 100–500 · Chroma 5000
💥 Chroma metadata: str/int/float/bool. list/dict/None → XATO
   → CSV bo'sh katakcha → NaN → None → 💥 (toza_metadata() kerak)
```

---

⬅️ [4-dars. Indeks yaratish](04-Creating-and-Deleting-Index.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. Katta ma'lumot to'plami](06-Large-Dataset-Upserting.md)
