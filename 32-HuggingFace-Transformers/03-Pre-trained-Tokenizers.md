# 3-dars. Oldindan o'qitilgan tokenizatorlar

## 🎬 Boshlashdan oldin

> **"Transformer pipeline'dan foydalanish til modellari bilan ishlashni tez va oson boshlashga imkon beradi."**
>
> ## **"Keling, endi bu pipeline ASLIDA NIMA QILAYOTGANIGA chuqurroq nazar tashlaymiz va qadamlarni yaxshiroq tushunishga harakat qilamiz."**

---

## 1. Birinchi qadam — tokenizatsiya

> ## **"Pipeline'ning birinchi qadami — kirish matnimizni TOKENIZATSIYA qilish."**
>
> **"Buning uchun Transformers paketidan `AutoTokenizer` ni import qilmoqchimiz."**

> ## ⚠️ **"Keyin ishlatmoqchi bo'lgan modelni KO'RSATISHIMIZ kerak. Bu tokenizator MO'LJALLANGAN MODELIMIZGA MOS tarzda tokenizatsiya qilishini ta'minlaydi."**
>
> ## **"Turli modellar tokenizatsiyani biroz BOSHQACHA yaratadi."**

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import AutoTokenizer

model = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model)

jumla = "I am so excited to be learning about large language models"
```

> ## 🔑 **BU — ENG MUHIM QOIDA:** tokenizator va model **JUFTLIK**. Ularni **aralashtirmang**.
> ```
> ❌ BERT modeli + XLNet tokenizatori  →  MA'NOSIZ natija
> ✅ BERT modeli + BERT tokenizatori   →  to'g'ri
> ```

---

## 2. Tokenizator nima qaytaradi?

> **"Keling, bu tokenizatorni jumla ustida ishga tushirib, u qanday ishlashini ko'ramiz."**

```python
input_ids = tokenizer(jumla)
print(input_ids)
```

```
{'input_ids': [101, 1045, 2572, 2061, 7568, 2000, 2022, 4083, 2055, 2312, 2653, 4275, 102],
 'token_type_ids': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 'attention_mask': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
```

> ## **"Bu yerda UCHTA narsa yaratilganini ko'ramiz: INPUT IDS, TOKEN TYPE IDS va ATTENTION MASK."**

### 🔧 `token_type_ids`

> **"Token type IDs — biz bir jumlani boshqasidan yoki kirish ketma-ketligini uning tasnifidan AJRATMOQCHI bo'lgan ba'zi modellar uchun ishlatiladi."**
>
> ## **"Turdagi ID **0** bo'lgan tokenlar BIRINCHI jumlaga, ID **1** bo'lganlar esa IKKINCHI jumlaga tegishli bo'ladi."**

**Ikki jumla bilan sinaymiz:**

```python
e = tokenizer("The cat sat.", "It was sleepy.")
print("tokenlar :", tokenizer.convert_ids_to_tokens(e["input_ids"]))
print("type_ids :", e["token_type_ids"])
```

> ## 💡 **Bu — 33-modulda *(BERT savol-javob)* juda muhim bo'ladi:** u yerda **savol** va **kontekst** aynan shu bilan ajratiladi.

### 👁️ `attention_mask`

> ## **"Attention mask, mohiyatan, modelga QAYSI SO'ZLARGA E'TIBOR BERISH MUHIMLIGINI aytadi."**

```
1  →  HAQIQIY token, e'tibor ber
0  →  TO'LDIRISH ([PAD]), e'tibor BERMA
```

> ## 🔁 **30-modul, 5-darsni eslang** — u yerda buni `padding=True` bilan ko'rgandik.

---

## 3. Qadamma-qadam ajratamiz

> **"Hozircha men faqat INPUT IDS ga e'tibor qaratmoqchiman."**

### ① Tokenlarga bo'lish

> **"Bizning tokenizatorimiz birinchi navbatda jumlamizni TOKENLARGA ajratadi."**

```python
tokens = tokenizer.tokenize(jumla)
print(tokens)
```

```
['i', 'am', 'so', 'excited', 'to', 'be', 'learning', 'about', 'large', 'language', 'models']
```

> 💡 **Diqqat: hammasi KICHIK harfda.** Chunki model — `bert-base-**uncased**` *(harf registrini e'tiborga olmaydigan)*.

### ② Raqamga aylantirish

> ## **"Bu tokenlar keyin MODELGA XOS oldindan belgilangan LUG'AT asosida raqamli qiymatga aylantiriladi."**

```python
token_ids = tokenizer.convert_tokens_to_ids(tokens)
print(token_ids)
```

```
[1045, 2572, 2061, 7568, 2000, 2022, 4083, 2055, 2312, 2653, 4275]
```

### ③ Orqaga dekodlash

> **"Biz bu token ID'larni tokenlarga QAYTA DEKODLAB tekshirishimiz mumkin."**

```python
print(repr(tokenizer.decode(token_ids)))
```

```
'i am so excited to be learning about large language models'
```

> ## ✅ **Asl jumlaga qaytdik** *(kichik harfda)*.

---

## 4. ⭐ Yashirin raqamlar — 101 va 102

> **"Endi yana token ID'larga qaraylik. Siz sezasizki, token ID'lar bizga to'liq tokenizator ishlatilganda berilgan INPUT IDS ichida bor."**
>
> ## **"Biroq input IDs'ga yana qarasangiz, faqat token IDs'ga qaraganimizda CHOP ETILMAGAN ba'zi QO'SHIMCHA RAQAMLAR borligini ko'rasiz."**

```
input_ids : [101, 1045, 2572, ..., 4275, 102]
              ↑                          ↑
token_ids :      [1045, 2572, ..., 4275]

              QAYERDAN keldi?
```

```python
print("101 →", repr(tokenizer.decode(101)))
print("102 →", repr(tokenizer.decode(102)))
```

```
101 → '[CLS]'
102 → '[SEP]'
```

> ## **"Bular — tokenizatorimiz tomonidan qo'shilgan MAXSUS TOKENLAR."**

### Barcha maxsus tokenlar

```python
print(tokenizer.all_special_tokens)
```

```
['[UNK]', '[SEP]', '[PAD]', '[CLS]', '[MASK]']
```

> Batafsil: [4-dars](04-Special-Tokens.md)

---

## 5. ⭐⭐ XLNet — BUTUNLAY BOSHQACHA

> ## **"Tokenizatsiya jarayoni qaysi modelni ishlatmoqchi bo'lishimizga qarab O'ZGARADI, chunki har bir model kirish ma'lumoti FORMATI, TOKENIZATSIYA STRATEGIYASI va MAXSUS TOKENLARDAN FOYDALANISH bo'yicha O'Z NOYOB TALABLARIGA ega."**

```python
tokenizer2 = AutoTokenizer.from_pretrained("xlnet-base-cased")

print("tokenlar :", tokenizer2.tokenize(jumla))
print("input_ids:", tokenizer2(jumla)["input_ids"])
```

```
tokenlar : ['▁I', '▁am', '▁so', '▁excited', '▁to', '▁be', '▁learning', '▁about', '▁large', '▁language', '▁models']
input_ids: [35, 569, 102, 5564, 22, 39, 1899, 75, 392, 1243, 2626, 4, 3]
```

## 🎯 UCHTA KATTA FARQ

### ① `▁` belgisi

```
BERT  :  'i', 'am', 'so', 'excited'
XLNet :  '▁I', '▁am', '▁so', '▁excited'
              ↑
    "▁" = BO'SHLIQ belgisi (SentencePiece)
```

> 💡 `▁` — oddiy pastki chiziq **emas**, bu **maxsus belgi** *(U+2581)*. U so'z **oldidagi bo'shliqni** bildiradi.

### ② Harf registri saqlanadi

```
BERT  :  'i'    (kichik — chunki UNCASED)
XLNet :  '▁I'   (KATTA — chunki CASED)
```

### ③ ⭐ Maxsus tokenlar OXIRIDA!

> ## **"Siz shuni ham sezishingiz mumkinki, BERT modeli input IDs'ni CLS maxsus tokeni bilan boshlagan bo'lsa, XLNet input IDs'ni bu maxsus token bilan UMUMAN BOSHLAMAYDI."**
>
> ## **"Buning o'rniga biz input IDs'ning OXIRIDA ikkita qo'shimcha raqam ko'ramiz."**

```python
print("4 →", repr(tokenizer2.decode(4)))
print("3 →", repr(tokenizer2.decode(3)))
```

```
4 → '<sep>'
3 → '<cls>'
```

```
BERT :  [101] i am so ... models [102]
         ↑                        ↑
       [CLS]                    [SEP]
        BOSHIDA                 OXIRIDA

XLNet:  ▁I ▁am ▁so ... ▁models [4] [3]
                                 ↑   ↑
                              <sep> <cls>
                              IKKALASI HAM OXIRIDA!
```

> ## 💥 **BIR XIL JUMLA. BUTUNLAY BOSHQA RAQAMLAR.**
>
> ```
> BERT  : [101, 1045, 2572, 2061, 7568, ...]
> XLNet : [35, 569, 102, 5564, ...]
>              ↑
>    "102" BERT'da [SEP], XLNet'da esa "▁so" so'zi!
> ```
>
> ## 🔑 **MANA NIMA UCHUN TOKENIZATOR VA MODEL JUFT BO'LISHI SHART.** Aralashtirsangiz, model **butunlay boshqa so'zlarni** ko'radi.

### ⚠️ Kursdagi bir nomuvofiqlik

> O'qituvchi aytadi: *"token type IDs endi faqat nollardan ko'proq narsani o'z ichiga oladi"*.

```python
e2 = tokenizer2(jumla)
print("token_type_ids:", e2.get("token_type_ids"))
```

```
token_type_ids: None
```

> ## ⚠️ **Bizning versiyada `token_type_ids` UMUMAN QAYTARILMADI** *(`None`)*.
>
> Bu — `transformers` **versiyasi** farqi. Kurs yozilgan paytda XLNet tokenizatori uni qaytargan *(va oxirgi token uchun `2` bergan)*.
>
> ## 💡 **Amaliy xulosa:** `token_type_ids` mavjudligini **tekshiring**, uni **bor deb hisoblamang**:
> ```python
> tt = e2.get("token_type_ids")     # ✅ xavfsiz
> tt = e2["token_type_ids"]          # ❌ KeyError berishi mumkin
> ```

---

## 6. 🇺🇿 O'zbekcha — uchta tokenizatorni solishtiramiz

```python
UZ = "Toshkent O'zbekiston poytaxti"

for nom in ["bert-base-uncased", "xlnet-base-cased",
            "bert-base-multilingual-cased"]:
    t = AutoTokenizer.from_pretrained(nom)
    tk = t.tokenize(UZ)
    print(f"{nom:32s} {len(tk):2d} ta")
    print(f"{'':32s} {tk}")
```

> ## 🎯 **KUTILGAN NAQSH:**
> ```
> bert-base-uncased            →  KO'P bo'lak (ingliz lug'ati)
> xlnet-base-cased             →  KO'P bo'lak
> bert-base-multilingual-cased →  KAMROQ bo'lak  ✅ (104 til)
> ```
>
> ## 💡 **30-modulda o'lchagandik:** `o'zbekiston` → **6 token** *(ingliz tokenizatorida)*. Ko'p tilli tokenizator buni **ancha yaxshi** bajaradi.
>
> ## ✅ **AMALIY MASLAHAT:** o'zbekcha matn bilan ishlasangiz — **ko'p tilli** modelni tanlang *(`bert-base-multilingual-cased`, `xlm-roberta-base`)*.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Tokenizator uchta nima qaytaradi?

**M2.** 101 va 102 nima?

**M3.** Nima uchun modelni ko'rsatish kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** `input_ids` · `token_type_ids` · `attention_mask`.

**M2.** ## `[CLS]` *(101)* va `[SEP]` *(102)* — **maxsus tokenlar**, tokenizator **o'zi** qo'shadi.

**M3.** Har model **o'z tokenizatsiya strategiyasi** va **o'z lug'atiga** ega. Aralashtirsangiz — **ma'nosiz** natija.

</details>

### 🟡 O'rta

**M4.** ⭐ BERT va XLNet tokenizatsiyasining **uchta farqi**?

**M5.** `attention_mask` nima uchun kerak?

**M6.** `▁` belgisi nima?

<details>
<summary>✅ Javoblar</summary>

**M4.**
```
① ▁ belgisi        BERT yo'q · XLNet BOR (SentencePiece)
② harf registri    BERT kichik (uncased) · XLNet KATTA (cased)
③ maxsus tokenlar  BERT [CLS] BOSHIDA · XLNet <cls> OXIRIDA
```

**M5.** Modelga **qaysi tokenlar haqiqiy** *(1)*, qaysilari **to'ldirish** *(0)* ekanini aytadi.

**M6.** **Bo'shliq** belgisi *(SentencePiece, U+2581)* — so'z oldidagi bo'shliqni bildiradi.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Bir jumlani **beshta** tokenizatorda solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

MODELLAR = ["bert-base-uncased", "bert-base-cased", "xlnet-base-cased",
            "distilgpt2", "bert-base-multilingual-cased"]
JUMLA = "I am so excited to be learning about large language models"

r = []
for nom in MODELLAR:
    try:
        t = AutoTokenizer.from_pretrained(nom)
    except Exception as e:
        print(f"❌ {nom}: {type(e).__name__}")
        continue
    tk = t.tokenize(JUMLA)
    ids = t(JUMLA)["input_ids"]
    r.append({"model": nom[:30], "lug'at": t.vocab_size,
              "tokenlar": len(tk), "input_ids": len(ids),
              "maxsus": len(ids) - len(tk),
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

> ## 🔑 **`maxsus` ustuni — eng qiziq:**
> ```
> BERT       →  2  ([CLS] va [SEP])
> XLNet      →  2  (<sep> va <cls>)
> distilgpt2 →  0  ← GPT maxsus token QO'SHMAYDI!
> ```
>
> ## 💡 **Va `distilgpt2` da yana bir farq — `Ġ` belgisi:**
> ```
> XLNet      →  '▁am'   (SentencePiece)
> distilgpt2 →  'Ġam'   (BPE — byte-level)
> ```
> **Ikkalasi ham bo'shliqni bildiradi**, lekin **turli usulda**. 30-modulda `Ġcat` ni ko'rgandik.
>
> ## 💡 **GPT nima uchun 0?** Chunki GPT — **generativ** model *(30-modul: faqat decoder)*. U matnni **davom ettiradi**, tasniflamaydi — shuning uchun `[CLS]` **kerak emas**.
>
> ## 🎯 **Mana arxitektura va tokenizatsiya BOG'LIQLIGI.**

</details>

**M8.** ⭐⭐ 🇺🇿 Uchta tokenizatorni o'zbekcha matnda solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
UZ_MATN = ("Toshkent O'zbekiston poytaxti. "
           "Bu shaharda ko'plab qiziqarli joylar bor.")

r = []
for nom in ["bert-base-uncased", "xlnet-base-cased",
            "bert-base-multilingual-cased", "xlm-roberta-base"]:
    try:
        t = AutoTokenizer.from_pretrained(nom)
    except Exception:
        continue
    tk = t.tokenize(UZ_MATN)
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

## 🎉 KO'P TILLI MODEL YAQQOL YAXSHIROQ

```
xlnet-base-cased              →  36 token
bert-base-uncased             →  33 token
bert-base-multilingual-cased  →  26 token     ✅ 28% KAMROQ
```

> ## 💥 **VA ENG MUHIMI — BIRINCHI SO'ZGA QARANG:**
>
> ```
> ingliz BERT   →  ['to', '##sh', '##ken', '##t']    4 ta bo'lak
> XLNet         →  ['▁To', 'sh', 'ken', 't']         4 ta bo'lak
> KO'P TILLI    →  ['Toshkent']                       1 TA TOKEN!  ✅
> ```
>
> ## 🔑 **`bert-base-multilingual-cased` `Toshkent` ni BUTUN SO'Z sifatida BILADI.** U 104 tilning Wikipedia matnida o'qitilgan — **o'zbek tili ham ular orasida**.
>
> ⚠️ Lekin `O'zbekiston` hali ham bo'linadi: `['O', "'", 'z', '##bek', ...]` — **apostrof muammosi** *(28-modul)* bu yerda ham saqlanadi.

> ## 💡 **`xlm-roberta-base` — 100 tilda o'qitilgan, lug'ati 250 002 token.** O'zbekcha uchun **eng yaxshi** ochiq variantlardan biri.
>
> ## ⚠️ **LEKIN DIQQAT:** yaxshi **tokenizatsiya** — bu faqat **birinchi** qadam. Model **o'zbekcha vazifada** o'qitilganmi? Buni **29-moduldagi** `uz_tayyorlik()` testi bilan **o'lchang**.
>
> ```
> ✅ yaxshi tokenizatsiya  ≠  ✅ yaxshi natija
> ```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Tokenizator nima qaytaradi?
2. `token_type_ids` nima uchun?
3. 101 va 102 nima?
4. BERT va XLNet farqi?
5. Nima uchun tokenizator va model juft bo'lishi kerak?

<details>
<summary>✅ Javoblar</summary>

1. `input_ids` · `token_type_ids` · `attention_mask`.
2. **Ikki jumlani ajratish** uchun — `0` = birinchi, `1` = ikkinchi *(33-modulda muhim)*.
3. `[CLS]` va `[SEP]` — **maxsus tokenlar**.
4. `▁` belgisi · **harf registri** · maxsus tokenlar **oxirida**.
5. Har modelning **o'z lug'ati** bor — bir xil raqam **turli so'zni** anglatadi *(masalan `102`)*.

</details>

---

## 📌 Xulosa

```
TOKENIZATOR UCHTA NARSA QAYTARADI

  input_ids       →  raqamlar (maxsus tokenlar BILAN)
  token_type_ids  →  qaysi jumla (0 yoki 1)
  attention_mask  →  1 = haqiqiy, 0 = to'ldirish


UCH QADAM
  ① tokenize()              →  ['i', 'am', 'so', ...]
  ② convert_tokens_to_ids() →  [1045, 2572, 2061, ...]
  ③ decode()                →  'i am so excited...'


MAXSUS TOKENLAR (BERT)
  101 → [CLS]    102 → [SEP]
  ['[UNK]', '[SEP]', '[PAD]', '[CLS]', '[MASK]']


⭐⭐ BERT vs XLNet — BIR XIL JUMLA, BOSHQA HAMMASI

  BERT :  ['i', 'am', 'so', ...]           [101, 1045, 2572, 2061, ...]
  XLNet:  ['▁I', '▁am', '▁so', ...]        [35, 569, 102, 5564, ...]

  ① ▁ belgisi        (SentencePiece)
  ② harf registri    (uncased vs cased)
  ③ [CLS] BOSHIDA  vs  <cls> OXIRIDA

  ⚠️ "102" BERT'da [SEP], XLNet'da "▁so"!
      →  TOKENIZATOR va MODEL JUFT bo'lishi SHART


🇺🇿 O'ZBEKCHA
   ingliz tokenizator  →  matn MAYDALANADI (30-modul: 3.1×)
   ko'p tilli          →  ANCHA yaxshi
   (bert-base-multilingual-cased · xlm-roberta-base)

   ⚠️ lekin yaxshi tokenizatsiya ≠ yaxshi natija — O'LCHANG
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `input_ids` | *input IDs* | Tokenlarning raqamli ko'rinishi |
| `token_type_ids` | *token type IDs* | Qaysi jumlaga tegishli |
| `attention_mask` | *attention mask* | Qaysi tokenga e'tibor berish |
| SentencePiece | *SentencePiece* | `▁` ishlatuvchi tokenizatsiya usuli |
| Uncased | *uncased* | Harf registrini e'tiborga olmaydi |
| Lug'at hajmi | *vocab size* | Tokenlar soni |

---

⬅️ [Oldingi: Transformer pipeline](02-The-Transformer-Pipeline.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Maxsus tokenlar](04-Special-Tokens.md)
