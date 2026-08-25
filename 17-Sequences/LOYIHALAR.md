# 🚀 17-modul · Mini-loyihalar

Bu 6 ta loyiha — **ma'lumotlarni tashkil qilish** mashqi. Bitta o'zgaruvchida endi **yuzlab** qiymat saqlanadi.

```
list   [ ]      ← YANGI
tuple  ( )      ← YANGI
dict   { }      ← YANGI
kesish [a:b]    ← YANGI
metodlar        ← YANGI
funksiyalar     ← 16-moduldan
if / elif / else← 15-moduldan
```

**Sikllar (`for`, `while`) hali YO'Q** — ular 18-modulda. Shuning uchun bu yerda **indeks bo'yicha qo'lda** murojaat qilamiz.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | [Talabalar ballari](#loyiha-1--talabalar-ballari) | Parallel ro'yxatlar + `index` | 🟢 |
| 2 | [Xaridlar savati](#loyiha-2--xaridlar-savati) | `dict` + `tuple` qiymat | 🟡 |
| 3 | [Kontaktlar kitobi](#loyiha-3--kontaktlar-kitobi) | Ichma-ich lug'at | 🟡 |
| 4 | [Matn tahlilchisi](#loyiha-4--matn-tahlilchisi) | `split` + kesish | 🟡 |
| 5 | [Dars jadvali](#loyiha-5--dars-jadvali) | Lug'at + ro'yxat qiymat | 🔴 |
| 6 | [Ombor inventari](#loyiha-6--ombor-inventari) | To'liq hisobot tizimi | 🔴 |

---

## Loyiha 1 · Talabalar ballari

**Vazifa:** ikkita **parallel ro'yxat** bilan ishlang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
talabalar = ["Ali", "Vali", "Hasan", "Husan", "Karim"]
ballar    = [87, 65, 92, 45, 78]

print("Talabalar:", talabalar)
print("Ballar:   ", ballar)
print("-" * 44)

# ===== STATISTIKA =====
print("Soni:      ", len(talabalar))
print("Eng yuqori:", max(ballar), "-", talabalar[ballar.index(max(ballar))])
print("Eng past:  ", min(ballar), "-", talabalar[ballar.index(min(ballar))])
print("O'rtacha:  ", round(sum(ballar) / len(ballar), 2))
print("-" * 44)

# ===== TARTIBLASH va KESISH =====
tartibli = sorted(ballar, reverse=True)
print("Tartiblangan ballar:", tartibli)
print("Top-3:              ", tartibli[:3])
print("Oxirgi 2:           ", tartibli[-2:])
print("Asl ro'yxat:        ", ballar)
```

**Natija:**

```
Talabalar: ['Ali', 'Vali', 'Hasan', 'Husan', 'Karim']
Ballar:    [87, 65, 92, 45, 78]
--------------------------------------------
Soni:       5
Eng yuqori: 92 - Hasan
Eng past:   45 - Husan
O'rtacha:   73.4
--------------------------------------------
Tartiblangan ballar: [92, 87, 78, 65, 45]
Top-3:               [92, 87, 78]
Oxirgi 2:            [65, 45]
Asl ro'yxat:         [87, 65, 92, 45, 78]
```

</details>

### 🔑 Ikkita hiyla

**1 · Parallel ro'yxatlar.** `talabalar[i]` va `ballar[i]` — **bir xil indeks**, bir xil talaba. Shuning uchun:

```python
talabalar[ballar.index(max(ballar))]
             ↑ eng yuqori ball indeksi
```

**2 · `sorted()`, `sort()` emas.** Asl ro'yxat **o'zgarmasligi** kerak edi — chunki u `talabalar` bilan **moslashtirilgan**.

> ⚠️ `ballar.sort()` qilsangiz — moslik **buziladi**! `talabalar[0]` endi `ballar[0]` ga **to'g'ri kelmaydi**.

### ✏️ O'zgartirish

1. Yangi talaba va ball qo'shing (`append`).
2. Bir talabani `del` bilan o'chiring — **ikkala** ro'yxatdan.
3. O'rtacha ballan **yuqori** bo'lganlarni toping.
4. `sorted()` o'rniga `ballar.sort()` qiling. Nima buziladi?
5. Ikkita ro'yxat o'rniga **lug'at** ishlating: `{"Ali": 87, ...}`.

---

## Loyiha 2 · Xaridlar savati

**Vazifa:** lug'at + tuple bilan savat yarating.

<details>
<summary>💻 Yechim</summary>

```python
# ===== SAVAT: mahsulot → (soni, narxi) =====
savat = {}
savat["Non"]      = (3, 4000)
savat["Sut"]      = (2, 12000)
savat["Guruch"]   = (1, 25000)
savat["Choy"]     = (4, 8000)

mahsulotlar = list(savat.keys())

print("SAVAT")
print("-" * 46)
print(mahsulotlar[0], "  x", savat[mahsulotlar[0]][0],
      " =", savat[mahsulotlar[0]][0] * savat[mahsulotlar[0]][1])
print(mahsulotlar[1], "  x", savat[mahsulotlar[1]][0],
      " =", savat[mahsulotlar[1]][0] * savat[mahsulotlar[1]][1])
print(mahsulotlar[2], "x", savat[mahsulotlar[2]][0],
      " =", savat[mahsulotlar[2]][0] * savat[mahsulotlar[2]][1])
print(mahsulotlar[3], " x", savat[mahsulotlar[3]][0],
      " =", savat[mahsulotlar[3]][0] * savat[mahsulotlar[3]][1])
print("-" * 46)
print("Mahsulot turlari:", len(savat))
print("Yo'q mahsulot:   ", savat.get("Yog'", "savatda yo'q"))
```

**Natija:**

```
SAVAT
----------------------------------------------
Non   x 3  = 12000
Sut   x 2  = 24000
Guruch x 1  = 25000
Choy  x 4  = 32000
----------------------------------------------
Mahsulot turlari: 4
Yo'q mahsulot:    savatda yo'q
```

</details>

### 🔑 Nima uchun tuple qiymat sifatida?

```python
savat["Non"] = (3, 4000)
              ↑soni ↑narxi
```

**Tuple** — chunki `(soni, narxi)` **birga** yuradi va **o'zgarmasligi** kerak. Ro'yxat ishlatsangiz — tasodifan o'zgartirib qo'yish mumkin.

```python
savat["Non"][0]      # 3      ← soni
savat["Non"][1]      # 4000   ← narxi
```

### ✏️ O'zgartirish

1. Yangi mahsulot qo'shing.
2. Bir mahsulot sonini o'zgartiring *(ilgak: tuple'ni **butunlay** almashtirish kerak).*
3. **Umumiy summani** hisoblang.
4. `savat.get()` bilan mavjud bo'lmagan mahsulotni so'rang.
5. `del savat["Choy"]` bilan mahsulotni o'chiring.

---

## Loyiha 3 · Kontaktlar kitobi

**Vazifa:** lug'at **ichida** lug'at.

<details>
<summary>💻 Yechim</summary>

```python
# ===== ICHMA-ICH LUG'AT =====
kontaktlar = {
    "Ali":   {"tel": "+998901112233", "shahar": "Toshkent"},
    "Vali":  {"tel": "+998912223344", "shahar": "Samarqand"},
    "Hasan": {"tel": "+998933334455", "shahar": "Buxoro"},
}

print("Jami kontaktlar:", len(kontaktlar))
print("-" * 44)

# ===== MUROJAAT =====
print("Ali telefoni:  ", kontaktlar["Ali"]["tel"])
print("Ali shahri:    ", kontaktlar["Ali"]["shahar"])
print("Operator kodi: ", kontaktlar["Ali"]["tel"][4:6])
print("-" * 44)

# ===== IZLASH =====
print("Barcha ismlar: ", list(kontaktlar.keys()))
print("Karim bormi?   ", "Karim" in kontaktlar)
print("Karim ma'lumoti:", kontaktlar.get("Karim", "topilmadi"))
```

**Natija:**

```
Jami kontaktlar: 3
--------------------------------------------
Ali telefoni:   +998901112233
Ali shahri:     Toshkent
Operator kodi:  90
--------------------------------------------
Barcha ismlar:  ['Ali', 'Vali', 'Hasan']
Karim bormi?    False
Karim ma'lumoti: topilmadi
```

</details>

### 🔑 Ikki bosqichli murojaat

```python
kontaktlar["Ali"]["tel"]
      ↓        ↓
   tashqi   ichki
   lug'at   lug'at
```

Va uchinchi bosqich — **satrni kesish**:

```python
kontaktlar["Ali"]["tel"][4:6]      # '90'
```

### ✏️ O'zgartirish

1. Yangi kontakt qo'shing.
2. Ali'ning shahrini o'zgartiring.
3. Har bir kontaktga **email** maydonini qo'shing.
4. `.get()` bilan mavjud bo'lmagan **maydonni** so'rang.
5. Bir kontaktni `del` bilan o'chiring.

---

## Loyiha 4 · Matn tahlilchisi

**Vazifa:** matnni so'zlarga ajratib tahlil qiling.

<details>
<summary>💻 Yechim</summary>

```python
matn = "Python dasturlash tili juda qiziqarli va foydali"
sozlar = matn.split(' ')

print("Matn:", matn)
print("-" * 50)

# ===== ASOSIY =====
print("So'zlar soni:  ", len(sozlar))
print("Belgilar soni: ", len(matn))
print("Birinchi so'z: ", sozlar[0])
print("Oxirgi so'z:   ", sozlar[-1])
print("Dastlabki 3 ta:", sozlar[:3])
print("Oxirgi 2 ta:   ", sozlar[-2:])

# ===== UZUNLIKLAR =====
uzunliklar = [len(sozlar[0]), len(sozlar[1]), len(sozlar[2]), len(sozlar[3]),
              len(sozlar[4]), len(sozlar[5]), len(sozlar[6])]
print("Uzunliklar:    ", uzunliklar)
print("Eng uzun so'z: ", sozlar[uzunliklar.index(max(uzunliklar))],
      "(", max(uzunliklar), "belgi )")
print("Eng qisqa so'z:", sozlar[uzunliklar.index(min(uzunliklar))],
      "(", min(uzunliklar), "belgi )")
print("O'rtacha:      ", round(sum(uzunliklar) / len(uzunliklar), 2))
```

**Natija:**

```
Matn: Python dasturlash tili juda qiziqarli va foydali
--------------------------------------------------
So'zlar soni:   7
Belgilar soni:  48
Birinchi so'z:  Python
Oxirgi so'z:    foydali
Dastlabki 3 ta: ['Python', 'dasturlash', 'tili']
Oxirgi 2 ta:    ['va', 'foydali']
Uzunliklar:     [6, 10, 4, 4, 9, 2, 7]
Eng uzun so'z:  dasturlash ( 10 belgi )
Eng qisqa so'z: va ( 2 belgi )
O'rtacha:       6.0
```

</details>

### ⚠️ `uzunliklar` ni qo'lda yozdik

Bu — **vaqtinchalik yechim**. Matn **7 so'zdan** iborat bo'lgani uchun ishlaydi. **18-modulda** buni bir qatorda yozasiz:

```python
uzunliklar = [len(soz) for soz in sozlar]      # ← 18-modul
```

### ✏️ O'zgartirish

1. Boshqa matn bilan sinang *(so'zlar soni o'zgarsa nima bo'ladi?)*.
2. Bo'sh joysiz belgilar sonini hisoblang: `len(matn) - len(sozlar) + 1`.
3. So'zlarni **alifbo tartibida** tartiblang.
4. So'zlarni **uzunligi bo'yicha** tartiblang *(ilgak: `sorted(sozlar, key=len)`)*.
5. Har bir so'zning **bosh harfini** to'plang.

---

## Loyiha 5 · Dars jadvali

**Vazifa:** lug'at, qiymatlari — **ro'yxatlar**.

<details>
<summary>💻 Yechim</summary>

```python
jadval = {
    "Dushanba":   ["Matematika", "Fizika", "Ingliz tili"],
    "Seshanba":   ["Informatika", "Tarix"],
    "Chorshanba": ["Matematika", "Kimyo", "Biologiya", "Sport"],
}

kunlar = list(jadval.keys())

print("HAFTALIK JADVAL")
print("=" * 46)
print(kunlar[0], " (", len(jadval[kunlar[0]]), "dars )")
print("   ", jadval[kunlar[0]])
print(kunlar[1], " (", len(jadval[kunlar[1]]), "dars )")
print("   ", jadval[kunlar[1]])
print(kunlar[2], "(", len(jadval[kunlar[2]]), "dars )")
print("   ", jadval[kunlar[2]])
print("=" * 46)

jami = len(jadval[kunlar[0]]) + len(jadval[kunlar[1]]) + len(jadval[kunlar[2]])
print("Jami darslar:", jami)
print("Payshanba:   ", jadval.get("Payshanba", "dars yo'q"))
print("Dushanba 1-dars:", jadval["Dushanba"][0])
```

**Natija:**

```
HAFTALIK JADVAL
==============================================
Dushanba  ( 3 dars )
    ['Matematika', 'Fizika', 'Ingliz tili']
Seshanba  ( 2 dars )
    ['Informatika', 'Tarix']
Chorshanba ( 4 dars )
    ['Matematika', 'Kimyo', 'Biologiya', 'Sport']
==============================================
Jami darslar: 9
Payshanba:    dars yo'q
Dushanba 1-dars: Matematika
```

</details>

### 🔑 Ikki darajali murojaat

```python
jadval["Dushanba"]          # ['Matematika', 'Fizika', 'Ingliz tili']
jadval["Dushanba"][0]       # 'Matematika'
len(jadval["Dushanba"])     # 3
len(jadval)                 # 3   ← KUNLAR soni, darslar emas!
```

### ✏️ O'zgartirish

1. Payshanba va Jumani qo'shing.
2. Dushanbaga yangi dars qo'shing (`append`).
3. Seshanbadan bir darsni o'chiring.
4. Har bir kunning **oxirgi** darsini chiqaring.
5. Qaysi kunda **eng ko'p** dars bor?

---

## Loyiha 6 · Ombor inventari

**Vazifa:** to'liq inventar hisoboti.

<details>
<summary>💻 Yechim</summary>

```python
# ===== INVENTAR: mahsulot → [narx, soni] =====
inventar = {}
inventar["Noutbuk"]    = [8500000, 5]
inventar["Telefon"]    = [4200000, 12]
inventar["Quloqchin"]  = [350000, 30]
inventar["Klaviatura"] = [280000, 0]

nomlar = list(inventar.keys())

print("INVENTAR HISOBOTI")
print("=" * 52)
print("Mahsulot turlari:", len(inventar))
print("-" * 52)

# ===== QIYMATLARNI HISOBLASH =====
qiymatlar = [inventar[nomlar[0]][0] * inventar[nomlar[0]][1],
             inventar[nomlar[1]][0] * inventar[nomlar[1]][1],
             inventar[nomlar[2]][0] * inventar[nomlar[2]][1],
             inventar[nomlar[3]][0] * inventar[nomlar[3]][1]]

print(nomlar[0], " x", inventar[nomlar[0]][1], "=", qiymatlar[0])
print(nomlar[1], " x", inventar[nomlar[1]][1], "=", qiymatlar[1])
print(nomlar[2], "x", inventar[nomlar[2]][1], "=", qiymatlar[2])
print(nomlar[3], "x", inventar[nomlar[3]][1], "=", qiymatlar[3])
print("-" * 52)

# ===== HISOBOT =====
print("Umumiy qiymat:  ", sum(qiymatlar))
print("Eng qimmat zaxira:", nomlar[qiymatlar.index(max(qiymatlar))],
      "=", max(qiymatlar))

if inventar[nomlar[3]][1] == 0:
    print("Tugagan mahsulot: ", nomlar[3])
else:
    print("Tugagan mahsulot:  yo'q")

# ===== YANGI MAHSULOT =====
inventar["Sichqoncha"] = [180000, 25]
print("Yangi qo'shildi. Endi turlar soni:", len(inventar))
```

**Natija:**

```
INVENTAR HISOBOTI
====================================================
Mahsulot turlari: 4
----------------------------------------------------
Noutbuk  x 5 = 42500000
Telefon  x 12 = 50400000
Quloqchin x 30 = 10500000
Klaviatura x 0 = 0
----------------------------------------------------
Umumiy qiymat:   103400000
Eng qimmat zaxira: Telefon = 50400000
Tugagan mahsulot:  Klaviatura
Yangi qo'shildi. Endi turlar soni: 5
```

</details>

### 🔑 Nima uchun bu yerda RO'YXAT, savatda TUPLE edi?

```python
inventar["Noutbuk"] = [8500000, 5]      # ← RO'YXAT
```

Chunki **soni o'zgaradi** — mahsulot sotiladi va keladi:

```python
inventar["Noutbuk"][1] = 4              # ✅ ishlaydi
# savat["Non"][0] = 4                   # ❌ TypeError — tuple o'zgarmas
```

> ## 🔑 **Qoida: ma'lumot O'ZGARSA — `list`. O'ZGARMASA — `tuple`.**

### ✏️ O'zgartirish

1. Noutbuk sonini `4` ga kamaytiring.
2. Bir mahsulotning narxini oshiring.
3. **Eng ko'p** dona bo'lgan mahsulotni toping.
4. Zaxirasi `10` dan kam bo'lganlarni aniqlang.
5. Umumiy qiymatga **12% QQS** qo'shing.

---

## 🏆 Yakuniy loyiha · O'z ma'lumot tizimingiz

```
☐ Kamida 1 ta ro'yxat (list)
☐ Kamida 1 ta tuple
☐ Kamida 1 ta lug'at (dict)
☐ Kamida 1 ta ICHMA-ICH tuzilma (lug'at ichida ro'yxat/lug'at)
☐ Kamida 3 xil metod (append, extend, sort, index, get...)
☐ Kamida 2 ta kesish (slicing)
☐ Kamida 3 xil ichki funksiya (len, max, min, sum, sorted)
☐ Kamida 1 ta funksiya (def)
☐ Kamida 1 ta shart (if/else)
☐ Chiroyli formatlangan hisobot
```

### G'oyalar

| Loyiha | Qanday tuzilma |
|---|---|
| **Kutubxona** | `{"kitob": ["muallif", yil, soni]}` |
| **Restoran menyusi** | `{"taom": (narx, kaloriya)}` |
| **Sport jamoasi** | `{"o'yinchi": {"raqam": 10, "gol": 5}}` |
| **Ob-havo** | `{"kun": [harorat, namlik]}` |
| **Musiqa pleylist** | `[("qo'shiq", "ijrochi", davomiylik)]` |
| **Byudjet** | `{"kategoriya": [xarajatlar ro'yxati]}` |
| **Til lug'ati** | `{"so'z": ["tarjima1", "tarjima2"]}` |

### Shablon

```python
# ===============================================
#   TIZIM NOMI
#   Muallif: ______
# ===============================================

# ===== 1 · MA'LUMOTLAR =====
ma_lumotlar = {}


# ===== 2 · YORDAMCHI FUNKSIYALAR =====
def hisobla(x):
    return ...

def topish(kalit):
    return ma_lumotlar.get(kalit, "topilmadi")


# ===== 3 · TAHLIL =====
kalitlar = list(ma_lumotlar.keys())


# ===== 4 · HISOBOT =====
print("=" * 50)

print("=" * 50)
```

---

## ✅ O'zingizni tekshiring

```
☐ Kod xatosiz ishladimi?
☐ To'g'ri tuzilmani tanladimmi? (o'zgaradimi → list, yo'qmi → tuple)
☐ Kalit bo'yicha izlash kerak bo'lsa dict ishlatdimmi?
☐ .get() ni xatosiz murojaat uchun ishlatdimmi?
☐ sort() va sorted() ni to'g'ri joyda ishlatdimmi?
☐ Parallel ro'yxatlarning MOSLIGINI buzmadimmi?
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
