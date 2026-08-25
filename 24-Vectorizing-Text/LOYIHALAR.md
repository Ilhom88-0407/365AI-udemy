# 🚀 24-modul — Mini-loyihalar

> 6 ta tayyor loyiha. Har biri **ishga tushirilgan va tekshirilgan**.

---

## ⚙️ Umumiy tayyorgarlik

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

## 1️⃣ Loyiha — Vektorlashtirish tekshirgichi

**Maqsad:** Har qanday matn to'plamini **ikkala usul** bilan vektorlashtirib solishtirish.

```python
def vektorlashtir(hujjatlar, stop=True):
    """Matnni BOW va TF-IDF bilan vektorlashtiradi va solishtiradi."""
    sw = 'english' if stop else None

    cv = CountVectorizer(stop_words=sw)
    bow = pd.DataFrame(cv.fit_transform(hujjatlar).toarray(),
                       columns=cv.get_feature_names_out())

    tv = TfidfVectorizer(stop_words=sw)
    tfidf = pd.DataFrame(tv.fit_transform(hujjatlar).toarray(),
                         columns=tv.get_feature_names_out())

    nol = (bow == 0).sum().sum()
    print(f"  Hujjat      : {bow.shape[0]}")
    print(f"  Noyob so'z  : {bow.shape[1]}")
    print(f"  Siyraklik   : {nol/bow.size:.1%} nol")
    print(f"  BOW oralig'i: {bow.values.min()} – {bow.values.max()}")
    print(f"  TF-IDF      : {tfidf.values.min():.4f} – {tfidf.values.max():.4f}")
    return bow, tfidf


print("--- To'xtatish so'zlar BILAN ---")
bow_a, tf_a = vektorlashtir(data, stop=False)
print("\n--- To'xtatish so'zlarSIZ ---")
bow_b, tf_b = vektorlashtir(data, stop=True)
```

**Natija:**

```
--- To'xtatish so'zlar BILAN ---
  Hujjat      : 6
  Noyob so'z  : 71
  Siyraklik   : 80.0% nol
  BOW oralig'i: 0 – 3
  TF-IDF      : 0.0000 – 0.4356

--- To'xtatish so'zlarSIZ ---
  Hujjat      : 6
  Noyob so'z  : 39
  Siyraklik   : 83.3% nol
  BOW oralig'i: 0 – 1
  TF-IDF      : 0.0000 – 0.5000
```

### 🔑 Uchta kuzatuv

**① BOW oralig'i `0–3` dan `0–1` ga tushdi.** Ya'ni **takrorlanadigan so'zlarning HAMMASI** to'xtatish so'zi edi! Ma'noli so'zlarning hech biri bir jumlada ikki marta uchramaydi.

**② TF-IDF maksimumi `0.4356` dan `0.5000` ga OSHDI.** To'xtatish so'zlari **vazn olib turgan** edi. Ular ketgach, qolgan so'zlarga **ko'proq vazn** tegdi.

**③ Siyraklik 80% dan 83.3% ga oshdi.** Ustunlar kamaydi *(71→39)*, lekin **eng to'la** ustunlar *(`the`, `to`, `he`)* **aynan o'shalar edi**.

---

## 2️⃣ Loyiha — TF-IDF qidiruv tizimi

**Maqsad:** So'rovga eng mos hujjatni topish — **haqiqiy qidiruv tizimlari shunday ishlaydi**.

```python
tv = TfidfVectorizer(stop_words='english')
M = tv.fit_transform(data)

def qidir(sorov, n=2):
    """So'rovga eng mos hujjatlarni topadi."""
    v = tv.transform([sorov])              # ⭐ FAQAT transform!
    ballar = cosine_similarity(v, M)[0]
    idx = ballar.argsort()[::-1][:n]
    return [(int(i), round(float(ballar[i]), 4)) for i in idx]


for s in ["shark attack beach", "vampire blood",
          "old man fishing worms", "socks drawer"]:
    print(f"🔍 '{s}':")
    for i, b in qidir(s):
        print(f"     {b:6.4f}  → [{i}] {data[i][:52]}")
    print()
```

**Natija:**

```
🔍 'shark attack beach':
     0.5345  → [0]  Most shark attacks occur about 10 feet from the bea
     0.0000  → [5] the gruff old man sat in the back of the bait shop g

🔍 'vampire blood':
     0.7071  → [2] carol drank the blood as if she were a vampire
     0.0000  → [5] the gruff old man sat in the back of the bait shop g

🔍 'old man fishing worms':
     0.5477  → [5] the gruff old man sat in the back of the bait shop g
     0.0000  → [4] the sign said there was road work ahead so he decide

🔍 'socks drawer':
     0.5774  → [1] the efficiency with which he paired the socks in the
     0.0000  → [5] the gruff old man sat in the back of the bait shop g
```

### 🎯 TO'RTTASI HAM TO'G'RI TOPILDI

```
'shark attack beach'    →  [0]  ✅  akulalar haqidagi jumla
'vampire blood'         →  [2]  ✅  vampir haqidagi jumla
'old man fishing worms' →  [5]  ✅  chol va qurtlar
'socks drawer'          →  [1]  ✅  paypoqlar va tortma
```

### 🔑 Nima uchun bu ishlaydi?

```
1 · So'rovni HAM TF-IDF ga aylantiramiz      tv.transform([sorov])
2 · Kosinus o'xshashligini hisoblaymiz       cosine_similarity(v, M)
3 · Eng yuqori ballni tanlaymiz              argsort()[::-1]
```

> ## 💡 **Google shu prinsipda boshlangan.** Zamonaviy qidiruv ancha murakkab, lekin **asos** — aynan shu: hujjatlarni vektorga aylantirib, so'rovga **eng yaqinini** topish.

⚠️ **`fishing` so'ziga e'tibor bering** — u hujjatda **yo'q** *(u yerda `bait shop` bor)*. Lekin `old`, `man`, `worms` yetarli bo'ldi. **Qidiruv qisman moslikda ham ishlaydi.**

---

## 3️⃣ Loyiha — Avtomatik kalit so'z ajratgich

**Maqsad:** Har bir hujjatning **eng muhim so'zlarini** avtomatik topish.

```python
def kalit_sozlar(i, n=4):
    """i-hujjatning eng yuqori TF-IDF ballli so'zlari."""
    r = pd.Series(M[i].toarray()[0], index=tv.get_feature_names_out())
    return r[r > 0].sort_values(ascending=False).head(n)


for i in range(6):
    print(f"[{i}] {list(kalit_sozlar(i).index)}")
    print(f"    {data[i][:64]}...")
    print()
```

**Natija:**

```
[0] ['10', 'attacks', 'beach', 'feet']
     Most shark attacks occur about 10 feet from the beach since th...

[1] ['admirable', 'drawer', 'efficiency', 'paired']
    the efficiency with which he paired the socks in the drawer was...

[2] ['blood', 'carol', 'drank', 'vampire']
    carol drank the blood as if she were a vampire...

[3] ['directions', 'giving', 'mountains', 'west']
[4] ['ahead', 'decided', 'road', 'said']
[5] ['bait', 'gruff', 'grumbling', 'handful']
```

### 🎯 Bu — HAQIQIY mahsulot

```
[0]  attacks · beach · feet          →  🦈 AKULA XAVFI
[1]  drawer · efficiency · paired    →  🧦 TARTIB
[2]  blood · vampire · carol         →  🧛 VAMPIR
[3]  directions · mountains · west   →  🧭 YO'L KO'RSATISH
[4]  ahead · road · decided          →  🚧 YO'L ISHLARI
[5]  bait · gruff · grumbling        →  🎣 QARMOQ DO'KONI
```

> ## ✅ **OLTITASI HAM to'g'ri.** Har bir hujjatning mavzusi kalit so'zlardan **darhol** ko'rinib turibdi — va `the`, `was`, `of` kabi so'zlar **birortasida ham yo'q**.

> ## 💡 **Hech kim modelga "shark muhim, the muhim emas" demadi.** TF-IDF buni **matematik yo'l bilan o'zi aniqladi**.

**Foydalanish:** maqola teglari, avtomatik xulosa, hujjat turkumlash, SEO kalit so'zlari.

---

## 4️⃣ Loyiha — Ijobiy va salbiy so'zlarni topish

**Maqsad:** 100 ta kitob sharhidan **qaysi so'zlar** yaxshi, **qaysilari** yomon sharhga xos ekanini aniqlash.

📁 [`data/book_reviews_sample.csv`](data/book_reviews_sample.csv)

```python
d = pd.read_csv("data/book_reviews_sample.csv")
d["clean"] = d["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())

tv2 = TfidfVectorizer(stop_words='english', max_features=500)
X = tv2.fit_transform(d["clean"])
print("Shakl:", X.shape, " Siyraklik:",
      f"{1 - X.nnz/(X.shape[0]*X.shape[1]):.1%}")

past = d[d["rating"] <= 2].index
yuqori = d[d["rating"] >= 4].index

A = np.asarray(X[past].mean(axis=0)).ravel()      # past reyting o'rtachasi
B = np.asarray(X[yuqori].mean(axis=0)).ravel()    # yuqori reyting o'rtachasi

farq = pd.Series(B - A, index=tv2.get_feature_names_out()).sort_values()

print("\n😞 PAST reytingga xos so'zlar:")
print("  ", list(farq.head(6).index))
print("\n😀 YUQORI reytingga xos so'zlar:")
print("  ", list(farq.tail(6).index[::-1]))
```

**Natija:**

```
Shakl: (100, 377)  Siyraklik: 98.1%

😞 PAST reytingga xos so'zlar:
   ['did', 'like', 'worth', 'short', 'really', 'money']

😀 YUQORI reytingga xos so'zlar:
   ['love', 'loved', 'great', 'series', 'enjoyed', 'books']
```

### 🎯 Ajratish MUKAMMAL ishladi

| 😞 Salbiy | Nima anglatadi |
|---|---|
| `did` | *"did not like"*, *"did not finish"* — **inkor** |
| `worth` | *"not worth the money"* |
| `short` | *"too short"* — kitob **qisqa** |
| `money` | **Pul** haqida gapirish = pushaymon |

| 😀 Ijobiy | Nima anglatadi |
|---|---|
| `love`, `loved` | To'g'ridan-to'g'ri **sevgi** |
| `great`, `enjoyed` | **Zavq** |
| `series`, `books` | ## **Davomini o'qimoqchi!** ⭐ |

> ## 💡 **`series` va `books` — eng kuchli signal.** Kitob yoqqan odam **seriyaning boshqa kitoblari** haqida gapiradi. Bu — **ehtimol eng ishonchli ijobiy ko'rsatkich**, va uni **hech kim qo'lda kiritmadi**.

⚠️ **`like` salbiy tomonda** — g'alati? Yo'q: `"did not like"` iborasining bir qismi. **Bag of words so'z tartibini ko'rmaydi** — mana shuning oqibati.

---

## 5️⃣ Loyiha — Takroriy sharhlarni aniqlash

**Maqsad:** Deyarli **bir xil** sharhlarni topish *(spam va soxta sharhlarga qarshi kurash)*.

```python
S = cosine_similarity(X)
np.fill_diagonal(S, 0)          # ⭐ o'zi bilan solishtirmaslik

i, j = np.unravel_index(S.argmax(), S.shape)
print(f"Eng o'xshash juftlik: {i} va {j}  (ball {S[i, j]:.4f})\n")
print(f"  [{i}] ({d['rating'][i]}⭐) {d['reviewText'][i][:70]}")
print(f"  [{j}] ({d['rating'][j]}⭐) {d['reviewText'][j][:70]}")
```

**Natija:**

```
Eng o'xshash juftlik: 11 va 32  (ball 0.6352)

  [11] (2⭐) I did not cared for this ebook. I did not finish this ebook.
  [32] (2⭐) I did not care for this ebook. I did not finish reading this
```

### 🎯 BU — DEYARLI BIR XIL SHARH!

```
[11]  "I did NOT CARED for this ebook. I did not finish this ebook."
[32]  "I did NOT CARE  for this ebook. I did not finish reading this"
             ↑
       Farq: "cared" / "care"  va  "reading"

Ikkalasi ham 2⭐. Ikkalasi ham deyarli AYNAN bir xil.
```

> ## 💡 **Bu — haqiqiy biznes muammosi.** Onlayn do'konlar **soxta sharhlarni** aynan shunday aniqlaydi: bir nechta akkaunt deyarli **bir xil matn** yozsa — bu **bot** yoki **to'langan sharh**.

### Yaxshilash — barcha shubhali juftliklar

```python
chegara = 0.4
juftlar = [(i, j, round(S[i, j], 4))
           for i in range(len(S)) for j in range(i + 1, len(S))
           if S[i, j] > chegara]
juftlar.sort(key=lambda x: -x[2])

print(f"{chegara} dan yuqori: {len(juftlar)} ta juftlik")
for i, j, b in juftlar[:5]:
    print(f"  {b}  [{i}]({d['rating'][i]}⭐) ↔ [{j}]({d['rating'][j]}⭐)")
```

**Natija:**

```
0.4 dan yuqori: 6 ta juftlik
  0.6352  [11](2⭐) ↔ [32](2⭐)
  0.5709  [38](1⭐) ↔ [72](3⭐)
  0.4345  [29](5⭐) ↔ [97](5⭐)
  0.4142  [37](5⭐) ↔ [97](5⭐)
  0.4022  [27](5⭐) ↔ [42](4⭐)
```

> 💡 **97-sharh IKKI marta ro'yxatda** *(29 va 37 bilan)* — ya'ni u **uchta** o'xshash sharh guruhining markazi. Haqiqiy tizimda bunday **klasterlar** alohida tekshiriladi.

---

## 6️⃣ Loyiha — Parametr tanlash yordamchisi

**Maqsad:** Turli sozlamalar **ustunlar soniga** qanday ta'sir qilishini ko'rish.

```python
sozlamalar = [
    ({}, "hech qanday sozlama"),
    ({"stop_words": "english"}, "to'xtatish so'zlarsiz"),
    ({"stop_words": "english", "max_features": 100}, "+ eng ko'p 100 ta"),
    ({"stop_words": "english", "min_df": 2}, "+ kamida 2 hujjatda"),
    ({"stop_words": "english", "ngram_range": (1, 2)}, "+ bigrammalar"),
]

print(f"{'SOZLAMA':28s} {'USTUN':>7s} {'SIYRAKLIK':>11s}")
print("-" * 48)
for kw, nom in sozlamalar:
    v = TfidfVectorizer(**kw)
    x = v.fit_transform(d["clean"])
    siy = 1 - x.nnz / (x.shape[0] * x.shape[1])
    print(f"{nom:28s} {x.shape[1]:7d} {siy:10.1%}")
```

**Natija:**

```
SOZLAMA                        USTUN   SIYRAKLIK
------------------------------------------------
hech qanday sozlama              504       97.1%
to'xtatish so'zlarsiz            377       98.1%
+ eng ko'p 100 ta                100       95.6%
+ kamida 2 hujjatda               97       95.5%
+ bigrammalar                    983       98.6%
```

### 🔑 Muvozanat

```
KO'P ustun   →  ko'proq ma'lumot,  lekin  SEKIN + KO'P XOTIRA + siyrak
KAM ustun    →  tez va zich,       lekin  ma'lumot YO'QOLADI

bigrammalar (983) →  "not good" bitta ustun bo'ladi,
                     lekin ustunlar 2.6 BARAVAR ko'paydi
```

### ⚠️ `min_df=2` — eng kuchli filtr

```
377  →  97 ustun    (74% o'chdi!)
```

Ya'ni **377 ta so'zdan 280 tasi FAQAT BITTA sharhda** uchraydi. Ular model uchun **deyarli foydasiz** — bitta misoldan o'rganib bo'lmaydi.

> ## 💡 **`min_df=2` ni deyarli har doim ishlating.** U shovqinni **keskin** kamaytiradi va deyarli hech narsa yo'qotmaydi.

> ## 💡 **Amaliy tavsiya:** `stop_words='english'` + `min_df=2` + `max_features=5000` — bu **ko'pchilik vazifa** uchun yaxshi boshlang'ich nuqta.

---

## 🎓 Yakuniy vazifa

Oltita loyihani **bitta hujjat qidiruv tizimiga** birlashtiring:

```
========= HUJJAT QIDIRUV TIZIMI =========
1 · Hujjatlarni yuklash va vektorlashtirish
2 · Qidirish
3 · Kalit so'zlarni ko'rsatish
4 · Ijobiy/salbiy so'zlarni topish
5 · Takroriylarni aniqlash
6 · Parametrlarni sozlash
0 · Chiqish
```

<details>
<summary>💡 Karkas</summary>

```python
class QidiruvTizimi:
    def __init__(self, hujjatlar):
        self.hujjatlar = hujjatlar
        self.tv = TfidfVectorizer(stop_words='english')
        self.M = self.tv.fit_transform(hujjatlar)

    def qidir(self, sorov, n=3):
        v = self.tv.transform([sorov])
        b = cosine_similarity(v, self.M)[0]
        return [(int(i), round(float(b[i]), 4))
                for i in b.argsort()[::-1][:n] if b[i] > 0]

    def kalit_sozlar(self, i, n=5):
        r = pd.Series(self.M[i].toarray()[0],
                      index=self.tv.get_feature_names_out())
        return list(r[r > 0].sort_values(ascending=False).head(n).index)

    def takroriylar(self, chegara=0.5):
        S = cosine_similarity(self.M)
        np.fill_diagonal(S, 0)
        return [(i, j, round(S[i, j], 4))
                for i in range(len(S)) for j in range(i + 1, len(S))
                if S[i, j] > chegara]


qt = QidiruvTizimi(data)
print(qt.qidir("shark beach"))
print(qt.kalit_sozlar(0))
print(qt.takroriylar(0.1))
```

</details>

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md)
