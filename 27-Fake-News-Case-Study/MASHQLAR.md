# 📝 27-modul — Barcha mashqlar

> **36 ta mashq** — soxta yangiliklar keysi bo'yicha.
> Har birining yechimi **ishga tushirilgan va tekshirilgan**.

## ⚙️ Tayyorgarlik

```python
import pandas as pd, numpy as np, re, spacy
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import make_pipeline

data = pd.read_csv("data/fake_news_data.csv")
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
nlp = spacy.load("en_core_web_sm")
```

---

# A · Ma'lumotni o'rganish *(1–8)*

### 🟢 Oson

**1.** Ma'lumot shaklini va yorliqlar taqsimotini chiqaring.

**2.** Maqolalarning o'rtacha uzunligi.

**3.** Bir necha soxta va haqiqiy maqolani o'qing.

<details>
<summary>✅ Yechimlar 1–3</summary>

```python
# 1
print(data.shape)                                    # (198, 4)
print(data["fake_or_factual"].value_counts())
# Factual News    100
# Fake News        98
print("Null:", data.isna().sum().sum())              # 0

# 2
print(data.groupby("fake_or_factual")["text"]
          .apply(lambda s: int(s.str.split().str.len().mean())))

# 3
for t in ["Fake News", "Factual News"]:
    print(f"\n=== {t} ===")
    for x in data[data["fake_or_factual"] == t]["text"].head(2):
        print(" ", x[:110], "...")
```

</details>

### 🟡 O'rta

**4.** ⭐ `Reuters` muammosini toping.

**5.** ⭐ Bitta qatorlik qoida qancha aniqlik beradi?

**6.** Boshqa shipchalarni qidiring.

<details>
<summary>✅ Yechimlar 4–6</summary>

```python
# 4 — ⭐ ENG MUHIM MASHQ
for t in ["Fake News", "Factual News"]:
    s = data[data["fake_or_factual"] == t]
    n = s["text"].str.contains("Reuters").sum()
    print(f"{t}: {n}/{len(s)} = {n/len(s):.0%}")
# Fake News: 1/98 = 1%
# Factual News: 100/100 = 100%
#
# 💥 100% VA 1%!

# 5
p = np.where(data["text"].str.contains("Reuters"), "Factual News", "Fake News")
print("Faqat 'Reuters':", f"{(p == data['fake_or_factual']).mean():.1%}")
# Faqat 'Reuters': 99.5%
#
# ❌ Bitta qatorlik qoida MODELDAN YAXSHIROQ!
#    Bu — mashinali o'qitish EMAS, ma'lumot NUQSONI.

# 6 — SHIPCHA DETEKTORI
cv = CountVectorizer(min_df=5, binary=True)
B = cv.fit_transform(data["text"]); nm = cv.get_feature_names_out()
y = data["fake_or_factual"]
top = []
for j, so in enumerate(nm):
    bor = B[:, j].toarray().ravel() > 0
    if bor.sum() < 10: continue
    for s_ in y.unique():
        u = (y[bor] == s_).mean()
        if u >= 0.9:
            top.append((so, s_, int(bor.sum()), round(u, 3)))
top.sort(key=lambda x: -x[2])
print(f"{len(top)} ta shipcha topildi")
for so, s_, n, u in top[:10]:
    print(f"  {so:16s} {s_:14s} {n:5d} {u:6.1%}")
#
# 💡 Bu funksiyani HAR BIR loyihada BIRINCHI ishga tushiring!
```

</details>

### 🔴 Qiyin

**7.** Nima uchun shipcha xavfli?

**8.** Qanday tozalash kerak?

<details>
<summary>✅ Javoblar 7–8</summary>

**7.**
```
Bizning ma'lumot: haqiqiy = Reuters, soxta = boshqa manba
Model o'rganadi:  "Reuters" → haqiqiy

HAQIQIY HAYOTDA:  AP / BBC / Kun.uz dan haqiqiy yangilik
                       ↓
                  "Reuters" YO'Q → model "SOXTA" deydi ❌
```

**8.**
```python
data["text_clean"] = data.apply(
    lambda x: re.sub(r"^[^-]*-\s*", "", x["text"]), axis=1)
# ^        matn boshidan
# [^-]*    chiziqcha BO'LMAGAN belgilar
# -        chiziqcha
# \s*      bo'shliqlar
```

</details>

---

# B · POS va NER *(9–18)*

### 🟢 Oson

**9.** spaCy hujjatlarini yarating.

**10.** Token sonini solishtiring.

**11.** POS taqsimotini chiqaring.

<details>
<summary>✅ Yechimlar 9–11</summary>

```python
fake_news = data[data["fake_or_factual"] == "Fake News"]
fact_news = data[data["fake_or_factual"] == "Factual News"]

# 9
fake_docs = list(nlp.pipe(fake_news["text"]))       # ⭐ .pipe() TEZROQ
fact_docs = list(nlp.pipe(fact_news["text"]))

def build(docs):
    rows = []
    for d in docs:
        rows.extend([(t.text, t.ent_type_, t.pos_) for t in d])
    return pd.DataFrame(rows, columns=["token", "ner_tag", "pos_tag"])

fake_tags = build(fake_docs); fact_tags = build(fact_docs)

# 10
print("Soxta :", len(fake_tags))                    # 45744
print("Haqiqiy:", len(fact_tags))                   # 40393

# 11
def pc(x): return (x.groupby(["token", "pos_tag"]).size()
                    .reset_index(name="n").sort_values("n", ascending=False))
pf, pt = pc(fake_tags), pc(fact_tags)
print(pf.groupby("pos_tag")["token"].count().sort_values(ascending=False).head(6))
```

</details>

### 🟡 O'rta

**12.** ⭐ POS **nisbatlarini** hisoblang.

**13.** Otlarni solishtiring.

**14.** Faqat bitta to'plamda uchraydigan otlar.

<details>
<summary>✅ Yechimlar 12–14</summary>

```python
# 12 — ⭐ NORMALLASHTIRISH!
gf = pf.groupby("pos_tag")["token"].count()
gt = pt.groupby("pos_tag")["token"].count()
print(f"{'TEG':6s} {'SOXTA':>8s} {'HAQIQIY':>8s} {'FARQ':>8s}")
for teg in ["NOUN", "VERB", "PROPN", "ADJ", "ADV", "NUM"]:
    a, b = gf[teg]/gf["NOUN"], gt[teg]/gt["NOUN"]
    print(f"{teg:6s} {a:8.3f} {b:8.3f} {(a-b)/b*100:+7.1f}%")
# NOUN   1.000  1.000   +0.0%
# VERB   0.703  0.706   -0.5%
# PROPN  0.647  0.633   +2.2%
# ADJ    0.341  0.343   -0.5%
# ADV    0.160  0.121  +32.3%   ⭐
# NUM    0.085  0.094   -9.2%
#
# 🔑 FAQAT IKKI teg farq qiladi: ADV (+32%) va NUM (-9%)
#    ⚠️ XOM sonlarni solishtirmang — soxta to'plam KATTAROQ!

# 13
print("SOXTA :", pf[pf.pos_tag == "NOUN"].head(10)["token"].tolist())
print("HAQIQIY:", pt[pt.pos_tag == "NOUN"].head(10)["token"].tolist())
# SOXTA : people, t, president, women, time, year, campaign, government, law, years
# HAQIQIY: government, year, state, bill, administration, president, election, ...
#
# 🎯 "government": haqiqiyda 1-o'rin, soxtada 8-o'rin!
#    "people":     soxtada 1-o'rin, haqiqiyda 8-o'rin!

# 14
nf = set(pf[pf.pos_tag == "NOUN"].head(30)["token"])
nt_ = set(pt[pt.pos_tag == "NOUN"].head(30)["token"])
print("FAQAT SOXTADA :", sorted(nf - nt_))
print("FAQAT HAQIQIYDA:", sorted(nt_ - nf))
# FAQAT SOXTADA: candidate, case, day, email, employees, image, media,
#                money, news, nominee, school, t, time, video, way, women, world
# FAQAT HAQIQIYDA: Trump, ban, bill, court, days, decision, lawmakers,
#                  office, order, part, percent, policy, reporters,
#                  security, statement, tax, week
#
# 🎯 SOXTA  : image · video · media · news · email  → IJTIMOIY TARMOQ
#    HAQIQIY: bill · court · lawmakers · policy · tax → DAVLAT/HUJJAT
```

</details>

### 🔴 Qiyin

**15.** ⭐ NER top-10 ni solishtiring.

**16.** `PERSON` ulushini hisoblang.

**17.** Grafik chizing.

**18.** Nima uchun NER tozalashdan oldin?

<details>
<summary>✅ Yechimlar 15–18</summary>

```python
# 15
def ents(df):
    x = df[df["ner_tag"] != ""]
    return (x.groupby(["token", "ner_tag"]).size()
              .reset_index(name="n").sort_values("n", ascending=False))
ef, et = ents(fake_tags), ents(fact_tags)
print("SOXTA:");   print(ef.head(10).to_string(index=False))
print("HAQIQIY:"); print(et.head(10).to_string(index=False))
#
# SOXTA  : Trump PERSON 154 · Trump ORG 152 · the ORG 121 ·
#          Clinton PERSON 118 · Donald 75 · Hillary 64 · Obama 59 · McCain 53
# HAQIQIY: the ORG 159 · U.S. GPE 138 · Reuters ORG 131 ·
#          Trump PERSON 125 · Trump ORG 124 · House ORG 67 ...
#
# 🎯 PERSON:  soxtada 6/10  ·  haqiqiyda ATIGI 1/10!

# 16
for nom, e in [("SOXTA", ef), ("HAQIQIY", et)]:
    p_ = e[e["ner_tag"] == "PERSON"]["n"].sum()
    h = e["n"].sum()
    print(f"{nom}: PERSON {p_}/{h} = {p_/h:.1%}")

# 17
import seaborn as sns, matplotlib.pyplot as plt
teglar = sorted(set(ef["ner_tag"]) | set(et["ner_tag"]))
pal = dict(zip(teglar, sns.color_palette("tab20", len(teglar))))
fig, axes = plt.subplots(1, 2, figsize=(16, 6))
for ax, dfx, nom in [(axes[0], ef, "SOXTA"), (axes[1], et, "HAQIQIY")]:
    sns.barplot(x="n", y="token", hue="ner_tag", palette=pal,
                data=dfx.head(10), orient="h", dodge=False, ax=ax)
    ax.set_title(nom)
plt.tight_layout(); plt.savefig("ner.png", dpi=100, bbox_inches="tight")
#
# ⭐ IKKALA grafikda BIR XIL palitra — aks holda solishtirib bo'lmaydi!

# 18
print("""
POS teglash → GRAMMATIKAGA tayanadi
NER         → BOSH HARFLARGA va TINISH BELGILARIGA tayanadi

Tozalashdan keyin:
  "WASHINGTON (Reuters)" → "washington reuters"
  → NER buni ORGANIZATION deb tanimaydi

22-modulda o'lchagandik: ob'ektlarning 46% YO'QOLADI.
""")
```

</details>

---

# C · Tozalash va sentiment *(19–26)*

### 🟢 Oson

**19.** To'liq tozalash quvurini ishga tushiring.

**20.** Unigram va bigrammalarni chiqaring.

**21.** Sentimentni hisoblang.

<details>
<summary>✅ Yechimlar 19–21</summary>

```python
import nltk
sw = stopwords.words("english"); lem = WordNetLemmatizer()

# 19
data["text_clean"] = data.apply(
    lambda x: re.sub(r"^[^-]*-\s*", "", x["text"]), axis=1)      # ⭐ SHIPCHA!
data["text_clean"] = data["text_clean"].str.lower()
data["text_clean"] = data.apply(
    lambda x: re.sub(r"[^\w\s]", "", x["text_clean"]), axis=1)
data["text_clean"] = data["text_clean"].apply(
    lambda x: " ".join(w for w in x.split() if w not in sw))
data["text_clean"] = data["text_clean"].apply(word_tokenize)
data["text_clean"] = data["text_clean"].apply(
    lambda t: [lem.lemmatize(w) for w in t])

tokens_clean = sum(data["text_clean"], [])
print("Jami token:", len(tokens_clean))              # 38485

# 20
print(pd.Series(nltk.ngrams(tokens_clean, 1)).value_counts()[:10])
# said 560 · trump 520 · u 255 · state 250 · president 226 ...
print(pd.Series(nltk.ngrams(tokens_clean, 2)).value_counts()[:10])
# (donald,trump) 92 · (united,state) 80 · (white,house) 72 ...
# (image,via) 29  ← SOXTA yangilik FORMAT belgisi!

# 21
vader = SentimentIntensityAnalyzer()
data["vs"] = data["text"].apply(                     # ⚠️ text, text_clean EMAS!
    lambda x: vader.polarity_scores(x)["compound"])
data["vl"] = pd.cut(data["vs"], bins=[-1, -0.1, 0.1, 1],
                    labels=["negative", "neutral", "positive"])
print(data["vl"].value_counts())
# positive 98 · negative 93 · neutral 7
```

</details>

### 🟡 O'rta

**22.** ⭐ Sentiment yangilik turiga qarab farq qiladimi?

**23.** ⭐ Statistik test o'tkazing.

**24.** Tozalash `Reuters` ni qanchalik olib tashladi?

<details>
<summary>✅ Yechimlar 22–24</summary>

```python
# 22
print(pd.crosstab(data["fake_or_factual"], data["vl"]))
# Factual News   47  2  51
# Fake News      46  5  47
print((pd.crosstab(data["fake_or_factual"], data["vl"],
                   normalize="index") * 100).round(1))
# Factual News  47.0  2.0  51.0
# Fake News     46.9  5.1  48.0
#                ↑ DEYARLI AYNAN BIR XIL

print(data.groupby("fake_or_factual")["vs"].agg(["mean", "std"]).round(4))
# Factual News  0.0501  0.7941
# Fake News     0.0247  0.8440

# 23 — ⭐ T-TEST
from scipy import stats
a = data[data["fake_or_factual"] == "Fake News"]["vs"]
b = data[data["fake_or_factual"] == "Factual News"]["vs"]
t_stat, p = stats.ttest_ind(a, b)
print(f"t = {t_stat:.4f},  p = {p:.4f}")
# t = -0.2187,  p = 0.8271
#
# 💥 p = 0.83 (chegara 0.05)!
# ❌ SENTIMENT FARQ QILMAYDI — bu MATEMATIK XULOSA.
#
# 💡 "Natija yo'q" ham NATIJA. U manfaatdorlarga
#    VAQT va PUL tejaydi.

# 24
for t in ["Fake News", "Factual News"]:
    s = data[data["fake_or_factual"] == t]
    a_ = s["text"].str.contains("Reuters").sum()
    b_ = s["text_clean"].apply(lambda x: "reuters" in x).sum()
    print(f"{t}: {a_} → {b_}")
# Fake News: 1 → 1
# Factual News: 100 → 12
#
# 🎯 100 → 12 (88% kamaydi!)
# ⚠️ 12 tasi matn ICHIDA eslatilgan — to'liq tozalanmadi.
```

</details>

### 🔴 Qiyin

**25.** Nima uchun sentiment `text` da hisoblanadi?

**26.** Nima uchun stemming emas, lemmatization?

<details>
<summary>✅ Javoblar 25–26</summary>

**25.**
```
text_clean da TO'XTATISH SO'ZLARI o'chirilgan
        ↓
"not", "no", "never" YO'Q!
        ↓
"not good" → "good"   ❌ MA'NO TESKARI

23-modulning asosiy qoidasi.
```

**26.**
```
25-modul (yangiliklar): 100 × 1112 so'z = 111k  →  STEMMING (tez)
Bu modul:               198 × ~400 so'z = 38k   →  LEMMATIZATION (aniq)

Qoida: KATTA ma'lumot → stemming · KICHIK → lemmatization
```

</details>

---

# D · Mavzular va model *(27–36)*

### 🟡 O'rta

**27.** LDA bilan mavzu toping.

**28.** Qoplashni sanang.

**29.** LSA bilan qayta qiling.

<details>
<summary>✅ Yechimlar 27–29</summary>

```python
fake_text = data[data["fake_or_factual"] == "Fake News"]["text_clean"].reset_index(drop=True)
matn = [" ".join(t) for t in fake_text]

# 27
cv = CountVectorizer(); Xc = cv.fit_transform(matn); nmc = cv.get_feature_names_out()
lda = LatentDirichletAllocation(n_components=7, random_state=42, max_iter=20).fit(Xc)
for i, t in enumerate(lda.components_):
    print(f"M{i}:", [nmc[j] for j in t.argsort()[::-1][:8]])

# 28
from collections import Counter
c = Counter()
for t in lda.components_:
    c.update([nmc[j] for j in t.argsort()[::-1][:10]])
print(c.most_common(6))
# [('said', 5), ('trump', 4), ('state', 4), ('clinton', 4), ('time', 3), ('would', 3)]
#
# ❌ 7 ta mavzudan 5 tasida "said" bor — MAVZULAR AJRALMAYAPTI

# 29 — ⭐ TF-IDF + LSA
tv = TfidfVectorizer(); Xt = tv.fit_transform(matn); ntv = tv.get_feature_names_out()
lsa = TruncatedSVD(n_components=7, random_state=42).fit(Xt)
for i, t in enumerate(lsa.components_):
    print(f"M{i}:", [ntv[j] for j in t.argsort()[::-1][:8]])
# M1: boiler room acr animal jay episode analysis political   📻 PODKAST!
# M3: clinton hillary september email hillaryclinton woman    📧 POCHTA
# M6: flynn hillary bill thing wife mr campaigning            🕵️ FLYNN
#
# 🎉 ANCHA ANIQROQ! TF-IDF "trump" ga past vazn berdi.

c2 = Counter()
for t in lsa.components_:
    c2.update([ntv[j] for j in t.argsort()[::-1][:10]])
print("LSA qoplash:", c2.most_common(4))
```

</details>

### 🔴 Qiyin

**30.** Tasniflagich quring.

**31.** ⭐ Cross-validation qiling — xulosa o'zgaradimi?

**32.** ⭐ Tozalash aniqlikka qanday ta'sir qildi?

**33.** Xatolarni tahlil qiling.

**34.** Model qaysi so'zlarni o'rgandi?

**35.** TF-IDF bilan sinang.

**36.** Yakuniy hisobot yozing.

<details>
<summary>✅ Yechimlar 30–36</summary>

```python
X = data["text_clean"].apply(lambda t: " ".join(t))
y = data["fake_or_factual"]

# 30
bow = pd.DataFrame(CountVectorizer().fit_transform(X).toarray())
Xtr, Xte, ytr, yte = train_test_split(bow, y, test_size=0.3, random_state=42)
lr = LogisticRegression(random_state=0, max_iter=1000).fit(Xtr, ytr)
sv = SGDClassifier(random_state=0).fit(Xtr, ytr)
print("LR :", round(accuracy_score(lr.predict(Xte), yte), 4))    # 0.8833
print("SVM:", round(accuracy_score(sv.predict(Xte), yte), 4))    # 0.8167
print(confusion_matrix(yte, lr.predict(Xte)))
# [[29  3]
#  [ 4 24]]

# 31 — ⭐⭐ XULOSA TESKARI AYLANADI!
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(make_pipeline(CountVectorizer(), m), X, y, cv=skf)
    print(f"{nom} {s.round(3)}  o'rtacha={s.mean():.3f}")
# LR  [0.925 0.875 0.875 0.949 0.821]  o'rtacha=0.889
# SVM [0.9   0.925 0.85  0.897 0.949]  o'rtacha=0.904
#
# 💥 Bitta bo'linishda LR yaxshiroq (88.3 vs 81.7)
#    Cross-validation'da SVM yaxshiroq (90.4 vs 88.9)
#
# 🔑 HAR DOIM CV ishlating — ayniqsa modellarni SOLISHTIRGANDA.

# 32 — ⭐ SHIPCHA TA'SIRI
q = make_pipeline(CountVectorizer(),
                  LogisticRegression(random_state=0, max_iter=1000))
print("TOZALASHSIZ:", round(cross_val_score(q, data["text"], y, cv=skf).mean(), 3))
print("TOZALANGAN :", round(cross_val_score(q, X, y, cv=skf).mean(), 3))
# TOZALASHSIZ: 0.904
# TOZALANGAN : 0.889
#
# 🔑 Tozalash aniqlikni PASAYTIRDI (-1.5%) — VA BU YAXSHI!
#    Tozalashsiz model "Reuters" shipchasidan foydalanadi.
#    1.5 foizni sotib, ISHONCHLILIKNI oldik.

# 33
xato = [(i, h, p) for i, h, p in zip(Xte.index, yte, lr.predict(Xte)) if h != p]
print(f"{len(xato)} ta xato")
for i, h, p in xato[:3]:
    print(f"  haqiqiy={h} bashorat={p}: {data.loc[i, 'title'][:60]}")

# 34
cvf = CountVectorizer().fit(X)
lrf = LogisticRegression(random_state=0, max_iter=1000).fit(cvf.transform(X), y)
nmf = cvf.get_feature_names_out(); k = lrf.coef_[0]
print("Sinflar:", lrf.classes_)
print("→", lrf.classes_[1], ":", [nmf[j] for j in k.argsort()[::-1][:10]])
print("→", lrf.classes_[0], ":", [nmf[j] for j in k.argsort()[:10]])
#
# 💡 2-darsdagi topilmalar bilan SOLISHTIRING!

# 35
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(make_pipeline(TfidfVectorizer(), m), X, y, cv=skf)
    print(f"TF-IDF {nom} {s.mean():.3f}")

# 36
print("""
╔════════════════════════════════════════════════════╗
║  SOXTA YANGILIKLARNI ANIQLASH — HISOBOT            ║
╠════════════════════════════════════════════════════╣
║  MODEL ANIQLIGI:  90.4%  (SVM, cross-validation)   ║
║                                                    ║
║  ✅ ISHLAGAN BELGILAR                              ║
║     · Odamlar ismi: top-10 da 6 vs 1               ║
║     · Ravishlar +32.3% (hissiyotli til)            ║
║     · Sonlar -9.2% (kam tekshiriladigan fakt)      ║
║     · people/media  vs  government/bill/court      ║
║                                                    ║
║  ❌ ISHLAMAGAN                                     ║
║     · Sentiment — farq yo'q (p = 0.83)             ║
║                                                    ║
║  📻 TOPILGAN MANBALAR                              ║
║     · "Boiler Room" kabi takrorlanuvchi manbalar   ║
║                                                    ║
║  ⚠️ CHEKLOV                                        ║
║     Haqiqiy yangiliklar 100% Reuters'dan.          ║
║     Boshqa agentliklar bilan QAYTA SINALSIN.       ║
╚════════════════════════════════════════════════════╝
""")
```

</details>

---

## 🏆 Yakuniy tekshiruv

Sizga **yangi** ma'lumot to'plami berildi. **Birinchi 3 qadam** nima?

<details>
<summary>✅ Javob</summary>

```
1 · MA'LUMOTNI KO'Z BILAN O'QING
    Har sinfdan 5-10 ta misolni QO'LDA o'qing.
    Format farqlari bormi? Prefikslar? Belgilar?

2 · SHIPCHA DETEKTORINI ishga tushiring   ⭐
    Bitta so'z 90%+ bir sinfda bo'lsa — bu SHUBHALI.

    for so'z in lug'at:
        agar so'z bor maqolalarning 90%+ i bitta sinfdan bo'lsa:
            → SHIPCHA NOMZODI

3 · DUMMY va BITTA-QOIDA bazaviylarini o'lchang
    DummyClassifier         →  X%
    "eng shubhali so'z bor?" →  Y%

    Agar Y >> X bo'lsa — SHIPCHA BOR, TOZALANG.
```

> ## 💡 **Bu uch qadam 10 daqiqa oladi va oylab davom etadigan xatodan saqlaydi.**
>
> Bizning holatda: `Reuters` **99.5%** berardi — model **hech qachon** matnni o'rganmagan bo'lardi.

</details>

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
