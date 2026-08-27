# 📝 75-modul. Mashqlar

> **10 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan** — quyidagi natijalar **haqiqiy chiqish**.

---

## 🟢 1-mashq. O'z ismingiz necha token?

<details><summary>Yechim</summary>

```
  John             1 token  ['John']
  Ilhom            2 token  ['Il', 'hom']
  Ilhom Islomov    5 token  ['Il', 'hom', ' Is', 'lom', 'ov']
  Muhammadali      3 token  ['Muh', 'ammad', 'ali']
  O'tkir           3 token  ['O', "'t", 'kir']
  G'ulom           4 token  ['G', "'", 'ul', 'om']
  Shahzod          4 token  ['Sh', 'ah', 'z', 'od']
```

> ## 💥💥 **`John` — 1 TOKEN. ## `G'ulom` — 4 TOKEN.**

> ## 🔑 **VA `G'ulom` DA APOSTROF ## ⭐ BUTUNLAY YOLG'IZ TOKEN:** `"'"`.

> ## 💡 **AMALIY MA'NOSI:** ## ismlar ro'yxatini modelga yuborsangiz — ## ⭐ **o'zbek ismlari 2–4 barobar qimmat**.
</details>

---

## 🟡 2-mashq. Apostrof qancha turadi?

Har so'zni apostrof **bilan** va **usiz** o'lchang.

<details><summary>Yechim</summary>

```
  apostrof BILAN    tok   apostrofSIZ       tok   farq
  o'qituvchi          4   oqituvchi           3     +1
  do'stlik            4   dostlik             3     +1
  g'alaba             3   galaba              2     +1
  so'z                2   soz                 1     +1
  bo'lim              3   bolim               2     +1

  JAMI 16 vs 11  ->  apostrof 5 ta qo'shimcha token (+45%)
```

> ## 💥💥💥 **+45%.**
>
> ## ## ⭐ **Har apostrof — aynan bitta qo'shimcha token.**

> ## ⚠️⚠️ **LEKIN BU "APOSTROFNI TASHLANG" ## DEGANI EMAS.**
>
> ## ## 💥 `soz` va `so'z` — ## 🔑 **boshqa-boshqa so'zlar**. ## ## ⭐ To'g'ri yozuv **narxdan muhimroq**.

> ## 💡 **TO'G'RI XULOSA:** ## bu — ## 🏆 **tokenizator kamchiligi**, ## foydalanuvchi kamchiligi emas. ## ## ⭐ Va uni **byudjetga kiritish** kerak *(74-modul)*.
</details>

---

## 🔴 3-mashq. Detektorni **nazorat misollari** bilan sinang

Har qoida uchun **yiqilishi kerak** va **yiqilmasligi kerak**
bo'lgan misol yozing.

<details><summary>Yechim</summary>

```
  qoida        kutilgan   natija  matn
  email            True     True  OK  Reply to a@b.co please
  email           False    False  OK  Use the @ symbol in Python decorators
  karta            True     True  OK  Card 4111 1111 1111 1111 declined
  karta            True     True  OK  The build ran 1234 5678 9012 3456 times
  telefon          True     True  OK  +998 90 123 45 67
  telefon          True     True  OK  Version 8 90 123 45 67 of the spec
  parol            True     True  OK  password: hunter2
  parol           False    False  OK  How do I hash a password in bcrypt?
  shartnoma        True     True  OK  This NDA covers...
  shartnoma        True     True  OK  Explain what an NDA is

  10/10 to'g'ri
```

> ## 🤔 **10/10 — LEKIN DIQQAT BILAN O'QING.**

### 💥 Uchta qatorda `kutilgan = True` — **lekin ular NOZIK EMAS**

| Matn | Regex | Haqiqatda |
|---|---|---|
| *"The build ran **1234 5678 9012 3456** times"* | ## 💥 karta | ## ✅ **Nozik emas** |
| *"**Version 8 90 123 45 67** of the spec"* | ## 💥 telefon | ## ✅ **Nozik emas** |
| *"**Explain what an NDA is**"* | ## 💥 shartnoma | ## ✅ **Nozik emas** |

> ## 🔑 **`10/10` — "DETEKTOR SPEZIFIKATSIYA ## BO'YICHA ISHLAYDI" DEGANI,** ## ## 💥 **"to'g'ri qaror qabul qiladi" degani EMAS.**

> ## 🏆 **VA MEN `kutilgan` NI ATAYIN ## `True` QILIB QO'YDIM** — ## chunki regex ## ⭐ **haqiqatan ham ishga tushadi**. ## ## 💡 Bu — **halol belgilash**, ## natijani **bo'yash emas**.

> ## 💥💥 **YOLG'ON BAYROQ DARAJASI: 3/10.** ## ## ⚠️ Va shuning uchun ## 🏆 **bloklash emas, TAHRIRLASH** kerak *(2-dars)* — ## yolg'on bayroq ## ⭐ **hech kimga xalaqit bermaydi**.
</details>

---

## 🟡 4-mashq. Plagiat — `n` ni to'liq skanerlang

<details><summary>Yechim</summary>

```
    n     so'zma-so'z   kichik tahrir        parafraz        mustaqil
    2            1.00            0.86            0.00            0.00
    3            1.00            0.80            0.00            0.00
    4            1.00            0.74            0.00            0.00
    5            1.00            0.67            0.00            0.00
    6            1.00            0.59            0.00            0.00
    8            1.00            0.40            0.00            0.00
   10            1.00            0.15            0.00            0.00
```

> ## 💥💥💥 **`parafraz` USTUNI — ## HAMMA `n` DA `0.00`.**
>
> ## ## ⭐ Va u ## 🔑 **`mustaqil` ustunidan farq qilmaydi**.

> ## 🏆 **YA'NI HECH QANDAY `n` ## PARAFRAZNI TOPA OLMAYDI —** ## ## 💥 bu **sozlash masalasi emas**, ## ⭐ **usulning cheklovi**.

> ## 💡 **`kichik tahrir` USTUNI ESA SILLIQ TUSHADI:** ## `0.86 → 0.15`. ## ## 🔑 Ya'ni `n` ni tanlash ## ⭐ **faqat shu turga** ta'sir qiladi.
</details>

---

## 🟢 5-mashq. O'z ekologik izingiz

<details><summary>Yechim</summary>

```
   kunlik sorov   yillik kWh   yillik kg CO2
              5         0.55            0.22
             20         2.19            0.88
             50         5.47            2.19
            200        21.90            8.76

  Taqqoslash uchun:
    1 kg mol go'shti          ~ 60 kg CO2
    Toshkent-Istanbul reysi   ~ 300 kg CO2
```

> ## 💥💥 **KUNIGA 200 TA SO'ROV — YILIGA `8.76 kg`.** ## ## ⭐ Bu — **150 gramm mol go'shtidan** kam.

> ## 🔑 **HALOL XULOSA:** ## shaxsiy ChatGPT iste'moli — ## 💥 **ekologik jihatdan ahamiyatsiz**.

> ## 🏆 **VA BUNI AYTISH KERAK,** ## chunki kurs ## ⚠️ *"har foydalanuvchi rol o'ynaydi"* deydi. ## ## 💡 **Matematik jihatdan bu rol juda kichik.**

> ## ⭐ **HAQIQIY RICHAGLAR:** ## model **hajmi**, ma'lumot markazi **joylashuvi** *(26.7x)*, ## va ## 🏆 **AI ni umuman ishlatmaslik** *(73-modul: 70%)*.
</details>

---

## 🟡 6-mashq. Model tanlash — energiya bo'yicha

<details><summary>Yechim</summary>

```
  Buyurtma holati          -> SHABLON         0.00 Wh
  Spam tasnifi             -> kichik model    0.05 Wh
  PII ajratish             -> kichik model    0.05 Wh
  Blog maqolasi            -> katta model     0.30 Wh
  Qaytarish siyosati       -> SHABLON         0.00 Wh

  hammasi katta model: 1.50 Wh
  optimal tanlov:      0.40 Wh
  tejash: 73%
```

> ## 🏆🏆 **73% TEJASH — ## VA HECH QANDAY SIFAT YO'QOTISHISIZ.**

> ## 🔑 **CHUNKI SHABLON `Buyurtma holati` UCHUN ## ⭐ KATTA MODELDAN YAXSHIROQ:** ## u ## 💥 **gallyutsinatsiya qilmaydi**.

> ## 💡 **VA `73%` — 73-MODULDAGI ## `70%` GA JUDA YAQIN.** ## ## ⭐ Ikkalasi ham bir xil narsani o'lchaydi: ## 🏆 **AI kerak bo'lmagan vazifalar ulushi**.
</details>

---

## 🟡 7-mashq. Tahrirlovchini **buzing**

`tahrirlash()` o'tkazib yuboradigan misol toping.

<details><summary>Yechim</summary>

```
  oldin: Review this: https://wiki.acme.internal/roadmap-2026
  keyin: Review this: [ICHKI URL]/roadmap-2026
```

> ## 💥 **`roadmap-2026` QOLDI** — ## regex faqat **domenni** tutdi.

### 🏆 Yana uchtasi

| Matn | Nega o'tadi |
|---|---|
| *"Our new product is called **Nova X**"* | ## 💥 **Hech qanday naqsh yo'q** |
| *"Salary band for L5 is **12-15M**"* | ## 💥 Shunchaki son |
| *"**Aziz** thinks the deal will fail"* | ## 💥 Lavozimsiz ism |

> ## 🔑 **UCHALASI HAM — ## ⭐ REGEX BILAN TUTIB BO'LMAYDI.**

> ## 💡 **VA SHUNING UCHUN 2-DARSDA ## `YUBORMASLIK_QOIDASI` BOR:** ## ## 🏆 **odam uchun ro'yxat, kod uchun emas.**
</details>

---

## 🔴 8-mashq. Manba tekshirish jarayoni

4-darsdagi 8 ta manba uchun **tekshiruv rejasi** yozing.

<details><summary>Yechim</summary>

```python
def manba_tekshiruvi(manba):
    """Har biri UCH bosqichdan o'tsin."""
    return [
        ("1. Sarlavhani AYNAN qidiring",
         "topilmasa -> DA'VONI OLIB TASHLANG"),
        ("2. Muallif shu SOHADA ishlaydimi?",
         "Blei muammosi: haqiqiy ism + boshqa soha"),
        ("3. Yil va nashr joyini tekshiring",
         "ko'pincha yil noto'g'ri"),
    ]
```

> ## ⚠️ **VA HALOL BO'LAYLIK:** ## bu uch bosqich ## ⭐ **har manba uchun bir necha daqiqa**. ## ## 💥 8 ta manba = **yarim soat**.

> ## 🏆 **SHUNING UCHUN AMALIY QOIDA BOSHQA:**
>
> ## ## 💡 **Manba so'ramang — ## ⭐ MANBADAN boshlang.**

| Yo'l | Xavf |
|---|---|
| Modeldan manba so'rash | ## 💥 **8 ta tekshirilmagan da'vo** |
| ## **Manbani o'zingiz topib, modelga BERISH** | ## 🏆 **0 ta** |

> ## 🔑 **IKKINCHISI — RAG NING ASOSIY G'OYASI** ## *(62–64-modullar)*.
</details>

---

## 🟡 9-mashq. Sozlamalar jadvali

<details><summary>Yechim</summary>

| | o'qitish | tarix | xotira | serverda |
|---|---|---|---|---|
| bepul/plus *(standart)* | 💥 | 💥 | 💥 | 💥 |
| ## **bepul/plus (opt-out)** | ## ✅ | ## 💥 | ## 💥 | ## 💥 |
| enterprise | ✅ | 💥 | 💥 | 💥 |
| ## **vaqtinchalik suhbat** | ## ✅ | ## ✅ | ## ✅ | ## 💥 |

> ## 💥💥 **OXIRGI USTUN — HAMMA JOYDA `💥`.**

> ## 🔑 **YA'NI HECH BIR SOZLAMA ## ⭐ "YUBORILMASIN" DEMAYDI.** ## ## 💡 Ular faqat *"kamroq saqlansin"* deydi.

> ## 🏆 **VA SHUNING UCHUN 3-DARSDAGI ## "GAZETA SAVOLI" — ## ⭐ SOZLAMALARDAN USTUN.**
</details>

---

## 🔴 10-mashq. To'liq `xavfsiz_yuborish` quvuri

<details><summary>Yechim</summary>

```python
def xavfsiz_yuborish(matn, enc, oyna=8000):
    """💡 Uch tekshiruv — HAR chaqiruvdan oldin."""
    hisobot = {}

    # 1. NOZIK MA'LUMOT (2-dars)
    topilgan = nozik_tekshiruv(matn)
    if topilgan:
        matn = tahrirlash(matn)
        hisobot["tahrirlandi"] = topilgan

    # 2. TOKEN BYUDJETI (1-dars)
    t = len(enc.encode(matn))
    hisobot["token"] = t
    if t > oyna * 0.5:
        hisobot["ogohlantirish"] = "SO'ROV JUDA UZUN"

    # 3. "GAZETA SAVOLI" (3-dars) — INSON uchun
    hisobot["tasdiq_kerak"] = bool(topilgan)

    return matn, hisobot
```

```
matn:   "Draft an email to Aziz Karimov, CEO about the merger."
->      "Draft an email to [ISM+LAVOZIM] about the merger."
hisobot: {'tahrirlandi': ['ism+lavozim'], 'token': 17,
          'tasdiq_kerak': True}
```

> ## 🏆 **UCHALA TEKSHIRUV HAM ## ⭐ "ENTER" DAN OLDIN ISHLAYDI.**

> ## 💡 **VA BU — MODULNING AMALIY XULOSASI:** ## ## 🔑 kompaniya siyosatiga emas, ## 🏆 **O'Z jarayoningizga tayaning.**
</details>

---

## 🏁 Yakuniy jadval

| # | Mashq | Asosiy natija |
|---|---|---|
| 1 | ## **Ismlar** | ## 💥 **`John` 1, `G'ulom` 4 token** |
| 2 | ## **Apostrof** | ## 💥 **+45% token** |
| 3 | ## **Nazorat misollari** | ## ⚠️ **10/10 — lekin 3 ta yolg'on bayroq** |
| 4 | Plagiat `n` skaneri | 💥 Parafraz — **hamma `n` da `0.00`** |
| 5 | Ekologik iz | ⭐ 200 so'rov/kun = **8.76 kg/yil** |
| 6 | ## **Model tanlash** | ## 🏆 **73% tejash** |
| 7 | Tahrirlovchini buzish | 💥 `roadmap-2026` qoldi |
| 8 | ## **Manba tekshiruvi** | ## 🏆 **Manbadan BOSHLANG** |
| 9 | Sozlamalar jadvali | 💥 *"Serverda"* — hamma joyda |
| 10 | To'liq quvur | ⭐ Uchala tekshiruv `Enter` dan oldin |

---

⬅️ [6-dars](06-Environment.md) · 🏠 [Modul](README.md)
