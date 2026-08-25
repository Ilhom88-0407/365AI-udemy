# 20-Modul · NLP ga kirish

## 🌍 Bir jumlada

> ## **"NLP — AI ning sohasi bo'lib, u kompyuterlarga inson tilini TUSHUNISH, TALQIN QILISH va YARATISH imkonini beradi."**

Python bo'limi tugadi. Endi Python — **vosita**, maqsad emas. Undan **AI qurish** uchun foydalanasiz.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [Kursga kirish](01-Introduction-to-the-Course.md) | Yo'l xaritasi · portfolio loyihasi |
| 2 | [NLP ga kirish](02-Introduction-to-NLP.md) ⭐ | Ta'rif · tarix · nima uchun qoidalar yetarli emas |
| 3 | [NLP kundalik hayotda](03-NLP-in-Everyday-Life.md) ⭐ | Qidiruv · spam · chatbot |
| 4 | [Nazorat ostida va nazoratsiz](04-Supervised-vs-Unsupervised.md) ⭐ | Yorliq bormi? · qaysi birini tanlash |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **44 ta mashq** — yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — **kutubxonasiz NLP** |

> 📌 Bu modul **nazariy** — kursda rasmiy mashqlar yo'q. Barchasi ushbu darslikka **maxsus** tayyorlangan.

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | NLP nima | 10 |
| B | Kundalik hayotda | 12 |
| C | Nazorat ostida va nazoratsiz | 12 |
| D | Birinchi NLP kodi | 10 |
| **JAMI** | | **44** |

### Mini-loyihalar

| № | Loyiha | NLP vazifasi | Qiyinlik |
|---|---|---|---|
| 1 | Sharhlar tahlilchisi | Sentiment tahlili | 🟢 |
| 2 | Kalit so'zlar | Kalit so'z ajratish | 🟢 |
| 3 | Niyat aniqlagich | Chatbot niyati | 🟡 |
| 4 | Til aniqlagich | Tilni aniqlash | 🟡 |
| 5 | Hujjat o'xshashligi | Jaccard | 🔴 |
| 6 | Mini tasniflagich | Matn tasniflash | 🔴 |
| 🏆 | O'z NLP tizimingiz (7 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**Nazariya:**
- [ ] NLP ning to'liq nomini va **uchta imkoniyatini** bilasiz
- [ ] Qanday **texnikalar** ishlatilishini bilasiz
- [ ] NLP ning **uch davrini** aytasiz
- [ ] Nima uchun **grammatik qoidalar yetarli emas** ekanini tushuntirasiz
- [ ] **Ko'p ma'noli** so'zlarga misol keltirasiz

**Qo'llanishlar:**
- [ ] Qidiruv tizimining **uch bosqichini** bilasiz
- [ ] Spam filtri **qanday ishlashini** bilasiz
- [ ] Chatbot **niyatni** qanday aniqlashini bilasiz
- [ ] Kamida **10 ta** NLP qo'llanishini sanaysiz
- [ ] **Noto'g'ri ijobiy** (*false positive*) nima ekanini bilasiz

**Yondashuvlar:**
- [ ] **Nazorat ostida** va **nazoratsiz** farqini aytasiz
- [ ] Qaysi birini **qachon** tanlashni bilasiz
- [ ] **Yorliqlash** eng qimmat qism ekanini bilasiz
- [ ] Nazoratsizdan nazorat ostidaga **o'tish yo'lini** bilasiz

**Amaliyot:**
- [ ] 📝 **44 ta mashqning** kamida 34 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z NLP tizimingizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-what-is-nlp.svg`](assets/01-what-is-nlp.svg) | 3 imkoniyat + tarix chizig'i + nima uchun qoidalar yetarli emas |
| [`02-supervised-vs-unsupervised.svg`](assets/02-supervised-vs-unsupervised.svg) | Yorliqli va yorliqsiz o'rganish yonma-yon |

---

## 🛠 Kerakli kutubxonalar

```bash
pip install nltk scikit-learn pandas matplotlib
```

> 💡 Bu modulda ular **kerak emas** — barcha loyihalar **sof Python** bilan. Lekin **21-moduldan** boshlab kerak bo'ladi.

---

## ⚠️ Modulning 5 ta eng katta tuzog'i

| № | Tuzoq | Nima uchun xato |
|---|---|---|
| 1 | **Qoidalar yetarli deb o'ylash** | `"yaxshi emas"` → qoida **IJOBIY** deydi |
| 2 | **Kam ma'lumot bilan o'rgatish** | Tasodifiy so'z **belgi** bo'lib qoladi |
| 3 | **Yorliqlash arzon deb o'ylash** | 10 000 sharh = **55 soat** = ~$830 |
| 4 | **Nazoratsizni "yomonroq" deb o'ylash** | U **bepul** va **darrov** ishlaydi |
| 5 | **To'xtatish so'zlarini qoldirish** | `"va"`, `"bu"` natijani **buzadi** |

---

## 🧠 Eng muhim jadval

```
NAZORAT OSTIDA  vs  NAZORATSIZ

┌──────────────┬─────────────────┬──────────────────┐
│              │  NAZORAT OSTIDA │   NAZORATSIZ     │
├──────────────┼─────────────────┼──────────────────┤
│ Yorliq       │  KERAK          │  kerak emas      │
│ Savol        │  "Bu NIMA?"     │  "Qanday naqsh?" │
│ Natija       │  aniq bashorat  │  guruhlar        │
│ Baholash     │  oson           │  qiyin           │
│ Xarajat      │  YUQORI         │  past            │
│ NLP misoli   │  spam filtri    │  mavzu modeli    │
└──────────────┴─────────────────┴──────────────────┘


💡 AMALIY YO'L (ko'p loyiha shunday boshlanadi)

1. NAZORATSIZ    →  10 000 matnni klasterlash  →  5 guruh
2. ODAM          →  guruhlarga NOM berish
3. YORLIQLASH    →  har guruhdan 100 ta (500, 10 000 emas!)
4. NAZORAT OSTIDA→  500 yorliq bilan model o'rgatish

→ 55 soat o'rniga 3 SOAT
```

---

## 🔗 Bog'liqlik

```
03-modul  ─  ML: nazorat ostida / nazoratsiz / klasterlash
05-modul  ─  Transformer · LLM · ChatGPT
17-modul  ─  list · dict · set
18-modul  ─  chastota lug'ati naqshi
    ↓
20-modul  ─  NLP GA KIRISH                     ← siz shu yerdasiz
    ↓
21-modul  ─  Matnni oldindan qayta ishlash  ⭐ ENG FUNDAMENTAL
22-modul  ─  POS tagging + NER
23-modul  ─  Sentiment tahlili
24-modul  ─  Vektorlashtirish
25-modul  ─  Mavzu modellashtirish   (nazoratsiz)
26-modul  ─  O'z tasniflagichingiz   (nazorat ostida)
27-modul  ─  Soxta yangiliklar keys  ⭐ PORTFOLIO
28-modul  ─  NLP kelajagi
```

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| NLP | *natural language processing* | Tabiiy tilni qayta ishlash |
| Qoidaga asoslangan | *rule-based* | Qo'lda yozilgan qoidalar |
| Insayt | *insight* | Ma'lumotdan olingan bilim |
| Kontekst | *context* | So'zning atrofidagi ma'no |
| Ko'p ma'nolilik | *ambiguity* | So'zning bir necha ma'nosi |
| Inkor | *negation* | "emas" — ma'noni o'giradi |
| Kalit so'z | *keyword* | Asosiy so'z |
| Niyat | *intent* | Foydalanuvchi nima xohlaydi |
| Tasniflash | *classification* | Toifalarga ajratish |
| Chatbot | *chatbot* | Suhbat roboti |
| Noto'g'ri ijobiy | *false positive* | Normalni spam deb belgilash |
| Nazorat ostida | *supervised* | Yorliqlar bilan o'rganish |
| Nazoratsiz | *unsupervised* | Yorliqsiz o'rganish |
| Yorliq | *label* | To'g'ri javob |
| Bashorat | *prediction* | Model javobi |
| Klasterlash | *clustering* | Guruhlarga ajratish |
| Yarim nazorat ostida | *semi-supervised* | Qisman yorliqlangan |
| To'xtatish so'zlari | *stop words* | Ma'no bermaydigan so'zlar |
| Jaccard | *Jaccard similarity* | Kesishma / birlashma |
| Tokenizatsiya | *tokenization* | So'zlarga ajratish |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 44 ta mashqdan kamida 34 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z NLP tizimimni yozdim
☐ 5. Nima uchun qoidalar yetarli emasligini tushuntira olaman
☐ 6. Nazorat ostida va nazoratsiz farqini bilaman
☐ 7. Kamida bitta XATO natijani topib, sababini tushuntirdim
```

Hammasi ✅ bo'lsa — **21-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**[21-modul: Matnni oldindan qayta ishlash](../21-Text-Preprocessing/README.md)**

> Ma'ruzachidan: *"Bu — tabiiy tilni qayta ishlashning ENG FUNDAMENTAL jihatlaridan biri."*
>
> Bu modulda **qo'lda** yozgan hamma narsangiz `nltk` bilan **bir qatorda** bo'ladi — lekin siz endi **ichida nima borligini** bilasiz.

---

⬅️ [19-modul](../19-Important-Python-Concepts/README.md) · 🏠 [Bosh sahifa](../README.md) · ➡️ [21-modul](../21-Text-Preprocessing/README.md)
