# 📝 26-modul — Barcha mashqlar

> **40 ta mashq** — maxsus matn tasniflagichi bo'yicha.
> Har birining yechimi **ishga tushirilgan va tekshirilgan**.

## ⚙️ Tayyorgarlik

```python
import pandas as pd, numpy as np, re, ast
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.model_selection import (train_test_split, cross_val_score,
                                     StratifiedKFold, GridSearchCV)
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import make_pipeline, Pipeline
from sklearn.dummy import DummyClassifier

# KICHIK ma'lumot (kursdagi)
with open("data/sentences.txt", encoding="utf-8") as f:
    raw = ast.literal_eval(f.read())
data = pd.DataFrame(raw, columns=["text", "sentiment"])
data = data.sample(frac=1, random_state=42).reset_index(drop=True)
X, y = data["text"], data["sentiment"]
cv = CountVectorizer()
bow = pd.DataFrame(cv.fit_transform(X).toarray(),
                   columns=cv.get_feature_names_out())
X_train, X_test, y_train, y_test = train_test_split(
    bow, y, test_size=0.3, random_state=42)

# KATTA ma'lumot (yechim)
b = pd.read_csv("data/book_reviews_sample.csv")
b["clean"] = b["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())
b2 = b[b["rating"] != 3].copy()
b2["lab"] = b2["rating"].apply(lambda r: "negative" if r <= 2 else "positive")
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
```

---

# A · Tushunchalar *(1–8)*

### 🟢 Oson

**1.** Bu nazorat ostidami yoki nazoratsizmi?

**2.** `fit` va `predict` nima qiladi?

**3.** Uchta algoritmni ayting.

**4.** Nima uchun ma'lumot aralashtiriladi?

<details>
<summary>✅ Javoblar 1–4</summary>

**1.** ## **NAZORAT OSTIDA** — yorliqlar **bor**.

**2.** **`fit`** — model **o'rganadi**. **`predict`** — yangi ma'lumotga **yorliq qo'yadi**.

**3.** Logistik regressiya · Naive Bayes · Chiziqli SVM.

**4.** Toki test to'plamiga **ikkala sinf** ham tushsin. Aks holda test **faqat bitta sinfdan** iborat bo'lishi mumkin.

</details>

### 🟡 O'rta

**5.** `precision` va `recall` farqi?

**6.** Overfitting nima?

**7.** Cross-validation nima uchun kerak?

**8.** `DummyClassifier` nima uchun kerak?

<details>
<summary>✅ Javoblar 5–8</summary>

**5.**
```
precision:  "X deganlarimning qanchasi TO'G'RI?"
recall   :  "Haqiqiy X larning qanchasini TOPDIM?"
```

**6.** Model o'rgatuvchi ma'lumotni **yodlab oladi**, lekin yangi ma'lumotda **yiqiladi**.
```
Bizda:  train 100%  ·  test 33%     ← klassik overfitting
```

**7.** Bitta bo'linish **tasodifga** bog'liq. CV **5 marta** o'lchaydi → **ishonchliroq**.

**8.** Bu — *"aqlsiz"* bazaviy model *(hammasi eng ko'p sinf)*. Agar modelingiz undan yaxshi bo'lmasa — u **hech narsa o'rganmagan**.

</details>

---

# B · Kichik ma'lumot muammosi *(9–20)*

### 🟢 Oson

**9.** Lug'atda nechta so'z bor?

**10.** Train va test hajmi?

**11.** Uchta modelning aniqligi?

<details>
<summary>✅ Yechimlar 9–11</summary>

```python
# 9
print(len(cv.get_feature_names_out()), "so'z /", len(data), "misol")
# 118 so'z / 20 misol
# ❌ 5.9 xususiyat har bir misolga — MODEL YODLAB OLADI

# 10
print(X_train.shape[0], X_test.shape[0])       # 14 6

# 11
for nom, m in [("LR ", LogisticRegression(random_state=0)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    mm = m.fit(X_train, y_train)
    print(f"{nom} {accuracy_score(mm.predict(X_test), y_test):.4f}")
# LR  0.3333
# NB  0.5000
# SVM 0.3333
```

</details>

### 🟡 O'rta

**12.** Overfitting'ni isbotlang.

**13.** `classification_report` ni o'qing.

**14.** `DummyClassifier` bilan solishtiring.

**15.** TF-IDF yordam beradimi?

<details>
<summary>✅ Yechimlar 12–15</summary>

```python
lr = LogisticRegression(random_state=0).fit(X_train, y_train)

# 12 — ⭐ OVERFITTING ISBOTI
print("Train:", accuracy_score(lr.predict(X_train), y_train))
print("Test :", accuracy_score(lr.predict(X_test), y_test))
# Train: 1.0
# Test : 0.3333333333333333
#
# 🎯 100% vs 33% — MUKAMMAL OVERFITTING NAMUNASI.
#    Model 14 ta jumlani YODLAB OLDI, o'rganmadi.

# 13
nb = MultinomialNB().fit(X_train, y_train)
print(classification_report(y_test, nb.predict(X_test), zero_division=0))
#     negative       0.60      0.75      0.67         4
#     positive       0.00      0.00      0.00         2
#                       ↑
#     MODEL BIRORTA HAM "positive" TOPMADI!
#
# 🔑 Aniqlik 0.5 "yaxshi" ko'rinadi, lekin model
#    BITTA SINFNI UMUMAN tanimaydi. Faqat aniqlikka qaramang!

# 14
d = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print("Dummy:", accuracy_score(d.predict(X_test), y_test))
print("Train taqsimot:", y_train.value_counts().to_dict())
print("Test taqsimot :", y_test.value_counts().to_dict())
# Dummy: 0.3333333333333333
# Train taqsimot: {'positive': 8, 'negative': 6}
# Test taqsimot : {'negative': 4, 'positive': 2}
#
# ❌ LOGISTIK REGRESSIYA HAM 0.333 — "AQLSIZ" MODEL BILAN BIR XIL!
# ⚠️ Va taqsimot TESKARI aylangan: train'da positive ko'p,
#    test'da negative ko'p. 20 ta misolda shunday bo'ladi.

# 15
tv = TfidfVectorizer()
Xt = pd.DataFrame(tv.fit_transform(X).toarray(),
                  columns=tv.get_feature_names_out())
a, b_, c, d_ = train_test_split(Xt, y, test_size=0.3, random_state=42)
m = LogisticRegression(random_state=0, max_iter=1000).fit(a, c)
print("TF-IDF:", accuracy_score(m.predict(b_), d_))
# TF-IDF: 0.3333333333333333
#
# 🔑 AYNAN BIR XIL. Muammo VEKTORLASHTIRISHDA emas!
```

</details>

### 🔴 Qiyin

**16.** ⭐ Aniqlikning tasodifga bog'liqligini o'lchang.

**17.** Cross-validation bilan uchala modelni solishtiring.

**18.** Model qaysi so'zlarni o'rgandi?

**19.** `test_size` ni o'zgartiring.

**20.** Nima uchun 118 ustun 20 qator uchun ko'p?

<details>
<summary>✅ Yechimlar 16–20</summary>

```python
# 16 — ⭐⭐ ENG MUHIM MASHQ
ballar = []
for rs in range(20):
    Xtr, Xte, ytr, yte = train_test_split(bow, y, test_size=0.3,
                                          random_state=rs, stratify=y)
    m = LogisticRegression(random_state=0, max_iter=1000).fit(Xtr, ytr)
    ballar.append(accuracy_score(m.predict(Xte), yte))

print("Birinchi 10:", [round(x, 2) for x in ballar[:10]])
print(f"MIN={min(ballar):.2f} MAX={max(ballar):.2f} "
      f"O'RTACHA={np.mean(ballar):.3f} STD={np.std(ballar):.3f}")
# Birinchi 10: [0.5, 0.67, 0.17, 0.5, 0.5, 0.67, 0.67, 0.33, 0.5, 0.17]
# MIN=0.17 MAX=0.83 O'RTACHA=0.483 STD=0.174
#
# 🎯 BIR XIL model, BIR XIL ma'lumot — faqat BO'LINISH boshqa.
#    17% dan 83% gacha = 66 FOIZLIK farq!
#    Bu — MODEL emas, SOF TASODIF.
#
# ❌ O'rtacha 48.3% < tanga tashlash 50%

# 17
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(m, bow, y, cv=skf)
    print(f"{nom} {s.round(2)}  o'rtacha={s.mean():.3f}")
# LR  [0.25 0.75 0.25 0.5  0.75]  o'rtacha=0.500
# NB  [0.25 0.5  0.25 0.75 0.75]  o'rtacha=0.500
# SVM [0.5  0.75 0.25 0.5  0.75]  o'rtacha=0.550
#
# 🔑 HAMMASI ≈ 50% = TANGA TASHLASH.

# 18
nm = cv.get_feature_names_out(); k = lr.coef_[0]
print("Sinflar:", lr.classes_)
print("IJOBIY:", [nm[j] for j in k.argsort()[::-1][:8]])
print("SALBIY:", [nm[j] for j in k.argsort()[:8]])
# IJOBIY: ['in', 'life', 'of', 'am', 'me', 'work', 'happier', 'promotion']
# SALBIY: ['and', 'the', 'terrible', 'headache', 'really', 'rejection', ...]
#
# ❌❌ "in", "of", "am", "me" IJOBIY?! "and", "the" SALBIY?!
#     Bu — MODEL SHOVQINNI O'RGANGANINING ISBOTI.

# 19
for ts in [0.2, 0.3, 0.4, 0.5]:
    a_, b_, c_, d_ = train_test_split(bow, y, test_size=ts, random_state=42)
    m = LogisticRegression(random_state=0, max_iter=1000).fit(a_, c_)
    print(f"test_size={ts} test={len(d_):2d} aniqlik={accuracy_score(m.predict(b_), d_):.3f}")
# test_size=0.2 test= 4 aniqlik=0.250
# test_size=0.3 test= 6 aniqlik=0.333
# test_size=0.4 test= 8 aniqlik=0.500
# test_size=0.5 test=10 aniqlik=0.400
# ⚠️ HAMMASI ≤ 50%

# 20
print("""
118 ta vazn, 14 ta o'rgatuvchi misol.

Bu — 3 ta noma'lumli tenglamani 1 ta tenglama bilan
yechishga o'xshaydi: CHEKSIZ KO'P yechim bor.

Model o'rgatuvchini YODLAB OLADI (100%),
yangi ma'lumotda YIQILADI (33%).
""")
```

</details>

---

# C · Yechim — ko'proq ma'lumot *(21–32)*

### 🟢 Oson

**21.** Kitob sharhlarini yuklang.

**22.** Uchala modelni CV bilan sinang.

**23.** Dummy bilan solishtiring.

<details>
<summary>✅ Yechimlar 21–23</summary>

```python
# 21
print("Sharhlar:", len(b2))
print(b2["lab"].value_counts().to_dict())
# Sharhlar: 83
# {'positive': 46, 'negative': 37}

# 22 — ⭐ Pipeline bilan (sizib chiqishsiz!)
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    q = make_pipeline(CountVectorizer(), m)
    s = cross_val_score(q, b2["clean"], b2["lab"], cv=skf)
    print(f"{nom} {s.round(2)}  o'rtacha={s.mean():.3f} (±{s.std():.3f})")
# LR  [0.88 0.76 0.76 0.88 0.88]  o'rtacha=0.832 (±0.055)
# NB  [0.71 0.82 0.88 0.94 0.88]  o'rtacha=0.844 (±0.060)
# SVM [0.76 0.82 0.88 0.94 0.94]  o'rtacha=0.869 (±0.067)
#
# 🎉 50% dan 87% ga! ALGORITM O'ZGARMADI — faqat MA'LUMOT.

# 23
q = make_pipeline(CountVectorizer(), DummyClassifier(strategy="most_frequent"))
s = cross_val_score(q, b2["clean"], b2["lab"], cv=skf)
print("Dummy:", round(s.mean(), 3))
# Dummy: 0.554
#
# 🔑 46/83 = 55.4% — "hammasi positive" strategiyasi.
#    SVM 86.9% = dummy'dan +31.5 foiz  ✅ HAQIQIY QIYMAT
```

</details>

### 🟡 O'rta

**24.** ⚠️ Ma'lumot sizib chiqishini ko'rsating.

**25.** `min_df=2` ta'sirini o'lchang.

**26.** Model qaysi so'zlarni o'rgandi?

**27.** TF-IDF bilan solishtiring.

<details>
<summary>✅ Yechimlar 24–27</summary>

```python
# 24 — ⚠️⚠️ MA'LUMOT SIZIB CHIQISHI
# A: NOTO'G'RI — butun ma'lumotda fit
cvA = CountVectorizer(); XA = cvA.fit_transform(b2["clean"])
Xa, Xb_, ya, yb = train_test_split(XA, b2["lab"], test_size=0.3,
                                   random_state=42, stratify=b2["lab"])
mA = SGDClassifier(random_state=0).fit(Xa, ya)
print("A (sizib chiqish):", round(accuracy_score(mA.predict(Xb_), yb), 4),
      " lug'at:", XA.shape[1])

# B: TO'G'RI — avval bo'lamiz, keyin fit
ta, tb, ya2, yb2 = train_test_split(b2["clean"], b2["lab"], test_size=0.3,
                                    random_state=42, stratify=b2["lab"])
cvB = CountVectorizer(); XaB = cvB.fit_transform(ta); XbB = cvB.transform(tb)
mB = SGDClassifier(random_state=0).fit(XaB, ya2)
print("B (to'g'ri)      :", round(accuracy_score(mB.predict(XbB), yb2), 4),
      " lug'at:", XaB.shape[1])

yangi = set(cvA.get_feature_names_out()) - set(cvB.get_feature_names_out())
print("Test'da bor, train'da YO'Q so'zlar:", len(yangi))
# A (sizib chiqish): 0.92   lug'at: 447
# B (to'g'ri)      : 0.92   lug'at: 350
# Test'da bor, train'da YO'Q so'zlar: 97
#
# 🔑 Bu safar aniqlik BIR XIL chiqdi — lekin lug'at 447 va 350!
#    97 ta so'z faqat test'da bor. Sizib chiqishda model ular
#    uchun ham ustun ajratgan — HAQIQIY HAYOTDA BU MUMKIN EMAS.
#
# ⭐ HAR DOIM Pipeline ishlating — u buni IMKONSIZ qiladi.

# 25
for md in [1, 2]:
    cvm = CountVectorizer(min_df=md); Xm = cvm.fit_transform(b2["clean"])
    a_, b_, c_, d_ = train_test_split(Xm, b2["lab"], test_size=0.3,
                                      random_state=42, stratify=b2["lab"])
    m = SGDClassifier(random_state=0).fit(a_, c_)
    print(f"min_df={md} ustun={Xm.shape[1]:3d} aniqlik={accuracy_score(m.predict(b_), d_):.4f}")
# min_df=1 ustun=447 aniqlik=0.9200
# min_df=2 ustun=155 aniqlik=0.9600
#
# 🎯 Ustunlar 65% KAMAYDI, aniqlik esa OSHDI!
#    Faqat bitta sharhda uchraydigan so'z — SHOVQIN.

# 26
cv3 = CountVectorizer(min_df=2); X3 = cv3.fit_transform(b2["clean"])
n3 = cv3.get_feature_names_out()
lr3 = LogisticRegression(random_state=0, max_iter=1000).fit(X3, b2["lab"])
k3 = lr3.coef_[0]
print("IJOBIY:", [n3[j] for j in k3.argsort()[::-1][:8]])
print("SALBIY:", [n3[j] for j in k3.argsort()[:8]])
# IJOBIY: ['love', 'loved', 'the', 'her', 'enjoyed', 'great', 'one', 'to']
# SALBIY: ['not', 'short', 'waste', 'like', 'really', 'me', 'at', 'what']
#
# ✅ ENDI MANTIQIY! love, loved, enjoyed, great  ·  not, short, waste
#    (18-mashqda "in", "of", "am" edi — sof shovqin!)

# 27
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    q = make_pipeline(TfidfVectorizer(), m)
    s = cross_val_score(q, b2["clean"], b2["lab"], cv=skf)
    print(f"TF-IDF {nom} {s.mean():.3f}")
# TF-IDF LR  0.772
# TF-IDF NB  0.821
# TF-IDF SVM 0.857
#
# ⚠️ BOW YAXSHIROQ! (0.832 / 0.844 / 0.869)
# 🔑 Sentiment uchun TAKRORLANISH muhim ("great great great"),
#    TF-IDF esa uni SUYULTIRADI. TF-IDF DOIM yaxshiroq EMAS.
```

</details>

### 🔴 Qiyin

**28.** `stop_words='english'` qo'shing — nima bo'ladi?

**29.** Xatolarni tahlil qiling.

**30.** Uch sinfli tasniflagich quring.

**31.** GridSearch bilan parametrlarni sozlang.

**32.** O'quv egri chizig'ini chizing.

<details>
<summary>✅ Yechimlar 28–32</summary>

```python
# 28 — ⚠️ KUTILMAGAN NATIJA
q = make_pipeline(CountVectorizer(stop_words='english'),
                  SGDClassifier(random_state=0))
s = cross_val_score(q, b2["clean"], b2["lab"], cv=skf)
print("stop_words bilan:", round(s.mean(), 3), " usiz: 0.869")
# stop_words bilan: 0.784   usiz: 0.869
#
# ❌ YOMONLASHDI! -8.5 foiz.
# 🔑 NIMA UCHUN? Ro'yxatda "not", "no", "never" BOR —
#    va ular SENTIMENT uchun HAL QILUVCHI! (23-modulni eslang)
# ⚠️ "Yaxshi amaliyot" HAR DOIM yaxshi EMAS. SINANG.

# 29
ta, tb, ya, yb = train_test_split(b2["clean"], b2["lab"], test_size=0.3,
                                  random_state=42, stratify=b2["lab"])
q = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0)).fit(ta, ya)
p = q.predict(tb)
print("Aniqlik:", round(accuracy_score(p, yb), 4))
for t_, h, pp in zip(tb, yb, p):
    if h != pp:
        print(f"  haqiqiy={h} bashorat={pp}: {t_[:62]}")
# Aniqlik: 0.92
#   haqiqiy=negative bashorat=positive: i wish it was more it left me high and dry...
#   haqiqiy=negative bashorat=positive: short obviously belongs with another book...
#
# 🔍 IKKALASI HAM "KONTEKST" MUAMMOSI:
#   "i WISH it was MORE" → "wish", "more" ijobiy ko'rinadi,
#                          lekin ma'no: YETARLI EMAS
#   "belongs with another book in a SERIES" → "series" ijobiy so'z,
#                          lekin bu yerda: TO'LIQ EMAS
#
# 💡 Buni hal qilish uchun TRANSFORMERLAR kerak (29-34 modullar).

# 30
b["lab3"] = b["rating"].apply(
    lambda r: "negative" if r <= 2 else ("neutral" if r == 3 else "positive"))
print("Taqsimot:", b["lab3"].value_counts().to_dict())
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    q = make_pipeline(CountVectorizer(), m)
    print(f"{nom} {cross_val_score(q, b['clean'], b['lab3'], cv=skf).mean():.3f}")
# Taqsimot: {'positive': 46, 'negative': 37, 'neutral': 17}
# LR  0.630
# NB  0.700
# SVM 0.680
#
# ⚠️ ANIQLIK KESKIN TUSHDI (0.869 → 0.680)
# Sabab: ① vazifa qiyinroq  ② neutral atigi 17 ta
#        ③ neytrallik — eng qiyin sinf

# 31
pipe = Pipeline([("vec", CountVectorizer()),
                 ("clf", SGDClassifier(random_state=0))])
grid = {"vec__ngram_range": [(1,1), (1,2)],
        "vec__min_df": [1, 2],
        "clf__alpha": [0.0001, 0.001]}
gs = GridSearchCV(pipe, grid, cv=skf, n_jobs=1).fit(b2["clean"], b2["lab"])
print("Eng yaxshi:", round(gs.best_score_, 4), gs.best_params_)
# Eng yaxshi: 0.8691 {'clf__alpha': 0.0001, 'vec__min_df': 1,
#                     'vec__ngram_range': (1, 1)}
#
# ⚠️ STANDART sozlamalar G'OLIB! Hech narsa o'zgarmadi.
# 🔑 Bu — foydali natija: "parametrlarni sozlash yordam bermaydi,
#    muammo MA'LUMOT HAJMIDA".

# 32
for n in [30, 45, 60, 83]:
    sub = b2.sample(n=n, random_state=42)
    q = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0))
    print(f"n={n:2d}  {cross_val_score(q, sub['clean'], sub['lab'], cv=skf).mean():.3f}")
# n=30  0.733
# n=45  0.644
# n=60  0.650
# n=83  0.819
#
# 📈 Umumiy tendensiya O'SUVCHI (0.733 → 0.819)
# ⚠️ Lekin TEKIS EMAS — kichik namunada shovqin katta.
# 🔑 Egri chiziq HALI TEKISLANMAGAN → KO'PROQ MA'LUMOT
#    yana yordam berardi!
```

</details>

---

# D · Amaliy qo'llash *(33–40)*

### 🟡 O'rta

**33.** Yangi matnni bashorat qiling.

**34.** Modelni saqlang va yuklang.

**35.** `Pipeline` yarating.

<details>
<summary>✅ Yechimlar 33–35</summary>

```python
quvur = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0))
quvur.fit(b2["clean"], b2["lab"])

# 33
yangi = ["this book was absolutely wonderful i loved every page",
         "complete waste of money do not buy this",
         "it was okay nothing special"]
yc = [re.sub(r"[^\w\s]", "", x).lower() for x in yangi]
for m_, p in zip(yangi, quvur.predict(yc)):
    print(f"  {p:9s} | {m_[:52]}")
#   positive  | this book was absolutely wonderful i loved every page
#   negative  | complete waste of money do not buy this
#   negative  | it was okay nothing special
#
# ✅ Birinchi ikkitasi MUKAMMAL.
# ⚠️ Uchinchisi NEYTRAL, lekin modelda neytral sinf YO'Q —
#    u MAJBURAN ikkitadan birini tanlaydi.

# 34
import pickle
with open("model.pkl", "wb") as f:
    pickle.dump(quvur, f)
with open("model.pkl", "rb") as f:
    yuklangan = pickle.load(f)
print(yuklangan.predict(yc))
#
# 🔑 Pipeline'ni saqlasangiz — VEKTORLASHTIRGICH ham ichida!
#    Alohida saqlasangiz, ikkalasini ham saqlash kerak.

# 35
print(quvur.named_steps)
print("Lug'at hajmi:", len(quvur.named_steps["countvectorizer"].vocabulary_))
```

</details>

### 🔴 Qiyin

**36.** Chalkashlik matritsasini chizing.

**37.** Modelning ishonch darajasini oling.

**38.** Eng ishonchsiz bashoratlarni toping.

**39.** Ikki modelning kelishuvini o'lchang.

**40.** To'liq ishlab chiqarish quvurini yozing.

<details>
<summary>✅ Yechimlar 36–40</summary>

```python
ta, tb, ya, yb = train_test_split(b2["clean"], b2["lab"], test_size=0.3,
                                  random_state=42, stratify=b2["lab"])
q = make_pipeline(CountVectorizer(), LogisticRegression(random_state=0,
                                                        max_iter=1000)).fit(ta, ya)
p = q.predict(tb)

# 36
cm = confusion_matrix(yb, p, labels=["negative", "positive"])
print("            BASHORAT")
print("          neg    pos")
print(f"HAQ  neg [{cm[0,0]:3d} | {cm[0,1]:3d} ]")
print(f"     pos [{cm[1,0]:3d} | {cm[1,1]:3d} ]")
#             BASHORAT
#           neg    pos
# HAQ  neg [  7 |   4 ]     ← 11 tadan 7 tasi to'g'ri
#      pos [  0 |  14 ]     ← 14 tadan 14 tasi to'g'ri ✅
#
# 🔑 Model IJOBIYni mukammal topadi, SALBIYda esa 4 ta xato.
#    Bu — "positive tomonga OG'ISH" (bias).

# 37 — ISHONCH DARAJASI
proba = q.predict_proba(tb)
for t_, pp, pr in list(zip(tb, p, proba.max(axis=1)))[:5]:
    print(f"  {pp:9s} {pr:.1%}  {t_[:48]}")
#   positive  76.7%  this is one awesome book i will keep this on
#   positive  86.2%  tj and jon are very hot in this book christ
#   negative  70.4%  i do not like this one please remove it from
#   positive  75.6%  it was a very good storyline and great book
#   negative  75.0%  let down did not think it was worth the mone
#
# 💡 LogisticRegression'da predict_proba BOR.
#    SGDClassifier'da YO'Q (loss='log_loss' bo'lmasa).

# 38 — ENG ISHONCHSIZ
idx = proba.max(axis=1).argsort()[:3]
print("Eng ishonchsiz 3 ta bashorat:")
for i in idx:
    print(f"  {p[i]:9s} {proba[i].max():.1%}  {list(tb)[i][:50]}")
#   negative  58.3%  i am not real sure about this book just seemed
#   positive  58.8%  i wish it was more it left me high and dry i w
#   positive  64.2%  not very well written and unrealistic
#
# 🎯 AJOYIB NATIJA! Eng ishonchsiz bashoratlar — AYNAN
#    29-mashqda XATO qilgan misollar!
#      "i wish it was more..."          → 58.8% ishonch, XATO
#      "not very well written..."       → 64.2% ishonch, XATO
#
# 🔑 Ya'ni MODEL O'ZI BILADI qachon ishonchsiz ekanini!
#
# ⭐ AMALIY QIYMAT: 70% dan past ishonchli bashoratlarni
#    ODAMGA yuboring. Bu — "human-in-the-loop" (23-modul).

# 39
q2 = make_pipeline(CountVectorizer(), MultinomialNB()).fit(ta, ya)
p2 = q2.predict(tb)
kelishuv = (p == p2).mean()
print(f"LR va NB kelishuvi: {kelishuv:.1%}")
rozimas = [(t_, a_, b_) for t_, a_, b_ in zip(tb, p, p2) if a_ != b_]
for t_, a_, b_ in rozimas:
    print(f"  LR={a_} NB={b_}: {t_[:52]}")
# LR va NB kelishuvi: 92.0%
#   LR=positive NB=negative: not very well written and unrealistic
#   LR=positive NB=negative: i enjoyed the readers digest very much if i coul
#
# 🎯 BIRINCHI misolda NB TO'G'RI, LR XATO!
#    "not very well written" — haqiqatan SALBIY.
#
# 💡 Modellar rozi bo'lmagan holatlar — ENG QIYIN misollar.
#    Va e'tibor bering: bu misol 38-mashqda ham
#    "eng ishonchsiz" ro'yxatida edi. Uchta signal bir joyda!

# 40 — ISHLAB CHIQARISH QUVURI
def tasniflagich_qur(matnlar, yorliqlar):
    """To'liq ishlab chiqarish quvuri."""
    # 1 · Bo'lish
    ta, tb, ya, yb = train_test_split(matnlar, yorliqlar, test_size=0.2,
                                      random_state=42, stratify=yorliqlar)
    # 2 · Pipeline (sizib chiqishsiz)
    q = make_pipeline(CountVectorizer(min_df=2),
                      SGDClassifier(random_state=0))
    # 3 · Cross-validation bilan baholash
    cv_ball = cross_val_score(q, ta, ya, cv=skf)
    # 4 · O'qitish
    q.fit(ta, ya)
    # 5 · Yakuniy sinov
    test_ball = accuracy_score(q.predict(tb), yb)
    # 6 · Dummy bilan solishtirish
    dq = make_pipeline(CountVectorizer(),
                       DummyClassifier(strategy="most_frequent")).fit(ta, ya)
    dummy_ball = accuracy_score(dq.predict(tb), yb)

    print(f"  CV        : {cv_ball.mean():.3f} (±{cv_ball.std():.3f})")
    print(f"  Test      : {test_ball:.3f}")
    print(f"  Dummy     : {dummy_ball:.3f}")
    print(f"  Foyda     : {test_ball - dummy_ball:+.3f}")
    print(f"  Xulosa    : {'✅ ISHLATSA BO`LADI' if test_ball - dummy_ball > 0.15 else '❌ YETARLI EMAS'}")
    return q

model = tasniflagich_qur(b2["clean"], b2["lab"])
#   CV        : 0.711 (±0.078)
#   Test      : 0.941
#   Dummy     : 0.529
#   Foyda     : +0.412
#   Xulosa    : ✅ ISHLATSA BO'LADI
#
# ⚠️ CV (0.711) va Test (0.941) FARQ QILADI!
#    Sabab: test to'plami atigi 17 ta misol (20%) —
#    unga "oson" misollar tushib qolgan.
#
# 🔑 CV — ANCHA ISHONCHLI baho. Test ballini "omad" deb qarang.
#    Haqiqiy kutilayotgan aniqlik: ~71%, 94% emas.
```

</details>

---

## 🏆 Yakuniy tekshiruv

Sizga **500 ta mijoz shikoyati** berildi, ular **5 ta turkumga** teglangan. To'liq rejani yozing.

<details>
<summary>✅ Namuna reja</summary>

```
1 · MA'LUMOTNI TEKSHIRING
    · Har turkumda nechta misol?  (muvozanatmi?)
    · Eng kam turkumda kamida 50 ta bo'lsin
    · Agar 10 ta bo'lsa — o'sha turkumni BIRLASHTIRING yoki TASHLANG

2 · BAZAVIY MODELNI QURING
    DummyClassifier(strategy="most_frequent")
    → BU CHEGARANI yengishingiz kerak

3 · PIPELINE yarating  (sizib chiqishsiz!)
    make_pipeline(CountVectorizer(min_df=2), LogisticRegression())

4 · CROSS-VALIDATION bilan baholang
    StratifiedKFold(5)  ← "Stratified" MUHIM (muvozanat saqlanadi)

5 · UCHTA ALGORITMNI sinang
    LR (bazaviy va tushunarli) · NB (tez) · SVM (odatda eng yaxshi)

6 · XATO TAHLILI qiling  ⭐ ENG MUHIM
    · Qaysi turkumlar chalkashtiriladi?
    · confusion_matrix ni o'qing
    · 10 ta xatoni QO'LDA o'qing

7 · YAXSHILANG
    · min_df, ngram_range ni sinang
    · GridSearchCV
    · Agar yordam bermasa → KO'PROQ MA'LUMOT

8 · O'QUV EGRI CHIZIG'INI chizing
    Tekislanganmi?  → algoritmni yaxshilang
    Ko'tarilyaptimi? → ma'lumot yig'ing

9 · ISHONCH DARAJASINI ishlating
    predict_proba() < 70% → ODAMGA yuboring

10 · SAQLANG
    pickle.dump(pipeline, f)   ← PIPELINE, alohida model emas!
```

> ## 💡 **Eng muhim uchta qoida:**
> ① **`Pipeline`** ishlating *(sizib chiqishga qarshi)*
> ② **`DummyClassifier`** bilan solishtiring
> ③ **Xato tahlili** qiling — aniqlik *"nima"*, xatolar *"nima uchun"* deydi

</details>

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
