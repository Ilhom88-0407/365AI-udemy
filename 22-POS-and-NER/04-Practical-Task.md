# 4-dars. Amaliy vazifa — 1000 ta BBC yangiligi

## 🎬 Boshlashdan oldin

> **"Nutq qismlari teglash va nomlangan ob'ektlarni tanib olish haqida o'rganganlarimizni olib, amaliy dars orqali sinab ko'raylik."**

📁 **Ma'lumot:** [`data/bbc_news.csv`](data/bbc_news.csv) — **1000 ta** haqiqiy BBC yangilik sarlavhasi *(2022-yil)*.

> ⚠️ **Kurs eslatmasi:** *"Keyingi dars uchun `bbc_news.csv` fayli faol Jupyter notebookingiz bilan bir papkada ekaniga ishonch hosil qiling."*

---

## 1. Import

```python
import spacy
import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
```

---

## 2. Ma'lumotni yuklash

> **"Bu dars uchun biz BBC yangilik maqolalari ma'lumot to'plamidan foydalanamiz. Shunday qilib, buni `bbc_data` sifatida yuklaymiz va `pd.read_csv()` dan foydalanamiz."**

```python
bbc_data = pd.read_csv("data/bbc_news.csv")
print(bbc_data.shape)
print(bbc_data.columns.tolist())
```

```
(1000, 7)
['Unnamed: 0', 'index', 'title', 'pubDate', 'guid', 'link', 'description']
```

> **"Bu ma'lumot qanday ko'rinishini `bbc_data.head()` bilan ko'raylik. Shunday qilib, bizda indeks uchun ustun bor. Bizda maqola SARLAVHASI, yangilik maqolasining nashri, ba'zi HAVOLALAR va maqolaning TAVSIFI bor."**
>
> **"Biz shuningdek `bbc_data.info()` ni ishga tushirishimiz mumkin va bizda 1000 ta yozuv borligini ko'ramiz — ya'ni 1000 ta qator."**

```python
print(bbc_data["title"].head(3).to_string())
```

```
0                                        Can I refuse to work?
1  'Liz Truss the Brief?' World reacts to UK political turmoil
2       Rationing energy is nothing new for off-grid community
```

> **"Bu yangilik maqolalaridan qanday nutq qismlari chiqishi va qanday nomlangan ob'ektlar olinishi mumkinligini ko'rish qiziq bo'ladi."**

---

## 3. Faqat sarlavhalar

> **"Hozircha biz faqat har bir yangilik maqolasining SARLAVHALARI bilan ishlashga qiziqamiz. Shunday qilib, ularni alohida ajratib olaylik."**

```python
titles = pd.DataFrame(bbc_data["title"])
print(titles.head(3))
```

```
                                                         title
0                                        Can I refuse to work?
1  'Liz Truss the Brief?' World reacts to UK political turmoil
2       Rationing energy is nothing new for off-grid community
```

> **"Ajoyib. Endi biz yangilik maqolalari sarlavhasining faqat bitta ustunidan iborat DataFrame'ga ega ekanimizni ko'rishimiz mumkin."**

---

## 4. Tozalash — 21-modulni takrorlash

> **"Keyingi qadam — bu sarlavhalarni tozalash. Buni oxirgi darsda ko'rib chiqqanimiz uchun, biz shunchaki tez o'tamiz — lekin kodga yana qarashni istasangiz, pauza qilishdan tortinmang."**
>
> **"Shunday qilib, biz sarlavhalarimizni olib, ularni KICHIK HARFGA o'tkazamiz, TO'XTATISH SO'ZLARNI olib tashlaymiz, har qanday TINISH BELGINI olib tashlaymiz, TOKENIZATSIYA qilamiz va matnni LEMMATIZATSIYA qilamiz."**

```python
lemmatizer = WordNetLemmatizer()
en_stopwords = stopwords.words('english')

# 1 · kichik harf
titles["title_clean"] = titles["title"].str.lower()

# 2 · to'xtatish so'zlari
titles["title_clean"] = titles["title_clean"].apply(
    lambda x: " ".join([w for w in x.split() if w not in en_stopwords]))

# 3 · tinish belgilar
titles["title_clean"] = titles["title_clean"].apply(
    lambda x: re.sub(r"[^\w\s]", "", x))

# 4 · tokenizatsiya — IKKALASI HAM!
titles["tokens_raw"]   = titles["title"].apply(word_tokenize)        # ⭐ XOM
titles["tokens_clean"] = titles["title_clean"].apply(word_tokenize)  # ⭐ TOZA

# 5 · lemmatizatsiya
titles["tokens_clean_lemmatized"] = titles["tokens_clean"].apply(
    lambda t: [lemmatizer.lemmatize(w) for w in t])
```

> **"Ajoyib! Endi siz `tokens_clean_lemmatized` deb nomlangan ustunga ega ekanimizni ko'rishingiz mumkin — u sarlavhani o'z ichiga oladi, lekin u TOZALANGAN, LEMMATIZATSIYA QILINGAN va TOKENIZATSIYA QILINGAN."**

### 🔑 Nima uchun IKKI xil tokenlar?

> **"Agar sezgan bo'lsangiz, tokenizatsiya qilganimizda biz tokenlarni TOZALANMAGAN xom sarlavha ustida hisobladik, va shuningdek toza tokenlarimiz uchun ham qildik."**
>
> **"Keyin bu turli usullar xom tokenlarimiz va toza tokenlarimiz bo'ylab qanday ishlashini SOLISHTIRISHIMIZ mumkin."**

```
tokens_raw               ← XOM: bosh harf ✅  tinish belgi ✅
                            → NER uchun YAXSHI

tokens_clean_lemmatized  ← TOZA: hammasi olib tashlangan
                            → mashinali o'qitish uchun yaxshi
```

> 💡 **3-darsni eslang:** NER bosh harf va tinish belgiga **tayanadi**. Shuning uchun ikkalasini ham saqlaymiz.

---

## 5. Bitta ro'yxatga yig'ish

> **"`tokens_clean_lemmatized` ustunini bitta yagona ro'yxatga ochib olaylik. Buni xom matn bilan ham qilamiz."**

```python
tokens_raw_list   = sum(titles["tokens_raw"], [])
tokens_clean_list = sum(titles["tokens_clean_lemmatized"], [])

print("Xom tokenlar :", len(tokens_raw_list))
print("Toza tokenlar:", len(tokens_clean_list))
```

```
Xom tokenlar : 11368
Toza tokenlar: 7520
```

> 🔑 **3848 ta token** *(34%)* tozalashda o'chdi — asosan to'xtatish so'zlari va tinish belgilar.

---

## 6. POS teglash

> **"Endi biz nutq qismlari teglash bilan boshlashga tayyormiz. Birinchi qilishimiz kerak bo'lgan narsa — Spacy modelini ishga tushirish."**

```python
nlp = spacy.load("en_core_web_sm")
```

> **"Keyin nutq qismlari teglash bizning XOM tokenlarimiz ustida qanday ishlashini ko'rish uchun `tokens_raw_list` dan spacy hujjatini yaratmoqchimiz."**
>
> **"To'g'ri formatda ekaniga ishonch hosil qilish uchun tokenlarimizni o'rtasida bo'shliq bilan birlashtirish uchun `.join()` dan foydalanamiz."**

```python
spacy_doc = nlp(" ".join(tokens_raw_list))
```

> **"Keyin nutq qismlari teglarimizni joylashtirmoqchi bo'lgan yangi DataFrame yaratamiz."**

```python
pos_df = pd.DataFrame(
    [{"token": token.text, "pos_tag": token.pos_} for token in spacy_doc]
)

pos_df_counts = (pos_df.groupby(["token", "pos_tag"])
                       .size()
                       .reset_index(name="counts")
                       .sort_values(by="counts", ascending=False))

print(pos_df_counts.head(10))
```

```
token pos_tag  counts
    :   PUNCT     543
    '   PUNCT     307
   in     ADP     187
   to    PART     176
   of     ADP     172
    -   PUNCT     166
  the     DET     163
  and   CCONJ     147
   's    PART     143
    ?   PUNCT     130
```

> ## **"Buni chop etganimizda, eng ko'p uchraydigan tokenlarni ko'rishimiz mumkin. Va tez tushunasizki, buni tozalanmagan XOM ma'lumot ustida qilganimiz uchun, bu bizga haqiqatan JUDA KO'P AXLAT berdi."**
>
> **"Shunday qilib, bu xom ma'lumot to'plamidagi eng ko'p uchraydigan tokenlarda juda ko'p tinish belgilar va asosan to'xtatish so'zlari bor."**

### 🔑 `:` belgisi 543 marta — nima uchun?

```
"Ukraine war: Russia strikes Kyiv"
            ↑
BBC sarlavha USLUBI — "Mavzu: Xabar"

543 / 1000 = sarlavhalarning YARMIDAN KO'PI shu formatda!
```

> 💡 **Bu ham insayt!** Faqat tinish belgidan siz **BBC'ning tahririy uslubini** aniqladingiz.

---

## 7. ⭐ Teg bo'yicha filtrlash — axlatdan oltin

> **"Biroq, biz hali ham MA'LUM POS teglarga qarab QIZIQARLI NUQTALARNI tortib olishimiz mumkin. Keling, ma'lumot to'plamimizdagi eng ko'p uchraydigan OTLARGA qarashdan boshlaylik."**

### Otlar

```python
nouns = pos_df_counts[pos_df_counts.pos_tag == "NOUN"][:10]
print(nouns)
```

```
 token pos_tag  counts
   war    NOUN      35
record    NOUN      15
   win    NOUN      15
  year    NOUN      14
police    NOUN      14
   tax    NOUN      13
living    NOUN      13
people    NOUN      12
   day    NOUN      12
  fans    NOUN      11
```

> **"Shunday qilib, siz bu yerda ma'lumot to'plamimizdagi eng ko'p uchraydigan otlarni ko'rishingiz mumkin — birinchisi `war`, u 35 marta paydo bo'ladi, undan keyin `year` so'zi 14 marta."**

### 🎯 Bu nima haqida gapiryapti?

```
war (35) ────────► 🇺🇦 Ukrainadagi urush — 2022-yilning ASOSIY mavzusi
tax (13) ────────► 💷 Soliq siyosati
living (13) ─────► 💰 "cost of living" — hayot qimmatlashuvi inqirozi
police (14) ─────► 🚔 Jinoyat xabarlari
record, win, fans ► ⚽ SPORT
```

> ## 💡 **Bir marta ham yangilik o'qimasdan** siz 2022-yilda Britaniyada **nima muhim bo'lganini** bildingiz: **urush**, **iqtisod** va **sport**.

### Fe'llar

> **"Keling, xuddi shunday fe'llar bilan qilaylik va ma'lumotimizdagi eng ko'p uchraydigan fe'llarni ko'raylik."**

```python
verbs = pos_df_counts[pos_df_counts.pos_tag == "VERB"][:10]
print(verbs)
```

```
token pos_tag  counts
 says    VERB      30
found    VERB      13
  win    VERB      11
 wins    VERB      10
  get    VERB       9
 dies    VERB       9
 make    VERB       8
  set    VERB       8
 take    VERB       8
  say    VERB       8
```

> **"Shunday qilib, bu yerda yana `says`, `found`, `win` kabi so'zlarni ko'rasiz. Va agar eslasangiz, bu YANGILIKLAR ma'lumot to'plami — bu sizga bu oddiy tahlildan qanday narsalar muhokama qilinayotgani va qanday mavzular chiqayotgani haqida juda yaxshi umumiy tasavvur beradi."**

### 🎯 Fe'llar YANGILIK JANRINI ko'rsatadi

| Fe'l | Marta | Nimani anglatadi |
|---|---|---|
| `says` / `say` | **38** | 📰 **Iqtibos keltirish** — jurnalistikaning asosi |
| `win` / `wins` | **21** | ⚽ **Sport natijalari** |
| `found` | 13 | 🔍 Tergov, kashfiyot |
| `dies` | 9 | ⚫ Nekrolog |

> 💡 **`says` 30 marta** — chunki BBC sarlavhalari doim **kimdir aytgan** gapni keltiradi: *"Truss says..."*, *"PM says..."*.

### Sifatlar

> **"Yana biz buni sifatlarga qarab ham qilishimiz mumkin — `new`, `Russian`, `final` so'zlari ham chiqayotganini ko'ramiz."**

```python
adjectives = pos_df_counts[pos_df_counts.pos_tag == "ADJ"][:10]
print(adjectives)
```

```
  token pos_tag  counts
    new     ADJ      28
Russian     ADJ      21
  final     ADJ      16
      -     ADJ      14
  first     ADJ      12
   more     ADJ      10
    big     ADJ       9
   high     ADJ       9
  other     ADJ       8
   last     ADJ       8
```

> ⚠️ **`-` belgisi ADJ deb teglangan** *(14 marta)*. Bu **xato** — chiziqcha sifat emas. spaCy `-` ni `"US-based"` kabi qo'shma sifatlarda ko'rganidan chalkashgan.

### 🎯 `Russian` 21 marta — ADJ

```
"Russian forces" · "Russian oil" · "Russian troops"
    ↑
SIFAT sifatida, ya'ni nimanidir TAVSIFLAYDI.

NER esa buni  NORP  (millat) deb ajratadi — 7-bo'limga qarang.
```

> **"Keyin nomlangan ob'ektlarni tanib olishga o'tamiz. Lekin bu videoni pauza qilib, TOZALANGAN tokenlar ustida POS teglashni sinab ko'rish va ikkalasining farqini solishtirishdan ham tortinmang."**

<details>
<summary>🎁 <b>O'qituvchi taklif qilgan pauza vazifasi — TAYYOR YECHIM</b></summary>

```python
spacy_doc_clean = nlp(" ".join(tokens_clean_list))
pos_df_clean = pd.DataFrame(
    [{"token": t.text, "pos_tag": t.pos_} for t in spacy_doc_clean])
c = (pos_df_clean.groupby(["token", "pos_tag"]).size()
                 .reset_index(name="counts")
                 .sort_values(by="counts", ascending=False))
print(c.head(10))
```

```
  token pos_tag  counts
   2022     NUM      47
england   PROPN      45
    cup   PROPN      39
    say    VERB      37
     uk   PROPN      37
    war    NOUN      34
    new     ADJ      31
  world    NOUN      30
  world   PROPN      26
ukraine   PROPN      23
```

### 🔑 Taqqoslash — bu KATTA farq!

| | **XOM tokenlar** | **TOZA tokenlar** |
|---|---|---|
| **Top-10 da** | `:` `'` `in` `to` `of` `-` `the` `and` `'s` `?` | `2022` `england` `cup` `say` `uk` `war` `new` `world` `ukraine` |
| **Foydali?** | ❌ **Hech biri** | ✅ **Deyarli hammasi** |
| **Nima ko'rinadi** | Tinish belgi + to'xtatish so'zi | **HAQIQIY MAVZULAR** |

> ## 💡 **Toza tokenlarda filtrlashsiz ham** darhol ko'rinadi: **2022 Jahon chempionati** *(cup, england, world)* va **Ukraina urushi** *(war, ukraine, uk)*.

⚠️ **Lekin diqqat:** `world` **ikki marta** ro'yxatda — **NOUN** *(30)* va **PROPN** *(26)*. Chunki `"World Cup"` da u atoqli ot, `"world reacts"` da esa oddiy ot. **Bir xil so'z, boshqa vazifa** — POS teglash aynan buni ajratadi.

</details>

---

## 8. NER — nomlangan ob'ektlar

> **"Shunday qilib, NER teglarimizni olish uchun bu POS teglarimizni olishga juda o'xshash."**
>
> **"Biz tokenlarni va ularning tegishli NER teglarini ushlab turishi kerak bo'lgan DataFrame'ni ishga tushiramiz va uni `ner_df` deb ataymiz."**
>
> **"Keyin tokenlarimiz uchun ob'ekt yorliqlarini olish uchun `for` siklini ishga tushiramiz. Agar bu token bilan bog'liq yorliq BO'LSA, buni yangi qator sifatida qo'shamiz."**

```python
ner_df = pd.DataFrame(
    [{"token": token.text, "ner_tag": token.ent_type_}
     for token in spacy_doc if token.ent_type_ != ""]
)

print(ner_df.head())
```

```
      token  ner_tag
        Liz   PERSON
      Truss   PERSON
         UK      GPE
  Rationing  PRODUCT
superyachts CARDINAL
```

> **"Bu ishlaganini `ner_df.head()` ni ishga tushirish orqali tekshiraylik. Ajoyib, shunday qilib biz `Liz Truss`, `UK`, `Russian`, `70 years` kabi ba'zi tokenlar tortib olinganini ko'ramiz."**

### Eng ko'p uchraydigan ob'ektlar

> **"Endi ma'lumot to'plamida paydo bo'ladigan eng ko'p uchraydigan nomlangan ob'ektlarimizni ko'raylik."**

```python
ner_df_counts = (ner_df.groupby(["token", "ner_tag"])
                       .size()
                       .reset_index(name="counts")
                       .sort_values(by="counts", ascending=False))

print(ner_df_counts.head(10))
```

```
  token ner_tag  counts
Ukraine     GPE      47
     UK     GPE      36
    Cup   EVENT      35
England     GPE      33
  World   EVENT      32
     's  PERSON      22
Russian    NORP      20
   2022   EVENT      20
     's     ORG      19
     US     GPE      19
```

> ## **"Shunday qilib, biz bu yerda `Ukraine` bu ma'lumot to'plamida eng ko'p uchraydigan nomlangan ob'ekt bo'lganini ko'ramiz, undan keyin `England`, `UK` va `US`."**

### ⚠️ Ikkita muammoni sezdingizmi?

**Muammo 1 — `'s` PERSON deb teglangan (22 marta)!**

```
"Truss's plan"  →  word_tokenize  →  ["Truss", "'s", "plan"]
                                              ↑
                        Bu ALOHIDA token bo'lib qoldi va
                        "Truss" bilan bir ob'ektga tegishli deb teglandi
```

**Muammo 2 — `World Cup 2022` UCHGA bo'lindi!**

```
Cup    EVENT  35
World  EVENT  32     ← Bularning HAMMASI BITTA ob'ekt bo'lishi kerak edi:
2022   EVENT  20        "World Cup 2022"
```

> ## 🔑 **Sabab:** biz `token.ent_type_` *(token darajasi)* ishlatdik, `doc.ents` *(ob'ekt darajasi)* emas. Keyingi bo'limda buni **tuzatamiz**.

### Odamlar

> **"Ma'lumot to'plamimizdagi eng mashhur ODAMLARGA qaraylik. `ner_df_counts` ni `ner_tag == "PERSON"` bo'yicha ajratmoqchimiz."**

```python
people = ner_df_counts[ner_df_counts.ner_tag == "PERSON"][:10]
print(people)
```

```
  token ner_tag  counts
     's  PERSON      22
      -  PERSON      18
  Putin  PERSON      11
  Queen  PERSON      10
  Covid  PERSON      10
  Boris  PERSON      10
Johnson  PERSON      10
  Truss  PERSON       9
  Harry  PERSON       8
  Sunak  PERSON       7
```

> **"Shunday qilib, biz bu yerda har xil ismlar chiqayotganini ko'ramiz. Va yana bu o'sha paytda yangiliklar nimani yoritganini ko'rsatadi."**

### ⚠️ Uchta xato ko'rinib turibdi

| Natija | Muammo |
|---|---|
| `'s` **22** | ❌ Bu **odam emas** — egalik qo'shimchasi |
| `-` **18** | ❌ Bu **odam emas** — chiziqcha |
| `Covid` **10** | ❌ Bu **odam emas** — kasallik nomi *(spaCy xatosi)* |
| `Boris` **10** + `Johnson` **10** | ⚠️ **Bir odam, ikkiga bo'lingan!** |

> 💡 **Shuning uchun** natijani **doim ko'z bilan tekshiring**.

---

## 9. ⭐ Yaxshiroq usul — `doc.ents`

Yuqoridagi muammolarni **bir zarbada** hal qilamiz:

```python
ents_df = pd.DataFrame(
    [{"entity": e.text, "ner_tag": e.label_} for e in spacy_doc.ents]
)

ents_counts = (ents_df.groupby(["entity", "ner_tag"])
                      .size()
                      .reset_index(name="counts")
                      .sort_values(by="counts", ascending=False))

print("Jami ob'ekt:", len(spacy_doc.ents))
print(ents_counts.head(10))
```

```
Jami ob'ekt: 1670
        entity      ner_tag  counts
       Ukraine          GPE      47
            UK          GPE      36
       England          GPE      32
       Russian         NORP      20
            US          GPE      19
World Cup 2022        EVENT      18
         first      ORDINAL      13
    The Papers  WORK_OF_ART      13
        France          GPE      12
         China          GPE      11
```

### ✅ Muammolar hal bo'ldi!

```
OLDIN (token darajasi)          KEYIN (doc.ents)
─────────────────────           ─────────────────
Cup    EVENT  35
World  EVENT  32          →     World Cup 2022  EVENT  18   ⭐ BITTA ob'ekt
2022   EVENT  20

's     PERSON 22          →     (yo'q — to'g'ri!)            ⭐ AXLAT KETDI
-      PERSON 18          →     (yo'q — to'g'ri!)
```

### Endi haqiqiy odamlar

```python
odamlar = ents_counts[ents_counts.ner_tag == "PERSON"][:10]
print(odamlar.to_string(index=False))
```

```
       entity ner_tag  counts
        Covid  PERSON       9
        Putin  PERSON       8
        Queen  PERSON       8
    Liz Truss  PERSON       6
Boris Johnson  PERSON       6
  Rishi Sunak  PERSON       5
 Jurgen Klopp  PERSON       4
         Quiz  PERSON       4
       Macron  PERSON       4
Emma Raducanu  PERSON       4
```

> ## 🎯 **Endi TO'LIQ ISMLAR:** `Liz Truss`, `Boris Johnson`, `Rishi Sunak`, `Emma Raducanu`, `Jurgen Klopp`.

### 🔍 2022-yil Britaniyasi bir jadvalda

| Ism | Kim | Marta |
|---|---|---|
| `Putin` | 🇷🇺 Rossiya prezidenti | 8 |
| `Queen` | 👑 Qirolicha Yelizaveta II *(2022-yil sentabrda vafot etgan)* | 8 |
| `Liz Truss` | 🇬🇧 Bosh vazir *(atigi 49 kun!)* | 6 |
| `Boris Johnson` | 🇬🇧 Oldingi bosh vazir | 6 |
| `Rishi Sunak` | 🇬🇧 Keyingi bosh vazir | 5 |
| `Emma Raducanu` | 🎾 Tennischi | 4 |
| `Jurgen Klopp` | ⚽ Liverpool murabbiyi | 4 |

> 💡 **Uchta bosh vazir bitta yilda** — 2022-yil Britaniya siyosatida haqiqatan **notinch yil** bo'lgan. Va buni siz **NER natijasidan** ko'rdingiz.

⚠️ **`Covid` va `Quiz`** hali ham **PERSON** deb teglangan — bu **spaCy xatosi**, `doc.ents` ham uni tuzatmaydi.

### Tashkilotlar va davlatlar

```python
for teg in ["ORG", "GPE"]:
    print(f"\n--- {teg} ---")
    print(ents_counts[ents_counts.ner_tag == teg][:5].to_string(index=False))
```

```
--- ORG ---
entity ner_tag  counts
   BBC     ORG       6
  Nato     ORG       5
  Nasa     ORG       4
   NHS     ORG       4
    EU     ORG       4

--- GPE ---
   entity ner_tag  counts
  Ukraine     GPE      47
       UK     GPE      36
  England     GPE      32
       US     GPE      19
   France     GPE      12
```

### Yorliq taqsimoti

```python
print(pd.Series([e.label_ for e in spacy_doc.ents]).value_counts().head(8))
```

```
PERSON         463
GPE            381
ORG            326
DATE           102
CARDINAL       100
NORP            91
EVENT           46
WORK_OF_ART     38
```

```
PERSON  ████████████████████████████████████████████  463   Odamlar
GPE     ████████████████████████████████████          381   Davlat/shahar
ORG     ███████████████████████████████               326   Tashkilotlar
DATE    █████████                                     102   Sanalar
CARDINAL█████████                                     100   Sonlar
NORP    ████████                                       91   Millatlar
EVENT   ████                                           46   Voqealar
```

> 🔑 **Yangiliklar — bu ODAMLAR va JOYLAR haqida.** PERSON + GPE + ORG = jami ob'ektlarning **70%**.

---

## 10. 💻 To'liq kod

```python
import spacy, pandas as pd, re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nlp = spacy.load("en_core_web_sm")
lemmatizer = WordNetLemmatizer()
en_stopwords = stopwords.words('english')

# ===== 1 · MA'LUMOT =====
bbc_data = pd.read_csv("data/bbc_news.csv")
titles = pd.DataFrame(bbc_data["title"])

# ===== 2 · TOZALASH =====
titles["title_clean"] = titles["title"].str.lower()
titles["title_clean"] = titles["title_clean"].apply(
    lambda x: " ".join([w for w in x.split() if w not in en_stopwords]))
titles["title_clean"] = titles["title_clean"].apply(
    lambda x: re.sub(r"[^\w\s]", "", x))

titles["tokens_raw"]   = titles["title"].apply(word_tokenize)
titles["tokens_clean"] = titles["title_clean"].apply(word_tokenize)
titles["tokens_clean_lemmatized"] = titles["tokens_clean"].apply(
    lambda t: [lemmatizer.lemmatize(w) for w in t])

tokens_raw_list   = sum(titles["tokens_raw"], [])
tokens_clean_list = sum(titles["tokens_clean_lemmatized"], [])
print("Xom:", len(tokens_raw_list), " Toza:", len(tokens_clean_list))

# ===== 3 · SPACY HUJJATI =====
spacy_doc = nlp(" ".join(tokens_raw_list))

# ===== 4 · POS =====
pos_df = pd.DataFrame([{"token": t.text, "pos_tag": t.pos_} for t in spacy_doc])
pos_df_counts = (pos_df.groupby(["token", "pos_tag"]).size()
                       .reset_index(name="counts")
                       .sort_values(by="counts", ascending=False))

for teg in ["NOUN", "VERB", "ADJ"]:
    print(f"\n--- Eng ko'p {teg} ---")
    print(pos_df_counts[pos_df_counts.pos_tag == teg][:5].to_string(index=False))

# ===== 5 · NER (token darajasi — kurs usuli) =====
ner_df = pd.DataFrame([{"token": t.text, "ner_tag": t.ent_type_}
                       for t in spacy_doc if t.ent_type_ != ""])
ner_df_counts = (ner_df.groupby(["token", "ner_tag"]).size()
                       .reset_index(name="counts")
                       .sort_values(by="counts", ascending=False))
print("\n--- NER (token darajasi) ---")
print(ner_df_counts.head(5).to_string(index=False))

# ===== 6 · NER (ob'ekt darajasi — YAXSHIROQ) =====
ents_df = pd.DataFrame([{"entity": e.text, "ner_tag": e.label_}
                        for e in spacy_doc.ents])
ents_counts = (ents_df.groupby(["entity", "ner_tag"]).size()
                      .reset_index(name="counts")
                      .sort_values(by="counts", ascending=False))
print("\n--- NER (doc.ents) ---")
print(ents_counts.head(5).to_string(index=False))
print("\n--- Odamlar ---")
print(ents_counts[ents_counts.ner_tag == "PERSON"][:5].to_string(index=False))
```

---

## 11. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `description` ustunida NER ishga tushiring.

**M2.** Nechta noyob ob'ekt bor?

**M3.** Eng ko'p uchraydigan `DATE` ob'ektlarini toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
tavsif_doc = nlp(" ".join(bbc_data["description"].head(100)))
print("Ob'ekt:", len(tavsif_doc.ents))
print(pd.Series([e.text for e in tavsif_doc.ents]).value_counts().head(5).to_string())
# Ob'ekt: 231
# UK         9
# Ukraine    6
# one        5
# England    4
# first      3

# M2
print(ents_counts.shape[0], "ta noyob ob'ekt")     # 1114 ta noyob ob'ekt

# M3
print(ents_counts[ents_counts.ner_tag == "DATE"][:5].to_string(index=False))
#    entity ner_tag  counts
# Christmas    DATE       7
#      2022    DATE       5
#  the week    DATE       5
#      2023    DATE       4
#    winter    DATE       3
#
# 💡 "Christmas" eng ko'p sana — ma'lumot to'plami QISH oylarini qamrab olgan
```

</details>

### 🟡 O'rta

**M4.** Faqat **bir marta** uchraydigan ob'ektlar necha foiz?

**M5.** Sarlavhalarni **sport** va **siyosat** ga ajrating.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
bir = (ents_counts["counts"] == 1).sum()
print(f"{bir} / {len(ents_counts)} = {round(bir/len(ents_counts)*100)}%")
# 934 / 1114 = 84%
# 🔑 Ob'ektlarning 78% ATIGI BIR MARTA — yangiliklar juda XILMA-XIL

# M5
sport_sozlar = {"cup", "win", "wins", "final", "league", "match", "fans", "goal"}
siyosat_sozlar = {"minister", "government", "pm", "party", "vote", "election", "war"}

def turkum(sarlavha):
    s = set(sarlavha.lower().split())
    if s & sport_sozlar:   return "sport"
    if s & siyosat_sozlar: return "siyosat"
    return "boshqa"

titles["turkum"] = titles["title"].apply(turkum)
print(titles["turkum"].value_counts().to_string())
# boshqa     867
# sport       92
# siyosat     41
#
# ⚠️ 867 ta "boshqa"! Bu usul JUDA SODDA — atigi 15 ta kalit so'z ishlatildi.
#    Haqiqiy turkumlash uchun 26-modulda MODEL quramiz.
```

</details>

### 🔴 Qiyin

**M6.** Har bir davlat *(GPE)* qaysi **fe'llar** bilan birga keladi?

**M7.** `Covid` nima uchun `PERSON` deb teglanadi — buni tuzating.

<details>
<summary>✅ Yechimlar</summary>

```python
# M6 — davlat + kontekst
for davlat in ["Ukraine", "England"]:
    mos = [t for t in titles["title"] if davlat in t]
    d = nlp(" ".join(mos))
    fe = pd.Series([t.text.lower() for t in d if t.pos_ == "VERB"]).value_counts()
    print(f"\n{davlat} ({len(mos)} sarlavha) — eng ko'p fe'llar:")
    print(fe.head(4).to_string())

# Ukraine (54 sarlavha):   killed 3 · visits 3 · have 2 · lost 2
# England (47 sarlavha):   hits 3 · says 3 · win 3 · lead 3
#
# 🎯 MANA FARQ!
#    Ukraine → "killed", "lost"   = URUSH, YO'QOTISH  😔
#    England → "win", "lead"      = SPORT, G'ALABA    ⚽
#    Bir xil usul, ikki BUTUNLAY BOSHQA hikoya.

# M7 — XATO TEGLARNI TUZATISH
xato = {"Covid", "Quiz", "Papers", "Covid-19"}

toza_odamlar = ents_counts[
    (ents_counts.ner_tag == "PERSON") &
    (~ents_counts.entity.isin(xato))
][:8]
print(toza_odamlar.to_string(index=False))
#        entity ner_tag  counts
#         Putin  PERSON       8
#         Queen  PERSON       8
#     Liz Truss  PERSON       6
# Boris Johnson  PERSON       6
#   Rishi Sunak  PERSON       5
#  Jurgen Klopp  PERSON       4
#        Macron  PERSON       4
# Emma Raducanu  PERSON       4
#
# 💡 Bu — "qo'lda tuzatish" (manual correction). Haqiqiy loyihalarda
#    NER natijasini qo'lda tekshirib, xato teglarni ro'yxatga olib
#    filtrlash — MUTLAQO NORMAL amaliyot.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Ma'lumot to'plamida nechta yozuv bor?
2. Nima uchun **ikki xil** token ro'yxati yaratildi?
3. Xom tokenlarda eng ko'p uchraydigan token nima va nima uchun?
4. Eng ko'p uchraydigan ot qaysi?
5. Eng ko'p uchraydigan ob'ekt qaysi?
6. `token.ent_type_` va `doc.ents` farqi nimada?
7. `'s` nima uchun `PERSON` deb teglangan?

<details>
<summary>✅ Javoblar</summary>

1. **1000 ta** yangilik sarlavhasi.
2. **`tokens_raw`** — NER uchun *(bosh harf va tinish belgi kerak)*. **`tokens_clean_lemmatized`** — mashinali o'qitish uchun. Ikkalasini **solishtirish** mumkin.
3. **`:`** — **543 marta**. Chunki BBC sarlavhalari `"Mavzu: Xabar"` uslubida yoziladi.
4. **`war`** — 35 marta *(Ukraina urushi, 2022-yil)*.
5. **`Ukraine`** — 47 marta, `GPE` *(davlat)*.
6. **`token.ent_type_`** — **har bir token** alohida → `World`/`Cup`/`2022` uchta bo'lib ketadi. **`doc.ents`** — **to'liq ob'ekt** → `World Cup 2022` bitta bo'ladi. ⭐ `doc.ents` **yaxshiroq**.
7. Chunki `word_tokenize` `"Truss's"` ni `["Truss", "'s"]` ga ajratdi, va `'s` token `Truss` ob'ektining bir qismi bo'lib qoldi. **`doc.ents`** ishlatilsa bu muammo **yo'q**.

</details>

---

## 📌 Xulosa

```python
# ===== TO'LIQ QUVUR =====
bbc_data = pd.read_csv("data/bbc_news.csv")        # 1000 sarlavha
titles = pd.DataFrame(bbc_data["title"])

# IKKI XIL TOKEN ⭐
titles["tokens_raw"] = titles["title"].apply(word_tokenize)   # NER uchun
titles["tokens_clean_lemmatized"] = ...                       # ML uchun

spacy_doc = nlp(" ".join(tokens_raw_list))

# POS — teg bo'yicha FILTRLANG!
pos_df_counts[pos_df_counts.pos_tag == "NOUN"][:10]

# NER — doc.ents ishlatilsin ⭐
[{"entity": e.text, "ner_tag": e.label_} for e in spacy_doc.ents]


NATIJA — 2022-yil BBC yangiliklari

  OTLAR:     war 35 · record 15 · win 15 · year 14 · police 14
  FE'LLAR:   says 30 · found 13 · win 11 · dies 9
  SIFATLAR:  new 28 · Russian 21 · final 16

  OB'EKTLAR: Ukraine 47 · UK 36 · England 32 · US 19
  ODAMLAR:   Queen 8 · Putin 8 · Liz Truss 6 · Boris Johnson 6

  → 🇺🇦 URUSH · 💷 IQTISOD · ⚽ SPORT · 👑 QIROLICHA


⚠️  IKKI TUZOQ
1 · XOM tokenlarda top-10 = TINISH BELGI va TO'XTATISH SO'ZI
    → TEG BO'YICHA filtrlang
2 · token.ent_type_ ob'ektlarni BO'LIB YUBORADI
    "World Cup 2022" → 3 ta alohida
    → doc.ents ishlating


⚠️  spaCy XATOLARI (doim tekshiring!)
    Covid → PERSON      Quiz → PERSON      "-" → ADJ
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `.ent_type_` | *entity type* | Token darajasidagi NER teg |
| `.ents` | *entities* | Ob'ekt darajasidagi ro'yxat ⭐ |
| `.label_` | *label* | Ob'ekt turi |
| Ob'ekt darajasi | *span level* | Bir necha token = bitta ob'ekt |
| Qo'lda tuzatish | *manual correction* | Xato teglarni filtrlash |

---

⬅️ [Oldingi: NER](03-Named-Entity-Recognition.md) · 🏠 [Modul boshiga](README.md)

📝 **Endi amaliyot:** [Barcha mashqlar](MASHQLAR.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
