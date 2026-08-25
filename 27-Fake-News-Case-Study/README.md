# 📰 27-modul. Soxta yangiliklarni aniqlash (keys)

> **Categorizing Fake News** — **21–26-modullarning HAMMASI** bitta haqiqiy loyihada.
> Bu — sizning **portfolio loyihangiz**.

---

## 🎬 Vaziyat

```
📱 Ijtimoiy tarmoq kompaniyasi
   Muammo: platformada SOXTA YANGILIKLAR ko'paymoqda
   Siz — ma'lumot olimi

   ① Soxta yangilikni QANDAY tanib olish mumkin?
   ② Uni ANIQLASH USULINI yarating
```

📁 **Ma'lumot:** [`data/fake_news_data.csv`](data/fake_news_data.csv) — **198 ta** maqola *(98 soxta, 100 haqiqiy)*.

---

## 🗺️ Yo'l xaritasi

![Loyiha yo'l xaritasi](assets/01-project-roadmap.svg)

---

## 📚 Darslar

| # | Dars | Modul |
|---|---|---|
| 1 | [Loyihani tanishtirish](01-Introducing-the-Project.md) | — |
| 2 | [POS teglar bilan o'rganish](02-Exploring-with-POS-Tags.md) | 22 |
| 3 | [Nomlangan ob'ektlar](03-Extracting-Named-Entities.md) ⭐ | 22 |
| 4 | [Matnni qayta ishlash](04-Processing-the-Text.md) ⭐ | 21 |
| 5 | [Sentiment farq qiladimi?](05-Sentiment-by-News-Type.md) | 23 |
| 6 | [Mavzular — LDA](06-Topics-LDA.md) | 24, 25 |
| 7 | [Mavzular — LSA](07-Topics-LSA.md) ⭐ | 25 |
| 8 | [Tasniflagich](08-Fake-News-Classifier.md) ⭐⭐ | 26 |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**36 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**6 ta mini-loyiha**](LOYIHALAR.md) | To'liq quvur · Belgilar paneli · Shipcha detektori · Manba tahlili · Model taqqoslash · Hisobot |

---

## 🏆 To'rtta savol — to'rtta javob

```
❓ 1 · Soxta va haqiqiy yangiliklar TILDA farq qiladimi?
   ✅ HA
      · NER: top-10 ob'ektning 6/10 vs 1/10 tasi ODAM
      · RAVISHLAR 32.3% ko'proq (hissiyotli til)
      · SONLAR 9.2% kamroq (kam tekshiriladigan fakt)
      · Otlar: people/women/media  vs  government/bill/court

❓ 2 · SENTIMENT farq qiladimi?
   ❌ YO'Q — p = 0.83
      Haqiqiy 0.0501  ·  Soxta 0.0247  (og'ish 0.79!)

❓ 3 · Soxta yangiliklarda qanday MAVZULAR bor?
   ✅ 6 ta aniq mavzu (LSA + TF-IDF bilan)
      📻 "Boiler Room" podkasti · 📧 Klinton pochtasi
      🕵️ Flynn ishi · ⛪ din/abort · 🎙️ matbuot · 🏫 maktab

🎯 4 · MODEL qura olamizmi?
   ✅ HA — 90.4% aniqlik (SVM, cross-validation)
```

---

## 🔍 Nomlangan ob'ektlar — asosiy topilma

![NER solishtirish](assets/02-ner-comparison.svg)

---

## ⚠️⚠️ Bu modulning ENG MUHIM sabog'i — SHIPCHA

Ma'lumotni **ko'z bilan tekshirganda** topdik:

```
"WASHINGTON (Reuters) - Former FBI Director James Comey..."
        ↑
   Haqiqiy yangiliklarda AGENTLIK PREFIKSI bor
```

**O'lchadik:**

```python
Fake News:     1/98  = 1%     maqolada "Reuters" bor
Factual News: 100/100 = 100%  maqolada "Reuters" bor
```

**Bitta qatorlik qoida:**

```python
if "Reuters" in matn:  return "Factual News"
else:                  return "Fake News"
```

```
Aniqlik: 99.5%   💥
```

> ## ❌ **Bu — mashinali o'qitish EMAS.** Bu — ma'lumot to'plamidagi **nuqsonni** topish.
>
> **Haqiqiy hayotda:** AP, BBC yoki Kun.uz dan kelgan haqiqiy yangilikda `Reuters` **yo'q** → model **"soxta"** deydi. ❌

### ✅ Tozalash natijasi

```
Regex:  re.sub(r"^[^-]*-\s*", "", text)

"Reuters" bor haqiqiy maqolalar:  100 → 12   (88% kamaydi)

Model aniqligi:
  Tozalashsiz  90.4%   ← shipchadan foydalanadi
  Tozalangan   88.9%   ← HAQIQIY tildan o'rganadi
                 ↓
  1.5 foizni "sotib", ISHONCHLILIKNI oldik ✅
```

---

## ⚠️ Modulning 7 ta SABOG'I

| № | Saboq | Qayerda |
|---|---|---|
| 1 | **Ma'lumotni KO'Z BILAN tekshiring** | Reuters shipchasi shundan topildi | 
| 2 | **NER va POS — tozalashdan OLDIN** | 2–3 darslar |
| 3 | **Sentiment — XOM matnda** *(`not` kerak!)* | 5-dars |
| 4 | **"Natija yo'q" ham natija** | Sentiment: p = 0.83 |
| 5 | **TF-IDF mavzularni yaxshilaydi** | LDA → LSA |
| 6 | **Bitta bo'linishga ishonmang** | LR/SVM xulosasi **teskari** aylandi |
| 7 | **Yuqori aniqlik ≠ yaxshi model** | Shipcha 99.5% berardi |

---

## 💥 Eng katta ogohlantirish

```
Bitta bo'linish:        Cross-validation:
  LR   88.3%  🏆          LR   88.9%
  SVM  81.7%              SVM  90.4%  🏆
                              ↑
                    XULOSA TESKARI AYLANDI!
```

> ## 🔑 **O'qituvchi "LR yaxshiroq" degan edi — bu bitta bo'linishga asoslangan.** Cross-validation **SVM yaxshiroq** ekanini ko'rsatadi.

---

## 🔧 O'rnatish

```bash
pip install pandas numpy matplotlib seaborn scikit-learn nltk spacy vaderSentiment scipy
python -m spacy download en_core_web_sm
```

> 💡 **Kurs `gensim` ishlatadi**, lekin u Python 3.13+ da o'rnatilmaydi. Bu darslikda **`scikit-learn`** ekvivalentlari — barcha raqamlar **ishga tushirilib tekshirilgan**.

---

## ✅ O'zingizni tekshiring

- [ ] `Reuters` muammosi nima va nima uchun xavfli?
- [ ] Nima uchun NER tozalashdan oldin?
- [ ] Nima uchun sentiment `text` da, `text_clean` da emas?
- [ ] Soxta yangiliklar qanday til ishlatadi?
- [ ] Sentiment farq qildimi?
- [ ] Nima uchun LSA mavzulari LDA'nikidan yaxshi?
- [ ] Qaysi model g'olib — va nima uchun bu savol qiyin?
- [ ] Tozalash aniqlikni pasaytirdi — bu yaxshimi?

---

## ➡️ Keyingi qadam

**28-modul — NLP kelajagi**: NLP bo'limining yakuniy darsi. Keyin **29-moduldan** boshlab **katta til modellari** *(LLM)* va **transformerlar** dunyosiga kiramiz.

---

⬅️ [26-modul — O'z matn tasniflagichingiz](../26-Text-Classifier/README.md) · 🏠 [Bosh sahifa](../README.md)
