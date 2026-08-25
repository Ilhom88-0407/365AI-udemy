# 9-dars. Amaliy vazifa — to'liq quvur

## 🎬 Boshlashdan oldin

> **"Endi matnni oldindan qayta ishlashning har bir qadamini ko'rib chiqqanimizdan so'ng, buni HAMMASINI amaliy darsda birlashtiraylik — bu yerda biz ANCHA REALISTIK ma'lumot to'plamidan foydalanib har bir qadamni bosib o'tamiz."**

📁 **Ma'lumot:** [`data/tripadvisor_hotel_reviews.csv`](data/tripadvisor_hotel_reviews.csv) — **109 ta** haqiqiy mehmonxona sharhi.

---

## 1. Import

> **"Kerakli paketlarni import qilishdan boshlaymiz."**

```python
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import re
import pandas as pd
```

---

## 2. Ma'lumotni yuklash

> **"Endi ma'lumot to'plamimizni yuklashga tayyormiz. `data` yaratib, `pd.read_csv()` dan foydalanib `tripadvisor_hotel_reviews.csv` ni o'qiymiz."**

```python
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")
```

> **"Taxmin qilganingizdek, biz ishlaydigan bu ma'lumot to'plami — MEHMONXONA SHARHLARI to'plami."**

### Ma'lumotni ko'rish

> **"`data.info()` dan foydalanib nima borligini ko'raylik."**

```python
data.info()
```

```
<class 'pandas.DataFrame'>
RangeIndex: 109 entries, 0 to 108
Data columns (total 2 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   Review  109 non-null    str
 1   Rating  109 non-null    int64
dtypes: int64(1), str(1)
memory usage: 1.8 KB
```

> **"Bizda 109 ta yozuv — ya'ni 109 ta qator, va ular NULL EMAS qiymatlar, bu mukammal."**

> **"Endi ma'lumotimizga qarash uchun `data.head()` dan foydalanaylik."**
>
> **"Bizda ikkita ustun borligini ko'ramiz: biri MATN SHARHI uchun, ikkinchisi o'sha sharh bilan bog'liq REYTING uchun."**

```python
data.head()
```

| | Review | Rating |
|---|---|---|
| 0 | nice hotel expensive parking got good deal... | 4 |
| 1 | ok nothing special charge diamond member... | 2 |
| 2 | nice rooms not 4* experience hotel monaco... | 3 |
| 3 | unique, great stay, wonderful time hotel monaco... | 5 |
| 4 | great stay great stay, went seahawk game... | 5 |

### Birinchi sharh

> **"Birinchi sharhga batafsilroq qarab chiqaylik."**

```python
print(data["Review"][0][:200])
```

```
nice hotel expensive parking got good deal stay hotel anniversary, arrived late evening took advice previous reviews did valet parking, check quick easy, little disappointed non-existent view room roo
```

> **"Ko'rishimiz mumkin — u yaxshi mehmonxona haqida gapiryapti. Qimmat parkovka. Yaxshi kelishuv oldi. Shunchaki tipik mehmonxona sharhi."**

---

## 3. 1-QADAM — kichik harf

> **"Ma'lumotning ko'p qismi allaqachon kichik harfda ko'rinadi. Lekin ishonch hosil qilish uchun lowercase funksiyamizni ishga tushiraylik."**
>
> **"`review_lowercase` ustunimizni yaratamiz — bu yerda `Review` ustunini olib `str.lower()` dan foydalanamiz."**

```python
data["review_lowercase"] = data["Review"].str.lower()
```

> 💡 **`.str.lower()`** — bu pandas'ning **butun ustunga** metod qo'llash usuli. Sikl **kerak emas**!

---

## 4. 2-QADAM — to'xtatish so'zlari

> **"Keyingi qiladigan ishimiz — bu ma'lumot to'plamidan to'xtatish so'zlarini olib tashlash."**
>
> **"Eslasangiz, `en_stopwords` yaratib, uni `stopwords.words()` dan olamiz va ingliz tilini ko'rsatamiz."**

```python
en_stopwords = stopwords.words('english')
```

> ## **"Men shuningdek `not` so'zi to'xtatish so'zlari ichida BO'LMASLIGIGA ishonch hosil qilishni xohladim — shuning uchun ro'yxatimizdan `not` so'zini olib tashlash uchun `.remove()` dan foydalanamiz."**

```python
en_stopwords.remove("not")
```

> ## 🔑 **Mana — 3-darsda o'rgangan qoida amalda.** `"not clean"` va `"clean"` — **butunlay boshqa** ma'no.

```python
data["review_no_stopwords"] = data["review_lowercase"].apply(
    lambda x: " ".join([word for word in x.split()
                        if word not in en_stopwords]))
```

### 💡 Eng muhim maslahat

> ## **"Matnni oldindan qayta ishlaganda, oldindan qayta ishlashingizning HAR BIR QADAMI uchun YANGI USTUN yaratish DOIM ARZIYDI — shunda yo'l davomida uni TEKSHIRA olasiz."**
>
> ## **"Va agar nimadir buzilsa — siz shunchaki o'sha tegishli ustundagi OLDINGI QADAMGA qaytishingiz mumkin."**

```
Review                              ← asl
review_lowercase                    ← 1-qadam
review_no_stopwords                 ← 2-qadam
review_no_stopwords_no_punct        ← 3-qadam
tokenized                           ← 4-qadam
stemmed                             ← 5a-qadam
lemmatized                          ← 5b-qadam
```

---

## 5. 3-QADAM — tinish belgilar (ikki bosqichda!)

> **"Endi matnimizdagi TINISH BELGILARNI hal qilaylik."**
>
> ## **"Biz tinish belgilarni olib tashlamoqchimiz — lekin biz `star` so'zi o'rniga YULDUZCHA BELGISI bo'lgan bir necha sharhni sezdik."**
>
> **"Biz buni SAQLAB QOLMOQCHIMIZ, chunki u sharhga MA'NO qo'shishi mumkin."**

### 3a — yulduzchani so'zga aylantirish

```python
data["review_no_stopwords_no_punct"] = data.apply(
    lambda x: re.sub(r"\*", "star", x["review_no_stopwords"]), axis=1)
```

> **"Xom satrni bildirish uchun `r` dan foydalanayotganimizni ko'rasiz. Keyin yulduzcha belgisini izlaymiz va uni `star` so'ziga almashtiramiz."**

**Nima uchun bu muhim?**

```
"nice rooms not 4* experience"
                    ↑ Bu — REYTING!  4 yulduz.

Agar shunchaki o'chirilsa:  "nice rooms not 4 experience"
                                           ↑ ma'no YO'QOLDI

To'g'ri:                    "nice rooms not 4star experience"  ✅
```

> ## 🔑 **Bu — TAJRIBALI ma'lumot olimining ishi.** Ma'lumotni **ko'rmasdan** tozalash — xato.

### 3b — qolgan tinish belgilar

> **"Bu hal qilingandan so'ng, biz qolgan tinish belgilarni olib tashlashimiz mumkin."**

```python
data["review_no_stopwords_no_punct"] = data.apply(
    lambda x: re.sub(r"[^\w\s]", "", x["review_no_stopwords_no_punct"]), axis=1)
```

> **"4-darsdagi regular expressionlarni eslasangiz — tinish belgilarni olib tashlash uchun ishlatmoqchi bo'lgan regex sintaksisi: kvadrat qavslar, karet, `\w`, `\s`."**

---

## 6. 4-QADAM — tokenizatsiya

> **"Ishlash uchun keyingi qadam — bu matnni TOKENIZATSIYA qilish."**
>
> **"`tokenized` deb nomlangan yangi ustun yaratamiz."**

```python
data["tokenized"] = data.apply(
    lambda x: word_tokenize(x["review_no_stopwords_no_punct"]), axis=1)
```

> **"Demak, biz TOZALANGAN ma'lumotimizni tokenizatsiya qilyapmiz."**

---

## 7. 5-QADAM — stemming

> **"Ko'radigan keyingi qadam — STEMMING."**
>
> **"Stemmerimizni ishga tushirib, uni `ps` deb nomlaymiz."**

```python
ps = PorterStemmer()

data["stemmed"] = data["tokenized"].apply(
    lambda tokens: [ps.stem(token) for token in tokens])
```

> **"Tokenizatsiya qilingan matnimizni `tokenized` ustunidan olib, tokenlar uchun lambda funksiyasini qo'llaymiz."**
>
> **"Demak, biz tokenlar ro'yxatimizdagi har bir token uchun `ps.stem()` ni ishga tushiramiz."**

---

## 8. 5b-QADAM — lemmatization

> **"Buni lemmatizatsiya bilan solishtiraylik."**

```python
lemmatizer = WordNetLemmatizer()

data["lemmatized"] = data["tokenized"].apply(
    lambda tokens: [lemmatizer.lemmatize(token) for token in tokens])
```

> **"Bir oz vaqt oldin ko'rganimizdek, so'zlarning ko'pi asl so'zini SAQLAB QOLGAN va stemming qilganimizdagi kabi KO'P KAMAYTIRILMAGAN."**

---

## 9. Natijani ko'rish

```python
print("Original :", data["Review"][0][:90])
print("Lower    :", data["review_lowercase"][0][:90])
print("NoStop   :", data["review_no_stopwords"][0][:90])
print("NoPunct  :", data["review_no_stopwords_no_punct"][0][:90])
print("Tokens   :", data["tokenized"][0][:12])
print("Stemmed  :", data["stemmed"][0][:12])
print("Lemmat.  :", data["lemmatized"][0][:12])
```

```
Original : nice hotel expensive parking got good deal stay hotel anniversary, arrived late evening to
Lower    : nice hotel expensive parking got good deal stay hotel anniversary, arrived late evening to
NoStop   : nice hotel expensive parking got good deal stay hotel anniversary, arrived late evening to
NoPunct  : nice hotel expensive parking got good deal stay hotel anniversary arrived late evening too
Tokens   : ['nice', 'hotel', 'expensive', 'parking', 'got', 'good', 'deal', 'stay', 'hotel', 'anniversary', 'arrived', 'late']
Stemmed  : ['nice', 'hotel', 'expens', 'park', 'got', 'good', 'deal', 'stay', 'hotel', 'anniversari', 'arriv', 'late']
Lemmat.  : ['nice', 'hotel', 'expensive', 'parking', 'got', 'good', 'deal', 'stay', 'hotel', 'anniversary', 'arrived', 'late']
```

### 🔑 Farqni ko'ring

| Token | Stemming | Lemmatization |
|---|---|---|
| `expensive` | **`expens`** ❌ | `expensive` ✅ |
| `parking` | **`park`** ⚠️ | `parking` ✅ |
| `anniversary` | **`anniversari`** ❌ | `anniversary` ✅ |
| `arrived` | **`arriv`** ❌ | `arrived` ✅ |

> **"Endi bizda kichik harfdagi chiroyli toza ma'lumot to'plami bor. Unda tinish belgilar yo'q. U tokenizatsiya qilingan va bizda STEMLANGAN hamda LEMMATIZATSIYA QILINGAN versiyalar bor."**

---

## 10. N-grammalar bilan tekshirish

> **"Endi bu qanday ko'rinishini ko'raylik va n-grammalarga qarab ma'lumotimizda nima borligi haqida tasavvur hosil qilaylik."**

### Tokenlarni bitta ro'yxatga yig'ish

> **"Birinchi qadam — tozalangan tokenlarimizning BITTA RO'YXATINI yaratish, ya'ni ularni DataFrame'dan olib chiqish."**
>
> **"Bu yerda `sum()` funksiyasidan foydalanishimiz mumkin: `data["lemmatized"]` ustunini bo'sh ro'yxat bilan."**

```python
tokens_clean = sum(data["lemmatized"], [])
print("Jami token:", len(tokens_clean))
```

```
Jami token: 9407
```

> **"Bu bizning barcha tokenlarimizni bitta chiroyli ro'yxatga joylashtiradi."**

### 🔑 `sum(list_of_lists, [])` hiylasi

```python
sum([[1,2], [3,4], [5]], [])
# [1, 2, 3, 4, 5]
#   ↑ ro'yxatlar BIRLASHTIRILDI
```

`sum()` **ikkinchi argumentdan** boshlaydi va **`+`** operatorini qo'llaydi. Ro'yxatlar uchun `+` — bu **birlashtirish**.

---

## 11. Unigrammalar

> **"Endi eng ko'p uchraydigan unigrammalarga qaraylik."**

```python
unigrams = pd.Series(nltk.ngrams(tokens_clean, 1)).value_counts()
print(unigrams[:10])
```

```
(hotel,)       292
(room,)        275
(great,)       126
(not,)         122
(stay,)         95
(staff,)        90
(nt,)           81
(seattle,)      79
(location,)     78
(good,)         76
Name: count, dtype: int64
```

> **"Buni chop etsak — ma'lumotimizdagi eng keng tarqalgan so'z `hotel` bo'lgan, keyin `room`, `great`, `not` va `stay`."**

### 🔑 Uchta muhim kuzatuv

**1 · `not` — 122 marta!**

Agar biz uni to'xtatish so'zlaridan **olib tashlamaganimizda**, bu **122 ta muhim signal** yo'qolgan bo'lardi.

**2 · `nt` — 81 marta ⚠️**

Bu **qayerdan keldi?** `word_tokenize` `"don't"` ni `"do"` + `"n't"` ga ajratadi. Keyin regex `"'"` ni o'chiradi → `"nt"` qoladi.

> ## 🔑 **Bu — QUVURDAGI XATO.** Uni `"nt"` ni to'xtatish so'zlariga qo'shib tuzatish mumkin.

**3 · `seattle` — 79 marta**

Bu — **joy nomi**. Barcha sharhlar **Sietldagi** mehmonxonalar haqida ekan!

---

## 12. Bigrammalar — eng qiziqarli qism

> **"Endi buni bigrammalarga almashtiraylik."**

```python
bigrams = pd.Series(nltk.ngrams(tokens_clean, 2)).value_counts()
print(bigrams[:10])
```

```
(great, location)      24
(space, needle)        21
(hotel, monaco)        16
(staff, friendly)      12
(pike, place)          12
(great, hotel)         12
(great, view)          12
(location, great)      10
(walking, distance)    10
(staff, helpful)        9
Name: count, dtype: int64
```

> **"Bu yerda `great location` birga paydo bo'lgan bir necha holat bor — `Space Needle`, `Hotel Monaco` va hokazo."**
>
> ## **"Demak, bu sizga hech qanday QIYIN yoki KO'P VAQT TALAB QILADIGAN tahlil qilmasdan ma'lumotingizda qanday MAVZULAR va TEMALAR paydo bo'layotgani haqida HAQIQATAN YAXSHI tasavvur beradi."**

### 🎯 Biznes insaytlari

| Bigramma | Nima aytadi |
|---|---|
| `great location` **24** | ⭐ **Eng ko'p maqtaladigan narsa — JOYLASHUV** |
| `space needle` **21** | Mijozlar Sietl diqqatga sazovor joyiga yaqinlikni qadrlaydi |
| `hotel monaco` **16** | Bitta mehmonxona eng ko'p muhokama qilinadi |
| `staff friendly` **12** | Xodimlar — ikkinchi kuchli tomon |
| `walking distance` **10** | Piyoda yurish masofasi muhim |

> ## 💡 **Marketing bo'limi uchun tayyor xulosa:** reklama **JOYLASHUV** va **XODIMLAR** ga urg'u berishi kerak.

> **"Bu haqiqatan qiziqarli — men aytganimdek, ma'lumotingizda nima borligi, nima paydo bo'layotgani haqida juda yaxshi tasavvur olish uchun, va har qanday ILG'OR TAHLILGA o'tishdan oldin oldindan qayta ishlashingizni TEKSHIRISH uchun."**

---

## 13. 💻 To'liq kod

```python
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import re
import pandas as pd

# ===== MA'LUMOTNI YUKLASH =====
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")
print(data.shape)
print(data.columns.tolist())

# ===== 1 · KICHIK HARF =====
data["review_lowercase"] = data["Review"].str.lower()

# ===== 2 · TO'XTATISH SO'ZLARI =====
en_stopwords = stopwords.words('english')
en_stopwords.remove("not")              # ⭐ INKORNI SAQLAYMIZ

data["review_no_stopwords"] = data["review_lowercase"].apply(
    lambda x: " ".join([w for w in x.split() if w not in en_stopwords]))

# ===== 3a · YULDUZCHANI SAQLASH =====
data["review_no_stopwords_no_punct"] = data.apply(
    lambda x: re.sub(r"\*", "star", x["review_no_stopwords"]), axis=1)

# ===== 3b · QOLGAN TINISH BELGILAR =====
data["review_no_stopwords_no_punct"] = data.apply(
    lambda x: re.sub(r"[^\w\s]", "", x["review_no_stopwords_no_punct"]), axis=1)

# ===== 4 · TOKENIZATSIYA =====
data["tokenized"] = data.apply(
    lambda x: word_tokenize(x["review_no_stopwords_no_punct"]), axis=1)

# ===== 5a · STEMMING =====
ps = PorterStemmer()
data["stemmed"] = data["tokenized"].apply(
    lambda t: [ps.stem(w) for w in t])

# ===== 5b · LEMMATIZATION =====
lemmatizer = WordNetLemmatizer()
data["lemmatized"] = data["tokenized"].apply(
    lambda t: [lemmatizer.lemmatize(w) for w in t])

# ===== NATIJANI KO'RISH =====
print("Original :", data["Review"][0][:90])
print("Lower    :", data["review_lowercase"][0][:90])
print("NoStop   :", data["review_no_stopwords"][0][:90])
print("NoPunct  :", data["review_no_stopwords_no_punct"][0][:90])
print("Tokens   :", data["tokenized"][0][:12])
print("Stemmed  :", data["stemmed"][0][:12])
print("Lemmat.  :", data["lemmatized"][0][:12])

# ===== N-GRAMMALAR =====
tokens_clean = sum(data["lemmatized"], [])
print()
print("Jami token:", len(tokens_clean))
print()
print(pd.Series(nltk.ngrams(tokens_clean, 1)).value_counts()[:10])
print()
print(pd.Series(nltk.ngrams(tokens_clean, 2)).value_counts()[:10])
```

**Natija:**

```
(109, 2)
['Review', 'Rating']
Original : nice hotel expensive parking got good deal stay hotel anniversary, arrived late evening to
Lower    : nice hotel expensive parking got good deal stay hotel anniversary, arrived late evening to
NoStop   : nice hotel expensive parking got good deal stay hotel anniversary, arrived late evening to
NoPunct  : nice hotel expensive parking got good deal stay hotel anniversary arrived late evening too
Tokens   : ['nice', 'hotel', 'expensive', 'parking', 'got', 'good', 'deal', 'stay', 'hotel', 'anniversary', 'arrived', 'late']
Stemmed  : ['nice', 'hotel', 'expens', 'park', 'got', 'good', 'deal', 'stay', 'hotel', 'anniversari', 'arriv', 'late']
Lemmat.  : ['nice', 'hotel', 'expensive', 'parking', 'got', 'good', 'deal', 'stay', 'hotel', 'anniversary', 'arrived', 'late']

Jami token: 9407

(hotel,)       292
(room,)        275
(great,)       126
(not,)         122
(stay,)         95
(staff,)        90
(nt,)           81
(seattle,)      79
(location,)     78
(good,)         76
Name: count, dtype: int64

(great, location)      24
(space, needle)        21
(hotel, monaco)        16
(staff, friendly)      12
(pike, place)          12
(great, hotel)         12
(great, view)          12
(location, great)      10
(walking, distance)    10
(staff, helpful)        9
Name: count, dtype: int64
```

---

## 14. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `data.info()` va `data.head()` ni ishga tushiring.

**M2.** Reyting bo'yicha statistikani chiqaring.

**M3.** Har bir bosqichdan keyin birinchi sharhni chop eting.

<details>
<summary>✅ Yechimlar</summary>

```python
import pandas as pd
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")

# M1
print(data.shape)                       # (109, 2)
print(data.info())

# M2
print(data["Rating"].value_counts().sort_index())
# Rating
# 1    10
# 2    12
# 3    12
# 4    37
# 5    38
print("O'rtacha reyting:", round(data["Rating"].mean(), 2))    # 3.74

# M3
# Har bir ustunni ketma-ket chop eting — yuqoridagi to'liq kodda bor
```

</details>

### 🟡 O'rta

**M4.** `"nt"` muammosini tuzating.

**M5.** Trigrammalarni hisoblang.

**M6.** Faqat 5 yulduzli sharhlarning bigrammalarini hisoblang.

<details>
<summary>✅ Yechimlar</summary>

```python
import nltk, pandas as pd
# (yuqoridagi quvur ishga tushirilgan deb faraz qilamiz)

# M4 — "nt" MUAMMOSINI TUZATISH
tokens_fixed = [t for t in tokens_clean if t not in ["nt", "s", "t", "ve", "re", "ll", "m", "d"]]
print("Oldin: ", len(tokens_clean))          # 9407
print("Keyin: ", len(tokens_fixed))          # 9326
print(pd.Series(nltk.ngrams(tokens_fixed, 1)).value_counts()[:5])
# (hotel,)  292
# (room,)   275
# (great,)  126
# (not,)    122
# (stay,)    95
# ✅ "nt" endi YO'Q

# M5
print(pd.Series(nltk.ngrams(tokens_clean, 3)).value_counts()[:5])
# (pike, place, market)        8
# (view, space, needle)        5
# (hotel, great, location)     5
# (room, king, bed)            4
# (staff, friendly, helpful)   4

# M6
besh = data[data["Rating"] == 5]
tokens_5 = sum(besh["lemmatized"], [])
print("5 yulduzli sharhlar:", len(besh), " tokenlar:", len(tokens_5))
# 5 yulduzli sharhlar: 38  tokenlar: 3063
print(pd.Series(nltk.ngrams(tokens_5, 2)).value_counts()[:5])
# (great, location)  12
# (hotel, monaco)    10
# (great, hotel)      8
# (staff, friendly)   7
# (space, needle)     7
```

</details>

### 🔴 Qiyin

**M7.** Stemming va lemmatization lug'at hajmini solishtiring.

**M8.** 1-yulduz va 5-yulduz sharhlarning bigrammalarini solishtiring.

**M9.** Butun quvurni **funksiya** qilib qayta yozing.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
stem_tokens = sum(data["stemmed"], [])
lem_tokens  = sum(data["lemmatized"], [])
print("Xom noyob:          ", len(set(sum(data["tokenized"], []))))
print("Stemming noyob:     ", len(set(stem_tokens)))
print("Lemmatization noyob:", len(set(lem_tokens)))
# Xom noyob:           2763
# Stemming noyob:      2278
# Lemmatization noyob: 2589
# 🔑 Stemming lug'atni 18% kamaytirdi, lemmatization — atigi 6%

# M8
bir  = data[data["Rating"] == 1]
besh = data[data["Rating"] == 5]
print("1 YULDUZ bigrammalari:")
print(pd.Series(nltk.ngrams(sum(bir["lemmatized"], []), 2)).value_counts()[:5])
print()
print("5 YULDUZ bigrammalari:")
print(pd.Series(nltk.ngrams(sum(besh["lemmatized"], []), 2)).value_counts()[:5])

# 1 YULDUZ bigrammalari:        5 YULDUZ bigrammalari:
# (smoking, room)     4         (great, location)  12
# (queen, anne)       4         (hotel, monaco)    10
# (called, desk)      3         (great, hotel)      8
# (nonsmoking, room)  3         (staff, friendly)   7
# (desk, staff)       3         (space, needle)     7
#
# 🔑 SALBIY sharhlar — CHEKISH XONASI va RESEPSHINGA SHIKOYAT.
#    IJOBIY sharhlar — JOYLASHUV va XODIMLARNI maqtash.
#    Ikki guruh MUTLAQO BOSHQA narsalar haqida gapiryapti!

# M9 — QUVUR FUNKSIYA SIFATIDA
def preprocess(matn, stem=False):
    """To'liq oldindan qayta ishlash quvuri."""
    matn = matn.lower()                                   # 1
    matn = " ".join([w for w in matn.split()
                     if w not in en_stopwords])           # 2
    matn = re.sub(r"\*", "star", matn)                    # 3a
    matn = re.sub(r"[^\w\s]", "", matn)                   # 3b
    tokens = word_tokenize(matn)                          # 4
    if stem:
        return [ps.stem(t) for t in tokens]               # 5a
    return [lemmatizer.lemmatize(t) for t in tokens]      # 5b

print(preprocess("The HOTEL was NOT clean! 4* experience.")[:8])
# ['hotel', 'not', 'clean', '4star', 'experience']
print(preprocess("The HOTEL was NOT clean! 4* experience.", stem=True)[:8])
# ['hotel', 'not', 'clean', '4star', 'experi']
```

</details>

---

## 15. 🧠 O'zini tekshirish savollari

1. Ma'lumot to'plamida nechta yozuv bor?
2. Nechta ustun bor va ular nima?
3. Nima uchun `not` olib tashlanadi?
4. Nima uchun har bir qadam uchun yangi ustun?
5. Yulduzcha bilan nima qilinadi va nima uchun?
6. `sum(data["lemmatized"], [])` nima qiladi?
7. Eng keng tarqalgan so'z qaysi?
8. Eng keng tarqalgan bigramma qaysi?

<details>
<summary>✅ Javoblar</summary>

1. **109 ta.**
2. **Ikkita:** `Review` *(matn sharhi)* va `Rating` *(reyting)*.
3. Chunki u **inkorni** bildiradi — `"not clean"` va `"clean"` **teskari** ma'no.
4. Yo'l davomida **tekshira olish** uchun; nimadir buzilsa — **oldingi qadamga qaytish**.
5. U **`star`** so'ziga almashtiriladi — chunki u sharhga **ma'no qo'shishi** mumkin *(`4*` = 4 yulduz)*.
6. Barcha tokenlarni **bitta ro'yxatga** birlashtiradi.
7. **`hotel`** — 292 marta.
8. **`great location`** — 24 marta.

</details>

---

## 📌 Xulosa

```python
# ===== TO'LIQ QUVUR =====
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")     # 109 sharh

# 1 · KICHIK HARF
data["review_lowercase"] = data["Review"].str.lower()

# 2 · TO'XTATISH SO'ZLARI  (⭐ "not" ni SAQLANG!)
en_stopwords = stopwords.words('english')
en_stopwords.remove("not")

# 3a · YULDUZCHANI SAQLASH   4*  →  4star
re.sub(r"\*", "star", matn)

# 3b · QOLGAN TINISH BELGILAR
re.sub(r"[^\w\s]", "", matn)

# 4 · TOKENIZATSIYA
word_tokenize(matn)

# 5 · STEMMING  va/yoki  LEMMATIZATION
[ps.stem(t) for t in tokens]
[lemmatizer.lemmatize(t) for t in tokens]


💡 ENG MUHIM MASLAHAT
"HAR BIR QADAM uchun YANGI USTUN yarating —
 shunda yo'l davomida TEKSHIRA olasiz va
 nimadir buzilsa OLDINGI QADAMGA qaytasiz."


NATIJA — 9407 ta token

UNIGRAMMA:            BIGRAMMA:
hotel     292         great location   24   ⭐ JOYLASHUV maqtaladi
room      275         space needle     21
great     126         hotel monaco     16
not       122  ⭐      staff friendly   12
nt         81  ⚠️      pike place       12


⚠️  KUZATUVLAR
"not" 122 marta   →  uni saqlaganimiz TO'G'RI bo'ldi
"nt"   81 marta   →  QUVURDAGI XATO ("don't" → "do"+"n't"→"nt")
"seattle" 79      →  barcha mehmonxonalar SIETLDA


🎯 BIZNES INSAYTI
Marketing JOYLASHUV va XODIMLAR ga urg'u berishi kerak.
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| DataFrame | *DataFrame* | pandas jadvali |
| Ustun | *column* | Jadval ustuni |
| `.apply()` | *apply* | Har bir qatorga funksiya qo'llash |
| `lambda` | *lambda* | Nomsiz funksiya |
| `axis=1` | *axis* | Qatorlar bo'ylab ishlash |
| `.str` | *string accessor* | Ustunga satr metodini qo'llash |
| Quvur | *pipeline* | Ketma-ket bosqichlar |

---

⬅️ [Oldingi: N-grammalar](08-N-grams.md) · 🏠 [Modul boshiga](README.md)

📝 **Endi amaliyot:** [Barcha mashqlar](MASHQLAR.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
