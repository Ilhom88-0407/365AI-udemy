# 📝 28-modul mashqlari

> **42 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> Bu modul **nazariy**, shuning uchun mashqlarning **yarmidan ko'pi** — 🇺🇿 **o'zbek tilida amaliyot**.
> Bu — butun darslikdagi eng qimmatli amaliy blok.

## ⚙️ Tayyorgarlik

```python
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.decomposition import LatentDirichletAllocation

# ⭐ O'ZBEK TILI UCHUN ENG MUHIM QATOR:
UZ = r"[\w'ʻ’]+"          # apostrofni SO'Z ICHIDA qoldiradi
uz_stop = stopwords.words("uzbek")
```

---

# 🟢 OSON *(1–15)*

### Nazariya

**M1.** Chuqur o'qitish qaysi kattaroq sohaning bir qismi?

**M2.** "Chuqur" so'zi nimani anglatadi?

**M3.** Neyron tarmoq nimadan ilhomlangan?

**M4.** ChatGPT qaysi arxitekturadan foydalanadi?

**M5.** LLM qisqartmasi nimani anglatadi?

**M6.** LLM nimadan o'rganadi? *(kamida 4 ta manba)*

**M7.** NLP rivojlanishining to'rtta yo'nalishini sanang.

**M8.** "Ko'p modallik" nima?

<details>
<summary>✅ Javoblar M1–M8</summary>

**M1.** **Mashinali o'qitish** *(machine learning)* → uning ichida **chuqur o'qitish** *(deep learning)*.

**M2.** Neyron tarmoqda **yashirin qatlamlar KO'P** — bir nechta qatlam ketma-ket joylashgan.

**M3.** **Inson miyasi** — neyronlar va ular orasidagi bog'lanishlar.

**M4.** ## **Transformer** — siz uni **23-modulda** allaqachon ishlatgansiz.

**M5.** ## **Large Language Model** — katta til modeli.

**M6.** 📚 kitoblar · 🌐 veb-saytlar · 📰 maqolalar · 💬 forumlar · 🧑‍💻 kod.

**M7.**
```
① Chuqurroq kontekstual tushunish (+ mulohaza)
② Ko'p modallik (matn + rasm + video + audio)
③ Tezlik / real vaqt
④ Axloq (tarafkashlik · maxfiylik · adolat · shaffoflik)
```

**M8.** Model **bir necha turdagi** ma'lumot bilan ishlaydi — faqat matn emas, balki rasm, audio, video ham.

</details>

### 🇺🇿 O'zbek tili — birinchi qadamlar

**M9.** NLTK'da nechta o'zbek to'xtatish so'zi bor? Ingliz tilidagidan ko'pmi?

**M10.** `va`, `juda`, `kitob` so'zlari o'zbek to'xtatish so'zlari ro'yxatidami?

**M11.** O'zbek ro'yxatidagi **eng uzun** va **eng qisqa** so'zni toping.

**M12.** Quyidagi jumladan to'xtatish so'zlarini olib tashlang:
> *"Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman"*

**M13.** `spacy.load("uz_core_news_sm")` ishlaydimi? Nima uchun?

**M14.** spaCy nechta tilni qo'llaydi? O'zbek ular orasidami?

**M15.** O'zbek matnini spaCy bilan tokenizatsiya qilishning yo'lini toping.

<details>
<summary>✅ Javoblar M9–M15</summary>

**M9.**
```python
from nltk.corpus import stopwords
print("o'zbek :", len(stopwords.words("uzbek")))
print("ingliz :", len(stopwords.words("english")))
```
```
o'zbek : 288
ingliz : 198
```
> ## 🎉 **O'zbek ro'yxati ingliz tilidagidan KO'PROQ!** *(288 vs 198)*

**M10.**
```python
uz = stopwords.words("uzbek")
for s in ["va", "juda", "kitob"]:
    print(f"{s:8s} → {s in uz}")
```
```
va       → True
juda     → True
kitob    → False
```
> ✅ To'g'ri: `va` va `juda` — **xizmatchi** so'zlar, `kitob` — **ma'noli** so'z.

**M11.**
```python
uz = stopwords.words("uzbek")
print("eng uzun :", max(uz, key=len))
print("eng qisqa:", min(uz, key=len))
```
```
eng uzun : hisoblanayotgan
eng qisqa: u
```

**M12.**
```python
matn = "Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman"
toza = " ".join(w for w in matn.lower().split() if w not in uz)
print(toza)
```
```
kitob yaxshi tavsiya qilaman
```
> ## ✅ **10 ta so'zdan 4 tasi qoldi** — va aynan **ma'noli** to'rttasi.

**M13.** ## ❌ **Yo'q.** spaCy'da **o'zbek modeli YO'Q**. `OSError` beradi.

**M14.** ## **79 ta til** — o'zbek ular orasida **YO'Q**. *(turk va qirg'iz bor.)*

**M15.**
```python
import spacy
nlp = spacy.blank("xx")            # xx = ko'p tilli
doc = nlp("Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman")
print([t.text for t in doc])
```
```
['Bu', 'kitob', 'juda', 'yaxshi', 'va', 'men', 'uni', 'hammaga', 'tavsiya', 'qilaman']
```
> ✅ Tokenizatsiya ishlaydi · ❌ POS va NER — **yo'q**.

</details>

---

# 🟡 O'RTA *(16–32)*

### ⭐ Apostrof muammosi — o'zbek NLP'ning 1-raqamli tuzog'i

**M16.** Quyidagi jumlani standart `CountVectorizer` bilan vektorlashtiring va natijani **diqqat bilan** ko'ring:
> *"O'zbekiston Respublikasi — Markaziy Osiyodagi go'zal davlat"*

**M17.** M16'dagi muammoni **tuzating**.

**M18.** Nima uchun `O'zbekiston` → `zbekiston` bo'lib qoldi, `go'zal` → `go` + `zal` esa **ikkiga** bo'lindi?

<details>
<summary>✅ Javoblar M16–M18</summary>

**M16.**
```python
s = "O'zbekiston Respublikasi — Markaziy Osiyodagi go'zal davlat"
cv = CountVectorizer()
print(sorted(cv.fit([s]).get_feature_names_out()))
```
```
['davlat', 'go', 'markaziy', 'osiyodagi', 'respublikasi', 'zal', 'zbekiston']
```
> ## ❌ **FALOKAT!** `O'zbekiston` → `zbekiston` *(mamlakat nomi buzildi!)* · `go'zal` → `go` + `zal` *(ikkita ma'nosiz bo'lak)*.

**M17.**
```python
UZ = r"[\w'ʻ’]+"
cv = CountVectorizer(token_pattern=UZ)
print(sorted(cv.fit([s]).get_feature_names_out()))
```
```
['davlat', "go'zal", 'markaziy', "o'zbekiston", 'osiyodagi', 'respublikasi']
```
> ## ✅ **6 ta so'z — 6 ta token.** Mukammal.

**M18.**
```
Standart token_pattern = r"(?u)\b\w\w+\b"
                                  ↑↑
                          KAMIDA IKKI harf!

O'zbekiston  →  apostrofda bo'linadi  →  ["O", "zbekiston"]
                "O" — 1 harf  →  TASHLANADI
                natija: "zbekiston"          ❌

go'zal       →  ["go", "zal"]
                ikkalasi ham 2+ harf  →  IKKALASI QOLADI
                natija: "go" + "zal"         ❌
```
> ## 🔑 **Shuning uchun `token_pattern` ni o'zgartirish — o'zbek tilida BIRINCHI qadam.**

</details>

### 🇺🇿 Agglyutinatsiya

**M19.** Quyidagi ikki to'plamni vektorlashtiring va **umumiy** ustunlar sonini solishtiring:
```python
uz = ["Mening uyim chiroyli", "Uyimda mehmon bor",
      "Uylarim shaharda joylashgan", "Uylarimda hech kim yo'q"]
en = ["My house is beautiful", "There is a guest in my house",
      "My houses are in the city", "Nobody is in my houses"]
```

**M20.** ⭐ M19'da farq deyarli chiqmadi. Nima uchun? Farqni **ko'rsatadigan** o'lchovni toping.

**M21.** Agglyutinatsiya `min_df` ga qanday ta'sir qiladi?

<details>
<summary>✅ Javoblar M19–M21</summary>

**M19.**
```python
for nom, m, tp in [("O'ZBEK", uz, UZ), ("INGLIZ", en, None)]:
    cv = CountVectorizer(token_pattern=tp) if tp else CountVectorizer()
    print(nom, ":", cv.fit(m).get_feature_names_out().shape[0], "ta ustun")
```
```
O'ZBEK : 13 ta ustun
INGLIZ : 12 ta ustun
```
> ## ⚠️ **Deyarli BIR XIL!** Kutilgan katta farq **chiqmadi**.

**M20.** Sabab — **ingliz jumlalarida o'z xizmatchi so'zlari ko'p** *(`my`, `is`, `in`, `the`, `a`, `there`)*. Ular ustun sonini **sun'iy ko'taradi**.

**Farqni ko'rsatadigan to'g'ri o'lchov — BITTA so'z oilasini sanash:**

```python
uy    = [w for w in CountVectorizer(token_pattern=UZ).fit(uz)
         .get_feature_names_out() if w.startswith("uy")]
house = [w for w in CountVectorizer().fit(en)
         .get_feature_names_out() if w.startswith("house")]
print("o'zbek 'uy'   :", sorted(uy))
print("ingliz 'house':", sorted(house))
```
```
o'zbek 'uy'   : ['uyim', 'uyimda', 'uylarim', 'uylarimda']
ingliz 'house': ['house', 'houses']
```
> ## 🎯 **BIR XIL MA'NO → 4 ta ustun vs 2 ta ustun.** Mana agglyutinatsiya.
>
> 💡 **Metodologik saboq:** noto'g'ri o'lchov **haqiqiy** hodisani **yashirib** qo'yadi. Doim **nimani** o'lchayotganingizni tekshiring.

**M21.**
```
Ingliz:  "house" 100 marta uchraydi   →  min_df=5 ni OSON o'tadi   ✅
O'zbek:  uyim 30 · uyimda 25 · uylarim 20 · uylarimda 25
             ↑
      har biri ALOHIDA sanaladi  →  ba'zilari min_df dan O'TMAYDI  ❌

🔑 NATIJA:
   · min_df ni PASTROQ qo'ying
   · yoki KO'PROQ ma'lumot yig'ing
   · stemmer bo'lganda muammo yo'qolardi (lekin o'zbek uchun YO'Q)
```

</details>

### 🇺🇿 Amaliy tasniflagich

**M22.** ⭐ O'zbek tilida sentiment tasniflagichi quring *(6 ta o'quv jumlasi yetarli)* va 3 ta yangi jumlada sinang.

**M23.** M22'da `stop_words=uz_stop` berish natijani yaxshiladimi? Tekshiring.

**M24.** M22 modelining `coef_` ini ko'ring — u qaysi so'zlarni **ijobiy**, qaysilarini **salbiy** deb o'rgangan?

<details>
<summary>✅ Javoblar M22–M24</summary>

**M22.**
```python
X = ["Bu kitob juda ajoyib va qiziqarli",
     "Zo'r asar, hammaga tavsiya qilaman",
     "Menga judayam yoqdi, ajoyib",
     "Juda zerikarli va sifatsiz kitob",
     "Vaqtimni behuda sarfladim, yomon",
     "Umuman yoqmadi, zerikarli asar"]
y = ["ijobiy"] * 3 + ["salbiy"] * 3

pipe = make_pipeline(
    TfidfVectorizer(token_pattern=UZ, stop_words=uz_stop),
    LogisticRegression())
pipe.fit(X, y)

test = ["Bu asar juda ajoyib chiqibdi",
        "Sifatsiz va zerikarli kitob",
        "Hammaga tavsiya qilaman"]
for t, p in zip(test, pipe.predict(test)):
    print(f"{p:8s} | {t}")
```
```
ijobiy   | Bu asar juda ajoyib chiqibdi
salbiy   | Sifatsiz va zerikarli kitob
ijobiy   | Hammaga tavsiya qilaman
```
> ## 🎉 **UCHALASI HAM TO'G'RI!** O'zbek tilida ishlaydigan sentiment tasniflagichi — **atigi 6 ta o'quv jumlasi** bilan.

**M23.** ✅ **Ha, sezilarli yaxshilaydi** — `bu`, `va`, `juda`, `menga` kabi so'zlar lug'atdan chiqadi va model **ma'noli** so'zlarga *(`ajoyib`, `zerikarli`, `sifatsiz`)* diqqat qaratadi.

> ⚠️ **Lekin ehtiyot bo'ling:** 26-modulda ko'rganimizdek, ingliz tilida `stop_words='english'` sentimentni **buzgan** edi *(`not` olib tashlangani uchun)*. O'zbekcha ro'yxatda ham `yo'q`, `emas` kabi **inkor** so'zlari bor. **Doim ikkala variantni sinang.**

**M24.**
```python
tv = pipe.named_steps["tfidfvectorizer"]
lr = pipe.named_steps["logisticregression"]
koef = pd.Series(lr.coef_[0], index=tv.get_feature_names_out())
print("SALBIY tomon:\n", koef.nsmallest(5).round(3).to_string())
print("\nIJOBIY tomon:\n", koef.nlargest(5).round(3).to_string())
```
> 🔑 `lr.classes_` = `['ijobiy', 'salbiy']` — musbat koeffitsient **ikkinchi** sinf *(salbiy)* tomon ishlaydi. **Doim `classes_` ni tekshiring**, aks holda talqinni **teskari** o'qiysiz.

</details>

### Nazariya — chuqurroq

**M25.** BOG kontekstni tushunmasligini kodda isbotlang.

**M26.** LLM bo'lsa ham nima uchun `sklearn` kerak? *(3 sabab)*

**M27.** Distillation, quantization va pruning farqi nimada?

**M28.** "Shipcha o'rganish" nima? 27-moduldan misol keltiring.

<details>
<summary>✅ Javoblar M25–M28</summary>

**M25.**
```python
cv = CountVectorizer()
X = cv.fit_transform(["The dog bit the man", "The man bit the dog"])
print(cv.get_feature_names_out()); print(X.toarray())
```
```
['bit' 'dog' 'man' 'the']
[[1 1 1 2]
 [1 1 1 2]]
```
> ## ❌ **Ikki qator bir xil** — ma'no esa **teskari**. Mana nima uchun kontekstual modellar kerak.

**M26.** ① **Narx/tezlik** *(1M sharh: 10 sek vs soatlar)* · ② **Tushuntirish** *(`coef_` bor)* · ③ **Tekshirish** *(shipchani topish)*.

**M27.**
| Usul | Nima qiladi |
|---|---|
| **Distillation** | Katta model **kichigini o'qitadi** *(bilim ko'chiriladi)* |
| **Quantization** | Sonlar **aniqligi** kamayadi *(32-bit → 8-bit)* |
| **Pruning** | Keraksiz **bog'lanishlar kesiladi** |

**M28.** Model **haqiqiy naqsh** o'rniga **tasodifiy belgi** ga suyanadi. 27-modul: model tilni emas, `"Reuters"` **nashriyot nomini** o'rgangan — bitta `contains("Reuters")` qoidasi **99.5%** aniqlik beradi.

</details>

### Aralash

**M29.** Ko'p modallik kursning qaysi modullarida amalda uchraydi?

**M30.** Axloqiy tekshirish ro'yxatining 7 bandini yozing.

**M31.** Nima uchun eng katta model doim to'g'ri tanlov emas?

**M32.** 20–28-modullardan uchta asosiy saboqni ayting.

<details>
<summary>✅ Javoblar M29–M32</summary>

**M29.** ## **52–61-modullar** — nutqni tanish *(🎙️ audio → 📝 matn)*.

**M30.**
```
□ Model NIMANI o'rgandi?         □ Xato kimga zarar keltiradi?
□ Shipcha bormi?                 □ Ma'lumot maxfiyligi?
□ Bazaviy modeldan yaxshimi?     □ Qarorni TUSHUNTIRA olasizmi?
□ Ma'lumot vakillimi?
```

**M31.** **Narx** va **tezlik**: 1M sharh — `sklearn` **10 soniya, $0**; katta LLM — **~10 soat, ~$500**. Aniqlik farqi ko'pincha bu narxni **oqlamaydi**.

**M32.**
```
1️⃣  Ko'proq MA'LUMOT  >  aqlliroq ALGORITM    (26-modul: 0.50 → 0.87)
2️⃣  Modelni DOIM tekshiring                   (27-modul: "Reuters")
3️⃣  Sodda model ko'pincha YETARLI             (24-modul: TF-IDF)
```

</details>

---

# 🔴 QIYIN *(33–42)*

**M33.** ⭐⭐ O'zbek tilida **mavzu modeli** *(LDA)* quring — 9 ta hujjat, 3 ta mavzu. Natijani **halol** baholang.

<details>
<summary>✅ Yechim</summary>

```python
corp = [
 "Futbol o'yini stadionda bo'lib o'tdi tomoshabinlar ko'p edi",
 "Terma jamoa g'alaba qozondi futbol muxlislari xursand",
 "Stadionda o'tgan futbol matchi qiziqarli bo'ldi jamoa yutdi",
 "Yangi telefon bozorga chiqdi narxi arzon emas",
 "Kompyuter va telefon texnikasi do'konda sotilmoqda",
 "Bu telefon kamerasi juda yaxshi rasmga oladi kompyuter ham kerak",
 "Maktabda o'quvchilar dars o'qishmoqda o'qituvchi tushuntirdi",
 "Universitet talabalari imtihon topshirishdi o'qituvchi baho qo'ydi",
 "O'quvchilar maktabda kitob o'qishdi dars qiziqarli",
]
cv = CountVectorizer(token_pattern=UZ, stop_words=uz_stop)
X = cv.fit_transform(corp)
f = cv.get_feature_names_out()
print("lug'at:", X.shape)

lda = LatentDirichletAllocation(n_components=3, random_state=42).fit(X)
for i, c in enumerate(lda.components_):
    print(f"Mavzu {i}:", [f[j] for j in c.argsort()[-5:][::-1]])
```

```
lug'at: (9, 46)
Mavzu 0: ['telefon', 'yangi', 'chiqdi', 'arzon', 'bozorga']
Mavzu 1: ['futbol', 'stadionda', 'qiziqarli', 'maktabda', "o'quvchilar"]
Mavzu 2: ["o'qituvchi", 'kompyuter', 'jamoa', 'talabalari', 'universitet']
```

### ⚠️ HALOL BAHO

```
Mavzu 0  →  TELEFON / TEXNIKA        ✅ TOZA
Mavzu 1  →  futbol + maktab          ❌ ARALASH
Mavzu 2  →  o'qituvchi + kompyuter   ❌ ARALASH
                    ↑
        Faqat 1/3 mavzu toza chiqdi
```

> ## 🔑 **Bu — MUVAFFAQIYATSIZLIK EMAS, balki 26-MODUL SABOG'INING TASDIG'I.**
>
> ```
> 9 ta hujjat, 46 ta ustun  →  hujjatga 5 ta xususiyat
> LDA ishonchli ishlashi uchun KAMIDA bir necha yuz hujjat kerak
> ```
>
> ## ✅ **Yechim — ALGORITMNI emas, MA'LUMOTNI o'zgartiring.** 200+ o'zbek maqolasini yig'ing, keyin qayta urinib ko'ring. Natija **butunlay boshqacha** bo'ladi.

💡 **Diqqat:** ko'plab darsliklar bunday natijani **yashiradi** yoki `random_state` ni almashtirib "chiroyli" ko'rinishini tanlaydi. Bu — **o'zini aldash**. Haqiqiy ish shunday ko'rinadi.

</details>

**M34.** ⭐ M33'dagi mavzular nima uchun aralashganini **son bilan** isbotlang *(hujjat/xususiyat nisbati)*.

<details>
<summary>✅ Yechim</summary>

```python
n_hujjat, n_ustun = X.shape
print(f"hujjat  : {n_hujjat}")
print(f"ustun   : {n_ustun}")
print(f"nisbat  : {n_ustun / n_hujjat:.1f} ta ustun / 1 hujjat")
print(f"siyraklik: {100 * (1 - X.nnz / (n_hujjat * n_ustun)):.1f}%")
```
```
hujjat  : 9
ustun   : 46
nisbat  : 5.1 ta ustun / 1 hujjat
siyraklik: 89.6%
```
> ## ❌ **Xususiyat hujjatdan 5 BARAVAR ko'p, matritsa 90% BO'SH.**
>
> 26-moduldagi falokatli tasniflagich ham **aynan shunday** ko'rinardi *(20 ta misol, 118 ta ustun)*. **Bir xil kasallik — bir xil dori: ko'proq ma'lumot.**

</details>

**M35.** ⭐⭐ Universal **shipcha detektori** yozing va uni 27-modul ma'lumotida ishlating.

<details>
<summary>✅ Yechim</summary>

```python
def shipcha_tekshir(matnlar, yorliqlar, min_uchrash=10, chegara=0.90):
    cv = CountVectorizer(binary=True, min_df=min_uchrash)
    Xb = cv.fit_transform(matnlar)
    sozlar = cv.get_feature_names_out()
    y = pd.Series(list(yorliqlar))
    topilgan = []
    for i, soz in enumerate(sozlar):
        bor = np.asarray(Xb[:, i].todense()).ravel() == 1
        if bor.sum() < min_uchrash:
            continue
        ulush = y[bor].value_counts(normalize=True)
        if ulush.iloc[0] >= chegara:
            topilgan.append({"so'z": soz, "sinf": ulush.index[0],
                             "aniqlik": round(ulush.iloc[0], 3),
                             "uchraydi": int(bor.sum())})
    return pd.DataFrame(topilgan).sort_values(
        ["aniqlik", "uchraydi"], ascending=False)

data = pd.read_csv("../27-Fake-News-Case-Study/data/fake_news_data.csv")
n = shipcha_tekshir(data["text"], data["fake_or_factual"])
print(f"{len(n)} ta shipcha topildi\n")
print(n.head(10).to_string(index=False))
```
```
39 ta shipcha topildi

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
> 🔑 Uch xil shipcha: **rasm manbasi** *(getty, images, pic, featured)* · **havola qoldig'i** *(via, com, read)* · **mavzu qiyshiqligi** *(minister, prime)*.

</details>

**M36.** ⭐ M35'dagi `chegara` va `min_uchrash` ni o'zgartirib, topilgan shipchalar soni qanday o'zgarishini jadval qiling.

<details>
<summary>✅ Yechim</summary>

```python
for ch in [0.80, 0.90, 0.95, 1.00]:
    for mu in [5, 10, 25]:
        k = len(shipcha_tekshir(data["text"], data["fake_or_factual"], mu, ch))
        print(f"chegara={ch:.2f}  min_uchrash={mu:2d}  →  {k:3d} ta")
```
> 💡 **Kutilgan naqsh:** chegara ↑ → topilgan ↓ · `min_uchrash` ↑ → topilgan ↓.
>
> **Amaliy tavsiya:** `chegara=0.90`, `min_uchrash=10` dan boshlang. Juda ko'p natija chiqsa — chegarani ko'taring, hech narsa chiqmasa — pasaytiring.

</details>

**M37.** ⭐⭐ O'zbek tili uchun **oddiy stemmer** yozing *(qo'shimchalarni kesish)* va u lug'at hajmini qanchaga kamaytirishini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
QOSHIMCHALAR = [
    "larimizda", "laringizda", "larimiz", "laringiz", "larimni", "larida",
    "lardan", "larga", "larda", "larni", "larim", "laring", "lari", "lar",
    "imizda", "ingizda", "imiz", "ingiz", "sida", "siga", "sini",
    "imda", "ingda", "ida", "iga", "ini", "ning", "dan",
    "ing", "im", "si", "ni", "ga", "da",
]

def uz_stem(soz, min_uzunlik=2):
    """Qo'shimchalarni TAKRORAN kesadi (uylarimizda → uylarimiz → ... → uy)."""
    ozgardi = True
    while ozgardi:                          # ⭐ TAKRORIY — bir marta emas!
        ozgardi = False
        for q in QOSHIMCHALAR:              # UZUNIDAN boshlab
            if soz.endswith(q) and len(soz) - len(q) >= min_uzunlik:
                soz = soz[:-len(q)]
                ozgardi = True
                break
    return soz

for s in ["uylarimizda", "kitoblarimda", "kitoblarni", "uyimda",
          "uylarim", "uy", "kitob"]:
    print(f"{s:14s} → {uz_stem(s)}")
```
```
uylarimizda    → uy
kitoblarimda   → kitob
kitoblarni     → kitob
uyimda         → uy
uylarim        → uy
uy             → uy
kitob          → kitob
```
> ## ✅ **`uy` ning TO'RT shakli ham — endi BITTA ustun!**
>
> ⚠️ **Diqqat — ikkita nozik joy bor:**
> ```
> ① TAKRORIY kesish SHART:
>      uylarimizda  →  "larimizda" kesiladi  →  uy          ✅
>    Bir martalik kesishda "lar" birinchi mos kelib qolsa,
>    "uylarimizda" → "uylarimiz" bo'lib TO'XTAB qolardi.    ❌
>
> ② min_uzunlik=4 EMAS, 2:
>      "uyim" (4 harf) dan "im" kesilsa "uy" (2 harf) qoladi
>      min_uzunlik=4 bo'lsa bu KESILMAY qolardi              ❌
> ```

**Lug'at hajmiga ta'siri:**
```python
matnlar = ["Mening uyim chiroyli", "Uyimda mehmon bor",
           "Uylarim shaharda joylashgan", "Uylarimda hech kim yo'q"]

oddiy = CountVectorizer(token_pattern=UZ).fit(matnlar)
stemli = CountVectorizer(
    token_pattern=UZ,
    preprocessor=lambda t: " ".join(uz_stem(w) for w in t.lower().split())
).fit(matnlar)

print("stemmersiz   :", len(oddiy.get_feature_names_out()))
print("stemmer bilan:", len(stemli.get_feature_names_out()))
print(sorted(stemli.get_feature_names_out()))
```
```
stemmersiz   : 13
stemmer bilan: 10
['bor', 'chiroyli', 'hech', 'joylashgan', 'kim', 'me', 'mehmon', 'shahar', 'uy', "yo'q"]
```
> ## ✅ **13 → 10 ustun** *(−23%)*. `uyim`, `uyimda`, `uylarim`, `uylarimda` → hammasi **`uy`**.
>
> ## ❌ **LEKIN QARANG: `mening` → `me`!** Stemmer `ning` ni **qaratqich qo'shimchasi** deb o'yladi — aslida bu **olmoshning o'z qismi**. Mana o'yinchoq stemmerning narxi.

Haqiqiy stemmer **morfologik lug'at** talab qiladi. Ishlab chiqarishda ishlatishdan oldin **o'z ma'lumotingizda** albatta sinang.

</details>

**M38.** ⭐ M37'dagi stemmer **qaysi hollarda XATO** qilishini toping — kamida 3 ta misol.

<details>
<summary>✅ Javob</summary>

```python
sinov = ["modda", "adad", "sanoat", "quyosh", "poda", "olma",
         "havoda", "dala", "bola", "tanga", "sirg'a", "mening"]
for s in sinov:
    print(f"{s:10s} → {uz_stem(s)}")
```
```
modda      → mod        ❌ XATO  ("da" — o'zakning qismi)
adad       → adad       ✅
sanoat     → sanoat     ✅
quyosh     → quyosh     ✅
poda       → po         ❌ XATO
olma       → olma       ✅
havoda     → havo       ✅ to'g'ri
dala       → dala       ✅
bola       → bola       ✅
tanga      → tan        ❌ XATO
sirg'a     → sirg'a     ✅
mening     → me         ❌ XATO
```

> ## 📊 **12 tadan 4 tasi XATO — 33% xato darajasi.**

**Muammoning ildizi:** stemmer **o'zak** bilan **qo'shimcha** ni farqlamaydi — u faqat **harf ketma-ketligini** ko'radi.

```
"modda"  ichida "da" bor  →  lekin bu QO'SHIMCHA EMAS, o'zakning qismi
"tanga"  ichida "ga" bor  →  ayni muammo
"mening" ichida "ning" bor →  ayni muammo
```

> ## 🤔 **Nima uchun `dala` va `bola` OMON QOLDI, `poda` esa YO'Q?**
> ```
> dala  →  "da" kesilsa "la" (2 harf) qoladi ✅ min_uzunlik=2 O'TADI
>          lekin "la" QO'SHIMCHALAR ro'yxatida YO'Q, shuning uchun
>          "dala" ning oxiri "la" — "da" emas!  →  kesilmaydi
> poda  →  oxiri AYNAN "da"  →  "po" qoladi  →  KESILADI  ❌
> ```
> 🔑 Ya'ni omon qolish **tasodifiy** — bu **ishonchli tizim emas**.

### 🔑 Uchta yechim

| Yechim | Qanday | Narx |
|---|---|---|
| ① `min_uzunlik` ni oshirish | 2 → 4 | ✅ kam xato · ❌ `uyim`→`uy` **ham** ishlamay qoladi |
| ② **Istisnolar ro'yxati** | `{"modda","poda","tanga","mening",...}` | ✅ aniq · ❌ qo'lda to'ldiriladi |
| ③ **Morfologik tahlilchi** | `apertium-uzb`, `UzMorphAnalyser` | ✅ to'g'ri · ❌ qo'shimcha kutubxona |

> ## 💡 **Amaliy tavsiya:** ② dan boshlang. Ma'lumotingizdagi **eng chastotali 200 so'z** ni ko'zdan kechiring, xato stemlanganlarini istisnolarga qo'shing. Bu **bir soatlik ish**, lekin xatoning **katta qismini** yo'qotadi.

</details>

**M39.** ⭐⭐ **Alifbo konvertori** yozing: kirill o'zbek matnini lotinga o'giring va bir xil matnning ikki yozuvi model uchun **turli** ekanini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
KIRIL = {
    'ш':"sh", 'ч':"ch", 'ў':"o'", 'қ':"q", 'ғ':"g'", 'ҳ':"h", 'ъ':"'",
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'j','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'x','ц':'ts','ы':'i',
    'ь':'','э':'e','ю':'yu','я':'ya','ё':'yo',
}

def kiril_lotin(matn):
    return "".join(KIRIL.get(c, KIRIL.get(c.lower(), c)) for c in matn)

kir = "Бу китоб жуда яхши"
lot = "Bu kitob juda yaxshi"
print("kirill  :", kir)
print("o'girildi:", kiril_lotin(kir))
print("lotin   :", lot)

# Model uchun ular BIR XILMI?
cv = CountVectorizer(token_pattern=UZ).fit([kir, lot])
print("\nlug'at:", sorted(cv.get_feature_names_out()))
print("ustunlar soni:", len(cv.get_feature_names_out()))
```
> ## ❌ **Konvertorsiz model bir xil so'zni IKKI MARTA o'rganadi** — lug'at ikki baravar kattalashadi, har bir so'zning ma'lumoti **ikkiga bo'linadi**.
>
> ## ✅ **Shuning uchun o'zbek NLP quvurida ALIFBO NORMALLASHTIRISH — TOZALASHDAN OLDIN turishi kerak.**

⚠️ Bu jadval **soddalashtirilgan**. To'liq konvertor kontekstni hisobga olishi kerak *(masalan `е` so'z boshida `ye`)*.

</details>

**M40.** ⭐⭐⭐ To'liq **o'zbek NLP quvurini** yig'ing: alifbo normallashtirish → apostrof tokenizatsiya → to'xtatish so'zlari → stemming → TF-IDF → tasniflagich. Har bosqichda lug'at hajmini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def uz_quvur(matnlar, stem=True):
    """To'liq o'zbek NLP quvuri."""
    natija = []
    for m in matnlar:
        m = kiril_lotin(m).lower()                       # ① alifbo
        sozlar = re.findall(r"[\w'ʻ’]+", m)              # ② apostrof
        sozlar = [w for w in sozlar if w not in uz_stop] # ③ stopword
        if stem:
            sozlar = [uz_stem(w) for w in sozlar]        # ④ stemming
        natija.append(" ".join(sozlar))
    return natija


import re
X = ["Bu kitob juda ajoyib va qiziqarli",
     "Zo'r asar, hammaga tavsiya qilaman",
     "Menga judayam yoqdi, ajoyib",
     "Juda zerikarli va sifatsiz kitob",
     "Vaqtimni behuda sarfladim, yomon",
     "Umuman yoqmadi, zerikarli asar"]
y = ["ijobiy"] * 3 + ["salbiy"] * 3

# Har bosqichda lug'at hajmi
bosqichlar = {
    "① xom":              (X,                        None),
    "② apostrof":         (X,                        UZ),
    "③ + stopword":       (uz_quvur(X, stem=False),  UZ),
    "④ + stemming":       (uz_quvur(X, stem=True),   UZ),
}
for nom, (m, tp) in bosqichlar.items():
    cv = CountVectorizer(token_pattern=tp) if tp else CountVectorizer()
    print(f"{nom:16s} → {len(cv.fit(m).get_feature_names_out()):3d} ta ustun")

# Yakuniy model
pipe = make_pipeline(TfidfVectorizer(token_pattern=UZ), LogisticRegression())
pipe.fit(uz_quvur(X), y)
test = ["Bu asar juda ajoyib chiqibdi", "Sifatsiz va zerikarli kitob"]
print("\nBashorat:", list(pipe.predict(uz_quvur(test))))
```

> ## 🔑 **Har bosqich lug'atni QISQARTIRADI** — bu yaxshi: kam ustun = kam shovqin = kam ma'lumot talabi.
>
> ⚠️ **Lekin har bosqich XATO ham keltirishi mumkin.** Har birini **alohida** yoqib/o'chirib, natijaga ta'sirini o'lchang. **Faqat foyda keltiradiganini qoldiring** — bu 26-moduldagi `stop_words='english'` saboqning aynan o'zi.

</details>

**M41.** ⭐⭐ M40'dagi quvurning **har bir bosqichini alohida** yoqib/o'chirib, tasniflagich aniqligiga ta'sirini o'lchang *(ablation study)*.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
from sklearn.model_selection import cross_val_score
from itertools import product

for alifbo, stopw, stem in product([0, 1], repeat=3):
    ...  # mos quvurni yig'ing
    ball = cross_val_score(pipe, Xq, y, cv=3).mean()
    print(f"alifbo={alifbo} stopword={stopw} stem={stem} → {ball:.3f}")
```

> ## 🔬 **Bu — ABLATSIYA TADQIQOTI.** Professional ML ishining standart usuli: har bir komponentni **alohida** o'chirib, uning **haqiqiy** hissasini o'lchash.
>
> ⚠️ **6 ta jumlada natija ISHONCHSIZ bo'ladi** *(26-modul saboqi!)*. Ablatsiyani **kamida bir necha yuz** misolda o'tkazing.

</details>

**M42.** ⭐⭐⭐ **Yakuniy sintez.** 20–28-modullardan o'rgangan hamma narsangizni bitta sahifada jamlang: NLP quvurining har bosqichi, qaysi modulda o'rganilgani, o'zbek tilida ishlashi/ishlamasligi.

<details>
<summary>✅ Namuna javob</summary>

| # | Bosqich | Modul | Vosita | 🇺🇿 O'zbek |
|---|---|---|---|---|
| 1 | Alifbo normallashtirish | *(o'zbekka xos)* | o'z konvertoringiz | ⭐ **Majburiy** |
| 2 | Tokenizatsiya | 21 | `token_pattern=UZ` | ⚠️ **Apostrofga e'tibor!** |
| 3 | Kichik harf / regex | 21 | `.lower()`, `re.sub` | ✅ Ishlaydi |
| 4 | To'xtatish so'zlari | 21 | `stopwords.words("uzbek")` | ✅ **288 ta** |
| 5 | Stemming | 21 | — | ⚠️ O'zingiz yozasiz |
| 6 | Lemmatization | 21 | — | ❌ Yo'q |
| 7 | POS teglash | 22 | — | ❌ Yo'q |
| 8 | NER | 22 | — | ❌ Yo'q |
| 9 | Sentiment *(lug'at)* | 23 | — | ❌ Yo'q |
| 10 | Vektorlashtirish | 24 | `CountVectorizer`, `TfidfVectorizer` | ✅ **To'liq** |
| 11 | Mavzu modeli | 25 | `LDA`, `TruncatedSVD` | ✅ **To'liq** |
| 12 | Tasniflash | 26 | `LR`, `NB`, `SVM` | ✅ **To'liq** |
| 13 | Shipcha tekshirish | 27 | o'z skriptingiz | ✅ **Majburiy!** |
| 14 | LLM | 28+ | GPT, Claude | ✅ Yaxshi ishlaydi |

```
XULOSA:  14 bosqichdan  9 tasi  o'zbek tilida TO'LIQ ishlaydi
         ❌ faqat oldindan o'qitilgan MODEL talab qiladiganlari ishlamaydi
         ⭐ va 2 ta QO'SHIMCHA bosqich kerak (alifbo + apostrof)
```

</details>

---

## 🎯 Yakuniy tekshirish

- [ ] `token_pattern=r"[\w'ʻ’]+"` nima uchun kerakligini tushuntira olasizmi?
- [ ] O'zbek tilida ishlaydigan tasniflagich qura olasizmi?
- [ ] Shipcha detektorini o'z ma'lumotingizda ishlata olasizmi?
- [ ] NLP rivojlanishining to'rt yo'nalishini eslay olasizmi?
- [ ] Nima uchun 9 ta hujjatda LDA ishlamasligini tushuntira olasizmi?

---

⬅️ [4-dars](04-Whats-Next-for-NLP.md) · 🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
