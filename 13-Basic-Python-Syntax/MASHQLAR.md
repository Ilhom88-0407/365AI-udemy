# 📝 13-modul · Barcha mashqlar

**62 ta mashq** — 6 ta bo'lim bo'yicha. Har birining yechimi `<details>` ichida yashiringan: **avval o'zingiz bajaring**, keyin oching.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--arifmetik-operatorlar) | Arifmetik operatorlar | 14 |
| [B](#b--ikkilangan-tenglik-va-qayta-biriktirish) | `==` va qayta biriktirish | 12 |
| [C](#c--izohlar-va-qator-davomi) | Izohlar va qator davomi | 10 |
| [D](#d--indekslash) | Indekslash | 12 |
| [E](#e--chekinish) | Chekinish | 8 |
| [F](#f--xatolarni-toping) | Xatolarni toping | 6 |
| | **JAMI** | **62** |

---

## A · Arifmetik operatorlar

**A1.** `a = 17`, `b = 8`. Barcha 7 ta amalni bajaring va natijalarni chop eting.

**A2.** `100` ni `8` ga: (a) oddiy bo'ling, (b) butun bo'ling, (c) qoldiqni toping.

**A3.** `2` ning `10`-darajasini hisoblang.

**A4.** `7 // 2` va `-7 // 2` — natijalar bir xilmi? Nima uchun?

**A5.** `7 % 2` va `-7 % 2` — natijalarni taxmin qiling, keyin tekshiring.

**A6.** `2 + 3 * 4` va `(2 + 3) * 4` — farqni tushuntiring.

**A7.** `10 / 2 / 5` va `2 ** 2 ** 3` — qaysi biri chapdan, qaysi biri o'ngdan hisoblanadi?

**A8.** Bir yilda necha sekund borligini hisoblang (365 kun).

**A9.** `1234` sonining **oxirgi raqamini** va **oxiridan ikkinchi raqamini** `%` va `//` bilan ajratib oling.

**A10.** `9` va `10` sonlari `3` ga **qoldiqsiz bo'linadimi**? `%` va `==` bilan tekshiring.

**A11.** 5000 so'mlik mahsulotdan 3 dona olindi. QQS 12%. **Jami summani** bir qatorda hisoblang.

**A12.** `25` ning **kvadrat ildizini** va `27` ning **kub ildizini** `**` bilan hisoblang.

**A13.** `5` ni `0` ga bo'ling. Nima bo'ladi? Xato nomini yozing.

**A14.** `"Salom" * 3` nima beradi? `"Salom" - "S"` -chi?

<details>
<summary>✅ A bo'limi yechimlari</summary>

```python
# A1
a, b = 17, 8
print(a+b, a-b, a*b, a/b, a//b, a%b, a**2)
# 25 9 136 2.125 2 1 289

# A2
print(100/8)      # 12.5
print(100//8)     # 12
print(100%8)      # 4

# A3
print(2**10)      # 1024

# A4 — YO'Q, farq qiladi
print(7//2)       # 3
print(-7//2)      # -4
# `//` PASTGA yaxlitlaydi (kichikroq songa tomon), nolga tomon emas.
# -3.5 → pastga → -4

# A5
print(7%2)        # 1
print(-7%2)       # 1
# Python'da qoldiq BO'LUVCHI ishorasiga ega bo'ladi.

# A6
print(2 + 3*4)    # 14   ← * oldin
print((2+3)*4)    # 20   ← qavs oldin

# A7
print(10/2/5)     # 1.0   ← CHAPDAN: (10/2)/5 = 5/5
print(2**2**3)    # 256   ← O'NGDAN: 2**(2**3) = 2**8
# `**` — yagona O'NGDAN hisoblanadigan operator!

# A8
print(365*24*60*60)     # 31536000

# A9
n = 1234
print(n % 10)           # 4   ← oxirgi raqam
print(n // 10 % 10)     # 3   ← oxiridan ikkinchi

# A10
print(9 % 3 == 0)       # True
print(10 % 3 == 0)      # False

# A11
print(5000 * 3 * 1.12)  # 16800.0

# A12
print(25 ** 0.5)        # 5.0
print(27 ** (1/3))      # 3.0

# A13
# print(5/0)
# ZeroDivisionError: division by zero

# A14
print("Salom" * 3)      # SalomSalomSalom  ← takrorlash!
# print("Salom" - "S")
# TypeError: unsupported operand type(s) for -: 'str' and 'str'
```

</details>

---

## B · Ikkilangan tenglik va qayta biriktirish

**B1.** `5 == 5`, `5 == 5.0`, `"5" == 5` — uchtasini taxmin qiling, keyin tekshiring.

**B2.** `0.1 + 0.2 == 0.3` — natija nima? Nima uchun?

**B3.** `True == 1` va `False == 0` — nima chiqadi?

**B4.** `10 // 3 == 3` va `10 / 3 == 3` — farqni tushuntiring.

**B5.** `"abc" == "ABC"` — Python registrni farqlaydimi?

**B6.** `x = 10` yozing, keyin `x == 15` deb yozing. `x` o'zgardimi?

**B7.** Ketma-ket yozing: `z = 1`, keyin `z = 3`, keyin `print(z + 5)`. Natija nima?

**B8.** Bir qatorda `a = b = c = 7` yozing. Uchalasi ham 7 mi?

**B9.** `x = 5` va `x = x + 3` — bu qanday ishlaydi? Nima uchun matematik jihatdan "noto'g'ri"?

**B10.** Bir o'zgaruvchini **uch marta** qayta biriktiring va har safar chop eting.

**B11.** `narx = 10000` ni `15%` ga oshiring — **bitta qatorda**, `narx` o'zgaruvchisidan foydalanib.

**B12.** Ikkita o'zgaruvchining **qiymatlarini almashtiring** (`a` da `b` ning qiymati, `b` da `a` niki).

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1
print(5 == 5)       # True
print(5 == 5.0)     # True   ← int va float SOLISHTIRILADI
print("5" == 5)     # False  ← satr va son HECH QACHON teng emas

# B2
print(0.1 + 0.2)          # 0.30000000000000004
print(0.1 + 0.2 == 0.3)   # False
# Kompyuter kasr sonlarni IKKILIK sanoqda saqlaydi — aniq emas.

# B3
print(True == 1)    # True
print(False == 0)   # True
# Python'da True = 1, False = 0

# B4
print(10 // 3 == 3)   # True    ← 10//3 = 3
print(10 / 3 == 3)    # False   ← 10/3 = 3.333...

# B5
print("abc" == "ABC")   # False  ← registr MUHIM

# B6
x = 10
print(x == 15)      # False
print(x)            # 10  ← O'ZGARMADI! `==` faqat TEKSHIRADI

# B7
z = 1
z = 3
print(z + 5)        # 8   ← OXIRGI buyruq g'olib

# B8
a = b = c = 7
print(a, b, c)      # 7 7 7

# B9
x = 5
x = x + 3
print(x)            # 8
# Matematikada x = x + 3 YECHIMSIZ tenglama.
# Python'da `=` — bu TENGLIK EMAS, BIRIKTIRISH:
# "o'ng tomonni hisobla, natijani chapga joyla"

# B10
son = 1
print(son)          # 1
son = 100
print(son)          # 100
son = son * 2
print(son)          # 200

# B11
narx = 10000
narx = narx * 1.15
print(narx)         # 11500.0

# B12
a = 5
b = 9
a, b = b, a         # Python'ning chiroyli usuli
print(a, b)         # 9 5
```

</details>

---

## C · Izohlar va qator davomi

**C1.** `15 + 31` va yangi qatorda `- 26` yozing. Natija nima? Endi `\` qo'shing — nima o'zgardi?

**C2.** `2.0 * 1.5 + 5` ni ikki qatorda yozing.

**C3.** `10 + 20 + 30 + 40 + 50` ni **uch qatorga** bo'ling — (a) `\` bilan, (b) qavslar bilan.

**C4.** `\` dan keyin **bo'sh joy** qo'ying. Nima bo'ladi? Xato nomini yozing.

**C5.** Uzun `print` ni qavslar ichida **uch qatorga** bo'ling.

**C6.** Satrni ikki qatorda davom ettiring: `"Bu uzun " \` va `"matn"`.

**C7.** Kodni **uch bo'limga** ajrating: ma'lumotlar, hisob, natija — izoh sarlavhalari bilan.

**C8.** Quyidagi kodning ikkinchi qatorini **vaqtincha o'chiring**:
```python
print("A")
print("B")
print("C")
```

**C9.** `print("# bu izohmi?")` nima chiqaradi?

**C10.** Yomon izohni yaxshisiga aylantiring:
```python
qqs = summa * 0.12    # summani 0.12 ga ko'paytiramiz
```

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
# C1
# \ SIZ:
#   15 + 31
#   - 26        →  -26   (IKKITA alohida ifoda)
# \ BILAN:
print(15 + 31 \
- 26)           # 20     (BITTA ifoda)

# C2
natija = 2.0 * 1.5 + \
5
print(natija)   # 8.0

# C3
# (a)
n1 = 10 + 20 + \
     30 + 40 + \
     50
# (b)
n2 = (10 + 20 +
      30 + 40 +
      50)
print(n1, n2)   # 150 150

# C4
# jami = 5 + \ 
#        10
# SyntaxError: unexpected character after line continuation character

# C5
print("Mahsulot:", "Noutbuk",
      "| Narx:", 8500000,
      "| Soni:", 2)

# C6
matn = "Bu uzun " \
       "matn"
print(matn)     # Bu uzun matn

# C7
# ===== 1. MA'LUMOTLAR =====
narx = 5000
soni = 3
# ===== 2. HISOB =====
jami = narx * soni
# ===== 3. NATIJA =====
print(jami)     # 15000

# C8
print("A")
# print("B")
print("C")

# C9
print("# bu izohmi?")     # # bu izohmi?
# Qo'shtirnoq ICHIDAGI # — oddiy belgi, izoh emas.

# C10
qqs = summa * 0.12    # O'zbekistonda QQS stavkasi 12%
```

</details>

---

## D · Indekslash

**D1.** `"Programming"` dan: birinchi belgi, `[3]`, oxirgi belgi, va uzunligini chiqaring.

**D2.** `"Toshkent"` so'zining **o'rtadagi** belgisini formula bilan toping.

**D3.** `"12345"` dan `3` ni oling.

**D4.** `"+998901234567"` dan: `+`, mamlakat kodi (`998`), operator kodi (`90`) ni ajrating.

**D5.** `"Python"` dan **toq indeksdagi** belgilarni yig'ing (`[1]`, `[3]`, `[5]`).

**D6.** `"radar"` so'zida `[0]==[-1]` va `[1]==[-2]` — natijalar nima?

**D7.** `"Salom"` ning `[5]` indeksini oling. Nima bo'ladi?

**D8.** So'z uzunligi `n` bo'lsa, oxirgi indeks nechchi? Formulani yozing va sinang.

**D9.** Ism va familiyaning bosh harflarini `A.B.` formatida chiqaring.

**D10.** `"Bingo!"` dan `!` belgisini **ikki xil usulda** oling.

**D11.** `"Constitution"` da nechta `t` bor? Har birining indeksini toping.

**D12.** `"AI"` so'zini `"Dasturlash AI"` dan indekslar bilan yig'ing.

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
# D1
s = "Programming"
print(s[0], s[3], s[-1], len(s))    # P g g 11

# D2
s = "Toshkent"
print(s[len(s) // 2])               # k   (8//2 = 4)

# D3
print("12345"[2])                   # 3

# D4
t = "+998901234567"
print(t[0])                         # +
print(t[1] + t[2] + t[3])           # 998
print(t[4] + t[5])                  # 90

# D5
s = "Python"
print(s[1] + s[3] + s[5])           # yhn

# D6
s = "radar"
print(s[0] == s[-1])                # True   (r va r)
print(s[1] == s[-2])                # True   (a va a)
# "radar" — PALINDROM

# D7
# print("Salom"[5])
# IndexError: string index out of range
# "Salom" da 5 ta belgi, indekslar 0..4

# D8
# Oxirgi indeks = n - 1
s = "Dasturlash"
print(len(s) - 1)                   # 9
print(s[len(s) - 1])                # h
print(s[-1])                        # h   ← soddaroq

# D9
ism, familiya = "Ilhom", "Islomov"
print(ism[0] + "." + familiya[0] + ".")     # I.I.

# D10
print("Bingo!"[5])                  # !   ← musbat
print("Bingo!"[-1])                 # !   ← manfiy

# D11
s = "Constitution"
#    C o n s t i t u t i o  n
#    0 1 2 3 4 5 6 7 8 9 10 11
print(s[4], s[6], s[8])             # t t t   ← 3 ta

# D12
s = "Dasturlash AI"
print(s[11] + s[12])                # AI
```

</details>

---

## E · Chekinish

**E1.** Chekinishni tuzating:
```python
def salom():
print("Salom!")
```

**E2.** `kub(n)` funksiyasi yozing — sonning kubini qaytarsin. `kub(4)` natijasini chop eting.

**E3.** Quyidagi kod nima chiqaradi? **Avval taxmin qiling:**
```python
def f(x):
    x = 50
    return x

print(f(7))
```

**E4.** `return` dan **keyin** `print` qo'ying. U bajariladimi?

**E5.** Kodni to'g'ri chekintiring:
```python
def chek(narx, soni):
oraliq = narx * soni
qqs = oraliq * 0.12
return oraliq + qqs
print(chek(10000, 5))
```

**E6.** Bitta blokda `3` va `4` ta bo'sh joy aralashtiring. Xato nomi qanday?

**E7.** Ichma-ich funksiyada **nechta chekinish darajasi** bor?
```python
def tashqi():
    def ichki():
        return 1
    return ichki()
```

**E8.** Ikkita funksiya yozing va ularni ketma-ket chaqiring.

<details>
<summary>✅ E bo'limi yechimlari</summary>

```python
# E1
def salom():
    print("Salom!")
salom()                     # Salom!

# E2
def kub(n):
    return n ** 3
print(kub(4))               # 64

# E3
def f(x):
    x = 50                  # argument USTIGA yoziladi
    return x
print(f(7))                 # 50   ← 7 emas!

# E4
def sinov():
    return 42
    print("bajarilmaydi")   # O'LIK KOD
print(sinov())              # 42

# E5
def chek(narx, soni):
    oraliq = narx * soni
    qqs = oraliq * 0.12
    return oraliq + qqs

print(chek(10000, 5))       # 56000.0

# E6
# def f():
#     x = 1        ← 4 ta
#    y = 2         ← 3 ta
# IndentationError: unindent does not match any outer indentation level

# E7 — 3 ta daraja: 0, 1, 2
def tashqi():                   # 0
    def ichki():                # 1
        return 1                # 2
    return ichki()              # 1
print(tashqi())                 # 1

# E8
def a():
    return "A"

def b():
    return "B"

print(a())      # A
print(b())      # B
```

</details>

---

## F · Xatolarni toping

Har bir kodda **kamida bitta xato** bor. Toping va tuzating.

**F1.**
```python
x = 5
if x = 5:
    print("teng")
```

**F2.**
```python
soz = "Salom"
print(soz[5])
```

**F3.**
```python
jami = 100 + \ 
       200
```

**F4.**
```python
def yigindi(a, b):
return a + b
```

**F5.**
```python
# Bu izoh
Bu ham izoh
print("Salom")
```

**F6.**
```python
narx = 10000
narx == narx * 1.15
print(narx)         # 11500 kutilyapti
```

<details>
<summary>✅ F bo'limi yechimlari</summary>

```python
# F1 — `=` biriktiradi, tekshirmaydi. Shart uchun `==` kerak.
x = 5
if x == 5:
    print("teng")           # teng
# (`if` — 15-modulda)

# F2 — "Salom" da 5 ta belgi, indekslar 0..4
soz = "Salom"
print(soz[4])               # m
# yoki
print(soz[-1])              # m

# F3 — `\` dan keyin BO'SH JOY bor edi
jami = 100 + \
       200
print(jami)                 # 300

# F4 — `return` chekintirilmagan
def yigindi(a, b):
    return a + b
print(yigindi(3, 4))        # 7

# F5 — ikkinchi qatorda `#` yo'q
# Bu izoh
# Bu ham izoh
print("Salom")              # Salom

# F6 — `==` faqat TEKSHIRADI, saqlamaydi
narx = 10000
narx = narx * 1.15          # `=` kerak edi
print(narx)                 # 11500.0
```

</details>

---

## 🎯 O'zingizni baholang

Har bir to'g'ri javob — **1 ball**. Jami: **62**.

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **56–62** | 🏆 **A'lo** | 14-modulga o'ting |
| **47–55** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **37–46** | 🥉 **Qoniqarli** | Darslarni qayta o'qing, mashqlarni takrorlang |
| **0–36** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

### Bo'limlar bo'yicha tahlil

| Bo'lim | Ballim | Zaif bo'lsa qaysi darsni takrorlash |
|---|---|---|
| A · Arifmetika | ___ / 14 | [1-dars](01-Arithmetic-Operators.md) |
| B · `==` va qayta biriktirish | ___ / 12 | [2](02-The-Double-Equality-Sign.md), [3-dars](03-Reassign-Values.md) |
| C · Izoh va qator davomi | ___ / 10 | [4](04-Add-Comments.md), [5-dars](05-Line-Continuation.md) |
| D · Indekslash | ___ / 12 | [6-dars](06-Indexing-Elements.md) |
| E · Chekinish | ___ / 8 | [7-dars](07-Indentation.md) |
| F · Xatolar | ___ / 6 | Barcha darslar |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
