# 6-dars. Xabarlarni xulosalash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Oldingi muloqotlarni SO'ZMA-SO'Z saqlash o'rniga — ularni XULOSALAYMIZ."**

---

## 1. Reja

> **"Birinchidan, `MessagesState` dan meros oluvchi yangi holat yaratamiz — unda qo'shimcha `summary` parametri bo'ladi. Ikkinchidan, `chatbot` tugunini o'zgartiramiz. Nihoyat, `trim_messages` tugunini xulosa yaratuvchi tugun bilan almashtiramiz."**

```
[ask_question] → [chatbot] → [ask_another_question]
       ↑                              │
       │                        ha ───┤─── yo'q
[summarize_and_delete] ←──────────────┘         ↓
                                             [END]
```

---

## 2. Yangi state

```python
class State(MessagesState):
    summary: str
```

> ## 🔑 **KURSNING MUHIM ESLATMASI:** *"bu kalit reducer bilan ANNOTATSIYA QILINMAGAN, `messages` dan farqli. Shuning uchun har yangilanishda `summary` ning eski qiymati YANGISI bilan ALMASHTIRILADI."*
>
> ## ✅ **VA BU — TO'G'RI.** Xulosa **to'planmaydi**, u **yangilanadi**.

### `.get()` — 3-darsda ko'rgan edik

```python
s = State(messages=[])
s["summary"]                 # 💥 KeyError: 'summary'
s.get("summary", "")         # ✅ ''
```

> ## 💡 **KURSNING TANLOVI YAXSHI:** bo'sh satr `bool()` da **`False`**, to'ldirilgan satr — **`True`**. Ya'ni:
> ```
> if state.get("summary", ""):     # ⭐ "xulosa BORMI?"
> ```

---

## 3. `chatbot` tuguni — xulosani kontekst sifatida

```python
def chatbot(state: State) -> State:

    print(f"\n-------> ENTERING chatbot:")
    for i in state["messages"]:
        i.pretty_print()

    system_message = f'''
    Here's a quick summary of what's been discussed so far:
    {state.get("summary", "")}

    Keep this in mind as you answer the next question.
    '''

    response = chat.invoke([SystemMessage(system_message)] + state["messages"])
    response.pretty_print()

    return State(messages = [response])
```

> ## ⚠️⚠️ **BU KODDA IKKITA MUAMMO BOR:**
>
> ### ① Xulosa bo'sh bo'lsa ham `SystemMessage` yuboriladi
> ```
> "Here's a quick summary of what's been discussed so far:
>
>  Keep this in mind as you answer the next question."
> ```
> **Model bo'sh xulosani ko'radi va chalkashadi.**
>
> ### ✅ Tuzatish
> ```python
> xul = state.get("summary", "")
> kirish = ([SystemMessage(f"Suhbat xulosasi: {xul}")] if xul else []) \
>     + list(state["messages"])
> response = chat.invoke(kirish)
> ```
>
> ### ② `SystemMessage` `messages` ga QO'SHILMAYDI
> Har chaqiruvda **qayta yasaladi** — bu **to'g'ri**, chunki xulosa **o'zgaradi**.

---

## 4. Xulosalash tuguni

```python
def summarize_and_delete_messages(state: State) -> State:
    print(f"\n-------> ENTERING summarize_and_delete_messages:")

    new_conversation = ""
    for i in state["messages"]:
        new_conversation += f"{i.type}: {i.content}\n\n"

    summary_instructions = f'''
Update the ongoing summary by incorporating the new lines of conversation below.
Build upon the previous summary rather than repeating it so that the result
reflects the most recent context and developments.

Previous Summary:
{state.get("summary", "")}

New Conversation:
{new_conversation}
'''

    summary = chat.invoke([HumanMessage(summary_instructions)])

    remove_messages = [RemoveMessage(id = i.id) for i in state["messages"][:]]

    return State(messages = remove_messages, summary = summary.content)
```

> ## 🔑 **UCHTA QADAM:**
> ```
> ① Suhbatni O'QILADIGAN matnga aylantirish
> ② Eski xulosa + yangi suhbat → LLM → YANGI xulosa
> ③ ⭐ HAMMA xabarni o'chirish
> ```
>
> ## 🏆 **PROMPTNING ENG MUHIM SATRI:**
> ## *"Build upon the previous summary rather than repeating it"*
> Usiz model **eski xulosani takrorlaydi** va xulosa **cheksiz o'sadi**.

### ⭐ Soddaroq — `REMOVE_ALL_MESSAGES`

```python
from langgraph.graph.message import REMOVE_ALL_MESSAGES

return State(messages=[RemoveMessage(id=REMOVE_ALL_MESSAGES)],
             summary=summary.content)
```

> ## 💡 **BITTA OBYEKT — HAMMASI.** Va `id=None` muammosi **yo'q** *(4-dars)*.

---

## 5. 💰💰 Narxni o'lchadik

```
      usul  chaqiruv  kirish_token  narx_$_1000_suhbat
  qo'shish        20         13440               2.016
    trim=5        20          3252               0.488
xulosalash        40           520               0.078
```

> ## 🏆 **XULOSALASH — 26× ARZON** *(13 440 → 520 token)*.
>
> ## ⚠️ **LEKIN CHAQIRUV IKKI BAROBAR** *(20 → 40)*:
> ```
> ✅ Token narxi  →  26× arzon
> ⚠️ Kechikish    →  2× sekin (foydalanuvchi ikki marta kutadi)
> ⚠️ Ishonchlilik →  ikki marta ko'p xato ehtimoli
> ```

### 💰 Yillik hisob *(1000 suhbat/kun)*

| Strategiya | gpt-4o-mini | 🇺🇿 o'zbekcha *(×1.88)* |
|---|---:|---:|
| Qo'shish | ## **$736** | ## **$1 384** |
| Trim=5 | $178 | $335 |
| ## **Xulosalash** | ## ⭐ **$28** | ## ⭐ **$53** |

> ## 💥 **QO'SHISH VA XULOSALASH ORASIDA — 🇺🇿 $1 331/YIL FARQ.**
>
> ## ⚠️ **LEKIN E'TIBOR:** bu **faqat kirish tokeni**. Xulosalash **chiqish tokeni** ham yeydi *(har xulosa ~60 token)*. Haqiqiy farq **kamroq**, lekin **baribir katta**.

---

## 6. ⚠️⚠️ Xulosalashning yashirin xavflari

### ① Xulosa CHEKSIZ o'sishi mumkin

```python
def xavfsiz_xulosala(state, maks_xulosa_token=300):
    xul = chat.invoke([HumanMessage(kursatma)]).content
    t = len(ENC.encode(xul))
    if t > maks_xulosa_token:
        print(f"  ⚠️ xulosa {t} token — qisqartirilmoqda")
        xul = chat.invoke([HumanMessage(
            f"Quyidagi xulosani {maks_xulosa_token//2} tokengacha qisqartir, "
            f"eng muhim faktlarni saqlab:\n{xul}")]).content
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)], "summary": xul}
```

> ## 💥 **USIZ:** har burilishda xulosa **o'sadi** va 50-burilishda u **suhbatdan uzunroq** bo'ladi.

### ② Faktlar YO'QOLADI

```
Suhbat: "Kredit summasi 50 000 000 so'm, muddat 24 oy, foiz 24%"
Xulosa: "Foydalanuvchi kredit bilan qiziqmoqda"        ← 💥 RAQAMLAR YO'Q
```

> ## ✅ **YECHIM — PROMPTDA ANIQ TALAB:**
> ```python
> "Xulosada quyidagilarni ALBATTA saqlang: raqamlar, sanalar, ismlar, "
> "summalar, foydalanuvchi qabul qilgan qarorlar."
> ```
>
> ## 🏆 **YOKI YANADA YAXSHISI — MUHIM FAKTLARNI `state` DA ALOHIDA SAQLANG:**
> ```python
> class State(MessagesState):
>     summary: str
>     summa: int              # ⭐ xulosalash TEGMAYDI
>     muddat: int             # ⭐ xulosalash TEGMAYDI
>     til: str                # ⭐ xulosalash TEGMAYDI
> ```

### ③ Har burilishda xulosalash — ISROF

```python
def kerak_bolsa_xulosala(state: State) -> State:
    """⭐ Faqat chegaradan oshganda xulosalaydi."""
    t = sum(len(ENC.encode(str(m.content))) for m in state["messages"])
    if t < 1500:
        print(f"  ⏭️ {t} token — xulosalash SHART EMAS")
        return {"messages": []}
    ...
```

> ## 💰 **BU — CHAQIRUVLARNI YARMIGA QISQARTIRADI.** Kursning kodi **har burilishda** xulosalaydi — hatto suhbat **3 ta xabar** bo'lsa ham.

---

## 7. 🏆 Eng yaxshi yechim — GIBRID

```python
class State(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]


def gibrid_xotira(state: State) -> State:
    """⭐ trim + xulosalash: eng yaqin xabarlar SO'ZMA-SO'Z, eskisi XULOSADA."""
    xs = list(state["messages"])
    tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

    if tok(xs) < 1500:                       # ① chegaradan oshmadi
        return {"messages": []}

    # ② oxirgi 6 tasini SO'ZMA-SO'Z qoldiramiz
    saqlanadi = xs[-6:]
    xulosalanadi = xs[:-6]
    if not xulosalanadi:
        return {"messages": []}

    matn = "".join(f"{m.type}: {m.content}\n" for m in xulosalanadi)
    kursatma = (
        f"Oldingi xulosani YANGILANG (takrorlamang, RIVOJLANTIRING).\n"
        f"Xulosada ALBATTA saqlang: raqamlar, sanalar, ismlar, summalar, "
        f"qabul qilingan qarorlar.\n"
        f"Maksimal 150 so'z.\n\n"
        f"Oldingi xulosa:\n{state.get('summary', '(yo‘q)')}\n\n"
        f"Yangi suhbat:\n{matn}")

    yangi = chat.invoke([HumanMessage(kursatma)]).content
    print(f"  📝 {len(xulosalanadi)} xabar xulosalandi · "
          f"{len(saqlanadi)} so'zma-so'z qoldi")
    return {"messages": [RemoveMessage(id=m.id) for m in xulosalanadi],
            "summary": yangi}
```

> ## 🏆🏆 **NIMA UCHUN GIBRID ENG YAXSHI?**
> ```
> ✅ Yaqin kontekst SO'ZMA-SO'Z  →  "sen aytgan grook" ishlaydi
> ✅ Eski kontekst XULOSADA      →  token tejaladi
> ✅ Chegaradan oshganda ISHLAYDI →  ortiqcha chaqiruv YO'Q
> ✅ Muhim faktlar TALAB QILINADI →  raqamlar yo'qolmaydi
> ```
>
> ## 💡 **BU — HAQIQIY MAHSULOTLARDA ISHLATILADIGAN NAQSH** *(ChatGPT, Claude — hammasi shunga o'xshash ishlaydi)*.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `summary` maydonida reducer bormi?

**M2.** Xulosalash tuguni nechta ish qiladi?

**M3.** Promptning eng muhim satri qaysi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## ❌ **Yo'q** — xulosa **almashtiriladi**, to'planmaydi. Bu **to'g'ri**.

**M2.** ## **Uchta:** suhbatni matnga aylantirish · LLM bilan xulosalash · **hamma xabarni o'chirish**.

**M3.** ## *"Build upon the previous summary rather than repeating it"* — usiz xulosa **cheksiz o'sadi**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ To'liq xulosalovchi grafni quring.

<details>
<summary>✅ Yechim</summary>

```python
import operator
from langgraph.graph.message import REMOVE_ALL_MESSAGES

class S(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]

SAVOLLAR = iter(["Kredit foizi?", "Muddat?", "Hujjat?", "Kafil?", "Sug'urta?"])

def ask(s: S) -> S:
    q = next(SAVOLLAR, "yakuniy savol")
    return {"messages": [AIMessage("Savolingiz?"), HumanMessage(q)],
            "burilish": 1}

def bot(s: S) -> S:
    xul = s.get("summary", "")
    kirish = ([SystemMessage(f"Suhbat xulosasi: {xul}")] if xul else []) \
        + list(s["messages"])                        # ⭐ bo'sh bo'lsa QO'SHILMAYDI
    return {"messages": [chat.invoke(kirish)]}

def xulosala(s: S) -> S:
    matn = "".join(f"{m.type}: {m.content}\n" for m in s["messages"])
    kursatma = (f"Oldingi xulosani YANGILANG (takrorlamang).\n"
                f"Raqamlar va ismlarni SAQLANG. Maks 100 so'z.\n\n"
                f"Oldingi: {s.get('summary', '(yo‘q)')}\n\nYangi:\n{matn}")
    yangi = chat.invoke([HumanMessage(kursatma)]).content
    print(f"  📝 {len(s['messages'])} xabar → xulosa")
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)],
            "summary": yangi}

def yol(s: S) -> Literal["xulosala", "__end__"]:
    return "__end__" if s.get("burilish", 0) >= 4 else "xulosala"

g = StateGraph(S)
g.add_node("ask", ask); g.add_node("bot", bot); g.add_node("xulosala", xulosala)
g.add_edge(START, "ask"); g.add_edge("ask", "bot")
g.add_conditional_edges("bot", yol)
g.add_edge("xulosala", "ask")

o = g.compile().invoke(S(messages=[], summary="", burilish=0),
                       {"recursion_limit": 40})
print(f"\nburilish: {o['burilish']} · xabarlar: {len(o['messages'])}")
print(f"xulosa  : {o.get('summary', '')[:100]}")
```

## 🔑 **YAKUNDA XABARLAR SONI KICHIK** — chunki har burilishdan keyin **o'chirilgan**.

</details>

**M5.** ⭐ Uch strategiyaning narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, pandas as pd
ENC = tiktoken.get_encoding("cl100k_base")

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
d["yillik_uz_$"] = (d["yillik_$"] * 1.88).round()        # 🇺🇿 36-modul
print(d.to_string(index=False))
```

```
      usul  chaqiruv  kirish_token
  qo'shish        20         13440
    trim=5        20          3252
xulosalash        40           520
```

## 🏆 **26× TOKEN TEJALDI, LEKIN CHAQIRUV 2× OSHDI.**

</details>

**M6.** ⭐⭐ Faktlarning yo'qolishini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
SUHBAT = [
    HumanMessage("Salom, men Oybek. 50 000 000 so'm kredit olmoqchiman."),
    AIMessage("Salom Oybek! Muddat qancha bo'lsin?"),
    HumanMessage("24 oy."),
    AIMessage("24 oy uchun yillik 24%. Oylik to'lov 2 643 555 so'm."),
]

# ── ① yomon prompt ──
YOMON = "Quyidagi suhbatni qisqacha xulosalang."
# ── ② ⭐ yaxshi prompt ──
YAXSHI = ("Quyidagi suhbatni xulosalang. Xulosada QUYIDAGILARNI ALBATTA "
          "SAQLANG: ismlar, RAQAMLAR, summalar, muddatlar, foizlar va "
          "qabul qilingan qarorlar.")

matn = "".join(f"{m.type}: {m.content}\n" for m in SUHBAT)
FAKTLAR = ["Oybek", "50 000 000", "24 oy", "24%", "2 643 555"]

for nom, p in [("yomon", YOMON), ("yaxshi", YAXSHI)]:
    xul = chat.invoke([HumanMessage(f"{p}\n\n{matn}")]).content
    topildi = [f for f in FAKTLAR if f.replace(" ", "") in xul.replace(" ", "")]
    print(f"  {nom:6s}: {len(topildi)}/{len(FAKTLAR)} fakt saqlandi "
          f"{topildi}")
```

## ⚠️ **SOXTA MODELDA BU SINOV ISHLAMAYDI** — haqiqiy model bilan sinang.

## 🏆 **ENG ISHONCHLI YECHIM — FAKTLARNI `state` DA ALOHIDA SAQLASH:**
```python
class State(MessagesState):
    summary: str
    summa: int          # ⭐ xulosalash TEGMAYDI
    muddat: int         # ⭐ xulosalash TEGMAYDI
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Gibrid xotira menejerini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, time
import pandas as pd
import operator
from langgraph.graph.message import REMOVE_ALL_MESSAGES


class GibridXotira:
    """trim + xulosalash: yaqin kontekst so'zma-so'z, eskisi xulosada."""

    def __init__(self, chat, chegara_token=1500, sozma_soz=6,
                 maks_xulosa_token=200, til="uz"):
        self.chat = chat
        self.chegara = chegara_token
        self.sozma_soz = sozma_soz
        self.maks_xulosa = maks_xulosa_token
        self.koef = 1.88 if til == "uz" else 1.0
        self.enc = tiktoken.get_encoding("cl100k_base")
        self.jurnal = []

    def _tok(self, ms):
        return sum(len(self.enc.encode(str(m.content))) for m in ms)

    # ── xulosalash tuguni ──
    def __call__(self, state):
        xs = list(state["messages"])
        oldin_t = self._tok(xs)

        # ① chegaradan oshmadimi?
        if oldin_t < self.chegara:
            self.jurnal.append({"oldin_n": len(xs), "oldin_tok": oldin_t,
                                "keyin_n": len(xs), "keyin_tok": oldin_t,
                                "llm_chaqiruv": 0, "harakat": "o'tkazildi",
                                "ms": 0})
            return {"messages": []}

        # ② bo'lamiz
        saqlanadi = xs[-self.sozma_soz:]
        xulosalanadi = xs[:-self.sozma_soz]
        if not xulosalanadi:
            return {"messages": []}

        # ③ xulosalaymiz
        t0 = time.perf_counter()
        matn = "".join(f"{m.type}: {m.content}\n" for m in xulosalanadi)
        kursatma = (
            f"Oldingi xulosani YANGILANG — takrorlamang, RIVOJLANTIRING.\n"
            f"Xulosada ALBATTA saqlang: ismlar, raqamlar, summalar, "
            f"muddatlar, foizlar, qabul qilingan qarorlar.\n"
            f"Maksimal {self.maks_xulosa // 2} so'z.\n\n"
            f"Oldingi xulosa:\n{state.get('summary', '(yo‘q)')}\n\n"
            f"Yangi suhbat:\n{matn}")
        yangi = self.chat.invoke([HumanMessage(kursatma)]).content
        chaqiruv = 1

        # ④ xulosa juda uzun bo'lsa — qisqartiramiz
        xt = len(self.enc.encode(yangi))
        if xt > self.maks_xulosa:
            print(f"  ⚠️ xulosa {xt} token — qisqartirilmoqda")
            yangi = self.chat.invoke([HumanMessage(
                f"Quyidagi xulosani {self.maks_xulosa // 3} so'zgacha "
                f"qisqartir, faktlarni saqlab:\n{yangi}")]).content
            chaqiruv += 1

        ms = (time.perf_counter() - t0) * 1000
        keyin_t = self._tok(saqlanadi) + len(self.enc.encode(yangi))
        print(f"  📝 {len(xulosalanadi)} xabar xulosalandi · "
              f"{len(saqlanadi)} so'zma-so'z · "
              f"{oldin_t}→{keyin_t} token")

        self.jurnal.append({"oldin_n": len(xs), "oldin_tok": oldin_t,
                            "keyin_n": len(saqlanadi) + 1,
                            "keyin_tok": keyin_t,
                            "llm_chaqiruv": chaqiruv, "harakat": "xulosalandi",
                            "ms": round(ms)})
        return {"messages": [RemoveMessage(id=m.id) for m in xulosalanadi],
                "summary": yangi}

    # ── chatbot uchun kontekst quruvchi ──
    def kontekst(self, state):
        xul = state.get("summary", "")
        return (([SystemMessage(f"Suhbatning oldingi qismi xulosasi: {xul}")]
                 if xul else []) + list(state["messages"]))

    # ── hisobot ──
    def hisobot(self, kunlik_suhbat=1000):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))

        xul = d[d.harakat == "xulosalandi"]
        otk = d[d.harakat == "o'tkazildi"]
        print(f"\n📊 {len(d)} chaqiruv · {len(xul)} xulosalash · "
              f"{len(otk)} o'tkazildi")
        print(f"   ⭐ o'tkazib yuborish {len(otk)/len(d):.0%} — "
              f"shuncha LLM chaqiruvi TEJALDI")

        if len(xul):
            tejaldi = (xul.oldin_tok - xul.keyin_tok).sum()
            qoshimcha = xul.llm_chaqiruv.sum()
            print(f"\n💰 tejalgan kirish token: {tejaldi}")
            print(f"   qo'shimcha LLM chaqiruv: {qoshimcha}")
            sof = tejaldi / 1e6 * 0.15 * kunlik_suhbat * 365 * self.koef
            print(f"   🇺🇿 yillik tejash ≈ ${sof:,.0f}")
            print(f"   o'rtacha xulosalash vaqti: {xul.ms.mean():.0f} ms")

        # ── tashxis ──
        if len(otk) == 0:
            print("\n⚠️ HAR SAFAR xulosalandi — chegara juda PAST")
        if len(xul) == 0:
            print("\n⚠️ HECH QACHON xulosalanmadi — chegara juda YUQORI")
        if len(xul) and xul.keyin_tok.max() > self.chegara:
            print("\n💥 xulosalashdan KEYIN ham chegaradan oshmoqda — "
                  "sozma_soz ni kamaytiring")
        return d


# ── grafda ──
gx = GibridXotira(chat, chegara_token=150, sozma_soz=4, til="uz")

class S(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]

SAVOL = ("Kredit shartlarini batafsil tushuntiring: foiz, muddat, hujjatlar, "
         "kafil talablari va erta to'lash imkoniyati.")

def ask(s: S) -> S:
    return {"messages": [AIMessage("Savolingiz?"), HumanMessage(SAVOL)],
            "burilish": 1}

def bot(s: S) -> S:
    return {"messages": [chat.invoke(gx.kontekst(s))]}

def yol(s: S) -> Literal["xotira", "__end__"]:
    return "__end__" if s.get("burilish", 0) >= 8 else "xotira"

g = StateGraph(S)
g.add_node("ask", ask); g.add_node("bot", bot); g.add_node("xotira", gx)
g.add_edge(START, "ask"); g.add_edge("ask", "bot")
g.add_conditional_edges("bot", yol)
g.add_edge("xotira", "ask")

o = g.compile().invoke(S(messages=[], summary="", burilish=0),
                       {"recursion_limit": 60})
print(f"\n✅ {o['burilish']} burilish · {len(o['messages'])} xabar qoldi")
gx.hisobot()
```

## 🏆 **UCHTA OPTIMALLASHTIRISH:**
```
① chegaradan oshmasa — LLM CHAQIRILMAYDI  →  💰 chaqiruvlar yarmiga qisqaradi
② oxirgi N ta SO'ZMA-SO'Z qoladi          →  ✅ yaqin kontekst yo'qolmaydi
③ xulosa uzun bo'lsa — QISQARTIRILADI     →  ✅ cheksiz o'sish yo'q
```

## 💥 **`hisobot()` DAGI UCH OGOHLANTIRISH — SOZLASHNING KALITI:**
```
"HAR SAFAR xulosalandi"       →  chegara juda past (💰 isrof)
"HECH QACHON xulosalanmadi"   →  chegara juda yuqori (💰 isrof)
"keyin ham chegaradan oshdi"  →  sozma_soz juda katta
```

</details>

---

## 📌 Xulosa

```python
class State(MessagesState):
    summary: str                    # ⚠️ reducer YO'Q — almashtiriladi

def xulosala(state: State) -> State:
    kursatma = (f"Oldingi xulosani YANGILANG (takrorlamang).\n"
                f"Raqamlar, ismlar, summalarni SAQLANG.\n\n"
                f"Oldingi: {state.get('summary', '')}\n\nYangi:\n{matn}")
    yangi = chat.invoke([HumanMessage(kursatma)]).content
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)],
            "summary": yangi}
```

```
💰 O'LCHANGAN (20 burilish, 1000 suhbat/kun, gpt-4o-mini):
   qo'shish     13 440 token · 20 chaqiruv  →  $736/yil  🇺🇿 $1 384
   trim=5        3 252 token · 20 chaqiruv  →  $178/yil  🇺🇿 $335
   xulosalash      520 token · 40 chaqiruv  →  ⭐ $28/yil  🇺🇿 $53

⚠️ Yashirin xavflar:
   ① xulosa CHEKSIZ o'sishi mumkin  →  maks token qo'ying
   ② faktlar YO'QOLADI              →  promptda ALBATTA talab qiling
   ③ har burilishda xulosalash      →  💰 chegaradan oshganda qiling
```

> ## 🏆🏆 **ENG YAXSHI YECHIM — GIBRID:** oxirgi 6 xabar **so'zma-so'z**, eskisi **xulosada**, va faqat **chegaradan oshganda**.
>
> ## 💥 **VA MUHIM FAKTLARNI `state` MAYDONIDA SAQLANG** — xulosalash ularga **tegmaydi**.

---

⬅️ [5-dars. Qirqish](05-Trimming-Messages.md) · 🏠 [Modul boshiga](README.md) · ➡️ [47-modul. Thread-level persistence](../47-LangGraph-Thread-Level-Persistence/README.md)
