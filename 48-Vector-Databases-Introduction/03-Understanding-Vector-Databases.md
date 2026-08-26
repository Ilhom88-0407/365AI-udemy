# 3-dars. Vektor bazalarini tushunish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Vektor bazasi — bu shunchaki saqlash birligi emas, balki yuqori o'lchamli ma'lumotni boshqarish va qidirish uchun mo'ljallangan KUCHLI VOSITA."**

---

## 1. Vektor nima?

> **"Vektorni ulkan ko'p o'lchamli fazodagi UCHLI STRELKA deb tasavvur qiling. Har o'lcham — ma'lumotning bir XUSUSIYATI."**

```
"Machine Learning in Python"  →  [0.12, -0.45, 0.88, ..., 0.03]
                                  ↑ 384 ta son
```

| Ma'lumot turi | O'lchamlar nimani anglatadi |
|---|---|
| 📝 Matn | Ma'no, mavzu, kayfiyat, uslub |
| 🎵 Musiqa | ## Ritm, ohang, cholg'ular, **hissiyot** |
| 🖼️ Rasm | Rang, shakl, tekstura, obyektlar |
| 🎬 Video | Yuqoridagilar + **harakat** |

> ## ⚠️ **MUHIM ANIQLIK:** har o'lcham **aniq bir narsani** anglatmaydi. Bu — **o'rgangan** *(learned)* xususiyatlar. Inson uchun ular **tushunarsiz**, lekin model uchun **ma'noli**.

---

## 2. 🔬 Buni o'z ko'zingiz bilan ko'ring

```python
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")
v = model.encode("Machine Learning in Python")

print("o'lcham:", len(v))
print("norma  :", np.linalg.norm(v))
print("birinchi 8:", v[:8].round(4))
```

```
o'lcham: 384
norma  : 1.0000
birinchi 8: [-0.0559 -0.0155  0.0206  0.014   0.0159 -0.0824  0.0108 -0.0445]
```

> ## 🏆🏆 **DIQQAT — NORMA `1.0000`!**
>
> ## 🔑 **YA'NI `all-MiniLM-L6-v2` VEKTORLARNI AVTOMATIK NORMALLASHTIRADI:**
> ```
> np.dot(a, b)  ==  kosinus(a, b)        ✅ TENG
> ```
>
> ## 💥 **VA BU — 42-MODULDAGIDAN FARQLI!**
> ```
> paraphrase-multilingual-MiniLM-L12-v2  →  norma 5.8556  💥
> all-MiniLM-L6-v2                       →  norma 1.0000  ✅
> ```
>
> ## ⚠️ **DOIM TEKSHIRING:**
> ```python
> n = np.linalg.norm(model.encode("test"))
> print("normallashtirilganmi?", abs(n - 1.0) < 0.01)
> ```

---

## 3. ⭐ Vektor bazasining ichida nima bor?

```
┌─────────────────────────────────────────────┐
│  ID          VEKTOR (384 son)     METADATA  │
├─────────────────────────────────────────────┤
│  "37-369"    [0.12, ..., 0.88]    {          │
│                                     course:  │
│                                     "ML in   │
│                                      Python" │
│                                   }          │
└─────────────────────────────────────────────┘
              +
      ⭐ INDEKS (HNSW / IVF)  ← tez qidiruv uchun
```

> ## 🔑 **UCH QISM:**
> ```
> ① ID        →  qaysi yozuv
> ② VEKTOR    →  ⭐ o'xshashlik qidiruvi uchun
> ③ METADATA  →  ⭐ filtrlash va natijani ko'rsatish uchun
> ```
>
> ## 🏆 **VA ENG MUHIMI — INDEKS.** Usiz **har so'rovda 1 million vektor bilan taqqoslash** kerak bo'lardi.

---

## 4. ⭐⭐ Indeks — nima uchun kerak?

```
❌ TO'LIQ QIDIRUV (brute force)
   N vektor × 384 amal  →  N o'sganda CHIZIQLI sekinlashadi

✅ ⭐ HNSW INDEKSI
   ~log(N) amal  →  N o'sganda deyarli SEKINLASHMAYDI
```

| Indeks | Qanday ishlaydi | Xususiyat |
|---|---|---|
| ## **Flat** | Hammasini tekshiradi | ## ✅ **100% aniq** · ❌ sekin |
| ## ⭐ **HNSW** | Ko'p qavatli graf | ## ⭐ **Tez va aniq** *(standart)* |
| **IVF** | Klasterlarga bo'ladi | Xotira tejaydi |
| **PQ** | Vektorni siqadi | ## 💰 **4–32× xotira tejaydi** |

> ## 💥💥 **VA BU — KURSDA AYTILMAGAN ENG MUHIM NARSA:**
>
> ## ⚠️ **HNSW, IVF VA PQ — TAXMINIY** *(approximate nearest neighbor, ANN)*.
> ```
> Ya'ni: eng yaqin 10 ta o'rniga, 9 tasi to'g'ri, 1 tasi 11-o'rindagi bo'lishi mumkin
> ```
>
> ## 🔑 **BU — SAVDO: TEZLIK ↔ ANIQLIK.**
> ```
> Flat  →  ✅ 100% aniq,  N ga chiziqli bog'liq
> HNSW  →  ⚠️ taxminiy,   N ga deyarli bog'liq EMAS
> ```
> ## ⚠️ **VA TEZLIK FARQI — MA'LUMOT HAJMIGA BOG'LIQ.** Biz uni **o'lchadik** *(quyida)* va natija **kutilgandan boshqacha** chiqdi.
> ## 💡 **AMALIY QIDIRUVDA BIROZ ANIQLIK YO'QOLISHI AHAMIYATSIZ.** Lekin **tibbiy** yoki **yuridik** izlanishda — **ehtiyot bo'ling**.

### 🔬 Biz buni O'LCHADIK — va natija KUTILGANDEK EMAS

```
vektorlar 50 000 × 384 · indekslash 8.0s
brute force    2.05 ms
HNSW           1.30 ms   (atigi 2× tez)
⭐ top-10 mos: 3/10
```

> ## 💥💥 **IKKI KUTILMAGAN NATIJA:**
>
> ### ① HNSW atigi **2× tez** — 1000× emas
> ```
> Sabab: numpy'ning `V @ q` amali JUDA optimallashtirilgan (BLAS/SIMD)
>        50 000 × 384 = 19 mln ko'paytirish → atigi 2 ms
> ```
> ## 🔑 **HNSW'ning afzalligi FAQAT MILLIONLAB vektorda sezilarli bo'ladi.**
>
> ### ② Aniqlik **3/10** — 98% emas
> ```
> Sabab: bu sinovda TASODIFIY vektorlar ishlatildi
>        Yuqori o'lchamda tasodifiy vektorlar orasidagi masofalar DEYARLI TENG
>        → "eng yaqin 10 ta" degan tushuncha MA'NOSIZ bo'lib qoladi
>        → bu "o'lchamlar la'nati" (curse of dimensionality) deb ataladi
> ```
> ## 🏆 **HAQIQIY MA'LUMOTDA ANIQLIK ANCHA YUQORI** — chunki haqiqiy embeddinglar **klasterlangan**, tasodifiy emas.
>
> ## ⭐⭐ **AMALIY XULOSA — VA U KURSDA YO'Q:**
> ```
>       < 100 000 vektor  →  numpy brute force YETADI (va 100% aniq)
> 100 000 – 1 000 000     →  HNSW foydali
>       > 1 000 000       →  ⭐ HNSW SHART
> ```

---

## 5. ⭐ Bizning o'lchovimiz — 680 vektor

```python
import chromadb, time

client = chromadb.PersistentClient(path="./vdb")
coll = client.create_collection("kurslar",
                                metadata={"hnsw:space": "cosine"})

t0 = time.perf_counter()
coll.add(ids=idlar, embeddings=E.tolist(), metadatas=meta)
print(f"indekslash: {time.perf_counter()-t0:.1f}s · {coll.count()} vektor")
```

```
indekslash: 0.2s · 680 vektor
qidiruv   : 1–2 ms
```

> ## ⚡ **680 VEKTOR — 0.2 SONIYA.** Miqyoslaydigan bo'lsak:
> ```
>       680 vektor  →  0.2 s
>    10 000 vektor  →  ~3 s
> 1 000 000 vektor  →  ~5 daqiqa  (embedding vaqti bundan tashqari)
> ```
>
> ## 💰 **VA EMBEDDING — ANCHA SEKINROQ:**
> ```
> 680 embedding  →  6.0 s   (113/s, mahalliy CPU)
> 1M embedding   →  ~2.5 soat
> ```
> ## 🔑 **YA'NI: INDEKSLASH TEZ, EMBEDDING SEKIN.** Optimallashtirish kerak bo'lsa — **embeddingdan** boshlang *(GPU, batch, kesh)*.

---

## 6. ⚠️ Vektor bazasini qachon ISHLATMASLIK kerak

```
❌ Ma'lumot 1000 qatordan kam
   → oddiy numpy massivi YETADI (va TEZROQ)

❌ Faqat aniq moslik kerak
   → SQL LIKE yoki to'liq matnli qidiruv (Elasticsearch)

❌ Ma'lumot TEZ-TEZ o'zgaradi
   → har o'zgarishda qayta embedding = 💰 pul va vaqt

❌ Natija 100% aniq bo'lishi SHART
   → HNSW taxminiy. Flat indeks yoki brute force ishlating

❌ Byudjet juda cheklangan
   → mahalliy Chroma/FAISS bepul, lekin server kerak
```

> ## 🏆 **1000 QATORGACHA — SHUNCHAKI NUMPY:**
> ```python
> import numpy as np
>
> E = model.encode(matnlar)                       # (N, 384), normallashgan
> q = model.encode(savol)
> ballar = E @ q                                  # ⭐ bitta amal
> top = np.argsort(-ballar)[:5]
> ```
> ## 💡 **BU — 680 QATOR UCHUN ~1 ms.** Vektor bazasi bilan **bir xil**.
>
> ## 🔬 **VA 50 000 QATOR UCHUN HAM ATIGI 2 ms** *(o'lchandi)* — numpy **BLAS/SIMD** bilan juda tez.
>
> ## ⚠️ **VEKTOR BAZASI KERAK BO'LADIGAN JOY:** ma'lumot **RAMga sig'maganda**, **saqlanishi** kerak bo'lganda, yoki **metadata filtri** kerak bo'lganda.

---

## 7. 🇺🇿 Amaliy qaror

```
📊 MA'LUMOT HAJMI:
   < 1 000 yozuv       →  numpy (eng sodda, eng tez)
   1 000 – 1 000 000   →  ⭐ Chroma / FAISS (mahalliy, bepul)
   > 1 000 000         →  Qdrant / Milvus / Pinecone

🔒 MAXFIYLIK (🏦 bank, 🏥 tibbiyot):
   ⭐ MAHALLIY: Chroma · FAISS · Qdrant (self-hosted)
   ⚠️ Pinecone — bulutli, ma'lumot CHIQADI

💰 NARX:
   Mahalliy  →  faqat server
   Pinecone  →  bepul tarif cheklangan (5 indeks, 1 loyiha)
```

> ## 🏆 **🇺🇿 O'ZBEKISTONDAGI KO'P LOYIHA UCHUN — MAHALLIY CHROMA YETARLI.** Ma'lumot hajmi **million vektordan kam**, va **maxfiylik** ko'pincha **majburiy talab**.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Vektor bazasining uch qismi?

**M2.** Indeks nima uchun kerak?

**M3.** HNSW aniqmi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **ID** · **vektor** · **metadata** *(+ indeks)*.

**M2.** ## Har so'rovda **hamma vektor bilan taqqoslamaslik** uchun — ~1000× tezlik.

**M3.** ## ❌ **Taxminiy** *(ANN)* — ~98% aniq, lekin **1000× tez**.

</details>

### 🟡 O'rta

**M4.** ⭐ Embedding normasini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from sentence_transformers import SentenceTransformer
import numpy as np

MODELLAR = ["all-MiniLM-L6-v2",
            "paraphrase-multilingual-MiniLM-L12-v2"]

for nom in MODELLAR:
    m = SentenceTransformer(nom)
    v = m.encode("test")
    n = float(np.linalg.norm(v))
    holat = "✅ normallashgan" if abs(n - 1) < 0.01 else "💥 NORMALLASHMAGAN"
    print(f"  {nom[:38]:38s} o'lcham {len(v):4d} · norma {n:.4f}  {holat}")
```

```
  all-MiniLM-L6-v2                       o'lcham  384 · norma 1.0000  ✅
  paraphrase-multilingual-MiniLM-L12-v2  o'lcham  384 · norma 5.8556  💥
```

## 💥 **NORMALLASHMAGAN MODELDA `np.dot` ≠ KOSINUS** — doim **normaga bo'ling**.

</details>

**M5.** ⭐ Numpy bilan "vektor bazasi" quring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd, time
from sentence_transformers import SentenceTransformer

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())

matnlar = b.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.section_name} '
    f'{r.section_description}'), axis=1).tolist()

model = SentenceTransformer("all-MiniLM-L6-v2")
t0 = time.perf_counter()
E = model.encode(matnlar, show_progress_bar=False, batch_size=64)
print(f"embedding: {time.perf_counter()-t0:.1f}s · {E.shape}")

def qidir(savol, k=3):
    q = model.encode(savol)
    ballar = E @ q                       # ⭐ normallashgan → dot = kosinus
    top = np.argsort(-ballar)[:k]
    return [(round(float(ballar[i]), 4),
             b.iloc[i].course_name, b.iloc[i].section_name) for i in top]

for s in ["regression in Python", "SQL joins", "deep learning"]:
    t0 = time.perf_counter()
    r = qidir(s)
    print(f"\n🔍 '{s}'  ({(time.perf_counter()-t0)*1000:.1f} ms)")
    for ball, kurs, bolim in r:
        print(f"   {ball:.4f}  {kurs[:36]:36s} | {bolim[:28]}")
```

## 🏆 **680 QATOR UCHUN — VEKTOR BAZASI KERAK EMAS.** `E @ q` — **bitta amal**.

</details>

**M6.** ⭐⭐ Brute force va HNSW tezligini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, time, chromadb, shutil

N, O = 50_000, 384
rng = np.random.default_rng(365)
V = rng.normal(size=(N, O)).astype("float32")
V /= np.linalg.norm(V, axis=1, keepdims=True)
q = V[0]

# ── ① brute force ──
t0 = time.perf_counter()
for _ in range(10):
    top_bf = np.argsort(-(V @ q))[:10]
bf_ms = (time.perf_counter() - t0) / 10 * 1000

# ── ② ⭐ HNSW (Chroma) ──
shutil.rmtree("./bench", ignore_errors=True)
c = chromadb.PersistentClient(path="./bench")
coll = c.create_collection("b", metadata={"hnsw:space": "cosine"})
t0 = time.perf_counter()
for i in range(0, N, 5000):
    coll.add(ids=[str(x) for x in range(i, min(i + 5000, N))],
             embeddings=V[i:i + 5000].tolist())
idx_s = time.perf_counter() - t0

t0 = time.perf_counter()
for _ in range(10):
    r = coll.query(query_embeddings=[q.tolist()], n_results=10)
hnsw_ms = (time.perf_counter() - t0) / 10 * 1000

top_hnsw = [int(x) for x in r["ids"][0]]
umumiy = len(set(top_bf.tolist()) & set(top_hnsw))

print(f"vektorlar   : {N:,} × {O}")
print(f"indekslash  : {idx_s:.1f}s")
print(f"brute force : {bf_ms:7.2f} ms")
print(f"HNSW        : {hnsw_ms:7.2f} ms  ({bf_ms/hnsw_ms:.0f}× tez)")
print(f"⭐ top-10 mos: {umumiy}/10  ({umumiy*10}% aniqlik)")
```

**Bizning o'lchovimiz:**

```
vektorlar   : 50,000 × 384
indekslash  : 8.0s
brute force :    2.05 ms
HNSW        :    1.30 ms  (2× tez)
⭐ top-10 mos: 3/10  (30% aniqlik)
```

## 💥 **IKKI KUTILMAGAN NATIJA:**

## ① **HNSW atigi 2× tez** — chunki numpy `V @ q` amali **BLAS/SIMD** bilan juda optimallashtirilgan.

## ② **Aniqlik 30%** — chunki **tasodifiy** vektorlar ishlatildi. Yuqori o'lchamda tasodifiy nuqtalar orasidagi masofalar **deyarli teng** *(o'lchamlar la'nati)*.

## 🏆 **HAQIQIY MA'LUMOTDA ANIQLIK ANCHA YUQORI** — haqiqiy embeddinglar **klasterlangan**.

## ⭐ **`V = model.encode(haqiqiy_matnlar)` BILAN QAYTA SINANG** — farqni ko'rasiz.

</details>

---

## 📌 Xulosa

```
Vektor DB = ID + VEKTOR + METADATA + ⭐ INDEKS

💥 all-MiniLM-L6-v2 → norma 1.0000  ✅ np.dot = kosinus
💥 multilingual     → norma 5.8556  ⚠️ normaga BO'LING

⚡ 680 vektor:  indekslash 0.2s · embedding 6.0s · qidiruv 1–2 ms
   → INDEKSLASH TEZ, EMBEDDING SEKIN

⚠️ HNSW — TAXMINIY (~98% aniq, 1000× tez)
🏆 < 1000 yozuv → shunchaki numpy: E @ q
🇺🇿 maxfiylik kerak → MAHALLIY Chroma/FAISS/Qdrant
```

---

⬅️ [2-dars. Bazalar taqqoslash](02-Database-Comparison.md) · 🏠 [Modul boshiga](README.md) · ➡️ [49-modul. Vektor fazosi](../49-Vector-Space-Basics/README.md)
