# 6-dars. Katta ma'lumot to'plami bilan ishlash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"FineWeb — internetdan yig'ilgan ulkan matn to'plami. Undan 10 000 ta yozuvni olamiz."**

---

## 1. Kursning kodi

```python
from datasets import load_dataset

fw = load_dataset("HuggingFaceFW/fineweb", name="sample-10BT",
                  split="train", streaming=True)      # ⭐ streaming!
print(fw)
```

```
IterableDataset({
    features: ['text', 'id', 'dump', 'url', 'date', 'file_path',
               'language', 'language_score', 'token_count'],
    n_shards: 15
})
```

> ## 🏆 **`streaming=True` — HAL QILUVCHI PARAMETR.**
> ```
> streaming=False  →  💥 BUTUN to'plam diskka yuklanadi
>                     sample-10BT ≈ 10 MILLIARD token ≈ 45 GB
> streaming=True   →  ⭐ qatorma-qator o'qiladi, disk KERAK EMAS
> ```
>
> ## 💥 **`streaming` SIZ — DISKINGIZ TO'LADI.**

---

## 2. Embedding va upsert

```python
model = SentenceTransformer("all-MiniLM-L6-v2")

pc.create_index(
    name="text",
    dimension=model.get_sentence_embedding_dimension(),   # ⭐ 384
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"))
index = pc.Index(name="text")

subset_size = 10000
vectors_to_upsert = []
for i, item in enumerate(fw):
    if i >= subset_size:
        break
    embedding = model.encode(item["text"], show_progress_bar=False).tolist()
    vectors_to_upsert.append((str(item["id"]), embedding,
                              {"language": item["language"]}))

batch_size = 1000
for i in range(0, len(vectors_to_upsert), batch_size):
    index.upsert(vectors=vectors_to_upsert[i:i + batch_size])
print("Subset of data upserted to Pinecone index.")
```

> ## ✅ **`model.get_sentence_embedding_dimension()` — YAXSHI NAQSH.** O'lchamni **qo'lda yozish** o'rniga **modeldan olish**.

---

## 3. 💥💥 Kursning kodidagi UCHTA jiddiy muammo

### ① Embedding — BITTA-BITTA

```python
for i, item in enumerate(fw):
    embedding = model.encode(item["text"])      # 💥 har safar alohida chaqiruv
```

> ## 💥 **BU 10–20× SEKIN.** `sentence-transformers` **batch** bilan ancha tez.
>
> ## ✅ **TO'G'RI:**
> ```python
> matnlar = [item["text"] for item in itertools.islice(fw, subset_size)]
> E = model.encode(matnlar, batch_size=64, show_progress_bar=True)
> ```
>
> ## 🔬 **BIZ BUNI O'LCHADIK** *(200 ta qisqa matn)*:
> ```
> ❌ bitta-bitta :   0.87s  (  229/s)
> ✅ batch=64    :   0.11s  ( 1842/s)
> ⭐ tezlanish   : 8.0×
> natijalar bir xil: True
> ```
> ## 🏆 **8× TEZLANISH — VA NATIJALAR AYNAN BIR XIL** *(`np.allclose` bilan tekshirildi)*.

### ② Hammasi RAMda to'planadi

```python
vectors_to_upsert = []      # 💥 10 000 × 384 × 4 bayt ≈ 15 MB
                            # 💥 1M yozuvda ≈ 1.5 GB + matnlar
```

> ## ✅ **OQIMLI QAYTA ISHLASH — batchni to'plang va DARHOL yozing:**
> ```python
> import itertools
>
> BATCH = 500
> it = iter(fw)
> jami = 0
> while jami < subset_size:
>     qism = list(itertools.islice(it, BATCH))
>     if not qism:
>         break
>     E = model.encode([x["text"] for x in qism], batch_size=64)
>     coll.upsert(ids=[str(x["id"]) for x in qism],
>                 embeddings=E.tolist(),
>                 metadatas=[{"language": x["language"]} for x in qism])
>     jami += len(qism)
>     print(f"  {jami:,}/{subset_size:,}")
> ```
> ## 🏆 **XOTIRA — DOIMIY.** 10 ming yoki 10 million — **farqi yo'q**.

### ③ 💥 256 TOKEN CHEGARASI — kursda umuman aytilmagan

```python
model.encode(item["text"])       # FineWeb matnlari MINGLAB token
```

> ## 💥💥 **`all-MiniLM-L6-v2` — 256 TOKEN.** *(49-modul, 3-darsda o'lchagan edik: **21 000 tokenli matn 531 tokenlikdan farq qilmadi**.)*
>
> ## 🔑 **YA'NI: FINEWEB MAQOLASINING FAQAT BIRINCHI ~1000 BELGISI EMBEDDINGGA KIRADI.**
>
> ## 💥 **QOLGANI — JIMGINA TASHLANADI.** Maqolaning **asosiy mazmuni** o'rtada bo'lsa — **yo'qoladi**.
>
> ## ✅ **YECHIM — BO'LAKLASH** *(42-modul)*:
> ```python
> from langchain_text_splitters import RecursiveCharacterTextSplitter
>
> bolakchi = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=80)
> for x in qism:
>     bolaklar = bolakchi.split_text(x["text"])
>     for k, b in enumerate(bolaklar):
>         ids.append(f"{x['id']}-{k}")        # ⭐ barqaror ID
>         matnlar.append(b)
> ```

---

## 4. ⭐⭐ To'liq oqimli indekslovchi

```python
import itertools, time
from sentence_transformers import SentenceTransformer


def oqimli_indeksla(manba, coll, model, jami_kerak=10000,
                    batch=500, emb_batch=64, bolaklash=None):
    """Oqimli: xotira DOIMIY, progress ko'rinadi, xato batchni to'xtatmaydi."""
    it = iter(manba)
    yozildi, xatolar, oqilgan = 0, [], 0
    t0 = time.perf_counter()

    while yozildi < jami_kerak:
        qism = list(itertools.islice(it, batch))
        if not qism:
            print("⚠️ manba tugadi")
            break
        oqilgan += len(qism)

        ids, matnlar, meta = [], [], []
        for x in qism:
            xom = x["text"]
            parchalar = bolaklash(xom) if bolaklash else [xom]
            for k, p in enumerate(parchalar):
                ids.append(f"{x['id']}-{k}" if bolaklash else str(x["id"]))
                matnlar.append(p)
                meta.append({"language": x.get("language", ""),
                             "url": str(x.get("url", ""))[:120],
                             "bolak": k})

        try:
            E = model.encode(matnlar, batch_size=emb_batch,
                             show_progress_bar=False)
            coll.upsert(ids=ids, embeddings=E.tolist(), metadatas=meta)
            yozildi += len(ids)
        except Exception as e:
            xatolar.append((oqilgan, f"{type(e).__name__}: {str(e)[:60]}"))
            print(f"  💥 [{oqilgan}] {type(e).__name__}")
            continue

        o = time.perf_counter() - t0
        print(f"  {yozildi:7,}/{jami_kerak:,}  ({yozildi/jami_kerak:5.1%})  "
              f"{o:5.1f}s  {yozildi/max(o,1e-9):5.0f}/s  "
              f"qolgan ~{(jami_kerak-yozildi)/max(yozildi,1)*o:.0f}s")

    o = time.perf_counter() - t0
    print(f"\n{'✅' if not xatolar else '⚠️'} {yozildi:,} vektor · "
          f"{oqilgan:,} manba yozuvi · {o:.1f}s · "
          f"{yozildi/max(o,1e-9):.0f}/s")
    if bolaklash:
        print(f"   ⭐ bo'laklash: {oqilgan:,} → {yozildi:,} "
              f"({yozildi/max(oqilgan,1):.1f} bo'lak/hujjat)")
    if xatolar:
        print(f"💥 {len(xatolar)} batch yozilmadi")
    return {"yozildi": yozildi, "oqilgan": oqilgan, "xatolar": xatolar,
            "soniya": round(o, 1)}
```

> ## 🏆 **TO'RTTA AFZALLIK:**
> ```
> ⭐ Xotira DOIMIY       →  10K yoki 10M — farqi yo'q
> ⭐ Progress + ETA      →  qancha qolganini bilasiz
> ⭐ Batch embedding     →  10–20× tez
> ⭐ Xato batchni O'TKAZADI  →  jarayon to'xtamaydi
> ```

---

## 5. ⚠️ Katta hajmda narx va vaqt — hisoblab ko'ring

```python
def baholash(n_hujjat, ort_belgi=2000, bolak_hajmi=800, tezlik=113,
             olcham=384, til="en"):
    koef = 1.88 if til == "uz" else 1.0
    bolaklar = n_hujjat * max(1, ort_belgi / bolak_hajmi)
    tok = bolaklar * (bolak_hajmi / 4) * koef

    print(f"📊 {n_hujjat:,} hujjat × {ort_belgi} belgi")
    print(f"   bo'laklar : {bolaklar:,.0f}")
    print(f"   tokenlar  : {tok/1e6:.1f}M")
    print(f"\n⏱️ EMBEDDING")
    print(f"   mahalliy CPU ({tezlik}/s): {bolaklar/tezlik/3600:.1f} soat")
    print(f"   GPU (~2000/s)            : {bolaklar/2000/3600:.2f} soat")
    print(f"\n💰 NARX")
    print(f"   mahalliy                 : $0")
    print(f"   text-embedding-3-small   : ${tok/1e6*0.02:.2f}")
    print(f"   text-embedding-3-large   : ${tok/1e6*0.13:.2f}")
    print(f"\n💾 SAQLASH ({olcham} o'lcham)")
    print(f"   f32 : {bolaklar*olcham*4/1024**3:.2f} GB")
    print(f"   int8: {bolaklar*olcham/1024**3:.2f} GB")


baholash(10_000)                       # kursning hajmi
print("\n" + "─" * 56 + "\n")
baholash(1_000_000, til="uz")          # 🇺🇿 real loyiha
```

> ## 💥 **1 MLN HUJJAT — MAHALLIY CPU'DA ~6 SOAT.** Bu — **bir martalik**, lekin **rejalashtirilishi** kerak.
>
> ## 🏆 **VA ENG MUHIM XULOSA:** mahalliy embedding — **bepul**, lekin **vaqt talab qiladi**. API — **tez**, lekin **pulli**. Katta hajmda: ## ⭐ **GPU + mahalliy model**.

---

## 6. ⭐ Namespace va bo'limlash — kursda yo'q

```python
# ☁️ Pinecone — namespace
index.upsert(vectors=[...], namespace="uz")
index.upsert(vectors=[...], namespace="ru")
index.query(vector=q, top_k=5, namespace="uz")     # ⭐ faqat o'zbekcha

# ⭐ Chroma — alohida kolleksiya yoki metadata filtri
coll.query(query_embeddings=[q], n_results=5, where={"language": "uz"})
```

> ## 🏆 **NAMESPACE NIMA UCHUN?**
> ```
> 🌐 Til bo'yicha       →  🇺🇿 o'zbekcha so'rov faqat o'zbekcha hujjatlarda
> 👥 Mijoz bo'yicha     →  ⭐ ko'p ijarachili (multi-tenant) ilova
> 📅 Versiya bo'yicha   →  v1 va v2 parallel ishlaydi
> ```
>
> ## 💥 **VA BU — 42-MODUL, 16-DARSDAGI XAVFSIZLIK MASALASI:** har mijoz **faqat o'z ma'lumotini** ko'rsin.

---

## 7. 🇺🇿 Amaliy: FineWeb o'rniga o'z ma'lumotingiz

```python
import pandas as pd, itertools


def csv_oqim(yol, matn_ustuni, id_ustuni, encoding="utf-8", chunksize=1000):
    """⭐ Katta CSV faylni OQIMLI o'qiydi — RAMga sig'masa ham."""
    for qism in pd.read_csv(yol, encoding=encoding, chunksize=chunksize):
        for _, r in qism.iterrows():
            yield {"id": r[id_ustuni], "text": str(r[matn_ustuni]),
                   "language": "uz"}


# ⭐ 365 ma'lumotida
manba = csv_oqim("course_section_descriptions.csv",
                 matn_ustuni="section_description",
                 id_ustuni="section_id", encoding="cp1252")

print(list(itertools.islice(manba, 2)))
```

> ## 🏆 **`chunksize` — PANDAS'NING OQIMLI O'QISH USULI.** 10 GB CSV ham **RAMni to'ldirmaydi**.
>
> ## 💡 **VA `yield` — GENERATOR.** `oqimli_indeksla()` funksiyamiz uni **to'g'ridan-to'g'ri** qabul qiladi.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `streaming=True` nima qiladi?

**M2.** Kursning embedding kodidagi asosiy muammo?

**M3.** `get_sentence_embedding_dimension()` nima uchun?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Ma'lumotni **qatorma-qator** o'qiydi — butun to'plam **diskka yuklanmaydi**.

**M2.** ## **Bitta-bitta** embedding — **10–20× sekin**. `batch_size` bilan qiling.

**M3.** ## O'lchamni **modeldan** olish — qo'lda yozish **xato manbai**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Batch va bitta-bitta embedding tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time, pandas as pd
from sentence_transformers import SentenceTransformer

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")
matnlar = b.section_name.head(200).tolist()
model = SentenceTransformer("all-MiniLM-L6-v2")

# ── ❌ bitta-bitta (kursning usuli) ──
t0 = time.perf_counter()
E1 = [model.encode(m, show_progress_bar=False) for m in matnlar]
bitta = time.perf_counter() - t0

# ── ✅ batch ──
t0 = time.perf_counter()
E2 = model.encode(matnlar, batch_size=64, show_progress_bar=False)
batch = time.perf_counter() - t0

print(f"❌ bitta-bitta : {bitta:6.2f}s  ({len(matnlar)/bitta:5.0f}/s)")
print(f"✅ batch=64    : {batch:6.2f}s  ({len(matnlar)/batch:5.0f}/s)")
print(f"⭐ tezlanish   : {bitta/batch:.1f}×")

import numpy as np
print("natijalar bir xil:", np.allclose(np.array(E1), E2, atol=1e-5))
```

**Haqiqiy natija *(200 ta qisqa matn)*:**

```
❌ bitta-bitta :   0.87s  (  229/s)
✅ batch=64    :   0.11s  ( 1842/s)
⭐ tezlanish   : 8.0×
natijalar bir xil: True
```

## 🏆 **8× TEZLANISH — VA NATIJALAR AYNAN BIR XIL.**

## 💡 **UZUN MATNLARDA FARQ KAMROQ** *(GPU/CPU to'yinadi)*, lekin **baribir sezilarli**.

</details>

**M5.** ⭐ Oqimli indekslashni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import itertools, shutil, chromadb, pandas as pd
from sentence_transformers import SentenceTransformer


def csv_oqim(yol, matn_ustuni, id_ustuni, encoding="cp1252", chunksize=200):
    for qism in pd.read_csv(yol, encoding=encoding, chunksize=chunksize):
        for _, r in qism.iterrows():
            yield {"id": f"{r.course_id}-{r[id_ustuni]}",
                   "text": " ".join(str(r[matn_ustuni]).split()),
                   "language": "en"}


shutil.rmtree("./vdb-oqim", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-oqim")
coll = client.create_collection("oqim-sinov",
                                metadata={"hnsw:space": "cosine"})
model = SentenceTransformer("all-MiniLM-L6-v2")

manba = csv_oqim("course_section_descriptions.csv",
                 matn_ustuni="section_description", id_ustuni="section_id")

oqimli_indeksla(manba, coll, model, jami_kerak=680, batch=200)
print("bazada:", coll.count())
```

</details>

**M6.** ⭐⭐ Narx va vaqtni baholang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi `baholash()` funksiyasini turli hajmlarda ishga tushiring:

```python
for n, til in [(10_000, "en"), (100_000, "uz"), (1_000_000, "uz")]:
    print("═" * 56)
    baholash(n, til=til)
    print()
```

## 💥 **🇺🇿 O'ZBEKCHADA TOKENLAR 1.88× KO'P** → API narxi ham **1.88×**.

## 🏆 **MAHALLIY EMBEDDING BEPUL** — faqat **vaqt** kerak.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Bo'laklash bilan oqimli indekslovchi.

<details>
<summary>✅ Yechim</summary>

```python
import itertools, time, shutil
import numpy as np, pandas as pd, chromadb
from sentence_transformers import SentenceTransformer


class OqimliIndekslovchi:
    """Oqimli · bo'laklash bilan · progress · xato boshqaruvi · statistika."""

    def __init__(self, coll, model, batch=500, emb_batch=64,
                 bolak_hajmi=None, bolak_ustma=80):
        self.coll = coll
        self.model = model
        self.batch = batch
        self.emb_batch = emb_batch
        self.bolak_hajmi = bolak_hajmi
        self.bolak_ustma = bolak_ustma
        self.maks_token = getattr(model, "max_seq_length", 256)
        self.stat = {}

        if bolak_hajmi:
            from langchain_text_splitters import RecursiveCharacterTextSplitter
            self.bolakchi = RecursiveCharacterTextSplitter(
                chunk_size=bolak_hajmi, chunk_overlap=bolak_ustma)
        else:
            self.bolakchi = None

    def _parchala(self, matn):
        if self.bolakchi is None:
            return [matn]
        return self.bolakchi.split_text(matn) or [matn]

    def ishga_tushir(self, manba, jami_kerak=10000, verbose=True):
        it = iter(manba)
        yozildi = oqilgan = kesilgan = 0
        xatolar, uzunliklar = [], []
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
                # ⭐ kesilish tekshiruvi
                if not self.bolakchi and len(xom) / 4 > self.maks_token:
                    kesilgan += 1
                for k, p in enumerate(self._parchala(xom)):
                    ids.append(f"{x['id']}-{k}" if self.bolakchi
                               else str(x["id"]))
                    matnlar.append(p)
                    meta.append({"language": str(x.get("language", "")),
                                 "bolak": k,
                                 "manba_id": str(x["id"])})

            try:
                E = self.model.encode(matnlar, batch_size=self.emb_batch,
                                      show_progress_bar=False)
                self.coll.upsert(ids=ids, embeddings=E.tolist(),
                                 metadatas=meta)
                yozildi += len(ids)
            except Exception as e:
                xatolar.append({"oqilgan": oqilgan,
                                "xato": f"{type(e).__name__}: {str(e)[:60]}"})
                if verbose:
                    print(f"  💥 [{oqilgan}] {type(e).__name__}")
                continue

            if verbose:
                o = time.perf_counter() - t0
                print(f"  {yozildi:7,}/{jami_kerak:,}  "
                      f"({min(yozildi/jami_kerak,1):5.1%})  {o:5.1f}s  "
                      f"{yozildi/max(o,1e-9):5.0f}/s")

        o = time.perf_counter() - t0
        self.stat = {"yozildi": yozildi, "oqilgan": oqilgan,
                     "bolak_nisbati": round(yozildi / max(oqilgan, 1), 2),
                     "kesilgan": kesilgan,
                     "ort_belgi": int(np.mean(uzunliklar)) if uzunliklar else 0,
                     "maks_belgi": int(np.max(uzunliklar)) if uzunliklar else 0,
                     "xatolar": len(xatolar), "soniya": round(o, 1),
                     "tezlik": round(yozildi / max(o, 1e-9))}
        self.hisobot()
        return self.stat

    def hisobot(self):
        s = self.stat
        print(f"\n{'✅' if not s['xatolar'] else '⚠️'} "
              f"{s['yozildi']:,} vektor · {s['oqilgan']:,} manba · "
              f"{s['soniya']}s · {s['tezlik']}/s")
        print(f"   matn: o'rtacha {s['ort_belgi']} · maks {s['maks_belgi']} belgi")

        if self.bolakchi:
            print(f"   ⭐ bo'laklash: {s['bolak_nisbati']} bo'lak/hujjat")
        elif s["kesilgan"]:
            ulush = s["kesilgan"] / max(s["oqilgan"], 1)
            print(f"   💥 {s['kesilgan']:,} hujjat ({ulush:.0%}) "
                  f"{self.maks_token} token chegarasidan OSHDI")
            print(f"      → matnning oxirgi qismi JIMGINA TASHLANDI")
            print(f"      ✅ bolak_hajmi=800 bilan qayta ishga tushiring")

        if s["xatolar"]:
            print(f"   💥 {s['xatolar']} batch yozilmadi — "
                  f"ma'lumot TO'LIQ EMAS")

        # ── narx bashorati ──
        tok = s["yozildi"] * (s["ort_belgi"] / 4)
        print(f"\n💰 agar API embedding ishlatilsa:")
        print(f"   text-embedding-3-small: ${tok/1e6*0.02:.4f}")
        print(f"   mahalliy               : $0  (⭐ hozirgi usul)")
        print(f"💾 saqlash: "
              f"{s['yozildi']*384*4/1024**2:.1f} MB (f32, 384 o'lcham)")


# ─── sinov: bo'laklashsiz va bo'laklash bilan ───
def csv_oqim(yol, encoding="cp1252", chunksize=200):
    for qism in pd.read_csv(yol, encoding=encoding, chunksize=chunksize):
        for _, r in qism.iterrows():
            yield {"id": f"{r.course_id}-{r.section_id}",
                   "text": " ".join(str(r.section_description).split()),
                   "language": "en"}


model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="./vdb-oqim2")

for nom, bolak in [("bolaklashsiz", None), ("bolaklash-800", 800)]:
    print(f"\n═══ {nom} ═══")
    try:
        client.delete_collection(nom)
    except Exception:
        pass
    coll = client.create_collection(nom, metadata={"hnsw:space": "cosine"})
    OqimliIndekslovchi(coll, model, batch=200,
                       bolak_hajmi=bolak).ishga_tushir(
        csv_oqim("course_section_descriptions.csv"),
        jami_kerak=680, verbose=False)
```

## 🏆 **OLTI TASHXIS:**
```
⭐ tezlik va ETA         →  qancha qolgan
💥 kesilgan hujjatlar    →  256 token chegarasidan oshgani
⭐ bo'lak nisbati        →  bo'laklash qanchalik ko'paytirgan
💥 xato batchlar         →  ma'lumot to'liqmi
💰 narx bashorati        →  API bilan qancha bo'lardi
💾 saqlash hajmi         →  RAM/disk rejasi
```

## 💥 **"KESILGAN HUJJATLAR" — ENG QIMMATLI OGOHLANTIRISH.** U **jim ma'lumot yo'qolishini** ko'rsatadi.

</details>

---

## 📌 Xulosa

```python
fw = load_dataset("HuggingFaceFW/fineweb", name="sample-10BT",
                  split="train", streaming=True)      # ⭐ streaming SHART

E = model.encode(matnlar, batch_size=64)               # ⭐ BATCH (10–20× tez)
coll.upsert(ids=ids, embeddings=E.tolist(), metadatas=meta)
```

```
💥 Kursning kodidagi 3 muammo:
   ① bitta-bitta embedding      →  10–20× SEKIN
   ② hammasi RAMda to'planadi   →  1M yozuvda ~1.5 GB
   ③ 256 token chegarasi        →  💥 matn JIMGINA kesiladi

✅ Yechim: OQIMLI qayta ishlash + BATCH embedding + BO'LAKLASH
⭐ Namespace / metadata filtri  →  🌐 til · 👥 mijoz · 📅 versiya bo'yicha
```

> ## 💰 **1 MLN HUJJAT ≈ 6 SOAT** *(mahalliy CPU)* — bir martalik, lekin **rejalashtiring**.

---

⬅️ [5-dars. Upsert](05-Upserting-Data.md) · 🏠 [Modul boshiga](README.md) · ➡️ [51-modul. Case study](../51-Semantic-Search-Case-Study/README.md)
