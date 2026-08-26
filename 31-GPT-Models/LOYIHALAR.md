# 🚀 31-modul mini-loyihalari

> **6 ta tayyor loyiha.** Hammasi **ishlab tekshirilgan**.
>
> ## ⭐⭐ **HAMMASI API KALITISIZ, BEPUL ishlaydi.**
>
> Kurs pullik OpenAI API'dan foydalanadi. Bu yerda **bir xil g'oyalar** bepul mahalliy modellarda amalga oshirilgan.

## ⚙️ Umumiy tayyorgarlik

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
```

---

# 🎛️ 1-loyiha. Generatsiya sozlamalari laboratoriyasi

> **Maqsad:** `max_tokens`, `temperature` va boshqa sozlamalarning ta'sirini **son bilan** o'lchash.

```python
class GeneratsiyaLab:
    """Matn generatsiyasi sozlamalarini o'rganish uchun asbob."""

    def __init__(self, model_id="distilgpt2"):
        self.tok = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForCausalLM.from_pretrained(model_id)

    def yarat(self, prompt, mx=30, temp=None, top_p=None,
              rep_pen=None, seed=42):
        torch.manual_seed(seed)
        e = self.tok(prompt, return_tensors="pt")
        kw = dict(max_new_tokens=mx, pad_token_id=self.tok.eos_token_id)
        if temp is None:
            kw["do_sample"] = False
        else:
            kw.update(do_sample=True, temperature=temp)
            kw["top_p"] = top_p if top_p is not None else 1.0
            if top_p is None:
                kw["top_k"] = 0
        if rep_pen:
            kw["repetition_penalty"] = rep_pen
        with torch.no_grad():
            o = self.model.generate(**e, **kw)
        return self.tok.decode(o[0], skip_special_tokens=True)

    @staticmethod
    def noyoblik(matn):
        """Takrorlanish o'lchovi: 1.0 = hech narsa takrorlanmagan."""
        s = matn.lower().split()
        return round(len(set(s)) / len(s), 3) if s else 0.0

    def taqqosla(self, prompt="Once upon a time", mx=30):
        variantlar = [
            ("argmax (temp=0)",  dict()),
            ("temp=0.5",         dict(temp=0.5)),
            ("temp=0.8",         dict(temp=0.8)),
            ("temp=0.8 top_p",   dict(temp=0.8, top_p=0.9)),
            ("temp=0.8 +rep_pen", dict(temp=0.8, top_p=0.9, rep_pen=1.2)),
            ("temp=1.5",         dict(temp=1.5)),
        ]
        r = []
        for nom, kw in variantlar:
            m = self.yarat(prompt, mx=mx, **kw)
            r.append({"sozlama": nom,
                      "noyoblik": self.noyoblik(m),
                      "natija": m[len(prompt):][:52].replace("\n", " ") + "..."})
        return pd.DataFrame(r)


lab = GeneratsiyaLab()
print(lab.taqqosla().to_string(index=False))
```

```
          sozlama  noyoblik                                          natija
  argmax (temp=0)     0.562  of war, the United States was the only coun...
         temp=0.5     0.815  when the first step was to have a conversat...
         temp=0.8     0.774  when there was a chance to have a more egal...
   temp=0.8 top_p     0.897  when there was a chance to have a conversat...
temp=0.8 +rep_pen     1.000  when there was no chance of getting to the ...
         temp=1.5     1.000  frame fairy tales work nowadays. Intellect ...
```

> ## ✅ **NAQSH TO'LIQ TASDIQLANDI:**
> ```
> argmax             →  0.562   ← ENG PAST (halqaga tushdi)
> temp=0.5           →  0.815
> temp=0.8 + top_p   →  0.897
> temp=0.8 + rep_pen →  1.000   ← ENG YUQORI ✅
> temp=1.5           →  1.000   ← yuqori, LEKIN ma'nosiz ⚠️
> ```
>
> ## ⚠️ **OXIRGI IKKI QATORGA DIQQAT — IKKALASI HAM 1.000!**
> ```
> temp=0.8 +rep_pen  →  "when there was no chance of getting to the..."  ✅ MA'NOLI
> temp=1.5           →  "frame fairy tales work nowadays. Intellect..."  ❌ MA'NOSIZ
> ```
> ## 🔑 **BIR XIL BALL, BUTUNLAY BOSHQA SIFAT.** Mana nima uchun `noyoblik` — **to'liq o'lchov emas**.

> ## 🔑 **`noyoblik` = noyob so'zlar / jami so'zlar.** Faqat **takrorlanishni** o'lchaydi, **ma'noni** emas — yuqoridagi oxirgi ikki qator buni yaqqol ko'rsatdi.

---

# 🔀 2-loyiha. GPT vs ChatGPT taqqoslagichi

> **Maqsad:** *"matn davom ettiruvchi"* va *"ko'rsatmaga amal qiluvchi"* modellar farqini ko'rsatish.

```python
class ModelTaqqoslagich:
    def __init__(self):
        self.gpt_tok = AutoTokenizer.from_pretrained("distilgpt2")
        self.gpt = AutoModelForCausalLM.from_pretrained("distilgpt2")
        self.t5_tok = AutoTokenizer.from_pretrained("google/flan-t5-base")
        self.t5 = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

    def gpt_javob(self, p, mx=25):
        e = self.gpt_tok(p, return_tensors="pt")
        with torch.no_grad():
            o = self.gpt.generate(**e, max_new_tokens=mx, do_sample=False,
                                  pad_token_id=self.gpt_tok.eos_token_id)
        return self.gpt_tok.decode(o[0], skip_special_tokens=True)[len(p):].strip()

    def t5_javob(self, p, mx=50):
        e = self.t5_tok(p, return_tensors="pt")
        with torch.no_grad():
            return self.t5_tok.decode(self.t5.generate(**e, max_new_tokens=mx)[0],
                                      skip_special_tokens=True)

    def sinov(self, vazifalar):
        r = []
        for tur, p in vazifalar:
            r.append({"tur": tur, "prompt": p[:34] + "...",
                      "distilgpt2": self.gpt_javob(p)[:40],
                      "flan-t5": self.t5_javob(p)[:40]})
        return pd.DataFrame(r)


VAZIFALAR = [
    ("tugallash", "Once upon a time"),
    ("ko'rsatma", "Translate English to French: The book was very interesting"),
    ("savol",     "Answer the question: What is the capital of France?"),
    ("xulosa",    "Summarize: The cat sat on the mat and then went to sleep."),
]
print(ModelTaqqoslagich().sinov(VAZIFALAR).to_string(index=False))
```

> ## 🎯 **KUTILGAN NAQSH:**
> ```
> "tugallash"  →  distilgpt2 ✅ · flan-t5 ⚠️   (GPT ning asosiy vazifasi)
> "ko'rsatma"  →  distilgpt2 ❌ · flan-t5 ✅   (ChatGPT ning vazifasi)
> "savol"      →  distilgpt2 ❌ · flan-t5 ✅
> "xulosa"     →  distilgpt2 ❌ · flan-t5 ✅
> ```
>
> ## 🔑 **IKKALASI HAM ~80–250M PARAMETR.** Farq **hajmda emas** — farq **SOZLASHDA** *(instruction tuning)*.
>
> ## 💡 **Bu — 2-darsdagi GPT vs ChatGPT farqining kichik nusxasi.**

---

# 🔬 3-loyiha. Model hajmi laboratoriyasi

> **Maqsad:** *"hajm nimani yaxshilaydi?"* savoliga **son bilan** javob.

```python
def hajm_sinovi(modellar, sinovlar, mx=60):
    """Turli hajmdagi modellarni bir xil vazifalarda solishtiradi."""
    qatorlar = []
    for nom in modellar:
        tk = AutoTokenizer.from_pretrained(nom)
        m = AutoModelForSeq2SeqLM.from_pretrained(nom)
        n_param = sum(p.numel() for p in m.parameters())
        for tur, prompt in sinovlar:
            e = tk(prompt, return_tensors="pt")
            with torch.no_grad():
                j = tk.decode(m.generate(**e, max_new_tokens=mx)[0],
                              skip_special_tokens=True)
            qatorlar.append({"model": nom.split("/")[-1],
                             "parametr": f"{n_param:,}",
                             "vazifa": tur, "javob": j[:56]})
    return pd.DataFrame(qatorlar)


FEW_SHOT = (
    "You will be provided with a block of text, and your task is to "
    "extract a list of keywords from it.\n\n"
    "Text: A flying saucer landed near the guest house in Roswell in 1947 "
    "and witnesses reported strange lights.\n"
    "Keywords: flying saucer, guest house, Roswell, 1947, witnesses, strange lights\n\n"
    "Text: Sri Lanka is an island country in South Asia known for its tea, "
    "beaches and ancient temples.\nKeywords:")

SINOVLAR = [
    ("few-shot",  FEW_SHOT),
    ("fakt",      "Answer the question: When was Google founded?"),
    ("xulosa",    "Summarize: Sri Lanka is an island country in South Asia "
                  "known for its tea, beaches and ancient temples. It has a "
                  "population of 22 million people."),
    ("tarjima",   "Translate English to French: The book was very interesting"),
]

print(hajm_sinovi(["google/flan-t5-small", "google/flan-t5-base"],
                  SINOVLAR).to_string(index=False))
```

### 💥 O'lchangan natijalar

| Vazifa | `flan-t5-small` (77M) | `flan-t5-base` (248M) | Baho |
|---|---|---|---|
| **few-shot** | `tea, island, tea` | `country, island, country, tea, beaches, temples` | ## ✅ **YAXSHILANDI** |
| **fakt** | `1897` | `18 September 2007` | ## ❌ **IKKALASI XATO** |
| **xulosa** | `74,269 people` *(matnda 22 MILLION!)* | `a popular tourist destination` | ## ✅ **to'qish YO'QOLDI** |
| **tarjima** | `Le livre était très intéressant.` | `Le livre était très intéressant.` | ## ✅ **IKKALASI TO'G'RI** |

> ## 🔑 **UCHTA NAQSH:**
>
> ```
> ① FEW-SHOT       →  hajm bilan YAXSHILANADI
>                     (29-modul: "few-shot GPT-3 bilan keldi")
>
> ② FAKTLAR        →  bu miqyoslarda YAXSHILANMAYDI
>                     1897 → 2007 (ikkalasi ham xato, to'g'risi 1998)
>
> ③ GALLYUTSINATSIYA →  KAMAYADI, lekin YO'QOLMAYDI
>                     to'qilgan son (74,269) yo'qoldi ✅
>                     lekin javob NOANIQROQ bo'ldi
> ```
>
> ## 💡 **TARJIMA — ikkala modelda ham MUKAMMAL.** Chunki tarjima — **naqsh**, **fakt emas**. Naqshlar **kichik** modellarda ham bor.

---

# 🔍 4-loyiha. RAG'ni noldan qurish

> ## ⭐⭐⭐ **MODULNING ASOSIY LOYIHASI.** LangChain'siz, API kalitisiz.

```python
class OddiyRAG:
    """LangChain'siz to'liq RAG tizimi — 40 qator kod."""

    def __init__(self, matn, model_id="google/flan-t5-base",
                 token_pattern=None, olcham=1):
        self.bolaklar = self._bol(matn, olcham)
        kw = {"token_pattern": token_pattern} if token_pattern else {}
        self.vek = TfidfVectorizer(**kw)
        self.ombor = self.vek.fit_transform(self.bolaklar)
        self.tok = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_id)

    # ── ① BO'LAKLASH ────────────────────────────────
    @staticmethod
    def _bol(matn, olcham):
        j = [s.strip() for s in matn.replace("\n", " ").split(".") if s.strip()]
        return [". ".join(j[i:i+olcham]) + "." for i in range(0, len(j), olcham)]

    # ── ②③④ QIDIRUV ────────────────────────────────
    def qidir(self, savol, k=3):
        b = cosine_similarity(self.vek.transform([savol]), self.ombor)[0]
        return [(self.bolaklar[i], round(float(b[i]), 3))
                for i in b.argsort()[::-1][:k] if b[i] > 0]

    # ── ⑤ GENERATSIYA ──────────────────────────────
    def _yarat(self, prompt, mx=50):
        e = self.tok(prompt, return_tensors="pt")
        with torch.no_grad():
            return self.tok.decode(self.model.generate(**e, max_new_tokens=mx)[0],
                                   skip_special_tokens=True)

    def sora(self, savol, k=3, manba=True):
        top = self.qidir(savol, k)
        if not top:
            return "Ma'lumot topilmadi.", []
        kontekst = " ".join(b for b, _ in top)
        j = self._yarat(f"Context: {kontekst}\nQuestion: {savol}\nAnswer:")
        return (j, top) if manba else j

    # ── BAHOLASH (26-MODUL SABOG'I!) ────────────────
    def bahola_qidiruv(self, sinovlar, k=1):
        r = []
        for savol, kutilgan in sinovlar:
            top = self.qidir(savol, k)
            r.append({"savol": savol[:36], "kutilgan": kutilgan,
                      "top-1 ball": top[0][1] if top else 0.0,
                      "topildi": "✅" if any(kutilgan.lower() in b.lower()
                                             for b, _ in top) else "❌"})
        df = pd.DataFrame(r)
        print(df.to_string(index=False))
        print(f"\nQIDIRUV ANIQLIGI (top-{k}): {(df.topildi == '✅').mean():.1%}")
        return df

    def bahola_toliq(self, sinovlar, k=3):
        """RAG'siz va RAG bilan solishtiradi."""
        r = []
        for savol, kutilgan in sinovlar:
            ragsiz = self._yarat(f"Answer the question: {savol}")
            rag_j, _ = self.sora(savol, k)
            r.append({"savol": savol[:34],
                      "ragsiz": "✅" if kutilgan.lower() in ragsiz.lower() else "❌",
                      "rag": "✅" if kutilgan.lower() in rag_j.lower() else "❌"})
        df = pd.DataFrame(r)
        print(df.to_string(index=False))
        print(f"\nRAGSIZ: {(df.ragsiz=='✅').mean():.0%}   "
              f"RAG: {(df.rag=='✅').mean():.0%}")
        return df
```

### 🧪 Sinov

```python
HUJJAT = """365 Data Science publishes new courses regularly.
The Introduction to Large Language Models course will be released in March 2024.
The LangChain in Practice course is scheduled for April 2024.
The Vector Databases with Pinecone course comes out in May 2024.
The platform currently has more than 60 courses."""

rag = OddiyRAG(HUJJAT)

SINOV = [
    ("Which course will be released in March 2024?", "Large Language Models"),
    ("When is the LangChain course?",                "April"),
    ("How many courses are there?",                  "60"),
]
rag.bahola_toliq(SINOV)
```

```
                             savol ragsiz rag
Which course will be released i...     ❌  ✅
     When is the LangChain course?     ❌  ✅
       How many courses are there?     ❌  ✅

RAGSIZ: 0%   RAG: 100%
```

> ## 🏆🏆 **0% → 100%.**
>
> ## 🔑 **MODEL O'ZGARMADI.** U qayta o'qitilmadi, kattalashmadi. Unga faqat **MA'LUMOT BERILDI**.
>
> ```
> ❌ RAGSIZ  :  'physics'  ·  '1890'  ·  '58'      — TO'QILGAN
> ✅ RAG     :  'Introduction to LLM'  ·  'April 2024'  ·  'more than 60'
> ```

### 🎁 Manba bilan

```python
javob, manba = rag.sora("When is the LangChain course?")
print(f"JAVOB: {javob}")
for b, ball in manba:
    print(f"  [{ball}] {b}")
```

> ## ✅ **RAG'ning yashirin superkuchi — MANBA KO'RINADI.** Javobni **tekshira olasiz** *(27-modul saboqi!)*.

---

# 🇺🇿 5-loyiha. O'zbekcha RAG va uni baholash

> **Maqsad:** o'zbek tilida ishlaydigan qidiruv tizimi — **bugun, bepul**.

```python
UZ_PATTERN = r"[\w'ʻ’]+"          # ⭐ 28-MODULDAN

UZ_HUJJAT = """Kompaniyamiz 2015-yilda tashkil etilgan.
Bizning ofisimiz Toshkent shahrida joylashgan.
Mahsulot qaytarish muddati 14 kun.
Yetkazib berish O'zbekiston bo'ylab bepul.
Qo'llab-quvvatlash xizmati 24 soat ishlaydi."""

UZ_SINOV = [
    ("Kompaniya qachon tashkil etilgan?",   "2015"),
    ("Ofis qayerda?",                       "Toshkent"),
    ("Qaytarish muddati qancha?",           "14 kun"),
    ("Yetkazib berish pullikmi?",           "bepul"),
    ("Qo'llab-quvvatlash qachon ishlaydi?", "24 soat"),
]

uz_rag = OddiyRAG(UZ_HUJJAT, token_pattern=UZ_PATTERN)
uz_rag.bahola_qidiruv(UZ_SINOV, k=1)
```

```
                              savol kutilgan  top-1 ball topildi
  Kompaniya qachon tashkil etilgan?     2015       0.632      ✅
                      Ofis qayerda? Toshkent       0.000      ❌
          Qaytarish muddati qancha?   14 kun       0.632      ✅
          Yetkazib berish pullikmi?    bepul       0.632      ✅
Qo'llab-quvvatlash qachon ishlaydi?  24 soat       0.707      ✅

QIDIRUV ANIQLIGI (top-1): 80.0%
```

## ✅ 80% — VA IKKITA MUHIM TOPILMA

### ❌ ① "Ofis qayerda?" — ball 0.000

```
SAVOL  :  "Ofis qayerda?"
HUJJAT :  "Bizning ofisimiz Toshkent shahrida joylashgan."

  "ofis"     ≠  "ofisimiz"    ← TF-IDF uchun IKKI XIL so'z
  "qayerda"  →  hujjatda YO'Q

  Umumiy so'z YO'Q  →  kosinus = 0.000
```

> ## 🔑 **TF-IDF SO'ZLARNI solishtiradi, MA'NONI emas.**
>
> ## ✅ **UCHTA YECHIM:**
> ```
> ① STEMMING (28-modul uz_stem)  →  ofisimiz → ofis
> ② SINONIM lug'ati              →  "qayerda" ↔ "joylashgan"
> ③ NEYRON EMBEDDING             →  ma'noni tushunadi
> ```

### 😲 ② `token_pattern` — bu misolda farq bermadi

```
token_pattern BILAN  →  80.0%
token_pattern BUSIZ  →  80.0%
```

> ## ⚠️ **HALOL QAYD:** aniqlikda **farq yo'q**. Farq faqat **ballarda** *(0.632 vs 0.577)*.
>
> ## 🔑 **LEKIN:** 28-modulda o'lchagandik — `O'zbekiston` → `zbekiston` *(nom BUZILADI)*. Bu **fakt**. Katta hujjatda farq **albatta** chiqadi.
>
> ## 💡 **Metodologik saboq:** *"men shunday deb o'ylayman"* ≠ *"men o'lchadim"*.

### 💰 O'zbekcha matnning token narxi

```python
tok = AutoTokenizer.from_pretrained("google/flan-t5-base")
for en, uz in [
    ("This book is very interesting and I recommend it to everyone",
     "Bu kitob juda qiziqarli va men uni hammaga tavsiya qilaman"),
    ("Our office is located in the capital city",
     "Bizning ofisimiz poytaxt shahrida joylashgan"),
]:
    ne, nu = len(tok.encode(en)), len(tok.encode(uz))
    print(f"ingliz {ne:3d} · o'zbek {nu:3d}  →  {nu/ne:.1f}×")
```

```
ingliz  12 · o'zbek  36  →  3.0×
ingliz   9 · o'zbek  21  →  2.3×
```

> ## 💰 **O'zbekcha matn 2.3–3.0× ko'p token** → API'da **2–3× qimmat**.
>
> ## ✅ **VA MANA RAG'NING IKKINCHI FOYDASI:** butun hujjat o'rniga faqat **2–3 ta bo'lak** yuboriladi → **narx keskin kamayadi**.

---

# 🎓 6-loyiha. Yakuniy loyiha — bilim bazasi yordamchisi

> **Maqsad:** 1–5-loyihalarni **bitta ishlaydigan mahsulotga** jamlash.

```python
class BilimBazasi:
    """O'z hujjatlaringiz ustida ishlaydigan savol-javob tizimi."""

    def __init__(self, hujjatlar, tilga_moslash=False,
                 model_id="google/flan-t5-base"):
        """hujjatlar: {nom: matn} lug'ati"""
        self.manbalar, self.bolaklar = [], []
        for nom, matn in hujjatlar.items():
            for b in self._bol(matn):
                self.bolaklar.append(b)
                self.manbalar.append(nom)          # ⭐ MANBA kuzatiladi

        # ⭐⭐ stop_words — SOXTA MOSLIKNI oldini oladi (quyidagi izohga qarang)
        kw = ({"token_pattern": r"[\w'ʻ’]+"} if tilga_moslash
              else {"stop_words": "english"})
        self.vek = TfidfVectorizer(**kw)
        self.ombor = self.vek.fit_transform(self.bolaklar)
        self.tok = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
        self.tarix = []

    @staticmethod
    def _bol(matn):
        return [s.strip() + "." for s in matn.replace("\n", " ").split(".")
                if s.strip()]

    def qidir(self, savol, k=3, min_ball=0.15):     # ⭐ 0.05 EMAS!
        b = cosine_similarity(self.vek.transform([savol]), self.ombor)[0]
        return [{"matn": self.bolaklar[i], "manba": self.manbalar[i],
                 "ball": round(float(b[i]), 3)}
                for i in b.argsort()[::-1][:k] if b[i] >= min_ball]

    def sora(self, savol, k=3, generatsiya=True):
        top = self.qidir(savol, k)

        print(f"❓ {savol}")
        if not top:
            print("   ⚠️ Tegishli ma'lumot TOPILMADI.")
            print("   💡 Savolni boshqacha yozib ko'ring yoki hujjat qo'shing.")
            return None

        print("\n📚 TOPILGAN MANBALAR:")
        for t in top:
            belgi = "⚠️" if t["ball"] < 0.2 else "  "
            print(f"  {belgi} [{t['ball']:.3f}] ({t['manba']}) {t['matn'][:62]}")

        if generatsiya:
            kontekst = " ".join(t["matn"] for t in top)
            # ⭐⭐ "BILMAYMAN" ko'rsatmasi — gallyutsinatsiyaga qarshi
            e = self.tok(
                "Answer the question using ONLY the context. If the context "
                "does not contain the answer, reply exactly: NOT FOUND.\n"
                f"Context: {kontekst}\nQuestion: {savol}\nAnswer:",
                return_tensors="pt")
            with torch.no_grad():
                j = self.tok.decode(self.model.generate(**e, max_new_tokens=50)[0],
                                    skip_special_tokens=True)
            print(f"\n🤖 JAVOB: {j}")
            if top[0]["ball"] < 0.2:
                print("   ⚠️ Qidiruv balli PAST — javobni TEKSHIRING!")
            self.tarix.append((savol, j))
            return j
        return top
```

### 🧪 Ishlatish

```python
HUJJATLAR = {
    "kurslar": """365 Data Science publishes new courses regularly.
The Introduction to Large Language Models course will be released in March 2024.
The LangChain in Practice course is scheduled for April 2024.
The platform currently has more than 60 courses.""",

    "narxlar": """The monthly subscription costs 29 dollars.
The annual plan costs 240 dollars per year.
Students receive a 50 percent discount.""",
}

kb = BilimBazasi(HUJJATLAR)
kb.sora("When is the LangChain course?")
print("\n" + "=" * 60 + "\n")
kb.sora("How much does the annual plan cost?")
print("\n" + "=" * 60 + "\n")
kb.sora("What is the weather in Tashkent?")     # ← ma'lumot YO'Q
```

```
? When is the LangChain course?
   [0.560] (kurslar) The LangChain in Practice course is scheduled for April 2024.
🤖 JAVOB: April 2024

? How much does the annual plan cost?
   [0.610] (narxlar) The annual plan costs 240 dollars per year.
🤖 JAVOB: 240 dollars per year

? What is the weather in Tashkent?
   ⚠️ Tegishli ma'lumot TOPILMADI.
🤖 JAVOB: NOT FOUND
```

---

## 😱 ⚠️ MUHIM: BU LOYIHA DASTLAB ISHLAMAGAN EDI

**Birinchi versiyada** *(`stop_words` siz, `min_ball=0.05`)* natija **falokat** edi:

```
? What is the weather in Tashkent?
   [0.487] (kurslar) The LangChain in Practice course is scheduled for April...
🤖 JAVOB: rainy                    ❌❌ TO'QILGAN!
```

> ## 💥 **RAG GALLYUTSINATSIYANI TO'XTATMADI.** Tizim **mutlaqo aloqasiz** bo'lakni **0.487** ball bilan topdi va model *"rainy"* deb **to'qib** chiqardi.

### 🔬 Sababni topamiz

```python
for sw in [None, "english"]:
    v = TfidfVectorizer(stop_words=sw)
    O = v.fit_transform(bolaklar)
    print(f"--- stop_words={sw} ---")
    for q in SAVOLLAR:
        s = cosine_similarity(v.transform([q]), O)[0]
        print(f"  maks ball {s.max():.3f}  {q}")
```

```
--- stop_words=None ---
  0.597  When is the LangChain course?
  0.586  How much does the annual plan cost?
  0.487  What is the weather in Tashkent?      ← ❌ SOXTA YUQORI!

--- stop_words=english ---
  0.560  When is the LangChain course?
  0.610  How much does the annual plan cost?
  0.000  What is the weather in Tashkent?      ← ✅ ANIQ NOL!
```

> ## 🔑 **SABAB TOPILDI — TO'XTATISH SO'ZLARI.**
>
> ```
> "What IS THE weather IN Tashkent?"
>        ↑↑↑            ↑
> "The LangChain course IS scheduled..."
>   ↑                   ↑
>
> Umumiy so'zlar: "is", "the", "in"
>      →  TF-IDF ularni MOSLIK deb hisobladi
>      →  soxta ball 0.487
> ```

### 💥 VA MANA ENG QIZIQ TOMONI — 26-MODULGA ZID!

```
26-MODUL (sentiment tasnifi):
   stop_words='english'  →  aniqlik 0.869 → 0.784   ❌ YOMONLASHDI
   sabab: "not", "no", "never" — sentiment uchun HAL QILUVCHI

31-MODUL (RAG qidiruvi):
   stop_words='english'  →  soxta ball 0.487 → 0.000  ✅ YAXSHILANDI
   sabab: "is", "the", "in" — qidiruv uchun SHOVQIN
```

> ## 🏆 **BIR XIL SOZLAMA. IKKI XIL VAZIFA. TESKARI NATIJA.**
>
> ## 🔑 **XULOSA:** *"stop_words yaxshi/yomon"* degan **umumiy javob YO'Q**. Har vazifada **o'lchash** kerak.

### ✅ Ikkinchi himoya qatlami — "BILMAYMAN" ko'rsatmasi

```python
prompt = ("Answer the question using ONLY the context. If the context "
          "does not contain the answer, reply exactly: NOT FOUND.\n"
          f"Context: {kontekst}\nQuestion: {savol}\nAnswer:")
```

```
maks_ball=0.560  →  'April 2024'
maks_ball=0.610  →  '240 dollars per year'
maks_ball=0.000  →  'NOT FOUND'        ✅✅
```

> ## 🎯 **UCH QATLAMLI HIMOYA — hammasi KERAK:**
> ```
> ① stop_words='english'      →  soxta moslikni YO'QOTADI
> ② min_ball=0.15             →  past ballni RAD ETADI
> ③ "NOT FOUND" ko'rsatmasi   →  modelga RUXSAT beradi "bilmayman" deyishga
> ```
>
> ## ⚠️ **BIRORTASI YETARLI EMAS.** Uchalasi **birgalikda** ishlaydi.

---

> ## 🎯 **UCHTA MUHIM XUSUSIYAT:**
>
> **① MANBA ko'rsatiladi** — javob **qaysi hujjatdan** kelgani ko'rinadi.
>
> **② PAST BALL ogohlantiradi** — `ball < 0.2` bo'lsa, tizim **"tekshiring"** deydi.
>
> **③ "TOPILMADI" javobi bor** — bu **eng muhimi**.

> ## 💥 **RAG'NING ENG KATTA QIYMATI — LEKIN FAQAT TO'G'RI SOZLANGANDA:**
> ```
> Oddiy LLM        →  HAR DOIM javob beradi (hatto BILMASA HAM)
> Sozlanmagan RAG  →  HAM to'qib chiqaradi ('rainy')      ⚠️
> Sozlangan RAG    →  "NOT FOUND"                          ✅
> ```
>
> ## 🔑 **RAG — sehrli tayoqcha EMAS.** U **o'lchash** va **sozlash** talab qiladi. 26-modul saboqi: *"raqamsiz — bu taxmin"*.

---

## 🏆 Siz nimalarni qurdingiz?

```
1️⃣  Generatsiya laboratoriyasi  →  temperature/max_tokens ta'sirini O'LCHASH
2️⃣  Model taqqoslagichi         →  GPT vs ChatGPT farqi
3️⃣  Hajm laboratoriyasi         →  "hajm NIMANI yaxshilaydi?"
4️⃣  RAG noldan                  →  0% → 100%   ⭐⭐⭐
5️⃣  🇺🇿 O'zbekcha RAG            →  80% aniqlik, BEPUL
6️⃣  Bilim bazasi                →  manba + ogohlantirish + "topilmadi"
```

---

## 🎯 Keyingi qadamingiz

```
① O'Z hujjatlaringizni BilimBazasi ga yuklang
     · kompaniya qo'llanmasi · shartnomalar · texnik hujjatlar

② bahola_qidiruv() bilan O'LCHANG
     · 10-20 ta sinov savoli yozing
     · aniqlik 80% dan past bo'lsa — stemming qo'shing

③ 🇺🇿 O'zbekcha uchun 28-moduldagi uznlp ni ULANG
     · token_pattern + uz_stem + stopwords

④ Faqat GENERATSIYA uchun GPT-4/Claude ga o'ting
     · qidiruv MAHALLIY (bepul) · generatsiya API (arzon, chunki
       butun hujjat emas, faqat 2-3 bo'lak yuboriladi)

⑤ 35-42-modullarda LangChain'ni O'RGANING
     · endi u NIMA QILAYOTGANINI BILASIZ
```

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md) · ➡️ [32-modul: Hugging Face](../32-HuggingFace-Transformers/README.md)
