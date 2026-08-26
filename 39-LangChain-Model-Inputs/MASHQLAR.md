# 📝 39-modul mashqlari

> **34 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **KO'PCHILIGI API KALITISIZ ISHLAYDI** — shablonlar **modelsiz** ham quriladi.

## ⚙️ Tayyorgarlik

```bash
pip install langchain langchain-core langchain-openai python-dotenv tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, re, tiktoken, pandas as pd
from dotenv import load_dotenv
load_dotenv(override=True)

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.prompts import (PromptTemplate, ChatPromptTemplate,
                                    MessagesPlaceholder,
                                    SystemMessagePromptTemplate,
                                    HumanMessagePromptTemplate,
                                    AIMessagePromptTemplate,
                                    FewShotChatMessagePromptTemplate)
from langchain_core.output_parsers import StrOutputParser
```

### Model — kalit bilan yoki kalitsiz

```python
def chat_yasa(temperature=0, max_tokens=200, seed=365):
    import importlib.util
    if importlib.util.find_spec("langchain_openai") and os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature,
                          max_tokens=max_tokens, seed=seed)
    if importlib.util.find_spec("langchain_ollama"):
        from langchain_ollama import ChatOllama
        return ChatOllama(model="qwen2.5", temperature=temperature,
                          num_predict=max_tokens, seed=seed)
    raise RuntimeError("Provayder yo'q: pip install langchain-ollama")

chat = chat_yasa()          # ⚠️ shablon mashqlari uchun KERAK EMAS
```

---

# 🟢 OSON *(1–12)*

**M1.** LangChain'ning uchta moduli?

**M2.** Prompt shabloni oddiy promptdan nimasi bilan farq qiladi?

**M3.** LangChain'da `user` roli qanday ataladi?

**M4.** `invoke` qanday kirishlarni qabul qiladi?

**M5.** `chat.invoke()` nima qaytaradi?

**M6.** `PromptTemplate.invoke()` nima qaytaradi?

<details>
<summary>✅ Javoblar M1–M6</summary>

**M1.** ## **Model I/O** · **Retrieval** · **Agent tooling** *(+ **LCEL**)*.

**M2.** Unda **joy egallovchilar** *(`{pet}`)* bor — **qayta ishlatiladi**.

**M3.** ## **`HumanMessage`** *(`.type == 'human'`)*.

**M4.** **satr** · **xabarlar ro'yxati** · **`PromptValue`**.

**M5.** ## **`AIMessage`**.

**M6.** ## **`StringPromptValue`** *(`.text`)*. `ChatPromptTemplate` esa — **`ChatPromptValue`** *(`.messages`)*.

</details>

**M7.** `input_variables` qanday aniqlanadi?

**M8.** `seed` ni bugun qanday berish kerak?

**M9.** `AIMessage` ikki vazifasi?

**M10.** `FewShotChatMessagePromptTemplate` ga nima beriladi?

**M11.** Shablonda `{"a": 1}` yozsangiz nima bo'ladi?

**M12.** `MessagesPlaceholder` nima uchun?

<details>
<summary>✅ Javoblar M7–M12</summary>

**M7.** ## **Avtomatik** — shablondagi `{...}` lardan.

**M8.** ## **Bevosita:** `ChatOpenAI(model=..., seed=365)`.

**M9.** ① modelning **javobi** · ② few-shot **misoli**.

**M10.** `examples` *(lug'atlar ro'yxati)* + `example_prompt`.

**M11.** ## 💥 `"a"` **o'zgaruvchi** deb qabul qilinadi → `KeyError`. Yechim: `{{"a": 1}}`.

**M12.** Shablonga **xabarlar ro'yxatini** *(suhbat tarixini)* joylashtirish uchun.

</details>

---

# 🟡 O'RTA *(13–26)*

**M13.** ⭐ Kursning importlari bugun ishlaydimi?

<details>
<summary>✅ Yechim</summary>

```python
import importlib
for mod, nom in [
    ("langchain_openai.chat_models", "ChatOpenAI"),
    ("langchain_core.messages", "SystemMessage"),
    ("langchain_core.prompts", "PromptTemplate"),
    ("langchain_core.prompts.chat", "SystemMessagePromptTemplate"),
    ("langchain_core.prompts", "FewShotChatMessagePromptTemplate"),
    ("langchain.agents", "AgentExecutor"),
]:
    try:
        m = importlib.import_module(mod)
        print(f"{'✅' if hasattr(m, nom) else '⚠️ '} {mod}.{nom}")
    except ModuleNotFoundError:
        print(f"❌ {mod}.{nom}")
```

## ✅ **BU MODULNING HAMMA IMPORTI ISHLAYDI.** Faqat `AgentExecutor` yo'q.

</details>

**M14.** ⭐⭐ `model_kwargs={"seed":365}` bilan nima bo'ladi?

<details>
<summary>✅ Yechim</summary>

```python
import warnings
os.environ.setdefault("OPENAI_API_KEY", "sk-fake")
from langchain_openai import ChatOpenAI

with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter("always")
    c = ChatOpenAI(model="gpt-4o-mini", model_kwargs={"seed": 365})
    print("model_kwargs:", c.model_kwargs, " seed:", c.seed)
    for x in w:
        print("⚠️", x.message)
```

```
model_kwargs: {}  seed: 365
⚠️ Parameters {'seed'} should be specified explicitly...
```

</details>

**M15.** ⭐ `ChatOpenAI` maydonlarini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
f = ChatOpenAI.model_fields
for p in sorted(["model_name", "model_kwargs", "temperature", "max_tokens",
                 "seed", "streaming", "n", "top_p", "stop", "request_timeout"]):
    print(f"{'✅' if p in f else '❌'}  {p}")
print("model_name aliasi:", f["model_name"].alias)
```

</details>

**M16.** ⭐ Xabar sinflarining `.type` qiymatlarini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
for M in [SystemMessage, HumanMessage, AIMessage]:
    print(f"{M.__name__:16s} type={M(content='x').type!r}")
```

```
SystemMessage    type='system'
HumanMessage     type='human'
AIMessage        type='ai'
```

</details>

**M17.** ⭐ Sinf va kortej yozuvi bir xilmi?

<details>
<summary>✅ Yechim</summary>

```python
a = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template("{d}"),
        HumanMessagePromptTemplate.from_template("{q}")])
b = ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])
print(a.invoke({"d": "X", "q": "Y"}).messages ==
      b.invoke({"d": "X", "q": "Y"}).messages)
```

```
True
```

## ✅ **KORTEJLAR — kamroq import, kamroq kod.**

</details>

**M18.** ⭐ Shablonni bir necha qiymatda ishlating.

<details>
<summary>✅ Yechim</summary>

```python
ct = ChatPromptTemplate.from_messages([
    ("system", "{description}"),
    ("human", "I've recently adopted a {pet}. Suggest some {pet} names?")])

for pet in ["dog", "cat", "fish"]:
    cv = ct.invoke({"description": "Be brief.", "pet": pet})
    print(f"{pet:5s} → {[m.content[:40] for m in cv.messages]}")
```

</details>

**M19.** ⭐⭐ Figurali qavs tuzog'ini takrorlang.

<details>
<summary>✅ Yechim</summary>

```python
try:
    ChatPromptTemplate.from_messages(
        [("human", 'Format: {"ism": "..."} · Savol: {q}')]).invoke({"q": "x"})
except KeyError as e:
    print("❌", str(e)[:130])

ok = ChatPromptTemplate.from_messages(
    [("human", 'Format: {{"ism": "..."}} · Savol: {q}')])
print("✅", ok.invoke({"q": "x"}).messages[0].content)
```

</details>

**M20.** ⭐ `.partial()` bilan tuzating.

<details>
<summary>✅ Yechim</summary>

```python
p = ChatPromptTemplate.from_messages(
    [("human", "Format: {fmt} · Savol: {q}")]).partial(fmt='{"ism": "..."}')
print(p.input_variables)                      # ['q'] — fmt allaqachon to'ldirilgan
print(p.invoke({"q": "x"}).messages[0].content)
```

</details>

**M21.** ⭐ Yetishmayotgan o'zgaruvchini sinang.

<details>
<summary>✅ Yechim</summary>

```python
ct = ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])
try:
    ct.invoke({"q": "test"})
except KeyError as e:
    print("✅ ushlandi:", str(e)[:100])
```

## 🔑 **f-string bo'lsa — `None` JIM o'tib ketardi.**

</details>

**M22.** ⭐⭐ `MessagesPlaceholder` bilan tarix qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
ct = ChatPromptTemplate.from_messages([
    ("system", "Siz {rol}siz."),
    MessagesPlaceholder("tarix"),
    ("human", "{savol}")])

cv = ct.invoke({"rol": "bank yordamchisi",
                "tarix": [HumanMessage(content="Salom"),
                          AIMessage(content="Salom! Qanday yordam bera olaman?")],
                "savol": "Depozit foizi qancha?"})
for m in cv.messages:
    print(f"  {m.type:7s}: {m.content[:50]}")
```

</details>

**M23.** ⭐⭐ Few-shot shablonini qurib, xabarlarni ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
th = HumanMessagePromptTemplate.from_template("Classify: {matn}")
ta = AIMessagePromptTemplate.from_template("{yorliq}")
ex_t = ChatPromptTemplate.from_messages([th, ta])

examples = [{"matn": "This movie is extraordinary", "yorliq": "positive"},
            {"matn": "This album is all right", "yorliq": "neutral"},
            {"matn": "Could not have been written worse", "yorliq": "negative"}]

fs = FewShotChatMessagePromptTemplate(examples=examples, example_prompt=ex_t,
                                      input_variables=["matn"])
ct = ChatPromptTemplate.from_messages([
    ("system", "Classify sentiment as exactly one word."), fs, th])

for m in ct.invoke({"matn": "This new song blew my mind"}).messages:
    print(f"{m.type:7s}: {m.content}")
```

</details>

**M24.** ⭐ Few-shot misollarining token narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
enc = tiktoken.get_encoding("o200k_base")

def narx(n):
    fs2 = FewShotChatMessagePromptTemplate(
        examples=examples[:n], example_prompt=ex_t, input_variables=["matn"])
    ct2 = ChatPromptTemplate.from_messages([("system", "Classify."), fs2, th])
    cv = ct2.invoke({"matn": "test"})
    return sum(len(enc.encode(m.content)) + 4 for m in cv.messages)

for n in range(len(examples) + 1):
    print(f"{n} misol → {narx(n):3d} token")
```

## 💡 **HAR MISOL — DOIMIY XARAJAT.**

</details>

**M25.** ⭐ Uch qavatli qo'shtirnoqning bo'shliq isrofini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
BOSHLIQLI = """    I've recently adopted a dog.
    Could you suggest some dog names?    """
TOZA = "I've recently adopted a dog. Could you suggest some dog names?"
print(f"bo'shliqli: {len(enc.encode(BOSHLIQLI)):3d} token")
print(f"toza      : {len(enc.encode(TOZA)):3d} token")
```

</details>

**M26.** ⭐ LCEL zanjirining tuzilishini ko'ring *(modelsiz)*.

<details>
<summary>✅ Yechim</summary>

```python
ct = ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])
zanjir = ct | StrOutputParser()
print("turi    :", type(zanjir).__name__)
print("qadamlar:", [type(s).__name__ for s in zanjir.steps])
```

```
turi    : RunnableSequence
qadamlar: ['ChatPromptTemplate', 'StrOutputParser']
```

## ⭐ **41-MODULNING OLDINDAN KO'RINISHI.**

</details>

---

# 🔴 QIYIN *(27–34)*

**M27.** ⭐⭐ Shablon tekshiruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
def shablon_tekshir(matn):
    muammolar = []
    for m in re.findall(r"\{([^{}]*)\}", matn):
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", m.strip()):
            muammolar.append(f"💥 {{{m}}} — o'zgaruvchi nomiga o'xshamaydi; "
                             f"JSON bo'lsa {{{{...}}}} yozing")
    if matn.count("{") != matn.count("}"):
        muammolar.append("💥 qavslar soni MOS EMAS")
    if re.search(r"\n[ \t]{4,}", matn):
        muammolar.append("⚠️ qator boshida ortiqcha bo'shliq — token isrofi")
    print("\n".join(muammolar) if muammolar else "✅ toza")
    return muammolar

shablon_tekshir('JSON: {"a": 1}, savol: {q}')
shablon_tekshir("System:\n    {description}\nHuman: {q}")
```

</details>

**M28.** ⭐⭐ Sistem prompt tekshiruvchisi *(4 element)*.

<details>
<summary>✅ Yechim</summary>

```python
def sistem_tekshir(sp):
    past = sp.lower()
    t = {"① ROL": bool(re.search(r"you are|siz\b", past)),
         "② VAZIFA": bool(re.search(r"answer|classify|summar|translat|javob", past)),
         "③ FORMAT": bool(re.search(r"sentence|word|json|list|format|jumla", past)),
         "④ CHEGARA": bool(re.search(r"if.*(unsure|not|unknown)|never|only|exactly", past))}
    for k, v in t.items():
        print(f"{'✅' if v else '❌'} {k}")
    return t

sistem_tekshir("You are Marv, a sarcastic chatbot.")
print()
sistem_tekshir("You are a bank assistant. Answer questions about deposits. "
               "Reply in at most 3 sentences. If unsure, reply exactly: "
               "'Operatorga murojaat qiling.'")
```

</details>

**M29.** ⭐⭐ Xotirali suhbat — `MessagesPlaceholder` bilan.

<details>
<summary>✅ Yechim</summary>

```python
ct = ChatPromptTemplate.from_messages([
    ("system", "Siz yordamchisiz. Qisqa javob bering."),
    MessagesPlaceholder("tarix"),
    ("human", "{savol}")])

tarix = []
def sora(savol):
    cv = ct.invoke({"tarix": tarix, "savol": savol})
    r = chat.invoke(cv)
    tarix.extend([HumanMessage(content=savol), r])
    return r.content

print(sora("Ismim Alisher"))
print(sora("Ismim nima?"))
print(f"\ntarix: {len(tarix)} xabar")
```

## 🏆 **`ConversationChain` NING ZAMONAVIY O'RNINI BOSUVCHISI.**

</details>

**M30.** ⭐⭐ Tarixni qisqartiruvchi qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
enc = tiktoken.get_encoding("o200k_base")

def qisqart(tarix, max_token=800):
    while tarix and sum(len(enc.encode(m.content)) + 4 for m in tarix) > max_token:
        del tarix[:2]                    # human + ai juftligi
    return tarix

# sora() ichida:
#   qisqart(tarix)
#   cv = ct.invoke({"tarix": tarix, "savol": savol})
```

## 🔑 **Usiz narx `O(n²)`** *(35-modul)*.

</details>

**M31.** ⭐⭐ `LengthBasedExampleSelector` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.example_selectors import LengthBasedExampleSelector

for lim in [30, 80, 300]:
    sel = LengthBasedExampleSelector(examples=examples,
                                     example_prompt=ex_t, max_length=lim)
    fs2 = FewShotChatMessagePromptTemplate(example_selector=sel,
                                           example_prompt=ex_t)
    ct2 = ChatPromptTemplate.from_messages([fs2, th])
    n = len(ct2.invoke({"matn": "test"}).messages)
    print(f"max_length={lim:3d} → {n} xabar ({(n-1)//2} misol)")
```

## ⚠️ **`max_length` — TOKEN EMAS, SO'Z.**

</details>

**M32.** ⭐⭐ Misollar soni ↔ aniqlik egri chizig'i.

<details>
<summary>✅ Yechim</summary>

```python
BARCHA = [("This movie is extraordinary", "positive"),
          ("Absolutely loved it", "positive"),
          ("This album is all right", "neutral"),
          ("It exists, I guess", "neutral"),
          ("Could not have been written worse", "negative"),
          ("Complete waste of money", "negative")]
OLTIN = [("This new song blew my mind", "positive"),
         ("It was fine, nothing special", "neutral"),
         ("Worst purchase I've ever made", "negative")]

n = []
for k in [0, 2, 4, 6]:
    ex = [{"matn": m, "yorliq": y} for m, y in BARCHA[:k]]
    fs2 = (FewShotChatMessagePromptTemplate(examples=ex, example_prompt=ex_t,
                                            input_variables=["matn"])
           if ex else None)
    parts = [("system", "Classify sentiment as exactly one word: "
                        "positive, neutral, or negative.")]
    if fs2:
        parts.append(fs2)
    parts.append(th)
    ct2 = ChatPromptTemplate.from_messages(parts)
    tog = sum(chat.invoke(ct2.invoke({"matn": m})).content.strip().lower() == kt
              for m, kt in OLTIN)
    n.append({"misollar": k, "aniqlik": round(tog/len(OLTIN), 2),
              "token": narx(k) if k <= len(examples) else None})
print(pd.DataFrame(n).to_string(index=False))
print("bazaviy (3 sinf): 0.33")
```

</details>

**M33.** ⭐⭐⭐ Ko'p tilli shablon fabrikasi.

<details>
<summary>✅ Yechim</summary>

```python
class KopTilliShablon:
    SISTEM = {
        "uz": "You are a helpful assistant. Answer in Uzbek, in at most {n} "
              "sentences. If unsure, reply exactly: 'Aniq bilmayman.'",
        "en": "You are a helpful assistant. Answer in English, in at most {n} "
              "sentences. If unsure, reply exactly: 'I am not sure.'",
    }

    def __init__(self, chat, n_jumla=3):
        self.chat, self.n = chat, n_jumla

    def shablon(self, til="uz"):
        return ChatPromptTemplate.from_messages([
            ("system", self.SISTEM[til].replace("{n}", str(self.n))),
            MessagesPlaceholder("tarix", optional=True),
            ("human", "{savol}")])

    def sora(self, savol, til="uz", tarix=None):
        cv = self.shablon(til).invoke({"savol": savol, "tarix": tarix or []})
        return self.chat.invoke(cv).content

k = KopTilliShablon(chat)
for til in ["uz", "en"]:
    print(f"[{til}] {k.sora('What is a bank deposit?', til)[:110]}")
```

## 💡 **`optional=True`** — `MessagesPlaceholder` majburiy bo'lmaydi.

</details>

**M34.** ⭐⭐⭐ Shablon kutubxonasi sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class ShablonKutubxona:
    """Loyihaning HAMMA promptlari bitta joyda — versiyalangan va o'lchangan."""

    def __init__(self, enc="o200k_base"):
        self.shablonlar = {}
        self.enc = tiktoken.get_encoding(enc)

    def qosh(self, nom, sistem, human, few_shot=None, tarix=False):
        parts = [("system", sistem)]
        if few_shot is not None:
            parts.append(few_shot)
        if tarix:
            parts.append(MessagesPlaceholder("tarix", optional=True))
        parts.append(("human", human))
        self.shablonlar[nom] = ChatPromptTemplate.from_messages(parts)
        return self

    def olish(self, nom):
        return self.shablonlar[nom]

    def hisobot(self, namuna_qiymatlar):
        q = []
        for nom, ct in self.shablonlar.items():
            try:
                cv = ct.invoke(namuna_qiymatlar.get(nom, {}))
                tok = sum(len(self.enc.encode(m.content)) + 4 for m in cv.messages)
                q.append({"shablon": nom, "o'zgaruvchilar": len(ct.input_variables),
                          "xabarlar": len(cv.messages), "token": tok, "holat": "✅"})
            except Exception as e:
                q.append({"shablon": nom, "o'zgaruvchilar": len(ct.input_variables),
                          "xabarlar": None, "token": None,
                          "holat": f"❌ {type(e).__name__}"})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        if d.token.notna().any():
            print(f"\ndoimiy token yuki: {int(d.token.sum())} "
                  f"(har chaqiruvda yuboriladi)")
        return d

kb = (ShablonKutubxona()
      .qosh("tasnif", "Classify sentiment as exactly one word.", "{matn}")
      .qosh("xulosa", "Summarize in at most 2 sentences.", "{matn}", tarix=True))
kb.hisobot({"tasnif": {"matn": "test"}, "xulosa": {"matn": "test", "tarix": []}})
```

## 🏆 **HAMMA PROMPT BITTA JOYDA** — o'zgartirish oson, narx ko'rinadi, sinov yozish mumkin.

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
