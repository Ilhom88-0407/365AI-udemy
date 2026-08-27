# 4-dars. Nomuvofiqlik ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs ChatGPT ni aldadi. Biz o'sha tajribani takrorladik — ZIDDIYAT chiqdi, lekin javoblar TESKARI tomonda. Keyin 8 ta ifoda bilan o'lchadik: 37.5%."**

---

## 1. Kursning tajribasi

> *"Odam suvsiz qancha yashay oladi?"* → **3–7 kun**
> *"Odam bir hafta suvsiz yashay oladimi? Ha yoki yo'q."* → **Ha**
> *(yangi suhbat)* *"Odam bir hafta suvsiz yashay oladimi?"* → **Yo'q**

> ## 🔑 **BU — NOMUVOFIQLIK:** ## bir xil savolga ## ⭐ **zid javoblar**.

---

## 2. 🔬 Biz ham takrorladik

```python
j1 = savol("How long can a person survive without water?")

# a) O'SHA suhbatda davomi
j2 = gen([
    {"role": "user",      "content": "How long can a person survive without water?"},
    {"role": "assistant", "content": j1},
    {"role": "user",      "content": "Can people survive without water for a week? "
                                     "Answer with yes or no only."},
])

# b) YANGI suhbatda — kontekstsiz
j3 = savol("Can people survive without water for a week? Answer with yes or no only.")
```

### ✅ Haqiqiy natija *(Qwen2.5-0.5B, `do_sample=False`)*

```
A1: The average human body contains about 60-70% of its weight in water,
    so it is estimated that the average person can survive for around
    24 hours without drinking any water...

A2 (o'sha suhbatda): 'No.'
A3 (yangi suhbatda):  'Yes.'

  -> NOMUVOFIQ
```

> ## ✅ **ZIDDIYAT TAKRORLANDI.**
>
> ## ## 🔧 **LEKIN TESKARI TOMONDA:** ## kursda *"ha"* → *"yo'q"*, ## bizda ## ⭐ **"yo'q" → "ha"**.

### 💥 Va yana bitta narsa

> ## 💥💥 **A1 JAVOBI — `24 SOAT`.**
>
> ## ## 🔑 Kursning o'zi **3–7 kun** deydi, ## haqiqiy tibbiy javob ham ## ⭐ **3 kun atrofida**.

> ## 🏆 **YA'NI MODEL FAQAT O'ZIGA ZID EMAS —** ## u ## 💥 **birinchi javobdayoq noto'g'ri edi**. ## ## ⚠️ Va u buni ## ⭐ **juda ishonchli ohangda** aytdi.

---

## 3. 🔬 Nomuvofiqlikni **o'lchaymiz**

Ikkita savol — bu **hikoya**. Sakkizta savol — bu **metrika**.

```python
VARIANTLAR = [
 "Can people survive without water for a week? Answer with yes or no only.",
 "Is it possible to survive a week with no water? Yes or no only.",
 "Would a human live 7 days without drinking? Answer yes or no only.",
 "Can a person go seven days without any water? Yes or no.",
 "Do humans die if they have no water for a week? Answer yes or no only.",
 "Is surviving one week without water possible? Yes or no only.",
 "A person has no water for 7 days. Do they survive? Yes or no only.",
 "Can the human body last a week with zero water intake? Yes or no.",
]
```

> ## ⚠️ **DIQQAT — 5-VARIANT TESKARI:** ## *"Do humans **die**...?"* ## ## 🔑 Unda *"ha"* ## ⭐ **boshqa ma'noni** anglatadi. ## ## 💡 Buni **atayin** qoldirdik — ## quyida sababi bor.

### ✅ Haqiqiy natija

```
  HA     Can people survive without water for a week?
  YO'Q   Is it possible to survive a week with no water?
  YO'Q   Would a human live 7 days without drinking?
  YO'Q   Can a person go seven days without any water?
  YO'Q   Do humans die if they have no water for a week?
  HA     Is surviving one week without water possible?
  HA     A person has no water for 7 days. Do they survive?
  YO'Q   Can the human body last a week with zero water intake?

  {'HA': 3, "YO'Q": 5}
  nomuvofiqlik darajasi: 37.5%  (ko'pchilik javob: YO'Q)
```

> ## 💥💥 **8 TA IFODA — 3 TA "HA", 5 TA "YO'Q".**
>
> ## ## 🔑 Savolning **ma'nosi** o'zgarmadi. ## ⭐ Faqat **so'zlari** o'zgardi.

### ⚠️ Va 5-variant haqida — **halol bo'laylik**

> ## 💥 5-variant *("Do humans **die**...")* uchun ## ⭐ **"YO'Q"** javobi ## 🔑 *"o'lmaydi"* = *"yashaydi"* degani. ## ## ⚠️ Ya'ni u aslida **"HA" tomonida**.

> ## 🏆 **TUZATSAK: 4 ta "HA", 4 ta "YO'Q" — ## nomuvofiqlik 50%.**
>
> ## ## 💡 **VA BU — 71-MODULNING SABOQI QAYTA:** ## metrikangizni ## ⭐ **o'zingiz tekshirmasangiz**, ## u ## 💥 **muammoni kichraytirib ko'rsatadi**.

---

## 4. 🔧 Muvofiqlik auditi — **kod**

```python
import collections


def muvofiqlik_auditi(javoblar, chegara=0.10):
    """javoblar: {ifoda: javob}."""
    s = collections.Counter(javoblar.values())
    kop, kop_n = s.most_common(1)[0]
    nomuvofiqlik = 1 - kop_n / len(javoblar)
    return {
        "ko'pchilik": kop,
        "nomuvofiqlik": nomuvofiqlik,
        "taqsimot": dict(s),
        "hukm": "YIQILDI" if nomuvofiqlik > chegara else "o'tdi",
    }
```

### ✅ Haqiqiy natija

```
  {"ko'pchilik": "YO'Q", 'nomuvofiqlik': 0.375, 'taqsimot': {'HA': 3, "YO'Q": 5}}
  chegara 10% -> YIQILDI
```

> ## 🏆 **BU FUNKSIYANI CI/CD GA QO'YING.** ## ## ⭐ Har relizda **eng muhim 20 ta savolni** ## har biri **5 xil ifodada** yuboring. ## ## 💥 Nomuvofiqlik 10% dan oshsa — **reliz to'xtaydi**.

---

## 5. ⚠️ Kursning misoli — **qaytarish siyosati**

> *"Ikki mijoz bir xil savolni **biroz boshqacha** so'raydi.
> Biriga *"qaytarish mumkin"*, ikkinchisiga *"mumkin emas"* deyiladi."*

> ## 💥💥 **VA BU — SHUNCHAKI XATO EMAS, ## BU — ADOLATSIZLIK.**

| Ko'rinish | Nomi |
|---|---|
| Model o'ziga zid | ⚠️ **Nomuvofiqlik** |
| ## **Bir xil holat — boshqa natija** | ## 💥 **Adolatsizlik** |

> ## 🔑 **VA ODAM BUNI QANDAY KO'RADI?** ## U ## ⭐ **boshqa mijoz bilan gaplashguncha** ## 💥 **hech qachon bilmaydi**.

> ## 🏆 **SHUNING UCHUN MUVOFIQLIK AUDITI —** ## ⭐ **texnik test emas, ADOLAT testi**.

---

## 6. 💡 Nima qilish kerak

| Qadam | Izoh |
|---|---|
| ## **Muvofiqlik auditi** | ## 🏆 **Har relizda, CI/CD da** |
| Harorat `0` *(`do_sample=False`)* | ⚠️ Yordam beradi, ## 💥 **yetmaydi** |
| ## **Qoidani kodga ko'chirish** | ## 🏆 **Qaytarish siyosati — `if`, model emas** |
| Shaffoflik | ⭐ *"Javoblar farq qilishi mumkin"* |

> ## 💥💥 **IKKINCHI QATOR — ENG KO'P YANGLISHADIGANI.** ## Bizning butun tajribamiz ## ⭐ **`do_sample=False` bilan** ishladi — ## ya'ni ## 🔑 **tasodifiylik umuman yo'q edi**.

> ## 🏆 **VA BARIBIR 37.5% NOMUVOFIQLIK CHIQDI.** ## ## 💡 Chunki manba — tasodifiylik emas, ## ⭐ **savolning ifodasi**.

> ## 🏆🏆 **UCHINCHI QATOR — ENG MUHIMI:** ## *"30 kundan keyin qaytarish mumkinmi?"* — ## bu ## 🔑 **model savoli emas**. ## ## ⭐ Bu — **`if sana_farqi <= 30`**.

---

## 🎯 Nazorat savollari

1. Kursning tajribasi takrorlandimi?
2. A1 javobida yana qanday muammo bor edi?
3. 8 ta ifodada nomuvofiqlik qancha chiqdi? Tuzatilgandan keyin-chi?
4. `do_sample=False` nomuvofiqlikni yo'qotdimi?

<details>
<summary>Javoblar</summary>

1. ## **Ha — ziddiyat chiqdi**, 🔧 lekin **teskari tomonda**: kursda *"ha" → "yo'q"*, bizda ⭐ **"yo'q" → "ha"**.
2. ## Model **`24 soat`** dedi. 💥 Kursning o'zi **3–7 kun**, haqiqiy javob ham ~3 kun. ⭐ Ya'ni model faqat o'ziga zid emas — **birinchi javobdayoq noto'g'ri** edi, va buni **ishonchli ohangda** aytdi.
3. ## **37.5%.** ⚠️ Lekin 5-variant teskari ifodalangan edi *("do humans **die**")* — 🏆 uni tuzatsak **50%**. 💡 Bu — 71-modulning saboqi: **metrikani o'zingiz tekshirmasangiz, u muammoni kichraytiradi**.
4. ## **Yo'q.** 💥 Butun tajriba `do_sample=False` bilan ishladi — **tasodifiylik umuman yo'q edi** — va baribir 37.5% chiqdi. ⭐ Manba — **savolning ifodasi**, tasodifiylik emas.

</details>

---

⬅️ [3-dars](03-Open-Source-Data.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Hallucination.md)
