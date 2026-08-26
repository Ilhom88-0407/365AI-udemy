# 2-dars. LangChain'ning biznes qo'llanmalari

## 🎬 Boshlashdan oldin

> **"Bu darsda kompaniyalar o'z xodimlarining unumdorligini oshirish yoki mijozlar tajribasini yaxshilash uchun LangChain yechimlarini QANDAY qo'llaganini ko'rsatamiz."**

---

## 1. Ally Financial — suhbatlarni xulosalash

> **"Ally Financial — AQShning eng yirik bank holdinglaridan va avtomobil moliyalashtirish kompaniyalaridan biri. Ular LangChain bilan hamkorlikda LLM asosidagi ally.ai platformasini yaratdilar. Bu platforma yordamchi va mijoz o'rtasidagi qo'ng'iroq suhbatlarini XULOSALASH uchun mo'ljallangan."**

```
MUAMMO:  operator har qo'ng'iroqdan keyin QO'LDA hisobot yozadi
         → vaqt ketadi, mijozga e'tibor kamayadi

YECHIM:  LLM suhbatni AVTOMATIK xulosalaydi
```

### ⚠️ Lekin bitta jiddiy to'siq bor edi

> **"Moliyaviy yordam ko'rsatish muqarrar ravishda mijozning ismi, ijtimoiy sug'urta raqami, hisob ma'lumotlari, elektron pochta manzili kabi MAXFIY ma'lumotlarni almashishni o'z ichiga oladi. Tushunarli, biz bunday nozik ma'lumot bo'lgan suhbatni shunchaki ChatGPT ga qo'yib, xulosa so'ray olmaymiz."**

![PII maskalash](assets/02-pii-maskalash.svg)

```
MIJOZ SUHBATI                    MASKALANGAN
─────────────                    ───────────
"Ismim Alisher Karimov,     →    "Ismim <PERSON>,
 hisobim 4276-1234-...            hisobim <CREDIT_CARD>
 pochta a.karimov@mail.uz"        pochta <EMAIL_ADDRESS>"
                                        ↓
                                    LLM ga YUBORILADI
                                        ↓
                                    XULOSA qaytadi
                                        ↓
                                 ⭐ maskalar QAYTA TIKLANADI
```

> ## 🔑 **LANGCHAIN'NING ROLI — U KO'PRIK.** LLM chaqirilishidan **oldin** maxfiy satrlarni **maskalaydigan** modul beradi.

> ## ⚠️⚠️ **HALOL OGOHLANTIRISH — MASKALASH 100% ISHONCHLI EMAS.**
>
> LangChain'ning `PresidioAnonymizer` moduli **Microsoft Presidio** ga tayanadi, u esa **naqsh** va **NER modeliga** asoslangan.
>
> ```
> ✅ Yaxshi ishlaydi  →  karta raqami, email, telefon  (QAT'IY NAQSH)
> ⚠️ Xato qiladi      →  ismlar, manzillar            (KONTEKSTGA bog'liq)
> ```
>
> ## 💥 **32-modul 2-darsida buni O'LCHAGAN EDIK:** NER modeli o'zbekcha `Toshkent` ni **0.963** ishonch bilan topdi, lekin ba'zi nomlarni **o'tkazib yubordi**. `score > 0.9` filtri kerak bo'lgan edi.
>
> ## 🔑 **AMALIY XULOSA:** maskalashni **birinchi himoya qatlami** deb biling, **yagona** deb emas. Moliyaviy/tibbiy loyihada:
> ```
> ① avtomatik maskalash
> ② + QAT'IY regex tekshiruvi (karta, INN, pasport)
> ③ + audit jurnali
> ④ + yuqori xavfda INSON tasdig'i
> ```

---

## 2. Adyen — qo'llab-quvvatlash chiptalarini yo'naltirish

> **"Adyen — Microsoft, Spotify va LinkedIn kabi gigantlar foydalanadigan fintech platforma. Ular hal qilmoqchi bo'lgan muammo — kiruvchi mijoz chiptalariga javob kutish vaqtini AQLLI YO'NALTIRISH tizimi orqali kamaytirish."**

```
① CHIPTA YO'NALTIRISH  →  qaysi bo'limga tegishli?
② AVTOMATIK JAVOB      →  LLM javob yozadi
```

> **"Yana ham, biz chiptani ChatGPT ga nusxalab, undan mijozga yordam berishini kuta olmaymiz. Modelda bu ma'lumot YO'Q. Lekin LangChain yordamida ular loyihani muvaffaqiyatli amalga oshirdilar — RETRIEVAL AUGMENTED GENERATION deb ataladigan texnikaga tayanib."**

> ## ⭐ **BU — RAG.** Uni **42-modulda** batafsil ko'ramiz, va **31-modul 10-darsida** allaqachon **qo'lda yozgan edik**.

### 🔬 Ikkita vazifa — ikki xil qiyinlik

```
① CHIPTA YO'NALTIRISH  =  TASNIF vazifasi
   ✅ ISHONCHLI  —  34-moduldagi bilan bir xil muammo
   ✅ Xato bo'lsa — inson tuzatadi, zarar KICHIK
   ✅ Aniqlikni O'LCHASH oson (chalkashlik matritsasi)

② AVTOMATIK JAVOB     =  GENERATSIYA vazifasi
   ⚠️ XAVFLI  —  model YOLG'ON to'qishi mumkin
   ⚠️ Noto'g'ri moliyaviy maslahat  →  YURIDIK javobgarlik
   ⚠️ "Sifat" ni o'lchash QIYIN
```

> ## 🔑 **KURS "COPILOT" SO'ZINI ATAYLAB ISHLATGAN** — *"support agent copilot"*. Ya'ni tizim javobni **taklif qiladi**, operator esa **tasdiqlaydi**.
>
> ## 💡 **BU — ENG XAVFSIZ NAQSH:** `LLM taklif qiladi → inson tasdiqlaydi`. Ishlab chiqarishda **shu bilan boshlang**, to'liq avtomatlashtirish bilan **emas**.

---

## 3. RoboCorp — kod yaratish

> **"RoboCorp — turli sohalarda vazifalarni avtomatlashtirish uchun botlar yaratishga imkon beruvchi Python platformasi. RoboCorp LangChain'dan foydalanib, sizga kod bo'yicha maslahat bera oladigan yoki butun kod parchasini yaratib beradigan yordamchi yaratdi."**

```
MIJOZ:  "Menga saytdan narxlarni yig'adigan bot kerak"
              ↓
   ReMark  →  hujjatlar + kod misollari asosida
              ↓
   TAYYOR KOD PARCHASI
```

> ## ⚠️ **BU — RAG'NING YANA BIR KO'RINISHI.** Model **hujjatlarni** o'qiydi va **shunga asoslanib** kod yozadi.
>
> ## 💡 **NIMA UCHUN BU ISHLAYDI?** Chunki kod — **tekshirilishi mumkin**. Kod ishlamasa, **darhol ma'lum bo'ladi**. Bu — LLM uchun **ideal** vazifa: xato **arzon** va **darhol ko'rinadi**.
>
> ## 🔑 **TAQQOSLANG:**
> ```
> Kod yozish      →  xato DARHOL ko'rinadi        ✅ LLM uchun yaxshi
> Fakt aytish     →  xato SEZILMAY qolishi mumkin ⚠️ LLM uchun xavfli
> ```

---

## 4. ⭐⭐ Uchta holatdan chiqadigan UMUMIY naqsh

| Kompaniya | Muammo | LangChain roli | Xavf darajasi |
|---|---|---|---|
| **Ally** | Maxfiy ma'lumot | ## **Maskalash ko'prigi** | ⚠️ O'rta |
| **Adyen** | Model kompaniyani bilmaydi | ## **RAG** | ⚠️ O'rta |
| **RoboCorp** | Model API'ni bilmaydi | ## **RAG** | ✅ Past |

> ## 🔑 **UCHALASIDA HAM MUAMMO BITTA:**
> ```
> "LLM MENING ma'lumotimni bilmaydi"
> ```
> ## ✅ **Va yechim ham bitta:** kerakli ma'lumotni **topib**, promptga **qo'shish**.

> ## 💥 **VA MANA ENG MUHIM KUZATUV — UCHALASIDA HAM LLM QAROR QABUL QILMAYDI:**
> ```
> Ally      →  LLM XULOSALAYDI, kredit qarorini qabul QILMAYDI
> Adyen     →  LLM TAKLIF qiladi, operator TASDIQLAYDI
> RoboCorp  →  LLM KOD yozadi, dasturchi ISHGA TUSHIRADI
> ```
>
> ## 🏆 **BU — TASODIF EMAS, BU — LOYIHA NAQSHI.** LLM'ni **yordamchi** sifatida qo'ying, **qaror qabul qiluvchi** sifatida emas.

---

## 5. 🇺🇿 O'zbekistonda qanday qo'llash mumkin?

| G'oya | Realistik baho | Nima kerak |
|---|---|---|
| **Bank qo'llab-quvvatlash bo'yicha savol-javob** | ## ✅ **Ishonchli** | O'zbekcha FAQ hujjatlari |
| **Hujjat xulosalash** *(shartnoma, hisobot)* | ## ✅ **Ishonchli** | PII maskalash **shart** |
| **Chiptalarni yo'naltirish** | ## ✅ **Ishonchli** | 200+ yorliqlangan chipta *(34-modul)* |
| **Yuridik maslahat** | ## ❌ **XAVFLI** | Faqat **iqtibos bilan** |
| **Tibbiy tashxis** | ## ❌ **TAQIQLANGAN** | — |
| **Soliq hisob-kitobi** | ## ⚠️ **Ehtiyot** | Hisobni **kod** qilsin, LLM emas |

> ## ⚠️⚠️ **O'ZBEKISTON UCHUN ALOHIDA XAVF — MA'LUMOT CHET ELGA CHIQADI.**
>
> ```
> OpenAI API  →  ma'lumot AQSh serverlariga yuboriladi
> ```
>
> **Bank, tibbiy va davlat ma'lumotlari uchun bu ko'pincha QONUNIY MUAMMO.**
>
> ## ✅ **YECHIMLAR:**
> ```
> ① MAHALLIY model  →  Llama, Qwen, Mistral  (32-modul: HAMMASI BEPUL)
>                       ma'lumot SERVERINGIZDAN CHIQMAYDI
>
> ② PII maskalash   →  nozik joylarni almashtirib, keyin yuborish
>
> ③ Gibrid          →  nozik ma'lumot MAHALLIY modelda,
>                       umumiy savollar API'da
> ```
>
> ## 🔑 **32-MODULNI ESLANG:** `pipeline()` bilan hamma narsa **bepul va mahalliy** ishlaydi. LangChain **mahalliy modellarni ham qo'llab-quvvatlaydi** — bu kursda ko'rsatilmagan, lekin **mumkin**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Ally Financial qanday muammoni hal qildi?

**M2.** Adyen qaysi texnikadan foydalandi?

**M3.** Uchala holatda umumiy muammo nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** Operatorlarning qo'lda **hisobot yozishi**. LLM suhbatni **avtomatik xulosalaydi**, PII esa **maskalanadi**.

**M2.** ## **RAG** — Retrieval Augmented Generation.

**M3.** ## **"LLM mening ma'lumotimni bilmaydi."** Yechim — kerakli matnni **topib, promptga qo'shish**.

</details>

### 🟡 O'rta

**M4.** ⭐ Uchala holatda LLM qaror qabul qiladimi?

<details>
<summary>✅ Javob</summary>

## ❌ **YO'Q — birortasida ham.**
```
Ally      →  XULOSALAYDI  (kredit qarorini inson qabul qiladi)
Adyen     →  TAKLIF qiladi (operator tasdiqlaydi)
RoboCorp  →  KOD yozadi   (dasturchi ishga tushiradi)
```
## 🏆 **Bu — atayin qilingan LOYIHA NAQSHI**, tasodif emas.

</details>

**M5.** ⭐ Oddiy PII maskalagich yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re

NAQSHLAR = {
    "EMAIL":  r"\b[\w.+-]+@[\w-]+\.[\w.]+\b",
    "TELEFON": r"(?:\+998|998)?[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}",
    "KARTA":  r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",
    "INN":    r"\b\d{9}\b",
}

def maskala(matn):
    xarita = {}
    for nom, naqsh in NAQSHLAR.items():
        for i, m in enumerate(set(re.findall(naqsh, matn))):
            kalit = f"<{nom}_{i}>"
            xarita[kalit] = m
            matn = matn.replace(m, kalit)
    return matn, xarita

def qayta_tikla(matn, xarita):
    for k, v in xarita.items():
        matn = matn.replace(k, v)
    return matn

t = ("Mijoz: Alisher Karimov, pochta a.karimov@mail.uz, "
     "karta 4276 1234 5678 9012, tel +998 90 123 45 67")
m, x = maskala(t)
print("MASKALANGAN:", m)
print("QAYTA TIKLANGAN:", qayta_tikla(m, x))
```

## ⚠️ **DIQQAT — `Alisher Karimov` MASKALANMADI.** Ismlar uchun **naqsh yetarli emas**, **NER modeli** kerak *(32-modul, 2-dars)*. **Bu — maskalashning eng zaif joyi.**

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ NER bilan ismlarni ham maskalang.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import pipeline

ner = pipeline("ner", model="Davlan/bert-base-multilingual-cased-ner-hrl",
               aggregation_strategy="simple")

def maskala_ner(matn, chegara=0.90):
    """⚠️ chegara MUHIM — 32-modul 2-darsida o'lchagan edik."""
    natijalar = [e for e in ner(matn) if e["score"] >= chegara]
    for e in sorted(natijalar, key=lambda x: -x["start"]):
        matn = matn[:e["start"]] + f"<{e['entity_group']}>" + matn[e["end"]:]
    return matn

print(maskala_ner("Mijoz Alisher Karimov Toshkentdan qo'ng'iroq qildi"))
```

## ⚠️ **CHEGARA ILDIZI — 32-MODUL 2-DARS:** `score > 0.9` filtri **ikkala xatoni** yo'qotgan edi. Maskalashda chegara **pastroq** bo'lishi kerak *(0.7–0.8)* — chunki **o'tkazib yuborish** *(false negative)* **noto'g'ri maskalashdan** ancha **xavfliroq**.

## 🔑 **XAVFSIZLIKDA ASIMMETRIYA:**
```
Ortiqcha maskalash  →  xulosa biroz noaniq bo'ladi   (ARZON)
O'tkazib yuborish   →  MAXFIY MA'LUMOT CHIQIB KETDI  (QIMMAT)
```

</details>

**M7.** ⭐⭐ O'zbekistondagi bank uchun arxitektura chizing.

<details>
<summary>✅ Javob</summary>

```
MIJOZ SUHBATI (o'zbekcha)
        ↓
① PII MASKALASH  ←  regex + NER (mahalliy, chegara 0.75)
        ↓
② QAROR: ma'lumot NOZIKMI?
   ├─ HA   →  MAHALLIY model (Llama/Qwen, o'z serveringizda)
   └─ YO'Q →  OpenAI API
        ↓
③ RAG  ←  bank FAQ hujjatlari (o'zbekcha)
        ↓
④ JAVOB + IQTIBOS (qaysi hujjatdan)
        ↓
⑤ ISHONCH < chegara?  →  ❓ OPERATORGA yo'naltirish
        ↓
⑥ AUDIT JURNALI  (kim, qachon, nima so'radi, nima javob oldi)
        ↓
   OPERATOR TASDIQLAYDI  →  MIJOZGA
```

## 🏆 **BEShTA HIMOYA QATLAMI.** Ularning **hech biri** ortiqcha emas — moliyaviy sohada xato **qimmatga tushadi**.

</details>

---

## 🧠 O'zini tekshirish

<details>
<summary>❓ PII maskalash 100% ishonchlimi?</summary>

**Yo'q.** Qat'iy naqshlar *(karta, email, telefon)* **yaxshi** ishlaydi. **Ismlar** va **manzillar** — kontekstga bog'liq, NER modeli kerak, u ham **xato qiladi**. Uni **birinchi qatlam** deb biling.
</details>

<details>
<summary>❓ Nima uchun uchala kompaniya ham LLM'ga qaror qabul qildirmaydi?</summary>

Chunki LLM **yolg'on to'qiy oladi** va xatosi **sezilmay** qolishi mumkin. `LLM taklif qiladi → inson tasdiqlaydi` naqshi — **eng xavfsiz** boshlanish nuqtasi.
</details>

<details>
<summary>❓ O'zbekistonda OpenAI API bank uchun mos keladimi?</summary>

**Ko'pincha yo'q** — ma'lumot **chet el serveriga** chiqadi. **Mahalliy model** *(32-modul)* yoki **maskalash + gibrid** yondashuv kerak.
</details>

---

## 📌 Xulosa

```
UCHALA HOLATDA HAM:

   MUAMMO   →  "LLM mening ma'lumotimni bilmaydi"
   YECHIM   →  kerakli matnni TOPIB, promptga QO'SHISH  (RAG)
   NAQSH    →  ⭐ LLM TAKLIF QILADI  →  INSON TASDIQLAYDI
```

| | Ally | Adyen | RoboCorp |
|---|---|---|---|
| Vazifa | Xulosalash | Yo'naltirish + javob | Kod yozish |
| Asosiy texnika | ## **Maskalash** | ## **RAG** | ## **RAG** |
| Xato narxi | O'rta | O'rta | ## **Past** |
| Inson nazorati | ✅ | ✅ | ✅ |

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| PII | Personally Identifiable Information | Shaxsni **aniqlovchi** ma'lumot |
| Maskalash | Masking / anonymization | Maxfiy satrni **almashtirish** |
| RAG | Retrieval Augmented Generation | Ma'lumot **topib**, promptga **qo'shish** |
| Copilot | Copilot | LLM **taklif qiladi**, inson **tasdiqlaydi** |
| Chipta yo'naltirish | Ticket routing | So'rovni **to'g'ri bo'limga** yuborish |

---

⬅️ [1-dars. Kursga kirish](01-Introduction-to-the-Course.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. LangChain'ni nima kuchli qiladi](03-What-Makes-LangChain-Powerful.md)
