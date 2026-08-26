# 3-dars. Talablar ⭐

## 🎬 Boshlashdan oldin

> **"Python asoslari, type hint'lar va Jupyter kerak bo'ladi."**

---

## 1. Python talablari — va nima uchun

| Tushuncha | Qayerda kerak bo'ladi |
|---|---|
| Lug'at va ro'yxat | ## **State — bu lug'at** |
| Ro'yxat comprehension | `[RemoveMessage(id=i.id) for i in ...]` |
| Shart va sikllar | Routing funksiya |
| Funksiyalar | ## **Har tugun — funksiya** |
| Sinf va meros | ## `class State(TypedDict)` |
| ## ⭐ **Type hint** | ## **LangGraph'ning ASOSI** |

> ## 🔑 **TYPE HINT — LANGGRAPH'DA IXTIYORIY EMAS.** `StateGraph(State)` **sxemani** shu orqali biladi.

---

## 2. ⭐⭐ Type hint — 5 daqiqada

```python
# Oddiy
def salomlash(ism: str) -> str:
    return f"Salom, {ism}!"

# Ro'yxat
from collections.abc import Sequence
def birinchi(x: Sequence[int]) -> int:
    return x[0]

# ⭐ TypedDict — kalitlari MA'LUM lug'at
from typing_extensions import TypedDict

class Foydalanuvchi(TypedDict):
    ism: str
    yosh: int

f = Foydalanuvchi(ism="Oybek", yosh=30)
print(f, type(f))
```

```
{'ism': 'Oybek', 'yosh': 30} <class 'dict'>
```

> ## 💥💥 **DIQQAT — BU ODDIY `dict`!**
> ```
> TypedDict  →  ish vaqtida ODDIY LUG'AT
>            →  noto'g'ri kalit qo'ysangiz XATO BERMAYDI
>            →  faqat TIP TEKSHIRUVCHI (mypy) ogohlantiradi
> ```
>
> ## ✅ **SINAB KO'RING:**
> ```python
> f = Foydalanuvchi(ism="Oybek", yosh=30, notogri_kalit="!")   # xato YO'Q
> print(f)     # {'ism': 'Oybek', 'yosh': 30, 'notogri_kalit': '!'}
> ```

---

## 3. ⭐ `Literal` va `Annotated`

```python
from typing import Literal, Annotated

# ── Literal: FAQAT shu qiymatlar ──
def yol(javob: str) -> Literal["ask_question", "__end__"]:
    return "ask_question" if javob == "yes" else "__end__"

# ── Annotated: tipga QO'SHIMCHA MA'LUMOT biriktirish ──
from langgraph.graph import add_messages
from collections.abc import Sequence
from langchain_core.messages import BaseMessage

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    #                   ↑ tip                  ↑ ⭐ REDUCER funksiya
```

> ## 🏆🏆 **`Annotated` — 46-MODULNING BUTUN MAZMUNI.**
>
> ## 🔑 **U LANGGRAPH'GA AYTADI:** *"bu maydonni ALMASHTIRMA — `add_messages` bilan BIRLASHTIR"*.
>
> ## 💥 **USIZ NIMA BO'LADI? BIZ O'LCHADIK:**
> ```
> Annotated YO'Q   →  1 xabar:  ['ikkinchi']                       💥 YO'QOLDI
> Annotated BOR    →  3 xabar:  ["boshlang'ich", 'birinchi', 'ikkinchi']  ✅
> ```
> ## ⚠️ **VA KURSNING 45-MODULDAGI BIRINCHI GRAFIDA `Annotated` YO'Q** — ya'ni foydalanuvchining **savoli yo'qoladi**.

---

## 4. ⚠️ Kurs talab qiladigan narsalar va MUQOBILLARI

| Kurs talab qiladi | Muqobil |
|---|---|
| Anaconda | ## ✅ **oddiy `venv` yetadi** |
| Jupyter Notebook | ## ✅ **oddiy `.py` fayl** *(ba'zi tuzatishlar bilan — 44-dars)* |
| ## **OpenAI API kaliti** | ## ⭐⭐ **`FakeListChatModel` yoki Ollama** |
| `mypy_ipython` | ## ixtiyoriy — `mypy fayl.py` ham bo'ladi |
| Python 3.11.11 | 3.10+ **yetadi** |

> ## 🏆 **API KALITISIZ BUTUN BO'LIMNI O'RGANISH MUMKIN.** Chunki LangGraph — **grafni boshqarish**, model esa **bitta tugun ichida**.
>
> ## ⭐ **BIZNING SINOV MODELIMIZ:**
> ```python
> from langchain_core.language_models.fake_chat_models import FakeListChatModel
> chat = FakeListChatModel(responses=["Birinchi javob.", "Ikkinchi javob."])
> print(chat.invoke("nima?").content)      # "Birinchi javob."
> print(chat.invoke("yana?").content)      # "Ikkinchi javob."
> ```
> **`ChatOpenAI` bilan bir xil interfeys** — `invoke`, `batch`, `stream` **hammasi ishlaydi**.

---

## 5. ⭐ Oldingi modullardan nima kerak

| Modul | Nima |
|---|---|
| [37](../37-LangChain-Setting-Up-Environment/README.md) | `.env` · `load_dotenv` · ## ⭐ **Ollama** |
| [38](../38-LangChain-OpenAI-API/README.md) | `temperature=0` · `seed` · `max_completion_tokens` |
| [39](../39-LangChain-Model-Inputs/README.md) | ## ⭐⭐ `HumanMessage` · `AIMessage` · `SystemMessage` |
| [41](../41-LangChain-LCEL/README.md) | ## **Runnable** · `invoke` · `stream` |
| [42](../42-LangChain-RAG/README.md) | Retriever — tugun ichiga **qo'yiladi** |

> ## 💡 **AGAR `HumanMessage` VA `AIMessage` NIMA EKANINI BILMASANGIZ — 39-MODULNI KO'RING.** LangGraph'ning butun 46-moduli **shular ustida**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `TypedDict` ish vaqtida nima?

**M2.** `Annotated` nima uchun kerak?

**M3.** API kaliti majburiymi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Oddiy `dict`.** Tip tekshiruvi **ish vaqtida emas**, faqat `mypy` bilan.

**M2.** ## Maydonga **reducer** biriktirish — LangGraph uni **qanday birlashtirishni** bilsin.

**M3.** ## ❌ **Yo'q** — `FakeListChatModel` yoki **Ollama** bilan hammasi ishlaydi.

</details>

### 🟡 O'rta

**M4.** ⭐ `TypedDict` ning "yumshoq"ligini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
from typing_extensions import TypedDict

class Holat(TypedDict):
    messages: list
    summary: str

h = Holat(messages=[], summary="")
print("turi:", type(h))                       # <class 'dict'>
print("dict mi?", isinstance(h, dict))        # True

# 💥 noto'g'ri kalit — XATO YO'Q
h["mavjud_bolmagan"] = 42
print("noto'g'ri kalit qo'shildi:", h)

# 💥 noto'g'ri tip — XATO YO'Q
h["summary"] = 12345
print("summary endi int:", h["summary"], type(h["summary"]))

print("\n⚠️ Python HECH NARSA demadi. Faqat mypy ogohlantiradi.")
```

## 💥 **SHUNING UCHUN `state.get('summary', '')` ISHLATING** — kalit **bo'lmasligi** mumkin.

</details>

**M5.** ⭐ `FakeListChatModel` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.messages import HumanMessage, SystemMessage

chat = FakeListChatModel(responses=["Birinchi.", "Ikkinchi.", "Uchinchi."])

for i in range(4):                            # ⭐ 4-chi — aylanib qaytadi
    r = chat.invoke([HumanMessage(f"savol {i}")])
    print(f"  {i}: {r.content}  ({type(r).__name__})")

print("\nbatch:", [m.content for m in chat.batch(["a", "b"])])
print("stream:", "".join(c.content for c in chat.stream("x")))
```

## 🔑 **JAVOBLAR SIKL BO'YICHA QAYTARILADI** — sinovda **takrorlanuvchan** natija.

## 🏆 **GRAF MANTIQINI SINASH UCHUN — IDEAL.** Model **tasodifiy emas**, xato **grafda** ekani aniq bo'ladi.

</details>

**M6.** ⭐⭐ Ollama bilan mahalliy model.

<details>
<summary>✅ Yechim</summary>

```bash
# https://ollama.com dan o'rnating, keyin:
ollama pull qwen2.5:7b
pip install langchain-ollama
```

```python
from langchain_ollama import ChatOllama

chat = ChatOllama(model="qwen2.5:7b", temperature=0)
print(chat.invoke("Salom! O'zbek tilida javob ber.").content)
```

```python
# ⭐ AVTOMATIK TANLOV — kalit bor bo'lsa OpenAI, yo'q bo'lsa mahalliy
import os

def model_ol(temperature=0):
    if os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        print("✅ ChatOpenAI")
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature, seed=365)
    try:
        from langchain_ollama import ChatOllama
        m = ChatOllama(model="qwen2.5:7b", temperature=temperature)
        m.invoke("test")
        print("✅ ChatOllama (mahalliy)")
        return m
    except Exception:
        pass
    from langchain_core.language_models.fake_chat_models import FakeListChatModel
    print("⚠️ FakeListChatModel (faqat sinov)")
    return FakeListChatModel(responses=["Sinov javobi."] * 50)

chat = model_ol()
```

## 🏆 **BU FUNKSIYANI BUTUN BO'LIM DAVOMIDA ISHLATAMIZ.**

</details>

---

## 📌 Xulosa

```python
from typing_extensions import TypedDict           # ⭐ state sxemasi
from typing import Literal, Annotated             # ⭐ routing va reducer

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    summary: str
```

```
💥 TypedDict — ODDIY dict, ish vaqtida TEKSHIRMAYDI  →  .get() ishlating
🏆 Annotated — reducer biriktiradi  →  usiz xabarlar YO'QOLADI (o'lchandi)
⭐ API kaliti SHART EMAS — FakeListChatModel yoki Ollama
```

---

⬅️ [2-dars. Kurs nimani qamraydi](02-What-Does-the-Course-Cover.md) · 🏠 [Modul boshiga](README.md) · ➡️ [44-modul. Muhitni sozlash](../44-LangGraph-Setting-Up-Environment/README.md)
