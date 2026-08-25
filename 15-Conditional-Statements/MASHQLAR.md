# 📝 15-modul · Barcha mashqlar

**64 ta mashq** — 6 ta bo'lim. Yechimlar `<details>` ichida: **avval o'zingiz bajaring**.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--if-operatori) | `if` operatori | 12 |
| [B](#b--else-operatori) | `else` operatori | 12 |
| [C](#c--elif-operatori) | `elif` operatori | 14 |
| [D](#d--tartib-va-mantiq) | Tartib va mantiq | 10 |
| [E](#e--boolean-qiymatlar) | Boolean qiymatlar | 8 |
| [F](#f--xatolarni-toping) | Xatolarni toping | 8 |
| | **JAMI** | **64** |

---

## A · `if` operatori

**A1.** 5 dan 2 katta bo'lsa `"The condition has been satisfied"` chiqaring. *(rasmiy)*

**A2.** `x = 10`, `y = 25`. Ikkita `if` yozing: `x > 3 and y > 13` va `x <= 3 or y <= 13`. *(rasmiy)*

**A3.** `if 5 == 15 / 3:` — nima chiqadi?

**A4.** `if 5 == 18 / 3:` — nima chiqadi? Nima uchun?

**A5.** `if 5 != 3 * 6:` — nima chiqadi?

**A6.** Yosh `18` dan katta bo'lsa `"Voyaga yetgan"` chiqaring.

**A7.** Son juft bo'lsa `"Juft son"` chiqaring.

**A8.** Son `3` ga **ham**, `5` ga **ham** bo'linsa `"FizzBuzz"` chiqaring.

**A9.** `if` blokida **uchta** qator bo'lsin.

**A10.** `if` blokidan **keyin** kod yozing — u har doim bajarilishini ko'rsating.

**A11.** Ichma-ich `if` yozing: yosh **va** pasport.

**A12.** `if False:` bloki ichiga kod yozing. Nima bo'ladi?

<details>
<summary>✅ A bo'limi yechimlari</summary>

```python
# A1
if 5 > 2:
    print("The condition has been satisfied")
# The condition has been satisfied

# A2
x = 10
y = 25
if x > 3 and y > 13:
    print('Both conditions are correct')
if x <= 3 or y <= 13:
    print('At least one of the conditions is false')
# Both conditions are correct

# A3
if 5 == 15 / 3:
    print("Hooray!")           # Hooray!

# A4
if 5 == 18 / 3:
    print("Hooray!")           # (hech narsa)
# 18/3 = 6.0,  5 != 6.0

# A5
if 5 != 3 * 6:
    print("Hooray!")           # Hooray!   ← 5 != 18

# A6
yosh = 20
if yosh > 18:
    print("Voyaga yetgan")     # Voyaga yetgan

# A7
son = 14
if son % 2 == 0:
    print("Juft son")          # Juft son

# A8
son = 15
if son % 3 == 0 and son % 5 == 0:
    print("FizzBuzz")          # FizzBuzz

# A9
n = 3725
if n > 0:
    soat = n // 3600
    daqiqa = n % 3600 // 60
    print(soat, "soat", daqiqa, "daqiqa")     # 1 soat 2 daqiqa

# A10
if False:
    print("A")
print("B")                     # B  ← DOIM bajariladi

# A11
yosh, pasport = 20, True
if yosh >= 18:
    print("Yosh bo'yicha mos")
    if pasport:
        print("Ruxsat berildi")
# Yosh bo'yicha mos
# Ruxsat berildi

# A12
if False:
    print("Hech qachon")       # (hech narsa)
```

</details>

---

## B · `else` operatori

**B1.** `x = 102`. `x > 100` bo'lsa `"A busy day"`, aks holda `"A calm day"`. *(rasmiy)*

**B2.** Xuddi shu kodni `x = 97` bilan sinang. *(rasmiy)*

**B3.** `x = 1`. Ikkita `if` bilan `"Case 1"` / `"Case 2"` chiqaring.

**B4.** Xuddi shu natijani `if/else` bilan oling.

**B5.** Yosh `>= 18` bo'lsa `"Voyaga yetgan"`, aks holda `"Voyaga yetmagan"`.

**B6.** Son juft bo'lsa `"Juft"`, aks holda `"Toq"`.

**B7.** Ikki sondan **kattasini** toping.

**B8.** Xarid `> 1 000 000` bo'lsa 15% chegirma, aks holda yo'q. Ikkala holatda ham summani chiqaring.

**B9.** Kabisa yilini `if/else` bilan aniqlang.

**B10.** `else` ni `print` ostiga chekintiring. Nima bo'ladi?

**B11.** Ikkita `if` va `if/else` farqini `x = 3` bilan ko'rsating.

**B12.** Ichma-ich `if/else` yozing — **uchta** natija chiqsin.

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1
x = 102
if x > 100:
    print("A busy day")        # A busy day
else:
    print("A calm day")

# B2
x = 97
if x > 100:
    print("A busy day")
else:
    print("A calm day")        # A calm day

# B3
x = 1
if x > 3:
    print("Case 1")
if x <= 3:
    print("Case 2")            # Case 2

# B4
x = 1
if x > 3:
    print("Case 1")
else:
    print("Case 2")            # Case 2

# B5
yosh = 16
if yosh >= 18:
    print("Voyaga yetgan")
else:
    print("Voyaga yetmagan")   # Voyaga yetmagan

# B6
son = 7
if son % 2 == 0:
    print("Juft")
else:
    print("Toq")               # Toq

# B7
a, b = 17, 42
if a > b:
    print("Kattasi:", a)
else:
    print("Kattasi:", b)       # Kattasi: 42

# B8
summa = 800000
if summa > 1000000:
    yakuniy = summa * 0.85
    print("15% chegirma qo'llandi")
else:
    yakuniy = summa
    print("Chegirma yo'q")     # Chegirma yo'q
print("Yakuniy summa:", yakuniy)     # Yakuniy summa: 800000

# B9
yil = 2024
if yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0):
    print("Kabisa yili")       # Kabisa yili
else:
    print("Oddiy yil")

# B10
# if x > 3:
#     print("Case 1")
#     else:
#         print("Case 2")
# SyntaxError: invalid syntax
# else if bilan BIR XIL ustunda bo'lishi shart

# B11
x = 3
# IKKI IF — hech narsa chiqmaydi:
if x > 3:
    print("Katta")
if x < 3:
    print("Kichik")
# IF/ELSE — DOIM natija bor:
if x > 3:
    print("Katta")
else:
    print("Katta emas")        # Katta emas

# B12
yosh, hujjat = 20, False
if yosh >= 18:
    if hujjat:
        print("Ruxsat berildi")
    else:
        print("Hujjat kerak")  # Hujjat kerak
else:
    print("Yosh yetarli emas")
```

</details>

---

## C · `elif` operatori

**C1.** `x = 200`. `> 200` → `"Big"`, `> 100 and <= 200` → `"Average"`, aks holda `"Small"`. *(rasmiy)*

**C2.** Oldingi kodga `elif` qo'shing: `>= 0 and <= 100` → `"Small"`, `< 0` → `"Negative"`. `x = 50` va `x = -50` bilan sinang. *(rasmiy)*

**C3.** `compare_to_five(10)`, `(2)`, `(5)` — uchala natijani ayting.

**C4.** Baho tizimi: `>= 90` A'lo, `>= 70` Yaxshi, `>= 50` Qoniqarli, aks holda Qoniqarsiz.

**C5.** Yosh toifasi: `< 7`, `< 18`, `< 60`, aks holda.

**C6.** Harorat: `< 0`, `< 15`, `< 30`, aks holda.

**C7.** Chegirma: `> 5M` → 20%, `> 1M` → 15%, `> 500K` → 10%, aks holda 0%.

**C8.** Fasl aniqlash: oy raqami bo'yicha.

**C9.** Sonning ishorasi: musbat, manfiy yoki nol.

**C10.** BMI toifasi: `< 18.5`, `< 25`, `< 30`, aks holda.

**C11.** Nechta `elif` yozish mumkin?

**C12.** `else` majburiymi? `else` siz misol yozing.

**C13.** Hafta kuni raqamiga qarab nomini chiqaring (1–7).

**C14.** Uchburchak turi: avval **mavjudligini**, keyin turini aniqlang.

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
# C1
x = 200
if x > 200:
    print("Big")
elif x > 100 and x <= 200:
    print("Average")           # Average
else:
    print("Small")

# C2
x = 50
if x > 200:
    print("Big")
elif x > 100 and x <= 200:
    print("Average")
elif x >= 0 and x <= 100:
    print("Small")             # Small
else:
    print("Negative")
# x = -50 bilan → Negative

# C3
def compare_to_five(y):
    if y > 5:
        return "Greater"
    elif y < 5:
        return "Less"
    else:
        return "Equal"
print(compare_to_five(10))     # Greater
print(compare_to_five(2))      # Less
print(compare_to_five(5))      # Equal

# C4
ball = 85
if ball >= 90:
    print("A'lo")
elif ball >= 70:
    print("Yaxshi")            # Yaxshi
elif ball >= 50:
    print("Qoniqarli")
else:
    print("Qoniqarsiz")

# C5
yosh = 15
if yosh < 7:
    print("Bola")
elif yosh < 18:
    print("O'smir")            # O'smir
elif yosh < 60:
    print("Katta")
else:
    print("Nafaqaxo'r")

# C6
harorat = 22
if harorat < 0:
    print("Sovuq")
elif harorat < 15:
    print("Salqin")
elif harorat < 30:
    print("Iliq")              # Iliq
else:
    print("Issiq")

# C7
summa = 2000000
if summa > 5000000:
    foiz = 20
elif summa > 1000000:
    foiz = 15
elif summa > 500000:
    foiz = 10
else:
    foiz = 0
print("Chegirma:", foiz, "%")               # Chegirma: 15 %
print("To'lov:", summa * (100 - foiz) / 100)    # To'lov: 1700000.0

# C8
oy = 4
if oy == 12 or oy == 1 or oy == 2:
    print("Qish")
elif oy == 3 or oy == 4 or oy == 5:
    print("Bahor")            # Bahor
elif oy == 6 or oy == 7 or oy == 8:
    print("Yoz")
else:
    print("Kuz")

# C9
son = -7
if son > 0:
    print("Musbat")
elif son < 0:
    print("Manfiy")           # Manfiy
else:
    print("Nol")

# C10
bmi = 23.4
if bmi < 18.5:
    print("Vazn yetishmovchiligi")
elif bmi < 25:
    print("Normal vazn")      # Normal vazn
elif bmi < 30:
    print("Ortiqcha vazn")
else:
    print("Semizlik")

# C11 — KERAK BO'LGANCHA, cheklov yo'q

# C12 — YO'Q, majburiy emas
son = 5
if son > 0:
    print("Musbat")           # Musbat
elif son < 0:
    print("Manfiy")
# else yo'q — son == 0 bo'lsa hech narsa chiqmaydi

# C13
kun = 3
if kun == 1:
    print("Dushanba")
elif kun == 2:
    print("Seshanba")
elif kun == 3:
    print("Chorshanba")       # Chorshanba
elif kun == 4:
    print("Payshanba")
elif kun == 5:
    print("Juma")
elif kun == 6:
    print("Shanba")
elif kun == 7:
    print("Yakshanba")
else:
    print("Noto'g'ri raqam")

# C14
a, b, c = 5, 5, 8
if a + b <= c or a + c <= b or b + c <= a:
    print("Bunday uchburchak MAVJUD EMAS")
elif a == b and b == c:
    print("Teng tomonli")
elif a == b or b == c or a == c:
    print("Teng yonli")       # Teng yonli
else:
    print("Turli tomonli")
```

</details>

---

## D · Tartib va mantiq

**D1.** Nima uchun bu kodda `elif y < 0` **hech qachon** bajarilmaydi? Tuzating.
```python
if y > 5:    return "Greater"
elif y < 5:  return "Less"
elif y < 0:  return "Negative"
else:        return "Equal"
```

**D2.** Baho tizimining shartlar tartibini **teskarisiga** o'zgartiring. Nima buziladi?

**D3.** Kompyuter buyruqlarni qaysi yo'nalishda o'qiydi?

**D4.** Mos shart topilganda kompyuter nima qiladi?

**D5.** Shartlarni qaysi tartibda yozish kerak?

**D6.** Yosh toifasini **teskari** tartibda (`>= 60` dan boshlab) to'g'ri yozing.

**D7.** Chegirma tizimini **eng kichikdan** boshlab yozing — ishlaydimi?

**D8.** `elif x > 100 and x <= 200` da `and x <= 200` **ortiqchami**? Nima uchun?

**D9.** Bir xil natijani `if/elif` **va** ichma-ich `if/else` bilan yozing.

**D10.** Kabisa yilini **`and`/`or` siz**, faqat `elif` bilan yozing.

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
# D1 — y=-3 uchun y<5 HAM rost, mashina u yerda TO'XTAYDI
def f(y):
    if y > 5:
        return "Greater"
    elif y < 0:                # TOR shart OLDIN
        return "Negative"
    elif y < 5:
        return "Less"
    else:
        return "Equal"
print(f(-3))       # Negative
print(f(3))        # Less

# D2 — TESKARI TARTIB
ball = 95
if ball >= 50:
    print("Qoniqarli")         # Qoniqarli  ← XATO!
elif ball >= 70:
    print("Yaxshi")            # foydasiz kod
elif ball >= 90:
    print("A'lo")              # foydasiz kod
else:
    print("Qoniqarsiz")

# D3 — YUQORIDAN PASTGA, bir vaqtda FAQAT BITTA buyruq

# D4 — natijani chop etadi va BOSHQA HECH QANDAY qismni bajarmaydi

# D5 — ENG TOR shart ENG OLDIN, ENG KENG shart ENG OXIRIDA

# D6
yosh = 15
if yosh >= 60:
    print("Nafaqaxo'r")
elif yosh >= 18:
    print("Katta")
elif yosh >= 7:
    print("O'smir")            # O'smir
else:
    print("Bola")

# D7 — HA, ishlaydi, lekin shartlar TESKARI bo'lishi kerak
summa = 2000000
if summa <= 500000:
    foiz = 0
elif summa <= 1000000:
    foiz = 10
elif summa <= 5000000:
    foiz = 15                  # ← bu ishlaydi
else:
    foiz = 20
print(foiz)                    # 15

# D8 — HA, ORTIQCHA
# elif ga yetganda x > 200 allaqachon YOLG'ON,
# ya'ni x <= 200 AVTOMATIK rost.
x = 150
if x > 200:
    print("Big")
elif x > 100:                  # `and x <= 200` KERAK EMAS
    print("Average")           # Average
else:
    print("Small")

# D9
son = -7
# if/elif bilan:
if son > 0:
    print("Musbat")
elif son < 0:
    print("Manfiy")            # Manfiy
else:
    print("Nol")
# Ichma-ich if/else bilan:
if son > 0:
    print("Musbat")
else:
    if son < 0:
        print("Manfiy")        # Manfiy
    else:
        print("Nol")
# Natija bir xil, lekin if/elif O'QISH OSONROQ

# D10
yil = 2000
if yil % 4 != 0:
    print("Oddiy yil")
elif yil % 100 != 0:
    print("Kabisa yili")
elif yil % 400 != 0:
    print("Oddiy yil")
else:
    print("Kabisa yili")       # Kabisa yili
```

</details>

---

## E · Boolean qiymatlar

**E1.** `x = 2`, `if x > 4` — qaysi blok bajariladi va nima uchun?

**E2.** `x > 4` shartining **boolean qiymatini** alohida chiqaring.

**E3.** Shartni o'zgaruvchida saqlang va `if` ichida ishlating.

**E4.** `if True:` va `if False:` — nima chiqadi?

**E5.** `bool()` bilan sinang: `0`, `1`, `-5`, `""`, `"a"`, `[]`, `[0]`.

**E6.** Bo'sh satr `if` ichida qanday ishlaydi?

**E7.** `if x:` va `if x == True:` — `x = 5` uchun farq bormi?

**E8.** Uchta shartni alohida o'zgaruvchilarga yozib, keyin birlashtiring.

<details>
<summary>✅ E bo'limi yechimlari</summary>

```python
# E1
x = 2
if x > 4:
    print("Correct")
else:
    print("Incorrect")         # Incorrect
# 2 > 4 → False → else bloki

# E2
x = 2
print(x > 4)                   # False
print(type(x > 4))             # <class 'bool'>

# E3
x = 5
katta = x > 4
if katta:
    print("Katta")             # Katta
else:
    print("Kichik")

# E4
if True:
    print("A")                 # A
if False:
    print("B")                 # (chiqmaydi)

# E5
print(bool(0))                 # False
print(bool(1))                 # True
print(bool(-5))                # True   ← manfiy ham ROST
print(bool(""))                # False
print(bool("a"))               # True
print(bool([]))                # False
print(bool([0]))               # True   ← ro'yxat BO'SH EMAS

# E6
ism = ""
if ism:
    print("Salom,", ism)
else:
    print("Ism kiritilmagan")  # Ism kiritilmagan

# E7 — HA, FARQ BOR
x = 5
print(bool(x))                 # True   ← truthy
print(x == True)               # False  ← 5 va True(=1) TENG EMAS
if x:
    print("A")                 # A
if x == True:
    print("B")                 # (chiqmaydi)

# E8
yosh, talaba, ball = 25, True, 85
yosh_ok = yosh >= 18
ball_ok = ball >= 70
natija = yosh_ok and (talaba or ball_ok)
print(yosh_ok, ball_ok, natija)          # True True True
if natija:
    print("Qabul qilindi")               # Qabul qilindi
```

</details>

---

## F · Xatolarni toping

**F1.**
```python
if 5 > 2
    print("Salom")
```

**F2.**
```python
if 5 > 2:
print("Salom")
```

**F3.**
```python
x = 5
if x = 5:
    print("Teng")
```

**F4.**
```python
x = 1
if x > 3:
    print("Case 1")
    else:
        print("Case 2")
```

**F5.**
```python
if x > 5:
    print("Katta")
elif:
    print("Kichik")
```

**F6.**
```python
if x > 5:
    print("Katta")
else x < 5:
    print("Kichik")
```

**F7.** Bu kod nima uchun **hech qachon** `"Negative"` chiqarmaydi?
```python
if y < 5:
    print("Less")
elif y < 0:
    print("Negative")
```

**F8.**
```python
x = 5
if x > 3:
print("Katta")
    print("Tugadi")
```

<details>
<summary>✅ F bo'limi yechimlari</summary>

```python
# F1 — IKKI NUQTA yo'q
if 5 > 2:
    print("Salom")             # Salom
# SyntaxError: expected ':'

# F2 — CHEKINISH yo'q
if 5 > 2:
    print("Salom")             # Salom
# IndentationError: expected an indented block after 'if' statement

# F3 — `=` biriktiradi, shart uchun `==` kerak
x = 5
if x == 5:
    print("Teng")              # Teng
# SyntaxError: invalid syntax. Maybe you meant '==' ...

# F4 — else if bilan BIR XIL ustunda
x = 1
if x > 3:
    print("Case 1")
else:
    print("Case 2")            # Case 2

# F5 — elif da SHART bo'lishi SHART
x = 3
if x > 5:
    print("Katta")
elif x < 5:
    print("Kichik")            # Kichik
# SyntaxError: invalid syntax

# F6 — else da SHART BO'LMAYDI
x = 3
if x > 5:
    print("Katta")
else:
    print("Kichik")            # Kichik
# yoki elif ishlatish kerak:
# elif x < 5:

# F7 — y < 0 bo'lganda y < 5 HAM rost, mashina u yerda TO'XTAYDI
y = -3
if y < 0:                      # TOR shartni OLDIN
    print("Negative")          # Negative
elif y < 5:
    print("Less")

# F8 — ikkala print ham CHEKINTIRILISHI kerak
x = 5
if x > 3:
    print("Katta")             # Katta
    print("Tugadi")            # Tugadi
```

</details>

---

## 🎯 O'zingizni baholang

Har bir to'g'ri javob — **1 ball**. Jami: **64**.

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **58–64** | 🏆 **A'lo** | 16-modulga o'ting |
| **49–57** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **38–48** | 🥉 **Qoniqarli** | Darslarni qayta o'qing |
| **0–37** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

### Bo'limlar bo'yicha tahlil

| Bo'lim | Ballim | Zaif bo'lsa |
|---|---|---|
| A · `if` | ___ / 12 | [1-dars](01-The-IF-Statement.md) |
| B · `else` | ___ / 12 | [2-dars](02-The-ELSE-Statement.md) |
| C · `elif` | ___ / 14 | [3-dars](03-The-ELIF-Statement.md) |
| D · Tartib | ___ / 10 | [3-dars](03-The-ELIF-Statement.md) 4–5-bo'limlar |
| E · Boolean | ___ / 8 | [4-dars](04-A-Note-on-Boolean-Values.md) |
| F · Xatolar | ___ / 8 | Barcha darslar |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
