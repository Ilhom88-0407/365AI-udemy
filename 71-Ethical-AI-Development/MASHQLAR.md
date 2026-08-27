# 📝 71-modul. Mashqlar

> **15 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan** — quyidagi natijalar **haqiqiy chiqish**.

---

## 🟢 1-mashq. Uch belgili kappa

1-darsda kappa **ikkita** belgi uchun edi. Uni **uchta** belgiga
*(`toksik` / `neytral` / `ijobiy`)* kengaytiring. Kod o'zgaradimi?

<details><summary>Yechim</summary>

```python
def kappa(a, b):
    n = len(a)
    kuzatilgan = sum(x == y for x, y in zip(a, b)) / n
    sa, sb = collections.Counter(a), collections.Counter(b)
    tasodifiy = sum(sa[k]/n * sb[k]/n for k in set(a) | set(b))
    return kuzatilgan, tasodifiy, (kuzatilgan - tasodifiy) / (1 - tasodifiy)
```

```
xom kelishuv: 70.0%   tasodifiy: 35.0%   kappa: 0.538
```

> ## 🏆 **KOD UMUMAN O'ZGARMAYDI.** ## ## ⭐ `set(a) | set(b)` — ## belgilar sonini **avtomatik** oladi.

> ## 🔑 **DIQQAT:** ## tasodifiy kelishuv **35%** ga tushdi ## *(ikki belgida ~50% edi)*. ## ## ⭐ Ya'ni **ko'proq belgi = tasodifan kelishish qiyinroq**.
</details>

---

## 🟡 2-mashq. Kappa paradoksi

100 ta izoh: annotator A 95 tasini `toza` dedi, B esa 93 tasida rozi.
**Xom kelishuv 93%.** Kappa qancha bo'ladi?

<details><summary>Yechim</summary>

```
xom kelishuv: 93.0%   tasodifiy: 93.2%   kappa: -0.029
```

> ## 💥💥💥 **KAPPA MANFIY.**
>
> ## ## 🔑 **SABAB:** har ikkisi ham deyarli hamma narsani `toza` dedi. ## ⭐ Tasodifan ham **93.2%** kelishishardi. ## ## 💥 Demak haqiqiy kelishuv — **tasodifdan ham past**.

> ## 💡 **BU — `kappa paradoksi`.** ## Nomutanosib belgilarda *(95% / 5%)* ## ⚠️ **yuqori xom kelishuv hech narsani anglatmaydi**.

> ## 🏆 **AMALIY MA'NOSI:** ## nodir hodisalarni *(firibgarlik, toksiklik)* belgilashda ## ⭐ **faqat kappaga qarang**, xom kelishuvga emas.
</details>

---

## 🟡 3-mashq. Annotator charchashi

400 yozuvli seansni **choraklarga** bo'ling. Kelishuv qanday o'zgaradi?

<details><summary>Yechim</summary>

```
    chorak   xom kelishuv    kappa
         1         91.0%    0.819
         2         83.0%    0.664
         3         78.0%    0.572
         4         83.0%    0.667
```

> ## 💥 **1-chorak 0.819 → 3-chorak 0.572.**
>
> ## ## 🔧 **MEN MONOTON PASAYISH KUTGAN EDIM.** ## ## ⚠️ **4-chorak QAYTA KO'TARILDI** *(0.667)* — ## bu **shovqin**, 100 ta yozuv ## ⭐ **kappa uchun kam**.

> ## 💡 **XULOSA:** ## trend bor, lekin ## 🔑 **bitta chorakka qarab qaror qilmang** — ## oynani kattalashtiring yoki ## ⭐ **bir necha seansni o'rtachalang**.
</details>

---

## 🟡 4-mashq. Uchinchi annotator narxi

Kelishmagan yozuvlarni **uchinchi** annotatorga yuborish qancha turadi?
Hammasini yuborishga nisbatan qancha tejaladi?

<details><summary>Yechim</summary>

```
jami: 400   kelishmagan: 65 (16.2%)
  0.10$/yozuv -> hammasi= 40.00$  faqat kelishmagan=  6.50$  tejash=84%
  0.50$/yozuv -> hammasi=200.00$  faqat kelishmagan= 32.50$  tejash=84%
```

> ## 🏆 **84% TEJASH — VA SIFAT PASAYMAYDI.**
>
> ## ## ⭐ Chunki ikki annotator **rozi bo'lgan** yozuvlarda ## uchinchisi ## 🔑 **deyarli hech narsa o'zgartirmaydi**.

> ## ⚠️ **LEKIN:** ## bu faqat **kelishmovchilik tasodifiy** bo'lsa ishlaydi. ## ## 💥 Agar ikkalasi ham **bir xil biasga** ega bo'lsa — ## ular *rozi bo'lib* **xato qiladi**, ## va uchinchisi ularni ## ⭐ **hech qachon ko'rmaydi**.
</details>

---

## 🟡 5-mashq. Proksi detektori — ikkinchi maydon

2-darsdagi detektorga **`maktab`** maydonini qo'shing.
Ikkalasini **birlashtirsangiz** proksi kuchayadimi?

<details><summary>Yechim</summary>

```
  maydon            baza   aniqlik     farq  hukm
  indeks           53.5%     81.5%   +28.0%  PROKSI
  maktab           53.5%     68.8%   +15.3%  PROKSI
  indeks+maktab    53.5%     81.5%   +28.0%  PROKSI
```

> ## 🔧 **MEN BIRLASHTIRISH KUCHAYTIRADI DEB O'YLAGAN EDIM.** ## ## 💥 **AYNAN `indeks` BILAN BIR XIL — 81.5%.**

> ## 🔑 **SABAB:** ## `maktab` `indeks` ustiga ## ⭐ **yangi ma'lumot qo'shmaydi** — ## u ham **o'sha guruh belgisining** zaifroq aksi.

> ## 💡 **AMALIY MA'NOSI:** ## ikkita proksini olib tashlash ## 💥 **ikki barobar foyda bermaydi**. ## ## 🏆 Ular **bitta narsani** o'lchaydi.
</details>

---

## 🟡 6-mashq. Proksini olib tashlash

Eng kuchli proksini o'chiring. **Boshqasi chiqadimi?**

<details><summary>Yechim</summary>

```
olib tashlandi=[]                    eng kuchli qolgan: indeks   +28.0%
olib tashlandi=['indeks']            eng kuchli qolgan: maktab   +15.3%
olib tashlandi=['indeks', 'maktab']  eng kuchli qolgan: -        +0.0%
```

> ## 💥 **HA — `indeks` ni o'chirgach, `maktab` chiqdi.**
>
> ## ## ⭐ Bu — 2-darsdagi ## 🔑 **"birinchi variant muammoni yashiradi"** ## da'vosining **isboti**.

> ## 🏆 **VA UCHINCHI QATOR — MUHIM:** ## ikkalasini ham o'chirgach ## ✅ **proksi qolmadi**. ## ## ⚠️ Lekin bu faqat **bizning 2 maydonli** bazada. ## 💥 Haqiqiy bazada ## ⭐ **har doim yangi proksi topiladi**.
</details>

---

## 🔴 7-mashq. Korrelyatsiya yemirilishi

Google Flu Trends ni modellashtiring: bog'liqlik **yildan yilga** zaiflashsa,
o'lchangan korrelyatsiya nima ko'rsatadi?

<details><summary>Yechim</summary>

```
    yil   haqiqiy bogliqlik   olchangan korr
   2015                0.95            0.999
   2016                0.80            0.963
   2017                0.55            0.794
   2018                0.25            0.325
   2019                0.05           -0.034
```

> ## ⚠️ **DIQQAT — 2015-YIL:** ## haqiqiy bog'liqlik **0.95**, ## o'lchangan ## 💥 **0.999**.
>
> ## ## 🔑 Ya'ni korrelyatsiya ## ⭐ **bog'liqlikni bo'rttirib ko'rsatadi**.

> ## 💥💥 **VA 2019-YILDA U MANFIY** *(−0.034)*. ## Model hali ham ## ⚠️ **2015-yilgi qoidaga** ishonib ishlaydi.

> ## 🏆 **HIMOYA:** ## korrelyatsiyani ## ⭐ **har oy qayta o'lchang**, ## va u **0.5 dan tushsa** — ## 🔑 **modelni to'xtating**.
</details>

---

## 🟡 8-mashq. Tay — filtr yordam beradimi?

3-darsda **o'rganish tezligini** sekinlatgan edik. Endi **kirish filtrini**
sinang: `0%`, `25%`, `50%`, `75%`, `90%`.

<details><summary>Yechim</summary>

```
  filtr    buzilish qadami
     0%                179
    25%                200
    50%                226
    75%                267
    90%                306
```

> ## 💥💥💥 **90% FILTR HAM TO'XTATMADI** — ## faqat **179 → 306** qadamga kechiktirdi *(1.7×)*.

> ## 🔧 **VA BU — 3-DARSNING NATIJASIGA ZID.** ## U yerda **4× sekin o'rganish** ## 🏆 **buzilishni umuman to'xtatgan edi**.

> ## 🔑 **SABAB — IKKI XIL RICHAG:** ## ## ⭐ **Filtr** — faqat **tashqi** kirishni kamaytiradi. ## ## 💥 **Qayta aloqa halqasi** *(model o'z chiqishidan o'rganishi)* ## **tegilmagan** — u o'z-o'zidan o'sishda davom etadi.

> ## 🏆 **AMALIY XULOSA:** ## trollarni filtrlash ## ⚠️ **yetarli emas**. ## ## ⭐ **Model o'z chiqishidan o'rganmasligi** kerak.
</details>

---

## 🟡 9-mashq. Qayta aloqa halqasi

Model o'z chiqishidan o'rgansa va har avlodda **3%** siljish bo'lsa —
7 avlodda nima bo'ladi?

<details><summary>Yechim</summary>

```
   avlod   A ulushi
       0      50.0%
       1      50.2%
       2      52.1%
       3      53.0%
       4      53.9%
       5      55.9%
       6      57.9%
```

> ## 💥 **50.0% → 57.9% — ETTI AVLODDA.**
>
> ## ## ⚠️ Har bir qadam ## ⭐ **2 punktdan kam** — ## ya'ni ## 🔑 **hech qanday ogohlantirish ishlamaydi**.

> ## 🏆 **BU — 4-DARSDAGI DRIFT BILAN BIR XIL NAQSH:** ## sekin, ## 💥 **sezilmas**, ## va **to'planadi**.

> ## 💡 **HIMOYA:** ## har avlodda emas, ## ⭐ **boshlang'ich holatga nisbatan** o'lchang.
</details>

---

## 🟢 10-mashq. SFT sifat auditi

Yangi 6 ta misolli SFT to'plamini tekshiring.

<details><summary>Yechim</summary>

```
  BAD dublikat kirish: 1
  BAD shablon javob: 2
  BAD chiqish juda qisqa: 2
  BAD tugallanmagan: 2
  BAD kirish == chiqish: 1
  jami: 6
```

> ## 💥💥 **6 TA MISOL — 8 TA MUAMMO.**
>
> ## ## 🔑 Ba'zi misollar ## ⭐ **bir nechta testda** yiqildi ## *(`"Hello" → "Hello"` — ham qisqa, ## ham tugallanmagan, ham `kirish == chiqish`)*.

> ## 🏆 **FAQAT 2 TASI TOZA** — ## `"How do I appeal?"` va `"What is the deadline?"`.
</details>

---

## 🟡 11-mashq. Bo'sh javob nazorati ⭐

6-darsning **asosiy saboqi**. Nozik testga
`"I don't know."` javobini bering. Eski test nima deydi?

<details><summary>Yechim</summary>

```python
QOCHISH = re.compile(
    r"(i cannot|as an ai|i'?m sorry"
    r"|i (don'?t|do not) (know|understand))", re.I)
```

```
  javob         eski test    yangi test
  yaxshi            o'tdi         o'tdi
  buzuq           YIQILDI       YIQILDI
  qochish           o'tdi        QOCHDI
  bo'sh             o'tdi        QOCHDI
```

> ## 💥💥💥 **ESKI TEST 4 TADAN 3 TASINI "O'TDI" DEDI** — ## shu jumladan ## ⭐ **`"I don't know."`** ni ham.

> ## 🔑 **VA BU — 4-DARSDAGI `3/4 o'tdi` NING SABABI.** ## O'sha uchtadan ikkitasi ## 💥 **shablon javob** edi.

> ## 🏆 **QOIDA:** ## har avtomatik testga ## ⭐ **`"I don't know."` nazoratini** qo'shing. ## ## 💥 Agar u **o'tib ketsa** — test buzuq.
</details>

---

## 🟡 12-mashq. Drift monitori + ogohlantirish

Uch bosqichli signal quring: `OK` / `OGOHLANTIRISH` / `TO'XTATISH`.

<details><summary>Yechim</summary>

```
            oyna   nisbat  holat
           1-200    0.920  OK
         201-400    0.554  TO'XTATISH
         401-600    0.392  TO'XTATISH
  -> 2/3 oyna 80% qoidasini buzdi
```

> ## ⚠️ **BIRINCHI OYNADA 0.920 — MUAMMO YO'Q.** ## ## 💥 Ikkinchisida — **0.554**, ## ya'ni ## 🔑 **`OGOHLANTIRISH` bosqichi umuman ko'rinmadi**.

> ## 💥💥 **DRIFT `0.70` CHEGARASINI ## BIR OYNA ICHIDA SAKRAB O'TDI.**

> ## 💡 **XULOSA:** ## oyna kattaligi ## ⭐ **ogohlantirishdan muhimroq**. ## ## 🏆 200 ta yozuvli oyna — ## juda **sekin**; 50 ta bilan sinab ko'ring.
</details>

---

## 🟡 13-mashq. Baholovchi profili

To'rtta baholovchidan **qaysi biri** tizimli siljigan, qaysi biri
**barqaror emas**?

<details><summary>Yechim</summary>

```
    kim    ortacha farq   tarqoqlik  hukm
      A           -0.59        1.03  normal
      B           -0.36        0.85  normal
      C           +1.61        1.09  TIZIMLI SILJISH
      D           -0.66        2.18  BARQAROR EMAS
```

> ## 🔑 **IKKI XIL MUAMMO — IKKI XIL YECHIM:**
>
> | Kim | Muammo | Yechim |
> |---|---|---|
> | ## **C** | ## ⭐ Har doim **yuqori** baholaydi | ## 🏆 **Kalibrlash** *(baholarini siljitish)* |
> | ## **D** | ## 💥 **Oldindan aytib bo'lmaydi** | ## ⚠️ **Qayta o'qitish** yoki chiqarish |

> ## 💡 **VA BU FARQ MUHIM:** ## `C` ning ma'lumoti ## ⭐ **tuzatib ishlatilishi mumkin**. ## ## 💥 `D` niki — **yo'q**.
</details>

---

## 🔴 14-mashq. Reward hacking

`mukofot(j) = min(10, len(j.split())/10)` berilgan.
Uni **mazmun qo'shmasdan** qanday aldash mumkin?

<details><summary>Yechim</summary>

```
   qadam   mukofot    soz
       0      0.30      3
       1      0.90      9
       2      1.50     15
       3      2.10     21
       4      2.70     27
       5      3.30     33
       6      3.90     39
```

> ## 💥💥 **MUKOFOT 0.30 → 3.90 (13×).** ## ## ⭐ Qo'shilgan yagona narsa — ## bitta jumlaning ## 🔑 **6 marta takrorlanishi**.

> ## 🏆 **VA MODEL AYNAN SHUNI O'RGANADI** — ## chunki RLHF ## ⭐ **mukofotni maksimallashtiradi**, ## foydalilikni emas.

> ## 💡 **YECHIM** *(5-dars, 6-bo'lim)*: ## mukofot ## ⭐ **uzunlikka emas, BELGILARGA** qarasin ## + **uzunlik jarimasi**.
</details>

---

## 🔴 15-mashq. Nechta soxta naqsh?

6-darsdagi tajribani kengaytiring: `0.15` dan katta farqli belgilar
**nechta** topiladi? Eslatma — **haqiqiy javob 0**.

<details><summary>Yechim</summary>

```
    belgilar    sezilarli naqsh   (haqiqiy: 0)
          10                0.3
          50                0.7
         200                3.6
        1000               17.6
```

> ## 💥💥💥 **1 000 TA BELGIDA — 17.6 TA "SEZILARLI" NAQSH.** ## ## ⭐ Hammasi **tasodifiy**.

> ## 🔑 **VA O'SISH CHIZIQLI EMAS:** ## 10 → 200 belgi *(20×)* ## naqshni **12×** ko'paytirdi, ## lekin 200 → 1000 *(5×)* — ## 💥 yana **4.9×**.

> ## 🏆 **BU — `Star Wars` MISOLINING SONI.** ## Agar tizim ## ⭐ **1 000 ta belgini** sinasa, ## u ## 💥 **o'nlab soxta "qoida"** topadi — ## va ularning biri ## 🔑 **`Star Wars` bo'lishi mumkin**.

> ## 💡 **HIMOYA:** ## har *"topilgan naqsh"* ni ## ⭐ **ajratilgan sinov to'plamida** qayta sinang. ## ## 🏆 Soxta naqsh **takrorlanmaydi**.
</details>

---

## 🏁 Yakuniy jadval

| # | Mashq | Asosiy natija |
|---|---|---|
| 1 | Uch belgili kappa | ⭐ Kod o'zgarmaydi · `0.538` |
| 2 | ## **Kappa paradoksi** | ## 💥 **93% kelishuv → kappa `−0.029`** |
| 3 | Charchash | 💥 `0.819 → 0.572` |
| 4 | ## **Uchinchi annotator** | ## 🏆 **84% tejash** |
| 5 | Proksi birlashtirish | 🔧 Kuchaymadi — `+28.0%` |
| 6 | ## **Proksini o'chirish** | ## 💥 **Yangisi chiqdi** `+15.3%` |
| 7 | Korrelyatsiya yemirilishi | 💥 `0.999 → −0.034` |
| 8 | ## **Tay filtri** | ## 💥 **90% filtr ham to'xtatmadi** |
| 9 | Qayta aloqa | 💥 `50.0% → 57.9%` |
| 10 | SFT auditi | 💥 6 misol, 8 muammo |
| 11 | ## **Bo'sh javob nazorati** | ## 💥 **`"I don't know."` o'tib ketdi** |
| 12 | Drift signali | ⚠️ `OGOHLANTIRISH` ko'rinmadi |
| 13 | Baholovchi profili | ⭐ `C` kalibrlanadi, `D` — yo'q |
| 14 | ## **Reward hacking** | ## 💥 **13× mukofot, 0 mazmun** |
| 15 | ## **Soxta naqshlar** | ## 💥 **1 000 belgi → 17.6 ta** |

---

⬅️ [6-dars](06-Inclusive-Development.md) · 🏠 [Modul](README.md)
