# 5-dars. Shartli qirralar — tugunlar va routing funksiya ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Endi ikkita tugun va bitta shart qo'shib, ishni biroz murakkablashtiramiz."**

---

## 1. Yangi tuzilish

```
[START] → [ask_question] → [chatbot] → [ask_another_question]
                ↑                              │
                └────────── "yes" ─────────────┤
                                               │ "no"
                                               ↓
                                            [END]
```

---

## 2. Kursning `ask_question` tuguni

```python
def ask_question(state: State) -> State:

    print(f"\n-------> ENTERING ask_question:")

    print("What is your question?")

    return State(messages = [HumanMessage(input())])
```

> ## 💥💥💥 **`input()` — BU DARSNING ENG KATTA MUAMMOSI.**
>
> ## 🔑 **NIMA UCHUN?**
> ```
> ❌ Faqat NOTEBOOK va terminal
> ❌ Veb-ilova (FastAPI/Flask) → SERVER MUZLAB QOLADI
> ❌ Telegram bot            → ishlamaydi
> ❌ Test                    → EOFError
> ❌ Bir necha foydalanuvchi → IMKONSIZ
> ❌ Checkpointer bilan      → holat tiklanmaydi
> ```
>
> ## 💡 **KURS BU YO'LNI TANLADI — CHUNKI U SODDA VA NOTEBOOKDA KO'RSATISH OSON.** Lekin **hech qanday haqiqiy ilovada** ishlamaydi.

---

## 3. ⭐⭐⭐ TO'G'RI YECHIM — `interrupt`

Bu — **kursda yo'q**, lekin **LangGraph'ning o'z yechimi**:

```python
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import InMemorySaver

def soraydi(state: State) -> State:
    javob = interrupt("Savolingiz nima?")      # ⭐ grafni TO'XTATADI
    return State(messages=[HumanMessage(javob)])

g = StateGraph(State)
g.add_node("soraydi", soraydi)
g.add_node("bot", bot)
g.add_edge(START, "soraydi"); g.add_edge("soraydi", "bot"); g.add_edge("bot", END)

gi = g.compile(checkpointer=InMemorySaver())    # ⚠️ checkpointer SHART
cfg = {"configurable": {"thread_id": "i1"}}
```

```python
# ── ① BIRINCHI CHAQIRUV — graf TO'XTAYDI ──
r = gi.invoke(State(messages=[]), cfg)
print("qaytardi:", list(r))
print("__interrupt__:", r.get("__interrupt__"))
print("next:", gi.get_state(cfg).next)
```

```
qaytardi: ['messages', '__interrupt__']
__interrupt__: [Interrupt(value='Savolingiz nima?', id='870b7b87263bcf20...')]
next: ('soraydi',)
```

```python
# ── ② JAVOB BERAMIZ — graf DAVOM ETADI ──
r2 = gi.invoke(Command(resume="Piet Hein kim?"), cfg)
print([(m.type, str(m.content)[:36]) for m in r2["messages"]])
```

```
[('human', 'Piet Hein kim?'), ('ai', 'Piet Hein (1905-1996) was a Danish p')]
```

> ## 🏆🏆 **`interrupt` NIMA UCHUN YAXSHIROQ?**
> ```
> ✅ Graf TO'XTAYDI, jarayon BLOKLANMAYDI
> ✅ Holat checkpointer'da SAQLANADI
> ✅ Javob KEYINROQ, BOSHQA jarayondan kelishi mumkin
> ⭐ Veb, Telegram, mobil — HAMMASIDA ishlaydi
> ⭐ Bir necha foydalanuvchi — har biri O'Z thread_id si bilan
> ```
>
> ## 🔑 **VA `checkpointer` SHART** — `interrupt` holatni **saqlab qo'yishi** kerak. *(47-modul.)*

### 🇺🇿 Telegram bot uchun naqsh

```python
# Foydalanuvchi /start bosdi
r = graf.invoke(State(messages=[]), {"configurable": {"thread_id": user_id}})
if r.get("__interrupt__"):
    await bot.send_message(user_id, r["__interrupt__"][0].value)
    return                                   # ⭐ JARAYON BO'SH QOLADI

# Foydalanuvchi keyinroq yozdi (soatlardan keyin ham bo'lishi mumkin)
r = graf.invoke(Command(resume=xabar_matni),
                {"configurable": {"thread_id": user_id}})
```

> ## 🏆 **BU — HAQIQIY BOTNING ARXITEKTURASI.** `input()` bilan bu **umuman imkonsiz**.

---

## 4. `ask_another_question` va `Literal`

```python
def ask_another_question(state: State) -> State:
    print(f"\n-------> ENTERING ask_another_question:")
    print("Would you like to ask one more question (yes/no)?")
    return State(messages = [HumanMessage(input())])


def routing_function(state: State) -> Literal["ask_question", "__end__"]:
    if state["messages"][0].content == "yes":
        return "ask_question"
    else:
        return "__end__"
```

> ## 💡 **`Literal["ask_question", "__end__"]` — TIP KO'RSATMASI.** Ish vaqtida **tekshirilmaydi**, lekin:
> ```
> ✅ mypy noto'g'ri qiymatni ushlaydi
> ⭐ LangGraph undan VIZUALIZATSIYA uchun foydalanadi (6-darsda ko'ramiz)
> ```
>
> ## 🔑 **`"__end__"` — BU `END` NING O'ZI** *(1-darsda ko'rgan edik)*. Shuning uchun `return END` **ham to'g'ri** va **o'qilishi osonroq**.

---

## 5. 💥💥 `state["messages"][0]` — YASHIRIN XATO

```
if state["messages"][0].content == "yes":      # ⚠️ BIRINCHI xabar
```

> ## 💥 **BU KOD SHU DARSDA ISHLAYDI, KEYINGI DARSDA BUZILADI.**
>
> ## 🔑 **NIMA UCHUN?**
> ```
> BU DARSDA (reducer YO'Q):
>    state["messages"] = [HumanMessage("yes")]      ← faqat 1 ta
>    [0]  →  ✅ "yes"
>
> 46-MODULDA (reducer BOR):
>    state["messages"] = [Human("savol"), AI("javob"), ..., Human("yes")]
>    [0]  →  💥 "savol"  ← DOIM birinchi savol!
>    → routing DOIM "__end__" qaytaradi → SIKL ISHLAMAYDI
> ```
>
> ## ✅ **TO'G'RI:**
> ```
> if state["messages"][-1].content == "yes":     # ⭐ OXIRGI xabar
> ```
>
> ## 💡 **KURS BUNI 46-MODULDA JIMGINA TUZATADI** *(`[0]` → `[-1]`)*, lekin **nima uchun** ekanini **aytmaydi**.

---

## 6. ⚠️ Routing funksiyaning zaifligi

Kurs o'zi tan oladi:

> **"Bu funksiya ta'rifi mukammal emas. Agar mantiqni yanada takomillashtirmoqchi bo'lsangiz — bu sizga havola."**

```python
# 💥 Bularning HAMMASI "__end__" ga ketadi:
"Yes"    "YES"    " yes"    "ha"    "ok"    "yes."
```

### ✅ Mustahkam variant

```python
HA = {"yes", "y", "yeah", "yep", "sure", "ok", "okay",
      "ha", "xa", "ha'a", "albatta", "bo'ladi", "mayli"}      # 🇺🇿
YOQ = {"no", "n", "nope", "nah", "yo'q", "yoq", "kerak emas", "rahmat"}


def routing_function(state: State) -> Literal["ask_question", "__end__"]:
    javob = str(state["messages"][-1].content).strip().lower()
    javob = javob.rstrip(".!?،,")                   # tinish belgilarini olib tashlash

    if javob in HA:
        return "ask_question"
    if javob in YOQ:
        return "__end__"

    # ⚠️ NOANIQ javob — xavfsiz tomon: TO'XTATAMIZ
    print(f"⚠️ tushunarsiz javob: {javob!r} → to'xtatilmoqda")
    return "__end__"
```

> ## 🏆 **UCH QOIDA:**
> ```
> ① .strip().lower()        →  " YES " ham ishlasin
> ② tinish belgilari        →  "yes." ham ishlasin
> ③ ⭐ NOANIQ holatni ANIQ hal qiling  →  jim davom etmasin
> ```
>
> ## 💥 **ENG XAVFLI VARIANT — `else: return "ask_question"`.** Tushunarsiz javob **cheksiz siklga** olib keladi.

### ⭐⭐ Yanada yaxshisi — LLM bilan tasniflash

```python
def routing_llm(state: State) -> Literal["ask_question", "__end__"]:
    javob = str(state["messages"][-1].content).strip().lower()
    if javob in HA:
        return "ask_question"
    if javob in YOQ:
        return "__end__"
    # ro'yxatda yo'q — modeldan so'raymiz
    r = chat.invoke([SystemMessage(
        "Foydalanuvchi javobi ROZILIKmi? FAQAT 'ha' yoki 'yoq' deb javob ber."),
        HumanMessage(javob)])
    return "ask_question" if "ha" in r.content.lower() else "__end__"
```

> ## ⚠️ **NARXI: HAR NOANIQ JAVOBDA BITTA QO'SHIMCHA LLM CHAQIRUVI.**
>
> ## 💡 **SHUNING UCHUN AVVAL RO'YXAT, KEYIN LLM** — 95% holat **bepul** hal bo'ladi.

---

## 7. 🇺🇿 Marshrutlash — kengroq qo'llanish

```python
def bolim_aniqla(state) -> Literal["kredit", "karta", "depozit", "operator"]:
    """Savolni tegishli bo'limga yo'naltiradi."""
    matn = str(state["messages"][-1].content).lower()

    KALITLAR = {
        "kredit":  ["kredit", "qarz", "foiz", "stavka", "ipoteka"],
        "karta":   ["karta", "plastik", "uzcard", "humo", "visa"],
        "depozit": ["depozit", "omonat", "jamg'arma", "vklad"],
    }
    for bolim, kalitlar in KALITLAR.items():
        if any(k in matn for k in kalitlar):
            return bolim
    return "operator"                       # ⭐ tushunmadik → ODAMGA


graph.add_conditional_edges("savol_ol", bolim_aniqla)
```

> ## 🏆 **HAR SHARTLI QIRRADA "OPERATOR" YO'LI BO'LSIN.** Bot **tushunmasa** — odamga **uzatsin**, **taxmin qilmasin**.
>
> ## 💡 **VA KALIT SO'ZLAR — O'ZBEK VA RUS TILIDA IKKALASIDA** *("depozit" va "vklad")*. Bu — mahalliy loyihalarning **odatiy talabi**.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Routing funksiya nima qaytaradi?

**M2.** `Literal` nima uchun?

**M3.** `input()` ning muammosi nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Keyingi tugun **nomini** *(satr)*, yoki `"__end__"`.

**M2.** ## **Tip ko'rsatmasi** — `mypy` uchun va ## ⭐ **vizualizatsiya** uchun.

**M3.** ## **Jarayonni bloklaydi** — veb, bot va testlarda **ishlamaydi**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ `[0]` va `[-1]` farqini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
XABARLAR = [
    HumanMessage("Piet Hein kim?"),
    AIMessage("Daniyalik olim va shoir."),
    AIMessage("Yana savolingiz bormi?"),
    HumanMessage("yes"),
]

print("birinchi [0] :", XABARLAR[0].content)
print("oxirgi   [-1]:", XABARLAR[-1].content)

def routing_0(xs):
    return "ask_question" if xs[0].content == "yes" else "__end__"

def routing_oxirgi(xs):
    return "ask_question" if xs[-1].content == "yes" else "__end__"

print("\n[0]  →", routing_0(XABARLAR), " 💥 SIKL ISHLAMAYDI")
print("[-1] →", routing_oxirgi(XABARLAR), " ✅")
```

## 💥 **REDUCER QO'SHILGANDA `[0]` DOIM BIRINCHI SAVOL BO'LADI** — routing **hech qachon** siklga kirmaydi.

</details>

**M5.** ⭐ Mustahkam routing yozing.

<details>
<summary>✅ Yechim</summary>

```python
HA = {"yes", "y", "yeah", "yep", "sure", "ok", "okay",
      "ha", "xa", "albatta", "mayli", "bo'ladi"}
YOQ = {"no", "n", "nope", "nah", "yo'q", "yoq", "rahmat", "kerak emas"}


def routing(javob_matni: str) -> str:
    j = javob_matni.strip().lower().rstrip(".!?،,")
    if j in HA:
        return "ask_question"
    if j in YOQ:
        return "__end__"
    return "__end__"                       # ⭐ NOANIQ → xavfsiz tomon


SINOVLAR = ["yes", "YES", " yes ", "yes.", "Yes!", "ha", "Ha", "albatta",
            "no", "yo'q", "rahmat", "bilmadim", "", "asdf"]
for x in SINOVLAR:
    y = routing(x)
    belgi = "🔁" if y == "ask_question" else "🛑"
    print(f"  {belgi} {x!r:12s} → {y}")
```

## 🔑 **`"bilmadim"` VA `""` — `__end__` GA KETADI.** Bu — **to'g'ri**: noaniqlikda **to'xtash xavfsizroq**.

</details>

**M6.** ⭐⭐ `interrupt` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import InMemorySaver

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def soraydi(s: S) -> S:
    javob = interrupt("Savolingiz nima?")
    return S(messages=[HumanMessage(javob)])

def bot(s: S) -> S:
    return S(messages=[chat.invoke(s["messages"])])

g = StateGraph(S)
g.add_node("soraydi", soraydi); g.add_node("bot", bot)
g.add_edge(START, "soraydi"); g.add_edge("soraydi", "bot"); g.add_edge("bot", END)
gi = g.compile(checkpointer=InMemorySaver())      # ⚠️ checkpointer SHART

cfg = {"configurable": {"thread_id": "sinov"}}
r = gi.invoke(S(messages=[]), cfg)
print("① to'xtadi. so'ramoqda:", r["__interrupt__"][0].value)
print("   next:", gi.get_state(cfg).next)

r2 = gi.invoke(Command(resume="Kredit foizi qancha?"), cfg)
print("② davom etdi:")
for m in r2["messages"]:
    print(f"    {m.type:6s} {str(m.content)[:52]}")
```

## 🏆 **GRAF TO'XTADI, JARAYON BLOKLANMADI.** `input()` da bu **imkonsiz**.

## ⚠️ **`checkpointer` BO'LMASA — XATO.** `interrupt` holatni **saqlashi** kerak.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Ko'p yo'nalishli marshrutlovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re
import pandas as pd
from typing import Literal


class Marshrutlovchi:
    """Kalit so'z → LLM → operator: uch bosqichli marshrutlash."""

    def __init__(self, kalitlar, chat=None, operator_tugun="operator"):
        """kalitlar = {"kredit": ["kredit", "qarz", ...], ...}"""
        self.kalitlar = kalitlar
        self.chat = chat
        self.operator = operator_tugun
        self.jurnal = []

    # ── ① kalit so'z (bepul, tez) ──
    def _kalit(self, matn):
        m = matn.lower()
        ballar = {}
        for bolim, kalitlar in self.kalitlar.items():
            n = sum(1 for k in kalitlar if re.search(rf"\b{re.escape(k)}", m))
            if n:
                ballar[bolim] = n
        if not ballar:
            return None, 0
        eng = max(ballar, key=ballar.get)
        # ⚠️ TENGLIK bo'lsa — noaniq
        if list(ballar.values()).count(ballar[eng]) > 1:
            return None, 0
        return eng, ballar[eng]

    # ── ② LLM (pulli, sekin) ──
    def _llm(self, matn):
        if self.chat is None:
            return None
        bolimlar = ", ".join(self.kalitlar)
        r = self.chat.invoke([
            SystemMessage(f"Savolni shu bo'limlardan biriga ajrat: {bolimlar}. "
                          f"Agar hech biriga to'g'ri kelmasa '{self.operator}' "
                          f"deb javob ber. FAQAT bo'lim nomini yoz."),
            HumanMessage(matn)])
        javob = str(r.content).strip().lower()
        return javob if javob in self.kalitlar else None

    def __call__(self, state) -> str:
        matn = str(state["messages"][-1].content)

        bolim, ball = self._kalit(matn)
        usul = "kalit"
        if bolim is None:
            bolim = self._llm(matn)
            usul = "llm"
        if bolim is None:
            bolim = self.operator
            usul = "zaxira"

        self.jurnal.append({"savol": matn[:34], "bolim": bolim,
                            "usul": usul, "ball": ball})
        return bolim

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))

        print("\n── usul bo'yicha ──")
        print(d.usul.value_counts().to_string())

        op = (d.bolim == self.operator).mean()
        llm = (d.usul == "llm").mean()
        print(f"\noperatorga uzatildi: {op:.0%}")
        print(f"LLM chaqirildi     : {llm:.0%}  💰")
        if op > 0.3:
            print("⚠️ KO'P savol tushunilmayapti — kalit so'zlarni kengaytiring")
        if llm > 0.5:
            print("💰 LLM juda tez-tez chaqirilmoqda — kalit so'z ro'yxatini "
                  "to'ldiring (har chaqiruv PUL)")
        return d


m = Marshrutlovchi({
    "kredit":  ["kredit", "qarz", "foiz", "stavka", "ipoteka", "ssuda"],
    "karta":   ["karta", "plastik", "uzcard", "humo", "visa", "kartochka"],
    "depozit": ["depozit", "omonat", "jamg'arma", "vklad", "foizli hisob"],
}, chat=None)

SAVOLLAR = ["Kredit foizi qancha?",
            "Karta necha kunda tayyorlanadi?",
            "Depozit stavkasi?",              # ⚠️ ikkala kalit ham bor
            "Ipoteka olsam bo'ladimi?",
            "Vklad ochmoqchiman",
            "Filial manzilini ayting",        # ⚠️ hech qaysi bo'lim emas
            "Salom"]

for s in SAVOLLAR:
    b = m({"messages": [HumanMessage(s)]})
    print(f"  {s:34s} → {b}")
print()
m.hisobot()
```

## 🏆 **UCH BOSQICH — NARX VA ANIQLIK MUVOZANATI:**
```
① kalit so'z  →  bepul, bir zumda, 80–90% holat
② LLM         →  💰 pulli, aniqroq, qolgan holatlar
③ operator    →  ⭐ tushunmadik — ODAMGA uzatamiz
```

## 💥 **"Depozit stavkasi?" — IKKALA KALIT HAM BOR** *(depozit va stavka)*. Tenglikda **noaniq** deb qaraladi — bu **to'g'ri**, chunki noto'g'ri bo'limga yuborishdan **yaxshiroq**.

</details>

---

## 📌 Xulosa

```python
def routing_function(state: State) -> Literal["ask_question", "__end__"]:
    javob = str(state["messages"][-1].content).strip().lower()   # ⭐ [-1]
    if javob in HA:
        return "ask_question"
    return "__end__"                        # ⭐ noaniq → xavfsiz tomon
```

```
💥 input()  →  veb, bot, testda ISHLAMAYDI
✅ interrupt + Command(resume=...) + checkpointer   ⭐ TO'G'RI YECHIM

💥 state["messages"][0]  →  reducer qo'shilgach BUZILADI
✅ state["messages"][-1]

⚠️ "Yes" · " yes " · "yes." — kursning kodi ULARNI TUSHUNMAYDI
🇺🇿 kalit so'zlar o'zbek VA rus tilida ("depozit" va "vklad")
```

> ## 🏆 **HAR SHARTLI QIRRADA "OPERATOR" YO'LI BO'LSIN.** Bot tushunmasa — **odamga uzatsin**.

---

⬅️ [4-dars. Grafni qurish](04-Building-the-Graph.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. Shartli grafni qurish](06-Conditional-Edges-Building-the-Graph.md)
