# 🚀 19-modul · Mini-loyihalar

> ## 🎓 **Bu — Python bo'limining YAKUNIY loyihalari.**

Bu 6 ta loyihada **10–19-modullarning HAMMASI** ishlatiladi, plyus bu modulning yangi vositasi — **modullar**:

```
import math · random · statistics · string    ← YANGI
def / return                                   ← 16-moduldan
list / tuple / dict                            ← 17-moduldan
for / while / yig'uvchi                        ← 18-moduldan
if / elif / else                               ← 15-moduldan
```

> 💡 **Yangi tamoyil:** har bir loyihada o'z yechimingizni **standart kutubxona** bilan **tekshiring**. Bu — professional dasturchilar odati.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Qaysi modullar | Qiyinlik |
|---|---|---|---|
| 1 | [Geometriya kutubxonasi](#loyiha-1--geometriya-kutubxonasi) | `math` | 🟢 |
| 2 | [Statistika — o'zim yozaman](#loyiha-2--statistika--ozim-yozaman) | `math`, `statistics` | 🟡 |
| 3 | [Parol generator](#loyiha-3--parol-generator) | `random`, `string` | 🟡 |
| 4 | [Matn tahlili](#loyiha-4--matn-tahlili) | `string`, `statistics` | 🟡 |
| 5 | [Sonlar nazariyasi](#loyiha-5--sonlar-nazariyasi) | `math` | 🔴 |
| 6 | [Zar simulyatori](#loyiha-6--zar-simulyatori) | `random` | 🔴 |

> ⚠️ **`random.seed()` haqida:** loyihalar 3 va 6 da `random.seed(42)` yozilgan. Bu — **tasodifiy sonlarni takrorlanadigan** qiladi, ya'ni siz **aynan shu natijani** olasiz. Uni **olib tashlasangiz** — har safar boshqacha natija chiqadi.

---

## Loyiha 1 · Geometriya kutubxonasi

**Vazifa:** `math` moduli bilan geometrik funksiyalar to'plamini yarating.

<details>
<summary>💻 Yechim</summary>

```python
import math

# ===== DOIRA =====
def doira_yuzasi(r):
    return math.pi * r ** 2

def doira_uzunligi(r):
    return 2 * math.pi * r

def shar_hajmi(r):
    return 4 / 3 * math.pi * r ** 3

# ===== UCHBURCHAK =====
def gipotenuza(a, b):
    return math.hypot(a, b)         # math ning MAXSUS funksiyasi

def uchburchak_yuzasi(a, b, c):
    s = (a + b + c) / 2             # Geron formulasi
    return math.sqrt(s * (s - a) * (s - b) * (s - c))

# ===== HISOBOT =====
def hisobot(r, a, b, c):
    print("Doira (r =", r, ")")
    print("  Yuza:    ", round(doira_yuzasi(r), 2))
    print("  Uzunlik: ", round(doira_uzunligi(r), 2))
    print("  Shar:    ", round(shar_hajmi(r), 2))
    print("Uchburchak (", a, b, c, ")")
    print("  Gipotenuza:", gipotenuza(a, b))
    print("  Yuza:      ", round(uchburchak_yuzasi(a, b, c), 2))
    return round(doira_yuzasi(r), 2)

print("Qaytdi:", hisobot(5, 3, 4, 5))
```

**Natija:**

```
Doira (r = 5 )
  Yuza:     78.54
  Uzunlik:  31.42
  Shar:     523.6
Uchburchak ( 3 4 5 )
  Gipotenuza: 5.0
  Yuza:       6.0
Qaytdi: 78.54
```

</details>

### 🔑 `math.hypot()` — maxsus funksiya

```python
math.hypot(3, 4)                    # 5.0
math.sqrt(3**2 + 4**2)              # 5.0   ← bir xil
```

`hypot` **aniqroq** — u juda katta yoki juda kichik sonlarda **to'lib ketmaydi** (*overflow*).

### ✏️ O'zgartirish

1. **Silindr** hajmini qo'shing: `pi * r² * h`.
2. **Konus** hajmini qo'shing: `pi * r² * h / 3`.
3. Radiusni **manfiy** qiling — validatsiya qo'shing.
4. Geron formulasida **uchburchak mavjudligini** tekshiring.
5. `math.degrees()` bilan burchakni gradusga aylantiring.

---

## Loyiha 2 · Statistika — o'zim yozaman

**Vazifa:** statistik funksiyalarni **o'zingiz yozing**, keyin `statistics` bilan **tekshiring**.

<details>
<summary>💻 Yechim</summary>

```python
import math
import statistics

sonlar = [15, 42, 8, 31, 67, 4, 23, 90, 12]

print("Ma'lumotlar:", sonlar)
print("=" * 46)

# ===== O'ZIM YOZGAN =====
def mening_ortacha(s):
    jami = 0
    for x in s:
        jami += x
    return jami / len(s)

def mening_median(s):
    t = sorted(s)
    n = len(t)
    if n % 2 == 1:
        return t[n // 2]
    return (t[n // 2 - 1] + t[n // 2]) / 2

def standart_ogish(s):
    o = mening_ortacha(s)
    kv = 0
    for x in s:
        kv += (x - o) ** 2
    return math.sqrt(kv / len(s))

# ===== SOLISHTIRISH =====
print("O'rtacha (o'zim):     ", round(mening_ortacha(sonlar), 4))
print("O'rtacha (statistics):", round(statistics.mean(sonlar), 4))
print("Median (o'zim):       ", mening_median(sonlar))
print("Median (statistics):  ", statistics.median(sonlar))
print("St. og'ish (o'zim):   ", round(standart_ogish(sonlar), 4))
print("St. og'ish (stats):   ", round(statistics.pstdev(sonlar), 4))
print("-" * 46)
print("Tekshiruv:", round(mening_ortacha(sonlar), 6) == round(statistics.mean(sonlar), 6))
```

**Natija:**

```
Ma'lumotlar: [15, 42, 8, 31, 67, 4, 23, 90, 12]
==============================================
O'rtacha (o'zim):      32.4444
O'rtacha (statistics): 32.4444
Median (o'zim):        23
Median (statistics):   23
St. og'ish (o'zim):    27.5242
St. og'ish (stats):    27.5242
----------------------------------------------
Tekshiruv: True
```

</details>

### 🔑 Nima uchun bu qimmatli?

Modullar mavjud bo'lsa ham, **ular ichida nima borligini** bilish kerak. Aks holda:
- Xato natija **sezmay** qolasiz
- Modul **yo'q** bo'lganda ish to'xtaydi
- Suhbatda "median qanday hisoblanadi?" degan savolga **javob bera olmaysiz**

### ⚠️ `pstdev` va `stdev` farqi

| Funksiya | Nima | Bo'luvchi |
|---|---|---|
| `statistics.pstdev()` | **Populyatsiya** og'ishi | `n` |
| `statistics.stdev()` | **Tanlanma** og'ishi | `n - 1` |

Bizning formulamiz `n` ga bo'ladi → **`pstdev`** bilan mos keladi.

### ✏️ O'zgartirish

1. `moda` (eng ko'p uchraydigan) funksiyasini yozing.
2. `statistics.mode()` bilan tekshiring.
3. **Diapazon** (`max - min`) funksiyasini qo'shing.
4. **Dispersiya** ni qo'shing (og'ish kvadrati).
5. Bo'sh ro'yxat berilsa — **validatsiya** qo'shing.

---

## Loyiha 3 · Parol generator

**Vazifa:** `random` va `string` bilan xavfsiz parol yarating va **baholang**.

<details>
<summary>💻 Yechim</summary>

```python
import random
import string

random.seed(42)                     # natija TAKRORLANADIGAN bo'lsin

# ===== BELGILAR TO'PLAMI =====
kichik = string.ascii_lowercase     # abcdefghijklmnopqrstuvwxyz
katta  = string.ascii_uppercase     # ABCDEFGHIJKLMNOPQRSTUVWXYZ
raqam  = string.digits              # 0123456789
belgi  = "!@#$%&*"

# ===== YARATISH =====
def parol_yarat(uzunlik):
    manba = kichik + katta + raqam + belgi
    p = ""
    for i in range(uzunlik):
        p += random.choice(manba)
    return p

# ===== BAHOLASH =====
def kuchini_baholash(p):
    ball = 0
    turlar = {"kichik": False, "katta": False, "raqam": False, "belgi": False}

    for h in p:
        if h in kichik:
            turlar["kichik"] = True
        elif h in katta:
            turlar["katta"] = True
        elif h in raqam:
            turlar["raqam"] = True
        elif h in belgi:
            turlar["belgi"] = True

    for k in turlar:
        if turlar[k]:
            ball += 1

    if len(p) >= 12:
        ball += 2
    elif len(p) >= 8:
        ball += 1

    return ball, turlar

# ===== HISOBOT =====
p = parol_yarat(14)
b, t = kuchini_baholash(p)

print("Parol:", p)
print("Uzunlik:", len(p))
print("-" * 40)
for k in t:
    if t[k]:
        print(" ", k, ": bor")
    else:
        print(" ", k, ": yo'q")
print("-" * 40)
print("Ball:", b, "/ 6")
if b >= 6:
    print("Daraja: JUDA KUCHLI")
elif b >= 5:
    print("Daraja: KUCHLI")
elif b >= 3:
    print("Daraja: O'RTACHA")
else:
    print("Daraja: ZAIF")
```

**Natija:**

```
Parol: odJFCrnl2edlBD
Uzunlik: 14
----------------------------------------
  kichik : bor
  katta : bor
  raqam : bor
  belgi : yo'q
----------------------------------------
Ball: 5 / 6
Daraja: KUCHLI
```

</details>

### 🔑 `in` operatori

```python
if h in kichik:
```

`in` — element **to'plamda bormi** deb tekshiradi. Bu — **17-modul**dagi `'Tesla' in narxlar` bilan **bir xil** operator.

### ⚠️ Diqqat: hech qanday belgi tushmadi!

14 ta tasodifiy belgi tanlansa ham, **maxsus belgi tushmasligi** mumkin. Bu — haqiqiy parol generatorining **kamchiligi**.

**To'g'ri yechim:** har bir turdan **kamida bittasini kafolatlash**.

### ✏️ O'zgartirish

1. `random.seed()` ni **olib tashlang** — har safar boshqa parol.
2. Har bir turdan **kamida bittasini kafolatlang**.
3. Uzunlikni **parametr** qiling.
4. **10 ta** parol yarating va eng kuchlisini toping.
5. Foydalanuvchi paroli uchun **tavsiya** funksiyasini qo'shing.

---

## Loyiha 4 · Matn tahlili

**Vazifa:** matnni tozalab, so'z chastotasini hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
import string
import statistics

matn = "Python dasturlash tili juda qiziqarli. Python oson va foydali."

print("Matn:", matn)
print("=" * 60)

# ===== TOZALASH =====
def tozalash(m):
    natija = ""
    for h in m.lower():
        if h in string.ascii_lowercase or h == " ":
            natija += h
    return natija

# ===== CHASTOTA =====
def sozlar_chastotasi(m):
    sozlar = tozalash(m).split()
    ch = {}
    for s in sozlar:
        if s in ch:
            ch[s] += 1
        else:
            ch[s] = 1
    return ch

ch = sozlar_chastotasi(matn)

print("Jami so'zlar:  ", len(tozalash(matn).split()))
print("Turli so'zlar: ", len(ch))
print("-" * 60)

# ===== ENG KO'P =====
eng_kop = ""
eng_soni = 0
for s in ch:
    if ch[s] > eng_soni:
        eng_soni = ch[s]
        eng_kop = s
print("Eng ko'p so'z:", eng_kop, "-", eng_soni, "marta")

# ===== TAKRORLANGANLAR =====
takror = []
for s in ch:
    if ch[s] > 1:
        takror.append(s)
print("Takrorlanganlar:", takror)

# ===== O'RTACHA UZUNLIK =====
uz = []
for s in ch:
    uz.append(len(s))
print("O'rtacha so'z uzunligi:", round(statistics.mean(uz), 2))
```

**Natija:**

```
Matn: Python dasturlash tili juda qiziqarli. Python oson va foydali.
============================================================
Jami so'zlar:   9
Turli so'zlar:  8
------------------------------------------------------------
Eng ko'p so'z: python - 2 marta
Takrorlanganlar: ['python']
O'rtacha so'z uzunligi: 5.75
```

</details>

### 🔑 Tozalash nima uchun kerak?

```
"Python."  va  "Python"     ← TURLI so'zlar deb hisoblanadi!
```

`tozalash()` **nuqta, vergul** va boshqa belgilarni olib tashlaydi va hammasini **kichik harfga** o'giradi. Shundagina `"Python"` va `"python."` **bir xil** deb sanaladi.

> ## 🔑 **Bu — NLP ning (20-modul) BIRINCHI qadami!** U yerda bu **tokenizatsiya** va **normalizatsiya** deb ataladi.

### ✏️ O'zgartirish

1. Boshqa matn bilan sinang.
2. **Harflar** chastotasini ham hisoblang.
3. Faqat **3 harfdan uzun** so'zlarni hisoblang.
4. Chastota lug'atini **kamayish tartibida** chiqaring.
5. Ikki matnni solishtirib, **umumiy so'zlarni** toping.

---

## Loyiha 5 · Sonlar nazariyasi

**Vazifa:** tub sonlar, bo'luvchilar, EKUB va EKUK ni **o'zingiz** hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
import math

# ===== TUB SONMI? =====
def tubmi(n):
    if n < 2:
        return False
    d = 2
    natija = True
    while d * d <= n:
        if n % d == 0:
            natija = False
        d += 1
    return natija

# ===== BO'LUVCHILAR =====
def bolvchilar(n):
    b = []
    for d in range(1, n + 1):
        if n % d == 0:
            b.append(d)
    return b

# ===== EKUB (Evklid algoritmi) =====
def ekub(a, b):
    while b != 0:
        a, b = b, a % b         # tuple biriktirish! (17-modul)
    return a

# ===== EKUK =====
def ekuk(a, b):
    return a * b // ekub(a, b)

# ===== HISOBOT =====
print("Tub sonlar 1-50:")
tublar = []
for n in range(1, 51):
    if tubmi(n):
        tublar.append(n)
print(" ", tublar)
print("Soni:", len(tublar))
print("-" * 50)

print("36 ning bo'luvchilari:", bolvchilar(36))
print("EKUB(48, 18) =", ekub(48, 18))
print("EKUK(4, 6)   =", ekuk(4, 6))
print("Tekshiruv:", ekub(48,18) == math.gcd(48,18), ekuk(4,6) == math.lcm(4,6))
```

**Natija:**

```
Tub sonlar 1-50:
  [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
Soni: 15
--------------------------------------------------
36 ning bo'luvchilari: [1, 2, 3, 4, 6, 9, 12, 18, 36]
EKUB(48, 18) = 6
EKUK(4, 6)   = 12
Tekshiruv: True True
```

</details>

### 🔑 Uchta chiroyli g'oya

**1 · `d * d <= n`** — nima uchun `n` gacha emas?

Agar `n = a × b` bo'lsa va `a > √n` bo'lsa — u holda `b < √n`. Demak, **√n gacha** tekshirish **yetarli**. Bu — **10 barobar tezroq**.

**2 · Evklid algoritmi** — 2300 yildan beri ishlaydi:

```
ekub(48, 18):
  48, 18  →  18, 48%18=12
  18, 12  →  12, 18%12=6
  12,  6  →   6, 12%6=0
   6,  0  →  TO'XTASH,  natija: 6
```

**3 · `a, b = b, a % b`** — bu **tuple biriktirish** *(17-modul!)*. Bir qatorda ikki o'zgaruvchi **bir vaqtda** o'zgaradi.

### ✏️ O'zgartirish

1. `tubmi()` ni `d*d <= n` **o'rniga** `d < n` bilan yozing. Sekinroqmi?
2. **1000 gacha** tub sonlarni sanang.
3. **Mukammal son** ni toping *(bo'luvchilari yig'indisi o'ziga teng: 6 = 1+2+3)*.
4. **Faktorial** funksiyasini yozing va `math.factorial()` bilan tekshiring.
5. **Fibonachchi** ketma-ketligini yarating.

---

## Loyiha 6 · Zar simulyatori

**Vazifa:** ikki zarni 10 000 marta tashlab, natijani **nazariy ehtimollik** bilan solishtiring.

<details>
<summary>💻 Yechim</summary>

```python
import random

random.seed(7)                      # natija TAKRORLANADIGAN bo'lsin

# ===== ZAR =====
def zar_tashlash():
    return random.randint(1, 6)

def ikki_zar():
    return zar_tashlash(), zar_tashlash()       # TUPLE qaytaradi

# ===== SIMULYATSIYA =====
def simulyatsiya(n):
    natijalar = {}
    for i in range(2, 13):
        natijalar[i] = 0            # 2 dan 12 gacha, hammasi 0
    for i in range(n):
        a, b = ikki_zar()           # tuple biriktirish
        natijalar[a + b] += 1
    return natijalar

# ===== NAZARIY EHTIMOLLIK =====
nazariy = {2:1, 3:2, 4:3, 5:4, 6:5, 7:6, 8:5, 9:4, 10:3, 11:2, 12:1}
# 36 ta kombinatsiyadan nechtasi shu yig'indini beradi

# ===== HISOBOT =====
n = 10000
r = simulyatsiya(n)

print("Ikki zar,", n, "marta tashlandi")
print("=" * 52)
print("Yig'indi | Soni  | Foiz   | Nazariy")
print("-" * 52)
for s in r:
    foiz = r[s] / n * 100
    naz = nazariy[s] / 36 * 100
    print("   ", s, "\t|", r[s], "\t|", round(foiz, 2), "\t|", round(naz, 2))
print("=" * 52)

eng_kop = 0
eng_s = 0
for s in r:
    if r[s] > eng_kop:
        eng_kop = r[s]
        eng_s = s
print("Eng ko'p chiqqan yig'indi:", eng_s, "(", eng_kop, "marta )")
print("Nazariy eng ehtimolli:     7")
```

**Natija:**

```
Ikki zar, 10000 marta tashlandi
====================================================
Yig'indi | Soni  | Foiz   | Nazariy
----------------------------------------------------
    2 	| 278 	| 2.78 	| 2.78
    3 	| 565 	| 5.65 	| 5.56
    4 	| 855 	| 8.55 	| 8.33
    5 	| 1119 	| 11.19 	| 11.11
    6 	| 1382 	| 13.82 	| 13.89
    7 	| 1700 	| 17.0 	| 16.67
    8 	| 1391 	| 13.91 	| 13.89
    9 	| 1061 	| 10.61 	| 11.11
    10 	| 826 	| 8.26 	| 8.33
    11 	| 517 	| 5.17 	| 5.56
    12 	| 306 	| 3.06 	| 2.78
====================================================
Eng ko'p chiqqan yig'indi: 7 ( 1700 marta )
Nazariy eng ehtimolli:     7
```

</details>

### 🔑 Nima uchun 7 eng ko'p chiqadi?

Ikki zarda **36** ta kombinatsiya bor. Yig'indi **7** bo'lishi uchun **6 ta** yo'l bor:

```
1+6   2+5   3+4   4+3   5+2   6+1
```

Yig'indi **2** bo'lishi uchun esa **faqat 1 ta**: `1+1`.

### 🔑 Katta sonlar qonuni

Simulyatsiya natijalari nazariy qiymatlarga **juda yaqin**. Bu — **katta sonlar qonuni**: tajribalar soni ortgan sari **haqiqiy ehtimollik** ga yaqinlashadi.

> ## 💡 **Bu — Monte-Karlo usuli — moliya, fizika va AI'da keng ishlatiladi.**

### ✏️ O'zgartirish

1. `n = 100` qiling. Natija nazariyga **yaqinmi**?
2. `n = 1000000` qiling. **Yaqinroqmi**?
3. `random.seed()` ni olib tashlang — har safar boshqa natija.
4. **Uchta** zar bilan sinang (3–18).
5. Har bir yig'indi uchun **grafik** chizing (`*` belgilari bilan).

---

## 🏆 YAKUNIY LOYIHA · Python bo'limining CHO'QQISI

> ## 🎓 **Bu — 10 ta modul davomida o'rgangan HAMMA NARSANGIZNI birlashtirish.**

```
☐ Kamida 2 ta standart kutubxona moduli (math, random, statistics, string...)
☐ Kamida 5 ta funksiya
☐ Kamida 1 ta funksiya BOSHQA funksiyani chaqirsin
☐ list, tuple va dict — uchtasi ham
☐ Kamida 1 ta ICHMA-ICH tuzilma
☐ for va while — ikkalasi ham
☐ Kamida 1 ta ICHMA-ICH sikl
☐ if / elif / else
☐ Kamida 3 ta yig'uvchi (sanoqchi / yig'indi / ro'yxat)
☐ Kamida 1 ta VALIDATSIYA
☐ Natijani standart kutubxona bilan TEKSHIRISH
☐ Har bir funksiyaga IZOH
☐ Chiroyli formatlangan hisobot
```

### G'oyalar — real loyihalar

| Loyiha | Modullar | Nima qiladi |
|---|---|---|
| **Shaxsiy byudjet tahlilchisi** | `statistics`, `datetime` | Xarajatlar tahlili, prognoz |
| **Talabalar reyting tizimi** | `statistics` | Baholar, GPA, reyting |
| **Kripto narx simulyatori** | `random`, `math` | Tasodifiy narx harakati |
| **So'z o'yini** | `random`, `string` | Yashirin so'zni topish |
| **Kutubxona tizimi** | `datetime` | Kitoblar, qarzdorlik, jarima |
| **Fitnes tracker** | `statistics`, `math` | BMI, kaloriya, progress |
| **Matn shifrlagich** | `string`, `random` | Sezar shifri, kalit |
| **Sport statistikasi** | `statistics` | O'yinchilar, o'rtachalar, reyting |
| **Sinov generatori** | `random` | Tasodifiy savollar, baholash |
| **Ob-havo tahlilchisi** | `statistics`, `math` | 30 kunlik ma'lumot, trend |

### Shablon

```python
# ===============================================
#   LOYIHA NOMI
#   Muallif: ______
#   Sana: ______
# ===============================================

# ===== 1 · MODULLAR =====
import math
import statistics
import random

# ===== 2 · MA'LUMOTLAR =====
ma_lumotlar = {}
royxat = []

# ===== 3 · YORDAMCHI FUNKSIYALAR =====
def tekshir(x):
    """Kiritilgan ma'lumotni tekshiradi."""
    if len(x) == 0:
        return False
    return True

def hisobla(x):
    """Asosiy hisob."""
    jami = 0
    for item in x:
        jami += item
    return jami

def ortacha(x):
    """hisobla() ni ishlatadi."""
    return hisobla(x) / len(x)

# ===== 4 · ASOSIY MANTIQ =====
def tahlil(x):
    if not tekshir(x):
        return {"xato": "Bo'sh ma'lumot"}

    natija = {}
    natija["soni"] = len(x)
    natija["jami"] = hisobla(x)
    natija["ortacha"] = round(ortacha(x), 2)
    return natija

# ===== 5 · TEKSHIRUV =====
# O'z hisobingizni standart kutubxona bilan solishtiring:
# print(ortacha(royxat) == statistics.mean(royxat))

# ===== 6 · HISOBOT =====
def hisobot(x):
    n = tahlil(x)
    print("=" * 50)
    for kalit in n:
        print(kalit, ":", n[kalit])
    print("=" * 50)
    return n

# ===== 7 · ISHGA TUSHIRISH =====
hisobot([15, 42, 8, 31])
```

---

## ✅ Yakuniy tekshiruv

```
☐ Kod xatosiz ishladimi?
☐ Modullarni to'g'ri import qildimmi?
☐ Natijani standart kutubxona bilan TEKSHIRDIMmi?
☐ Har bir funksiya BITTA vazifa bajaradimi?
☐ VALIDATSIYA bormi? (bo'sh ro'yxat, 0, manfiy)
☐ Cheksiz sikl yo'qmi?
☐ Yig'uvchilar noldan boshlanadimi?
☐ return SIKLDAN TASHQARIDAmi?
☐ Kod boshqa odam uchun TUSHUNARLImi?
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

## 🎓 Tabriklaymiz!

Agar barcha 6 ta loyihani va yakuniy loyihani bajargan bo'lsangiz — siz **Python bo'limini tugatdingiz**.

Endi sizda **AI muhandisligiga** o'tish uchun barcha asosiy vositalar bor:

```
o'zgaruvchi · shart · funksiya · ketma-ketlik · sikl · modul
                            ↓
              NLP · LLM · LangChain · Vector DB
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
