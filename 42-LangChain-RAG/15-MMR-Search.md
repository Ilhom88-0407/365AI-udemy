# 15-dars. Maximal Marginal Relevance (MMR) ⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu algoritm foydalanuvchi so'roviga MOS hujjatlarni olish va allaqachon olingan hujjatlarga nisbatan KAM TAKRORLANADIGAN hujjatlarni olish orasidagi MUVOZANATNI topishga qaratilgan."**

---

## 1. Formula

> **"Moslik va xilma-xillik orasidagi chiziqli kombinatsiya MARGINAL MOSLIK deb ataladi *(Carbonell va Goldstein, 1998)*."**

```
MMR = λ × MOSLIK  +  (1 − λ) × XILMA-XILLIK
```

| `λ` | Ta'siri |
|---:|---|
| ## **1.0** | ## Faqat **moslik** *(= `similarity_search`)* |
| **0.7** | ## ⭐ **muvozanat** *(tavsiya)* |
| **0.5** | teng |
| ## **0.0** | ## Faqat **xilma-xillik** *(moslik e'tiborsiz)* |

---

## 2. 🔬 λ ning ta'sirini O'LCHADIK

```python
Q = "What programming languages do data scientists use?"

for lam in [1.0, 0.7, 0.0]:
    docs = vs.max_marginal_relevance_search(query=Q, k=3, lambda_mult=lam)
    print(f"lambda={lam}:")
    for d in docs:
        print(f"    {d.page_content[:66]}")
```

```
lambda=1.0:
    Thus, we need a lot of computational power, and we can expect peop
    Great! We hope we gave you a good idea about the level of applicab
    What about big data? Apart from R and Python, people working in th

lambda=0.7:
    Thus, we need a lot of computational power, and we can expect peop
    Great! We hope we gave you a good idea about the level of applicab
    It’s actually a software framework which was designed to address t     ← ⭐ YANGI

lambda=0.0:
    Thus, we need a lot of computational power, and we can expect peop
    In terms of predictive analytics, EViews is mostly used for workin     ← boshqa mavzu
    You may use this intuition to decide on which styles of clothing t     ← ❌ MUTLAQO ALOQASIZ
```

> ## ✅✅ **KURSNING UCHALA DA'VOSI HAM TASDIQLANDI:**
> ```
> λ = 1.0  →  similarity_search bilan AYNAN BIR XIL          ✅
> λ = 0.7  →  uchinchi hujjat O'ZGARDI, YANGI ma'lumot keldi ✅
> λ = 0.0  →  natijalar JUDA XILMA-XIL va ALOQASIZ           ✅
> ```

> ## 💥 **`λ = 0.0` DAGI UCHINCHI NATIJAGA E'TIBOR BERING:**
> ```
> "You may use this intuition to decide on which styles of clothing t..."
> ```
> **Savol dasturlash tillari haqida, javob esa — kiyim uslublari haqida.** Bu — **xilma-xillikning haddan tashqari ko'pligi**.

---

## 3. ⭐ `filter` — metadata bo'yicha cheklash

```python
docs = vs.max_marginal_relevance_search(
    query="What software do data scientists use?",
    k=3, lambda_mult=1,
    filter={"Lecture Title": "Programming Languages & Software Employed "
                             "in Data Science - All the Tools You Need"})
```

```
topildi: 3
   Great! We hope we gave you a good idea about the level of applicab
   It’s actually a software framework which was designed to address t
   Their smaller scope does not make them less useful, in fact, just
```

> ## ✅ **HAMMA NATIJA KERAKLI DARSDAN.** Filtr **ishladi**.
>
> ## 🏆 **VA BU — 10-DARSDAGI `MarkdownHeaderTextSplitter` TUFAYLI.** Usiz `Lecture Title` metadatasi **bo'lmasdi**.

> ## ⭐ **FILTR — RAG'NING ENG KUCHLI VA ENG KAM ISHLATILADIGAN VOSITASI:**
> ```python
> # Faqat yangi hujjatlar
> filter={"yil": {"$gte": 2024}}
>
> # 🇺🇿 Faqat o'zbekcha  (4-dars: tillar orasi ZAIF!)
> filter={"til": "uz"}
>
> # Bir necha shart
> filter={"$and": [{"bolim": "depozit"}, {"til": "uz"}]}
> ```
>
> ## 💡 **METADATA FILTRI QIDIRUV MAYDONINI KESKIN QISQARTIRADI** va **aniqlikni oshiradi**. Bu — chegaradan ham **arzonroq** yaxshilanish.

---

## 4. ⚠️ MMR narxi

```
similarity_search  →  k ta hujjat OLADI
MMR                →  fetch_k ta oladi (standart 20), keyin k tasini TANLAYDI
```

```python
vs.max_marginal_relevance_search(query=Q, k=3,
                                 fetch_k=20,          # ⭐ nechta NOMZOD
                                 lambda_mult=0.7)
```

> ## 🔑 **`fetch_k` — KATTA BO'LSA:**
> ```
> ✅ Xilma-xillik uchun KO'PROQ tanlov
> ⚠️ Sekinroq (lekin baribir millisekundlar)
> ```
> ## 💡 **`fetch_k` odatda `k` ning 5–10 baravari.** `k=3` uchun `fetch_k=20` — **yaxshi standart**.

---

## 5. ⭐⭐ Qachon MMR, qachon similarity?

| Vaziyat | Tanlov |
|---|---|
| Aniq faktual savol *("depozit foizi qancha?")* | ## `similarity` yoki `λ=1.0` |
| Keng savol *("bank qanday xizmatlar ko'rsatadi?")* | ## ⭐ **MMR `λ=0.5–0.7`** |
| Bazada **dublikatlar** bor | ## ⭐ **MMR** |
| Bazada dublikat **yo'q** | `similarity` **yetadi** |
| Xulosa yozish | ## MMR `λ=0.5` |

> ## 🏆 **AMALIY STANDART: `search_type="mmr"`, `lambda_mult=0.7`.**
>
> ## 💡 **VA ENG YAXSHI YECHIM — DUBLIKATLARNI UMUMAN QO'YMASLIK** *(13-dars: barqaror ID)*. MMR — **dublikatga qarshi plastir**, **davo emas**.

---

## 6. 🇺🇿 O'zbekcha misol

```python
UZ = [
    Document(page_content="Muddatli depozit yillik 18% dan 22% gacha foiz "
                          "keltiradi.", metadata={"bolim": "depozit"}),
    Document(page_content="Muddatli depozit yillik 18% dan 22% gacha foiz "
                          "keltiradi.", metadata={"bolim": "depozit"}),  # DUBLIKAT
    Document(page_content="Depozit minimal summasi 1 000 000 so'm.",
             metadata={"bolim": "depozit"}),
    Document(page_content="Depozit muddati 6 oydan 36 oygacha.",
             metadata={"bolim": "depozit"}),
]
uz_vs = Chroma.from_documents(UZ, embedding,
                              collection_metadata={"hnsw:space": "cosine"})

Q = "Depozit haqida ma'lumot bering"
print("--- similarity (k=3) ---")
for d in uz_vs.similarity_search(Q, k=3):
    print("  ", d.page_content[:50])

print("\n--- MMR (k=3, lambda=0.5) ---")
for d in uz_vs.max_marginal_relevance_search(Q, k=3, lambda_mult=0.5):
    print("  ", d.page_content[:50])
```

> ## 🔑 **`similarity` DUBLIKATNI IKKI MARTA QAYTARISHI MUMKIN. MMR — YO'Q.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** MMR formulasi?

**M2.** `λ=1.0` nima beradi?

**M3.** `fetch_k` nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `λ × moslik + (1−λ) × xilma-xillik`.

**M2.** ## Aynan `similarity_search` — xilma-xillik **o'chirilgan**.

**M3.** Nechta **nomzod** olinadi *(standart 20)*, keyin ulardan `k` tasi **tanlanadi**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ λ ning ta'sirini o'zingiz o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

Q = "What programming languages do data scientists use?"
q = []
for lam in [0.0, 0.3, 0.5, 0.7, 1.0]:
    docs = vs.max_marginal_relevance_search(Q, k=3, lambda_mult=lam)
    matnlar = [d.page_content for d in docs]
    q.append({"lambda": lam,
              "noyob": len(set(matnlar)),
              "1-natija": matnlar[0][:36],
              "3-natija": matnlar[2][:36]})
print(pd.DataFrame(q).to_string(index=False))
```

## 🔑 **`1-natija` HAMMA λ DA BIR XIL** *(eng mos)*, **`3-natija` esa o'zgaradi**.

</details>

**M5.** ⭐ Filtrni sinang.

<details>
<summary>✅ Yechim</summary>

```python
hammasi = vs.get()
from collections import Counter
c = Counter(m.get("Lecture Title", "?") for m in hammasi["metadatas"])
for k, v in c.items():
    print(f"  {v:3d}  {k[:56]}")

dars = list(c)[0]
docs = vs.max_marginal_relevance_search(
    "What software do data scientists use?", k=3, filter={"Lecture Title": dars})
print(f"\nfiltr '{dars[:40]}' bo'yicha: {len(docs)}")
for d in docs:
    print("  ", d.page_content[:56])
```

</details>

**M6.** ⭐⭐ Dublikat muammosini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.documents import Document

D = [Document(page_content="Depozit yillik 18% foiz keltiradi."),
     Document(page_content="Depozit yillik 18% foiz keltiradi."),   # DUBLIKAT
     Document(page_content="Depozit minimal summasi 1 000 000 so'm."),
     Document(page_content="Depozit muddati 6 oydan 36 oygacha.")]
t = Chroma.from_documents(D, embedding)

Q = "Depozit haqida ma'lumot"
s = [d.page_content for d in t.similarity_search(Q, k=3)]
m = [d.page_content for d in t.max_marginal_relevance_search(Q, k=3, lambda_mult=0.5)]

print("similarity noyob:", len(set(s)), "/3")
print("MMR noyob       :", len(set(m)), "/3")
for x in s:
    print("  s:", x[:44])
for x in m:
    print("  m:", x[:44])
```

## 🏆 **MMR NOYOB NATIJALAR SONINI OSHIRADI.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Optimal λ ni o'lchab toping.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd

def lambda_izla(vs, embedding, savollar, k=3,
                lambdalar=(0.0, 0.3, 0.5, 0.7, 1.0)):
    """Har lambda uchun: qamrov (noyoblik) va moslik."""
    q = []
    for lam in lambdalar:
        noyob_ulush, moslik = [], []
        for s in savollar:
            docs = vs.max_marginal_relevance_search(s, k=k, lambda_mult=lam)
            matnlar = [d.page_content for d in docs]
            noyob_ulush.append(len(set(matnlar)) / max(1, len(matnlar)))
            vq = np.array(embedding.embed_query(s))
            vq = vq / np.linalg.norm(vq)
            V = np.array(embedding.embed_documents(matnlar))
            V = V / np.linalg.norm(V, axis=1, keepdims=True)
            moslik.append(float((V @ vq).mean()))
        q.append({"lambda": lam,
                  "noyoblik": round(np.mean(noyob_ulush), 3),
                  "o'rt_moslik": round(np.mean(moslik), 4)})
    d = pd.DataFrame(q)
    d["ball"] = (d["o'rt_moslik"] * d.noyoblik).round(4)
    print(d.to_string(index=False))
    eng = d.loc[d.ball.idxmax()]
    print(f"\n🏆 ENG YAXSHI lambda = {eng['lambda']}")
    print("💡 'ball' = moslik × noyoblik — ikkalasini birga o'lchaydi")
    return d

lambda_izla(vs, embedding, [
    "What programming languages do data scientists use?",
    "What software do data scientists use?",
    "What is the difference between analysis and analytics?"])
```

## 🏆 **`ball = moslik × noyoblik`** — MMR ning ikkala maqsadini **bitta raqamda** o'lchaydi.

## ⚠️ **BU — AVTOMATIK BAHO.** Yakuniy qarorni **haqiqiy javob sifati** bilan tekshiring.

</details>

---

## 📌 Xulosa

```python
vs.max_marginal_relevance_search(query=Q, k=3,
                                 fetch_k=20,        # nomzodlar
                                 lambda_mult=0.7,   # ⭐ moslik ↔ xilma-xillik
                                 filter={"bolim": "depozit"})   # ⭐ metadata
```

```
λ = 1.0  →  similarity bilan AYNAN BIR XIL         ✅ o'lchandi
λ = 0.7  →  3-natija O'ZGARDI, yangi ma'lumot      ✅ ⭐ tavsiya
λ = 0.0  →  "kiyim uslublari" — ALOQASIZ            ✅ juda xilma-xil
```

> ## 🏆 **AMALIY STANDART:** `search_type="mmr"`, `lambda_mult=0.7`.
>
> ## 💡 **`filter` — ENG KUCHLI VA ENG KAM ISHLATILADIGAN VOSITA.** 🇺🇿 Ayniqsa **til bo'yicha** ajratishda *(4-dars: tillar orasi zaif)*.

---

⬅️ [14-dars. Similarity search](14-Similarity-Search.md) · 🏠 [Modul boshiga](README.md) · ➡️ [16-dars. Retriever](16-Vectorstore-Backed-Retriever.md)
