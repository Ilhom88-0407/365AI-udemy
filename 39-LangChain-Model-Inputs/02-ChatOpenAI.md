# 2-dars. ChatOpenAI ⭐

## 🎬 Boshlashdan oldin

> **"Birinchi vazifamiz — LangChain kutubxonasini langchain_env muhitiga o'rnatish."**

---

## 1. O'rnatish

```bash
conda activate langchain_env          # yoki: .venv\Scripts\activate
pip install langchain langchain-openai
```

> ## ⚠️ **35-MODULNI ESLANG:** bugun bu `langchain 1.3.x` ni o'rnatadi. Kursning **xotira** va **zanjir** darslari ishlamaydi — lekin **bu modulning hamma kodi ishlaydi** *(biz tekshirdik)*.

```python
%load_ext dotenv
%dotenv
# yoki universal:  from dotenv import load_dotenv; load_dotenv(override=True)

from langchain_openai.chat_models import ChatOpenAI
```

---

## 2. ⭐⭐ `seed` — kursning eng ko'p muhokama qilingan joyi

> **"Hujjatlarni ko'rib chiqsak, `seed` ro'yxatda YO'Q. Shuning uchun uni to'g'ridan-to'g'ri argument sifatida ishlata olmaymiz. Bunday qo'shimcha parametrlar `model_kwargs` yordamida qo'shiladi."**

```python
# KURSDAGI KOD
chat = ChatOpenAI(model_name="gpt-4",
                  model_kwargs={"seed": 365},
                  temperature=0,
                  max_tokens=100)
```

Biz **sinab ko'rdik**:

```python
import warnings
with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter("always")
    chat = ChatOpenAI(model="gpt-4o-mini", model_kwargs={"seed": 365},
                      temperature=0, max_tokens=100)
    print("model_kwargs:", chat.model_kwargs)
    print("seed        :", chat.seed)
    for x in w:
        print(x.category.__name__, ":", x.message)
```

```
model_kwargs: {}
seed        : 365
UserWarning : Parameters {'seed'} should be specified explicitly.
              Instead they were passed in as part of `model_kwargs` parameter.
```

> ## 💥💥 **KURSNING DA'VOSI ENDI ESKIRGAN — `seed` ARTIQ TO'G'RIDAN-TO'G'RI PARAMETR.**
>
> ```
> Kurs davri  →  seed hujjatda YO'Q  →  model_kwargs SHART edi
> Bugun       →  seed BEVOSITA parametr  ⭐
> ```
>
> ## ✅ **LangChain kursning kodini AVTOMATIK tuzatadi** — `seed` ni `model_kwargs` dan **chiqarib oladi** *(`model_kwargs` **bo'sh** qoladi!)* va **ogohlantirish** beradi.
>
> ## ✅ **ZAMONAVIY YOZUV:**
> ```python
> chat = ChatOpenAI(model="gpt-4o-mini", seed=365,
>                   temperature=0, max_tokens=100)
> ```

### Qaysi parametrlar bor? — o'zingiz tekshiring

```python
f = ChatOpenAI.model_fields
for p in ["model_name", "model_kwargs", "temperature", "max_tokens",
          "seed", "streaming", "n", "top_p", "request_timeout",
          "reasoning_effort"]:
    print(f"{'✅' if p in f else '❌'}  {p}")
```

```
✅  model_name          (aliasi: model)
✅  model_kwargs
✅  temperature
✅  max_tokens
✅  seed                ⭐ endi BEVOSITA
✅  streaming
✅  n
✅  top_p
✅  request_timeout     ⚠️ timeout EMAS
❌  reasoning_effort    (bor, lekin yangi modellar uchun)
```

> ## 💡 **`model` VA `model_name` — IKKALASI HAM ISHLAYDI:**
> ```python
> print(ChatOpenAI.model_fields["model_name"].alias)     # 'model'
> ChatOpenAI(model="gpt-4o-mini")        ✅
> ChatOpenAI(model_name="gpt-4o-mini")   ✅
> ```

---

## 3. `invoke` — LangChain'ning bosh metodi

> **"`invoke` — LangChain'dagi ASOSIY metod. Hozircha shuni bilish muhimki, u turli kirishlarni qabul qiladi, shu jumladan foydalanuvchi promptini o'z ichiga olgan satr tipidagi obyektni."**

```python
response = chat.invoke("""I've recently adopted a dog.
Could you suggest some dog names?""")

print(type(response).__name__)      # AIMessage
print(response.content)
```

> ## ⭐⭐ **`invoke` UCHTA KIRISHNI QABUL QILADI — VA BU KURSNING ASOSIY G'OYASI:**
> ```
> ① satr                    →  "Salom"
> ② xabarlar RO'YXATI       →  [SystemMessage(...), HumanMessage(...)]
> ③ PromptValue obyekti     →  chat_template.invoke(...) natijasi
> ```
> **③ — eng muhimi.** Aynan u **zanjir** *(chain)* g'oyasini mumkin qiladi: bir `invoke` ning **chiqishi** ikkinchisining **kirishi** bo'ladi.

---

## 4. Uch qavatli qo'shtirnoq

> **"Ba'zan kurs davomida meni promptlarni bitta yoki ikkita emas, UCH QAVATLI qo'shtirnoq ichida yozayotganimni ko'rasiz."**

```python
prompt = """I've recently adopted a dog.
Could you suggest some 'nice' and "creative" names?"""
```

```
✅ Yangi qatorga o'tish OSON
✅ ' va " ni ICHIDA ishlatish mumkin
```

> ## ⚠️ **LEKIN BITTA TUZOQ BOR — ORTIQCHA BO'SHLIQ:**
> ```python
> prompt = """ I've recently adopted a dog.
>              Could you suggest some names? """
> ```
> Har qatordagi **bo'shliqlar promptga kiradi** va **token yeydi** *(36-modul: bo'shliq token ichida!)*.
>
> ## ✅ **YECHIM — `textwrap.dedent` yoki qatorlarni birlashtirish:**
> ```python
> prompt = ("I've recently adopted a dog. "
>           "Could you suggest some names?")
> ```

---

## 5. `max_tokens` — javobni qisqartirish

> **"Bu ancha uzun javob ekaniga hammamiz rozimiz. Keling, completion tokenlarining maksimal sonini, masalan, 100 ga cheklaymiz."**

```python
chat = ChatOpenAI(model="gpt-4o-mini", seed=365, temperature=0, max_tokens=100)
```

> ## ⚠️ **VA `finish_reason` NI TEKSHIRING** *(38-modul, 3-dars)*:
> ```python
> r = chat.invoke("Explain black holes")
> print(r.response_metadata.get("finish_reason"))
> ```
> LangChain buni **`response_metadata`** ichida saqlaydi. `'length'` bo'lsa — javob **kesilgan**.

---

## 6. ⭐ Kalitsiz muqobil — bir satr

Butun bu modul **API kalitisiz** o'tiladi:

```python
# ① Ollama (tavsiya)
from langchain_ollama import ChatOllama
chat = ChatOllama(model="qwen2.5", temperature=0)

# ② yoki OpenAI-mos server orqali
from langchain_openai import ChatOpenAI
chat = ChatOpenAI(model="qwen2.5", api_key="ollama",
                  base_url="http://localhost:11434/v1", temperature=0)
```

> ## 🔑 **QOLGAN HAMMA KOD — `invoke`, xabarlar, shablonlar, zanjirlar — AYNAN BIR XIL.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `invoke` qanday kirishlarni qabul qiladi?

**M2.** `invoke` nima qaytaradi?

**M3.** `seed` ni bugun qanday berish kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **satr** · **xabarlar ro'yxati** · **`PromptValue`** obyekti.

**M2.** ## **`AIMessage`** — javob `.content` da.

**M3.** ## **Bevosita:** `ChatOpenAI(model=..., seed=365)`. `model_kwargs` **eskirgan**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ `model_kwargs={"seed":365}` bilan nima bo'lishini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import warnings, os
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
⚠️ Parameters {'seed'} should be specified explicitly. Instead they were
   passed in as part of `model_kwargs` parameter.
```

## 🔑 **LangChain kodni AVTOMATIK tuzatadi** — lekin **ogohlantiradi**.

</details>

**M5.** ⭐ `ChatOpenAI` parametrlarini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
f = ChatOpenAI.model_fields
for p in sorted(["model_name", "model_kwargs", "temperature", "max_tokens",
                 "seed", "streaming", "n", "top_p", "stop",
                 "request_timeout", "presence_penalty", "frequency_penalty"]):
    print(f"{'✅' if p in f else '❌'}  {p}")
print("\nmodel_name aliasi:", f["model_name"].alias)
```

## 💡 **API kalitisiz ishlaydi** — bu **maydonlar**, chaqiruv emas.

</details>

**M6.** ⭐ Uch qavatli qo'shtirnoqning token narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

BOSHLIQLI = """    I've recently adopted a dog.
    Could you suggest some dog names?    """
TOZA = "I've recently adopted a dog. Could you suggest some dog names?"

print(f"bo'shliqli: {len(enc.encode(BOSHLIQLI)):3d} token")
print(f"toza      : {len(enc.encode(TOZA)):3d} token")
```

## ⚠️ **HAR CHAQIRUVDA ISROF.** Sistem prompt bo'lsa — **doimiy** isrof.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Kalitsiz `chat` obyektini yasaydigan fabrika.

<details>
<summary>✅ Yechim</summary>

```python
import os, importlib.util

def chat_yasa(temperature=0, max_tokens=200, seed=365):
    if importlib.util.find_spec("langchain_openai") and os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature,
                          max_tokens=max_tokens, seed=seed)
    if importlib.util.find_spec("langchain_ollama"):
        from langchain_ollama import ChatOllama
        return ChatOllama(model="qwen2.5", temperature=temperature,
                          num_predict=max_tokens, seed=seed)
    raise RuntimeError("Provayder yo'q: pip install langchain-ollama")

chat = chat_yasa()
print(type(chat).__name__)
```

## ⚠️ **`ChatOllama` da `max_tokens` EMAS, `num_predict`** — parametr nomlari **provayderga bog'liq**.

</details>

**M8.** ⭐⭐ `finish_reason` ni LangChain'da toping.

<details>
<summary>✅ Yechim</summary>

```python
r = chat.invoke("Explain black holes in detail.")
print("metadata:", r.response_metadata)
print("sabab   :", r.response_metadata.get("finish_reason"))
print("tokenlar:", r.usage_metadata)
```

## 🔑 **`response_metadata` va `usage_metadata` — LangChain'ning `finish_reason` va `usage` ga ekvivalenti.** Kurs ularni **eslatmaydi**.

</details>

---

## 📌 Xulosa

```python
from langchain_openai import ChatOpenAI

chat = ChatOpenAI(model="gpt-4o-mini",    # ⚠️ gpt-4 EMAS
                  seed=365,               # ⭐ model_kwargs EMAS
                  temperature=0,
                  max_tokens=100)

response = chat.invoke("...")             # → AIMessage
print(response.content)
print(response.response_metadata["finish_reason"])   # ⚠️ tekshiring
```

| | Kurs | Bugun |
|---|---|---|
| `seed` | `model_kwargs={"seed":365}` | ## **`seed=365`** |
| Model | `gpt-4` | ## `gpt-4o-mini` |
| `finish_reason` | ❌ | ## ✅ `response_metadata` |
| Kalitsiz variant | ❌ | ## ✅ `ChatOllama` |

---

⬅️ [1-dars. LangChain freymvorki](01-The-LangChain-Framework.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. System va human xabarlar](03-System-and-Human-Messages.md)
