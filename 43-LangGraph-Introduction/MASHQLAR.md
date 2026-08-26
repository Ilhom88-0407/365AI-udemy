# 📝 43-modul mashqlari

> **18 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ** — `FakeListChatModel` bilan.

## ⚙️ Tayyorgarlik

```bash
pip install langgraph langchain langchain-core tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time
from typing import Literal, Annotated
from typing_extensions import TypedDict
from collections.abc import Sequence
import tiktoken, pandas as pd

from langgraph.graph import START, END, StateGraph, add_messages, MessagesState
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage, RemoveMessage)
from langchain_core.language_models.fake_chat_models import FakeListChatModel

ENC = tiktoken.get_encoding("cl100k_base")


def model_ol(temperature=0):
    """⭐ Kalit bor bo'lsa OpenAI, yo'q bo'lsa mahalliy, u ham yo'q bo'lsa sinov."""
    if os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        print("✅ ChatOpenAI")
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature, seed=365)
    try:
        from langchain_ollama import ChatOllama
        m = ChatOllama(model="qwen2.5:7b", temperature=temperature)
        m.invoke("test")
        print("✅ ChatOllama")
        return m
    except Exception:
        pass
    print("⚠️ FakeListChatModel")
    return FakeListChatModel(responses=["Sinov javobi."] * 50)


chat = model_ol()
```

---

# 🟢 OSON *(1–7)*

**M1.** LLM nima uchun "eslamaydi"?

**M2.** LangGraph'ning asosiy tushunchasi nima?

**M3.** LCEL va LangGraph orasidagi asosiy farq?

**M4.** `TypedDict` ish vaqtida qanday obyekt?

**M5.** `Annotated` nima uchun kerak?

**M6.** API kaliti majburiymi?

**M7.** Xabarlarni boshqarishning uch usuli qaysi?

<details>
<summary>✅ Javoblar M1–M7</summary>

**M1.** ## **Stateless** — har chaqiruv **mustaqil**.

**M2.** ## **State** — tugundan tugunga o'tuvchi va **yangilanuvchi** ma'lumot.

**M3.** ## **SIKL.** LCEL — DAG *(orqaga qaytish yo'q)*, LangGraph — **graf**.

**M4.** ## **Oddiy `dict`** — ish vaqtida **hech narsa tekshirilmaydi**.

**M5.** Maydonga ## **reducer** biriktirish uchun.

**M6.** ## ❌ **Yo'q** — `FakeListChatModel` yoki **Ollama**.

**M7.** ## **Qo'shish** · **qirqish** · **xulosalash**.

</details>

---

# 🟡 O'RTA *(8–14)*

**M8.** ⭐ Xotirasizlikni ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
c = FakeListChatModel(responses=["Salom Oybek!", "Ismingizni bilmayman."])

print("── XOTIRASIZ ──")
print("1:", c.invoke([HumanMessage("Salom, men Oybek.")]).content)
print("2:", c.invoke([HumanMessage("Mening ismim nima?")]).content)

print("\n── QO'LDA TARIX ──")
tarix = [HumanMessage("Salom, men Oybek."),
         AIMessage("Salom Oybek!"),
         HumanMessage("Mening ismim nima?")]
print("modelga yuboriladi:", len(tarix), "xabar")
for m in tarix:
    print(f"   {m.type:6s} {m.content}")
```

## 🔑 **"XOTIRA" — BU FAQAT QAYTA YUBORISH.** LangGraph buni **avtomatlashtiradi**.

</details>

**M9.** ⭐⭐ Tarix o'sishini va narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
SAVOL = "Kredit foizi qancha va qanday hujjat kerak?"
JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha. "
         "Daromad spravkasi va pasport nusxasi talab qilinadi.")

tarix, q, jami_kirish = [], [], 0
for b in range(1, 21):
    tarix += [SAVOL, JAVOB]
    t = sum(len(ENC.encode(x)) for x in tarix)
    jami_kirish += t
    if b in (1, 5, 10, 20):
        q.append({"burilish": b, "xabar": len(tarix), "kontekst_token": t})

print(pd.DataFrame(q).to_string(index=False))
print(f"\n20 burilishda JAMI kirish tokeni: {jami_kirish}")
print(f"💰 gpt-4o-mini: ${jami_kirish/1e6*0.15:.5f} · "
      f"gpt-4o: ${jami_kirish/1e6*2.5:.4f}")
print("💥 tarix CHIZIQLI o'sadi, JAMI narx esa KVADRATIK")
```

</details>

**M10.** ⭐⭐ Uch usulni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
XULOSA = "Foydalanuvchi kredit shartlari bilan qiziqmoqda."
BURILISH = 20

q = []
for usul in ["qo'shish", "trim=5", "xulosalash"]:
    tarix, kirish, chaqiruv = [], 0, 0
    for b in range(BURILISH):
        tarix += [SAVOL, JAVOB]
        if usul == "trim=5":
            tarix = tarix[-5:]
        elif usul == "xulosalash":
            tarix = [XULOSA]
        kirish += sum(len(ENC.encode(x)) for x in tarix)
        chaqiruv += 2 if usul == "xulosalash" else 1
    q.append({"usul": usul, "LLM_chaqiruv": chaqiruv, "kirish_token": kirish})

d = pd.DataFrame(q)
d["narx_$"] = (d.kirish_token / 1e6 * 0.15).round(5)
print(d.to_string(index=False))
print("\n🔑 xulosalash TOKENNI kamaytiradi, CHAQIRUVNI ikkilantiradi")
```

</details>

**M11.** ⭐ `TypedDict` ning "yumshoq"ligi.

<details>
<summary>✅ Yechim</summary>

```python
class Holat(TypedDict):
    messages: list
    summary: str

h = Holat(messages=[], summary="")
print("turi     :", type(h).__name__)
print("dict mi? :", isinstance(h, dict))

h["mavjud_emas"] = 42          # 💥 xato YO'Q
h["summary"] = 12345           # 💥 xato YO'Q
print("natija   :", h)
print("\n⚠️ Python HECH NARSA demadi → .get() ishlating")
print("xavfsiz  :", h.get("yoq_kalit", "standart qiymat"))
```

</details>

**M12.** ⭐ `FakeListChatModel` ni to'liq sinang.

<details>
<summary>✅ Yechim</summary>

```python
c = FakeListChatModel(responses=["Birinchi.", "Ikkinchi.", "Uchinchi."])

for i in range(5):
    print(f"  {i}: {c.invoke([HumanMessage('x')]).content}")

print("\n⭐ javoblar SIKL bo'yicha qaytariladi — takrorlanuvchan sinov")
print("batch :", [m.content for m in c.batch(["a", "b"])])
print("stream:", "".join(x.content for x in c.stream("x")))
print("turi  :", type(c.invoke("x")).__name__)
```

## 🏆 **INTERFEYS `ChatOpenAI` BILAN BIR XIL** — grafni **o'zgartirmasdan** almashtira olasiz.

</details>

**M13.** ⭐⭐ 🇺🇿 O'zbekcha suhbat narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
UZ = ["Salom! Men Oybek. Bankdan kredit olmoqchiman.",
      "Salom Oybek! Qanday kredit turi sizni qiziqtiradi?",
      "Iste'mol krediti. Foiz stavkasi qancha?",
      "Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha."]
EN = ["Hi! I'm Oybek. I would like to get a loan from the bank.",
      "Hello Oybek! What type of loan are you interested in?",
      "A consumer loan. What is the interest rate?",
      "Consumer loans start at 24% annually, up to 24 months."]

o200 = tiktoken.get_encoding("o200k_base")
for nom, xs in [("🇺🇿 UZ", UZ), ("🇬🇧 EN", EN)]:
    print(f"  {nom}: cl100k {sum(len(ENC.encode(x)) for x in xs):3d} · "
          f"o200k {sum(len(o200.encode(x)) for x in xs):3d} · "
          f"{sum(len(x) for x in xs):3d} belgi")

nis = sum(len(ENC.encode(x)) for x in UZ) / sum(len(ENC.encode(x)) for x in EN)
print(f"\n  nisbat: {nis:.2f}×")
print(f"  → 20 burilish: 🇬🇧 ~{sum(len(ENC.encode(x)) for x in EN)*5} · "
      f"🇺🇿 ~{int(sum(len(ENC.encode(x)) for x in UZ)*5)} token")
```

## 💡 **O'LCHANGAN: 1.40×** *(bu misolda)*. 36-moduldagi umumiy nisbat — **1.88×**. Farq **matnga bog'liq**.

</details>

**M14.** ⭐⭐ LCEL yoki LangGraph — qaror jadvali.

<details>
<summary>✅ Yechim</summary>

```python
QAROR = [
    ("Matnni tarjima qilish",              False, False, "LCEL"),
    ("RAG: savol → hujjat → javob",        False, False, "LCEL"),
    ("Suhbat + xotira",                    False, True,  "⭐ LangGraph"),
    ("'Yana savolingiz bormi?'",           True,  True,  "⭐ LangGraph"),
    ("Ko'p bo'limga marshrutlash",         False, False, "LCEL/LangGraph"),
    ("Ko'p qadamli forma",                 True,  True,  "⭐ LangGraph"),
    ("Agent (vosita chaqirish sikli)",     True,  True,  "⭐⭐ LangGraph"),
]
d = pd.DataFrame(QAROR, columns=["vazifa", "sikl", "holat", "tanlov"])
print(d.to_string(index=False))
print("\n🔑 QOIDA: sikl YOKI holat kerakmi? → LangGraph. Aks holda → LCEL.")
```

</details>

---

# 🔴 QIYIN *(15–18)*

**M15.** ⭐⭐⭐ Suhbat xotirasi menejerini yozing *(LangGraphsiz)*.

<details>
<summary>✅ Yechim</summary>

```python
class SuhbatXotirasi:
    """LangGraph nima qilishini QO'LDA takrorlaydi — farqni ko'rish uchun."""

    def __init__(self, chat, maks_token=1000, strategiya="trim", n=5):
        self.chat, self.maks_token = chat, maks_token
        self.strategiya, self.n = strategiya, n
        self.tarix, self.xulosa = [], ""
        self.statistika = []

    def _token(self, xabarlar):
        return sum(len(ENC.encode(str(m.content))) for m in xabarlar)

    def _boshqar(self):
        if self.strategiya == "qo'shish":
            return
        if self.strategiya == "trim":
            if self._token(self.tarix) > self.maks_token:
                oldin = len(self.tarix)
                self.tarix = self.tarix[-self.n:]
                print(f"  ✂️ {oldin} → {len(self.tarix)} xabar")
        elif self.strategiya == "xulosalash":
            if self._token(self.tarix) > self.maks_token:
                matn = "\n".join(f"{m.type}: {m.content}" for m in self.tarix)
                self.xulosa = self.chat.invoke(
                    [HumanMessage(f"Oldingi xulosa: {self.xulosa}\n"
                                  f"Yangi suhbat:\n{matn}\nYangilangan xulosani yoz.")]
                ).content
                print(f"  📝 xulosalandi ({len(self.tarix)} xabar o'chirildi)")
                self.tarix = []

    def sora(self, savol):
        self.tarix.append(HumanMessage(savol))
        kirish = ([SystemMessage(f"Suhbat xulosasi: {self.xulosa}")]
                  if self.xulosa else []) + self.tarix
        javob = self.chat.invoke(kirish)
        self.tarix.append(javob)
        self.statistika.append({"burilish": len(self.statistika) + 1,
                                "xabar": len(self.tarix),
                                "kirish_token": self._token(kirish),
                                "xulosa_bor": bool(self.xulosa)})
        self._boshqar()
        return javob.content

    def hisobot(self):
        d = pd.DataFrame(self.statistika)
        print(d.to_string(index=False))
        print(f"\njami kirish tokeni: {d.kirish_token.sum()}")
        print(f"💰 gpt-4o-mini    : ${d.kirish_token.sum()/1e6*0.15:.5f}")
        return d


for strat in ["qo'shish", "trim", "xulosalash"]:
    print(f"\n═══ {strat} ═══")
    x = SuhbatXotirasi(FakeListChatModel(responses=[JAVOB] * 40),
                       maks_token=200, strategiya=strat, n=4)
    for i in range(8):
        x.sora(SAVOL)
    x.hisobot()
```

## 🏆 **BU SINF — LANGGRAPH SIZ QANDAY BO'LISHINI KO'RSATADI.** 46–47-modullarda **shu logikani** LangGraph **o'zi** qiladi.

</details>

**M16.** ⭐⭐⭐ Graf rejalashtiruvchi.

<details>
<summary>✅ Yechim</summary>

```python
class GrafReja:
    """Grafni KOD YOZISHDAN OLDIN tekshiradi."""

    def __init__(self, nom):
        self.nom = nom
        self.tugunlar, self.qirralar, self.shartli = [], [], []
        self.state = []

    def tugun(self, nom, vazifa):
        self.tugunlar.append({"nom": nom, "vazifa": vazifa})
        return self

    def qirra(self, a, b):
        self.qirralar.append((a, b))
        return self

    def shart(self, manba, yollar):
        self.shartli.append((manba, yollar))
        return self

    def holat(self, *maydonlar):
        self.state = list(maydonlar)
        return self

    def tekshir(self):
        print(f"📋 {self.nom}")
        print(f"  tugunlar: {len(self.tugunlar)} · state: {self.state}")
        xato = []

        nomlar = {t["nom"] for t in self.tugunlar} | {"START", "END"}
        for a, b in self.qirralar:
            if a not in nomlar:
                xato.append(f"qirra manbai yo'q: {a}")
            if b not in nomlar:
                xato.append(f"qirra maqsadi yo'q: {b}")

        kiruvchi = {b for _, b in self.qirralar}
        kiruvchi |= {m for _, y in self.shartli for m in y.values()}
        for t in self.tugunlar:
            if t["nom"] not in kiruvchi:
                xato.append(f"💥 '{t['nom']}' tuguniga HECH KIM kirmaydi")

        chiquvchi = {a for a, _ in self.qirralar} | {m for m, _ in self.shartli}
        for t in self.tugunlar:
            if t["nom"] not in chiquvchi:
                xato.append(f"💥 '{t['nom']}' tugunidan CHIQISH yo'q")

        end_bor = any(b == "END" for _, b in self.qirralar) or any(
            "END" in y.values() for _, y in self.shartli)
        if not end_bor:
            xato.append("💥 END ga yo'l YO'Q — graf TO'XTAMAYDI")

        sikl = [(m, s, t) for m, y in self.shartli for s, t in y.items()
                if t in {x["nom"] for x in self.tugunlar}]
        if sikl:
            print("  ⭐ SIKL bor:")
            for m, s, t in sikl:
                print(f"      {m} --{s}--> {t}")
            print("  ⚠️ recursion_limit ni QO'LDA qo'ying! (standart 10000+)")

        if not self.state:
            xato.append("💥 state BO'SH — nima uzatiladi?")

        if xato:
            print(f"\n  ❌ {len(xato)} MUAMMO:")
            for x in xato:
                print(f"      {x}")
        else:
            print("\n  ✅ tuzilish to'g'ri")
        return not xato


(GrafReja("Bank kredit yordamchisi")
 .holat("messages", "summa", "muddat", "foiz")
 .tugun("salomlash", "foydalanuvchini kutib oladi")
 .tugun("summa_sorash", "kredit summasini so'raydi")
 .tugun("hisoblash", "oylik to'lovni hisoblaydi")
 .tugun("tasdiqlash", "ha/yo'q so'raydi")
 .qirra("START", "salomlash")
 .qirra("salomlash", "summa_sorash")
 .qirra("summa_sorash", "hisoblash")
 .qirra("hisoblash", "tasdiqlash")
 .shart("tasdiqlash", {"ha": "END", "yo'q": "summa_sorash"})
 .tekshir())
```

## 🏆 **"TUGUNGA HECH KIM KIRMAYDI" VA "CHIQISH YO'Q" — ENG KO'P UCHRAYDIGAN XATOLAR.**

</details>

**M17.** ⭐⭐⭐ Universal model tanlovchi.

<details>
<summary>✅ Yechim</summary>

```python
class ModelTanlovchi:
    """Mavjud imkoniyatlardan ENG YAXSHISINI tanlaydi va SABABINI aytadi."""

    def __init__(self, temperature=0, seed=365):
        self.temperature, self.seed = temperature, seed
        self.tanlangan, self.sabab = None, ""

    def _openai(self):
        if not os.getenv("OPENAI_API_KEY"):
            return None, "OPENAI_API_KEY yo'q"
        try:
            from langchain_openai import ChatOpenAI
            m = ChatOpenAI(model="gpt-4o-mini", temperature=self.temperature,
                           seed=self.seed)
            m.invoke("hi")
            return m, "OK"
        except Exception as e:
            return None, f"{type(e).__name__}: {str(e)[:50]}"

    def _ollama(self, model="qwen2.5:7b"):
        try:
            from langchain_ollama import ChatOllama
            m = ChatOllama(model=model, temperature=self.temperature)
            m.invoke("hi")
            return m, "OK"
        except Exception as e:
            return None, f"{type(e).__name__}: {str(e)[:50]}"

    def _fake(self):
        return FakeListChatModel(responses=["Sinov javobi."] * 100), "OK"

    def ol(self):
        for nom, f in [("ChatOpenAI", self._openai),
                       ("ChatOllama", self._ollama),
                       ("FakeListChatModel", self._fake)]:
            m, s = f()
            if m is not None:
                self.tanlangan, self.sabab = nom, s
                belgi = "⚠️" if nom == "FakeListChatModel" else "✅"
                print(f"{belgi} {nom}")
                if nom == "FakeListChatModel":
                    print("   javoblar SOXTA — faqat graf mantiqini sinash uchun")
                return m
            print(f"❌ {nom}: {s}")
        raise RuntimeError("hech qanday model topilmadi")


chat = ModelTanlovchi().ol()
print("javob:", chat.invoke([HumanMessage("salom")]).content[:60])
```

## 🏆 **BUTUN BO'LIM DAVOMIDA SHU FUNKSIYANI ISHLATING.**

</details>

**M18.** ⭐⭐⭐ 🇺🇿 Suhbat narxini bashorat qiluvchi.

<details>
<summary>✅ Yechim</summary>

```python
NARXLAR = {                       # $/1M token (kirish, chiqish)
    "gpt-4o-mini": (0.15, 0.60),
    "gpt-4o":      (2.50, 10.00),
    "gpt-4.1-mini": (0.40, 1.60),
}

def narx_bashorat(ortacha_savol_token, ortacha_javob_token,
                  burilish=20, kunlik_suhbat=1000,
                  strategiya="qo'shish", trim_n=5, til="uz"):
    kupaytiruvchi = 1.88 if til == "uz" else 1.0
    s = ortacha_savol_token * kupaytiruvchi
    j = ortacha_javob_token * kupaytiruvchi

    kirish, chiqish, chaqiruv = 0, 0, 0
    tarix = 0
    for b in range(burilish):
        tarix += s + j
        if strategiya == "trim":
            tarix = min(tarix, (s + j) * trim_n / 2)
        elif strategiya == "xulosalash":
            tarix = 60 * kupaytiruvchi
        kirish += tarix
        chiqish += j
        chaqiruv += 2 if strategiya == "xulosalash" else 1

    q = []
    for model, (nk, nc) in NARXLAR.items():
        bir = kirish / 1e6 * nk + chiqish / 1e6 * nc
        q.append({"model": model, "1_suhbat_$": round(bir, 5),
                  "kunlik_$": round(bir * kunlik_suhbat, 2),
                  "yillik_$": round(bir * kunlik_suhbat * 365)})
    d = pd.DataFrame(q)
    print(f"🇺🇿 til={til} · strategiya={strategiya} · {burilish} burilish · "
          f"{chaqiruv} chaqiruv")
    print(f"   kirish {int(kirish)} · chiqish {int(chiqish)} token/suhbat")
    print(d.to_string(index=False))
    return d


for strat in ["qo'shish", "trim", "xulosalash"]:
    print()
    narx_bashorat(40, 80, strategiya=strat, til="uz")
```

## 💥 **🇺🇿 O'ZBEKCHADA NARX 1.88× YUQORI** — bu **arxitektura qaroriga** ta'sir qiladi.

## 🏆 **YILLIK RAQAMNI KO'RING** — strategiya tanlovi **minglab dollarga** teng.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
Annotated YO'Q  →  1 xabar   💥 savol YO'QOLADI
Annotated BOR   →  3 xabar   ✅

10-burilish:  trim yo'q 30 xabar/590 token · trim=5  5 xabar/113 token  (5.2×)
Xulosalash :  5 burilish → 10 LLM chaqiruvi  (2×)
🇺🇿 token   :  1.40× (bu misolda) · 1.88× (36-modul umumiy)
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
