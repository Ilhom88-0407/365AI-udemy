# 🚀 45-modul mini-loyihalari

> **4 ta tayyor loyiha.** ## ⭐⭐ **Hammasi API kalitisiz ishlaydi** — `FakeListChatModel` bilan.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langgraph langchain-core grandalf pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, json, operator
from pathlib import Path
from typing import Literal, Annotated, get_type_hints, get_origin, get_args
from typing_extensions import TypedDict
from collections.abc import Sequence
import pandas as pd

from langgraph.graph import START, END, StateGraph, add_messages
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import interrupt, Command
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage)
from langchain_core.language_models.fake_chat_models import FakeListChatModel

chat = FakeListChatModel(responses=["Javob matni."] * 200)
```

---

# 🔍 1-loyiha. Graf linteri

> **Maqsad:** `compile()` **tekshirmaydigan** xatolarni topish — reducer yo'qligi, yetib bo'lmas tugun, cheksiz sikl.

```python
class GrafLinter:
    """compile() dan KEYIN ishga tushiriladigan statik tekshiruvchi."""

    def __init__(self, graph, state_sinfi, nom="graf"):
        self.graph, self.S, self.nom = graph, state_sinfi, nom
        self.xato, self.ogoh, self.maslahat = [], [], []
        self.gg = None

    # ───── ① state sxemasi ─────
    def _state(self):
        try:
            hints = get_type_hints(self.S, include_extras=True)
        except Exception:
            hints = getattr(self.S, "__annotations__", {})
        self.hints = hints

        if not hints:
            self.xato.append("💥 state BO'SH — hech qanday maydon yo'q")
            return

        for nom, tip in hints.items():
            reducerli = get_origin(tip) is Annotated

            if nom == "messages" and not reducerli:
                self.xato.append(
                    "💥 'messages' da REDUCER yo'q → har tugun ro'yxatni "
                    "ALMASHTIRADI → foydalanuvchi savoli YO'QOLADI "
                    "(o'lchandi: 1 xabar, 3 emas)")
                self.maslahat.append(
                    "messages: Annotated[Sequence[BaseMessage], add_messages]")
                continue

            if not reducerli:
                asos = get_args(tip)[0] if get_args(tip) else tip
                if str(asos).startswith(("list", "typing.List",
                                         "collections.abc.Sequence")):
                    self.ogoh.append(
                        f"⚠️ '{nom}' — ro'yxat, lekin reducer yo'q. "
                        f"Parallel tugunlar yozsa: InvalidUpdateError")
                    self.maslahat.append(
                        f"{nom}: Annotated[list, operator.add]")

    # ───── ② tuzilish ─────
    def _tuzilish(self):
        try:
            self.gg = self.graph.compile().get_graph()
        except Exception as e:
            self.xato.append(f"💥 compile: {type(e).__name__}: {str(e)[:70]}")
            return

        tugunlar = set(self.gg.nodes) - {"__start__", "__end__"}
        kiruvchi = {e.target for e in self.gg.edges}
        chiquvchi = {e.source for e in self.gg.edges}

        for t in sorted(tugunlar):
            if t not in kiruvchi:
                self.xato.append(f"💥 '{t}' tuguniga HECH KIM kirmaydi — "
                                 f"u HECH QACHON ishga tushmaydi")
            if t not in chiquvchi:
                self.xato.append(f"💥 '{t}' tugunidan CHIQISH yo'q")

        if "__end__" not in kiruvchi:
            self.xato.append("💥 END ga yo'l YO'Q — graf to'xtamasligi mumkin")
        if "__start__" not in chiquvchi:
            self.xato.append("💥 START dan chiqish yo'q")

    # ───── ③ sikl ─────
    def _sikl(self):
        if self.gg is None:
            return
        shartli = [e for e in self.gg.edges if getattr(e, "conditional", False)]
        if not shartli:
            return

        self.ogoh.append(
            f"⭐ {len(shartli)} shartli qirra — SIKL bo'lishi mumkin. "
            f"recursion_limit standart holda 10 007 (o'lchandi: ~5000 aylanish)")
        self.maslahat.append('invoke(state, {"recursion_limit": 30})')

        if "burilish" not in getattr(self, "hints", {}):
            self.ogoh.append(
                "⚠️ state'da 'burilish' hisoblagichi yo'q — "
                "NAZORATLI to'xtash imkonsiz, faqat GraphRecursionError")
            self.maslahat.append("burilish: int   # + routing'da chegara")

    # ───── ④ narx ─────
    def _narx(self, llm_tugunlar=None):
        if not llm_tugunlar:
            return
        if len(llm_tugunlar) > 1:
            self.ogoh.append(
                f"💰 {len(llm_tugunlar)} ta LLM tuguni: {llm_tugunlar} — "
                f"har burilishda {len(llm_tugunlar)}× chaqiruv va narx")

    # ───── hisobot ─────
    def tekshir(self, llm_tugunlar=None):
        self._state()
        self._tuzilish()
        self._sikl()
        self._narx(llm_tugunlar)

        print(f"🔍 {self.nom}")
        if self.gg is not None:
            t = set(self.gg.nodes) - {"__start__", "__end__"}
            print(f"   tugunlar: {len(t)} {sorted(t)}")
        print(f"   state   : {list(getattr(self, 'hints', {}))}")

        if self.xato:
            print(f"\n   ❌ {len(self.xato)} XATO:")
            for x in self.xato:
                print(f"       {x}")
        if self.ogoh:
            print(f"\n   ⚠️ {len(self.ogoh)} ogohlantirish:")
            for o in self.ogoh:
                print(f"       {o}")
        if self.maslahat:
            print(f"\n   💡 TAVSIYALAR:")
            for m in dict.fromkeys(self.maslahat):     # takrorlanmasin
                print(f"       {m}")
        if not self.xato and not self.ogoh:
            print("\n   ✅ muammo topilmadi")
        return {"xato": self.xato, "ogoh": self.ogoh}


# ─── sinov: YOMON graf ───
class YomonState(TypedDict):
    messages: Sequence[BaseMessage]              # 💥 reducer yo'q
    natijalar: list                              # ⚠️ reducer yo'q

g = StateGraph(YomonState)
g.add_node("ask", lambda s: {"messages": [HumanMessage("savol")]})
g.add_node("bot", lambda s: {"messages": [chat.invoke(s["messages"])]})
g.add_node("yolgiz", lambda s: {})              # 💥 hech kim kirmaydi
g.add_edge(START, "ask")
g.add_edge("ask", "bot")
g.add_conditional_edges("bot", lambda s: "ask")  # 💥 END ga yo'l yo'q

GrafLinter(g, YomonState, "YOMON GRAF").tekshir(llm_tugunlar=["bot"])

# ─── sinov: YAXSHI graf ───
print("\n" + "─" * 60 + "\n")

class YaxshiState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    natijalar: Annotated[list, operator.add]
    burilish: int

g2 = StateGraph(YaxshiState)
g2.add_node("ask", lambda s: {"messages": [HumanMessage("savol")],
                              "burilish": s.get("burilish", 0) + 1})
g2.add_node("bot", lambda s: {"messages": [chat.invoke(s["messages"])]})
g2.add_edge(START, "ask")
g2.add_edge("ask", "bot")
g2.add_conditional_edges(
    "bot", lambda s: "__end__" if s.get("burilish", 0) >= 5 else "ask")

GrafLinter(g2, YaxshiState, "YAXSHI GRAF").tekshir(llm_tugunlar=["bot"])
```

> ## 🏆 **LINTER TOPADIGAN 6 TA MUAMMO — `compile()` HECH BIRINI TOPMAYDI:**
> ```
> ① 💥 'messages' da reducer yo'q       →  savol YO'QOLADI
> ② ⚠️ ro'yxatda reducer yo'q           →  parallel yozuvda InvalidUpdateError
> ③ 💥 tuguniga hech kim kirmaydi       →  o'lik kod
> ④ 💥 tugunidan chiqish yo'q           →  graf ishga tushmaydi
> ⑤ 💥 END ga yo'l yo'q                 →  cheksiz sikl
> ⑥ ⚠️ 'burilish' hisoblagichi yo'q     →  nazoratsiz to'xtash
> ```
>
> ## 💡 **`llm_tugunlar` — 💰 NARXNI OLDINDAN KO'RISH.** Ikki LLM tuguni = **ikki barobar** chaqiruv.

---

# 🎭 2-loyiha. Interaktiv graf ishga tushiruvchi

> **Maqsad:** `input()` siz — bir grafni **notebookda**, **testda** va **botda** bir xil ishlatish.

```python
class GrafIshgaTushiruvchi:
    """interrupt bilan ishlaydigan grafni UCH REJIMDA ishga tushiradi."""

    def __init__(self, graph_compiled, thread_id="1"):
        self.gc = graph_compiled
        self.cfg = {"configurable": {"thread_id": str(thread_id)}}
        self.tarix = []

    # ── ① avtomatik: oldindan tayyor javoblar (TEST uchun) ──
    def avtomatik(self, kirish, javoblar, maks_qadam=50):
        j = iter(javoblar)
        r = self.gc.invoke(kirish, self.cfg)
        qadam = 0
        while r.get("__interrupt__") and qadam < maks_qadam:
            savol = r["__interrupt__"][0].value
            javob = next(j, None)
            if javob is None:
                print(f"⚠️ javoblar tugadi, lekin graf hali so'ramoqda: {savol}")
                break
            self.tarix.append({"savol": savol, "javob": javob})
            print(f"  ❓ {savol}\n  ✍️ {javob}")
            r = self.gc.invoke(Command(resume=javob), self.cfg)
            qadam += 1
        if qadam >= maks_qadam:
            print(f"⚠️ {maks_qadam} qadam chegarasi")
        return r

    # ── ② interaktiv: haqiqiy input() (NOTEBOOK/terminal uchun) ──
    def interaktiv(self, kirish, maks_qadam=50):
        r = self.gc.invoke(kirish, self.cfg)
        qadam = 0
        while r.get("__interrupt__") and qadam < maks_qadam:
            savol = r["__interrupt__"][0].value
            javob = input(f"{savol} ")
            self.tarix.append({"savol": savol, "javob": javob})
            r = self.gc.invoke(Command(resume=javob), self.cfg)
            qadam += 1
        return r

    # ── ③ qadamma-qadam: bot/veb uchun (⭐ ASOSIY) ──
    def boshla(self, kirish):
        """Grafni boshlaydi. So'rov bo'lsa — savolni qaytaradi."""
        r = self.gc.invoke(kirish, self.cfg)
        return self._holat(r)

    def javob_ber(self, javob):
        """Foydalanuvchi javobini uzatadi. KEYINROQ chaqirilishi mumkin."""
        r = self.gc.invoke(Command(resume=javob), self.cfg)
        return self._holat(r)

    def _holat(self, r):
        if r.get("__interrupt__"):
            return {"tugadi": False,
                    "savol": r["__interrupt__"][0].value,
                    "holat": r}
        return {"tugadi": True, "savol": None, "holat": r}

    def hisobot(self):
        if not self.tarix:
            print("tarix bo'sh")
            return
        print(pd.DataFrame(self.tarix).to_string(index=False))
        snap = self.gc.get_state(self.cfg)
        print(f"\nnext : {snap.next}")
        print(f"step : {snap.metadata.get('step')}")
        return self.tarix


# ─── sinov grafi ───
class AnketaState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    javoblar: Annotated[list, operator.add]
    qadam: int

SAVOLLAR = ["Ismingiz?", "Yoshingiz?", "Telefon raqamingiz?"]


def sora(s: AnketaState) -> AnketaState:
    q = s.get("qadam", 0)
    javob = interrupt(SAVOLLAR[q])              # ⭐ input() EMAS
    return {"messages": [AIMessage(SAVOLLAR[q]), HumanMessage(str(javob))],
            "javoblar": [str(javob)]}


def tekshir(s: AnketaState) -> AnketaState:
    q, javob = s.get("qadam", 0), s["javoblar"][-1]
    ok = True
    if q == 1:
        ok = javob.isdigit() and 18 <= int(javob) <= 100
        if not ok:
            print("  💥 yosh 18–100 oralig'ida bo'lsin")
    elif q == 2:
        ok = javob.startswith("+998") and len(javob) == 13
        if not ok:
            print("  💥 telefon +998XXXXXXXXX ko'rinishida bo'lsin")
    return {"qadam": q + 1 if ok else q}


def yol(s: AnketaState) -> Literal["sora", "__end__"]:
    return "__end__" if s["qadam"] >= len(SAVOLLAR) else "sora"


g = StateGraph(AnketaState)
g.add_node("sora", sora)
g.add_node("tekshir", tekshir)
g.add_edge(START, "sora")
g.add_edge("sora", "tekshir")
g.add_conditional_edges("tekshir", yol)
gc = g.compile(checkpointer=InMemorySaver())     # ⚠️ interrupt uchun SHART

# ── ① avtomatik rejim (test) ──
print("═══ AVTOMATIK (test) ═══")
it = GrafIshgaTushiruvchi(gc, thread_id="test")
r = it.avtomatik(AnketaState(messages=[], javoblar=[], qadam=0),
                 javoblar=["Oybek", "17", "30", "+998901234567"])
print("\n✅ javoblar:", r["javoblar"])
it.hisobot()

# ── ③ qadamma-qadam rejim (bot) ──
print("\n═══ QADAMMA-QADAM (bot) ═══")
bot_it = GrafIshgaTushiruvchi(gc, thread_id="user_12345")
h = bot_it.boshla(AnketaState(messages=[], javoblar=[], qadam=0))
print("bot yuboradi:", h["savol"])
# ... soatlar o'tishi mumkin, jarayon BO'SH ...
h = bot_it.javob_ber("Dilnoza")
print("bot yuboradi:", h["savol"])
h = bot_it.javob_ber("25")
print("bot yuboradi:", h["savol"])
h = bot_it.javob_ber("+998901112233")
print("tugadi:", h["tugadi"], "· javoblar:", h["holat"]["javoblar"])
```

> ## 🏆🏆 **BITTA GRAF — UCH REJIM:**
> ```
> avtomatik      →  ⭐ TEST (CI'da input() ishlamaydi)
> interaktiv     →  notebook / terminal
> qadamma-qadam  →  ⭐⭐ Telegram bot · FastAPI · mobil ilova
> ```
>
> ## 💥 **`input()` BILAN BULARNING FAQAT BITTASI ISHLAYDI.**
>
> ## 🔑 **`thread_id` — HAR FOYDALANUVCHIGA ALOHIDA.** `"user_12345"` — Telegram user ID. Har biri **o'z suhbatida**.
>
> ## ⚠️ **`checkpointer` SHART** — `interrupt` holatni **saqlashi** kerak *(47-modul)*.

---

# 📊 3-loyiha. Graf profileri

> **Maqsad:** qaysi tugun **sekin**, qaysi tugun **ko'p chaqirilmoqda**, va **narx qayerda**.

```python
class GrafProfiler:
    """Har tugunning vaqti, chaqiruvi va LLM narxini o'lchaydi."""

    NARX = {"gpt-4o-mini": (0.15, 0.60), "gpt-4o": (2.50, 10.00)}

    def __init__(self, nom="graf"):
        self.nom = nom
        self.yozuvlar = []
        self.llm_tugunlar = set()

    def tugun(self, graph, nom, f, llm=False):
        """Tugunni o'rab, grafga qo'shadi."""
        if llm:
            self.llm_tugunlar.add(nom)
        prof = self

        def orab(state):
            t0 = time.perf_counter()
            kirish_xabar = len(state.get("messages", []))
            kirish_belgi = sum(len(str(m.content))
                               for m in state.get("messages", []))
            xato = None
            natija = {}
            try:
                natija = f(state)
            except Exception as e:
                xato = f"{type(e).__name__}: {str(e)[:40]}"
                raise
            finally:
                prof.yozuvlar.append({
                    "tugun": nom,
                    "llm": llm,
                    "ms": round((time.perf_counter() - t0) * 1000, 2),
                    "kirish_xabar": kirish_xabar,
                    "kirish_belgi": kirish_belgi,
                    "qaytardi": ",".join(natija) if natija else "—",
                    "xato": xato})
            return natija

        graph.add_node(nom, orab)
        return graph

    # ───── hisobot ─────
    def hisobot(self, model="gpt-4o-mini", kunlik_suhbat=1000):
        if not self.yozuvlar:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.yozuvlar)

        print(f"📊 {self.nom} — {len(d)} qadam")
        print("\n── qadamlar ──")
        print(d.to_string(index=False))

        print("\n── tugun bo'yicha ──")
        j = d.groupby("tugun").agg(
            chaqiruv=("ms", "size"),
            jami_ms=("ms", "sum"),
            ortacha_ms=("ms", "mean"),
            maks_ms=("ms", "max")).round(2).sort_values("jami_ms",
                                                        ascending=False)
        print(j.to_string())

        # ── ① eng sekin ──
        eng = j.index[0]
        ulush = j.jami_ms.iloc[0] / j.jami_ms.sum()
        print(f"\n🐌 ENG SEKIN: '{eng}' — vaqtning {ulush:.0%} qismi")
        if ulush > 0.6:
            print(f"   💡 faqat '{eng}' ni optimallashtirsangiz — "
                  f"sezilarli foyda")

        # ── ② LLM narxi ──
        llm = d[d.llm]
        if len(llm):
            # taxminiy: 4 belgi ≈ 1 token
            kirish_tok = llm.kirish_belgi.sum() / 4
            nk, nc = self.NARX[model]
            chiqish_tok = len(llm) * 100          # taxminiy javob
            bir = kirish_tok / 1e6 * nk + chiqish_tok / 1e6 * nc
            print(f"\n💰 LLM: {len(llm)} chaqiruv · "
                  f"~{int(kirish_tok)} kirish token")
            print(f"   1 suhbat  : ${bir:.5f}")
            print(f"   kunlik    : ${bir * kunlik_suhbat:.2f}")
            print(f"   yillik    : ${bir * kunlik_suhbat * 365:,.0f}")

        # ── ③ kontekst o'sishi ──
        if "kirish_xabar" in d and d.kirish_xabar.max() > 0:
            osish = d.kirish_xabar.max() - d.kirish_xabar.min()
            print(f"\n📈 kontekst: {d.kirish_xabar.min()} → "
                  f"{d.kirish_xabar.max()} xabar (+{osish})")
            if d.kirish_xabar.max() > 20:
                print("   ⚠️ kontekst KATTA — 46-moduldagi trim yoki "
                      "xulosalash kerak")

        # ── ④ bo'sh qaytarish ──
        bosh = d[(d.qaytardi == "—") & d.xato.isna()]
        if len(bosh):
            print(f"\n⚠️ {len(bosh)} chaqiruv HECH NARSA qaytarmadi: "
                  f"{sorted(bosh.tugun.unique())}")

        # ── ⑤ xatolar ──
        xat = d[d.xato.notna()]
        if len(xat):
            print(f"\n💥 {len(xat)} XATO:")
            for _, r in xat.iterrows():
                print(f"    {r.tugun}: {r.xato}")
        return d


# ─── sinov ───
class S(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    burilish: int

prof = GrafProfiler("kredit yordamchisi")

def sora(s):
    time.sleep(0.005)
    return {"messages": [AIMessage("Savolingiz?"),
                         HumanMessage("Kredit foizi qancha va shartlari?")],
            "burilish": s.get("burilish", 0) + 1}

def bot(s):
    time.sleep(0.04)                          # LLM sekin
    return {"messages": [chat.invoke(s["messages"])]}

def jurnal(s):
    return {}                                 # ⚠️ hech narsa qaytarmaydi

g = StateGraph(S)
prof.tugun(g, "sora", sora)
prof.tugun(g, "chatbot", bot, llm=True)       # ⭐ LLM deb belgilaymiz
prof.tugun(g, "jurnal", jurnal)
g.add_edge(START, "sora")
g.add_edge("sora", "chatbot")
g.add_edge("chatbot", "jurnal")
g.add_conditional_edges(
    "jurnal", lambda s: "__end__" if s.get("burilish", 0) >= 5 else "sora")
gc = g.compile()

gc.invoke(S(messages=[], burilish=0), {"recursion_limit": 40})
prof.hisobot(model="gpt-4o-mini", kunlik_suhbat=1000)
```

> ## 🏆 **BESH TASHXIS:**
> ```
> 🐌 eng sekin tugun    →  qayerni optimallashtirish
> 💰 LLM narxi          →  yillik raqam — ⭐ ARXITEKTURA qarori
> 📈 kontekst o'sishi   →  46-modul kerakmi?
> ⚠️ bo'sh qaytarish    →  tugun hech narsa qilmadi
> 💥 xatolar            →  qaysi tugunda
> ```
>
> ## 💡 **`llm=True` NI FAQAT MODEL CHAQIRADIGAN TUGUNLARGA QO'YING** — narx hisobi **o'shalar** bo'yicha yuritiladi.

---

# 🧪 4-loyiha. Graf test to'plami

> **Maqsad:** grafni **CI'da** avtomatik sinash — API kalitisiz, `input()` siz, **takrorlanuvchan**.

```python
class GrafTest:
    """Grafni sinov holatlari bilan tekshiradi va HISOBOT beradi."""

    def __init__(self, graph_yaratuvchi, nom="graf"):
        """graph_yaratuvchi() → (compiled_graph, State) — HAR testda YANGI."""
        self.yaratuvchi = graph_yaratuvchi
        self.nom = nom
        self.natijalar = []

    def holat(self, nom, kirish, javoblar=None, kutilgan=None,
              maks_qadam=30, recursion_limit=50):
        """Bitta sinov holati.
        kutilgan = {"maydon": qiymat} yoki tekshiruvchi funksiya."""
        gc, S = self.yaratuvchi()
        cfg = {"configurable": {"thread_id": nom},
               "recursion_limit": recursion_limit}
        t0 = time.perf_counter()
        xato, r = None, None
        try:
            r = gc.invoke(kirish, cfg)
            if javoblar:
                j = iter(javoblar)
                qadam = 0
                while r.get("__interrupt__") and qadam < maks_qadam:
                    javob = next(j, None)
                    if javob is None:
                        xato = "javoblar TUGADI, graf hali so'ramoqda"
                        break
                    r = gc.invoke(Command(resume=javob), cfg)
                    qadam += 1
        except Exception as e:
            xato = f"{type(e).__name__}: {str(e)[:60]}"

        # ── tekshirish ──
        ok, sabab = True, "—"
        if xato:
            ok, sabab = False, xato
        elif kutilgan is not None and r is not None:
            if callable(kutilgan):
                ok = bool(kutilgan(r))
                sabab = "—" if ok else "tekshiruvchi False qaytardi"
            else:
                for k, v in kutilgan.items():
                    haqiqiy = r.get(k)
                    if haqiqiy != v:
                        ok = False
                        sabab = f"{k}: kutilgan {v!r}, haqiqiy {haqiqiy!r}"
                        break

        self.natijalar.append({
            "holat": nom, "ok": ok, "sabab": sabab[:52],
            "ms": round((time.perf_counter() - t0) * 1000, 1),
            "xabar": len(r.get("messages", [])) if r else 0})
        return ok

    def hisobot(self):
        d = pd.DataFrame(self.natijalar)
        print(f"🧪 {self.nom}\n")
        d_ko = d.copy()
        d_ko["ok"] = d_ko.ok.map({True: "✅", False: "❌"})
        print(d_ko.to_string(index=False))

        otdi = d.ok.sum()
        print(f"\n{otdi}/{len(d)} test o'tdi")
        if otdi < len(d):
            print("\n❌ YIQILGAN TESTLAR:")
            for _, r in d[~d.ok].iterrows():
                print(f"    {r.holat}: {r.sabab}")
        else:
            print("🏆 HAMMASI O'TDI")
        return d


# ─── sinaladigan graf ───
def anketa_grafi():
    class S(TypedDict):
        messages: Annotated[Sequence[BaseMessage], add_messages]
        javoblar: Annotated[list, operator.add]
        qadam: int

    SAVOLLAR = ["Ismingiz?", "Yoshingiz?", "Telefon?"]

    def sora(s):
        q = s.get("qadam", 0)
        javob = interrupt(SAVOLLAR[q])
        return {"messages": [AIMessage(SAVOLLAR[q]),
                             HumanMessage(str(javob))],
                "javoblar": [str(javob)]}

    def tekshir(s):
        q, javob = s.get("qadam", 0), s["javoblar"][-1]
        ok = True
        if q == 1:
            ok = javob.isdigit() and 18 <= int(javob) <= 100
        elif q == 2:
            ok = javob.startswith("+998") and len(javob) == 13
        return {"qadam": q + 1 if ok else q}

    def yol(s) -> Literal["sora", "__end__"]:
        return "__end__" if s["qadam"] >= len(SAVOLLAR) else "sora"

    g = StateGraph(S)
    g.add_node("sora", sora); g.add_node("tekshir", tekshir)
    g.add_edge(START, "sora"); g.add_edge("sora", "tekshir")
    g.add_conditional_edges("tekshir", yol)
    return g.compile(checkpointer=InMemorySaver()), S


BOSH = {"messages": [], "javoblar": [], "qadam": 0}

t = GrafTest(anketa_grafi, "Anketa grafi")

t.holat("to'g'ri ma'lumot", BOSH,
        javoblar=["Oybek", "30", "+998901234567"],
        kutilgan={"qadam": 3})

t.holat("noto'g'ri yosh qayta so'raladi", BOSH,
        javoblar=["Oybek", "17", "30", "+998901234567"],
        kutilgan=lambda r: r["javoblar"] == ["Oybek", "17", "30",
                                             "+998901234567"])

t.holat("noto'g'ri telefon qayta so'raladi", BOSH,
        javoblar=["Oybek", "30", "998901234567", "+998901234567"],
        kutilgan={"qadam": 3})

t.holat("javoblar yetmasa — ushlanadi", BOSH,
        javoblar=["Oybek"],
        kutilgan={"qadam": 3})               # ⚠️ ATAYLAB yiqiladi

t.holat("chegaradagi yosh 18", BOSH,
        javoblar=["Oybek", "18", "+998901234567"],
        kutilgan={"qadam": 3})

t.holat("chegaradagi yosh 100", BOSH,
        javoblar=["Oybek", "100", "+998901234567"],
        kutilgan={"qadam": 3})

t.hisobot()
```

> ## 🏆 **NIMA UCHUN BU LOYIHA MUHIM?**
> ```
> ✅ API kalitisiz    →  CI'da ishlaydi
> ✅ input() siz      →  interrupt + tayyor javoblar
> ✅ Takrorlanuvchan  →  FakeListChatModel
> ⭐ HAR testda YANGI graf  →  testlar bir-biriga TA'SIR QILMAYDI
> ```
>
> ## 💥 **`graph_yaratuvchi` FUNKSIYA BO'LISHI SHART.** Bitta grafni qayta ishlatsangiz — `thread_id` va checkpointer holati **oldingi testdan qoladi**.
>
> ## ⭐ **"CHEGARADAGI QIYMATLAR" (18 va 100) — TESTNING ENG QIMMATLI QISMI.** Xatolar deyarli **doim chegarada** bo'ladi.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🔍 **Graf linteri** | `compile()` topmaydigan 6 xato | ## `get_origin(...) is Annotated` |
| 2 | 🎭 **Ishga tushiruvchi** | `input()` muammosi | ## ⭐ `interrupt` + `Command(resume=)` |
| 3 | 📊 **Profiler** | Sekinlik va 💰 narx | ## `llm=True` belgisi |
| 4 | 🧪 **Test to'plami** | CI'da avtomatik sinov | ## Har testda **yangi graf** |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
