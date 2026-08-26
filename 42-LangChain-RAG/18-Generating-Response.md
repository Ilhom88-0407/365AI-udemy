# 18-dars. Javob generatsiyasi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"`chain = {'context': retriever, 'question': RunnablePassthrough()} | prompt | chat | StrOutputParser()`"**

---

## 1. To'liq RAG zanjiri — API kalitisiz

Bizda `OPENAI_API_KEY` **yo'q**, shuning uchun **mahalliy model** bilan ishga tushirdik:

```python
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from langchain_core.output_parsers import StrOutputParser

M = "Qwen/Qwen2.5-0.5B-Instruct"
tok = AutoTokenizer.from_pretrained(M)
mdl = AutoModelForCausalLM.from_pretrained(M)
gen = pipeline("text-generation", model=mdl, tokenizer=tok,
               max_new_tokens=120, do_sample=False, return_full_text=False)
llm = HuggingFacePipeline(pipeline=gen)

zanjir = ({"context": retriever | RunnableLambda(format_docs),
           "question": RunnablePassthrough()}
          | pt | llm | StrOutputParser())

print(zanjir.invoke("What software do data scientists use?"))
```

```
model yuklandi: 1.9s
generatsiya  : 4.5s
```

```
JAVOB: Based on the information provided, what type of software do data
scientists typically use? The software that data scientists typically use is
primarily based on programming languages such as Python, R, SQL, and MATLAB.
These languages provide the necessary tools and libraries to perform data
manipulation, analysis, and visualization tasks commonly required in data
science projects.
You are an AI assistant. Provide a detailed answer so user don't need to
search outside to understand the answer.
```

> ## ✅ **ZANJIR TO'LIQ ISHLADI** — hujjatdan → embeddingdan → bazadan → promptdan → modelga → matnga.
>
> ## ⚠️⚠️ **LEKIN JAVOBDA UCHTA MUAMMO BOR — VA ULAR MUHIM:**
> ```
> ① Savolni QAYTA AYTDI ("Based on the information provided, what type...")
> ② Oxirida O'QITISH MA'LUMOTI SIZIB CHIQDI
>    ("You are an AI assistant. Provide a detailed answer...")
> ③ "MATLAB" — kontekstda BOR, lekin javob deyarli KONTEKSTSIZ ham chiqardi
> ```
>
> ## 🔑 **BU — 0.5 MILLIARD PARAMETRLI MODELNING CHEGARASI.** GPT-4o'da bu **bo'lmaydi**.

---

## 2. 💥💥 ENG MUHIM SINOV — javobi YO'Q savol

```python
zanjir.invoke("What is the weather in Tashkent today?")
```

```
JAVOB: Based on the information provided, what type of analytics does the text
suggest should be used to determine the weather in Tashkent today? The text
suggests that the most appropriate type of analytics to determine the weather
in Tashkent today would be "qualitative analytics." Qualitative analytics
involves understanding human experiences and preferences rather than
numerical data...
```

> ## 💥💥💥 **MODEL YOLG'ON TO'QIDI.**
>
> ## 🔑 **NIMA BO'LDI?**
> ```
> ① Savol: "Toshkentda ob-havo qanday?"
> ② Retriever: hujjatlarda javob YO'Q → lekin ENG YAQIN 3 ta bo'lakni QAYTARDI
>    (data science analitikasi haqida)
> ③ Prompt: "use only the following context" — MAVJUD
> ④ Model: kontekstni ob-havo savoliga MOSLASHTIRIB, "qualitative analytics"
>    javobini TO'QIDI
> ```
>
> ## 💥 **"USE ONLY THE FOLLOWING CONTEXT" YETARLI EMAS.** Model baribir **javob berishga harakat qiladi**.

> ## 🏆🏆 **BU — 31-MODULDAGI `0.487` MUAMMOSINING AYNAN TAKRORI.**
> ```
> 31-modul: savol "weather in Tashkent" → ball 0.487 → model "rainy" deb to'qidi
> 42-modul: savol "weather in Tashkent" → 3 bo'lak → model "qualitative analytics"
> ```
> ## 🔑 **IKKALASIDA HAM — RETRIEVER BO'SH QAYTARMADI, MODEL TO'QIDI.**

### ✅ Ikki qavatli himoya

```python
def himoyalangan_rag(vs, llm, pt, savol, min_ball=0.3, k=3):
    """① BALL chegarasi  ②  PROMPT ko'rsatmasi."""
    n = vs.similarity_search_with_relevance_scores(savol, k=k)
    yaxshi = [(d, s) for d, s in n if s >= min_ball]

    # ── ① BIRINCHI QAVAT: ball chegarasi ──
    if not yaxshi:
        eng = max((s for _, s in n), default=0.0)
        return {"javob": "Bu savolga hujjatlarimda javob topilmadi.",
                "manba": [], "eng_yaxshi_ball": round(eng, 4),
                "himoya": "chegara"}

    kontekst = "\n\n".join(d.page_content for d, _ in yaxshi)
    zanjir = pt | llm | StrOutputParser()
    javob = zanjir.invoke({"context": kontekst, "question": savol})
    return {"javob": javob.strip(), "manba": [d.metadata for d, _ in yaxshi],
            "eng_yaxshi_ball": round(yaxshi[0][1], 4), "himoya": "yo'q"}
```

```python
# ── ② IKKINCHI QAVAT: qattiq prompt ──
QATTIQ = """Use ONLY the context below to answer.

RULES:
- If the context does not contain the answer, reply EXACTLY:
  "I don't know based on the provided documents."
- Do NOT use any outside knowledge.
- Cite the source number in brackets, e.g. [1].

Context:
{context}

Question: {question}
Answer:"""
```

> ## 🏆 **IKKALASINI HAM QO'YING:**
> ```
> ① BALL CHEGARASI  →  ishonchli, LEKIN chegarani sozlash kerak
> ② QATTIQ PROMPT   →  arzon, LEKIN kichik modellar E'TIBORSIZ QOLDIRADI
> ```
> ## 💥 **BIRINCHISI — ASOSIY HIMOYA.** Chunki u **modelga bog'liq emas**.

---

## 3. ⭐⭐ RAG bilan va RAGsiz — solishtirdik

```python
# RAGsiz
pt2 = PromptTemplate.from_template("Answer the following question:\n{question}\n")
(pt2 | llm | StrOutputParser()).invoke({"question": Q})
```

```
3.4s
JAVOB: Data scientists typically use a variety of software tools and platforms
to analyze, process, and visualize large amounts of complex data. Some common
software used by data scientists includes:
1. Python: A high-level programming language...
2. R: A statistical computing language...
```

> ## ⚠️⚠️ **HALOL XULOSA: BU SAVOLDA RAGSIZ JAVOB YAXSHIROQ CHIQDI** — tuzilgan, ro'yxatli, aniq.
>
> ## 🔑 **NIMA UCHUN? CHUNKI SAVOL — UMUMIY BILIM.** "Data scientistlar qanday dasturiy ta'minot ishlatadi?" — bu model **o'qitishda ko'rgan** savol.
>
> ## 🏆🏆 **VA BU — RAG HAQIDAGI ENG MUHIM DARS:**
> ```
> ❌ RAG umumiy bilim savollarini YAXSHILAMAYDI
> ✅ RAG model BILMAYDIGAN ma'lumot uchun kerak:
>       · sizning ichki hujjatlaringiz
>       · o'qitishdan KEYINGI voqealar
>       · shaxsiy / korporativ ma'lumot
>       · 🇺🇿 o'zbekcha mahalliy ma'lumot (qonun, ta'rif, narx)
> ```
>
> ## 💥 **AGAR RAG NATIJASI RAGSIZDAN YOMONROQ BO'LSA** — savol **noto'g'ri tanlangan** yoki **retriever noto'g'ri bo'lak topgan**. Ikkalasi ham **o'lchab tekshiriladi**.

---

## 4. ⭐ Manbani qaytarish — `RunnablePassthrough.assign`

Kursning zanjiri **faqat matn** qaytaradi. Manba **yo'qoladi**.

```python
from langchain_core.runnables import RunnablePassthrough, RunnableParallel

zanjir_manbali = (
    RunnableParallel(context=retriever, question=RunnablePassthrough())
    .assign(javob=(lambda x: {"context": format_docs(x["context"]),
                              "question": x["question"]})
                  | pt | llm | StrOutputParser())
)

r = zanjir_manbali.invoke(Q)
print("JAVOB :", r["javob"][:200])
print("MANBA :", [d.metadata.get("Lecture Title", "?")[:40] for d in r["context"]])
```

> ## 🔑 **`.assign` — 41-MODUL, 5-DARS.** U kirishni **saqlab qoladi** va **yangi kalit qo'shadi**.
>
> ## 🏆 **MANBASIZ RAG — ISHLAB CHIQARISHGA YAROQSIZ.** Foydalanuvchi javobni **tekshira olmaydi**, siz esa **xatoni topolmaysiz**.

---

## 5. ⭐ Streaming — foydalanuvchi kutmaydi

```python
for bolak in zanjir.stream(Q):
    print(bolak, end="", flush=True)
```

> ## ⚡ **41-MODUL, 3-DARS.** Javob **4.5 soniya** yozilsa ham, foydalanuvchi **birinchi so'zni 0.5 soniyada** ko'radi.
>
> ## ⚠️ **LEKIN RETRIEVER OQIMLI EMAS** — u **to'liq bajariladi**, keyin oqim boshlanadi. Ya'ni **birinchi token ~qidiruv vaqti + model vaqti**.

---

## 6. ⚠️ Kursning `chat` sozlamalari

```python
chat = ChatOpenAI(model="gpt-4o-mini", temperature=0, seed=365)
```

> ## ✅ **`temperature=0` — RAG UCHUN TO'G'RI TANLOV.** Javob **kontekstdan** kelishi kerak, **ijoddan** emas *(38-modul)*.
>
> ## ⚠️ **`seed=365` — TAKRORLANUVCHANLIKKA YORDAM BERADI, LEKIN KAFOLAT EMAS** *(38-modulda o'lchaganmiz)*.

---

## 7. 🇺🇿 O'zbekcha RAG — to'liq misol

```python
UZ_HUJJATLAR = [
    Document(page_content="Muddatli depozit yillik 18% dan 22% gacha foiz "
                          "keltiradi. Minimal summa 1 000 000 so'm. "
                          "Muddat 6 oydan 36 oygacha.",
             metadata={"bolim": "depozit", "til": "uz"}),
    Document(page_content="Debet karta 3 ish kunida tayyorlanadi. Yillik "
                          "xizmat haqi 50 000 so'm. Bepul yetkazib berish bor.",
             metadata={"bolim": "karta", "til": "uz"}),
    Document(page_content="Iste'mol krediti 24 oygacha beriladi. Yillik "
                          "stavka 24% dan boshlanadi. Daromad spravkasi shart.",
             metadata={"bolim": "kredit", "til": "uz"}),
]

uz_vs = Chroma.from_documents(UZ_HUJJATLAR, embedding,
                              collection_metadata={"hnsw:space": "cosine"})

UZ_PROMPT = PromptTemplate.from_template(
    "Quyidagi kontekstdan FOYDALANIB javob bering.\n"
    "Agar kontekstda javob bo'lmasa, AYNAN shunday yozing: "
    "\"Hujjatlarimda bu savolga javob yo'q.\"\n\n"
    "Kontekst:\n{context}\n\nSavol: {question}\nJavob:")

for savol in ["Depozit foizi qancha?",
              "Karta necha kunda tayyor bo'ladi?",
              "Toshkentda ob-havo qanday?"]:      # ← javobi YO'Q
    n = uz_vs.similarity_search_with_relevance_scores(savol, k=2)
    eng = n[0][1] if n else 0
    if eng < 0.3:
        print(f"🛡️ {savol:36s} → RAD ETILDI (ball {eng:.3f})")
        continue
    kontekst = "\n\n".join(d.page_content for d, _ in n)
    j = (UZ_PROMPT | llm | StrOutputParser()).invoke(
        {"context": kontekst, "question": savol})
    print(f"✅ {savol:36s} → ball {eng:.3f}\n   {j.strip()[:120]}")
```

> ## ⚠️⚠️ **VA BU YERDA HALOL BO'LISH KERAK:**
> ```
> Qwen2.5-0.5B — O'ZBEKCHADA ZAIF. U kontekstni "tushunadi", lekin javobni
> ko'pincha INGLIZCHA yoki buzuq o'zbekchada yozadi.
> ```
>
> ## 🏆 **🇺🇿 O'ZBEKCHA RAG UCHUN TAVSIYA:**
> ```
> RETRIEVAL  →  ✅ mahalliy embedding YETARLI (bank↔kredit 0.6898, 4-dars)
> GENERATION →  ⚠️ KUCHLI model kerak: GPT-4o · Claude · Gemini
>               yoki Ollama'da 7B+ (llama3.1, qwen2.5:7b) — 37-modul
> ```
> ## 💡 **YA'NI: BAZA MAHALLIY QOLADI** *(ma'lumot suvereniteti — 12-dars)*, **faqat yakuniy prompt** modelga boradi.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** To'liq RAG zanjirining oxirgi bo'g'ini nima?

**M2.** RAG qanday savollarni **yaxshilamaydi**?

**M3.** Nima uchun `temperature=0`?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `StrOutputParser()` — `AIMessage` dan **matnni** ajratadi.

**M2.** ## **Umumiy bilim** savollarini *(o'lchandi: RAGsiz javob yaxshiroq chiqdi)*.

**M3.** Javob **kontekstdan** kelishi kerak, **ijoddan** emas.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ To'liq zanjirni ishga tushiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.output_parsers import StrOutputParser

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

zanjir = ({"context": retriever | RunnableLambda(format_docs),
           "question": RunnablePassthrough()}
          | pt | llm | StrOutputParser())

import time
for s in ["What software do data scientists use?",
          "What is the difference between analysis and analytics?"]:
    t0 = time.perf_counter()
    j = zanjir.invoke(s)
    print(f"\n[{time.perf_counter()-t0:.1f}s] {s}")
    print("  ", j.strip()[:200])
```

## ⚠️ **API KALITINGIZ BO'LMASA** — 37-moduldagi `ChatOllama` yoki yuqoridagi `HuggingFacePipeline`.

</details>

**M5.** ⭐⭐ RAG bilan / RAGsiz solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

pt_rag = PromptTemplate.from_template(
    "Use only the context to answer.\n\nContext:\n{context}\n\n"
    "Question: {question}\nAnswer:")
pt_yoq = PromptTemplate.from_template("Question: {question}\nAnswer:")

z_rag = ({"context": retriever | RunnableLambda(format_docs),
          "question": RunnablePassthrough()} | pt_rag | llm | StrOutputParser())
z_yoq = pt_yoq | llm | StrOutputParser()

SAVOLLAR = [
    ("What software do data scientists use?", "umumiy bilim"),
    ("What does this course say about EViews?", "hujjatga XOS"),
    ("What is the weather in Tashkent?", "javobi YO'Q"),
]
for s, tur in SAVOLLAR:
    print(f"\n═══ [{tur}] {s}")
    print("  RAG :", z_rag.invoke(s).strip()[:150])
    print("  YO'Q:", z_yoq.invoke({"question": s}).strip()[:150])
```

## 🏆 **"HUJJATGA XOS" SAVOLDA RAG SEZILARLI USTUN BO'LISHI KERAK.** Agar bo'lmasa — retriever **noto'g'ri bo'lak** topmoqda.

</details>

**M6.** ⭐⭐ Manbani qaytaruvchi zanjir yozing.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

z = (RunnableParallel(context=retriever, question=RunnablePassthrough())
     .assign(javob=(lambda x: {"context": format_docs(x["context"]),
                               "question": x["question"]})
                   | pt | llm | StrOutputParser()))

r = z.invoke(Q)
print("JAVOB:", r["javob"].strip()[:200])
print("\nMANBALAR:")
for i, d in enumerate(r["context"], 1):
    print(f"  [{i}] {d.metadata.get('Lecture Title','?')[:46]}")
    print(f"      {d.page_content[:70]}...")
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ To'liq ishlab chiqarish darajasidagi RAG sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import time, pandas as pd
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

QATTIQ = """Use ONLY the context below to answer the question.

RULES:
- If the context does not contain the answer, reply EXACTLY:
  "I don't know based on the provided documents."
- Do NOT use outside knowledge.
- Cite the source number in brackets, e.g. [1].

Context:
{context}

Question: {question}
Answer:"""


class RAGTizim:
    """Chegara + formatlash + manba + jurnal + tashxis."""

    RAD_JAVOB = "Hujjatlarimda bu savolga javob topilmadi."

    def __init__(self, vs, llm, min_ball=0.3, k=3, maks_token=3000,
                 shablon=QATTIQ):
        self.vs, self.llm = vs, llm
        self.min_ball, self.k, self.maks_token = min_ball, k, maks_token
        self.pt = PromptTemplate.from_template(shablon)
        self.jurnal = []

    # ── kontekst ──
    def _kontekst(self, juftlar):
        import tiktoken
        enc = tiktoken.get_encoding("cl100k_base")
        q, jami = [], 0
        for i, (d, s) in enumerate(juftlar, 1):
            t = len(enc.encode(d.page_content))
            if jami + t > self.maks_token:
                break
            manba = d.metadata.get("Lecture Title",
                                   d.metadata.get("source", "?"))
            q.append(f"[{i}] ({str(manba)[:40]})\n{d.page_content}")
            jami += t
        return "\n\n".join(q), jami, len(q)

    # ── asosiy ──
    def sora(self, savol):
        t0 = time.perf_counter()
        try:
            n = self.vs.similarity_search_with_relevance_scores(savol, k=self.k)
        except Exception:
            n = [(d, 1 / (1 + s))
                 for d, s in self.vs.similarity_search_with_score(savol, k=self.k)]
        qidiruv_ms = (time.perf_counter() - t0) * 1000
        eng = max((s for _, s in n), default=0.0)
        yaxshi = [(d, s) for d, s in n if s >= self.min_ball]

        # ① CHEGARA HIMOYASI
        if not yaxshi:
            r = {"savol": savol[:36], "javob": self.RAD_JAVOB, "manba": [],
                 "eng_ball": round(eng, 4), "himoya": "chegara",
                 "qidiruv_ms": round(qidiruv_ms), "gen_ms": 0,
                 "kontekst_token": 0, "bolak": 0}
            self.jurnal.append(r)
            return r

        kontekst, token, bolak = self._kontekst(yaxshi)
        t1 = time.perf_counter()
        javob = (self.pt | self.llm | StrOutputParser()).invoke(
            {"context": kontekst, "question": savol}).strip()
        gen_ms = (time.perf_counter() - t1) * 1000

        # ② PROMPT HIMOYASI ishlaganini qayd qilamiz
        himoya = "prompt" if "don't know" in javob.lower() else "yo'q"

        r = {"savol": savol[:36], "javob": javob,
             "manba": [d.metadata for d, _ in yaxshi[:bolak]],
             "eng_ball": round(eng, 4), "himoya": himoya,
             "qidiruv_ms": round(qidiruv_ms), "gen_ms": round(gen_ms),
             "kontekst_token": token, "bolak": bolak}
        self.jurnal.append(r)
        return r

    # ── tashxis ──
    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal).drop(columns=["javob", "manba"])
        print(d.to_string(index=False))

        rad = (d.himoya == "chegara").mean()
        print(f"\nchegara bilan rad etildi : {rad:.0%}")
        print(f"prompt bilan rad etildi  : {(d.himoya=='prompt').mean():.0%}")
        print(f"o'rtacha qidiruv         : {d.qidiruv_ms.mean():.0f} ms")
        print(f"o'rtacha generatsiya     : {d.gen_ms.mean():.0f} ms")
        print(f"o'rtacha kontekst        : {d.kontekst_token.mean():.0f} token")

        if rad > 0.4:
            print("⚠️ KO'P RAD ETILMOQDA — chegarani pasaytiring "
                  "yoki hujjatlarni to'ldiring")
        if rad == 0 and len(d) > 3:
            print("⚠️ HECH BIRI rad etilmadi — chegara JUDA PAST bo'lishi mumkin. "
                  "Javobi YO'Q savol bilan sinang!")
        if d.gen_ms.mean() > 5 * d.qidiruv_ms.mean():
            print("💡 Vaqt asosan MODELDA — streaming qo'shing (41-modul, 3-dars)")
        return d


rag = RAGTizim(cos_vs, llm, min_ball=0.3, k=3)
for s in ["What software do data scientists use?",
          "What is analysis vs analytics?",
          "What is the weather in Tashkent today?",   # ← javobi YO'Q
          "How do I cook pasta?"]:                    # ← javobi YO'Q
    r = rag.sora(s)
    print(f"\n[{r['himoya']}] {s}\n  {r['javob'][:140]}")
rag.hisobot()
```

## 🏆 **BU SINF — MODULNING BUTUN BILIMI BIR JOYDA:**
```
6–10-dars  →  yuklash va bo'laklash
11–12-dars →  embedding va Chroma
13-dars    →  barqaror ID
14-dars    →  ⭐ ball chegarasi
15-dars    →  MMR va filtr
16-dars    →  retriever Runnable
17-dars    →  ⭐ formatlash va byudjet
18-dars    →  ⭐ ikki qavatli himoya va jurnal
```

## 💥 **`hisobot()` DAGI IKKI OGOHLANTIRISH — TIZIMNI SOZLASHNING KALITI.**

</details>

---

## 📌 Xulosa

```python
zanjir = ({"context": retriever | RunnableLambda(format_docs),
           "question": RunnablePassthrough()}
          | pt | llm | StrOutputParser())
```

```
✅ Zanjir to'liq ishladi (mahalliy Qwen2.5-0.5B, 4.5s)
💥 "Toshkentda ob-havo?" → model "qualitative analytics" deb TO'QIDI
💥 Umumiy bilim savolida RAGSIZ javob YAXSHIROQ chiqdi
⚠️ Kichik modelda o'qitish ma'lumoti SIZIB CHIQDI
```

> ## 🏆🏆 **MODULNING ENG MUHIM XULOSASI:**
> ```
> RAG — MODELNI EMAS, KONTEKSTNI TUZATADI.
>
> ① Retriever noto'g'ri bo'lak topsa  →  model YOLG'ON TO'QIYDI
> ② "use only the context" YETARLI EMAS
> ③ ⭐ BALL CHEGARASI — modelga bog'liq bo'lmagan YAGONA himoya
> ④ Manbani DOIM qaytaring — tekshirib bo'lmaydigan javob KERAK EMAS
> ```
>
> ## 🇺🇿 **O'ZBEKCHA UCHUN:** retrieval **mahalliy** qilinadi *(bepul, maxfiy)*, generatsiya uchun **kuchli model** kerak.

---

⬅️ [17-dars. Stuffing](17-Stuffing-Documents.md) · 🏠 [Modul boshiga](README.md) · ➡️ [43-modul. LangGraph](../43-LangGraph-Introduction/README.md)
