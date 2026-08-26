# 📝 47-modul mashqlari

> **24 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ.**

## ⚙️ Tayyorgarlik

```bash
pip install langgraph langgraph-checkpoint-sqlite langchain-core tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, sqlite3, operator, shutil
from pathlib import Path
from typing import Literal, Annotated
from typing_extensions import TypedDict
import tiktoken, pandas as pd

from langgraph.graph import START, END, StateGraph, MessagesState, add_messages
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage, RemoveMessage)
from langchain_core.language_models.fake_chat_models import FakeListChatModel

ENC = tiktoken.get_encoding("cl100k_base")
tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

chat = FakeListChatModel(responses=[
    "Iste'mol krediti yillik 24% dan boshlanadi.",
    "Debet karta 3 ish kunida tayyorlanadi.",
    "Muddatli depozit 18–22% foiz keltiradi."] * 60)


class S(MessagesState):
    summary: str


def bot(s: S) -> S:
    return {"messages": [chat.invoke(s["messages"])]}


def graf():
    g = StateGraph(S)
    g.add_node("bot", bot)
    g.add_edge(START, "bot"); g.add_edge("bot", END)
    return g
```

---

# 🟢 OSON *(1–8)*

**M1.** Checkpointer nima qiladi?

**M2.** `thread_id` nima?

**M3.** `InMemorySaver` qayerda saqlaydi?

**M4.** Configsiz chaqirsangiz nima bo'ladi?

**M5.** `get_state_history` nima qaytaradi?

**M6.** `next=()` nima degani?

**M7.** `SqliteSaver` qanday jadval yaratadi?

**M8.** `check_same_thread=False` nima qiladi?

<details>
<summary>✅ Javoblar M1–M8</summary>

**M1.** ## Har tugun bajarilgandan keyin **holatni saqlaydi**.

**M2.** ## **Suhbat identifikatori** — bog'liq checkpointlar to'plami.

**M3.** ## **RAM** — dastur yopilsa **yo'qoladi**.

**M4.** ## 💥 `ValueError: Checkpointer requires ... thread_id`.

**M5.** ## **Generator** — `StateSnapshot` obyektlari.

**M6.** ## Graf **tugagan**.

**M7.** ## `checkpoints` va `writes`.

**M8.** ## Boshqa threadlardan murojaatga ruxsat *(⚠️ xavfsizlik kafolatini olib tashlaydi)*.

</details>

---

# 🟡 O'RTA *(9–18)*

**M9.** ⭐ Checkpointersiz va checkpointerli.

<details>
<summary>✅ Yechim</summary>

```python
SAV = iter(["Men Oybek.", "Ismim nima?", "Yana ayting."] * 4)

def bot2(s: S) -> S:
    q = next(SAV, "savol")
    return {"messages": [HumanMessage(q), chat.invoke(s["messages"])]}

g = StateGraph(S)
g.add_node("bot", bot2)
g.add_edge(START, "bot"); g.add_edge("bot", END)

gc1 = g.compile()
for i in range(3):
    print(f"  checkpointersiz {i+1}: "
          f"{len(gc1.invoke(S(messages=[]))['messages'])} xabar")

gc2 = g.compile(checkpointer=InMemorySaver())
cfg = {"configurable": {"thread_id": "1"}}
for i in range(3):
    print(f"  checkpointerli   {i+1}: "
          f"{len(gc2.invoke(S(messages=[]), cfg)['messages'])} xabar")
```

```
  checkpointersiz 1: 2 xabar
  checkpointersiz 2: 2 xabar     ← 💥 har safar noldan
  checkpointersiz 3: 2 xabar
  checkpointerli   1: 2 xabar
  checkpointerli   2: 4 xabar    ← ✅ to'planmoqda
  checkpointerli   3: 6 xabar
```

</details>

**M10.** ⭐ Ikki threadni sinang.

<details>
<summary>✅ Yechim</summary>

```python
gc = graf().compile(checkpointer=InMemorySaver())
c1 = {"configurable": {"thread_id": "oybek"}}
c2 = {"configurable": {"thread_id": "dilnoza"}}

for i in range(3):
    gc.invoke({"messages": [HumanMessage(f"savol {i}")]}, c1)
gc.invoke({"messages": [HumanMessage("savol")]}, c2)

print("oybek  :", len(gc.get_state(c1).values["messages"]), "xabar")
print("dilnoza:", len(gc.get_state(c2).values["messages"]), "xabar")
print("✅ MUSTAQIL")
```

</details>

**M11.** ⭐ Configsiz chaqiring.

<details>
<summary>✅ Yechim</summary>

```python
try:
    gc.invoke({"messages": [HumanMessage("savol")]})
except Exception as e:
    print("💥", type(e).__name__)
    print("  ", str(e)[:130])
```

</details>

**M12.** ⭐ `StateSnapshot` maydonlarini ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
snap = gc.get_state(c1)
print("turi     :", type(snap).__name__)
print("maydonlar:", snap._fields)
print("next     :", snap.next)
print("step     :", snap.metadata.get("step"))
print("values   :", list(snap.values))
print("\nmetadata:")
for k, v in snap.metadata.items():
    print(f"  {k:12s} {str(v)[:60]}")
```

```
maydonlar: ('values', 'next', 'config', 'metadata', 'created_at',
            'parent_config', 'tasks', 'interrupts')
```

</details>

**M13.** ⭐⭐ Tarixni boshidan o'qing.

<details>
<summary>✅ Yechim</summary>

```python
tarix = list(gc.get_state_history(c1))
print("checkpointlar:", len(tarix))
for s in tarix[::-1]:                          # ⭐ TESKARI
    w = s.metadata.get("writes") or {}
    print(f"  step {s.metadata['step']:>3} · {s.metadata.get('source'):7s} · "
          f"next={str(s.next):18s} · tugun={','.join(w)[:16]:16s} · "
          f"{len(s.values.get('messages', []))} xabar")
```

## 🔑 **`[::-1]` SIZ — TESKARI O'QIYSIZ.**

</details>

**M14.** ⭐ `update_state` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
cfg = {"configurable": {"thread_id": "tuzatish"}}
gc.invoke({"messages": [HumanMessage("Kredit?")]}, cfg)
print("oldin:", len(gc.get_state(cfg).values["messages"]))

gc.update_state(cfg, {"messages": [AIMessage("[OPERATOR] Tuzatilgan javob")]})
snap = gc.get_state(cfg)
print("keyin :", len(snap.values["messages"]))
print("oxirgi:", snap.values["messages"][-1].content)
print("source:", snap.metadata.get("source"))     # ⭐ "update"
```

## 🏆 **`source == "update"` — OPERATOR ARALASHUVI BELGISI.**

</details>

**M15.** ⭐⭐ Vaqt bo'yicha orqaga qayting.

<details>
<summary>✅ Yechim</summary>

```python
cfg = {"configurable": {"thread_id": "orqaga"}}
for i in range(3):
    gc.invoke({"messages": [HumanMessage(f"savol {i}")]}, cfg)
print("hozir:", len(gc.get_state(cfg).values["messages"]), "xabar")

tarix = list(gc.get_state_history(cfg))
eski = [s for s in tarix if len(s.values.get("messages", [])) == 2]
if eski:
    e = eski[0]
    print(f"orqaga: step {e.metadata['step']} · "
          f"{len(e.values['messages'])} xabar")
    r = gc.invoke({"messages": [HumanMessage("BOSHQA savol")]}, e.config)
    print("davom :", len(r["messages"]), "xabar ✅")
```

## 🏆 **"BEKOR QILISH" VA A/B SINOVINING ASOSI.**

</details>

**M16.** ⭐⭐ SQLite saqlanishini sinang.

<details>
<summary>✅ Yechim</summary>

```python
DB = "sinov.db"
if os.path.exists(DB):
    os.remove(DB)
cfg = {"configurable": {"thread_id": "1"}}

con = sqlite3.connect(DB, check_same_thread=False)
gc = graf().compile(checkpointer=SqliteSaver(con))
for i in range(3):
    gc.invoke({"messages": [HumanMessage(f"savol {i}")]}, cfg)
print("yozildi:", len(gc.get_state(cfg).values["messages"]), "xabar")
con.close()

# ⭐ YANGI ulanish
con2 = sqlite3.connect(DB, check_same_thread=False)
gc2 = graf().compile(checkpointer=SqliteSaver(con2))
print("tiklandi:", len(gc2.get_state(cfg).values["messages"]), "xabar ✅")

print("jadvallar:", [r[0] for r in con2.execute(
    "SELECT name FROM sqlite_master WHERE type='table'")])
print("checkpointlar:", con2.execute(
    "SELECT COUNT(*) FROM checkpoints").fetchone()[0])
print("fayl:", round(os.path.getsize(DB) / 1024, 1), "KB")
con2.close()
```

</details>

**M17.** ⭐ Bazani to'g'ridan-to'g'ri o'qing.

<details>
<summary>✅ Yechim</summary>

```python
con = sqlite3.connect(DB, check_same_thread=False)
print("── checkpoints ustunlari ──")
for r in con.execute("PRAGMA table_info(checkpoints)"):
    print(f"  {r[1]:20s} {r[2]}")

print("\n── threadlar ──")
for t, n in con.execute(
        "SELECT thread_id, COUNT(*) FROM checkpoints GROUP BY thread_id"):
    print(f"  {t:16s} {n} checkpoint")
con.close()
```

</details>

**M18.** ⭐⭐ Tozalash va `VACUUM`.

<details>
<summary>✅ Yechim</summary>

```python
def tozala(db_yol, saqlanadigan):
    oldin = os.path.getsize(db_yol)
    con = sqlite3.connect(db_yol, check_same_thread=False)
    hammasi = {r[0] for r in con.execute(
        "SELECT DISTINCT thread_id FROM checkpoints")}
    ochiriladi = hammasi - set(saqlanadigan)
    for t in ochiriladi:
        con.execute("DELETE FROM checkpoints WHERE thread_id = ?", (t,))
        con.execute("DELETE FROM writes WHERE thread_id = ?", (t,))
    con.commit()
    con.execute("VACUUM")                       # ⭐ SHART
    keyin = os.path.getsize(db_yol)
    con.close()
    print(f"✅ {len(ochiriladi)} thread o'chirildi · "
          f"{oldin/1024:.1f} → {keyin/1024:.1f} KB")
    return len(ochiriladi)


con = sqlite3.connect(DB, check_same_thread=False)
gcx = graf().compile(checkpointer=SqliteSaver(con))
for u in range(5):
    gcx.invoke({"messages": [HumanMessage("savol")]},
               {"configurable": {"thread_id": f"user-{u}"}})
con.close()
tozala(DB, saqlanadigan=["1", "user-4"])
```

## 💥 **`VACUUM` SIZ — FAYL KICHRAYMAYDI.**

</details>

---

# 🔴 QIYIN *(19–24)*

**M19.** ⭐⭐⭐ Xavfsiz thread menejeri.

<details>
<summary>✅ Yechim</summary>

```python
import re

class ThreadMenejer:
    KANALLAR = {"telegram": "tg", "web": "web", "call": "call", "test": "test"}
    XAVFSIZ = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")

    def __init__(self, gc):
        self.gc = gc
        self.jurnal = []

    def _thread_id(self, kanal, uid):
        if kanal not in self.KANALLAR:
            raise ValueError(f"noma'lum kanal: {kanal}")
        fid = str(uid)
        if not self.XAVFSIZ.match(fid):
            fid = re.sub(r"[^a-zA-Z0-9_-]", "", fid)[:64] or "anon"
            print(f"  ⚠️ ID tozalandi → {fid!r}")
        return f"{self.KANALLAR[kanal]}-{fid}"

    def config(self, kanal, uid, recursion_limit=40):
        return {"configurable": {"thread_id": self._thread_id(kanal, uid)},
                "recursion_limit": recursion_limit}

    def yubor(self, kanal, uid, kirish):
        cfg = self.config(kanal, uid)
        t0 = time.perf_counter()
        r = self.gc.invoke(kirish, cfg)
        snap = self.gc.get_state(cfg)
        self.jurnal.append({"thread": cfg["configurable"]["thread_id"],
                            "kanal": kanal,
                            "xabar": len(snap.values.get("messages", [])),
                            "step": snap.metadata.get("step"),
                            "ms": round((time.perf_counter() - t0) * 1000)})
        return r

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print("\n── kanal bo'yicha ──")
        print(d.groupby("kanal").agg(
            chaqiruv=("ms", "size"), threadlar=("thread", "nunique"),
            ort_xabar=("xabar", "mean")).round(1).to_string())
        katta = d[d.xabar > 30]
        if len(katta):
            print(f"\n⚠️ {len(katta)} chaqiruvda 30+ xabar — 46-modul kerak")
        return d


gc = graf().compile(checkpointer=InMemorySaver())
tm = ThreadMenejer(gc)
for k, u in [("telegram", 12345), ("telegram", 12345), ("telegram", 99999),
             ("web", "sess-abc"), ("telegram", "../../etc/passwd")]:
    tm.yubor(k, u, {"messages": [HumanMessage("savol")]})
print()
tm.hisobot()
```

## 🏆 **UCH XAVFSIZLIK QOIDASI:** serverda yasash · kanal prefiksi · **ID tozalash**.

## 💥 **`thread_id` NI FOYDALANUVCHIDAN OLSANGIZ — U BOSHQANING SUHBATINI O'QIYDI.**

</details>

**M20.** ⭐⭐⭐ Xotira nazoratchisi.

<details>
<summary>✅ Yechim</summary>

```python
class XotiraNazoratchi:
    def __init__(self, gc, maks_thread=1000, maks_xabar=50, til="uz"):
        self.gc, self.maks_thread, self.maks_xabar = gc, maks_thread, maks_xabar
        self.koef = 1.88 if til == "uz" else 1.0
        self.threadlar = set()

    def yubor(self, tid, kirish, **kw):
        cfg = {"configurable": {"thread_id": str(tid)}, **kw}
        self.threadlar.add(str(tid))
        r = self.gc.invoke(kirish, cfg)
        n = len(self.gc.get_state(cfg).values.get("messages", []))
        if n > self.maks_xabar:
            print(f"  ⚠️ '{tid}': {n} xabar > {self.maks_xabar} → trim kerak")
        if len(self.threadlar) > self.maks_thread:
            print(f"  💥 {len(self.threadlar)} thread → SqliteSaver'ga o'ting")
        return r

    def hisobot(self):
        q = []
        for t in sorted(self.threadlar):
            cfg = {"configurable": {"thread_id": t}}
            snap = self.gc.get_state(cfg)
            xs = snap.values.get("messages", [])
            q.append({"thread": t, "xabar": len(xs), "token": tok(xs),
                      "checkpoint": len(list(self.gc.get_state_history(cfg))),
                      "step": snap.metadata.get("step")})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        ram_kb = d.checkpoint.sum() * 2
        print(f"\n📊 {len(d)} thread · {d.checkpoint.sum()} checkpoint")
        print(f"   taxminiy RAM ≈ {ram_kb/1024:.2f} MB")
        print(f"   10 000 foydalanuvchida ≈ "
              f"{ram_kb/len(d)*10000/1024**2:.2f} GB")
        ort = d.token.mean()
        print(f"\n💰 🇺🇿 1000 suhbat/kun × 20 burilish ≈ "
              f"${ort*20/1e6*0.15*1000*365*self.koef:,.0f}/yil")
        return d


gc = graf().compile(checkpointer=InMemorySaver())
xn = XotiraNazoratchi(gc, maks_thread=5, maks_xabar=10)
for u in range(8):
    for i in range(u + 1):
        xn.yubor(f"user-{u}", {"messages": [HumanMessage(f"savol {i}")]})
print()
xn.hisobot()
```

</details>

**M21.** ⭐⭐⭐ Suhbat tekshiruvchisi.

<details>
<summary>✅ Yechim</summary>

```python
class SuhbatTekshiruvchi:
    def __init__(self, gc, til="uz"):
        self.gc = gc
        self.koef = 1.88 if til == "uz" else 1.0

    def jadval(self, tid):
        cfg = {"configurable": {"thread_id": str(tid)}}
        q = []
        for s in list(self.gc.get_state_history(cfg))[::-1]:
            xs = s.values.get("messages", [])
            w = s.metadata.get("writes") or {}
            q.append({"step": s.metadata.get("step"),
                      "source": s.metadata.get("source"),
                      "tugun": ",".join(w)[:20] or "—",
                      "next": ",".join(s.next)[:20] or "(tugadi)",
                      "xabar": len(xs), "token": tok(xs),
                      "xulosa": len(ENC.encode(s.values.get("summary") or "")),
                      "interrupt": len(getattr(s, "interrupts", ()) or ())})
        return pd.DataFrame(q)

    def hisobot(self, tid, kunlik=1000):
        d = self.jadval(tid)
        if d.empty:
            print(f"'{tid}' — tarix yo'q")
            return d
        print(f"📋 {tid} · {len(d)} checkpoint\n")
        print(d.to_string(index=False))

        burilish = (d.source == "input").sum()
        print(f"\n📊 {burilish} burilish · maks {d.token.max()} token")
        if d.token.max() > 2000:
            print("   ⚠️ kontekst KATTA — 46-modul kerak")

        loop = d[d.source == "loop"]
        kirish = loop.token.sum()
        print(f"💰 ≈ {kirish} token/suhbat · 🇺🇿 "
              f"${kirish/1e6*0.15*kunlik*365*self.koef:,.0f}/yil")

        upd = d[d.source == "update"]
        if len(upd):
            print(f"👤 {len(upd)} marta OPERATOR aralashgan "
                  f"(step {list(upd.step)})")
        if d.iloc[-1].next != "(tugadi)":
            print(f"⏳ TUGAMAGAN — kutilmoqda: {d.iloc[-1].next}")
        return d


gc = graf().compile(checkpointer=InMemorySaver())
for i in range(4):
    gc.invoke({"messages": [HumanMessage(f"savol {i}")]},
              {"configurable": {"thread_id": "tahlil"}})
gc.update_state({"configurable": {"thread_id": "tahlil"}},
                {"messages": [AIMessage("[OPERATOR] javob")]})
SuhbatTekshiruvchi(gc).hisobot("tahlil")
```

## 🏆 **HAMMASI `StateSnapshot` DAN** — qo'shimcha jurnal **kerak emas**.

</details>

**M22.** ⭐⭐⭐ Baza boshqaruvchisi *(zaxira nusxa bilan)*.

<details>
<summary>✅ Yechim</summary>

```python
from contextlib import contextmanager

class BazaBoshqaruv:
    def __init__(self, db_yol=None):
        self.yol = Path(db_yol or "./data/langgraph.db")
        self.yol.parent.mkdir(parents=True, exist_ok=True)

    @contextmanager
    def ulanish(self):
        con = sqlite3.connect(str(self.yol), check_same_thread=False)
        try:
            con.execute("PRAGMA journal_mode=WAL")
            con.execute("PRAGMA synchronous=NORMAL")
            con.execute("PRAGMA busy_timeout=5000")
            yield con
        finally:
            con.close()

    @contextmanager
    def checkpointer(self):
        with self.ulanish() as con:
            yield SqliteSaver(con)

    def hisobot(self):
        if not self.yol.exists():
            print("baza yo'q")
            return
        hajm = self.yol.stat().st_size
        print(f"📁 {self.yol} · {hajm/1024:.1f} KB")
        with self.ulanish() as con:
            q = [{"thread": t, "checkpoint": n} for t, n in con.execute(
                "SELECT thread_id, COUNT(*) FROM checkpoints "
                "GROUP BY thread_id ORDER BY COUNT(*) DESC")]
        if not q:
            print("   thread yo'q")
            return
        d = pd.DataFrame(q)
        print(f"   {len(d)} thread · {d.checkpoint.sum()} checkpoint")
        print(d.head(8).to_string(index=False))
        ort = hajm / max(1, d.checkpoint.sum())
        print(f"\n   💥 10 000 foydalanuvchi ≈ "
              f"{ort*d.checkpoint.mean()*10000/1024**3:.2f} GB")
        return d

    def zaxira(self, papka="./backups"):
        p = Path(papka); p.mkdir(parents=True, exist_ok=True)
        nom = p / f"{self.yol.stem}-{int(time.time())}.db"
        with self.ulanish() as manba:
            maqsad = sqlite3.connect(str(nom))
            try:
                manba.backup(maqsad)            # ⭐ atomik
            finally:
                maqsad.close()
        print(f"💾 {nom} · {nom.stat().st_size/1024:.1f} KB")
        return nom

    def tozala(self, saqlanadigan):
        oldin = self.yol.stat().st_size
        with self.ulanish() as con:
            hammasi = {r[0] for r in con.execute(
                "SELECT DISTINCT thread_id FROM checkpoints")}
            ochiriladi = hammasi - set(saqlanadigan)
            for t in ochiriladi:
                con.execute("DELETE FROM checkpoints WHERE thread_id=?", (t,))
                con.execute("DELETE FROM writes WHERE thread_id=?", (t,))
            con.commit()
            con.execute("VACUUM")
        print(f"✅ {len(ochiriladi)} thread · "
              f"{oldin/1024:.1f} → {self.yol.stat().st_size/1024:.1f} KB")
        return len(ochiriladi)


shutil.rmtree("data", ignore_errors=True)
bb = BazaBoshqaruv("./data/sinov.db")
with bb.checkpointer() as cp:
    gc = graf().compile(checkpointer=cp)
    for u in range(5):
        for i in range(u + 1):
            gc.invoke({"messages": [HumanMessage(f"savol {i}")]},
                      {"configurable": {"thread_id": f"user-{u}"}})
bb.hisobot(); print(); bb.zaxira(); print()
bb.tozala(saqlanadigan=["user-3", "user-4"]); print()
bb.hisobot()
```

## 🏆 **`con.backup()` — ISHLAB TURGAN BAZANI HAM XAVFSIZ NUSXALAYDI.**

</details>

**M23.** ⭐⭐⭐ 🇺🇿 Ikki tilli saqlanadigan bot.

<details>
<summary>✅ Yechim</summary>

```python
class BotState(MessagesState):
    til: str
    burilish: Annotated[int, operator.add]

JAVOBLAR = {
    "uz": {"kredit": "Iste'mol krediti yillik 24% dan, 24 oygacha.",
           "karta": "Debet karta 3 ish kunida tayyor.",
           "depozit": "Muddatli depozit yillik 18–22% foiz keltiradi.",
           "yoq": "Kechirasiz, tushunmadim. Kredit, karta yoki depozit?"},
    "ru": {"kredit": "Потребительский кредит от 24% годовых.",
           "karta": "Дебетовая карта готова за 3 рабочих дня.",
           "depozit": "Срочный депозит приносит 18–22% годовых.",
           "yoq": "Извините, не понял. Кредит, карта или депозит?"}}
KALITLAR = {"kredit": ["kredit", "qarz", "кредит", "займ"],
            "karta": ["karta", "plastik", "карта"],
            "depozit": ["depozit", "omonat", "депозит", "вклад"]}
RU = ["привет", "кредит", "карта", "депозит", "что", "как", "расскажите", "а "]


def til_aniqla(s: BotState) -> BotState:
    if s.get("til"):
        return {"burilish": 1}
    m = str(s["messages"][-1].content).lower() if s["messages"] else ""
    til = "ru" if any(x in m for x in RU) else "uz"
    print(f"  🌐 til aniqlandi: {til}")
    return {"til": til, "burilish": 1}


def javob_ber(s: BotState) -> BotState:
    til = s.get("til", "uz")
    m = str(s["messages"][-1].content).lower()
    for b, ks in KALITLAR.items():
        if any(k in m for k in ks):
            return {"messages": [AIMessage(JAVOBLAR[til][b])]}
    return {"messages": [AIMessage(JAVOBLAR[til]["yoq"])]}


g = StateGraph(BotState)
g.add_node("til", til_aniqla); g.add_node("javob", javob_ber)
g.add_edge(START, "til"); g.add_edge("til", "javob"); g.add_edge("javob", END)

shutil.rmtree("data", ignore_errors=True)
DB = Path("./data/bot.db"); DB.parent.mkdir(parents=True, exist_ok=True)
con = sqlite3.connect(str(DB), check_same_thread=False)
con.execute("PRAGMA journal_mode=WAL")
con.execute("PRAGMA busy_timeout=5000")
gc = g.compile(checkpointer=SqliteSaver(con))


def sora(uid, m):
    cfg = {"configurable": {"thread_id": f"tg-{uid}"}}
    return gc.invoke({"messages": [HumanMessage(m)]}, cfg)["messages"][-1].content


print("Oybek :", sora(12345, "Kredit haqida ayting"))
print("Oybek :", sora(12345, "Karta-chi?"))
print("Ivan  :", sora(55555, "Расскажите про кредит"))
print("Ivan  :", sora(55555, "А карта?"))

for uid in (12345, 55555):
    s = gc.get_state({"configurable": {"thread_id": f"tg-{uid}"}})
    print(f"  tg-{uid}: til={s.values.get('til')} · "
          f"burilish={s.values.get('burilish')} · "
          f"{len(s.values['messages'])} xabar")
con.close()
```

```
  🌐 til aniqlandi: uz
Oybek : Iste'mol krediti yillik 24% dan, 24 oygacha.
Oybek : Debet karta 3 ish kunida tayyor.
  🌐 til aniqlandi: ru
Ivan  : Потребительский кредит от 24% годовых.
Ivan  : Дебетовая карта готова за 3 рабочих дня.
  tg-12345: til=uz · burilish=2 · 4 xabar
  tg-55555: til=ru · burilish=2 · 4 xabar
```

## 🏆 **TIL BIR MARTA ANIQLANADI VA DISKDA SAQLANADI.** Va **LLM umuman yo'q**.

</details>

**M24.** ⭐⭐⭐ Store — foydalanuvchi profilini eslash *(kursda YO'Q)*.

<details>
<summary>✅ Yechim</summary>

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

# ── to'g'ridan-to'g'ri ──
store.put(("foydalanuvchilar", "tg-12345"), "profil",
          {"ism": "Oybek", "til": "uz", "daraja": "VIP"})
x = store.get(("foydalanuvchilar", "tg-12345"), "profil")
print("profil:", x.value)

# ── grafda ──
class S2(MessagesState):
    pass

def eslaydi(state, *, store, config):
    uid = config["configurable"]["thread_id"]
    x = store.get(("foydalanuvchilar", uid), "profil")
    profil = x.value if x else {}
    belgi = "✅ topildi" if profil else "⚪ yangi foydalanuvchi"
    print(f"  {belgi}: {profil}")
    return {"messages": [SystemMessage(f"Profil: {profil}")]}

def eslab_qol(state, *, store, config):
    uid = config["configurable"]["thread_id"]
    store.put(("foydalanuvchilar", uid), "profil",
              {"ism": "Oybek", "til": "uz", "oxirgi_bolim": "kredit"})
    return {}

g = StateGraph(S2)
g.add_node("eslaydi", eslaydi); g.add_node("eslab_qol", eslab_qol)
g.add_edge(START, "eslaydi"); g.add_edge("eslaydi", "eslab_qol")
g.add_edge("eslab_qol", END)
gc = g.compile(checkpointer=InMemorySaver(), store=store)

cfg = {"configurable": {"thread_id": "tg-99999"}}
gc.invoke({"messages": [HumanMessage("salom")]}, cfg)
gc.invoke({"messages": [HumanMessage("yana")]}, cfg)      # ⭐ profil ESLANDI
```

## 🏆 **FARQI:**
```
Checkpointer  →  "bu SUHBATDA nima bo'ldi?"
⭐ Store       →  "bu ODAM haqida nima bilaman?"  (suhbatlar ORASIDA)
```

## 🇺🇿 **FOYDALANUVCHINING TILI — AYNAN `Store` DA SAQLANISHI KERAK**, chunki u **yangi suhbatda ham** kerak.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
checkpointersiz:  2 · 2 · 2 xabar    💥 har safar noldan
checkpointerli :  2 · 4 · 6 xabar    ✅ to'planmoqda
ikki thread    :  oybek 6 · dilnoza 2   ✅ mustaqil

StateSnapshot: values · next · config · metadata · created_at ·
               parent_config · tasks · interrupts
2 invoke() → 10 checkpoint · step -1 dan 8 gacha
metadata.source: input · loop · update · fork

SQLite: jadvallar ['checkpoints', 'writes'] · 5 yozuv · 28 KB
        yangi ulanish → holat TIKLANDI ✅
💥 10 000 foydalanuvchi ≈ 2 GB — VACUUM bilan tozalang
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
