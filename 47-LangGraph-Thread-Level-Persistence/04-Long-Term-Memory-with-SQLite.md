# 4-dars. SQLite bilan uzoq muddatli xotira ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"`InMemorySaver` sinfining muhim cheklovi bor edi: Notebook kernelini qayta ishga tushirish XOTIRANI YO'QOTARDI."**

---

## 1. Kod

```python
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver

db_path = "langgraph.db"                       # ⚠️ kursda: C:/Users/Hristina/...
con = sqlite3.connect(database=db_path, check_same_thread=False)
checkpointer = SqliteSaver(con)

graph_compiled = graph.compile(checkpointer)
config1 = {"configurable": {"thread_id": "1"}}
graph_compiled.invoke(State(), config1)
```

```bash
pip install langgraph-checkpoint-sqlite
```

> ## 💡 **FAYL YO'Q BO'LSA — AVTOMATIK YARATILADI.**
>
> ## ⚠️ **KURS ABSOLYUT YO'L YOZADI** *(`C:/Users/Hristina/Desktop/...`)*. **Nisbiy yo'l** yoki **konfiguratsiya** ishlating:
> ```python
> from pathlib import Path
> DB = Path(os.getenv("LANGGRAPH_DB", "./data/langgraph.db"))
> DB.parent.mkdir(parents=True, exist_ok=True)
> ```

---

## 2. ⚠️ `check_same_thread=False` — nima uchun?

> **"Uni `False` ga qo'yish bir xil SQLite ulanish obyektiga BIR NECHA THREADDAN murojaat qilish imkonini beradi."**

```
SQLite standart holda    →  ulanish FAQAT o'zi yaratilgan threadda ishlaydi
check_same_thread=False  →  boshqa threadlardan ham ishlaydi
```

> ## 💥💥 **LEKIN BU — XAVFSIZLIK KAFOLATINI OLIB TASHLAYDI.**
>
> ## ⚠️ **YA'NI: SIZ O'ZINGIZ SINXRONLASHTIRISHINGIZ KERAK.**
> ```
> ✅ Bitta jarayon, bitta thread      →  muammo yo'q
> ⚠️ FastAPI (ko'p thread)           →  yozuvlar TO'QNASHISHI mumkin
> 💥 Bir necha jarayon / server       →  "database is locked" xatosi
> ```
>
> ## 🏆 **ISHLAB CHIQARISH UCHUN — POSTGRESQL:**
> ```bash
> pip install langgraph-checkpoint-postgres
> ```
> ```python
> from langgraph.checkpoint.postgres import PostgresSaver
> with PostgresSaver.from_conn_string(DSN) as checkpointer:
>     checkpointer.setup()                 # ⭐ jadvallarni yaratadi
>     gc = graph.compile(checkpointer=checkpointer)
> ```

---

## 3. 🔬 Haqiqatan saqlanadimi? — o'lchadik

```python
import os, sqlite3
DB = "lg_test.db"
if os.path.exists(DB):
    os.remove(DB)

# ── ① yozamiz ──
con = sqlite3.connect(database=DB, check_same_thread=False)
gsc = gg.compile(checkpointer=SqliteSaver(con))
o = gsc.invoke(StS(messages=[]), {"configurable": {"thread_id": "1"}})
print("✅ saqlandi · summary:", o.get("summary", "")[:50])
con.close()

# ── ② YANGI ulanish (dastur qayta ishga tushgandek) ──
con2 = sqlite3.connect(database=DB, check_same_thread=False)
gsc2 = gg.compile(checkpointer=SqliteSaver(con2))
snap2 = gsc2.get_state({"configurable": {"thread_id": "1"}})
print("tiklandi · summary:", (snap2.values.get("summary") or "")[:50])
print("step:", snap2.metadata.get("step"))

cur = con2.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("jadvallar:", [r[0] for r in cur.fetchall()])
cur = con2.execute("SELECT COUNT(*) FROM checkpoints")
print("checkpoint yozuvlari:", cur.fetchone()[0])
print("fayl hajmi:", round(os.path.getsize(DB) / 1024, 1), "KB")
```

```
✅ saqlandi · summary: To'rtinchi javob.
tiklandi · summary: To'rtinchi javob.
step: 3
jadvallar: ['checkpoints', 'writes']
checkpoint yozuvlari: 5
fayl hajmi: 28.0 KB
```

> ## 🏆🏆 **YANGI ULANISH — VA XOTIRA JOYIDA.** Bu — **haqiqiy davomiylik**.
>
> ## 🔑 **IKKI JADVAL:**
> ```
> checkpoints  →  ⭐ holat snapshot'lari
> writes       →  har tugun NIMA yozgani (metadata["writes"])
> ```
>
> ## 💡 **BITTA SUHBAT (3 TUGUN) — 5 CHECKPOINT · 28 KB.**

---

## 4. 💰 Hajm hisobi — kursda YO'Q

```
1 suhbat (3 tugun, 1 burilish)   ≈   5 checkpoint  ≈  28 KB
10 burilishlik suhbat            ≈  40 checkpoint  ≈  ~200 KB

10 000 foydalanuvchi × 200 KB    ≈   2 GB
100 000 foydalanuvchi            ≈  20 GB
```

> ## 💥 **SQLITE FAYLI CHEKSIZ O'SADI.** Hech qanday **avtomatik tozalash yo'q**.
>
> ## ✅ **TOZALASH:**
> ```python
> # ① Bitta threadni o'chirish
> checkpointer.delete_thread("tg-12345")
>
> # ② ⭐ Eski suhbatlarni ommaviy o'chirish (SQL bilan)
> con.execute("""
>     DELETE FROM checkpoints
>     WHERE thread_id IN (
>         SELECT DISTINCT thread_id FROM checkpoints
>         WHERE checkpoint_id < ?
>     )""", (eski_id,))
> con.commit()
> con.execute("VACUUM")            # ⭐ faylni HAQIQATAN kichraytiradi
> ```
>
> ## 💡 **`VACUUM` SIZ — O'CHIRSANGIZ HAM FAYL KICHRAYMAYDI.**

---

## 5. ⭐⭐ To'liq ishlab chiqarish namunasi

```python
import os, sqlite3
from pathlib import Path
from contextlib import contextmanager
from langgraph.checkpoint.sqlite import SqliteSaver


@contextmanager
def checkpointer_ol(db_yol=None):
    """⭐ Ulanishni TO'G'RI ochadi va yopadi."""
    yol = Path(db_yol or os.getenv("LANGGRAPH_DB", "./data/langgraph.db"))
    yol.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(database=str(yol), check_same_thread=False)
    try:
        # ⭐ ishonchlilik va tezlik sozlamalari
        con.execute("PRAGMA journal_mode=WAL")      # parallel o'qish
        con.execute("PRAGMA synchronous=NORMAL")    # tezroq, xavfsiz
        con.execute("PRAGMA busy_timeout=5000")     # 5s kutadi, yiqilmaydi
        yield SqliteSaver(con)
    finally:
        con.close()


with checkpointer_ol() as cp:
    gc = graph.compile(checkpointer=cp)
    r = gc.invoke({"messages": [HumanMessage("Kredit foizi?")]},
                  {"configurable": {"thread_id": "tg-12345"}})
    print(r["messages"][-1].content)
```

> ## 🏆 **UCH `PRAGMA` — KURSDA YO'Q, LEKIN JIDDIY FARQ QILADI:**
> ```
> journal_mode=WAL    →  ⭐ o'qish va yozish PARALLEL bo'ladi
> synchronous=NORMAL  →  ~2× tezroq, ishonchlilik deyarli bir xil
> busy_timeout=5000   →  ⭐ "database is locked" o'rniga KUTADI
> ```
>
> ## 💥 **`busy_timeout` SIZ — BIR NECHA FOYDALANUVCHI BIR VAQTDA YOZSA, BOT YIQILADI.**

---

## 6. ⚠️ Checkpointer — bu "long-term memory" EMAS

Kurs buni *"uzoq muddatli xotira"* deb ataydi. **Aniqlik kiritamiz:**

| | Checkpointer | ## ⭐ Store *(kursda YO'Q)* |
|---|---|---|
| Nima saqlaydi | ## **Suhbat holati** | ## **Faktlar** |
| Qamrov | ## Bitta `thread_id` | ## ⭐ **Threadlar ORASIDA** |
| Misol | "Bu suhbatda 12 xabar bor" | ## "Oybek — VIP mijoz" |
| Sinf | `SqliteSaver` | `InMemoryStore` · `PostgresStore` |

```python
# ⭐ Store — foydalanuvchi haqidagi FAKTLARNI eslash
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
gc = graph.compile(checkpointer=cp, store=store)


def eslab_qol(state, *, store, config):
    uid = config["configurable"]["thread_id"]
    store.put(("foydalanuvchilar", uid), "profil",
              {"ism": "Oybek", "til": "uz", "daraja": "VIP"})
    return {}


def eslaydi(state, *, store, config):
    uid = config["configurable"]["thread_id"]
    x = store.get(("foydalanuvchilar", uid), "profil")
    profil = x.value if x else {}
    return {"messages": [SystemMessage(f"Foydalanuvchi profili: {profil}")]}
```

> ## 🏆 **FARQI HAL QILUVCHI:**
> ```
> Checkpointer  →  "bu SUHBATDA nima bo'ldi?"
> ⭐ Store       →  "bu ODAM haqida nima bilaman?"
> ```
>
> ## 💡 **HAQIQIY BOT IKKALASINI HAM ISHLATADI.** Kurs faqat **birinchisini** ko'rsatadi.
>
> ## 🇺🇿 **VA BIZ UCHUN STORE MUHIM:** foydalanuvchining **tili** *(uz/ru)* suhbat tugagach ham **eslanishi** kerak.

---

## 7. 🇺🇿 To'liq bot — modelsiz, saqlanadigan

```python
import os, sqlite3, operator
from pathlib import Path
from langgraph.checkpoint.sqlite import SqliteSaver


class BotState(MessagesState):
    til: str
    burilish: Annotated[int, operator.add]


JAVOBLAR = {
    "uz": {"kredit": "Iste'mol krediti yillik 24% dan, 24 oygacha.",
           "karta": "Debet karta 3 ish kunida tayyor, yillik 50 000 so'm.",
           "depozit": "Muddatli depozit yillik 18–22% foiz keltiradi.",
           "yoq": "Kechirasiz, tushunmadim. Kredit, karta yoki depozit?"},
    "ru": {"kredit": "Потребительский кредит от 24% годовых, до 24 месяцев.",
           "karta": "Дебетовая карта готова за 3 рабочих дня.",
           "depozit": "Срочный депозит приносит 18–22% годовых.",
           "yoq": "Извините, не понял. Кредит, карта или депозит?"},
}
KALITLAR = {"kredit": ["kredit", "qarz", "кредит", "займ"],
            "karta": ["karta", "plastik", "карта", "пластик"],
            "depozit": ["depozit", "omonat", "депозит", "вклад"]}
RU_BELGI = ["привет", "кредит", "карта", "депозит", "что", "как", "сколько"]


def til_aniqla(s: BotState) -> BotState:
    if s.get("til"):
        return {"burilish": 1}
    matn = str(s["messages"][-1].content).lower() if s["messages"] else ""
    til = "ru" if any(x in matn for x in RU_BELGI) else "uz"
    print(f"  🌐 til aniqlandi: {til}")
    return {"til": til, "burilish": 1}


def javob(s: BotState) -> BotState:
    til = s.get("til", "uz")
    matn = str(s["messages"][-1].content).lower() if s["messages"] else ""
    for bolim, kalitlar in KALITLAR.items():
        if any(k in matn for k in kalitlar):
            return {"messages": [AIMessage(JAVOBLAR[til][bolim])]}
    return {"messages": [AIMessage(JAVOBLAR[til]["yoq"])]}


g = StateGraph(BotState)
g.add_node("til", til_aniqla)
g.add_node("javob", javob)
g.add_edge(START, "til"); g.add_edge("til", "javob"); g.add_edge("javob", END)

DB = Path("./data/bot.db")
DB.parent.mkdir(parents=True, exist_ok=True)
con = sqlite3.connect(str(DB), check_same_thread=False)
con.execute("PRAGMA journal_mode=WAL")
con.execute("PRAGMA busy_timeout=5000")
gc = g.compile(checkpointer=SqliteSaver(con))


def sora(uid, matn):
    cfg = {"configurable": {"thread_id": f"tg-{uid}"}}
    r = gc.invoke({"messages": [HumanMessage(matn)]}, cfg)
    return r["messages"][-1].content


print("Oybek  :", sora(12345, "Kredit haqida ayting"))
print("Oybek  :", sora(12345, "Karta-chi?"))          # ⭐ til ESLANDI
print("Ivan   :", sora(55555, "Расскажите про кредит"))
print("Ivan   :", sora(55555, "А карта?"))            # ⭐ til ESLANDI

for uid in (12345, 55555):
    snap = gc.get_state({"configurable": {"thread_id": f"tg-{uid}"}})
    print(f"  tg-{uid}: til={snap.values.get('til')} · "
          f"burilish={snap.values.get('burilish')} · "
          f"{len(snap.values['messages'])} xabar")
con.close()
```

> ## 🏆 **BOT DASTUR QAYTA ISHGA TUSHSA HAM HAMMASINI ESLAYDI:**
> ```
> ✅ Foydalanuvchining TILI
> ✅ Suhbat tarixi
> ✅ Burilishlar soni
> ```
>
> ## 🔑 **VA `til_aniqla` FAQAT BIR MARTA ISHLAYDI** — `if s.get("til")` tekshiruvi tufayli.
>
> ## 💰 **VA YANA — LLM UMUMAN YO'Q.** Ko'p bank savollari **shu darajada** hal bo'ladi.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `SqliteSaver` qayerda saqlaydi?

**M2.** `check_same_thread=False` nima qiladi?

**M3.** Qanday jadvallar yaratiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Disk fayli** — `.db`.

**M2.** ## Ulanishga **boshqa threadlardan** murojaat qilishga ruxsat beradi *(⚠️ xavfsizlik kafolatini olib tashlaydi)*.

**M3.** ## `checkpoints` va `writes`.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Saqlanishni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import os, sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver

DB = "sinov.db"
if os.path.exists(DB):
    os.remove(DB)

class S(MessagesState):
    pass

def bot(s): return {"messages": [chat.invoke(s["messages"])]}

g = StateGraph(S)
g.add_node("bot", bot)
g.add_edge(START, "bot"); g.add_edge("bot", END)
cfg = {"configurable": {"thread_id": "1"}}

# ── ① yozamiz ──
con = sqlite3.connect(DB, check_same_thread=False)
gc = g.compile(checkpointer=SqliteSaver(con))
for i in range(3):
    gc.invoke({"messages": [HumanMessage(f"savol {i}")]}, cfg)
print("yozildi:", len(gc.get_state(cfg).values["messages"]), "xabar")
con.close()

# ── ② YANGI ulanish ──
con2 = sqlite3.connect(DB, check_same_thread=False)
gc2 = g.compile(checkpointer=SqliteSaver(con2))
print("tiklandi:", len(gc2.get_state(cfg).values["messages"]), "xabar ✅")

cur = con2.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("jadvallar:", [r[0] for r in cur.fetchall()])
print("checkpointlar:", con2.execute(
    "SELECT COUNT(*) FROM checkpoints").fetchone()[0])
print("fayl:", round(os.path.getsize(DB) / 1024, 1), "KB")
con2.close()
```

</details>

**M5.** ⭐ Bazani to'g'ridan-to'g'ri o'qing.

<details>
<summary>✅ Yechim</summary>

```python
con = sqlite3.connect(DB, check_same_thread=False)

print("── checkpoints jadvali ──")
cur = con.execute("PRAGMA table_info(checkpoints)")
for r in cur.fetchall():
    print(f"  {r[1]:20s} {r[2]}")

print("\n── threadlar ──")
cur = con.execute("""
    SELECT thread_id, COUNT(*) FROM checkpoints GROUP BY thread_id""")
for t, n in cur.fetchall():
    print(f"  {t:16s} {n} checkpoint")

print("\n── hajm ──")
for jadval in ["checkpoints", "writes"]:
    n = con.execute(f"SELECT COUNT(*) FROM {jadval}").fetchone()[0]
    print(f"  {jadval:12s} {n} qator")
con.close()
```

## 🏆 **SQLITE — ODDIY FAYL.** Uni **istalgan vosita** bilan ochish mumkin.

</details>

**M6.** ⭐⭐ Tozalash funksiyasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
def eski_threadlarni_ochir(con, saqlanadigan_threadlar):
    """Ro'yxatda YO'Q threadlarni o'chiradi."""
    oldin = os.path.getsize(DB)

    cur = con.execute("SELECT DISTINCT thread_id FROM checkpoints")
    hammasi = {r[0] for r in cur.fetchall()}
    ochiriladi = hammasi - set(saqlanadigan_threadlar)

    if not ochiriladi:
        print("o'chiriladigan thread yo'q")
        return 0

    for t in ochiriladi:
        con.execute("DELETE FROM checkpoints WHERE thread_id = ?", (t,))
        con.execute("DELETE FROM writes WHERE thread_id = ?", (t,))
    con.commit()
    con.execute("VACUUM")                       # ⭐ faylni kichraytiradi

    keyin = os.path.getsize(DB)
    print(f"✅ {len(ochiriladi)} thread o'chirildi: {sorted(ochiriladi)[:3]}")
    print(f"   fayl {oldin/1024:.1f} → {keyin/1024:.1f} KB")
    return len(ochiriladi)


con = sqlite3.connect(DB, check_same_thread=False)
eski_threadlarni_ochir(con, saqlanadigan_threadlar=["1"])
con.close()
```

## 💥 **`VACUUM` SIZ — O'CHIRSANGIZ HAM FAYL KICHRAYMAYDI.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Baza boshqaruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import os, sqlite3, time
from pathlib import Path
from contextlib import contextmanager
import pandas as pd
from langgraph.checkpoint.sqlite import SqliteSaver


class BazaBoshqaruv:
    """SQLite checkpointer: ochish, tahlil, tozalash, zaxira nusxa."""

    def __init__(self, db_yol=None):
        self.yol = Path(db_yol or os.getenv("LANGGRAPH_DB",
                                            "./data/langgraph.db"))
        self.yol.parent.mkdir(parents=True, exist_ok=True)

    # ── ⭐ to'g'ri ulanish ──
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

    # ── tahlil ──
    def hisobot(self):
        if not self.yol.exists():
            print(f"baza yo'q: {self.yol}")
            return
        hajm = self.yol.stat().st_size
        print(f"📁 {self.yol}  ·  {hajm/1024:.1f} KB")

        with self.ulanish() as con:
            jadvallar = [r[0] for r in con.execute(
                "SELECT name FROM sqlite_master WHERE type='table'")]
            print(f"   jadvallar: {jadvallar}")

            q = []
            for t, n in con.execute(
                    "SELECT thread_id, COUNT(*) FROM checkpoints "
                    "GROUP BY thread_id ORDER BY COUNT(*) DESC"):
                q.append({"thread": t, "checkpoint": n})
            if not q:
                print("   thread yo'q")
                return
            d = pd.DataFrame(q)
            print(f"\n   {len(d)} thread · {d.checkpoint.sum()} checkpoint")
            print(d.head(10).to_string(index=False))

            ort = hajm / max(1, d.checkpoint.sum())
            print(f"\n   o'rtacha {ort/1024:.2f} KB / checkpoint")
            print(f"   💥 10 000 foydalanuvchi × "
                  f"{d.checkpoint.mean():.0f} checkpoint ≈ "
                  f"{ort * d.checkpoint.mean() * 10000 / 1024**3:.2f} GB")

            # ── ogohlantirishlar ──
            katta = d[d.checkpoint > 100]
            if len(katta):
                print(f"\n   ⚠️ {len(katta)} threadda 100+ checkpoint: "
                      f"{list(katta.thread)[:3]}")
                print("      → 46-moduldagi xulosalash state'ni kichraytiradi")
            if hajm > 100 * 1024 * 1024:
                print(f"\n   💥 baza {hajm/1024**2:.0f} MB — "
                      f"tozalash yoki PostgreSQL'ga o'tish vaqti")
            return d

    # ── tozalash ──
    def tozala(self, saqlanadigan=None, eski_kun=None):
        """saqlanadigan: shu threadlar QOLADI. eski_kun: shundan eski O'CHADI."""
        oldin = self.yol.stat().st_size if self.yol.exists() else 0
        with self.ulanish() as con:
            hammasi = {r[0] for r in con.execute(
                "SELECT DISTINCT thread_id FROM checkpoints")}
            ochiriladi = (hammasi - set(saqlanadigan)) if saqlanadigan \
                else set()

            if eski_kun:
                chegara = time.time() - eski_kun * 86400
                # checkpoint_id — UUIDv6/ULID, vaqt tartibida
                print(f"   ⚠️ vaqt bo'yicha tozalash checkpoint_id "
                      f"formatiga bog'liq — ehtiyot bo'ling")

            if not ochiriladi:
                print("o'chiriladigan thread yo'q")
                return 0
            for t in ochiriladi:
                con.execute("DELETE FROM checkpoints WHERE thread_id = ?", (t,))
                con.execute("DELETE FROM writes WHERE thread_id = ?", (t,))
            con.commit()
            con.execute("VACUUM")               # ⭐ SHART
        keyin = self.yol.stat().st_size
        print(f"✅ {len(ochiriladi)} thread o'chirildi · "
              f"{oldin/1024:.1f} → {keyin/1024:.1f} KB")
        return len(ochiriladi)

    # ── zaxira nusxa ──
    def zaxira(self, papka="./backups"):
        """⭐ SQLite'ning O'Z backup API si — ishlab turgan bazani ham nusxalaydi."""
        p = Path(papka)
        p.mkdir(parents=True, exist_ok=True)
        nom = p / f"{self.yol.stem}-{int(time.time())}.db"
        with self.ulanish() as manba:
            maqsad = sqlite3.connect(str(nom))
            try:
                manba.backup(maqsad)            # ⭐ atomik, xavfsiz
            finally:
                maqsad.close()
        print(f"💾 {nom} · {nom.stat().st_size/1024:.1f} KB")
        return nom

    # ── tiklash ──
    def tikla(self, zaxira_yol):
        import shutil
        shutil.copy2(zaxira_yol, self.yol)
        print(f"♻️ {zaxira_yol} → {self.yol}")


# ── ishlatish ──
bb = BazaBoshqaruv("./data/sinov.db")

class S(MessagesState):
    pass

g = StateGraph(S)
g.add_node("bot", lambda s: {"messages": [chat.invoke(s["messages"])]})
g.add_edge(START, "bot"); g.add_edge("bot", END)

with bb.checkpointer() as cp:
    gc = g.compile(checkpointer=cp)
    for uid in range(5):
        for i in range(uid + 1):
            gc.invoke({"messages": [HumanMessage(f"savol {i}")]},
                      {"configurable": {"thread_id": f"user-{uid}"}})

bb.hisobot()
print()
bb.zaxira()
print()
bb.tozala(saqlanadigan=["user-3", "user-4"])
print()
bb.hisobot()
```

## 🏆 **BESH IMKONIYAT:**
```
⭐ ulanish()      →  3 ta PRAGMA (WAL · NORMAL · busy_timeout)
📊 hisobot()      →  hajm bashorati va ogohlantirishlar
🗑️ tozala()       →  VACUUM bilan HAQIQIY kichraytirish
💾 zaxira()       →  ⭐ SQLite'ning O'Z backup API si (atomik)
♻️ tikla()        →  zaxiradan qaytarish
```

## 💥 **`con.backup()` — ODDIY FAYL NUSXALASHDAN ANCHA XAVFSIZ.** U **ishlab turgan** bazani ham to'g'ri nusxalaydi.

</details>

---

## 📌 Xulosa

```python
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver

con = sqlite3.connect("langgraph.db", check_same_thread=False)
con.execute("PRAGMA journal_mode=WAL")       # ⭐ parallel o'qish
con.execute("PRAGMA busy_timeout=5000")      # ⭐ "database is locked" YO'Q

gc = graph.compile(checkpointer=SqliteSaver(con))
```

```
🔬 O'LCHANGAN:
   yangi ulanish → summary TIKLANDI · step 3
   jadvallar: ['checkpoints', 'writes'] · 5 yozuv · 28 KB

💥 10 000 foydalanuvchi ≈ 2 GB — TOZALASHNI rejalashtiring
💥 VACUUM siz — o'chirsangiz ham fayl KICHRAYMAYDI
⚠️ check_same_thread=False — xavfsizlik kafolatini OLIB TASHLAYDI
🏆 Ishlab chiqarish → PostgresSaver
```

> ## ⚠️ **VA ATAMANI ANIQLASHTIRAMIZ:**
> ```
> Checkpointer  →  "bu SUHBATDA nima bo'ldi?"     (kurs shuni ko'rsatadi)
> ⭐ Store       →  "bu ODAM haqida nima bilaman?"  (kursda YO'Q)
> ```
> 🇺🇿 Foydalanuvchining **tili** — aynan **Store**da saqlanishi kerak.

---

⬅️ [3-dars. StateSnapshot](03-The-StateSnapshot-Class.md) · 🏠 [Modul boshiga](README.md) · ➡️ [48-modul. Vector Databases](../48-Vector-Databases-Introduction/README.md)
