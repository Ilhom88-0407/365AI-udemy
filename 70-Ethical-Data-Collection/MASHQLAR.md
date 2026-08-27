# 📝 70-modul. Mashqlar

> **14 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan**.

---

## 🟢 1-mashq. Manba jurnali

<details><summary>Yechim</summary>

```
Ichki intervyu arxivi      [xususiy  ] ichki
    ✅ muammo topilmadi
Common Crawl               [ommaviy  ] noma'lum
    💥 rozilik yo'q
    💥 litsenziya noma'lum
Kaggle intervyu to'plami   [ommaviy  ] CC-BY-SA
    ⚠️ rozilik faqat nazarda tutilgan
Forum skreypi              [skreyp   ] ToS taqiqlaydi
    💥 rozilik yo'q
    ⚠️ robots.txt tekshirilmagan
Hamkor MB                  [xususiy  ] shartnoma
    ✅ muammo topilmadi
```
</details>

---

## 🟡 2-mashq. Rolga qarab maydon filtri

<details><summary>Yechim</summary>

```
mehmon     {'ism': '***', 'email': '***', 'lavozim': '***', 'ball': '***', 'javob_matni': '***'}
tahlilchi  {'ism': '***', 'email': '***', 'lavozim': 'ML Engineer', 'ball': 7, 'javob_matni': '***'}
hr         {'ism': 'Aziz Karimov', 'email': '***', 'lavozim': 'ML Engineer', 'ball': 7, ...}
admin      {'ism': 'Aziz Karimov', 'email': 'a@example.com', ...}

💥 noma'lum maydon: video -> DEFAULT DENY
💥 noma'lum rol: noma'lum_rol
```

> ## ⭐ **`tahlilchi` STATISTIKA QILA OLADI, ## LEKIN KIMLIGINI BILMAYDI.**
</details>

---

## 🟡 3-mashq. Ma'lumot pasporti

<details><summary>Yechim</summary>

```
Shahar trafigi 2021
    💥 eskirgan: 1913 kun (5.2 yil)
    ⚠️ GEOLOKATSIYA bor — anonimlashtirish SHART
Ish e'lonlari
    ⚠️ bo'sh qiymatlar: 8%
Intervyu savollari
    💥 eskirgan: 909 kun (2.5 yil)
    💥 litsenziya noma'lum
    💥 manba ko'rsatilmagan
Nomzod so'rovi
    💥 bo'sh qiymatlar: 35%
    ⚠️ kichik to'plam: 340 qator
```
</details>

---

## 🔴 4-mashq. 💥 Bo'sh qiymatlar biasi

<details><summary>Yechim</summary>

```
yosh guruhi      jami    bo'sh    ulush
20-29             219      32    14.6%
30-39             212      48    22.6%
40-49             238      80    33.6%
50-59             201      94    46.8%
60-69             130      67    51.5%
```

> ## 💥 **`dropna()` KEKSALARNING YARMINI YO'QOTADI.** ## ⭐ 20–29: **14.6%**, 60–69: **51.5%** *(3.5×)*.
</details>

---

## 🟡 5-mashq. 🤖 `robots.txt` tahlilchisi

<details><summary>Yechim</summary>

```
MyBot      /public/jobs     ✅ MUMKIN         agent=MyBot delay=None
MyBot      /jobs            💥 TAQIQLANGAN    agent=MyBot delay=None
GPTBot     /anything        💥 TAQIQLANGAN    agent=GPTBot delay=None
*          /private/data    💥 TAQIQLANGAN    agent=* delay=10.0
*          /jobs            ✅ MUMKIN         agent=* delay=10.0
BoshqaBot  /api/v1          💥 TAQIQLANGAN    agent=BoshqaBot delay=10.0
```

> ## 🏆 **ENG UZUN MOS QOIDA G'OLIB:** ## `/public/` *(8 belgi)* > `/` *(1 belgi)*.
</details>

---

## 🟡 6-mashq. 📄 Litsenziya tekshiruvchisi

<details><summary>Yechim</summary>

```
Common Crawl           noma'lum         💥 TAQIQ
Wikipedia              CC-BY-SA         ✅ MUMKIN
Flickr rasm            CC-BY-NC         💥 TAQIQ
O'z mijoz ma'lumoti    MIT              ✅ MUMKIN
Forum posti            ToS taqiqlaydi   💥 TAQIQ
Kitob matni            CC-BY-ND         💥 TAQIQ
Yangi manba            Apache-2.0       ⚠️ NOANIQ
```

> ## 🏆 **`Apache-2.0` — "BILMAYMAN".** ## ⭐ Kod *"mumkin"* deb **taxmin qilmadi**.
</details>

---

## 🔴 7-mashq. 🛑 Skreyping tekshiruv ro'yxati

<details><summary>Yechim</summary>

```
ochiq API              ✅ MUMKIN
Mumsnet kabi forum     🛑 TO'XTATING
    💥 robots.txt TAQIQLAYDI
    💥 Foydalanish shartlari taqiqlaydi
    💥 litsenziya: False
    💥 shaxsiy ma'lumot + anonimlashtirish yo'q
    ⚠️ crawl-delay belgilanmagan
ish e'lonlari sayti    🛑 TO'XTATING
    💥 litsenziya: False
```

> ## 🔧 **`\U0001f4a5 litsenziya: False` — MENING KODIMDAGI XATO:** ## `MOSLIK` jadvali izoh qaytarmaydi. ## ⭐ Tuzatish: jadvalga `(natija, izoh)` juftligi.
</details>

---

## 🔴 8-mashq. 💥 `k`-anonimlik

<details><summary>Yechim</summary>

```
kvazi-identifikator ['yosh', 'shahar', 'lavozim']   k=  1  yolg'iz=159/200
kvazi-identifikator ['shahar', 'lavozim']           k=  4  yolg'iz=0/200
kvazi-identifikator ['lavozim']                     k= 44  yolg'iz=0/200
```

> ## 💥 **ISM O'CHIRILDI — 159 ODAM ANIQLANADI.**
</details>

---

## 🔴 9-mashq. Umumlashtirish yordam beradimi?

<details><summary>Yechim</summary>

```
yosh qadami=  1  k=  1  yolg'iz=159  💥
yosh qadami=  5  k=  1  yolg'iz= 54  💥
yosh qadami= 10  k=  1  yolg'iz= 15  💥
yosh qadami= 20  k=  1  yolg'iz=  1  💥
```

> ## 🔧 **MEN 20 YILLIK ORALIQ YETARLI DEB O'YLAGAN EDIM — YO'Q.** ## ⭐ `k` hali ham **1**.
</details>

---

## 🔴 10-mashq. `l`-xilma-xillik

<details><summary>Yechim</summary>

```
l (eng kam xilma-xillik) = 1
💥 (talab l>=3)
  guruh ('40-59', 'Namangan', 'Data Scientist'): ballar=[4]
```
</details>

---

## 🔴 11-mashq. 🏆 To'liq anonimlashtirish quvuri

<details><summary>Yechim</summary>

```
kirish: 200  saqlandi: 43  o'chirildi: 157
sabablar: {'k < k_min': 157}
saqlanish ulushi: 21.5%

  200 yozuv  ->  saqlandi    43 ( 21.5%)
  500 yozuv  ->  saqlandi   437 ( 87.4%)
 1000 yozuv  ->  saqlandi   992 ( 99.2%)
 2000 yozuv  ->  saqlandi  2000 (100.0%)
 5000 yozuv  ->  saqlandi  5000 (100.0%)
```

> ## 🏆 **ANONIMLIK — MIQDOR MASALASI.** ## 200 yozuvda **21.5%**, 1 000 da — **99.2%**.
</details>

---

## 🟡 12-mashq. 📊 Vakillik auditi — marginal

<details><summary>Yechim</summary>

```
daraja       turlar= 3  nisbat=0.924 ✅
lavozim      turlar= 5  nisbat=0.886 ✅
kompaniya    turlar= 8  nisbat=0.856 ✅
kategoriya   turlar= 8  nisbat=0.446 💥
```
</details>

---

## 🔴 13-mashq. 💥💥 Kesishma tekshiruvi

<details><summary>Yechim</summary>

```
--- marginal ---
  lavozim                  0.886 ✅
  daraja                   0.924 ✅
  intervyu                 0.995 ✅
--- kesishma ---
  daraja x lavozim         0.713 💥  eng kam: ('Senior','Data Engineer') (82)
  lavozim x intervyu       0.764 💥  eng kam: ('BI Analyst','texnik') (139)
  daraja x intervyu        0.877 ✅

daraja x lavozim x intervyu  0.529 💥  eng kam: ('Senior','BI Analyst','texnik') (36)
```

> ## 💥💥 **MARGINAL 3/3 O'TDI, KESISHMA 2/3 YIQILDI.** ## ⭐ Uch o'lchovli — **0.529**.
>
> ## ## 🔑 **MARGINAL TENGLIK KESISHMA TENGSIZLIGINI YASHIRADI.**
</details>

---

## 🔴 14-mashq. 🏆 To'liq ma'lumot auditi

<details><summary>Yechim</summary>

```
════════════════════════════════════════════════
  MA'LUMOT AUDITI: intervyu savollari bazasi
════════════════════════════════════════════════
  manba              💥 ko'rsatilmagan
  litsenziya         💥 noma'lum
  yosh               💥 909 kun (2.5 yil)
  PII                ⚠️ tekshirilmagan
  anonimlik (k)      ⚠️ qo'llanilmagan
  vakillik (marginal) ✅ 3/3
  vakillik (kesishma) 💥 1/3
  ──────────────────────────────────────────────
  4 KRITIK, 2 OGOHLANTIRISH, 1 O'TDI
  💥 ISHLATISHDAN OLDIN TUZATISH KERAK
════════════════════════════════════════════════
```

> ## 💥 **VA BU — BIZNING O'Z BAZAMIZ** *(66-modul)*.
>
> ## ## 🔑 **BIRINCHI IKKITA QATOR — ENG OSON TUZATILADI:** ## manba va litsenziyani **yozib qo'yish** ## ⭐ **bepul**.
</details>

---

🏠 [Modul](README.md) · ⬅️ [6-dars](06-Data-Bias-and-Representation.md)
