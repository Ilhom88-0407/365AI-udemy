# 6-dars. Stemming (o'zak topish)

## 🎬 Boshlashdan oldin

> **"Oldindan qayta ishlashning keyingi qadami — matnni STANDARTLASHTIRISH."**
>
> ## **"Buning bir varianti — STEMMING: so'zlar o'zining ASOS SHAKLIGA keltiriladi."**

---

## 1. Stemming nima?

> **"Masalan, `connecting` yoki `connected` kabi so'zlar asos shakl — `connect` ga keltiriladi."**

```
connecting  ┐
connected   ├──→  connect
connects    ┘
```

> ## **"Stemming so'zning QO'SHIMCHASINI yoki OXIRINI OLIB TASHLASH orqali ishlaydi — lekin ba'zan asos shakl MA'NOLI YOKI TO'G'RI SO'Z BO'LMASLIGIGA olib kelishi mumkin."**

---

## 2. Nima uchun kerak?

> ## **"Biz matnni shu tarzda standartlashtiramiz, chunki bu ma'lumot to'plamimizdagi NOYOB SO'ZLAR SONINI KAMAYTIRADI — shuning uchun ma'lumotimizning HAJMI va MURAKKABLIGINI kamaytiradi."**
>
> **"Ma'lumotdan murakkablik va shovqinni olib tashlash — mashinali o'rganish uchun ma'lumotni to'g'ri tayyorlashning muhim qadami."**

### Amaliy foyda

```
STEMMING SIZ:
  connect, connects, connected, connecting, connectivity
  → lug'atda 5 ta so'z

STEMMING BILAN:
  connect
  → lug'atda 1 ta so'z

Lug'at 5 barobar KICHIK  →  model TEZROQ, ANIQROQ
```

![Stemming va lemmatization](assets/02-stemming-vs-lemmatization.svg)

---

## 3. Porter stemmer

> **"NLTK paketidan biz PORTER STEMMER ni import qilamiz."**
>
> **"Keyin stemmerimizni yaratamiz va uni `ps` ga biriktiramiz. Stemmerni ishga tushirish uchun `PorterStemmer()` funksiyasidan bo'sh qavslar bilan foydalanamiz."**

```python
from nltk.stem import PorterStemmer
ps = PorterStemmer()
```

> 💡 **`PorterStemmer()`** — bu **sinf** *(19-modul!)*. Qavslar bilan **obyekt** yaratiladi, keyin unga **metod** qo'llanadi.

---

## 4. `connect` tokenlari

> **"Endi `connect` so'zi atrofidagi so'zlar bilan misol sinab ko'raylik."**

```python
connect_tokens = ['connecting', 'connected', 'connectivity',
                  'connect', 'connects']

for t in connect_tokens:
    print(t, ":", ps.stem(t))
```

```
connecting : connect
connected : connect
connectivity : connect
connect : connect
connects : connect
```

> **"Turli tokenlarning har biri `connect` so'ziga qanday stemlanganini ko'ramiz."**

> ## 🔑 **5 ta so'z → 1 ta o'zak. Bu — stemming'ning kuchi.**

---

## 5. `learn` tokenlari

> **"Boshqa tokenlar bilan yana sinab ko'raylik. Bu safar `learn` so'zi atrofidagi so'zlardan foydalanamiz."**

```python
learn_tokens = ['learned', 'learning', 'learn',
                'learns', 'learner', 'learners']

for t in learn_tokens:
    print(t, ":", ps.stem(t))
```

```
learned : learn
learning : learn
learn : learn
learns : learn
learner : learner
learners : learner
```

> **"Bu yerda dastlabki bir necha token — `learned`, `learning`, `learn` va `learns` — `learn` so'ziga stemlangan, `learner` va `learners` esa `learner` asos so'ziga stemlangan."**

### 🔑 Nima uchun `learner` alohida?

```
learn    = harakat (fe'l)      →  o'rganish
learner  = shaxs (ot)          →  o'rganuvchi

Bular BOSHQA ma'noli so'zlar — shuning uchun
stemmer ularni AJRATDI.  ✅
```

---

## 6. ⚠️ `worse` muammosi

> **"Yana bir misol qilaylik — `likes`, `better` va `worse` tokenlari bilan."**

```python
likes_tokens = ['likes', 'better', 'worse']

for t in likes_tokens:
    print(t, ":", ps.stem(t))
```

```
likes : like
better : better
worse : wors
```

> ## **"Buni chop etganingizda, men avval aytgan narsani ko'rasiz — ba'zi so'zlar TO'G'RI SO'Z BO'LMAGAN asos shaklga keltiriladi."**
>
> ## **"Masalan, `worse` so'zi `w-o-r-s` ga stemlangan."**

```
worse  →  wors     ❌ Bu SO'Z EMAS!
```

> ⚠️ **Nima uchun bu muammo?**
>
> - Odam kodni o'qiganda `wors` ni **tushunmaydi**
> - Boshqa modelga uzatilsa — `wors` **lug'atda yo'q**
> - Vizualizatsiyada **g'alati** ko'rinadi

---

## 7. Stemming qanday ishlaydi?

Porter stemmer — bu **qoidalar to'plami**:

| Qoida | Misol |
|---|---|
| `-ing` → `""` | `connecting` → `connect` |
| `-ed` → `""` | `connected` → `connect` |
| `-s` → `""` | `connects` → `connect` |
| `-ity` → `""` | `connectivity` → `connect` |
| `-e` → `""` | `worse` → `wors` ⚠️ |

> ## 🔑 **U LUG'ATGA MUROJAAT QILMAYDI — faqat harflarni kesadi.**
>
> Shuning uchun **tez**, lekin **ba'zan noto'g'ri**.

---

## 8. Boshqa stemmerlar

NLTK'da bir necha stemmer bor:

```python
from nltk.stem import PorterStemmer, SnowballStemmer, LancasterStemmer

ps = PorterStemmer()                    # eng keng tarqalgan
ss = SnowballStemmer("english")         # yaxshilangan Porter
ls = LancasterStemmer()                 # eng AGRESSIV

for s in ["running", "runner", "easily"]:
    print(s, "|", ps.stem(s), "|", ss.stem(s), "|", ls.stem(s))
```

```
running | run | run | run
runner | runner | runner | run
easily | easili | easili | easy
```

> 💡 **`SnowballStemmer`** — boshqa tillarni ham qo'llab-quvvatlaydi *(rus, nemis, fransuz...)*. **O'zbek tili yo'q.**

---

## 9. 💻 To'liq kod

```python
from nltk.stem import PorterStemmer, SnowballStemmer, LancasterStemmer

ps = PorterStemmer()

# ===== CONNECT TOKENLARI =====
connect_tokens = ['connecting', 'connected', 'connectivity',
                  'connect', 'connects']
for t in connect_tokens:
    print(t, ":", ps.stem(t))

print()

# ===== LEARN TOKENLARI =====
learn_tokens = ['learned', 'learning', 'learn',
                'learns', 'learner', 'learners']
for t in learn_tokens:
    print(t, ":", ps.stem(t))

print()

# ===== LIKES TOKENLARI =====
likes_tokens = ['likes', 'better', 'worse']
for t in likes_tokens:
    print(t, ":", ps.stem(t))

print()

# ===== LUG'AT HAJMI =====
print("Xom tokenlar:", len(set(connect_tokens)))
print("Stemlangan: ", len(set([ps.stem(t) for t in connect_tokens])))

print()

# ===== UCHTA STEMMER =====
ss = SnowballStemmer("english")
ls = LancasterStemmer()
print("so'z     | Porter | Snowball | Lancaster")
print("-" * 46)
for s in ["running", "runner", "easily", "happiness"]:
    print(s, "|", ps.stem(s), "|", ss.stem(s), "|", ls.stem(s))

print()

# ===== SNOWBALL — BOSHQA TILLAR =====
print(SnowballStemmer.languages)
```

**Natija:**

```
connecting : connect
connected : connect
connectivity : connect
connect : connect
connects : connect

learned : learn
learning : learn
learn : learn
learns : learn
learner : learner
learners : learner

likes : like
better : better
worse : wors

Xom tokenlar: 5
Stemlangan:  1

so'z     | Porter | Snowball | Lancaster
----------------------------------------------
running | run | run | run
runner | runner | runner | run
easily | easili | easili | easy
happiness | happi | happi | happy

('arabic', 'danish', 'dutch', 'english', 'finnish', 'french', 'german', 'hungarian', 'italian', 'norwegian', 'porter', 'portuguese', 'romanian', 'russian', 'spanish', 'swedish')
```

> ## 🔑 **`Xom tokenlar: 5` → `Stemlangan: 1`** — mana bu **lug'at hajmini 5 barobar** kamaytirish.

---

## 10. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `PorterStemmer` bilan 5 ta so'zni stemlang.

**M2.** `run` atrofidagi so'zlarni stemlang.

**M3.** Lug'at hajmi qancha kamayganini hisoblang.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.stem import PorterStemmer
ps = PorterStemmer()

# M1
for s in ["playing", "played", "plays", "player", "playful"]:
    print(s, "->", ps.stem(s))
# playing -> play
# played -> play
# plays -> play
# player -> player
# playful -> play

# M2
for s in ["running", "ran", "runs", "runner"]:
    print(s, "->", ps.stem(s))
# running -> run
# ran -> ran          ⚠️ NOTO'G'RI SHAKL — stemmer buni bilmaydi!
# runs -> run
# runner -> runner

# M3
t = ["playing", "played", "plays", "player", "playful"]
print(len(set(t)), "→", len(set([ps.stem(x) for x in t])))   # 5 → 2
```

</details>

### 🟡 O'rta

**M4.** To'liq quvurga stemming qo'shing.

**M5.** Uchta stemmer natijasini solishtiring.

**M6.** Stemming **buzadigan** so'zlarni toping.

<details>
<summary>✅ Yechimlar</summary>

```python
import re
from nltk.stem import PorterStemmer, SnowballStemmer, LancasterStemmer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

ps = PorterStemmer()

# M4
sw = stopwords.words('english')
sw.remove("not")

def quvur(matn):
    matn = matn.lower()
    matn = re.sub(r"[^\w\s]", "", matn)
    matn = " ".join([w for w in matn.split() if w not in sw])
    tokens = word_tokenize(matn)
    return [ps.stem(t) for t in tokens]

print(quvur("The hotels were NOT very clean, but the staff were amazing!"))
# ['hotel', 'not', 'clean', 'staff', 'amaz']
#                                     ↑ "amazing" → "amaz"  ⚠️

# M5
ss = SnowballStemmer("english"); ls = LancasterStemmer()
for s in ["organization", "generously", "maximum"]:
    print(s, "|", ps.stem(s), "|", ss.stem(s), "|", ls.stem(s))
# organization | organ | organ | org
# generously | gener | generous | gen
# maximum | maximum | maximum | maxim

# M6 — STEMMING BUZADIGAN SO'ZLAR
for s in ["worse", "amazing", "business", "university", "news"]:
    print(s, "->", ps.stem(s))
# worse -> wors           ❌ so'z emas
# amazing -> amaz         ❌ so'z emas
# business -> busi        ❌ so'z emas
# university -> univers   ❌ so'z emas
# news -> news            ✅ bu esa TO'G'RI qoldi
```

</details>

### 🔴 Qiyin

**M7.** Stemming ikki **turli ma'noli** so'zni birlashtiradigan misol toping.

**M8.** Stemming lug'at hajmini haqiqiy matnda qancha kamaytiradi?

**M9.** Stemming **qachon** ishlatmaslik kerak?

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.stem import PorterStemmer
ps = PorterStemmer()

# M7 — HAQIQIY FALSE MERGE misollari
print(ps.stem("universe"), ps.stem("university"))     # univers univers
print(ps.stem("busy"),     ps.stem("business"))       # busi busi
print(ps.stem("organ"),    ps.stem("organization"))   # organ organ
print(ps.stem("relative"), ps.stem("relativity"))     # rel rel
#
# ⚠️ "universe" (koinot) va "university" (universitet) — BIR XIL o'zak!
#    "busy" (band) va "business" (biznes) — BIR XIL!
#    "organ" (a'zo) va "organization" (tashkilot) — BIR XIL!
#
# Bu — FALSE MERGE (noto'g'ri birlashtirish).
# Model "universe about black holes" va "university admissions"
# matnlarini O'XSHASH deb hisoblashi mumkin.

# M8
matn = """The connected users were connecting to the connection
while the organization organized organizational meetings for
learners who were learning about learned behaviours"""
tokens = matn.lower().split()
xom = len(set(tokens))
stem = len(set([ps.stem(t) for t in tokens]))
print("Xom noyob:      ", xom)                          # 19
print("Stemlangan noyob:", stem)                        # 15
print("Kamaydi:", round((1 - stem/xom) * 100), "%")     # 21 %

# M9 — STEMMING QACHON ISHLATMASLIK KERAK
#
# 1. NATIJANI ODAM O'QIYDI
#    Kalit so'z buluti, hisobot → "amaz", "wors" g'alati ko'rinadi
#    → LEMMATIZATION ishlating
#
# 2. ISM VA ATOQLI OTLAR MUHIM
#    "Sanders" → "sander"  — familiya buziladi
#
# 3. TIL O'ZBEKCHA / boshqa qo'llab-quvvatlanmagan
#    Porter faqat INGLIZ tili uchun
#
# 4. QIDIRUV TIZIMI (aniq moslik kerak)
#    "news" va "new" birlashib ketadi
#
# ✅ QACHON ISHLATISH:
#    Katta ma'lumot · tezlik muhim · natijani faqat MODEL ko'radi
```

</details>

---

## 11. 🧠 O'zini tekshirish savollari

1. Keyingi qadam nima?
2. Stemming nima qiladi?
3. Misol keltiring.
4. Stemming qanday ishlaydi?
5. Qanday muammo bo'lishi mumkin?
6. Nima uchun standartlashtiramiz?
7. Qaysi stemmer ishlatiladi?
8. `worse` nimaga aylanadi?

<details>
<summary>✅ Javoblar</summary>

1. Matnni **standartlashtirish**.
2. So'zlarni **asos shakliga** keltiradi.
3. `connecting`, `connected` → **`connect`**.
4. So'zning **qo'shimchasini** yoki **oxirini olib tashlash** orqali.
5. Asos shakl **ma'noli yoki to'g'ri so'z bo'lmasligi** mumkin.
6. **Noyob so'zlar sonini kamaytiradi** → ma'lumot **hajmi va murakkabligi** kamayadi.
7. **Porter stemmer.**
8. **`wors`** — bu **so'z emas**.

</details>

---

## 📌 Xulosa

```python
from nltk.stem import PorterStemmer
ps = PorterStemmer()
ps.stem("connecting")      →  "connect"


STEMMING = qo'shimchani KESIB TASHLASH

connecting   ┐
connected    ├──→  connect     5 so'z → 1 o'zak
connectivity │                 lug'at 5 BAROBAR kichik
connect      │
connects     ┘

learned      ┐
learning     ├──→  learn
learns       ┘
learner      ┐──→  learner     ← BOSHQA ma'no (shaxs)
learners     ┘


⚠️  MUAMMO — NATIJA SO'Z BO'LMASLIGI MUMKIN

worse      →  wors        ❌
amazing    →  amaz        ❌
business   →  busi        ❌
university →  univers     ❌
news       →  new         ❌ MA'NO O'ZGARDI!


🔑 U LUG'ATGA MUROJAAT QILMAYDI — faqat HARFLARNI KESADI
   → TEZ, lekin ba'zan NOTO'G'RI


UCHTA STEMMER
Porter      eng keng tarqalgan       running → run
Snowball    yaxshilangan Porter      generously → generous
Lancaster   eng AGRESSIV             runner → run


✅ QACHON ISHLATISH:  katta ma'lumot · tezlik · faqat MODEL ko'radi
❌ QACHON EMAS:       odam o'qiydi · ismlar muhim · aniq moslik kerak
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Stemming | *stemming* | O'zak topish |
| O'zak | *stem* | So'zning asos qismi |
| Qo'shimcha | *suffix* | So'z oxiridagi qism |
| Standartlashtirish | *standardization* | Bir shaklga keltirish |
| Noyob so'zlar | *unique words* | Turli so'zlar soni |
| Porter stemmer | *Porter stemmer* | Eng mashhur stemming algoritmi |
| Noto'g'ri birlashtirish | *false merge* | Ikki xil so'z bir o'zakka tushishi |

---

⬅️ [Oldingi: Tokenizatsiya](05-Tokenization.md) · ➡️ [Keyingi: Lemmatization](07-Lemmatization.md)
