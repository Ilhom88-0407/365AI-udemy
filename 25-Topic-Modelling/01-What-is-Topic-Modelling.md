# 1-dars. Mavzu modellashtirish nima?

## 🎬 Boshlashdan oldin

> **"Endi matnimizni vektorlashtirishda o'zimizni bemalol his qilganimizdan so'ng, biz MAVZU MODELLASHTIRISHNING haqiqatan HAYAJONLI sohasiga sho'ng'ishga tayyormiz."**

---

## 1. Nima qiladi?

> **"Mavzu modellashtirish HUJJATLAR TO'PLAMINI oladi — hujjatlar deganda men alohida matn bo'laklarini nazarda tutaman. Bu DataFrame'dagi matnli qatorlar bo'lishi mumkin. Ro'yxatdagi elementlar bo'lishi mumkin, shunga o'xshash har qanday narsa. Ular shunchaki HUJJATLAR deb ataladi."**
>
> ## **"Mavzu modellashtirish har bir hujjatimizni SKANERLAYDI va NAQSHLARNI aniqlaydi. Keyin biz o'xshash hujjatlarni MAVZULARGA guruhlashimiz mumkin."**

```
   100 ta yangilik maqolasi
            │
            ▼
   ┌─────────────────┐
   │  MAVZU MODELI   │   ← naqshlarni QIDIRADI
   └─────────────────┘
            │
    ┌───────┼───────┬────────┐
    ▼       ▼       ▼        ▼
 SIYOSAT  SPORT  MUSIQA  JINOYAT
  24 ta   15 ta   28 ta    20 ta
```

---

## 2. ⭐ Bu — NAZORATSIZ o'qitish

> **"Agar 1-bo'limga qaytib o'ylasangiz, biz NAZORAT OSTIDA va NAZORATSIZ mashinali o'qitishni muhokama qilganimizni eslaysiz."**
>
> ## **"Mavzu modellashtirish — bu NAZORATSIZ o'qitishga misol. Bu mavzularni topish uchun bizga ma'lumotimizda HECH QANDAY YORLIQ KERAK EMAS."**
>
> **"Algoritmlar shunchaki asosiy naqshlarni aniqlash orqali ishlaydi."**

```
┌──────────────────────────┬──────────────────────────┐
│   NAZORAT OSTIDA         │      NAZORATSIZ          │
│   (supervised)           │     (unsupervised)       │
├──────────────────────────┼──────────────────────────┤
│ Yorliqlar KERAK          │ Yorliqlar KERAK EMAS ⭐  │
│                          │                          │
│ "Bu spam"                │ "Bu hujjatlar bir-biriga │
│ "Bu spam emas"           │  o'xshaydi"              │
│         ↓                │         ↓                │
│ Model o'rganadi          │ Model NAQSH topadi       │
│                          │                          │
│ 23-modul: sentiment      │ BU MODUL: mavzular ⭐    │
│ 26-modul: tasniflagich   │                          │
└──────────────────────────┴──────────────────────────┘
```

> ## 💡 **Bu — juda katta afzallik.** 10 000 ta sharhni **qo'lda teglash** — haftalar. Mavzu modellashtirish esa **teglashsiz** ishlaydi.

---

## 3. Qanday ishlaydi?

> **"Algoritmlar bu turli hujjatlar bo'ylab O'XSHASH SO'Z NAQSHLARINI aniqlash orqali ishlaydi."**
>
> **"Bu so'z naqshlari har bir matn bo'lagi NIMA HAQIDA gapirayotganini aniqlash uchun ishlatiladi. Va algoritmlar buni tushungach, ular o'xshash hujjatlarni juda oson guruhlashi mumkin."**

```
Hujjat A:  ... ball ... player ... match ... game ...
Hujjat B:  ... player ... goal ... match ... team ...
Hujjat C:  ... vote ... party ... election ... policy ...
              ↑
      A va B da bir xil so'zlar TAKRORLANADI
              ↓
       A va B — BIR XIL MAVZU  ⚽
       C — BOSHQA MAVZU        🏛️
```

---

## 4. 🎯 Misol — o'qituvchidan

> **"Keling, bu turli mavzular qanday ko'rinishini misol bilan tasvirlaylik. Quyidagi matnni olaylik."**

```
"AI is now able to create videos and audio that are hard to
 distinguish from the real thing. Recently, a number of celebrities
 have been impersonated and journalists need to take extra care
 verifying sources before going to publication. You don't need any
 special hardware to work with AI. Governments are discussing
 bringing in regulations and policy."
```

**Tarjima:** *"AI endi haqiqiysidan farqlash qiyin bo'lgan video va audio yarata oladi. Yaqinda bir qancha mashhur shaxslarga taqlid qilindi va jurnalistlar nashrga chiqishdan oldin manbalarni tekshirishda alohida ehtiyot bo'lishlari kerak. AI bilan ishlash uchun maxsus uskuna kerak emas. Hukumatlar qoidalar va siyosat joriy qilishni muhokama qilmoqda."*

> **"Bu matnni ko'rib chiqsangiz, undan bir nechta turli MAVZULAR chiqishini ko'rishingiz mumkin."**

![Mavzu modellashtirish misoli](assets/01-topic-example.svg)

### Uchta mavzu

> **"Mavzulardan biri USKUNA atrofida bo'lishi mumkin. Ya'ni sizda `video`, `audio` va `hardware` so'zlari bor — ularni bitta mavzuga birlashtirish mumkin."**

```
🖥️  MAVZU 1 — USKUNA
    video · audio · hardware
```

> **"Keyin sizda `celebrities`, `journalists`, `publication` kabi so'zlar bor — ular MEDIA atrofida ikkinchi mavzuni tashkil qilishi mumkin."**

```
📰  MAVZU 2 — MEDIA
    celebrities · journalists · publication
```

> **"Shuningdek, HUKUMAT atrofida ba'zi so'zlar bor. Sizda `government`, `regulations`, `policy` so'zlari bor. Bu uchinchi mavzuni tashkil qilishi mumkin."**

```
🏛️  MAVZU 3 — HUKUMAT
    government · regulations · policy
```

> ## **"Bu — mavzu modellashtirish qanday ishlashining juda ODDIY misoli. U matnimiz ichida ASOSIY MAVZULARNI qidiradi, va bu asosiy mavzularni bilgach, hujjatga UMUMIY MAVZU berishi va o'xshash hujjatlarni aniqlashi mumkin."**

### 🔑 Diqqat: bitta matnda BIR NECHTA mavzu

```
BIR hujjat  →  BIR NECHTA mavzu (turli ULUSHLARDA)

Bizning matn:
   🖥️ uskuna    30%
   📰 media      40%     ← ustun mavzu
   🏛️ hukumat   30%
```

> 💡 **Bu — muhim.** Mavzu modeli hujjatni bitta qutiga solmaydi. U **har bir mavzuning ULUSHINI** beradi.

---

## 5. Nima uchun bu foydali?

> **"Mavzu modellashtirish har qanday NLP ma'lumot olimi uchun ajoyib resurs."**
>
> **"U TEZ ishlashi va ma'lumotimizdagi asosiy mavzular va naqshlarni aniqlashi mumkin."**
>
> ## **"U shuningdek KATTA HAJMDAGI matnni olib, agar buni QO'LDA qilsak, ODAMLAR SHUNCHAKI O'TKAZIB YUBORISHI mumkin bo'lgan naqshlarni topishi mumkin."**

| Afzallik | Izoh |
|---|---|
| ⚡ **Tez** | Minglab hujjat — bir necha daqiqa |
| 🏷️ **Yorliq kerak emas** | Nazoratsiz o'qitish |
| 🔍 **Yashirin naqshlar** | Odam sezmaydigan bog'lanishlar |
| 📊 **Miqyoslanadi** | 100 ta ham, 1 000 000 ta ham |

---

## 6. Ikkita algoritm

> **"Mavzu modellashtirish sohasida bir qancha turli algoritmlar bor, lekin bugun biz ENG KENG TARQALGAN IKKITASIGA e'tibor qaratamiz."**
>
> **"Birinchisi — LATENT DIRICHLET ALLOCATION. Keyin LATENT SEMANTIC ANALYSIS ga o'tamiz."**

| | **LDA** | **LSA** |
|---|---|---|
| **To'liq nomi** | *Latent Dirichlet Allocation* | *Latent Semantic Analysis* |
| **Asosi** | **Ehtimollik** | **Chiziqli algebra** *(SVD)* |
| **Kiritish** | Bag of Words | **TF-IDF** |
| **Natija** | Har mavzuning **ehtimoli** | Har mavzuning **vazni** |
| **Dars** | 3–4 | 5–6 |

> 💡 **`Latent`** — ikkalasida ham bor. Bu **"yashirin"** degani. Mavzu matnda **ko'rinmaydi** — biz uni **so'zlar orqali topamiz**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Mavzu modellashtirish nazorat ostidami yoki nazoratsizmi?

**M2.** "Hujjat" nima?

**M3.** Quyidagi so'zlarni **3 ta mavzuga** guruhlang.

```
doctor · goal · patient · election · referee · vote
hospital · stadium · parliament · nurse · match · minister
```

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **NAZORATSIZ** *(unsupervised)*. Yorliqlar **kerak emas**.

**M2.** **Bitta matn birligi** — DataFrame qatori, ro'yxat elementi, bitta sharh, bitta maqola.

**M3.**

```
🏥 TIBBIYOT:   doctor · patient · hospital · nurse
⚽ SPORT:      goal · referee · stadium · match
🏛️ SIYOSAT:   election · vote · parliament · minister
```

> 💡 Siz buni **oson** qildingiz — chunki so'zlarni **bilasiz**. Algoritm esa **ma'noni bilmaydi**, u faqat **birga uchrashini** ko'radi. Va natija **bir xil** bo'ladi!

</details>

### 🟡 O'rta

**M4.** Nima uchun bir hujjatda bir nechta mavzu bo'lishi mumkin?

**M5.** `latent` so'zi nimani anglatadi?

<details>
<summary>✅ Javoblar</summary>

**M4.** Chunki haqiqiy matn **aralash**. Yangilik maqolasi **sport** haqida bo'lishi, lekin **pul** *(transfer narxi)* va **siyosat** *(stadion qurilishi)* ni ham tilga olishi mumkin.

```
Maqola: "Klub yangi stadion uchun hukumatdan 50 mln so'radi"
   ⚽ sport     50%
   💰 moliya    30%
   🏛️ siyosat  20%
```

**M5.** **"Yashirin"**, **"berkitilgan"**. Mavzu matnda **yozilmagan** — hech kim *"bu maqola sport haqida"* deb yozmagan. Biz uni **so'zlar naqshidan** topamiz.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Mavzu modellashtirish nima qiladi?
2. Bu qaysi turdagi mashinali o'qitish?
3. Yorliqlar kerakmi?
4. Algoritm nimani qidiradi?
5. Bir hujjatda nechta mavzu bo'lishi mumkin?
6. Ikkita asosiy algoritm qaysi?

<details>
<summary>✅ Javoblar</summary>

1. Hujjatlarni **skanerlaydi**, **naqshlarni** aniqlaydi va o'xshashlarini **mavzularga guruhlaydi**.
2. ## **NAZORATSIZ** *(unsupervised)*.
3. ## **YO'Q!** Bu — asosiy afzallik.
4. **O'xshash so'z naqshlarini** — qaysi so'zlar **birga** uchrashini.
5. **Bir nechta** — har biri **o'z ulushi** bilan.
6. **LDA** *(Latent Dirichlet Allocation)* va **LSA** *(Latent Semantic Analysis)*.

</details>

---

## 📌 Xulosa

```
MAVZU MODELLASHTIRISH
= hujjatlarni skanerlab, NAQSHLARNI topib,
  o'xshashlarini MAVZULARGA guruhlash


⭐ NAZORATSIZ O'QITISH
   Yorliqlar KERAK EMAS!
   Algoritm o'zi naqsh topadi


MISOL

"AI is now able to create videos and audio... celebrities
 have been impersonated and journalists... Governments are
 discussing bringing in regulations and policy."
                    ↓
  🖥️ USKUNA    video · audio · hardware
  📰 MEDIA      celebrities · journalists · publication
  🏛️ HUKUMAT   government · regulations · policy


🔑 BIR hujjat → BIR NECHTA mavzu (ULUSHLARDA)
   uskuna 30% · media 40% · hukumat 30%


IKKITA ALGORITM
┌─────────────────────┬─────────────────────┐
│        LDA          │        LSA          │
│  (3-4 darslar)      │   (5-6 darslar)     │
├─────────────────────┼─────────────────────┤
│ EHTIMOLLIK asosida  │ CHIZIQLI ALGEBRA    │
│ Bag of Words        │ TF-IDF              │
│ ehtimol qaytaradi   │ vazn qaytaradi      │
└─────────────────────┴─────────────────────┘

"latent" = YASHIRIN
   Mavzu matnda YOZILMAGAN — uni so'zlardan TOPAMIZ
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Mavzu modellashtirish | *topic modelling* | Yashirin mavzularni topish |
| Hujjat | *document* | Bitta matn birligi |
| Korpus | *corpus* | Barcha hujjatlar |
| Nazoratsiz o'qitish | *unsupervised learning* | Yorliqsiz o'qitish |
| Yashirin | *latent* | Ko'rinmaydigan, berkitilgan |
| Naqsh | *pattern* | Takrorlanuvchi tuzilma |
| LDA | *Latent Dirichlet Allocation* | Ehtimollik asosidagi algoritm |
| LSA | *Latent Semantic Analysis* | Chiziqli algebra asosidagi algoritm |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Qachon ishlatiladi](02-When-to-Use-Topic-Modelling.md)
