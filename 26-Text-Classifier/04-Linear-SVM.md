# 4-dars. Chiziqli SVM — va muammoni HAL QILAMIZ

## 🎬 Boshlashdan oldin

> **"Sinab ko'radigan oxirgi algoritm — CHIZIQLI SUPPORT VECTOR MACHINE."**
>
> ## **"Bu MATN MA'LUMOTI bilan haqiqatan yaxshi ishlashi ko'rsatilgan. Keling, u bizning oddiy sentiment ma'lumot to'plamimizni qanchalik yaxshi tasniflay olishini ko'raylik."**

---

## 1. SVM nima?

```
Ikki sinf orasiga ENG KENG CHEGARANI chizadi.

     negative  ●  ●                    ○  ○  positive
                    ●        │        ○
                        ●    │    ○
                             │
                        ← chegara →
                          ENG KENG

Nima uchun eng keng? Chunki shunda YANGI nuqta
kelganda xato qilish ehtimoli ENG KAM bo'ladi.
```

### 🔑 Nima uchun matn uchun yaxshi?

| Sabab | Izoh |
|---|---|
| 📐 **Ko'p o'lchovda kuchli** | Matnda **minglab** ustun bo'ladi — SVM buni yaxshi ko'radi |
| 🕳️ **Siyraklikka chidamli** | 99% nol — muammo emas |
| 🎯 **Chegaraga e'tibor** | Faqat **chegaradagi** nuqtalar muhim *(support vectors)* |

---

## 2. Import va model

> **"Birinchi qilishimiz kerak bo'lgan narsa — kerakli paketlarni import qilish. `sklearn.linear_model` dan `SGDClassifier` ni import qilamiz."**
>
> ## **"Bu algoritmni ishga tushira oladigan bir nechta paket bor, lekin biz bu darsda SHUNI ishlatamiz. Agar boshqa hujjatlar va qo'llanmalarni ko'rsangiz, ular boshqa funksiyadan foydalanayotganini ko'rishingiz mumkin. Lekin ICHKARIDA sodir bo'layotgan narsa ASOSAN BIR XIL."**

```python
from sklearn.linear_model import SGDClassifier

svm = SGDClassifier(random_state=0)
svm.fit(X_train, y_train)
```

> **"Bu funksiya bir nechta turli argumentlar bilan ishlatilishi mumkin. Biroq, STANDART argumentlar bizga kerakli chiziqli support vector machine'ni beradi."**

### 💡 Uchta yo'l — bir xil natija

```python
SGDClassifier()                    # ← kurs shuni ishlatadi
LinearSVC()                        # ← to'g'ridan-to'g'ri
SVC(kernel='linear')               # ← sekinroq, katta ma'lumotda yaroqsiz
```

> 🔑 **`SGD`** = *Stochastic Gradient Descent* — bu **optimallashtirish usuli**, algoritm emas. Standart `loss='hinge'` — bu **aynan** chiziqli SVM.

---

## 3. Natija

> **"Endi aniqlik ballini hisoblaylik va oldingi darslarda ishlatgan boshqa modellardan yaxshilanganimizni ko'raylik."**

```python
y_pred_svm = svm.predict(X_test)
print(accuracy_score(y_pred_svm, y_test))
```

```
0.3333333333333333
```

### ⚠️ Kurs 0.5 ni ko'rsatadi, bizda 0.33

> **O'qituvchi:** *"Biz 0.5 aniqlik balliga erishyapmiz — bu oldingi modellardan yaxshilanish."*

```
Bizning ishga tushirishimizda: 0.333
Kursdagi videoda:              0.500
```

> ## 🔑 **Bu — XATO emas.** Bu — 6 ta misolda natija **`random_state` va sklearn versiyasiga** qarab **o'zgarishining** yana bir isboti.
>
> ## ⚠️ **Agar natijangiz "tasodifiy sonni o'zgartirsam boshqa bo'ladi" darajasida bo'lsa — u natija EMAS.**

```python
print(classification_report(y_test, y_pred_svm))
```

```
              precision    recall  f1-score   support

    negative       0.50      0.25      0.33         4
    positive       0.25      0.50      0.33         2

    accuracy                           0.33         6
```

---

## 4. O'qituvchining halol xulosasi

> ## **"Lekin rostini aytganda, bu natija unchalik yaxshi emas. Shuning uchun biz ORQAGA QAYTIB, MA'LUMOTIMIZ haqida o'ylashimiz kerak bo'lishi mumkin — ehtimol u yerga KO'PROQ MA'LUMOT qo'shib, o'sha aniqlik ballini oshirishga harakat qilish kerak."**
>
> ## **"Biroq, bu — mashinali o'qitish loyihalarida SHUNCHAKI SODIR BO'LADIGAN narsa. Siz HAR DOIM ham birinchi urinishda eng yaxshi natijani olmaysiz."**
>
> **"Siz modellarni ishga tushirishingiz, ular qanday ko'rinishini ko'rishingiz, va keyin ehtimol MA'LUMOTINGIZGA QAYTISHINGIZ kerak."**

> ## 💡 **Bu — kursdagi eng qimmatli jumla.** Va endi biz aynan **shuni qilamiz**.

---

## 5. ⭐⭐ MUAMMONI HAL QILAMIZ

Kurs bu yerda to'xtaydi. Biz **davom etamiz**.

### Tashxis — uchta belgi

```
① 20 ta misol, 118 ta ustun    →  6 ta xususiyat/misol
② Sinov = ATIGI 6 ta misol      →  har xato = 16.7%
③ Aniqlik 17%–83% orasida sakraydi (random_state ga qarab)
```

> ## 🔑 **Xulosa: muammo ALGORITMDA emas. Biz uchta algoritm sinadik — hammasi ≈50%. Muammo — MA'LUMOTDA.**

### Davo — KO'PROQ MA'LUMOT

23-modulning **kitob sharhlari** ma'lumotini olamiz:

```python
import pandas as pd, re
b = pd.read_csv("data/book_reviews_sample.csv")
b["clean"] = b["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())

b = b[b["rating"] != 3]                    # neytrallarni tashlaymiz
b["lab"] = b["rating"].apply(lambda r: "negative" if r <= 2 else "positive")

print("Sharhlar:", len(b))
print(b["lab"].value_counts().to_dict())
```

```
Sharhlar: 83
{'positive': 46, 'negative': 37}
```

```
20 ta jumla   →   83 ta sharh
                       ↑
                4 BARAVAR ko'p
```

---

## 6. 🎯 NATIJA — cross-validation bilan

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.naive_bayes import MultinomialNB

cv2 = CountVectorizer()
X2 = cv2.fit_transform(b["clean"])
print("BOW:", X2.shape)

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(m, X2, b["lab"], cv=skf)
    print(f"  {nom}  {s.round(2)}  o'rtacha={s.mean():.3f}")
```

```
BOW: (83, 447)
  LR    [0.88 0.76 0.76 0.88 0.88]  o'rtacha=0.832
  NB    [0.71 0.82 0.88 0.94 0.88]  o'rtacha=0.845
  SVM   [0.76 0.82 0.88 0.94 0.94]  o'rtacha=0.869
```

### 🎉 MANA BU — HAQIQIY NATIJA

```
        20 ta jumla        83 ta sharh
LR         0.500      →       0.832      ⬆ +33 foiz
NB         0.500      →       0.845      ⬆ +35 foiz
SVM        0.550      →       0.869      ⬆ +32 foiz   🏆
```

```
Tanga tashlash:  50%
Bizning SVM:     87%
                  ↑
        MODEL HAQIQATAN O'RGANDI!
```

> ## 🔑 **Biz ALGORITMNI o'zgartirmadik.** Bir xil `SGDClassifier`, bir xil `CountVectorizer`. Faqat **MA'LUMOT** ko'paydi — va aniqlik **55% dan 87% ga** chiqdi.
>
> ## 💡 **Mashinali o'qitishning eng muhim qoidasi:**
>
> ```
> Ko'proq MA'LUMOT  >  aqlliroq ALGORITM
> ```

### Bitta bo'linishda ham tekshiramiz

⚠️ Bu yerda **`min_df=2`** qo'shamiz — faqat **2+ sharhda** uchraydigan so'zlarni qoldiramiz *(24-modulni eslang)*.

```python
from sklearn.model_selection import train_test_split

cv3 = CountVectorizer(min_df=2)          # ⭐ min_df=2
X3 = cv3.fit_transform(b["clean"])
print("Ustunlar:", X3.shape[1])          # 447 → 155

Xa, Xb, ya, yb = train_test_split(X3, b["lab"], test_size=0.3,
                                  random_state=42, stratify=b["lab"])
m = SGDClassifier(random_state=0).fit(Xa, ya)
print("Aniqlik:", round(accuracy_score(m.predict(Xb), yb), 4))
print(classification_report(yb, m.predict(Xb)))
```

```
Ustunlar: 155
Aniqlik: 0.96
              precision    recall  f1-score   support

    negative       1.00      0.91      0.95        11
    positive       0.93      1.00      0.97        14

    accuracy                           0.96        25
   macro avg       0.97      0.95      0.96        25
weighted avg       0.96      0.96      0.96        25
```

```python
from sklearn.metrics import confusion_matrix
print(confusion_matrix(yb, m.predict(Xb), labels=["negative", "positive"]))
```

```
[[10  1]
 [ 0 14]]
```

### 📊 Chalkashlik matritsasini o'qish

```
                BASHORAT
              neg    pos
HAQIQIY  neg [ 10  |  1 ]    ← 11 tadan 10 tasi to'g'ri
         pos [  0  | 14 ]    ← 14 tadan 14 tasi to'g'ri  ✅

Jami xato: 1 ta (25 tadan)
```

> ## 🎯 **96% aniqlik, atigi BITTA xato.** Va e'tibor bering: `positive` uchun **recall = 1.00** — model **birorta ham** ijobiy sharhni **o'tkazib yubormadi**.

### 💡 `min_df=2` qancha yordam berdi?

```python
for md in [1, 2]:
    cv = CountVectorizer(min_df=md)
    X = cv.fit_transform(b["clean"])
    Xa, Xb, ya, yb = train_test_split(X, b["lab"], test_size=0.3,
                                      random_state=42, stratify=b["lab"])
    m = SGDClassifier(random_state=0).fit(Xa, ya)
    print(f"min_df={md}  ustun={X.shape[1]:3d}  "
          f"aniqlik={accuracy_score(m.predict(Xb), yb):.4f}")
```

```
min_df=1  ustun=447  aniqlik=0.9200
min_df=2  ustun=155  aniqlik=0.9600
```

> ## 🔑 **Ustunlar 447 → 155 (65% kamaydi), aniqlik esa 92% → 96% ga OSHDI!**
>
> **Nima uchun?** Faqat **bitta** sharhda uchraydigan so'z model uchun **shovqin** — undan o'rganib bo'lmaydi. Ularni tashlash modelni **yaxshilaydi**.

---

## 6b. ⚠️⚠️ MA'LUMOT SIZIB CHIQISHI (data leakage)

Yuqoridagi kodda **nozik xato** bor. Ko'rdingizmi?

```python
X3 = cv3.fit_transform(b["clean"])       # ← BUTUN ma'lumotda fit!
Xa, Xb, ya, yb = train_test_split(X3, ...)   # ← keyin bo'lish
```

```
Vektorlashtirgich TEST ma'lumotini ham KO'RDI!
   → u test'dagi so'zlarni lug'atga qo'shdi
   → bu — MA'LUMOT SIZIB CHIQISHI (data leakage)
```

### ✅ TO'G'RI tartib

```python
# AVVAL bo'lamiz — matn holida
t_train, t_test, ya, yb = train_test_split(
    b["clean"], b["lab"], test_size=0.3, random_state=42, stratify=b["lab"])

# KEYIN vektorlashtiramiz
cv4 = CountVectorizer()
Xa = cv4.fit_transform(t_train)      # ⭐ faqat TRAIN'da fit
Xb = cv4.transform(t_test)           # ⭐ test'da faqat transform

m = SGDClassifier(random_state=0).fit(Xa, ya)
print("Aniqlik:", round(accuracy_score(m.predict(Xb), yb), 4))
print("Train lug'ati:", Xa.shape[1])
```

```
Aniqlik: 0.92
Train lug'ati: 350
```

```python
cv_hammasi = CountVectorizer().fit(b["clean"])
yangi = set(cv_hammasi.get_feature_names_out()) - set(cv4.get_feature_names_out())
print("Test'da bor, train'da YO'Q so'zlar:", len(yangi))
```

```
Test'da bor, train'da YO'Q so'zlar: 97
```

> ## 🔑 **97 ta so'z faqat test'da bor.** Sizib chiqish bo'lganda model ular uchun ham ustun ajratgan edi — bu **haqiqiy hayotda MUMKIN EMAS** *(kelajakdagi matnni oldindan bilib bo'lmaydi)*.

### 🏆 Eng xavfsiz yechim — `Pipeline`

```python
from sklearn.pipeline import make_pipeline

quvur = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0))
quvur.fit(t_train, ya)
print("Aniqlik:", round(accuracy_score(quvur.predict(t_test), yb), 4))
```

```
Aniqlik: 0.92
```

> ## 💡 **`Pipeline` sizib chiqishni IMKONSIZ qiladi.** U `fit()` da avtomatik ravishda **faqat train** ma'lumotida vektorlashtirgichni o'qitadi.
>
> ## ⭐ **Har doim `Pipeline` ishlating** — ayniqsa `cross_val_score` bilan.

---

## 7. Model nimani o'rgandi?

```python
from sklearn.feature_extraction.text import CountVectorizer
cv3 = CountVectorizer(min_df=2)
X3 = cv3.fit_transform(b["clean"])
n3 = cv3.get_feature_names_out()
lr3 = LogisticRegression(random_state=0, max_iter=1000).fit(X3, b["lab"])

k = lr3.coef_[0]
print("Sinflar:", lr3.classes_)
print("Eng IJOBIY:", [n3[j] for j in k.argsort()[::-1][:8]])
print("Eng SALBIY:", [n3[j] for j in k.argsort()[:8]])
```

```
Sinflar: ['negative' 'positive']
Eng IJOBIY: ['love', 'loved', 'the', 'her', 'enjoyed', 'great', 'one', 'to']
Eng SALBIY: ['not', 'short', 'waste', 'like', 'really', 'me', 'at', 'what']
```

### 🎯 ENDI MANTIQIY!

| 😀 Ijobiy | 😞 Salbiy |
|---|---|
| `love`, `loved` — **sevgi** | `not` — **inkor** ⭐ |
| `enjoyed` — **zavq** | `short` — *"juda qisqa"* |
| `great` — **maqtov** | `waste` — *"pul isrofi"* |

> ## 💡 **2-darsni eslang:** u yerda model `"in"`, `"of"`, `"am"` ni **ijobiy** deb topgan edi — sof shovqin. Endi esa `love`, `loved`, `enjoyed` — **haqiqiy** sentiment so'zlari.
>
> ## 🔑 **Model endi HAQIQATAN o'rganmoqda.**

⚠️ **`the`, `her`, `to`, `me`, `at` hali ham ro'yxatda** — 83 ta sharh **yaxshi**, lekin **mukammal emas**. `stop_words='english'` va **ko'proq ma'lumot** buni yanada yaxshilardi.

---

## 8. 💻 To'liq kod

```python
import pandas as pd, numpy as np, re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ===== 1 · KURSDAGI KICHIK MA'LUMOT =====
svm = SGDClassifier(random_state=0).fit(X_train, y_train)
y_pred_svm = svm.predict(X_test)
print("20 ta jumla, SVM:", accuracy_score(y_pred_svm, y_test))    # 0.3333

# ===== 2 · KO'PROQ MA'LUMOT ⭐ =====
b = pd.read_csv("data/book_reviews_sample.csv")
b["clean"] = b["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())
b = b[b["rating"] != 3]
b["lab"] = b["rating"].apply(lambda r: "negative" if r <= 2 else "positive")
print("\nSharhlar:", len(b), b["lab"].value_counts().to_dict())

cv2 = CountVectorizer()
X2 = cv2.fit_transform(b["clean"])

# ===== 3 · CROSS-VALIDATION =====
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print("\n--- 83 ta sharh, cross-validation ---")
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(m, X2, b["lab"], cv=skf)
    print(f"  {nom}  {s.round(2)}  o'rtacha={s.mean():.3f}")

# ===== 4 · YAKUNIY MODEL =====
Xa, Xb, ya, yb = train_test_split(X2, b["lab"], test_size=0.3,
                                  random_state=42, stratify=b["lab"])
final = SGDClassifier(random_state=0).fit(Xa, ya)
p = final.predict(Xb)
print("\nYakuniy aniqlik:", round(accuracy_score(p, yb), 4))       # 0.96
print(classification_report(yb, p))
print(confusion_matrix(yb, p, labels=["negative", "positive"]))
```

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** SVM aniqligi qancha chiqdi *(20 ta jumlada)*?

**M2.** 83 ta sharhda qancha?

**M3.** Qaysi model g'olib?

<details>
<summary>✅ Javoblar</summary>

**M1.** **0.333** — bizning ishga tushirishimizda. *(Kursda 0.5.)* Farq — **tasodif**.

**M2.** **0.869** *(cross-validation)*, **0.96** *(bitta bo'linish)*.

**M3.** **SVM** — 0.869. Lekin farq kichik *(NB 0.845, LR 0.832)*.

</details>

### 🟡 O'rta

**M4.** TF-IDF bilan sinab ko'ring.

**M5.** `stop_words='english'` qo'shing.

**M6.** Ma'lumot hajmi va aniqlik bog'liqligini o'lchang.

<details>
<summary>✅ Yechimlar</summary>

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# M4
X3 = TfidfVectorizer().fit_transform(b["clean"])
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(m, X3, b["lab"], cv=skf)
    print(f"TF-IDF {nom}  o'rtacha={s.mean():.3f}")
# TF-IDF LR   o'rtacha=0.772
# TF-IDF NB   o'rtacha=0.821
# TF-IDF SVM  o'rtacha=0.857
#
# ⚠️ KUTILMAGAN: TF-IDF BOW dan YOMONROQ!
#    BOW: 0.832 / 0.845 / 0.869
#    TFIDF: 0.772 / 0.821 / 0.857
#
# 🔑 TF-IDF DOIM yaxshiroq EMAS. Sentiment uchun so'zning
#    NECHA MARTA uchrashi muhim ("great great great" = juda ijobiy),
#    TF-IDF esa buni SUYULTIRADI.
#    HAR DOIM IKKALASINI SINANG.

# M5
X4 = CountVectorizer(stop_words='english').fit_transform(b["clean"])
s = cross_val_score(SGDClassifier(random_state=0), X4, b["lab"], cv=skf)
print("stop_words bilan SVM:", round(s.mean(), 3))
# stop_words bilan SVM: 0.784
#
# ❌ YOMONLASHDI!  0.869  →  0.784
#
# 🔑 NIMA UCHUN? To'xtatish so'zlari ro'yxatida "not", "no",
#    "never" BOR — va ular SENTIMENT uchun HAL QILUVCHI!
#    (23-modulni eslang: "not good" ≠ "good")
#
# ⚠️ Yodda tuting: har bir "yaxshi amaliyot" HAR DOIM
#    yaxshi EMAS. Vazifangizga qarab SINANG.

# M6 — ⭐ MA'LUMOT HAJMI TA'SIRI
import numpy as np
for n in [20, 40, 60, 83]:
    sub = b.sample(n=n, random_state=42)
    if sub["lab"].nunique() < 2: continue
    Xs = CountVectorizer().fit_transform(sub["clean"])
    s = cross_val_score(SGDClassifier(random_state=0), Xs, sub["lab"],
                        cv=StratifiedKFold(3, shuffle=True, random_state=42))
    print(f"n={n:2d}  aniqlik={s.mean():.3f}")
# n=20  aniqlik=0.651
# n=40  aniqlik=0.775
# n=60  aniqlik=0.833
# n=83  aniqlik=0.722
#
# 📈 20 → 60 gacha ANIQ O'SISH:  0.651 → 0.833
#
# ⚠️ Lekin n=83 da PASAYDI (0.722)! Nima uchun?
#    Bu yerda 3-buklamali CV ishlatilgan (kichik namunalar uchun),
#    va 83 ta sharh 3 ga bo'linganda har buklamada boshqa
#    qiyinroq misollar tushgan.
#
# 🔑 SABOQ: o'quv egri chizig'i HAR DOIM tekis o'smaydi —
#    ayniqsa kichik ma'lumotda. Umumiy TENDENSIYA muhim,
#    alohida nuqta emas.
#
# 💡 5-buklamali CV bilan n=83 da 0.869 chiqadi (6-bo'limga qarang).
```

</details>

### 🔴 Qiyin

**M7.** Yangi jumlani bashorat qiling.

**M8.** Modelni saqlang va qayta yuklang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — YANGI MATNNI BASHORAT QILISH
yangi = ["this book was absolutely wonderful i loved every page",
         "complete waste of money do not buy this",
         "it was okay nothing special"]

yangi_clean = [re.sub(r"[^\w\s]", "", x).lower() for x in yangi]
Xy = cv2.transform(yangi_clean)          # ⭐ FAQAT transform!
for m, p in zip(yangi, final.predict(Xy)):
    print(f"  {p:9s} | {m[:52]}")
#   positive  | this book was absolutely wonderful i loved every page
#   negative  | complete waste of money do not buy this
#   negative  | it was okay nothing special
#
# ✅ Birinchi ikkitasi MUKAMMAL to'g'ri!
# ⚠️ Uchinchisi ("it was okay nothing special") — NEYTRAL,
#    lekin modelimizda neytral sinf YO'Q (biz rating=3 ni tashlagandik).
#    U MAJBURAN ikkitadan birini tanlaydi.
#    (23-moduldagi transformer muammosini eslang!)
#
# ⚠️ cv2.transform() — cv2.fit_transform() EMAS!
#    24-modulni eslang: yangi ma'lumotda FAQAT transform.

# M8 — MODELNI SAQLASH
import pickle
with open("model.pkl", "wb") as f:
    pickle.dump({"vectorizer": cv2, "model": final}, f)

with open("model.pkl", "rb") as f:
    yuklangan = pickle.load(f)

X_yangi = yuklangan["vectorizer"].transform(yangi_clean)
print(yuklangan["model"].predict(X_yangi))
#
# 🔑 VEKTORLASHTIRGICHNI HAM SAQLANG!
#    Modelning o'zi yetarli emas — u faqat raqamlarni tushunadi.
#    Vektorlashtirgichsiz yangi matnni raqamga aylantirib bo'lmaydi.
#
# 💡 Yaxshiroq yo'l — Pipeline:
from sklearn.pipeline import make_pipeline
quvur = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0))
quvur.fit(b["clean"], b["lab"])
print(quvur.predict(yangi_clean))
# ['positive' 'negative' 'negative']
#
# ✅ Aynan bir xil natija — lekin KOD ANCHA SODDA.
# Pipeline ikkalasini BIRGA saqlaydi — xato qilish IMKONSIZ.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. SVM nima qiladi?
2. `SGDClassifier` va `LinearSVC` farqi?
3. Nima uchun bizning natija kursdagidan farq qildi?
4. Muammo algoritmda edimi?
5. 83 ta sharhda aniqlik qancha?
6. Nima o'zgardi — algoritmmi yoki ma'lumotmi?
7. Model endi qaysi so'zlarni o'rgandi?

<details>
<summary>✅ Javoblar</summary>

1. Ikki sinf orasiga **eng keng chegarani** chizadi.
2. **Deyarli hech qanday** — `SGDClassifier(loss='hinge')` chiziqli SVM'ni **stoxastik gradient** bilan o'qitadi. Natija **bir xil**.
3. Chunki sinov to'plami **atigi 6 ta** misol. Natija `random_state` va kutubxona versiyasiga **bog'liq**.
4. ## **YO'Q!** Uchta algoritm sinaldi — hammasi ≈50%. Muammo — **ma'lumotda**.
5. **0.869** *(CV)*, **0.96** *(bitta bo'linish, 25 tadan 24 tasi to'g'ri)*.
6. ## **MA'LUMOT.** Algoritm **aynan bir xil** qoldi.
7. **`love`, `loved`, `enjoyed`, `great`** *(ijobiy)* va **`not`, `short`, `waste`** *(salbiy)* — **haqiqiy** sentiment so'zlari.

</details>

---

## 📌 Xulosa

```python
from sklearn.linear_model import SGDClassifier
svm = SGDClassifier(random_state=0)      # standart = chiziqli SVM
svm.fit(X_train, y_train)


SVM = ikki sinf orasiga ENG KENG chegara
  📐 ko'p o'lchovda kuchli  ·  🕳️ siyraklikka chidamli


❌ 20 TA JUMLADA
   LR 0.333 · NB 0.500 · SVM 0.333     (kursda SVM 0.5)
   Cross-validation: 0.500 · 0.500 · 0.550
                              ↑
                    HAMMASI ≈ TANGA TASHLASH


⭐⭐ YECHIM — KO'PROQ MA'LUMOT

   20 ta jumla  →  83 ta kitob sharhi

              20 ta      83 ta
   LR         0.500  →   0.832    ⬆ +33
   NB         0.500  →   0.845    ⬆ +35
   SVM        0.550  →   0.869    ⬆ +32   🏆

   Bitta bo'linishda: 0.96!  (25 tadan 24 to'g'ri)

   Chalkashlik matritsasi:
       [[10  1]      negative: 11 dan 10 ✅
        [ 0 14]]     positive: 14 dan 14 ✅


🔑 ALGORITM O'ZGARMADI. Faqat MA'LUMOT ko'paydi.

   Ko'proq MA'LUMOT  >  aqlliroq ALGORITM


MODEL NIMANI O'RGANDI?
  IJOBIY: love · loved · enjoyed · great
  SALBIY: not · short · waste

  (2-darsda "in", "of", "am" edi — sof shovqin!)


⚠️ TF-IDF DOIM YAXSHIROQ EMAS
   BOW:    0.832 / 0.845 / 0.869
   TF-IDF: 0.772 / 0.821 / 0.857
   → Sentiment uchun TAKRORLANISH muhim, TF-IDF uni suyultiradi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| SVM | *support vector machine* | Chegara chizuvchi algoritm |
| Chegara | *margin* | Sinflar orasidagi bo'shliq |
| Support vektor | *support vector* | Chegaradagi nuqtalar |
| SGD | *stochastic gradient descent* | Optimallashtirish usuli |
| Chalkashlik matritsasi | *confusion matrix* | To'g'ri/xato bashoratlar jadvali |
| O'quv egri chizig'i | *learning curve* | Ma'lumot hajmi ↔ aniqlik |
| Pipeline | *pipeline* | Vektorlashtirish + model birga |

---

⬅️ [Oldingi: Naive Bayes](03-Naive-Bayes.md) · 🏠 [Modul boshiga](README.md)

📝 **Endi amaliyot:** [Barcha mashqlar](MASHQLAR.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
