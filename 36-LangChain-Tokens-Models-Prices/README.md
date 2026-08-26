# 💰 36-modul. Tokenlar, modellar va narxlar

> **LLM narxi token bilan o'lchanadi.** Bu modulda tokenlar **nima ekanini** ko'ramiz va — kursda **yo'q** — o'zbekcha matn **necha baravar qimmat** ekanini **o'lchaymiz**.

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [Tokenlar](01-Tokens.md) ⭐⭐ | BPE, token ID, ## 🇺🇿 **o'zbekcha ustama** |
| 2 | [Modellar va narxlar](02-Models-and-Prices.md) ⭐⭐ | Narx, kontekst oynasi, ## **model tanlash** |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**30 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**4 ta mini-loyiha**](LOYIHALAR.md) | Token profileri · byudjet rejalashtiruvchi · 🇺🇿 **ustama tahlilchisi** · ⭐ **narx nazorati** |

> ## ⭐ **HAMMASI API KALITISIZ ISHLAYDI** — `tiktoken` **mahalliy** paket.

---

## 🔬 Token nima? — kursning misolini TASDIQLADIK

![Tokenlar](assets/01-tokenlar.svg)

```python
enc = tiktoken.get_encoding("cl100k_base")
for s in ["What would you like to have for dinner?",
          "I don't mind what we have for dinner.",
          "Have you listened to What a Wonderful World by Louis Armstrong?"]:
    ...
```

```
'What'   → ID 3923    bo'shliq YO'Q + katta harf  →  JUMLA BOSHI
' what'  → ID 1148    bo'shliq BOR + kichik harf  →  ODDIY SO'Z
' What'  → ID 3639    bo'shliq BOR + katta harf   →  NOM / SARLAVHA
'?'      → ID   30    past ID = TEZ-TEZ uchraydi
```

> ## ✅ **KURSNING DA'VOSI TO'LIQ TASDIQLANDI.**
>
> ## 🔑 **BO'SHLIQ TOKEN ICHIDA** — bu BPE ning BERT/XLNet dan **asosiy farqi**:
> ```
> BERT (33-modul)   →  ['what']       bo'shliq alohida
> XLNet (34-modul)  →  ['▁what']      ▁ = so'z boshi
> GPT               →  [' what']      ⭐ bo'shliq TOKENNING QISMI
> ```
> ## 💡 **AMALIY:** promptda **ortiqcha bo'shliq** qo'ymang — `"salom"` va `" salom"` **turli tokenlar**.

---

## 💥💥 Modulning eng muhim topilmasi — O'ZBEKCHA USTAMA

![O'zbekcha narx](assets/02-uzbek-narx.svg)

Kursda **yo'q**, lekin o'zbek dasturchisi uchun **eng amaliy raqam**. Beshta ingliz–o'zbek juftligini o'lchadik:

```
 cl100k_en  cl100k_uz  nisbat_cl  o200k_en  o200k_uz  nisbat_o200
         9         20       2.22         9        17         1.89
        11         13       1.18        10        11         1.10
         9         20       2.22         9        17         1.89
         9         20       2.22         8        17         2.12
        14         22       1.57        13        17         1.31

O'RTACHA  cl100k: 1.88×   o200k: 1.66×
```

| | `cl100k_base` *(gpt-4)* | `o200k_base` *(gpt-4o)* |
|---|---:|---:|
| Lug'at | 100,277 | ## **200,019** |
| 🇺🇿 Ustama | ## **1.88×** *(+88%)* | ## **1.66×** *(+66%)* ⭐ |
| `Toshkentda` | 5 token | ## **4 token** |

> ## 🏆 **XULOSA: O'ZBEKCHA LOYIHADA `gpt-4o` OILASINI TANLANG** — sifatliroq **va** tokenda **12% arzonroq**.

### 🔬 Nima uchun? — uchta sabab, o'lchandi

```
① APOSTROF ALOHIDA TOKEN
   "sun'iy"  →  ['sun', "'", 'iy']         3 token, 1 tasi apostrof

② AGGLUTINATSIYA
   "Toshkentda"  →  ['T','osh','k','ent','da']
   qo'shimchalar so'zni NOYOB qiladi — lug'atda topilmaydi

③ LUG'ATDA O'ZBEKCHA DEYARLI YO'Q
   faqat "hisobot" 2 tokenga bo'lindi ('his'+'obot' boshqa tillarda ham bor)
```

> ## ⭐ **VA `o200k` NIMA UCHUN YAXSHIROQ:**
> ```
> cl100k:  ['T','osh','k','ent','da']    5 token
> o200k:   ['T','osh','kent','da']       4 token    ← 'kent' BUTUN!
> ```
> `o200k` lug'ati **ikki baravar katta** va unda **ko'p tilli** bo'laklar ko'proq.

> ## ⚠️⚠️ **USTAMANI "TUZATISHGA" URINMANG:**
> ```
> ❌ apostrofni o'chirish  →  imlo buziladi, sifat tushadi
> ❌ inglizchada yozish    →  foydalanuvchi tushunmaydi
>
> ✅ gpt-4o oilasini tanlang       →  12% BEPUL tejash
> ✅ sistem promptni qisqartiring  →  u HAR chaqiruvda ketadi
> ✅ max_tokens ni belgilang       →  chiqish 4× qimmat
> ```
> ## 🔑 **O'zbek tili qimmat — bu FAKT, muammo emas.** Uni **hisobga oling**.

---

## 📏 "100 token ≈ 75 so'z" — o'lchadik

```
so'zlar 72   tokenlar 80   so'z/token = 0.900
100 token ≈ 90.0 so'z     (kurs: 75)
```

> ## 💡 **KURS EHTIYOTKORLIK QILGAN — VA BU YAXSHI.** Narx hisoblashda **ko'p** baholash **xavfsizroq**.

| Matn turi | 100 token ≈ |
|---|---:|
| Inglizcha ilmiy | ## **90 so'z** |
| Inglizcha oddiy | ~75 so'z |
| Kod | ~40 so'z |
| URL, emoji | ~20 so'z |
| ## 🇺🇿 **O'zbekcha** | ## **48 so'z** |

---

## 💰 Narxlar — kurs davri va bugun

```
KURS AYTGAN (2024)  →  gpt-4o:  $5 / $15
BUGUN               →  gpt-4o:  $2.50 / $10.00      (2× arzon)
                    →  gpt-4o-mini:  $0.15 / $0.60  ⭐ 17× ARZON
```

| Model | Kirish 1M | Chiqish 1M | 1000 so'rov 🇺🇿 | Nisbiy |
|---|---:|---:|---:|---:|
| ## `gpt-4o-mini` | ## **$0.15** | ## **$0.60** | ## **$0.37** | ## **1×** |
| `gpt-4o` | $2.50 | $10.00 | $6.12 | 17× |
| `gpt-4-turbo` | $10.00 | $30.00 | $20.70 | ## **56×** |
| `text-embedding-3-small` | $0.02 | — | — | ## **0.13×** |

> ## 💥 **KURS `gpt-4` NI TAVSIYA QILADI — BUGUN BU NOTO'G'RI:**
> ```
> gpt-4         →  oyna 8k (KICHIK) · sekin · qimmat · cl100k (o'zbekcha yomon)
> gpt-4o-mini   →  oyna 128k · tez · 56× arzon · o200k (o'zbekcha yaxshi)  ⭐
> ```

> ## 🔑 **CHIQISH 3–4× QIMMAT — VA BU LOYIHA QARORLARIGA TA'SIR QILADI:**
> ```
> ✅ ARZON  →  uzun hujjat + QISQA javob    (RAG naqshi!)
> ❌ QIMMAT →  qisqa prompt + UZUN matn     (generatsiya)
> ```
> **`max_tokens` ni DOIM belgilang.**

---

## 🪟 Kontekst oynasi — o'zbekchada YARIM

```
gpt-4o         128,000 token ≈  115,200 inglizcha so'z ≈   61,211 o'zbekcha so'z
gpt-4o-mini    128,000 token ≈  115,200 inglizcha so'z ≈   61,211 o'zbekcha so'z
gpt-4            8,192 token ≈    7,373 inglizcha so'z ≈    3,918 o'zbekcha so'z
```

> ## 💥 **BU FAQAT NARX MASALASI EMAS — IMKONIYAT MASALASI.** O'zbekcha hujjat **ikki baravar tezroq** oynaga **sig'may qoladi**.
>
> ## ✅ **SHUNING UCHUN RAG SHART** *(42-modul)*: butun hujjat o'rniga — **eng mos bo'laklar**.

---

## 🎯 Model tanlashning OLTITA mezoni

| # | Mezon | Kurs | Biz |
|---|---|---|---|
| ① | Narx | ✅ | ✅ |
| ② | Cut-off sana | ✅ | ✅ |
| ③ | Kontekst oynasi | ✅ | ✅ |
| ④ | ## **Tezlik** *(latency)* | ❌ | ## ✅ **chatbot uchun MUHIM** |
| ⑤ | ## 🇺🇿 **Til qo'llab-quvvatlashi** | ❌ | ## ✅ **o'lchandi** |
| ⑥ | ## **Ma'lumot qayerga boradi** | ❌ | ## ✅ **hal qiluvchi** |

> ## 🇺🇿 **⑥ — O'ZBEKISTON UCHUN ENG MUHIMI.** OpenAI API'da ma'lumot **AQSh serverlariga** chiqadi. Bank/tibbiy loyihada bu ko'pincha **qonuniy muammo** *(35-modul, 2-dars)*.

---

## 🎓 Modulni tugatgach

```
✅ Token nima va nima uchun so'z EMASLIGINI bilasiz
✅ tiktoken bilan HAR QANDAY matnni o'lchay olasiz
✅ 🇺🇿 O'zbekcha loyihaning HAQIQIY narxini hisoblaysiz
✅ gpt-4o oilasi nima uchun o'zbekcha uchun afzalligini bilasiz
✅ Kontekst oynasiga nima sig'ishini oldindan aytasiz
✅ Model tanlashning OLTITA mezonini qo'llaysiz
✅ Narx nazorati qatlamini qurasiz — kutilmagan hisob KELMAYDI
```

---

## 🔗 Bog'liq modullar

| Modul | Aloqasi |
|---|---|
| [28-modul](../28-Future-of-NLP/README.md) | O'zbekcha **agglutinatsiya** va **apostrof** muammosi |
| [30-modul](../30-Transformer-Architecture/README.md) | E'tibor `O(n²)` — nima uchun token soni **muhim** |
| [33-modul](../33-BERT-Question-Answering/README.md) | WordPiece `##` — boshqa tokenizatsiya usuli |
| [34-modul](../34-Text-Classification-XLNet/README.md) | SentencePiece `▁` · `max_length` tanlash |
| [35-modul](../35-LangChain-Introduction/README.md) | Xotira narxi `O(n²)` · Ollama muqobili |
| [42-modul](../42-LangChain-RAG/README.md) | ➡️ RAG — kontekst oynasi cheklovini **aylanib o'tish** |

---

⬅️ [35-modul. LangChain'ga kirish](../35-LangChain-Introduction/README.md) · 🏠 [Bosh sahifa](../README.md) · ➡️ [37-modul. Muhitni sozlash](../37-LangChain-Setting-Up-Environment/README.md)
