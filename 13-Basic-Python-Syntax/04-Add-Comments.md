# 4-dars. Izohlar qo'shish

## 🎬 Boshlashdan oldin

Bugun yozgan kodingizni **6 oydan keyin** o'qiysiz. Va tushunmaysiz.

> Izohlar — **kelajakdagi o'zingizga** yozilgan xat.

---

## 1. Muammo

> **Ayniqsa kodingiz UZAYGANDA** — va uzun deganda men **o'nlab yoki yuzlab qatorni** nazarda tutyapman —
>
> **ishingiz qanday tuzilganini tushunish QIYINLASHADI, chunki qatorlar juda ko'p.**

*(10-modulning 1-darsini eslang: "amalda siz yuzlab kod satri bilan ishlaysiz".)*

---

## 2. Yechim: izoh

> **Bunday vaziyatlarda siz IZOH qoldirishingiz mumkin.**
>
> ## **Izohlar — kompyuter tomonidan BAJARILMAYDIGAN jumlalar.**
>
> **U ularni ko'rsatma sifatida O'QIMAYDI.**

### Sintaksis

> ## **Hiyla shundaki: izoh sifatida kiritmoqchi bo'lgan HAR BIR QATOR BOSHIGA XESH BELGISI (`#`) qo'yish.**

```python
# Bu shunchaki izoh, kod emas!
```

**Bajarganda:**

> **Yacheykani ishga tushirganingizda HECH QANDAY NATIJA bo'lmaydi, chunki izoh kod hisoblanmaydi.**

---

## 3. Kod bilan birga

> **Kod qo'shaylik.**

```python
# Bu shunchaki izoh, kod emas!
print(7, 2)
```

```
7 2
```

> **`Shift + Enter` bilan bajaring. Ha, aynan.**
>
> **Biz 7 va 2 ni bir qatorda oldik, va xeshteg bilan belgilangan izoh qatori HECH QANDAY natija bermadi.**
>
> ## **U faqat DASTURCHIGA ko'rinadigan bo'lib qoldi. Kompyuter faqat `print` buyrug'ini bajardi.**

---

## 4. Ko'p qatorli izoh

> **Agar biz IKKI QATORDA izoh qoldirmoqchi bo'lsak — HAR BIR QATOR boshiga xesh belgisini qo'yishni unutmang.**

```python
# Izoh 1
# Izoh 2
print(300)
```

```
300
```

> **Ikkalasi ham izoh bo'ladi. Hammasi ishlayotganga o'xshaydi.**

---

## 5. 💻 To'liq kod

```python
# ===== ODDIY IZOH =====
# Bu shunchaki izoh, kod emas!
print(7, 2)              # 7 2

# ===== IKKI QATORLI IZOH =====
# Izoh 1
# Izoh 2
print(300)               # 300

# ===== QATOR OXIRIDA IZOH =====
narx = 5000              # mahsulot narxi so'mda
soni = 3                 # nechta olindi
print(narx * soni)       # 15000

# ===== KODNI VAQTINCHA O'CHIRISH =====
# print("Bu qator ishlamaydi")
print("Bu qator ishlaydi")
```

**Natija:**

```
7 2
300
15000
Bu qator ishlaydi
```

---

## 6. 💡 Izohning uch xil qo'llanishi

Ma'ruzada faqat birinchisi aytilgan, lekin amalda uchtasi ham ishlatiladi:

### 1 · Tushuntirish

```python
# QQS ni hisoblaymiz (O'zbekistonda 12%)
qqs = summa * 0.12
```

### 2 · Bo'limlarga ajratish

```python
# ===== 1. MA'LUMOTLAR =====
narx = 5000

# ===== 2. HISOB =====
jami = narx * 3

# ===== 3. NATIJA =====
print(jami)
```

### 3 · Kodni vaqtincha o'chirish (*commenting out*)

```python
# print("Eski variant")
print("Yangi variant")
```

> 🔑 **Uchinchisi — juda kerakli usul.** Kodni **o'chirmasdan** sinab ko'rish mumkin. Ishlamasa — `#` ni olib tashlaysiz.
>
> **Jupyter'da tezkor tugma:** qatorni belgilab, `Ctrl + /` bosing.

---

## 7. ⚠️ Yaxshi va yomon izohlar

### ❌ Yomon — aniq narsani takrorlaydi

```python
x = x + 1        # x ga 1 qo'shamiz
narx = 5000      # narx 5000 ga teng
```

Bu izohlar **hech narsa qo'shmaydi** — kod allaqachon shuni aytyapti.

### ✅ Yaxshi — NIMA UCHUN ni tushuntiradi

```python
x = x + 1        # indeks 0 dan boshlanadi, shuning uchun tuzatamiz
narx = 5000      # 2025-yil yanvar holatiga ko'ra, yetkazib beruvchi narxi
```

> ## 🔑 **Qoida: kod NIMA qilishini ko'rsatadi. Izoh NIMA UCHUN qilishini tushuntiradi.**

---

## 8. 📝 Rasmiy mashq (kursdan)

Bu darsda alohida rasmiy mashq yo'q — lekin notebook'da ikkita namuna bor:

```python
# This is just a comment and not code!
print(7, 2)
```

```python
# Comment 1
# Comment 2
print(300)
```

---

## 9. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Quyidagi kodga izohlar qo'shing — har bir qator nima qilishini tushuntiring:
```python
radius = 5
pi = 3.14159
yuza = pi * radius ** 2
print(yuza)
```

**M2.** Uchta qatorli izoh yozing (bo'lim sarlavhasi ko'rinishida).

**M3.** Quyidagi kodning **2-qatorini** vaqtincha o'chiring:
```python
print("Birinchi")
print("Ikkinchi")
print("Uchinchi")
```

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
radius = 5              # doira radiusi (sm)
pi = 3.14159            # pi soni, taxminiy qiymat
yuza = pi * radius ** 2 # doira yuzi formulasi: S = πr²
print(yuza)             # 78.53975

# M2
# ===============================
#        HISOBOT BO'LIMI
# ===============================

# M3
print("Birinchi")
# print("Ikkinchi")
print("Uchinchi")
```

</details>

### 🟡 O'rta

**M4.** Yomon izohlarni yaxshisiga aylantiring:
```python
soni = 0                        # soni 0
soni = soni + 1                 # soni ga 1 qo'shamiz
chegirma = narx * 0.15          # narxni 0.15 ga ko'paytiramiz
```

**M5.** Chek dasturingizni **uchta bo'limga** ajrating: ma'lumotlar, hisob, natija.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — NIMA UCHUN ni tushuntiruvchi izohlar
soni = 0                    # sotilgan mahsulotlar hisoblagichi
soni = soni + 1             # har bir sotuv uchun hisoblagichni oshiramiz
chegirma = narx * 0.15      # doimiy mijozlar uchun 15% chegirma

# M5
# ===== 1. MA'LUMOTLAR =====
mahsulot = "Noutbuk"
narx = 8500000
soni = 2

# ===== 2. HISOB =====
oraliq = narx * soni
qqs = oraliq * 0.12
jami = oraliq + qqs

# ===== 3. NATIJA =====
print(mahsulot, "x", soni)
print("Jami:", jami, "so'm")
```

</details>

### 🔴 Qiyin

**M6.** Izohlar bilan **kodni hujjatlashtiring**. Quyidagi kod nima qilishini tushunib, to'liq izohlang:
```python
n = 3725
a = n // 3600
b = n % 3600 // 60
c = n % 60
print(a, b, c)
```

**M7.** Izohlar **ichida** kod bo'lsa nima bo'ladi? Sinab ko'ring:
```python
# print("Bu ishlaydimi?")
print("# Bu-chi?")
```

<details>
<summary>✅ Yechimlar</summary>

```python
# M6 — sekundni soat:daqiqa:sekundga aylantirish
n = 3725                # jami sekundlar soni
a = n // 3600           # to'liq soatlar (1 soat = 3600 sekund)
b = n % 3600 // 60      # soatdan qolgan qismdagi to'liq daqiqalar
c = n % 60              # qolgan sekundlar
print(a, b, c)          # 1 2 5  →  1 soat 2 daqiqa 5 sekund
```

```python
# M7
# print("Bu ishlaydimi?")     ← IZOH, bajarilmaydi
print("# Bu-chi?")            # → # Bu-chi?
```

**Saboq:** `#` faqat **kod ichida** izoh boshlaydi. **Qo'shtirnoq ichidagi** `#` — bu oddiy **belgi**, izoh emas.

</details>

---

## 10. 🧠 O'zini tekshirish savollari

1. Qachon izoh qoldirish zarur bo'ladi?
2. Izoh nima?
3. Kompyuter izohni qanday o'qiydi?
4. Izoh belgisi qanday?
5. Izohli yacheykani bajarganda nima bo'ladi?
6. Ikki qatorli izoh qanday yoziladi?
7. Izoh kimga ko'rinadi?

<details>
<summary>✅ Javoblar</summary>

1. Kod **uzayganda** — o'nlab yoki yuzlab qator bo'lganda, tuzilmani tushunish qiyinlashadi.
2. **Kompyuter tomonidan bajarilmaydigan jumlalar.**
3. **Hech qanday** — u ularni **ko'rsatma sifatida o'qimaydi**.
4. **Xesh belgisi `#`** — qator **boshiga** qo'yiladi.
5. **Hech qanday natija bo'lmaydi** — izoh kod hisoblanmaydi.
6. **Har bir qator boshiga** alohida `#` qo'yiladi.
7. Faqat **dasturchiga**.

</details>

---

## 📌 Xulosa

```python
# Bu izoh — kompyuter uni O'QIMAYDI
print(7, 2)          # qator oxirida ham bo'lishi mumkin

# Ikki
# qatorli izoh       ← har biriga alohida #

# print("o'chirilgan")   ← kodni VAQTINCHA o'chirish

🔑 QOIDA:
   KOD   →  NIMA qilishini ko'rsatadi
   IZOH  →  NIMA UCHUN qilishini tushuntiradi

⌨️  Jupyter: Ctrl + /  — tanlangan qatorlarni izohga aylantiradi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Izoh | *comment* | Bajarilmaydigan tushuntirish |
| Xesh belgisi | *hash sign* | `#` |
| Kodni o'chirish | *commenting out* | Kodni vaqtincha izohga aylantirish |
| Hujjatlashtirish | *documentation* | Kodni tushuntirib yozish |

---

⬅️ [Oldingi: Qayta biriktirish](03-Reassign-Values.md) · ➡️ [Keyingi: Qator davomi](05-Line-Continuation.md)
