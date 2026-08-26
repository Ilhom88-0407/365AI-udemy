# 9-dars. `RunnableLambda` ⭐⭐

## 🎬 Boshlashdan oldin

> **"`runnable_sum = RunnableLambda(lambda x: sum(x))`"**

---

## 1. Oddiy funksiyani zanjirga qo'shish

```python
from langchain_core.runnables import RunnableLambda

find_sum = lambda x: sum(x)
find_square = lambda x: x ** 2

print(find_sum([1, 2, 5]))       # 8
print(find_square(8))            # 64
```

Bular **oddiy funksiyalar** — ularda `invoke` **yo'q**:

```python
runnable_sum = RunnableLambda(lambda x: sum(x))
runnable_square = RunnableLambda(lambda x: x ** 2)

print(runnable_sum.invoke([1, 2, 5]))       # 8
print(runnable_square.invoke(8))            # 64

chain = runnable_sum | runnable_square
print(chain.invoke([1, 2, 5]))              # 64
```

```python
chain.get_graph().print_ascii()
```

```
+-------------+
| LambdaInput |
+-------------+
       *
  +--------+
  | Lambda |
  +--------+
       *
  +--------+
  | Lambda |
  +--------+
       *
+--------------+
| LambdaOutput |
+--------------+
```

> ## 🏆 **`RunnableLambda` — LCEL'NING ENG MOSLASHUVCHAN QISMI.** U **istalgan Python funksiyasini** zanjirga qo'shadi.

---

## 2. ⭐⭐ Amaliy qo'llanmalar — kursda YO'Q

### ① Tozalash va tekshiruv

```python
tozala = RunnableLambda(lambda s: s.strip().strip("`").strip())

def tekshir(s):
    if len(s) > 500:
        raise ValueError(f"Javob juda uzun: {len(s)} belgi")
    return s

zanjir = prompt | chat | StrOutputParser() | tozala | RunnableLambda(tekshir)
```

### ② Metadatani QAYD QILISH *(40-modul muammosining yechimi)*

```python
jurnal = []

def qayd_va_matn(r):
    jurnal.append({
        "sabab": getattr(r, "response_metadata", {}).get("finish_reason"),
        "tokenlar": (getattr(r, "usage_metadata", None) or {}).get("total_tokens")})
    return r.content

zanjir = prompt | chat | RunnableLambda(qayd_va_matn)
```

> ## 🏆 **`StrOutputParser` METADATANI YO'QOTADI** *(40-modul, 1-dars)*. `RunnableLambda` bilan **ikkalasini ham** olasiz.

### ③ Shartli marshrutlash

```python
def marshrut(d):
    return qisqa_zanjir if len(d["matn"]) < 100 else uzun_zanjir

zanjir = RunnableLambda(marshrut)          # ⭐ ZANJIR qaytaradi!
```

> ## 💡 **`RunnableLambda` ICHIDA `Runnable` QAYTARSANGIZ — LANGCHAIN UNI CHAQIRADI.** Bu — **dinamik marshrutlash**.

### ④ Nosozlik tuzatish nuqtasi

```python
def kuzat(nom):
    def f(x):
        print(f"[{nom}] {type(x).__name__}: {str(x)[:80]}")
        return x
    return RunnableLambda(f)

zanjir = prompt | kuzat("prompt→chat") | chat | kuzat("chat→parser") | parser
```

> ## 🏆 **ZANJIRNING ISTALGAN JOYIGA "OYNA" QO'YASIZ** — o'rtadagi qiymatni **ko'rasiz**.

---

## 3. ⚠️ `RunnableLambda` NIMA QILA OLMAYDI

```
❌ Oqim (stream)  →  butun natijani BIR bo'lak qilib beradi
❌ Async          →  sinxron funksiya butun oqimni BLOKLAYDI
```

```python
z = ChatPromptTemplate.from_template("{q}") | RunnableLambda(
        lambda pv: pv.messages[0].content.upper())
print(list(z.stream({"q": "salom"})))
```

```
['SALOM']            ← BITTA bo'lak, oqim yo'q
```

> ## ✅ **ASYNC UCHUN — `RunnableLambda(sync_fn, afunc=async_fn)`:**
> ```python
> async def a_qayd(x):
>     await bazaga_yoz(x)
>     return x
>
> r = RunnableLambda(qayd, afunc=a_qayd)
> ```
> Usiz `ainvoke` **sinxron** funksiyani chaqiradi va **event loop'ni bloklaydi**.

---

## 4. ⚠️ Xatolar zanjirni SINDIRADI

```python
xatoli = RunnableLambda(lambda x: 1 / 0)
(prompt | chat | xatoli).invoke(kirish)      # 💥 butun zanjir sinadi
```

> ## ✅ **YECHIM — `with_fallbacks` yoki ichkarida `try`:**
> ```python
> def xavfsiz(f, zaxira=None):
>     def g(x):
>         try:
>             return f(x)
>         except Exception as e:
>             print(f"⚠️ {type(e).__name__}: {str(e)[:60]}")
>             return zaxira
>     return RunnableLambda(g)
> ```

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** `RunnableLambda` nima uchun?

**M2.** U oqim qila oladimi?

**M3.** Ichida `Runnable` qaytarsa nima bo'ladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** **Oddiy Python funksiyasini** zanjirga qo'shish.

**M2.** ## ❌ **Yo'q** — butun natijani **bitta bo'lak** qilib beradi.

**M3.** ## **LangChain uni chaqiradi** — bu **dinamik marshrutlash**.

</details>

### 🟡 O'rta

**M4.** ⭐ Modelsiz zanjir yasang.

<details>
<summary>✅ Yechim</summary>

```python
z = (RunnableLambda(str.strip)
     | RunnableLambda(str.lower)
     | RunnableLambda(str.split)
     | RunnableLambda(lambda w: {"soni": len(w), "noyob": len(set(w))}))

print(z.invoke("  Salom Dunyo salom LangChain  "))
```

</details>

**M5.** ⭐⭐ Kuzatuv nuqtasi qo'shing.

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

**M6.** ⭐⭐ Shartli marshrutlash.

<details>
<summary>✅ Yechim</summary>

```python
qisqa = RunnableLambda(lambda d: f"QISQA: {d['matn'][:20]}")
uzun  = RunnableLambda(lambda d: f"UZUN ({len(d['matn'])} belgi)")

marshrut = RunnableLambda(lambda d: qisqa if len(d["matn"]) < 30 else uzun)

print(marshrut.invoke({"matn": "salom"}))
print(marshrut.invoke({"matn": "juda uzun matn " * 10}))
```

## 🏆 **`RunnableLambda` ICHIDA `Runnable` QAYTARILDI — LANGCHAIN UNI CHAQIRDI.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Xavfsiz o'rovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
def xavfsiz(f, zaxira=None, nom=""):
    def g(x):
        try:
            return f(x)
        except Exception as e:
            print(f"⚠️ [{nom or f.__name__}] {type(e).__name__}: {str(e)[:60]}")
            return zaxira
    return RunnableLambda(g)

z = xavfsiz(lambda x: 1 / x, zaxira=float("inf"), nom="bolish")
print(z.invoke(5))       # 0.2
print(z.invoke(0))       # inf  (xato USHLANDI)
```

</details>

**M8.** ⭐⭐⭐ To'liq kuzatuv qatlami.

<details>
<summary>✅ Yechim</summary>

```python
import time, pandas as pd

class ZanjirKuzatuvchi:
    """Zanjirning har qadamini vaqt va tur bo'yicha kuzatadi."""

    def __init__(self):
        self.yozuvlar = []

    def nuqta(self, nom):
        def f(x):
            self.yozuvlar.append({
                "qadam": nom, "vaqt": time.perf_counter(),
                "tur": type(x).__name__,
                "uzunlik": len(str(x)),
                "namuna": str(x)[:50].replace("\n", " ")})
            return x
        return RunnableLambda(f)

    def hisobot(self):
        if len(self.yozuvlar) < 2:
            print("kam ma'lumot")
            return
        d = pd.DataFrame(self.yozuvlar)
        d["soniya"] = d.vaqt.diff().round(3)
        d = d.drop(columns=["vaqt"])
        print(d.to_string(index=False))
        eng = d.iloc[1:].nlargest(1, "soniya")
        if len(eng):
            print(f"\n🐌 ENG SEKIN QADAM: {eng.iloc[0].qadam} "
                  f"({eng.iloc[0].soniya}s)")
        return d

k = ZanjirKuzatuvchi()
z = (k.nuqta("boshlanish")
     | RunnableLambda(lambda s: s.split()) | k.nuqta("bo'lindi")
     | RunnableLambda(lambda w: [x.upper() for x in w]) | k.nuqta("katta harf")
     | RunnableLambda(" ".join) | k.nuqta("yig'ildi"))

print("natija:", z.invoke("salom dunyo"))
print()
k.hisobot()
```

## 🏆 **`astream_events` GA ARZON MUQOBIL** — sinxron, sodda, hech qanday paket kerak emas.

</details>

---

## 📌 Xulosa

```python
RunnableLambda(lambda x: sum(x))        # oddiy funksiya → Runnable

⭐ QO'LLANMALAR:
   ① tozalash va tekshiruv
   ② metadatani QAYD QILISH  (StrOutputParser yo'qotadigan narsani)
   ③ shartli MARSHRUTLASH    (ichida Runnable qaytaring)
   ④ nosozlik tuzatish "oynasi"

⚠️ CHEKLOVLAR:
   ❌ oqim qilmaydi
   ❌ async uchun afunc= bering
   💥 xato butun zanjirni sindiradi  →  with_fallbacks
```

---

⬅️ [8-dars. RunnableParallel'ni ulash](08-Piping-RunnableParallel.md) · 🏠 [Modul boshiga](README.md) · ➡️ [10-dars. `@chain` dekoratori](10-The-Chain-Decorator.md)
