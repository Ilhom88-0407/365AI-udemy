# 📝 16-modul · Barcha mashqlar

**68 ta mashq** — 6 ta bo'lim. Yechimlar `<details>` ichida: **avval o'zingiz bajaring**.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--funksiya-elon-qilish) | Funksiya e'lon qilish | 10 |
| [B](#b--parametrlar-va-return) | Parametrlar va `return` | 14 |
| [C](#c--print-va-return) | `print` va `return` | 10 |
| [D](#d--funksiya-ichida-funksiya) | Funksiya ichida funksiya | 10 |
| [E](#e--shartlar-va-funksiyalar) | Shartlar va funksiyalar | 12 |
| [F](#f--ichki-funksiyalar) | Ichki funksiyalar | 12 |
| | **JAMI** | **68** |

---

## A · Funksiya e'lon qilish

**A1.** `simple()` funksiyasini yozing — `"My first function"` chiqarsin. Uni chaqiring.

**A2.** Funksiyani **e'lon qilganda** nima chiqadi?

**A3.** `def` — buyruqmi, funksiyami, kalit so'zmi?

**A4.** `salom()` funksiyasini yozing va **uch marta** chaqiring.

**A5.** `chiziq()` — 40 ta `-` chiqarsin.

**A6.** `simple` va `simple()` farqini ko'rsating.

**A7.** Funksiya ichida **boshqa funksiyani** chaqiring.

**A8.** Xato: ikki nuqta yo'q.

**A9.** Xato: chekinish yo'q.

**A10.** Xato: funksiyani e'londan **oldin** chaqirish.

<details>
<summary>✅ A bo'limi yechimlari</summary>

```python
# A1
def simple():
    print("My first function")

simple()                        # My first function

# A2 — HECH NARSA. Funksiya faqat YARATILADI.

# A3 — KALIT SO'Z (keyword). Jupyter uni YASHIL qiladi.

# A4
def salom():
    print("Salom!")

salom(); salom(); salom()
# Salom!
# Salom!
# Salom!

# A5
def chiziq():
    print("-" * 40)

chiziq()                        # ----------------------------------------

# A6
def simple():
    print("Salom")

print(simple)                   # <function simple at 0x...>  ← obyekt
simple()                        # Salom                        ← bajarish

# A7
def chiziq():
    print("-" * 25)

def hisobot():
    chiziq()
    print("  Ma'lumotlar")
    chiziq()

hisobot()

# A8
# def simple()
#     print("Salom")
# SyntaxError: expected ':'

# A9
# def simple():
# print("Salom")
# IndentationError: expected an indented block after function definition

# A10
# simple()
# def simple(): ...
# NameError: name 'simple' is not defined
# Python YUQORIDAN PASTGA o'qiydi — avval e'lon, keyin chaqiruv
```

</details>

---

## B · Parametrlar va `return`

**B1.** Argumentini 2 ga ko'paytiruvchi funksiya. *(rasmiy)*

**B2.** Argumentini 2 ga bo'lib `float` qaytaruvchi funksiya. *(rasmiy)*

**B3.** `plus_ten(a)` yozing va `2`, `5` bilan chaqiring.

**B4.** `a` — parametrmi yoki argumentmi? `plus_ten(2)` dagi `2` -chi?

**B5.** `kvadrat(n)` — sonning kvadratini qaytarsin.

**B6.** `salomlash(ism)` — `"Salom, <ism>!"` qaytarsin.

**B7.** `qqs(summa)` — 12% QQS ni qaytarsin.

**B8.** `farengeytga(c)` — `C * 9/5 + 32`.

**B9.** `oxirgi_belgi(matn)` — oxirgi belgini qaytarsin.

**B10.** Funksiyaga **ifoda** argument sifatida bering.

**B11.** Funksiya natijasini **o'zgaruvchida saqlang** va u bilan hisob qiling.

**B12.** `plus_ten(plus_ten(0))` nima beradi?

**B13.** `return` dan **keyin** kod yozing. Bajariladimi?

**B14.** Uch parametrli `yigindi(a, b, c)` yozing.

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1
def multiplication_by_2(x):
    return x * 2
print(multiplication_by_2(7))       # 14

# B2
def division_by_2(x):
    return float(x) / 2
print(division_by_2(7))             # 3.5
# Python 3 da float() ORTIQCHA:  return x / 2   →  3.5

# B3
def plus_ten(a):
    return a + 10
print(plus_ten(2))                  # 12
print(plus_ten(5))                  # 15

# B4
# `a` — PARAMETR (e'londa)
# `2` — ARGUMENT (chaqiruvda)

# B5
def kvadrat(n):
    return n ** 2
print(kvadrat(7))                   # 49

# B6
def salomlash(ism):
    return "Salom, " + ism + "!"
print(salomlash("Ilhom"))           # Salom, Ilhom!

# B7
def qqs(summa):
    return summa * 0.12
print(qqs(1000000))                 # 120000.0

# B8
def farengeytga(c):
    return c * 9 / 5 + 32
print(farengeytga(0))               # 32.0
print(farengeytga(100))             # 212.0
print(farengeytga(37))              # 98.6

# B9
def oxirgi_belgi(matn):
    return matn[-1]
print(oxirgi_belgi("Python"))       # n

# B10
print(kvadrat(3 + 4))               # 49   ← avval 7 hisoblanadi

# B11
natija = plus_ten(2)
print(natija)                       # 12
print(natija * 2)                   # 24

# B12
print(plus_ten(plus_ten(0)))        # 20   ← 0→10→20

# B13
def test(x):
    return x * 2
    print("Bu HECH QACHON chiqmaydi")
print(test(5))                      # 10
# return funksiyani DARROV tugatadi

# B14
def yigindi(a, b, c):
    return a + b + c
print(yigindi(1, 2, 3))             # 6
```

</details>

---

## C · `print` va `return`

**C1.** `"Raised to the power of 2:"` ni chop etib, kvadratni qaytaruvchi funksiya (`result` o'zgaruvchisi bilan). *(rasmiy)*

**C2.** `return` **siz** funksiya nima qaytaradi?

**C3.** Ikkita `return` yozing. Ikkinchisi bajariladimi?

**C4.** `print` + `return` — ikkalasi ham ishlaydimi?

**C5.** `print` li funksiya natijasini saqlab, hisob qiling.

**C6.** `print` hisobga ta'sir qiladimi?

**C7.** `return` chiqishni vizuallashtiradimi?

**C8.** Oraliq qadamlarni `print` bilan kuzating.

**C9.** `print(print("Salom"))` nima chiqaradi?

**C10.** Funksiyadan nechta natija qaytariladi?

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
# C1
def exponentiation_exp_2(x):
    result = x ** 2
    print(x, "Raised to the power of 2:")
    return result

print(exponentiation_exp_2(5))
# 5 Raised to the power of 2:
# 25

# C2
def xato(n):
    result = n ** 2
print(xato(7))                      # None

# C3
def ikki_return(x):
    return "Birinchi"
    return "Ikkinchi"
print(ikki_return(5))               # Birinchi
# Ikkinchisi — O'LIK KOD

# C4
def togri(x):
    result = x + 10
    print("Outcome:")
    return result
print(togri(2))
# Outcome:
# 12

# C5
def f_print(x):
    print(x * 2)
a = f_print(5)                      # 10
print(a)                            # None
# print(a + 1)  →  TypeError: 'NoneType' and 'int'

# C6 — YO'Q, print chiqishning HISOBLANISHIGA ta'sir qilmaydi

# C7 — YO'Q, return chiqishni VIZUALLASHTIRMAYDI

# C8
def chek(narx, soni):
    oraliq = narx * soni
    print("  Oraliq:", oraliq)
    chegirma = oraliq * 0.15
    print("  Chegirma:", chegirma)
    qqs = (oraliq - chegirma) * 0.12
    print("  QQS:", qqs)
    return oraliq - chegirma + qqs
print("Jami:", chek(5000, 3))
#   Oraliq: 15000
#   Chegirma: 2250.0
#   QQS: 1530.0
# Jami: 14280.0

# C9
print(print("Salom"))
# Salom
# None
# Ichki print "Salom" ni chiqaradi va None QAYTARADI

# C10 — FAQAT BITTA
```

</details>

---

## D · Funksiya ichida funksiya

**D1.** 5 qo'shadigan va uni 3 ga ko'paytiradigan ikki funksiya. `m_by_3(5)` → `30` mi? *(rasmiy)*

**D2.** `wage(w)` va `with_bonus(w)` yozing. `wage(8)`, `with_bonus(8)` nima beradi?

**D3.** `kvadrat(n)` va `kvadrat_plus_bir(n)`.

**D4.** `qqs(s)` va `qqs_bilan(s)`.

**D5.** Uchta funksiya **zanjiri**.

**D6.** `perimetr`, `yuza` va ikkalasini ishlatadigan `hisobot`.

**D7.** Bir funksiyani **ikki marta** boshqa funksiya ichida chaqiring.

**D8.** Nima uchun `wage(w) + 50` da qavs kerak emas?

**D9.** Takrorlanuvchi kodni funksiya bilan qayta yozing.

**D10.** Funksiyani **o'z ichida** chaqirib ko'ring (to'xtash sharti bilan).

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
# D1
def plus_five(x):
    return x + 5

def m_by_3(x):
    return plus_five(x) * 3

print(m_by_3(5))                    # 30

# D2
def wage(w_hours):
    return w_hours * 25

def with_bonus(w_hours):
    return wage(w_hours) + 50

print(wage(8))                      # 200
print(with_bonus(8))                # 250
print((wage(8), with_bonus(8)))     # (200, 250)

# D3
def kvadrat(n):
    return n ** 2
def kvadrat_plus_bir(n):
    return kvadrat(n) + 1
print(kvadrat(5), kvadrat_plus_bir(5))      # 25 26

# D4
def qqs(s):
    return s * 0.12
def qqs_bilan(s):
    return s + qqs(s)
print(qqs(100000), qqs_bilan(100000))       # 12000.0 112000.0

# D5
def a(x): return x + 1
def b(x): return a(x) * 2
def c(x): return b(x) - 3
print(c(5))                         # 9

# D6
def perimetr(a, b): return 2 * (a + b)
def yuza(a, b): return a * b
def hisobot(a, b):
    return "Perimetr: " + str(perimetr(a,b)) + ", Yuza: " + str(yuza(a,b))
print(hisobot(3, 4))                # Perimetr: 14, Yuza: 12

# D7
def yigindi_kvadratlari(a, b):
    return kvadrat(a) + kvadrat(b)
print(yigindi_kvadratlari(3, 4))    # 25

# D8 — funksiya chaqiruvi ARIFMETIKADAN OLDIN bajariladi
print(wage(8) + 50)                 # 250

# D9
def qqs_bilan_narx(narx):
    return narx * 1.12
print(qqs_bilan_narx(1000))         # 1120.0
print(qqs_bilan_narx(2500))         # 2800.0000000000005
print(qqs_bilan_narx(7300))         # 8176.000000000001
# QQS stavkasi o'zgarsa — FAQAT BIR JOYNI tuzatasiz

# D10 — REKURSIYA
def sanoq(n):
    if n <= 0:
        return "Tugadi"
    print(n)
    return sanoq(n - 1)
print(sanoq(3))
# 3
# 2
# 1
# Tugadi
```

</details>

---

## E · Shartlar va funksiyalar

**E1.** `add_10(m)` — `m >= 100` bo'lsa `m + 10`, aks holda `"Save more!"`. *(ma'ruzadan)*

**E2.** `compare_the_two(x, y)` — `"Greater"` / `"Less"` / `"Equal"`. *(rasmiy)*

**E3.** `distance_from_zero(x)` — son bo'lsa `abs`, aks holda `"Not possible"`. *(rasmiy)*

**E4.** `juftmi(n)` — `"Juft"` / `"Toq"`.

**E5.** `voyaga_yetganmi(yosh)` — `True` / `False`.

**E6.** `kattasi(a, b)` — kattasini qaytarsin.

**E7.** `chipta_narxi(yosh)` — to'rt toifa.

**E8.** `bmi_toifasi(bmi)` — to'rt toifa.

**E9.** `xavfsiz_bolish(a, b)` — `b == 0` tekshiruvi bilan.

**E10.** `else` **siz** yozing — `return` ning tugatish xususiyatidan foydalanib.

**E11.** `m = m + 10` — bu tenglamami?

**E12.** Nima uchun bir funksiya `int` va `str` qaytarishi muammo?

<details>
<summary>✅ E bo'limi yechimlari</summary>

```python
# E1
def add_10(m):
    if m >= 100:
        m = m + 10
        return m
    else:
        return "Save more!"
print(add_10(110))                  # 120
print(add_10(50))                   # Save more!

# E2
def compare_the_two(x, y):
    if x > y:
        print("Greater")
    elif x < y:
        print("Less")
    else:
        print("Equal")
compare_the_two(10, 10)             # Equal
compare_the_two(20, 10)             # Greater
compare_the_two(5, 10)              # Less

# E3
def distance_from_zero(x):
    if type(x) == int or type(x) == float:
        return abs(x)
    else:
        print("Not possible")
print(distance_from_zero(-10))      # 10
print(distance_from_zero("cat"))
# Not possible
# None

# E4
def juftmi(n):
    if n % 2 == 0:
        return "Juft"
    else:
        return "Toq"
print(juftmi(14), juftmi(7))        # Juft Toq

# E5
def voyaga_yetganmi(yosh):
    if yosh >= 18:
        return True
    else:
        return False
print(voyaga_yetganmi(20))           # True
# Soddaroq:  return yosh >= 18

# E6
def kattasi(a, b):
    if a > b:
        return a
    else:
        return b
print(kattasi(17, 42))              # 42

# E7
def chipta_narxi(yosh):
    if yosh < 7:
        return 0
    elif yosh >= 60:
        return 0
    elif yosh < 18:
        return 25000
    else:
        return 50000
print(chipta_narxi(5), chipta_narxi(15), chipta_narxi(30), chipta_narxi(65))
# 0 25000 50000 0

# E8
def bmi_toifasi(bmi):
    if bmi < 18.5:
        return "Vazn yetishmovchiligi"
    elif bmi < 25:
        return "Normal vazn"
    elif bmi < 30:
        return "Ortiqcha vazn"
    else:
        return "Semizlik"
print(bmi_toifasi(23.4))            # Normal vazn

# E9
def xavfsiz_bolish(a, b):
    if b == 0:
        return "Nolga bo'lib bo'lmaydi"
    else:
        return a / b
print(xavfsiz_bolish(10, 2))        # 5.0
print(xavfsiz_bolish(10, 0))        # Nolga bo'lib bo'lmaydi

# E10
def tekshir(yosh):
    if yosh < 0:
        return "Xato: manfiy yosh"
    if yosh < 18:
        return "Voyaga yetmagan"
    return "Voyaga yetgan"
print(tekshir(-5), tekshir(15), tekshir(25))

# E11 — YO'Q, bu BIRIKTIRISH:
# o'ng tomon hisoblanadi (110+10=120), natija chapga joylanadi

# E12
b = add_10(50)
print(b * 2)        # Save more!Save more!   ← SATR takrorlandi!
# print(b + 10)     # TypeError
# Funksiya BIR XIL turdagi qiymat qaytarsa — ishonchliroq
```

</details>

---

## F · Ichki funksiyalar

**F1.** `25, 65, 890, 15` orasidan eng kattasini toping. *(rasmiy)*

**F2.** Xuddi shulardan eng kichigini toping. *(rasmiy)*

**F3.** `-100` ning mutlaq qiymati. *(rasmiy)*

**F4.** `55.5` ni yaxlitlang. *(rasmiy)*

**F5.** `35.56789` ni 3 xonagacha. *(rasmiy)*

**F6.** `[1, 5, 64, 24.5]` yig'indisi. *(rasmiy)*

**F7.** Ichki funksiya bilan `10 ** 3`. *(rasmiy)*

**F8.** `"Elephant"` da nechta belgi? *(rasmiy)*

**F9.** `round(0.5)`, `round(1.5)`, `round(2.5)`, `round(3.5)` — tushuntiring.

**F10.** `round(2.675, 2)` nima beradi? Nima uchun?

**F11.** Ro'yxatning **o'rtacha qiymatini** toping.

**F12.** Ichki funksiyalarni birga ishlatib statistika chiqaring.

<details>
<summary>✅ F bo'limi yechimlari</summary>

```python
# F1
print(max(25, 65, 890, 15))         # 890

# F2
print(min(25, 65, 890, 15))         # 15

# F3
print(abs(-100))                    # 100

# F4
print(round(55.5))                  # 56
# ⚠️ Kursda "56.0" deyilgan, lekin Python 3 da bu INT — 56
print(float(round(55.5)))           # 56.0

# F5
print(round(35.56789, 3))           # 35.568

# F6
Numbers = [1, 5, 64, 24.5]
print(sum(Numbers))                 # 94.5

# F7
print(pow(10, 3))                   # 1000

# F8
print(len("Elephant"))              # 8

# F9 — BANKIR YAXLITLASHI
print(round(0.5))                   # 0   ← 0 juft
print(round(1.5))                   # 2   ← 2 juft
print(round(2.5))                   # 2   ← 2 juft
print(round(3.5))                   # 4   ← 4 juft
# .5 ENG YAQIN JUFT songa yaxlitlanadi.
# Sabab: ko'p yaxlitlashda xatolik TO'PLANIB ketmasligi uchun.

# F10
print(round(2.675, 2))              # 2.67   ← 2.68 EMAS!
# 2.675 ikkilik sanoqda ANIQ saqlanmaydi —
# aslida 2.67499999999999982... bo'ladi, shuning uchun pastga.

# F11
narxlar = [15000, 42000, 8500, 31000]
print(round(sum(narxlar) / len(narxlar), 2))    # 24125.0

# F12
def statistika(sonlar):
    print("Elementlar soni:", len(sonlar))
    print("Eng katta:      ", max(sonlar))
    print("Eng kichik:     ", min(sonlar))
    print("Yig'indi:       ", sum(sonlar))
    print("O'rtacha:       ", round(sum(sonlar)/len(sonlar), 2))
    return max(sonlar) - min(sonlar)

print("Farq:", statistika([15000, 42000, 8500, 31000]))
# Elementlar soni: 4
# Eng katta:       42000
# Eng kichik:      8500
# Yig'indi:        96500
# O'rtacha:        24125.0
# Farq: 33500
```

</details>

---

## 🎯 O'zingizni baholang

Har bir to'g'ri javob — **1 ball**. Jami: **68**.

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **61–68** | 🏆 **A'lo** | 17-modulga o'ting |
| **51–60** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **41–50** | 🥉 **Qoniqarli** | Darslarni qayta o'qing |
| **0–40** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

### Bo'limlar bo'yicha tahlil

| Bo'lim | Ballim | Zaif bo'lsa |
|---|---|---|
| A · E'lon qilish | ___ / 10 | [1-dars](01-Defining-a-Function.md) |
| B · Parametrlar | ___ / 14 | [2-dars](02-Function-with-a-Parameter.md) |
| C · `print`/`return` | ___ / 10 | [3-dars](03-Another-Way-to-Define-a-Function.md) |
| D · Funksiya ichida funksiya | ___ / 10 | [4-dars](04-Using-a-Function-in-Another-Function.md) |
| E · Shartlar | ___ / 12 | [5-dars](05-Combining-Conditionals-and-Functions.md) |
| F · Ichki funksiyalar | ___ / 12 | [7-dars](07-Notable-Built-in-Functions.md) |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
