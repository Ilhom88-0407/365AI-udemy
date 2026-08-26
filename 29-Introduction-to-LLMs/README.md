# 🤖 29-modul. Katta til modellariga kirish

> **Introduction to Large Language Models** — LLM nima, qanchalik katta, nima qila oladi.
>
> ## 🆕 **YANGI BO'LIM BOSHLANDI.** 20–28-modullar NLP asoslari edi. Endi **LLM'lar** dunyosiga kiramiz.

**O'qituvchi:** Lauren Newbold *(BBC, NLP mutaxassisi)* — LLM bo'limining muallifi.

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [Kursga kirish](01-Introduction-to-the-Course.md) | Yo'l xaritasi, 6 bo'lim |
| 2 | [Kurs materiallari](02-Course-Materials.md) | GitHub, o'rnatish, ⚠️ API kaliti xavfsizligi |
| 3 | [LLM nima?](03-What-are-LLMs.md) | Uchta asosiy xususiyat |
| 4 | [LLM qanchalik katta?](04-How-Large-is-an-LLM.md) ⭐⭐ | Parametrlar — **va MUHIM istisno** |
| 5 | [Umumiy maqsadli modellar](05-General-Purpose-Models.md) | Bitta model, ko'p vazifa |
| 6 | [Oldindan o'qitish va sozlash](06-Pre-training-and-Fine-tuning.md) ⭐⭐ | **Zero-shot: 0.976!** |
| 7 | [LLM nima uchun ishlatiladi?](07-What-can-LLMs-be-used-for.md) | 11 ta qo'llanish sohasi |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**40 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**6 ta mini-loyiha**](LOYIHALAR.md) | Model pasporti · taqqoslash paneli · 🇺🇿 o'zbek testi · vosita tanlash · kesish tahlili · baholash to'plami |

---

## ⭐ LLM ning uchta asosiy xususiyati

![Uchta xususiyat](assets/01-three-features.svg)

---

## 🔥 Bu modulning IKKI ASOSIY TOPILMASI

Kurs nazariy. Biz **hamma da'voni o'lchadik** — va ikkita **teskari** natija topdik.

### ① ✅ INGLIZ TILIDA — LLM AJOYIB

**83 ta kitob sharhi** *(26-modul ma'lumoti)*:

```
26-modul SVM   (o'qitilgan, yorliqli ma'lumot bilan)   0.869
distilbert     ZERO-SHOT (hech narsa qilinmagan!)      0.976   🏆
bazaviy                                                0.554

                    +10.7 punkt   ·   0 ta yorliq   ·   3 qator kod
```

> ## 🎯 **Model KINO sharhlarida o'qitilgan, KITOB sharhlarini ko'rmagan — baribir 97.6%.**

### ② 📉 O'ZBEK TILIDA — LLM YUTQAZADI

**16 ta o'zbek jumlasi**:

```
model                    parametr        aniqlik
──────────────────────────────────────────────────
sklearn (28-modul)          kichik        0.625     🏆
distilbert INGLIZ       66,955,010        0.562
bert KO'P TILLI        167,356,416        0.500     📉 bazaviy daraja
```

> ## ❌ **Eng KATTA model eng YOMON natija berdi.**
>
> ```
> "Juda ZERIKARLI va SIFATSIZ kitob"  →  5 YULDUZ    😱
> "Menga judayam YOQDI"               →  1 yulduz    😱
> ```

### 🔑 XULOSA

```
BIR XIL MODEL  ·  BIR XIL VAZIFA  ·  TESKARI NATIJA

              ingliz  →  0.976   ✅
              o'zbek  →  0.500   ❌

        Yagona farq — TIL
```

> ## 💡 **Kurs aytadi:** *"Model qancha ko'p parametrga ega bo'lsa, u tilni shuncha yaxshi tushunadi."*
>
> ## ✅ **To'g'rilangan versiya:** *"...MODEL O'QITILGAN til va vazifada."*

---

## ⚠️ "Ko'p tilli" ≠ "sizning tilingiz"

```
nlptown/bert-base-multilingual-uncased-sentiment

  ASOSI (mBERT)  →  104 til   (o'zbek BOR)
  SOZLANGANI     →    6 til   (o'zbek YO'Q)
                       ↑
     ingliz · golland · nemis · fransuz · italyan · ispan
```

> ## 🔑 **Model o'zbek SO'ZLARINI ko'radi, lekin ularning SENTIMENTINI hech qachon o'rganmagan.**

---

## 🚀 Tez boshlash

```bash
pip install transformers torch
```

```python
from transformers import pipeline

p = pipeline("sentiment-analysis")
print(p.model.name_or_path)
print(f"{sum(x.numel() for x in p.model.parameters()):,} parametr")
print(p("I love this book"))
```

```
distilbert/distilbert-base-uncased-finetuned-sst-2-english
66,955,010 parametr
[{'label': 'POSITIVE', 'score': 0.9998767375946045}]
```

> ## 💡 **67 million parametr — 3 qator kodda.** Va siz buni **23-modulda allaqachon** ishlatgansiz — faqat u paytda **nima ekanini** bilmagansiz.

---

## 🧭 Qaror daraxti — qaysi vositani tanlash?

```
Vazifangiz INGLIZ tilidami?
│
├── ✅ HA  →  AVVAL zero-shot ni sinang (10 daqiqa!)
│            ├── Yetarlimi?   →  ✅ TAYYOR
│            └── Yetarli emas →  fine-tuning (34-modul)
│
└── ❌ YO'Q (o'zbek va h.k.)
             ├── Yorliqli ma'lumot bormi?
             │    ├── ✅ HA  →  o'z sklearn modelingiz (26, 28-modul)
             │    └── ❌ YO'Q →  LLM so'rovi + QO'LDA tekshirish
             └── ⚠️ Tayyor transformerga ISHONMANG — avval O'LCHANG
```

**Qo'shimcha mezonlar:**

| Vaziyat | Tanlov |
|---|---|
| 1M+ hujjat, past byudjet | ## **`sklearn`** *(10 sek, $0)* |
| Qarorni tushuntirish kerak | ## **`sklearn` `coef_`** |
| Ko'p turli vazifa | **LLM** |

---

## ⚠️ Uchta amaliy tuzoq

| № | Tuzoq | Yechim |
|---|---|---|
| 1 | **Yuqori ball = to'g'ri javob deb o'ylash** | O'zbekcha *"juda ajoyib"* → `NEGATIVE` **0.956** ball bilan! Ball — *"ishonchim komil"*, *"men haqman"* **emas** |
| 2 | **Bazaviy bilan solishtirmaslik** | **0.500** — *"kuchsizroq"* emas, **umuman ishlamaydi** |
| 3 | **`model_max_length` ga ishonish** | RoBERTa'da u **o'rnatilmagan** *(1e30 qaytaradi)* — haqiqiy chegara **512** |

---

## ✅ O'zingizni tekshiring

- [ ] LLM ning uchta asosiy xususiyati?
- [ ] Hajm nima bilan o'lchanadi?
- [ ] BERT va GPT-4 nechta parametrga ega?
- [ ] Oldindan o'qitishda nima uchun **yorliq kerak emas**?
- [ ] Zero-shot nima va u qachon ishlaydi?
- [ ] "Ko'proq parametr = yaxshiroq" qachon **ishlamaydi**?
- [ ] O'zbekcha matnda tayyor modelni sinab ko'rdingizmi?
- [ ] Modelning parametrini sanay olasizmi?

---

## 🔗 20–28-modullar bilan bog'liqlik

```
21-modul  Tozalash      →  LLM ham tozalaydi (milliardlab hujjat)
22-modul  POS/NER       →  LLM buni O'ZI o'rganadi
23-modul  Sentiment     →  ⭐ SIZ TRANSFORMER ISHLATGANSIZ (67M parametr)
24-modul  TF-IDF        →  LLM'da bu "embedding"
25-modul  Mavzular      →  LLM kontekstdan tushunadi
26-modul  Tasniflagich  →  zero-shot uni YENGDI (ingliz), YUTQAZDI (o'zbek)
27-modul  Shipcha       →  ⚠️ LLM'da HAM kerak — hatto KO'PROQ
28-modul  🇺🇿 O'zbek NLP  →  ⭐ LLM YUTQAZGANDA — SIZDA YECHIM BOR
```

> ## 🔑 **Siz noldan boshlamayapsiz.** 20–28-modullar — LLM'ning **fundamenti** va **nazorat mexanizmi**.

---

## ➡️ Keyingi qadam

**[30-modul — Transformer arxitekturasi](../30-Transformer-Architecture/README.md)**: bu modulda faqat **nomini eshitgan** transformerni endi **ichidan** ko'ramiz. Nima uchun `"The food was not good"` ni to'g'ri tushunadi, `CountVectorizer` esa yo'q — javob **shu yerda**.

---

⬅️ [28-modul — NLP kelajagi](../28-Future-of-NLP/README.md) · 🏠 [Bosh sahifa](../README.md) · ➡️ [30-modul](../30-Transformer-Architecture/README.md)
