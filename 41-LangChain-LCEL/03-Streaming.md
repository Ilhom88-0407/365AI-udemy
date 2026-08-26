# 3-dars. Streaming

## 🎬 Boshlashdan oldin

> **"Zanjirlar `stream` metodini ham qo'llab-quvvatlaydi."**

---

## 1. Kod

```python
chain = chat_template | chat

response = chain.stream({"pet": "dragon", "breed": "night fury"})

next(response)                      # birinchi bo'lak
for i in response:
    print(i.content, end="")
```

> ## 🔑 **`stream` GENERATOR qaytaradi** — shuning uchun `next()` ishlaydi.

---

## 2. ⭐ Parser bilan — `str` bo'laklari

```python
chain = chat_template | chat | StrOutputParser()

for bolak in chain.stream({"pet": "dragon", "breed": "night fury"}):
    print(bolak, end="", flush=True)         # ⭐ endi bu STR, AIMessageChunk emas
```

> ## 💡 **`StrOutputParser` OQIM BILAN ISHLAYDI** — u har bo'lakni **alohida** parse qiladi.
>
> ## ⚠️ **LEKIN HAMMA PARSER ISHLAMAYDI:**
> ```
> ✅ StrOutputParser              →  har bo'lakni beradi
> ⚠️ CommaSeparatedListOutputParser →  to'liq element tayyor bo'lganda beradi
> ❌ PydanticOutputParser          →  FAQAT oxirida (JSON to'liq bo'lishi kerak)
> ```

```python
from langchain_core.runnables import RunnableLambda
z = ChatPromptTemplate.from_template("{q}") | RunnableLambda(
        lambda pv: pv.messages[0].content.upper())
print(list(z.stream({"q": "salom"})))
```

```
['SALOM']
```

> ## 🔑 **`RunnableLambda` OQIM QILA OLMAYDI** — u **butun** natijani bir bo'lak qilib beradi. Bu **normal**: funksiya tugamaguncha natija **yo'q**.

---

## 3. ⭐⭐ `astream_events` — kursda YO'Q, lekin ENG KUCHLISI

```python
import asyncio

async def kuzat(chain, kirish):
    async for e in chain.astream_events(kirish, version="v2"):
        tur, nom = e["event"], e["name"]
        if tur == "on_chat_model_stream":
            print(e["data"]["chunk"].content, end="", flush=True)
        elif tur in ("on_chain_start", "on_chain_end"):
            print(f"\n[{tur}] {nom}")

asyncio.run(kuzat(chain, {"pet": "dog", "breed": "shepherd"}))
```

> ## 🏆 **`astream_events` ZANJIRNING ICHIDA NIMA BO'LAYOTGANINI KO'RSATADI:**
> ```
> on_chain_start        →  zanjir boshlandi
> on_prompt_start/end   →  shablon to'ldirildi
> on_chat_model_start   →  modelga so'rov ketdi
> on_chat_model_stream  →  ⭐ har token
> on_parser_start/end   →  parser ishladi
> on_chain_end          →  tugadi
> ```
>
> ## 💡 **BU — LangSmith'ga ALTERNATIVA.** Bepul, mahalliy, hech qanday xizmatga ulanmaydi.
>
> ## ⚠️ **`version="v2"` — MAJBURIY parametr.** Usiz ogohlantirish chiqadi.

---

## 4. ⚠️ Oqimning uchta tuzog'i — 38-moduldan takror

```python
bo_laklar = []
for b in chain.stream(kirish):
    if b:                          # ① bo'sh bo'lakni tekshiring
        bo_laklar.append(b)
        print(b, end="", flush=True)
to_liq = "".join(bo_laklar)        # ② to'liq javob KERAK bo'lsa — yig'ing
```

```
③ usage_metadata OQIMDA YO'Q
   → chat = ChatOpenAI(..., stream_usage=True)      ⭐ LangChain'da shunday
```

```python
chat = ChatOpenAI(model="gpt-4o-mini", stream_usage=True)
oxirgi = None
for b in chat.stream("Salom"):
    oxirgi = b
print(oxirgi.usage_metadata)         # ⭐ oxirgi bo'lakda keladi
```

---

## 5. ⭐ `stream` vs `invoke` — qachon qaysi biri

| | `invoke` | `stream` |
|---|---|---|
| Chatbot UI | ❌ | ## ✅ **majburiy** |
| Fon vazifasi | ## ✅ | ❌ ortiqcha |
| Parser + struktura | ## ✅ | ⚠️ oxirida |
| Xatoni ushlash | ✅ oson | ⚠️ **yarim javob** chiqib ketgan bo'ladi |

> ## 💥 **OQIMDAGI XATO — ALOHIDA MUAMMO.** Model 100 ta token yozib, keyin xato bersa — foydalanuvchi **yarim javobni** ko'rgan bo'ladi. UI'da buni **hisobga oling**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `stream` nima qaytaradi?

**M2.** Parser bilan bo'laklar qaysi turda bo'ladi?

**M3.** `usage_metadata` oqimda bormi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Generator** — `next()` ishlaydi.

**M2.** `StrOutputParser` bilan — ## **`str`**. Parsersiz — `AIMessageChunk`.

**M3.** ## ❌ **Standart holda yo'q.** `ChatOpenAI(..., stream_usage=True)` bering.

</details>

### 🟡 O'rta

**M4.** ⭐ Oqimni to'g'ri yig'ing.

<details>
<summary>✅ Yechim</summary>

```python
def oqim_bilan(chain, kirish, chop=True):
    bo_laklar = []
    for b in chain.stream(kirish):
        matn = getattr(b, "content", b)
        if matn:
            bo_laklar.append(matn)
            if chop:
                print(matn, end="", flush=True)
    if chop:
        print()
    return "".join(bo_laklar)
```

</details>

**M5.** ⭐⭐ `astream_events` bilan zanjirni kuzating.

<details>
<summary>✅ Yechim</summary>

```python
import asyncio
from collections import Counter

async def hodisalar(chain, kirish):
    c = Counter()
    async for e in chain.astream_events(kirish, version="v2"):
        c[e["event"]] += 1
    for k, v in c.most_common():
        print(f"{k:28s} {v}")

asyncio.run(hodisalar(chain, {"pet": "dog", "breed": "shepherd"}))
```

## 🏆 **BU — ZANJIR ICHIDAGI HAR QADAMNI KO'RSATADI.** Nosozlik tuzatishda **bebaho**.

</details>

**M6.** ⭐ Qaysi parserlar oqim qiladi?

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.output_parsers import (StrOutputParser,
                                           CommaSeparatedListOutputParser,
                                           JsonOutputParser)
from langchain_core.runnables import RunnableLambda

manba = RunnableLambda(lambda x: x)      # oqim qilmaydi
for nom, p in [("Str", StrOutputParser()),
               ("CommaList", CommaSeparatedListOutputParser()),
               ("Json", JsonOutputParser())]:
    try:
        n = list((manba | p).stream("a, b, c"))
        print(f"{nom:12s} {len(n)} bo'lak → {n[:3]}")
    except Exception as e:
        print(f"{nom:12s} ❌ {type(e).__name__}")
```

</details>

---

## 📌 Xulosa

```python
for bolak in chain.stream(kirish):
    print(getattr(bolak, "content", bolak), end="", flush=True)

# ⭐ ENG KUCHLISI — zanjir ICHINI ko'rish
async for e in chain.astream_events(kirish, version="v2"):
    ...
```

| Tuzoq | Yechim |
|---|---|
| Bo'sh bo'lak | `if matn:` |
| To'liq javob kerak | bo'laklarni **yig'ing** |
| ## `usage_metadata` yo'q | ## `ChatOpenAI(..., stream_usage=True)` |
| Oqim o'rtasida xato | UI'da **yarim javob** ko'rinadi |

---

⬅️ [2-dars. Batching](02-Batching.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Runnable va RunnableSequence](04-Runnable-and-RunnableSequence.md)
