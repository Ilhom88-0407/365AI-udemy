# 1-dars. Kirish ⭐

## 🎬 Boshlashdan oldin

> **"Bu bo'lim — kursning eng qimmatli qismi. Bu yerda kod yo'q, lekin bu yerda haqiqiy ilovani ishga tushirganda nima bo'lishi bor."**

---

## 1. Nima o'zgardi?

Kurs aytadi:

> *"Bu bo'limda kod amalga oshirilishidan ko'ra amaliy va nazariy mulohazalarga e'tibor qaratamiz, chunki loyiha Vue.js yordamida ishlab chiqilgan."*

| | 66-modul *(prototip)* | ## 67-modul *(ishlab chiqarish)* |
|---|---|---|
| Interfeys | Streamlit | Vue.js |
| LLM soni | 2 ta | ## ⭐ **3 ta** |
| Savollar | LLM o'ylab topadi | ## ⭐ **MB + LLM** |
| Xotira | butun tarix | ## 🏆 **oxirgi juftlik** |
| Xatolarni ushlash | yo'q | ## 🏆 **3 urinish + fallback** |
| Foydalanuvchilar | 1 | ## ⭐ **minglab** |

> ## 🔑 **VA MANA ASOSIY FARQ:** ## prototipda **xato — noqulaylik**, ## ishlab chiqarishda **xato — yo'qotilgan foydalanuvchi**.

---

## 2. ⭐ Bo'limda nimalar bor

| Mavzu | Dars | Bu kitobda o'lchandi |
|---|---|---|
| Ilova tuzilishi | 2 | Uch LLM arxitekturasi |
| HR prompt tuzilishi | 3 | ## 🏆 **Xotira: 64% tejash** |
| Texnik prompt tuzilishi | 4 | SQLite xulosalari |
| Xatolardan himoya | 5 | ## 💥 **Massiv JSON: 0/12** |
| Gallyutsinatsiyalar | 6 | ## 💥 **CoT natijani BUZDI** |
| Prompt injection | 7 | ## 💥 **O'zbekcha hujum o'tdi** |
| Token sanash | 8 | ## 💥 **`cl100k` 36% qimmat** |
| Xarajatni kamaytirish | 9 | ## 🏆 **Kesh: 57% tejash** |
| Masshtablash | 10 | Token bucket |

---

## 3. 🔬 Bu modulda **nimani o'lchay olamiz?**

Kursning bu bo'limi **kodsiz** — u tajriba haqida gapiradi. Lekin **deyarli har bir da'voni sinash mumkin**.

| Kursning da'vosi | Sinash mumkinmi |
|---|---|
| *"Har 20 intervyudan 1 tasida buzuq JSON"* | ## ✅ **ha** — N marta ishga tushiramiz |
| *"5 000 tokengacha tejadik"* | ## ✅ **ha** — `tiktoken` |
| *"`cl100k_base` ishlating"* | ## ✅ **ha** — taqqoslaymiz |
| *"Temperature ni pasaytiring"* | ## ✅ **ha** — 0.0 → 1.5 |
| *"Bu qator injection dan himoya qiladi"* | ## ✅ **ha** — hujum qilamiz |
| *"Chain of thought xatolarni kamaytiradi"* | ## ✅ **ha** — taqqoslaymiz |
| *"GPT-3.5 gallyutsinatsiya darajasi 39.6%"* | ## ⚠️ **yo'q** — kalit kerak |

> ## ⭐ **YETTITADAN OLTITASINI O'LCHADIK.**
>
> ## ## ⚠️ **VA HALOL BO'LSAK — BIZNING MODELIMIZ BOSHQA:** ## `Qwen2.5-0.5B` — **494 mln parametr**, ## `GPT-4o` — **yuzlab milliard**. ## ## 🔑 Shuning uchun **raqamlar boshqacha**, ## lekin **muammolarning TABIATI bir xil**.

---

## 4. ⚠️ Kursning statistikasi haqida

Kurs 6-darsda aytadi:

> *"Journal of Medical Internet Research da chop etilgan tadqiqotga ko'ra, GPT-3.5 ning gallyutsinatsiya darajasi 39.6%, GPT-4 niki esa 28.6%."*

> ## ⚠️ **BU RAQAMLARNI TEKSHIRA OLMAYMIZ** *(kalit yo'q)*, ## lekin **ularni qanday o'qish kerakligini** aytish mumkin:
>
> ## ## 🔑 **BU — UMUMIY GALLYUTSINATSIYA DARAJASI EMAS.** ## Nomidan ko'rinib turibdiki, tadqiqot ## **tibbiy** kontekstda o'tkazilgan — ## odatda **ilmiy manbalarni** *(citation)* tekshirish haqida.
>
> ## ## ⚠️ **VA BU — JUDA MUHIM FARQ:** ## "manba o'ylab topish" darajasi ## **HR savol berish** darajasi bilan **bir xil emas**.

> ## 🏆 **TO'G'RI YONDASHUV — O'Z VAZIFANGIZDA O'LCHASH.** ## 6-darsda aynan shuni qilamiz: ## kursning **uchta toifasini** o'z modelimizda sinaymiz. ## ## 💥 **Va natija sizni hayron qoldiradi** — ## uchtadan **ikkitasi takrorlanmadi**.

---

## 🎯 Nazorat savollari

1. Prototip va ishlab chiqarish orasidagi asosiy farq nima?
2. Ishlab chiqarish versiyasida nechta LLM ishlatiladi?
3. Kursning statistikasini nega ehtiyotkorlik bilan o'qish kerak?

<details>
<summary>Javoblar</summary>

1. ## **Xatoning narxi.** Prototipda xato — **noqulaylik**, ishlab chiqarishda — **yo'qotilgan foydalanuvchi**. ⭐ Shuning uchun 5-darsdagi **3 urinish + fallback** tizimi paydo bo'ladi.
2. ## **Uchta:** ① savol generatori, ② `Humanizer`, ③ baholovchi. Prototipda **ikkita** edi. 🔑 Kurs aytadi: uchta model **arzonroq** chiqdi — chunki har biri **kamroq kontekst** oladi.
3. `39.6% / 28.6%` — bu **tibbiy kontekstdagi** o'lchov *(odatda manbalarni tekshirish)*. ⚠️ Bu — **umumiy** gallyutsinatsiya darajasi **emas**. 🏆 To'g'ri yo'l — **o'z vazifangizda o'lchash**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Application-Structure.md)
