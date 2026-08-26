# 6-dars. Shartli grafni qurish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu oxirgi tugun ikki tugundan biriga olib borishi mumkin: `ask_question` yoki END. Bu mantiqni amalga oshirish uchun boshqa metod kerak — `add_conditional_edges`."**

---

## 1. `add_conditional_edges`

```python
graph = StateGraph(State)

graph.add_node("ask_question", ask_question)
graph.add_node("chatbot", chatbot)
graph.add_node("ask_another_question", ask_another_question)

graph.add_edge(START, "ask_question")
graph.add_edge("ask_question", "chatbot")
graph.add_edge("chatbot", "ask_another_question")

graph.add_conditional_edges(source="ask_another_question",     # ⭐ qayerdan
                            path=routing_function)             # ⭐ kim hal qiladi
```

| Parametr | Nima |
|---|---|
| ## `source` | ## **Qaysi tugundan** chiqiladi |
| ## `path` | ## **Chaqiriluvchi** — keyingi tugun nomini qaytaradi |
| `path_map` | ## ⭐ Vizualizatsiya uchun **xarita** |

> ## 🔑 **`add_edge` VA `add_conditional_edges` FARQI:**
> ```
> add_edge              →  DOIM shu tugunga o'tadi
> add_conditional_edges →  ⭐ FUNKSIYA hal qiladi
> ```

---

## 2. 💥 Vizualizatsiya muammosi — kursning o'zi topadi

> **"Hmm. Nimadir noto'g'ri ko'rinadi. Vizualizatsiya bizning mantiqimizni aniq aks ettirmayapti, shunday emasmi? `ask_another_question` tugunidan keyin hech qanday tarmoqlanish YO'Q."**

### ✅ Yechim 1 — `path_map`

```python
graph.add_conditional_edges(
    source="ask_another_question",
    path=routing_function,
    path_map={True: "ask_question", False: END})     # ⭐
```

### ✅ Yechim 2 — `Literal` *(kurs buni tanlaydi)*

```python
def routing_function(state: State) -> Literal["ask_question", "__end__"]:
    ...
```

> ## 🏆 **IKKALASI HAM ISHLAYDI. `Literal` — TOZAROQ**, chunki u **bir vaqtda**:
> ```
> ✅ Tip ko'rsatmasi (mypy)
> ✅ Vizualizatsiya uchun ma'lumot
> ✅ Hujjat (kodni o'qigan odam ko'radi)
> ```

### 🔬 O'lchangan natija

```python
print(graph_compiled.get_graph().draw_ascii())
```

```
          +-----------+
          | __start__ |
          +-----------+
                 *
                 *
                 *
         +--------------+
         | ask_question |
         +--------------+
          ***         ..
         *              ..
       **                 ..
+---------+                 .
| chatbot |               ..
+---------+             ..
          ***         ..
             *      ..
              **   .
     +----------------------+
     | ask_another_question |
     +----------------------+
                 .
                 .
                 .
            +---------+
            | __end__ |
            +---------+
```

> ## 🔑 **NUQTALI CHIZIQ (`.`) — SHARTLI QIRRA.** To'liq yulduzcha (`*`) — **oddiy qirra**.
>
> ## 💡 **`ask_another_question` DAN IKKI YO'L CHIQAYAPTI:** biri **`ask_question` ga qaytadi** *(sikl)*, biri **`__end__` ga**.

---

## 3. Grafni ishga tushiramiz

```python
graph_compiled.invoke(State(messages=[]))
```

```
  -------> ask_question
  -------> chatbot
  -------> ask_another_question → yes
  -------> ask_question
  -------> chatbot
  -------> ask_another_question → yes
  -------> ask_question
  -------> chatbot
  -------> ask_another_question → no
  yakuniy xabarlar: 15
```

> ## ✅ **SIKL ISHLADI** — uch marta aylandi, keyin to'xtadi.

---

## 4. 💥💥 KURSNING O'ZI TOPGAN MUAMMO

> **"Hmm. Bu qiziq. Chatbot oldingi yozishmamizni ESLAB QOLMAGAN va men qaysi shoir haqida gapirayotganimni bilmaydi."**

```
Savol 1: "Could you tell me a grook by Piet Hein?"
Javob 1: "Certainly! Here's a well-known grook..."
Savol 2: "Where was the poet born?"
Javob 2: 💥 "Which poet do you mean?"        ← KONTEKST YO'Q
```

> ## 🔑 **SABAB — 3-DARSDA KO'RGANIMIZ: `messages` DA REDUCER YO'Q.**
> ```
> Har tugun state["messages"] ni ALMASHTIRADI
> → chatbot faqat OXIRGI savolni ko'radi
> → suhbat tarixi YO'Q
> ```
>
> ## 🏆 **KURS BUNI KEYINGI MODULNING MAVZUSI QILIB QO'YADI** — bu **pedagogik jihatdan to'g'ri**.
>
> ## ⚠️ **LEKIN BIZ BILAMIZ: YECHIM — BITTA SO'Z.**
> ```python
> messages: Annotated[Sequence[BaseMessage], add_messages]
> ```

---

## 5. 💥💥💥 KURSDA UMUMAN AYTILMAGAN XAVF — REKURSIYA

Routing funksiya **hech qachon** `"__end__"` qaytarmasa nima bo'ladi?

```python
def hech_qachon_tugamaydi(state: St) -> St:
    return St(messages=[HumanMessage("yes")])       # ⚠️ DOIM "yes"
```

```
  -------> ask_question
  -------> chatbot
  -------> ask_question
  -------> chatbot
  ... (minglab marta) ...
💥 GraphRecursionError : Recursion limit of 10007 reached without hitting
   a stop condition. You can increase the limit by setting the
   `recursion_limit` config key.
```

> ## 💥💥💥 **REKURSIYA CHEGARASI — 10 007.**
>
> ## 🔑 **YA'NI SIKL ~5000 MARTA AYLANDI.**
>
> ## 💰 **HAQIQIY MODEL BILAN BU NIMA DEGANI?**
> ```
> 5000 chaqiruv × ~500 token × $0.15/1M   ≈  $0.38   (gpt-4o-mini)
> 5000 chaqiruv × ~500 token × $2.50/1M   ≈  $6.25   (gpt-4o)
>
> ⚠️ VA BU — BITTA foydalanuvchining BITTA so'rovi uchun
> ⚠️ Vaqt: 5000 × 1s ≈ 83 DAQIQA
> ```

### ✅ Yechim — chegarani QO'LDA qo'ying

```python
graph_compiled.invoke(state, {"recursion_limit": 20})
```

```
💥 GraphRecursionError (0.00s)
   Recursion limit of 5 reached without hitting a stop condition...
```

> ## 🏆🏆 **QOIDA: SIKLLI GRAFDA `recursion_limit` NI DOIM QO'LDA QO'YING.**
>
> ## 💡 **QANCHA?**
> ```
> Suhbat: 20 burilish × 3 tugun ≈ 60      →  recursion_limit=80
> Agent : 10 vosita chaqiruvi × 2 ≈ 20    →  recursion_limit=30
> ```
> **Har supersteр — bitta birlik.**

### ⭐ Yanada yaxshisi — state'da hisoblagich

```python
class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    burilish: int


def ask_another(state: State) -> State:
    return State(messages=[...], burilish=state.get("burilish", 0) + 1)


def routing(state: State) -> Literal["ask_question", "__end__"]:
    if state.get("burilish", 0) >= 20:
        print("⚠️ 20 burilish chegarasiga yetildi")
        return "__end__"
    return "ask_question" if javob == "yes" else "__end__"
```

> ## 🏆 **IKKI QAVAT:**
> ```
> ① state hisoblagichi   →  ⭐ NAZORATLI to'xtash, foydalanuvchiga xabar
> ② recursion_limit      →  🛡️ oxirgi himoya (xato bilan)
> ```
>
> ## 💥 **FAQAT `recursion_limit` — BU XATO BILAN TO'XTASH.** Foydalanuvchi **nima bo'lganini bilmaydi**.

---

## 6. ⭐ `add_conditional_edges` — kengroq imkoniyatlar

```python
# ① Bir necha yo'nalish
def marshrut(state) -> Literal["kredit", "karta", "depozit", "operator"]:
    ...
graph.add_conditional_edges("savol_ol", marshrut)

# ② ⭐ RO'YXAT qaytarish — PARALLEL tugunlar
def parallel_marshrut(state) -> list[str]:
    return ["hujjat_qidirish", "tarix_tekshirish"]      # ⭐ IKKALASI ishlaydi
graph.add_conditional_edges("boshlash", parallel_marshrut)

# ③ path_map bilan
graph.add_conditional_edges("tekshir", tekshir_fn,
                            path_map={"ok": "davom", "xato": "qayta_sora"})
```

> ## 🏆 **② — KURSDA UMUMAN YO'Q, LEKIN JUDA FOYDALI.** Routing funksiya **ro'yxat** qaytarsa — barcha tugunlar **parallel** ishlaydi *(1-darsdagi superstep)*.
>
> ## ⚠️ **UNDA REDUCER SHART** — parallel tugunlar bir maydonni yozadi.

---

## 7. 🇺🇿 To'liq misol — modelsiz, sikl bilan

```python
class AnketaState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    javoblar: Annotated[list, operator.add]
    qadam: int


SAVOLLAR = ["Ismingiz?", "Yoshingiz?", "Telefon raqamingiz?"]
# Sinov uchun tayyor javoblar (interrupt o'rniga)
JAVOBLAR = iter(["Oybek", "17", "30", "+998901234567"])


def sora(s: AnketaState) -> AnketaState:
    q = s.get("qadam", 0)
    savol = SAVOLLAR[q]
    javob = next(JAVOBLAR, "")
    print(f"  ❓ {savol}  →  {javob}")
    return {"messages": [AIMessage(savol), HumanMessage(javob)],
            "javoblar": [javob]}


def tekshir(s: AnketaState) -> AnketaState:
    q = s.get("qadam", 0)
    javob = s["javoblar"][-1]
    ok = True
    if q == 1:                                    # yosh
        ok = javob.isdigit() and 18 <= int(javob) <= 100
        if not ok:
            print("  💥 yosh 18–100 oralig'ida bo'lishi kerak")
    elif q == 2:                                  # telefon
        ok = javob.startswith("+998") and len(javob) == 13
        if not ok:
            print("  💥 telefon +998XXXXXXXXX ko'rinishida bo'lsin")
    return {"qadam": q + 1 if ok else q}


def yol(s: AnketaState) -> Literal["sora", "__end__"]:
    if s["qadam"] >= len(SAVOLLAR):
        return "__end__"
    return "sora"                                 # ⭐ SIKL


g = StateGraph(AnketaState)
g.add_node("sora", sora)
g.add_node("tekshir", tekshir)
g.add_edge(START, "sora")
g.add_edge("sora", "tekshir")
g.add_conditional_edges("tekshir", yol)
gc = g.compile()

r = gc.invoke(AnketaState(messages=[], javoblar=[], qadam=0),
              {"recursion_limit": 30})            # ⭐ SHART
print("\n✅ to'plangan javoblar:", r["javoblar"])
```

```
  ❓ Ismingiz?  →  Oybek
  ❓ Yoshingiz?  →  17
  💥 yosh 18–100 oralig'ida bo'lishi kerak
  ❓ Yoshingiz?  →  30
  ❓ Telefon raqamingiz?  →  +998901234567

✅ to'plangan javoblar: ['Oybek', '17', '30', '+998901234567']
```

> ## 🏆 **NOTO'G'RI YOSH QABUL QILINMADI — SAVOL QAYTA BERILDI.** Bu — **shartli qirraning eng amaliy qo'llanishi**.
>
> ## 🔑 **VA DIQQAT — LLM UMUMAN ISHLATILMADI.** Anketa to'ldirish **kodning ishi**.
>
> ## ⚠️ **`javoblar` DA `operator.add` REDUCERI BOR** — shuning uchun har javob **qo'shiladi**, almashtirilmaydi.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `add_conditional_edges` ning ikki majburiy parametri?

**M2.** Vizualizatsiyada tarmoqlanish ko'rinmasa nima qilish kerak?

**M3.** Rekursiya chegarasi standart holda qancha?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `source` *(qayerdan)* va `path` *(kim hal qiladi)*.

**M2.** ## `path_map` qo'shish **yoki** ## ⭐ `Literal` tip ko'rsatmasi.

**M3.** ## **10 007** *(o'lchandi)* — ya'ni sikl **~5000 marta** aylanadi.

</details>

### 🟡 O'rta

**M4.** ⭐ Shartli grafni quring va chizing.

<details>
<summary>✅ Yechim</summary>

```python
JAVOBLAR = iter(["yes", "yes", "no"])

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def ask(s: S) -> S:
    print("  → ask_question")
    return S(messages=[AIMessage("Savolingiz?"),
                       HumanMessage(f"Savol {len(s['messages'])}")])

def bot(s: S) -> S:
    print("  → chatbot")
    return S(messages=[chat.invoke(s["messages"])])

def yana(s: S) -> S:
    j = next(JAVOBLAR, "no")
    print("  → ask_another:", j)
    return S(messages=[AIMessage("Yana savolmi?"), HumanMessage(j)])

def yol(s: S) -> Literal["ask_question", "__end__"]:
    return "ask_question" if s["messages"][-1].content == "yes" else "__end__"

g = StateGraph(S)
g.add_node("ask_question", ask); g.add_node("chatbot", bot)
g.add_node("ask_another_question", yana)
g.add_edge(START, "ask_question")
g.add_edge("ask_question", "chatbot")
g.add_edge("chatbot", "ask_another_question")
g.add_conditional_edges("ask_another_question", yol)
gc = g.compile()

print(gc.get_graph().draw_ascii())
r = gc.invoke(S(messages=[]), {"recursion_limit": 30})
print("\nyakuniy xabarlar:", len(r["messages"]))
```

## 🔑 **NUQTALI CHIZIQLAR — SHARTLI QIRRALAR.**

</details>

**M5.** ⭐⭐ Rekursiya chegarasini sinang.

<details>
<summary>✅ Yechim</summary>

```python
import time

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def a(s: S) -> S:
    return S(messages=[HumanMessage("yes")])

def cheksiz(s: S) -> Literal["a", "__end__"]:
    return "a"                                   # ⚠️ HECH QACHON tugamaydi

g = StateGraph(S)
g.add_node("a", a)
g.add_edge(START, "a")
g.add_conditional_edges("a", cheksiz)
gc = g.compile()

for chegara in [5, 20, 100]:
    t0 = time.perf_counter()
    try:
        gc.invoke(S(messages=[]), {"recursion_limit": chegara})
        print(f"  {chegara:4d}: ⚠️ to'xtamadi?!")
    except Exception as e:
        print(f"  {chegara:4d}: 💥 {type(e).__name__} "
              f"({(time.perf_counter()-t0)*1000:.0f} ms)")

print("\n⚠️ CHEGARASIZ ishga tushirmang — standart 10 007!")
```

## 💰 **HAQIQIY MODEL BILAN 10 000 CHAQIRUV = SOATLAB VAQT VA O'NLAB DOLLAR.**

</details>

**M6.** ⭐⭐ State hisoblagichi bilan nazoratli to'xtash.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    burilish: int

MAKS = 5

def ask(s: S) -> S:
    return S(messages=[HumanMessage("savol")], burilish=s.get("burilish", 0) + 1)

def bot(s: S) -> S:
    return S(messages=[chat.invoke(s["messages"])])

def yol(s: S) -> Literal["ask", "__end__"]:
    if s.get("burilish", 0) >= MAKS:
        print(f"  ⚠️ {MAKS} burilish chegarasi — NAZORATLI to'xtash")
        return "__end__"
    return "ask"

g = StateGraph(S)
g.add_node("ask", ask); g.add_node("bot", bot)
g.add_edge(START, "ask"); g.add_edge("ask", "bot")
g.add_conditional_edges("bot", yol)
gc = g.compile()

r = gc.invoke(S(messages=[], burilish=0), {"recursion_limit": 100})
print("burilishlar:", r["burilish"], "· xabarlar:", len(r["messages"]))
print("✅ XATO CHIQMADI — nazoratli to'xtash")
```

## 🏆 **FARQ:**
```
recursion_limit  →  💥 GraphRecursionError (xato)
state hisoblagich →  ✅ NORMAL yakun, foydalanuvchiga xabar bilan
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Xavfsiz siklli graf quruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import time
import pandas as pd
from typing import get_type_hints, get_origin, Annotated


class XavfsizGraf:
    """Siklli grafni QURADI va uchta himoya bilan ta'minlaydi."""

    def __init__(self, state_sinfi, maks_burilish=20, maks_soniya=60):
        self.S = state_sinfi
        self.maks_burilish = maks_burilish
        self.maks_soniya = maks_soniya
        self.graph = StateGraph(state_sinfi)
        self.tugunlar = []
        self.sikllar = []
        self.jurnal = []

    # ── tugun ──
    def tugun(self, nom, f):
        adapter = self

        def orab(state):
            t0 = time.perf_counter()
            natija = f(state)
            adapter.jurnal.append(
                {"tugun": nom, "ms": round((time.perf_counter() - t0) * 1000, 1),
                 "burilish": state.get("burilish", 0)})
            return natija

        self.graph.add_node(nom, orab)
        self.tugunlar.append(nom)
        return self

    def qirra(self, a, b):
        self.graph.add_edge(START if a == "START" else a,
                            END if b == "END" else b)
        return self

    # ── xavfsiz shartli qirra ──
    def shartli(self, manba, f, sikl_tuguni=None):
        maks = self.maks_burilish

        def himoyalangan(state):
            b = state.get("burilish", 0)
            if b >= maks:
                print(f"  ⚠️ {maks} burilish chegarasi — NAZORATLI to'xtash")
                return "__end__"
            return f(state)

        self.graph.add_conditional_edges(manba, himoyalangan)
        if sikl_tuguni:
            self.sikllar.append((manba, sikl_tuguni))
        return self

    # ── tekshiruv ──
    def tekshir(self):
        muammo = []
        try:
            hints = get_type_hints(self.S, include_extras=True)
        except Exception:
            hints = getattr(self.S, "__annotations__", {})

        if "burilish" not in hints:
            muammo.append("💥 state'da 'burilish' maydoni YO'Q — "
                          "burilish chegarasi ISHLAMAYDI")
        if "messages" in hints and get_origin(hints["messages"]) is not Annotated:
            muammo.append("💥 'messages' da REDUCER yo'q — xabarlar YO'QOLADI")
        if self.sikllar:
            print(f"⭐ {len(self.sikllar)} sikl: {self.sikllar}")
        for m in muammo:
            print(f"  {m}")
        return not muammo

    # ── ishga tushirish ──
    def ishga_tushir(self, kirish, recursion_limit=None):
        self.tekshir()
        rl = recursion_limit or (self.maks_burilish * max(2, len(self.tugunlar)))
        print(f"🛡️ recursion_limit={rl} · maks_burilish={self.maks_burilish}")
        gc = self.graph.compile()
        t0 = time.perf_counter()
        try:
            r = gc.invoke(kirish, {"recursion_limit": rl})
            print(f"✅ yakunlandi ({time.perf_counter()-t0:.2f}s)")
            return r
        except Exception as e:
            print(f"💥 {type(e).__name__} ({time.perf_counter()-t0:.2f}s)")
            print(f"   {str(e)[:110]}")
            return None
        finally:
            self.hisobot()

    def hisobot(self):
        if not self.jurnal:
            return
        d = pd.DataFrame(self.jurnal)
        print("\n── tugun statistikasi ──")
        j = d.groupby("tugun").agg(chaqiruv=("ms", "size"),
                                   jami_ms=("ms", "sum")).round(1)
        print(j.to_string())
        print(f"jami qadamlar: {len(d)} · maks burilish: {d.burilish.max()}")
        if len(d) > self.maks_burilish * len(self.tugunlar) * 0.9:
            print("⚠️ chegaraga YAQIN — mantiqni tekshiring")


# ── sinov ──
class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    burilish: int

def ask(s): return {"messages": [HumanMessage("savol")],
                    "burilish": s.get("burilish", 0) + 1}
def bot(s): return {"messages": [chat.invoke(s["messages"])]}
def yol(s): return "ask"                      # ⚠️ HECH QACHON tugamaydi

xg = (XavfsizGraf(S, maks_burilish=5)
      .tugun("ask", ask)
      .tugun("bot", bot)
      .qirra("START", "ask")
      .qirra("ask", "bot")
      .shartli("bot", yol, sikl_tuguni="ask"))

r = xg.ishga_tushir(S(messages=[], burilish=0))
print("\nnatija xabarlari:", len(r["messages"]) if r else "—")
```

## 🏆 **UCH QAVATLI HIMOYA:**
```
① state 'burilish' hisoblagichi  →  ⭐ NAZORATLI to'xtash
② recursion_limit avtomatik      →  🛡️ oxirgi himoya
③ tekshir()                      →  💥 reducer va hisoblagich yo'qligini topadi
```

## 💥 **VA E'TIBOR BERING — `yol` FUNKSIYASI DOIM `"ask"` QAYTARADI**, ya'ni **cheksiz sikl**. Lekin himoya tufayli graf **normal yakunlandi**.

</details>

---

## 📌 Xulosa

```python
graph.add_conditional_edges(source="ask_another_question",
                            path=routing_function)          # ⭐ funksiya hal qiladi

def routing_function(state) -> Literal["ask_question", "__end__"]:   # ⭐ vizualizatsiya
    ...

gc.invoke(state, {"recursion_limit": 30})                   # ⭐⭐ SHART
```

```
✅ Sikl ishladi — 3 marta aylandi, keyin to'xtadi
💥 Kurs topgan muammo: chatbot kontekstni ESLAMAYDI → 46-modul
💥💥 Kursda AYTILMAGAN: rekursiya chegarasi 10 007 — sikl ~5000 marta aylandi
     → gpt-4o bilan ≈ $6.25 va 83 daqiqa BITTA so'rov uchun
✅ Ikki qavat: state hisoblagichi (nazoratli) + recursion_limit (himoya)
```

> ## 🏆 **VIZUALIZATSIYA UCHUN — `Literal` YOKI `path_map`.** Usiz shartli qirralar **rasmda ko'rinmaydi**.

---

⬅️ [5-dars. Shartli qirralar — tugunlar](05-Conditional-Edges-Nodes-and-Routing.md) · 🏠 [Modul boshiga](README.md) · ➡️ [46-modul. Xabarlarni boshqarish](../46-LangGraph-Message-Management/README.md)
