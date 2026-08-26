# 5-dars. Hugging Face va PyTorch/TensorFlow

## 🎬 Boshlashdan oldin

> **"Hugging Face bizga PyTorch va TensorFlow ish oqimlari bilan ishlashni oson qiladi."**
>
> ## **"Bu katta til modellarini sizda ALLAQACHON MAVJUD bo'lgan mashinali o'qitish yechimlariga INTEGRATSIYA qilishda foydali. Va bu bizga har qanday modelni SOZLASH usulini beradi."**

> ## 🎯 **BU DARSDA BIZ 2-DARSDAGI `pipeline()` NI QO'LDA TAKRORLAYMIZ** — va natija **bir xil** chiqishini ko'ramiz.

---

## 1. PyTorch yoki TensorFlow?

> **"Bu yerda biz Hugging Face va PyTorch bilan ishlashni boshlashni tanishtiramiz."**
>
> ## **"Agar TensorFlow bilan ishlashni xohlasangiz, kod deyarli BIR XIL. Siz shunchaki TensorFlow'ga xos sinflarni ishlatasiz — odatda bu nomga `TF` qo'shilgan BIR XIL sinf nomlari."**

```python
# PyTorch                              # TensorFlow
AutoModelForSequenceClassification     TFAutoModelForSequenceClassification
AutoModel                              TFAutoModel
return_tensors="pt"                    return_tensors="tf"
```

> ## 💡 **Biz PyTorch ishlatamiz** — u NLP sohasida **ancha keng tarqalgan** va `transformers` uchun **asosiy** freymvork.

---

## 2. Import va tayyorgarlik

> **"Transformers'dan `pipeline`, `AutoTokenizer` va `AutoModelForSequenceClassification` ni import qilmoqchimiz. Shuningdek, `torch` paketini ham import qilamiz."**

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import (pipeline, AutoTokenizer,
                          AutoModelForSequenceClassification)

model_nomi = "distilbert-base-uncased-finetuned-sst-2-english"
jumla = "I am so excited to be learning about large language models"
```

> **"Bu — matnni ijobiy yoki salbiy deb tasniflay oladigan, Hugging Face modellar sahifasidan olingan SOZLANGAN model."**

---

## 3. ⭐ `return_tensors="pt"`

> ## **"PyTorch uchun natijani to'g'ri formatda olish maqsadida kirish embeddinglari TENZOR sifatida qaytarilishini ko'rsatishimiz kerak."**

```python
tokenizer = AutoTokenizer.from_pretrained(model_nomi)

# ❌ tenzorsiz — oddiy Python ro'yxati
print(tokenizer(jumla)["input_ids"])

# ✅ tenzor bilan
ids = tokenizer(jumla, return_tensors="pt")
print(ids["input_ids"])
```

```
[101, 1045, 2572, 2061, 7568, 2000, 2022, 4083, 2055, 2312, 2653, 4275, 102]

tensor([[ 101, 1045, 2572, 2061, 7568, 2000, 2022, 4083, 2055, 2312, 2653, 4275, 102]])
```

> ## 🔑 **IKKI FARQ:**
> ```
> ① tensor(...)  →  PyTorch obyekti (model shuni kutadi)
> ② [[ ... ]]    →  IKKI o'lchamli!  (batch o'lchami qo'shildi)
>
>    shakl: (1, 13)  =  1 ta jumla × 13 ta token
> ```
>
> ## 💡 **`batch` o'lchami MAJBURIY** — model **doim** bir nechta jumla kutadi, hatto bitta bo'lsa ham.

---

## 4. 💻 Qo'lda inferens — BESH QADAM

> **"Endi modelimizni yaratamiz. `AutoModelForSequenceClassification.from_pretrained` dan foydalanamiz."**
>
> ## **"Endi biz o'z inferensimizni bajarish uchun kirishlarimizda PyTorch'dan foydalanishga tayyormiz. `torch.no_grad()` bilan model'ni input IDs ustida ishga tushirib LOGITLARNI olamiz."**

```python
model = AutoModelForSequenceClassification.from_pretrained(model_nomi)

# ① TOKENIZATSIYA
ids = tokenizer(jumla, return_tensors="pt")
print("① input_ids:", ids["input_ids"])

# ② MODEL (forward pass)
with torch.no_grad():
    logits = model(**ids).logits
print("② logits   :", logits)

# ③ ARGMAX
pred_id = logits.argmax().item()
print("③ pred id  :", pred_id)

# ④ YORLIQ
print("④ id2label :", model.config.id2label)
print("   YORLIQ  :", model.config.id2label[pred_id])

# ⑤ ISHONCH (softmax)
print("⑤ softmax  :", torch.softmax(logits, dim=-1))
```

```
① input_ids: tensor([[ 101, 1045, 2572, 2061, 7568, 2000, 2022, 4083, 2055, 2312, 2653, 4275, 102]])
② logits   : tensor([[-3.9707,  4.2408]])
③ pred id  : 1
④ id2label : {0: 'NEGATIVE', 1: 'POSITIVE'}
   YORLIQ  : POSITIVE
⑤ softmax  : tensor([[2.7145e-04, 9.9973e-01]])
```

> ## **"Bu, mohiyatan, biz `pipeline` funksiyasidan foydalanganimizda YASHIRIN TARZDA sodir bo'ladigan narsa."**

---

## 5. 🏆 `pipeline` bilan SOLISHTIRAMIZ

```python
p = pipeline("sentiment-analysis", model=model_nomi)
print("pipeline:", p(jumla))
```

```
pipeline: [{'label': 'POSITIVE', 'score': 0.9997285008430481}]
```

## 💥 TAQQOSLASH

```
QO'LDA    →  YORLIQ: POSITIVE   softmax: 9.9973e-01  =  0.99973
PIPELINE  →  label: 'POSITIVE'  score:   0.9997285
                    ↑                        ↑
              BIR XIL YORLIQ           BIR XIL BALL
```

> ## 🏆 **`pipeline()` — SEHR EMAS.** U aynan shu **besh qadamni** bajaradi:
> ```
> ① tokenizer(matn, return_tensors="pt")
> ② model(**ids).logits
> ③ logits.argmax()
> ④ model.config.id2label[...]
> ⑤ torch.softmax(logits)
> ```
>
> ## 💡 **30-modulda transformerni QO'LDA hisoblagandik** *(farq 0.0)*. Endi **butun quvurni** qo'lda takrorladik.

### 🔬 `logits` nima?

```
logits = tensor([[-3.9707,  4.2408]])
                     ↑         ↑
                 NEGATIVE   POSITIVE
                  (xom ball)  (xom ball)

  softmax  →  [0.00027, 0.99973]
                            ↑
                    99.973% ishonch
```

> ## 🔑 **30-modul, 9-darsni eslang:** `logits` — **softmax'dan OLDINGI** xom ballar. Ular **manfiy** ham bo'lishi mumkin va **yig'indisi 1 emas**.

### ⚠️ `torch.no_grad()` nima uchun?

```python
with torch.no_grad():       # ⭐ gradientlarni HISOBLAMA
    logits = model(**ids).logits
```

> ## 🔑 **Ikki foyda:**
> ```
> ① XOTIRA tejaladi  →  gradientlar saqlanmaydi
> ② TEZROQ ishlaydi  →  ortga tarqalish grafigi qurilmaydi
> ```
>
> ## ⚠️ **Faqat INFERENS uchun.** Modelni **o'qitayotganda** gradientlar **kerak** — u yerda `no_grad()` **ishlatmang**.

---

## 6. Nima uchun bu MUHIM?

> ## **"Lekin PyTorch, TensorFlow va Hugging Face bilan shu tarzda ishlay olish bizga modellarimizni MOSLASHTIRISH va `pipeline` kabi ABSTRAKT usullardan foydalanganimizda NIMA SODIR BO'LAYOTGANINI TUSHUNISH uchun juda ko'p imkoniyat berishini anglatadi."**

| Nima uchun qo'lda ishlash kerak? | Misol |
|---|---|
| 🔧 **Moslashtirish** | O'z `threshold`ingiz *(0.5 emas, 0.8)* |
| 📊 **Barcha ballarni olish** | `pipeline` faqat **eng yaxshisini** beradi |
| ⚡ **Batch qayta ishlash** | 1000 ta jumlani **bir vaqtda** |
| 🎯 **Fine-tuning** | ## **34-modul** — bu **shart** |
| 🔬 **Nosozlik tuzatish** | Qaysi qadamda xato? |

### 💻 Misol — barcha ballarni olish

```python
matnlar = ["I love this", "I hate this", "It was okay"]
ids = tokenizer(matnlar, padding=True, truncation=True, return_tensors="pt")

with torch.no_grad():
    logits = model(**ids).logits

probs = torch.softmax(logits, dim=-1)
for m, p_ in zip(matnlar, probs):
    print(f"{m:16s} NEG={float(p_[0]):.4f}  POS={float(p_[1]):.4f}")
```

> ## 🔑 **`pipeline` sizga faqat G'OLIBNI beradi.** Qo'lda ishlaganda **ikkala ballni** ham ko'rasiz — bu **ishonchsiz** holatlarni topish uchun **muhim**.
>
> ```
> POS=0.99  →  ishonchli
> POS=0.52  →  ⚠️ deyarli TANGA TASHLASH — tekshiring!
> ```
>
> ## 💡 **29-modulni eslang:** o'zbekcha *"juda ajoyib"* → `NEGATIVE` **0.956** ball bilan. Ballarni ko'rmasangiz — buni **bilmaysiz**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `return_tensors="pt"` nima qiladi?

**M2.** `logits` nima?

**M3.** `torch.no_grad()` nima uchun?

<details>
<summary>✅ Javoblar</summary>

**M1.** Natijani **PyTorch tenzori** sifatida qaytaradi *(va `batch` o'lchamini qo'shadi)*.

**M2.** **Softmax'dan oldingi** xom ballar — manfiy bo'lishi mumkin, yig'indisi 1 emas.

**M3.** **Gradientlarni hisoblamaydi** → **xotira** tejaladi va **tezroq** ishlaydi *(faqat inferens uchun)*.

</details>

### 🟡 O'rta

**M4.** ⭐ `pipeline` ning besh qadamini qo'lda takrorlang.

**M5.** `id2label` nima uchun kerak?

<details>
<summary>✅ Javoblar</summary>

**M4.** 4-bo'limdagi kodni ishlating. Natija **pipeline bilan bir xil**:
```
QO'LDA    →  POSITIVE, 0.99973
PIPELINE  →  POSITIVE, 0.9997285
```

**M5.** Model **raqam** qaytaradi *(0 yoki 1)*. `id2label` uni **yorliqqa** aylantiradi:
```python
{0: 'NEGATIVE', 1: 'POSITIVE'}
```
> ⚠️ **Har modelda BOSHQACHA bo'lishi mumkin!** Ba'zi modellarda `{0: 'LABEL_0', 1: 'LABEL_1'}` — bunday holda **model card** ni o'qing.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Batch qayta ishlash bilan **ishonchsiz** bashoratlarni toping.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

MATNLAR = [
    "I absolutely love this product",
    "This is the worst thing ever",
    "It was okay I guess",
    "Not bad, but not great either",
    "The book arrived on time",
]

ids = tokenizer(MATNLAR, padding=True, truncation=True, return_tensors="pt")
with torch.no_grad():
    probs = torch.softmax(model(**ids).logits, dim=-1)

r = []
for m, p_ in zip(MATNLAR, probs):
    neg, pos = float(p_[0]), float(p_[1])
    ishonch = max(neg, pos)
    r.append({"matn": m[:32], "NEG": round(neg, 4), "POS": round(pos, 4),
              "yorliq": "POSITIVE" if pos > neg else "NEGATIVE",
              "belgi": "⚠️" if ishonch < 0.9 else "✅"})
df = pd.DataFrame(r)
print(df.to_string(index=False))
print(f"\n⚠️ Ishonchsiz: {(df.belgi == '⚠️').sum()} / {len(df)}")
```

> ## 🔑 **`⚠️` belgisi — ENG MUHIM ustun.**
>
> ```
> "It was okay I guess"          →  noaniq matn  →  past ishonch kutiladi
> "Not bad, but not great"       →  ikki tomonlama  →  past ishonch
> "The book arrived on time"     →  NEYTRAL  →  model MAJBURAN tanlaydi!
> ```
>
> ## 💥 **UCHINCHI HOLATGA ALOHIDA E'TIBOR:** *"The book arrived on time"* — bu **neytral** jumla. Lekin model **faqat ikkita** yorliqni biladi *(POSITIVE/NEGATIVE)* — u **majburan** bittasini tanlaydi.
>
> ## ⚠️ **Bu — model kamchiligi emas, VAZIFA kamchiligi.** Agar sizga **neytral** kerak bo'lsa:
> ```
> ① Uch sinfli model tanlang (cardiffnlp/twitter-roberta-base-sentiment)
> ② Yoki ishonch chegarasi qo'ying: 0.6 dan past = "neytral"
> ```

</details>

**M7.** ⭐⭐ TensorFlow versiyasini yozing *(agar `tensorflow` o'rnatilgan bo'lsa)*.

<details>
<summary>✅ Yechim</summary>

```python
# pip install tensorflow
from transformers import TFAutoModelForSequenceClassification
import tensorflow as tf

model_tf = TFAutoModelForSequenceClassification.from_pretrained(model_nomi)
ids_tf = tokenizer(jumla, return_tensors="tf")       # ⭐ "tf", "pt" emas
logits_tf = model_tf(**ids_tf).logits
print(tf.nn.softmax(logits_tf))
```

> ## 🔑 **Deyarli bir xil kod:**
> ```
> AutoModelFor...    →  TFAutoModelFor...
> return_tensors="pt" →  return_tensors="tf"
> torch.softmax      →  tf.nn.softmax
> torch.no_grad()    →  kerak emas (TF eager rejimda)
> ```
>
> ⚠️ **Agar `tensorflow` o'rnatilmagan bo'lsa** — bu mashqni **o'tkazib yuboring**. Amalda **PyTorch yetarli**, va `transformers` uni **asosiy** freymvork sifatida qo'llab-quvvatlaydi.

</details>

---

## 🧠 O'zini tekshirish savollari

1. `return_tensors="pt"` nima qiladi?
2. `pipeline` ning besh qadami?
3. `logits` va `softmax` farqi?
4. `no_grad()` qachon ishlatiladi?
5. Nima uchun qo'lda ishlash foydali?

<details>
<summary>✅ Javoblar</summary>

1. PyTorch **tenzori** qaytaradi + **batch** o'lchamini qo'shadi.
2. tokenizatsiya → model → `argmax` → `id2label` → `softmax`.
3. `logits` — **xom** ballar *(manfiy bo'lishi mumkin)* · `softmax` — **ehtimolliklar** *(yig'indi 1)*.
4. Faqat **inferensda** *(o'qitishda EMAS)* — xotira va tezlik uchun.
5. **Moslashtirish** · **barcha ballarni ko'rish** · **batch** · **fine-tuning** · **nosozlik tuzatish**.

</details>

---

## 📌 Xulosa

```
pipeline() NI QO'LDA TAKRORLAYMIZ

  ① tokenizer(matn, return_tensors="pt")
       →  tensor([[101, 1045, ..., 102]])   shakl (1, 13)

  ② with torch.no_grad():
         logits = model(**ids).logits
       →  tensor([[-3.9707,  4.2408]])

  ③ logits.argmax().item()        →  1

  ④ model.config.id2label[1]      →  'POSITIVE'

  ⑤ torch.softmax(logits, -1)     →  [0.00027, 0.99973]


🏆 SOLISHTIRISH
   QO'LDA    →  POSITIVE   0.99973
   PIPELINE  →  POSITIVE   0.9997285
                  ↑
            BIR XIL NATIJA


🔥 PyTorch  ↔  TensorFlow
   AutoModelFor...     →  TFAutoModelFor...
   return_tensors="pt" →  return_tensors="tf"
   torch.softmax       →  tf.nn.softmax


⚠️ torch.no_grad()
   ✅ inferensda   (xotira + tezlik)
   ❌ o'qitishda   (gradientlar KERAK)


NIMA UCHUN QO'LDA?
   🔧 moslashtirish   📊 BARCHA ballar   ⚡ batch
   🎯 fine-tuning     🔬 nosozlik tuzatish

   💡 pipeline faqat G'OLIBNI beradi
      qo'lda  →  POS=0.52 kabi ISHONCHSIZ holatlarni ko'rasiz
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Tenzor | *tensor* | Ko'p o'lchamli massiv |
| Logits | *logits* | Softmax'dan oldingi xom ballar |
| Inferens | *inference* | Model bilan bashorat qilish |
| Forward pass | *forward pass* | Modeldan o'tkazish |
| Batch | *batch* | Bir vaqtda qayta ishlanadigan to'plam |
| `id2label` | *id2label* | Raqam → yorliq lug'ati |

---

⬅️ [Oldingi: Maxsus tokenlar](04-Special-Tokens.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Modellarni saqlash va yuklash](06-Saving-and-Loading-Models.md)
