# 2-dars. Logistik regressiya

## 🎬 Boshlashdan oldin

> **"Keling, avval matnimizni tasniflash uchun LOGISTIK REGRESSIYA modelini yaratishdan boshlaylik."**
>
> ## **"Bu — MUSTAQIL model sifatida ham, yoki har qanday murakkabroq modelga o'tishdan oldin BAZAVIY (baseline) model sifatida ham ishlatish uchun ajoyib model."**

📁 **Ma'lumot:** [`data/sentences.txt`](data/sentences.txt) — **20 ta** jumla *(10 ijobiy, 10 salbiy)*.

---

## 1. Import

> **"Bizga kerak bo'lgan paketlarni import qilishdan boshlaymiz — pandas va sklearn."**
>
> ## **"sklearn paketi ANCHA KATTA bo'lgani uchun biz uning HAMMASINI import qilmaymiz. Buning o'rniga faqat KERAKLI funksiyalarni import qilamiz."**

```python
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
```

> 💡 **Yaxshi amaliyot:** `import sklearn` **emas**, balki `from sklearn.X import Y`. Bu **tezroq** va **aniqroq**.

---

## 2. Ma'lumot

> **"Bu mashq uchun biz JUMLALAR va ular bilan bog'liq SENTIMENT namunaviy ma'lumot to'plamidan foydalanamiz. Biz jumlani sentiment balli bo'yicha tasniflay oladigan algoritm yaratmoqchimiz."**

```python
data_raw = [
    ("i love spending time with my friends and family", "positive"),
    ("that was the best meal i've ever had in my life", "positive"),
    ("i feel so grateful for everything i have in my life", "positive"),
    # ... jami 20 ta
    ("i'm disappointed because my team lost the game", "negative"),
]

data = pd.DataFrame(data_raw, columns=["text", "sentiment"])
print(data.shape)
print(data["sentiment"].value_counts())
```

```
(20, 2)
sentiment
positive    10
negative    10
```

> **"Bizda ma'lumot to'plami bor va ikkita ustun bor. Biz ularni TEXT va SENTIMENT deb nomladik."**

> ## ⚠️ **20 ta jumla. Eslab qoling — bu son bu modulning butun hikoyasini belgilaydi.**

---

## 3. Aralashtirish

> **"Keyingi qadam — matn bo'ylab ijobiy va salbiy sentiment jumlalarining YAXSHI ARALASHMASI borligiga ishonch hosil qilish uchun ma'lumotni ARALASHTIRISH."**
>
> **"Biz `data.sample()` dan `frac=1` bilan foydalanamiz. Bu shunchaki ma'lumotimizni aralashtiradi. Keyin indeksni TIKLAMOQCHIMIZ."**

```python
data = data.sample(frac=1, random_state=42)
data = data.reset_index(drop=True)
```

### 🔑 Nima uchun bu MUHIM?

```
ARALASHTIRISHSIZ:
  0-9   → positive     ← birinchi yarmi
  10-19 → negative     ← ikkinchi yarmi

train_test_split oxirgi 30% ni olsa:
  TEST = 6 ta, HAMMASI negative!
  → model faqat bitta sinfni ko'radi  ❌❌
```

> ## 💡 **`frac=1`** = *"100% ni tanla"* — ya'ni **hammasini**, lekin **tasodifiy tartibda**.
>
> 💡 **`random_state=42`** — takrorlanuvchanlik uchun *(25-modulni eslang)*.

---

## 4. X va y

> **"Keyin algoritmga berish uchun X va y ni yaratamiz. Bizning X — ma'lumotning TEXT ustuni, y esa — SENTIMENT."**

```python
X = data["text"]
y = data["sentiment"]
```

```
X  =  KIRISH   (nimadan o'rganamiz)
y  =  CHIQISH  (nimani bashorat qilamiz)
```

> 💡 **`X` katta harf, `y` kichik harf** — bu `sklearn` an'anasi. `X` — **matritsa** *(ko'p ustun)*, `y` — **vektor** *(bitta ustun)*.

---

## 5. Vektorlashtirish

> **"Keyin matn vektorlashtirishni qilamiz. Biz bu yerda `CountVectorizer` funksiyasi yordamida BAG OF WORDS dan foydalanamiz."**
>
> **"Albatta, siz kursda ilgari ko'rib chiqqan narsalar bilan ham tajriba qilishingiz mumkin — masalan TF-IDF vektorlashtirish."**

```python
count_vec = CountVectorizer()
count_vec_fit = count_vec.fit_transform(X)

bag_of_words = pd.DataFrame(count_vec_fit.toarray(),
                            columns=count_vec.get_feature_names_out())
print(bag_of_words.shape)
print(list(bag_of_words.columns[:10]))
```

```
(20, 118)
['accomplishment', 'after', 'always', 'am', 'an', 'and', 'argument', 'at', 'away', 'be']
```

```python
print(bag_of_words.iloc[:5, :8])
```

```
   accomplishment  after  always  am  an  and  argument  at
0               0      0       0   0   0    1         0   0
1               0      0       0   0   0    0         0   0
2               0      0       0   0   0    0         0   0
3               0      0       0   0   0    0         0   0
4               1      1       0   0   0    0         0   0
```

> **"Har bir QATOR — ma'lumotimizdagi alohida jumla, har bir USTUN — alohida so'z."**

### ⚠️ MANA MUAMMONING BIRINCHI BELGISI

```
20 ta qator  ×  118 ta ustun
     ↑              ↑
  MISOLLAR      XUSUSIYATLAR

118 > 20  →  XUSUSIYATLAR MISOLLARDAN 6 BARAVAR KO'P!
```

> ## ❌ **Bu — mashinali o'qitishdagi klassik muammo.** Model o'rganish uchun **yetarli misol yo'q**, lekin **juda ko'p** o'zgaruvchi bor. Natija: **yodlab olish** *(overfitting)*, o'rganish emas.

---

## 6. Train / test bo'lish

> **"Keyin algoritmimiz uchun O'RGATUVCHI va SINOV ma'lumotlarini yaratmoqchimiz."**
>
> **"Biz `train_test_split` funksiyasidan foydalanamiz. Sinov hajmini 0.3 deb ko'rsatamiz — ya'ni ma'lumotimizning 30% i sinov ma'lumoti uchun ajratiladi."**

```python
X_train, X_test, y_train, y_test = train_test_split(
    bag_of_words, y, test_size=0.3, random_state=42)

print("O'rgatuvchi:", X_train.shape[0])
print("Sinov      :", X_test.shape[0])
```

```
O'rgatuvchi: 14
Sinov      : 6
```

### ⚠️ MUAMMONING IKKINCHI BELGISI

```
SINOV = 6 ta jumla

Har bir to'g'ri javob = 1/6 = 16.7%

Ya'ni aniqlik faqat shu qiymatlarni olishi mumkin:
  0%  ·  16.7%  ·  33.3%  ·  50%  ·  66.7%  ·  83.3%  ·  100%
```

> ## 💡 **6 ta misolda "aniqlik" o'lchash — bu 6 marta tanga tashlab natijaga ishonish bilan barobar.**

---

## 7. Modelni o'qitish

> **"Endi logistik regressiya modelini yaratamiz. Biz uni `lr` deb ataymiz va `LogisticRegression` funksiyasidan foydalanamiz. Yana `random_state` ni ko'rsatamiz. Keyin `X_train` va `y_train` da `.fit()` dan foydalanamiz."**

```python
lr = LogisticRegression(random_state=0)
lr.fit(X_train, y_train)
```

### 🔑 Logistik regressiya nima qiladi?

```
Har bir SO'ZGA VAZN beradi:

   "love"       →  +2.4     (kuchli ijobiy)
   "terrible"   →  -3.1     (kuchli salbiy)
   "the"        →   0.1     (deyarli neytral)

Yangi jumla kelganda:
   vaznlarni QO'SHADI  →  yig'indi > 0 ?  →  positive
                          yig'indi < 0 ?  →  negative
```

> 💡 **Bu — eng TUSHUNARLI algoritm.** Siz **har bir so'zning ta'sirini** ko'ra olasiz *(9-bo'limga qarang)*.

---

## 8. Bashorat va aniqlik

> **"Keyin buni sinov ma'lumot to'plamiga qarshi bashorat qilishimiz mumkin. `y_pred_lr` yaratamiz va ajratib qo'ygan `X_test` da `lr.predict()` dan foydalanamiz."**

```python
y_pred_lr = lr.predict(X_test)
print(accuracy_score(y_pred_lr, y_test))
```

```
0.3333333333333333
```

> ## **"Bu yerda aniqlik JUDA PAST ekanini ko'ramiz. Demak, modelimiz UMUMAN yaxshi ishlamadi."**

### 🔍 Nima bo'ldi — qadamma-qadam

```python
print("Haqiqiy :", y_test.tolist())
print("Bashorat:", y_pred_lr.tolist())
```

```
Haqiqiy : ['positive', 'negative', 'negative', 'negative', 'negative', 'positive']
Bashorat: ['positive', 'positive', 'negative', 'positive', 'positive', 'negative']
             ✅          ❌          ✅          ❌          ❌          ❌

2 / 6 to'g'ri  =  33.3%
```

> ## ❌ **Tanga tashlash 50% berardi. Model tangadan ham YOMONROQ.**

---

## 9. Classification report

> **"Keyin algoritmimiz turli teglarni bashorat qilishda qanday ishlashini ko'rish uchun `classification_report` dan foydalanishimiz mumkin."**

```python
print(classification_report(y_test, y_pred_lr))
```

```
              precision    recall  f1-score   support

    negative       0.50      0.25      0.33         4
    positive       0.25      0.50      0.33         2

    accuracy                           0.33         6
   macro avg       0.38      0.38      0.33         6
weighted avg       0.42      0.33      0.33         6
```

### 🔑 Hisobotni o'qish

| Ustun | Ma'nosi | Savol |
|---|---|---|
| **precision** | Aniqlik | *"`negative` deganlarimning qanchasi haqiqatan negative?"* |
| **recall** | To'liqlik | *"Haqiqiy `negative` larning qanchasini topdim?"* |
| **f1-score** | Ikkalasining o'rtachasi | Umumiy baho |
| **support** | Nechta misol | Sinovda nechta bor edi |

```
negative:  precision 0.50  →  "negative" degan 2 tadan 1 tasi to'g'ri
           recall    0.25  →  4 ta haqiqiy negative'dan faqat 1 tasini topdi

positive:  precision 0.25  →  "positive" degan 4 tadan 1 tasi to'g'ri
           recall    0.50  →  2 ta haqiqiy positive'dan 1 tasini topdi
```

> ## ⚠️ **`support` ustuniga qarang: 4 va 2.** Butun sinov to'plami — **6 ta misol**. Bunday raqamlardan **hech qanday ishonchli xulosa** chiqarib bo'lmaydi.

---

## 10. ⭐ MUAMMONI ISBOTLAYMIZ

Bu — kursda **yo'q**, lekin **eng muhim** qism.

### Tajriba — 20 marta boshqa bo'linish

```python
import numpy as np
from sklearn.model_selection import train_test_split

ballar = []
for rs in range(20):
    Xtr, Xte, ytr, yte = train_test_split(bag_of_words, y, test_size=0.3,
                                          random_state=rs, stratify=y)
    m = LogisticRegression(random_state=0, max_iter=1000).fit(Xtr, ytr)
    ballar.append(accuracy_score(m.predict(Xte), yte))

print("Birinchi 10 ta ball:", [round(b, 2) for b in ballar[:10]])
print(f"MIN={min(ballar):.2f}  MAX={max(ballar):.2f}  "
      f"O'RTACHA={np.mean(ballar):.3f}  STD={np.std(ballar):.3f}")
```

```
Birinchi 10 ta ball: [0.5, 0.67, 0.17, 0.5, 0.5, 0.67, 0.67, 0.33, 0.5, 0.17]
MIN=0.17  MAX=0.83  O'RTACHA=0.483  STD=0.174
```

### 🎯 MANA ISBOT

```
BIR XIL model.  BIR XIL ma'lumot.  Faqat BO'LINISH boshqa.

  17%  ← eng yomon
  83%  ← eng yaxshi
      ↓
  66 FOIZLIK farq!
```

> ## 🔑 **Bu — modelning sifati EMAS.** Bu — **sof tasodif**. Agar `random_state=6` tanlasangiz, *"modelim 67% aniq"* deb aytardingiz. `random_state=2` bo'lsa — *"17%"*.
>
> ## ❌ **Ikkalasi ham MA'NOSIZ.**

### O'rtacha 48.3% — bu nima?

```
Tanga tashlash  =  50%
Bizning model   =  48.3%
                     ↑
        Model TANGADAN YAXSHIROQ EMAS.
        U HECH NARSA o'rganmadi.
```

---

## 11. 💻 To'liq kod

```python
import pandas as pd, numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# ===== 1 · MA'LUMOT =====
data = pd.DataFrame(data_raw, columns=["text", "sentiment"])
data = data.sample(frac=1, random_state=42).reset_index(drop=True)

X = data["text"]
y = data["sentiment"]

# ===== 2 · VEKTORLASHTIRISH =====
count_vec = CountVectorizer()
count_vec_fit = count_vec.fit_transform(X)
bag_of_words = pd.DataFrame(count_vec_fit.toarray(),
                            columns=count_vec.get_feature_names_out())
print("BOW:", bag_of_words.shape)          # (20, 118)

# ===== 3 · BO'LISH =====
X_train, X_test, y_train, y_test = train_test_split(
    bag_of_words, y, test_size=0.3, random_state=42)
print("Train:", X_train.shape[0], " Test:", X_test.shape[0])   # 14, 6

# ===== 4 · O'QITISH =====
lr = LogisticRegression(random_state=0)
lr.fit(X_train, y_train)

# ===== 5 · BASHORAT =====
y_pred_lr = lr.predict(X_test)
print("Aniqlik:", accuracy_score(y_pred_lr, y_test))     # 0.3333
print(classification_report(y_test, y_pred_lr))

# ===== 6 · MUAMMONI ISBOTLASH ⭐ =====
ballar = [accuracy_score(
    LogisticRegression(random_state=0, max_iter=1000)
        .fit(*train_test_split(bag_of_words, y, test_size=0.3,
                               random_state=rs, stratify=y)[::2])
        .predict(train_test_split(bag_of_words, y, test_size=0.3,
                                  random_state=rs, stratify=y)[1]),
    train_test_split(bag_of_words, y, test_size=0.3,
                     random_state=rs, stratify=y)[3])
    for rs in range(20)]
print(f"MIN={min(ballar):.2f}  MAX={max(ballar):.2f}  O'RTACHA={np.mean(ballar):.3f}")
```

---

## 12. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Lug'atda nechta so'z bor?

**M2.** Train va test hajmi qancha?

**M3.** `test_size` ni o'zgartirib ko'ring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(len(count_vec.get_feature_names_out()))       # 118
print("Misollar:", len(data))                       # 20
print("Nisbat:", round(118/20, 1), "xususiyat/misol")  # 5.9
# ❌ Har bir misolga 5.9 ta xususiyat — MODEL YODLAB OLADI

# M2
print(X_train.shape[0], X_test.shape[0])            # 14 6

# M3
for ts in [0.2, 0.3, 0.4, 0.5]:
    Xtr, Xte, ytr, yte = train_test_split(bag_of_words, y,
                                          test_size=ts, random_state=42)
    m = LogisticRegression(random_state=0, max_iter=1000).fit(Xtr, ytr)
    print(f"test_size={ts}  test={len(yte):2d} ta  "
          f"aniqlik={accuracy_score(m.predict(Xte), yte):.3f}")
#
# test_size=0.2  test= 4 ta  aniqlik=0.250
# test_size=0.3  test= 6 ta  aniqlik=0.333
# test_size=0.4  test= 8 ta  aniqlik=0.500
# test_size=0.5  test=10 ta  aniqlik=0.400
#
# ⚠️ HAMMASI 50% dan PAST yoki teng — tangadan yomonroq!
#
# 💡 Test kattaroq → o'qitish uchun kamroq ma'lumot
#    Test kichikroq → natija ishonchsizroq
#    20 ta misolda IKKALA yo'l ham yomon!
```

</details>

### 🟡 O'rta

**M4.** TF-IDF bilan sinab ko'ring.

**M5.** Model qaysi so'zlarga qanday vazn berdi?

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
from sklearn.feature_extraction.text import TfidfVectorizer
tv = TfidfVectorizer()
Xt = pd.DataFrame(tv.fit_transform(X).toarray(),
                  columns=tv.get_feature_names_out())
Xtr, Xte, ytr, yte = train_test_split(Xt, y, test_size=0.3, random_state=42)
m = LogisticRegression(random_state=0, max_iter=1000).fit(Xtr, ytr)
print("TF-IDF aniqligi:", accuracy_score(m.predict(Xte), yte))
# TF-IDF aniqligi: 0.3333333333333333
#
# 🔑 AYNAN BIR XIL natija (33.3%)!
#
# 💡 TF-IDF ham YORDAM BERMAYDI — muammo VEKTORLASHTIRISHDA emas.
#    Muammo — MA'LUMOT KAMLIGIDA.

# M5 — ⭐ MODELNI "OCHISH"
nomlar = count_vec.get_feature_names_out()
koef = lr.coef_[0]
print("Sinflar:", lr.classes_)
print("\nEng IJOBIY so'zlar:", [nomlar[j] for j in koef.argsort()[::-1][:8]])
print("Eng SALBIY so'zlar :", [nomlar[j] for j in koef.argsort()[:8]])
# Sinflar: ['negative' 'positive']
# Eng IJOBIY: ['in', 'life', 'of', 'am', 'me', 'work', 'happier', 'promotion']
# Eng SALBIY: ['and', 'the', 'terrible', 'headache', 'really', 'rejection', ...]
#
# ❌❌ QARANG — "in", "of", "am", "me" IJOBIY deb topilgan!
#      "and", "the" esa SALBIY!
#
# 🔑 Bu — MODEL SHOVQINNI O'RGANGANINING ISBOTI.
#    "in" va "of" hech qanday sentimentga ega EMAS.
#    Model 14 ta misolda ular qayerda uchraganini YODLAB OLDI.
#
# 💡 Lekin: "terrible", "headache", "rejection" TO'G'RI salbiy
#    tomonda. Model BIROZ narsa o'rgandi — lekin shovqin ostida.
#
# ⭐ Bu — logistik regressiyaning ENG KATTA AFZALLIGI:
#    modelning "fikrini" O'QIY olasiz va XATOSINI ko'rasiz.
```

</details>

### 🔴 Qiyin

**M6.** Aniqlikning tasodifga bog'liqligini o'lchang.

**M7.** Nima uchun 118 ustun 20 qator uchun ko'p?

<details>
<summary>✅ Yechimlar</summary>

```python
# M6
import numpy as np
ballar = []
for rs in range(20):
    Xtr, Xte, ytr, yte = train_test_split(bag_of_words, y, test_size=0.3,
                                          random_state=rs, stratify=y)
    m = LogisticRegression(random_state=0, max_iter=1000).fit(Xtr, ytr)
    ballar.append(accuracy_score(m.predict(Xte), yte))
print(f"MIN={min(ballar):.2f} MAX={max(ballar):.2f} "
      f"O'RTACHA={np.mean(ballar):.3f} STD={np.std(ballar):.3f}")
# MIN=0.17 MAX=0.83 O'RTACHA=0.483 STD=0.174
#
# ❌ 17% dan 83% gacha! Bu — MODEL emas, TASODIF.
#    O'rtacha 48.3% — tanga tashlashdan (50%) ham PAST.

# M7
print("""
118 ustun, 20 qator, 14 tasi o'qitishda.

Model 118 ta VAZNNI 14 ta misoldan o'rganishi kerak.
Bu — 3 ta noma'lumli tenglamani 1 ta tenglama bilan yechish
bilan barobar: CHEKSIZ KO'P yechim bor, hech biri to'g'ri emas.

Natija: model o'rgatuvchi ma'lumotni YODLAB OLADI (100% aniqlik),
lekin yangi ma'lumotda YIQILADI.

Bu — OVERFITTING (haddan tashqari moslashish).
""")

# Isbot:
print("O'rgatuvchi ma'lumotdagi aniqlik:",
      accuracy_score(lr.predict(X_train), y_train))
print("Sinov ma'lumotidagi aniqlik    :",
      accuracy_score(lr.predict(X_test), y_test))
# O'rgatuvchi ma'lumotdagi aniqlik: 1.0
# Sinov ma'lumotidagi aniqlik    : 0.3333333333333333
#
# 🎯 MANA OVERFITTING'NING MUKAMMAL NAMUNASI!
#
#    O'RGATUVCHI: 100%   ← model 14 ta jumlani YODLAB OLDI
#    SINOV      :  33%   ← yangi jumlada YIQILDI
#
# 🔑 Model o'rganmadi — U YODLADI.
#    118 ta vazn, 14 ta misol → yodlash uchun joy YETARLI.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Nima uchun ma'lumot aralashtiriladi?
2. `frac=1` nima qiladi?
3. `X` va `y` nima?
4. `test_size=0.3` nechta misol beradi?
5. Aniqlik qancha chiqdi?
6. `precision` va `recall` farqi nimada?
7. Nima uchun natija yomon — modelmi yoki ma'lumotmi?

<details>
<summary>✅ Javoblar</summary>

1. Toki test to'plamiga **ikkala sinf** ham tushsin. Aralashtirmasangiz — test **faqat bitta sinfdan** iborat bo'lishi mumkin.
2. **100% ni tanlaydi** — ya'ni hammasini, lekin **tasodifiy tartibda**.
3. **`X`** = kirish *(matn)*, **`y`** = chiqish *(yorliq)*.
4. **6 ta** *(20 × 0.3)*. O'qitishga **14 ta** qoladi.
5. **33.3%** — ya'ni 6 tadan **2 tasi** to'g'ri.
6. **precision:** *"`X` deganlarimning qanchasi to'g'ri?"* **recall:** *"Haqiqiy `X` larning qanchasini topdim?"*
7. ## **MA'LUMOT!** 20 ta misol, 118 ta xususiyat, 6 ta test. Aniqlik `random_state` ga qarab **17%–83%** oralig'ida sakraydi.

</details>

---

## 📌 Xulosa

```python
# ===== 5 QADAM =====
data = data.sample(frac=1, random_state=42).reset_index(drop=True)   # 1 aralashtirish
X, y = data["text"], data["sentiment"]                               # 2 X va y
bow = CountVectorizer().fit_transform(X)                             # 3 vektorlashtirish
X_train, X_test, y_train, y_test = train_test_split(bow, y,
                                    test_size=0.3, random_state=42)  # 4 bo'lish
lr = LogisticRegression(random_state=0).fit(X_train, y_train)        # 5 o'qitish

y_pred = lr.predict(X_test)
accuracy_score(y_pred, y_test)        # 0.3333  ❌


LOGISTIK REGRESSIYA
  Har SO'ZGA VAZN beradi → yig'indisiga qarab qaror qiladi
  ⭐ ENG TUSHUNARLI algoritm — lr.coef_ ni o'qiy olasiz


❌ NATIJA: 33.3%   (tanga tashlash 50%!)

Haqiqiy : positive negative negative negative negative positive
Bashorat: positive positive negative positive positive negative
             ✅       ❌       ✅       ❌       ❌       ❌


⭐ MUAMMO — ALGORITMDA EMAS, MA'LUMOTDA

  20 ta misol, 118 ta ustun  →  5.9 xususiyat/misol
  Test = ATIGI 6 ta misol

  20 marta boshqa bo'linish:
     MIN=0.17   MAX=0.83   O'RTACHA=0.483   STD=0.174
              ↑
     66 FOIZLIK farq — SOF TASODIF!

  O'rtacha 48.3% < tanga tashlash 50%
  → Model HECH NARSA o'rganmadi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Bazaviy model | *baseline model* | Taqqoslash uchun sodda model |
| Aralashtirish | *shuffle* | Tartibni tasodifiy qilish |
| O'rgatuvchi to'plam | *training set* | Model o'rganadigan ma'lumot |
| Sinov to'plami | *test set* | Model ko'rmagan ma'lumot |
| Koeffitsiyent | *coefficient* | So'zning vazni |
| Overfitting | *overfitting* | Yodlab olish, o'rganish emas |
| Precision | *precision* | Bashoratlarning to'g'riligi |
| Recall | *recall* | Topilganlarning to'liqligi |

---

⬅️ [Oldingi: Kirish](01-Building-a-Custom-Classifier.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Naive Bayes](03-Naive-Bayes.md)
