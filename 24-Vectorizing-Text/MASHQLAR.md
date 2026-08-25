# 📝 24-modul — Barcha mashqlar

> **40 ta mashq** — matnni vektorlashtirish bo'yicha.
> Har birining yechimi **ishga tushirilgan va tekshirilgan**.

## ⚙️ Tayyorgarlik

```bash
pip install scikit-learn pandas numpy
```

```python
import pandas as pd, numpy as np, re
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

data = [' Most shark attacks occur about 10 feet from the beach since that is where the people are',
        'the efficiency with which he paired the socks in the drawer was quite admirable',
        'carol drank the blood as if she were a vampire',
        'giving directions that the mountains are to the west only works when you can see them',
        'the sign said there was road work ahead so he decided to speed up',
        'the gruff old man sat in the back of the bait shop grumbling to himself as he scooped out a handful of worms']
```

---

# A · Tushunchalar *(1–8)*

### 🟢 Oson

**1.** Nima uchun matnni vektorlashtirish kerak?

**2.** Vektor nima?

**3.** Bag of Words nimani yo'qotadi?

**4.** TF-IDF nimani qo'shimcha hisobga oladi?

<details>
<summary>✅ Javoblar 1–4</summary>

**1.** Mashinali o'qitish modellari — **matematik funksiyalar**. Ular faqat **raqamlar** bilan ishlaydi.

**2.** **Raqamlar ro'yxati**. Har bir hujjat bitta vektorga aylanadi.

**3.** ## **SO'Z TARTIBINI.** `"yaxshi emas"` va `"emas yaxshi"` — **aynan bir xil** xalta.

**4.** So'z **boshqa hujjatlarda** qanchalik uchrashini *(IDF qismi)*.

</details>

### 🟡 O'rta

**5.** Quyidagi juftlik BOW da bir xilmi?

```
A: "the dog bit the man"
B: "the man bit the dog"
```

**6.** Qanday so'z eng yuqori TF-IDF ball oladi?

**7.** Siyraklik nima va nima uchun muammo?

**8.** `fit` va `transform` farqi nimada?

<details>
<summary>✅ Javoblar 5–8</summary>

**5.** ## **HA, AYNAN BIR XIL:** `{the:2, dog:1, bit:1, man:1}`. Lekin ma'no **butunlay teskari**!

**6.** **Bu hujjatda ko'p**, lekin **boshqa hujjatlarda kam** uchraydigan so'z.

**7.** **Nollar ulushi.** 6 ta jumlada — **80%**. 10 000 ta hujjatda — **99.9%**. Muammo: **xotira** va **tezlik**. Yechim: **siyrak matritsa** *(sparse matrix)*.

**8.**
```
fit()        →  LUG'ATNI o'rganadi
transform()  →  o'rganilgan lug'at asosida raqamga aylantiradi

⚠️ X_train = vec.fit_transform(train)   ✅
   X_test  = vec.transform(test)        ✅ faqat transform!
```

</details>

---

# B · CountVectorizer *(9–20)*

### 🟢 Oson

**9.** BOW yarating va shaklini chiqaring.

**10.** Lug'atdagi birinchi 10 ta so'zni ko'rsating.

**11.** Maksimal qiymatni toping.

**12.** Har bir hujjatdagi so'zlar sonini hisoblang.

<details>
<summary>✅ Yechimlar 9–12</summary>

```python
cv = CountVectorizer()
f = cv.fit_transform(data)
bow = pd.DataFrame(f.toarray(), columns=cv.get_feature_names_out())

# 9
print(bow.shape)                                  # (6, 71)

# 10
print(list(bow.columns[:10]))
# ['10', 'about', 'admirable', 'ahead', 'are', 'as', 'attacks', 'back', 'bait', 'beach']

# 11
print(bow.values.max())                           # 3
# ⚠️ 1 EMAS! CountVectorizer SANAYDI.

# 12
print(bow.sum(axis=1).tolist())                   # [17, 14, 9, 16, 14, 22]
```

</details>

### 🟡 O'rta

**13.** `binary=True` bilan solishtiring.

**14.** `stop_words='english'` ta'sirini o'lchang.

**15.** `min_df=2` nima qiladi?

**16.** `max_features` ni sinang.

<details>
<summary>✅ Yechimlar 13–16</summary>

```python
# 13
cvb = CountVectorizer(binary=True)
b = pd.DataFrame(cvb.fit_transform(data).toarray(),
                 columns=cvb.get_feature_names_out())
print("Oddiy :", bow["the"].tolist())      # [2, 3, 1, 2, 1, 3]
print("Binary:", b["the"].tolist())        # [1, 1, 1, 1, 1, 1]
print("MAX   :", bow.values.max(), "→", b.values.max())   # 3 → 1

# 14
cv2 = CountVectorizer(stop_words='english')
b2 = pd.DataFrame(cv2.fit_transform(data).toarray(),
                  columns=cv2.get_feature_names_out())
print(f"{bow.shape[1]} → {b2.shape[1]} ustun  (-{bow.shape[1]-b2.shape[1]})")
# 71 → 39 ustun  (-32)
print("MAX qiymat:", b2.values.max())      # 1
# 🔑 MAX 3 dan 1 ga tushdi — takrorlanadigan so'zlar
#    HAMMASI to'xtatish so'zi ekan!

# 15
cv3 = CountVectorizer(min_df=2)
b3 = pd.DataFrame(cv3.fit_transform(data).toarray(),
                  columns=cv3.get_feature_names_out())
print(f"min_df=2 → {b3.shape[1]} ustun:", list(b3.columns))
# min_df=2 → 8 ustun: ['are', 'as', 'he', 'in', 'that', 'the', 'to', 'was']
# ⚠️ HAMMASI to'xtatish so'zi! Bizning 6 ta jumla hech qanday
#    MA'NOLI so'zni baham ko'rmaydi.

# 16
for m in [10, 20, 50, None]:
    n = CountVectorizer(max_features=m).fit_transform(data).shape[1]
    print(f"max_features={str(m):5s} → {n} ustun")
# max_features=10    → 10 ustun
# max_features=20    → 20 ustun
# max_features=50    → 50 ustun
# max_features=None  → 71 ustun
```

</details>

### 🔴 Qiyin

**17.** `ngram_range` ni sinang.

**18.** Siyraklikni hisoblang.

**19.** `vocabulary_` nima?

**20.** BOW bilan qidiruv qiling.

<details>
<summary>✅ Yechimlar 17–20</summary>

```python
# 17
for ng in [(1,1), (1,2), (1,3), (2,2)]:
    n = CountVectorizer(ngram_range=ng).fit_transform(data).shape[1]
    print(f"{ng} → {n:4d} ustun")
# (1, 1) →   71 ustun
# (1, 2) →  156 ustun
# (1, 3) →  236 ustun
# (2, 2) →   85 ustun
#
# ⚠️ (1,3) da ustunlar 3.3 BARAVAR ko'paydi — "o'lchov la'nati".

cv4 = CountVectorizer(ngram_range=(1,2))
b4 = pd.DataFrame(cv4.fit_transform(data).toarray(),
                  columns=cv4.get_feature_names_out())
print([c for c in b4.columns if " " in c][:5])
# ['10 feet', 'about 10', 'ahead so', 'are to', 'as he']

# 18
nol = (bow == 0).sum().sum()
print(f"{nol}/{bow.size} = {nol/bow.size:.1%} nol")
# 341/426 = 80.0% nol

# 19
print(type(cv.vocabulary_))                  # <class 'dict'>
print(cv.vocabulary_["shark"])               # 45
print(bow.columns[45])                       # shark
# 🔑 vocabulary_ = {so'z: ustun_indeksi}

# 20
def qidir(s):
    v = cv.transform([s])                    # ⭐ FAQAT transform!
    ballar = cosine_similarity(v, f)[0]
    i = ballar.argmax()
    return i, round(ballar[i], 4)

for s in ["shark beach", "old man worms", "vampire blood"]:
    i, b = qidir(s)
    print(f"'{s}' → [{i}] ball={b}")
# 'shark beach'   → [0] ball=0.3244
# 'old man worms' → [5] ball=0.3162
# 'vampire blood' → [2] ball=0.4714
```

</details>

---

# C · TfidfVectorizer *(21–32)*

### 🟢 Oson

**21.** TF-IDF yarating va shaklini chiqaring.

**22.** Qiymatlar oralig'ini toping.

**23.** `the` ustunini chiqaring.

<details>
<summary>✅ Yechimlar 21–23</summary>

```python
tv = TfidfVectorizer()
tf = tv.fit_transform(data)
tfidf = pd.DataFrame(tf.toarray(), columns=tv.get_feature_names_out())

# 21
print(tfidf.shape)                           # (6, 71)
# 🔑 BOW bilan AYNAN BIR XIL shakl!

# 22
print(round(tfidf.values.min(), 4), "–", round(tfidf.values.max(), 4))
# 0.0 – 0.4356

# 23
print(tfidf["the"].round(4).tolist())
# [0.2282, 0.391, 0.1582, 0.2406, 0.1291, 0.2901]
# Taqqoslang BOW bilan: [2, 3, 1, 2, 1, 3]
```

</details>

### 🟡 O'rta

**24.** `idf_` qiymatlarini chiqaring.

**25.** IDF formulasini **qo'lda** tekshiring.

**26.** Har qatorning normasini hisoblang.

**27.** Har bir hujjatning eng muhim so'zini toping.

<details>
<summary>✅ Yechimlar 24–27</summary>

```python
# 24
idf = pd.Series(tv.idf_, index=tv.get_feature_names_out()).sort_values()
print("Eng PAST:"); print(idf.head(4).round(4).to_string())
# the    1.0000
# he     1.5596
# to     1.5596
# as     1.8473
print("Eng YUQORI:"); print(idf.tail(3).round(4).to_string())
# works    2.2528
# worms    2.2528
# you      2.2528

# 25 — ⭐ FORMULANI TEKSHIRAMIZ
N = len(data)
names = list(tv.get_feature_names_out())
for so in ["the", "he", "shark"]:
    df = sum(1 for d in data if so in d.lower().split())
    qolda = np.log((1 + N) / (1 + df)) + 1
    haqiqiy = tv.idf_[names.index(so)]
    ok = "✅" if abs(qolda - haqiqiy) < 1e-9 else "❌"
    print(f"{so:8s} df={df}  qo'lda={qolda:.4f}  sklearn={haqiqiy:.4f}  {ok}")
# the      df=6  qo'lda=1.0000  sklearn=1.0000  ✅
# he       df=3  qo'lda=1.5596  sklearn=1.5596  ✅
# shark    df=1  qo'lda=2.2528  sklearn=2.2528  ✅
#
# 🎉 FORMULA ISHLAYDI! IDF = ln((1+N)/(1+df)) + 1

# 26
print(np.round(np.sqrt((tfidf.values ** 2).sum(axis=1)), 4))
# [1. 1. 1. 1. 1. 1.]
# 🔑 Har bir qator L2-normallashtirilgan — uzunligi aynan 1.0

# 27
for i in range(6):
    print(f"[{i}] '{tfidf.iloc[i].idxmax()}' ({tfidf.iloc[i].max():.4f})")
# [0] '10' (0.2571)
# [1] 'the' (0.3910)      ⚠️
# [2] 'blood' (0.3565)    ✅
# [3] 'can' (0.2710)
# [4] 'ahead' (0.2908)    ✅
# [5] 'of' (0.4356)       ⚠️
#
# ⚠️ 1 va 5-hujjatda G'OLIB — "the" va "of"!
# 🔑 TF-IDF SEHRLI TAYOQCHA EMAS. U to'xtatish so'zlarini
#    kamaytiradi, lekin BUTUNLAY yo'q qilmaydi.
```

</details>

### 🔴 Qiyin

**28.** `stop_words='english'` bilan 27-mashqni qayta bajaring.

**29.** BOW va TF-IDF kosinus o'xshashligini solishtiring.

**30.** TF-IDF'ni **noldan** yozing.

**31.** Yangi hujjatni aylantiring — OOV muammosi.

**32.** TF-IDF bilan qidiruv qiling.

<details>
<summary>✅ Yechimlar 28–32</summary>

```python
# 28
tv2 = TfidfVectorizer(stop_words='english')
t2 = pd.DataFrame(tv2.fit_transform(data).toarray(),
                  columns=tv2.get_feature_names_out())
for i in range(6):
    print(f"[{i}] '{t2.iloc[i].idxmax()}'")
# Endi HAR BIRIDA ma'noli so'z. "the"/"of" umuman yo'q.
#
# 💡 ENG YAXSHI AMALIYOT: TfidfVectorizer(stop_words='english')

# 29 — ⭐ ENG QIZIQARLI MASHQ
print("BOW:")
print(pd.DataFrame(cosine_similarity(bow)).round(2).to_string())
print("TF-IDF:")
print(pd.DataFrame(cosine_similarity(tfidf)).round(2).to_string())
#
# BOW:                      TF-IDF:
#      0     1     2            0     1     2
# 0 1.00  0.31  0.15       0  1.00  0.09  0.04
# 1 0.31  1.00  0.22       1  0.09  1.00  0.06
# 2 0.15  0.22  1.00       2  0.04  0.06  1.00
#
# 🎯 BOW da 1↔5 = 0.45   →   TF-IDF da atigi 0.19
#
# 🔑 BOW SOXTA o'xshashlik ko'rsatgan edi — u faqat
#    "the", "as", "in", "he" dan kelib chiqqan!
#    TF-IDF bu vaznni kamaytirdi va HAQIQIY manzara ochildi.

# 30 — QO'LDA TF-IDF
from collections import Counter

def qolda_tfidf(hujjatlar):
    tokenlar = [h.lower().split() for h in hujjatlar]
    lugat = sorted({w for t in tokenlar for w in t})
    N = len(hujjatlar)
    natija = []
    for t in tokenlar:
        sanoq = Counter(t)
        qator = []
        for so in lugat:
            tf_q = sanoq[so] / len(t)
            df = sum(1 for x in tokenlar if so in x)
            idf = np.log((1 + N) / (1 + df)) + 1
            qator.append(tf_q * idf)
        norma = np.sqrt(sum(x**2 for x in qator))
        natija.append([x / norma if norma else 0 for x in qator])
    return pd.DataFrame(natija, columns=lugat)

m = qolda_tfidf(data)
print("Mening :", m["the"].round(4).tolist())
print("sklearn:", tfidf["the"].round(4).tolist())
# Mening : [0.2282, 0.391, 0.1519, 0.2406, 0.1291, 0.2856]
# sklearn: [0.2282, 0.391, 0.1582, 0.2406, 0.1291, 0.2901]
#             ✅      ✅      ⚠️      ✅      ✅      ⚠️
#
# 🎉 6 tadan 4 tasi AYNAN MOS!
# ⚠️ Farq sababi: sklearn 1 HARFLI so'zlarni ("a", "i")
#    lug'atga KIRITMAYDI. 2 va 5-hujjatda "a" bor.

# 31 — OOV MUAMMOSI ⭐
yangi = "a shark attacked a swimmer near the beach"
yv = pd.DataFrame(tv.transform([yangi]).toarray(),
                  columns=tv.get_feature_names_out())
print(yv.loc[0][yv.loc[0] > 0].sort_values(ascending=False).round(4).to_string())
# beach    0.6747
# shark    0.6747
# the      0.2995
#
# ⚠️ 8 ta so'zdan FAQAT 3 tasi tanildi!
#    "attacked", "swimmer", "near", "a" — HAMMASI YO'Q.
#
# 🔑 OOV (out-of-vocabulary): transform() faqat FIT paytida
#    ko'rilgan so'zlarni biladi. Yangilari E'TIBORSIZ qoladi.
#    Bu — BOW va TF-IDF ning JIDDIY chekloviI.

# 32
tv3 = TfidfVectorizer(stop_words='english')
M = tv3.fit_transform(data)
def qidir_tfidf(s, n=1):
    v = tv3.transform([s])
    b = cosine_similarity(v, M)[0]
    i = b.argmax()
    return int(i), round(float(b[i]), 4)

for s in ["shark attack beach", "vampire blood", "socks drawer"]:
    i, b = qidir_tfidf(s)
    print(f"'{s}' → [{i}] ball={b}")
# 'shark attack beach' → [0] ball=0.5345
# 'vampire blood'      → [2] ball=0.7071
# 'socks drawer'       → [1] ball=0.5774
#
# 💡 TF-IDF ballari BOW dan YUQORI (0.53 vs 0.32) —
#    chunki to'xtatish so'zlari shovqin qilmayapti.
```

</details>

---

# D · Amaliy tahlil *(33–40)*

📁 [`data/book_reviews_sample.csv`](data/book_reviews_sample.csv) — 100 ta kitob sharhi.

### 🟡 O'rta

**33.** Sharhlarni yuklang va vektorlashtiring.

**34.** Siyraklikni hisoblang.

**35.** Eng ko'p uchraydigan so'zlarni toping.

<details>
<summary>✅ Yechimlar 33–35</summary>

```python
d = pd.read_csv("data/book_reviews_sample.csv")
d["clean"] = d["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())

# 33
tvb = TfidfVectorizer(stop_words='english')
X = tvb.fit_transform(d["clean"])
print(X.shape)                                    # (100, 377)

# 34
print(f"{1 - X.nnz/(X.shape[0]*X.shape[1]):.1%} nol")    # 98.1% nol
print("Nolmas qiymatlar:", X.nnz)                        # 720
# 🔑 100 × 377 = 37 700 katak, lekin FAQAT 720 tasi nolmas!

# 35
cvb = CountVectorizer(stop_words='english')
B = cvb.fit_transform(d["clean"])
s = pd.Series(np.asarray(B.sum(axis=0)).ravel(),
              index=cvb.get_feature_names_out()).sort_values(ascending=False)
print(s.head(8).to_string())
# book      49
# read      37
# good      27
# like      15
# did       15
# story     14
# great     12
# series    11
```

> 💡 `book` va `read` — **mavzu** so'zlari, hamma sharhda bor. `good`, `great` — **ijobiy**. `did` — **inkorning** bir qismi *("did not")*. Bu ro'yxatda **hikoya** allaqachon ko'rinib turibdi.

</details>

### 🔴 Qiyin

**36.** Ijobiy va salbiy sharhlarga xos so'zlarni toping.

**37.** Eng o'xshash ikki sharhni toping.

**38.** Turli parametrlar bilan ustunlar sonini solishtiring.

**39.** Sharh uzunligi va nolmas qiymatlar sonini bog'lang.

**40.** BOW va TF-IDF bilan **bir xil** sharhni toping — natija farq qiladimi?

<details>
<summary>✅ Yechimlar 36–40</summary>

```python
tv4 = TfidfVectorizer(stop_words='english', max_features=500)
X = tv4.fit_transform(d["clean"])

# 36 — ⭐ ENG QIZIQARLI
past = d[d["rating"] <= 2].index
yuqori = d[d["rating"] >= 4].index
A = np.asarray(X[past].mean(axis=0)).ravel()
Bm = np.asarray(X[yuqori].mean(axis=0)).ravel()
farq = pd.Series(Bm - A, index=tv4.get_feature_names_out()).sort_values()

print("😞 SALBIY:", list(farq.head(6).index))
print("😀 IJOBIY:", list(farq.tail(6).index[::-1]))
# 😞 SALBIY: ['did', 'like', 'worth', 'short', 'really', 'money']
# 😀 IJOBIY: ['love', 'loved', 'great', 'series', 'enjoyed', 'books']
#
# 🎯 AJRATISH MUKAMMAL!
#    "did"   = "did not like" / "did not finish"
#    "worth" = "not worth the money"
#    "series"/"books" = DAVOMINI O'QIMOQCHI!  ⭐
#
# ⚠️ "like" SALBIY tomonda — chunki u "did not like" ning
#    bir qismi. BAG OF WORDS SO'Z TARTIBINI KO'RMAYDI.

# 37
S = cosine_similarity(X)
np.fill_diagonal(S, 0)
i, j = np.unravel_index(S.argmax(), S.shape)
print(f"[{i}] ↔ [{j}]  ball={S[i,j]:.4f}")
print(f"  {d['reviewText'][i][:65]}")
print(f"  {d['reviewText'][j][:65]}")
# [11] ↔ [32]  ball=0.6352
#   I did not cared for this ebook. I did not finish this ebook.
#   I did not care for this ebook. I did not finish reading this
#
# 🎯 DEYARLI BIR XIL SHARH! Bu — soxta sharh detektorining asosi.

# 38
for kw, nom in [({}, "hech narsa"),
                ({"stop_words":"english"}, "stop_words"),
                ({"stop_words":"english","min_df":2}, "+ min_df=2"),
                ({"stop_words":"english","ngram_range":(1,2)}, "+ bigram")]:
    x = TfidfVectorizer(**kw).fit_transform(d["clean"])
    print(f"{nom:14s} {x.shape[1]:5d} ustun  {1-x.nnz/(x.shape[0]*x.shape[1]):6.1%} nol")
# hech narsa       504 ustun   97.1% nol
# stop_words       377 ustun   98.1% nol
# + min_df=2        97 ustun   95.5% nol      ⭐ 74% o'chdi!
# + bigram         983 ustun   98.6% nol
#
# 💡 min_df=2 eng kuchli filtr — 377 tadan 280 tasi FAQAT
#    BITTA sharhda uchraydi va model uchun deyarli foydasiz.

# 39
d["uz"] = d["clean"].str.split().str.len()
d["nolmas"] = [X[i].nnz for i in range(X.shape[0])]
print("Korrelyatsiya:", round(d["uz"].corr(d["nolmas"]), 4))
# Korrelyatsiya: 0.5829
#
# 💡 Musbat, lekin MUKAMMAL emas (1.0 emas). Nima uchun?
#    Uzun sharhda so'zlar TAKRORLANADI — yangi ustun qo'shilmaydi.
#    Va max_features=500 chegara qo'ygan: lug'atdan tashqari
#    so'zlar umuman sanalmaydi.

# 40
cvx = CountVectorizer(stop_words='english', max_features=500)
XB = cvx.fit_transform(d["clean"])
SB = cosine_similarity(XB); np.fill_diagonal(SB, 0)
iB, jB = np.unravel_index(SB.argmax(), SB.shape)
print(f"BOW    eng o'xshash: [{iB}] ↔ [{jB}]  {SB[iB,jB]:.4f}")
print(f"TF-IDF eng o'xshash: [{i}] ↔ [{j}]  {S[i,j]:.4f}")
# BOW    eng o'xshash: [11] ↔ [32]  0.7252
# TF-IDF eng o'xshash: [11] ↔ [32]  0.6352
#
# ✅ IKKALASI HAM BIR XIL JUFTLIKNI topdi — natija ISHONCHLI!
#
# 💡 Lekin BALL boshqacha: BOW 0.73, TF-IDF 0.64.
#    BOW yuqoriroq ko'rsatdi, chunki u "did", "not", "this"
#    kabi so'zlarni ham to'liq hisobga oldi.
#    TF-IDF esa ularning vaznini kamaytirdi — HALOL baho.
```

</details>

---

## 🏆 Yakuniy tekshiruv

Uchta hujjat berilgan:

```
D1: "the cat sat"
D2: "the dog sat"
D3: "the cat ran fast"
```

**Qo'lda** hisoblang: `IDF("cat")` nechchi bo'ladi *(sklearn formulasi bilan)*?

<details>
<summary>✅ Javob</summary>

```
N  = 3   (jami hujjat)
df = 2   ("cat" D1 va D3 da bor)

IDF = ln((1+3)/(1+2)) + 1
    = ln(4/3) + 1
    = ln(1.3333) + 1
    = 0.2877 + 1
    = 1.2877
```

**Tekshiramiz:**

```python
d3 = ['the cat sat', 'the dog sat', 'the cat ran fast']
tv = TfidfVectorizer()
tv.fit(d3)
idf = pd.Series(tv.idf_, index=tv.get_feature_names_out())
print(idf.round(4).to_string())
```

```
cat     1.2877
dog     1.6931
fast    1.6931
ran     1.6931
sat     1.2877
the     1.0000
```

### ✅ `cat` = **1.2877** — AYNAN MOS!

```
"the"  → 3/3 hujjatda → ln(4/4)+1 = 1.0000   ← ENG PAST
"cat"  → 2/3 hujjatda → ln(4/3)+1 = 1.2877
"dog"  → 1/3 hujjatda → ln(4/2)+1 = 1.6931   ← ENG YUQORI
```

> ## 🎯 **Endi siz TF-IDF'ni QO'LDA hisoblay olasiz.** Bu — uni **qora quti** sifatida emas, **tushunib** ishlatish demakdir.

</details>

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
