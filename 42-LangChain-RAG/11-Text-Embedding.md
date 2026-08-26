# 11-dars. Matn embeddingi — kod ⭐⭐

## 🎬 Boshlashdan oldin

> **"`embedding = OpenAIEmbeddings(model='text-embedding-ada-002')`"**

---

## 1. ⚠️ Kursning modeli ESKIRGAN

```python
# KURSDAGI KOD
from langchain_openai.embeddings import OpenAIEmbeddings
embedding = OpenAIEmbeddings(model="text-embedding-ada-002")
```

> ## ⚠️ **`text-embedding-ada-002` — 2022-YILGI MODEL.**
>
> | Model | O'lcham | Narx 1M | Holat |
> |---|---:|---:|---|
> | `text-embedding-ada-002` | 1536 | $0.10 | ## ⚠️ **eskirgan** |
> | ## `text-embedding-3-small` | 1536 | ## **$0.02** | ## ✅ **5× arzon, sifatliroq** |
> | `text-embedding-3-large` | 3072 | $0.13 | eng sifatli |
>
> ## ✅ **BUGUNGI KOD:**
> ```python
> embedding = OpenAIEmbeddings(model="text-embedding-3-small")
> ```
> **5× arzon va sifatliroq** — almashtirmaslikning **hech qanday sababi yo'q**.

---

## 2. ⭐⭐ BEPUL MUQOBIL — mahalliy embedding

Bu — kursda **yo'q**, lekin **eng muhim** qism.

```bash
pip install langchain-huggingface sentence-transformers
```

```python
from langchain_huggingface import HuggingFaceEmbeddings
import numpy as np, time

t0 = time.perf_counter()
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
print(f"model yuklandi: {time.perf_counter()-t0:.1f}s")

v = embedding.embed_query("test")
print("o'lcham:", len(v), " norma:", round(float(np.linalg.norm(v)), 4))
```

```
model yuklandi: 42.5s
o'lcham: 384  norma: 5.8556
```

> ## 🏆 **UCHTA AFZALLIK:**
> ```
> ✅ BEPUL          →  cheksiz indekslash
> ✅ MAXFIY         →  hujjatlaringiz SERVERINGIZDA qoladi   ← 🇺🇿 HAL QILUVCHI
> ✅ 50 TILDA       →  o'zbekcha ISHLAYDI (o'lchandi)
> ```
> ## ⚠️ **NARXI:** birinchi yuklash **42.5s** *(keyin keshdan)*, o'lcham **384** *(OpenAI'da 1536)*.

> ## 💥💥 **VA 4-DARSDAGI OGOHLANTIRISH:** norma **5.86**, `1.0` **emas**. `np.dot` **kosinus emas** — **doim normaga bo'ling**.

---

## 3. Kursning taqqoslash kodi

```python
vector1 = embedding.embed_query(pages_char_split[3].page_content)
vector2 = embedding.embed_query(pages_char_split[5].page_content)
vector3 = embedding.embed_query(pages_char_split[18].page_content)

print(len(vector1), len(vector2), len(vector3))
print(np.dot(vector1, vector2), np.dot(vector1, vector3), np.dot(vector2, vector3))
print(np.linalg.norm(vector1), np.linalg.norm(vector2), np.linalg.norm(vector3))
```

> ## ⚠️ **KURS `np.dot` NI ISHLATADI VA `np.linalg.norm` NI CHIQARADI** — chunki OpenAI'da norma **1.0**, ya'ni `dot = cos`.
>
> ## ✅ **UNIVERSAL VARIANT:**
> ```python
> def kosinus(a, b):
>     a, b = np.array(a), np.array(b)
>     return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
> ```
> **Har ikki holatda ham to'g'ri ishlaydi.**

---

## 4. ⭐ `embed_query` va `embed_documents`

```python
v1 = embedding.embed_query("bitta matn")            # → list[float]
vs = embedding.embed_documents(["a", "b", "c"])     # → list[list[float]]
```

> ## 🔑 **`embed_documents` — BATCH, YA'NI ANCHA TEZ.** Indekslashda **doim** uni ishlating *(`Chroma.from_documents` buni **avtomatik** qiladi)*.
>
> ## ⚠️ **VA BA'ZI MODELLARDA ULAR HAR XIL PREFIKS QO'SHADI** *(masalan `e5` oilasi: `"query: "` va `"passage: "`)*. Shuning uchun **`embed_query` ni savol uchun**, **`embed_documents` ni hujjatlar uchun** ishlating — aralashtirmang.

---

## 5. 🇺🇿 O'zbekcha — 4-darsdagi o'lchov

```
bank     ↔ kredit     cos = 0.6898     ✅✅ ENG YUQORI
mushuk   ↔ it         cos = 0.4903     ✅
mushuk   ↔ avtomobil  cos = 0.3155     ✅ pastroq
bank     ↔ osmon      cos = 0.2180     ✅ eng past
cat      ↔ mushuk     cos = 0.2829     ❌ TILLAR ORASI ZAIF
```

> ## 🏆 **O'ZBEKCHA ICHIDA — ISHLAYDI.** `bank↔kredit` / `bank↔osmon` = **3.2× farq**.
>
> ## 💥 **TILLAR ORASIDA — ZAIF.** Hujjat va savol **bir tilda** bo'lsin.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Kurs qaysi embedding modelini ishlatadi?

**M2.** Bugun qaysi biri tavsiya etiladi?

**M3.** Mahalliy embedding normasi qancha?

<details>
<summary>✅ Javoblar</summary>

**M1.** `text-embedding-ada-002` — ## **2022-yilgi, eskirgan**.

**M2.** ## `text-embedding-3-small` — **5× arzon** va sifatliroq. Yoki ## **mahalliy** *(bepul, maxfiy)*.

**M3.** ## **5.8556** — `1.0` **emas**. `np.dot` ≠ kosinus.

</details>

### 🟡 O'rta

**M4.** ⭐ Bo'laklarni embedding qiling va taqqoslang.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np

def kosinus(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

idx = [3, 5, 18]
vs = [embedding.embed_query(pages_char_split[i].page_content) for i in idx]
print("o'lchamlar:", [len(v) for v in vs])
print("normalar  :", [round(float(np.linalg.norm(v)), 3) for v in vs])
for a in range(len(idx)):
    for b in range(a + 1, len(idx)):
        print(f"  {idx[a]} ↔ {idx[b]}:  kosinus {kosinus(vs[a], vs[b]):.4f}")
```

## 🔑 **BIR MAVZUDAGI BO'LAKLAR YUQORI, TURLICHASI PAST bo'lishi kerak.**

</details>

**M5.** ⭐ `embed_query` va `embed_documents` tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time
matnlar = [d.page_content for d in pages_char_split[:20]]

t0 = time.perf_counter()
[embedding.embed_query(m) for m in matnlar]
print(f"embed_query × 20    : {time.perf_counter()-t0:.2f}s")

t0 = time.perf_counter()
embedding.embed_documents(matnlar)
print(f"embed_documents(20) : {time.perf_counter()-t0:.2f}s")
```

## 🏆 **`embed_documents` ANCHA TEZ** — batch.

</details>

**M6.** ⭐⭐ Bo'laklar orasidagi o'xshashlik matritsasini chizing.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd

n = 8
V = np.array(embedding.embed_documents(
    [d.page_content for d in pages_char_split[:n]]))
V = V / np.linalg.norm(V, axis=1, keepdims=True)      # ⭐ normallashtirish
M = V @ V.T

d = pd.DataFrame(M.round(2),
                 index=[f"b{i}" for i in range(n)],
                 columns=[f"b{i}" for i in range(n)])
print(d.to_string())

np.fill_diagonal(M, 0)
i, j = np.unravel_index(M.argmax(), M.shape)
print(f"\nENG O'XSHASH juftlik: b{i} ↔ b{j}  ({M[i,j]:.3f})")
if M[i, j] > 0.95:
    print("💥 DUBLIKAT bo'lishi mumkin — 15-darsdagi MMR kerak!")
```

## 🏆 **DUBLIKATLARNI SHU YERDA TOPING** — vektor bazasiga qo'yishdan **oldin**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Embedding modellarini vazifangizda solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd, time

MODELLAR = ["sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
            "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"]

# O'z domeningizdagi juftliklar
SINOV = [("depozit foizi qancha", "muddatli depozit yillik 18% foiz", True),
         ("depozit foizi qancha", "karta 3 kunda tayyorlanadi", False),
         ("karta qachon tayyor", "debet karta 3 ish kunida", True),
         ("karta qachon tayyor", "kredit 24 oygacha beriladi", False)]

q = []
for m in MODELLAR:
    try:
        t0 = time.perf_counter()
        e = HuggingFaceEmbeddings(model_name=m)
        yuk = time.perf_counter() - t0
        ballar = []
        for a, b, mos in SINOV:
            va, vb = e.embed_query(a), e.embed_query(b)
            ballar.append((kosinus(va, vb), mos))
        mos_o = np.mean([s for s, m2 in ballar if m2])
        nomos_o = np.mean([s for s, m2 in ballar if not m2])
        q.append({"model": m.split("/")[-1][:32],
                  "o'lcham": len(e.embed_query("x")),
                  "yuklash_s": round(yuk, 1),
                  "mos": round(mos_o, 3), "nomos": round(nomos_o, 3),
                  "ajratish": round(mos_o - nomos_o, 3)})
    except Exception as ex:
        q.append({"model": m.split("/")[-1][:32], "xato": type(ex).__name__})

d = pd.DataFrame(q)
print(d.to_string(index=False))
if "ajratish" in d:
    print(f"\n🏆 ENG YAXSHI: {d.loc[d.ajratish.idxmax(), 'model']}")
```

## 🏆 **`ajratish` — EMBEDDING MODELINI TANLASHNING ENG AMALIY MEZONI.**

## ⚠️ **O'Z DOMENINGIZDAGI JUFTLIKLARNI ISHLATING** — umumiy sinovlar sizning vazifangizni **ko'rsatmaydi**.

</details>

---

## 📌 Xulosa

```python
# ⚠️ Kurs
OpenAIEmbeddings(model="text-embedding-ada-002")     # 2022, $0.10/1M

# ✅ Bugun
OpenAIEmbeddings(model="text-embedding-3-small")     # $0.02/1M, 5× arzon

# ⭐⭐ BEPUL va MAXFIY
HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
```

```
o'lcham 384 · norma 5.8556  →  💥 np.dot ≠ kosinus, NORMAGA BO'LING
🇺🇿 bank↔kredit 0.6898 · bank↔osmon 0.2180  →  ✅ o'zbekcha ISHLAYDI
🇺🇿 cat↔mushuk 0.2829                        →  💥 tillar orasi ZAIF
```

---

⬅️ [10-dars. MarkdownHeaderSplitter](10-Markdown-Header-Text-Splitter.md) · 🏠 [Modul boshiga](README.md) · ➡️ [12-dars. Chroma vectorstore](12-Creating-Chroma-Vectorstore.md)
