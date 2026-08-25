# 4-dars. LDA Python'da

## 🎬 Boshlashdan oldin

> **"LDA modelini ishga tushirish uchun bizga GENSIM paketini import qilish kerak bo'ladi — pandas va NLTK paketlari bilan birga."**

📁 **Ma'lumot:** [`data/news_articles.csv`](data/news_articles.csv) — **100 ta** haqiqiy yangilik maqolasi *(New York Times)*.

---

## ⚠️ MUHIM ESLATMA — ikkita yo'l

Kurs **`gensim`** paketidan foydalanadi. Lekin:

```
gensim  →  C++ kompilyatsiyasini talab qiladi
        →  Python 3.13+ da tayyor wheel YO'Q
        →  Windows'da Microsoft C++ Build Tools kerak
```

| | **A yo'li — gensim** | **B yo'li — scikit-learn** |
|---|---|---|
| **Kurs ishlatadi** | ✅ | ❌ |
| **Python 3.14 da o'rnatiladi** | ❌ *(kompilyator kerak)* | ✅ |
| **Koherentlik balli tayyor** | ✅ `CoherenceModel` | ❌ *(qo'lda yozamiz)* |
| **Natija** | Bir xil g'oya, biroz boshqa sonlar | |

> ## 💡 **Bu darsda IKKALASI ham berilgan.** `gensim` kodi — **kursni kuzatish** uchun *(Python 3.10–3.12 da ishlaydi)*. `sklearn` kodi — **ishga tushirilgan va tekshirilgan** *(bu yerdagi barcha raqamlar undan)*.

```bash
# A yo'li (Python 3.10-3.12 kerak)
pip install gensim

# B yo'li (istalgan Python)
pip install scikit-learn pandas nltk
```

---

## 1. Ma'lumotni yuklash

> **"Keyin ma'lumotimizni yuklaymiz. Bu misol uchun biz yangilik maqolalaridan foydalanamiz."**

```python
import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

data = pd.read_csv("data/news_articles.csv")
print(data.shape)
print(data.columns.tolist())
```

```
(100, 3)
['id', 'title', 'content']
```

> **"Keyin `data.head()` ni ishga tushiramiz va bizda ID, SARLAVHA va KONTENT borligini ko'ramiz. Kontent — bu shunchaki yangilik maqolasining mazmuni, sarlavha esa o'sha maqolaning sarlavhasi."**
>
> **"`data.info()` ni ishga tushirganimizda, bizda 100 QATOR ma'lumot borligini va NULL YO'QLIGINI ko'ramiz."**

```python
print(data["content"][0][:200])
```

```
Dr. Frank Sacks, a professor of nutrition at Harvard, likes to challenge his audience when he gives lectures on obesity. “If you want to make a great discovery,” he tells them, figure out this: Why do
```

```python
print("O'rtacha uzunlik:", int(data["content"].str.split().str.len().mean()), "so'z")
```

```
O'rtacha uzunlik: 1112 so'z
```

> ## 🔑 **1112 so'z — bu UZUN hujjat.** Bu **yaxshi**: mavzu modeli uzun matnda **ancha yaxshi** ishlaydi *(tvit — 10 so'z, naqsh yetarli emas)*.

---

## 2. Maqolalarni ajratamiz

> **"Biz bu ma'lumot to'plamidan faqat MAQOLALARGA qiziqamiz. Ya'ni kontent — biz shularni tortib olamiz, ular hamma narsadan alohida bo'lsin."**

```python
articles = data["content"]
```

---

## 3. Tozalash

> **"Maqolalarni olganimizdan so'ng, biz ularni biroz TOZALAYMIZ. Buni boshqa ko'p darslarda ko'rganmiz."**
>
> **"Demak, biz TINISH BELGILARNI olib tashlaymiz, KICHIK HARFGA o'tkazamiz, TO'XTATISH SO'ZLARNI olib tashlaymiz, TOKENIZATSIYA qilamiz va STEMMING qilamiz."**

```python
ps = PorterStemmer()
en_stopwords = stopwords.words('english')

def tozala(matn):
    matn = re.sub(r"[^\w\s]", "", matn).lower()
    return [ps.stem(w) for w in word_tokenize(matn) if w not in en_stopwords]

articles = [tozala(a) for a in data["content"]]

print("Hujjatlar:", len(articles))
print("Birinchi 12 token:", articles[0][:12])
```

```
Hujjatlar: 100
Birinchi 12 token: ['dr', 'frank', 'sack', 'professor', 'nutrit', 'harvard', 'like', 'challeng', 'audienc', 'give', 'lectur', 'obes']
```

### 🔑 Nima uchun STEMMING, lemmatization emas?

> ## **"Men bu yerda STEMMING'ni tanladim, chunki bizda ANCHA KO'P MATN bor. Bu bizning ishlov berish vaqtimiz ancha tezlashishini anglatadi, chunki biz so'zlarning katta qismini QISQARTIRA olamiz."**
>
> **"Xohlasangiz lemmatization ishlatishingiz mumkin, lekin bu maqsad uchun stemming ham yaxshi bo'ladi."**

```
100 maqola × 1112 so'z = ~111 000 so'z

STEMMING          →  tez, lug'at KICHIKROQ
LEMMATIZATION     →  sekin, lug'at kattaroq

Mavzu modeli uchun "nutrit" va "nutrition" farqi MUHIM EMAS —
muhimi ular BIRGA GURUHLANISHI.
```

> 💡 **21-modulni eslang:** stemming lug'atni **18%**, lemmatization atigi **6%** kamaytirgan edi. Bu yerda **tezlik** muhimroq.

---

## 4. Lug'at yaratish

> **"Keyingi qadam — LUG'AT yaratish. Bu bizning ma'lumot to'plamimizdagi HAR BIR NOYOB SO'Z lug'ati bo'ladi."**

### 🅰️ gensim yo'li

```python
from gensim import corpora

dictionary = corpora.Dictionary(articles)
print(dictionary)
```

```
Dictionary<8693 unique tokens: ['abandon', 'abil', 'abl', ...]>
```

> **"Buni chop etib, bizda 8693 ta noyob token qolganini ko'ramiz. Bu ma'lumot to'plamimizdagi noyob so'zlar soni."**

### 🅱️ sklearn yo'li

```python
noyob = {w for a in articles for w in a}
print("Noyob token:", len(noyob))
```

```
Noyob token: 8691
```

> ⚠️ **8691 va 8693 — kichik farq.** Sabab: tokenizatsiya nozikliklari. **Muhim emas** — g'oya bir xil.

---

## 5. Hujjat-termin matritsasi

> **"Keyin biz HUJJAT-TERMIN MATRITSASINI yaratmoqchimiz. Oldingi darslarda vektorlashtirish qilganimizda — biz bu yerda AYNAN SHUNI qilyapmiz. Bu shunchaki BOSHQA USUL, chunki biz boshqa paketdan foydalanyapmiz."**

### 🅰️ gensim

```python
doc_term_matrix = [dictionary.doc2bow(text) for text in articles]
print(doc_term_matrix[0][:10])
```

```
[(0, 1), (1, 2), (2, 3), (3, 1), (4, 1), (5, 1), (6, 1), (7, 2), (8, 1), (9, 1)]
```

> **"`dictionary.doc2bow` — siz eslaysiz, bu BAG OF WORDS. Buni chop etib nima ko'rinishini ko'ramiz: bu to'liq vektorlashtirilgan. Bu yerda SO'ZLAR QOLMAGAN. Bu shunchaki RAQAMLAR — LDA modelimizga berish uchun MUKAMMAL."**

```
(0, 1)  →  0-so'z, 1 marta
(1, 2)  →  1-so'z, 2 marta
(2, 3)  →  2-so'z, 3 marta
```

> 💡 **Bu — SIYRAK format** *(24-modulni eslang)*. Faqat **nolmas** qiymatlar saqlanadi.

### 🅱️ sklearn

```python
from sklearn.feature_extraction.text import CountVectorizer

matn = [" ".join(a) for a in articles]
count_vec = CountVectorizer()
X = count_vec.fit_transform(matn)
print("Hujjat-termin matritsasi:", X.shape)
```

```
Hujjat-termin matritsasi: (100, 8663)
```

---

## 6. LDA modelini qurish

> **"Boshlash uchun biz tortib olishni xohlagan mavzular sonini IKKI deb belgilaymiz."**

```python
num_topics = 2
```

### 🅰️ gensim

```python
from gensim import models

lda_model = models.LdaModel(corpus=doc_term_matrix,
                            id2word=dictionary,
                            num_topics=num_topics)

print(lda_model.print_topics(num_topics=2, num_words=5))
```

> **"Talab qilinadigan argumentlar: `corpus` — bu bizning hujjat-termin matritsamiz, `id2word` — bu bizning lug'atimiz, va xohlagan mavzular sonini ko'rsatish."**

**O'qituvchi videosidagi natija:**

```
Mavzu 0:  said · mr · trump · one · state
Mavzu 1:  mr · said · would · state · trump
```

### 🅱️ sklearn — ✅ ISHGA TUSHIRILGAN

```python
from sklearn.decomposition import LatentDirichletAllocation

lda_model = LatentDirichletAllocation(n_components=num_topics,
                                      random_state=42,
                                      max_iter=10)
lda_model.fit(X)

names = count_vec.get_feature_names_out()
for i, t in enumerate(lda_model.components_):
    print(f"Mavzu {i}:", [names[j] for j in t.argsort()[::-1][:6]])
```

```
Mavzu 0: ['mr', 'said', 'trump', 'would', 'one', 'year']
Mavzu 1: ['said', 'mr', 'state', 'polic', 'offic', 'one']
```

> ✅ **Ikkala paket ham DEYARLI BIR XIL natija berdi** — `mr`, `said`, `trump`, `state`. Bu — algoritmning **to'g'ri ishlayotganini** tasdiqlaydi.

---

## 7. ⚠️ NATIJA YOMON — va bu ASOSIY DARS

> ## **"Afsuski, bu mavzular UNCHALIK INFORMATIV EMAS."**

```
Mavzu 0: mr · said · trump · would · one · year
Mavzu 1: said · mr · state · polic · offic · one
             ↑
   IKKALASI HAM deyarli BIR XIL!
   Va "mr", "said", "one" — HECH NARSA aytmaydi.
```

> **"Demak, bizga mavzular sonini O'ZGARTIRISH kerak bo'lishi mumkin — buni qanday optimallashtirishni kelgusi darsda ko'ramiz. Yoki ma'lumot to'plamimizni BIROZ KO'PROQ TOZALASH kerak bo'lishi mumkin. Yoki ba'zan ma'lumotda shunchaki U QADAR KO'P MAVZU YO'Q, va buni aniqlash uchun biroz tadqiqot kerak bo'ladi."**

### 🔍 Muammoni tashxislaymiz

```python
from collections import Counter
c = Counter(w for a in articles for w in a)
print(c.most_common(10))
```

```
[('mr', 1200), ('said', 1038), ('trump', 387), ('would', 312),
 ('state', 295), ('one', 291), ('year', 280), ('like', 240),
 ('new', 234), ('peopl', 233)]
```

```
"mr"   → 1200 marta!
"said" → 1038 marta!
       ↑
Bu so'zlar DEYARLI HAR BIR maqolada bor.
NLTK to'xtatish so'zlari ro'yxatida ular YO'Q —
lekin BU KORPUS uchun ular ham TO'XTATISH SO'ZI!
```

> ## 💡 **Mana muammo:** `said` va `mr` — **umumiy ingliz** to'xtatish so'zi emas, lekin **yangilik maqolalari** uchun ular **aynan shunday**. Har bir maqola kimningdir gapini keltiradi → `said`. Har biri kimnidir tilga oladi → `mr`.

---

## 8. ⭐⭐ YECHIM — `max_df` va `min_df`

Bu — kursda **yo'q**, lekin **eng muhim** qadam.

```python
count_vec2 = CountVectorizer(max_df=0.5,   # 50%+ hujjatda bo'lsa — TASHLA
                             min_df=5)      # 5 tadan kam hujjatda — TASHLA
X2 = count_vec2.fit_transform(matn)
print("Oldin:", X.shape[1], " Keyin:", X2.shape[1])
```

```
Oldin: 8663  Keyin: 1853
```

### 🔑 Nima bo'ldi?

```
max_df=0.5  →  "said", "mr", "one", "would" — 50%+ hujjatda
               → TASHLANDI  ✅

min_df=5    →  faqat 1-2 maqolada uchraydigan noyob so'zlar
               → TASHLANDI (shovqin)  ✅

8663  →  1853 ustun   (79% o'chdi!)
```

### Endi qayta ishga tushiramiz — 5 mavzu bilan

```python
lda2 = LatentDirichletAllocation(n_components=5, random_state=42, max_iter=20)
lda2.fit(X2)

n2 = count_vec2.get_feature_names_out()
for i, t in enumerate(lda2.components_):
    print(f"Mavzu {i}:", [n2[j] for j in t.argsort()[::-1][:8]])
```

```
Mavzu 0: ['ms', 'show', 'play', 'song', 'book', 'night', 'stori', 'im']
Mavzu 1: ['ms', 'citi', 'rate', 'compani', 'account', 'percent', 'team', 'vehicl']
Mavzu 2: ['trump', 'polit', 'republican', 'parti', 'obama', 'support', 'unit', 'democrat']
Mavzu 3: ['polic', 'offic', 'citi', 'fire', 'offici', 'vote', 'local', 'man']
Mavzu 4: ['govern', 'unit', 'dr', 'offici', 'compani', 'world', 'american', 'research']
```

### 🎯 MANA ENDI MA'NO BOR!

| Mavzu | So'zlar | Nima haqida |
|---|---|---|
| **0** | `show` `play` `song` `book` `stori` | 🎭 **Madaniyat va ko'ngilochar** |
| **1** | `rate` `compani` `account` `percent` `vehicl` | 💰 **Biznes va moliya** |
| **2** | `trump` `republican` `parti` `obama` `democrat` | 🏛️ **Siyosat** |
| **3** | `polic` `offic` `fire` `man` | 🚔 **Jinoyat va mahalliy xabarlar** |
| **4** | `govern` `dr` `research` `world` | 🌍 **Hukumat va ilm** |

> ## 🎉 **Ikki qatorlik o'zgarish** *(`max_df=0.5, min_df=5`)* **— va foydasiz natija HAQIQIY tahlilga aylandi.**

---

## 9. Hujjatlarni mavzular bo'yicha taqsimlash

```python
T = lda2.transform(X2)          # har hujjat uchun mavzu ehtimollari
dominant = T.argmax(axis=1)     # eng katta ehtimolli mavzu

print(pd.Series(dominant).value_counts().sort_index().to_string())
```

```
0    28
1    13
2    24
3    15
4    20
```

```
Mavzu 0 (madaniyat)  ████████████████████████████  28
Mavzu 1 (biznes)     █████████████  13
Mavzu 2 (siyosat)    ████████████████████████  24
Mavzu 3 (jinoyat)    ███████████████  15
Mavzu 4 (hukumat)    ████████████████████  20
```

### Tekshiramiz — haqiqiy sarlavhalar

```python
import numpy as np
for k in range(5):
    idx = np.where(dominant == k)[0][:2]
    for i in idx:
        print(f"M{k}: {data['title'][i][:70]}")
```

```
M0: 'Harry Potter and the Cursed Child' Goes From Stage to Page on Saturda
M0: Mar-a-Lago, the Future Winter White House and Home of the Calmer Trump
M1: Hurricane Matthew Approaches Florida Governor Urges 1.5 Million to Fle
M1: How to Get Better Returns on Savings - The New York Times
M2: U.S. Presidential Race, Apple, Gene Wilder: Your Tuesday Evening Brief
M2: His Predecessor Gone, Gambia's New President Finally Comes Home - The
M3: South Carolina Stuns Baylor to Reach the Round of Eight - The New York
M3: At Least 27 Shot, 7 Fatally, in Chicago Over Christmas Weekend - The N
M4: One Weight-Loss Approach Fits All? No, Not Even Close - The New York T
M4: Spokesman's Death Will Have Islamic State Turning to Its 'Deep Bench'
```

### ✅ Ko'pchiligi TO'G'RI

```
M0 → "Harry Potter... Stage to Page"      ✅ madaniyat
M1 → "Better Returns on Savings"          ✅ moliya
M2 → "Presidential Race" / "New President" ✅ siyosat
M3 → "At Least 27 Shot in Chicago"        ✅ jinoyat
M4 → "Weight-Loss Approach" / "Islamic State" ✅ ilm/dunyo
```

### ⚠️ Lekin xatolar ham bor

```
M1 → "Hurricane Matthew Approaches Florida"   ❌ bu MOLIYA emas!
M3 → "South Carolina Stuns Baylor"            ❌ bu SPORT!
```

> ## 💡 **Bu — normal.** Mavzu modeli **100% aniq emas**. U **kashfiyot vositasi**, **tasniflagich emas**. Natijani **odam tekshirishi** kerak — 2-darsdagi "5 bosqichli reja" ni eslang.

---

## 10. 💻 To'liq kod

```python
import pandas as pd, numpy as np, re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

# ===== 1 · MA'LUMOT =====
data = pd.read_csv("data/news_articles.csv")

# ===== 2 · TOZALASH =====
ps = PorterStemmer()
en_stopwords = stopwords.words('english')

def tozala(matn):
    matn = re.sub(r"[^\w\s]", "", matn).lower()
    return [ps.stem(w) for w in word_tokenize(matn) if w not in en_stopwords]

articles = [tozala(a) for a in data["content"]]
matn = [" ".join(a) for a in articles]

# ===== 3 · SODDA VERSIYA (kursdagi kabi) =====
cv = CountVectorizer()
X = cv.fit_transform(matn)
lda = LatentDirichletAllocation(n_components=2, random_state=42, max_iter=10).fit(X)
names = cv.get_feature_names_out()
print("--- SODDA (2 mavzu) ---")
for i, t in enumerate(lda.components_):
    print(f"  Mavzu {i}:", [names[j] for j in t.argsort()[::-1][:6]])

# ===== 4 · YAXSHILANGAN VERSIYA ⭐ =====
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn)
print(f"\nUstunlar: {X.shape[1]} → {X2.shape[1]}")

lda2 = LatentDirichletAllocation(n_components=5, random_state=42, max_iter=20).fit(X2)
n2 = cv2.get_feature_names_out()
print("\n--- YAXSHILANGAN (5 mavzu) ---")
for i, t in enumerate(lda2.components_):
    print(f"  Mavzu {i}:", [n2[j] for j in t.argsort()[::-1][:8]])

# ===== 5 · HUJJATLARNI TAQSIMLASH =====
T = lda2.transform(X2)
dominant = T.argmax(axis=1)
print("\n--- Taqsimot ---")
print(pd.Series(dominant).value_counts().sort_index().to_string())
```

---

## 11. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Tozalashdan keyin nechta noyob token qoldi?

**M2.** Eng ko'p uchraydigan 10 ta so'zni toping.

**M3.** 3 ta mavzu bilan ishga tushiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(len({w for a in articles for w in a}))       # 8691

# M2
from collections import Counter
c = Counter(w for a in articles for w in a)
print(c.most_common(10))
# [('mr', 1200), ('said', 1038), ('trump', 387), ('would', 312),
#  ('state', 295), ('one', 291), ('year', 280), ('like', 240),
#  ('new', 234), ('peopl', 233)]
#
# 🔑 Bu ro'yxat MUAMMONI ko'rsatadi — "mr" 1200 marta,
#    "said" 1038 marta. Ular hech qanday mavzuni AJRATMAYDI.

# M3
lda3 = LatentDirichletAllocation(n_components=3, random_state=42,
                                 max_iter=20).fit(X2)
for i, t in enumerate(lda3.components_):
    print(f"Mavzu {i}:", [n2[j] for j in t.argsort()[::-1][:8]])
```

</details>

### 🟡 O'rta

**M4.** `max_df` ni turli qiymatlarda sinang.

**M5.** Bitta maqolaning mavzu ulushlarini chiqaring.

**M6.** Har mavzuning **eng ishonchli** maqolasini toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
for md in [1.0, 0.8, 0.5, 0.3]:
    n = CountVectorizer(max_df=md, min_df=5).fit_transform(matn).shape[1]
    print(f"max_df={md}  →  {n:5d} ustun")
# max_df=1.0  →   1897 ustun
# max_df=0.8  →   1892 ustun
# max_df=0.5  →   1853 ustun
# max_df=0.3  →   1744 ustun
#
# ⚠️ KUTILMAGAN: max_df deyarli hech narsa o'zgartirmadi!
#    1897 → 1853 — atigi 44 ta so'z.
#
# 🔑 Sabab: OG'IR ISHNI min_df=5 QILDI.
#    8663 → 1897 (min_df=5 ning o'zi 78% ni o'chirdi!)
#    max_df esa faqat 44 ta so'zni oldi — LEKIN AYNAN
#    O'SHA 44 tasi "mr", "said", "one" edi — eng zararlilari.
#
# 💡 SABOQ: min_df hajmni kamaytiradi, max_df SIFATNI oshiradi.
#    Ikkalasi ham kerak.

# M5
print("0-maqola mavzu ulushlari:")
for i, p in enumerate(T[0]):
    print(f"  Mavzu {i}: {p:.1%}  {'█' * int(p*40)}")
print(f"  Sarlavha: {data['title'][0][:60]}")
#   Mavzu 0: 0.0%
#   Mavzu 1: 0.0%
#   Mavzu 2: 0.0%
#   Mavzu 3: 0.0%
#   Mavzu 4: 99.9%  ████████████████████████████████████████
#   Sarlavha: One Weight-Loss Approach Fits All? No, Not Even Close
#
# 🔑 99.9%! Bu — Dirichlet farazining KUCHLI namoyishi:
#    hujjat DEYARLI BUTUNLAY bitta mavzuga tegishli.
#
# 💡 Uzun hujjatlarda (1112 so'z) shunday bo'ladi — dalil KO'P,
#    model juda ishonchli. Qisqa matnda ulushlar aralashroq bo'ladi.

# M6
for k in range(5):
    i = T[:, k].argmax()
    print(f"M{k} ({T[i,k]:.1%}): {data['title'][i][:60]}")
# M0 (99.8%): Flight of the Conchords: Aimless, and That's O.K.
# M1 (99.8%): De Blasio's $325 Million Ferry Push: Rides to 5 Boroughs
# M2 (99.8%): Airstrikes by Russia Buttress Turkey in Battle vs. ISIS
# M3 (99.9%): A Surly Misfit With No Terror Links Turned a Truck Into a
# M4 (99.9%): Saudis Bankroll Taliban, Even as King Officially Supports
#
# 🎯 ENDI MAVZULARGA NOM BERAMIZ:
#   M0 → 🎭 ko'ngilochar (komediya shousi)
#   M1 → 🏙️ shahar/infratuzilma ($325 mln parom loyihasi)
#   M2 → 🌍 xalqaro nizolar (Rossiya, Turkiya, ISIS)
#   M3 → 🚔 terror/jinoyat (yuk mashinasi hujumi)
#   M4 → 🕌 Yaqin Sharq siyosati (Saudiya, Tolibon)
#
# 💡 Bu — mavzuga NOM berishning ENG YAXSHI usuli:
#    eng ishonchli hujjatni O'QING va nima haqida ekanini ko'ring.
#
# ⚠️ E'tibor bering: bu nomlar 8-bo'limdagi nomlardan BOSHQACHA!
#    U yerda TOP SO'ZLARGA qaradik, bu yerda TOP HUJJATLARGA.
#    Ikkala usulni BIRGA ishlating — to'liqroq manzara chiqadi.
```

</details>

### 🔴 Qiyin

**M7.** Korpusga xos to'xtatish so'zlarini **qo'lda** qo'shing.

**M8.** Stemming va lemmatization natijasini solishtiring.

**M9.** `random_state` ni o'zgartirib barqarorlikni tekshiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — QO'LDA TO'XTATISH SO'ZLARI
mening_sw = ['said', 'mr', 'one', 'would', 'also', 'year',
             'like', 'time', 'new', 'ms', 'could', 'peopl']
cv3 = CountVectorizer(min_df=5, stop_words=mening_sw)
X3 = cv3.fit_transform(matn)
lda4 = LatentDirichletAllocation(n_components=5, random_state=42,
                                 max_iter=20).fit(X3)
n3 = cv3.get_feature_names_out()
for i, t in enumerate(lda4.components_):
    print(f"Mavzu {i}:", [n3[j] for j in t.argsort()[::-1][:8]])
#
# 💡 max_df AVTOMATIK, qo'lda ro'yxat ANIQROQ.
#    Eng yaxshisi — IKKALASINI birga ishlating.

# M8
from nltk.stem import WordNetLemmatizer
lem = WordNetLemmatizer()
def tozala_lem(m):
    m = re.sub(r"[^\w\s]", "", m).lower()
    return [lem.lemmatize(w) for w in word_tokenize(m) if w not in en_stopwords]

lem_art = [tozala_lem(a) for a in data["content"]]
print("Stemming lug'ati     :", len({w for a in articles for w in a}))
print("Lemmatization lug'ati:", len({w for a in lem_art for w in a}))
# Stemming lug'ati     : 8691
# Lemmatization lug'ati: 11301
#
# 🔑 30% FARQ! Lemmatization 2610 ta ko'proq so'z qoldirdi.
#
# 💡 Mavzu modeli uchun STEMMING odatda yaxshiroq:
#    kamroq ustun = tezroq hisoblash va ZICHROQ naqsh.
#    O'qituvchi aynan shuning uchun stemming tanlagan.

# M9 — BARQARORLIK ⭐
for rs in [0, 42, 123]:
    m = LatentDirichletAllocation(n_components=5, random_state=rs,
                                  max_iter=20).fit(X2)
    print(f"random_state={rs}:")
    for i, t in enumerate(m.components_[:2]):
        print("   ", [n2[j] for j in t.argsort()[::-1][:5]])
#
# ⚠️ Mavzular MAZMUNAN o'xshash bo'ladi, lekin TARTIBI va
#    aniq so'zlari FARQ QILADI.
#
# 🔑 Shuning uchun random_state=42 ni DOIM qo'ying —
#    aks holda natijangizni TAKRORLAB BO'LMAYDI.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Kurs qaysi paketni ishlatadi?
2. Nima uchun stemming tanlandi?
3. Hujjat-termin matritsasi nima?
4. `doc2bow` nima qiladi?
5. Nima uchun birinchi natija yomon chiqdi?
6. `max_df=0.5` nima qiladi?
7. Yaxshilangandan keyin qanday mavzular chiqdi?
8. Mavzu modeli tasniflagichmi?

<details>
<summary>✅ Javoblar</summary>

1. **`gensim`**. *(Bu darslikda `sklearn` alternativi ham berilgan.)*
2. Chunki **ko'p matn** bor *(100 × 1112 so'z)* — stemming **tezlashtiradi** va lug'atni **qisqartiradi**.
3. Qatorlar = **hujjatlar**, ustunlar = **so'zlar**, qiymatlar = **necha marta**. *(24-modulning Bag of Words'i.)*
4. Hujjatni **bag of words** ga aylantiradi: `[(so'z_id, soni), ...]`.
5. Chunki `said`, `mr`, `one` kabi **korpusga xos** to'xtatish so'zlari qolgan edi. Ular **hamma** maqolada bor va **hech narsani ajratmaydi**.
6. Hujjatlarning **50% dan ko'pida** uchraydigan so'zlarni **tashlaydi**. Bizda: **8663 → 1853** ustun.
7. 🎭 madaniyat · 💰 biznes · 🏛️ siyosat · 🚔 jinoyat · 🌍 hukumat/ilm.
8. ## **YO'Q!** Bu — **kashfiyot vositasi**. Bizda ham **xatolar** bor edi *(Hurricane → moliya, basketbol → jinoyat)*.

</details>

---

## 📌 Xulosa

```python
# ===== TOZALASH =====
def tozala(matn):
    matn = re.sub(r"[^\w\s]", "", matn).lower()
    return [ps.stem(w) for w in word_tokenize(matn)
            if w not in en_stopwords]

# ===== GENSIM (kurs) =====
dictionary = corpora.Dictionary(articles)              # 8693 token
doc_term_matrix = [dictionary.doc2bow(t) for t in articles]
lda_model = models.LdaModel(corpus=doc_term_matrix,
                            id2word=dictionary,
                            num_topics=2)
lda_model.print_topics(num_topics=2, num_words=5)

# ===== SKLEARN (tekshirilgan) =====
X = CountVectorizer().fit_transform(matn)              # (100, 8663)
lda = LatentDirichletAllocation(n_components=2,
                                random_state=42).fit(X)


❌ SODDA NATIJA — FOYDASIZ
   Mavzu 0: mr · said · trump · would · one · year
   Mavzu 1: said · mr · state · polic · offic · one
             ↑ ikkalasi deyarli BIR XIL!


⭐⭐ YECHIM — IKKI QATOR
   CountVectorizer(max_df=0.5, min_df=5)
                   ↑           ↑
        50%+ hujjatda    5 tadan kam
        bo'lsa TASHLA    hujjatda TASHLA

   8663  →  1853 ustun  (79% o'chdi)


✅ YAXSHILANGAN NATIJA — 5 MAVZU
   M0: show · play · song · book · stori     🎭 madaniyat
   M1: rate · compani · account · percent    💰 biznes
   M2: trump · republican · parti · obama    🏛️ siyosat
   M3: polic · offic · fire · man            🚔 jinoyat
   M4: govern · dr · research · world        🌍 hukumat/ilm

   Taqsimot: 28 · 13 · 24 · 15 · 20


⚠️ 100% ANIQ EMAS
   "Hurricane Matthew" → moliya  ❌
   "South Carolina Stuns Baylor" → jinoyat  ❌

   Mavzu modeli = KASHFIYOT vositasi, TASNIFLAGICH emas.
   Natijani ODAM tekshirsin.
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Lug'at | *dictionary* | Barcha noyob so'zlar |
| Hujjat-termin matritsasi | *document-term matrix* | Hujjat × so'z jadvali |
| `doc2bow` | *doc to bag-of-words* | gensim vektorlashtirish |
| `max_df` | *max document frequency* | Juda keng tarqalgan so'zni tashlash |
| `min_df` | *min document frequency* | Juda kam uchraydigan so'zni tashlash |
| Ustun mavzu | *dominant topic* | Eng katta ehtimolli mavzu |
| `random_state` | *random state* | Takrorlanuvchanlik uchun |

---

⬅️ [Oldingi: LDA nazariyasi](03-Latent-Dirichlet-Allocation.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: LSA](05-Latent-Semantic-Analysis.md)
