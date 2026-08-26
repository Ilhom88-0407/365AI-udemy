# 5-dars. Xabarlarni qirqish (trimming) ⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu tugun ro'yxatda faqat OXIRGI BESH xabarni qoldirish uchun mas'ul bo'ladi."**

---

## 1. Yangi tugun

```python
def trim_messages(state: MessagesState) -> MessagesState:
    print(f"\n-------> ENTERING trim_messages:")

    remove_messages = [RemoveMessage(id=i.id) for i in state["messages"][:-5]]

    return MessagesState(messages=remove_messages)
```

> ## 💥💥 **DIQQAT — FUNKSIYA NOMI `trim_messages`.**
>
> ## ⚠️ **LEKIN `langchain_core.messages` DA HAM AYNAN SHU NOMDA FUNKSIYA BOR** *(4-darsda ko'rdik)*.
>
> ```python
> from langchain_core.messages import trim_messages     # ⚠️ LangChain'niki
>
> def trim_messages(state):                             # 💥 UNI BERKITADI
>     ...
> ```
>
> ## 🏆 **BOSHQA NOM BERING:** `qirqish`, `trim_node`, `xabarlarni_qirq`.

---

## 2. Routing o'zgaradi

```python
def routing_function(state: MessagesState) -> Literal["trim_messages", "__end__"]:
    if state["messages"][-1].content == "yes":
        return "trim_messages"                # ⭐ ask_question EMAS
    else:
        return "__end__"
```

```python
graph.add_node("trim_messages", trim_messages)
graph.add_edge("trim_messages", "ask_question")     # ⭐ trimdan keyin savolga
```

```
[START] → [ask_question] → [chatbot] → [ask_another_question]
              ↑                                  │
              │                            ha ───┤─── yo'q
        [trim_messages] ←────────────────────────┘        ↓
                                                       [END]
```

> ## 🔑 **TRIM — SIKLNING ICHIDA, SAVOLDAN OLDIN.** Ya'ni **keyingi savolga** allaqachon **qisqartirilgan** tarix boradi.

---

## 3. 🔬 Natijani o'lchadik

```python
import tiktoken
ENC = tiktoken.get_encoding("cl100k_base")
tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

q = []
for nom, trim_n in [("trim YO'Q", None), ("trim=5", 5)]:
    gcx, S = qur(trim_n)
    cfg = {"configurable": {"thread_id": nom}}
    for burilish in range(1, 11):
        o = gcx.invoke(S(messages=[]), cfg)
        if burilish in (1, 3, 5, 10):
            q.append({"variant": nom, "burilish": burilish,
                      "xabar": len(o["messages"]), "token": tok(o["messages"])})
print(pd.DataFrame(q).pivot(index="burilish", columns="variant",
                            values=["xabar", "token"]).to_string())
```

```
             xabar            token
variant  trim YO'Q trim=5 trim YO'Q trim=5
burilish
1                3      3        59     59
3                9      5       177    113
5               15      5       295    113
10              30      5       590    113
```

> ## ✅ **10-BURILISHDA: 590 → 113 TOKEN — 5.2× FARQ.**
>
> ## 🔑 **VA E'TIBOR BERING — `trim=5` DA TOKEN 3-BURILISHDAN KEYIN O'SMAYDI.** Bu — **bashorat qilinadigan narx**.
>
> ## 💥 **`trim YO'Q` DA ESA — CHEKSIZ O'SISH.** 100-burilishda **~5900 token**.

---

## 4. 💥💥 Ma'no yo'qolishi — kurs o'zi ko'rsatadi

> **"Agar Pit Heyn haqida uning ismini aytmasdan savol bersangiz — chatbot kim haqida gapirayotganingizni biladi. Lekin 'sen aytgan grookni eslaysanmi?' deb so'rasangiz — chatbot inkor javob beradi va HATTO O'SHA GROOKNI QAYTA AYTIB BERISHI mumkin."**

```
✅ "U qayerda tug'ilgan?"           →  ishlaydi (mavzu oxirgi 5 ta ichida)
💥 "Sen aytgan grookni eslaysanmi?" →  ishlamaydi (o'chirilgan)
💥 Va model buni BILMAYDI — u O'SHA grookni QAYTA aytadi
```

> ## 🏆 **KURSNING XULOSASI TO'G'RI:** *"trim — suhbat MAVZUSI TEZ-TEZ TILGA OLINADIGAN holatlar uchun qulay"*.
>
> ## ⚠️ **VA ENG XAVFLI QISMI:** model **nimadir yo'qolganini bilmaydi** — u **ishonch bilan** noto'g'ri javob beradi.

### ✅ Yumshatish — trim haqida modelga aytish

```python
def qirqish(state: MessagesState) -> MessagesState:
    xabarlar = state["messages"]
    if len(xabarlar) <= 5:
        return {"messages": []}

    ochirildi = len(xabarlar) - 5
    rm = [RemoveMessage(id=m.id) for m in xabarlar[:-5]]
    # ⭐ modelga OGOHLANTIRISH qoldiramiz
    ogoh = SystemMessage(
        f"[Eslatma: suhbatning oldingi {ochirildi} ta xabari o'chirilgan. "
        f"Agar foydalanuvchi eski narsani so'rasa — bilmasligingizni ayting, "
        f"TAXMIN QILMANG.]")
    return {"messages": rm + [ogoh]}
```

> ## 🏆 **BU — YOLG'ON TO'QISHNI KAMAYTIRADI** *(42-modul, 18-darsdagi muammo)*.

---

## 5. ⭐⭐ Uch xil trim — solishtirdik

| Usul | Qanday | Muammo |
|---|---|---|
| ## `[:-5]` *(kurs)* | Oxirgi **5 xabar** | ## 💥 uzun xabar **chegarani buzadi** · system **o'chadi** |
| ## Token bo'yicha | Oxirgi **N token** | ## ⚠️ system o'chishi mumkin · **juftlik** buzilishi mumkin |
| ## ⭐ `trim_messages()` | Token + `include_system` + `start_on` | ## 🏆 **hech biri** |

```python
from langchain_core.messages import trim_messages as lc_trim

def qirqish(state: MessagesState) -> MessagesState:
    saqlanadi = lc_trim(state["messages"], max_tokens=2000, strategy="last",
                        token_counter=tok, include_system=True,
                        start_on="human")
    saqlanadi_id = {m.id for m in saqlanadi}
    rm = [RemoveMessage(id=m.id) for m in state["messages"]
          if m.id not in saqlanadi_id]
    if rm:
        print(f"  ✂️ {len(rm)} o'chirildi · {len(saqlanadi)} qoldi "
              f"({tok(saqlanadi)} token)")
    return {"messages": rm}
```

> ## 💥 **`[:-5]` NING ENG XAVFLI OQIBATI — `SystemMessage` NING O'CHISHI.**
>
> ## 🇺🇿 **VA BU O'ZBEKCHA BOTDA HAL QILUVCHI:** system xabarda *"O'zbek tilida javob bering"* yozilgan. U o'chsa — model **inglizchaga o'tib ketadi**.

---

## 6. ⭐ Trim tugun sifatida yoki reducer sifatida?

```python
# ① TUGUN (kursning yo'li)
graph.add_node("qirqish", qirqish)
graph.add_edge("qirqish", "ask_question")

# ② ⭐ REDUCER (1-darsda ko'rdik)
class State(TypedDict):
    messages: Annotated[list, oxirgi_n(5)]        # AVTOMATIK
```

| | Tugun | Reducer |
|---|---|---|
| Ko'rinadimi | ## ✅ **grafda** | ## ❌ yashirin |
| Nazorat | ## ✅ **qachon ishlashini siz hal qilasiz** | har yangilanishda |
| Jurnal | ## ✅ oson | qiyin |
| Kod hajmi | ko'proq | ## ⭐ **kamroq** |
| Shartli mantiq | ## ✅ **bemalol** | cheklangan |

> ## 🏆 **TAVSIYA: TUGUN.** Chunki trim — **muhim qaror**, u **ko'rinib turishi** kerak.
>
> ## 💡 **REDUCER — QAT'IY CHEKLOV UCHUN** *(masalan, "hech qachon 100 xabardan oshmasin")* — **himoya qatlami** sifatida.

---

## 7. 🇺🇿 Amaliy tavsiyalar

```
📏 QANCHA SAQLASH KERAK?
   Qo'llab-quvvatlash boti   →  oxirgi 6–10 xabar  (mavzu tez o'zgaradi)
   Maslahat beruvchi          →  oxirgi 15–20      (kontekst muhim)
   Ko'p qadamli forma         →  ⭐ TRIM QILMANG   (hamma javob kerak)

💰 TOKEN CHEGARASI (🇺🇿 1.88× hisobga olib):
   gpt-4o-mini  →  4000 token   (🇺🇿 ~2100 inglizcha ekvivalenti)
   gpt-4o       →  8000 token
   Ollama 7B    →  2000 token   (mahalliy modellar kontekst oynasi kichik)

⚠️ DOIM SAQLANG:
   ✅ SystemMessage  (til va ko'rsatma)
   ✅ Foydalanuvchi profili  (state'da alohida maydonda, messages'da EMAS)
```

> ## 🏆🏆 **ENG MUHIM MASLAHAT: MUHIM MA'LUMOTNI `messages` DA EMAS, ALOHIDA MAYDONDA SAQLANG.**
> ```python
> class State(MessagesState):
>     til: str                    # ⭐ trim TEGMAYDI
>     foydalanuvchi_ism: str      # ⭐ trim TEGMAYDI
>     summa: int                  # ⭐ trim TEGMAYDI
> ```
> Shunda trim **faqat suhbatni** qisqartiradi, **ma'lumotni** emas.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Trim tuguni nima qaytaradi?

**M2.** Trim qayerga qo'yiladi?

**M3.** Kursning funksiya nomida qanday muammo bor?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `RemoveMessage` **ro'yxati** — reducer ularni **qo'llaydi**.

**M2.** ## **Sikl ichida**, `ask_question` dan **oldin**.

**M3.** ## `langchain_core.messages.trim_messages` ni **berkitadi**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Trimli va trimsiz grafni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, pandas as pd
ENC = tiktoken.get_encoding("cl100k_base")
tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

SAVOL = "Kredit foizi qancha va qanday hujjatlar kerak?"

def qur(trim_n=None):
    class S(MessagesState):
        pass

    def ask(s): return {"messages": [AIMessage("Savolingiz?"),
                                     HumanMessage(SAVOL)]}
    def bot(s): return {"messages": [chat.invoke(s["messages"])]}
    def qirq(s):
        return {"messages": [RemoveMessage(id=m.id)
                             for m in s["messages"][:-trim_n]]}

    g = StateGraph(S)
    g.add_node("ask", ask); g.add_node("bot", bot)
    g.add_edge(START, "ask"); g.add_edge("ask", "bot")
    if trim_n:
        g.add_node("qirq", qirq)
        g.add_edge("bot", "qirq"); g.add_edge("qirq", END)
    else:
        g.add_edge("bot", END)
    return g.compile(checkpointer=InMemorySaver()), S

q = []
for nom, tn in [("trim YO'Q", None), ("trim=5", 5)]:
    gcx, S = qur(tn)
    cfg = {"configurable": {"thread_id": nom}}
    for b in range(1, 11):
        o = gcx.invoke(S(messages=[]), cfg)
        if b in (1, 3, 5, 10):
            q.append({"variant": nom, "burilish": b,
                      "xabar": len(o["messages"]), "token": tok(o["messages"])})
d = pd.DataFrame(q)
print(d.pivot(index="burilish", columns="variant",
              values=["xabar", "token"]).to_string())

oxirgi = d[d.burilish == 10]
yoq = oxirgi[oxirgi.variant == "trim YO'Q"].token.iloc[0]
bor = oxirgi[oxirgi.variant == "trim=5"].token.iloc[0]
print(f"\n10-burilish: {yoq} → {bor} token  ({yoq/bor:.1f}× farq)")
```

</details>

**M5.** ⭐ `SystemMessage` ning o'chishini ko'rsating.

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

# ── kursning usuli ──
rm = [RemoveMessage(id=m.id) for m in xs[:-5]]
q1 = add_messages(xs, rm)
print("[:-5]  :", [m.type for m in q1],
      "→ system", "BOR ✅" if any(m.type == "system" for m in q1) else "YO'Q 💥")

# ── ⭐ to'g'ri usul ──
from langchain_core.messages import trim_messages as lc_trim
tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)
saqlanadi = lc_trim(xs, max_tokens=40, strategy="last", token_counter=tok,
                    include_system=True, start_on="human")
print("lc_trim:", [m.type for m in saqlanadi],
      "→ system", "BOR ✅" if any(m.type == "system" for m in saqlanadi)
      else "YO'Q 💥")
```

## 💥 **🇺🇿 SYSTEM XABAR O'CHSA — MODEL INGLIZCHAGA O'TIB KETADI.**

</details>

**M6.** ⭐⭐ Ogohlantiruvchi trim yozing.

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
    print(f"  ✂️ {n} xabar o'chirildi + ogohlantirish qo'shildi")
    return {"messages": rm + [ogoh]}
```

## 🏆 **MODEL "BILMAYMAN" DEYISHI — YOLG'ON TO'QISHDAN YAXSHIROQ** *(42-modul, 18-dars)*.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Trim sifat o'lchagichini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
import pandas as pd
from langchain_core.messages import trim_messages as lc_trim


class TrimSifat:
    """Uch trim strategiyasini SIFAT va NARX bo'yicha solishtiradi."""

    def __init__(self, maks_token=200, til="uz"):
        self.maks = maks_token
        self.koef = 1.88 if til == "uz" else 1.0
        self.enc = tiktoken.get_encoding("cl100k_base")

    def _tok(self, ms):
        return sum(len(self.enc.encode(str(m.content))) for m in ms)

    # ── strategiyalar: SAQLANADIGAN xabarlarni qaytaradi ──
    def _son(self, xs, n=5):
        return list(xs[-n:])

    def _token(self, xs):
        saqla, jami = [], 0
        for m in reversed(xs):
            t = len(self.enc.encode(str(m.content)))
            if jami + t > self.maks:
                break
            saqla.append(m); jami += t
        return list(reversed(saqla))

    def _aqlli(self, xs):
        try:
            return list(lc_trim(xs, max_tokens=self.maks, strategy="last",
                                token_counter=self._tok, include_system=True,
                                start_on="human"))
        except Exception:
            return self._token(xs)

    # ── sifat mezonlari ──
    def _baho(self, asl, qolgan):
        return {
            "xabar": len(qolgan),
            "token": self._tok(qolgan),
            "chegaradan_oshdi": self._tok(qolgan) > self.maks,
            "system_saqlandi": (any(m.type == "system" for m in qolgan)
                                if any(m.type == "system" for m in asl)
                                else None),
            "human_dan_boshlandi": (qolgan[0].type == "human"
                                    if qolgan else False),
            "juftlik_butun": self._juftlik(qolgan),
        }

    @staticmethod
    def _juftlik(xs):
        """Har human'dan keyin ai keladimi?"""
        turlar = [m.type for m in xs if m.type in ("human", "ai")]
        if not turlar:
            return True
        for i in range(0, len(turlar) - 1, 2):
            if turlar[i] != "human" or turlar[i + 1] != "ai":
                return False
        return True

    def taqqosla(self, xabarlar, kunlik_suhbat=1000, burilish=20):
        asl_tok = self._tok(xabarlar)
        q = [{"strategiya": "trim YO'Q", **self._baho(xabarlar, xabarlar)}]
        for nom, f in [("son (-5)", self._son), ("token", self._token),
                       ("aqlli", self._aqlli)]:
            qolgan = f(xabarlar)
            q.append({"strategiya": nom, **self._baho(xabarlar, qolgan)})

        d = pd.DataFrame(q)
        d["tejaldi_%"] = ((1 - d.token / asl_tok) * 100).round(1)
        print(f"asl: {len(xabarlar)} xabar · {asl_tok} token · "
              f"chegara {self.maks}\n")
        print(d.to_string(index=False))

        # ── narx ──
        print("\n── 💰 yillik narx (gpt-4o-mini, "
              f"{kunlik_suhbat} suhbat/kun × {burilish} burilish) ──")
        for _, r in d.iterrows():
            yillik = (r.token * burilish / 1e6 * 0.15 * kunlik_suhbat * 365
                      * self.koef)
            print(f"  {r.strategiya:12s} ${yillik:9,.0f}  🇺🇿")

        # ── tavsiya ──
        yaroqli = d[(~d.chegaradan_oshdi) &
                    (d.system_saqlandi.isin([True, None]))]
        print()
        if len(yaroqli) <= 1:
            print("💥 FAQAT bitta strategiya sifat mezonlaridan o'tdi")
        eng = yaroqli.iloc[-1] if len(yaroqli) else d.iloc[-1]
        print(f"🏆 TAVSIYA: {eng.strategiya} — "
              f"{eng.token} token, {eng['tejaldi_%']}% tejadi")

        # ── ogohlantirishlar ──
        for _, r in d.iterrows():
            if r.system_saqlandi is False:
                print(f"  💥 '{r.strategiya}': SystemMessage O'CHDI — "
                      f"🇺🇿 model tilni unutadi")
            if r.chegaradan_oshdi and r.strategiya != "trim YO'Q":
                print(f"  💥 '{r.strategiya}': chegaradan OSHDI "
                      f"({r.token} > {self.maks})")
            if not r.juftlik_butun and r.strategiya != "trim YO'Q":
                print(f"  ⚠️ '{r.strategiya}': savol-javob juftligi BUZILGAN")
        return d


UZUN = "Bu juda uzun tushuntirish bo'lib, ko'p token yeydi. " * 15
XABARLAR = add_messages([], [
    SystemMessage("Siz bank yordamchisisiz. FAQAT O'ZBEK TILIDA javob bering."),
    HumanMessage("Salom, men Oybek."), AIMessage("Salom Oybek!"),
    HumanMessage("Kredit shartlarini batafsil tushuntiring."), AIMessage(UZUN),
    HumanMessage("Foiz qancha?"), AIMessage("Yillik 24% dan boshlanadi."),
    HumanMessage("Muddat?"), AIMessage("24 oygacha."),
    HumanMessage("Hujjat?"), AIMessage("Pasport va daromad spravkasi.")])

TrimSifat(maks_token=100, til="uz").taqqosla(XABARLAR)
```

## 🏆 **TO'RTTA SIFAT MEZONI:**
```
chegaradan_oshdi     →  💥 narx nazoratdan chiqadi
system_saqlandi      →  💥 🇺🇿 model tilni va ko'rsatmani unutadi
human_dan_boshlandi  →  ⚠️ ba'zi modellar javobsiz AI xabarni yoqtirmaydi
juftlik_butun        →  ⚠️ suhbat tuzilishi buzilgan
```

## 💥 **`son (-5)` ODATDA IKKI MEZONDA YIQILADI:** system o'chadi **va** uzun xabar chegarani buzadi.

</details>

---

## 📌 Xulosa

```python
def qirqish(state: MessagesState) -> MessagesState:      # ⚠️ trim_messages EMAS
    saqlanadi = lc_trim(state["messages"], max_tokens=2000, strategy="last",
                        token_counter=tok, include_system=True,
                        start_on="human")
    saqlanadi_id = {m.id for m in saqlanadi}
    return {"messages": [RemoveMessage(id=m.id) for m in state["messages"]
                         if m.id not in saqlanadi_id]}
```

```
🔬 10-burilish:  trim yo'q 30 xabar/590 token  ·  trim=5  5 xabar/113 token
   → 5.2× farq · va trim=5 da token 3-burilishdan keyin O'SMAYDI

💥 [:-5] muammolari:  SystemMessage o'chadi · uzun xabar chegarani buzadi
💥 Ma'no yo'qoladi:  "sen aytgan grookni eslaysanmi?" → model TAXMIN qiladi
✅ Ogohlantirish qo'shing: "[oldingi N xabar o'chirilgan — taxmin qilmang]"
```

> ## 🏆🏆 **ENG MUHIM MASLAHAT: MUHIM MA'LUMOTNI `messages` DA EMAS, ALOHIDA `state` MAYDONIDA SAQLANG.** Trim unga **tegmaydi**.

---

⬅️ [4-dars. RemoveMessage](04-The-RemoveMessage-Class.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. Xabarlarni xulosalash](06-Summarizing-Messages.md)
