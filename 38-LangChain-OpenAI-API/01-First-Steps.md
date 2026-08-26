# 1-dars. Birinchi qadamlar ⭐

## 🎬 Boshlashdan oldin

> **"Bu darsda birinchi chatbotimizni yaratamiz. Biz Python va OpenAI API'ga tayanamiz. E'tibor bering — biz hali LangChain freymvorkidan foydalanmaymiz."**

---

## 1. Nima uchun avval "yalang'och" API?

> **"Bu bo'lim OpenAI API bilan chatbot yaratishni tanishtiradi va uning asosiy komponentlari bilan tanishtiradi. Chunki LangChain'ning OpenAI integratsiyasi AYNAN SHU API'ga tayanadi, uning qanday ishlashini umumiy tushunish QIMMATLI."**

```
   SIZ  →  LangChain  →  openai paketi  →  OpenAI serveri
                ↑            ↑
          "qulaylik"    ⭐ ASOSIY QATLAM
```

> ## 🔑 **VA BU — TO'G'RI PEDAGOGIKA.** LangChain buzilganda *(35-modulda ko'rganimizdek — u tez-tez buziladi)*, siz **pastki qatlamga** tushib, muammoni **hal qila olasiz**.
>
> ## 💡 **31-MODUL 3–4-DARSLARIDA BUNI QISMAN KO'RGAN EDIK** — u yerda `openai.Completion` **eskirgani** aniqlangan edi.

---

## 2. ⚠️⚠️ Kursning birinchi kod satri — BUGUN ISHLAMAYDI

> **"OS va OpenAI kutubxonalarini import qiling. Keyin `openai.api_key` ni `os.getenv('OPENAI_API_KEY')` ga teng qilib qo'ying."**

```python
# KURSDAGI KOD
import os, openai
openai.api_key = os.getenv("OPENAI_API_KEY")     # ⚠️
client = openai.OpenAI()
```

Biz buni **sinab ko'rdik** *(`openai` 3.3.1)*:

```python
import os, openai
from openai import OpenAI

os.environ.pop("OPENAI_API_KEY", None)           # muhitni tozalaymiz
openai.api_key = "sk-KURSDAGI-USUL"              # kursdagi satr
try:
    c = OpenAI()
except Exception as e:
    print(type(e).__name__, ":", str(e)[:120])
```

```
OpenAIError : Missing credentials. Please pass an `api_key`, `workload_identity`,
`admin_api_key`, or set the `OPENAI_API_KEY` or `OPENAI_ADMIN_KEY` environment variable.
```

> ## 💥💥 **`openai.api_key = ...` SATRI HECH NARSA QILMAYDI.**
>
> `OpenAI()` klienti bu global o'zgaruvchini **o'qimaydi**. U faqat:
> ```
> ① OpenAI(api_key="...")           ← to'g'ridan-to'g'ri
> ② OPENAI_API_KEY muhit o'zgaruvchisi
> ```
> dan oladi.
>
> ## 🔑 **KURSDA U "ISHLAGAN"** — chunki `%dotenv` allaqachon **muhit o'zgaruvchisini** o'rnatgan edi. `openai.api_key` satri esa **shunchaki bezak** bo'lgan.
>
> ## ⚠️ **VA BU XAVFLI:** talaba `openai.api_key` **ishlayapti** deb o'ylaydi va `.env` siz muhitda kod **sirli tarzda** sinadi.

### ✅ To'g'ri usullar — biz tekshirdik

```python
# ① Muhit o'zgaruvchisi orqali  ⭐ TAVSIYA
from dotenv import load_dotenv
load_dotenv(override=True)                       # 37-modul, 3-dars
client = OpenAI()

# ② To'g'ridan-to'g'ri  (sinov uchun)
client = OpenAI(api_key="sk-...")

# ③ Boshqa provayder / mahalliy server
client = OpenAI(api_key="ollama", base_url="http://localhost:11434/v1")
```

```python
c2 = OpenAI(api_key="sk-TOGRI-USUL")
print(c2.api_key)          # 'sk-TOGRI-USUL'    ✅

os.environ["OPENAI_API_KEY"] = "sk-MUHITDAN"
c3 = OpenAI()
print(c3.api_key)          # 'sk-MUHITDAN'      ✅
```

> ## ⭐⭐ **③ VARIANTGA ALOHIDA E'TIBOR BERING — `base_url`.**
>
> Bu — **kursda yo'q**, lekin **eng foydali** narsa: `openai` paketi **har qanday OpenAI-mos serverga** ulanadi. Ollama, LM Studio, vLLM, Groq — **hammasi**.
>
> ## 🔑 **Ya'ni butun bu modulning kodini KALITSIZ ishlatish mumkin:**
> ```python
> client = OpenAI(api_key="ollama", base_url="http://localhost:11434/v1")
> r = client.chat.completions.create(
>         model="qwen2.5",
>         messages=[{"role": "user", "content": "Salom"}])
> ```
> **Qolgan hamma kod — `messages`, `temperature`, `max_tokens`, `stream` — AYNAN BIR XIL.**

---

## 3. Chat completion yaratamiz

> **"`completion` o'zgaruvchisini aniqlang, u bizning chatbot obyektimiz vazifasini bajaradi. Uni `client.chat.completions.create` ga teng qiling."**

```python
completion = client.chat.completions.create(
    model="gpt-4o-mini",                 # ⭐ kurs "gpt-4" deydi
    messages=[
        {"role": "system", "content": "..."},
        {"role": "user",   "content": "..."},
    ],
)
```

> **"Birinchi parametr — MODEL. Men GPT-4 ni tanlayman, lekin siz istalgan OpenAI chat modeli bilan tajriba qilishingiz mumkin."**

> ## ⚠️ **`gpt-4` O'RNIGA `gpt-4o-mini` NI TANLANG** *(36-modul, 2-dars)*:
> ```
> gpt-4         →  56× QIMMAT · oyna 8k · sekin · o'zbekcha uchun yomon tokenizator
> gpt-4o-mini   →  $0.15/$0.60 · oyna 128k · tez · o200k          ⭐
> ```

> **"Ikkinchi majburiy parametr — MESSAGES. U lug'atlar ro'yxatini kutadi, har biri ikkita majburiy kalit-qiymat juftligini o'z ichiga oladi. Birinchi juftlikning kaliti — ROLE, u system, user, assistant va tool qiymatlaridan biriga tegishli bo'lishi mumkin. Ikkinchi juftlikning kaliti — CONTENT."**

```python
{"role": "system" | "user" | "assistant" | "tool",
 "content": "matn"}
```

---

## 4. ⭐ `openai` paketi ham JIDDIY o'zgargan

```python
import openai, inspect
from openai import OpenAI

print("versiya:", openai.__version__)
print("OpenAI() parametrlari:", list(inspect.signature(OpenAI.__init__).parameters)[:8])
```

```
versiya: 3.3.1
OpenAI() parametrlari: ['self', 'api_key', 'admin_api_key', 'workload_identity',
                        'organization', 'project', 'webhook_secret', 'provider']
```

> ## 💡 **KURS DAVRIDA `openai` 1.x EDI, BUGUN 3.x.** Yaxshi xabar: `chat.completions.create` **interfeysi barqaror** qoldi — faqat **yangi parametrlar** qo'shildi.

```python
import openai.resources.chat.completions as C
print(sorted(inspect.signature(C.Completions.create).parameters))
```

**Yangi qo'shilgan muhim parametrlar:**

| Parametr | Nima uchun |
|---|---|
| `max_completion_tokens` | ## `max_tokens` ning **yangi nomi** |
| `reasoning_effort` | Mulohaza modellari uchun *(`o1`, `o3`)* |
| `response_format` | ## **JSON** yoki **sxema** majburlash |
| `prompt_cache_key` | Takroriy promptni **keshlash** *(arzonlashtiradi)* |
| `verbosity` | Javob **uzunligini** boshqarish |

> ## ⚠️ **`max_tokens` HALI ISHLAYDI, LEKIN ESKIRGAN.** Yangi kodda `max_completion_tokens` ni ishlating.
>
> ## ⭐ **`response_format` — ENG FOYDALI YANGILIK.** U **40-modul** *(chiqish parserlari)* muammosining **katta qismini** hal qiladi:
> ```python
> completion = client.chat.completions.create(
>     model="gpt-4o-mini",
>     messages=[...],
>     response_format={"type": "json_object"})     # ⭐ JAVOB DOIM JSON
> ```

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun avval "yalang'och" API o'rganiladi?

**M2.** `messages` qanday strukturaga ega?

**M3.** Qaysi to'rtta rol mavjud?

<details>
<summary>✅ Javoblar</summary>

**M1.** LangChain **shu API ustiga** qurilgan. U buzilganda siz **pastki qatlamga** tushib muammoni hal qila olasiz.

**M2.** ## **Lug'atlar ro'yxati**, har birida `role` va `content`.

**M3.** ## `system` · `user` · `assistant` · `tool`.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Kursning `openai.api_key` satri ishlaydimi? — **o'zingiz** tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import os, openai
from openai import OpenAI

os.environ.pop("OPENAI_API_KEY", None)
openai.api_key = "sk-TEST-123"
try:
    OpenAI()
    print("✅ ishladi")
except Exception as e:
    print("❌", type(e).__name__, ":", str(e)[:100])
```

```
❌ OpenAIError : Missing credentials. Please pass an `api_key` ...
```

## 💥 **SATR HECH NARSA QILMAYDI.** Kursda u faqat `%dotenv` muhit o'zgaruvchisini o'rnatgani uchun "ishlagan".

</details>

**M5.** ⭐ SDK versiyasi va parametrlarini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
import openai, inspect
import openai.resources.chat.completions as C

print("openai:", openai.__version__)
p = sorted(inspect.signature(C.Completions.create).parameters)
for x in ["max_tokens", "max_completion_tokens", "temperature", "seed",
          "stream", "response_format", "reasoning_effort", "n"]:
    print(f"{'✅' if x in p else '❌'} {x}")
```

</details>

**M6.** ⭐⭐ `base_url` bilan mahalliy serverga ulaning.

<details>
<summary>✅ Yechim</summary>

```python
# Ollama ishga tushirilgan bo'lsa:
from openai import OpenAI

client = OpenAI(api_key="ollama",                     # ixtiyoriy satr
                base_url="http://localhost:11434/v1")

r = client.chat.completions.create(
        model="qwen2.5",
        messages=[{"role": "user", "content": "Toshkent qaysi mamlakatda?"}])
print(r.choices[0].message.content)
```

## 🏆 **BU — BUTUN MODULNI KALITSIZ O'TISH KALITI.** `openai` paketi **har qanday OpenAI-mos serverga** ulanadi.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Provayderdan mustaqil klient fabrikasi.

<details>
<summary>✅ Yechim</summary>

```python
import os
from openai import OpenAI

def klient_yasa(provayder="auto"):
    """OpenAI-mos har qanday serverga ulanadi."""
    KONFIG = {
        "openai": (None, os.getenv("OPENAI_API_KEY"), "gpt-4o-mini"),
        "ollama": ("http://localhost:11434/v1", "ollama", "qwen2.5"),
        "lmstudio": ("http://localhost:1234/v1", "lm-studio", "local-model"),
        "groq":   ("https://api.groq.com/openai/v1",
                   os.getenv("GROQ_API_KEY"), "llama-3.3-70b-versatile"),
    }
    if provayder == "auto":
        provayder = "openai" if os.getenv("OPENAI_API_KEY") else "ollama"
    url, kalit, model = KONFIG[provayder]
    if not kalit:
        raise RuntimeError(f"{provayder} uchun kalit yo'q")
    c = OpenAI(api_key=kalit, **({"base_url": url} if url else {}))
    return c, model

client, MODEL = klient_yasa()
print("provayder tayyor, model =", MODEL)
```

## 🏆 **KURSDA `client` VA `model` YOZILGAN HAR YERDA SHUNI ISHLATING.**

</details>

**M8.** ⭐⭐ `response_format` bilan JSON majburlang *(kalit bo'lsa)*.

<details>
<summary>✅ Yechim</summary>

```python
r = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Javobni JSON formatida bering."},
        {"role": "user", "content": "Toshkent haqida: nom, mamlakat, aholi"},
    ],
    response_format={"type": "json_object"})

import json
print(json.loads(r.choices[0].message.content))
```

## ⚠️ **`response_format` ISHLATILGANDA PROMPTDA HAM "JSON" SO'ZI BO'LISHI KERAK** — aks holda OpenAI xato qaytaradi.

## ⭐ **BU — 40-MODUL MUAMMOSINING ENG SODDA YECHIMI.**

</details>

---

## 🧠 O'zini tekshirish

<details>
<summary>❓ `openai.api_key = ...` nima uchun ishlamaydi?</summary>

`OpenAI()` klienti bu **global** o'zgaruvchini **o'qimaydi**. U `api_key=` argumentidan yoki `OPENAI_API_KEY` **muhit o'zgaruvchisidan** oladi.
</details>

<details>
<summary>❓ `base_url` nima uchun muhim?</summary>

U `openai` paketini **har qanday OpenAI-mos serverga** ulaydi — Ollama, LM Studio, Groq, vLLM. Ya'ni **butun kursni kalitsiz** o'tish mumkin.
</details>

<details>
<summary>❓ `gpt-4` yoki `gpt-4o-mini`?</summary>

## **`gpt-4o-mini`** — **56× arzon**, **16× katta** oyna, **tezroq** va o'zbekcha uchun **yaxshiroq tokenizator** *(36-modul)*.
</details>

---

## 📌 Xulosa

```
❌ openai.api_key = os.getenv(...)      →  HECH NARSA QILMAYDI
✅ load_dotenv(override=True)           →  muhit o'zgaruvchisi
   client = OpenAI()

⭐ client = OpenAI(api_key="ollama",
                   base_url="http://localhost:11434/v1")
   →  KALITSIZ, qolgan hamma kod BIR XIL

completion = client.chat.completions.create(
    model="gpt-4o-mini",                ⚠️ gpt-4 EMAS
    messages=[{"role": ..., "content": ...}])
```

| | Kurs | Bugun |
|---|---|---|
| `openai` versiyasi | 1.x | ## **3.3.1** |
| `openai.api_key` | ✅ ishlatadi | ## ❌ **ta'sirsiz** |
| `model` | `gpt-4` | ## `gpt-4o-mini` |
| `max_tokens` | ✅ | ⚠️ → `max_completion_tokens` |
| `base_url` | ❌ | ## ⭐ **kalitsiz yo'l** |
| `response_format` | ❌ | ## ⭐ **JSON majburlash** |

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Klient | Client | API bilan **gaplashuvchi** obyekt |
| Chat completion | Chat completion | Suhbat **javobi** |
| Rol | Role | Xabar **kimdan** kelgani |
| `base_url` | Base URL | API server **manzili** |
| OpenAI-mos | OpenAI-compatible | ## **Bir xil interfeys**li boshqa server |

---

⬅️ [37-modul. Muhitni sozlash](../37-LangChain-Setting-Up-Environment/README.md) · 🏠 [Modul boshiga](README.md) · ➡️ [2-dars. System, user va assistant rollari](02-System-User-Assistant-Roles.md)
