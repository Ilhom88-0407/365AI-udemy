# 3-dars. Jupyter'dan foydalanishga kirish

## 🎬 Boshlashdan oldin

Jupyter ochildi. Ekranda papkalar ro'yxati.

> Bu — **Dashboard**. Undan **hamma narsa boshlanadi**. Bu dars uni to'liq o'rgatadi.

---

## ⚠️ Eslatma

> **Jupyter ham har qanday mashhur ilova kabi vaqti-vaqti bilan yangilanadi.**
>
> **Shuning uchun ba'zi kichik vizual yoki funksional o'zgarishlardan tashqari, biz ishlatayotgan versiya bu vositadan foydalanish uchun ANIQ va TO'G'RI qo'llanma bo'lib xizmat qilishi kerak.**

---

## 1. Dashboard nima ko'rsatadi

> **Jupyter Notebook ni yuklaganingiz bilanoq uning DASHBOARD i ochiladi.**
>
> **Bu yerda siz ishlayotgan papkaga YO'L (path) ni ko'rasiz.** Masalan, biz hozir **Documents** damiz.

### Ikonkalar

> **Tegishli ikonkalar bizda faqat PAPKALAR va FAYLLAR — aniqrog'i NOTEBOOK HUJJATLARI borligini ko'rsatadi.**

### Katalog mantiqi

> ## **Katalog boshqaruvi mantiqi operatsion tizimnikiga o'xshash:**
> **fayllar papkalarga guruhlanishi mumkin, papkalar boshqa papkalarni o'z ichiga olishi mumkin.**

---

## 2. 📁 Papkalar bilan ishlash

### Kirish va chiqish

| Amal | Qanday |
|---|---|
| **Papkaga kirish** | Papka nomiga bosing |
| **Orqaga qaytish** | Yuqoridagi **papka nomiga** bosing (masalan `Documents`) |

### Belgilash va boshqarish

> **Har bir element yonida CHECKBOX bor.**
>
> **Elementni belgilash orqali siz uni ma'lum tarzda boshqara olasiz.**

**Masalan, papkani belgilasangiz:**

| Tugma | Nima qiladi |
|---|---|
| **Rename** | Nomini o'zgartirish |
| **Delete** | O'chirish |

**Ma'ruzadagi amaliyot:**

> **Papka bo'sh ekanini tasdiqladik va undan foydalanish rejamiz yo'q, shuning uchun uni o'chiramiz.**
>
> **Buning uchun papka ikonkasining CHAP tomoniga bosganingizga ishonch hosil qiling, keyin yuqoridagi DELETE tugmasini bosing. Tasdiqlang.**

**Nomini o'zgartirish:**

> **Chap tomonidagi katakchani belgilang → RENAME tugmasini bosing → kerakli nomni bering.**

---

## 3. 📄 Fayllar bilan ishlash

> **Fayllardan foydalanganda siz ularni nomi chap tomonidagi katakchani belgilash orqali quyidagilarni qila olasiz:**

| | | |
|---|---|---|
| **Open** (ochish) | **Download** (yuklab olish) | **Rename** (nom o'zgartirish) |
| **Duplicate** (nusxalash) | **Delete** (o'chirish) | |

---

## 4. 🟢 Ishlab turgan fayllar

> **Diqqat: Jupyter ko'rsatilgan ro'yxatdagi qaysi hujjatlar HOZIR ISHLAB TURGANINI bildiradi.**

### Ikkita belgi

| Qayerda | Belgi |
|---|---|
| **RUNNING tabi** | Siz boshlagan va hali faol bo'lgan **barcha fayl va jarayonlar** |
| **FILES tabi** | Notebook ikonkasi va checkbox orasida **kichik YASHIL NUQTA** paydo bo'ladi |

> **Bizning holatimizda bu ikkita `Untitled` notebook hujjati ishlab turibdi.**
>
> **Siz ularga boshqa ikkita brauzer tabidan kirishingiz va ishlashingiz mumkin.**

---

## 5. 🔧 Boshqa imkoniyatlar

### Hammasini tanlash

> **SELECTION menyusi barcha fayllarni birgalikda tanlash imkonini beradi.**
>
> **Bu barcha elementlarga BIR XIL manipulyatsiyani qo'llamoqchi bo'lsangiz foydali.**
>
> **Taklif qilingan manipulyatsiyalarni tanlangan hududga O'NG TUGMA bosish orqali topish mumkin.**
>
> **Oldingi holatga qaytish uchun yuqoridagi katakchani olib tashlang.**

### Fayl yuklash

> **Yuqori o'ng burchakdagi UPLOAD tugmasidan siz katalogingizga notebook yuklashingiz mumkin.**
>
> **Faylni tanlaganingizda standart explorer oynasi ochiladi.**
>
> **"Open" ni bosasiz va u darrov katalogingizda paydo bo'ladi.**

> 💡 **Bu juda foydali!** Kursning **mashq notebook'larini** (`.ipynb` fayllar) aynan shu tarzda yuklaysiz.

---

## 6. ✨ Yangi element yaratish

> **Nihoyat, siz NEW tugmasini kengaytirishingiz mumkin.**
>
> **Ochiladigan ro'yxatdan siz katta ehtimol bilan YANGI PAPKA yoki YANGI NOTEBOOK fayli yaratishingiz kerak bo'ladi.**

### Notebook yaratish

> **Ro'yxatimizda apelsin rangli ikonka notebook hujjatini bildiradi.**
>
> **Bizda faqat `ipykernel` nomli kernelga asoslangan Python notebook hujjati bor.**

**Nima bo'ladi:**

> **Brauzer men uchun darrov yangi tab ochadi.**
>
> ## **Bu — biz avval aytgan INTERAKTIV SHELL.**
>
> **Bu yerda siz kodingizni yozasiz va uning natijasini ko'rasiz.**
>
> **Uni `ipykernel` da ishlaydigan notebook hujjati deb tasavvur qiling.**

**Saqlanishi:**

> **U IPython notebook formatida, `.ipynb` kengaytmasi bilan saqlanadi.**
>
> **Siz uni darrov `Documents` papkasida paydo bo'lishini ko'rasiz.**

### IPython nomidan qo'rqmang

> **Aytgancha, bu boshqa yangi nom — IPython — dan qo'rqmang.**
>
> **Uni Jupyter ning AJDODI deb tasavvur qiling.**
>
> **IPython notebook formatini MEROS (legacy) fayl formati deb hisoblang.**

---

## 7. 🛑 Ishni to'g'ri tugatish

> **Xulosadan oldin oxirgi narsa.**
>
> **Ishingizni tugatganingizda RUNNING tabiga o'ting.**
>
> **Tugatmoqchi bo'lgan jarayonga O'NG TUGMA bosing va SHUTDOWN KERNEL ni tanlang.**

**Muqobil:**

> **Aks holda, agar siz Jupyter ni yopsangiz, barcha tegishli jarayonlar AVTOMATIK ravishda tugatiladi.**

> 💡 **Nima uchun kernel'ni to'xtatish kerak?** Har bir ishlab turgan kernel **operativ xotira** egallaydi. 10 ta notebook ochiq qolsa — kompyuter sekinlashadi.

---

## 8. 📊 Dashboard boshqaruvi — jamlangan

| Tab / Tugma | Nima qiladi |
|---|---|
| **Files** | Papkalar va fayllar ro'yxati |
| **Running** | Ishlab turgan jarayonlar (bu yerdan **Shutdown**) |
| **Upload** | Faylni katalogga yuklash |
| **New** | Yangi papka yoki notebook |
| **Selection** | Hammasini tanlash |
| **Rename / Delete / Duplicate / Download** | Belgilangan element ustida amallar |
| 🟢 **Yashil nuqta** | Bu fayl **hozir ishlayapti** |

---

## 9. ⚡ Amaliy topshiriqlar

### 🟢 Oson — 15 daqiqa · **Dashboard'ni to'liq sinang**

```
☐ 1. Jupyter'ni oching
☐ 2. Hozirgi yo'lni (path) yozing:  ______________________
☐ 3. NEW → Folder — yangi papka yarating
☐ 4. Uni belgilang va RENAME qiling → "sinov"
☐ 5. Ichiga kiring
☐ 6. NEW → Notebook (Python 3) yarating
☐ 7. Uning nomini o'zgartiring → "birinchi"
☐ 8. Orqaga qayting (yuqoridagi yo'ldan)
☐ 9. RUNNING tabiga o'ting — nechta jarayon ishlayapti?  ____
☐ 10. Notebook'ni Shutdown qiling
☐ 11. FILES tabiga qayting — yashil nuqta yo'qoldimi?  ha / yo'q
☐ 12. "sinov" papkasini o'chiring
```

### 🟡 O'rta — 15 daqiqa · **Fayl yuklash mashqi**

Kurs mashq notebook'larini yuklashni mashq qiling:

```
1. Kompyuteringizda istalgan .ipynb fayl toping
   (yo'q bo'lsa — Jupyter'da yaratib, boshqa papkaga ko'chiring)

2. Jupyter dashboard'da UPLOAD tugmasini bosing
3. Faylni tanlang → Open
4. U ro'yxatda paydo bo'ldimi?  ha / yo'q
5. Uni oching. Kod yacheykalari ko'rinyaptimi?  ha / yo'q

6. SAVOL: kurs mashqlarini yuklaganingizda,
   ularni QAYSI papkaga qo'yasiz?
   ______________________________________________
```

### 🔴 Qiyin — tartib · **Ish maydonini loyihalang**

```
1. LOYIHALASH: kurs uchun papka strukturasini chizing

   365-python/
   ├── ______________________
   ├── ______________________
   ├── ______________________
   └── ______________________

2. QOIDALAR:
   • Notebook nomlash qoidasi:  ____________________
     (masalan: 12-01-ozgaruvchilar.ipynb)
   • Mashqlar qayerda saqlanadi:  __________________
   • Yechimlar qayerda saqlanadi:  _________________

3. AMALGA OSHIRING: Jupyter'da shu strukturani yarating

4. XOTIRA BOSHQARUVI:
   Bir vaqtda nechta notebook ochiq qoldirasiz?  ____
   Ishni tugatganda nima qilasiz?  __________________

5. SAVOL: 6 oydan keyin bu papkani ochsangiz,
   nimani topa olasiz? Struktura yordam beradimi?
   ______________________________________________
```

---

## 10. 🧠 O'zini tekshirish savollari

1. Jupyter yuklanganda nima ochiladi va u nimani ko'rsatadi?
2. Katalog boshqaruvi mantiqi nimaga o'xshaydi?
3. Papkaga qanday kiriladi va qanday qaytiladi?
4. Checkbox nima uchun kerak?
5. Papka bilan qanday amallar bajarish mumkin?
6. Fayl bilan qanday amallar bajarish mumkin? 5 tasini sanang.
7. Ishlab turgan fayl qanday belgilanadi? Ikki joyni ayting.
8. Selection menyusi nima uchun?
9. Upload tugmasi nima qiladi?
10. New tugmasidan nima yaratish mumkin?
11. Yangi notebook qaysi kernelga asoslanadi va qanday saqlanadi?
12. IPython nima?
13. Ishni to'g'ri qanday tugatish kerak?

<details>
<summary>✅ Javoblar</summary>

1. **Dashboard.** U **ishlayotgan papkaga yo'lni** hamda **papkalar va fayllarni** ko'rsatadi.
2. **Operatsion tizimnikiga** — fayllar papkalarga guruhlanadi, papkalar boshqa papkalarni o'z ichiga oladi.
3. **Papka nomiga bosib** kiriladi; **yuqoridagi papka nomiga bosib** qaytiladi.
4. Elementni **belgilash** va uni **boshqarish** uchun (rename, delete va h.k.).
5. **Rename** va **Delete**.
6. **Open, Download, Rename, Duplicate, Delete.**
7. (a) **Running tabida** ko'rinadi; (b) **Files tabida** ikonka va checkbox orasida **kichik yashil nuqta**.
8. **Barcha fayllarni birgalikda tanlash** — hammasiga bir xil manipulyatsiya qo'llash uchun.
9. Katalogingizga **notebook yuklash**.
10. **Yangi papka** yoki **yangi notebook** fayli.
11. **`ipykernel`** ga. **IPython notebook** formatida, **`.ipynb`** kengaytmasi bilan.
12. Jupyter ning **ajdodi**; `.ipynb` — **meros (legacy)** fayl formati.
13. **Running tabiga** o'tib, jarayonga **o'ng tugma** bosib **Shutdown Kernel**. Yoki Jupyter'ni yopsangiz — barchasi **avtomatik** tugatiladi.

</details>

---

## 📌 Xulosa

```
JUPYTER DASHBOARD

  FILES tabi              RUNNING tabi
  ├── papkalar            └── ishlab turgan jarayonlar
  ├── .ipynb fayllar          → o'ng tugma → Shutdown Kernel
  └── 🟢 = ishlayapti

  Tugmalar:  New (papka/notebook) · Upload · Selection
             Rename · Delete · Duplicate · Download

  NEW → Notebook (ipykernel)  →  INTERAKTIV SHELL
                              →  .ipynb faylda saqlanadi

⚠️ Ishni tugatganda: Running → Shutdown Kernel
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Dashboard | *dashboard* | Jupyter bosh sahifasi |
| Yo'l | *path* | Papkaga manzil |
| Katalog | *directory* | Papka |
| Checkbox | *checkbox* | Belgilash katakchasi |
| Duplicate | *duplicate* | Nusxa yaratish |
| Running | *running* | Ishlab turgan jarayonlar |
| Shutdown Kernel | *shutdown kernel* | Jarayonni to'xtatish |
| ipykernel | *ipykernel* | Jupyter ning Python kerneli |
| Interaktiv shell | *interactive shell* | Kod yozib darrov natija olish muhiti |

---

⬅️ [Oldingi: Anaconda o'rnatish](02-Installing-Anaconda.md) · ➡️ [Keyingi: Notebook fayllari bilan ishlash](04-Working-with-Notebook-Files.md)
