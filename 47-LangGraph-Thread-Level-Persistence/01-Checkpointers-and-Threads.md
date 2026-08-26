# 1-dars. Checkpointer va threadlar ⭐⭐

## 🎬 Boshlashdan oldin

> **"Checkpointer — supersteр ichida HAR TUGUN BAJARILGANDAN KEYIN grafning holatini saqlaydigan komponent."**

---

## 1. Muammo: 46-modul YETARLI EMAS

```
46-modulda:  bitta invoke() ichida xabarlar saqlanadi  ✅
             invoke() tugagach — HAMMASI YO'QOLADI     💥
```

```python
o1 = graf.invoke(State(messages=[HumanMessage("Men Oybek.")]))
o2 = graf.invoke(State(messages=[HumanMessage("Ismim nima?")]))
# 💥 o2 da o1 dagi hech narsa YO'Q
```

> ## 🔑 **YECHIM — CHECKPOINTER.** U holatni **chaqiruvlar orasida** saqlaydi.

---

## 2. ⭐ Checkpointer nima qiladi?

```
Har TUGUN bajarilgandan keyin  →  holat SAQLANADI
Saqlangan narsa                →  StateSnapshot obyekti
```

> ## 🏆 **BU NIMA IMKON BERADI?**
> ```
> ⭐ Suhbatni DAVOM ETTIRISH      →  ishga tushirishlar orasida xotira
> ⭐ Human-in-the-loop            →  odam holatni ko'radi va O'ZGARTIRADI
> ⭐ interrupt / Command(resume)  →  45-modul, 5-dars
> ⭐ Vaqt bo'yicha orqaga qaytish →  eski checkpointdan davom etish
> ⭐ Nosozlikni tuzatish          →  "qaysi qadamda nima bo'ldi?"
> ```
>
> ## 🔑 **KURSNING SO'ZLARI TO'G'RI:** *"chatbotlar bilan ishlash ANCHA SHAFFOF bo'ladi. Ularni sirli qora quti sifatida ko'rish shart emas."*

---

## 3. ⭐⭐ Thread — suhbat identifikatori

> **"Thread — bog'liq checkpointlar to'plami. Har thread `thread_id` bilan aniqlanadi."**

```python
config1 = {"configurable": {"thread_id": "1"}}
config2 = {"configurable": {"thread_id": "2"}}

graf.invoke(State(messages=[]), config1)      # 1-suhbat
graf.invoke(State(messages=[]), config2)      # 2-suhbat — MUSTAQIL
```

> ## 🔑 **QANDAY ISHLAYDI:**
> ```
> ① graf.invoke(..., config1) chaqirildi
> ② Checkpointer thread_id="1" bo'yicha OXIRGI checkpointni topadi
> ③ U KIRISH holati bo'ladi
> ④ Yangi kirish unga QO'SHILADI (reducer orqali)
> ```
>
> ## 🏆 **YA'NI: `thread_id` — SUHBAT IDENTIFIKATORI.**
> ```
> 💬 Telegram bot   →  thread_id = user_id
> 🌐 Veb-ilova      →  thread_id = session_id
> 📞 Call-markaz    →  thread_id = qo'ng'iroq_id
> ```

### 💥 Config bermasangiz — o'lchandi

```python
graf_checkpointerli.invoke(State(messages=[]))       # config YO'Q
```

```
💥 ValueError : Checkpointer requires one or more of the following
   'configurable' keys: thread_id, checkpoint_ns, checkpoint_id
```

> ## ✅ **XATO XABARI ANIQ VA FOYDALI.**

---

## 4. Qisqa va uzoq muddatli xotira

| | Qisqa muddatli | Uzoq muddatli |
|---|---|---|
| Sinf | ## `InMemorySaver` | ## `SqliteSaver` / `PostgresSaver` |
| Qayerda | ## **RAM** | ## **Disk / DB** |
| Dastur qayta ishga tushsa | ## 💥 **yo'qoladi** | ## ✅ **saqlanadi** |
| Tezlik | ## ⚡ **eng tez** | tezroq |
| Qachon | ## Sinov · prototip | ## ⭐ **Ishlab chiqarish** |

> ## ⚠️ **KURSNING TERMINOLOGIYASI BIROZ CHALKASH.** U *"uzoq muddatli xotira — vektor bazasi yoki hujjat ombori"* deydi, lekin **amalda SQLite'ni ko'rsatadi**.
>
> ## 🔑 **ANIQLIK KIRITAMIZ:**
> ```
> Thread-level persistence  →  ⭐ SUHBAT holati (checkpointer)
>                              InMemorySaver · SqliteSaver · PostgresSaver
>
> Long-term memory (Store)  →  ⭐ SUHBATLAR ORASIDA faktlar
>                              langgraph.store — ALOHIDA mexanizm
> ```
> ## 💡 **KURS FAQAT BIRINCHISINI KO'RSATADI.** Ikkinchisi — `InMemoryStore` / `PostgresStore` — **kursda yo'q**, lekin *"foydalanuvchi kim ekanini eslash"* uchun **aynan u kerak**.

---

## 5. ⭐ Checkpointer variantlari

```python
# ① Xotirada — sinov uchun
from langgraph.checkpoint.memory import InMemorySaver
checkpointer = InMemorySaver()

# ② SQLite — prototip va kichik ilova
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver
con = sqlite3.connect("langgraph.db", check_same_thread=False)
checkpointer = SqliteSaver(con)

# ③ ⭐ PostgreSQL — ISHLAB CHIQARISH (kursda YO'Q)
# pip install langgraph-checkpoint-postgres
from langgraph.checkpoint.postgres import PostgresSaver
with PostgresSaver.from_conn_string("postgresql://...") as checkpointer:
    checkpointer.setup()
    graf = graph.compile(checkpointer=checkpointer)

# ④ Asinxron variantlar
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
```

> ## 🏆 **QAROR:**
> ```
> Sinov / test          →  InMemorySaver
> Prototip / 1 server   →  SqliteSaver
> ⭐ Ishlab chiqarish    →  PostgresSaver  (bir necha server, zaxira nusxa)
> ```
>
> ## ⚠️ **SQLITE — BIR VAQTDA BIR NECHA YOZUVCHINI YOMON KO'TARADI.** 100+ foydalanuvchili botda **muammo** bo'ladi.

---

## 6. ⭐⭐ Superstep va checkpoint

> **"Har gorizontal daraja SUPERSTEP deb ataladi."** *(45-modul, 1-dars.)*

```
superstep -1  →  kirish holati
superstep  0  →  START (holat o'zgarmaydi)
superstep  1  →  ask_question bajarildi     →  💾 checkpoint
superstep  2  →  chatbot bajarildi          →  💾 checkpoint
superstep  3  →  summarize bajarildi        →  💾 checkpoint
```

> ## 🔑 **HAR SUPERSTEPDAN KEYIN — BITTA CHECKPOINT.**
>
> ## 💥 **YA'NI 10 BURILISHLIK SUHBAT × 3 TUGUN ≈ 40 CHECKPOINT.**
> ```
> SQLite'da: har checkpoint ~1–5 KB  →  10 000 suhbat ≈ 400 MB–2 GB
> ```
> ## ⚠️ **BAZANI TOZALASHNI REJALASHTIRING** — kursda bu **aytilmagan**.

---

## 7. 🇺🇿 Amaliy arxitektura

```python
# 🏦 Bank Telegram boti
@bot.message_handler(func=lambda m: True)
async def xabar(msg):
    cfg = {"configurable": {"thread_id": f"tg-{msg.from_user.id}"}}
    r = graf.invoke({"messages": [HumanMessage(msg.text)]}, cfg)
    await bot.reply_to(msg, r["messages"][-1].content)
```

> ## 🏆 **UCH SATR — VA BOT HAR FOYDALANUVCHINI ESLAYDI.**
>
> ## 🔑 **`thread_id` PREFIKSI (`tg-`) — MUHIM NAQSH.** Bir bazada bir necha kanal bo'lsa:
> ```
> tg-12345    →  Telegram
> web-abc99   →  veb-sayt
> call-777    →  call-markaz
> ```
>
> ## ⚠️⚠️ **XAVFSIZLIK:** `thread_id` ni **foydalanuvchi so'rovidan OLMANG**. Aks holda u **boshqa odamning suhbatini** o'qishi mumkin.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Checkpointer nima qiladi?

**M2.** `thread_id` nima?

**M3.** `InMemorySaver` va `SqliteSaver` farqi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Har tugun bajarilgandan keyin **holatni saqlaydi**.

**M2.** ## **Suhbat identifikatori** — bog'liq checkpointlar to'plami.

**M3.** ## `InMemorySaver` — **RAM** *(dastur yopilsa yo'qoladi)*, `SqliteSaver` — **disk**.

</details>

### 🟡 O'rta

**M4.** ⭐ Checkpointersiz va checkpointerli grafni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from langgraph.checkpoint.memory import InMemorySaver

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
  checkpointersiz 2: 2 xabar     ← 💥 har safar noldan
  checkpointersiz 3: 2 xabar
  checkpointerli   1: 2 xabar
  checkpointerli   2: 4 xabar    ← ✅ TO'PLANMOQDA
  checkpointerli   3: 6 xabar
```

</details>

**M5.** ⭐ Ikki threadni sinang.

<details>
<summary>✅ Yechim</summary>

```python
gc = g.compile(checkpointer=InMemorySaver())
c1 = {"configurable": {"thread_id": "oybek"}}
c2 = {"configurable": {"thread_id": "dilnoza"}}

for i in range(3):
    gc.invoke(S(messages=[]), c1)
gc.invoke(S(messages=[]), c2)

print("thread 'oybek'  :", len(gc.get_state(c1).values["messages"]), "xabar")
print("thread 'dilnoza':", len(gc.get_state(c2).values["messages"]), "xabar")
print("✅ MUSTAQIL suhbatlar")
```

</details>

**M6.** ⭐ Configsiz chaqiring.

<details>
<summary>✅ Yechim</summary>

```python
try:
    gc.invoke(S(messages=[]))
except Exception as e:
    print("💥", type(e).__name__)
    print("  ", str(e)[:130])
```

```
💥 ValueError
   Checkpointer requires one or more of the following 'configurable' keys:
   thread_id, checkpoint_ns, checkpoint_id
```

## ✅ **XATO XABARI ANIQ** — nima qilish kerakligini **aytadi**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Ko'p kanalli thread menejerini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re
import pandas as pd


class ThreadMenejer:
    """thread_id ni XAVFSIZ yaratadi va suhbatlarni boshqaradi."""

    KANALLAR = {"telegram": "tg", "web": "web", "call": "call",
                "test": "test"}
    XAVFSIZ = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")

    def __init__(self, graph_compiled):
        self.gc = graph_compiled
        self.jurnal = []

    # ── ⭐ XAVFSIZ thread_id ──
    def _thread_id(self, kanal, foydalanuvchi_id):
        if kanal not in self.KANALLAR:
            raise ValueError(f"noma'lum kanal: {kanal}")
        fid = str(foydalanuvchi_id)
        if not self.XAVFSIZ.match(fid):
            # ⚠️ foydalanuvchi kiritgan qiymatni TOZALAYMIZ
            fid = re.sub(r"[^a-zA-Z0-9_-]", "", fid)[:64] or "anon"
            print(f"  ⚠️ foydalanuvchi_id tozalandi → {fid!r}")
        return f"{self.KANALLAR[kanal]}-{fid}"

    def config(self, kanal, foydalanuvchi_id, recursion_limit=40):
        return {"configurable": {"thread_id":
                                 self._thread_id(kanal, foydalanuvchi_id)},
                "recursion_limit": recursion_limit}

    # ── suhbat ──
    def yubor(self, kanal, foydalanuvchi_id, kirish):
        cfg = self.config(kanal, foydalanuvchi_id)
        t0 = time.perf_counter()
        r = self.gc.invoke(kirish, cfg)
        snap = self.gc.get_state(cfg)
        self.jurnal.append({
            "thread": cfg["configurable"]["thread_id"],
            "kanal": kanal,
            "xabar": len(snap.values.get("messages", [])),
            "step": snap.metadata.get("step"),
            "ms": round((time.perf_counter() - t0) * 1000)})
        return r

    # ── holat ──
    def holat(self, kanal, foydalanuvchi_id):
        snap = self.gc.get_state(self.config(kanal, foydalanuvchi_id))
        return {"xabar": len(snap.values.get("messages", [])),
                "summary": snap.values.get("summary", "")[:60],
                "next": snap.next,
                "step": snap.metadata.get("step")}

    # ── tozalash ──
    def tozala(self, kanal, foydalanuvchi_id):
        """⭐ Suhbatni NOLDAN boshlash — thread_id ni O'ZGARTIRAMIZ."""
        cfg = self.config(kanal, foydalanuvchi_id)
        eski = cfg["configurable"]["thread_id"]
        yangi = f"{eski}-v{int(time.time())}"
        print(f"  🔄 {eski} → {yangi}")
        return {"configurable": {"thread_id": yangi}}

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print("\n── kanal bo'yicha ──")
        print(d.groupby("kanal").agg(
            chaqiruv=("ms", "size"), threadlar=("thread", "nunique"),
            ort_xabar=("xabar", "mean"), ort_ms=("ms", "mean")
        ).round(1).to_string())
        katta = d[d.xabar > 30]
        if len(katta):
            print(f"\n⚠️ {len(katta)} chaqiruvda 30+ xabar — "
                  f"46-moduldagi trim/xulosalash kerak")
        return d


tm = ThreadMenejer(gc)

tm.yubor("telegram", 12345, S(messages=[]))
tm.yubor("telegram", 12345, S(messages=[]))
tm.yubor("telegram", 99999, S(messages=[]))
tm.yubor("web", "sess-abc", S(messages=[]))
tm.yubor("telegram", "../../etc/passwd", S(messages=[]))   # ⚠️ hujum urinishi

print("\nholat (tg 12345):", tm.holat("telegram", 12345))
print()
tm.hisobot()
```

## 🏆 **UCHTA XAVFSIZLIK QOIDASI:**
```
① thread_id SERVERDA yasaladi  →  foydalanuvchi so'rovidan OLINMAYDI
② kanal PREFIKSI               →  tg-123 va web-123 ARALASHMAYDI
③ ⭐ ID TOZALANADI              →  "../../etc/passwd" → "etcpasswd"
```

## 💥 **AGAR `thread_id` NI FOYDALANUVCHIDAN OLSANGIZ — U BOSHQANING SUHBATINI O'QIY OLADI.** Bu — **jiddiy xavfsizlik kamchiligi**.

</details>

---

## 📌 Xulosa

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
graph_compiled = graph.compile(checkpointer=checkpointer)

config1 = {"configurable": {"thread_id": "1"}}
graph_compiled.invoke(State(messages=[]), config1)     # ⚠️ config SHART
```

```
✅ Checkpointer — har tugundan keyin holatni saqlaydi
⭐ thread_id — suhbat identifikatori (tg-123 · web-abc · call-777)
💥 configsiz → ValueError (aniq xato xabari bilan)

InMemorySaver  →  RAM · sinov
SqliteSaver    →  disk · prototip
PostgresSaver  →  ⭐ ishlab chiqarish (kursda YO'Q)
```

> ## ⚠️⚠️ **`thread_id` NI FOYDALANUVCHI SO'ROVIDAN OLMANG** — u boshqaning suhbatini **o'qiy oladi**.
>
> ## 💥 **10 BURILISH × 3 TUGUN ≈ 40 CHECKPOINT.** Bazani **tozalashni rejalashtiring**.

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. InMemorySaver](02-Short-Term-Memory-with-InMemorySaver.md)
