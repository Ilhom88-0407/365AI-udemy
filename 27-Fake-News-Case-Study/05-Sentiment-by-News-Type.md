# 5-dars. Sentiment yangilik turiga qarab farq qiladimi?

## 🎬 Boshlashdan oldin

> **"Bu darsda biz shu savolga javob berishga harakat qilamiz: SENTIMENT TURLI YANGILIK TURLARI ORASIDA FARQ QILADIMI?"**
>
> **"Masalan, haqiqiy yangiliklar soxta yangiliklar ma'lumot to'plamiga nisbatan KO'PROQ IJOBIY yoki KO'PROQ SALBIY sentimentga egami?"**

---

## 1. VADER'ni ishga tushiramiz

> **"Biz sentiment tahlilimizni olish uchun VADER sentiment hisoblashidan foydalanamiz."**

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

vader_sentiment = SentimentIntensityAnalyzer()

data["vader_sentiment_score"] = data["text"].apply(
    lambda x: vader_sentiment.polarity_scores(x)["compound"])
```

### ⚠️ Diqqat — `text`, `text_clean` EMAS!

> **"Biz buni hisoblash uchun XOM MA'LUMOTDAN foydalanamiz."**

```
❌ text_clean  →  to'xtatish so'zlari o'chirilgan → "not" YO'Q!
✅ text        →  hamma narsa joyida
```

> ## 💡 **23-modulning asosiy qoidasi.** Sentiment uchun **inkor** kerak. `text_clean` da `not`, `no`, `never` **o'chirilgan** — u yerda sentiment o'lchash **noto'g'ri** bo'lardi.

---

## 2. Yorliqqa aylantiramiz

> **"Biz buni ijobiy, salbiy va neytral sentimentga tasniflashni xohlaymiz."**

```python
bins = [-1, -0.1, 0.1, 1]
names = ["negative", "neutral", "positive"]

data["vader_sentiment_label"] = pd.cut(
    data["vader_sentiment_score"], bins=bins, labels=names)
```

---

## 3. Umumiy taqsimot

```python
print(data["vader_sentiment_label"].value_counts())
```

```
positive    98
negative    93
neutral      7
```

```
positive  ████████████████████████████████████████████████  98
negative  ██████████████████████████████████████████████    93
neutral   ███                                                7
```

> **"Bu diagrammaga qarab, umuman olganda bizda salbiy sentimentga qaraganda IJOBIY sentimentli maqolalar BIROZ KO'PROQ ekanini ko'rishingiz mumkin. Va u yerda bir nechta neytral bor."**

> ⚠️ **Neytral atigi 7 ta** — chunki maqolalar **uzun** *(~400 so'z)*. Uzun matnda **doim** biror hissiy so'z bo'ladi.

---

## 4. ⭐ Asosiy savol — turlar bo'yicha

> **"Endi bu bizdagi ikki xil yangilik maqolalari orasida qanday farq qilishini ko'raylik."**

```python
print(pd.crosstab(data["fake_or_factual"], data["vader_sentiment_label"]))
```

```
vader_label      negative  neutral  positive
fake_or_factual
Factual News           47        2        51
Fake News              46        5        47
```

### 📊 Foizda

```
                 negative   neutral   positive
Factual News       47.0%      2.0%      51.0%
Fake News          46.9%      5.1%      48.0%
                     ↑                     ↑
              deyarli AYNAN BIR XIL!
```

```python
print(data.groupby("fake_or_factual")["vader_sentiment_score"]
          .agg(["mean", "std"]).round(4))
```

```
                   mean     std
fake_or_factual
Factual News     0.0501  0.7941
Fake News        0.0247  0.8440
```

---

## 5. ❌ JAVOB: SENTIMENT FARQ QILMAYDI

> ## **"Soxta yangiliklarga qaraganimizda, ijobiy va salbiy sentiment orasida ANCHA TENG BO'LINISH borligini ko'ramiz... Haqiqiy yangiliklar ma'lumot to'plamimizda ijobiy KO'PROQ og'ishayotganini ko'rasiz."**
>
> ## **"Demak, farqlar KESKIN EMAS. Shuning uchun men hozircha haqiqiy yangiliklar ko'proq ijobiyga og'adi, soxta yangiliklar esa biroz tekisroq taqsimlangan DEB AYTA OLMAYMAN deb o'ylayman."**

### 🔑 Raqamlar bilan tasdiqlaymiz

```
O'rtacha ball:
  Haqiqiy   0.0501
  Soxta     0.0247
  FARQ      0.0254

Standart og'ish:
  Haqiqiy   0.7941
  Soxta     0.8440

FARQ (0.025)  <<  OG'ISH (0.79–0.84)
       ↑
   Farq SHOVQIN ichida ko'milgan!
```

### 📐 Statistik test ham tasdiqlaydi

```python
from scipy import stats
a = data[data["fake_or_factual"] == "Fake News"]["vader_sentiment_score"]
b = data[data["fake_or_factual"] == "Factual News"]["vader_sentiment_score"]
print(stats.ttest_ind(a, b))
```

```
t = -0.2187,  p = 0.8271
```

> ## 💥 **p = 0.83** *(chegara: p < 0.05)*. Bu — farq **umuman yo'q** degan **eng kuchli** isbot.

> ## ❌ **Bu — "NATIJA YO'Q" natijasi.** Va bu **mutlaqo normal**.

### 💡 Nima uchun bu ham QIMMATLI?

```
❌ NOTO'G'RI xulosa:
   "Tajriba muvaffaqiyatsiz bo'ldi, bu haqda gapirmaymiz"

✅ TO'G'RI xulosa:
   "Sentiment soxta yangilikni ANIQLASH uchun YARAMAYDI.
    Boshqa signallarga e'tibor qarating."

   → Bu manfaatdor tomonlarga VAQT va PUL tejaydi!
```

> ## 🔑 **Ilmiy halollik:** *"biz sinadik, ishlamadi"* — bu **to'liq javob**. Ma'lumot olimining ishi — **haqiqatni** topish, **kutilgan javobni** emas.

### Solishtiring — NIMA ishladi?

| Signal | Farq | Dars |
|---|---|---|
| **NER** *(PERSON ulushi)* | ## 6/10 vs 1/10 ✅ | 3 |
| **ADV nisbati** | +32.3% ✅ | 2 |
| **Otlar** *(`people` vs `government`)* | ✅ | 2 |
| **Sentiment** | ## 0.05 vs 0.02 ❌ | **5** |

---

## 6. Grafik

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.countplot(x="fake_or_factual", hue="vader_sentiment_label",
              data=data, palette=sns.color_palette("hls"))
plt.title("Sentiment — yangilik turi bo'yicha")
plt.savefig("sentiment_by_type.png", dpi=100, bbox_inches="tight")
```

> **"Sarlavhani ham o'rnatmoqchimiz. Shuning uchun buni 'yangilik turi bo'yicha sentiment' deb ataymiz."**

---

## 7. 💡 Keyingi qadam — o'qituvchidan

> ## **"Bu biroz CHUQURROQ TAHLILNI talab qiladi. Biz shuningdek sentimentni aniqlash uchun ishlatgan USULIMIZNI O'ZGARTIRISHGA harakat qilishimiz mumkin — turli qoidaga asoslangan modellar bilan tajriba qilishimiz yoki endi ishlatishda o'zimizni bemalol his qiladigan OLDINDAN O'QITILGAN TRANSFORMERLARNI joriy qilishimiz mumkin."**

```python
# Transformer bilan sinash (23-modulni eslang)
from transformers import pipeline
tf = pipeline("sentiment-analysis")
data["tf_label"] = [tf(t[:512])[0]["label"] for t in data["text"]]
print(pd.crosstab(data["fake_or_factual"], data["tf_label"]))
```

> ⚠️ **Lekin ehtiyot bo'ling:** transformerda **neytral yo'q** *(23-modul)*, va u atigi **512 token** ko'radi — bizning maqolalar **~400 so'z**, ya'ni ko'p qismi **kesiladi**.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Umumiy sentiment taqsimotini chiqaring.

**M2.** Crosstab yarating.

**M3.** O'rtacha ballarni solishtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(data["vader_sentiment_label"].value_counts())
# positive 98 · negative 93 · neutral 7

# M2
print(pd.crosstab(data["fake_or_factual"], data["vader_sentiment_label"]))
# Factual News   47  2  51
# Fake News      46  5  47

# M3
print(data.groupby("fake_or_factual")["vader_sentiment_score"]
          .agg(["mean", "std", "min", "max"]).round(4))
```

</details>

### 🟡 O'rta

**M4.** ⭐ Farq **statistik ahamiyatli**mi?

**M5.** Foizda crosstab yarating.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — ⭐ T-TEST
from scipy import stats
a = data[data["fake_or_factual"] == "Fake News"]["vader_sentiment_score"]
b = data[data["fake_or_factual"] == "Factual News"]["vader_sentiment_score"]
t_stat, p = stats.ttest_ind(a, b)
print(f"t = {t_stat:.4f},  p = {p:.4f}")
print("Ahamiyatlimi?", "HA ✅" if p < 0.05 else "YO'Q ❌")
# t = -0.2187,  p = 0.8271
# Ahamiyatlimi? YO'Q ❌
#
# 💥 p = 0.83!  (chegara: p < 0.05)
#
# 🔑 Bu — "farq YO'Q" ning ENG KUCHLI isboti.
#    p = 0.83 degani: agar ikkala guruh AYNAN BIR XIL bo'lsa ham,
#    biz ko'rgan kichik farqni 83% ehtimol bilan ko'rardik.
#
# ❌ Ya'ni "sentiment farq qiladi" deb AYTA OLMAYMIZ.
#    Bu — TAXMIN emas, MATEMATIK XULOSA.
#
# 💡 scipy o'rnatilmagan bo'lsa:  pip install scipy

# M5
ct = pd.crosstab(data["fake_or_factual"], data["vader_sentiment_label"],
                 normalize="index") * 100
print(ct.round(1))
#                  negative  neutral  positive
# Factual News         47.0      2.0      51.0
# Fake News            46.9      5.1      48.0
#
# 🔑 FOIZDA solishtiring — sinflar hajmi biroz farq qiladi (98 va 100).
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Nima uchun `text`, `text_clean` emas?
2. Umumiy taqsimot qanday?
3. Soxta va haqiqiy orasida farq bormi?
4. O'rtacha ballar qancha?
5. Nima uchun "natija yo'q" ham qimmatli?
6. Qaysi signallar **ishladi**?

<details>
<summary>✅ Javoblar</summary>

1. Chunki `text_clean` da **to'xtatish so'zlari** o'chirilgan — u yerda **`not`, `no`, `never`** yo'q. Sentiment uchun **inkor** hal qiluvchi *(23-modul)*.
2. `positive` **98** · `negative` **93** · `neutral` **7**.
3. ## **YO'Q.** 47% / 2% / 51% va 46.9% / 5.1% / 48% — deyarli **aynan bir xil**.
4. Haqiqiy **0.0501**, soxta **0.0247**. Farq **0.025**, lekin standart og'ish **0.79–0.84** — farq **shovqin ichida**.
5. Chunki u manfaatdor tomonlarga aytadi: *"sentimentga vaqt sarflamang"*. Bu — **vaqt va pul tejaydi**.
6. **NER** *(PERSON 6/10 vs 1/10)*, **ADV nisbati** *(+32.3%)*, **otlar** *(`people` vs `government`)*.

</details>

---

## 📌 Xulosa

```python
vader_sentiment = SentimentIntensityAnalyzer()
data["vader_sentiment_score"] = data["text"].apply(
    lambda x: vader_sentiment.polarity_scores(x)["compound"])
#                              ↑ XOM matn! (text_clean EMAS)

data["vader_sentiment_label"] = pd.cut(
    data["vader_sentiment_score"],
    bins=[-1, -0.1, 0.1, 1],
    labels=["negative", "neutral", "positive"])


UMUMIY TAQSIMOT
  positive  98  ·  negative  93  ·  neutral  7


⭐ ASOSIY SAVOL — TURLAR BO'YICHA

                 negative  neutral  positive
  Factual News        47        2        51
  Fake News           46        5        47

  Foizda:  47.0/2.0/51.0   va   46.9/5.1/48.0
                     ↑
              DEYARLI AYNAN BIR XIL


  O'rtacha ball:  haqiqiy 0.0501  ·  soxta 0.0247
  Standart og'ish: 0.7941 va 0.8440

  FARQ (0.025)  <<  OG'ISH (0.79)
        ↑
  Farq SHOVQIN ichida ko'milgan


❌ JAVOB: SENTIMENT FARQ QILMAYDI

  Va bu — MUTLAQO NORMAL natija!

  ✅ "Sentiment soxta yangilikni aniqlash uchun YARAMAYDI"
     → manfaatdorlarga VAQT va PUL tejaydi


✅ NIMA ISHLADI?
  NER (PERSON 6/10 vs 1/10)     ← 3-dars
  ADV nisbati (+32.3%)          ← 2-dars
  Otlar (people vs government)  ← 2-dars
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Crosstab | *crosstab* | Ikki ustunni kesishtirish |
| Standart og'ish | *standard deviation* | Tarqoqlik o'lchovi |
| Statistik ahamiyat | *statistical significance* | Farq tasodifmi? |
| t-test | *t-test* | Ikki guruhni solishtirish testi |
| "Natija yo'q" | *null result* | Farq topilmagan natija |

---

⬅️ [Oldingi: Matnni qayta ishlash](04-Processing-the-Text.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Mavzular — LDA](06-Topics-LDA.md)
