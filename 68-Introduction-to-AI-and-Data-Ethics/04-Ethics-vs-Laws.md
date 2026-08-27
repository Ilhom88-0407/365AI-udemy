# 4-dars. Etika va qonun ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: 'qonunlar texnologiyadan orqada qoladi'. Biz buni raqamlarga aylantirdik — va bo'shliq necha yil ekanini hisobladik."**

---

## 1. Ta'rif

> *"Oksford lug'ati etikani **insonning xulq-atvorini boshqaradigan axloqiy tamoyillar** deb ta'riflaydi."*

### ⭐ AI etikasi nima?

> *"AI etikasi — AI ning umumiy manfaat uchun foydasini **maksimallashtirishga** va rivojlanishidan kelib chiqadigan zararni **minimallashtirishga** qaratilgan axloqiy tamoyillar to'plami."*

---

## 2. 🔑 Kursning asosiy tezisi

> *"AI ni kompyuterning aqli deb o'ylash tabiiy... Lekin **bu bosqichda AI modellarini hali ham odamlar** o'ylab topadi, loyihalaydi, ishlab chiqadi, o'qitadi va takomillashtiradi."*

> ## 🏆🏆 **DEMAK — JAVOBGARLIK HAM ODAMDA.**
>
> ## ## 🔑 **VA BU — 69-MODULDAGI ## "JAVOBGARLIK" PRINSIPINING ASOSI.**

---

## 3. ⚖️ Qonun vs etika

| | Qonun | Etika |
|---|---|---|
| Kim yaratadi | Davlat | ## Jamiyat, kasb hamjamiyati |
| Majburiymi | ## ✅ **Ha** *(sud)* | ## ⚠️ **Yo'q** |
| Tezligi | ## 💥 **Sekin** | ## ⭐ **Tez** |
| Qamrovi | Aniq chegaralar | ## ⭐ **Nozik holatlar** |
| Bo'shliqda | ## 💥 **Javob yo'q** | ## 🏆 **Yo'l ko'rsatadi** |

> ## 💡 **KURSNING ASOSIY QATORI:** ## *"Qonunlar ko'pincha texnologik rivojlanishdan **orqada qoladi**."*

---

## 4. 🔬 **Bo'shliqni o'lchaymiz**

Texnologiya paydo bo'lgan yil va uni tartibga soluvchi qonun yili:

```python
TEXNOLOGIYA = [
    # (texnologiya, keng tarqalgan yil, tartibga soluvchi hujjat, yil)
    ("Yuz tanish",           2014, "EU AI Act (yuqori xavf)",        2024),
    ("Ijtimoiy tarmoq ma'lumoti", 2007, "GDPR",                      2018),
    ("Ovoz klonlash",        2019, "— (aniq qonun yo'q)",            None),
    ("Generativ matn (LLM)", 2022, "EU AI Act (GPAI qoidalari)",     2024),
    ("Deepfake video",       2018, "— (qisman, davlatlarga qarab)",  None),
    ("Avtomatik yollash",    2016, "NYC Local Law 144",              2023),
]


def bo_shliq(t):
    nom, paydo, hujjat, yil = t
    if yil is None:
        return nom, paydo, hujjat, "💥 HALI YO'Q"
    return nom, paydo, hujjat, f"{yil - paydo} yil"
```

```python
print(f"  {'texnologiya':26} {'paydo':>6}  {'hujjat':32} {'bo‘shliq':>12}")
print("  " + "-" * 82)
for t in TEXNOLOGIYA:
    nom, paydo, hujjat, g = bo_shliq(t)
    print(f"  {nom:26} {paydo:>6}  {hujjat:32} {g:>12}")

yillar = [t[3] - t[1] for t in TEXNOLOGIYA if t[3]]
print(f"\n  o'rtacha bo'shliq: {sum(yillar)/len(yillar):.1f} yil")
print(f"  hali qonunsiz    : {sum(1 for t in TEXNOLOGIYA if not t[3])}/{len(TEXNOLOGIYA)}")
```

### ✅ Haqiqiy natija

```
  texnologiya                 paydo  hujjat                               bo'shliq
  ----------------------------------------------------------------------------------
  Yuz tanish                   2014  EU AI Act (yuqori xavf)               10 yil
  Ijtimoiy tarmoq ma'lumoti    2007  GDPR                                  11 yil
  Ovoz klonlash                2019  — (aniq qonun yo'q)                💥 HALI YO'Q
  Generativ matn (LLM)         2022  EU AI Act (GPAI qoidalari)             2 yil
  Deepfake video               2018  — (qisman, davlatlarga qarab)      💥 HALI YO'Q
  Avtomatik yollash            2016  NYC Local Law 144                      7 yil

  o'rtacha bo'shliq: 7.5 yil
  hali qonunsiz    : 2/6
```

> ## 💥💥 **O'RTACHA BO'SHLIQ — 7.5 YIL.**
>
> ## Va oltitadan **ikkitasi** — ## ⭐ **hali ham qonunsiz**.

> ## 🔑 **VA MANA GREG MARSTON ISHI SHU JADVALDA:** ## u 2003-yilda shartnoma imzoladi, ## ovoz klonlash 2019-da keng tarqaldi, ## qonun esa — ## 💥 **hali yo'q**.

> ## ⚠️ **RAQAMLAR TAXMINIY** — ## *"keng tarqalgan yil"* — **subyektiv baho**, ## va hujjatlar **mintaqaga qarab** farq qiladi. ## ## ⭐ Lekin **tartib** aniq: **yillar, oylar emas**.

---

## 5. 🎬 `I, Robot` — kursning misoli

> *"Qutqaruv roboti hisob-kitobiga asoslanib **Spooner ni tanladi**, chunki uning omon qolish ehtimoli qiznikidan **yuqori** edi... Spooner buni haqorat deb biladi — inson **bolani** birinchi qo'yardi."*

### 🔑 Bu — **utilitarizm vs deontologiya**

| Yondashuv | Robot | Inson |
|---|---|---|
| Qoida | ## **Ehtimolni maksimallashtir** | ## **Zaifni himoya qil** |
| Natija | Spooner | ## Qiz |
| Qaysi *"to'g'ri"* | ## ⚠️ **Javob yo'q** | ## ⚠️ **Javob yo'q** |

> ## 🔑 **VA MANA ETIKANING QIYIN TOMONI:** ## bu yerda **noto'g'ri javob** yo'q — ## faqat **turli qadriyatlar** bor.

### ⚠️ Va bizning ilovamizda ham bor

```python
# Qaysi biri "adolatli"?
A = "Hamma nomzodga BIR XIL savollar"        # teng muomala
B = "Har nomzodga MOSLASHGAN savollar"       # teng imkoniyat
```

| | `A` teng muomala | `B` teng imkoniyat |
|---|---|---|
| Kuchli tomoni | ## ⭐ **Taqqoslash mumkin** | ## ⭐ **Har kim o'z darajasida** |
| Zaif tomoni | ## 💥 Boshlang'ich **kamsitiladi** | ## 💥 **Taqqoslab bo'lmaydi** |

> ## 💥 **KURSNING ILOVASI `B` NI TANLAGAN** ## *(savollar sozlamaga moslashadi)* — ## va bu **ongli qaror** bo'lishi kerak, ## ⚠️ tasodifiy emas.

---

## 6. 🏆 Qachon etika, qachon qonun?

```python
def qaysi_ramka(vaziyat):
    """Qonun bormi? Bo'lmasa — etika."""
    if vaziyat.get("qonun_bor"):
        return "⚖️ QONUN — majburiy, minimal daraja"
    if vaziyat.get("sanoat_standarti"):
        return "📋 STANDART — kasb hamjamiyati"
    return "🧭 ETIKA — o'zingiz qaror qilasiz"
```

```python
for nom, v in [
    ("EU da yollash AI si", {"qonun_bor": True}),
    ("Tibbiy AI, AQSh", {"qonun_bor": True}),
    ("Intervyu boti, O'zbekiston", {}),
    ("Ovoz klonlash", {"sanoat_standarti": True}),
]:
    print(f"  {nom:30} -> {qaysi_ramka(v)}")
```

```
  EU da yollash AI si            -> ⚖️ QONUN — majburiy, minimal daraja
  Tibbiy AI, AQSh                -> ⚖️ QONUN — majburiy, minimal daraja
  Intervyu boti, O'zbekiston     -> 🧭 ETIKA — o'zingiz qaror qilasiz
  Ovoz klonlash                  -> 📋 STANDART — kasb hamjamiyati
```

> ## 🔑 **UCHINCHI QATOR — BIZNING HOLATIMIZ.**
>
> ## ## ⚠️ **"Qonun yo'q" — "hamma narsa mumkin" DEGANI EMAS.** ## Bu — ## ⭐ **"javobgarlik butunlay sizda"** degani.

> ## 💡 **VA QONUN — MINIMAL DARAJA, MAKSIMAL EMAS.** ## GDPR ga rioya qilish — ## **etik bo'lish** degani emas.

---

## 🎯 Nazorat savollari

1. Etika va qonun orasidagi asosiy farq nima?
2. O'rtacha texnologik bo'shliq necha yil?
3. `I, Robot` sahnasi qanday dilemmani ko'rsatadi?
4. *"Qonun yo'q"* nimani anglatadi?

<details>
<summary>Javoblar</summary>

1. ## Qonun — **majburiy, sekin, aniq chegaralar**; etika — **majburiy emas, tez, nozik holatlarni qamraydi**. 🔑 Qonun bo'shliqda **javob bermaydi**, etika esa — **yo'l ko'rsatadi**.
2. ## **7.5 yil** *(oltita texnologiyadan to'rttasi bo'yicha)*. 💥 Ikkitasi — **ovoz klonlash** va **deepfake** — hali ham aniq qonunsiz. ⚠️ Raqamlar taxminiy, lekin tartib aniq: **yillar, oylar emas**.
3. ## **Utilitarizm vs deontologiya** — *"ehtimolni maksimallashtir"* vs *"zaifni himoya qil"*. ⚠️ Bu yerda **noto'g'ri javob yo'q**, faqat **turli qadriyatlar** bor.
4. ## **"Javobgarlik butunlay sizda"** — *"hamma narsa mumkin"* emas. ⭐ Va qonun — **minimal daraja**: GDPR ga rioya qilish **etik bo'lish** degani emas.

</details>

---

⬅️ [3-dars](03-Why-AI-Ethics-Matter.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
