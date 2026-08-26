# 1-dars. `Annotated` va reducer funksiyalar ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Grafda holatni yangilash — `messages` kalitida saqlangan eski qiymatni O'CHIRIB, yangisi bilan ALMASHTIRISH orqali sodir bo'ladi. Bu — grafning standart xatti-harakati."**

---

## 1. Muammoning aniq ta'rifi

> ## 💥 **45-MODULDA KO'RGANIMIZ:**
> ```
> kirish : [('human', 'Could you tell me a grook by Piet ...')]
> chiqish: [('ai',    'Piet Hein (1905-1996) was a Danish...')]
> 💥 SAVOL YO'QOLDI
> ```
>
> ## 🔑 **KURSNING SO'ZLARI TO'G'RI:** *"eski qiymatni O'CHIRIB, yangisi bilan ALMASHTIRISH — bu grafning STANDART xatti-harakati"*.

---

## 2. ⭐ `add_messages` — reducer funksiya

```python
from langgraph.graph import add_messages
from langchain_core.messages import HumanMessage, AIMessage

my_list = add_messages([HumanMessage("Hi! I'm Oscar."),
                        AIMessage("Hey, Oscar. How can I assist you?")],
                       [HumanMessage("Could you summarize today's news?")])

for m in my_list:
    print(f"  {m.type:6s} id={m.id[:12]}...  {m.content[:40]}")
```

```
  human  id=14df888d-8d7...  Hi! I'm Oscar.
  ai     id=c7ad1be0-fbc...  Hey, Oscar. How can I assist you?
  human  id=c9cea692-2c2...  Could you summarize today's news?
```

> ## 🔑 **IKKI PARAMETR:**
> ```
> ① MAVJUD ro'yxat
> ② QO'SHILADIGAN ro'yxat
> → natija: BIRLASHTIRILGAN ro'yxat
> ```
>
> ## ⭐⭐ **VA E'TIBOR BERING — HAR XABARGA `id` BERILDI.** Bu — **4-darsdagi `RemoveMessage` ning kaliti**.

### 💥 `add_messages` faqat qo'shmaydi — ALMASHTIRADI HAM

```python
a = HumanMessage("asl matn", id="x1")
b = HumanMessage("YANGILANGAN matn", id="x1")      # ⭐ BIR XIL id
r = add_messages([a], [b])
print(len(r), "xabar ·", r[0].content)
```

```
1 xabar · YANGILANGAN matn
```

> ## 🏆 **QOIDA: `id` BIR XIL BO'LSA — ALMASHTIRADI. BOSHQA BO'LSA — QO'SHADI.**
>
> ## 💡 **BU — XABARNI TAHRIRLASHNING YO'LI:**
> ```python
> # Xabarni tahrirlash (masalan, tarjima qilish yoki sensuralash)
> return {"messages": [HumanMessage(tozalangan_matn, id=eski.id)]}
> ```

---

## 3. ⭐⭐⭐ `Annotated` — metadata biriktirish

```python
from typing import Annotated
from collections.abc import Sequence
from langchain_core.messages import BaseMessage

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    #                   └── TIP ──────────────┘  └─ REDUCER ─┘
```

> ## 🔑 **KURSNING TUSHUNTIRISHI JUDA YAXSHI:**
> ```python
> yosh: Annotated[int, "0 va 120 orasida bo'lishi kerak"]
> #     ↑ hali ham int, lekin QO'SHIMCHA KONTEKST tashiydi
> ```
>
> ## 💡 **`Annotated` — PYTHONNING UMUMIY VOSITASI.** LangGraph undan **reducer** sifatida foydalanadi.

### 🔬 O'lchangan farq

```python
class StateYoq(TypedDict):
    messages: Sequence[BaseMessage]

class StateBor(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def n1(state): return {"messages": [AIMessage("birinchi")]}
def n2(state): return {"messages": [AIMessage("ikkinchi")]}

for nom, S in [("Annotated YO'Q", StateYoq), ("Annotated BOR", StateBor)]:
    g = StateGraph(S)
    g.add_node("n1", n1); g.add_node("n2", n2)
    g.add_edge(START, "n1"); g.add_edge("n1", "n2"); g.add_edge("n2", END)
    o = g.compile().invoke({"messages": [HumanMessage("boshlang'ich")]})
    print(f"  {nom:16s} → {len(o['messages'])} xabar: "
          f"{[m.content[:12] for m in o['messages']]}")
```

```
  Annotated YO'Q   → 1 xabar: ['ikkinchi']
  Annotated BOR    → 3 xabar: ["boshlang'ich", 'birinchi', 'ikkinchi']
```

> ## 💥💥 **REDUCERSIZ — IKKI XABAR YO'QOLDI.** Boshlang'ich savol **va** birinchi tugunning javobi.

---

## 4. ⭐ Boshqa reducerlar

`add_messages` — **yagona** reducer emas. Reducer — **oddiy funksiya**:

```python
import operator
from typing import Annotated

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    natijalar: Annotated[list, operator.add]          # ⭐ ro'yxatlarni qo'shadi
    ball: Annotated[int, operator.add]                # ⭐ sonlarni qo'shadi
    belgilar: Annotated[set, operator.or_]            # ⭐ to'plamlarni birlashtiradi
```

### 🏆 O'z reduceringizni yozing

```python
def oxirgi_n(n=5):
    """Faqat oxirgi n ta elementni saqlaydi."""
    def reducer(eski, yangi):
        return (list(eski or []) + list(yangi or []))[-n:]
    return reducer


def eng_yuqori(eski, yangi):
    """Faqat ENG KATTA qiymatni saqlaydi."""
    return max(eski or 0, yangi or 0)


class State(TypedDict):
    messages: Annotated[list, oxirgi_n(5)]      # ⭐ avtomatik trim!
    maks_ball: Annotated[int, eng_yuqori]
```

> ## 🏆🏆 **`oxirgi_n(5)` — 5-DARSDAGI `trim_messages` TUGUNINING O'RNINI BOSADI.**
>
> ## 🔑 **FARQI:**
> ```
> trim tuguni  →  alohida tugun · grafda ko'rinadi · nazorat qilinadi
> reducer      →  ⭐ AVTOMATIK · kod kamroq · lekin YASHIRIN
> ```
> ## 💡 **REDUCER — SODDA HOLATLAR UCHUN. TUGUN — MURAKKAB MANTIQ UCHUN** *(masalan, xulosalash — LLM chaqiruvi kerak)*.

> ## ⚠️ **REDUCER QOIDALARI:**
> ```
> ① Ikki argument oladi: (eski, yangi)
> ② YANGI qiymat qaytaradi — eskisini O'ZGARTIRMAYDI
> ③ eski None bo'lishi mumkin (birinchi marta)
> ④ TEZ bo'lsin — har yangilanishda chaqiriladi
> ```

---

## 5. 🇺🇿 Amaliy reducer misollari

```python
def til_aniqlash_reducer(eski, yangi):
    """Foydalanuvchi tilini BIRINCHI aniqlangandan keyin o'zgartirmaydi."""
    return eski if eski else yangi


def xatolar_reducer(eski, yangi):
    """Xatolarni yig'adi, lekin 10 tadan oshirmaydi."""
    return (list(eski or []) + list(yangi or []))[-10:]


class BankState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    til: Annotated[str, til_aniqlash_reducer]        # ⭐ bir marta aniqlanadi
    xatolar: Annotated[list, xatolar_reducer]        # ⭐ cheklangan jurnal
    urinishlar: Annotated[int, operator.add]         # ⭐ o'zi sanaydi
    summa: int                                       # oddiy — almashtiriladi
```

> ## 🏆 **`til_aniqlash_reducer` — JUDA FOYDALI NAQSH.** Foydalanuvchi birinchi xabarda o'zbekcha yozsa, keyin inglizcha so'z ishlatsa ham **til o'zgarmaydi**.
>
> ## 💡 **`urinishlar: Annotated[int, operator.add]`** — tugun `{"urinishlar": 1}` qaytaradi, reducer **o'zi qo'shadi**. `state["urinishlar"] + 1` yozish **shart emas**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Reducer nima?

**M2.** `add_messages` ikki parametr oladi — qaysilar?

**M3.** `Annotated` nima qiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Eski va yangi qiymatni BIRLASHTIRUVCHI funksiya.**

**M2.** ## **Mavjud** ro'yxat va ## **qo'shiladigan** ro'yxat.

**M3.** ## Tipga **metadata biriktiradi** — LangGraph uni **reducer** deb o'qiydi.

</details>

### 🟡 O'rta

**M4.** ⭐ `add_messages` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
r = add_messages([HumanMessage("Hi! I'm Oscar."),
                  AIMessage("Hey, Oscar.")],
                 [HumanMessage("Summarize today's news?")])
print(len(r), "xabar")
for m in r:
    print(f"  {m.type:6s} id={m.id[:8]}  {m.content[:40]}")

print("\n── bir xil id ──")
a = HumanMessage("asl", id="x1")
b = HumanMessage("YANGI", id="x1")
r2 = add_messages([a], [b])
print(len(r2), "xabar ·", r2[0].content)
```

## 🔑 **BIR XIL `id` → ALMASHTIRADI.** Bu — **xabarni tahrirlash** usuli.

</details>

**M5.** ⭐⭐ Reducerli va reducersiz grafni solishtiring.

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

**M6.** ⭐⭐ O'z reduceringizni yozing.

<details>
<summary>✅ Yechim</summary>

```python
import operator

def oxirgi_n(n=3):
    def reducer(eski, yangi):
        return (list(eski or []) + list(yangi or []))[-n:]
    return reducer

class S(TypedDict):
    messages: Annotated[list, oxirgi_n(3)]      # ⭐ AVTOMATIK trim
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

## 🏆 **4 XABAR QO'SHILDI, LEKIN 3 TASI QOLDI** — reducer **avtomatik qirqdi**.

## 💡 **`urinishlar` — TUGUN `1` QAYTARDI, REDUCER O'ZI QO'SHDI.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Reducer kutubxonasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import operator
from typing import Annotated


class Reducerlar:
    """Amaliy reducerlar to'plami."""

    @staticmethod
    def oxirgi_n(n):
        """Faqat oxirgi n ta element."""
        def f(eski, yangi):
            return (list(eski or []) + list(yangi or []))[-n:]
        return f

    @staticmethod
    def birinchi_qiymat(eski, yangi):
        """Birinchi o'rnatilgan qiymat O'ZGARMAYDI (til, foydalanuvchi_id)."""
        return eski if eski not in (None, "", 0) else yangi

    @staticmethod
    def eng_yuqori(eski, yangi):
        return max(eski or 0, yangi or 0)

    @staticmethod
    def noyob_qoshish(eski, yangi):
        """Ro'yxatga qo'shadi, TAKRORLANMASDAN, tartibni saqlab."""
        r = list(eski or [])
        for x in (yangi or []):
            if x not in r:
                r.append(x)
        return r

    @staticmethod
    def cheklangan_jurnal(n=20):
        """Xatolar/hodisalar jurnali — n tadan oshmaydi."""
        def f(eski, yangi):
            return (list(eski or []) + list(yangi or []))[-n:]
        return f

    @staticmethod
    def lugat_yangilash(eski, yangi):
        """Lug'atlarni BIRLASHTIRADI (almashtirmaydi)."""
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
    summa: int                                    # oddiy


def n_til(s): return {"til": "uz", "urinishlar": 1,
                      "profil": {"ism": "Oybek"}}
def n_kredit(s): return {"korilgan_bolimlar": ["kredit"], "urinishlar": 1,
                         "til": "en",             # ⚠️ o'zgartirishga urinish
                         "profil": {"yosh": 30}}
def n_karta(s): return {"korilgan_bolimlar": ["karta", "kredit"],
                        "urinishlar": 1,
                        "xatolar": ["xato 1", "xato 2"]}

g = StateGraph(BankState)
g.add_node("til", n_til); g.add_node("kredit", n_kredit)
g.add_node("karta", n_karta)
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

## 🏆 **BEShTA REDUCER — BESHTA AMALIY MUAMMONING YECHIMI.**

## 💥 **`profil` DA `lugat_yangilash` BO'LMASA — `{'yosh': 30}` QOLIB, `ism` YO'QOLARDI.**

</details>

---

## 📌 Xulosa

```python
from typing import Annotated
from langgraph.graph import add_messages

class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]   # ⭐
    natijalar: Annotated[list, operator.add]
    urinishlar: Annotated[int, operator.add]
```

```
💥 Reducersiz  →  1 xabar  (2 tasi YO'QOLDI)
✅ add_messages →  3 xabar

⭐ Bir xil id → ALMASHTIRADI (xabarni tahrirlash usuli)
⭐ Reducer — ODDIY FUNKSIYA: (eski, yangi) → yangi qiymat
🏆 O'z reduceringiz: oxirgi_n · birinchi_qiymat · noyob_qoshish · lugat_yangilash
```

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Reducerlar amalda](02-Reducer-Functions-in-Action.md)
