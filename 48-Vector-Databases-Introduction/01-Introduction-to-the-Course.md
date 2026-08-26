# 1-dars. Vektor bazalari — kirish ⭐

## 🎬 Boshlashdan oldin

> **"Semantik qidiruv — bu matnlar orasidagi o'xshashlikni ANIQ MOSLIK bo'yicha emas, MA'NO bo'yicha topish."**

---

## 1. Nima o'rganamiz?

| Modul | Mavzu |
|---|---|
| ## **48** | Nazariya — SQL vs NoSQL vs **Vektor** |
| ## **49** | ## ⭐ **Vektor fazosi va masofa metrikalari** |
| ## **50** | Pinecone — indeks yaratish, boshqarish |
| ## **51** | ## ⭐⭐ **Case study: 365 kurslari uchun semantik qidiruv** |

---

## 2. ⭐ Semantik qidiruv nima?

```
❌ ANIQ MOSLIK (an'anaviy qidiruv)
   "clustering in Python"  →  0 natija
   (chunki bu AYNAN ibora hech qayerda yo'q)

✅ SEMANTIK QIDIRUV
   "clustering in Python"  →  Customer Analytics in Python / K-means Clustering
                          →  Machine Learning in Python / Cluster Analysis
   (chunki MA'NO yaqin)
```

> ## 🔑 **KURSNING MISOLI JUDA YAXSHI:**
> ```
> Siz "Queen Elizabeth retrospective" deb qidirasiz
> Maqola nomi: "Elizabeth II and the Monarch's Life and Reign"
> → ❌ aniq moslik: TOPILMAYDI
> → ✅ semantik: TOPILADI (queen ≈ monarch)
> ```

---

## 3. 🔬 Biz buni o'lchadik — HAQIQIY 365 ma'lumotida

Bu bo'limda **haqiqiy 365 kurslari ma'lumoti** bilan ishlaymiz:

```
kurslar   : 106 qator × 6 ustun
bo'limlar : 680 qator × 11 ustun
noyob kurs: 105
```

```
🔍 'regression in Python'  (2 ms)
   0.7435  [  37-369] Machine Learning in Python  | Linear Regression with sklearn
   0.6682  [  36-363] Python for Finance          | Using Regressions for Financial
   0.6457  [  37-368] Machine Learning in Python  | Linear Regression

🔍 'SQL joins'  (1 ms)
   0.6512  [  14-169] SQL           | SQL JOINs
   0.6175  [  14-171] SQL           | SQL Self Join
   0.5088  [  75-609] Advanced SQL  | SQL Temporary Tables
```

> ## ⚡ **1–2 MILLISEKUND · 680 vektor.** Bu — **mahalliy** bazada, **API kalitisiz**.

---

## 4. ⭐⭐ Vektor bazalari nima uchun kerak?

| Vazifa | An'anaviy DB | ## ⭐ Vektor DB |
|---|---|---|
| "ID = 42 bo'lgan yozuv" | ## ✅ **ideal** | ortiqcha |
| "narxi 100 dan kam" | ## ✅ **ideal** | ⚠️ filtr sifatida |
| ## **"shunga O'XSHASH"** | ## ❌ **imkonsiz** | ## ⭐ **asosiy vazifa** |
| ## **"ma'nosi yaqin"** | ## ❌ | ## ⭐ |

> ## 🏆 **QO'LLANILISHI:**
> ```
> 🔍 Semantik qidiruv       →  ⭐ bu bo'limning asosiy mavzusi
> 🎯 Tavsiya tizimlari      →  "sizga bu ham yoqishi mumkin"
> 🖼️ Rasm bo'yicha qidiruv  →  "shunga o'xshash ko'ylak"
> 🎵 Musiqa tavsiyasi       →  tempo, janr, kayfiyat bo'yicha
> 🚨 Firibgarlikni aniqlash →  "g'ayrioddiy tranzaksiya"
> 🏥 Tibbiy tadqiqot        →  "shunga o'xshash holat"
> ```

---

## 5. ⚠️ Bu bo'limda kursdan FARQ — Pinecone o'rniga mahalliy baza

> ## 🔑 **KURS PINECONE ISHLATADI** — bulutli, **API kaliti kerak**, **pulli** *(bepul tarifda cheklovlar bor)*.
>
> ## ⭐⭐ **BIZ HAMMASINI MAHALLIY BAZADA QILAMIZ** — natija **bir xil**, lekin:
> ```
> ✅ API kaliti KERAK EMAS
> ✅ Internet KERAK EMAS
> ✅ BEPUL va cheksiz
> ✅ 🇺🇿 Ma'lumot kompyuteringizdan CHIQMAYDI (bank, tibbiy loyihalar)
> ⭐ Va Pinecone kodini ham TO'LIQ ko'rsatamiz — kalit olsangiz ishlatasiz
> ```

```python
# Kurs: Pinecone
from pinecone import Pinecone, ServerlessSpec
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

# ⭐ Biz: mahalliy Chroma — AYNAN shu mantiq
import chromadb
client = chromadb.PersistentClient(path="./vdb")
```

> ## 💡 **TUSHUNCHALAR BIR XIL:** indeks · o'lcham · metrika · upsert · query · metadata.
>
> ## 🏆 **PINECONE'NI O'RGANSANGIZ — CHROMA, QDRANT, MILVUS, WEAVIATE HAMMASI TUSHUNARLI BO'LADI.**

---

## 6. 🇺🇿 Bizda qanday qo'llash mumkin?

```
🏦 Bank        →  "menga mos kredit turi qaysi?" (mahsulot tavsifi bo'yicha)
🏥 Klinika     →  "shunga o'xshash simptomlar" (tibbiy yozuvlar bo'yicha)
🎓 Ta'lim      →  ⭐ AYNAN BU CASE STUDY — kurs qidiruvi
🛒 E-tijorat   →  "shunga o'xshash mahsulot"
📰 Yangiliklar →  "shu mavzudagi boshqa maqolalar"
⚖️ Yuridik     →  "shunga o'xshash sud qarorlari"
```

> ## ⚠️⚠️ **VA MUHIM 🇺🇿 OGOHLANTIRISH — BIZ UNI O'LCHADIK:**
> ```
> Kursning modeli: all-MiniLM-L6-v2  →  FAQAT INGLIZCHA
>
> 🇺🇿 "Python dasturlash"                   ball 0.3838
> 🇺🇿 "ma'lumotlarni vizualizatsiya qilish"  ball 0.2059
> 🇺🇿 "mashinali o'qitish"                  ball 0.2150
> ```
> ## 💥 **O'ZBEKCHA SO'ROVLAR JUDA PAST BALL OLDI.**
>
> ## ✅ **YECHIM — KO'P TILLI MODEL** *(42-modulda ishlatgan edik)*:
> ```python
> SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
> ```

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Semantik qidiruv nima?

**M2.** Vektor bazasining asosiy vazifasi?

**M3.** An'anaviy DB nima qila olmaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Ma'no bo'yicha** qidiruv — aniq moslik **emas**.

**M2.** ## **O'xshashlik qidiruvi** *(similarity search)*.

**M3.** ## **"Shunga o'xshashini top"** — bu **imkonsiz**.

</details>

### 🟡 O'rta

**M4.** ⭐ Aniq moslik va semantik qidiruvni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

KURSLAR = [
    "Machine Learning in Python",
    "Customer Analytics in Python",
    "Deep Learning with TensorFlow",
    "Introduction to Tableau",
    "SQL for Data Analysis",
]

SOROVLAR = ["clustering in Python", "unsupervised learning",
            "ML", "data visualization"]

print("── ANIQ MOSLIK (an'anaviy) ──")
for s in SOROVLAR:
    topildi = [k for k in KURSLAR if s.lower() in k.lower()]
    belgi = "✅" if topildi else "❌"
    print(f"  {belgi} '{s}': {len(topildi)} natija {topildi}")
```

```
  ❌ 'clustering in Python': 0 natija []
  ❌ 'unsupervised learning': 0 natija []
  ❌ 'ML': 0 natija []
  ❌ 'data visualization': 0 natija []
```

## 💥 **TO'RTALA SO'ROV HAM 0 NATIJA** — lekin ma'no jihatdan **mos kurslar bor**.

## 🏆 **AYNAN SHU — SEMANTIK QIDIRUVNING SABABI.**

</details>

**M5.** ⭐ 365 ma'lumotini yuklang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

# ⚠️ encoding="cp1252" — fayl UTF-8 EMAS
kurslar = pd.read_csv("course_descriptions.csv", encoding="cp1252")
bolimlar = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

print("kurslar :", kurslar.shape, list(kurslar.columns))
print("bo'limlar:", bolimlar.shape)
print("noyob kurs:", bolimlar.course_id.nunique())
print("\ntexnologiyalar:")
print(bolimlar.course_technology.value_counts().head(8).to_string())
```

```
kurslar : (106, 6)
bo'limlar: (680, 11)
noyob kurs: 105

python     259
theory     192
excel       90
tableau     43
sql         41
```

## 💥 **`encoding="cp1252"` SHART** — UTF-8 bilan `UnicodeDecodeError` chiqadi.

## ⚠️ **106 kurs, LEKIN bo'limlar faylida 105 noyob kurs** — bittasi **bo'limsiz**.

</details>

**M6.** ⭐⭐ Ma'lumotning "iflos" joylarini toping.

<details>
<summary>✅ Yechim</summary>

```python
print("── bo'sh qiymatlar ──")
print(bolimlar.isna().sum()[lambda x: x > 0].to_string())

print("\n── boshqaruv belgilari (\\r, \\n) ──")
for ustun in ["course_description", "section_description"]:
    n = bolimlar[ustun].map(
        lambda s: ("\r" in str(s)) or ("\n" in str(s))).sum()
    cr = bolimlar[ustun].map(lambda s: str(s).count("\r")).sum()
    print(f"  {ustun:22s} {n}/{len(bolimlar)} qatorda · jami {cr} ta \\r")

print("\n── namuna ──")
print(repr(bolimlar.section_description.iloc[0][-50:]))
```

```
course_instructor_quote    20

  course_description     199/680 qatorda · jami 1592 ta \r
  section_description    108/680 qatorda · jami 839 ta \r

'install Tableau Public (Tableau’s free version).\r\r\r\r\r\r\r\r\n'
```

## 💥 **839 TA `\r` BELGI** — bular embedding sifatiga **ta'sir qiladi** va **tokenlarni behuda yeydi**.

## ✅ **TOZALASH:**
```python
def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
```

</details>

---

## 📌 Xulosa

```
Semantik qidiruv  →  MA'NO bo'yicha, aniq moslik EMAS
Vektor DB         →  o'xshashlik qidiruvi uchun mo'ljallangan

🔬 O'LCHANGAN (haqiqiy 365 ma'lumotida):
   680 bo'lim · qidiruv 1–2 ms
   'regression in Python' → Machine Learning in Python (0.7435)
   'SQL joins'            → SQL / SQL JOINs (0.6512)

⭐ Kurs Pinecone ishlatadi — biz MAHALLIY bazada, API kalitisiz
   (Pinecone kodi ham to'liq ko'rsatiladi)

💥 all-MiniLM-L6-v2 — FAQAT INGLIZCHA
   🇺🇿 o'zbekcha so'rovlar 0.20–0.38 ball oldi
```

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. SQL, NoSQL va Vektor](02-Database-Comparison.md)
