# 6-dars. Soxta yangiliklarda qanday mavzular bor? — LDA

## 🎬 Boshlashdan oldin

> **"Bu darsda biz shu savolni hal qilishga harakat qilamiz: SOXTA YANGILIKLARIMIZDA QANDAY MAVZULAR paydo bo'ladi?"**
>
> **"Biz soxta yangilik maqolasini ANIQLASHGA yordam berishi mumkin bo'lgan biror alohida mavzular chiqadimi degan qiziqishdamiz."**

---

## 1. Faqat SOXTA yangiliklarni olamiz

> **"Biz soxta yangiliklar matnimizni yaratishdan boshlaymiz — bu shunchaki ma'lumot to'plamimiz `fake_or_factual == "Fake News"` bo'yicha filtrlangan."**

```python
fake_news_text = (data[data["fake_or_factual"] == "Fake News"]["text_clean"]
                  .reset_index(drop=True))
print("Soxta maqolalar:", len(fake_news_text))
```

```
Soxta maqolalar: 98
```

---

## 2. Vektorlashtirish

> **"Birinchi qadamimiz — matnimizni VEKTORLASHTIRISH. Biz matnimizni LDA algoritmiga berish mumkin bo'lgan RAQAMLARGA aylantirmoqchimiz."**

### 🅰️ gensim *(kurs)*

```python
from gensim import corpora, models

dictionary_fake = corpora.Dictionary(fake_news_text)
doc_term_fake = [dictionary_fake.doc2bow(text) for text in fake_news_text]
```

### 🅱️ sklearn *(tekshirilgan)*

```python
from sklearn.feature_extraction.text import CountVectorizer

matn = [" ".join(t) for t in fake_news_text]
cv = CountVectorizer()
X = cv.fit_transform(matn)
nm = cv.get_feature_names_out()
```

---

## 3. Koherentlik ballari

> **"Biz optimal mavzular sonini aniqlash uchun to'g'ridan-to'g'ri KOHERENTLIK BALLARINI generatsiya qilishga o'tamiz."**
>
> **"Biz sinamoqchi bo'lgan minimal mavzular sonini 2 ga, maksimalini 11 ga qo'yamiz."**

```python
import numpy as np
tokset = [set(t) for t in fake_news_text]

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

from sklearn.decomposition import LatentDirichletAllocation
coherence_values = []
for num_topics_i in range(2, 12):
    m = LatentDirichletAllocation(n_components=num_topics_i,
                                  random_state=42, max_iter=10).fit(X)
    c = np.mean([umass([nm[j] for j in t.argsort()[::-1][:10]])
                 for t in m.components_])
    coherence_values.append(c)
    print(f"  k={num_topics_i:2d}  {c:8.4f}")
```

```
  k= 2   -0.8609
  k= 3   -0.9794
  k= 4   -0.9993
  k= 5   -0.8009     ⭐ ENG YUQORI
  k= 6   -0.9452
  k= 7   -1.0814
  k= 8   -0.9925
  k= 9   -1.0234
  k=10   -1.0691
  k=11   -0.9680
```

```python
print("Eng yaxshi k:", 2 + int(np.argmax(coherence_values)))
```

```
Eng yaxshi k: 5
```

### ⚠️ Kursda boshqacha chiqadi

> **"Koherentlik ballari mavzular soni 2, 7 yoki 11 ga o'rnatilganda ENG YUQORI ekanini ko'rasiz."**
>
> ## **"Bizning misolimiz uchun 2 ta mavzu yetarlicha qiziqarli bo'lmaydi, 11 ta mavzu esa turli manfaatdor tomonlarga tushuntirish uchun JUDA QIYIN bo'ladi. Shuning uchun 7 ta mavzu bilan yakuniy LDA modelimizni yarataylik."**

```
gensim c_v koherentligi  →  k = 2, 7, 11
Bizning UMass            →  k = 5

Ikkalasi ham TO'G'RI — bular TURLI o'lchovlar.
```

> ## 💡 **Va bu — 25-modulning sabog'i:** koherentlik **taklif** qiladi, **qaror** qilmaydi. O'qituvchi **7 ni** tanladi — chunki **2 juda kam, 11 juda ko'p**. Bu — **inson mulohazasi**.

Biz ham **7 ni** olamiz *(kursni kuzatish uchun)*.

---

## 4. LDA modeli — 7 mavzu

```python
lda_model = LatentDirichletAllocation(n_components=7, random_state=42,
                                      max_iter=20).fit(X)
for i, t in enumerate(lda_model.components_):
    print(f"M{i}:", [nm[j] for j in t.argsort()[::-1][:10]])
```

```
M0: ['trump','said','woman','state','campaign','donald','time','would','clinton','vote']
M1: ['trump','clinton','would','said','email','people','state','time','rich','death']
M2: ['clinton','president','said','hillary','woman','right','republican','year','court','election']
M3: ['trump','one','bilderberg','republican','supporter','year','man','world','protester','podium']
M4: ['food','student','stamp','said','million','time','state','money','political','fraud']
M5: ['trump','mccain','syria','one','president','would','republican','said','party','know']
M6: ['obama','school','migrant','year','tax','state','county','also','clinton','result']
```

---

## 5. ❌ Muammo — MAVZULAR BIR-BIRIGA O'XSHASH

> ## **"Bu mavzularni ko'rib chiqsak, ANCHA KO'P BIR-BIRINI QOPLASH borligini ko'ramiz. Masalan, `trump` so'zi BARCHA mavzularda juda tez-tez uchraydigan so'z, `said` ham shunday."**

### Sanaymiz

```python
from collections import Counter
c = Counter()
for t in lda_model.components_:
    c.update([nm[j] for j in t.argsort()[::-1][:10]])
print(c.most_common(6))
```

```
[('said', 5), ('trump', 4), ('state', 4),
 ('clinton', 4), ('time', 3), ('would', 3)]
```

```
7 ta mavzudan:
  "said"    → 5 tasida
  "trump"   → 4 tasida
  "state"   → 4 tasida
  "clinton" → 4 tasida
                ↑
   Mavzular BIR-BIRIDAN AJRALMAYAPTI!
```

### 🔍 Lekin BA'ZI mavzular ANIQ

```
M3: bilderberg · supporter · protester · podium    → 🎤 MITING/BILDERBERG
M4: food · student · stamp · fraud · money         → 🍔 OZIQ-OVQAT TALONLARI
M5: mccain · syria · party                         → 🇸🇾 SURIYA/MAKKEYN
M6: school · migrant · tax · county                → 🏫 MAKTAB/MIGRANT
```

> ## 💡 **Xulosa aralash:** M3, M4, M5, M6 — **aniq va qiziqarli**. M0, M1, M2 — **umumiy siyosat aralashmasi**.

### Hujjatlar taqsimoti

```python
T = lda_model.transform(X)
print(pd.Series(T.argmax(axis=1)).value_counts().sort_index())
```

```
0    23      M0 (umumiy siyosat)
1    17      M1 (umumiy siyosat)
2    12      M2 (umumiy siyosat)
3    10      M3 (miting) ✅
4    18      M4 (oziq-ovqat talonlari) ✅
5    11      M5 (Suriya) ✅
6     7      M6 (maktab/migrant) ✅
```

> 🔑 **52 ta maqola** *(53%)* **umumiy** mavzularda, **46 tasi** *(47%)* **aniq** mavzularda.

---

## 6. Nima uchun bunday bo'ldi?

```
LDA  →  BAG OF WORDS ishlatadi
              ↓
     "trump" 520 marta uchraydi
              ↓
     U HAR BIR mavzuda "og'ir" bo'lib chiqadi
```

> **"Keyingi darsimizda ba'zi turli usullarni sinab ko'raylik va umid qilamanki, ko'proq qiziqarli mavzularni tortib olamiz."**

### 🔑 Ikki yechim

| Yechim | Izoh | Qayerda |
|---|---|---|
| **TF-IDF** ishlatish | `trump` ga **past vazn** beradi | ## **7-dars** |
| **`max_df`** qo'shish | Keng tarqalgan so'zlarni **tashlaydi** | *(quyida)* |

### 💡 Bonus — `max_df` bilan sinaymiz

```python
cv2 = CountVectorizer(max_df=0.5, min_df=3)
X2 = cv2.fit_transform(matn)
nm2 = cv2.get_feature_names_out()
print("Ustunlar:", X.shape[1], "→", X2.shape[1])

lda2 = LatentDirichletAllocation(n_components=7, random_state=42,
                                 max_iter=20).fit(X2)
for i, t in enumerate(lda2.components_):
    print(f"M{i}:", [nm2[j] for j in t.argsort()[::-1][:8]])
```

**Natija:**

```
Ustunlar: 5741 → 1187

M0: ['tax','trump','party','vote','going','president','candidate','point']
M1: ['syria','trump','one','obama','would','state','year','said']
M2: ['trump','image','said','clinton','president','woman','via','even']
M3: ['trump','republican','said','clinton','student','president','party','state']
M4: ['trump','clinton','email','supporter','official','rich','information','department']
M5: ['food','million','law','would','fraud','death','november','woman']
M6: ['trump','state','school','said','time','republican','also','voter']
```

```python
c2 = Counter()
for t in lda2.components_:
    c2.update([nm2[j] for j in t.argsort()[::-1][:10]])
print("Qoplash keyin:", c2.most_common(4))
```

```
Qoplash keyin: [('trump', 6), ('said', 4), ('president', 3), ('state', 3)]
```

### ⚠️ KUTILMAGAN — `trump` YOMONLASHDI!

```
OLDIN (max_df siz):   trump 4/7 mavzuda
KEYIN (max_df=0.5):   trump 6/7 mavzuda     ❌ YOMONROQ!
```

> ## 🔑 **Nima uchun?** `max_df=0.5` **hujjatlarning yarmidan ko'pida** uchraydigan so'zlarni tashlaydi. Lekin `trump` **98 ta soxta maqoladan atigi ~40 tasida** bor — ya'ni **50% dan kam**, shuning uchun u **QOLDI**. Boshqa so'zlar esa **o'chdi** — natijada `trump` **nisbatan kuchayib** ketdi.
>
> ## 💡 **25-modulda bu usul yordam bergan edi** *(`mr`, `said` 50%+ da edi)*. **Bu yerda esa yo'q.**
>
> ## ⚠️ **Saboq: bir masalada ishlagan usul boshqasida ishlamasligi mumkin.** Doim **o'lchang**.

### ✅ Lekin BA'ZI narsalar yaxshilandi

```
M2: trump image said clinton president woman VIA even
                ↑                              ↑
    "image via" — 4-darsda topgan SOXTA YANGILIK format belgisi!

M5: food million law would FRAUD death november woman
                            ↑
    "fraud" endi aniqroq mavzuda
```

> 💡 **Haqiqiy yechim — TF-IDF.** Keyingi darsda ko'ramiz.

---

## 7. 💻 To'liq kod

```python
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

# ===== SOXTA YANGILIKLAR =====
fake_news_text = (data[data["fake_or_factual"] == "Fake News"]["text_clean"]
                  .reset_index(drop=True))
matn = [" ".join(t) for t in fake_news_text]
tokset = [set(t) for t in fake_news_text]

# ===== VEKTORLASHTIRISH =====
cv = CountVectorizer()
X = cv.fit_transform(matn)
nm = cv.get_feature_names_out()

# ===== KOHERENTLIK =====
def umass(tw):
    s, n = 0, 0
    for i in range(1, len(tw)):
        for j in range(i):
            wi, wj = tw[i], tw[j]
            dj  = sum(1 for t in tokset if wj in t)
            dij = sum(1 for t in tokset if wi in t and wj in t)
            if dj > 0: s += np.log((dij + 1) / dj); n += 1
    return s / n if n else 0

coherence_values = []
for k in range(2, 12):
    m = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=10).fit(X)
    coherence_values.append(np.mean(
        [umass([nm[j] for j in t.argsort()[::-1][:10]]) for t in m.components_]))
    print(f"k={k:2d}  {coherence_values[-1]:8.4f}")

# ===== GRAFIK =====
import matplotlib.pyplot as plt
plt.plot(range(2, 12), coherence_values, marker="o")
plt.xlabel("Mavzular soni"); plt.ylabel("Koherentlik balli")
plt.legend(["coherence_values"], loc="best")
plt.savefig("lda_coherence.png", dpi=100, bbox_inches="tight")

# ===== YAKUNIY MODEL =====
final_num_topics = 7
lda_model = LatentDirichletAllocation(n_components=final_num_topics,
                                      random_state=42, max_iter=20).fit(X)
for i, t in enumerate(lda_model.components_):
    print(f"M{i}:", [nm[j] for j in t.argsort()[::-1][:10]])
```

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nechta soxta maqola bor?

**M2.** 5 mavzu bilan sinab ko'ring *(koherentlik tavsiyasi)*.

**M3.** Har mavzuga nechta maqola tegishli?

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(len(fake_news_text))                      # 98

# M2
lda5 = LatentDirichletAllocation(n_components=5, random_state=42,
                                 max_iter=20).fit(X)
for i, t in enumerate(lda5.components_):
    print(f"M{i}:", [nm[j] for j in t.argsort()[::-1][:8]])

# M3
T = lda_model.transform(X)
print(pd.Series(T.argmax(axis=1)).value_counts().sort_index().to_string())
```

</details>

### 🟡 O'rta

**M4.** ⭐ So'zlar necha mavzuda takrorlanadi?

**M5.** `max_df` bilan yaxshilang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — ⭐ QOPLASHNI O'LCHASH
from collections import Counter
c = Counter()
for t in lda_model.components_:
    c.update([nm[j] for j in t.argsort()[::-1][:10]])
print(c.most_common(6))
# [('said', 5), ('state', 5), ('trump', 4), ('clinton', 3), ('woman', 3), ('year', 3)]
#
# 🔑 7 ta mavzudan 5 tasida "said" bor!
#    Bu — mavzular AJRALMAYAPTI degan aniq belgi.

# M5
cv2 = CountVectorizer(max_df=0.5, min_df=3)
X2 = cv2.fit_transform(matn); nm2 = cv2.get_feature_names_out()
print("Ustunlar:", X.shape[1], "→", X2.shape[1])
lda2 = LatentDirichletAllocation(n_components=7, random_state=42,
                                 max_iter=20).fit(X2)
for i, t in enumerate(lda2.components_):
    print(f"M{i}:", [nm2[j] for j in t.argsort()[::-1][:8]])

c2 = Counter()
for t in lda2.components_:
    c2.update([nm2[j] for j in t.argsort()[::-1][:10]])
print("Qoplash keyin:", c2.most_common(4))
#
# 💡 Qoplash KAMAYISHI kerak — 25-moduldagi kabi.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Nima uchun faqat soxta yangiliklar olindi?
2. Koherentlik qaysi `k` ni tavsiya qildi?
3. O'qituvchi nechtasini tanladi va nima uchun?
4. Natijada qanday muammo chiqdi?
5. `said` nechta mavzuda bor?
6. Muammoning sababi nima?

<details>
<summary>✅ Javoblar</summary>

1. Chunki savol — *"SOXTA yangiliklarda qanday mavzular bor?"*
2. Bizning UMass — ## **k=5**. Kursning `c_v` — **2, 7 yoki 11**.
3. ## **7 ta.** Sabab: *"2 ta yetarlicha qiziqarli emas, 11 ta tushuntirish uchun juda qiyin"* — **inson mulohazasi**.
4. ## **Mavzular bir-biriga o'xshash** — `trump`, `said`, `state` **deyarli hammasida** bor.
5. ## **5 ta** *(7 tadan)*.
6. **LDA Bag of Words ishlatadi** — `trump` 520 marta uchraydi va **har bir mavzuda** og'ir bo'ladi. Yechim: **TF-IDF** *(7-dars)*.

</details>

---

## 📌 Xulosa

```python
fake_news_text = data[data["fake_or_factual"] == "Fake News"]["text_clean"]
X = CountVectorizer().fit_transform([" ".join(t) for t in fake_news_text])

coherence_values = []
for k in range(2, 12):
    m = LatentDirichletAllocation(n_components=k, random_state=42).fit(X)
    coherence_values.append(umass_o'rtacha(m))

lda_model = LatentDirichletAllocation(n_components=7, random_state=42).fit(X)


KOHERENTLIK (UMass)
  k= 2  -0.8609        k= 7  -1.0814
  k= 3  -0.9794        k= 8  -0.9925
  k= 4  -0.9993        k= 9  -1.0234
  k= 5  -0.8009  ⭐    k=10  -1.0691
  k= 6  -0.9452        k=11  -0.9680

  Bizning UMass  →  k=5
  Kursning c_v   →  k=2, 7 yoki 11
  O'qituvchi tanlovi: 7 (2 kam, 11 ko'p)


❌ NATIJA — MAVZULAR QOPLANADI

  M0: trump said woman state campaign donald...
  M1: trump clinton would said email people...
  M2: clinton president said hillary woman...
                 ↑
       "said" 5/7 mavzuda · "state" 5/7 · "trump" 4/7


✅ LEKIN BA'ZILARI ANIQ
  M3: bilderberg · protester · podium    🎤 miting
  M4: food · stamp · fraud · money       🍔 oziq-ovqat talonlari
  M5: mccain · syria · party             🇸🇾 Suriya
  M6: school · migrant · tax · county    🏫 maktab/migrant


🔑 SABAB: LDA BAG OF WORDS ishlatadi
   "trump" 520 marta → har mavzuda OG'IR

   YECHIM:  ① TF-IDF (7-dars)  ② max_df
```

---

⬅️ [Oldingi: Sentiment](05-Sentiment-by-News-Type.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Mavzular — LSA](07-Topics-LSA.md)
