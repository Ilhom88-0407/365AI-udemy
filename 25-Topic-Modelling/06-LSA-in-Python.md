# 6-dars. LSA Python'da

## 🎬 Boshlashdan oldin

> **"Biz LDA modelimizda to'xtagan joyimizdan davom etamiz. LSA modelimizni ishga tushirish uchun bizga shunchaki BU FUNKSIYANI import qilish kerak."**

---

## 1. Import

### 🅰️ gensim

```python
from gensim.models import LsiModel
```

> ## **"LSI va LSA ko'pincha O'ZARO ALMASHTIRILIB ishlatiladi. Bu shunchaki siz qaysi sohadan kelganingizga bog'liq."**

```
LSA  =  Latent Semantic Analysis      ← ilmiy adabiyot
LSI  =  Latent Semantic Indexing      ← ma'lumot izlash (information retrieval)

       AYNAN BIR XIL narsa!
```

### 🅱️ sklearn

```python
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
```

> 💡 **`sklearn`da LSA alohida sinf emas** — u shunchaki **TF-IDF + TruncatedSVD**. Bu — LSA'ning **aslida nima ekanini** yaxshiroq ko'rsatadi.

---

## 2. Modelni qurish

> **"Keyin LSI modelimizni yaratamiz — va kod LDA modeliga JUDA O'XSHASH."**

### 🅰️ gensim

```python
lsa_model = LsiModel(corpus=doc_term_matrix,
                     id2word=dictionary,
                     num_topics=num_topics)

print(lsa_model.print_topics(num_topics=2, num_words=5))
```

> **"Biz `corpus` ga — hujjat-terminimizga, `id2word` ga — lug'atimizga murojaat qilamiz. Va keyin oldin ko'rsatgan mavzular soniga — bu ikkita bo'ladi."**

**O'qituvchi videosidagi natija:**

```
Mavzu 0:  mr · said · trump · state · would
Mavzu 1:  mr · trump · said · saudi · would
```

### 🅱️ sklearn — ✅ ISHGA TUSHIRILGAN

```python
tfidf_vec = TfidfVectorizer()
Xt = tfidf_vec.fit_transform(matn)

lsa_model = TruncatedSVD(n_components=2, random_state=42)
lsa_model.fit(Xt)

n2 = tfidf_vec.get_feature_names_out()
for i, t in enumerate(lsa_model.components_):
    print(f"Mavzu {i}:", [n2[j] for j in t.argsort()[::-1][:6]])
```

```
Mavzu 0: ['mr', 'trump', 'said', 'state', 'presid', 'would']
Mavzu 1: ['trump', 'mr', 'republican', 'ryan', 'speech', 'cruz']
```

> ✅ **Mavzu 0 deyarli AYNAN mos keldi** *(`mr`, `trump`, `said`, `state`, `would`)*.

---

## 3. LDA bilan solishtiramiz

> **"Bu yerda bizda ikkita mavzu bor. Va biz ular LDA modelini ishga tushirganimizdan BIROZ FARQ QILISHINI ko'ramiz."**

| | **LDA** | **LSA** |
|---|---|---|
| **Mavzu 0** | `mr` `said` `trump` `would` `one` `year` | `mr` `trump` `said` `state` `presid` `would` |
| **Mavzu 1** | `said` `mr` `state` `polic` `offic` `one` | `trump` `mr` **`republican`** **`ryan`** **`speech`** **`cruz`** |

### 🎯 LSA'ning 1-mavzusi ANCHA YAXSHI!

```
LDA Mavzu 1:  said · mr · state · polic · offic · one
                    ↑ hali ham axlat

LSA Mavzu 1:  trump · mr · republican · ryan · speech · cruz
                            ↑         ↑        ↑
              MANA — ANIQ SIYOSIY mavzu!
              Paul Ryan, Ted Cruz — respublikachi siyosatchilar
```

> ## 💡 **Nima uchun LSA yaxshiroq chiqdi?** Chunki u **TF-IDF** dan foydalanadi! TF-IDF `mr` va `said` ga **avtomatik past vazn** beradi *(24-modulni eslang)*. LDA esa **Bag of Words** ishlatadi — u yerda `mr` **1200 marta** sanaladi.

---

## 4. Tushuntirilgan o'zgaruvchanlik

`sklearn`da qo'shimcha foydali ma'lumot bor:

```python
print("Har mavzu:", lsa_model.explained_variance_ratio_.round(4))
print("Jami     :", round(lsa_model.explained_variance_ratio_.sum(), 4))
```

```
Har mavzu: [0.0116 0.0251]
Jami     : 0.0367
```

### ⚠️ Atigi 3.67%?!

```
2 ta mavzu ma'lumotning atigi 3.67% ini tushuntiradi.
                                   ↑
              Bu — MAVZULAR JUDA KAM degan signal!
```

> ## 🔑 **Bu — `Σ` (sigma) ning amaliy ko'rinishi** *(5-darsni eslang)*. U bizga har bir mavzu qanchalik **muhim** ekanini aytadi. 3.67% — **juda past**, ya'ni ma'lumotda **ancha ko'p** mavzu bor.

**Ko'proq mavzu bilan sinaymiz:**

```python
for k in [2, 5, 10, 20, 50]:
    m = TruncatedSVD(n_components=k, random_state=42).fit(Xt)
    print(f"k={k:2d}  →  {m.explained_variance_ratio_.sum():.1%}")
```

```
k= 2  →   3.7%
k= 5  →   9.3%
k=10  →  16.9%
k=20  →  29.2%
k=50  →  60.4%
```

> ## 💡 **50 ta mavzu ham atigi 60%.** Bu — matn ma'lumoti uchun **normal**. Matn juda **xilma-xil** — 100 ta maqolada juda ko'p turli mavzular bor. **Hech qachon 100% ga yetmaydi.**

---

## 5. ⭐ Yaxshilangan LSA

4-darsdagi kabi `max_df` va `min_df` qo'shamiz:

```python
tv2 = TfidfVectorizer(max_df=0.5, min_df=5)
Xt2 = tv2.fit_transform(matn)

lsa2 = TruncatedSVD(n_components=5, random_state=42).fit(Xt2)
nt2 = tv2.get_feature_names_out()

for i, t in enumerate(lsa2.components_):
    print(f"Mavzu {i}:", [nt2[j] for j in t.argsort()[::-1][:8]])
```

```
Mavzu 0: ['trump', 'ms', 'govern', 'unit', 'show', 'citi', 'polic', 'offici']
Mavzu 1: ['trump', 'republican', 'ryan', 'speech', 'clinton', 'cruz', 'parti', 'democrat']
Mavzu 2: ['song', 'album', 'play', 'band', 'music', 'ms', 'show', 'trump']
Mavzu 3: ['polic', 'offic', 'shot', 'shoot', 'man', 'violenc', 'protest', 'citi']
Mavzu 4: ['ms', 'compani', 'vehicl', 'polic', 'model', 'rate', 'percent', 'car']
```

### 🎉 MANA BU — AJOYIB NATIJA

| Mavzu | So'zlar | Nima haqida |
|---|---|---|
| **0** | `trump` `govern` `unit` `show` `citi` `polic` | ⚠️ **Aralash** — hammasi biroz |
| **1** | `republican` `ryan` `speech` `clinton` `cruz` `democrat` | 🏛️ **AQSH saylovi** |
| **2** | `song` `album` `play` `band` `music` | 🎵 **Musiqa** |
| **3** | `polic` `offic` `shot` `shoot` `violenc` `protest` | 🚔 **Politsiya otishmasi** |
| **4** | `compani` `vehicl` `model` `rate` `percent` `car` | 🚗 **Avtomobil biznesi** |

> ## 🔑 **1, 2, 3, 4-mavzular JUDA ANIQ.** LDA'ning natijasidan ham **aniqroq** — `ryan`, `cruz`, `album`, `band`, `shoot`, `vehicl` kabi **aniq** so'zlar chiqdi.

### ⚠️ 0-mavzu nima uchun aralash?

Raqamlar buni **aniq** tushuntiradi:

```python
print("Singular qiymatlar:", lsa2.singular_values_.round(3))
print("Tushuntirilgan var:", lsa2.explained_variance_ratio_.round(4))
```

```
Singular qiymatlar: [3.252 1.879 1.649 1.476 1.407]
                      ↑ ENG KATTA!
Tushuntirilgan var: [0.0074 0.0386 0.0302 0.0241 0.0219]
                      ↑ ENG KICHIK!
```

### 🔑 G'alati? Yo'q — mana sabab

```
0-komponent ENG KATTA singular qiymatga ega (3.252)
   → u ma'lumotdagi ENG KUCHLI yo'nalish

LEKIN uning "tushuntirilgan o'zgaruvchanligi" ENG KICHIK (0.74%)
   → chunki bu O'RTACHA yo'nalish

O'rtacha — bu hujjatlarni bir-biridan AJRATMAYDI!
Hamma hujjatda bor narsa FARQ yaratmaydi.
```

> ## 💡 **0-mavzu — bu "korpusning o'rtachasi"**: *"bu 100 ta maqola umuman nima haqida"*. U kuchli, lekin **ajratmaydi**.
>
> **Amaliy maslahat:** 0-mavzuni **e'tiborsiz qoldiring** va **1-mavzudan** boshlab talqin qiling. E'tibor bering — 1-mavzu **eng yuqori** tushuntirilgan o'zgaruvchanlikka ega *(3.86%)*, va u **eng aniq** mavzu chiqdi!

---

## 6. 💻 To'liq kod

```python
import pandas as pd, re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

# ===== TOZALASH (4-darsdagi kabi) =====
data = pd.read_csv("data/news_articles.csv")
ps = PorterStemmer(); en_stopwords = stopwords.words('english')

def tozala(m):
    m = re.sub(r"[^\w\s]", "", m).lower()
    return [ps.stem(w) for w in word_tokenize(m) if w not in en_stopwords]

articles = [tozala(a) for a in data["content"]]
matn = [" ".join(a) for a in articles]

# ===== SODDA LSA (2 mavzu) =====
tfidf_vec = TfidfVectorizer()
Xt = tfidf_vec.fit_transform(matn)
lsa = TruncatedSVD(n_components=2, random_state=42).fit(Xt)
n1 = tfidf_vec.get_feature_names_out()

print("--- SODDA LSA ---")
for i, t in enumerate(lsa.components_):
    print(f"  Mavzu {i}:", [n1[j] for j in t.argsort()[::-1][:6]])
print("  Tushuntirilgan:", f"{lsa.explained_variance_ratio_.sum():.2%}")

# ===== YAXSHILANGAN LSA (5 mavzu) ⭐ =====
tv2 = TfidfVectorizer(max_df=0.5, min_df=5)
Xt2 = tv2.fit_transform(matn)
lsa2 = TruncatedSVD(n_components=5, random_state=42).fit(Xt2)
n2 = tv2.get_feature_names_out()

print("\n--- YAXSHILANGAN LSA ---")
for i, t in enumerate(lsa2.components_):
    print(f"  Mavzu {i}:", [n2[j] for j in t.argsort()[::-1][:8]])
```

---

## 7. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** LSA va LSI farqi nimada?

**M2.** 3 ta mavzu bilan ishga tushiring.

**M3.** Tushuntirilgan o'zgaruvchanlikni chiqaring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
# HECH QANDAY FARQ YO'Q — bir xil narsaning ikki nomi.
#   LSA = ilmiy adabiyotda
#   LSI = ma'lumot izlash (information retrieval) sohasida

# M2
lsa3 = TruncatedSVD(n_components=3, random_state=42).fit(Xt2)
for i, t in enumerate(lsa3.components_):
    print(f"Mavzu {i}:", [n2[j] for j in t.argsort()[::-1][:8]])

# M3
for k in [2, 5, 10, 20, 50]:
    m = TruncatedSVD(n_components=k, random_state=42).fit(Xt)
    print(f"k={k:2d}  →  {m.explained_variance_ratio_.sum():.1%}")
```

</details>

### 🟡 O'rta

**M4.** LSA vaznlarida **manfiy** qiymat bormi?

**M5.** LDA va LSA natijalarini yonma-yon solishtiring.

**M6.** ⭐ LSA bilan **semantik qidiruv** qiling.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — MANFIY VAZNLAR
import numpy as np
c = lsa2.components_
print("MIN:", round(c.min(), 4), " MAX:", round(c.max(), 4))
print("Manfiy ulush:", f"{(c < 0).sum() / c.size:.1%}")
# MIN: -0.188   MAX: 0.6379
# Manfiy ulush: 47.4%

# 1-mavzuning eng MANFIY so'zlari:
t = c[1]
print("Eng manfiy:", [n2[j] for j in t.argsort()[:5]])
# Eng manfiy: ['ms', 'polic', 'song', 'album', 'citi']
#
# 🎯 MANA BU QIZIQ! 1-mavzu = SIYOSAT (republican, ryan, cruz).
#    Uning eng MANFIY so'zlari: song, album, polic —
#    ya'ni MUSIQA va JINOYAT.
#
#    Model shunday deyapti: "Agar matnda 'song' yoki 'album'
#    bo'lsa — bu SIYOSIY maqola EMAS."
#
# 💡 Vaznlarning DEYARLI YARMI (47.4%) manfiy!
#    LDA'da bunday bo'lmaydi — u yerda hammasi musbat.

# M5
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn)
lda2 = LatentDirichletAllocation(n_components=5, random_state=42,
                                 max_iter=20).fit(X2)
nc = cv2.get_feature_names_out()

for i in range(5):
    print(f"M{i} LDA:", [nc[j] for j in lda2.components_[i].argsort()[::-1][:6]])
    print(f"   LSA:", [n2[j] for j in lsa2.components_[i].argsort()[::-1][:6]])
    print()

# M6 — ⭐ SEMANTIK QIDIRUV
from sklearn.metrics.pairwise import cosine_similarity

# Hujjatlarni LSA fazosiga o'tkazamiz
D = lsa2.transform(Xt2)          # (100, 5) — atigi 5 o'lchov!

def semantik_qidir(sorov, n=3):
    q = tv2.transform([" ".join(tozala(sorov))])
    qv = lsa2.transform(q)
    b = cosine_similarity(qv, D)[0]
    return [(int(i), round(float(b[i]), 4)) for i in b.argsort()[::-1][:n]]

for s in ["police shooting", "music album band", "republican election"]:
    print(f"🔍 '{s}':")
    for i, bl in semantik_qidir(s):
        print(f"   {bl:6.4f}  {data['title'][i][:58]}")
    print()
#
# 🔑 Diqqat: hujjatlar endi ATIGI 5 ta raqam bilan tasvirlanadi
#    (8663 emas!) — lekin qidiruv baribir ishlaydi.
#    Bu — o'lchovni kamaytirishning KUCHI.
```

</details>

### 🔴 Qiyin

**M7.** LSA deterministikmi — tekshiring.

**M8.** Nima uchun 0-mavzu aralash?

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — DETERMINISTIKMI?
a = TruncatedSVD(n_components=5, random_state=0).fit(Xt2)
b = TruncatedSVD(n_components=5, random_state=99).fit(Xt2)
print("Aynan bir xilmi?", np.allclose(np.abs(a.components_),
                                      np.abs(b.components_)))
print("Eng katta farq:", np.abs(np.abs(a.components_) -
                                np.abs(b.components_)).max().round(4))

for i in range(5):
    wa = [n2[j] for j in a.components_[i].argsort()[::-1][:6]]
    wb = [n2[j] for j in b.components_[i].argsort()[::-1][:6]]
    print(f"  M{i}: {'BIR XIL' if wa == wb else 'FARQ'}")
```

```
Aynan bir xilmi? False
Eng katta farq: 0.0469
  M0: BIR XIL
  M1: BIR XIL
  M2: FARQ
  M3: BIR XIL
  M4: FARQ
```

### 🔑 Aniq javob — "amalda barqaror, lekin bit-darajada emas"

```
❌ AYNAN bir xil EMAS  (allclose = False)
✅ TOP SO'ZLAR 5 tadan 3 tasida BIR XIL
⚠️ M2 va M4 da tartib biroz o'zgardi

Sabab: sklearn "randomized SVD" algoritmidan foydalanadi —
u TAXMINIY (tez, lekin 100% aniq emas).
```

> ## 💡 **LDA bilan solishtiring** *(4-dars, M9)*: u yerda mavzular **butunlay** o'zgargan edi. LSA esa **deyarli** barqaror — faqat kuchsizroq mavzularda kichik tebranish.
>
> **Xulosa:** `random_state` ni **ikkalasida ham** qo'ying, lekin LSA ancha **ishonchliroq**.

```python
# To'liq deterministik kerakmi?
lsa_aniq = TruncatedSVD(n_components=5, algorithm='arpack',
                        random_state=42)
# 'arpack' — sekinroq, lekin ANIQ

# M8 — 0-MAVZU
print("Tushuntirilgan o'zgaruvchanlik:")
print(lsa2.explained_variance_ratio_.round(4))
#
# 💡 Odatda 0-mavzu ENG KATTA ulushga ega —
#    u "korpus umuman nima haqida" degan savolga javob beradi.
#    Shuning uchun u ARALASH ko'rinadi.
#
#    Amaliyotda: 0-mavzuni E'TIBORSIZ qoldirib,
#    1-mavzudan boshlab talqin qiling.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. LSA va LSI farqi nimada?
2. `gensim`da qaysi sinf, `sklearn`da qaysi?
3. LSA qaysi vektorlashtirishni ishlatadi?
4. Nima uchun LSA'ning 1-mavzusi LDA'nikidan yaxshiroq chiqdi?
5. `explained_variance_ratio_` nimani ko'rsatadi?
6. LSA vaznlari manfiy bo'lishi mumkinmi?
7. Nima uchun 0-mavzu aralash?

<details>
<summary>✅ Javoblar</summary>

1. ## **HECH QANDAY!** Bir xil narsaning ikki nomi.
2. `gensim` → **`LsiModel`**. `sklearn` → **`TruncatedSVD`** *(+ `TfidfVectorizer`)*.
3. ## **TF-IDF** *(LDA esa Bag of Words)*.
4. Chunki **TF-IDF** `mr` va `said` ga **avtomatik past vazn** beradi. LDA'ning Bag of Words'ida `mr` **1200 marta** sanalgan.
5. Har bir mavzu ma'lumotdagi **o'zgaruvchanlikning qancha qismini** tushuntirishini. Bu — **`Σ`** ning amaliy ko'rinishi.
6. ## **HA.** Manfiy vazn = *"bu so'z bu mavzuga qarama-qarshi"*.
7. Chunki LSA'ning **birinchi** komponenti ma'lumotdagi **eng katta umumiy** o'zgaruvchanlikni ushlaydi — *"korpus umuman nima haqida"*.

</details>

---

## 📌 Xulosa

```python
# ===== GENSIM =====
from gensim.models import LsiModel
lsa_model = LsiModel(corpus=doc_term_matrix,
                     id2word=dictionary,
                     num_topics=2)

# ===== SKLEARN (LSA = TF-IDF + TruncatedSVD) =====
Xt = TfidfVectorizer().fit_transform(matn)
lsa = TruncatedSVD(n_components=2, random_state=42).fit(Xt)


LSA = LSI   (bir xil narsa!)


SODDA NATIJA (2 mavzu)
  M0: mr · trump · said · state · presid · would
  M1: trump · mr · republican · ryan · speech · cruz    ⭐

  Taqqoslang LDA bilan:
  M1(LDA): said · mr · state · polic · offic · one      ← axlat

  🔑 LSA YAXSHIROQ, chunki u TF-IDF ishlatadi —
     "mr" va "said" AVTOMATIK past vazn oladi!


⭐ YAXSHILANGAN (max_df=0.5, min_df=5, 5 mavzu)
  M0: aralash (umumiy)                    ⚠️ e'tiborsiz qoldiring
  M1: republican · ryan · cruz · clinton  🏛️ AQSH saylovi
  M2: song · album · band · music         🎵 musiqa
  M3: polic · shot · shoot · violenc      🚔 otishma
  M4: compani · vehicl · model · car      🚗 avtomobil


TUSHUNTIRILGAN O'ZGARUVCHANLIK
  2 mavzu → atigi 3.67%
            ↑ ma'lumotda ANCHA KO'P mavzu bor degan signal


⚠️ FARQLAR
  · Vaznlar MANFIY bo'lishi mumkin (LDA'da yo'q)
  · 0-mavzu odatda ARALASH (umumiy)
  · LSA DETERMINISTIK (LDA tasodifiy)
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `LsiModel` | *LSI model* | gensim LSA sinfi |
| `TruncatedSVD` | *truncated SVD* | sklearn LSA sinfi |
| Tushuntirilgan o'zgaruvchanlik | *explained variance* | Mavzu ma'lumotning qanchasini tushuntiradi |
| Komponent | *component* | Mavzu *(sklearn atamasi)* |
| Semantik qidiruv | *semantic search* | Ma'no bo'yicha qidirish |

---

⬅️ [Oldingi: LSA nazariyasi](05-Latent-Semantic-Analysis.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Nechta mavzu?](07-How-Many-Topics.md)
