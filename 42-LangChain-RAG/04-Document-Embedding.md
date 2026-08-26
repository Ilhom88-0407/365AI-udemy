# 4-dars. Hujjat embeddingi ⭐⭐

## 🎬 Boshlashdan oldin

> **"Matnni embedding qilish — til modeli uni VEKTORGA aylantirib, uning semantik ma'nosini RAQAMLI formatda ushlab qolish jarayoni."**

---

## 1. G'oya

```
"star"     →  [0.12, -0.45, 0.88, ...]   ┐
"sun"      →  [0.14, -0.41, 0.85, ...]   ┘ YAQIN

"spaghetti" →  [-0.72, 0.33, 0.05, ...]  ┐
"bolognese" →  [-0.69, 0.35, 0.02, ...]  ┘ YAQIN

star ↔ spaghetti  →  UZOQ
```

---

## 2. Kosinus o'xshashligi

> **"Ikki vektorning skalyar ko'paytmasi geometrik jihatdan ularning modullari va orasidagi burchak kosinusining ko'paytmasi orqali hisoblanadi."**

```
cos(θ) = (A · B) / (|A| × |B|)
```

| Burchak | `cos` | Ma'nosi |
|---:|---:|---|
| 0° | ## **1.00** | ## **aynan bir xil** |
| 30° | 0.87 | juda yaqin |
| 45° | 0.70 | yaqin |
| 60° | 0.50 | o'rtacha |
| 90° | ## **0.00** | ## **bog'liq emas** |

> **"OpenAI'ning tavsiya etilgan embedding funksiyasi vektorlarni UZUNLIGI BIRGA normallashtiradi. Bu shuni anglatadiki, tenglamaning o'ng tomonidagi maxraj birga aylanadi."**

> ## ⚠️⚠️ **BU FAQAT OPENAI UCHUN TO'G'RI — VA BIZ BUNI O'LCHADIK.**

---

## 3. 💥 Mahalliy embedding NORMALLASHTIRILMAGAN

```python
from langchain_huggingface import HuggingFaceEmbeddings
import numpy as np

emb = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

v = emb.embed_query("test")
print("o'lcham:", len(v))
print("norma  :", round(float(np.linalg.norm(v)), 4))
```

```
o'lcham: 384
norma  : 5.8556          ← ⚠️ 1.0 EMAS!
```

> ## 💥💥 **NORMA 5.86 — YA'NI `np.dot(a, b)` KOSINUS EMAS.**
>
> Agar siz kursning kodini *(`np.dot`)* mahalliy embedding bilan ishlatsangiz — **ma'nosiz raqamlar** olasiz.
>
> ## ✅ **TO'G'RISI — DOIM NORMAGA BO'LING:**
> ```python
> def kosinus(a, b):
>     a, b = np.array(a), np.array(b)
>     return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
> ```
>
> ## 🔑 **BU FUNKSIYA HAR DOIM TO'G'RI ISHLAYDI** — normallashtirilgan embeddinglarda ham *(maxraj 1 bo'ladi)*, normallashtirilmaganda ham.

---

## 4. 🔬 Kursning misolini SINAB KO'RDIK

```python
JUFT = [("star", "sun"), ("spaghetti", "bolognese"), ("star", "spaghetti"),
        ("ice cream", "sorbet"), ("sun", "sorbet")]
for a, b in JUFT:
    print(f"  {a:12s} ↔ {b:12s}  cos = {kosinus(emb.embed_query(a), emb.embed_query(b)):.4f}")
```

```
  star         ↔ sun           cos = 0.5030     ✅
  spaghetti    ↔ bolognese     cos = 0.4833     ✅
  star         ↔ spaghetti     cos = 0.2106     ✅ eng past — to'g'ri
  ice cream    ↔ sorbet        cos = 0.2432     ❌ kutilgandan PAST
  sun          ↔ sorbet        cos = 0.4500     ❌ kutilgandan YUQORI
```

> ## ✅ **KURSNING ASOSIY DA'VOSI TASDIQLANDI:**
> ```
> star ↔ sun (0.5030)  >  star ↔ spaghetti (0.2106)      ⭐ 2.4×
> ```

> ## 💥 **LEKIN IKKITA JUFTLIK KUTILGANDAN BOSHQACHA:**
> ```
> ice cream ↔ sorbet  =  0.2432    ← kurs "yaqin" deydi
> sun       ↔ sorbet  =  0.4500    ← kurs "uzoq" deydi
> ```
>
> ## 🔬 **NIMA UCHUN?**
> ```
> ① Model KICHIK (384 o'lcham, ~120M parametr)
>    OpenAI'niki 1536 o'lcham — ANCHA nozikroq
> ② "sorbet" — NOYOB so'z, model uni yomon biladi
> ③ "sun" va "sorbet" — ikkalasi ham "s" bilan boshlanadi va QISQA
>    →  kichik modellarda SHAKL semantikaga aralashadi
> ```
>
> ## 🔑 **HALOL XULOSA:** kursning **intuitsiyasi to'g'ri**, lekin **kichik model** uni **to'liq** ko'rsata olmadi. Katta embedding modeli **aniqroq** natija beradi.
>
> ## 💡 **VA BU — AMALIY SABOQ:** embedding modelini **tanlashdan oldin** uni **o'z ma'lumotingizda sinang**.

---

## 5. 🇺🇿🇺🇿 O'ZBEKCHA — o'lchandi

```python
UZ = [("mushuk", "it"), ("mushuk", "avtomobil"), ("bank", "kredit"),
      ("bank", "osmon"), ("cat", "mushuk")]
for a, b in UZ:
    print(f"  {a:12s} ↔ {b:12s}  cos = {kosinus(emb.embed_query(a), emb.embed_query(b)):.4f}")
```

```
  mushuk       ↔ it            cos = 0.4903     ✅ ikkalasi ham hayvon
  mushuk       ↔ avtomobil     cos = 0.3155     ✅ pastroq — to'g'ri
  bank         ↔ kredit        cos = 0.6898     ✅✅ ENG YUQORI — a'lo!
  bank         ↔ osmon         cos = 0.2180     ✅ eng past — to'g'ri
  cat          ↔ mushuk        cos = 0.2829     ❌❌ ZAIF!
```

> ## ✅✅ **O'ZBEKCHA ICHIDA — EMBEDDING YAXSHI ISHLAYDI:**
> ```
> bank ↔ kredit  (0.6898)  >>  bank ↔ osmon  (0.2180)      ⭐ 3.2×
> mushuk ↔ it    (0.4903)  >   mushuk ↔ avtomobil (0.3155) ✅
> ```
> **Bu — o'zbekcha RAG BUGUN ishlashi mumkin degani.**

> ## 💥💥 **LEKIN TILLAR ORASIDA — ZAIF:**
> ```
> cat ↔ mushuk  =  0.2829
> ```
> Bir xil ma'noli so'zlar, lekin **turli tillarda** — kosinus **past**.
>
> ## ⚠️⚠️ **AMALIY OQIBAT — JUDA MUHIM:**
> ```
> ❌ Vektor bazasida INGLIZCHA hujjatlar + O'ZBEKCHA savol
>    →  qidiruv YOMON ishlaydi
>
> ✅ Hujjatlar va savollar BIR TILDA bo'lsin
> ✅ Yoki: savolni hujjatlar tiliga TARJIMA qiling
> ```
>
> ## 💡 **33-MODULDA HAM SHU XULOSAGA KELGAN EDIK** — "gibrid yondashuv": kontekstni **bir marta** tarjima qiling.

---

## 6. ⭐ Embedding modelini tanlash

| Model | O'lcham | Narx | 🇺🇿 O'zbekcha |
|---|---:|---:|---|
| `text-embedding-3-small` | 1536 | $0.02/1M | ⚠️ **sinang** |
| `text-embedding-3-large` | 3072 | $0.13/1M | ⚠️ **sinang** |
| ## `paraphrase-multilingual-MiniLM-L12-v2` | ## **384** | ## ✅ **bepul** | ## ✅ **ishlaydi** *(o'lchandi)* |
| `paraphrase-multilingual-mpnet-base-v2` | 768 | ✅ bepul | ✅ yaxshiroq, sekinroq |

> ## 🏆 **O'ZBEKCHA LOYIHADA — MAHALLIY KO'P TILLI MODEL:**
> ```
> ✅ BEPUL
> ✅ MA'LUMOT CHIQMAYDI    ←  35-modul: bank/tibbiy uchun HAL QILUVCHI
> ✅ O'zbekcha ISHLAYDI    ←  o'lchandi: bank↔kredit 0.6898
> ⚠️ Model yuklash: 42.5s  (bir marta)
> ```

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Embedding nima?

**M2.** Kosinus 0 va 1 nimani anglatadi?

**M3.** OpenAI embeddinglari normallashtirilganmi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Matnni **semantik ma'nosini** ushlab qoluvchi **vektorga** aylantirish.

**M2.** ## `1` — **aynan bir xil**, `0` — **bog'liq emas**.

**M3.** ## ✅ **Ha** *(norma = 1)*. Mahalliy modellarniki — ## ❌ **yo'q** *(bizda 5.86)*.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Normani o'zingiz tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np
from langchain_huggingface import HuggingFaceEmbeddings

emb = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

v = emb.embed_query("test")
n = float(np.linalg.norm(v))
print(f"o'lcham {len(v)}   norma {n:.4f}")
print("✅ normallashtirilgan" if abs(n - 1) < 0.01
      else "⚠️ NORMALLASHTIRILMAGAN — dot ≠ cosine!")
```

</details>

**M5.** ⭐ To'g'ri kosinus funksiyasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
def kosinus(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# ⚠️ noto'g'ri (faqat normallashtirilgan embedding uchun)
def notogri(a, b):
    return float(np.dot(a, b))

va, vb = emb.embed_query("bank"), emb.embed_query("kredit")
print("to'g'ri  :", round(kosinus(va, vb), 4))
print("noto'g'ri:", round(notogri(va, vb), 4))
```

</details>

**M6.** ⭐⭐ O'zbekcha semantik yaqinlikni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
JUFTLAR = [("bank", "kredit"), ("bank", "osmon"),
           ("shifokor", "kasalxona"), ("shifokor", "traktor"),
           ("maktab", "o'qituvchi"), ("maktab", "kompyuter"),
           ("depozit", "foiz"), ("depozit", "futbol")]
for a, b in JUFTLAR:
    print(f"{a:12s} ↔ {b:12s}  {kosinus(emb.embed_query(a), emb.embed_query(b)):.4f}")
```

## 🔑 **BOG'LIQ JUFTLIKLAR — YUQORI, BOG'LIQ EMASLARI — PAST bo'lishi kerak.**

</details>

**M7.** ⭐⭐ Tillar orasidagi zaiflikni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
JUFT = [("cat", "mushuk"), ("bank", "bank"), ("doctor", "shifokor"),
        ("school", "maktab"), ("deposit", "depozit")]
for a, b in JUFT:
    print(f"{a:12s} ↔ {b:12s}  {kosinus(emb.embed_query(a), emb.embed_query(b)):.4f}")
```

## 💥 **AGAR BALLAR PAST BO'LSA — HUJJAT VA SAVOL BIR TILDA BO'LSIN.**

</details>

### 🔴 Qiyin

**M8.** ⭐⭐⭐ Embedding modellarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd, time

MODELLAR = [
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
]
SINOV = [("bank", "kredit", True), ("bank", "osmon", False),
         ("mushuk", "it", True), ("mushuk", "avtomobil", False),
         ("cat", "mushuk", True)]

q = []
for m in MODELLAR:
    try:
        t0 = time.perf_counter()
        e = HuggingFaceEmbeddings(model_name=m)
        yuklash = time.perf_counter() - t0
        v = e.embed_query("test")
        ballar = [(kosinus(e.embed_query(a), e.embed_query(b)), yaqin)
                  for a, b, yaqin in SINOV]
        yaqin_o = np.mean([b for b, y in ballar if y])
        uzoq_o = np.mean([b for b, y in ballar if not y])
        q.append({"model": m.split("/")[-1][:34], "o'lcham": len(v),
                  "yuklash_s": round(yuklash, 1),
                  "norma": round(float(np.linalg.norm(v)), 2),
                  "yaqin_o'rt": round(yaqin_o, 3),
                  "uzoq_o'rt": round(uzoq_o, 3),
                  "ajratish": round(yaqin_o - uzoq_o, 3)})
    except Exception as ex:
        q.append({"model": m.split("/")[-1][:34], "xato": type(ex).__name__})

print(pd.DataFrame(q).to_string(index=False))
print("\n🏆 'ajratish' USTUNI ENG MUHIMI — u qanchalik katta bo'lsa, "
      "model yaqin va uzoq juftliklarni shunchalik yaxshi AJRATADI.")
```

## 🏆 **`ajratish` = yaqin_o'rtacha − uzoq_o'rtacha.** Bu — embedding modelini **tanlashning** eng amaliy mezoni.

</details>

---

## 📌 Xulosa

```
matn  →  embedding  →  vektor  →  kosinus o'xshashligi

⚠️ OpenAI     →  norma = 1  →  np.dot = kosinus
💥 Mahalliy   →  norma = 5.86  →  ⭐ DOIM normaga BO'LING
```

| O'lchov | Natija |
|---|---|
| `star ↔ sun` vs `star ↔ spaghetti` | ## **0.5030 vs 0.2106** ✅ |
| `ice cream ↔ sorbet` | ## ❌ **0.2432** *(kutilgandan past)* |
| 🇺🇿 `bank ↔ kredit` vs `bank ↔ osmon` | ## **0.6898 vs 0.2180** ✅✅ |
| 🇺🇿 `cat ↔ mushuk` | ## 💥 **0.2829** — tillar orasi **ZAIF** |

> ## 🏆 **O'ZBEKCHA RAG BUGUN ISHLAYDI** — lekin **hujjat va savol BIR TILDA** bo'lsin.

---

⬅️ [3-dars. Yuklash va bo'laklash](03-Document-Loading-and-Splitting.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Saqlash, retrieval va generatsiya](05-Storing-Retrieval-Generation.md)
