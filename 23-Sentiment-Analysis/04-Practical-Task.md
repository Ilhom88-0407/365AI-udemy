# 4-dars. Amaliy vazifa — 100 ta kitob sharhi

## 🎬 Boshlashdan oldin

> **"Endi bu sentiment modellarini ANCHA REALISTIK ma'lumotda sinab ko'raylik."**
>
> **"Biz buning uchun KITOB SHARHLARI namunasidan foydalanamiz va turli sharhlar ustida sentimentni ishga tushiramiz."**

📁 **Ma'lumot:** [`data/book_reviews_sample.csv`](data/book_reviews_sample.csv) — **100 ta** haqiqiy kitob sharhi **reytingi bilan**.

> ## ⭐ **Bu ma'lumotning qimmatliligi — unda HAQIQIY JAVOB (reyting) bor.** Ya'ni biz modellarning **qanchalik to'g'ri** ishlaganini **o'lchay olamiz**.

---

## 1. Ma'lumotni yuklash

> **"Demak, biz `pd.read_csv()` yordamida ma'lumotimizni yuklashdan boshlaymiz."**

```python
import pandas as pd
import re

data = pd.read_csv("data/book_reviews_sample.csv")
print(data.shape)
print(data.columns.tolist())
```

```
(100, 3)
['index', 'reviewText', 'rating']
```

> **"O'qib bo'lgach, unga qarash uchun `data.head()` qilishimiz mumkin. Ko'ramizki, bizda uchta ustun bor: biri INDEKS, biri SHARH MATNI va biri REYTING balli."**

```python
print(data.head(3).to_string())
```

```
   index                                                                                            reviewText  rating
0  11494  Clean and funny. A bit busy with all the different plots going on. But overall a good read. Bye now.       3
1    984  Alex a sexy hot cop and the PhD candidate. What a match that makes for a great fun and exciting book       4
2   1463         Good thing that this is a free story. I read it a few years ago and it is not worth the time.       1
```

> **"Keling, sharhlardan biriga qaraylik."**

```python
print(data["reviewText"][0])
```

```
Clean and funny. A bit busy with all the different plots going on. But overall a good read. Bye now.
```

### ⚠️ 3-qatorga DIQQAT!

```
"Good thing that this is a free story. I read it a few years ago
 and it is not worth the time."                       reyting: 1 ⭐
  ↑                                    ↑
"Good" bilan BOSHLANADI          lekin "not worth the time"

Bu — modellarni SINAYDIGAN jumla. Eslab qoling.
```

---

## 2. Tozalash — 21-modulni takrorlash

> **"Birinchi qadam — bir oz TOZALASH. Biz `review_text_clean` yangi ustunini yaratamiz va `data.apply()` dan foydalanib, tinish belgilarni olib tashlash va matnni kichik harfga o'tkazish uchun lambda funksiyasini ishga tushiramiz."**

```python
data["reviewText_clean"] = data["reviewText"].apply(
    lambda x: re.sub(r"[^\w\s]", "", x).lower())

print(data[["reviewText_clean", "rating"]].head(3).to_string())
```

```
                                                                                      reviewText_clean  rating
0     clean and funny a bit busy with all the different plots going on but overall a good read bye now       3
1  alex a sexy hot cop and the phd candidate what a match that makes for a great fun and exciting book       4
2          good thing that this is a free story i read it a few years ago and it is not worth the time       1
```

### 🔑 ⚠️ ENG MUHIM QARORI — NIMA QILINMAYDI

> ## **"Biz TO'XTATISH SO'ZLARNI OLIB TASHLAMAYMIZ, LEMMATIZATSIYA yoki STEMMING QILMAYMIZ — chunki bu so'zlar sentiment tahlili ishlashi uchun KERAK BO'LADI."**

```
❌ 21-MODULDAGI QUVUR                ✅ SENTIMENT UCHUN

1 · kichik harf        ✅            1 · kichik harf        ✅
2 · to'xtatish so'zlar ✅            2 · to'xtatish so'zlar ❌ QILINMAYDI
3 · tinish belgilar    ✅            3 · tinish belgilar    ✅
4 · tokenizatsiya      ✅            4 · tokenizatsiya      ❌ QILINMAYDI
5 · lemmatizatsiya     ✅            5 · lemmatizatsiya     ❌ QILINMAYDI
```

**Nima uchun?**

| Qadam | Nima uchun sentiment uchun ZARARLI |
|---|---|
| **To'xtatish so'zlar** | `not`, `no`, `never` — **inkor** ro'yxatda! Ularsiz `"not good"` → `"good"` ❌ |
| **Lemmatizatsiya** | `"loved"` → `"love"` — **o'tgan zamon yo'qoladi**, ohang o'zgaradi |
| **Stemming** | `"terrible"` → `"terribl"` — **lug'atda bunday so'z YO'Q** → **0 ball!** ❌❌ |
| **Tokenizatsiya** | VADER va TextBlob **to'liq matnni** kutadi, ro'yxat emas |

> ## 💡 **ENG MUHIM SABOQ:** *"Oldindan qayta ishlash"* — **universal retsept EMAS**. Har bir vazifa **o'z tozalashini** talab qiladi.

> **"Odatda xohlasangiz tinish belgilarni QOLDIRISHINGIZ ham mumkin — lekin bizning holatimizda biz ularni to'g'ridan-to'g'ri olib tashlaymiz."**

> ⚠️ **Aslida VADER uchun tinish belgi ham FOYDALI** — u `!!!` va emojini o'qiydi. Bu yerda ularni o'chirish — **biroz sentimentni yo'qotish** demak. *(10-bo'limdagi M6 mashqida buni o'lchaymiz.)*

---

## 3. VADER sentiment

> **"Keling, to'g'ridan-to'g'ri VADER sentimentga o'taylik. Biz sentiment analizatorni ishga tushirishdan boshlaymiz."**

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

vader_sentiment = SentimentIntensityAnalyzer()
```

> **"Keyin sentiment ballimiz uchun yangi ustun yaratamiz. `data` ichida `vader_sentiment_score` yangi ustunini yaratamiz."**

```python
data["vader_sentiment_score"] = data["reviewText_clean"].apply(
    lambda r: vader_sentiment.polarity_scores(r)["compound"])

print(data[["reviewText_clean", "vader_sentiment_score"]].head(3).to_string())
```

```
                                                                                      reviewText_clean  vader_sentiment_score
0     clean and funny a bit busy with all the different plots going on but overall a good read bye now                 0.7684
1  alex a sexy hot cop and the phd candidate what a match that makes for a great fun and exciting book                 0.9325
2          good thing that this is a free story i read it a few years ago and it is not worth the time                 0.6740
```

### ⚠️ 3-QATOR — MODEL YIQILDI!

```
"good thing ... it is not worth the time"      HAQIQIY REYTING: 1 ⭐
                                     VADER BALLI: +0.6740  😀

❌ Model buni JUDA IJOBIY deb baholadi.
   Aslida bu — ENG YOMON reytingli sharh!
```

**Nima uchun?**

```
"Good thing"        →  +   VADER buni ko'rdi
"free"              →  +   VADER buni ham ko'rdi
"not worth"         →  −   VADER inkorni ko'rdi, LEKIN...
                           "worth" lug'atda KUCHSIZ so'z

Yig'indi:  +0.674   ← ijobiy so'zlar G'OLIB keldi
```

> ## 🔑 **Mana qoidaga asoslangan usulning haqiqiy chekloviː** u so'zlarni **sanaydi**, lekin jumlaning **umumiy ma'nosini** tushunmaydi. Insonlar `"not worth the time"` **butun sharhning xulosasi** ekanini ko'radi. VADER esa — **ko'rmaydi**.

---

## 4. Ballarni yorliqqa aylantirish

> **"Endi biz bu ballarni olib, ularni IJOBIY, SALBIY va NEYTRALGA tasniflashni xohlaymiz. Shunday qilib, biz BINLARIMIZNI yaratamiz."**
>
> **"Bittasi -1 dan -0.1 gacha. Yana biri -0.1 dan +0.1 gacha. Va 0.1 dan 1 gacha."**

```python
bins = [-1, -0.1, 0.1, 1]
names = ["negative", "neutral", "positive"]

data["vader_sentiment_label"] = pd.cut(
    data["vader_sentiment_score"], bins=bins, labels=names)

print(data["vader_sentiment_label"].value_counts())
```

```
vader_sentiment_label
positive    68
negative    19
neutral     13
```

### 🔑 `pd.cut()` — uzluksiz ballni GURUHGA aylantirish

```
  -1.0        -0.1        +0.1         +1.0
   │───────────│───────────│────────────│
     negative     neutral     positive
       19 ta       13 ta        68 ta
```

> **"Keyin `pd.cut()` dan foydalanib, sentiment balliga asoslangan turli guruhlarni yaratamiz. Shunday qilib, biz turli binlardan o'tamiz, o'sha ball qaysi chelakka tegishli ekanini aniqlaymiz va keyin unga `names` da belgilagan yorliqni beramiz."**

### 📊 Diagramma

> **"Bu bilan biz ma'lumot to'plamimizdagi turli sentimentlarning CHASTOTASINING juda chiroyli va oddiy ustunli diagrammasini yarata olamiz."**

```python
data["vader_sentiment_label"].value_counts().plot.bar()
```

```
positive  ████████████████████████████████████  68
negative  ██████████  19
neutral   ███████  13
```

---

## 5. ⭐⭐ Modelni HAQIQAT bilan solishtiramiz

Bu — kursda **yo'q**, lekin **eng muhim** qadam. Bizda **reyting** bor — foydalanamiz!

```python
print(data.groupby("rating")["vader_sentiment_score"]
          .agg(["count", "mean"]).round(3))
```

```
        count   mean
rating
1          27 -0.101
2          10  0.055
3          17  0.375
4          25  0.668
5          21  0.638
```

### 📈 Vizual

```
5 ⭐  ████████████████████████████  +0.638
4 ⭐  █████████████████████████████ +0.668   ← 5 dan YUQORI?!
3 ⭐  ████████████████  +0.375
2 ⭐  ██  +0.055
1 ⭐  ▌ -0.101
```

### ✅ Yaxshi xabar

**Umumiy tendensiya TO'G'RI** — reyting oshgani sari VADER balli ham oshadi.

### ⚠️ Ikkita muammo

**① 4 ⭐ (0.668) > 5 ⭐ (0.638)**

Model eng yuqori reytingni **eng yuqori** baholamadi. Farq kichik, lekin **tartib buzilgan**.

**② 1 ⭐ o'rtacha atigi −0.101**

```
Eng yomon sharhlar o'rtacha ATIGI -0.101 ball oldi.
Ya'ni deyarli NEYTRAL!

Aslida ular  -0.6 · -0.8  atrofida bo'lishi kerak edi.
```

### 🔍 1-yulduzli sharhlarni tekshiramiz

```python
xato = data[(data["rating"] == 1) & (data["vader_sentiment_label"] == "positive")]
print(f"1 ⭐ bo'lgan, lekin 'positive' deb belgilangan: {len(xato)} ta\n")
for _, r in xato.head(3).iterrows():
    print(f"  ball={r['vader_sentiment_score']:+.3f} | {r['reviewText'][:70]}")
```

```
1 ⭐ bo'lgan, lekin 'positive' deb belgilangan: 9 ta

  ball=+0.674 | Good thing that this is a free story. I read it a few years ago
  ball=+0.511 | let down. Did not think it was worth the money spent at all. Not
  ball=+0.248 | This was to short. I will not be telling my friends bout it. I di
```

> ## ❌ **27 ta 1-yulduzli sharhdan 9 tasi (33%) "ijobiy" deb belgilandi.** Bu — **jiddiy xato**.

---

## 6. Transformer modeli

> **"Endi oldindan o'qitilgan transformerlarimizga o'tamiz. Biz `pipeline` funksiyasidan foydalanib transformer quvurini ishga tushiramiz."**

```python
from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis")
```

> **"Keyin transformer yorliqlarimiz uchun bo'sh ro'yxat yaratamiz va ma'lumot to'plamimizdagi har bir qator uchun yorliqlarni olish uchun `for` siklidan foydalanamiz."**

```python
transformer_labels = []

for review in data["reviewText_clean"]:
    sentiment_list = sentiment_pipeline(review[:512])
    sentiment_label = sentiment_list[0]["label"]
    transformer_labels.append(sentiment_label)

data["transformer_sentiment_label"] = transformer_labels

print(data["transformer_sentiment_label"].value_counts())
```

```
transformer_sentiment_label
POSITIVE    54
NEGATIVE    46
```

> **"Yana biz ma'lumot to'plamimizga tayinlangan ijobiy va salbiylar sonini vizuallashtirish uchun juda oddiy ustunli diagramma yarata olamiz."**
>
> ## **"Ko'rishimiz mumkinki, bizda salbiylardan biroz ko'proq ijobiylar bor. Bizda NEYTRALLAR YO'Q — chunki biz ishlatgan model TURI shunday."**

```
POSITIVE  ███████████████████████████  54
NEGATIVE  ███████████████████████  46
NEUTRAL   (yo'q — model bilmaydi)
```

> 💡 **`review[:512]`** — transformerlar **uzunlik chegarasiga** ega *(odatda 512 token)*. Uzun matnni **kesish** kerak, aks holda xato beradi.

---

## 7. ⭐⭐ Transformer — HAQIQAT bilan solishtiramiz

```python
print(pd.crosstab(data["rating"], data["transformer_sentiment_label"]))
```

```
transformer_label  NEGATIVE  POSITIVE
rating
1                        26         1
2                         9         1
3                         9         8
4                         2        23
5                         0        21
```

### 🎯 MANA BU — AJOYIB NATIJA

```
1 ⭐  →  26 NEGATIVE,  1 POSITIVE     ✅  96% to'g'ri
2 ⭐  →   9 NEGATIVE,  1 POSITIVE     ✅  90% to'g'ri
3 ⭐  →   9 NEGATIVE,  8 POSITIVE     ⚠️  TENG BO'LINDI
4 ⭐  →   2 NEGATIVE, 23 POSITIVE     ✅  92% to'g'ri
5 ⭐  →   0 NEGATIVE, 21 POSITIVE     ✅  100% to'g'ri  ⭐
```

**5 yulduzli 21 ta sharhning HAMMASINI to'g'ri topdi. Bittasi ham xato emas.**

### 🔑 3 ⭐ nima uchun teng bo'lindi?

```
3 yulduz = NEYTRAL sharh
             ↓
   Model NEYTRAL yorlig'ini BILMAYDI
             ↓
   Har bir sharh uchun MAJBURAN pos yoki neg tanlaydi
             ↓
   Natija: 9 va 8 — deyarli TANGA TASHLASH  🪙
```

> ## 💡 **Bu XATO EMAS — bu MODEL CHEKLOVI.** Va biz uni **aniq raqamda** ko'rdik. Agar neytral kerak bo'lsa — **boshqa model** *(3-darsdagi twitter modeli)*.

---

## 8. 🏆 Uch usulni ANIQLIK bo'yicha solishtiramiz

Reytingdan **haqiqiy yorliq** yasaymiz va **aniqlikni o'lchaymiz**:

```python
def haqiqiy_yorliq(r):
    if r <= 2:  return "negative"
    elif r == 3: return "neutral"
    else:        return "positive"

data["haqiqiy"] = data["rating"].apply(haqiqiy_yorliq)
print(data["haqiqiy"].value_counts())
```

```
positive    46
negative    37
neutral     17
```

```python
from textblob import TextBlob

data["textblob_score"] = data["reviewText_clean"].apply(
    lambda r: TextBlob(r).sentiment.polarity)
data["textblob_label"] = pd.cut(data["textblob_score"], bins=bins, labels=names)

for nom, ustun in [("VADER", "vader_sentiment_label"),
                   ("TextBlob", "textblob_label"),
                   ("Transformer", "transformer_sentiment_label")]:
    toliq = (data[ustun].astype(str).str.lower() == data["haqiqiy"]).mean()
    faqat = data[data["haqiqiy"] != "neutral"]
    neytralsiz = (faqat[ustun].astype(str).str.lower() == faqat["haqiqiy"]).mean()
    print(f"{nom:12s} to'liq={toliq:6.1%}   neytralsiz={neytralsiz:6.1%}")
```

```
VADER        to'liq= 64.0%   neytralsiz= 72.3%
TextBlob     to'liq= 53.0%   neytralsiz= 63.9%
Transformer  to'liq= 79.0%   neytralsiz= 95.2%
```

### 🥇 G'olib — TRANSFORMER

```
NEYTRAL SHARHLARSIZ (faqat aniq ijobiy/salbiy):

Transformer  ███████████████████████████████████████  95.2%   🥇
VADER        ██████████████████████████████  72.3%            🥈
TextBlob     ██████████████████████████  63.9%                🥉
```

> ## 🎯 **Transformer 95.2% — bu HAQIQATAN yaxshi natija.** VADER'dan **23 foizga** yuqori.

### ⚠️ Lekin narxi bor

| | **VADER** | **Transformer** |
|---|---|---|
| **Aniqlik** *(neytralsiz)* | 72.3% | **95.2%** 🏆 |
| **Hajmi** | **~1 MB** 🏆 | 250 MB |
| **100 ta sharhga vaqt** | **<1 soniya** 🏆 | ~30 soniya |
| **Internet** | **kerak emas** 🏆 | 1-marta kerak |
| **Neytral** | **bor** 🏆 | yo'q |
| **Tushuntirish** | **oson** 🏆 | qora quti |

> ## 💡 **Qaysi birini tanlash?**
>
> - **Millionlab tvit, real vaqtda** → **VADER** *(tez, arzon)*
> - **Muhim qaror, aniqlik kerak** → **Transformer**
> - **Ikkalasi ham** → VADER bilan **filtrlang**, keyin shubhali holatlarni transformerga bering ⭐

---

## 9. 💻 To'liq kod

```python
import pandas as pd, re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from transformers import pipeline

# ===== 1 · MA'LUMOT =====
data = pd.read_csv("data/book_reviews_sample.csv")

# ===== 2 · TOZALASH (faqat kichik harf + tinish belgi!) =====
data["reviewText_clean"] = data["reviewText"].apply(
    lambda x: re.sub(r"[^\w\s]", "", x).lower())

# ===== 3 · VADER =====
vader_sentiment = SentimentIntensityAnalyzer()
data["vader_sentiment_score"] = data["reviewText_clean"].apply(
    lambda r: vader_sentiment.polarity_scores(r)["compound"])

bins  = [-1, -0.1, 0.1, 1]
names = ["negative", "neutral", "positive"]
data["vader_sentiment_label"] = pd.cut(
    data["vader_sentiment_score"], bins=bins, labels=names)
print("VADER:"); print(data["vader_sentiment_label"].value_counts())

# ===== 4 · TRANSFORMER =====
sentiment_pipeline = pipeline("sentiment-analysis")
transformer_labels = []
for review in data["reviewText_clean"]:
    transformer_labels.append(sentiment_pipeline(review[:512])[0]["label"])
data["transformer_sentiment_label"] = transformer_labels
print("\nTRANSFORMER:"); print(data["transformer_sentiment_label"].value_counts())

# ===== 5 · HAQIQAT BILAN SOLISHTIRISH ⭐ =====
data["haqiqiy"] = data["rating"].apply(
    lambda r: "negative" if r <= 2 else ("neutral" if r == 3 else "positive"))

data["textblob_score"] = data["reviewText_clean"].apply(
    lambda r: TextBlob(r).sentiment.polarity)
data["textblob_label"] = pd.cut(data["textblob_score"], bins=bins, labels=names)

print("\n=== ANIQLIK ===")
for nom, ustun in [("VADER", "vader_sentiment_label"),
                   ("TextBlob", "textblob_label"),
                   ("Transformer", "transformer_sentiment_label")]:
    t = (data[ustun].astype(str).str.lower() == data["haqiqiy"]).mean()
    f = data[data["haqiqiy"] != "neutral"]
    n = (f[ustun].astype(str).str.lower() == f["haqiqiy"]).mean()
    print(f"{nom:12s} to'liq={t:6.1%}   neytralsiz={n:6.1%}")

print("\n=== TRANSFORMER x REYTING ===")
print(pd.crosstab(data["rating"], data["transformer_sentiment_label"]))
```

**Natija:**

```
VADER:
positive    68
negative    19
neutral     13

TRANSFORMER:
POSITIVE    54
NEGATIVE    46

=== ANIQLIK ===
VADER        to'liq= 64.0%   neytralsiz= 72.3%
TextBlob     to'liq= 53.0%   neytralsiz= 63.9%
Transformer  to'liq= 79.0%   neytralsiz= 95.2%

=== TRANSFORMER x REYTING ===
transformer_sentiment_label  NEGATIVE  POSITIVE
rating
1                                  26         1
2                                   9         1
3                                   9         8
4                                   2        23
5                                   0        21
```

---

## 10. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** VADER bo'yicha eng ijobiy va eng salbiy sharhni toping.

**M2.** VADER va Transformer necha marta rozi?

**M3.** VADER crosstab'ini chizing.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
eng_i = data.loc[data["vader_sentiment_score"].idxmax()]
eng_s = data.loc[data["vader_sentiment_score"].idxmin()]
print(f"ENG IJOBIY ({eng_i['vader_sentiment_score']:+.4f}, "
      f"reyting {eng_i['rating']}):\n  {eng_i['reviewText'][:80]}\n")
print(f"ENG SALBIY ({eng_s['vader_sentiment_score']:+.4f}, "
      f"reyting {eng_s['rating']}):\n  {eng_s['reviewText'][:80]}")

# M2
roz = (data["vader_sentiment_label"].astype(str).str.lower() ==
       data["transformer_sentiment_label"].str.lower()).sum()
print(f"{roz}/100 marta rozi")

# M3
print(pd.crosstab(data["rating"], data["vader_sentiment_label"]))
#         negative  neutral  positive
# rating
# 1             12        6         9
# 2              4        2         4
# 3              2        4        11
# 4              1        1        23
# 5              0        0        21
#
# ⚠️ 1 ⭐ qatoriga qarang: 12 negative, LEKIN 9 positive!
#    Transformer'da bu 26 va 1 edi. FARQ JUDA KATTA.
```

</details>

### 🟡 O'rta

**M4.** VADER eng ko'p **qayerda** xato qiladi?

**M5.** Uzun va qisqa sharhlarda aniqlik farq qiladimi?

**M6.** ⭐ Tinish belgilarni **saqlab** VADER'ni qayta ishga tushiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
data["v_lab"] = data["vader_sentiment_label"].astype(str)
xato = data[data["v_lab"] != data["haqiqiy"]]
print(f"Jami xato: {len(xato)}/100\n")
print(pd.crosstab(xato["haqiqiy"], xato["v_lab"]))

# M5
data["uzunlik"] = data["reviewText"].str.split().str.len()
data["v_togri"] = data["v_lab"] == data["haqiqiy"]
data["guruh"] = pd.cut(data["uzunlik"], [0, 15, 30, 1000],
                       labels=["qisqa", "o'rta", "uzun"])
print(data.groupby("guruh", observed=True)["v_togri"]
          .agg(["count", "mean"]).round(3))

# M6 ⭐ TINISH BELGI SENTIMENTGA TA'SIR QILADIMI?
data["xom_vader"] = data["reviewText"].apply(
    lambda r: vader_sentiment.polarity_scores(r)["compound"])
data["xom_lab"] = pd.cut(data["xom_vader"], bins=bins, labels=names)

toza_acc = (data["v_lab"] == data["haqiqiy"]).mean()
xom_acc  = (data["xom_lab"].astype(str) == data["haqiqiy"]).mean()
print(f"Tozalangan matn : {toza_acc:.1%}")
print(f"XOM matn        : {xom_acc:.1%}")

farq = data[data["v_lab"] != data["xom_lab"].astype(str)]
print(f"\n{len(farq)} ta sharhda natija O'ZGARDI")
for _, r in farq.head(3).iterrows():
    print(f"  toza={r['vader_sentiment_score']:+.3f} → "
          f"xom={r['xom_vader']:+.3f} | {r['reviewText'][:55]}")
```

</details>

### 🔴 Qiyin

**M7.** Uch usulning **kelishuvi** bo'yicha ishonch darajasini yarating.

**M8.** Modellarni **birlashtiring** *(ensemble)* va aniqlikni oshiring.

**M9.** Neytral yorliqli transformer bilan qayta o'lchang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — KELISHUV = ISHONCH
data["t_lab"] = data["textblob_label"].astype(str)
data["tf_lab"] = data["transformer_sentiment_label"].str.lower()

def kelishuv(r):
    ovozlar = [r["v_lab"], r["t_lab"], r["tf_lab"]]
    return max(set(ovozlar), key=ovozlar.count), \
           ovozlar.count(max(set(ovozlar), key=ovozlar.count))

data[["ovoz", "kelishuv"]] = data.apply(
    lambda r: pd.Series(kelishuv(r)), axis=1)

print(data.groupby("kelishuv").apply(
    lambda g: pd.Series({
        "soni": len(g),
        "aniqlik": round((g["ovoz"] == g["haqiqiy"]).mean(), 3)
    }), include_groups=False))
#
# 💡 UCHALASI ROZI bo'lganda aniqlik ANCHA YUQORI bo'lishi kerak.
#    Bu — ISHONCH DARAJASINI aniqlashning oddiy va kuchli usuli:
#    "uchta modelim ham rozi" = ishonarli
#    "modellarim bo'lindi"    = ODAM tekshirsin!

# M8 — ENSEMBLE (ko'pchilik ovozi)
ens = (data["ovoz"] == data["haqiqiy"]).mean()
print(f"\nEnsemble aniqligi : {ens:.1%}")
for nom, c in [("VADER","v_lab"), ("TextBlob","t_lab"), ("Transformer","tf_lab")]:
    print(f"{nom:12s}      : {(data[c]==data['haqiqiy']).mean():.1%}")

# M9 — NEYTRALLI TRANSFORMER
uch = pipeline(model="cardiffnlp/twitter-roberta-base-sentiment-latest")
data["tf3"] = [uch(r[:512])[0]["label"].lower()
               for r in data["reviewText_clean"]]
print("\n=== 3 YORLIQLI TRANSFORMER ===")
print(data["tf3"].value_counts())
print(f"Aniqlik: {(data['tf3'] == data['haqiqiy']).mean():.1%}")
print(pd.crosstab(data["rating"], data["tf3"]))
#
# 💡 Endi model NEYTRALNI ham tanlay oladi — 3 ⭐ sharhlar
#    qanday taqsimlanishini ko'ring.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Ma'lumot to'plamida nechta sharh bor?
2. Qanday tozalash qilindi va **nima qilinmadi**?
3. Nima uchun to'xtatish so'zlar **olib tashlanmadi**?
4. `pd.cut()` nima qiladi?
5. `review[:512]` nima uchun kerak?
6. Transformer'da nima uchun **neytral yo'q**?
7. Qaysi usul eng aniq va **qancha**?
8. 3-qatordagi sharh nima uchun VADER'ni chalg'itdi?

<details>
<summary>✅ Javoblar</summary>

1. **100 ta** kitob sharhi, **reytingi bilan**.
2. **Faqat:** kichik harf + tinish belgilarni o'chirish. ## **Qilinmagan:** to'xtatish so'zlar, lemmatizatsiya, stemming, tokenizatsiya.
3. Chunki ular ichida **`not`, `no`, `never`** — **inkor** so'zlari bor. Ularsiz `"not good"` → `"good"` bo'lib **ma'no teskari** aylanadi.
4. Uzluksiz **ballni** belgilangan **oraliqlarga** *(bin)* bo'lib, har biriga **yorliq** beradi.
5. Transformerlarning **uzunlik chegarasi** bor *(odatda 512 token)*. Uzun matn — **xato**.
6. Chunki standart model **SST-2** ma'lumotida o'qitilgan — u yerda faqat **POSITIVE/NEGATIVE** bor.
7. ## **Transformer** — neytralsiz **95.2%** *(VADER 72.3%, TextBlob 63.9%)*.
8. `"Good thing... free"` — **ijobiy so'zlar** ko'p edi. `"not worth the time"` **butun xulosani** o'zgartirsa ham, VADER **so'zlarni sanaydi**, xulosani **tushunmaydi**.

</details>

---

## 📌 Xulosa

```python
# ===== TOZALASH — FAQAT SHU IKKISI! =====
data["clean"] = data["reviewText"].apply(
    lambda x: re.sub(r"[^\w\s]", "", x).lower())
# ❌ to'xtatish so'zlar YO'Q  (inkor kerak!)
# ❌ lemmatizatsiya YO'Q      (ohang yo'qoladi)
# ❌ stemming YO'Q            (lug'atdan tushib qoladi)

# ===== VADER =====
data["score"] = data["clean"].apply(
    lambda r: vader_sentiment.polarity_scores(r)["compound"])
data["label"] = pd.cut(data["score"],
                       bins=[-1, -0.1, 0.1, 1],
                       labels=["negative", "neutral", "positive"])

# ===== TRANSFORMER =====
p = pipeline("sentiment-analysis")
[p(r[:512])[0]["label"] for r in data["clean"]]
#      ↑ uzunlik chegarasi!


ANIQLIK (100 ta kitob sharhi, haqiqiy reyting bilan)

              to'liq   neytralsiz
Transformer    79.0%     95.2%    🥇
VADER          64.0%     72.3%    🥈
TextBlob       53.0%     63.9%    🥉


TRANSFORMER x REYTING
  1 ⭐  26 NEG,  1 POS    ✅
  2 ⭐   9 NEG,  1 POS    ✅
  3 ⭐   9 NEG,  8 POS    ⚠️ teng bo'lindi (neytral yo'q!)
  4 ⭐   2 NEG, 23 POS    ✅
  5 ⭐   0 NEG, 21 POS    ✅ 100%!


⚠️ VADER YIQILGAN MISOL
  "Good thing... it is not worth the time."   reyting 1 ⭐
   VADER: +0.674  😀   ← ijobiy so'zlar G'OLIB keldi
  27 ta 1-yulduzli sharhdan 9 tasi "ijobiy" deb belgilandi (33%)


💡 QAYSI BIRINI TANLASH?
  Millionlab tvit, real vaqt  →  VADER (tez, 1 MB)
  Muhim qaror, aniqlik        →  Transformer (95%)
  Eng yaxshisi                →  IKKALASI: VADER bilan filtrlang,
                                 shubhalilarni transformerga bering
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `pd.cut()` | *cut / binning* | Ballni guruhlarga bo'lish |
| Bin | *bin* | Qiymat oralig'i |
| Uzunlik chegarasi | *token limit* | Model qabul qiladigan maksimum |
| Chalkashlik jadvali | *crosstab* | Ikki ustunni kesishtirish |
| Aniqlik | *accuracy* | To'g'ri javoblar ulushi |
| Ansambl | *ensemble* | Bir necha modelni birlashtirish |

---

⬅️ [Oldingi: Transformer modellari](03-Pre-trained-Transformer-Models.md) · 🏠 [Modul boshiga](README.md)

📝 **Endi amaliyot:** [Barcha mashqlar](MASHQLAR.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
