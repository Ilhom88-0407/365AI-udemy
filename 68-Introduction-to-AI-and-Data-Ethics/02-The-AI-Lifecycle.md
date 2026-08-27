# 2-dars. AI hayot sikli ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs olti bosqichni uchta etik toifaga guruhlaydi. Biz o'sha jadvalni kodga aylantiramiz — va o'z ilovamizni har bosqichda tekshiramiz."**

---

## 1. Olti bosqich

| # | Bosqich | Nima bo'ladi |
|---|---|---|
| 1 | **Ma'lumot to'plash** | Matn, rasm, tranzaksiya, audio |
| 2 | **Oldindan tayyorlash** | Dublikat, bo'sh qiymat, kodlash |
| 3 | ## **Model o'qitish** | Algoritm naqshlarni topadi |
| 4 | **Baholash** | Alohida to'plamda sinov |
| 5 | ## **Joylashtirish** | Foydalanuvchi bilan uchrashuv |
| 6 | ## **Monitoring** | ⭐ **Sikl bu yerda tugamaydi** |

> ## 💡 **KURS TA'KIDLAYDI:** ## *"Sikl joylashtirish bilan **tugamaydi**. ## AI tizimlari **doimiy monitoringni** talab qiladi."*

---

## 2. ⭐ Uchta etik toifa

Kursning asosiy g'oyasi — olti bosqichni **uchtaga** guruhlash:

| Etik toifa | Bosqichlar | Asosiy savol |
|---|---|---|
| ## **Etik ma'lumot to'plash** | 1 + 2 | ## ⭐ **Ma'lumot QAYERDAN?** |
| ## **Etik ishlab chiqish** | 3 + 4 | ## ⭐ **Kimga ZARAR?** |
| ## **Etik joylashtirish** | 5 + 6 | ## ⭐ **Kim JAVOBGAR?** |

> ## 🏆 **VA HAR TOIFA — ALOHIDA MODUL:** ## 70, 71, 72.

---

## 3. 🔧 Hayot siklini **kodga aylantiramiz**

```python
from dataclasses import dataclass, field


PRINSIPLAR = ("maxfiylik", "shaffoflik", "javobgarlik", "adolat")


@dataclass
class Bosqich:
    nom: str
    toifa: str
    savollar: list = field(default_factory=list)   # etik tekshiruv savollari

    def audit(self, javoblar):
        """Har savolga ha/yo'q. Javob berilmagan — ⚠️ deb belgilanadi."""
        natija = []
        for s in self.savollar:
            j = javoblar.get(s)
            belgi = "✅" if j is True else ("💥" if j is False else "⚠️")
            natija.append((belgi, s))
        return natija


HAYOT_SIKLI = [
    Bosqich("ma'lumot to'plash", "etik to'plash", [
        "Ma'lumot egasi rozilik berganmi?",
        "Manba litsenziyasi tekshirilganmi?",
        "Shaxsiy ma'lumot (PII) aniqlanganmi?",
        "Guruhlar teng vakillik qilganmi?",
    ]),
    Bosqich("oldindan tayyorlash", "etik to'plash", [
        "O'chirilgan qatorlar bias kiritdimi?",
        "Bo'sh qiymatlar qaysi guruhda ko'p?",
    ]),
    Bosqich("model o'qitish", "etik ishlab chiqish", [
        "O'quv ma'lumotining tarkibi hujjatlashtirilganmi?",
        "Himoyalangan belgilar (jins, irq) modelga kiradimi?",
    ]),
    Bosqich("baholash", "etik ishlab chiqish", [
        "Metrikalar guruhlar bo'yicha ajratib hisoblanganmi?",
        "Eng yomon guruh natijasi ma'lummi?",
    ]),
    Bosqich("joylashtirish", "etik joylashtirish", [
        "Foydalanuvchi AI bilan gaplashayotganini biladimi?",
        "Qaror ustidan shikoyat qilish mumkinmi?",
        "Chegara/zaxira ishlaganda xabar beriladimi?",
    ]),
    Bosqich("monitoring", "etik joylashtirish", [
        "Muntazam bias auditi bormi?",
        "Loglar saqlanadimi va qancha?",
        "Modelni o'chirish rejasi bormi?",
    ]),
]
```

### 🔬 O'z ilovamizni audit qilamiz

```python
JAVOBLAR = {
    "Ma'lumot egasi rozilik berganmi?": True,
    "Manba litsenziyasi tekshirilganmi?": True,
    "Shaxsiy ma'lumot (PII) aniqlanganmi?": False,
    "Guruhlar teng vakillik qilganmi?": None,
    "O'chirilgan qatorlar bias kiritdimi?": None,
    "Bo'sh qiymatlar qaysi guruhda ko'p?": None,
    "O'quv ma'lumotining tarkibi hujjatlashtirilganmi?": False,
    "Himoyalangan belgilar (jins, irq) modelga kiradimi?": False,
    "Metrikalar guruhlar bo'yicha ajratib hisoblanganmi?": False,
    "Eng yomon guruh natijasi ma'lummi?": False,
    "Foydalanuvchi AI bilan gaplashayotganini biladimi?": True,
    "Qaror ustidan shikoyat qilish mumkinmi?": False,
    "Chegara/zaxira ishlaganda xabar beriladimi?": False,
    "Muntazam bias auditi bormi?": False,
    "Loglar saqlanadimi va qancha?": None,
    "Modelni o'chirish rejasi bormi?": False,
}

for b in HAYOT_SIKLI:
    print(f"\n  [{b.toifa}] {b.nom}")
    for belgi, s in b.audit(JAVOBLAR):
        print(f"    {belgi} {s}")
```

### ✅ Haqiqiy natija

```
  [etik to'plash] ma'lumot to'plash
    ✅ Ma'lumot egasi rozilik berganmi?
    ✅ Manba litsenziyasi tekshirilganmi?
    💥 Shaxsiy ma'lumot (PII) aniqlanganmi?
    ⚠️ Guruhlar teng vakillik qilganmi?

  [etik to'plash] oldindan tayyorlash
    ⚠️ O'chirilgan qatorlar bias kiritdimi?
    ⚠️ Bo'sh qiymatlar qaysi guruhda ko'p?

  [etik ishlab chiqish] model o'qitish
    💥 O'quv ma'lumotining tarkibi hujjatlashtirilganmi?
    💥 Himoyalangan belgilar (jins, irq) modelga kiradimi?

  [etik ishlab chiqish] baholash
    💥 Metrikalar guruhlar bo'yicha ajratib hisoblanganmi?
    💥 Eng yomon guruh natijasi ma'lummi?

  [etik joylashtirish] joylashtirish
    ✅ Foydalanuvchi AI bilan gaplashayotganini biladimi?
    💥 Qaror ustidan shikoyat qilish mumkinmi?
    💥 Chegara/zaxira ishlaganda xabar beriladimi?

  [etik joylashtirish] monitoring
    💥 Muntazam bias auditi bormi?
    ⚠️ Loglar saqlanadimi va qancha?
    💥 Modelni o'chirish rejasi bormi?
```

```
XULOSA: ✅ 3   💥 9   ⚠️ 4   (jami 16)
tayyorlik: 18.8%
```

> ## 💥💥💥 **BIZNING ILOVAMIZ — 16 TADAN 3 TASI.**
>
> ## Va bu — **67-modulda "ishonchli" deb atagan** ilova.

> ## 🔑 **VA MANA ETIKANING ASOSIY DARSI:** ## ⭐ **texnik ishonchlilik ≠ etik tayyorlik.** ## ## 💡 Biz JSON ni tuzatdik, injection ni blokladik, ## zaxira qo'ydik — ## lekin **"qaror ustidan shikoyat"** haqida ## o'ylamagan edik.

---

## 4. ⚠️ Uchta `⚠️` — **eng xavfli javob**

> ## 🔑 **`⚠️` — "BILMAYMIZ" DEGANI.**
>
> ## Va bu — `💥` dan **yomonroq**: ## `💥` da siz **muammoni bilasiz**, ## `⚠️` da esa — ## ⭐ **muammo bor-yo'qligini ham bilmaysiz**.

| Savol | Nega javob yo'q |
|---|---|
| Guruhlar teng vakillik qilganmi? | ## MB dagi 1500 savolni **tahlil qilmadik** |
| Bo'sh qiymatlar qaysi guruhda ko'p? | ## **Umuman qaramadik** |
| Loglar saqlanadimi va qancha? | ## **Siyosat yo'q** |

> ## 🏆 **BIRINCHI QADAM — `⚠️` NI `✅` YOKI `💥` GA AYLANTIRISH.** ## ⭐ Ya'ni **o'lchash**.

---

## 5. ⭐ Va nima uchun **monitoring** alohida bosqich?

Kurs aytadi:

> *"AI tizimlari o'zgaruvchan sharoitlarga moslashish uchun **doimiy monitoringni** talab qiladi. Ba'zan yangi ma'lumot qo'shilishi va model **qayta o'qitilishi** kerak."*

### 💥 Va bu — **model drift** muammosi

| Vaqt | Nima o'zgaradi |
|---|---|
| 0 oy | Model **yaxshi** ishlaydi |
| 6 oy | Bozor o'zgardi — ## ⚠️ **savollar eskirdi** |
| 12 oy | Yangi texnologiyalar — ## 💥 **model bilmaydi** |
| 24 oy | ## 💥 **Model zarar keltiradi** |

> ## 💡 **BIZNING ILOVAMIZDA BU JUDA AYON:** ## MB dagi savollar **2024-yilda** yozilgan bo'lsa, ## 2027-yilda ## ⚠️ **ular allaqachon eskirgan**.

> ## 🏆 **QOIDA:** ## har model uchun ## ⭐ **"qachon qayta ko'rib chiqamiz?"** ## degan sana bo'lishi kerak.

---

## 🎯 Nazorat savollari

1. Hayot siklining olti bosqichini ayting.
2. Kurs ularni nechta etik toifaga guruhlaydi?
3. Bizning ilovamiz auditdan qanday o'tdi?
4. Nega `⚠️` `💥` dan yomonroq?

<details>
<summary>Javoblar</summary>

1. ## ① to'plash, ② oldindan tayyorlash, ③ o'qitish, ④ baholash, ⑤ joylashtirish, ⑥ **monitoring**. ⭐ Oxirgisi — sikl **tugamasligini** bildiradi.
2. ## **Uchta:** etik **to'plash** (1+2), etik **ishlab chiqish** (3+4), etik **joylashtirish** (5+6). 🏆 Har biri — alohida modul *(70, 71, 72)*.
3. ## **16 tadan 3 tasi — 18.8%.** 💥 To'qqizta `💥`, to'rtta `⚠️`. 🔑 Va bu — 67-modulda *"ishonchli"* deb atagan ilova. ⭐ **Texnik ishonchlilik ≠ etik tayyorlik.**
4. ## `💥` da siz **muammoni bilasiz**; `⚠️` da — **muammo bor-yo'qligini ham bilmaysiz**. 🏆 Birinchi qadam — `⚠️` ni **o'lchab**, `✅` yoki `💥` ga aylantirish.

</details>

---

⬅️ [1-dars](01-What-Does-the-Course-Cover.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Why-AI-Ethics-Matter.md)
