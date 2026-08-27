# 📝 73-modul. Mashqlar

> **12 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan** — quyidagi natijalar **haqiqiy chiqish**.

---

## 🟢 1-mashq. Nazorat belgisi

Modelga **butunlay tasodifiy** belgi qo'shing. Tushuntiruvchi unga
nol beradimi?

<details><summary>Yechim</summary>

```
  belgi          muhimlik   HAQIQIY
  tajriba          1.4984       3.0
  indeks           1.2397       2.5
  portfolio        0.7483       1.5
  sertifikat       0.4960       1.0
  talim            0.0000       0.0
  tasodifiy        0.0000       0.0
```

> ## ✅ **`tasodifiy` = 0.0000 — TUSHUNTIRUVCHI SOG'LOM.**

> ## 💡 **BU — ENG ARZON TEKSHIRUV.** ## Bir qator kod, ## va u ## 🏆 **butun auditni haqiqiy qiladi**.

> ## 🔑 **VA E'TIBOR BERING:** ## qolgan qiymatlar haqiqiy og'irliklarga ## ⭐ **aniq proporsional** — ## `1.4984/3.0 ≈ 1.2397/2.5 ≈ 0.4960/1.0 ≈ 0.496`.
</details>

---

## 🟡 2-mashq. Bog'liq belgi qo'shing

`indeks` ning **95% nusxasini** qo'shing *(og'irligi 0)*.
Permutatsiya nima deydi?

<details><summary>Yechim</summary>

```
  belgi            muhimlik   HAQIQIY
  tajriba            1.4974       3.0
  indeks             1.2380       2.5
  portfolio          0.7469       1.5
  sertifikat         0.4989       1.0
  talim              0.0000       0.0
  indeks_nusxa       0.0000       0.0
```

> ## ✅ **NUSXAGA 0 BERDI — TO'G'RI.**
>
> ## ## ⭐ Chunki model uni ## 🔑 **haqiqatan ishlatmaydi**.

> ## ⚠️ **LEKIN BU — OSON HOLAT.** ## Qiyinrog'i ## 💥 **3-mashqda**.
</details>

---

## 🔴 3-mashq. Model og'irlikni **bo'lib yuborsa**

Endi model `indeks` va `indeks_nusxa` ga **1.25 dan** bersin
*(jami 2.5 — o'sha o'zi)*. SHAP nima ko'rsatadi?

<details><summary>Yechim</summary>

```
  belgi               SHAP
  tajriba            3.000
  talim              0.000
  sertifikat         0.000
  indeks             1.250
  portfolio          0.000
  indeks_nusxa       1.250

  indeks + indeks_nusxa = 2.500
```

> ## 💥💥💥 **PROKSI ENDI `1.250` KO'RINADI —** ## `portfolio` ning haqiqiy og'irligidan *(1.5)* ## ## ⭐ **PASTROQ**.

> ## 🔑 **HOLBUKI JAMI TA'SIR — HAMON `2.500`.**

> ## 💥 **BU — PROKSINI YASHIRISHNING ENG OSON YO'LI:** ## uni ## ⭐ **ikkiga bo'ling**. ## ## 🏆 Hech qanday jadval buni ko'rsatmaydi.

> ## 💡 **HIMOYA:** ## ⭐ **korrelyatsiya matritsasini** ham chop eting ## va ## 🔑 **bog'liq belgilarni GURUHLAB** tushuntiring.
</details>

---

## 🟡 4-mashq. Asosiy stavka ta'siri

Firibgarlik darajasini `0.5%` dan `50%` gacha o'zgartiring.
Aniqlik qanday o'zgaradi?

<details><summary>Yechim</summary>

*(sezgirlik 85%, yolg'on bayroq 6%, 10 000 hisob)*

```
    daraja   haqiqiy   bayroq   togri   aniqlik
      0.5%        45      604      39      6.5%
      2.0%       204      719     166     23.1%
      5.0%       504      948     414     43.7%
     20.0%      2041     2180    1728     79.3%
     50.0%      5053     4596    4315     93.9%
```

> ## 💥💥💥 **MODEL O'ZGARMADI. ## ANIQLIK `6.5%` DAN `93.9%` GACHA.**

> ## 🔑 **YA'NI "MODEL ANIQLIGI" — ## ⭐ MODEL XUSUSIYATI EMAS.** ## ## 💥 U **hodisa qanchalik nodir** ekaniga bog'liq.

> ## 🏆 **AMALIY MA'NOSI:** ## sotuvchi *"bizning model 85% aniq"* desa — ## ⚠️ **so'rang**: ## ## 💡 *"Qaysi asosiy stavkada?"*
</details>

---

## 🟡 5-mashq. Yolg'on bayroqni kamaytiring

`6%` dan `0.5%` gacha tushiring. Nima yutasiz, nima yo'qotasiz?

<details><summary>Yechim</summary>

```
   yolgon %   bayroq   aniqlik   topilgan
       6.0%      719     23.1%   166/204 (81%)
       3.0%      445     37.3%   166/204 (81%)
       1.0%      257     64.6%   166/204 (81%)
       0.5%      213     77.9%   166/204 (81%)
```

> ## 🏆 **ANIQLIK `23%` → `78%`,** ## va topilgan firibgarlar ## ⭐ **o'zgarmadi** *(81%)*.

> ## ⚠️⚠️ **LEKIN BU SIMULYATSIYANING CHEGARASI.**
>
> ## ## 🔑 Biz yolg'on bayroqni ## ⭐ **sezgirlikdan MUSTAQIL** o'zgartirdik. ## ## 💥 Haqiqiy modelda chegarani ko'tarish ## **ikkalasini ham** kamaytiradi.

> ## 💡 **TO'G'RI O'QISH:** ## bu jadval *"chegarani ko'taring"* demaydi. ## ## 🏆 U **arzon birinchi filtr** *(qoida)* ## qo'shsangiz nima bo'lishini ko'rsatadi — ## ⭐ u **sezgirlikka tegmay** yolg'on bayroqni kamaytiradi.
</details>

---

## 🟢 6-mashq. *"AI kerakmi?"* qaror daraxti

Oltita vazifani daraxtdan o'tkazing.

<details><summary>Yechim</summary>

```python
def ai_kerakmi(v):
    if v["ogir"]:    return "INSON (oqibat og'ir)"
    if v["qoida"]:   return "QOIDA / SO'ROV (AI kerak emas)"
    if v["bir_xil"]: return "SHABLON"
    if v["erkin"]:   return "AI FOYDALI"
    return "aniqlanmadi"
```

```
  Buyurtma holatini aytish         -> QOIDA / SO'ROV (AI kerak emas)
  Qaytarish siyosati               -> QOIDA / SO'ROV (AI kerak emas)
  Mahsulot tavsifi yozish          -> AI FOYDALI
  Shikoyatni tasniflash            -> AI FOYDALI
  Kreditni tasdiqlash              -> INSON (oqibat og'ir)
  Xodimni ishdan bo'shatish        -> INSON (oqibat og'ir)
```

> ## 🏆 **OLTITADAN IKKITASIDA "AI FOYDALI".**

> ## ⚠️ **VA TARTIB MUHIM:** ## `ogir` tekshiruvi ## ⭐ **birinchi** turadi. ## ## 💥 *"Kreditni tasdiqlash"* qoida bilan hal bo'ladi, ## lekin oqibati og'ir — ## 🔑 **inson qarori**.
</details>

---

## 🟡 7-mashq. Til jarimasi matnga bog'liqmi?

Bitta jumlani `1`, `5`, `20`, `100` marta takrorlang.

<details><summary>Yechim</summary>

```
   takror  EN token  UZ token   nisbat
        1        21        53     2.52x
        5       101       261     2.58x
       20       401      1041     2.60x
      100      2001      5201     2.60x
```

> ## 💥 **`2.60x` — VA 1-DARSDA `1.57x` EDI.**
>
> ## ## 🔑 **BIR XIL TILLAR, BOSHQA NISBAT.**

> ## ⭐ **SABAB — MATNNING O'ZI.** ## Bu jumlada ## 💡 **`o'`, `g'`, apostroflar** ko'p, ## va tokenizator ularni ## 💥 **alohida ajratadi**.

> ## 🏆 **AMALIY QOIDA:** ## til jarimasini ## ⭐ **O'Z matningizda** o'lchang. ## ## 💥 Umumiy raqamga ishonmang — ## u `1.1x` dan `2.6x` gacha o'zgaradi.
</details>

---

## 🟡 8-mashq. Xavf reyestri testi

`reyestr_testi()` ni yozing va **chiqishini o'qing**.

<details><summary>Yechim</summary>

```
AssertionError: 4 ta yuqori xavf CHORASIZ:
  Model soxta asosni qabul qiladi (ball 20, toifa operatsion)
  Nomuvofiq javoblar (ball 16, toifa operatsion)
  Sudya buzuq (ball 15, toifa operatsion)
  Rozilik yozuvi to'liq emas (ball 20, toifa regulyativ)
```

> ## ⚠️ **BALLAR: `20, 16, 15, 20` — SARALANMAGAN.**
>
> ## ## 🔑 Funksiya ## ⭐ **asl ro'yxat tartibini** saqlaydi.

> ## 💡 **TUZATISH — BIR QATOR:**
>
> ## ## ⭐ `ochiq = sorted(ochiq, key=lambda x: -x[2])`

> ## 🏆 **VA BU — KICHIK, LEKIN MUHIM:** ## chiqishni o'qigan odam ## 💥 **birinchi qatorga** qaraydi.
</details>

---

## 🔴 9-mashq. LIME ni **xavfsiz** qiling

LIME chiqishini **noto'g'ri o'qib bo'lmaydigan** qilib yozing.

<details><summary>Yechim</summary>

```python
def lime_hisoboti(koef, x):
    """💡 Koeffitsientni HECH QACHON yolg'iz ko'rsatmang."""
    satrlar = []
    for b, k in sorted(koef.items(), key=lambda kv: -abs(kv[1])):
        if abs(k) < 0.01:
            satrlar.append(f"{b}: ta'siri yo'q")
        elif x[b] == 1 and k > 0:
            satrlar.append(f"{b} BOR — bu FOYDA berdi (+{k:.2f})")
        elif x[b] == 0 and k < 0:
            satrlar.append(f"{b} YO'Q — bo'lganda FOYDA berardi ({-k:+.2f})")
        elif x[b] == 1 and k < 0:
            satrlar.append(f"{b} BOR — bu ZARAR qildi ({k:.2f})")
        else:
            satrlar.append(f"{b} YO'Q — va bu FOYDA berdi (+{k:.2f})")
    return satrlar
```

```
tajriba BOR — bu FOYDA berdi (+0.62)
portfolio YO'Q — bo'lganda FOYDA berardi (+0.40)
indeks BOR — bu FOYDA berdi (+0.35)
sertifikat YO'Q — bo'lganda FOYDA berardi (+0.14)
talim: ta'siri yo'q
```

> ## 🏆 **ENDI `−0.398` NI ## NOTO'G'RI O'QIB BO'LMAYDI.**

> ## 💡 **VA BU — HR MENEJERIGA ## KO'RSATILADIGAN YAGONA SHAKL.**
</details>

---

## 🟡 10-mashq. Inson quvvatini rejalashtiring

Kuniga `1000` hisob, `2%` firibgarlik. Bir tekshiruv `12` daqiqa.
Nechta xodim kerak?

<details><summary>Yechim</summary>

```
  bayroq/kun:              68
  bir tekshiruv:           12 daqiqa
  jami:                    816 daqiqa = 13.6 soat/kun
  8 soatlik xodim:         1.7  ->  2 ta xodim
```

> ## ⚠️ **IKKI XODIM — 68 TA BAYROQ UCHUN,** ## ulardan ## 💥 **49 tasi yolg'on**.

> ## 💥💥 **YA'NI XODIMLAR VAQTINING 72% I ## AYBSIZ MIJOZLARGA SARFLANADI.**

> ## 🏆 **VA BU — 5-MASHQNING SABABI:** ## arzon birinchi filtr ## ⭐ **bitta xodimni tejaydi**, ## va u ## 🔑 **model qayta o'qitishdan arzonroq**.
</details>

---

## 🟡 11-mashq. `SHAP(ball)` vs `SHAP(qaror)` — o'z modelingizda

Chegarani `4.0` dan `2.0` va `6.0` ga o'zgartiring.

<details><summary>Yechim</summary>

> ## 🔧 **MEN CHEGARA `2.0` DA NOL KUTGAN EDIM** ## *("nomzod baribir o'tadi")*.

### ✅ Haqiqiy natija *(nomzod balli `5.5`, asos balli `0.0`)*

```
   chegara  SHAP(qaror): tajriba / indeks   izoh
       2.0       0.500 / 0.500
       4.0       0.500 / 0.500
       6.0       0.000 / 0.000          nomzod RAD
```

> ## 💥 **NOLLAR `6.0` DA CHIQDI, `2.0` DA EMAS.**
>
> ## ## 🔑 **SABAB — MEN ASOSNI UNUTGAN EDIM.** ## SHAP nomzodni ## ⭐ **asos bilan** solishtiradi, ## va asosning balli — ## 💡 **`0.0`**.

| Chegara | Asos | Nomzod | SHAP |
|---|---|---|---|
| ## **2.0** | ## rad *(0 < 2)* | ## qabul *(5.5 ≥ 2)* | ## ⭐ **farq bor** |
| ## **4.0** | rad | qabul | ⭐ farq bor |
| ## **6.0** | ## rad | ## 💥 **rad** *(5.5 < 6)* | ## 💥 **farq YO'Q → 0** |

> ## 🏆 **YA'NI `SHAP(qaror)` HAMMA HISSANI ## NOLGA AYLANTIRADI,** ## agar nomzod ## ⭐ **baribir rad etilsa** — ## garchi u chegaradan ## 💡 **atigi 0.5 ball uzoq** bo'lsa ham.

> ## 🏆 **YANA O'SHA XULOSA:** ## ⭐ **BALLNI tushuntiring.**
</details>

---

## 🔴 12-mashq. To'liq tayyorlik hisoboti

73-modulning hamma tekshiruvini bitta funksiyaga yig'ing.

<details><summary>Yechim</summary>

```python
def biznes_tayyorligi(holat):
    natija = {}
    natija["ai_kerakmi"]      = ai_kerakmi(holat["vazifa"])
    natija["tushuntiruvchi"]  = holat.get("ball_tushuntiriladi", False)
    natija["nazorat_belgisi"] = holat.get("nazorat_belgisi_nol", False)
    natija["asosiy_stavka"]   = holat.get("stavka_malum", False)
    natija["inson_quvvati"]   = holat["quvvat"] >= holat["bayroq_soni"]
    natija["qaytarish_yoli"]  = holat.get("qaytarish", False)
    natija["reyestr"]         = holat.get("chorasiz_xavf", 1) == 0
    return natija
```

```
  ai_kerakmi        AI FOYDALI
  tushuntiruvchi    False   <- QARORNI tushuntiryapmiz
  nazorat_belgisi   False   <- tushuntiruvchi sinalmagan
  asosiy_stavka     False   <- "85% aniq" degan sondan boshqa hech nima
  inson_quvvati     False   <- 60 < 68
  qaytarish_yoli    False
  reyestr           False   <- 4 ta chorasiz xavf

  1/7
```

> ## 💥💥💥 **1/7 — VA YAGONA "OK" ## SHUNCHAKI "AI FOYDALI" DEGAN JAVOB.**

> ## 🏆 **YA'NI BIZ AI DAN FOYDALANISH ## KERAKLIGINI BILAMIZ,** ## lekin ## 💥 **undan xavfsiz foydalanishni bilmaymiz**.
</details>

---

## 🏁 Yakuniy jadval

| # | Mashq | Asosiy natija |
|---|---|---|
| 1 | Nazorat belgisi | ✅ `0.0000` — sog'lom |
| 2 | Bog'liq belgi | ✅ Nusxaga `0` berdi |
| 3 | ## **Og'irlik bo'lingan** | ## 💥 **Proksi `1.250` ko'rindi** |
| 4 | ## **Asosiy stavka** | ## 💥 **Aniqlik `6.5%` → `93.9%`** |
| 5 | Yolg'on bayroq | 🏆 `23%` → `78%` |
| 6 | *"AI kerakmi?"* | ⭐ 6 tadan 2 tasi |
| 7 | ## **Til jarimasi** | ## 💥 **`1.57x` yoki `2.60x` — matnga bog'liq** |
| 8 | Reyestr testi | ⚠️ Saralanmagan |
| 9 | ## **LIME hisoboti** | ## 🏆 **Noto'g'ri o'qib bo'lmaydi** |
| 10 | Inson quvvati | 💥 Vaqtning 72% i aybsizlarga |
| 11 | ## **Chegara `6.0`** | ## 🔧 **Taxminim teskari edi** |
| 12 | ## **Tayyorlik** | ## 💥 **1/7** |

---

⬅️ [4-dars](04-Responsible-Adoption.md) · 🏠 [Modul](README.md)
