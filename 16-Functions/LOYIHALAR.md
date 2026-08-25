# 🚀 16-modul · Mini-loyihalar

Bu 6 ta loyiha — **funksiyalardan qurilgan dasturlar**. Har birida bitta katta funksiya emas, **bir necha kichik funksiya** bir-birini chaqiradi.

```
def ... return              ← YANGI
parametrlar, argumentlar    ← YANGI
funksiya ichida funksiya    ← YANGI
ichki funksiyalar           ← YANGI
if / elif / else            ← 15-moduldan
```

> ## 🔑 **Asosiy tamoyil: bitta funksiya — bitta vazifa.**
>
> Agar funksiya nomini "va" so'zisiz aytolmasangiz (`hisobla_va_chiqar`) — uni **ikkiga bo'ling**.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | [Modulli kalkulyator](#loyiha-1--modulli-kalkulyator) | Ko'p funksiya + validatsiya | 🟢 |
| 2 | [Chek tizimi](#loyiha-2--chek-tizimi) | Funksiyalar zanjiri | 🟡 |
| 3 | [Harorat konvertori](#loyiha-3--harorat-konvertori) | Ikki tomonlama konvertatsiya | 🟡 |
| 4 | [Baho tizimi](#loyiha-4--baho-tizimi) | Funksiya + shart + GPA | 🟡 |
| 5 | [Parol tekshiruvchi](#loyiha-5--parol-tekshiruvchi) | Ball to'plash funksiyalari | 🔴 |
| 6 | [Statistika hisoblagichi](#loyiha-6--statistika-hisoblagichi) | Ichki funksiyalar birga | 🔴 |

---

## Loyiha 1 · Modulli kalkulyator

**Vazifa:** har bir amal uchun **alohida funksiya** yozing.

<details>
<summary>💻 Yechim</summary>

```python
# ===== HAR BIR AMAL — ALOHIDA FUNKSIYA =====
def qoshish(a, b):
    return a + b

def ayirish(a, b):
    return a - b

def kopaytirish(a, b):
    return a * b

def bolish(a, b):
    if b == 0:
        return "Nolga bo'lib bo'lmaydi"
    return a / b

def daraja(a, b):
    return a ** b

# ===== HISOBOT — HAMMASINI CHAQIRADI =====
def hisobot(a, b):
    print("a =", a, "  b =", b)
    print("-" * 34)
    print("Qo'shish:      ", qoshish(a, b))
    print("Ayirish:       ", ayirish(a, b))
    print("Ko'paytirish:  ", kopaytirish(a, b))
    print("Bo'lish:       ", bolish(a, b))
    print("Daraja:        ", daraja(a, b))
    return qoshish(a, b) + ayirish(a, b)

print("Yig'indi:", hisobot(12, 4))
```

**Natija:**

```
a = 12   b = 4
----------------------------------
Qo'shish:       16
Ayirish:        8
Ko'paytirish:   48
Bo'lish:        3.0
Daraja:         20736
Yig'indi: 24
```

**Nolga bo'lishni sinang:**

```python
print(bolish(10, 0))
```

```
Nolga bo'lib bo'lmaydi
```

</details>

### 🔑 Naqsh

`bolish()` ichida **validatsiya** bor — u `ZeroDivisionError` ni **oldini oladi**. Bu — **himoyalangan funksiya** naqshi.

### ✏️ O'zgartirish

1. `bolish(10, 0)` ni `hisobot` ichida sinang.
2. `qoldiq(a, b)` va `butun_bolish(a, b)` qo'shing.
3. `ildiz(a)` qo'shing — manfiy son uchun **validatsiya** bilan.
4. `hisobot` ni **nomli argumentlar** bilan chaqiring.
5. `daraja(2, 1000)` ni sinang — natija qanday?

---

## Loyiha 2 · Chek tizimi

**Vazifa:** chekni **funksiyalar zanjiri** bilan hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== POG'ONA 1 =====
def oraliq_summa(narx, soni):
    return narx * soni

# ===== POG'ONA 2 =====
def chegirma_foizi(summa):
    if summa > 20000000:
        return 20
    elif summa > 10000000:
        return 15
    elif summa > 5000000:
        return 10
    return 0

def chegirma_summasi(summa):
    return summa * chegirma_foizi(summa) / 100

# ===== POG'ONA 3 =====
def qqs(summa):
    return summa * 0.12

# ===== POG'ONA 4 — HAMMASINI BIRLASHTIRADI =====
def yakuniy(narx, soni):
    o = oraliq_summa(narx, soni)
    c = chegirma_summasi(o)
    return o - c + qqs(o - c)

# ===== CHIQARISH =====
def chek(mahsulot, narx, soni):
    o = oraliq_summa(narx, soni)
    c = chegirma_summasi(o)
    print(mahsulot, "x", soni)
    print("-" * 36)
    print("Oraliq:    ", o)
    print("Chegirma:  ", chegirma_foizi(o), "% =", c)
    print("QQS 12%:   ", qqs(o - c))
    print("-" * 36)
    print("JAMI:      ", yakuniy(narx, soni))
    return yakuniy(narx, soni)

chek("Noutbuk", 8500000, 2)
```

**Natija:**

```
Noutbuk x 2
------------------------------------
Oraliq:     17000000
Chegirma:   15 % = 2550000.0
QQS 12%:    1734000.0
------------------------------------
JAMI:       16184000.0
```

</details>

### 🔑 Nima uchun bu yaxshi?

QQS stavkasi **12% dan 15% ga** o'zgarsa — siz **faqat `qqs()`** funksiyasini tuzatasiz. Qolgan hammasi **o'zi to'g'rilanadi**.

### ✏️ O'zgartirish

1. `soni = 1` qiling — chegirma foizi qanday o'zgaradi?
2. QQS ni `0.15` ga o'zgartiring — nechta joyni tuzatdingiz?
3. `dostavka(summa)` funksiyasini qo'shing (`> 5M` bo'lsa bepul).
4. `chek` ni **nomli argumentlar** bilan chaqiring.
5. `chegirma_foizi` ga **doimiy mijoz** bonusini qo'shing.

---

## Loyiha 3 · Harorat konvertori

**Vazifa:** uch shkalani birlashtiring va **toifani** aniqlang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== KONVERTATSIYA =====
def c_to_f(c):
    return c * 9 / 5 + 32

def f_to_c(f):
    return (f - 32) * 5 / 9

def c_to_k(c):
    return c + 273.15

# ===== TOIFA =====
def toifa(c):
    if c < 0:
        return "Muzlash"
    elif c < 15:
        return "Sovuq"
    elif c < 25:
        return "Iliq"
    elif c < 35:
        return "Issiq"
    return "Juda issiq"

# ===== JADVAL =====
def jadval(c):
    print("Selsiy:    ", c, "C")
    print("Farengeyt: ", round(c_to_f(c), 1), "F")
    print("Kelvin:    ", round(c_to_k(c), 2), "K")
    print("Toifa:     ", toifa(c))
    return toifa(c)

jadval(28)
```

**Natija:**

```
Selsiy:     28 C
Farengeyt:  82.4 F
Kelvin:     301.15 K
Toifa:      Issiq
```

</details>

### ⚠️ Qiziq tekshiruv

```python
print(f_to_c(c_to_f(28)) == 28.0)          # False !
print(round(f_to_c(c_to_f(28)), 6))        # 28.0
```

**Nima uchun?** `28 → 82.4 → 28.000000000000004`. Kasr sonlarning **aniqlik muammosi** *(12-modul, `0.1 + 0.2 != 0.3`)*.

> ## 🔑 **Qoida: kasr sonlarni `==` bilan solishtirmang — `round()` yoki farqni tekshiring.**

### ✏️ O'zgartirish

1. `jadval(-10)`, `jadval(40)` bilan sinang.
2. `k_to_c(k)` funksiyasini qo'shing.
3. `f_to_k(f)` ni **mavjud funksiyalar orqali** yozing.
4. Absolyut nol (`-273.15`) dan past haroratni **taqiqlang**.
5. Toifaga **kiyim tavsiyasini** qo'shing.

---

## Loyiha 4 · Baho tizimi

**Vazifa:** ballni foiz, harf, GPA va o'tish holatiga aylantiring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== HISOBLASH =====
def foizga(ball, maks):
    return ball / maks * 100

def harf(foiz):
    if foiz >= 90:
        return "A"
    elif foiz >= 80:
        return "B"
    elif foiz >= 70:
        return "C"
    elif foiz >= 60:
        return "D"
    return "F"

def otdimi(foiz):
    return foiz >= 60

def gpa(h):
    if h == "A":
        return 4.0
    elif h == "B":
        return 3.0
    elif h == "C":
        return 2.0
    elif h == "D":
        return 1.0
    return 0.0

# ===== HISOBOT =====
def natija(ism, ball, maks):
    f = foizga(ball, maks)
    h = harf(f)
    print("Talaba:", ism)
    print("-" * 30)
    print("Ball:    ", ball, "/", maks)
    print("Foiz:    ", round(f, 1), "%")
    print("Baho:    ", h)
    print("GPA:     ", gpa(h))
    print("O'tdimi: ", otdimi(f))
    return gpa(h)

print("Qaytdi:", natija("Ilhom", 87, 100))
```

**Natija:**

```
Talaba: Ilhom
------------------------------
Ball:     87 / 100
Foiz:     87.0 %
Baho:     B
GPA:      3.0
O'tdimi:  True
Qaytdi: 3.0
```

</details>

### 🔑 Diqqat: `otdimi()` da `if` yo'q

```python
def otdimi(foiz):
    return foiz >= 60          # ← to'g'ridan-to'g'ri bool qaytariladi
```

Bu — **`if/else` dan soddaroq**:

```python
# ❌ Ortiqcha
def otdimi(foiz):
    if foiz >= 60:
        return True
    else:
        return False
```

### ✏️ O'zgartirish

1. `natija("Ali", 45, 100)` bilan sinang.
2. `maks = 200` qiling — foiz to'g'ri hisoblanadimi?
3. `A+` bahosini qo'shing (`>= 97`, GPA `4.3`).
4. Uch talabaning **o'rtacha GPA** sini hisoblang.
5. **Validatsiya** qo'shing: `ball > maks` bo'lsa xato.

---

## Loyiha 5 · Parol tekshiruvchi

**Vazifa:** har bir mezon uchun **alohida funksiya**, keyin ularni birlashtiring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== ALOHIDA MEZONLAR =====
def uzunlik_bali(p):
    if len(p) >= 12:
        return 3
    elif len(p) >= 8:
        return 2
    elif len(p) >= 6:
        return 1
    return 0

def raqammi(belgi):
    return belgi == "0" or belgi == "1" or belgi == "2" or belgi == "3" \
        or belgi == "4" or belgi == "5" or belgi == "6" or belgi == "7" \
        or belgi == "8" or belgi == "9"

def katta_harfmi(belgi):
    return belgi == belgi.upper() and belgi != belgi.lower()

# ===== BALLARNI JAMLASH =====
def umumiy_ball(p):
    ball = uzunlik_bali(p)
    if katta_harfmi(p[0]):
        ball = ball + 1
    if raqammi(p[-1]):
        ball = ball + 1
    return ball

def daraja_nomi(ball):
    if ball >= 5:
        return "JUDA KUCHLI"
    elif ball >= 4:
        return "KUCHLI"
    elif ball >= 3:
        return "O'RTACHA"
    elif ball >= 2:
        return "ZAIF"
    return "JUDA ZAIF"

# ===== HISOBOT =====
def tekshir(p):
    b = umumiy_ball(p)
    print("Parol:", p, " (", len(p), "belgi )")
    print("-" * 34)
    print("Uzunlik bali:  ", uzunlik_bali(p), "/ 3")
    print("Bosh harf katta:", katta_harfmi(p[0]))
    print("Oxiri raqam:   ", raqammi(p[-1]))
    print("-" * 34)
    print("JAMI BALL:     ", b, "/ 5")
    print("DARAJA:        ", daraja_nomi(b))
    return b

tekshir("Uzbek2025")
```

**Natija:**

```
Parol: Uzbek2025  ( 9 belgi )
----------------------------------
Uzunlik bali:   2 / 3
Bosh harf katta: True
Oxiri raqam:    True
----------------------------------
JAMI BALL:      4 / 5
DARAJA:         KUCHLI
```

</details>

### 🔑 `katta_harfmi()` ning hiylasi

```python
return belgi == belgi.upper() and belgi != belgi.lower()
```

**Nima uchun ikkinchi shart kerak?** `"5".upper()` — bu ham `"5"`. Ikkinchi shart raqamlar va belgilarni **chetlab o'tadi**: `"5".lower()` ham `"5"`, demak `!=` **yolg'on**.

### ✏️ O'zgartirish

1. `tekshir("abc")` va `tekshir("SuperMaxfiy2025")` bilan sinang.
2. `maxsus_belgimi(belgi)` funksiyasini qo'shing (`!`, `?`, `#`).
3. `raqammi` ni **soddalashtiring** *(ilgak: `belgi in "0123456789"` — 17-modulda)*.
4. Har bir mezon uchun **✅/❌** chiqaring.
5. `tavsiya(p)` funksiyasini qo'shing — nimani yaxshilash kerakligini aytsin.

---

## Loyiha 6 · Statistika hisoblagichi

**Vazifa:** ichki funksiyalarni **birga** ishlatib to'liq statistika chiqaring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== HISOBLASH =====
def ortacha(sonlar):
    return sum(sonlar) / len(sonlar)

def tarqoqlik(sonlar):
    return max(sonlar) - min(sonlar)

def ortachadan_farq(son, sonlar):
    return abs(son - ortacha(sonlar))

def eng_uzoq(sonlar):
    o = ortacha(sonlar)
    natija = sonlar[0]
    if abs(sonlar[1] - o) > abs(natija - o):
        natija = sonlar[1]
    if abs(sonlar[2] - o) > abs(natija - o):
        natija = sonlar[2]
    if abs(sonlar[3] - o) > abs(natija - o):
        natija = sonlar[3]
    return natija

# ===== HISOBOT =====
def hisobot(sonlar):
    print("Ma'lumotlar:", sonlar)
    print("-" * 40)
    print("Soni:            ", len(sonlar))
    print("Yig'indi:        ", sum(sonlar))
    print("Eng katta:       ", max(sonlar))
    print("Eng kichik:      ", min(sonlar))
    print("O'rtacha:        ", round(ortacha(sonlar), 2))
    print("Tarqoqlik:       ", tarqoqlik(sonlar))
    print("O'rtachadan eng uzoq:", eng_uzoq(sonlar))
    return round(ortacha(sonlar), 2)

print("Qaytdi:", hisobot([15000, 42000, 8500, 31000]))
```

**Natija:**

```
Ma'lumotlar: [15000, 42000, 8500, 31000]
----------------------------------------
Soni:              4
Yig'indi:          96500
Eng katta:         42000
Eng kichik:        8500
O'rtacha:          24125.0
Tarqoqlik:         33500
O'rtachadan eng uzoq: 42000
Qaytdi: 24125.0
```

</details>

### ⚠️ `eng_uzoq()` — vaqtinchalik yechim

E'tibor bering — u **aynan 4 ta** element bilan ishlaydi. Bu **yomon dizayn**, lekin hozircha **sikllar yo'q**.

**18-modulda** buni bir necha qatorda yozasiz:

```python
def eng_uzoq(sonlar):
    o = ortacha(sonlar)
    natija = sonlar[0]
    for son in sonlar:                     # ← 18-modul
        if abs(son - o) > abs(natija - o):
            natija = son
    return natija
```

### ✏️ O'zgartirish

1. Boshqa ro'yxat bilan sinang: `[5, 5, 5, 5]`.
2. `ortachadan_farq(42000, narxlar)` ni chaqiring.
3. `median` (o'rta qiymat) funksiyasini qo'shing — 4 element uchun.
4. `foizda(son, sonlar)` — sonning umumiy yig'indidagi ulushi.
5. Bo'sh ro'yxat berilsa nima bo'ladi? **Validatsiya** qo'shing.

---

## 🏆 Yakuniy loyiha · O'z funksiyalar kutubxonangiz

```
☐ Kamida 8 ta funksiya
☐ Kamida 3 tasi BOSHQA funksiyani chaqirsin
☐ Kamida 2 tasida if / elif / else
☐ Kamida 1 tasida VALIDATSIYA
☐ Kamida 4 xil ichki funksiya (max, min, sum, len, abs, round, pow)
☐ Kamida 1 ta ko'p argumentli funksiya
☐ Kamida 1 marta NOMLI argument bilan chaqiring
☐ Har bir funksiyaga IZOH — nima qiladi
☐ Bitta funksiya — bitta vazifa
```

### G'oyalar

| Loyiha | Qanday funksiyalar |
|---|---|
| **Bank hisobi** | `qoldiq`, `yechish`, `qoshish`, `foiz`, `hisobot` |
| **Kredit kalkulyatori** | `oylik_tolov`, `umumiy_foiz`, `jadval` |
| **Fitnes tracker** | `bmi`, `kaloriya`, `suv_normasi`, `tavsiya` |
| **Do'kon** | `narx`, `chegirma`, `qqs`, `dostavka`, `chek` |
| **Geometriya** | `yuza`, `perimetr`, `hajm`, `diagonal` |
| **Matn tahlili** | `uzunlik`, `sozlar_soni`, `bosh_harflar`, `hisobot` |
| **O'yin** | `zarar`, `davolash`, `daraja`, `tajriba`, `holat` |

### Shablon

```python
# ===============================================
#   KUTUBXONA NOMI
#   Muallif: ______
# ===============================================

# ===== 1 · ASOSIY FUNKSIYALAR =====
def f1(x):
    """Nima qiladi"""
    return ...

# ===== 2 · YORDAMCHI FUNKSIYALAR =====
def f2(x):
    return f1(x) + ...

# ===== 3 · VALIDATSIYA =====
def xavfsiz(x):
    if ...:
        return "Xato: ..."
    return f2(x)

# ===== 4 · HISOBOT =====
def hisobot(x):
    print("=" * 40)
    print("Natija:", xavfsiz(x))
    print("=" * 40)
    return xavfsiz(x)

# ===== 5 · SINOV =====
hisobot(...)
```

---

## ✅ O'zingizni tekshiring

```
☐ Kod xatosiz ishladimi?
☐ Har bir funksiya BITTA vazifa bajaradimi?
☐ Funksiya nomlari ANIQ va TUSHUNARLImi?
☐ return va print ni to'g'ri joyda ishlatdimmi?
☐ Funksiyalar bir-birini chaqiradimi (takrorlash yo'qmi)?
☐ Chegaraviy holatlarni sinab ko'rdimmi? (0, manfiy, bo'sh)
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
