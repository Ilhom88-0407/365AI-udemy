# 🚀 27-modul — Mini-loyihalar

> 6 ta loyiha — hammasi **ishga tushirilgan va tekshirilgan**.

---

## ⚙️ Umumiy tayyorgarlik

```python
import pandas as pd, numpy as np, re, spacy
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.pipeline import make_pipeline

data = pd.read_csv("data/fake_news_data.csv")
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
```

---

## 1️⃣ Loyiha — To'liq NLP quvuri

**Maqsad:** Butun loyihani **bitta funksiyaga** joylash.

```python
def nlp_quvur(df, matn_ustun="text", yorliq_ustun="fake_or_factual"):
    """Xom matndan tayyor modelgacha — to'liq quvur."""
    ps_stop = stopwords.words("english")
    lem = WordNetLemmatizer()

    # 1 · SHIPCHANI OLIB TASHLASH (eng muhim!)
    tc = df[matn_ustun].apply(lambda x: re.sub(r"^[^-]*-\s*", "", x))
    # 2 · kichik harf + tinish belgilar
    tc = tc.str.lower().apply(lambda x: re.sub(r"[^\w\s]", "", x))
    # 3 · to'xtatish so'zlari
    tc = tc.apply(lambda x: " ".join(w for w in x.split() if w not in ps_stop))
    # 4 · tokenizatsiya + lemmatizatsiya
    tc = tc.apply(word_tokenize).apply(lambda t: [lem.lemmatize(w) for w in t])

    df = df.copy()
    df["text_clean"] = tc
    X = tc.apply(lambda t: " ".join(t))
    y = df[yorliq_ustun]

    # 5 · Model + cross-validation
    natija = {}
    for nom, m in [("LR", LogisticRegression(random_state=0, max_iter=1000)),
                   ("SVM", SGDClassifier(random_state=0))]:
        s = cross_val_score(make_pipeline(CountVectorizer(), m), X, y, cv=skf)
        natija[nom] = (s.mean(), s.std())
        print(f"  {nom:4s} {s.mean():.3f} (±{s.std():.3f})")

    golib = max(natija, key=lambda k: natija[k][0])
    print(f"\n  🏆 G'olib: {golib} ({natija[golib][0]:.3f})")
    return df, X, y


data, X, y = nlp_quvur(data)
```

**Natija:**

```
  LR   0.889 (±0.045)
  SVM  0.904 (±0.033)

  🏆 G'olib: SVM (0.904)
```

> 💡 **`±` ga ham qarang:** SVM'ning **og'ishi kichikroq** *(0.033 vs 0.045)* — u nafaqat **aniqroq**, balki **barqarorroq**.

---

## 2️⃣ Loyiha — Til belgilar paneli

**Maqsad:** Soxta va haqiqiy yangiliklar **tilini** raqamlarda solishtirish.

```python
nlp = spacy.load("en_core_web_sm")

def til_paneli(df):
    natija = {}
    for tur in df["fake_or_factual"].unique():
        matnlar = df[df["fake_or_factual"] == tur]["text"]
        docs = list(nlp.pipe(matnlar))
        rows = []
        for d in docs:
            rows.extend([(t.text, t.ent_type_, t.pos_) for t in d])
        tdf = pd.DataFrame(rows, columns=["token", "ner_tag", "pos_tag"])

        pc = (tdf.groupby(["token", "pos_tag"]).size()
                 .reset_index(name="n").sort_values("n", ascending=False))
        g = pc.groupby("pos_tag")["token"].count()

        ents = tdf[tdf["ner_tag"] != ""]
        ec = (ents.groupby(["token", "ner_tag"]).size()
                  .reset_index(name="n").sort_values("n", ascending=False))
        person_ulush = (ec.head(10)["ner_tag"] == "PERSON").sum()

        natija[tur] = {
            "token": len(tdf),
            "ADV/NOUN": round(g["ADV"] / g["NOUN"], 3),
            "NUM/NOUN": round(g["NUM"] / g["NOUN"], 3),
            "PERSON top10": person_ulush,
            "top ot": pc[pc.pos_tag == "NOUN"].head(3)["token"].tolist(),
        }
    return pd.DataFrame(natija).T


print(til_paneli(data).to_string())
```

**Natija:**

```
                token  ADV/NOUN  NUM/NOUN  PERSON top10                          top ot
Fake News       45744     0.160     0.085             6      [people, t, president]
Factual News    40393     0.121     0.094             1  [government, year, state]
```

### 🎯 Uchta signal bir jadvalda

```
ADV/NOUN     0.160  vs  0.121    →  +32.3%   HISSIYOTLI til
NUM/NOUN     0.085  vs  0.094    →   -9.2%   KAM raqam
PERSON top10     6  vs      1    →  6 BARAVAR  ODAMLARGA e'tibor
```

> ## 💡 **Bu panel — manfaatdor tomonlarga ko'rsatish uchun TAYYOR.** Uchta raqam butun tahlilni **bir qarashda** beradi.

---

## 3️⃣ Loyiha — Shipcha detektori

**Maqsad:** Ma'lumot to'plamida **"juda yaxshi" belgilarni** avtomatik topish.

```python
def shipcha_topish(df, matn_ustun="text", yorliq_ustun="fake_or_factual",
                   chegara=0.9):
    """Bitta so'z bilan sinflarni ajratadigan "shipchalar"ni topadi."""
    cv = CountVectorizer(min_df=5, binary=True)
    B = cv.fit_transform(df[matn_ustun])
    nm = cv.get_feature_names_out()
    y = df[yorliq_ustun]
    sinflar = y.unique()

    topilgan = []
    for j, so in enumerate(nm):
        bor = B[:, j].toarray().ravel() > 0
        if bor.sum() < 10:
            continue
        for s in sinflar:
            ulush = (y[bor] == s).mean()
            if ulush >= chegara:
                topilgan.append((so, s, bor.sum(), round(ulush, 3)))
    topilgan.sort(key=lambda x: -x[2])
    return topilgan


shipchalar = shipcha_topish(data)
print(f"{len(shipchalar)} ta shipcha topildi\n")
print(f"{'SO`Z':16s} {'SINF':14s} {'MAQOLA':>7s} {'ULUSH':>7s}")
for so, s, n, u in shipchalar[:10]:
    print(f"{so:16s} {s:14s} {n:7d} {u:7.1%}")
```

**Natija:**

```
39 ta shipcha topildi

SO`Z             SINF            MAQOLA   ULUSH
reuters          Factual News       101   99.0%
via              Fake News           48  100.0%
image            Fake News           35   97.1%
featured         Fake News           31  100.0%
minister         Factual News        27  100.0%
month            Factual News        21   90.5%
getty            Fake News           18  100.0%
gop              Fake News           18  100.0%
images           Fake News           18  100.0%
read             Fake News           17  100.0%
```

### 💥 39 TA SHIPCHA — faqat `Reuters` emas!

```
via · image · featured · getty · images
                  ↑
   HAMMASI RASM MANBASI izohidan!
   "Featured image via Getty Images"

   Bu — MAZMUN emas, SOXTA YANGILIK SAYTLARINING FORMATI.
```

> ## 💥 **Bu — 3-darsdagi topilmadan ham KATTAROQ muammo.** Model **matnni umuman o'qimasdan**, faqat **rasm izohi** bo'yicha tasniflashi mumkin edi.

### 🔑 Bu funksiya nima qiladi?

```
Har bir so'z uchun so'raydi:
  "Bu so'z bor maqolalarning 90%+ i BITTA sinfdanmi?"

  HA  →  bu SHIPCHA bo'lishi mumkin!
```

> ## 💡 **Bu funksiyani HAR BIR loyihada ishlating.** U sizga model **matnni tushunmasdan** yuqori aniqlik olishi mumkin bo'lgan joylarni ko'rsatadi.

### ⚠️ Har bir shipchani KO'RIB CHIQING

```
"reuters"  →  ❌ SHIPCHA (agentlik nomi)     →  OLIB TASHLANG
"via"      →  ❌ SHIPCHA ("image via Getty") →  OLIB TASHLANG
"getty"    →  ❌ SHIPCHA (rasm agentligi)    →  OLIB TASHLANG
"featured" →  ❌ SHIPCHA ("featured image")  →  OLIB TASHLANG

"minister" →  ⚠️ SHUBHALI — bu MAZMUN so'zi bo'lishi mumkin
              (haqiqiy yangiliklar rasmiy shaxslar haqida yozadi)

"gop"      →  ⚠️ SHUBHALI — "Republican" ning NORASMIY nomi
              Soxta yangiliklar norasmiy til ishlatadi
              → bu HAQIQIY signal bo'lishi mumkin!
```

> ## 💡 **Har bir shipchani QO'LDA ko'rib chiqing.** Ba'zilari **haqiqiy nuqson** *(getty, via)*, ba'zilari **haqiqiy signal** *(gop — norasmiy til)*. Farqni faqat **soha bilimi** ayta oladi.

### 🧹 Tozalash

```python
shipcha_sozlar = {"reuters", "via", "image", "images", "getty", "featured"}
X_toza = X.apply(lambda s: " ".join(w for w in s.split()
                                    if w not in shipcha_sozlar))
s = cross_val_score(make_pipeline(CountVectorizer(),
                    SGDClassifier(random_state=0)), X_toza, y, cv=skf)
print("Shipchalarsiz aniqlik:", round(s.mean(), 3))
```

> 💡 **Ball pasayishi mumkin** — bu **normal va yaxshi**. Har bir shipcha olib tashlanganda model **haqiqiy vazifaga** yaqinlashadi.

---

## 4️⃣ Loyiha — Manba tahlili

**Maqsad:** 7-darsda topilgan **"Boiler Room"** kabi manbalarni qidirish.

```python
fake_text = data[data["fake_or_factual"] == "Fake News"]["text_clean"]
matn = [" ".join(t) for t in fake_text]

tv = TfidfVectorizer()
Xt = tv.fit_transform(matn)
nt = tv.get_feature_names_out()

lsa = TruncatedSVD(n_components=7, random_state=42).fit(Xt)
D = lsa.transform(Xt)

fake_idx = data[data["fake_or_factual"] == "Fake News"].index
for k in range(7):
    top_sozlar = [nt[j] for j in lsa.components_[k].argsort()[::-1][:6]]
    i = D[:, k].argmax()
    print(f"M{k}: {top_sozlar}")
    print(f"     → {data.loc[fake_idx[i], 'title'][:64]}\n")
```

### 🎯 Nima qidiryapmiz?

```
Mavzu top so'zlari G'ALATI ISMLARDAN iborat bo'lsa
   ("boiler", "acr", "dyer", "mediamaniacs")
        ↓
Bu — MAVZU emas, MANBA!
        ↓
Platformada uni ALOHIDA kuzatish mumkin
```

**Natija:**

```
M0: ['trump','clinton','said','president','woman','republican']
     → BREAKING: Trump, Rudy Giuliani, Reince Priebus, Sen. Jeff Se

M1: ['boiler','room','acr','animal','jay','episode']
     → Boiler Room #104 – War Sells… But Who's Buying      ⭐⭐

M2: ['trump','donald','conference','november','vote','press']
     → Even Trump's New Campaign Manager Demanded He Release His T

M3: ['clinton','hillary','september','email','hillaryclinton','woman']
     → BIG MISTAKE! HILLARY JUST Proved To America She's Committed

M4: ['woman','penny','god','abortion','president','obama']
     → Ted Cruz Repeats Lie About SCOTUS Nominations, Vows To Bloc

M5: ['school','student','law','flynn','worker','state']
     → Trump's America? What This High School Did To A Muslim Girl

M6: ['flynn','hillary','bill','thing','wife','mr']
     → The Senate Intelligence Committee Has Bad News For Flynn Af
```

### 🎯 M1 — TO'LIQ TASDIQ!

```
Mavzu so'zlari:        boiler · room · acr · jay · episode
Eng ishonchli hujjat:  "Boiler Room #104 – War Sells…"
                              ↑
        MAVZU MODELI PODKASTNI TO'G'RIDAN-TO'G'RI TOPDI!
```

> ## 💥 **Bu — mavzu modellashtirishning eng kuchli namunasi.** Hech kim algoritmga *"podkast qidiring"* demadi. U **so'zlar naqshidan** buni **o'zi** topdi.

```
Amaliy qaror:
  "Boiler Room" — TAKRORLANUVCHI MANBA
  ✅ Alohida kuzatuvga oling
  ✅ Yangi maqolalarini avtomatik tekshiring
```

> ## 💡 **Bu — LDA topa olmagan narsa** *(6-dars)*. TF-IDF **noyob** so'zlarni ko'taradi va **konkret manbalarni** ochib beradi.

---

## 5️⃣ Loyiha — Model taqqoslash (halol usul)

**Maqsad:** Modellarni **to'g'ri** solishtirish — bitta bo'linish **emas**.

```python
from sklearn.naive_bayes import MultinomialNB
from sklearn.dummy import DummyClassifier

def halol_taqqoslash(X, y):
    modellar = [
        ("Dummy",       DummyClassifier(strategy="most_frequent")),
        ("LogisticReg", LogisticRegression(random_state=0, max_iter=1000)),
        ("NaiveBayes",  MultinomialNB()),
        ("LinearSVM",   SGDClassifier(random_state=0)),
    ]
    print(f"{'MODEL':14s} {'BOW':>16s} {'TF-IDF':>16s}")
    print("-" * 48)
    for nom, m in modellar:
        a = cross_val_score(make_pipeline(CountVectorizer(), m), X, y, cv=skf)
        b = cross_val_score(make_pipeline(TfidfVectorizer(), m), X, y, cv=skf)
        print(f"{nom:14s} {a.mean():7.3f}(±{a.std():.3f}) "
              f"{b.mean():7.3f}(±{b.std():.3f})")


halol_taqqoslash(X, y)
```

**Natija:**

```
MODEL                       BOW           TF-IDF
------------------------------------------------
Dummy            0.505(±0.006)   0.505(±0.006)
LogisticReg      0.889(±0.045)   0.904(±0.043)
NaiveBayes       0.874(±0.038)   0.824(±0.034)
LinearSVM        0.904(±0.033)   0.899(±0.016)
```

### 🎯 To'rtta kuzatuv

```
① Dummy 0.505  →  hamma model undan ANCHA yuqori ✅

② Eng yaxshi IKKITASI TENG (0.904):
     LinearSVM + BOW      (±0.033)
     LogisticReg + TFIDF  (±0.043)
   → SVM tanlang: og'ishi KICHIKROQ

③ NaiveBayes TF-IDF bilan YOMONLASHDI (0.874 → 0.824)
   → NB SANOQLAR uchun tug'ilgan, TF-IDF uni chalg'itadi

④ LinearSVM + TF-IDF eng KICHIK og'ish (±0.016)
   → eng BARQAROR model
```

> ## 💡 **Faqat o'rtachaga qaramang.** `±0.016` va `±0.045` — **katta farq**. Barqaror model ishlab chiqarishda **ishonchliroq**.

### 🔑 Uchta qoida

```
① PIPELINE ishlating       →  ma'lumot sizib chiqishi YO'Q
② CROSS-VALIDATION         →  bitta bo'linish ALDAYDI
③ DUMMY bilan solishtiring →  "aqlsiz" chegarani yenging
```

> ## ⚠️ **8-darsni eslang:** bitta bo'linishda LR *(88.3%)* SVM'dan *(81.7%)* yaxshiroq ko'rindi. Cross-validation'da **teskari** chiqdi.

---

## 6️⃣ Loyiha — Avtomatik hisobot

**Maqsad:** Manfaatdor tomonlar uchun **tayyor hisobot**.

```python
def hisobot(data, X, y):
    vader = SentimentIntensityAnalyzer()
    d = data.copy()
    d["vs"] = d["text"].apply(lambda x: vader.polarity_scores(x)["compound"])

    from scipy import stats
    a = d[d["fake_or_factual"] == "Fake News"]["vs"]
    b = d[d["fake_or_factual"] == "Factual News"]["vs"]
    t_stat, p = stats.ttest_ind(a, b)

    s = cross_val_score(make_pipeline(CountVectorizer(),
                        SGDClassifier(random_state=0)), X, y, cv=skf)

    print("=" * 58)
    print("  SOXTA YANGILIKLARNI ANIQLASH — YAKUNIY HISOBOT")
    print("=" * 58)
    print(f"  Maqolalar     : {len(d)}  ({(d['fake_or_factual']=='Fake News').sum()} soxta)")
    print(f"  MODEL ANIQLIGI: {s.mean():.1%}  (±{s.std():.1%})")
    print()
    print("  ✅ ISHLAGAN BELGILAR:")
    print("     · Odamlar ismi (top-10 da 6 vs 1)")
    print("     · Ravishlar +32.3% (hissiyotli til)")
    print("     · Sonlar -9.2% (kam tekshiriladigan fakt)")
    print()
    print(f"  ❌ ISHLAMAGAN:")
    print(f"     · Sentiment — farq yo'q (p = {p:.4f})")
    print(f"       soxta {a.mean():+.4f}  ·  haqiqiy {b.mean():+.4f}")
    print()
    print("  ⚠️ OGOHLANTIRISH:")
    print("     Haqiqiy yangiliklar 100% Reuters'dan.")
    print("     Model boshqa agentliklar bilan QAYTA SINALISHI kerak.")
    print("=" * 58)


hisobot(data, X, y)
```

### 💡 Hisobotning uchta qismi

```
✅ NIMA ISHLADI       →  manfaatdorlar buni ishlatadi
❌ NIMA ISHLAMADI     →  ular vaqt tejaydi
⚠️ CHEKLOVLAR         →  ular XAVFNI biladi
```

> ## 🔑 **Uchinchi qism eng muhim.** Modelning **chegarasini** aytmaslik — **professional bo'lmagan** ish.

---

## 🎓 Yakuniy vazifa

Loyihani **o'z ma'lumotingizda** takrorlang:

```
1 · Ma'lumot toping (Kaggle: "fake news", "spam", "reviews")
2 · shipcha_topish() ni ISHGA TUSHIRING  ⭐ birinchi qadam!
3 · Topilgan shipchalarni tozalang
4 · til_paneli() bilan belgilarni toping
5 · halol_taqqoslash() bilan model tanlang
6 · hisobot() bilan yakunlang
```

> ## 💡 **2-qadamni O'TKAZIB YUBORMANG.** Ko'pchilik "ajoyib" natijalar — aslida **topilmagan shipchalar**.

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md)
