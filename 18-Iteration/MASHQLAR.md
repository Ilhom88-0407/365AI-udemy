# 📝 18-modul · Barcha mashqlar

**76 ta mashq** — 6 ta bo'lim. Yechimlar `<details>` ichida: **avval o'zingiz bajaring**.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--for-sikllari) | `for` sikllari | 12 |
| [B](#b--while-sikllari) | `while` sikllari | 12 |
| [C](#c--range-funksiyasi) | `range()` funksiyasi | 12 |
| [D](#d--shartlar-va-sikllar) | Shartlar va sikllar | 14 |
| [E](#e--funksiya--sikl--shart) | Funksiya + sikl + shart | 12 |
| [F](#f--lugatlar-boylab-iteratsiya) | Lug'atlar bo'ylab iteratsiya | 14 |
| | **JAMI** | **76** |

---

## A · `for` sikllari

**A1.** Har bir raqamni yangi qatorda chop etadigan `for` sikli yarating. *(rasmiy)*

**A2.** Xuddi shu raqamlarni **bitta qatorda** chop eting. *(rasmiy)*

**A3.** `even = [0,2,4,...,20]` bo'ylab aylaning.

**A4.** Beshta shahar nomini chiqaring.

**A5.** Har bir sonni **ikki barobarga** oshirib chiqaring.

**A6.** **Satr** bo'ylab aylaning — har bir harfni chiqaring.

**A7.** **Tuple** bo'ylab aylaning.

**A8.** Sikl tanasida **uchta** qator bo'lsin.

**A9.** `end` parametrini `"-"` va `" | "` bilan sinang.

**A10.** Sikldan **keyin** kod yozing va farqni ko'rsating.

**A11.** `sum()` **siz** yig'indini hisoblang.

**A12.** `max()` **siz** eng katta sonni toping.

<details>
<summary>✅ A bo'limi yechimlari</summary>

```python
# A1
digits = [0,1,2,3,4,5,6,7,8,9]
for d in digits:
    print(d)

# A2
for d in digits:
    print(d, end=" ")
print()                             # 0 1 2 3 4 5 6 7 8 9

# A3
even = [0,2,4,6,8,10,12,14,16,18,20]
for n in even:
    print(n, end=" ")
print()                             # 0 2 4 6 8 10 12 14 16 18 20

# A4
shaharlar = ["Toshkent","Samarqand","Buxoro","Xiva","Namangan"]
for shahar in shaharlar:
    print(shahar)

# A5
for son in [1,2,3,4,5]:
    print(son * 2, end=" ")
print()                             # 2 4 6 8 10

# A6
for harf in "Python":
    print(harf, end=" ")
print()                             # P y t h o n

# A7
for x in (10, 20, 30):
    print(x, end=" ")
print()                             # 10 20 30

# A8
for narx in [15000, 42000, 8500]:
    qqs = narx * 0.12
    jami = narx + qqs
    print(narx, "+", qqs, "=", jami)
# 15000 + 1800.0 = 16800.0
# 42000 + 5040.0 = 47040.0
# 8500 + 1020.0 = 9520.0

# A9
for h in "ABC":
    print(h, end="-")
print()                             # A-B-C-
for h in "ABC":
    print(h, end=" | ")
print()                             # A | B | C | 

# A10
for n in [1,2,3]:
    print(n, end=" ")
print("Tugadi")                     # 1 2 3 Tugadi   ← BIR MARTA
for n in [1,2,3]:
    print(n, end=" ")
    print("Tugadi")                 # ← UCH MARTA
# 1 Tugadi
# 2 Tugadi
# 3 Tugadi

# A11
sonlar = [15, 42, 8, 31]
yigindi = 0
for son in sonlar:
    yigindi += son
print(yigindi, sum(sonlar))         # 96 96

# A12
eng_katta = sonlar[0]
for son in sonlar:
    if son > eng_katta:
        eng_katta = son
print(eng_katta, max(sonlar))       # 42 42
```

</details>

---

## B · `while` sikllari

**B1.** 0 dan 30 gacha barcha **toq** sonlarni bitta qatorda chiqaring. *(rasmiy)*

**B2.** Xuddi shu natijani **ikkinchi usul** bilan oling (`% 2 == 1` bilan). *(rasmiy)*

**B3.** 0 dan 20 gacha juft sonlarni `while` bilan chiqaring.

**B4.** 1 dan 10 gacha sanang.

**B5.** 10 dan 1 gacha **teskari** sanang.

**B6.** 5 ning karralilarini 50 gacha chiqaring.

**B7.** 1 dan 100 gacha **yig'indini** hisoblang.

**B8.** Sonni ikki barobarga oshirib boring — 1000 dan oshguncha.

**B9.** Kredit qoldig'ini har oy kamaytiring.

**B10.** **Faktorial** hisoblang: `5!`.

**B11.** `+=`, `-=`, `*=` ni sinang.

**B12.** Cheksiz siklning **uch sababini** yozing *(ishga tushirmang!)*.

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1
x = 1
while x <= 30:
    print(x, end=" ")
    x += 2
print()     # 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29

# B2
x = 0
while x <= 30:
    if x % 2 == 1:
        print(x, end=" ")
    x += 1
print()     # 1 3 5 ... 29   ← bir xil natija, lekin 31 aylanish

# B3
x = 0
while x <= 20:
    print(x, end=" ")
    x += 2
print()     # 0 2 4 6 8 10 12 14 16 18 20

# B4
x = 1
while x <= 10:
    print(x, end=" ")
    x += 1
print()     # 1 2 3 4 5 6 7 8 9 10

# B5
x = 10
while x >= 1:
    print(x, end=" ")
    x -= 1
print()     # 10 9 8 7 6 5 4 3 2 1

# B6
x = 5
while x <= 50:
    print(x, end=" ")
    x += 5
print()     # 5 10 15 20 25 30 35 40 45 50

# B7
x = 1
yigindi = 0
while x <= 100:
    yigindi += x
    x += 1
print(yigindi)                      # 5050

# B8
x = 1
qadam = 0
while x <= 1000:
    x *= 2
    qadam += 1
print(x, "—", qadam, "qadam")       # 1024 — 10 qadam

# B9
qoldiq = 12000000
oy = 0
while qoldiq > 0:
    qoldiq -= 1500000
    oy += 1
print(oy, "oy")                     # 8 oy

# B10
n = 5
faktorial = 1
x = 1
while x <= n:
    faktorial *= x
    x += 1
print(n, "! =", faktorial)          # 5 ! = 120

# B11
x = 10
x += 5;  print(x)       # 15
x -= 3;  print(x)       # 12
x *= 2;  print(x)       # 24
x //= 5; print(x)       # 4

# B12 — ISHGA TUSHIRMANG!
# 1. O'zgarish YO'Q:          while x <= 20: print(x)
# 2. Noto'g'ri YO'NALISH:     while x <= 20: print(x); x -= 1
# 3. O'zgarish TASHQARIDA:    while x <= 20: print(x)
#                             x += 2       ← chekintirilmagan
```

</details>

---

## C · `range()` funksiyasi

**C1.** 1 dan 10 gacha ro'yxat yarating. *(rasmiy)*

**C2.** 0 dan 19 gacha ro'yxat yarating. *(rasmiy)*

**C3.** 0 dan 30 gacha juft sonlar ro'yxatini yarating. *(rasmiy)*

**C4.** `range(10)` nima qaytaradi? `list(range(10))` -chi?

**C5.** `range(3, 7)` va `range(1, 20, 2)` — nima beradi?

**C6.** Qaysi parametr **majburiy**?

**C7.** 1 dan 5 gacha ro'yxat yarating.

**C8.** 100 dan 110 gacha ro'yxat yarating.

**C9.** 5 ning karralilarini 50 gacha.

**C10.** 10 dan 1 gacha **teskari** ro'yxat.

**C11.** `range(3, 20, 4)` da nechta element bor?

**C12.** `range` obyektiga `append` qilib ko'ring.

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
# C1
print(list(range(1, 11)))           # [1, 2, ..., 10]

# C2
print(list(range(20)))              # [0, 1, ..., 19]

# C3
print(list(range(0, 31, 2)))        # [0, 2, ..., 30]

# C4
print(range(10))                    # range(0, 10)      ← OBYEKT
print(list(range(10)))              # [0, 1, ..., 9]    ← RO'YXAT

# C5
print(list(range(3, 7)))            # [3, 4, 5, 6]
print(list(range(1, 20, 2)))        # [1, 3, 5, ..., 19]

# C6 — `stop` MAJBURIY
#      start (standart 0), step (standart 1) — IXTIYORIY

# C7
print(list(range(1, 6)))            # [1, 2, 3, 4, 5]

# C8
print(list(range(100, 111)))        # [100, ..., 110]

# C9
print(list(range(5, 51, 5)))        # [5, 10, ..., 50]

# C10
print(list(range(10, 0, -1)))       # [10, 9, ..., 1]
# ⚠️ range(10, 0) → []  ← step -1 SHART

# C11
print(list(range(3, 20, 4)))        # [3, 7, 11, 15, 19]
print(len(range(3, 20, 4)))         # 5

# C12
r = range(5)
# r.append(5)
# AttributeError: 'range' object has no attribute 'append'
r = list(range(5))
r.append(5)
print(r)                            # [0, 1, 2, 3, 4, 5]
```

</details>

---

## D · Shartlar va sikllar

**D1.** 1 dan 10 gacha sonlarni 2 ga ko'paytirib chiqaring. *(rasmiy)*

**D2.** 1 dan 30 gacha toqlarni chiqaring, juftlar o'rnida `"Even"`. *(rasmiy)*

**D3.** `n = [1,2,3,4,5,6]` bo'ylab **ikki xil** usulda aylaning. *(rasmiy)*

**D4.** `for n in range(10): print(2 ** n)` nima beradi?

**D5.** 0 dan 19 gacha juftlarni chiqaring, toqlar o'rnida `"Odd"`.

**D6.** 1 dan 10 gacha **kvadratlarni** chiqaring.

**D7.** 1 dan 20 gacha 3 ga bo'linadiganlarni chiqaring.

**D8.** Ro'yxatdagi **musbat** sonlarni ajratib chiqaring.

**D9.** **FizzBuzz**: 1–20.

**D10.** Ro'yxat elementlarini **ikki barobarga** oshiring (asl ro'yxatni o'zgartirib).

**D11.** Nima uchun `for x in r: x = x*2` **ishlamaydi**?

**D12.** Parallel ro'yxatlarni birga chiqaring.

**D13.** **Ichma-ich sikl** bilan ko'paytirish jadvali.

**D14.** Bir siklda **eng katta va eng kichik** sonni toping.

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
# D1
for n in range(1, 11):
    print(n * 2, end=" ")
print()                             # 2 4 6 8 10 12 14 16 18 20

# D2
for x in range(1, 31):
    if x % 2 == 1:
        print(x, end=" ")
    else:
        print("Even", end=" ")
print()
# 1 Even 3 Even 5 Even ... 29 Even

# D3
n = [1,2,3,4,5,6]
for item in n:                      # 1-USUL
    print(item * 10, end=" ")
print()                             # 10 20 30 40 50 60
for item in range(len(n)):          # 2-USUL
    print(n[item] * 10, end=" ")
print()                             # 10 20 30 40 50 60

# D4
for n2 in range(10):
    print(2 ** n2, end=" ")
print()                             # 1 2 4 8 16 32 64 128 256 512

# D5
for x in range(20):
    if x % 2 == 0:
        print(x, end=" ")
    else:
        print("Odd", end=" ")
print()
# 0 Odd 2 Odd 4 Odd ... 18 Odd

# D6
for k in range(1, 11):
    print(k ** 2, end=" ")
print()                             # 1 4 9 16 25 36 49 64 81 100

# D7
for k in range(1, 21):
    if k % 3 == 0:
        print(k, end=" ")
print()                             # 3 6 9 12 15 18

# D8
for son in [5, -3, 12, -8, 0, 7]:
    if son > 0:
        print(son, end=" ")
print()                             # 5 12 7

# D9
for k in range(1, 21):
    if k % 3 == 0 and k % 5 == 0:
        print("FizzBuzz", end=" ")
    elif k % 3 == 0:
        print("Fizz", end=" ")
    elif k % 5 == 0:
        print("Buzz", end=" ")
    else:
        print(k, end=" ")
print()

# D10
r = [1, 2, 3, 4]
for i in range(len(r)):
    r[i] = r[i] * 2
print(r)                            # [2, 4, 6, 8]

# D11
r2 = [1, 2, 3]
for x in r2:
    x = x * 2                       # x — NUSXA
print(r2)                           # [1, 2, 3]   ← O'ZGARMADI
# Ro'yxatning O'ZIGA yozish kerak:  r2[i] = r2[i] * 2

# D12
m = ["Non", "Sut", "Choy"]
nx = [4000, 12000, 8000]
sc = [3, 2, 4]
for i in range(len(m)):
    print(m[i], "x", sc[i], "=", nx[i] * sc[i])
# Non x 3 = 12000
# Sut x 2 = 24000
# Choy x 4 = 32000

# D13
for i in range(1, 6):
    for j in range(1, 6):
        print(i * j, end="\t")
    print()

# D14
sonlar = [15, 42, 8, 31, 67, 4]
ek = sonlar[0]
ekk = sonlar[0]
for son in sonlar:
    if son > ek:
        ek = son
    if son < ekk:
        ekk = son
print("Katta:", ek, " Kichik:", ekk)     # Katta: 67  Kichik: 4
```

</details>

---

## E · Funksiya + sikl + shart

**E1.** `nums` da 20 dan past qiymatlar sonini `while` bilan hisoblang. *(rasmiy)*

**E2.** `count(numbers)` — 20 dan kichiklar soni (`for` bilan).

**E3.** `list_1` va `list_2` uchun natijalar nima?

**E4.** Chegarani **parametr** qilib bering.

**E5.** **Musbat** sonlar sonini hisoblang.

**E6.** **Juft** sonlar sonini hisoblang.

**E7.** Yig'indini funksiya bilan hisoblang.

**E8.** Shartga mos elementlardan **yangi ro'yxat** yasang.

**E9.** `min()`, `max()`, `sum()` ni funksiya bilan qayta yozing.

**E10.** `return` ni sikl **ichiga** qo'ying. Nima buziladi?

**E11.** Ikkita shartli sanoqchi (`>= 20` **va** `< 50`).

**E12.** Ro'yxatdagi **eng uzun satrni** toping.

<details>
<summary>✅ E bo'limi yechimlari</summary>

```python
# E1
nums = [1, 35, 12, 24, 31, 51, 70, 100]

def count_while(numbers):
    numbers = sorted(numbers)
    tot = 0
    while numbers[tot] < 20:
        tot += 1
    return tot

print(count_while(nums))            # 2
# Hiyla: TARTIBLASHDAN keyin 20 dan kichiklar BOSHIDA turadi.
# ⚠️ ZAIF joyi: barcha sonlar 20 dan kichik bo'lsa → IndexError
# Xavfsizroq:
def count_xavfsiz(numbers):
    numbers = sorted(numbers)
    tot = 0
    while tot < len(numbers) and numbers[tot] < 20:
        tot += 1
    return tot
print(count_xavfsiz([1, 2, 3]))     # 3

# E2
def count(numbers):
    total = 0
    for x in numbers:
        if x < 20:
            total += 1
    return total

# E3
list_1 = [1,3,7,15,23,43,56,98]
list_2 = [1,3,7,15,23,43,56,98,17]
print(count(list_1))                # 4
print(count(list_2))                # 5

# E4
def count_kichik(sonlar, chegara):
    total = 0
    for x in sonlar:
        if x < chegara:
            total += 1
    return total
print(count_kichik(list_1, 20))     # 4
print(count_kichik(list_1, 50))     # 6
print(count_kichik(list_1, 100))    # 8

# E5
def musbatlar(sonlar):
    total = 0
    for x in sonlar:
        if x > 0:
            total += 1
    return total
print(musbatlar([5,-3,12,-8,0,7]))  # 3

# E6
def juftlar(sonlar):
    total = 0
    for x in sonlar:
        if x % 2 == 0:
            total += 1
    return total
print(juftlar([1,2,3,4,5,6]))       # 3

# E7
def yigindi(sonlar):
    jami = 0
    for x in sonlar:
        jami += x
    return jami
print(yigindi(list_1), sum(list_1)) # 246 246

# E8
def filtrla(sonlar, chegara):
    natija = []
    for x in sonlar:
        if x < chegara:
            natija.append(x)
    return natija
print(filtrla(list_1, 20))          # [1, 3, 7, 15]

# E9
def mening_min(s):
    r = s[0]
    for x in s:
        if x < r:
            r = x
    return r

def mening_max(s):
    r = s[0]
    for x in s:
        if x > r:
            r = x
    return r

print(mening_min(list_1), min(list_1))      # 1 1
print(mening_max(list_1), max(list_1))      # 98 98

# E10
def count_xato(sonlar):
    total = 0
    for x in sonlar:
        if x < 20:
            total += 1
        return total                # ❌ SIKL ICHIDA
print(count_xato(list_1))           # 1
# Funksiya BIRINCHI aylanishda tugaydi

# E11
def oraliqda(sonlar, past, yuqori):
    total = 0
    for x in sonlar:
        if x >= past and x < yuqori:
            total += 1
    return total
print(oraliqda(list_1, 20, 50))     # 2   ← 23 va 43

# E12
def eng_uzun(sozlar):
    natija = sozlar[0]
    for soz in sozlar:
        if len(soz) > len(natija):
            natija = soz
    return natija
print(eng_uzun(["Python","dasturlash","tili"]))     # dasturlash
```

</details>

---

## F · Lug'atlar bo'ylab iteratsiya

`prices = {"box_of_spaghetti": 4, "lasagna": 5, "hamburger": 2}`
`quantity = {"box_of_spaghetti": 6, "lasagna": 10, "hamburger": 0}`

**F1.** Jan qancha pul sarfladi? *(ma'ruzadan)*

**F2.** Narxi `>= 5` bo'lganlarga qancha sarfladi? *(rasmiy)*

**F3.** Narxi `< 5` bo'lganlarga qancha sarfladi? *(rasmiy)*

**F4.** `for i in prices` da `i` — **kalitmi yoki qiymatmi**?

**F5.** `prices` o'rniga `quantity` qo'ysangiz natija o'zgaradimi? Nima uchun?

**F6.** Barcha **kalitlarni** chiqaring.

**F7.** Barcha **qiymatlarni** chiqaring.

**F8.** `.items()` bilan kalit va qiymatni **birga** chiqaring.

**F9.** Barcha narxlar **yig'indisini** hisoblang.

**F10.** Eng **qimmat** mahsulotni toping.

**F11.** Narxi `5000` dan yuqori bo'lganlarni chiqaring.

**F12.** Ikkita lug'at bilan **chek** yasang.

**F13.** Kalitlar **mos kelmasa** nima bo'ladi?

**F14.** Lug'atdagi qiymatlarni **ikki barobarga** oshiring.

<details>
<summary>✅ F bo'limi yechimlari</summary>

```python
prices = {"box_of_spaghetti": 4, "lasagna": 5, "hamburger": 2}
quantity = {"box_of_spaghetti": 6, "lasagna": 10, "hamburger": 0}

# F1
money_spent = 0
for i in prices:
    money_spent = money_spent + (prices[i] * quantity[i])
print(money_spent)                  # 74
# 4×6 + 5×10 + 2×0 = 24 + 50 + 0 = 74

# F2
money_spent = 0
for i in quantity:
    if prices[i] >= 5:
        money_spent += prices[i] * quantity[i]
print(money_spent)                  # 50   ← faqat lasagna

# F3
money_spent = 0
for i in quantity:
    if prices[i] < 5:
        money_spent += prices[i] * quantity[i]
print(money_spent)                  # 24   ← spaghetti + hamburger
# ✅ Tekshiruv: 50 + 24 = 74

# F4 — KALIT
for i in prices:
    print(i, end=" | ")
print()     # box_of_spaghetti | lasagna | hamburger | 

# F5 — YO'Q, o'zgarmaydi (74)
# Chunki ikkala lug'at BIR XIL KALITLARNI o'z ichiga oladi

# F6
narxlar = {"Non": 4000, "Sut": 12000, "Choy": 8000}
for k in narxlar:
    print(k, end=" ")
print()                             # Non Sut Choy

# F7
for v in narxlar.values():
    print(v, end=" ")
print()                             # 4000 12000 8000

# F8
for k, v in narxlar.items():
    print(k, "→", v)

# F9
jami = 0
for k in narxlar:
    jami += narxlar[k]
print(jami, sum(narxlar.values()))  # 24000 24000

# F10
eng_qimmat = ""
eng_narx = 0
for k in narxlar:
    if narxlar[k] > eng_narx:
        eng_narx = narxlar[k]
        eng_qimmat = k
print(eng_qimmat, eng_narx)         # Sut 12000

# F11
for k in narxlar:
    if narxlar[k] > 5000:
        print(k, "-", narxlar[k])
# Sut - 12000
# Choy - 8000

# F12
sonlar = {"Non": 3, "Sut": 2, "Choy": 4}
jami = 0
print("CHEK")
print("-" * 32)
for k in narxlar:
    summa = narxlar[k] * sonlar[k]
    jami += summa
    print(k, "x", sonlar[k], "=", summa)
print("-" * 32)
print("JAMI:", jami)                # JAMI: 68000

# F13
p2 = {"a": 1, "b": 2}
q2 = {"a": 5}
# for i in p2: print(q2[i])   →  KeyError: 'b'
for i in p2:
    print(i, q2.get(i, 0))          # a 5 / b 0   ← XAVFSIZ

# F14
n2 = {"Non": 4000, "Sut": 12000}
for k in n2:
    n2[k] = n2[k] * 2
print(n2)                           # {'Non': 8000, 'Sut': 24000}
# ⚠️ QIYMATNI o'zgartirish mumkin, lekin sikl ichida
#    KALIT qo'shish/o'chirish → RuntimeError
```

</details>

---

## 🎯 O'zingizni baholang

Har bir to'g'ri javob — **1 ball**. Jami: **76**.

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **68–76** | 🏆 **A'lo** | 19-modulga o'ting |
| **57–67** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **46–56** | 🥉 **Qoniqarli** | Darslarni qayta o'qing |
| **0–45** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

### Bo'limlar bo'yicha tahlil

| Bo'lim | Ballim | Zaif bo'lsa |
|---|---|---|
| A · `for` | ___ / 12 | [1-dars](01-For-Loops.md) |
| B · `while` | ___ / 12 | [2-dars](02-While-Loops.md) |
| C · `range()` | ___ / 12 | [3-dars](03-The-range-Function.md) |
| D · Shartlar + sikllar | ___ / 14 | [4-dars](04-Conditionals-and-Loops.md) |
| E · Funksiya + sikl | ___ / 12 | [5-dars](05-Conditionals-Functions-and-Loops.md) |
| F · Lug'atlar | ___ / 14 | [7-dars](07-Iterating-over-Dictionaries.md) |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
