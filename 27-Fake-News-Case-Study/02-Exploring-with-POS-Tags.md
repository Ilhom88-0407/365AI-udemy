# 2-dars. POS teglar bilan o'rganish

## 🎬 Boshlashdan oldin

> **"Matnni oldindan qayta ishlashni boshlashdan oldin, keling ma'lumot to'plamimizni biroz ko'proq O'RGANAYLIK. Biz POS teglashdan boshlaymiz."**

> ## ⚠️ **Diqqat: TOZALASHDAN OLDIN.** 22-modulni eslang — POS teglash **grammatikaga** tayanadi, NER esa **bosh harflarga**. Tozalashdan **keyin** ikkalasi ham **buziladi**.

---

## 1. Ma'lumotni ikkiga bo'lamiz

> **"Vazifalarimizdan biri soxta va haqiqiy yangiliklar orasidagi FARQLARNI aniqlash bo'lgani uchun, biz ma'lumot to'plamini soxta yangilik va haqiqiy yangilikka BO'LMOQCHIMIZ. Keyin har bir ma'lumot to'plami orasida uchraydigan POS teglarni SOLISHTIRA olamiz."**

```python
import spacy
nlp = spacy.load("en_core_web_sm")

fake_news = data[data["fake_or_factual"] == "Fake News"]
fact_news = data[data["fake_or_factual"] == "Factual News"]

print("Soxta:", len(fake_news), " Haqiqiy:", len(fact_news))
```

```
Soxta: 98  Haqiqiy: 100
```

---

## 2. spaCy hujjatlarini yaratamiz

> **"Bundan keyin ikkita alohida spaCy hujjatini yaratishimiz mumkin. DataFrame ustida ishlayotganimiz uchun, `nlp.pipe()` dan foydalanmoqchimiz."**

```python
fake_spacy_docs = list(nlp.pipe(fake_news["text"]))
fact_spacy_docs = list(nlp.pipe(fact_news["text"]))
```

### 🔑 `nlp.pipe()` — `nlp()` emas!

```python
# ❌ SEKIN — har bir matn uchun alohida
docs = [nlp(t) for t in texts]

# ✅ TEZ — paketda ishlaydi
docs = list(nlp.pipe(texts))
```

> 💡 **`nlp.pipe()`** matnlarni **guruhlab** qayta ishlaydi — 198 ta maqolada bu sezilarli **tezlik** farqi beradi.

---

## 3. Teglarni ajratish funksiyasi

> **"Keyin ma'lumotimizdagi har bir hujjat uchun teglarni ajratadigan funksiya yaratmoqchimiz."**
>
> ## **"E'tibor bering, biz bu yerda faqat POS teglarni emas, balki NOMLANGAN OB'EKTLARNI TANIB OLISH uchun `ent_type` ni ham ajratyapmiz — bunga keyinroq qaytamiz."**

```python
def extract_token_tags(doc):
    return [(t.text, t.ent_type_, t.pos_) for t in doc]
```

> ## 💡 **Aqlli yechim:** bitta o'tishda **ikkala** teg ham olinadi. 3-darsda NER uchun **qayta hisoblash kerak bo'lmaydi**.

---

## 4. DataFrame quramiz

> **"Bo'sh ro'yxat yaratamiz va ishlatmoqchi bo'lgan ustun nomlarini ko'rsatamiz."**

```python
columns = ["token", "ner_tag", "pos_tag"]

def build_tags(docs):
    rows = []
    for doc in docs:
        rows.extend(extract_token_tags(doc))
    return pd.DataFrame(rows, columns=columns)

fake_tags_df = build_tags(fake_spacy_docs)
fact_tags_df = build_tags(fact_spacy_docs)

print("Soxta tokenlar :", len(fake_tags_df))
print("Haqiqiy tokenlar:", len(fact_tags_df))
```

```
Soxta tokenlar : 45744
Haqiqiy tokenlar: 40393
```

```python
print(fake_tags_df.head())
```

> **"Bu ma'lumot to'plami alohida tokenlarga bo'lingan. Nomlangan ob'ektlar tegishli joyda tortib olingan, va har bir tokenga tegishli POS tegi berilgan."**

---

## 5. Eng ko'p uchraydigan tokenlar

> **"Oldingi darsimizdan eslasangiz, keyingi qiladigan ishimiz — TOKEN CHASTOTASINI hisoblash."**

```python
def pos_counts(df):
    return (df.groupby(["token", "pos_tag"]).size()
              .reset_index(name="counts")
              .sort_values(by="counts", ascending=False))

pos_counts_fake = pos_counts(fake_tags_df)
pos_counts_fact = pos_counts(fact_tags_df)

print(pos_counts_fake.head(10).to_string(index=False))
```

```
token pos_tag  counts
    ,   PUNCT    1908
  the     DET    1834
    .   PUNCT    1530
   of     ADP     922
  and   CCONJ     875
    a     DET     805
        SPACE     795
   to    PART     767
   in     ADP     668
   is     AUX     419
```

```python
print(pos_counts_fact.head(10).to_string(index=False))
```

```
token pos_tag  counts
  the     DET    1903
    ,   PUNCT    1698
    .   PUNCT    1382
   of     ADP     884
    a     DET     789
  and   CCONJ     757
   in     ADP     671
   to    PART     660
   on     ADP     482
 said    VERB     451
```

### ⚠️ Foydasiz — LEKIN foydali!

> ## **"Ma'lumot to'plamimizni hali tozalamaganimiz uchun, bu shunchaki TINISH BELGILAR va TO'XTATISH SO'ZLARI ekanini ko'rasiz. Bu insaytlar nuqtai nazaridan aniq juda qiziq emas — LEKIN u to'xtatish so'zlarini olib tashlashga kelganda ANIQ YORDAM BERADI."**
>
> ## **"Siz bu ro'yxatga murojaat qilib, ma'lumot to'plamingizda XOHLAMAGAN har qanday juda tez-tez uchraydigan so'zlar to'xtatish so'zlariga TO'G'RI KIRITILGANIGA ishonch hosil qilishingiz mumkin."**

### 🔍 Bitta FARQ ko'rinadi

```
SOXTA top-10 :  , the . of and a [bo'shliq] to in is
HAQIQIY top-10: the , . of a and in to on SAID
                                            ↑
                             "said" 451 marta — 10-o'rinda!

Soxta yangiliklarning top-10 ida "said" YO'Q.
```

> ## 💡 **Birinchi haqiqiy insayt!** Haqiqiy yangiliklar **iqtibos keltiradi** *("X said...")*. Soxta yangiliklar esa **to'g'ridan-to'g'ri da'vo** qiladi.
>
> *(22-modulni eslang: BBC yangiliklarida ham `says` eng ko'p fe'l edi.)*

---

## 6. POS teglar taqsimoti

> **"Keyingi ko'rmoqchi bo'lgan narsa — ALOHIDA POS TEGLARNING CHASTOTALARI. Nechta ot uchraydi? Nechta sifat uchraydi?"**

```python
print("SOXTA:")
print(pos_counts_fake.groupby("pos_tag")["token"].count()
      .sort_values(ascending=False).head(6).to_string())
print("\nHAQIQIY:")
print(pos_counts_fact.groupby("pos_tag")["token"].count()
      .sort_values(ascending=False).head(6).to_string())
```

```
SOXTA:              HAQIQIY:
NOUN     2586       NOUN     2179
VERB     1817       VERB     1539
PROPN    1672       PROPN    1379
ADJ       882       ADJ       747
ADV       413       ADV       263
NUM       221       NUM       205
```

> ## **"Ko'rishimiz mumkinki, ikkala ma'lumot to'plami ham O'XSHASH NAQSHGA ega — otlar, fe'llar va atoqli otlar eng ko'p uchraydigan teglar."**

### 🔍 Lekin NISBATLARGA qarang

```python
for nom, pc, jami in [("SOXTA", pos_counts_fake, 45744),
                      ("HAQIQIY", pos_counts_fact, 40393)]:
    g = pc.groupby("pos_tag")["token"].count()
    print(f"{nom}: ADV/NOUN nisbati = {g['ADV']/g['NOUN']:.3f}")
```

```
SOXTA:   ADV/NOUN = 0.160
HAQIQIY: ADV/NOUN = 0.121
```

**To'liq jadval:**

```
TEG       SOXTA  HAQIQIY     FARQ
NOUN      1.000    1.000    +0.0%
VERB      0.703    0.706    -0.5%
PROPN     0.647    0.633    +2.2%
ADJ       0.341    0.343    -0.5%
ADV       0.160    0.121   +32.3%   ⭐
NUM       0.085    0.094    -9.2%
```

> ## 🔑 **Faqat IKKI teg sezilarli farq qiladi:**
> - **ADV** `+32.3%` — soxta yangiliklarda **ravishlar** ancha ko'p
> - **NUM** `−9.2%` — soxta yangiliklarda **sonlar** kamroq
>
> Qolganlari **deyarli bir xil** *(±2%)*.

### 🎯 RAVISHLAR — 32.3% ko'proq, SONLAR — 9.2% kamroq!

```
Ravishlar (ADV):  "really", "very", "absolutely", "totally", "never"
                         ↑
              Bular — KUCHAYTIRUVCHI so'zlar

SOXTA yangiliklar ravishlarni ANCHA KO'P ishlatadi.
```

```
Sonlar (NUM):  "3 percent", "2017", "15 million"
                      ↑
        Bular — TEKSHIRSA BO'LADIGAN faktlar

HAQIQIY yangiliklar sonlarni KO'PROQ ishlatadi.
```

> ## 💡 **Ikkinchi insayt:** soxta yangiliklar **hissiyotli** til *(ko'p ravish)* va **kam raqam** ishlatadi. Haqiqiy yangiliklar — **aksincha**.
>
> ## 🔑 Bu — **yangilik** va **ishontirish** o'rtasidagi farq.

---

## 7. ⭐ Chuqurroq — OTLARNI solishtiramiz

> **"Keyin o'zingizdan so'rashingiz mumkin: yaxshi, agar bu o'xshash bo'lsa, ishlatilayotgan ANIQ OTLAR ham o'xshashmi, yoki ular turli ma'lumot to'plamlari orasida ANCHA FARQ QILADIMI?"**

```python
print("SOXTA top-15 OT:")
print(pos_counts_fake[pos_counts_fake.pos_tag == "NOUN"].head(15)["token"].tolist())
print("\nHAQIQIY top-15 OT:")
print(pos_counts_fact[pos_counts_fact.pos_tag == "NOUN"].head(15)["token"].tolist())
```

```
SOXTA top-15 OT:
['people', 't', 'president', 'women', 'time', 'year', 'campaign',
 'government', 'law', 'years', 'state', 'election', 'media', 'day', 'country']

HAQIQIY top-15 OT:
['government', 'year', 'state', 'bill', 'administration', 'president',
 'election', 'people', 'order', 'campaign', 'law', 'tax', 'reporters',
 'court', 'statement']
```

### 🎯 MANA ENG MUHIM TOPILMA

> ## **"Ko'rishimiz mumkinki, otlar ikkala ma'lumot to'plamida ham juda keng tarqalgan bo'lsa-da, ular ishlatadigan SO'ZLAR ANCHA FARQ QILADI."**

| | **SOXTA** | **HAQIQIY** |
|---|---|---|
| **1-o'rin** | `people` 👥 | `government` 🏛️ |
| **`government`** | 8-o'rin | ## **1-o'rin** |
| **`people`** | ## **1-o'rin** | 8-o'rin |
| **Faqat soxtada** | `women`, `media`, `country`, `day` | — |
| **Faqat haqiqiyda** | — | `bill`, `administration`, `order`, `tax`, `reporters`, `court`, `statement` |

> **"`government` bizning haqiqiy ma'lumot to'plamimizda eng yuqori ot. Lekin soxta yangiliklar ma'lumotimizda bu ANCHA PASTROQ."**

### 🔑 Naqshni ko'rasizmi?

```
HAQIQIY:  bill · administration · order · tax · court · statement
              ↑
     RASMIY, INSTITUTSIONAL so'zlar
     → aniq voqealar haqida xabar

SOXTA:    people · women · media · country · day
              ↑
     UMUMIY, HISSIYOTLI so'zlar
     → guruhlar haqida umumlashtirish
```

> ## 💡 **Uchinchi insayt:** haqiqiy yangiliklar **aniq narsalar** haqida *(qonun loyihasi, sud, soliq)*. Soxta yangiliklar **umumiy guruhlar** haqida *(odamlar, ayollar, mamlakat)*.

⚠️ **`t` so'ziga e'tibor bering** *(soxtada 2-o'rin)* — bu `don't`, `can't` dagi `t`. Bu — **tozalash kerakligining belgisi** *(4-darsda hal qilamiz)*.

---

## 8. 💻 To'liq kod

```python
import pandas as pd, spacy
nlp = spacy.load("en_core_web_sm")

data = pd.read_csv("data/fake_news_data.csv")
fake_news = data[data["fake_or_factual"] == "Fake News"]
fact_news = data[data["fake_or_factual"] == "Factual News"]

# ===== SPACY HUJJATLARI =====
fake_spacy_docs = list(nlp.pipe(fake_news["text"]))
fact_spacy_docs = list(nlp.pipe(fact_news["text"]))

# ===== TEGLARNI AJRATISH =====
def extract_token_tags(doc):
    return [(t.text, t.ent_type_, t.pos_) for t in doc]

columns = ["token", "ner_tag", "pos_tag"]
def build_tags(docs):
    rows = []
    for doc in docs:
        rows.extend(extract_token_tags(doc))
    return pd.DataFrame(rows, columns=columns)

fake_tags_df = build_tags(fake_spacy_docs)
fact_tags_df = build_tags(fact_spacy_docs)

# ===== CHASTOTA =====
def pos_counts(df):
    return (df.groupby(["token", "pos_tag"]).size()
              .reset_index(name="counts")
              .sort_values(by="counts", ascending=False))

pos_counts_fake = pos_counts(fake_tags_df)
pos_counts_fact = pos_counts(fact_tags_df)

# ===== SOLISHTIRISH =====
print("SOXTA OTLAR :", pos_counts_fake[pos_counts_fake.pos_tag == "NOUN"].head(10)["token"].tolist())
print("HAQIQIY OTLAR:", pos_counts_fact[pos_counts_fact.pos_tag == "NOUN"].head(10)["token"].tolist())
```

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** Har bir to'plamda nechta token bor?

**M2.** Fe'llarni solishtiring.

**M3.** Sifatlarni solishtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print("Soxta :", len(fake_tags_df))       # 45744
print("Haqiqiy:", len(fact_tags_df))      # 40393
print("Har maqolada o'rtacha:",
      round(len(fake_tags_df)/98), "va", round(len(fact_tags_df)/100))
# 467 va 404 — soxta maqolalar biroz UZUNROQ

# M2
print("SOXTA FE'L :", pos_counts_fake[pos_counts_fake.pos_tag=="VERB"].head(10)["token"].tolist())
print("HAQIQIY FE'L:", pos_counts_fact[pos_counts_fact.pos_tag=="VERB"].head(10)["token"].tolist())

# M3
print("SOXTA SIFAT :", pos_counts_fake[pos_counts_fake.pos_tag=="ADJ"].head(10)["token"].tolist())
print("HAQIQIY SIFAT:", pos_counts_fact[pos_counts_fact.pos_tag=="ADJ"].head(10)["token"].tolist())
# SOXTA FE'L  : ['s','said','have','know','told','made','had','going','go','say']
# HAQIQIY FE'L: ['said','told','have','’s','including','make','made','take','do','saying']
#
# 💡 "know" va "going" faqat SOXTA ro'yxatda —
#    bu SUHBAT tili ("you know", "going to")
#
# SOXTA SIFAT  : ['more','other','many','-','political','Republican',...]
# HAQIQIY SIFAT: ['former','other','more','political','military','last',...]
#
# 💡 "many" faqat soxtada — noaniq miqdor.
#    "military", "presidential", "first" faqat haqiqiyda — ANIQ.
```

</details>

### 🟡 O'rta

**M4.** ⭐ POS nisbatlarini hisoblang.

**M5.** Faqat bitta to'plamda uchraydigan otlarni toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — ⭐ NORMALLASHTIRISH MUHIM!
gf = pos_counts_fake.groupby("pos_tag")["token"].count()
gt = pos_counts_fact.groupby("pos_tag")["token"].count()
print(f"{'TEG':6s} {'SOXTA':>8s} {'HAQIQIY':>8s} {'FARQ':>8s}")
for teg in ["NOUN", "VERB", "PROPN", "ADJ", "ADV", "NUM"]:
    a, b_ = gf[teg]/gf["NOUN"], gt[teg]/gt["NOUN"]
    print(f"{teg:6s} {a:8.3f} {b_:8.3f} {(a-b_)/b_*100:+7.1f}%")
#
# 🔑 XOM SONLARNI solishtirmang — soxta to'plam KATTAROQ (45744 vs 40393)!
#    NISBATNI solishtiring.
#
# 💡 Eng katta farq: ADV (+32%) — soxta yangiliklarda
#    RAVISHLAR (kuchaytiruvchi so'zlar) ANCHA KO'P.

# M5
nf = set(pos_counts_fake[pos_counts_fake.pos_tag=="NOUN"].head(30)["token"])
nt = set(pos_counts_fact[pos_counts_fact.pos_tag=="NOUN"].head(30)["token"])
print("FAQAT SOXTADA :", sorted(nf - nt))
print("FAQAT HAQIQIYDA:", sorted(nt - nf))
# FAQAT SOXTADA:
#   candidate, case, day, email, employees, image, media, money,
#   news, nominee, school, t, time, video, way, women, world
#
# FAQAT HAQIQIYDA:
#   Trump, ban, bill, court, days, decision, lawmakers, office,
#   order, part, percent, policy, reporters, security, statement, tax, week
#
# 🎯 NAQSH JUDA ANIQ!
#
#   SOXTA  : image · video · media · news · email
#            ↑ IJTIMOIY TARMOQ so'zlari!
#
#   HAQIQIY: bill · court · lawmakers · policy · security ·
#            statement · tax · percent
#            ↑ DAVLAT VA HUJJAT so'zlari
#
# 💡 Soxta yangiliklar ijtimoiy tarmoqda TARQALADI va
#    o'zi haqida gapiradi ("image via", "watch this video").
#    Haqiqiy yangiliklar RASMIY MANBALARGA tayanadi.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Nima uchun POS teglash **tozalashdan oldin**?
2. `nlp.pipe()` nima uchun yaxshiroq?
3. `extract_token_tags` nima uchun `ent_type_` ni ham oladi?
4. Eng ko'p uchraydigan tokenlar foydalimi?
5. Qaysi POS teg eng ko'p farq qildi?
6. Otlarni solishtirganda nima topildi?

<details>
<summary>✅ Javoblar</summary>

1. Chunki POS teglash **grammatikaga**, NER esa **bosh harflarga** tayanadi. Tozalash ikkalasini **buzadi** *(22-modul)*.
2. U matnlarni **paketda** qayta ishlaydi — **ancha tez**.
3. Chunki keyingi darsda NER kerak — **bitta o'tishda** ikkalasini ham olamiz.
4. **To'g'ridan-to'g'ri yo'q** *(tinish belgi va to'xtatish so'zlari)*, lekin ular **to'xtatish so'zlari ro'yxatini** to'g'rilashga yordam beradi. Va bitta insayt bor: `said` faqat **haqiqiy** yangiliklar top-10 ida.
5. ## **ADV (ravish)** — soxta yangiliklarda **32% ko'proq**. Bular **kuchaytiruvchi** so'zlar.
6. **Teglar taqsimoti o'xshash**, lekin **so'zlar butunlay boshqa**: soxta → `people`, `women`, `media`; haqiqiy → `government`, `bill`, `court`, `tax`.

</details>

---

## 📌 Xulosa

```python
fake_spacy_docs = list(nlp.pipe(fake_news["text"]))   # ⭐ .pipe() TEZROQ

def extract_token_tags(doc):
    return [(t.text, t.ent_type_, t.pos_) for t in doc]
#                    ↑ NER ni HAM olamiz (3-dars uchun)


TOKENLAR
  Soxta   45744  (98 maqola → 467/maqola)
  Haqiqiy 40393  (100 maqola → 404/maqola)


TOP-10 TOKEN — ikkalasida ham AXLAT
  , the . of and a to in is
  LEKIN: "said" faqat HAQIQIY top-10 da (451 marta)
         → haqiqiy yangiliklar IQTIBOS keltiradi


POS TAQSIMOT — o'xshash naqsh
  NOUN > VERB > PROPN > ADJ > ADV > NUM

  ⭐ LEKIN NISBATLARDA farq bor:
     ADV/NOUN:  soxta 0.160  ·  haqiqiy 0.121   (+32%!)
     → soxta yangiliklar KUCHAYTIRUVCHI so'zlarni ko'p ishlatadi


⭐⭐ ENG MUHIM TOPILMA — OTLAR

  SOXTA  :  people · t · president · women · time · media · country
                ↑ UMUMIY, HISSIYOTLI

  HAQIQIY:  government · year · state · bill · administration ·
            order · tax · reporters · court · statement
                ↑ RASMIY, INSTITUTSIONAL

  "government":  haqiqiyda 1-o'rin  ·  soxtada 8-o'rin
  "people"    :  soxtada 1-o'rin    ·  haqiqiyda 8-o'rin
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `nlp.pipe()` | *pipe* | Paketda qayta ishlash |
| Chastota | *frequency* | Necha marta uchraydi |
| Nisbat | *ratio* | Normallashtirilgan taqqoslash |
| Kuchaytiruvchi | *intensifier* | `very`, `really`, `totally` |

---

⬅️ [Oldingi: Loyihani tanishtirish](01-Introducing-the-Project.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Nomlangan ob'ektlar](03-Extracting-Named-Entities.md)
