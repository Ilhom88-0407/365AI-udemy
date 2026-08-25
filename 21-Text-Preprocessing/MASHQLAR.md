# 📝 21-modul — Barcha mashqlar

> **48 ta mashq** — matnni oldindan qayta ishlashning har bir bosqichi bo'yicha.
> Har birining yechimi **ishga tushirilgan va tekshirilgan**.

## 🎯 Qanday ishlatish

1. Avval **o'zingiz** yeching
2. Keyin `✅ Yechim` ni oching
3. Kodni **ishga tushiring** va natijani solishtiring

## ⚙️ Tayyorgarlik

```python
import nltk, re, pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer, SnowballStemmer, LancasterStemmer, WordNetLemmatizer

# Birinchi marta:
# nltk.download('stopwords'); nltk.download('punkt_tab'); nltk.download('wordnet')
```

---

# A · Kichik harf va tozalash *(1–8)*

### 🟢 Oson

**1.** `"HELLO World"` ni kichik harfga o'tkazing.

**2.** `"Python"` va `"python"` teng emasligini isbotlang.

**3.** Ro'yxatdagi har bir so'zni kichik harfga o'tkazing: `["Cat", "DOG", "BiRd"]`

**4.** `.lower()`, `.upper()`, `.title()`, `.capitalize()` farqini ko'rsating.

<details>
<summary>✅ Yechimlar 1–4</summary>

```python
# 1
print("HELLO World".lower())                    # hello world

# 2
print("Python" == "python")                     # False
print("Python".lower() == "python".lower())     # True

# 3
sozlar = ["Cat", "DOG", "BiRd"]
print([s.lower() for s in sozlar])              # ['cat', 'dog', 'bird']

# 4
m = "salom dunyo BUGUN"
print(m.lower())        # salom dunyo bugun
print(m.upper())        # SALOM DUNYO BUGUN
print(m.title())        # Salom Dunyo Bugun
print(m.capitalize())   # Salom dunyo bugun
```

</details>

### 🟡 O'rta

**5.** Matndagi noyob so'zlar sonini kichik harfga o'tkazish **oldin** va **keyin** hisoblang.

**6.** pandas ustunini kichik harfga o'tkazing.

**7.** Kichik harf **noto'g'ri** bo'ladigan 3 ta holatni ayting.

**8.** Faqat **birinchi harfi katta** so'zlarni toping *(ismlar bo'lishi mumkin)*.

<details>
<summary>✅ Yechimlar 5–8</summary>

```python
# 5
m = "Salom salom SALOM dunyo Dunyo"
print("Oldin:", len(set(m.split())))            # Oldin: 5
print("Keyin:", len(set(m.lower().split())))    # Keyin: 2

# 6
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")
data["past"] = data["Review"].str.lower()
print(data["past"][0][:40])   # nice hotel expensive parking got good d

# 7
# 1) US (mamlakat) → us (biz)          — MA'NO YO'QOLADI
# 2) Apple (kompaniya) → apple (olma)  — MA'NO YO'QOLADI
# 3) "HELP!!!" (baqiriq) → "help!!!"   — HISSIYOT YO'QOLADI

# 8
m = "Alisher Navoiy buyuk shoir edi Toshkentda"
print([w for w in m.split() if w[0].isupper()])
# ['Alisher', 'Navoiy', 'Toshkentda']
```

</details>

---

# B · To'xtatish so'zlari *(9–16)*

### 🟢 Oson

**9.** Ingliz tilida nechta to'xtatish so'zi bor?

**10.** Birinchi 10 tasini chop eting.

**11.** `"the"`, `"hotel"`, `"not"` to'xtatish so'zimi?

**12.** NLTK nechta tilni qo'llab-quvvatlaydi?

<details>
<summary>✅ Yechimlar 9–12</summary>

```python
en_stopwords = stopwords.words('english')

# 9
print(len(en_stopwords))                # 198

# 10
print(en_stopwords[:10])
# ['a', 'about', 'above', 'after', 'again', 'against', 'ain', 'all', 'am', 'an']

# 11
for w in ["the", "hotel", "not"]:
    print(f"{w:6s} → {w in en_stopwords}")
# the    → True
# hotel  → False
# not    → True     ⚠️ shuning uchun uni OLIB TASHLAYMIZ ro'yxatdan!

# 12
print(len(stopwords.fileids()))         # 33
print(stopwords.fileids()[:5])
# ['albanian', 'arabic', 'azerbaijani', 'basque', 'belarusian']
```

</details>

### 🟡 O'rta

**13.** Jumladan to'xtatish so'zlarni olib tashlang va **necha foiz** o'chganini hisoblang.

**14.** `not` ni ro'yxatdan olib tashlang va natijani solishtiring.

**15.** Ro'yxatga **o'z** to'xtatish so'zlaringizni qo'shing.

**16.** 109 ta sharhda to'xtatish so'zlar **necha foiz** joy egallaydi?

<details>
<summary>✅ Yechimlar 13–16</summary>

```python
# 13
m = "this is a very nice hotel and the room was really clean"
tok = m.split()
qolgan = [w for w in tok if w not in en_stopwords]
print(f"{len(tok)} → {len(qolgan)}  ({round((1-len(qolgan)/len(tok))*100)}% o'chdi)")
# 12 → 5  (58% o'chdi)
print(qolgan)                    # ['nice', 'hotel', 'room', 'really', 'clean']
# 💡 "really" TO'XTATISH SO'ZI EMAS — u kuchaytiruvchi, ma'no qo'shadi

# 14
m = "the room was not clean"
bilan_not = [w for w in m.split() if w not in en_stopwords]
xavfsiz = en_stopwords.copy(); xavfsiz.remove("not")
notsiz = [w for w in m.split() if w not in xavfsiz]
print("not TO'XTATISH so'zi:", bilan_not)   # ['room', 'clean']       ❌ MA'NO TESKARI!
print("not SAQLANDI      :", notsiz)        # ['room', 'not', 'clean'] ✅

# 15
mening = en_stopwords + ["hotel", "room", "stay"]
print(len(mening))                          # 201

# 16
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")
jami = qoldi = 0
for r in data["Review"]:
    t = r.lower().split()
    jami += len(t)
    qoldi += len([w for w in t if w not in en_stopwords])
print(f"Jami: {jami}  Qoldi: {qoldi}  ({round((1-qoldi/jami)*100)}% o'chdi)")
# Jami: 9582  Qoldi: 9292  (3% o'chdi)
# 🔑 ATIGI 3%?! Chunki bu ma'lumot ALLAQACHON tozalangan —
#    TripAdvisor sharhlaridan to'xtatish so'zlar OLDINDAN olib tashlangan.
#    Shuning uchun 1-darsda "ma'lumotingizga QARANG" deyilgan edi!
```

</details>

---

# C · Regular expressions *(17–26)*

### 🟢 Oson

**17.** Matndagi barcha raqamlarni toping.

**18.** Barcha tinish belgilarni o'chiring.

**19.** Ortiqcha bo'shliqlarni bitta bo'shliqqa aylantiring.

**20.** Matn `"hotel"` bilan **boshlanadimi**?

<details>
<summary>✅ Yechimlar 17–20</summary>

```python
m = "Xona 205, narxi 150$ va 3 kecha."

# 17
print(re.findall(r"\d+", m))                # ['205', '150', '3']

# 18
print(re.sub(r"[^\w\s]", "", m))            # Xona 205 narxi 150 va 3 kecha

# 19
b = "juda      ko'p    bo'shliq"
print(re.sub(r"\s+", " ", b))               # juda ko'p bo'shliq

# 20
print(bool(re.match(r"hotel", "hotel monaco")))   # True
print(bool(re.match(r"hotel", "the hotel")))      # False
```

</details>

### 🟡 O'rta

**21.** Email manzillarni toping.

**22.** Telefon raqamlarni toping: `+998 90 123 45 67`

**23.** `4*` kabi yulduzli reytinglarni `4star` ga aylantiring.

**24.** Faqat harflardan iborat so'zlarni ajrating.

<details>
<summary>✅ Yechimlar 21–24</summary>

```python
# 21
m = "Yozing: ali@mail.uz yoki support@hotel.com"
print(re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", m))
# ['ali@mail.uz', 'support@hotel.com']

# 22
m = "Tel: +998 90 123 45 67 yoki +998 71 200 00 00"
print(re.findall(r"\+998 \d{2} \d{3} \d{2} \d{2}", m))
# ['+998 90 123 45 67', '+998 71 200 00 00']

# 23
m = "nice rooms not 4* experience, 5* service"
print(re.sub(r"(\d)\*", r"\1star", m))
# nice rooms not 4star experience, 5star service

# 24
m = "xona205 toza3 chiroyli hotel"
print([w for w in m.split() if w.isalpha()])
# ['chiroyli', 'hotel']
```

</details>

### 🔴 Qiyin

**25.** Sharhlarda nechta **raqam** bor?

**26.** `not` so'zi bor sharhlarning o'rtacha reytingi `not` yo'q sharhlardan **pastmi**?

<details>
<summary>✅ Yechimlar 25–26</summary>

```python
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")

# 25
print("Raqam bor sharh:", data["Review"].str.contains(r"\d", regex=True).sum())
print("Jami raqam    :", sum(len(re.findall(r"\d+", r)) for r in data["Review"]))
# Raqam bor sharh: 78
# Jami raqam    : 291
# 🔑 109 tadan 78 tasida raqam bor — narx, xona raqami, kecha soni...

# 26 — ⭐ ENG MUHIM MASHQ
bor  = data[ data["Review"].str.contains(r"not", regex=True)]
yoq  = data[~data["Review"].str.contains(r"not", regex=True)]
print(f"'not' BOR : {len(bor)} sharh, o'rtacha reyting {round(bor['Rating'].mean(), 2)}")
print(f"'not' YO'Q: {len(yoq)} sharh, o'rtacha reyting {round(yoq['Rating'].mean(), 2)}")
# 'not' BOR : 53 sharh, o'rtacha reyting 3.42
# 'not' YO'Q: 56 sharh, o'rtacha reyting 4.05
#
# 🔑 MANA ISBOT! "not" bor sharhlar 0.63 ball PASTROQ.
#    Agar "not" ni to'xtatish so'zi sifatida o'chirsak,
#    modelimiz BU SIGNALNI BUTUNLAY YO'QOTADI.
```

</details>

---

# D · Tokenizatsiya *(27–34)*

### 🟢 Oson

**27.** `.split()` va `word_tokenize()` farqini ko'rsating.

**28.** Matnni **jumlalarga** ajrating.

**29.** Nechta token bor?

**30.** `"don't"` qanday tokenizatsiya qilinadi?

<details>
<summary>✅ Yechimlar 27–30</summary>

```python
m = "Hello, world! It's great."

# 27
print(m.split())                # ['Hello,', 'world!', "It's", 'great.']
print(word_tokenize(m))         # ['Hello', ',', 'world', '!', 'It', "'s", 'great', '.']
# 🔑 word_tokenize TINISH BELGILARNI ALOHIDA token qiladi

# 28
t = "Mehmonxona zo'r. Xona toza edi. Yana kelaman!"
print(sent_tokenize(t))
# ['Mehmonxona zo'r.', 'Xona toza edi.', 'Yana kelaman!']

# 29
print(len(word_tokenize(m)))    # 8

# 30
print(word_tokenize("I don't like it"))
# ['I', 'do', "n't", 'like', 'it']
# ⚠️ "don't" → "do" + "n't"  — bu keyinchalik "nt" muammosini keltirib chiqaradi!
```

</details>

### 🟡 O'rta

**31.** Tinish belgilarni tokenlar ichidan olib tashlang.

**32.** Eng uzun tokenni toping.

**33.** 109 ta sharhdagi o'rtacha token sonini hisoblang.

**34.** Tokenizatsiyani **tozalashdan oldin** va **keyin** solishtiring.

<details>
<summary>✅ Yechimlar 31–34</summary>

```python
# 31
tok = word_tokenize("Hello, world! It's great.")
print([t for t in tok if t.isalnum()])
# ['Hello', 'world', 'It', 'great']

# 32
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")
barcha = word_tokenize(" ".join(data["Review"]))
uzun = max(barcha, key=len)
print(f"Eng uzun: '{uzun}'  ({len(uzun)} harf)")
# Eng uzun: 'breakfast/brunch/lunch'  (22 harf)
# ⚠️ Bu ASLIDA 3 ta so'z! Slash (/) tokenizatsiyani chalg'itdi.

# 33
sonlar = [len(word_tokenize(r)) for r in data["Review"]]
print("O'rtacha:", round(sum(sonlar)/len(sonlar)))    # O'rtacha: 98
print("Eng qisqa:", min(sonlar), " Eng uzun:", max(sonlar))
# Eng qisqa: 15  Eng uzun: 270

# 34
m = data["Review"][0]
oldin = word_tokenize(m)
keyin = word_tokenize(re.sub(r"[^\w\s]", "", m.lower()))
print("Oldin:", len(oldin), " Keyin:", len(keyin))
# Oldin: 98  Keyin: 87
# 🔑 11 ta TINISH BELGISI token bo'lgan ekan
```

</details>

---

# E · Stemming *(35–40)*

### 🟢 Oson

**35.** `"running"`, `"runs"`, `"ran"` ni stem qiling.

**36.** Uchta stemmer natijasini solishtiring.

**37.** Ro'yxatni stem qiling.

<details>
<summary>✅ Yechimlar 35–37</summary>

```python
ps = PorterStemmer()

# 35
for w in ["running", "runs", "ran"]:
    print(f"{w:9s} → {ps.stem(w)}")
# running   → run
# runs      → run
# ran       → ran      ⚠️ NOTO'G'RI FE'LNI BILMAYDI!

# 36
sn = SnowballStemmer("english"); lc = LancasterStemmer()
print(f"{'so\'z':14s} {'Porter':12s} {'Snowball':12s} {'Lancaster':12s}")
for w in ["generously", "maximum", "universities"]:
    print(f"{w:14s} {ps.stem(w):12s} {sn.stem(w):12s} {lc.stem(w):12s}")
# so'z           Porter       Snowball     Lancaster
# generously     gener        generous     gen
# maximum        maximum      maximum      maxim
# universities   univers      univers      univers
# 🔑 Lancaster ENG AGRESSIV — "gen" dan hech narsa tushunib bo'lmaydi

# 37
print([ps.stem(w) for w in ["hotels", "booking", "stayed", "expensive"]])
# ['hotel', 'book', 'stay', 'expens']
```

</details>

### 🟡 O'rta

**38.** Stemming **noto'g'ri birlashtiradigan** so'zlarni toping.

**39.** Stemming lug'atni **necha foiz** kamaytiradi?

**40.** Sharhlarni stem qilib eng ko'p uchraydigan o'zaklarni toping.

<details>
<summary>✅ Yechimlar 38–40</summary>

```python
# 38 — YOLG'ON BIRLASHTIRISH (false merge)
juftlar = [("universe","university"), ("busy","business"),
           ("organ","organization"), ("relative","relativity")]
for a, b in juftlar:
    print(f"{a:12s} → {ps.stem(a):10s}   {b:14s} → {ps.stem(b)}")
# universe     → univers      university     → univers
# busy         → busi         business       → busi
# organ        → organ        organization   → organ
# relative     → rel          relativity     → rel
# ❌ Bular BUTUNLAY BOSHQA so'zlar, lekin bir xil o'zakka tushdi!

# 39
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")
xom = set(word_tokenize(re.sub(r"[^\w\s]", "", " ".join(data["Review"]).lower())))
stemlangan = set(ps.stem(w) for w in xom)
print(f"{len(xom)} → {len(stemlangan)}  ({100 - round(len(stemlangan)/len(xom)*100)}% kamaydi)")
# 2767 → 2282  (18% kamaydi)

# 40
en_sw = stopwords.words('english')
tok = [ps.stem(w) for w in word_tokenize(
        re.sub(r"[^\w\s]", "", " ".join(data["Review"]).lower()))
       if w not in en_sw]
print(pd.Series(tok).value_counts()[:5].to_dict())
# {'hotel': 292, 'room': 275, 'stay': 160, 'great': 126, 'staff': 90}
# 🔑 "stay" 160 marta! Chunki stay + stayed + staying + stays HAMMASI
#    bitta "stay" o'zagiga tushdi. Stemmingsiz ular ALOHIDA sanalardi.
```

</details>

---

# F · Lemmatization *(41–44)*

### 🟢 Oson

**41.** `"studies"`, `"feet"`, `"better"` ni lemmatizatsiya qiling.

**42.** Stemming va lemmatization natijasini solishtiring.

<details>
<summary>✅ Yechimlar 41–42</summary>

```python
lemmatizer = WordNetLemmatizer()

# 41
for w in ["studies", "feet", "better"]:
    print(f"{w:9s} → {lemmatizer.lemmatize(w)}")
# studies   → study
# feet      → foot      ✅ NOTO'G'RI KO'PLIKNI BILDI!
# better    → better    ⚠️ "good" ni topmadi (pos kerak)

# 42
print(f"{'so\'z':14s} {'STEM':12s} {'LEMMA':12s}")
for w in ["studies", "running", "universities", "feet", "expensive"]:
    print(f"{w:14s} {ps.stem(w):12s} {lemmatizer.lemmatize(w):12s}")
# so'z           STEM         LEMMA
# studies        studi        study
# running        run          running
# universities   univers      university
# feet           feet         foot
# expensive      expens       expensive
```

</details>

### 🟡 O'rta

**43.** `pos` parametri bilan fe'llarni to'g'ri lemmatizatsiya qiling.

**44.** Lemmatization lug'atni necha foiz kamaytiradi?

<details>
<summary>✅ Yechimlar 43–44</summary>

```python
# 43 — pos SEHRI
for w in ["running", "better", "was", "arrived"]:
    print(f"{w:9s}  possiz={lemmatizer.lemmatize(w):10s} "
          f"pos='v'={lemmatizer.lemmatize(w, pos='v'):10s} "
          f"pos='a'={lemmatizer.lemmatize(w, pos='a')}")
# running    possiz=running    pos='v'=run        pos='a'=running
# better     possiz=better     pos='v'=better     pos='a'=good      ⭐
# was        possiz=wa         pos='v'=be         pos='a'=was       ⭐
# arrived    possiz=arrived    pos='v'=arrive     pos='a'=arrived
# 🔑 pos BERMASANGIZ, lemmatizer so'zni OT deb o'ylaydi!

# 44
lemlangan = set(lemmatizer.lemmatize(w) for w in xom)
print(f"{len(xom)} → {len(lemlangan)}  ({100 - round(len(lemlangan)/len(xom)*100)}% kamaydi)")
# 2767 → 2593  (6% kamaydi)
# 🔑 Stemming 18%, lemmatization ATIGI 6% — lemmatization EHTIYOTKORROQ
```

</details>

---

# G · N-grammalar *(45–48)*

### 🟡 O'rta

**45.** Bigramma va trigrammalarni yarating.

**46.** Eng ko'p uchraydigan bigrammalarni toping.

<details>
<summary>✅ Yechimlar 45–46</summary>

```python
tok = ["great", "hotel", "great", "location", "great", "hotel"]

# 45
print(list(nltk.ngrams(tok, 2)))
# [('great', 'hotel'), ('hotel', 'great'), ('great', 'location'),
#  ('location', 'great'), ('great', 'hotel')]
print(list(nltk.ngrams(tok, 3)))
# [('great', 'hotel', 'great'), ('hotel', 'great', 'location'),
#  ('great', 'location', 'great'), ('location', 'great', 'hotel')]

# 46
print(pd.Series(nltk.ngrams(tok, 2)).value_counts()[:2])
# (great, hotel)      2
# (hotel, great)      1
```

</details>

### 🔴 Qiyin

**47.** 109 ta sharhning to'liq quvurini ishga tushirib top-5 bigrammani toping.

**48.** 1-yulduz va 5-yulduz bigrammalarini solishtiring.

<details>
<summary>✅ Yechimlar 47–48</summary>

```python
# TO'LIQ QUVUR
en_sw = stopwords.words('english'); en_sw.remove("not")

def tozala(m):
    m = m.lower()
    m = " ".join([w for w in m.split() if w not in en_sw])
    m = re.sub(r"\*", "star", m)
    m = re.sub(r"[^\w\s]", "", m)
    return [lemmatizer.lemmatize(t) for t in word_tokenize(m)]

data["tok"] = data["Review"].apply(tozala)

# 47
barcha = sum(data["tok"], [])
print(pd.Series(nltk.ngrams(barcha, 2)).value_counts()[:5])
# (great, location)    24
# (space, needle)      21
# (hotel, monaco)      16
# (staff, friendly)    12
# (pike, place)        12

# 48
for r in [1, 5]:
    kichik = sum(data[data["Rating"] == r]["tok"], [])
    print(f"\n{r} YULDUZ:")
    print(pd.Series(nltk.ngrams(kichik, 2)).value_counts()[:3])
# 1 YULDUZ:            5 YULDUZ:
# (smoking, room) 4    (great, location) 12
# (queen, anne)   4    (hotel, monaco)   10
# (called, desk)  3    (great, hotel)     8
#
# 🔑 SALBIY: chekish xonasi, resepshinga qo'ng'iroq
#    IJOBIY: joylashuv, mehmonxona nomi
```

</details>

---

## 🏆 Yakuniy tekshiruv

Quyidagi jumlani **qo'lda** to'liq quvurdan o'tkazing *(kodsiz!)*:

```
"The ROOMS were NOT clean!!! Only a 2* experience."
```

<details>
<summary>✅ Javob — qadamma-qadam</summary>

```
ASL:      "The ROOMS were NOT clean!!! Only a 2* experience."

1 · lower:      "the rooms were not clean!!! only a 2* experience."

2 · stopwords:  the ❌  rooms ✅  were ❌  not ✅(saqladik!)  clean!!! ✅
                only ❌  a ❌  2* ✅  experience. ✅
                → "rooms not clean!!! 2* experience."

3a · yulduzcha: → "rooms not clean!!! 2star experience."

3b · tinish:    → "rooms not clean 2star experience"

4 · tokenize:   → ['rooms', 'not', 'clean', '2star', 'experience']

5 · lemma:      → ['room', 'not', 'clean', '2star', 'experience']
                     ↑                ↑
                  ko'plik→birlik   INKOR SAQLANDI ⭐
```

Tekshirish:

```python
print(tozala("The ROOMS were NOT clean!!! Only a 2* experience."))
# ['room', 'not', 'clean', '2star', 'experience']
```

</details>

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
