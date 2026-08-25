# 4-dars. Matnni qayta ishlash

## 🎬 Boshlashdan oldin

> **"Shu paytgacha biz ma'lumot to'plamimizni yukladik va uni nutq qismlari teglash hamda nomlangan ob'ektlarni tanib olish yordamida biroz o'rgandik. Endi biz matn ma'lumotimizni OLDINDAN QAYTA ISHLASHNI boshlashga tayyormiz."**
>
> **"Biz buni bir necha marta ko'rib chiqdik, shuning uchun umid qilamanki, siz bu ma'lumotni tozalashda EKSPERT bo'lasiz."**

---

## 1. ⭐⭐ Eng muhim qadam — agentlik prefiksini olib tashlash

> ## **"Siz matn ma'lumotidagi ba'zi qatorlar boshida JOY TEGI borligini sezasiz. Masalan, pastki ikkita qatorda `Washington` va `Belfast` ni ko'rasiz. U yerda shuningdek `Reuters` nomi bor, undan keyin CHIZIQCHA."**
>
> ## **"Biz buni tozalab, olib tashlamoqchimiz — chunki bu bizning tahlilimizga biroz TA'SIR QILISHI mumkindek tuyuladi."**

> ## 💥 **"Biroz ta'sir qilishi mumkin" — bu KAMTARONA baho.** 3-darsda o'lchagandik: `Reuters` bitta qatorlik qoida bilan **99.5% aniqlik** beradi!

### Regex bilan hal qilamiz

> **"Bu regular expression'ning maqsadi — BIRINCHI CHIZIQCHANI topib, undan OLDINGI HAMMA NARSANI olib tashlash."**

```python
data["text_clean"] = data.apply(
    lambda x: re.sub(r"^[^-]*-\s*", "", x["text"]), axis=1)
```

### 🔑 Regexni tushunamiz

```
^        matn BOSHIDAN
[^-]*    chiziqcha BO'LMAGAN har qanday belgi (0 yoki ko'p)
-        chiziqcha
\s*      undan keyingi bo'shliqlar
         → hammasini "" ga almashtir
```

**Natija:**

```python
print("oldin:", repr(data["text"][196][:80]))
print("keyin:", repr(data["text_clean"][196][:80]))
```

```
oldin: 'WASHINGTON (Reuters) - Former FBI Director James Comey had requested additional '
keyin: 'Former FBI Director James Comey had requested additional funding and personnel f'
```

> ✅ **`WASHINGTON (Reuters) - ` butunlay ketdi.**

> **"Agar muammongiz uchun regular expression yaratishda qiynalsangiz, GOOGLE'DAN qidirishni albatta tavsiya qilaman — chunki odatda kimdir xuddi shu muammoga duch kelgan va sizga yechim bergan bo'ladi."**

### ⚠️ Lekin TO'LIQ tozalanmadi

```python
print("Prefiks olib tashlangandan keyin 'reuters' qolganmi?")
print("  Soxta  :", data[data["fake_or_factual"]=="Fake News"]["text_clean"]
      .str.contains("Reuters").sum())
print("  Haqiqiy:", data[data["fake_or_factual"]=="Factual News"]["text_clean"]
      .str.contains("Reuters").sum())
```

```
  Soxta  : 1
  Haqiqiy: 12
```

> ## 🔑 **12 ta maqolada `Reuters` MATN ICHIDA ham eslatilgan** *("Reuters reported that...")*. Prefiksni olib tashlash **100% → 12%** ga tushirdi — bu **katta yaxshilanish**, lekin **mukammal emas**.
>
> ## 💡 **Amaliy saboq:** tozalash **kamdan-kam** 100% bo'ladi. **O'lchang** va **qancha qolganini biling**.

---

## 2. Standart quvur — 21-modul

> **"Keyingi qadamimiz — matnimizni KICHIK HARFGA o'tkazish."**

```python
data["text_clean"] = data["text_clean"].str.lower()
```

> **"Keyin TINISH BELGILARNI olib tashlamoqchimiz. Bu — regular expression uchun ilgari ishlatgan kodimiz bilan bir xil."**

```python
data["text_clean"] = data.apply(
    lambda x: re.sub(r"[^\w\s]", "", x["text_clean"]), axis=1)
```

> **"Keyin TO'XTATISH SO'ZLARNI olib tashlashga o'tamiz."**

```python
en_stopwords = stopwords.words("english")
data["text_clean"] = data["text_clean"].apply(
    lambda x: " ".join([w for w in x.split() if w not in en_stopwords]))
```

> ## **"POS teglash qilganimizda men o'sha tez-tez uchraydigan tokenlarni to'xtatish so'zlari ro'yxatiga solishtirish MUHIM ekanini aytgandim. Shuning uchun ORQAGA QAYTIB, ularni to'xtatish so'zlari ro'yxati bilan MOSLASHTIRISH juda muhim."**

> 💡 **2-darsni eslang:** biz `,`, `the`, `.`, `of`, `and`, `a` ni top-10 da ko'rgan edik. Ular **hammasi** NLTK ro'yxatida bor — demak **avtomatik** olib tashlanadi. ✅

> **"Endi bu matnni TOKENIZATSIYA qilishga o'tamiz."**

```python
data["text_clean"] = data["text_clean"].apply(word_tokenize)
```

> ## **"Oldindan qayta ishlashdagi oxirgi qadamimiz — LEMMATIZATSIYA. Biz stemming o'rniga lemmatizatsiyadan foydalanamiz, chunki men so'zlarning KONTEKSTI va MA'NOSINING ko'p qismini SAQLAB QOLISH uchun bu AQLLIROQ usulni ishlatmoqchiman."**
>
> **"Ma'lumot to'plamimiz unchalik katta emas, shuning uchun u uzoq vaqt olmasligi va keyinchalik muammo tug'dirmasligi kerak."**

```python
lemmatizer = WordNetLemmatizer()
data["text_clean"] = data["text_clean"].apply(
    lambda tokens: [lemmatizer.lemmatize(t) for t in tokens])
```

### 🔑 Stemming va lemmatization — qachon qaysi?

| | **25-modul** *(yangiliklar)* | **Bu modul** |
|---|---|---|
| **Tanlov** | **Stemming** | **Lemmatization** |
| **Sabab** | 100 × **1112 so'z** = juda ko'p → **tezlik** | 198 × ~400 so'z → **ma'no** muhimroq |

> 💡 **Qoida:** ma'lumot **katta** bo'lsa — stemming *(tez)*. **Kichik** bo'lsa — lemmatization *(aniq)*.

---

## 3. Natija

```python
print(data["text_clean"][0][:12])
```

```
['yearold', 'oscarwinning', 'actress', 'described', 'meeting', '16yearold',
 'girl', 'apparently', 'given', 'birth', 'shortly', 'arriving']
```

```python
tokens_clean = sum(data["text_clean"], [])
print("Jami token:", len(tokens_clean))
```

```
Jami token: 38485
```

```
Tozalashdan OLDIN:  86 137 token   (45744 + 40393)
Tozalashdan KEYIN:  38 485 token
                         ↓
                    55% o'chdi
```

⚠️ **`yearold` va `oscarwinning`** — bular `year-old` va `oscar-winning` edi. Tinish belgilarni o'chirish **defisli so'zlarni** birlashtirdi. Bu — **kichik nuqson**, lekin bilib qo'ying.

---

## 4. N-grammalar

> **"Endi biz buni tozalaganimizdan so'ng, eng ko'p uchraydigan n-grammalarimiz qanday ko'rinishini ko'raylik."**

```python
import nltk
unigrams = pd.Series(nltk.ngrams(tokens_clean, 1)).value_counts()
print(unigrams[:10])
```

```
(said,)          560
(trump,)         520
(u,)             255
(state,)         250
(president,)     226
(would,)         210
(one,)           141
(year,)          128
(republican,)    128
(also,)          124
```

> ## **"Bu oldindan qayta ishlashimizdan keyin ANCHA QIZIQARLI ekanini ko'ramiz. Bu endi faqat to'xtatish so'zlari emas."**

⚠️ **`u` — 255 marta?** Bu `U.S.` dan qolgan. Tinish belgi o'chirilgach `u` va `s` alohida qoldi. Yana bir **kichik nuqson**.

### Bigrammalar

```python
bigrams = pd.Series(nltk.ngrams(tokens_clean, 2)).value_counts()
print(bigrams[:10])
```

```
(donald, trump)            92
(united, state)            80
(white, house)             72
(president, donald)        42
(new, york)                31
(hillary, clinton)         31
(image, via)               29
(supreme, court)           29
(official, said)           26
(trump, administration)    24
```

> **"Bu yerda haqiqatan qiziqarli bigrammalar chiqayotganini ko'rasiz — masalan `Donald Trump`, `United States`, `White House`."**

### 🎯 `image via` — 29 marta!

```
(image, via)  29
      ↑
Bu — "Image via Getty" kabi RASM MANBASI izohi.
Faqat SOXTA yangiliklarda uchraydi (2-darsdagi "image", "video" ni eslang!)
```

> ## 💡 **Yana bir "shipcha" nomzodi.** Bu — soxta yangiliklarning **format belgisi**, mazmuni emas.

---

## 5. Grafik

```python
import seaborn as sns
import matplotlib.pyplot as plt

top = unigrams[:10]
sns.barplot(x=top.values, y=[t[0] for t in top.index],
            orient="h", color=DEFAULT_PLOT_COLOUR)
plt.title("Eng ko'p uchraydigan unigrammalar (oldindan qayta ishlashdan keyin)")
plt.savefig("unigrams.png", dpi=100, bbox_inches="tight")
```

> **"Va biz uni ishga tushirgach, u bizga ma'lumot to'plamimizdagi eng ko'p uchraydigan unigrammalarning chiroyli diagrammasini berdi — uni har qanday taqdimot yoki NOTEXNIK odamlar bilan muhokamada ishlatishimiz mumkin."**

---

## 6. 💻 To'liq kod

```python
import pandas as pd, re, nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

data = pd.read_csv("data/fake_news_data.csv")

# ===== 1 · ⭐ AGENTLIK PREFIKSINI OLIB TASHLASH =====
data["text_clean"] = data.apply(
    lambda x: re.sub(r"^[^-]*-\s*", "", x["text"]), axis=1)

# ===== 2 · KICHIK HARF =====
data["text_clean"] = data["text_clean"].str.lower()

# ===== 3 · TINISH BELGILAR =====
data["text_clean"] = data.apply(
    lambda x: re.sub(r"[^\w\s]", "", x["text_clean"]), axis=1)

# ===== 4 · TO'XTATISH SO'ZLARI =====
en_stopwords = stopwords.words("english")
data["text_clean"] = data["text_clean"].apply(
    lambda x: " ".join([w for w in x.split() if w not in en_stopwords]))

# ===== 5 · TOKENIZATSIYA =====
data["text_clean"] = data["text_clean"].apply(word_tokenize)

# ===== 6 · LEMMATIZATSIYA =====
lemmatizer = WordNetLemmatizer()
data["text_clean"] = data["text_clean"].apply(
    lambda t: [lemmatizer.lemmatize(w) for w in t])

# ===== TEKSHIRUV =====
tokens_clean = sum(data["text_clean"], [])
print("Jami token:", len(tokens_clean))              # 38485
print("\nUNIGRAM:"); print(pd.Series(nltk.ngrams(tokens_clean, 1)).value_counts()[:10])
print("\nBIGRAM:");  print(pd.Series(nltk.ngrams(tokens_clean, 2)).value_counts()[:10])
```

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Tozalashdan keyin nechta token qoldi?

**M2.** Trigrammalarni hisoblang.

**M3.** Soxta va haqiqiy uchun alohida unigrammalar.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(len(tokens_clean))                              # 38485
print("Noyob:", len(set(tokens_clean)))

# M2
print(pd.Series(nltk.ngrams(tokens_clean, 3)).value_counts()[:5])

# M3
for t in ["Fake News", "Factual News"]:
    tok = sum(data[data["fake_or_factual"] == t]["text_clean"], [])
    print(f"\n{t}:")
    print(pd.Series(tok).value_counts()[:8].to_string())
```

</details>

### 🟡 O'rta

**M4.** ⭐ `Reuters` muammosi qanchalik hal bo'ldi?

**M5.** Tozalashning har bir qadamidan keyin token sonini o'lchang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — ⭐ TOZALASHNI O'LCHASH
oldin = {}
keyin = {}
for t in ["Fake News", "Factual News"]:
    s = data[data["fake_or_factual"] == t]
    oldin[t] = s["text"].str.contains("Reuters").sum()
    keyin[t] = s["text_clean"].apply(lambda x: "reuters" in x).sum()
print("OLDIN :", oldin)      # {'Fake News': 1, 'Factual News': 100}
print("KEYIN :", keyin)      # {'Fake News': 1, 'Factual News': 12}
#
# 🎯 100 → 12 (88% kamaydi!)
# ⚠️ Lekin 12 tasi hali ham qoldi — matn ICHIDA eslatilgan.
#
# 💡 Xohlasangiz to'liq olib tashlashingiz mumkin:
#    data["text_clean"] = data["text_clean"].apply(
#        lambda t: [w for w in t if w != "reuters"])
#    ⚠️ Lekin bu ham "aldash" — chunki siz javobni BILGANINGIZ uchun
#       shunday qilyapsiz. Haqiqiy loyihada buni QAYERDAN bilasiz?
#    🔑 Javob: MA'LUMOTNI KO'Z BILAN TEKSHIRIB.

# M5
matn = data["text"].copy()
print("0 · Xom            :", sum(len(x.split()) for x in matn))
matn = matn.apply(lambda x: re.sub(r"^[^-]*-\s*", "", x))
print("1 · Prefikssiz     :", sum(len(x.split()) for x in matn))
matn = matn.str.lower().apply(lambda x: re.sub(r"[^\w\s]", "", x))
print("2 · Tinish belgisiz:", sum(len(x.split()) for x in matn))
matn = matn.apply(lambda x: " ".join([w for w in x.split() if w not in en_stopwords]))
print("3 · To'xtatishsiz  :", sum(len(x.split()) for x in matn))
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Eng muhim tozalash qadami qaysi va nima uchun?
2. Regex `^[^-]*-\s*` nima qiladi?
3. Prefiksni olib tashlash `Reuters` muammosini to'liq hal qildimi?
4. Nima uchun stemming emas, lemmatization?
5. Tozalashdan keyin nechta token qoldi?
6. `image via` bigrammasi nimani anglatadi?

<details>
<summary>✅ Javoblar</summary>

1. ## **Agentlik prefiksini olib tashlash.** Chunki `Reuters` **100% haqiqiy** va **1% soxta** yangiliklarda — bu **99.5% aniqlikli shipcha**.
2. Matn **boshidan** birinchi **chiziqchagacha** bo'lgan hamma narsani *(chiziqcha va bo'shliqlar bilan)* o'chiradi.
3. ## **Yo'q** — **100 → 12**. Matn **ichida** eslatilganlari qoldi. Lekin bu **katta yaxshilanish**.
4. Chunki ma'lumot **kichik** *(198 maqola)* — **tezlik** muammo emas, **ma'no** muhimroq.
5. **38 485** — 86 137 dan *(55% o'chdi)*.
6. Bu — *"Image via Getty"* kabi **rasm manbasi** izohi. **Format belgisi**, mazmun emas — yana bir **shipcha nomzodi**.

</details>

---

## 📌 Xulosa

```python
# ===== ⭐ ENG MUHIM QADAM =====
data["text_clean"] = data.apply(
    lambda x: re.sub(r"^[^-]*-\s*", "", x["text"]), axis=1)
#                     ↑ "WASHINGTON (Reuters) - " ni o'chiradi

# ===== QOLGAN 5 QADAM (21-modul) =====
.str.lower()                                    # kichik harf
re.sub(r"[^\w\s]", "", x)                       # tinish belgilar
[w for w in x.split() if w not in en_stopwords] # to'xtatish so'zlari
word_tokenize(x)                                # tokenizatsiya
[lemmatizer.lemmatize(t) for t in tokens]       # LEMMATIZATION (stemming emas!)


NATIJA
  86 137 token  →  38 485 token   (55% o'chdi)


'Reuters' MUAMMOSI
  OLDIN :  soxta 1/98   ·  haqiqiy 100/100   → 99.5% shipcha!
  KEYIN :  soxta 1/98   ·  haqiqiy  12/100   → ancha yaxshi
  ⚠️ Lekin 12 tasi matn ICHIDA qoldi


UNIGRAM top-5          BIGRAM top-5
  said       560         donald trump    92
  trump      520         united state    80
  u          255  ⚠️     white house     72
  state      250         president donald 42
  president  226         new york        31

  ⚠️ "u" 255 — bu "U.S." dan qolgan nuqson
  ⚠️ "image via" 29 — soxta yangiliklarning FORMAT belgisi


💡 STEMMING yoki LEMMATIZATION?
   Katta ma'lumot (25-modul: 111k so'z)  →  STEMMING (tez)
   Kichik ma'lumot (bu modul: 38k so'z)  →  LEMMATIZATION (aniq)
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Agentlik prefiksi | *dateline* | `WASHINGTON (Reuters) -` |
| Shipcha | *shortcut* | Model topgan yengil belgi |
| Defis | *hyphen* | `year-old` dagi chiziqcha |
| Nuqson | *artefact* | Tozalash qoldirgan izlar |

---

⬅️ [Oldingi: Nomlangan ob'ektlar](03-Extracting-Named-Entities.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Sentiment farq qiladimi?](05-Sentiment-by-News-Type.md)
