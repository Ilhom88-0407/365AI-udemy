# 3-dars. AI chiqishlaridan mas'uliyatli foydalanish ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"AI detektori yozdim. Men to'qigan namunalarda 100% aniqlik berdi. HAQIQIY model matnida — 67%. Va bitta almashtirish uni 5/5 dan 1/5 ga tushirdi."**

---

## 1. Kursning ogohlantirishi

> *"AI yaratgan maqolalar shu qadar realistikki, ular o'quvchilarni
> **soxta yangiliklarga ishontirishi** oson."*

| Kurs keltirgan holat | Raqam |
|---|---|
| ## **Gonkong — deepfake video qo'ng'iroq** | ## 💥 **$25 mln** |
| McAfee: ovoz klonlash bilan duch kelgan | ## 💥 **4 tadan 1 tasi** |
| ## **Klonlangan ovozni ajrata olmaganlar** | ## 💥 **70%** |

---

## 2. 🔬 Kursning raqamlarini **birlashtiramiz**

```python
DUCH         = 0.25    # 4 tadan 1 tasi duch keladi
AJRATOLMAYDI = 0.70    # ulardan 70% i ajrata olmaydi
```

### ✅ Haqiqiy natija *(1 mln kishilik aholi)*

```
  aholi:                            1,000,000
  ovoz klonlash bilan duch keldi:     250,000 (25%)
  ulardan ajrata olmaydiganlar:       175,000 (70%)

  himoyasiz ulush: 17.5%
  -> har 6 kishidan 1 tasi
```

> ## 💥💥 **HAR 6 KISHIDAN 1 TASI.**

### 🏆 Va **bitta oddiy chora** buni o'zgartiradi

Oilaviy **parol so'zi** — telefonda so'raladigan, faqat oilangiz
biladigan so'z.

```
    samaradorlik    0% -> himoyasiz 17.50%
    samaradorlik   50% -> himoyasiz  8.75%
    samaradorlik   90% -> himoyasiz  1.75%
    samaradorlik   99% -> himoyasiz  0.18%
```

> ## 🏆🏆 **BU — TEXNOLOGIYA EMAS.** ## ## ⭐ Bu — **bitta suhbat**: ## 💡 *"Agar men qo'ng'iroq qilib pul so'rasam — ## **parol so'zini so'ra**."*

> ## 💡 **VA U DEEPFAKE SIFATIGA ## UMUMAN BOG'LIQ EMAS.**

---

## 3. 🔬 AI matnini **aniqlash mumkinmi?**

Sodda detektor yozamiz — **AI ga xos iboralarni** qidiradi.

```python
AI_NAQSH = re.compile(
    r"\b(it'?s important to note|in conclusion|furthermore|additionally"
    r"|moreover|comprehensive|leverage|leveraging|streamline|innovative"
    r"|crucial role|it is worth mentioning|overall,|delve into|robust"
    r"|seamless)\b", re.I)
```

### 🔧 Birinchi sinov — **men to'qigan namunalar**

```
  AI matnlar topildi:      5/5
  Inson matnlari xato:     0/5
  aniqlik: 100%
```

> ## 🤔 **100%?**
>
> ## ## 💥 **HA — CHUNKI MEN "AI NAMUNALARINI" ## AYNAN SHU IBORALAR BILAN YOZGAN EDIM.**

> ## 💥💥💥 **BU — DOIRAVIY SINOV.** ## Detektor ## ⭐ **o'z kalit so'zlarini** topdi. ## ## 🔑 Bu — **hech narsani isbotlamaydi**.

### ✅ Ikkinchi sinov — **HAQIQIY model matni**

Modelga 6 ta oddiy so'rov berdik va **uning javoblarini** sinadik.

```
  --- HAQIQIY model matni ---
  TOPILDI   Remote work has become increasingly popular due to the
            convenience and flexibility it offers...
  o'tkazdi  Learning a new language can be challenging, but it is also
            incredibly rewarding...
  o'tkazdi  To keep your small garden healthy and productive, make sure...
  o'tkazdi  Choosing the right laptop is an important decision...
  o'tkazdi  Cooking at home is an enjoyable and rewarding experience...
  TOPILDI   Riding a bicycle to work can be an enjoyable and healthy way...

  AI matni topildi:    2/6
  Inson matni xato:    0/6
  aniqlik: 67%
```

> ## 💥💥 **100% → 67%.**
>
> ## ## ⭐ Va **yolg'on bayroq yo'q** *(0/6)* — ## ya'ni detektor ## 🔑 **ehtiyotkor**, ## lekin ## 💥 **4 tadan 3 tasini o'tkazib yubordi**.

> ## 🏆 **VA BU — 71 VA 72-MODULLARNING ## SABOQI UCHINCHI MARTA:**
>
> ## ## 💡 **O'Z TESTINGIZNI O'ZINGIZ YOZSANGIZ —** ## ## 💥 **U SIZGA YOQADIGAN JAVOBNI BERADI.**

---

## 4. 💥 Detektorni **aldash** — qancha mehnat?

```python
ALMASHTIRISH = {
    "It's important to note that": "Worth saying:",
    "In conclusion,":              "So,",
    "Additionally,":               "And",
    "comprehensive":               "full",
    "innovative":                  "new",
    "streamline":                  "simplify",
}
```

### ✅ Haqiqiy natija

```
  yashirishdan OLDIN topildi: 5/5
  yashirishdan KEYIN topildi: 1/5

  namuna:
    oldin: It's important to note that there are several factors to
           consider when evaluating this approach.
    keyin: Worth saying: there are several factors to consider when
           evaluating this approach.
```

> ## 💥💥💥 **`5/5` → `1/5` — ## OLTITA SO'ZNI ALMASHTIRIB.**

> ## 🔑 **VA MATNNING MA'NOSI ## UMUMAN O'ZGARMADI.**

> ## 🏆 **XULOSA:** ## kalit so'z detektori ## ⭐ **muallifni emas, USLUBNI** o'lchaydi. ## ## 💥 Uslubni esa **bir daqiqada** o'zgartirish mumkin.

---

## 5. ⚠️ Unda nima qilish kerak?

> ## 💥 **"AI YOZGANMI?" — NOTO'G'RI SAVOL.**

| Noto'g'ri savol | To'g'ri savol |
|---|---|
| *"Buni AI yozganmi?"* | ## ⭐ **"Bu da'vo to'g'rimi?"** |
| *"Bu ovoz haqiqiymi?"* | ## 🏆 **"Parol so'zini biladimi?"** |
| *"Bu sharh haqiqiymi?"* | ## ⭐ **"Xarid tasdiqlanganmi?"** |
| *"Bu rasm haqiqiymi?"* | ## 🏆 **"Manbasi bormi?"** |

> ## 🔑 **O'NG USTUNDAGI HAMMA SAVOL — ## ⭐ AI SIFATIGA BOG'LIQ EMAS.**

> ## 💡 **VA ULAR "YAXSHIROQ DETEKTOR" ## KUTMAYDI.**

### 🏆 Uchta amaliy qoida

```python
QOIDALAR = [
    ("MANBANI so'rang, matnni emas",
     "'Qayerdan bilasiz?' — AI javob bera olmaydi"),

    ("KANALNI tekshiring, mazmunni emas",
     "Qo'ng'iroqni O'ZINGIZ qaytaring — raqamni siz tanlang"),

    ("SHOSHILISHGA ishonmang",
     "Deepfake firibgarligining hammasi SHOSHILINCH"),
]
```

> ## 🏆🏆 **UCHINCHISI — ENG SAMARALISI.** ## ## 🔑 Gonkong holatida ham, ## ovoz klonlash holatlarida ham — ## ⭐ **umumiy belgi shoshilish** edi.

> ## 💡 **"5 DAQIQA KUTAMAN" — ## ⭐ ENG ARZON HIMOYA.**

---

## 6. ⚠️ Kursning boshqa savoli — **plagiat**

> *"Tahrirsiz AI insho topshirgan talaba... yoki AI yaratgan asar bilan
> tanlovda g'olib chiqqan rassom. **Chegara qayerda?**"*

> ## ⚠️ **KURS JAVOB BERMAYDI — VA BU TO'G'RI,** ## chunki javob ## ⭐ **kontekstga bog'liq**.

### 🏆 Lekin **bitta savol** ko'p holatni hal qiladi

> ## 💡 **"AGAR MEN AI ISHLATGANIMNI AYTSAM, ## NATIJA O'ZGARADIMI?"**

| Javob | Ma'nosi |
|---|---|
| ## **Yo'q** | ## ✅ **Muammo yo'q** — ayting va davom eting |
| ## **Ha** | ## 💥 **Aytishingiz SHART** |

> ## 🔑 **VA BU — SHAFFOFLIK SINOVI.** ## ## ⭐ U *"qancha AI ko'p"* degan ## 💥 **javobsiz savolni** ## chetlab o'tadi.

---

## 🎯 Nazorat savollari

1. AI detektori nega birinchi sinovda 100% berdi?
2. Haqiqiy model matnida natija qanday?
3. Detektorni aldash uchun qancha mehnat kerak bo'ldi?
4. Deepfake firibgarligiga qarshi eng arzon himoya nima?

<details>
<summary>Javoblar</summary>

1. ## Chunki **men "AI namunalarini" detektorning o'z kalit so'zlari bilan yozgan edim**. 💥 Bu — **doiraviy sinov**, u hech narsani isbotlamaydi.
2. ## **2/6 topildi, aniqlik 67%.** ⭐ Yolg'on bayroq **yo'q** *(0/6)*, lekin 💥 **4 tadan 3 tasi o'tib ketdi**.
3. ## **Oltita so'zni almashtirish** — `5/5` dan `1/5` ga. 🔑 Matnning **ma'nosi o'zgarmadi**. 🏆 Kalit so'z detektori **muallifni emas, uslubni** o'lchaydi.
4. ## **Oilaviy parol so'zi** va **shoshilishga ishonmaslik.** ⭐ Parol so'zi `90%` samarali bo'lsa, himoyasiz ulush `17.5%` → `1.75%`. 💡 Ikkalasi ham **deepfake sifatiga umuman bog'liq emas**.

</details>

---

⬅️ [2-dars](02-Human-AI-Collaboration.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
