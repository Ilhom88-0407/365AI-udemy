# 6-dars. Chat prompt shablonlari va chat prompt qiymatlari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Endi prompt shablonlari va prompt qiymatlari mexanikasini tushunganingizdan so'ng, chat prompt shablonlari qanday ishlashini tushunish uchun barcha vositalarga egasiz."**

---

## 1. Farq — ROLLAR

```
PromptTemplate          →  bitta MATN bo'lagi        (rollar YO'Q)
ChatPromptTemplate      →  ⭐ ROLLI xabarlar ro'yxati
```

```python
from langchain_core.prompts.chat import (SystemMessagePromptTemplate,
                                         HumanMessagePromptTemplate,
                                         ChatPromptTemplate)

TEMPLATE_S = "{description}"
TEMPLATE_H = """I've recently adopted a {pet}.
Could you suggest some {pet} names?"""

message_template_s = SystemMessagePromptTemplate.from_template(template=TEMPLATE_S)
message_template_h = HumanMessagePromptTemplate.from_template(template=TEMPLATE_H)

chat_template = ChatPromptTemplate.from_messages([message_template_s,
                                                  message_template_h])
print("input_variables:", chat_template.input_variables)
```

```
input_variables: ['description', 'pet']
```

---

## 2. `invoke` → `ChatPromptValue`

```python
chat_value = chat_template.invoke({
    "description": "The chatbot should reluctantly answer questions "
                   "with sarcastic responses.",
    "pet": "dog"})

print(type(chat_value).__name__)
for m in chat_value.messages:
    print(f"  {m.type:7s}: {m.content[:56]!r}")
```

```
ChatPromptValue
  system : 'The chatbot should reluctantly answer questions with sar'
  human  : "I've recently adopted a dog.\nCould you suggest some dog "
```

> ## 🔑 **JOY EGALLOVCHILAR TO'LDIRILDI, VA `...MessagePromptTemplate` LAR `...Message` LARGA AYLANDI:**
> ```
> SystemMessagePromptTemplate  →  SystemMessage
> HumanMessagePromptTemplate   →  HumanMessage
> ```

---

## 3. Modelga uzatamiz

```python
response = chat.invoke(chat_value)          # ⭐ PromptValue qabul qilinadi
print(response.content)
```

> ## ⭐⭐ **VA MANA KURSNING ASOSIY XULOSASI:**
>
> > **"Bir `invoke` metodining chiqishi ikkinchisining kirishi bo'lib xizmat qiladi. Bu tushunchani anglash LangChain'dagi zanjirlar qanday ishlashini tushunishga qadam bo'ladi."**
>
> ```
> chat_template.invoke({...})   →  ChatPromptValue
>                                        ↓
> chat.invoke(chat_value)       →  AIMessage
> ```
>
> ## 🏆 **41-MODULDA BU IKKI SATR BITTASIGA AYLANADI:**
> ```python
> zanjir = chat_template | chat
> zanjir.invoke({"description": "...", "pet": "dog"})
> ```

---

## 4. ⭐⭐ Sodda muqobil — kortejlar bilan

Kurs **beshta** sinf import qiladi. Bir xil natijani **importsiz** olish mumkin:

```python
from langchain_core.prompts import ChatPromptTemplate

chat_template = ChatPromptTemplate.from_messages([
    ("system", "{description}"),
    ("human", "I've recently adopted a {pet}. Could you suggest some {pet} names?"),
])
```

Biz **ikkalasini ham** sinab ko'rdik:

```python
a = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template("{d}"),
        HumanMessagePromptTemplate.from_template("{q}")])
b = ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])

print(a.invoke({"d": "X", "q": "Y"}).messages)
print(b.invoke({"d": "X", "q": "Y"}).messages)
```

```
[SystemMessage(content='X'), HumanMessage(content='Y')]
[SystemMessage(content='X'), HumanMessage(content='Y')]        ← AYNAN BIR XIL
```

> ## ✅ **NATIJA BIR XIL.** Kortejlar — **kamroq import, kamroq kod, kamroq xato**.
>
> ## 💡 **QACHON SINFLAR KERAK?** Faqat qo'shimcha parametrlar berilganda *(masalan `additional_kwargs`)*. Amalda — **kamdan-kam**.

---

## 5. ⭐ `MessagesPlaceholder` — kursda YO'Q, lekin ZARUR

Chatbotda **suhbat tarixini** shablonga qo'yish kerak bo'ladi. Buning uchun maxsus vosita bor:

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

ct = ChatPromptTemplate.from_messages([
    ("system", "Siz {rol}siz. Qisqa javob bering."),
    MessagesPlaceholder(variable_name="tarix"),      # ⭐ xabarlar RO'YXATI
    ("human", "{savol}"),
])

from langchain_core.messages import HumanMessage, AIMessage
cv = ct.invoke({
    "rol": "bank yordamchisi",
    "tarix": [HumanMessage(content="Salom"),
              AIMessage(content="Salom! Sizga qanday yordam bera olaman?")],
    "savol": "Depozit foizi qancha?"})

for m in cv.messages:
    print(f"  {m.type:7s}: {m.content[:50]}")
```

```
  system : Siz bank yordamchisisiz. Qisqa javob bering.
  human  : Salom
  ai     : Salom! Sizga qanday yordam bera olaman?
  human  : Depozit foizi qancha?
```

> ## 🏆 **`MessagesPlaceholder` — XOTIRALI CHATBOTNING KALITI.**
>
> `langchain.memory` **olib tashlangan** *(35-modul)*, shuning uchun **zamonaviy** xotira aynan shu naqsh bilan quriladi:
> ```
> ChatPromptTemplate + MessagesPlaceholder + InMemoryChatMessageHistory
>                  + RunnableWithMessageHistory
> ```
> **Kurs bu sinfni ko'rsatmaydi** — chunki u davrda `ConversationChain` bor edi.

---

## 6. 🇺🇿 O'zbekcha shablon

```python
uz = ChatPromptTemplate.from_messages([
    ("system", "Siz {rol}siz. Qisqa javob bering."),
    ("human", "{savol}")])

cv = uz.invoke({"rol": "bank yordamchisi", "savol": "Depozit nima?"})
print([(m.type, m.content) for m in cv.messages])
```

```
[('system', 'Siz bank yordamchisisiz. Qisqa javob bering.'),
 ('human', 'Depozit nima?')]
```

> ## ✅ **O'ZBEKCHA JOY EGALLOVCHILAR MUAMMOSIZ ISHLAYDI.**
>
> ## ⚠️ **LEKIN O'ZGARUVCHI NOMLARIDA APOSTROF ISHLATMANG:**
> ```python
> ❌ "{so'rov}"      →  o'zgaruvchi nomi ' bilan buziladi
> ✅ "{sorov}"       →  lotin harflari va _ ishlating
> ```
> ## 🔑 **QOIDA:** o'zgaruvchi **nomlari** — `[A-Za-z_][A-Za-z0-9_]*`. **Qiymatlar** esa istalgan o'zbekcha matn bo'lishi mumkin.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `PromptTemplate` va `ChatPromptTemplate` farqi?

**M2.** `chat_template.invoke()` nima qaytaradi?

**M3.** `chat.invoke()` qanday kirishlarni qabul qiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Birinchisi — **bitta matn**, ikkinchisi — ## **rolli xabarlar ro'yxati**.

**M2.** ## **`ChatPromptValue`** — `.messages` da xabarlar.

**M3.** ## **satr** · **xabarlar ro'yxati** · **`PromptValue`**.

</details>

### 🟡 O'rta

**M4.** ⭐ Ikki yozuvni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
a = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template("{d}"),
        HumanMessagePromptTemplate.from_template("{q}")])
b = ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])
print(a.invoke({"d": "X", "q": "Y"}).messages ==
      b.invoke({"d": "X", "q": "Y"}).messages)      # True
```

</details>

**M5.** ⭐⭐ `MessagesPlaceholder` bilan xotira qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

ct = ChatPromptTemplate.from_messages([
    ("system", "Siz yordamchisiz."),
    MessagesPlaceholder("tarix"),
    ("human", "{savol}")])

tarix = []
def sora(savol):
    cv = ct.invoke({"tarix": tarix, "savol": savol})
    r = chat.invoke(cv)
    tarix.extend([HumanMessage(content=savol), r])
    return r.content

print(sora("Ismim Alisher"))
print(sora("Ismim nima?"))          # ⭐ tarixdan topadi
```

## 🏆 **BU — `ConversationChain` NING ZAMONAVIY O'RNINI BOSUVCHISI.**

</details>

**M6.** ⭐ Shablonni bir necha qiymatda ishlating.

<details>
<summary>✅ Yechim</summary>

```python
ct = ChatPromptTemplate.from_messages([
    ("system", "{description}"),
    ("human", "I've recently adopted a {pet}. Suggest some {pet} names?")])

for pet in ["dog", "cat", "fish"]:
    cv = ct.invoke({"description": "Be brief.", "pet": pet})
    print(f"{pet:5s} → {chat.invoke(cv).content[:70]}")
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Ko'p tilli shablon fabrikasi.

<details>
<summary>✅ Yechim</summary>

```python
class KopTilliShablon:
    """Bir shablon — bir necha til uchun sistem prompt."""

    SISTEM = {
        "uz": ("You are a helpful assistant for Uzbek users. "
               "Answer in Uzbek, in at most {n} sentences. "
               "If unsure, reply exactly: 'Aniq bilmayman.'"),
        "en": ("You are a helpful assistant. Answer in English, "
               "in at most {n} sentences. If unsure, reply exactly: "
               "'I am not sure.'"),
        "ru": ("You are a helpful assistant. Answer in Russian, "
               "in at most {n} sentences. If unsure, reply exactly: "
               "'Я не уверен.'"),
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
    print(f"[{til}] {k.sora('What is a deposit?', til)[:110]}")
```

## ⚠️ **`.replace("{n}", ...)` NI E'TIBOR BERING** — `{n}` ni shablon o'zgaruvchisi qilib **qoldirmadik**, chunki u **har chaqiruvda o'zgarmaydi**. `.partial()` ham ishlaydi.

## 💡 **`optional=True`** — `MessagesPlaceholder` ni **majburiy bo'lmagan** qiladi.

</details>

---

## 📌 Xulosa

```
SystemMessagePromptTemplate  ┐
HumanMessagePromptTemplate   ├─→ ChatPromptTemplate.from_messages([...])
AIMessagePromptTemplate      ┘              ↓  .invoke({...})
                                    ChatPromptValue(.messages)
                                              ↓
                                    chat.invoke(chat_value) → AIMessage

⭐ SODDAROQ:  ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])
⭐ XOTIRA  :  + MessagesPlaceholder("tarix")
```

| | Kurs | Biz qo'shdik |
|---|---|---|
| `...MessagePromptTemplate` | ✅ | ✅ + ## **kortejlar** |
| `ChatPromptValue` | ✅ | ✅ |
| ## `MessagesPlaceholder` | ## ❌ | ## ⭐ **xotiraning kaliti** |
| 🇺🇿 O'zbekcha shablon | ❌ | ✅ + **nom qoidasi** |

---

⬅️ [5-dars. Prompt shablonlari](05-Prompt-Templates-and-Prompt-Values.md) · 🏠 [Modul boshiga](README.md) · ➡️ [7-dars. Few-shot chat shablonlari](07-Few-Shot-Chat-Message-Prompt-Templates.md)
