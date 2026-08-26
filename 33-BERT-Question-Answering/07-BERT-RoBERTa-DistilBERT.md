# 7-dars. BERT, RoBERTa, DistilBERT

## 🎬 Boshlashdan oldin

> **"Agar BERT modeli haqida ko'proq o'qisangiz yoki Hugging Face Models sahifasida BERT modellarini qidirsangiz, oxir-oqibat BERT modelining VARIANTLARIGA duch kelasiz. Bular — RoBERTa va DistilBERT."**

---

## 1. Uchta aka-uka

![BERT oilasi](assets/05-bert-oila.svg)

```
                   BERT  (2018, Google)
                        │
        ┌───────────────┴───────────────┐
        │                               │
    RoBERTa (2019, Meta)          DistilBERT (2019, HF)
    "YAXSHIROQ o'qitilgan"        "KICHIKROQ va TEZROQ"
```

> ## 🔑 **UCHALASI HAM BIR XIL ARXITEKTURA** — **transformer enkoderi** *(30-modul)*. Farq **o'lchamda** va **qanday o'qitilganida**.

---

## 2. RoBERTa — "yaxshiroq o'qitilgan BERT"

> **"RoBERTa — bu 'a Robustly Optimized BERT pretraining Approach' degani, ya'ni BERT modelining MODIFIKATSIYASI va OPTIMIZATSIYASI. U KATTAROQ BATCH o'lchamidan, UZUNROQ o'qitish ketma-ketliklaridan foydalanadi va oldindan o'qitish paytida NEXT SENTENCE PREDICTION vazifasini OLIB TASHLAYDI."**

```
RoBERTa = Robustly Optimized BERT pretraining Approach
```

| Nima o'zgardi | BERT | RoBERTa |
|---|---|---|
| Ma'lumot hajmi | 16 GB | ## **160 GB** *(10×)* |
| Batch o'lchami | 256 | ## **8 000** |
| NSP vazifasi | ✅ bor | ## ❌ **OLIB TASHLANGAN** |
| Maskalash | **statik** | ## ⭐ **dinamik** |
| Tokenizator | WordPiece | **BPE** |

### ⭐ Dinamik maskalash — eng muhim o'zgarish

> **"RoBERTa DINAMIK MASKALASHDAN ham foydalanadi — bunda maskalash naqshi HAR BATCH uchun O'ZGARADI."**

```
BERT — STATIK maskalash:
   "The [MASK] sat on the mat"     ← 40 epoxada HAR DOIM bir xil
   "The [MASK] sat on the mat"
   "The [MASK] sat on the mat"     →  model naqshni YODLAB oladi

RoBERTa — DINAMIK maskalash:
   "The [MASK] sat on the mat"     ← har safar BOSHQA so'z
   "The cat [MASK] on the mat"
   "The cat sat on the [MASK]"     →  model KO'PROQ o'rganadi
```

> ## 💡 **Bu — "ma'lumotni kengaytirish" (data augmentation) g'oyasi.** Bir xil jumla **har safar boshqacha** vazifa beradi — ya'ni **bepul** qo'shimcha o'qitish ma'lumoti.

### ❌ NSP nima uchun olib tashlangan?

2-darsda ko'rgan edik: BERT ikkita vazifada o'qitilgan — **MLM** va **NSP**.

> ## 💥 **RoBERTa mualliflari NSP'ni O'LCHASHDI va u FOYDA BERMAGANINI aniqladilar.**
>
> Sabab: NSP **juda oson**. Tasodifiy ikkinchi jumla odatda **butunlay boshqa mavzuda** bo'ladi — modelga chuqur o'ylash **shart emas**.
>
> ## 🔑 **SABOQ:** "Aqlli g'oya" **o'lchanmaguncha** — faqat **taxmin**. RoBERTa jamoasi o'lchadi va **olib tashladi**.

> **"Natija — turli quyi oqim NLP vazifalarida original BERT'ga qaraganda YAXSHIROQ ishlaydigan model. RoBERTa o'zining MUSTAHKAMLIGI bilan tanilgan va odatda BERT'dan yaxshilanish deb hisoblanadi."**

---

## 3. DistilBERT — "kichik va tez BERT"

> **"DistilBERT — BERT'ning KICHIKROQ va YENGILROQ versiyasi, samaradorlik va TEZROQ inferens uchun mo'ljallangan. U BERT modelidan DISTILLYATSIYA qilingan — ya'ni kattaroq BERT modelining xatti-harakatini TAQLID QILISHGA o'qitilgan, lekin PARAMETRLARI KAMROQ."**

```
        ┌──────────────┐        ┌──────────────┐
        │  O'QITUVCHI  │  ───►  │   SHOGIRD    │
        │  BERT-base   │        │  DistilBERT  │
        │  12 qatlam   │        │   6 qatlam   │
        └──────────────┘        └──────────────┘
              ↑                        ↑
        allaqachon o'qitilgan    O'QITUVCHINING
                                 CHIQISHIGA taqlid qiladi
```

> ## 🔑 **BILIM DISTILLYATSIYASI (knowledge distillation).**
>
> Odatdagi o'qitish: model **to'g'ri javob**ga qarab o'rganadi *(`cat` = 1, qolgani = 0)*.
>
> Distillyatsiya: shogird **o'qituvchining butun ehtimollik taqsimotiga** qarab o'rganadi:
> ```
> cat 0.71 · dog 0.18 · kitten 0.06 · car 0.001
>            ↑
>   "dog CAT'ga o'xshaydi, CAR esa o'xshamaydi"  ← BU MA'LUMOT
> ```
> ## 💡 **Shogird "to'g'ri javob"dan tashqari, o'qituvchining IKKILANISHINI ham o'rganadi.** Shuning uchun u kichik bo'lsa ham yaxshi ishlaydi.

> **"U BERT-base modeliga qaraganda 40% kam parametrga ega. 60% tezroq ishlaydi, shu bilan birga BERT ishlashining 95% dan ortig'ini saqlab qoladi."**

---

## 4. ⭐⭐ Kursning da'volarini O'LCHAB KO'RAMIZ

Kurs uchta raqam beradi: **−40% parametr**, **+60% tezlik**, **95% sifat**. Ikkitasini **o'zimiz o'lchadik**.

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import (BertTokenizer, BertModel,
                          RobertaTokenizer, RobertaModel,
                          DistilBertTokenizer, DistilBertModel)

modellar = {
    "BERT":       (BertTokenizer,       BertModel,       "bert-base-uncased"),
    "RoBERTa":    (RobertaTokenizer,    RobertaModel,    "roberta-base"),
    "DistilBERT": (DistilBertTokenizer, DistilBertModel, "distilbert-base-uncased"),
}

for nom, (Tok, Mod, nomi) in modellar.items():
    t = Tok.from_pretrained(nomi)
    m = Mod.from_pretrained(nomi)
    p = sum(x.numel() for x in m.parameters())
    qatlam = len(m.encoder.layer) if hasattr(m, "encoder") else len(m.transformer.layer)
    print(f"{nom:11s} {p:>12,}  vocab={t.vocab_size:>6,}  qatlam={qatlam}")
```

```
BERT         109,482,240  vocab=30,522  qatlam=12
RoBERTa      124,645,632  vocab=50,265  qatlam=12
DistilBERT    66,362,880  vocab=30,522  qatlam=6
```

### ✅ Da'vo № 1 — "40% kam parametr"

```
DistilBERT / BERT = 66,362,880 / 109,482,240 = 0.606

→  39.4% KAM
```

> ## ✅ **TASDIQLANDI.** Kurs `40%` deydi — biz `39.4%` o'lchadik. **Aynan mos.**

### 🎯 Da'vo № 2 — "60% tezroq"

```python
import time, torch
torch.set_num_threads(4)

s = "Machine learning is unbelievably powerful and it changes everything we do."
for nom, (Tok, Mod, nomi) in modellar.items():
    t = Tok.from_pretrained(nomi); m = Mod.from_pretrained(nomi); m.eval()
    enc = t(s, return_tensors="pt")
    with torch.no_grad():
        for _ in range(3): m(**enc)                    # isitish
        t0 = time.perf_counter()
        for _ in range(30): m(**enc)
        print(f"{nom:11s} {(time.perf_counter()-t0)/30*1000:7.2f} ms")
```

```
BERT         115.58 ms
RoBERTa       63.15 ms
DistilBERT    34.80 ms
```

```
DistilBERT / BERT = 34.80 / 115.58 = 0.301

→  69.9% TEZROQ
```

> ## 💥 **KURS SUSTROQ AYTGAN.** Kurs `60%` deydi — biz `69.9%` o'lchadik.
>
> **Nima uchun?** DistilBERT'da **6 qatlam** *(BERT'da 12)* — ya'ni **yarmi**. Bizning CPU'da qatlamlar **ketma-ket** hisoblanadi, shuning uchun tezlanish **parametr nisbatidan ham katta**.
>
> ## ⚠️ **RAQAM APPARATGA BOG'LIQ.** GPU'da bu nisbat **boshqacha** bo'ladi. **O'z apparatingizda o'lchang.**

### ❗ Kutilmagan natija — RoBERTa BERT'dan TEZROQ

```
BERT      115.58 ms   109M parametr
RoBERTa    63.15 ms   124M parametr    ←  KO'PROQ parametr, LEKIN TEZROQ!
```

> ## 🤔 **KO'PROQ PARAMETR — LEKIN TEZROQ. QANDAY?**
>
> RoBERTa'ning qo'shimcha **15 million** parametri deyarli **butunlay lug'atda**:
> ```
> BERT     vocab 30,522 × 768 =  23.4M  embedding parametri
> RoBERTa  vocab 50,265 × 768 =  38.6M  embedding parametri
>                                ─────
>                        farq =  15.2M   ← aynan umumiy farq
> ```
> ## 🔑 **EMBEDDING JADVALI — bu QIDIRUV, hisob EMAS.** U **kattalashsa ham** hisoblash vaqtiga **deyarli ta'sir qilmaydi**.
>
> ## 💥 **SABOQ: "parametrlar soni" ≠ "tezlik".** Sekinlashtiradi — **qatlamlar** va **ketma-ketlik uzunligi**, lug'at **emas**.

> ## ⚠️ **Bizning izoh:** RoBERTa'ning **BPE** tokenizatori jumlani **6 tokenga** bo'ldi, BERT'niki **10 tokenga** *(pastdagi jadvalga qarang)*. Qisqaroq ketma-ketlik — **tezroq** e'tibor hisobi. Bu ham tezlik farqiga hissa qo'shgan.

---

## 5. ⭐ Tokenizatorlar — eng ko'zga tashlanadigan farq

```python
s = "Machine learning is unbelievably powerful."
for nom, (Tok, _, nomi) in modellar.items():
    print(f"{nom:11s} {Tok.from_pretrained(nomi).tokenize(s)}")
```

```
BERT        ['machine', 'learning', 'is', 'un', '##bel', '##ie', '##va', '##bly', 'powerful', '.']
RoBERTa     ['Machine', 'Ġlearning', 'Ġis', 'Ġunbelievably', 'Ġpowerful', '.']
DistilBERT  ['machine', 'learning', 'is', 'un', '##bel', '##ie', '##va', '##bly', 'powerful', '.']
```

> ## 💥 **UCHTA MUHIM KUZATUV:**
>
> ### ① BERT va DistilBERT — **AYNAN BIR XIL**
> DistilBERT BERT'ning **o'z lug'atini meros qilib olgan** *(ikkalasida ham `vocab=30,522`)*. Bu — distillyatsiyaning **sharti**: shogird o'qituvchining tokenlarini **tushunishi** kerak.
>
> ### ② RoBERTa `unbelievably` ni **BUTUN** saqladi
> ```
> BERT     →  un ##bel ##ie ##va ##bly     (5 ta bo'lak)
> RoBERTa  →  unbelievably                 (1 ta token)
> ```
> Sabab: **50,265** ta lug'at *(BERT'da 30,522)* — noyob so'zlar **butun** sig'adi.
>
> ### ③ RoBERTa **KATTA HARFNI SAQLAYDI** va `Ġ` ishlatadi
> ```
> Ġ  =  "bu so'zdan OLDIN bo'shliq bor"
> ```
> `Machine` katta harf bilan qoldi — RoBERTa **cased**. `bert-base-uncased` esa hammasini **kichkina** qiladi.

### Maxsus tokenlar ham boshqacha

```python
for nom, (Tok, _, nomi) in modellar.items():
    print(f"{nom:11s} {Tok.from_pretrained(nomi).all_special_tokens}")
```

```
BERT        ['[UNK]', '[SEP]', '[PAD]', '[CLS]', '[MASK]']
RoBERTa     ['<s>', '</s>', '<unk>', '<pad>', '<mask>']
DistilBERT  ['[UNK]', '[SEP]', '[PAD]', '[CLS]', '[MASK]']
```

| Vazifa | BERT / DistilBERT | RoBERTa |
|---|---|---|
| Boshi | `[CLS]` | `<s>` |
| Ajratuvchi | `[SEP]` | `</s>` |
| Maska | `[MASK]` | `<mask>` |
| To'ldirish | `[PAD]` | `<pad>` |

> ## 💥 **AGAR SIZ MODELNI ALMASHTIRSANGIZ — MAXSUS TOKENLARNI HAM ALMASHTIRING.**
> ```python
> # ❌ RoBERTa uchun ISHLAMAYDI
> matn = "[CLS] " + savol + " [SEP] " + kontekst
>
> # ✅ HAR DOIM tokenizatorning O'ZIDAN so'rang
> enc = tokenizer(savol, kontekst)       # maxsus tokenlar AVTOMATIK
> ```

---

## 6. ⚠️⚠️ DistilBERT'ning YASHIRIN TUZOG'I

Bu — kursda **aytilmagan**, lekin sizni **albatta** urib qo'yadigan farq.

```python
import inspect
from transformers import BertModel, RobertaModel, DistilBertModel

for n, C in [("BertModel", BertModel), ("RobertaModel", RobertaModel),
             ("DistilBertModel", DistilBertModel)]:
    p = list(inspect.signature(C.forward).parameters)
    print(f"{n:17s} token_type_ids: {'token_type_ids' in p}")
```

```
BertModel         token_type_ids: True
RobertaModel      token_type_ids: True
DistilBertModel   token_type_ids: False      ← ❗
```

> ## 💥 **DistilBERT'da SEGMENT EMBEDDINGLARI YO'Q.**
>
> Distillyatsiya paytida NSP vazifasi olib tashlangan — segment embeddinglari **keraksiz** bo'lib qolgan va **butunlay o'chirilgan**.
>
> ## ⚠️ **6-darsdagi bizning kodimiz DistilBERT bilan ISHLAMAYDI:**
> ```python
> model(torch.tensor([input_ids]),
>       token_type_ids=torch.tensor([segment_ids]))   # ← DistilBERT'da MA'NOSIZ
> ```

### 🤯 Va mana eng yashirin joyi

```python
t = AutoTokenizer.from_pretrained("distilbert-base-uncased")
print(list(t("hello world").keys()))
```

```
['input_ids', 'token_type_ids', 'attention_mask']
                    ↑
        TOKENIZATOR uni BERADI...
```

```python
m = DistilBertModel.from_pretrained("distilbert-base-uncased")
o = m(**t("hello world", return_tensors="pt"))
print(o.last_hidden_state.shape)
```

```
torch.Size([1, 4, 768])       ← XATO YO'Q!
```

> ## 💥💥 **TOKENIZATOR `token_type_ids` BERADI, MODEL ESA UNI JIM E'TIBORSIZ QOLDIRADI.**
>
> ```
> ❌ XATO chiqmaydi
> ❌ OGOHLANTIRISH chiqmaydi
> ✅ Natija QAYTADI — lekin segment ma'lumoti YO'QOLGAN
> ```
>
> ## 🔑 **BU — ENG XAVFLI TURDAGI XATO: JIM XATO.** Kod ishlaydi, natija chiqadi, lekin siz kutgan narsa **sodir bo'lmadi**.
>
> ## ⚠️ **RoBERTa'da esa boshqacha** — uning tokenizatori `token_type_ids` ni **umuman bermaydi**:
> ```
> roberta kalitlari: ['input_ids', 'attention_mask']
> ```

---

## 7. Kodda ishlatish

> **"RoBERTa uchun Transformers paketidan RobertaTokenizer va RobertaModel ni import qilishimiz mumkin. Model nomingizni roberta-base deb ko'rsatasiz, keyin bizga tanish bo'lgan from_pretrained funksiyalari yordamida yuklaymiz."**

```python
# ── RoBERTa ──
from transformers import RobertaTokenizer, RobertaModel

model_nomi = "roberta-base"
tokenizer  = RobertaTokenizer.from_pretrained(model_nomi)
model      = RobertaModel.from_pretrained(model_nomi)

# ── DistilBERT ──
from transformers import DistilBertTokenizer, DistilBertModel

model_nomi = "distilbert-base-uncased"
tokenizer  = DistilBertTokenizer.from_pretrained(model_nomi)
model      = DistilBertModel.from_pretrained(model_nomi)
```

> ## ⭐⭐ **AMMO ZAMONAVIY USUL — `Auto` SINFLARI** *(32-modul, 5-dars)*:
> ```python
> from transformers import AutoTokenizer, AutoModel
>
> for nomi in ["bert-base-uncased", "roberta-base", "distilbert-base-uncased"]:
>     tok = AutoTokenizer.from_pretrained(nomi)      # ⭐ BIR XIL kod
>     mod = AutoModel.from_pretrained(nomi)          # ⭐ hamma uchun
> ```
> **`Auto` sinflari `config.json` dan to'g'ri sinfni O'ZI tanlaydi.** Modelni almashtirish — **bitta satr**.

> **"Bu model uchun aniq vazifa turlariga mo'ljallangan boshqa funksiyalar ham mavjud. Hugging Face Models sahifasida ko'rib chiqishingiz mumkin bo'lgan ko'plab fine-tune qilingan modellar ham bor."**

---

## 8. 🎯 Qaysi birini tanlash?

| Vaziyat | Tanlov | Nega |
|---|---|---|
| Prototip, tez sinov | ## 🟢 **DistilBERT** | **70% tezroq**, 40% kichik |
| Mobil / edge qurilma | ## 🟢 **DistilBERT** | RAM va batareya |
| Maksimal aniqlik | ## 🔵 **RoBERTa** | 10× ko'p ma'lumot |
| Segment kerak *(QA, jumla juftligi)* | ## 🟡 **BERT / RoBERTa** | DistilBERT'da **YO'Q** |
| O'quv, tushunish | ## 🟡 **BERT** | Eng **hujjatlashtirilgan** |
| ⚠️ **Aniq vazifa** | ## ⭐ **fine-tune qilingan model** | Har doim **umumiy**dan yaxshi |

> ## 💡 **ENG MUHIM QATOR — OXIRGISI.** `bert-large-...-squad` *(3-dars)* — bu **fine-tune qilingan** model. U SQuAD'da **maxsus** o'qitilgan, shuning uchun QA'da **har qanday** umumiy `roberta-base` dan yaxshi ishlaydi.
>
> ```
> ❌ "RoBERTa BERT'dan yaxshi"        →  juda umumiy
> ✅ "VAZIFAMGA fine-tune qilingani"  →  har doim to'g'ri
> ```

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** RoBERTa qanday ochiladi?

**M2.** DistilBERT necha qatlamli?

**M3.** RoBERTa qaysi vazifani olib tashladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **R**obustly **O**ptimized **BERT** pretraining **A**pproach.

**M2.** ## **6 ta** *(BERT'da 12 ta)*.

**M3.** ## **NSP** — Next Sentence Prediction. Chunki u **foyda bermagan**.

</details>

### 🟡 O'rta

**M4.** ⭐ Uchala tokenizatorni **o'zbekcha** matnda solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
uz = "Mashinali o'rganish ajoyib darajada kuchli."
for nom, (Tok, _, nomi) in modellar.items():
    tk = Tok.from_pretrained(nomi).tokenize(uz)
    print(f"{nom:11s} {len(tk):2d} ta  {tk}")
```

**Kutilgan xulosa:** uchalasi ham o'zbekchani **bo'laklab tashlaydi** — ularning lug'atlarida o'zbekcha so'zlar **yo'q**. O'zbekcha uchun `bert-base-multilingual-cased` yoki `xlm-roberta-base` kerak *(32-modul, 3-dars)*.

</details>

**M5.** ⭐ `Auto` sinflari bilan uchala modelni bitta sikldan yuklang.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import AutoTokenizer, AutoModel

for nomi in ["bert-base-uncased", "roberta-base", "distilbert-base-uncased"]:
    m = AutoModel.from_pretrained(nomi)
    print(f"{nomi:26s} {type(m).__name__:18s} {sum(p.numel() for p in m.parameters()):>12,}")
```

```
bert-base-uncased          BertModel            109,482,240
roberta-base               RobertaModel         124,645,632
distilbert-base-uncased    DistilBertModel       66,362,880
```

## ✅ **`Auto` har biriga TO'G'RI sinfni tanladi.**

</details>

**M6.** DistilBERT'ga `token_type_ids` uzatib ko'ring — nima bo'ladi?

<details>
<summary>✅ Yechim</summary>

**Hech narsa.** Xato ham, ogohlantirish ham chiqmaydi — model uni **jim tashlab yuboradi**. Bu **ataylab** shunday qilingan, `**enc` bilan ishlash qulay bo'lishi uchun. Lekin bu **jim xato** manbai.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Uchala modelni **QA vazifasida** solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import pipeline

kontekst = ("Sunset Motors is a family-owned car dealership that opened in 1978. "
            "The dealership is located in Crestwood and covers ten acres.")

QA_MODELLAR = {
    "BERT-large":  "bert-large-uncased-whole-word-masking-finetuned-squad",
    "RoBERTa":     "deepset/roberta-base-squad2",
    "DistilBERT":  "distilbert-base-cased-distilled-squad",
}

for nom, m in QA_MODELLAR.items():
    qa = pipeline("question-answering", model=m)
    r = qa(question="Where is the dealership located?", context=kontekst)
    print(f"{nom:12s} {r['answer']:14s} {r['score']:.4f}")
```

⚠️ **DIQQAT — `roberta-base` EMAS, `roberta-base-squad2`.** Toza `roberta-base` QA qila **olmaydi** — unda `qa_outputs` boshi **yo'q** *(3-dars)*. **Fine-tune** qilingan varianti kerak.

</details>

**M8.** ⭐⭐ Uchala model uchun **tezlik–hajm** jadvalini yasang.

<details>
<summary>✅ Yechim</summary>

```python
import time, torch, pandas as pd
torch.set_num_threads(4)

s = "Machine learning is unbelievably powerful and it changes everything we do."
qator = []
for nom, (Tok, Mod, nomi) in modellar.items():
    t = Tok.from_pretrained(nomi); m = Mod.from_pretrained(nomi); m.eval()
    enc = t(s, return_tensors="pt")
    with torch.no_grad():
        for _ in range(3): m(**enc)
        t0 = time.perf_counter()
        for _ in range(30): m(**enc)
        ms = (time.perf_counter() - t0) / 30 * 1000
    qator.append({"model": nom,
                  "parametr_M": round(sum(p.numel() for p in m.parameters())/1e6, 1),
                  "vocab": t.vocab_size,
                  "token": len(enc["input_ids"][0]),
                  "ms": round(ms, 2)})

df = pd.DataFrame(qator)
df["ms/100M_param"] = (df.ms / df.parametr_M * 100).round(1)
print(df.to_string(index=False))
```

## 🔑 **`ms/100M_param` ustuni RoBERTa jumbog'ini ochadi** — uning parametrlari **ko'p**, lekin ular **embeddingda**, ya'ni hisoblanmaydi.

</details>

---

## 10. 🧠 O'zini tekshirish

<details>
<summary>❓ Distillyatsiya nima?</summary>

Kichik model *(shogird)* katta modelning **chiqish taqsimotiga** taqlid qilishga o'qitiladi — faqat "to'g'ri javob"ga emas.
</details>

<details>
<summary>❓ RoBERTa'da parametr ko'p, lekin tezroq. Nega?</summary>

Qo'shimcha **15M** parametr deyarli **butunlay lug'at embeddingida** *(50,265 vs 30,522)*. Embedding — **qidiruv jadvali**, hisob emas. Sekinlashtiradigan narsa — **qatlamlar soni**.
</details>

<details>
<summary>❓ DistilBERT bilan 6-darsdagi kod ishlaydimi?</summary>

**Yo'q** — `token_type_ids` **jim tashlab yuboriladi**. Segment ma'lumoti **yo'qoladi**. `distilbert-base-cased-distilled-squad` fine-tune qilingan modeli **segmentsiz** ishlashga o'qitilgan, shuning uchun `pipeline("question-answering")` orqali ishlating.
</details>

---

## 📌 Xulosa

| | 🔵 **BERT** | 🟣 **RoBERTa** | 🟢 **DistilBERT** |
|---|---|---|---|
| Yil / kim | 2018 Google | 2019 Meta | 2019 HF |
| Parametr | 109.5M | **124.6M** | ## **66.4M** |
| Qatlam | 12 | 12 | ## **6** |
| Lug'at | 30,522 | ## **50,265** | 30,522 |
| Tezlik *(bizda)* | 115.6 ms | 63.2 ms | ## **34.8 ms** |
| Tokenizator | WordPiece | **BPE** | WordPiece |
| NSP | ✅ | ❌ | ❌ |
| `token_type_ids` | ✅ | ✅ | ## ❌ **YO'Q** |
| Maxsus token | `[CLS]` `[SEP]` | `<s>` `</s>` | `[CLS]` `[SEP]` |

```
        O'LCHANGAN XULOSA
    ─────────────────────────
    parametr : −39.4%   (kurs: −40%)  ✅
    tezlik   : +69.9%   (kurs: +60%)  ⭐ kurs SUSTROQ aytgan
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Distillyatsiya | Knowledge distillation | Kichik model **kattasiga taqlid** qiladi |
| O'qituvchi / shogird | Teacher / student | Katta / kichik model |
| Dinamik maskalash | Dynamic masking | Maska **har safar o'zgaradi** |
| BPE | Byte-Pair Encoding | RoBERTa tokenizatori |
| Inferens | Inference | O'qitilgan modelni **ishlatish** |
| Jim xato | Silent failure | Xato chiqmaydi, **natija noto'g'ri** |

---

⬅️ [6-dars. QA-bot yaratamiz](06-Creating-a-QA-Bot.md) · 🏠 [Modul boshiga](README.md) · ➡️ [34-modul. XLNet bilan matn tasnifi](../34-Text-Classification-XLNet/README.md)
