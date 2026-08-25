# 📝 25-modul — Barcha mashqlar

> **42 ta mashq** — mavzu modellashtirish bo'yicha.
> Yechimlar **scikit-learn** bilan **ishga tushirilgan va tekshirilgan**.

## ⚙️ Tayyorgarlik

```bash
pip install scikit-learn pandas numpy nltk matplotlib
# gensim uchun Python 3.10–3.12 kerak:  pip install gensim
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
ps = PorterStemmer(); en_stopwords = stopwords.words('english')

def tozala(m):
    m = re.sub(r"[^\w\s]", "", m).lower()
    return [ps.stem(w) for w in word_tokenize(m) if w not in en_stopwords]

articles = [tozala(a) for a in data["content"]]
matn = [" ".join(a) for a in articles]
tokset = [set(t) for t in articles]
```

---

# A · Tushunchalar *(1–10)*

### 🟢 Oson

**1.** Mavzu modellashtirish nazorat ostidami?

**2.** "Hujjat" nima?

**3.** `latent` nimani anglatadi?

**4.** Ikkita asosiy algoritm qaysi?

<details>
<summary>✅ Javoblar 1–4</summary>

**1.** ## **NAZORATSIZ** — yorliqlar **kerak emas**.

**2.** Bitta **matn birligi**: DataFrame qatori, ro'yxat elementi, bitta maqola.

**3.** **Yashirin.** Mavzu matnda **yozilmagan** — so'zlardan topamiz.

**4.** **LDA** *(Latent Dirichlet Allocation)* va **LSA** *(Latent Semantic Analysis)*.

</details>

### 🟡 O'rta

**5.** So'zlarni 3 mavzuga guruhlang: `doctor · goal · patient · vote · referee · parliament`

**6.** Dirichlet farazi nima?

**7.** Taqsimot gipotezasi nima?

**8.** SVD formulasidagi 4 ta harf?

<details>
<summary>✅ Javoblar 5–8</summary>

**5.**
```
🏥 doctor · patient      ⚽ goal · referee      🏛️ vote · parliament
```

**6.** Hujjat **asosan BITTA** mavzu haqida — ulushlar **teng emas**, biri **ustun** keladi.

**7.** **O'xshash ma'noli so'zlar BIRGA uchraydi.** `doctor` va `nurse` bir xil qo'shnilarga ega.

**8.**
```
M  = hujjat × termin   (asl)
U  = hujjat × mavzu    "hujjat qaysi mavzuda?"
Σ  = mavzu kuchi       "qanchalik muhim?"
Vᵀ = mavzu × termin    "qaysi so'zlar?"
```

</details>

### 🔴 Qiyin

**9.** Mavzu modeli va tasniflagich farqi?

**10.** LDA va LSA'ni 5 nuqta bo'yicha solishtiring.

<details>
<summary>✅ Javoblar 9–10</summary>

**9.**
```
MAVZU MODELI  →  "Qanday guruhlar BOR?"       (kashfiyot, yorliqSIZ)
TASNIFLAGICH  →  "Bu qaysi guruhga tegishli?"  (bashorat, yorliqLI)

Ular RAQIB EMAS — ketma-ket ishlaydi:
  mavzu modeli yorliq TOPADI → tasniflagich ularni ISHLATADI
```

**10.**

| | LDA | LSA |
|---|---|---|
| Asosi | Ehtimollik | Chiziqli algebra |
| Kiritish | Bag of Words | TF-IDF |
| Natija | Ehtimol *(0–1)* | Vazn *(± bo'lishi mumkin)* |
| Barqarorlik | Tasodifiy | Deyarli barqaror |
| sklearn | `LatentDirichletAllocation` | `TruncatedSVD` |

</details>

---

# B · LDA amaliyoti *(11–22)*

### 🟢 Oson

**11.** Ma'lumotni yuklang va shaklini chiqaring.

**12.** Tozalashdan keyin nechta noyob token?

**13.** Eng ko'p uchraydigan 10 ta so'z.

<details>
<summary>✅ Yechimlar 11–13</summary>

```python
# 11
print(data.shape, data.columns.tolist())
# (100, 3) ['id', 'title', 'content']
print("O'rtacha:", int(data["content"].str.split().str.len().mean()), "so'z")
# O'rtacha: 1112 so'z

# 12
print(len({w for a in articles for w in a}))       # 8691

# 13
from collections import Counter
print(Counter(w for a in articles for w in a).most_common(10))
# [('mr', 1200), ('said', 1038), ('trump', 387), ('would', 312),
#  ('state', 295), ('one', 291), ('year', 280), ('like', 240),
#  ('new', 234), ('peopl', 233)]
#
# ⚠️ "mr" 1200 marta, "said" 1038 marta — MUAMMONING ILDIZI!
```

</details>

### 🟡 O'rta

**14.** 2 ta mavzu bilan LDA ishga tushiring.

**15.** `max_df` va `min_df` qo'shing va farqni ko'ring.

**16.** 5 ta mavzu bilan qayta ishga tushiring.

**17.** Hujjatlarni mavzular bo'yicha sanang.

<details>
<summary>✅ Yechimlar 14–17</summary>

```python
# 14 — SODDA (kursdagi kabi)
cv = CountVectorizer(); X = cv.fit_transform(matn)
nm = cv.get_feature_names_out()
lda = LatentDirichletAllocation(n_components=2, random_state=42,
                                max_iter=10).fit(X)
for i, t in enumerate(lda.components_):
    print(f"M{i}:", [nm[j] for j in t.argsort()[::-1][:6]])
# M0: ['mr', 'said', 'trump', 'would', 'one', 'year']
# M1: ['said', 'mr', 'state', 'polic', 'offic', 'one']
#
# ❌ FOYDASIZ — ikkalasi deyarli bir xil!

# 15 — ⭐ YECHIM
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn); nm2 = cv2.get_feature_names_out()
print(f"{X.shape[1]} → {X2.shape[1]} ustun")
# 8663 → 1853 ustun  (79% o'chdi!)

# 16
lda2 = LatentDirichletAllocation(n_components=5, random_state=42,
                                 max_iter=20).fit(X2)
for i, t in enumerate(lda2.components_):
    print(f"M{i}:", [nm2[j] for j in t.argsort()[::-1][:8]])
# M0: ['ms','show','play','song','book','night','stori','im']
# M1: ['ms','citi','rate','compani','account','percent','team','vehicl']
# M2: ['trump','polit','republican','parti','obama','support','unit','democrat']
# M3: ['polic','offic','citi','fire','offici','vote','local','man']
# M4: ['govern','unit','dr','offici','compani','world','american','research']
#
# ✅ MANA ENDI MA'NO BOR!
#   M0 🎭 madaniyat   M1 💰 biznes   M2 🏛️ siyosat
#   M3 🚔 jinoyat     M4 🌍 hukumat/ilm

# 17
T = lda2.transform(X2)
print(pd.Series(T.argmax(axis=1)).value_counts().sort_index().to_string())
# 0    28
# 1    13
# 2    24
# 3    15
# 4    20
```

</details>

### 🔴 Qiyin

**18.** Bitta maqolaning mavzu ulushlarini chiqaring.

**19.** Har mavzuning eng ishonchli maqolasini toping.

**20.** `random_state` ni o'zgartirib barqarorlikni tekshiring.

**21.** Qo'lda to'xtatish so'zlari ro'yxatini yarating.

**22.** Stemming va lemmatization lug'atini solishtiring.

<details>
<summary>✅ Yechimlar 18–22</summary>

```python
# 18
for i, p in enumerate(T[0]):
    print(f"  M{i}: {p:.1%}  {'█' * int(p*40)}")
print(f"  {data['title'][0][:55]}")
#   M0: 0.0%
#   M1: 0.0%
#   M2: 0.0%
#   M3: 0.0%
#   M4: 99.9%  ████████████████████████████████████████
#   One Weight-Loss Approach Fits All? No, Not Even Close
#
# 🔑 99.9%! Dirichlet farazining KUCHLI namoyishi.
#    Uzun hujjatda (1112 so'z) dalil KO'P — model juda ishonchli.

# 19
for k in range(5):
    i = T[:, k].argmax()
    print(f"M{k} ({T[i,k]:.1%}): {data['title'][i][:58]}")
# M0 (99.8%): Flight of the Conchords: Aimless, and That's O.K.
# M1 (99.8%): De Blasio's $325 Million Ferry Push: Rides to 5 Boroughs
# M2 (99.8%): Airstrikes by Russia Buttress Turkey in Battle vs. ISIS
# M3 (99.9%): A Surly Misfit With No Terror Links Turned a Truck Into a
# M4 (99.9%): Saudis Bankroll Taliban, Even as King Officially Supports

# 20 — ⚠️ BARQARORLIK
for rs in [0, 42, 123]:
    m = LatentDirichletAllocation(n_components=5, random_state=rs,
                                  max_iter=20).fit(X2)
    print(f"rs={rs}:", [nm2[j] for j in m.components_[0].argsort()[::-1][:5]])
#
# ⚠️ Mavzular MAZMUNAN o'xshash, lekin TARTIBI o'zgaradi!
# 🔑 random_state=42 ni DOIM qo'ying.

# 21
mening_sw = ['said', 'mr', 'one', 'would', 'also', 'year',
             'like', 'time', 'new', 'ms', 'could', 'peopl']
cv3 = CountVectorizer(min_df=5, stop_words=mening_sw)
X3 = cv3.fit_transform(matn)
print(f"Qo'lda ro'yxat bilan: {X3.shape[1]} ustun")
#
# 💡 max_df AVTOMATIK, qo'lda ro'yxat ANIQROQ.
#    Eng yaxshisi — IKKALASI birga.

# 22
from nltk.stem import WordNetLemmatizer
lem = WordNetLemmatizer()
def tozala_lem(m):
    m = re.sub(r"[^\w\s]", "", m).lower()
    return [lem.lemmatize(w) for w in word_tokenize(m) if w not in en_stopwords]
lem_art = [tozala_lem(a) for a in data["content"]]
print("Stemming     :", len({w for a in articles for w in a}))
print("Lemmatization:", len({w for a in lem_art for w in a}))
# Stemming     : 8691
# Lemmatization: 11301
#
# 🔑 30% FARQ! Mavzu modeli uchun stemming yaxshiroq —
#    kamroq ustun = tezroq va ZICHROQ naqsh.
```

</details>

---

# C · LSA amaliyoti *(23–32)*

### 🟢 Oson

**23.** LSA'ni 2 mavzu bilan ishga tushiring.

**24.** LDA bilan solishtiring.

**25.** Tushuntirilgan o'zgaruvchanlikni chiqaring.

<details>
<summary>✅ Yechimlar 23–25</summary>

```python
# 23
tv = TfidfVectorizer(); Xt = tv.fit_transform(matn)
nt = tv.get_feature_names_out()
lsa = TruncatedSVD(n_components=2, random_state=42).fit(Xt)
for i, t in enumerate(lsa.components_):
    print(f"M{i}:", [nt[j] for j in t.argsort()[::-1][:6]])
# M0: ['mr', 'trump', 'said', 'state', 'presid', 'would']
# M1: ['trump', 'mr', 'republican', 'ryan', 'speech', 'cruz']

# 24
# LDA M1: said · mr · state · polic · offic · one       ← axlat
# LSA M1: trump · mr · republican · ryan · speech · cruz ← ANIQ!
#
# 🔑 LSA yaxshiroq, chunki u TF-IDF ishlatadi —
#    "mr" va "said" AVTOMATIK past vazn oladi.

# 25
for k in [2, 5, 10, 20, 50]:
    m = TruncatedSVD(n_components=k, random_state=42).fit(Xt)
    print(f"k={k:2d}  →  {m.explained_variance_ratio_.sum():.1%}")
# k= 2  →   3.7%
# k= 5  →   9.3%
# k=10  →  16.9%
# k=20  →  29.2%
# k=50  →  60.4%
#
# 💡 50 ta mavzu ham atigi 60% — matn juda XILMA-XIL.
```

</details>

### 🟡 O'rta

**26.** Tozalangan LSA'ni 5 mavzu bilan ishga tushiring.

**27.** Manfiy vaznlarni toping.

**28.** 0-mavzu nima uchun aralash?

<details>
<summary>✅ Yechimlar 26–28</summary>

```python
# 26
tv2 = TfidfVectorizer(max_df=0.5, min_df=5)
Xt2 = tv2.fit_transform(matn); nt2 = tv2.get_feature_names_out()
lsa2 = TruncatedSVD(n_components=5, random_state=42).fit(Xt2)
for i, t in enumerate(lsa2.components_):
    print(f"M{i}:", [nt2[j] for j in t.argsort()[::-1][:8]])
# M0: ['trump','ms','govern','unit','show','citi','polic','offici']  ⚠️
# M1: ['trump','republican','ryan','speech','clinton','cruz',...]     🏛️
# M2: ['song','album','play','band','music','ms','show','trump']      🎵
# M3: ['polic','offic','shot','shoot','man','violenc','protest',...]  🚔
# M4: ['ms','compani','vehicl','polic','model','rate','percent','car'] 🚗

# 27 — MANFIY VAZNLAR
c = lsa2.components_
print("MIN:", round(c.min(), 4), " MAX:", round(c.max(), 4))
print("Manfiy ulush:", f"{(c < 0).sum() / c.size:.1%}")
print("1-mavzu eng manfiy:", [nt2[j] for j in c[1].argsort()[:5]])
# MIN: -0.188   MAX: 0.6379
# Manfiy ulush: 47.4%
# 1-mavzu eng manfiy: ['ms', 'polic', 'song', 'album', 'citi']
#
# 🎯 1-mavzu = SIYOSAT. Eng manfiy so'zlari: song, album, polic
#    Model deyapti: "song bo'lsa — bu siyosiy maqola EMAS".

# 28
print("Singular:", lsa2.singular_values_.round(3))
print("Variance:", lsa2.explained_variance_ratio_.round(4))
# Singular: [3.252 1.879 1.649 1.476 1.407]     ← 0 ENG KATTA
# Variance: [0.0074 0.0386 0.0302 0.0241 0.0219] ← 0 ENG KICHIK
#
# 🔑 0-komponent eng KUCHLI yo'nalish, lekin u O'RTACHA yo'nalish —
#    hamma hujjatda bor narsa AJRATMAYDI.
#    Amaliyotda 0-mavzuni E'TIBORSIZ qoldiring.
```

</details>

### 🔴 Qiyin

**29.** ⭐ LSA bilan semantik qidiruv qiling.

**30.** Eng o'xshash ikki maqolani toping.

**31.** LSA deterministikmi?

**32.** LSA va LDA'ni yonma-yon jadval qiling.

<details>
<summary>✅ Yechimlar 29–32</summary>

```python
D = lsa2.transform(Xt2)          # 100 × 5 — atigi 5 o'lchov!

# 29
def semantik_qidir(sorov, n=2):
    q = tv2.transform([" ".join(tozala(sorov))])
    b = cosine_similarity(lsa2.transform(q), D)[0]
    return [(int(i), round(float(b[i]), 4)) for i in b.argsort()[::-1][:n]]

for s in ["election campaign", "car company", "police violence"]:
    print(f"'{s}':")
    for i, b in semantik_qidir(s):
        print(f"   {b}  {data['title'][i][:56]}")
# 'election campaign':
#    0.9902  Why Donald Trump, Not Paul Ryan, Is Setting the G.O.P.
#    0.9808  It's Donald Trump's Party Now
# 'car company':
#    0.9598  Tesla Model S Suspension Failures Under Scrutiny
#    0.9161  Tesla Hits a New Milestone, Passing G.M. in Valuation
# 'police violence':
#    0.9685  National Guard Deployed in Milwaukee Amid Unrest
#    0.9522  At Least 27 Shot, 7 Fatally, in Chicago
#
# 🎉 OLTITASI HAM MUKAMMAL!
# 🔑 "car company" so'rovi "Tesla" maqolasini topdi — garchi
#    unda "car" so'zi BO'LMASA HAM. Bu — SEMANTIK qidiruv!

# 30
S = cosine_similarity(D); np.fill_diagonal(S, 0)
i, j = np.unravel_index(S.argmax(), S.shape)
print(f"{S[i,j]:.4f}")
print(f"  [{i}] {data['title'][i][:58]}")
print(f"  [{j}] {data['title'][j][:58]}")
# 0.9985
#   [28] Prince's Old Band Resurrects Him Through His Songs
#   [75] John Mayer Knows He Messed Up. He Wants Another Chance.
#
# 🎯 IKKALASI HAM MUSIQA! Umumiy so'z KAM, lekin MAVZU bir xil.

# 31
a = TruncatedSVD(n_components=5, random_state=0).fit(Xt2)
b = TruncatedSVD(n_components=5, random_state=99).fit(Xt2)
print("Aynan bir xilmi?", np.allclose(np.abs(a.components_),
                                      np.abs(b.components_)))
for i in range(5):
    wa = [nt2[j] for j in a.components_[i].argsort()[::-1][:6]]
    wb = [nt2[j] for j in b.components_[i].argsort()[::-1][:6]]
    print(f"  M{i}: {'BIR XIL' if wa == wb else 'FARQ'}")
# Aynan bir xilmi? False
#   M0: BIR XIL
#   M1: BIR XIL
#   M2: FARQ
#   M3: BIR XIL
#   M4: FARQ
#
# 💡 "Amalda barqaror, lekin bit-darajada emas."
#    sklearn "randomized SVD" ishlatadi — tez, lekin taxminiy.
#    To'liq aniqlik kerakmi?  algorithm='arpack'

# 32
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn); nm2 = cv2.get_feature_names_out()
lda2 = LatentDirichletAllocation(n_components=5, random_state=42,
                                 max_iter=20).fit(X2)
for i in range(3):
    print(f"M{i} LDA:", [nm2[j] for j in lda2.components_[i].argsort()[::-1][:5]])
    print(f"   LSA:", [nt2[j] for j in lsa2.components_[i].argsort()[::-1][:5]])
# M0 LDA: ['ms', 'show', 'play', 'song', 'book']
#    LSA: ['trump', 'ms', 'govern', 'unit', 'show']
# M1 LDA: ['ms', 'citi', 'rate', 'compani', 'account']
#    LSA: ['trump', 'republican', 'ryan', 'speech', 'clinton']
# M2 LDA: ['trump', 'polit', 'republican', 'parti', 'obama']
#    LSA: ['song', 'album', 'play', 'band', 'music']
#
# 🔑 Mavzu RAQAMI hech narsa anglatmaydi — tartib boshqa.
#    Lekin IKKALASI ham bir xil MAVZULARNI topdi:
#    madaniyat/musiqa · biznes · siyosat.
```

</details>

---

# D · Koherentlik *(33–42)*

### 🟡 O'rta

**33.** UMass koherentlik funksiyasini yozing.

**34.** Tozalashsiz koherentlik sweep qiling.

**35.** Tozalangan koherentlik sweep qiling.

<details>
<summary>✅ Yechimlar 33–35</summary>

```python
# 33
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

# 34 — TOZALASHSIZ
cv = CountVectorizer(); X = cv.fit_transform(matn)
nm = cv.get_feature_names_out()
for k in range(2, 12):
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=10).fit(X)
    c = np.mean([umass([nm[j] for j in t.argsort()[::-1][:10]])
                 for t in l.components_])
    print(f"k={k:2d}  {c:8.4f}")
# k= 2   -0.4014     ⭐ "eng yaxshi"
# k= 3   -0.5901
# k= 5   -0.6873
# k= 8   -0.8386
# k=11   -0.9133
#
# ⚠️ k=2 "eng yaxshi" — LEKIN u FOYDASIZ mavzular berdi!

# 35 — TOZALANGAN ⭐
ballar = []
for k in range(2, 12):
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=20).fit(X2)
    c = np.mean([umass([nm2[j] for j in t.argsort()[::-1][:10]])
                 for t in l.components_])
    ballar.append(c); print(f"k={k:2d}  {c:8.4f}")
print("Eng yaxshi k:", 2 + int(np.argmax(ballar)))
# k= 2   -0.9414
# k= 3   -1.0417
# k= 4   -0.8804     ⭐ ENG YUQORI
# k= 5   -1.0195
# k=11   -1.1401
# Eng yaxshi k: 4
#
# 🎯 TOZALASH JAVOBNI O'ZGARTIRDI!  k=2 → k=4
```

</details>

### 🔴 Qiyin

**36.** Grafik chizing.

**37.** Har `k` uchun mavzularga nom bera olasizmi?

**38.** LSA uchun koherentlik hisoblang.

**39.** Nima uchun k=2 matematik yaxshi, amaliy yomon?

**40.** Yakuniy `k` ni tanlang va asoslang.

**41.** Sarlavhalar ustida mavzu modeli qiling.

**42.** Mavzular bo'yicha hujjat taqsimotini vizuallashtiring.

<details>
<summary>✅ Yechimlar 36–42</summary>

```python
import matplotlib.pyplot as plt

# 36
plt.figure(figsize=(8, 4))
plt.plot(range(2, 12), ballar, marker='o')
plt.xlabel("Mavzular soni (k)"); plt.ylabel("Koherentlik (UMass)")
plt.title("Optimal k ni tanlash"); plt.grid(alpha=0.3)
plt.savefig("coherence.png", dpi=100, bbox_inches='tight')
print("coherence.png saqlandi")

# 37 — ⭐ ENG MUHIM MASHQ
for k in [3, 4, 5, 8]:
    print(f"\n{'='*46}\nk = {k}\n{'='*46}")
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=20).fit(X2)
    for i, t in enumerate(l.components_):
        print(f"  M{i}: {[nm2[j] for j in t.argsort()[::-1][:6]]}")
        print(f"       Nom: ______________")
#
# 💡 Har mavzuga 2-3 so'zda NOM berishga harakat qiling.
#    Bera olmasangiz — o'sha k YARAMAYDI.

# 38
lsa_ballar = []
for k in range(2, 12):
    s = TruncatedSVD(n_components=k, random_state=42).fit(Xt2)
    c = np.mean([umass([nt2[j] for j in t.argsort()[::-1][:10]])
                 for t in s.components_])
    lsa_ballar.append(c); print(f"k={k:2d}  {c:8.4f}")

# 39
print("""
"mr" va "said" DEYARLI HAR BIR hujjatda BIRGA uchraydi.
    → UMass: D(mr,said) ≈ D(said) → log(≈1) ≈ 0
    → KOHERENTLIK JUDA YUQORI  ✅ (matematik)
    → FOYDA NOL                ❌ (amaliy)

🔑 Koherentlik "birga uchraydimi?" ga javob beradi,
   "FOYDALIMI?" ga EMAS.
""")

# 40
print("""
QARORLAR JADVALI (tozalangan ma'lumot)

  k=2   koherentlik -0.94  nom berish ⚠️   → nomzod
  k=3   koherentlik -1.04  nom berish ✅   → nomzod
  k=4   koherentlik -0.88  nom berish ✅   → ENG YAXSHI ball
  k=5   koherentlik -1.02  nom berish ✅✅  → TANLANDI ⭐
  k=8   koherentlik -1.03  nom berish ⚠️   → rad etildi

TANLOV: k = 5
SABAB:  · Har bir mavzuga ANIQ nom bera oldik
          (madaniyat · biznes · siyosat · jinoyat · hukumat)
        · Koherentlik k=4 dan atigi 0.14 past
        · 5 ta mavzu — taqdimot uchun QULAY son
""")

# 41 — SARLAVHALAR ustida
sarl = [" ".join(tozala(t)) for t in data["title"]]
cvs = CountVectorizer(min_df=2)
Xs = cvs.fit_transform(sarl); nms = cvs.get_feature_names_out()
print("Sarlavhalar matritsasi:", Xs.shape)
ls = LatentDirichletAllocation(n_components=4, random_state=42,
                               max_iter=20).fit(Xs)
for i, t in enumerate(ls.components_):
    print(f"M{i}:", [nms[j] for j in t.argsort()[::-1][:6]])
#
# ⚠️ Sarlavhalar QISQA (5-10 so'z) — naqsh yetarli emas.
#    Natija KONTENTNIKIDAN YOMONROQ bo'ladi.
# 🔑 Bu — 2-darsdagi "hujjatlar juda qisqa" chekloviI.

# 42
T = lda2.transform(X2)
dom = pd.Series(T.argmax(axis=1)).value_counts().sort_index()
nomlar = ["🎭 madaniyat", "💰 biznes", "🏛️ siyosat",
          "🚔 jinoyat", "🌍 hukumat"]
for i, n in enumerate(dom):
    print(f"{nomlar[i]:14s} {n:2d}  {'█' * n}")
# 🎭 madaniyat   28  ████████████████████████████
# 💰 biznes      13  █████████████
# 🏛️ siyosat     24  ████████████████████████
# 🚔 jinoyat     15  ███████████████
# 🌍 hukumat     20  ████████████████
```

</details>

---

## 🏆 Yakuniy tekshiruv

Sizga **10 000 ta mijoz sharhi** berildi. Mavzularni topish uchun **to'liq rejani** yozing.

<details>
<summary>✅ Namuna reja</summary>

```
1 · TOZALASH
    · kichik harf, tinish belgilar
    · to'xtatish so'zlari
    · STEMMING (ko'p matn → tezlik muhim)

2 · VEKTORLASHTIRISH
    · CountVectorizer(max_df=0.5, min_df=5)   ← LDA uchun
    · TfidfVectorizer(max_df=0.5, min_df=5)   ← LSA uchun
    ⚠️ Bu qadamni O'TKAZIB YUBORMANG!

3 · TOP SO'ZLARNI TEKSHIRING
    Counter(...).most_common(20)
    → sohaga xos to'xtatish so'zlarini QO'LDA qo'shing
      ("product", "item", "order" — agar hammasida bo'lsa)

4 · KOHERENTLIK SWEEP
    k = 2..15
    → TOP 3 nomzodni oling

5 · QO'LDA TEKSHIRUV  ⭐ ENG MUHIM
    Har nomzod uchun:
      · top so'zlarni o'qing
      · eng ishonchli 3 hujjatni o'qing
      · "2-3 so'zda NOM bera olamanmi?"

6 · IKKALA ALGORITMNI ishga tushiring
    LDA va LSA bir xil naqsh topsa → ISHONCHLI

7 · SENTIMENT bilan birlashtiring  (23-modul)
    Har mavzu bo'yicha kayfiyat:
      "yetkazib berish — 89% salbiy" → SHOSHILINCH!

8 · TASNIFLAGICHGA o'ting  (26-modul)
    Endi yorliqlar BOR → yangi sharhlar avtomatik teglanadi
```

> ## 💡 **E'tibor bering:** 5-qadam **eng muhim** va u **avtomatlashtirilmaydi**. Mavzu modeli — **odam bilan birga** ishlaydigan vosita.

</details>

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
