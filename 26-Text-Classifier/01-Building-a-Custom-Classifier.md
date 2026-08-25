# 1-dars. O'z tasniflagichingizni qurish

## 🎬 Boshlashdan oldin

> ## **"Bu bo'lim tabiiy tilni qayta ishlashning haqiqatan KUCHLI jihatini qamrab oladi — bu O'ZINGIZNING MAXSUS YORLIQLARINGIZ yordamida matnni tasniflash, ya'ni MAXSUS TASNIFLAGICH yaratish."**

---

## 1. Nima o'zgardi?

```
23-MODUL — TAYYOR sentiment modellari
   VADER, TextBlob, transformers
   → BOSHQALAR o'qitgan

25-MODUL — MAVZU modellashtirish
   LDA, LSA
   → yorliqSIZ, kashfiyot

26-MODUL — O'Z MODELINGIZ  ⭐
   → SIZ o'qitasiz
   → SIZNING yorliqlaringiz
```

> ## **"Bu — TURLI TASNIFLASH ALGORITMLARIDAN foydalangan holda NAZORAT OSTIDA o'qitish muammosi."**

---

## 2. Nazorat ostida o'qitish — eslatma

![Tasniflagich quvuri](assets/01-classifier-pipeline.svg)

```
┌──────────────────────────────────────────────┐
│  O'RGATUVCHI MA'LUMOT (yorliqlar BILAN)      │
│                                              │
│  "i love spending time..."   →  positive     │
│  "i have a headache..."      →  negative     │
│  "watching a sunset..."      →  positive     │
└──────────────────────────────────────────────┘
                    ↓
             MODEL O'RGANADI
                    ↓
┌──────────────────────────────────────────────┐
│  YANGI MATN (yorliqSIZ)                      │
│                                              │
│  "this made my day"          →  ???          │
└──────────────────────────────────────────────┘
                    ↓
              MODEL BASHORAT QILADI
                    ↓
                 positive  ✅
```

### 🔑 Uchta bosqich

| Bosqich | Nima bo'ladi |
|---|---|
| **1 · Vektorlashtirish** | Matn → raqamlar *(24-modul!)* |
| **2 · O'qitish** *(`fit`)* | Model naqshlarni **o'rganadi** |
| **3 · Bashorat** *(`predict`)* | Yangi matnga **yorliq** qo'yadi |

---

## 3. Nima uchun o'z modelingiz kerak?

> **"Oldingi darslarimizda ko'rganimizdek, sentimentni hisoblashning turli usullari ALLAQACHON mavjud."**
>
> ## **"Lekin ba'zan ANIQLIK YETARLI EMAS. Yoki sizda mavjud algoritmlarga UNCHA MOS KELMAYDIGAN ma'lumot bo'lishi mumkin, va siz O'Z MAXSUS MODELINGIZNI qurmoqchisiz."**

### Qachon tayyor model YETARLI EMAS?

| Holat | Nima uchun |
|---|---|
| 🏥 **Tibbiy matn** | `"positive"` = **yaxshi** emas, **kasallik topildi**! |
| ⚖️ **Huquqiy hujjat** | Maxsus atamalar, tayyor model bilmaydi |
| 🏭 **Sanoat** | `"failure rate low"` — bu **yaxshi** |
| 🇺🇿 **O'zbek tili** | Tayyor modellar **ingliz** tili uchun |
| 🏷️ **Maxsus yorliqlar** | *"shoshilinch / oddiy / spam"* — sentiment emas! |

> ## 💡 **Eng kuchli sabab — MAXSUS YORLIQLAR.** Tayyor model faqat *ijobiy/salbiy* biladi. Sizga esa *"to'lov muammosi / yetkazib berish / texnik nosozlik"* kerak bo'lishi mumkin.

---

## 4. Uchta algoritm

> **"Bu bo'limdagi darslar uchun ishlatadigan algoritmlar: LOGISTIK REGRESSIYA, NAIVE BAYES va CHIZIQLI SUPPORT VECTOR MACHINE."**

| Algoritm | Dars | Bir jumlada |
|---|---|---|
| **Logistik regressiya** | 2 | Har so'zga **vazn** beradi, yig'indisiga qarab qaror qiladi |
| **Naive Bayes** | 3 | **Ehtimollik** sanaydi: *"bu so'z spam'da necha marta uchradi?"* |
| **Chiziqli SVM** | 4 | Ikki sinf orasiga **eng keng chegara** chizadi |

> **"Biz bu algoritmlar QANDAY ishlashini juda batafsil ko'rib chiqmaymiz. Biz ularni shunchaki MATN MA'LUMOTI uchun ishlatamiz."**

---

## 5. ⚠️ Bu modulda nima bo'ladi — oldindan ogohlantirish

Kurs **20 ta jumla** bilan ishlaydi. Natija:

```
Logistik regressiya:  33% aniqlik    ❌
Naive Bayes:          50% aniqlik    ❌
Chiziqli SVM:         33% aniqlik    ❌
```

> ## ❌ **Tanga tashlash ham 50% beradi!** Model **hech narsa o'rganmadi**.

O'qituvchi buni **halol tan oladi**:

> **"Rostini aytganda, bu natija unchalik yaxshi emas. Shuning uchun biz ORQAGA QAYTIB, MA'LUMOTIMIZ haqida o'ylashimiz kerak bo'lishi mumkin."**
>
> ## **"Lekin bu — mashinali o'qitish loyihalarida SHUNCHAKI SODIR BO'LADIGAN narsa. Siz HAR DOIM ham birinchi urinishda eng yaxshi natijani olmaysiz."**

### 💡 Bu darslikda biz BIR QADAM OLDINGA boramiz

Kurs muammoni **aytadi**, lekin **hal qilmaydi**. Biz:

```
① MUAMMONI O'LCHAYMIZ     — nima uchun 33%?
② SABABINI ISBOTLAYMIZ    — algoritmda emas, MA'LUMOTDA
③ TUZATAMIZ               — 83 ta sharhda 96% ga chiqamiz  ⭐
```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Bu modul nazorat ostidami yoki nazoratsizmi?

**M2.** Uchta algoritmni ayting.

**M3.** Tasniflagichning 3 bosqichi qaysi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **NAZORAT OSTIDA** — bizda **yorliqlar bor** *(`positive`/`negative`)*.

**M2.** Logistik regressiya · Naive Bayes · Chiziqli SVM.

**M3.** ① **Vektorlashtirish** ② **O'qitish** *(`fit`)* ③ **Bashorat** *(`predict`)*.

</details>

### 🟡 O'rta

**M4.** 25-modul *(mavzu modeli)* va bu modul farqi nimada?

**M5.** Qachon tayyor model o'rniga o'z modelingiz kerak?

<details>
<summary>✅ Javoblar</summary>

**M4.**

```
25-MODUL             26-MODUL
mavzu modeli         tasniflagich
NAZORATSIZ           NAZORAT OSTIDA
yorliq YO'Q          yorliq BOR
"Qanday guruhlar?"   "Bu qaysi guruhga?"
KASHFIYOT            BASHORAT
```

> 💡 Ular **ketma-ket** ishlaydi: mavzu modeli **yorliq topadi** → tasniflagich ularni **ishlatadi**.

**M5.**
- Tayyor modelning **aniqligi yetarli emas**
- Ma'lumotingiz **o'ziga xos** *(tibbiy, huquqiy, sanoat)*
- **Boshqa til** *(o'zbek)*
- ## **MAXSUS YORLIQLAR** kerak *(sentiment emas)*

</details>

---

## 🧠 O'zini tekshirish savollari

1. Bu qaysi turdagi mashinali o'qitish?
2. Uchta algoritm qaysi?
3. `fit` va `predict` nima qiladi?
4. Nima uchun o'z modelingiz kerak bo'lishi mumkin?
5. Kursda natija qanday chiqadi?

<details>
<summary>✅ Javoblar</summary>

1. ## **NAZORAT OSTIDA** *(supervised)*.
2. Logistik regressiya, Naive Bayes, Chiziqli SVM.
3. **`fit`** — modelni **o'qitadi**. **`predict`** — yangi ma'lumotga **yorliq qo'yadi**.
4. Aniqlik yetarli emas · maxsus soha · boshqa til · ## **maxsus yorliqlar**.
5. **Yomon** — 33%, 50%, 33%. Va bu — **muhim saboq** *(sabab: ma'lumot juda kam)*.

</details>

---

## 📌 Xulosa

```
MAXSUS TASNIFLAGICH
= o'z YORLIQLARINGIZ bilan matnni tasniflash
= NAZORAT OSTIDA o'qitish


UCH BOSQICH

  1 · VEKTORLASHTIRISH    matn → raqam  (24-modul)
  2 · O'QITISH  .fit()    model o'rganadi
  3 · BASHORAT  .predict() yangi matnga yorliq


UCHTA ALGORITM

  Logistik regressiya  →  har so'zga VAZN
  Naive Bayes          →  EHTIMOLLIK sanaydi
  Chiziqli SVM         →  eng keng CHEGARA


NIMA UCHUN O'Z MODELINGIZ?
  · Tayyor modelning aniqligi yetarli emas
  · Maxsus soha (tibbiy, huquqiy, sanoat)
  · Boshqa til (o'zbek)
  · ⭐ MAXSUS YORLIQLAR ("shoshilinch/oddiy/spam")


⚠️ OGOHLANTIRISH
   Kursdagi natija: 33% · 50% · 33%
   Tanga tashlash ham 50% beradi!

   Bu darslikda BIZ BUNI TUZATAMIZ:
   20 ta jumla → 33%
   83 ta sharh → 96%  ⭐
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Tasniflagich | *classifier* | Yorliq qo'yuvchi model |
| Nazorat ostida | *supervised* | Yorliqli o'qitish |
| Yorliq | *label* | To'g'ri javob |
| O'qitish | *training* / `fit` | Model o'rganishi |
| Bashorat | *prediction* / `predict` | Yangi javob |
| Aniqlik | *accuracy* | To'g'ri javoblar ulushi |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Logistik regressiya](02-Logistic-Regression.md)
