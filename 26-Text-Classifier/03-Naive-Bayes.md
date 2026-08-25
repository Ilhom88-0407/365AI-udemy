# 3-dars. Naive Bayes

## 🎬 Boshlashdan oldin

> **"Keling, Naive Bayes moduli yordamida o'sha PAST aniqlik ballini YAXSHILASHGA harakat qilaylik."**

---

## 1. Naive Bayes nima?

**Bayes teoremasi** asosidagi ehtimollik algoritmi. Sodda tilda:

```
Savol:  "Bu jumla POSITIVE bo'lish ehtimoli qancha?"

Javob:  Har bir so'z uchun so'raymiz:
          "'love' so'zi POSITIVE jumlalarda necha marta uchragan?"
          "'love' so'zi NEGATIVE jumlalarda necha marta uchragan?"

        Keyin ehtimollarni KO'PAYTIRAMIZ.
        Qaysi sinf yuqori chiqsa — o'sha g'olib.
```

### 🔑 Nima uchun "NAIVE" (sodda)?

```
Model FARAZ QILADI:
   har bir so'z BOSHQALARIDAN MUSTAQIL

"not good"  →  model "not" va "good" ni ALOHIDA ko'radi
                   ↑
            Bu — ANIQ NOTO'G'RI faraz!

Lekin amalda BARIBIR YAXSHI ishlaydi. 🤷
```

> ## 💡 **Shuning uchun u "naive" (sodda).** Faraz **noto'g'ri**, lekin natija **kutilganidan yaxshi** — bu mashinali o'qitishdagi mashhur paradoks.

---

## 2. Nima uchun matn uchun mos?

| Sabab | Izoh |
|---|---|
| ⚡ **Juda tez** | Faqat **sanash** — hech qanday optimallashtirish yo'q |
| 📉 **Kam ma'lumotda ham ishlaydi** | Logistik regressiyadan **yaxshiroq** |
| 🔢 **Sanoqlar uchun tug'ilgan** | `MultinomialNB` aynan **Bag of Words** uchun |
| 📧 **Spam filtri klassikasi** | 1990-yillardan beri **shu** ishlatiladi |

> 💡 **`Multinomial`** — bu *"sanoqlar bilan ishlaydi"* degani. Shuning uchun u **`CountVectorizer`** bilan **juda mos**.

---

## 3. Import va model

> **"Buni `sklearn` paketidan import qilmoqchimiz: `sklearn.naive_bayes` dan `MultinomialNB` ni import qilamiz."**
>
> **"Keyin algoritmimizni yaratamiz va uni `nb` deb ataymiz. `MultinomialNB` funksiyasidan bo'sh qavslar bilan foydalanamiz."**

```python
from sklearn.naive_bayes import MultinomialNB

nb = MultinomialNB()
nb.fit(X_train, y_train)
```

> 💡 **Diqqat: `random_state` YO'Q!** Naive Bayes — **deterministik**. U shunchaki sanaydi, tasodifiylik **yo'q**. Bu — uning yana bir afzalligi.

---

## 4. Bashorat va aniqlik

> **"Keyin sinov ma'lumot to'plamimizda bashoratlarimizni yaratamiz — shunchaki `sklearn` dan `predict` funksiyasidan foydalanib — va bundan aniqlik ballini hisoblash uchun foydalanamiz."**

```python
y_pred_nb = nb.predict(X_test)
print(accuracy_score(y_pred_nb, y_test))
```

```
0.5
```

> ## **"Bu yerda aniqlik BIROZ YAXSHILANGANINI ko'ramiz. Bu 0.5. Demak, bu logistik regressiya modelimizdan YAXSHILANISH. Lekin u hali ham unchalik yaxshi ishlamadi."**

### Taqqoslash

```
Logistik regressiya:  0.333    (2/6 to'g'ri)
Naive Bayes:          0.500    (3/6 to'g'ri)   ⬆ +1 ta to'g'ri javob
```

> ## ⚠️ **"Yaxshilanish" — bu ATIGI BITTA qo'shimcha to'g'ri javob.** 6 ta misolda **1 ta** farq — bu **statistik shovqin**, model sifati emas.

---

## 5. Classification report

> **"Keling, tasniflash hisobotiga qaraylik. `y_test` va `y_pred_nb` da `classification_report` ni ishga tushiramiz."**

```python
print(classification_report(y_test, y_pred_nb))
```

```
              precision    recall  f1-score   support

    negative       0.60      0.75      0.67         4
    positive       0.00      0.00      0.00         2

    accuracy                           0.50         6
   macro avg       0.30      0.38      0.33         6
weighted avg       0.40      0.50      0.44         6
```

### ⚠️ MANA MUAMMO — `positive` qatoriga qarang!

```
positive:  precision 0.00
           recall    0.00
           f1-score  0.00
                ↑
     MODEL BIRORTA HAM "positive" TOPMADI!
```

> ## ❌ **Model 6 ta misoldan 5 tasini `negative` deb belgiladi** *(4 tasi to'g'ri, 1 tasi xato)* **va 1 tasini `positive`** *(u ham xato)*. Ya'ni u aslida *"hammasi negative"* strategiyasiga o'tgan.

### 🔑 Nima uchun bu XAVFLI?

```
O'RGATUVCHI to'plamda:  8 ta positive,  6 ta negative
SINOV to'plamida     :  4 ta negative,  2 ta positive
                             ↑
              TAQSIMOT TESKARI AYLANGAN!
```

> ## ⚠️ **Mana yana bir muammo:** 20 ta misolni bo'lganda, o'rgatuvchi to'plamda **`positive` ko'p**, sinovda esa **`negative` ko'p**. Model bir narsani o'rganib, **boshqasi bilan sinaladi**.

**"Aqlsiz" model bilan solishtiramiz:**

```python
from sklearn.dummy import DummyClassifier
dummy = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print("Dummy aniqligi:", accuracy_score(dummy.predict(X_test), y_test))
```

```
Dummy aniqligi: 0.3333333333333333
```

```
Dummy "hammasi POSITIVE" deydi  (chunki o'rgatuvchida positive ko'p)
   → sinovda 2/6 = 33.3%

Naive Bayes  →  50.0%     ✅ dummy'dan yaxshiroq
Logistik reg →  33.3%     ❌ dummy bilan BIR XIL!
```

> ## 💡 **`DummyClassifier` — bu "aqlsiz" bazaviy model.** Agar sizning modelingiz undan yaxshi bo'lmasa — u **hech narsa o'rganmagan**.
>
> ## ⚠️ **Logistik regressiya AYNAN dummy darajasida chiqdi (33.3%).** Ya'ni u **hech qanday foydali naqsh topmadi**.
>
> ## 🔑 **Ikkita saboq:** ① `DummyClassifier` bilan **har doim** solishtiring. ② **Faqat aniqlikka qaramang** — `classification_report` ni **doim** o'qing.

---

## 6. O'qituvchining xulosasi

> **"Naive Bayes modeli biroz yaxshilanmoqda, chunki u ham ijobiy, ham salbiy tasniflardan foydalanmoqda."**

> ⚠️ **Halol tuzatish:** yuqoridagi hisobot ko'rsatadiki, bizning ishga tushirishimizda model `positive` ni **umuman to'g'ri topmadi** *(precision va recall = 0.00)*. Bu — **`random_state` ga bog'liq**. Boshqa bo'linishda natija **boshqacha** bo'lardi.
>
> ## 🔑 **Va bu — aynan muammoning o'zi:** 6 ta misolda natija **har safar boshqacha**.

---

## 7. ⭐ Uchta modelni solishtiramiz

```python
import numpy as np
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression, SGDClassifier

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(m, bag_of_words, y, cv=skf)
    print(f"  {nom}  {s.round(2)}  o'rtacha={s.mean():.3f}")
```

```
  LR    [0.25 0.75 0.25 0.5  0.75]  o'rtacha=0.500
  NB    [0.25 0.5  0.25 0.75 0.75]  o'rtacha=0.500
  SVM   [0.5  0.75 0.25 0.5  0.75]  o'rtacha=0.550
```

### 🎯 CROSS-VALIDATION — bitta bo'linishdan ISHONCHLIROQ

```
Bitta bo'linish:   1 marta o'lchash    → tasodifga bog'liq
Cross-validation:  5 marta o'lchash    → ancha ishonchli
```

### ❌ Va natija shafqatsiz

```
LR   0.500      ┐
NB   0.500      ├──  HAMMASI ≈ TANGA TASHLASH (50%)
SVM  0.550      ┘

Har bir buklamada: 0.25 · 0.75 · 0.25 · 0.5 · 0.75
                        ↑
              25% dan 75% gacha sakraydi!
```

> ## 🔑 **Uchala model ham BIR XIL: 50%.** Bu — algoritmlar **bir xil darajada yomon** degani emas. Bu — **ma'lumotda o'rganadigan narsa YO'Q** degani.

---

## 8. 💻 To'liq kod

```python
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report

# ===== MODEL =====
nb = MultinomialNB()                 # random_state YO'Q — deterministik!
nb.fit(X_train, y_train)

# ===== BASHORAT =====
y_pred_nb = nb.predict(X_test)
print("Aniqlik:", accuracy_score(y_pred_nb, y_test))       # 0.5
print(classification_report(y_test, y_pred_nb))

# ===== CROSS-VALIDATION ⭐ =====
from sklearn.model_selection import cross_val_score, StratifiedKFold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
s = cross_val_score(nb, bag_of_words, y, cv=skf)
print("CV ballari:", s.round(2), " o'rtacha:", round(s.mean(), 3))
```

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** NB va LR aniqligini solishtiring.

**M2.** Nima uchun NB'da `random_state` yo'q?

**M3.** `classification_report` dagi `positive` qatori nimani ko'rsatadi?

<details>
<summary>✅ Javoblar</summary>

```python
# M1
print("LR:", accuracy_score(lr.predict(X_test), y_test))    # 0.3333
print("NB:", accuracy_score(nb.predict(X_test), y_test))    # 0.5
# Farq: ATIGI 1 ta to'g'ri javob (6 tadan)

# M2
# Naive Bayes DETERMINISTIK — u shunchaki SANAYDI.
# Hech qanday tasodifiy boshlanish yoki optimallashtirish YO'Q.
# → Har safar AYNAN bir xil natija.

# M3
# precision 0.00, recall 0.00 →  model BIRORTA HAM to'g'ri
#                                "positive" topa olmadi.
# 🔑 Faqat aniqlikka qaramang! 50% aniqlik "yaxshi" ko'rinadi,
#    lekin model bitta sinfni UMUMAN tanimaydi.
```

</details>

### 🟡 O'rta

**M4.** Cross-validation bilan uchala modelni solishtiring.

**M5.** "Hammasi negative" strategiyasi qancha aniqlik berardi?

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression, SGDClassifier
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("NB ", MultinomialNB()),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(m, bag_of_words, y, cv=skf)
    print(f"{nom}  {s.round(2)}  o'rtacha={s.mean():.3f}")
# LR    [0.25 0.75 0.25 0.5  0.75]  o'rtacha=0.500
# NB    [0.25 0.5  0.25 0.75 0.75]  o'rtacha=0.500
# SVM   [0.5  0.75 0.25 0.5  0.75]  o'rtacha=0.550
#
# 🔑 HAMMASI ≈ 50% = TANGA TASHLASH.
#    Muammo ALGORITMDA emas — MA'LUMOTDA.

# M5 — "DUMMY" TASNIFLAGICH
from sklearn.dummy import DummyClassifier
d = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
print("Dummy:", accuracy_score(d.predict(X_test), y_test))
print("O'rgatuvchi taqsimot:", y_train.value_counts().to_dict())
print("Sinov taqsimot      :", y_test.value_counts().to_dict())
# Dummy: 0.3333333333333333
# O'rgatuvchi taqsimot: {'positive': 8, 'negative': 6}
# Sinov taqsimot      : {'negative': 4, 'positive': 2}
#
# 🔑 Dummy "hammasi POSITIVE" deydi (o'rgatuvchida positive ko'p)
#    → sinovda atigi 2/6 = 33.3%
#
# ❌ LOGISTIK REGRESSIYA HAM 33.3% — ya'ni "AQLSIZ" MODEL
#    BILAN BIR XIL! U hech qanday foydali naqsh topmadi.
#
# ⚠️ Va e'tibor bering: taqsimot TESKARI aylangan —
#    o'rgatuvchida positive ko'p, sinovda negative ko'p.
#    20 ta misolni bo'lganda shunday bo'ladi.
#
# ⭐ HAR DOIM DummyClassifier bilan solishtiring!
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Naive Bayes nimaga asoslangan?
2. Nima uchun u "naive"?
3. `MultinomialNB` nima uchun matn uchun mos?
4. Aniqlik qancha chiqdi?
5. `classification_report` da qanday muammo ko'rindi?
6. Cross-validation nima uchun yaxshiroq?

<details>
<summary>✅ Javoblar</summary>

1. **Bayes teoremasi** — ehtimollik.
2. Chunki u har bir so'z **mustaqil** deb faraz qiladi. Bu **noto'g'ri** *(`"not good"` da so'zlar bog'liq)*, lekin amalda **baribir ishlaydi**.
3. Chunki `Multinomial` — **sanoqlar** bilan ishlaydi, ya'ni **Bag of Words** uchun tug'ilgan.
4. **0.5** — LR'dan **1 ta** to'g'ri javob ko'proq.
5. **`positive` uchun precision va recall = 0.00** — model bu sinfni **umuman topmadi**.
6. Chunki u **5 marta** o'lchaydi *(1 marta emas)* — natija **tasodifga kamroq** bog'liq.

</details>

---

## 📌 Xulosa

```python
from sklearn.naive_bayes import MultinomialNB

nb = MultinomialNB()          # ⭐ random_state YO'Q — deterministik
nb.fit(X_train, y_train)
y_pred_nb = nb.predict(X_test)

accuracy_score(y_pred_nb, y_test)      # 0.5


NAIVE BAYES
  Bayes teoremasi + "har so'z MUSTAQIL" farazi
  Faraz NOTO'G'RI, lekin amalda ishlaydi 🤷

  ⚡ juda tez  ·  kam ma'lumotda yaxshi  ·  spam filtri klassikasi


NATIJA: 0.5   (LR: 0.333)
  ⚠️ "Yaxshilanish" — ATIGI 1 ta to'g'ri javob


❌ CLASSIFICATION REPORT MUAMMONI OCHDI

    positive   precision 0.00   recall 0.00
                    ↑
    Model BIRORTA HAM positive topmadi!

  "Hammasi negative" strategiyasi 66.7% berardi —
  ya'ni bizning model SODDA STRATEGIYADAN YOMONROQ!

  🔑 FAQAT ANIQLIKKA QARAMANG.


⭐ CROSS-VALIDATION (5-fold)
    LR   0.500
    NB   0.500      ← HAMMASI TANGA TASHLASH
    SVM  0.550

  Har buklamada 0.25 dan 0.75 gacha sakraydi

  🔑 Muammo ALGORITMDA emas — MA'LUMOTDA
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Naive Bayes | *Naive Bayes* | Ehtimollik asosidagi tasniflagich |
| Multinomial | *multinomial* | Sanoqlar bilan ishlaydi |
| Deterministik | *deterministic* | Har safar bir xil natija |
| Cross-validation | *cross-validation* | Ko'p marta bo'lib o'lchash |
| Buklama | *fold* | CV ning bir bo'lagi |
| Dummy tasniflagich | *dummy classifier* | "Aqlsiz" bazaviy model |

---

⬅️ [Oldingi: Logistik regressiya](02-Logistic-Regression.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Chiziqli SVM](04-Linear-SVM.md)
