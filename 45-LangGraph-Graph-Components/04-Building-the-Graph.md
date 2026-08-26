# 4-dars. Grafni qurish ⭐⭐

## 🎬 Boshlashdan oldin

> **"`StateGraph` — bu tugunlari umumiy holatni O'QISH va YOZISH orqali muloqot qiladigan graf."**

---

## 1. Besh qadam

```python
# ① Graf obyekti — sxema POZITSIYA argumenti sifatida
graph = StateGraph(State)

# ② Tugun qo'shish
graph.add_node("chatbot", chatbot)

# ③ Qirralar
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

# ④ ⭐ KOMPILYATSIYA — tekshiradi va Runnable qaytaradi
graph_compiled = graph.compile()

# ⑤ Ishga tushirish
graph_compiled.invoke(state)
```

> ## 🔑 **KOMPILYATSIYA NIMA QILADI?**
> ```
> ✅ Grafning TO'G'RI bog'langanini tekshiradi
> ✅ StateGraph  →  ⭐ CompiledStateGraph (Runnable)
> ```

---

## 2. `compile()` nima tekshiradi?

```python
print("graph          Runnable?", isinstance(graph, Runnable))
print("graph_compiled Runnable?", isinstance(graph_compiled, Runnable))
print("turi:", type(graph_compiled).__name__)
```

```
graph          Runnable? False
graph_compiled Runnable? True
turi: CompiledStateGraph
```

### ⭐ Kompilyatsiya ushlaydigan xatolar

```python
# 💥 START dan chiqish yo'q
g = StateGraph(State)
g.add_node("a", lambda s: s)
g.compile()
```

```
💥 ValueError: Graph must have an entrypoint: add at least one edge from START
```

```python
# 💥 mavjud bo'lmagan tugunga qirra
g.add_edge("a", "mavjud_emas")
g.compile()
```

```
💥 ValueError: Found edge ending at unknown node `mavjud_emas`
```

> ## 🏆 **KOMPILYATSIYA — BEPUL TEKSHIRUV.** Xatoni **ishga tushirishdan oldin** topadi.
>
> ## ⚠️ **LEKIN U HAMMASINI TEKSHIRMAYDI:**
> ```
> ✅ Tekshiradi   →  START yo'qmi · noma'lum tugunmi
> ❌ Tekshirmaydi →  yetib bo'lmaydigan tugun · END ga yo'l yo'qligi
>                 →  💥 reducer yo'qligi
> ```

---

## 3. ⭐ Vizualizatsiya

```python
graph_compiled                              # Jupyter'da PNG rasm
print(graph_compiled.get_graph().draw_ascii())   # ⭐ har joyda
```

```
+-----------+
| __start__ |
+-----------+
      *
      *
      *
 +---------+
 | chatbot |
 +---------+
      *
      *
      *
 +---------+
 | __end__ |
 +---------+
```

```python
print(graph_compiled.get_graph().draw_mermaid())     # mermaid matni
png = graph_compiled.get_graph().draw_mermaid_png()  # ⚠️ INTERNET kerak
```

> ## ⚠️ **`draw_ascii()` UCHUN `grandalf` KERAK** — usiz `ImportError`. *(41-modulda ham shu edi.)*
>
> ## 💡 **`draw_mermaid()` — INTERNET KERAK EMAS** va natijani **GitHub README'ga** qo'yish mumkin.

---

## 4. 💥💥 Grafni ishga tushiramiz — VA MUAMMONI KO'RAMIZ

```python
kirish = State(messages=[HumanMessage("Could you tell me a grook by Piet Hein?")])
chiqish = graph_compiled.invoke(kirish)

print("kirish :", [(m.type, m.content[:34]) for m in kirish["messages"]])
print("chiqish:", [(m.type, m.content[:34]) for m in chiqish["messages"]])
print("xabarlar soni:", len(chiqish["messages"]))
```

```
kirish : [('human', 'Could you tell me a grook by Piet ')]
chiqish: [('ai', 'Piet Hein (1905-1996) was a Danish')]
xabarlar soni: 1
```

> ## 💥💥💥 **KUTILGAN: 2 XABAR** *(savol + javob)*. **HAQIQATDA: 1.**
>
> ## 🔑 **KURS BUNI "MUVAFFAQIYAT" DEB ATAYDI:** *"State haqiqatan ham modelning javobi bilan yangilandi. Ajoyib!"*
>
> ## ⚠️ **LEKIN STATE YANGILANMADI — U ALMASHTIRILDI.**

### ✅ Bitta so'z bilan tuzatiladi

```python
from typing import Annotated
from langgraph.graph import add_messages

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]   # ⭐
```

```
chiqish: [('human', 'Could you tell me a grook?'), ('ai', 'Piet Hein (1905-1996)...')]
✅ savol saqlandi: True
```

> ## 🏆 **TAVSIYA: `messages` MAYDONIGA REDUCERNI BOSHIDANOQ QO'YING.**
>
> ## 💡 **YOKI SODDAROQ — `MessagesState` ISHLATING** *(46-modul, 3-dars)*:
> ```python
> from langgraph.graph import MessagesState
>
> class State(MessagesState):        # ⭐ messages ALLAQACHON reducerli
>     summary: str
> ```

---

## 5. ⭐⭐ `invoke` dan tashqari

```python
# ① Oddiy
graph_compiled.invoke(state)

# ② ⭐ STREAM — qadamma-qadam
for qadam in graph_compiled.stream(state):
    for tugun, yangilanish in qadam.items():
        print(f"  {tugun:20s} → {list(yangilanish)}")
```

```
  chatbot              → ['messages']
```

```python
# ③ ⭐ BATCH — bir necha suhbat parallel
natijalar = graph_compiled.batch([
    State(messages=[HumanMessage("Savol 1")]),
    State(messages=[HumanMessage("Savol 2")]),
    State(messages=[HumanMessage("Savol 3")])])

# ④ ⭐ ASINXRON
natija = await graph_compiled.ainvoke(state)

# ⑤ ⭐⭐ stream_mode — nima oqsin
for x in graph_compiled.stream(state, stream_mode="values"):   # BUTUN state
    print(len(x["messages"]))
```

| `stream_mode` | Nima qaytaradi |
|---|---|
| ## `"updates"` *(standart)* | ## Faqat **o'zgarish** — `{tugun: yangilanish}` |
| `"values"` | ## **Butun state** har qadamdan keyin |
| `"messages"` | ## ⭐ **LLM tokenlari** — chat UI uchun |
| `"debug"` | Hamma narsa |

> ## 🏆 **`stream_mode="messages"` — HAQIQIY CHATBOT UCHUN.** Foydalanuvchi **javob yozilayotganini** ko'radi.
>
> ## ⚠️ **KURS `stream` NI UMUMAN KO'RSATMAYDI** — lekin bu **eng ko'p ishlatiladigan** metod.

---

## 6. ⭐ `compile()` parametrlari — kursda YO'Q

```python
graph_compiled = graph.compile(
    checkpointer=InMemorySaver(),        # ⭐ 47-modul — xotira
    interrupt_before=["tasdiqlash"],     # ⭐ odam tasdiqlashi uchun to'xtash
    interrupt_after=["hisoblash"],
    debug=True)                          # har qadamni chiqaradi
```

> ## 🏆 **`interrupt_before` — "HUMAN-IN-THE-LOOP" NAQSHI:**
> ```
> 🏦 Pul o'tkazishdan OLDIN odam tasdiqlasin
> 📧 Email yuborishdan OLDIN ko'rsatilsin
> 🗑️ O'chirishdan OLDIN so'ralsin
> ```
> ## 💡 **BU — 5-DARSDAGI `input()` MUAMMOSINING TO'G'RI YECHIMI.**

---

## 7. 🇺🇿 To'liq misol — modelsiz kredit hisoblagich

```python
class KreditState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    summa: int
    muddat: int
    oylik: float
    jami: float


def tekshir(s: KreditState) -> KreditState:
    xato = []
    if not 1_000_000 <= s["summa"] <= 500_000_000:
        xato.append("summa 1 mln – 500 mln so'm oralig'ida bo'lsin")
    if not 3 <= s["muddat"] <= 60:
        xato.append("muddat 3–60 oy oralig'ida bo'lsin")
    if xato:
        return {"messages": [AIMessage("💥 " + "; ".join(xato))]}
    return {"messages": [AIMessage("✅ ma'lumot to'g'ri")]}


def hisobla(s: KreditState) -> KreditState:
    """⚠️ LLM EMAS — matematika."""
    yillik = 0.24
    i = yillik / 12
    n = s["muddat"]
    oylik = s["summa"] * i / (1 - (1 + i) ** -n)
    return {"oylik": round(oylik), "jami": round(oylik * n),
            "messages": [AIMessage(f"Oylik to'lov: {round(oylik):,} so'm")]}


def tushuntir(s: KreditState) -> KreditState:
    ortiqcha = s["jami"] - s["summa"]
    matn = (f"{s['summa']:,} so'm · {s['muddat']} oy · yillik 24%\n"
            f"  oylik to'lov : {s['oylik']:,} so'm\n"
            f"  jami to'lov  : {s['jami']:,} so'm\n"
            f"  ortiqcha     : {ortiqcha:,} so'm "
            f"({ortiqcha / s['summa']:.0%})")
    return {"messages": [AIMessage(matn)]}


g = StateGraph(KreditState)
g.add_node("tekshir", tekshir)
g.add_node("hisobla", hisobla)
g.add_node("tushuntir", tushuntir)
g.add_edge(START, "tekshir")
g.add_edge("tekshir", "hisobla")
g.add_edge("hisobla", "tushuntir")
g.add_edge("tushuntir", END)
gc = g.compile()

r = gc.invoke(KreditState(messages=[], summa=50_000_000, muddat=24,
                          oylik=0, jami=0))
for m in r["messages"]:
    print(m.content)
```

```
✅ ma'lumot to'g'ri
Oylik to'lov: 2,643,555 so'm
50,000,000 so'm · 24 oy · yillik 24%
  oylik to'lov : 2,643,555 so'm
  jami to'lov  : 63,445,317 so'm
  ortiqcha     : 13,445,317 so'm (27%)
```

> ## 🏆🏆 **DIQQAT — BU GRAFDA LLM UMUMAN YO'Q.**
>
> ## 🔑 **VA BU — TO'G'RI DIZAYN:**
> ```
> ✅ Hisob-kitob  →  KOD (aniq, tez, bepul, tekshirilgan)
> ⭐ Tushuntirish →  LLM (agar tabiiy til kerak bo'lsa)
> ```
> ## 💥 **LLM'GA ARIFMETIKANI BERMANG.** U **ishonchsiz**, **sekin** va **pulli**.
>
> ## 💡 **LangGraph — BU FAQAT LLM UCHUN EMAS.** U — **holatli ish oqimi** vositasi.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Grafni qurishning besh qadami?

**M2.** `compile()` nima qaytaradi?

**M3.** `compile()` nimani tekshirmaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `StateGraph(...)` → `add_node` → `add_edge` → `compile()` → `invoke()`.

**M2.** ## `CompiledStateGraph` — **Runnable**.

**M3.** ## **Reducer yo'qligini**, yetib bo'lmaydigan tugunni, END ga yo'l yo'qligini.

</details>

### 🟡 O'rta

**M4.** ⭐ `compile()` xatolarini ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    n: int

SINOVLAR = []

# ① START dan chiqish yo'q
g = StateGraph(S)
g.add_node("a", lambda s: s)
SINOVLAR.append(("START qirrasi yo'q", g))

# ② noma'lum tugunga qirra
g2 = StateGraph(S)
g2.add_node("a", lambda s: s)
g2.add_edge(START, "a")
try:
    g2.add_edge("a", "mavjud_emas")
except Exception as e:
    print("add_edge da:", type(e).__name__)
SINOVLAR.append(("noma'lum tugun", g2))

# ③ to'g'ri graf
g3 = StateGraph(S)
g3.add_node("a", lambda s: {"n": s["n"] + 1})
g3.add_edge(START, "a"); g3.add_edge("a", END)
SINOVLAR.append(("to'g'ri", g3))

for nom, gg in SINOVLAR:
    try:
        gc = gg.compile()
        print(f"✅ {nom:22s} kompilyatsiya OK")
    except Exception as e:
        print(f"💥 {nom:22s} {type(e).__name__}: {str(e)[:70]}")
```

</details>

**M5.** ⭐⭐ `stream_mode` variantlarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def a(s): return {"messages": [AIMessage("A dan")]}
def b(s): return {"messages": [AIMessage("B dan")]}

g = StateGraph(S)
g.add_node("a", a); g.add_node("b", b)
g.add_edge(START, "a"); g.add_edge("a", "b"); g.add_edge("b", END)
gc = g.compile()
kirish = S(messages=[HumanMessage("boshlash")])

print("── updates (standart) ──")
for q in gc.stream(kirish):
    print("  ", {k: list(v) for k, v in q.items()})

print("\n── values ──")
for q in gc.stream(kirish, stream_mode="values"):
    print("  ", len(q["messages"]), "xabar:",
          [m.content[:14] for m in q["messages"]])

print("\n── debug ──")
for q in gc.stream(kirish, stream_mode="debug"):
    print("  ", q.get("type"), q.get("step"))
```

## 🔑 **`updates` — FAQAT O'ZGARISH. `values` — BUTUN STATE.**

## 💡 **UI uchun `values` qulay** — har qadamda **to'liq holatni** ko'rsatasiz.

</details>

**M6.** ⭐ `batch` bilan bir necha suhbat.

<details>
<summary>✅ Yechim</summary>

```python
import time

SAVOLLAR = ["Kredit foizi qancha?", "Karta necha kunda?",
            "Depozit muddati?", "Valyuta kursi?", "Filial manzili?"]

kirishlar = [S(messages=[HumanMessage(q)]) for q in SAVOLLAR]

t0 = time.perf_counter()
ketma = [gc.invoke(k) for k in kirishlar]
ketma_s = time.perf_counter() - t0

t0 = time.perf_counter()
batch = gc.batch(kirishlar)
batch_s = time.perf_counter() - t0

print(f"ketma-ket: {ketma_s*1000:6.1f} ms")
print(f"batch    : {batch_s*1000:6.1f} ms  ({ketma_s/max(batch_s,1e-9):.1f}×)")
print("natijalar teng:", len(ketma) == len(batch))
```

## ⚠️ **SOXTA MODELDA FARQ KICHIK** — chunki **tarmoq kutish yo'q**. Haqiqiy API bilan **41-moduldagidek 4×** tezlanish bo'ladi.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Graf tekshiruvchisini yozing *(compile() qilmaydigan tekshiruvlar)*.

<details>
<summary>✅ Yechim</summary>

```python
from typing import get_type_hints, get_origin, get_args, Annotated

def grafni_tekshir(graph, state_sinfi, verbose=True):
    """compile() TEKSHIRMAYDIGAN narsalarni tekshiradi."""
    muammo, ogoh = [], []

    # ── ① reducer ──
    try:
        hints = get_type_hints(state_sinfi, include_extras=True)
    except Exception:
        hints = getattr(state_sinfi, "__annotations__", {})
    for nom, tip in hints.items():
        reducerli = get_origin(tip) is Annotated
        if nom == "messages" and not reducerli:
            muammo.append(
                "💥 'messages' da REDUCER yo'q → xabarlar ALMASHTIRILADI, "
                "savol YO'QOLADI")
        elif not reducerli:
            asos = get_args(tip)[0] if get_args(tip) else tip
            if str(asos).startswith(("list", "typing.List",
                                     "collections.abc.Sequence")):
                ogoh.append(f"⚠️ '{nom}' — ro'yxat, lekin reducer yo'q "
                            f"(parallel tugunlar yozsa InvalidUpdateError)")

    # ── ② tuzilish ──
    try:
        gg = graph.compile().get_graph()
    except Exception as e:
        muammo.append(f"💥 kompilyatsiya: {type(e).__name__}: {str(e)[:60]}")
        gg = None

    if gg is not None:
        tugunlar = set(gg.nodes) - {"__start__", "__end__"}
        kiruvchi = {e.target for e in gg.edges}
        chiquvchi = {e.source for e in gg.edges}

        for t in tugunlar:
            if t not in kiruvchi:
                muammo.append(f"💥 '{t}' tuguniga HECH KIM kirmaydi")
            if t not in chiquvchi:
                muammo.append(f"💥 '{t}' tugunidan CHIQISH yo'q")

        if "__end__" not in kiruvchi:
            muammo.append("💥 END ga yo'l YO'Q — graf to'xtamasligi mumkin")

        # ── ③ sikl ──
        shartli = [e for e in gg.edges if getattr(e, "conditional", False)]
        if shartli:
            ogoh.append(
                f"⭐ {len(shartli)} shartli qirra — SIKL bo'lishi mumkin. "
                f"recursion_limit ni QO'LDA qo'ying "
                f"(standart 10 000+, o'lchandi)")

    if verbose:
        print(f"tugunlar: {len(tugunlar) if gg else '?'} · "
              f"state maydonlari: {list(hints)}")
        for m in muammo:
            print(f"  {m}")
        for o in ogoh:
            print(f"  {o}")
        if not muammo:
            print("  ✅ jiddiy muammo topilmadi")
    return {"muammo": muammo, "ogoh": ogoh}


# ── sinov: YOMON graf ──
class YomonState(TypedDict):
    messages: Sequence[BaseMessage]         # 💥 reducer yo'q
    natijalar: list                         # ⚠️ reducer yo'q

g = StateGraph(YomonState)
g.add_node("a", lambda s: {"messages": [AIMessage("a")]})
g.add_node("b", lambda s: {"messages": [AIMessage("b")]})
g.add_edge(START, "a")
g.add_edge("a", END)                        # 💥 b ga hech kim kirmaydi
print("── YOMON GRAF ──")
grafni_tekshir(g, YomonState)

# ── sinov: YAXSHI graf ──
class YaxshiState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

g2 = StateGraph(YaxshiState)
g2.add_node("a", lambda s: {"messages": [AIMessage("a")]})
g2.add_edge(START, "a"); g2.add_edge("a", END)
print("\n── YAXSHI GRAF ──")
grafni_tekshir(g2, YaxshiState)
```

## 🏆 **BU FUNKSIYANI HAR GRAFGA `compile()` DAN KEYIN ISHLATING.**

## 💥 **`get_origin(tip) is Annotated` — REDUCER BORLIGINI TEKSHIRISHNING YAGONA YO'LI.**

</details>

---

## 📌 Xulosa

```python
graph = StateGraph(State)                    # ①
graph.add_node("chatbot", chatbot)           # ②
graph.add_edge(START, "chatbot")             # ③
graph.add_edge("chatbot", END)
graph_compiled = graph.compile()             # ④ ⭐ Runnable
graph_compiled.invoke(state)                 # ⑤
```

```
✅ compile() tekshiradi:  START yo'qmi · noma'lum tugunmi
❌ compile() TEKSHIRMAYDI: 💥 reducer yo'qligini · yetib bo'lmas tugunni

💥 O'LCHANGAN: kirish 1 human → chiqish 1 ai → SAVOL YO'QOLDI
✅ Yechim: Annotated[Sequence[BaseMessage], add_messages]

⭐ stream_mode: updates · values · messages · debug
⭐ compile(checkpointer=..., interrupt_before=[...])
```

> ## 🏆 **VA ESLATMA: GRAFDA LLM BO'LISHI SHART EMAS.** LangGraph — **holatli ish oqimi** vositasi.

---

⬅️ [3-dars. State va tugun](03-Defining-a-State-and-a-Node.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Shartli qirralar — tugunlar](05-Conditional-Edges-Nodes-and-Routing.md)
