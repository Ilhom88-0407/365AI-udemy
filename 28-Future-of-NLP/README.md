# 🔮 28-modul. NLP ning kelajagi

> **The Future of NLP** — chuqur o'qitish, LLM'lar va **o'zbek tilida NLP**.
>
> ## 🏁 **Bu — NLP bo'limining SO'NGGI moduli.** 20-moduldan beri qurgan bilimingizga yakun yasaymiz.

---

## ⭐ Bu modulda NIMA MAXSUS?

Bu modul kursda **nazariy** — video darslarda kod yo'q.

Lekin biz uni **butun darslikdagi ENG AMALIY modulga** aylantirdik:

```
🎬 KURSDA (nazariya)              📘 BU DARSLIKDA (nazariya + AMALIYOT)

  chuqur o'qitish nima      →       + siz o'rgangan hamma narsa bilan bog'liq
  LLM nima                  →       + nima uchun 21-27 modullar HALI HAM kerak
  boshqa tillar qiyin       →       + 🇺🇿 O'ZBEK TILIDA ISHLAYDIGAN TO'LIQ QUVUR
  kelajak yo'nalishlari     →       + 42 mashq · 6 tayyor loyiha
```

> ## 🇺🇿 **3-dars va mashqlar — bu darslikning ENG QIMMATLI qismi.** Chunki kurs ingliz tilida, siz esa **o'zbek tilida** ishlaysiz.

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [Chuqur o'qitish nima?](01-What-is-Deep-Learning.md) | Neyron tarmoq, qatlamlar, og'irliklar |
| 2 | [NLP uchun chuqur o'qitish](02-Deep-Learning-for-NLP.md) | Transformer, LLM, nima uchun 21–27 kerak |
| 3 | [Ingliz tilidan boshqa NLP](03-Non-English-NLP.md) ⭐⭐ | ## 🇺🇿 **O'ZBEK TILIDA NLP** |
| 4 | [NLP uchun keyingi nima?](04-Whats-Next-for-NLP.md) | Kontekst · ko'p modallik · tezlik · axloq |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**42 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin — yarmidan ko'pi **o'zbek tilida** |
| 🚀 [**6 ta mini-loyiha**](LOYIHALAR.md) | `uznlp` moduli · sentiment · shipcha detektori · ablatsiya · til xaritasi · to'liq tahlilchi |

---

## 🇺🇿 ENG MUHIM XULOSA — o'zbek tilida NIMA ISHLAYDI?

```
✅ 21-MODUL  Tozalash          →  NLTK'da 288 ta o'zbek to'xtatish so'zi BOR!
✅ 24-MODUL  Vektorlashtirish  →  sklearn TILDAN MUSTAQIL
✅ 25-MODUL  Mavzu modeli      →  ISHLAYDI
✅ 26-MODUL  Tasniflagich      →  ISHLAYDI
✅ 27-MODUL  Shipcha tekshirish→  ISHLAYDI (va MAJBURIY)

❌ 22-MODUL  POS / NER         →  o'zbek modeli YO'Q
❌ 23-MODUL  Sentiment lug'ati →  VADER faqat ingliz tilida
```

> ## 💡 **Ya'ni kursning YARMIDAN KO'PI o'zbek tilida to'liq ishlaydi.**
>
> ❌ Faqat **oldindan o'qitilgan MODEL** talab qiladiganlari ishlamaydi.
> ✅ **Ma'lumotdan O'RGANADIGAN** hamma narsa ishlaydi.

---

## ⚠️ O'zbek tilida ishlashning ikkita ASOSIY tuzog'i

### ① Apostrof — 1-raqamli tuzoq

```python
CountVectorizer().fit(["O'zbekiston go'zal davlat"])
# → ['davlat', 'go', 'zal', 'zbekiston']       ❌ FALOKAT
```

```python
CountVectorizer(token_pattern=r"[\w'ʻ’]+").fit(["O'zbekiston go'zal davlat"])
# → ["davlat", "go'zal", "o'zbekiston"]        ✅ TO'G'RI
```

> ## 🔑 **`token_pattern` — o'zbek tilida BIRINCHI o'zgartiradigan narsangiz.**

### ② Agglyutinatsiya — lug'at portlashi

```
O'ZBEK:  uyim · uyimda · uylarim · uylarimda   →  4 ta USTUN
INGLIZ:  house · houses                        →  2 ta USTUN
              ↑
     BIR XIL MA'NO, ikki baravar ko'p ustun
```

> ## 🔑 **Yechim:** `min_df` ni pasaytiring · ko'proq ma'lumot yig'ing · o'z stemmeringizni yozing *(1-loyihada tayyor)*.

---

## 🚀 Tez boshlash — o'zbek tilida sentiment

```python
import re
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

UZ = r"[\w'ʻ’]+"                       # ⭐ apostrofni saqlaydi
uz_stop = stopwords.words("uzbek")     # ⭐ 288 ta

X = ["Bu kitob juda ajoyib va qiziqarli",
     "Zo'r asar, hammaga tavsiya qilaman",
     "Menga judayam yoqdi, ajoyib",
     "Juda zerikarli va sifatsiz kitob",
     "Vaqtimni behuda sarfladim, yomon",
     "Umuman yoqmadi, zerikarli asar"]
y = ["ijobiy"] * 3 + ["salbiy"] * 3

model = make_pipeline(
    TfidfVectorizer(token_pattern=UZ, stop_words=uz_stop),
    LogisticRegression())
model.fit(X, y)

print(model.predict(["Bu asar juda ajoyib chiqibdi",
                     "Sifatsiz va zerikarli kitob"]))
```

```
['ijobiy' 'salbiy']
```

> ## ✅ **O'zbek tilida ishlaydigan tasniflagich — 15 qator kodda.**
>
> ⚠️ **Lekin haqiqiy loyihada kamida 500 ta misol yig'ing** — 26-modul saboqini eslang.

---

## 🔧 O'rnatish

```bash
pip install nltk scikit-learn pandas numpy
```

```python
import nltk
nltk.download("stopwords")
```

---

## 🗺️ NLP rivojlanishining to'rt yo'nalishi

| # | Yo'nalish | Kursda qayerda ochiladi |
|---|---|---|
| 1️⃣ | 🧠 **Kontekst va mulohaza** | 29–34-modullar *(LLM)* |
| 2️⃣ | 🎨 **Ko'p modallik** | 52–61-modullar *(nutqni tanish)* |
| 3️⃣ | ⚡ **Tezlik / real vaqt** | 62–67-modullar *(LLM muhandisligi)* |
| 4️⃣ | ⚖️ **Axloq** | 68–76-modullar *(AI axloqi)* |

> 💡 Bu tasodif emas — o'qituvchi sanagan yo'nalishlar kursning qolgan qismida **aynan shu tartibda** ochiladi.

---

## 🏆 20–28-MODULLARDAN UCHTA ASOSIY SABOQ

| № | Saboq | Qayerdan |
|---|---|---|
| 1️⃣ | ## **Ko'proq MA'LUMOT > aqlliroq ALGORITM** | 26-modul: **0.50 → 0.87** |
| 2️⃣ | ## **Modelni DOIM tekshiring** | 27-modul: `"Reuters"` **99.5%** |
| 3️⃣ | ## **Sodda model ko'pincha YETARLI** | 24-modul: TF-IDF hali ham ishlaydi |

---

## ✅ Axloqiy tekshirish ro'yxati

Har bir NLP loyihangizda — **model o'qitishdan OLDIN**:

- [ ] Model **nimani** o'rgandi? → `coef_` ni ko'ring
- [ ] **Shipcha** bormi? → [3-loyihadagi detektor](LOYIHALAR.md)
- [ ] `DummyClassifier` dan **yaxshimi**?
- [ ] Ma'lumot **vakillimi**? → kim **yo'q**?
- [ ] Xato **kimga zarar** keltiradi?
- [ ] Ma'lumot **maxfiyligi** — qayerga yuborilyapti?
- [ ] Qarorni **tushuntira** olasizmi? → yo'q bo'lsa, **ishlatmang**

---

## ✅ O'zingizni tekshiring

- [ ] Chuqur o'qitishda "chuqur" nimani anglatadi?
- [ ] ChatGPT qaysi arxitekturadan foydalanadi?
- [ ] Siz qaysi modulda transformer ishlatgansiz?
- [ ] Nima uchun LLM bo'lsa ham `sklearn` kerak?
- [ ] NLTK'da nechta o'zbek to'xtatish so'zi bor?
- [ ] `token_pattern` ni nima uchun o'zgartirasiz?
- [ ] Agglyutinatsiya `min_df` ga qanday ta'sir qiladi?
- [ ] NLP rivojlanishining to'rt yo'nalishi qaysilar?

---

## 🎓 NLP BO'LIMI TUGADI

```
┌──────────────────────────────────────────────┐
│  20  Kirish             │  24  Vektorlashtirish │
│  21  Tozalash           │  25  Mavzular         │
│  22  POS / NER          │  26  Tasniflagich     │
│  23  Sentiment          │  27  Keys             │
│                    28  Kelajak                  │
└──────────────────────────────────────────────┘
        9 modul  ·  43 dars  ·  350+ mashq
```

---

## ➡️ Keyingi qadam

**[29-modul — Katta til modellariga kirish (LLM)](../29-Introduction-to-LLMs/README.md)**: bu modulda faqat **eshitgan** transformer va LLM'larni endi **ichidan** ko'ramiz — va ular bilan **ishlashni** boshlaymiz.

---

⬅️ [27-modul — Soxta yangiliklar keysi](../27-Fake-News-Case-Study/README.md) · 🏠 [Bosh sahifa](../README.md) · ➡️ [29-modul](../29-Introduction-to-LLMs/README.md)
