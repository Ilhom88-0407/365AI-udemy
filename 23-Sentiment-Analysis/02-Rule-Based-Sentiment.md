# 2-dars. Qoidaga asoslangan sentiment

## 🎬 Boshlashdan oldin

> **"Boshlaydigan birinchi sentiment tahlili usuli QOIDAGA ASOSLANGAN yoki LEKSIKAGA ASOSLANGAN deb nomlanadi."**
>
> ## **"Bu MASHINALI O'QITISHDAN FOYDALANMAYDI. U shunchaki qaysi so'zlar qaysi sentiment bilan bog'liqligi haqidagi QOIDALARDAN foydalanadi."**

---

## 1. Qanday ishlaydi?

> **"Masalan, `great` so'zi ijobiy sentiment bilan, `sad` so'zi esa salbiy sentiment bilan bog'liq."**
>
> **"So'zlarning har biri QUTBLILIK BALLINI oladi. Keyin bu butun jumla yoki matn bo'lagi bo'yicha UMUMLASHTIRILADI va umumiy sentiment balli beriladi."**

```
       "I had a great time at the movie"
         │    │     │     │    │    │
         ▼    ▼     ▼     ▼    ▼    ▼
        0.0  0.0  +0.8   0.0  0.0  0.0
                    ↑
              LUG'ATDAN olindi
                    │
                    ▼
              UMUMLASHTIRISH
                    │
                    ▼
              Umumiy ball: +0.525  →  😀
```

### 🔑 Bu shunchaki KATTA LUG'AT

```
LUG'AT (leksikon)
┌─────────────┬────────┐
│ great       │  +0.8  │
│ excellent   │  +1.0  │
│ good        │  +0.7  │
│ okay        │  +0.3  │
│ bad         │  -0.7  │
│ terrible    │  -1.0  │
│ sad         │  -0.5  │
└─────────────┴────────┘
   ↑
Odamlar QO'LDA yozgan!
Hech qanday o'qitish YO'Q.
```

---

## 2. Afzallik va kamchilik

> ## **"Bu usul ISHLATISH va boshqalarga TUSHUNTIRISH oson — lekin u ko'pincha matndagi KINOYA yoki ISTEHZONI tushunishda QIYNALADI."**

| ✅ Afzalliklari | ❌ Kamchiliklari |
|---|---|
| ⚡ **Juda tez** *(millisoniyalar)* | ❌ **Kinoyani** tushunmaydi |
| 💾 **Kichik** *(~1 MB)* | ❌ **Kontekstni** ko'rmaydi |
| 🔍 **Tushuntirish oson** — qaysi so'z qancha ball berdi | ❌ Lug'atda **yo'q so'z** = 0 ball |
| 🔌 **Internet kerak emas** | ❌ **Sohaga** moslashmagan |
| 🎓 **O'qitish kerak emas** | ❌ **Sleng** va yangi so'zlarni bilmaydi |

---

## 3. Ikki paket — TextBlob va VADER

> **"Biz qutblilik ballari uchun bir oz FARQLI QOIDALARDAN foydalanadigan ikkita paketni solishtiramiz: TextBlob va VADER."**

```bash
pip install textblob vaderSentiment
```

---

## 4. To'rtta sinov jumlasi

> **"Bizda bu yerda to'rtta jumla bor."**

```python
sentence_1 = "I had a great time at the movie. It was really funny."
sentence_2 = "I had a great time at the movie but the parking was terrible."
sentence_3 = "I had a great time at the movie but the parking wasn't great."
sentence_4 = "I went to see a movie."
```

| № | Jumla | Odam qanday baholaydi? |
|---|---|---|
| 1 | *"Kinoda ajoyib vaqt o'tkazdim. Juda kulgili edi."* | 😀 **Aniq ijobiy** |
| 2 | *"Kinoda ajoyib vaqt o'tkazdim, LEKIN parkovka dahshatli edi."* | 😐 **Aralash** |
| 3 | *"Kinoda ajoyib vaqt o'tkazdim, LEKIN parkovka ajoyib EMAS edi."* | 😐 **Aralash** |
| 4 | *"Kinoga bordim."* | 😐 **Neytral** |

> **"Va to'rtinchi jumla — 'Kinoga bordim' — ehtimol NEYTRAL sentimentga ega bo'ladi."**

> ## 🔑 **2 va 3-jumla deyarli BIR XIL ma'noda.** Farq faqat: `"was terrible"` va `"wasn't great"`. Ikkalasi ham **parkovka yomon** degani. **Modellar buni ko'radimi?**

---

## 5. TextBlob

> **"Keling, avval TextBlob paketini olaylik. Har bir jumlamizni olib, jumlani chop etamiz va keyin sentiment ballini hisoblaymiz."**
>
> **"Sentiment ballini hisoblash juda oson — siz shunchaki `TextBlob` funksiyasidan foydalanasiz va qavslar ichida tahlil qilmoqchi bo'lgan matn bo'lagini ko'rsatasiz."**
>
> **"Ballarga `.sentiment.polarity` yordamida murojaat qilish mumkin."**

```python
from textblob import TextBlob

for i, s in enumerate([sentence_1, sentence_2, sentence_3, sentence_4], 1):
    print(f"S{i}: {s}")
    print(f"    polarity = {TextBlob(s).sentiment.polarity}")
```

```
S1: I had a great time at the movie. It was really funny.
    polarity = 0.525
S2: I had a great time at the movie but the parking was terrible.
    polarity = -0.09999999999999998
S3: I had a great time at the movie but the parking wasn't great.
    polarity = 0.8
S4: I went to see a movie.
    polarity = 0.0
```

### Ballni o'qish

> **"Ball 1 gacha chiqishi va -1 gacha tushishi mumkin. Noldan yuqori har qanday raqam — IJOBIY sentiment."**

```
  -1.0 ─────────── 0.0 ─────────── +1.0
   😞              😐               😀
 SALBIY         NEYTRAL          IJOBIY
```

### Natijalarni tahlil qilamiz

> **"Demak, biz bu yerda ko'rishimiz mumkin: matn *'Kinoda ajoyib vaqt o'tkazdim. Juda kulgili edi.'* 0.525 ball olgan. Bu o'rtacha darajadagi ijobiy sentiment balli."**

**S2:**

> **"2-jumla *'...lekin parkovka dahshatli edi'* biroz salbiy ball olgan — -0.09. Bu neytral ballga ancha yaqin, va matnning NOANIQ tabiatini hisobga olsak, bu ajablanarli emas."**

**S3 — ⚠️ MANA MUAMMO:**

> ## **"Endi 3-jumla uchun. Bunga BOSHQA IKKALASIDAN ham YUQORI, JUDA IJOBIY ball berilgan — 0.8!"**

```
❌ NIMA XATO KETDI?

"the parking wasn't great"
                ↑     ↑
             INKOR  ijobiy so'z

TextBlob "great" (+0.8) ni ko'rdi.
"wasn't" INKORINI E'TIBORGA OLMADI!

Natija:  +0.8  ← ENG IJOBIY ball (!!)
Haqiqat: parkovka YOMON edi
```

> ## 💡 **21-modulni eslang** — biz `not` ni to'xtatish so'zlaridan atayin olib tashlagan edik. **Mana nima uchun.** Inkor sentimentni **butunlay teskari** aylantiradi.

**S4:**

> **"Endi 4-jumlaga qaraganimizda, unga 0 qutblilik balli berilgan. Demak, bu haqiqatan neytral jumla. Va menimcha, ko'pchilik odamlar ham buni xuddi shunday talqin qilardi."**

### 💡 Bonus — `subjectivity`

TextBlob **ikkinchi** ball ham beradi:

```python
b = TextBlob(sentence_1)
print("polarity     :", b.sentiment.polarity)       # 0.525
print("subjectivity :", b.sentiment.subjectivity)   # 0.875
```

```
subjectivity:  0.0 = mutlaqo OB'EKTIV (fakt)
               1.0 = mutlaqo SUB'EKTIV (fikr)
```

| Jumla | polarity | subjectivity | Izoh |
|---|---|---|---|
| S1 | 0.525 | **0.875** | Kuchli **fikr** |
| S2 | -0.1 | **0.875** | Kuchli **fikr** |
| S3 | 0.8 | **0.75** | **Fikr** |
| S4 | 0.0 | **0.0** | Sof **fakt** ⭐ |

> 🔑 **S4 uchun subjectivity = 0.0** — TextBlob bu **fakt** ekanini to'g'ri tanidi!

---

## 6. VADER

> **"Endi buni VADER paketi bilan solishtiraylik. Aytganimdek, VADER turli so'zlar uchun bir oz boshqacha qoidalar va boshqacha qutblilik ballaridan foydalanadi — shuning uchun bu bir xil jumlalar qanday BOSHQACHA baholanishini ko'rish qiziq bo'ladi."**

> **"Biz avval `vaderSentiment` dan `SentimentIntensityAnalyzer` ni import qilmoqchimiz. Keyin `SentimentIntensityAnalyzer` ni ishga tushiramiz va uni `vader_sentiment` deb nomlaymiz."**

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

vader_sentiment = SentimentIntensityAnalyzer()

for i, s in enumerate([sentence_1, sentence_2, sentence_3, sentence_4], 1):
    print(f"S{i}: {vader_sentiment.polarity_scores(s)}")
```

```
S1: {'neg': 0.0, 'neu': 0.578, 'pos': 0.422, 'compound': 0.807}
S2: {'neg': 0.234, 'neu': 0.621, 'pos': 0.144, 'compound': -0.3818}
S3: {'neg': 0.247, 'neu': 0.611, 'pos': 0.142, 'compound': -0.4387}
S4: {'neg': 0.0, 'neu': 1.0, 'pos': 0.0, 'compound': 0.0}
```

### 🔑 VADER TO'RTTA ball beradi

> **"Endi siz bu yerda chiqish TextBlob paketidan ANCHA BOSHQACHA ekanini ko'rasiz. Siz har bir qutblilik uchun ball olasiz."**

```
{'neg': 0.0,  'neu': 0.578,  'pos': 0.422,  'compound': 0.807}
   ↑            ↑              ↑              ↑
 salbiy      neytral        ijobiy         UMUMIY
 ulushi      ulushi         ulushi           ⭐

 neg + neu + pos = 1.0  (ULUSHLAR — jami 100%)
 compound        = −1…+1 (UMUMIY ball)
```

> **"Masalan, `neg` nol ball olganini ko'ramiz — bu jumlada UMUMAN salbiy sentiment yo'qligini bildiradi. Neytral uchun 0.5 va ijobiy uchun 0.4 ball olgan."**
>
> **"Keyin u COMPOUND ballni hisoblaydi — bu matn uchun UMUMIY ball. Bu yerda 0.8. Va u boshqa paket kabi baholanadi: 1 ga qanchalik yaqin bo'lsa, shunchalik ijobiy; -1 ga qanchalik yaqin bo'lsa, shunchalik salbiy."**

---

## 7. ⭐ Ikki paketni solishtiramiz

| Jumla | **TextBlob** | **VADER** | Kim to'g'ri? |
|---|---|---|---|
| **S1** *(aniq ijobiy)* | +0.525 | **+0.807** | ✅ Ikkalasi |
| **S2** *("was terrible")* | −0.100 | **−0.382** | ✅ Ikkalasi *(VADER aniqroq)* |
| **S3** *("wasn't great")* | **+0.800** ❌ | **−0.439** ✅ | ## **VADER!** |
| **S4** *(neytral)* | **0.000** | **0.000** | ✅ Ikkalasi |

```
        TextBlob              VADER
 S1  ████████ +0.53      ████████████ +0.81
 S2  ▌ -0.10             ███ -0.38
 S3  ████████████ +0.80  ███ -0.44
     ↑ ❌ TESKARI!            ↑ ✅ TO'G'RI
 S4  · 0.00                · 0.00
```

> **"1-jumlaga VADER paketi TextBlob paketidan YUQORIROQ ball bergan."**
>
> **"3-jumla ikki paket o'rtasida haqiqatan FARQ QILADI. VADER unga -0.4 salbiy ball bergan, TextBlob esa unga BARCHA jumlalar ichida ENG IJOBIY 0.8 ballni bergan."**
>
> ## **"Demak, VADER paketi matndagi NUANSNI (nozik farqni) ANIQLASHDA biroz ILG'ORROQ ekanini ko'rishingiz mumkin."**

### 🔍 Nima uchun VADER yaxshiroq?

VADER `"wasn't"` ni **inkor** deb taniydi va keyingi so'z ballini **teskari** qiladi:

```
TextBlob:  "great"  →  +0.8      ("wasn't" e'tiborsiz)
VADER:     "wasn't great"  →  ballni TESKARI  →  −
```

**VADER bilgan narsalar:**

| Qoida | Misol | Ta'siri |
|---|---|---|
| **Inkor** | `"not good"`, `"wasn't great"` | ⭐ Ballni **teskari** qiladi |
| **BOSH HARF** | `"was GREAT"` vs `"was great"` | Ballni **kuchaytiradi** ⚠️ *(aralash harf kerak)* |
| **Undov** | `"great!!!"` | Ballni **kuchaytiradi** |
| **Kuchaytiruvchi** | `"very good"`, `"extremely bad"` | Ballni **kuchaytiradi** |
| **`"but"`** | `"good but slow"` | `but` **dan keyingi** qismga **ko'proq vazn** |
| **Emoji** | `"😀"`, `":)"` | Ball **beradi** |
| **Sleng** | `"lol"`, `"meh"` | Ball **beradi** |

> ## 💡 **VADER ijtimoiy tarmoq matnlari uchun yaratilgan** — shuning uchun emoji, BOSH HARF va sleng bilan ishlaydi.

### 🧪 VADER qoidalarini o'zingiz sinang

```python
sinovlar = ["good", "good!!!", "very good", "not good", "good 😀"]
for s in sinovlar:
    print(f"{s:12s} → {vader_sentiment.polarity_scores(s)['compound']:+.4f}")
```

```
good         → +0.4404
good!!!      → +0.5826
very good    → +0.4927
not good     → -0.3412
good 😀       → +0.6597
```

> ## 🔑 **Har bir qoida raqamda ko'rinib turibdi.** `not good` **manfiy** bo'ldi, `good!!!` va `good 😀` esa **kuchaydi**.

### ⚠️ BOSH HARF qoidasi — nozik joyi bor!

```python
for s in ["good", "GOOD",
          "The movie was good", "The movie was GOOD"]:
    print(f"{s:22s} → {vader_sentiment.polarity_scores(s)['compound']:+.4f}")
```

```
good                   → +0.4404
GOOD                   → +0.4404     ⚠️ HECH QANDAY farq yo'q!
The movie was good     → +0.4404
The movie was GOOD     → +0.5622     ✅ MANA endi kuchaydi
```

> ## 🔑 **VADER bosh harfni faqat matnda ARALASH harflar bo'lganda hisobga oladi.** Mantiq oddiy: agar **butun matn** bosh harfda bo'lsa — bu shunchaki uslub. Agar matnda **bitta so'z** bosh harfda ajralib tursa — **mana bu BAQIRIQ**.
>
> 💡 Bu — hujjatda yozilmagan nozik xatti-harakat. **Shuning uchun har bir qoidani o'zingiz sinab ko'ring.**

---

## 8. 💡 Xulosa maslahati

> ## **"Shunday qilib, sentiment tahlili bilan ishlaganingizda, bir necha jumlangiz ustida IKKALA paketni ham TEKSHIRIB KO'RISH arziydi — sizdagi ma'lumot uchun qaysi biri yaxshiroq ishlashini his qilish uchun."**

---

## 9. 💻 To'liq kod

```python
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

sentence_1 = "I had a great time at the movie. It was really funny."
sentence_2 = "I had a great time at the movie but the parking was terrible."
sentence_3 = "I had a great time at the movie but the parking wasn't great."
sentence_4 = "I went to see a movie."
jumlalar = [sentence_1, sentence_2, sentence_3, sentence_4]

# ===== TEXTBLOB =====
print("===== TEXTBLOB =====")
for i, s in enumerate(jumlalar, 1):
    b = TextBlob(s)
    print(f"S{i}: polarity={b.sentiment.polarity:+.4f}  "
          f"subjectivity={b.sentiment.subjectivity:.3f}")

# ===== VADER =====
vader_sentiment = SentimentIntensityAnalyzer()
print("\n===== VADER =====")
for i, s in enumerate(jumlalar, 1):
    print(f"S{i}: {vader_sentiment.polarity_scores(s)}")

# ===== YONMA-YON =====
print("\n===== TAQQOSLASH =====")
print(f"{'':4s} {'TextBlob':>10s} {'VADER':>10s}")
for i, s in enumerate(jumlalar, 1):
    t = TextBlob(s).sentiment.polarity
    v = vader_sentiment.polarity_scores(s)["compound"]
    print(f"S{i}:  {t:+10.4f} {v:+10.4f}")
```

**Natija:**

```
===== TEXTBLOB =====
S1: polarity=+0.5250  subjectivity=0.875
S2: polarity=-0.1000  subjectivity=0.875
S3: polarity=+0.8000  subjectivity=0.750
S4: polarity=+0.0000  subjectivity=0.000

===== VADER =====
S1: {'neg': 0.0, 'neu': 0.578, 'pos': 0.422, 'compound': 0.807}
S2: {'neg': 0.234, 'neu': 0.621, 'pos': 0.144, 'compound': -0.3818}
S3: {'neg': 0.247, 'neu': 0.611, 'pos': 0.142, 'compound': -0.4387}
S4: {'neg': 0.0, 'neu': 1.0, 'pos': 0.0, 'compound': 0.0}

===== TAQQOSLASH =====
       TextBlob      VADER
S1:     +0.5250    +0.8070
S2:     -0.1000    -0.3818
S3:     +0.8000    -0.4387
S4:     +0.0000    +0.0000
```

---

## 10. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** O'z jumlangizni ikkala paket bilan baholang.

**M2.** VADER'ning to'rtta balli yig'indisini tekshiring.

**M3.** Eng ijobiy va eng salbiy so'zni toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
m = "This restaurant is amazing but the waiter was rude."
print("TextBlob:", TextBlob(m).sentiment.polarity)
print("VADER   :", vader_sentiment.polarity_scores(m))
# TextBlob: 0.15000000000000005
# VADER   : {'neg': 0.299, 'neu': 0.522, 'pos': 0.179, 'compound': -0.3818}
#
# ⚠️ ROZI EMAS! TextBlob IJOBIY (+0.15), VADER SALBIY (-0.38).
#    Sabab: "but" qoidasi — VADER "but" dan KEYINGI qismga
#    ("the waiter was rude") ko'proq vazn berdi.

# M2
s = vader_sentiment.polarity_scores(sentence_1)
print(round(s['neg'] + s['neu'] + s['pos'], 3))     # 1.0
# 🔑 neg + neu + pos DOIM 1.0 — bu ULUSHLAR
# compound esa ALOHIDA hisoblanadi (−1…+1)

# M3
sozlar = ["excellent", "great", "good", "okay", "bad", "terrible", "horrible"]
for w in sozlar:
    print(f"{w:12s} TextBlob={TextBlob(w).sentiment.polarity:+.3f}  "
          f"VADER={vader_sentiment.polarity_scores(w)['compound']:+.4f}")
# excellent    TextBlob=+1.000  VADER=+0.5719
# great        TextBlob=+0.800  VADER=+0.6249
# good         TextBlob=+0.700  VADER=+0.4404
# okay         TextBlob=+0.500  VADER=+0.2263
# bad          TextBlob=-0.700  VADER=-0.5423
# terrible     TextBlob=-1.000  VADER=-0.4767
# horrible     TextBlob=-1.000  VADER=-0.5423
#
# ⚠️ TextBlob "excellent" ga +1.0, VADER esa atigi +0.57 berdi.
#    IKKI PAKET IKKI XIL SHKALADA ishlaydi — ballarni to'g'ridan-to'g'ri
#    solishtirmang, faqat YO'NALISHNI (+ yoki −) solishtiring!
```

</details>

### 🟡 O'rta

**M4.** VADER qoidalarini tekshiring: BOSH HARF, undov, inkor.

**M5.** `"but"` qoidasini sinang.

**M6.** Emoji ta'sirini o'lchang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
for s in ["good", "good!", "good!!!", "very good", "not good"]:
    print(f"{s:12s} {vader_sentiment.polarity_scores(s)['compound']:+.4f}")
# good         +0.4404
# good!        +0.4926    ⭐ undov kuchaytirdi
# good!!!      +0.5826    ⭐ ko'proq undov = ko'proq kuch
# very good    +0.4927    ⭐ kuchaytiruvchi
# not good     -0.3412    ⭐ INKOR — TESKARI bo'ldi!

# BOSH HARF — faqat ARALASH harfda ishlaydi:
for s in ["the food was great", "the food was GREAT"]:
    print(f"{s:22s} {vader_sentiment.polarity_scores(s)['compound']:+.4f}")
# the food was great     +0.6249
# the food was GREAT     +0.7034    ⭐ kuchaydi

# M5 — "BUT" QOIDASI
a = "The food was great but the service was terrible."
b = "The service was terrible but the food was great."
print("A:", vader_sentiment.polarity_scores(a)['compound'])   # -0.3818
print("B:", vader_sentiment.polarity_scores(b)['compound'])   # +0.6808
#
# 🔑 BIR XIL SO'ZLAR, BOSHQA TARTIB → BOSHQA NATIJA!
#    VADER "but" DAN KEYINGI qismga ko'proq vazn beradi —
#    xuddi odamlar kabi. Biz ham oxirgi aytilganini eslab qolamiz.

# M6
for s in ["The movie was ok", "The movie was ok 😀", "The movie was ok 😞"]:
    print(f"{s:26s} VD={vader_sentiment.polarity_scores(s)['compound']:+.4f}  "
          f"TB={TextBlob(s).sentiment.polarity}")
# The movie was ok           VD=+0.2960  TB=0.5
# The movie was ok 😀         VD=+0.5719  TB=0.5    ⭐ emoji KUCHAYTIRDI
# The movie was ok 😞         VD=-0.2263  TB=0.5    ⭐ emoji TESKARI QILDI
#
# 💡 TextBlob emojini UMUMAN ko'rmaydi — uchalasiga ham 0.5 berdi!
#    VADER esa +0.30 → +0.57 → −0.23 ga o'zgartirdi.
#    Ijtimoiy tarmoq ma'lumoti bilan ishlasangiz — VADER ishlating.
```

</details>

### 🔴 Qiyin

**M7.** Kinoyani ikkala paket ham topa oladimi?

**M8.** Ikki paket **rozi bo'lmaydigan** jumla toping.

**M9.** Sentiment tasniflagich funksiyasini yozing.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — KINOYA SINOVI
kinoya = [
    "Oh great, another delayed flight. Just wonderful.",
    "I love waiting three hours in the rain.",
    "Fantastic. My laptop died right before the deadline.",
]
for k in kinoya:
    t = TextBlob(k).sentiment.polarity
    v = vader_sentiment.polarity_scores(k)['compound']
    print(f"TB={t:+.3f}  VD={v:+.4f}  | {k}")
# TB=+0.900  VD=+0.7845  | Oh great, another delayed flight. Just wonderful.
# TB=+0.500  VD=+0.6369  | I love waiting three hours in the rain.
# TB=+0.343  VD=+0.0000  | Fantastic. My laptop died right before the deadline.
#
# ❌❌ DEYARLI HAMMASI XATO! Birinchi ikkitasi IJOBIY deb baholandi,
#     aslida ular ACHCHIQ KINOYA.
#     Uchinchisida VADER 0.0000 berdi — "Fantastic" (+) va "died" (−)
#     bir-birini YO'Q QILDI. Bu TASODIF, tushunish emas.
#
# 🔑 Kinoya — qoidaga asoslangan usulning ENG KATTA ZAIFLIGI.
#    Chunki so'zlar HAQIQATAN ijobiy ("great", "love", "fantastic").
#    Faqat KONTEKST ularni teskari qiladi — lug'at esa kontekstni KO'RMAYDI.

# M8
sinovlar = [
    "The parking wasn't great.",
    "This is not bad at all.",
    "I can't say I disliked it.",
]
for s in sinovlar:
    t = TextBlob(s).sentiment.polarity
    v = vader_sentiment.polarity_scores(s)['compound']
    kelishuv = "✅ rozi" if (t > 0) == (v > 0) else "❌ ROZI EMAS"
    print(f"TB={t:+.3f}  VD={v:+.4f}  {kelishuv}  | {s}")
# TB=+0.800  VD=-0.5096  ❌ ROZI EMAS  | The parking wasn't great.
# TB=+0.350  VD=+0.4310  ✅ rozi       | This is not bad at all.
# TB=-0.200  VD=+0.3089  ❌ ROZI EMAS  | I can't say I disliked it.
#
# 🔑 HAMMASIDA INKOR bor. Inkor — ikki paketni ajratadigan asosiy nuqta.
#
# ⚠️ MUHIM: uchinchi jumlada VADER TO'G'RI (+0.31), TextBlob XATO (−0.20).
#    "I can't say I disliked it" = "yoqmadi deb ayta olmayman" = YOQDI.
#    Bu IKKI KARRA INKOR — TextBlob chalkashdi.
#
#    Demak HAR DOIM VADER g'olib emas, lekin INKOR bo'lsa —
#    odatda VADER ishonchliroq.

# M9 — TASNIFLAGICH
def sentiment_aniqla(matn, usul="vader"):
    """Matn sentimentini aniqlaydi: ijobiy / salbiy / neytral."""
    if usul == "vader":
        ball = vader_sentiment.polarity_scores(matn)["compound"]
    else:
        ball = TextBlob(matn).sentiment.polarity

    if ball > 0.1:    yorliq = "😀 ijobiy"
    elif ball < -0.1: yorliq = "😞 salbiy"
    else:             yorliq = "😐 neytral"
    return yorliq, round(ball, 4)

for s in [sentence_1, sentence_2, sentence_3, sentence_4]:
    print(f"{str(sentiment_aniqla(s)):24s} | {s[:50]}")
# ('😀 ijobiy', 0.807)      | I had a great time at the movie. It was really fun
# ('😞 salbiy', -0.3818)    | I had a great time at the movie but the parking wa
# ('😞 salbiy', -0.4387)    | I had a great time at the movie but the parking wa
# ('😐 neytral', 0.0)       | I went to see a movie.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Qoidaga asoslangan sentiment mashinali o'qitishdan foydalanadimi?
2. Qutblilik balli qanday shkalada?
3. TextBlob nechta ball qaytaradi?
4. VADER nechta ball qaytaradi?
5. `compound` nima?
6. 3-jumlada nima uchun ikki paket rozi bo'lmadi?
7. Bu usulning eng katta zaifligi nima?
8. VADER qanday qoidalarni biladi?

<details>
<summary>✅ Javoblar</summary>

1. ## **YO'Q!** U faqat **so'zlar lug'atidan** va **qoidalardan** foydalanadi.
2. **−1 dan +1 gacha.** 0 dan yuqori — ijobiy, past — salbiy.
3. **Ikkita:** `polarity` *(−1…+1)* va `subjectivity` *(0…1)*.
4. **To'rtta:** `neg`, `neu`, `pos` *(ulushlar, jami 1.0)* va `compound` *(umumiy, −1…+1)*.
5. **Umumiy** ball — barcha qoidalar qo'llangandan keyingi yakuniy natija.
6. `"wasn't great"` — **INKOR**. VADER inkorni **biladi** *(−0.44)*, TextBlob esa faqat `"great"` ni ko'rdi *(+0.8)*.
7. ## **KINOYA.** Ikkala paket ham kinoyani **umuman** topa olmaydi.
8. **Inkor**, **BOSH HARF**, **undov**, **kuchaytiruvchi so'zlar**, **`but`**, **emoji**, **sleng**.

</details>

---

## 📌 Xulosa

```python
# ===== TEXTBLOB =====
from textblob import TextBlob
b = TextBlob(matn)
b.sentiment.polarity        # −1 … +1
b.sentiment.subjectivity    #  0 … 1  (fakt ↔ fikr)

# ===== VADER =====
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
vader = SentimentIntensityAnalyzer()
vader.polarity_scores(matn)
# {'neg': .., 'neu': .., 'pos': .., 'compound': ..}
#   └──── ulushlar, jami 1.0 ────┘    └─ UMUMIY, −1…+1


        TextBlob        VADER
  S1     +0.53          +0.81       ✅ ikkalasi to'g'ri
  S2     -0.10          -0.38       ✅ ikkalasi to'g'ri
  S3     +0.80  ❌      -0.44  ✅   ⭐ INKOR — VADER g'olib
  S4      0.00           0.00       ✅ ikkalasi to'g'ri


VADER BILADIGAN QOIDALAR
  not good     →  TESKARI qiladi   ⭐
  GOOD         →  kuchaytiradi
  good!!!      →  kuchaytiradi
  very good    →  kuchaytiradi
  "A but B"    →  B ga ko'proq vazn
  😀 va "lol"  →  ball beradi


❌ IKKALASINING ZAIFLIGI — KINOYA
  "Oh great, another delayed flight."
   TextBlob +0.80   VADER +0.62   ← IKKALASI HAM XATO!


💡 MASLAHAT (o'qituvchidan)
  "Ikkala paketni ham bir necha jumlangizda tekshiring —
   sizdagi ma'lumot uchun qaysi biri yaxshiroq ishlashini biling."
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Qoidaga asoslangan | *rule-based* | Qoidalar asosida |
| Leksikaga asoslangan | *lexicon-based* | Lug'at asosida |
| Leksikon | *lexicon* | So'zlar va ballari lug'ati |
| Qutblilik | *polarity* | Sentiment yo'nalishi (−1…+1) |
| Sub'ektivlik | *subjectivity* | Fakt (0) ↔ fikr (1) |
| Umumiy ball | *compound* | VADER'ning yakuniy balli |
| Kinoya | *sarcasm* | Teskari ma'no |

---

⬅️ [Oldingi: Sentiment tahlili nima?](01-What-is-Sentiment-Analysis.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Transformer modellari](03-Pre-trained-Transformer-Models.md)
