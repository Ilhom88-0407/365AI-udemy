# 2-dars. Belgilanmagan ma'lumot ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs kredit modelini misol qiladi: model jinsni ko'rmasa ham, u bilan bog'liq naqshni topadi. Biz jinsni butunlay olib tashladik — va model baribir kamsitdi."**

---

## 1. Ta'rif

> *"Belgilanmagan ma'lumot — bu rasm yo'q qutidagi jumboq bo'laklari. AI hammasi qanday joylashishini **o'zi** aniqlashi kerak."*

| | Belgilangan | ## Belgilanmagan |
|---|---|---|
| To'g'ri javob | ✅ bor | ## 💥 **yo'q** |
| Bias manbai | ## Annotator | ## 💥 **Ma'lumotning O'ZI** |
| Nazorat | Yorliqlar orqali | ## 💥 **Deyarli yo'q** |

---

## 2. 💥 Kursning misoli — **kredit riski**

> *"Faqat belgilanmagan moliyaviy ma'lumot bilan qurilgan model... **bir jins kreditni qaytarish ehtimoli yuqoriroq** degan naqshni sezishi mumkin. To'g'ri yo'l-yo'riqsiz u erkaklarga **noadolatli ustunlik** berishi mumkin."*

### 🔑 Va odatiy javob: *"jinsni olib tashlaymiz"*

> ## 💥💥💥 **BU ISHLAMAYDI. VA BIZ BUNI O'LCHADIK.**

---

## 3. 🔬 **PROKSI O'ZGARUVCHI** tajribasi

Sun'iy ma'lumot: 4 000 odam, ikki guruh. **Haqiqiy layoqat guruhga bog'liq emas.**

```python
for i in range(4000):
    guruh = "A" if random.random() < 0.5 else "B"
    # 💥 pochta indeksi guruh bilan KUCHLI bog'liq (proksi)
    indeks = random.choice([100, 101, 102]) if guruh == "A" else \
             random.choice([102, 200, 201])
    layoqat = random.gauss(0.5, 0.15)       # ⭐ guruhga BOG'LIQ EMAS
```

| Model | Nima ko'radi |
|---|---|
| ## ① | ## `guruh` + `layoqat` |
| ## ② | ## ⭐ **`indeks` + `layoqat`** *(guruh OLIB TASHLANGAN)* |

### ✅ Haqiqiy natija

```
  model                         A yollandi  B yollandi   nisbat
  --------------------------------------------------------------
  ① guruh KIRITILGAN                 78.9%       52.9%    0.671 💥
  ② guruh OLIB TASHLANGAN            74.7%       58.6%    0.785 💥
```

> ## 💥💥💥 **GURUHNI OLIB TASHLASH — 0.671 DAN 0.785 GA.** ## ## 💥 **80% QOIDASI BARIBIR BUZILDI.**

### 🔬 Nega? — indeks guruhni **oshkor qiladi**

```
  indeks 100:  A= 698  B=   0  -> A ehtimoli 100%
  indeks 101:  A= 664  B=   0  -> A ehtimoli 100%
  indeks 102:  A= 665  B= 698  -> B ehtimoli 51%
  indeks 200:  A=   0  B= 644  -> B ehtimoli 100%
  indeks 201:  A=   0  B= 631  -> B ehtimoli 100%
```

> ## 🔑 **BESH INDEKSDAN TO'RTTASI — 100% ANIQ.** ## Ya'ni `indeks` — ## ⭐ **`guruh` ning yashirin nusxasi**.

> ## 💡 **VA BU — KURSNING TAY MISOLIDAGI FIKR** *(3-dars)*: ## *"Pochta indekslari ko'pincha **boylikni** aks ettiradi. ## Ismlar **madaniy kelib chiqish** bilan bog'liq."*

---

## 4. 🔧 Proksi detektori

```python
def proksi_kuchi(yozuvlar, maydon, himoyalangan):
    """Maydondan himoyalangan belgini qanchalik aniq bashorat qilish mumkin?"""
    g = collections.defaultdict(collections.Counter)
    for y in yozuvlar:
        g[y[maydon]][y[himoyalangan]] += 1

    # har guruhda eng ko'p uchraydigan sinfni tanlasak, aniqlik qancha?
    togri = sum(max(c.values()) for c in g.values())
    baza = max(collections.Counter(
        y[himoyalangan] for y in yozuvlar).values())
    return togri / len(yozuvlar), baza / len(yozuvlar)
```

### ✅ Haqiqiy natija

```
  indeks       bashorat aniqligi=83.4%  baza=50.7%  ortiqcha=+32.7%  💥 PROKSI
  layoqat      bashorat aniqligi=52.1%  baza=50.7%  ortiqcha=+1.4%   ✅ toza
```

> ## 🏆🏆 **DETEKTOR ISHLADI.** ## `indeks` — **+32.7%**, ## `layoqat` — **+1.4%**.

> ## 🔑 **QOIDA:** ## agar maydon himoyalangan belgini ## **bazadan 10 punktdan ortiq** aniqroq bashorat qilsa — ## ⭐ **u proksi**.

### ⚠️ Va nima qilish kerak?

| Variant | Ta'sir |
|---|---|
| ## **Proksini olib tashlash** | ## ⚠️ Model **aniqligi tushadi** |
| Umumlashtirish *(102 → "shahar")* | ⭐ Qisman yordam |
| ## **Adolat cheklovi qo'shish** | ## 🏆 **Eng samarali** |
| ## **Hech narsa qilmaslik** | ## 💥 **Kamsitish davom etadi** |

> ## 💥 **VA BIRINCHI VARIANT — ENG KO'P TANLANADIGANI,** ## lekin u ## ⚠️ **muammoni yashiradi**: ## boshqa proksi topiladi.

---

## 5. 💥 Google Flu Trends — **kursning ikkinchi misoli**

> *"2008-yilda ishga tushirilgan Google Flu Trends `gripp alomatlari` kabi qidiruv so'zlarini tahlil qilib, AQShda gripp epidemiyasini bashorat qilardi. Vaqt o'tishi bilan tizim **gripp holatlarini ortiqcha baholadi**, chunki u **aloqasiz qidiruvlardagi** o'sishni ham hisobga oldi."*

### 🔑 Uchta prinsip buzildi

| Prinsip | Nima bo'ldi |
|---|---|
| ## **Maxfiylik** | Odamlar qidiruvlari **ishlatilishini bilmasdi** |
| ## **Adolat** | ## 💥 Ba'zi hududlarda **noto'g'ri epidemiya** |
| ## **Javobgarlik** | ## 💥 Muammo **ma'lum edi**, chora **yo'q edi** |

> ## 💥💥 **VA HAQIQIY OQIBAT:** ## tibbiy resurslar ## ⭐ **noto'g'ri taqsimlanishi mumkin edi** — ## ba'zi hududlar **ortiqcha tayyorlandi**, ## boshqalari — ## 💥 **yetarli emas**.

### 🔬 Bu — **korrelyatsiya ≠ sababiyat** muammosi

```python
def korrelyatsiya_tuzogi(qidiruvlar, kasallar):
    """Qidiruv soni kasallar sonini bashorat qiladimi?"""
    import statistics
    n = len(qidiruvlar)
    mq, mk = statistics.mean(qidiruvlar), statistics.mean(kasallar)
    kov = sum((q-mq)*(k-mk) for q, k in zip(qidiruvlar, kasallar)) / n
    sq = statistics.pstdev(qidiruvlar); sk = statistics.pstdev(kasallar)
    return kov / (sq * sk) if sq and sk else 0
```

```
  ① faqat kasallar qidiradi        r =  0.970   ✅ model ishlaydi
  ② + yangilik to'lqini qo'shildi  r = -0.175   💥 model BUTUNLAY BUZILDI
```

> ## 💥💥💥 **BITTA YANGILIK TO'LQINI — ## `r` 0.970 DAN −0.175 GA.**
>
> ## ⭐ Ya'ni bog'liqlik nafaqat yo'qoldi — ## 💥 **TESKARISIGA AYLANDI**.
>
> ## ## 🔑 **VA MODEL BUNI SEZMAYDI** — ## u faqat **qidiruvlar oshdi** deb ko'radi.

---

## 6. 🏆 Belgilanmagan ma'lumot uchun **himoya**

Kurs uchta savolni beradi:

```python
def belgilanmagan_audit(toplam):
    savollar = {
        "Ma'lumotni kim yig'gan?": toplam.get("yiguvchi"),
        "Etik yig'ilganmi?": toplam.get("etik"),
        "Rozilik bormi?": toplam.get("rozilik"),
        # ⭐ kurs aytmagan, lekin biz o'lchagan
        "Proksi tekshirildimi?": toplam.get("proksi_tekshiruvi"),
        "Vaqt bo'yicha barqarormi?": toplam.get("barqarorlik"),
    }
    return {k: ("✅" if v else "💥") for k, v in savollar.items()}
```

```python
for nom, t in [
    ("moliyaviy tranzaksiyalar", {"yiguvchi": "bank", "etik": True,
                                  "rozilik": True}),
    ("qidiruv so'rovlari", {"yiguvchi": "qidiruv tizimi"}),
]:
    print(f"  {nom}")
    for k, v in belgilanmagan_audit(t).items():
        print(f"      {v} {k}")
```

### ✅ Haqiqiy natija

```
  moliyaviy tranzaksiyalar
      ✅ Ma'lumotni kim yig'gan?
      ✅ Etik yig'ilganmi?
      ✅ Rozilik bormi?
      💥 Proksi tekshirildimi?
      💥 Vaqt bo'yicha barqarormi?
  qidiruv so'rovlari
      ✅ Ma'lumotni kim yig'gan?
      💥 Etik yig'ilganmi?
      💥 Rozilik bormi?
      💥 Proksi tekshirildimi?
      💥 Vaqt bo'yicha barqarormi?
```

> ## 💥 **IKKINCHISI — GOOGLE FLU TRENDS.** ## Beshtadan **bittasi** ✅.
>
> ## ## 🔑 **VA BIRINCHISIDA HAM IKKITA `💥`** — ## kurs aytmagan, lekin ## ⭐ **biz o'lchagan** ikkita savol.

---

## 🎯 Nazorat savollari

1. Guruhni olib tashlash kamsitishni to'xtatdimi?
2. Proksi detektori nimani ko'rsatdi?
3. Google Flu Trends nima uchun buzildi?
4. Belgilanmagan ma'lumot uchun nechta savol kerak?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q.** Nisbat **0.671 → 0.785** ga ko'tarildi, lekin **80% qoidasi baribir buzildi**. 🔑 Sabab: `indeks` — `guruh` ning **yashirin nusxasi** *(5 tadan 4 tasi 100% aniq)*.
2. ## `indeks` — bazadan **+32.7%** aniqroq bashorat *(💥 proksi)*, `layoqat` — **+1.4%** *(✅ toza)*. ⭐ Qoida: **10 punktdan ortiq** → proksi.
3. ## **Korrelyatsiya ≠ sababiyat.** Model *"gripp alomatlari"* qidiruvini kasallik deb o'yladi, lekin **qiziquvchilar** ham qidirardi. 💥 O'lchandi: bitta yangilik to'lqini `r` ni **0.970 → −0.175** ga tushirdi — ya'ni **teskarisiga** aylantirdi.
4. ## **Kurs uchtasini beradi** *(kim yig'gan, etikmi, rozilik)*. ⭐ Biz **ikkitasini qo'shdik**: **proksi tekshiruvi** va **vaqt bo'yicha barqarorlik**.

</details>

---

⬅️ [1-dars](01-Labeled-Data.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Unsupervised-Training.md)
