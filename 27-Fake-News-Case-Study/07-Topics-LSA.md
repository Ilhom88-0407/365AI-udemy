# 7-dars. Mavzular — 2-qism: TF-IDF va LSA

## 🎬 Boshlashdan oldin

> **"Oxirgi darsimizdagi mavzularning ko'pi juda o'xshash chiqqani uchun, keling BOSHQA USULLARNI sinab ko'raylik."**
>
> ## **"O'zgartirishimiz mumkin bo'lgan birinchi narsa — shunchaki Bag of Words modeli o'rniga matnimizning TF-IDF vektorlashtirishidan foydalanish. Va biz Latent Dirichlet Allocation o'rniga LATENT SEMANTIC ANALYSIS dan foydalanamiz."**

---

## 1. Ikki o'zgarish

```
6-DARS                    7-DARS
──────                    ──────
Bag of Words       →      TF-IDF        ⭐
LDA                →      LSA           ⭐
```

> 💡 **24-modulni eslang:** TF-IDF `trump` kabi **keng tarqalgan** so'zlarga **avtomatik past vazn** beradi. Aynan shu bizga kerak.

---

## 2. Funksiyalar yaratamiz

> **"Bu dars uchun biz bir nechta turli funksiyalar yaratamiz."**

### 🅰️ gensim *(kurs)*

```python
from gensim import models
from gensim.models import LsiModel
from gensim.models.coherencemodel import CoherenceModel

def tf_idf_corpus(doc_term_matrix):
    tfidf = models.TfidfModel(corpus=doc_term_matrix, normalize=True)
    corpus_tfidf = tfidf[doc_term_matrix]
    return corpus_tfidf


def get_coherence_scores(corpus, dictionary, texts, min_topics, max_topics):
    coherence_values = []
    model_list = []
    for num_topics_i in range(min_topics, max_topics + 1):
        model = LsiModel(corpus=corpus, num_topics=num_topics_i,
                         id2word=dictionary)
        model_list.append(model)
        cm = CoherenceModel(model=model, texts=texts,
                            dictionary=dictionary, coherence="c_v")
        coherence_values.append(cm.get_coherence())
    plt.plot(range(min_topics, max_topics + 1), coherence_values)
    plt.xlabel("Number of topics")
    plt.ylabel("Coherence score")
    plt.legend(["coherence_values"], loc="best")
    plt.show()
    return model_list, coherence_values
```

### 🅱️ sklearn *(tekshirilgan)*

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

tv = TfidfVectorizer()
Xt = tv.fit_transform(matn)
nt = tv.get_feature_names_out()
```

> 💡 **`sklearn`da `tf_idf_corpus()` funksiyasi kerak emas** — `TfidfVectorizer` **bir qadamda** hammasini qiladi.

---

## 3. Koherentlik ballari

```python
coherence_values = []
for k in range(2, 12):
    m = TruncatedSVD(n_components=k, random_state=42).fit(Xt)
    c = np.mean([umass([nt[j] for j in t.argsort()[::-1][:10]])
                 for t in m.components_])
    coherence_values.append(c)
    print(f"  k={k:2d}  {c:8.4f}")
```

```
  k= 2   -0.3787     ⭐ ENG YUQORI
  k= 3   -0.7515
  k= 4   -0.8759
  k= 5   -0.8635
  k= 6   -0.8973
  k= 7   -1.0319
  k= 8   -0.9031
  k= 9   -0.9801
  k=10   -0.9201
  k=11   -1.0397
```

> **"Endi bizda koherentlik ballari bor. Optimal mavzular soni 10 yoki 7 bo'lishi mumkinligini ko'ramiz."**

```
Kursning c_v  →  k = 7 yoki 10
Bizning UMass →  k = 2
```

> ## 💡 **Yana bir bor: koherentlik TAKLIF qiladi, siz QAROR qilasiz.** Biz **7 ni** olamiz — kursni kuzatish va **oldingi dars bilan solishtirish** uchun.

---

## 4. ⭐ Yakuniy LSA modeli

```python
final_num_topics = 7
lsa_model = TruncatedSVD(n_components=final_num_topics, random_state=42).fit(Xt)

for i, t in enumerate(lsa_model.components_):
    print(f"M{i}:", [nt[j] for j in t.argsort()[::-1][:10]])
```

```
M0: ['trump','clinton','said','president','woman','republican','time','state','would','donald']
M1: ['boiler','room','acr','animal','jay','episode','analysis','political','dyer','mediamaniacs']
M2: ['trump','donald','conference','november','vote','press','melania','cummings','conway','stephen']
M3: ['clinton','hillary','september','email','hillaryclinton','woman','2016','dnc','21','rich']
M4: ['woman','penny','god','abortion','president','obama','candidate','party','supreme','vote']
M5: ['school','student','law','flynn','worker','state','county','tobacco','woman','event']
M6: ['flynn','hillary','bill','thing','wife','mr','campaigning','2016','image','ritzheimer']
```

---

## 5. 🎉 MANA BU — ANCHA YAXSHI!

> ## **"Birinchi mavzumizda `Trump`, `Clinton` va `Hillary` so'zlari bor. Ikkinchi mavzu — `boiler`, `arc`, `room`. Uchinchi mavzu — `Flynn`, `immunity`."**
>
> ## **"Agar mavzularni o'qib chiqsangiz, oxirgi darsda ishga tushirganimizga qaraganda ANCHA KO'PROQ FARQLAR borligini ko'rasiz. Bular muhokama qilish uchun ANCHA QIZIQARLI mavzular."**

### Mavzularga nom beramiz

| Mavzu | Kalit so'zlar | Nom |
|---|---|---|
| **M0** | `trump` `clinton` `said` `president` | ⚠️ **Umumiy** *(LSA'ning 0-mavzusi)* |
| **M1** | `boiler` `room` `acr` `jay` `dyer` `mediamaniacs` | 📻 ## **"Boiler Room" podkasti** |
| **M2** | `conference` `press` `melania` `conway` | 🎙️ **Matbuot anjumani** |
| **M3** | `hillary` `email` `dnc` `hillaryclinton` | 📧 ## **Klinton elektron pochtasi** |
| **M4** | `penny` `god` `abortion` `supreme` | ⛪ **Din va abort** |
| **M5** | `school` `student` `flynn` `tobacco` `county` | 🏫 **Maktab va mahalliy** |
| **M6** | `flynn` `wife` `campaigning` `ritzheimer` | 🕵️ **Flynn ishi** |

### 🔑 Qoplashni sanaymiz

```python
from collections import Counter
c = Counter()
for t in lsa_model.components_:
    c.update([nt[j] for j in t.argsort()[::-1][:10]])
print(c.most_common(5))
```

```
LDA (6-dars):   said 5/7 · trump 4/7 · state 4/7 · clinton 4/7
LSA (bu dars):  woman 4/7 · trump 3/7 · clinton 3/7 · hillary 2/7
                      ↓
              QOPLASH KAMAYDI!
```

---

## 6. Nima uchun LSA yaxshiroq chiqdi?

```
LDA  →  Bag of Words
        "trump" 520 marta  →  HAR mavzuda og'ir

LSA  →  TF-IDF
        "trump" ko'p hujjatda  →  IDF PAST  →  vazn KICHIK
                                        ↓
        "boiler", "ritzheimer", "mediamaniacs" kabi
        NOYOB so'zlar YUQORI vazn oladi
```

> ## 💡 **Aynan shuning uchun M1 chiqdi:** `boiler room acr jay dyer mediamaniacs` — bu **bitta manba** *(podkast)* ning nomlari. TF-IDF ularni **ko'tarib chiqdi**, chunki ular **noyob**.

### 🎯 Bu — HAQIQIY BIZNES INSAYTI

```
M1: "Boiler Room" — bu KONKRET manba
                     ↓
   Agar platformada bu manbadan ko'p soxta yangilik kelsa —
   uni ALOHIDA kuzatish yoki bloklash mumkin!
```

> ## 🔑 **6-darsdagi LDA bunday narsani KO'RSATA OLMAGAN edi.** Uning mavzulari `trump said state` — bu **hech qanday amaliy qaror** bermaydi.

---

## 7. 💡 Manfaatdor tomonlarga taqdimot

> ## **"Shuning uchun buni qaytarib taqdim qilganingizda va 'soxta yangiliklarda qanday turli mavzular paydo bo'ladi' degan savolga javob berganingizda — bu siz taqdim qila oladigan va bu matndan chiqayotgan turli mavzular haqida gapira oladigan narsa."**

```
📊 TAQDIMOT UCHUN

  "Soxta yangiliklarda 6 ta aniq mavzu topdik:

   📻 Bir nechta ALOHIDA manba (podkastlar, bloglar)
   📧 Klinton elektron pochta ishi
   ⛪ Din va abort masalalari
   🎙️ Matbuot anjumanlari
   🏫 Maktab va mahalliy voqealar
   🕵️ Flynn tergovi

   TAVSIYA: 'Boiler Room' kabi takrorlanuvchi manbalarni
            alohida kuzatuvga oling."
```

---

## 8. 💻 To'liq kod

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

# ===== TF-IDF =====
tv = TfidfVectorizer()
Xt = tv.fit_transform(matn)
nt = tv.get_feature_names_out()

# ===== KOHERENTLIK =====
coherence_values = []
for k in range(2, 12):
    m = TruncatedSVD(n_components=k, random_state=42).fit(Xt)
    coherence_values.append(np.mean(
        [umass([nt[j] for j in t.argsort()[::-1][:10]]) for t in m.components_]))
    print(f"k={k:2d}  {coherence_values[-1]:8.4f}")

plt.plot(range(2, 12), coherence_values)
plt.xlabel("Number of topics"); plt.ylabel("Coherence score")
plt.legend(["coherence_values"], loc="best")
plt.savefig("lsa_coherence.png", dpi=100, bbox_inches="tight")

# ===== YAKUNIY MODEL =====
final_num_topics = 7
lsa_model = TruncatedSVD(n_components=final_num_topics, random_state=42).fit(Xt)
for i, t in enumerate(lsa_model.components_):
    print(f"M{i}:", [nt[j] for j in t.argsort()[::-1][:10]])
```

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** LDA va LSA mavzularini yonma-yon solishtiring.

**M2.** Qoplashni sanang.

**M3.** 2 mavzu bilan sinang *(koherentlik tavsiyasi)*.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
for i in range(4):
    print(f"M{i} LDA:", [nm[j] for j in lda_model.components_[i].argsort()[::-1][:6]])
    print(f"   LSA:", [nt[j] for j in lsa_model.components_[i].argsort()[::-1][:6]])
    print()

# M2
from collections import Counter
for nom, mdl, names in [("LDA", lda_model, nm), ("LSA", lsa_model, nt)]:
    c = Counter()
    for t in mdl.components_:
        c.update([names[j] for j in t.argsort()[::-1][:10]])
    print(nom, c.most_common(4))
#
# 🔑 LSA da qoplash KAMROQ bo'lishi kerak.

# M3
lsa2 = TruncatedSVD(n_components=2, random_state=42).fit(Xt)
for i, t in enumerate(lsa2.components_):
    print(f"M{i}:", [nt[j] for j in t.argsort()[::-1][:10]])
```

</details>

### 🟡 O'rta

**M4.** Har mavzuning eng ishonchli maqolasini toping.

**M5.** HAQIQIY yangiliklar mavzularini ham toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
D = lsa_model.transform(Xt)
fake_idx = data[data["fake_or_factual"] == "Fake News"].index
for k in range(7):
    i = D[:, k].argmax()
    print(f"M{k}: {data.loc[fake_idx[i], 'title'][:64]}")
#
# 💡 Bu — mavzuga NOM berishning eng yaxshi usuli (25-modul).

# M5 — ⭐ SOLISHTIRISH
fact_text = (data[data["fake_or_factual"] == "Factual News"]["text_clean"]
             .reset_index(drop=True))
matn_f = [" ".join(t) for t in fact_text]
tvf = TfidfVectorizer(); Xf = tvf.fit_transform(matn_f)
ntf = tvf.get_feature_names_out()
lsaf = TruncatedSVD(n_components=7, random_state=42).fit(Xf)
print("HAQIQIY yangiliklar mavzulari:")
for i, t in enumerate(lsaf.components_):
    print(f"  M{i}:", [ntf[j] for j in t.argsort()[::-1][:8]])
#
# 💡 Soxta mavzulari bilan SOLISHTIRING —
#    haqiqiy yangiliklarda "podkast nomlari" bo'lmasligi kerak.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. 6-darsdan qaysi ikki narsa o'zgardi?
2. Nima uchun TF-IDF yordam beradi?
3. `M1` mavzusi nima haqida?
4. Nima uchun bu mavzu LDA'da chiqmagan?
5. Qaysi mavzu "umumiy" va nima uchun?
6. Bu topilma qanday amaliy qaror beradi?

<details>
<summary>✅ Javoblar</summary>

1. ## **Bag of Words → TF-IDF** va **LDA → LSA**.
2. TF-IDF `trump` kabi **ko'p hujjatda** uchraydigan so'zlarga **past vazn** beradi *(IDF past)*. Natijada **noyob** so'zlar **ko'tarilib chiqadi**.
3. ## **"Boiler Room" podkasti** — `boiler`, `room`, `acr`, `jay`, `dyer`, `mediamaniacs`. Bu — **konkret manba**.
4. Chunki LDA **Bag of Words** ishlatadi — u yerda `trump` *(520 marta)* **hamma narsani bosib** ketgan edi.
5. ## **M0** — chunki LSA'ning **birinchi komponenti** har doim **"korpus o'rtachasi"** *(25-modul, 6-dars)*.
6. *"Boiler Room kabi takrorlanuvchi **manbalarni** alohida **kuzatuvga oling**"* — bu **aniq harakat**.

</details>

---

## 📌 Xulosa

```python
# IKKI O'ZGARISH
Xt = TfidfVectorizer().fit_transform(matn)        # BoW → TF-IDF
lsa_model = TruncatedSVD(n_components=7,          # LDA → LSA
                         random_state=42).fit(Xt)


KOHERENTLIK (UMass)
  k= 2  -0.3787  ⭐      k= 7  -1.0319
  k= 3  -0.7515         k= 8  -0.9031
  k= 4  -0.8759         k= 9  -0.9801
  k= 5  -0.8635         k=10  -0.9201
  k= 6  -0.8973         k=11  -1.0397

  Kurs c_v → 7 yoki 10  ·  UMass → 2
  Tanlov: 7 (solishtirish uchun)


🎉 NATIJA — ANCHA YAXSHI!

  M0: trump clinton said president...        ⚠️ umumiy (LSA 0-mavzusi)
  M1: boiler room acr jay dyer mediamaniacs  📻 "Boiler Room" PODKASTI
  M2: conference press melania conway        🎙️ matbuot anjumani
  M3: hillary email dnc hillaryclinton       📧 Klinton pochtasi
  M4: penny god abortion supreme             ⛪ din va abort
  M5: school student flynn tobacco county    🏫 maktab/mahalliy
  M6: flynn wife campaigning ritzheimer      🕵️ Flynn ishi


QOPLASH KAMAYDI
  LDA:  said 5/7 · trump 4/7 · state 4/7 · clinton 4/7
  LSA:  woman 4/7 · trump 3/7 · clinton 3/7 · hillary 2/7


🔑 NIMA UCHUN?
  TF-IDF "trump" ga PAST vazn beradi (IDF past)
       ↓
  "boiler", "ritzheimer", "mediamaniacs" — NOYOB so'zlar
  YUQORI vazn oladi va MAVZU sifatida chiqadi


🎯 AMALIY QIYMAT
  M1 "Boiler Room" — bu KONKRET MANBA
  → platformada uni ALOHIDA kuzatish mumkin!

  LDA ("trump said state") bunday qaror BERMAGAN edi.
```

---

⬅️ [Oldingi: Mavzular — LDA](06-Topics-LDA.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Tasniflagich](08-Fake-News-Classifier.md)
