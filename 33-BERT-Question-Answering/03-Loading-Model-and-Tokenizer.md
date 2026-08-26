# 3-dars. Modelni va tokenizatorni yuklash

## 🎬 Boshlashdan oldin

> **"BERT modelidan foydalanishni boshlash uchun Transformers paketidan tegishli funksiyalarni import qilmoqchimiz."**

---

## 1. Import

> **"`from transformers import BertForQuestionAnswering` va `BertTokenizer` ni import qilamiz. Keyinroq foydalanish uchun `torch` paketini ham import qilamiz."**

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import BertForQuestionAnswering, BertTokenizer
```

> ## 💡 **`BertForQuestionAnswering` — 2-darsdagi "vazifaga xos chiqish qatlami" ning aniq nomi.**
>
> ```
> BertModel                       →  faqat encoder (chiqish qatlami YO'Q)
> BertForSequenceClassification   →  + tasniflash qatlami
> BertForTokenClassification      →  + NER qatlami
> BertForQuestionAnswering        →  + START/END qatlami   ⭐ BIZ SHUNI ISHLATAMIZ
> ```

---

## 2. Modelni tanlash

> **"Keyingi ish — bizni qiziqtirgan model va tokenizatorni yuklash. Model nomini ko'rsatamiz."**
>
> ## **"Bu holda biz BERT LARGE UNCASED dan foydalanamiz — va savol-javob uchun SQUAD ma'lumot to'plamida SOZLANGAN versiyasini."**
>
> **"UNCASED qismi shuni anglatadiki, u katta va kichik harfli so'zlarni BIR XIL deb qabul qiladi."**

```python
model_nomi = "bert-large-uncased-whole-word-masking-finetuned-squad"

model = BertForQuestionAnswering.from_pretrained(model_nomi)
tokenizer = BertTokenizer.from_pretrained(model_nomi)

print("parametr:", f"{sum(p.numel() for p in model.parameters()):,}")
```

### 🔍 Model nomini bo'laklarga ajratamiz

```
bert-large-uncased-whole-word-masking-finetuned-squad
 ↑     ↑       ↑           ↑                ↑        ↑
 │     │       │           │                │        └─ SQuAD ma'lumotida
 │     │       │           │                └────────── SOZLANGAN
 │     │       │           └─────────────────────────── butun so'z niqoblash
 │     │       └─────────────────────────────────────── harf registri MUHIM EMAS
 │     └─────────────────────────────────────────────── 340M, 24 qatlam
 └───────────────────────────────────────────────────── BERT oilasi
```

> ## ⚠️ **BU — KATTA MODEL: ~1.3 GB.** Birinchi yuklash **uzoq** davom etadi.
>
> ## 💡 **Kichikroq muqobil** *(agar joy yoki vaqt kam bo'lsa)*:
> ```python
> model_nomi = "distilbert-base-cased-distilled-squad"   # ~250 MB
> # ⚠️ lekin DistilBertForQuestionAnswering ishlatiladi
> ```

---

## 3. ⭐ SQuAD nima?

Kurs buni tushuntirmaydi, lekin bu **muhim**:

```
SQuAD = Stanford Question Answering Dataset

  📊 100 000+ savol-javob juftligi
  📖 Wikipedia maqolalaridan
  🎯 Har javob — MATNNING ICHIDAGI aniq bo'lak

  Misol:
    Kontekst:  "The first DVD player was released on March 24, 1997."
    Savol   :  "When was the first DVD released?"
    Javob   :  "March 24, 1997"   ← MATNDAN OLINGAN
```

> ## 🔑 **BU — ENG MUHIM CHEKLOV.**
>
> ```
> ✅ BERT QA QILA OLADI:   javobni matndan TOPISH (extractive)
> ❌ BERT QA QILA OLMAYDI: javobni O'YLAB TOPISH (generative)
> ```
>
> ## 💥 **Ya'ni agar javob kontekstda YO'Q bo'lsa — BERT uni TOPA OLMAYDI.**
>
> ## 💡 **Bu — 31-moduldagi RAG bilan taqqoslash:**
> ```
> RAG (flan-t5)  →  javobni YARATADI (generativ)  →  gallyutsinatsiya XAVFI bor
> BERT QA        →  javobni AJRATIB OLADI         →  gallyutsinatsiya YO'Q  ✅
> ```
>
> ## 🎯 **BERT QA ning YASHIRIN AFZALLIGI:** u **o'ylab topa olmaydi**, shuning uchun u **yolg'on gapira olmaydi**. Javob **doim** kontekstdan olinadi.

---

## 4. 💻 Yuklaymiz va tekshiramiz

```python
model_nomi = "bert-large-uncased-whole-word-masking-finetuned-squad"
model = BertForQuestionAnswering.from_pretrained(model_nomi)
tokenizer = BertTokenizer.from_pretrained(model_nomi)

print("parametr    :", f"{sum(p.numel() for p in model.parameters()):,}")
print("qatlamlar   :", model.config.num_hidden_layers)
print("yashirin    :", model.config.hidden_size)
print("lug'at      :", tokenizer.vocab_size)
print("chiqish     :", model.qa_outputs)
```

```
parametr    : 334,094,338
```

> ## ✅ **334 million** — 1-darsdagi *"340 million"* da'vosi **tasdiqlandi** *(taxminan)*.

> ## 🔑 **`model.qa_outputs` — 2-darsdagi "vazifaga xos qatlam".**
>
> ```
> Linear(in_features=1024, out_features=2, bias=True)
>                              ↑
>                    IKKI chiqish: START va END
> ```
>
> **Butun 340 millionlik BERT — bitta maqsad uchun:** *"javob QAYERDAN boshlanadi va QAYERDA tugaydi?"*

---

## 5. ⚠️ Model + tokenizator juftligi

32-modulda ko'rgandik: **aralashtirsangiz, natija teskari bo'ladi**.

```python
# ✅ TO'G'RI — BIR XIL nom
M = "bert-large-uncased-whole-word-masking-finetuned-squad"
model = BertForQuestionAnswering.from_pretrained(M)
tokenizer = BertTokenizer.from_pretrained(M)          # ⭐ bir xil M
```

> ## 💡 **`BertTokenizer` o'rniga `AutoTokenizer` ham ishlaydi** — u **avtomatik** to'g'ri sinfni tanlaydi:
> ```python
> from transformers import AutoTokenizer, AutoModelForQuestionAnswering
> tokenizer = AutoTokenizer.from_pretrained(M)
> model = AutoModelForQuestionAnswering.from_pretrained(M)
> ```
> **Amalda `Auto*` sinflari afzalroq** — model turini o'zgartirsangiz, kod **o'zgarmaydi**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Qaysi sinf import qilinadi?

**M2.** `uncased` nima degani?

**M3.** SQuAD nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **`BertForQuestionAnswering`** va **`BertTokenizer`**.

**M2.** Model **katta va kichik** harfni **bir xil** deb qabul qiladi.

**M3.** **Stanford Question Answering Dataset** — 100 000+ savol-javob juftligi, javob **matnning ichida** turadi.

</details>

### 🟡 O'rta

**M4.** ⭐ BERT QA nima uchun **gallyutsinatsiya qilmaydi**?

**M5.** `model.qa_outputs` nima?

<details>
<summary>✅ Javoblar</summary>

**M4.** Chunki u javobni **YARATMAYDI**, balki matndan **AJRATIB OLADI** *(extractive)*.
```
❌ BERT QA javobni O'YLAB TOPA OLMAYDI
✅ Shuning uchun u YOLG'ON GAPIRA OLMAYDI
```
> ## 💥 **Bu — 31-moduldagi RAG bilan MUHIM farq.** U yerda `flan-t5` *"74,269 people"* deb **to'qigan** edi. BERT QA bunday qila **olmaydi**.

**M5.** **Vazifaga xos chiqish qatlami** — `Linear(1024, 2)`. Ikki chiqish: **START** va **END** pozitsiyalari.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Uchta QA modelini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import warnings; warnings.filterwarnings("ignore")
import pandas as pd
from transformers import AutoConfig, AutoTokenizer

MODELLAR = [
    "bert-large-uncased-whole-word-masking-finetuned-squad",
    "distilbert-base-cased-distilled-squad",
    "deepset/roberta-base-squad2",
]
r = []
for m in MODELLAR:
    try:
        c = AutoConfig.from_pretrained(m)
        t = AutoTokenizer.from_pretrained(m)
    except Exception as e:
        print(f"❌ {m}: {type(e).__name__}")
        continue
    h = getattr(c, "hidden_size", getattr(c, "dim", "?"))
    L = getattr(c, "num_hidden_layers", getattr(c, "n_layers", "?"))
    r.append({"model": m.split("/")[-1][:38], "tur": c.model_type,
              "qatlam": L, "yashirin": h, "lug'at": t.vocab_size})
print(pd.DataFrame(r).to_string(index=False))
```

> ## 🔑 **`deepset/roberta-base-squad2` ga alohida e'tibor bering.**
>
> ```
> SQuAD    →  javob DOIM kontekstda bor
> SQuAD 2  →  javob BO'LMASLIGI ham mumkin!
> ```
>
> ## 💥 **SQuAD 2 modellari "javob yo'q" deya oladi.** Bu — **amalda juda muhim**: 6-darsda biz buni **qo'lda** hal qilamiz *(start > end tekshiruvi)*, SQuAD 2 modeli esa buni **o'zi** biladi.
>
> ## 💡 **Amaliy tavsiya:** haqiqiy loyihada **SQuAD 2** modelini tanlang.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Qaysi ikki sinf kerak?
2. Model nomidagi har bir qism nimani anglatadi?
3. SQuAD nima va nima uchun muhim?
4. BERT QA nima uchun yolg'on gapira olmaydi?
5. `Auto*` sinflarining afzalligi?

<details>
<summary>✅ Javoblar</summary>

1. `BertForQuestionAnswering` va `BertTokenizer`.
2. `bert` oilasi · `large` 340M · `uncased` registr muhim emas · `finetuned-squad` SQuAD'da sozlangan.
3. **Stanford QA Dataset** — javob **matn ichida** turadi → model **ajratib oladi**, yaratmaydi.
4. U **extractive** — javobni faqat **berilgan matndan** oladi.
5. Model turini o'zgartirganda kod **o'zgarmaydi**.

</details>

---

## 📌 Xulosa

```
IMPORT
  from transformers import BertForQuestionAnswering, BertTokenizer
  import torch


MODEL
  bert-large-uncased-whole-word-masking-finetuned-squad
   ↑     ↑       ↑                            ↑     ↑
  oila  340M  registr muhim emas          sozlangan SQuAD

  ⚠️ ~1.3 GB
  💡 kichikroq: distilbert-base-cased-distilled-squad (~250 MB)


SQuAD = Stanford Question Answering Dataset
  100 000+ savol-javob · javob MATN ICHIDA turadi


⭐ ENG MUHIM XUSUSIYAT — EXTRACTIVE

  ✅ javobni matndan AJRATIB OLADI
  ❌ javobni O'YLAB TOPA OLMAYDI

  💥 Shuning uchun u YOLG'ON GAPIRA OLMAYDI

  Taqqoslang (31-modul):
     RAG (flan-t5)  →  generativ  →  "74,269 people" TO'QIDI  ❌
     BERT QA        →  extractive →  gallyutsinatsiya YO'Q     ✅


CHIQISH QATLAMI
  model.qa_outputs  →  Linear(1024, 2)
                                   ↑
                          START va END
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| SQuAD | *SQuAD* | Stanford savol-javob to'plami |
| Extractive QA | *extractive QA* | Javobni matndan ajratish |
| Generative QA | *generative QA* | Javobni yaratish |
| Uncased | *uncased* | Harf registri muhim emas |
| `qa_outputs` | *QA head* | START/END chiqish qatlami |

---

⬅️ [Oldingi: BERT arxitekturasi](02-BERT-Architecture.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: BERT embeddinglari](04-BERT-Embeddings.md)
