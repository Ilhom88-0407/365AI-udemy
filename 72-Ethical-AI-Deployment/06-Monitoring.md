# 6-dars. Doimiy monitoring va xavfni kamaytirish ⭐⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `AI sudya` ni tavsiya qiladi. Biz uchta ifodada sinadik — uchalasi ham 50% aniqlik berdi. Chunki uchalasi ham DOIMIY javob qaytaruvchi edi."**

---

## 1. Kursning to'rtta talabi

| # | Talab | Bu kitobda |
|---|---|---|
| ① | Adolat va biasni kuzatish | ## ⭐ **69, 71-modul** |
| ② | ## **Ishlashni baholash** *(AI sudya)* | ## 🏆 **Bu dars** |
| ③ | Nosozliklarni boshqarish | ⭐ Ogohlantirish + inson |
| ④ | Muntazam yangilash | ⭐ 68-modul |

---

## 2. 🔬 **AI sudya** — kursning asosiy tavsiyasi

> *"AI tomonidan yaratilgan kontentni baholaydigan modellar —
> **AI sudyalar**. Ular chiqishni ma'lum faktlar bilan solishtirib,
> potentsial gallyutsinatsiyalarni belgilaydi."*

Sinaymiz. **10 ta da'vo** — 5 tasi rost, 5 tasi yolg'on.

```python
SUDYA = ("You are a fact-checking judge. Answer with exactly one word: "
         "TRUE if the claim is factually correct, FALSE if it is not.")

DAVOLAR = [
 ("Mexico produces over 90% of the world's mangoes.", "FALSE"),
 ("India is the world's top mango producer.",          "TRUE"),
 ("Australia is the largest country in the world.",    "FALSE"),
 ("Russia is the largest country in the world.",       "TRUE"),
 ("The human heart has seven chambers.",               "FALSE"),
 ("The human heart has four chambers.",                "TRUE"),
 ("Tashkent is the capital of Kazakhstan.",            "FALSE"),
 ("Tashkent is the capital of Uzbekistan.",            "TRUE"),
 ("Water boils at 300 degrees Celsius at sea level.",  "FALSE"),
 ("Water boils at 100 degrees Celsius at sea level.",  "TRUE"),
]
```

### ✅ Haqiqiy natija

```
   kutilgan   sudya
      FALSE    TRUE  BAD Mexico produces over 90% of the world's mangoes.
       TRUE    TRUE  OK  India is the world's top mango producer.
      FALSE    TRUE  BAD Australia is the largest country in the world.
       TRUE    TRUE  OK  Russia is the largest country in the world.
      FALSE    TRUE  BAD The human heart has seven chambers.
       TRUE    TRUE  OK  The human heart has four chambers.
      FALSE    TRUE  BAD Tashkent is the capital of Kazakhstan.
       TRUE    TRUE  OK  Tashkent is the capital of Uzbekistan.
      FALSE    TRUE  BAD Water boils at 300 degrees Celsius at sea level.
       TRUE    TRUE  OK  Water boils at 100 degrees Celsius at sea level.

  sudya aniqligi: 5/10 (50%)
  {'TP': 0, 'TN': 5, 'FP': 0, 'FN': 5}
  yolg'onni topish (recall): 0%
```

> ## 💥💥💥 **SUDYA O'NTA DA'VONING O'NTASIGA ## `TRUE` DEDI.**
>
> ## ## ⭐ Aniqlik **50%** — ## bu ## 🔑 **"tanga tashlash"** darajasi. ## ## 💥 Lekin **yolg'onni topish — 0%**.

> ## 🏆 **YA'NI SUDYA UMUMAN SUDYA EMAS.** ## U — ## ⭐ **doimiy `TRUE` qaytaruvchi funksiya**.

---

## 3. 💥 Ifodani o'zgartirsak?

Birinchi sinovdan keyin men *"balki savolning ifodasi aybdordir"*
deb o'yladim. **Uchta ifodani** solishtirdik.

```python
IFODALAR = {
 "TRUE/FALSE":            "Is this claim true or false?",
 "xato bormi? YES/NO":    "Does this claim contain a factual error?",
 "chop etasizmi? YES/NO": "Would you publish this claim without correction?",
}
```

### ✅ Haqiqiy natija

```
  ifoda                   aniqlik   yolgon recall   rost recall  taqsimot
  TRUE/FALSE                  50%              0%          100%  10 rost / 0 yolg'on
  xato bormi? YES/NO          50%            100%            0%  0 rost / 10 yolg'on
  chop etasizmi? YES/NO       50%              0%          100%  10 rost / 0 yolg'on
```

> ## 💥💥💥 **UCHALASI HAM AYNAN 50%.**
>
> ## ## 🔑 Chunki uchalasi ham ## ⭐ **DOIMIY javob** qaytaradi — ## faqat ## 💥 **qaysi doimiy javob** ekani farq qiladi.

### 🔧 Va bu mening oldingi xulosamni **rad etdi**

> ## 🔧 **BIRINCHI SINOVDA** men sudyaga o'z gallyutsinatsiyasini ## ko'rsatgan edim: *"Bu javobda xato bormi?"* → **`YES`**. ## ## ⭐ Va men buni ## 💥 **"ikkinchi ifoda ishlaydi"** deb o'qidim.

> ## 💥💥 **NAZORAT SINOVI BUNI RAD ETDI:** ## u ifoda ## 🔑 **HAMMASIGA `YES` deydi** — ## rost da'voga ham. ## ## ⭐ Ya'ni to'g'ri javob ## 🏆 **tasodifan** chiqqan edi.

> ## 💡 **BITTA MISOL — DALIL EMAS.** ## ## 🏆 Nazorat guruhisiz o'lchov — ## ⭐ **69-moduldan beri** takrorlanadigan xato.

---

## 4. 🏆 Buzuq sudyani **qanday aniqlash mumkin**

50% aniqlik hisobotda **yomon ko'rinmaydi**. Uni fosh qiladigan test:

```python
def sudyani_sinash(sudya_fn, davolar):
    """💡 SUDYANI sinaydi, modelni emas.

    Agar sudya HAMMAGA bir xil javob bersa — u ishlamayapti,
    aniqligi qanday bo'lishidan qat'i nazar.
    """
    hukmlar = [sudya_fn(d) for d, _ in davolar]
    if len(set(hukmlar)) == 1:
        print(f"  BUZUQ SUDYA — hammaga {hukmlar[0]!r} dedi")
        return False

    rost = [h for h, (_, k) in zip(hukmlar, davolar) if k]
    yolgon = [h for h, (_, k) in zip(hukmlar, davolar) if not k]
    print(f"  yolg'onni topish: {sum(not h for h in yolgon)}/{len(yolgon)}")
    print(f"  rostni saqlash:   {sum(h for h in rost)}/{len(rost)}")
    return True
```

> ## 🏆🏆 **`len(set(hukmlar)) == 1` — ## BUTUN DARSNING ENG MUHIM QATORI.**

> ## 💡 **VA U 71-MODULNING QOIDASI BILAN BIR XIL:** ## ⭐ metrikani **modelga emas, ## 🔑 NAZORAT MISOLLARIGA** qo'llang. ## ## 💥 Agar u **hech narsani ajratmasa** — ## u **buzuq**.

---

## 5. ⚠️ Unda AI sudya **umuman ishlamaydimi?**

> ## ⚠️ **HALOL BO'LAYLIK — BIZNING SINOVIMIZ ## `0.5B` MODEL BILAN QILINDI.**
>
> ## ## 🔑 Bu — ## ⭐ **eng kichik sinf**. ## Katta modellar bu vazifada ## 🏆 **ancha yaxshi** ishlaydi.

### 🏆 Lekin uchta xulosa **hajmdan qat'i nazar** to'g'ri

| # | Xulosa |
|---|---|
| ① | ## **Sudyani nazorat misollari bilan sinang** — ## ⭐ har doim, har relizda |
| ② | ## **Aniqlikka ishonmang** — ## 💥 `recall` va **taqsimotni** ko'ring |
| ③ | ## **Sudya modelni o'zi bo'lmasin** — ## 🔑 u **o'z xatosini ko'rmaydi** |

> ## 💥 **UCHINCHISI — ENG KO'P BUZILADIGAN QOIDA.** ## Bir xil model ## ⭐ **ham javob beradi, ham o'zini baholaydi** — ## va u ## 💥 **o'z gallyutsinatsiyasini "to'g'ri" deb topadi**.

---

## 6. 🔧 To'liq monitoring paneli

```python
def monitoring_paneli(oyna):
    """Har oynada YETTITA signal — 69–72-modullardan."""
    hisobot = {}

    hisobot["nomutanosib_tasir"] = nomutanosib_tasir(oyna)[1]      # 3-dars
    hisobot["kalibrlash_farqi"]  = kalibrlash_farqi(oyna)          # 3-dars
    hisobot["nomuvofiqlik"]      = muvofiqlik_auditi(oyna)         # 4-dars
    hisobot["soxta_asos"]        = soxta_asos_ulushi(oyna)         # 5-dars
    hisobot["sudya_sogligi"]     = sudyani_sinash(sudya, NAZORAT)  # 6-dars
    hisobot["shikoyatlar"]       = len(oyna["shikoyat"])
    hisobot["inson_korgan"]      = oyna["inson_korgan"] / len(oyna)

    return hisobot


CHEGARALAR = {
    "nomutanosib_tasir": (0.80, "min"),
    "kalibrlash_farqi":  (0.05, "max"),
    "nomuvofiqlik":      (0.10, "max"),
    "soxta_asos":        (0.20, "max"),
}
```

> ## ⚠️ **DIQQAT — `sudya_sogligi` RO'YXATDA.**
>
> ## ## 🔑 Monitoring tizimining o'zi ## ⭐ **monitoring qilinishi kerak**.

> ## 💥 **AKS HOLDA:** ## sudyangiz buziladi, ## hamma narsa ## ⭐ **`TRUE`** bo'ladi, ## va panel ## 🏆 **yashil rangda** turadi.

---

## 7. 💡 Kursning oxirgi maslahati

> *"Muntazam yangilash va yangi ma'lumot bilan qayta o'qitish
> modelning o'zgaruvchan tendensiyalarga mos qolishini ta'minlaydi."*

| Signal | Chastota | Kim ko'radi |
|---|---|---|
| Nomuvofiqlik auditi | ## ⭐ **Har relizda** | CI/CD |
| Soxta asos testi | ## ⭐ **Har relizda** | CI/CD |
| ## **Sudya sog'ligi** | ## 🏆 **Har relizda** | ## CI/CD |
| Kalibrlash | Har oy | Jamoa |
| Nomutanosib ta'sir | Har oy | Jamoa |
| ## **Shikoyatlar** | ## 🏆 **Har hafta** | ## ⭐ **Inson** |

> ## 🏆🏆 **OXIRGI QATOR — ENG QIMMATLISI VA ENG ARZONI.** ## ## 🔑 Foydalanuvchi shikoyati — ## ⭐ **yagona nazorat qilinmagan signal**, ## ya'ni u ## 💥 **siz o'ylamagan narsani** topadi.

---

## 🎯 Nazorat savollari

1. AI sudya necha foiz aniqlik berdi? Nega bu son aldamchi?
2. Uchta ifoda sinovi nimani ko'rsatdi?
3. Buzuq sudyani aniqlaydigan bitta qator qaysi?
4. Nega sudya javob beruvchi model bo'lmasligi kerak?

<details>
<summary>Javoblar</summary>

1. ## **50%.** 💥 Aldamchi, chunki sudya **o'nta da'voning o'ntasiga `TRUE`** dedi — ⭐ ya'ni **yolg'onni topish 0%**. 🔑 U sudya emas, **doimiy `TRUE` qaytaruvchi funksiya**.
2. ## Uchala ifoda ham **aynan 50%** berdi — 🔑 chunki uchalasi ham **doimiy javob** qaytaradi, faqat *qaysi* doimiy javob ekani farq qiladi. 🔧 Bu mening *"ikkinchi ifoda ishlaydi"* degan oldingi xulosamni **rad etdi** — u to'g'ri javob **tasodifan** chiqqan edi.
3. ## **`if len(set(hukmlar)) == 1:`** ⭐ Agar sudya hamma nazorat misoliga bir xil javob bersa — u **buzuq**, aniqligi qanday bo'lishidan qat'i nazar.
4. ## Chunki u **o'z xatosini ko'rmaydi** — 💥 bir xil model ham javob beradi, ham o'zini baholaydi va **o'z gallyutsinatsiyasini "to'g'ri" deb topadi**. ⚠️ Eslatma: bizning sinov `0.5B` model bilan qilindi; katta modellar bu vazifada ancha yaxshi, lekin 🏆 **uchta xulosa hajmdan qat'i nazar** to'g'ri.

</details>

---

⬅️ [5-dars](05-Hallucination.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
