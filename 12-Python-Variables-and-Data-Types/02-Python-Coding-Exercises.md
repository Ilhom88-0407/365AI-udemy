# 2-dars. Kodlash mashqlari haqida

## 🎬 Boshlashdan oldin

> **"Bu kursda siz dasturlash va analitik ko'nikmalaringizni mustahkamlash uchun KO'PLAB kodlash mashqiga duch kelasiz."**

Bu dars — mashqlarni **qanday yechish** va **qayerda ishlash** haqida.

---

## 1. Uchta asosiy qoida

### Qoida 1 — tartibga rioya qiling

> **Kodlash mashqlarini yechish uchun sizga FAQAT video ma'ruzalar va maqolalarda tushuntirilgan texnika va kod kerak bo'ladi.**
>
> ## **Shuning uchun kurs elementlarining TARTIBIGA doim rioya qilishni maslahat beramiz.**

### Qoida 2 — kerakli videoga qayting

> **Agar siz faqat ma'lum bir bo'limdagi kodlash mashqlarini bajarmoqchi bo'lsangiz, aniqlik olish uchun oldindan berilgan tegishli videolarga murojaat qiling.**

### Qoida 3 — kod fayllari bilan solishtiring

> **Keyin, eng muhimi: agar qo'shimcha yordam kerak bo'lsa, ishingizni o'sha kodlash mashqlariga mos ma'ruzalar resurslar bo'limida berilgan KOD FAYLLARI bilan solishtiring.**

> 💡 **Bizning darslikda** bu fayllar allaqachon **o'zbekchaga tarjima qilingan** va har bir darsning **"Rasmiy mashqlar"** bo'limida joylashgan.

---

## 2. 📖 Amaliy misol (ma'ruzadan)

### Vazifa

> **`Click "OK"` ga teng natija chiqaring.**

### 1-urinish — sintaksis xatosi

```python
Click correct
```

> **Faqat `correct` satr sifatida yozilgan.**
>
> **Agar "Run Code" ni bossangiz, siz Python sintaksisiga rioya qilmaganingizni bildiruvchi xato xabarini olasiz.**

### 2-urinish — kod ishlaydi, lekin javob noto'g'ri

```python
'Click correct'
```

> **Agar ifodani bitta qo'shtirnoq ichiga olsangiz va kodni ishga tushirsangiz — "Run completed" degan bayonot olasiz.**
>
> **Bu siz TO'G'RI Python kodini bergan degani.**

**Lekin vazifa yechildimi?**

> **Buni tekshirish uchun "RUN TESTS" ni bosishingiz kerak.**
>
> **Natijalar "failed" deydi va xato tafsilotlarining pastida siz NOTO'G'RI SATR kiritilganini ko'rasiz.**

### 3-urinish — case sensitivity

> **Birinchidan, hech qachon unutmang: Python — CASE SENSITIVE til.**
>
> **Shuning uchun `click` ning birinchi harfini katta qilaylik va `correct` ni `OK` ga o'zgartiraylik.**

```python
'Click "OK"'
```

> **Kod satrini bajarish uning Python sintaksisiga rioya qilishini ko'rsatadi.**
>
> **Lekin testlarni ishga tushirganda — biz yana muvaffaqiyatsizlikka uchradik. Nima uchun?**

### 4-urinish — ✅ to'g'ri

> **Vazifa matnida ko'rsatilganidek `Click "OK"` ni olish uchun siz bu satrni PRINT FUNKSIYASINING ARGUMENTI sifatida berishingiz kerak.**
>
> **Bu sizning natijangizni QO'SHTIRNOQLARDAN xalos qiladi.**

```python
print('Click "OK"')
```

```
Click "OK"
```

> **Bu kod bo'lagi berilgan vazifani hal qiladimi? HA.**
>
> **Natijada siz "SUCCESS" olasiz.**

---

## 3. ⚠️ Muhim eslatma

> **Yon eslatma sifatida: ba'zan BIR NECHTA YECHIM bo'lishi mumkin.**
>
> ## **Lekin doim mashqni KO'RSATILGANIDEK yeching.**
>
> **Chunki biz nafaqat to'g'ri Python kodini tekshiramiz, balki siz belgilangan qadamlarga DIQQAT BILAN rioya qilayotganingizni ham tekshiramiz.**
>
> **Xuddi real biznes va analitik muhitda kutilganidek.**

---

## 4. 🌐 Brauzerda yoki lokal — qaysi biri?

> **Albatta, ikkalasi bir-birini almashtira oladi:**
> - **ulanish muammolari bo'lsa — LOKAL kod yozing**
> - **dasturiy ta'minot o'rnatilishi ishlamasa — ONLAYN kod yozing**
>
> ## **Ideal holda IKKALASINI ham qilishingiz kerak** — chunki qancha ko'p mashq qilsangiz, ish muhitidagi qiyinchiliklarga duch kelganda shuncha bilimli bo'lasiz.

### Brauzerda kodlash — afzalliklari

| Afzallik |
|---|
| Mashqlar materialni **tez o'rganishga** yordam berish uchun tuzilgan |
| **Ortiqcha kod satrlarisiz** aniq javob bera olishingizni tekshiradi |
| Bu omillar mashqlarni **qiyinroq** qiladi |
| Muhit **Spyder yoki PyCharm** ga o'xshaydi, Jupyter'ga emas |
| `print` funksiyasi natijasi **boshqacha ko'rinishi** mumkin — bu **professional kontekstga** o'rganishga yordam beradi |

### Lokal (Jupyter) — afzalliklari

| Afzallik |
|---|
| Python imkoniyatlarini **o'rganish** — vazifalarga **boshqa yechimlar** sinash |
| Kod strukturasini **boshqa datasetga** qo'llash osonroq |
| Oldingi ma'ruzalar kodini **qayta ko'rib chiqish** osonroq |
| **Yangi buyruqlarni** o'rganish |
| Bir necha mashq yechimini **bitta faylga** birlashtirish |

### ⚠️ Muhim ogohlantirish

> **Faqat bitta muhim ogohlantirishni hisobga olish kerak:**
>
> ## **NATIJA OLISH — analitik savolga TO'G'RI javob berganingizni ANGLATMAYDI.**

> **Shunga qaramay, bu eslatmalarni hisobga olsak, Jupyter sizga chinakam MUSTAQIL Python foydalanuvchisi bo'lish uchun poydevor qo'yishi mumkin.**

---

## 5. 📋 Mashq yechilmasa — 4 qadam

> **Xulosa qilib aytganda, agar kodlash mashqini birinchi urinishda yecha olmasangiz:**

| № | Qadam |
|---|---|
| **1** | **Ko'rsatmalarni QAYTA o'qing** — biz odatda to'g'ri natija va talab qilingan qadamlarga rioyani qidiramiz |
| **2** | **Manba videolarni qayta ko'ring** — yangi materialni o'rganishning ehtimol eng yaxshi yo'li |
| **3** | Oxirgi tabda berilgan **yechim tushuntirishini** tekshiring |
| **4** | Yordam bermasa — **Q&A bo'limiga** yozing |

---

## 6. 🎯 Yakuniy fikr

> **Xulosa qilib aytganda, brauzerda kod yozganda biz sizdan nafaqat tilning sintaksisiga mos keladigan kod berishni so'raymiz, balki ANIQ VAZIFAGA javob ham qidiramiz.**
>
> ## **Sarflangan mehnat arziydi.**
>
> **Kodlash mashqlari sizning vazifalarni tushunish va analitik natijalarni talqin qilish qobiliyatingizni MUSTAHKAMLAYDI.**
>
> **Ma'ruza havolalari, ilgaklar va takliflardan foydalaning va sayohatdan zavqlaning. Omad!**

---

## 7. 💡 Bizning darslikda mashqlar qanday tashkil qilingan

Har bir darsda **uch qatlam** mashq bor:

| Qatlam | Nima |
|---|---|
| **📝 Rasmiy mashqlar** | Kursning `_Exercises.ipynb` faylidan, **o'zbekchaga tarjima qilingan** + rasmiy yechimlar |
| **⚡ Qo'shimcha mashqlar** | 🟢 oson · 🟡 o'rta · 🔴 qiyin — **yechimlari bilan** |
| **🚀 Mini-loyihalar** | Modul oxirida — **to'liq ishlaydigan** kichik dasturlar |

Har bir modulda alohida ikkita fayl ham bor:

| Fayl | Nima |
|---|---|
| **`MASHQLAR.md`** | Barcha mashqlar bitta joyda |
| **`LOYIHALAR.md`** | Mini-loyihalar to'plami |

---

## 8. ⚡ Amaliy topshiriqlar

### 🟢 Oson — 10 daqiqa · **4 urinishni takrorlang**

Ma'ruzadagi misolni **o'zingiz** bosqichma-bosqich takrorlang:

```python
# 1-urinish — sintaksis xatosi
Click correct

# 2-urinish — kod ishlaydi, javob noto'g'ri
'Click correct'

# 3-urinish — case tuzatildi, lekin qo'shtirnoq qoldi
'Click "OK"'

# 4-urinish — ✅
print('Click "OK"')
```

**Har biri uchun yozing:**

| Urinish | Xato turi | Nima yetishmadi |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | ✅ | — |

<details>
<summary>✅ Javoblar</summary>

| Urinish | Xato | Yetishmadi |
|---|---|---|
| 1 | `SyntaxError` | Qo'shtirnoqlar |
| 2 | Kod to'g'ri, **test yiqildi** | Noto'g'ri matn (`correct` ≠ `OK`) |
| 3 | Kod to'g'ri, **test yiqildi** | `print` — natijada qo'shtirnoqlar qoldi |
| 4 | — | ✅ |

</details>

### 🟡 O'rta — 15 daqiqa · **"Ishladi" ≠ "to'g'ri"**

Ma'ruza aytadi: *"natija olish analitik savolga to'g'ri javob berganingizni anglatmaydi"*.

```
VAZIFA: "5 va 3 sonlarining YIG'INDISINI chop eting"

Quyidagi kodlarning har biri ISHLAYDI. Qaysi biri TO'G'RI?

a)  print(5 + 3)          →  ______   To'g'rimi? ha/yo'q
b)  print(8)              →  ______   To'g'rimi? ha/yo'q
c)  print("5 + 3")        →  ______   To'g'rimi? ha/yo'q
d)  print(5, 3)           →  ______   To'g'rimi? ha/yo'q

XULOSA: nima uchun (b) "ishlaydi" lekin YOMON yechim?
   ______________________________________________
```

<details>
<summary>✅ Javoblar</summary>

| Kod | Natija | To'g'rimi |
|---|---|---|
| a | `8` | ✅ **Ha** |
| b | `8` | ⚠️ Natija to'g'ri, **yechim yo'q** |
| c | `5 + 3` | ❌ Bu — matn, hisob emas |
| d | `5 3` | ❌ Yig'indi emas |

**(b) nima uchun yomon:** siz javobni **o'zingiz hisoblab**, kompyuterga **yozib berdingiz**. Sonlar o'zgarsa — kod **ishlamay qoladi**. Dastur **hisoblashi** kerak, natijani **eslab qolishi** emas.

</details>

### 🔴 Qiyin — tartib · **O'z mashq tizimingizni tuzing**

```
1 · QAYERDA ISHLAYMAN?
   [ ] Faqat brauzerda    [ ] Faqat Jupyter    [ ] Ikkalasida
   Sabab: _______________________________________

2 · MASHQ YECHILMASA — MENING 4 QADAMIM:
   1. ____________________________________
   2. ____________________________________
   3. ____________________________________
   4. ____________________________________

3 · VAQT LIMITI
   Bitta mashqqa maksimal necha daqiqa?  ______
   Undan keyin nima qilaman?  ____________________

4 · YECHIMNI KO'RGANDAN KEYIN (majburiy qadam!)
   ____________________________________________
   (Ilgak: shunchaki o'qish yetarli emas)

5 · TAKRORLASH
   Yechgan mashqlarimni qachon qayta ko'raman?  ______
```

> 💡 **4-savol javobi:** yechimni ko'rgandan keyin **yopib qo'ying** va **noldan o'zingiz yozing**. Aks holda siz **o'qidingiz**, lekin **o'rganmadingiz**.

---

## 9. 🧠 O'zini tekshirish savollari

1. Mashqlarni yechish uchun nima kerak bo'ladi?
2. Nima uchun kurs tartibiga rioya qilish kerak?
3. Qo'shimcha yordam qayerdan olinadi?
4. Ma'ruzadagi misolda qanday 4 ta urinish bo'ldi?
5. "Run Code" va "Run Tests" farqi nima?
6. Nima uchun `'Click "OK"'` yetarli emas edi?
7. Bir necha yechim bo'lsa nima qilish kerak?
8. Brauzerda kodlashning afzalliklari nima?
9. Lokal ishlashning afzalliklari nima?
10. Qanday muhim ogohlantirish bor?
11. Mashq yechilmasa — 4 qadam qanday?

<details>
<summary>✅ Javoblar</summary>

1. Faqat **video ma'ruzalar va maqolalarda tushuntirilgan** texnika va kod.
2. Chunki mashqlar **oldin tushuntirilgan** materialga tayanadi.
3. Ma'ruzalarning **resurslar bo'limidagi kod fayllaridan**.
4. (1) qo'shtirnoqsiz — **SyntaxError**; (2) `'Click correct'` — noto'g'ri matn; (3) `'Click "OK"'` — `print` yo'q; (4) `print('Click "OK"')` — ✅.
5. **Run Code** — kod **Python sintaksisiga mos** ekanini tekshiradi. **Run Tests** — **vazifa to'g'ri yechilganini** tekshiradi.
6. Chunki `print` funksiyasi ishlatilmagan — natijada **qo'shtirnoqlar** qolgan.
7. Mashqni **ko'rsatilganidek** yechish — chunki **belgilangan qadamlarga rioya** ham tekshiriladi.
8. Materialni **tez o'rganish**, **ortiqcha kodsiz** aniq javob, muhit **Spyder/PyCharm** ga o'xshaydi.
9. **Boshqa yechimlarni sinash**, **boshqa datasetga qo'llash**, **oldingi kodni ko'rish**, **yangi buyruqlar**, **yechimlarni birlashtirish**.
10. **Natija olish — analitik savolga to'g'ri javob berganingizni anglatmaydi.**
11. (1) ko'rsatmalarni **qayta o'qing**; (2) **videolarni qayta ko'ring**; (3) **yechim tushuntirishini** tekshiring; (4) **Q&A ga** yozing.

</details>

---

## 📌 Xulosa

```
MASHQ YECHISH TARTIBI

  1. Kurs TARTIBIGA rioya qiling
  2. Kerak bo'lsa — videoga qayting
  3. Kod fayllari bilan solishtiring

  Run Code  →  sintaksis to'g'rimi?
  Run Tests →  VAZIFA yechildimi?

  ⚠️ "Ishladi" ≠ "TO'G'RI"

BRAUZER              LOKAL (Jupyter)
tez o'rganish        erkin tajriba
qiyinroq             boshqa yechimlar
Spyder/PyCharm ga    mustaqillik poydevori
o'xshaydi

  → IDEAL: IKKALASI ham
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Kodlash mashqi | *coding exercise* | Amaliy topshiriq |
| Run Code | *run code* | Kodni bajarish |
| Run Tests | *run tests* | Yechimni tekshirish |
| Argument | *argument* | Funksiyaga beriladigan qiymat |
| Lokal muhit | *local environment* | O'z kompyuteringizdagi muhit |

---

⬅️ [Oldingi: Python o'zgaruvchilari](01-Python-Variables.md) · ➡️ [Keyingi: Sonlar va Boolean qiymatlar](03-Numbers-and-Boolean-Values.md)
