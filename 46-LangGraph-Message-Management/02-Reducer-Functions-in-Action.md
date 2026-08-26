# 2-dars. Reducerlar amalda ⭐⭐

## 🎬 Boshlashdan oldin

> **"Endi notebookda davom etamiz va holat kutganimizdek yangilanayotganini tekshiramiz."**

---

## 1. Tugunlar o'zgaradi

```python
def ask_question(state: State) -> State:

    print(f"\n-------> ENTERING ask_question:")
    for i in state["messages"]:                     # ⭐ YANGI — kirishni ko'ramiz
        i.pretty_print()

    question = "What is your question?"
    print(question)

    return State(messages = [AIMessage(question),   # ⭐ YANGI — savol ham saqlanadi
                             HumanMessage(input())])
```

> ## 🔑 **IKKI MUHIM O'ZGARISH:**
> ```
> ① for loop  →  tugunga NIMA kelayotganini ko'rasiz
> ② AIMessage(question) ham qaytariladi
>    →  ⭐ botning O'Z savoli ham tarixga tushadi
> ```
>
> ## 💡 **NIMA UCHUN BOT SAVOLI HAM SAQLANADI?** Chunki suhbat **to'liq** bo'lsin: model **o'zi nima so'raganini** ko'radi va **takrorlamaydi**.

---

## 2. 💥 Routing funksiyada bitta belgi o'zgaradi

```python
def routing_function(state: State) -> Literal["ask_question", "__end__"]:
    if state["messages"][-1].content == "yes":      # ⭐ [0] EMAS, [-1]
        return "ask_question"
    else:
        return "__end__"
```

> ## 🔑 **KURSNING TUSHUNTIRISHI:** *"Biz har yangi xabarni ro'yxatga qo'shishni kutamiz, shuning uchun BIRINCHISINI emas, OXIRGISINI tekshirishimiz kerak."*
>
> ## 💥 **AGAR UNUTSANGIZ:**
> ```
> state["messages"][0]  →  DOIM birinchi xabar ("What is your question?")
> → routing DOIM "__end__" qaytaradi
> → 💥 SIKL UMUMAN ISHLAMAYDI, va XATO CHIQMAYDI
> ```
>
> ## 🏆 **BU — REDUCER QO'SHGANDA E'TIBOR BERISH KERAK BO'LGAN ASOSIY NARSA.** Reducer state'ni **o'zgartiradi**, shuning uchun unga **bog'liq hamma kod** qayta ko'rib chiqilishi kerak.

---

## 3. 🔬 Natija — o'lchandi

```python
JAVOBLAR = iter(["yes", "yes", "no"])

def ask_another(state: State) -> State:
    j = next(JAVOBLAR, "no")
    print("  -------> ask_another_question →", j)
    return State(messages=[AIMessage("Would you like to ask one more question?"),
                           HumanMessage(j)])

o = gc.invoke(State(messages=[]), {"recursion_limit": 30})
print("  yakuniy xabarlar:", len(o["messages"]))
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

> ## ✅ **15 XABAR SAQLANDI** — 45-modulda **1 ta** edi.
>
> ## 🔑 **HISOB:**
> ```
> 3 burilish × 5 xabar = 15
>   ask_question       →  AI("savol?") + Human("javob")     = 2
>   chatbot            →  AI("javob")                        = 1
>   ask_another        →  AI("yana?") + Human("yes/no")      = 2
> ```

---

## 4. 💥💥 VA ENDI MUAMMO PAYDO BO'LADI

Kurs o'zi keyingi darsda aytadi:

> **"Bunday yondashuv faqat JUDA QISQA muloqotlar uchun maqbul. Uzoq davom etadigan suhbatlar juda ko'p VAQT va TOKEN talab qiladi."**

### 🔬 Biz buni o'lchadik

```python
import tiktoken
ENC = tiktoken.get_encoding("cl100k_base")

SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak bo'ladi?"
JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha. "
         "Daromad spravkasi va pasport nusxasi kerak.")

tarix, kirish = [], 0
for b in range(1, 21):
    tarix += [SAVOL, JAVOB]
    t = sum(len(ENC.encode(x)) for x in tarix)
    kirish += t
    if b in (1, 5, 10, 20):
        print(f"  {b:2d}-burilish: {len(tarix):3d} xabar · {t:5d} token")
print(f"\n20 burilishda JAMI kirish tokeni: {kirish}")
print(f"💰 gpt-4o-mini: ${kirish/1e6*0.15:.5f} · gpt-4o: ${kirish/1e6*2.5:.4f}")
```

```
   1-burilish:   2 xabar ·   67 token
   5-burilish:  10 xabar ·  336 token
  10-burilish:  20 xabar ·  672 token
  20-burilish:  40 xabar · 1344 token

20 burilishda JAMI kirish tokeni: 13440
💰 gpt-4o-mini: $0.00202 · gpt-4o: $0.0336
```

> ## 💥💥 **DIQQAT — IKKI XIL O'SISH:**
> ```
> Kontekst (bir chaqiruvda)  →  CHIZIQLI:   67 → 1344 token
> JAMI narx (20 burilishda)  →  ⭐ KVADRATIK: 13 440 token
> ```
>
> ## 🔑 **NIMA UCHUN KVADRATIK?** Har burilishda **BUTUN tarix** qayta yuboriladi:
> ```
> 67 + 134 + 202 + ... + 1344  =  13 440
> ```
>
> ## 💰 **1000 SUHBAT/KUN, gpt-4o-mini:**
> ```
> $0.00202 × 1000 × 365  ≈  $737/yil
> ```
> **gpt-4o bilan** — **$12 264/yil**. Bu — **arxitektura qarori**.

---

## 5. ⭐⭐ Uch strategiyaning o'lchangan narxi

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
> ✅ Token narxi   →  26× arzon
> ⚠️ Kechikish     →  2× sekin
> ⚠️ Chaqiruv narxi →  ba'zi provayderlar SO'ROV uchun ham oladi
> ```
>
> ## 🔑 **QAROR QOIDASI:**
> ```
> suhbat < 10 burilish   →  qo'shish YETADI (eng sodda)
> suhbat 10–50 burilish  →  ⭐ trim
> suhbat > 50 burilish   →  ⭐⭐ xulosalash
> ```

---

## 6. 🇺🇿 O'zbekcha suhbat — narx 1.88×

```python
UZ_SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak bo'ladi?"
EN_SAVOL = "What is the loan interest rate and what documents are required?"

for nom, m in [("🇺🇿", UZ_SAVOL), ("🇬🇧", EN_SAVOL)]:
    print(f"  {nom} {len(ENC.encode(m)):3d} token · {len(m):3d} belgi")
```

> ## 💰 **YUQORIDAGI $737/YIL — INGLIZCHA UCHUN.**
>
> ## 💥 **O'ZBEKCHADA ≈ $1 385/YIL** *(36-modulda o'lchangan 1.88× nisbat bilan)*.
>
> ## 🏆 **YA'NI 🇺🇿 LOYIHALARDA `trim` YOKI `xulosalash` — TANLOV EMAS, ZARURAT.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Routing funksiyada nima o'zgardi?

**M2.** Nima uchun `AIMessage(question)` ham qaytariladi?

**M3.** 3 burilishda nechta xabar to'planadi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `[0]` → `[-1]` — **oxirgi** xabar tekshiriladi.

**M2.** Suhbat **to'liq** bo'lsin — model **o'zi nima so'raganini** ko'rsin.

**M3.** ## **15** *(3 × 5)*.

</details>

### 🟡 O'rta

**M4.** ⭐ To'liq siklli grafni reducerli qilib quring.

<details>
<summary>✅ Yechim</summary>

```python
JAVOBLAR = iter(["yes", "yes", "no"])

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def ask(s: S) -> S:
    print("  → ask_question")
    q = "What is your question?"
    return {"messages": [AIMessage(q),
                         HumanMessage(f"Savol {len(s['messages'])}")]}

def bot(s: S) -> S:
    print(f"  → chatbot ({len(s['messages'])} xabar kirdi)")
    return {"messages": [chat.invoke(s["messages"])]}

def yana(s: S) -> S:
    j = next(JAVOBLAR, "no")
    print("  → ask_another →", j)
    return {"messages": [AIMessage("Yana savolmi?"), HumanMessage(j)]}

def yol(s: S) -> Literal["ask_question", "__end__"]:
    return "ask_question" if s["messages"][-1].content == "yes" else "__end__"

g = StateGraph(S)
g.add_node("ask_question", ask); g.add_node("chatbot", bot)
g.add_node("ask_another_question", yana)
g.add_edge(START, "ask_question"); g.add_edge("ask_question", "chatbot")
g.add_edge("chatbot", "ask_another_question")
g.add_conditional_edges("ask_another_question", yol)

o = g.compile().invoke(S(messages=[]), {"recursion_limit": 30})
print(f"\n✅ {len(o['messages'])} xabar")
for m in o["messages"]:
    print(f"    {m.type:6s} {str(m.content)[:44]}")
```

## 🔑 **`chatbot` GA KIRUVCHI XABARLAR SONI HAR BURILISHDA O'SADI:** 2 → 7 → 12.

</details>

**M5.** ⭐⭐ Kontekst o'sishining narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, pandas as pd
ENC = tiktoken.get_encoding("cl100k_base")

SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak bo'ladi?"
JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha. "
         "Daromad spravkasi va pasport nusxasi kerak.")

tarix, q, kirish = [], [], 0
for b in range(1, 21):
    tarix += [SAVOL, JAVOB]
    t = sum(len(ENC.encode(x)) for x in tarix)
    kirish += t
    if b in (1, 5, 10, 20):
        q.append({"burilish": b, "xabar": len(tarix), "kontekst_token": t,
                  "jami_kirish": kirish})
print(pd.DataFrame(q).to_string(index=False))
print(f"\n💰 20 burilish: gpt-4o-mini ${kirish/1e6*0.15:.5f} · "
      f"gpt-4o ${kirish/1e6*2.5:.4f}")
print(f"💰 1000 suhbat/kun × 365: "
      f"${kirish/1e6*0.15*1000*365:,.0f}/yil (gpt-4o-mini)")
print(f"🇺🇿 o'zbekchada ≈ ${kirish/1e6*0.15*1000*365*1.88:,.0f}/yil")
```

## 💥 **KONTEKST CHIZIQLI, JAMI NARX — KVADRATIK.**

</details>

**M6.** ⭐ `[0]` xatosini grafda ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
JAVOBLAR = iter(["yes", "yes", "no"])

def yol_notogri(s):
    return "ask" if s["messages"][0].content == "yes" else "__end__"

def yol_togri(s):
    return "ask" if s["messages"][-1].content == "yes" else "__end__"

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def qur(yol):
    J = iter(["yes", "yes", "no"])
    g = StateGraph(S)
    g.add_node("ask", lambda s: {"messages": [AIMessage("savol?"),
                                              HumanMessage("javob")]})
    g.add_node("yana", lambda s: {"messages": [AIMessage("yana?"),
                                               HumanMessage(next(J, "no"))]})
    g.add_edge(START, "ask"); g.add_edge("ask", "yana")
    g.add_conditional_edges("yana", yol)
    return g.compile()

for nom, y in [("[0]  noto'g'ri", yol_notogri), ("[-1] to'g'ri", yol_togri)]:
    o = qur(y).invoke(S(messages=[]), {"recursion_limit": 30})
    print(f"  {nom}: {len(o['messages'])} xabar")
```

```
  [0]  noto'g'ri: 4 xabar    ← 💥 sikl BIR MARTA ham aylanmadi
  [-1] to'g'ri : 12 xabar   ← ✅ uch marta aylandi
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Kontekst kuzatuvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, time
import pandas as pd


class KontekstKuzatuvchi:
    """Har LLM chaqiruvida kontekst hajmini va narxini o'lchaydi."""

    NARX = {"gpt-4o-mini": (0.15, 0.60), "gpt-4o": (2.50, 10.00)}

    def __init__(self, chat, model="gpt-4o-mini", ogohlantirish_token=4000,
                 til="uz"):
        self.chat = chat
        self.model = model
        self.chegara = ogohlantirish_token
        self.koef = 1.88 if til == "uz" else 1.0
        self.enc = tiktoken.get_encoding("cl100k_base")
        self.yozuvlar = []

    def _tok(self, xabarlar):
        return sum(len(self.enc.encode(str(m.content))) for m in xabarlar)

    def invoke(self, xabarlar, **kw):
        t = self._tok(xabarlar)
        t0 = time.perf_counter()
        r = self.chat.invoke(xabarlar, **kw)
        ms = (time.perf_counter() - t0) * 1000
        chiqish_t = self._tok([r])

        nk, nc = self.NARX[self.model]
        narx = t / 1e6 * nk + chiqish_t / 1e6 * nc

        self.yozuvlar.append({"chaqiruv": len(self.yozuvlar) + 1,
                              "xabar": len(xabarlar),
                              "kirish_tok": t, "chiqish_tok": chiqish_t,
                              "narx_$": round(narx, 6), "ms": round(ms)})
        if t > self.chegara:
            print(f"  ⚠️ kontekst {t} token — chegara {self.chegara} "
                  f"→ trim yoki xulosalash kerak")
        return r

    def __getattr__(self, nom):
        return getattr(self.chat, nom)

    def hisobot(self, kunlik_suhbat=1000):
        if not self.yozuvlar:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.yozuvlar)
        print(d.to_string(index=False))

        jami = d["narx_$"].sum()
        print(f"\n📊 {len(d)} chaqiruv · {d.kirish_tok.sum()} kirish token")
        print(f"   1 suhbat : ${jami:.6f}")
        print(f"   kunlik   : ${jami * kunlik_suhbat:.2f}")
        print(f"   yillik   : ${jami * kunlik_suhbat * 365:,.0f}")
        print(f"   🇺🇿 o'zbekchada (×{self.koef}): "
              f"${jami * kunlik_suhbat * 365 * self.koef:,.0f}/yil")

        # ── tashxis ──
        osish = d.kirish_tok.iloc[-1] / max(1, d.kirish_tok.iloc[0])
        print(f"\n📈 kontekst {d.kirish_tok.iloc[0]} → "
              f"{d.kirish_tok.iloc[-1]} token ({osish:.1f}×)")
        if osish > 3:
            print("   💥 KESKIN O'SMOQDA — trim yoki xulosalash SHART")
        if d.kirish_tok.max() > self.chegara:
            print(f"   ⚠️ maksimum {d.kirish_tok.max()} > {self.chegara}")

        # ── kvadratik o'sish tekshiruvi ──
        if len(d) >= 3:
            farqlar = d.kirish_tok.diff().dropna()
            if (farqlar > 0).all():
                print("   📐 har chaqiruvda kontekst O'SMOQDA — "
                      "bu KVADRATIK narx demak")
        return d


kk = KontekstKuzatuvchi(chat, ogohlantirish_token=200, til="uz")

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak bo'ladi?"

def ask(s): return {"messages": [AIMessage("Savolingiz?"), HumanMessage(SAVOL)]}
def bot(s): return {"messages": [kk.invoke(list(s["messages"]))]}

g = StateGraph(S)
g.add_node("ask", ask); g.add_node("bot", bot)
g.add_edge(START, "ask"); g.add_edge("ask", "bot"); g.add_edge("bot", END)
gc = g.compile(checkpointer=InMemorySaver())

cfg = {"configurable": {"thread_id": "kuzatuv"}}
for _ in range(8):
    gc.invoke(S(messages=[]), cfg)
kk.hisobot()
```

## 🏆 **`__getattr__` — O'RAM NAQSHI.** `batch`, `stream` — hammasi asl modelga o'tadi, faqat `invoke` **o'lchanadi**.

## 💥 **"har chaqiruvda kontekst O'SMOQDA — bu KVADRATIK narx demak"** — bu ogohlantirish **eng muhimi**.

</details>

---

## 📌 Xulosa

```python
def routing_function(state) -> Literal["ask_question", "__end__"]:
    if state["messages"][-1].content == "yes":     # ⭐ [0] EMAS
        return "ask_question"
    return "__end__"
```

```
✅ 3 burilish → 15 xabar saqlandi (45-modulda 1 ta edi)
💥 [0] ishlatsangiz → sikl UMUMAN ishlamaydi, xato CHIQMAYDI

🔬 20 burilish:  40 xabar · 1344 token kontekst · 13 440 token JAMI
💰 gpt-4o-mini  →  $737/yil  ·  🇺🇿 o'zbekchada  ≈  $1 385/yil

qo'shish   13 440 token · 20 chaqiruv
trim=5      3 252 token · 20 chaqiruv     ⭐ 4× arzon
xulosalash    520 token · 40 chaqiruv     ⭐⭐ 26× arzon, 2× chaqiruv
```

> ## 🏆 **REDUCER QO'SHGANDA — UNGA BOG'LIQ HAMMA KODNI QAYTA KO'RIB CHIQING.** `[0]` → `[-1]` — bunga misol.

---

⬅️ [1-dars. Annotated va reducer](01-Annotated-and-Reducer-Functions.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. MessagesState](03-The-MessagesState-Class.md)
