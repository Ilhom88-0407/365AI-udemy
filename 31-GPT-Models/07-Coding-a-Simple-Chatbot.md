# 7-dars. Oddiy chatbot yozish

## 🎬 Boshlashdan oldin

> **"Biz nafaqat kalit so'zlar xulosalagichini yaratish uchun tizim xabarini ko'rsata olamiz — undan JUDA KO'P TURLI natijalar yaratish uchun ham foydalanishimiz mumkin."**
>
> ## **"Keling, O'ZIGA XOSLIGI bor chatbot yaratamiz — SHE'RIY natija beradigan chatbot."**

---

## 1. G'oya — modelga SHAXSIYAT berish

> ## **"Avval tizim xabarimizni yaratamiz. Bu chatbotimizning UMUMIY MAQSADI haqida ko'rsatma beradi."**
>
> ## **"Bu tizim xabarining mazmuni quyidagi ko'rsatma bo'ladi: SEN — SHE'RIY CHATBOTSAN."**

```
6-DARS:  system = "kalit so'zlarni ajrat"     →  VAZIFA
7-DARS:  system = "sen she'riy chatbotsan"    →  SHAXSIYAT
                        ↑
        BIR XIL MEXANIZM, boshqa maqsad
```

> ## 💡 **Mana `system` xabarining haqiqiy kuchi:** siz **bitta qator** bilan modelning **butun xatti-harakatini** o'zgartirasiz.

---

## 2. ✅ Zamonaviy OpenAI kodi

> **"Modelning turli promptlarga qanday javob berishi kerakligiga oid ba'zi misollarni kiritmoqchimiz. Buni foydalanuvchi va yordamchi xabarlari bilan qilamiz."**

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

SHERIY_XABARLAR = [
    {"role": "system", "content": "You are a poetic chatbot."},

    {"role": "user", "content": "When was Google founded?"},
    {"role": "assistant",
     "content": "In nineteen ninety-eight, two students bright,\n"
                "built a search that filled the world with light."},

    {"role": "user", "content": "Which country has the youngest president?"},
    {"role": "assistant",
     "content": "In lands afar where young hearts lead,\n"
                "a nation trusts a youthful creed."},
]


def sheriy_chatbot(prompt, temperatura=1.0, maks_token=256):
    javob = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=SHERIY_XABARLAR + [{"role": "user", "content": prompt}],
        temperature=temperatura,
        max_tokens=maks_token,
    )
    return javob.choices[0].message.content


print(sheriy_chatbot("When was whiskey first made?"))
```

> **"Biz temperaturani BIR qilib qo'yamiz — she'riy javoblarimizda biroz TASODIFIYLIK bo'lishi uchun."**
>
> ## 💡 **Bu — 5-darsning amaliy qo'llanishi.** She'r uchun `temperature` **yuqori** *(1.0)*, faktlar uchun **past** *(0.2)*.

---

## 3. ⭐⭐ BEPUL MAHALLIY VERSIYA — va HALOL NATIJA

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

SHERIY_PROMPT = """You are a poetic chatbot.

Q: When was Google founded?
A: In nineteen ninety-eight, two students bright, built a search that filled the world with light.

Q: Which country has the youngest president?
A: In lands afar where young hearts lead, a nation trusts a youthful creed.

Q: {savol}
A:"""


def sheriy_mahalliy(savol, nom="google/flan-t5-base", maks_token=60):
    tok = AutoTokenizer.from_pretrained(nom)
    model = AutoModelForSeq2SeqLM.from_pretrained(nom)
    e = tok(SHERIY_PROMPT.format(savol=savol), return_tensors="pt")
    with torch.no_grad():
        o = model.generate(**e, max_new_tokens=maks_token)
    return tok.decode(o[0], skip_special_tokens=True)


for nom in ["google/flan-t5-small", "google/flan-t5-base"]:
    print(f"{nom}:")
    print(f"   {sheriy_mahalliy('When was whiskey first made?', nom)!r}\n")
```

```
google/flan-t5-small (76,961,152):
   '1897'

google/flan-t5-base (247,577,856):
   'The first whiskey was made in 1808 by James Madison, a distiller who
    grew up in the Highlands of Scotland.'
```

## 😅 IKKALASI HAM MUVAFFAQIYATSIZ — LEKIN TURLICHA

### ❌ `flan-t5-small` (77M)

```
'1897'
   ↑
① SHE'RIY EMAS       →  shaxsiyatni butunlay E'TIBORGA OLMADI
② FAKT XATO          →  viski 1897 da ixtiro qilinmagan
③ IKKI MISOL ham YORDAM BERMADI
```

### ❌ `flan-t5-base` (248M)

```
'The first whiskey was made in 1808 by James Madison, a distiller who
 grew up in the Highlands of Scotland.'
   ↑
✅ TO'LIQ JUMLA      →  shakl yaxshilandi
❌ SHE'RIY EMAS      →  oddiy nasr
❌❌ FAKT — FALOKAT
```

> ## 💥 **UCHINCHI QATORDAGI XATOGA ALOHIDA QARANG:**
>
> ```
> "James Madison, a distiller who grew up in the Highlands of Scotland"
>          ↑
>   James Madison — AQSH ning 4-PREZIDENTI (1751-1836),
>   Virginiyada tug'ilgan, SHOTLANDIYADA emas,
>   va u viski distillyatori BO'LMAGAN.
>
>   Viski esa 1808 dan ANCHA OLDIN — kamida XV asrdan ma'lum.
> ```
>
> ## 🎯 **MODEL UCHTA ALOHIDA FAKTNI ARALASHTIRIB, ISHONARLI YOLG'ON YARATDI.**
>
> Bu — **gallyutsinatsiyaning klassik namunasi**: javob **ravon**, **batafsil**, **ishonchli eshitiladi** — va **butunlay noto'g'ri**.

---

## 4. 🔑 Uchta saboq

### ① SHAXSIYAT ham MIQYOS talab qiladi

```
"You are a poetic chatbot"  →  77M:  E'TIBORGA OLMADI
                            →  248M: E'TIBORGA OLMADI
                            →  GPT-3.5: ✅ ISHLAYDI (kursda ko'ringan)
```

> 6-darsdagi bilan **bir xil naqsh**: `system` xabarining ta'siri — **paydo bo'luvchi qobiliyat**.

### ② Ravonlik ≠ To'g'rilik

```
77M   →  '1897'                          qisqa, xato
248M  →  batafsil, ravon jumla           ravon, XATO
             ↑
   HAJM RAVONLIKNI oshirdi,
   TO'G'RILIKNI esa OSHIRMADI

   ⚠️ Bu — ANCHA XAVFLIROQ holat:
      xato javob endi ISHONCHLI eshitiladi
```

> ## 💥 **BU — LLM'lardagi ENG XAVFLI NAQSH.**
>
> Kichik model **ochiqchasiga** yomon — siz unga **ishonmaysiz**. Kattaroq model **ishonchli** eshitiladi — va siz **aldanishingiz** mumkin.
>
> ## 🔑 **29-modulni eslang:** o'zbekcha *"juda ajoyib"* → `NEGATIVE` **0.956 ball** bilan. **Bir xil tuzoq.**

### ③ Yechim — RAG

```
❌ Modeldan FAKT SO'RASH        →  gallyutsinatsiya
✅ Modelga FAKTNI BERISH        →  RAG (8-10-darslar)
```

---

## 5. 🇺🇿 O'zbekcha she'riy chatbot?

```python
uz_prompt = """Sen she'riy chatbotsan. Savollarga she'r bilan javob ber.

Savol: Google qachon tashkil etilgan?
Javob: Ming to'qqiz yuz to'qson sakkizda, ikki talaba yosh,
       Dunyoga qidiruv berdi, bo'ldi ular quyosh.

Savol: {savol}
Javob:"""

print(sheriy_mahalliy_uz("Viski qachon ixtiro qilingan?"))
```

> ## ❌ **BU ISHLAMAYDI — va nima uchunligini SIZ BILASIZ.**
>
> ```
> ① flan-t5 asosan INGLIZ tilida o'qitilgan
> ② 30-modul: o'zbekcha so'zlar MAYDALANADI (3.1× ko'p token)
> ③ 77M/248M — she'riy shaxsiyat uchun JUDA KICHIK
>
> Uchta muammo BIR VAQTDA.
> ```
>
> ## ✅ **O'ZBEKCHA IJODIY MATN UCHUN NIMA ISHLAYDI?**
> ```
> ① GPT-4, Claude, Gemini      →  ✅ yaxshi, PULLIK
> ② Qwen, Gemma (ko'p tilli)   →  ⚠️ o'rtacha, bepul, lekin KATTA (7B+)
> ③ Kichik ingliz modellari    →  ❌ umuman ishlamaydi
> ```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Chatbotga shaxsiyat qanday beriladi?

**M2.** Nima uchun `temperature=1.0` tanlangan?

**M3.** `system` va `assistant` xabarlarining farqi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **`system` xabari** orqali — *"You are a poetic chatbot"*.

**M2.** She'r **ijodkorlik** talab qiladi → yuqori `temperature` **xilma-xillik** beradi. Faktlar uchun esa **past** *(0.0–0.3)*.

**M3.** `system` — **qoida** *("sen kimsan")* · `assistant` — **misol** *("shunday javob ber")*.

</details>

### 🟡 O'rta

**M4.** ⭐ `flan-t5-base` javobidagi **uchta xatoni** toping.

**M5.** Ravonlik oshgani nima uchun XAVFLI?

<details>
<summary>✅ Javoblar</summary>

**M4.**
```
'The first whiskey was made in 1808 by James Madison, a distiller who
 grew up in the Highlands of Scotland.'

① "1808"          →  viski XV asrdan ma'lum, 1808 da emas
② "James Madison" →  AQSH PREZIDENTI (1751-1836), distillyator emas
③ "Highlands of Scotland" →  Madison VIRGINIYADA tug'ilgan
```
> 🔑 Model **uchta alohida faktni** aralashtirib, **ishonarli yolg'on** yaratdi.

**M5.**
```
KICHIK model  →  ochiqchasiga yomon  →  siz ISHONMAYSIZ      ✅ xavfsiz
KATTA model   →  ravon va batafsil   →  siz ALDANISHINGIZ mumkin  ⚠️ XAVFLI
```
> ## 💡 **Ravonlik — to'g'rilikning KAFOLATI EMAS.** Bu — LLM'lar bilan ishlashdagi **eng muhim ogohlantirish**.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ O'z shaxsiyatingiz bilan chatbot yarating va **turli hajmdagi** modellarda sinang.

<details>
<summary>✅ Yechim</summary>

```python
import warnings; warnings.filterwarnings("ignore")
import torch, pandas as pd
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

SHAXSIYATLAR = {
    "she'riy":    "You are a poetic chatbot. Answer in rhyme.",
    "qisqa":      "You are a terse chatbot. Answer in exactly three words.",
    "bola uchun": "You are a chatbot for children. Explain very simply.",
}

def shaxsiyat_sinovi(savol, nom="google/flan-t5-base"):
    tok = AutoTokenizer.from_pretrained(nom)
    model = AutoModelForSeq2SeqLM.from_pretrained(nom)
    qatorlar = []
    for tur, korsatma in SHAXSIYATLAR.items():
        p = f"{korsatma}\n\nQ: {savol}\nA:"
        e = tok(p, return_tensors="pt")
        with torch.no_grad():
            r = tok.decode(model.generate(**e, max_new_tokens=40)[0],
                           skip_special_tokens=True)
        qatorlar.append({"shaxsiyat": tur, "javob": r})
    return pd.DataFrame(qatorlar)

print(shaxsiyat_sinovi("What is the sun?").to_string(index=False))
```

> ## 🎯 **DIQQAT BILAN QARANG — javoblar BIR-BIRIDAN FARQ QILADIMI?**
>
> ```
> ✅ FARQ QILSA   →  model system ko'rsatmasini TUSHUNDI
> ❌ BIR XIL BO'LSA →  model uni E'TIBORGA OLMADI
> ```
>
> ## 💡 **Kichik modellarda javoblar ko'pincha DEYARLI BIR XIL bo'ladi** — bu, model ko'rsatmani **o'qigan**, lekin unga **amal qilmagan** degani.
>
> ## 🔑 **Bu — o'z modelingizni tanlashda ENG MUHIM sinov.** Agar `system` xabari natijani **o'zgartirmasa**, model sizning vazifangiz uchun **juda kichik**.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Shaxsiyat qanday beriladi?
2. She'r uchun qanday `temperature` mos?
3. Kichik modellarda shaxsiyat nima uchun ishlamadi?
4. Ravonlik oshgani nima uchun xavfli?
5. Faktlar muammosining yechimi nima?

<details>
<summary>✅ Javoblar</summary>

1. ## **`system` xabari** bilan.
2. **Yuqori** — `0.9`–`1.0` *(ijodkorlik uchun)*.
3. Chunki `system` ko'rsatmasiga amal qilish — **miqyos talab qiladigan** qobiliyat *(6-darsdagi few-shot bilan bir xil)*.
4. Xato javob **ishonchli eshitiladi** → foydalanuvchi **aldanadi**. Kichik model **ochiqchasiga** yomon — bu **xavfsizroq**.
5. ## **RAG** — modelga faktni **berish** *(8–10-darslar)*.

</details>

---

## 📌 Xulosa

```
CHATBOTGA SHAXSIYAT BERISH

  system = "You are a poetic chatbot"
     +
  user/assistant misollari (few-shot)
     +
  temperature = 1.0 (ijodkorlik uchun)


⚠️ O'LCHANGAN — SHAXSIYAT HAM MIQYOS TALAB QILADI

  flan-t5-small (77M)   →  '1897'
                            she'riy EMAS · fakt XATO

  flan-t5-base (248M)   →  'The first whiskey was made in 1808 by
                            James Madison, a distiller who grew up
                            in the Highlands of Scotland.'
                            she'riy EMAS · UCHTA FAKT XATO


💥 UCHTA XATO BITTA JUMLADA
   ① 1808          →  viski XV asrdan ma'lum
   ② James Madison →  AQSH PREZIDENTI, distillyator emas
   ③ Scotland      →  u Virginiyada tug'ilgan


🔑 UCHTA SABOQ

  ① Shaxsiyat = paydo bo'luvchi qobiliyat (6-dars bilan bir xil)

  ② RAVONLIK ≠ TO'G'RILIK
       kichik model  →  ochiqchasiga yomon  →  ishonmaysiz  ✅
       katta model   →  ravon va batafsil   →  ALDANASIZ    ⚠️

  ③ Yechim  →  RAG (8-10-darslar)
       ❌ modeldan FAKT SO'RASH
       ✅ modelga FAKTNI BERISH
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Shaxsiyat | *persona* | Chatbotning xarakteri |
| Tizim ko'rsatmasi | *system prompt* | Modelning umumiy qoidasi |
| Gallyutsinatsiya | *hallucination* | Ishonchli eshitiladigan yolg'on |
| Ravonlik | *fluency* | Matnning silliqligi |

---

⬅️ [Oldingi: Kalit so'zlar bilan xulosalash](06-Keyword-Text-Summarization.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: LangChain'ga kirish](08-Introduction-to-LangChain.md)
