# 📝 46-modul mashqlari

> **28 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ.**

## ⚙️ Tayyorgarlik

```bash
pip install langgraph langchain-core tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, operator
from typing import Literal, Annotated, get_type_hints, get_origin, get_args
from typing_extensions import TypedDict
from collections.abc import Sequence
import tiktoken, pandas as pd

from langgraph.graph import START, END, StateGraph, add_messages, MessagesState
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage, RemoveMessage,
                                     trim_messages as lc_trim)
from langchain_core.language_models.fake_chat_models import FakeListChatModel

ENC = tiktoken.get_encoding("cl100k_base")
tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

chat = FakeListChatModel(responses=[
    "Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha.",
    "Daromad spravkasi va pasport nusxasi kerak.",
    "Foydalanuvchi kredit shartlari bilan qiziqmoqda."] * 60)
```

---

# 🟢 OSON *(1–9)*

**M1.** Reducer nima?

**M2.** `add_messages` ikki parametr oladi — qaysilar?

**M3.** Bir xil `id` bersangiz nima bo'ladi?

**M4.** `MessagesState` da nima bor?

**M5.** `RemoveMessage` ga nima kerak?

**M6.** `summary` da reducer bormi?

**M7.** Routing funksiyada `[0]` yoki `[-1]`?

**M8.** Nima uchun `.get()` ishlatiladi?

**M9.** `REMOVE_ALL_MESSAGES` ning qiymati?

<details>
<summary>✅ Javoblar M1–M9</summary>

**M1.** ## **Eski va yangi qiymatni BIRLASHTIRUVCHI funksiya** — `(eski, yangi) → yangi`.

**M2.** ## **Mavjud** ro'yxat va ## **qo'shiladigan** ro'yxat.

**M3.** ## **ALMASHTIRADI** — bu **xabarni tahrirlash** usuli.

**M4.** ## `messages: Annotated[list[AnyMessage], add_messages]`.

**M5.** ## Faqat `id` — matn **kerak emas**.

**M6.** ## ❌ **Yo'q** — xulosa **almashtiriladi**. Bu **to'g'ri**.

**M7.** ## `[-1]` — **oxirgi** xabar.

**M8.** ## `TypedDict` da e'lon **kalitni yaratmaydi** → `KeyError`.

**M9.** ## `'__remove_all__'`.

</details>

---

# 🟡 O'RTA *(10–21)*

**M10.** ⭐ `add_messages` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
r = add_messages([HumanMessage("Hi! I'm Oscar."), AIMessage("Hey, Oscar.")],
                 [HumanMessage("Summarize today's news?")])
for m in r:
    print(f"  {m.type:6s} id={m.id[:8]}  {m.content[:40]}")

print("\n── bir xil id ──")
r2 = add_messages([HumanMessage("asl", id="x1")],
                  [HumanMessage("YANGI", id="x1")])
print(len(r2), "xabar ·", r2[0].content)
```

</details>

**M11.** ⭐⭐ Reducersiz va reducerli grafni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def qur(S):
    g = StateGraph(S)
    g.add_node("n1", lambda s: {"messages": [AIMessage("birinchi")]})
    g.add_node("n2", lambda s: {"messages": [AIMessage("ikkinchi")]})
    g.add_edge(START, "n1"); g.add_edge("n1", "n2"); g.add_edge("n2", END)
    return g.compile()

class SYoq(TypedDict):
    messages: Sequence[BaseMessage]

class SBor(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

for nom, S in [("YO'Q", SYoq), ("BOR", SBor)]:
    o = qur(S).invoke({"messages": [HumanMessage("boshlang'ich")]})
    print(f"  Annotated {nom:4s} → {len(o['messages'])} xabar: "
          f"{[m.content[:12] for m in o['messages']]}")
```

```
  Annotated YO'Q  → 1 xabar: ['ikkinchi']
  Annotated BOR   → 3 xabar: ["boshlang'ich", 'birinchi', 'ikkinchi']
```

</details>

**M12.** ⭐⭐ O'z reduceringizni yozing.

<details>
<summary>✅ Yechim</summary>

```python
def oxirgi_n(n=3):
    def f(eski, yangi):
        return (list(eski or []) + list(yangi or []))[-n:]
    return f

class S(TypedDict):
    messages: Annotated[list, oxirgi_n(3)]
    urinishlar: Annotated[int, operator.add]

g = StateGraph(S)
for i in range(1, 4):
    g.add_node(f"n{i}", lambda s, i=i: {"messages": [AIMessage(f"xabar {i}")],
                                        "urinishlar": 1})
g.add_edge(START, "n1"); g.add_edge("n1", "n2")
g.add_edge("n2", "n3"); g.add_edge("n3", END)

o = g.compile().invoke({"messages": [HumanMessage("boshlash")], "urinishlar": 0})
print("xabarlar :", [m.content for m in o["messages"]])
print("urinishlar:", o["urinishlar"])
```

```
xabarlar : ['xabar 1', 'xabar 2', 'xabar 3']
urinishlar: 3
```

## 🏆 **4 QO'SHILDI, 3 QOLDI** — reducer **avtomatik qirqdi**.

</details>

**M13.** ⭐ `MessagesState` merosini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
class State(MessagesState):
    summary: str
    til: str

print("annotatsiyalar:", list(State.__annotations__))
s = State(messages=[HumanMessage("salom")])
print("kalitlar:", list(s))
for k in ["messages", "summary", "til"]:
    print(f"  {k:10s} bormi? {k in s}  ·  .get() → {s.get(k, '(yo‘q)')!r:16.16}")
```

## 💥 **E'LON QILINGAN, LEKIN LUG'ATDA YO'Q.**

</details>

**M14.** ⭐⭐ Kontekst o'sishining narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak bo'ladi?"
JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha. "
         "Daromad spravkasi va pasport nusxasi kerak.")

tarix, q, kirish = [], [], 0
for b in range(1, 21):
    tarix += [SAVOL, JAVOB]
    t = sum(len(ENC.encode(x)) for x in tarix)
    kirish += t
    if b in (1, 5, 10, 20):
        q.append({"burilish": b, "xabar": len(tarix), "kontekst": t,
                  "jami_kirish": kirish})
print(pd.DataFrame(q).to_string(index=False))
print(f"\n💰 gpt-4o-mini: ${kirish/1e6*0.15*1000*365:,.0f}/yil")
print(f"🇺🇿 o'zbekchada: ${kirish/1e6*0.15*1000*365*1.88:,.0f}/yil")
```

## 💥 **KONTEKST CHIZIQLI, JAMI NARX — KVADRATIK.**

</details>

**M15.** ⭐ `[0]` xatosini grafda ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def qur(indeks):
    J = iter(["yes", "yes", "no"])
    g = StateGraph(S)
    g.add_node("ask", lambda s: {"messages": [AIMessage("savol?"),
                                              HumanMessage("javob")]})
    g.add_node("yana", lambda s: {"messages": [AIMessage("yana?"),
                                               HumanMessage(next(J, "no"))]})
    g.add_edge(START, "ask"); g.add_edge("ask", "yana")
    g.add_conditional_edges(
        "yana",
        lambda s: "ask" if s["messages"][indeks].content == "yes" else "__end__")
    return g.compile()

for nom, i in [("[0]  noto'g'ri", 0), ("[-1] to'g'ri", -1)]:
    o = qur(i).invoke(S(messages=[]), {"recursion_limit": 30})
    print(f"  {nom}: {len(o['messages'])} xabar")
```

```
  [0]  noto'g'ri: 4 xabar    ← 💥 sikl aylanmadi
  [-1] to'g'ri : 12 xabar   ← ✅
```

</details>

**M16.** ⭐ `RemoveMessage` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
suhbat = add_messages([], [
    AIMessage("Savol?"), HumanMessage("Kredit foizi?"), AIMessage("24%."),
    AIMessage("Yana?"), HumanMessage("yes"),
    AIMessage("Savol?"), HumanMessage("Muddat?"), AIMessage("24 oy."),
    AIMessage("Yana?"), HumanMessage("yes")])

print("jami:", len(suhbat))
rm = [RemoveMessage(id=m.id) for m in suhbat[:-5]]
qolgan = add_messages(suhbat, rm)
print("qolgan:", len(qolgan))
for m in qolgan:
    print(f"  {m.type:6s} {m.content}")

try:
    add_messages(suhbat, [RemoveMessage(id="yoq")])
except Exception as e:
    print("\n💥", type(e).__name__, ":", str(e)[:80])
```

</details>

**M17.** ⭐ `REMOVE_ALL_MESSAGES` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
print("qiymat:", repr(REMOVE_ALL_MESSAGES))
r = add_messages(suhbat, [RemoveMessage(id=REMOVE_ALL_MESSAGES)])
print(f"{len(suhbat)} → {len(r)} xabar")
```

```
qiymat: '__remove_all__'
10 → 0 xabar
```

</details>

**M18.** ⭐⭐ Token bo'yicha trim yozing.

<details>
<summary>✅ Yechim</summary>

```python
UZUN = "Bu juda uzun xabar. " * 30
xs = add_messages([], [
    HumanMessage("qisqa 1"), AIMessage("qisqa 2"),
    HumanMessage(UZUN), AIMessage("qisqa 3"),
    HumanMessage("qisqa 4"), AIMessage("qisqa 5")])
print("jami:", len(xs), "xabar ·", tok(xs), "token")

son_q = add_messages(xs, [RemoveMessage(id=m.id) for m in xs[:-4]])
print(f"son (-4)   : {len(son_q)} xabar · {tok(son_q)} token")

def token_trim(xabarlar, maks=50):
    saqla, jami = set(), 0
    for m in reversed(xabarlar):
        t = len(ENC.encode(str(m.content)))
        if jami + t > maks:
            break
        saqla.add(m.id); jami += t
    return [RemoveMessage(id=m.id) for m in xabarlar if m.id not in saqla]

tok_q = add_messages(xs, token_trim(xs, 50))
print(f"token (50) : {len(tok_q)} xabar · {tok(tok_q)} token")
```

## 💥 **SON BO'YICHA — BITTA UZUN XABAR CHEGARANI BUZADI.**

</details>

**M19.** ⭐⭐ `SystemMessage` ning o'chishini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
xs = add_messages([], [
    SystemMessage("Siz bank yordamchisisiz. FAQAT O'ZBEK TILIDA javob bering."),
    HumanMessage("Salom"), AIMessage("Salom!"),
    HumanMessage("Kredit?"), AIMessage("24%."),
    HumanMessage("Muddat?"), AIMessage("24 oy."),
    HumanMessage("Hujjat?"), AIMessage("Pasport.")])
print("boshida:", [m.type for m in xs])

q1 = add_messages(xs, [RemoveMessage(id=m.id) for m in xs[:-5]])
print("[:-5]  :", [m.type for m in q1], "→ system",
      "BOR ✅" if any(m.type == "system" for m in q1) else "YO'Q 💥")

saqlanadi = lc_trim(xs, max_tokens=40, strategy="last", token_counter=tok,
                    include_system=True, start_on="human")
print("lc_trim:", [m.type for m in saqlanadi], "→ system",
      "BOR ✅" if any(m.type == "system" for m in saqlanadi) else "YO'Q 💥")
```

## 💥 **🇺🇿 SYSTEM O'CHSA — MODEL INGLIZCHAGA O'TIB KETADI.**

</details>

**M20.** ⭐⭐ Uch strategiyaning narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak bo'ladi?"
JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha. "
         "Daromad spravkasi va pasport nusxasi kerak.")
XULOSA = "Foydalanuvchi iste'mol krediti shartlari bilan qiziqmoqda."

q = []
for usul in ["qo'shish", "trim=5", "xulosalash"]:
    tarix, kirish, chaqiruv = [], 0, 0
    for b in range(20):
        tarix += [SAVOL, JAVOB]
        if usul == "trim=5":
            tarix = tarix[-5:]
        elif usul == "xulosalash":
            tarix = [XULOSA]
        kirish += sum(len(ENC.encode(x)) for x in tarix)
        chaqiruv += 2 if usul == "xulosalash" else 1
    q.append({"usul": usul, "chaqiruv": chaqiruv, "kirish_token": kirish})

d = pd.DataFrame(q)
d["yillik_$"] = (d.kirish_token / 1e6 * 0.15 * 1000 * 365).round()
d["yillik_uz_$"] = (d["yillik_$"] * 1.88).round()
print(d.to_string(index=False))
```

```
      usul  chaqiruv  kirish_token
  qo'shish        20         13440
    trim=5        20          3252
xulosalash        40           520
```

</details>

**M21.** ⭐⭐ Ogohlantiruvchi trim yozing.

<details>
<summary>✅ Yechim</summary>

```python
def qirqish_ogohlantirish(state: MessagesState) -> MessagesState:
    xs = state["messages"]
    if len(xs) <= 5:
        return {"messages": []}
    n = len(xs) - 5
    rm = [RemoveMessage(id=m.id) for m in xs[:-5]]
    ogoh = SystemMessage(
        f"[Eslatma: oldingi {n} ta xabar o'chirilgan. Foydalanuvchi eski "
        f"narsani so'rasa — bilmasligingizni ayting, TAXMIN QILMANG.]")
    print(f"  ✂️ {n} xabar o'chirildi + ogohlantirish")
    return {"messages": rm + [ogoh]}
```

## 🏆 **"BILMAYMAN" — YOLG'ON TO'QISHDAN YAXSHIROQ** *(42-modul, 18-dars)*.

</details>

---

# 🔴 QIYIN *(22–28)*

**M22.** ⭐⭐⭐ Reducer kutubxonasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class Reducerlar:
    @staticmethod
    def oxirgi_n(n):
        def f(eski, yangi):
            return (list(eski or []) + list(yangi or []))[-n:]
        return f

    @staticmethod
    def birinchi_qiymat(eski, yangi):
        return eski if eski not in (None, "", 0) else yangi

    @staticmethod
    def noyob_qoshish(eski, yangi):
        r = list(eski or [])
        for x in (yangi or []):
            if x not in r:
                r.append(x)
        return r

    @staticmethod
    def cheklangan_jurnal(n=20):
        def f(eski, yangi):
            return (list(eski or []) + list(yangi or []))[-n:]
        return f

    @staticmethod
    def lugat_yangilash(eski, yangi):
        r = dict(eski or {})
        r.update(yangi or {})
        return r


class BankState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    til: Annotated[str, Reducerlar.birinchi_qiymat]
    korilgan_bolimlar: Annotated[list, Reducerlar.noyob_qoshish]
    xatolar: Annotated[list, Reducerlar.cheklangan_jurnal(5)]
    urinishlar: Annotated[int, operator.add]
    profil: Annotated[dict, Reducerlar.lugat_yangilash]
    summa: int

g = StateGraph(BankState)
g.add_node("til", lambda s: {"til": "uz", "urinishlar": 1,
                             "profil": {"ism": "Oybek"}})
g.add_node("kredit", lambda s: {"korilgan_bolimlar": ["kredit"],
                                "urinishlar": 1, "til": "en",
                                "profil": {"yosh": 30}})
g.add_node("karta", lambda s: {"korilgan_bolimlar": ["karta", "kredit"],
                               "urinishlar": 1,
                               "xatolar": ["xato 1", "xato 2"]})
g.add_edge(START, "til"); g.add_edge("til", "kredit")
g.add_edge("kredit", "karta"); g.add_edge("karta", END)

o = g.compile().invoke(BankState(messages=[], til="", korilgan_bolimlar=[],
                                 xatolar=[], urinishlar=0, profil={}, summa=0))
for k, v in o.items():
    if k != "messages":
        print(f"  {k:20s} {v}")
```

```
  til                  uz          ← ⭐ "en" ga O'ZGARMADI
  korilgan_bolimlar    ['kredit', 'karta']   ← ⭐ takrorlanmadi
  xatolar              ['xato 1', 'xato 2']
  urinishlar           3           ← ⭐ o'zi sanadi
  profil               {'ism': 'Oybek', 'yosh': 30}   ← ⭐ birlashdi
  summa                0
```

</details>

**M23.** ⭐⭐⭐ State loyihalovchi vositasi.

<details>
<summary>✅ Yechim</summary>

```python
class StateLoyiha:
    NAQSHLAR = {
        "messages": ("add_messages", "chat xabarlari — DOIM reducerli"),
        "xatolar": ("operator.add", "jurnal — yig'ilishi kerak"),
        "burilish": ("operator.add", "hisoblagich — o'zi sanasin"),
        "urinishlar": ("operator.add", "hisoblagich"),
        "natijalar": ("operator.add", "parallel tugunlar yozishi mumkin"),
        "til": ("birinchi_qiymat", "bir marta aniqlanadi"),
        "foydalanuvchi_id": ("birinchi_qiymat", "o'zgarmasligi kerak"),
    }

    def __init__(self, S):
        self.S = S
        try:
            self.hints = get_type_hints(S, include_extras=True)
        except Exception:
            self.hints = getattr(S, "__annotations__", {})

    def tahlil(self):
        q = []
        for nom, tip in self.hints.items():
            reducerli = get_origin(tip) is Annotated
            rec = "—"
            if reducerli:
                rec = getattr(get_args(tip)[1], "__name__",
                              str(get_args(tip)[1])[:22])
            asos = get_args(tip)[0] if reducerli else tip
            q.append({"maydon": nom, "tip": str(asos)[:30], "reducer": rec})
        print(pd.DataFrame(q).to_string(index=False))

    def tavsiyalar(self):
        print("\n── TAVSIYALAR ──")
        n = 0
        for nom, tip in self.hints.items():
            if get_origin(tip) is Annotated:
                continue
            past = nom.lower()
            for naqsh, (rec, sabab) in self.NAQSHLAR.items():
                if naqsh in past:
                    belgi = "💥" if naqsh == "messages" else "⚠️"
                    print(f"  {belgi} '{nom}' → Annotated[..., {rec}]  ({sabab})")
                    n += 1
                    break
            else:
                if str(tip).startswith(("list", "typing.List", "set",
                                        "collections.abc.Sequence")):
                    print(f"  ⚠️ '{nom}' — ro'yxat, reducer yo'q "
                          f"→ parallel yozuvda InvalidUpdateError")
                    n += 1
        if not n:
            print("  ✅ sxema yaxshi loyihalangan")
        return n


class YomonState(TypedDict):
    messages: Sequence[BaseMessage]
    xatolar: list
    burilish: int
    til: str
    summa: int

print("═══ YOMON ═══")
sl = StateLoyiha(YomonState); sl.tahlil(); sl.tavsiyalar()

print("\n═══ YAXSHI ═══")

class YaxshiState(MessagesState):
    summary: str
    xatolar: Annotated[list, operator.add]
    burilish: Annotated[int, operator.add]
    summa: int

sl2 = StateLoyiha(YaxshiState); sl2.tahlil(); sl2.tavsiyalar()
```

</details>

**M24.** ⭐⭐⭐ Xabar boshqaruvchisi *(uch strategiya)*.

<details>
<summary>✅ Yechim</summary>

```python
class XabarBoshqaruv:
    def __init__(self, maks_token=200, strategiya="aqlli", juft=3, til="uz"):
        self.maks, self.strategiya, self.juft = maks_token, strategiya, juft
        self.koef = 1.88 if til == "uz" else 1.0
        self.jurnal = []

    def _son(self, xs):
        n = self.juft * 2
        return list(xs[:-n]) if len(xs) > n else []

    def _token(self, xs):
        saqla, jami = set(), 0
        for m in reversed(xs):
            t = len(ENC.encode(str(m.content)))
            if jami + t > self.maks:
                break
            saqla.add(m.id); jami += t
        return [m for m in xs if m.id not in saqla]

    def _aqlli(self, xs):
        try:
            s = lc_trim(xs, max_tokens=self.maks, strategy="last",
                        token_counter=tok, include_system=True,
                        start_on="human")
        except Exception:
            return self._token(xs)
        sid = {m.id for m in s}
        return [m for m in xs if m.id not in sid]

    def trim(self, state):
        xs = list(state["messages"])
        oldin_n, oldin_t = len(xs), tok(xs)
        if oldin_t <= self.maks:
            self.jurnal.append({"oldin_n": oldin_n, "oldin_tok": oldin_t,
                                "keyin_n": oldin_n, "keyin_tok": oldin_t,
                                "ochirildi": 0})
            return {"messages": []}

        f = {"son": self._son, "token": self._token, "aqlli": self._aqlli}
        ochiriladi = [m for m in f[self.strategiya](xs) if m.id]
        qolgan = [m for m in xs if m not in ochiriladi]

        if qolgan and qolgan[0].type == "ai":
            print("  ⚠️ birinchi xabar AI — juftlik BUZILGAN")
        if any(m.type == "system" for m in xs) and \
                not any(m.type == "system" for m in qolgan):
            print("  💥 SystemMessage O'CHIRILDI — 🇺🇿 model tilni unutadi!")

        self.jurnal.append({"oldin_n": oldin_n, "oldin_tok": oldin_t,
                            "keyin_n": len(qolgan), "keyin_tok": tok(qolgan),
                            "ochirildi": len(ochiriladi)})
        print(f"  ✂️ {oldin_n}→{len(qolgan)} xabar · "
              f"{oldin_t}→{tok(qolgan)} token")
        return {"messages": [RemoveMessage(id=m.id) for m in ochiriladi]}

    def hisobot(self, kunlik=1000):
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        tejaldi = (d.oldin_tok - d.keyin_tok).sum()
        print(f"\n💰 tejalgan: {tejaldi} token")
        print(f"   🇺🇿 ${tejaldi/1e6*0.15*kunlik*365*self.koef:,.0f}/yil")
        return d


UZUN = "Bu juda uzun xabar bo'lib, ko'p token yeydi. " * 20
XS = add_messages([], [
    SystemMessage("Siz bank yordamchisisiz. O'zbek tilida javob bering."),
    HumanMessage("Salom, men Oybek."), AIMessage("Salom Oybek!"),
    HumanMessage(UZUN), AIMessage("Tushundim."),
    HumanMessage("Kredit foizi?"), AIMessage("24% dan boshlanadi."),
    HumanMessage("Muddat?"), AIMessage("24 oygacha.")])

for strat in ["son", "token", "aqlli"]:
    print(f"\n═══ {strat} ═══")
    xb = XabarBoshqaruv(maks_token=60, strategiya=strat)
    r = xb.trim({"messages": XS})
    qolgan = add_messages(XS, r["messages"])
    print(f"  turlar: {[m.type for m in qolgan]}")
```

</details>

**M25.** ⭐⭐⭐ Kontekst kuzatuvchisi.

<details>
<summary>✅ Yechim</summary>

```python
class KontekstKuzatuvchi:
    NARX = {"gpt-4o-mini": (0.15, 0.60), "gpt-4o": (2.50, 10.00)}

    def __init__(self, chat, model="gpt-4o-mini", chegara=4000, til="uz"):
        self.chat, self.model, self.chegara = chat, model, chegara
        self.koef = 1.88 if til == "uz" else 1.0
        self.yozuvlar = []

    def invoke(self, xabarlar, **kw):
        t = tok(xabarlar)
        t0 = time.perf_counter()
        r = self.chat.invoke(xabarlar, **kw)
        ms = (time.perf_counter() - t0) * 1000
        ct = tok([r])
        nk, nc = self.NARX[self.model]
        self.yozuvlar.append({"chaqiruv": len(self.yozuvlar) + 1,
                              "xabar": len(xabarlar), "kirish_tok": t,
                              "chiqish_tok": ct,
                              "narx_$": round(t/1e6*nk + ct/1e6*nc, 6),
                              "ms": round(ms)})
        if t > self.chegara:
            print(f"  ⚠️ kontekst {t} token > {self.chegara} → trim kerak")
        return r

    def __getattr__(self, nom):
        return getattr(self.chat, nom)

    def hisobot(self, kunlik=1000):
        d = pd.DataFrame(self.yozuvlar)
        print(d.to_string(index=False))
        jami = d["narx_$"].sum()
        print(f"\n💰 1 suhbat ${jami:.6f} · "
              f"🇺🇿 yillik ${jami*kunlik*365*self.koef:,.0f}")
        osish = d.kirish_tok.iloc[-1] / max(1, d.kirish_tok.iloc[0])
        print(f"📈 kontekst {d.kirish_tok.iloc[0]} → {d.kirish_tok.iloc[-1]} "
              f"({osish:.1f}×)")
        if osish > 3:
            print("   💥 KESKIN O'SMOQDA — trim yoki xulosalash SHART")
        if len(d) >= 3 and (d.kirish_tok.diff().dropna() > 0).all():
            print("   📐 har chaqiruvda O'SMOQDA — KVADRATIK narx")
        return d


kk = KontekstKuzatuvchi(chat, chegara=200)

class S(MessagesState):
    pass

SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak bo'ladi?"
g = StateGraph(S)
g.add_node("ask", lambda s: {"messages": [AIMessage("Savolingiz?"),
                                          HumanMessage(SAVOL)]})
g.add_node("bot", lambda s: {"messages": [kk.invoke(list(s["messages"]))]})
g.add_edge(START, "ask"); g.add_edge("ask", "bot"); g.add_edge("bot", END)
gc = g.compile(checkpointer=InMemorySaver())

cfg = {"configurable": {"thread_id": "kuzatuv"}}
for _ in range(8):
    gc.invoke(S(messages=[]), cfg)
kk.hisobot()
```

## 🏆 **`__getattr__` — O'RAM NAQSHI.** `batch`, `stream` asl modelga o'tadi.

</details>

**M26.** ⭐⭐⭐ Trim sifat o'lchagichi.

<details>
<summary>✅ Yechim</summary>

```python
class TrimSifat:
    def __init__(self, maks_token=100, til="uz"):
        self.maks = maks_token
        self.koef = 1.88 if til == "uz" else 1.0

    def _son(self, xs, n=5): return list(xs[-n:])

    def _token(self, xs):
        saqla, jami = [], 0
        for m in reversed(xs):
            t = len(ENC.encode(str(m.content)))
            if jami + t > self.maks:
                break
            saqla.append(m); jami += t
        return list(reversed(saqla))

    def _aqlli(self, xs):
        try:
            return list(lc_trim(xs, max_tokens=self.maks, strategy="last",
                                token_counter=tok, include_system=True,
                                start_on="human"))
        except Exception:
            return self._token(xs)

    @staticmethod
    def _juftlik(xs):
        t = [m.type for m in xs if m.type in ("human", "ai")]
        for i in range(0, len(t) - 1, 2):
            if t[i] != "human" or t[i + 1] != "ai":
                return False
        return True

    def _baho(self, asl, q):
        return {"xabar": len(q), "token": tok(q),
                "oshdi": tok(q) > self.maks,
                "system_saqlandi": (any(m.type == "system" for m in q)
                                    if any(m.type == "system" for m in asl)
                                    else None),
                "juftlik": self._juftlik(q)}

    def taqqosla(self, xs, burilish=20, kunlik=1000):
        asl = tok(xs)
        q = [{"strategiya": "trim YO'Q", **self._baho(xs, xs)}]
        for nom, f in [("son (-5)", self._son), ("token", self._token),
                       ("aqlli", self._aqlli)]:
            q.append({"strategiya": nom, **self._baho(xs, f(xs))})
        d = pd.DataFrame(q)
        d["tejaldi_%"] = ((1 - d.token / asl) * 100).round(1)
        print(f"asl: {len(xs)} xabar · {asl} token · chegara {self.maks}\n")
        print(d.to_string(index=False))

        print(f"\n── 💰 🇺🇿 yillik ({kunlik}/kun × {burilish} burilish) ──")
        for _, r in d.iterrows():
            print(f"  {r.strategiya:12s} "
                  f"${r.token*burilish/1e6*0.15*kunlik*365*self.koef:9,.0f}")

        print()
        for _, r in d.iterrows():
            if r.strategiya == "trim YO'Q":
                continue
            if r.system_saqlandi is False:
                print(f"  💥 '{r.strategiya}': SystemMessage O'CHDI")
            if r.oshdi:
                print(f"  💥 '{r.strategiya}': chegaradan OSHDI")
            if not r.juftlik:
                print(f"  ⚠️ '{r.strategiya}': juftlik BUZILGAN")
        return d


UZUN = "Bu juda uzun tushuntirish bo'lib, ko'p token yeydi. " * 15
XS = add_messages([], [
    SystemMessage("Siz bank yordamchisisiz. FAQAT O'ZBEK TILIDA javob bering."),
    HumanMessage("Salom, men Oybek."), AIMessage("Salom Oybek!"),
    HumanMessage("Kredit shartlarini batafsil tushuntiring."), AIMessage(UZUN),
    HumanMessage("Foiz qancha?"), AIMessage("Yillik 24% dan boshlanadi."),
    HumanMessage("Muddat?"), AIMessage("24 oygacha."),
    HumanMessage("Hujjat?"), AIMessage("Pasport va daromad spravkasi.")])

TrimSifat(maks_token=100).taqqosla(XS)
```

## 🏆 **`son (-5)` ODATDA IKKI MEZONDA YIQILADI.**

</details>

**M27.** ⭐⭐⭐ Gibrid xotira menejeri.

<details>
<summary>✅ Yechim</summary>

```python
class GibridXotira:
    def __init__(self, chat, chegara=150, sozma_soz=4, maks_xulosa=200,
                 til="uz"):
        self.chat, self.chegara = chat, chegara
        self.sozma_soz, self.maks_xulosa = sozma_soz, maks_xulosa
        self.koef = 1.88 if til == "uz" else 1.0
        self.jurnal = []

    def __call__(self, state):
        xs = list(state["messages"])
        oldin = tok(xs)
        if oldin < self.chegara:
            self.jurnal.append({"oldin_tok": oldin, "keyin_tok": oldin,
                                "llm": 0, "harakat": "o'tkazildi"})
            return {"messages": []}

        saqlanadi = xs[-self.sozma_soz:]
        xulosalanadi = xs[:-self.sozma_soz]
        if not xulosalanadi:
            return {"messages": []}

        matn = "".join(f"{m.type}: {m.content}\n" for m in xulosalanadi)
        yangi = self.chat.invoke([HumanMessage(
            f"Oldingi xulosani YANGILANG — takrorlamang.\n"
            f"Ismlar, RAQAMLAR, summalar, muddatlarni SAQLANG.\n"
            f"Maks {self.maks_xulosa // 2} so'z.\n\n"
            f"Oldingi: {state.get('summary', '(yo‘q)')}\n\nYangi:\n{matn}")
        ]).content
        llm = 1

        if len(ENC.encode(yangi)) > self.maks_xulosa:
            print(f"  ⚠️ xulosa uzun — qisqartirilmoqda")
            yangi = self.chat.invoke([HumanMessage(
                f"Qisqartir ({self.maks_xulosa//3} so'z), faktlarni saqlab:"
                f"\n{yangi}")]).content
            llm += 1

        keyin = tok(saqlanadi) + len(ENC.encode(yangi))
        print(f"  📝 {len(xulosalanadi)} xulosalandi · "
              f"{len(saqlanadi)} so'zma-so'z · {oldin}→{keyin} token")
        self.jurnal.append({"oldin_tok": oldin, "keyin_tok": keyin,
                            "llm": llm, "harakat": "xulosalandi"})
        return {"messages": [RemoveMessage(id=m.id) for m in xulosalanadi],
                "summary": yangi}

    def kontekst(self, state):
        xul = state.get("summary", "")
        return (([SystemMessage(f"Suhbat xulosasi: {xul}")] if xul else [])
                + list(state["messages"]))

    def hisobot(self, kunlik=1000):
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        xul = d[d.harakat == "xulosalandi"]
        otk = d[d.harakat == "o'tkazildi"]
        print(f"\n⭐ o'tkazib yuborish {len(otk)/len(d):.0%} — "
              f"shuncha LLM chaqiruvi TEJALDI")
        if len(xul):
            tejaldi = (xul.oldin_tok - xul.keyin_tok).sum()
            print(f"💰 tejalgan {tejaldi} token · "
                  f"🇺🇿 ${tejaldi/1e6*0.15*kunlik*365*self.koef:,.0f}/yil")
        if len(otk) == 0:
            print("⚠️ HAR SAFAR xulosalandi — chegara juda PAST")
        if len(xul) == 0:
            print("⚠️ HECH QACHON xulosalanmadi — chegara juda YUQORI")
        return d


gx = GibridXotira(chat, chegara=150, sozma_soz=4)

class S(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]

SAVOL = ("Kredit shartlarini batafsil tushuntiring: foiz, muddat, hujjatlar, "
         "kafil talablari va erta to'lash imkoniyati.")

g = StateGraph(S)
g.add_node("ask", lambda s: {"messages": [AIMessage("Savolingiz?"),
                                          HumanMessage(SAVOL)],
                             "burilish": 1})
g.add_node("bot", lambda s: {"messages": [chat.invoke(gx.kontekst(s))]})
g.add_node("xotira", gx)
g.add_edge(START, "ask"); g.add_edge("ask", "bot")
g.add_conditional_edges(
    "bot", lambda s: "__end__" if s.get("burilish", 0) >= 8 else "xotira")
g.add_edge("xotira", "ask")

o = g.compile().invoke(S(messages=[], summary="", burilish=0),
                       {"recursion_limit": 60})
print(f"\n✅ {o['burilish']} burilish · {len(o['messages'])} xabar qoldi")
gx.hisobot()
```

## 🏆 **UCHTA OPTIMALLASHTIRISH:** chegaradan oshmasa **chaqirmaydi** · oxirgi N **so'zma-so'z** · xulosa **qisqartiriladi**.

</details>

**M28.** ⭐⭐⭐ 🇺🇿 Xulosalash sifatini o'lchang *(fakt saqlanishi)*.

<details>
<summary>✅ Yechim</summary>

```python
SUHBATLAR = [
    {"xabarlar": [
        HumanMessage("Salom, men Oybek. 50 000 000 so'm kredit olmoqchiman."),
        AIMessage("Salom Oybek! Muddat qancha bo'lsin?"),
        HumanMessage("24 oy."),
        AIMessage("24 oy uchun yillik 24%. Oylik to'lov 2 643 555 so'm.")],
     "faktlar": ["Oybek", "50000000", "24oy", "24%", "2643555"]},
    {"xabarlar": [
        HumanMessage("Men Dilnoza, karta ochmoqchiman."),
        AIMessage("Qaysi karta turi? UzCard yoki Humo?"),
        HumanMessage("UzCard."),
        AIMessage("UzCard 3 ish kunida tayyor. Yillik 50 000 so'm.")],
     "faktlar": ["Dilnoza", "UzCard", "3ish", "50000"]},
]

PROMPTLAR = {
    "yomon": "Quyidagi suhbatni qisqacha xulosalang.",
    "yaxshi": ("Quyidagi suhbatni xulosalang. Xulosada QUYIDAGILARNI ALBATTA "
               "SAQLANG: ismlar, RAQAMLAR, summalar, muddatlar, foizlar va "
               "qabul qilingan qarorlar."),
}

def normalize(s):
    return "".join(s.lower().split()).replace("'", "").replace("’", "")

q = []
for i, suhbat in enumerate(SUHBATLAR, 1):
    matn = "".join(f"{m.type}: {m.content}\n" for m in suhbat["xabarlar"])
    for nom, p in PROMPTLAR.items():
        xul = chat.invoke([HumanMessage(f"{p}\n\n{matn}")]).content
        n = normalize(xul)
        topildi = [f for f in suhbat["faktlar"] if normalize(f) in n]
        q.append({"suhbat": i, "prompt": nom,
                  "fakt": f"{len(topildi)}/{len(suhbat['faktlar'])}",
                  "yoqolgan": [f for f in suhbat["faktlar"]
                               if normalize(f) not in n][:3],
                  "xulosa_tok": len(ENC.encode(xul))})

print(pd.DataFrame(q).to_string(index=False))
print("\n⚠️ SOXTA MODELDA bu sinov ma'nosiz — HAQIQIY model bilan ishga tushiring")
print("🏆 ENG ISHONCHLI YECHIM — faktlarni state maydonida saqlash:")
print("     class State(MessagesState):")
print("         summa: int      # ⭐ xulosalash TEGMAYDI")
print("         muddat: int     # ⭐ xulosalash TEGMAYDI")
```

## 💥 **XULOSALASH — MA'LUMOTNI YO'QOTISHI MUMKIN BO'LGAN YAGONA STRATEGIYA.** Shuning uchun **muhim faktlar `state` maydonida** bo'lsin.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
Annotated YO'Q  →  1 xabar   💥 savol yo'qoladi
Annotated BOR   →  3 xabar   ✅

10-burilish:  trim yo'q 30 xabar/590 token  ·  trim=5  5 xabar/113 token (5.2×)

20 burilish, 1000 suhbat/kun, gpt-4o-mini:
   qo'shish     13 440 token · 20 chaqiruv  →  $736/yil   🇺🇿 $1 384
   trim=5        3 252 token · 20 chaqiruv  →  $178/yil   🇺🇿 $335
   xulosalash      520 token · 40 chaqiruv  →  ⭐ $28/yil  🇺🇿 $53

REMOVE_ALL_MESSAGES = '__remove_all__'   →  10 xabar → 0
Mavjud bo'lmagan id  →  💥 ValueError
lc_trim include_system  →  ⚠️ faqat strategy="last" bilan
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
