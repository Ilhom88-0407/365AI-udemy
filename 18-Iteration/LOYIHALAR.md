# 🚀 18-modul · Mini-loyihalar

Bu 6 ta loyiha — **to'liq ishlaydigan dasturlar**. Endi sizda **hamma narsa** bor:

```
for / while             ← YANGI
range()                 ← YANGI
yig'uvchi o'zgaruvchi   ← YANGI
lug'at iteratsiyasi     ← YANGI
list / tuple / dict     ← 17-moduldan
def / return            ← 16-moduldan
if / elif / else        ← 15-moduldan
```

> ## 🎉 **Bu — Python bo'limining eng katta bosqichi.** Endi siz **haqiqiy dasturlar** yozasiz, mashqlar emas.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | [Baholar hisoboti](#loyiha-1--baholar-hisoboti) | Parallel ro'yxatlar + sanoqchi | 🟢 |
| 2 | [Kassa tizimi](#loyiha-2--kassa-tizimi) | Lug'at iteratsiyasi + chegirma | 🟡 |
| 3 | [Matn tahlilchisi](#loyiha-3--matn-tahlilchisi) | `split` + harflar chastotasi | 🟡 |
| 4 | [Kredit jadvali](#loyiha-4--kredit-jadvali) | `while` + moliyaviy hisob | 🔴 |
| 5 | [Sonlar tahlilchisi](#loyiha-5--sonlar-tahlilchisi) | Ichma-ich sikl + tub sonlar | 🔴 |
| 6 | [Ombor boshqaruvi](#loyiha-6--ombor-boshqaruvi) | To'liq hisobot tizimi | 🔴 |

---

## Loyiha 1 · Baholar hisoboti

**Vazifa:** parallel ro'yxatlar bo'ylab aylanib, to'liq hisobot chiqaring.

<details>
<summary>💻 Yechim</summary>

```python
talabalar = ["Ali", "Vali", "Hasan", "Husan", "Karim", "Nodira"]
ballar    = [87, 65, 92, 45, 78, 96]

print("TALABALAR HISOBOTI")
print("=" * 42)

# ===== YIG'UVCHILAR =====
otganlar = 0
yiqilganlar = 0
alolar = []

# ===== ASOSIY SIKL =====
for i in range(len(talabalar)):
    ball = ballar[i]

    # Baho
    if ball >= 90:
        baho = "A"
        alolar.append(talabalar[i])
    elif ball >= 80:
        baho = "B"
    elif ball >= 70:
        baho = "C"
    elif ball >= 60:
        baho = "D"
    else:
        baho = "F"

    # O'tdimi?
    if ball >= 60:
        holat = "O'TDI"
        otganlar += 1
    else:
        holat = "O'TMADI"
        yiqilganlar += 1

    print(talabalar[i], "\t", ball, "\t", baho, "\t", holat)

# ===== XULOSA =====
print("=" * 42)
print("Jami:      ", len(talabalar))
print("O'tganlar: ", otganlar)
print("Yiqilganlar:", yiqilganlar)
print("O'rtacha:  ", round(sum(ballar) / len(ballar), 2))
print("A'lochilar:", alolar)
```

**Natija:**

```
TALABALAR HISOBOTI
==========================================
Ali 	 87 	 B 	 O'TDI
Vali 	 65 	 D 	 O'TDI
Hasan 	 92 	 A 	 O'TDI
Husan 	 45 	 F 	 O'TMADI
Karim 	 78 	 C 	 O'TDI
Nodira 	 96 	 A 	 O'TDI
==========================================
Jami:       6
O'tganlar:  5
Yiqilganlar: 1
O'rtacha:   77.17
A'lochilar: ['Hasan', 'Nodira']
```

</details>

### 🔑 Uchta yig'uvchi bir siklda

```python
otganlar = 0        ← SANOQCHI
yiqilganlar = 0     ← SANOQCHI
alolar = []         ← RO'YXAT YIG'UVCHI
```

Bitta sikl **uchtasini ham** to'ldiradi. Bu — **samarali** kod.

### 🔑 `\t` — tabulyatsiya

`\t` — **ustunlarni tekislaydi**. Bu — `\n` (yangi qator) kabi **maxsus belgi** *(12-modul, escape)*.

### ✏️ O'zgartirish

1. Yangi talaba va ball qo'shing.
2. **A'lo** ballarning o'rtachasini alohida hisoblang.
3. **Eng yuqori** va **eng past** ball egasini toping.
4. Ballarni **kamayish tartibida** chiqaring *(ilgak: parallel ro'yxatlar buzilmasin)*.
5. `talabalar` va `ballar` o'rniga **lug'at** ishlating.

---

## Loyiha 2 · Kassa tizimi

**Vazifa:** narxlar va savat lug'atlari bilan chek yasang.

<details>
<summary>💻 Yechim</summary>

```python
narxlar = {"Non": 4000, "Sut": 12000, "Guruch": 25000, "Choy": 8000, "Yog'": 32000}
savat   = {"Non": 3, "Sut": 2, "Guruch": 1, "Choy": 4}

print("CHEK")
print("=" * 46)

# ===== ORALIQ SUMMA =====
oraliq = 0
for mahsulot in savat:
    summa = narxlar[mahsulot] * savat[mahsulot]
    oraliq += summa
    print(mahsulot, "\t x", savat[mahsulot], "\t", narxlar[mahsulot], "\t=", summa)

print("-" * 46)

# ===== CHEGIRMA =====
if oraliq > 100000:
    foiz = 10
elif oraliq > 50000:
    foiz = 5
else:
    foiz = 0

chegirma = oraliq * foiz / 100
qqs = (oraliq - chegirma) * 0.12
jami = oraliq - chegirma + qqs

print("Oraliq:     ", oraliq)
print("Chegirma:   ", foiz, "% =", chegirma)
print("QQS 12%:    ", qqs)
print("=" * 46)
print("TO'LOV:     ", jami)
print("Savatda yo'q:", narxlar.get("Shakar", "narxi yo'q"))
```

**Natija:**

```
CHEK
==============================================
Non 	 x 3 	 4000 	= 12000
Sut 	 x 2 	 12000 	= 24000
Guruch 	 x 1 	 25000 	= 25000
Choy 	 x 4 	 8000 	= 32000
----------------------------------------------
Oraliq:      93000
Chegirma:    5 % = 4650.0
QQS 12%:     10602.0
==============================================
TO'LOV:      98952.0
Savatda yo'q: narxi yo'q
```

</details>

### 🔑 Nima uchun `for ... in savat`, `narxlar` emas?

`narxlar` da **5 ta** mahsulot, `savat` da — **4 ta**. Biz faqat **sotib olinganlarni** hisoblashimiz kerak.

> ⚠️ Agar `for ... in narxlar` yozsak — `savat["Yog'"]` da **`KeyError`** chiqadi!

### ✏️ O'zgartirish

1. Savatga `"Yog'"` qo'shing — chegirma foizi o'zgaradimi?
2. `Non` sonini `10` ga oshiring.
3. Har bir mahsulot uchun **ulushni foizda** chiqaring.
4. **Eng qimmat** pozitsiyani toping.
5. `for ... in narxlar` yozib ko'ring. Nima bo'ladi? *(Ilgak: `.get()` bilan tuzating.)*

---

## Loyiha 3 · Matn tahlilchisi

**Vazifa:** matnni so'zlar **va harflar** darajasida tahlil qiling.

<details>
<summary>💻 Yechim</summary>

```python
matn = "Python dasturlash tili juda qiziqarli va foydali til"
sozlar = matn.split(' ')

print("Matn:", matn)
print("=" * 52)

# ===== SO'ZLAR TAHLILI =====
jami_uzunlik = 0
eng_uzun = sozlar[0]
eng_qisqa = sozlar[0]
uzun_sozlar = []

for soz in sozlar:
    jami_uzunlik += len(soz)
    if len(soz) > len(eng_uzun):
        eng_uzun = soz
    if len(soz) < len(eng_qisqa):
        eng_qisqa = soz
    if len(soz) > 5:
        uzun_sozlar.append(soz)

print("So'zlar soni:     ", len(sozlar))
print("Belgilar (bo'shsiz):", jami_uzunlik)
print("Eng uzun:         ", eng_uzun, "(", len(eng_uzun), ")")
print("Eng qisqa:        ", eng_qisqa, "(", len(eng_qisqa), ")")
print("O'rtacha uzunlik: ", round(jami_uzunlik / len(sozlar), 2))
print("5 dan uzunlari:   ", uzun_sozlar)
print("-" * 52)

# ===== HARFLAR CHASTOTASI =====
harflar = {}
for harf in matn.lower():
    if harf != " ":
        if harf in harflar:
            harflar[harf] += 1
        else:
            harflar[harf] = 1

eng_kop = ""
eng_soni = 0
for h in harflar:
    if harflar[h] > eng_soni:
        eng_soni = harflar[h]
        eng_kop = h

print("Turli harflar:", len(harflar))
print("Eng ko'p harf:", eng_kop, "-", eng_soni, "marta")
```

**Natija:**

```
Matn: Python dasturlash tili juda qiziqarli va foydali til
====================================================
So'zlar soni:      8
Belgilar (bo'shsiz): 45
Eng uzun:          dasturlash ( 10 )
Eng qisqa:         va ( 2 )
O'rtacha uzunlik:  5.62
5 dan uzunlari:    ['Python', 'dasturlash', 'qiziqarli', 'foydali']
----------------------------------------------------
Turli harflar: 18
Eng ko'p harf: i - 7 marta
```

</details>

### 🔑 Chastota lug'ati naqshi

```python
harflar = {}
for harf in matn:
    if harf in harflar:
        harflar[harf] += 1      # ← ko'rilgan: BIRGA oshiramiz
    else:
        harflar[harf] = 1       # ← BIRINCHI marta: 1 qo'yamiz
```

> ## 🔑 **Bu — NLP'ning (20-modul) asosi.** So'z chastotasini shu tarzda hisoblaysiz.

### ✏️ O'zgartirish

1. Boshqa matn bilan sinang.
2. **So'z** chastotasini hisoblang (harf emas).
3. Faqat **unli** harflarni sanang.
4. Eng kam uchraydigan harfni toping.
5. Chastota lug'atini **kamayish tartibida** chiqaring.

---

## Loyiha 4 · Kredit jadvali

**Vazifa:** oylik foiz bilan kredit jadvalini `while` orqali hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
qarz         = 12000000
foiz_yillik  = 18
oylik_tolov  = 1200000

oy = 0
jami_tolangan = 0
jami_foiz = 0

print("KREDIT JADVALI")
print("=" * 58)
print("Oy \t To'lov \t Foiz \t\t Qoldiq")
print("-" * 58)

while qarz > 0:
    oy += 1
    oylik_foiz = qarz * foiz_yillik / 100 / 12
    jami_foiz += oylik_foiz

    # Oxirgi to'lov qoldiqdan katta bo'lmasin
    if qarz + oylik_foiz < oylik_tolov:
        tolov = qarz + oylik_foiz
    else:
        tolov = oylik_tolov

    qarz = qarz + oylik_foiz - tolov
    jami_tolangan += tolov

    print(oy, "\t", round(tolov), "\t", round(oylik_foiz), "\t\t", round(qarz))

print("=" * 58)
print("Muddat:        ", oy, "oy")
print("Jami to'langan:", round(jami_tolangan))
print("Jami foiz:     ", round(jami_foiz))
```

**Natija:**

```
KREDIT JADVALI
==========================================================
Oy 	 To'lov 	 Foiz 		 Qoldiq
----------------------------------------------------------
1 	 1200000 	 180000 		 10980000
2 	 1200000 	 164700 		 9944700
3 	 1200000 	 149170 		 8893870
4 	 1200000 	 133408 		 7827279
5 	 1200000 	 117409 		 6744688
6 	 1200000 	 101170 		 5645858
7 	 1200000 	 84688 		 4530546
8 	 1200000 	 67958 		 3398504
9 	 1200000 	 50978 		 2249482
10 	 1200000 	 33742 		 1083224
11 	 1099472 	 16248 		 0
==========================================================
Muddat:         11 oy
Jami to'langan: 13099472
Jami foiz:      1099472
```

</details>

### 🔑 Nima uchun `while`, `for` emas?

**Oylar soni oldindan NOMA'LUM!** U qarz, foiz va to'lovga bog'liq. Bu — **`while` uchun mukammal holat**.

### ⚠️ Cheksiz sikl xavfi

```python
oylik_tolov = 150000        # ← foizdan KAM!
while qarz > 0:
    ...
# ⚠️ CHEKSIZ SIKL — qarz KAMAYMAYDI, o'sadi!
```

**Himoya qo'shing:**

```python
while qarz > 0 and oy < 360:        # maksimum 30 yil
    ...
```

### ✏️ O'zgartirish

1. `oylik_tolov` ni `2000000` ga oshiring — muddat qanday o'zgaradi?
2. `foiz_yillik` ni `24` ga oshiring.
3. `oylik_tolov = 150000` qiling. **Himoyani qo'shing**, aks holda cheksiz sikl!
4. **Umumiy ortiqcha to'lovni** foizda hisoblang.
5. Har 6 oyda **qo'shimcha to'lov** qo'shing.

---

## Loyiha 5 · Sonlar tahlilchisi

**Vazifa:** sonlarni toifalarga ajrating va **tub sonlarni** toping.

<details>
<summary>💻 Yechim</summary>

```python
sonlar = [15, 42, 8, 31, 67, 4, 23, 90, 12]

print("Sonlar:", sonlar)
print("=" * 50)

# ===== TOIFALASH =====
juftlar = []
toqlar = []
tub_sonlar = []

for son in sonlar:
    # Juft / toq
    if son % 2 == 0:
        juftlar.append(son)
    else:
        toqlar.append(son)

    # Tub sonmi? — bo'luvchilarini SANAYMIZ
    bolvchilar = 0
    for d in range(1, son + 1):
        if son % d == 0:
            bolvchilar += 1
    if bolvchilar == 2:             # faqat 1 va o'zi
        tub_sonlar.append(son)

print("Juftlar:   ", juftlar)
print("Toqlar:    ", toqlar)
print("Tub sonlar:", tub_sonlar)
print("-" * 50)

# ===== STATISTIKA =====
yigindi = 0
kopaytma = 1
eng_katta = sonlar[0]
eng_kichik = sonlar[0]

for son in sonlar:
    yigindi += son
    kopaytma *= son
    if son > eng_katta:
        eng_katta = son
    if son < eng_kichik:
        eng_kichik = son

print("Yig'indi:  ", yigindi)
print("Ko'paytma: ", kopaytma)
print("Eng katta: ", eng_katta)
print("Eng kichik:", eng_kichik)
print("O'rtacha:  ", round(yigindi / len(sonlar), 2))
```

**Natija:**

```
Sonlar: [15, 42, 8, 31, 67, 4, 23, 90, 12]
==================================================
Juftlar:    [42, 8, 4, 90, 12]
Toqlar:     [15, 31, 67, 23]
Tub sonlar: [31, 67, 23]
--------------------------------------------------
Yig'indi:   292
Ko'paytma:  1040108428800
Eng katta:  90
Eng kichik: 4
O'rtacha:   32.44
```

</details>

### 🔑 Tub son tekshiruvi — ICHMA-ICH sikl

```python
for son in sonlar:              ← TASHQI sikl
    bolvchilar = 0
    for d in range(1, son + 1): ← ICHKI sikl
        if son % d == 0:
            bolvchilar += 1
    if bolvchilar == 2:
        tub_sonlar.append(son)
```

**Mantiq:** tub son — **faqat 2 ta** bo'luvchisi bor son (`1` va **o'zi**).

| Son | Bo'luvchilari | Soni | Tubmi |
|---|---|---|---|
| `4` | 1, 2, 4 | 3 | ❌ |
| `15` | 1, 3, 5, 15 | 4 | ❌ |
| `23` | 1, 23 | **2** | ✅ |
| `31` | 1, 31 | **2** | ✅ |

> ⚠️ Bu — **sekin** usul (`son` marta aylanadi). Tezroq usullar bor, lekin ular **hozircha kerak emas**.

### ✏️ O'zgartirish

1. Boshqa sonlar bilan sinang.
2. `1` ni ro'yxatga qo'shing — tub deb hisoblanadimi? *(To'g'ri javob: **yo'q**, chunki 1 ta bo'luvchi.)*
3. **3 ga bo'linadiganlarni** ajrating.
4. **Kvadratlar** ro'yxatini yasang.
5. `range(1, son+1)` o'rniga `range(1, son//2+2)` qiling — natija bir xilmi? Tezroqmi?

---

## Loyiha 6 · Ombor boshqaruvi

**Vazifa:** to'liq ombor hisoboti — lug'at ichida ro'yxat.

<details>
<summary>💻 Yechim</summary>

```python
# ===== OMBOR: mahsulot → [narx, soni] =====
ombor = {
    "Noutbuk":    [8500000, 5],
    "Telefon":    [4200000, 12],
    "Quloqchin":  [350000, 30],
    "Klaviatura": [280000, 0],
    "Sichqoncha": [180000, 3],
}

print("OMBOR HISOBOTI")
print("=" * 60)

# ===== YIG'UVCHILAR =====
umumiy = 0
tugagan = []
kam_qolgan = []
eng_qimmat = ""
eng_qiymat = 0

# ===== ASOSIY SIKL =====
for m in ombor:
    narx = ombor[m][0]
    soni = ombor[m][1]
    qiymat = narx * soni
    umumiy += qiymat

    if soni == 0:
        tugagan.append(m)
    elif soni < 5:
        kam_qolgan.append(m)

    if qiymat > eng_qiymat:
        eng_qiymat = qiymat
        eng_qimmat = m

    print(m, "\t", narx, "\t x", soni, "\t=", qiymat)

# ===== XULOSA =====
print("=" * 60)
print("Mahsulot turlari: ", len(ombor))
print("Umumiy qiymat:    ", umumiy)
print("Eng qimmat zaxira:", eng_qimmat, "=", eng_qiymat)
print("Tugaganlar:       ", tugagan)
print("Kam qolganlar:    ", kam_qolgan)
print("QQS bilan:        ", round(umumiy * 1.12))
```

**Natija:**

```
OMBOR HISOBOTI
============================================================
Noutbuk 	 8500000 	 x 5 	= 42500000
Telefon 	 4200000 	 x 12 	= 50400000
Quloqchin 	 350000 	 x 30 	= 10500000
Klaviatura 	 280000 	 x 0 	= 0
Sichqoncha 	 180000 	 x 3 	= 540000
============================================================
Mahsulot turlari:  5
Umumiy qiymat:     103940000
Eng qimmat zaxira: Telefon = 50400000
Tugaganlar:        ['Klaviatura']
Kam qolganlar:     ['Sichqoncha']
QQS bilan:         116412800
```

</details>

### 🔑 `elif` nima uchun kerak?

```python
if soni == 0:
    tugagan.append(m)
elif soni < 5:                  # ← elif, if EMAS!
    kam_qolgan.append(m)
```

Agar `if soni < 5` yozsangiz — `soni = 0` bo'lganda mahsulot **ikkala ro'yxatga ham** tushib qoladi.

### ✏️ O'zgartirish

1. Yangi mahsulot qo'shing.
2. Bir mahsulot sonini o'zgartiring.
3. **Eng ko'p dona** bo'lgan mahsulotni toping.
4. **O'rtacha narxni** hisoblang.
5. Har bir mahsulotning umumiy qiymatdagi **ulushini foizda** chiqaring.

---

## 🏆 Yakuniy loyiha · O'z to'liq dasturingiz

```
☐ Kamida 2 ta ro'yxat va 1 ta lug'at
☐ Kamida 2 ta funksiya
☐ Kamida 1 ta for va 1 ta while sikl
☐ Kamida 1 ta range()
☐ Kamida 3 ta yig'uvchi (sanoqchi / yig'indi / ro'yxat)
☐ Kamida 1 ta lug'at iteratsiyasi
☐ Kamida 1 ta ICHMA-ICH sikl
☐ if / elif / else
☐ Chiroyli formatlangan hisobot (=, -, \t)
☐ Har bir bo'limga izoh
```

### G'oyalar

| Loyiha | Nima hisoblanadi |
|---|---|
| **Kutubxona tizimi** | Kitoblar, o'quvchilar, qarzdorlik |
| **Restoran POS** | Menyu, buyurtmalar, kunlik hisobot |
| **Fitnes tracker** | Kunlik mashqlar, kaloriya, progress |
| **Byudjet nazorati** | Daromad, xarajat kategoriyalari, tahlil |
| **O'yin statistikasi** | O'yinchilar, ochkolar, reyting |
| **Ob-havo tahlili** | 30 kunlik harorat, o'rtacha, ekstremumlar |
| **So'z o'yini** | Lug'at, taxminlar, ballar |
| **Sinov tizimi** | Savollar, javoblar, natija |

### Shablon

```python
# ===============================================
#   DASTUR NOMI
#   Muallif: ______
# ===============================================

# ===== 1 · MA'LUMOTLAR =====
ma_lumotlar = {}
royxat = []

# ===== 2 · FUNKSIYALAR =====
def hisobla(x):
    total = 0
    for item in x:
        total += item
    return total

def filtrla(x, shart):
    natija = []
    for item in x:
        if item > shart:
            natija.append(item)
    return natija

# ===== 3 · ASOSIY SIKL =====
sanoqchi = 0
yigindi = 0
toplam = []

for k in ma_lumotlar:
    # tahlil
    pass

# ===== 4 · HISOBOT =====
print("=" * 50)
print("NATIJALAR")
print("-" * 50)

print("=" * 50)
```

---

## ✅ O'zingizni tekshiring

```
☐ Kod xatosiz ishladimi?
☐ CHEKSIZ SIKL yo'qmi? (while da o'zgarish bormi?)
☐ Yig'uvchilar NOLDAN boshlanadimi?
☐ return SIKLDAN TASHQARIDAmi?
☐ Sikl aylanayotgan ro'yxatni o'zgartirmadimmi?
☐ Lug'at iteratsiyasida `i` KALIT ekanini bilaman
☐ elif kerak joyda elif ishlatdimmi? (if emas)
☐ Chegaraviy holatlarni sinadimmi? (bo'sh ro'yxat, 0, manfiy)
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
