# 🚀 26-modul — Mini-loyihalar

> 6 ta tayyor loyiha. Har biri **ishga tushirilgan va tekshirilgan**.

---

## ⚙️ Umumiy tayyorgarlik

```bash
pip install scikit-learn pandas numpy
```

```python
import pandas as pd, numpy as np, re
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.model_selection import (train_test_split, cross_val_score,
                                     StratifiedKFold, GridSearchCV)
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import make_pipeline, Pipeline
from sklearn.dummy import DummyClassifier

b = pd.read_csv("data/book_reviews_sample.csv")
b["clean"] = b["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())

b2 = b[b["rating"] != 3].copy()
b2["lab"] = b2["rating"].apply(lambda r: "negative" if r <= 2 else "positive")

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
```

> ## ⚠️ **Barcha loyihalarda `Pipeline` ishlatiladi** — bu **ma'lumot sizib chiqishini** imkonsiz qiladi *(4-darsni eslang)*.

---

## 1️⃣ Loyiha — Universal tasniflagich quruvchi

**Maqsad:** Bitta funksiya — istalgan algoritm bilan tasniflagich quradi.

```python
def tasniflagich_qur(matnlar, yorliqlar, algo="svm"):
    """Pipeline quradi, cross-validation bilan baholaydi va qaytaradi."""
    modellar = {
        "lr":  LogisticRegression(random_state=0, max_iter=1000),
        "nb":  MultinomialNB(),
        "svm": SGDClassifier(random_state=0),
    }
    quvur = make_pipeline(CountVectorizer(), modellar[algo])
    ballar = cross_val_score(quvur, matnlar, yorliqlar, cv=skf)
    quvur.fit(matnlar, yorliqlar)
    print(f"  {algo:4s}  CV={ballar.mean():.3f}  (±{ballar.std():.3f})")
    return quvur


for a in ["lr", "nb", "svm"]:
    tasniflagich_qur(b2["clean"], b2["lab"], a)
```

**Natija:**

```
  lr    CV=0.832  (±0.055)
  nb    CV=0.844  (±0.060)
  svm   CV=0.869  (±0.067)
```

### 🔑 `±` ni ham o'qing!

```
svm  0.869 ± 0.067   →  haqiqiy qiymat  0.802 – 0.936  oralig'ida
lr   0.832 ± 0.055   →  haqiqiy qiymat  0.777 – 0.887  oralig'ida
                              ↑
                    ORALIQLAR KESISHADI!
```

> ## 💡 **Ya'ni SVM statistik jihatdan LR dan ishonchli tarzda yaxshiroq EMAS.** 83 ta misolda bu farqni **isbotlab bo'lmaydi**.
>
> ## ⚠️ **Faqat o'rtachaga qaramang — `std` ni ham ko'ring.**

---

## 2️⃣ Loyiha — Model taqqoslash paneli

**Maqsad:** Barcha modellarni **`DummyClassifier`** bilan solishtirish.

```python
X = CountVectorizer().fit_transform(b2["clean"])
dummy_ball = cross_val_score(DummyClassifier(strategy="most_frequent"),
                             X, b2["lab"], cv=skf).mean()

print(f"  {'MODEL':14s} {'CV':>7s} {'STD':>7s} {'DUMMYDAN':>10s}")
print("  " + "-" * 42)
for nom, m in [("Dummy", DummyClassifier(strategy="most_frequent")),
               ("LogisticReg", LogisticRegression(random_state=0, max_iter=1000)),
               ("NaiveBayes", MultinomialNB()),
               ("LinearSVM", SGDClassifier(random_state=0))]:
    q = make_pipeline(CountVectorizer(), m)
    s = cross_val_score(q, b2["clean"], b2["lab"], cv=skf)
    print(f"  {nom:14s} {s.mean():7.3f} {s.std():7.3f} {s.mean()-dummy_ball:+10.3f}")
```

**Natija:**

```
  MODEL               CV     STD   DUMMYDAN
  ------------------------------------------
  Dummy            0.554   0.022     +0.000
  LogisticReg      0.832   0.055     +0.278
  NaiveBayes       0.844   0.060     +0.290
  LinearSVM        0.869   0.067     +0.315
```

### 🎯 MANA HAQIQIY BAHO

```
Dummy ("hammasi positive")  →  55.4%
                                 ↑
              Bu — MODELINGIZ YENGISHI KERAK bo'lgan chegara

LinearSVM  →  86.9%   =  dummy'dan +31.5 foiz  ✅ HAQIQIY QIYMAT
```

> ## 💡 **Nima uchun dummy 55.4%?** Chunki ma'lumotda `positive` **46 ta**, `negative` **37 ta** — ya'ni **55%** ijobiy. *"Hammasi ijobiy"* deb aytish **55.4%** beradi.
>
> ## ⚠️ **26-modulning 2-darsida model 33% olgan edi — bu DUMMY'DAN HAM PAST!**

### 💡 Dummy'ning `std` ga qarang

```
Dummy      std = 0.022   ← juda barqaror (u hech narsa o'rganmaydi!)
LinearSVM  std = 0.067   ← ko'proq tebranadi
```

Bu **normal** — o'rganadigan model ma'lumotga **sezgir** bo'ladi.

---

## 3️⃣ Loyiha — Xato tahlili

**Maqsad:** Model **qayerda** va **nima uchun** xato qilishini ko'rish.

```python
t_train, t_test, y_train, y_test = train_test_split(
    b2["clean"], b2["lab"], test_size=0.3, random_state=42, stratify=b2["lab"])

quvur = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0))
quvur.fit(t_train, y_train)
y_pred = quvur.predict(t_test)

print("Aniqlik:", round(accuracy_score(y_pred, y_test), 4))

xatolar = [(t, h, p) for t, h, p in zip(t_test, y_test, y_pred) if h != p]
print("Xatolar soni:", len(xatolar), "\n")
for t, h, p in xatolar:
    print(f"  haqiqiy={h}  bashorat={p}")
    print(f"  {t[:70]}\n")
```

**Natija:**

```
Aniqlik: 0.92
Xatolar soni: 2

  haqiqiy=negative  bashorat=positive
  i wish it was more it left me high and dry i was yearning fo

  haqiqiy=negative  bashorat=positive
  short obviously belongs with another book in a series and un
```

### 🔍 IKKALA XATO HAM O'RGATUVCHI

**① *"i wish it was more... i was yearning for"***

```
"wish", "more", "yearning"  →  bular IJOBIY so'zlarga o'xshaydi!

Aslida ma'no: "ko'proq bo'lishini XOHLARDIM" = YETARLI EMAS
                      ↑
        Bu — NOZIK, YASHIRIN salbiylik.
        Bag of words buni KO'RA OLMAYDI.
```

**② *"short obviously belongs with another book in a series"***

```
"belongs", "series"  →  4-darsda ko'rdik: "series" IJOBIY so'z!
                        (chunki odamlar davomini o'qishni xohlaydi)

Lekin bu yerda: "boshqa kitobga TEGISHLI" = to'liq emas
                      ↑
        Bir xil so'z, TESKARI ma'no. KONTEKST kerak.
```

> ## 🔑 **Ikkala xato ham "kontekst" muammosi.** Bag of Words so'zlarni **alohida** ko'radi. Buni hal qilish uchun **transformerlar** kerak *(29–34-modullar)*.
>
> ## 💡 **Xato tahlili — modelni yaxshilashning ENG YAXSHI usuli.** Aniqlik sizga *"92%"* deydi. Xato tahlili sizga *"NIMA UCHUN 8%"* deydi.

---

## 4️⃣ Loyiha — Uch sinfli tasniflagich

**Maqsad:** **Neytral** sinfni ham qo'shish *(23-moduldagi muammoni eslang)*.

```python
b["lab3"] = b["rating"].apply(
    lambda r: "negative" if r <= 2 else ("neutral" if r == 3 else "positive"))
print("Taqsimot:", b["lab3"].value_counts().to_dict())

for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    q = make_pipeline(CountVectorizer(), m)
    s = cross_val_score(q, b["clean"], b["lab3"], cv=skf)
    print(f"  {nom}  CV={s.mean():.3f}")
```

**Natija:**

```
Taqsimot: {'positive': 46, 'negative': 37, 'neutral': 17}
  LR   CV=0.630
  NB   CV=0.700
  SVM  CV=0.680
```

### ⚠️ ANIQLIK KESKIN TUSHDI

```
IKKI sinf:   LR 0.832 · NB 0.844 · SVM 0.869
UCH sinf:    LR 0.630 · NB 0.700 · SVM 0.680
                  ↓        ↓        ↓
               -20%     -14%     -19%
```

### 🔑 Uchta sabab

**① Vazifa QIYINROQ**

```
2 sinf:  tasodifiy taxmin = 50%
3 sinf:  tasodifiy taxmin = 33%
```

**② `neutral` juda KAM — atigi 17 ta**

```
positive  46 ta   ████████████████████████
negative  37 ta   ███████████████████
neutral   17 ta   ████████
                     ↑
          MUVOZANATSIZ! Model buni yomon o'rganadi.
```

**③ Neytrallik — ENG QIYIN sinf**

```
"it was okay nothing special"
     ↑
Ijobiy so'z ham, salbiy so'z ham YO'Q.
Model nimadan o'rganadi?
```

> ## 💡 **23-modulni eslang:** transformerda ham **aynan shu** muammo bor edi — 3⭐ sharhlar **teng bo'lingan** edi. Bu — **algoritm** muammosi emas, **vazifa** murakkabligi.

---

## 5️⃣ Loyiha — Avtomatik parametr tanlash (GridSearch)

**Maqsad:** Eng yaxshi sozlamalarni **avtomatik** topish.

```python
pipe = Pipeline([("vec", CountVectorizer()),
                 ("clf", SGDClassifier(random_state=0))])

grid = {
    "vec__ngram_range": [(1, 1), (1, 2)],
    "vec__min_df":      [1, 2],
    "clf__alpha":       [0.0001, 0.001],
}

gs = GridSearchCV(pipe, grid, cv=skf, n_jobs=1)
gs.fit(b2["clean"], b2["lab"])

print("Eng yaxshi ball  :", round(gs.best_score_, 4))
print("Eng yaxshi param :", gs.best_params_)
```

**Natija:**

```
Eng yaxshi ball  : 0.8691
Eng yaxshi param : {'clf__alpha': 0.0001, 'vec__min_df': 1, 'vec__ngram_range': (1, 1)}
```

### ⚠️ KUTILMAGAN — STANDART sozlamalar G'OLIB!

```
8 ta kombinatsiya sinaldi.
G'olib:  alpha=0.0001 (standart), min_df=1 (standart), ngram=(1,1) (standart)
              ↑
        HECH NARSA O'ZGARMADI!
```

> ## 🔑 **Bu — foydali natija, muvaffaqiyatsizlik emas.** U bizga aytadi: *"sozlamalarni o'ynash bu yerda yordam bermaydi — muammo boshqa joyda."*
>
> ## 💡 **Va muammo qayerda?** **MA'LUMOT HAJMIDA.** 83 ta sharh — kam. Parametrlarni sozlash o'rniga **ko'proq ma'lumot** yig'ing.

### 💡 `__` (ikki pastki chiziq) sintaksisi

```
"vec__ngram_range"
  ↑      ↑
qadam   parametr
nomi     nomi

Pipeline ichidagi HAR QANDAY parametrga shunday murojaat qilinadi.
```

---

## 6️⃣ Loyiha — O'quv egri chizig'i

**Maqsad:** *"Ko'proq ma'lumot yordam beradimi?"* degan savolga **javob**.

```python
for n in [30, 45, 60, 83]:
    sub = b2.sample(n=n, random_state=42)
    q = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0))
    s = cross_val_score(q, sub["clean"], sub["lab"], cv=skf)
    print(f"  n={n:2d}  aniqlik={s.mean():.3f}")
```

**Natija:**

```
  n=30  0.733
  n=45  0.644
  n=60  0.650
  n=83  0.819
```

### 📈 Tendensiya

```
n=30  ███████████████████████  0.733
n=45  ████████████████████     0.644     ⚠️ pasaydi
n=60  ████████████████████     0.650
n=83  ██████████████████████████ 0.819   ⬆ eng yuqori
```

### ⚠️ Nima uchun tekis emas?

```
30 → 45 da PASAYDI. Nima uchun?

  · 5 buklamada n=30 → har buklamada atigi 6 ta test misoli
  · Tasodifiy tanlangan 45 ta sharh QIYINROQ bo'lib chiqdi
  · std juda katta — bu farq SHOVQIN darajasida
```

> ## 🔑 **Alohida nuqtaga emas, UMUMIY TENDENSIYAGA qarang:**
>
> ```
> n=30  →  0.733
> n=83  →  0.819        ⬆  +8.6 foiz
> ```
>
> ## 💡 **Va egri chiziq HALI TEKISLANMAGAN** — ya'ni **ko'proq ma'lumot YANA yordam berardi**. Agar 500 ta sharh bo'lganda, aniqlik **90%+** bo'lishi mumkin edi.

### 🎯 Bu — amaliy qaror vositasi

```
Egri chiziq TEKISLANGAN?    →  ko'proq ma'lumot YORDAM BERMAYDI
                               → algoritmni yaxshilang

Egri chiziq HALI KO'TARILYAPTI? →  KO'PROQ MA'LUMOT YIG'ING ⭐
                                   (bizning holat)
```

---

## 🎓 Yakuniy vazifa

Oltita loyihani **bitta tasniflagich laboratoriyasiga** birlashtiring:

```
======== TASNIFLAGICH LABORATORIYASI ========
1 · Model qurish
2 · Barcha modellarni solishtirish
3 · Xato tahlili
4 · Ko'p sinfli rejim
5 · Parametrlarni sozlash
6 · O'quv egri chizig'i
7 · Yangi matnni bashorat qilish
0 · Chiqish
```

<details>
<summary>💡 Karkas</summary>

```python
class TasniflagichLab:
    def __init__(self, matnlar, yorliqlar):
        self.X, self.y = matnlar, yorliqlar
        self.skf = StratifiedKFold(5, shuffle=True, random_state=42)
        self.quvur = None

    def qur(self, algo="svm"):
        m = {"lr": LogisticRegression(random_state=0, max_iter=1000),
             "nb": MultinomialNB(),
             "svm": SGDClassifier(random_state=0)}[algo]
        self.quvur = make_pipeline(CountVectorizer(), m)
        s = cross_val_score(self.quvur, self.X, self.y, cv=self.skf)
        self.quvur.fit(self.X, self.y)
        print(f"{algo}: {s.mean():.3f} (±{s.std():.3f})")
        return self

    def solishtir(self):
        for nom, m in [("Dummy", DummyClassifier(strategy="most_frequent")),
                       ("LR", LogisticRegression(random_state=0, max_iter=1000)),
                       ("NB", MultinomialNB()),
                       ("SVM", SGDClassifier(random_state=0))]:
            q = make_pipeline(CountVectorizer(), m)
            s = cross_val_score(q, self.X, self.y, cv=self.skf)
            print(f"  {nom:6s} {s.mean():.3f}")

    def bashorat(self, matnlar):
        tozalangan = [re.sub(r"[^\w\s]", "", m).lower() for m in matnlar]
        return list(zip(matnlar, self.quvur.predict(tozalangan)))


lab = TasniflagichLab(b2["clean"], b2["lab"])
lab.qur("svm")
lab.solishtir()
print(lab.bashorat(["this book was wonderful", "waste of money"]))
```

</details>

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md)
