# 2-dars. `InMemorySaver` bilan qisqa muddatli xotira ⭐⭐

## 🎬 Boshlashdan oldin

> **"`InMemorySaver` — grafga XOTIRADAGI checkpointing qo'shadi."**

---

## 1. Uch qadam

```python
from langgraph.checkpoint.memory import InMemorySaver

# ① Checkpointer
checkpointer = InMemorySaver()

# ② Kompilyatsiyaga uzatamiz
graph_compiled = graph.compile(checkpointer)          # ⭐ POZITSIYA bilan

# ③ Thread
config1 = {"configurable": {"thread_id": "1"}}
graph_compiled.invoke(State(), config1)
```

> ## ✅ **KURSNING POZITSIYA BILAN UZATISHI ISHLAYDI** *(o'lchandi)*.
>
> ## 💡 **LEKIN ANIQROQ VARIANT — NOM BILAN:**
> ```python
> graph_compiled = graph.compile(checkpointer=checkpointer)
> ```
> Chunki `compile()` da **boshqa parametrlar ham bor** *(`interrupt_before`, `debug`)*.

---

## 2. 🔬 Xotira ishlayaptimi? — o'lchadik

```python
class S(MessagesState):
    pass

SAVOLLAR = iter(["Men Oybek.", "Ismim nima?", "Yana ayting."] * 4)

def bot(s: S) -> S:
    q = next(SAVOLLAR, "savol")
    return {"messages": [HumanMessage(q), chat.invoke(s["messages"])]}

g = StateGraph(S)
g.add_node("bot", bot)
g.add_edge(START, "bot"); g.add_edge("bot", END)

# ── ① checkpointersiz ──
gc1 = g.compile()
for i in range(3):
    o = gc1.invoke(S(messages=[]))
    print(f"  checkpointersiz {i+1}: {len(o['messages'])} xabar")

# ── ② ⭐ checkpointerli ──
gc2 = g.compile(checkpointer=InMemorySaver())
cfg = {"configurable": {"thread_id": "1"}}
for i in range(3):
    o = gc2.invoke(S(messages=[]), cfg)
    print(f"  checkpointerli   {i+1}: {len(o['messages'])} xabar")
```

```
  checkpointersiz 1: 2 xabar
  checkpointersiz 2: 2 xabar     ← 💥 har safar NOLDAN
  checkpointersiz 3: 2 xabar
  checkpointerli   1: 2 xabar
  checkpointerli   2: 4 xabar    ← ✅ TO'PLANMOQDA
  checkpointerli   3: 6 xabar
```

> ## 🏆 **BU — 46-MODULNING DAVOMI.** U yerda **bitta `invoke()` ichida** xabarlar saqlanardi. Endi — **chaqiruvlar orasida** ham.

---

## 3. ⭐ Ikki thread — mustaqil suhbatlar

```python
c1 = {"configurable": {"thread_id": "oybek"}}
c2 = {"configurable": {"thread_id": "dilnoza"}}

for i in range(3):
    gc2.invoke(S(messages=[]), c1)
gc2.invoke(S(messages=[]), c2)

print("thread 'oybek'  :", len(gc2.get_state(c1).values["messages"]), "xabar")
print("thread 'dilnoza':", len(gc2.get_state(c2).values["messages"]), "xabar")
```

```
thread 'oybek'  : 6 xabar
thread 'dilnoza': 2 xabar
```

> ## ✅ **TO'LIQ MUSTAQIL.**
>
> ## 🔑 **KURSNING SINOVI HAM SHU:** ikkinchi threadda *"Shoir qachon tug'ilgan?"* deb so'raganda **chatbot chalkashadi** — chunki u **boshqa suhbat**.

---

## 4. 💥 `InMemorySaver` ning cheklovi

```
Notebook kerneli qayta ishga tushdi   →  💥 XOTIRA YO'QOLDI
Python jarayoni yopildi               →  💥 XOTIRA YO'QOLDI
Serverni qayta ishga tushirdingiz     →  💥 HAMMA SUHBAT YO'QOLDI
```

> ## ⚠️ **VA BU — FAQAT PROTOTIP UCHUN MOS.**
>
> ## 🏆 **4-DARSDA `SqliteSaver` BILAN HAL QILAMIZ.**

### 💥 Va yana bitta cheklov — XOTIRA O'SADI

```python
import sys

gc = g.compile(checkpointer=InMemorySaver())
cp = gc.checkpointer

for i in range(100):
    gc.invoke(S(messages=[]), {"configurable": {"thread_id": f"user-{i}"}})

print("threadlar:", len(list(cp.list(None))))
```

> ## 💥 **HAR THREAD — RAMDA.** 10 000 foydalanuvchi × 40 checkpoint × ~2 KB ≈ **800 MB**.
>
> ## ⚠️ **`InMemorySaver` DA AVTOMATIK TOZALASH YO'Q.** Server **asta-sekin to'ladi** va **yiqiladi**.

---

## 5. ⭐⭐ Holatni o'qish va o'zgartirish

```python
# ── holatni O'QISH ──
snap = gc.get_state(cfg)
print("xabarlar:", len(snap.values["messages"]))
print("next    :", snap.next)
print("step    :", snap.metadata.get("step"))

# ── ⭐ holatni O'ZGARTIRISH (kursda YO'Q) ──
gc.update_state(cfg, {"messages": [AIMessage("Qo'lda qo'shilgan xabar")]})
print("keyin   :", len(gc.get_state(cfg).values["messages"]))
```

> ## 🏆 **`update_state` — "HUMAN-IN-THE-LOOP" NING KALITI:**
> ```
> 🔧 Nosozlikni tuzatish   →  noto'g'ri xabarni ALMASHTIRISH
> 👤 Operator aralashuvi   →  odam javobni TUZATADI
> 🧪 Test                  →  ma'lum holatdan boshlash
> ```
>
> ## 💡 **VA `as_node=` BILAN — "GO'YO SHU TUGUN BAJARGANDEK":**
> ```python
> gc.update_state(cfg, {"messages": [...]}, as_node="chatbot")
> ```

---

## 6. 🇺🇿 Amaliy misol — bank boti (modelsiz)

```python
import operator
from langgraph.graph.message import REMOVE_ALL_MESSAGES


class BankState(MessagesState):
    summary: str
    til: str
    burilish: Annotated[int, operator.add]


def salomlash(s: BankState) -> BankState:
    if s.get("burilish", 0) == 0:
        return {"messages": [AIMessage("Assalomu alaykum! Bank yordamchisiman. "
                                       "Qanday yordam bera olaman?")],
                "til": "uz", "burilish": 1}
    return {"burilish": 1}


def javob(s: BankState) -> BankState:
    oxirgi = str(s["messages"][-1].content).lower() if s["messages"] else ""
    JAVOBLAR = {
        "kredit": "Iste'mol krediti yillik 24% dan, 24 oygacha.",
        "karta": "Debet karta 3 ish kunida tayyor, yillik 50 000 so'm.",
        "depozit": "Muddatli depozit yillik 18–22% foiz keltiradi.",
    }
    for k, v in JAVOBLAR.items():
        if k in oxirgi:
            return {"messages": [AIMessage(v)]}
    return {"messages": [AIMessage("Kechirasiz, tushunmadim. "
                                   "Kredit, karta yoki depozit?")]}


g = StateGraph(BankState)
g.add_node("salomlash", salomlash)
g.add_node("javob", javob)
g.add_edge(START, "salomlash")
g.add_edge("salomlash", "javob")
g.add_edge("javob", END)
gc = g.compile(checkpointer=InMemorySaver())


def sora(foydalanuvchi_id, matn):
    cfg = {"configurable": {"thread_id": f"tg-{foydalanuvchi_id}"}}
    r = gc.invoke({"messages": [HumanMessage(matn)]}, cfg)
    return r["messages"][-1].content


print("Oybek  :", sora(12345, "Kredit haqida ayting"))
print("Oybek  :", sora(12345, "Karta-chi?"))
print("Dilnoza:", sora(99999, "Depozit foizi?"))

for uid in (12345, 99999):
    snap = gc.get_state({"configurable": {"thread_id": f"tg-{uid}"}})
    print(f"  tg-{uid}: {len(snap.values['messages'])} xabar · "
          f"burilish {snap.values.get('burilish')}")
```

> ## 🏆 **DIQQAT — BU BOTDA LLM UMUMAN YO'Q.**
>
> ## 🔑 **VA BU — TO'G'RI DIZAYN:** *"kredit foizi qancha?"* — bu **aniq savol**, aniq javob **bazada bor**. LLM faqat **noaniq savollar** uchun kerak.
>
> ## 💰 **BU YONDASHUV NARXNI 90% GACHA KAMAYTIRADI** — ko'p savollar **oddiy va takrorlanuvchan**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `InMemorySaver` qayerda saqlaydi?

**M2.** Dastur qayta ishga tushsa nima bo'ladi?

**M3.** `get_state` nima qaytaradi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **RAM** — operativ xotirada.

**M2.** ## 💥 **Hamma suhbat yo'qoladi.**

**M3.** ## `StateSnapshot` — holat, `next`, `metadata` va boshqalar.

</details>

### 🟡 O'rta

**M4.** ⭐ Xotira to'planishini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
gc = g.compile(checkpointer=InMemorySaver())
cfg = {"configurable": {"thread_id": "test"}}

for i in range(1, 6):
    o = gc.invoke({"messages": [HumanMessage(f"savol {i}")]}, cfg)
    snap = gc.get_state(cfg)
    print(f"  {i}: {len(o['messages'])} xabar · step {snap.metadata['step']}")
```

</details>

**M5.** ⭐ `update_state` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
cfg = {"configurable": {"thread_id": "tuzatish"}}
gc.invoke({"messages": [HumanMessage("Kredit?")]}, cfg)
print("oldin:", len(gc.get_state(cfg).values["messages"]))

# ⭐ qo'lda xabar qo'shamiz
gc.update_state(cfg, {"messages": [AIMessage("[OPERATOR] Tuzatilgan javob")]})
snap = gc.get_state(cfg)
print("keyin:", len(snap.values["messages"]))
print("oxirgi:", snap.values["messages"][-1].content)
```

## 🏆 **BU — OPERATOR ARALASHUVINING TEXNIK ASOSI.**

</details>

**M6.** ⭐⭐ Bir necha foydalanuvchini sinang.

<details>
<summary>✅ Yechim</summary>

```python
FOYDALANUVCHILAR = {12345: ["Kredit?", "Foiz?"],
                    99999: ["Karta?"],
                    77777: ["Depozit?", "Muddat?", "Minimal summa?"]}

gc = g.compile(checkpointer=InMemorySaver())
for uid, savollar in FOYDALANUVCHILAR.items():
    for s in savollar:
        gc.invoke({"messages": [HumanMessage(s)]},
                  {"configurable": {"thread_id": f"tg-{uid}"}})

print("── holatlar ──")
for uid in FOYDALANUVCHILAR:
    snap = gc.get_state({"configurable": {"thread_id": f"tg-{uid}"}})
    print(f"  tg-{uid}: {len(snap.values['messages']):2d} xabar · "
          f"step {snap.metadata['step']}")
```

## ✅ **HAR FOYDALANUVCHI — O'Z SUHBATIDA.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Xotira nazoratchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import sys
import tiktoken
import pandas as pd

ENC = tiktoken.get_encoding("cl100k_base")


class XotiraNazoratchi:
    """InMemorySaver'ning RAM iste'molini kuzatadi va OGOHLANTIRADI."""

    def __init__(self, graph_compiled, maks_thread=1000,
                 maks_xabar_thread=50, til="uz"):
        self.gc = graph_compiled
        self.maks_thread = maks_thread
        self.maks_xabar = maks_xabar_thread
        self.koef = 1.88 if til == "uz" else 1.0
        self.threadlar = set()

    def yubor(self, thread_id, kirish, **kw):
        cfg = {"configurable": {"thread_id": str(thread_id)}, **kw}
        self.threadlar.add(str(thread_id))
        r = self.gc.invoke(kirish, cfg)

        snap = self.gc.get_state(cfg)
        n = len(snap.values.get("messages", []))
        if n > self.maks_xabar:
            print(f"  ⚠️ thread '{thread_id}': {n} xabar > {self.maks_xabar} "
                  f"→ 46-moduldagi trim/xulosalash kerak")
        if len(self.threadlar) > self.maks_thread:
            print(f"  💥 {len(self.threadlar)} thread > {self.maks_thread} "
                  f"→ SqliteSaver yoki PostgresSaver ga o'ting")
        return r

    def hisobot(self):
        q = []
        for t in sorted(self.threadlar):
            cfg = {"configurable": {"thread_id": t}}
            try:
                snap = self.gc.get_state(cfg)
            except Exception:
                continue
            xs = snap.values.get("messages", [])
            tok = sum(len(ENC.encode(str(m.content))) for m in xs)
            tarix = list(self.gc.get_state_history(cfg))
            q.append({"thread": t, "xabar": len(xs), "token": tok,
                      "checkpoint": len(tarix),
                      "step": snap.metadata.get("step"),
                      "summary": bool(snap.values.get("summary"))})
        if not q:
            print("thread yo'q")
            return
        d = pd.DataFrame(q)
        print(d.to_string(index=False))

        # ── RAM taxmini ──
        jami_cp = d.checkpoint.sum()
        jami_tok = d.token.sum()
        ram_kb = jami_cp * 2                     # taxminan 2 KB / checkpoint
        print(f"\n📊 {len(d)} thread · {jami_cp} checkpoint · "
              f"{jami_tok} token")
        print(f"   taxminiy RAM ≈ {ram_kb / 1024:.1f} MB")
        print(f"   10 000 foydalanuvchida ≈ "
              f"{ram_kb / len(d) * 10000 / 1024 / 1024:.1f} GB")

        # ── narx ──
        ort_tok = d.token.mean()
        print(f"\n💰 o'rtacha kontekst {ort_tok:.0f} token")
        print(f"   🇺🇿 1000 suhbat/kun × 20 burilish ≈ "
              f"${ort_tok*20/1e6*0.15*1000*365*self.koef:,.0f}/yil")

        # ── ogohlantirishlar ──
        print()
        katta = d[d.xabar > self.maks_xabar]
        if len(katta):
            print(f"  ⚠️ {len(katta)} thread {self.maks_xabar}+ xabar: "
                  f"{list(katta.thread)[:3]}")
            print(f"     → 46-modul: trim yoki xulosalash")
        if len(d) > self.maks_thread:
            print(f"  💥 {len(d)} thread — InMemorySaver'ni almashtiring")
        cpk = d.checkpoint.max()
        if cpk > 100:
            print(f"  ⚠️ eng ko'p checkpoint: {cpk} — tarix KATTA, "
                  f"bazani tozalashni rejalashtiring")
        xul = d.summary.mean()
        if xul < 0.5 and d.xabar.mean() > 20:
            print(f"  💡 threadlarning faqat {xul:.0%} qismida xulosa bor, "
                  f"lekin o'rtacha {d.xabar.mean():.0f} xabar — "
                  f"xulosalash yoqilmaganmi?")
        return d


class S(MessagesState):
    summary: str

def bot(s: S) -> S:
    return {"messages": [chat.invoke(s["messages"])]}

g = StateGraph(S)
g.add_node("bot", bot)
g.add_edge(START, "bot"); g.add_edge("bot", END)
gc = g.compile(checkpointer=InMemorySaver())

xn = XotiraNazoratchi(gc, maks_thread=5, maks_xabar_thread=10)
for uid in range(8):
    for i in range(uid + 1):
        xn.yubor(f"user-{uid}", {"messages": [HumanMessage(f"savol {i}")]})
print()
xn.hisobot()
```

## 🏆 **TO'RTTA OGOHLANTIRISH:**
```
⚠️ ko'p xabarli thread   →  46-modul (trim/xulosalash)
💥 ko'p thread            →  SqliteSaver / PostgresSaver
⚠️ ko'p checkpoint        →  bazani tozalash
💡 xulosa yo'q, xabar ko'p →  xulosalash yoqilmaganmi?
```

## 💥 **`10 000 foydalanuvchida ≈ N GB`** — bu hisob **serverni tanlash** qarorini beradi.

</details>

---

## 📌 Xulosa

```python
from langgraph.checkpoint.memory import InMemorySaver

graph_compiled = graph.compile(checkpointer=InMemorySaver())
config1 = {"configurable": {"thread_id": "1"}}
graph_compiled.invoke(State(messages=[]), config1)

snap = graph_compiled.get_state(config1)              # ⭐ o'qish
graph_compiled.update_state(config1, {"messages": [...]})   # ⭐ o'zgartirish
```

```
🔬 O'LCHANGAN:
   checkpointersiz:  2 · 2 · 2 xabar    💥 har safar noldan
   checkpointerli :  2 · 4 · 6 xabar    ✅ to'planmoqda
   ikki thread    :  oybek 6 · dilnoza 2   ✅ mustaqil

💥 InMemorySaver: dastur yopilsa — YO'QOLADI, va RAM CHEKSIZ o'sadi
⭐ update_state — human-in-the-loop ning kaliti (kursda YO'Q)
```

> ## 💰 **VA ESLATMA: KO'P SAVOLLARGA LLM KERAK EMAS.** Aniq savolga — **bazadan aniq javob**. Bu narxni **90% gacha** kamaytiradi.

---

⬅️ [1-dars. Checkpointer va threadlar](01-Checkpointers-and-Threads.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. StateSnapshot](03-The-StateSnapshot-Class.md)
