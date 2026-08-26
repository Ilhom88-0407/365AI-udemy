# 📝 31-modul mashqlari

> **42 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **BARCHA AMALIY MASHQLAR API KALITISIZ, BEPUL ishlaydi.**

## ⚙️ Tayyorgarlik

```bash
pip install transformers torch scikit-learn pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import torch, numpy as np, pandas as pd
from transformers import (AutoTokenizer, AutoModelForCausalLM,
                          AutoModelForSeq2SeqLM)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# GPT kabi — matn DAVOM ETTIRADI
gpt_tok = AutoTokenizer.from_pretrained("distilgpt2")
gpt = AutoModelForCausalLM.from_pretrained("distilgpt2")

# ChatGPT kabi — KO'RSATMAGA amal qiladi
t5_tok = AutoTokenizer.from_pretrained("google/flan-t5-base")
t5 = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")


def gpt_yarat(p, mx=20, temp=None, seed=42):
    torch.manual_seed(seed)
    e = gpt_tok(p, return_tensors="pt")
    kw = dict(max_new_tokens=mx, pad_token_id=gpt_tok.eos_token_id)
    kw["do_sample"] = False if temp is None else True
    if temp is not None:
        kw.update(temperature=temp, top_k=0)
    with torch.no_grad():
        return gpt_tok.decode(gpt.generate(**e, **kw)[0], skip_special_tokens=True)


def t5_javob(p, mx=50):
    e = t5_tok(p, return_tensors="pt")
    with torch.no_grad():
        return t5_tok.decode(t5.generate(**e, max_new_tokens=mx)[0],
                             skip_special_tokens=True)
```

---

# 🟢 OSON *(1–14)*

**M1.** GPT nimaning qisqartmasi?

**M2.** Uchala harf nimani anglatadi?

**M3.** GPT-1 qachon va nechta parametr bilan chiqqan?

**M4.** Qaysi modelda few-shot paydo bo'ldi?

**M5.** ChatGPT va GPT farqi?

**M6.** Prompt nima?

**M7.** `max_tokens` nima qiladi?

<details>
<summary>✅ Javoblar M1–M7</summary>

**M1.** ## **Generative Pre-trained Transformer**.

**M2.** **G** = yaratuvchi · **P** = oldindan o'qitilgan · **T** = transformer arxitekturasi.

**M3.** ## **2018-yil**, **117 million** parametr, **40 GB** matn.

**M4.** ## **GPT-3** *(2020, 175 milliard)*.

**M5.** ChatGPT — GPT'ning **suhbat uchun qo'shimcha sozlangan** versiyasi.
```
GPT      →  matnni DAVOM ETTIRADI
ChatGPT  →  savolga JAVOB beradi
```

**M6.** Modelga beriladigan **matn** — jumla, savol yoki ko'rsatma.

**M7.** Natijaning **maksimal uzunligini** *(tokenlarda)*.

</details>

**M8.** `temperature` nima qiladi?

**M9.** Uchta rol qaysilar?

**M10.** Narx nima bo'yicha hisoblanadi?

**M11.** API kalitini qanday saqlash kerak?

**M12.** RAG nima?

**M13.** RAG quvurining to'rt qadami?

**M14.** RAG'da model qayta o'qitiladimi?

<details>
<summary>✅ Javoblar M8–M14</summary>

**M8.** Tasodifiylikni boshqaradi — `softmax(logits / T)`.

**M9.** `system` *(qoida)* · `user` *(misol savol)* · `assistant` *(misol javob)*.

**M10.** ## **Har 1000 token** uchun.

**M11.** ## **Muhit o'zgaruvchisi** — `os.environ.get("OPENAI_API_KEY")` + `.gitignore`.

**M12.** **Retrieval-Augmented Generation** — modelga **o'z ma'lumotingizni berish**.

**M13.** Bo'laklash → embedding → vektor ombori → qidirish.

**M14.** ## ❌ **Yo'q** — faqat ma'lumot **promptga qo'shiladi**.

</details>

---

# 🟡 O'RTA *(15–30)*

### GPT ning uch harfini isbotlash

**M15.** ⭐ Uchala harfni **bitta skriptda** namoyish qiling.

<details>
<summary>✅ Yechim</summary>

```python
# G — GENERATIVE
matn = "The cat sat on the"
for _ in range(4):
    e = gpt_tok(matn, return_tensors="pt")
    with torch.no_grad():
        matn += gpt_tok.decode(gpt(**e).logits[0, -1].argmax())
print("G:", repr(matn))

# P — PRE-TRAINED
print(f"P: {sum(p.numel() for p in gpt.parameters()):,} parametr")

# T — TRANSFORMER
g2 = AutoModelForCausalLM.from_pretrained("distilgpt2",
                                          attn_implementation="eager")
e = gpt_tok("The cat sat on the", return_tensors="pt")
with torch.no_grad():
    A = g2(**e, output_attentions=True).attentions
print(f"T: {len(A)} qatlam × {A[0].shape[1]} bosh")
print("   niqoblangan?", bool(np.allclose(np.triu(A[0][0,0].numpy(), 1), 0)))
```
```
G: 'The cat sat on the floor of the house'
P: 81,912,576 parametr
T: 6 qatlam × 12 bosh
   niqoblangan? True
```

</details>

**M16.** `distilgpt2` GPT-1 bilan qanday taqqoslanadi?

<details>
<summary>✅ Javob</summary>

```
distilgpt2 : 81,912,576
GPT-1      : 117,000,000
nisbat     : 0.70×
```
> ## 🔑 **`distilgpt2` GPT-1 dan ham KICHIK.** Shuning uchun u faktik savollarda **zaif**.

</details>

### Sozlamalar

**M17.** ⭐ `max_tokens` ni 5, 20, 50 qilib sinang. 50 da nima bo'ladi?

**M18.** ⭐ To'rt xil `temperature` da sinang.

**M19.** `temperature` ni **matematik** ko'rsating.

<details>
<summary>✅ Javoblar M17–M19</summary>

**M17.**
```
mx= 5: 'Once upon a time of war, the United'
mx=20: 'Once upon a time of war, the United States was the only country in the world to have a military presence. The'
mx=50: '...military presence. The United States was the only country... ' × 3 MARTA
```
> ## 🔁 **50 da TAKRORLANISH** — `argmax` halqaga tushdi.

**M18.**
```
0.01 → '...the only country... the only country...'      🔁 takror
0.5  → '...when the first step was to have a conversation' ✅ ENG YAXSHI
1.0  → '...a barter in the mill, chewing, slicing slices'  ⚠️ g'alati
1.5  → '...Intellect will abound: Sci-Fi would rank 133.5' ❌ ma'nosiz
```

**M19.**
```python
l = torch.tensor([3.0, 1.0, 0.5, 0.2])
for t in [0.1, 0.5, 1.0, 2.0]:
    print(f"temp={t:4.1f}: {[round(float(x),3) for x in torch.softmax(l/t,-1)]}")
```
```
temp= 0.1: [1.0, 0.0, 0.0, 0.0]
temp= 0.5: [0.972, 0.018, 0.007, 0.004]
temp= 1.0: [0.782, 0.106, 0.064, 0.048]
temp= 2.0: [0.526, 0.194, 0.151, 0.13]
```

</details>

**M20.** ⭐ Takrorlanishni **son bilan** o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def noyoblik(matn):
    s = matn.lower().split()
    return round(len(set(s)) / len(s), 3) if s else 0

for mx in [20, 50]:
    for temp in [None, 0.8]:
        m = gpt_yarat("Once upon a time", mx=mx, temp=temp)
        nom = "argmax" if temp is None else f"temp={temp}"
        print(f"mx={mx:2d} {nom:9s} noyoblik={noyoblik(m)}")
```
> 🔑 `noyoblik` past → takrorlanish ko'p. `argmax` da u **eng past** bo'ladi.
>
> ⚠️ Lekin **yuqori noyoblik ≠ yaxshi** — tasodifiy so'zlar ham 1.0 beradi.

</details>

### Modellar farqi

**M21.** ⭐⭐ `distilgpt2` va `flan-t5` ni **bir xil ko'rsatmada** sinang.

<details>
<summary>✅ Yechim</summary>

```python
k = "Translate English to French: The book was very interesting"
print("distilgpt2:", repr(gpt_yarat(k, mx=20)))
print("flan-t5   :", repr(t5_javob(k)))
```
```
distilgpt2: 'Translate English to French: The book was very interesting. I was very impressed with the book. I was very impressed with the book. I was very'
flan-t5   : 'Le livre était très intéressant.'
```
> ## 💥 **Bir xil hajm (~80M). Farq — SOZLASHDA.**
>
> `distilgpt2` ko'rsatmani **matn** deb qabul qildi. `flan-t5` esa unga **amal qildi** *(instruction-tuned)*.
>
> ## 🔑 **Bu — 2-darsdagi GPT vs ChatGPT farqining kichik nusxasi.**

</details>

**M22.** ⭐⭐ Few-shot ni **ikki xil hajmda** sinang.

<details>
<summary>✅ Javob</summary>

```
flan-t5-small (77M)  →  'tea, island, tea'                                2 ta
flan-t5-base (248M)  →  'country, island, country, tea, beaches, temples'  5 ta
```
> ## 🔑 **Few-shot MIQYOS talab qiladi.** 29-modul: *"few-shot GPT-3 (175B) bilan rivojlantirildi"*. Bizning natija — bu da'voning **tasdig'i**.

</details>

**M23.** ⭐ Model faktlarda nima uchun xato qiladi?

<details>
<summary>✅ Javob</summary>

```
"When was Google founded?"   (to'g'risi: 1998-yil 4-sentabr)

  distilgpt2      →  Parij ham demadi
  flan-t5-small   →  '1897'                ❌
  flan-t5-base    →  '18 September 2007'   ❌
```
> ## 🔑 **Hajm SHAKLNI yaxshiladi** *(to'liq sana!)*, **MAZMUNNI** esa yo'q.
>
> ## ✅ **Yechim — RAG** *(faktni MODELGA BERISH)*.

</details>

### RAG

**M24.** ⭐⭐ Modelning **bilmasligini** ko'rsating.

**M25.** ⭐⭐ RAG'ni **noldan** quring.

**M26.** ⭐⭐ RAG'siz va RAG bilan solishtiring.

<details>
<summary>✅ Yechim M24–M26</summary>

```python
HUJJAT = """365 Data Science publishes new courses regularly.
The Introduction to Large Language Models course will be released in March 2024.
The LangChain in Practice course is scheduled for April 2024.
The Vector Databases with Pinecone course comes out in May 2024.
The platform currently has more than 60 courses."""

bolaklar = [s.strip() + "." for s in HUJJAT.replace("\n", " ").split(".") if s.strip()]
vek = TfidfVectorizer()
OMBOR = vek.fit_transform(bolaklar)

def qidir(savol, k=2):
    b = cosine_similarity(vek.transform([savol]), OMBOR)[0]
    return [(bolaklar[i], round(float(b[i]), 3))
            for i in b.argsort()[::-1][:k] if b[i] > 0]

def rag(savol, k=2):
    top = qidir(savol, k)
    kontekst = " ".join(b for b, _ in top)
    return t5_javob(f"Context: {kontekst}\nQuestion: {savol}\nAnswer:"), top

for s in ["Which course will be released in March 2024?",
          "When is the LangChain course?",
          "How many courses are there?"]:
    rj, top = rag(s)
    print(f"{s}\n  ❌ {t5_javob(f'Answer the question: {s}')!r}"
          f"\n  ✅ {rj!r}   (manba ball {top[0][1]})\n")
```

```
Which course will be released in March 2024?
  ❌ 'physics'
  ✅ 'Introduction to Large Language Models'   (manba ball 0.708)

When is the LangChain course?
  ❌ '1890'
  ✅ 'April 2024'   (manba ball 0.601)

How many courses are there?
  ❌ '58'
  ✅ 'more than 60'   (manba ball 0.313)
```

> ## 🏆 **UCHALASI TO'G'RI. Model o'zgarmadi — faqat MA'LUMOT BERILDI.**

</details>

**M27.** ⭐ Uchinchi savolning **manba balli 0.313** — bu nimani anglatadi?

<details>
<summary>✅ Javob</summary>

```
JAVOB  : 'more than 60'    ✅ to'g'ri
MANBA  : "365 Data Science publishes new courses regularly."  (0.313)
              ↑
     BU BO'LAKDA "60" YO'Q!
```

> ## 🔑 **`k=2` bizni qutqardi** — ikkinchi bo'lak *("more than 60 courses")* to'g'ri edi.
>
> ## ⚠️ **AMALIY SABOQ:**
> ```
> k=1  →  arzon, lekin bitta xato = NOTO'G'RI javob
> k=3  →  ANCHA ishonchli    ⭐ tavsiya
> ```
> Va **past ball (0.313)** — bu **ogohlantirish belgisi**. Uni **kuzating**.

</details>

**M28.** RAG'ning "yashirin superkuchi" nima?

**M29.** LangChain'ning kamchiliklari?

**M30.** Kursdagi LangChain kodi nima uchun ishlamaydi?

<details>
<summary>✅ Javoblar M28–M30</summary>

**M28.** ## **MANBA KO'RINADI** → javobni **tekshirish** mumkin. 27-modul saboqi: *"modelni doim tekshiring"* — RAG buni **mumkin** qiladi.

**M29.** **"Qora quti"** · **ko'p bog'liqlik** · **API tez o'zgaradi** · nosozlik tuzatish **qiyin**.

**M30.**
```
① langchain.document_loaders   →  langchain_community...
② langchain.embeddings         →  langchain_openai
③ ConversationalRetrievalChain →  ESKIRGAN (LCEL)
④ qa_chain({...})              →  .invoke({...})
```

</details>

---

# 🔴 QIYIN *(31–42)*

**M31.** ⭐⭐⭐ 🇺🇿 **O'zbekcha RAG** quring va **baholang**.

<details>
<summary>✅ Yechim</summary>

```python
class OddiyRAG:
    def __init__(self, matn, token_pattern=None):
        j = [s.strip() for s in matn.replace("\n", " ").split(".") if s.strip()]
        self.bolaklar = [x + "." for x in j]
        kw = {"token_pattern": token_pattern} if token_pattern else {}
        self.vek = TfidfVectorizer(**kw)
        self.ombor = self.vek.fit_transform(self.bolaklar)

    def qidir(self, savol, k=3):
        b = cosine_similarity(self.vek.transform([savol]), self.ombor)[0]
        return [(self.bolaklar[i], round(float(b[i]), 3))
                for i in b.argsort()[::-1][:k] if b[i] > 0]

    def bahola(self, sinovlar, k=1):
        r = []
        for savol, kutilgan in sinovlar:
            top = self.qidir(savol, k)
            r.append({"savol": savol[:36], "kutilgan": kutilgan,
                      "ball": top[0][1] if top else 0.0,
                      "topildi": "✅" if any(kutilgan.lower() in b.lower()
                                             for b, _ in top) else "❌"})
        df = pd.DataFrame(r)
        print(df.to_string(index=False))
        print(f"\nANIQLIK: {(df.topildi == '✅').mean():.1%}")
        return df


UZ = """Kompaniyamiz 2015-yilda tashkil etilgan.
Bizning ofisimiz Toshkent shahrida joylashgan.
Mahsulot qaytarish muddati 14 kun.
Yetkazib berish O'zbekiston bo'ylab bepul.
Qo'llab-quvvatlash xizmati 24 soat ishlaydi."""

OddiyRAG(UZ, token_pattern=r"[\w'ʻ’]+").bahola([
    ("Kompaniya qachon tashkil etilgan?",   "2015"),
    ("Ofis qayerda?",                       "Toshkent"),
    ("Qaytarish muddati qancha?",           "14 kun"),
    ("Yetkazib berish pullikmi?",           "bepul"),
    ("Qo'llab-quvvatlash qachon ishlaydi?", "24 soat"),
])
```

```
                              savol kutilgan   ball topildi
  Kompaniya qachon tashkil etilgan?     2015  0.632      ✅
                      Ofis qayerda? Toshkent  0.000      ❌
          Qaytarish muddati qancha?   14 kun  0.632      ✅
          Yetkazib berish pullikmi?    bepul  0.632      ✅
Qo'llab-quvvatlash qachon ishlaydi?  24 soat  0.707      ✅

ANIQLIK: 80.0%
```

> ## ✅ **80% — o'zbekcha qidiruv ISHLAYDI!** *(`sklearn` tildan mustaqil — 28-modul)*

</details>

**M32.** ⭐⭐⭐ *"Ofis qayerda?"* nima uchun **0.000** berdi?

<details>
<summary>✅ Javob</summary>

```
SAVOL  :  "Ofis qayerda?"
HUJJAT :  "Bizning ofisimiz Toshkent shahrida joylashgan."

  "ofis"     ≠  "ofisimiz"      ← TF-IDF uchun IKKI XIL so'z
  "qayerda"  →  hujjatda YO'Q

  Umumiy so'z YO'Q  →  kosinus = 0.000
```

> ## 🔑 **TF-IDF NING TUB CHEKLOVI: u SO'ZLARNI solishtiradi, MA'NONI emas.**
>
> ```
> "qayerda" ≈ "joylashgan"  →  ODAM uchun aniq
>                           →  TF-IDF uchun BEGONA
> ```
>
> ## 💡 **Va bu — 28-moduldagi AGGLYUTINATSIYA muammosining qaytishi.**
>
> ## ✅ **UCHTA YECHIM:**
> ```
> ① STEMMING          →  28-moduldagi uz_stem()  (ofisimiz → ofis)
> ② SINONIM lug'ati   →  "qayerda" → "joylashgan"
> ③ NEYRON EMBEDDING  →  ma'noni tushunadi
> ```

</details>

**M33.** ⭐⭐ M31 ni `token_pattern` **bilan va busiz** sinang. Farq bormi?

<details>
<summary>✅ Javob — HALOL NATIJA</summary>

```
token_pattern BILAN  →  80.0%
token_pattern BUSIZ  →  80.0%      ← BIR XIL!
```

> ## 😲 **ANIQLIKDA FARQ YO'Q — va buni halol tan olish kerak.**
>
> **Farq faqat BALLARDA:**
> ```
> "Yetkazib berish pullikmi?"   bilan 0.632  ·  busiz 0.577
> "Qo'llab-quvvatlash..."        bilan 0.707  ·  busiz 0.756
> ```
>
> ## 🔑 **TO'G'RI XULOSA:**
> ```
> ❌ "token_pattern kerak emas ekan"
> ✅ "bu KICHIK misolda farq ko'rinmadi"
> ```
>
> **28-modulda o'lchagandik:** `O'zbekiston` → `zbekiston` *(nom BUZILADI)*. Bu — **fakt**. Katta hujjatda farq **albatta** chiqadi.
>
> ## 💡 **METODOLOGIK SABOQ:** *"men shunday deb o'ylayman"* ≠ *"men o'lchadim"*.

</details>

**M34.** ⭐⭐ `k` ni 1, 2, 3, 5 qilib RAG aniqligini o'lchang.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
r = OddiyRAG(UZ, token_pattern=r"[\w'ʻ’]+")
for k in [1, 2, 3, 5]:
    print(f"\n=== k={k} ===")
    r.bahola(SINOVLAR, k=k)
```
> ## 🔑 **Kutilgan naqsh:** `k` oshgani sari **aniqlik oshadi**, lekin:
> ```
> k KICHIK  →  arzon, tez, lekin XATO xavfi
> k KATTA   →  ishonchli, lekin ko'p TOKEN (= qimmat) va SHOVQIN
> ```
> Amalda **k = 3–5** eng keng tarqalgan.

</details>

**M35.** ⭐⭐ Xotirali RAG quring va koreferensiyani sinang.

<details>
<summary>✅ Yechim</summary>

```python
class RagXotira:
    def __init__(self, bolaklar, maks_tarix=3):
        self.bolaklar = bolaklar
        self.vek = TfidfVectorizer()
        self.ombor = self.vek.fit_transform(bolaklar)
        self.tarix, self.maks_tarix = [], maks_tarix

    def sora(self, savol, k=2):
        b = cosine_similarity(self.vek.transform([savol]), self.ombor)[0]
        kontekst = " ".join(self.bolaklar[i] for i in b.argsort()[::-1][:k] if b[i] > 0)
        tarix = " ".join(f"Q: {q} A: {a}" for q, a in self.tarix[-self.maks_tarix:])
        p = (f"Context: {kontekst}\n"
             + (f"Previous conversation: {tarix}\n" if tarix else "")
             + f"Question: {savol}\nAnswer:")
        j = t5_javob(p)
        self.tarix.append((savol, j))
        return j

bot = RagXotira(bolaklar)
print(repr(bot.sora("When is the LangChain course?")))
print(repr(bot.sora("And the Vector Databases one?")))
```
```
'April 2024'
'Pinecone'
```

> ## ⚠️ **IKKINCHISI — YARIM MUVAFFAQIYAT.**
> ```
> Kutilgan:  "May 2024"
> Olingan :  "Pinecone"
> ```
> Model **to'g'ri bo'lakni topdi**, lekin `"one"` ning **`"When"` ga** ishora qilishini ilg'amadi.
>
> ## ✅ **Kichik modellar uchun yechim — savolni TO'LIQ yozing:**
> ```
> ❌ "And the Vector Databases one?"
> ✅ "When is the Vector Databases course?"
> ```

</details>

**M36.** ⭐⭐ Kalit xavfsizligi skriptini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re
from pathlib import Path

NAQSHLAR = [(r"sk-[A-Za-z0-9_\-]{20,}", "OpenAI"),
            (r"AKIA[0-9A-Z]{16}", "AWS"),
            (r"ghp_[A-Za-z0-9]{36}", "GitHub")]

def kalit_qidir(papka="."):
    topildi = []
    for f in Path(papka).rglob("*"):
        if (not f.is_file() or f.suffix not in
                (".py", ".ipynb", ".md", ".txt", ".json", ".env")):
            continue
        if any(x in f.parts for x in (".git", "__pycache__")):
            continue
        try:
            m = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for naqsh, nom in NAQSHLAR:
            for x in re.finditer(naqsh, m):
                topildi.append((str(f), m[:x.start()].count("\n") + 1, nom))
    for t in topildi:
        print(f"🚨 {t[0]}:{t[1]} → {t[2]}")
    if not topildi:
        print("✅ Ochiq kalit topilmadi.")
    return topildi

kalit_qidir()
```
> ⚠️ `.ipynb` ni ham tekshiring — noutbuklar **chiqish natijalarida** kalit saqlab qolishi mumkin.

</details>

**M37.** ⭐⭐ 🇺🇿 O'zbekcha matn API'da qanchaga qimmat tushadi?

<details>
<summary>✅ Yechim</summary>

```python
juftliklar = [
    ("This book is very interesting and I recommend it to everyone",
     "Bu kitob juda qiziqarli va men uni hammaga tavsiya qilaman"),
    ("Our office is located in the capital city",
     "Bizning ofisimiz poytaxt shahrida joylashgan"),
]
for en, uz in juftliklar:
    ne, nu = len(t5_tok.encode(en)), len(t5_tok.encode(uz))
    print(f"ingliz {ne:3d} · o'zbek {nu:3d}  →  {nu/ne:.1f}×")
```
> ## 💰 **Narx token bo'yicha** → o'zbekcha matn **~2× qimmat**.
>
> ## ✅ **Yechim — RAG:** butun hujjat o'rniga faqat **2–3 ta bo'lak** yuboriladi.

</details>

**M38.** ⭐⭐⭐ `flan-t5-base` javobidagi **uchta faktik xatoni** toping.

<details>
<summary>✅ Javob</summary>

```
'The first whiskey was made in 1808 by James Madison, a distiller who
 grew up in the Highlands of Scotland.'

① "1808"                  →  viski XV asrdan ma'lum
② "James Madison"         →  AQSH PREZIDENTI (1751-1836), distillyator emas
③ "Highlands of Scotland" →  Madison VIRGINIYADA tug'ilgan
```
> ## 🔑 **Model UCHTA alohida faktni ARALASHTIRIB, ishonarli yolg'on yaratdi.**
>
> ## ⚠️ **Va bu — kichik modeldan XAVFLIROQ:** javob **ravon** va **batafsil**, shuning uchun **ishonarli** eshitiladi.

</details>

**M39.** ⭐⭐ `system` ko'rsatmasi ishlayotganini **tekshiring**.

<details>
<summary>✅ Yechim</summary>

```python
SHAXSIYATLAR = {
    "she'riy": "You are a poetic chatbot. Answer in rhyme.",
    "qisqa":   "You are a terse chatbot. Answer in exactly three words.",
    "bola":    "You are a chatbot for children. Explain very simply.",
}
for tur, k in SHAXSIYATLAR.items():
    print(f"{tur:9s}: {t5_javob(f'{k}\\n\\nQ: What is the sun?\\nA:')!r}")
```
> ## 🎯 **ENG MUHIM SINOV:**
> ```
> ✅ javoblar FARQ QILSA    →  model system ni TUSHUNDI
> ❌ javoblar BIR XIL BO'LSA →  model uni E'TIBORGA OLMADI
>                              → model sizning vazifangiz uchun JUDA KICHIK
> ```

</details>

**M40.** ⭐⭐ RAG'ni **shovqinli** hujjatda sinang *(keraksiz matn qo'shing)*.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
SHOVQIN = HUJJAT + "\n" + "\n".join(
    f"This is unrelated sentence number {i} about cooking and gardening."
    for i in range(20))
```
> ## 🔑 **Kutilgan naqsh:** shovqin oshgani sari **ball pasayadi**, lekin **to'g'ri bo'lak baribir birinchi** qoladi *(agar savol aniq bo'lsa)*.
>
> ## 💡 **Bu — RAG'ning kuchli tomoni:** u **butun hujjatni** emas, **eng mosini** tanlaydi.

</details>

**M41.** ⭐⭐ RAG bilan RAG'siz javoblarni **avtomatik baholang**.

<details>
<summary>✅ Yechim</summary>

```python
SINOV = [
    ("Which course will be released in March 2024?", "Large Language Models"),
    ("When is the LangChain course?",                "April"),
    ("How many courses are there?",                  "60"),
]
r = []
for s, kutilgan in SINOV:
    ragsiz = t5_javob(f"Answer the question: {s}")
    rag_j, _ = rag(s)
    r.append({"savol": s[:34],
              "ragsiz": "✅" if kutilgan.lower() in ragsiz.lower() else "❌",
              "rag": "✅" if kutilgan.lower() in rag_j.lower() else "❌"})
df = pd.DataFrame(r)
print(df.to_string(index=False))
print(f"\nRAGSIZ: {(df.ragsiz=='✅').mean():.0%}   RAG: {(df.rag=='✅').mean():.0%}")
```
```
RAGSIZ: 0%   RAG: 100%
```
> ## 🏆 **0% → 100%. Model o'zgarmadi.**

</details>

**M42.** ⭐⭐⭐ **Yakuniy sintez.** 24, 28, 30, 31-modullar RAG'da qanday birlashadi?

<details>
<summary>✅ Namuna javob</summary>

| RAG qadami | Qaysi moduldan | Nima ishlatiladi |
|---|---|---|
| ① **Bo'laklash** | 21-modul | Matnni tozalash, jumlalarga bo'lish |
| ② **Embedding** | ## **24-modul** | ## `TfidfVectorizer` |
| ② **(o'zbekcha)** | ## **28-modul** | ## `token_pattern=r"[\w'ʻ’]+"` + stemming |
| ③ **Vektor ombori** | 24-modul | `cosine_similarity` |
| ④ **Qidirish** | 25-modul | O'xshashlik bo'yicha saralash |
| ⑤ **Generatsiya** | ## **30–31-modul** | Transformer + prompt |
| **Tekshirish** | ## **26–27-modul** | ## `bahola()` + shipcha detektori |

```
🏆 RAG — YANGI TEXNOLOGIYA EMAS.
   Bu — SIZ ALLAQACHON BILADIGAN narsalarning YANGI TARZDA BIRLASHUVI.

   TF-IDF (24-modul, 2 yil oldingi texnologiya)
        +
   Transformer (30-modul)
        =
   RAG (2023-yilning eng muhim g'oyasi)


🔑 VA ENG MUHIMI — BAHOLASH (26-modul):
      "raqamsiz — bu taxmin"

   Bizning RAG:  RAGSIZ 0%  →  RAG 100%
   O'zbekcha  :  80% (va QAYSI savol ishlamasligi ANIQ)
```

</details>

---

## 🎯 Yakuniy tekshirish

- [ ] GPT ning uchala harfini kodda isbotlay olasizmi?
- [ ] `temperature` ni matematik tushuntira olasizmi?
- [ ] Uchta rolni bilasizmi?
- [ ] RAG'ni **noldan** qura olasizmi?
- [ ] 🇺🇿 O'zbekcha RAG qurib, uni **baholay** olasizmi?
- [ ] Kursdagi eskirgan kodni yangilay olasizmi?
- [ ] API kalitini xavfsiz saqlashni bilasizmi?

---

⬅️ [10-dars](10-Adding-Custom-Data.md) · 🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
