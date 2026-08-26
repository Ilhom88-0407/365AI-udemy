# ⛓️ 41-modul. LangChain Expression Language (LCEL)

> ## 🏆🏆 **BU — BUTUN LANGCHAIN BO'LIMINING ENG QIMMATLI MODULI.**
>
> 35-modulda ko'rgan edik: `langchain.chains`, `langchain.memory`, `langchain.output_parsers` — **hammasi olib tashlangan**.
> **LCEL esa — joyida.** ## **Bu bilim eskirmadi.**

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [Prompt, model, parserni ulash](01-Piping-Prompt-Model-Parser.md) ⭐⭐ | `\|` operatori · ## **modelsiz o'rganish** |
| 2 | [Batching](02-Batching.md) ⭐ | ## **4× tezlanish** · `max_concurrency` |
| 3 | [Streaming](03-Streaming.md) | `stream` · ## ⭐ **`astream_events`** |
| 4 | [Runnable sinflari](04-Runnable-and-RunnableSequence.md) ⭐⭐ | ## **`with_retry`** · **`with_fallbacks`** |
| 5 | [Zanjirlarni ulash · RunnablePassthrough](05-Piping-Chains-RunnablePassthrough.md) ⭐⭐ | ## **`assign`** — RAG'ning kaliti |
| 6 | [Grafda ko'rish](06-Graphing-Runnables.md) | ⚠️ **`grandalf` kerak** · mermaid |
| 7 | [RunnableParallel](07-RunnableParallel.md) ⭐⭐ | ## **vaqt tejaydi, narx oshiradi** |
| 8 | [RunnableParallel'ni ulash](08-Piping-RunnableParallel.md) ⭐ | ## **RAG naqshi** |
| 9 | [RunnableLambda](09-RunnableLambda.md) ⭐⭐ | Istalgan funksiyani zanjirga |
| 10 | [`@chain` dekoratori](10-The-Chain-Decorator.md) ⭐ | Nomlangan qadamlar |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**36 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**4 ta mini-loyiha**](LOYIHALAR.md) | 🔬 **zanjir profileri** · 🛡️ **ishonchli zanjir** · 🔀 **marshrutlovchi** · 📊 **modelsiz sinov to'plami** |

> ## ⭐⭐ **DEYARLI HAMMASI API KALITISIZ** — LCEL `RunnableLambda` bilan **to'liq** o'rganiladi.

---

## 🧭 LCEL nima — bir rasmda

![LCEL](assets/01-lcel.svg)

```python
# QO'LDA (39–40-modul)
pv = chat_template.invoke({"pet": "dog"})
am = chat.invoke(pv)
r  = parser.invoke(am)

# ⭐ LCEL
chain = chat_template | chat | parser
r = chain.invoke({"pet": "dog"})
```

```
turi    : RunnableSequence
qadamlar: ['ChatPromptTemplate', 'ChatOpenAI', 'CommaSeparatedListOutputParser']
```

> ## 🔑 **`|` — SEHR EMAS, `__or__`.** Butun LCEL'ning asosi — **o'n satr**:
> ```python
> class MeningRunnable:
>     def __init__(self, f): self.f = f
>     def invoke(self, x): return self.f(x)
>     def __or__(self, b):
>         return MeningRunnable(lambda x: b.invoke(self.invoke(x)))
>
> (MeningRunnable(sum) | MeningRunnable(lambda x: x**2)).invoke([1,2,5])   # 64
> ```
> LangChain unga **batch**, **stream**, **async**, **retry**, **fallback** va **graf** qo'shadi.

---

## 🏆 Modelsiz o'rganing — BEPUL va TEZ

```python
from langchain_core.runnables import RunnableLambda

chain = RunnableLambda(lambda x: sum(x)) | RunnableLambda(lambda x: x ** 2)
print(chain.invoke([1, 2, 5]))          # 64
```

> ## 💡 **Kurs buni 9-darsda ko'rsatadi.** Biz uni **birinchi darsda** beramiz — chunki u **mexanizmni** eng yaxshi tushuntiradi va **API kaliti kerak emas**.

---

## 🔬 O'lchangan natijalar

### `batch` — 4× tezlanish

```
ketma-ket : 1.20s
batch     : 0.30s        ⭐ 4× tez
batch(2)  : 0.60s        (max_concurrency=2)
```

### `RunnableParallel` — haqiqatan parallel

```
3 ta 0.4s shox  →  0.40s      ✅ tasdiqlandi (ketma-ket bo'lsa 1.20s)
```

### `with_retry` va `with_fallbacks` ishlaydi

```
with_retry     →  muvaffaqiyat (3 urinish)
with_fallbacks →  zaxira javob
```

### `@chain` — `RunnableLambda` ning qisqartmasi

```python
@chain
def yig(x): return sum(x)

print(type(yig).__name__)          # RunnableLambda
```

---

## 💥 Kursda YO'Q, lekin ISHLAB CHIQARISHDA MAJBURIY

| Metod | Nima beradi |
|---|---|
| ## `with_retry(stop_after_attempt=3, wait_exponential_jitter=True)` | ## **tarmoq / rate limit** xatolari o'zi tuzatiladi |
| ## `with_fallbacks([zaxira])` | ## **model ishlamasa** — zaxira zanjir |
| `batch(..., return_exceptions=True)` | ## **bitta xato butun batchni buzmasin** |
| `batch(..., config={"max_concurrency": 5})` | rate limit himoyasi |
| `batch_as_completed` | tayyor bo'lganini **darhol** |
| ## `RunnablePassthrough.assign(...)` | ## **eski kalitlarni saqlab** yangisini qo'shish |
| `pick` · `map` · `bind` | maydon tanlash · ro'yxatga qo'llash · parametr biriktirish |
| ## `astream_events(..., version="v2")` | ## **zanjir ichida nima bo'layotgani** |
| `ainvoke` / `abatch` / `astream` | async — web-server uchun |

---

## ⚠️ Uchta muhim ogohlantirish

### ① `RunnableParallel` narxni OSHIRADI

![Parallel](assets/02-parallel.svg)

```
n shox  →  n ta ALOHIDA model chaqiruvi
        →  n× NARX
        →  1× VAQT             ⭐
```

> ## 🔑 **SIZ PULGA VAQT SOTIB OLASIZ.** Arzonroq muqobil — **bitta chaqiruvda JSON** so'rash. **O'lchang.**

### ② Bitta shox sinsa — HAMMASI sinadi

```python
RunnableParallel({
    "books": chain_books.with_fallbacks([RunnableLambda(lambda x: "—")]),
    "projects": chain_projects.with_fallbacks([RunnableLambda(lambda x: "—")]),
})
```

### ③ `print_ascii()` uchun `grandalf` kerak

```
ImportError: Install grandalf to draw graphs: `pip install grandalf`
```

> ## 💥 **KURS BUNI AYTMAYDI.**

---

## ⭐⭐ RAG naqshi — 42-modulning asosi

```python
from operator import itemgetter

# ① Lug'at + itemgetter
rag = ({"kontekst": itemgetter("savol") | retriever | format_docs,
        "savol": itemgetter("savol")}                    # ⭐ savol OLIB O'TILADI
       | prompt | chat | StrOutputParser())

# ② ⭐ assign — qisqaroq
rag = (RunnablePassthrough.assign(
           kontekst=lambda x: format_docs(retriever.invoke(x["savol"])))
       | prompt | chat | StrOutputParser())
```

> ## 💥 **`{"kontekst": ...}` BO'LGANIDA `savol` YO'QOLARDI** — biz buni **o'lchab** ko'rsatdik:
> ```
> lug'at :  {'kontekst': 'hujjat matni'}                        ← savol YO'Q 💥
> assign :  {'savol': '...', 'til': 'uz', 'kontekst': '...'}    ✅
> ```

---

## 🎓 Modulni tugatgach

```
✅ | operatori qanday ishlashini BILASIZ (__or__)
✅ Zanjirni modelsiz qurib SINAY olasiz
✅ batch bilan 4× tezlanish olasiz
✅ max_concurrency bilan rate limit'dan himoyalanasiz
✅ with_retry va with_fallbacks bilan ISHONCHLI zanjir qurasiz
✅ RunnableParallel narxni oshirishini BILASIZ
✅ assign va Passthrough farqini BILASIZ (RAG uchun HAL QILUVCHI)
✅ RunnableLambda bilan istalgan funksiyani qo'shasiz
✅ astream_events bilan zanjir ICHINI ko'rasiz
✅ Zanjirni MODELSIZ sinash to'plamini qurasiz
```

---

## 🔗 Bog'liq modullar

| Modul | Aloqasi |
|---|---|
| [35-modul](../35-LangChain-Introduction/README.md) | ## **`chains` va `memory` olib tashlangan — LCEL qoldi** |
| [36-modul](../36-LangChain-Tokens-Models-Prices/README.md) | Parallel narxi · narx nazorati |
| [38-modul](../38-LangChain-OpenAI-API/README.md) | `finish_reason` · oqim tuzoqlari |
| [39-modul](../39-LangChain-Model-Inputs/README.md) | Prompt shabloni — zanjirning **birinchi** qadami |
| [40-modul](../40-LangChain-Output-Parsers/README.md) | Parser — zanjirning **oxirgi** qadami |
| [42-modul](../42-LangChain-RAG/README.md) | ➡️ **`assign` bilan RAG zanjiri** |
| [43–47-modul](../43-LangGraph-Introduction/README.md) | LangGraph — LCEL'dan **keyingi** qadam |

---

⬅️ [40-modul. Chiqish parserlari](../40-LangChain-Output-Parsers/README.md) · 🏠 [Bosh sahifa](../README.md) · ➡️ [42-modul. RAG](../42-LangChain-RAG/README.md)
