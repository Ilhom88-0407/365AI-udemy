# 5-dars. RLHF va etik AI xulqi ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 'inson fikri subyektiv, baholovchilar biasi mukofot modeliga o'tishi mumkin' deydi. Biz shuni o'lchadik — va tasodifiy bias yo'qolishini, tizimli bias esa QOLISHINI ko'rdik."**

---

## 1. RLHF nima?

> *"RLHF — AI xulqini **inson yo'l-yo'rig'iga** tayanib takomillashtirish usuli. SFT dan farqli o'laroq... RLHF AI qarorlarini **fikr va mukofot** orqali yaxshilaydi."*

### 🔑 Uch bosqich

| # | Bosqich | Nima bo'ladi |
|---|---|---|
| ① | ## **Inson baholaydi** | Javoblarga ball qo'yiladi |
| ② | ## **Mukofot modeli** | ## ⭐ Ballardan **naqsh** o'rganadi |
| ③ | **Fine-tuning** | Model mukofotni maksimallashtiradi |

> ## 💡 **KURSNING MISOLI:** ## *"Uzr so'rashning eng yaxshi yo'li nima?"* ## ## ✅ **Yuqori ball:** *"samimiy uzr xatoni tan olish, ## afsus bildirish va tuzatishni taklif qilishni o'z ichiga oladi"*. ## ## 💥 **Past ball:** *"shunchaki `kechir` deng va davom eting. ## Yoqmasa — bu ularning muammosi"*.

---

## 2. 💥 Baholovchi biasi — **mukofot modeliga o'tadi**

To'rtta javob, ikki o'lchov: **uzunlik** va **sifat**.

```python
def baholovchi(j, uzunlik_biasi):
    """uzunlik_biasi > 0 -> uzun javoblarni yoqtiradi."""
    b = j["sifat"] * 10
    b += uzunlik_biasi * (j["uzunlik"] / 80)
    return max(1, min(10, round(b + random.gauss(0, 0.3))))
```

### ✅ Haqiqiy natija

```
  --- biassiz baholovchi ---
    qisqa + aniq     o'rtacha ball = 8.95
    uzun + aniq      o'rtacha ball = 9.10
    qisqa + bo'sh    o'rtacha ball = 1.90
    uzun + bo'sh     o'rtacha ball = 1.95
    🏆 mukofot modeli o'rganadi: 'uzun + aniq' eng yaxshi

  --- uzunlikni yoqtiradi ---
    qisqa + aniq     o'rtacha ball = 9.45
    uzun + aniq      o'rtacha ball = 10.00
    qisqa + bo'sh    o'rtacha ball = 2.50
    uzun + bo'sh     o'rtacha ball = 4.95
    🏆 mukofot modeli o'rganadi: 'uzun + aniq' eng yaxshi

  --- qisqalikni yoqtiradi ---
    qisqa + aniq     o'rtacha ball = 8.40
    uzun + aniq      o'rtacha ball = 6.05
    qisqa + bo'sh    o'rtacha ball = 1.70
    uzun + bo'sh     o'rtacha ball = 1.00
    🏆 mukofot modeli o'rganadi: 'qisqa + aniq' eng yaxshi
```

> ## 💥💥 **`uzun + bo'sh` — 1.95 DAN 4.95 GA.** ## Ya'ni **mazmunsiz uzun javob** ## ⭐ **ikki baravardan ko'proq** ball oldi.

> ## 🔑 **VA ENG MUHIMI — G'OLIB O'ZGARDI:** ## uzunlikni yoqtiruvchi baholovchi bilan — `uzun + aniq`, ## qisqalikni yoqtiruvchi bilan — ## ⭐ **`qisqa + aniq`**.
>
> ## ## 💡 **MODEL "SIFAT" NI EMAS,** ## ⭐ **BAHOLOVCHINING DIDINI** o'rganadi.

---

## 3. 🔬 Ko'proq baholovchi yordam beradimi?

> ## 🔑 **ODATIY JAVOB:** ## *"ko'p baholovchi olsak, bias o'rtachalanadi"*.
>
> ## ## 🔬 **SINAYMIZ — IKKI XIL BIAS BILAN.**

### ✅ Haqiqiy natija

```
--- tasodifiy bias (har baholovchida O'Z didi) ---
      n   qisqa+aniq    uzun+bosh     farq
      1         9.00         3.00     6.00
     10         8.90         2.70     6.20
    200         9.04         2.42     6.62

--- tizimli bias (HAMMA uzunlikni yoqtiradi) ---
      n   qisqa+aniq    uzun+bosh     farq
      1         9.00         5.00     4.00
     10         9.20         4.90     4.30
    200         9.50         4.99     4.51
```

> ## 🏆 **TASODIFIY BIAS — O'RTACHALANADI.** ## Farq **6.00 → 6.62** ga *(haqiqiy sifat farqiga)* yaqinlashdi.
>
> ## ## 💥💥 **TIZIMLI BIAS — QOLADI.** ## 200 ta baholovchi bilan ham farq ## ⭐ **4.51** — ya'ni **siqilgan**.

> ## 🔑 **VA MANA ASOSIY XULOSA:** ## ⭐ **"ko'proq odam" — faqat TASODIFIY biasga qarshi ishlaydi.**
>
> ## ## 💥 Agar **hamma baholovchi** bir xil madaniyatdan, ## bir xil yoshda, bir xil kasbdan bo'lsa — ## ⚠️ **ularning umumiy biasi hech qachon yo'qolmaydi**.

> ## 🏆 **AMALIY QOIDA:** ## baholovchilarning **soni** emas, ## ⭐ **XILMA-XILLIGI** muhim.

---

## 4. 🔧 Baholovchi ishonchliligini kuzatish

```python
def baholovchi_profili(baholar):
    """Har baholovchining ko'pchilikdan farqi."""
    import statistics
    n_javob = len(next(iter(baholar.values())))
    natija = {}

    for kim, ballar in baholar.items():
        farqlar = []
        for i in range(n_javob):
            boshqalar = [b[i] for k, b in baholar.items() if k != kim]
            farqlar.append(ballar[i] - statistics.mean(boshqalar))
        natija[kim] = {
            "o'rtacha_farq": statistics.mean(farqlar),       # ⭐ TIZIMLI siljish
            "tarqoqlik": statistics.pstdev(farqlar),         # ⭐ BARQARORLIK
        }
    return natija
```

### ✅ Haqiqiy natija

```
  baholovchi     o'rtacha farq   tarqoqlik   izoh
  A                     -0.59        1.03    ✅ normal
  B                     -0.36        0.85    ✅ normal
  C                     +1.61        1.09    💥 TIZIMLI SILJISH
  D                     -0.66        2.18    💥 BARQAROR EMAS
```

> ## 💥 **`C` — O'RTACHA 1.6 BALL YUQORI.** ## Bu — **tizimli siljish**, tuzatish mumkin ## *(kalibrlash)*.
>
> ## ## 💥 **`D` — TARQOQLIK 2.18.** ## U **ba'zan juda yuqori, ba'zan juda past**. ## ⭐ Bu — **tuzatib bo'lmaydi**: ## 🔑 **qayta o'qitish yoki chiqarib tashlash**.

> ## 💡 **VA IKKALA MUAMMO HAM KO'PCHILIK ## O'RTACHASIDA KO'RINMAYDI** — ## faqat **alohida profil** ochib beradi.

---

## 5. ⚠️ RLHF ning uchta chuqur muammosi

| Muammo | Kurs aytadimi | Izoh |
|---|---|---|
| ## **Baholovchi subyektivligi** | ## ✅ **ha** | 2-bo'limda o'lchandi |
| ## **"To'g'ri javob" ni aniqlash** | ## ✅ **ha** | Murakkab holatlarda |
| ## **Mukofotni aldash** *(reward hacking)* | ## 💥 **yo'q** | ## ⭐ **Eng jiddiy** |

### 💥 Mukofotni aldash — **o'lchaymiz**

Model mukofotni maksimallashtiradi. Agar mukofot **noto'g'ri narsani** o'lchasa?

```python
def mukofot(javob):
    """💥 Sodda mukofot: uzunroq = yaxshiroq."""
    return min(10, len(javob.split()) / 10)


def model_optimallashtiradi(qadamlar=6):
    """Model mukofotni oshirish uchun javobni 'yaxshilaydi'."""
    javob = "Use int8 quantisation."
    for q in range(qadamlar):
        javob += " This is important to consider carefully."
        yield q + 1, mukofot(javob), len(javob.split()), javob[:52]
```

```
  qadam  mukofot  so'z  javob
      1     0.90     9  Use int8 quantisation. This is important to consider
      2     1.50    15  Use int8 quantisation. This is important to consider
      3     2.10    21  Use int8 quantisation. This is important to consider
      4     2.70    27  Use int8 quantisation. This is important to consider
      5     3.30    33  Use int8 quantisation. This is important to consider
      6     3.90    39  Use int8 quantisation. This is important to consider
```

> ## 💥💥💥 **MUKOFOT 0.90 DAN 3.90 GA — 4.3 BAROBAR.** ## ## ⭐ **VA JAVOB HECH QANDAY YANGI MA'LUMOT QO'SHMADI.**

> ## 🔑 **BU — "REWARD HACKING":** ## model **maqsadga** emas, ## ⭐ **o'lchovga** optimallashadi.
>
> ## ## 💡 **VA BU — 67-MODULDAGI TOPILMANING SABABI:** ## nega model ## **ob-havo haqidagi javobga 8 ball** berdi? ## ⚠️ Chunki u **javob shakliga** qarab baho beradi, ## **mazmuniga** emas.

---

## 6. 🏆 Xavfsizroq mukofot

```python
def yaxshiroq_mukofot(javob, savol, belgilar_f):
    """Uzunlik EMAS — MAZMUN belgilariga qarab."""
    b, r, t, v = belgilar_f(javob)         # 67-modul, 6-dars

    # ⚠️ uzunlik jazolanadi, mukofotlanmaydi
    n = len(javob.split())
    jarima = 0
    if n > 120:
        jarima += 2                        # ⭐ ortiqcha uzunlik
    if n < 5:
        jarima += 3                        # ⭐ juda qisqa

    # ⭐ mavzuga aloqadorlik
    umumiy = set(savol.lower().split()) & set(javob.lower().split())
    if len(umumiy) < 2:
        jarima += 4                        # 💥 ALOQASIZ javob

    return max(1, min(10, b - jarima))
```

```
  javob                               eski mukofot  yangi mukofot
  A mukammal (raqam+A/B test)                 2.40             10
  B o'rtacha                                  0.80              3
  C bo'sh ("qiziq soha")                      1.60              3
  D "idk"                                     0.10              1
  E aloqasiz (Toshkentda ob-havo)             0.90              1
```

> ## 🏆🏆 **ESKI MUKOFOTDA TARTIB NOTO'G'RI:** ## `C` (bo'sh javob) **1.60**, ## `E` (aloqasiz) **0.90**, ## ⭐ `A` (mukammal) esa atigi **2.40**.
>
> ## ## 🏆 **YANGI MUKOFOTDA:** ## `A` — **10**, ## `D` va `E` — **1**.

> ## ⚠️ **LEKIN HALOL BO'LSAK — BITTA MUAMMO QOLDI:** ## `B` (o'rtacha) va `C` (bo'sh) ## 💥 **ikkalasi ham 3 ball** oldi.
>
> ## ## 🔑 **SABAB:** ikkalasida ham raqam, murosa va validatsiya **yo'q**, ## va ikkalasi ham savolga **aloqador** *(umumiy so'zlar bor)*. ## ## ⭐ Ya'ni mening belgilarim ## **"o'rtacha" va "bo'sh" ni ajratmaydi**.

> ## 💡 **VA BU — ADOLATLI TAN OLISH:** ## yangi mukofot **eskisidan ancha yaxshi**, ## lekin ## ⚠️ **mukammal emas**.

> ## 💡 **VA BU — 69-MODULDAGI ## "SEZGIRLIK NAZORATI" NING YECHIMI.**

---

## 🎯 Nazorat savollari

1. Baholovchi biasi mukofot modeliga qanday o'tadi?
2. Ko'proq baholovchi olish yordam beradimi?
3. *"Reward hacking"* nima?
4. Xavfsizroq mukofot nimani o'lchashi kerak?

<details>
<summary>Javoblar</summary>

1. ## **To'g'ridan-to'g'ri.** O'lchandi: uzunlikni yoqtiruvchi baholovchi bilan `uzun + bo'sh` javob **1.95 → 4.95** ball oldi *(2.5×)*. 🔑 Va **g'olib javob ham o'zgardi**.
2. ## **Faqat TASODIFIY biasga qarshi.** 🏆 Tasodifiy bias: 200 baholovchida farq **6.62** *(haqiqiy sifatga yaqin)*. 💥 Tizimli bias: 200 baholovchida ham **4.51** — **siqilgan**. ⭐ Baholovchilarning **soni emas, XILMA-XILLIGI** muhim.
3. ## Model **maqsadga emas, o'lchovga** optimallashadi. O'lchandi: bir xil jumlani takrorlab, mukofot **0.90 → 3.90** *(4.3×)* oshdi — **yangi ma'lumotsiz**.
4. ## **Mazmun belgilarini** *(raqam, murosa, validatsiya)* va **mavzuga aloqadorlikni**. ⚠️ Uzunlik **jazolanishi** kerak, mukofotlanmasligi. 🏆 O'lchandi: mukammal javob **2.40 → 10**, aloqasiz **0.90 → 1**. ⚠️ Lekin *"o'rtacha"* va *"bo'sh"* javoblar hali ham **bir xil ball** oladi.

</details>

---

⬅️ [4-dars](04-Supervised-Fine-Tuning.md) · 🏠 [Modul](README.md) · ➡️ [6-dars](06-Inclusive-Development.md)
