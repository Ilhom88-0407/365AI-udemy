# 3-dars. Sarkastik chatbot yaratamiz ⭐

## 🎬 Boshlashdan oldin

> **"Bu darsda Jupyter Notebookda chat completion'ni amalga oshirishni davom ettiramiz. Chatbotga SISTEM XABARI orqali savollarga sarkastik javob berishni buyurishdan boshlaymiz, keyin savolimizni USER roli xabari sifatida uzatamiz."**

---

## 1. To'liq kod

```python
completion = client.chat.completions.create(
    model="gpt-4o-mini",                       # ⚠️ kurs "gpt-4" deydi
    messages=[
        {"role": "system",
         "content": "You are Marv, a chatbot that reluctantly answers "
                    "questions with sarcastic responses."},
        {"role": "user",
         "content": "I've recently adopted a dog. Could you suggest some dog names?"},
    ],
)
```

---

## 2. 🔬 Javob obyektining ANATOMIYASI

> **"`completion` o'zgaruvchisini tekshiring. Biz `completion` — `ChatCompletion` sinfining namunasi ekanini topamiz, `choices` parametri esa `Choice` obyektlari ro'yxatini saqlaydi, ular o'z navbatida chatbotdan kelgan javoblarni ushlab turadi."**

Biz **SDK ning o'zidan** to'liq strukturani oldik:

```python
from openai.types.chat import ChatCompletion
from openai.types.chat.chat_completion import Choice
from openai.types.chat.chat_completion_message import ChatCompletionMessage
from openai.types.completion_usage import CompletionUsage

print("ChatCompletion :", list(ChatCompletion.model_fields))
print("Choice         :", list(Choice.model_fields))
print("Message        :", list(ChatCompletionMessage.model_fields))
print("Usage          :", list(CompletionUsage.model_fields))
```

```
ChatCompletion : ['id', 'choices', 'created', 'model', 'object', 'metadata',
                  'moderation', 'service_tier', 'system_fingerprint', 'usage']
Choice         : ['finish_reason', 'index', 'logprobs', 'message']
Message        : ['content', 'refusal', 'role', 'annotations', 'audio',
                  'function_call', 'tool_calls']
Usage          : ['completion_tokens', 'prompt_tokens', 'total_tokens',
                  'completion_tokens_details', 'prompt_tokens_details']
```

```
ChatCompletion
├── id                 'chatcmpl-...'
├── model              'gpt-4o-mini-2024-07-18'   ← ⭐ ANIQ versiya
├── created            1730000000                  (unix vaqt)
├── system_fingerprint 'fp_...'                    ← backend versiyasi
├── choices            [Choice, ...]
│   └── Choice
│       ├── index          0
│       ├── finish_reason  'stop'  ← ⚠️ MUHIM, pastga qarang
│       ├── logprobs       None
│       └── message
│           ├── role       'assistant'
│           ├── content    'Oh, absolutely...'     ← ⭐ MANA JAVOB
│           ├── refusal    None                    ← ⚠️ yangi maydon
│           └── tool_calls None
└── usage
    ├── prompt_tokens      45
    ├── completion_tokens  62
    └── total_tokens      107                      ← ⭐ NARX shu yerda
```

---

## 3. Javobni olish

> **"Avval chat completion obyektidan `choices` ro'yxatini oling. Keyin ro'yxatdagi birinchi va yagona elementni tanlang. `Choice` obyektidan `message` parametrini oling, va nihoyat `ChatCompletionMessage` obyektidan `content` ni chiqarib oling."**

```python
print(completion.choices[0].message.content)
```

> ## 🔑 **`choices[0]` — NIMA UCHUN RO'YXAT?**
>
> `n` parametri **bir nechta** javob so'rashga imkon beradi:
> ```python
> completion = client.chat.completions.create(..., n=3)
> for c in completion.choices:
>     print(c.index, c.message.content[:50])
> ```
>
> ## ⚠️ **`n=3` — NARXNI 3× OSHIRADI** *(faqat chiqish qismini)*. Kurs to'g'ri aytadi: *"ko'proq javoblar ko'proq token iste'moli, demak yuqoriroq narx."*

---

## 4. ⭐⭐ `finish_reason` — kursda YO'Q, lekin MUHIM

Kurs `finish_reason` ni **eslatmaydi**. Bu — **ishlab chiqarishda majburiy** tekshiruv.

| Qiymat | Ma'nosi | Nima qilish kerak |
|---|---|---|
| `'stop'` | ## ✅ Model **tabiiy tugatdi** | — |
| `'length'` | ## 💥 **`max_tokens` ga urildi** — javob **KESILGAN** | limitni **oshiring** |
| `'content_filter'` | ⚠️ Kontent **bloklandi** | promptni **qayta ko'ring** |
| `'tool_calls'` | Model **vosita** chaqirmoqchi | vositani **bajaring** |

```python
def javob_ol(completion):
    ch = completion.choices[0]
    if ch.finish_reason == "length":
        print("⚠️ JAVOB KESILGAN — max_tokens ni oshiring")
    elif ch.finish_reason == "content_filter":
        print("⚠️ Kontent filtri ishga tushdi")
    if ch.message.refusal:
        return f"❌ Model rad etdi: {ch.message.refusal}"
    return ch.message.content
```

> ## 💥 **`finish_reason == 'length'` NI TEKSHIRMASANGIZ — SIZ KESILGAN JAVOBNI TO'LIQ DEB QABUL QILASIZ.**
>
> Bu — **jim xato**: JSON yarim qoladi, ro'yxat tugamaydi, jumla o'rtada uziladi.

> ## ⭐ **`refusal` — YANGI MAYDON** *(kurs davrida yo'q edi)*. Model xavfsizlik sabab rad etsa, `content` **`None`** bo'ladi va sabab `refusal` da bo'ladi. Uni tekshirmasangiz — `AttributeError` olasiz.

---

## 5. ⭐ `usage` — har chaqiruvning NARXI

```python
u = completion.usage
print(f"kirish  : {u.prompt_tokens}")
print(f"chiqish : {u.completion_tokens}")
print(f"jami    : {u.total_tokens}")

NARX = (0.15, 0.60)          # gpt-4o-mini, $ / 1M
narx = (u.prompt_tokens * NARX[0] + u.completion_tokens * NARX[1]) / 1e6
print(f"narx    : ${narx:.6f}")
```

> ## 🏆 **HAR ISHLAB CHIQARISH LOYIHASIDA `usage` NI JURNALGA YOZING.**
>
> ```
> ✅ Haqiqiy narxni bilasiz  (36-modul: taxmin ≠ haqiqat)
> ✅ Qaysi so'rov qimmat ekanini topasiz
> ✅ Byudjet chegarasini nazorat qilasiz
> ```

> ## 💡 **`model` MAYDONIGA HAM QARANG.** Siz `"gpt-4o-mini"` so'raysiz, javobda `"gpt-4o-mini-2024-07-18"` keladi — ya'ni **aniq versiya**. Natijalaringiz o'zgarsa — **avval shuni** tekshiring.

---

## 6. 🎓 Kursning uy vazifasi — tweet tasniflagichi

> **"Uy vazifasi sifatida: oxirgi darsdagi misoldagi tweet tasniflagichini amalga oshiring, u izohlarni ijobiy, salbiy yoki neytral deb tasniflaydi."**

```python
def tweet_tasnifla(client, tweet, model="gpt-4o-mini"):
    r = client.chat.completions.create(
        model=model,
        temperature=0,                          # ⭐ tasnifda DOIM 0
        max_completion_tokens=5,                # ⭐ bitta so'z yetadi
        messages=[
            {"role": "system",
             "content": "You will be provided with a tweet. Classify its "
                        "sentiment as exactly one word: positive, neutral, "
                        "or negative. Output nothing else."},
            {"role": "user",      "content": "This new movie is extraordinary"},
            {"role": "assistant", "content": "positive"},
            {"role": "user",      "content": "This new album is all right"},
            {"role": "assistant", "content": "neutral"},
            {"role": "user",      "content": "This new book could not have been written worse"},
            {"role": "assistant", "content": "negative"},
            {"role": "user",      "content": tweet},
        ])
    ch = r.choices[0]
    if ch.finish_reason == "length":
        print("⚠️ kesilgan")
    return ch.message.content.strip().lower(), r.usage.total_tokens
```

> ## ⭐⭐ **UCHTA NOZIKLIK — KURSDA AYTILMAGAN:**
> ```
> ① temperature=0             →  tasnif IJOD emas, ANIQLIK talab qiladi
> ② max_completion_tokens=5   →  bitta so'z yetadi, qolgani ISROF
> ③ "Output nothing else"     →  usiz model tushuntirish qo'shadi
> ```

### ⚠️ Va javobni TEKSHIRING

```python
RUXSAT = {"positive", "neutral", "negative"}

def xavfsiz_tasnifla(client, tweet):
    javob, tok = tweet_tasnifla(client, tweet)
    if javob not in RUXSAT:
        return f"❓ kutilmagan javob: {javob!r}", tok
    return javob, tok
```

> ## 💥 **LLM SIZGA "positive." YOKI "Sentiment: positive" QAYTARISHI MUMKIN.** Har doim **oq ro'yxat** bilan tekshiring.
>
> ## ⭐ **YOKI — ZAMONAVIY YECHIM:**
> ```python
> response_format={"type": "json_schema", "json_schema": {
>     "name": "sentiment", "strict": True,
>     "schema": {"type": "object",
>                "properties": {"label": {"type": "string",
>                               "enum": ["positive", "neutral", "negative"]}},
>                "required": ["label"], "additionalProperties": False}}}
> ```
> `strict: True` bilan OpenAI **sxemani kafolatlaydi**. Bu — **40-modul** muammosining eng ishonchli yechimi.

---

## 7. 🇺🇿 O'zbekcha tasniflagich

```python
def uz_tasnifla(client, matn, model="gpt-4o-mini"):
    r = client.chat.completions.create(
        model=model, temperature=0, max_completion_tokens=5,
        messages=[
            {"role": "system",
             "content": "You will be provided with a comment in Uzbek. "
                        "Classify its sentiment as exactly one word: "
                        "ijobiy, neytral, or salbiy. Output nothing else."},
            {"role": "user",      "content": "Bu film ajoyib edi, juda yoqdi"},
            {"role": "assistant", "content": "ijobiy"},
            {"role": "user",      "content": "Oddiy, hech qanday taassurot yo'q"},
            {"role": "assistant", "content": "neytral"},
            {"role": "user",      "content": "Pulimni behuda sarfladim, juda yomon"},
            {"role": "assistant", "content": "salbiy"},
            {"role": "user",      "content": matn},
        ])
    return r.choices[0].message.content.strip().lower()
```

> ## 🔑 **E'TIBOR BERING — SISTEM PROMPT INGLIZCHA, YORLIQLAR O'ZBEKCHA.**
> ```
> Ko'rsatma inglizcha  →  model unga YAXSHIROQ bo'ysunadi
> Yorliqlar o'zbekcha  →  chiqish sizga KERAKLI shaklda
> ```
>
> ## 💡 **VA 32-MODULNI ESLANG:** u yerda tayyor `zero-shot` klassifikator o'zbekchada **ishlamagan** edi *(`"sifatsiz mahsulot"` → maqtov 0.4825)*. GPT-4o **few-shot** bilan ancha yaxshi ishlaydi — lekin **o'lchang**, ishonmang.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `choices` nima uchun ro'yxat?

**M2.** Javob matni qayerda turadi?

**M3.** `usage` da nima bor?

<details>
<summary>✅ Javoblar</summary>

**M1.** `n` parametri **bir nechta** javob so'rashga imkon beradi *(narxni oshiradi)*.

**M2.** ## `completion.choices[0].message.content`.

**M3.** ## `prompt_tokens` · `completion_tokens` · `total_tokens` — ya'ni **narx**.

</details>

### 🟡 O'rta

**M4.** ⭐ Javob obyektining maydonlarini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
from openai.types.chat import ChatCompletion
from openai.types.chat.chat_completion import Choice
from openai.types.chat.chat_completion_message import ChatCompletionMessage

for nom, T in [("ChatCompletion", ChatCompletion), ("Choice", Choice),
               ("Message", ChatCompletionMessage)]:
    print(f"{nom:16s} {list(T.model_fields)}")
```

## 💡 **API kalitisiz ham ishlaydi** — bu **turlar**, chaqiruv emas.

</details>

**M5.** ⭐⭐ Xavfsiz javob oluvchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
def javob_ol(completion, kutilgan=None):
    ch = completion.choices[0]
    ogoh = []
    if ch.finish_reason == "length":
        ogoh.append("⚠️ KESILGAN — max_tokens ni oshiring")
    if ch.finish_reason == "content_filter":
        ogoh.append("⚠️ kontent filtri")
    if ch.message.refusal:
        return {"ok": False, "sabab": ch.message.refusal, "ogoh": ogoh}
    matn = (ch.message.content or "").strip()
    if kutilgan and matn.lower() not in kutilgan:
        ogoh.append(f"⚠️ kutilmagan javob: {matn!r}")
    return {"ok": True, "matn": matn, "ogoh": ogoh,
            "tokenlar": completion.usage.total_tokens,
            "sabab": ch.finish_reason}
```

## 🏆 **HAR CHAQIRUVDA SHU FUNKSIYANI ISHLATING.**

</details>

**M6.** ⭐ Narx hisoblovchi qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
NARX = {"gpt-4o-mini": (0.15, 0.60), "gpt-4o": (2.50, 10.00)}

def narx_hisobla(completion, model="gpt-4o-mini"):
    u = completion.usage
    ki, ch = NARX[model]
    return round((u.prompt_tokens*ki + u.completion_tokens*ch) / 1e6, 6)
```

</details>

**M7.** ⭐⭐ Tweet tasniflagichini yozing va **sinang**.

<details>
<summary>✅ Yechim</summary>

```python
OLTIN = [("This new song blew my mind", "positive"),
         ("It was fine, nothing special", "neutral"),
         ("Worst purchase I've ever made", "negative"),
         ("The train leaves at 7pm", "neutral")]

tog, jami_tok = 0, 0
for tweet, kutilgan in OLTIN:
    javob, tok = tweet_tasnifla(client, tweet)
    ok = javob == kutilgan
    tog += ok; jami_tok += tok
    print(f"{'✅' if ok else '❌'} {tweet[:34]:36s} → {javob:9s} (kutilgan {kutilgan})")
print(f"\nANIQLIK: {tog}/{len(OLTIN)}   tokenlar: {jami_tok}")
```

## 🏆 **"OLTIN TO'PLAM" — 34-MODULDAN TANISH.** Usiz siz **yaxshilanayotganingizni bila olmaysiz**.

</details>

### 🔴 Qiyin

**M8.** ⭐⭐ `n` parametrining ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
r = client.chat.completions.create(
    model="gpt-4o-mini", n=3, temperature=1.0, max_completion_tokens=60,
    messages=[{"role": "user", "content": "Suggest one dog name."}])

for c in r.choices:
    print(f"[{c.index}] {c.message.content.strip()}")
print(f"\nkirish {r.usage.prompt_tokens}  chiqish {r.usage.completion_tokens}")
```

## 🔑 **KIRISH BIR MARTA HISOBLANADI, CHIQISH — `n` MARTA.** Ya'ni `n=3` narxni **3× emas**, faqat **chiqish qismini** 3× oshiradi.

## 💡 **`temperature=0` bilan `n=3` — MA'NOSIZ**, uchala javob **bir xil** bo'ladi.

</details>

**M9.** ⭐⭐ `response_format` bilan sxemani majburlang.

<details>
<summary>✅ Yechim</summary>

```python
SXEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "sentiment", "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "label": {"type": "string",
                          "enum": ["positive", "neutral", "negative"]},
                "confidence": {"type": "number"},
            },
            "required": ["label", "confidence"],
            "additionalProperties": False,
        },
    },
}

import json
r = client.chat.completions.create(
    model="gpt-4o-mini", temperature=0, response_format=SXEMA,
    messages=[{"role": "system", "content": "Classify tweet sentiment."},
              {"role": "user", "content": "This new song blew my mind"}])
print(json.loads(r.choices[0].message.content))
```

## 🏆 **`strict: True` — OpenAI SXEMANI KAFOLATLAYDI.** Bu **40-modul** *(chiqish parserlari)* muammosining **eng ishonchli** yechimi.

## ⚠️ **Hamma model qo'llab-quvvatlamaydi** — `gpt-4o-mini` va undan yangilari.

</details>

**M10.** ⭐⭐⭐ Jurnal yurituvchi klient o'rovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
import time, json
from datetime import datetime, timezone
import pandas as pd

class JurnalliKlient:
    """Har chaqiruvni o'lchaydi, jurnalga yozadi, muammolarni belgilaydi."""

    NARX = {"gpt-4o-mini": (0.15, 0.60), "gpt-4o": (2.50, 10.00)}

    def __init__(self, client, model="gpt-4o-mini", fayl=None):
        self.c, self.model, self.fayl = client, model, fayl
        self.jurnal = []

    def create(self, **kw):
        kw.setdefault("model", self.model)
        t0 = time.perf_counter()
        r = self.c.chat.completions.create(**kw)
        dt = time.perf_counter() - t0

        ch, u = r.choices[0], r.usage
        ki, co = self.NARX.get(kw["model"], (0, 0))
        narx = (u.prompt_tokens*ki + u.completion_tokens*co) / 1e6

        yozuv = {
            "vaqt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "model": r.model, "kirish": u.prompt_tokens,
            "chiqish": u.completion_tokens, "usd": round(narx, 6),
            "soniya": round(dt, 2), "sabab": ch.finish_reason,
            "kesilgan": ch.finish_reason == "length",
            "rad": bool(ch.message.refusal),
        }
        self.jurnal.append(yozuv)
        if self.fayl:
            with open(self.fayl, "a", encoding="utf-8") as f:
                f.write(json.dumps(yozuv, ensure_ascii=False) + "\n")
        if yozuv["kesilgan"]:
            print("⚠️ JAVOB KESILGAN")
        return r

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print(f"\nchaqiruvlar {len(d)}   jami ${d.usd.sum():.6f}   "
              f"o'rtacha {d.soniya.mean():.2f}s")
        k = d.kesilgan.mean()
        if k > 0:
            print(f"💥 {k:.0%} javob KESILGAN — max_tokens ni oshiring")
```

## 🏆 **`kesilgan` USTUNI — ENG QIMMATLI SIGNAL.** U **jim** buzilgan javoblarni **fosh qiladi**.

</details>

---

## 🧠 O'zini tekshirish

<details>
<summary>❓ `finish_reason='length'` nimani bildiradi?</summary>

Javob **`max_tokens` ga urilib kesilgan**. Bu — **jim xato**: JSON yarim qoladi, jumla uziladi. **Har doim tekshiring.**
</details>

<details>
<summary>❓ `n=3` narxni 3× oshiradimi?</summary>

**Yo'q** — faqat **chiqish** qismini. Kirish **bir marta** hisoblanadi.
</details>

<details>
<summary>❓ Model kutilgan formatda javob bermasa?</summary>

**Oq ro'yxat** bilan tekshiring, yoki `response_format` bilan **sxemani majburlang** *(`strict: True`)*.
</details>

---

## 📌 Xulosa

```
ChatCompletion
├── choices[0]
│   ├── finish_reason  ⚠️ 'stop' | 'length' | 'content_filter' | 'tool_calls'
│   └── message
│       ├── content    ⭐ JAVOB
│       └── refusal    ⚠️ bo'sh emasmi?
├── usage
│   └── total_tokens   ⭐ NARX
└── model              aniq versiya (fp_...)
```

| | Kurs | Biz qo'shdik |
|---|---|---|
| `choices[0].message.content` | ✅ | ✅ |
| `usage` | ✅ eslatadi | ✅ **narx hisobi** |
| `n` | ✅ eslatadi | ✅ **kirish 1×, chiqish n×** |
| ## `finish_reason` | ## ❌ | ## 💥 **jim xato manbai** |
| `refusal` | ❌ | ⚠️ **yangi maydon** |
| `response_format` | ❌ | ## ⭐ **sxema kafolati** |
| Javobni tekshirish | ❌ | ✅ **oq ro'yxat** |
| 🇺🇿 O'zbekcha tasnif | ❌ | ✅ **inglizcha prompt + o'zbekcha yorliq** |

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Tugash sababi | Finish reason | Model **nima uchun** to'xtadi |
| Rad etish | Refusal | Model **javob bermadi** *(xavfsizlik)* |
| Oq ro'yxat | Allowlist | **Ruxsat etilgan** qiymatlar to'plami |
| Sxema majburlash | Structured output | Javob **formatini kafolatlash** |
| Barmoq izi | System fingerprint | Backend **versiyasi** |

---

⬅️ [2-dars. System, user, assistant rollari](02-System-User-Assistant-Roles.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Temperature, max tokens va streaming](04-Temperature-Max-Tokens-Streaming.md)
