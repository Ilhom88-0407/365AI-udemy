# 5-dars. Kirish embeddinglari

## 🎬 Boshlashdan oldin

> **"Transformer arxitekturasidagi birinchi qadam — KIRISH EMBEDDINGLARINI yaratish."**
>
> ## **"Agar siz tabiiy tilni qayta ishlash bilan tanish bo'lsangiz, matnni to'g'ridan-to'g'ri modelga bera olmasligimizni bilasiz. Avval uni RAQAMLI KO'RINISHGA aylantirishimiz kerak."**

> ## 💡 **Bu sizga TANISH.** 24-modulda siz aynan shuni `CountVectorizer` va `TfidfVectorizer` bilan qilgansiz. Bu dars — **o'sha g'oyaning ANCHA aqlliroq versiyasi**.

---

## 1. ① Tokenizatsiya

> ## **"Birinchi qadam — kirish matnini TOKENLARGA bo'lish. Agar tokenlar bilan tanish bo'lmasangiz — bular so'zlar, SO'Z BO'LAKLARI yoki hatto matnning HARFLARI bo'lishi mumkin, ishlatilgan tokenizatsiya strategiyasiga qarab."**
>
> **"Masalan, 'I love natural language processing' jumlasi quyidagicha tokenizatsiya qilinishi mumkin."**

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained(
    "distilbert-base-uncased-finetuned-sst-2-english")

s = "I love natural language processing"
print("tokenlar:", tok.tokenize(s))
```

```
tokenlar: ['i', 'love', 'natural', 'language', 'processing']
```

### ⭐ "So'z bo'laklari" nima degani?

O'qituvchi **subword** *(so'z bo'lagi)* haqida gapiradi. **Ko'ramiz:**

```python
for w in ["tokenization", "transformers", "uzbekistan",
          "antidisestablishmentarianism"]:
    print(f"{w:30s} → {tok.tokenize(w)}")
```

```
tokenization                   → ['token', '##ization']
transformers                   → ['transformers']
uzbekistan                     → ['uzbekistan']
antidisestablishmentarianism   → ['anti', '##dis', '##est', '##ab', '##lish', '##ment', '##arian', '##ism']
```

> ## 🔑 **`##` — "bu oldingi tokenning DAVOMI" degani.**
>
> ```
> tokenization  →  token + ##ization
>                     ↑
>          Model "token" so'zini BILADI,
>          "-ization" qo'shimchasini ham BILADI
>          →  yangi so'zni ham TUSHUNADI
> ```

> ## 💥 **BU — 24-MODULDAGI ENG KATTA MUAMMONING YECHIMI!**
>
> Eslang: `CountVectorizer` da **OOV** *(out-of-vocabulary)* muammosi bor edi — lug'atda yo'q so'z **butunlay yo'qolardi**. Subword tokenizatsiya bu muammoni **butunlay hal qiladi**: har qanday so'z, hatto **hech qachon ko'rilmagan** bo'lsa ham, ma'lum bo'laklarga ajratiladi.

> 🇺🇿 **Yoqimli topilma:** `uzbekistan` — **bitta token**! Model buni **butun so'z** sifatida biladi.

---

## 2. ② Tokenlarni raqamga aylantirish

> **"Har bir token oldindan belgilangan LUG'AT asosida noyob identifikatsiya raqamiga moslanadi. Bu lug'at odatda katta matn korpusidan quriladi va model taniy oladigan barcha tokenlarni o'z ichiga oladi."**
>
> **"Masalan, 'I' 34-raqamga, 'love' 56-raqamga moslanishi mumkin."**

```python
ids = tok.encode(s)
print("id lar :", ids)
print("to'liq :", tok.convert_ids_to_tokens(ids))
```

```
id lar : [101, 1045, 2293, 3019, 2653, 6364, 102]
to'liq : ['[CLS]', 'i', 'love', 'natural', 'language', 'processing', '[SEP]']
```

> ## 🤔 **101 va 102 qayerdan keldi?**
>
> ```
> [CLS] = 101   →  "jumla BOSHI"   (classification token)
> [SEP] = 102   →  "jumla OXIRI"   (separator)
> ```
>
> Bu — **xizmat tokenlari**. Model ularni **o'zi** qo'shadi.
>
> ## 💡 **`[CLS]` juda muhim:** tasniflash paytida model **aynan shu token**ning oxirgi vektorini oladi va shundan `POSITIVE`/`NEGATIVE` ni chiqaradi. Ya'ni `[CLS]` — **butun jumlaning xulosasi**.

---

## 3. ③ Embedding matritsasi

> ## **"Tokenlar o'z indekslariga moslangandan so'ng, model EMBEDDING MATRITSASIDAN oldindan o'qitilgan SO'Z EMBEDDINGLARINI oladi."**
>
> **"Bu embedding matritsasi lug'atdagi har bir token uchun vektor ko'rinishlarini — ko'pincha so'z embeddinglari deb ataladi — o'z ichiga oladi."**

```python
from transformers import AutoModel
mod = AutoModel.from_pretrained(
    "distilbert-base-uncased-finetuned-sst-2-english")

E = mod.embeddings.word_embeddings.weight
print("embedding matritsasi:", tuple(E.shape))
print('"i" vektorining birinchi 8 soni:',
      [round(float(x), 4) for x in E[tok.convert_tokens_to_ids("i")][:8]])
```

```
embedding matritsasi: (30522, 768)
"i" vektorining birinchi 8 soni: [-0.0128, 0.005, -0.0263, -0.0045, 0.0303, 0.0099, -0.0592, 0.019]
```

> ## 🎯 **30 522 ta so'z × 768 ta son = 23 440 896 parametr.**
>
> Har bir so'z — **768 o'lchamli fazodagi nuqta**.
>
> ## 💡 **24-modul bilan taqqoslang:**
> ```
> TF-IDF      →  har so'z = LUG'AT HAJMIDAGI siyrak vektor (deyarli hammasi 0)
> Embedding   →  har so'z = 768 o'lchamli ZICH vektor (hamma son ma'noli)
> ```

---

## 4. ⭐ "Ma'nosi yaqin so'zlar yaqin joylashadi" — TEKSHIRAMIZ

> ## **"Bu vektorlar tokenlar haqidagi SEMANTIK va SINTAKTIK ma'lumotni kodlaydi, chunki bir-biriga MA'NOSI YAQIN so'zlar vektor fazosida BIR-BIRIGA YAQIN joylashadi."**

**Bu — juda aniq da'vo. Sinab ko'ramiz:**

```python
import torch.nn.functional as F

def vec(w):
    return E[tok.convert_tokens_to_ids(w)]

for a, b in [("king", "queen"), ("king", "man"), ("king", "banana"),
             ("good", "great"), ("good", "bad")]:
    print(f"  cos({a:>7s}, {b:<7s}) = {float(F.cosine_similarity(vec(a), vec(b), dim=0)):.3f}")
```

```
  cos(   king, queen  ) = 0.654
  cos(   king, man    ) = 0.385
  cos(   king, banana ) = 0.318
  cos(   good, great  ) = 0.526
  cos(   good, bad    ) = 0.528
```

### ✅ Yaxshi xabar

```
king ↔ queen   0.654    ← ENG YAQIN  ✅ ikkalasi ham "hukmdor"
king ↔ man     0.385
king ↔ banana  0.318    ← ENG UZOQ   ✅ hech qanday aloqa yo'q
```

> ## ✅ **DA'VO TASDIQLANDI** — `king` va `queen` haqiqatan **yaqin**, `banana` esa **uzoq**.

### ❌ ⭐⭐ LEKIN ENDI OXIRGI IKKI QATORGA QARANG

```
good ↔ great   0.526      SINONIMLAR
good ↔ bad     0.528      ANTONIMLAR
                  ↑
        DEYARLI BIR XIL!  (hatto "bad" bir oz YAQINROQ)
```

> ## 😲 **"good" va "bad" — QARAMA-QARSHI so'zlar. Nima uchun ular "good" va "great" kabi yaqin?**

### 🔑 Javob — va bu BUTUN MODULNING KALITI

```
KIRISH embeddingi KONTEKSTNI BILMAYDI.

  U faqat shuni biladi:
     "good" va "bad" — IKKALASI HAM sifat
     ikkalasi ham SIFAT baholash uchun ishlatiladi
     ikkalasi ham "The movie was ___" o'rniga tushadi
                    ↑
        GRAMMATIK jihatdan bir xil
        MA'NO jihatdan teskari

  Kirish embeddingi GRAMMATIKANI ko'radi, MA'NONI emas.
```

> ## 💥 **MANA NIMA UCHUN TRANSFORMERGA E'TIBOR KERAK.**
>
> ```
> KIRISH embeddingi  →  "good" har doim BIR XIL vektor
>                       (kontekst muhim emas)
>
> E'TIBOR qatlamlaridan keyin
>                    →  "not good" dagi "good"  ≠  "very good" dagi "good"
>                          ↑
>                    KONTEKSTGA MOSLASHGAN vektor
> ```
>
> ## 🎯 **29-modulda o'lchagandik:** `distilbert` `"The food was not good"` ni **to'g'ri** `NEGATIVE` dedi. Kirish embeddingi buni **hech qachon** qila olmasdi — chunki u uchun `good` — bu shunchaki `good`.
>
> **Ma'noni E'TIBOR QATLAMLARI quradi.** Aynan shuni [6-darsda](06-Multi-Headed-Attention.md) ko'ramiz.

---

## 5. ④ Pozitsion kodlash

> ## **"Biroq bir xil so'z jumlada QANDAY ISHLATILISHIGA qarab TURLI MA'NOLARGA ega bo'lishi mumkin. Mana shu yerda POZITSION KODLASH paydo bo'ladi."**
>
> ## **"Pozitsion kodlash — bu, mohiyatan, har bir tokenga uning jumladagi O'RNINI qayd etuvchi raqam berishimiz."**
>
> **"Bu so'zlar tartibi haqidagi ma'lumotni KIRISH MA'LUMOTINING O'ZIDA saqlay olishimizni anglatadi — bitta so'zni ketma-ket tartibda qayta ishlash o'rniga."**

```python
P = mod.embeddings.position_embeddings.weight
print("pozitsion matritsa:", tuple(P.shape))
```

```
pozitsion matritsa: (512, 768)
```

> ## 🔑 **512 ta pozitsiya × 768 ta son.**
>
> ## 💡 **MANA NIMA UCHUN `maks_uzunlik = 512`!** 29-modulda bu raqamni ko'rgandik va *"nima uchun aynan 512?"* deb so'ramagandik. Javob shu yerda: modelda **512 tadan ortiq** pozitsiya vektori **shunchaki YO'Q**.

### Yakuniy kirish — ikkisining YIG'INDISI

```
so'z embeddingi   +   pozitsion embedding   =   kirish
   "love" nima          2-o'rinda               model ko'radigan
        ↑                    ↑
   MA'NO haqida        TARTIB haqida
```

```python
import torch
ids_t = torch.tensor([tok.encode("I love NLP")])
w = mod.embeddings.word_embeddings(ids_t)
poz = mod.embeddings.position_embeddings(torch.arange(ids_t.shape[1]))
print("so'z embeddingi   :", tuple(w.shape))
print("pozitsion         :", tuple(poz.shape))
print("yig'indi (kirish) :", tuple((w + poz).shape))
```

```
so'z embeddingi   : (1, 6, 768)
pozitsion         : (6, 768)
yig'indi (kirish) : (1, 6, 768)
```

> 💡 **Nima uchun 6 ta, 3 ta emas?** `"I love NLP"` uch so'z, lekin:
> ```
> [CLS] · i · love · nl · ##p · [SEP]   =  6 ta token
>                     ↑
>          "NLP" lug'atda YO'Q  →  ikkiga bo'lindi
> ```

---

## 6. ⑤ To'ldirish va kesish

> ## **"Barcha kirish ketma-ketliklari BIR XIL UZUNLIKDA bo'lishini ta'minlash uchun TO'LDIRISH (padding) yoki KESISH (truncation) ham qo'llanishi mumkin."**
>
> **"To'ldirish qisqaroq ketma-ketliklarning embeddinglariga maxsus tokenlar yoki nollarni qo'shadi, kesish esa uzunroq ketma-ketliklardan tokenlarni olib tashlaydi."**

```python
matnlar = ["Short text", "This is a much longer piece of text here"]
enc = tok(matnlar, padding=True, truncation=True, return_tensors="pt")
print("shakl        :", tuple(enc["input_ids"].shape))
print("1-jumla      :", tok.convert_ids_to_tokens(enc["input_ids"][0]))
print("attention_mask:", enc["attention_mask"][0].tolist())
```

```
shakl        : (2, 11)
1-jumla      : ['[CLS]', 'short', 'text', '[SEP]', '[PAD]', '[PAD]', '[PAD]', '[PAD]', '[PAD]', '[PAD]', '[PAD]']
attention_mask: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
```

> ## 🔑 **`attention_mask` — juda muhim.**
>
> ```
> 1  →  "bu HAQIQIY token, unga E'TIBOR BER"
> 0  →  "bu TO'LDIRISH, uni E'TIBORGA OLMA"
> ```
>
> Usiz model `[PAD]` tokenlarini **haqiqiy so'z** deb o'ylab, natijani **buzib yuborardi**.

> ## ⚠️ **29-modulni eslang:** `truncation=True` — bu **kesish**. U **xato bermaydi**, **jimgina** matn oxirini olib tashlaydi.

---

## 7. Xulosa — beshta qadam

> **"Embedding jarayoni kirish matnining kontekstual va semantik ma'lumotini qamrab oladi va uni raqamlarda ifodalaydi. Bu — katta til modellari muvaffaqiyatining HAL QILUVCHI komponenti."**
>
> **"Kirish ketma-ketligimizdagi barcha tokenlar uchun hosil bo'lgan kirish embeddinglari keyin transformerning ENCODER blokiga uzatiladi."**

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Kirish embeddingini yaratishning 5 qadamini ayting.

**M2.** `[CLS]` va `[SEP]` nima?

**M3.** Embedding matritsasining o'lchami qancha?

<details>
<summary>✅ Javoblar</summary>

**M1.**
```
① Tokenizatsiya       →  matn → tokenlar
② ID ga aylantirish    →  tokenlar → raqamlar
③ Embedding olish      →  raqamlar → 768 o'lchamli vektorlar
④ Pozitsion kodlash    →  + o'rin ma'lumoti
⑤ Padding / truncation →  bir xil uzunlikka keltirish
```

**M2.** `[CLS]` = **101** — jumla boshi *(tasniflash uchun ishlatiladi)* · `[SEP]` = **102** — jumla oxiri.

**M3.** ## **(30522, 768)** = **23 440 896** parametr.

</details>

### 🟡 O'rta

**M4.** ⭐ `##` belgisi nimani anglatadi va u qaysi muammoni hal qiladi?

**M5.** Nima uchun `maks_uzunlik = 512`?

**M6.** `attention_mask` nima uchun kerak?

<details>
<summary>✅ Javoblar</summary>

**M4.** `##` = *"oldingi tokenning DAVOMI"*.
```
tokenization → ['token', '##ization']
```
> ## 🔑 **Bu 24-moduldagi OOV muammosini hal qiladi.** `CountVectorizer` lug'atda yo'q so'zni **butunlay tashlab** yuborardi. Subword tokenizatsiya har qanday so'zni **ma'lum bo'laklarga** ajratadi — hech narsa yo'qolmaydi.

**M5.** Chunki `position_embeddings` matritsasi — **(512, 768)**. Modelda **512 tadan ortiq** pozitsiya vektori **yo'q**.

**M6.** `[PAD]` tokenlarini e'tibordan **chiqarish** uchun. `1` = haqiqiy token, `0` = to'ldirish.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ *"Ma'nosi yaqin so'zlar yaqin joylashadi"* da'vosini **tekshiring**. U **doim** to'g'rimi?

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd
import torch.nn.functional as F

juftliklar = [
    ("king", "queen", "bog'liq"),   ("king", "man", "bog'liq"),
    ("king", "banana", "bog'liq emas"),
    ("cat", "dog", "bog'liq"),      ("cat", "computer", "bog'liq emas"),
    ("good", "great", "SINONIM"),   ("good", "bad", "ANTONIM"),
    ("hot", "warm", "SINONIM"),     ("hot", "cold", "ANTONIM"),
    ("love", "adore", "SINONIM"),   ("love", "hate", "ANTONIM"),
]
r = [{"a": a, "b": b, "tur": t,
      "cos": round(float(F.cosine_similarity(vec(a), vec(b), dim=0)), 3)}
     for a, b, t in juftliklar]
df = pd.DataFrame(r)
print(df.to_string(index=False))
print("\nO'rtacha o'xshashlik turlar bo'yicha:")
print(df.groupby("tur")["cos"].mean().round(3).to_string())
```

> ## 🎯 **KUTILGAN NATIJA — IKKI QISMLI:**
>
> ```
> ✅ "bog'liq" vs "bog'liq emas"   →  FARQ BOR
>       king↔queen 0.654  vs  king↔banana 0.318
>
> ❌ "SINONIM" vs "ANTONIM"        →  FARQ YO'Q
>       good↔great 0.526  vs  good↔bad 0.528
> ```
>
> ## 🔑 **XULOSA — da'vo YARIM to'g'ri:**
>
> | Nimani ajratadi | Kirish embeddingi |
> |---|---|
> | **Mavzu** *(qirol vs banan)* | ✅ **Ha** |
> | **Grammatik rol** *(sifat vs ot)* | ✅ **Ha** |
> | **Sentiment** *(yaxshi vs yomon)* | ## ❌ **YO'Q** |
>
> ## 💡 **Va bu — KAMCHILIK EMAS, MEHNAT TAQSIMOTI:**
> ```
> KIRISH embeddingi   →  "bu so'z QANDAY so'z?"     (kontekstsiz)
> E'TIBOR qatlamlari  →  "bu so'z BU YERDA nima?"   (kontekst bilan)
> ```
>
> ## ⚠️ **AMALIY OQIBAT:** agar siz sentiment tahlili uchun **faqat** so'z embeddinglarini ishlatsangiz *(masalan, o'rtacha embedding olib)*, natija **yomon** bo'ladi — chunki `good` va `bad` deyarli **bir xil** vektor. Kontekstual model **shart**.

</details>

**M8.** ⭐⭐ 🇺🇿 O'zbekcha so'zlar bu tokenizatorda qanday bo'linadi?

<details>
<summary>✅ Yechim</summary>

```python
uz = ["kitob", "kitoblar", "uylarimizda", "o'zbekiston",
      "toshkent", "salom", "rahmat", "qiziqarli"]
for w in uz:
    t = tok.tokenize(w)
    print(f"{w:14s} → {len(t):2d} ta bo'lak  {t}")
```

```
kitob          →  2 ta bo'lak  ['kit', '##ob']
kitoblar       →  3 ta bo'lak  ['kit', '##ob', '##lar']
uylarimizda    →  5 ta bo'lak  ['u', '##yla', '##rim', '##iz', '##da']
o'zbekiston    →  6 ta bo'lak  ['o', "'", 'z', '##bek', '##isto', '##n']
toshkent       →  4 ta bo'lak  ['to', '##sh', '##ken', '##t']
salom          →  2 ta bo'lak  ['sal', '##om']
rahmat         →  3 ta bo'lak  ['ra', '##hma', '##t']
qiziqarli      →  5 ta bo'lak  ['qi', '##zi', '##qa', '##rl', '##i']
```

> ## 📉 **NATIJA — o'zbekcha so'zlar MAYDALANIB ketdi.**
>
> ```
> INGLIZ:   uzbekistan   →  1 ta token   ✅
> O'ZBEK:   o'zbekiston  →  6 ta token   ❌
>                            ↑
>            BIR XIL SO'Z, 6 BARAVAR ko'p token!
> ```
>
> ## 😲 **Va e'tibor bering:** `o'zbekiston` → `['o', "'", 'z', ...]` — **apostrof ALOHIDA token bo'lib chiqdi**, `o'` harfi esa **ikkiga** bo'linib ketdi.
>
> ## 🔑 **Bu — 28-MODULDAGI APOSTROF MUAMMOSINING AYNAN O'ZI.** U yerda `CountVectorizer` ni tuzatgandik. Bu yerda esa tokenizator **modelning ichida** — uni **tuzatib bo'lmaydi**.

**Yana bir qiziq kuzatuv:**

```
uylarimizda  →  ['u', '##yla', '##rim', '##iz', '##da']
                             ↑        ↑      ↑
        Tasodifan, bo'laklar QO'SHIMCHALARGA yaqin tushdi!
        (-lar → ##yla · -imiz → ##rim/##iz · -da → ##da)
```

> ⚠️ **Bu — TASODIF, morfologik tahlil emas.** Tokenizator o'zbek grammatikasini **bilmaydi** — u shunchaki ingliz korpusida **eng tez-tez uchraydigan harf ketma-ketliklarini** o'rgangan. `kitob → ['kit', '##ob']` buni yaqqol ko'rsatadi: bu bo'linish **hech qanday** ma'noga ega emas.
>
> ## ⚠️ **Bu nima uchun MUHIM — uchta oqibat:**
> ```
> ① Bir xil matn KO'PROQ token oladi
>       o'zbekcha jumla ≈ 2-3 BARAVAR ko'p token
>       →  512 chegarasiga TEZROQ yetasiz
>       →  API ishlatsangiz — QIMMATROQ (token bo'yicha to'lanadi)
>
> ② Model ma'noni MA'NOSIZ bo'laklardan yig'ishi kerak
>       'kit' + '##ob'  →  "kitob" ma'nosini qayerdan bilsin?
>       →  natija ANIQLIGI pasayadi
>
> ③ 29-modulda o'lchagan 0.500 natijaning BIR SABABI — AYNAN SHU
> ```
>
> 💡 **Yechim:** o'zbek tilida ishlaganda **ko'p tilli tokenizator** *(mBERT, XLM-R)* ishlating — u o'zbekcha bo'laklarni yaxshiroq biladi. Yoki **28-moduldagi** `uznlp` yondashuviga qayting.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Nima uchun matnni to'g'ridan-to'g'ri modelga bera olmaymiz?
2. Subword tokenizatsiya qanday muammoni hal qiladi?
3. Embedding vektorining o'lchami qancha?
4. Pozitsion kodlash nima uchun kerak?
5. `good` va `bad` nima uchun yaqin joylashgan?

<details>
<summary>✅ Javoblar</summary>

1. Model **raqamlar** bilan ishlaydi — matnni **raqamli ko'rinishga** aylantirish kerak.
2. ## **OOV** *(lug'atda yo'q so'z)* — 24-moduldagi muammo. Har qanday so'z **ma'lum bo'laklarga** ajratiladi.
3. ## **768** *(`distilbert` da)*.
4. Chunki transformer hamma tokenni **bir vaqtda** oladi — **tartib** ma'lumoti alohida qo'shilishi kerak.
5. Chunki kirish embeddingi **grammatik rolni** ko'radi *(ikkalasi ham sifat)*, **ma'noni** emas. Ma'noni **e'tibor qatlamlari** quradi.

</details>

---

## 📌 Xulosa

```
KIRISH EMBEDDINGI — BESH QADAM

  ① TOKENIZATSIYA
       "I love NLP" → ['i', 'love', 'nl', '##p']
       ## = oldingi tokenning DAVOMI  →  OOV muammosi HAL BO'LDI

  ② ID GA AYLANTIRISH
       [101, 1045, 2293, ..., 102]
       [CLS]=101 (jumla boshi)  ·  [SEP]=102 (oxiri)

  ③ EMBEDDING MATRITSASI
       (30522, 768) = 23,440,896 parametr
       har so'z = 768 o'lchamli nuqta

  ④ POZITSION KODLASH
       (512, 768)  ←  MANA NIMA UCHUN maks_uzunlik = 512!
       kirish = so'z embeddingi + pozitsion embedding

  ⑤ PADDING / TRUNCATION
       attention_mask: 1 = haqiqiy, 0 = to'ldirish


⭐⭐ O'LCHANGAN — "yaqin so'zlar yaqin joylashadi"?

  ✅ MAVZU bo'yicha ISHLAYDI
       king ↔ queen    0.654
       king ↔ banana   0.318

  ❌ SENTIMENT bo'yicha ISHLAMAYDI
       good ↔ great    0.526   (SINONIM)
       good ↔ bad      0.528   (ANTONIM)
                          ↑
                 DEYARLI BIR XIL!

  🔑 Kirish embeddingi GRAMMATIKANI ko'radi, MA'NONI emas

  💥 MANA NIMA UCHUN E'TIBOR KERAK:
       kirish:  "good" har doim bir xil vektor
       e'tibor: "not good" ≠ "very good"

       →  6-DARS
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Token | *token* | Matnning eng kichik birligi |
| Subword | *subword* | So'z bo'lagi *(`##ization`)* |
| Embedding | *embedding* | So'zning zich vektori |
| Lug'at | *vocabulary* | Model biladigan tokenlar |
| Pozitsion kodlash | *positional encoding* | So'z o'rni ma'lumoti |
| To'ldirish | *padding* | Bir xil uzunlikka keltirish |
| Kesish | *truncation* | Uzun matnni qisqartirish |
| OOV | *out-of-vocabulary* | Lug'atda yo'q so'z |
| Kosinus o'xshashligi | *cosine similarity* | Ikki vektor yaqinligi |

---

⬅️ [Oldingi: Transformer arxitekturasi](04-The-Transformer-Architecture.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Ko'p boshli e'tibor](06-Multi-Headed-Attention.md)
