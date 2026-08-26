# 8-dars. LangChain'ga kirish — muammo

## 🎬 Boshlashdan oldin

> **"O'tgan darsda biz she'riy chatbot yoza oldik."**
>
> ## **"Biroq model faqat O'QITILGAN MA'LUMOTIDAN olgan UMUMIY BILIMIGA asoslanib javob bera oladi."**
>
> **"Keling, bu modelga ANIQROQ savol berganimizda nima bo'lishini ko'raylik."**

---

## 1. Muammoni ko'rsatamiz

> **"Biz yangi prompt yaratamiz: '365 Data Science platformasiga keyingi qaysi kurs yuklanadi?'"**
>
> ## **"Ko'rib turganingizdek, model javob berdi, LEKIN bu javobda HAQIQIY JAVOB YO'Q."**
>
> ## **"Model bizga qaysi kurs keyingi yuklanishini AYTA OLMAYDI, chunki unda bu ma'lumot shunchaki YO'Q."**

### 💻 Buni O'ZIMIZ ko'ramiz

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

nom = "google/flan-t5-base"
tok = AutoTokenizer.from_pretrained(nom)
model = AutoModelForSeq2SeqLM.from_pretrained(nom)


def javob(prompt, maks_token=50):
    e = tok(prompt, return_tensors="pt")
    with torch.no_grad():
        o = model.generate(**e, max_new_tokens=maks_token)
    return tok.decode(o[0], skip_special_tokens=True)


savollar = [
    "Which course will be released in March 2024?",
    "When is the LangChain course?",
    "How many courses are there?",
]
for s in savollar:
    print(f"SAVOL : {s}")
    print(f"JAVOB : {javob(f'Answer the question: {s}')!r}\n")
```

```
SAVOL : Which course will be released in March 2024?
JAVOB : 'physics'

SAVOL : When is the LangChain course?
JAVOB : '1890'

SAVOL : How many courses are there?
JAVOB : '58'
```

## 😱 UCHALASI HAM MUTLAQO NOTO'G'RI

```
'physics'   →  bu KURS NOMI ham emas
'1890'      →  LangChain 2022-yilda yaratilgan
'58'        →  qayerdan olindi? HECH QAYERDAN — TO'QILGAN
```

> ## 🔑 **DIQQAT — MODEL "BILMAYMAN" DEMADI.**
>
> U **har uchala savolga** javob berdi. Va **har uchalasi** ham **to'qib chiqarilgan**.
>
> ## 💥 **BU — GALLYUTSINATSIYANING ENG XAVFLI XUSUSIYATI:** model **bilmasligini bilmaydi**.

---

## 2. Nima uchun bunday bo'ladi?

> ## **"GPT modellari JUDA KO'P ma'lumotda o'qitilgan, lekin bu ma'lumot faqat 2021-YILGACHA yetadi, shuning uchun ularda ENG SO'NGGI ma'lumot bo'lmasligi mumkin."**

```
MODEL BILADIGAN NARSA:
   ✅ o'quv ma'lumotida BOR narsa
   ❌ o'quv ma'lumotidan KEYINGI narsa
   ❌ SIZNING shaxsiy/korporativ ma'lumotingiz
   ❌ ichki hujjatlaringiz
```

### Uchta ko'r nuqta

| Ko'r nuqta | Misol |
|---|---|
| 🕐 **Vaqt** | *"2025-yilda nima bo'ldi?"* |
| 🏢 **Sizning tashkilotingiz** | *"Bizning qaytarish siyosatimiz qanday?"* |
| 📄 **Shaxsiy hujjatlar** | *"Bu shartnomada nima yozilgan?"* |

> ## 💡 **Uchalasi ham BIR XIL muammo:** ma'lumot **modelning ichida yo'q**.

---

## 3. ⚠️ "2021" raqami haqida halol eslatma

O'qituvchi *"2021-yilgacha"* deydi. Bu **2023-yil uchun to'g'ri** edi.

```
❌ ESKIRGAN:  "GPT bilimi 2021 da to'xtaydi"

✅ BUGUN   :  har modelning O'Z chegarasi bor
              va u DOIM O'ZGARADI
```

> ## 🔑 **LEKIN MUAMMO ESKIRMADI.** Chegara **qanchalik yangi** bo'lsa ham:
> ```
> · undan KEYINGI voqealar        →  model BILMAYDI
> · sizning ICHKI hujjatlaringiz  →  model HECH QACHON bilmaydi
> ```
>
> ## 💡 **Ikkinchi qator — eng muhimi.** Sizning kompaniyangiz hujjatlari **hech qachon** hech qanday modelning o'quv ma'lumotida bo'lmaydi. **Chegara qancha yangilansa ham.**

---

## 4. ✅ Yechim bor

> ## **"Lekin YECHIM BOR. LangChain'dan foydalanib, biz O'Z MA'LUMOTIMIZNI import qilishimiz va uni til modellarimiz tomonidan O'QILISHINI ta'minlashimiz mumkin."**
>
> **"Keyin til modellarimiz javob yaratishda bunga MUROJAAT QILA oladi."**

### 🔑 G'oyaning mohiyati — bir jumlada

```
❌ ESKI YONDASHUV:  "Model, sen BILASANMI?"
                          ↓
                    gallyutsinatsiya

✅ RAG YONDASHUVI:  "Model, MANA MA'LUMOT. Endi javob ber."
                          ↓
                    to'g'ri javob
```

> ## 💡 **Bu — imtihonda "yopiq kitob" va "ochiq kitob" farqi.**
>
> ```
> Yopiq kitob  →  talaba ESLASHI kerak      →  xato qilishi mumkin
> Ochiq kitob  →  talaba QARAB javob beradi →  aniqroq
> ```

### 🎯 Va mana natija — OLDINDAN ko'rsatamiz

**10-darsda quradigan tizim bilan AYNAN SHU savollar:**

| Savol | ❌ RAG'siz | ✅ RAG bilan |
|---|---|---|
| *Which course in March 2024?* | `'physics'` | ## `'Introduction to Large Language Models'` |
| *When is the LangChain course?* | `'1890'` | ## `'April 2024'` |
| *How many courses are there?* | `'58'` | ## `'more than 60'` |

> ## 🏆 **BIR XIL MODEL. BIR XIL SAVOLLAR. UCHALASI HAM TO'G'RI.**
>
> ## 🔑 **Va bu — atigi 248 millionlik BEPUL model.** Farq **hajmda emas** — farq **MA'LUMOTNI BERISHDA**.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** Model nima uchun *"keyingi kurs"* savoliga javob bera olmadi?

**M2.** Modelning uchta ko'r nuqtasi qaysilar?

**M3.** Yechim nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** Chunki bu ma'lumot uning **o'quv ma'lumotida yo'q**.

**M2.** ① **Vaqt** *(chegaradan keyingi voqealar)* · ② **tashkilot ma'lumoti** · ③ **shaxsiy hujjatlar**.

**M3.** ## **O'z ma'lumotingizni modelga BERISH** — LangChain/RAG.

</details>

### 🟡 O'rta

**M4.** ⭐ Model *"bilmayman"* deb aytmasligi nima uchun xavfli?

**M5.** *"Bilim 2021 da to'xtaydi"* bugun to'g'rimi?

<details>
<summary>✅ Javoblar</summary>

**M4.** Chunki foydalanuvchi javobni **to'g'ri** deb qabul qiladi.
```
'physics' · '1890' · '58'
    ↑
Uchalasi ham TO'QILGAN — lekin model buni AYTMADI
```
> ## 💡 **Model "ishonch darajasi" ni bermaydi** — u **doim** javob beradi. Tekshirish — **sizning** vazifangiz.

**M5.** ## ❌ **Aniq sana eskirgan** — bugun har modelning **o'z** chegarasi bor.
> ## ✅ **Lekin MUAMMO eskirmadi:** sizning **ichki hujjatlaringiz** hech qanday modelning o'quv ma'lumotida **hech qachon** bo'lmaydi.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Model **bilmaydigan** 5 ta savol o'ylab toping va sinang.

<details>
<summary>✅ Yechim</summary>

```python
sinovlar = [
    ("Vaqt",       "What happened in the year 2025?"),
    ("Tashkilot",  "What is the return policy of my company?"),
    ("Hujjat",     "What does clause 7 of my contract say?"),
    ("Shaxsiy",    "What did I write in my diary yesterday?"),
    ("Aniq fakt",  "How many students enrolled in the LangChain course?"),
]
for tur, s in sinovlar:
    print(f"[{tur}] {s}")
    print(f"   → {javob(f'Answer the question: {s}')!r}\n")
```

> ## 🎯 **DIQQAT BILAN QARANG — model NIMA QILADI?**
>
> ```
> ❌ KUTILGAN (lekin BO'LMAYDI):  "Men bilmayman"
> ✅ HAQIQATDA BO'LADI          :  ishonchli, lekin TO'QILGAN javob
> ```
>
> ## 🔑 **BEShTA SAVOL — BESHTA GALLYUTSINATSIYA.** Va modelda **hech qanday belgi** yo'q, qaysi javob **haqiqiy**, qaysi biri **to'qilgan** ekanini ko'rsatadigan.
>
> ## 💡 **Mana nima uchun RAG shunchalik muhim** — u modelga **manba** beradi va javobni **tekshirish mumkin** qiladi.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Model qanday savollarga javob bera olmaydi?
2. Nima uchun u baribir javob beradi?
3. Uchta ko'r nuqta qaysilar?
4. *"2021"* raqami bugun to'g'rimi?
5. Yechim nima deyiladi?

<details>
<summary>✅ Javoblar</summary>

1. O'quv ma'lumotida **bo'lmagan** — yangi voqealar, tashkilot ma'lumoti, shaxsiy hujjatlar.
2. Chunki u **keyingi so'zni bashorat qiladi** *(30-modul)* — *"bilmayman"* deyish uchun **maxsus sozlanishi** kerak.
3. ## **Vaqt** · **tashkilot** · **shaxsiy hujjatlar**.
4. **Aniq sana** — yo'q. **Muammo** — ha, va u **hech qachon** yo'qolmaydi *(ichki hujjatlar uchun)*.
5. ## **RAG** *(Retrieval-Augmented Generation)* — LangChain shu uchun ishlatiladi.

</details>

---

## 📌 Xulosa

```
MUAMMO — MODEL BILMAYDI, LEKIN JAVOB BERADI

  O'LCHANGAN (flan-t5-base, 248M):

    "Which course in March 2024?"  →  'physics'   ❌
    "When is the LangChain course?" →  '1890'     ❌
    "How many courses are there?"   →  '58'       ❌

  🔑 UCHALASI TO'QILGAN — va model buni AYTMADI


UCHTA KO'R NUQTA
  🕐 VAQT        →  chegaradan keyingi voqealar
  🏢 TASHKILOT   →  sizning kompaniyangiz ma'lumoti
  📄 HUJJATLAR   →  shaxsiy fayllaringiz

  ⚠️ Ikkinchi va uchinchisi HECH QACHON yo'qolmaydi
     (chegara qancha yangilansa ham)


✅ YECHIM — RAG

  ❌ "Model, sen BILASANMI?"       →  gallyutsinatsiya
  ✅ "Model, MANA MA'LUMOT"        →  to'g'ri javob

  (yopiq kitob vs ochiq kitob imtihoni)


🎯 10-DARSDA QURAMIZ — VA MANA NATIJA:
     'physics'  →  'Introduction to Large Language Models'  ✅
     '1890'     →  'April 2024'                             ✅
     '58'       →  'more than 60'                           ✅

  BIR XIL 248M MODEL. Farq — MA'LUMOTNI BERISHDA.
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Bilim chegarasi | *knowledge cutoff* | O'quv ma'lumotining oxirgi sanasi |
| Ko'r nuqta | *blind spot* | Model bilmaydigan soha |
| RAG | *Retrieval-Augmented Generation* | Qidiruv bilan boyitilgan generatsiya |
| Gallyutsinatsiya | *hallucination* | To'qib chiqarilgan javob |

---

⬅️ [Oldingi: Oddiy chatbot](07-Coding-a-Simple-Chatbot.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: LangChain nima?](09-LangChain.md)
