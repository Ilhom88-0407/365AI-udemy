# 4-dars. `Runnable` va `RunnableSequence` sinflari ⭐⭐

## 🎬 Boshlashdan oldin

> **"`type(chat_template)` ni chop etsak..."**

---

## 1. Hamma narsa `Runnable`

```python
from langchain_core.runnables import Runnable

for x in [chat_template, chat, StrOutputParser()]:
    print(f"{type(x).__name__:32s} Runnable? {isinstance(x, Runnable)}")
```

```
ChatPromptTemplate               Runnable? True
ChatOpenAI                       Runnable? True
StrOutputParser                  Runnable? True
```

> ## 🔑 **MANA NIMA UCHUN `|` ISHLAYDI.** `Runnable` sinfi `__or__` va `__ror__` ni **aniqlaydi**.

---

## 2. ⭐⭐ `Runnable` ning to'liq interfeysi

```python
print([m for m in dir(Runnable) if not m.startswith("_")])
```

```
['InputType', 'OutputType', 'abatch', 'abatch_as_completed', 'ainvoke',
 'as_tool', 'assign', 'astream', 'astream_events', 'astream_log',
 'atransform', 'batch', 'batch_as_completed', 'bind', 'config_schema',
 'config_specs', 'get_config_jsonschema', 'get_graph',
 'get_input_jsonschema', 'get_input_schema', 'get_name',
 'get_output_jsonschema', 'get_output_schema', 'get_prompts',
 'input_schema', 'invoke', 'map', 'output_schema', 'pick', 'pipe',
 'stream', 'stream_events', 'transform', 'with_alisteners',
 'with_config', 'with_fallbacks', 'with_listeners', 'with_retry',
 'with_types']
```

> ## 🏆 **HAR KOMPONENT — PROMPT, MODEL, PARSER, RETRIEVER — SHU 40 METODGA EGA.**
>
> Bu — LCEL'ning **haqiqiy qiymati**: siz **bitta interfeys** o'rganasiz, u **hamma joyda** ishlaydi.

### Kursda ko'rsatilmagan ENG FOYDALI metodlar

| Metod | Nima qiladi | Kursda |
|---|---|---|
| `invoke` / `batch` / `stream` | asosiy | ✅ |
| `ainvoke` / `abatch` / `astream` | async | ❌ |
| ## `with_retry` | ## **avtomatik qayta urinish** | ❌ |
| ## `with_fallbacks` | ## **zaxira zanjir** | ❌ |
| ## `assign` | lug'atga **maydon qo'shish** | qisman |
| ## `pick` | lug'atdan **maydon tanlash** | ❌ |
| ## `map` | **ro'yxatning har elementiga** | ❌ |
| `bind` | parametrni **oldindan biriktirish** | ❌ |
| `with_config` | ish vaqti **sozlamalari** | ❌ |
| `as_tool` | zanjirni **agent vositasiga** aylantirish | ❌ |
| `get_graph` | ## **grafni chizish** | ✅ *(6-dars)* |

---

## 3. ⭐ `with_retry` — ishlab chiqarish uchun MAJBURIY

```python
xato_soni = {"n": 0}

def baazan_xato(x):
    xato_soni["n"] += 1
    if xato_soni["n"] < 3:
        raise ValueError("vaqtinchalik xato")
    return "muvaffaqiyat"

r = RunnableLambda(baazan_xato).with_retry(stop_after_attempt=5)
print(r.invoke(None), f"({xato_soni['n']} urinish)")
```

```
muvaffaqiyat (3 urinish)
```

> ## 🏆 **TARMOQ XATOSI, RATE LIMIT, VAQTINCHALIK 500 — HAMMASI O'ZI TUZATILADI.**
>
> ```python
> chain = (chat_template
>          | chat.with_retry(stop_after_attempt=3,
>                            wait_exponential_jitter=True)   # ⭐ orqaga chekinish
>          | parser)
> ```
>
> ## ⚠️ **`wait_exponential_jitter=True`** — usiz qayta urinishlar **darhol** ketadi va rate limit'ni **yanada yomonlashtiradi**.

---

## 4. ⭐ `with_fallbacks` — zaxira zanjir

```python
r = RunnableLambda(lambda x: 1 / 0).with_fallbacks(
        [RunnableLambda(lambda x: "zaxira javob")])
print(r.invoke(None))
```

```
zaxira javob
```

> ## 🏆 **AMALIY QO'LLANMA — MODEL ZAXIRASI:**
> ```python
> asosiy  = chat_template | ChatOpenAI(model="gpt-4o")      | parser
> zaxira  = chat_template | ChatOpenAI(model="gpt-4o-mini") | parser
> mahalliy = chat_template | ChatOllama(model="qwen2.5")    | parser
>
> ishonchli = asosiy.with_fallbacks([zaxira, mahalliy])
> ```
>
> ## 💡 **OpenAI ishlamay qolsa — Ollama'ga o'tadi.** Sifat pastroq, lekin xizmat **to'xtamaydi**.

---

## 5. ⭐ `map` — ro'yxatning har elementiga

```python
m = RunnableLambda(lambda x: x * 2).map()
print(m.invoke([1, 2, 3]))          # [2, 4, 6]
```

> ## 💡 **`batch` DAN FARQI:**
> ```
> batch  →  ALOHIDA chaqiruvlar, parallel
> map    →  zanjir ICHIDA ro'yxatni qayta ishlaydi
> ```
> **`map` zanjirning O'RTASIDA ishlatiladi**, `batch` — tashqarisida.

---

## 6. ⭐ `assign` va `pick`

```python
from langchain_core.runnables import RunnablePassthrough

p = RunnablePassthrough.assign(kv=lambda d: d["n"] ** 2)
print(p.invoke({"n": 5}))                                    # {'n': 5, 'kv': 25}
print((p | RunnableLambda(lambda d: d)).pick(["kv"]).invoke({"n": 5}))   # {'kv': 25}
```

```
assign  →  lug'atga YANGI maydon qo'shadi (eskilarni saqlaydi)
pick    →  lug'atdan FAQAT kerakli maydonni oladi
```

> ## 💡 **`pick` — NARX TEJASH VOSITASI.** Zanjir oxirida keraksiz maydonlarni **tashlab**, faqat kerakligini qoldirasiz.

---

## 7. ⭐ `bind` — parametrni oldindan biriktirish

```python
qatiy_chat = chat.bind(temperature=0, max_tokens=50)
ijodiy_chat = chat.bind(temperature=0.9, max_tokens=300)

tasnif_zanjir = tasnif_shablon | qatiy_chat | parser
ijod_zanjir   = ijod_shablon   | ijodiy_chat | StrOutputParser()
```

> ## 🏆 **BITTA `chat` OBYEKTI — TURLI SOZLAMALAR.** Har vazifaga **o'z parametri**.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `|` nima uchun ishlaydi?

**M2.** `Runnable` da nechta metod bor?

**M3.** `with_retry` nima uchun?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `Runnable` sinfi **`__or__`** ni aniqlaydi.

**M2.** ## **~40 ta** — `invoke`, `batch`, `stream` va ularning **async** versiyalari, plus `with_retry`, `with_fallbacks`, `assign`, `pick`, `map`, `bind`...

**M3.** ## **Vaqtinchalik xatolarni** *(tarmoq, rate limit)* avtomatik tuzatish.

</details>

### 🟡 O'rta

**M4.** ⭐ Hamma komponent `Runnable` ekanini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import Runnable
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

for x in [ChatPromptTemplate.from_template("{q}"),
          StrOutputParser(), JsonOutputParser(),
          RunnableLambda(lambda x: x)]:
    print(f"{type(x).__name__:24s} {isinstance(x, Runnable)}")
```

</details>

**M5.** ⭐⭐ `with_retry` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import time

sanoq = {"n": 0}
def notekis(x):
    sanoq["n"] += 1
    if sanoq["n"] % 3:
        raise ConnectionError("tarmoq xatosi")
    return f"ok (urinish {sanoq['n']})"

r = RunnableLambda(notekis).with_retry(stop_after_attempt=5,
                                       wait_exponential_jitter=True)
t0 = time.perf_counter()
print(r.invoke(None), f"{time.perf_counter()-t0:.2f}s")
```

## ⚠️ **`wait_exponential_jitter=True` — QAYTA URINISHLAR ORASIDA KUTADI.** Vaqtga e'tibor bering.

</details>

**M6.** ⭐⭐ `with_fallbacks` bilan zaxira zanjir.

<details>
<summary>✅ Yechim</summary>

```python
asosiy = RunnableLambda(lambda x: 1 / 0)
zaxira1 = RunnableLambda(lambda x: 1 / 0)
zaxira2 = RunnableLambda(lambda x: "oxirgi zaxira ishladi")

r = asosiy.with_fallbacks([zaxira1, zaxira2])
print(r.invoke(None))
```

## 🔑 **ZAXIRALAR KETMA-KET SINALADI** — birinchi ishlaganida to'xtaydi.

</details>

**M7.** ⭐ `assign`, `pick`, `map` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnablePassthrough

p = RunnablePassthrough.assign(kvadrat=lambda d: d["n"] ** 2,
                               kub=lambda d: d["n"] ** 3)
print("assign:", p.invoke({"n": 3}))

z = p | RunnableLambda(lambda d: d)
print("pick  :", z.pick(["kvadrat"]).invoke({"n": 3}))
print("map   :", RunnableLambda(lambda x: x * 10).map().invoke([1, 2, 3]))
```

</details>

### 🔴 Qiyin

**M8.** ⭐⭐⭐ Ishlab chiqarishga tayyor zanjir yasang.

<details>
<summary>✅ Yechim</summary>

```python
def ishonchli_zanjir(shablon, asosiy_chat, zaxira_chat, parser,
                     urinish=3, max_concurrency=5):
    """Retry + fallback + config bilan zanjir."""
    asosiy = (shablon
              | asosiy_chat.with_retry(stop_after_attempt=urinish,
                                       wait_exponential_jitter=True)
              | parser)
    zaxira = (shablon
              | zaxira_chat.with_retry(stop_after_attempt=2)
              | parser)
    return (asosiy
            .with_fallbacks([zaxira])
            .with_config({"max_concurrency": max_concurrency,
                          "run_name": "ishonchli_zanjir"}))
```

## 🏆 **UCHTA HIMOYA:** `retry` *(vaqtinchalik xato)* · `fallbacks` *(model ishlamasa)* · `max_concurrency` *(rate limit)*.

</details>

**M9.** ⭐⭐ `bind` bilan bitta modeldan ikkita profil.

<details>
<summary>✅ Yechim</summary>

```python
qatiy  = chat.bind(temperature=0, max_tokens=20)
ijodiy = chat.bind(temperature=0.9, max_tokens=200)

tasnif = ChatPromptTemplate.from_template(
    "Classify sentiment as one word: {matn}") | qatiy | StrOutputParser()
sheriy = ChatPromptTemplate.from_template(
    "Write a short poem about {matn}") | ijodiy | StrOutputParser()

print("tasnif:", tasnif.invoke({"matn": "I love this"}))
print("she'r :", sheriy.invoke({"matn": "Tashkent"})[:120])
```

## 🏆 **BITTA MODEL OBYEKTI — HAR VAZIFAGA O'Z SOZLAMASI.**

</details>

---

## 📌 Xulosa

```
HAMMA komponent  →  Runnable  →  ~40 metod
                                  invoke · batch · stream  (+ async)
                                  ⭐ with_retry · with_fallbacks
                                  ⭐ assign · pick · map · bind
                                  get_graph
```

| Kursda | Kursda YO'Q, lekin MUHIM |
|---|---|
| `invoke` `batch` `stream` | ## `with_retry` · `with_fallbacks` |
| `get_graph` | ## `assign` · `pick` · `map` · `bind` |
| — | `ainvoke` `abatch` `astream` |
| — | `as_tool` · `with_config` |

---

⬅️ [3-dars. Streaming](03-Streaming.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Zanjirlarni ulash va RunnablePassthrough](05-Piping-Chains-RunnablePassthrough.md)
