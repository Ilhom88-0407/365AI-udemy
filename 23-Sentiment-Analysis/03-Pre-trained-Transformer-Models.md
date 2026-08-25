# 3-dars. Oldindan o'qitilgan transformer modellari

## 🎬 Boshlashdan oldin

> **"Qoidaga asoslangan sentimentni tushunish va amalga oshirish oson, lekin u HAR DOIM ham ANIQ EMAS."**
>
> **"Transformer modellaridan foydalangan holda sentiment tahlilida ba'zi YANGI ISHLANMALAR paydo bo'ldi."**

> ## ⚡ **Bu — kursdagi birinchi CHUQUR O'QITISH modeli.** ChatGPT, Gemini, Claude — hammasi **transformer** arxitekturasiga asoslangan. Bu yerda siz uni **birinchi marta** ishlatasiz.

---

## 1. Transformer nima?

> **"Transformerlar ancha MURAKKAB mavzu. Ular CHUQUR O'QITISHGA asoslangan — bu so'zlar bir-biriga QANDAY TA'SIR QILISHINI va BOG'LANISHINI aniqlash uchun matematik usullar to'plamidan foydalanadi — HATTO ular jumlada BIR-BIRIDAN UZOQ bo'lsa ham."**

```
QOIDAGA ASOSLANGAN                  TRANSFORMER

"the parking wasn't great"          "the parking wasn't great"
        ↓                                   ↓
  har bir so'z ALOHIDA               har bir so'z BOSHQALARGA
  lug'atdan ball oladi               QARAB o'z ma'nosini oladi
        ↓                                   ↓
  "great" = +0.8                     "great" ← "wasn't" ga bog'liq
  "wasn't" = ?                              ↓
        ↓                            ma'no: SALBIY
  natija: +0.8  ❌                   natija: NEGATIVE  ✅
```

### 🔑 Asosiy g'oya — E'TIBOR (attention)

```
"The animal didn't cross the street because IT was too tired."
    ↑                                        ↑
    └────────────────────────────────────────┘
              "it" — bu ANIMAL

"The animal didn't cross the street because IT was too wide."
                          ↑                  ↑
                          └──────────────────┘
                              "it" — bu STREET
```

> ## 💡 **Bitta so'z o'zgardi** *(`tired` → `wide`)*, va `"it"` **butunlay boshqa narsaga** ishora qildi. Transformer buni **ko'radi**. Lug'at esa — **hech qachon**.

> **"Transformerlar qanday ishlashi haqida batafsil ma'lumot bu kurs doirasidan biroz tashqarida. Biz chuqur o'qitishni kursda keyinroq YUQORI DARAJADA ko'rib chiqamiz."**

> 📌 **Bu kursda:** 29–34-modullar **to'liq** LLM va transformer arxitekturasiga bag'ishlangan. Hozircha — faqat **ishlatishni** o'rganamiz.

---

## 2. O'rnatish va ishga tushirish

> **"Hozircha biz uni faqat yuqori darajada ko'rib chiqamiz va kod qanday ishlashini ko'ramiz."**
>
> **"Demak, biz `transformers` ni import qilmoqchimiz va `transformers` dan `pipeline` funksiyasini import qilamiz."**

```bash
pip install transformers torch
```

> ⚠️ **Diqqat:** bu **katta** o'rnatish. `torch` — bir necha **gigabayt**. Birinchi ishga tushirishda model ham **yuklanadi** *(~250 MB)*.

```python
from transformers import pipeline
```

> **"Keyin quvurni yaratmoqchimiz. Shunday qilib, `sentiment_pipeline` o'zgaruvchimizni yaratamiz va `transformers` dan `pipeline` funksiyasidan foydalanib, uni `sentiment-analysis` ga o'rnatamiz."**
>
> ## **"O'rnatish uchun qilishimiz kerak bo'lgan narsa shu."**

```python
sentiment_pipeline = pipeline("sentiment-analysis")
```

```
No model was supplied, defaulted to
distilbert/distilbert-base-uncased-finetuned-sst-2-english
```

### 🔑 `pipeline()` nima qildi?

```
pipeline("sentiment-analysis")
        │
        ├─ 1 · Model TANLADI     (distilbert-base-uncased-finetuned-sst-2)
        ├─ 2 · Modelni YUKLADI   (~250 MB, internetdan)
        ├─ 3 · Tokenizator oldi
        └─ 4 · Hammasini BOG'LADI

Natija: matnni beradigan va yorliqni oladigan TAYYOR funksiya
```

> 💡 **Standart model nomini o'qing:** `distilbert-base-uncased-finetuned-sst-2-english`
>
> - **`distilbert`** — BERT modelining **kichraytirilgan** versiyasi *(tezroq)*
> - **`uncased`** — bosh harfni **ajratmaydi**
> - **`finetuned-sst-2`** — **Stanford Sentiment Treebank** ma'lumotida moslashtirilgan
> - **`english`** — ingliz tili

---

## 3. To'rtta jumlani sinaymiz

> **"Endi biz bu oldindan o'qitilgan transformer sentiment modellarini jumlamizda ishga tushirishimiz mumkin."**

```python
sentence_1 = "I had a great time at the movie. It was really funny."
sentence_2 = "I had a great time at the movie but the parking was terrible."
sentence_3 = "I had a great time at the movie but the parking wasn't great."
sentence_4 = "I went to see a movie."

for i, s in enumerate([sentence_1, sentence_2, sentence_3, sentence_4], 1):
    print(f"S{i}: {sentiment_pipeline(s)}")
```

```
S1: [{'label': 'POSITIVE', 'score': 0.9998732805252075}]
S2: [{'label': 'NEGATIVE', 'score': 0.9981129169464111}]
S3: [{'label': 'NEGATIVE', 'score': 0.9983859062194824}]
S4: [{'label': 'POSITIVE', 'score': 0.9857686161994934}]
```

### ⚠️ Ball — bu QUTBLILIK EMAS!

> **"2-jumla salbiy baholangan. Siz bu yerda ball MUSBAT ekanini ko'rasiz. Bu shunchaki bu transformer modellarining BOSHQACHA BAHOLASH USULI."**
>
> ## **"Demak, unga YORLIQ beriladi va keyin bir turdagi ISHONCH BALLI beriladi. Bu ball 0 dan 1 gacha bo'ladi. Va bu shunchaki u qanchalik ISHONCHLI ekani."**

```
QOIDAGA ASOSLANGAN            TRANSFORMER
compound = -0.4387            {'label': 'NEGATIVE', 'score': 0.998}
     ↑                              ↑              ↑
  −1…+1                          YORLIQ        ISHONCH
  ishora MA'NOGA ega            (javob)        0…1, DOIM musbat
```

> ## ⚠️ **`score: 0.998` "juda ijobiy" degani EMAS!** Bu — *"men bu javobga 99.8% ISHONAMAN"* degani. **Javob esa** — `label` da.

```python
n = sentiment_pipeline(sentence_2)[0]
print(f"Javob  : {n['label']}")          # NEGATIVE
print(f"Ishonch: {n['score']:.1%}")      # 99.8%
```

---

## 4. Natijalarni tahlil qilamiz

| Jumla | **VADER** | **Transformer** | To'g'rimi? |
|---|---|---|---|
| **S1** | +0.807 | **POSITIVE** 99.99% | ✅ |
| **S2** | −0.382 | **NEGATIVE** 99.81% | ✅ |
| **S3** *("wasn't great")* | −0.439 | **NEGATIVE** 99.84% | ✅ ⭐ |
| **S4** *(neytral!)* | 0.000 | **POSITIVE** 98.58% | ## ❌ |

### ✅ S3 — transformer INKORNI tushundi

```
"the parking wasn't great"

TextBlob:     +0.80        ❌ butunlay teskari
VADER:        −0.44        ✅ to'g'ri
Transformer:  NEGATIVE 99.8%  ✅ to'g'ri VA JUDA ISHONCHLI
```

### ❌ S4 — transformer QATTIQ XATO qildi

> ## **"4-jumla uchun unga MUSBAT ball berilgan. Bu G'ALATI, chunki qoidaga asoslangan modellar 4-jumla juda NEYTRAL jumla ekanini aniqlaydi."**
>
> ## **"Bu oldindan o'qitilgan transformer modeli buni HAQIQATAN, HAQIQATAN NOTO'G'RI tushundi."**

```
"I went to see a movie."     ← sof FAKT, hech qanday hissiyot yo'q

TextBlob:     0.000              ✅ NEYTRAL
VADER:        0.000              ✅ NEYTRAL
Transformer:  POSITIVE 98.6%     ❌❌ XATO — va 98.6% ISHONCH bilan!
```

### 🔑 Nima uchun bunday bo'ldi?

```
Model o'qitilgan ma'lumot: SST-2
                             ↑
                    Faqat IKKI yorliq:
                    POSITIVE  yoki  NEGATIVE

                    NEYTRAL YORLIG'I YO'Q!
```

> ## ⚠️ **Model neytralni tanlay OLMAYDI — chunki u bunday yorliqni KO'RMAGAN.** Neytral jumla kelganda u **majburan** ikkitadan birini tanlaydi.
>
> ## 💡 **Bu — chuqur saboq:** model **faqat o'zi ko'rgan narsani** biladi. **Yuqori ishonch ball ≠ to'g'ri javob.**

---

## 5. ⭐ Yechim — boshqa model tanlash

> **"Xo'sh, nima qila olamiz? Xo'sh, turli ma'lumotlarda, turli parametrlar bilan o'qitilgan ko'plab modellar bor."**
>
> **"Keling, bu transformer modellari uchun natijalarimizni yaxshilaydimi yoki yo'qligini ko'rish uchun ingliz tilidagi TVITLARDA o'qitilgan MAXSUS modelni sinab ko'raylik."**

```python
specific_model = pipeline(
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)

for i, s in enumerate([sentence_1, sentence_2, sentence_3, sentence_4], 1):
    print(f"S{i}: {specific_model(s)}")
```

```
S1: [{'label': 'positive', 'score': 0.9882335662841797}]
S2: [{'label': 'positive', 'score': 0.6536719799041748}]
S3: [{'label': 'positive', 'score': 0.8793380260467529}]
S4: [{'label': 'neutral',  'score': 0.666239857673645}]
```

> **"Maxsus modelimizni yaratganimizdan so'ng, kod AYNAN BIR XIL."**

### 🎯 S4 — MUAMMO HAL BO'LDI!

```
"I went to see a movie."

Standart model:  POSITIVE  98.6%   ❌
Maxsus model:    neutral   66.6%   ✅ ⭐
```

> **"Endi 4-jumla — bizning neytral jumlamiz uchun qanday ishlashini ko'raylik. Ha. Bu NEYTRAL sifatida aniqlandi."**
>
> ## **"Demak, shunchaki modelni bizning foydalanish holatimizga biroz MOSROQ narsaga o'zgartirib, biz haqiqatan ajoyib natijalarga erisha olamiz."**

### 🔑 Nima uchun bu model neytralni biladi?

```
cardiffnlp/twitter-roberta-base-sentiment-latest
                                        ↑
                              UCHTA yorliq:
                          negative · neutral · positive  ⭐
```

### ⚠️ Lekin e'tibor bering — ishonch PASAYDI

```
Standart model:   S1 99.99%  S2 99.81%  S3 99.84%  S4 98.58%
                  ↑ deyarli har doim 99%+ (haddan tashqari o'ziga ishongan)

Maxsus model:     S1 98.82%  S2 65.37%  S3 87.93%  S4 66.62%
                  ↑ ARALASH jumlalarda ishonch PAST — bu YAXSHI!
```

> ## 💡 **S2 uchun atigi 65% ishonch** — model *"bu jumlada NUANS bor, ishonchim kam"* deyapti. Bu **rostgo'y** model. 99.8% da'vo qilgan model esa — **haddan tashqari o'ziga ishongan**.

### ⚠️ Halol eslatma

Bu model S2 va S3 ni **`positive`** deb baholadi — o'qituvchi videosida esa ular **negative** chiqqan.

```
Sabab: modellar VAQT O'TISHI BILAN YANGILANADI.
"-latest" nomidagi model — doim eng oxirgi versiya.
```

> ## 🔑 **Bu — o'z-o'zidan saboq.** Model natijasi **modelning versiyasiga** bog'liq. Ishlab chiqarishda **modelni versiyaga qadab qo'ying** *(pin)*, aks holda natijangiz bir kunda o'zgarishi mumkin.

---

## 6. ⭐⭐ Uch usul — yakuniy taqqoslash

| | **TextBlob** | **VADER** | **Transformer** *(standart)* | **Transformer** *(twitter)* |
|---|---|---|---|---|
| **S1** ijobiy | +0.53 ✅ | +0.81 ✅ | POSITIVE ✅ | positive ✅ |
| **S2** aralash | −0.10 ✅ | −0.38 ✅ | NEGATIVE ✅ | positive ⚠️ |
| **S3** inkor | **+0.80** ❌ | −0.44 ✅ | NEGATIVE ✅ | positive ⚠️ |
| **S4** neytral | 0.00 ✅ | 0.00 ✅ | **POSITIVE** ❌ | **neutral** ✅ |
| **Neytral bormi?** | ✅ | ✅ | ❌ | ✅ |
| **Hajmi** | ~1 MB | **~1 MB** | ~250 MB | ~500 MB |
| **Tezlik** | ⚡⚡⚡ | ⚡⚡⚡ | 🐢 | 🐢 |
| **Internet** | ❌ kerak emas | ❌ kerak emas | ✅ *(1-marta)* | ✅ *(1-marta)* |

> ## 💡 **Hech biri MUKAMMAL emas.** Har birining **o'z kuchli tomoni** bor.

---

## 7. 🤗 Hugging Face — modellar ombori

> **"Onlaynda juda ko'p turli ma'lumotlarda o'qitilgan ko'plab modellar mavjud. Shuning uchun agar asosiy model bilan yaxshi natijalar olmayotgan bo'lsangiz — Transformers veb-saytidagi boshqa mavjud modellarni albatta ko'rib chiqing."**

🔗 **huggingface.co/models** — **500 000+** bepul model.

### Sentiment uchun mashhur modellar

| Model | Nima uchun |
|---|---|
| `distilbert-base-uncased-finetuned-sst-2-english` | **Standart** — tez, 2 yorliq |
| `cardiffnlp/twitter-roberta-base-sentiment-latest` | **Ijtimoiy tarmoq** — 3 yorliq ⭐ |
| `nlptown/bert-base-multilingual-uncased-sentiment` | **Ko'p tilli**, 1–5 **yulduz** |
| `finiteautomata/bertweet-base-sentiment-analysis` | Tvitlar |
| `ProsusAI/finbert` | **Moliyaviy** matnlar |

### 💡 Modelni qanday tanlash?

```
1 · Sizning matningiz QANDAY?
       tvit / sharh / yangilik / hujjat?
              ↓
2 · SHUNGA O'XSHASH ma'lumotda o'qitilgan modelni toping
              ↓
3 · O'Z jumlalaringizda sinang     ⭐ ENG MUHIM QADAM
              ↓
4 · Natija yomonmi? → 2-qadamga qayting
```

---

## 8. 💻 To'liq kod

```python
from transformers import pipeline

sentence_1 = "I had a great time at the movie. It was really funny."
sentence_2 = "I had a great time at the movie but the parking was terrible."
sentence_3 = "I had a great time at the movie but the parking wasn't great."
sentence_4 = "I went to see a movie."
jumlalar = [sentence_1, sentence_2, sentence_3, sentence_4]

# ===== 1 · STANDART MODEL =====
sentiment_pipeline = pipeline("sentiment-analysis")
print("=== STANDART MODEL ===")
for i, s in enumerate(jumlalar, 1):
    n = sentiment_pipeline(s)[0]
    print(f"S{i}: {n['label']:10s} {n['score']:.2%}")

# ===== 2 · MAXSUS MODEL =====
specific_model = pipeline(
    model="cardiffnlp/twitter-roberta-base-sentiment-latest")
print("\n=== MAXSUS MODEL (twitter) ===")
for i, s in enumerate(jumlalar, 1):
    n = specific_model(s)[0]
    print(f"S{i}: {n['label']:10s} {n['score']:.2%}")
```

**Natija:**

```
=== STANDART MODEL ===
S1: POSITIVE   99.99%
S2: NEGATIVE   99.81%
S3: NEGATIVE   99.84%
S4: POSITIVE   98.58%     ← ❌ XATO

=== MAXSUS MODEL (twitter) ===
S1: positive   98.82%
S2: positive   65.37%
S3: positive   87.93%
S4: neutral    66.62%     ← ✅ TO'G'RI
```

---

## 9. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Standart model qaysi modelni yukladi?

**M2.** Bir necha jumlani **birdan** baholang.

**M3.** Yorliq va ishonchni **alohida** oling.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(sentiment_pipeline.model.name_or_path)
# distilbert/distilbert-base-uncased-finetuned-sst-2-english

# M2 — RO'YXATNI BIRDAN BERISH (tezroq!)
natijalar = sentiment_pipeline(jumlalar)
for i, n in enumerate(natijalar, 1):
    print(f"S{i}: {n['label']:10s} {n['score']:.4f}")
# S1: POSITIVE   0.9999
# S2: NEGATIVE   0.9981
# S3: NEGATIVE   0.9984
# S4: POSITIVE   0.9858
#
# 💡 Ro'yxatni birdan berish HAR BIRINI alohida berishdan TEZROQ

# M3
n = sentiment_pipeline("This book changed my life.")[0]
print("Yorliq :", n["label"])              # POSITIVE
print("Ishonch:", f"{n['score']:.2%}")     # 99.77%
```

</details>

### 🟡 O'rta

**M4.** Kinoyani transformer topa oladimi?

**M5.** Neytral jumlalarni standart modelga bering.

**M6.** Ikki modelni bir jadvalda solishtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — KINOYA SINOVI (2-darsda qoidaga asoslangan usul YIQILGAN edi)
kinoya = [
    "Oh great, another delayed flight. Just wonderful.",
    "I love waiting three hours in the rain.",
    "Fantastic. My laptop died right before the deadline.",
]
for k in kinoya:
    n = sentiment_pipeline(k)[0]
    print(f"{n['label']:10s} {n['score']:.2%}  | {k}")
# POSITIVE   99.99%  | Oh great, another delayed flight. Just wonderful.
# POSITIVE   77.28%  | I love waiting three hours in the rain.
# NEGATIVE   99.12%  | Fantastic. My laptop died right before the deadline.
#
# 🎯 3 tadan ATIGI 1 tasi to'g'ri (uchinchisi).
#    Qoidaga asoslangan usul 0/3 edi — demak transformer BIROZ yaxshiroq,
#    lekin KINOYANI U HAM YECHA OLMAYDI.
#
# ⚠️ Birinchi jumlada 99.99% ISHONCH bilan XATO qildi!
#    Ikkinchisida esa 77% — ishonchi pastroq, ya'ni model
#    "bu yerda nimadir g'alati" deb sezdi, lekin baribir xato qildi.
#
# 🔑 KINOYA — HAMMA USULNING zaifligi. Buni yechish uchun
#    KINOYAGA MAXSUS o'qitilgan model kerak.

# M5 — NEYTRAL JUMLALAR
neytral = ["The meeting is at 3pm.",
           "I bought a laptop.",
           "The file has 200 pages."]
for x in neytral:
    n = sentiment_pipeline(x)[0]
    print(f"{n['label']:10s} {n['score']:.2%}  | {x}")
# POSITIVE   93.48%  | The meeting is at 3pm.
# POSITIVE   69.76%  | I bought a laptop.
# POSITIVE   64.81%  | The file has 200 pages.
#
# ❌❌ UCHALASI HAM NOTO'G'RI — hammasi aslida NEYTRAL.
#
# 💡 Lekin ISHONCH BALLARIGA qarang: 93% → 70% → 65%.
#    Model neytral jumlaga yaqinlashgani sari ishonchi PASAYADI.
#    Bu — foydali signal! Past ishonch = "bu ehtimol neytral".
#
# 🔑 MODEL NEYTRALNI TANLAY OLMAYDI. Uni o'rgatishmagan.
#    Agar sizga neytral kerak bo'lsa — BOSHQA MODEL tanlang.

# M6
print(f"{'JUMLA':6s} {'STANDART':22s} {'TWITTER':22s}")
print("-" * 52)
for i, s in enumerate(jumlalar, 1):
    a = sentiment_pipeline(s)[0]
    b = specific_model(s)[0]
    print(f"S{i:<5d} {a['label']:10s} {a['score']:6.2%}      "
          f"{b['label']:10s} {b['score']:6.2%}")
```

</details>

### 🔴 Qiyin

**M7.** 1–5 **yulduzli** modelni sinang.

**M8.** Barcha ballarni oling *(faqat g'olibni emas)*.

**M9.** Uch usulni bitta funksiyada birlashtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — YULDUZLI MODEL
stars = pipeline(model="nlptown/bert-base-multilingual-uncased-sentiment")
for s in ["Absolutely perfect!", "It was fine.", "Complete waste of money."]:
    n = stars(s)[0]
    print(f"{n['label']:10s} {n['score']:.2%}  | {s}")
# 5 stars    97.53%  | Absolutely perfect!
# 4 stars    45.42%  | It was fine.
# 1 star     89.47%  | Complete waste of money.
#
# ⚠️ "It was fine" ga 4 yulduz berdi, ishonch ATIGI 45%.
#    Model o'zi ham ikkilanyapti — 3 va 4 orasida.
#
# 💡 Bu model 3 ta emas, 5 TA daraja beradi — mahsulot sharhlari uchun ideal.
#    Va u KO'P TILLI — o'zbekcha ham sinab ko'ring!

# M8 — BARCHA BALLAR
hammasi = pipeline("sentiment-analysis",
                   model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                   top_k=None)
n = hammasi("I had a great time at the movie but the parking was terrible.")
for x in n[0]:
    print(f"  {x['label']:10s} {x['score']:.4f}")
#   positive   0.6537
#   negative   0.1901
#   neutral    0.1562
#
# 🔑 MANA ENDI TO'LIQ MANZARA! Model faqat "positive" demadi —
#    u AYNI PAYTDA salbiy (19%) va neytral (16%) ehtimolni ham ko'rdi.
#    top_k=None bermasangiz — faqat G'OLIBNI ko'rasiz.
#
# 💡 65% — bu "ishonchsiz" g'alaba. Agar sizga aniqlik kerak bo'lsa,
#    70% dan past ballarni ODAMGA yuboring.

# M9 — UCH USUL BIRGA
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
vader = SentimentIntensityAnalyzer()

def uchta_usul(matn):
    tb = TextBlob(matn).sentiment.polarity
    vd = vader.polarity_scores(matn)["compound"]
    tf = sentiment_pipeline(matn)[0]
    print(f"\n{matn}")
    print(f"  TextBlob    : {tb:+.4f}")
    print(f"  VADER       : {vd:+.4f}")
    print(f"  Transformer : {tf['label']} ({tf['score']:.1%})")

uchta_usul("The parking wasn't great.")
#   TextBlob    : +0.8000              ❌
#   VADER       : -0.5096              ✅
#   Transformer : NEGATIVE (99.9%)     ✅
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Transformer nima asosida ishlaydi?
2. `pipeline("sentiment-analysis")` nima qiladi?
3. Transformer natijasidagi `score` nimani anglatadi?
4. Standart model nima uchun `"I went to see a movie"` ni xato baholadi?
5. Maxsus modelni qanday ko'rsatamiz?
6. Maxsus modelning ishonchi nima uchun pastroq — bu yomonmi?
7. Modellarni qayerdan topish mumkin?

<details>
<summary>✅ Javoblar</summary>

1. **Chuqur o'qitish** — so'zlar bir-biriga **qanday ta'sir qilishini** aniqlaydi, hatto ular **uzoq** bo'lsa ham.
2. Modelni **tanlaydi**, **yuklaydi**, tokenizatorni oladi va hammasini **bog'laydi** — bitta tayyor funksiya beradi.
3. **ISHONCH** *(0–1)*, qutblilik **emas**! Javob — `label` da. `score: 0.99` = *"99% ishonaman"*.
4. Chunki u **SST-2** ma'lumotida o'qitilgan — u yerda faqat **POSITIVE** va **NEGATIVE** bor. ## **Model neytralni tanlay olmaydi.**
5. `pipeline(model="cardiffnlp/twitter-roberta-base-sentiment-latest")`
6. Chunki u **aralash** jumlalarda **rostgo'y** — *"ishonchim kam"* deyapti. Bu ## **YAXSHI**. 99.8% da'vo qilgan model haddan tashqari o'ziga ishongan.
7. **huggingface.co/models** — 500 000+ bepul model.

</details>

---

## 📌 Xulosa

```python
from transformers import pipeline

# ===== STANDART =====
p = pipeline("sentiment-analysis")
p("I love this!")
# [{'label': 'POSITIVE', 'score': 0.9998}]
#            ↑ JAVOB      ↑ ISHONCH (qutblilik EMAS!)

# ===== MAXSUS MODEL ⭐ =====
p = pipeline(model="cardiffnlp/twitter-roberta-base-sentiment-latest")

# ===== BARCHA BALLAR =====
p = pipeline("sentiment-analysis", model="...", top_k=None)


        TextBlob  VADER   TF(standart)  TF(twitter)
 S1  ✅   +0.53    +0.81    POSITIVE      positive
 S2  ✅   -0.10    -0.38    NEGATIVE      positive ⚠️
 S3  ❌   +0.80    -0.44 ✅ NEGATIVE ✅   positive ⚠️
 S4  ✅    0.00     0.00    POSITIVE ❌   neutral ✅

 Neytral?  ✅       ✅        ❌            ✅
 Hajmi    1 MB     1 MB     250 MB       500 MB
 Tezlik   ⚡⚡⚡      ⚡⚡⚡       🐢            🐢


⚠️  UCHTA MUHIM SABOQ

1 · score = ISHONCH, qutblilik EMAS
    {'label':'NEGATIVE', 'score':0.998}
     javob bu yerda      ishonch bu yerda

2 · MODEL FAQAT O'ZI KO'RGAN NARSANI BILADI
    SST-2 da NEYTRAL yorliq YO'Q
    → model neytralni TANLAY OLMAYDI
    → 98.6% ishonch bilan XATO qiladi

3 · YUQORI ISHONCH ≠ TO'G'RI JAVOB


💡 MODEL TANLASH
   1 · Matningiz qanday? (tvit/sharh/yangilik)
   2 · Shunga o'xshash ma'lumotda o'qitilganini toping
   3 · O'Z jumlalaringizda SINANG  ⭐
   4 · Yomonmi? → 2-qadamga qayting

🤗 huggingface.co/models — 500 000+ model
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Transformer | *transformer* | Chuqur o'qitish arxitekturasi |
| E'tibor | *attention* | So'zlar o'zaro bog'lanishi |
| Chuqur o'qitish | *deep learning* | Ko'p qatlamli neyron tarmoq |
| Quvur | *pipeline* | Tayyor ishlov zanjiri |
| Oldindan o'qitilgan | *pre-trained* | Tayyor, o'qitilgan model |
| Moslashtirish | *fine-tuning* | Modelni aniq vazifaga sozlash |
| Ishonch balli | *confidence score* | Model qanchalik ishonchli (0–1) |
| Yorliq | *label* | Model javobi |

---

⬅️ [Oldingi: Qoidaga asoslangan sentiment](02-Rule-Based-Sentiment.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Amaliy vazifa](04-Practical-Task.md)
