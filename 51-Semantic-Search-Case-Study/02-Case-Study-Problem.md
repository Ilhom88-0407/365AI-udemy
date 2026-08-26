# 2-dars. Case study muammosi — 365 kurslari uchun aqlli qidiruv ⭐⭐

## 🎬 Boshlashdan oldin

> **"'Unsupervised learning in Python' deb yozsam — 0 natija. Holbuki bizda bunday kontent bir necha kursda bor."**

---

## 1. Muammoning aniq ta'rifi

> ## 🔑 **KURSNING O'Z TAJRIBASI:**
> ```
> "unsupervised learning in Python"  →  0 natija
> "clustering in Python"             →  0 natija
> "clustering"                       →  2 natija (ML in Python, ML in Excel)
> ```
>
> ## 💥 **VA ENG G'ALATI JOYI:** *"Machine Learning in Python"* kursida `clustering` bo'limi **bor**, kurs nomida `Python` **bor** — lekin `"clustering in Python"` **topilmaydi**.
>
> ## 🔑 **SABAB:** an'anaviy qidiruv **kurs nomi va bo'lim nomini birga ko'rmaydi**.

---

## 2. ⭐⭐ Va yana bir topilmagan kontent

> **"Customer Analytics in Python kursida `clustering` bilan bog'liq UCHTA bo'lim bor. Ular hech qaysi qidiruvda chiqmadi."**

```
Customer Analytics in Python
   ├── K-means Clustering
   ├── Clustering with PCA
   └── Segmentation
```

> ## 💥 **UCHALA BO'LIM HAM MAVJUD, LEKIN TOPILMAYDI.**
>
> ## 🏆 **BU — SEMANTIK QIDIRUVGA O'TISHNING ASOSIY SABABI.**

---

## 3. 🔬 Biz muammoni o'lchadik

Sinov to'plami — **10 ta so'rov**, ularning **8 tasida** kutilgan javob **ma'lum**:

```python
SINOVLAR = [
    ("regression in Python",        "Machine Learning in Python"),
    ("clustering in Python",        "Customer Analytics in Python"),
    ("unsupervised learning",       None),          # javob noaniq
    ("SQL joins",                   "SQL"),
    ("deep learning neural networks", "Deep Learning with TensorFlow"),
    ("data visualization Tableau",  "Introduction to Tableau"),
    ("time series forecasting",     "Time Series Analysis"),
    ("web scraping",                "Web Scraping"),
    ("credit risk",                 "Credit Risk Modeling"),
    ("A/B testing",                 None),
]
```

> ## 🏆 **VA BU — CASE STUDY'NING ENG MUHIM QISMI.**
>
> ## 🔑 **KURS SINOV TO'PLAMI TUZMAYDI** — u natijalarni **ko'z bilan** baholaydi. Biz esa **o'lchaymiz**.
>
> ## 💡 **NIMA UCHUN SINOV TO'PLAMI SHART?**
> ```
> ❌ "Menimcha yaxshi bo'ldi"      →  ⚠️ subyektiv, taqqoslab bo'lmaydi
> ✅ "7/8 → 8/8 bo'ldi"            →  ⭐ o'lchanadigan yaxshilanish
> ✅ "ajratish 0.42 → 0.50 bo'ldi" →  ⭐ ishonchlilik oshdi
> ```

### ⭐ Ikkinchi to'plam — "javobi YO'Q" savollar

```python
YOQ = ["how to cook pasta", "weather in Tashkent", "football scores",
       "buy a used car", "history of Rome", "yoga for beginners"]
```

> ## 🏆 **BULARSIZ CHEGARANI TANLAB BO'LMAYDI.** *(42-modul, 14-dars.)*

---

## 4. ⭐⭐ Semantik qidiruv qanday yordam beradi?

```
"clustering in Python"
        ↓ embedding
   [0.12, -0.45, ..., 0.88]
        ↓ kosinus o'xshashlik
   Customer Analytics in Python / K-means Clustering    0.75
   Machine Learning in Python / Cluster Analysis        0.71
   Machine Learning in Excel / K-means                  0.68
```

> ## 🔑 **MODEL "clustering ≈ K-means ≈ segmentation" EKANINI BILADI** — biz unga **hech qanday qoida bermadik**.
>
> ## 💡 **VA `Python` SO'ZI KURS NOMIDAN, `clustering` — BO'LIM NOMIDAN KELADI.** Ikkalasi **bitta vektorda** birlashgan.

---

## 5. ⚠️ Lekin semantik qidiruv ham SEHR EMAS

```
💥 Inkorni tushunmaydi
   "Python EMAS"  →  Python natijalarini qaytaradi (49-modul: 0.79–0.89)

💥 Aniq raqamlarni yomon ushlaydi
   "24% foiz"  →  har qanday foiz bilan bog'liq natija

💥 Yangi atamalarni bilmaydi
   Model o'qitilganidan keyin paydo bo'lgan texnologiya nomlari

💥 Kontekst oynasi
   256 token — undan keyingisi JIMGINA tashlanadi
```

> ## 🏆 **SHUNING UCHUN AMALIY TIZIMLARDA — GIBRID QIDIRUV:**
> ```
> ① Kalit so'z qidiruvi (BM25 / SQL LIKE)  →  aniq atamalar
> ② Semantik qidiruv                        →  ma'no
> ③ ⭐ Natijalarni BIRLASHTIRISH (RRF)      →  eng yaxshisi
> ```
>
> ## 💡 **BU — KURSDA YO'Q, LEKIN ISHLAB CHIQARISHDA STANDART.**

---

## 6. 🇺🇿 Qayerga qo'llash mumkin

```
🎓 TA'LIM          →  bu case study
🏦 BANK            →  "uy sotib olmoqchiman" → ipoteka
🏥 KLINIKA         →  "bosh og'rig'i va isitma" → mos bo'lim
⚖️ YURIDIK         →  "shartnomani bekor qilish" → moddalar
🏛️ DAVLAT XIZMATI  →  "pasport almashtirish" → xizmat sahifasi
📞 CALL-MARKAZ     →  operator savolga mos javobni TEZ topadi
```

> ## 🏆 **VA HAR BIRIDA — BIR XIL MUAMMO:**
> ```
> Foydalanuvchi O'Z SO'ZLARI bilan yozadi
> Hujjatlar RASMIY TIL bilan yozilgan
> → aniq moslik ISHLAMAYDI
> ```
>
> ## 💡 **🇺🇿 MISOL:** foydalanuvchi *"pul kerak uy uchun"* deb yozadi, hujjatda *"ipoteka kreditlash dasturi"* deb yozilgan.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** 365 platformasidagi asosiy muammo nima?

**M2.** Nima uchun sinov to'plami kerak?

**M3.** Gibrid qidiruv nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Qidiruv **kurs nomi va bo'lim nomini birga ko'rmaydi** → `"clustering in Python"` = **0 natija**.

**M2.** ## Yaxshilanishni **o'lchash** uchun — *"menimcha yaxshi"* **taqqoslab bo'lmaydi**.

**M3.** ## **Kalit so'z + semantik** qidiruvni birlashtirish.

</details>

### 🟡 O'rta

**M4.** ⭐ Sinov to'plamini tuzing.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")
print("mavjud kurslar (namuna):")
print(b.course_name.drop_duplicates().head(20).to_string(index=False))

# ⭐ O'Z sinov to'plamingizni tuzing
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

print(f"\n✅ {len(SINOVLAR)} ta 'javobi bor' savol")
print(f"✅ {len(YOQ)} ta 'javobi yo'q' savol")

# ── kutilgan javoblar HAQIQATAN mavjudmi? ──
print("\n── tekshirish ──")
for s, k in SINOVLAR:
    bor = b.course_name.str.contains(k, case=False, na=False).sum()
    print(f"  {'✅' if bor else '💥'} '{k}': {bor} bo'lim")
```

## 🏆 **HAR SINOVDAN OLDIN — KUTILGAN JAVOB BAZADA BORLIGINI TEKSHIRING.**

## 💥 **AKS HOLDA 0% ANIQLIK OLASIZ VA MODELNI AYBLAYSIZ.**

</details>

**M5.** ⭐ An'anaviy qidiruvning "aniqligini" o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def aniq_qidir(b, s, k=3):
    mask = (b.section_name.str.contains(s, case=False, na=False, regex=False)
            | b.course_name.str.contains(s, case=False, na=False, regex=False))
    return b[mask].head(k)


togri = 0
for s, kutilgan in SINOVLAR:
    r = aniq_qidir(b, s)
    ok = len(r) and kutilgan.lower() in " ".join(
        r.course_name.str.lower()).lower()
    togri += int(ok)
    print(f"  {'✅' if ok else '💥'} '{s[:30]:30s}' {len(r)} natija")

print(f"\n❌ AN'ANAVIY QIDIRUV: {togri}/{len(SINOVLAR)}")
print("   → bu bizning MOS YOZUVIMIZ (baseline)")
```

## 🏆 **BU — "MOS YOZUV" (baseline).** Semantik qidiruv **shundan yaxshiroq** bo'lishi kerak.

## 💡 **VA AGAR YAXSHIROQ BO'LMASA** — semantik qidiruv **kerak emas**.

</details>

**M6.** ⭐⭐ Gibrid qidiruvni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np
from sentence_transformers import SentenceTransformer


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


model = SentenceTransformer("all-MiniLM-L6-v2")
matnlar = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1).tolist()
E = model.encode(matnlar, show_progress_bar=False, batch_size=64)


def semantik(s, k=10):
    q = model.encode(s)
    ballar = E @ q
    return list(np.argsort(-ballar)[:k])


def kalit_soz(s, k=10):
    sozlar = [w for w in s.lower().split() if len(w) > 2]
    ball = np.zeros(len(b))
    for w in sozlar:
        m = (b.section_name.str.lower().str.contains(w, na=False, regex=False)
             | b.course_name.str.lower().str.contains(w, na=False,
                                                      regex=False))
        ball += m.values.astype(float)
    return list(np.argsort(-ball)[:k])


def rrf(royxatlar, K=60, k=5):
    """⭐ Reciprocal Rank Fusion — ikki ro'yxatni birlashtiradi."""
    ball = {}
    for r in royxatlar:
        for orin, i in enumerate(r, 1):
            ball[i] = ball.get(i, 0) + 1 / (K + orin)
    return sorted(ball, key=ball.get, reverse=True)[:k]


for s, kutilgan in SINOVLAR[:4]:
    sem = semantik(s)
    kal = kalit_soz(s)
    gib = rrf([sem, kal])
    print(f"\n🔍 '{s}'  (kutilgan: {kutilgan})")
    for nom, r in [("semantik", sem[:3]), ("kalit so'z", kal[:3]),
                   ("⭐ gibrid", gib[:3])]:
        ok = any(kutilgan.lower() in b.iloc[i].course_name.lower()
                 for i in r)
        print(f"   {'✅' if ok else '💥'} {nom:12s} "
              f"{[b.iloc[i].course_name[:22] for i in r]}")
```

## 🏆 **RRF (Reciprocal Rank Fusion) — IKKI RO'YXATNI BIRLASHTIRISHNING STANDART USULI.**

## 💡 **`1/(60 + o'rin)` — har ro'yxatda yuqori o'rinda turgan natija ko'proq ball oladi.** Ballar **taqqoslanmasa ham** ishlaydi.

</details>

---

## 📌 Xulosa

```
💥 MUAMMO:
   "clustering in Python"  →  0 natija
   Customer Analytics in Python da UCHTA clustering bo'limi BOR
   → qidiruv kurs nomi va bo'lim nomini BIRGA ko'rmaydi

✅ YECHIM: semantik qidiruv — ma'no bo'yicha

⭐ SINOV TO'PLAMI (kursda YO'Q, lekin SHART):
   8 ta "javobi bor" savol + 6 ta "javobi yo'q" savol
   → yaxshilanishni O'LCHASH va CHEGARANI tanlash uchun

⚠️ Semantik qidiruv ham SEHR EMAS:
   inkor · aniq raqam · yangi atama · 256 token chegarasi
   → 🏆 GIBRID: kalit so'z + semantik + RRF
```

---

⬅️ [1-dars. Kirish](01-Introduction-to-Semantic-Search.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Ma'lumot bilan tanishish](03-Getting-to-Know-the-Data.md)
