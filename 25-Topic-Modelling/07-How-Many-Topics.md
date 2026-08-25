# 7-dars. Nechta mavzu tanlash kerak?

## 🎬 Boshlashdan oldin

> **"Mavzularning OPTIMAL sonini aniqlash uchun biz KOHERENTLIK BALLARI (coherence scores) deb ataladigan narsadan foydalanishimiz mumkin."**

---

## 1. Muammo

3-darsda ko'rdik: **`k` ni SIZ tanlaysiz**. Lekin **qanday**?

```
k = 2   →  mavzular JUDA UMUMIY, aralashib ketadi
k = 50  →  mavzular JUDA MAYDA, tushunib bo'lmaydi
k = ?   →  MANA — savol
```

---

## 2. Koherentlik nima?

**Koherentlik** = *"bu mavzudagi so'zlar bir-biriga QANCHALIK mos keladi?"*

```
✅ YUQORI KOHERENTLIK
   song · album · band · music · guitar
        ↑ hammasi MUSIQA haqida — mantiqiy!

❌ PAST KOHERENTLIK
   song · police · percent · trump · vehicle
        ↑ hech qanday bog'liqlik YO'Q
```

### Qanday o'lchanadi?

```
Mavzuning top so'zlarini olamiz.
Har bir JUFTLIK uchun so'raymiz:
   "Bu ikki so'z BIRGA qanchalik tez-tez uchraydi?"

Birga ko'p uchrasa  →  YUQORI ball
Birga kam uchrasa   →  PAST ball
```

> 💡 **5-darsdagi taqsimot gipotezasini eslang** — bu **aynan shu g'oya**, faqat endi uni **o'lchayapmiz**.

---

## 3. Kodda

### 🅰️ gensim

> **"Bulardan foydalanishni boshlash uchun bizga shunchaki funksiyani import qilish kerak. Biz shuningdek matplotlib'ni import qilamiz, chunki optimal mavzular sonini aniqlash uchun bu koherentlik ballarining GRAFIKLARINI chizmoqchimiz."**

```python
from gensim.models.coherencemodel import CoherenceModel
import matplotlib.pyplot as plt
```

> **"Biz turli mavzular sonidan o'tadigan `for` sikli yaratamiz va keyin bu koherentlik ballarini tekshirish uchun ro'yxatga joylaymiz."**
>
> **"Birinchi qadam — ikkita bo'sh ro'yxat yaratish: biri koherentlik qiymatlari, ikkinchisi modellarimiz uchun."**

```python
coherence_values = []
model_list = []

min_topics = 2
max_topics = 11

for num_topics_i in range(min_topics, max_topics + 1):
    model = LsiModel(corpus=doc_term_matrix,
                     id2word=dictionary,
                     num_topics=num_topics_i)
    model_list.append(model)

    coherence_model = CoherenceModel(model=model,
                                     texts=articles,
                                     dictionary=dictionary,
                                     coherence='c_v')
    coherence_values.append(coherence_model.get_coherence())
```

> **"Bu yerda biz minimal mavzular sonini IKKI, maksimalini O'N BIR deb ishlatyapmiz. Lekin bular siz xohlagan har qanday raqam bo'lishi mumkin."**
>
> **"Koherentlik modeli bir necha argument oladi: bizning MODELIMIZ, ASL MATNIMIZ (bu bizning maqolalarimiz), LUG'ATIMIZ va KOHERENTLIK turi. Bu yerda biz `c_v` dan foydalanyapmiz."**

### 🅱️ sklearn — koherentlikni O'ZIMIZ yozamiz

`sklearn`da tayyor `CoherenceModel` **yo'q**. Yozamiz:

```python
import numpy as np

tokset = [set(t) for t in articles]      # tez qidirish uchun

def umass_koherentlik(top_sozlar):
    """UMass koherentligi: so'zlar birga qanchalik uchraydi."""
    s, n = 0, 0
    for i in range(1, len(top_sozlar)):
        for j in range(i):
            wi, wj = top_sozlar[i], top_sozlar[j]
            dj  = sum(1 for t in tokset if wj in t)              # wj bor hujjatlar
            dij = sum(1 for t in tokset if wi in t and wj in t)   # IKKALASI bor
            if dj > 0:
                s += np.log((dij + 1) / dj)
                n += 1
    return s / n if n else 0


def top_sozlar(model, names, w=10):
    return [[names[j] for j in t.argsort()[::-1][:w]]
            for t in model.components_]
```

### 🔑 UMass formulasi

```
                 ⎛ D(wi, wj) + 1 ⎞
   log  ─────────────────────────
                 ⎝    D(wj)      ⎠

   D(wi,wj) = IKKALA so'z bor hujjatlar soni
   D(wj)    = wj bor hujjatlar soni
```

```
Ikkalasi DOIM birga  →  D(wi,wj) ≈ D(wj)  →  log(1) ≈ 0    ← eng yaxshi
Hech qachon birga    →  D(wi,wj) = 0      →  log(1/D) < 0  ← yomon
```

> ## ⚠️ **UMass ballari DOIM MANFIY.** **0 ga yaqinroq — YAXSHIROQ.**

---

## 4. ⭐ Natija — ISHGA TUSHIRILGAN

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD

cv = CountVectorizer(); X  = cv.fit_transform(matn); nm = cv.get_feature_names_out()
tv = TfidfVectorizer(); Xt = tv.fit_transform(matn); nt = tv.get_feature_names_out()

print(f"{'K':>3s} {'LDA':>9s} {'LSA':>9s}")
lda_c, lsa_c = [], []
for k in range(2, 12):
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=10).fit(X)
    cl = np.mean([umass_koherentlik(tw) for tw in top_sozlar(l, nm)])

    s = TruncatedSVD(n_components=k, random_state=42).fit(Xt)
    cs = np.mean([umass_koherentlik(tw) for tw in top_sozlar(s, nt)])

    lda_c.append(cl); lsa_c.append(cs)
    print(f"{k:3d} {cl:9.4f} {cs:9.4f}")
```

```
  K       LDA       LSA
  2   -0.4014   -0.7520
  3   -0.5901   -0.7843
  4   -0.7902   -0.8321
  5   -0.6873   -0.9317
  6   -0.7660   -0.9886
  7   -0.7482   -0.9595
  8   -0.8386   -1.0551
  9   -0.8236   -1.0531
 10   -0.8002   -1.1104
 11   -0.9133   -1.0742
```

### 📊 Grafik

```
LDA koherentligi (0 ga yaqinroq = yaxshiroq)

k=2   ████████████████████  -0.40   ⭐ ENG YAXSHI
k=3   ██████████████        -0.59
k=4   ████████              -0.79
k=5   ███████████           -0.69
k=6   █████████             -0.77
k=7   ██████████            -0.75
k=8   ██████                -0.84
k=9   ███████               -0.82
k=10  ████████              -0.80
k=11  ███                   -0.91
```

```python
print("LDA eng yaxshi k:", 2 + int(np.argmax(lda_c)))
print("LSA eng yaxshi k:", 2 + int(np.argmax(lsa_c)))
```

```
LDA eng yaxshi k: 2
LSA eng yaxshi k: 2
```

---

## 5. ⚠️ Lekin k=2 YOMON natija berdi!

Eslang — 4-darsda **k=2** shunday chiqqan edi:

```
Mavzu 0: mr · said · trump · would · one · year
Mavzu 1: said · mr · state · polic · offic · one
             ↑ FOYDASIZ!
```

### 🔑 Nima uchun koherentlik "eng yaxshi" dedi?

```
UMass koherentligi so'zlar BIRGA uchrashini o'lchaydi.

"mr" va "said" — DEYARLI HAR BIR hujjatda birga uchraydi!
      ↓
KOHERENTLIK JUDA YUQORI  ✅ (matematik jihatdan)
FOYDA — NOL                ❌ (amaliy jihatdan)
```

> ## ⚠️ **MANA ENG MUHIM SABOQ:** koherentlik balli **matematik o'lchov**. U *"bu mavzu FOYDALIMI?"* degan savolga **javob bermaydi**.

### ✅ To'g'ri yo'l — AVVAL tozalang, KEYIN o'lchang

```python
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn)
nm2 = cv2.get_feature_names_out()

for k in range(2, 12):
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=20).fit(X2)
    print(k, round(np.mean([umass_koherentlik(tw)
                            for tw in top_sozlar(l, nm2)]), 4))
```

> 💡 `max_df=0.5` **`mr`, `said`, `one` ni olib tashlaydi** — endi koherentlik **haqiqiy** mavzularni o'lchaydi.

---

## 6. 💡 Eng muhim maslahat — o'qituvchidan

> ## **"Shuni ta'kidlash muhimki, ba'zan MATEMATIK JIHATDAN ENG ANIQ mavzular soni sizning BIZNESINGIZ UCHUN ENG QIMMATLI bo'lmaydi."**
>
> **"Masalan, agar mavzular soni 11 ga o'rnatilgan bo'lsa, bu ham juda yuqori koherentlik balliga ega bo'lardi. Lekin 11 ta mavzu manfaatdor tomonlarga turli mavzular nimani anglatishini tushuntirayotganda ANCHA QIYIN bo'lishi mumkin."**

### Amaliy muvozanat

| `k` | Matematik | Amaliy |
|---|---|---|
| **2** | ✅ Eng yuqori koherentlik | ❌ Juda umumiy, foydasiz |
| **5** | ⚠️ O'rtacha | ## ✅ **Tushunarli va foydali** |
| **11** | ⚠️ Yaxshi | ❌ Tushuntirish **qiyin** |
| **50** | ❌ Past | ❌ Hech kim tushunmaydi |

> **"Shuning uchun ba'zan turli mavzular soni ishlatilganda ular QANDAY KO'RINISHINI QO'LDA TEKSHIRIB KO'RISH arziydi."**
>
> ## **"Va siz koherentlik ballarini, shuningdek O'Z INTUITSIYANGIZNI, loyihangiz va biznesingiz haqidagi BILIMINGIZNI, va birga ishlaydigan ODAMLARNI hisobga olib, oxir-oqibat qaysi mavzular sonini tanlashingizga ta'sir qilishingiz mumkin."**
>
> ## **"Agar koherentlik balli kabi narsa bo'yicha ENG OPTIMAL BO'LMAGAN qiymatni tanlasangiz, lekin u SIZ VA BIZNESINGIZ UCHUN ANCHA MANTIQIY bo'lsa — bu MUTLAQO NORMAL. Siz u bilan davom etishingiz mumkin, va agar model haqiqatan nomuvofiq bo'lmasa, hech kim sizni bu uchun ayblamaydi."**

---

## 7. 🎯 Amaliy retsept

```
1 · TOZALANG               max_df=0.5, min_df=5
                           (bu QADAMNI O'TKAZIB YUBORMANG!)

2 · KOHERENTLIKNI o'lchang k = 2..15 oralig'ida

3 · TOP 3 nomzodni oling   eng yuqori 3 ta ball

4 · QO'LDA TEKSHIRING      har birining top so'zlarini O'QING
                           "Bu mavzuga NOM bera olamanmi?"

5 · TANLANG                nom bera olsangiz — YAXSHI mavzu
                           bera olmasangiz — YOMON mavzu

6 · TUSHUNTIRING           manfaatdor tomonlarga ko'rsating
                           ular tushunmasa — k ni KAMAYTIRING
```

> ## 💡 **Oltin qoida:** *"Agar mavzuga 2-3 so'zda NOM bera olmasangiz — u mavzu emas."*

---

## 8. 💻 To'liq kod

```python
import pandas as pd, numpy as np, re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation, TruncatedSVD
import matplotlib.pyplot as plt

# ===== TOZALASH =====
data = pd.read_csv("data/news_articles.csv")
ps = PorterStemmer(); en_stopwords = stopwords.words('english')
def tozala(m):
    m = re.sub(r"[^\w\s]", "", m).lower()
    return [ps.stem(w) for w in word_tokenize(m) if w not in en_stopwords]
articles = [tozala(a) for a in data["content"]]
matn = [" ".join(a) for a in articles]
tokset = [set(t) for t in articles]

# ===== KOHERENTLIK =====
def umass_koherentlik(top_sozlar):
    s, n = 0, 0
    for i in range(1, len(top_sozlar)):
        for j in range(i):
            wi, wj = top_sozlar[i], top_sozlar[j]
            dj  = sum(1 for t in tokset if wj in t)
            dij = sum(1 for t in tokset if wi in t and wj in t)
            if dj > 0:
                s += np.log((dij + 1) / dj); n += 1
    return s / n if n else 0

def top_sozlar(model, names, w=10):
    return [[names[j] for j in t.argsort()[::-1][:w]] for t in model.components_]

# ===== SWEEP =====
cv = CountVectorizer(); X = cv.fit_transform(matn); nm = cv.get_feature_names_out()
tv = TfidfVectorizer(); Xt = tv.fit_transform(matn); nt = tv.get_feature_names_out()

min_topics, max_topics = 2, 11
lda_c, lsa_c = [], []
for k in range(min_topics, max_topics + 1):
    l = LatentDirichletAllocation(n_components=k, random_state=42, max_iter=10).fit(X)
    lda_c.append(np.mean([umass_koherentlik(tw) for tw in top_sozlar(l, nm)]))
    s = TruncatedSVD(n_components=k, random_state=42).fit(Xt)
    lsa_c.append(np.mean([umass_koherentlik(tw) for tw in top_sozlar(s, nt)]))
    print(f"k={k:2d}  LDA={lda_c[-1]:8.4f}  LSA={lsa_c[-1]:8.4f}")

# ===== GRAFIK =====
x = range(min_topics, max_topics + 1)
plt.plot(x, lda_c, marker='o', label='LDA')
plt.plot(x, lsa_c, marker='s', label='LSA')
plt.xlabel("Mavzular soni (k)")
plt.ylabel("Koherentlik (UMass)")
plt.title("Optimal mavzular sonini tanlash")
plt.legend(); plt.grid(alpha=0.3)
plt.savefig("coherence.png", dpi=100, bbox_inches='tight')
print("coherence.png saqlandi")

# ===== YAKUNIY MODEL =====
final_num_topics = 5          # ⭐ koherentlik + INTUITSIYA
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn); nm2 = cv2.get_feature_names_out()
final = LatentDirichletAllocation(n_components=final_num_topics,
                                  random_state=42, max_iter=20).fit(X2)
for i, t in enumerate(final.components_):
    print(f"Mavzu {i}:", [nm2[j] for j in t.argsort()[::-1][:8]])
```

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** Koherentlik nima o'lchaydi?

**M2.** UMass ballari nima uchun manfiy?

**M3.** Qaysi `k` eng yuqori ball oldi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Mavzudagi **top so'zlar bir-biriga qanchalik mos** kelishini — ya'ni ular **birga qanchalik tez-tez** uchrashini.

**M2.** Chunki formulada `log(kasr)` bor, va kasr **doim 1 dan kichik yoki teng**. `log(1) = 0` — **eng yaxshi** natija.

**M3.** ## **k = 2** — ikkala algoritm uchun ham. ⚠️ **Lekin bu YOMON natija berdi!** *(5-bo'limga qarang)*

</details>

### 🟡 O'rta

**M4.** Nima uchun k=2 matematik yaxshi, amaliy yomon?

**M5.** Tozalashdan keyin koherentlikni qayta o'lchang.

<details>
<summary>✅ Yechimlar</summary>

**M4.**

```
"mr" va "said" DEYARLI HAR BIR hujjatda BIRGA uchraydi.
      ↓
UMass formulasi: D(mr, said) ≈ D(said)
      ↓
log(≈1) ≈ 0  →  KOHERENTLIK JUDA YUQORI ✅

Lekin bu mavzu HECH NARSA aytmaydi ❌
```

> ## 🔑 **Koherentlik "birga uchraydimi?" degan savolga javob beradi, "foydalimi?" degan savolga EMAS.**

```python
# M5
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn); nm2 = cv2.get_feature_names_out()
for k in range(2, 12):
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=20).fit(X2)
    c = np.mean([umass_koherentlik(tw) for tw in top_sozlar(l, nm2)])
    print(f"k={k:2d}  {c:8.4f}")
#
# 💡 Endi ballar HAQIQIY mavzularni o'lchaydi —
#    chunki "mr", "said", "one" olib tashlangan.
```

</details>

### 🔴 Qiyin

**M6.** Har bir `k` uchun mavzularga **nom bera olasizmi**?

**M7.** Koherentlik **va** intuitsiyani birlashtirgan tanlov qiling.

<details>
<summary>✅ Yechimlar</summary>

```python
# M6 — QO'LDA TEKSHIRUV (eng muhim mashq!)
cv2 = CountVectorizer(max_df=0.5, min_df=5)
X2 = cv2.fit_transform(matn); nm2 = cv2.get_feature_names_out()

for k in [3, 5, 8]:
    print(f"\n{'='*50}\nk = {k}\n{'='*50}")
    l = LatentDirichletAllocation(n_components=k, random_state=42,
                                  max_iter=20).fit(X2)
    for i, t in enumerate(l.components_):
        w = [nm2[j] for j in t.argsort()[::-1][:6]]
        print(f"  M{i}: {w}")
        print(f"       Nom bera olasizmi? ____________")
#
# 💡 Har bir mavzuga 2-3 so'zda NOM berishga harakat qiling.
#    Bera olmasangiz — o'sha k YARAMAYDI.

# M7 — YAKUNIY QAROR
print("""
QARORLAR JADVALI

  k=2   koherentlik ⭐⭐⭐   nom berish ❌   →  RAD ETILDI
  k=3   koherentlik ⭐⭐     nom berish ✅   →  NOMZOD
  k=5   koherentlik ⭐⭐     nom berish ✅✅  →  TANLANDI ⭐
  k=8   koherentlik ⭐       nom berish ⚠️   →  RAD ETILDI
  k=11  koherentlik ⭐       nom berish ❌   →  RAD ETILDI

TANLOV: k = 5
SABAB:  · Har bir mavzuga ANIQ nom bera oldik
        · 5 ta — taqdimotda ko'rsatish uchun QULAY
        · Koherentlik ham maqbul darajada
""")
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Koherentlik balli nima uchun kerak?
2. `gensim`da qaysi sinf ishlatiladi?
3. UMass ballari qanday oraliqda?
4. Nima uchun k=2 "eng yaxshi" chiqdi, lekin yaroqsiz?
5. O'qituvchining asosiy maslahati nima?
6. Amaliy retseptning 1-qadami nima?
7. "Oltin qoida" nima?

<details>
<summary>✅ Javoblar</summary>

1. **Optimal mavzular sonini** *(`k`)* tanlashga yordam berish uchun.
2. **`CoherenceModel`** *(`gensim.models.coherencemodel`)*. `sklearn`da tayyor **yo'q** — qo'lda yozamiz.
3. **Manfiy.** **0 ga yaqinroq — yaxshiroq.**
4. Chunki `mr` va `said` **deyarli har bir hujjatda birga** uchraydi → **matematik** koherentlik yuqori, lekin mavzu **hech narsa** aytmaydi.
5. ## **"Matematik eng aniq son har doim biznes uchun eng qimmatli emas."** Intuitsiya va biznes bilimini ham hisobga oling.
6. ## **TOZALASH** *(`max_df`, `min_df`)*. Buni **o'tkazib yubormang**.
7. ## *"Agar mavzuga 2-3 so'zda NOM bera olmasangiz — u mavzu emas."*

</details>

---

## 📌 Xulosa

```python
# ===== GENSIM =====
from gensim.models.coherencemodel import CoherenceModel
CoherenceModel(model=model, texts=articles,
               dictionary=dictionary, coherence='c_v').get_coherence()

# ===== SKLEARN — o'zimiz yozamiz =====
def umass_koherentlik(top_sozlar):
    for har bir JUFTLIK (wi, wj):
        log( (D(wi,wj) + 1) / D(wj) )
    → o'rtachasini qaytar

    ⚠️ DOIM MANFIY. 0 ga yaqinroq = YAXSHIROQ.


NATIJA (tozalashsiz)
  K       LDA       LSA
  2   -0.4014   -0.7520    ⭐ eng yuqori
  3   -0.5901   -0.7843
  5   -0.6873   -0.9317
  8   -0.8386   -1.0551
 11   -0.9133   -1.0742


⚠️⚠️ ENG MUHIM SABOQ

  k=2 "eng yaxshi" ball oldi — LEKIN natija FOYDASIZ:
     M0: mr · said · trump · would · one
     M1: said · mr · state · polic · offic

  Nima uchun? "mr" va "said" HAR BIR hujjatda BIRGA!
     → matematik koherentlik YUQORI ✅
     → amaliy foyda NOL ❌

  🔑 Koherentlik "birga uchraydimi?" ga javob beradi,
     "FOYDALIMI?" ga EMAS.


✅ AMALIY RETSEPT
  1 · TOZALANG (max_df=0.5, min_df=5)  ← O'TKAZIB YUBORMANG!
  2 · Koherentlikni o'lchang (k=2..15)
  3 · TOP 3 nomzod oling
  4 · QO'LDA tekshiring — top so'zlarni O'QING
  5 · Nom bera olsangiz — tanlang
  6 · Manfaatdorlarga tushuntiring


💡 O'QITUVCHIDAN
  "Matematik eng aniq son har doim biznes uchun
   eng qimmatli emas. Agar optimal bo'lmagan qiymat
   siz uchun mantiqiyroq bo'lsa — bu MUTLAQO NORMAL."


🏆 OLTIN QOIDA
  "Agar mavzuga 2-3 so'zda NOM bera olmasangiz —
   u mavzu emas."
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Koherentlik | *coherence* | Mavzu so'zlarining mosligi |
| `c_v` | *c_v coherence* | gensim koherentlik turi |
| UMass | *UMass coherence* | Oddiy koherentlik formulasi |
| Optimal son | *optimal number* | Eng mos `k` |
| Manfaatdor tomon | *stakeholder* | Natijani ko'radigan odam |

---

⬅️ [Oldingi: LSA Python'da](06-LSA-in-Python.md) · 🏠 [Modul boshiga](README.md)

📝 **Endi amaliyot:** [Barcha mashqlar](MASHQLAR.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
