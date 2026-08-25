# 📝 22-modul — Barcha mashqlar

> **42 ta mashq** — POS teglash va NER bo'yicha.
> Har birining yechimi **ishga tushirilgan va tekshirilgan**.

## ⚙️ Tayyorgarlik

```bash
pip install spacy pandas
python -m spacy download en_core_web_sm
```

```python
import spacy, pandas as pd, re
nlp = spacy.load("en_core_web_sm")
```

---

# A · spaCy asoslari *(1–8)*

### 🟢 Oson

**1.** Modelni yuklang va versiyasini chiqaring.

**2.** Jumladan hujjat yarating va tokenlarni sanang.

**3.** Har bir tokenning matni va POS tegini chiqaring.

**4.** `token.pos_` va `token.tag_` farqini ko'rsating.

<details>
<summary>✅ Yechimlar 1–4</summary>

```python
# 1
import spacy
print(spacy.__version__)                 # 3.8.16
nlp = spacy.load("en_core_web_sm")

# 2
doc = nlp("The quick brown fox jumps over the lazy dog.")
print(len(doc))                          # 10

# 3
for t in doc:
    print(f"{t.text:8s} {t.pos_}")
# The      DET
# quick    ADJ
# brown    ADJ
# fox      NOUN
# jumps    VERB
# over     ADP
# the      DET
# lazy     ADJ
# dog      NOUN
# .        PUNCT

# 4
for t in doc[:5]:
    print(f"{t.text:8s} pos_={t.pos_:6s} tag_={t.tag_:5s} {spacy.explain(t.tag_)}")
# The      pos_=DET    tag_=DT    determiner
# quick    pos_=ADJ    tag_=JJ    adjective (English), other noun-modifier (Chinese)
# brown    pos_=ADJ    tag_=JJ    adjective (English), other noun-modifier (Chinese)
# fox      pos_=NOUN   tag_=NN    noun, singular or mass
# jumps    pos_=VERB   tag_=VBZ   verb, 3rd person singular present
#
# 🔑 pos_ = UMUMIY teg (17 ta)    tag_ = BATAFSIL teg (50+ ta)
#    tag_ hatto FE'L ZAMONINI ham ko'rsatadi!
```

</details>

### 🟡 O'rta

**5.** Token atributlarini bir jadvalda chiqaring.

**6.** Faqat **to'xtatish so'zi bo'lmagan** tokenlarni oling.

**7.** Matnni **jumlalarga** ajrating.

**8.** Har bir tokenning **lemmasini** oling.

<details>
<summary>✅ Yechimlar 5–8</summary>

```python
doc = nlp("Apple isn't buying startups anymore, they said in 2024.")

# 5
print(f"{'TEXT':10s} {'LEMMA':10s} {'POS':7s} {'STOP':6s} {'ALPHA':6s}")
for t in doc[:6]:
    print(f"{t.text:10s} {t.lemma_:10s} {t.pos_:7s} "
          f"{str(t.is_stop):6s} {str(t.is_alpha):6s}")
# TEXT       LEMMA      POS     STOP   ALPHA
# Apple      Apple      PROPN   False  True
# is         be         AUX     True   True
# n't        not        PART    True   False
# buying     buy        VERB    False  True
# startups   startup    NOUN    False  True
# anymore    anymore    ADV     False  True

# 6
print([t.text for t in doc if not t.is_stop and not t.is_punct])
# ['Apple', 'buying', 'startups', 'anymore', 'said', '2024']

# 7
d2 = nlp("Emma went home. She was tired. Tomorrow is another day!")
for s in d2.sents:
    print("-", s.text)
# - Emma went home.
# - She was tired.
# - Tomorrow is another day!

# 8
print([(t.text, t.lemma_) for t in doc if t.pos_ == "VERB"])
# [('buying', 'buy'), ('said', 'say')]
```

</details>

---

# B · POS teglash *(9–18)*

### 🟢 Oson

**9.** Matndagi barcha **otlarni** chiqaring.

**10.** Barcha **fe'llarni** chiqaring.

**11.** POS teglar taqsimotini hisoblang.

<details>
<summary>✅ Yechimlar 9–11</summary>

```python
matn = ("The talented young pianist played beautiful music while "
        "the excited audience listened quietly in the old concert hall.")
doc = nlp(matn)

# 9
print([t.text for t in doc if t.pos_ == "NOUN"])
# ['pianist', 'music', 'audience', 'concert', 'hall']

# 10
print([t.text for t in doc if t.pos_ == "VERB"])
# ['played', 'listened']

# 11
print(pd.Series([t.pos_ for t in doc]).value_counts().to_string())
# ADJ      5
# NOUN     5
# DET      3
# VERB     2
# SCONJ    1
# ADV      1
# ADP      1
# PUNCT    1
```

</details>

### 🟡 O'rta

**12.** Matndagi **sifat foizini** hisoblang.

**13.** POS teglarni **DataFrame** ga o'tkazing va saralang.

**14.** Har bir **fe'l** uchun uning **egasi** (subject) ni toping.

**15.** Faqat **ADJ + NOUN** juftlarini toping.

<details>
<summary>✅ Yechimlar 12–15</summary>

```python
# 12
sozlar = [t for t in doc if not t.is_punct]
adj = len([t for t in sozlar if t.pos_ == "ADJ"])
print(f"{adj}/{len(sozlar)} = {round(adj/len(sozlar)*100)}% sifat")
# 5/18 = 28% sifat
# 🔑 28% — JUDA yuqori. Bu badiiy/tasvirlovchi matn.

# 13
pos_df = pd.DataFrame([{"token": t.text, "pos_tag": t.pos_} for t in doc])
c = (pos_df.groupby(["token", "pos_tag"]).size()
           .reset_index(name="counts")
           .sort_values(by="counts", ascending=False))
print(c.head(3).to_string(index=False))
# token pos_tag  counts
#   the     DET       3

# 14 — SINTAKTIK BOG'LANISH
for t in doc:
    if t.pos_ == "VERB":
        egasi = [c.text for c in t.children if c.dep_ == "nsubj"]
        print(f"{t.text:10s} ← ega: {egasi}")
# played     ← ega: ['pianist']
# listened   ← ega: ['audience']

# 15 — SIFAT + OT juftlari
juftlar = [(doc[i].text, doc[i+1].text)
           for i in range(len(doc)-1)
           if doc[i].pos_ == "ADJ" and doc[i+1].pos_ == "NOUN"]
print(juftlar)
# [('young', 'pianist'), ('beautiful', 'music'),
#  ('excited', 'audience'), ('old', 'concert')]
# ⚠️ ('old', 'concert') — "old concert hall" da asosiy ot "hall",
#    lekin bu sodda usul faqat QO'SHNI juftlarni oladi.
```

</details>

### 🔴 Qiyin

**16.** `"Emma"` matnida eng ko'p uchraydigan 5 ta **otni** toping.

**17.** Matndan faqat **otlar va fe'llarni** qoldiring *(mavzuni siqish)*.

**18.** Bir xil so'z **turli teglar** olgan holatlarni toping.

<details>
<summary>✅ Yechimlar 16–18</summary>

```python
with open("data/emma.txt", encoding="utf-8") as f:
    emma = f.read().strip()
d = nlp(emma)
df = pd.DataFrame([{"token": t.text, "pos_tag": t.pos_} for t in d])
cc = (df.groupby(["token", "pos_tag"]).size()
        .reset_index(name="counts")
        .sort_values(by="counts", ascending=False))

# 16
print(cc[cc.pos_tag == "NOUN"][:5].to_string(index=False))
#     token pos_tag  counts
# governess    NOUN       3
#    friend    NOUN       3
#     years    NOUN       2
# daughters    NOUN       2
#      emma    NOUN       2

# 17 — MAVZUNI SIQISH
muhim = [t.text for t in d if t.pos_ in ("NOUN", "PROPN", "VERB")]
print(len(d), "→", len(muhim), "token")
print(" ".join(muhim[:18]))
# 214 → 71 token
# emma woodhouse home disposition seemed unite blessings existence lived years
# world distress vex daughters father consequence sisters marriage
#
# 🔑 67% token o'chdi, lekin MA'NO SAQLANDI!

# 18 — BIR XIL SO'Z, TURLI TEG
kop = cc.groupby("token").size()
print(kop[kop > 1].index.tolist())
# ['as', 'emma', 'miss', 'more']

for w in ["emma", "more", "as"]:
    print(f"{w:8s} →", cc[cc.token == w][["pos_tag", "counts"]]
                        .to_dict("records"))
# emma     → [{'pos_tag': 'NOUN', 'counts': 2}, {'pos_tag': 'PROPN', 'counts': 1}]
# more     → [{'pos_tag': 'ADJ', 'counts': 1}, {'pos_tag': 'ADV', 'counts': 1}]
# as       → [{'pos_tag': 'ADP', 'counts': 2}, {'pos_tag': 'SCONJ', 'counts': 1}]
#
# 🔑 "more" ADJ ("more than") va ADV ("more the intimacy")
#    "as" ADP ("as a governess") va SCONJ ("as friend and friend")
#    Bir xil so'z — BOSHQA VAZIFA. Faqat POS teglash buni ajratadi.
```

</details>

---

# C · NER *(19–30)*

### 🟢 Oson

**19.** Matndagi barcha ob'ektlarni chiqaring.

**20.** Faqat `PERSON` larni oling.

**21.** Yorliq taqsimotini hisoblang.

**22.** `spacy.explain()` bilan yorliq ma'nosini bilib oling.

<details>
<summary>✅ Yechimlar 19–22</summary>

```python
matn = ("Microsoft acquired GitHub for $7.5 billion in 2018. "
        "Satya Nadella announced it from Seattle. "
        "About 28% of developers use it daily.")
doc = nlp(matn)

# 19
for e in doc.ents:
    print(f"{e.text:18s} {e.label_}")
# Microsoft          ORG
# GitHub             ORG
# $7.5 billion       MONEY
# 2018               DATE
# Satya Nadella      PERSON
# Seattle            GPE
# About 28%          PERCENT
# daily              DATE

# 20
print([e.text for e in doc.ents if e.label_ == "PERSON"])
# ['Satya Nadella']

# 21
print(pd.Series([e.label_ for e in doc.ents]).value_counts().to_string())
# ORG        2
# DATE       2
# MONEY      1
# PERSON     1
# GPE        1
# PERCENT    1

# 22
for l in ["MONEY", "PERCENT", "FAC", "LAW", "LANGUAGE", "QUANTITY"]:
    print(f"{l:10s} {spacy.explain(l)}")
# MONEY      Monetary values, including unit
# PERCENT    Percentage, including "%"
# FAC        Buildings, airports, highways, bridges, etc.
# LAW        Named documents made into laws.
# LANGUAGE   Any named language
# QUANTITY   Measurements, as of weight or distance
```

</details>

### 🟡 O'rta

**23.** Ob'ektning matndagi **o'rnini** chiqaring.

**24.** Ob'ektlarni yorliq bo'yicha **guruhlang**.

**25.** `displacy` bilan HTML yarating.

**26.** Ob'ekt **nechta tokendan** iborat?

<details>
<summary>✅ Yechimlar 23–26</summary>

```python
# 23
for e in list(doc.ents)[:4]:
    print(f"{e.text:18s} [{e.start_char:3d}:{e.end_char:3d}]  "
          f"tokenlar {e.start}–{e.end}")
# Microsoft          [  0:  9]  tokenlar 0–1
# GitHub             [ 19: 25]  tokenlar 2–3
# $7.5 billion       [ 30: 42]  tokenlar 4–7
# 2018               [ 46: 50]  tokenlar 8–9

# 24
from collections import defaultdict
guruh = defaultdict(list)
for e in doc.ents:
    guruh[e.label_].append(e.text)
for k, v in sorted(guruh.items()):
    print(f"  {k:10s} {v}")
#   DATE       ['2018', 'daily']
#   GPE        ['Seattle']
#   MONEY      ['$7.5 billion']
#   ORG        ['Microsoft', 'GitHub']
#   PERCENT    ['About 28%']
#   PERSON     ['Satya Nadella']

# 25
from spacy import displacy
html = displacy.render(doc, style="ent", page=True)
with open("entities.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Saqlandi ✅ — brauzerda oching")

# 26
for e in doc.ents:
    print(f"{e.text:18s} {len(e):2d} token")
# Microsoft           1 token
# GitHub              1 token
# $7.5 billion        3 token     ⭐ "$" + "7.5" + "billion"
# 2018                1 token
# Satya Nadella       2 token     ⭐
# Seattle             1 token
# About 28%           3 token     ⭐ "About" + "28" + "%"
# daily               1 token
```

</details>

### 🔴 Qiyin

**27.** NER **xatolarini** toping.

**28.** Bir xil ob'ekt **turli yorliq** olgan holatlarni toping.

**29.** Ob'ektlarni **kontekst** bilan chiqaring.

**30.** Matndagi ob'ektlarni **niqoblang** *(anonimlashtirish)*.

<details>
<summary>✅ Yechimlar 27–30</summary>

```python
with open("data/google.txt", encoding="utf-8") as f:
    g = f.read().strip()
gd = nlp(g)

# 27 — XATOLARNI TOPISH
for e in gd.ents:
    if e.label_ in ("WORK_OF_ART", "ORG") and len(e.text) <= 4:
        print(f"⚠️ {e.text:8s} {e.label_}  ← shubhali!")
# ⚠️ PhD      WORK_OF_ART  ← shubhali!
# ⚠️ IPO      ORG  ← shubhali!
#
# 🔑 QISQA (≤4 harf) ob'ektlar ko'pincha XATO. Qisqartmalar spaCy'ni chalg'itadi.

# 28 — BIR XIL SO'Z, TURLI YORLIQ
e_df = pd.DataFrame([{"e": x.text, "l": x.label_} for x in gd.ents])
kop = e_df.groupby("e")["l"].nunique()
print(kop[kop > 1].index.tolist())      # ['Alphabet']
print(e_df[e_df.e == "Alphabet"]["l"].value_counts().to_dict())
# {'ORG': 2, 'GPE': 2}
# ❌ "Alphabet" 2 marta ORG, 2 marta GPE — BIR XIL SO'Z, IKKI XIL TEG.
#    NER BARQAROR EMAS!

# 29 — KONTEKST BILAN
for e in list(gd.ents)[:4]:
    b = max(0, e.start_char - 25)
    o = min(len(g), e.end_char + 25)
    print(f"{e.label_:8s} ...{g[b:o]}...")
# ORG      ...Google was founded on September...
# DATE     ...Google was founded on September 4, 1998, by computer scientists ...
# PERSON   ..., by computer scientists Larry Page and Sergey Brin while th...
# PERSON   ...cientists Larry Page and Sergey Brin while they were PhD stud...

# 30 — ANONIMLASHTIRISH ⭐ (GDPR uchun haqiqiy vazifa!)
def niqobla(matn, turlar=("PERSON", "GPE", "ORG")):
    d = nlp(matn)
    natija = matn
    for e in reversed(d.ents):          # ⭐ TESKARI — indekslar buzilmasin
        if e.label_ in turlar:
            natija = natija[:e.start_char] + f"[{e.label_}]" + natija[e.end_char:]
    return natija

print(niqobla("Larry Page founded Google in California with Sergey Brin."))
# [PERSON] founded [ORG] in [GPE] with [PERSON].
#
# 💡 Nima uchun reversed()? Chunki matnni almashtirsak uzunligi
#    o'zgaradi va KEYINGI ob'ektlarning indekslari SURILADI.
#    Oxiridan boshlasak — bu muammo YO'Q.
```

</details>

---

# D · Amaliy tahlil *(31–42)*

### 🟡 O'rta

**31.** BBC ma'lumotini yuklang va sarlavhalar sonini chiqaring.

**32.** Barcha sarlavhalardan ob'ektlarni oling.

**33.** Eng ko'p tilga olingan **davlatni** toping.

**34.** Eng ko'p tilga olingan **odamni** toping.

<details>
<summary>✅ Yechimlar 31–34</summary>

```python
bbc = pd.read_csv("data/bbc_news.csv")
doc = nlp(" ".join(bbc["title"]))

# 31
print(len(bbc), "sarlavha")             # 1000 sarlavha

# 32
print(len(doc.ents), "ta ob'ekt")       # 1673 ta ob'ekt

# 33
gpe = pd.Series([e.text for e in doc.ents if e.label_ == "GPE"])
print(gpe.value_counts().head(5).to_string())
# Ukraine    47
# UK         36
# England    32
# US         19
# France     12

# 34
per = pd.Series([e.text for e in doc.ents if e.label_ == "PERSON"])
print(per.value_counts().head(5).to_string())
# Covid            9
# Queen            8
# Putin            8
# Liz Truss        6
# Boris Johnson    6
# ⚠️ "Covid" birinchi o'rinda — lekin bu ODAM EMAS. spaCy xatosi!
```

</details>

**35.** Har bir POS teg uchun eng ko'p so'zni toping.

**36.** Sarlavhalarning o'rtacha uzunligini hisoblang.

**37.** `?` bilan tugaydigan sarlavhalarni sanang.

<details>
<summary>✅ Yechimlar 35–37</summary>

```python
# 35
pdf = pd.DataFrame([{"token": t.text.lower(), "pos": t.pos_}
                    for t in doc if not t.is_punct])
c = (pdf.groupby(["token", "pos"]).size()
        .reset_index(name="n").sort_values("n", ascending=False))
for teg in ["NOUN", "VERB", "ADJ", "PROPN"]:
    top = c[c.pos == teg].iloc[0]
    print(f"{teg:7s} {top.token:10s} {top.n}")
# NOUN    war        34
# VERB    says       30
# ADJ     new        30
# PROPN   ukraine    55

# 36
uz = bbc["title"].str.split().str.len()
print("O'rtacha:", round(uz.mean(), 1), "so'z")
print("Eng qisqa:", uz.min(), " Eng uzun:", uz.max())
# O'rtacha: 10.0 so'z
# Eng qisqa: 3  Eng uzun: 18

# 37
savol = bbc[bbc["title"].str.strip().str.endswith("?")]
print(len(savol), "savol sarlavha")
print(savol["title"].head(3).to_list())
# 113 savol sarlavha
# 🔑 Har 9-sarlavha SAVOL! Bu — BBC'ning o'quvchini jalb qilish usuli.
```

</details>

### 🔴 Qiyin

**38.** Sport va siyosat sarlavhalarining **POS profilini** solishtiring.

**39.** Qaysi **odam** qaysi **davlat** bilan birga tilga olinadi?

**40.** Har oyda qaysi mavzu hukmron bo'lgan?

**41.** NER natijasidan **"bilimlar grafi"** yarating.

**42.** Xato teglangan ob'ektlarni **avtomatik** aniqlang.

<details>
<summary>✅ Yechimlar 38–42</summary>

```python
# 38
def profil(sarlavhalar, nom):
    d = nlp(" ".join(sarlavhalar))
    s = [t for t in d if not t.is_punct]
    v = pd.Series([t.pos_ for t in s]).value_counts()
    f = lambda x: round(v.get(x, 0) / len(s) * 100)
    print(f"{nom:10s} ({len(sarlavhalar):3d} ta)  "
          f"PROPN {f('PROPN'):2d}%  NOUN {f('NOUN'):2d}%  "
          f"VERB {f('VERB'):2d}%  NUM {f('NUM'):2d}%")

sport = [t for t in bbc["title"] if any(w in t.lower()
         for w in ["cup", "win", "final", "league", "goal"])]
siyosat = [t for t in bbc["title"] if any(w in t.lower()
           for w in ["minister", "government", "party", "vote", "war"])]
profil(sport, "SPORT")
profil(siyosat, "SIYOSAT")

# SPORT      (130 ta)  PROPN 39%  NOUN 17%  VERB 10%  NUM  5%
# SIYOSAT    ( 97 ta)  PROPN 26%  NOUN 27%  VERB 12%  NUM  2%
#
# 🎯 SPORT'da PROPN 39% — jamoalar va o'yinchilar ISMLARI to'la!
#    SIYOSAT'da NOUN 27% — tushunchalar ("policy", "crisis", "plan").
#    Bir xil gazeta, ikki BUTUNLAY BOSHQA til.

# 39 — ODAM ↔ DAVLAT bog'lanishi
juftlar = []
for sarlavha in bbc["title"]:
    d = nlp(sarlavha)
    odamlar = [e.text for e in d.ents if e.label_ == "PERSON"]
    joylar  = [e.text for e in d.ents if e.label_ == "GPE"]
    for o in odamlar:
        for j in joylar:
            juftlar.append((o, j))
print(pd.Series(juftlar).value_counts().head(5).to_string())

# 40 — VAQT BO'YICHA
bbc["oy"] = pd.to_datetime(bbc["pubDate"], format="mixed",
                           utc=True).dt.to_period("M")
print(bbc["oy"].value_counts().sort_index().to_string())
# 2022-03    83
# 2022-04    80
# 2022-05    87
# ...
# 2023-03    82
# 2023-04    10
# 🔑 Ma'lumot 2022-mart – 2023-aprel oralig'ini qamrab olgan

# 41 — BILIMLAR GRAFI
graf = {}
for sarlavha in bbc["title"][:300]:
    d = nlp(sarlavha)
    ents = [(e.text, e.label_) for e in d.ents]
    for i, (a, la) in enumerate(ents):
        for b, lb in ents[i+1:]:
            k = tuple(sorted([a, b]))
            graf[k] = graf.get(k, 0) + 1
top = sorted(graf.items(), key=lambda x: -x[1])[:5]
for (a, b), n in top:
    print(f"  {a}  ←→  {b}   ({n} marta)")

# 42 — XATO TEGLARNI AVTOMATIK ANIQLASH
shubhali = []
for e in doc.ents:
    if e.label_ == "PERSON" and (
        e.text.lower() in {"covid", "quiz", "papers", "brexit"}
        or len(e.text) <= 2
        or not e.text[0].isupper()):
        shubhali.append((e.text, e.label_))
print(pd.Series(shubhali).value_counts().head(5).to_string())
#
# 💡 QOIDALAR:
#    · PERSON bosh harf bilan boshlanishi KERAK
#    · 2 harfdan qisqa ism BO'LMAYDI
#    · Ma'lum "qora ro'yxat" (Covid, Brexit...)
```

</details>

---

## 🏆 Yakuniy tekshiruv

Quyidagi jumla uchun **qo'lda** POS va NER natijasini yozing:

```
"Elon Musk sold 10% of Tesla shares in November 2022."
```

<details>
<summary>✅ Javob</summary>

```python
doc = nlp("Elon Musk sold 10% of Tesla shares in November 2022.")
for t in doc:
    print(f"{t.text:10s} {t.pos_:7s} {t.ent_type_ or '—'}")
```

```
Elon       PROPN   PERSON
Musk       PROPN   PERSON
sold       VERB    —
10         NUM     PERCENT
%          NOUN    PERCENT
of         ADP     —
Tesla      PROPN   ORG
shares     NOUN    —
in         ADP     —
November   PROPN   DATE
2022       NUM     DATE
.          PUNCT   —
```

**`doc.ents` esa:**

```python
print([(e.text, e.label_) for e in doc.ents])
# [('Elon Musk', 'PERSON'), ('10%', 'PERCENT'),
#  ('Tesla', 'ORG'), ('November 2022', 'DATE')]
```

### 🔑 Farqni solishtiring

| | **Token darajasi** | **`doc.ents`** |
|---|---|---|
| Ism | `Elon` + `Musk` *(2 ta)* | **`Elon Musk`** *(1 ta)* ⭐ |
| Foiz | `10` + `%` *(2 ta)* | **`10%`** *(1 ta)* ⭐ |
| Sana | `November` + `2022` *(2 ta)* | **`November 2022`** *(1 ta)* ⭐ |
| **Jami** | 7 ta teglangan token | **4 ta ob'ekt** |

</details>

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
