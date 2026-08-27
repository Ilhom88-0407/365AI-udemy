# 1-dars. Har o'lchamdagi biznes uchun AI ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `$500 mlrd` lik Stargate loyihasidan gapiradi. Biz kichik do'kon uchun hisobladik — yiliga `$162`. Va savollarning 70% i AI SIZ hal bo'ladi."**

---

## 1. Kursning savoli

> *"AI haqiqatan hammaga foyda keltiryaptimi? Yoki u **raqamli tafovut**
> yaratyaptimi — sotib ola oladigan va ola olmaydigan bizneslar orasida?"*

| Kurs keltirgan raqam | Nima |
|---|---|
| ## **£10 mln** | Britaniya — AI tadqiqot va o'quv dasturlari |
| ## **$500 mlrd** | ## ⭐ **Stargate** *(OpenAI + SoftBank + Oracle)*, 2025-yil yanvar |
| 20 ta ma'lumot markazi | AQSh, 100 000+ ish o'rni |

> ## ⚠️ **KURSNING O'Z XULOSASI HAM SHUNDAY:** ## *"boy davlatlar AI da yo'lini ## ⭐ **sotib olishga urinishi** mumkin, ## bu esa texnologik tafovutni ## 💥 **kengaytiradi**."*

---

## 2. 🔬 Kichik biznesga **qancha turadi?**

Kurs *"kichikdan boshlang"* deydi. Buni **son bilan** tekshiramiz.

```python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")

NARX_KIRISH  = 2.50 / 1_000_000      # $/token
NARX_CHIQISH = 10.00 / 1_000_000

KUNLIK = 200                          # kichik do'kon: kuniga 200 savol
CHIQISH_TOKEN = 120
```

### ✅ Haqiqiy natija

```
  Kichik do'kon: kuniga 200 savol, javob ~120 token
  til                             oylik $   yillik $
  mijoz savoli (inglizcha)          13.35     162.43
  mijoz savoli (o'zbekcha)          13.44     163.52
  mijoz savoli (ruscha)             13.37     162.61
```

> ## 🏆 **YILIGA `$162`.**
>
> ## ## ⭐ Bu — bitta xodimning ## 🔑 **bir kunlik ish haqidan ham kam**. ## ## 💡 Ya'ni **narx** — to'siq emas.

---

## 3. 💥 Lekin til **narxni oshiradi**

Bir xil savol o'zbekchada **ko'proq token** oladi.

```
  so'rov                        token   belgi
  mijoz savoli (inglizcha)         10      36
  mijoz savoli (o'zbekcha)         16      45      💥 1.60x
  mijoz savoli (ruscha)            11      38      1.10x
```

> ## 🤔 **UNDA NEGA YILLIK NARX DEYARLI BIR XIL** ## *($162.43 va $163.52)?*

### 🔬 Sababi — **tizim prompti**

```
  senariy                                 EN token  UZ token   nisbat
  qisqa savol (10 token) + 400 tizim           410       416     1.01x
  qisqa savol, tizim promptsiz                  10        16     1.60x
  hujjat (RAG konteksti)                       451       709     1.57x
```

> ## 🔑 **400 TOKENLIK TIZIM PROMPTI ## FARQNI YUTIB YUBORADI.** ## ## ⭐ `1.60x` → `1.01x`.

### 💥 Va u **qayerda qaytib keladi**

```
  senariy                                     EN $      UZ $    farq $
  qisqa savol + tizim prompti               162.43    163.52     +1.09
  hujjat (RAG konteksti)                    169.91    216.99    +47.09
```

> ## 💥💥 **RAG QO'SHSANGIZ — YILIGA `+$47` (+28%).**
>
> ## ## 🔑 Chunki endi ## ⭐ **hujjatning o'zi** o'zbekcha, ## va u ## 💥 **1.57× ko'proq token**.

> ## 🏆 **AMALIY XULOSA:** ## til jarimasi ## ⚠️ **qisqa savollarda ko'rinmaydi**, ## lekin ## 💥 **hujjat kontekstida qaytadi**.

> ## 💡 **VA BU — 74-MODULDAGI ## "TENGLIK" MAVZUSINING ANIQ SONI.**

---

## 4. 🔬 *"Kichikdan boshlang"* — **nechta savol AI talab qiladi?**

Kursning eng amaliy maslahati. Lekin **qaysi vazifadan** boshlash kerak?

```python
SAVOL_TURLARI = {
 "buyurtma holati":       (0.34, "shablon + baza"),
 "qaytarish siyosati":    (0.22, "shablon"),
 "yetkazib berish narxi": (0.14, "shablon"),
 "mahsulot savoli":       (0.16, "AI kerak"),
 "shikoyat":              (0.09, "INSON"),
 "boshqa":                (0.05, "INSON"),
}
```

### ✅ Haqiqiy natija

```
  shablon bilan (AI SIZ) hal bo'ladi: 70%
  AI qo'shilsa jami:                  86%
  insonga qoladi:                     14%
```

> ## 💥💥💥 **SAVOLLARNING 70% I AI SIZ HAL BO'LADI.**
>
> ## ## ⭐ *"Buyurtmangiz qayerda?"* — bu ## 🔑 **model savoli emas**, ## bu — ## 🏆 **bazaga so'rov**.

> ## 💡 **VA BU — 72-MODULDAGI QOIDANING TAKRORI:** ## *"30 kundan keyin qaytarish mumkinmi?"* — ## ## ⭐ **`if sana_farqi <= 30`**, model emas.

> ## 🏆🏆 **ENG ARZON AI STRATEGIYASI —** ## ## 💡 **AI ISHLATMASLIK KERAK BO'LGAN JOYNI TOPISH.**

### ⚠️ Nega bu **etik** masala?

| Sabab | Izoh |
|---|---|
| ## **Xatolar** | ## 💥 Shablon **gallyutsinatsiya qilmaydi** |
| Narx | ⭐ Bepul |
| ## **Tushuntiriladi** | ## 🏆 **Har javob — ko'rinadigan qoida** |
| Nomuvofiqlik | ## ✅ **Yo'q** *(72-modul: 37.5%)* |

> ## 🔑 **YA'NI 70% SAVOL UCHUN ## SHABLON — FAQAT ARZON EMAS, ## ⭐ ETIK JIHATDAN HAM YAXSHIROQ.**

---

## 5. ⚠️ Kursning ogohlantirishi

> *"Ba'zi kompaniyalar AI ni **kerak bo'lgani uchun emas**,
> **moda bo'lgani uchun** joriy qilmoqda."*

### 🏆 Tekshiruv ro'yxati — **AI kerakmi?**

```python
AI_KERAKMI = [
    "Vazifa QOIDA bilan hal bo'ladimi?           -> ha bo'lsa: AI KERAK EMAS",
    "Ma'lumot bazada bormi?                      -> ha bo'lsa: SO'ROV YOZING",
    "Javob HAR DOIM bir xil bo'lishi kerakmi?    -> ha bo'lsa: SHABLON",
    "Xato bo'lsa oqibati og'irmi?                -> ha bo'lsa: INSON",
    "Kiritma erkin matnmi va turlichami?         -> ha bo'lsa: AI FOYDALI",
]
```

> ## 💡 **BESHTA SAVOLDAN TO'RTTASI ## *"AI ISHLATMANG"* GA OLIB BORADI.**

> ## ⚠️ **VA BU — TASODIF EMAS.** ## ## 🔑 Ko'p biznes vazifasi ## ⭐ **aniqlangan qoidalarga** ega, ## va AI ularni ## 💥 **noaniq qiladi**.

---

## 6. ✅ Kurs to'g'ri sanagan bepul vositalar

| Vosita | Nima |
|---|---|
| ## **Hugging Face** | ## ⭐ **Bu kitobdagi hamma model shu yerdan** |
| TensorFlow | Ochiq kutubxona |
| Llama | Ochiq og'irlikli model |
| Google AutoML · Power Platform | Kodsiz |

> ## 🏆 **VA BU KITOBNING O'ZI — ISBOT.** ## ## ⭐ 65–72-modullardagi ## **hamma o'lchov** ## 🔑 **bitta noutbukda**, ## ## 💥 **API kalitsiz**, ## `Qwen2.5-0.5B` bilan bajarildi.

> ## 💡 **NARX — TO'SIQ EMAS.** ## ## 💥 **BILIM — TO'SIQ.**

---

## 🎯 Nazorat savollari

1. Kichik do'kon uchun yillik narx qancha chiqdi?
2. O'zbekcha `1.60×` ko'proq token oladi. Nega yillik narx deyarli bir xil?
3. Til jarimasi qayerda qaytib keladi?
4. Savollarning necha foizi AI siz hal bo'ladi?

<details>
<summary>Javoblar</summary>

1. ## **$162.43** *(kuniga 200 savol)*. ⭐ Bir xodimning **bir kunlik ish haqidan kam**. 💡 Narx — to'siq emas.
2. ## Chunki **400 tokenlik tizim prompti** farqni yutib yuboradi: 🔑 `1.60x` → **`1.01x`**. ⭐ Qisqa savolda til jarimasi **ko'rinmaydi**.
3. ## **RAG kontekstida.** 💥 Hujjatning o'zi o'zbekcha bo'lsa — **1.57× token**, yiliga **+$47 (+28%)**.
4. ## **70%** — shablon va bazaga so'rov bilan. ⭐ AI qo'shilsa **86%**, insonga **14%** qoladi. 🏆 Va shablon 💥 **gallyutsinatsiya qilmaydi, nomuvofiq emas, tushuntiriladi** — ya'ni **etik jihatdan ham yaxshiroq**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Transparency-and-XAI.md)
