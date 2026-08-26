# 4-dars. `RemoveMessage` sinfi ⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu — boshqa xabarlarni O'CHIRISH uchun mo'ljallangan XABAR. G'alati eshitiladi. Keling, muhokama qilamiz."**

---

## 1. G'alati, lekin mantiqiy

```
Xabar qo'shish orqali xabar O'CHIRAMIZ
```

> ## 🔑 **NIMA UCHUN SHUNDAY?**
> ```
> Tugun FAQAT o'zgarishni qaytaradi (45-modul, 1-dars)
> Reducer o'zgarishni MAVJUD holatga qo'llaydi
> → o'chirish ham "o'zgarish" bo'lishi kerak
> → shuning uchun O'CHIRISH BUYRUG'I ham XABAR
> ```
>
> ## 💡 **KURSNING TASHBEHI YAXSHI:** *"hujayralar bo'linish orqali ko'payganidek"*.

---

## 2. Kod va HAQIQIY natija

```python
from langchain_core.messages import RemoveMessage

suhbat = add_messages([
    AIMessage("What is your question?"),
    HumanMessage("Could you tell me a grook by Piet Hein?"),
    AIMessage("Certainly! Here's a well-known grook..."),
    AIMessage("Would you like to ask one more question?"),
    HumanMessage("yes"),
    AIMessage("What is your question?"),
    HumanMessage("Where was the poet born?"),
    AIMessage("Piet Hein was born in Copenhagen, Denmark."),
    AIMessage("Would you like to ask one more question?")],
    [HumanMessage("yes")])

print("jami:", len(suhbat))

remove_messages = [RemoveMessage(id=i.id) for i in suhbat[:-5]]
print("o'chiriladi:", len(remove_messages))

qolgan = add_messages(suhbat, remove_messages)
print("qolgan:", len(qolgan))
for m in qolgan:
    print(f"  {m.type:6s} {m.content[:44]}")
```

```
jami: 10
o'chiriladi: 5
qolgan: 5
  ai     What is your question?
  human  Where was the poet born?
  ai     Piet Hein was born in Copenhagen, Denmark.
  ai     Would you like to ask one more question?
  human  yes
```

> ## ✅ **BESHTA XABAR O'CHIRILDI, OXIRGI BESHTASI QOLDI.**
>
> ## 🔑 **`[:-5]` — "OXIRGI BESHTASIDAN TASHQARI HAMMASI".** Ya'ni **oxirgi 5 tasi saqlanadi**.

---

## 3. ⭐ `id` — hal qiluvchi detal

```python
RemoveMessage(id=i.id)      # ⭐ FAQAT id kerak, matn kerak emas
```

> ## 🔑 **1-DARSDA KO'RGAN EDIK:** `add_messages` har xabarga **avtomatik `id`** beradi.
>
> ## 💥 **AGAR XABARLARNI `add_messages` SIZ YARATSANGIZ — `id` `None` BO'LADI:**
> ```python
> m = HumanMessage("test")
> print(m.id)          # None
> ```
> ## ⚠️ **`RemoveMessage(id=None)` — ISHLAMAYDI.**
>
> ## ✅ **GRAFDA BU MUAMMO YO'Q** — `add_messages` reducer'i `id` **avtomatik beradi**.

### 💥 Mavjud bo'lmagan `id` — o'lchandi

```python
r = add_messages(suhbat, [RemoveMessage(id="yoq-id")])
```

```
💥 ValueError : Attempting to delete a message with an ID that doesn't exist ('yoq-id')
```

> ## 🏆 **BU — YAXSHI XATTI-HARAKAT.** Jim o'tkazib yuborish **yomonroq** bo'lardi.
>
> ## ⚠️ **LEKIN SIKLDA EHTIYOT BO'LING:** ikki tugun **bir xabarni** o'chirmoqchi bo'lsa — ikkinchisi **xato beradi**.

---

## 4. ⭐⭐ `REMOVE_ALL_MESSAGES` — kursda YO'Q

```python
from langgraph.graph.message import REMOVE_ALL_MESSAGES

print(repr(REMOVE_ALL_MESSAGES))
r = add_messages(suhbat, [RemoveMessage(id=REMOVE_ALL_MESSAGES)])
print(len(suhbat), "xabar →", len(r), "xabar")
```

```
'__remove_all__'
10 xabar → 0 xabar
```

> ## 🏆 **BITTA `RemoveMessage` — HAMMASINI O'CHIRADI.**
>
> ## 💡 **6-DARSDAGI XULOSALASH UCHUN IDEAL:**
> ```python
> # Kursning yo'li — N ta RemoveMessage
> rm = [RemoveMessage(id=i.id) for i in state["messages"]]
>
> # ⭐ Soddaroq
> rm = [RemoveMessage(id=REMOVE_ALL_MESSAGES)]
> ```
>
> ## ⚠️ **VA XAVFSIZROQ HAM:** ro'yxatda `id` si `None` bo'lgan xabar bo'lsa — birinchi variant **yiqiladi**.

---

## 5. ⭐ Tanlab o'chirish naqshlari

```python
def oxirgi_n_saqla(state, n=5):
    """Oxirgi n ta xabarni qoldiradi."""
    return [RemoveMessage(id=m.id) for m in state["messages"][:-n]]


def turi_boyicha_ochir(state, turlar=("system",)):
    """Ma'lum turdagi xabarlarni o'chiradi."""
    return [RemoveMessage(id=m.id) for m in state["messages"]
            if m.type in turlar]


def juftlab_saqla(state, juftlar=3):
    """Oxirgi N ta SAVOL-JAVOB juftini qoldiradi."""
    return [RemoveMessage(id=m.id) for m in state["messages"][:-juftlar * 2]]


def token_boyicha(state, maks_token=2000, enc=None):
    """⭐ Belgilar emas, TOKEN bo'yicha qirqadi."""
    import tiktoken
    enc = enc or tiktoken.get_encoding("cl100k_base")
    saqla, jami = [], 0
    for m in reversed(state["messages"]):           # oxiridan boshlaymiz
        t = len(enc.encode(str(m.content)))
        if jami + t > maks_token:
            break
        saqla.append(m.id)
        jami += t
    return [RemoveMessage(id=m.id) for m in state["messages"]
            if m.id not in saqla]
```

> ## 🏆 **`token_boyicha` — ENG TO'G'RI YONDASHUV.** Xabar **soni** emas, **hajmi** muhim: bitta uzun xabar **o'nta qisqasidan** ko'p token yeydi.
>
> ## ⚠️ **KURSNING `[:-5]` USULINING MUAMMOSI:**
> ```
> 5 ta qisqa xabar   ≈    50 token
> 5 ta uzun xabar    ≈  5000 token    ← 💥 100× farq
> ```

---

## 6. ⚠️⚠️ Trim'ning ma'no yo'qotishi

Kurs 5-darsda o'zi aytadi:

> **"Lekin suhbat tafsilotlari yo'lda yo'qolishi va chatbot noto'g'ri javob berishi ehtimoli DOIM bor."**

```
✅ "Pit Heyn qayerda tug'ilgan?"       →  ishlaydi (mavzu yaqinda aytilgan)
💥 "Sen aytgan grookni eslaysanmi?"    →  ishlamaydi (o'chirilgan)
```

> ## 🔑 **QOIDA: TRIM — MAVZU TEZ-TEZ TILGA OLINADIGAN SUHBATLAR UCHUN.**
>
> ## ⚠️ **VA YANA BITTA XAVF — JUFTLIKNI BUZISH:**
> ```
> [:-5]  →  oxirgi 5 ta olinadi
>        →  💥 birinchisi AIMessage bo'lishi mumkin (javobsiz)
>        →  ba'zi modellar buni YOQTIRMAYDI
> ```
>
> ## ✅ **XAVFSIZROQ — `HumanMessage` DAN BOSHLASH** *(keyingi bo'limda)*.

---

## 7. ⭐⭐⭐ `langchain_core.trim_messages` — kursda umuman YO'Q

LangChain'ning **o'z** trim funksiyasi bor:

```python
from langchain_core.messages import trim_messages
import tiktoken

ENC = tiktoken.get_encoding("cl100k_base")
tc = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

xs = add_messages([], [
    SystemMessage("Siz yordamchisiz."),
    HumanMessage("Salom, men Oybek."), AIMessage("Salom Oybek!"),
    HumanMessage("Kredit foizi?"), AIMessage("24% dan boshlanadi."),
    HumanMessage("Muddat?"), AIMessage("24 oygacha.")])

print("jami:", len(xs), "xabar ·", tc(xs), "token")

t = trim_messages(xs, max_tokens=40, strategy="last",
                  token_counter=tc,
                  include_system=True,          # ⭐ SystemMessage SAQLANADI
                  start_on="human")             # ⭐ HumanMessage dan boshlanadi
print("trim(40):", len(t), [m.type for m in t], "·", tc(t), "token")
```

```
jami: 7 xabar · 45 token
trim(40): 5 ['system', 'human', 'ai', 'human', 'ai'] · 31 token
```

> ## 🏆🏆 **UCHTA AFZALLIK:**
> ```
> ✅ TOKEN bo'yicha (xabar soni emas)
> ⭐ include_system=True   →  tizim ko'rsatmasi HECH QACHON o'chmaydi
> ⭐ start_on="human"      →  juftlik BUZILMAYDI
> ```
>
> ## ⚠️ **`include_system` FAQAT `strategy="last"` BILAN ISHLAYDI** *(o'lchandi: `strategy="first"` bilan `ValueError`)*.

### LangGraph tugunida

```python
from langchain_core.messages import trim_messages, RemoveMessage

def aqlli_trim(state: MessagesState) -> MessagesState:
    saqlanadi = trim_messages(
        state["messages"], max_tokens=2000, strategy="last",
        token_counter=tc, include_system=True, start_on="human")
    saqlanadi_id = {m.id for m in saqlanadi}
    ochiriladi = [RemoveMessage(id=m.id) for m in state["messages"]
                  if m.id not in saqlanadi_id]
    if ochiriladi:
        print(f"  ✂️ {len(ochiriladi)} xabar o'chirildi, "
              f"{len(saqlanadi)} qoldi ({tc(saqlanadi)} token)")
    return {"messages": ochiriladi}
```

> ## 🏆 **BU — KURSNING `[:-5]` USULINING TO'G'RI VARIANTI.**

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `RemoveMessage` nima qiladi?

**M2.** Unga nima kerak?

**M3.** Mavjud bo'lmagan `id` bersangiz?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Boshqa xabarni **o'chiradi** — **xabar qo'shish orqali**.

**M2.** ## Faqat `id` — matn **kerak emas**.

**M3.** ## 💥 `ValueError: Attempting to delete a message with an ID that doesn't exist`.

</details>

### 🟡 O'rta

**M4.** ⭐ `RemoveMessage` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
suhbat = add_messages([], [
    AIMessage("Savol?"), HumanMessage("Kredit foizi?"),
    AIMessage("24%."), AIMessage("Yana?"), HumanMessage("yes"),
    AIMessage("Savol?"), HumanMessage("Muddat?"),
    AIMessage("24 oy."), AIMessage("Yana?"), HumanMessage("yes")])

print("jami:", len(suhbat))
rm = [RemoveMessage(id=m.id) for m in suhbat[:-5]]
qolgan = add_messages(suhbat, rm)
print("qolgan:", len(qolgan))
for m in qolgan:
    print(f"  {m.type:6s} {m.content}")

print("\n── mavjud bo'lmagan id ──")
try:
    add_messages(suhbat, [RemoveMessage(id="yoq")])
except Exception as e:
    print("💥", type(e).__name__, ":", str(e)[:80])
```

</details>

**M5.** ⭐ `REMOVE_ALL_MESSAGES` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langgraph.graph.message import REMOVE_ALL_MESSAGES

print("qiymat:", repr(REMOVE_ALL_MESSAGES))
r = add_messages(suhbat, [RemoveMessage(id=REMOVE_ALL_MESSAGES)])
print(f"{len(suhbat)} → {len(r)} xabar")

# ── grafda ──
def hammasini_ochir(s: MessagesState) -> MessagesState:
    print(f"  🗑️ {len(s['messages'])} xabar o'chirilmoqda")
    return {"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)]}
```

## 🏆 **BITTA OBYEKT — HAMMASI.** Va `id=None` muammosi **yo'q**.

</details>

**M6.** ⭐⭐ Token bo'yicha trim yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
ENC = tiktoken.get_encoding("cl100k_base")
tc = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

UZUN = "Bu juda uzun xabar. " * 30
xs = add_messages([], [
    HumanMessage("qisqa 1"), AIMessage("qisqa 2"),
    HumanMessage(UZUN), AIMessage("qisqa 3"),
    HumanMessage("qisqa 4"), AIMessage("qisqa 5")])

print("jami:", len(xs), "xabar ·", tc(xs), "token")

# ── ① kursning usuli: son bo'yicha ──
son_rm = [RemoveMessage(id=m.id) for m in xs[:-4]]
son_q = add_messages(xs, son_rm)
print(f"son bo'yicha (-4): {len(son_q)} xabar · {tc(son_q)} token")

# ── ② ⭐ token bo'yicha ──
def token_trim(xabarlar, maks=50):
    saqla, jami = [], 0
    for m in reversed(xabarlar):
        t = len(ENC.encode(str(m.content)))
        if jami + t > maks:
            break
        saqla.append(m.id); jami += t
    return [RemoveMessage(id=m.id) for m in xabarlar if m.id not in saqla]

tok_q = add_messages(xs, token_trim(xs, 50))
print(f"token bo'yicha (50): {len(tok_q)} xabar · {tc(tok_q)} token")
```

## 💥 **SON BO'YICHA QIRQISHDA BITTA UZUN XABAR CHEGARANI BUZADI.**

## 🏆 **TOKEN BO'YICHA — BASHORAT QILINADIGAN NARX.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Xabar boshqaruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
import pandas as pd
from langchain_core.messages import trim_messages
from langgraph.graph.message import REMOVE_ALL_MESSAGES


class XabarBoshqaruv:
    """Trim strategiyalarini birlashtiradi va SIFATNI o'lchaydi."""

    def __init__(self, maks_token=2000, strategiya="token",
                 saqlanadigan_juft=3, til="uz"):
        self.maks = maks_token
        self.strategiya = strategiya
        self.juft = saqlanadigan_juft
        self.koef = 1.88 if til == "uz" else 1.0
        self.enc = tiktoken.get_encoding("cl100k_base")
        self.jurnal = []

    def _tok(self, ms):
        return sum(len(self.enc.encode(str(m.content))) for m in ms)

    # ── strategiyalar ──
    def _son(self, xabarlar):
        n = self.juft * 2
        return [m for m in xabarlar[:-n]] if len(xabarlar) > n else []

    def _token(self, xabarlar):
        saqla, jami = set(), 0
        for m in reversed(xabarlar):
            t = len(self.enc.encode(str(m.content)))
            if jami + t > self.maks:
                break
            saqla.add(m.id)
            jami += t
        return [m for m in xabarlar if m.id not in saqla]

    def _aqlli(self, xabarlar):
        """⭐ langchain_core.trim_messages — system saqlanadi, juftlik buzilmaydi."""
        try:
            saqlanadi = trim_messages(
                xabarlar, max_tokens=self.maks, strategy="last",
                token_counter=self._tok, include_system=True,
                start_on="human")
        except Exception as e:
            print(f"  ⚠️ trim_messages: {type(e).__name__} → token usuliga o'tdik")
            return self._token(xabarlar)
        saqlanadi_id = {m.id for m in saqlanadi}
        return [m for m in xabarlar if m.id not in saqlanadi_id]

    # ── asosiy ──
    def trim(self, state):
        xabarlar = list(state["messages"])
        oldin_n, oldin_t = len(xabarlar), self._tok(xabarlar)

        if oldin_t <= self.maks:
            self.jurnal.append({"oldin_n": oldin_n, "oldin_tok": oldin_t,
                                "keyin_n": oldin_n, "keyin_tok": oldin_t,
                                "ochirildi": 0, "strategiya": "—"})
            return {"messages": []}

        f = {"son": self._son, "token": self._token,
             "aqlli": self._aqlli}[self.strategiya]
        ochiriladi = f(xabarlar)

        # ⚠️ id si yo'q xabarlarni o'tkazib yuboramiz
        ochiriladi = [m for m in ochiriladi if m.id]
        qolgan = [m for m in xabarlar if m not in ochiriladi]

        self.jurnal.append({
            "oldin_n": oldin_n, "oldin_tok": oldin_t,
            "keyin_n": len(qolgan), "keyin_tok": self._tok(qolgan),
            "ochirildi": len(ochiriladi), "strategiya": self.strategiya})

        # ── sifat tekshiruvlari ──
        if qolgan and qolgan[0].type == "ai":
            print("  ⚠️ birinchi xabar AI — juftlik BUZILGAN "
                  "(ba'zi modellar buni yoqtirmaydi)")
        if not any(m.type == "system" for m in qolgan) and \
                any(m.type == "system" for m in xabarlar):
            print("  💥 SystemMessage O'CHIRILDI — model ko'rsatmasiz qoldi!")

        print(f"  ✂️ {oldin_n}→{len(qolgan)} xabar · "
              f"{oldin_t}→{self._tok(qolgan)} token")
        return {"messages": [RemoveMessage(id=m.id) for m in ochiriladi]}

    def hisobot(self, kunlik_suhbat=1000):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))

        tejaldi = (d.oldin_tok - d.keyin_tok).sum()
        print(f"\n💰 tejalgan token: {tejaldi}")
        print(f"   gpt-4o-mini: ${tejaldi/1e6*0.15*kunlik_suhbat*365:,.0f}/yil")
        print(f"   🇺🇿 o'zbekchada (×{self.koef}): "
              f"${tejaldi/1e6*0.15*kunlik_suhbat*365*self.koef:,.0f}/yil")

        hech = (d.ochirildi == 0).mean()
        if hech > 0.8:
            print(f"\n⚠️ {hech:.0%} holatda hech narsa o'chirilmadi — "
                  f"maks_token juda KATTA")
        if d.keyin_n.min() < 2:
            print("💥 ba'zi holatda 2 tadan kam xabar qoldi — "
                  "kontekst YO'QOLADI")
        return d


# ── uch strategiyani solishtiramiz ──
UZUN = "Bu juda uzun xabar bo'lib, ko'p token yeydi. " * 20
XABARLAR = add_messages([], [
    SystemMessage("Siz bank yordamchisisiz. O'zbek tilida javob bering."),
    HumanMessage("Salom, men Oybek."), AIMessage("Salom Oybek!"),
    HumanMessage(UZUN), AIMessage("Tushundim."),
    HumanMessage("Kredit foizi?"), AIMessage("24% dan boshlanadi."),
    HumanMessage("Muddat?"), AIMessage("24 oygacha.")])

for strat in ["son", "token", "aqlli"]:
    print(f"\n═══ {strat} ═══")
    xb = XabarBoshqaruv(maks_token=60, strategiya=strat)
    r = xb.trim({"messages": XABARLAR})
    qolgan = add_messages(XABARLAR, r["messages"])
    print(f"  qolgan turlari: {[m.type for m in qolgan]}")
    xb.hisobot()
```

## 🏆 **UCH STRATEGIYANING FARQI SHU YERDA KO'RINADI:**
```
son    →  💥 SystemMessage o'chishi mumkin · uzun xabar chegarani buzadi
token  →  ✅ hajm nazoratda · ⚠️ system o'chishi mumkin · juftlik buzilishi mumkin
aqlli  →  🏆 system SAQLANADI · juftlik BUZILMAYDI · hajm nazoratda
```

## 💥 **"SystemMessage O'CHIRILDI — model ko'rsatmasiz qoldi!"** — bu ogohlantirish **eng qimmatlisi**. 🇺🇿 O'zbekcha botda system xabar o'chsa — model **inglizchaga o'tib ketadi**.

</details>

---

## 📌 Xulosa

```python
from langchain_core.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES

# Kursning yo'li
rm = [RemoveMessage(id=m.id) for m in state["messages"][:-5]]

# ⭐ Hammasini
rm = [RemoveMessage(id=REMOVE_ALL_MESSAGES)]

# 🏆 To'g'ri yo'l — token bo'yicha, system saqlanadi
saqlanadi = trim_messages(state["messages"], max_tokens=2000,
                          strategy="last", token_counter=tc,
                          include_system=True, start_on="human")
```

```
✅ 10 xabar → 5 ta RemoveMessage → 5 xabar qoldi
💥 mavjud bo'lmagan id → ValueError (yaxshi xatti-harakat)
⭐ REMOVE_ALL_MESSAGES = '__remove_all__' → 10 → 0

💥 [:-5] muammosi: 5 qisqa ≈ 50 token · 5 uzun ≈ 5000 token (100×)
🏆 langchain_core.trim_messages: token · include_system · start_on
```

> ## 💥 **`include_system` FAQAT `strategy="last"` BILAN** *(o'lchandi: aks holda `ValueError`)*.

---

⬅️ [3-dars. MessagesState](03-The-MessagesState-Class.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Xabarlarni qirqish](05-Trimming-Messages.md)
