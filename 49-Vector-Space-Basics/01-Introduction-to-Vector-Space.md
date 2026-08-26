# 1-dars. Vektor fazosiga kirish ⭐

## 🎬 Boshlashdan oldin

> **"Vektor fazosi — vektorlar yashaydigan abstrakt matematik tuzilma. Vektor bazasi kontekstida ular MA'LUMOT TASHUVCHILARI ham hisoblanadi, har o'lcham ma'lumotning bir XUSUSIYATINI anglatadi."**

---

## 1. Vektor fazosi nima?

```
Vektor fazosi = elementlari (vektorlar) QO'SHILADIGAN va
                SONGA KO'PAYTIRILADIGAN to'plam
```

```python
import numpy as np

a = np.array([3., 4.])
b = np.array([1., 2.])

print("qo'shish     :", a + b)          # [4. 6.]
print("ko'paytirish :", 2 * a)          # [6. 8.]
print("ayirish      :", a - b)          # [2. 2.]
print("magnituda    :", np.linalg.norm(a))    # 5.0
```

> ## 🔑 **VA AYNAN SHU IKKI XUSUSIYAT VEKTOR BAZASINI MUMKIN QILADI:**
> ```
> Qo'shish       →  vektorlarni birlashtirish (masalan, o'rtacha topish)
> Ko'paytirish   →  ⭐ OG'IRLIK berish (51-modulda ishlatamiz)
> ```

---

## 2. ⭐ Kursning galereya misoli

> **"Har rasm — shunchaki tasvir emas, ko'p o'lchamli fazoda ushlangan xususiyatlar majmuasi."**

| Rasm | Rassom | Davr | Uslub | Mavzu |
|---|---|---|---|---|
| Mona Lisa | Da Vinchi | Uyg'onish | Sfumato | Ayol portreti |
| Lady with an Ermine | Da Vinchi | Uyg'onish | Sfumato | Ayol portreti |
| Girl with a Pearl Earring | Vermeer | Golland oltin asri | Tronie | Ayol portreti |

```
Mona Lisa  ↔  Lady with an Ermine   →  ⭐ JUDA yaqin (rassom, davr, uslub, mavzu)
Mona Lisa  ↔  Girl with a Pearl     →  yaqin (mavzu bir xil, qolgani boshqa)
Mona Lisa  ↔  zamonaviy abstraksiya →  uzoq
```

> ## 🏆 **KALIT G'OYA:** bu xususiyatlarni **raqamlarga aylantiramiz**, keyin **masofani o'lchaymiz**.

### 🔬 Buni haqiqiy embedding bilan sinaymiz

```python
from sentence_transformers import SentenceTransformer
import numpy as np, pandas as pd

model = SentenceTransformer("all-MiniLM-L6-v2")

RASMLAR = {
    "Mona Lisa": "Renaissance portrait of a woman by Leonardo da Vinci, "
                 "sfumato technique, mysterious smile",
    "Lady with an Ermine": "Renaissance portrait of a woman by Leonardo "
                           "da Vinci, sfumato technique, holding an animal",
    "Girl with a Pearl Earring": "Dutch Golden Age portrait of a girl by "
                                 "Johannes Vermeer, tronie, pearl earring",
    "The Starry Night": "Post-impressionist landscape painting of a night "
                        "sky by Vincent van Gogh, swirling brushstrokes",
    "Campbell's Soup Cans": "Pop art painting of soup cans by Andy Warhol, "
                            "commercial silkscreen",
}

nomlar = list(RASMLAR)
E = model.encode(list(RASMLAR.values()))        # normallashgan
M = E @ E.T                                     # ⭐ kosinus matritsasi
print(pd.DataFrame(M.round(3), index=nomlar, columns=nomlar).to_string())
```

**Haqiqiy natija:**

```
                  Mona Lisa  Lady with Ermine  Girl w Pearl  Starry Night  Soup Cans
Mona Lisa             1.000             0.833         0.446         0.428      0.325
Lady with Ermine      0.833             1.000         0.390         0.424      0.339
Girl w Pearl          0.446             0.390         1.000         0.342      0.329
Starry Night          0.428             0.424         0.342         1.000      0.351
Soup Cans             0.325             0.339         0.329         0.351      1.000
```

> ## ✅✅ **KURSNING BUTUN INTUITSIYASI TASDIQLANDI:**
> ```
> Mona Lisa ↔ Lady with Ermine   0.833   ⭐ ENG YUQORI (bir rassom, davr, uslub)
> Mona Lisa ↔ Girl with Pearl    0.446   ✅ o'rtacha (mavzu bir xil: ayol portreti)
> Mona Lisa ↔ Starry Night       0.428   pastroq (peyzaj)
> Mona Lisa ↔ Soup Cans          0.325   ⭐ ENG PAST (pop-art)
> ```
>
> ## 🔑 **DIAGONAL — DOIM `1.000`** *(vektor o'zi bilan)*.
>
> ## 🏆 **VA MODEL RASSOM ISMINI, DAVRNI VA USLUBNI "TUSHUNDI"** — biz unga **hech qanday qoida bermagan** bo'lsak ham.

---

## 3. ⭐⭐ "O'lchamlar la'nati" — kursda YO'Q

```python
import numpy as np

rng = np.random.default_rng(365)
for o in [2, 5, 10, 50, 100, 384, 1536]:
    V = rng.normal(size=(500, o))
    V /= np.linalg.norm(V, axis=1, keepdims=True)
    M = V @ V.T
    np.fill_diagonal(M, np.nan)
    print(f"  {o:5d} o'lcham: kosinus o'rt {np.nanmean(M):+.4f} · "
          f"std {np.nanstd(M):.4f} · "
          f"maks-min {np.nanmax(M) - np.nanmin(M):.4f}")
```

```
    2 o'lcham: o'rt -0.0016 · std 0.7068 · maks-min 2.0000
    5 o'lcham: o'rt -0.0012 · std 0.4478 · maks-min 1.9894
   10 o'lcham: o'rt +0.0007 · std 0.3163 · maks-min 1.8847
   50 o'lcham: o'rt -0.0008 · std 0.1418 · maks-min 1.1256
  100 o'lcham: o'rt +0.0002 · std 0.1001 · maks-min 0.8005
  384 o'lcham: o'rt -0.0001 · std 0.0511 · maks-min 0.4523
 1536 o'lcham: o'rt -0.0000 · std 0.0256 · maks-min 0.2352
```

> ## 💥💥 **O'LCHAM OSHGANDA — TASODIFIY VEKTORLAR ORASIDAGI MASOFA DEYARLI TENGLASHADI.**
> ```
> std:  0.7068 (2 o'lcham)  →  0.0256 (1536 o'lcham)   ⭐ 28× KAMAYDI
> ```
> ```
>   2 o'lcham  →  std KATTA   →  "yaqin" va "uzoq" ANIQ farqlanadi
> 384 o'lcham  →  std KICHIK  →  hammasi DEYARLI bir xil masofada
> ```
>
> ## 🔑 **NIMA UCHUN BU MUHIM?**
> ```
> ① Yaxshi embedding model — vektorlarni KLASTERLAYDI (tasodifiy emas)
> ② Yomon embedding      →  hamma ball ~0.5 →  💥 qidiruv ISHLAMAYDI
> ③ Shuning uchun EMBEDDING MODELINI SINASH kerak (42-modul, 11-dars)
> ```
>
> ## 🏆 **TEST:** o'z ma'lumotingizda **mos** va **nomos** juftliklar ballarini o'lchang. **Farq katta bo'lsa** — model yaxshi.

### 🔬 Haqiqiy embedding va tasodifiy vektorlar — o'lchandi

```
HAQIQIY    o'rt +0.1441 · std 0.1191 · maks 1.0000 · min -0.1552
TASODIFIY  o'rt -0.0001 · std 0.0512 · maks 0.1952 · min -0.2437
```

> ## 🏆 **HAQIQIY EMBEDDINGDA:**
> ```
> std 2.3× KATTAROQ (0.1191 vs 0.0512)   →  "yaqin" va "uzoq" FARQLANADI
> maks 1.0000 (tasodifiyda atigi 0.1952) →  ⭐ HAQIQIY o'xshashlik BOR
> ```
>
> ## 💥 **AGAR SIZNING MA'LUMOTINGIZDA `std` VA `maks` TASODIFIYGA O'XSHASA — MODEL YARAMAYDI.**

---

## 4. ⭐ Vektor fazosining amaliy xususiyatlari

### ① O'rtacha vektor — "markaz"

```python
E_python = model.encode(["Machine Learning in Python",
                         "Python for Finance",
                         "Deep Learning with TensorFlow"])
markaz = E_python.mean(axis=0)
markaz /= np.linalg.norm(markaz)                # ⭐ qayta normallash SHART
```

> ## 🏆 **BU — TAVSIYA TIZIMINING ASOSI:** foydalanuvchi ko'rgan kurslarning **o'rtachasi** — uning **qiziqishlar markazi**.

### ② Ayirma — "yo'nalish"

```python
a = model.encode("Python programming")
b = model.encode("R programming")
farq = a - b                                     # ⭐ "til farqi" yo'nalishi
```

> ## 💡 **MASHHUR MISOL:** `king − man + woman ≈ queen`. Bu **word2vec** davrida ishlagan; zamonaviy jumla embeddinglarida **kamroq aniq**.

### ③ Og'irlikli birlashma

```python
# 51-modulda ishlatamiz
v = 0.6 * kurs_vektori + 0.4 * bolim_vektori
v /= np.linalg.norm(v)
```

> ## ⚠️ **HAR AMALDAN KEYIN QAYTA NORMALLASHTIRING** — aks holda `dot ≠ kosinus`.

---

## 5. 🇺🇿 Amaliy misol — o'zbekcha vektor fazosi

```python
from sentence_transformers import SentenceTransformer
import numpy as np, pandas as pd

# ⭐ KO'P TILLI model (all-MiniLM-L6-v2 o'zbekchani BILMAYDI)
m = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

SOZLAR = ["bank", "kredit", "depozit", "karta",
          "shifokor", "dori", "kasalxona",
          "osmon", "quyosh"]
E = m.encode(SOZLAR)
E = E / np.linalg.norm(E, axis=1, keepdims=True)   # ⚠️ SHART (norma 5.86)
M = E @ E.T
print(pd.DataFrame(M.round(3), index=SOZLAR, columns=SOZLAR).to_string())
```

> ## 🔑 **KUTILADIGAN NATIJA — UCH KLASTER:**
> ```
> 🏦 bank · kredit · depozit · karta
> 🏥 shifokor · dori · kasalxona
> 🌤️ osmon · quyosh
> ```
> ## 💥 **AGAR KLASTERLAR AJRALMASA — MODEL SIZNING MA'LUMOTINGIZ UCHUN YAROQSIZ.**
>
> ## ⚠️ **VA ESLATMA:** bu modelda norma **5.8556** *(42-modul)* — **normallashtirish SHART**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Vektor fazosining ikki asosiy amali?

**M2.** Vektor magnitudasi qanday hisoblanadi?

**M3.** Nima uchun har o'lcham "xususiyat" deyiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Qo'shish** va **songa ko'paytirish**.

**M2.** ## `sqrt(x₁² + x₂² + ... + xₙ²)` — `np.linalg.norm(v)`.

**M3.** Chunki u ma'lumotning **bir jihatini** kodlaydi *(o'rgangan, inson uchun tushunarsiz)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Galereya misolini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
nomlar = list(RASMLAR)
E = model.encode(list(RASMLAR.values()))
M = E @ E.T
d = pd.DataFrame(M.round(3), index=nomlar, columns=nomlar)
print(d.to_string())

M2 = M.copy()
np.fill_diagonal(M2, np.nan)                    # ⭐ nan — argmin ni buzmaydi
i, j = np.unravel_index(np.nanargmax(M2), M2.shape)
print(f"\n🏆 ENG O'XSHASH: {nomlar[i]} ↔ {nomlar[j]}  ({M2[i,j]:.4f})")
i, j = np.unravel_index(np.nanargmin(M2), M2.shape)
print(f"💥 ENG UZOQ    : {nomlar[i]} ↔ {nomlar[j]}  ({M2[i,j]:.4f})")
```

```
🏆 ENG O'XSHASH: Mona Lisa ↔ Lady with Ermine  (0.8331)
💥 ENG UZOQ    : Mona Lisa ↔ Soup Cans          (0.3251)
```

## ⚠️ **`np.fill_diagonal(M, -1)` ISHLATMANG** — `argmin` **diagonalning o'zini** topadi. `np.nan` + `nanargmin` **to'g'ri**.

</details>

**M5.** ⭐⭐ O'lchamlar la'natini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd

rng = np.random.default_rng(365)
q = []
for o in [2, 5, 10, 50, 100, 384, 1536]:
    V = rng.normal(size=(500, o))
    V /= np.linalg.norm(V, axis=1, keepdims=True)
    M = V @ V.T
    np.fill_diagonal(M, np.nan)
    q.append({"o'lcham": o,
              "o'rtacha": round(float(np.nanmean(M)), 4),
              "std": round(float(np.nanstd(M)), 4),
              "maks-min": round(float(np.nanmax(M) - np.nanmin(M)), 4)})
print(pd.DataFrame(q).to_string(index=False))
print("\n💥 o'lcham oshganda std KAMAYADI → masofalar TENGLASHADI")
print("🔑 shuning uchun YAXSHI embedding model — vektorlarni KLASTERLASHI kerak")
```

</details>

**M6.** ⭐⭐ Haqiqiy va tasodifiy embedding tarqalishini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd, numpy as np

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")
matnlar = b.section_name.head(300).tolist()

# ① HAQIQIY embedding
E_real = model.encode(matnlar, show_progress_bar=False)
M_real = E_real @ E_real.T
np.fill_diagonal(M_real, np.nan)

# ② TASODIFIY vektorlar
rng = np.random.default_rng(365)
E_rand = rng.normal(size=E_real.shape)
E_rand /= np.linalg.norm(E_rand, axis=1, keepdims=True)
M_rand = E_rand @ E_rand.T
np.fill_diagonal(M_rand, np.nan)

for nom, M in [("HAQIQIY", M_real), ("TASODIFIY", M_rand)]:
    print(f"  {nom:10s} o'rt {np.nanmean(M):+.4f} · std {np.nanstd(M):.4f} · "
          f"maks {np.nanmax(M):.4f} · min {np.nanmin(M):.4f}")

print("\n🏆 HAQIQIY embeddingda std KATTAROQ → 'yaqin' va 'uzoq' FARQLANADI")
print("💥 Agar farq bo'lmasa — model sizning ma'lumotingiz uchun YAROQSIZ")
```

</details>

---

## 📌 Xulosa

```python
a + b          # qo'shish  →  o'rtacha, markaz
2 * a          # ko'paytirish → ⭐ OG'IRLIK
np.linalg.norm(a)    # magnituda
E @ E.T        # ⭐ kosinus matritsasi (normallashgan vektorlar uchun)
```

```
⭐ Har amaldan keyin QAYTA NORMALLASHTIRING
💥 O'lchamlar la'nati: o'lcham oshganda tasodifiy masofalar TENGLASHADI
   → yaxshi model vektorlarni KLASTERLASHI shart
🇺🇿 o'zbekcha uchun → paraphrase-multilingual-MiniLM-L12-v2 (norma 5.86!)
```

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Masofa metrikalari](02-Distance-Metrics.md)
