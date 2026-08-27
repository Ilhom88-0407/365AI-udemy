# 5-dars. Nozik va himoyalangan ma'lumot ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 'anonimlashtirish — ism, manzil, tibbiy ID ni olib tashlash' deydi. Biz shuni qildik — va 200 odamdan 159 tasi baribir AYNAN aniqlandi."**

---

## 1. Kursning beshta qadami

| # | Qadam | Nima |
|---|---|---|
| ① | ## **Metama'lumotni tekshirish** | Litsenziya, PII belgisi |
| ② | ## **Litsenziyani tasdiqlash** | Manbaning o'zidan |
| ③ | **Regulyatsiya** | GDPR va boshqalar |
| ④ | ## **Anonimlashtirish** | ## ⭐ **Bu darsning mavzusi** |
| ⑤ | Ruxsat so'rash | Ma'lumot egasidan |

---

## 2. 💥💥 Anonimlashtirish — **ism o'chirish yetarlimi?**

Kurs aytadi:

> *"Anonimlashtirish — shaxsni aniqlaydigan ma'lumotni to'plamdan olib tashlash. Masalan, sog'liq ma'lumotini **ism, manzil va tibbiy ID larni olib tashlash** orqali anonimlashtirish mumkin."*

### 🔬 Sinaymiz — 200 nomzod

```python
nomzodlar = [{
    "ism": f"Nomzod{i}",              # ⭐ buni O'CHIRAMIZ
    "yosh": random.randint(22, 55),
    "shahar": random.choice(SHAHAR),   # 5 ta shahar
    "lavozim": random.choice(LAVOZIM), # 4 ta lavozim
    "ball": random.randint(1, 10),
} for i in range(200)]
```

```python
def k_anonimlik(yozuvlar, kvazi):
    """Har kombinatsiya nechta yozuvda uchraydi? Eng kichigi — k."""
    sanoq = collections.Counter(
        tuple(y[k] for k in kvazi) for y in yozuvlar)
    return min(sanoq.values()), sanoq
```

### ✅ Haqiqiy natija

```
kvazi-identifikator ['yosh', 'shahar', 'lavozim']   k=  1  yolg'iz yozuvlar=159/200
kvazi-identifikator ['shahar', 'lavozim']           k=  4  yolg'iz yozuvlar=0/200
kvazi-identifikator ['lavozim']                     k= 44  yolg'iz yozuvlar=0/200
```

> ## 💥💥💥 **ISM O'CHIRILDI — LEKIN 200 TADAN 159 TASI ## AYNAN ANIQLANADI.**
>
> ## Yosh + shahar + lavozim — ## ⭐ **uchtasi birgalikda odamni topadi**.

> ## 🔑 **BULAR — "KVAZI-IDENTIFIKATOR":** ## alohida hech biri PII emas, ## birgalikda esa — ## 💥 **shaxsni aniqlaydi**.

---

## 3. 🔧 `k`-anonimlik — umumlashtirish

Yechim: yoshni **oraliqqa** aylantirish.

```python
def yoshni_umumlashtir(y, qadam):
    a = (y // qadam) * qadam
    return f"{a}-{a+qadam-1}"
```

### ✅ Haqiqiy natija

```
yosh qadami=  1  k=  1  yolg'iz=159  💥 (talab k>=5)
yosh qadami=  5  k=  1  yolg'iz= 54  💥 (talab k>=5)
yosh qadami= 10  k=  1  yolg'iz= 15  💥 (talab k>=5)
yosh qadami= 20  k=  1  yolg'iz=  1  💥 (talab k>=5)
```

> ## 🔧 **MEN 20 YILLIK ORALIQ YETARLI BO'LADI DEB O'YLAGAN EDIM.**
>
> ## ## 💥 **YO'Q — `k` HALI HAM 1.** ## Yolg'iz yozuvlar **159 → 1** ga tushdi, ## lekin **bitta odam baribir aniqlanadi**.

> ## 🔑 **SABAB — KOMBINATSIYALAR SONI:** ## 3 oraliq × 5 shahar × 4 lavozim = **60 guruh**, ## 200 yozuv uchun. ## ## ⭐ O'rtacha 3.3 — ya'ni **k=5 imkonsiz**.

### 🏆 Uchta haqiqiy yechim

| Yechim | Nima qiladi | Narx |
|---|---|---|
| ## **Ko'proq ma'lumot** | 200 → 2000 yozuv | ## ⭐ Vaqt |
| ## **Kamroq maydon** | shaharni olib tashlash | ## 💥 **Foydalilik** |
| ## **Yozuvni o'chirish** | `k < 5` guruhlarni olib tashlash | ## 💥 **Ma'lumot yo'qolishi** |

> ## 💡 **VA UCHINCHISI — ENG XAVFLISI:** ## `k < 5` guruhlar odatda ## ⭐ **kam uchraydigan guruhlar** — ## 💥 ya'ni siz **ozchilikni** o'chirasiz.
>
> ## ## 🔑 **BU — 6-DARSDAGI VAKILLIK MUAMMOSINING SABABI.**

---

## 4. 💥 `l`-xilma-xillik — **`k` yetarli emas**

> ## 🔑 **`k`-ANONIMLIK AYTADI:** ## *"bir xil guruhda kamida `k` ta odam bor"*.
>
> ## ## 💥 **LEKIN AGAR O'SHA GURUHDAGI HAMMA ## BIR XIL BALL OLGAN BO'LSA —** ## siz baribir **odamning ballini** bilasiz.

```python
guruhlar = collections.defaultdict(list)
for y in n3:
    guruhlar[(y["yosh"], y["shahar"], y["lavozim"])].append(y["ball"])

l_min = min(len(set(b)) for b in guruhlar.values())
```

### ✅ Haqiqiy natija

```
l (eng kam xilma-xillik) = 1
💥 (talab l>=3)
  guruh ('40-59', 'Namangan', 'Data Scientist'): ballar=[4]  xilma-xillik=1
```

> ## 💥 **`l = 1`** — ya'ni o'sha guruhdagi ## **hamma bir xil ball** olgan *(bu yerda: bitta odam)*.
>
> ## ## ⭐ **AGAR SIZ "40–59 YOSH, NAMANGAN, DATA SCIENTIST" ## EKANINGIZNI BILSAM —** ## 🔑 **ballingiz 4 ekanini ham bilaman.**

---

## 5. 🏆 To'liq anonimlashtirish quvuri

```python
def anonimlashtir(yozuvlar, kvazi, nozik, k_min=5, l_min=3,
                  yosh_qadami=10):
    """① umumlashtirish ② k tekshiruvi ③ l tekshiruvi ④ o'chirish."""
    # ① umumlashtirish
    n = []
    for y in yozuvlar:
        y2 = dict(y)
        y2.pop("ism", None)                       # ⭐ to'g'ridan-to'g'ri PII
        if "yosh" in y2 and isinstance(y2["yosh"], int):
            a = (y2["yosh"] // yosh_qadami) * yosh_qadami
            y2["yosh"] = f"{a}-{a+yosh_qadami-1}"
        n.append(y2)

    # ② + ③ guruhlarni baholaymiz
    guruhlar = collections.defaultdict(list)
    for y in n:
        guruhlar[tuple(y[k] for k in kvazi)].append(y)

    saqlangan, ochirilgan, sabablar = [], 0, collections.Counter()
    for g, yz in guruhlar.items():
        if len(yz) < k_min:
            ochirilgan += len(yz); sabablar["k < k_min"] += len(yz); continue
        if len(set(y[nozik] for y in yz)) < l_min:
            ochirilgan += len(yz); sabablar["l < l_min"] += len(yz); continue
        saqlangan += yz

    return saqlangan, ochirilgan, dict(sabablar)
```

```python
s, o, sab = anonimlashtir(nomzodlar, ["yosh", "shahar", "lavozim"], "ball")
print(f"  kirish: {len(nomzodlar)}  saqlandi: {len(s)}  o'chirildi: {o}")
print(f"  sabablar: {sab}")
print(f"  saqlanish ulushi: {len(s)/len(nomzodlar):.1%}")
```

### ✅ Haqiqiy natija

```
  kirish: 200  saqlandi: 43  o'chirildi: 157
  sabablar: {'k < k_min': 157}
  saqlanish ulushi: 21.5%
```

> ## 💥💥 **200 YOZUVDAN 157 TASI O'CHIRILDI — 78.5%.**
>
> ## ## ⭐ Qolgani — atigi **43 yozuv**.

### 🔬 Nechta yozuv kerak?

```
   200 yozuv  ->  saqlandi    43 ( 21.5%)
   500 yozuv  ->  saqlandi   437 ( 87.4%)
  1000 yozuv  ->  saqlandi   992 ( 99.2%)
  2000 yozuv  ->  saqlandi  2000 (100.0%)
  5000 yozuv  ->  saqlandi  5000 (100.0%)
```

> ## 🏆🏆 **VA MANA ASOSIY XULOSA:** ## ⭐ **anonimlik — MIQDOR masalasi.**
>
> ## 200 yozuvda **21.5%**, ## 1 000 yozuvda — ## 🏆 **99.2%**.

> ## 💡 **KICHIK TO'PLAMDA ANONIMLASHTIRISH ## MA'LUMOTNI DEYARLI YO'Q QILADI.** ## 🔑 Shuning uchun kichik so'rovnomalar ## **ochiq e'lon qilinmasligi** kerak.

> ## ⚠️ **VA E'TIBOR BERING — `l < l_min` SABABI ## UMUMAN ISHLAMADI** *(0 ta yozuv)*. ## ## 🔑 Chunki `k >= 5` bo'lgan guruhlarda ## ball xilma-xilligi ham **avtomatik yetarli** chiqdi. ## ⭐ Ya'ni bu ma'lumotda `l` — **bog'liq shart**, mustaqil emas.

---

## 6. ⚠️ Anonimlashtirish **nima qilmaydi**

| Cheklov | Izoh |
|---|---|
| ## **Erkin matn** | ## 💥 Javob ichida *"men Namanganda tug'ilganman"* |
| ## **Yozuv uslubi** | ## 💥 Stilometriya bilan muallif aniqlanadi |
| Tashqi ma'lumot | ## 💥 **LinkedIn bilan solishtirish** |
| Vaqt naqshi | ⚠️ Qachon javob berilgani |

> ## 💥💥 **UCHINCHISI — ENG KUCHLI HUJUM.** ## Netflix Prize *(2006)* da tadqiqotchilar ## anonimlashtirilgan reyting bazasini ## ⭐ **IMDb profillari** bilan solishtirib, ## foydalanuvchilarni **aniqlagan** edi.

> ## 🏆 **QOIDA:** ## anonimlashtirish — ## ⭐ **kafolat emas, RISKNI KAMAYTIRISH**.

---

## 🎯 Nazorat savollari

1. Ism o'chirilgach nechta odam aniqlanadi?
2. Yoshni 20 yillik oraliqqa aylantirish yordam berdimi?
3. `l`-xilma-xillik nimani qo'shadi?
4. `k=5` uchun nechta yozuv kerak bo'ldi?
5. Anonimlashtirish nima qilmaydi?

<details>
<summary>Javoblar</summary>

1. ## **200 tadan 159 tasi** — `k = 1`. 🔑 Sabab: **yosh + shahar + lavozim** birgalikda **kvazi-identifikator**.
2. ## **Yo'q — `k` hali ham 1.** 🔧 Men buni yetarli deb kutgan edim. ⭐ Yolg'iz yozuvlar **159 → 1** ga tushdi, lekin **bitta odam baribir aniqlanadi**.
3. ## Guruh ichida **nozik qiymat xilma-xilligini**. 💥 O'lchandi: `l = 1` — ya'ni guruhni bilsangiz, **ballni ham bilasiz**.
4. ## **~1 000 yozuv** *(99.2% saqlandi)*. 200 yozuvda — atigi **21.5%**. 🏆 Anonimlik — **miqdor masalasi**.
5. ## **Erkin matnni**, **yozuv uslubini**, **tashqi ma'lumot bilan solishtirishni** to'xtata olmaydi. 💥 Netflix Prize: anonim reytinglar **IMDb** bilan solishtirilib deanonimlashtirilgan. ⭐ Anonimlashtirish — **kafolat emas, riskni kamaytirish**.

</details>

---

⬅️ [4-dars](04-Web-Scraped-Data.md) · 🏠 [Modul](README.md) · ➡️ [6-dars](06-Data-Bias-and-Representation.md)
