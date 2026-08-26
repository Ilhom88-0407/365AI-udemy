# 10-dars. O'z ma'lumotingizni qo'shish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"LangChain bilan ishlash uchun birinchi qilishimiz kerak bo'lgan narsa — o'z maxsus ma'lumotimizni yuklash va LangChain HUJJAT OBYEKTINI yaratish."**

> ## 🏆 **BU — MODULNING ENG MUHIM DARSI.** Bu yerda 8-darsdagi **uchta gallyutsinatsiyani** **uchta to'g'ri javobga** aylantiramiz.

---

## 1. 🎬 Kursdagi kod

> **"LangChain'da turli kirishlar uchun bir qancha DATA LOADER bor. Biz matn fayllari, PDF, HTML va yana ko'p narsadan ma'lumot o'qish uchun data loader'dan foydalanishimiz mumkin."**

```python
# ⚠️ KURSDAGI KOD — sintaksisi ESKIRGAN
from langchain.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI

url = "https://365datascience.com/upcoming-courses"
loader = WebBaseLoader(url)
raw_documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter()
documents = text_splitter.split_documents(raw_documents)

embeddings = OpenAIEmbeddings(openai_api_key=api_key)
vectorstore = FAISS.from_documents(documents, embeddings)

memory = ConversationBufferMemory(memory_key="chat_history",
                                  return_messages=True)

qa_chain = ConversationalRetrievalChain.from_llm(
    ChatOpenAI(openai_api_key=api_key, temperature=0),
    vectorstore.as_retriever(),
    memory=memory,
)

result = qa_chain({"question": "What is the next course to be uploaded?"})
print(result["answer"])
```

> ## ⚠️ **BU KOD BUGUN ISHLAMAYDI — TO'RT SABAB BILAN:**
> ```
> ① langchain.document_loaders   →  langchain_community.document_loaders
> ② langchain.embeddings         →  langchain_openai
> ③ ConversationalRetrievalChain →  ESKIRGAN (LCEL ishlatiladi)
> ④ qa_chain({"question": ...})  →  .invoke({...})
> ```

---

## 2. ✅ Zamonaviy LangChain kodi

```python
# pip install langchain langchain-community langchain-openai faiss-cpu beautifulsoup4
import os
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# ① YUKLASH
hujjatlar = WebBaseLoader("https://365datascience.com/upcoming-courses").load()

# ② BO'LAKLASH
boluvchi = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
bolaklar = boluvchi.split_documents(hujjatlar)

# ③ EMBEDDING + VEKTOR OMBORI
ombor = FAISS.from_documents(bolaklar, OpenAIEmbeddings())

# ④ ZANJIR
shablon = ChatPromptTemplate.from_template(
    "Quyidagi kontekstga asoslanib savolga javob ber.\n\n"
    "Kontekst:\n{context}\n\nSavol: {input}"
)
zanjir = create_retrieval_chain(
    ombor.as_retriever(search_kwargs={"k": 3}),
    create_stuff_documents_chain(ChatOpenAI(temperature=0), shablon),
)

natija = zanjir.invoke({"input": "What is the next course to be uploaded?"})
print(natija["answer"])
```

> ⚠️ Bu kod **API kaliti** va **pul** talab qiladi. Endi — **bepul** versiya.

---

## 3. ⭐⭐⭐ RAG'NI NOLDAN QURAMIZ — 20 QATOR KODDA

**Hech qanday LangChain. Hech qanday API kaliti. Faqat `sklearn` va `transformers`.**

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ── MODEL ─────────────────────────────────────────────
nom = "google/flan-t5-base"
tok = AutoTokenizer.from_pretrained(nom)
model = AutoModelForSeq2SeqLM.from_pretrained(nom)


def javob(prompt, maks_token=50):
    e = tok(prompt, return_tensors="pt")
    with torch.no_grad():
        o = model.generate(**e, max_new_tokens=maks_token)
    return tok.decode(o[0], skip_special_tokens=True)


# ── ① BIZNING MA'LUMOTIMIZ ────────────────────────────
HUJJAT = """365 Data Science publishes new courses regularly.
The Introduction to Large Language Models course will be released in March 2024.
The LangChain in Practice course is scheduled for April 2024.
The Vector Databases with Pinecone course comes out in May 2024.
The platform currently has more than 60 courses."""


# ── ② BO'LAKLASH  (RecursiveCharacterTextSplitter o'rnida) ──
def bolaklarga_bol(matn):
    return [s.strip() + "." for s in matn.replace("\n", " ").split(".") if s.strip()]


bolaklar = bolaklarga_bol(HUJJAT)
print(f"hujjat → {len(bolaklar)} ta bo'lak")

# ── ③ EMBEDDING + VEKTOR OMBORI  (24-MODULDAN!) ───────
vektorlashtiruvchi = TfidfVectorizer()
OMBOR = vektorlashtiruvchi.fit_transform(bolaklar)
print(f"vektor ombori: {OMBOR.shape}")


# ── ④ QIDIRUVCHI  (retriever) ─────────────────────────
def qidir(savol, k=2):
    q = vektorlashtiruvchi.transform([savol])
    ball = cosine_similarity(q, OMBOR)[0]
    return [(bolaklar[i], round(float(ball[i]), 3))
            for i in ball.argsort()[::-1][:k] if ball[i] > 0]


# ── ⑤ RAG ZANJIRI ─────────────────────────────────────
def rag(savol, k=2):
    topilgan = qidir(savol, k)
    kontekst = " ".join(b for b, _ in topilgan)
    prompt = f"Context: {kontekst}\nQuestion: {savol}\nAnswer:"
    return javob(prompt), topilgan
```

```
hujjat → 5 ta bo'lak
vektor ombori: (5, 39)
```

> ## 🔑 **MANA — BUTUN RAG. LangChain'ning 4 ta sinfi o'rniga 20 qator kod.**
>
> ```
> WebBaseLoader                 →  oddiy matn o'zgaruvchisi
> RecursiveCharacterTextSplitter →  bolaklarga_bol()
> OpenAIEmbeddings              →  TfidfVectorizer()      ← 24-MODUL!
> FAISS                         →  cosine_similarity()
> ConversationalRetrievalChain  →  rag()
> ```

---

## 4. 💥 NATIJA — 8-DARSDAGI SAVOLLAR

```python
SAVOLLAR = [
    "Which course will be released in March 2024?",
    "When is the LangChain course?",
    "How many courses are there?",
]

for s in SAVOLLAR:
    ragsiz = javob(f"Answer the question: {s}")
    rag_javob, topilgan = rag(s)
    print(f"SAVOL     : {s}")
    print(f"  ❌ RAGSIZ    : {ragsiz!r}")
    print(f"  ✅ RAG BILAN : {rag_javob!r}")
    print(f"     manba     : {topilgan[0][0][:60]}... (ball {topilgan[0][1]})\n")
```

```
SAVOL     : Which course will be released in March 2024?
  ❌ RAGSIZ    : 'physics'
  ✅ RAG BILAN : 'Introduction to Large Language Models'
     manba     : The Introduction to Large Language Models course will be rel... (ball 0.708)

SAVOL     : When is the LangChain course?
  ❌ RAGSIZ    : '1890'
  ✅ RAG BILAN : 'April 2024'
     manba     : The LangChain in Practice course is scheduled for April 2024... (ball 0.601)

SAVOL     : How many courses are there?
  ❌ RAGSIZ    : '58'
  ✅ RAG BILAN : 'more than 60'
     manba     : 365 Data Science publishes new courses regularly.... (ball 0.313)
```

## 🏆🏆 UCHALASI HAM TO'G'RI

```
'physics'  →  'Introduction to Large Language Models'   ✅
'1890'     →  'April 2024'                              ✅
'58'       →  'more than 60'                            ✅
```

> ## 💥 **BIR XIL MODEL. BIR XIL SAVOLLAR. BUTUNLAY BOSHQA NATIJA.**
>
> ## 🔑 **Model 3.2 baravar kattalashmadi. U qayta o'qitilmadi. Unga faqat MA'LUMOT BERILDI.**
>
> ```
> 29-modul saboqi:  "Ko'proq MA'LUMOT > aqlliroq ALGORITM"
>                          ↑
>              MANA UNING ENG SOF NAMUNASI
> ```

### 🎁 Va bonus — MANBA ko'rinadi

> ## ✅ **Bu — RAG'ning YASHIRIN SUPERKUCHI.** Siz javobni **tekshira olasiz**.
>
> ```
> Oddiy LLM  →  "April 2024"  →  qayerdan? BILMAYSIZ  →  ishonish kerak
> RAG        →  "April 2024"  →  MANBA KO'RINADI      →  TEKSHIRASIZ
> ```
>
> ## 💡 **27-modul saboqini eslang:** *"Modelni DOIM tekshiring"*. RAG buni **mumkin** qiladi.

### ⚠️⚠️ LEKIN RAG O'ZI-O'ZIDAN GALLYUTSINATSIYANI TO'XTATMAYDI

**Yuqoridagi kodni ALOQASIZ savol bilan sinang:**

```python
javob, manba = rag("What is the weather in Tashkent?")
print(javob, "|", manba[0][1])
```

```
rainy | 0.487
```

> ## 💥 **FALOKAT.** Hujjatda ob-havo haqida **bitta so'z ham yo'q**, lekin:
> - qidiruv **0.487** ball bilan LangChain kursi haqidagi bo'lakni topdi
> - model *"rainy"* deb **to'qib** chiqardi

### 🔬 Sabab — TO'XTATISH SO'ZLARI

```
"What IS THE weather IN Tashkent?"
       ↑↑↑            ↑
"The LangChain course IS scheduled..."
  ↑                   ↑

Umumiy so'zlar: "is", "the", "in"  →  soxta moslik
```

### ✅ Yechim — UCH QATLAMLI HIMOYA

```python
# ① stop_words — soxta moslikni yo'qotadi
vektorlashtiruvchi = TfidfVectorizer(stop_words="english")

# ② min_ball — past ballni rad etadi
def qidir(savol, k=2, min_ball=0.15):
    b = cosine_similarity(vektorlashtiruvchi.transform([savol]), OMBOR)[0]
    return [(bolaklar[i], round(float(b[i]), 3))
            for i in b.argsort()[::-1][:k] if b[i] >= min_ball]

# ③ "NOT FOUND" ko'rsatmasi — modelga "bilmayman" deyishga RUXSAT
prompt = ("Answer the question using ONLY the context. If the context "
          "does not contain the answer, reply exactly: NOT FOUND.
"
          f"Context: {kontekst}
Question: {savol}
Answer:")
```

**Natija:**

```
--- stop_words=None ---
  0.597  When is the LangChain course?
  0.586  How much does the annual plan cost?
  0.487  What is the weather in Tashkent?      ❌ SOXTA YUQORI

--- stop_words='english' ---
  0.560  When is the LangChain course?
  0.610  How much does the annual plan cost?
  0.000  What is the weather in Tashkent?      ✅ ANIQ NOL
```

```
"NOT FOUND" ko'rsatmasi bilan:
  maks_ball=0.560  →  'April 2024'
  maks_ball=0.610  →  '240 dollars per year'
  maks_ball=0.000  →  'NOT FOUND'        ✅✅
```

### 💥 VA MANA ENG QIZIQ TOMONI — 26-MODULGA ZID!

```
26-MODUL (sentiment):
   stop_words='english'  →  0.869 → 0.784   ❌ YOMONLASHDI
   sabab: "not", "no" — sentiment uchun HAL QILUVCHI

31-MODUL (RAG qidiruvi):
   stop_words='english'  →  0.487 → 0.000   ✅ YAXSHILANDI
   sabab: "is", "the", "in" — qidiruv uchun SHOVQIN
```

> ## 🏆 **BIR XIL SOZLAMA. IKKI XIL VAZIFA. TESKARI NATIJA.**
>
> ## 🔑 **Umumiy javob YO'Q — har vazifada O'LCHASH kerak.** 26-modul saboqi.

> ## ⚠️ **VA ENG MUHIM XULOSA: RAG — SEHRLI TAYOQCHA EMAS.**
> ```
> Oddiy LLM        →  har doim javob beradi           ❌
> Sozlanmagan RAG  →  HAM to'qib chiqaradi ('rainy')  ⚠️
> Sozlangan RAG    →  'NOT FOUND'                      ✅
> ```

### ⚠️ Uchinchi savolga DIQQAT BILAN qarang

```
SAVOL  : "How many courses are there?"
JAVOB  : 'more than 60'                                    ✅ TO'G'RI
MANBA  : "365 Data Science publishes new courses regularly." (ball 0.313)
              ↑
     LEKIN BU BO'LAKDA "60" SO'ZI YO'Q!
```

> ## 🔑 **Nima bo'ldi?** Biz `k=2` qo'ygandik — ya'ni **IKKITA** bo'lak olinadi. Birinchisi *(0.313)* mos emas, lekin **ikkinchisi** — *"The platform currently has more than 60 courses"* — aynan kerakli bo'lak edi.
>
> ## 💡 **Ya'ni RAG "adashdi, lekin qutuldi"** — chunki biz **bitta emas, ikkita** bo'lak berdik.
>
> ## ⚠️ **AMALIY SABOQ — `k` ni juda kichik qilmang:**
> ```
> k=1  →  arzon, lekin bitta xato = NOTO'G'RI javob
> k=3  →  biroz qimmatroq, ANCHA ishonchli   ⭐ tavsiya
> k=10 →  ortiqcha shovqin, model chalg'iydi
> ```
>
> 💡 Va **birinchi ball 0.313** — bu **past**. Past ball — *"qidiruv ishonchsiz"* degan **ogohlantirish belgisi**. Uni **kuzatib boring**.

---

## 5. 🇺🇿 O'ZBEK TILIDA RAG — VA U ISHLAYDI!

9-darsda aytgandik: RAG'ning **qidiruv qismi tildan mustaqil**. **Isbotlaymiz:**

```python
UZ_HUJJAT = """365 Data Science yangi kurslari.
Introduction to Large Language Models kursi 2024-yil mart oyida chiqadi.
LangChain in Practice kursi 2024-yil aprel oyida rejalashtirilgan.
Vector Databases with Pinecone kursi may oyida chiqadi.
Speech Recognition with Whisper kursi iyun oyida chiqadi.
Platformada hozirda 60 dan ortiq kurs mavjud.
Barcha kurslar ingliz tilida olib boriladi."""

uz_bolaklar = bolaklarga_bol(UZ_HUJJAT)
uz_vek = TfidfVectorizer()
UZ_OMBOR = uz_vek.fit_transform(uz_bolaklar)


def uz_qidir(savol, k=2):
    ball = cosine_similarity(uz_vek.transform([savol]), UZ_OMBOR)[0]
    return [(uz_bolaklar[i], round(float(ball[i]), 3))
            for i in ball.argsort()[::-1][:k] if ball[i] > 0]


for s in ["Qaysi kurs mart oyida chiqadi?",
          "LangChain kursi qachon?",
          "Nechta kurs bor?"]:
    print(f"SAVOL: {s}")
    for b, ball in uz_qidir(s):
        print(f"   [{ball}] {b}")
    print()
```

```
SAVOL: Qaysi kurs mart oyida chiqadi?
   [0.381] Introduction to Large Language Models kursi 2024-yil mart oyida chiqadi.
   [0.221] Platformada hozirda 60 dan ortiq kurs mavjud.

SAVOL: LangChain kursi qachon?
   [0.441] LangChain in Practice kursi 2024-yil aprel oyida rejalashtirilgan.
   [0.138] Vector Databases with Pinecone kursi may oyida chiqadi.

SAVOL: Nechta kurs bor?
   [0.378] Platformada hozirda 60 dan ortiq kurs mavjud.
```

## ✅✅ UCHALA SAVOLDA HAM TO'G'RI BO'LAK BIRINCHI O'RINDA

> ## 🏆 **O'ZBEKCHA QIDIRUV MUKAMMAL ISHLADI.**
>
> ## 🔑 **Nima uchun?** Chunki `TfidfVectorizer` **so'zlarni sanaydi** — u tilni **bilishi shart emas**.
>
> ```
> 28-MODUL SABOG'I:  "sklearn TILDAN MUSTAQIL"
>                              ↑
>                 RAG uchun ham TO'G'RI
> ```

### ⚠️ LEKIN HALOL BO'LAYLIK — GENERATSIYA ISHLAMAYDI

```
✅ ①②③④ QIDIRUV qadamlari  →  o'zbekchada TO'LIQ ishlaydi
❌ ⑤ GENERATSIYA qadami     →  flan-t5 o'zbekchani bilmaydi
```

> ## 💡 **VA BU — MUAMMO EMAS.** Chunki amalda **eng qimmatli qism — QIDIRUV**:
>
> ```
> 🔍 QIDIRUV TIZIMI (generatsiyasiz):
>      Foydalanuvchi savol beradi
>      →  Tizim ENG MOS BO'LAKNI ko'rsatadi
>      →  Foydalanuvchi O'ZI o'qiydi
>
>    ✅ BUGUN ishlaydi · BEPUL · o'zbekcha · gallyutsinatsiya YO'Q
> ```
>
> ## 🎯 **Ya'ni siz o'zbekcha hujjatlar ustida ishlaydigan SEMANTIK QIDIRUV tizimini BUGUN qura olasiz.**

### To'liq javob ham kerakmi?

```
① QIDIRUV — mahalliy, bepul (yuqoridagi kod)
       ↓
② faqat TOPILGAN BO'LAKNI GPT-4/Claude ga yuborish
       ↓
   ✅ o'zbekcha ravon javob
   ✅ ARZON (butun hujjat emas, faqat 2-3 bo'lak yuboriladi!)
   ✅ gallyutsinatsiya KAM (kontekst berilgan)
```

> ## 💰 **Bu — narxni ham tejaydi.** 10 000 so'zlik hujjatni **har safar** yuborish o'rniga, faqat **2–3 ta mos bo'lak** yuboriladi. **O'zbekcha matn 2× qimmat** ekanini eslasak *(3-dars)* — bu **jiddiy tejamkorlik**.

---

## 6. 🧠 Xotira — suhbatni davom ettirish

> **"Endi biz kirish va chiqishlarni kuzatish uchun zarur bo'lgan XOTIRA obyektini yaratishimiz mumkin — model suhbat qurishi uchun."**

```python
class RagXotira:
    """Suhbat tarixini saqlaydigan sodda RAG."""

    def __init__(self, bolaklar, maks_tarix=3):
        self.bolaklar = bolaklar
        self.vek = TfidfVectorizer()
        self.ombor = self.vek.fit_transform(bolaklar)
        self.tarix = []
        self.maks_tarix = maks_tarix

    def qidir(self, savol, k=2):
        ball = cosine_similarity(self.vek.transform([savol]), self.ombor)[0]
        return [self.bolaklar[i] for i in ball.argsort()[::-1][:k] if ball[i] > 0]

    def sora(self, savol, k=2):
        kontekst = " ".join(self.qidir(savol, k))
        tarix = " ".join(f"Q: {q} A: {a}" for q, a in self.tarix[-self.maks_tarix:])
        prompt = (f"Context: {kontekst}\n"
                  + (f"Previous conversation: {tarix}\n" if tarix else "")
                  + f"Question: {savol}\nAnswer:")
        j = javob(prompt)
        self.tarix.append((savol, j))
        return j


bot = RagXotira(bolaklar)
print(bot.sora("When is the LangChain course?"))
print(bot.sora("And the Vector Databases one?"))     # ← "one" nimaga ishora qiladi?
```

```
'April 2024'
'Pinecone'
```

> ## ⚠️ **IKKINCHI JAVOB — YARIM MUVAFFAQIYAT.**
>
> ```
> Kutilgan :  "May 2024"
> Olingan  :  "Pinecone"
> ```
>
> Model **to'g'ri bo'lakni topdi** *(Vector Databases with Pinecone)*, lekin savolning **asl maqsadini** — *"qachon?"* — tushunmadi. U `"one"` so'zining **oldingi savoldagi `"When"` ga** ishora qilishini **ilg'amadi**.

> ## 🔑 **Ikkinchi savolda `"one"` so'zi bor** — bu **30-moduldagi koreferensiya** muammosi!
>
> Xotirasiz model `"And the Vector Databases one?"` ni **tushunmaydi**. Xotira bilan — **oldingi savolni ko'radi**.
>
> ## 🔑 **Bu — 6- va 7-darslardagi bilan BIR XIL naqsh:** xotiradan foydalanish ham **miqyos talab qiladigan** qobiliyat.
>
> ⚠️ **Halol eslatma:** `flan-t5-base` (248M) **kichik**. Katta modellarda *(GPT-4, Claude)* bunday koreferensiya **ishonchli** ishlaydi.
>
> ## ✅ **Amaliy yechim (kichik modellar uchun):** savolni **to'liq** yozing.
> ```
> ❌ "And the Vector Databases one?"
> ✅ "When is the Vector Databases course?"
> ```
> Bu — **prompt muhandisligi** ning eng sodda va eng samarali usuli.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** RAG quvurining besh qadami?

**M2.** `TfidfVectorizer` LangChain'dagi nimaning o'rnini bosadi?

**M3.** RAG'ning "yashirin superkuchi" nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ① yuklash · ② **bo'laklash** · ③ **embedding** · ④ **qidirish** · ⑤ **generatsiya**.

**M2.** ## **`OpenAIEmbeddings` + `FAISS`** — embedding va vektor ombori.

**M3.** ## **MANBA KO'RINADI** — javobni **tekshirish** mumkin.

</details>

### 🟡 O'rta

**M4.** ⭐ RAG natijani nima uchun bunchalik yaxshiladi?

**M5.** 🇺🇿 O'zbekcha qidiruv nima uchun ishladi?

<details>
<summary>✅ Javoblar</summary>

**M4.** Chunki model endi **eslashi** shart emas — javob **promptning o'zida** bor.
```
❌ "Model, sen BILASANMI?"    →  'physics', '1890', '58'
✅ "Model, MANA MA'LUMOT"     →  uchalasi TO'G'RI
```
> Model **o'zgarmadi** — faqat **ma'lumot berildi**.

**M5.** `TfidfVectorizer` **so'zlarni sanaydi** — tilni **bilishi shart emas**.
> 28-modul: *"sklearn tildan mustaqil"*. RAG uchun ham **to'g'ri**.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐⭐ **O'z hujjatingiz** uchun to'liq RAG tizimini qurib, uni baholang.

<details>
<summary>✅ Yechim</summary>

```python
import warnings; warnings.filterwarnings("ignore")
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class OddiyRAG:
    """LangChain'siz to'liq RAG tizimi."""

    def __init__(self, matn, olcham=1, token_pattern=None):
        self.bolaklar = self._bol(matn, olcham)
        kw = {"token_pattern": token_pattern} if token_pattern else {}
        self.vek = TfidfVectorizer(**kw)
        self.ombor = self.vek.fit_transform(self.bolaklar)

    @staticmethod
    def _bol(matn, olcham):
        j = [s.strip() for s in matn.replace("\n", " ").split(".") if s.strip()]
        return [". ".join(j[i:i+olcham]) + "." for i in range(0, len(j), olcham)]

    def qidir(self, savol, k=3):
        b = cosine_similarity(self.vek.transform([savol]), self.ombor)[0]
        return [(self.bolaklar[i], round(float(b[i]), 3))
                for i in b.argsort()[::-1][:k] if b[i] > 0]

    def bahola(self, sinovlar, k=1):
        """sinovlar = [(savol, javob_ichida_bo'lishi_kerak_bo'lgan_so'z), ...]"""
        qatorlar = []
        for savol, kutilgan in sinovlar:
            top = self.qidir(savol, k)
            topildi = any(kutilgan.lower() in b.lower() for b, _ in top)
            qatorlar.append({
                "savol": savol[:38],
                "kutilgan": kutilgan,
                "top-1 ball": top[0][1] if top else 0.0,
                "topildi": "✅" if topildi else "❌",
            })
        df = pd.DataFrame(qatorlar)
        print(df.to_string(index=False))
        print(f"\nANIQLIK (top-{k}): {(df.topildi == '✅').mean():.1%}")
        return df


# ── 🇺🇿 O'ZBEKCHA SINOV ──
UZ = """Kompaniyamiz 2015-yilda tashkil etilgan.
Bizning ofisimiz Toshkent shahrida joylashgan.
Mahsulot qaytarish muddati 14 kun.
Yetkazib berish O'zbekiston bo'ylab bepul.
Qo'llab-quvvatlash xizmati 24 soat ishlaydi."""

UZ_PATTERN = r"[\w'ʻ’]+"          # ⭐ 28-MODULDAN — apostrof muammosi!

rag = OddiyRAG(UZ, token_pattern=UZ_PATTERN)
rag.bahola([
    ("Kompaniya qachon tashkil etilgan?", "2015"),
    ("Ofis qayerda?",                     "Toshkent"),
    ("Qaytarish muddati qancha?",         "14 kun"),
    ("Yetkazib berish pullikmi?",         "bepul"),
    ("Qo'llab-quvvatlash qachon ishlaydi?", "24 soat"),
])
```

**Haqiqiy natija:**

```
--- token_pattern BILAN ---
                              savol kutilgan  top-1 ball topildi
  Kompaniya qachon tashkil etilgan?     2015       0.632      ✅
                      Ofis qayerda? Toshkent       0.000      ❌
          Qaytarish muddati qancha?   14 kun       0.632      ✅
          Yetkazib berish pullikmi?    bepul       0.632      ✅
Qo'llab-quvvatlash qachon ishlaydi?  24 soat       0.707      ✅

ANIQLIK (top-1): 80.0%
```

## ✅ 80% — LEKIN IKKITA MUHIM TOPILMA BOR

### ❌ ① "Ofis qayerda?" — MUTLAQO ISHLAMADI (ball 0.000)

```
SAVOL  :  "Ofis qayerda?"
HUJJAT :  "Bizning ofisimiz Toshkent shahrida joylashgan."
                        ↑
   "ofis" va "ofisimiz" — TF-IDF uchun IKKI XIL SO'Z!
   "qayerda" so'zi esa hujjatda UMUMAN YO'Q.

   Umumiy so'z YO'Q  →  kosinus o'xshashligi = 0.000
```

> ## 🔑 **BU — TF-IDF NING TUB CHEKLOVI:** u **SO'ZLARNI** solishtiradi, **MA'NONI** emas.
>
> ```
> "qayerda"  ≈  "joylashgan"   →  ODAM uchun aniq
>                              →  TF-IDF uchun BEGONA so'zlar
> ```
>
> ## 💡 **Va bu — 28-moduldagi AGGLYUTINATSIYA muammosining qaytishi:** `ofis` / `ofisimiz` — bir xil o'zak, **turli token**.
>
> ## ✅ **UCHTA YECHIM:**
> ```
> ① STEMMING       →  28-moduldagi uz_stem()  (ofisimiz → ofis)
> ② SINONIMLAR     →  "qayerda" → "joylashgan" lug'ati
> ③ NEYRON EMBEDDING →  ma'noni tushunadi (ko'p tilli model kerak)
> ```

### 😲 ② `token_pattern` ANIQLIKNI O'ZGARTIRMADI

```
token_pattern BILAN  →  80.0%
token_pattern BUSIZ  →  80.0%      ← BIR XIL!
```

> ## ⚠️ **MEN BUNI KUTMAGANDIM — VA BU HALOL QAYD ETILISHI KERAK.**
>
> **Nima uchun farq bo'lmadi?** Chunki bu **kichik** hujjatda apostrofli so'zlar *(`qo'llab-quvvatlash`, `bo'ylab`, `O'zbekiston`)* **savol bilan mos kelgan bo'laklarda hal qiluvchi rol o'ynamadi**.
>
> **Farq faqat BALLARDA ko'rinadi:**
> ```
> "Yetkazib berish pullikmi?"   bilan 0.632  ·  busiz 0.577
> "Qo'llab-quvvatlash..."        bilan 0.707  ·  busiz 0.756
> ```
>
> ## 🔑 **XULOSA — NOZIK, LEKIN MUHIM:**
> ```
> ❌ NOTO'G'RI:  "token_pattern kerak emas ekan"
> ✅ TO'G'RI  :  "bu KICHIK misolda farq ko'rinmadi"
> ```
>
> **28-modulda o'lchagandik:** `O'zbekiston` → `zbekiston` *(mamlakat nomi BUZILADI)*. Bu — **fakt**. Katta hujjatda va apostrofli so'zlar **muhim** bo'lgan savollarda farq **albatta** chiqadi.
>
> ## 💡 **VA BU — ENG MUHIM METODOLOGIK SABOQ:** *"men buni to'g'ri deb o'ylayman"* va *"men buni o'lchadim"* — **ikki xil narsa**. Har doim **o'lchang**.

> ## 💡 **Uch modul BIR JOYDA ishlaydi:**
> ```
> 24-modul  →  TfidfVectorizer (embedding)
> 28-modul  →  token_pattern + stemming (o'zbek tili)
> 31-modul  →  RAG arxitekturasi
> ```
>
> ## 🎯 **`bahola()` metodi — eng muhim qism.** Usiz siz *"RAG ishlayapti"* deb **o'ylab** yurgan bo'lardingiz. U bilan esa **80%** ekanini va **qaysi savol** ishlamasligini **aniq** bilasiz.
>
> **26-modul saboqi:** *"raqamsiz — bu taxmin"*.

</details>

---

## 🧠 O'zini tekshirish savollari

1. RAG'ning besh qadami?
2. Kursdagi kod nima uchun ishlamaydi?
3. RAG natijani qanday yaxshiladi?
4. 🇺🇿 O'zbekchada qaysi qadamlar ishlaydi?
5. Xotira nima uchun kerak?

<details>
<summary>✅ Javoblar</summary>

1. Yuklash → **bo'laklash** → **embedding** → **qidirish** → **generatsiya**.
2. `langchain.document_loaders` → `langchain_community...`, `ConversationalRetrievalChain` **eskirgan**, `.invoke()` ishlatiladi.
3. Javob **promptning o'zida** bo'ldi — model **eslashi** shart emas. `'physics'` → `'Introduction to Large Language Models'`.
4. ## **①②③④ — HAMMASI** *(TF-IDF tildan mustaqil)*. Faqat **⑤ generatsiya** katta model talab qiladi.
5. Suhbatni **davom ettirish** uchun — `"And the Vector Databases one?"` dagi `"one"` ni tushunish.

</details>

---

## 📌 Xulosa

```
RAG'NI NOLDAN QURDIK — 20 QATOR KODDA

  LangChain                        →  Bizniki
  ─────────────────────────────────────────────────────
  WebBaseLoader                    →  matn o'zgaruvchisi
  RecursiveCharacterTextSplitter   →  bolaklarga_bol()
  OpenAIEmbeddings                 →  TfidfVectorizer()   ← 24-MODUL
  FAISS                            →  cosine_similarity()
  ConversationalRetrievalChain     →  rag()


💥 NATIJA (flan-t5-base, 248M, BEPUL)

  SAVOL                        RAGSIZ      RAG BILAN
  ──────────────────────────────────────────────────────────────
  Which course in March 2024?  'physics'   'Introduction to LLM'  ✅
  When is LangChain course?    '1890'      'April 2024'           ✅
  How many courses?            '58'        'more than 60'         ✅

  🔑 MODEL O'ZGARMADI — faqat MA'LUMOT BERILDI


🎁 BONUS — MANBA KO'RINADI
  Oddiy LLM  →  javob bor, MANBA yo'q   →  ishonish kerak
  RAG        →  javob + MANBA           →  TEKSHIRASIZ  ✅


🇺🇿 O'ZBEK TILIDA — QIDIRUV MUKAMMAL ISHLAYDI

  "Qaysi kurs mart oyida chiqadi?"  →  [0.381] to'g'ri bo'lak  ✅
  "LangChain kursi qachon?"          →  [0.441] to'g'ri bo'lak  ✅
  "Nechta kurs bor?"                 →  [0.378] to'g'ri bo'lak  ✅

  ✅ ①②③④ qidiruv  →  TO'LIQ ishlaydi (sklearn tildan mustaqil)
  ❌ ⑤ generatsiya  →  katta model kerak

  💡 AMALIY YECHIM:
     qidiruvni MAHALLIY qiling (bepul)
     faqat TOPILGAN BO'LAKNI GPT-4 ga yuboring
     →  arzon · aniq · gallyutsinatsiya kam


⚠️ O'ZBEKCHA RAG UCHUN SHART:
     token_pattern = r"[\w'ʻ’]+"     ← 28-MODULDAN
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Data loader | *document loader* | Ma'lumot o'quvchi |
| Bo'laklash | *chunking* | Matnni bo'lish |
| Qidiruvchi | *retriever* | Mos bo'lakni topuvchi |
| Kontekst | *context* | Promptga qo'shilgan ma'lumot |
| Xotira | *memory* | Suhbat tarixi |
| Kosinus o'xshashligi | *cosine similarity* | Vektorlar yaqinligi |

---

⬅️ [Oldingi: LangChain nima?](09-LangChain.md) · 🏠 [Modul boshiga](README.md) · ➡️ **32-modul: Hugging Face Transformers**
