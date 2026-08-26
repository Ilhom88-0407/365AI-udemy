# 10-dars. `@chain` dekoratori ⭐

## 🎬 Boshlashdan oldin

> **"`@chain` dekoratori funksiyani `Runnable` ga aylantiradi."**

---

## 1. Ikki yo'l — bir xil natija

```python
from langchain_core.runnables import RunnableLambda, chain

# ① RunnableLambda bilan
def find_sum(x): return sum(x)
def find_square(x): return x ** 2

chain1 = RunnableLambda(find_sum) | RunnableLambda(find_square)
print(chain1.invoke([1, 2, 5]))          # 64

# ② ⭐ @chain dekoratori bilan
@chain
def runnable_sum(x): return sum(x)

@chain
def runnable_square(x): return x ** 2

print(type(runnable_sum).__name__)       # RunnableLambda
chain2 = runnable_sum | runnable_square
print(chain2.invoke([1, 2, 5]))          # 64
```

```
RunnableLambda
64
```

> ## ✅ **`@chain` — `RunnableLambda` NING SINTAKTIK QISQARTMASI.** Turi **aynan** `RunnableLambda`.

---

## 2. ⭐ Qachon `@chain`, qachon `RunnableLambda`?

| | `@chain` | `RunnableLambda(...)` |
|---|---|---|
| Nomlangan funksiya | ## ✅ **tabiiy** | ortiqcha |
| `lambda` | ❌ ishlamaydi | ## ✅ |
| Mavjud funksiyani o'rash | ❌ *(kodini o'zgartirish kerak)* | ## ✅ |
| Kutubxona funksiyasi *(`str.strip`)* | ❌ | ## ✅ |
| Nosozlik tuzatish nomi | ## ✅ **funksiya nomi** | `Lambda` |

```python
@chain
def matnni_tozala(matn):
    """Modelning javobini tozalaydi."""
    return matn.strip().strip("`").strip()

# vs
matnni_tozala = RunnableLambda(lambda m: m.strip().strip("`").strip())
```

> ## 💡 **`@chain` NING YASHIRIN AFZALLIGI — GRAFDA NOM KO'RINADI:**
> ```python
> (runnable_sum | runnable_square).get_graph().print_ascii()
> ```
> `Lambda` o'rniga **funksiya nomi** ko'rinadi — bu **nosozlik tuzatishda** foydali.

---

## 3. ⭐⭐ Amaliy naqsh — nomlangan zanjir qadamlari

```python
from langchain_core.runnables import chain

@chain
def savolni_tozala(d):
    """Foydalanuvchi savolidan ortiqcha bo'shliq va belgilarni olib tashlaydi."""
    return {**d, "savol": " ".join(d["savol"].split())}

@chain
def javobni_tekshir(matn):
    """Javob juda uzun bo'lmasligini tekshiradi."""
    if len(matn) > 1000:
        raise ValueError(f"Javob juda uzun: {len(matn)} belgi")
    return matn

@chain
def javobni_qisqart(matn):
    """Uzun javobni birinchi 3 jumlaga qisqartiradi."""
    jumlalar = matn.split(". ")
    return ". ".join(jumlalar[:3]) + ("." if len(jumlalar) > 3 else "")

zanjir = (savolni_tozala
          | prompt
          | chat
          | StrOutputParser()
          | javobni_tekshir
          | javobni_qisqart)
```

> ## 🏆 **HAR QADAM — NOMLANGAN, HUJJATLANGAN, ALOHIDA SINALADIGAN FUNKSIYA.**
>
> ```python
> print(javobni_qisqart.invoke("Bir. Ikki. Uch. To'rt. Besh."))
> ```
> **Butun zanjirni ishga tushirmasdan** har qadamni **sinaysiz**.

---

## 4. ⚠️ `@chain` bilan `functools.wraps` muammosi

```python
@chain
def mening_funksiyam(x):
    """Hujjat satri."""
    return x

print(type(mening_funksiyam).__name__)      # RunnableLambda
# print(mening_funksiyam.__doc__)           # ⚠️ endi bu Runnable, funksiya EMAS
```

> ## ⚠️ **DEKORATORDAN KEYIN — BU ARTIQ FUNKSIYA EMAS.**
> ```
> ❌ mening_funksiyam(5)          →  TypeError (chaqirib bo'lmaydi)
> ✅ mening_funksiyam.invoke(5)
> ```
>
> ## 💡 **AGAR FUNKSIYA IKKALA HOLDA HAM KERAK BO'LSA:**
> ```python
> def mening_funksiyam(x):
>     return x
>
> mening_runnable = RunnableLambda(mening_funksiyam)    # ⭐ ikkalasi ham qoladi
> ```

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** `@chain` nima qaytaradi?

**M2.** `RunnableLambda` dan farqi?

**M3.** Dekoratordan keyin funksiyani to'g'ridan-to'g'ri chaqirish mumkinmi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **`RunnableLambda`**.

**M2.** ## **Sintaksis** — funksiya **ta'rifi ustida** yoziladi. Natija bir xil.

**M3.** ## ❌ **Yo'q** — faqat `.invoke()`.

</details>

### 🟡 O'rta

**M4.** ⭐ Ikkala usulni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnableLambda, chain

def yig(x): return sum(x)

@chain
def yig2(x): return sum(x)

a = RunnableLambda(yig)
print(type(a).__name__, type(yig2).__name__)
print(a.invoke([1, 2, 3]), yig2.invoke([1, 2, 3]))
print("yig hali funksiyami:", callable(yig))
print("yig2 funksiyami    :", callable(yig2))
```

</details>

**M5.** ⭐⭐ Nomlangan zanjir qadamlari.

<details>
<summary>✅ Yechim</summary>

```python
@chain
def tozala(s):
    """Ortiqcha bo'shliqlarni olib tashlaydi."""
    return " ".join(s.split())

@chain
def kichik(s):
    """Kichik harfga o'tkazadi."""
    return s.lower()

@chain
def sozlar(s):
    """So'zlarga bo'ladi."""
    return s.split()

z = tozala | kichik | sozlar
print(z.invoke("  Salom   DUNYO  bu   sinov  "))

# ⭐ har qadamni ALOHIDA sinash
print(tozala.invoke("  a   b  "))
print(kichik.invoke("ABC"))
```

</details>

**M6.** ⭐ Grafda nomlar ko'rinadimi?

<details>
<summary>✅ Yechim</summary>

```python
(tozala | kichik | sozlar).get_graph().print_ascii()
```

Solishtiring:

```python
(RunnableLambda(lambda s: " ".join(s.split()))
 | RunnableLambda(str.lower)).get_graph().print_ascii()
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ To'liq qayta ishlash quvurini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re
from langchain_core.runnables import chain, RunnableLambda

@chain
def kirishni_tozala(d):
    """Savoldagi ortiqcha bo'shliq va boshqaruv belgilarini olib tashlaydi."""
    s = re.sub(r"\s+", " ", d["savol"]).strip()
    if not s:
        raise ValueError("Bo'sh savol")
    return {**d, "savol": s[:500]}          # ⭐ uzunlik chegarasi

@chain
def javobni_tozala(m):
    """Markdown fence va ortiqcha bo'shliqlarni olib tashlaydi."""
    return re.sub(r"^```\w*\n|\n```$", "", m.strip()).strip()

@chain
def javobni_tekshir(m):
    """Javob bo'sh emasligini va juda uzun emasligini tekshiradi."""
    if not m:
        raise ValueError("Bo'sh javob")
    if len(m) > 2000:
        raise ValueError(f"Javob juda uzun: {len(m)}")
    return m

@chain
def uch_jumla(m):
    """Javobni uch jumlaga qisqartiradi."""
    j = [x for x in re.split(r"(?<=[.!?])\s+", m) if x]
    return " ".join(j[:3])

quvur = (kirishni_tozala | prompt | chat | StrOutputParser()
         | javobni_tozala | javobni_tekshir | uch_jumla)

# ⭐ Har qadamni MODELSIZ sinash
print(kirishni_tozala.invoke({"savol": "  Salom   dunyo  "}))
print(javobni_tozala.invoke("```\nJavob matni\n```"))
print(uch_jumla.invoke("Bir. Ikki. Uch. To'rt. Besh."))
```

## 🏆 **HAR QADAM — HUJJATLANGAN, ALOHIDA SINALADIGAN, GRAFDA NOMLANGAN.**

</details>

---

## 📌 Xulosa

```python
@chain
def mening_qadam(x):
    """Hujjat."""
    return ...

# ekvivalenti:
mening_qadam = RunnableLambda(mening_qadam_funksiya)
```

| `@chain` | `RunnableLambda` |
|---|---|
| ## nomlangan funksiya | `lambda`, kutubxona funksiyasi |
| grafda **nom** ko'rinadi | `Lambda` |
| ⚠️ funksiya **chaqirilmaydi** | ✅ asl funksiya **qoladi** |

---

⬅️ [9-dars. RunnableLambda](09-RunnableLambda.md) · 🏠 [Modul boshiga](README.md) · ➡️ [42-modul. RAG](../42-LangChain-RAG/README.md)
