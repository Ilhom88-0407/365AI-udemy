# 3-dars. `StateSnapshot` sinfi ⭐⭐

## 🎬 Boshlashdan oldin

> **"Keling, bu checkpointlar aslida nimaga o'xshashini batafsil o'rganamiz."**

---

## 1. `get_state_history`

```python
graph_states = [i for i in graph_compiled.get_state_history(config1)]
print("turi:", type(graph_states[0]).__name__)
print("tarix uzunligi:", len(graph_states))
```

```
turi: StateSnapshot
tarix uzunligi: 10
```

> ## 🔑 **`get_state_history` — GENERATOR QAYTARADI.** Shuning uchun `list()` yoki ro'yxat comprehension kerak.
>
> ## 💡 **NIMA UCHUN GENERATOR?** Tarix **juda uzun** bo'lishi mumkin — generator xotirani **tejaydi**.

---

## 2. ⭐ `StateSnapshot` maydonlari — o'lchandi

```python
snap = graph_compiled.get_state(config1)
print("turi     :", type(snap).__name__)
print("maydonlar:", snap._fields)
```

```
turi     : StateSnapshot
maydonlar: ('values', 'next', 'config', 'metadata', 'created_at',
            'parent_config', 'tasks', 'interrupts')
```

| Maydon | Nima |
|---|---|
| ## `values` | ## ⭐ **Holatning O'ZI** — `{"messages": [...], "summary": "..."}` |
| ## `next` | ## ⭐ **Keyingi bajariladigan tugun(lar)** — `()` bo'lsa **tugagan** |
| `config` | `thread_id` va `checkpoint_id` |
| ## `metadata` | ## `step` · `source` · `writes` |
| `created_at` | Vaqt tamg'asi |
| ## `parent_config` | ## **Oldingi** checkpoint — orqaga qaytish uchun |
| `tasks` | Bajarilishi kutilayotgan vazifalar |
| ## `interrupts` | ## ⭐ **`interrupt()` to'xtatgan joylar** *(45-modul, 5-dars)* |

---

## 3. 🔬 To'liq tarix — o'lchandi

```python
for i in graph_states[::-1]:                  # ⭐ TESKARI — boshidan
    print(f"  step {i.metadata['step']:>3}  next={str(i.next):24s} "
          f"msg={len(i.values.get('messages', []))}  "
          f"summary={'bor' if i.values.get('summary') else '—'}")
```

```
  step  -1  next=('__start__',)           msg=0  summary=—
  step   0  next=('ask_question',)        msg=0  summary=—
  step   1  next=('chatbot',)             msg=2  summary=—
  step   2  next=('summarize_messages',)  msg=3  summary=—
  step   3  next=()                       msg=0  summary=bor
  step   4  next=('__start__',)           msg=0  summary=bor
  step   5  next=('ask_question',)        msg=0  summary=bor
  step   6  next=('chatbot',)             msg=2  summary=—
  step   7  next=('summarize_messages',)  msg=3  summary=—
  step   8  next=()                       msg=0  summary=bor
```

> ## 🔑 **HAR QADAMNI O'QIYMIZ:**
> ```
> step -1  →  KIRISH holati (grafga hali kirmadik)
> step  0  →  START bajarildi (holat o'zgarmadi)
> step  1  →  ask_question → 2 xabar (AI savol + Human javob)
> step  2  →  chatbot → 3 xabar (javob qo'shildi)
> step  3  →  summarize → 0 xabar, summary BOR   ⭐ hammasi o'chirildi
> step  4  →  IKKINCHI invoke() boshlandi
> ...
> ```
>
> ## 🏆 **`next=()` — GRAF TUGAGAN.** Bu — **eng muhim belgi**.

> ## 💥 **VA E'TIBOR BERING — RO'YXAT TESKARI TARTIBDA.**
> ## Kursning eslatmasi to'g'ri: *"ro'yxatdagi BIRINCHI element — OXIRGI olingan snapshot"*.

---

## 4. ⭐⭐ Amaliy foydalanish

### ① Nosozlikni tuzatish

```python
def tarix_korsat(gc, cfg, oxirgi=10):
    """Suhbat qanday rivojlanganini KO'RSATADI."""
    tarix = list(gc.get_state_history(cfg))
    for s in tarix[::-1][-oxirgi:]:
        xs = s.values.get("messages", [])
        oxirgi_matn = str(xs[-1].content)[:40] if xs else "—"
        print(f"  step {s.metadata['step']:>3} · "
              f"next={str(s.next):22s} · {len(xs):2d} xabar · {oxirgi_matn}")
```

> ## 🏆 **"BOT NIMA UCHUN SHUNDAY JAVOB BERDI?"** — javob **shu yerda**.

### ② ⭐ Vaqt bo'yicha orqaga qaytish — kursda YO'Q

```python
tarix = list(gc.get_state_history(cfg))
eski = tarix[3]                                # 3 qadam oldingi holat

# ⭐ O'SHA HOLATDAN qayta ishga tushiramiz
gc.invoke(None, eski.config)
```

> ## 🔑 **`eski.config` DA `checkpoint_id` BOR** — LangGraph **aynan o'sha nuqtadan** davom etadi.
>
> ## 🏆 **BU NIMA UCHUN KERAK?**
> ```
> 🔧 Bot xato javob berdi   →  oldingi holatga qaytib, BOSHQA yo'ldan yuborish
> 🧪 A/B sinov              →  bir holatdan IKKI xil davom
> 👤 "Bekor qilish" tugmasi →  foydalanuvchi oxirgi qadamni QAYTARADI
> ```

### ③ Holatni qo'lda o'zgartirish

```python
gc.update_state(cfg, {"summary": "Tuzatilgan xulosa"})
gc.update_state(cfg, {"messages": [AIMessage("[OPERATOR] javob")]},
                as_node="chatbot")            # ⭐ "go'yo chatbot bajargandek"
```

---

## 5. ⭐ `metadata` ichida nima bor?

```python
snap = gc.get_state(cfg)
for k, v in snap.metadata.items():
    print(f"  {k:12s} {str(v)[:70]}")
```

| Kalit | Nima |
|---|---|
| ## `step` | Qadam raqami *(-1 dan boshlanadi)* |
| ## `source` | ## `"input"` · `"loop"` · `"update"` · `"fork"` |
| ## `writes` | ## ⭐ **Qaysi tugun NIMA yozgan** |
| `parents` | Ota-graf konteksti *(subgraph uchun)* |

> ## 🏆 **`writes` — NOSOZLIKNI TUZATISHNING ENG QIMMATLI MAYDONI.**
> ```python
> print(snap.metadata.get("writes"))
> # {'chatbot': {'messages': [AIMessage(...)]}}
> ```
> **Ya'ni: qaysi tugun state'ga aniq nima yozgani ko'rinadi.**
>
> ## 💡 **`source`:**
> ```
> "input"  →  invoke() ga berilgan kirish
> "loop"   →  tugun bajarilishi
> "update" →  ⭐ update_state() bilan QO'LDA o'zgartirilgan
> "fork"   →  eski checkpointdan tarmoqlanish
> ```

---

## 6. 💥 Tarix qancha joy egallaydi?

```
10 burilishlik suhbat × 3 tugun ≈ 40 checkpoint
Har checkpoint  ≈  1–5 KB  (state hajmiga bog'liq)
                →  40 × 3 KB ≈ 120 KB / suhbat
```

```
10 000 foydalanuvchi × 120 KB  ≈  1.2 GB
```

> ## ⚠️⚠️ **KURSDA BU AYTILMAGAN, LEKIN ISHLAB CHIQARISHDA HAL QILUVCHI.**
>
> ## ✅ **YECHIMLAR:**
> ```
> ① Eski threadlarni O'CHIRING          →  checkpointer.delete_thread(id)
> ② Xulosalash bilan state'ni KICHIK tuting  (46-modul)
> ③ ⭐ PostgreSQL + rejalashtirilgan tozalash
> ```
>
> ## 💡 **`InMemorySaver` DA — HECH QANDAY TOZALASH YO'Q.** Server **asta-sekin to'ladi**.

---

## 7. 🇺🇿 Amaliy — suhbat tarixini ko'rish paneli

```python
def suhbat_paneli(gc, thread_id):
    """🇺🇿 Operator uchun: suhbat qanday kechganini KO'RSATADI."""
    cfg = {"configurable": {"thread_id": thread_id}}
    tarix = list(gc.get_state_history(cfg))
    if not tarix:
        print(f"'{thread_id}' — tarix yo'q")
        return

    hozir = tarix[0]
    print(f"📋 thread: {thread_id}")
    print(f"   holat  : {'✅ tugagan' if not hozir.next else '⏳ ' + str(hozir.next)}")
    print(f"   qadam  : {hozir.metadata.get('step')}")
    print(f"   xabar  : {len(hozir.values.get('messages', []))}")
    print(f"   xulosa : {(hozir.values.get('summary') or '—')[:60]}")
    print(f"   check. : {len(tarix)}")

    print("\n   ── qadamlar ──")
    for s in tarix[::-1]:
        w = s.metadata.get("writes") or {}
        tugun = ", ".join(w) if w else "—"
        src = s.metadata.get("source", "?")
        belgi = {"input": "📥", "loop": "⚙️", "update": "👤",
                 "fork": "🔀"}.get(src, "•")
        print(f"     {belgi} step {s.metadata['step']:>3} · {src:7s} · "
              f"tugun: {tugun[:26]:26s} · {len(s.values.get('messages', []))} xabar")

    if any(s.metadata.get("source") == "update" for s in tarix):
        print("\n   👤 Bu suhbatga OPERATOR aralashgan")
```

> ## 🏆 **`source == "update"` — OPERATOR ARALASHUVINI ANIQLASH.** Audit uchun **muhim**.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `get_state_history` nima qaytaradi?

**M2.** `next=()` nima degani?

**M3.** `step` nechadan boshlanadi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Generator** — `StateSnapshot` obyektlari.

**M2.** ## Graf **tugagan** — bajariladigan tugun **yo'q**.

**M3.** ## `-1` dan — bu **kirish** holati *(grafga hali kirilmagan)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Tarixni ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
cfg = {"configurable": {"thread_id": "tarix"}}
for i in range(2):
    gc.invoke({"messages": [HumanMessage(f"savol {i}")]}, cfg)

tarix = list(gc.get_state_history(cfg))
print("checkpointlar:", len(tarix))
print("maydonlar    :", tarix[0]._fields)

for s in tarix[::-1]:
    print(f"  step {s.metadata['step']:>3} · "
          f"next={str(s.next):22s} · "
          f"{len(s.values.get('messages', []))} xabar · "
          f"{s.metadata.get('source')}")
```

## 🔑 **`[::-1]` — BOSHIDAN OXIRGACHA.** Aks holda **teskari** o'qiysiz.

</details>

**M5.** ⭐ `metadata` ni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
snap = gc.get_state(cfg)
print("metadata kalitlari:", list(snap.metadata))
for k, v in snap.metadata.items():
    print(f"  {k:12s} {str(v)[:70]}")

print("\n⭐ writes — qaysi tugun nima yozgan:")
print("  ", snap.metadata.get("writes"))
```

</details>

**M6.** ⭐⭐ Vaqt bo'yicha orqaga qayting.

<details>
<summary>✅ Yechim</summary>

```python
cfg = {"configurable": {"thread_id": "orqaga"}}
for i in range(3):
    gc.invoke({"messages": [HumanMessage(f"savol {i}")]}, cfg)

tarix = list(gc.get_state_history(cfg))
print("hozir:", len(gc.get_state(cfg).values["messages"]), "xabar")

# ⭐ eskiroq holatni topamiz
eski = [s for s in tarix if len(s.values.get("messages", [])) == 2]
if eski:
    e = eski[0]
    print(f"orqaga: step {e.metadata['step']} · "
          f"{len(e.values['messages'])} xabar")
    r = gc.invoke({"messages": [HumanMessage("BOSHQA savol")]}, e.config)
    print("davom :", len(r["messages"]), "xabar")
    print("✅ eski nuqtadan BOSHQA yo'ldan davom etdik")
```

## 🏆 **BU — "BEKOR QILISH" VA A/B SINOVINING TEXNIK ASOSI.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Suhbat tekshiruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
import pandas as pd
from datetime import datetime

ENC = tiktoken.get_encoding("cl100k_base")


class SuhbatTekshiruvchi:
    """StateSnapshot tarixidan TO'LIQ tahlil chiqaradi."""

    def __init__(self, graph_compiled, til="uz"):
        self.gc = graph_compiled
        self.koef = 1.88 if til == "uz" else 1.0

    def _tok(self, xs):
        return sum(len(ENC.encode(str(m.content))) for m in xs)

    # ── xom tarix ──
    def tarix(self, thread_id):
        cfg = {"configurable": {"thread_id": str(thread_id)}}
        return list(self.gc.get_state_history(cfg))[::-1]      # boshidan

    # ── jadval ──
    def jadval(self, thread_id):
        q = []
        for s in self.tarix(thread_id):
            xs = s.values.get("messages", [])
            w = s.metadata.get("writes") or {}
            q.append({
                "step": s.metadata.get("step"),
                "source": s.metadata.get("source"),
                "tugun": ",".join(w)[:22] or "—",
                "next": ",".join(s.next)[:22] or "(tugadi)",
                "xabar": len(xs),
                "token": self._tok(xs),
                "xulosa": len(ENC.encode(s.values.get("summary") or "")),
                "interrupt": len(getattr(s, "interrupts", ()) or ()),
            })
        return pd.DataFrame(q)

    # ── to'liq hisobot ──
    def hisobot(self, thread_id, kunlik_suhbat=1000):
        d = self.jadval(thread_id)
        if d.empty:
            print(f"'{thread_id}' — tarix yo'q")
            return d

        print(f"📋 thread: {thread_id} · {len(d)} checkpoint\n")
        print(d.to_string(index=False))

        # ── ① burilishlar ──
        burilish = (d.source == "input").sum()
        print(f"\n📊 {burilish} burilish · {d.step.max()} qadam")

        # ── ② kontekst o'sishi ──
        maks = d.token.max()
        print(f"   kontekst: maks {maks} token · "
              f"o'rtacha {d.token.mean():.0f}")
        if maks > 4000:
            print(f"   💥 {maks} token — kontekst oynasi xavf ostida")
        elif maks > 2000:
            print(f"   ⚠️ {maks} token — 46-moduldagi trim'ni ko'rib chiqing")

        # ── ③ narx ──
        # taxminan: har "loop" qadamida kontekst modelga ketadi
        loop = d[d.source == "loop"]
        kirish = loop.token.sum()
        print(f"\n💰 taxminiy kirish ≈ {kirish} token / suhbat")
        print(f"   gpt-4o-mini : ${kirish/1e6*0.15:.6f}")
        print(f"   🇺🇿 yillik   : "
              f"${kirish/1e6*0.15*kunlik_suhbat*365*self.koef:,.0f}")

        # ── ④ xulosalash ishlaganmi ──
        if d.xulosa.max() > 0:
            xul_qadam = (d.xulosa > 0).sum()
            print(f"\n📝 xulosa {xul_qadam}/{len(d)} qadamda mavjud "
                  f"(maks {d.xulosa.max()} token)")
            if d.xulosa.max() > 400:
                print("   ⚠️ xulosa KATTA — qisqartirishni ko'rib chiqing")
        else:
            print("\n📝 xulosa YO'Q")
            if burilish > 5:
                print("   💡 5+ burilish, lekin xulosa yo'q — "
                      "46-moduldagi xulosalash foydali bo'lardi")

        # ── ⑤ operator aralashuvi ──
        upd = d[d.source == "update"]
        if len(upd):
            print(f"\n👤 {len(upd)} marta OPERATOR aralashgan "
                  f"(step: {list(upd.step)})")

        # ── ⑥ interrupt ──
        intr = d[d.interrupt > 0]
        if len(intr):
            print(f"\n⏸️ {len(intr)} marta interrupt bo'lgan "
                  f"(step: {list(intr.step)})")

        # ── ⑦ to'xtash holati ──
        oxirgi = d.iloc[-1]
        if oxirgi.next != "(tugadi)":
            print(f"\n⏳ suhbat TUGAMAGAN — kutilmoqda: {oxirgi.next}")
        return d

    # ── bir necha threadni solishtirish ──
    def taqqosla(self, thread_idlar):
        q = []
        for t in thread_idlar:
            d = self.jadval(t)
            if d.empty:
                continue
            loop = d[d.source == "loop"]
            q.append({"thread": t, "checkpoint": len(d),
                      "burilish": (d.source == "input").sum(),
                      "maks_token": d.token.max(),
                      "kirish_token": loop.token.sum(),
                      "xulosa": d.xulosa.max(),
                      "tugadi": d.iloc[-1].next == "(tugadi)"})
        if not q:
            print("thread topilmadi")
            return
        dd = pd.DataFrame(q)
        dd["🇺🇿 yillik_$"] = (dd.kirish_token / 1e6 * 0.15 * 1000 * 365
                             * self.koef).round()
        print(dd.to_string(index=False))

        tugamagan = dd[~dd.tugadi]
        if len(tugamagan):
            print(f"\n⏳ {len(tugamagan)} suhbat TUGAMAGAN: "
                  f"{list(tugamagan.thread)}")
        katta = dd[dd.maks_token > 2000]
        if len(katta):
            print(f"⚠️ {len(katta)} suhbatda kontekst 2000+ token")
        return dd


# ── sinov ──
class S(MessagesState):
    summary: str

def bot(s: S) -> S:
    return {"messages": [chat.invoke(s["messages"])]}

g = StateGraph(S)
g.add_node("bot", bot)
g.add_edge(START, "bot"); g.add_edge("bot", END)
gc = g.compile(checkpointer=InMemorySaver())

# uch xil suhbat
for i in range(6):
    gc.invoke({"messages": [HumanMessage(f"Kredit haqida savol {i}")]},
              {"configurable": {"thread_id": "uzun"}})
for i in range(2):
    gc.invoke({"messages": [HumanMessage(f"Karta savoli {i}")]},
              {"configurable": {"thread_id": "qisqa"}})
gc.invoke({"messages": [HumanMessage("Depozit?")]},
          {"configurable": {"thread_id": "operator"}})
gc.update_state({"configurable": {"thread_id": "operator"}},
                {"messages": [AIMessage("[OPERATOR] Tuzatilgan javob")]})

st = SuhbatTekshiruvchi(gc, til="uz")
st.hisobot("uzun")
print("\n" + "═" * 60 + "\n")
st.taqqosla(["uzun", "qisqa", "operator"])
```

## 🏆 **YETTI TAHLIL — HAMMASI `StateSnapshot` DAN:**
```
① burilishlar soni      ← source == "input"
② kontekst o'sishi      ← token
③ 💰 narx bashorati     ← source == "loop" token yig'indisi
④ xulosalash ishladimi  ← summary token
⑤ 👤 operator aralashuvi ← source == "update"
⑥ ⏸️ interrupt          ← interrupts maydoni
⑦ ⏳ tugamagan suhbat   ← next != ()
```

## 💥 **HECH BIRI UCHUN QO'SHIMCHA JURNAL KERAK EMAS** — hammasi checkpointer'da **allaqachon bor**.

</details>

---

## 📌 Xulosa

```python
tarix = list(gc.get_state_history(cfg))       # ⭐ generator → list
for s in tarix[::-1]:                          # ⭐ boshidan oxirigacha
    print(s.metadata["step"], s.next, len(s.values["messages"]))

gc.invoke(None, tarix[3].config)               # ⭐ ORQAGA qaytish
```

```
StateSnapshot maydonlari:
   values · next · config · metadata · created_at
   parent_config · tasks · interrupts

step -1 → kirish · step 0 → START · next=() → TUGAGAN
metadata: step · source (input/loop/update/fork) · ⭐ writes
```

```
🔬 O'LCHANGAN: 2 invoke() → 10 checkpoint
💥 10 000 foydalanuvchi × ~120 KB ≈ 1.2 GB — TOZALASHNI rejalashtiring
```

> ## 🏆 **`StateSnapshot` — NOSOZLIKNI TUZATISH, AUDIT VA "ORQAGA QAYTISH" NING ASOSI.** Qo'shimcha jurnal **kerak emas**.

---

⬅️ [2-dars. InMemorySaver](02-Short-Term-Memory-with-InMemorySaver.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. SQLite bilan uzoq muddatli xotira](04-Long-Term-Memory-with-SQLite.md)
