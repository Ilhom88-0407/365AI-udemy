# 📝 19-modul · Barcha mashqlar

**52 ta mashq** — 5 ta bo'lim. Yechimlar `<details>` ichida.

> 📌 **Diqqat:** bu modulda kursning **rasmiy mashqlari yo'q** — u ko'proq **nazariy**. Barcha mashqlar ushbu darslikka **maxsus** tayyorlangan.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--oop-obyekt-sinf-metod) | OOP: obyekt, sinf, metod | 12 |
| [B](#b--modullar-va-paketlar) | Modullar va paketlar | 10 |
| [C](#c--import-qilish) | Import qilish | 12 |
| [D](#d--hujjatlar-bilan-ishlash) | Hujjatlar bilan ishlash | 10 |
| [E](#e--butun-python-bolimi--takrorlash) | Butun Python bo'limi — takrorlash | 8 |
| | **JAMI** | **52** |

---

## A · OOP: obyekt, sinf, metod

**A1.** `type()` bilan 5 xil obyektning sinfini aniqlang.

**A2.** Python'da nima obyekt hisoblanadi?

**A3.** Sinf, obyekt, atribut va metod farqini ayting.

**A4.** Ro'yxat yarating va unga **3 xil metod** qo'llang.

**A5.** Satrga `str` sinfining metodlarini qo'llang.

**A6.** `list` metodini `str` ga qo'llab ko'ring. Nima bo'ladi?

**A7.** Funksiya va metodni **yonma-yon** ko'rsating.

**A8.** Metodni obyektsiz chaqirib ko'ring.

**A9.** `dir()` bilan `list` sinfining metodlarini ko'ring.

**A10.** Ikki xil sinfda **bir xil nomli** metod bo'lishi mumkinmi?

**A11.** `int` obyektining metodlari bormi?

**A12.** Obyekt, namuna, xossa — sinonimlarni ayting.

<details>
<summary>✅ A bo'limi yechimlari</summary>

```python
# A1
print(type(10))                 # <class 'int'>
print(type(3.14))               # <class 'float'>
print(type("salom"))            # <class 'str'>
print(type([1, 2]))             # <class 'list'>
print(type({"a": 1}))           # <class 'dict'>

# A2 — HAR BIR QIYMAT obyekt: int, float, str, list, tuple, dict

# A3
# SINF    — obyekt yaratish QOIDALARI       (list)
# OBYEKT  — sinfning aniq NAMUNASI          ([1.0, 2.0])
# ATRIBUT — obyekt HOLATIGA oid xususiyat   (ma'lumot turi)
# METOD   — obyektga qo'llanadigan AMAL     (.extend())

# A4
r = [3, 1, 2]
r.append(4);  print(r)          # [3, 1, 2, 4]
r.sort();     print(r)          # [1, 2, 3, 4]
print(r.index(3))               # 2

# A5
matn = "Python"
print(matn.upper())             # PYTHON
print(matn.lower())             # python
print(matn.replace("P", "J"))   # Jython

# A6
# matn.append("!")
# AttributeError: 'str' object has no attribute 'append'
# `append` — `list` SINFINING metodi

# A7
r = [3, 1, 2]
print(len(r))                   # 3          ← FUNKSIYA: obyekt qavs ichida
r.sort()                        #            ← METOD: obyekt nuqtadan oldin
print(r)                        # [1, 2, 3]

# A8
# sort()
# NameError: name 'sort' is not defined
# "Velosiped bo'lmasa — chapga burilib bo'lmaydi"

# A9
r = [1, 2, 3]
m = []
for x in dir(r):
    if not x.startswith("_"):
        m.append(x)
print(m)
# ['append', 'clear', 'copy', 'count', 'extend', 'index',
#  'insert', 'pop', 'remove', 'reverse', 'sort']

# A10 — HA, mumkin
print([1, 2, 2].count(2))       # 2   ← list.count
print("hello".count("l"))       # 2   ← str.count
# Bir xil NOM, turli SINFLAR. Nuqta qaysi sinf ekanini ANIQLAYDI.

# A11 — HA, bor
print((10).bit_length())        # 4
print((255).bit_length())       # 8
print((3.7).is_integer())       # False
print((4.0).is_integer())       # True

# A12
# obyekt   ≡  namuna (instance)
# atribut  ≡  xossa (property)
# paket    ≡  kutubxona (library)
```

</details>

---

## B · Modullar va paketlar

**B1.** Modul nima?

**B2.** Paket nima? Sinonimi qaysi?

**B3.** Standart kutubxona nima?

**B4.** `math` modulini import qilib, 3 xil funksiyasini sinang.

**B5.** `math.pi` va `math.e` ni chiqaring.

**B6.** **Importsiz** ishlaydigan 5 ta funksiyani yozing.

**B7.** `dir()` bilan `math` da nima borligini ko'ring.

**B8.** `math.pi` bilan doira yuzasini hisoblang.

**B9.** `random` modulidan 3 xil funksiyani sinang.

**B10.** Standart kutubxonaning yana **3 ta modulini** sinang.

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1 — O'zgaruvchilar, funksiyalar va sinflar TA'RIFLARINI o'z ichiga
#      olgan OLDINDAN YOZILGAN kod. Import qilinadi.

# B2 — KATTAROQ miqyosdagi kod: bog'liq modullar TO'PLAMI.
#      Sinonimi: KUTUBXONA (library).

# B3 — Python'ni O'RNATGANINGIZ BILANOQ mavjud modullar to'plami.
#      len(), list, print() — hammasi shu yerdan.

# B4
import math
print(math.sqrt(25))            # 5.0
print(math.floor(7.9))          # 7
print(math.ceil(7.1))           # 8

# B5
print(math.pi)                  # 3.141592653589793
print(math.e)                   # 2.718281828459045

# B6 — ICHKI funksiyalar, import KERAK EMAS
print(len("Python"))            # 6
print(max(3, 7))                # 7
print(min(3, 7))                # 3
print(sum([1, 2, 3]))           # 6
print(round(3.7))               # 4

# B7
f = []
for nom in dir(math):
    if not nom.startswith("_"):
        f.append(nom)
print(len(f))                   # 62   (Python versiyasiga qarab farq qiladi)
print(f[:8])
# ['acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'cbrt']

# B8
def doira_yuzasi(r):
    return math.pi * r ** 2
print(round(doira_yuzasi(5), 2))        # 78.54
print(round(doira_yuzasi(1), 4))        # 3.1416

# B9
import random
print(type(random.random()))            # <class 'float'>   0.0–1.0
print(type(random.randint(1, 6)))       # <class 'int'>     1–6
print(type(random.choice(["a", "b"])))  # <class 'str'>

# B10
import statistics
print(statistics.mean([1, 2, 3, 4]))    # 2.5
print(statistics.median([1, 2, 3, 4]))  # 2.5

import string
print(string.ascii_lowercase)           # abcdefghijklmnopqrstuvwxyz
print(string.digits)                    # 0123456789

import datetime
print(datetime.date(2026, 8, 25))       # 2026-08-25
```

</details>

---

## C · Import qilish

**C1.** Import qilishning **4 usulini** yozing.

**C2.** `math` ni to'rt xil usulda import qilib, `sqrt(81)` ni hisoblang.

**C3.** 1-usul sintaksisi qanday?

**C4.** 2-usul nimani tashlab ketish imkonini beradi?

**C5.** Funksiyani va modulni **qayta nomlang**.

**C6.** 4-usul nima uchun xavfli?

**C7.** Amaliyotdagi standart qisqartmalarni yozing.

**C8.** Bir nechta funksiyani **bir qatorda** import qiling.

**C9.** `floor` va `ceil` ni manfiy sonlar bilan sinang.

**C10.** `math.sqrt` va `** 0.5` ni solishtiring.

**C11.** Nom to'qnashuvini **isbotlang**.

**C12.** `help()` bilan 3 xil funksiya haqida ma'lumot oling.

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
# C1
# 1. import math
# 2. from math import sqrt
# 3. import math as m  /  from math import sqrt as s
# 4. from math import *

# C2
import math
print(math.sqrt(81))                    # 9.0
from math import sqrt
print(sqrt(81))                         # 9.0
import math as m
print(m.sqrt(81))                       # 9.0
from math import sqrt as s
print(s(81))                            # 9.0

# C3 — MODUL NOMI + NUQTA + FUNKSIYA NOMI + ARGUMENT
#      math.sqrt(16)

# C4 — MODUL NOMINI va NUQTA OPERATORINI

# C5
from math import sqrt as s
print(s(36))                            # 6.0
import math as m
print(m.sqrt(49))                       # 7.0

# C6
# from math import *          ← sqrt keldi
# from boshqa import *        ← bu yerda HAM sqrt bor!
# sqrt(81)  →  QAYSI BIRI?
# Python bittasini tanlaydi, SIZ tanlay olmaysiz.
# → NOPROFESSIONAL kodlash belgisi

# C7
# import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt
# import seaborn as sns
# import tensorflow as tf

# C8
from math import sqrt, floor, ceil
print(sqrt(100), floor(3.7), ceil(3.2))     # 10.0 3 4

# C9
print(floor(3.7))                       # 3
print(ceil(3.2))                        # 4
print(floor(-3.7))                      # -4   ← PASTGA
print(ceil(-3.2))                       # -3   ← YUQORIGA

# C10
import math
print(math.sqrt(16))                    # 4.0
print(16 ** 0.5)                        # 4.0
print(math.sqrt(16) == 16 ** 0.5)       # True
# `**` — import KERAK EMAS.  `math.sqrt` — katta sonlarda ANIQROQ.

# C11
from math import sqrt
print(sqrt(16))                         # 4.0
def sqrt(x):
    return "Men boshqa sqrt man!"
print(sqrt(16))                         # Men boshqa sqrt man!
# ← math ning sqrt i YO'QOLDI!
# `import math` bo'lganda `math.sqrt` XAVFSIZ qolardi.

# C12
# help(math.sqrt)   →  Return the square root of x.
# help(math.floor)  →  Return the floor of x as an Integral.
# help(len)         →  Return the number of items in a container.
```

</details>

---

## D · Hujjatlar bilan ishlash

**D1.** `help(len)`, `help(round)`, `help(max)` ni sinang.

**D2.** `help(list.append)` va `help(list.extend)` ni solishtiring.

**D3.** `help()` bilan `round()` ning ikkinchi argumenti **ixtiyoriy** ekanini isbotlang.

**D4.** `help(sorted)` — `reverse` parametri bormi?

**D5.** `help(str.split)` — argumentsiz nima qiladi?

**D6.** `help()` da `/` va `*` nimani anglatadi?

**D7.** Hujjatlarda metodni qanday qidirish kerak?

**D8.** Ziddiyat bo'lsa nima ustunlik qiladi?

**D9.** `dir()` bilan `str` sinfining metodlarini toping.

**D10.** Jupyter'ning `Tab` va `Shift+Tab` tugmalari nima qiladi?

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
# D1
help(len)       # Return the number of items in a container.
help(round)     # round(number, ndigits=None)
help(max)       # max(iterable, *[, default=obj, key=func]) -> value

# D2
help(list.append)   # append(object, /)  — Append object to the end of the list.
help(list.extend)   # extend(iterable, /) — Extend list by appending elements
                    #                       from the iterable.
# ← "iterable" — RO'YXAT, SATR, tuple...
#    Mana nima uchun extend("abc") HARFLARGA ajratadi!

# D3
# round(number, ndigits=None)
#                        ↑ standart qiymat → IXTIYORIY
print(round(3.567))                     # 4
print(round(3.567, 2))                  # 3.57

# D4 — HA, bor
# sorted(iterable, /, *, key=None, reverse=False)
print(sorted([3, 1, 2]))                # [1, 2, 3]
print(sorted([3, 1, 2], reverse=True))  # [3, 2, 1]

# D5
# split(self, /, sep=None, maxsplit=-1)
# ← sep=None → argumentsiz BO'SH JOY bo'yicha ajratadi
print("a b  c".split())                 # ['a', 'b', 'c']
print("a,b,c".split(","))               # ['a', 'b', 'c']

# D6
# sorted(iterable, /, *, key=None, reverse=False)
#                  ↑    ↑
#   / dan OLDINGILAR — faqat POZITSIYA bilan
#   * dan KEYINGILAR — faqat NOM bilan
print(sorted([3, 1, 2], reverse=True))  # [3, 2, 1]   ✅
# sorted([3, 1, 2], True)
# TypeError: sorted expected 1 argument, got 2

# D7 — `sinf.metod` shaklida:  list.extend,  str.upper,  dict.get

# D8 — HUJJATLAR (vositaning YARATUVCHILARI yozgan)

# D9
s = "Python"
m = []
for x in dir(s):
    if not x.startswith("_"):
        m.append(x)
print(len(m))                           # 47
print(m[:10])
# ['capitalize', 'casefold', 'center', 'count', 'encode',
#  'endswith', 'expandtabs', 'find', 'format', 'format_map']

# D10
# Tab         →  nomni to'ldiradi, metodlar bo'yicha TAKLIFLAR beradi
# Shift + Tab →  HUJJATNI ko'rsatadi (4 martagacha bosish mumkin)
```

</details>

---

## E · Butun Python bo'limi — takrorlash

Bu bo'lim **10–19-modullarni** qamrab oladi.

**E1.** `int`, `float`, `str`, `bool` — to'rttasini ham ishlatib o'zgaruvchi yarating. *(12-modul)*

**E2.** 7 ta arifmetik operatorni sinang. *(13-modul)*

**E3.** `and`, `or`, `not` ni muhimlik tartibi bilan sinang. *(14-modul)*

**E4.** `if/elif/else` bilan baho tizimini yozing. *(15-modul)*

**E5.** Funksiya yozing — `return` bilan. *(16-modul)*

**E6.** `list`, `tuple`, `dict` — uchtasini ham yarating. *(17-modul)*

**E7.** `for` va `while` bilan yig'uvchi o'zgaruvchi naqshini qo'llang. *(18-modul)*

**E8.** Hammasini birlashtirib **to'liq dastur** yozing. *(10–19-modullar)*

<details>
<summary>✅ E bo'limi yechimlari</summary>

```python
# E1 — 12-modul
ism = "Ilhom"           # str
yosh = 25               # int
boy = 1.75              # float
talaba = True           # bool
print(type(ism), type(yosh), type(boy), type(talaba))

# E2 — 13-modul
a, b = 17, 5
print(a+b, a-b, a*b, a/b, a//b, a%b, a**2)      # 22 12 85 3.4 3 2 289

# E3 — 14-modul
print(False or not True and True)               # False
# not → and → or

# E4 — 15-modul
ball = 87
if ball >= 90:
    print("A")
elif ball >= 80:
    print("B")                                  # B
elif ball >= 70:
    print("C")
else:
    print("F")

# E5 — 16-modul
def qqs_bilan(summa):
    return summa * 1.12
print(round(qqs_bilan(100000), 2))              # 112000.0

# E6 — 17-modul
r = [1, 2, 3]
t = (4, 5, 6)
d = {"a": 1, "b": 2}
print(r[0], t[0], d["a"])                       # 1 4 1

# E7 — 18-modul
sonlar = [15, 42, 8, 31]
total = 0
for x in sonlar:
    if x > 20:
        total += 1
print(total)                                    # 2

x = 0
yigindi = 0
while x < len(sonlar):
    yigindi += sonlar[x]
    x += 1
print(yigindi)                                  # 96

# E8 — HAMMASI BIRGA
import math

def statistika(sonlar):
    """Ro'yxat statistikasini lug'at ko'rinishida qaytaradi."""
    if len(sonlar) == 0:
        return {"xato": "Bo'sh ro'yxat"}

    yigindi = 0
    eng_katta = sonlar[0]
    eng_kichik = sonlar[0]
    for son in sonlar:
        yigindi += son
        if son > eng_katta:
            eng_katta = son
        if son < eng_kichik:
            eng_kichik = son

    ortacha = yigindi / len(sonlar)
    return {
        "soni": len(sonlar),
        "yigindi": yigindi,
        "ortacha": round(ortacha, 2),
        "katta": eng_katta,
        "kichik": eng_kichik,
        "ildiz": round(math.sqrt(yigindi), 2)
    }

natija = statistika([15, 42, 8, 31, 67])
for kalit in natija:
    print(kalit, ":", natija[kalit])
# soni : 5
# yigindi : 163
# ortacha : 32.6
# katta : 67
# kichik : 8
# ildiz : 12.77

print(statistika([]))                # {'xato': "Bo'sh ro'yxat"}
```

**Bu bitta funksiyada:** modul import (`math`), funksiya (`def`/`return`), shart (`if`), sikl (`for`), yig'uvchi (`yigindi`), ro'yxat, lug'at, validatsiya — **butun Python bo'limi**.

</details>

---

## 🎯 O'zingizni baholang

Har bir to'g'ri javob — **1 ball**. Jami: **52**.

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **47–52** | 🏆 **A'lo** | 20-modulga (NLP) o'ting |
| **39–46** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **31–38** | 🥉 **Qoniqarli** | Darslarni qayta o'qing |
| **0–30** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

### Bo'limlar bo'yicha tahlil

| Bo'lim | Ballim | Zaif bo'lsa |
|---|---|---|
| A · OOP | ___ / 12 | [1-dars](01-Introduction-to-OOP.md) |
| B · Modullar | ___ / 10 | [2-dars](02-Modules-Packages-Standard-Library.md) |
| C · Import | ___ / 12 | [3-dars](03-Importing-Modules.md) |
| D · Hujjatlar | ___ / 10 | [4](04-What-is-Software-Documentation.md), [5-dars](05-The-Python-Documentation.md) |
| E · Takrorlash | ___ / 8 | 10–18-modullar |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
