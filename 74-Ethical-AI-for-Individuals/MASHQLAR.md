# 📝 74-modul. Mashqlar

> **10 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan** — quyidagi natijalar **haqiqiy chiqish**.

---

## 🟢 1-mashq. Yangi tokenizator kimga yordam berdi?

`cl100k_base` *(gpt-4)* va `o200k_base` *(gpt-4o)* ni solishtiring.

<details><summary>Yechim</summary>

```
  til            cl100k    o200k   yaxshilanish
  inglizcha          15       14            7%
  ruscha             39       18           54%
  o'zbekcha          31       25           19%
```

> ## 🏆 **RUSCHA — 54% ARZONLASHDI.** ## ## ⚠️ **O'ZBEKCHA — ATIGI 19%.**

> ## 🔑 **SABAB:** ## yangi tokenizator ## ⭐ **ko'p ishlatiladigan tillarga** moslashtirilgan. ## ## 💥 Rus tili — **katta korpusda**, ## o'zbek tili — **yo'q**.

> ## 💡 **VA BU MUHIM NAQSH:** ## texnik yaxshilanishlar ## ⭐ **allaqachon yaxshi ta'minlangan** tillarga ## 🔑 **ko'proq foyda** keltiradi.
</details>

---

## 🟡 2-mashq. Suhbat necha navbat davom etadi?

`8000` tokenlik oyna, javob `200` token. Har tilda necha navbat?

<details><summary>Yechim</summary>

```
  til           savol   juft (savol+javob)   navbat
  inglizcha        14                  214       37
  ruscha           18                  218       36
  o'zbekcha        25                  225       35
```

> ## 🔧 **MEN KATTA FARQ KUTGAN EDIM — ## `37` VA `35`.**

> ## 🔑 **SABAB — `200` TOKENLIK JAVOB HUKMRON.** ## ## ⭐ Savol farqi *(14 vs 25)* ## 💥 **juftlikda yo'qoladi**.

> ## ⚠️ **1-DARSDAGI `571` VS `320` — ## FAQAT SAVOLLAR SANALGANDA.**
>
> ## ## 💡 Haqiqiy suhbatda farq ## 🏆 **ancha kichik**.

> ## 💥 **LEKIN U QAYTIB KELADI:** ## javob ham o'zbekcha bo'lsa, ## ⭐ **javob ham 1.79x** — ## va farq **yana ochiladi**.
</details>

---

## 🟢 3-mashq. `k` ni o'zgartiring

Bir vaqtda ko'rsatiladigan mavzular sonini `1` dan `10` gacha.

<details><summary>Yechim</summary>

```
     k   jami korilgan
     1             1.0/10
     2             2.0/10
     3             3.0/10
     5             5.0/10
     8             8.0/10
    10            10.0/10
```

> ## 💥💥💥 **`jami korilgan` — AYNAN `k` GA TENG.** ## ## Har doim. Har urug'da.

> ## 🔑 **YA'NI 30 QADAM DAVOMIDA ## HECH QANDAY YANGI MAVZU CHIQMADI.**

> ## 🏆 **VA BU — 2-DARSNING XULOSASINI ## ENG QISQA SHAKLDA KO'RSATADI:** ## ## ⭐ pufak **birinchi qadamda** yopiladi.
</details>

---

## 🟡 4-mashq. So'nish tezligini o'zgartiring

`×1.00` *(so'nish yo'q)* dan `×0.75` *(tez so'nish)* gacha.

<details><summary>Yechim</summary>

```
    sonish   jami korilgan   top-3 ulushi
      1.00             5.0          74.9%
      0.99             5.0          75.5%
      0.97             5.0          76.2%
      0.90             5.0          77.0%
      0.75             5.0          77.1%
```

> ## 💥💥 **SO'NISHNI BUTUNLAY O'CHIRSANGIZ HAM ## (`×1.00`) — HAMON `5.0`.**

> ## 🔧 **MEN SO'NISH AYBDOR DEB O'YLAGAN EDIM.**

> ## 🔑 **HAQIQIY SABAB — `top-k` NING O'ZI.** ## ## ⭐ Agar tizim **har doim eng yuqori 5 tasini** bersa, ## qolgan 5 tasi ## 💥 **hech qachon ko'tarila olmaydi** — ## ular **so'nmasa ham**.

> ## 🏆 **SO'NISH FAQAT `top-3 ulushi` GA TA'SIR QILDI** ## *(74.9% → 77.1%)* — ## ya'ni u pufakni ## ⭐ **qattiqroq** qiladi, ## lekin ## 💥 **yaratmaydi**.
</details>

---

## 🔴 5-mashq. Boshlang'ich qiziqish teng bo'lmasa?

Har foydalanuvchining boshlang'ich qiziqishiga **tasodifiy tarqoqlik**
qo'shing.

<details><summary>Yechim</summary>

```
   tarqoqlik   jami korilgan
        0.00             5.0/10
        0.05             5.0/10
        0.20             5.0/10
        0.50             5.0/10
```

> ## 💥💥💥 **HAMON `5.0`.**
>
> ## ## ⭐ Tarqoqlik ## 🔑 **QAYSI** 5 tasi tanlanishini o'zgartiradi, ## lekin ## 💥 **NECHTASINI emas**.

> ## 🏆🏆 **UCHTA MASHQNING UMUMIY XULOSASI:**
>
> ## | O'zgartirdik | Natija | ## |---|---| ## | `k` | ## ⭐ **Faqat `k` ta** | ## | So'nish | ## 💥 **O'zgarmadi** | ## | Boshlang'ich tarqoqlik | ## 💥 **O'zgarmadi** | ## | ## **Tasodifiy aralashtirish (5%)** | ## 🏆 **5.0 → 8.3** |

> ## 💡 **YAGONA ISHLAYDIGAN NARSA — ## ⭐ ATAYIN QILINGAN TASODIF.**
>
> ## ## 🔑 Va uni ## 💥 **tizim quruvchi** qo'shishi kerak.
</details>

---

## 🟡 6-mashq. Parol so'zi — qamrov muhimmi?

Samaradorlik `90%` da qolsin, **qamrovni** o'zgartiring.

<details><summary>Yechim</summary>

```
    qamrov  samaradorlik   himoyasiz
       10%           90%      15.93%
       30%           90%      12.78%
       60%           90%       8.05%
       90%           90%       3.32%
```

> ## 🔑 **QAMROV `10%` BO'LSA — HIMOYASIZ ULUSH ## `17.5%` DAN ATIGI `15.9%` GA TUSHADI.**

> ## 💥 **YA'NI "MEN BILAMAN" YETARLI EMAS.** ## ## ⭐ Chora ## 🏆 **butun oilada** bo'lishi kerak.

> ## 💡 **AMALIY MA'NOSI:** ## bu darsni ## ⭐ **ota-onangizga aytib bering**. ## ## 🔑 Bu — kodni ## 💥 **hech qachon ko'rmaydigan** odamlar uchun ## eng foydali qism.
</details>

---

## 🟡 7-mashq. Detektor chegarasini ko'taring

**Bitta** kalit so'z o'rniga **ikki** yoki **uchtasini** talab qiling.

<details><summary>Yechim</summary>

*(3-darsdagi HAQIQIY model matnining qisqartirilgan ko'chirmalari)*

```
   chegara   AI topildi   inson xato   aniqlik
         1      0/6          0/6         50%
         2      0/6          0/6         50%
         3      0/6          0/6         50%

  har matnda topilgan kalit so'z soni:
    AI    0  Remote work has become increasingly popular...
    AI    0  Learning a new language can be challenging...
    AI    0  To keep your small garden healthy and productive...
    inson 0  honestly no idea why it broke, worked yesterday??
    inson 0  we tried it, didn't work, moved on
    ...
```

> ## 💥💥💥 **HAMMA MATNDA — `0` TA KALIT SO'Z.**
>
> ## ## ⭐ Detektor **hammasini "inson"** deb belgiladi, ## aniqlik ## 🔑 **50%**.

> ## 🏆🏆 **VA BU — 72-MODULDAGI `AI SUDYA` ## MUAMMOSINING AYNAN O'ZI:**
>
> ## ## ⭐ **50% aniqlik + DOIMIY javob = buzuq.**

```python
if len(set(hukmlar)) == 1:
    print("BUZUQ DETEKTOR")
```

> ## 💡 **VA 3-DARSDA `2/6` TOPILGAN EDI** — ## chunki u yerda ## ⭐ **to'liq matn** ishlatilgan. ## ## 💥 Bu yerda **qisqartma** — ## va kalit so'zlar **kesib tashlangan**.

> ## 🔑 **YA'NI DETEKTOR MATN UZUNLIGIGA ## ⭐ JUDA SEZGIR** — ## bu esa ## 💥 **muallifga umuman aloqasi yo'q**.
</details>

---

## 🔴 8-mashq. Uzunlik detektor bo'la oladimi?

Kalit so'zlar o'rniga **so'zlar sonini** ishlating.

<details><summary>Yechim</summary>

```
  AI    o'rtacha  20.8 so'z  (min 16, max 25)
  inson o'rtacha   9.8 so'z  (min 6, max 14)

  chegara 15 so'z -> aniqlik 100%  (AI 6/6, inson xato 0/6)
```

> ## 🏆 **100% — VA HECH QANDAY KALIT SO'ZSIZ.**

> ## ⚠️⚠️ **LEKIN TO'XTANG. BU — SOXTA G'ALABA.**

### 💥 Uchta sabab

| # | Sabab |
|---|---|
| ① | ## **12 ta namuna.** ## Bu — natija emas, ## ⭐ **tasodif** |
| ② | ## **Men modelga *"ikki jumla yoz"* dedim.** ## Uzunlik — ## 💥 **so'rovning xususiyati**, modelniki emas |
| ③ | ## **Inson matnlarini men tanladim** — ## va ## ⭐ **qisqalarini tanladim** |

> ## 💥💥💥 **YA'NI BU DETEKTOR ## "AI MI?" NI EMAS, ## ⭐ "UZUNMI?" NI O'LCHAYDI.**

> ## 🏆 **VA U — 7-MASHQDAN HAM YOMONROQ,** ## chunki u ## 💥 **ishlaydigandek ko'rinadi**.

> ## 💡 **SINOV:** ## insonga *"ikki paragraf yoz"* deng — ## ## ⭐ detektor uni **darhol "AI" deb belgilaydi**.
</details>

---

## 🟡 9-mashq. Pufakdan chiqish — o'z lentangizni tekshiring

<details><summary>Yechim</summary>

```python
def lenta_auditi(korilgan_manbalar, jami_manbalar):
    """💡 Oxirgi 50 ta postni sanang."""
    xilma = len(set(korilgan_manbalar))
    s = collections.Counter(korilgan_manbalar)
    top3 = sum(v for _, v in s.most_common(3)) / len(korilgan_manbalar)
    return {
        "xilma_xillik": f"{xilma}/{jami_manbalar}",
        "top_3_ulushi": f"{top3:.0%}",
        "hukm": "PUFAK" if top3 > 0.60 else "ochiq",
    }
```

> ## 🔑 **CHEGARA `60%` — MODELIMIZDAN OLINDI:** ## pufak yopilganda `top-3` ulushi ## ⭐ **74.9%–77.1%** edi.

> ## 💡 **VA BU — QO'LDA BAJARILADI:** ## lentangizdagi **oxirgi 50 ta** postning ## ⭐ **manbasini sanang**. ## ## 💥 Uchtasi 60% dan ko'p bo'lsa — **pufakdasiz**.
</details>

---

## 🔴 10-mashq. Shaffoflik sinovi

3-darsdagi savolni **beshta holatga** qo'llang.

<details><summary>Yechim</summary>

> **Savol:** *"Agar men AI ishlatganimni aytsam, natija o'zgaradimi?"*

| Holat | Javob | Xulosa |
|---|---|---|
| Kod yozishda AI yordami | ## Yo'q | ## ✅ Ayting, davom eting |
| ## **Universitet inshosi** | ## 💥 **Ha** | ## 💥 **Aytish SHART** |
| Elektron pochta qoralamasi | Yo'q | ✅ Muammo yo'q |
| ## **Rasm tanlovi** | ## 💥 **Ha** | ## 💥 **Aytish SHART** |
| ## **Tibbiy maslahat** | ## 💥 **Ha** | ## 🏆 **Aytish + shifokorga borish** |

> ## 🏆 **BESHTADAN UCHTASIDA "HA".**

> ## 💡 **VA SAVOLNING KUCHI SHUNDAKI —** ## u *"qancha AI ko'p?"* degan ## 💥 **javobsiz savolni** ## ⭐ **chetlab o'tadi**.

> ## 🔑 **U O'RNIGA SO'RAYDI:** ## *"Kimdir bilsa, ## ⭐ **fikri o'zgaradimi?"*
</details>

---

## 🏁 Yakuniy jadval

| # | Mashq | Asosiy natija |
|---|---|---|
| 1 | ## **Yangi tokenizator** | ## 💥 **Ruscha 54%, o'zbekcha 19%** |
| 2 | Kontekst navbatlari | 🔧 `37` vs `35` — farq kichik |
| 3 | ## **`k` ta'siri** | ## 💥 **Aynan `k` ta, boshqa emas** |
| 4 | ## **So'nish** | ## 🔧 **O'chirilsa ham `5.0`** |
| 5 | Boshlang'ich tarqoqlik | 💥 Hamon `5.0` |
| 6 | Parol so'zi qamrovi | ⚠️ 10% qamrov — deyarli foydasiz |
| 7 | ## **Detektor chegarasi** | ## 💥 **Doimiy javob — 50%** |
| 8 | ## **Uzunlik detektori** | ## 💥 **100% — va soxta** |
| 9 | Lenta auditi | ⭐ `top-3 > 60%` = pufak |
| 10 | Shaffoflik sinovi | 🏆 5 tadan 3 tasi |

---

⬅️ [3-dars](03-Responsible-Use.md) · 🏠 [Modul](README.md)
