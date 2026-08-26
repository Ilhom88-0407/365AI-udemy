# 3-dars. System va human xabarlar

## 🎬 Boshlashdan oldin

> **"Bu darsda SYSTEM va HUMAN rollariga chuqurroq kiramiz — ular OpenAI API'da uchratgan system va user rollari kabi ishlaydi."**

---

## 1. LangChain xabar sinflari

```python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

for M in [SystemMessage, HumanMessage, AIMessage]:
    print(f"{M.__name__:16s} type={M(content='test').type!r}")
```

```
SystemMessage    type='system'
HumanMessage     type='human'
AIMessage        type='ai'
```

> ## ⚠️ **NOMLARGA E'TIBOR BERING — ULAR OpenAI BILAN MOS EMAS:**
>
> | OpenAI API | LangChain sinfi | `.type` |
> |---|---|---|
> | `"system"` | `SystemMessage` | `'system'` |
> | `"user"` | ## `HumanMessage` | ## `'human'` |
> | `"assistant"` | ## `AIMessage` | ## `'ai'` |
> | `"tool"` | `ToolMessage` | `'tool'` |
>
> ## 💡 **LangChain o'zining nomini ishlatadi** va OpenAI'ga yuborishdan **oldin tarjima qiladi**. Boshqa provayderlar *(Claude, Gemini)* ham **shu nomlar** bilan ishlaydi — mana **abstraksiyaning qiymati**.

---

## 2. Kod

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

chat = ChatOpenAI(model="gpt-4o-mini", seed=365, temperature=0, max_tokens=100)

message_h = HumanMessage(content="I've recently adopted a dog. "
                                 "Can you suggest some dog names?")
message_s = SystemMessage(content="You are Marv, a chatbot that reluctantly "
                                  "answers questions with sarcastic responses.")

response = chat.invoke([message_s, message_h])       # ⭐ RO'YXAT
print(response.content)
```

> ## 🔑 **TARTIB MUHIM:** `system` **birinchi**, keyin `human`. Bu — **konvensiya**, lekin modellar aynan shunday o'qitilgan.

---

## 3. ⭐ Sodda muqobil — kortejlar

Kurs `SystemMessage(...)` sinflarini ishlatadi. **Ancha soddaroq** yozuv ham bor:

```python
response = chat.invoke([
    ("system", "You are Marv, a sarcastic chatbot."),
    ("human", "I've recently adopted a dog. Suggest some names?"),
])
```

> ## ✅ **IKKALASI HAM BIR XIL ISHLAYDI.** Kortejlar — **kamroq import**, **kamroq kod**.
>
> ## 💡 **QACHON SINFLAR KERAK?**
> ```
> Kortej   →  oddiy holat, tez yozish              ⭐ ko'pincha yetadi
> Sinf     →  qo'shimcha maydonlar kerak bo'lganda:
>             HumanMessage(content=..., name="alisher",
>                          additional_kwargs={...})
> ```

---

## 4. 🔬 Sistem xabari HAQIQATAN ta'sir qiladimi?

38-modulda `0.5B` modelda **sarkastik persona ishlamagan** edi. Bu yerda ham **halol** bo'lamiz:

```python
# ChatPromptTemplate orqali (4-darsda ko'ramiz)
ct = ChatPromptTemplate.from_messages([
    ("system", "{description}"),
    ("human", "I've recently adopted a {pet}. Could you suggest some {pet} names?")])

cv = ct.invoke({"description": "You are a helpful assistant. Be brief.", "pet": "dog"})
```

Biz buni **mahalliy `Qwen2.5-0.5B-Instruct`** bilan ishga tushirdik:

```
input_variables: ['description', 'pet']
messages: [('system', 'You are a helpful assistant. Be brief.'),
           ('human', "I've recently adopted a dog. Could you s...")]

JAVOB: Sure! Here are some popular dog names:
       1. Max   2. Ricochet   3. Pup   4. Fluffy   5. Whiskers ...
```

> ## ✅ **"Be brief" KO'RSATMASI QISMAN ISHLADI** — javob ro'yxat shaklida, lekin **10 ta** nom berdi.
>
> ## 🔑 **ANIQ CHEKLOV — ANIQ NATIJA:**
> ```
> ❌ "Be brief"                    →  model o'zi hal qiladi
> ✅ "Answer in at most 3 words"   →  o'lchanadigan cheklov
> ✅ "List exactly 3 names"        →  aniq son
> ```
>
> ## 💡 **QOIDA: SISTEM PROMPTNI O'LCHANADIGAN QILING.** *"Qisqa"* — subyektiv. *"3 ta jumla"* — **tekshirilishi mumkin**.

---

## 5. 🇺🇿 O'zbekcha sistem xabari

```python
response = chat.invoke([
    ("system", "You are a bank assistant for Uzbekistan. "
               "Answer in Uzbek, in at most 3 sentences. "
               "If unsure, reply exactly: 'Operatorga murojaat qiling.'"),
    ("human", "Depozit foizi qancha?"),
])
```

> ## 🔑 **UCHTA QOIDA — 38-MODULDAN:**
> ```
> ① Ko'rsatma INGLIZCHA     →  model unga yaxshiroq bo'ysunadi
> ② Javob tili KO'RSATILGAN →  "Answer in Uzbek"
> ③ ANIQ chegara            →  "reply exactly: ..."
> ```
>
> ## ⚠️ **VA HALOL BO'LAMIZ:** ① ni biz **isbotlay olmadik** *(38-modul, 7-bo'lim)* — mahalliy model juda kichik edi. Bu — **amaliyotdan kelgan tavsiya**, **o'lchangan fakt emas**. `gpt-4o-mini` bilan **o'zingiz sinang**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** LangChain'da `user` roli qanday ataladi?

**M2.** `invoke` ga nima uzatiladi?

**M3.** `.type` qanday qiymatlar oladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **`HumanMessage`** *(`.type == 'human'`)*.

**M2.** ## **Ro'yxat** — `[SystemMessage(...), HumanMessage(...)]` yoki kortejlar.

**M3.** ## `'system'` · `'human'` · `'ai'` · `'tool'`.

</details>

### 🟡 O'rta

**M4.** ⭐ Xabar sinflarini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.messages import (SystemMessage, HumanMessage,
                                     AIMessage, ToolMessage)
for M in [SystemMessage, HumanMessage, AIMessage]:
    m = M(content="test")
    print(f"{M.__name__:16s} type={m.type!r}  maydonlar={list(M.model_fields)[:5]}")
```

</details>

**M5.** ⭐ Kortej va sinf yozuvini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.prompts import ChatPromptTemplate

a = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("{d}"),
    HumanMessagePromptTemplate.from_template("{q}")])
b = ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])

print(a.invoke({"d": "X", "q": "Y"}).messages)
print(b.invoke({"d": "X", "q": "Y"}).messages)
```

## ✅ **NATIJA AYNAN BIR XIL.**

</details>

**M6.** ⭐⭐ Sistem xabarining ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
SAVOL = "Explain what a black hole is."
PERSONALAR = {
    "yo'q": None,
    "qisqa": "Answer in at most one sentence.",
    "aniq": "Answer in exactly 10 words. No more, no less.",
    "bola uchun": "Explain to a 10-year-old using one analogy.",
}
for nom, sp in PERSONALAR.items():
    msgs = ([("system", sp)] if sp else []) + [("human", SAVOL)]
    r = chat.invoke(msgs)
    print(f"{nom:12s} {len(r.content.split()):3d} so'z  {r.content[:70]}")
```

## 🔑 **`so'z` USTUNIGA QARANG.** *"Qisqa"* — subyektiv, *"exactly 10 words"* — **o'lchanadigan**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Sistem prompt tekshiruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re

def sistem_prompt_tekshir(sp):
    """Yaxshi sistem promptning to'rtta elementi bormi?"""
    past = sp.lower()
    tekshiruv = {
        "① ROL":     bool(re.search(r"you are|siz\b", past)),
        "② VAZIFA":  bool(re.search(r"answer|classify|summar|translat|javob", past)),
        "③ FORMAT":  bool(re.search(r"sentence|word|json|list|format|jumla", past)),
        "④ CHEGARA": bool(re.search(r"if.*(unsure|not|unknown)|never|only|exactly",
                                    past)),
    }
    for k, v in tekshiruv.items():
        print(f"{'✅' if v else '❌'} {k}")
    yoq = [k for k, v in tekshiruv.items() if not v]
    if yoq:
        print(f"\n⚠️ YETISHMAYDI: {', '.join(yoq)}")
    return tekshiruv

sistem_prompt_tekshir("You are Marv, a sarcastic chatbot.")
print()
sistem_prompt_tekshir(
    "You are a bank assistant. Answer questions about deposits. "
    "Reply in at most 3 sentences. If unsure, reply exactly: "
    "'Operatorga murojaat qiling.'")
```

## 🏆 **④ CHEGARA — ENG KO'P UNUTILADIGANI.** Usiz model **yolg'on to'qiydi** *(31-modul)*.

</details>

---

## 📌 Xulosa

```python
from langchain_core.messages import SystemMessage, HumanMessage

chat.invoke([SystemMessage(content="..."), HumanMessage(content="...")])
# yoki SODDAROQ:
chat.invoke([("system", "..."), ("human", "...")])
```

| OpenAI | LangChain | `.type` |
|---|---|---|
| `system` | `SystemMessage` | `'system'` |
| ## `user` | ## `HumanMessage` | ## `'human'` |
| ## `assistant` | ## `AIMessage` | ## `'ai'` |

> ## 🔑 **SISTEM PROMPTNI O'LCHANADIGAN QILING:** *"qisqa"* ❌ · *"exactly 3 sentences"* ✅

---

⬅️ [2-dars. ChatOpenAI](02-ChatOpenAI.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. AI xabarlar](04-AI-Messages.md)
