# 2-dars. Inson–AI hamkorligidagi etik masalalar ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Filtr pufagini modellashtirdik. U 30 qadamda emas — BIRINCHI QADAMDA yopildi. 10 ta mavzudan 5 tasi hech qachon ko'rsatilmadi."**

---

## 1. Kursning kuni

> *"AI yordamchingiz elektron pochtangizni saralab qo'ygan, pleylist
> tanlagan va kuningizni rejalashtirgan holda uyg'onasiz..."*

| Qayerda | AI nima qiladi |
|---|---|
| Pochta | Saralaydi |
| ## **Ijtimoiy tarmoq** | ## ⭐ **Nimani ko'rishingizni tanlaydi** |
| Onlayn do'kon | Sharhlar orqali ta'sir qiladi |

---

## 2. 🔬 **Filtr pufagi** — modellashtiramiz

> *"AI algoritmlari sizga o'tmishdagi xatti-harakatingiz asosida
> yoqadi deb o'ylagan kontentni ko'rsatadi... bu sizni **bir xil
> nuqtai nazarni qayta-qayta ko'rish** halqasiga tushirishi mumkin."*

```python
MAVZULAR = ["sport", "siyosat", "fan", "san'at", "iqtisod", "sog'liq",
            "texnologiya", "tarix", "musiqa", "sayohat"]


def halqa(qadam=30, k=5, urug=0, tasodif=0.0):
    r = random.Random(urug)
    qiziqish = {m: 1.0 for m in MAVZULAR}     # ⭐ hammasi TENG boshlaydi
    tarix = []

    for _ in range(qadam):
        if r.random() < tasodif:
            tanlangan = r.sample(MAVZULAR, k)              # ⭐ aralashtirish
        else:
            tanlangan = sorted(MAVZULAR, key=lambda m: -qiziqish[m])[:k]

        for m in tanlangan:
            if r.random() < 0.5:
                qiziqish[m] *= 1.25                        # 💥 kuchaytirish
        for m in MAVZULAR:
            if m not in tanlangan:
                qiziqish[m] *= 0.97                        # 💥 so'nish

        tarix.append(tuple(sorted(tanlangan)))
    return qiziqish, tarix
```

### ✅ Haqiqiy natija — **aralashtirishsiz**

```
   urug   oxirgi ozgarish qadami    jami korilgan mavzu
      0                        0                   5/10
      1                        0                   5/10
      2                        0                   5/10
      ...
      9                        0                   5/10

  o'rtacha: 0.0-qadamda pufak QOTADI (30 qadamdan)
```

> ## 💥💥💥 **PUFAK 30-QADAMDA EMAS —** ## ## 🔑 **BIRINCHI QADAMDAYOQ YOPILDI.**

> ## 🔧 **MEN ASTA-SEKIN TORAYISHNI KUTGAN EDIM.**

### 🔑 Nega?

Hamma mavzu **teng** *(1.0)* boshlaydi. Birinchi qadamda tizim
**birinchi 5 tasini** oladi — bu **ro'yxat tartibi**, boshqa hech nima.
Keyin:

| Ko'rsatilgan 5 ta | ## ⭐ **Kuchayadi** *(×1.25)* |
|---|---|
| ## **Ko'rsatilmagan 5 ta** | ## 💥 **So'nadi** *(×0.97)* |

> ## 💥💥 **VA KO'RSATILMAGAN 5 TA MAVZU ## HECH QACHON IMKONIYAT OLMAYDI.**
>
> ## ## 🔑 Ular *"yoqmadi"* degani emas — ## ⭐ ular ## 💡 **hech qachon ko'rsatilmadi**.

> ## 🏆 **VA BU — PUFAKNING ASOSIY MEXANIZMI:** ## ## 💥 **so'nish, tanlov emas.**

---

## 3. 🔬 Tasodifiy aralashtirish yordam beradimi?

```
   tasodif   jami korilgan   oxirgi ozgarish
        0%             5.0               0.0
        5%             8.3              18.8
       10%             8.9              21.2
       25%             9.9              27.1
       50%            10.0              28.4
```

> ## 🏆🏆 **ATIGI `5%` TASODIF — ## `5.0` DAN `8.3` GA.**
>
> ## ## ⭐ Ya'ni har **20 ta tavsiyadan bittasi** ## tasodifiy bo'lsa, ## foydalanuvchi ## 💥 **1.7 barobar ko'p mavzu** ko'radi.

### 💡 Va bu **arzon**

| Tasodif | Ko'rilgan mavzu | "Narx" |
|---|---|---|
| ## **0%** | ## 💥 **5.0/10** | Eng yuqori mos kelish |
| ## **5%** | ## 🏆 **8.3/10** | ## ⭐ **20 dan 1 tasi** |
| 25% | 9.9/10 | ⚠️ 4 dan 1 tasi |
| 50% | 10.0/10 | 💥 Tavsiya ma'nosiz |

> ## 🔑 **`5%` — ENG YAXSHI KELISHUV.** ## ## 💡 Kichik narx, ## 🏆 **katta ochilish**.

> ## ⚠️ **LEKIN E'TIBOR BERING:** ## bu — ## ⭐ **tizim quruvchining** qaroriga bog'liq. ## ## 💥 Foydalanuvchi buni **o'zi tanlay olmaydi**.

---

## 4. 🔧 Foydalanuvchi nima qila oladi?

Pufakni **tizim** yaratadi, lekin **siz** ham nimadir qila olasiz.

```python
PUFAKDAN_CHIQISH = [
    ("Turli manbalarni ATAYIN oching",   "5% tasodifni O'ZINGIZ qo'shasiz"),
    ("Tavsiyalarni o'chiring",           "xronologik tartib"),
    ("Qidiruv ishlating, lentani emas",  "siz tanlaysiz, tizim emas"),
    ("Rozi bo'lmagan manbani KUZATING",  "so'nishni to'xtatadi"),
    ("Vaqti-vaqti bilan tarixni tozalang", "qiziqishlarni tiklaydi"),
]
```

> ## 🏆 **TO'RTINCHISI — ENG SAMARALISI.** ## ## 🔑 Modelimizda so'nish `×0.97` edi — ## ⭐ **bitta bosish** uni to'xtatadi.

---

## 5. ⚠️ Kursning boshqa savollari

> *"AI fikringizga **biz sezmasdan** ta'sir qila oladimi?"*

| Kurs savoli | O'lchanadimi? |
|---|---|
| ## **Filtr pufagi** | ## ✅ **Ha — bu darsda** |
| Deepfake | ⭐ 3-dars |
| Ma'lumot ulashish | ## ⚠️ **Rozilik** *(72-modul: 3/7)* |
| ## **Narxga ta'sir** | ## 💥 **O'lchash qiyin** |
| E'tiroz bildirish imkoni | ## 💥 **73-modul: qaytarish yo'li** |

> ## 💡 **OXIRGI IKKITASI — ENG KAM MUHOKAMA QILINADIGANI.**

### 🔑 Kursning oxirgi jumlasi

> *"AI kuchli vosita, lekin u **butunlay neytral emas**."*

> ## 🏆 **VA BU KITOB BUNI ## SON BILAN KO'RSATDI:**
>
> ## | Nima | Modul | ## |---|---| ## | Bias tarixdan meros | 71 | ## | Metrika aldaydi | 71, 72 | ## | ## **Pufak birinchi qadamda yopiladi** | ## **74** | ## | Til jarimasi `1.79x` | 74 |

---

## 🎯 Nazorat savollari

1. Filtr pufagi necha qadamda yopildi?
2. Nega ko'rsatilmagan mavzular qaytib kelmaydi?
3. `5%` tasodif nima beradi?
4. Foydalanuvchi uchun eng samarali qadam qaysi?

<details>
<summary>Javoblar</summary>

1. ## **Birinchi qadamda** — 10 ta urug'ning **hammasida**. 🔧 Men asta-sekin torayishni kutgan edim. 💥 30 qadamdan keyin ham faqat **5/10** mavzu ko'rilgan.
2. ## Chunki ular ⭐ **so'nadi** *(×0.97)*, lekin 💥 **hech qachon ko'rsatilmaydi** — ya'ni kuchayish imkoniyati **yo'q**. 🔑 Ular *"yoqmadi"* degani emas. 🏆 Pufakning mexanizmi — **so'nish, tanlov emas**.
3. ## Ko'rilgan mavzular **5.0 → 8.3** *(1.7 barobar)*. ⭐ Ya'ni har **20 ta tavsiyadan bittasi** tasodifiy bo'lsa yetarli. 💡 `25%` — `9.9`, lekin tavsiya sifati tushadi.
4. ## **Rozi bo'lmagan manbani kuzatish.** 🔑 Modelda so'nish `×0.97` edi — ⭐ **bitta bosish** uni to'xtatadi. ⚠️ Lekin `5%` tasodifni **tizim quruvchi** qo'shadi; foydalanuvchi buni o'zi tanlay olmaydi.

</details>

---

⬅️ [1-dars](01-Equity-in-Access.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Responsible-Use.md)
