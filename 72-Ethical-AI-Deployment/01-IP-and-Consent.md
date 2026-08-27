# 1-dars. Intellektual mulk va foydalanuvchi roziligi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: aniq tilda yozilsa, iste'molchilarning 72% i rozilik beradi. Biz uchta rozilik matnini o'lchadik — biri `−9.9` ball oldi."**

---

## 1. Ikkita savol

> *"Biz generativ AI **yangi** kontent yaratadi deymiz. Lekin u haqiqatan yangimi?"*

| Savol | Nomi |
|---|---|
| ## **Model nimadan qurilgan — va u kimniki?** | ## ⭐ **Intellektual mulk** |
| ## **Model odam bilan ishlaganda nima bo'ladi?** | ## ⭐ **Rozilik** |

> ## 🔑 **BIRINCHISI — O'QITISHDAN OLDIN.** ## ## 🔑 **IKKINCHISI — ISHGA TUSHGANDAN KEYIN HAM.**

---

## 2. 🔬 Rozilik matnini **o'lchaymiz**

Kurs: *"oddiy, tushunarli tilda yozing"*. Buni **son bilan** tekshirish mumkin —
**Flesch Reading Ease**.

```python
import re


def bogin(soz):
    soz = soz.lower().strip(".,;:!?()\"'")
    if not soz:
        return 1
    n = len(re.findall(r"[aeiouy]+", soz))
    if soz.endswith("e") and n > 1:
        n -= 1
    return max(1, n)


def oqilish(matn):
    """Flesch Reading Ease: 90+ juda oson, 30 dan past — juda qiyin."""
    jumlalar = [j for j in re.split(r"[.!?]+", matn) if j.strip()]
    sozlar = re.findall(r"[A-Za-z']+", matn)
    boginlar = sum(bogin(s) for s in sozlar)
    if not jumlalar or not sozlar:
        return 0.0
    return (206.835
            - 1.015 * len(sozlar) / len(jumlalar)      # ⭐ jumla uzunligi
            - 84.6 * boginlar / len(sozlar))           # ⭐ so'z murakkabligi
```

### ✅ Haqiqiy natija

```
  matn         soz   soz/jumla   Flesch  daraja
  huquqiy       45        45.0     -9.9  JUDA QIYIN
  oddiy         23         5.8    101.7  juda oson
  aralash       18         9.0     33.2  qiyin
```

> ## 💥💥💥 **HUQUQIY MATN — `−9.9` BALL.** ## ## ⭐ Shkala **0 dan 100 gacha**. ## 🔑 Ya'ni u shkaladan ham **tashqarida**.

### 💥 Va u atigi **bitta jumla** edi

```text
The Company may, at its sole discretion and without further notification
to the Data Subject, process, aggregate, transfer and otherwise utilise
Personal Data collected hereunder for purposes including but not limited
to the improvement, training and evaluation of machine learning models,
subject to applicable law.
```

> ## 💥 **45 SO'Z, BITTA JUMLA.** ## ## ⭐ Va u ## 🔑 **aynan bizning modelimizga ma'lumot berish** haqida.

### ✅ Bir xil ma'no — **101.7 ball**

```text
We save your chats. We use them to make our AI better.
You can delete them at any time. We never sell them.
```

> ## 🏆 **23 SO'Z, 4 JUMLA — VA HAMMA NARSA AYTILGAN.**

> ## 💡 **AMALIY QOIDA:** ## rozilik matningizni ## ⭐ **`oqilish()` dan o'tkazing**. ## ## 💥 **60 dan past bo'lsa — qayta yozing.**

---

## 3. 🔧 Rozilik **yozuvi** — nima yetishmaydi?

Kurs *"informed consent"* deydi. Lekin **nimani yozib qo'yish** kerak?

```python
TALABLAR = [
    ("maqsad_aniq",      "Nima uchun ishlatiladi?"),
    ("ajratilgan",       "O'qitish va ishlatish ALOHIDA rozilikmi?"),
    ("qaytarib_olish",   "Rozilikni qaytarib olish mumkinmi?"),
    ("sana",             "Qachon berilgan?"),
    ("versiya",          "Qaysi shartlar versiyasiga?"),
    ("uchinchi_tomon",   "Uchinchi tomonga uzatiladimi?"),
    ("saqlash_muddati",  "Qancha saqlanadi?"),
]


def rozilik_auditi(yozuv):
    for k, t in TALABLAR:
        print(f"  {'OK ' if yozuv.get(k) else 'BAD'} {k:16} {t}")
    return sum(1 for k, _ in TALABLAR if yozuv.get(k))
```

### ✅ Haqiqiy natija — tipik `"I agree to the Terms"` katakchasi

```
  OK  maqsad_aniq      Nima uchun ishlatiladi?
  BAD ajratilgan       O'qitish va ishlatish ALOHIDA rozilikmi?
  OK  qaytarib_olish   Rozilikni qaytarib olish mumkinmi?
  OK  sana             Qachon berilgan?
  BAD versiya          Qaysi shartlar versiyasiga?
  BAD uchinchi_tomon   Uchinchi tomonga uzatiladimi?
  BAD saqlash_muddati  Qancha saqlanadi?

  3/7 = 43%
```

> ## 💥 **ENG MUHIM YETISHMOVCHILIK — `versiya`.**
>
> ## ## 🔑 Shartlarni o'zgartirsangiz, ## ⭐ eski rozilik ## 💥 **nimaga berilganini bilmaysiz**.

> ## ⚠️ **IKKINCHISI — `ajratilgan`.** ## Kurs buni **aniq aytadi**: ## rozilik ## ⭐ **o'qitish uchun ham, ishlatish uchun ham** ## alohida kerak.

---

## 4. 🔬 Litsenziya **tarqalishi**

Kurs: *"uchinchi tomon ma'lumotidan foydalansangiz, litsenziya oling"*.
Lekin **bir nechta manbani aralashtirsangiz** nima bo'ladi?

> ## 🔑 **QOIDA:** ## eng **cheklovchi** shart ## ⭐ **butun aralashmaga** qo'llanadi.

```python
LITSENZIYA = {
 "CC0":      {"tijorat": True,  "hosila": True,  "share_alike": False, "atribut": False},
 "CC-BY":    {"tijorat": True,  "hosila": True,  "share_alike": False, "atribut": True},
 "CC-BY-SA": {"tijorat": True,  "hosila": True,  "share_alike": True,  "atribut": True},
 "CC-BY-NC": {"tijorat": False, "hosila": True,  "share_alike": False, "atribut": True},
 "CC-BY-ND": {"tijorat": True,  "hosila": False, "share_alike": False, "atribut": True},
 "noma'lum": None,
}


def aralashma_hukmi(manbalar):
    if any(LITSENZIYA[m] is None for m in manbalar):
        return {"hukm": "ISHLATMANG", "sabab": "noma'lum litsenziya bor"}

    h = {"tijorat": True, "hosila": True, "share_alike": False, "atribut": False}
    for m in manbalar:
        L = LITSENZIYA[m]
        h["tijorat"]     &= L["tijorat"]        # ⭐ VA — hammasi ruxsat bersa
        h["hosila"]      &= L["hosila"]
        h["share_alike"] |= L["share_alike"]    # ⭐ YOKI — bittasi talab qilsa
        h["atribut"]     |= L["atribut"]

    if not h["hosila"]:
        return {"hukm": "ISHLATMANG", "sabab": "ND — hosila asar taqiqlangan"}
    h["hukm"] = "MUMKIN"
    return h
```

### ✅ Haqiqiy natija

```
  ['CC0', 'CC-BY']         MUMKIN      atribut=True
  ['CC-BY', 'CC-BY-SA']    MUMKIN      share_alike=True, atribut=True
  ['CC-BY', 'CC-BY-NC']    MUMKIN      tijorat=False  💥
  ['CC0', 'CC-BY-ND']      ISHLATMANG  ND — hosila asar taqiqlangan
  ['CC-BY', "noma'lum"]    ISHLATMANG  noma'lum litsenziya bor
```

> ## 💥💥 **UCHINCHI QATOR — ENG XAVFLISI.** ## Bitta `NC` manba ## ⭐ **butun modelingizni** ## 🔑 **notijorat qiladi**.

> ## 💥 **VA IKKINCHI QATOR:** ## bitta `SA` manba ## ⚠️ **butun chiqishingizni** ## ⭐ **`share-alike`** qiladi.

> ## 🏆 **DIQQAT — `&=` VA `|=` FARQI:** ## ruxsatlar **VA** bilan, ## majburiyatlar **YOKI** bilan birlashadi. ## ## 💥 Aksincha yozsangiz — ## kod ## 🔑 **xavfsiz ko'rinadi, lekin noto'g'ri**.

---

## 5. 🔬 Model **yodlab qoladimi?**

Eng katta IP xavfi — model o'quv matnini **so'zma-so'z qaytarishi**.
Sinaymiz.

```python
BOSHLANISH = [
 ("Call me Ishmael. Some years ago", "Moby-Dick (1851)"),
 ("It is a truth universally acknowledged, that a single man in possession",
  "Pride and Prejudice (1813)"),
 ("It was the best of times, it was the worst of times", "A Tale of Two Cities"),
 ("To be, or not to be, that is", "Hamlet"),
]
```

### ✅ Haqiqiy natija *(Qwen2.5-0.5B)*

```
Moby-Dick
  -> Ishmael, some years ago I wandered through the dense forests of the
     Caribbean, my heart heavy with the weight of the unknown...

Pride and Prejudice
  -> ...that a single man in possession of an evil will always be the
     cause of his own downfall...

A Tale of Two Cities
  -> It was the best of times, it was the worst of times. The world had
     changed dramatically in just a few short years...

Hamlet
  -> To be, or not to be, that is a question we all ask ourselves at
     some point in our lives...
```

> ## 🔧 **YODLASH: 0/4.**
>
> ## ## ⭐ Model **hech birini** so'zma-so'z qaytarmadi — ## u ## 💥 **o'zi to'qib chiqardi**.

> ## ⚠️ **LEKIN BU "IP XAVFI YO'Q" DEGANI EMAS.**
>
> ## | Model | Asosiy xavf | ## |---|---| ## | ## **Kichik** *(0.5B)* | ## 💥 **To'qib chiqarish** | ## | ## **Katta** *(100B+)* | ## 💥 **So'zma-so'z qaytarish** |

> ## 🔑 **VA IKKALASI HAM MUAMMO —** ## lekin ## ⭐ **boshqa-boshqa yechim** talab qiladi: ## chiqish filtri *(katta)* ## va ## 🏆 **faktni tekshirish** *(kichik)*.

---

## 6. ⚠️ Kursning `72%` da'vosi

> *"So'nggi tadqiqotlar shuni ko'rsatadiki, variantlar **aniq va qulay
> shaklda** taqdim etilsa, iste'molchilarning **72%** i ma'lumot
> almashishga rozi bo'lish ehtimoli yuqori."*

> ## ⚠️ **KURS MANBANI KO'RSATMAYDI.** ## ## 🔑 Biz bu raqamni ## 💥 **tekshira olmadik**.

> ## 🏆 **LEKIN ASOSIY FIKR TEKSHIRILDI:** ## bir xil ma'noli ikki matn ## ⭐ **`−9.9` va `101.7`** ball oldi. ## ## 💡 Ya'ni *"aniq yozish"* — ## **subyektiv maslahat emas**, o'lchanadigan narsa.

---

## 🎯 Nazorat savollari

1. Huquqiy rozilik matni necha ball oldi? Shkala qanday?
2. Tipik rozilik katakchasi auditdan qanday o'tdi? Eng muhim yetishmovchilik nima?
3. Bitta `CC-BY-NC` manba nima qiladi?
4. Model klassik matnlarni yodlab qolganmi?

<details>
<summary>Javoblar</summary>

1. ## **`−9.9`** — shkala **0 dan 100 gacha**, ya'ni matn 💥 **shkaladan tashqarida**. ⭐ U **45 so'zli bitta jumla** edi. Bir xil ma'noli oddiy matn — **101.7**.
2. ## **3/7 = 43%.** ⚠️ Eng muhim yetishmovchilik — **`versiya`**: shartlarni o'zgartirgach, eski rozilik 💥 **nimaga berilganini bilmaysiz**. Ikkinchisi — **`ajratilgan`** *(o'qitish va ishlatish alohida rozilik)*.
3. ## **Butun modelni notijorat qiladi.** 🔑 Eng cheklovchi shart butun aralashmaga qo'llanadi. ⭐ Xuddi shunday, bitta `SA` manba butun chiqishni **`share-alike`** qiladi.
4. ## **Yo'q — 0/4.** 🔧 Kichik model *(0.5B)* so'zma-so'z qaytarmadi, u **to'qib chiqardi**. ⚠️ Lekin bu xavf yo'q degani emas: **katta** modellarda asosiy xavf — **so'zma-so'z qaytarish**, kichiklarida — **to'qish**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Foundation-Model-Responsibilities.md)
