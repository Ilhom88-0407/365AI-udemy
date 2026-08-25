# 2-dars. Anaconda o'rnatish

## 🎬 Boshlashdan oldin

Bu — kursning **birinchi amaliy** darsi. Uni **o'qib** emas, **bajarib** chiqing.

> Oxirida kompyuteringizda **Python**, **Jupyter** va **o'nlab kutubxona** bo'ladi. Barchasi bepul.

---

## 1. Nima uchun Anaconda

> **Kompyuteringizga Python o'rnatishning turli yo'llari bor.**
>
> ## **Yangi Python foydalanuvchilari uchun ANACONDA o'rnatish QAT'IY TAVSIYA ETILADI.**

### Anaconda nima o'rnatadi

| Nima |
|---|
| **Python** |
| **Jupyter Notebook** ilovasi |
| **Ilmiy hisoblash va data science uchun ko'plab paket** |

---

## 2. ⚠️ Muhim eslatma

> **Esda tuting: Anaconda har qanday boshqa onlayn xizmat kabi o'z mahsulotlari va saytini DOIMIY YANGILAB turadi.**
>
> **Shuning uchun funksionallik katta ehtimol bilan BIR XIL qoladi — hatto ularning interfeysi yoki tashkiloti siz saytga kirganingizda biroz boshqacha ko'rinsa ham.**

> **Har holda, doim BEPUL yuklab olinadigan INDIVIDUAL EDITION ni qidiring.**

---

## 3. 📥 Bosqichma-bosqich o'rnatish

### 1-qadam · Saytga kirish

```
anaconda.com  →  bosh sahifaning yuqorisidagi "Free Download" tugmasi
```

### 2-qadam · Ro'yxatdan o'tishni o'tkazib yuborish

> **Keyin sizdan Anaconda ga elektron pochtangizni yuborish so'raladi, lekin siz "SKIP REGISTRATION" ni ham tanlashingiz mumkin.**
>
> **Biz ikkinchisini tanlaymiz** — bu sizni **"Download"** tugmasini bosish orqali o'rnatuvchi yuklab olish sahifasiga yo'naltiradi.

### 3-qadam · Versiyani tanlash

> **Anaconda operatsion tizimingizga eng mos versiyani taklif qiladi.**
>
> **Muqobil ravishda, pastga aylantirib, uchta tizimdan biri uchun versiyani QO'LDA tanlashingiz mumkin: Windows, Mac yoki Linux.**

> **Bundan tashqari, har bir operatsion tizim uchun Python versiyasi ko'rsatilgan.**
>
> ⚠️ **Agar bu eng so'nggi versiya bo'lmasa — ENG YANGISINI tanlang.**

**Windows uchun:**

```
"64-bit Graphical Installer" ni bosing
```

### 4-qadam · Yuklab olish va ishga tushirish

> **Keyin distributivni o'rnatish uchun katalog topishingiz va "Save" ni bosishingiz kerak.**
>
> **Yuklab olish tugagach, ilovani ishga tushiring.**

### 5-qadam · O'rnatuvchi ko'rsatmalari

> **Keyin standart Windows o'rnatuvchisi bergan ko'rsatmalarga amal qiling:**

| Qadam | Nima qilinadi |
|---|---|
| 1 | **Next** — rozilik uchun |
| 2 | **Standart** yoki **maxsus** manzil papkasini tanlash |
| 3 | Maxsus tanlash uchun — **Browse** tugmasi |
| 4 | Katalog ma'qul bo'lsa — yana **Next** |
| 5 | O'rnatuvchi tavsiyalariga amal qilish |

**Ma'ruzachining tanlovi:**

> *"Masalan, men yorliqlar (shortcuts) yaratilishini xohlayman va faqat TAVSIYA ETILGAN variantlarni tanlayman, ikkinchisini o'tkazib yuboraman."*

### 6-qadam · O'rnatish

```
"Install" ni bosing  →  operatsiya tugaganini tasdiqlashini kuting
```

> **Hammasi shu.**
>
> ## **Siz hozirgina to'liq Anaconda distributivini o'rnatdingiz** — u **Python**, **matn muharriri** va **ko'plab ilova hamda paketlarni** o'z ichiga oladi.

### 7-qadam · Yakunlash

```
"Next" → faqat "Launch Anaconda Navigator" ni tanlang → "Finish"
```

---

## 4. 🚀 Jupyter ni ishga tushirish

### Anaconda Navigator orqali

> **Anaconda Navigator ochiladi** — bu **o'rnatilgan Anaconda imkoniyatlarini boshqarish interfeysi**.
>
> **Bizni JUPYTER NOTEBOOK qiziqtiradi**, shuning uchun uni ishga tushirish uchun ikonkasi ostidagi tugmani bosing.

### Nima bo'ladi

> **Bu brauzeringizda YANGI TAB ochadi** — u yerda **Jupyter Dashboard** bo'ladi, standart holatda **foydalanuvchi papkangizni** ko'rsatadi.

### Muqobil yo'l

> **Jupyter ni ishga tushirishning MUQOBIL yo'li ham borligini yodda tuting:**
>
> **Windows Start menyusini oching va tegishli ikonkani tanlang.**
>
> **Yangi oyna paydo bo'ladi va ilova bir necha soniyada yuklanadi.**
>
> **Tugagach, veb-brauzeringiz yana o'sha Jupyter dashboard bo'lgan yangi tab ochadi.**

---

## 5. ✅ O'rnatishni tekshirish

Jupyter ochilgach, yangi notebook yarating va shu kodni ishga tushiring:

```python
import sys
print("Python versiyasi:", sys.version.split()[0])

# Anaconda bilan kelgan asosiy kutubxonalar
kutubxonalar = ["numpy", "pandas", "matplotlib"]
for nom in kutubxonalar:
    try:
        modul = __import__(nom)
        versiya = getattr(modul, "__version__", "noma'lum")
        print(f"  {nom:<12} OK   v{versiya}")
    except ImportError:
        print(f"  {nom:<12} YO'Q")

print("\nAgar hammasi OK bo'lsa - muhit tayyor!")
```

**Kutilayotgan natija (versiyalar farq qilishi mumkin):**

```
Python versiyasi: 3.12.x
  numpy        OK   v1.26.x
  pandas       OK   v2.x.x
  matplotlib   OK   v3.8.x

Agar hammasi OK bo'lsa - muhit tayyor!
```

> ✅ Uchtasi ham `OK` bo'lsa — **10-modulning 2-darsida aytilgan uchta asosiy kutubxona** allaqachon sizda bor.

---

## 6. 🔧 Keng tarqalgan muammolar

Bu ma'ruzada yo'q, lekin boshlovchilarga tez-tez kerak bo'ladi:

| Muammo | Yechim |
|---|---|
| **Anaconda Navigator ochilmayapti** | Kompyuterni qayta ishga tushiring; antivirus bloklamayotganini tekshiring |
| **Jupyter brauzerda ochilmadi** | Terminal/Anaconda Prompt'da `jupyter notebook` yozing |
| **Brauzer noto'g'ri ochildi** | Terminaldagi `http://localhost:8888/...` havolasini nusxalab, kerakli brauzerga qo'ying |
| **`conda` buyrug'i topilmadi** | Anaconda Prompt'dan foydalaning (oddiy CMD emas) |
| **Joy yetmadi** | Anaconda ~5 GB egallaydi. Muqobil: **Miniconda** (kichikroq) |
| **O'rnatish juda sekin** | Bu normal — paketlar ko'p. 10–20 daqiqa ketishi mumkin |

> 💡 **Umuman o'rnatishni xohlamasangiz:** **Google Colab** (`colab.research.google.com`) brauzerda ishlaydi, o'rnatish shart emas va bepul. Kursning boshlang'ich darslari uchun yetadi.

---

## 7. ⚡ Amaliy topshiriqlar

### 🟢 Majburiy — 30 daqiqa · **O'rnating**

```
☐ 1. anaconda.com ga kirdim
☐ 2. Skip registration ni tanladim
☐ 3. Operatsion tizimimga mos versiyani yuklab oldim
      Mening OS: ______________  Versiya: ______________
☐ 4. O'rnatuvchini ishga tushirdim
☐ 5. Tavsiya etilgan variantlarni tanladim
☐ 6. O'rnatish tugadi
☐ 7. Anaconda Navigator ochildi
☐ 8. Jupyter Notebook ni ishga tushirdim
☐ 9. Brauzerda dashboard ochildi
☐ 10. Yangi notebook yaratdim
☐ 11. Tekshiruv kodini ishga tushirdim

Python versiyam: ______________
Muammo bo'ldimi? ______________________________
Qanday hal qildim: ____________________________
```

### 🟡 O'rta — 10 daqiqa · **Ikkinchi yo'lni sinang**

Ma'ruza Jupyter ni ishga tushirishning **ikki yo'lini** aytadi:

```
1-YO'L: Anaconda Navigator → Jupyter Notebook tugmasi
   Necha soniya ketdi?  ______

2-YO'L: Start menyusi → Jupyter Notebook ikonkasi
   Necha soniya ketdi?  ______

3-YO'L (bonus): Anaconda Prompt → jupyter notebook
   Ishladimi?  ha / yo'q

Qaysi biri sizga qulayroq?  ______
```

### 🔴 Qiyin — tayyorgarlik · **Ish maydonini tashkil qiling**

```
1. Kurs uchun alohida papka yarating:
   Manzil: ______________________________________

2. Ichida quyidagi papkalarni yarating:
   ☐ 12-ozgaruvchilar/
   ☐ 13-sintaksis/
   ☐ 14-operatorlar/
   ☐ 15-shartlar/
   ☐ 16-funksiyalar/
   ☐ 17-ketma-ketliklar/
   ☐ 18-iteratsiya/
   ☐ mashqlar/

3. Jupyter dashboard'da shu papkaga o'ting.
   Qanday o'tdingiz? ____________________________

4. Har bir modul uchun alohida notebook yarating.

5. SAVOL: nima uchun ish tartibi muhim?
   (10-modulning 1-darsidagi "kod uslubi" ni eslang)
   ______________________________________________
```

---

## 8. 🧠 O'zini tekshirish savollari

1. Yangi Python foydalanuvchilari uchun nima tavsiya etiladi?
2. Anaconda nimalarni o'rnatadi?
3. Sayt o'zgargan bo'lsa nima qilish kerak? Nimani qidirish kerak?
4. Windows uchun qaysi o'rnatuvchi tanlanadi?
5. Ro'yxatdan o'tish majburiymi?
6. O'rnatish tugagach nimani tanlash kerak?
7. Anaconda Navigator nima?
8. Jupyter ni ishga tushirishning ikkita yo'li qanday?
9. Jupyter ishga tushganda nima ochiladi?

<details>
<summary>✅ Javoblar</summary>

1. **Anaconda o'rnatish** — qat'iy tavsiya etiladi.
2. **Python**, **Jupyter Notebook ilovasi** va **ilmiy hisoblash hamda data science uchun ko'plab paket**.
3. Funksionallik **bir xil qoladi**, faqat interfeys boshqacha bo'lishi mumkin. **Bepul yuklab olinadigan Individual Edition** ni qidirish kerak.
4. **64-bit Graphical Installer.**
5. **Yo'q** — **"Skip registration"** ni tanlash mumkin.
6. Faqat **"Launch Anaconda Navigator"** ni tanlab, **Finish** bosish.
7. **O'rnatilgan Anaconda imkoniyatlarini boshqarish interfeysi.**
8. (a) **Anaconda Navigator** → Jupyter Notebook tugmasi; (b) **Windows Start menyusi** → tegishli ikonka.
9. Brauzerda **yangi tab** — **Jupyter Dashboard**, standart holatda **foydalanuvchi papkangiz**.

</details>

---

## 📌 Xulosa

```
anaconda.com  →  Free Download  →  Skip registration
                      ↓
        OS ga mos versiya (Windows: 64-bit Graphical Installer)
                      ↓
        O'rnatuvchi: Next → papka → tavsiyalar → Install
                      ↓
        Launch Anaconda Navigator → Finish
                      ↓
     ANACONDA NAVIGATOR  →  Jupyter Notebook tugmasi
                      ↓
        Brauzerda: JUPYTER DASHBOARD

Muqobil: Start menyusi → Jupyter Notebook ikonkasi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Anaconda | *Anaconda* | Python + Jupyter + paketlar distributivi |
| Distributiv | *distribution* | Dasturlar to'plami |
| Individual Edition | *Individual Edition* | Bepul shaxsiy versiya |
| Graphical Installer | *graphical installer* | Oyna orqali o'rnatuvchi |
| Anaconda Navigator | *Anaconda Navigator* | Boshqaruv interfeysi |
| Dashboard | *dashboard* | Jupyter ning bosh sahifasi |
| Paket | *package* | Tayyor kutubxona |
| Miniconda | *Miniconda* | Anaconda ning yengil versiyasi |

---

⬅️ [Oldingi: Jupyter bilan tanishuv](01-Jupyter-Introduction.md) · ➡️ [Keyingi: Jupyter'dan foydalanish](03-Introduction-to-Using-Jupyter.md)
