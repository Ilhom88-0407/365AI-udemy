# 🚀 47-modul mini-loyihalari

> **3 ta tayyor loyiha.** ## ⭐⭐ **Hammasi API kalitisiz** — va **LLM umuman kerak emas**.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langgraph langgraph-checkpoint-sqlite langchain-core tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, json, sqlite3, operator, shutil, re
from pathlib import Path
from contextlib import contextmanager
from typing import Literal, Annotated
from typing_extensions import TypedDict
import tiktoken, pandas as pd

from langgraph.graph import START, END, StateGraph, MessagesState, add_messages
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.types import interrupt, Command
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage, RemoveMessage)
from langchain_core.language_models.fake_chat_models import FakeListChatModel

ENC = tiktoken.get_encoding("cl100k_base")
tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)
chat = FakeListChatModel(responses=["Javob matni."] * 200)
```

---

# 🏦 1-loyiha. Saqlanadigan ko'p tilli bank boti

> **Maqsad:** dastur qayta ishga tushsa ham **hamma narsani eslaydigan**, **ikki tilli**, **LLMsiz** bot.

```python
class BotState(MessagesState):
    til: str
    bolim: str
    burilish: Annotated[int, operator.add]
    xatolar: Annotated[list, operator.add]


BILIM = {
    "uz": {
        "salom": "Assalomu alaykum! Bank yordamchisiman. "
                 "Kredit, karta yoki depozit haqida so'rang.",
        "kredit": "Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha. "
                  "Pasport va daromad spravkasi kerak.",
        "karta": "Debet karta 3 ish kunida tayyorlanadi. "
                 "Yillik xizmat haqi 50 000 so'm.",
        "depozit": "Muddatli depozit yillik 18–22% foiz keltiradi. "
                   "Minimal summa 1 000 000 so'm.",
        "operator": "Sizni operatorga ulayapman. Iltimos, kuting.",
        "yoq": "Kechirasiz, tushunmadim. Kredit, karta yoki depozit?",
    },
    "ru": {
        "salom": "Здравствуйте! Я банковский помощник. "
                 "Спросите про кредит, карту или депозит.",
        "kredit": "Потребительский кредит от 24% годовых, до 24 месяцев. "
                  "Нужен паспорт и справка о доходах.",
        "karta": "Дебетовая карта готова за 3 рабочих дня. "
                 "Годовое обслуживание 50 000 сум.",
        "depozit": "Срочный депозит приносит 18–22% годовых. "
                   "Минимальная сумма 1 000 000 сум.",
        "operator": "Соединяю вас с оператором. Пожалуйста, подождите.",
        "yoq": "Извините, не понял. Кредит, карта или депозит?",
    },
}

KALITLAR = {
    "kredit": ["kredit", "qarz", "foiz", "stavka", "ipoteka",
               "кредит", "займ", "процент", "ставка", "ипотека"],
    "karta": ["karta", "plastik", "uzcard", "humo", "visa",
              "карта", "пластик", "виза"],
    "depozit": ["depozit", "omonat", "jamg'arma", "vklad",
                "депозит", "вклад", "сбережен"],
}
RU_BELGI = ["привет", "здравств", "кредит", "карта", "депозит", "что",
            "как", "сколько", "расскажите", "спасибо", "а "]
OPERATOR = ["operator", "odam", "оператор", "человек", "живой"]


def til_aniqla(s: BotState) -> BotState:
    """⭐ FAQAT BIR MARTA ishlaydi — keyin til o'zgarmaydi."""
    if s.get("til"):
        return {"burilish": 1}
    m = str(s["messages"][-1].content).lower() if s["messages"] else ""
    til = "ru" if any(x in m for x in RU_BELGI) else "uz"
    print(f"  🌐 til: {til}")
    return {"til": til, "burilish": 1}


def marshrutla(s: BotState) -> BotState:
    m = str(s["messages"][-1].content).lower()
    if any(k in m for k in OPERATOR):
        return {"bolim": "operator"}
    ballar = {b: sum(1 for k in ks if k in m) for b, ks in KALITLAR.items()}
    ballar = {b: n for b, n in ballar.items() if n}
    if not ballar:
        return {"bolim": "yoq",
                "xatolar": [f"tushunilmadi: {m[:36]}"]}
    eng = max(ballar, key=ballar.get)
    # ⚠️ tenglik → noaniq
    if list(ballar.values()).count(ballar[eng]) > 1:
        return {"bolim": "yoq", "xatolar": [f"noaniq: {m[:36]}"]}
    return {"bolim": eng}


def javob_ber(s: BotState) -> BotState:
    til = s.get("til", "uz")
    bolim = s.get("bolim", "yoq")
    # birinchi burilishda salomlashamiz
    matn = BILIM[til][bolim]
    if s.get("burilish", 0) <= 1 and bolim == "yoq":
        matn = BILIM[til]["salom"]
    return {"messages": [AIMessage(matn)]}


def yol(s: BotState) -> Literal["operator_kutish", "__end__"]:
    # ⭐ 3 marta tushunmasa — operatorga
    tushunmadi = sum(1 for x in s.get("xatolar", [])
                     if x.startswith(("tushunilmadi", "noaniq")))
    if s.get("bolim") == "operator" or tushunmadi >= 3:
        return "operator_kutish"
    return "__end__"


def operator_kutish(s: BotState) -> BotState:
    til = s.get("til", "uz")
    print(f"  📞 OPERATORGA uzatildi (thread bo'yicha)")
    return {"messages": [AIMessage(BILIM[til]["operator"])]}


def qur(checkpointer):
    g = StateGraph(BotState)
    g.add_node("til", til_aniqla)
    g.add_node("marshrut", marshrutla)
    g.add_node("javob", javob_ber)
    g.add_node("operator_kutish", operator_kutish)
    g.add_edge(START, "til")
    g.add_edge("til", "marshrut")
    g.add_edge("marshrut", "javob")
    g.add_conditional_edges("javob", yol)
    g.add_edge("operator_kutish", END)
    return g.compile(checkpointer=checkpointer)


# ═══ SQLite bilan ishga tushiramiz ═══

@contextmanager
def baza(yol="./data/bot.db"):
    p = Path(yol)
    p.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(str(p), check_same_thread=False)
    try:
        con.execute("PRAGMA journal_mode=WAL")       # ⭐ parallel o'qish
        con.execute("PRAGMA synchronous=NORMAL")     # ⭐ tezroq
        con.execute("PRAGMA busy_timeout=5000")      # ⭐ "locked" o'rniga kutadi
        yield con
    finally:
        con.close()


class Bot:
    """⭐ Telegram/veb uchun tayyor interfeys."""

    def __init__(self, gc):
        self.gc = gc
        self.jurnal = []

    @staticmethod
    def _thread_id(kanal, uid):
        fid = re.sub(r"[^a-zA-Z0-9_-]", "", str(uid))[:64] or "anon"
        return f"{kanal}-{fid}"                       # ⭐ SERVERDA yasaladi

    def javob(self, kanal, uid, matn):
        cfg = {"configurable": {"thread_id": self._thread_id(kanal, uid)},
               "recursion_limit": 20}
        t0 = time.perf_counter()
        r = self.gc.invoke({"messages": [HumanMessage(matn)]}, cfg)
        snap = self.gc.get_state(cfg)
        self.jurnal.append({
            "thread": cfg["configurable"]["thread_id"],
            "savol": matn[:28],
            "til": snap.values.get("til"),
            "bolim": snap.values.get("bolim"),
            "burilish": snap.values.get("burilish"),
            "xabar": len(snap.values.get("messages", [])),
            "ms": round((time.perf_counter() - t0) * 1000)})
        return r["messages"][-1].content

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))

        print("\n── bo'lim bo'yicha ──")
        print(d.bolim.value_counts().to_string())
        print("\n── til bo'yicha ──")
        print(d.til.value_counts().to_string())

        tushunmadi = (d.bolim == "yoq").mean()
        print(f"\ntushunilmadi: {tushunmadi:.0%}")
        if tushunmadi > 0.25:
            print("  ⚠️ KALIT SO'ZLARNI kengaytiring yoki LLM qo'shing")
        op = (d.bolim == "operator").mean()
        if op > 0.15:
            print(f"  ⚠️ {op:.0%} operatorga uzatildi — bilim bazasi to'liqmi?")
        print(f"\n⚡ o'rtacha javob: {d.ms.mean():.1f} ms  "
              f"(LLM bo'lganda ~1000 ms bo'lardi)")
        print(f"💰 LLM chaqiruvi: 0 → 🇺🇿 yillik tejash: "
              f"~${len(d) * 0.0002 * 365 * 1000:,.0f}")
        return d


shutil.rmtree("data", ignore_errors=True)

with baza() as con:
    bot = Bot(qur(SqliteSaver(con)))

    print("═══ 1-SESSIYA ═══")
    print("Oybek :", bot.javob("tg", 12345, "Salom"))
    print("Oybek :", bot.javob("tg", 12345, "Kredit foizi qancha?"))
    print("Oybek :", bot.javob("tg", 12345, "Karta-chi?"))
    print("Ivan  :", bot.javob("tg", 55555, "Расскажите про кредит"))
    print("Ivan  :", bot.javob("tg", 55555, "А депозит?"))
    print("Anon  :", bot.javob("web", "sess-1", "asdfgh"))
    print("Anon  :", bot.javob("web", "sess-1", "qwerty"))
    print("Anon  :", bot.javob("web", "sess-1", "zzzz"))

# ═══ DASTUR QAYTA ISHGA TUSHDI ═══
print("\n\n═══ 2-SESSIYA (dastur qayta ishga tushdi) ═══")
with baza() as con:
    bot2 = Bot(qur(SqliteSaver(con)))
    print("Oybek :", bot2.javob("tg", 12345, "Depozit-chi?"))
    print("Ivan  :", bot2.javob("tg", 55555, "А карта?"))

    for uid in (12345, 55555):
        snap = bot2.gc.get_state(
            {"configurable": {"thread_id": f"tg-{uid}"}})
        print(f"  tg-{uid}: til={snap.values.get('til')} · "
              f"burilish={snap.values.get('burilish')} · "
              f"{len(snap.values['messages'])} xabar  ✅ ESLANDI")
    print()
    bot2.hisobot()
```

> ## 🏆🏆 **BU BOT — TO'LIQ ISHLAYDIGAN MAHSULOT:**
> ```
> ✅ Ikki til — BIR MARTA aniqlanadi, DISKDA saqlanadi
> ✅ Dastur qayta ishga tushsa — hammasi ESLANADI
> ✅ 3 marta tushunmasa — OPERATORGA uzatadi
> ⭐ thread_id SERVERDA yasaladi va TOZALANADI
> ⭐ Uch PRAGMA: WAL · NORMAL · busy_timeout
> 💰 LLM UMUMAN YO'Q — javob ~1 ms, narx $0
> ```
>
> ## 💡 **VA BU — REALISTIK.** Bank savollarining **70–80%** — takrorlanuvchan va **aniq javobli**. LLM faqat **qolgan qismi** uchun kerak.

---

# 🎛️ 2-loyiha. Operator paneli

> **Maqsad:** operator suhbatlarni **ko'rsin**, **aralashsin** va **orqaga qaytarsin**.

```python
class OperatorPanel:
    """StateSnapshot asosida to'liq operator vositasi."""

    def __init__(self, gc, til="uz"):
        self.gc = gc
        self.koef = 1.88 if til == "uz" else 1.0

    def _cfg(self, tid):
        return {"configurable": {"thread_id": str(tid)}}

    # ══════ KO'RISH ══════

    def royxat(self, threadlar):
        """Barcha suhbatlarning qisqa ko'rinishi."""
        q = []
        for t in threadlar:
            try:
                snap = self.gc.get_state(self._cfg(t))
            except Exception:
                continue
            xs = snap.values.get("messages", [])
            tarix = list(self.gc.get_state_history(self._cfg(t)))
            operator_aralashgan = any(
                s.metadata.get("source") == "update" for s in tarix)
            q.append({
                "thread": t,
                "xabar": len(xs),
                "token": tok(xs),
                "checkpoint": len(tarix),
                "holat": "✅ tugadi" if not snap.next else f"⏳ {snap.next[0]}",
                "til": snap.values.get("til", "?"),
                "operator": "👤" if operator_aralashgan else "",
                "oxirgi": str(xs[-1].content)[:30] if xs else "—"})
        if not q:
            print("suhbat topilmadi")
            return pd.DataFrame()
        d = pd.DataFrame(q).sort_values("xabar", ascending=False)
        print(d.to_string(index=False))

        tugamagan = d[d.holat.str.startswith("⏳")]
        if len(tugamagan):
            print(f"\n⏳ {len(tugamagan)} suhbat TUGAMAGAN: "
                  f"{list(tugamagan.thread)}")
        katta = d[d.token > 2000]
        if len(katta):
            print(f"⚠️ {len(katta)} suhbatda kontekst 2000+ token "
                  f"→ 46-modul kerak")
        return d

    def suhbat(self, tid, oxirgi=10):
        """Bitta suhbatning to'liq matni."""
        snap = self.gc.get_state(self._cfg(tid))
        xs = snap.values.get("messages", [])
        print(f"📋 {tid} · {len(xs)} xabar · "
              f"{'✅ tugadi' if not snap.next else '⏳ ' + str(snap.next)}")
        if snap.values.get("summary"):
            print(f"📝 xulosa: {snap.values['summary'][:90]}")
        print()
        for m in xs[-oxirgi:]:
            belgi = {"human": "👤", "ai": "🤖", "system": "⚙️"}.get(m.type, "•")
            print(f"  {belgi} {str(m.content)[:88]}")
        return xs

    def qadamlar(self, tid):
        """Grafning har qadami — nosozlikni tuzatish uchun."""
        tarix = list(self.gc.get_state_history(self._cfg(tid)))[::-1]
        q = []
        for s in tarix:
            w = s.metadata.get("writes") or {}
            q.append({"step": s.metadata.get("step"),
                      "source": s.metadata.get("source"),
                      "tugun": ",".join(w)[:20] or "—",
                      "next": ",".join(s.next)[:18] or "(tugadi)",
                      "xabar": len(s.values.get("messages", []))})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        return d

    # ══════ ARALASHUV ══════

    def javob_yuborish(self, tid, matn):
        """👤 Operator o'z javobini qo'shadi."""
        self.gc.update_state(self._cfg(tid),
                             {"messages": [AIMessage(f"[OPERATOR] {matn}")]})
        print(f"👤 '{tid}' ga operator javobi qo'shildi")
        return self.gc.get_state(self._cfg(tid))

    def tuzat(self, tid, xabar_id, yangi_matn):
        """⭐ Mavjud xabarni ALMASHTIRADI (bir xil id → almashtiriladi)."""
        self.gc.update_state(
            self._cfg(tid),
            {"messages": [AIMessage(yangi_matn, id=xabar_id)]})
        print(f"✏️ '{tid}' · xabar {xabar_id[:8]}... tuzatildi")

    def maydon(self, tid, **maydonlar):
        """State maydonini o'zgartirish (til, bo'lim va h.k.)."""
        self.gc.update_state(self._cfg(tid), maydonlar)
        print(f"🔧 '{tid}' · {maydonlar}")

    # ══════ ORQAGA QAYTISH ══════

    def orqaga(self, tid, qadam):
        """⭐ Ma'lum qadamga qaytadi va O'SHA nuqtadan davom ettirish config'ini beradi."""
        tarix = list(self.gc.get_state_history(self._cfg(tid)))
        mos = [s for s in tarix if s.metadata.get("step") == qadam]
        if not mos:
            print(f"💥 step {qadam} topilmadi. "
                  f"Mavjud: {sorted({s.metadata.get('step') for s in tarix})}")
            return None
        s = mos[0]
        print(f"⏪ step {qadam} · {len(s.values.get('messages', []))} xabar")
        print(f"   endi shu config bilan invoke() qiling")
        return s.config

    def bekor_qil(self, tid):
        """⭐ Oxirgi burilishni BEKOR qiladi."""
        tarix = list(self.gc.get_state_history(self._cfg(tid)))
        kirishlar = [s for s in tarix if s.metadata.get("source") == "input"]
        if len(kirishlar) < 2:
            print("💥 bekor qilish uchun oldingi burilish yo'q")
            return None
        oldingi = kirishlar[1]                   # bittadan oldingisi
        print(f"↩️ oxirgi burilish bekor qilindi → step "
              f"{oldingi.metadata.get('step')}")
        return oldingi.config

    # ══════ STATISTIKA ══════

    def statistika(self, threadlar, kunlik_suhbat=1000):
        d = self.royxat(threadlar)
        if d.empty:
            return
        print(f"\n📊 {len(d)} suhbat · {d.xabar.sum()} xabar · "
              f"{d.checkpoint.sum()} checkpoint")
        print(f"   o'rtacha kontekst: {d.token.mean():.0f} token")
        print(f"   🇺🇿 yillik ≈ ${d.token.mean()*20/1e6*0.15*kunlik_suhbat*365*self.koef:,.0f}")
        op = (d.operator == "👤").sum()
        if op:
            print(f"   👤 {op} suhbatga operator aralashgan "
                  f"({op/len(d):.0%})")
            if op / len(d) > 0.2:
                print("      ⚠️ ko'p aralashuv — bot javoblari yaxshilanishi kerak")
        return d


# ─── ishlatish ───
class S(MessagesState):
    summary: str
    til: str

def javob(s: S) -> S:
    return {"messages": [chat.invoke(s["messages"])], "til": "uz"}

g = StateGraph(S)
g.add_node("javob", javob)
g.add_edge(START, "javob"); g.add_edge("javob", END)
gc = g.compile(checkpointer=InMemorySaver())

THREADLAR = ["tg-12345", "tg-55555", "web-abc"]
for t, n in zip(THREADLAR, [5, 2, 3]):
    for i in range(n):
        gc.invoke({"messages": [HumanMessage(f"savol {i}")]},
                  {"configurable": {"thread_id": t}})

panel = OperatorPanel(gc, til="uz")

print("═══ SUHBATLAR RO'YXATI ═══")
panel.royxat(THREADLAR)

print("\n═══ BITTA SUHBAT ═══")
panel.suhbat("tg-12345", oxirgi=4)

print("\n═══ QADAMLAR ═══")
panel.qadamlar("web-abc")

print("\n═══ OPERATOR ARALASHUVI ═══")
panel.javob_yuborish("tg-55555", "Kechirasiz, aniqlashtirib beraman.")
panel.maydon("tg-55555", til="ru")

print("\n═══ ORQAGA QAYTISH ═══")
cfg_eski = panel.orqaga("tg-12345", qadam=2)
if cfg_eski:
    r = gc.invoke({"messages": [HumanMessage("BOSHQA yo'l")]}, cfg_eski)
    print(f"   ✅ boshqa yo'ldan davom etdik: {len(r['messages'])} xabar")

print("\n═══ STATISTIKA ═══")
panel.statistika(THREADLAR)
```

> ## 🏆 **YETTI IMKONIYAT — HAMMASI `StateSnapshot` DAN:**
> ```
> 📋 royxat()          →  barcha suhbatlar bir ko'rinishda
> 💬 suhbat()          →  bitta suhbat matni
> 🔍 qadamlar()        →  graf qanday ishlagani (nosozlik tuzatish)
> 👤 javob_yuborish()  →  operator javobi
> ✏️ tuzat()           →  ⭐ xabarni ALMASHTIRISH (bir xil id)
> ⏪ orqaga()          →  ⭐ ma'lum qadamga qaytish
> ↩️ bekor_qil()       →  ⭐ oxirgi burilishni bekor qilish
> ```
>
> ## 💥 **QO'SHIMCHA MA'LUMOTLAR BAZASI KERAK EMAS** — checkpointer'da **hammasi bor**.

---

# 🛠️ 3-loyiha. Ishlab chiqarish uchun baza boshqaruvchisi

> **Maqsad:** SQLite bazani **xavfsiz ishlatish, tahlil qilish, tozalash va zaxiralash**.

```python
class BazaBoshqaruv:
    """SQLite checkpointer: ulanish · tahlil · tozalash · zaxira · migratsiya."""

    def __init__(self, db_yol=None, til="uz"):
        self.yol = Path(db_yol or os.getenv("LANGGRAPH_DB",
                                            "./data/langgraph.db"))
        self.yol.parent.mkdir(parents=True, exist_ok=True)
        self.koef = 1.88 if til == "uz" else 1.0

    # ══════ ULANISH ══════

    @contextmanager
    def ulanish(self, readonly=False):
        """⭐ Uch PRAGMA bilan to'g'ri ulanish."""
        con = sqlite3.connect(str(self.yol), check_same_thread=False)
        try:
            con.execute("PRAGMA journal_mode=WAL")
            con.execute("PRAGMA synchronous=NORMAL")
            con.execute("PRAGMA busy_timeout=5000")
            if readonly:
                con.execute("PRAGMA query_only=ON")
            yield con
        finally:
            con.close()

    @contextmanager
    def checkpointer(self):
        with self.ulanish() as con:
            yield SqliteSaver(con)

    # ══════ TAHLIL ══════

    def hisobot(self, kunlik_suhbat=1000):
        if not self.yol.exists():
            print(f"📁 baza yo'q: {self.yol}")
            return None
        hajm = self.yol.stat().st_size
        print(f"📁 {self.yol}")
        print(f"   hajm: {hajm/1024:.1f} KB")

        # WAL fayllari ham hisobga olinsin
        for qoshimcha in ["-wal", "-shm"]:
            p = Path(str(self.yol) + qoshimcha)
            if p.exists():
                print(f"   {p.name}: {p.stat().st_size/1024:.1f} KB")

        with self.ulanish(readonly=True) as con:
            jadvallar = [r[0] for r in con.execute(
                "SELECT name FROM sqlite_master WHERE type='table'")]
            print(f"   jadvallar: {jadvallar}")

            q = [{"thread": t, "checkpoint": n} for t, n in con.execute(
                "SELECT thread_id, COUNT(*) FROM checkpoints "
                "GROUP BY thread_id ORDER BY COUNT(*) DESC")]
            if not q:
                print("   ⚪ thread yo'q")
                return None
            d = pd.DataFrame(q)
            writes = con.execute("SELECT COUNT(*) FROM writes").fetchone()[0]

        print(f"\n📊 {len(d)} thread · {d.checkpoint.sum()} checkpoint · "
              f"{writes} write")
        print(d.head(10).to_string(index=False))

        ort_kb = hajm / 1024 / max(1, d.checkpoint.sum())
        print(f"\n   o'rtacha {ort_kb:.2f} KB / checkpoint")
        print(f"   o'rtacha {d.checkpoint.mean():.1f} checkpoint / thread")
        for n in (1_000, 10_000, 100_000):
            gb = ort_kb * d.checkpoint.mean() * n / 1024 / 1024
            belgi = "💥" if gb > 10 else ("⚠️" if gb > 1 else "  ")
            print(f"   {belgi} {n:>7,} foydalanuvchi ≈ {gb:.2f} GB")

        # ── ogohlantirishlar ──
        print()
        katta = d[d.checkpoint > 100]
        if len(katta):
            print(f"  ⚠️ {len(katta)} threadda 100+ checkpoint: "
                  f"{list(katta.thread)[:3]}")
            print("     → 46-moduldagi xulosalash state'ni kichraytiradi")
        if hajm > 100 * 1024**2:
            print(f"  💥 baza {hajm/1024**2:.0f} MB — "
                  f"tozalash yoki PostgreSQL vaqti keldi")
        if len(d) > 10_000:
            print(f"  💥 {len(d)} thread — PostgreSQL tavsiya etiladi "
                  f"(SQLite ko'p yozuvchini yomon ko'taradi)")
        return d

    # ══════ TOZALASH ══════

    def tozala(self, saqlanadigan=None, maks_checkpoint=None, quruq=False):
        """saqlanadigan: shu threadlar QOLADI.
        maks_checkpoint: shundan ko'p checkpointli threadlar QIRQILADI.
        quruq=True: faqat KO'RSATADI, o'chirmaydi."""
        if not self.yol.exists():
            print("baza yo'q")
            return 0
        oldin = self.yol.stat().st_size

        with self.ulanish() as con:
            hisob = {t: n for t, n in con.execute(
                "SELECT thread_id, COUNT(*) FROM checkpoints "
                "GROUP BY thread_id")}
            ochiriladi = set()
            if saqlanadigan is not None:
                ochiriladi |= set(hisob) - set(saqlanadigan)
            if maks_checkpoint:
                ochiriladi |= {t for t, n in hisob.items()
                               if n > maks_checkpoint}

            if not ochiriladi:
                print("✅ o'chiriladigan thread yo'q")
                return 0

            n_cp = sum(hisob[t] for t in ochiriladi)
            print(f"{'🔍 QURUQ ISH: ' if quruq else ''}"
                  f"{len(ochiriladi)} thread · {n_cp} checkpoint "
                  f"o'chiriladi")
            print(f"   {sorted(ochiriladi)[:5]}")
            if quruq:
                return len(ochiriladi)

            for t in ochiriladi:
                con.execute("DELETE FROM checkpoints WHERE thread_id=?", (t,))
                con.execute("DELETE FROM writes WHERE thread_id=?", (t,))
            con.commit()
            con.execute("VACUUM")               # ⭐ SHART

        keyin = self.yol.stat().st_size
        print(f"✅ {oldin/1024:.1f} → {keyin/1024:.1f} KB "
              f"({(1-keyin/max(1,oldin))*100:.0f}% tejaldi)")
        return len(ochiriladi)

    # ══════ ZAXIRA ══════

    def zaxira(self, papka="./backups", saqlanadigan_soni=5):
        """⭐ SQLite'ning O'Z backup API si — ishlab turgan bazani ham nusxalaydi."""
        p = Path(papka)
        p.mkdir(parents=True, exist_ok=True)
        nom = p / f"{self.yol.stem}-{int(time.time())}.db"

        with self.ulanish(readonly=True) as manba:
            maqsad = sqlite3.connect(str(nom))
            try:
                manba.backup(maqsad)            # ⭐ atomik, xavfsiz
            finally:
                maqsad.close()
        print(f"💾 {nom.name} · {nom.stat().st_size/1024:.1f} KB")

        # ── eski zaxiralarni o'chirish ──
        zaxiralar = sorted(p.glob(f"{self.yol.stem}-*.db"))
        eskilari = zaxiralar[:-saqlanadigan_soni]
        for z in eskilari:
            z.unlink()
        if eskilari:
            print(f"   🗑️ {len(eskilari)} eski zaxira o'chirildi "
                  f"({saqlanadigan_soni} ta saqlanadi)")
        return nom

    def tikla(self, zaxira_yol):
        z = Path(zaxira_yol)
        if not z.exists():
            print(f"💥 zaxira topilmadi: {z}")
            return False
        # ⚠️ avval joriysini zaxiralaymiz
        if self.yol.exists():
            self.zaxira()
        shutil.copy2(z, self.yol)
        # WAL fayllarini tozalaymiz
        for q in ["-wal", "-shm"]:
            p = Path(str(self.yol) + q)
            if p.exists():
                p.unlink()
        print(f"♻️ {z.name} → {self.yol.name}")
        return True

    # ══════ EKSPORT ══════

    def eksport(self, thread_id, yol=None):
        """🇺🇿 Bitta suhbatni JSON'ga chiqaradi (audit / shikoyat uchun)."""
        with self.checkpointer() as cp:
            # graf kerak emas — checkpointer o'zi yetadi
            cfg = {"configurable": {"thread_id": str(thread_id)}}
            cps = list(cp.list(cfg))
        if not cps:
            print(f"💥 '{thread_id}' topilmadi")
            return None

        q = []
        for c in cps[::-1]:
            v = c.checkpoint.get("channel_values", {})
            xs = v.get("messages", [])
            q.append({
                "step": c.metadata.get("step"),
                "source": c.metadata.get("source"),
                "xabarlar": [{"tur": m.type, "matn": str(m.content)}
                             for m in xs],
                "summary": v.get("summary", ""),
                "til": v.get("til", "")})

        yol = Path(yol or f"./eksport/{thread_id}.json")
        yol.parent.mkdir(parents=True, exist_ok=True)
        yol.write_text(json.dumps({"thread": str(thread_id), "qadamlar": q},
                                  ensure_ascii=False, indent=1),   # ⭐ 🇺🇿
                       encoding="utf-8")
        print(f"📤 {yol} · {len(q)} qadam")
        return yol


# ─── ishlatish ───
shutil.rmtree("data", ignore_errors=True)
shutil.rmtree("backups", ignore_errors=True)
shutil.rmtree("eksport", ignore_errors=True)

bb = BazaBoshqaruv("./data/prod.db", til="uz")

class S2(MessagesState):
    til: str

g2 = StateGraph(S2)
g2.add_node("bot", lambda s: {"messages": [chat.invoke(s["messages"])],
                              "til": "uz"})
g2.add_edge(START, "bot"); g2.add_edge("bot", END)

with bb.checkpointer() as cp:
    gc2 = g2.compile(checkpointer=cp)
    for u in range(6):
        for i in range(u * 2 + 1):
            gc2.invoke({"messages": [HumanMessage(f"savol {i}")]},
                       {"configurable": {"thread_id": f"tg-{u}"}})

print("═══ HISOBOT ═══")
bb.hisobot()

print("\n═══ ZAXIRA ═══")
bb.zaxira()

print("\n═══ QURUQ TOZALASH ═══")
bb.tozala(maks_checkpoint=8, quruq=True)

print("\n═══ HAQIQIY TOZALASH ═══")
bb.tozala(maks_checkpoint=8)

print("\n═══ EKSPORT ═══")
bb.eksport("tg-0")

print("\n═══ YAKUNIY HOLAT ═══")
bb.hisobot()
```

> ## 🏆 **OLTI IMKONIYAT:**
> ```
> ⭐ ulanish()   →  3 PRAGMA (WAL · NORMAL · busy_timeout) + readonly rejim
> 📊 hisobot()   →  1k/10k/100k foydalanuvchi uchun HAJM BASHORATI
> 🗑️ tozala()    →  ⭐ quruq=True bilan OLDIN ko'rish, keyin o'chirish
> 💾 zaxira()    →  ⭐ con.backup() + eski nusxalarni avtomatik tozalash
> ♻️ tikla()     →  ⚠️ avval joriysini zaxiralaydi
> 📤 eksport()   →  🇺🇿 JSON, ensure_ascii=False
> ```
>
> ## 💥 **`quruq=True` — ISHLAB CHIQARISHDA HAYOT SAQLAYDI.** Avval **nima o'chishini ko'rasiz**, keyin tasdiqlaysiz.
>
> ## ⚠️ **WAL REJIMIDA `-wal` VA `-shm` FAYLLARI HAM BOR.** Zaxira olganda ularni **unutmang** — `con.backup()` buni **o'zi hal qiladi**.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🏦 **Saqlanadigan bot** | Dastur qayta ishga tushsa — **eslaydi** | ## ⭐ **LLMsiz** · 2 til · operator |
| 2 | 🎛️ **Operator paneli** | Ko'rish · aralashish · **orqaga qaytish** | ## `StateSnapshot` + `update_state` |
| 3 | 🛠️ **Baza boshqaruvchisi** | Hajm · tozalash · **zaxira** | ## `con.backup()` · `VACUUM` · `quruq=True` |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
