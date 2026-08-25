# 2-dars. POS teglash — nutq qismlari

## 🎬 Boshlashdan oldin

> **"Nutq qismlari teglashni qilish uchun biz Spacy paketini va pandas paketini import qilamiz."**

📁 **Matn:** [`data/emma.txt`](data/emma.txt) — Jeyn Ostinning **"Emma"** romani boshlanishi *(1815-yil, mualliflik huquqi yo'q)*.

---

## 1. Import va model

```python
import spacy
import pandas as pd
```

> **"Birinchi qadam — Spacy modelini yuklash. Shunday qilib, biz `nlp` nomli o'zgaruvchi yaratamiz va keyin `spacy.load()` dan foydalanamiz. Qavslar ichida esa ishlatmoqchi bo'lgan modelimizni ko'rsatamiz."**

```python
nlp = spacy.load("en_core_web_sm")
```

---

## 2. Matnni yuklash

> **"Keyin nutq qismlari teglashimizni mashq qilish uchun biroz matn yuklaymiz. Bu misol uchun biz Jeyn Ostinning 'Emma' asaridan foydalanamiz."**
>
> ## **"Biz bu matndan TINISH BELGILARNI olib tashladik va KICHIK HARFGA o'tkazdik, lekin bu safar TO'XTATISH SO'ZLARNI QOLDIRDIK."**

```python
with open("data/emma.txt", encoding="utf-8") as f:
    emma_ja = f.read().strip()

print(emma_ja[:120])
```

```
emma woodhouse handsome clever and rich with a comfortable home and happy disposition seemed to unite some of the best
```

### 🔑 Nima uchun to'xtatish so'zlar QOLDIRILDI?

```
❌ TO'XTATISH SO'ZLARSIZ:
   "emma handsome clever rich"
   → Grammatika YO'Q. spaCy nima qilishini bilmaydi.

✅ TO'XTATISH SO'ZLAR BILAN:
   "emma woodhouse handsome clever and rich with a comfortable home"
                                    ↑        ↑    ↑
                                  CCONJ     ADP  DET
   → spaCy JUMLA TUZILISHINI ko'radi va to'g'ri teglaydi.
```

> ## ⚠️ **MUHIM QOIDA:** POS teglash **grammatikaga** tayanadi. To'xtatish so'zlarni **oldindan** o'chirsangiz, teglash **buziladi**.

---

## 3. spaCy hujjati

> **"Keyin matnimiz uchun spacy hujjatini yaratmoqchimiz. Bu tokenlarni va ularning tegishli nutq qismlari teglarini GENERATSIYA QILADI."**

```python
spacy_doc = nlp(emma_ja)
```

Bitta qator — va spaCy **hammasini** qildi: tokenizatsiya, POS teglash, lemmatizatsiya, NER, sintaktik tahlil.

---

## 4. DataFrame'ga o'tkazish

> **"Keyin tokenlarni va POS teglarini DataFrame'ga chiqarmoqchimiz."**
>
> **"Shunday qilib, biz `pos_df` nomli DataFrame'ni ishga tushiramiz va `token` va `pos_tag` ustun nomlari bilan pandas DataFrame yaratamiz."**
>
> **"Keyin spacy hujjatimizdagi har bir tokendan o'tish uchun `for` siklidan foydalanamiz."**

```python
pos_df = pd.DataFrame(
    [{"token": token.text, "pos_tag": token.pos_} for token in spacy_doc]
)

print(pos_df.head(15))
```

```
          token pos_tag
0          emma   PROPN
1     woodhouse   PROPN
2      handsome     ADJ
3        clever     ADJ
4           and   CCONJ
5          rich     ADJ
6          with     ADP
7             a     DET
8   comfortable     ADJ
9          home    NOUN
10          and   CCONJ
11        happy     ADJ
12  disposition    NOUN
13       seemed    VERB
14           to    PART
```

> **"Shunday qilib, siz bu yerda matnning birinchi 15 ta so'zini va ularning tegishli POS teglarini ko'rishingiz mumkin."**

### 🔑 Birinchi qatorni o'qing

```
"emma woodhouse handsome clever and rich with a comfortable home"
   │       │        │       │     │    │    │   │      │        │
 PROPN   PROPN     ADJ     ADJ  CCONJ ADJ  ADP DET    ADJ     NOUN
 ismi   familiyasi                              │
                                                └─ "a" = aniqlovchi
```

spaCy **`emma`** ni kichik harf bo'lsa ham **PROPN** *(atoqli ot)* deb tanidi — chunki u **kontekstni** ko'radi.

> ⚠️ **Lekin har doim emas.** Matnda `emma` **3 marta** uchraydi va spaCy uni faqat **1 marta** PROPN deb tegladi — qolgan 2 marta **NOUN**. Sabab: matn **kichik harfda**, va bosh harf — atoqli otni tanishning **eng kuchli belgisi**. Uni yo'qotgach, spaCy faqat kontekstga tayanishga majbur, bu esa **har doim ham yetarli emas**.

### ⚠️ `.text` va `.pos_` — pastki chiziqqa e'tibor bering

```python
token.text      # 'emma'    ← token matni
token.pos_      # 'PROPN'   ← MATN sifatida ⭐ pastki chiziq bor!
token.pos       # 96        ← RAQAM sifatida (ichki ID)
token.lemma_    # 'emma'    ← lemma
token.is_stop   # False     ← to'xtatish so'zimi?
```

> 💡 **spaCy qoidasi:** oxiridagi **`_`** = *"menga MATN ber"*. Pastki chiziqsiz — **raqam** qaytadi.

---

## 5. Eng ko'p uchraydigan tokenlar

> **"Aytaylik, DataFrame'imizdagi eng ko'p uchraydigan tokenlarni va ularning POS teglarini ko'rmoqchimiz."**
>
> **"`pos_df_counts` nomli yangi DataFrame yaratamiz va `groupby` funksiyasidan foydalanamiz. Token va POS teg bo'yicha guruhlaymiz, keyin o'sha guruhga tushgan qatorlar sonini olish uchun `.size()` dan foydalanamiz."**
>
> **"Keyin indeksimizni tiklaymiz va unga `counts` nomini beramiz. Va keyin qiymatlarimizni shu hisoblar bo'yicha saralashimiz mumkin. `ascending=False` deb belgilasak, u kamayish tartibida bo'ladi."**

```python
pos_df_counts = (pos_df.groupby(["token", "pos_tag"])
                       .size()
                       .reset_index(name="counts")
                       .sort_values(by="counts", ascending=False))

print(pos_df_counts.head(10))
```

```
token pos_tag  counts
   of     ADP      14
  her    PRON       9
  had     AUX       9
  and   CCONJ       8
  the     DET       8
    a     DET       6
   to    PART       5
   in     ADP       4
 very     ADV       4
 been     AUX       4
```

> **"Shunday qilib, biz bu yerda eng ko'p uchraydigan tokenlar `of`, `her` va `and` ekanini ko'ramiz."**

### ⚠️ Bu ro'yxat NIMANI KO'RSATADI?

```
of · her · had · and · the · a · to · in · very · been
└──────────── HAMMASI TO'XTATISH SO'ZI! ────────────┘
```

> ## 🔑 **Hech qanday foydali ma'lumot yo'q.** Chunki har qanday ingliz matnida eng ko'p uchraydigan so'zlar — **to'xtatish so'zlari**. **Yechim:** POS **teg bo'yicha filtrlash** *(7-bo'limga qarang)*.

### 💡 `groupby` zanjirini tushunish

```python
pos_df.groupby(["token", "pos_tag"])   # 1 · token+teg juftliklariga bo'lish
      .size()                          # 2 · har guruhda nechta qator?
      .reset_index(name="counts")      # 3 · natijani ustunga aylantirish
      .sort_values(by="counts",        # 4 · saralash
                   ascending=False)    #     kamayish tartibida
```

---

## 6. Har bir teg ostida nechta so'z?

> **"Aytaylik, biz turli teglarning har biri ostida nechta xil so'z borligini bilmoqchimiz."**
>
> **"`pos_df_poscounts` yangi DataFrame yaratamiz va bu yerda yana `groupby` dan foydalanamiz. Bu safar faqat POS teglar bo'yicha guruhlaymiz."**

```python
pos_df_poscounts = (pos_df.groupby(["pos_tag"])["token"]
                          .count()
                          .sort_values(ascending=False))

print(pos_df_poscounts.head(10))
```

```
pos_tag
NOUN     44
ADP      28
ADV      22
VERB     19
ADJ      19
PRON     18
DET      18
AUX      16
CCONJ    11
PROPN     8
```

> **"Shunday qilib, biz bu yerda matnimizda asosan OTLAR ishlatilganini ko'ramiz, undan keyin FE'LLAR va SIFATLAR."**

### 📊 Vizual ko'rinish

```
NOUN   ████████████████████████████████████████████  44   Otlar
ADP    ████████████████████████████                  28   Ko'makchilar
ADV    ██████████████████████                        22   Ravishlar
VERB   ███████████████████                           19   Fe'llar
ADJ    ███████████████████                           19   Sifatlar
PRON   ██████████████████                            18   Olmoshlar
DET    ██████████████████                            18   Aniqlovchilar
AUX    ████████████████                              16   Yordamchi fe'llar
CCONJ  ███████████                                   11   Bog'lovchilar
PROPN  ████████                                       8   Atoqli otlar
```

### 🔑 Bu raqamlar nimani aytadi?

| Kuzatuv | Xulosa |
|---|---|
| **NOUN 44** — eng ko'p | Matn **tavsiflovchi**, ko'p narsa haqida gapiradi |
| **ADJ 19** — sifat ko'p | **Badiiy** matn *(texnik matnda sifat kam bo'ladi)* |
| **PROPN 8** — atoqli ot kam | Kam personaj: `emma`, `woodhouse`, `taylor`... |
| **ADP 28** — ko'makchi ko'p | **Murakkab, uzun** jumlalar |

> 💡 **Faqat POS taqsimotidan** siz matnning **janrini** taxmin qila olasiz!

> ⚠️ **Eslatma:** o'qituvchi videosida NOUN **34**, VERB **22**, ADJ **20** ko'rsatilgan. Bizda NOUN **44** — chunki `en_core_web_sm` modelining **yangiroq versiyasi** ishlatilyapti. **Bu normal.** Modellar yangilanadi va teglar biroz o'zgaradi.

---

## 7. Bitta teg ichida qidirish ⭐

> **"Biz alohida teglarga ham qarashimiz mumkin. Masalan, aytaylik, ma'lumotimizda paydo bo'layotgan eng ko'p uchraydigan OTLARGA qaramoqchimiz."**
>
> **"`pos_df_counts` DataFrame'imizga murojaat qilib, uni `pos_tag == "NOUN"` bo'yicha filtrlashimiz mumkin."**

```python
nouns = pos_df_counts[pos_df_counts.pos_tag == "NOUN"][:10]
print(nouns)
```

```
    token pos_tag  counts
governess    NOUN       3
   friend    NOUN       3
    years    NOUN       2
daughters    NOUN       2
     emma    NOUN       2
   mother    NOUN       2
  sisters    NOUN       2
affection    NOUN       1
authority    NOUN       1
 distress    NOUN       1
```

> **"Shunday qilib, agar buni chop etsak, eng ko'p uchraydigan ot `governess` (enaga) ekanini ko'ramiz — u uch marta paydo bo'ladi, undan keyin `friend`, `mother`, `daughters`, `sisters`."**

### 🎯 MANA — HAQIQIY INSAYT

```
governess · friend · mother · daughters · sisters
    │          │        │         │          │
    └──────────┴────────┴─────────┴──────────┘
                       │
              HAMMASI AYOLLAR va OILA!
```

> ## 💡 **Faqat 10 ta otdan** biz bu matn **ayollar**, **oila** va **munosabatlar** haqida ekanini bildik. Butun kitobni **o'qimasdan!**

### Sifatlarga o'tish — bitta so'z o'zgartirish

> **"Shunday qilib, biz buni turli POS teglarga qarash uchun osongina almashtirishimiz mumkin."**

```python
adjectives = pos_df_counts[pos_df_counts.pos_tag == "ADJ"][:10]
print(adjectives)
```

```
       token pos_tag  counts
      little     ADJ       2
affectionate     ADJ       1
       early     ADJ       1
        fond     ADJ       1
   excellent     ADJ       1
       happy     ADJ       1
        best     ADJ       1
      clever     ADJ       1
 comfortable     ADJ       1
   indulgent     ADJ       1
```

### 🎯 Sifatlar HISSIYOTNI ko'rsatadi

```
affectionate · fond · excellent · happy · best · clever · comfortable · indulgent
      │          │        │         │       │       │          │           │
      └──────────┴────────┴─────────┴───────┴───────┴──────────┴───────────┘
                                    │
                         HAMMASI IJOBIY! 😀
```

> ## 🔑 **Bu — 23-modul (sentiment tahlili) ga ko'prik.** Sifatlar matnning **hissiy ohangini** ko'rsatadi. Bu yerda hammasi ijobiy → matn **iliq va do'stona**.

---

## 8. 💻 To'liq kod

```python
import spacy
import pandas as pd

nlp = spacy.load("en_core_web_sm")

# ===== MATNNI YUKLASH =====
with open("data/emma.txt", encoding="utf-8") as f:
    emma_ja = f.read().strip()

# ===== SPACY HUJJATI =====
spacy_doc = nlp(emma_ja)

# ===== DATAFRAME =====
pos_df = pd.DataFrame(
    [{"token": token.text, "pos_tag": token.pos_} for token in spacy_doc]
)
print(pos_df.head(15))
print("\nJami token:", len(pos_df))

# ===== ENG KO'P TOKEN =====
pos_df_counts = (pos_df.groupby(["token", "pos_tag"])
                       .size()
                       .reset_index(name="counts")
                       .sort_values(by="counts", ascending=False))
print("\n--- Eng ko'p token ---")
print(pos_df_counts.head(10).to_string(index=False))

# ===== TEG TAQSIMOTI =====
pos_df_poscounts = (pos_df.groupby(["pos_tag"])["token"]
                          .count()
                          .sort_values(ascending=False))
print("\n--- Teg taqsimoti ---")
print(pos_df_poscounts.head(10))

# ===== TEG BO'YICHA FILTRLASH =====
for teg in ["NOUN", "ADJ", "VERB"]:
    print(f"\n--- Eng ko'p {teg} ---")
    print(pos_df_counts[pos_df_counts.pos_tag == teg][:5].to_string(index=False))
```

**Natija (oxirgi qismi):**

```
--- Eng ko'p NOUN ---
    token pos_tag  counts
governess    NOUN       3
   friend    NOUN       3
    years    NOUN       2
daughters    NOUN       2
     emma    NOUN       2

--- Eng ko'p ADJ ---
       token pos_tag  counts
      little     ADJ       2
affectionate     ADJ       1
       early     ADJ       1
        fond     ADJ       1
   excellent     ADJ       1

--- Eng ko'p VERB ---
    token pos_tag  counts
    doing    VERB       1
     died    VERB       1
esteeming    VERB       1
   fallen    VERB       1
   ceased    VERB       1
```

---

## 9. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `emma_ja` matnida nechta token bor?

**M2.** Nechta **noyob** POS teg ishlatilgan?

**M3.** Faqat `PROPN` *(atoqli ot)* larni chiqaring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(len(pos_df))                       # 214

# M2
print(pos_df["pos_tag"].nunique())       # 13
print(sorted(pos_df["pos_tag"].unique()))
# ['ADJ', 'ADP', 'ADV', 'AUX', 'CCONJ', 'DET', 'NOUN', 'NUM',
#  'PART', 'PRON', 'PROPN', 'SCONJ', 'VERB']

# M3
print(pos_df_counts[pos_df_counts.pos_tag == "PROPN"].to_string(index=False))
#      token pos_tag  counts
#     taylor   PROPN       2
#       miss   PROPN       2
#       emma   PROPN       1
#         mr   PROPN       1
#  woodhouse   PROPN       1
# woodhouses   PROPN       1
#
# ⚠️ "emma" ATIGI 1 marta PROPN! Qolgan 2 marta spaCy uni NOUN deb tegladi.
#    Sabab: matn KICHIK HARFDA — spaCy uchun eng kuchli belgi yo'qolgan.
```

</details>

### 🟡 O'rta

**M4.** Har bir POS tegning **foizini** hisoblang.

**M5.** Faqat **bir marta** uchraydigan so'zlar necha foiz?

**M6.** Eng uzun **otni** toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
foiz = (pos_df["pos_tag"].value_counts() / len(pos_df) * 100).round(1)
print(foiz.head(5))
# NOUN    20.6
# ADP     13.1
# ADV     10.3
# ADJ      8.9
# VERB     8.9

# M5
bir_marta = (pos_df_counts["counts"] == 1).sum()
print(f"{bir_marta} / {len(pos_df_counts)} = "
      f"{round(bir_marta/len(pos_df_counts)*100)}%")
# 103 / 132 = 78%
# 🔑 So'zlarning 78% ATIGI BIR MARTA uchraydi — bu matnda NORMAL holat
#    (Zipf qonuni: bir nechta so'z juda ko'p, ko'p so'z juda kam uchraydi)

# M6
otlar = pos_df[pos_df.pos_tag == "NOUN"]["token"].unique()
print(max(otlar, key=len))               # disposition
# (11 harf — "remembrance" ham 11 harf, max() birinchisini qaytaradi)
```

</details>

### 🔴 Qiyin

**M7.** To'xtatish so'zlarni **oldindan** o'chirib POS teglang va farqni ko'ring.

**M8.** Har bir POS teg uchun **eng uzun** so'zni toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — ⚠️ NIMA UCHUN TO'XTATISH SO'ZLARNI OLDINDAN O'CHIRMASLIK KERAK
from nltk.corpus import stopwords
en_sw = stopwords.words('english')

buzuq = " ".join([w for w in emma_ja.split() if w not in en_sw])
doc_buzuq = nlp(buzuq)
df_buzuq = pd.DataFrame([{"token": t.text, "pos_tag": t.pos_} for t in doc_buzuq])

print("Token soni:", len(pos_df), "→", len(df_buzuq))
# Token soni: 214 → 102

taqqos = pd.DataFrame({
    "to'g'ri": pos_df["pos_tag"].value_counts(),
    "buzuq":   df_buzuq["pos_tag"].value_counts()}).fillna(0).astype(int)
taqqos["farq"] = taqqos["buzuq"] - taqqos["to'g'ri"]
print(taqqos.sort_values("to'g'ri", ascending=False).head(6))
#          to'g'ri  buzuq  farq
# NOUN          44     40    -4
# ADP           28      1   -27
# ADV           22     13    -9
# VERB          19     22    +3    ⚠️ KO'PAYDI!
# ADJ           19     17    -2
# PRON          18      0   -18

# ⭐ ENG MUHIMI — QAYSI SO'ZLAR TEGINI O'ZGARTIRDI:
# emma          NOUN   → PROPN
# affectionate  ADJ    → VERB     ❌ sifat qanday qilib FE'L bo'ladi?!
# caresses      NOUN   → AUX      ❌ ot qanday qilib YORDAMCHI FE'L bo'ladi?!
# governess     NOUN   → ADJ      ❌ "enaga" — bu SIFAT emas!
# woodhouses    PROPN  → VERB     ❌ familiya qanday qilib FE'L bo'ladi?!
#
# 🔑 MANA ISBOT. Grammatika buzilgach, spaCy TAXMIN QILISHGA majbur bo'ldi
#    va MA'NOSIZ teglar chiqardi. VERB 19→22 ko'paygani ham shundan —
#    otlarni fe'l deb o'ylay boshladi.

# M8
uzunlar = pos_df.loc[pos_df.groupby("pos_tag")["token"].apply(
    lambda s: s.str.len().idxmax())]
print(uzunlar.sort_values("pos_tag").to_string(index=False))
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Modelni qanday yuklaymiz?
2. spaCy hujjatini qanday yaratamiz?
3. `token.pos_` va `token.pos` farqi nimada?
4. Nima uchun bu matndan to'xtatish so'zlar **olib tashlanmagan**?
5. `groupby` zanjirining 4 qadamini ayting.
6. Eng ko'p uchraydigan tokenlar ro'yxati nima uchun **foydasiz**?
7. Eng ko'p uchraydigan ot qaysi?

<details>
<summary>✅ Javoblar</summary>

1. `nlp = spacy.load("en_core_web_sm")`
2. `spacy_doc = nlp(matn)` — bitta chaqiruv.
3. **`pos_`** *(pastki chiziq bilan)* → **matn** `'PROPN'`. **`pos`** → **raqam** `96`.
4. Chunki POS teglash **grammatikaga** tayanadi — to'xtatish so'zlar **jumla tuzilishini** ko'rsatadi.
5. ① `groupby()` ② `.size()` ③ `.reset_index(name=...)` ④ `.sort_values(ascending=False)`
6. Chunki ular **hammasi to'xtatish so'zlari** — `of`, `her`, `and`, `the`... **Yechim:** POS teg bo'yicha **filtrlash**.
7. **`governess`** *(enaga)* — 3 marta, `friend` bilan barobar.

</details>

---

## 📌 Xulosa

```python
import spacy, pandas as pd
nlp = spacy.load("en_core_web_sm")

# ===== 1 · HUJJAT =====
spacy_doc = nlp(matn)          # ⭐ bitta qator — hammasi tayyor

# ===== 2 · DATAFRAME =====
pos_df = pd.DataFrame([{"token": t.text, "pos_tag": t.pos_}
                       for t in spacy_doc])

# ===== 3 · HISOBLASH =====
pos_df_counts = (pos_df.groupby(["token", "pos_tag"])
                       .size()
                       .reset_index(name="counts")
                       .sort_values(by="counts", ascending=False))

# ===== 4 · FILTRLASH ⭐ ENG FOYDALI QADAM =====
pos_df_counts[pos_df_counts.pos_tag == "NOUN"][:10]


⚠️  IKKI QOIDA
1 · TO'XTATISH SO'ZLARNI OLDINDAN O'CHIRMANG
    POS teglash GRAMMATIKAGA tayanadi
2 · Umumiy ro'yxat FOYDASIZ (hammasi to'xtatish so'zi)
    TEG BO'YICHA filtrlang


NATIJA — "Emma" romanidan
  OTLAR:    governess · friend · mother · daughters · sisters
            → AYOLLAR va OILA haqida

  SIFATLAR: affectionate · fond · excellent · happy · best
            → HAMMASI IJOBIY 😀

  Butun kitobni O'QIMASDAN mavzuni bildik!
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Model yuklash | *load model* | `spacy.load()` |
| Hujjat | *doc* | `nlp(matn)` natijasi |
| Token | *token* | Matn bo'lagi |
| `groupby` | *group by* | Guruhlash |
| `.size()` | *size* | Guruhdagi qatorlar soni |
| `reset_index` | *reset index* | Indeksni ustunga aylantirish |
| Filtrlash | *filtering* | Shart bo'yicha tanlash |

---

⬅️ [Oldingi: Matnni teglash](01-Text-Tagging.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: NER](03-Named-Entity-Recognition.md)
