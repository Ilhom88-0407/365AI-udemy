# 7-dars. Lemmatization (lug'at shakliga keltirish)

## 🎬 Boshlashdan oldin

> ## **"Stemming so'zning oxirgi bir necha BELGISINI OLIB TASHLASA — LEMMATIZATION so'zni ANCHA MA'NOLI asos shaklga keltiradi va uning MA'NOSINI YO'QOTMASLIGINI ta'minlaydi."**

---

## 1. Lemmatization qanday ishlaydi?

> ## **"Lemmatization ANCHA AQLLI ishlaydi — so'zning KONTEKSTINI o'z ichiga olgan OLDINDAN BELGILANGAN LUG'ATGA murojaat qiladi va so'zni asos shakliga kamaytirishda shundan foydalanadi."**

```
STEMMING:        harflarni KESADI       →  worse → wors    ❌
LEMMATIZATION:   LUG'ATGA qaraydi       →  worse → worse   ✅
```

> ## **"Bu shuni anglatadiki, bizda ko'pincha ANCHA MA'NOLI so'zlar qoladi — lekin bu ma'lumot to'plamimizda KO'PROQ SO'Z qolishi mumkinligini ham anglatadi."**

### Savdo-sotiq (trade-off)

| | Stemming | Lemmatization |
|---|---|---|
| **Natija** | So'z bo'lmasligi mumkin ❌ | **Doim** haqiqiy so'z ✅ |
| **Lug'at hajmi** | **Kichik** ✅ | Katta ❌ |
| **Tezlik** | **Tez** ✅ | Sekinroq ❌ |
| **Lug'at kerakmi** | Yo'q | **Ha** (WordNet) |

![Stemming va lemmatization](assets/02-stemming-vs-lemmatization.svg)

---

## 2. Import

> **"Boshlash uchun bizga NLTK kerak, `wordnet` ni yuklab olamiz, va keyin NLTK dan WordNet Lemmatizer ni import qilamiz."**

```python
import nltk
nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
```

> **"Keyin `WordNetLemmatizer()` bilan bo'sh qavslar qo'yib lemmatizerimizni yaratamiz."**

### 📚 WordNet nima?

**WordNet** — ingliz tilining **semantik lug'ati**. U 1985-yildan beri Prinston universitetida tuzilyapti va **155 000 dan ortiq** so'zni o'z ichiga oladi.

Har bir so'z uchun u **ma'no**, **sinonim**, **antonim** va **asos shaklni** biladi.

---

## 3. `connect` tokenlari

> **"Endi `for` sikllarimizni qayta ishga tushiraylik — `connect` tokenlarimizni olib, ularni chop etamiz, keyin lemmatizatsiya qilib natijalarni chop etamiz."**

```python
connect_tokens = ['connecting', 'connected', 'connectivity',
                  'connect', 'connects']

for t in connect_tokens:
    print(t, ":", lemmatizer.lemmatize(t))
```

```
connecting : connecting
connected : connected
connectivity : connectivity
connect : connect
connects : connects
```

> ## **"Ko'ryapsizmi: stemming qilganimizda bu `connect` tokenlarining HAMMASI `connect` so'ziga kamaytirilgan edi. Bu yerda esa barcha so'zlar O'Z HOLICHA QOLDIRILGAN. Ular bitta so'zga kamaytirilmagan."**

> ## **"Bu YAXSHI, chunki u so'zlarning MA'NOSINI ancha ko'p saqlaydi. Lekin men aytganimdek, bu bizda ANCHA KATTAROQ ma'lumot to'plami qolishini anglatadi — chunki biz bu so'zlarning hammasini bitta tokenga kamaytirmayapmiz."**

### ⚠️ Nima uchun hech narsa o'zgarmadi?

`WordNetLemmatizer` **standart holatda** so'zni **OT** (*noun*) deb hisoblaydi. `connecting` — bu **fe'l**, shuning uchun u o'zgarmadi.

**Yechim** — nutq qismini ko'rsatish:

```python
print(lemmatizer.lemmatize("connecting"))              # connecting
print(lemmatizer.lemmatize("connecting", pos="v"))     # connect   ✅
```

> ## 📌 **`pos` (part of speech) — bu 22-modulning mavzusi.** U yerda POS taggingni to'liq o'rganasiz.

---

## 4. `learn` tokenlari

```python
learn_tokens = ['learned', 'learning', 'learn',
                'learns', 'learner', 'learners']

for t in learn_tokens:
    print(t, ":", lemmatizer.lemmatize(t))
```

```
learned : learned
learning : learning
learn : learn
learns : learns
learner : learner
learners : learner
```

> **"Va yana, bu yerda haqiqatan kamaytirilgan yagona narsa — `learners` so'zi, u `learner` ga kamaytirilgan. Qolgan hamma narsa o'z holicha qoldirilgan."**

### 🔑 `learners` → `learner`

Bu — **ko'plik** (`-s`) olib tashlandi. Chunki `learner` — **ot**, va lemmatizer standart holatda **otlarni** qayta ishlaydi. ✅

---

## 5. ✅ `worse` — asosiy farq

> **"Va nihoyat, `likes` tokenlarimiz uchun."**

```python
likes_tokens = ['likes', 'better', 'worse']

for t in likes_tokens:
    print(t, ":", lemmatizer.lemmatize(t))
```

```
likes : like
better : better
worse : worse
```

> ## **"Bu yerda farqni ko'rishimiz mumkin: `worse` so'zi `worse` ga kamaytirilgan — stemming qilganimizda esa u `wors` ga kamaytirilgan edi."**

> ## **"Demak, bu ko'p so'zlar biz TANIYDIGAN MA'NOLI so'zlar bo'lib qolishini anglatadi."**

### Yonma-yon

| So'z | Stemming | Lemmatization |
|---|---|---|
| `likes` | `like` | `like` |
| `better` | `better` | `better` |
| `worse` | **`wors`** ❌ | **`worse`** ✅ |
| `amazing` | **`amaz`** ❌ | `amazing` ✅ |
| `business` | **`busi`** ❌ | `business` ✅ |

---

## 6. `pos` parametri — kuchini oching

Lemmatizerning **haqiqiy kuchi** `pos` bilan ochiladi:

```python
w = "better"
print(lemmatizer.lemmatize(w))              # better
print(lemmatizer.lemmatize(w, pos="a"))     # good      ← SIFAT!

w = "running"
print(lemmatizer.lemmatize(w))              # running
print(lemmatizer.lemmatize(w, pos="v"))     # run       ← FE'L!

w = "geese"
print(lemmatizer.lemmatize(w))              # goose     ← noto'g'ri ko'plik!
```

### `pos` qiymatlari

| Qiymat | Nutq qismi | Inglizcha |
|---|---|---|
| `"n"` | **Ot** *(standart)* | noun |
| `"v"` | Fe'l | verb |
| `"a"` | Sifat | adjective |
| `"r"` | Ravish | adverb |

> ## 🔑 **`better` → `good`** — mana bu **stemming HECH QACHON qila olmaydi.** Chunki bu **lug'atdagi bilim**, harf kesish emas.

---

## 7. Qaysi birini tanlash?

```
LUG'AT HAJMI muhim         →  STEMMING
   katta ma'lumot, tezlik

MA'NO muhim                →  LEMMATIZATION
   natijani ODAM ko'radi
   kalit so'zlar, hisobot

IKKALASI ham               →  amaliyotda TEZ-TEZ:
                               ikkalasini hisoblab, solishtiring
```

> 💡 **9-darsdagi amaliyotda** ma'ruzachi **ikkalasini ham** hisoblaydi va **alohida ustunlarda** saqlaydi. Bu — **eng yaxshi amaliyot**.

---

## 8. 💻 To'liq kod

```python
import nltk
nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer, PorterStemmer

lemmatizer = WordNetLemmatizer()
ps = PorterStemmer()

# ===== CONNECT =====
connect_tokens = ['connecting', 'connected', 'connectivity',
                  'connect', 'connects']
for t in connect_tokens:
    print(t, ":", lemmatizer.lemmatize(t))

print()

# ===== LEARN =====
learn_tokens = ['learned', 'learning', 'learn',
                'learns', 'learner', 'learners']
for t in learn_tokens:
    print(t, ":", lemmatizer.lemmatize(t))

print()

# ===== LIKES =====
likes_tokens = ['likes', 'better', 'worse']
for t in likes_tokens:
    print(t, ":", lemmatizer.lemmatize(t))

print()

# ===== YONMA-YON SOLISHTIRISH =====
print("so'z        | stemming | lemmatization")
print("-" * 46)
for t in ['worse', 'amazing', 'business', 'universities', 'better']:
    print(t, "|", ps.stem(t), "|", lemmatizer.lemmatize(t))

print()

# ===== LUG'AT HAJMI =====
print("Xom:          ", len(set(connect_tokens)))
print("Stemming:     ", len(set([ps.stem(t) for t in connect_tokens])))
print("Lemmatization:", len(set([lemmatizer.lemmatize(t) for t in connect_tokens])))

print()

# ===== pos PARAMETRI =====
print(lemmatizer.lemmatize("better"), "|", lemmatizer.lemmatize("better", pos="a"))
print(lemmatizer.lemmatize("running"), "|", lemmatizer.lemmatize("running", pos="v"))
print(lemmatizer.lemmatize("connecting"), "|", lemmatizer.lemmatize("connecting", pos="v"))
print(lemmatizer.lemmatize("geese"))
print(lemmatizer.lemmatize("mice"))
print(lemmatizer.lemmatize("children"))
print(lemmatizer.lemmatize("teeth"))       # ⚠️ buni bilmaydi
```

**Natija:**

```
connecting : connecting
connected : connected
connectivity : connectivity
connect : connect
connects : connects

learned : learned
learning : learning
learn : learn
learns : learns
learner : learner
learners : learner

likes : like
better : better
worse : worse

so'z        | stemming | lemmatization
----------------------------------------------
worse | wors | worse
amazing | amaz | amazing
business | busi | business
universities | univers | university
better | better | better

Xom:           5
Stemming:      1
Lemmatization: 5

better | good
running | run
connecting | connect
goose
mouse
child
teeth
```

> ## 🔑 **Eng muhim uch qator:**
>
> - `Stemming: 1` — lug'at **5 barobar** kichik, lekin `wors` kabi so'zlar bilan
> - `Lemmatization: 5` — lug'at **katta**, lekin **hamma so'z ma'noli**
> - `better | good` — lemmatizer **ma'noni biladi**, stemmer — **yo'q**

---

## 9. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** 5 ta so'zni lemmatizatsiya qiling.

**M2.** Ko'plik shakllarini sinang.

**M3.** Stemming va lemmatization natijasini solishtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.stem import WordNetLemmatizer, PorterStemmer
lem = WordNetLemmatizer()
ps = PorterStemmer()

# M1
for w in ["cats", "boxes", "wolves", "studies", "leaves"]:
    print(w, "->", lem.lemmatize(w))
# cats -> cat
# boxes -> box
# wolves -> wolf
# studies -> study
# leaves -> leaf

# M2
for w in ["geese", "mice", "children", "feet", "teeth"]:
    print(w, "->", lem.lemmatize(w))
# geese -> goose
# mice -> mouse
# children -> child
# feet -> foot
# teeth -> teeth      ⚠️ buni BILMADI!
# ✅ Ko'p noto'g'ri ko'pliklarni BILADI — lekin HAMMASINI emas

# M3
for w in ["studies", "wolves", "amazing", "worse"]:
    print(w, "| stem:", ps.stem(w), "| lem:", lem.lemmatize(w))
# studies | stem: studi | lem: study
# wolves | stem: wolv | lem: wolf
# amazing | stem: amaz | lem: amazing
# worse | stem: wors | lem: worse
```

</details>

### 🟡 O'rta

**M4.** `pos` parametri bilan fe'llarni lemmatizatsiya qiling.

**M5.** `pos="a"` bilan sifatlarni sinang.

**M6.** To'liq quvurga lemmatization qo'shing.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.stem import WordNetLemmatizer
lem = WordNetLemmatizer()

# M4
for w in ["running", "connecting", "went", "eating", "swum"]:
    print(w, "|", lem.lemmatize(w), "|", lem.lemmatize(w, pos="v"))
# running | running | run
# connecting | connecting | connect
# went | went | go            ← NOTO'G'RI FE'L!
# eating | eating | eat
# swum | swum | swim

# M5
for w in ["better", "best", "worse", "worst", "larger"]:
    print(w, "|", lem.lemmatize(w), "|", lem.lemmatize(w, pos="a"))
# better | better | good
# best | best | best
# worse | worse | bad
# worst | worst | bad
# larger | larger | large

# M6
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
sw = stopwords.words('english')
sw.remove("not")

def quvur(matn):
    matn = matn.lower()
    matn = re.sub(r"[^\w\s]", "", matn)
    matn = " ".join([w for w in matn.split() if w not in sw])
    return [lem.lemmatize(t) for t in word_tokenize(matn)]

print(quvur("The hotels were NOT very clean, but the staff were amazing!"))
# ['hotel', 'not', 'clean', 'staff', 'amazing']
#   ↑ "hotels" → "hotel"    ↑ "amazing" SAQLANDI (stemming'da "amaz" edi)
```

</details>

### 🔴 Qiyin

**M7.** Haqiqiy matnda lug'at hajmini solishtiring.

**M8.** Ikkalasini ham hisoblab, jadval yasang.

**M9.** Qaysi vazifada qaysi birini tanlash kerak? 5 ta misol.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.stem import WordNetLemmatizer, PorterStemmer
lem = WordNetLemmatizer(); ps = PorterStemmer()

# M7
matn = """The connected users were connecting to the connection
while the organization organized organizational meetings for
learners who were learning about learned behaviours"""
t = matn.lower().split()
print("Xom:          ", len(set(t)))
print("Stemming:     ", len(set([ps.stem(x) for x in t])))
print("Lemmatization:", len(set([lem.lemmatize(x) for x in t])))
# Xom:           19
# Stemming:      15    ← 4 ta kamaydi
# Lemmatization: 19    ← HECH NARSA kamaymadi (hammasi FE'L, pos kerak!)

# M8
sozlar = ["running", "better", "wolves", "amazing", "studies", "worse"]
print("so'z      | stemming | lemmatization")
print("-" * 42)
for w in sozlar:
    print(w, "|", ps.stem(w), "|", lem.lemmatize(w))

# M9 — QAYSI VAZIFADA QAYSI BIRI
#
# 1. Kalit so'z buluti (odam ko'radi)     →  LEMMATIZATION
#    "amaz" o'rniga "amazing" chiroyliroq
#
# 2. Katta korpusda mavzu modellashtirish →  STEMMING
#    lug'at kichik = tezroq, xotira kam
#
# 3. Chatbot niyat aniqlash               →  LEMMATIZATION
#    ma'no muhim, ma'lumot kichik
#
# 4. Spam filtri (millionlab xat)         →  STEMMING
#    tezlik va hajm muhim
#
# 5. Tibbiy matn tahlili                  →  LEMMATIZATION
#    atamalar buzilmasligi KRITIK
#
# 🔑 Shubhada bo'lsangiz — IKKALASINI ham hisoblang va
#    modelning ANIQLIGINI solishtiring.
```

</details>

---

## 10. 🧠 O'zini tekshirish savollari

1. Stemming va lemmatization farqi nima?
2. Lemmatization qanday ishlaydi?
3. Natija qanday bo'ladi?
4. Qanday kamchilik bor?
5. Qaysi lemmatizer ishlatiladi?
6. Nima yuklab olinadi?
7. `connect` tokenlariga nima bo'ldi?
8. `worse` nimaga aylandi?

<details>
<summary>✅ Javoblar</summary>

1. Stemming so'zning **oxirgi belgilarini olib tashlaydi**; lemmatization uni **ancha ma'noli** asos shaklga keltiradi va **ma'nosini yo'qotmaydi**.
2. So'zning **kontekstini** o'z ichiga olgan **oldindan belgilangan lug'atga** murojaat qiladi.
3. Ko'pincha **ancha ma'noli** so'zlar qoladi.
4. Ma'lumot to'plamida **ko'proq so'z** qolishi mumkin.
5. **WordNet Lemmatizer.**
6. **`wordnet`.**
7. Ular **o'z holicha qoldirildi** — bitta so'zga kamaytirilmadi.
8. **`worse`** — stemming'da esa **`wors`** edi.

</details>

---

## 📌 Xulosa

```python
from nltk.stem import WordNetLemmatizer
lem = WordNetLemmatizer()
lem.lemmatize("worse")      →  "worse"    ✅


STEMMING  vs  LEMMATIZATION

           STEMMING          LEMMATIZATION
usul       harflarni KESADI  LUG'ATGA qaraydi
natija     so'z bo'lmasligi  DOIM haqiqiy so'z
lug'at     KICHIK ✅          katta ❌
tezlik     TEZ ✅             sekinroq ❌


connect tokenlari (5 ta):
  stemming      →  1 ta      (connect)
  lemmatization →  5 ta      (o'z holicha)

worse:
  stemming      →  wors      ❌
  lemmatization →  worse     ✅


⚠️  pos PARAMETRI — HAQIQIY KUCH

lem.lemmatize("better")            →  better
lem.lemmatize("better", pos="a")   →  good     ⭐

lem.lemmatize("running")           →  running
lem.lemmatize("running", pos="v")  →  run      ⭐

pos:  "n" ot (standart) · "v" fe'l · "a" sifat · "r" ravish


NOTO'G'RI KO'PLIKLARNI HAM BILADI
geese → goose · mice → mouse · children → child


QAYSI BIRINI?
lug'at hajmi muhim  →  STEMMING
MA'NO muhim         →  LEMMATIZATION
shubhada            →  IKKALASI, keyin solishtiring
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Lemmatization | *lemmatization* | Lug'at shakliga keltirish |
| Lemma | *lemma* | So'zning lug'at shakli |
| WordNet | *WordNet* | Ingliz tilining semantik lug'ati |
| Nutq qismi | *part of speech (POS)* | Ot, fe'l, sifat, ravish |
| Kontekst | *context* | So'z atrofidagi ma'no |
| Savdo-sotiq | *trade-off* | Ikki foyda orasida tanlov |

---

⬅️ [Oldingi: Stemming](06-Stemming.md) · ➡️ [Keyingi: N-grammalar](08-N-grams.md)
