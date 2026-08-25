# 📝 14-modul · Barcha mashqlar

**58 ta mashq** — 5 ta bo'lim. Yechimlar `<details>` ichida: **avval o'zingiz bajaring**.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--solishtirish-operatorlari) | Solishtirish operatorlari | 14 |
| [B](#b--mantiqiy-operatorlar) | Mantiqiy operatorlar | 14 |
| [C](#c--muhimlik-tartibi) | Muhimlik tartibi | 12 |
| [D](#d--ayniyat-operatorlari) | Ayniyat operatorlari | 8 |
| [E](#e--aralash-va-xatolar) | Aralash va xatolar | 10 |
| | **JAMI** | **58** |

---

## A · Solishtirish operatorlari

**A1.** `25` ning `30` dan kichik ekanini tekshiring. *(rasmiy)*

**A2.** `5 * 3` ning `5 ** 3` dan kichik yoki tengligini tekshiring. *(rasmiy)*

**A3.** `100` ning `10 ** 2` ga tengligini tekshiring. *(rasmiy)*

**A4.** `53` ning `46` ga teng emasligini tekshiring. *(rasmiy)*

**A5.** Taxmin qiling: `7 > 7`, `7 >= 7`, `7 < 7`, `7 <= 7`.

**A6.** `2 ** 10` `1000` dan kattami?

**A7.** `"Toshkent" == "toshkent"` — natija nima? Nima uchun?

**A8.** `"apple" < "banana"` nima beradi? Satrlar qanday solishtiriladi?

**A9.** Yosh `18` dan katta yoki tengligini o'zgaruvchi bilan tekshiring.

**A10.** Ikkita narxni solishtiring va qaysi biri qimmatroq ekanini ko'rsating.

**A11.** `10 < 20 < 30` ishlaydimi? Sinang.

**A12.** `True > False` nima beradi?

**A13.** `"5" == 5` va `"5" > 5` — farqni tushuntiring.

**A14.** `0.1 + 0.2 == 0.3` nima beradi? To'g'ri tekshirish usulini toping.

<details>
<summary>✅ A bo'limi yechimlari</summary>

```python
# A1
print(25 < 30)                 # True

# A2
print(5 * 3 <= 5 ** 3)         # True   ← 15 <= 125

# A3
print(100 == 10 ** 2)          # True

# A4
print(53 != 46)                # True

# A5
print(7 > 7)                   # False  ← qat'iy katta emas
print(7 >= 7)                  # True
print(7 < 7)                   # False
print(7 <= 7)                  # True

# A6
print(2 ** 10 > 1000)          # True   ← 1024 > 1000

# A7
print("Toshkent" == "toshkent")     # False
# Python CASE SENSITIVE — katta va kichik harf FARQ qiladi

# A8
print("apple" < "banana")      # True   ← alifbo tartibi: 'a' < 'b'
print("apple" < "Banana")      # False  ← katta harflar OLDIN keladi

# A9
yosh = 20
print(yosh >= 18)              # True

# A10
narx_a, narx_b = 8500000, 6200000
print(narx_a > narx_b)         # True

# A11 — HA, "zanjirli solishtirish"
print(10 < 20 < 30)            # True   ← (10<20) and (20<30)
print(10 < 20 < 5)             # False

# A12
print(True > False)            # True   ← True=1, False=0

# A13
print("5" == 5)                # False  ← turlar mos emas → False
# print("5" > 5)               # TypeError!
# ==/!= turlar mos kelmasa ISHLAYDI, >/< esa XATO beradi

# A14
print(0.1 + 0.2 == 0.3)                  # False
print(abs(0.1 + 0.2 - 0.3) < 0.000001)   # True   ← to'g'ri usul
```

</details>

---

## B · Mantiqiy operatorlar

**B1.** `and` ning 4 ta kombinatsiyasini yozing va natijalarni tekshiring.

**B2.** `or` ning 4 ta kombinatsiyasini yozing.

**B3.** `not True` va `not False` — natijalar nima?

**B4.** `3 > 5 and 10 <= 20` nima beradi? Bosqichma-bosqich tushuntiring.

**B5.** `or` da gaplar tartibi muhimmi? Isbotlang.

**B6.** Imtihondan o'tish: nazariya **va** amaliyot topshirilgan bo'lsin.

**B7.** Chegirma: talaba **yoki** nafaqaxo'r bo'lsin.

**B8.** `not not True` nima beradi?

**B9.** Yosh `18–65` oralig'ida ekanini tekshiring (`and` bilan).

**B10.** Parol: uzunlik `>= 8` **va** birinchi harf katta.

**B11.** Hafta oxiri: kun `"Shanba"` **yoki** `"Yakshanba"`.

**B12.** `1 and 2` va `0 or 5` nima beradi? Nima uchun `True`/`False` emas?

**B13.** Harorat `-10` dan past **yoki** `40` dan yuqori bo'lsa — "xavfli".

**B14.** `and` va `or` ning haqiqat jadvallarini yoddan yozing.

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1
print(True and True)      # True
print(True and False)     # False
print(False and True)     # False
print(False and False)    # False

# B2
print(True or True)       # True
print(True or False)      # True
print(False or True)      # True
print(False or False)     # False

# B3
print(not True)           # False
print(not False)          # True

# B4
print(3 > 5 and 10 <= 20)     # False
# 3>5 → False,  10<=20 → True,  False and True → False

# B5 — YO'Q, ahamiyatsiz
print(True or False)      # True
print(False or True)      # True

# B6
nazariya, amaliyot = True, False
print(nazariya and amaliyot)      # False

# B7
talaba, nafaqaxor = True, False
print(talaba or nafaqaxor)        # True

# B8
print(not not True)       # True

# B9
yosh = 30
print(yosh >= 18 and yosh <= 65)  # True
print(18 <= yosh <= 65)           # True   ← zanjir bilan qisqaroq

# B10
parol = "Python2025"
print(len(parol) >= 8 and parol[0] == parol[0].upper())    # True

# B11
kun = "Shanba"
print(kun == "Shanba" or kun == "Yakshanba")               # True

# B12
print(1 and 2)      # 2   ← hammasi rost → OXIRGISI
print(0 or 5)       # 5   ← 0 yolg'on → keyingisi
print(0 and 5)      # 0   ← birinchi YOLG'ON qiymat
# Python and/or OPERANDNI qaytaradi, True/False emas

# B13
harorat = 45
print(harorat < -10 or harorat > 40)      # True

# B14
# and: faqat IKKALASI True → True
# or:  faqat IKKALASI False → False
```

</details>

---

## C · Muhimlik tartibi

Har birini **avval qo'lda** yeching, keyin tekshiring.

**C1.** `True and not True` *(ma'ruzadan)*

**C2.** `False or not True and True` *(ma'ruzadan)*

**C3.** `True and not True or True` *(ma'ruzadan)*

**C4.** `False or not True and not False` *(rasmiy)*

**C5.** `True and not False and True or not False` *(rasmiy)*

**C6.** `True or False and False` *(rasmiy)*

**C7.** `False and True or False` *(rasmiy)*

**C8.** `not False or False and True`

**C9.** `not (True and False)` va `not True and False` — farqni tushuntiring.

**C10.** `True or False and False` ni **qavs bilan** `False` qiling.

**C11.** `not True or not False and not True`

**C12.** Muhimlik tartibini yoddan yozing.

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
# C1
print(True and not True)                  # False
# not True→False;  True and False→False

# C2
print(False or not True and True)         # False
# not True→False;  False and True→False;  False or False→False

# C3
print(True and not True or True)          # True
# not True→False;  True and False→False;  False or True→True

# C4
print(False or not True and not False)    # False
# not True→False, not False→True;  False and True→False;  False or False→False

# C5
print(True and not False and True or not False)     # True
# not False→True (ikki joyda)
# True and True→True;  True and True→True;  True or True→True

# C6
print(True or False and False)            # True
# and BIRINCHI: False and False→False;  True or False→True

# C7
print(False and True or False)            # False
# and BIRINCHI: False and True→False;  False or False→False

# C8
print(not False or False and True)        # True
# not False→True;  False and True→False;  True or False→True

# C9
print(not (True and False))               # True   ← QAVS birinchi
print(not True and False)                 # False  ← not birinchi

# C10
print((True or False) and False)          # False

# C11
print(not True or not False and not True) # False
# not-lar: False or True and False
# and: True and False→False
# or:  False or False→False

# C12
#   1. not      2. and      3. or
```

</details>

---

## D · Ayniyat operatorlari

**D1.** Ayniyat operatori bilan `10` va `12` bir xil emasligini tekshiring. *(rasmiy)*

**D2.** Ayniyat operatori bilan `50` va `50` bir xil ekanini tekshiring. *(rasmiy)*

**D3.** `5 is 6` va `5 == 6` — natijalar bir xilmi?

**D4.** `is` va `==` farqini **ikkita bir xil ro'yxat** bilan isbotlang.

**D5.** `a = 1000` va `b = int("1000")` — `a == b` va `a is b` nima beradi?

**D6.** `x = None` bo'lsa, uni **to'g'ri** tekshirish usuli qanday?

**D7.** Ikki o'zgaruvchi **bitta obyektga** ishora qilishini isbotlang.

**D8.** Zamonaviy Python `5 is 6` ga qanday javob beradi?

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
# D1
print(10 is not 12)       # True
print(10 != 12)           # True   ← TAVSIYA ETILADI

# D2
print(50 is 50)           # True
print(50 == 50)           # True   ← TAVSIYA ETILADI

# D3 — bu holda HA, lekin bu TASODIF
print(5 is 6)             # False
print(5 == 6)             # False

# D4
l1 = [1, 2, 3]
l2 = [1, 2, 3]
print(l1 == l2)           # True   ← MAZMUNI bir xil
print(l1 is l2)           # False  ← IKKI XIL obyekt

# D5
a = 1000
b = int("1000")
print(a == b)             # True
print(a is b)             # False

# D6
x = None
print(x is None)          # True   ← ✅ TO'G'RI USLUB
print(x is not None)      # False

# D7
l1 = [1, 2, 3]
l3 = l1                   # yangi obyekt EMAS, bir xil obyektga ikkinchi NOM
print(l3 is l1)           # True

# D8
# 5 is 6
# SyntaxWarning: "is" with a literal. Did you mean "=="?
```

</details>

---

## E · Aralash va xatolar

**E1.** Xatoni toping:
```python
if yosh => 18:
    print("Katta")
```

**E2.** Xatoni toping:
```python
print(True && False)
```

**E3.** Xatoni toping:
```python
print(5 < "10")
```

**E4.** Xatoni toping:
```python
narx = 5000
print(narx = 5000)
```

**E5.** Nima uchun bu `False` chiqadi? Tuzating:
```python
print(0.1 + 0.2 == 0.3)
```

**E6.** Chipta narxi: yosh `< 7` **yoki** `>= 60` bo'lsa bepul.

**E7.** Login: `login == "admin"` **va** `parol == "12345"`.

**E8.** Son `3` ga **ham**, `5` ga **ham** bo'linishini tekshiring.

**E9.** Son `3` ga **yoki** `5` ga bo'linishini tekshiring.

**E10.** Yil kabisa yilmi? *(4 ga bo'linadi, lekin 100 ga bo'linsa — 400 ga ham bo'linishi kerak)*

<details>
<summary>✅ E bo'limi yechimlari</summary>

```python
# E1 — `=>` YO'Q, faqat `>=`
yosh = 20
if yosh >= 18:
    print("Katta")            # Katta

# E2 — Python'da `&&` YO'Q, `and` ishlatiladi
print(True and False)         # False

# E3 — son va satrni `<` bilan solishtirib bo'lmaydi
print(5 < 10)                 # True
print(5 < int("10"))          # True

# E4 — `print` ichida `=` biriktirish bo'lolmaydi
narx = 5000
print(narx == 5000)           # True
print(narx)                   # 5000

# E5 — kasr sonlar aniq saqlanmaydi
print(abs(0.1 + 0.2 - 0.3) < 0.000001)     # True

# E6
yosh = 65
print(yosh < 7 or yosh >= 60)              # True

# E7
login, parol = "admin", "12345"
print(login == "admin" and parol == "12345")     # True

# E8
son = 15
print(son % 3 == 0 and son % 5 == 0)       # True

# E9
son = 9
print(son % 3 == 0 or son % 5 == 0)        # True

# E10
yil = 2024
print(yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0))     # True
yil = 1900
print(yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0))     # False
yil = 2000
print(yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0))     # True
```

</details>

---

## 🎯 O'zingizni baholang

Har bir to'g'ri javob — **1 ball**. Jami: **58**.

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **52–58** | 🏆 **A'lo** | 15-modulga o'ting |
| **44–51** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **35–43** | 🥉 **Qoniqarli** | Darslarni qayta o'qing |
| **0–34** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

### Bo'limlar bo'yicha tahlil

| Bo'lim | Ballim | Zaif bo'lsa |
|---|---|---|
| A · Solishtirish | ___ / 14 | [1-dars](01-Comparison-Operators.md) |
| B · Mantiqiy | ___ / 14 | [2-dars](02-Logical-and-Identity-Operators.md) 1–4-bo'limlar |
| C · Muhimlik tartibi | ___ / 12 | [2-dars](02-Logical-and-Identity-Operators.md) 5-bo'lim |
| D · Ayniyat | ___ / 8 | [2-dars](02-Logical-and-Identity-Operators.md) 6–7-bo'limlar |
| E · Aralash | ___ / 10 | Ikkala dars |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
