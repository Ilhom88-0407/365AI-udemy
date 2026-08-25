# 7-dars. Kernel'ni qayta ishga tushirish

## 🎬 Boshlashdan oldin

Kecha notebook'da ishladingiz. Bugun ochdingiz — **natijalar joyida turibdi**.

Lekin ular **eski**. Kod o'zgargan bo'lishi mumkin, o'zgaruvchilar esa **yo'q** — kernel o'chgan.

> Bu dars — notebook'ni **toza holatdan** qayta ishga tushirishning ikki usuli haqida.

---

## 1. Muammo

> **Agar siz fayl ustida ishlagan va uning kod yacheykalarini bajarganingizdan keyin uni yopgan bo'lsangiz —**
>
> **keyingi safar ochganingizda siz kirish yacheykalaridagi kodni FAQAT emas, balki CHIQISH maydonlarida saqlangan OLINGAN NATIJALARNI ham ko'rasiz.**

### Savol

> **Endi tasavvur qiling: siz yacheykalarni ENG BOSHIDAN ishga tushirmoqchisiz.**
>
> **Nima qilishingiz kerak?**

---

## 2. ✅ 1-usul: Restart Kernel and Clear Outputs of All Cells

> **Buni qilishning eng yaxshi yo'li — Jupyter menyusidan KERNEL variantini kengaytirish va**
>
> ## **"Restart Kernel and Clear Outputs of All Cells"** ni tanlash.

**Keyin:**

> **Uni bosganingizdan so'ng siz **RESTART** tugmasini bosib tasdiqlashingiz kerak.**

### Natija

> **Keyin biz notebook faylida qolgan yagona narsa — KOD ekanini ko'ramiz.**
>
> ## **Bu yacheykalarning hech biri BAJARILMAGAN.**
>
> **Shuning uchun kirish yacheykalari bilan bog'liq RAQAM YO'Q.**

**Raqamlash qanday tiklanadi:**

```
Boshida:      In [ ]:  In [ ]:  In [ ]:
1-ni bajardik: In [1]:  In [ ]:  In [ ]:
2-ni bajardik: In [1]:  In [2]:  In [ ]:
```

> **Shunday qilib, birinchi yacheykani bajarganimizdan so'ng u 1-raqamga ega bo'ladi. Keyingisi 2 deb raqamlanadi. Va hokazo.**

---

## 3. ✅ 2-usul: Restart Kernel and Run All Cells

> **Boshqa qiziqarli variant — Jupyter menyusidan Kernel variantini kengaytirgandan so'ng**
>
> ## **"Restart Kernel and Run All Cells"** ni tanlash.

### Farqi

> **U asosan biz ko'rgan variant kabi davom etadi.**
>
> **Bu safar, ammo, PYTHON BARCHA kod yacheykalarini BIRINCHISIDAN OXIRGISIGACHA ishga tushiradi** —
>
> **agar yo'lda biror joyda XATOGA duch kelmasa.**

### ⚠️ Muhim nuans

> **Agar ba'zi yacheykalarda xato bo'lsa — PYTHON SHUNCHAKI O'SHA YERDA TO'XTAYDI.**

> **Bizning holatimizda kodda xato yo'q edi va yacheykalar to'g'ri tartibda joylashgan edi, shuning uchun hammasi boshidan oxirigacha ishlaydi.**

---

## 4. 🎯 Qachon ishlatiladi

> **Bu variantlarni notebook fayli bilan qilgan ishingizni QAYTA BAJARISHINGIZ kerak bo'lganda istalgan vaqtda qo'llash mumkin.**

> ## **Bu odatda hujjatda UZOQ VAQT sarflagandan keyin sodir bo'ladi —**
> ## **kodingiz BOSHIDAN OXIRIGACHA silliq ishlashini TEKSHIRMOQCHI bo'lganingizda.**

---

## 5. ⚠️ Nima uchun bu shunchalik muhim

Ma'ruzada aytilmagan, lekin bu — Jupyter'ning **eng katta tuzog'i**:

### Muammo: yashirin holat

Tasavvur qiling, siz shunday ishladingiz:

```
1. [1] yacheykada:  x = 100        →  bajardingiz
2. Keyin yacheykani o'chirdingiz yoki o'zgartirdingiz
3. [2] yacheykada:  print(x)       →  100 chiqdi  ✅
```

**Sizning notebook'ingiz ishlayapti.** Lekin `x = 100` **hech qayerda yozilmagan** — u faqat **kernel xotirasida** yashiryapti.

**Hamkasbingiz notebook'ni ochib ishga tushirsa:**

```
NameError: name 'x' is not defined     ❌
```

### Yechim

> **`Restart Kernel and Run All Cells` — bu sizning notebook'ingiz BOSHQA odamda ham ishlashini tekshiradigan yagona ishonchli usul.**

> 💡 **Amaliy qoida:** ishni tugatishdan **oldin** doim **Restart & Run All** qiling. Agar u toza o'tsa — notebook **haqiqatan tayyor**.

*(5-darsni eslang: "tanlab bajarish vaqt tejaydi". Bu — o'sha erkinlikning **narxi**.)*

---

## 6. 📊 Ikkita variantni solishtirish

| | Clear Outputs | Run All Cells |
|---|---|---|
| **Kernel qayta ishga tushadimi** | ✅ Ha | ✅ Ha |
| **Natijalar tozalanadimi** | ✅ Ha | ✅ Ha |
| **Kod bajariladimi** | ❌ Yo'q | ✅ **Ha, hammasi** |
| **Raqamlar** | Bo'sh `[ ]` | `[1]`, `[2]`, `[3]`... |
| **Xato bo'lsa** | — | **O'sha yerda to'xtaydi** |
| **Qachon ishlatiladi** | Toza boshlash · fayl ulashish | **Tekshirish** · yakuniy sinov |

---

## 7. ⚡ Amaliy topshiriqlar

### 🟢 Oson — 10 daqiqa · **Ikkala variantni sinang**

```
1. Yangi notebook yarating, 3 ta yacheyka:
   [1]:  a = 10
   [2]:  b = 20
   [3]:  print(a + b)

2. Hammasini ishga tushiring. Raqamlar: ______

3. Kernel → Restart Kernel and Clear Outputs of All Cells
   Raqamlar nima bo'ldi?  ______
   Natijalar qoldimi?  ha / yo'q
   Kod qoldimi?  ha / yo'q

4. Endi qo'lda hammasini qayta ishga tushiring.

5. Kernel → Restart Kernel and Run All Cells
   Necha soniyada tugadi?  ______
   Raqamlar: ______

6. FARQ nima?  ______________________________
```

### 🟡 O'rta — 20 daqiqa · **Yashirin holat tuzog'ini yarating**

Bu — Jupyter'ning eng muhim saboqi:

```
1. Yangi notebook, birinchi yacheyka:
      maxfiy_son = 42

2. Ishga tushiring (Shift+Enter)

3. Ikkinchi yacheyka:
      print("Son:", maxfiy_son)

4. Ishga tushiring — ishladimi?  ha / yo'q

5. Endi BIRINCHI yacheykani O'CHIRING (D D)

6. Ikkinchi yacheykani QAYTA ishga tushiring.
   Ishladimi?  ha / yo'q
   NEGA?  ______________________________________

7. Endi: Kernel → Restart Kernel and Run All Cells
   Nima bo'ldi?  ______________________________
   Qanday xato?  ______________________________

8. XULOSA (3 jumla): nima uchun Restart & Run All
   ishni topshirishdan oldin MAJBURIY?
   ______________________________________________
   ______________________________________________
```

<details>
<summary>💡 Javob</summary>

**6-savol:** Ha, ishlaydi! Chunki `maxfiy_son` hali ham **kernel xotirasida**. Kod o'chirilgan, lekin **qiymat qolgan**.

**7-savol:** `NameError: name 'maxfiy_son' is not defined` — kernel tozalandi va endi kodda uni aniqlaydigan hech narsa yo'q.

**Xulosa:** notebook **sizda ishlayotgani** — u **boshqada ham ishlaydi** degani **emas**. Faqat `Restart & Run All` buni isbotlaydi.

</details>

### 🔴 Qiyin — tartib · **O'z ish protokolingizni yozing**

```
━━━ MENING JUPYTER PROTOKOLIM ━━━

1 · ISHNI BOSHLAGANDA
   ______________________________________________

2 · ISH DAVOMIDA
   • Yacheykalarni qanday tartibda bajaraman:
     ______________________________________
   • Qachon Markdown qo'shaman:
     ______________________________________

3 · ISHNI TUGATISHDAN OLDIN  (MAJBURIY)
   ☐ ______________________________________
   ☐ ______________________________________
   ☐ ______________________________________

4 · FAYLNI ULASHISHDAN OLDIN
   ☐ ______________________________________
   ☐ ______________________________________
   Natijalarni tozalaymanmi yoki qoldiramanmi?  ______
   Nega: __________________________________

5 · JUPYTER'NI YOPISHDAN OLDIN
   ______________________________________________
   (3-darsni eslang — Shutdown Kernel)

6 · SAVOL: bu protokol nima uchun 10-modulning
   1-darsidagi "kod uslubi" bilan bog'liq?
   ______________________________________________
```

---

## 8. 🧠 O'zini tekshirish savollari

1. Yopilgan faylni qayta ochganda nimani ko'rasiz?
2. Yacheykalarni eng boshidan ishga tushirishning eng yaxshi yo'li qanday?
3. Bu variant tanlangandan keyin nima qilish kerak?
4. Natijada notebook'da nima qoladi?
5. Kirish yacheykalarida raqam bormi? Nima uchun?
6. Ikkinchi variant nima deb ataladi?
7. Uning farqi nima?
8. Agar biror yacheykada xato bo'lsa nima bo'ladi?
9. Bu variantlar qachon qo'llaniladi?

<details>
<summary>✅ Javoblar</summary>

1. Kirish yacheykalaridagi **kodni** ham, chiqish maydonlarida **saqlangan olingan natijalarni** ham.
2. **Kernel** menyusi → **"Restart Kernel and Clear Outputs of All Cells"**.
3. **Restart** tugmasini bosib **tasdiqlash**.
4. Faqat **KOD** — yacheykalarning hech biri **bajarilmagan**.
5. **Yo'q** — chunki hech biri bajarilmagan. Bajargan sari `[1]`, `[2]`... paydo bo'ladi.
6. **"Restart Kernel and Run All Cells".**
7. Python **barcha kod yacheykalarini birinchisidan oxirgisigacha** ishga tushiradi.
8. Python **shunchaki o'sha yerda to'xtaydi**.
9. Notebook bilan qilgan ishni **qayta bajarish** kerak bo'lganda — odatda **uzoq vaqt** sarflagandan keyin, kod **boshidan oxirigacha silliq ishlashini tekshirish** uchun.

</details>

---

## 📌 Xulosa

```
Fayl yopilib qayta ochilganda:  KOD + eski NATIJALAR qoladi
                                 lekin KERNEL bo'sh!

Kernel menyusi:

  1 · Restart Kernel and CLEAR OUTPUTS of All Cells
      → faqat KOD qoladi, raqamlar bo'sh [ ]
      → toza boshlash uchun

  2 · Restart Kernel and RUN ALL Cells
      → hammasi boshidan oxirigacha bajariladi
      → ⚠️ xato bo'lsa — O'SHA YERDA TO'XTAYDI
      → TEKSHIRISH uchun

🔑 Qoida: ishni topshirishdan oldin DOIM "Restart & Run All"
   Toza o'tdimi? → notebook boshqa odamda ham ishlaydi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Kernel restart | *restart kernel* | Kernelni qayta ishga tushirish |
| Clear outputs | *clear outputs* | Natijalarni tozalash |
| Run all cells | *run all cells* | Hamma yacheykani bajarish |
| Yashirin holat | *hidden state* | Kernel xotirasidagi ko'rinmas qiymatlar |
| Takrorlanuvchanlik | *reproducibility* | Kodning boshqa joyda ham ishlashi |

---

⬅️ [Oldingi: Xato xabarlari](06-Handling-Error-Messages.md) · 🏠 [Modul boshiga](README.md)

➡️ **Keyingi:** **12-modul: Python o'zgaruvchilari va ma'lumot turlari** — endi haqiqiy kod boshlanadi.
