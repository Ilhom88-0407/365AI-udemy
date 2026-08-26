# 4-dars. Maxsus tokenlar

## 🎬 Boshlashdan oldin

> ## **"Maxsus tokenlar — katta til modellari dunyosidagi FUNDAMENTAL tushuncha."**
>
> ## **"Maxsus tokenlar — bu modelga turli vazifalarni bajarishga va matn ichidagi aniq vazifa yoki ko'rsatmalarni boshqarishga yordam beradigan MAXSUS O'RIN EGALLOVCHILAR yoki MARKERLAR."**
>
> **"Ular YO'L KO'RSATKICHLARI yoki BELGILAR kabi — modelga kirish matnining TUZILISHI va KONTEKSTINI tushunishga va turli vazifalarda uning xatti-harakatiga yo'l ko'rsatishga yordam beradi."**

---

## 1. `[CLS]` va `[SEP]`

> ## **"Birinchisi — CLS va SEP teglari. CLS tegi — TASNIFLASH tegi, SEP esa AJRATUVCHI degani."**
>
> **"Bu maxsus tokenlar odatda MATN TASNIFI va JUMLALAR JUFTLIGI tasnifi kabi vazifalarda ishlatiladi."**
>
> ## **"CLS tokeni odatda kirishning BOSHIGA qo'yiladi, SEP tokeni esa matnning turli SEGMENTLARINI AJRATISH uchun ishlatiladi."**

### 💻 Bir jumla

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("bert-base-uncased")

e = tok("The cat sat.")
print(tok.convert_ids_to_tokens(e["input_ids"]))
print("type_ids:", e["token_type_ids"])
```

```
['[CLS]', 'the', 'cat', 'sat', '.', '[SEP]']
type_ids: [0, 0, 0, 0, 0, 0]
```

### 💻 Ikki jumla — `[SEP]` ning ASOSIY vazifasi

```python
e = tok("The cat sat.", "It was sleepy.")
print(tok.convert_ids_to_tokens(e["input_ids"]))
print("type_ids:", e["token_type_ids"])
```

```
['[CLS]', 'the', 'cat', 'sat', '.', '[SEP]', 'it', 'was', 'sleepy', '.', '[SEP]']
type_ids: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
```

> ## 💥 **MANA `token_type_ids` NIMA UCHUN KERAK:**
>
> ```
> [CLS] the cat sat . [SEP]  it was sleepy . [SEP]
>   0    0   0   0  0   0     1   1    1    1   1
>   └─────── 1-JUMLA ──────┘  └──── 2-JUMLA ─────┘
> ```
>
> ## 🔑 **Model IKKI JUMLANI ko'radi va ularni AJRATA oladi.**

### 🎯 `[CLS]` nima uchun kerak?

```
Tasniflash paytida model AYNAN [CLS] tokenining
oxirgi vektorini oladi va shundan yorliq chiqaradi.

  [CLS] i am so excited ... models [SEP]
    ↑
  bu tokenning 768 o'lchamli vektori
       ↓
  Linear qatlam  →  [NEGATIVE, POSITIVE]
```

> ## 💡 **30-modul, 5-darsni eslang:** `[CLS]` — **butun jumlaning xulosasi**. E'tibor qatlamlari orqali u **hamma tokendan** ma'lumot to'playdi.

---

## 2. `[MASK]` — bo'sh joyni to'ldirish

> ## **"MASK tokeni NIQOBLANGAN til modellashtirish yoki TO'LDIRILADIGAN BO'SH JOY bilan matn generatsiyasiga oid vazifalarda ishlatiladi."**
>
> **"Masalan, siz so'zi MASK bilan almashtirilgan jumla berishingiz mumkin, va modelning vazifasi YETISHMAYOTGAN SO'ZNI bashorat qilish."**

```python
from transformers import pipeline

fm = pipeline("fill-mask", model="bert-base-uncased")
for r in fm("The capital of France is [MASK]."):
    print(f"  {r['token_str']:12s} {r['score']:.4f}")
```

```
  paris        0.4168
  lille        0.0714
  lyon         0.0634
```

> ## ✅ **`paris` — 0.4168 bilan BIRINCHI.** BERT buni **biladi**.
>
> ## 💥 **VA BU — 31-MODUL BILAN KESKIN TAQQOSLASH:**
> ```
> distilgpt2 (82M)  →  "The capital of France is the capital of the French
>                       Republic..."           ❌ PARIJ DEMADI
> BERT (110M)       →  'paris'  0.4168          ✅ BILDI
> ```
> **Nima uchun?** Chunki BERT `[MASK]` bilan **aynan shunday** o'qitilgan — bu uning **asosiy vazifasi**. GPT esa **davom ettirishga** o'qitilgan.

### 🇺🇿 Endi O'ZBEKISTON haqida so'raymiz

```python
for r in fm("The capital of Uzbekistan is [MASK].")[:3]:
    print(f"  {r['token_str']:12s} {r['score']:.4f}")
```

```
  uzbekistan   0.6842
  tbilisi      0.0715
  moscow       0.0402
```

> ## ❌ **FALOKAT — "The capital of Uzbekistan is UZBEKISTAN"?!**
>
> ```
> uzbekistan  0.6842   ← MA'NOSIZ (o'zini takrorlash)
> tbilisi     0.0715   ← Gruziya poytaxti
> moscow      0.0402   ← Rossiya poytaxti
>
> "Tashkent"  →  TOP-3 DA UMUMAN YO'Q
> ```
>
> ## 💥 **VA ISHONCH 0.68 — YUQORI!** Model **ishonch bilan ma'nosiz** javob berdi.
>
> ## 🔑 **SABAB — MA'LUMOTDAGI VAKILLIK.** BERT ingliz Wikipedia'da o'qitilgan. Fransiya haqida **millionlab** jumla bor, O'zbekiston haqida — **ancha kam**.
>
> ## 🎯 **28-modul, 4-darsni eslang:** *"Dunyoda 7000+ til bor. NLP ularning ~1% ini yaxshi qo'llab-quvvatlaydi."* Bu — **INKLYUZIVLIK** muammosining aniq, o'lchangan namunasi.

---

> ## 🔥 **BU — BERT NING ASOSIY O'QITISH VAZIFASI.**
>
> ```
> 30-MODUL, 8-DARSNI ESLANG:
>
>   🟢 GPT (decoder)  →  KEYINGI so'zni bashorat  ("kelajak yashirin")
>   🔵 BERT (encoder) →  YETISHMAYOTGAN so'zni bashorat  ([MASK])
>                              ↑
>              MANA NIMA UCHUN BERT niqobsiz —
>              u chapga ham, o'ngga ham QARAYDI
> ```
>
> ## 💡 **Bu — "Masked Language Modeling" (MLM).** BERT'ning `B` — **Bidirectional** *(ikki tomonlama)* — aynan shundan.

---

## 3. Boshqa maxsus tokenlar

> **"Model bajarishini xohlagan aniq vazifaga qarab, siz MAXSUS TOKENLARNI kiritishingiz mumkin. Masalan, agar modelni tarjima uchun ishlatsangiz, manba va maqsad tillarni ko'rsatish uchun SOURCE va TARGET kabi maxsus tokeningiz bo'lishi mumkin."**

### To'ldirish va kesish

> ## **"Turli uzunlikdagi bir nechta jumlani modelga bersangiz, TO'LDIRISH uchun maxsus tokenlar kerak bo'lishi mumkin — bu yerda biz barcha kirishlar BIR XIL UZUNLIKDA bo'lishini ta'minlash uchun qo'shimcha tokenlar qo'shamiz."**
>
> **"Yoki biz KESISHNI ishlatishimiz mumkin — bu yerda uzunroq kirishlarni ma'lum uzunlikka qisqartiramiz."**

```python
e = tok(["Short.", "This is a much longer sentence here."],
        padding=True, truncation=True)
for ids in e["input_ids"]:
    print(tok.convert_ids_to_tokens(ids))
print("mask:", e["attention_mask"])
```

> ## 🔑 **`[PAD]` + `attention_mask=0`** — model to'ldirishni **e'tiborga olmaydi**.

---

## 4. 📋 To'liq jadval

| Token | BERT | XLNet | GPT-2 | Nima uchun |
|---|---|---|---|---|
| **Tasniflash** | `[CLS]` *(boshda)* | `<cls>` *(oxirida)* | ❌ **yo'q** | Jumla xulosasi |
| **Ajratuvchi** | `[SEP]` | `<sep>` | ❌ **yo'q** | Segmentlarni ajratish |
| **To'ldirish** | `[PAD]` | `<pad>` | ⚠️ `eos` | Bir xil uzunlik |
| **Noma'lum** | `[UNK]` | `<unk>` | ❌ **yo'q** | Lug'atda yo'q token |
| **Niqob** | `[MASK]` | `<mask>` | ❌ **yo'q** | Bo'sh joyni to'ldirish |
| **Oxiri** | ❌ | `</s>` | `<\|endoftext\|>` | Matn oxiri |

```python
for nom in ["bert-base-uncased", "xlnet-base-cased", "distilgpt2"]:
    t = AutoTokenizer.from_pretrained(nom)
    print(f"{nom:22s} {t.all_special_tokens}")
```

```
bert-base-uncased      ['[UNK]', '[SEP]', '[PAD]', '[CLS]', '[MASK]']
xlnet-base-cased       ['<s>', '</s>', '<unk>', '<sep>', '<pad>', '<cls>', '<mask>', '<eop>', '<eod>']
distilgpt2             ['<|endoftext|>']
```

> ## 💥 **`distilgpt2` da ATIGI BITTA maxsus token!**
>
> ```
> BERT   →  5 ta
> XLNet  →  9 ta
> GPT-2  →  1 ta  (faqat <|endoftext|>)
> ```
>
> ## 🔑 **NIMA UCHUN?** Chunki GPT **faqat matn davom ettiradi** *(30-modul: faqat decoder)*. Unga `[CLS]` **kerak emas** — u tasniflamaydi. `[MASK]` ham kerak emas — u **kelajakni** bashorat qiladi, **o'rtadagi bo'sh joyni** emas.
>
> ## 💡 **MANA ARXITEKTURA VA MAXSUS TOKENLAR BOG'LIQLIGI:**
> ```
> 🔵 ENCODER (BERT)  →  ko'p maxsus token  (tushunish uchun tuzilma kerak)
> 🟢 DECODER (GPT)   →  bitta token        (faqat "matn tugadi")
> ```

---

## 5. ⚠️ Nima uchun modelni ko'rsatish SHART

> ## **"Har bir model maxsus tokenlarga kelganda TURLI TALAB va FOYDALANISHGA ega bo'ladi."**
>
> ## **"Shuning uchun tokenizator bilan ishlaganimizda QAYSI MODELNI ishlatishimizni KO'RSATISHIMIZ muhim — shunda u matnni o'sha model uchun TO'G'RI FORMATDA qayta ishlaydi."**

```python
# ❌ FALOKAT — tokenizator va model MOS KELMAYDI
tok_bert = AutoTokenizer.from_pretrained("bert-base-uncased")
# model_xlnet = ...  ← XLNet modeli

ids = tok_bert("Hello world")["input_ids"]
print("BERT beradi:", ids)
```

```
BERT tokenizatori:  [101, 7592, 2088, 102]
                      ↑
XLNet modeli uchun 101 — bu BUTUNLAY BOSHQA so'z!
```

> ## 🔑 **3-darsda ko'rgandik:** `102` BERT'da `[SEP]`, XLNet'da esa `▁so` so'zi. Aralashtirsangiz — model **butunlay boshqa matnni** ko'radi.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `[CLS]` va `[SEP]` nima?

**M2.** `[MASK]` nima uchun?

**M3.** `[PAD]` nima uchun?

<details>
<summary>✅ Javoblar</summary>

**M1.** `[CLS]` — **tasniflash** tokeni *(boshda)* · `[SEP]` — **ajratuvchi** *(segmentlar orasida)*.

**M2.** **Yetishmayotgan so'zni** bashorat qilish — BERT'ning asosiy o'qitish vazifasi *(MLM)*.

**M3.** Turli uzunlikdagi jumlalarni **bir xil uzunlikka** keltirish.

</details>

### 🟡 O'rta

**M4.** ⭐ `token_type_ids` ni ikki jumlada ko'rsating.

**M5.** ⭐ GPT-2 da nima uchun atigi bitta maxsus token bor?

<details>
<summary>✅ Javoblar</summary>

**M4.**
```python
e = tok("The cat sat.", "It was sleepy.")
print(tok.convert_ids_to_tokens(e["input_ids"]))
print(e["token_type_ids"])
```
```
['[CLS]', 'the', 'cat', 'sat', '.', '[SEP]', 'it', 'was', 'sleepy', '.', '[SEP]']
[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
```

**M5.** Chunki GPT — **faqat decoder** *(30-modul)*. U matnni **davom ettiradi**:
```
❌ [CLS]   →  tasniflamaydi
❌ [MASK]  →  o'rtadagi bo'sh joyni to'ldirmaydi
✅ <|endoftext|>  →  faqat "matn tugadi"
```

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ `[MASK]` bilan modelning "bilimini" sinang.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import pipeline
fm = pipeline("fill-mask", model="bert-base-uncased")

SINOVLAR = [
    "The capital of France is [MASK].",
    "The capital of Uzbekistan is [MASK].",
    "Water freezes at [MASK] degrees celsius.",
    "The doctor said [MASK] would be late.",      # ⚠️ tarafkashlik sinovi
    "The nurse said [MASK] would be late.",       # ⚠️ tarafkashlik sinovi
]
for s in SINOVLAR:
    print(f"\n{s}")
    for r in fm(s)[:3]:
        print(f"   {r['token_str']:12s} {r['score']:.4f}")
```

**Haqiqiy natija:**

```
The capital of France is [MASK].
   paris        0.4168
   lille        0.0714
   lyon         0.0634

The capital of Uzbekistan is [MASK].
   uzbekistan   0.6842      ❌ ma'nosiz
   tbilisi      0.0715      ❌ Gruziya
   moscow       0.0402      ❌ Rossiya

The doctor said [MASK] would be late.
   he           0.3633
   she          0.3178
   i            0.0961

The nurse said [MASK] would be late.
   she          0.5556
   he           0.1442
   i            0.1029
```

## 💥 GENDER TARAFKASHLIGI — TASDIQLANDI VA O'LCHANDI

```
                 he       she     nisbat
  doctor      0.3633    0.3178    he 1.14× ko'proq
  nurse       0.1442    0.5556    she 3.85× ko'proq    ⚠️⚠️
```

> ## ⚠️ **TARAFKASHLIK BOR — VA U ASIMMETRIK.**
>
> ```
> "doctor"  →  he va she DEYARLI TENG (0.36 vs 0.32)
> "nurse"   →  she 3.85 BARAVAR ko'proq (0.56 vs 0.14)
>                    ↑
>        Stereotip "hamshira = ayol" ANCHA KUCHLI
> ```

> ## 🔑 **28-modul, 4-darsni eslang:**
> *"O'qitish ma'lumoti: faqat erkak dasturchilar → model o'rganadi: 'dasturchi' = erkak"*
>
> ## 💥 **Mana o'sha da'voning O'LCHANGAN isboti.** Model **ma'lumotdagi stereotipni** o'rgangan va uni **takrorlaydi**.

> ## 🎯 **`[MASK]` — tarafkashlikni topishning ENG SODDA va ENG KUCHLI usuli.** Model **o'zi** ma'lumotdagi stereotipni **oshkor qiladi** — sizga faqat **to'g'ri savol berish** kerak.
>
> ## ⚠️ **Har bir modelni ishlab chiqarishga chiqarishdan OLDIN shu testni o'tkazing.** Agar modelingiz ishga qabul qilish, kredit berish yoki tibbiy qarorlarda ishlatilsa — bu **jiddiy oqibatlarga** olib keladi.
>
> **68–76-modullar** *(AI axloqi)* aynan shu haqda.


</details>

**M7.** ⭐⭐ Uchta modelning maxsus tokenlarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

r = []
for nom in ["bert-base-uncased", "xlnet-base-cased", "distilgpt2",
            "bert-base-multilingual-cased"]:
    t = AutoTokenizer.from_pretrained(nom)
    r.append({"model": nom[:30], "soni": len(t.all_special_tokens),
              "cls": t.cls_token, "sep": t.sep_token,
              "pad": t.pad_token, "mask": t.mask_token})
print(pd.DataFrame(r).to_string(index=False))
```

> ⚠️ **Ba'zi qiymatlar `None` bo'ladi** *(masalan GPT-2 da `cls_token`)* — bu **xato emas**, model o'sha tokenni **ishlatmaydi**.
>
> ## 💡 **Amaliy maslahat:** har doim `tok.pad_token` **mavjudligini** tekshiring. GPT-2 da u **yo'q**, va `padding=True` **xato** beradi. Yechim:
> ```python
> if tok.pad_token is None:
>     tok.pad_token = tok.eos_token
> ```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Maxsus tokenlar nima?
2. `[CLS]` qayerda turadi va nima uchun?
3. `[MASK]` qaysi modelning asosiy vazifasi?
4. GPT-2 da nechta maxsus token bor?
5. Nima uchun tokenizatorda modelni ko'rsatish shart?

<details>
<summary>✅ Javoblar</summary>

1. Modelga matn **tuzilishini** tushunishga yordam beruvchi **markerlar**.
2. **Boshida** *(BERT'da)* — tasniflashda **uning vektori** ishlatiladi.
3. ## **BERT** — *Masked Language Modeling*, `B` = **Bidirectional**.
4. ## **Bitta** — `<|endoftext|>`. Chunki u **faqat decoder**.
5. Har modelning **o'z tokenlari** va **o'z lug'ati** bor.

</details>

---

## 📌 Xulosa

```
MAXSUS TOKENLAR — matn TUZILISHINING markerlari

  [CLS]   tasniflash    (BERT'da BOSHDA, XLNet'da OXIRIDA)
  [SEP]   ajratuvchi    (segmentlar orasida)
  [PAD]   to'ldirish    (bir xil uzunlik)
  [UNK]   noma'lum      (lug'atda yo'q)
  [MASK]  niqob         (bo'sh joyni to'ldirish)


IKKI JUMLA MISOLI
  [CLS] the cat sat . [SEP] it was sleepy . [SEP]
    0    0   0   0  0   0    1   1    1    1   1
    └────── 1-JUMLA ──────┘ └───── 2-JUMLA ─────┘


💥 MODELGA QARAB SONI FARQ QILADI
  BERT   →  5 ta   ['[UNK]','[SEP]','[PAD]','[CLS]','[MASK]']
  XLNet  →  9 ta   (+ <s>, </s>, <eop>, <eod>)
  GPT-2  →  1 ta   ['<|endoftext|>']
                        ↑
  🔑 ARXITEKTURA BOG'LIQLIGI:
     🔵 encoder (BERT) →  ko'p token (tuzilma kerak)
     🟢 decoder (GPT)  →  bitta token (faqat "tugadi")


🔥 [MASK] = BERT NING O'QITISH VAZIFASI
   GPT  →  KEYINGI so'z      (kelajak yashirin)
   BERT →  YETISHMAYOTGAN so'z ([MASK])
             ↑
      B = Bidirectional (ikki tomonlama)


⚠️ [MASK] — TARAFKASHLIKNI topishning eng sodda usuli
   "The doctor said [MASK]..."  vs  "The nurse said [MASK]..."
   →  model o'zi stereotipni OSHKOR qiladi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Maxsus token | *special token* | Tuzilma markeri |
| `[CLS]` | *classification token* | Tasniflash tokeni |
| `[SEP]` | *separator* | Ajratuvchi |
| `[MASK]` | *mask token* | Niqoblangan so'z |
| MLM | *masked language modeling* | Niqoblangan til modellashtirish |
| Ikki tomonlama | *bidirectional* | Chapga ham, o'ngga ham qaraydi |

---

⬅️ [Oldingi: Oldindan o'qitilgan tokenizatorlar](03-Pre-trained-Tokenizers.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: PyTorch va TensorFlow](05-PyTorch-TensorFlow.md)
