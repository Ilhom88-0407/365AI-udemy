# 3-dars. Ingliz tilidan boshqa tillarda NLP 🇺🇿

## 🎬 Boshlashdan oldin

> **"Bu kursdagi amaliyotlar ustida ishlar ekanmiz, biz TEZ-TEZ ishlatmoqchi bo'lgan TILNI ko'rsatganimizni sezgan bo'lishingiz mumkin."**

```python
nlp = spacy.load("en_core_web_sm")        # ← en = ENGLISH
stopwords.words("english")                # ← ENGLISH
```

> **"Bu kurs INGLIZ TILI ma'lumoti bilan NLP'ga qaratilgan — lekin boshqa tillarda ham juda ko'p ishlanmalar qilinmoqda."**

> ## 🇺🇿 **Bu dars — bu darslikning ENG MUHIM darslaridan biri.** Chunki siz **o'zbek tilida** ishlashingiz mumkin. Va yaxshi xabar bor.

---

## 1. Nima uchun bu qiyin?

> ## **"Biroq bu ANCHA QIYIN — chunki ba'zi tillarda bu turdagi tabiiy til modellarini o'qitish uchun zarur bo'lgan KATTA HAJMDAGI OSON MAVJUD MA'LUMOT shunchaki YO'Q."**
>
> ## **"Hatto matnni QANDAY OLDINDAN QAYTA ISHLASHIMIZ ham har bir alohida til uchun MOSLASHTIRILISHI kerak — turli grammatik qoidalar, gap tuzilishi va yozma tildagi kontekstual ma'lumotni hisobga olish uchun."**

### Uchta to'siq

| To'siq | Izoh |
|---|---|
| 📉 **Ma'lumot kamligi** | Ingliz tilida **milliardlab** so'z, o'zbek tilida **ancha kam** |
| 📐 **Grammatika farqi** | O'zbek — **agglyutinativ** til *(qo'shimchalar zanjiri)* |
| 🔤 **Yozuv** | O'zbek — **lotin** va **kirill** *(ikki alifbo!)* |

### 🇺🇿 O'zbek tilining o'ziga xosligi

```
INGLIZ:   in my houses          →  3 ta so'z
O'ZBEK:   uylarimda            →  1 ta SO'Z!
             ↑
   uy + lar + im + da
   (uy + ko'plik + egalik + o'rin)

Bag of Words uchun bu MUAMMO:
   "uyim", "uyimda", "uylarim", "uylarimda"
        ↑
   HAMMASI ALOHIDA ustun bo'ladi!
   Ingliz tilida esa "house" bitta ustun.
```

> ## 💡 **Shuning uchun o'zbek tilida `min_df` va lug'at hajmi muammosi ANCHA KUCHLI.** Bir xil matn hajmida **ancha ko'p** noyob "so'z" chiqadi.

### ⚠️ Ikkinchi o'zbek muammosi — APOSTROF

```python
from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer()
cv.fit(["cho'zilgan va yo'q bo'lgan g'alaba"])
print(sorted(cv.get_feature_names_out()))
```

```
['alaba', 'bo', 'cho', 'lgan', 'va', 'yo', 'zilgan']
```

> ## ❌ **HAR BIR apostrofli so'z BO'LINIB KETDI!**
>
> ```
> cho'zilgan  →  cho  +  zilgan
> yo'q        →  yo            ← "q" YO'QOLDI!
> bo'lgan     →  bo   +  lgan
> g'alaba     →  alaba         ← "g" YO'QOLDI!
> ```
>
> **Sabab:** `o'` va `g'` harflari **apostrof** bilan yoziladi. `sklearn` apostrofni **so'z chegarasi** deb biladi, keyin esa **1 harfli** bo'laklarni *(`g`, `q`)* tashlab yuboradi *(standart `token_pattern` kamida **2 harf** talab qiladi)*.

**✅ Yechim:**

```python
cv = CountVectorizer(token_pattern=r"[\w'ʻ’]+")
cv.fit(["cho'zilgan va yo'q bo'lgan g'alaba"])
print(sorted(cv.get_feature_names_out()))
```

```
["bo'lgan", "cho'zilgan", "g'alaba", 'va', "yo'q"]
```

> ## ✅ **5 ta so'z — 5 ta token. MUKAMMAL!**
>
> Namunadagi uchta belgi — `'` *(oddiy apostrof)*, `ʻ` *(o'zbek `oʻ` belgisi)*, `’` *(tipografik apostrof)* — **uchalasi ham** qamrab olingan, chunki o'zbek matnlarida **uchalasi ham** uchraydi.

> 💡 **Bu — o'zbek tilida ishlashning BIRINCHI qadami.** Uni unutmang: `token_pattern` ni **doim** o'zgartiring.

---

## 2. ⭐ YAXSHI XABAR — NLTK o'zbek tilini QO'LLAB-QUVVATLAYDI!

> **"Agar ingliz tilidan boshqa ma'lumot bilan ishlashni xohlasangiz, nima qilasiz? Birinchi tavsiyam — biz ALLAQACHON ISHLATGAN paketlarning HUJJATLARINI tekshirish va ular qanday tillarni qo'llab-quvvatlashini ko'rish."**

Tekshiramiz:

```python
from nltk.corpus import stopwords
print("NLTK tillari:", len(stopwords.fileids()))
print(sorted(stopwords.fileids()))
```

```
NLTK tillari: 33
['albanian', 'arabic', 'azerbaijani', 'basque', 'belarusian', 'bengali',
 'catalan', 'chinese', 'danish', 'dutch', 'english', 'finnish', 'french',
 'german', 'greek', 'hebrew', 'hinglish', 'hungarian', 'indonesian',
 'italian', 'kazakh', 'nepali', 'norwegian', 'portuguese', 'romanian',
 'russian', 'slovene', 'spanish', 'swedish', 'tajik', 'tamil', 'turkish',
 'uzbek']
```

### 🎉 `'uzbek'` — RO'YXATDA BOR!

```python
uz_stopwords = stopwords.words("uzbek")
print("O'zbek to'xtatish so'zlari:", len(uz_stopwords))
print(uz_stopwords[:30])
```

```
O'zbek to'xtatish so'zlari: 288
['bu', 'bular', 'buning', 'buniki', 'buni', 'bundan', 'bunga', 'bunda',
 'shu', 'shular', 'shuni', 'shuning', 'shuniki', 'shunda', 'shundan',
 'shunga', 'oʻsha', 'oʻshalar', 'oʻshanda', 'oʻshanga', 'oʻshandan',
 'oʻshani', 'oʻshaning', 'oʻshaniki', 'ana', 'mana', 'kim', 'kimlar',
 'kimda', 'kimga']
```

> ## 💥 **288 ta o'zbek to'xtatish so'zi!** *(Taqqoslang: ingliz tilida — **198 ta**.)*

### Ishlatib ko'ramiz

```python
matn = "Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman"

toza = " ".join(w for w in matn.lower().split() if w not in uz_stopwords)
print("Asl  :", matn)
print("Toza :", toza)
```

```
Asl  : Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman
Toza : kitob yaxshi tavsiya qilaman
```

> ## ✅ **MUKAMMAL ISHLADI!** `bu`, `juda`, `va`, `men`, `uni`, `hammaga` — **hammasi olib tashlandi**. Qolgani — **ma'noli** so'zlar.

### Qo'shni tillar ham bor

```python
for til in ["uzbek", "turkish", "azerbaijani", "kazakh", "tajik"]:
    print(f"{til:14s} {len(stopwords.words(til)):4d} ta")
```

```
uzbek           288 ta
turkish          53 ta
azerbaijani     165 ta
kazakh          324 ta
tajik           163 ta
```

> 💡 **O'zbek ro'yxati turk tilinikidan 5 BARAVAR to'liqroq!**

---

## 3. ⚠️ spaCy'da o'zbek tili YO'Q

```python
import spacy
try:
    nlp = spacy.blank("uz")
except ImportError:
    print("uz — spaCy'da YO'Q")
```

```
uz — spaCy'da YO'Q
```

```python
from spacy.lang import __path__ as lp
import os
tillar = [x for x in sorted(os.listdir(lp[0])) if len(x) in (2, 3)]
print("spaCy tillari:", len(tillar))
print("uz bormi?", "uz" in tillar)
print("tr bormi?", "tr" in tillar)
print("ky bormi?", "ky" in tillar)   # qirg'iz
```

```
spaCy tillari: 79
uz bormi? False
tr bormi? True
ky bormi? True
```

> ## ⚠️ **spaCy 79 ta tilni qo'llaydi, lekin o'zbek tili ULAR ORASIDA YO'Q.** Turk va qirg'iz bor — o'zbek yo'q.

### ✅ Yechim — `xx` (ko'p tilli) tokenizator

```python
nlp_xx = spacy.blank("xx")          # xx = multi-language
doc = nlp_xx("Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman")
print([t.text for t in doc])
```

```
['Bu', 'kitob', 'juda', 'yaxshi', 'va', 'men', 'uni', 'hammaga', 'tavsiya', 'qilaman']
```

> ## ✅ **Tokenizatsiya ISHLAYDI.** ⚠️ Lekin **POS teglash** va **NER** — **yo'q** *(model o'qitilmagan)*.

---

## 4. 🇺🇿 O'zbek tili uchun AMALIY jadval

| Vazifa | O'zbek tilida | Yechim |
|---|---|---|
| **Tokenizatsiya** | ✅ Ishlaydi | `spacy.blank("xx")` yoki `.split()` |
| **To'xtatish so'zlari** | ✅ **288 ta** | ## `stopwords.words("uzbek")` |
| **Kichik harf / regex** | ✅ Ishlaydi | Til farq qilmaydi |
| **Bag of Words / TF-IDF** | ✅ Ishlaydi | `sklearn` **tildan mustaqil** |
| **Tasniflagich** | ✅ **Ishlaydi!** | Sizda **yorliqli ma'lumot** bo'lsa |
| **Stemming** | ⚠️ Yo'q | Turk stemmerini sinang |
| **Lemmatization** | ❌ Yo'q | — |
| **POS teglash** | ❌ Yo'q | — |
| **NER** | ❌ Yo'q | — |
| **Sentiment** *(VADER)* | ❌ Yo'q | Tarjima yoki o'z lug'atingiz |
| **LLM** *(GPT, Claude)* | ✅ **Yaxshi ishlaydi** | Eng oson yo'l |

### 🎯 Xulosa: nima ISHLAYDI?

```
✅ 21-MODUL  Tozalash          →  to'xtatish so'zlari BOR!
✅ 24-MODUL  Vektorlashtirish  →  sklearn TILDAN MUSTAQIL
✅ 25-MODUL  Mavzu modeli      →  ISHLAYDI!
✅ 26-MODUL  Tasniflagich      →  ISHLAYDI!

❌ 22-MODUL  POS/NER           →  model yo'q
❌ 23-MODUL  Sentiment         →  lug'at yo'q
```

> ## 💡 **Ya'ni kursning YARMIDAN KO'PI o'zbek tilida ISHLAYDI!**

---

## 5. 🧪 O'zbek tilida to'liq misol

```python
import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import cross_val_score

uz_sw = stopwords.words("uzbek")

sharhlar = [
    ("Bu kitob juda yaxshi va qiziqarli edi", "ijobiy"),
    ("Ajoyib asar, hammaga tavsiya qilaman", "ijobiy"),
    ("Zo'r kitob, bir kechada o'qib chiqdim", "ijobiy"),
    ("Yomon kitob, pulimga achindim", "salbiy"),
    ("Zerikarli va cho'zilgan, tavsiya qilmayman", "salbiy"),
    ("Juda sifatsiz, vaqtimni behuda sarfladim", "salbiy"),
]
X = [s for s, _ in sharhlar]
y = [l for _, l in sharhlar]

quvur = make_pipeline(
    TfidfVectorizer(stop_words=uz_sw),     # ⭐ O'ZBEK to'xtatish so'zlari!
    LogisticRegression(random_state=0, max_iter=1000))
quvur.fit(X, y)

yangi = ["Bu asar juda ajoyib chiqibdi",
         "Sifatsiz va zerikarli kitob"]
for m, p in zip(yangi, quvur.predict(yangi)):
    print(f"  {p:8s} | {m}")
```

> ## 💡 **Bu — 26-moduldagi AYNAN BIR XIL kod.** Faqat `stop_words` o'zgardi. **Butun quvur o'zbek tilida ishlaydi.**
>
> ⚠️ **6 ta misol — juda kam** *(26-modulni eslang!)*. Haqiqiy loyihada **yuzlab** kerak.

---

## 6. Boshqa paketlarni qidiring

> **"Boshqa variant — sizning tilingizni hisobga olib ishlab chiqilgan QO'SHIMCHA PAKETLARNI tekshirish."**
>
> **"Masalan, `iNLTK` paketi hind tillari — hindi va tamil kabilar uchun ishlab chiqilgan."**

### 🇺🇿 O'zbek va turkiy tillar uchun qidirish yo'nalishlari

| Nima qidirish | Qayerda |
|---|---|
| **Turkiy tillar** paketlari | GitHub: `turkic nlp`, `uzbek nlp` |
| **O'zbek korpuslari** | Universitetlar, `HuggingFace datasets` |
| **Ko'p tilli modellar** | `xlm-roberta`, `mBERT` *(100+ til)* |
| **Turk tili vositalari** | O'zbek tiliga **eng yaqin** ishlab chiqilgani |

### 💡 Ko'p tilli transformerlar — eng amaliy yo'l

```python
from transformers import pipeline

# Ko'p tilli sentiment (o'zbekcha ham sinab ko'ring!)
p = pipeline(model="nlptown/bert-base-multilingual-uncased-sentiment")
print(p("Bu kitob juda ajoyib va qiziqarli edi"))
```

> 💡 **`nlptown/bert-base-multilingual-uncased-sentiment`** — **104 ta tilda** o'qitilgan *(23-modulda ishlatgandik)*. O'zbek tilida qanchalik yaxshi ishlashini **o'zingiz sinang**.

---

## 7. Kelajak

> ## **"NLP ning til imkoniyatlarini kengaytirish — GLOBAL AUDITORIYA uchun QAMROVLI yechimlar yaratishga yordam beradigan kelgusi rivojlanishning ASOSIY jihati."**

```
Bugun:      o'zbek tili uchun asboblar KAM
Ertaga:     LLM'lar tobora ko'proq tilni qamrab olmoqda
                    ↓
   Siz ham HISSA qo'shishingiz mumkin:
   · O'zbekcha korpus yig'ish
   · To'xtatish so'zlari ro'yxatini kengaytirish
   · Stemmer/lemmatizer yozish
   · HuggingFace'ga model yuklash
```

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** NLTK nechta tilni qo'llaydi?

**M2.** ⭐ O'zbek to'xtatish so'zlarini yuklang.

**M3.** Bir jumlani tozalang.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.corpus import stopwords

# M1
print(len(stopwords.fileids()))            # 33
print("uzbek bormi?", "uzbek" in stopwords.fileids())   # True

# M2
uz = stopwords.words("uzbek")
print(len(uz), "ta")                       # 288 ta
print(uz[:20])

# M3
matn = "Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman"
print(" ".join(w for w in matn.lower().split() if w not in uz))
# kitob yaxshi tavsiya qilaman
```

</details>

### 🟡 O'rta

**M4.** Turkiy tillarni solishtiring.

**M5.** spaCy'da o'zbek tili bormi?

**M6.** ⭐ O'zbekcha TF-IDF quring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
for til in ["uzbek", "turkish", "azerbaijani", "kazakh"]:
    print(f"{til:14s} {len(stopwords.words(til)):4d} ta")
# uzbek          288 ta   ⭐ eng to'liq turkiy ro'yxat!
# turkish         53 ta
# azerbaijani    165 ta
# kazakh         324 ta

# M5
import spacy
from spacy.lang import __path__ as lp
import os
tillar = [x for x in sorted(os.listdir(lp[0])) if len(x) in (2, 3)]
print("spaCy tillari:", len(tillar))       # 79
print("uz:", "uz" in tillar)               # False  ❌
print("tr:", "tr" in tillar)               # True
print("ky:", "ky" in tillar)               # True

# Yechim — ko'p tilli tokenizator
nlp_xx = spacy.blank("xx")
print([t.text for t in nlp_xx("Bu kitob juda yaxshi")])
# ['Bu', 'kitob', 'juda', 'yaxshi']   ✅ tokenizatsiya ISHLAYDI

# M6 — ⭐ O'ZBEKCHA TF-IDF
from sklearn.feature_extraction.text import TfidfVectorizer
matnlar = ["Bu kitob juda yaxshi va qiziqarli edi",
           "Zerikarli va cho'zilgan kitob",
           "Ajoyib asar hammaga tavsiya qilaman"]
tv = TfidfVectorizer(stop_words=stopwords.words("uzbek"))
X = tv.fit_transform(matnlar)
print("Lug'at:", list(tv.get_feature_names_out()))
print("Shakl:", X.shape)
# Lug'at: ['ajoyib', 'asar', 'cho', 'kitob', 'qilaman',
#          'qiziqarli', 'tavsiya', 'yaxshi', 'zerikarli', 'zilgan']
# Shakl: (3, 10)
#
# ✅ ISHLAYDI! sklearn TILDAN MUSTAQIL.
#
# ⚠️⚠️ LEKIN QARANG: "cho" va "zilgan"!
#    "cho'zilgan" so'zi APOSTROF sababli IKKIGA bo'lindi!
#
# 🔑 Bu — O'ZBEK TILIGA XOS MUAMMO.
#    o' va g' harflari apostrof bilan yoziladi:
#       o'z · g'alaba · cho'zilgan · yo'q
#    sklearn'ning standart tokenizatori apostrofni
#    SO'Z CHEGARASI deb biladi.
#
# ✅ YECHIM — o'z token_pattern'ingizni bering:
#    TfidfVectorizer(token_pattern=r"[\w'ʻ’]+")
```

</details>

### 🔴 Qiyin

**M7.** O'zbek tilining agglyutinativ tabiatini o'lchang.

**M8.** O'zbekcha tasniflagich quring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — ⭐ AGGLYUTINATIV MUAMMO
from sklearn.feature_extraction.text import CountVectorizer

uz_matn = ["uyim juda chiroyli", "uyimda mehmon bor",
           "uylarim shaharda joylashgan", "uylarimda hech kim yo'q"]
en_matn = ["my house is beautiful", "there is a guest in my house",
           "my houses are in the city", "nobody is in my houses"]

for nom, m in [("O'ZBEK", uz_matn), ("INGLIZ", en_matn)]:
    cv = CountVectorizer()
    X = cv.fit_transform(m)
    print(f"{nom}: {X.shape[1]} ta noyob 'so'z'")
    print("  ", sorted(cv.get_feature_names_out())[:8])
# O'ZBEK: 13 ta noyob so'z
# INGLIZ: 12 ta noyob so'z
#
# ⚠️ Umumiy son deyarli BIR XIL — chunki ingliz jumlalarida
#    o'z to'xtatish so'zlari ko'p ("my", "is", "in", "the").
#
# 🔑 ASOSIY FARQNI KO'RISH UCHUN faqat "uy"/"house" ni sanang:

uy_shakllari = [w for w in CountVectorizer().fit(uz_matn)
                .get_feature_names_out() if w.startswith("uy")]
house_shakllari = [w for w in CountVectorizer().fit(en_matn)
                   .get_feature_names_out() if w.startswith("house")]
print("O'zbek 'uy' shakllari :", sorted(uy_shakllari))
print("Ingliz 'house' shakli :", sorted(house_shakllari))
# O'zbek 'uy' shakllari : ['uyim', 'uyimda', 'uylarim', 'uylarimda']   ← 4 ta!
# Ingliz 'house' shakli : ['house', 'houses']                          ← 2 ta
#
# 🎯 BIR XIL MA'NO, 4 ta ustun vs 2 ta ustun!
#
# ⚠️ NATIJA: katta matnda o'zbek lug'ati ANCHA TEZ o'sadi
#    → min_df MUHIMROQ
#    → ko'proq ma'lumot KERAK
#    → stemmer bo'lsa juda foydali bo'lardi

# M8
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression

sharhlar = [
    ("Bu kitob juda yaxshi va qiziqarli edi", "ijobiy"),
    ("Ajoyib asar, hammaga tavsiya qilaman", "ijobiy"),
    ("Zo'r kitob, bir kechada o'qib chiqdim", "ijobiy"),
    ("Yomon kitob, pulimga achindim", "salbiy"),
    ("Zerikarli va cho'zilgan, tavsiya qilmayman", "salbiy"),
    ("Juda sifatsiz, vaqtimni behuda sarfladim", "salbiy"),
]
X = [s for s, _ in sharhlar]; y = [l for _, l in sharhlar]
q = make_pipeline(TfidfVectorizer(stop_words=stopwords.words("uzbek")),
                  LogisticRegression(random_state=0, max_iter=1000))
q.fit(X, y)
for m in ["Bu asar juda ajoyib chiqibdi", "Sifatsiz va zerikarli kitob"]:
    print(f"  {q.predict([m])[0]:8s} | {m}")
#
# ⚠️ 6 ta misol — JUDA KAM (26-modulni eslang!)
#    Haqiqiy loyihada YUZLAB misol kerak.
#    Lekin QUVUR ishlaydi — bu asosiysi.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Nima uchun boshqa tillarda NLP qiyin?
2. NLTK'da o'zbek tili bormi?
3. Nechta o'zbek to'xtatish so'zi bor?
4. spaCy'da o'zbek tili bormi?
5. Qaysi modullar o'zbek tilida **ishlaydi**?
6. Agglyutinativ til nima muammo tug'diradi?

<details>
<summary>✅ Javoblar</summary>

1. ① **Ma'lumot kam** ② **Grammatika farq qiladi** ③ **Oldindan qayta ishlash moslashtirilishi kerak**.
2. ## **HA!** `stopwords.words("uzbek")`.
3. ## **288 ta** *(ingliz tilida 198 ta!)*.
4. ## **YO'Q** — 79 ta tildan biri emas. Lekin `spacy.blank("xx")` **tokenizatsiya** qiladi.
5. ✅ **21** *(tozalash)*, **24** *(vektorlashtirish)*, **25** *(mavzular)*, **26** *(tasniflagich)*. ❌ **22** *(POS/NER)*, **23** *(sentiment)*.
6. `uy`, `uyim`, `uyimda`, `uylarimda` — **hammasi alohida ustun**. Lug'at **ancha kattalashadi** → **`min_df`** muhimroq, **ko'proq ma'lumot** kerak.

</details>

---

## 📌 Xulosa

```
⭐⭐ ENG MUHIM TOPILMA

  from nltk.corpus import stopwords
  uz = stopwords.words("uzbek")     # ✅ 288 TA SO'Z!

  "Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman"
              ↓
  "kitob yaxshi tavsiya qilaman"    ✅ MUKAMMAL


NLTK — 33 til, jumladan:
  uzbek 288 · kazakh 324 · azerbaijani 165 · turkish 53 · tajik

spaCy — 79 til, LEKIN O'ZBEK YO'Q ❌
  Yechim: spacy.blank("xx")  →  tokenizatsiya ishlaydi


🇺🇿 O'ZBEK TILIDA NIMA ISHLAYDI?

  ✅ 21-modul  Tozalash          (288 ta to'xtatish so'zi!)
  ✅ 24-modul  Vektorlashtirish  (sklearn tildan mustaqil)
  ✅ 25-modul  Mavzu modeli
  ✅ 26-modul  Tasniflagich

  ❌ 22-modul  POS/NER    (model yo'q)
  ❌ 23-modul  Sentiment  (lug'at yo'q)

  → KURSNING YARMIDAN KO'PI ISHLAYDI!


⚠️ AGGLYUTINATIV MUAMMO
  INGLIZ:  house, houses           →  2 ta ustun
  O'ZBEK:  uy, uyim, uyimda,
           uylarim, uylarimda      →  5 ta ustun!

  → lug'at KATTA  →  min_df MUHIM  →  ko'proq ma'lumot kerak


💡 ENG AMALIY YO'L
  Ko'p tilli transformerlar (xlm-roberta, mBERT)
  yoki LLM (GPT, Claude) — ular o'zbekchani biladi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Agglyutinativ til | *agglutinative language* | Qo'shimchalar zanjiri bilan so'z yasash |
| Korpus | *corpus* | Til ma'lumotlari to'plami |
| Ko'p tilli model | *multilingual model* | Bir necha tilni biladigan model |
| Qamrovlilik | *inclusivity* | Hamma til uchun yechim |

---

⬅️ [Oldingi: NLP uchun chuqur o'qitish](02-Deep-Learning-for-NLP.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: NLP kelajagi](04-Whats-Next-for-NLP.md)
