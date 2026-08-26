# 5-dars. Embedding algoritmlarini tanlash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu model AYNAN SEMANTIK QIDIRUV uchun o'qitilgan — biz esa aynan shuni qilmoqchimiz."**

---

## 1. 🔬 Uch modelni haqiqiy ma'lumotda solishtirdik

```python
MODELLAR = ["all-MiniLM-L6-v2", "all-mpnet-base-v2",
            "paraphrase-multilingual-MiniLM-L12-v2"]
```

```
                             model  o'lcham  maks_tok  norma aniqlik  mos_o'rt  nomos_o'rt  ajratish  emb_s  yuk_s
                  all-MiniLM-L6-v2      384       256  1.000     6/8    0.6646       0.205    0.4596    2.9   11.8
                 all-mpnet-base-v2      768       384  1.000     7/8    0.7158       0.217    0.4988   22.5   28.4
paraphrase-multilingual-MiniLM-L12      384       128  5.083     6/8    0.7007       0.283    0.4177    5.2    7.0
```

> ## 🏆🏆 **BEShTA MUHIM TOPILMA:**
>
> ### ① `all-mpnet-base-v2` **eng aniq** — 7/8, ajratish **0.4988**
> ```
> LEKIN: 768 o'lcham (2× joy) · embedding 22.5s (7.8× sekin)
> ```
> ## 💡 **KURSNING TANLOVI TO'G'RI** — u aynan **768 o'lchamli semantik qidiruv modelini** tavsiya qiladi.
>
> ### ② `paraphrase-multilingual` — **maks 128 token**
> ```
> 💥 all-MiniLM-L6-v2 dan IKKI BARAVAR kam!
> ```
> ## ⚠️ **BU — KUTILMAGAN.** Ko'p tilli model **qisqaroq kontekst** oynasiga ega.
>
> ### ③ Uning **normasi 5.083** — normallashmagan
> ```
> 💥 np.dot ≠ kosinus  →  normaga BO'LING
> ```
>
> ### ④ `nomos_o'rt` — **ko'p tilli modelda eng yuqori** *(0.283)*
> ```
> Ya'ni u "javobi yo'q" savollarga ham YUQORIROQ ball beradi
> →  ajratish PASAYADI (0.4177)
> →  ⚠️ chegara qo'yish qiyinroq
> ```
>
> ### ⑤ ⭐ **`ajratish` — ENG MUHIM KO'RSATKICH**
> ```
> ajratish = mos_o'rt − nomos_o'rt
> KATTA  →  chegara qo'yish OSON, natija ishonchli
> KICHIK →  mos va nomos ballar ARALASH
> ```

---

## 2. ⭐ Model tanlash mezonlari

| Mezon | Nima uchun |
|---|---|
| ## ⭐ **Aniqlik** | Kerakli natija topiladimi |
| ## ⭐⭐ **Ajratish** | ## Chegara qo'yish **oson-qiyinligi** |
| **O'lcham** | 💾 Xotira va tezlik |
| ## **Kontekst oynasi** | ## 💥 Matn **kesiladimi** |
| **Tezlik** | ⏱️ Indekslash vaqti |
| ## 🇺🇿 **Til** | ## **Hal qiluvchi** |
| Normallashganmi | `dot` = kosinus mi |

> ## 💥 **KURS FAQAT "O'LCHAM" VA "SEMANTIK QIDIRUV UCHUN O'QITILGAN"NI AYTADI.** Qolgan mezonlar — **kursda yo'q**.

---

## 3. 💥💥 Eng muhim 🇺🇿 o'lchov

```python
UZ = ["Python dasturlash", "ma'lumotlarni vizualizatsiya qilish",
      "mashinali o'qitish", "chuqur o'rganish",
      "ma'lumotlar bazasi so'rovlari"]
EN = ["Python programming", "data visualization", "machine learning",
      "deep learning", "database queries"]
```

```
                             model til   o'rt    min   maks
                  all-MiniLM-L6-v2  UZ 0.2371 0.1620 0.4080
                  all-MiniLM-L6-v2  EN 0.6141 0.5500 0.7197
paraphrase-multilingual-MiniLM-L12  UZ 0.5541 0.4757 0.6997
paraphrase-multilingual-MiniLM-L12  EN 0.6938 0.6611 0.7215

  all-MiniLM-L6-v2                   UZ/EN = 0.39
  paraphrase-multilingual-MiniLM-L12 UZ/EN = 0.80
```

> ## 💥💥💥 **`all-MiniLM-L6-v2` DA O'ZBEKCHA SO'ROVLAR INGLIZCHANING ATIGI 39% BALLINI OLDI.**
>
> ## 🏆 **KO'P TILLI MODELDA — 80%.**
>
> ## 🔑 **YA'NI: 🇺🇿 LOYIHADA MODELNI ALMASHTIRISH — 2× YAXSHILANISH.**
>
> ## ⚠️ **VA E'TIBOR BERING — HUJJATLAR INGLIZCHA.** Ko'p tilli model **tillar orasidagi** ma'noni topa oldi. Bu — **kuchli natija**.
>
> ## 💡 **AGAR HUJJATLAR HAM O'ZBEKCHA BO'LSA — natija YANADA yaxshi bo'ladi** *(42-modul, 4-dars: `bank↔kredit` **0.6898**)*.

---

## 4. ⭐ Kursning modellar haqidagi izohi

Kurs *"Embedding Algorithms"* darsida bir necha oilani sanaydi. **Bugungi holat:**

| Oila | Misol | Bugungi holat |
|---|---|---|
| Word2Vec / GloVe | `word2vec-google-news` | ## ⚠️ **eskirgan** — kontekstni bilmaydi |
| BERT asosidagi | `all-mpnet-base-v2` | ## ⭐ **hali ham kuchli** |
| Sentence-BERT | `all-MiniLM-L6-v2` | ## ⭐ **tez va sifatli** |
| Ko'p tilli | `paraphrase-multilingual` · `LaBSE` | ## 🇺🇿 **biz uchun** |
| E5 / BGE oilasi | `multilingual-e5-large` · `bge-m3` | ## 🏆 **bugungi eng yaxshisi** |
| API | `text-embedding-3-small/large` | ☁️ pulli, sifatli |

> ## ⚠️ **`e5` VA `bge` OILASI — KURSDA YO'Q** *(kurs yozilganda ular yangi edi)*.
>
> ## 🔑 **`e5` OILASINING XUSUSIYATI — PREFIKS:**
> ```python
> # ⭐ e5 modellari PREFIKS talab qiladi
> hujjat_v = model.encode("passage: " + matn)
> savol_v  = model.encode("query: " + savol)
> ```
> ## 💥 **PREFIKSSIZ — SIFAT SEZILARLI PASAYADI.** Bu **hujjatlarda yozilgan**, lekin **osongina o'tkazib yuboriladi**.

---

## 5. ⭐⭐ To'g'ri tanlash usuli

```python
import numpy as np, time, pandas as pd
from sentence_transformers import SentenceTransformer


def model_bahola(model_nomi, matnlar, sinovlar, yoq_savollar,
                 nom_ustuni, df, prefiks_hujjat="", prefiks_savol=""):
    """Modelni SIZNING ma'lumotingizda to'liq baholaydi."""
    t0 = time.perf_counter()
    m = SentenceTransformer(model_nomi)
    yuk = time.perf_counter() - t0

    t0 = time.perf_counter()
    E = m.encode([prefiks_hujjat + x for x in matnlar],
                 show_progress_bar=False, batch_size=64)
    emb = time.perf_counter() - t0
    En = E / np.linalg.norm(E, axis=1, keepdims=True)      # ⭐ SHART

    togri, mos_b = 0, []
    for savol, kutilgan in sinovlar:
        q = m.encode(prefiks_savol + savol)
        q = q / np.linalg.norm(q)
        b = En @ q
        i = int(np.argmax(b))
        mos_b.append(float(b[i]))
        togri += int(kutilgan.lower() in str(df.iloc[i][nom_ustuni]).lower())

    nomos_b = []
    for s in yoq_savollar:
        q = m.encode(prefiks_savol + s)
        q = q / np.linalg.norm(q)
        nomos_b.append(float((En @ q).max()))

    norma = float(np.linalg.norm(m.encode("x")))
    return {"model": model_nomi.split("/")[-1][:34],
            "o'lcham": E.shape[1],
            "maks_tok": getattr(m, "max_seq_length", "?"),
            "norma": round(norma, 3),
            "normallashgan": "✅" if abs(norma - 1) < 0.01 else "💥",
            "aniqlik": f"{togri}/{len(sinovlar)}",
            "mos_o'rt": round(float(np.mean(mos_b)), 4),
            "nomos_o'rt": round(float(np.mean(nomos_b)), 4),
            "ajratish": round(float(np.mean(mos_b) - np.mean(nomos_b)), 4),
            "emb_s": round(emb, 1), "yuk_s": round(yuk, 1)}
```

> ## 🏆 **BU FUNKSIYA — MODUL BO'YICHA ENG QIMMATLI VOSITA.** Uni **o'z loyihangizga** ko'chiring.
>
> ## ⭐ **`prefiks_hujjat` / `prefiks_savol` — `e5` OILASI UCHUN:**
> ```python
> model_bahola("intfloat/multilingual-e5-large", ...,
>              prefiks_hujjat="passage: ", prefiks_savol="query: ")
> ```

---

## 6. ⚠️ Model almashtirish — narxi

```
💥 EMBEDDING MODELI O'ZGARSA:
   ① HAMMA vektorlar QAYTA hisoblanadi
   ② Indeks QAYTA yaratiladi (o'lcham o'zgarsa — majburiy)
   ③ Vaqt: 680 vektor → 3–23s
            1M vektor → 2.5–20 soat
   ④ Narx (API bilan): 1M × 300 token × $0.02/1M ≈ $6

⭐ SHUNING UCHUN:
   ① Modelni BOSHIDA to'g'ri tanlang (sinov to'plami bilan)
   ② Indeks nomiga MODEL nomini yozing (kurslar-minilm-v1)
   ③ Metadata'ga model nomini yozing va yuklashda TEKSHIRING
```

> ## 💥 **VA ENG XAVFLISI — O'LCHAM MOS, MODEL BOSHQA:**
> ```
> all-MiniLM-L6-v2              →  384
> paraphrase-multilingual-...   →  384    ← BIR XIL o'lcham!
>
> →  xato CHIQMAYDI
> →  natijalar MA'NOSIZ
> ```

---

## 7. 🇺🇿 Yakuniy tavsiya

```
🇬🇧 INGLIZCHA hujjat + inglizcha so'rov
   ⭐ all-MiniLM-L6-v2      (tez, 384, aniqlik 6/8)
   🏆 all-mpnet-base-v2     (aniqroq 7/8, ajratish 0.4988, lekin 7.8× sekin)

🇺🇿 O'ZBEKCHA so'rov (hujjat har qanday tilda)
   🏆 paraphrase-multilingual-MiniLM-L12-v2   (UZ/EN = 0.80)
   ⚠️ maks 128 token — matnni QISQA tuting
   ⚠️ norma 5.083 — NORMALLASHTIRING

🇺🇿 SIFAT MUHIM bo'lsa
   ⭐ intfloat/multilingual-e5-large  (1024 o'lcham, prefiks kerak)
   ⭐ BAAI/bge-m3                      (8192 token!)
```

> ## 🏆 **VA QANDAY QILIB TANLASH — BIR JUMLADA:**
> ## **O'Z SINOV TO'PLAMINGIZDA `aniqlik` VA `ajratish` NI O'LCHANG.**

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `ajratish` nima va nima uchun muhim?

**M2.** `paraphrase-multilingual` ning kontekst oynasi qancha?

**M3.** `e5` oilasi nimani talab qiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `mos_o'rt − nomos_o'rt`. ## **Chegara qo'yish** oson-qiyinligini ko'rsatadi.

**M2.** ## 💥 **128 token** — `all-MiniLM-L6-v2` dan **ikki baravar kam**.

**M3.** ## **Prefiks**: `"passage: "` hujjat uchun, `"query: "` savol uchun.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Modellarni o'z ma'lumotingizda solishtiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi `model_bahola()` funksiyasini ishlatib:

```python
SINOVLAR = [
    ("regression in Python",        "Machine Learning in Python"),
    ("clustering in Python",        "Customer Analytics in Python"),
    ("SQL joins",                   "SQL"),
    ("deep learning neural networks", "Deep Learning with TensorFlow"),
    ("data visualization Tableau",  "Introduction to Tableau"),
    ("time series forecasting",     "Time Series Analysis"),
    ("web scraping",                "Web Scraping"),
    ("credit risk",                 "Credit Risk Modeling"),
]
YOQ = ["how to cook pasta", "weather in Tashkent", "football scores",
       "buy a used car", "history of Rome", "yoga for beginners"]

matnlar = bolimlar.matn_a.tolist()
q = []
for mn in ["all-MiniLM-L6-v2", "all-mpnet-base-v2",
           "paraphrase-multilingual-MiniLM-L12-v2"]:
    print(f"⏳ {mn} ...")
    q.append(model_bahola(mn, matnlar, SINOVLAR, YOQ,
                          "course_name", bolimlar))

d = pd.DataFrame(q)
print(d.to_string(index=False))

eng = d.loc[d.ajratish.idxmax()]
print(f"\n🏆 ENG YAXSHI AJRATISH: {eng.model} ({eng.ajratish})")
```

```
all-MiniLM-L6-v2       384  256  1.000  6/8  0.6646  0.205  0.4596   2.9s
all-mpnet-base-v2      768  384  1.000  7/8  0.7158  0.217  0.4988  22.5s
paraphrase-multiling.  384  128  5.083  6/8  0.7007  0.283  0.4177   5.2s
```

</details>

**M5.** ⭐⭐ 🇺🇿 UZ/EN nisbatini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
UZ = ["Python dasturlash", "ma'lumotlarni vizualizatsiya qilish",
      "mashinali o'qitish", "chuqur o'rganish",
      "ma'lumotlar bazasi so'rovlari"]
EN = ["Python programming", "data visualization", "machine learning",
      "deep learning", "database queries"]

q = []
for mn in ["all-MiniLM-L6-v2", "paraphrase-multilingual-MiniLM-L12-v2"]:
    m = SentenceTransformer(mn)
    E = m.encode(matnlar, show_progress_bar=False, batch_size=64)
    E = E / np.linalg.norm(E, axis=1, keepdims=True)
    for til, sor in [("UZ", UZ), ("EN", EN)]:
        bl = []
        for s in sor:
            qv = m.encode(s)
            qv = qv / np.linalg.norm(qv)
            bl.append(float((E @ qv).max()))
        q.append({"model": mn.split("/")[-1][:34], "til": til,
                  "o'rt": round(float(np.mean(bl)), 4),
                  "min": round(min(bl), 4), "maks": round(max(bl), 4)})

d = pd.DataFrame(q)
print(d.to_string(index=False))
for mm in d.model.unique():
    uz = d[(d.model == mm) & (d.til == "UZ")]["o'rt"].iloc[0]
    en = d[(d.model == mm) & (d.til == "EN")]["o'rt"].iloc[0]
    belgi = "✅" if uz / en > 0.7 else "💥"
    print(f"  {belgi} {mm[:34]:34s} UZ/EN = {uz/en:.2f}")
```

```
all-MiniLM-L6-v2                   UZ/EN = 0.39   💥
paraphrase-multilingual-MiniLM-L12 UZ/EN = 0.80   ✅
```

## 🏆 **2× YAXSHILANISH — FAQAT MODELNI ALMASHTIRISH BILAN.**

</details>

**M6.** ⭐ Kontekst oynalarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
MODELLAR = ["all-MiniLM-L6-v2", "all-mpnet-base-v2",
            "paraphrase-multilingual-MiniLM-L12-v2"]

tok = bolimlar.matn_a.str.len() / 4
for mn in MODELLAR:
    m = SentenceTransformer(mn)
    maks = m.max_seq_length
    oshgan = int((tok > maks).sum())
    print(f"  {mn.split('/')[-1][:34]:34s} maks {maks:4d} tok · "
          f"oshgan {oshgan:3d}/{len(tok)} ({oshgan/len(tok):5.0%})")
```

```
  all-MiniLM-L6-v2                   maks  256 tok · oshgan 351/680 ( 52%)
  all-mpnet-base-v2                  maks  384 tok · oshgan 226/680 ( 33%)
  paraphrase-multilingual-MiniLM-L12 maks  128 tok · oshgan 566/680 ( 83%)
```

## 💥 **KO'P TILLI MODELDA MATNLARNING 83% QISMI KESILADI.**

## 🏆 **SHUNING UCHUN 🇺🇿 LOYIHADA MATNNI QISQA TUTING** yoki `bge-m3` *(8192 token)* ishlating.

</details>

---

## 📌 Xulosa

```
🔬 O'LCHANGAN (680 bo'lim, 8 sinov savoli):
   model                     o'lcham  tok  aniqlik  ajratish  emb_s
   all-MiniLM-L6-v2            384    256    6/8     0.4596    2.9
   all-mpnet-base-v2           768    384    7/8   ⭐ 0.4988   22.5
   paraphrase-multilingual     384    128    6/8     0.4177    5.2

🇺🇿 UZ/EN NISBATI:
   all-MiniLM-L6-v2           0.39   💥
   paraphrase-multilingual    0.80   ✅  ← 2× yaxshilanish
```

> ## 🏆🏆 **`ajratish = mos_o'rt − nomos_o'rt` — MODEL TANLASHNING ENG MUHIM MEZONI.**
>
> ## 💥 **VA `paraphrase-multilingual` NING KONTEKST OYNASI — ATIGI 128 TOKEN** *(matnlarning 83% kesiladi)*.
>
> ## ⚠️ **MODEL ALMASHTIRISH = HAMMASINI QAYTA INDEKSLASH.** Boshida **to'g'ri tanlang**.

---

⬅️ [4-dars. Tayyorlash](04-Data-Preprocessing.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. Indekslash va qidiruv](06-Embedding-and-Upserting.md)
