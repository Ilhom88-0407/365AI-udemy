# 🚀 35-modul mini-loyihalari

> **5 ta tayyor loyiha.** Hammasi **API kalitisiz** ishlaydi.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langchain langchain-core langchain-community
pip install langchain-text-splitters tiktoken transformers torch
```

```python
import warnings; warnings.filterwarnings("ignore")
import re, os, json, importlib, importlib.util
from datetime import datetime, timezone
import pandas as pd
```

---

# 🔍 1-loyiha. LangChain moslik skaneri

> **Maqsad:** kursning *(yoki istalgan qo'llanmaning)* qaysi importi **bugun ishlashini** avtomatik aniqlash.

```python
class ModuleSkaner:
    """Kurs kodidagi importlarni tekshirib, MIGRATSIYA hisobotini beradi."""

    # kursdagi import  →  zamonaviy o'rnini bosuvchi
    XARITA = {
        "langchain.chat_models.ChatOpenAI":
            "langchain_openai.ChatOpenAI",
        "langchain.embeddings.OpenAIEmbeddings":
            "langchain_openai.OpenAIEmbeddings",
        "langchain.chains.LLMChain":
            "LCEL:  prompt | model",
        "langchain.chains.ConversationChain":
            "langchain_core.runnables.history.RunnableWithMessageHistory",
        "langchain.chains.ConversationalRetrievalChain":
            "LCEL RAG zanjiri (42-modul)",
        "langchain.chains.RetrievalQA":
            "LCEL RAG zanjiri (42-modul)",
        "langchain.memory.ConversationBufferMemory":
            "langchain_core.chat_history.InMemoryChatMessageHistory",
        "langchain.memory.ConversationBufferWindowMemory":
            "InMemoryChatMessageHistory + trim_messages",
        "langchain.memory.ConversationSummaryMemory":
            "qo'lda xulosalash zanjiri",
        "langchain.output_parsers.DatetimeOutputParser":
            "langchain_classic.output_parsers.DatetimeOutputParser",
        "langchain.agents.AgentExecutor":
            "langchain.agents.create_agent",
        "langchain.agents.initialize_agent":
            "langchain.agents.create_agent",
        "langchain.vectorstores.Chroma":
            "langchain_chroma.Chroma",
        "langchain.text_splitter.CharacterTextSplitter":
            "langchain_text_splitters.CharacterTextSplitter",
    }

    def _holat(self, yol):
        mod, _, nom = yol.rpartition(".")
        try:
            m = importlib.import_module(mod)
        except ModuleNotFoundError:
            return "❌ MODUL YO'Q"
        except Exception as e:
            return f"⚠️ {type(e).__name__}"
        return "✅ ishlaydi" if hasattr(m, nom) else "⚠️ SINF YO'Q"

    def hisobot(self):
        q = [{"kursdagi": k, "holat": self._holat(k), "zamonaviy": v}
             for k, v in self.XARITA.items()]
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        buzilgan = (~d.holat.str.startswith("✅")).sum()
        print(f"\nBUZILGAN: {buzilgan}/{len(d)}  ({buzilgan/len(d):.0%})")
        return d

    def versiyalar(self):
        for p in ["langchain", "langchain_core", "langchain_openai",
                  "langchain_community", "langchain_text_splitters",
                  "langchain_chroma", "langchain_classic"]:
            if importlib.util.find_spec(p):
                m = importlib.import_module(p)
                print(f"{p:26s} {getattr(m, '__version__', '?')}")
            else:
                print(f"{p:26s} — o'rnatilmagan")

    def migratsiya_kodi(self):
        """Nusxa olib ishlatiladigan yangi import bloki."""
        print("# ── ZAMONAVIY IMPORTLAR ──")
        for k, v in self.XARITA.items():
            if self._holat(k).startswith("✅"):
                continue
            if "." in v and not v.startswith(("LCEL", "qo'lda")):
                mod, _, nom = v.rpartition(".")
                print(f"from {mod} import {nom}")
            else:
                print(f"#  {k.split('.')[-1]:32s} →  {v}")
```

**Ishlatish:**

```python
s = ModuleSkaner()
print("=== VERSIYALAR ==="); s.versiyalar()
print("\n=== MOSLIK ===");   s.hisobot()
print();                     s.migratsiya_kodi()
```

> ## 🏆 **BU LOYIHA — BUTUN 35–42-BO'LIM UCHUN ASBOB.**
>
> Har darsni boshlashdan **oldin** uni ishga tushiring — qaysi import **bugun ishlashini** darhol bilib olasiz.
>
> ## 💡 **VA U ESKIRMAYDI:** LangChain yana yangilanganda, siz **skanerni** qayta ishga tushirasiz, hujjat **qidirmaysiz**.

---

# 🛡️ 2-loyiha. PII maskalash quvuri

> **Maqsad:** Ally Financial holatini **haqiqatda** amalga oshirish.

```python
class PIIQuvur:
    """Regex + NER bilan maxfiy ma'lumotni maskalash va QAYTA TIKLASH."""

    # ⚠️ TARTIB MUHIM — eng ANIQDAN eng KENGGA
    NAQSHLAR = [
        ("KARTA",   r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b"),
        ("EMAIL",   r"\b[\w.+-]+@[\w-]+\.[\w.]+\b"),
        ("TELEFON", r"\+998[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}"),
        ("PASPORT", r"\b[A-Z]{2}\s?\d{7}\b"),
        ("JSHSHIR", r"\b\d{14}\b"),
        ("INN",     r"\b\d{9}\b"),
    ]

    def __init__(self, ner_chegara=0.75, ner_yoq=False):
        self.chegara = ner_chegara
        self.ner = None
        if not ner_yoq:
            try:
                from transformers import pipeline
                self.ner = pipeline(
                    "ner", model="Davlan/bert-base-multilingual-cased-ner-hrl",
                    aggregation_strategy="simple")
            except Exception as e:
                print(f"⚠️ NER yuklanmadi ({type(e).__name__}) — faqat regex")
        self.audit = []

    def maskala(self, matn):
        asl, xarita, n = matn, {}, 0

        # ① NER AVVAL — u kontekstga qaraydi
        if self.ner:
            e = [x for x in self.ner(matn) if x["score"] >= self.chegara]
            for x in sorted(e, key=lambda z: -z["start"]):
                k = f"<{x['entity_group']}_{n}>"; n += 1
                xarita[k] = matn[x["start"]:x["end"]]
                matn = matn[:x["start"]] + k + matn[x["end"]:]

        # ② Naqshlar — qoldiqni tozalaydi
        for nom, naqsh in self.NAQSHLAR:
            for m in sorted(set(re.findall(naqsh, matn)), key=len, reverse=True):
                if m.strip():
                    k = f"<{nom}_{n}>"; n += 1
                    xarita[k] = m
                    matn = matn.replace(m, k)

        self.audit.append({
            "vaqt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "asl_uzunlik": len(asl), "maskalar": len(xarita),
            "turlar": sorted({k.strip("<>").rsplit("_", 1)[0] for k in xarita}),
        })
        return matn, xarita

    def tikla(self, matn, xarita):
        for k, v in sorted(xarita.items(), key=lambda z: -len(z[0])):
            matn = matn.replace(k, v)
        return matn

    def tekshir(self, maskalangan):
        """⚠️ QOLDIQ tekshiruvi — maskalashdan KEYIN."""
        qoldiq = []
        for nom, naqsh in self.NAQSHLAR:
            if re.search(naqsh, maskalangan):
                qoldiq.append(nom)
        return qoldiq

    def hisobot(self):
        d = pd.DataFrame(self.audit)
        print(d.to_string(index=False))
        print(f"\njami qayta ishlangan: {len(d)}   "
              f"o'rtacha maskalar: {d.maskalar.mean():.1f}")
```

**Ishlatish:**

```python
q = PIIQuvur()

MATN = ("Mijoz Alisher Karimov qo'ng'iroq qildi. Pochtasi a.karimov@mail.uz, "
        "kartasi 4276 1234 5678 9012, telefoni +998 90 123 45 67, "
        "INN 123456789. Toshkent filialiga murojaat qildi.")

m, x = q.maskala(MATN)
print("MASKALANGAN:", m)
print("\nQOLDIQ     :", q.tekshir(m) or "✅ toza")
print("\nTIKLANGAN  :", q.tikla(m, x))
print()
q.hisobot()
```

> ## ⚠️⚠️ **`tekshir()` METODI — ENG MUHIM QISM.**
>
> ```
> Maskalash "ishladi" deb TAXMIN qilmang — TEKSHIRING.
> Agar qoldiq topilsa — LLM ga YUBORMANG.
> ```
>
> ```python
> m, x = q.maskala(matn)
> if q.tekshir(m):
>     raise RuntimeError(f"MASKALASH TO'LIQ EMAS: {q.tekshir(m)}")
> javob = llm.invoke(m)                  # faqat TOZA bo'lsa
> ```

> ## 💥 **HALOL OGOHLANTIRISH — NER'SIZ ISMLAR MASKALANMAYDI.**
> Biz buni **o'lchadik**: faqat regex bilan `"Alisher Karimov"` **o'tib ketadi**. NER `pipeline` **shart**, va u ham **100% emas**.
>
> ## 🔑 **SHUNING UCHUN `audit` JURNALI BOR.** Muammo chiqsa — **nima qachon** qayta ishlanganini ko'rasiz.

---

# 💰 3-loyiha. Suhbat narxi kalkulyatori

> **Maqsad:** xotira strategiyasi tanlashni **taxmin** emas, **raqam** bilan qilish.

```python
import tiktoken

class SuhbatNarxi:
    """Xotira strategiyalarining narxini TOKENDA o'lchaydi."""

    NARXLAR = {                       # $ / 1M token  (2025, taxminiy)
        "gpt-4o-mini": (0.15, 0.60),
        "gpt-4o":      (2.50, 10.00),
        "ollama":      (0.00,  0.00),
    }

    def __init__(self, model="gpt-4o-mini", enc="cl100k_base"):
        self.model = model
        self.enc = tiktoken.get_encoding(enc)

    def _t(self, s):
        return len(self.enc.encode(s))

    def simulyatsiya(self, xabarlar, strategiya="buffer", oyna=6,
                     xulosa_tokeni=80):
        """xabarlar: [(rol, matn), ...] — foydalanuvchi/bot navbatma-navbat."""
        kirish_jami = chiqish_jami = 0
        qatorlar = []
        tarix = []
        for i, (rol, matn) in enumerate(xabarlar):
            if rol == "user":
                tarix.append((rol, matn))
                if strategiya == "buffer":
                    kontekst = tarix
                elif strategiya == "window":
                    kontekst = tarix[-oyna:]
                elif strategiya == "summary":
                    eski, yangi = tarix[:-oyna], tarix[-oyna:]
                    kontekst = ([("system", "x" * xulosa_tokeni * 4)] if eski
                                else []) + yangi
                else:
                    raise ValueError(strategiya)
                kir = sum(self._t(m) for _, m in kontekst)
                kirish_jami += kir
                qatorlar.append({"qadam": i // 2 + 1, "kirish_token": kir})
            else:
                tarix.append((rol, matn))
                c = self._t(matn)
                chiqish_jami += c

        kir1m, chi1m = self.NARXLAR[self.model]
        narx = kirish_jami / 1e6 * kir1m + chiqish_jami / 1e6 * chi1m
        return {"strategiya": strategiya, "kirish": kirish_jami,
                "chiqish": chiqish_jami, "narx_usd": round(narx, 6),
                "qadamlar": qatorlar}

    def solishtir(self, xabarlar, oyna=6):
        n = [self.simulyatsiya(xabarlar, s, oyna)
             for s in ["buffer", "window", "summary"]]
        d = pd.DataFrame([{k: v for k, v in x.items() if k != "qadamlar"}
                          for x in n])
        eng = d.kirish.max()
        d["tejash"] = ((1 - d.kirish / eng) * 100).round(1).astype(str) + "%"
        print(d.to_string(index=False))
        return d
```

**Ishlatish:**

```python
# 30 xabarlik suhbat yasaymiz
xabarlar = []
for i in range(1, 16):
    xabarlar.append(("user", f"Bu mening {i}-savolim, u biroz uzunroq "
                             f"bo'lishi uchun qo'shimcha so'zlar qo'shdim."))
    xabarlar.append(("assistant", f"Bu {i}-javob. Men ham batafsil "
                                  f"javob berishga harakat qilaman."))

n = SuhbatNarxi("gpt-4o-mini")
n.solishtir(xabarlar, oyna=6)
```

> ## 🔑 **UCHTA STRATEGIYA, UCHTA ALMASHUV:**
> ```
> buffer   →  hech nima UNUTILMAYDI   ·  narx O(n²)  💥
> window   →  eski suhbat UNUTILADI   ·  narx O(n)   ⭐ eng amaliy
> summary  →  tafsilot YO'QOLADI      ·  narx O(n)   + xulosalash CHAQIRUVI
> ```
>
> ## ⚠️ **`summary` NING YASHIRIN NARXI:** xulosani **yasash uchun** ham LLM chaqiriladi. Agar suhbat **qisqa** bo'lsa — u `buffer` dan **qimmatroq** chiqishi mumkin.
>
> ## 💡 **AMALIY QOIDA:** `window` bilan **boshlang** *(oyna = 6–10 xabar)*. Foydalanuvchi *"sen buni unutding"* deb shikoyat qilsagina — `summary` ga o'ting.

---

# 🧭 4-loyiha. Model-agnostik fabrika

> **Maqsad:** butun kursni **kalit bilan ham, kalitsiz ham** bir xil kod bilan o'tish.

```python
class ModelFabrika:
    """Mavjud provayderni AVTOMATIK tanlaydi — kod o'zgarmaydi."""

    TARTIB = ["openai", "anthropic", "google", "ollama", "hf"]

    @staticmethod
    def _bor(paket):
        return importlib.util.find_spec(paket) is not None

    @classmethod
    def mavjudlar(cls):
        n = []
        if cls._bor("langchain_openai") and os.getenv("OPENAI_API_KEY"):
            n.append(("openai", "gpt-4o-mini", "💰 pullik"))
        if cls._bor("langchain_anthropic") and os.getenv("ANTHROPIC_API_KEY"):
            n.append(("anthropic", "claude-sonnet-4-5", "💰 pullik"))
        if cls._bor("langchain_google_genai") and os.getenv("GOOGLE_API_KEY"):
            n.append(("google", "gemini-2.0-flash", "bepul kvota"))
        if cls._bor("langchain_ollama"):
            n.append(("ollama", "qwen2.5", "✅ BEPUL, mahalliy"))
        if cls._bor("langchain_huggingface"):
            n.append(("hf", "Qwen/Qwen2.5-1.5B-Instruct", "✅ BEPUL, mahalliy"))
        return n

    @classmethod
    def yasa(cls, provayder="auto", model=None, **kw):
        mavjud = {p: m for p, m, _ in cls.mavjudlar()}
        if provayder == "auto":
            for p in cls.TARTIB:
                if p in mavjud:
                    provayder = p
                    break
            else:
                raise RuntimeError(
                    "Hech qanday provayder yo'q.\n"
                    "  pip install langchain-ollama  +  ollama pull qwen2.5")
        model = model or mavjud[provayder]

        if provayder == "openai":
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(model=model, **kw)
        if provayder == "anthropic":
            from langchain_anthropic import ChatAnthropic
            return ChatAnthropic(model=model, **kw)
        if provayder == "google":
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(model=model, **kw)
        if provayder == "ollama":
            from langchain_ollama import ChatOllama
            return ChatOllama(model=model, **kw)
        if provayder == "hf":
            from langchain_huggingface import HuggingFacePipeline, ChatHuggingFace
            llm = HuggingFacePipeline.from_model_id(
                model_id=model, task="text-generation",
                pipeline_kwargs={"max_new_tokens": 256})
            return ChatHuggingFace(llm=llm)
        raise ValueError(provayder)

    @classmethod
    def hisobot(cls):
        m = cls.mavjudlar()
        if not m:
            print("❌ Hech qanday provayder mavjud emas.")
            print("   pip install langchain-ollama  &&  ollama pull qwen2.5")
            return
        print(pd.DataFrame(m, columns=["provayder", "standart model", "narx"])
                .to_string(index=False))
        print(f"\n⭐ auto tanlaydi: {[p for p, _, _ in m][0]}")
```

**Ishlatish:**

```python
ModelFabrika.hisobot()

# Butun kurs davomida SHU BITTA SATR:
model = ModelFabrika.yasa()          # auto

# yoki majburan mahalliy:
# model = ModelFabrika.yasa("ollama", "qwen2.5:1.5b", temperature=0)
```

> ## 🏆 **BU FABRIKANI 36–42-MODULLARNING HAMMASIDA ISHLATING.**
>
> ```python
> from langchain_core.prompts import ChatPromptTemplate
> from langchain_core.output_parsers import StrOutputParser
>
> model = ModelFabrika.yasa()                       # ⭐ yagona o'zgaruvchan joy
> zanjir = prompt | model | StrOutputParser()       # qolgani BIR XIL
> ```
>
> ## 💡 **Kursda `ChatOpenAI(...)` yozilgan HAR YERDA `ModelFabrika.yasa()` ni qo'ying.**

---

# 🇺🇿 5-loyiha. Ma'lumot suvereniteti marshrutizatori

> **Maqsad:** O'zbekistondagi bank/tibbiy loyihalar uchun — **qaysi so'rov chet elga chiqishi mumkin?**

```python
class SuverenitetMarshrutizator:
    """Nozik ma'lumotni MAHALLIY modelga, qolganini bulutga yo'naltiradi."""

    NOZIK_KALITLAR = [
        "pasport", "jshshir", "inn", "karta raqam", "hisob raqam",
        "parol", "kod", "sms", "tibbiy", "tashxis", "dori", "kasallik",
        "kredit tarix", "qarz", "jarima", "sud", "ariza",
    ]

    NOZIK_NAQSHLAR = [
        r"\b\d{16}\b", r"\b\d{14}\b", r"\b\d{9}\b",
        r"\b[A-Z]{2}\s?\d{7}\b", r"\+998\d{9}",
    ]

    def __init__(self, pii_quvur=None):
        self.pii = pii_quvur
        self.jurnal = []

    def _sabab(self, matn):
        past = matn.lower()
        sabablar = [f"kalit:{k}" for k in self.NOZIK_KALITLAR if k in past]
        sabablar += [f"naqsh:{n[:14]}" for n in self.NOZIK_NAQSHLAR
                     if re.search(n, matn)]
        if self.pii:
            _, x = self.pii.maskala(matn)
            sabablar += [f"pii:{k.strip('<>').rsplit('_', 1)[0]}" for k in x]
        return sorted(set(sabablar))

    def marshrut(self, savol, kontekst=""):
        s = self._sabab(f"{savol} {kontekst}")
        yol = "MAHALLIY" if s else "BULUT"
        yozuv = {"savol": savol[:44], "yo'l": yol,
                 "sabablar": s[:3], "vaqt": datetime.now(timezone.utc)
                 .isoformat(timespec="seconds")}
        self.jurnal.append(yozuv)
        return yozuv

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        print(d[["savol", "yo'l", "sabablar"]].to_string(index=False))
        m = (d["yo'l"] == "MAHALLIY").mean()
        print(f"\nMAHALLIY: {m:.0%}   BULUT: {1-m:.0%}")
        print("💡 MAHALLIY ulushi yuqori bo'lsa — mahalliy model SIFATI muhim.")
```

**Ishlatish:**

```python
r = SuverenitetMarshrutizator()
for s in ["Filialingiz qayerda joylashgan?",
          "Ish vaqtingiz qanday?",
          "Mening kredit tarixim qanday?",
          "Pasport ma'lumotimni yangilang, seriya AA 1234567",
          "Kartam 4276123456789012 bloklangan",
          "Depozit foizi qancha?"]:
    r.marshrut(s)
r.hisobot()
```

> ## ⚠️⚠️ **HALOL OGOHLANTIRISH — BU YURIDIK MASLAHAT EMAS.**
>
> Bu — **texnik naqsh**. Haqiqiy loyihada:
> ```
> ① Yuridik bo'lim BILAN maslahatlashing
> ② O'zbekiston "Shaxsga doir ma'lumotlar to'g'risida"gi qonunini TEKSHIRING
> ③ Sohangiz regulyatorining talablarini o'rganing (Markaziy bank, Sog'liqni saqlash vazirligi)
> ```
>
> ## 🔑 **VA ESLANG — KALIT SO'Z FILTRI BIRINCHI QATLAM, YAGONA EMAS.** Foydalanuvchi kalit so'zsiz ham nozik ma'lumot yozadi. **PII maskalashni doim qo'shing:**
> ```python
> r = SuverenitetMarshrutizator(pii_quvur=PIIQuvur())      # ⭐ 2-loyiha bilan
> ```

---

## 🎯 Loyihalarni birlashtirish

```
1-loyiha (skaner)         →  qaysi kod ishlaydi?
        ↓
4-loyiha (fabrika)        →  qaysi model bilan?
        ↓
5-loyiha (marshrutizator) →  bulutga chiqarish MUMKINMI?
        ↓
2-loyiha (PII)            →  chiqsa — nima MASKALANADI?
        ↓
3-loyiha (narx)           →  qaysi xotira strategiyasi?
        ↓
   ⭐ 36–42-modullarga TAYYOR asos
```

> ## 🚀 **BU BESHTA SINFNI BITTA `lc_asos.py` FAYLIGA YIG'ING.** Butun LangChain bo'limi davomida ularni **import qilib** ishlatasiz.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
