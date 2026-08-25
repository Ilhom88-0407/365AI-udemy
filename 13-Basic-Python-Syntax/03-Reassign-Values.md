# 3-dars. Qiymatlarni qayta biriktirish

## 🎬 Boshlashdan oldin

> **"Bu — boshqa dasturlash tillari uchun ham to'g'ri bo'lgan dasturlash tushunchasi."**

Bir jumlada: **oxirgi buyruq g'olib**.

---

## 1. Misol bosqichma-bosqich

### 1-qadam

```python
z = 1
z
```

```
1
```

> **Agar men `z` o'zgaruvchisiga 1 qiymatini biriktirsam, `z` ni bajargandan keyingi natijam 1 bo'ladi.**

### 2-qadam

```python
z = 3
z
```

```
3
```

> **Shundan so'ng, agar men XUDDI SHU `z` o'zgaruvchisiga 3 ni biriktirsam — `z` 3 ga teng bo'ladi, endi 1 emas.**

---

## 2. 🔑 Nima uchun shunday

> **Qanday qilib? Xo'sh, BUYRUQLAR TARTIBI muhim.**
>
> **Dastlab biz `z` 1 ga teng bo'ladi dedik, va bu biz qiymatni 3 ga o'zgartirgunimizcha kompyuter uchun ROST edi.**
>
> **O'sha daqiqadan boshlab `z` 1 ga teng EMAS va u 3 bo'lib qoladi.**

---

## 3. Isbot

> **Isbot sifatida buni ko'ring.**

```python
z + 5
```

```
8
```

> **Agar `z` ga 5 ni qo'shsak, biz **8** ni olamiz** — **1 + 5 ga teng bo'lgan 6 ni EMAS.**

### Yana bir marta

```python
z = 7
z
```

```
7
```

> **Keyin agar biz to'satdan `z` 7 ga teng deb qaror qilsak — `z` endi 1 ga ham, 3 ga ham teng EMAS.**

---

## 4. 📌 Qoida

> ## **Python o'z obyektlariga qiymatlarni QAYTA BIRIKTIRADI.**
>
> ## **Shuning uchun eslang: OXIRGI BUYRUQ AMAL QILADI, eskilari esa USTIGA YOZILADI (overwritten).**

---

## 5. 🧠 Tasavvur qilish

```
z = 1        ┌───────┐
             │   1   │   ← quti ichida 1
             └───────┘
                 z

z = 3        ┌───────┐
             │   3   │   ← 1 YO'QOLDI, o'rniga 3
             └───────┘
                 z

z + 5   →   3 + 5   →   8      (1 + 5 = 6 EMAS!)

z = 7        ┌───────┐
             │   7   │   ← endi 7
             └───────┘
                 z
```

> 💡 **Muhim:** `z + 5` amali `z` ni **o'zgartirmaydi**. U shunchaki **natijani hisoblaydi**. `z` ni o'zgartirish uchun `z = z + 5` yozish kerak.

---

## 6. 💻 To'liq kod

```python
# ===== BOSQICHMA-BOSQICH =====
z = 1
print(z)              # 1

z = 3
print(z)              # 3      ← eski qiymat yo'qoldi

print(z + 5)          # 8      ← 3 + 5, NE 1 + 5
print(z)              # 3      ← z O'ZGARMADI!

z = 7
print(z)              # 7

# ===== O'ZINI O'ZGARTIRISH =====
z = z + 5
print(z)              # 12     ← ENDI o'zgardi

# ===== TURLAR ARALASHMASI =====
print(3 + 5)          # 8      int + int  → int
print(3 + 5.0)        # 8.0    int + float → float
# print(3 + '5')      # ❌ TypeError
```

**Natija:**

```
1
3
8
3
7
12
8
8.0
```

---

## 7. ⚠️ Jupyter'dagi tuzoq

Bu — 11-modulning 7-darsidagi **yashirin holat** muammosining aynan o'zi:

```python
# [1] yacheykada
z = 1

# [2] yacheykada
z = 3

# Endi [1] ni QAYTA ishga tushirsangiz:
z = 1

# [3] yacheykada
print(z)      # 1 !!!  — chunki [1] oxirgi bajarildi
```

> ## 🔑 **Jupyter'da "oxirgi buyruq" — bu FAYLDAGI oxirgi qator emas, BAJARILGAN oxirgi qator.**
>
> Shuning uchun **`Restart & Run All`** shunchalik muhim.

---

## 8. 📝 Rasmiy mashqlar (kursdan)

### Mashq 1
**`p` o'zgaruvchisiga 14 qiymatini bering.**

<details>
<summary>✅ Yechim</summary>

```python
p = 14
```

</details>

### Mashq 2
**`p + 10` ni hisoblang.**

<details>
<summary>✅ Yechim</summary>

```python
p + 10        # → 24
```

</details>

### Mashq 3
**Endi `p` o'zgaruvchisiga 30 ni biriktiring.**

<details>
<summary>✅ Yechim</summary>

```python
p = 30
```

</details>

### Mashq 4
**`p + 10` ni hisoblang.**

<details>
<summary>✅ Yechim</summary>

```python
p + 10        # → 40
```

> **Kuzating: `p` qiymati DOIM siz oxirgi biriktirgan qiymat bo'ladi.**

</details>

---

## 9. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `x = 10`, keyin `x = 20`, keyin `x = 30`. `x` nimaga teng?

**M2.** `narx = 5000`. `narx + 1000` ni hisoblang. Endi `narx` ni chop eting. O'zgardimi?

**M3.** `soni = 5`. Uni **2 barobar** oshiring va yangi qiymatni saqlang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
x = 10
x = 20
x = 30
print(x)          # 30   ← oxirgisi

# M2
narx = 5000
print(narx + 1000)   # 6000
print(narx)          # 5000  ← O'ZGARMADI!
# narx + 1000 faqat HISOBLAYDI, saqlamaydi

# M3
soni = 5
soni = soni * 2
print(soni)          # 10
```

</details>

### 🟡 O'rta

**M4.** Bir necha marta o'zgartiring va har qadamda chop eting:
```python
hisob = 100
hisob = hisob - 30
hisob = hisob + 50
hisob = hisob * 2
```
Oxirgi qiymat nima?

**M5.** Qisqartirilgan yozuvni sinang (bu **14-modulda** batafsil):
```python
a = 10
a += 5      # a = a + 5
a -= 3      # a = a - 3
a *= 2      # a = a * 2
print(a)
```

**M6.** Ikkita o'zgaruvchi bir-biriga bog'liq bo'lsa nima bo'ladi?
```python
a = 5
b = a
a = 100
print(b)    # ?
```

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
hisob = 100
hisob = hisob - 30    # 70
hisob = hisob + 50    # 120
hisob = hisob * 2     # 240
print(hisob)          # 240

# M5
a = 10
a += 5     # 15
a -= 3     # 12
a *= 2     # 24
print(a)   # 24

# M6
a = 5
b = a       # b ga a ning QIYMATI (5) ko'chiriladi
a = 100     # a o'zgardi
print(b)    # 5  ← b O'ZGARMADI!
```

**M6 saboqi:** `b = a` bu **nusxa** — bog'lanish emas. Sonlar bilan ishlaganda ular **bir-biriga bog'liq bo'lmaydi**.

</details>

### 🔴 Qiyin

**M7.** Ikkita o'zgaruvchi qiymatini **uchinchi o'zgaruvchi orqali** almashtiring (klassik usul):
```python
a = 5
b = 10
# a = 10, b = 5 bo'lsin
```

**M8.** Quyidagi kod nima chiqaradi? **Avval taxmin qiling**:
```python
n = 3
n = n ** 2
n = n + n
n = n // 5
print(n)
```

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — klassik usul (vaqtinchalik o'zgaruvchi bilan)
a = 5
b = 10
vaqtinchalik = a
a = b
b = vaqtinchalik
print(a, b)      # 10 5

# Python'da osonroq (12-modulning A10 mashqi):
a, b = b, a
```

```python
# M8 — qadam-baqadam
n = 3
n = n ** 2      # 9
n = n + n       # 18
n = n // 5      # 3
print(n)        # 3
```

</details>

---

## 10. 🧠 O'zini tekshirish savollari

1. `z = 1`, keyin `z = 3` bo'lsa, `z` nimaga teng?
2. Nima uchun shunday bo'ladi?
3. `z = 3` bo'lganda `z + 5` nima beradi va nima uchun `6` emas?
4. `z + 5` dan keyin `z` o'zgaradimi?
5. Python obyektlarga nima qiladi?
6. Qaysi buyruq amal qiladi?
7. Eski buyruqlarga nima bo'ladi?

<details>
<summary>✅ Javoblar</summary>

1. **`3`** — oxirgi biriktirilgan qiymat.
2. Chunki **buyruqlar tartibi muhim** — yangi qiymat eskisining **o'rnini egallaydi**.
3. **`8`** — chunki `z` endi **3**, `1` emas. `3 + 5 = 8`.
4. **Yo'q** — `z + 5` faqat **hisoblaydi**, saqlamaydi. `z` ni o'zgartirish uchun `z = z + 5` kerak.
5. **Qiymatlarni qayta biriktiradi** (reassign).
6. **Oxirgi buyruq.**
7. Ular **ustiga yoziladi** (overwritten).

</details>

---

## 📌 Xulosa

```
z = 1     →  z ichida 1
z = 3     →  z ichida 3  (1 YO'QOLDI)
z + 5     →  8           (hisoblaydi, LEKIN z ni o'zgartirmaydi)
z         →  3           (hali ham 3!)
z = z + 5 →  z ichida 8  (ENDI o'zgardi)

🔑 OXIRGI BUYRUQ AMAL QILADI, eskilari USTIGA YOZILADI

⚠️ Jupyter'da "oxirgi" = BAJARILGAN oxirgi, fayldagi oxirgi EMAS
   → shuning uchun Restart & Run All muhim
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Qayta biriktirish | *reassign* | Yangi qiymat berish |
| Ustiga yozish | *overwrite* | Eskisini almashtirish |
| Buyruqlar tartibi | *order of commands* | Bajarilish ketma-ketligi |
| Obyekt | *object* | Python'dagi har qanday qiymat |

---

⬅️ [Oldingi: Ikki tenglik belgisi](02-The-Double-Equality-Sign.md) · ➡️ [Keyingi: Izohlar qo'shish](04-Add-Comments.md)
