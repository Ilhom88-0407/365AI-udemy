# 1-dars. Semantik qidiruvga kirish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Semantik qidiruv — so'zlarni ANIQ MOSLIK bo'yicha emas, MA'NO bo'yicha izlash."**

---

## 1. Kursning misoli — Qirolicha Yelizaveta

```
Siz qidirasiz : "Queen Elizabeth retrospective"
Maqola nomi   : "Elizabeth II and the Monarch's Life and Reign"

❌ Aniq moslik  →  TOPILMAYDI (bironta so'z mos kelmadi)
✅ Semantik     →  TOPILADI  (queen ≈ monarch, Elizabeth = Elizabeth II)
```

> ## 🔑 **VA IKKINCHI MUAMMO — TARTIB.** An'anaviy qidiruv natijani **yangiligi** bo'yicha tartiblaydi. Sizga kerak maqola — **30 kun oldin** chiqqan, ya'ni **3-4-sahifada**.

---

## 2. ⭐⭐ 365 platformasidagi haqiqiy muammo

> **"'Unsupervised learning in Python' deb yozsam — 0 natija. Holbuki men bilaman, bizda bunday kontent bir necha kursda bor."**

### 🔬 Biz buni haqiqiy ma'lumotda tekshirdik

```python
import pandas as pd

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

SOROVLAR = ["clustering", "clustering in Python", "unsupervised learning",
            "ML", "K-means", "regression in Python"]

for s in SOROVLAR:
    mos = b[b.section_name.str.contains(s, case=False, na=False)
            | b.course_name.str.contains(s, case=False, na=False)]
    print(f"  {'✅' if len(mos) else '❌'} '{s}': {len(mos)} natija")
```

> ## 💥 **AYNI KURSDAGIDEK:** *"clustering"* — bir necha natija, lekin *"clustering in Python"* — **0 natija**.
>
> ## 🔑 **SABAB:** `LIKE '%clustering in Python%'` — bu **aynan shu ibora** kerak degani. Kurs nomida `Python` bor, bo'lim nomida `clustering` bor, lekin **birga** — hech qayerda.

---

## 3. ⭐ O'yin rejasi

```
① Muammoni aniqlash                    ← bu dars
② Ma'lumot bilan tanishish             ← 2–3-dars
③ Python'da tayyorlash                 ← 4-dars
④ Vektor bazasiga yuklash              ← 5–7-dars
⑤ Semantik qidiruv                     ← 8-dars
⑥ ⭐ Yaxshilash: bo'lim darajasi, og'irlik, boshqa model  ← 9–15-dars
```

> ## 🏆 **VA BU — HAR QANDAY QIDIRUV LOYIHASINING SHABLONI.**

---

## 4. ⭐⭐ Jadvalli ma'lumotni vektorlashtirish — asosiy savol

> **"Ma'lumotlarning katta qismi relyatsion yoki yarim tuzilgan shaklda saqlanadi. Vektor formatida saqlash ko'p biznes uchun ma'nosiz. Lekin agar bizda MATNLI ma'lumot bo'lsa va semantik qidiruv kerak bo'lsa?"**

```
📊 SQL jadval
   course_name | course_technology | course_description | section_name | ...
        ↓
   ⭐ Har QATORNI bitta MATNGA birlashtirish
        ↓
   Embedding → vektor
        ↓
   🔍 Vektor bazasi
```

> ## 🔑 **KURSNING ASOSIY G'OYASI:**
> ```
> ❌ Har USTUNNI alohida vektor qilish
>    →  "python" so'zi bitta vektor — MA'NOSIZ
>
> ✅ ⭐ Ustunlarni BIR MATNGA birlashtirish
>    →  butun kurs KONTEKSTI bitta vektorda
> ```
>
> ## 💡 **KURSNING TUSHUNTIRISHI TO'G'RI:** *"LLM'lar ma'lumotni KONTEKSTDA ko'radi va uzunroq matnlardan foyda oladi."*

### ⚠️ Lekin — bir muhim cheklov bilan

> ## 💥💥 **"UZUNROQ MATN YAXSHIROQ" — FAQAT KONTEKST OYNASIGACHA.**
> ```
> all-MiniLM-L6-v2  →  256 token (~1000 belgi)
> undan keyingisi   →  💥 JIMGINA tashlanadi
> ```
> *(49-modul, 3-darsda o'lchagan edik: **21 000 tokenli matn 531 tokenlikdan farq qilmadi**.)*
>
> ## 🏆 **XULOSA: BIRLASHTIRING, LEKIN ENG MUHIM MATNNI OLDINGA QO'YING.**

---

## 5. ⭐ Bu bo'limda nima quramiz

```
🔍 Semantik qidiruv tizimi — 365 kurslari uchun

   Kirish : "clustering in Python"
   Chiqish: mos kurs va BO'LIMLAR, ball bilan tartiblangan
```

```
📊 Ma'lumot:
   106 kurs · 680 bo'lim · 6 va 11 ustun

⚙️ Texnologiya:
   sentence-transformers (mahalliy, bepul)
   ⭐ Chroma (mahalliy) — kursda Pinecone

🎯 Yaxshilash bosqichlari:
   ① kurs darajasi        →  natija zaif
   ② ⭐ bo'lim darajasi   →  ancha yaxshi
   ③ boshqa model         →  yana yaxshi
   ④ og'irlikli embedding →  nozik sozlash
```

---

## 6. ⚠️ Kurs aytmagan — generativ qism yo'q

> **"Men faqat vektor bazasi qismini ishlataman va hech qanday yangi matn generatsiya qilmayman."**

> ## 🏆 **BU — TO'G'RI QAROR, VA KURS UNI YAXSHI ASOSLAYDI:**
> ```
> ✅ Qidiruv natijasi     →  HAQIQIY kurs nomlari (tekshirib bo'ladi)
> 💥 Generativ xulosa     →  model YOLG'ON TO'QISHI mumkin
> ```
>
> ## 💡 **VA BU — 42-MODUL, 18-DARSDAGI XULOSANING O'ZI:** *"use only the context"* **yolg'on to'qishni to'xtatmaydi**.
>
> ## ⭐ **AGAR GENERATIV QISM QO'SHSANGIZ:**
> ```
> ① BALL CHEGARASI qo'ying (42-modul, 14-dars)
> ② MANBANI ko'rsating (kurs nomi + havola)
> ③ "Bilmayman" javobiga RUXSAT bering
> ```

---

## 7. 🇺🇿 Bizning sharoitimizda

```
🎓 TA'LIM
   Kurs qidiruvi (aynan shu case study)
   "Python o'rganmoqchiman" → mos kurslar

🏦 BANK
   "Uy sotib olmoqchiman" → ipoteka mahsuloti
   "Pulimni saqlamoqchiman" → depozit

🏥 TIBBIYOT
   "Bosh og'rig'i va isitma" → mos bo'limlar

⚖️ YURIDIK
   "Ish shartnomasini bekor qilish" → tegishli moddalar

🛒 E-TIJORAT
   "Sovuq havoga kiyim" → paltolar, kurtkalar
```

> ## ⚠️⚠️ **VA 🇺🇿 UCHUN MUHIM OGOHLANTIRISH — BIZ UNI O'LCHADIK:**
> ```
> Kursning modeli all-MiniLM-L6-v2 — FAQAT INGLIZCHA
>
> 🇺🇿 "Python dasturlash"                   ball 0.3838
> 🇺🇿 "ma'lumotlarni vizualizatsiya qilish"  ball 0.2059
> 🇺🇿 "mashinali o'qitish"                  ball 0.2150
>
> 🇬🇧 inglizcha so'rovlarda                  ball 0.65–0.81
> ```
> ## 💥 **O'ZBEKCHA SO'ROVLAR 2–4× PAST BALL OLDI.**
>
> ## ✅ **YECHIM:** `paraphrase-multilingual-MiniLM-L12-v2` yoki `multilingual-e5-large`.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Semantik qidiruv nima?

**M2.** Nima uchun ustunlarni birlashtirish kerak?

**M3.** Nima uchun kurs generativ qism qo'shmagan?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Ma'no bo'yicha** qidiruv — aniq moslik **emas**.

**M2.** ## Vektor **butun kontekstni** ushlaydi; alohida ustun — **ma'nosiz**.

**M3.** ## Model **yolg'on to'qishi** mumkin. Qidiruv natijasi — **tekshirilishi mumkin**.

</details>

### 🟡 O'rta

**M4.** ⭐ Aniq moslikning cheklovini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

SOROVLAR = ["clustering", "clustering in Python", "unsupervised learning",
            "K-means", "ML", "regression in Python", "neural network"]

for s in SOROVLAR:
    mos = b[b.section_name.str.contains(s, case=False, na=False)
            | b.course_name.str.contains(s, case=False, na=False)]
    print(f"  {'✅' if len(mos) else '❌'} '{s}': {len(mos)} natija")
    for _, r in mos.head(2).iterrows():
        print(f"       {r.course_name[:36]} | {r.section_name[:28]}")
```

## 💥 **"clustering in Python" — 0 NATIJA.**

## 🔑 **VA E'TIBOR BERING:** *"clustering"* alohida **topiladi**, *"Python"* alohida **topiladi**, lekin **birga** — **yo'q**.

</details>

**M5.** ⭐ Tavsifda ham qidiring.

<details>
<summary>✅ Yechim</summary>

```python
def qidir(b, s, ustunlar=("section_name", "course_name")):
    mask = False
    for u in ustunlar:
        mask = mask | b[u].str.contains(s, case=False, na=False, regex=False)
    return b[mask]

DARAJALAR = {
    "faqat nomlar": ("section_name", "course_name"),
    "+ bo'lim tavsifi": ("section_name", "course_name",
                         "section_description"),
    "+ kurs tavsifi": ("section_name", "course_name",
                       "section_description", "course_description"),
}

for s in ["clustering in Python", "unsupervised learning", "K-means"]:
    print(f"\n🔍 '{s}'")
    for nom, ust in DARAJALAR.items():
        print(f"   {nom:20s} {len(qidir(b, s, ust)):3d} natija")
```

## 🔑 **TAVSIFLARDA QIDIRSANGIZ — BA'ZI NATIJALAR PAYDO BO'LADI.**

## 💥 **LEKIN "clustering in Python" BARIBIR 0** — chunki bu **aynan shu ibora** kerak.

## 🏆 **VA TAVSIFLARDA QIDIRISH — SHOVQIN HAM QO'SHADI.** Semantik qidiruv **ikkalasini ham** hal qiladi.

</details>

**M6.** ⭐⭐ Semantik qidiruv bilan solishtiring.

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

for s in ["clustering in Python", "unsupervised learning", "K-means"]:
    aniq = len(qidir(b, s))
    q = model.encode(s)
    ballar = E @ q
    top = np.argsort(-ballar)[:3]
    print(f"\n🔍 '{s}'")
    print(f"   ❌ aniq moslik : {aniq} natija")
    print(f"   ✅ semantik    :")
    for i in top:
        print(f"        {ballar[i]:.4f}  {b.iloc[i].course_name[:34]:34s} | "
              f"{b.iloc[i].section_name[:26]}")
```

## 🏆 **BU — BUTUN CASE STUDY'NING SABABI BIR EKRANDA.**

</details>

---

## 📌 Xulosa

```
❌ Aniq moslik    →  "clustering in Python" = 0 natija
✅ Semantik       →  ma'no bo'yicha topadi

⭐ Ustunlarni BIR matnga birlashtiring — vektor kontekstni ushlaydi
💥 LEKIN 256 token chegarasi — ENG MUHIM MATNNI OLDINGA qo'ying

🏆 Kurs generativ qism qo'shmagan — TO'G'RI qaror (yolg'on to'qish xavfi)

🇺🇿 all-MiniLM-L6-v2 o'zbekchani BILMAYDI (0.20–0.38 vs 0.65–0.81)
   → paraphrase-multilingual-MiniLM-L12-v2
```

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Case study muammosi](02-Case-Study-Problem.md)
