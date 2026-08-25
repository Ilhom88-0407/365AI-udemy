# 🚀 22-modul — Mini-loyihalar

> 6 ta tayyor loyiha. Har biri **ishga tushirilgan va tekshirilgan**.

---

## ⚙️ Umumiy tayyorgarlik

```bash
pip install spacy pandas
python -m spacy download en_core_web_sm
```

```python
import spacy
import pandas as pd
import re

nlp = spacy.load("en_core_web_sm")
```

---

## 1️⃣ Loyiha — Universal teglovchi

**Maqsad:** Har qanday matnni **to'liq** tahlil qiladigan bitta funksiya.

```python
def tegla(matn):
    """Matnni to'liq teglash: POS + lemma + ob'ekt."""
    doc = nlp(matn)
    print(f"{'TOKEN':14s} {'POS':8s} {'LEMMA':14s} {'ENTITY':10s}")
    print("-" * 50)
    for t in doc:
        if t.is_punct or t.is_space:
            continue
        print(f"{t.text:14s} {t.pos_:8s} {t.lemma_:14s} {t.ent_type_ or '—':10s}")


tegla("Tesla opened a new factory in Berlin last March.")
```

**Natija:**

```
TOKEN          POS      LEMMA          ENTITY
--------------------------------------------------
Tesla          PROPN    Tesla          ORG
opened         VERB     open           —
a              DET      a              —
new            ADJ      new            —
factory        NOUN     factory        —
in             ADP      in             —
Berlin         PROPN    Berlin         GPE
last           ADJ      last           DATE
March          PROPN    March          DATE
```

### 🔑 Bitta jadvalda uchta ma'lumot

| Kuzatuv | Izoh |
|---|---|
| `opened` → lemma **`open`** | Lemmatizatsiya **avtomatik** ishladi |
| `Tesla` → **PROPN** + **ORG** | POS *va* NER ikkalasi ham |
| `last March` → **ikkala token DATE** | Ular **bitta ob'ekt** — `doc.ents` da `"last March"` |
| `Berlin` → **PROPN** + **GPE** | Shahar |

---

## 2️⃣ Loyiha — "Kim, qayerda, qachon?" ajratgichi

**Maqsad:** Har qanday xabardan **jurnalistik savollarga** javob olish.

```python
def kim_qayer_qachon(matn):
    """Matndan KIM, QAYER, QACHON, QAYSI TASHKILOT ni ajratadi."""
    doc = nlp(matn)
    natija = {"KIM": [], "QAYER": [], "QACHON": [], "TASHKILOT": []}
    for e in doc.ents:
        if   e.label_ == "PERSON":            natija["KIM"].append(e.text)
        elif e.label_ in ("GPE", "LOC"):      natija["QAYER"].append(e.text)
        elif e.label_ in ("DATE", "TIME"):    natija["QACHON"].append(e.text)
        elif e.label_ == "ORG":               natija["TASHKILOT"].append(e.text)
    return natija


xabar = ("On Monday, Rishi Sunak met Emmanuel Macron in Paris "
         "to discuss NATO funding.")

for k, v in kim_qayer_qachon(xabar).items():
    print(f"  {k:10s} {v}")
```

**Natija:**

```
  KIM        ['Rishi Sunak', 'Emmanuel Macron']
  QAYER      ['Paris']
  QACHON     ['Monday']
  TASHKILOT  ['NATO']
```

### 🎯 Bu — HAQIQIY mahsulot

```
   XABAR MATNI
        │
        ▼
  ┌───────────┐
  │    NER    │
  └───────────┘
        │
        ▼
  KIM?  Rishi Sunak, Emmanuel Macron
  QAYER? Paris
  QACHON? Monday
  NIMA?  NATO funding
```

> 💡 **Aynan shunday tizimlar** yangiliklarni avtomatik teglaydi, kalendarga uchrashuvlar qo'shadi va chatbotlarga buyruq tushuntiradi.

---

## 3️⃣ Loyiha — Matn janrini aniqlagich

**Maqsad:** POS **taqsimoti** matn **janrini** ochib beradi.

```python
def janr_profili(matn, nom=""):
    doc = nlp(matn)
    sozlar = [t for t in doc if not t.is_punct]
    v = pd.Series([t.pos_ for t in sozlar]).value_counts()
    f = lambda teg: round(v.get(teg, 0) / len(sozlar) * 100)
    print(f"  {nom:10s} NOUN {f('NOUN'):3d}%  VERB {f('VERB'):3d}%  "
          f"ADJ {f('ADJ'):3d}%  PROPN {f('PROPN'):3d}%")


namunalar = {
 "Ilmiy":    "The experiment demonstrates that the catalyst significantly "
             "increases the reaction rate under standard conditions.",
 "Badiiy":   "She walked slowly through the quiet, misty garden, remembering "
             "the warm summers of her happy childhood.",
 "Yangilik": "Police said three people were arrested in London on Tuesday "
             "after a protest outside Parliament.",
}

for nom, matn in namunalar.items():
    janr_profili(matn, nom)
```

**Natija:**

```
  Ilmiy      NOUN  36%  VERB  14%  ADJ   7%  PROPN   0%
  Badiiy     NOUN  25%  VERB  12%  ADJ  19%  PROPN   0%
  Yangilik   NOUN  20%  VERB  13%  ADJ   0%  PROPN  20%
```

### 🔑 Har bir janrning BARMOQ IZI

```
ILMIY     NOUN 36%  ← eng ko'p OT           📚 Atamalar, tushunchalar
          ADJ   7%  ← sifat KAM                Ob'ektiv, quruq

BADIIY    ADJ  19%  ← eng ko'p SIFAT ⭐      📖 Tasvirlash, hissiyot
          PROPN 0%  ← atoqli ot YO'Q            "quiet", "misty", "warm", "happy"

YANGILIK  PROPN 20% ← eng ko'p ATOQLI OT ⭐  📰 Ismlar, joylar
          ADJ   0%  ← sifat YO'Q!               Faktlar, hech qanday bezak yo'q
```

> ## 💡 **Bu — HAQIQIY xususiyat (feature).** Bu 4 ta raqamni modelga bersangiz, u matn janrini **matnni o'qimasdan** aniqlay oladi. 26-modulda aynan shunday model quramiz.

### 🔬 Sinab ko'ring

```python
janr_profili("Add two eggs, stir the mixture, and bake for thirty minutes.", "Retsept")
janr_profili("The defendant shall provide written notice within fourteen days.", "Huquqiy")
```

---

## 4️⃣ Loyiha — Rezyume tahlilchisi

**Maqsad:** CV dan **ish tajribasini** avtomatik ajratib olish.

```python
cv = """John Smith
Senior Data Scientist at Google since March 2019.
Previously worked at Microsoft in Seattle from 2015 to 2019.
Studied Computer Science at Stanford University.
Email: john.smith@example.com  Phone: +1 415 555 0132"""

doc = nlp(cv)

print("=== NER TOPGANI ===")
for e in doc.ents:
    print(f"  {e.text:26s} {e.label_}")

print("\n=== REGEX TOPGANI ===")
print("  email:", re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", cv))
```

**Natija:**

```
=== NER TOPGANI ===
  John Smith                 PERSON
  Google                     ORG
  March 2019                 DATE
  Microsoft                  ORG
  Seattle                    GPE
  2015 to 2019               DATE
  Studied Computer Science   ORG
  Stanford University        ORG
  555                        CARDINAL

=== REGEX TOPGANI ===
  email: ['john.smith@example.com']
```

### ✅ Nima to'g'ri ishladi

```
Ism:        John Smith                 ✅
Kompaniya:  Google, Microsoft          ✅
Universitet: Stanford University       ✅
Shahar:     Seattle                    ✅
Sanalar:    March 2019, 2015 to 2019   ✅  ("2015 to 2019" BITTA ob'ekt!)
```

### ❌ Nima xato ketdi

| Natija | Muammo |
|---|---|
| `Studied Computer Science` → **ORG** | ❌ Bu tashkilot **emas** — fan nomi |
| `555` → **CARDINAL** | ❌ Telefon raqamining **bo'lagi** |
| Telefon raqami **butunlay** topilmadi | ❌ NER telefon formatini bilmaydi |

### 🔑 Muhim saboq — NER va REGEX BIRGA ishlaydi

```
┌──────────────┬───────────────────────────────────────┐
│  NER         │  Ism, kompaniya, joy, sana            │
│              │  → "shakli oldindan noma'lum" narsa   │
├──────────────┼───────────────────────────────────────┤
│  REGEX       │  Email, telefon, IP, karta raqami     │
│              │  → "shakli QAT'IY" narsa              │
└──────────────┴───────────────────────────────────────┘
```

```python
# To'liq yechim — IKKALASI birga
def cv_tahlil(matn):
    doc = nlp(matn)
    return {
        "ism":        [e.text for e in doc.ents if e.label_ == "PERSON"][:1],
        "kompaniya":  [e.text for e in doc.ents if e.label_ == "ORG"],
        "shahar":     [e.text for e in doc.ents if e.label_ == "GPE"],
        "sanalar":    [e.text for e in doc.ents if e.label_ == "DATE"],
        "email":      re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", matn),
        "telefon":    re.findall(r"\+?\d[\d\s\-()]{8,}\d", matn),
    }

for k, v in cv_tahlil(cv).items():
    print(f"  {k:12s} {v}")
```

---

## 5️⃣ Loyiha — Tozalash zarari o'lchagichi

**Maqsad:** Tozalash NER'ga **qancha zarar** yetkazishini **raqamda** ko'rsatish.

```python
matn = ("Apple CEO Tim Cook announced on Sept. 12, 2023 "
        "that iPhone sales rose 8% in China.")

variantlar = [
    ("XOM",              lambda s: s),
    ("kichik harf",      lambda s: s.lower()),
    ("tinish belgisiz",  lambda s: re.sub(r"[^\w\s]", "", s)),
    ("TO'LIQ tozalash",  lambda s: re.sub(r"[^\w\s]", "", s).lower()),
]

for nom, f in variantlar:
    doc = nlp(f(matn))
    print(f"  {nom:18s} {len(doc.ents):2d} ta: {[e.text for e in doc.ents]}")
```

**Natija:**

```
  XOM                 6 ta: ['Apple', 'Tim Cook', 'Sept. 12, 2023', 'iPhone', '8%', 'China']
  kichik harf         5 ta: ['apple', 'tim cook', 'sept. 12, 2023', '8%', 'china']
  tinish belgisiz     6 ta: ['Apple', 'Tim Cook', 'Sept 12 2023', 'iPhone', '8', 'China']
  TO'LIQ tozalash     5 ta: ['apple', 'tim cook', 'sept 12 2023', '8', 'china']
```

### 🔍 Har bir qatorni diqqat bilan o'qing

**① Kichik harf → `iPhone` YO'QOLDI**

```
XOM:          'iPhone'   ✅  (kichik i + katta P = mahsulot nomi)
kichik harf:  'iphone'   ❌  (endi bu oddiy so'z)
```

**② Tinish belgisiz → `8%` → `8`**

```
'8%'  PERCENT   →  '8'  CARDINAL
  ↑
Foiz belgisi ma'noni O'ZGARTIRADI
```

**③ `Tim Cook` — HAR DOIM saqlandi ✅**

```
Ikki so'zli ism kontekstda kuchli — spaCy uni
bosh harfsiz ham tanidi.
```

### 📊 Xulosa jadvali

| Tozalash | Ob'ekt | Zarar |
|---|---|---|
| **Hech nima** | **6** | — |
| `.lower()` | 5 | ❌ Mahsulot nomi yo'qoldi |
| Tinish belgisiz | 6 | ⚠️ Turi buzildi *(`8%` → `8`)* |
| **Ikkalasi** | **5** | ❌❌ **Ikkala muammo birga** |

> ## 🔑 **Bu funksiyani HAR SAFAR ishlating** — NER'ni oldindan qayta ishlashdan keyin qilishga majbur bo'lsangiz, **avval zararni o'lchang**.

---

## 6️⃣ Loyiha — Yangiliklar qidiruv tizimi

**Maqsad:** 1000 ta BBC sarlavhasidan **kim/nima** haqida yozilganini topish.

```python
bbc = pd.read_csv("data/bbc_news.csv")

def qidir(nom, n=3):
    """Nom bo'yicha sarlavhalarni topadi."""
    mos = [t for t in bbc["title"] if nom.lower() in t.lower()]
    return len(mos), mos[:n]


for nom in ["Putin", "Ukraine", "Liverpool"]:
    soni, misollar = qidir(nom)
    print(f"  {nom:12s} {soni:3d} sarlavha")
    for m in misollar:
        print(f"       - {m[:62]}")
    print()
```

**Natija:**

```
  Putin         11 sarlavha
       - Ukraine round-up: Putin defends 'necessary' invasion and Kyiv
       - War in Ukraine: Why Vladimir Putin couldn't have trained fight
       - Putin in Mariupol: What the Russian president saw on his visit

  Ukraine       54 sarlavha
       - Ukraine war: A village celebrates Russian retreat
       - Ukraine war: Silent streets in wiped out Donetsk town
       - Ukraine war: Returning to the place my father was killed

  Liverpool     15 sarlavha
       - Cody Gakpo: Liverpool agree to sign forward, say PSV Eindhoven
       - Liverpool 3-3 Brighton: Jurgen Klopp vows Reds will fight thro
       - Liverpool boss Jurgen Klopp says planning for FA Cup semi-fina
```

### ⬆️ Yaxshilash — NER bilan aqlliroq qidiruv

Yuqoridagi usul **oddiy matn qidiruvi**. NER bilan biz **ob'ekt turini** ham bilamiz:

```python
def ner_qidir(turi, n=10):
    """Berilgan turdagi barcha ob'ektlarni sanaydi."""
    doc = nlp(" ".join(bbc["title"]))
    mos = [e.text for e in doc.ents if e.label_ == turi]
    return pd.Series(mos).value_counts().head(n)

print("--- Eng ko'p tilga olingan DAVLATLAR ---")
print(ner_qidir("GPE").to_string())

print("\n--- Eng ko'p tilga olingan TASHKILOTLAR ---")
print(ner_qidir("ORG", 5).to_string())
```

> 💡 **Farqi:** oddiy qidiruv `"Liverpool"` ni **shahar** va **futbol klubi** ni ajratmaydi. NER esa `GPE` va `ORG` deb **ajratadi**.

---

## 🎓 Yakuniy vazifa

Oltita loyihani **bitta yangilik tahlil tizimiga** birlashtiring:

```
===== YANGILIK TAHLIL TIZIMI =====
1 · Matnni to'liq teglash
2 · Kim / Qayer / Qachon
3 · Janrni aniqlash
4 · Rezyume tahlili
5 · Tozalash zararini o'lchash
6 · Yangiliklarda qidirish
0 · Chiqish
Tanlang:
```

<details>
<summary>💡 Karkas</summary>

```python
def menyu():
    amallar = {
        "1": lambda: tegla(input("Matn: ")),
        "2": lambda: print(kim_qayer_qachon(input("Xabar: "))),
        "3": lambda: janr_profili(input("Matn: "), "Sizniki"),
        "6": lambda: print(qidir(input("Nom: "))),
    }
    while True:
        print("\n===== YANGILIK TAHLIL TIZIMI =====")
        print("1 · To'liq teglash    4 · Rezyume")
        print("2 · Kim/Qayer/Qachon  5 · Tozalash zarari")
        print("3 · Janr              6 · Qidirish")
        print("0 · Chiqish")
        t = input("Tanlang: ")
        if t == "0":
            print("Xayr! 👋"); break
        amallar.get(t, lambda: print("Noto'g'ri tanlov!"))()

menyu()
```

</details>

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md)
