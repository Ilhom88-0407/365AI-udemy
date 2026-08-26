# 📝 45-modul mashqlari

> **30 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ.**

## ⚙️ Tayyorgarlik

```bash
pip install langgraph langchain-core grandalf pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, operator
from typing import Literal, Annotated, get_type_hints, get_origin, get_args
from typing_extensions import TypedDict
from collections.abc import Sequence
import pandas as pd

from langgraph.graph import START, END, StateGraph, add_messages, MessagesState
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage, RemoveMessage)
from langchain_core.runnables import Runnable
from langchain_core.language_models.fake_chat_models import FakeListChatModel

chat = FakeListChatModel(responses=[
    "Piet Hein (1905-1996) was a Danish polymath known for his grooks.",
    "He was born in Copenhagen, Denmark.",
    "Uchinchi javob.", "To'rtinchi javob."] * 40)
```

---

# 🟢 OSON *(1–10)*

**M1.** Grafning uchta komponenti?

**M2.** `START` va `END` qanday obyektlar?

**M3.** State va sxema orasidagi farq?

**M4.** Tugun nima qaytaradi?

**M5.** `compile()` nima qaytaradi?

**M6.** `graph` Runnable mi?

**M7.** `add_conditional_edges` ning ikki majburiy parametri?

**M8.** Rekursiya chegarasi standart holda qancha?

**M9.** `Literal` nima uchun kerak?

**M10.** `input()` ning muammosi nima?

<details>
<summary>✅ Javoblar M1–M10</summary>

**M1.** ## **Node** · **Edge** · **State**.

**M2.** ## **Oddiy satrlar** — `'__start__'` va `'__end__'`.

**M3.** ## **State — HAQIQIY ma'lumot**, ## **sxema — tuzilish qoidalari**.

**M4.** ## **Faqat o'zgargan qism** — butun state emas.

**M5.** ## `CompiledStateGraph` — **Runnable**.

**M6.** ## ❌ **Yo'q** — faqat `graph_compiled`.

**M7.** ## `source` va `path`.

**M8.** ## **10 007** *(o'lchandi)* — sikl **~5000 marta** aylanadi.

**M9.** ## Tip ko'rsatmasi **va** ## ⭐ **vizualizatsiya** uchun.

**M10.** ## **Jarayonni bloklaydi** — veb, bot, testda **ishlamaydi**.

</details>

---

# 🟡 O'RTA *(11–23)*

**M11.** ⭐ `START` va `END` ni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
print("START:", repr(START), type(START).__name__)
print("END  :", repr(END), type(END).__name__)
print("teng :", START == "__start__", END == "__end__")
```

</details>

**M12.** ⭐ Modelsiz uch tugunli graf.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    n: int
    qadamlar: list

def qosh(s): return {"n": s["n"] + 10,
                     "qadamlar": s.get("qadamlar", []) + ["qosh"]}
def kop(s):  return {"n": s["n"] * 2,
                     "qadamlar": s.get("qadamlar", []) + ["kop"]}
def ayir(s): return {"n": s["n"] - 20,
                     "qadamlar": s.get("qadamlar", []) + ["ayir"]}

g = StateGraph(S)
for nom, f in [("qosh", qosh), ("kop", kop), ("ayir", ayir)]:
    g.add_node(nom, f)
g.add_edge(START, "qosh"); g.add_edge("qosh", "kop")
g.add_edge("kop", "ayir"); g.add_edge("ayir", END)
gc = g.compile()

print(gc.invoke({"n": 6, "qadamlar": []}))     # (6+10)*2-20 = 12
print(gc.get_graph().draw_ascii())
```

</details>

**M13.** ⭐⭐ Reducersiz savolning yo'qolishi.

<details>
<summary>✅ Yechim</summary>

```python
def qur(reducer):
    if reducer:
        class S(TypedDict):
            messages: Annotated[Sequence[BaseMessage], add_messages]
    else:
        class S(TypedDict):
            messages: Sequence[BaseMessage]

    def bot(s): return {"messages": [chat.invoke(s["messages"])]}
    g = StateGraph(S)
    g.add_node("bot", bot)
    g.add_edge(START, "bot"); g.add_edge("bot", END)
    return g.compile(), S

Q = HumanMessage("Could you tell me a grook by Piet Hein?")
for reducer in [False, True]:
    gc, S = qur(reducer)
    o = gc.invoke(S(messages=[Q]))
    bor = any(m.type == "human" for m in o["messages"])
    print(f"{'✅' if bor else '💥'} reducer={reducer}: "
          f"{len(o['messages'])} xabar · savol {'BOR' if bor else 'YO‘Q'}")
```

## 💥 **`reducer=False` DA SAVOL YO'QOLADI — VA XATO CHIQMAYDI.**

</details>

**M14.** ⭐⭐ Parallel tugunlar va `InvalidUpdateError`.

<details>
<summary>✅ Yechim</summary>

```python
def a(s): return {"natijalar": ["A dan"]}
def b(s): return {"natijalar": ["B dan"]}
def c(s): return {}                            # ⭐ hech narsa qo'shmaydi

class SYoq(TypedDict):
    natijalar: list

class SBor(TypedDict):
    natijalar: Annotated[list, operator.add]

for nom, S in [("reducer YO'Q", SYoq), ("reducer BOR", SBor)]:
    g = StateGraph(S)
    g.add_node("a", a); g.add_node("b", b); g.add_node("c", c)
    g.add_edge(START, "a"); g.add_edge(START, "b")
    g.add_edge("a", "c"); g.add_edge("b", "c"); g.add_edge("c", END)
    try:
        print(f"✅ {nom}: {g.compile().invoke({'natijalar': []})}")
    except Exception as e:
        print(f"💥 {nom}: {type(e).__name__}: {str(e)[:80]}")
```

```
💥 reducer YO'Q: InvalidUpdateError: At key 'natijalar':
   Can receive only one value per step. Use an Annotated key...
✅ reducer BOR: {'natijalar': ['A dan', 'B dan']}
```

## ⚠️ **`c` HECH NARSA QAYTARMASLIGI MUHIM.** `{"natijalar": s["natijalar"]}` qaytarsa — reducer uni **yana qo'shadi** va ma'lumot **ikkilanadi**.

</details>

**M15.** ⭐ `compile()` xatolarini ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    n: int

# ① START qirrasi yo'q
g = StateGraph(S); g.add_node("a", lambda s: s)
try: g.compile()
except Exception as e: print("💥", type(e).__name__, ":", str(e)[:80])

# ② noma'lum tugun
g2 = StateGraph(S); g2.add_node("a", lambda s: s); g2.add_edge(START, "a")
g2.add_edge("a", "yoq")
try: g2.compile()
except Exception as e: print("💥", type(e).__name__, ":", str(e)[:80])
```

```
💥 ValueError : Graph must have an entrypoint: add at least one edge from START
💥 ValueError : Found edge ending at unknown node `yoq`
```

</details>

**M16.** ⭐ `stream_mode` variantlari.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

g = StateGraph(S)
g.add_node("a", lambda s: {"messages": [AIMessage("A dan")]})
g.add_node("b", lambda s: {"messages": [AIMessage("B dan")]})
g.add_edge(START, "a"); g.add_edge("a", "b"); g.add_edge("b", END)
gc = g.compile()
kirish = S(messages=[HumanMessage("boshlash")])

print("── updates ──")
for q in gc.stream(kirish):
    print("  ", {k: list(v) for k, v in q.items()})
print("── values ──")
for q in gc.stream(kirish, stream_mode="values"):
    print("  ", len(q["messages"]), [m.content[:12] for m in q["messages"]])
```

</details>

**M17.** ⭐ Grafni LCEL zanjiriga ulang.

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

zanjir = (RunnableLambda(lambda x: {"matn": x, "natija": ""})
          | gc
          | RunnableLambda(lambda s: f"[{s['natija']}]"))
print(zanjir.invoke("salom dunyo"))
print(zanjir.batch(["bir", "ikki", "uch"]))
```

## 🏆 **GRAF — LCEL ZANJIRINING BIR BO'G'INI.**

</details>

**M18.** ⭐⭐ `[0]` va `[-1]` farqi.

<details>
<summary>✅ Yechim</summary>

```python
XS = [HumanMessage("Piet Hein kim?"), AIMessage("Daniyalik olim."),
      AIMessage("Yana savolmi?"), HumanMessage("yes")]

print("[0] :", XS[0].content, "→",
      "ask_question" if XS[0].content == "yes" else "__end__", " 💥")
print("[-1]:", XS[-1].content, "→",
      "ask_question" if XS[-1].content == "yes" else "__end__", " ✅")
```

## 💥 **REDUCER QO'SHILGACH `[0]` DOIM BIRINCHI SAVOL** — sikl **ishlamaydi**.

</details>

**M19.** ⭐ Mustahkam routing.

<details>
<summary>✅ Yechim</summary>

```python
HA = {"yes", "y", "yeah", "ok", "okay", "sure",
      "ha", "xa", "albatta", "mayli", "bo'ladi"}
YOQ = {"no", "n", "nope", "yo'q", "yoq", "rahmat", "kerak emas"}

def routing(matn):
    j = str(matn).strip().lower().rstrip(".!?،,")
    if j in HA:  return "ask_question"
    if j in YOQ: return "__end__"
    return "__end__"                    # ⭐ noaniq → xavfsiz tomon

for x in ["yes", "YES", " yes ", "yes.", "Ha", "albatta",
          "no", "yo'q", "bilmadim", "", "asdf"]:
    y = routing(x)
    print(f"  {'🔁' if y == 'ask_question' else '🛑'} {x!r:12s} → {y}")
```

</details>

**M20.** ⭐⭐ Shartli graf va sikl.

<details>
<summary>✅ Yechim</summary>

```python
JAVOBLAR = iter(["yes", "yes", "no"])

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def ask(s):
    print("  → ask_question")
    return {"messages": [AIMessage("Savolingiz?"),
                         HumanMessage(f"Savol {len(s['messages'])}")]}
def bot(s):
    print("  → chatbot")
    return {"messages": [chat.invoke(s["messages"])]}
def yana(s):
    j = next(JAVOBLAR, "no")
    print("  → ask_another:", j)
    return {"messages": [AIMessage("Yana savolmi?"), HumanMessage(j)]}
def yol(s) -> Literal["ask_question", "__end__"]:
    return "ask_question" if s["messages"][-1].content == "yes" else "__end__"

g = StateGraph(S)
g.add_node("ask_question", ask); g.add_node("chatbot", bot)
g.add_node("ask_another_question", yana)
g.add_edge(START, "ask_question"); g.add_edge("ask_question", "chatbot")
g.add_edge("chatbot", "ask_another_question")
g.add_conditional_edges("ask_another_question", yol)
gc = g.compile()

print(gc.get_graph().draw_ascii())
r = gc.invoke(S(messages=[]), {"recursion_limit": 30})
print("yakuniy xabarlar:", len(r["messages"]))
```

</details>

**M21.** ⭐⭐ Rekursiya chegarasini sinang.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

g = StateGraph(S)
g.add_node("a", lambda s: {"messages": [HumanMessage("yes")]})
g.add_edge(START, "a")
g.add_conditional_edges("a", lambda s: "a")      # ⚠️ CHEKSIZ
gc = g.compile()

for chegara in [5, 20, 100]:
    t0 = time.perf_counter()
    try:
        gc.invoke(S(messages=[]), {"recursion_limit": chegara})
        print(f"  {chegara:4d}: ⚠️ to'xtamadi?!")
    except Exception as e:
        print(f"  {chegara:4d}: 💥 {type(e).__name__} "
              f"({(time.perf_counter()-t0)*1000:.0f} ms)")
print("\n⚠️ chegarasiz — standart 10 007!")
```

</details>

**M22.** ⭐⭐ `interrupt` bilan `input()` ni almashtiring.

<details>
<summary>✅ Yechim</summary>

```python
from langgraph.types import interrupt, Command

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def soraydi(s):
    javob = interrupt("Savolingiz nima?")
    return {"messages": [HumanMessage(javob)]}

def bot(s):
    return {"messages": [chat.invoke(s["messages"])]}

g = StateGraph(S)
g.add_node("soraydi", soraydi); g.add_node("bot", bot)
g.add_edge(START, "soraydi"); g.add_edge("soraydi", "bot"); g.add_edge("bot", END)
gi = g.compile(checkpointer=InMemorySaver())      # ⚠️ SHART

cfg = {"configurable": {"thread_id": "s1"}}
r = gi.invoke(S(messages=[]), cfg)
print("① to'xtadi:", r["__interrupt__"][0].value)
print("   next   :", gi.get_state(cfg).next)

r2 = gi.invoke(Command(resume="Kredit foizi qancha?"), cfg)
print("② davom etdi:")
for m in r2["messages"]:
    print(f"    {m.type:6s} {str(m.content)[:48]}")
```

## 🏆 **JARAYON BLOKLANMADI** — javob **keyinroq, boshqa jarayondan** kelishi mumkin.

</details>

**M23.** ⭐⭐ 🇺🇿 Modelsiz anketa grafi.

<details>
<summary>✅ Yechim</summary>

```python
class Anketa(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    javoblar: Annotated[list, operator.add]
    qadam: int

SAVOLLAR = ["Ismingiz?", "Yoshingiz?", "Telefon raqamingiz?"]
JAVOBLAR = iter(["Oybek", "17", "30", "+998901234567"])

def sora(s):
    q = s.get("qadam", 0)
    savol, javob = SAVOLLAR[q], next(JAVOBLAR, "")
    print(f"  ❓ {savol}  →  {javob}")
    return {"messages": [AIMessage(savol), HumanMessage(javob)],
            "javoblar": [javob]}

def tekshir(s):
    q, javob = s.get("qadam", 0), s["javoblar"][-1]
    ok = True
    if q == 1:
        ok = javob.isdigit() and 18 <= int(javob) <= 100
        if not ok: print("  💥 yosh 18–100 oralig'ida bo'lsin")
    elif q == 2:
        ok = javob.startswith("+998") and len(javob) == 13
        if not ok: print("  💥 telefon +998XXXXXXXXX bo'lsin")
    return {"qadam": q + 1 if ok else q}

def yol(s) -> Literal["sora", "__end__"]:
    return "__end__" if s["qadam"] >= len(SAVOLLAR) else "sora"

g = StateGraph(Anketa)
g.add_node("sora", sora); g.add_node("tekshir", tekshir)
g.add_edge(START, "sora"); g.add_edge("sora", "tekshir")
g.add_conditional_edges("tekshir", yol)
r = g.compile().invoke(Anketa(messages=[], javoblar=[], qadam=0),
                       {"recursion_limit": 30})
print("\n✅ javoblar:", r["javoblar"])
```

```
  ❓ Ismingiz?  →  Oybek
  ❓ Yoshingiz?  →  17
  💥 yosh 18–100 oralig'ida bo'lsin
  ❓ Yoshingiz?  →  30
  ❓ Telefon raqamingiz?  →  +998901234567
```

## 🏆 **NOTO'G'RI YOSH QABUL QILINMADI — SAVOL QAYTA BERILDI.** Va **LLM umuman ishlatilmadi**.

</details>

---

# 🔴 QIYIN *(24–30)*

**M24.** ⭐⭐⭐ Graf tekshiruvchisi *(compile() qilmaydigan tekshiruvlar)*.

<details>
<summary>✅ Yechim</summary>

```python
def grafni_tekshir(graph, state_sinfi, verbose=True):
    muammo, ogoh = [], []
    try:
        hints = get_type_hints(state_sinfi, include_extras=True)
    except Exception:
        hints = getattr(state_sinfi, "__annotations__", {})

    for nom, tip in hints.items():
        reducerli = get_origin(tip) is Annotated
        if nom == "messages" and not reducerli:
            muammo.append("💥 'messages' da REDUCER yo'q — savol YO'QOLADI")
        elif not reducerli:
            asos = get_args(tip)[0] if get_args(tip) else tip
            if str(asos).startswith(("list", "typing.List",
                                     "collections.abc.Sequence")):
                ogoh.append(f"⚠️ '{nom}' ro'yxat, reducer yo'q — "
                            f"parallel yozuvda InvalidUpdateError")

    tugunlar = set()
    try:
        gg = graph.compile().get_graph()
        tugunlar = set(gg.nodes) - {"__start__", "__end__"}
        kiruvchi = {e.target for e in gg.edges}
        chiquvchi = {e.source for e in gg.edges}
        for t in tugunlar:
            if t not in kiruvchi:
                muammo.append(f"💥 '{t}' ga HECH KIM kirmaydi")
            if t not in chiquvchi:
                muammo.append(f"💥 '{t}' dan CHIQISH yo'q")
        if "__end__" not in kiruvchi:
            muammo.append("💥 END ga yo'l YO'Q")
        shartli = [e for e in gg.edges if getattr(e, "conditional", False)]
        if shartli:
            ogoh.append(f"⭐ {len(shartli)} shartli qirra — recursion_limit "
                        f"ni QO'LDA qo'ying (standart 10 007)")
    except Exception as e:
        muammo.append(f"💥 compile: {type(e).__name__}: {str(e)[:60]}")

    if verbose:
        print(f"tugunlar: {len(tugunlar)} · state: {list(hints)}")
        for m in muammo: print(f"  {m}")
        for o in ogoh:   print(f"  {o}")
        if not muammo:   print("  ✅ jiddiy muammo topilmadi")
    return {"muammo": muammo, "ogoh": ogoh}


class Yomon(TypedDict):
    messages: Sequence[BaseMessage]           # 💥
    natijalar: list                           # ⚠️

g = StateGraph(Yomon)
g.add_node("a", lambda s: {"messages": [AIMessage("a")]})
g.add_node("b", lambda s: {"messages": [AIMessage("b")]})
g.add_edge(START, "a"); g.add_edge("a", END)  # 💥 b ga kirmaydi
print("── YOMON ──"); grafni_tekshir(g, Yomon)

class Yaxshi(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

g2 = StateGraph(Yaxshi)
g2.add_node("a", lambda s: {"messages": [AIMessage("a")]})
g2.add_edge(START, "a"); g2.add_edge("a", END)
print("\n── YAXSHI ──"); grafni_tekshir(g2, Yaxshi)
```

## 💥 **`get_origin(tip) is Annotated` — REDUCER BORLIGINI TEKSHIRISHNING YAGONA YO'LI.**

</details>

**M25.** ⭐⭐⭐ Tugun kuzatuvchisi.

<details>
<summary>✅ Yechim</summary>

```python
class TugunKuzatuvchi:
    def __init__(self):
        self.yozuvlar = []

    def orab(self, nom, f):
        def ichki(state):
            t0 = time.perf_counter()
            natija, xato = {}, None
            try:
                natija = f(state)
            except Exception as e:
                xato = f"{type(e).__name__}: {str(e)[:40]}"
                raise
            finally:
                self.yozuvlar.append({
                    "tugun": nom,
                    "ms": round((time.perf_counter() - t0) * 1000, 1),
                    "kirish_xabar": len(state.get("messages", [])),
                    "qaytardi": list(natija) if natija else [],
                    "xato": xato})
            return natija
        return ichki

    def qosh(self, graph, nom, f):
        graph.add_node(nom, self.orab(nom, f))
        return graph

    def hisobot(self):
        d = pd.DataFrame(self.yozuvlar)
        print(d.to_string(index=False))
        j = d.groupby("tugun").agg(chaqiruv=("ms", "size"),
                                   jami_ms=("ms", "sum")).round(1)
        print("\n" + j.to_string())
        eng, ulush = j.jami_ms.idxmax(), j.jami_ms.max() / j.jami_ms.sum()
        print(f"\n🐌 ENG SEKIN: '{eng}' — vaqtning {ulush:.0%} qismi")
        bosh = d[(d.qaytardi.apply(len) == 0) & d.xato.isna()]
        if len(bosh):
            print(f"⚠️ {len(bosh)} chaqiruv hech narsa qaytarmadi: "
                  f"{list(bosh.tugun.unique())}")
        return d


k = TugunKuzatuvchi()

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

g = StateGraph(S)
k.qosh(g, "sekin", lambda s: (time.sleep(0.05),
                              {"messages": [AIMessage("sekin")]})[1])
k.qosh(g, "tez", lambda s: {"messages": [AIMessage("tez")]})
k.qosh(g, "bosh", lambda s: {})
g.add_edge(START, "sekin"); g.add_edge("sekin", "tez")
g.add_edge("tez", "bosh"); g.add_edge("bosh", END)
g.compile().invoke(S(messages=[HumanMessage("test")]))
k.hisobot()
```

</details>

**M26.** ⭐⭐⭐ `TypedDict` va Pydantic sxemalarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from pydantic import BaseModel, Field, ValidationError

class TD(TypedDict):
    summa: int
    muddat: int

class PD(BaseModel):
    summa: int = Field(ge=0, le=1_000_000_000)
    muddat: int = Field(ge=1, le=60)

print("── TypedDict: NOTO'G'RI ma'lumot ──")
yomon = TD(summa=-1_000_000, muddat=999)
print("  qabul qilindi:", yomon, " ← 💥 tekshiruv YO'Q")

print("\n── Pydantic ──")
try:
    PD(summa=-1_000_000, muddat=999)
except ValidationError as e:
    print(f"  ✅ {len(e.errors())} xato ushlandi:",
          [x["loc"][0] for x in e.errors()])

t0 = time.perf_counter()
for _ in range(100_000): TD(summa=1_000_000, muddat=24)
td = time.perf_counter() - t0
t0 = time.perf_counter()
for _ in range(100_000): PD(summa=1_000_000, muddat=24)
pd_ = time.perf_counter() - t0
print(f"\nTypedDict {td:.3f}s · Pydantic {pd_:.3f}s ({pd_/td:.1f}× sekin)")
print("🇺🇿 bank/tibbiy loyihada → Pydantic. Tezlik farqi AHAMIYATSIZ.")
```

```
TypedDict 0.015s · Pydantic 0.070s (4.6× sekin)
```

</details>

**M27.** ⭐⭐⭐ Ko'p yo'nalishli marshrutlovchi.

<details>
<summary>✅ Yechim</summary>

```python
import re

class Marshrutlovchi:
    def __init__(self, kalitlar, chat=None, operator_tugun="operator"):
        self.kalitlar, self.chat = kalitlar, chat
        self.operator = operator_tugun
        self.jurnal = []

    def _kalit(self, matn):
        m = matn.lower()
        ballar = {b: sum(1 for k in ks if re.search(rf"\b{re.escape(k)}", m))
                  for b, ks in self.kalitlar.items()}
        ballar = {b: n for b, n in ballar.items() if n}
        if not ballar:
            return None, 0
        eng = max(ballar, key=ballar.get)
        if list(ballar.values()).count(ballar[eng]) > 1:
            return None, 0                    # ⚠️ tenglik → noaniq
        return eng, ballar[eng]

    def _llm(self, matn):
        if self.chat is None:
            return None
        r = self.chat.invoke([
            SystemMessage(f"Bo'limlar: {', '.join(self.kalitlar)}. "
                          f"Mos kelmasa '{self.operator}'. Faqat nomni yoz."),
            HumanMessage(matn)])
        j = str(r.content).strip().lower()
        return j if j in self.kalitlar else None

    def __call__(self, state):
        matn = str(state["messages"][-1].content)
        bolim, ball = self._kalit(matn)
        usul = "kalit"
        if bolim is None:
            bolim, usul = self._llm(matn), "llm"
        if bolim is None:
            bolim, usul = self.operator, "zaxira"
        self.jurnal.append({"savol": matn[:32], "bolim": bolim,
                            "usul": usul, "ball": ball})
        return bolim

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        op = (d.bolim == self.operator).mean()
        llm = (d.usul == "llm").mean()
        print(f"\noperatorga: {op:.0%} · LLM chaqirildi: {llm:.0%} 💰")
        if op > 0.3:
            print("⚠️ ko'p savol tushunilmayapti — kalit so'zlarni kengaytiring")
        if llm > 0.5:
            print("💰 LLM juda tez-tez — kalit so'z ro'yxatini to'ldiring")
        return d


m = Marshrutlovchi({
    "kredit":  ["kredit", "qarz", "foiz", "stavka", "ipoteka"],
    "karta":   ["karta", "plastik", "uzcard", "humo", "visa"],
    "depozit": ["depozit", "omonat", "jamg'arma", "vklad"],
})
for s in ["Kredit foizi qancha?", "Karta necha kunda?", "Depozit stavkasi?",
          "Ipoteka olsam bo'ladimi?", "Vklad ochmoqchiman",
          "Filial manzili?", "Salom"]:
    print(f"  {s:32s} → {m({'messages': [HumanMessage(s)]})}")
print(); m.hisobot()
```

## 💥 **"Depozit stavkasi?" — IKKALA KALIT HAM BOR** *(depozit, stavka)* → **noaniq** → operatorga. Bu **to'g'ri**: noto'g'ri bo'limga yuborishdan **yaxshiroq**.

</details>

**M28.** ⭐⭐⭐ Xavfsiz siklli graf quruvchisi.

<details>
<summary>✅ Yechim</summary>

```python
class XavfsizGraf:
    def __init__(self, S, maks_burilish=20):
        self.S, self.maks = S, maks_burilish
        self.graph = StateGraph(S)
        self.tugunlar, self.jurnal = [], []

    def tugun(self, nom, f):
        def orab(state):
            t0 = time.perf_counter()
            r = f(state)
            self.jurnal.append({"tugun": nom,
                                "ms": round((time.perf_counter()-t0)*1000, 1),
                                "burilish": state.get("burilish", 0)})
            return r
        self.graph.add_node(nom, orab)
        self.tugunlar.append(nom)
        return self

    def qirra(self, a, b):
        self.graph.add_edge(START if a == "START" else a,
                            END if b == "END" else b)
        return self

    def shartli(self, manba, f):
        maks = self.maks
        def himoyalangan(state):
            if state.get("burilish", 0) >= maks:
                print(f"  ⚠️ {maks} burilish — NAZORATLI to'xtash")
                return "__end__"
            return f(state)
        self.graph.add_conditional_edges(manba, himoyalangan)
        return self

    def tekshir(self):
        h = get_type_hints(self.S, include_extras=True)
        ok = True
        if "burilish" not in h:
            print("💥 state'da 'burilish' YO'Q — chegara ishlamaydi"); ok = False
        if "messages" in h and get_origin(h["messages"]) is not Annotated:
            print("💥 'messages' da reducer yo'q"); ok = False
        return ok

    def ishga_tushir(self, kirish, recursion_limit=None):
        self.tekshir()
        rl = recursion_limit or self.maks * max(2, len(self.tugunlar))
        print(f"🛡️ recursion_limit={rl} · maks_burilish={self.maks}")
        try:
            r = self.graph.compile().invoke(kirish, {"recursion_limit": rl})
            print("✅ yakunlandi")
            return r
        except Exception as e:
            print(f"💥 {type(e).__name__}: {str(e)[:90]}")
            return None
        finally:
            if self.jurnal:
                d = pd.DataFrame(self.jurnal)
                print(d.groupby("tugun").agg(
                    chaqiruv=("ms", "size"), jami_ms=("ms", "sum")).to_string())


class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    burilish: int

xg = (XavfsizGraf(S, maks_burilish=5)
      .tugun("ask", lambda s: {"messages": [HumanMessage("savol")],
                               "burilish": s.get("burilish", 0) + 1})
      .tugun("bot", lambda s: {"messages": [chat.invoke(s["messages"])]})
      .qirra("START", "ask").qirra("ask", "bot")
      .shartli("bot", lambda s: "ask"))       # ⚠️ CHEKSIZ

r = xg.ishga_tushir(S(messages=[], burilish=0))
print("xabarlar:", len(r["messages"]) if r else "—")
```

## 🏆 **`yol` DOIM `"ask"` QAYTARDI — CHEKSIZ SIKL. LEKIN GRAF NORMAL YAKUNLANDI.**

</details>

**M29.** ⭐⭐⭐ Parallel marshrutlash *(routing ro'yxat qaytaradi)*.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    savol: str
    natijalar: Annotated[list, operator.add]

def hujjat(s):
    time.sleep(0.03)
    return {"natijalar": [("hujjat", "3 ta bo'lak topildi")]}

def tarix(s):
    time.sleep(0.03)
    return {"natijalar": [("tarix", "oldingi 2 murojaat")]}

def profil(s):
    time.sleep(0.03)
    return {"natijalar": [("profil", "VIP mijoz")]}

def yigish(s):
    return {"natijalar": []}

def marshrut(s) -> list[str]:
    """⭐ RO'YXAT qaytaradi — hammasi PARALLEL ishlaydi."""
    kerak = ["hujjat"]
    if "oldingi" in s["savol"].lower():
        kerak.append("tarix")
    if "chegirma" in s["savol"].lower():
        kerak.append("profil")
    return kerak

g = StateGraph(S)
for nom, f in [("hujjat", hujjat), ("tarix", tarix),
               ("profil", profil), ("yigish", yigish)]:
    g.add_node(nom, f)
g.add_conditional_edges(START, marshrut)
for n in ["hujjat", "tarix", "profil"]:
    g.add_edge(n, "yigish")
g.add_edge("yigish", END)
gc = g.compile()

for savol in ["Kredit foizi qancha?",
              "Oldingi murojaatim va chegirma bormi?"]:
    t0 = time.perf_counter()
    r = gc.invoke({"savol": savol, "natijalar": []})
    print(f"\n{savol}")
    print(f"  {(time.perf_counter()-t0)*1000:.0f} ms · "
          f"{len(r['natijalar'])} manba")
    for m, x in r["natijalar"]:
        print(f"    {m}: {x}")
```

**Haqiqiy chiqish:**

```
Kredit foizi qancha?
  34 ms · 1 manba · [('hujjat', "3 ta bo'lak topildi")]

Oldingi murojaatim va chegirma bormi?
  33 ms · 3 manba · [('hujjat', ...), ('profil', 'VIP mijoz'), ('tarix', ...)]
```

## 🏆 **UCHTA TUGUN 90 ms EMAS, 33 ms DA ISHLADI** — chunki **PARALLEL** *(har biri `sleep(0.03)`)*.

## ⚠️ **`operator.add` REDUCERI SHART** — usiz `InvalidUpdateError`.

</details>

**M30.** ⭐⭐⭐ 🇺🇿 Ko'p qadamli kredit yordamchisi *(to'liq graf)*.

<details>
<summary>✅ Yechim</summary>

```python
class Kredit(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    summa: int
    muddat: int
    oylik: float
    jami: float
    qadam: int
    burilish: int

KIRISHLAR = iter([("summa", 50_000_000), ("muddat", 24), ("tasdiq", "no"),
                  ("summa", 30_000_000), ("muddat", 12), ("tasdiq", "yes")])
SAVOLLAR = {"summa": "Qancha kredit kerak?", "muddat": "Necha oyga?"}


def sora(s: Kredit) -> Kredit:
    maydon = ["summa", "muddat"][s.get("qadam", 0)]
    _, qiymat = next(KIRISHLAR)
    print(f"  ❓ {SAVOLLAR[maydon]}  →  {qiymat:,}")
    return {maydon: qiymat, "qadam": s.get("qadam", 0) + 1,
            "messages": [AIMessage(SAVOLLAR[maydon]),
                         HumanMessage(str(qiymat))]}


def hisobla(s: Kredit) -> Kredit:
    i, n = 0.24 / 12, s["muddat"]
    oylik = s["summa"] * i / (1 - (1 + i) ** -n)
    matn = (f"{s['summa']:,} so'm · {n} oy → "
            f"oylik {round(oylik):,} · jami {round(oylik*n):,} so'm")
    print(f"  💰 {matn}")
    return {"oylik": round(oylik), "jami": round(oylik * n),
            "messages": [AIMessage(matn)]}


def tasdiqla(s: Kredit) -> Kredit:
    _, javob = next(KIRISHLAR)
    print(f"  ❓ Rozimisiz? (yes/no)  →  {javob}")
    return {"burilish": s.get("burilish", 0) + 1,
            "messages": [AIMessage("Rozimisiz?"), HumanMessage(javob)]}


def qadam_yol(s: Kredit) -> Literal["sora", "hisobla"]:
    return "hisobla" if s.get("qadam", 0) >= 2 else "sora"


def tasdiq_yol(s: Kredit) -> Literal["sora", "__end__"]:
    if s.get("burilish", 0) >= 3:
        print("  ⚠️ 3 urinish chegarasi")
        return "__end__"
    javob = str(s["messages"][-1].content).strip().lower()
    if javob in {"yes", "ha", "y", "albatta"}:
        print("  ✅ ariza qabul qilindi")
        return "__end__"
    print("  🔁 qaytadan")
    return "sora"


g = StateGraph(Kredit)
g.add_node("sora", sora); g.add_node("hisobla", hisobla)
g.add_node("tasdiqla", tasdiqla)
g.add_edge(START, "sora")
g.add_conditional_edges("sora", qadam_yol)
g.add_edge("hisobla", "tasdiqla")
g.add_conditional_edges("tasdiqla", tasdiq_yol)
gc = g.compile()

print(gc.get_graph().draw_ascii())
r = gc.invoke(Kredit(messages=[], summa=0, muddat=0, oylik=0, jami=0,
                     qadam=0, burilish=0),
              {"recursion_limit": 40})
print(f"\n✅ yakuniy: {r['summa']:,} so'm · {r['muddat']} oy · "
      f"oylik {r['oylik']:,} so'm · {r['burilish']} urinish")
```

## ⚠️ **`qadam` NI `sora` DAN KEYIN QAYTA 0 GA TUSHIRISH KERAK** — aks holda ikkinchi aylanishda `sora` **ishga tushmaydi**. Buni **o'zingiz tuzating** — bu **haqiqiy siklli grafning eng ko'p uchraydigan xatosi**.

## 🏆 **UCHTA HIMOYA:** `burilish` hisoblagichi · `recursion_limit=40` · `qadam_yol` chegarasi.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
START = '__start__' · END = '__end__'          →  oddiy satrlar
graph Runnable? False · compiled? True         →  CompiledStateGraph

💥 reducer yo'q  →  kirish 1 human, chiqish 1 ai  →  SAVOL YO'QOLDI
✅ add_messages  →  3 xabar saqlandi

💥 parallel + reducersiz  →  InvalidUpdateError
💥 rekursiya chegarasi    →  10 007  (~5000 aylanish)
   → gpt-4o bilan ≈ $6.25 va ≈ 83 daqiqa

TypedDict 0.015s · Pydantic 0.070s  (4.6× sekin, lekin TEKSHIRADI)
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
