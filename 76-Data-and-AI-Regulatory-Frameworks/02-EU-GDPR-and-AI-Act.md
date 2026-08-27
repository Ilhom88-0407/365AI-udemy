# 2-dars. EI: GDPR va AI Act ⭐⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"AI Act tasniflagichini yozdik va O'Z ilovamizni o'tkazdik. Natija: YUQORI XAVF, 8 ta talabdan 2 tasi bajarilgan. EU da ishga tushirib bo'lmaydi."**

---

## 1. 🔬 Cambridge Analytica — **87 mln qanday chiqadi?**

> *"2016-yilda Cambridge Analytica shaxsiyat testi ilovasi orqali
> millionlab Facebook foydalanuvchisidan ma'lumot to'pladi. U test
> ishtirokchilaridan ma'lumot oldi **va ularning DO'STLARI**
> profillariga kirdi. Jami **87 mln** foydalanuvchi ma'lumoti
> **rozilikSIZ** olindi."*

Arifmetikasini tekshiramiz.

```python
for kviz in (100_000, 270_000, 300_000):
    for dost in (200, 320, 400):
        print(kviz, dost, kviz * dost)
```

### ✅ Haqiqiy natija

```
   so'rovnoma to'ldirgan   o'rtacha do'st      jami qamrov
                 100,000              320       32,000,000
                 270,000              200       54,000,000
                 270,000              320       86,400,000  <-- ~87 mln
                 270,000              400      108,000,000
                 300,000              320       96,000,000
```

> ## 💥💥💥 **270 000 × 320 = 86.4 MLN.**
>
> ## ## 🔑 **KUCHAYTIRISH KOEFFITSIENTI: ~322x.**

> ## 🏆 **VA MANA GDPR NING TUG'ILISH SABABI:** ## ## ⭐ **270 000 odam rozilik berdi.** ## ## 💥 **87 mln odam bermadi.**

### 💡 Va bu — bizning kitobimizdagi naqsh

| Modul | O'xshash topilma |
|---|---|
| 70-modul | ## 💥 **Ism o'chirilgan — 159/200 aniqlandi** |
| ## **76-modul** *(bu dars)* | ## 💥 **270k rozilik — 87 mln ta'sir** |

> ## 🔑 **IKKALASI HAM BIR XIL NARSANI KO'RSATADI:** ## ## ⭐ **ma'lumot yolg'iz turmaydi** — ## u **bog'langan**.

---

## 2. 🔬 EU AI Act — **tasniflagichni yozamiz**

Kurs uchta toifani sanaydi. Amaldagi qonunda **to'rtinchisi** ham bor —
**shaffoflik majburiyati**.

```python
TAQIQLANGAN = [
    "ijtimoiy ball (social scoring)",
    "xatti-harakatni manipulyatsiya qilish",
    "real vaqtda ommaviy joyda biometrik identifikatsiya",
    "ish joyida yoki maktabda emotsiyani aniqlash",
]

YUQORI_XAVF_SOHA = [
    "yollash va xodim tanlash",          # 💥 BIZNING ILOVA
    "ta'limga qabul va baholash",
    "kredit qobiliyatini baholash",
    "tibbiy vosita",
    "kritik infratuzilma",
    "huquqni muhofaza qilish",
    "migratsiya va chegara",
    "sud va demokratik jarayonlar",
]


def ai_act_tasnifi(tizim):
    if tizim.get("taqiqlangan_amaliyot"):
        return "TAQIQLANGAN", ["Ishlatib bo'lmaydi"]

    if tizim.get("soha") in YUQORI_XAVF_SOHA:
        return "YUQORI XAVF", [
            "xavf boshqaruv tizimi",
            "ma'lumot boshqaruvi (bias tekshiruvi)",
            "texnik hujjatlar",
            "avtomatik jurnal (logging)",
            "foydalanuvchiga aniq ko'rsatma",
            "INSON NAZORATI",
            "aniqlik, mustahkamlik, kiberxavfsizlik",
            "muvofiqlik baholovi (conformity assessment)",
        ]

    if tizim.get("odam_bilan_muloqot") or tizim.get("kontent_yaratadi"):
        return "SHAFFOFLIK MAJBURIYATI", [
            "foydalanuvchi AI bilan gaplashayotganini BILSIN",
            "AI yaratgan kontent BELGILANSIN",
        ]

    return "MINIMAL XAVF", ["majburiy talab yo'q"]
```

### ✅ Haqiqiy natija

```
  spam filtri                -> MINIMAL XAVF             (1 ta talab)
  mijoz chatboti             -> SHAFFOFLIK MAJBURIYATI   (2 ta talab)
  rasm generatori            -> SHAFFOFLIK MAJBURIYATI   (2 ta talab)
  kredit skoringi            -> YUQORI XAVF              (8 ta talab)
  BIZNING ilova (yollash)    -> YUQORI XAVF              (8 ta talab)
  ijtimoiy ball tizimi       -> TAQIQLANGAN
```

> ## 💥💥 **BIZNING ILOVA — YUQORI XAVF.**
>
> ## ## 🔑 Chunki **yollash** — ## ⭐ AI Act ning **aniq nomlangan** sohasi.

---

## 3. 💥 Sakkizta talab — **bajardikmi?**

68–75-modullardagi o'lchovlarimizga qaraymiz.

```
  OK  xavf boshqaruv tizimi                      [73-modul: reyestr]
  BAD ma'lumot boshqaruvi (bias tekshiruvi)      [71-modul: qilinmagan]
  BAD texnik hujjatlar                           [72-modul: karta 1/8]
  OK  avtomatik jurnal (logging)                 [73-modul]
  BAD foydalanuvchiga aniq ko'rsatma
  BAD INSON NAZORATI                             [73-modul: quvvat yetmadi]
  BAD aniqlik, mustahkamlik, kiberxavfsizlik     [72-modul: 37.5% nomuvofiq]
  BAD muvofiqlik baholovi (conformity assessment)

  2/8 = 25%
  -> EU da ISHGA TUSHIRIB BO'LMAYDI
```

> ## 💥💥💥 **2/8.**
>
> ## ## 🔑 Va har `BAD` — ## ⭐ **oldingi modulda O'LCHANGAN** ## kamchilik.

> ## 🏆 **YA'NI AI Act ALOHIDA ISH TALAB QILMAYDI —** ## u ## 💡 **68–75-modullarda qilishimiz kerak bo'lgan ishni** ## 💥 **majburiy** qiladi.

---

## 4. 🔬 GDPR — **bizning ilova**

```
  BAD aniq rozilik olish              [72-modul: 3/7]
  BAD saqlash muddatini cheklash
  BAD kirish huquqi (access)
  BAD tuzatish huquqi (rectification)
  BAD o'chirish huquqi (erasure)      [75-modul: promptni o'chirib bo'lmaydi]
  BAD buzilish haqida xabar berish
  BAD ma'lumot minimallashtirish      [70-modul: hamma maydon yig'ilgan]
  OK  maqsadni cheklash

  1/8 = 12%
```

> ## 💥💥 **1/8 — VA YAGONA `OK` ## ENG OSONI.**

### 🔑 Uchta eng qiyin talab

| Talab | Nega qiyin |
|---|---|
| ## **O'chirish huquqi** | ## 💥 Model **o'qigan** narsani unutmaydi |
| ## **Ma'lumot minimallashtirish** | ## 💥 *"Ehtimol keyin kerak bo'lar"* vasvasasi |
| Tuzatish huquqi | ⚠️ Model qayta o'qitilishi kerak |

> ## 💡 **BIRINCHISI — ENG CHUQUR MUAMMO.** ## Foydalanuvchi ma'lumotini ## ⭐ **bazadan o'chirish** oson. ## ## 💥 **Modeldan o'chirish — deyarli imkonsiz.**

> ## 🏆 **VA SHUNING UCHUN 70-MODULDAGI QOIDA MUHIM:** ## ## ⭐ **ma'lumotni yig'MASLIK** — ## keyin o'chirishdan **arzonroq**.

---

## 5. ⚠️ Kursning ijtimoiy ball muhokamasi

> *"EI ijtimoiy ball beruvchi AI ni **qabul qilib bo'lmaydigan xavf**
> deb hisoblaydi... Lekin ko'pchilik ijtimoiy kredit tizimini
> **javobgarlik va ishonchni** rag'batlantiruvchi samarali vosita
> deb biladi."*

> ## ⚠️ **KURS BU YERDA IKKALA TOMONNI BERADI —** ## va bu ## ⭐ **to'g'ri yondashuv**, ## chunki bu ## 🔑 **texnik emas, qadriyat masalasi**.

### 🏆 Lekin bitta narsa **texnik**

| Savol | Javob |
|---|---|
| Ball **qanday** hisoblanadi? | ## ⭐ 73-modul: **tushuntirish** |
| Xato bo'lsa **nima bo'ladi**? | ## 🏆 **73-modul: qaytarish yo'li** |
| Guruhlar **teng** baholanadimi? | ## ⭐ 69-modul: adolat metrikalari |

> ## 💡 **UCHALA SAVOL — QADRIYATDAN QAT'I NAZAR** ## javob talab qiladi. ## ## 🔑 Va 73-modulda o'lchagan edik: ## 💥 **bizning ilovamizda "qaytarish yo'li" YO'Q**.

---

## 🎯 Nazorat savollari

1. `87 mln` raqami qanday chiqadi?
2. Bizning ilova AI Act bo'yicha qaysi toifada?
3. 8 ta talabdan nechtasi bajarilgan? Ular qayerda o'lchangan?
4. GDPR ning eng qiyin talabi qaysi?

<details>
<summary>Javoblar</summary>

1. ## **270 000 × 320 = 86.4 mln.** ⭐ 270 ming odam so'rovnomani to'ldirdi, 💥 **87 mln — ularning DO'STLARI**, rozilik bermagan. 🔑 Kuchaytirish koeffitsienti **~322x**.
2. ## **YUQORI XAVF** — chunki **yollash** AI Act da 🔑 **aniq nomlangan** soha. 8 ta majburiy talab.
3. ## **2/8** *(xavf reyestri va jurnal)*. 🔑 Har `BAD` — ⭐ **oldingi modulda o'lchangan** kamchilik: bias auditi *(71)*, model karta 1/8 *(72)*, inson nazorati *(73)*, 37.5% nomuvofiqlik *(72)*.
4. ## **O'chirish huquqi.** ⭐ Ma'lumotni **bazadan** o'chirish oson, 💥 **modeldan o'chirish — deyarli imkonsiz**. 🏆 Shuning uchun 70-modul qoidasi: **yig'maslik — o'chirishdan arzonroq**.

</details>

---

⬅️ [1-dars](01-Global-Overview.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-United-States.md)
