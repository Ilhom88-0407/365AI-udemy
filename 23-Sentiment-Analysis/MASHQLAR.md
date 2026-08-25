# 📝 23-modul — Barcha mashqlar

> **44 ta mashq** — sentiment tahlili bo'yicha.
> Har birining yechimi **ishga tushirilgan va tekshirilgan**.

## ⚙️ Tayyorgarlik

```bash
pip install textblob vaderSentiment pandas
pip install transformers torch
```

```python
import pandas as pd, re
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import pipeline

vader = SentimentIntensityAnalyzer()
```

---

# A · Tushunchalar *(1–8)*

### 🟢 Oson

**1.** Quyidagilarni tasniflang: ijobiy / salbiy / neytral.

**2.** Har bir sentiment uchun 2 tadan jumla yozing.

**3.** Bir mavzu, uch sentiment.

<details>
<summary>✅ Javoblar 1–3</summary>

**1.**

| Jumla | Javob | Nima uchun |
|---|---|---|
| *"The coffee was perfect."* | 😀 Ijobiy | `perfect` |
| *"The train leaves at 7."* | 😐 Neytral | Fakt |
| *"Never buying from them again."* | 😞 Salbiy | Norozilik |
| *"It's not the worst."* | 😐 Neytral | ⚠️ Ikki karra inkor |
| *"Wow, another meeting. Amazing."* | 😞 Salbiy | ⚠️ **Kinoya** |

**3 — namuna:**

```
MAVZU: qish

😐 "Qish dekabrda boshlanadi."
😀 "Qish keldi! Chang'i uchamiz!"
😞 "Yana qish. Sovuq va qorong'i."
```

</details>

**4.** Sentiment tahlili qiyin bo'ladigan 5 ta holat.

<details>
<summary>✅ Javob</summary>

1. **Kinoya** — `"Ajoyib, yana kechikdi."`
2. **Inkor** — `"yomon emas"`
3. **Aralash** — `"Ovqat zo'r, xizmat dahshatli."`
4. **Kontekst** — `"kuchli qahva"` ☕ vs `"kuchli hid"` 🤢
5. **Solishtirish** — `"eskisidan yaxshiroq"`
6. **Emoji/sleng** — `"bu 🔥"` = juda yaxshi

</details>

### 🟡 O'rta

**5.** Qoidaga asoslangan va transformer farqini jadval qiling.

**6.** Qaysi biznes uchun qaysi usul mos?

<details>
<summary>✅ Javoblar</summary>

**5.**

| | Qoidaga asoslangan | Transformer |
|---|---|---|
| ML | ❌ | ✅ |
| Tezlik | ⚡⚡⚡ | 🐢 |
| Hajm | ~1 MB | 250 MB+ |
| Tushuntirish | ✅ oson | ❌ qora quti |
| Kontekst | ❌ | ✅ |
| Aniqlik | ~72% | ~95% |
| Moslashtirish | ✅ **bir qatorda** | ❌ qayta o'qitish |

**6.**

| Biznes | Usul | Nima uchun |
|---|---|---|
| Millionlab tvit, real vaqt | **VADER** | Tez va arzon |
| Bank shikoyatlari | **Transformer** | Aniqlik muhim |
| Tibbiy matn | **Transformer** + soha modeli | Xato qimmatga tushadi |
| Offlayn qurilma | **VADER** | Internet yo'q |
| Logistika shikoyatlari | **VADER + o'z lug'ati** | `slow`, `delayed` qo'shiladi |

</details>

### 🔴 Qiyin

**7.** Nima uchun `not` sentiment uchun **saqlanadi**?

**8.** `score: 0.998` nimani anglatadi — va nimani **anglatmaydi**?

<details>
<summary>✅ Javoblar</summary>

**7.**

```
21-MODULDA:  to'xtatish so'zlar O'CHIRILADI
             chunki ular MAVZU haqida hech narsa aytmaydi

23-MODULDA:  to'xtatish so'zlar SAQLANADI
             chunki "not", "no", "never" — INKOR

"not good"  →  o'chirsak  →  "good"     ❌ MA'NO TESKARI!
```

**8.**

```
{'label': 'NEGATIVE', 'score': 0.998}
           ↑                    ↑
        JAVOB               ISHONCH

✅ ANGLATADI:    "Men bu SALBIY ekaniga 99.8% ishonaman"
❌ ANGLATMAYDI:  "Bu matn 99.8% ijobiy"

⚠️ Ishonch DOIM musbat (0…1) — hatto salbiy javob uchun ham.
⚠️ Yuqori ishonch ≠ to'g'ri javob. Model 98.6% ishonch bilan
   "I went to see a movie" ni POSITIVE dedi — bu XATO.
```

</details>

---

# B · TextBlob *(9–16)*

### 🟢 Oson

**9.** Jumlaning qutbliligini hisoblang.

**10.** `subjectivity` ni oling.

**11.** Ro'yxatdagi jumlalarni baholang.

<details>
<summary>✅ Yechimlar 9–11</summary>

```python
from textblob import TextBlob

# 9
print(TextBlob("This movie is fantastic!").sentiment.polarity)   # 0.5

# 10
b = TextBlob("This movie is fantastic!")
print(b.sentiment)
# Sentiment(polarity=0.5, subjectivity=0.9)
print(b.sentiment.subjectivity)                                  # 0.9

# 11
jumlalar = ["I love it", "I hate it", "It exists"]
for j in jumlalar:
    print(f"{j:12s} {TextBlob(j).sentiment.polarity:+.3f}")
# I love it      +0.500
# I hate it      -0.800
# It exists      +0.000
```

</details>

### 🟡 O'rta

**12.** So'zlarning individual ballarini toping.

**13.** Kuchaytiruvchi so'zlar ta'sirini o'lchang.

**14.** `subjectivity` yuqori va past jumlalarni toping.

<details>
<summary>✅ Yechimlar 12–14</summary>

```python
# 12
for w in ["excellent", "great", "good", "bad", "terrible", "awful"]:
    print(f"{w:12s} {TextBlob(w).sentiment.polarity:+.3f}")
# excellent    +1.000
# great        +0.800
# good         +0.700
# bad          -0.700   (aslida -0.6999999999999998 — suzuvchi nuqta!)
# terrible     -1.000
# awful        -1.000

# 13
for s in ["good", "very good", "extremely good", "not good"]:
    print(f"{s:16s} {TextBlob(s).sentiment.polarity:+.3f}")
# good             +0.700
# very good        +0.910
# extremely good   +0.700
# not good         -0.350
#
# ⚠️ "very" ballni oshirdi (+0.70 → +0.91),
#    lekin "extremely" HECH NARSA qilmadi — TextBlob uni bilmaydi!
#    "not" esa ballni YARIMGA kamaytirib MANFIY qildi.

# 14
for s in ["The report has 42 pages.",
          "This is the most beautiful thing I have ever seen!"]:
    b = TextBlob(s)
    print(f"pol={b.sentiment.polarity:+.3f}  subj={b.sentiment.subjectivity:.3f} | {s}")
# pol=+0.000  subj=0.000 | The report has 42 pages.
# pol=+0.750  subj=0.750 | This is the most beautiful thing I have ever seen!
#
# 🔑 subj=0.0 → sof FAKT.  subj=0.75 → kuchli FIKR.
```

</details>

### 🔴 Qiyin

**15.** TextBlob yiqiladigan 3 ta jumla toping.

**16.** TextBlob emojini ko'radimi?

<details>
<summary>✅ Yechimlar 15–16</summary>

```python
# 15
yiqilish = [
    "The service wasn't great.",
    "This product exceeded all my expectations!",
    "Oh great, another delayed flight.",
]
for s in yiqilish:
    print(f"{TextBlob(s).sentiment.polarity:+.3f} | {s}")
# +0.800 | The service wasn't great.               ❌ INKOR ko'rmadi
# +0.000 | This product exceeded all my expectations!  ❌ lug'atda YO'Q
# +0.800 | Oh great, another delayed flight.       ❌ KINOYA

# 16
for s in ["The movie was ok", "The movie was ok 😀", "The movie was ok 😞"]:
    print(f"{TextBlob(s).sentiment.polarity:+.3f} | {s}")
# +0.500 | The movie was ok
# +0.500 | The movie was ok 😀
# +0.500 | The movie was ok 😞
#
# ❌ TextBlob emojini UMUMAN KO'RMAYDI — uchalasi ham bir xil!
#    VADER esa: +0.2960 → +0.5719 → -0.2263
```

</details>

---

# C · VADER *(17–28)*

### 🟢 Oson

**17.** To'rtta ballni chiqaring.

**18.** `neg + neu + pos` ni tekshiring.

**19.** Faqat `compound` ni oling.

<details>
<summary>✅ Yechimlar 17–19</summary>

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
vader = SentimentIntensityAnalyzer()

# 17
print(vader.polarity_scores("I love this book, it's amazing!"))
# {'neg': 0.0, 'neu': 0.325, 'pos': 0.675, 'compound': 0.8516}

# 18
s = vader.polarity_scores("I love this book, it's amazing!")
print(round(s["neg"] + s["neu"] + s["pos"], 3))     # 1.0

# 19
print(vader.polarity_scores("Terrible.")["compound"])   # -0.4767
```

</details>

### 🟡 O'rta

**20.** Undov ta'sirini o'lchang.

**21.** BOSH HARF qoidasini sinang.

**22.** Kuchaytiruvchi so'zlarni sinang.

**23.** `but` qoidasini sinang.

<details>
<summary>✅ Yechimlar 20–23</summary>

```python
# 20
for s in ["Good", "Good!", "Good!!", "Good!!!", "Good!!!!"]:
    print(f"{s:10s} {vader.polarity_scores(s)['compound']:+.4f}")
# Good       +0.4404
# Good!      +0.4926
# Good!!     +0.5399
# Good!!!    +0.5826
# Good!!!!   +0.6209
#
# 💡 Har bir undov ballni oshiradi. Ko'tarilish esa SEKINLASHADI:
#    +0.052 → +0.047 → +0.043 → +0.038
#    Ya'ni "Good!!!!!!" yozsangiz ham ball cheksiz o'smaydi.

# 21 — ⚠️ NOZIK JOY!
for s in ["good", "GOOD", "the food was great", "the food was GREAT"]:
    print(f"{s:22s} {vader.polarity_scores(s)['compound']:+.4f}")
# good                   +0.4404
# GOOD                   +0.4404    ⚠️ farq YO'Q!
# the food was great     +0.6249
# the food was GREAT     +0.7034    ✅ endi kuchaydi
#
# 🔑 VADER bosh harfni faqat matnda ARALASH harf bo'lganda hisoblaydi.
#    Butun matn bosh harfda bo'lsa — bu uslub, baqiriq emas.

# 22
for s in ["good", "very good", "extremely good", "marginally good"]:
    print(f"{s:18s} {vader.polarity_scores(s)['compound']:+.4f}")
# good               +0.4404
# very good          +0.4927    ⭐ kuchaytirdi
# extremely good     +0.4927    ⭐ kuchaytirdi (bir xil miqdorda)
# marginally good    +0.3832    ⭐ SUSAYTIRDI!
#
# 💡 VADER "marginally" kabi SUSAYTIRUVCHI so'zlarni ham biladi.
# ⚠️ "very" va "extremely" BIR XIL ta'sir qildi — VADER kuchaytiruvchilarni
#    darajalamaydi, hammasiga bir xil koeffitsiyent qo'llaydi.
#    (Taqqoslang: TextBlob "extremely" ni UMUMAN bilmaydi — 13-mashq.)

# 23
a = "The food was great but the service was terrible."
b = "The service was terrible but the food was great."
print(f"A: {vader.polarity_scores(a)['compound']:+.4f}")   # -0.3818
print(f"B: {vader.polarity_scores(b)['compound']:+.4f}")   # +0.6808
#
# 🔑 BIR XIL SO'ZLAR, BOSHQA TARTIB → TESKARI NATIJA!
#    VADER "but" DAN KEYINGI qismga ko'proq vazn beradi.
```

</details>

### 🔴 Qiyin

**24.** ⭐ VADER lug'atiga **o'z so'zlaringizni** qo'shing.

**25.** Lug'atda nechta so'z bor?

**26.** Eng ijobiy va eng salbiy so'zni toping.

**27.** Emoji ta'sirini o'lchang.

**28.** VADER yiqiladigan holat toping.

<details>
<summary>✅ Yechimlar 24–28</summary>

```python
# 24 — ⭐ ENG FOYDALI MASHQ
m = "The product is okay but shipping was slow."
print("Oldin:", vader.polarity_scores(m))
# Oldin: {'neg': 0.0, 'neu': 0.828, 'pos': 0.172, 'compound': 0.1154}
#         ↑ NOL! VADER "slow" ni salbiy deb BILMAYDI

vader.lexicon.update({
    "slow": -1.5, "late": -1.5, "delayed": -2.0,
    "broken": -2.5, "damaged": -2.5, "missing": -2.0,
})

print("Keyin:", vader.polarity_scores(m))
# Keyin: {'neg': 0.304, 'neu': 0.561, 'pos': 0.136, 'compound': -0.4215}
#         ↑ endi SALBIY!  +0.12 → −0.42
#
# 🔑 BU — QOIDAGA ASOSLANGAN USULNING ENG KATTA AFZALLIGI.
#    Bir qatorda o'z sohangizga moslashtirdingiz.
#    Transformerni moslashtirish uchun KUNLAR va GPU kerak.

# 25
print(len(vader.lexicon), "ta so'z")     # 7506 ta so'z
# (24-mashqdan keyin 7512 — biz 6 ta qo'shdik)

# 26
tartib = sorted(vader.lexicon.items(), key=lambda x: x[1])
print("Eng SALBIY:", tartib[:3])
print("Eng IJOBIY:", tartib[-3:])
# Eng SALBIY: [('rapist', -3.9), ('raping', -3.8), ('slavery', -3.8)]
# Eng IJOBIY: [('ilu', 3.4), ('ily', 3.4), ('magnificently', 3.4)]
#
# 💡 Shkala −4 dan +4 gacha (compound esa −1…+1 ga siqiladi).
#    "ilu" va "ily" = "I love you" qisqartmasi — VADER SLENGNI ham biladi!

# 27
for s in ["The movie was ok", "The movie was ok 😀", "The movie was ok 😞"]:
    print(f"{s:24s} {vader.polarity_scores(s)['compound']:+.4f}")
# The movie was ok         +0.2960
# The movie was ok 😀       +0.5719    ⭐ emoji kuchaytirdi
# The movie was ok 😞       -0.2263    ⭐ emoji TESKARI qildi

# 28 — VADER YIQILGAN
yiqilish = [
    "This product exceeded all my expectations!",
    "Good thing that this is a free story. It is not worth the time.",
    "I love waiting three hours in the rain.",
]
for s in yiqilish:
    print(f"{vader.polarity_scores(s)['compound']:+.4f} | {s[:58]}")
# +0.0000 | This product exceeded all my expectations!     ❌ lug'atda YO'Q
# +0.6740 | Good thing that this is a free story. It is n  ❌ "good"+"free" g'olib
# +0.6369 | I love waiting three hours in the rain.        ❌ KINOYA
```

</details>

---

# D · Transformer *(29–36)*

### 🟢 Oson

**29.** Quvurni yarating va bir jumlani baholang.

**30.** Qaysi model yuklandi?

**31.** Ro'yxatni birdan bering.

<details>
<summary>✅ Yechimlar 29–31</summary>

```python
from transformers import pipeline
tf = pipeline("sentiment-analysis")

# 29
print(tf("This book changed my life."))
# [{'label': 'POSITIVE', 'score': 0.9977309107780457}]

# 30
print(tf.model.name_or_path)
# distilbert/distilbert-base-uncased-finetuned-sst-2-english

# 31 — RO'YXAT TEZROQ
j = ["I love it", "I hate it", "It exists"]
for n in tf(j):
    print(f"{n['label']:10s} {n['score']:.4f}")
# POSITIVE   0.9999
# NEGATIVE   0.9996
# POSITIVE   0.9997     ⚠️ "It exists" — bu NEYTRAL bo'lishi kerak edi!
#                          Va model 99.97% ISHONCH bilan xato qilyapti.
```

</details>

### 🟡 O'rta

**32.** Barcha ballarni oling.

**33.** Neytralli model ishlating.

**34.** 1–5 yulduzli model ishlating.

<details>
<summary>✅ Yechimlar 32–34</summary>

```python
# 32
hammasi = pipeline("sentiment-analysis",
                   model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                   top_k=None)
for x in hammasi("I had a great time at the movie but the parking was terrible.")[0]:
    print(f"  {x['label']:10s} {x['score']:.4f}")
#   positive   0.6537
#   negative   0.1901
#   neutral    0.1562
#
# 🔑 Faqat 65% ishonch — model o'zi ham ikkilanyapti.
#    top_k=None bo'lmasa, siz buni KO'RMAS edingiz.

# 33
uch = pipeline(model="cardiffnlp/twitter-roberta-base-sentiment-latest")
print(uch("I went to see a movie."))
# [{'label': 'neutral', 'score': 0.666239857673645}]
# ✅ Standart model buni POSITIVE 98.6% degan edi — XATO.

# 34
stars = pipeline(model="nlptown/bert-base-multilingual-uncased-sentiment")
for s in ["Absolutely perfect!", "It was fine.", "Complete waste of money."]:
    n = stars(s)[0]
    print(f"{n['label']:10s} {n['score']:.2%}  | {s}")
# 5 stars    97.53%  | Absolutely perfect!
# 4 stars    45.42%  | It was fine.
# 1 star     89.47%  | Complete waste of money.
#
# ⚠️ "It was fine" → 4 yulduz, ishonch ATIGI 45%.
#    Model 3 va 4 orasida ikkilanyapti — bu ROSTGO'Y signal.
```

</details>

### 🔴 Qiyin

**35.** Transformer kinoyani topa oladimi?

**36.** Neytral jumlalarda standart model nima qiladi?

<details>
<summary>✅ Yechimlar 35–36</summary>

```python
# 35
kinoya = [
    "Oh great, another delayed flight. Just wonderful.",
    "I love waiting three hours in the rain.",
    "Fantastic. My laptop died right before the deadline.",
]
for k in kinoya:
    n = tf(k)[0]
    print(f"{n['label']:10s} {n['score']:.2%}  | {k}")
# POSITIVE   99.99%  | Oh great, another delayed flight. Just wonderful.
# POSITIVE   77.28%  | I love waiting three hours in the rain.
# NEGATIVE   99.12%  | Fantastic. My laptop died right before the deadline.
#
# 🎯 3 tadan ATIGI 1 tasi to'g'ri.
#    Qoidaga asoslangan usul 0/3 edi — transformer biroz yaxshiroq,
#    lekin KINOYANI U HAM YECHA OLMAYDI.
#
# 💡 Ishonch ballariga qarang: 99.99% (xato!) va 77% (xato, lekin ikkilangan).
#    Past ishonch = "bu yerda nimadir g'alati" signali.

# 36
neytral = ["The meeting is at 3pm.", "I bought a laptop.", "The file has 200 pages."]
for x in neytral:
    n = tf(x)[0]
    print(f"{n['label']:10s} {n['score']:.2%}  | {x}")
# POSITIVE   93.48%  | The meeting is at 3pm.
# POSITIVE   69.76%  | I bought a laptop.
# POSITIVE   64.81%  | The file has 200 pages.
#
# ❌ UCHALASI HAM XATO — hammasi NEYTRAL bo'lishi kerak edi.
# 💡 Lekin ISHONCH pasayib boryapti: 93% → 70% → 65%.
#    Neytralga qanchalik yaqin bo'lsa, model shunchalik ikkilanadi.
#    Bu — foydali signal!
```

</details>

---

# E · Amaliy tahlil *(37–44)*

### 🟡 O'rta

**37.** Kitob sharhlarini yuklang va VADER'ni ishga tushiring.

**38.** Ballarni yorliqqa aylantiring.

**39.** Reyting bo'yicha o'rtacha ballni hisoblang.

<details>
<summary>✅ Yechimlar 37–39</summary>

```python
data = pd.read_csv("data/book_reviews_sample.csv")
data["clean"] = data["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())

# 37
data["v"] = data["clean"].apply(lambda r: vader.polarity_scores(r)["compound"])
print(data[["clean", "v", "rating"]].head(3).to_string()[:300])

# 38
bins  = [-1, -0.1, 0.1, 1]
names = ["negative", "neutral", "positive"]
data["lab"] = pd.cut(data["v"], bins=bins, labels=names)
print(data["lab"].value_counts().to_string())
# positive    68
# negative    19
# neutral     13

# 39
print(data.groupby("rating")["v"].agg(["count", "mean"]).round(3).to_string())
#         count   mean
# rating
# 1          27 -0.101
# 2          10  0.055
# 3          17  0.375
# 4          25  0.668
# 5          21  0.638
#
# ⚠️ IKKI MUAMMO:
#    · 4⭐ (0.668) > 5⭐ (0.638) — tartib BUZILGAN
#    · 1⭐ atigi -0.101 — deyarli neytral! -0.6 atrofida bo'lishi kerak edi
```

</details>

**40.** VADER eng ko'p qayerda xato qiladi?

<details>
<summary>✅ Yechim</summary>

```python
data["haq"] = data["rating"].apply(
    lambda r: "negative" if r <= 2 else ("neutral" if r == 3 else "positive"))
data["vl"] = data["lab"].astype(str)

xato = data[(data["rating"] == 1) & (data["vl"] == "positive")]
print(f"1⭐ bo'lib 'positive' deb belgilangan: {len(xato)}/27 = {len(xato)/27:.0%}\n")
for _, r in xato.head(3).iterrows():
    print(f"  {r['v']:+.3f} | {r['reviewText'][:70]}")
# 1⭐ bo'lib 'positive' deb belgilangan: 9/27 = 33%
#
#   +0.674 | Good thing that this is a free story. I read it a few years ago
#   +0.511 | let down. Did not think it was worth the money spent at all. Not
#   +0.248 | This was to short. I will not be telling my friends bout it. I di
#
# 🔑 Uchalasida ham ijobiy so'zlar bor ("good", "free", "friends"),
#    lekin UMUMIY XULOSA salbiy. VADER so'zlarni SANAYDI,
#    xulosani TUSHUNMAYDI.
```

</details>

### 🔴 Qiyin

**41.** Uch usulning aniqligini o'lchang.

**42.** Transformer × reyting jadvalini chizing.

**43.** ⭐ Ansambl qurib, aniqlikni solishtiring.

**44.** Sharh uzunligi aniqlikka ta'sir qiladimi?

<details>
<summary>✅ Yechimlar 41–44</summary>

```python
data["t"]  = data["clean"].apply(lambda r: TextBlob(r).sentiment.polarity)
data["tl"] = pd.cut(data["t"], bins=bins, labels=names).astype(str)
data["tfl"] = [tf(r[:512])[0]["label"].lower() for r in data["clean"]]

# 41
print(f"{'MODEL':14s} {'TO\\'LIQ':>8s} {'NEYTRALSIZ':>12s}")
for nom, c in [("TextBlob","tl"), ("VADER","vl"), ("Transformer","tfl")]:
    toliq = (data[c] == data["haq"]).mean()
    f = data[data["haq"] != "neutral"]
    neysiz = (f[c] == f["haq"]).mean()
    print(f"{nom:14s} {toliq:7.1%} {neysiz:11.1%}")
# MODEL           TO'LIQ   NEYTRALSIZ
# TextBlob         53.0%        63.9%
# VADER            64.0%        72.3%
# Transformer      79.0%        95.2%     🏆

# 42
print(pd.crosstab(data["rating"], data["tfl"]).to_string())
#      negative  positive
# rating
# 1          26         1
# 2           9         1
# 3           9         8      ⚠️ TENG BO'LINDI (neytral yo'q!)
# 4           2        23
# 5           0        21      ✅ 100%!

# 43 — ⭐ ANSAMBL
def ovoz(r):
    o = [r["vl"], r["tl"], r["tfl"]]
    g = max(set(o), key=o.count)
    return g, o.count(g)
data[["ovoz", "kel"]] = data.apply(lambda r: pd.Series(ovoz(r)), axis=1)

print("ENSEMBLE:", f"{(data['ovoz'] == data['haq']).mean():.1%}")
# ENSEMBLE: 63.0%
#
# ❌ KUTILMAGAN! Ansambl (63%) Transformer'dan (79%) YOMONROQ!
#    Sabab: ikkita KUCHSIZ model (53% va 64%) kuchlisini BOSIB KETDI.
#    "Ko'proq model = yaxshiroq" — NOTO'G'RI.

print("\nKelishuv bo'yicha aniqlik:")
for k in sorted(data["kel"].unique()):
    g = data[data["kel"] == k]
    print(f"  {k} model rozi: {len(g):3d} ta, aniqlik {(g['ovoz']==g['haq']).mean():.1%}")
#   1 model rozi:   9 ta, aniqlik 11.1%
#   2 model rozi:  33 ta, aniqlik 39.4%
#   3 model rozi:  58 ta, aniqlik 84.5%
#
# ✅ MANA HAQIQIY QIYMAT! Ansambl JAVOB berish uchun emas —
#    QACHON ISHONMASLIKNI bilish uchun.
#    3 model rozi → avtomatlashtiring (58%, 84.5% aniqlik)
#    Aks holda    → ODAM tekshirsin (42%)

# 44
data["uz"] = data["reviewText"].str.split().str.len()
data["togri"] = data["tfl"] == data["haq"]
data["guruh"] = pd.cut(data["uz"], [0, 15, 30, 1000],
                       labels=["qisqa", "o'rta", "uzun"])
print(data.groupby("guruh", observed=True)["togri"]
          .agg(["count", "mean"]).round(3).to_string())
```

</details>

---

## 🏆 Yakuniy tekshiruv

Quyidagi jumla uchun **uchala usul** nima deydi — **taxmin qiling**, keyin tekshiring:

```
"The book wasn't bad, but I wouldn't recommend it."
```

<details>
<summary>✅ Javob</summary>

```python
m = "The book wasn't bad, but I wouldn't recommend it."
print("TextBlob   :", TextBlob(m).sentiment.polarity)
print("VADER      :", vader.polarity_scores(m))
print("Transformer:", tf(m))
```

```
TextBlob   : -0.6999999999999998
VADER      : {'neg': 0.23, 'neu': 0.604, 'pos': 0.166, 'compound': -0.1877}
Transformer: [{'label': 'NEGATIVE', 'score': 0.8981841802597046}]
```

### 🔍 Tahlil

Bu jumla **ataylab qiyin** — ikkita inkor bor:

```
"wasn't bad"           →  😐 biroz IJOBIY  ("yomon emas edi")
"wouldn't recommend"   →  😞 SALBIY        ("tavsiya qilmayman")
                          ↑
                    "but" dan KEYIN — asosiy xulosa SHU
```

| Usul | Natija | Baho |
|---|---|---|
| **TextBlob** | **−0.700** | ✅ To'g'ri |
| **VADER** | **−0.188** | ✅ To'g'ri *(lekin kuchsiz)* |
| **Transformer** | **NEGATIVE 89.8%** | ✅ To'g'ri |

> ## ✅ **UCHALASI HAM TO'G'RI TOPDI!** Bu safar hech biri yiqilmadi.

### 🔑 Lekin ISHONCH darajalariga qarang

```
TextBlob    −0.700   ← eng qat'iy
Transformer  89.8%   ← ishonchli, lekin 99% emas (odatdagidan PAST)
VADER       −0.188   ← ⚠️ ARANG manfiy!
```

**VADER `−0.188`** — bu chegaraga *(−0.1)* juda yaqin. Agar chegarani `−0.2` qilsangiz, VADER buni **neytral** deb tasniflaydi.

> ## 💡 **Ikkita saboq:**
>
> **①** Qiyin jumlada model **to'g'ri javob** bersa ham, **ishonchi pasayadi**. Transformer odatda 99% beradi, bu yerda **89.8%**. Bu — *"jumla murakkab"* signali.
>
> **②** VADER ballining **kuchi** ham ma'lumot beradi. `−0.9` va `−0.19` — ikkalasi ham "salbiy", lekin **ishonch darajasi butunlay boshqa**. Faqat yorliqni emas, **ballning kattaligini** ham ko'ring.

</details>

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
