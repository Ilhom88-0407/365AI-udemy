# 14-dars. Similarity search ⭐⭐

## 🎬 Boshlashdan oldin

> **"`retrieved_docs = vectorstore.similarity_search(query=question, k=5)`"**

---

## 1. Kod va HAQIQIY natija

```python
import time

Q = "What programming languages do data scientists use?"

t0 = time.perf_counter()
docs = vs.similarity_search(query=Q, k=3)
print(f"qidiruv: {(time.perf_counter()-t0)*1000:.0f} ms")

for d in docs:
    print(f"  [{d.metadata.get('Lecture Title', '?')[:40]}] {d.page_content[:70]}")
```

```
qidiruv: 14 ms
  [Programming Languages & Software Employe] Thus, we need a lot of computational power...
  [Programming Languages & Software Employe] Great! We hope we gave you a good idea...
  [Programming Languages & Software Employe] What about big data? Apart from R and Python...
```

> ## ⚡ **14 MILLISEKUND.** Vektor qidiruv **juda tez** — kechikish **model chaqiruvida**, qidiruvda emas.
>
> ## ✅ **UCHALA BO'LAK HAM TO'G'RI DARSDAN** — semantik qidiruv **ishladi**.

---

## 2. ⭐⭐ Ballarni ko'ramiz — VA BU MUHIM

Kurs `similarity_search` ni ko'rsatadi, lekin **ballarni ko'rsatmaydi**. Biz ko'rsatamiz:

```python
for d, s in vs.similarity_search_with_score(query=Q, k=3):
    print(f"  {s:.4f}  {d.page_content[:60]}")
```

```
  12.4015  Thus, we need a lot of computational power, and we can expec
  15.2941  Great! We hope we gave you a good idea of the level of ap
  15.5754  What about big data? Apart from R and Python, people working
```

> ## 💥💥 **DIQQAT — BU KOSINUS EMAS!**
>
> ```
> Chroma standart holda  →  L2 (Evklid) MASOFASI
> Kichik ball            →  ⭐ YAQINROQ
> Katta ball             →  UZOQROQ
> ```
>
> ## ⚠️ **BU — 4-DARSDAGI KOSINUSNING TESKARISI:**
> ```
> Kosinus  →  1.0 = eng yaqin,  0.0 = bog'liq emas   (KATTA yaxshi)
> L2       →  0.0 = eng yaqin,  ∞   = uzoq            (KICHIK yaxshi)
> ```
>
> ## 💥 **AGAR SIZ `if ball > 0.7` DEB CHEGARA QO'YSANGIZ — HAMMASI O'TIB KETADI** *(chunki ballar 12–15)*. **Jim xato.**

### ✅ Kosinusga o'tkazish

```python
vs = Chroma.from_documents(
    documents=bolaklar, embedding=embedding,
    persist_directory="./db",
    collection_metadata={"hnsw:space": "cosine"})       # ⭐ kosinus masofasi
```

```
hnsw:space = "l2"      →  standart, Evklid masofasi
hnsw:space = "cosine"  →  ⭐ kosinus MASOFASI  (0 = yaqin, 2 = teskari)
hnsw:space = "ip"      →  skalyar ko'paytma
```

> ## ⚠️ **`cosine` DA HAM — KICHIK BALL YAXSHI.** Bu **kosinus masofasi** *(`1 − cos`)*, **o'xshashlik emas**.
>
> ## ✅ **O'XSHASHLIKKA AYLANTIRISH:**
> ```python
> oxshashlik = 1 - masofa        # cosine space uchun
> ```
>
> ## 🏆 **YOKI — `similarity_search_with_relevance_scores`:**
> ```python
> for d, s in vs.similarity_search_with_relevance_scores(query=Q, k=3):
>     print(f"{s:.4f}  {d.page_content[:50]}")     # ⭐ 0..1, KATTA yaxshi
> ```

---

## 3. ⚠️⚠️ Ball chegarasi — 31-MODULDAGI MUAMMONING YECHIMI

```python
def xavfsiz_qidiruv(vs, savol, k=3, min_oxshashlik=0.3):
    """Past ballli natijalarni RAD ETADI."""
    natija = vs.similarity_search_with_relevance_scores(query=savol, k=k)
    yaxshi = [(d, s) for d, s in natija if s >= min_oxshashlik]
    if not yaxshi:
        eng = max((s for _, s in natija), default=0)
        return {"topildi": False,
                "sabab": f"eng yaxshi ball {eng:.3f} < {min_oxshashlik}"}
    return {"topildi": True, "hujjatlar": [d for d, _ in yaxshi],
            "ballar": [round(s, 4) for _, s in yaxshi]}
```

> ## 💥 **31-MODULDA BUNI O'LCHAGAN EDIK:**
> ```
> Savol : "What is the weather in Tashkent?"
> Ball  : 0.487   ← past, lekin CHEGARASIZ o'tib ketdi
> Javob : 'rainy' ← MODEL YOLG'ON TO'QIDI
> ```
>
> ## 🏆 **CHEGARA — RAG'NING ENG MUHIM HIMOYASI.**
>
> ## ⚠️ **CHEGARANI O'LCHAB TANLANG:**
> ```
> ① 10–20 ta HAQIQIY savol tayyorlang (javobi bor va yo'q)
> ② Har biri uchun eng yuqori ballni yozing
> ③ "javobi bor" va "javobi yo'q" ballari orasidagi ORALIQNI toping
> ④ Chegarani o'sha oraliqning O'RTASIGA qo'ying
> ```
> **33-modulda AYNAN shunday qilgan edik** *(to'g'ri 0.60–0.99, xato 0.11–0.18 → chegara 0.30)*.

---

## 4. ⭐ `k` ni tanlash

| `k` | Qachon |
|---:|---|
| 1–2 | Aniq faktual savol |
| ## **3–5** | ## ⭐ **umumiy holat** |
| 5–10 | Keng savol, xulosa |
| > 10 | ⚠️ kontekst oynasi va **narx** |

> ## 💰 **HAR BO'LAK ~500 BELGI ≈ 125 TOKEN** *(🇺🇿 o'zbekchada ~200)*:
> ```
> k=3   →   375 token   (🇺🇿 600)
> k=10  →  1250 token   (🇺🇿 2000)
> ```
> ## 🔑 **`k` NI OSHIRISH — NARXNI OSHIRADI.** Va **sifatni ham** oshirmasligi mumkin: ortiqcha bo'laklar **shovqin** qiladi.

---

## 5. 🇺🇿 O'zbekcha qidiruv

```python
UZ_HUJJATLAR = [
    Document(page_content="Muddatli depozit yillik 18% dan 22% gacha foiz "
                          "keltiradi. Minimal summa 1 000 000 so'm.",
             metadata={"bolim": "depozit"}),
    Document(page_content="Debet karta 3 ish kunida tayyorlanadi. "
                          "Yillik xizmat haqi 50 000 so'm.",
             metadata={"bolim": "karta"}),
    Document(page_content="Iste'mol krediti 24 oygacha beriladi. "
                          "Yillik stavka 24% dan boshlanadi.",
             metadata={"bolim": "kredit"}),
]

uz_vs = Chroma.from_documents(UZ_HUJJATLAR, embedding,
                              collection_metadata={"hnsw:space": "cosine"})

for savol in ["Depozit foizi qancha?", "Karta qachon tayyor bo'ladi?",
              "Ob-havo qanday?"]:
    r = uz_vs.similarity_search_with_relevance_scores(savol, k=1)
    d, s = r[0]
    print(f"{savol:32s} → {s:.3f}  [{d.metadata['bolim']}]")
```

> ## 🔑 **UCHINCHI SAVOL** *("Ob-havo qanday?")* **PAST BALL OLISHI KERAK** — chunki hujjatlarda **javob yo'q**.
>
> ## 💥 **AGAR U YUQORI BALL OLSA — CHEGARANGIZ ISHLAMAYDI** va model **yolg'on to'qiydi** *(31-moduldagi holat)*.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `similarity_search` nechta hujjat qaytaradi?

**M2.** Chroma standart holda qanday masofa ishlatadi?

**M3.** Kichik ball yaxshimi yoki katta?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `k` **ta** *(standart 4)*.

**M2.** ## **L2 (Evklid)** — kosinus **emas**.

**M3.** ## **L2 va cosine masofada — KICHIK yaxshi.** `relevance_scores` da esa — **katta** yaxshi *(0..1)*.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Ballarni ko'ring va turini aniqlang.

<details>
<summary>✅ Yechim</summary>

```python
print("--- with_score (masofa) ---")
for d, s in vs.similarity_search_with_score(Q, k=3):
    print(f"  {s:8.4f}  {d.page_content[:50]}")

print("\n--- with_relevance_scores (0..1) ---")
try:
    for d, s in vs.similarity_search_with_relevance_scores(Q, k=3):
        print(f"  {s:8.4f}  {d.page_content[:50]}")
except Exception as e:
    print("  ⚠️", type(e).__name__, str(e)[:80])
```

## 🔑 **BIRINCHISIDA KATTA RAQAMLAR (12–15) — MASOFA. IKKINCHISIDA 0..1 — O'XSHASHLIK.**

</details>

**M5.** ⭐ `hnsw:space="cosine"` bilan bazani qayta yarating.

<details>
<summary>✅ Yechim</summary>

```python
import shutil
shutil.rmtree("./cos-db", ignore_errors=True)
cos_vs = Chroma.from_documents(
    documents=pages_char_split, embedding=embedding,
    persist_directory="./cos-db",
    collection_metadata={"hnsw:space": "cosine"})

print("--- L2 ---")
for d, s in vs.similarity_search_with_score(Q, k=3):
    print(f"  {s:8.4f}")
print("--- cosine ---")
for d, s in cos_vs.similarity_search_with_score(Q, k=3):
    print(f"  {s:8.4f}")
```

## 💡 **`cosine` da ballar 0..2 oralig'ida** *(0 = aynan bir xil)*.

</details>

**M6.** ⭐⭐ Chegarani o'lchab tanlang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

SINOVLAR = [
    ("What programming languages do data scientists use?", True),
    ("What software do data scientists use?", True),
    ("What is analysis vs analytics?", True),
    ("What is the weather in Tashkent?", False),     # javob YO'Q
    ("How do I cook pasta?", False),                 # javob YO'Q
    ("Who won the World Cup?", False),               # javob YO'Q
]

q = []
for savol, javob_bor in SINOVLAR:
    r = cos_vs.similarity_search_with_relevance_scores(savol, k=1)
    q.append({"savol": savol[:38], "javob_bor": javob_bor,
              "eng_yaxshi_ball": round(r[0][1], 4) if r else None})
d = pd.DataFrame(q)
print(d.to_string(index=False))

bor = d[d.javob_bor].eng_yaxshi_ball
yoq = d[~d.javob_bor].eng_yaxshi_ball
print(f"\njavob BOR : min {bor.min():.4f}  max {bor.max():.4f}")
print(f"javob YO'Q: min {yoq.min():.4f}  max {yoq.max():.4f}")
if bor.min() > yoq.max():
    ch = (bor.min() + yoq.max()) / 2
    print(f"🏆 CHEGARA: {ch:.4f}  (oraliq {bor.min()-yoq.max():.4f})")
else:
    print("⚠️ ORALIQ YO'Q — ballar bir-biriga kirib ketgan.")
    print("   → embedding modelini almashtiring yoki bo'laklashni yaxshilang")
```

## 🏆 **33-MODULDAGI USUL** — to'g'ri va xato javoblar **oralig'ini** toping.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Xavfsiz qidiruv sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

class XavfsizQidiruv:
    """Ball chegarasi + jurnal + tashxis."""

    def __init__(self, vs, min_ball=0.3, k=3):
        self.vs, self.min_ball, self.k = vs, min_ball, k
        self.jurnal = []

    def qidir(self, savol, k=None, min_ball=None):
        k = k or self.k
        mb = self.min_ball if min_ball is None else min_ball
        try:
            n = self.vs.similarity_search_with_relevance_scores(savol, k=k)
        except Exception:
            # relevance qo'llab-quvvatlanmasa — masofani teskari aylantiramiz
            n = [(d, 1 / (1 + s))
                 for d, s in self.vs.similarity_search_with_score(savol, k=k)]

        yaxshi = [(d, s) for d, s in n if s >= mb]
        eng = max((s for _, s in n), default=0.0)

        yozuv = {"savol": savol[:36], "topildi": len(n),
                 "chegaradan_otgan": len(yaxshi),
                 "eng_yaxshi": round(eng, 4), "chegara": mb}
        self.jurnal.append(yozuv)

        if not yaxshi:
            return {"ok": False,
                    "sabab": f"eng yaxshi ball {eng:.3f} < {mb}",
                    "eng_yaxshi": eng}
        return {"ok": True, "hujjatlar": [d for d, _ in yaxshi],
                "ballar": [round(s, 4) for _, s in yaxshi],
                "eng_yaxshi": eng}

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        rad = (d.chegaradan_otgan == 0).mean()
        print(f"\nrad etilgan: {rad:.0%}")
        if rad > 0.3:
            print("⚠️ ko'p savol RAD ETILMOQDA — chegarani pasaytiring "
                  "yoki hujjatlarni to'ldiring")
        if rad == 0:
            print("⚠️ HECH BIRI rad etilmadi — chegara JUDA PAST bo'lishi mumkin")
        return d
```

## 🏆 **`hisobot()` DAGI IKKI OGOHLANTIRISH — SOZLASHNING KALITI.**

</details>

---

## 📌 Xulosa

```python
vs.similarity_search(query=Q, k=3)                      # hujjatlar
vs.similarity_search_with_score(query=Q, k=3)           # ⚠️ MASOFA (12–15)
vs.similarity_search_with_relevance_scores(query=Q, k=3)  # ⭐ 0..1
```

```
💥 Chroma standart = L2 MASOFA, kosinus EMAS
   → 12.4015 · 15.2941 · 15.5754      (KICHIK yaxshi)
✅ collection_metadata={"hnsw:space": "cosine"}
⚡ 14 ms — qidiruv TEZ, kechikish MODEL chaqiruvida
🏆 BALL CHEGARASI — RAG'ning eng muhim himoyasi (31-modul)
```

---

⬅️ [13-dars. Hujjatlarni boshqarish](13-Managing-Documents.md) · 🏠 [Modul boshiga](README.md) · ➡️ [15-dars. MMR qidiruv](15-MMR-Search.md)
