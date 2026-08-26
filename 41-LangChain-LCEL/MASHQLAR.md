# 📝 41-modul mashqlari

> **36 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **DEYARLI HAMMASI API KALITISIZ** — LCEL `RunnableLambda` bilan **to'liq** o'rganiladi.

## ⚙️ Tayyorgarlik

```bash
pip install langchain langchain-core grandalf pandas
# ixtiyoriy (model bilan): pip install langchain-openai python-dotenv
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, re
from operator import itemgetter
import pandas as pd

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.runnables import (Runnable, RunnableLambda,
                                      RunnablePassthrough, RunnableParallel,
                                      chain)
```

---

# 🟢 OSON *(1–12)*

**M1.** `|` operatori nima qaytaradi?

**M2.** LCEL ni o'rganish uchun model kerakmi?

**M3.** `batch` nima qiladi?

**M4.** `batch` narxni tejaydimi?

**M5.** `stream` nima qaytaradi?

**M6.** Nima uchun `|` ishlaydi?

<details>
<summary>✅ Javoblar M1–M6</summary>

**M1.** ## **`RunnableSequence`**.

**M2.** ## ❌ **Yo'q** — `RunnableLambda` bilan **bepul**.

**M3.** So'rovlarni **parallel** yuboradi. Bizda **4× tezlanish**.

**M4.** ## ❌ **Yo'q** — faqat **vaqt**. Har so'rov alohida hisoblanadi.

**M5.** ## **Generator**.

**M6.** ## `Runnable` sinfi **`__or__`** ni aniqlaydi.

</details>

**M7.** `RunnablePassthrough` nima qiladi?

**M8.** `assign` dan farqi?

**M9.** `RunnableParallel` narxni tejaydimi?

**M10.** `RunnableLambda` oqim qila oladimi?

**M11.** `@chain` nima qaytaradi?

**M12.** `print_ascii()` uchun nima kerak?

<details>
<summary>✅ Javoblar M7–M12</summary>

**M7.** ## **Kirishni o'zgarishsiz** qaytaradi *(turni o'zgartirish uchun)*.

**M8.** ## `assign` — **eski kalitlarni saqlaydi** va yangisini qo'shadi.

**M9.** ## ❌ **Yo'q** — narxni **oshiradi**, faqat **vaqtni** tejaydi.

**M10.** ## ❌ **Yo'q** — butun natijani **bitta bo'lak** qilib beradi.

**M11.** ## **`RunnableLambda`**.

**M12.** ## `pip install grandalf` — kursda **aytilmagan**.

</details>

---

# 🟡 O'RTA *(13–28)*

**M13.** ⭐ Modelsiz zanjir yasang.

<details>
<summary>✅ Yechim</summary>

```python
z = (RunnableLambda(lambda x: sum(x)) | RunnableLambda(lambda x: x ** 2))
print(z.invoke([1, 2, 5]))                          # 64
print("turi    :", type(z).__name__)
print("qadamlar:", [type(s).__name__ for s in z.steps])
```

</details>

**M14.** ⭐ Grafni chizing.

<details>
<summary>✅ Yechim</summary>

```python
z.get_graph().print_ascii()
print()
print(z.get_graph().draw_mermaid())
```

</details>

**M15.** ⭐⭐ `batch` tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
sekin = RunnableLambda(lambda x: (time.sleep(0.3), x * 2)[1])
kirish = list(range(8))

for nom, f in [("ketma-ket", lambda: [sekin.invoke(i) for i in kirish]),
               ("batch",     lambda: sekin.batch(kirish)),
               ("batch(2)",  lambda: sekin.batch(kirish, config={"max_concurrency": 2})),
               ("batch(4)",  lambda: sekin.batch(kirish, config={"max_concurrency": 4}))]:
    t0 = time.perf_counter(); f()
    print(f"{nom:12s} {time.perf_counter()-t0:.2f}s")
```

</details>

**M16.** ⭐⭐ `return_exceptions` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
xatoli = RunnableLambda(lambda x: 1 / x)

try:
    xatoli.batch([1, 2, 0, 4])
except Exception as e:
    print("💥 BUTUN BATCH SINDI:", type(e).__name__)

for i, r in enumerate(xatoli.batch([1, 2, 0, 4], return_exceptions=True)):
    print(f"  [{i}] {'❌ ' + type(r).__name__ if isinstance(r, Exception) else r}")
```

</details>

**M17.** ⭐ `batch_as_completed` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import random
t = RunnableLambda(lambda x: (time.sleep(random.uniform(0.1, 0.6)), x)[1])
t0 = time.perf_counter()
for i, r in t.batch_as_completed(list(range(5))):
    print(f"[{i}] {time.perf_counter()-t0:.2f}s da tayyor")
```

## 💡 **TARTIB — TUGASH TARTIBI.**

</details>

**M18.** ⭐ `RunnablePassthrough` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
print(RunnablePassthrough().invoke([1, 2, 3]))
print(RunnablePassthrough().invoke({"a": 1}))
print(RunnablePassthrough.assign(kv=lambda d: d["n"] ** 2).invoke({"n": 5}))
```

</details>

**M19.** ⭐⭐ `assign` va `{"x": Passthrough()}` ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
kirish = {"savol": "Depozit nima?", "til": "uz"}

a = {"kontekst": RunnableLambda(lambda d: "hujjat")} | RunnableLambda(lambda d: d)
b = RunnablePassthrough.assign(kontekst=lambda d: "hujjat")

print("lug'at :", a.invoke(kirish))
print("assign :", b.invoke(kirish))
```

```
lug'at : {'kontekst': 'hujjat'}                                  ← savol YO'QOLDI 💥
assign : {'savol': '...', 'til': 'uz', 'kontekst': 'hujjat'}     ✅
```

</details>

**M20.** ⭐⭐ `RunnableParallel` tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
sekin = RunnableLambda(lambda x: (time.sleep(0.4), x)[1])
for n in [1, 2, 4, 8]:
    p = RunnableParallel({f"s{i}": sekin for i in range(n)})
    t0 = time.perf_counter(); p.invoke(1)
    print(f"{n} shox → {time.perf_counter()-t0:.2f}s "
          f"(ketma-ket bo'lsa {n*0.4:.1f}s)")
```

</details>

**M21.** ⭐ Lug'at avtomatik `RunnableParallel` ga aylanishini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
z = ({"yigindi": RunnableLambda(sum), "max": RunnableLambda(max)}
     | RunnableLambda(lambda d: d["yigindi"] * d["max"]))
print(type(z).__name__, "→", z.invoke([1, 2, 5]))     # 8 * 5 = 40
```

</details>

**M22.** ⭐ `itemgetter` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
z = ({"n": itemgetter("son"), "m": itemgetter("matn")}
     | RunnableLambda(lambda d: f"{d['m']} × {d['n']}"))
print(z.invoke({"son": 3, "matn": "salom"}))          # salom × 3
```

</details>

**M23.** ⭐⭐ `with_retry` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
sanoq = {"n": 0}
def notekis(x):
    sanoq["n"] += 1
    if sanoq["n"] < 3:
        raise ConnectionError("tarmoq xatosi")
    return f"ok (urinish {sanoq['n']})"

r = RunnableLambda(notekis).with_retry(stop_after_attempt=5,
                                       wait_exponential_jitter=True)
t0 = time.perf_counter()
print(r.invoke(None), f"{time.perf_counter()-t0:.2f}s")
```

</details>

**M24.** ⭐⭐ `with_fallbacks` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
r = (RunnableLambda(lambda x: 1 / 0)
     .with_fallbacks([RunnableLambda(lambda x: 1 / 0),
                      RunnableLambda(lambda x: "oxirgi zaxira ishladi")]))
print(r.invoke(None))
```

## 🔑 **ZAXIRALAR KETMA-KET SINALADI.**

</details>

**M25.** ⭐ `map`, `pick`, `bind` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
print("map :", RunnableLambda(lambda x: x * 2).map().invoke([1, 2, 3]))
p = RunnablePassthrough.assign(kv=lambda d: d["n"] ** 2, kub=lambda d: d["n"] ** 3)
print("assign:", p.invoke({"n": 3}))
print("pick  :", (p | RunnableLambda(lambda d: d)).pick(["kv"]).invoke({"n": 3}))
```

</details>

**M26.** ⭐ `@chain` va `RunnableLambda` ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def yig(x): return sum(x)

@chain
def yig2(x): return sum(x)

print(type(RunnableLambda(yig)).__name__, type(yig2).__name__)
print("yig chaqiriladimi :", callable(yig))
print("yig2 chaqiriladimi:", callable(yig2))
```

</details>

**M27.** ⭐⭐ Kuzatuv nuqtasi qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
def kuzat(nom):
    def f(x):
        print(f"[{nom}] {type(x).__name__}: {str(x)[:60]}")
        return x
    return RunnableLambda(f)

z = (RunnableLambda(lambda s: s.split()) | kuzat("bo'lindi")
     | RunnableLambda(len) | kuzat("sanaldi"))
print("natija:", z.invoke("bir ikki uch"))
```

</details>

**M28.** ⭐⭐ Shartli marshrutlash.

<details>
<summary>✅ Yechim</summary>

```python
qisqa = RunnableLambda(lambda d: f"QISQA: {d['matn'][:20]}")
uzun  = RunnableLambda(lambda d: f"UZUN ({len(d['matn'])} belgi)")
marshrut = RunnableLambda(lambda d: qisqa if len(d["matn"]) < 30 else uzun)

print(marshrut.invoke({"matn": "salom"}))
print(marshrut.invoke({"matn": "juda uzun matn " * 10}))
```

## 🏆 **`RunnableLambda` ICHIDA `Runnable` QAYTARILDI.**

</details>

---

# 🔴 QIYIN *(29–36)*

**M29.** ⭐⭐ `|` ni o'zingiz yozing.

<details>
<summary>✅ Yechim</summary>

```python
class MeningRunnable:
    def __init__(self, f, nom=""):
        self.f = f
        self.nom = nom or getattr(f, "__name__", "lambda")
    def invoke(self, x):
        return self.f(x)
    def __or__(self, b):
        y = MeningRunnable(lambda x: b.invoke(self.invoke(x)))
        y.nom = f"{self.nom} | {b.nom}"
        return y

a = MeningRunnable(lambda x: sum(x), "sum")
b = MeningRunnable(lambda x: x ** 2, "square")
z = a | b
print(z.nom, "→", z.invoke([1, 2, 5]))
```

</details>

**M30.** ⭐⭐ Xavfsiz batch o'rovchisi.

<details>
<summary>✅ Yechim</summary>

```python
def xavfsiz_batch(chain, sorovlar, max_concurrency=5, urinish=2):
    natija = [None] * len(sorovlar)
    qoldiq = list(range(len(sorovlar)))
    for u in range(urinish):
        if not qoldiq:
            break
        r = chain.batch([sorovlar[i] for i in qoldiq],
                        config={"max_concurrency": max_concurrency},
                        return_exceptions=True)
        yangi = []
        for idx, x in zip(qoldiq, r):
            natija[idx] = x
            if isinstance(x, Exception):
                yangi.append(idx)
        if yangi:
            print(f"urinish {u+1}: {len(yangi)} ta xato qoldi")
        qoldiq = yangi
    ok = sum(1 for x in natija if not isinstance(x, Exception))
    print(f"{ok}/{len(sorovlar)} muvaffaqiyat")
    return natija
```

## 🏆 **FAQAT XATOLARNI QAYTA URADI** — muvaffaqiyatlilarni qayta so'ramaydi *(pul tejaydi)*.

</details>

**M31.** ⭐⭐ Ikki bosqichli zanjir *(modelsiz)*.

<details>
<summary>✅ Yechim</summary>

```python
b1 = (RunnableLambda(lambda d: d["matn"].split())
      | RunnableLambda(lambda w: [x.lower() for x in w]))
b2 = (RunnableLambda(lambda d: d["sozlar"])
      | RunnableLambda(lambda w: {"soni": len(w), "noyob": len(set(w)),
                                  "eng_uzun": max(w, key=len)}))

z = b1 | {"sozlar": RunnablePassthrough()} | b2
print(z.invoke({"matn": "Salom dunyo salom LangChain dunyo"}))
```

</details>

**M32.** ⭐⭐⭐ RAG naqshini modelsiz taqlid qiling.

<details>
<summary>✅ Yechim</summary>

```python
HUJJATLAR = {
    "depozit": "Muddatli depozit yillik 18–22% foiz keltiradi.",
    "karta":   "Karta 3 ish kunida tayyorlanadi.",
    "kredit":  "Iste'mol krediti 24 oygacha beriladi.",
}

def qidir(savol):
    past = savol.lower()
    for k, v in HUJJATLAR.items():
        if k in past:
            return v
    return "Ma'lumot topilmadi."

rag = (RunnablePassthrough.assign(kontekst=lambda d: qidir(d["savol"]))
       | RunnableLambda(lambda d: f"KONTEKST: {d['kontekst']}\n"
                                  f"SAVOL: {d['savol']}"))

print(rag.invoke({"savol": "Depozit foizi qancha?"}))
print()
print(rag.invoke({"savol": "Ob-havo qanday?"}))
```

## 🏆 **42-MODULNING BUTUN NAQSHI — MODELSIZ.**

</details>

**M33.** ⭐⭐ Xatoli parallel shoxni himoyalang.

<details>
<summary>✅ Yechim</summary>

```python
p = RunnableParallel({
    "ok": RunnableLambda(lambda x: "yaxshi"),
    "xato": RunnableLambda(lambda x: 1 / 0).with_fallbacks(
        [RunnableLambda(lambda x: "❌ mavjud emas")]),
})
print(p.invoke(1))
```

</details>

**M34.** ⭐⭐⭐ To'liq kuzatuv qatlami.

<details>
<summary>✅ Yechim</summary>

```python
class ZanjirKuzatuvchi:
    def __init__(self):
        self.yozuvlar = []

    def nuqta(self, nom):
        def f(x):
            self.yozuvlar.append({"qadam": nom, "vaqt": time.perf_counter(),
                                  "tur": type(x).__name__,
                                  "uzunlik": len(str(x)),
                                  "namuna": str(x)[:40].replace("\n", " ")})
            return x
        return RunnableLambda(f)

    def hisobot(self):
        d = pd.DataFrame(self.yozuvlar)
        d["soniya"] = d.vaqt.diff().round(3)
        print(d.drop(columns=["vaqt"]).to_string(index=False))
        eng = d.iloc[1:].nlargest(1, "soniya")
        if len(eng):
            print(f"\n🐌 ENG SEKIN: {eng.iloc[0].qadam} ({eng.iloc[0].soniya}s)")

k = ZanjirKuzatuvchi()
z = (k.nuqta("boshlanish")
     | RunnableLambda(lambda s: s.split()) | k.nuqta("bo'lindi")
     | RunnableLambda(lambda w: [x.upper() for x in w]) | k.nuqta("katta")
     | RunnableLambda(" ".join) | k.nuqta("yig'ildi"))
print("natija:", z.invoke("salom dunyo"))
k.hisobot()
```

</details>

**M35.** ⭐⭐⭐ Ishlab chiqarishga tayyor zanjir.

<details>
<summary>✅ Yechim</summary>

```python
def ishonchli_zanjir(shablon, asosiy_chat, zaxira_chat, parser,
                     urinish=3, max_concurrency=5):
    asosiy = (shablon
              | asosiy_chat.with_retry(stop_after_attempt=urinish,
                                       wait_exponential_jitter=True)
              | parser)
    zaxira = shablon | zaxira_chat.with_retry(stop_after_attempt=2) | parser
    return (asosiy.with_fallbacks([zaxira])
            .with_config({"max_concurrency": max_concurrency,
                          "run_name": "ishonchli_zanjir"}))
```

## 🏆 **UCHTA HIMOYA:** `retry` · `fallbacks` · `max_concurrency`.

</details>

**M36.** ⭐⭐⭐ Zanjir hujjatlovchisi.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path

def zanjirlarni_hujjatla(zanjirlar, fayl="ZANJIRLAR.md"):
    q = ["# Loyiha zanjirlari\n"]
    for nom, z in zanjirlar.items():
        g = z.get_graph()
        q += [f"## {nom}\n",
              f"- qadamlar: **{len(g.nodes)}**",
              f"- bog'lanishlar: **{len(g.edges)}**",
              f"- kirish: `{z.input_schema.model_json_schema().get('title')}`",
              f"- chiqish: `{z.output_schema.model_json_schema().get('title')}`\n",
              "```mermaid", g.draw_mermaid(), "```\n"]
    Path(fayl).write_text("\n".join(q), encoding="utf-8")
    print(f"✅ {fayl} yozildi ({len(zanjirlar)} zanjir)")
```

## 🏆 **KOD O'ZGARSA — HUJJAT HAM O'ZGARADI.**

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
