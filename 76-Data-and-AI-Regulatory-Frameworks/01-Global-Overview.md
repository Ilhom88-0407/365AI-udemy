# 1-dars. Global AI va ma'lumot regulyatsiyasi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Uchta yondashuv, uchta falsafa. Va agar to'rtta yurisdiksiyada ishlasangiz — GDPR ni bajarish talablarning atigi 60% ini qoplaydi."**

---

## 1. Kursning uchta modeli

| Mintaqa | Yondashuv | Falsafa |
|---|---|---|
| ## **Yevropa Ittifoqi** | ## ⭐ **Xavfga asoslangan qonun** | *"Xavf katta — qoida qattiq"* |
| ## **AQSh** | Sohaga xos, ko'proq **ixtiyoriy** | *"Kompaniya javobgar"* |
| ## **Xitoy** | Qattiq boshqaruv + **kontent nazorati** | *"Davlat javobgar"* |

> ## 🔑 **KURSNING FAKTLARI:** ## Xitoy — birinchi qadamni **2016-yilda** qo'ygan; ## **2022-yilga kelib 37 ta davlat** ## AI ga oid qoidalar joriy qilgan.

> ## ⚠️ **LEKIN KURSNING O'ZI AYTADI:** ## *"ko'p davlat **yo'riqnoma yoki strategiya** joriy qilgan, ## lekin ## 💥 **to'liq AI qonuni — bir nechtasida**."*

---

## 2. 🔑 Amaliy savol: **menga qaysisi tegishli?**

> ## 💥 **XATO SAVOL:** ## *"Men qayerda joylashganman?"*
>
> ## ## ✅ **TO'G'RI SAVOL:** ## *"Mening foydalanuvchilarim qayerda?"*

Kurs buni GDPR haqida aniq aytadi:

> *"GDPR faqat Yevropa bizneslariga emas — u **qayerda joylashganidan
> qat'i nazar**, EI fuqarolari ma'lumotini ishlovchi **har qanday
> kompaniyaga** tegishli."*

```python
def qaysi_rejim(foydalanuvchilar, soha):
    """Qaysi rejimlar QO'LLANADI (joylashuvingizga bog'liq emas)."""
    rejimlar = set()
    if foydalanuvchilar & {"EU", "EEA"}:
        rejimlar |= {"GDPR", "EU AI Act"}
    if "US-CA" in foydalanuvchilar:
        rejimlar.add("CCPA/CPRA")
    if "US-NY" in foydalanuvchilar and soha == "yollash":
        rejimlar.add("NYC LL144")           # ⭐ bias auditi
    if "CN" in foydalanuvchilar:
        rejimlar |= {"PIPL", "DSL"}
    if "ZA" in foydalanuvchilar:
        rejimlar.add("POPIA")
    return rejimlar
```

---

## 3. 🔬 Ko'p yurisdiksiya — **talablar qanday to'planadi?**

To'rtta rejimning talablarini sanaymiz.

```python
YURISDIKSIYA = {
 "EU (GDPR + AI Act)":     {"aniq rozilik", "o'chirish", "bias auditi",
                            "inson nazorati", "hujjatlar", "saqlash muddati"},
 "AQSh (NY LL144)":        {"bias auditi", "nomzodga xabar"},
 "Xitoy (PIPL + DSL)":     {"aniq rozilik", "ma'lumot tasnifi",
                            "chegaradan o'tkazish ruxsati", "saqlash muddati"},
 "Janubiy Afrika (POPIA)": {"aniq rozilik", "kirish", "saqlash muddati"},
}
```

### ✅ Haqiqiy natija

```
  yurisdiksiya              talablar
  EU (GDPR + AI Act)               6
  AQSh (NY LL144)                  2
  Xitoy (PIPL + DSL)               4
  Janubiy Afrika (POPIA)           3

  Hammasida ishlash:     10 ta talab
  Eng qattiq bitta (EU):  6 ta
```

> ## 🔧 **KO'P ODAM SHUNDAY O'YLAYDI:** ## *"GDPR — eng qattig'i. ## Uni bajarsam, ## ⭐ **hamma joyda tayyorman**."*

### 💥 Tekshiramiz

```
  EU ni bajarsangiz, QOLGAN talablar:
    - ma'lumot tasnifi              (Xitoy DSL)
    - chegaradan o'tkazish ruxsati  (Xitoy PIPL)
    - nomzodga xabar                (NY LL144)
    - kirish                        (POPIA)

  -> 6/10 EU tomonidan qoplanadi (60%)
```

> ## 💥💥💥 **ATIGI 60%.**
>
> ## ## 🔑 To'rtta talab ## ⭐ **EU da umuman yo'q**.

> ## 🏆 **VA ULARNING IKKITASI — XITOYNIKI:** ## ma'lumotni **tasniflash** va ## ⭐ **chegaradan o'tkazishga ruxsat**. ## ## 💡 EU bunday talab qo'ymaydi — ## u boshqa **falsafaga** ega.

---

## 4. 🏆 Amaliy strategiya

| Strategiya | Baho |
|---|---|
| Har yurisdiksiyaga alohida tizim | ## 💥 **Qimmat, xatoga moyil** |
| ## **Eng qattiq talablar birlashmasi** | ## 🏆 **Bitta tizim, hammasi** |
| *"GDPR yetarli"* | ## 💥 **60%** |

```python
def yagona_talablar(yurisdiksiyalar, YURISDIKSIYA):
    """💡 BIRLASHMA — kesishma emas."""
    return set().union(*(YURISDIKSIYA[y] for y in yurisdiksiyalar))
```

> ## 💥 **DIQQAT — `union`, `intersection` EMAS.**
>
> ## ## 🔑 Bu — 72-moduldagi ## ⭐ **litsenziya aralashmasi** bilan **bir xil mantiq**: ## ## 💡 **eng cheklovchi shart g'olib**.

---

## 5. ⚠️ Kursning ogohlantirishi — **regulyatsiya o'zgaradi**

75-modulda ko'rgan edik: kurs *"siyosatdan xabardor bo'ling"* deydi,
lekin bu **bajarib bo'lmaydi**.

### 🏆 Bajariladigan shakli

```python
REGULYATSIYA_KUZATUVI = [
    ("Foydalanuvchi mamlakatlarini RO'YXATGA oling", "har chorak"),
    ("Yangi mamlakat qo'shilsa — TEKSHIRUV", "avtomatik"),
    ("Talablar birlashmasini QAYTA hisoblang", "har yarim yil"),
    ("Yangi talab chiqsa — xavf reyestriga", "73-modul"),
]
```

> ## 💡 **IKKINCHI QATOR — ENG MUHIMI.** ## ## ⭐ Yangi mamlakatdan foydalanuvchi kelishi — ## bu ## 🔑 **texnik hodisa**, ## va uni ## 🏆 **kod aniqlay oladi**.

> ## 💥 **VA KO'P KOMPANIYA BUNI ## ⭐ SUD ORQALI BILADI.**

---

## 🎯 Nazorat savollari

1. *"Menga qaysi qonun tegishli?"* — qaysi savol to'g'ri?
2. GDPR ni bajarish yetarlimi?
3. Talablar qanday birlashtiriladi?
4. Regulyatsiya kuzatuvining eng amaliy qadami qaysi?

<details>
<summary>Javoblar</summary>

1. ## *"Mening **foydalanuvchilarim** qayerda?"* ⭐ Kurs GDPR haqida aniq aytadi: u 🔑 **qayerda joylashganingizdan qat'i nazar** qo'llanadi.
2. ## **Yo'q — 60%.** 💥 To'rtta talab EU da umuman yo'q: **ma'lumot tasnifi** va **chegaradan o'tkazish ruxsati** *(Xitoy)*, **nomzodga xabar** *(NY)*, **kirish** *(POPIA)*.
3. ## **`union` bilan — `intersection` emas.** 🔑 Bu — 72-moduldagi **litsenziya aralashmasi** mantiqining o'zi: ⭐ **eng cheklovchi shart g'olib**.
4. ## *"Yangi mamlakat qo'shilsa — avtomatik tekshiruv."* ⭐ Yangi mamlakatdan foydalanuvchi kelishi — **texnik hodisa**, va uni 🏆 **kod aniqlay oladi**. 💥 Ko'p kompaniya buni **sud orqali** biladi.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-EU-GDPR-and-AI-Act.md)
