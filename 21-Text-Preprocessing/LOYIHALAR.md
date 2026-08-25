# 🚀 21-modul — Mini-loyihalar

> 6 ta tayyor loyiha. Har biri **ishlaydi** — kodni nusxalab ishga tushiring.

📁 Barcha loyihalar `data/tripadvisor_hotel_reviews.csv` bilan ishlaydi (109 ta haqiqiy mehmonxona sharhi).

---

## ⚙️ Umumiy tayyorgarlik

Har bir loyiha shu boshlanish bilan ishlaydi:

```python
import nltk, re, pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer

# Birinchi marta ishga tushirsangiz:
# nltk.download('stopwords')
# nltk.download('punkt_tab')
# nltk.download('wordnet')

ps = PorterStemmer()
lemmatizer = WordNetLemmatizer()
en_stopwords = stopwords.words('english')
en_stopwords.remove("not")          # ⭐ INKORNI SAQLAYMIZ
```

---

## 1️⃣ Loyiha — Matn tozalash mashinasi

**Maqsad:** Har qanday matnni bir buyruq bilan to'liq tozalaydigan funksiya.

```python
def tozala(matn, stem=False):
    """To'liq oldindan qayta ishlash quvuri.

    stem=False  →  lemmatization (asl so'z saqlanadi)
    stem=True   →  stemming     (o'zak qoladi)
    """
    matn = matn.lower()                                        # 1 · kichik harf
    matn = " ".join([w for w in matn.split()
                     if w not in en_stopwords])                # 2 · to'xtatish so'zlari
    matn = re.sub(r"\*", "star", matn)                         # 3a · yulduzchani saqlash
    matn = re.sub(r"[^\w\s]", "", matn)                        # 3b · tinish belgilar
    tokens = word_tokenize(matn)                               # 4 · tokenizatsiya
    if stem:
        return [ps.stem(t) for t in tokens]                    # 5a
    return [lemmatizer.lemmatize(t) for t in tokens]           # 5b


# ===== SINOV =====
sinovlar = [
    "The rooms were NOT clean!!! 3* at best.",
    "Amazing staff, great location, wonderful views!",
]

for s in sinovlar:
    print(tozala(s))
```

**Natija:**

```
['room', 'not', 'clean', '3star', 'best']
['amazing', 'staff', 'great', 'location', 'wonderful', 'view']
```

### 🔑 Nimaga e'tibor bering

| Kirish | Chiqish | Nima bo'ldi |
|---|---|---|
| `NOT` | **`not`** ✅ | Inkor **saqlandi** |
| `3*` | **`3star`** ✅ | Yulduzcha **so'zga aylandi** |
| `rooms` | `room` | Lemmatization |
| `views` | `view` | Lemmatization |
| `!!!`, `,`, `.` | *(yo'q)* | Tinish belgilar o'chdi |

---

## 2️⃣ Loyiha — Sharhlar tahlilchisi

**Maqsad:** 109 ta sharhdan avtomatik hisobot.

```python
data = pd.read_csv("data/tripadvisor_hotel_reviews.csv")
data["tok"] = data["Review"].apply(tozala)

barcha = sum(data["tok"], [])

print("=" * 46)
print("     MEHMONXONA SHARHLARI — HISOBOT")
print("=" * 46)
print(f"Sharhlar soni : {len(data)}")
print(f"Jami token    : {len(barcha)}")
print(f"Noyob so'z    : {len(set(barcha))}")
print(f"O'rtacha uzunlik: {round(len(barcha)/len(data))} token/sharh")
print()

print("--- ENG KO'P UCHRAYDIGAN 5 SO'Z ---")
for soz, son in pd.Series(barcha).value_counts()[:5].items():
    print(f"  {soz:12s} {son:4d}  {'█' * (son // 15)}")
print()

print("--- ENG KO'P UCHRAYDIGAN 3 BIGRAMMA ---")
bg = pd.Series(nltk.ngrams(barcha, 2)).value_counts()
for pair, son in bg[:3].items():
    print(f"  {' '.join(pair):20s} {son:3d}")
print("=" * 46)
```

**Natija:**

```
==============================================
     MEHMONXONA SHARHLARI — HISOBOT
==============================================
Sharhlar soni : 109
Jami token    : 9407
Noyob so'z    : 2589
O'rtacha uzunlik: 86 token/sharh

--- ENG KO'P UCHRAYDIGAN 5 SO'Z ---
  hotel         292  ███████████████████
  room          275  ██████████████████
  great         126  ████████
  not           122  ████████
  stay           95  ██████

--- ENG KO'P UCHRAYDIGAN 3 BIGRAMMA ---
  great location        24
  space needle          21
  hotel monaco          16
==============================================
```

---

## 3️⃣ Loyiha — Yaxshi va yomon sharhlar taqqoslash

**Maqsad:** Norozi mijozlar **nima haqida**, mamnun mijozlar **nima haqida** gapiradi?

```python
past = data[data["Rating"] <= 2]         # 1–2 yulduz
yuqori = data[data["Rating"] >= 4]       # 4–5 yulduz

tok_past = sum(past["tok"], [])
tok_yuqori = sum(yuqori["tok"], [])

s_past = pd.Series(tok_past).value_counts()
s_yuqori = pd.Series(tok_yuqori).value_counts()

print(f"😠 PAST reyting  : {len(past)} sharh, {len(tok_past)} token")
print(f"😀 YUQORI reyting: {len(yuqori)} sharh, {len(tok_yuqori)} token")
print()

# Har birining TOP-60 sida bor, lekin ikkinchisida YO'Q so'zlar
faqat_past   = [w for w in s_past[:60].index   if w not in s_yuqori[:60].index]
faqat_yuqori = [w for w in s_yuqori[:60].index if w not in s_past[:60].index]

print("😠 FAQAT past reytingda:")
print("  ", faqat_past[:8])
print()
print("😀 FAQAT yuqori reytingda:")
print("  ", faqat_yuqori[:8])
```

**Natija:**

```
😠 PAST reyting  : 22 sharh, 2429 token
😀 YUQORI reyting: 75 sharh, 5725 token

😠 FAQAT past reytingda:
   ['asked', 'reservation', 'told', 'got', 'manager', 'sheet', 'make', 'morning']

😀 FAQAT yuqori reytingda:
   ['view', 'place', 'market', 'restaurant', 'clean', 'friendly', 'excellent', 'helpful']
```

### 🎯 Bu — HAQIQIY biznes tahlili

| 😠 Norozi mijoz so'zlari | Nimani anglatadi |
|---|---|
| `asked`, `told`, `manager` | **Nizo!** Mijoz so'radi → aytishdi → menejer chaqirildi |
| `reservation` | **Bron muammosi** |
| `sheet` | **Choyshab** — tozalik shikoyati |

| 😀 Mamnun mijoz so'zlari | Nimani anglatadi |
|---|---|
| `view`, `place`, `market` | **Joylashuv** va **manzara** |
| `clean` | **Tozalik** |
| `friendly`, `helpful`, `excellent` | **Xodimlar** |

> ## 💡 **Xulosa mehmonxona egasiga:** *bron tizimi* va *choyshab almashtirish* — muammo. *Joylashuv* va *xodimlar* — kuchli tomon.

---

## 4️⃣ Loyiha — Sharh qidiruv tizimi

**Maqsad:** So'rovga eng mos sharhlarni topish. **Stemming** yordamida — `"parking"` so'rovi `"parked"` bo'lgan sharhni ham topadi.

```python
def qidir(sorov, n=3):
    """Stemming asosida sharh qidirish."""
    sorov_tok = set(tozala(sorov, stem=True))      # ⭐ so'rovni ham STEM qilamiz
    ballar = []
    for i, tokens in enumerate(data["tok"]):
        sharh_tok = set(ps.stem(w) for w in tokens)
        moslik = len(sorov_tok & sharh_tok)         # kesishma = umumiy so'zlar
        ballar.append((moslik, i))
    ballar.sort(reverse=True)
    return ballar[:n]


sorov = "free breakfast parking"
print(f"🔍 So'rov: '{sorov}'\n")

for ball, i in qidir(sorov):
    print(f"  Ball={ball}  Reyting={data['Rating'][i]} ⭐")
    print(f"  {data['Review'][i][:60]}...")
    print()
```

**Natija:**

```
🔍 So'rov: 'free breakfast parking'

  Ball=3  Reyting=4 ⭐
  good location value downtown stayed town conference conventi...

  Ball=3  Reyting=3 ⭐
  ace not place husband stayed ace hotel seattle nights excite...

  Ball=3  Reyting=4 ⭐
  great value seattle spouse stayed warwick seattle days septe...
```

### 🔑 Nima uchun STEMMING?

```
So'rov:  "parking"   →  stem  →  "park"
Sharh:   "parked"    →  stem  →  "park"   ✅ MOS KELDI!

Stemmingsiz:  "parking" ≠ "parked"  ❌ TOPILMAS EDI
```

> 💡 **Google, Amazon** va boshqa qidiruv tizimlari **aynan shunday** ishlaydi.

---

## 5️⃣ Loyiha — Stemming vs Lemmatization tarozisi

**Maqsad:** Ikki usulni **raqamlar bilan** taqqoslash.

```python
xom = set(sum(data["Review"].apply(
    lambda x: word_tokenize(re.sub(r"[^\w\s]", "", x.lower()))), []))

stem_soz = set(ps.stem(w) for w in xom)
lem_soz  = set(lemmatizer.lemmatize(w) for w in xom)

print("=" * 46)
print("  LUG'AT HAJMI TAQQOSLASH")
print("=" * 46)
print(f"Xom (tozalanmagan)  : {len(xom):5d}")
print(f"Stemming'dan keyin  : {len(stem_soz):5d}   "
      f"({100 - round(len(stem_soz)/len(xom)*100)}% kamaydi)")
print(f"Lemmatization'dan   : {len(lem_soz):5d}   "
      f"({100 - round(len(lem_soz)/len(xom)*100)}% kamaydi)")
print("=" * 46)
print()

print(f"{'So\\'z':14s} {'STEM':14s} {'LEMMA':14s}")
print("-" * 44)
for w in ["studies", "better", "running", "universities", "feet"]:
    print(f"{w:14s} {ps.stem(w):14s} {lemmatizer.lemmatize(w):14s}")
```

**Natija:**

```
==============================================
  LUG'AT HAJMI TAQQOSLASH
==============================================
Xom (tozalanmagan)  :  2767
Stemming'dan keyin  :  2282   (18% kamaydi)
Lemmatization'dan   :  2593   (6% kamaydi)
==============================================

So'z           STEM           LEMMA
--------------------------------------------
studies        studi          study
better         better         better
running        run            running
universities   univers        university
feet           feet           foot
```

### 🔑 Har bir qatorni tahlil qiling

| So'z | Stem | Lemma | Kim yutdi? |
|---|---|---|---|
| `studies` | `studi` ❌ | **`study`** ✅ | **Lemma** — haqiqiy so'z |
| `better` | `better` | `better` | **Hech kim** — ikkalasi ham `good` ni topmadi |
| `running` | **`run`** ✅ | `running` ❌ | **Stem** — lemma `pos="v"` siz fe'lni bilmaydi |
| `universities` | `univers` ❌ | **`university`** ✅ | **Lemma** |
| `feet` | `feet` ❌ | **`foot`** ✅ | **Lemma** — noto'g'ri ko'plikni bildi! |

> ## ⚠️ **Hech qaysisi mukammal emas.** Stemming **tezroq va agressivroq**, lemmatization **aniqroq lekin sekinroq**. Vazifangizga qarab tanlang.

---

## 6️⃣ Loyiha — Reyting bo'yicha mavzu detektori

**Maqsad:** Har bir reyting darajasida **qanday mavzu** hukmron?

```python
print("=" * 52)
print("   REYTING BO'YICHA HUKMRON MAVZULAR")
print("=" * 52)

for r in [1, 3, 5]:
    kichik = sum(data[data["Rating"] == r]["tok"], [])
    bg = pd.Series(nltk.ngrams(kichik, 2)).value_counts()[:3]
    print(f"\n{'⭐' * r}  ({r} yulduz)")
    for pair, son in bg.items():
        print(f"     {' '.join(pair):22s} {son}")
print()
print("=" * 52)
```

**Natija:**

```
====================================================
   REYTING BO'YICHA HUKMRON MAVZULAR
====================================================

⭐  (1 yulduz)
     smoking room           4
     queen anne             4
     called desk            3

⭐⭐⭐  (3 yulduz)
     desk clerk             3
     street parking         3
     motel 6                3

⭐⭐⭐⭐⭐  (5 yulduz)
     great location         12
     hotel monaco           10
     great hotel            8

====================================================
```

### 🎯 Hikoya raqamlarda

```
1 ⭐  →  "smoking room"    Chekish hidli xona    😠
         "called desk"     Resepshinga qo'ng'iroq (muammo!)

3 ⭐  →  "street parking"  Ko'chada parkovka     😐
         "motel 6"         Arzon motel bilan solishtirish

5 ⭐  →  "great location"  Ajoyib joylashuv      😀
         "great hotel"     Ajoyib mehmonxona
```

> ## 💡 **Faqat BIGRAMMALARDAN** mehmonxona egasi bilib oldi: **chekish xonalari** va **parkovka** — asosiy muammo.

---

## 🎓 Yakuniy vazifa

Yuqoridagi 6 loyihani **bitta dasturga** birlashtiring:

```
====== SHARH TAHLIL TIZIMI ======
1 · Matnni tozalash
2 · Umumiy hisobot
3 · Yaxshi/yomon taqqoslash
4 · Sharh qidirish
5 · Stemming vs Lemmatization
6 · Reyting mavzulari
0 · Chiqish
Tanlang:
```

<details>
<summary>💡 Boshlash uchun karkas</summary>

```python
def menyu():
    while True:
        print("\n====== SHARH TAHLIL TIZIMI ======")
        print("1 · Matnni tozalash")
        print("2 · Umumiy hisobot")
        print("3 · Yaxshi/yomon taqqoslash")
        print("4 · Sharh qidirish")
        print("5 · Stemming vs Lemmatization")
        print("6 · Reyting mavzulari")
        print("0 · Chiqish")

        tanlov = input("Tanlang: ")

        if tanlov == "0":
            print("Xayr! 👋")
            break
        elif tanlov == "1":
            matn = input("Matn: ")
            print(tozala(matn))
        elif tanlov == "4":
            print(qidir(input("So'rov: ")))
        # ... qolganlarini o'zingiz yozing
        else:
            print("Noto'g'ri tanlov!")

menyu()
```

</details>

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md)
