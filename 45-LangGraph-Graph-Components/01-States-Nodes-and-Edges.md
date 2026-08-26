# 1-dars. State, node va edge ⭐⭐

## 🎬 Boshlashdan oldin

> **"Graf — ilovaning OQIMINI belgilaydi. Bu — ma'lumot qanday harakatlanishi va vazifalar qanday bajarilishining tuzilgan XARITASI."**

---

## 1. Uchta komponent

```
NODE (tugun)  →  Python FUNKSIYASI, bitta vazifani bajaradi
EDGE (qirra)  →  qaysi tugundan qaysisiga o'tish
STATE (holat) →  tugundan tugunga o'tuvchi va YANGILANUVCHI ma'lumot
```

> ## 🔑 **IKKI MAXSUS TUGUN DOIM BOR:**
> ```python
> from langgraph.graph import START, END
>
> print(repr(START))     # '__start__'
> print(repr(END))       # '__end__'
> print(type(START))     # <class 'str'>
> ```
>
> ```
> START = '__start__'  str
> END   = '__end__'    str
> ```
>
> ## 💥 **BULAR — SEHRLI OBYEKT EMAS, ODDIY SATRLAR.** Shuning uchun:
> ```python
> graph.add_edge(START, "chatbot")        # ✅
> graph.add_edge("__start__", "chatbot")  # ✅ AYNAN SHU NARSA
> ```
> ## 💡 **VA `routing_function` `"__end__"` QAYTARISHI KERAK** — `END` **o'zi ham shu satr**.

---

## 2. Kursning misoli — yangi xodim yordamchisi

> **"Anna agentni ishga tushiradi. Boshlang'ich tugun darhol faollashadi, keyin ikkinchi tugun salomlashadi..."**

```
[START]
   ↓
[salomlashish]     "Salom! Qanday yordam bera olaman?"
   ↓
[chatbot]          "Ta'til siyosati qanday?" → LLM javob beradi
   ↓
[xulosalash]       suhbatni qisqartiradi
   ↓
[yana savolmi?]  ──ha──→ [salomlashish]     ⭐ SHARTLI QIRRA
   │
  yo'q
   ↓
[END]
```

> ## 🔑 **"HAR TUGUN ANIQ VA ODDIY VAZIFANI BAJARADI — BU GRAFNI QURISH, SINASH VA TUZATISHNI OSONLASHTIRADI."**
>
> ## 💡 **BU — MUHIM DIZAYN QOIDASI:**
> ```
> ❌ [hamma-narsani-qiladigan-tugun]
> ✅ [savol_ol] → [hujjat_topish] → [javob_ber] → [xulosalash]
> ```
> **Ikkinchisida** biror narsa buzilsa — **qaysi tugunda** ekani **darhol** ko'rinadi.

---

## 3. ⭐⭐ State va sxema — farqi

> **"State — grafda oqayotgan HAQIQIY MA'LUMOT. Sxema esa — o'sha ma'lumot QANDAY KO'RINISHI kerakligini belgilovchi TUZILISH va QOIDALAR."**

```python
from typing_extensions import TypedDict
from collections.abc import Sequence
from langchain_core.messages import BaseMessage

# ── SXEMA (qoidalar) ──
class State(TypedDict):
    messages: Sequence[BaseMessage]

# ── STATE (haqiqiy ma'lumot) ──
state = State(messages=[HumanMessage("Ta'til siyosati qanday?")])
print(state)
print(type(state))
```

```
{'messages': [HumanMessage(content="Ta'til siyosati qanday?", ...)]}
<class 'dict'>
```

> ## 💥💥 **DIQQAT — `State(...)` ODDIY `dict` QAYTARADI.**
>
> ## 🔑 **YA'NI:**
> ```python
> State(messages=[], notogri_kalit=42)      # ✅ XATO YO'Q
> state["summary"]                          # 💥 KeyError — kalit yo'q
> state.get("summary", "")                  # ✅ XAVFSIZ
> ```
> ## 🏆 **DOIM `.get()` ISHLATING** — LangGraph tugunlari **qisman** state qaytaradi.

### Sxemaning ikki varianti

```python
# ⭐ TypedDict — kursda ishlatiladi, sodda va tez
class State(TypedDict):
    messages: Sequence[BaseMessage]

# Pydantic — TEKSHIRUV kerak bo'lsa
from pydantic import BaseModel, Field

class StatePydantic(BaseModel):
    messages: list = Field(default_factory=list)
    summa: int = Field(ge=0, le=1_000_000_000)      # ⭐ HAQIQIY tekshiruv
```

| | `TypedDict` | Pydantic |
|---|---|---|
| Tekshiruv | ## ❌ **yo'q** | ## ✅ **ish vaqtida** |
| Tezlik | ## ⭐ **tezroq** | sekinroq |
| Standart qiymat | yo'q | ## ✅ bor |
| Qachon | ## ⭐ **odatiy holat** | ## Foydalanuvchi **kiritgan ma'lumot** |

> ## 🏆 **🇺🇿 BANK/TIBBIY LOYIHADA — PYDANTIC.** "Kredit summasi" **manfiy** bo'lib qolmasin.

---

## 4. ⭐ Superstep — parallellik

> **"Bir xil darajada gorizontal joylashgan tugunlar — bu SUPERSTEP. Superstep — grafning bitta 'tiki', unda bir necha tugun PARALLEL bajarilishi mumkin."**

```
superstep 1:        [A]
                   /   \
superstep 2:    [B]     [C]        ← IKKALASI parallel
                   \   /
superstep 3:        [D]
```

> ## ⚠️ **LEKIN: "BIR SUPERSTEPDA BO'LISH — BARCHASI BIR VAQTDA BAJARILADI DEGANI EMAS."**
>
> ## 🔑 **TUGUN FAQAT KIRISH STATE OLSA FAOLLASHADI** — buni **kiruvchi qirralar** hal qiladi.

```python
# Parallel tugunlar
graph.add_edge("A", "B")
graph.add_edge("A", "C")        # ⭐ B va C — bir supersteopda
graph.add_edge("B", "D")
graph.add_edge("C", "D")        # D ikkalasini KUTADI
```

> ## 💥💥 **PARALLEL TUGUNLAR BIR MAYDONNI YOZSA — REDUCER SHART:**
> ```python
> class State(TypedDict):
>     natijalar: Annotated[list, operator.add]    # ⭐ birlashtiradi
> ```
> **Usiz — `InvalidUpdateError`** *("At key 'natijalar': Can receive only one value per step")*.
>
> ## 💡 **BU — 46-MODULDAGI `add_messages` BILAN BIR XIL G'OYA.**

---

## 5. ⭐⭐ Tugun nima qaytaradi?

```python
def chatbot(state: State) -> State:
    response = chat.invoke(state["messages"])
    return State(messages=[response])          # ⭐ FAQAT o'zgargan qism
```

> ## 🔑 **TUGUN BUTUN STATE'NI EMAS, FAQAT O'ZGARISHNI QAYTARADI.**
>
> ```python
> return {"messages": [response]}              # ✅ summary TEGILMAYDI
> return {"messages": [response], "summary": ""}   # 💥 summary O'CHIRILADI
> ```
>
> ## 💥 **VA ENG MUHIMI — REDUCERSIZ MAYDON ALMASHTIRILADI:**
> ```
> reducer YO'Q  →  eski qiymat YANGISI bilan ALMASHADI
> reducer BOR   →  ⭐ eski va yangi BIRLASHTIRILADI
> ```
> ## 🏆 **BU — 2–4-DARSLARDAGI ASOSIY MUAMMO.**

---

## 6. 🇺🇿 O'z grafingizni loyihalash

```
① STATE'DA NIMA BO'LADI?
      messages · foydalanuvchi_id · til · bosqich · summa · ...

② QANDAY TUGUNLAR?
      har biri BITTA vazifa

③ QAYERDA QAROR BOR?
      shartli qirra

④ QAYERDA SIKL BOR?
      ⚠️ recursion_limit ni QO'LDA qo'ying

⑤ QAYSI MAYDONGA REDUCER KERAK?
      ⭐ ro'yxatlar deyarli DOIM
```

**🇺🇿 Misol — bank kredit yordamchisi:**

```python
class KreditState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]   # ⭐ reducer
    summa: int
    muddat_oy: int
    oylik_tolov: float
    bosqich: str
```

```
[START] → [salomlash] → [summa_sorash] → [muddat_sorash]
        → [hisoblash] → [tushuntirish] → [tasdiqlash]
                                              │
                            ha ───────────────┼─── yo'q
                             ↓                       ↓
                          [ariza]              [summa_sorash]  ⭐ SIKL
                             ↓
                          [END]
```

> ## 🔑 **`hisoblash` TUGUNI LLM ISHLATMASLIGI KERAK** — oylik to'lov **matematik** hisoblanadi. LLM **arifmetikada ishonchsiz**.
>
> ## 🏆 **QOIDA: HISOB-KITOBNI KODGA, TUSHUNTIRISHNI MODELGA BERING.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Grafning uchta komponenti qaysi?

**M2.** `START` va `END` — bu nima?

**M3.** State va sxema orasidagi farq?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Node** *(tugun)* · **Edge** *(qirra)* · **State** *(holat)*.

**M2.** ## **Oddiy satrlar:** `'__start__'` va `'__end__'`.

**M3.** ## **State — HAQIQIY ma'lumot**, ## **sxema — TUZILISH qoidalari**.

</details>

### 🟡 O'rta

**M4.** ⭐ `START` va `END` ni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from langgraph.graph import START, END

print("START:", repr(START), type(START).__name__)
print("END  :", repr(END), type(END).__name__)
print("satrmi?", isinstance(START, str) and isinstance(END, str))
print("teng  :", START == "__start__", END == "__end__")
```

```
START: '__start__' str
END  : '__end__' str
satrmi? True
teng  : True True
```

## 🔑 **SHUNING UCHUN `routing_function` `"__end__"` QAYTARADI** — bu **aynan `END`**.

</details>

**M5.** ⭐ Modelsiz uch tugunli graf quring.

<details>
<summary>✅ Yechim</summary>

```python
from typing_extensions import TypedDict
from langgraph.graph import START, END, StateGraph

class S(TypedDict):
    n: int
    qadamlar: list

def qosh(s: S) -> S:
    return {"n": s["n"] + 10, "qadamlar": s.get("qadamlar", []) + ["qosh"]}

def kopaytir(s: S) -> S:
    return {"n": s["n"] * 2, "qadamlar": s.get("qadamlar", []) + ["kopaytir"]}

def ayir(s: S) -> S:
    return {"n": s["n"] - 20, "qadamlar": s.get("qadamlar", []) + ["ayir"]}

g = StateGraph(S)
for nom, f in [("qosh", qosh), ("kopaytir", kopaytir), ("ayir", ayir)]:
    g.add_node(nom, f)
g.add_edge(START, "qosh")
g.add_edge("qosh", "kopaytir")
g.add_edge("kopaytir", "ayir")
g.add_edge("ayir", END)
gc = g.compile()

print(gc.invoke({"n": 6, "qadamlar": []}))
print(gc.get_graph().draw_ascii())
```

```
{'n': 12, 'qadamlar': ['qosh', 'kopaytir', 'ayir']}
```

## 💡 **`(6 + 10) × 2 − 20 = 12`** ✅

## ⚠️ **`qadamlar` DA REDUCER YO'Q** — shuning uchun har tugun **butun ro'yxatni** qaytardi.

</details>

**M6.** ⭐⭐ Parallel tugunlar va reducer.

<details>
<summary>✅ Yechim</summary>

```python
import operator
from typing import Annotated

# ── ① REDUCERSIZ — XATO ──
class SYoq(TypedDict):
    natijalar: list

def a(s): return {"natijalar": ["A dan"]}
def b(s): return {"natijalar": ["B dan"]}
def c(s): return {"natijalar": s["natijalar"]}

g = StateGraph(SYoq)
g.add_node("a", a); g.add_node("b", b); g.add_node("c", c)
g.add_edge(START, "a"); g.add_edge(START, "b")     # ⭐ PARALLEL
g.add_edge("a", "c"); g.add_edge("b", "c"); g.add_edge("c", END)
try:
    print(g.compile().invoke({"natijalar": []}))
except Exception as e:
    print("💥", type(e).__name__, ":", str(e)[:110])

# ── ② REDUCER BILAN ──
class SBor(TypedDict):
    natijalar: Annotated[list, operator.add]        # ⭐

g2 = StateGraph(SBor)
g2.add_node("a", a); g2.add_node("b", b); g2.add_node("c", c)
g2.add_edge(START, "a"); g2.add_edge(START, "b")
g2.add_edge("a", "c"); g2.add_edge("b", "c"); g2.add_edge("c", END)
print("✅", g2.compile().invoke({"natijalar": []}))
```

**Haqiqiy chiqish:**

```
💥 InvalidUpdateError : At key 'natijalar': Can receive only one value per step.
                        Use an Annotated key to handle multiple values.
✅ {'natijalar': ['A dan', 'B dan', 'A dan', 'B dan']}
```

## 💥 **BIRINCHISI `InvalidUpdateError` BERADI** — ikki tugun **bir maydonni** bir supersteopda yozdi. Xato xabari **yechimni ham aytadi**.

## ⚠️⚠️ **IKKINCHISIDA ESA — TAKRORLANISHGA E'TIBOR BERING:**
```
['A dan', 'B dan', 'A dan', 'B dan']
                   ↑ NIMA UCHUN?
```
`c` tuguni `{"natijalar": s["natijalar"]}` qaytardi, ya'ni **mavjud ro'yxatni**. Reducer esa uni **yana qo'shdi**.

## 🏆 **QOIDA: REDUCERLI MAYDONGA TUGUN FAQAT YANGI QISMNI QAYTARSIN.** Aks holda ma'lumot **ikkilanadi**.
```python
def c(s): return {}                    # ✅ hech narsa qo'shmaydi
def c(s): return {"natijalar": s["natijalar"]}   # 💥 IKKILANTIRADI
```

## 🔑 **VA 46-MODULDAGI `add_messages` HAM AYNAN SHUNDAY ISHLAYDI.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ `TypedDict` va Pydantic sxemalarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from pydantic import BaseModel, Field, ValidationError
from typing_extensions import TypedDict
import time

# ── TypedDict ──
class TD(TypedDict):
    summa: int
    muddat: int

# ── Pydantic ──
class PD(BaseModel):
    summa: int = Field(ge=0, le=1_000_000_000)
    muddat: int = Field(ge=1, le=60)


def hisobla_td(s: TD) -> TD:
    foiz = 0.24 / 12
    n = s["muddat"]
    tolov = s["summa"] * foiz / (1 - (1 + foiz) ** -n)
    return {"summa": s["summa"], "muddat": n, "oylik": round(tolov)}


def hisobla_pd(s: PD) -> dict:
    foiz = 0.24 / 12
    n = s.muddat
    tolov = s.summa * foiz / (1 - (1 + foiz) ** -n)
    return {"oylik": round(tolov)}


print("── TypedDict: NOTO'G'RI ma'lumot ──")
yomon = TD(summa=-1_000_000, muddat=999)         # 💥 xato YO'Q
print("  qabul qilindi:", yomon)
print("  natija       :", hisobla_td(yomon), "  ← 💥 MA'NOSIZ")

print("\n── Pydantic: NOTO'G'RI ma'lumot ──")
try:
    PD(summa=-1_000_000, muddat=999)
except ValidationError as e:
    print(f"  ✅ {len(e.errors())} ta xato USHLANDI:")
    for x in e.errors():
        print(f"     {x['loc'][0]}: {x['msg']}")

print("\n── tezlik ──")
t0 = time.perf_counter()
for _ in range(100_000):
    TD(summa=1_000_000, muddat=24)
td_s = time.perf_counter() - t0

t0 = time.perf_counter()
for _ in range(100_000):
    PD(summa=1_000_000, muddat=24)
pd_s = time.perf_counter() - t0

print(f"  TypedDict: {td_s:.3f}s")
print(f"  Pydantic : {pd_s:.3f}s  ({pd_s/td_s:.1f}× sekinroq)")
print("\n🏆 QAROR:")
print("   ichki ma'lumot          →  TypedDict (tez)")
print("   FOYDALANUVCHI ma'lumoti →  ⭐ Pydantic (tekshiruv)")
```

## 💥 **`TypedDict` MANFIY SUMMANI QABUL QILDI VA MA'NOSIZ NATIJA BERDI.**

## 🇺🇿 **BANK VA TIBBIY LOYIHALARDA — PYDANTIC.** Tezlik farqi **ahamiyatsiz**, xato **qimmat**.

</details>

---

## 📌 Xulosa

```python
from langgraph.graph import START, END, StateGraph

class State(TypedDict):                       # ⭐ SXEMA
    messages: Sequence[BaseMessage]

def tugun(state: State) -> State:             # ⭐ NODE
    return State(messages=[...])              # FAQAT o'zgargan qism

graph.add_edge(START, "tugun")                # ⭐ EDGE
```

```
START = '__start__'  ·  END = '__end__'   →  oddiy SATRLAR
State(...) → oddiy dict  →  💥 tekshiruv YO'Q  →  .get() ishlating
Tugun FAQAT o'zgarishni qaytaradi
Parallel tugunlar bir maydonni yozsa → ⭐ REDUCER SHART
```

> ## 🏆 **HAR TUGUN — BITTA VAZIFA.** Va **hisob-kitobni kodga, tushuntirishni modelga** bering.

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Importlar](02-Importing-Relevant-Classes.md)
