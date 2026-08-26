# 3-dars. State va tugunni aniqlash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Grafning holatini aniqlashdan boshlaymiz — u tugundan tugunga uzatiladi va yo'lda yangilanadi."**

---

## 1. State sxemasi

```python
from typing_extensions import TypedDict
from collections.abc import Sequence
from langchain_core.messages import BaseMessage

class State(TypedDict):
    messages: Sequence[BaseMessage]
```

```python
state = State(messages=[HumanMessage("Could you tell me a grook by Piet Hein?")])
print(state)
print()
state["messages"][0].pretty_print()
```

```
{'messages': [HumanMessage(content='Could you tell me a grook by Piet Hein?', ...)]}

================================ Human Message =================================

Could you tell me a grook by Piet Hein?
```

> ## 💡 **`pretty_print()` — `BaseMessage` NING QULAY METODI.** Butun bo'lim davomida **tez-tez** ishlatiladi.
>
> ## 🔑 **BU METOD 39-MODULDA HAM BOR EDI** — LangChain'ning **umumiy** metodi.

---

## 2. Model

```python
chat = ChatOpenAI(model="gpt-4o",
                  seed=365,
                  temperature=0,
                  max_completion_tokens=100)
```

| Parametr | Nima uchun |
|---|---|
| `model="gpt-4o"` | ## ⚠️ **Qimmat** — `gpt-4o-mini` **17× arzon** |
| `seed=365` | ## Takrorlanuvchanlik *(kafolat emas — 38-modul)* |
| ## `temperature=0` | ## ⭐ **To'g'ri tanlov** — bot **barqaror** bo'lsin |
| `max_completion_tokens=100` | ## ⭐ **Narxni cheklaydi** |

> ## ⭐⭐ **BIZNING VARIANT — KALITSIZ:**
> ```python
> from langchain_core.language_models.fake_chat_models import FakeListChatModel
>
> chat = FakeListChatModel(responses=[
>     "Grook: The road to wisdom? Well, it's plain and simple to express.",
>     "Piet Hein was born in Copenhagen, Denmark, on December 16, 1905."] * 30)
> ```

---

## 3. Tugun — bu oddiy funksiya

```python
def chatbot(state: State) -> State:

    print(f"\n-------> ENTERING chatbot:")

    response = chat.invoke(state["messages"])
    response.pretty_print()

    return State(messages=[response])
```

> ## 🔑 **UCHTA QISM:**
> ```
> ① state: State      →  kirish — GRAFNING HOLATI
> ② -> State          →  chiqish — YANGILANISH
> ③ print(...)        →  ⭐ tugunlar ko'payganda HAL QILUVCHI
> ```
>
> ## 🏆 **KURSNING MASLAHATI TO'G'RI:** *"bunday `print` tugunlar soni ko'payganda ayniqsa foydali bo'ladi"*.
>
> ## ⭐ **BIZNING TAKOMILLASHTIRISH — `print` O'RNIGA `logging`:**
> ```python
> import logging
> logging.basicConfig(level=logging.INFO,
>                     format="%(asctime)s | %(message)s")
> log = logging.getLogger("graf")
>
> def chatbot(state: State) -> State:
>     log.info("→ chatbot  (%d xabar)", len(state["messages"]))
>     ...
> ```
> **Ishlab chiqarishda `print` — jurnalga tushmaydi**, `logging` — **tushadi**.

---

## 4. 💥💥 ENG MUHIM QISM — funksiyani sinash

```python
chatbot(state)
```

```
-------> ENTERING chatbot:

================================== Ai Message ==================================

Grook: The road to wisdom? Well, it's plain and simple to express.

{'messages': [AIMessage(content="Grook: The road to wisdom?...", ...)]}
```

> ## 💥💥💥 **KURSNING O'Z SO'ZLARI:**
> ## **"Oldingi HUMAN MESSAGE endi model bergan AI MESSAGE bilan ALMASHTIRILGAN."**
>
> ## 🔑 **KURS BUNI FAKT SIFATIDA AYTADI. LEKIN BU — XATO.**
>
> ## ⚠️ **NIMA UCHUN?** Chatbot **butun state'ni** emas, **faqat javobni** qaytardi. `messages` maydonida **reducer yo'q** — shuning uchun eski qiymat **almashtirildi**.

### 🔬 Biz buni to'liq grafda o'lchadik

```python
kirish = State(messages=[HumanMessage("Could you tell me a grook by Piet Hein?")])
chiqish = graph_compiled.invoke(kirish)

print("kirish :", [(m.type, m.content[:34]) for m in kirish["messages"]])
print("chiqish:", [(m.type, m.content[:34]) for m in chiqish["messages"]])
print("💥 SAVOL YO'QOLDI:", not any(m.type == "human" for m in chiqish["messages"]))
```

```
kirish : [('human', 'Could you tell me a grook by Piet ')]
chiqish: [('ai', 'Piet Hein (1905-1996) was a Danish')]
💥 SAVOL YO'QOLDI: True
```

> ## 💥💥 **BU NIMA UCHUN JIDDIY?**
> ```
> ① Suhbat tarixi YIG'ILMAYDI  →  model kontekstni ko'rmaydi
> ② Ikkinchi savolda model BIRINCHISINI bilmaydi
> ③ Jurnalga savol tushmaydi  →  nosozlikni tuzatib bo'lmaydi
> ④ Va HECH QANDAY XATO CHIQMAYDI  →  ⚠️ JIM XATO
> ```

### ✅ Yechim — bitta so'z

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

> ## 🏆 **KURS BUNI 46-MODULDA QO'SHADI, LEKIN "XATO EDI" DEB AYTMAYDI.**
>
> ## 💡 **BIZNING TAVSIYA: `Annotated[..., add_messages]` NI BOSHIDANOQ YOZING.** `messages` maydoni **deyarli doim** reducer talab qiladi.

---

## 5. ⭐ Tugun tiplari

```python
# ① Oddiy funksiya
def tugun(state: State) -> State:
    return {"n": state["n"] + 1}

# ② Lambda
graph.add_node("qosh", lambda s: {"n": s["n"] + 1})

# ③ ⭐ LCEL zanjiri (41-modul)
from langchain_core.prompts import ChatPromptTemplate
zanjir = ChatPromptTemplate.from_template("{savol}") | chat
graph.add_node("bot", lambda s: {"messages": [zanjir.invoke(s)]})

# ④ ⭐⭐ Runnable TO'G'RIDAN-TO'G'RI
graph.add_node("bot", zanjir)          # ⚠️ state formatiga MOS bo'lsa

# ⑤ Sinf metodi
class Yordamchi:
    def __init__(self, chat):
        self.chat = chat
    def javob(self, state: State) -> State:
        return {"messages": [self.chat.invoke(state["messages"])]}

y = Yordamchi(chat)
graph.add_node("bot", y.javob)         # ⭐ holatli tugun
```

> ## 🏆 **⑤ — ENG AMALIY NAQSH.** Tugun **konfiguratsiyaga** ega bo'ladi *(model, retriever, baza ulanishi)*.
>
> ## 💡 **42-MODULDAGI RETRIEVER SHU YERGA QO'YILADI:**
> ```python
> class RAGTugun:
>     def __init__(self, retriever, chat):
>         self.retriever, self.chat = retriever, chat
>     def __call__(self, state):
>         hujjatlar = self.retriever.invoke(state["messages"][-1].content)
>         kontekst = "\n\n".join(d.page_content for d in hujjatlar)
>         return {"messages": [self.chat.invoke(
>             [SystemMessage(f"Kontekst:\n{kontekst}")] + list(state["messages"]))]}
>
> graph.add_node("rag", RAGTugun(retriever, chat))       # ⭐⭐ 42 + 45
> ```

---

## 6. ⚠️ Tugun nomi

```python
graph.add_node("chatbot", chatbot)     # ⭐ nom ANIQ berilgan
graph.add_node(chatbot)                # nom = funksiya nomi ("chatbot")
```

> ## 💡 **NOMNI DOIM ANIQ BERING** — funksiya nomini o'zgartirganingizda **qirralar buzilmasin**.
>
> ## ⚠️ **VA NOM `__start__` YOKI `__end__` BO'LMASIN** — bular **band**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Tugun nima?

**M2.** Tugun nima qaytaradi?

**M3.** Kursning birinchi grafida nima yo'qoladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **State ni oluvchi va yangilanish qaytaruvchi Python funksiyasi.**

**M2.** ## **Faqat o'zgargan qism** — butun state emas.

**M3.** ## 💥 **Foydalanuvchining savoli** — `messages` da **reducer yo'q**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Savolning yo'qolishini o'zingiz ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
from typing import Annotated
from langgraph.graph import add_messages

def qur(reducer: bool):
    if reducer:
        class S(TypedDict):
            messages: Annotated[Sequence[BaseMessage], add_messages]
    else:
        class S(TypedDict):
            messages: Sequence[BaseMessage]

    def bot(s: S) -> S:
        return {"messages": [chat.invoke(s["messages"])]}

    g = StateGraph(S)
    g.add_node("bot", bot)
    g.add_edge(START, "bot"); g.add_edge("bot", END)
    return g.compile(), S

Q = HumanMessage("Could you tell me a grook by Piet Hein?")
for reducer in [False, True]:
    gc, S = qur(reducer)
    o = gc.invoke(S(messages=[Q]))
    savol_bor = any(m.type == "human" for m in o["messages"])
    belgi = "✅" if savol_bor else "💥"
    print(f"{belgi} reducer={reducer}: {len(o['messages'])} xabar · "
          f"savol {'BOR' if savol_bor else 'YO‘Q'}")
    for m in o["messages"]:
        print(f"      {m.type:6s} {str(m.content)[:48]}")
```

## 💥 **`reducer=False` DA SAVOL YO'QOLADI VA HECH QANDAY XATO CHIQMAYDI.**

</details>

**M5.** ⭐ `print` o'rniga `logging`.

<details>
<summary>✅ Yechim</summary>

```python
import logging

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s | %(levelname)-5s | %(message)s",
                    datefmt="%H:%M:%S")
log = logging.getLogger("graf")


def kuzatuvchi(nom):
    """Tugunni o'rab, kirish/chiqishni JURNALGA yozadi."""
    def dekorator(f):
        def orab(state):
            log.info("→ %-16s kirish: %s", nom,
                     {k: (len(v) if isinstance(v, list) else str(v)[:20])
                      for k, v in state.items()})
            natija = f(state)
            log.info("← %-16s chiqish: %s", nom, list(natija))
            return natija
        return orab
    return dekorator


class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

@kuzatuvchi("chatbot")
def bot(s: S) -> S:
    return {"messages": [chat.invoke(s["messages"])]}

g = StateGraph(S)
g.add_node("chatbot", bot)
g.add_edge(START, "chatbot"); g.add_edge("chatbot", END)
g.compile().invoke(S(messages=[HumanMessage("salom")]))
```

## 🏆 **DEKORATOR — HAR TUGUNGA `print` YOZMASLIKNING ENG TOZA YO'LI.**

</details>

**M6.** ⭐⭐ Sinf tugunini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class ChatbotTugun:
    """Konfiguratsiyaga ega tugun — model, tizim xabari, chaqiruv hisobi."""

    def __init__(self, chat, tizim_xabari=None):
        self.chat = chat
        self.tizim = tizim_xabari
        self.chaqiruv = 0

    def __call__(self, state):
        self.chaqiruv += 1
        kirish = list(state["messages"])
        if self.tizim:
            kirish = [SystemMessage(self.tizim)] + kirish
        return {"messages": [self.chat.invoke(kirish)]}


bot = ChatbotTugun(chat, "Siz o'zbek tilida javob beruvchi yordamchisiz.")

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

g = StateGraph(S)
g.add_node("bot", bot)                  # ⭐ __call__ tufayli ishlaydi
g.add_edge(START, "bot"); g.add_edge("bot", END)
gc = g.compile()

for savol in ["Kredit foizi?", "Karta muddati?", "Depozit?"]:
    gc.invoke(S(messages=[HumanMessage(savol)]))
print("chaqiruvlar:", bot.chaqiruv)
```

## 🏆 **`__call__` — SINFNI TUGUN SIFATIDA ISHLATISHNING KALITI.**

## 💡 **VA `self.chaqiruv` — 💰 NARXNI KUZATISHNING ENG ODDIY YO'LI.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Tugun kuzatuvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import time
import pandas as pd

class TugunKuzatuvchi:
    """Har tugunning vaqti, kirish/chiqish hajmi va XATOLARINI yozadi."""

    def __init__(self):
        self.yozuvlar = []

    def orab(self, nom, f):
        def ichki(state):
            t0 = time.perf_counter()
            kirish_xabar = len(state.get("messages", []))
            xato = None
            try:
                natija = f(state)
            except Exception as e:
                xato = f"{type(e).__name__}: {str(e)[:44]}"
                natija = {}
                raise
            finally:
                self.yozuvlar.append({
                    "tugun": nom,
                    "ms": round((time.perf_counter() - t0) * 1000, 1),
                    "kirish_xabar": kirish_xabar,
                    "qaytardi": list(natija) if natija else [],
                    "yangi_xabar": len(natija.get("messages", []))
                                   if natija else 0,
                    "xato": xato})
            return natija
        return ichki

    def qosh(self, graph, nom, f):
        graph.add_node(nom, self.orab(nom, f))
        return graph

    def hisobot(self):
        if not self.yozuvlar:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.yozuvlar)
        print(d.to_string(index=False))

        print("\n── tugun bo'yicha ──")
        j = d.groupby("tugun").agg(
            chaqiruv=("ms", "size"), jami_ms=("ms", "sum"),
            ortacha_ms=("ms", "mean")).round(1)
        print(j.to_string())

        eng = j.jami_ms.idxmax()
        ulush = j.jami_ms.max() / j.jami_ms.sum()
        print(f"\n🐌 ENG SEKIN: '{eng}' — vaqtning {ulush:.0%} qismi")
        if ulush > 0.7:
            print("   💡 optimallashtirsangiz — SEZILARLI foyda")

        xatolar = d[d.xato.notna()]
        if len(xatolar):
            print(f"\n💥 {len(xatolar)} XATO:")
            for _, r in xatolar.iterrows():
                print(f"    {r.tugun}: {r.xato}")

        bosh = d[(d.qaytardi.apply(len) == 0) & d.xato.isna()]
        if len(bosh):
            print(f"\n⚠️ {len(bosh)} chaqiruv HECH NARSA qaytarmadi:")
            for t in bosh.tugun.unique():
                print(f"    {t}  ← state o'zgarmadi, xatomi?")
        return d


k = TugunKuzatuvchi()

class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def sekin(s: S) -> S:
    time.sleep(0.05)
    return {"messages": [AIMessage("sekin tugun")]}

def tez(s: S) -> S:
    return {"messages": [AIMessage("tez tugun")]}

def bosh(s: S) -> S:
    return {}                              # ⚠️ hech narsa qaytarmaydi

g = StateGraph(S)
k.qosh(g, "sekin", sekin)
k.qosh(g, "tez", tez)
k.qosh(g, "bosh", bosh)
g.add_edge(START, "sekin"); g.add_edge("sekin", "tez")
g.add_edge("tez", "bosh"); g.add_edge("bosh", END)
g.compile().invoke(S(messages=[HumanMessage("test")]))
k.hisobot()
```

## 🏆 **UCHTA TASHXIS:**
```
🐌 eng sekin tugun     →  qayerni optimallashtirish kerak
💥 xatolar             →  qaysi tugunda buzildi
⚠️ bo'sh qaytarish     →  tugun HECH NARSA qilmadi — xatomi?
```

</details>

---

## 📌 Xulosa

```python
class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]   # ⭐ SHART

def chatbot(state: State) -> State:
    print("-------> ENTERING chatbot:")          # ⭐ tuzatish uchun
    response = chat.invoke(state["messages"])
    return State(messages=[response])            # faqat O'ZGARISH
```

```
💥 Kurs: "human message AI message bilan ALMASHTIRILGAN"
   → bu XATO, xususiyat emas
   → o'lchandi: kirish 1 human · chiqish 1 ai · SAVOL YO'QOLDI
✅ Yechim: Annotated[..., add_messages] — BOSHIDANOQ yozing
```

> ## 🏆 **TUGUN — SINF HAM BO'LISHI MUMKIN** *(`__call__` bilan)*. Shunda unga **model, retriever va hisoblagich** beriladi.

---

⬅️ [2-dars. Importlar](02-Importing-Relevant-Classes.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Grafni qurish](04-Building-the-Graph.md)
