# 📝 35-modul mashqlari

> **34 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **BU MODUL — NAZARIY.** Mashqlar **muhitni tekshirish** va **arxitektura o'ylash** ga qaratilgan.

## ⚙️ Tayyorgarlik

```bash
pip install langchain langchain-core langchain-openai langchain-community
pip install langchain-text-splitters langchain-chroma tiktoken
```

> ## 💡 **API kaliti KERAK EMAS** — bu modulning hamma mashqi **kalitsiz** bajariladi.

```python
import warnings; warnings.filterwarnings("ignore")
import re, importlib, inspect
```

---

# 🟢 OSON *(1–11)*

**M1.** LangChain — model, freymvork yoki API?

**M2.** Uchta asosiy xususiyat qaysilar?

**M3.** GPT-2 va GPT-3 nechta parametrga ega?

**M4.** GPT-4 nechta parametrga ega?

**M5.** Chat-model va base model farqi?

**M6.** LLM nima uchun "stateless"?

<details>
<summary>✅ Javoblar M1–M6</summary>

**M1.** ## **Freymvork** *(adapter)*. U hech narsa **hisoblamaydi**.

**M2.** ## **Stateful** · **context-aware** · **reasoning**.

**M3.** GPT-2 — **1.5 mlrd** *(40 GB)*. GPT-3 — **175 mlrd** *(570 GB)*.

**M4.** ## **NOMA'LUM** — OpenAI rasman **e'lon qilmagan**. Internetdagi raqamlar — **taxmin**.

**M5.** Chat-model = base model + **instruction tuning** + **RLHF**.

**M6.** Har API chaqiruvi **mustaqil**. "Xotira" — dastur tarixni **qayta yuboradi**.

</details>

**M7.** Ally Financial qanday muammoni hal qildi?

**M8.** Adyen qaysi texnikadan foydalandi?

**M9.** LangSmith nima uchun?

**M10.** `Document` obyektida nechta maydon bor?

**M11.** `langchain.memory` bugun mavjudmi?

<details>
<summary>✅ Javoblar M7–M11</summary>

**M7.** Suhbatni **qo'lda hisobot qilish**. LLM avtomatik xulosalaydi, PII **maskalanadi**.

**M8.** ## **RAG** — chipta yo'naltirish va javob tayyorlash uchun.

**M9.** **Kuzatuv** *(observability)* — zanjir ichida nima bo'layotganini ko'rish.

**M10.** ## **Ikkita** — `page_content` va `metadata`.

**M11.** ## ❌ **Yo'q** — `ModuleNotFoundError`. `langchain-classic` ga ko'chirilgan.

</details>

---

# 🟡 O'RTA *(12–25)*

**M12.** ⭐⭐ Qaysi kurs importlari ishlashini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
TEKSHIRUV = [
    ("langchain.chains", "LLMChain"),
    ("langchain.memory", "ConversationBufferMemory"),
    ("langchain.output_parsers", "DatetimeOutputParser"),
    ("langchain.agents", "AgentExecutor"),
    ("langchain.chat_models", "ChatOpenAI"),
    ("langchain_openai", "ChatOpenAI"),
    ("langchain_core.prompts", "ChatPromptTemplate"),
    ("langchain_core.runnables", "RunnablePassthrough"),
    ("langchain_text_splitters", "RecursiveCharacterTextSplitter"),
    ("langchain_chroma", "Chroma"),
]
for mod, nom in TEKSHIRUV:
    try:
        m = importlib.import_module(mod)
        print(f"{'✅' if hasattr(m, nom) else '⚠️ '}  {mod}.{nom}")
    except ModuleNotFoundError:
        print(f"❌  {mod}.{nom}   (modul YO'Q)")
```

Bizning natija *(langchain 1.3.17)*:
```
❌  langchain.chains.LLMChain                      (modul YO'Q)
❌  langchain.memory.ConversationBufferMemory      (modul YO'Q)
❌  langchain.output_parsers.DatetimeOutputParser  (modul YO'Q)
⚠️   langchain.agents.AgentExecutor
⚠️   langchain.chat_models.ChatOpenAI
✅  langchain_openai.ChatOpenAI
✅  langchain_core.prompts.ChatPromptTemplate
✅  langchain_core.runnables.RunnablePassthrough
✅  langchain_text_splitters.RecursiveCharacterTextSplitter
✅  langchain_chroma.Chroma
```

## 🏆 **BU SKRIPTNI SAQLANG** — har yangi versiyada qayta ishga tushiring.

</details>

**M13.** ⭐ O'rnatilgan versiyalarni chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
for p in ["langchain", "langchain_core", "langchain_openai",
          "langchain_community", "langchain_text_splitters"]:
    try:
        m = importlib.import_module(p)
        print(f"{p:26s} {getattr(m, '__version__', '?')}")
    except Exception:
        print(f"{p:26s} o'rnatilmagan")
```

## ⚠️ **`langchain` versiyasi `1.x` bo'lsa — kursning eski kodi ishlamaydi.**

</details>

**M14.** ⭐ `langchain.agents` ichida nima bor?

<details>
<summary>✅ Yechim</summary>

```python
import langchain.agents as A
print([x for x in dir(A) if not x.startswith("_")])
```

```
['AgentState', 'create_agent', 'factory', 'middleware', 'structured_output']
```

## 💥 **`AgentExecutor` YO'Q.** O'rniga — ## **`create_agent`**, u **LangGraph** ustiga qurilgan *(43–47-modul)*.

</details>

**M15.** ⭐⭐ Oddiy PII maskalagich yozing.

<details>
<summary>✅ Yechim</summary>

```python
NAQSHLAR = {
    "EMAIL":   r"\b[\w.+-]+@[\w-]+\.[\w.]+\b",
    "KARTA":   r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",
    "TELEFON": r"(?:\+998|998)?[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}",
    "INN":     r"\b\d{9}\b",
}

def maskala(matn):
    xarita = {}
    for nom, naqsh in NAQSHLAR.items():
        for i, m in enumerate(sorted(set(re.findall(naqsh, matn)),
                                     key=len, reverse=True)):
            if m.strip():
                k = f"<{nom}_{i}>"
                xarita[k] = m
                matn = matn.replace(m, k)
    return matn, xarita

def qayta_tikla(matn, xarita):
    for k, v in xarita.items():
        matn = matn.replace(k, v)
    return matn

t = ("Mijoz: Alisher Karimov, pochta a.karimov@mail.uz, "
     "karta 4276 1234 5678 9012, tel +998 90 123 45 67, INN 123456789")
m, x = maskala(t)
print("MASKALANGAN:", m)
print("TIKLANGAN  :", qayta_tikla(m, x))
```

**Haqiqiy natija:**
```
MASKALANGAN: Mijoz: Alisher Karimov, pochta <EMAIL_0>, karta <KARTA_0>,
             tel <TELEFON_0>, INN<TELEFON_1>
TIKLANGAN  : Mijoz: Alisher Karimov, pochta a.karimov@mail.uz, karta 4276
             1234 5678 9012, tel +998 90 123 45 67, INN 123456789
```

## 💥💥 **IKKITA XATO DARHOL KO'RINDI — VA IKKALASI HAM SABOQ:**
```
① "Alisher Karimov" MASKALANMADI
   → ismlar uchun NAQSH yetarli emas, NER kerak (M20)

② INN telefon deb TOPILDI  →  <TELEFON_1> = ' 123456789'
   → TELEFON naqshi juda KENG, u INN ni "yutib" yubordi
```

## ✅ **② NI TUZATISH — TARTIBNI O'ZGARTIRING:** `INN` ni `TELEFON` dan **oldin** qo'ying, yoki `TELEFON` naqshiga `\+998` ni **majburiy** qiling.

## 🔑 **QOIDA:** naqshlarni **eng aniqdan eng kengga** tartiblang.

</details>

**M16.** ⭐ Tartib xatosini tuzating.

<details>
<summary>✅ Yechim</summary>

```python
NAQSHLAR_TUZATILGAN = {                 # ⭐ TARTIB MUHIM: aniqdan kengga
    "KARTA":   r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",
    "EMAIL":   r"\b[\w.+-]+@[\w-]+\.[\w.]+\b",
    "TELEFON": r"\+998[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}",  # +998 SHART
    "INN":     r"\b\d{9}\b",
}
```

Endi `INN 123456789` **to'g'ri** `<INN_0>` bo'ladi.

## 🔑 **`+998` ni majburiy qilish — "kengroq topish" dan ko'ra "aniqroq topish" ni tanlash.** Xavfsizlikda ba'zan **teskarisi** kerak — 6-mashqga qarang.

</details>

**M17.** ⭐ Xotira narxini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
def suhbat_narxi(n_xabar, o_rt_token=60, narx_1m=0.15):
    jami = sum((i + 1) * o_rt_token for i in range(n_xabar))
    return jami, jami / 1_000_000 * narx_1m

for n in [5, 20, 50, 100]:
    t, p = suhbat_narxi(n)
    print(f"{n:4d} xabar → {t:8,} token → ${p:.4f}")
```

```
   5 xabar →      900 token → $0.0001
  20 xabar →   12,600 token → $0.0019
  50 xabar →   76,500 token → $0.0115
 100 xabar →  303,000 token → $0.0455
```

## 💥 **NARX `O(n²)`.** 100 xabar 5 xabardan **336×** qimmat.

</details>

**M18.** ⭐ `window` xotirasi narxini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def window_narxi(n_xabar, oyna=6, o_rt_token=60, narx_1m=0.15):
    jami = sum(min(i + 1, oyna) * o_rt_token for i in range(n_xabar))
    return jami, jami / 1_000_000 * narx_1m

for n in [5, 20, 50, 100]:
    tb, pb = suhbat_narxi(n)
    tw, pw = window_narxi(n)
    print(f"{n:4d} xabar  buffer {tb:8,}  window {tw:7,}  "
          f"tejash {(1 - tw/tb):.0%}")
```

## 🔑 **`window` — CHIZIQLI o'sish.** 100 xabarda **~88% tejash**.
## ⚠️ **Narxi:** bot 7-xabardan oldingi hamma narsani **unutadi**.

</details>

**M19.** ⭐ Har provayder uchun import satrini yozing.

<details>
<summary>✅ Yechim</summary>

```python
PROVAYDERLAR = {
    "OpenAI":    ("langchain_openai",      "ChatOpenAI",           "gpt-4o-mini"),
    "Anthropic": ("langchain_anthropic",   "ChatAnthropic",        "claude-sonnet-4-5"),
    "Google":    ("langchain_google_genai","ChatGoogleGenerativeAI","gemini-2.0-flash"),
    "Ollama":    ("langchain_ollama",      "ChatOllama",           "qwen2.5"),
    "HF":        ("langchain_huggingface", "HuggingFacePipeline",  "Qwen/Qwen2.5-1.5B-Instruct"),
}
for nom, (paket, sinf, model) in PROVAYDERLAR.items():
    holat = "✅" if importlib.util.find_spec(paket) else "❌ o'rnatilmagan"
    print(f"{nom:10s} {holat:16s} from {paket} import {sinf}")
```

</details>

**M20.** ⭐⭐ NER bilan ismlarni maskalang.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import pipeline

ner = pipeline("ner", model="Davlan/bert-base-multilingual-cased-ner-hrl",
               aggregation_strategy="simple")

def maskala_ner(matn, chegara=0.75):
    e = [x for x in ner(matn) if x["score"] >= chegara]
    for x in sorted(e, key=lambda z: -z["start"]):
        matn = matn[:x["start"]] + f"<{x['entity_group']}>" + matn[x["end"]:]
    return matn

print(maskala_ner("Mijoz Alisher Karimov Toshkentdan qo'ng'iroq qildi"))
```

## ⚠️ **CHEGARA `0.75`, `0.9` EMAS.** 32-modulda **aniqlik** uchun `0.9` kerak edi. Maskalashda esa **o'tkazib yuborish xavfliroq** — chegarani **pasaytiring**.

</details>

**M21.** Kurs va zamonaviy import juftliklarini jadval qiling.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd
XARITA = [
    ("langchain.chat_models.ChatOpenAI", "langchain_openai.ChatOpenAI"),
    ("langchain.chains.LLMChain",        "prompt | model  (LCEL)"),
    ("langchain.chains.ConversationChain","RunnableWithMessageHistory"),
    ("langchain.memory.ConversationBufferMemory", "InMemoryChatMessageHistory"),
    ("langchain.agents.AgentExecutor",   "langchain.agents.create_agent"),
]
print(pd.DataFrame(XARITA, columns=["KURSDAGI", "ZAMONAVIY"]).to_string(index=False))
```

</details>

**M22.** ⭐ Ollama bilan LCEL zanjirini yozing *(Ollama o'rnatilgan bo'lsa)*.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOllama(model="qwen2.5:1.5b", temperature=0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Always answer in Uzbek."),
    ("human", "{savol}"),
])
zanjir = prompt | model | StrOutputParser()
print(zanjir.invoke({"savol": "Toshkent qaysi mamlakatda?"}))
```

## 🔑 **SISTEM PROMPT INGLIZCHA, JAVOB O'ZBEKCHA** — 1-darsdagi tavsiya.

</details>

**M23.** Hujjat yuklovchini sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_community.document_loaders import TextLoader

open("test.txt", "w", encoding="utf-8").write("Bu — sinov.\nIkkinchi qator.")
d = TextLoader("test.txt", encoding="utf-8").load()
print("soni:", len(d))
print("matn:", repr(d[0].page_content))
print("meta:", d[0].metadata)
```

## ⚠️ **`encoding="utf-8"` SHART** — Windowsda standart `cp1251`, o'zbekcha **buziladi**.

</details>

**M24.** ⭐ `langchain-classic` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
# pip install langchain-classic
from langchain_classic.chains import LLMChain, ConversationChain
from langchain_classic.memory import ConversationBufferMemory
from langchain_classic.agents import AgentExecutor
import langchain_classic
print("versiya:", langchain_classic.__version__)     # 1.0.8
```

## ⚠️ **ARXIV paket.** Rivojlantirilmaydi. Faqat **eski kod ishlashi** uchun.

</details>

**M25.** OpenAI va Ollama narxini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def oylik(kunlik, kir=500, chi=200, kir1m=0.15, chi1m=0.60):
    return kunlik * 30 * (kir * kir1m + chi * chi1m) / 1e6

for n in [10, 100, 1000, 10000]:
    print(f"{n:6d} so'rov/kun → OpenAI ${oylik(n):8.2f}/oy · Ollama $0.00")
```

## 💡 **Ollama "bepul" emas** — u elektr va apparatingizni ishlatadi. Lekin **belgilangan** xarajat.

</details>

---

# 🔴 QIYIN *(26–34)*

**M26.** ⭐⭐ To'liq PII quvuri yozing *(regex + NER)*.

<details>
<summary>✅ Yechim</summary>

```python
class PIIQuvur:
    NAQSHLAR = [                                   # ⭐ ANIQDAN KENGGA
        ("KARTA",   r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b"),
        ("EMAIL",   r"\b[\w.+-]+@[\w-]+\.[\w.]+\b"),
        ("TELEFON", r"\+998[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}"),
        ("INN",     r"\b\d{9}\b"),
    ]

    def __init__(self, ner_chegara=0.75, ner=None):
        self.chegara, self.ner = ner_chegara, ner

    def maskala(self, matn):
        xarita, n = {}, 0
        if self.ner:
            for e in sorted([x for x in self.ner(matn)
                             if x["score"] >= self.chegara],
                            key=lambda z: -z["start"]):
                k = f"<{e['entity_group']}_{n}>"; n += 1
                xarita[k] = matn[e["start"]:e["end"]]
                matn = matn[:e["start"]] + k + matn[e["end"]:]
        for nom, naqsh in self.NAQSHLAR:
            for m in sorted(set(re.findall(naqsh, matn)), key=len, reverse=True):
                if m.strip():
                    k = f"<{nom}_{n}>"; n += 1
                    xarita[k] = m
                    matn = matn.replace(m, k)
        return matn, xarita

    def tikla(self, matn, xarita):
        for k, v in sorted(xarita.items(), key=lambda z: -len(z[0])):
            matn = matn.replace(k, v)
        return matn
```

## 🔑 **NER AVVAL ISHLAYDI** — chunki u **kontekstga** qaraydi. Naqshlar keyin, **qoldiqni** tozalaydi.

</details>

**M27.** ⭐⭐ Maskalashni **sinovdan** o'tkazing.

<details>
<summary>✅ Yechim</summary>

```python
SINOVLAR = [
    ("a.karimov@mail.uz",       "EMAIL"),
    ("4276 1234 5678 9012",     "KARTA"),
    ("+998 90 123 45 67",       "TELEFON"),
    ("123456789",               "INN"),
    ("shunchaki matn",          None),
]
q = PIIQuvur()
for matn, kutilgan in SINOVLAR:
    m, x = q.maskala(f"Ma'lumot: {matn}")
    topildi = [k.split("_")[0].strip("<") for k in x]
    ok = (kutilgan in topildi) if kutilgan else (not topildi)
    print(f"{'✅' if ok else '❌'} {matn:24s} → {topildi}")
```

## 🏆 **HAR MASKALAGICHGA SINOV YOZING.** Xavfsizlik kodini **sinovsiz** ishlatib bo'lmaydi.

</details>

**M28.** ⭐⭐ Modelga bog'liq bo'lmagan "fabrika" yozing.

<details>
<summary>✅ Yechim</summary>

```python
import os

def model_yasa(nom="auto", **kw):
    """Mavjud bo'lganini TANLAYDI — kod o'zgarmaydi."""
    if nom in ("auto", "openai") and os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=kw.pop("model", "gpt-4o-mini"), **kw)
    if nom in ("auto", "ollama"):
        try:
            from langchain_ollama import ChatOllama
            return ChatOllama(model=kw.pop("model", "qwen2.5"), **kw)
        except ImportError:
            pass
    raise RuntimeError("Hech qanday model mavjud emas")
```

## 🏆 **BU FUNKSIYANI HAR LOYIHAGA QO'YING.** Kurs kodini kalitsiz ham, kalit bilan ham **bir xil** ishlatasiz.

</details>

**M29.** ⭐⭐ Bank chatboti arxitekturasini chizing.

<details>
<summary>✅ Javob</summary>

```
MIJOZ SAVOLI (o'zbekcha)
        ↓
① PII MASKALASH        ←  regex + NER, chegara 0.75
        ↓
② MARSHRUTLASH         ←  nozik ma'lumot?
   ├─ HA   →  MAHALLIY model (Ollama)
   └─ YO'Q →  OpenAI API
        ↓
③ RAG                  ←  bank FAQ (o'zbekcha)
        ↓
④ JAVOB + IQTIBOS
        ↓
⑤ ISHONCH < chegara?   →  ❓ OPERATORGA
        ↓
⑥ AUDIT JURNALI
        ↓
   OPERATOR TASDIQLAYDI  →  MIJOZ
```

## 🏆 **OLTITA QATLAM — birortasi ortiqcha emas.**

</details>

**M30.** ⭐⭐ Har komponentning **xato narxini** baholang.

<details>
<summary>✅ Javob</summary>

| Komponent | Xato ehtimoli | Xato narxi | Himoya |
|---|---|---|---|
| Model chaqiruvi | Past | Past | retry |
| Xotira | ## **Juda past** | Past | `window` chegarasi |
| Hujjat yuklash | O'rta | O'rta | `page_content` ni **ko'ring** |
| RAG qidiruvi | ## **O'rta** | ## **Yuqori** | `min_ball` chegarasi |
| Agent | ## **Yuqori** | ## **Yuqori** | `max_iterations` |
| PII maskalash | O'rta | ## 💥 **JUDA YUQORI** | NER + regex + audit |

## 🔑 **ENG YUQORI XAVF — MASKALASH.** Xato **sezilmay** qoladi va oqibati **qonuniy**.

</details>

**M31.** ⭐⭐ Suhbat tarixi tokenlarini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")

tarix = []
for i in range(1, 11):
    tarix.append({"role": "user", "content": f"Bu {i}-savolim, biroz uzunroq."})
    tarix.append({"role": "assistant", "content": f"Bu {i}-javobim, ham uzunroq."})
    jami = sum(len(enc.encode(m["content"])) for m in tarix)
    print(f"{i:2d}-savoldan keyin: {len(tarix):2d} xabar, {jami:5d} token")
```

## 💡 **36-modulda `tiktoken` ni batafsil ko'ramiz.**

</details>

**M32.** ⭐⭐⭐ "Copilot" naqshini kodda ifodalang.

<details>
<summary>✅ Yechim</summary>

```python
class CopilotNaqsh:
    """LLM TAKLIF qiladi → INSON tasdiqlaydi."""

    def __init__(self, model, chegara=0.7):
        self.model, self.chegara, self.jurnal = model, chegara, []

    def taklif(self, savol, kontekst=""):
        javob = self.model.invoke(
            f"Kontekst: {kontekst}\nSavol: {savol}\n"
            f"Agar javob kontekstda BO'LMASA, aynan 'BILMAYMAN' deb yoz."
        ).content
        holat = "❓ BILMAYMAN" if "BILMAYMAN" in javob.upper() else "📝 TAKLIF"
        yozuv = {"savol": savol, "taklif": javob, "holat": holat,
                 "tasdiqlangan": None}
        self.jurnal.append(yozuv)
        return yozuv

    def tasdiqla(self, i, qabul=True, tahrir=None):
        y = self.jurnal[i]
        y["tasdiqlangan"] = qabul
        y["yakuniy"] = tahrir or (y["taklif"] if qabul else None)
        return y

    def hisobot(self):
        n = len(self.jurnal)
        q = sum(1 for y in self.jurnal if y.get("tasdiqlangan"))
        print(f"takliflar {n}  qabul qilingan {q} ({q/max(1,n):.0%})")
```

## 🏆 **`qabul` ULUSHI — ENG MUHIM METRIKA.** U past bo'lsa — promptni yoki RAG'ni **yaxshilash** kerak. Yuqori bo'lsa — **avtomatlashtirishga** o'tish mumkin.

</details>

**M33.** ⭐⭐ O'zbekiston uchun "chiqmaydigan ma'lumot" siyosatini yozing.

<details>
<summary>✅ Javob</summary>

```python
NOZIK_KALITLAR = ["pasport", "jshshir", "inn", "karta", "hisob raqam",
                  "parol", "tibbiy", "tashxis", "dori", "kredit tarixi"]

def marshrut(savol, kontekst=""):
    matn = (savol + " " + kontekst).lower()
    if any(k in matn for k in NOZIK_KALITLAR):
        return "MAHALLIY"          # ma'lumot chiqmaydi
    return "BULUT"                 # OpenAI API

for s in ["Filialingiz qayerda?", "Mening kredit tarixim qanday?",
          "Ish vaqtingiz?", "Pasport ma'lumotimni yangilang"]:
    print(f"{marshrut(s):9s}  {s}")
```

## ⚠️ **KALIT SO'Z FILTRI — BIRINCHI QATLAM, YAGONA EMAS.** Foydalanuvchi kalit so'zsiz ham nozik ma'lumot yozishi mumkin. **PII maskalashni ham qo'shing.**

</details>

**M34.** ⭐⭐⭐ Butun kursni **kalitsiz** o'tish rejasini tuzing.

<details>
<summary>✅ Javob</summary>

```
1) Ollama o'rnating           →  https://ollama.com
2) ollama pull qwen2.5        →  ~5 GB  (yoki qwen2.5:1.5b ~1 GB)
3) pip install langchain-ollama

4) Har darsda:
   ❌ model = ChatOpenAI(model="gpt-4")
   ✅ model = ChatOllama(model="qwen2.5")

5) Embedding kerak bo'lganda (42-modul):
   ❌ OpenAIEmbeddings()
   ✅ from langchain_huggingface import HuggingFaceEmbeddings
      HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

6) Eski Chain/Memory sinflari kerak bo'lsa:
   pip install langchain-classic
```

## 🏆 **KURSNING 95% I KALITSIZ O'TILADI.**
## ⚠️ **Qolgan 5%** — javob **sifati** taqqoslashlari. Ular uchun raqamlarimizni **o'qing**, o'zingiz o'lchamang.

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
