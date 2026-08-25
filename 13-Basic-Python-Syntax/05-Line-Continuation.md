# 5-dars. Qator davomi (line continuation)

## 🎬 Boshlashdan oldin

> **"Men sizga ILG'OR Python dasturchisi bo'lganingizda va katta hajmdagi kod bilan ishlaganingizda NIHOYATDA QIMMATLI bo'ladigan chiroyli hiylani ko'rsatmoqchiman.**
>
> **Bu juda qulay xususiyat, shuning uchun iltimos DIQQAT BERING."**

---

## 1. Muammo

> **Ba'zan yacheyka uzunligi qatoringizni tugatish uchun YETARLI BO'LMAYDI.**
>
> **Kod qatorlari uzayib ketishi mumkin, yoki shunchaki kodni TARTIBGA SOLISH uchun siz kodning bir qismini KEYINGI QATORGA yubormoqchi bo'lishingiz mumkin.**

---

## 2. Yechim: teskari chiziq `\`

> **Demak, `2.0 * 1.5 + 5` ni IKKI QATORDA yozish mumkin, va mashina uni baribir BITTA BUYRUQ deb o'qiydi.**
>
> ## **Bunga birinchi qator tugashini xohlagan joyga TESKARI CHIZIQ (backslash) qo'yish orqali erishiladi.**
>
> **U siz xuddi shu buyruqni YANGI QATORDA davom ettirishingizni bildiradi.**

```python
2.0 * 1.5 + \
5
```

```
8.0
```

> **Zo'r, to'g'rimi?**

---

## 3. ⚠️ Nima uchun bu muhim — rasmiy mashqdan

Kursning yechimlar faylida juda **o'qituvchi misol** bor:

### `\` SIZ

```python
15 + 31
- 26
```

```
-26
```

> **Nima bo'ldi?** Python buni **ikkita alohida ifoda** deb o'qidi:
> - `15 + 31` → `46` (hisoblandi, lekin **hech qayerga saqlanmadi**)
> - `- 26` → `-26` (bu **oxirgi** ifoda, shuning uchun Jupyter uni ko'rsatdi)

### `\` BILAN

```python
15 + 31 \
- 26
```

```
20
```

> **Endi Python buni BITTA ifoda deb o'qidi:** `15 + 31 - 26 = 20`.

---

## 4. 📌 Muhim qoida

> ## **Teskari chiziqdan KEYIN hech narsa bo'lmasligi kerak** — hatto bo'sh joy ham.
>
> `\` **qator oxiridagi ENG OXIRGI belgi** bo'lishi shart.

```python
# ✅ TO'G'RI
2.0 * 1.5 + \
5

# ❌ NOTO'G'RI — \ dan keyin bo'sh joy bor
2.0 * 1.5 + \ 
5
# SyntaxError: unexpected character after line continuation character
```

---

## 5. 💡 Qavslar — muqobil usul

Bu ma'ruzada aytilmagan, lekin amalda **ko'proq ishlatiladi**:

> **Qavslar `()`, `[]`, `{}` ichida qator davomi AVTOMATIK ishlaydi — `\` kerak emas.**

```python
# Backslash bilan
jami = 100 + \
       200 + \
       300

# Qavslar bilan — TAVSIYA ETILADI
jami = (100 +
        200 +
        300)

print(jami)     # 600
```

**Uzun `print` uchun:**

```python
print("Mahsulot:", mahsulot,
      "| Narx:", narx,
      "| Soni:", soni)
```

> 🔑 **Amaliy maslahat:** professional kodda **qavslar afzal ko'riladi** — chunki `\` dan keyin **ko'rinmas bo'sh joy** qolib ketsa, kod **buziladi**. Qavslarda bunday xavf yo'q.

---

## 6. 💻 To'liq kod

```python
# ===== BACKSLASH =====
natija = 2.0 * 1.5 + \
5
print(natija)              # 8.0

# ===== FARQNI KO'RING =====
# \ SIZ — ikkita alohida ifoda
a = 15 + 31
b = - 26
print(a, b)                # 46 -26

# \ BILAN — bitta ifoda
c = 15 + 31 \
- 26
print(c)                   # 20

# ===== QAVSLAR (tavsiya etiladi) =====
jami = (100 +
        200 +
        300)
print(jami)                # 600

# ===== UZUN PRINT =====
mahsulot = "Noutbuk"
narx = 8500000
soni = 2
print("Mahsulot:", mahsulot,
      "| Narx:", narx,
      "| Soni:", soni)
```

**Natija:**

```
8.0
46 -26
20
600
Mahsulot: Noutbuk | Narx: 8500000 | Soni: 2
```

---

## 7. 📝 Rasmiy mashq (kursdan)

### Mashq 1
**Quyidagi kodga teskari chiziq qo'shing — u bir qatorli kod bo'lsin. Natijadagi o'zgarishni kuzating.**

```python
15 + 31
- 26
```

<details>
<summary>✅ Yechim</summary>

**`\` siz:**

```python
15 + 31
- 26
```

```
-26
```

**`\` bilan:**

```python
15 + 31 \
- 26
```

```
20
```

**Farq:** birinchisida Python **ikkita alohida ifoda** ko'radi va **oxirgisini** ko'rsatadi. Ikkinchisida — **bitta ifoda**: `15 + 31 - 26 = 20`.

</details>

---

## 8. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Quyidagi uzun ifodani **uch qatorga** bo'ling (`\` bilan):
```python
natija = 10 + 20 + 30 + 40 + 50
```

**M2.** Xuddi shu ifodani **qavslar** bilan bo'ling.

**M3.** `100 * 2 - 50 / 5` ni ikki qatorda yozing va natijani tekshiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
natija = 10 + 20 + \
         30 + 40 + \
         50
print(natija)      # 150

# M2
natija = (10 + 20 +
          30 + 40 +
          50)
print(natija)      # 150

# M3
natija = 100 * 2 - \
         50 / 5
print(natija)      # 190.0
```

</details>

### 🟡 O'rta

**M4.** Xatoni toping va tuzating:
```python
jami = 5 + \ 
       10
```
*(Ilgak: `\` dan keyin nimadir bor.)*

**M5.** Uzun chek qatorini **ikki qatorga** bo'lib yozing:
```python
print("Mahsulot:", "Noutbuk", "| Narx:", 8500000, "| QQS:", 1020000, "| Jami:", 9520000)
```

**M6.** Satrni ham davom ettirish mumkinmi? Sinang:
```python
matn = "Bu juda uzun " \
       "matn qatori"
print(matn)
```

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — \ dan keyin BO'SH JOY bor edi
jami = 5 + \
       10
print(jami)      # 15

# M5 — qavs ichida avtomatik davom
print("Mahsulot:", "Noutbuk",
      "| Narx:", 8500000,
      "| QQS:", 1020000,
      "| Jami:", 9520000)

# M6 — HA, ishlaydi!
matn = "Bu juda uzun " \
       "matn qatori"
print(matn)      # Bu juda uzun matn qatori
```

**M6 saboqi:** yonma-yon turgan satrlar **avtomatik birlashadi** *(12-modulning 4-darsini eslang: `'Red' 'car'`)*. `\` bu birlashishni **ikki qatorga** yoyish imkonini beradi.

</details>

### 🔴 Qiyin

**M7.** Quyidagi kod nima chiqaradi? **Avval taxmin qiling:**
```python
x = 5 + \
    3 * \
    2
print(x)
```

**M8.** Nima uchun qavslar `\` dan **xavfsizroq**? Ikkala variantda ham `\` dan keyin **bitta bo'sh joy** qo'ying va natijani solishtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
x = 5 + \
    3 * \
    2
print(x)      # 11    ← 5 + (3 * 2) = 5 + 6 = 11
# Amallar tartibi saqlanadi: * oldin bajariladi
```

```python
# M8
# Backslash + bo'sh joy → SyntaxError
# jami = 5 + \ 
#        10

# Qavs + bo'sh joy → BEMALOL ishlaydi
jami = (5 + 
        10)
print(jami)      # 15
```

**Xulosa:** qavslar ichida **ko'rinmas bo'sh joylar muhim emas**. `\` esa **qator oxiridagi eng oxirgi belgi** bo'lishi shart — bu **ko'rinmas xato** manbai.

</details>

---

## 9. 🧠 O'zini tekshirish savollari

1. Qachon qator davomi kerak bo'ladi? Ikki sabab.
2. Qanday belgi ishlatiladi?
3. U nimani bildiradi?
4. `2.0 * 1.5 + \` va yangi qatorda `5` — natija nima?
5. `\` siz `15 + 31` va `- 26` yozsangiz nima bo'ladi va nega?
6. `\` dan keyin nima bo'lishi mumkin?
7. Muqobil usul qanday?

<details>
<summary>✅ Javoblar</summary>

1. (a) **Yacheyka uzunligi yetmasa**; (b) kodni **tartibga solish** uchun.
2. **Teskari chiziq (backslash) `\`.**
3. Siz **xuddi shu buyruqni yangi qatorda davom ettirishingizni**.
4. **`8.0`** — mashina uni **bitta buyruq** deb o'qiydi.
5. **`-26`** — Python buni **ikkita alohida ifoda** deb o'qiydi va **oxirgisini** ko'rsatadi.
6. **Hech narsa** — hatto bo'sh joy ham. `\` **eng oxirgi belgi** bo'lishi shart.
7. **Qavslar** `()`, `[]`, `{}` — ular ichida qator davomi **avtomatik** ishlaydi.

</details>

---

## 📌 Xulosa

```python
# BACKSLASH
2.0 * 1.5 + \
5                    →  8.0

⚠️ \ dan keyin HECH NARSA bo'lmasin — hatto bo'sh joy ham!

# \ SIZ                    # \ BILAN
15 + 31                    15 + 31 \
- 26                       - 26
→ -26  (2 ta ifoda)        → 20  (1 ta ifoda)

# QAVSLAR — TAVSIYA ETILADI
jami = (100 +
        200 +
        300)              →  600

   qavslar ichida \ KERAK EMAS va bo'sh joy xavfli EMAS
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Qator davomi | *line continuation* | Buyruqni keyingi qatorda davom ettirish |
| Teskari chiziq | *backslash* | `\` |
| Ifoda | *expression* | Qiymat hosil qiluvchi kod |
| Yashirin davom | *implicit continuation* | Qavslar ichida avtomatik davom |

---

⬅️ [Oldingi: Izohlar](04-Add-Comments.md) · ➡️ [Keyingi: Indekslash](06-Indexing-Elements.md)
