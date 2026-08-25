# 🚀 15-modul · Mini-loyihalar

Bu 6 ta loyiha — **shartlar** bilan qurilgan **haqiqiy dasturlar**. Endi kodingiz **qaror qabul qiladi**.

```
if / elif / else              ← YANGI
==  !=  >  <  >=  <=          ← 14-moduldan
and  or  not                  ← 14-moduldan
ichma-ich shartlar            ← YANGI
```

**Sikllar (`for`, `while`) hali YO'Q** — ular 18-modulda.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | [Baho tizimi](#loyiha-1--baho-tizimi) | Ko'p `elif`, tartib | 🟢 |
| 2 | [Aqlli chek](#loyiha-2--aqlli-chek) | Bosqichli chegirma + qo'shimcha shart | 🟢 |
| 3 | [Oydagi kunlar](#loyiha-3--oydagi-kunlar) | Ichma-ich shart + kabisa yili | 🟡 |
| 4 | [Kvadrat tenglama](#loyiha-4--kvadrat-tenglama) | 3 daraja ichma-ich shart | 🔴 |
| 5 | [Yo'l politsiyasi](#loyiha-5--yol-politsiyasi) | Jarima shkalasi + koeffitsient | 🟡 |
| 6 | [Parol ball tizimi](#loyiha-6--parol-ball-tizimi) | Ball to'plash + daraja | 🔴 |

---

## Loyiha 1 · Baho tizimi

**Vazifa:** ballni harfli bahoga aylantiring va o'tgan-o'tmaganini aniqlang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOT =====
ball = 87

# ===== NATIJA =====
print("Ball:", ball)
print("-" * 30)

# ===== BAHO =====
if ball < 0 or ball > 100:
    print("XATO: ball 0-100 oralig'ida bo'lishi kerak")
elif ball >= 90:
    print("Baho: A   (A'lo)")
elif ball >= 80:
    print("Baho: B   (Yaxshi)")
elif ball >= 70:
    print("Baho: C   (Qoniqarli)")
elif ball >= 60:
    print("Baho: D   (Qoniqarsiz)")
else:
    print("Baho: F   (Yiqildi)")

# ===== O'TDIMI? =====
if ball >= 60:
    print("Holat: O'TDI")
else:
    print("Holat: O'TMADI")
```

**Natija:**

```
Ball: 87
------------------------------
Baho: B   (Yaxshi)
Holat: O'TDI
```

</details>

### 🔑 Ikkita hiyla

**1 · Validatsiya birinchi.** `ball < 0 or ball > 100` shartini **eng oldin** qo'ydik. Agar kiritilgan ma'lumot noto'g'ri bo'lsa, qolgan hech narsani tekshirish shart emas.

**2 · Tartib.** Shartlar **kattadan kichikka**: `>= 90`, `>= 80`, `>= 70`... Teskarisiga qo'ysangiz — **hamma narsa buziladi**.

### ✏️ O'zgartirish

1. `ball = 45`, `ball = 100`, `ball = -5` bilan sinang.
2. Shartlar tartibini **teskarisiga** o'zgartiring. Nima buziladi?
3. `A+` bahosini qo'shing (`>= 97`).
4. Bahoga qarab **stipendiya** ham chiqaring.
5. `ball >= 60` shartini asosiy `if/elif` zanjiriga **birlashtiring**.

---

## Loyiha 2 · Aqlli chek

**Vazifa:** summa va mijoz toifasiga qarab chegirmani hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
mahsulot = "Noutbuk"
narx     = 8500000
soni     = 2
doimiy   = True

oraliq = narx * soni

# ===== BOSQICHLI CHEGIRMA =====
if oraliq > 20000000:
    foiz = 20
elif oraliq > 10000000:
    foiz = 15
elif oraliq > 5000000:
    foiz = 10
else:
    foiz = 0

# ===== DOIMIY MIJOZGA BONUS =====
if doimiy and foiz < 20:
    foiz = foiz + 5

# ===== HISOB =====
chegirma = oraliq * foiz / 100
qqs      = (oraliq - chegirma) * 0.12
jami     = oraliq - chegirma + qqs

# ===== CHEK =====
print(mahsulot, "x", soni)
print("-" * 34)
print("Oraliq summa: ", oraliq)
print("Chegirma:     ", foiz, "%  =", chegirma)
print("QQS (12%):    ", qqs)
print("-" * 34)
print("JAMI:         ", jami)
```

**Natija:**

```
Noutbuk x 2
----------------------------------
Oraliq summa:  17000000
Chegirma:      20 %  = 3400000.0
QQS (12%):     1632000.0
----------------------------------
JAMI:          15232000.0
```

</details>

### 🔑 Naqsh: shart natijasini SAQLASH

E'tibor bering: `if/elif` **chop etmaydi** — u `foiz` o'zgaruvchisini **hisoblaydi**. Keyin ikkinchi `if` uni **o'zgartiradi**.

```
1-shart  →  foiz = 15
2-shart  →  foiz = 15 + 5 = 20
hisob    →  20% ishlatiladi
```

Bu — **eng foydali naqsh**: mantiqni chiqarishdan **ajratish**.

### ✏️ O'zgartirish

1. `soni = 1` qiling — chegirma foizi qanday o'zgaradi?
2. `doimiy = False` qiling.
3. `if doimiy and foiz < 20` dagi `and foiz < 20` ni **olib tashlang**. Nima o'zgaradi?
4. **Chegirma summasi** `2 000 000` dan oshmasin degan cheklov qo'shing.
5. Chegirmasiz summa bilan **taqqoslash** qatorini qo'shing (`Tejadingiz: ...`).

---

## Loyiha 3 · Oydagi kunlar

**Vazifa:** yil va oy berilgan. Bu oyda necha kun bor?

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
yil = 2024
oy  = 2

# ===== VALIDATSIYA =====
if oy < 1 or oy > 12:
    print("XATO: oy 1-12 oralig'ida bo'lishi kerak")
else:
    # ===== KUNLAR SONI =====
    if oy == 1 or oy == 3 or oy == 5 or oy == 7 or oy == 8 or oy == 10 or oy == 12:
        kun = 31
    elif oy == 4 or oy == 6 or oy == 9 or oy == 11:
        kun = 30
    elif yil % 4 == 0 and (yil % 100 != 0 or yil % 400 == 0):
        kun = 29                # kabisa yilining fevrali
    else:
        kun = 28                # oddiy yilning fevrali

    print(yil, "-yil,", oy, "-oy")
    print("Kunlar soni:", kun)
```

**Natija:**

```
2024 -yil, 2 -oy
Kunlar soni: 29
```

</details>

### 🔑 Nozik joy

Fevral uchun **alohida** `elif` yozmadik. Buning o'rniga:
- `31` kunli oylar → birinchi shart
- `30` kunli oylar → ikkinchi shart
- **qolgani faqat fevral** → kabisa tekshiruvi

Bu — **shartlar zanjirining** kuchi: keyingi shartga yetganda oldingilarning **yolg'onligi kafolatlangan**.

### ✏️ O'zgartirish

1. `oy = 2, yil = 1900` bilan sinang. `28` chiqadimi?
2. `oy = 13` bilan sinang.
3. Oy **nomini** ham chiqaring.
4. Yildagi **jami kunlarni** hisoblang (`365 + kabisa`).
5. Fevral uchun **alohida** `elif` yozing — kod tushunarliroq bo'ladimi?

---

## Loyiha 4 · Kvadrat tenglama

**Vazifa:** `ax² + bx + c = 0` ni yeching — **barcha** holatlar bilan.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
a, b, c = 1, -5, 6

print("Tenglama:", a, "x^2 +", b, "x +", c, "= 0")
print("-" * 34)

# ===== YECHISH =====
if a == 0:
    # kvadrat emas — chiziqli
    if b == 0:
        if c == 0:
            print("Cheksiz ko'p yechim")
        else:
            print("Yechim yo'q")
    else:
        print("Chiziqli tenglama, x =", -c / b)
else:
    d = b**2 - 4*a*c
    print("Diskriminant:", d)
    if d > 0:
        x1 = (-b + d**0.5) / (2*a)
        x2 = (-b - d**0.5) / (2*a)
        print("Ikkita yechim: x1 =", x1, " x2 =", x2)
    elif d == 0:
        print("Bitta yechim: x =", -b / (2*a))
    else:
        print("Haqiqiy yechim yo'q")
```

**Natija:**

```
Tenglama: 1 x^2 + -5 x + 6 = 0
----------------------------------
Diskriminant: 1
Ikkita yechim: x1 = 3.0  x2 = 2.0
```

</details>

### 🔑 Uch daraja ichma-ich

```
if a == 0:                    ← 1-daraja
    if b == 0:                ← 2-daraja
        if c == 0:            ← 3-daraja
            ...
```

Bu — **eng chuqur** ichma-ichlik. Undan **ko'proq** bo'lsa — kodni **qayta yozish** kerak.

> ⚠️ **Nima uchun `a == 0` ni tekshiramiz?** Chunki `2*a` bo'luvchi bo'ladi. `a = 0` bo'lsa — `ZeroDivisionError`.

### ✏️ O'zgartirish

1. `a, b, c = 1, 2, 1` — bitta yechim chiqadimi?
2. `a, b, c = 1, 0, 5` — haqiqiy yechim bormi?
3. `a, b, c = 0, 3, -6` — chiziqli tenglama.
4. `a, b, c = 0, 0, 0` va `0, 0, 5` — ikkalasini ham sinang.
5. Yechimlarni **2 xonagacha** yaxlitlang (`round`).

---

## Loyiha 5 · Yo'l politsiyasi

**Vazifa:** tezlikni tekshirib, jarimani hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
tezlik      = 95
chegara     = 70
maktab_yoni = False

farq = tezlik - chegara

print("Tezlik:", tezlik, "km/s   Chegara:", chegara, "km/s")
print("-" * 40)

# ===== JARIMA SHKALASI =====
if farq <= 0:
    print("Qoidabuzarlik yo'q")
    jarima = 0
elif farq <= 10:
    print("Ogohlantirish")
    jarima = 0
elif farq <= 20:
    print("Yengil qoidabuzarlik")
    jarima = 300000
elif farq <= 40:
    print("O'rtacha qoidabuzarlik")
    jarima = 750000
else:
    print("OG'IR qoidabuzarlik")
    jarima = 2000000

# ===== KOEFFITSIENT =====
if maktab_yoni and jarima > 0:
    jarima = jarima * 2
    print("Maktab yoni — jarima IKKI BARAVAR")

# ===== NATIJA =====
print("-" * 40)
print("Oshib ketdi:", farq, "km/s")
print("Jarima:", jarima, "so'm")
```

**Natija:**

```
Tezlik: 95 km/s   Chegara: 70 km/s
----------------------------------------
O'rtacha qoidabuzarlik
----------------------------------------
Oshib ketdi: 25 km/s
Jarima: 750000 so'm
```

</details>

### ✏️ O'zgartirish

1. `tezlik = 65` qiling — qoidabuzarlik bormi?
2. `tezlik = 130`, `maktab_yoni = True` qiling.
3. `and jarima > 0` ni olib tashlang. Nima o'zgaradi? *(Ilgak: `0 * 2` nima?)*
4. **Tungi vaqt** koeffitsientini qo'shing (×1.5).
5. Ikkinchi marta qoidabuzarlik — jarima **uch baravar**.

---

## Loyiha 6 · Parol ball tizimi

**Vazifa:** parolni **ball** bilan baholang (0–5), keyin darajaga aylantiring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOT =====
p = "Uzbek2025"
n = len(p)

print("Parol:", p, "  Uzunlik:", n)
print("-" * 34)

# ===== BALL TO'PLASH =====
ball = 0

if n >= 8:
    ball = ball + 2
elif n >= 6:
    ball = ball + 1

if p[0] == p[0].upper():
    ball = ball + 1

if p[-1] == "0" or p[-1] == "1" or p[-1] == "2" or p[-1] == "3" or p[-1] == "4" \
   or p[-1] == "5" or p[-1] == "6" or p[-1] == "7" or p[-1] == "8" or p[-1] == "9":
    ball = ball + 1

if n >= 12:
    ball = ball + 1

print("Ball:", ball, "/ 5")
print("-" * 34)

# ===== DARAJA =====
if ball >= 5:
    print("Daraja: JUDA KUCHLI")
elif ball >= 4:
    print("Daraja: KUCHLI")
elif ball >= 3:
    print("Daraja: O'RTACHA")
elif ball >= 2:
    print("Daraja: ZAIF")
else:
    print("Daraja: JUDA ZAIF")
```

**Natija:**

```
Parol: Uzbek2025   Uzunlik: 9
----------------------------------
Ball: 4 / 5
----------------------------------
Daraja: KUCHLI
```

</details>

### 🔑 Ikkita naqsh birga

**1 · Ball to'plash.** Har bir mezon **alohida** `if` — ular bir-biriga bog'liq **emas**, shuning uchun `elif` **kerak emas**.

**2 · Ballni darajaga aylantirish.** Bu — **bog'liq** shartlar, shuning uchun `elif` **kerak**.

> 🔑 **Qoida:** shartlar **bir-birini istisno qilsa** → `elif`. **Mustaqil** bo'lsa → alohida `if`.

### ✏️ O'zgartirish

1. `p = "abc"` bilan sinang.
2. `p = "SuperMaxfiyParol2025"` bilan sinang.
3. Uzunlik uchun `\` o'rniga **qavslar** ishlating.
4. Yangi mezon: parolda **maxsus belgi** bo'lsin (`!`, `?`, `#`).
5. Har bir mezon uchun **✅/❌** ham chiqaring.

---

## 🏆 Yakuniy loyiha · O'z qaror tizimingiz

```
☐ Kamida 10 ta o'zgaruvchi
☐ if / elif / else — uchalasi ham
☐ Kamida 4 ta elif
☐ Kamida 1 ta ICHMA-ICH shart
☐ Kamida 1 ta VALIDATSIYA (xato ma'lumotni tekshirish)
☐ and / or / not — uchalasi ham
☐ Har bir bo'limga izoh
☐ Chiroyli formatlangan natija
```

### G'oyalar

| Loyiha | Qanday qaror |
|---|---|
| **Universitetga qabul** | Ball, imtiyoz, kvota, yo'nalish |
| **Kredit kalkulyatori** | Daromad, staj, yosh, kredit tarixi |
| **Taksi narxi** | Masofa, vaqt, tarif, kutish |
| **Sug'urta** | Yosh, staj, avtomobil, hodisalar |
| **O'yin qoidalari** | Sog'liq, daraja, qurol, dushman |
| **Ovqat tavsiyasi** | Kaloriya, allergiya, vegetarian, budjet |
| **Havo prognozi** | Harorat, namlik, shamol → kiyim tavsiyasi |

### Shablon

```python
# ===============================================
#   TIZIM NOMI
#   Muallif: ______
# ===============================================

# ===== 1 · KIRISH MA'LUMOTLARI =====


# ===== 2 · VALIDATSIYA =====
if ...:
    print("XATO: ...")
else:

    # ===== 3 · ASOSIY MANTIQ =====
    if ...:
        natija = ...
    elif ...:
        natija = ...
    else:
        natija = ...

    # ===== 4 · QO'SHIMCHA SHARTLAR =====


    # ===== 5 · CHIQISH =====
    print("=" * 40)

    print("=" * 40)
```

---

## ✅ O'zingizni tekshiring

```
☐ Kod xatosiz ishladimi?
☐ Shartlar TARTIBI to'g'rimi? (tor → keng)
☐ Har bir if ga MOS else bormi?
☐ Ikki nuqta va chekinishni to'g'ri qo'ydimmi?
☐ Foydasiz (hech qachon bajarilmaydigan) shart yo'qmi?
☐ Chegaraviy qiymatlarni sinab ko'rdimmi? (0, manfiy, juda katta)
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
