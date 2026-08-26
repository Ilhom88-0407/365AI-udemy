# 4-dars. BERT embeddinglari

## 🎬 Boshlashdan oldin

> **"Keling, BERT arxitekturasiga yana MISOL yordamida qaraymiz. Biz BERT'ga SAVOL beramiz — javobni o'z ichiga olgan MATN bilan birga. Keyin BERT bu savolga javob topish uchun bosadigan QADAMLARNI ko'rib chiqamiz."**

---

## 1. Savol va kontekst

> **"Bizda savol bor: 'Birinchi DVD qachon chiqarilgan?' Keyin javobni o'z ichiga olgan matn bor — uni ANSWER DOCUMENT ga qo'yamiz."**

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import BertForQuestionAnswering, BertTokenizer

M = "bert-large-uncased-whole-word-masking-finetuned-squad"
model = BertForQuestionAnswering.from_pretrained(M)
tokenizer = BertTokenizer.from_pretrained(M)

savol = "When was the first DVD released?"

hujjat = (
    "The DVD (common abbreviation for Digital Video Disc or Digital "
    "Versatile Disc) is a digital optical disc data storage format. "
    "It was invented and developed in 1995 and first released on "
    "November 1, 1996 in Japan. The medium can store any kind of digital "
    "data and has been widely used to store video programs. The first DVD "
    "player and disc were released in the United States on March 24, 1997."
)
```

> ## ⚠️ **DIQQAT — matnda IKKITA sana bor:**
> ```
> "first released on November 1, 1996 in Japan"      ← DVD FORMATI
> "released in the United States on March 24, 1997"  ← DVD PLEYER va DISK
> ```
> Bu — **ataylab**. Model **qaysi birini** tanlashini ko'ramiz.

---

## 2. ⭐ `encode_plus` — savol va kontekstni BIRGA

> **"Birinchi qadam — savolimiz va javobimiz uchun embeddinglar yaratish. Kodlashlarni yaratamiz va `tokenizer.encode_plus` dan foydalanamiz. Unga SAVOL matni va JAVOB HUJJATINI beramiz."**

```python
# ⚠️ KURSDAGI KOD — transformers 5.x da ISHLAMAYDI
# kodlash = tokenizer.encode_plus(savol, hujjat)
#   →  AttributeError: BertTokenizerFast has no attribute encode_plus

# ✅ ZAMONAVIY SINTAKSIS — tokenizatorni TO'G'RIDAN-TO'G'RI chaqiring
kodlash = tokenizer(savol, hujjat)
print("kalitlar:", list(kodlash.keys()))
```

```
kalitlar: ['input_ids', 'token_type_ids', 'attention_mask']
```

> ## ⚠️⚠️ **MUHIM O'ZGARISH — `encode_plus` OLIB TASHLANGAN.**
>
> ```
> ❌ tokenizer.encode_plus(savol, hujjat)     →  transformers 5.x da XATO
> ✅ tokenizer(savol, hujjat)                  →  BIR XIL natija, ishlaydi
> ```
>
> ## 💡 **Natija MUTLAQO bir xil** — faqat chaqirish usuli o'zgargan. Bu — `transformers` paketining **soddalashtirish** yo'nalishi: `encode`, `encode_plus`, `batch_encode_plus` — hammasi **bitta** `tokenizer(...)` chaqiruviga birlashtirildi.

> ## 🔑 **IKKI ARGUMENT — bu MUHIM.**
> ```python
> tokenizer.encode_plus(savol, hujjat)
>                        ↑        ↑
>                   1-segment  2-segment
> ```
> Tokenizator ularni **avtomatik** birlashtiradi va **ajratadi**:
> ```
> [CLS] savol [SEP] kontekst [SEP]
> ```

---

## 3. Uchta chiqish

> **"Bizda maxsus tokenlar qo'shilgan TOKEN EMBEDDINGLARIMIZ bor — bu `input_ids`. Va `token_type_ids` SAVOLGA tegishli tokenlarni JAVOBNI o'z ichiga olgan matn tokenlaridan AJRATISH uchun ishlatiladi."**
>
> **"Bizda ATTENTION MASK ham bor, lekin bu safar u bizga kerak emas."**

```python
kirish  = kodlash["input_ids"]         # ① token embeddinglari
segment = kodlash["token_type_ids"]    # ② segment embeddinglari
tokenlar = tokenizer.convert_ids_to_tokens(kirish)

print("tokenlar soni :", len(kirish))
print("segment 0     :", segment.count(0), "ta  (SAVOL)")
print("segment 1     :", segment.count(1), "ta  (KONTEKST)")
print("birinchi 12   :", tokenlar[:12])
```

```
tokenlar soni : 88
segment 0     : 9 ta  (SAVOL)
segment 1     : 79 ta  (KONTEKST)
birinchi 12   : ['[CLS]', 'when', 'was', 'the', 'first', 'dvd', 'released', '?', '[SEP]', 'the', 'dvd', '(']
```

> ## ✅ **STRUKTURA ANIQ KO'RINIB TURIBDI:**
> ```
> [CLS] when was the first dvd released ? [SEP]  the dvd ( ... [SEP]
>   └──────────── segment 0 (9 ta) ──────────┘  └── segment 1 (79 ta) ──┘
> ```
> 9-token — bu **birinchi `[SEP]`**, ya'ni savol chegarasi.
>
> 💡 **Hammasi kichik harfda** — chunki model `uncased`.

> ## 💡 **2-darsdagi UCHTA embedding — mana ular:**
> ```
> ① token     →  input_ids        (biz beramiz)
> ② segment   →  token_type_ids   (biz beramiz)
> ③ pozitsion →  model ICHIDA avtomatik qo'shiladi
> ```

---

## 4. Maxsus tokenlarni tekshiramiz

> **"Maxsus tokenlar qo'shilganini ham tekshirishimiz mumkin. Matnda 101 va 102 maxsus tokenlari bor. Keling, ularni dekodlab, kutgan maxsus tokenlarimiz ekanini tekshiramiz."**

```python
print("101 →", repr(tokenizer.decode(101)))
print("102 →", repr(tokenizer.decode(102)))
```

```
101 → '[CLS]'
102 → '[SEP]'
```

> ## 🔑 **`[SEP]` bu yerda IKKI MARTA uchraydi:**
> ```
> [CLS] when was the first dvd released ? [SEP] the dvd ... 1997 . [SEP]
>   ↑                                       ↑                        ↑
> boshi                              SAVOLNI kontekstdan        oxiri
>                                        AJRATADI
> ```
>
> ## 💡 **Birinchi `[SEP]` — eng muhimi.** U model uchun *"savol shu yerda tugadi"* degan **belgi**. 6-darsda biz uni **qo'lda topamiz**.

---

## 5. Modelga uzatamiz

> **"Keyin bu embeddinglarni modelimizga uzatishimiz mumkin. Chiqishimizni yaratamiz va modelni ishga tushiramiz. Ularni TENZORGA formatlashimiz kerak, shuning uchun `torch.tensor` dan foydalanamiz."**

```python
with torch.no_grad():
    chiqish = model(torch.tensor([kirish]),
                    token_type_ids=torch.tensor([segment]))

print("start_logits:", chiqish.start_logits.shape)
print("end_logits  :", chiqish.end_logits.shape)
```

> ## 🔑 **`[len(kirish)]` shaklidagi IKKI vektor:**
> ```
> start_logits  →  har token uchun: "javob SHU YERDA boshlanadimi?"
> end_logits    →  har token uchun: "javob SHU YERDA tugaydimi?"
> ```
>
> ## 💡 **`torch.tensor([kirish])` — kvadrat qavslarga e'tibor bering.** Bu — **batch** o'lchami *(32-modul, 5-dars)*. Model **doim** batch kutadi.

---

## 6. ⚠️ Kursdagi bir nozik joy

O'qituvchi `attention_mask` ni **ishlatmaydi**:

> *"Bizda attention mask ham bor, lekin bu safar u bizga kerak emas."*

> ## ✅ **Bu — TO'G'RI, lekin FAQAT bitta jumla uchun.**
>
> ```
> BITTA jumla   →  to'ldirish YO'Q  →  attention_mask hammasi 1  →  kerak emas
> BIR NECHTA    →  to'ldirish BOR   →  attention_mask SHART!
> ```
>
> ## ⚠️ **Agar siz bir vaqtda bir nechta savolni qayta ishlasangiz:**
> ```python
> kodlash = tokenizer(savollar, hujjatlar, padding=True,
>                     truncation=True, return_tensors="pt")
> chiqish = model(**kodlash)      # ⭐ attention_mask AVTOMATIK uzatiladi
> ```
> **`model(**kodlash)`** — eng xavfsiz usul, chunki u **hamma** kerakli maydonni uzatadi.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `encode_plus` nechta argument oladi?

**M2.** `token_type_ids` nima uchun?

**M3.** `[SEP]` necha marta uchraydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Ikkita** — **savol** va **kontekst**. Tokenizator ularni avtomatik birlashtiradi.

**M2.** **Savol** tokenlarini **kontekst** tokenlaridan **ajratish** uchun *(0 = savol, 1 = kontekst)*.

**M3.** ## **Ikki marta** — savoldan keyin va matn oxirida.

</details>

### 🟡 O'rta

**M4.** ⭐ Segment ID'larni ko'ring va tokenlar bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
for i, (t, s) in enumerate(zip(tokenlar[:16], segment[:16])):
    belgi = "SAVOL" if s == 0 else "KONTEKST"
    print(f"  {i:3d}  seg={s}  {belgi:9s}  {t}")
```

> ## 🔑 **Chegarani toping** — `[SEP]` dan keyin `segment` **0 dan 1 ga** o'tadi.

</details>

**M5.** `attention_mask` qachon KERAK bo'ladi?

<details>
<summary>✅ Javob</summary>

```
BITTA jumla    →  kerak emas (to'ldirish yo'q)
BIR NECHTA     →  SHART! (to'ldirish bor)
```
> ✅ **Eng xavfsiz usul:** `model(**kodlash)` — u **hamma** maydonni uzatadi.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Uzun kontekstda nima bo'ladi?

<details>
<summary>✅ Yechim</summary>

```python
uzun = hujjat * 20        # ~20 baravar uzun
k = tokenizer.encode_plus(savol, uzun)
print("tokenlar:", len(k["input_ids"]))
print("chegara :", tokenizer.model_max_length)

if len(k["input_ids"]) > tokenizer.model_max_length:
    print("⚠️ CHEGARADAN OSHDI — kesish kerak!")
    k = tokenizer.encode_plus(savol, uzun, truncation=True, max_length=512)
    print("kesilgandan keyin:", len(k["input_ids"]))
```

> ## ⚠️ **512 TOKEN — BERT QA NING ENG KATTA AMALIY CHEKLOVI.**
>
> ```
> Sizning hujjatingiz 10 000 so'z bo'lsa —
> BERT uning FAQAT BIRINCHI ~400 so'zini ko'radi.
> Javob 500-so'zda bo'lsa — U TOPILMAYDI.
> ```
>
> ## ✅ **YECHIM — 31-MODULDAGI RAG:**
> ```
> ① Hujjatni BO'LAKLARGA bo'ling
> ② TF-IDF bilan eng mos bo'lakni TOPING
> ③ FAQAT o'sha bo'lakni BERT QA ga bering
>
> →  RAG (qidiruv) + BERT QA (ajratish) = KUCHLI birikma
> ```
>
> ## 💡 **Bu birikma 31-moduldagi RAG'dan ham YAXSHIROQ:**
> ```
> RAG + flan-t5   →  javob YARATILADI  →  gallyutsinatsiya mumkin
> RAG + BERT QA   →  javob AJRATILADI  →  gallyutsinatsiya YO'Q  ✅
> ```
> **Buni LOYIHALAR.md da quramiz.**

</details>

---

## 📌 Xulosa

```
encode_plus(savol, hujjat)  →  IKKI segment BIRGA

  [CLS] savol [SEP] kontekst [SEP]
    ↑                 ↑
  seg 0             seg 1


UCHTA CHIQISH
  input_ids       →  ① token embeddinglari
  token_type_ids  →  ② segment embeddinglari  ⭐
  attention_mask  →  bitta jumlada kerak emas


MODELGA
  model(torch.tensor([kirish]),
        token_type_ids=torch.tensor([segment]))
              ↑
        [ ] = batch o'lchami

  →  start_logits  (javob QAYERDAN boshlanadi?)
  →  end_logits    (javob QAYERDA tugaydi?)


⚠️ 512 TOKEN CHEGARASI
   uzun hujjat  →  BERT faqat BIRINCHI ~400 so'zni ko'radi
   ✅ yechim: RAG (31-modul) + BERT QA
```

---

⬅️ [Oldingi: Modelni yuklash](03-Loading-Model-and-Tokenizer.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Javobni hisoblash](05-Calculating-the-Response.md)
