# 5-dars. Prompt shablonlari va prompt qiymatlari ⭐

## 🎬 Boshlashdan oldin

> **"Bu xabar obyektlari juda foydali bo'lib chiqdi, lekin ularning JIDDIY KAMCHILIGI bor — ular QAYTA ISHLATILMAYDI."**

---

## 1. Muammo

```python
message_h_dog  = HumanMessage(content="I've recently adopted a dog. Suggest dog names?")
message_h_cat  = HumanMessage(content="I've recently adopted a cat. Suggest cat names?")
message_h_fish = HumanMessage(content="I've recently adopted a fish. Suggest fish names?")
#                                                       ↑
#                                            faqat SHU so'z o'zgaradi
```

> ## 🔑 **YECHIM — SHABLON:**
> ```python
> "I've recently adopted a {pet}. Suggest {pet} names?"
> ```

---

## 2. `PromptTemplate`

> **"Ba'zi ishlab chiquvchilar satr shablonlari uchun BOSH HARFLARDAN foydalanish konvensiyasiga amal qilishadi."**

```python
from langchain_core.prompts import PromptTemplate

TEMPLATE = """
System:
{description}

Human:
I've recently adopted a {pet}.
Could you suggest some {pet} names?
"""

prompt_template = PromptTemplate.from_template(template=TEMPLATE)
print("input_variables:", prompt_template.input_variables)
```

```
input_variables: ['description', 'pet']
```

> ## ⭐ **`input_variables` AVTOMATIK aniqlandi** — siz ro'yxat yozmadingiz.
>
> ## 💡 **VA E'TIBOR BERING — `{pet}` IKKI MARTA ISHLATILGAN, LEKIN RO'YXATDA BIR MARTA.**

---

## 3. `invoke` → `PromptValue`

![Shablon oqimi](assets/02-shablon.svg)

> **"`PromptTemplate` sinfining qulay xususiyati — u tanish `invoke` metodini amalga oshiradi. U LUG'AT kutadi va `PromptValue` obyektini qaytaradi."**

```python
prompt_value = prompt_template.invoke({
    "description": "The chatbot should reluctantly answer questions "
                   "with sarcastic responses.",
    "pet": "dog"})

print(type(prompt_value).__name__)
print(repr(prompt_value.text))
```

```
StringPromptValue
"\nSystem:\nThe chatbot should reluctantly answer questions with sarcastic
responses.\n\nHuman:\nI've recently adopted a dog.\nCould you suggest some
dog names?\n"
```

> ## ⭐⭐ **BU — KURSNING ASOSIY G'OYASI:**
> ```
> chat.invoke(satr)                 →  AIMessage
> prompt_template.invoke(lug'at)    →  PromptValue
>                                        ↓
>                            chat.invoke(PromptValue)  →  AIMessage
> ```
> **Bir `invoke` ning CHIQISHI ikkinchisining KIRISHI.** Mana **zanjir** *(chain)* g'oyasi — 41-modulda `|` operatoriga aylanadi.

---

## 4. ⚠️⚠️ ENG KO'P UCHRAYDIGAN TUZOQ — FIGURALI QAVS

Bu — kursda **umuman aytilmagan**, lekin **deyarli har bir loyihada** uchraydi.

```python
from langchain_core.prompts import ChatPromptTemplate

ct = ChatPromptTemplate.from_messages([
    ("human", 'JSON qaytaring: {"a": 1} va {savol}')])

print("input_variables:", ct.input_variables)
ct.invoke({"savol": "test"})
```

```
input_variables: ['"a"', 'savol']

KeyError: 'Input to ChatPromptTemplate is missing variables {\'"a"\'}.
Expected: [\'"a"\', \'savol\'] Received: [\'savol\']
Note: if you intended {"a"} to be part of the string and not a variable,
please escape it with double curly braces like: \'{{"a"}}\'.'
```

> ## 💥💥 **`{"a": 1}` — SHABLON UNI O'ZGARUVCHI DEB O'YLADI.**
>
> Bu **doim** sodir bo'ladi, chunki siz **JSON namunasini** promptga qo'yasiz:
> ```
> "Javobni shu formatda bering: {"ism": "...", "yosh": 0}"
> ```
>
> ## ✅ **UCHTA YECHIM:**
> ```python
> # ① IKKI QAVAT figurali qavs
> ('human', 'JSON: {{"a": 1}} va {savol}')
>
> # ② partial_variables bilan
> ct = ChatPromptTemplate.from_messages([("human", "JSON: {namuna} va {savol}")])
> ct = ct.partial(namuna='{"a": 1}')
>
> # ③ ⭐ ENG YAXSHISI — response_format ishlating (38-modul)
> #    namunani promptga umuman qo'ymang
> ```

> ## 🔑 **LANGCHAIN XATO XABARI YAXSHI** — u sizga **aynan nima qilishni** aytadi *(`{{"a"}}`)*. Uni **o'qing**.

---

## 5. ⭐ Yetishmayotgan o'zgaruvchi — DARHOL xato

```python
ct = ChatPromptTemplate.from_messages([
    ("system", "{description}"),
    ("human", "I adopted a {pet}. Suggest {pet} names?")])

ct.invoke({"pet": "dog"})       # description YO'Q
```

```
KeyError: "Input to ChatPromptTemplate is missing variables {'description'}.
Expected: ['description', 'pet'] Received: ['pet']"
```

> ## ✅ **BU — SHABLONLARNING HAQIQIY QIYMATI.**
>
> ```
> f-string bilan   →  f"...{opis}..."  →  opis=None bo'lsa JIM "None" yoziladi
> Shablon bilan    →  ⭐ DARHOL KeyError
> ```
>
> ## 💡 **Jim xato — eng qimmat xato.** Shablon uni **kompilyatsiya vaqtida** emas, lekin **birinchi chaqiruvda** ushlaydi.

---

## 6. 🔬 Qayta ishlatishni AMALDA ko'ramiz

Biz shablonni **mahalliy model** bilan uchta qiymatda ishga tushirdik:

```python
ct = ChatPromptTemplate.from_messages([
    ("system", "{description}"),
    ("human", "I've recently adopted a {pet}. Could you suggest some {pet} names?")])

for pet in ["dog", "cat", "fish"]:
    cv = ct.invoke({"description": "You are a helpful assistant. Be brief.",
                    "pet": pet})
    print(f"{pet:5s} → {javob(cv)[:90]}")
```

```
dog   → Sure! Here are some popular dog names: 1. Max  2. Ricochet  3. Pup ...
cat   → Sure! Here are some popular and fun cat names: 1. Luna  2. Luna  3. Whiskers ...
fish  → Sure! Here are some popular and interesting fish names: 1. Rainbow Trout ...
```

> ## ✅ **BITTA SHABLON — UCHTA TURLI JAVOB.** Kod **o'zgarmadi**.
>
> ## 😄 **VA BITTA KULGULI XATO:** `cat` javobida `1. Luna  2. Luna` — model **takrorladi**. Bu — `0.5B` modelning **cheklovi**, shablonniki emas.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `PromptTemplate.invoke()` nima qaytaradi?

**M2.** `input_variables` qanday aniqlanadi?

**M3.** Shablonda `{"a": 1}` yozsa nima bo'ladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **`StringPromptValue`** — `.text` da matn.

**M2.** ## **Avtomatik** — shablondagi `{...}` lardan.

**M3.** ## 💥 **`"a"` o'zgaruvchi deb qabul qilinadi** → `KeyError`. Yechim: `{{"a": 1}}`.

</details>

### 🟡 O'rta

**M4.** ⭐ Shablon yarating va bir necha qiymatda ishlating.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.prompts import PromptTemplate

T = PromptTemplate.from_template(
    "Tarjima qiling ({til}): {matn}")
print("o'zgaruvchilar:", T.input_variables)
for til in ["inglizcha", "ruscha"]:
    print(T.invoke({"til": til, "matn": "Salom dunyo"}).text)
```

</details>

**M5.** ⭐⭐ Figurali qavs tuzog'ini takrorlang va tuzating.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.prompts import ChatPromptTemplate

# ❌ SINADI
try:
    ChatPromptTemplate.from_messages(
        [("human", 'Format: {"ism": "..."} · Savol: {q}')]).invoke({"q": "x"})
except KeyError as e:
    print("❌", str(e)[:110])

# ✅ IKKI QAVAT
ok = ChatPromptTemplate.from_messages(
    [("human", 'Format: {{"ism": "..."}} · Savol: {q}')])
print("✅", ok.invoke({"q": "x"}).messages[0].content)

# ✅ partial
p = ChatPromptTemplate.from_messages(
    [("human", "Format: {fmt} · Savol: {q}")]).partial(fmt='{"ism": "..."}')
print("✅", p.invoke({"q": "x"}).messages[0].content)
```

</details>

**M6.** ⭐ Yetishmayotgan o'zgaruvchini sinang.

<details>
<summary>✅ Yechim</summary>

```python
ct = ChatPromptTemplate.from_messages([("system", "{d}"), ("human", "{q}")])
try:
    ct.invoke({"q": "test"})
except KeyError as e:
    print("✅ xato ushlandi:", str(e)[:90])
```

## 🔑 **f-string bo'lsa — `None` jim o'tib ketardi.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Shablon tekshiruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re

def shablon_tekshir(matn):
    """Shablondagi keng tarqalgan xatolarni topadi."""
    muammolar = []

    # ① yakka figurali qavslar ichida JSON belgilar
    for m in re.findall(r"\{([^{}]*)\}", matn):
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", m.strip()):
            muammolar.append(f"💥 {{{m}}} — o'zgaruvchi nomiga o'xshamaydi. "
                             f"JSON bo'lsa {{{{...}}}} yozing")

    # ② muvozanatsiz qavslar
    if matn.count("{") != matn.count("}"):
        muammolar.append("💥 figurali qavslar soni MOS EMAS")

    # ③ ortiqcha bo'shliq
    if re.search(r"\n[ \t]{4,}", matn):
        muammolar.append("⚠️ qatorlar boshida ortiqcha bo'shliq — token isrofi")

    print("\n".join(muammolar) if muammolar else "✅ toza")
    return muammolar

shablon_tekshir('JSON: {"a": 1}, savol: {q}')
print()
shablon_tekshir("""
        System:
        {description}
        Human: {q}
""")
```

## 🏆 **BU FUNKSIYANI HAR SHABLONGA QO'LLANG** — ikkala tuzoqni **oldindan** ushlaydi.

</details>

---

## 📌 Xulosa

```
"...{pet}..."  →  PromptTemplate.from_template(...)
                        ↓  .invoke({"pet": "dog"})
                  StringPromptValue(.text)
                        ↓
                  chat.invoke(prompt_value)  →  AIMessage

⭐ Bir invoke ning CHIQISHI ikkinchisining KIRISHI  →  41-modul: |
```

| Tuzoq | Belgi | Yechim |
|---|---|---|
| ## `{"a": 1}` | `KeyError: '"a"'` | ## `{{"a": 1}}` yoki `.partial()` |
| Yetishmagan o'zgaruvchi | `KeyError: missing` | ## ✅ **bu YAXSHI** — jim xato emas |
| Ortiqcha bo'shliq | *(jim)* | qatorlarni birlashtiring |

---

⬅️ [4-dars. AI xabarlar](04-AI-Messages.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. Chat prompt shablonlari](06-Chat-Prompt-Templates.md)
