# 6-dars. Anaconda Assistant bilan ishlash — satrlar misolida

## 🎬 Boshlashdan oldin

Oldingi dars vositani **tanishtirdi**. Bu dars uni **amalda** ko'rsatadi.

> Va ikkala misol ham — siz **4-darsda ko'rgan** xatolar. Endi ularni AI qanday hal qilishini ko'rasiz.

---

## 1. 1-misol: `NameError`

### Xatoni yaratamiz

> **Avval notebook ishga tushirish variantini tanlang. Keyin yangi notebook hujjati ochish uchun kernel tanlang.**
>
> **`George` ni eshitganingizdek bajaring.**

```python
George
```

```
NameError: name 'George' is not defined
```

> **Siz `George` nomi aniqlanmaganini bildiruvchi NAME ERROR xabarini olasiz** — bu **shu nomli o'zgaruvchi hali e'lon qilinmagan** degani.

*(Bu — 4-darsdagi birinchi misolning aynan o'zi.)*

### AI dan so'raymiz

> **O'ng panelda, chat oynasining tepasida assistant sizga YANGI SUHBAT boshlashni taklif qiladi.**
>
> **Davom etish uchun "DEBUG THE ACTIVE CODE CELL" ni bosing.**

**Nima bo'ladi:**

> **Ekran bizning xatomizni tushuntiradi va yechim taklif qilishni xohlaysizmi deb so'raydi.**
>
> **Oynaga `yes` deb yozing. Enter bosing yoki o'ngdagi yashil tugmani bosing.**

### AI ning javobi

> **Biz shunday yechim olamiz — u Anaconda Assistant quyidagilarni tushunganini ko'rsatadi:**
>
> - biz **`George` nomli o'zgaruvchi yaratmoqchi EMAS edik**
> - **`George` — MATN QIYMATI**, shuning uchun u **qo'shtirnoq ichiga** olindi

**Bundan tashqari:**

> ## **Yaxshi amaliyot tavsiya qilganidek, bu satr `name` deb ataladigan o'zgaruvchiga biriktirildi** — u **mazmunini ko'rsatadi**.

```python
name = "George"
```

> 💡 **Diqqat qiling — AI ikki ish qildi:**
> 1. Xatoni **tuzatdi** (qo'shtirnoq qo'ydi)
> 2. Kodni **yaxshiladi** (ma'noli nom bilan o'zgaruvchiga bog'ladi)
>
> Ikkinchisi — 10-modulning 1-darsidagi **"kod uslubi"** ning aynan o'zi.

### Kodni ishlatish

> **Keyin `COPY` ni tanlab, olingan kodni nusxalab, Anaconda notebook'idagi yacheykaga yoki boshqa joyga qo'ya olamiz.**
>
> **Lekin biz ko'proq intuitiv variantni tanlaymiz — "RUN CODE IN NOTEBOOK".**
>
> **Buni qilib, biz `George` satrini o'z ichiga olgan `name` o'zgaruvchisini yaratdik.**

---

## 2. 2-misol: `TypeError`

> **Endi ko'raylik, generativ AI modellari biroz murakkabroq mashqni hal qilishga yordam bera oladimi.**

### Vaziyat

> **Tasavvur qiling, siz lokal yoki onlayn kod yozayotgan edingiz va kod yacheykasida yozayotib, `y` o'zgaruvchisiga 10 qiymatini bermoqchi bo'ldingiz.**
>
> **Va `y` ga murojaat qilib `$10` matnini chop etmoqchi bo'ldingiz. Siz quyidagi kodni yozdingiz.**

```python
y = 10
print(y + " Dollars")
```

```
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

> **Lekin uni ishga tushirganingizda siz TYPE ERROR xabarini olasiz** — agar xatoni o'zingiz payqay olmasangiz, uni qanday hal qilishni bilmaysiz.

*(Bu ham — 4-darsdagi aynan o'sha misol.)*

---

## 3. 🔍 Ikki yondashuv

### Yondashuv 1 — Google

> **Bir yondashuv — OXIRGI QATORNI nusxalab, Google qidiruviga qo'yish.**
>
> **Bu sizni mavzu bo'yicha eng tez-tez eslatib o'tiladigan yechimlarga olib borishi mumkin.**

*(11-modulning 6-darsini eslang — bu **ishda qiladigan narsangiz**.)*

### Yondashuv 2 — AI

> **Lekin agar siz notebook'da xuddi shu xatoni yaratib, "Debug the active code cell" ni bosib yordam so'rasangiz —**
>
> **siz yana ANIQ TUSHUNTIRISH olasiz:**
>
> ## **Python'da TURLI TURDAGI o'zgaruvchilarni — masalan integer va satrni — BIRLASHTIRIB (concatenate) bo'lmaydi.**

**Va:**

> **Bunday holatda siz TAKLIF QILINGAN YECHIM namunasini ham olasiz.**
>
> **Biz tuzatilgan kodni olishni tasdiqlaganimizdan so'ng — unda `string` funksiyasi bor —**
>
> **uni to'g'ridan-to'g'ri notebook'imizda ishga tushira olamiz.**

```python
y = 10
print(str(y) + " Dollars")
```

```
10 Dollars
```

> **Yana bir bor, biz tez orada xatomizning ANIQ TUSHUNTIRISHINI va YECHIMNI oldik.**

---

## 4. ⚠️ Cheklovlar va to'g'ri yondashuv

> **Fikringizni tushundingiz. Dasturlaringiz murakkablashgan sari siz bu Anaconda vositasining ta'sirchan imkoniyatlarini tobora qadrlaysiz.**

### 🔑 Asosiy cheklov

> ## **Trade-off shundaki, assistant sizning so'rovlaringizni HAR DOIM HAM TUSHUNMASLIGI mumkin** —
>
> **shuning uchun siz kodingizning FRAGMENTLARI haqida savol berishingiz kerak.**
>
> ## **Boshqacha aytganda, sizga QADAMMA-QADAM yondashuv kerak bo'ladi.**

> 💡 **Bu juda muhim amaliy maslahat:**
>
> ```
> ❌ "Mening butun dasturim ishlamayapti, tuzatib ber"
> ✅ "Bu 3 qatorda nima uchun TypeError chiqyapti?"
> ```

### Tavsiya

> **Python o'rganishni va mashq qilishni davom ettiring, va assistantdan KERAK BO'LGANDA foydalaning.**

---

## 5. ⚠️ AI javoblari har safar boshqacha

> **Xulosa qilib aytganda, Anaconda Assistant ma'ruzalarida o'rgatilgan tamoyillarni saqlab qolishga harakat qiling.**
>
> ## **Anaconda ning AI vositalari eng yaxshi yechim va takliflarni berish uchun DOIMIY YANGILANADI** —
>
> **shuning uchun xuddi shu buyruqlarni ishga tushirganingizda assistantdan TURLI NATIJALAR olish TABIIY.**

*(06-modulning 1-darsini eslang — **inconsistency**. Bu — o'sha hodisaning aynan o'zi.)*

> **Bu AI vositasini optimallashtirish uchun esa uning javoblari bilan iloji boricha YAQINROQ ishlashingizga ishonch hosil qiling.**

---

## 6. 📊 Ikki misol — jamlangan

| | 1-misol | 2-misol |
|---|---|---|
| **Kod** | `George` | `print(y + " Dollars")` |
| **Xato** | `NameError` | `TypeError` |
| **Sabab** | Qo'shtirnoq yo'q | Turlar aralashgan |
| **AI tushuntirdi** | `George` — matn qiymati | int va str ni birlashtirib bo'lmaydi |
| **AI yechimi** | `name = "George"` | `str(y) + " Dollars"` |
| **Bonus** | Ma'noli **o'zgaruvchi nomi** qo'shdi | — |

---

## 7. 💻 O'zingiz sinang — AI'siz

Avval **o'zingiz** yeching, keyin AI dan so'rang va **solishtiring**:

```python
# XATO 1
George

# XATO 2
y = 10
print(y + " Dollars")

# XATO 3
narx = 5000
soni = 3
print("Jami: " + narx * soni + " so'm")

# XATO 4
ism = "Ali"
print("Salom, " + Ism)

# XATO 5
print('It's a good day')
```

<details>
<summary>✅ Yechimlar</summary>

```python
# 1 · NameError → qo'shtirnoq kerak
name = "George"
print(name)

# 2 · TypeError → str() kerak
y = 10
print(str(y) + " Dollars")
# yoki osonroq:
print(y, "Dollars")

# 3 · TypeError → natija int, str bilan qo'shib bo'lmaydi
narx = 5000
soni = 3
print("Jami: " + str(narx * soni) + " so'm")
# yoki:
print("Jami:", narx * soni, "so'm")

# 4 · NameError → case sensitive! Ism ≠ ism
ism = "Ali"
print("Salom, " + ism)

# 5 · SyntaxError → apostrof satrni erta yopadi
print("It's a good day")
# yoki:
print('It\'s a good day')
```

</details>

---

## 8. ⚡ Amaliy topshiriqlar

### 🟢 Oson — 15 daqiqa · **AI ni sinang**

Yuqoridagi 5 ta xatoni AI ga bering:

| № | Xato | AI to'g'ri tushuntirdimi? | Yechimi siznikiga o'xshadimi? |
|---|---|---|---|
| 1 | | ha / yo'q | ha / yo'q |
| 2 | | ha / yo'q | ha / yo'q |
| 3 | | ha / yo'q | ha / yo'q |
| 4 | | ha / yo'q | ha / yo'q |
| 5 | | ha / yo'q | ha / yo'q |

**Savol:** AI kodni **yaxshiladimi** ham (ma'noli nomlar, izohlar), yoki faqat **tuzatdimi**?

### 🟡 O'rta — 20 daqiqa · **Yomon va yaxshi savol**

Ma'ruza aytadi: **qadamma-qadam yondashuv** kerak.

```
BIR XIL MUAMMO, IKKI XIL SAVOL:

❌ YOMON SAVOL:
   "Mening chek dasturim ishlamayapti, tuzatib ber"
   [butun 30 qatorli kodni tashlaysiz]

   AI javobi sifati (1-5):  ______
   Yechim topildimi?  ha / yo'q

✅ YAXSHI SAVOL:
   "Nima uchun bu qatorda TypeError chiqyapti?
    print('Jami: ' + summa)
    summa = 45000 (int)"

   AI javobi sifati (1-5):  ______
   Yechim topildimi?  ha / yo'q

XULOSA: farq nimada?
   ______________________________________________
```

### 🔴 Qiyin — tanqidiy fikrlash · **AI xato qilsa**

Ma'ruza aytadi: AI **har doim ham tushunmasligi** mumkin va javoblar **har safar boshqacha**.

```
1. TAJRIBA: bir xil savolni AI ga UCH MARTA bering
   (har safar yangi suhbat)

   Savol: "Python'da 100 dollarni chop etuvchi kod yoz"

   1-javob: ______________________________
   2-javob: ______________________________
   3-javob: ______________________________

   Ular BIR XILmi?  ha / yo'q
   Bu 06-moduldagi qaysi tushuncha?  ______________

2. AI XATO QILGAN HOLATNI TOPING:
   AI ga ataylab CHALKASH savol bering.
   Savol: ______________________________________
   AI javobi: __________________________________
   Xato joyi: __________________________________

3. SIZ UNI QANDAY PAYQADINGIZ?
   ______________________________________________

4. XULOSA: AI javobini tekshirish uchun sizga NIMA kerak?
   ______________________________________________
   (Ilgak: 06-modulning 1-darsidagi "oltin qoida")
```

---

## 9. 🧠 O'zini tekshirish savollari

1. Birinchi misolda qanday xato yuz berdi?
2. AI dan yordam so'rash uchun nima bosiladi?
3. AI `George` haqida nimani tushundi?
4. AI qanday "yaxshi amaliyot" ni qo'lladi?
5. Kodni ishlatishning ikki yo'li qanday?
6. Ikkinchi misolda qanday xato bo'ldi?
7. Xatoni hal qilishning ikki yondashuvi qanday?
8. AI TypeError ni qanday tushuntirdi?
9. Assistant ning asosiy cheklovi nima?
10. Qanday yondashuv kerak?
11. Nima uchun bir xil buyruqda turli natijalar olinadi?

<details>
<summary>✅ Javoblar</summary>

1. **`NameError`** — `George` nomi aniqlanmagan.
2. **"Debug the active code cell"**, keyin `yes` deb tasdiqlash.
3. Biz `George` nomli **o'zgaruvchi yaratmoqchi emas** edik — `George` **matn qiymati**, shuning uchun **qo'shtirnoq** ichiga olindi.
4. Satrni **mazmunini ko'rsatadigan** `name` o'zgaruvchisiga **biriktirdi**.
5. (a) **Copy** — nusxalab qo'yish; (b) **Run code in notebook** — to'g'ridan-to'g'ri ishga tushirish.
6. **`TypeError`** — `y` (int) va `" Dollars"` (str) ni qo'shishga urinish.
7. (a) **Oxirgi qatorni Google'ga** qo'yish; (b) **AI dan "Debug the active code cell"** orqali so'rash.
8. Python'da **turli turdagi o'zgaruvchilarni birlashtirib (concatenate) bo'lmaydi** — masalan integer va satrni.
9. Assistant so'rovlarni **har doim ham tushunmasligi** mumkin.
10. **Qadamma-qadam** — kodning **fragmentlari** haqida savol berish.
11. AI vositalari **doimiy yangilanadi** — turli natijalar olish **tabiiy**.

</details>

---

## 📌 Xulosa

```
1-MISOL: George          →  NameError
   AI:  "bu MATN qiymati"  →  name = "George"
                              + ma'noli o'zgaruvchi nomi (bonus)

2-MISOL: y + " Dollars"  →  TypeError
   AI:  "turli turlarni birlashtirib bo'lmaydi"
                           →  str(y) + " Dollars"

IKKI YO'L:
   Google  ←  oxirgi qatorni qo'ying
   AI      ←  "Debug the active code cell"

⚠️ CHEKLOVLAR:
   • so'rovni har doim ham tushunmaydi  →  QADAMMA-QADAM so'rang
   • javoblar har safar boshqacha        →  bu TABIIY (inconsistency)

❌ "hammasi ishlamayapti, tuzat"
✅ "bu 3 qatorda nega TypeError?"
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Debug | *debug* | Xatoni topib tuzatish |
| Birlashtirish | *concatenate* | Satrlarni qo'shish |
| Fragment | *fragment* | Kodning bir bo'lagi |
| Qadamma-qadam | *step-by-step* | Bosqichli yondashuv |
| Yaxshi amaliyot | *good practice* | Tavsiya etilgan kodlash uslubi |

---

⬅️ [Oldingi: Anaconda AI kirish](05-Anaconda-AI-Introduction.md) · 🏠 [Modul boshiga](README.md)

🚀 **Endi amaliyot:** [Mini-loyihalar](LOYIHALAR.md)
