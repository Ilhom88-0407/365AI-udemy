# 4-dars. Shartlar va sikllarni birga ishlatish

## 🎬 Boshlashdan oldin

> **"Endi siz `range` funksiyasi nima qilishini bilganingizdan so'ng, uni `for` sikl ichida ko'raylik."**

Bu dars — **15-modul** (shartlar) va **18-modul** (sikllar) ning **birlashishi**.

---

## 1. `range` va `for` birga

> **"2 ning 0-darajasi, 2 ning 1-darajasi va hokazo — 2 ning 9-darajasigacha barcha qiymatlarni chop etish uchun quyidagi koddan foydalanishimiz mumkin."**

```python
for n in range(10):
    print(2 ** n, end=" ")
```

```
1 2 4 8 16 32 64 128 256 512
```

> **"Men shuningdek vergul qo'yishim va `n` dan keyin bo'sh satr qiymatiga ega `end` parametrini ko'rsatishim kerak bo'ladi — chunki men natijani BITTA QATORDA ko'rishni xohlayman."**

### 🔑 Muhim xulosa

> ## **"O'ylaymanki, siz rozi bo'lasiz: kodimizda MAVJUD BO'LGAN ro'yxatning nomini ko'rsatish SHART EMAS edi."**
>
> ## **"`range` funksiyasi hosil qilgan sonlar ketma-ketligidan foydalanish ham ISHLAYDI."**

```python
# Ro'yxat KERAK EMAS:
for n in range(10):     ← range to'g'ridan-to'g'ri
    ...

# Ro'yxat BILAN:
sonlar = [0,1,2,3,4,5,6,7,8,9]
for n in sonlar:
    ...
```

---

## 2. Sikl ichida shart

> **"Endi jasur bo'lib, sikl tanasida SHART bo'lgan iteratsiya yarataylik."**
>
> **"Biz kompyuterga 0 va 19 orasidagi barcha JUFT qiymatlarni chop etishni, va TOQ sonlar bo'lgan joylarda `Odd` deb yozishni aytishimiz mumkin."**

> **"Buni hisoblash qadamlariga tarjima qilaylik."**
>
> **"Agar `x` 2 ga bo'linganda NOL qoldiq qoldirsa — bu `x` JUFT deyish bilan bir xil — u holda `x` ni ayni qatorda chop et."**
>
> **"`Else` — bu `x` juft bo'lmasa, yoki `x` toq bo'lsa degani. `Odd` ni chop et."**

```python
for x in range(20):
    if x % 2 == 0:
        print(x, end=" ")
    else:
        print("Odd", end=" ")
```

```
0 Odd 2 Odd 4 Odd 6 Odd 8 Odd 10 Odd 12 Odd 14 Odd 16 Odd 18 Odd
```

> **"Ajoyib. Bu — Python'dagi ITERATSIYA va SHART birikmasining misoli."**

### Chekinish darajalari

```python
for x in range(20):          ← 0-daraja
    if x % 2 == 0:           ← 1-daraja (sikl ichida)
        print(x, end=" ")    ← 2-daraja (if ichida)
    else:                    ← 1-daraja
        print("Odd", end=" ")← 2-daraja
```

> 🔑 Har bir ichma-ich blok **yana 4 ta bo'sh joy** o'ngga suriladi.

---

## 3. Siklni dasturlashning IKKI usuli

> **"Siklni dasturlashning IKKITA asosiy usuli bor, va shu paytgacha biz faqat birinchisiga e'tibor qaratdik."**

### 1-usul — elementlar bo'ylab

> **"Bizda `x` ro'yxati bor — u nol, bir va ikki sonlarini o'z ichiga oladi."**
>
> **"Biz uning har bir elementini shunday yozib chop eta olishimizni ko'rdik: `x` ro'yxatidagi HAR BIR element uchun o'sha elementni chop et."**

```python
x = [0, 1, 2]

for item in x:
    print(item, end=" ")
```
```
0 1 2
```

### 2-usul — indekslar bo'ylab

> **"Ikkinchi usul o'zining amaliy qo'llanilishini yanada MURAKKAB kodlarda topadi."**
>
> **"Uning tuzilmasi `range` va `len` funksiyalaridan quyidagi tarzda foydalanadi:"**
>
> **"`x` ro'yxatidagi elementlar bo'ylab o'tadigan range dagi HAR BIR element uchun — ya'ni `len(x)` argumenti bilan — har bir elementni chop et."**

```python
for item in range(len(x)):
    print(x[item], end=" ")
```
```
0 1 2
```

> **"Agar biz shunday qilsak, `item` o'zgaruvchisi `range` yaratgan YANGI ro'yxat bo'ylab aylanadi — va u `x` ro'yxatining o'zi qancha element bo'lsa, shuncha elementga ega."**
>
> ## **"Iltimos, diqqat qiling: bu vaziyatda kodimizning IKKINCHI QATORI `x` ro'yxatidan har bir elementni ajratib olish uchun INDEKSLASHNI talab qiladi."**

> **"Amalda biz `x` ro'yxatidan 0-pozitsiyadagi elementni, keyin 1-pozitsiyadagini, va nihoyat 2-pozitsiyadagini chop etamiz."**

### Ikkalasini yonma-yon

```python
x = [0, 1, 2]

# 1-USUL — ELEMENT
for item in x:
    print(item)
#   item = 0, 1, 2  ← QIYMAT

# 2-USUL — INDEKS
for item in range(len(x)):
    print(x[item])
#   item = 0, 1, 2  ← POZITSIYA
#   x[item] — QIYMAT
```

---

## 4. Qaysi birini tanlash?

> **"Xulosa qilib aytganda, ikkala yondashuv ham BIR XIL natijaga olib kelishi mumkin."**
>
> ## **"Garchi ikkinchisi keraksiz murakkab ko'rinsa ham — ILG'OR kodlashda u ANCHA foydaliroq bo'lib chiqishi mumkin. Shuning uchun ikkalasini ham bilishingiz muhim."**

### Qachon 2-usul kerak?

**1 · Parallel ro'yxatlar bilan ishlaganda:**

```python
talabalar = ["Ali", "Vali", "Hasan"]
ballar    = [87, 65, 92]

for i in range(len(talabalar)):
    print(talabalar[i], "-", ballar[i])
```

**2 · Ro'yxat elementini o'zgartirish kerak bo'lganda:**

```python
r = [1, 2, 3]

for x in r:
    x = x * 2           # ❌ ISHLAMAYDI — nusxa o'zgaradi
print(r)                # [1, 2, 3]

for i in range(len(r)):
    r[i] = r[i] * 2     # ✅ ISHLAYDI
print(r)                # [2, 4, 6]
```

**3 · Pozitsiya kerak bo'lganda:**

```python
for i in range(len(talabalar)):
    print(i + 1, "-o'rin:", talabalar[i])
```

---

## 5. 💻 To'liq kod

```python
# ===== RANGE + FOR =====
for n in range(10):
    print(2 ** n, end=" ")
print()

# ===== SIKL + SHART =====
for x in range(20):
    if x % 2 == 0:
        print(x, end=" ")
    else:
        print("Odd", end=" ")
print()

# ===== IKKI USUL =====
x = [0, 1, 2]

for item in x:                      # 1-USUL
    print(item, end=" ")
print()

for item in range(len(x)):          # 2-USUL
    print(x[item], end=" ")
print()

# ===== 2-USUL KERAK BO'LGAN HOLAT =====
r = [1, 2, 3]
for i in range(len(r)):
    r[i] = r[i] * 2
print(r)

# ===== PARALLEL RO'YXATLAR =====
talabalar = ["Ali", "Vali", "Hasan"]
ballar    = [87, 65, 92]
for i in range(len(talabalar)):
    print(talabalar[i], "-", ballar[i])

# ===== SIKL + ELIF =====
for ball in [95, 75, 55, 30]:
    if ball >= 90:
        print(ball, "A'lo")
    elif ball >= 70:
        print(ball, "Yaxshi")
    elif ball >= 50:
        print(ball, "Qoniqarli")
    else:
        print(ball, "Qoniqarsiz")

# ===== FILTRLASH =====
sonlar = [15, 42, 8, 31, 67, 4]
for son in sonlar:
    if son > 20:
        print(son, end=" ")
print()
```

**Natija:**

```
1 2 4 8 16 32 64 128 256 512 
0 Odd 2 Odd 4 Odd 6 Odd 8 Odd 10 Odd 12 Odd 14 Odd 16 Odd 18 Odd 
0 1 2 
0 1 2 
[2, 4, 6]
Ali - 87
Vali - 65
Hasan - 92
95 A'lo
75 Yaxshi
55 Qoniqarli
30 Qoniqarsiz
42 31 67 
```

---

## 6. 📝 Rasmiy mashqlar (kursdan)

### Mashq 1
**Berilgan ro'yxatdagi barcha o'zgaruvchilarni 2 ga ko'paytirib chop etadigan `for` sikli yarating. Ro'yxat 1 dan 10 gacha barcha sonlarni o'z ichiga olsin. Uni `range()` funksiyasi yordamida yarating.**

<details>
<summary>✅ Yechim</summary>

```python
for n in range(1, 11):
    print(n * 2)
```

```
2
4
6
8
10
12
14
16
18
20
```

**Bir qatorda:**

```python
for n in range(1, 11):
    print(n * 2, end=" ")
```
```
2 4 6 8 10 12 14 16 18 20
```

</details>

### Mashq 2
**1 dan 30 gacha barcha qiymatlar bo'ylab sikl yuritadigan kichik dastur yarating. U barcha TOQ sonlarni chop etsin, JUFT sonlar o'rnida esa `"Even"` deb yozsin.**

**Bu mashqni yechishda `range()` funksiyasi yordam beradi.**

<details>
<summary>✅ Yechim</summary>

```python
for x in range(1, 31):
    if x % 2 == 1:
        print(x, end=" ")
    else:
        print("Even", end=" ")
```

```
1 Even 3 Even 5 Even 7 Even 9 Even 11 Even 13 Even 15 Even 17 Even 19 Even 21 Even 23 Even 25 Even 27 Even 29 Even
```

> 💡 **Diqqat:** ma'ruzadagi misolda `x % 2 == 0` (**juft**) tekshirilardi. Bu yerda `x % 2 == 1` (**toq**) — chunki **toq** sonlar chop etilishi kerak.

</details>

### Mashq 3
**Sizda quyidagi sonlar ro'yxati bor. Bu ro'yxat bo'ylab iteratsiya qiling, har bir qiymatni 10 ga ko'paytirib chop eting. Bu masalaning IKKITA yechimini toping.**

```python
n = [1, 2, 3, 4, 5, 6]
```

<details>
<summary>✅ Yechim</summary>

**1-yechim — element bo'ylab:**

```python
n = [1, 2, 3, 4, 5, 6]

for item in n:
    print(item * 10, end=" ")
```
```
10 20 30 40 50 60
```

**2-yechim — indeks bo'ylab:**

```python
for item in range(len(n)):
    print(n[item] * 10, end=" ")
```
```
10 20 30 40 50 60
```

</details>

---

## 7. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** 1 dan 10 gacha kvadratlarni chiqaring.

**M2.** 1 dan 20 gacha 3 ga bo'linadiganlarni chiqaring.

**M3.** Ro'yxatdagi musbat sonlarni ajratib chiqaring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
for n in range(1, 11):
    print(n ** 2, end=" ")
print()                             # 1 4 9 16 25 36 49 64 81 100

# M2
for n in range(1, 21):
    if n % 3 == 0:
        print(n, end=" ")
print()                             # 3 6 9 12 15 18

# M3
sonlar = [5, -3, 12, -8, 0, 7]
for son in sonlar:
    if son > 0:
        print(son, end=" ")
print()                             # 5 12 7
```

</details>

### 🟡 O'rta

**M4.** FizzBuzz: 1–20 uchun `3` ga bo'linsa `"Fizz"`, `5` ga `"Buzz"`, ikkalasiga `"FizzBuzz"`.

**M5.** Ro'yxat elementlarini **ikki barobarga** oshiring (asl ro'yxatni o'zgartirib).

**M6.** Parallel ro'yxatlarni birga chiqaring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
for n in range(1, 21):
    if n % 3 == 0 and n % 5 == 0:
        print("FizzBuzz", end=" ")
    elif n % 3 == 0:
        print("Fizz", end=" ")
    elif n % 5 == 0:
        print("Buzz", end=" ")
    else:
        print(n, end=" ")
print()
# 1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz 16 17 Fizz 19 Buzz

# M5
r = [1, 2, 3, 4]
for i in range(len(r)):
    r[i] = r[i] * 2
print(r)                            # [2, 4, 6, 8]

# M6
mahsulotlar = ["Non", "Sut", "Choy"]
narxlar     = [4000, 12000, 8000]
sonlar      = [3, 2, 4]
for i in range(len(mahsulotlar)):
    print(mahsulotlar[i], "x", sonlar[i], "=", narxlar[i] * sonlar[i])
# Non x 3 = 12000
# Sut x 2 = 24000
# Choy x 4 = 32000
```

</details>

### 🔴 Qiyin

**M7.** Nima uchun `for x in r: x = x * 2` **ishlamaydi**? Isbotlang.

**M8.** Ichma-ich sikl bilan **ko'paytirish jadvali** chiqaring.

**M9.** Ro'yxatdagi **eng katta** va **eng kichik** sonni bir siklda toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
r = [1, 2, 3]
for x in r:
    x = x * 2                       # x — NUSXA, ro'yxat emas
print(r)                            # [1, 2, 3]   ← O'ZGARMADI

# TO'G'RI USUL:
r2 = [1, 2, 3]
for i in range(len(r2)):
    r2[i] = r2[i] * 2               # RO'YXATNING O'ZIGA yozamiz
print(r2)                           # [2, 4, 6]   ✅

# M8
for i in range(1, 6):
    for j in range(1, 6):
        print(i * j, end="\t")
    print()
# 1	2	3	4	5	
# 2	4	6	8	10	
# 3	6	9	12	15	
# 4	8	12	16	20	
# 5	10	15	20	25	

# M9
sonlar = [15, 42, 8, 31, 67, 4]
eng_katta = sonlar[0]
eng_kichik = sonlar[0]
for son in sonlar:
    if son > eng_katta:
        eng_katta = son
    if son < eng_kichik:
        eng_kichik = son
print("Katta:", eng_katta, " Kichik:", eng_kichik)
# Katta: 67  Kichik: 4
```

</details>

---

## 8. 🧠 O'zini tekshirish savollari

1. `range` ni `for` bilan ishlatish uchun ro'yxat kerakmi?
2. `for n in range(10): print(2**n)` nima beradi?
3. Sikl tanasida shart bo'lishi mumkinmi?
4. `x % 2 == 0` nimani anglatadi?
5. Siklni dasturlashning nechta usuli bor?
6. 1-usul qanday ishlaydi?
7. 2-usul qanday tuzilmadan foydalanadi?
8. 2-usulda ikkinchi qator nima talab qiladi?
9. Ikkala yondashuv bir xil natija beradimi?
10. Nima uchun ikkalasini bilish muhim?

<details>
<summary>✅ Javoblar</summary>

1. **Yo'q** — mavjud ro'yxat nomini ko'rsatish **shart emas**.
2. **`1 2 4 8 16 32 64 128 256 512`** — 2 ning 0 dan 9 gacha darajalari.
3. **Ha** — bu iteratsiya va shart **birikmasi**.
4. `x` 2 ga bo'linganda **nol qoldiq** qoldirishi — ya'ni `x` **juft**.
5. **Ikkita.**
6. Ro'yxatdagi **har bir element** uchun sikl tanasi bajariladi.
7. **`range` va `len`** funksiyalaridan: `range(len(x))`.
8. **Indekslashni** — `x[item]`.
9. **Ha** — ikkalasi ham bir xil natijaga olib keladi.
10. Ikkinchisi keraksiz murakkab ko'rinsa ham, **ilg'or kodlashda ancha foydaliroq** bo'lib chiqishi mumkin.

</details>

---

## 📌 Xulosa

```python
# RANGE + FOR — ro'yxat KERAK EMAS
for n in range(10):
    print(2 ** n, end=" ")
→  1 2 4 8 16 32 64 128 256 512


# SIKL + SHART
for x in range(20):
    if x % 2 == 0:
        print(x, end=" ")
    else:
        print("Odd", end=" ")
→  0 Odd 2 Odd 4 Odd ...


SIKLNING IKKI USULI

1-USUL — ELEMENT bo'ylab           2-USUL — INDEKS bo'ylab
for item in x:                     for item in range(len(x)):
    print(item)                        print(x[item])
                                                ↑ INDEKSLASH kerak!

item = QIYMAT                      item = POZITSIYA


2-USUL QACHON KERAK?
• Parallel ro'yxatlar         talabalar[i], ballar[i]
• Ro'yxatni O'ZGARTIRISH      r[i] = r[i] * 2
• Pozitsiya kerak bo'lganda   print(i+1, "-o'rin")


⚠️  BU ISHLAMAYDI:
for x in r:
    x = x * 2        ← x NUSXA, ro'yxat o'zgarmaydi

✅  BU ISHLAYDI:
for i in range(len(r)):
    r[i] = r[i] * 2
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `range(len(x))` | *range(len(x))* | Indekslar bo'ylab aylanish |
| Ichma-ich sikl | *nested loop* | Sikl ichidagi sikl |
| Filtrlash | *filtering* | Shart bo'yicha tanlash |
| Parallel ro'yxat | *parallel list* | Bir xil indeksda mos elementlar |

---

⬅️ [Oldingi: `range()` funksiyasi](03-The-range-Function.md) · ➡️ [Keyingi: Shartlar, funksiyalar va sikllar](05-Conditionals-Functions-and-Loops.md)
