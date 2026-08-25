# 8-dars. Soxta yangiliklarni tasniflagich bilan aniqlash

## 🎬 Boshlashdan oldin

> **"Amaliy sessiyamizning bu OXIRGI darsiga xush kelibsiz. Bu darsda biz shuni ko'rib chiqamiz: ma'lumot to'plamimizda soxta yangilikni haqiqiy yangilikdan ANIQ TASNIFLASH uchun MAXSUS TASNIFLAGICH yarata olamizmi?"**

---

## 1. X va y

> **"Biz o'qitish va sinov ma'lumotlariga bo'lish uchun X va y o'zgaruvchilarimizni yaratmoqchimiz."**

```python
X = data["text_clean"].apply(lambda t: " ".join(t))
y = data["fake_or_factual"]
```

> ## ⚠️ **`text_clean` ishlatiladi** — bu yerda `text` **emas**! *(5-darsdagi sentimentdan farqli.)*
>
> **Nima uchun?** Chunki `text` da **`Reuters` prefiksi** bor — model **shipchani** topib qo'yardi *(3-dars: 99.5%!)*.

---

## 2. Vektorlashtirish

```python
from sklearn.feature_extraction.text import CountVectorizer

countvec = CountVectorizer()
countvec_fit = countvec.fit_transform(X)
bag_of_words = pd.DataFrame(countvec_fit.toarray(),
                            columns=countvec.get_feature_names_out())
print(bag_of_words.shape)
```

```
(198, 8552)
```

⚠️ **198 qator, 8552 ustun** — bu **26-moduldagi muammo** *(43 xususiyat/misol)*. Lekin bu safar **198 ta** misol bor *(20 emas)* — natijani ko'ramiz.

---

## 3. Train / test

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    bag_of_words, y, test_size=0.3, random_state=42)
print("Train:", X_train.shape[0], " Test:", X_test.shape[0])
```

```
Train: 138  Test: 60
```

> 💡 **60 ta test misoli** — 26-moduldagi **6 tadan** ancha yaxshi. Har bir xato = **1.7%** *(16.7% emas)*.

---

## 4. Logistik regressiya

> **"Biz tasniflagichimizni shunchaki oddiy LOGISTIK REGRESSIYA bilan boshlamoqchimiz — u qanday ishlashini ko'rish va boshqa sinab ko'rmoqchi bo'lgan modellar uchun BAZAVIY sifatida foydalanish uchun."**

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

lr = LogisticRegression(random_state=0, max_iter=1000)
lr.fit(X_train, y_train)

y_pred_lr = lr.predict(X_test)
print(accuracy_score(y_pred_lr, y_test))
```

```
0.8833333333333333
```

```python
print(classification_report(y_test, y_pred_lr))
```

```
              precision    recall  f1-score   support

Factual News       0.88      0.91      0.89        32
   Fake News       0.89      0.86      0.87        28

    accuracy                           0.88        60
   macro avg       0.88      0.88      0.88        60
weighted avg       0.88      0.88      0.88        60
```

> **"Bu yerda haqiqatan yaxshi aniqlik borligini ko'rasiz."**
>
> ⚠️ **Kursda 96% chiqadi, bizda 88.3%.** Sabab — tozalash tafsilotlari **biroz farq qiladi**. Ikkalasi ham **yaxshi natija**.

### Chalkashlik matritsasi

```python
from sklearn.metrics import confusion_matrix
print(confusion_matrix(y_test, y_pred_lr))
```

```
[[29  3]
 [ 4 24]]
```

```
                  BASHORAT
              Factual  Fake
HAQIQIY Factual  [29  |  3 ]    ← 32 dan 29 tasi to'g'ri
        Fake     [ 4  | 24 ]    ← 28 dan 24 tasi to'g'ri

Jami xato: 7 ta (60 dan)
```

---

## 5. SVM

> **"Bizning modelimiz yaxshi ishlayapti. Aniqlik juda yaxshi ko'rinadi — lekin QIZIQISH UCHUN keling, SUPPORT VECTOR MACHINE ishlatsak nima bo'lishini ko'raylik."**

```python
from sklearn.linear_model import SGDClassifier

svm = SGDClassifier(random_state=0)
svm.fit(X_train, y_train)

y_pred_svm = svm.predict(X_test)
print(accuracy_score(y_pred_svm, y_test))
```

```
0.8166666666666667
```

```python
print(classification_report(y_test, y_pred_svm))
```

```
              precision    recall  f1-score   support

Factual News       0.86      0.78      0.82        32
   Fake News       0.77      0.86      0.81        28

    accuracy                           0.82        60
```

> ## **"Bu model logistik regressiyaga qaraganda YAXSHIROQ ISHLAMADI. MANA SHUNING UCHUN murakkabroq narsaga o'tishdan oldin ODDIY MODELLARNI sinab ko'rish JUDA MUHIM."**

```
Logistik regressiya:  88.3%   🏆
Chiziqli SVM:         81.7%
```

---

## 6. ⭐⭐ LEKIN — bitta bo'linishga ISHONMANG!

26-modulning sabog'ini eslang. **Cross-validation** bilan tekshiramiz:

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("SVM", SGDClassifier(random_state=0))]:
    q = make_pipeline(CountVectorizer(), m)
    s = cross_val_score(q, X, y, cv=skf)
    print(f"  {nom}  {s.round(3)}  o'rtacha={s.mean():.3f}")
```

```
  LR    [0.925 0.875 0.875 0.949 0.821]  o'rtacha=0.889
  SVM   [0.9   0.925 0.85  0.897 0.949]  o'rtacha=0.904
```

### 💥 XULOSA TESKARI AYLANDI!

```
BITTA BO'LINISH:        CROSS-VALIDATION:
  LR   88.3%  🏆          LR   88.9%
  SVM  81.7%              SVM  90.4%  🏆
                              ↑
              SVM aslida YAXSHIROQ!
```

> ## 🔑 **Bitta bo'linishda SVM 81.7% oldi — lekin bu OMADSIZLIK edi.** 5 marta o'lchaganda u **90.4%** beradi va **LR dan yaxshiroq**.
>
> ## ⚠️ **O'qituvchining xulosasi** *("LR yaxshiroq")* **bitta bo'linishga asoslangan.** Bu — **noto'g'ri xulosa** bo'lishi mumkin.
>
> ## 💡 **HAR DOIM cross-validation ishlating.** Ayniqsa modellarni **solishtirganda**.

---

## 7. ⚠️ Va yana bir tekshiruv — SHIPCHA

3-darsda `Reuters` **99.5%** aniqlik bergan edi. Tozalash yordam berdimi?

```python
import numpy as np
# Tozalashsiz model
q_xom = make_pipeline(CountVectorizer(), LogisticRegression(random_state=0, max_iter=1000))
s_xom = cross_val_score(q_xom, data["text"], y, cv=skf)
print("TOZALASHSIZ :", s_xom.round(3), f"o'rtacha={s_xom.mean():.3f}")

s_toza = cross_val_score(q_xom, X, y, cv=skf)
print("TOZALANGAN  :", s_toza.round(3), f"o'rtacha={s_toza.mean():.3f}")
```

```
TOZALASHSIZ : [0.95  0.825 0.85  0.949 0.949]  o'rtacha=0.904
TOZALANGAN  : [0.925 0.875 0.875 0.949 0.821]  o'rtacha=0.889
```

### 🔑 Tozalash aniqlikni PASAYTIRDI — va bu YAXSHI!

```
Tozalashsiz:  90.4%     ← "Reuters" shipchasidan foydalanadi
Tozalangan :  88.9%     ← HAQIQIY tildan o'rganadi

Farq: -1.5 foiz
```

> ## 💡 **Bu — "yomon" natija emas, HALOL natija.**
>
> ```
> Tozalashsiz model:  laboratoriyada 90.4%
>                     HAQIQIY hayotda (AP, BBC) — YIQILADI ❌
>
> Tozalangan model:   laboratoriyada 88.9%
>                     HAQIQIY hayotda — ISHLAYDI ✅
> ```
>
> ## 🔑 **1.5 foizni "sotib", ISHONCHLILIKNI oldik.** Bu — **to'g'ri savdo**.

---

## 8. ✅ JAVOB — savolga qaytamiz

> ## **"Demak, savolga javob berish uchun: turli yangiliklarni soxta yoki haqiqiy deb tasniflay oladigan tasniflagich yarata olamizmi? Javob — HA, va bu algoritmlar uchun ANCHA YAXSHI muammo ko'rinadi. Ular haqiqatan yaxshi aniqlik bilan ishlaydi."**

```
❓ 1 · Soxta va haqiqiy TILDA farq qiladimi?
   ✅ HA — NER (PERSON 6/10 vs 1/10), ADV +32%, otlar

❓ 2 · SENTIMENT farq qiladimi?
   ❌ YO'Q — p = 0.83

❓ 3 · Qanday MAVZULAR bor?
   ✅ 6 ta aniq mavzu (podkastlar, Klinton pochtasi, Flynn ishi...)

🎯 4 · MODEL qura olamizmi?
   ✅ HA — 90.4% aniqlik (SVM, cross-validation)
```

---

## 9. 💻 To'liq kod

```python
import pandas as pd, numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.linear_model import LogisticRegression, SGDClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import make_pipeline

# ===== X va y =====
X = data["text_clean"].apply(lambda t: " ".join(t))     # ⚠️ text_clean!
y = data["fake_or_factual"]

# ===== VEKTORLASHTIRISH =====
countvec = CountVectorizer()
countvec_fit = countvec.fit_transform(X)
bag_of_words = pd.DataFrame(countvec_fit.toarray(),
                            columns=countvec.get_feature_names_out())
print("BOW:", bag_of_words.shape)                       # (198, 8552)

# ===== BO'LISH =====
X_train, X_test, y_train, y_test = train_test_split(
    bag_of_words, y, test_size=0.3, random_state=42)

# ===== LOGISTIK REGRESSIYA =====
lr = LogisticRegression(random_state=0, max_iter=1000).fit(X_train, y_train)
y_pred_lr = lr.predict(X_test)
print("LR :", round(accuracy_score(y_pred_lr, y_test), 4))      # 0.8833
print(classification_report(y_test, y_pred_lr))
print(confusion_matrix(y_test, y_pred_lr))

# ===== SVM =====
svm = SGDClassifier(random_state=0).fit(X_train, y_train)
y_pred_svm = svm.predict(X_test)
print("SVM:", round(accuracy_score(y_pred_svm, y_test), 4))     # 0.8167

# ===== ⭐ CROSS-VALIDATION (ISHONCHLI baho) =====
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(make_pipeline(CountVectorizer(), m), X, y, cv=skf)
    print(f"{nom} CV: {s.round(3)}  o'rtacha={s.mean():.3f}")
# LR  CV: 0.889
# SVM CV: 0.904   🏆
```

---

## 10. 🎓 Loyiha yakuni

> **"Umid qilamanki, bu amaliy darsdan zavq oldingiz — biz har bir qadamdan bir xil ma'lumot bilan qadamma-qadam o'tdik va bu to'liq NLP loyihasi sifatida qanday ko'rinishini ko'rdik."**
>
> ## **"Endi sizda PORTFOLIOGA qo'yish va yangi NLP ko'nikmalaringizni ko'rsatish uchun juda yaxshi loyiha bor."**

### 📊 Manfaatdor tomonlarga hisobot

```
╔══════════════════════════════════════════════════════════╗
║  SOXTA YANGILIKLARNI ANIQLASH — YAKUNIY HISOBOT          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ✅ MODEL ISHLAYDI:  90.4% aniqlik                       ║
║                                                          ║
║  🔍 ANIQLANGAN BELGILAR:                                 ║
║     · Soxta yangiliklar ODAMLAR ismini ko'p ishlatadi   ║
║       (top-10 ob'ektning 6 tasi vs 1 tasi)              ║
║     · RAVISHLAR 32% ko'proq (hissiyotli til)            ║
║     · SONLAR 9% kamroq (kam tekshiriladigan fakt)       ║
║     · "people/women/media" vs "government/bill/court"   ║
║                                                          ║
║  ❌ ISHLAMAGAN:                                          ║
║     · Sentiment — farq YO'Q (p = 0.83)                  ║
║                                                          ║
║  📻 TOPILGAN MANBALAR:                                   ║
║     · "Boiler Room" kabi takrorlanuvchi manbalar        ║
║       → alohida kuzatuvga tavsiya qilinadi              ║
║                                                          ║
║  ⚠️ OGOHLANTIRISH:                                       ║
║     Ma'lumotimizdagi haqiqiy yangiliklar 100% Reuters   ║
║     dan. Model boshqa agentliklar bilan QAYTA           ║
║     SINALISHI kerak.                                     ║
╚══════════════════════════════════════════════════════════╝
```

> ## 💡 **Oxirgi qatorga e'tibor bering.** Halol ma'lumot olimi **modelning chegarasini** ham aytadi.

---

## 11. ⚡ Mashqlar

### 🟢 Oson

**M1.** LR va SVM aniqligini solishtiring.

**M2.** Chalkashlik matritsasini o'qing.

**M3.** Cross-validation qiling.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print("LR :", round(accuracy_score(y_pred_lr, y_test), 4))    # 0.8833
print("SVM:", round(accuracy_score(y_pred_svm, y_test), 4))   # 0.8167

# M2
print(confusion_matrix(y_test, y_pred_lr))
# [[29  3]      Factual: 32 dan 29 to'g'ri (91%)
#  [ 4 24]]     Fake   : 28 dan 24 to'g'ri (86%)
# Jami 7 ta xato / 60

# M3 — ⭐ MUHIM
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(make_pipeline(CountVectorizer(), m), X, y, cv=skf)
    print(f"{nom} {s.round(3)}  o'rtacha={s.mean():.3f}")
# LR  [0.925 0.875 0.875 0.949 0.821]  o'rtacha=0.889
# SVM [0.9   0.925 0.85  0.897 0.949]  o'rtacha=0.904
#
# 💥 XULOSA TESKARI! Bitta bo'linishda LR yaxshiroq edi,
#    CV da SVM yaxshiroq. HAR DOIM CV ishlating.
```

</details>

### 🟡 O'rta

**M4.** ⭐ Tozalash aniqlikka qanday ta'sir qildi?

**M5.** Model qaysi so'zlarni o'rgandi?

**M6.** Xatolarni tahlil qiling.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — ⭐ SHIPCHA TEKSHIRUVI
q = make_pipeline(CountVectorizer(), LogisticRegression(random_state=0, max_iter=1000))
print("TOZALASHSIZ:", round(cross_val_score(q, data["text"], y, cv=skf).mean(), 3))
print("TOZALANGAN :", round(cross_val_score(q, X, y, cv=skf).mean(), 3))
# TOZALASHSIZ: 0.904
# TOZALANGAN : 0.889
#
# 🔑 Tozalash aniqlikni PASAYTIRDI (-1.5%) — VA BU YAXSHI!
#    Tozalashsiz model "Reuters" shipchasidan foydalanadi.
#    Haqiqiy hayotda (AP, BBC) u YIQILADI.

# M5
nmv = countvec.get_feature_names_out(); k = lr.coef_[0]
print("Sinflar:", lr.classes_)
print("FAKE tomon :", [nmv[j] for j in k.argsort()[::-1][:10]])
print("FACTUAL tomon:", [nmv[j] for j in k.argsort()[:10]])
#
# 💡 2-darsdagi topilmalar bilan SOLISHTIRING —
#    model ham "people/media" va "government/bill" ni topganmi?

# M6
xato = [(t, h, p) for t, h, p in zip(X_test.index, y_test, y_pred_lr) if h != p]
print(f"{len(xato)} ta xato")
for idx, h, p in xato[:3]:
    print(f"\nhaqiqiy={h} bashorat={p}")
    print(" ", data.loc[idx, "title"][:70])
```

</details>

### 🔴 Qiyin

**M7.** TF-IDF bilan sinang.

**M8.** `Reuters` ni butunlay olib tashlang.

**M9.** Yakuniy modelni saqlang.

<details>
<summary>✅ Yechimlar</summary>

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# M7
for nom, m in [("LR ", LogisticRegression(random_state=0, max_iter=1000)),
               ("SVM", SGDClassifier(random_state=0))]:
    s = cross_val_score(make_pipeline(TfidfVectorizer(), m), X, y, cv=skf)
    print(f"TF-IDF {nom} {s.mean():.3f}")

# M8 — ⭐ SHIPCHANI BUTUNLAY YO'Q QILISH
X_toza = X.apply(lambda t: " ".join(w for w in t.split() if w != "reuters"))
s = cross_val_score(make_pipeline(CountVectorizer(),
                    LogisticRegression(random_state=0, max_iter=1000)),
                    X_toza, y, cv=skf)
print("'reuters' siz:", round(s.mean(), 3))
#
# 💡 Ball yana biroz pasayishi mumkin — bu NORMAL.
#    Har bir shipcha olib tashlanganda model HAQIQIY
#    vazifaga yaqinlashadi.

# M9
import pickle
final = make_pipeline(CountVectorizer(), SGDClassifier(random_state=0))
final.fit(X, y)
with open("fake_news_model.pkl", "wb") as f:
    pickle.dump(final, f)
print("Model saqlandi ✅")

# Sinov
yangi = ["the government announced a new tax policy on tuesday",
         "you wont believe what this celebrity said about women"]
print(final.predict(yangi))
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Nima uchun `text_clean`, `text` emas?
2. LR va SVM bitta bo'linishda qanday natija berdi?
3. Cross-validation nima ko'rsatdi?
4. Nima uchun xulosa o'zgardi?
5. Tozalash aniqlikni oshirdimi?
6. Nima uchun bu **yaxshi**?
7. Loyihaning to'rtta savoliga javob nima?

<details>
<summary>✅ Javoblar</summary>

1. Chunki `text` da **`Reuters` prefiksi** bor — u **99.5% shipcha** *(3-dars)*.
2. **LR 88.3%**, **SVM 81.7%** — LR yaxshiroq ko'rindi.
3. ## **LR 88.9%, SVM 90.4%** — **SVM yaxshiroq!**
4. Chunki **bitta bo'linish** — bu **bitta o'lchov**. SVM shunchaki **omadsiz** bo'linishga tushgan edi.
5. ## **YO'Q** — 90.4% dan **88.9%** ga **pasaytirdi**.
6. Chunki tozalashsiz model **`Reuters` shipchasidan** foydalanadi. Haqiqiy hayotda *(AP, BBC)* u **yiqiladi**. Biz **1.5 foizni sotib, ishonchlilikni** oldik.
7. ① Til **farq qiladi** ✅ ② Sentiment **farq qilmaydi** ❌ ③ **6 ta aniq mavzu** ✅ ④ Model **90.4%** ✅

</details>

---

## 📌 Xulosa

```python
X = data["text_clean"].apply(lambda t: " ".join(t))    # ⚠️ text_clean!
y = data["fake_or_factual"]

bag_of_words = CountVectorizer().fit_transform(X)      # (198, 8552)
X_train, X_test, y_train, y_test = train_test_split(
    bag_of_words, y, test_size=0.3, random_state=42)   # 138 / 60


BITTA BO'LINISH
  LR   0.8833   🏆      [[29  3]
  SVM  0.8167           [ 4 24]]   7 ta xato / 60


⭐⭐ CROSS-VALIDATION — XULOSA TESKARI!
  LR   [0.925 0.875 0.875 0.949 0.821]  →  0.889
  SVM  [0.9   0.925 0.85  0.897 0.949]  →  0.904  🏆

  🔑 SVM aslida YAXSHIROQ. Bitta bo'linish ALDADI.


⚠️ TOZALASH ANIQLIKNI PASAYTIRDI — VA BU YAXSHI
  Tozalashsiz  0.904   ← "Reuters" shipchasi
  Tozalangan   0.889   ← HAQIQIY til

  1.5 foizni sotib, ISHONCHLILIKNI oldik ✅


✅ LOYIHA JAVOBLARI
  ① Til farq qiladimi?     ✅ HA (NER, ADV +32%, otlar)
  ② Sentiment farq qiladimi? ❌ YO'Q (p = 0.83)
  ③ Qanday mavzular?        ✅ 6 ta aniq (podkast, pochta, Flynn)
  ④ Model qura olamizmi?    ✅ HA — 90.4%
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Bazaviy model | *baseline* | Taqqoslash nuqtasi |
| Chalkashlik matritsasi | *confusion matrix* | To'g'ri/xato jadval |
| Cross-validation | *cross-validation* | Ko'p marta o'lchash |
| Shipcha | *shortcut* | Model topgan yengil belgi |
| Umumlashtirish | *generalisation* | Yangi ma'lumotda ishlash |

---

⬅️ [Oldingi: Mavzular — LSA](07-Topics-LSA.md) · 🏠 [Modul boshiga](README.md)

📝 **Endi amaliyot:** [Barcha mashqlar](MASHQLAR.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
