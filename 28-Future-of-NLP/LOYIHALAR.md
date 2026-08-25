# 🚀 28-modul mini-loyihalari

> **6 ta tayyor loyiha.** Hammasi **ishlab tekshirilgan** — nusxa oling va ishga tushiring.
>
> Bu modul nazariy, shuning uchun loyihalar — 🇺🇿 **o'zbek tilida ishlaydigan haqiqiy vositalar**.
> Bularni **o'z loyihangizda** to'g'ridan-to'g'ri ishlatishingiz mumkin.

## ⚙️ Umumiy tayyorgarlik

```python
import re
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

UZ_PATTERN = r"[\w'ʻ’]+"
UZ_STOP = stopwords.words("uzbek")
```

---

# 🇺🇿 1-loyiha. `uznlp` — o'zbek NLP asboblar to'plami

> **Maqsad:** o'zbek tilida ishlaydigan **qayta ishlatiladigan** modul yozish.
> Buni `uznlp.py` fayliga saqlang — keyingi barcha loyihalarda ishlatasiz.

```python
"""uznlp.py — o'zbek tili uchun NLP yordamchilari."""

import re
from nltk.corpus import stopwords

# ─────────────────────────────────────────────────────────
#  0. DOIMIYLAR
# ─────────────────────────────────────────────────────────

# ⭐ ENG MUHIM QATOR: apostrofni SO'Z ICHIDA saqlaydi
#    o' va g' harflari buzilmasligi uchun
TOKEN_PATTERN = r"[\w'ʻ’]+"

STOP = set(stopwords.words("uzbek"))

# Uch xil apostrof o'zbek matnlarida uchraydi — birxillashtiramiz
APOSTROFLAR = {"ʻ": "'", "’": "'", "`": "'", "‘": "'"}

KIRIL = {
    'ш': "sh", 'ч': "ch", 'ў': "o'", 'қ': "q", 'ғ': "g'", 'ҳ': "h",
    'ъ': "'", 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
    'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts',
    'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ё': 'yo',
}

QOSHIMCHALAR = [
    "larimizda", "laringizda", "larimiz", "laringiz", "larimni", "larida",
    "lardan", "larga", "larda", "larni", "larim", "laring", "lari", "lar",
    "imizda", "ingizda", "imiz", "ingiz", "sida", "siga", "sini",
    "imda", "ingda", "ida", "iga", "ini", "ning", "dan",
    "ing", "im", "si", "ni", "ga", "da",
]

# Stemmer XATO qiladigan so'zlar — kesilmasin
ISTISNO = {
    "modda", "poda", "tanga", "mening", "sening", "dala", "bola",
    "olma", "adad", "sanoat", "quyosh", "havo", "daryo", "shunda",
}


# ─────────────────────────────────────────────────────────
#  1. NORMALLASHTIRISH
# ─────────────────────────────────────────────────────────

def apostrof_birxil(matn):
    """Uch xil apostrofni bittaga keltiradi."""
    for k, v in APOSTROFLAR.items():
        matn = matn.replace(k, v)
    return matn


def kiril_lotin(matn):
    """Kirill o'zbek matnini lotinga o'giradi."""
    return "".join(KIRIL.get(c, KIRIL.get(c.lower(), c)) for c in matn)


def normallashtir(matn):
    """To'liq normallashtirish: kirill → lotin → apostrof → kichik harf."""
    return apostrof_birxil(kiril_lotin(matn)).lower()


# ─────────────────────────────────────────────────────────
#  2. TOKENIZATSIYA VA TOZALASH
# ─────────────────────────────────────────────────────────

def tokenlar(matn):
    """O'zbek tiliga mos tokenizatsiya (apostrofni saqlaydi)."""
    return re.findall(TOKEN_PATTERN, normallashtir(matn))


def stopwordsiz(sozlar):
    """To'xtatish so'zlarini olib tashlaydi."""
    return [w for w in sozlar if w not in STOP]


# ─────────────────────────────────────────────────────────
#  3. STEMMING
# ─────────────────────────────────────────────────────────

def stem(soz, min_uzunlik=2):
    """Qo'shimchalarni TAKRORAN kesadi. ⚠️ Taxminiy — istisnolarni to'ldiring."""
    if soz in ISTISNO:
        return soz
    ozgardi = True
    while ozgardi:
        ozgardi = False
        for q in QOSHIMCHALAR:
            if soz.endswith(q) and len(soz) - len(q) >= min_uzunlik:
                yangi = soz[:-len(q)]
                if yangi in ISTISNO:
                    return soz
                soz = yangi
                ozgardi = True
                break
    return soz


# ─────────────────────────────────────────────────────────
#  4. TO'LIQ QUVUR
# ─────────────────────────────────────────────────────────

def tozala(matn, stopword=True, stemming=True):
    """Bitta matnni to'liq tayyorlaydi."""
    w = tokenlar(matn)
    if stopword:
        w = stopwordsiz(w)
    if stemming:
        w = [stem(x) for x in w]
    return " ".join(w)


def tozala_hammasi(matnlar, **kw):
    """Ro'yxatdagi barcha matnlarni tayyorlaydi."""
    return [tozala(m, **kw) for m in matnlar]
```

### 🧪 Sinov

```python
matnlar = [
    "Бу китоб жуда яхши",                       # kirill
    "O'zbekiston Respublikasi go'zal davlat",   # apostrof
    "Uylarimizda mehmonlar bor edi",            # qo'shimchalar
]
for m in matnlar:
    print(f"{m}\n   → {tozala(m)}\n")
```

```
Бу китоб жуда яхши
   → kitob yaxshi

O'zbekiston Respublikasi go'zal davlat
   → o'zbekiston respublika go'zal davlat

Uylarimizda mehmonlar bor edi
   → uy mehmon bor
```

> ## ✅ **Uchala muammo ham hal bo'ldi:**
> ```
> ① kirill  →  lotin       (Бу китоб → bu kitob, keyin "bu" stopword)
> ② apostrof SAQLANDI      (o'zbekiston · go'zal — buzilmadi!)
> ③ qo'shimchalar kesildi  (Uylarimizda → uy · mehmonlar → mehmon)
> ```
>
> 💡 `Respublikasi → respublika` — `si` qo'shimchasi kesildi. To'g'ri.

> ## ✅ **Bu modul — butun darslikning eng amaliy natijasi.** Uni o'z loyihalaringizda **to'g'ridan-to'g'ri** ishlating.

---

# 🇺🇿 2-loyiha. O'zbek sentiment tasniflagichi

> **Maqsad:** o'zbek tilidagi sharhlarni **ijobiy/salbiy** ga ajratish.

```python
from sklearn.model_selection import cross_val_score

# ─── O'QUV MA'LUMOTI ───────────────────────────────────
IJOBIY = [
    "Bu kitob juda ajoyib va qiziqarli",
    "Zo'r asar, hammaga tavsiya qilaman",
    "Menga judayam yoqdi, ajoyib chiqibdi",
    "Mazmuni chuqur, tili ravon",
    "Ajoyib kitob, bir o'tirishda o'qib chiqdim",
    "Muallifga rahmat, juda foydali",
    "Sifati yaxshi, narxi arzon",
    "Qiziqarli syujet, kutilmagan yakun",
]
SALBIY = [
    "Juda zerikarli va sifatsiz kitob",
    "Vaqtimni behuda sarfladim, yomon",
    "Umuman yoqmadi, zerikarli asar",
    "Tili og'ir, tushunish qiyin",
    "Puliga arzimaydi, afsus",
    "Yarmida tashlab qo'ydim, zerikarli",
    "Sifati past, sahifalari yirtilgan",
    "Kutganimdek chiqmadi, tavsiya qilmayman",
]

X = IJOBIY + SALBIY
y = ["ijobiy"] * len(IJOBIY) + ["salbiy"] * len(SALBIY)

# ─── MODEL ─────────────────────────────────────────────
model = make_pipeline(
    TfidfVectorizer(token_pattern=UZ_PATTERN, stop_words=UZ_STOP),
    LogisticRegression(random_state=0),
)
model.fit(X, y)

# ─── CROSS-VALIDATION (26-modul saboqi!) ───────────────
ball = cross_val_score(model, X, y, cv=4)
print("CV ballari:", ball.round(3))
print("O'rtacha  :", ball.mean().round(3))

# ─── SINOV ─────────────────────────────────────────────
test = [
    "Bu asar juda ajoyib chiqibdi",
    "Sifatsiz va zerikarli kitob",
    "Hammaga tavsiya qilaman",
    "Puliga arzimaydi",
]
for t, p in zip(test, model.predict(test)):
    print(f"{p:8s} | {t}")
```

```
CV ballari: [0.5  0.75 0.75 0.5 ]
O'rtacha  : 0.625

ijobiy   | Bu asar juda ajoyib chiqibdi
salbiy   | Sifatsiz va zerikarli kitob
ijobiy   | Hammaga tavsiya qilaman
salbiy   | Puliga arzimaydi
```

> ## 🤔 **DIQQAT — bu yerda MUHIM ZIDDIYAT bor:**
> ```
> Sinovdagi 4 ta jumla  →  4/4 TO'G'RI   ✅ ajoyib!
> Cross-validation      →  0.625         ⚠️ o'rtamiyona
> ```
>
> ## 🔑 **QAYSINISIGA ISHONISH KERAK? — CROSS-VALIDATION'GA.**
>
> Sinov jumlalari **o'quv jumlalariga o'xshab** yozilgan — `ajoyib` va `zerikarli` **ikkalasida ham** bor. Shuning uchun 4/4 chiqdi. Bu — **o'zini aldash**.
>
> `cross_val_score` esa modelni **ko'rmagan** ma'lumotda sinaydi — va u **0.625** deydi.
>
> ⚠️ **Faqat "4/4 to'g'ri!" ni ko'rsatish — ALDASH bo'lardi.** Haqiqiy raqam — **0.625**.

### ⚠️ MUHIM — 26-modul saboqini UNUTMANG

```
16 ta o'quv jumlasi = JUDA KAM
      ↑
   Natija ishonchsiz bo'ladi

✅ HAQIQIY loyihada:
   · kamida 500–1000 ta sharh yig'ing
   · cross_val_score bilan tekshiring
   · DummyClassifier bilan solishtiring
```

```python
from sklearn.dummy import DummyClassifier
dummy = make_pipeline(TfidfVectorizer(token_pattern=UZ_PATTERN),
                      DummyClassifier(strategy="most_frequent"))
print("Dummy:", cross_val_score(dummy, X, y, cv=4).mean().round(3))
```

```
Dummy: 0.5
```
```
Model  0.625
Dummy  0.500
       ─────
Farq  +0.125     ←  model BIROZ o'rgandi, lekin KAM
```

> ## 🔑 **Modelingiz `Dummy` dan yaxshi bo'lmasa — u hech narsa o'rganmagan.**
>
> Bizda farq **bor**, lekin **kichik**. 16 ta jumlada boshqacha bo'lishi mumkin emas edi. **Yechim — ma'lumot, algoritm emas.**

---

# 🔬 3-loyiha. Universal shipcha detektori

> **Maqsad:** modelni o'qitishdan **OLDIN** ma'lumotdagi "arzon yechim" larni topish.
> ⭐ **Bu — 27-modulning eng qimmatli merosi.**

```python
def shipcha_topilgan(matnlar, yorliqlar, min_uchrash=10, chegara=0.90):
    """
    Bitta so'zning bo'lishi yorliqni deyarli to'liq bashorat qila oladimi?

    Agar HA bo'lsa — model shu so'zga suyanadi va TILNI o'rganmaydi.
    """
    cv = CountVectorizer(binary=True, min_df=min_uchrash)
    X = cv.fit_transform(matnlar)
    sozlar = cv.get_feature_names_out()
    y = pd.Series(list(yorliqlar))

    topilgan = []
    for i, soz in enumerate(sozlar):
        bor = np.asarray(X[:, i].todense()).ravel() == 1
        if bor.sum() < min_uchrash:
            continue
        ulush = y[bor].value_counts(normalize=True)
        if ulush.iloc[0] >= chegara:
            topilgan.append({
                "so'z": soz,
                "sinf": ulush.index[0],
                "aniqlik": round(float(ulush.iloc[0]), 3),
                "uchraydi": int(bor.sum()),
            })
    if not topilgan:
        return pd.DataFrame(columns=["so'z", "sinf", "aniqlik", "uchraydi"])
    return pd.DataFrame(topilgan).sort_values(
        ["aniqlik", "uchraydi"], ascending=False).reset_index(drop=True)


def hisobot(matnlar, yorliqlar, **kw):
    """Chiroyli hisobot chiqaradi."""
    n = shipcha_topilgan(matnlar, yorliqlar, **kw)
    if len(n) == 0:
        print("✅ Shipcha topilmadi — ma'lumot toza ko'rinadi.")
        return n
    print(f"⚠️  {len(n)} ta SHIPCHA topildi!\n")
    print(n.head(15).to_string(index=False))
    print(f"\n🔑 Eng xavflisi: '{n.iloc[0]['so\'z']}' — "
          f"{n.iloc[0]['aniqlik']:.1%} aniqlik bilan "
          f"'{n.iloc[0]['sinf']}' ni bashorat qiladi.")
    return n
```

### 🧪 27-modul ma'lumotida

```python
data = pd.read_csv("../27-Fake-News-Case-Study/data/fake_news_data.csv")
natija = hisobot(data["text"], data["fake_or_factual"])
```

```
⚠️  39 ta SHIPCHA topildi!

    so'z         sinf  aniqlik  uchraydi
     via    Fake News      1.0        48
featured    Fake News      1.0        31
minister Factual News      1.0        27
   getty    Fake News      1.0        18
     gop    Fake News      1.0        18
  images    Fake News      1.0        18
    read    Fake News      1.0        17
   prime Factual News      1.0        16
     com    Fake News      1.0        15
     pic    Fake News      1.0        13
```

### 🔬 Topilgan shipchani SINAB ko'ring

```python
def shipcha_sinovi(matnlar, yorliqlar, soz):
    """Bitta so'zli qoida qanchalik aniq ishlaydi?"""
    bor = pd.Series(matnlar).str.lower().str.contains(soz, regex=False)
    y = pd.Series(list(yorliqlar))
    sinf = y[bor].value_counts().index[0]
    boshqa = y[~bor].value_counts().index[0]
    bashorat = np.where(bor, sinf, boshqa)
    return (bashorat == y.values).mean()

for s in ["reuters", "via", "getty"]:
    print(f"'{s}' qoidasi → {shipcha_sinovi(data['text'], data['fake_or_factual'], s):.1%}")
```

```
'reuters' qoidasi → 99.5%
'via' qoidasi     → 74.7%
'getty' qoidasi   → 59.6%
```

> ## 🤔 **KUTILMAGAN NATIJA — `via` ning aniqligi 100% edi-ku?**
>
> ```
> jadvalda:  via  →  aniqlik 1.0    (uchraydi 48)
> qoida esa: via  →  74.7%
> ```
>
> ## 🔑 **Bu ikki XIL narsani o'lchaydi:**
> ```
> "aniqlik" (jadval)  =  "via" BOR bo'lgan 48 ta hujjatning nechtasi Fake?
>                        →  48/48  =  100%   ✅ MUKAMMAL
>
> "qoida" (sinov)     =  BUTUN to'plamda nechta to'g'ri chiqdi?
>                        →  "via" YO'Q bo'lgan 150 ta hujjatni ham
>                           bashorat qilish kerak  →  ko'p xato
>
> reuters:  101 ta hujjatni qamraydi  →  99.5%   ⚠️ ENG XAVFLI
> via    :   48 ta hujjatni qamraydi  →  74.7%
> getty  :   18 ta hujjatni qamraydi  →  59.6%
> ```
>
> ## 💡 **SABOQ: shipchaning xavfi = ANIQLIK × QAMROV.** Yuqori aniqlik + **katta qamrov** = haqiqiy xavf. Shuning uchun jadvaldagi `uchraydi` ustuniga **doim** qarang.

> ## ⚠️ **Agar bitta so'z 95%+ aniqlik bersa — sizning ML modelingiz KERAK EMAS.**
> Bu **model yaxshi** degani emas, **ma'lumot buzuq** degani.

---

# 📊 4-loyiha. NLP quvuri ablatsiya paneli

> **Maqsad:** har bir tozalash bosqichining **haqiqiy** hissasini o'lchash.
> ⚠️ Ko'p odam bosqichlarni "shunchaki qo'shadi" — kimdir ularni **o'lchashi** kerak.

```python
from itertools import product
from sklearn.model_selection import cross_val_score


def ablatsiya(matnlar, yorliqlar, cv_soni=4):
    """Har bir bosqichni yoqib/o'chirib, natijaga ta'sirini o'lchaydi."""
    natijalar = []
    for apostrof, stopword, stemming in product([False, True], repeat=3):
        tayyor = [
            tozala(m, stopword=stopword, stemming=stemming)
            for m in matnlar
        ]
        vec = TfidfVectorizer(
            token_pattern=UZ_PATTERN if apostrof else r"(?u)\b\w\w+\b")
        model = make_pipeline(vec, LogisticRegression(random_state=0))
        ball = cross_val_score(model, tayyor, yorliqlar, cv=cv_soni).mean()
        natijalar.append({
            "apostrof": "✅" if apostrof else "❌",
            "stopword": "✅" if stopword else "❌",
            "stemming": "✅" if stemming else "❌",
            "ustunlar": len(vec.fit(tayyor).get_feature_names_out()),
            "ball": round(float(ball), 3),
        })
    return pd.DataFrame(natijalar).sort_values("ball", ascending=False)


jadval = ablatsiya(X, y)
print(jadval.to_string(index=False))
print(f"\n🏆 Eng yaxshi: {jadval.iloc[0]['ball']}")
print(f"📉 Eng yomon : {jadval.iloc[-1]['ball']}")
```

```
apostrof stopword stemming  ustunlar   ball
       ❌       ✅       ✅        52  0.688
       ❌       ✅       ❌        52  0.688
       ✅       ✅       ❌        50  0.625
       ✅       ✅       ✅        50  0.625
       ❌       ❌       ❌        58  0.562
       ❌       ❌       ✅        58  0.562
       ✅       ❌       ✅        56  0.562
       ✅       ❌       ❌        56  0.562

🏆 Eng yaxshi: 0.688
📉 Eng yomon : 0.562
```

### 😲 UCHTA KUTILMAGAN NATIJA

**① `stopword` — YAGONA haqiqiy foyda**

```
stopword ✅  →  0.688 / 0.625      (yuqori 4 qator)
stopword ❌  →  0.562              (quyi 4 qator)
                     ↑
        +0.126 — eng katta ta'sir
```

**② `stemming` — MUTLAQO HECH NARSA bermadi**

```
0.688 vs 0.688   ·   0.625 vs 0.625   ·   0.562 vs 0.562
                       ↑
     stemming YOQILGAN va O'CHIRILGAN — BALL BIR XIL
```
Sabab: bu 16 ta jumlada `uy`/`uyim` kabi **bir so'zning turli shakllari deyarli yo'q**. Stemmer kesadigan narsa yo'q — demak foyda ham yo'q.

**③ ⚠️ `apostrof` — natijani YOMONLASHTIRDI!**

```
apostrof ❌  →  0.688      🏆
apostrof ✅  →  0.625
                  ↑
            −0.063  (?!)
```

> ## 🤔 **AXIR APOSTROF NAQSHINI QO'SHISH TO'G'RI EDI-KU?**
>
> ## ✅ **Ha, TO'G'RI. Lekin bu O'LCHOV ISHONCHSIZ.**
>
> ```
> 16 ta jumla, 4 ta cv-bo'lak  →  har bo'lakda ATIGI 4 ta misol
>                                       ↑
>                          BITTA xato = 25% farq!
>
> 0.688 va 0.625 orasidagi farq = 0.063
> Bitta misolning qiymati        = 0.0625
>                                       ↑
>              FARQ = ATIGI BITTA MISOL. Bu — SHOVQIN.
> ```
>
> ## 🔑 **Bu — 26-MODUL SABOG'INING TAKRORI.** O'sha yerda `random_state` ni o'zgartirish aniqlikni **0.17 dan 0.83 gacha** sakratgan edi. Bu yerda ham xuddi shunday.
>
> ## ⚠️ **XATO XULOSA:** *"apostrof naqshi zararli ekan, olib tashlayman"*
> ## ✅ **TO'G'RI XULOSA:** *"16 ta misolda hech narsani o'lchab bo'lmaydi. 500+ misol yig'ib, qaytadan o'lchayman."*
>
> 💡 Apostrof naqshi **to'g'ri** — M16–M18 buni **bir jumlada aniq** ko'rsatgan edi *(`O'zbekiston` → `zbekiston`)*. Bu — **fakt**, ablatsiya esa — **shovqinli o'lchov**. Fakt yutadi.

### 📖 Natijani QANDAY o'qish kerak

```
① Eng yuqori ballni bering — lekin FARQ KATTAMI?
     0.875 vs 0.870  →  farq YO'Q (shovqin)
     0.875 vs 0.700  →  farq BOR

② Kam ma'lumotda ballar SAKRAYDI
     16 ta jumla  →  natijaga ISHONMANG
     500+ misol   →  endi ishonish mumkin

③ Har bosqich USTUNLARNI kamaytirishi kerak
     kamaytirmasa — u ishlamayapti

🔑 26-MODUL SABOQI: stop_words ingliz sentimentini BUZGAN edi.
   O'zbekchada ham shunday bo'lishi mumkin — TEKSHIRING.
```

> ## 💡 **Bu — professional ML ishining standarti.** "Men shunday qildim, chunki hamma shunday qiladi" emas, balki **"Men o'lchadim, mana natija"**.

---

# 🌍 5-loyiha. Til imkoniyatlari xaritasi

> **Maqsad:** istalgan til uchun **qaysi NLP vositalari mavjudligini** avtomatik tekshirish.
> Yangi loyiha boshlaganda **birinchi** ishlatadigan skriptingiz.

```python
import importlib


def til_xaritasi(til_nomi, spacy_kodi=None, namuna=None):
    """Berilgan til uchun qaysi NLP vositalari mavjudligini tekshiradi."""
    hisobot = {"til": til_nomi}

    # ① NLTK to'xtatish so'zlari
    try:
        from nltk.corpus import stopwords
        sw = stopwords.words(til_nomi.lower())
        hisobot["stopwords"] = f"✅ {len(sw)} ta"
    except Exception:
        hisobot["stopwords"] = "❌ yo'q"

    # ② spaCy tili
    if spacy_kodi:
        try:
            import os
            from spacy.lang import __path__ as lp
            bor = spacy_kodi in os.listdir(lp[0])
            hisobot["spacy_til"] = "✅ bor" if bor else "❌ yo'q"
        except Exception:
            hisobot["spacy_til"] = "❓"
    else:
        hisobot["spacy_til"] = "—"

    # ③ spaCy oldindan o'qitilgan model
    try:
        import spacy
        spacy.load(f"{spacy_kodi}_core_news_sm")
        hisobot["spacy_model"] = "✅ bor"
    except Exception:
        hisobot["spacy_model"] = "❌ yo'q"

    # ④ NLTK stemmer
    try:
        from nltk.stem import SnowballStemmer
        bor = til_nomi.lower() in SnowballStemmer.languages
        hisobot["stemmer"] = "✅ bor" if bor else "❌ yo'q"
    except Exception:
        hisobot["stemmer"] = "❓"

    # ⑤ Tildan MUSTAQIL vositalar — DOIM ishlaydi
    hisobot["vektorlash"] = "✅ doim"
    hisobot["tasniflash"] = "✅ doim"
    return hisobot


tillar = [
    ("uzbek", "uz"), ("turkish", "tr"), ("kazakh", "kk"),
    ("azerbaijani", "az"), ("tajik", "tg"), ("russian", "ru"),
    ("english", "en"),
]
print(pd.DataFrame([til_xaritasi(t, k) for t, k in tillar]).to_string(index=False))
```

### 📖 Xaritani qanday o'qish

```
✅ stopwords BOR      →  21-modul ISHLAYDI
✅ vektorlash         →  24, 25, 26-modullar ISHLAYDI  (DOIM!)
❌ spacy_model YO'Q   →  22-modul (POS/NER) ishlamaydi
❌ stemmer YO'Q       →  o'zingiz yozasiz (1-loyihaga qarang)

🔑 ASOSIY XULOSA:
   Oldindan o'qitilgan MODEL talab qiladigan narsalar — YO'Q
   Ma'lumotdan O'RGANADIGAN narsalar — HAMMASI ISHLAYDI
```

> ## 💡 **Yangi tilda ishlashni boshlaganingizda — BIRINCHI shu skriptni ishga tushiring.** U sizga **nima mumkin** va **nima yo'q** ekanini 5 soniyada aytadi.

---

# 🎓 6-loyiha. Yakuniy loyiha — o'zbek matn tahlilchisi

> **Maqsad:** 20–28-modullardagi **hammasini** bitta ishlaydigan vositaga jamlash.

```python
class UzMatnTahlilchi:
    """O'zbek tilidagi matnlar to'plamini to'liq tahlil qiladi."""

    def __init__(self, matnlar, yorliqlar=None):
        self.xom = list(matnlar)
        self.y = list(yorliqlar) if yorliqlar is not None else None
        self.toza = tozala_hammasi(self.xom)

    # ── 21-MODUL: tozalash statistikasi ───────────────
    def tozalash_hisoboti(self):
        xom_t = sum(len(re.findall(UZ_PATTERN, m.lower())) for m in self.xom)
        toza_t = sum(len(m.split()) for m in self.toza)
        return {
            "hujjatlar": len(self.xom),
            "xom tokenlar": xom_t,
            "toza tokenlar": toza_t,
            "qisqardi": f"{100 * (1 - toza_t / xom_t):.1f}%",
        }

    # ── 24-MODUL: vektorlashtirish ────────────────────
    def lugat_hisoboti(self):
        oddiy = CountVectorizer().fit(self.xom)
        uzcha = CountVectorizer(token_pattern=UZ_PATTERN).fit(self.xom)
        tozacha = CountVectorizer(token_pattern=UZ_PATTERN).fit(self.toza)
        return {
            "① standart tokenizator": len(oddiy.get_feature_names_out()),
            "② o'zbek tokenizator": len(uzcha.get_feature_names_out()),
            "③ + tozalangan": len(tozacha.get_feature_names_out()),
        }

    # ── 24-MODUL: eng muhim so'zlar ───────────────────
    def top_sozlar(self, n=10):
        cv = CountVectorizer(token_pattern=UZ_PATTERN)
        X = cv.fit_transform(self.toza)
        sanoq = np.asarray(X.sum(axis=0)).ravel()
        idx = sanoq.argsort()[-n:][::-1]
        return pd.DataFrame({
            "so'z": cv.get_feature_names_out()[idx],
            "soni": sanoq[idx],
        })

    # ── 26-MODUL: tasniflagich ────────────────────────
    def model_qur(self):
        if self.y is None:
            raise ValueError("Yorliqlar berilmagan")
        from sklearn.model_selection import cross_val_score
        from sklearn.dummy import DummyClassifier

        model = make_pipeline(
            TfidfVectorizer(token_pattern=UZ_PATTERN),
            LogisticRegression(random_state=0))
        dummy = make_pipeline(
            TfidfVectorizer(token_pattern=UZ_PATTERN),
            DummyClassifier(strategy="most_frequent"))

        cv_n = min(4, min(pd.Series(self.y).value_counts()))
        m_ball = cross_val_score(model, self.toza, self.y, cv=cv_n).mean()
        d_ball = cross_val_score(dummy, self.toza, self.y, cv=cv_n).mean()
        model.fit(self.toza, self.y)
        self.model = model
        return {"model": round(float(m_ball), 3),
                "dummy": round(float(d_ball), 3),
                "farq": round(float(m_ball - d_ball), 3)}

    # ── 27-MODUL: shipcha tekshiruvi ──────────────────
    def shipcha_tekshiruvi(self, min_uchrash=2, chegara=0.95):
        if self.y is None:
            return None
        return shipcha_topilgan(self.toza, self.y, min_uchrash, chegara)

    # ── TO'LIQ HISOBOT ────────────────────────────────
    def hisobot(self):
        print("=" * 58)
        print("  🇺🇿  O'ZBEK MATN TAHLILI")
        print("=" * 58)

        print("\n① TOZALASH (21-modul)")
        for k, v in self.tozalash_hisoboti().items():
            print(f"   {k:16s}: {v}")

        print("\n② LUG'AT HAJMI (24-modul)")
        for k, v in self.lugat_hisoboti().items():
            print(f"   {k:24s}: {v}")

        print("\n③ ENG CHASTOTALI SO'ZLAR")
        print(self.top_sozlar(8).to_string(index=False))

        if self.y is not None:
            print("\n④ TASNIFLAGICH (26-modul)")
            for k, v in self.model_qur().items():
                print(f"   {k:8s}: {v}")

            print("\n⑤ SHIPCHA TEKSHIRUVI (27-modul)")
            sh = self.shipcha_tekshiruvi()
            if sh is None or len(sh) == 0:
                print("   ✅ Shipcha topilmadi")
            else:
                print(f"   ⚠️  {len(sh)} ta shipcha:")
                print(sh.head(5).to_string(index=False))
        print("\n" + "=" * 58)
```

### 🧪 Ishlatish

```python
tahlil = UzMatnTahlilchi(X, y)
tahlil.hisobot()

# Yangi matnni bashorat qilish
print(tahlil.model.predict(tozala_hammasi(["Bu kitob juda ajoyib"])))
```

```
==========================================================
  🇺🇿  O'ZBEK MATN TAHLILI
==========================================================

① TOZALASH (21-modul)
   hujjatlar       : 16
   xom tokenlar    : 70
   toza tokenlar   : 61
   qisqardi        : 12.9%

② LUG'AT HAJMI (24-modul)
   ① standart tokenizator  : 58
   ② o'zbek tokenizator    : 56
   ③ + tozalangan          : 50

③ ENG CHASTOTALI SO'ZLAR
     so'z  soni
zerikarli     3
   ajoyib     3
    kitob     3
   sifati     2
  tavsiya     2
     tili     2
     asar     2
qiziqarli     2

④ TASNIFLAGICH (26-modul)
   model   : 0.625
   dummy   : 0.5
   farq    : 0.125

⑤ SHIPCHA TEKSHIRUVI (27-modul)
   ⚠️  3 ta shipcha:
     so'z   sinf  aniqlik  uchraydi
   ajoyib ijobiy      1.0         3
zerikarli salbiy      1.0         3
qiziqarli ijobiy      1.0         2
==========================================================
['ijobiy']
```

### 🤔 ⑤-BO'LIMGA DIQQAT — DETEKTOR "SHIPCHA" TOPDI. LEKIN ULAR SHIPCHAMI?

```
ajoyib     →  100% ijobiy
zerikarli  →  100% salbiy
qiziqarli  →  100% ijobiy
```

> ## ❌ **BULAR SHIPCHA EMAS!** Bular — **haqiqiy sentiment so'zlari**. Model aynan shularni o'rganishi **KERAK**.
>
> Solishtiring:
> ```
> 27-MODUL:  "reuters"  →  NASHRIYOT nomi   ❌ tilga aloqasi YO'Q  →  SHIPCHA
> BU YERDA:  "ajoyib"   →  MAQTOV so'zi     ✅ aynan kerakli signal →  EMAS
> ```

> ## 🔑 **ENG MUHIM SABOQ: detektor faqat KORRELYATSIYANI topadi.**
>
> ## **"Bu shipchami yoki haqiqiy signalmi?" degan savolga — FAQAT ODAM javob bera oladi.**
>
> Detektor sizga **qayerga qarash kerakligini** aytadi. **Qarorni siz qabul qilasiz.** Avtomatlashtirib bo'lmaydigan qadam — aynan shu.

⚠️ Yana bir nozik joy: `uchraydi` ustuni **3, 3, 2** — juda kichik. 16 ta hujjatda `min_uchrash=2` qo'yishga majbur bo'ldik. **Haqiqiy ma'lumotda `min_uchrash=10` dan pastga tushmang.**

> ## 🏆 **TABRIKLAYMIZ!**
>
> Siz **20–28-modullardagi hamma narsani** bitta ishlaydigan vositaga jamladingiz — va u **o'zbek tilida** ishlaydi.
>
> ```
> 21-modul  →  tozalash_hisoboti()
> 24-modul  →  lugat_hisoboti(), top_sozlar()
> 26-modul  →  model_qur()  + DummyClassifier taqqoslash
> 27-modul  →  shipcha_tekshiruvi()
> 28-modul  →  o'zbek tili moslashuvi
> ```

---

## 🎯 Keyingi qadamingiz

```
① O'z ma'lumotingizni yig'ing
     · Telegram kanal sharhlari
     · Onlayn do'kon fikrlari
     · Yangiliklar sayti maqolalari
     · Ijtimoiy tarmoq postlari

     ⚠️ KAMIDA 500 ta misol (26-modul saboqi!)

② uznlp.py ni ishlating

③ Shipcha detektorini ishga tushiring — MODEL O'QITISHDAN OLDIN

④ Ablatsiya qiling — qaysi bosqich haqiqatan yordam beryapti?

⑤ Natijani ULASHING — o'zbek NLP hamjamiyati SIZGA muhtoj
```

> ## 🇺🇿 **Dunyoda 7000+ til bor, NLP ularning ~1% ini yaxshi qo'llab-quvvatlaydi.**
>
> ## **O'zbek tili shu ro'yxatga kirishi — SIZGA bog'liq.**

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md) · ➡️ [29-modul: LLM'ga kirish](../29-Introduction-to-LLMs/README.md)
