# 2-dars. Transformer pipeline

## 🎬 Boshlashdan oldin

> ## **"Transformers paketi orqali bizga mavjud modellardan foydalanishni TRANSFORMERS PIPELINE yordamida oson boshlashimiz mumkin."**
>
> ## **"Bu pipeline til modeliga ULANISH, KIRISH BERISH va NATIJANI OLISHNI — hammasini ATIGI BIR NECHA QATOR KODDA — oson qiladi."**

---

## 1. Eng oddiy misol — sentiment

> **"Birinchi navbatda paketlarni import qilmoqchimiz: `from transformers import pipeline`."**
>
> **"Ko'rib chiqadigan birinchi misolimiz — SENTIMENT TAHLILI uchun pipeline."**

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import pipeline

sentiment = pipeline("sentiment-analysis")
print(sentiment("I am so excited to be learning about large language models"))
```

```
[{'label': 'POSITIVE', 'score': 0.9998376369476318}]
```

> ## ✅ **BITTA QATOR KOD — va sizda ishlaydigan sentiment tahlilchisi bor.**
>
> ## 💡 **Siz buni 23-modulda ham qilgansiz** — lekin u paytda **nima ekanini bilmagansiz**. Endi bilasiz: bu **transformer**, **67 million parametr**, **6 qatlam**, **12 bosh**.

### ⚠️ "No model was supplied" xabari

> **"Pipeline funksiyasini ishga tushirganimizda 'HECH QANDAY MODEL BERILMADI' degan xabar olganimizni ham sezgan bo'lishingiz mumkin."**
>
> ## **"Ya'ni bu pipeline shu pipeline uchun ishlatiladigan STANDART MODELGA o'tdi."**
>
> **"Har bir pipeline uchun bog'langan standart model bor, lekin biz qaysi aniq modelni ishlatishni ham KO'RSATISHIMIZ mumkin."**

```python
p = pipeline("sentiment-analysis")
print("standart model:", p.model.name_or_path)
```

```
standart model: distilbert/distilbert-base-uncased-finetuned-sst-2-english
```

> ## ⚠️ **AMALIY OGOHLANTIRISH — ISHLAB CHIQARISHDA MODELNI DOIM KO'RSATING.**
>
> ```
> ❌ pipeline("sentiment-analysis")
>       →  standart model VERSIYA bilan O'ZGARISHI mumkin
>       →  bugun ishlagan kod ertaga BOSHQACHA natija beradi
>
> ✅ pipeline("sentiment-analysis",
>             model="distilbert-base-uncased-finetuned-sst-2-english")
>       →  natija BARQAROR
> ```

---

## 2. NER — nomli obyektlarni aniqlash

> **"Buni sinab ko'raylik va NOMLI OBYEKTLARNI ANIQLASH uchun yangi pipeline yarataylik."**
>
> **"Biz yana `pipeline` funksiyasidan foydalanamiz, pipeline'ni `ner` deb ko'rsatamiz va ishlatmoqchi bo'lgan aniq modelni tanlaymiz."**

```python
ner = pipeline("ner",
               model="dbmdz/bert-large-cased-finetuned-conll03-english",
               aggregation_strategy="simple")

matn = "Her name is Anna and she works in New York City for Morgan Stanley."
for r in ner(matn):
    print(f"  {r['entity_group']:8s} {r['score']:.3f}  {r['word']}")
```

```
  PER      0.999  Anna
  LOC      1.000  New York City
  ORG      0.999  Morgan Stanley
```

> ## ✅ **UCHALASI HAM MUKAMMAL** — va ishonch **0.999–1.000**.
>
> ```
> Anna            →  PER  (shaxs)
> New York City   →  LOC  (joy)
> Morgan Stanley  →  ORG  (tashkilot)
> ```

### 💡 `aggregation_strategy="simple"` — MUHIM qo'shimcha

**Usiz nima bo'lishini ko'ramiz:**

```python
ner2 = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")
for r in ner2(matn)[:6]:
    print(f"  {r['entity']:8s} {r['score']:.3f}  {r['word']}")
```

```
  I-PER    0.999  Anna
  I-LOC    1.000  New
  I-LOC    1.000  York
  I-LOC    1.000  City
  I-ORG    0.999  Morgan
  I-ORG    0.999  Stanley
```

> ## ❌ **`New York City` — UCHTA alohida obyektga bo'lindi!**
>
> ```
> agg YO'Q     →  'New' · 'York' · 'City'      3 ta natija
> agg=simple   →  'New York City'              1 ta natija  ✅
> ```
>
> ## 🔑 **Kurs buni ko'rsatmaydi, lekin usiz natijani QAYTA YIG'ISH kerak bo'ladi.** `aggregation_strategy="simple"` — **deyarli doim** kerak.
>
> 💡 `I-PER`, `I-LOC` — bu **BIO teglash** sxemasi *(`I` = Inside)*. 22-modulda `spaCy` buni **avtomatik** birlashtirgan edi.

> ## 🔁 **22-modulni eslang** — u yerda siz **aynan shu vazifani** `spaCy` bilan bajargandingiz. Endi **bir xil vazifa**, **boshqa vosita**.

---

## 3. ⭐ Zero-shot tasniflash

> **"Zero-shot o'rganish deganda nimani nazarda tutganimizni eslaysizmi? Bu — modelning HECH QANDAY QO'SHIMCHA O'QITISHSIZ vazifani bajara olishi."**
>
> ## **"Uning o'rgangan umumiy bilimi vazifani bajarishi uchun YETARLI."**

```python
zs = pipeline("zero-shot-classification",
              model="facebook/bart-large-mnli")

natija = zs("One day I will see the world",
            candidate_labels=["travel", "cooking", "dancing"])
print(natija["sequence"])
for l, s in zip(natija["labels"], natija["scores"]):
    print(f"  {l:10s} {s:.4f}")
```

```
One day I will see the world
  travel     0.9427
  cooking    0.0289
  dancing    0.0284
```

> ## ✅ **`travel` — 0.9427.** Boshqa ikkitasi **0.03 atrofida**. Aniq g'olib.

> ## 🔑 **DIQQAT — bu MO''JIZA.**
>
> ```
> Model "travel", "cooking", "dancing" yorliqlarida
> HECH QACHON o'qitilmagan.
>
> Siz istalgan yorliqlarni bera olasiz:
>    ["shikoyat", "maqtov", "savol"]
>    ["shoshilinch", "oddiy"]
>    ["sport", "siyosat", "texnologiya"]
>
> →  va model ULARNI TUSHUNADI.
> ```

> ## 💡 **29-modul, 6-darsni eslang:** biz zero-shot ni **kitob sharhlarida** o'lchagandik — **0.976** aniqlik, **hech qanday o'qitishsiz**.

### 🇺🇿 ⚠️ ENDI O'ZBEKCHADA SINAYMIZ

```python
r = zs("Bir kun butun dunyoni ko'raman",
       candidate_labels=["sayohat", "ovqat", "raqs"])
for l, s in zip(r["labels"], r["scores"]):
    print(f"  {l:10s} {s:.4f}")

r2 = zs("Mahsulot juda sifatsiz, pulimni qaytaring",
        candidate_labels=["shikoyat", "maqtov", "savol"])
for l, s in zip(r2["labels"], r2["scores"]):
    print(f"  {l:10s} {s:.4f}")
```

```
"Bir kun butun dunyoni ko'raman"          (= "One day I will see the world")
  raqs       0.3730      ❌ RAQS?!
  sayohat    0.3662      ← to'g'ri javob, lekin IKKINCHI
  ovqat      0.2608

"Mahsulot juda sifatsiz, pulimni qaytaring"  (= sifatsiz mahsulot, pulni qaytaring)
  maqtov     0.4825      ❌❌ MAQTOV?!
  savol      0.3326
  shikoyat   0.1849      ← to'g'ri javob, ENG OXIRIDA!
```

## 😱 IKKALA SINOVDA HAM MUVAFFAQIYATSIZ

```
INGLIZCHA:  travel  0.9427   ✅  (boshqalardan 32 BARAVAR yuqori)

O'ZBEKCHA:  raqs    0.3730   ❌  (sayohat 0.3662 — deyarli TENG)
            maqtov  0.4825   ❌  (shikoyat 0.1849 — ENG PAST!)
```

> ## 💥 **IKKINCHI SINOV — ENG XAVFLI TURDAGI XATO.**
>
> ```
> Matn      :  "Mahsulot juda sifatsiz, pulimni qaytaring"
>              (bu — ANIQ va KUCHLI shikoyat)
>
> Model     :  "maqtov"  0.4825
>              shikoyat  0.1849   ←  2.6 BARAVAR PAST
> ```
>
> ## ⚠️ **Tasavvur qiling:** mijozlar shikoyatlarini avtomatik saralaydigan tizim quryapsiz. Bu model **shikoyatni maqtov** deb belgilaydi va u **hech qachon ko'rilmaydi**.

### 🔑 Nima uchun ingliz tilida ishlaydi, o'zbekchada yo'q?

```
Zero-shot QANDAY ishlaydi (ichida):

  Model "Bu matn {yorliq} haqidami?" degan
  MANTIQIY XULOSA (NLI) masalasini yechadi.

  Buning uchun u IKKALASINI ham tushunishi kerak:
     ① MATNNI       →  o'zbekcha  ❌ zaif
     ② YORLIQNI     →  "shikoyat" ❌ bilmaydi

  Ikkala tomondan ham muammo  →  natija TASODIFIY
```

> ## 💡 **AMALIY YECHIM — YORLIQLARNI INGLIZCHA yozing:**
> ```python
> zs(uz_matn, candidate_labels=["complaint", "praise", "question"])
> ```
> Bu **biroz** yordam berishi mumkin *(model inglizcha yorliqlarni biladi)*, lekin **matn** hali ham o'zbekcha — shuning uchun **kafolat yo'q**.
>
> ## ✅ **ISHONCHLI YECHIM:** **28-moduldagi** `sklearn` modeli. Zero-shot o'rniga **50–100 ta yorliqli misol** yig'ing — bu **bir soatlik ish**, lekin natija **ishonchli**.
>
> ## 🎯 **29-MODUL SABOG'I YANA TASDIQLANDI:**
> ```
> ingliz  →  zero-shot 0.976  ✅
> o'zbek  →  zero-shot TASODIF ❌
> ```

### ⚠️ Model hajmi haqida ogohlantirish

```
facebook/bart-large-mnli  →  ~1.6 GB
```

> ## ⚠️ **Bu — KATTA model.** Birinchi yuklash **uzoq** davom etadi. Agar internetingiz sekin bo'lsa yoki joy kam bo'lsa, **kichikroq muqobil** ishlating:
> ```python
> zs = pipeline("zero-shot-classification",
>               model="valhalla/distilbart-mnli-12-1")   # ~800 MB
> ```
> ⚠️ **Kichikroq model — pastroq aniqlik.** Bu — 29-moduldagi **hajm vs sifat** almashuvining yana bir ko'rinishi.

---

## 4. 🔍 Model Hub

> **"Hugging Face model hub'ida biz ishlatishimiz mumkin bo'lgan barcha turli modellar haqida ma'lumot bor. Siz aniq modellarni QIDIRISHINGIZ yoki aniq VAZIFALAR bo'yicha FILTRLASHINGIZ mumkin."**

```
🔗 huggingface.co/models

Filtrlar:
   📋 Task        →  sentiment, ner, summarization, translation...
   🌍 Language    →  en, ru, tr, ...  (⚠️ uz — juda kam)
   📚 Library     →  transformers, sentence-transformers...
   📈 Sort        →  Most downloads · Trending · Recently updated
```

### 🎯 Model tanlashda NIMAGA qarash kerak?

| Mezon | Nima uchun |
|---|---|
| ⬇️ **Yuklashlar soni** | Ko'p ishlatilgan = **sinovdan o'tgan** |
| 📅 **Oxirgi yangilanish** | Eski model = **eskirgan** bo'lishi mumkin |
| 📄 **Model card** | Cheklovlar va **tarafkashlik** yozilganmi? |
| ⚖️ **Litsenziya** | ## **Tijorat uchun ruxsatmi?** |
| 📏 **Hajm** | RAM va disk **yetadimi**? |

> ## ⚠️ **LITSENZIYA — eng ko'p unutiladigan mezon.** Ba'zi modellar *(masalan `cc-by-nc`)* **tijorat** loyihalarda **ishlatib bo'lmaydi**. Buni **oldindan** tekshiring.

---

## 5. 📋 Mavjud pipeline'lar

> **"Turli vazifa turlari uchun ishlatishimiz mumkin bo'lgan juda ko'p turli pipeline'lar bor."**

```python
from transformers.pipelines import PIPELINE_REGISTRY
print(sorted(PIPELINE_REGISTRY.get_supported_tasks()))
```

### Asosiylari

| Pipeline | Nima qiladi | Qaysi modulda |
|---|---|---|
| `sentiment-analysis` | Ijobiy/salbiy | ## **23, 29-modullar** |
| `text-classification` | Umumiy tasniflash | 26-modul *(sklearn bilan)* |
| `ner` | Nomli obyektlar | ## **22-modul** *(spaCy bilan)* |
| `zero-shot-classification` | Yorliqsiz tasniflash | ## **29-modul** |
| `text-generation` | Matn yaratish | ## **31-modul** |
| `fill-mask` | Bo'sh joyni to'ldirish | **4-dars** |
| `question-answering` | Savol-javob | ## **33-modul** |
| `feature-extraction` | Embedding olish | 31-modul *(RAG)* |

> ## ⚠️ **MUHIM O'ZGARISH — `transformers` 5.x da:**
> ```
> ❌ "summarization"          →  OLIB TASHLANDI
> ❌ "translation_en_to_fr"   →  OLIB TASHLANDI
> ❌ "text2text-generation"   →  OLIB TASHLANDI
> ```
> **Sabab:** bu vazifalar endi `AutoModelForSeq2SeqLM` orqali **to'g'ridan-to'g'ri** bajariladi *(31-modulda shunday qilgandik)*.
>
> ```python
> # ❌ eski
> pipeline("summarization")
>
> # ✅ yangi
> from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
> tok = AutoTokenizer.from_pretrained("google/flan-t5-base")
> m = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
> ```

---

## 6. Pipeline nima qiladi?

> ## **"Pipeline biz uchun juda ko'p vazifani ABSTRAKSIYA qiladi — masalan, matn kiritmasini OLDINDAN QAYTA ISHLASH va TUSHUNARLI natija berish."**

```
Siz yozasiz:            pipeline("sentiment-analysis")(matn)
                                      ↓
Aslida sodir bo'ladi:
   ① TOKENIZATSIYA      matn  →  [101, 1045, ...]
   ② TENSORGA aylantirish
   ③ MODEL              forward pass
   ④ SOFTMAX            logitlar  →  ehtimolliklar
   ⑤ YORLIQ             0/1  →  "POSITIVE"/"NEGATIVE"
```

> ## 🔑 **Bu beshta qadamni [5-darsda](05-PyTorch-TensorFlow.md) QO'LDA bajaramiz** — va natija **bir xil** chiqadi.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `pipeline` nima qiladi?

**M2.** *"No model was supplied"* nima degani?

**M3.** Zero-shot nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** Modelga **ulanish**, **kirish berish** va **natija olishni** bir necha qatorda mumkin qiladi.

**M2.** Siz model **ko'rsatmadingiz** → pipeline **standart** modelni ishlatdi.

**M3.** Model **hech qanday qo'shimcha o'qitishsiz** vazifani bajaradi.

</details>

### 🟡 O'rta

**M4.** ⭐ Nima uchun ishlab chiqarishda modelni **doim ko'rsatish** kerak?

**M5.** `aggregation_strategy="simple"` nima uchun kerak?

**M6.** Model tanlashda qaysi 5 mezonga qarash kerak?

<details>
<summary>✅ Javoblar</summary>

**M4.** Standart model **paket versiyasi bilan o'zgarishi** mumkin → bugungi kod ertaga **boshqacha** natija beradi.

**M5.** Usiz NER **so'z bo'laklarini** alohida qaytaradi:
```
❌ 'New' · '##Y' · '##ork' · 'City'
✅ 'New York City'
```

**M6.** Yuklashlar soni · oxirgi yangilanish · model card · ## **litsenziya** · hajm.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Bir nechta pipeline'ni **bitta skriptda** sinang.

<details>
<summary>✅ Yechim</summary>

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import pipeline

MATN = "Her name is Anna and she works in New York City for Morgan Stanley."

# ① sentiment
p1 = pipeline("sentiment-analysis",
              model="distilbert-base-uncased-finetuned-sst-2-english")
print("sentiment:", p1(MATN))

# ② NER
p2 = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english",
              aggregation_strategy="simple")
print("NER:", [(r["entity_group"], r["word"]) for r in p2(MATN)])

# ③ fill-mask
p3 = pipeline("fill-mask", model="bert-base-uncased")
for r in p3("Her name is [MASK].")[:3]:
    print(f"   mask: {r['token_str']:10s} {r['score']:.4f}")
```

> 🔑 **Uchta butunlay boshqa vazifa — bir xil `pipeline()` sintaksisi.** Mana **abstraksiya** ning kuchi.

</details>

**M8.** ⭐⭐ 🇺🇿 O'zbekcha matnda pipeline'larni sinang.

<details>
<summary>✅ Yechim</summary>

```python
UZ = "Uning ismi Anna va u Toshkent shahrida Kapitalbankda ishlaydi."

print("sentiment:", p1(UZ))
print("NER      :", [(r["entity_group"], r["word"]) for r in p2(UZ)])
```

**Haqiqiy natija:**

```
  ORG      0.567  Anna
  LOC      0.963  Toshkent
  LOC      0.551  ##ha
  ORG      0.942  Kapitalbankda
```

## 🤯 QISMAN ISHLADI — VA BU KUTILMAGAN DARAJADA YAXSHI

### ✅ Ikkita TO'G'RI natija — yuqori ishonch bilan

```
Toshkent       →  LOC  0.963   ✅ JOY — TO'G'RI!
Kapitalbankda  →  ORG  0.942   ✅ TASHKILOT — TO'G'RI!
```

> ## 💥 **`Kapitalbankda` — model bu so'zni HECH QACHON ko'rmagan.**
>
> U **o'zbekcha** *(`-da` qo'shimchasi bilan!)*, u **o'zbek banki**, va model **ingliz** matnida o'qitilgan. Baribir u **0.942 ishonch** bilan **tashkilot** deb topdi.
>
> ## 🔑 **Nima uchun?** Chunki model *"katta harf bilan boshlanadi + `bank` bo'lagi bor + gapning shu o'rnida turibdi"* naqshini **grammatik** darajada o'rgangan — bu naqsh **tildan qisman mustaqil**.

### ❌ Ikkita XATO

```
Anna   →  ORG  0.567   ❌ shaxs bo'lishi kerak edi (ishonch ham PAST)
##ha   →  LOC  0.551   ❌ BU SO'Z EMAS — "shahrida" ning BO'LAGI!
```

> ## 🔬 **`##ha` — 30-MODULDAGI TOKENIZATSIYA MUAMMOSI.**
>
> ```
> "shahrida"  →  ['sha', '##hr', '##ida']   (yoki shunga o'xshash)
>                        ↑
>          Model BO'LAKNI mustaqil "joy nomi" deb o'yladi
> ```
> Ingliz matnida bunday bo'lmaydi, chunki so'zlar **butun** qoladi.

### 🔑 XULOSA — UCH QATLAMLI

```
① ATOQLI OTLAR (Toshkent, Kapitalbank)  →  ✅ O'TADI (0.94-0.96)
② KONTEKST (Anna kim?)                  →  ⚠️ ZAIF (0.567)
③ TOKENIZATSIYA (##ha)                  →  ❌ SOXTA obyektlar
```

> ## 💡 **VA MANA ENG AMALIY MASLAHAT — ISHONCH BALLIGA QARANG:**
> ```
> ball > 0.9   →  ishonish mumkin  (Toshkent 0.963 · Kapitalbank 0.942)
> ball < 0.7   →  RAD ETING        (Anna 0.567 · ##ha 0.551)
> ```
>
> **Oddiy filtr xatolarning IKKALASINI ham yo'qotadi:**
> ```python
> natijalar = [r for r in ner(UZ) if r["score"] > 0.9]
> ```

> ## 🎯 **UMUMIY QOIDA — 29-MODULNI TO'LDIRADI:**
> ```
> ATOQLI OTLAR (ism, joy, tashkilot)  →  tillar orasida QISMAN O'TADI  ⚠️✅
> MA'NO (sentiment, mavzu)             →  TILGA BOG'LIQ                 ❌
> ```
>
> 29-modulda o'zbekcha **sentiment** 0.500 bergandi. Bu yerda **NER** ancha yaxshiroq — chunki NER ko'proq **shaklga** *(bosh harf, morfologiya, pozitsiya)*, sentiment esa **ma'noga** tayanadi.
>
> ## ⚠️ **Lekin ishonmang — O'LCHANG.** 29-moduldagi `uz_tayyorlik()` testini ishlating.

</details>

---

## 🧠 O'zini tekshirish savollari

1. `pipeline` ning uchta vazifasi?
2. Standart modelni qanday bilish mumkin?
3. Zero-shot qanday ishlaydi?
4. Model Hub'da nimaga qarash kerak?
5. `transformers` 5.x da qaysi pipeline'lar olib tashlangan?

<details>
<summary>✅ Javoblar</summary>

1. Modelga **ulanish** · **kirish berish** · **natija olish**.
2. `p.model.name_or_path`.
3. Model **umumiy bilimi** yordamida **hech qachon ko'rmagan yorliqlar** bo'yicha tasniflaydi.
4. Yuklashlar · yangilanish · model card · **litsenziya** · hajm.
5. `summarization`, `translation_*`, `text2text-generation` — endi `AutoModelForSeq2SeqLM` orqali.

</details>

---

## 📌 Xulosa

```
pipeline() — BIR QATORDA MODEL

  pipeline("sentiment-analysis")(matn)
       →  [{'label': 'POSITIVE', 'score': 0.9998}]


⚠️ STANDART MODEL
   pipeline("sentiment-analysis")
      →  distilbert-base-uncased-finetuned-sst-2-english

   ❌ ishlab chiqarishda model KO'RSATMASLIK
        →  versiya bilan O'ZGARISHI mumkin
   ✅ model="..." DOIM yozing


ASOSIY PIPELINE'LAR
   sentiment-analysis · ner · zero-shot-classification
   text-generation · fill-mask · question-answering

   ⚠️ 5.x da OLIB TASHLANGAN:
      summarization · translation_* · text2text-generation
      →  endi AutoModelForSeq2SeqLM orqali


💡 aggregation_strategy="simple"  (NER uchun)
   ❌ 'New' '##Y' '##ork' 'City'
   ✅ 'New York City'


PIPELINE ICHIDA NIMA BOR?
   ① tokenizatsiya  ② tensor  ③ model
   ④ softmax        ⑤ yorliq
        ↑
   5-DARSDA buni QO'LDA bajaramiz


🔍 MODEL TANLASH
   yuklashlar · yangilanish · model card · LITSENZIYA · hajm
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Pipeline | *pipeline* | Tayyor vazifa oqimi |
| Standart model | *default model* | Ko'rsatilmasa ishlatiladigan model |
| Zero-shot | *zero-shot* | O'qitishsiz tasniflash |
| Nomzod yorliqlar | *candidate labels* | Tasniflash variantlari |
| Model Hub | *model hub* | Modellar ombori |
| Abstraksiya | *abstraction* | Tafsilotlarni yashirish |

---

⬅️ [Oldingi: Hugging Face paketi](01-Hugging-Face-Package.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Oldindan o'qitilgan tokenizatorlar](03-Pre-trained-Tokenizers.md)
