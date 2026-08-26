# 🚀 39-modul mini-loyihalari

> **4 ta tayyor loyiha.** Shablon loyihalari **API kalitisiz** ham ishlaydi.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langchain langchain-core langchain-openai python-dotenv tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, re, json, importlib.util
from pathlib import Path
import pandas as pd, tiktoken
from dotenv import load_dotenv
load_dotenv(override=True)

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.prompts import (ChatPromptTemplate, MessagesPlaceholder,
                                    HumanMessagePromptTemplate,
                                    AIMessagePromptTemplate,
                                    FewShotChatMessagePromptTemplate)


def chat_yasa(temperature=0, max_tokens=300, seed=365):
    if importlib.util.find_spec("langchain_openai") and os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature,
                          max_tokens=max_tokens, seed=seed)
    if importlib.util.find_spec("langchain_ollama"):
        from langchain_ollama import ChatOllama
        return ChatOllama(model="qwen2.5", temperature=temperature,
                          num_predict=max_tokens, seed=seed)
    raise RuntimeError("pip install langchain-ollama  &&  ollama pull qwen2.5")
```

---

# 📚 1-loyiha. Shablon kutubxonasi

> **Maqsad:** loyihaning **hamma promptlari** bitta joyda — versiyalangan, o'lchangan, sinovdan o'tgan.

```python
class ShablonKutubxona:
    """Promptlarni markazlashtirilgan boshqarish."""

    def __init__(self, enc="o200k_base"):
        self.shablonlar = {}
        self.meta = {}
        self.enc = tiktoken.get_encoding(enc)

    # ── qo'shish ──
    def qosh(self, nom, sistem, human, few_shot=None, tarix=False,
             izoh="", versiya="1.0"):
        parts = [("system", sistem)]
        if few_shot is not None:
            parts.append(few_shot)
        if tarix:
            parts.append(MessagesPlaceholder("tarix", optional=True))
        parts.append(("human", human))
        self.shablonlar[nom] = ChatPromptTemplate.from_messages(parts)
        self.meta[nom] = {"izoh": izoh, "versiya": versiya, "tarix": tarix}
        return self

    def olish(self, nom):
        return self.shablonlar[nom]

    # ── tekshiruv ──
    @staticmethod
    def shablon_tekshir(matn):
        muammolar = []
        for m in re.findall(r"\{([^{}]*)\}", matn):
            if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", m.strip()):
                muammolar.append(f"💥 {{{m}}} — o'zgaruvchi nomiga o'xshamaydi "
                                 f"(JSON bo'lsa {{{{...}}}} yozing)")
        if matn.count("{") != matn.count("}"):
            muammolar.append("💥 figurali qavslar soni MOS EMAS")
        if re.search(r"\n[ \t]{4,}", matn):
            muammolar.append("⚠️ qator boshida ortiqcha bo'shliq — token isrofi")
        return muammolar

    @staticmethod
    def sistem_tekshir(sp):
        """Yaxshi sistem promptning to'rtta elementi."""
        past = sp.lower()
        return {
            "① ROL":     bool(re.search(r"you are|siz\b", past)),
            "② VAZIFA":  bool(re.search(r"answer|classif|summar|translat|extract|javob", past)),
            "③ FORMAT":  bool(re.search(r"sentence|word|json|list|format|jumla|exactly", past)),
            "④ CHEGARA": bool(re.search(r"if.*(unsure|not|unknown|missing)|never|only|reply exactly", past)),
        }

    # ── o'lchov ──
    def token(self, nom, qiymatlar):
        cv = self.shablonlar[nom].invoke(qiymatlar)
        return sum(len(self.enc.encode(m.content)) + 4 for m in cv.messages)

    def hisobot(self, namunalar):
        q = []
        for nom, ct in self.shablonlar.items():
            sistem = ct.messages[0].prompt.template if hasattr(
                ct.messages[0], "prompt") else ""
            el = self.sistem_tekshir(sistem)
            try:
                tok = self.token(nom, namunalar.get(nom, {}))
                holat = "✅"
            except Exception as e:
                tok, holat = None, f"❌ {type(e).__name__}"
            q.append({"shablon": nom, "v": self.meta[nom]["versiya"],
                      "o'zgaruvchi": len(ct.input_variables),
                      "token": tok, "holat": holat,
                      "sistem_elementlari": sum(el.values()),
                      "yetishmaydi": ", ".join(k for k, v in el.items() if not v)})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        if d.token.notna().any():
            print(f"\ndoimiy token yuki: {int(d.token.sum())} "
                  f"(har chaqiruvda yuboriladi)")
        yomon = d[d.sistem_elementlari < 4]
        if len(yomon):
            print(f"\n⚠️ {len(yomon)} ta shablonda sistem prompt TO'LIQ EMAS")
        return d

    # ── saqlash / yuklash ──
    def saqla(self, fayl="shablonlar.json"):
        d = {nom: {"meta": self.meta[nom],
                   "o'zgaruvchilar": ct.input_variables}
             for nom, ct in self.shablonlar.items()}
        Path(fayl).write_text(json.dumps(d, indent=1, ensure_ascii=False),
                              encoding="utf-8")
        print(f"✅ {fayl} saqlandi ({len(d)} shablon)")
```

**Ishlatish:**

```python
kb = (ShablonKutubxona()
      .qosh("tasnif",
            sistem=("You are a sentiment classifier. Classify an Uzbek comment "
                    "as exactly one word: ijobiy, neytral, or salbiy. "
                    "If the text has no sentiment, reply exactly: neytral."),
            human="{matn}",
            izoh="Izoh hissiyoti")
      .qosh("xulosa",
            sistem="You are a summarizer. Summarize in at most 2 sentences.",
            human="{matn}", tarix=True, izoh="Matn xulosasi")
      .qosh("yomon",
            sistem="Be helpful.",                     # ⚠️ ataylab yomon
            human="{matn}", izoh="namuna: yomon prompt"))

kb.hisobot({"tasnif": {"matn": "test"},
            "xulosa": {"matn": "test", "tarix": []},
            "yomon":  {"matn": "test"}})

print("\n=== SHABLON TEKSHIRUVI ===")
for m in kb.shablon_tekshir('JSON qaytaring: {"a": 1} va {savol}'):
    print(m)
```

> ## 🏆 **`sistem_elementlari` USTUNI — LOYIHANING ASOSIY QIYMATI.**
>
> U har promptda **to'rtta element** *(ROL · VAZIFA · FORMAT · CHEGARA)* borligini tekshiradi. **④ CHEGARA** — eng ko'p unutiladigan, va **eng qimmat**: usiz model **yolg'on to'qiydi** *(31-modul)*.
>
> ## 💡 **`doimiy token yuki`** — bu **har chaqiruvda** ketadigan tokenlar. 36-modulni eslang: sistem prompt **har safar** yuboriladi.

---

# 🎯 2-loyiha. Few-shot laboratoriyasi

> **Maqsad:** *"Nechta misol kerak?"* savoliga **o'lchov** bilan javob berish.

```python
class FewShotLab:
    """Misollar soni ↔ aniqlik ↔ narx egri chizig'i."""

    def __init__(self, chat, kirish="matn", chiqish="yorliq", enc="o200k_base"):
        self.chat, self.ki, self.ch = chat, kirish, chiqish
        self.enc = tiktoken.get_encoding(enc)
        self.misollar = []

    def qosh(self, kirish, chiqish):
        self.misollar.append({self.ki: kirish, self.ch: chiqish})
        return self

    def _shablon(self, sistem, n=None):
        eh = HumanMessagePromptTemplate.from_template("{%s}" % self.ki)
        ea = AIMessagePromptTemplate.from_template("{%s}" % self.ch)
        et = ChatPromptTemplate.from_messages([eh, ea])
        parts = [("system", sistem)]
        ex = self.misollar if n is None else self.misollar[:n]
        if ex:
            parts.append(FewShotChatMessagePromptTemplate(
                examples=ex, example_prompt=et, input_variables=[self.ki]))
        parts.append(eh)
        return ChatPromptTemplate.from_messages(parts)

    def token(self, sistem, namuna, n=None):
        cv = self._shablon(sistem, n).invoke({self.ki: namuna})
        return sum(len(self.enc.encode(m.content)) + 4 for m in cv.messages)

    def bashorat(self, sistem, matn, n=None):
        cv = self._shablon(sistem, n).invoke({self.ki: matn})
        return self.chat.invoke(cv).content.strip().lower().strip(".")

    def egri_chiziq(self, sistem, oltin, qadamlar=None, yorliqlar=None):
        """oltin: [(matn, kutilgan), ...]"""
        q = []
        for n in (qadamlar or range(0, len(self.misollar) + 1, 2)):
            tog, format_xato = 0, 0
            for m, kut in oltin:
                r = self.bashorat(sistem, m, n)
                tog += (r == kut)
                if yorliqlar and r not in yorliqlar:
                    format_xato += 1
            q.append({"misollar": n,
                      "aniqlik": round(tog / len(oltin), 2),
                      "format_xato": format_xato,
                      "token": self.token(sistem, oltin[0][0], n)})
        d = pd.DataFrame(q)
        d["aniqlik/100tok"] = (d.aniqlik / d.token * 100).round(3)
        print(d.to_string(index=False))
        if yorliqlar:
            print(f"bazaviy ({len(yorliqlar)} sinf): "
                  f"{1/len(yorliqlar):.2f}")
        eng = d.loc[d["aniqlik/100tok"].idxmax()]
        print(f"\n🏆 SAMARADORLIK BO'YICHA ENG YAXSHI: {int(eng.misollar)} misol "
              f"(aniqlik {eng.aniqlik}, {int(eng.token)} token)")
        return d
```

**Ishlatish:**

```python
YORLIQLAR = {"ijobiy", "neytral", "salbiy"}

lab = (FewShotLab(chat_yasa(max_tokens=8))
       .qosh("Bu film ajoyib edi, juda yoqdi",           "ijobiy")
       .qosh("Xizmat tez va sifatli bo'ldi",             "ijobiy")
       .qosh("Oddiy, hech qanday taassurot qoldirmadi",  "neytral")
       .qosh("Narxi o'rtacha, sifati ham o'rtacha",      "neytral")
       .qosh("Pulimni behuda sarfladim, juda yomon",     "salbiy")
       .qosh("Kutganimdan ancha yomon chiqdi",           "salbiy"))

SISTEM = ("You are a sentiment classifier for Uzbek text. Reply with exactly "
          "one word: ijobiy, neytral, or salbiy. Output nothing else.")

OLTIN = [("Juda mamnunman, tavsiya qilaman",   "ijobiy"),
         ("Xizmat a'lo darajada bo'ldi",       "ijobiy"),
         ("Umuman yoqmadi, vaqt behuda ketdi", "salbiy"),
         ("Sifati past, kutganimga arzimadi",  "salbiy"),
         ("Poyezd soat 7 da jo'naydi",         "neytral"),
         ("Narxi o'rtacha, boshqa gap yo'q",   "neytral")]

lab.egri_chiziq(SISTEM, OLTIN, qadamlar=[0, 2, 4, 6], yorliqlar=YORLIQLAR)
```

> ## 🏆 **`aniqlik/100tok` — SAMARADORLIK O'LCHOVI.**
>
> ```
> n=0  →  narx ENG PAST, aniqlik?
> n=2  →  odatda ENG YAXSHI nisbat
> n=6  →  aniqlik biroz oshadi, narx 3× oshadi
> ```
>
> ## 💡 **4-DARSDAGI TOPILMAMIZNI ESLANG:** **aniq sistem prompt** bo'lganda `n=0` ham `n=3` bilan **bir xil** natija bergan edi. Bu loyiha aynan **shu savolga** javob beradi — **sizning** ma'lumotingizda.
>
> ## ⚠️ **VA BAZAVIY CHIZIQNI UNUTMANG:** 3 sinfda **0.33**.

---

# 💬 3-loyiha. Xotirali chatbot (zamonaviy naqsh)

> **Maqsad:** `ConversationChain` **olib tashlanganidan keyin** *(35-modul)* xotirali botni **to'g'ri** qurish.

```python
class XotiraliBot:
    """MessagesPlaceholder + qisqartirish — langchain.memory'siz."""

    def __init__(self, chat, sistem, max_tarix_token=1200, enc="o200k_base"):
        self.chat = chat
        self.enc = tiktoken.get_encoding(enc)
        self.max_tarix = max_tarix_token
        self.shablon = ChatPromptTemplate.from_messages([
            ("system", sistem),
            MessagesPlaceholder("tarix"),
            ("human", "{savol}")])
        self.tarix = []
        self.statistika = []

    def _tok(self, xabarlar):
        return sum(len(self.enc.encode(m.content)) + 4 for m in xabarlar)

    def _qisqart(self):
        tashlandi = 0
        while self.tarix and self._tok(self.tarix) > self.max_tarix:
            del self.tarix[:2]                 # human + ai
            tashlandi += 2
        return tashlandi

    def sora(self, savol):
        tashlandi = self._qisqart()
        cv = self.shablon.invoke({"tarix": self.tarix, "savol": savol})
        kirish_tok = self._tok(cv.messages)
        r = self.chat.invoke(cv)
        self.tarix.extend([HumanMessage(content=savol), r])
        self.statistika.append({
            "savol": savol[:30], "tarix_xabar": len(self.tarix),
            "kirish_token": kirish_tok, "tashlandi": tashlandi,
            "sabab": r.response_metadata.get("finish_reason")
                     if hasattr(r, "response_metadata") else None})
        return r.content

    def hisobot(self):
        d = pd.DataFrame(self.statistika)
        print(d.to_string(index=False))
        print(f"\ntarix: {len(self.tarix)} xabar, "
              f"{self._tok(self.tarix)} token / {self.max_tarix}")
        if d.tashlandi.sum():
            print(f"⚠️ {int(d.tashlandi.sum())} ta xabar UNUTILDI "
                  f"(chegara tufayli)")
        print(f"\n💡 kirish tokenlari o'sishi: "
              f"{d.kirish_token.iloc[0]} → {d.kirish_token.iloc[-1]}")
        return d
```

**Ishlatish:**

```python
bot = XotiraliBot(
    chat_yasa(max_tokens=120),
    sistem=("You are a helpful bank assistant for Uzbekistan. "
            "Answer in Uzbek, in at most 2 sentences. "
            "If unsure, reply exactly: 'Operatorga murojaat qiling.'"),
    max_tarix_token=400)

for q in ["Salom, mening ismim Alisher",
          "Depozit foizi qancha?",
          "Mening ismim nima edi?",
          "Karta buyurtma qilsam bo'ladimi?",
          "Ish vaqtingiz qanday?"]:
    print(f"\n❓ {q}\n➡️  {bot.sora(q)[:150]}")

print()
bot.hisobot()
```

> ## 🏆 **BU — `ConversationChain` NING TO'G'RI O'RNINI BOSUVCHISI.**
>
> ```
> ❌ langchain.memory.ConversationBufferMemory   →  MODUL YO'Q (35-modul)
> ✅ MessagesPlaceholder + qo'lda qisqartirish   →  ⭐ shaffof va nazoratli
> ```
>
> ## 💥 **`kirish_token` USTUNIGA E'TIBOR BERING** — u **har savolda o'sadi**. Bu — 35-modulda hisoblagan `O(n²)` narx.
>
> ## ⚠️ **`tashlandi` USTUNI — ALMASHUVNING NARXI.** Bot 3-savoldagi ismni **unutishi mumkin**. Buni **ko'rasiz**, taxmin qilmaysiz.

---

# 🇺🇿 4-loyiha. O'zbekcha prompt to'plami

> **Maqsad:** o'zbekcha loyihalar uchun **tayyor, sinovdan o'tgan** prompt to'plami.

```python
class UzPromptToplam:
    """O'zbekcha vazifalar uchun shablonlar — sinovlar bilan."""

    # ⭐ NAQSH: ko'rsatma INGLIZCHA, chiqish O'ZBEKCHA (38-modul)
    SHABLONLAR = {
        "hissiyot": {
            "sistem": ("You are a sentiment classifier for Uzbek text. "
                       "Reply with exactly one word: ijobiy, neytral, or salbiy. "
                       "If the text expresses no sentiment, reply: neytral. "
                       "Output nothing else."),
            "human": "{matn}",
            "yorliqlar": {"ijobiy", "neytral", "salbiy"},
            "max_tokens": 8,
        },
        "xulosa": {
            "sistem": ("You are a summarizer. Summarize the Uzbek text below "
                       "in Uzbek, in exactly 2 sentences. "
                       "Do not add information that is not in the text."),
            "human": "{matn}",
            "yorliqlar": None,
            "max_tokens": 120,
        },
        "kalit_sozlar": {
            "sistem": ("Extract exactly 5 key terms from the Uzbek text. "
                       "Reply as a comma-separated list in Uzbek. "
                       "No numbering, no explanation."),
            "human": "{matn}",
            "yorliqlar": None,
            "max_tokens": 60,
        },
        "yonaltirish": {
            "sistem": ("You route customer messages for an Uzbek bank. "
                       "Reply with exactly one word: karta, depozit, kredit, "
                       "boshqa. Output nothing else."),
            "human": "{matn}",
            "yorliqlar": {"karta", "depozit", "kredit", "boshqa"},
            "max_tokens": 8,
        },
    }

    def __init__(self, chat_fabrika=chat_yasa):
        self.fabrika = chat_fabrika
        self.natijalar = []

    def shablon(self, nom):
        s = self.SHABLONLAR[nom]
        return ChatPromptTemplate.from_messages([
            ("system", s["sistem"]), ("human", s["human"])])

    def ishlat(self, nom, matn):
        s = self.SHABLONLAR[nom]
        chat = self.fabrika(max_tokens=s["max_tokens"])
        cv = self.shablon(nom).invoke({"matn": matn})
        r = chat.invoke(cv).content.strip()
        ok = (s["yorliqlar"] is None) or (r.lower().strip(".") in s["yorliqlar"])
        self.natijalar.append({"shablon": nom, "matn": matn[:32],
                               "javob": r[:44], "format": "✅" if ok else "❌"})
        return r

    def sinov(self):
        NAMUNALAR = {
            "hissiyot": ["Juda mamnunman, tavsiya qilaman",
                         "Umuman yoqmadi",
                         "Poyezd soat 7 da jo'naydi"],
            "yonaltirish": ["Kartam bloklangan, nima qilay?",
                            "Depozit foizi qancha?",
                            "Ish vaqtingiz qanday?"],
            "xulosa": ["Sun'iy intellekt sohasidagi so'nggi yutuqlar tibbiyot, "
                       "ta'lim va moliya sohalarini tubdan o'zgartirmoqda. "
                       "Mutaxassislar bu jarayon yaqin o'n yillikda yanada "
                       "tezlashishini bashorat qilmoqda."],
            "kalit_sozlar": ["Kompaniyamiz 1978-yilda Toshkentda tashkil "
                             "etilgan bo'lib, bugungi kunda 450 nafar xodimga "
                             "ega va yiliga 12 000 dan ortiq avtomobil sotadi."],
        }
        for nom, matnlar in NAMUNALAR.items():
            for m in matnlar:
                self.ishlat(nom, m)
        d = pd.DataFrame(self.natijalar)
        print(d.to_string(index=False))
        xato = (d.format == "❌").sum()
        if xato:
            print(f"\n⚠️ {xato} ta format buzilishi — sistem promptni "
                  f"ANIQROQ qiling ('Output nothing else')")
        else:
            print("\n✅ format buzilishi yo'q")
        return d
```

**Ishlatish:**

```python
UzPromptToplam().sinov()
```

> ## 🔑 **UCHTA TAMOYIL BU TO'PLAMDA:**
> ```
> ① Ko'rsatma INGLIZCHA, chiqish O'ZBEKCHA
> ② "Output nothing else"       →  model tushuntirish qo'shmasin
> ③ Aniq yorliqlar + tekshiruv  →  format buzilishini USHLASH
> ```
>
> ## ⚠️ **`format` USTUNI — ENG MUHIMI.** LLM sizga `"ijobiy."` yoki `"Hissiyot: ijobiy"` qaytarishi mumkin. **Oq ro'yxat** buni **darhol** ko'rsatadi.
>
> ## 💡 **`yonaltirish` SHABLONI — 34-MODULDAGI CHIPTA YO'NALTIRISH VAZIFASI.** U yerda **fine-tuning** qilgan edik *(1200 namuna, 11 daqiqa)*. Bu yerda — **nol o'qitish**. Ikkalasini **[2-loyiha](#-2-loyiha-few-shot-laboratoriyasi)** bilan **o'lchab solishtiring**.
>
> ## ⚠️ **VA HALOL BO'LAMIZ:** `max_tokens=8` — `xulosa` uchun **yetarli emas**, shuning uchun u **120** ga qo'yilgan. Har vazifaga **o'z chegarasi** kerak.

---

## 🎯 Loyihalarni birlashtirish

```
1-loyiha (kutubxona)   →  hamma promptlar BITTA joyda, sifati o'lchangan
        ↓
2-loyiha (few-shot lab) →  nechta misol KERAKLIGINI aniqlash
        ↓
4-loyiha (uz to'plam)   →  o'zbekcha vazifalarga TAYYOR shablonlar
        ↓
3-loyiha (xotirali bot) →  ⭐ suhbat + narx nazorati
```

> ## 🚀 **41-MODULDA (LCEL) BULARNING HAMMASI `|` BILAN BIRLASHADI:**
> ```python
> zanjir = kb.olish("tasnif") | chat | StrOutputParser()
> ```

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
