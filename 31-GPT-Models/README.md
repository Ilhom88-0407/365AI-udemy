# 🤖 31-modul. GPT modellari bilan ishlash

> **Getting Started With GPT Models** — nazariya tugadi, endi **amaliyot**.
>
> ## ⭐⭐ **BU DARSLIKDA HAMMA NARSA API KALITISIZ, BEPUL ishlaydi.**

---

## ⚠️ Bu modul bo'yicha ikkita muhim ogohlantirish

### ① Kursdagi kod ESKIRGAN

```
openai.Completion.create(model="text-davinci-002", ...)
        ↑                          ↑
   v1.0 da OLIB TASHLANDI     2024-yanvarda YOPILDI
```

### ② Kurs PULLIK API talab qiladi

> ## ✅ **YECHIM — har bir dars uchun UCHTA variant:**
> ```
> ① Kursdagi kod           →  o'qituvchi ko'rsatgani (ESKIRGAN)
> ② Zamonaviy OpenAI kodi  →  bugungi to'g'ri sintaksis (pullik)
> ③ BEPUL MAHALLIY MUQOBIL →  o'z kompyuteringizda, PULSIZ  ⭐
> ```

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [GPT nima degani?](01-What-does-GPT-mean.md) | G-P-T uchala harfi |
| 2 | [ChatGPT rivojlanishi](02-The-Development-of-ChatGPT.md) | 2018–2023 xronologiya |
| 3 | [OpenAI API](03-OpenAI-API.md) ⚠️ | Kalit xavfsizligi, ⭐ **bepul muqobil** |
| 4 | [Matn yaratish](04-Generating-Text.md) | Prompt, `generate()` |
| 5 | [Natijani sozlash](05-Customizing-GPT-Output.md) ⭐ | `temperature`, `max_tokens` |
| 6 | [Kalit so'zlar bilan xulosalash](06-Keyword-Text-Summarization.md) ⭐⭐ | **Uchta rol**, few-shot |
| 7 | [Oddiy chatbot](07-Coding-a-Simple-Chatbot.md) | Shaxsiyat berish |
| 8 | [LangChain'ga kirish](08-Introduction-to-LangChain.md) | **Muammo** |
| 9 | [LangChain nima?](09-LangChain.md) | RAG quvuri |
| 10 | [O'z ma'lumotingizni qo'shish](10-Adding-Custom-Data.md) ⭐⭐⭐ | ## **RAG NOLDAN** |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**42 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**6 ta mini-loyiha**](LOYIHALAR.md) | Generatsiya labi · model taqqoslagichi · hajm labi · **RAG noldan** · 🇺🇿 o'zbekcha RAG · bilim bazasi |

---

## 🔥 Modulning bosh natijasi — RAG

**8-darsda** model uchta savolga **uchta yolg'on** aytdi. **10-darsda** — uchtasi ham **to'g'ri**:

```
SAVOL                          ❌ RAGSIZ     ✅ RAG BILAN
──────────────────────────────────────────────────────────────────
Which course in March 2024?    'physics'     'Introduction to LLM'
When is the LangChain course?  '1890'        'April 2024'
How many courses are there?    '58'          'more than 60'

                    RAGSIZ: 0%      RAG: 100%
```

> ## 🔑 **MODEL O'ZGARMADI.** U qayta o'qitilmadi, kattalashmadi.
> ## **Unga faqat MA'LUMOT BERILDI.**
>
> ```
> 29-modul: "Ko'proq MA'LUMOT > aqlliroq ALGORITM"
>                 ↑
>       MANA UNING ENG SOF NAMUNASI
> ```

---

## 🗺️ RAG quvuri

![RAG quvuri](assets/04-rag-pipeline.svg)

### LangChain'ning 5 ta sinfi → 20 qator kod

| LangChain | Bizniki |
|---|---|
| `WebBaseLoader` | oddiy matn o'zgaruvchisi |
| `RecursiveCharacterTextSplitter` | `bolaklarga_bol()` |
| `OpenAIEmbeddings` | ## **`TfidfVectorizer()`** ← 24-modul! |
| `FAISS` | `cosine_similarity()` |
| `ConversationalRetrievalChain` | `rag()` |

> ## 💡 **RAG — yangi texnologiya emas.** Bu — **TF-IDF** *(24-modul)* va **transformer** *(30-modul)* ning **yangi tarzda birlashuvi**.

---

## ⚠️⚠️ Eng muhim topilma — RAG SEHRLI TAYOQCHA EMAS

Birinchi versiyamiz **ishlamadi**:

```
SAVOL  : "What is the weather in Tashkent?"   (hujjatda ob-havo YO'Q)
JAVOB  : 'rainy'                               ❌❌ TO'QILGAN
BALL   : 0.487                                 ❌ soxta yuqori
```

**Sabab — to'xtatish so'zlari:**

```
"What IS THE weather IN Tashkent?"     ↔     "The LangChain course IS scheduled..."
       ↑↑↑            ↑                        ↑                   ↑
                  umumiy so'zlar  →  soxta moslik 0.487
```

**Yechim — uch qatlamli himoya:**

```
① stop_words='english'      →  0.487 → 0.000  ✅
② min_ball=0.15             →  past ballni rad etadi
③ "NOT FOUND" ko'rsatmasi   →  modelga "bilmayman" deyishga RUXSAT
```

### 💥 Va bu 26-MODULGA ZID

```
26-MODUL (sentiment):   stop_words='english'  →  0.869 → 0.784   ❌ YOMONLASHDI
31-MODUL (RAG qidiruv): stop_words='english'  →  0.487 → 0.000   ✅ YAXSHILANDI
```

> ## 🏆 **BIR XIL SOZLAMA. IKKI XIL VAZIFA. TESKARI NATIJA.**
>
> ## 🔑 *"stop_words yaxshi/yomon"* degan **umumiy javob YO'Q**. Har vazifada **o'lchang**.

---

## 🇺🇿 O'zbekcha RAG — BUGUN ishlaydi

```
                              savol kutilgan  top-1 ball topildi
  Kompaniya qachon tashkil etilgan?     2015       0.632      ✅
                      Ofis qayerda? Toshkent       0.000      ❌
          Qaytarish muddati qancha?   14 kun       0.632      ✅
          Yetkazib berish pullikmi?    bepul       0.632      ✅
Qo'llab-quvvatlash qachon ishlaydi?  24 soat       0.707      ✅

QIDIRUV ANIQLIGI: 80.0%
```

> ## ✅ **QIDIRUV O'ZBEKCHADA ISHLAYDI** — chunki `sklearn` **tildan mustaqil** *(28-modul)*.
>
> ## ❌ **"Ofis qayerda?" — 0.000.** Sabab: `ofis` ≠ `ofisimiz`, va `qayerda` hujjatda **yo'q**.
> ## 🔑 **TF-IDF SO'ZLARNI solishtiradi, MA'NONI emas.** Yechim: **stemming** *(28-modul `uz_stem`)*.

### 💰 O'zbekcha matnning narxi

```
ingliz  12 token · o'zbek  36 token  →  3.0×
ingliz   9 token · o'zbek  21 token  →  2.3×
```

> ## 💡 **RAG bu narxni ham kamaytiradi** — butun hujjat o'rniga faqat **2–3 ta bo'lak** yuboriladi.

---

## 📊 Model hajmi nimani yaxshilaydi?

| Vazifa | `flan-t5-small` (77M) | `flan-t5-base` (248M) |
|---|---|---|
| **Tarjima** | `Le livre était très intéressant.` | ## ✅ **bir xil — MUKAMMAL** |
| **Few-shot** | `tea, island, tea` *(2 ta)* | ## ✅ **6 ta kalit so'z** |
| **Xulosa** | `74,269 people` *(matnda 22 MILLION!)* | ✅ to'qish **yo'qoldi** |
| **Fakt** | Google → `1897` | ## ❌ **`18 September 2007`** *(to'g'risi 1998)* |

> ## 🔑 **UCHTA NAQSH:**
> ```
> ① NAQSHLAR (tarjima)  →  kichik modelda HAM bor
> ② FEW-SHOT            →  hajm bilan YAXSHILANADI
>                          (29-modul: "few-shot GPT-3 bilan keldi")
> ③ FAKTLAR             →  bu miqyoslarda YAXSHILANMAYDI
>                          ✅ yechim — RAG
> ```

### ⚠️ Va eng xavfli naqsh

```
kichik model  →  '1897'                    ochiqchasi yomon  →  ISHONMAYSIZ  ✅
katta model   →  "in 1808 by James Madison, a distiller who grew up in
                  the Highlands of Scotland"
                         ↑
                 RAVON, BATAFSIL — va UCHTA FAKT XATO
                 →  ALDANISHINGIZ mumkin  ⚠️
```

> ## 💥 **RAVONLIK ≠ TO'G'RILIK.** Hajm ravonlikni oshiradi, to'g'rilikni esa **kafolatlamaydi**.

---

## 🚀 Tez boshlash — RAG 20 qatorda

```bash
pip install transformers torch scikit-learn
```

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

tok = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

HUJJAT = """The LangChain in Practice course is scheduled for April 2024.
The platform currently has more than 60 courses."""

bolaklar = [s.strip() + "." for s in HUJJAT.replace("\n", " ").split(".") if s.strip()]
vek = TfidfVectorizer(stop_words="english")
OMBOR = vek.fit_transform(bolaklar)

def rag(savol, k=2, min_ball=0.15):
    b = cosine_similarity(vek.transform([savol]), OMBOR)[0]
    top = [bolaklar[i] for i in b.argsort()[::-1][:k] if b[i] >= min_ball]
    if not top:
        return "NOT FOUND"
    p = ("Answer using ONLY the context. If not present, reply: NOT FOUND.\n"
         f"Context: {' '.join(top)}\nQuestion: {savol}\nAnswer:")
    e = tok(p, return_tensors="pt")
    with torch.no_grad():
        return tok.decode(model.generate(**e, max_new_tokens=40)[0],
                          skip_special_tokens=True)

print(rag("When is the LangChain course?"))
print(rag("What is the weather in Tashkent?"))
```

```
April 2024
NOT FOUND
```

---

## ✅ O'zingizni tekshiring

- [ ] GPT ning uchala harfini kodda isbotlay olasizmi?
- [ ] Kursdagi eskirgan kodni yangilay olasizmi?
- [ ] `temperature` ni matematik tushuntira olasizmi?
- [ ] Uchta rolni *(`system`/`user`/`assistant`)* bilasizmi?
- [ ] Few-shot nima uchun kichik modelda ishlamasligini bilasizmi?
- [ ] RAG'ni **noldan** qura olasizmi?
- [ ] RAG'ni **baholay** olasizmi *(raqam bilan)*?
- [ ] 🇺🇿 O'zbekcha RAG qura olasizmi?

---

## 🔗 Boshqa modullar bilan bog'liqlik

```
24-modul  TF-IDF        →  ⭐ RAG ning EMBEDDING qadami
26-modul  stop_words    →  ⭐ TESKARI natija (0.869→0.784 vs 0.487→0.000)
27-modul  tekshirish    →  RAG MANBA ko'rsatadi → tekshirish MUMKIN
28-modul  🇺🇿 uznlp      →  token_pattern + stemming
29-modul  few-shot      →  "GPT-3 bilan keldi" — biz buni O'LCHADIK
30-modul  transformer   →  temperature = softmax(logits/T)
```

---

## ➡️ Keyingi qadam

**[32-modul — Hugging Face Transformers](../32-HuggingFace-Transformers/README.md)**: siz bu modulda `transformers` paketidan **allaqachon** foydalandingiz. Endi uni **tizimli** o'rganamiz.

---

⬅️ [30-modul — Transformer arxitekturasi](../30-Transformer-Architecture/README.md) · 🏠 [Bosh sahifa](../README.md) · ➡️ [32-modul](../32-HuggingFace-Transformers/README.md)
