# 2-dars. Batching — parallel bajarish ⭐

## 🎬 Boshlashdan oldin

> **"`invoke` metodidan tashqari, zanjirlar `batch` metodini ham qo'llab-quvvatlaydi."**

---

## 1. Kod

```python
chain = chat_template | chat

chain.batch([{"pet": "dog",    "breed": "shepherd"},
             {"pet": "dragon", "breed": "night fury"}])
```

---

## 2. 🔬 Tezlik farqini O'LCHADIK

Kurs `%%time` bilan taqqoslaydi, lekin **raqam bermaydi**. Biz o'lchadik:

```python
import time
from langchain_core.runnables import RunnableLambda

sekin = RunnableLambda(lambda x: (time.sleep(0.3), x * 2)[1])

t0 = time.perf_counter(); [sekin.invoke(i) for i in range(4)]
print(f"ketma-ket: {time.perf_counter()-t0:.2f}s")

t0 = time.perf_counter(); r = sekin.batch(list(range(4)))
print(f"batch    : {time.perf_counter()-t0:.2f}s  natija={r}")

t0 = time.perf_counter(); sekin.batch(list(range(4)), config={"max_concurrency": 2})
print(f"batch(2) : {time.perf_counter()-t0:.2f}s")
```

```
ketma-ket: 1.20s
batch    : 0.30s  natija=[0, 2, 4, 6]
batch(2) : 0.60s
```

> ## 🏆 **4× TEZLANISH.** `batch` so'rovlarni **parallel** yuboradi.
>
> ## ⭐ **`max_concurrency` — KURSDA YO'Q, LEKIN MUHIM:**
> ```
> batch()                        →  HAMMASI birdan  →  0.30s
> batch(max_concurrency=2)       →  2 tadan         →  0.60s
> ```

---

## 3. ⚠️⚠️ `max_concurrency` NIMA UCHUN KERAK

```
❌ 1000 ta so'rovni birdan yuborsangiz:
   → OpenAI RATE LIMIT (429 Too Many Requests)
   → butun batch SINADI
   → xotira to'lib ketadi
```

```python
r = chain.batch(sorovlar, config={"max_concurrency": 5})     # ⭐ xavfsiz
```

> ## 🔑 **AMALIY QIYMATLAR:**
> ```
> OpenAI tier 1   →  max_concurrency = 3–5
> OpenAI tier 2+  →  10–20
> Mahalliy model  →  1–2  (CPU/GPU cheklovi)
> ```

---

## 4. ⭐ `return_exceptions` — bitta xato hammani buzmasin

```python
r = chain.batch(sorovlar, return_exceptions=True)

for i, x in enumerate(r):
    if isinstance(x, Exception):
        print(f"❌ {i}: {type(x).__name__}")
    else:
        print(f"✅ {i}: {str(x)[:50]}")
```

> ## 💥 **USIZ — BITTA XATO BUTUN BATCHNI TO'XTATADI.** 100 ta so'rovdan 99 tasi muvaffaqiyatli bo'lsa ham — **hech nima olmaysiz**.
>
> ## 🏆 **BU — KURSDA YO'Q, LEKIN ISHLAB CHIQARISHDA MAJBURIY.**

---

## 5. ⭐ `batch_as_completed` — tayyor bo'lganini darhol olish

```python
for i, natija in chain.batch_as_completed(sorovlar):
    print(f"[{i}] tayyor: {str(natija)[:50]}")
```

> ## 💡 **`batch` HAMMASINI KUTADI.** `batch_as_completed` — **har biri tayyor bo'lishi bilan** beradi. Uzun so'rovlar bo'lganda **foydalanuvchi tezroq natija ko'radi**.

---

## 6. `abatch` — async

```python
import asyncio

async def main():
    r = await chain.abatch(sorovlar, config={"max_concurrency": 5})
    return r

r = asyncio.run(main())
```

> ## 🔑 **HAR `Runnable` DA `a` PREFIKSLI ASYNC VERSIYASI BOR:**
> ```
> invoke  →  ainvoke
> batch   →  abatch
> stream  →  astream
> ```
> ## 💡 **Web-server** *(FastAPI)* ichida — **`a` versiyalarini** ishlating.

---

## 7. 💰 Batch narxi — TEJAMAYDI

> ## ⚠️ **MUHIM NOZIKLIK:**
> ```
> batch  →  TEZLIK tejaydi  ✅
> batch  →  NARX tejamaydi  ❌
> ```
> Har so'rov **alohida** hisoblanadi. 10 ta so'rov — **10× narx**, `batch` bo'lsa ham.

> ## ⭐ **NARX TEJASH — BOSHQA YO'L: OpenAI Batch API** *(24 soat ichida, **50% arzon**)*. Bu — LangChain'ning `batch()` **emas**, OpenAI'ning **alohida** xizmati.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `batch` nima qiladi?

**M2.** `max_concurrency` nima uchun?

**M3.** `batch` narxni tejaydimi?

<details>
<summary>✅ Javoblar</summary>

**M1.** So'rovlarni **parallel** yuboradi. Bizda **4× tezlanish**.

**M2.** ## **Rate limit** dan himoya va xotira nazorati.

**M3.** ## ❌ **Yo'q** — faqat **tezlik**. Har so'rov alohida hisoblanadi.

</details>

### 🟡 O'rta

**M4.** ⭐ Tezlikni o'zingiz o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time
from langchain_core.runnables import RunnableLambda

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

**M5.** ⭐⭐ `return_exceptions` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
xatoli = RunnableLambda(lambda x: 1 / x)          # x=0 da xato

print("--- return_exceptions=False ---")
try:
    xatoli.batch([1, 2, 0, 4])
except Exception as e:
    print("💥 BUTUN BATCH SINDI:", type(e).__name__)

print("\n--- return_exceptions=True ---")
for i, r in enumerate(xatoli.batch([1, 2, 0, 4], return_exceptions=True)):
    print(f"  [{i}] {'❌ ' + type(r).__name__ if isinstance(r, Exception) else r}")
```

## 🏆 **99 ta muvaffaqiyatli natijani BITTA xato tufayli yo'qotmang.**

</details>

**M6.** ⭐ `batch_as_completed` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import time, random
tasodifiy = RunnableLambda(
    lambda x: (time.sleep(random.uniform(0.1, 0.6)), x)[1])

t0 = time.perf_counter()
for i, r in tasodifiy.batch_as_completed(list(range(5))):
    print(f"[{i}] {time.perf_counter()-t0:.2f}s da tayyor")
```

## 💡 **TARTIB — TUGASH TARTIBI**, kirish tartibi emas. Shuning uchun **indeks** `i` ham qaytariladi.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Xavfsiz batch o'rovchisi.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

def xavfsiz_batch(chain, sorovlar, max_concurrency=5, urinish=2):
    """Xatolarni ajratadi va faqat ULARNI qayta uradi."""
    natija = [None] * len(sorovlar)
    qoldiq = list(range(len(sorovlar)))

    for u in range(urinish):
        if not qoldiq:
            break
        r = chain.batch([sorovlar[i] for i in qoldiq],
                        config={"max_concurrency": max_concurrency},
                        return_exceptions=True)
        yangi_qoldiq = []
        for idx, x in zip(qoldiq, r):
            if isinstance(x, Exception):
                yangi_qoldiq.append(idx)
                natija[idx] = x
            else:
                natija[idx] = x
        if yangi_qoldiq:
            print(f"urinish {u+1}: {len(yangi_qoldiq)} ta xato qoldi")
        qoldiq = yangi_qoldiq

    ok = sum(1 for x in natija if not isinstance(x, Exception))
    print(f"\n{ok}/{len(sorovlar)} muvaffaqiyat ({ok/len(sorovlar):.0%})")
    return natija
```

## 🏆 **FAQAT XATOLARNI QAYTA URADI** — muvaffaqiyatlilarni **qayta so'ramaydi** *(pul tejaydi!)*.

</details>

---

## 📌 Xulosa

```python
chain.batch(sorovlar,
            config={"max_concurrency": 5},     # ⭐ rate limit himoyasi
            return_exceptions=True)            # ⭐ bitta xato hammani buzmasin

chain.batch_as_completed(sorovlar)             # tayyor bo'lganini DARHOL
await chain.abatch(sorovlar)                   # async
```

```
ketma-ket: 1.20s   →   batch: 0.30s      ⭐ 4× tez
⚠️ NARX BIR XIL — batch faqat TEZLIK tejaydi
```

---

⬅️ [1-dars. Prompt, model, parser](01-Piping-Prompt-Model-Parser.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Streaming](03-Streaming.md)
