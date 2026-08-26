# 1-dars. String output parser

## 🎬 Boshlashdan oldin

> **"`ChatOpenAI` kabi chat model sinflari implementatsiya bo'yicha CHAT XABAR obyektlarini chiqaradi. Ba'zan esa bizga BOSHQA MA'LUMOT TURI kerak — satr, ro'yxat, datetime obyekti, CSV yoki boshqa qulay tur."**

---

## 1. Muammo

```
chat.invoke(...)  →  AIMessage(content="...", response_metadata={...}, ...)
                                ↑
                     dasturingizga faqat SHU kerak
```

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import AIMessage

p = StrOutputParser()
m = AIMessage(content="Bu — modelning javobi.")

print("kirish :", type(m).__name__)
print("chiqish:", repr(p.invoke(m)))
```

```
kirish : AIMessage
chiqish: 'Bu — modelning javobi.'
```

---

## 2. ⭐ Parser ham `invoke` ga ega

> **"To'g'ri. Biz `invoke` metodini chiqish parseri komponentiga ham qo'llashimiz mumkin."**

```
chat_template.invoke(dict)     →  ChatPromptValue
chat.invoke(ChatPromptValue)   →  AIMessage
parser.invoke(AIMessage)       →  str            ⭐
```

> ## 🏆 **UCHALASI HAM `Runnable`** — shuning uchun **41-modulda** ular `|` bilan **ulanadi**:
> ```python
> zanjir = chat_template | chat | StrOutputParser()
> ```
> **Bu — kursning butun mantiqiy chizig'i.**

---

## 3. ⭐ `StrOutputParser` satrni ham qabul qiladi

```python
print(repr(p.invoke("oddiy satr")))       # 'oddiy satr'
```

> ## 💡 **BU MUHIM** — mahalliy modellar *(masalan `HuggingFacePipeline`)* `AIMessage` **emas**, oddiy **satr** qaytaradi. `StrOutputParser` **ikkalasini ham** qabul qiladi, ya'ni zanjiringiz **provayderdan mustaqil** bo'ladi.

---

## 4. ⚠️ `StrOutputParser` NIMANI YO'QOTADI

```python
r = chat.invoke([("human", "Salom")])
print("metadata:", r.response_metadata)      # finish_reason, token_usage, model
print("usage   :", r.usage_metadata)         # input_tokens, output_tokens
matn = StrOutputParser().invoke(r)           # ⚠️ HAMMASI YO'QOLDI
```

> ## 💥 **PARSER `content` DAN BOSHQA HAMMA NARSANI TASHLAYDI:**
> ```
> ❌ finish_reason   →  javob KESILGANMI? (38-modul)
> ❌ usage_metadata  →  NARX qancha bo'ldi? (36-modul)
> ❌ model           →  qaysi ANIQ versiya?
> ```
>
> ## ✅ **YECHIM — parserdan OLDIN metadatani oling:**
> ```python
> def parse_va_qayd(r, jurnal):
>     jurnal.append({"sabab": r.response_metadata.get("finish_reason"),
>                    "tokenlar": (r.usage_metadata or {}).get("total_tokens")})
>     return StrOutputParser().invoke(r)
> ```
>
> ## 💡 **YOKI LCEL da `RunnableLambda` bilan** *(41-modul)*.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** `StrOutputParser` nima qaytaradi?

**M2.** U qanday kirishlarni qabul qiladi?

**M3.** Nima yo'qoladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **`str`** — `AIMessage.content`.

**M2.** ## **`AIMessage`** va **oddiy satr**.

**M3.** ## `response_metadata` *(`finish_reason`)* va `usage_metadata` *(narx)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Parserni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import AIMessage, HumanMessage

p = StrOutputParser()
for x in [AIMessage(content="AI javobi"),
          HumanMessage(content="inson xabari"),
          "oddiy satr"]:
    print(f"{type(x).__name__:14s} → {p.invoke(x)!r}")
```

</details>

**M5.** ⭐⭐ Metadatani saqlaydigan o'rovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnableLambda

jurnal = []

def qayd_va_parse(r):
    jurnal.append({
        "sabab": getattr(r, "response_metadata", {}).get("finish_reason"),
        "tokenlar": (getattr(r, "usage_metadata", None) or {}).get("total_tokens"),
        "uzunlik": len(r.content)})
    return r.content

xavfsiz_parser = RunnableLambda(qayd_va_parse)
zanjir = chat | xavfsiz_parser
print(zanjir.invoke([("human", "Salom")]))
print(jurnal)
```

## 🏆 **41-MODULNING OLDINDAN KO'RINISHI** — `RunnableLambda` istalgan funksiyani zanjirga qo'shadi.

</details>

---

## 📌 Xulosa

```
AIMessage  →  StrOutputParser  →  str
                    ⚠️ response_metadata va usage_metadata YO'QOLADI
```

---

⬅️ [39-modul. Model kirishlari](../39-LangChain-Model-Inputs/README.md) · 🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Ro'yxat parseri](02-Comma-Separated-List-Output-Parser.md)
