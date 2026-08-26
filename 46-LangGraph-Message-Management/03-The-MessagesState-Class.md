# 3-dars. `MessagesState` sinfi ⭐

## 🎬 Boshlashdan oldin

> **"AI ilovalar uchun eng ko'p uchraydigan konfiguratsiya — `messages` deb nomlangan kalit, `Sequence` tipida, chat xabarlarini saqlaydi va har yangilanishda ularni QO'SHADI. Shuning uchun LangGraph tayyor sinf taklif qiladi."**

---

## 1. Tayyor sinf

```python
from langgraph.graph import MessagesState

print("annotatsiyalar:", MessagesState.__annotations__)
```

```
{'messages': ForwardRef("Annotated[list[AnyMessage], add_messages]", ...)}
```

> ## 🔑 **YA'NI BU — AYNAN SHU:**
> ```python
> class MessagesState(TypedDict):
>     messages: Annotated[list[AnyMessage], add_messages]
> ```
>
> ## 💡 **`AnyMessage` — `BaseMessage` NING QULAY NOMI** *(Human, AI, System, Tool — hammasi)*.
>
> ## ⚠️ **VA E'TIBOR BERING — `list`, `Sequence` EMAS.** Kurs `Sequence` ishlatgan edi; ikkalasi ham **ishlaydi**.

### Ishlatish

```python
def ask_question(state: MessagesState) -> MessagesState:
    ...
    return MessagesState(messages=[AIMessage(question), HumanMessage(input())])

graph = StateGraph(MessagesState)          # ⭐ o'z State sinfimiz KERAK EMAS
```

> ## 🏆 **UCH SATR KOD TEJALDI** va **reducer'ni unutish xavfi YO'Q**.

---

## 2. ⭐⭐ Meros — qo'shimcha maydonlar

```python
class State(MessagesState):
    summary: str
```

```python
print("annotatsiyalar:", list(State.__annotations__))
```

```
['messages', 'summary']
```

> ## 🔑 **`messages` — REDUCERLI** *(merosdan)*. **`summary` — reducersiz** *(almashtiriladi)*.
>
> ## 💡 **VA BU — TO'G'RI:** xulosa **to'planmaydi**, u har safar **yangilanadi**.

### 💥 `.get()` — kursning muhim eslatmasi

```python
s = State(messages=[HumanMessage("a")])
print("summary bormi?:", "summary" in s)

try:
    s["summary"]
except KeyError as e:
    print("💥 KeyError:", e)

print(".get():", repr(s.get("summary", "")))
```

```
summary bormi?: False
💥 KeyError: 'summary'
.get(): ''
```

> ## 💥💥 **`TypedDict` DA E'LON QILISH — KALITNI YARATMAYDI.**
>
> ## 🏆 **DOIM `.get(kalit, standart)` ISHLATING.** Kursning tanlovi ham **to'g'ri**:
> ```python
> state.get("summary", "")
> #                    ↑ bo'sh satr — chunki u bool() da False
> ```
> ```python
> if state.get("summary", ""):        # ⭐ "xulosa BORMI?" degan tekshiruv
>     ...
> ```

---

## 3. ⭐ Qachon `MessagesState`, qachon o'z sinfingiz?

| Vaziyat | Tanlov |
|---|---|
| Faqat xabarlar | ## ⭐ `MessagesState` |
| Xabarlar + qo'shimcha maydon | ## ⭐⭐ `class State(MessagesState)` |
| `messages` boshqacha nomlansin | ## O'z `TypedDict` |
| Boshqa reducer kerak | ## O'z `TypedDict` |
| Pydantic tekshiruvi kerak | ## `BaseModel` |

> ## 🔑 **KURSNING SO'ZLARI TO'G'RI:** *"kalit `messages` deb nomlanishi SHART EMAS, tipi ham chat xabarlari bo'lishi shart emas, reducer ham qo'shish bo'lishi shart emas"*.
>
> ## 💡 **`MessagesState` — QULAYLIK, MAJBURIYAT EMAS.**

---

## 4. ⚠️ `MessagesState` ning cheklovi

```python
class State(MessagesState):
    messages: Annotated[list, oxirgi_n(5)]      # ⚠️ reducer'ni ALMASHTIRISHGA urinish
```

> ## ⚠️ **BU CHALKASHLIK KELTIRIB CHIQARADI.** Agar boshqa reducer kerak bo'lsa — `MessagesState` dan **meros olmang**, **o'z `TypedDict`** ingizni yozing:
> ```python
> class State(TypedDict):
>     messages: Annotated[list[AnyMessage], oxirgi_n(5)]
>     summary: str
> ```

---

## 5. 🇺🇿 Amaliy state dizayni

```python
from langgraph.graph import MessagesState
from typing import Annotated
import operator


class BankState(MessagesState):
    """🏦 Bank yordamchisining to'liq holati."""

    # ── suhbat ──
    summary: str                                  # xulosa (almashtiriladi)
    til: str                                      # "uz" / "ru" / "en"

    # ── foydalanuvchi ──
    foydalanuvchi_id: str
    bolim: str                                    # kredit / karta / depozit

    # ── ma'lumot yig'ish ──
    summa: int
    muddat_oy: int
    oylik_tolov: float

    # ── nazorat ──
    burilish: Annotated[int, operator.add]        # ⭐ o'zi sanaydi
    xatolar: Annotated[list, operator.add]        # ⭐ yig'iladi
```

> ## 🏆 **BEShTA GURUH — HAR BIRI O'Z MAQSADIGA EGA:**
> ```
> messages   →  ⭐ reducerli (merosdan)
> summary    →  almashtiriladi
> foydalanuvchi ma'lumoti  →  almashtiriladi
> burilish   →  ⭐ reducerli (o'zi sanaydi)
> xatolar    →  ⭐ reducerli (yig'iladi)
> ```
>
> ## 💥 **`burilish` UCHUN `operator.add` — MUHIM NAQSH.** Tugun `{"burilish": 1}` qaytaradi, **hisoblash kerak emas**:
> ```python
> return {"burilish": 1}                       # ✅ reducer qo'shadi
> return {"burilish": s["burilish"] + 1}       # ⚠️ reducersiz variant
> ```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `MessagesState` da nima bor?

**M2.** Undan meros olsa nima bo'ladi?

**M3.** Nima uchun `.get()` ishlatiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `messages: Annotated[list[AnyMessage], add_messages]` — **reducerli**.

**M2.** ## `messages` **reducerli qoladi**, yangi maydonlar **reducersiz** bo'ladi.

**M3.** ## `TypedDict` da e'lon qilish **kalitni yaratmaydi** → `KeyError`.

</details>

### 🟡 O'rta

**M4.** ⭐ `MessagesState` ni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from langgraph.graph import MessagesState

print("annotatsiyalar:", MessagesState.__annotations__)

class State(MessagesState):
    summary: str
    til: str

print("meros:", list(State.__annotations__))

s = State(messages=[HumanMessage("salom")])
print("kalitlar:", list(s))
for k in ["messages", "summary", "til"]:
    print(f"  {k:10s} bormi? {k in s}  ·  .get() → {s.get(k, '(yo‘q)')!r:20.20}")
```

## 💥 **`summary` VA `til` — E'LON QILINGAN, LEKIN LUG'ATDA YO'Q.**

</details>

**M5.** ⭐ Grafni `MessagesState` bilan qayta yozing.

<details>
<summary>✅ Yechim</summary>

```python
JAVOBLAR = iter(["yes", "no"])

def ask(s: MessagesState) -> MessagesState:
    print(f"  → ask ({len(s['messages'])} xabar)")
    return MessagesState(messages=[AIMessage("Savolingiz?"),
                                   HumanMessage("Kredit foizi?")])

def bot(s: MessagesState) -> MessagesState:
    print(f"  → bot ({len(s['messages'])} xabar)")
    return MessagesState(messages=[chat.invoke(s["messages"])])

def yana(s: MessagesState) -> MessagesState:
    j = next(JAVOBLAR, "no")
    print("  → yana →", j)
    return MessagesState(messages=[AIMessage("Yana?"), HumanMessage(j)])

def yol(s: MessagesState) -> Literal["ask", "__end__"]:
    return "ask" if s["messages"][-1].content == "yes" else "__end__"

g = StateGraph(MessagesState)               # ⭐ o'z sinf KERAK EMAS
g.add_node("ask", ask); g.add_node("bot", bot); g.add_node("yana", yana)
g.add_edge(START, "ask"); g.add_edge("ask", "bot"); g.add_edge("bot", "yana")
g.add_conditional_edges("yana", yol)

o = g.compile().invoke(MessagesState(messages=[]), {"recursion_limit": 30})
print(f"\n✅ {len(o['messages'])} xabar")
```

</details>

**M6.** ⭐⭐ Meros bilan qo'shimcha maydon qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
import operator

class S(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]

def ask(s: S) -> S:
    return {"messages": [AIMessage("Savol?"), HumanMessage("javob")],
            "burilish": 1}                     # ⭐ hisoblash KERAK EMAS

def bot(s: S) -> S:
    xul = s.get("summary", "")                 # ⭐ .get()
    kirish = ([SystemMessage(f"Xulosa: {xul}")] if xul else []) \
        + list(s["messages"])
    return {"messages": [chat.invoke(kirish)],
            "summary": f"{s.get('burilish', 0)} burilish bo'ldi"}

def yol(s: S) -> Literal["ask", "__end__"]:
    return "__end__" if s.get("burilish", 0) >= 3 else "ask"

g = StateGraph(S)
g.add_node("ask", ask); g.add_node("bot", bot)
g.add_edge(START, "ask"); g.add_edge("ask", "bot")
g.add_conditional_edges("bot", yol)

o = g.compile().invoke(S(messages=[]), {"recursion_limit": 30})
print("burilish:", o["burilish"], "· xabarlar:", len(o["messages"]))
print("summary :", o.get("summary"))
```

## 🏆 **`burilish` — TUGUN `1` QAYTARDI, REDUCER SANADI.**

## ⚠️ **`summary` — REDUCERSIZ** → har safar **almashtirildi**. Bu **to'g'ri**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ State loyihalovchi vositasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
from typing import get_type_hints, get_origin, get_args, Annotated
import operator


class StateLoyiha:
    """State sxemasini tekshiradi va REDUCER TAVSIYALARINI beradi."""

    # maydon nomi naqshi → tavsiya etilgan reducer
    NAQSHLAR = {
        "messages": ("add_messages", "chat xabarlari — DOIM reducerli"),
        "xatolar": ("operator.add", "jurnal — yig'ilishi kerak"),
        "errors": ("operator.add", "jurnal — yig'ilishi kerak"),
        "burilish": ("operator.add", "hisoblagich — o'zi sanasin"),
        "urinishlar": ("operator.add", "hisoblagich"),
        "natijalar": ("operator.add", "parallel tugunlar yozishi mumkin"),
        "hujjatlar": ("operator.add", "RAG natijalar — yig'iladi"),
        "til": ("birinchi_qiymat", "bir marta aniqlanadi, o'zgarmasin"),
        "foydalanuvchi_id": ("birinchi_qiymat", "o'zgarmasligi kerak"),
    }

    def __init__(self, state_sinfi):
        self.S = state_sinfi
        try:
            self.hints = get_type_hints(state_sinfi, include_extras=True)
        except Exception:
            self.hints = getattr(state_sinfi, "__annotations__", {})

    def tahlil(self):
        q = []
        for nom, tip in self.hints.items():
            reducerli = get_origin(tip) is Annotated
            reducer = "—"
            if reducerli:
                args = get_args(tip)
                reducer = getattr(args[1], "__name__", str(args[1])[:24])
            asos = get_args(tip)[0] if reducerli else tip
            q.append({"maydon": nom, "tip": str(asos)[:32],
                      "reducer": reducer, "reducerli": reducerli})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        return d

    def tavsiyalar(self):
        print("\n── TAVSIYALAR ──")
        muammo = 0
        for nom, tip in self.hints.items():
            reducerli = get_origin(tip) is Annotated
            past = nom.lower()

            # ① naqsh bo'yicha
            for naqsh, (rec, sabab) in self.NAQSHLAR.items():
                if naqsh in past and not reducerli:
                    belgi = "💥" if naqsh == "messages" else "⚠️"
                    print(f"  {belgi} '{nom}' → Annotated[..., {rec}]")
                    print(f"      sabab: {sabab}")
                    muammo += 1
                    break
            else:
                # ② ro'yxat/to'plam — umumiy tekshiruv
                if not reducerli:
                    asos = str(tip)
                    if asos.startswith(("list", "typing.List", "set",
                                        "collections.abc.Sequence")):
                        print(f"  ⚠️ '{nom}' — ro'yxat/to'plam, reducer yo'q")
                        print(f"      parallel tugunlar yozsa: "
                              f"InvalidUpdateError")
                        muammo += 1

        # ③ ortiqcha reducer
        for nom, tip in self.hints.items():
            if get_origin(tip) is Annotated:
                asos = str(get_args(tip)[0])
                if asos in ("<class 'str'>", "<class 'float'>") and \
                        "add" in str(get_args(tip)[1]):
                    print(f"  ⚠️ '{nom}' — str/float ga operator.add "
                          f"qo'yilgan. Bu ULARNI QO'SHADI, ehtimol xato.")
                    muammo += 1

        if not muammo:
            print("  ✅ sxema yaxshi loyihalangan")
        return muammo

    def kod(self):
        print("\n── TAVSIYA ETILGAN SXEMA ──")
        q = ["class State(MessagesState):"]
        for nom, tip in self.hints.items():
            if nom == "messages":
                continue                        # merosdan keladi
            reducerli = get_origin(tip) is Annotated
            asos = get_args(tip)[0] if reducerli else tip
            asos_s = getattr(asos, "__name__", str(asos).replace("typing.", ""))
            rec = None
            for naqsh, (r, _) in self.NAQSHLAR.items():
                if naqsh in nom.lower():
                    rec = r
                    break
            if reducerli:
                args = get_args(tip)
                rec = getattr(args[1], "__name__", str(args[1])[:20])
            q.append(f"    {nom}: "
                     + (f"Annotated[{asos_s}, {rec}]" if rec else asos_s))
        print("\n".join(q))


# ── sinov ──
class YomonState(TypedDict):
    messages: Sequence[BaseMessage]            # 💥
    xatolar: list                              # ⚠️
    burilish: int                              # ⚠️
    til: str                                   # ⚠️
    summa: int                                 # ✅ oddiy

print("═══ YOMON SXEMA ═══")
sl = StateLoyiha(YomonState)
sl.tahlil()
sl.tavsiyalar()
sl.kod()

print("\n\n═══ YAXSHI SXEMA ═══")

class YaxshiState(MessagesState):
    summary: str
    xatolar: Annotated[list, operator.add]
    burilish: Annotated[int, operator.add]
    summa: int

sl2 = StateLoyiha(YaxshiState)
sl2.tahlil()
sl2.tavsiyalar()
```

## 🏆 **UCHTA TEKSHIRUV:**
```
① naqsh bo'yicha   →  'messages', 'xatolar', 'burilish', 'til' ...
② umumiy           →  ro'yxat/to'plam — reducer yo'qmi?
③ ORTIQCHA reducer →  str ga operator.add — ehtimol XATO
```

## 💥 **③ — KAM UCHRAYDIGAN, LEKIN CHALKASH XATO:** `summary: Annotated[str, operator.add]` xulosalarni **birlashtiradi** *(`"eski" + "yangi"`)*, siz esa **almashtirishni** kutgansiz.

</details>

---

## 📌 Xulosa

```python
from langgraph.graph import MessagesState

# ⭐ Faqat xabarlar
graph = StateGraph(MessagesState)

# ⭐⭐ Xabarlar + qo'shimcha
class State(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]

state.get("summary", "")           # ⭐ DOIM .get()
```

```
MessagesState = {'messages': Annotated[list[AnyMessage], add_messages]}
meros → messages REDUCERLI qoladi, yangi maydonlar reducersiz

💥 TypedDict'da e'lon qilish KALITNI YARATMAYDI → KeyError
✅ .get(kalit, "") — bo'sh satr bool()'da False, "bormi?" tekshiruvi uchun ideal
```

---

⬅️ [2-dars. Reducerlar amalda](02-Reducer-Functions-in-Action.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. RemoveMessage](04-The-RemoveMessage-Class.md)
