# 3-dars. NER — nomlangan ob'ektlarni tanib olish

## 🎬 Boshlashdan oldin

> **"Nomlangan ob'ektlarni tanib olish uchun biz Spacy paketidan foydalanishda davom etamiz. Shuningdek, chiroyli vizuallar qilish uchun `displacy` ni import qilamiz."**

📁 **Matn:** [`data/google.txt`](data/google.txt) — Google'ning Vikipediya sahifasidan olingan parcha.

> ## ⚠️ **Bu darsda kursning ENG MUHIM saboqlaridan biri bor:** matnni **qachon** tozalash kerakligi. Xato qadamda tozalasangiz — **ma'lumotning yarmini yo'qotasiz**.

---

## 1. Import

```python
import spacy
from spacy import displacy
import re
```

> **"Biz shuningdek paketni import qilamiz, chunki bu darsda bir oz tozalash qilamiz."**

---

## 2. Model va matn

> **"Oxirgi darsdagidek, biz Spacy modelimizni ishga tushirishdan boshlaymiz."**

```python
nlp = spacy.load("en_core_web_sm")
```

> **"Foydalanadigan misol matnimiz shunchaki Google'ning Vikipediya sahifasidan olingan. Shunday qilib, biz uni `google_text` deb nomlaymiz."**

```python
with open("data/google.txt", encoding="utf-8") as f:
    google_text = f.read().strip()

print(google_text[:180])
```

```
Google was founded on September 4, 1998, by computer scientists Larry Page and Sergey Brin while they were PhD students at Stanford University in California. Together they own
```

---

## 3. Ob'ektlarni chiqarish

> **"Keyin Spacy hujjatimizni yaratamiz. Va keyin `for` siklidan foydalanishimiz mumkin. Har bir so'z uchun Spacy hujjatimizda `.ents` dan foydalanamiz. Va biz so'zni — ya'ni tokenni — va tegishli YORLIQNI chop etamiz."**

```python
spacy_doc = nlp(google_text)

for word in spacy_doc.ents:
    print(f"{word.text:28s} {word.label_}")
```

```
Google                       ORG
September 4, 1998            DATE
Larry Page                   PERSON
Sergey Brin                  PERSON
PhD                          WORK_OF_ART
Stanford University          ORG
California                   GPE
about 14%                    PERCENT
56%                          PERCENT
IPO                          ORG
2004                         DATE
2015                         DATE
Google                       ORG
Alphabet Inc.                ORG
Alphabet                     ORG
Alphabet                     ORG
Sundar Pichai                PERSON
Google                       ORG
October 24, 2015             DATE
Larry Page                   PERSON
Alphabet                     GPE
December 3, 2019             DATE
Pichai                       PERSON
Alphabet                     GPE
```

```python
print("Jami ob'ekt:", len(spacy_doc.ents))
```

```
Jami ob'ekt: 24
```

> **"Bu chop etilgach, nimani nazarda tutganimni ko'rishingiz mumkin. U SANALARNI oldi. ODAMLARNI oldi, TASHKILOTLARNI, FOIZLARNI — juda ko'p turli xil ma'lumot shunchaki bu KICHIK matn parchasidan chiqdi."**

### 🔑 Uchta muhim kuzatuv

**1 · Bir necha so'z BITTA ob'ekt**

```
"Larry Page"        →  1 ta PERSON   (2 ta token emas!)
"Stanford University" → 1 ta ORG
"September 4, 1998"  →  1 ta DATE    (3 ta token emas!)
```

**2 · spaCy XATO ham qiladi**

```
"PhD"      →  WORK_OF_ART  ❌   Bu san'at asari EMAS!
"IPO"      →  ORG          ❌   Bu tashkilot EMAS, moliyaviy atama
"Alphabet" →  ORG  ...lekin ba'zan  GPE  ❌  (bir xil so'z, boshqa teg!)
```

> ## ⚠️ **NER — 100% aniq emas.** U **model** — ehtimollik asosida taxmin qiladi. Natijani **doim tekshiring**.

**3 · `.ents` — bu tokenlar EMAS**

```python
len(spacy_doc)         # 140  ← TOKENLAR soni
len(spacy_doc.ents)    # 24   ← OB'EKTLAR soni
```

---

## 4. Asosiy NER yorliqlari

```python
for l in ["PERSON", "ORG", "GPE", "LOC", "DATE", "TIME",
          "PERCENT", "MONEY", "NORP", "EVENT", "WORK_OF_ART", "CARDINAL"]:
    print(f"{l:14s} {spacy.explain(l)}")
```

```
PERSON         People, including fictional
ORG            Companies, agencies, institutions, etc.
GPE            Countries, cities, states
LOC            Non-GPE locations, mountain ranges, bodies of water
DATE           Absolute or relative dates or periods
TIME           Times smaller than a day
PERCENT        Percentage, including "%"
MONEY          Monetary values, including unit
NORP           Nationalities or religious or political groups
EVENT          Named hurricanes, battles, wars, sports events, etc.
WORK_OF_ART    Titles of books, songs, etc.
CARDINAL       Numerals that do not fall under another type
```

| Yorliq | O'zbekcha | Misol |
|---|---|---|
| `PERSON` | **Odam** | `Larry Page`, `Alisher Navoiy` |
| `ORG` | **Tashkilot** | `Google`, `NASA`, `BBC` |
| `GPE` | **Davlat/shahar/viloyat** | `California`, `Toshkent` |
| `LOC` | **Boshqa joy** *(tog', daryo)* | `Tyan-Shan`, `Amudaryo` |
| `DATE` | **Sana** | `September 4, 1998`, `o'tgan yil` |
| `TIME` | **Vaqt** *(bir kundan kam)* | `soat 3 da` |
| `PERCENT` | **Foiz** | `14%` |
| `MONEY` | **Pul** | `50 million dollars` |
| `NORP` | **Millat/din/siyosiy guruh** | `Russian`, `o'zbek` |
| `EVENT` | **Voqea** | `World Cup 2022` |
| `WORK_OF_ART` | **San'at asari** | kitob, qo'shiq nomi |
| `CARDINAL` | **Oddiy son** | `56`, `uchta` |

> 💡 **`GPE` va `LOC` farqi:** `GPE` — **siyosiy chegarasi bor** joy *(davlat, shahar)*. `LOC` — **tabiiy** joy *(tog', dengiz)*.

---

## 5. `displacy` — chiroyli vizual

> **"Keyin matnimizdagi turli ob'ektlarning haqiqatan chiroyli vizualini yaratish uchun `displacy.render` funksiyasidan foydalanishimiz mumkin."**
>
> **"Shunday qilib, `displacy.render` dan foydalanamiz va qavslardagi birinchi argument — bu bizning spacy hujjatimiz. Keyin uslubni ko'rsatamiz va uni Jupyter notebook ichida ekanini ko'rsatamiz."**

```python
displacy.render(spacy_doc, style="ent", jupyter=True)
```

**Natija — rangli teglangan matn:**

```
┌────────────────────────────────────────────────────────────────┐
│ [Google ORG] was founded on [September 4, 1998 DATE], by       │
│ computer scientists [Larry Page PERSON] and [Sergey Brin       │
│ PERSON] while they were [PhD WORK_OF_ART] students at          │
│ [Stanford University ORG] in [California GPE]. Together they   │
│ own about [14% PERCENT] of its publicly listed shares...       │
└────────────────────────────────────────────────────────────────┘
```

Har bir ob'ekt turi **o'z rangi** bilan bo'yaladi.

> **"Buni ishga tushirganimizda, matnimiz barcha turli ob'ektlar bilan teglangan haqiqatan chiroyli vizualni olamiz va ular turli ranglar bo'yicha guruhlangan."**
>
> **"Bu agar siz taqdimot tayyorlayotgan bo'lsangiz yoki shunchaki vizualroq notebook bilan ishlashni yoqtirsangiz, juda yaxshi. Foydalanish uchun juda yaxshi funksiya."**

### 💡 Jupyter'siz — HTML fayl sifatida saqlash

```python
html = displacy.render(spacy_doc, style="ent", page=True)
with open("entities.html", "w", encoding="utf-8") as f:
    f.write(html)
print("entities.html saqlandi — brauzerda oching")
```

### 💡 `style="dep"` — sintaktik daraxt

```python
displacy.render(nlp("Google was founded by Larry Page."), style="dep")
```

Bu jumladagi so'zlarning **grammatik bog'lanishini** ko'rsatadi.

---

## 6. ⭐⭐ ENG MUHIM TAJRIBA — matnni tozalash

> **"Xo'sh, matnni biroz tozalaganimizdan keyin nomlangan ob'ektlarni tanib olishimizga nima bo'lishini ko'raylik."**
>
> **"Shunday qilib, `google_text_clean` yaratamiz va tinish belgilarni olib tashlash uchun `re.sub()` funksiyasidan foydalanamiz. Bu regexni oldingi darslardan bilasiz."**
>
> **"Shuningdek, hammasini bitta chiroyli toza qatorda kichik harfga va tinish belgilarsiz qilish uchun `.lower()` funksiyasini qo'shamiz."**

```python
google_text_clean = re.sub(r"[^\w\s]", "", google_text).lower()

print(google_text_clean[:180])
```

```
google was founded on september 4 1998 by computer scientists larry page and sergey brin while they were phd students at stanford university in california together they own about 14
```

> **"Shunday qilib, buni chop etganimizda, u biroz boshqacha ko'rinishini ko'rasiz. Endi tinish belgilar yo'q va hammasi kichik harfda."**

### Yangi hujjat yaratamiz

```python
spacy_doc_clean = nlp(google_text_clean)

for word in spacy_doc_clean.ents:
    print(f"{word.text:28s} {word.label_}")

print("\nJami ob'ekt:", len(spacy_doc_clean.ents))
```

```
google                       ORG
september 4 1998             DATE
stanford university          ORG
california                   GPE
about 14                     CARDINAL
56                           CARDINAL
2004                         DATE
2015                         DATE
alphabet inc google          ORG
google                       ORG
october 24 2015              DATE
larry                        PERSON
december 3 2019              DATE

Jami ob'ekt: 13
```

> ## **"Shunday qilib, bu yerda ANCHA KAMROQ narsa olinganini ko'rishingiz mumkin — chunki biz o'sha tinish belgilarni va bosh harflarni olib tashladik."**

---

## 7. 📉 Zararni hisoblaymiz

```
   XOM MATN                    TOZALANGAN MATN
   24 ta ob'ekt        →           13 ta ob'ekt
   ████████████████████        ███████████
                    │
              -11 ob'ekt = 46% YO'QOTILDI
```

### Aynan nima yo'qoldi?

| Xom matnda | Tozalangandan keyin | Nima bo'ldi |
|---|---|---|
| `Larry Page` **PERSON** | `larry` **PERSON** | ⚠️ **Familiya yo'qoldi** — endi bu kim? |
| `Sergey Brin` **PERSON** | ❌ *(butunlay yo'q)* | **Asoschi yo'qoldi!** |
| `Sundar Pichai` **PERSON** | ❌ *(butunlay yo'q)* | **Bosh direktor yo'qoldi!** |
| `Pichai` **PERSON** | ❌ *(butunlay yo'q)* | — |
| `about 14%` **PERCENT** | `about 14` **CARDINAL** | ⚠️ **Turi o'zgardi!** |
| `56%` **PERCENT** | `56` **CARDINAL** | ⚠️ **Endi bu foiz emas** |
| `Alphabet Inc.` + `Google` | `alphabet inc google` **ORG** | ❌ **Ikkitasi BIRLASHDI!** |
| `Alphabet` ×4 | ❌ *(butunlay yo'q)* | **Bosh kompaniya yo'qoldi** |

### 🔍 Nima uchun aynan shunday bo'ldi?

**① Bosh harf — odam ismining ASOSIY belgisi**

```
"Sergey Brin"  →  Bosh harflar: S, B  →  PERSON ✅
"sergey brin"  →  Bosh harf yo'q     →  ??? ❌
```

**② Nuqta — jumla chegarasi**

```
XOM:      "...subsidiary of Alphabet Inc. Google is Alphabet's..."
                                        ↑
                              NUQTA = jumla tugadi

TOZA:     "...subsidiary of alphabet inc google is alphabets..."
                                        ↑
                            Nuqta YO'Q → spaCy bularni BITTA
                            ob'ekt deb o'yladi: "alphabet inc google"
```

**③ Foiz belgisi — turning o'zi**

```
"14%"  →  PERCENT   (foiz)
"14"   →  CARDINAL  (shunchaki son)
        ↑
   "%" belgisi O'CHIRILDI → ma'no O'ZGARDI
```

---

## 8. 🔑 Darsning ASOSIY SABOG'I

> ## **"Shunday qilib, agar siz nomlangan ob'ektlarni tanib olish bilan shug'ullansangiz, buni tahlilingizning va ma'lumotni tozalashingizning QAYSI NUQTASIDA qilishingizni O'YLAB KO'RISH juda muhim."**
>
> ## **"Chunki agar siz keyinroq mashinali o'qitish qilayotganingiz uchun matnni HADDAN TASHQARI ko'p tozalagan bo'lsangiz, u o'sha ob'ektlarni TOPA OLMAYDI."**
>
> **"Shuning uchun buni QACHON qilishni o'ylab ko'ring. Siz buni oldindan qayta ishlashdan OLDIN qilishni xohlashingiz mumkin. Bir oz oldindan qayta ishlang va keyin yana sinab ko'ring."**
>
> ## **"Ma'lumotingiz bilan TANISH BO'LISH juda yaxshi. Uni tekshiring, u yerda nima borligini biling va keyin mos ravishda oldindan qayta ishlang va tahlilingizni to'g'ri nuqtada qiling."**

### ✅ TO'G'RI tartib

```
   XOM MATN
      │
      ▼
 ┌──────────┐
 │   NER    │  ⭐ AVVAL NER!  (bosh harf va tinish belgi HALI BOR)
 └──────────┘
      │
      ▼
  Ob'ektlarni SAQLANG  →  ['Larry Page', 'Sergey Brin', ...]
      │
      ▼
 ┌──────────────────┐
 │ OLDINDAN QAYTA   │  Endi tozalang
 │    ISHLASH       │
 └──────────────────┘
      │
      ▼
  MASHINALI O'QITISH
```

### ❌ NOTO'G'RI tartib

```
   XOM MATN
      │
      ▼
 ┌──────────────────┐
 │ OLDINDAN QAYTA   │  ❌ Tozalash BIRINCHI
 │    ISHLASH       │
 └──────────────────┘
      │
      ▼
 ┌──────────┐
 │   NER    │  ❌ Ob'ektlarning YARMI YO'Q
 └──────────┘
      │
      ▼
  😵 "Sergey Brin kim?" — MODEL BILMAYDI
```

> ## 💡 **Bir jumlada:** *NER — birinchi, tozalash — keyin. Chunki NER aynan siz o'chirmoqchi bo'lgan narsalarga (bosh harf, tinish belgi) TAYANADI.*

---

## 9. 💻 To'liq kod

```python
import spacy
from spacy import displacy
import re

nlp = spacy.load("en_core_web_sm")

with open("data/google.txt", encoding="utf-8") as f:
    google_text = f.read().strip()

# ===== 1 · XOM MATN =====
spacy_doc = nlp(google_text)

print("=== XOM MATN ===")
for word in spacy_doc.ents:
    print(f"{word.text:28s} {word.label_}")
print("Jami:", len(spacy_doc.ents))

# ===== 2 · VIZUAL =====
# displacy.render(spacy_doc, style="ent", jupyter=True)

# ===== 3 · TOZALANGAN MATN =====
google_text_clean = re.sub(r"[^\w\s]", "", google_text).lower()
spacy_doc_clean = nlp(google_text_clean)

print("\n=== TOZALANGAN MATN ===")
for word in spacy_doc_clean.ents:
    print(f"{word.text:28s} {word.label_}")
print("Jami:", len(spacy_doc_clean.ents))

# ===== 4 · TAQQOSLASH =====
xom  = {e.text.lower() for e in spacy_doc.ents}
toza = {e.text.lower() for e in spacy_doc_clean.ents}
print("\n❌ YO'QOLGAN ob'ektlar:")
for e in sorted(xom - toza):
    print("  ", e)
```

**Natija (oxirgi qismi):**

```
❌ YO'QOLGAN ob'ektlar:
   56%
   about 14%
   alphabet
   alphabet inc.
   december 3, 2019
   ipo
   larry page
   october 24, 2015
   phd
   pichai
   september 4, 1998
   sergey brin
   sundar pichai
```

---

## 10. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Matnda nechta token va nechta ob'ekt bor?

**M2.** Faqat `PERSON` ob'ektlarini chiqaring.

**M3.** Har bir yorliq nechta marta uchraydi?

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print("Token :", len(spacy_doc))          # Token : 140
print("Ob'ekt:", len(spacy_doc.ents))     # Ob'ekt: 24

# M2
print([e.text for e in spacy_doc.ents if e.label_ == "PERSON"])
# ['Larry Page', 'Sergey Brin', 'Sundar Pichai', 'Larry Page', 'Pichai']

# M3
import pandas as pd
print(pd.Series([e.label_ for e in spacy_doc.ents]).value_counts().to_string())
# ORG            8
# DATE           5
# PERSON         5
# GPE            3
# PERCENT        2
# WORK_OF_ART    1
```

</details>

### 🟡 O'rta

**M4.** Ob'ektlarning matndagi **o'rnini** (belgi indeksini) chiqaring.

**M5.** `displacy` natijasini HTML faylga saqlang.

**M6.** Faqat **noyob** ob'ektlar ro'yxatini oling.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
for e in list(spacy_doc.ents)[:5]:
    print(f"{e.text:20s} [{e.start_char:3d}:{e.end_char:3d}]  {e.label_}")
# Google               [  0:  6]  ORG
# September 4, 1998    [ 22: 39]  DATE
# Larry Page           [ 64: 74]  PERSON
# Sergey Brin          [ 79: 90]  PERSON
# PhD                  [107:110]  WORK_OF_ART

# M5
html = displacy.render(spacy_doc, style="ent", page=True)
with open("entities.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Saqlandi ✅")

# M6
noyob = sorted({(e.text, e.label_) for e in spacy_doc.ents})
print(len(noyob), "ta noyob")     # 19 ta noyob
# ⚠️ "Alphabet" IKKI marta ro'yxatda — bir marta ORG, bir marta GPE.
#    Bir xil so'z, ikki xil teg. NER 100% barqaror emas!
for txt, lbl in noyob[:5]:
    print(f"  {txt:20s} {lbl}")
```

</details>

### 🔴 Qiyin

**M7.** FAQAT kichik harfga o'tkazing *(tinish belgilarni saqlang)* va zararni o'lchang.

**M8.** FAQAT tinish belgilarni o'chiring *(bosh harflarni saqlang)* va zararni o'lchang.

**M9.** Qaysi zararliroq — bosh harfni yo'qotishmi yoki tinish belgininmi?

<details>
<summary>✅ Yechimlar</summary>

```python
variantlar = {
    "1 · XOM (hech narsa qilinmagan)": google_text,
    "2 · faqat kichik harf":           google_text.lower(),
    "3 · faqat tinish belgisiz":       re.sub(r"[^\w\s]", "", google_text),
    "4 · IKKALASI (to'liq tozalash)":  re.sub(r"[^\w\s]", "", google_text).lower(),
}

print(f"{'VARIANT':36s} {'OBEKT':>6s} {'PERSON':>7s}")
print("-" * 52)
for nom, matn in variantlar.items():
    d = nlp(matn)
    p = len([e for e in d.ents if e.label_ == "PERSON"])
    print(f"{nom:36s} {len(d.ents):6d} {p:7d}")
```

```
VARIANT                               OBEKT  PERSON
----------------------------------------------------
1 · XOM (hech narsa qilinmagan)          24       5
2 · faqat kichik harf                    17       1
3 · faqat tinish belgisiz                21       4
4 · IKKALASI (to'liq tozalash)           13       1
```

**M9 javob:**

```
BOSH HARFNI yo'qotish:    24 → 17  (-7)   PERSON: 5 → 1  ❌❌
TINISH BELGINI yo'qotish: 24 → 21  (-3)   PERSON: 5 → 4  ✅
```

> ## 🔑 **BOSH HARF ancha muhimroq!** Uni yo'qotsangiz PERSON ob'ektlarining **80%** yo'qoladi *(5 tadan 1 tasi qoladi)*. Tinish belgisiz esa 5 tadan **4 tasi saqlanib qoladi**.
>
> 💡 **Amaliy maslahat:** agar NER'ni oldindan qayta ishlashdan keyin qilishga **majbur** bo'lsangiz — hech bo'lmaganda **`.lower()` ni qilmang**.

</details>

---

## 🧠 O'zini tekshirish savollari

1. `doc.ents` va `doc` farqi nimada?
2. `displacy.render()` da `style="ent"` nimani anglatadi?
3. Tozalashdan keyin nechta ob'ekt qoldi?
4. `"Sergey Brin"` nima uchun yo'qoldi?
5. `14%` nima uchun `PERCENT` dan `CARDINAL` ga o'zgardi?
6. `"alphabet inc google"` qanday paydo bo'ldi?
7. **NER'ni qachon qilish kerak** — tozalashdan oldinmi yoki keyinmi?

<details>
<summary>✅ Javoblar</summary>

1. **`doc`** — barcha **tokenlar** *(122 ta)*. **`doc.ents`** — faqat **nomlangan ob'ektlar** *(24 ta)*.
2. **`ent`** = *entity* — ob'ektlarni rangli ko'rsatish. *(`"dep"` esa sintaktik daraxt.)*
3. **13 ta** — 24 tadan. **46% yo'qoldi.**
4. Chunki **bosh harflar** o'chirildi. `"Sergey Brin"` → `"sergey brin"` — spaCy uni ism deb tanimadi.
5. Chunki **`%` belgisi** o'chirildi. `%` — aynan foizni bildiruvchi belgi edi.
6. Chunki `"Alphabet Inc."` dagi **nuqta** o'chirildi → **jumla chegarasi yo'qoldi** → spaCy keyingi jumladagi `Google` ni ham shu ob'ektga qo'shdi.
7. ## **TOZALASHDAN OLDIN!** NER aynan bosh harf va tinish belgiga **tayanadi**.

</details>

---

## 📌 Xulosa

```python
import spacy, re
from spacy import displacy
nlp = spacy.load("en_core_web_sm")

# ===== OB'EKTLARNI OLISH =====
doc = nlp(matn)
for e in doc.ents:
    print(e.text, e.label_, e.start_char, e.end_char)

# ===== VIZUAL =====
displacy.render(doc, style="ent", jupyter=True)


ASOSIY YORLIQLAR
  PERSON · ORG · GPE · LOC · DATE · TIME
  PERCENT · MONEY · NORP · EVENT · WORK_OF_ART


⭐⭐ DARSNING ASOSIY SABOG'I ⭐⭐

     XOM MATN                TOZALANGAN
     24 ta ob'ekt      →     13 ta ob'ekt
                    -46%

 YO'QOLDI:  Sergey Brin · Sundar Pichai · Alphabet
            14% → 14 (PERCENT → CARDINAL)
            "Alphabet Inc." + "Google" BIRLASHDI


 ✅ TO'G'RI:    xom matn → NER → tozalash → model
 ❌ NOTO'G'RI:  xom matn → tozalash → NER (yarmi yo'q!)


 NIMA UCHUN?
   Bosh harf     = odam ismining ASOSIY belgisi
   Nuqta         = jumla chegarasi
   Foiz belgisi  = ob'ekt TURINI belgilaydi

 ⚠️ BOSH HARF tinish belgidan MUHIMROQ:
    .lower()  →  PERSON 5 → 2  (60% yo'qoladi)
    tinishsiz →  PERSON 5 → 5  (yo'qolmaydi)
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Nomlangan ob'ekt | *named entity* | Ism, joy, tashkilot |
| Ob'ektlar | *entities* / `.ents` | Topilgan ob'ektlar ro'yxati |
| Yorliq | *label* / `.label_` | Ob'ekt turi |
| Vizuallashtirish | *displacy* | spaCy vizual vositasi |
| Belgi indeksi | *char offset* | `.start_char`, `.end_char` |

---

⬅️ [Oldingi: POS teglash](02-POS-Tagging.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Amaliy vazifa](04-Practical-Task.md)
