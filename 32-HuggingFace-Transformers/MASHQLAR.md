# 📝 32-modul mashqlari

> **38 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **HAMMASI BEPUL** — bu modulda API kaliti **umuman** kerak emas.

## ⚙️ Tayyorgarlik

```bash
pip install transformers torch pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import torch, pandas as pd
from transformers import (pipeline, AutoTokenizer, AutoModel,
                          AutoModelForSequenceClassification)

M = "distilbert-base-uncased-finetuned-sst-2-english"
JUMLA = "I am so excited to be learning about large language models"
```

---

# 🟢 OSON *(1–12)*

**M1.** Hugging Face qachon tashkil etilgan?

**M2.** Eng mashhur paketi qaysi?

**M3.** `pipeline` nima qiladi?

**M4.** *"No model was supplied"* nima degani?

**M5.** Tokenizator uchta nima qaytaradi?

**M6.** 101 va 102 nima?

<details>
<summary>✅ Javoblar M1–M6</summary>

**M1.** ## **2016-yil** *(nomi emoji 🤗 dan)*.

**M2.** ## **`transformers`**.

**M3.** Modelga **ulanish**, **kirish berish**, **natija olish** — bir necha qatorda.

**M4.** Model **ko'rsatilmadi** → **standart** model ishlatildi.

**M5.** `input_ids` · `token_type_ids` · `attention_mask`.

**M6.** ## `[CLS]` va `[SEP]` — **maxsus tokenlar**.

</details>

**M7.** `[MASK]` nima uchun?

**M8.** `return_tensors="pt"` nima qiladi?

**M9.** `logits` nima?

**M10.** `torch.no_grad()` nima uchun?

**M11.** Model qanday saqlanadi?

**M12.** Nechta fayl yaratiladi?

<details>
<summary>✅ Javoblar M7–M12</summary>

**M7.** **Yetishmayotgan so'zni** bashorat qilish — BERT'ning asosiy vazifasi *(MLM)*.

**M8.** **PyTorch tenzori** qaytaradi + **batch** o'lchamini qo'shadi.

**M9.** **Softmax'dan oldingi** xom ballar.

**M10.** **Gradientlarni hisoblamaydi** → xotira + tezlik *(faqat inferensda)*.

**M11.** ## **`save_pretrained(katalog)`**.

**M12.** **To'rtta** — `config.json`, `model.safetensors`, `tokenizer.json`, `tokenizer_config.json`.

</details>

---

# 🟡 O'RTA *(13–28)*

### Pipeline

**M13.** ⭐ Standart modelni aniqlang.

<details>
<summary>✅ Yechim</summary>

```python
p = pipeline("sentiment-analysis")
print(p.model.name_or_path)
print(f"{sum(x.numel() for x in p.model.parameters()):,} parametr")
```
```
distilbert/distilbert-base-uncased-finetuned-sst-2-english
66,955,010 parametr
```
> ⚠️ **Ishlab chiqarishda modelni DOIM ko'rsating** — standart model **versiya bilan o'zgaradi**.

</details>

**M14.** ⭐ NER ni `aggregation_strategy` **bilan va busiz** sinang.

<details>
<summary>✅ Yechim</summary>

```python
M_NER = "dbmdz/bert-large-cased-finetuned-conll03-english"
MATN = "Her name is Anna and she works in New York City for Morgan Stanley."

print("=== agg=simple ===")
for r in pipeline("ner", model=M_NER, aggregation_strategy="simple")(MATN):
    print(f"  {r['entity_group']:8s} {r['score']:.3f}  {r['word']}")

print("=== agg YO'Q ===")
for r in pipeline("ner", model=M_NER)(MATN)[:6]:
    print(f"  {r['entity']:8s} {r['score']:.3f}  {r['word']}")
```
```
=== agg=simple ===
  PER      0.999  Anna
  LOC      1.000  New York City
  ORG      0.999  Morgan Stanley
=== agg YO'Q ===
  I-PER    0.999  Anna
  I-LOC    1.000  New
  I-LOC    1.000  York
  I-LOC    1.000  City
  I-ORG    0.999  Morgan
  I-ORG    0.999  Stanley
```
> ## 🔑 **`New York City` — uchta alohida obyektga bo'lindi.** `aggregation_strategy="simple"` **deyarli doim** kerak.

</details>

**M15.** ⭐⭐ Zero-shot ni ingliz va o'zbek tilida sinang.

<details>
<summary>✅ Yechim</summary>

```python
zs = pipeline("zero-shot-classification",
              model="valhalla/distilbart-mnli-12-1")

for matn, yorliqlar in [
    ("One day I will see the world",              ["travel", "cooking", "dancing"]),
    ("Bir kun butun dunyoni ko'raman",            ["sayohat", "ovqat", "raqs"]),
    ("Mahsulot juda sifatsiz, pulimni qaytaring", ["shikoyat", "maqtov", "savol"]),
]:
    r = zs(matn, candidate_labels=yorliqlar)
    print(f"\n{matn}")
    for l, s in zip(r["labels"], r["scores"]):
        print(f"  {l:10s} {s:.4f}")
```
```
One day I will see the world
  travel     0.9427      ✅
  cooking    0.0289
  dancing    0.0284

Bir kun butun dunyoni ko'raman
  raqs       0.3730      ❌ RAQS?!
  sayohat    0.3662      ← to'g'ri javob, IKKINCHI
  ovqat      0.2608

Mahsulot juda sifatsiz, pulimni qaytaring
  maqtov     0.4825      ❌❌ MAQTOV?!
  savol      0.3326
  shikoyat   0.1849      ← to'g'ri javob, ENG OXIRIDA
```

> ## 💥 **INGLIZCHA MUKAMMAL, O'ZBEKCHA TASODIF.**
>
> Uchinchi holat — **eng xavflisi**: aniq **shikoyat** `maqtov` deb belgilandi. Mijozlar shikoyatlarini saralaydigan tizimda bu — **falokat**.

</details>

### Tokenizatorlar

**M16.** ⭐ BERT va XLNet tokenizatsiyasini solishtiring.

**M17.** ⭐ Beshta tokenizatorni jadvalga jamlang.

<details>
<summary>✅ Yechim M16–M17</summary>

```python
r = []
for nom in ["bert-base-uncased", "bert-base-cased", "xlnet-base-cased",
            "distilgpt2", "bert-base-multilingual-cased"]:
    t = AutoTokenizer.from_pretrained(nom)
    tk = t.tokenize(JUMLA)
    ids = t(JUMLA)["input_ids"]
    r.append({"model": nom[:30], "lug'at": t.vocab_size, "tokenlar": len(tk),
              "input_ids": len(ids), "maxsus": len(ids) - len(tk),
              "birinchi_3": str(tk[:3])})
print(pd.DataFrame(r).to_string(index=False))
```
```
                       model  lug'at  tokenlar  input_ids  maxsus           birinchi_3
           bert-base-uncased   30522        11         13       2    ['i', 'am', 'so']
             bert-base-cased   28996        11         13       2    ['I', 'am', 'so']
            xlnet-base-cased   32000        11         13       2 ['▁I', '▁am', '▁so']
                  distilgpt2   50257        11         11       0  ['I', 'Ġam', 'Ġso']
bert-base-multilingual-cased  119547        12         14       2    ['I', 'am', 'so']
```
> ## 🔑 **`distilgpt2` → `maxsus = 0`** — GPT maxsus token **qo'shmaydi**. Chunki u **faqat decoder** *(30-modul)*.

</details>

**M18.** ⭐⭐ 🇺🇿 O'zbekcha matnda uchta tokenizatorni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
UZ = "Toshkent O'zbekiston poytaxti. Bu shaharda ko'plab qiziqarli joylar bor."
r = []
for nom in ["bert-base-uncased", "xlnet-base-cased",
            "bert-base-multilingual-cased"]:
    t = AutoTokenizer.from_pretrained(nom)
    tk = t.tokenize(UZ)
    r.append({"model": nom[:30], "lug'at": t.vocab_size,
              "tokenlar": len(tk), "namuna": str(tk[:5])})
print(pd.DataFrame(r).to_string(index=False))
```
```
                       model  lug'at  tokenlar                               namuna
           bert-base-uncased   30522        33  ['to', '##sh', '##ken', '##t', 'o']
            xlnet-base-cased   32000        36      ['▁To', 'sh', 'ken', 't', '▁O']
bert-base-multilingual-cased  119547        26 ['Toshkent', 'O', "'", 'z', '##bek']
```
> ## 🎉 **KO'P TILLI MODEL `Toshkent` NI BUTUN SO'Z SIFATIDA BILADI!**
> ```
> ingliz BERT  →  ['to','##sh','##ken','##t']   4 bo'lak
> ko'p tilli   →  ['Toshkent']                   1 TOKEN  ✅
> ```
> Va jami **28% kamroq** token *(26 vs 36)*.

</details>

### Maxsus tokenlar

**M19.** ⭐ Ikki jumlada `token_type_ids` ni ko'rsating.

**M20.** ⭐ Uchta modelning maxsus tokenlarini solishtiring.

<details>
<summary>✅ Javoblar M19–M20</summary>

**M19.**
```python
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
e = tok("The cat sat.", "It was sleepy.")
print(tok.convert_ids_to_tokens(e["input_ids"]))
print(e["token_type_ids"])
```
```
['[CLS]', 'the', 'cat', 'sat', '.', '[SEP]', 'it', 'was', 'sleepy', '.', '[SEP]']
[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
```

**M20.**
```
bert-base-uncased  ['[UNK]', '[SEP]', '[PAD]', '[CLS]', '[MASK]']         5 ta
xlnet-base-cased   ['<s>','</s>','<unk>','<sep>','<pad>','<cls>','<mask>','<eop>','<eod>']  9 ta
distilgpt2         ['<|endoftext|>']                                       1 ta
```

</details>

**M21.** ⭐⭐ `[MASK]` bilan modelning bilimini sinang.

<details>
<summary>✅ Yechim</summary>

```python
fm = pipeline("fill-mask", model="bert-base-uncased")
for s in ["The capital of France is [MASK].",
          "The capital of Uzbekistan is [MASK]."]:
    print(s)
    for r in fm(s)[:3]:
        print(f"   {r['token_str']:12s} {r['score']:.4f}")
```
```
The capital of France is [MASK].
   paris        0.4168      ✅
   lille        0.0714
   lyon         0.0634

The capital of Uzbekistan is [MASK].
   uzbekistan   0.6842      ❌ ma'nosiz!
   tbilisi      0.0715      ❌ Gruziya
   moscow       0.0402      ❌ Rossiya
```
> ## 💥 **"Tashkent" TOP-3 DA YO'Q — va ishonch 0.68!**
>
> ## 🔑 **Sabab — MA'LUMOTDAGI VAKILLIK.** Bu — 28-moduldagi **inklyuzivlik** muammosining o'lchangan namunasi.

</details>

**M22.** ⭐⭐⭐ `[MASK]` bilan **tarafkashlikni** o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
for s in ["The doctor said [MASK] would be late.",
          "The nurse said [MASK] would be late."]:
    print(s)
    for r in fm(s)[:3]:
        print(f"   {r['token_str']:6s} {r['score']:.4f}")
```
```
The doctor said [MASK] would be late.
   he     0.3633
   she    0.3178
   i      0.0961

The nurse said [MASK] would be late.
   she    0.5556
   he     0.1442
   i      0.1029
```

> ## 💥 **TARAFKASHLIK O'LCHANDI:**
> ```
>              he       she     nisbat
>  doctor    0.3633   0.3178   he 1.14×
>  nurse     0.1442   0.5556   she 3.85×   ⚠️⚠️
> ```
>
> ## 🔑 **Stereotip "hamshira = ayol" ANCHA KUCHLI** *(3.85×)*, "shifokor = erkak" esa zaif *(1.14×)*.
>
> ## ⚠️ **Har bir modelni ishlab chiqarishga chiqarishdan OLDIN shu testni o'tkazing.** 68–76-modullar aynan shu haqda.

</details>

### PyTorch

**M23.** ⭐⭐ `pipeline` ning besh qadamini **qo'lda** takrorlang.

<details>
<summary>✅ Yechim</summary>

```python
tokenizer = AutoTokenizer.from_pretrained(M)
model = AutoModelForSequenceClassification.from_pretrained(M)

ids = tokenizer(JUMLA, return_tensors="pt")
with torch.no_grad():
    logits = model(**ids).logits
pred = logits.argmax().item()

print("logits  :", logits)
print("YORLIQ  :", model.config.id2label[pred])
print("softmax :", torch.softmax(logits, dim=-1))
print("pipeline:", pipeline("sentiment-analysis", model=M)(JUMLA))
```
```
logits  : tensor([[-3.9707,  4.2408]])
YORLIQ  : POSITIVE
softmax : tensor([[2.7145e-04, 9.9973e-01]])
pipeline: [{'label': 'POSITIVE', 'score': 0.9997285008430481}]
```
> ## 🏆 **QO'LDA 0.99973 · PIPELINE 0.9997285 — BIR XIL.**

</details>

**M24.** ⭐⭐ Batch qayta ishlab, **ishonchsiz** bashoratlarni toping.

<details>
<summary>✅ Yechim</summary>

```python
MATNLAR = ["I absolutely love this product",
           "This is the worst thing ever",
           "It was okay I guess",
           "Not bad, but not great either",
           "The book arrived on time"]

ids = tokenizer(MATNLAR, padding=True, truncation=True, return_tensors="pt")
with torch.no_grad():
    probs = torch.softmax(model(**ids).logits, dim=-1)

r = []
for m, p_ in zip(MATNLAR, probs):
    neg, pos = float(p_[0]), float(p_[1])
    r.append({"matn": m[:30], "NEG": round(neg, 4), "POS": round(pos, 4),
              "belgi": "⚠️" if max(neg, pos) < 0.9 else "✅"})
print(pd.DataFrame(r).to_string(index=False))
```
> ## 🔑 **`pipeline` faqat G'OLIBNI beradi.** Qo'lda ishlaganda **ikkala ballni** ko'rasiz.
>
> ⚠️ *"The book arrived on time"* — **neytral** jumla, lekin model **majburan** POSITIVE/NEGATIVE tanlaydi. Bu — **vazifa** kamchiligi, model emas.

</details>

### Saqlash

**M25.** ⭐ Modelni saqlab, natija **bir xil** ekanini isbotlang.

<details>
<summary>✅ Yechim</summary>

```python
import tempfile, os
KATALOG = tempfile.mkdtemp()

tokenizer.save_pretrained(KATALOG)
model.save_pretrained(KATALOG)
print("fayllar:", sorted(os.listdir(KATALOG)))

t2 = AutoTokenizer.from_pretrained(KATALOG)
m2 = AutoModelForSequenceClassification.from_pretrained(KATALOG)
with torch.no_grad():
    l2 = m2(**t2(JUMLA, return_tensors="pt")).logits
print("BIR XILMI?", bool(torch.allclose(logits, l2)))
```
```
fayllar: ['config.json', 'model.safetensors', 'tokenizer.json', 'tokenizer_config.json']
BIR XILMI? True
```

</details>

**M26.** `safetensors` nima uchun `.bin` dan yaxshiroq?

**M27.** Nima uchun ishlab chiqarishda modelni saqlash kerak?

**M28.** Model tanlashda qaysi 5 mezon?

<details>
<summary>✅ Javoblar M26–M28</summary>

**M26.**
```
❌ .bin          →  pickle  →  yuklashda KOD BAJARILISHI mumkin
✅ .safetensors  →  faqat RAQAMLAR  →  XAVFSIZ
```

**M27.** Hub'dagi model **yangilanishi** yoki **o'chirilishi** mumkin → tizimingiz **ishlamay qoladi**.

**M28.** Yuklashlar · yangilanish · model card · ## **litsenziya** · hajm.

</details>

---

# 🔴 QIYIN *(29–38)*

**M29.** ⭐⭐⭐ 🇺🇿 O'zbekcha NER ni sinang va **halol** baholang.

<details>
<summary>✅ Yechim</summary>

```python
ner = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english",
               aggregation_strategy="simple")
UZ = "Uning ismi Anna va u Toshkent shahrida Kapitalbankda ishlaydi."
for r in ner(UZ):
    print(f"  {r['entity_group']:8s} {r['score']:.3f}  {r['word']}")
```
```
  ORG      0.567  Anna              ❌ shaxs bo'lishi kerak
  LOC      0.963  Toshkent          ✅ TO'G'RI!
  LOC      0.551  ##ha              ❌ bu SO'Z emas
  ORG      0.942  Kapitalbankda     ✅ TO'G'RI!
```

> ## 🤯 **IKKITA TO'G'RI — YUQORI ISHONCH BILAN.**
>
> `Kapitalbankda` — model bu so'zni **hech qachon ko'rmagan** *(o'zbekcha, `-da` qo'shimchasi bilan)*, baribir **0.942** ishonch bilan **tashkilot** deb topdi.
>
> ## ✅ **ODDIY FILTR IKKALA XATONI HAM YO'QOTADI:**
> ```python
> natijalar = [r for r in ner(UZ) if r["score"] > 0.9]
> #  →  faqat Toshkent (0.963) va Kapitalbankda (0.942)
> ```
>
> ## 🔑 **UMUMIY QOIDA:**
> ```
> ATOQLI OTLAR   →  tillar orasida QISMAN o'tadi   ⚠️✅
> MA'NO          →  TILGA BOG'LIQ                  ❌
> ```

</details>

**M30.** ⭐⭐ NER, sentiment va zero-shot ni o'zbekchada **solishtiring**.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
UZ = "Mahsulot juda sifatsiz, Toshkentdagi do'kondan sotib oldim"

print("SENTIMENT:", pipeline("sentiment-analysis", model=M)(UZ))
print("NER      :", [(r["entity_group"], r["word"], round(r["score"],2))
                     for r in ner(UZ)])
print("ZERO-SHOT:", zs(UZ, candidate_labels=["shikoyat","maqtov"])["labels"][0])
```

> ## 🎯 **KUTILGAN NAQSH — VAZIFAGA QARAB FARQ:**
> ```
> NER        →  ⚠️ QISMAN ishlaydi   (atoqli otlar o'tadi)
> SENTIMENT  →  ❌ ishonchsiz        (ma'no kerak)
> ZERO-SHOT  →  ❌ tasodifiy         (matn ham, yorliq ham begona)
> ```
>
> ## 💡 **XULOSA:** o'zbek tilida **shaklga** tayanadigan vazifalar *(NER)* **qisman** ishlaydi, **ma'noga** tayanadiganlar *(sentiment, zero-shot)* — **yo'q**.

</details>

**M31.** ⭐⭐ Kesh boshqaruvchisi yozing.

**M32.** ⭐⭐ Model boshqaruvchisi yozing *(saqlash + metadata + ro'yxat)*.

**M33.** ⭐⭐ Modelning barcha qatlamlarini ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
mod = AutoModel.from_pretrained(M)
r = []
for nom, p in mod.named_parameters():
    r.append({"nom": nom[:44], "shakl": str(tuple(p.shape)), "soni": p.numel()})
df = pd.DataFrame(r)
print(df.nlargest(6, "soni").to_string(index=False))
print(f"\nJAMI: {df.soni.sum():,}")
```
> 🔑 30-modulda buni **batafsil** ko'rgandik: `word_embeddings` — **23 440 896** *(35%)*.

</details>

**M34.** ⭐⭐ Turli vazifalar uchun **avtomatik** model tanlovchi yozing.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
TAVSIYALAR = {
    ("sentiment", "en"): "distilbert-base-uncased-finetuned-sst-2-english",
    ("sentiment", "uz"): None,           # ⚠️ ishonchli variant YO'Q
    ("ner", "en"):       "dbmdz/bert-large-cased-finetuned-conll03-english",
    ("ner", "uz"):       "Davlan/bert-base-multilingual-cased-ner-hrl",
    ("fill-mask", "en"): "bert-base-uncased",
    ("fill-mask", "uz"): "bert-base-multilingual-cased",
}

def model_tavsiya(vazifa, til="en"):
    m = TAVSIYALAR.get((vazifa, til))
    if m is None:
        print(f"⚠️ {vazifa}/{til} uchun ishonchli tayyor model YO'Q.")
        print("   ✅ Tavsiya: 28-moduldagi sklearn yondashuvi")
        print("      (50-100 ta yorliqli misol yig'ing)")
        return None
    print(f"✅ {vazifa}/{til}  →  {m}")
    return m

model_tavsiya("sentiment", "en")
model_tavsiya("sentiment", "uz")
```

> ## 🔑 **`None` qaytarish — ENG MUHIM qism.** *"Ishonchli variant yo'q"* deb aytish — **yomon variantni tavsiya qilishdan** ancha halolroq.
>
> ⚠️ **Har qanday tavsiyani 29-moduldagi `uz_tayyorlik()` testi bilan TEKSHIRING.**

</details>

**M35.** ⭐⭐⭐ Tokenizator + model **mos kelmasa** nima bo'ladi?

<details>
<summary>✅ Yechim</summary>

```python
# ⚠️ ATAYLAB NOTO'G'RI: BERT tokenizatori + distilbert modeli LUG'ATI boshqa
tok_xlnet = AutoTokenizer.from_pretrained("xlnet-base-cased")
model_bert = AutoModelForSequenceClassification.from_pretrained(M)

ids_notogri = tok_xlnet(JUMLA, return_tensors="pt")
ids_togri = tokenizer(JUMLA, return_tensors="pt")

print("XLNet ids:", ids_notogri["input_ids"][0][:6].tolist())
print("BERT  ids:", ids_togri["input_ids"][0][:6].tolist())

with torch.no_grad():
    l_notogri = model_bert(input_ids=ids_notogri["input_ids"]).logits
    l_togri = model_bert(**ids_togri).logits

print("\nNOTO'G'RI:", l_notogri, "→", model_bert.config.id2label[l_notogri.argmax().item()])
print("TO'G'RI  :", l_togri, "→", model_bert.config.id2label[l_togri.argmax().item()])
```

```
XLNet ids: [35, 569, 102, 5564, 22, 39]
BERT  ids: [101, 1045, 2572, 2061, 7568, 2000]

NOTO'G'RI: tensor([[ 0.8859, -0.7180]]) → NEGATIVE
TO'G'RI  : tensor([[-3.9707,  4.2408]]) → POSITIVE
```

## 💥 JAVOB TESKARI AYLANDI — VA HECH QANDAY XATO YO'Q

```
Bir xil jumla:  "I am so excited to be learning..."

  TO'G'RI tokenizator  →  POSITIVE   ✅
  NOTO'G'RI tokenizator →  NEGATIVE   ❌
                              ↑
              Kod ISHLADI. Xato YO'Q. Natija TESKARI.
```

> ## ⚠️ **NATIJA — XATO BERMAYDI, LEKIN NATIJA MA'NOSIZ.**
>
> ```
> Model XATO BERMAYDI  →  chunki raqamlar "yaroqli"
> Lekin u BOSHQA SO'ZLARNI ko'radi  →  natija TASODIFIY
> ```
>
> ## 💥 **BU — ENG XAVFLI XATO TURI:** kod **ishlaydi**, natija **chiqadi**, lekin u **butunlay noto'g'ri**. Va **hech qanday ogohlantirish yo'q**.
>
> ## ✅ **HIMOYA:** har doim `AutoTokenizer` va `AutoModel` ga **BIR XIL** nomni bering:
> ```python
> M = "distilbert-base-uncased-finetuned-sst-2-english"
> tok = AutoTokenizer.from_pretrained(M)      # ⭐ BIR XIL M
> mod = AutoModelForSequenceClassification.from_pretrained(M)
> ```

</details>

**M36.** ⭐⭐ Offline rejimni sinang.

<details>
<summary>✅ Yechim</summary>

```python
# ⚠️ transformers IMPORTIDAN OLDIN o'rnating!
import os
os.environ["HF_HUB_OFFLINE"] = "1"

from transformers import pipeline
p = pipeline("sentiment-analysis",
             model="distilbert-base-uncased-finetuned-sst-2-english")
print(p("I love this"))
```
> ## ⚠️ **`os.environ` ni `transformers` importidan OLDIN** o'rnating — keyin **ta'sir qilmaydi**.
>
> Model **keshda bo'lmasa** — xato beradi. Bu — **ataylab**: offline rejim internetga **umuman** murojaat qilmaydi.

</details>

**M37.** ⭐⭐ Ikki jumlali tasniflash *(NLI)* ni sinang.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
e = tok("A man is eating food.", "A man is eating.")
print(tok.convert_ids_to_tokens(e["input_ids"]))
print(e["token_type_ids"])
```
> 🔑 **Bu — zero-shot ning ichki mexanizmi.** Model *"birinchi jumla ikkinchisini tasdiqlaydimi?"* degan savolga javob beradi. Aynan shuning uchun `token_type_ids` kerak.
>
> 💡 **33-modulda** *(BERT savol-javob)* bu **asosiy** mavzu bo'ladi.

</details>

**M38.** ⭐⭐⭐ **Yakuniy sintez.** 22, 23, 26, 29–32-modullar bir vazifada qanday birlashadi?

<details>
<summary>✅ Namuna javob</summary>

| Vazifa | Vosita | Modul | O'zbekchada |
|---|---|---|---|
| **Sentiment** | `spaCy` yo'q · VADER | 23 | ❌ |
| **Sentiment** | `sklearn` | 26 | ## ✅ **ENG YAXSHI** |
| **Sentiment** | `pipeline()` | 29, 32 | ❌ **0.500** |
| **NER** | `spaCy` | 22 | ❌ model yo'q |
| **NER** | `pipeline("ner")` | 32 | ## ⚠️ **QISMAN** *(0.94 atoqli otlarda)* |
| **Zero-shot** | `pipeline` | 29, 32 | ❌ **tasodifiy** |
| **Tokenizatsiya** | `AutoTokenizer` | 30, 32 | ⚠️ ko'p tilli **kerak** |
| **RAG qidiruv** | `TfidfVectorizer` | 24, 31 | ## ✅ **80%** |

```
🏆 O'ZBEK TILI UCHUN ISHLAYDIGAN NARSALAR RO'YXATI:

  ✅ sklearn tasniflagich       (26, 28-modul)     — eng ishonchli
  ✅ TF-IDF RAG qidiruvi        (24, 31-modul)     — 80%
  ⚠️ NER (ball > 0.9 filtri)    (32-modul)         — atoqli otlar
  ⚠️ Ko'p tilli tokenizator     (32-modul)         — 28% kamroq token
  ❌ Zero-shot                  (29, 32-modul)     — tasodifiy
  ❌ Tayyor sentiment           (29-modul)         — 0.500

  🔑 QOIDA:  SHAKLGA tayanadigan vazifalar  →  qisman ishlaydi
             MA'NOGA tayanadigan vazifalar  →  o'z modelingiz kerak
```

</details>

---

## 🎯 Yakuniy tekshirish

- [ ] `pipeline` ning beshta qadamini qo'lda takrorlay olasizmi?
- [ ] Tokenizator va model nima uchun juft bo'lishini bilasizmi?
- [ ] `[MASK]` bilan tarafkashlikni o'lchay olasizmi?
- [ ] Modelni saqlab, natija bir xil ekanini isbotlay olasizmi?
- [ ] 🇺🇿 Qaysi vazifalar o'zbekchada ishlashini bilasizmi?

---

⬅️ [6-dars](06-Saving-and-Loading-Models.md) · 🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
