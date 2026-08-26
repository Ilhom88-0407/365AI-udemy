# 2-dars. Vergul bilan ajratilgan ro'yxat parseri ⭐⭐

## 🎬 Boshlashdan oldin

> **"Hmm. Bu biz kutgan narsa emas, shunday emasmi? `response_parsed` haqiqatan ro'yxat, lekin biz kutgani emas."**

---

## 1. Muammo va kursning yechimi

```python
from langchain_core.output_parsers import CommaSeparatedListOutputParser

lp = CommaSeparatedListOutputParser()
r = chat.invoke([("human", "I've recently adopted a dog. Suggest some dog names?")])
print(lp.invoke(r))
```

Model **raqamli ro'yxat** qaytaradi, parser esa uni **bitta element** qilib beradi.

> **"Buni qanday hal qilamiz? Albatta, chat modelga KO'RSATMA berish orqali."**

```python
print(lp.get_format_instructions())
```

```
Your response should be a list of comma separated values,
eg: `foo, bar, baz` or `foo,bar,baz`
```

```python
message_h = HumanMessage(content=f"""I've recently adopted a dog.
Could you suggest some dog names?

{CommaSeparatedListOutputParser().get_format_instructions()}
""")
```

> ## ✅ **KURSNING YONDASHUVI TO'G'RI:** parser **o'zi** modelga **qanday format kerakligini** aytadi.

---

## 2. 🔬 Parser QANCHALIK ISHONCHLI? — O'LCHADIK

Kurs faqat **muvaffaqiyatli** holatni ko'rsatadi. Biz **beshta** kirish bilan sinadik:

```python
for s in ["Bark Twain, Sir Waggington, Chewbarka",
          "Bark Twain,Sir Waggington,Chewbarka",
          "1. Bark Twain\n2. Sir Waggington",
          "Here are some names: Bark Twain, Sir Waggington.",
          "Bark Twain, Sir Waggington, and Chewbarka"]:
    print(f"{s[:44]!r:48s} → {lp.invoke(s)}")
```

```
'Bark Twain, Sir Waggington, Chewbarka'          → ['Bark Twain', 'Sir Waggington', 'Chewbarka']   ✅
'Bark Twain,Sir Waggington,Chewbarka'            → ['Bark Twain', 'Sir Waggington', 'Chewbarka']   ✅
'1. Bark Twain\n2. Sir Waggington'               → ['1. Bark Twain', '2. Sir Waggington']          ❌
'Here are some names: Bark Twain, Sir Wagging'   → ['Here are some names: Bark Twain', 'Sir Wa...'] ❌
'Bark Twain, Sir Waggington, and Chewbarka'      → ['Bark Twain', 'Sir Waggington', 'and Chewbarka'] ❌
```

> ## 💥💥 **PARSER SHUNCHAKI VERGUL BO'YICHA BO'LADI — BOSHQA HECH NARSA QILMAYDI.**
>
> ```
> ❌ Raqamli ro'yxat        →  "1. Bark Twain" bitta element bo'lib qoladi
> ❌ Muqaddima              →  "Here are some names: Bark Twain" birinchi element
> ❌ "and" bog'lovchisi     →  "and Chewbarka" ← "and" QOLADI
> ```
>
> ## 💥 **VA ENG XAVFLISI — U XATO BERMAYDI.** U **doim** ro'yxat qaytaradi. Siz `['Here are some names: Bark Twain', ...]` ni **to'g'ri deb qabul qilasiz**.
>
> ## 🔑 **BU — JIM XATO.** 33, 34, 37-modullarda ko'rgan naqshning **yana bir ko'rinishi**.

---

## 3. ✅ To'rtta himoya qatlami

```python
import re

RUXSATSIZ = {"and", "va", "or", "yoki", ""}

def ishonchli_royxat(matn, parser, kutilgan_son=None, max_uzunlik=40):
    """Parser natijasini TOZALAYDI va TEKSHIRADI."""
    ogoh = []

    # ① Muqaddimani olib tashlash
    if ":" in matn.split(",")[0]:
        matn = matn.split(":", 1)[1]
        ogoh.append("muqaddima olib tashlandi")

    # ② Raqamli ro'yxatni aniqlash
    if re.search(r"^\s*\d+[\.\)]", matn, re.M):
        ogoh.append("⚠️ RAQAMLI ro'yxat — NumberedListOutputParser ishlating")

    natija = parser.invoke(matn)

    # ③ Elementlarni tozalash
    toza = []
    for x in natija:
        x = re.sub(r"^\s*\d+[\.\)]\s*", "", x).strip(" .\n")
        x = re.sub(r"^(and|va|or|yoki)\s+", "", x, flags=re.I).strip()
        if x.lower() not in RUXSATSIZ and len(x) <= max_uzunlik:
            toza.append(x)
        elif len(x) > max_uzunlik:
            ogoh.append(f"⚠️ juda uzun element tashlandi: {x[:30]!r}")

    # ④ Sonini tekshirish
    if kutilgan_son and len(toza) != kutilgan_son:
        ogoh.append(f"⚠️ {kutilgan_son} ta kutilgan, {len(toza)} ta olindi")

    return {"royxat": toza, "ogoh": ogoh}
```

```python
for s in ["1. Bark Twain\n2. Sir Waggington",
          "Here are some names: Bark Twain, Sir Waggington.",
          "Bark Twain, Sir Waggington, and Chewbarka"]:
    r = ishonchli_royxat(s, lp, kutilgan_son=3)
    print(f"{s[:40]!r:44s} → {r['royxat']}")
    for o in r["ogoh"]:
        print(f"{'':46s}   {o}")
```

> ## 🏆 **④ — SONINI TEKSHIRISH — ENG ARZON VA ENG FOYDALI HIMOYA.** Promptda *"exactly 3 names"* deb yozing va natijani **sanang**.

---

## 4. ⭐ Boshqa ro'yxat parserlari — kursda YO'Q

```python
import langchain_core.output_parsers as O
print([x for x in dir(O) if x.endswith("Parser")])
```

```
['BaseCumulativeTransformOutputParser', 'BaseGenerationOutputParser',
 'BaseLLMOutputParser', 'BaseOutputParser', 'BaseTransformOutputParser',
 'CommaSeparatedListOutputParser', 'JsonOutputKeyToolsParser',
 'JsonOutputParser', 'JsonOutputToolsParser', 'ListOutputParser',
 'MarkdownListOutputParser', 'NumberedListOutputParser',
 'PydanticOutputParser', 'PydanticToolsParser', 'SimpleJsonOutputParser',
 'StrOutputParser', 'XMLOutputParser']
```

| Parser | Qachon |
|---|---|
| `CommaSeparatedListOutputParser` | `a, b, c` |
| ## `NumberedListOutputParser` | ## `1. a` `2. b` — **modellar buni yaxshi ko'radi** |
| `MarkdownListOutputParser` | `- a` `- b` |
| ## `JsonOutputParser` | ## **JSON** — 3-darsda |
| ## `PydanticOutputParser` | ## **tipli obyekt** — 3-darsda |
| `XMLOutputParser` | XML *(Anthropic modellar uchun qulay)* |

> ## 💡 **`NumberedListOutputParser` — AMALIY MASLAHAT.** LLM'lar **tabiiy ravishda** raqamli ro'yxat yozadi. Ularni vergulga **majburlashdan** ko'ra — **tabiiy** formatini **parse qilish** osonroq.

```python
from langchain_core.output_parsers import NumberedListOutputParser
np_ = NumberedListOutputParser()
print(np_.get_format_instructions())
print(np_.invoke("1. Bark Twain\n2. Sir Waggington\n3. Chewbarka"))
```

---

## 5. 🇺🇿 O'zbekcha ro'yxat

```python
UZ_KO_RSATMA = ("Javobingiz vergul bilan ajratilgan ro'yxat bo'lsin, "
                "masalan: birinchi, ikkinchi, uchinchi. "
                "Boshqa hech narsa yozmang.")

r = chat.invoke([
    ("system", "You list items in Uzbek. Output nothing but the list."),
    ("human", f"Toshkentdagi 5 ta mashhur joyni sanang.\n\n{UZ_KO_RSATMA}")])
print(lp.invoke(r))
```

> ## ⚠️ **IKKI TUZOQ O'ZBEKCHA RO'YXATLARDA:**
> ```
> ① "va" bog'lovchisi     →  "...,  Chorsu va Minor"  →  "va Minor" element
> ② Vergul jumla ichida   →  "Amir Temur maydoni, shahar markazida"
>                             →  IKKITA element bo'lib bo'linadi!
> ```
>
> ## ✅ **YECHIM — VERGUL EMAS, BOSHQA AJRATUVCHI:**
> ```python
> KO_RSATMA = ("Har bir elementni YANGI QATORDA yozing, oldiga '- ' qo'ying. "
>              "Boshqa hech narsa yozmang.")
> # keyin: MarkdownListOutputParser()
> ```
> ## 🔑 **VERGUL — O'ZBEKCHA MATN UCHUN YOMON AJRATUVCHI.** Yangi qator yoki `|` **ancha xavfsizroq**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Parser modelga qanday ko'rsatma beradi?

**M2.** `CommaSeparatedListOutputParser` nima qiladi?

**M3.** U xato beradimi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `get_format_instructions()` — uni **promptga qo'shasiz**.

**M2.** ## **Faqat vergul bo'yicha bo'ladi.** Boshqa hech narsa.

**M3.** ## ❌ **Yo'q** — u **doim** ro'yxat qaytaradi. Bu — **jim xato**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Parserni beshta kirishda sinang.

<details>
<summary>✅ Yechim</summary>

```python
for s in ["a, b, c", "a,b,c", "1. a\n2. b",
          "Here are: a, b.", "a, b, and c"]:
    print(f"{s!r:26s} → {lp.invoke(s)}")
```

## 💥 **Faqat birinchi ikkitasi to'g'ri.**

</details>

**M5.** ⭐ `NumberedListOutputParser` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.output_parsers import NumberedListOutputParser
np_ = NumberedListOutputParser()
print(np_.get_format_instructions())
print(np_.invoke("1. Bark Twain\n2. Sir Waggington\n3. Chewbarka"))
print(np_.invoke("a, b, c"))            # ⚠️ nima bo'ladi?
```

</details>

**M6.** ⭐⭐ Tozalovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
import re

def tozala(elementlar, max_uzunlik=40):
    toza = []
    for x in elementlar:
        x = re.sub(r"^\s*\d+[\.\)]\s*", "", x).strip(" .\n")
        x = re.sub(r"^(and|va|or|yoki)\s+", "", x, flags=re.I).strip()
        if x and len(x) <= max_uzunlik:
            toza.append(x)
    return toza

print(tozala(lp.invoke("Bark Twain, Sir Waggington, and Chewbarka")))
print(tozala(lp.invoke("1. Bark\n2. Sir")))
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Ishonchli ro'yxat oluvchi.

<details>
<summary>✅ Yechim</summary>

```python
def ishonchli_royxat(chat, savol, n=3, urinish=2):
    """Sonini TEKSHIRADI va kerak bo'lsa QAYTA so'raydi."""
    KO_RSATMA = (f"Reply with EXACTLY {n} items, separated by ' | '. "
                 f"No numbering, no preamble, no explanation.")
    for i in range(urinish):
        r = chat.invoke([("system", KO_RSATMA), ("human", savol)])
        el = [x.strip() for x in r.content.split("|") if x.strip()]
        if len(el) == n:
            return {"ok": True, "royxat": el, "urinish": i + 1}
    return {"ok": False, "royxat": el, "sabab": f"{n} ta kutilgan, {len(el)} olindi"}

print(ishonchli_royxat(chat, "Toshkentdagi mashhur joylar", n=5))
```

## 🏆 **UCHTA YAXSHILANISH:**
```
① ' | ' ajratuvchi  →  vergul JUMLA ICHIDA bo'lishi mumkin
② "EXACTLY n"       →  sonini nazorat qilish
③ qayta urinish     →  bir marta xato — halokat emas
```

</details>

**M8.** ⭐⭐⭐ Parser ishonchliligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

SINOVLAR = [
    ("a, b, c",                        ["a", "b", "c"]),
    ("a,b,c",                          ["a", "b", "c"]),
    ("1. a\n2. b\n3. c",               ["a", "b", "c"]),
    ("Here are: a, b, c.",             ["a", "b", "c"]),
    ("a, b, and c",                    ["a", "b", "c"]),
    ("- a\n- b\n- c",                  ["a", "b", "c"]),
]

def baho(parser_fn, nom):
    tog = 0
    for kirish, kutilgan in SINOVLAR:
        try:
            olingan = parser_fn(kirish)
        except Exception:
            olingan = None
        tog += (olingan == kutilgan)
    print(f"{nom:34s} {tog}/{len(SINOVLAR)}")

baho(lambda s: lp.invoke(s), "CommaSeparatedListOutputParser")
baho(lambda s: tozala(lp.invoke(s)), "+ tozalovchi")
baho(lambda s: np_.invoke(s), "NumberedListOutputParser")
```

## 🏆 **BU — PARSER TANLASHNI TAXMINDAN O'LCHOVGA AYLANTIRADI.**

</details>

---

## 📌 Xulosa

```
parser.get_format_instructions()  →  promptga QO'SHING
        ↓
model TO'G'RI formatda javob beradi
        ↓
parser.invoke(javob)  →  ro'yxat

💥 LEKIN CommaSeparatedListOutputParser JUDA SODDA:
   ❌ raqamli ro'yxat · ❌ muqaddima · ❌ "and"
   💥 VA U XATO BERMAYDI — jim noto'g'ri natija
```

| Himoya | Nima beradi |
|---|---|
| ## Sonini tekshirish | ## **eng arzon, eng foydali** |
| Tozalovchi | raqam, `and`, nuqta |
| ## `' \| '` ajratuvchi | ## **vergul jumla ichida bo'lishi mumkin** |
| Qayta urinish | bir marta xato — halokat emas |
| ## `NumberedListOutputParser` | ## modelning **tabiiy** formati |

---

⬅️ [1-dars. String parser](01-String-Output-Parser.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Datetime parser](03-Datetime-Output-Parser.md)
