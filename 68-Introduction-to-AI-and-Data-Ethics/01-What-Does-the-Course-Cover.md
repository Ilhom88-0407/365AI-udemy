# 1-dars. Kurs nimalarni qamrab oladi ⭐

## 🎬 Boshlashdan oldin

> **"Oldingi olti modulda biz ishlaydigan LLM ilovasini qurdik. Bu bo'limda savol o'zgaradi: 'ishlaydimi?' emas, 'ishlatishga HAQLIMIZMI?'"**

---

## 1. Nega bu bo'lim **oxirida** turadi?

Kurs AI etikasini **oxirgi** bo'lim qilib qo'yadi. Bu — mantiqiy:

| Bo'lim | Savol |
|---|---|
| 62–64 | Model qanday tanlanadi? |
| 65–66 | Ilova qanday quriladi? |
| 67 | ## **Ishonchli** qanday qilinadi? |
| ## **68–76** | ## ⭐ **HAQLIMIZMI?** |

> ## 💡 **VA BU — TASODIF EMAS:** ## siz endi **nimani** qurayotganingizni bilasiz, ## shuning uchun **oqibatlarini** ham tushunasiz.

---

## 2. ⭐ Kurs nimalarni va'da qiladi

| Bo'lim | Modul | Mavzu |
|---|---|---|
| Kirish | 68 | AI hayot sikli, etika vs qonun |
| ## **Asosiy prinsiplar** | 69 | ## ⭐ **Maxfiylik, shaffoflik, javobgarlik, adolat** |
| Ma'lumot to'plash | 70 | Manbalar, bias, maxfiy ma'lumot |
| Ishlab chiqish | 71 | Belgilangan/belgilanmagan ma'lumot, RLHF |
| Joylashtirish | 72 | Gallyutsinatsiya, nomuvofiqlik, monitoring |
| Biznes | 73 | Shaffoflik, mas'uliyat |
| Shaxs | 74 | Tenglik, hamkorlik |
| ChatGPT | 75 | Maxfiylik, plagiat, ekologiya |
| ## **Regulyatsiya** | 76 | ## ⭐ **GDPR, EU AI Act, mintaqalar** |

> ## ⭐ **KURSDA `AI Ethics - Course Notes.pdf` (41 SAHIFA) ## VA `AI Lifecycle Infographic.pdf` HAM BOR.**

---

## 3. 🔬 Bu bo'limda **nima o'lchay olamiz?**

Etika — falsafa. Lekin **etik muammolarni** o'lchash mumkin.

| Muammo | O'lchov usuli | Qayerda |
|---|---|---|
| ## **Bias** | Demografik tenglik, 80% qoidasi | ## ⭐ **69-modul** |
| Maxfiylik | PII detektor, `k`-anonimlik | 70-modul |
| ## **Nomuvofiqlik** | Bir xil so'rov N marta | ## ⭐ **72-modul** |
| Gallyutsinatsiya | Faktlarni tekshirish | 72-modul |
| Shaffoflik | Model karta to'liqligi | 73-modul |
| Plagiat | O'xshashlik metrikasi | 75-modul |
| ## **Energiya** | Token → kVt·soat → CO₂ | ## ⭐ **75-modul** |

> ## 🏆 **VA MANA ASOSIY VA'DA:** ## bu bo'limda biz ## ⭐ **O'Z ILOVAMIZNI AUDIT QILAMIZ** — ## 66–67-modullarda qurgan intervyu vositasini.

---

## 4. 💥 Kurs keltirgan uchta hodisa

### ① Grok va Klay Thompson

> *"Grok basketbol jargonini noto'g'ri tushundi. `Throwing bricks` — basketbolda 'ko'p marta o'tkazib yubormoq' degani. Chatbot uni **so'zma-so'z** oldi va Thompson Sakramentodagi uylarni **haqiqiy g'isht bilan** buzgan deb yozdi."*

> ## 🔑 **BU — 67-MODULDAGI GALLYUTSINATSIYANING O'ZI,** ## faqat **omma oldida**.

### ② Greg Marston — ovoz klonlash

> *"2003-yilda britaniyalik ovoz aktyori IBM uchun yozuv qildi va shartnoma imzoladi. **Yillar keyin** u o'z ovozining AI klonini topdi — `Connor`. IBM huquqlarni ovoz klonlash kompaniyasiga sotgan edi."*

> ## 💥💥 **SHARTNOMA IMZOLANGANDA BU TEXNOLOGIYA MAVJUD EMAS EDI.**
>
> ## ## 🔑 **VA MANA ETIKANING ASOSIY MUAMMOSI:** ## rozilik **kelajakni qamrab ololmaydi**.

### ③ Clearview AI — $30 mln jarima

> *"Amerikalik yuz tanish kompaniyasi ijtimoiy tarmoqlardan **milliardlab rasmni** rozilliksiz yig'di... Fransiya, Italiya va Niderlandiya **$30 mln dan ortiq** jarima soldi."*

> ## 💰 **ETIKA — FAQAT AXLOQ EMAS, XARAJAT HAM.**

> ## ⚠️ **BU RAQAMLARNI MUSTAQIL TEKSHIRA OLMADIM** *(internet yo'q)*. ## ⭐ Kursning ma'lumoti sifatida keltirilgan.

---

## 5. ⭐ Kursning asosiy metaforasi

> *"Nemis sotsiologi Ulrich Bek aytgan edi: **etika bugungi kunda kontinentlararo samolyotdagi velosiped tormozi rolini o'ynaydi**."*

> ## 💡 **YA'NI:** ## texnologiya **samolyot tezligida**, ## etika esa — **velosiped tormozi**.

### 🔑 Va bu — biz o'lchagan narsa bilan bog'liq

| 67-modulda ko'rdik | Etik ma'nosi |
|---|---|
| Injection 3/4 o'tdi | ## 💥 Nomzod **o'ziga baho qo'ydi** |
| CoT 6/6 → 2/6 | ## ⚠️ *"Eng yaxshi amaliyot"* — **ishlamadi** |
| Zaxira: LLM 0/6 | ## ⭐ Foydalanuvchi **bilmaydi** |

> ## 🔑 **OXIRGI QATOR — ENG QIZIQ ETIK SAVOL:** ## foydalanuvchi savollarni **LLM emas, MB** ## bergani haqida ## ⚠️ **bilishi kerakmi?**
>
> ## ## ⭐ **69-MODULDA BU — "SHAFFOFLIK" PRINSIPI.**

---

## 6. 🔧 Etik risk registri — **birinchi vosita**

```python
from dataclasses import dataclass, field


@dataclass
class EtikRisk:
    bosqich: str            # hayot sikli bosqichi
    tavsif: str
    ehtimol: int            # 1-5
    ta_sir: int             # 1-5
    prinsip: str            # maxfiylik / shaffoflik / javobgarlik / adolat
    chora: str = ""

    @property
    def ball(self):
        return self.ehtimol * self.ta_sir

    @property
    def daraja(self):
        b = self.ball
        return ("💥 KRITIK" if b >= 16 else
                "⚠️ YUQORI" if b >= 9 else
                "⭐ O'RTA" if b >= 4 else "✅ PAST")
```

```python
RISKLAR = [
    EtikRisk("to'plash", "Nomzod javoblari saqlanadi", 5, 4, "maxfiylik",
             "30 kundan keyin o'chirish"),
    EtikRisk("to'plash", "Ism promptga tushadi", 5, 3, "adolat",
             "ismni olib tashlash"),
    EtikRisk("ishlab chiqish", "Model o'zbekchani yomon biladi", 4, 4, "adolat",
             "ingliz tilida ishlash + tarjima qatlami"),
    EtikRisk("joylashtirish", "Prompt injection", 4, 5, "javobgarlik",
             "koddagi filtr + mantiqiy tekshiruv"),
    EtikRisk("joylashtirish", "Zaxira ishlagani aytilmaydi", 5, 2, "shaffoflik",
             "interfeysda ko'rsatish"),
    EtikRisk("monitoring", "Ball haqiqiy sifatni aks ettirmaydi", 5, 5, "adolat",
             "muntazam audit"),
]

for r in sorted(RISKLAR, key=lambda x: -x.ball):
    print(f"  {r.daraja:10} {r.ball:2}  [{r.bosqich:14}] "
          f"{r.prinsip:12} {r.tavsif}")
```

### ✅ Haqiqiy natija

```
  💥 KRITIK  25  [monitoring    ] adolat       Ball haqiqiy sifatni aks ettirmaydi
  💥 KRITIK  20  [to'plash      ] maxfiylik    Nomzod javoblari saqlanadi
  💥 KRITIK  20  [joylashtirish ] javobgarlik  Prompt injection
  💥 KRITIK  16  [ishlab chiqish] adolat       Model o'zbekchani yomon biladi
  ⚠️ YUQORI  15  [to'plash      ] adolat       Ism promptga tushadi
  ⚠️ YUQORI  10  [joylashtirish ] shaffoflik   Zaxira ishlagani aytilmaydi
```

> ## 💥💥 **ENG YUQORI RISK — 25 BALL:** ## *"Ball haqiqiy sifatni aks ettirmaydi"*.
>
> ## ## 🔑 **VA BIZ BUNI 67-MODULDA O'LCHAGAN EDIK:** ## butun diapazon **8 dan 9 gacha**. ## ## ⭐ 69-modulda buni **yana o'lchaymiz** — ## va natija **yanada yomonroq** chiqadi.

---

## 🎯 Nazorat savollari

1. Nega etika bo'limi kursning oxirida?
2. Greg Marston ishi qanday etik muammoni ko'rsatadi?
3. Clearview AI qancha jarima to'ladi va nima uchun?
4. Risk registrida eng yuqori ball qaysi riskda?

<details>
<summary>Javoblar</summary>

1. Siz endi **nimani** qurayotganingizni bilasiz — shuning uchun **oqibatlarini** ham tushunasiz. ⭐ 66–67-modullarda qurgan ilovani endi **audit qilamiz**.
2. ## **Rozilik kelajakni qamrab ololmaydi.** 2003-yilda shartnoma imzolanganda ovoz klonlash texnologiyasi **mavjud emas edi**. 💥 Yillar keyin u o'zining AI kloniga qarshi ish uchun raqobatlashdi.
3. ## **$30 mln dan ortiq** *(Fransiya, Italiya, Niderlandiya)* — ijtimoiy tarmoqlardan **milliardlab rasmni rozilliksiz** yig'gani uchun. 💰 Etika — xarajat masalasi ham.
4. ## **25 ball** — *"Ball haqiqiy sifatni aks ettirmaydi"* *(ehtimol 5 × ta'sir 5)*. ⚠️ To'rtta risk **KRITIK** (≥ 16) chiqdi. ⭐ Biz buni 67-modulda o'lchagan edik: butun diapazon **8..9**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-The-AI-Lifecycle.md)
