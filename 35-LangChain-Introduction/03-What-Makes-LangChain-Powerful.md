# 3-dars. LangChain'ni nima kuchli qiladi ⭐

## 🎬 Boshlashdan oldin

> **"Bu darsda LangChain'ni LLM asosidagi ilovalar qurish uchun KUCHLI vosita qiladigan sehrli ingredientni ochamiz."**

---

## 1. To'rtta ustun

![LangChain komponentlari](assets/03-komponentlar.svg)

```
┌──────────────────────────────────────────────────────────┐
│                     LANGCHAIN                            │
├─────────────┬──────────────┬─────────────┬───────────────┤
│  ① MODEL    │  ② XOTIRA    │  ③ MA'LUMOT │  ④ VOSITALAR  │
│             │              │             │               │
│  OpenAI     │  suhbat      │  loader     │  Wikipedia    │
│  Anthropic  │  tarixi      │  splitter   │  qidiruv      │
│  Google     │              │  vektor     │  kod ishga    │
│  mahalliy   │              │  bazasi     │  tushirish    │
└─────────────┴──────────────┴─────────────┴───────────────┘
   38-modul      39-modul      42-modul      (agentlar)
```

---

## 2. ① Model integratsiyalari

> **"Turli til modellariga kirish LangChain bilan JUDA OSON, chunki u ko'plab LLM provayderlari bilan integratsiyalashgan. Bu kursda OpenAI provayderining LangChain integratsiyasidan foydalanamiz — aniqrog'i GPT-4."**

```python
# OpenAI
from langchain_openai import ChatOpenAI
model = ChatOpenAI(model="gpt-4o-mini")

# Anthropic — ⭐ FAQAT BITTA SATR o'zgaradi
from langchain_anthropic import ChatAnthropic
model = ChatAnthropic(model="claude-sonnet-4-5")

# Google
from langchain_google_genai import ChatGoogleGenerativeAI
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

# ⭐⭐ MAHALLIY — BEPUL, ma'lumot chiqmaydi (kursda YO'Q!)
from langchain_ollama import ChatOllama
model = ChatOllama(model="llama3.2")
```

> ## 🔑 **QOLGAN HAMMA KOD BIR XIL.** Prompt, zanjir, xotira, RAG — hech nima o'zgarmaydi.
>
> ## ⭐⭐ **KURSDA `ChatOllama` KO'RSATILMAGAN — LEKIN U ENG MUHIM VARIANT.**
> ```
> ✅ BEPUL           →  API kaliti kerak emas
> ✅ MAXFIY          →  ma'lumot kompyuteringizdan CHIQMAYDI
> ⚠️ SIFAT pastroq   →  gpt-4o darajasida emas
> ⚠️ RAM kerak       →  7B model uchun ~8 GB
> ```
> ## 🇺🇿 **O'zbekistondagi bank, tibbiyot, davlat loyihalarida bu — ko'pincha YAGONA qonuniy variant** *(2-dars, 5-bo'lim)*.

### ⚠️ Paketlar 2024-da BO'LINGAN

```
ESKI (kurs davri)              YANGI (bugun)
─────────────────              ─────────────
langchain                  →   langchain-core        (asosiy abstraksiya)
   ↑ hammasi bitta joyda        langchain            (zanjirlar, agentlar)
                                langchain-openai     (OpenAI)
                                langchain-anthropic  (Claude)
                                langchain-community  (qolgan hammasi)
```

```python
❌ from langchain.chat_models import ChatOpenAI      # ESKI
✅ from langchain_openai import ChatOpenAI           # YANGI
```

> ## 💥 **KURSDAGI KO'P IMPORT SATRLARI BUGUN ISHLAMAYDI.** Biz har darsda **eski/yangi** juftligini **ko'rsatib boramiz**.

---

## 3. ② Xotira — LLM STATELESS

> **"LLM'lar tabiatan HOLATSIZ, shuning uchun bizga joriy suhbatni SAQLAYDIGAN va uni til modeliga KONTEKST sifatida beradigan mexanizm kerak."**

```
SIZ KO'RASIZ                    ASLIDA SODIR BO'LADI
────────────                    ────────────────────
Foydalanuvchi: "Salom"          → [Salom]
Bot: "Salom!"
Foydalanuvchi: "Ismim Ali"      → [Salom, Salom!, Ismim Ali]
Bot: "Tanishganimdan xursandman"
Foydalanuvchi: "Ismim nima?"    → [Salom, Salom!, Ismim Ali,
Bot: "Ali"                          Tanishganimdan..., Ismim nima?]
                                          ↑
                                  BUTUN TARIX QAYTA YUBORILADI
```

> ## 💥 **"XOTIRA" — ILLYUZIYA.** Model hech narsani **eslamaydi**. Dastur butun suhbatni **har safar qayta yuboradi**.
>
> ## ⚠️⚠️ **VA BU PUL TURADI:**
> ```
> 1-savol   →   50 token
> 5-savol   →  600 token
> 20-savol  →  4000 token       ← har savol QIMMATLASHIB boradi
> ```
>
> ## 🔑 **SHUNING UCHUN 39-MODULDA XOTIRA STRATEGIYALARI KERAK:**
> ```
> Buffer          →  hammasini saqla        (sodda, QIMMAT)
> Window          →  oxirgi N ta xabar      (⭐ eng amaliy)
> Summary         →  eski qismni XULOSALA   (arzon, ma'lumot yo'qoladi)
> Token buffer    →  token chegarasigacha   (aniq nazorat)
> ```

---

## 4. ③ Kontekstga xabardorlik — hujjatlar

> **"Ma'lumot PDF, doc fayl, CSV kabi ko'rinishlarda keladi. Barcha formatlarni teng asosda qanday qayta ishlaymiz? LangChain ko'plab HUJJAT YUKLOVCHILARINI taklif qiladi."**

```
PDF · DOCX · CSV · HTML · JSON · Notion · Google Drive · YouTube ...
                        ↓
                 DocumentLoader
                        ↓
        Document(page_content="...", metadata={...})
                        ↓
                  ⭐ BITTA FORMAT
```

> ## 🔑 **ASOSIY G'OYA — HAMMASI `Document` GA AYLANADI.** Keyingi hamma qadam **format haqida o'ylamaydi**.

```python
from langchain_community.document_loaders import (
    PyPDFLoader, Docx2txtLoader, CSVLoader, TextLoader)

hujjatlar = PyPDFLoader("hisobot.pdf").load()
print(hujjatlar[0].page_content[:200])
print(hujjatlar[0].metadata)     # {'source': 'hisobot.pdf', 'page': 0}
```

> ## ⚠️ **HALOL OGOHLANTIRISH — PDF ENG QIYIN FORMAT:**
> ```
> ✅ Oddiy matnli PDF        →  yaxshi ishlaydi
> ⚠️ Ustunli / jadvalli PDF  →  matn ARALASHIB ketadi
> ❌ Skanerlangan PDF        →  MATN YO'Q (OCR kerak)
> ```
> ## 💡 **HAR DOIM `page_content` NI KO'ZINGIZ BILAN KO'RING.** Yuklovchi **xato bermaydi** — u shunchaki **bo'sh** yoki **aralash** matn qaytaradi.

### Va ma'lumotni saqlash joyi

> **"Tasavvur qiling, biz beradigan ma'lumot juda katta. 365 Q&A chatbot yaratmoqchisiz va barcha kurslar transkriptini yuklamoqchisiz. Bularning hammasini saqlash uchun joy kerak."**

```
Hujjatlar  →  BO'LAKLASH  →  EMBEDDING  →  VEKTOR BAZASI
                                             (Chroma, Pinecone, FAISS)
```

> ## ⭐ **48–51-MODULLAR AYNAN SHU HAQDA.** 42-modulda esa uni **LangChain ichida** ishlatamiz.

---

## 5. ④ Vositalar va agentlar

> **"Bunday chatbotlar turli muammolarni hal qilish uchun TASHQI VOSITALARDAN foydalanadi, mos keladiganini AVTONOM tanlaydi va bir nechta vosita kerak bo'lganda ketma-ketlikni belgilaydi."**

```
FOYDALANUVCHI:  "Toshkent aholisi Samarqandnikidan necha marta ko'p?"
                              ↓
   AGENT:  "Menga ikkita raqam va bo'lish kerak"
                              ↓
   ① Wikipedia("Toshkent")     →  2 900 000
   ② Wikipedia("Samarqand")    →    550 000
   ③ Kalkulyator(2900000/550000) →  5.27
                              ↓
   JAVOB:  "Taxminan 5.3 marta ko'p"
```

> ## ⚠️⚠️ **HALOL BAHO — AGENTLAR ENG NOISHONCHLI QISM.**
>
> ```
> ❌ Noto'g'ri vosita tanlash
> ❌ Cheksiz siklga tushib qolish
> ❌ Vosita natijasini NOTO'G'RI talqin qilish
> ❌ Har qadam PUL turadi  →  10 qadamli sikl = 10× narx
> ```
>
> ## 🔑 **ISHLAB CHIQARISHDA:**
> ```
> ✅ max_iterations chegarasini QO'YING
> ✅ Vositalar sonini KAMAYTIRING  (2–5 ta, 20 ta emas)
> ✅ Har qadamni JURNALGA yozing
> ✅ Mumkin bo'lsa — QAT'IY zanjir yozing, agent o'rniga
> ```
>
> ## 💡 **QOIDA:** agar oqim **oldindan ma'lum** bo'lsa — **zanjir** yozing *(41-modul, LCEL)*. Agent faqat oqim **haqiqatan noma'lum** bo'lganda kerak.

---

## 6. LangChain ekotizimi

> **"LangSmith platformasi mahsulotni tekshirish, monitoring va baholash uchun mo'ljallangan. LangServe esa ilovangizni API sifatida joylashtirishga imkon beradi."**

| Vosita | Vazifa | Bepulmi |
|---|---|---|
| **LangChain** | ## Ishlab chiqish | ✅ **Ha, ochiq kod** |
| **LangSmith** | Kuzatuv, baholash | ⚠️ Cheklangan bepul |
| **LangServe** | API sifatida joylashtirish | ✅ Ha |
| **LangGraph** | ## Murakkab oqimlar | ✅ **Ha** ← ⭐ **43–47-modul** |

> ## 💡 **KURS LANGSERVE'NI ESLATADI, LEKIN 2025-DAN BOSHLAB U DEYARLI TASHLAB QO'YILGAN.** Bugun ilovani joylashtirish uchun oddiy **FastAPI** yoki **Streamlit** ishlatiladi *(65-modul)*.
>
> ## ⭐⭐ **VA E'TIBOR BERING — `LangGraph` KURSNING SHU QISMIDA ESLATILMAGAN**, lekin **43–47-modullarda** batafsil ko'riladi. Bugun murakkab agentlar uchun **aynan u** tavsiya etiladi, klassik `AgentExecutor` emas.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** LangChain'ning to'rtta asosiy komponenti?

**M2.** Nima uchun LLM'ga xotira kerak?

**M3.** `Document` obyektida nima bor?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Model** · **xotira** · **ma'lumot** *(retrieval)* · **vositalar** *(agentlar)*.

**M2.** Chunki LLM **stateless** — har chaqiruv mustaqil. "Xotira" = butun suhbatni **qayta yuborish**.

**M3.** ## `page_content` *(matn)* va `metadata` *(manba, sahifa, ...)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Modelni almashtirish qancha kodni o'zgartiradi?

<details>
<summary>✅ Javob</summary>

## **Ikki satr** — `import` va `model = ...`.

```python
# OpenAI                                  # Anthropic
from langchain_openai import ChatOpenAI   from langchain_anthropic import ChatAnthropic
model = ChatOpenAI(model="gpt-4o-mini")   model = ChatAnthropic(model="claude-sonnet-4-5")

# ⭐ Qolgan HAMMA kod bir xil
zanjir = prompt | model | parser
```

## 🔑 **BU — LANGCHAIN'NING ASOSIY QIYMATI.** Provayder **almashtiriladi**, ilova **qolaveradi**.

</details>

**M5.** ⭐⭐ Xotira narxini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
def suhbat_narxi(n_xabar, o_rt_token=60, narx_1m=0.15):
    """Har xabarda BUTUN tarix qayta yuboriladi."""
    jami = sum((i + 1) * o_rt_token for i in range(n_xabar))
    return jami, jami / 1_000_000 * narx_1m

for n in [5, 20, 50, 100]:
    t, p = suhbat_narxi(n)
    print(f"{n:4d} xabar → {t:8,} token → ${p:.4f}")
```

```
   5 xabar →      900 token → $0.0001
  20 xabar →   12,600 token → $0.0019
  50 xabar →   76,500 token → $0.0115
 100 xabar →  303,000 token → $0.0455
```

## 💥 **NARX KVADRATIK O'SADI** — `O(n²)`. 100 xabar 5 xabardan **336× qimmat**.

## ✅ **SHUNING UCHUN `window` XOTIRASI** *(oxirgi N ta xabar)* — **chiziqli** o'sish beradi.

</details>

**M6.** Qaysi hollarda agent o'rniga qat'iy zanjir yozish kerak?

<details>
<summary>✅ Javob</summary>

## **Oqim oldindan ma'lum bo'lgan HAMMA holatda.**

```
Agent kerak     →  "foydalanuvchi HAR XIL narsa so'rashi mumkin,
                    qaysi vosita kerakligi NOMA'LUM"

Zanjir yetadi   →  "har doim: hujjat topish → prompt → javob"
                    ⭐ arzonroq, tezroq, ISHONCHLIROQ
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Hujjat yuklovchini sinab ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_community.document_loaders import TextLoader

with open("test.txt", "w", encoding="utf-8") as f:
    f.write("Bu — sinov matni.\nIkkinchi qator.")

d = TextLoader("test.txt", encoding="utf-8").load()
print("hujjatlar soni:", len(d))
print("matn          :", repr(d[0].page_content))
print("metama'lumot  :", d[0].metadata)
```

## ⚠️ **`encoding="utf-8"` NI UNUTMANG** — Windowsda standart kodlash `cp1251`, o'zbekcha matn **buziladi**.

</details>

**M8.** ⭐⭐ Mahalliy model bilan ishlash rejasini tuzing.

<details>
<summary>✅ Javob</summary>

```bash
# 1) Ollama o'rnating: https://ollama.com
ollama pull llama3.2          # ~2 GB
ollama serve
```

```python
# 2) pip install langchain-ollama
from langchain_ollama import ChatOllama

model = ChatOllama(model="llama3.2", temperature=0)
print(model.invoke("Salom, o'zbekcha javob ber").content)
```

## ✅ **AFZALLIKLAR:** bepul · ma'lumot **chiqmaydi** · internet **kerak emas**.
## ⚠️ **KAMCHILIK:** o'zbekcha sifat `gpt-4o` dan **sezilarli past**. Kichik modellar o'zbekchani **yomon** biladi.

## 🔑 **AMALIY TAVSIYA:** `llama3.2` o'rniga **`qwen2.5`** ni sinab ko'ring — u ko'p tilli ma'lumotda **ko'proq** o'qitilgan.

</details>

---

## 🧠 O'zini tekshirish

<details>
<summary>❓ LangChain modelni "aqlliroq" qiladimi?</summary>

**Yo'q.** Aql — **modelda**. LangChain unga **to'g'ri kontekst** yetkazadi va javobni **formatlaydi**.
</details>

<details>
<summary>❓ Nima uchun paketlar bo'lingan?</summary>

`langchain` juda **katta** bo'lib ketdi va **har bir** provayder o'zgarganda butun paket **yangilanishi** kerak edi. Endi `langchain-openai` mustaqil **yangilanadi**.
</details>

<details>
<summary>❓ Agentlar ishonchlimi?</summary>

**Eng noishonchli qism.** Oqim ma'lum bo'lsa — **zanjir** yozing. Agentni faqat **haqiqatan kerak** bo'lganda, `max_iterations` **chegarasi** bilan ishlating.
</details>

---

## 📌 Xulosa

```
       LANGCHAIN = ADAPTER
              ↓
① MODEL      →  provayderni BITTA satr bilan almashtirish
② XOTIRA     →  "eslash" = butun tarixni QAYTA YUBORISH  (O(n²) narx!)
③ MA'LUMOT   →  har format → Document → vektor bazasi
④ VOSITALAR  →  ⚠️ eng NOISHONCHLI, chegara qo'ying
```

| Komponent | Ishonchlilik | Moduli |
|---|---|---|
| Model integratsiyasi | ## ✅ **95%** | 38 |
| Xotira | ## ✅ **95%** | 39 |
| Hujjat yuklash | ⚠️ 80% *(PDF!)* | 42 |
| RAG | ⚠️ 75% | 42 |
| Agentlar | ## ⚠️ **50%** | — |

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Integratsiya | Integration | Tashqi xizmat bilan **ulanish** |
| Hujjat yuklovchi | Document loader | Faylni `Document` ga **aylantiradi** |
| Metama'lumot | Metadata | Matn haqidagi **ma'lumot** *(manba, sahifa)* |
| Vosita | Tool | Model **chaqira oladigan** funksiya |
| Agent | Agent | Vositalarni **o'zi tanlaydigan** dastur |
| Kuzatuv | Observability | Tizim **ichida nima** bo'layotganini ko'rish |

---

⬅️ [2-dars. Biznes qo'llanmalari](02-Business-Applications.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Kurs nimalarni qamraydi](04-What-Does-the-Course-Cover.md)
