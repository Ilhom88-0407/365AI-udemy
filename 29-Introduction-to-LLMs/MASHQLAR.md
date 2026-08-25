# 📝 29-modul mashqlari

> **40 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> Bu modul nazariy, lekin mashqlarning **yarmi amaliy** — chunki `transformers` bilan **hoziroq** ishlashni boshlash mumkin.

## ⚙️ Tayyorgarlik

```python
import warnings; warnings.filterwarnings("ignore")
import pandas as pd
import numpy as np
from transformers import pipeline, AutoModel, AutoTokenizer
```

```bash
pip install transformers torch
```

---

# 🟢 OSON *(1–14)*

**M1.** LLM qisqartmasi nimani anglatadi?

**M2.** LLM ni "juda sodda qilib" qanday tushuntirasiz?

**M3.** LLM ning uchta asosiy xususiyati qaysilar?

**M4.** LLM hajmi nima bilan o'lchanadi?

**M5.** BERT va GPT-4 nechta parametrga ega?

**M6.** LLM qanday manbalardan o'qiydi? *(5 ta)*

**M7.** "Umumiy maqsadli" nima degani?

<details>
<summary>✅ Javoblar M1–M7</summary>

**M1.** ## **Large Language Model** — katta til modeli.

**M2.** Kompyuterga **butun internetni** o'qitib, **umumiy bilim** olgan va **siz bilan gaplasha oladigan** mashina.

**M3.** ## ① **KATTA** · ② **UMUMIY MAQSADLI** · ③ **oldindan o'qitilgan + sozlanadigan**

**M4.** ## **PARAMETRLAR SONI** bilan *(jismoniy joy bilan emas)*.

**M5.** BERT — **345 million** *(large)* · GPT-4 — **1.7 trillion**.

**M6.** Kitoblar · veb-saytlar · Wikipedia · ijtimoiy tarmoq · chatlar · retseptlar · film sharhlari · ilmiy maqolalar.

**M7.** Model **bitta narsaga** ixtisoslashgan emas — **ko'p qirrali** til vositasi.

</details>

**M8.** Ikki bosqich qaysilar?

**M9.** Zero-shot va few-shot farqi?

**M10.** Oldindan o'qitishda model nima qiladi?

**M11.** Nima uchun oldindan o'qitishda yorliq kerak emas?

**M12.** LLM ning 6 ta qo'llanishini ayting.

**M13.** Nima uchun "Shveysar armiya pichog'i"?

**M14.** Qaysi uch sohada alohida ehtiyot bo'lish kerak?

<details>
<summary>✅ Javoblar M8–M14</summary>

**M8.** ## ① **Oldindan o'qitish** *(pre-training)* → ② **Sozlash** *(fine-tuning)*.

**M9.** `zero-shot` = **0** ta misol · `few-shot` = **bir necha** misol.

**M10.** ## **Gaplarda KEYINGI SO'ZNI bashorat qiladi.**

**M11.** Chunki **javob matnning o'zida** bor — keyingi so'z allaqachon yozilgan. **Odam mehnati kerak emas** → shuning uchun **butun internetni** ishlatish mumkin.

**M12.** Kontent · tarjima · savol-javob · chatbot · sentiment · xulosalash · tavsiya · kod · tibbiyot · huquq · marketing.

**M13.** **Bitta model** juda ko'p turli vazifani bajara oladi.

**M14.** ## 🏥 **Tibbiyot** · ⚖️ **Huquq** · 📈 **Marketing**.

</details>

---

# 🟡 O'RTA *(15–30)*

### Amaliyot — modelni o'lchash

**M15.** 23-modulda ishlatgan modelingizning **parametrini** sanang.

**M16.** Uchta modelning parametrini solishtiring.

**M17.** ⭐ Nima uchun ko'p tilli model **kattaroq**? Lug'at hajmini o'lchab isbotlang.

<details>
<summary>✅ Javoblar M15–M17</summary>

**M15.**
```python
p = pipeline("sentiment-analysis")
print(p.model.name_or_path)
print(f"{sum(x.numel() for x in p.model.parameters()):,}")
```
```
distilbert/distilbert-base-uncased-finetuned-sst-2-english
66,955,010
```

**M16.**
```python
for m in ["distilbert-base-uncased-finetuned-sst-2-english",
          "cardiffnlp/twitter-roberta-base-sentiment-latest",
          "nlptown/bert-base-multilingual-uncased-sentiment"]:
    n = sum(p.numel() for p in AutoModel.from_pretrained(m).parameters())
    print(f"{n:>13,}  {m}")
```
```
   66,362,880  distilbert-base-uncased-finetuned-sst-2-english
  124,645,632  cardiffnlp/twitter-roberta-base-sentiment-latest
  167,356,416  nlptown/bert-base-multilingual-uncased-sentiment
```

**M17.**
```python
for m in ["distilbert-base-uncased-finetuned-sst-2-english",
          "cardiffnlp/twitter-roberta-base-sentiment-latest",
          "nlptown/bert-base-multilingual-uncased-sentiment"]:
    print(f"{AutoTokenizer.from_pretrained(m).vocab_size:>7,}  {m}")
```
```
 30,522  distilbert-base-uncased-finetuned-sst-2-english
 50,265  cardiffnlp/twitter-roberta-base-sentiment-latest
105,879  nlptown/bert-base-multilingual-uncased-sentiment
```

> ## 🔑 **105 879 / 30 522 ≈ 3.5 baravar katta lug'at** — 104 tilning so'zlari sig'ishi kerak.
>
> Ya'ni qo'shimcha parametrlarning katta qismi **aql** uchun emas, **lug'at** uchun ketgan. Bu — nima uchun katta hajm **avtomatik ravishda** aqlni anglatmasligining sababi.

</details>

### Amaliyot — zero-shot

**M18.** ⭐ Zero-shot ni kitob sharhlarida o'lchang.

**M19.** M18 natijasini 26-modulning eng yaxshi modeli bilan solishtiring.

**M20.** M18'dagi **xatolarni** ko'ring. Ular adolatlimi?

<details>
<summary>✅ Javoblar M18–M20</summary>

**M18.**
```python
d = pd.read_csv("../26-Text-Classifier/data/book_reviews_sample.csv")
d = d[d.rating != 3].copy()
d["haqiqiy"] = (d.rating > 3).map({True: "ijobiy", False: "salbiy"})

p = pipeline("sentiment-analysis", truncation=True)
d["bashorat"] = ["ijobiy" if r["label"] == "POSITIVE" else "salbiy"
                 for r in p(d.reviewText.tolist())]
print(len(d), "sharh")
print(f"aniqlik: {(d.bashorat == d.haqiqiy).mean():.3f}")
print(f"bazaviy: {(d.haqiqiy == 'ijobiy').mean():.3f}")
```
```
83 sharh
aniqlik: 0.976
bazaviy: 0.554
```

**M19.**
```
26-modul SVM (o'qitilgan, CV)   0.869
zero-shot (o'qitilmagan!)       0.976    🏆  +10.7 punkt
```
> 🔑 **Yorliq kerak emas, o'qitish kerak emas, 3 qator kod.**

**M20.**
```
1 yulduz | haqiqiy=salbiy bashorat=ijobiy
   "I read books to make me happy, laugh and generally make my day - I don't like..."

2 yulduz | haqiqiy=salbiy bashorat=ijobiy
   "Just like i said it was okay and entertaining to read it at least so popular..."
```
> ## ✅ **Ikkalasi ham ADOLATLI:**
> ```
> ① ijobiy so'zlar KO'P ("happy", "laugh", "make my day")
>    salbiylik gapning DAVOMIDA yashiringan
> ② matnda "okay and entertaining" — IJOBIY yozilgan
>    lekin foydalanuvchi 2 yulduz qo'ygan
> ```
> 🔑 Ikkinchisi — **model xatosi emas, MA'LUMOT SHOVQINI**: matn va baho bir-biriga mos emas.

</details>

### 🇺🇿 O'zbek tili sinovi

**M21.** ⭐⭐ Ingliz modelini **o'zbekcha** matnda sinang. Nima bo'ladi?

**M22.** ⭐⭐ **Ko'p tilli** modelni o'zbekcha matnda sinang.

**M23.** M21–M22 natijalarini 28-moduldagi `sklearn` modeli bilan solishtiring.

<details>
<summary>✅ Javoblar M21–M23</summary>

**M21.**
```python
uz = ["Bu kitob juda ajoyib va qiziqarli",
      "Juda zerikarli va sifatsiz kitob",
      "Menga judayam yoqdi"]
p = pipeline("sentiment-analysis")
for t, r in zip(uz, p(uz)):
    print(f"{r['label']:8s} {r['score']:.3f} | {t}")
```
```
NEGATIVE 0.956 | Bu kitob juda ajoyib va qiziqarli
NEGATIVE 0.909 | Juda zerikarli va sifatsiz kitob
NEGATIVE 0.986 | Menga judayam yoqdi
```
> ## ❌ **UCHALASIGA HAM "NEGATIVE" dedi** — ikkitasi **noto'g'ri**.
>
> ## ⚠️⚠️ **VA ENG YOMONI — ISHONCH JUDA YUQORI:**
> ```
> "Bu kitob juda AJOYIB va qiziqarli"  →  NEGATIVE  0.956   ❌
> "Menga judayam YOQDI"                →  NEGATIVE  0.986   ❌
>                                                      ↑
>                              98.6% "ishonch" bilan XATO
> ```
>
> ## 🔑 **Bu — eng xavfli holat.** Ballga qarab *"model ishonchli"* deb o'ylaysiz. Aslida model o'zbekchani **umuman tushunmayapti** va shunchaki **hammaga "salbiy"** deyapti.
>
> 💡 **Qiziq:** to'g'ri topgan jumla *("Juda zerikarli...")* — **eng past** ballga ega *(0.909)*. Ya'ni ball va to'g'rilik o'rtasida bu yerda **bog'liqlik yo'q**.

**M22.**
```python
p2 = pipeline("sentiment-analysis",
              model="nlptown/bert-base-multilingual-uncased-sentiment")
for t, r in zip(uz, p2(uz)):
    print(f"{r['label']:8s} {r['score']:.3f} | {t}")
```
```
3 stars  0.294 | Bu kitob juda ajoyib va qiziqarli
5 stars  0.461 | Juda zerikarli va sifatsiz kitob
1 star   0.295 | Menga judayam yoqdi
```
> ## 😱 **TESKARI!** *"Juda ZERIKARLI va SIFATSIZ"* → **5 YULDUZ**. *"Menga judayam YOQDI"* → **1 yulduz**.
>
> 💡 **Ijobiy tomoni:** ishonch **past** *(0.29–0.46)* — model **o'zi ham bilmasligini** ko'rsatyapti. Ingliz modelidan **halolroq**.

**M23.**
```
model                    parametr        aniqlik (16 jumla)
──────────────────────────────────────────────────────────
sklearn (28-modul)          kichik        0.625     🏆
distilbert INGLIZ       66,955,010        0.562
bert KO'P TILLI        167,356,416        0.500     📉
```
> ## 🔑 **Eng KATTA model eng YOMON natija berdi.**
>
> **Sabab:** `nlptown` modeli **6 tilda** sozlangan *(ingliz, golland, nemis, fransuz, italyan, ispan)* — **o'zbek ular orasida yo'q**.
>
> ⚠️ **Halol eslatma:** 16 ta jumla — **kam**. Aniq raqamlarga emas, **naqshga** ishoning: ingliz modeli **hammaga "salbiy"** dedi, ko'p tilli model **teskari** javob berdi. Bu — tasodif emas, **tizimli**.

</details>

### Nazariya — chuqurroq

**M24.** An'anaviy ML modeli bilan LLM ning asosiy farqi?

**M25.** `pipeline` ning 6 ta vazifasini ayting va har biri qaysi modulda ko'rilganini belgilang.

**M26.** Umumiy modelning **uchta kamchiligi**?

**M27.** "Ko'proq parametr = yaxshiroq" qachon **ishlamaydi**?

**M28.** BOG kontekstni tushunmasligini kodda ko'rsating.

**M29.** LLM javobini nima uchun **tekshirish** kerak?

**M30.** O'zbek tilida LLM qaysi vazifada eng yaxshi ishlaydi? Nima uchun?

<details>
<summary>✅ Javoblar M24–M30</summary>

**M24.** An'anaviy ML — **bitta vazifa** uchun o'qitiladi. LLM — avval **umumiy** tushuncha, keyin aniq vazifaga sozlanadi.

**M25.**
| Vazifa | Qaysi modul |
|---|---|
| `sentiment-analysis` | **23-modul** ✅ |
| `ner` | **22-modul** *(spaCy)* ✅ |
| `question-answering` | **33-modul** |
| `text-generation` · `summarization` · `translation` · `fill-mask` · `zero-shot-classification` | — |

**M26.** ① **sekin va qimmat** · ② **tushuntirmaydi** *(`coef_` yo'q)* · ③ **sizning tilingizda ishlamasligi mumkin**.

**M27.** Model **sizning tilingizda** yoki **sizning vazifangizda** o'qitilmagan bo'lsa. **O'lchangan misol:** o'zbekcha sentiment — 167M model **0.500**.

**M28.**
```python
from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer()
X = cv.fit_transform(["The dog bit the man", "The man bit the dog"])
print(cv.get_feature_names_out()); print(X.toarray())
```
```
['bit' 'dog' 'man' 'the']
[[1 1 1 2]
 [1 1 1 2]]
```

**M29.** Chunki LLM **butun internetdan** o'rgangan — u yerda **tarafkashlik**, **xato faktlar** va **shipchalar** bor. Va **27-moduldan farqli** o'laroq, siz uning o'quv ma'lumotini **ko'ra olmaysiz**.

**M30.** ## **TARJIMA** — chunki tarjima uchun **parallel matnlar** *(bir xil matn ikki tilda)* internetda ko'p. Sentiment uchun esa **o'zbekcha yorliqli to'plam** yo'q.

</details>

---

# 🔴 QIYIN *(31–40)*

**M31.** ⭐⭐ Uch modelni bir xil ma'lumotda solishtirib, **halol hisobot** yozing.

<details>
<summary>✅ Yechim</summary>

```python
def taqqosla(matnlar, haqiqiy, modellar):
    natija = []
    for nom, model_id, ozgartir in modellar:
        p = pipeline("sentiment-analysis", model=model_id, truncation=True)
        pred = [ozgartir(r) for r in p(matnlar)]
        n_param = sum(x.numel() for x in p.model.parameters())
        natija.append({
            "model": nom,
            "parametr": f"{n_param:,}",
            "aniqlik": round(sum(a == b for a, b in zip(pred, haqiqiy)) / len(haqiqiy), 3),
            "noaniq": pred.count("?"),
        })
    return pd.DataFrame(natija)


def yulduz(r):
    n = int(r["label"].split()[0])
    return "ijobiy" if n >= 4 else ("salbiy" if n <= 2 else "?")

modellar = [
    ("distilbert EN", "distilbert-base-uncased-finetuned-sst-2-english",
     lambda r: "ijobiy" if r["label"] == "POSITIVE" else "salbiy"),
    ("bert KO'P TILLI", "nlptown/bert-base-multilingual-uncased-sentiment", yulduz),
]
print(taqqosla(X_uz, y_uz, modellar).to_string(index=False))
```

**Hisobotda MAJBURIY:**
```
□ Parametr soni
□ Aniqlik
□ ⭐ XATOLAR RO'YXATI (faqat raqam YETARLI EMAS)
□ ⭐ Model qaysi TILDA/VAZIFADA sozlangani
□ ⭐ Namuna HAJMI va uning cheklovi
□ Bazaviy (Dummy) bilan taqqoslash
```

> ## ⚠️ **"0.562" deb yozib qo'yish — YETARLI EMAS.** Xatolarni ko'rmasangiz, modelning **hammaga "salbiy"** deyayotganini bilmaysiz — va uni *"biroz zaif"* deb hisoblab yuborasiz. Aslida u **umuman ishlamayapti**.

</details>

**M32.** ⭐ Model **ishonchi** *(score)* bilan **to'g'riligi** o'rtasida bog'liqlik bormi? O'lchang.

<details>
<summary>✅ Yechim</summary>

```python
d = pd.read_csv("../26-Text-Classifier/data/book_reviews_sample.csv")
d = d[d.rating != 3].copy()
d["haqiqiy"] = (d.rating > 3).map({True: "ijobiy", False: "salbiy"})

p = pipeline("sentiment-analysis", truncation=True)
r = p(d.reviewText.tolist())
d["ball"] = [x["score"] for x in r]
d["bashorat"] = ["ijobiy" if x["label"] == "POSITIVE" else "salbiy" for x in r]
d["togri"] = d.bashorat == d.haqiqiy

print(d.groupby(pd.cut(d.ball, [0.5, 0.9, 0.99, 1.0]),
                observed=True)["togri"].agg(["mean", "count"]))
```

> ## 🔑 **Kutilgan naqsh: ball yuqori → aniqlik yuqori.**
>
> ## ⚠️ **LEKIN — bu FAQAT model TUSHUNADIGAN tilda ishlaydi.**
>
> M21'ni eslang: o'zbekcha *"Bu kitob juda ajoyib"* → `NEGATIVE` **0.825** ball bilan. Ball **yuqori**, javob **noto'g'ri**.
>
> ## 💡 **Ball — "men ishonchim komil" degani, "men haqman" degani EMAS.**

</details>

**M33.** ⭐⭐ **Vosita tanlash yordamchisi** yozing *(7-darsdagi M6)*.

**M34.** ⭐ Bir xil vazifani `sklearn` va `transformers` bilan bajarib, **vaqtini** o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

t0 = time.time()
sk = make_pipeline(TfidfVectorizer(), LogisticRegression(max_iter=1000))
sk.fit(d.reviewText, d.haqiqiy); sk.predict(d.reviewText)
sk_vaqt = time.time() - t0

t0 = time.time()
tr = pipeline("sentiment-analysis", truncation=True)
tr(d.reviewText.tolist())
tr_vaqt = time.time() - t0

print(f"sklearn      : {sk_vaqt:6.2f} sek")
print(f"transformers : {tr_vaqt:6.2f} sek  ({tr_vaqt/sk_vaqt:.0f}x sekinroq)")
```
> ⚠️ Aniq raqam kompyuteringizga bog'liq — muhimi **nisbat**. 1 000 000 ta hujjatda bu farq **soatlarga** aylanadi.

</details>

**M35.** ⭐⭐ `truncation=True` ni olib tashlang. Nima bo'ladi va nima uchun?

<details>
<summary>✅ Javob</summary>

Uzun matnlarda **xato** beradi:
```
The expanded size of the tensor ... must match ...
```

**Sabab:**
```
BERT/DistilBERT  →  MAKSIMUM 512 token
Uzun sharh       →  512 dan ko'p  →  XATO
```

**Uch yechim:**
| Yechim | Kod | Kamchilik |
|---|---|---|
| ① Kesish | `truncation=True` | Oxiri **yo'qoladi** |
| ② Bo'laklash | matnni bo'lib, natijani birlashtirish | Murakkab |
| ③ Uzun model | `longformer`, `bigbird` | Sekin, katta |

> ## ⚠️ **① eng ko'p ishlatiladi — LEKIN u JIMGINA ma'lumot yo'qotadi.**
>
> Sharhning xulosasi ko'pincha **oxirida** bo'ladi *("...umuman olganda, tavsiya qilmayman")*. Kesish aynan **shu qismni** olib tashlashi mumkin. Uzun matnlar bilan ishlaganda buni **tekshiring**.

</details>

**M36.** ⭐⭐ Model kesilgan matnda **boshqacha** javob beradimi? O'lchang.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
uzun = d[d.reviewText.str.split().str.len() > 200]
p = pipeline("sentiment-analysis", truncation=True)
for _, x in uzun.head(5).iterrows():
    tola = p(x.reviewText)[0]
    yarim = p(" ".join(x.reviewText.split()[:100]))[0]
    print(f"to'liq={tola['label']:8s}({tola['score']:.2f})  "
          f"birinchi100={yarim['label']:8s}({yarim['score']:.2f})")
```
> 🔑 Javob **o'zgarsa** — matnning **oxiri muhim** ekan. Bunday hollarda **② bo'laklash** yondashuviga o'ting.

</details>

**M37.** ⭐⭐⭐ **Zero-shot muvofiqlik testi** yozing: modelga bir xil ma'noni **turli so'zlar** bilan bering va javobi **barqaror** qoladimi, tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
juftliklar = [
    ("This book was excellent",      "This book was superb"),
    ("I hated this movie",           "I loathed this movie"),
    ("The food was not good",        "The food was bad"),
    ("It wasn't terrible",           "It was okay"),
]
p = pipeline("sentiment-analysis")
for a, b in juftliklar:
    ra, rb = p(a)[0], p(b)[0]
    belgi = "✅" if ra["label"] == rb["label"] else "❌ NOMUVOFIQ"
    print(f"{belgi}  {ra['label']:8s}({ra['score']:.2f}) | {a}")
    print(f"    {rb['label']:8s}({rb['score']:.2f}) | {b}")
```

**Haqiqiy natija:**

```
✅  POSITIVE(1.00) | This book was excellent
    POSITIVE(1.00) | This book was superb
✅  NEGATIVE(1.00) | I hated this movie
    NEGATIVE(1.00) | I loathed this movie
✅  NEGATIVE(1.00) | The food was not good
    NEGATIVE(1.00) | The food was bad
✅  POSITIVE(0.97) | It wasn't terrible
    POSITIVE(1.00) | It was okay
```

> ## 🎉 **4/4 — MODEL TESTDAN O'TDI.**
>
> Va eng qiyin holatlarni ham:
> ```
> "The food was NOT good"   →  NEGATIVE  ✅  inkorni TUSHUNDI
> "It WASN'T TERRIBLE"      →  POSITIVE  ✅  IKKI KARRA inkorni tushundi!
> ```
>
> ## 🔑 **Bu — 26-modul bilan MUHIM taqqoslash.**
>
> O'sha yerda `stop_words='english'` `not` ni **olib tashlab**, aniqlikni **0.869 → 0.784** ga tushirgan edi — chunki Bag-of-Words uchun `not` shunchaki **bitta ustun**.
>
> Transformer esa `not` ni **kontekstda** ko'radi: `"not good"` — bu `not` + `good` **emas**, bu **bitta salbiy ma'no**.
>
> ## 💡 **Mana transformer arxitekturasining haqiqiy afzalligi** — va aynan buni **30-modulda** ichidan ko'ramiz.

> ## 🔬 **Nima uchun bu test MUHIM?**
>
> Ma'no bir xil bo'lsa, javob ham bir xil bo'lishi kerak. Bo'lmasa — model **ma'noni** emas, **aniq so'zlarni** o'rgangan.
>
> ⚠️ **Shu testni O'ZBEKCHA jumlalarda ham o'tkazing** — natija **butunlay boshqacha** bo'ladi *(M21 ga qarang)*.

</details>

**M38.** ⭐⭐ Kesh hajmini o'lchang va tozalash skriptini yozing.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path

kesh = Path.home() / ".cache" / "huggingface" / "hub"
jami = 0
for m in sorted(kesh.glob("models--*")):
    hajm = sum(f.stat().st_size for f in m.rglob("*") if f.is_file())
    jami += hajm
    print(f"{hajm/1e6:>9.1f} MB  {m.name.replace('models--','').replace('--','/')}")
print(f"{'-'*40}\n{jami/1e9:>9.2f} GB  JAMI")
```

**Tozalash:**
```python
import shutil
# ⚠️ EHTIYOT BO'LING — o'chirilgan model QAYTA YUKLANADI
# shutil.rmtree(kesh / "models--kerakmas--model")
```
> ⚠️ Yuqoridagi qator **ataylab izohga olingan**. O'chirishdan oldin **qaysi model kerakligini** aniq biling.

</details>

**M39.** ⭐⭐⭐ 🇺🇿 **O'zbekcha LLM tayyorlik hisoboti** — o'zbek tilida qaysi tayyor modellar ishlaydi, avtomatik tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
UZ_SINOV = [
    ("Bu kitob juda ajoyib va qiziqarli",  "ijobiy"),
    ("Juda zerikarli va sifatsiz kitob",   "salbiy"),
    ("Menga judayam yoqdi, ajoyib",        "ijobiy"),
    ("Vaqtimni behuda sarfladim, yomon",   "salbiy"),
    ("Zo'r asar, hammaga tavsiya qilaman", "ijobiy"),
    ("Umuman yoqmadi, zerikarli",          "salbiy"),
]

def uz_tayyorlik(model_id, ozgartir):
    try:
        p = pipeline("sentiment-analysis", model=model_id, truncation=True)
    except Exception as e:
        return {"model": model_id, "holat": f"❌ {type(e).__name__}"}
    matnlar = [t for t, _ in UZ_SINOV]
    haqiqiy = [y for _, y in UZ_SINOV]
    r = p(matnlar)
    pred = [ozgartir(x) for x in r]
    return {
        "model": model_id.split("/")[-1][:36],
        "parametr": f"{sum(x.numel() for x in p.model.parameters()):,}",
        "aniqlik": round(sum(a == b for a, b in zip(pred, haqiqiy)) / len(haqiqiy), 3),
        "o'rt_ball": round(float(np.mean([x["score"] for x in r])), 3),
    }

def yulduz(r):
    n = int(r["label"].split()[0])
    return "ijobiy" if n >= 4 else ("salbiy" if n <= 2 else "?")

hisobot = [
    uz_tayyorlik("distilbert-base-uncased-finetuned-sst-2-english",
                 lambda r: "ijobiy" if r["label"] == "POSITIVE" else "salbiy"),
    uz_tayyorlik("nlptown/bert-base-multilingual-uncased-sentiment", yulduz),
]
print(pd.DataFrame(hisobot).to_string(index=False))
print("\n⚠️  Bazaviy (tanga tashlash) = 0.500")
print("    Aniqlik 0.5 atrofida bo'lsa — model ISHLAMAYAPTI")
```

> ## 🇺🇿 **Bu skriptni har qanday yangi model uchun ishlating.**
>
> **Ikki ustunga qarang:**
> ```
> aniqlik ≈ 0.5      →  model TASODIFIY javob beryapti
> o'rt_ball yuqori   →  lekin ISHONCH bilan!  ← ENG XAVFLI
> ```
> Ikkalasi **birga** bo'lsa — model **ishonch bilan yanglishmoqda**. Uni **ishlatmang**.

</details>

**M40.** ⭐⭐⭐ **Yakuniy sintez.** 20–29-modullardan qaysi vositani qachon ishlatishni bitta jadvalga jamlang.

<details>
<summary>✅ Namuna javob</summary>

| Vaziyat | Vosita | Modul | Dalil |
|---|---|---|---|
| Ingliz + sentiment + ma'lumot yo'q | ## **zero-shot `pipeline()`** | 29 | **0.976** o'lchangan |
| Ingliz + sentiment + ma'lumot bor | zero-shot **avval**, keyin `sklearn` | 26, 29 | 0.976 vs 0.869 |
| 🇺🇿 O'zbek + yorliqli ma'lumot | ## **`sklearn` + `uznlp`** | 26, 28 | **0.625 vs 0.500** |
| 🇺🇿 O'zbek + ma'lumot yo'q | LLM so'rovi + **qo'lda tekshirish** | 29 | tayyor model ishlamaydi |
| 1M+ hujjat, past byudjet | ## **`sklearn`** | 26 | 10 sek vs soatlar |
| Qarorni tushuntirish kerak | ## **`sklearn` `coef_`** | 26 | LLM'da `coef_` yo'q |
| Mavzularni topish | `LDA` / `LSA` | 25 | — |
| Nomli obyektlar *(ingliz)* | `spaCy` yoki `pipeline("ner")` | 22, 29 | — |
| **Ma'lumotni tekshirish** | ## **Shipcha detektori** | 27 | ## ⚠️ **DOIM** |

```
🔑 ENG MUHIM QATOR — OXIRGISI.

   Qaysi vositani tanlashingizdan QAT'I NAZAR,
   ma'lumotingizni SHIPCHAGA tekshiring.

   LLM davrida bu KAMAYMADI — KO'PAYDI,
   chunki modelning o'quv ma'lumotini KO'RA OLMAYSIZ.
```

</details>

---

## 🎯 Yakuniy tekshirish

- [ ] LLM ning uchta xususiyatini ayta olasizmi?
- [ ] Modelning parametrini sanay olasizmi?
- [ ] Zero-shot ni o'z ma'lumotingizda sinay olasizmi?
- [ ] "Ko'proq parametr = yaxshiroq" qachon ishlamasligini bilasizmi?
- [ ] O'zbekcha matnda tayyor modelni sinab ko'rdingizmi?
- [ ] Vosita tanlash mezonlaringiz aniqmi?

---

⬅️ [7-dars](07-What-can-LLMs-be-used-for.md) · 🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
