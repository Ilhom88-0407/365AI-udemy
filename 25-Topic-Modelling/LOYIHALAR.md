# 🚀 25-modul — Mini-loyihalar

> 6 ta tayyor loyiha. Har biri **ishga tushirilgan va tekshirilgan** *(scikit-learn bilan)*.

---

## ⚙️ Umumiy tayyorgarlik

```bash
pip install scikit-learn pandas numpy nltk matplotlib
```

```python
import pandas as pd, numpy as np, re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

data = pd.read_csv("data/news_articles.csv")
ps = PorterStemmer()
en_stopwords = stopwords.words('english')

def tozala(m):
    m = re.sub(r"[^\w\s]", "", m).lower()
    return [ps.stem(w) for w in word_tokenize(m) if w not in en_stopwords]

articles = [tozala(a) for a in data["content"]]
matn = [" ".join(a) for a in articles]
tokset = [set(t) for t in articles]
```

---

## 1️⃣ Loyiha — Universal mavzu topuvchi

**Maqsad:** Har qanday matn to'plamidan mavzularni topadigan bitta funksiya.

```python
def mavzularni_top(hujjatlar, k=5, usul="lda"):
    """Matn to'plamidan k ta mavzu topadi."""
    if usul == "lda":
        vec = CountVectorizer(max_df=0.5, min_df=5)
        X = vec.fit_transform(hujjatlar)
        model = LatentDirichletAllocation(n_components=k, random_state=42,
                                          max_iter=20).fit(X)
    else:
        vec = TfidfVectorizer(max_df=0.5, min_df=5)
        X = vec.fit_transform(hujjatlar)
        model = TruncatedSVD(n_components=k, random_state=42).fit(X)

    names = vec.get_feature_names_out()
    T = model.transform(X)
    dom = T.argmax(axis=1)

    for i, t in enumerate(model.components_):
        soni = (dom == i).sum()
        print(f"  M{i} ({soni:2d} hujjat):",
              [names[j] for j in t.argsort()[::-1][:6]])
    return model, vec, T


print("=== LDA ===")
lda, cv, T = mavzularni_top(matn, k=5, usul="lda")
```

**Natija:**

```
=== LDA ===
  M0 (28 hujjat): ['ms', 'show', 'play', 'song', 'book', 'night']
  M1 (13 hujjat): ['ms', 'citi', 'rate', 'compani', 'account', 'percent']
  M2 (24 hujjat): ['trump', 'polit', 'republican', 'parti', 'obama', 'support']
  M3 (15 hujjat): ['polic', 'offic', 'citi', 'fire', 'offici', 'vote']
  M4 (20 hujjat): ['govern', 'unit', 'dr', 'offici', 'compani', 'world']
```

### 🎯 Beshta aniq mavzu

| Mavzu | Hujjat | Nom |
|---|---|---|
| **M0** | 28 | 🎭 **Madaniyat va ko'ngilochar** |
| **M1** | 13 | 💰 **Biznes va moliya** |
| **M2** | 24 | 🏛️ **Siyosat** |
| **M3** | 15 | 🚔 **Jinoyat va mahalliy** |
| **M4** | 20 | 🌍 **Hukumat va dunyo** |

> 💡 **`max_df=0.5, min_df=5`** — bu ikki parametrsiz natija **foydasiz** bo'lar edi *(4-darsni eslang)*.

---

## 2️⃣ Loyiha — Mavzularga avtomatik nom berish

**Maqsad:** Har mavzuning **eng ishonchli hujjatini** topib, unga nom berish.

```python
def mavzuga_nom(T, k):
    """Har mavzuning eng ishonchli hujjatini ko'rsatadi."""
    for i in range(k):
        j = T[:, i].argmax()
        print(f"  M{i} ({T[j, i]:.1%}): {data['title'][j][:62]}")


mavzuga_nom(T, 5)
```

**Natija:**

```
  M0 (99.8%): Flight of the Conchords: Aimless, and That's O.K. - The New Yo
  M1 (99.8%): De Blasio's $325 Million Ferry Push: Rides to 5 Boroughs, at S
  M2 (99.8%): Airstrikes by Russia Buttress Turkey in Battle vs. ISIS - The
  M3 (99.9%): A Surly Misfit With No Terror Links Turned a Truck Into a Tank
  M4 (99.9%): Saudis Bankroll Taliban, Even as King Officially Supports Afgh
```

### 🔑 IKKI usul — birga ishlating

```
① TOP SO'ZLAR bo'yicha:
   M2: trump · polit · republican · parti · obama
   → "AQSH ichki siyosati"

② TOP HUJJAT bo'yicha:
   M2: "Airstrikes by Russia Buttress Turkey vs ISIS"
   → "Xalqaro nizolar"
```

> ## ⚠️ **Ikki usul turli javob berdi!** Bu — mavzu **keng** ekanini bildiradi: u **siyosat**ni umuman qamrab olgan — ham ichki, ham tashqi.
>
> 💡 **Shuning uchun IKKALASINI ham ko'ring.** Faqat so'zlarga qarash **chalg'itishi** mumkin.

---

## 3️⃣ Loyiha — Optimal `k` ni topish

**Maqsad:** Koherentlik bilan eng yaxshi mavzular sonini aniqlash.

```python
def umass(top_sozlar):
    s, n = 0, 0
    for i in range(1, len(top_sozlar)):
        for j in range(i):
            wi, wj = top_sozlar[i], top_sozlar[j]
            dj  = sum(1 for t in tokset if wj in t)
            dij = sum(1 for t in tokset if wi in t and wj in t)
            if dj > 0:
                s += np.log((dij + 1) / dj); n += 1
    return s / n if n else 0


cv = CountVectorizer(max_df=0.5, min_df=5)
X = cv.fit_transform(matn)
nm = cv.get_feature_names_out()

ballar = []
for k in range(2, 12):
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=20).fit(X)
    c = np.mean([umass([nm[j] for j in t.argsort()[::-1][:10]])
                 for t in l.components_])
    ballar.append(c)
    print(f"  k={k:2d}  {c:8.4f}")

print("\n  Eng yaxshi k:", 2 + int(np.argmax(ballar)))
```

**Natija:**

```
  k= 2   -0.9414
  k= 3   -1.0417
  k= 4   -0.8804     ⭐ ENG YUQORI
  k= 5   -1.0195
  k= 6   -1.0603
  k= 7   -1.0896
  k= 8   -1.0338
  k= 9   -1.0831
  k=10   -1.0826
  k=11   -1.1401

  Eng yaxshi k: 4
```

### 🎯 TOZALASH JAVOBNI O'ZGARTIRDI!

```
TOZALASHSIZ  (7-dars):  eng yaxshi k = 2   ❌ foydasiz mavzular
TOZALANGAN   (bu yer):  eng yaxshi k = 4   ✅ haqiqiy mavzular
```

> ## 🔑 **Mana nima uchun tozalash BIRINCHI qadam.** Iflos ma'lumotda koherentlik **noto'g'ri javob** beradi — u `mr` va `said` ning birga uchrashini "yaxshi mavzu" deb o'ylaydi.

---

## 4️⃣ Loyiha — Semantik qidiruv tizimi

**Maqsad:** Ma'no bo'yicha maqola qidirish — **so'z bir xil bo'lmasa ham**.

```python
tv = TfidfVectorizer(max_df=0.5, min_df=5)
Xt = tv.fit_transform(matn)
lsa = TruncatedSVD(n_components=5, random_state=42).fit(Xt)
D = lsa.transform(Xt)          # ⭐ 100 × 5 — atigi 5 o'lchov!

def semantik_qidir(sorov, n=2):
    q = tv.transform([" ".join(tozala(sorov))])
    qv = lsa.transform(q)
    b = cosine_similarity(qv, D)[0]
    return [(int(i), round(float(b[i]), 4)) for i in b.argsort()[::-1][:n]]


for s in ["election campaign", "car company", "police violence"]:
    print(f"🔍 '{s}':")
    for i, b in semantik_qidir(s):
        print(f"     {b}  {data['title'][i][:58]}")
    print()
```

**Natija:**

```
🔍 'election campaign':
     0.9902  Why Donald Trump, Not Paul Ryan, Is Setting the G.O.P. Age
     0.9808  It's Donald Trump's Party Now - The New York Times

🔍 'car company':
     0.9598  Tesla Model S Suspension Failures Under Scrutiny by Safety
     0.9161  Tesla Hits a New Milestone, Passing G.M. in Valuation - Th

🔍 'police violence':
     0.9685  National Guard Deployed in Milwaukee Amid Unrest Over Fata
     0.9522  At Least 27 Shot, 7 Fatally, in Chicago Over Christmas Wee
```

### 🎉 OLTITASI HAM MUKAMMAL

```
'election campaign' → Trump / Paul Ryan / G.O.P.     ✅
'car company'       → Tesla × 2                       ✅
'police violence'   → Milwaukee / Chicago otishmalari ✅
```

### 🔑 Diqqat — bu 24-moduldan KUCHLIROQ

```
So'rov: "car company"

24-MODUL (TF-IDF):
   "Tesla Model S Suspension Failures" da "car" so'zi YO'Q
   → ball past yoki NOL  ❌

BU MODUL (LSA):
   "Tesla", "vehicl", "model" bir MAVZUDA
   "car" ham o'sha mavzuda
   → ball 0.96  ✅
```

> ## 💡 **Va e'tibor bering:** hujjatlar endi **atigi 5 ta raqam** bilan tasvirlanadi *(8663 emas!)*. Qidiruv **tezroq** va **ma'noliroq**.

---

## 5️⃣ Loyiha — O'xshash maqolalarni topish

**Maqsad:** *"Bunga o'xshash maqolalar"* bo'limi *(yangiliklar saytlaridagi kabi)*.

```python
S = cosine_similarity(D)
np.fill_diagonal(S, 0)

i, j = np.unravel_index(S.argmax(), S.shape)
print(f"Eng o'xshash juftlik: {S[i, j]:.4f}\n")
print(f"  [{i}] {data['title'][i][:62]}")
print(f"  [{j}] {data['title'][j][:62]}")
```

**Natija:**

```
Eng o'xshash juftlik: 0.9985

  [28] Prince's Old Band Resurrects Him Through His Songs - The New
  [75] John Mayer Knows He Messed Up. He Wants Another Chance. - Th
```

### 🎯 IKKALASI HAM MUSIQA HAQIDA

```
"Prince's Old Band ... Songs"           🎵
"John Mayer ... Another Chance"         🎵

Umumiy so'z KAM (Prince ≠ John Mayer),
lekin MAVZU bir xil → o'xshashlik 0.9985
```

### Tavsiya funksiyasi

```python
def oxshash_maqolalar(i, n=3):
    """i-maqolaga o'xshash maqolalarni topadi."""
    b = S[i]
    print(f"📄 {data['title'][i][:62]}\n")
    print("   Bunga o'xshash:")
    for j in b.argsort()[::-1][:n]:
        print(f"     {b[j]:.4f}  {data['title'][j][:56]}")

oxshash_maqolalar(0)
```

> 💡 **Bu — Netflix, YouTube, yangilik saytlaridagi tavsiya tizimining eng sodda versiyasi.**

---

## 6️⃣ Loyiha — LDA va LSA'ni yonma-yon solishtirish

**Maqsad:** Ikki algoritm **bir xil ma'lumotda** nima beradi?

```python
print(f"{'':4s} {'LDA (Bag of Words)':40s} {'LSA (TF-IDF)':40s}")
print("-" * 84)
nt = tv.get_feature_names_out()
for i in range(3):
    a = [nm[j] for j in lda.components_[i].argsort()[::-1][:5]]
    b = [nt[j] for j in lsa.components_[i].argsort()[::-1][:5]]
    print(f"M{i}:  {str(a):40s} {str(b):40s}")
```

**Natija:**

```
     LDA (Bag of Words)                       LSA (TF-IDF)
------------------------------------------------------------------------
M0:  ['ms','show','play','song','book']       ['trump','ms','govern','unit','show']
M1:  ['ms','citi','rate','compani','account'] ['trump','republican','ryan','speech','clinton']
M2:  ['trump','polit','republican','parti','obama'] ['song','album','play','band','music']
```

### 🔑 Uchta muhim kuzatuv

**① Mavzular TARTIBI boshqa**

```
LDA M0 = madaniyat        LSA M0 = umumiy (aralash)
LDA M2 = siyosat          LSA M1 = siyosat
                          LSA M2 = musiqa
```

> Bu **normal** — ikkala algoritm ham mavzularni **o'z tartibida** chiqaradi. Mavzu **raqami** hech narsa anglatmaydi.

**② LSA'ning 0-mavzusi ARALASH**

`trump`, `govern`, `show` — hammasi biroz. Bu — LSA'ning **"korpus o'rtachasi"** *(6-darsni eslang)*.

**③ LSA'ning mavzulari ANIQROQ**

```
LDA M0: show · play · song · book       (madaniyat — keng)
LSA M2: song · album · band · music     (MUSIQA — aniq!)
```

> ## 💡 **Nima uchun?** LSA **TF-IDF** ishlatadi — u `ms`, `show` kabi keng tarqalgan so'zlarga **past vazn** beradi.

### 📊 Xulosa jadvali

| | **LDA** | **LSA** |
|---|---|---|
| Mavzu aniqligi | Yaxshi | **Aniqroq** ⭐ |
| 0-mavzu | Foydali | **Aralash** ⚠️ |
| Talqin | **Osonroq** *(ehtimol)* | Qiyinroq *(manfiy vazn)* |
| Tezlik | Sekinroq | **Tezroq** ⭐ |
| Barqarorlik | Tasodifiy ⚠️ | **Deyarli barqaror** ⭐ |

> ## 🎯 **Tavsiya: IKKALASINI ham ishga tushiring.** Ular **bir xil naqshni** topsa — natija **ishonchli**. Farq qilsa — ma'lumotni **chuqurroq** o'rganing.

---

## 🎓 Yakuniy vazifa

Oltita loyihani **bitta mavzu tahlil tizimiga** birlashtiring:

```
========= MAVZU TAHLIL TIZIMI =========
1 · Mavzularni topish
2 · Mavzularga nom berish
3 · Optimal k ni aniqlash
4 · Semantik qidiruv
5 · O'xshash maqolalar
6 · LDA vs LSA
0 · Chiqish
```

<details>
<summary>💡 Karkas</summary>

```python
class MavzuTahlil:
    def __init__(self, hujjatlar, sarlavhalar, k=5):
        self.h = hujjatlar
        self.s = sarlavhalar
        self.matn = [" ".join(tozala(x)) for x in hujjatlar]

        self.cv = CountVectorizer(max_df=0.5, min_df=5)
        self.X = self.cv.fit_transform(self.matn)
        self.lda = LatentDirichletAllocation(n_components=k, random_state=42,
                                             max_iter=20).fit(self.X)
        self.T = self.lda.transform(self.X)

        self.tv = TfidfVectorizer(max_df=0.5, min_df=5)
        self.Xt = self.tv.fit_transform(self.matn)
        self.lsa = TruncatedSVD(n_components=k, random_state=42).fit(self.Xt)
        self.D = self.lsa.transform(self.Xt)

    def mavzular(self, n=6):
        nm = self.cv.get_feature_names_out()
        for i, t in enumerate(self.lda.components_):
            print(f"M{i}:", [nm[j] for j in t.argsort()[::-1][:n]])

    def qidir(self, sorov, n=3):
        q = self.tv.transform([" ".join(tozala(sorov))])
        b = cosine_similarity(self.lsa.transform(q), self.D)[0]
        return [(self.s[i], round(float(b[i]), 4))
                for i in b.argsort()[::-1][:n]]

    def oxshash(self, i, n=3):
        b = cosine_similarity(self.D[i:i+1], self.D)[0]
        b[i] = 0
        return [(self.s[j], round(float(b[j]), 4))
                for j in b.argsort()[::-1][:n]]


mt = MavzuTahlil(data["content"], data["title"], k=5)
mt.mavzular()
print(mt.qidir("police shooting"))
print(mt.oxshash(0))
```

</details>

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md)
