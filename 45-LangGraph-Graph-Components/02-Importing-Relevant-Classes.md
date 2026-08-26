# 2-dars. Birinchi graf — importlar ⭐

## 🎬 Boshlashdan oldin

> **"Bizning birinchi grafimiz: boshlang'ich tugun, foydalanuvchi savoliga javob beruvchi chatbot tuguni, yakuniy tugun va ularni bog'lovchi ikkita qirra."**

---

## 1. Kursning importlari

```
%load_ext dotenv
%dotenv
%load_ext mypy_ipython

from langgraph.graph import START, END, StateGraph
from typing_extensions import TypedDict
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.messages import HumanMessage, BaseMessage
from langchain_core.runnables import Runnable
from collections.abc import Sequence
```

| Import | Nima uchun |
|---|---|
| `START`, `END` | ## Boshlanish va tugash — **satrlar** |
| `StateGraph` | ## **Graf sinfi** |
| `TypedDict` | ## **Sxema** |
| `ChatOpenAI` | Model *(⭐ almashtiriladi)* |
| `HumanMessage` | Foydalanuvchi xabari |
| `BaseMessage` | ## **Tip ko'rsatmasi** uchun |
| `Runnable` | ## Kompilyatsiyani **tekshirish** uchun |
| `Sequence` | Tip ko'rsatmasi |

---

## 2. ⭐⭐ Bizning importlarimiz — kalitsiz

```python
import warnings; warnings.filterwarnings("ignore")
import os
from typing import Literal, Annotated
from typing_extensions import TypedDict
from collections.abc import Sequence

from langgraph.graph import START, END, StateGraph, add_messages
from langchain_core.messages import (HumanMessage, AIMessage, BaseMessage,
                                     SystemMessage, RemoveMessage)
from langchain_core.runnables import Runnable

# ⭐ API kalitisiz model
from langchain_core.language_models.fake_chat_models import FakeListChatModel


def model_ol(temperature=0, seed=365):
    if os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        print("✅ ChatOpenAI")
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature, seed=seed)
    try:
        from langchain_ollama import ChatOllama
        m = ChatOllama(model="qwen2.5:7b", temperature=temperature)
        m.invoke("test")
        print("✅ ChatOllama")
        return m
    except Exception:
        pass
    print("⚠️ FakeListChatModel — javoblar SOXTA")
    return FakeListChatModel(responses=[
        "Grook: The road to wisdom? Well, it's plain and simple to express.",
        "Piet Hein was born in Copenhagen, Denmark, on December 16, 1905."] * 30)


chat = model_ol()
```

> ## 🔑 **`from langgraph.graph import ... add_messages` — KURSDA BU YERDA YO'Q.** U **46-modulda** qo'shiladi.
>
> ## 💥 **VA AYNAN SHU SABABLI — 3–4-DARSDAGI GRAF SAVOLNI YO'QOTADI.** *(4-darsda o'lchaymiz.)*

---

## 3. ⚠️ `%load_ext dotenv` — Jupyter'ga xos

```
# ❌ .py faylda ISHLAMAYDI
%load_ext dotenv
%dotenv
```

```python
# ✅ Universal
from dotenv import load_dotenv
load_dotenv(override=True)          # ⭐ override — mavjud qiymatni ALMASHTIRADI
```

> ## 💡 **`override=True` NIMA UCHUN?**
> ```
> override=False (standart) →  tizimda allaqachon bor kalit SAQLANADI
> override=True             →  ⭐ .env dagi qiymat USTUN
> ```
> ## 💥 **BU — ESKI KALIT BILAN SOATLAB KURASHISHNING SABABI.** *(37-modulda ko'rganmiz.)*

---

## 4. ⭐ `mypy_ipython` — nima qiladi va shartmi?

```
%load_ext mypy_ipython
%mypy
```

> ## ⚠️ **BU — IXTIYORIY.** Kurs o'zi ham aytadi: **"kod bajarilishiga ta'sir qilmaydi"**.
>
> ## 🔑 **U NIMA QILADI?** `state["summary"]` yozganingizda, sxemada `summary` **yo'q bo'lsa** — ogohlantiradi.
>
> ## ✅ **`.py` FAYLDA MUQOBIL:**
> ```bash
> pip install mypy
> mypy mening_grafim.py
> ```
>
> ## ⚠️ **KURSNING OGOHLANTIRISHI TO'G'RI:** *"tekshiruv to'g'ri ishlashi uchun katakchalar TARTIB BILAN bajarilgan bo'lishi kerak"*. Bu — **notebooklarning eng katta muammosi**.

---

## 5. ⭐⭐ `Sequence` va `list` — farqi

```python
from collections.abc import Sequence

class State(TypedDict):
    messages: Sequence[BaseMessage]      # kursdagidek
```

```python
class State(TypedDict):
    messages: list[BaseMessage]          # ✅ soddaroq
```

| | `Sequence` | `list` |
|---|---|---|
| Ma'nosi | ## **O'qish uchun** ketma-ketlik | ## **O'zgartirish** mumkin |
| `append` | ## ❌ tip jihatdan yo'q | ## ✅ bor |
| Qamrov | `list`, `tuple`, `str`... | faqat `list` |

> ## 💡 **`Sequence` — "MEN BU RO'YXATNI O'ZGARTIRMAYMAN" DEGAN VA'DA.** LangGraph'da bu **to'g'ri** yondashuv: tugun **yangi ro'yxat qaytaradi**, eskisini **o'zgartirmaydi**.
>
> ## ⚠️ **LEKIN AMALDA `list[BaseMessage]` HAM ISHLAYDI** va **soddaroq**. `MessagesState` o'zi ham `list` ishlatadi *(46-modul, 3-dars)*.

---

## 6. ⭐ `Runnable` nima uchun import qilinadi?

```python
from langchain_core.runnables import Runnable

graph = StateGraph(State)
# ... tugunlar va qirralar ...
graph_compiled = graph.compile()

print("graph          Runnable?", isinstance(graph, Runnable))
print("graph_compiled Runnable?", isinstance(graph_compiled, Runnable))
print("turi:", type(graph_compiled).__name__)
```

```
graph          Runnable? False
graph_compiled Runnable? True
turi: CompiledStateGraph
```

> ## 🏆🏆 **BU — 41-MODULNI LANGGRAPH BILAN BOG'LAYDIGAN NUQTA:**
> ```
> graph          →  QURILISH obyekti (Runnable EMAS)
> graph_compiled →  ⭐ RUNNABLE — LCEL'ning HAMMA imkoniyati unda
> ```
>
> ## ✅ **YA'NI:**
> ```python
> graph_compiled.invoke(state)
> graph_compiled.batch([s1, s2, s3])          # ⭐ bir necha suhbat
> graph_compiled.stream(state)                # ⭐ qadamma-qadam
> graph_compiled | boshqa_zanjir              # ⭐ LCEL ga ULANADI
> await graph_compiled.ainvoke(state)         # ⭐ asinxron
> ```
>
> ## 💡 **GRAF — KATTA RUNNABLE.** Uni **boshqa zanjirning ichiga** qo'yish mumkin.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `add_messages` kursda qayerda import qilinadi?

**M2.** `graph` Runnable mi?

**M3.** `%dotenv` `.py` faylda ishlaydimi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Bu darsda EMAS** — faqat **46-modulda**. Shuning uchun birinchi graf **savolni yo'qotadi**.

**M2.** ## ❌ **Yo'q.** Faqat `graph_compiled` — ## ✅ **`CompiledStateGraph`**.

**M3.** ## ❌ **Yo'q** — bu Jupyter magic. `load_dotenv(override=True)` ishlating.

</details>

### 🟡 O'rta

**M4.** ⭐ Importlarni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
IMPORTLAR = [
    ("langgraph.graph", ["START", "END", "StateGraph", "add_messages",
                         "MessagesState"]),
    ("langchain_core.messages", ["HumanMessage", "AIMessage", "BaseMessage",
                                 "SystemMessage", "RemoveMessage",
                                 "trim_messages"]),
    ("langchain_core.runnables", ["Runnable"]),
    ("langgraph.checkpoint.memory", ["InMemorySaver"]),
    ("langgraph.types", ["interrupt", "Command"]),
]

import importlib
for modul, nomlar in IMPORTLAR:
    try:
        m = importlib.import_module(modul)
        bor = [n for n in nomlar if hasattr(m, n)]
        yoq = [n for n in nomlar if not hasattr(m, n)]
        print(f"✅ {modul}")
        print(f"     bor: {bor}")
        if yoq:
            print(f"     ❌ yo'q: {yoq}")
    except ImportError as e:
        print(f"❌ {modul}: {e}")
```

## 💡 **`langgraph.types` DAGI `interrupt` VA `Command` — KURSDA YO'Q**, lekin **5-darsdagi `input()` muammosining yechimi**.

</details>

**M5.** ⭐ `Runnable` munosabatini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import Runnable

class S(TypedDict):
    n: int

g = StateGraph(S)
g.add_node("qosh", lambda s: {"n": s["n"] + 1})
g.add_edge(START, "qosh"); g.add_edge("qosh", END)
gc = g.compile()

print("graph  :", type(g).__name__, "· Runnable?", isinstance(g, Runnable))
print("compiled:", type(gc).__name__, "· Runnable?", isinstance(gc, Runnable))

print("\n⭐ Runnable metodlari:")
for m in ["invoke", "batch", "stream", "ainvoke", "astream", "with_retry",
          "with_fallbacks"]:
    print(f"  {'✅' if hasattr(gc, m) else '❌'} {m}")

print("\nbatch:", gc.batch([{"n": 1}, {"n": 10}, {"n": 100}]))
print("stream:", list(gc.stream({"n": 41})))
```

## 🏆 **`batch` — BIR NECHA SUHBATNI PARALLEL YURITISH DEMAK.**

</details>

**M6.** ⭐⭐ Grafni LCEL zanjiriga ulang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnableLambda

class S(TypedDict):
    matn: str
    natija: str

g = StateGraph(S)
g.add_node("katta", lambda s: {"natija": s["matn"].upper()})
g.add_edge(START, "katta"); g.add_edge("katta", END)
gc = g.compile()

# ⭐ GRAF — ZANJIRNING O'RTASIDA
zanjir = (RunnableLambda(lambda x: {"matn": x, "natija": ""})
          | gc
          | RunnableLambda(lambda s: f"[{s['natija']}]"))

print(zanjir.invoke("salom dunyo"))
print(zanjir.batch(["bir", "ikki", "uch"]))
```

```
[SALOM DUNYO]
['[BIR]', '[IKKI]', '[UCH]']
```

## 🏆 **GRAF — LCEL ZANJIRINING BIR BO'G'INI.** Ikkalasi **bir-birini almashtirmaydi**, **birga ishlaydi**.

</details>

---

## 📌 Xulosa

```python
from langgraph.graph import START, END, StateGraph, add_messages   # ⭐ add_messages
from typing_extensions import TypedDict
from collections.abc import Sequence
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_core.language_models.fake_chat_models import FakeListChatModel
```

```
graph          →  Runnable EMAS  (qurilish obyekti)
graph_compiled →  ⭐ Runnable — invoke · batch · stream · | · ainvoke

⚠️ %dotenv → Jupyter'ga xos → load_dotenv(override=True)
⚠️ mypy_ipython → IXTIYORIY
💥 add_messages kursda BU YERDA YO'Q → birinchi graf SAVOLNI YO'QOTADI
```

---

⬅️ [1-dars. State, node, edge](01-States-Nodes-and-Edges.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. State va tugun](03-Defining-a-State-and-a-Node.md)
