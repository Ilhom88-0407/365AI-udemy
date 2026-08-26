# 3-dars. Datetime parser va zamonaviy muqobillar ⭐⭐

## 🎬 Boshlashdan oldin

> **"Voy, biz xatoga duch keldik, aniqrog'i `OutputParserException` — 'could not parse datetime string'."**

---

## 1. ⚠️⚠️ AVVAL — KURSNING IMPORTI ISHLAMAYDI

```python
# KURSDAGI KOD
from langchain.output_parsers import DatetimeOutputParser
```

Biz **tekshirdik**:

```python
import importlib
for mod in ["langchain.output_parsers", "langchain_classic.output_parsers"]:
    try:
        m = importlib.import_module(mod)
        print(f"OK   {mod}.DatetimeOutputParser:", hasattr(m, "DatetimeOutputParser"))
    except ModuleNotFoundError:
        print(f"YO'Q {mod}")
```

```
YO'Q langchain.output_parsers
OK   langchain_classic.output_parsers.DatetimeOutputParser: True
```

> ## 💥 **`langchain.output_parsers` MODULI UMUMAN YO'Q** — 35-modulda ogohlantirgan edik.
>
> ## ✅ **IKKI YECHIM:**
> ```python
> # ① langchain-classic  (arxiv paket)
> pip install langchain-classic
> from langchain_classic.output_parsers import DatetimeOutputParser
>
> # ② ⭐ Zamonaviy — PydanticOutputParser bilan sana (5-bo'lim)
> ```

---

## 2. Kursning muammosi va yechimi

```python
from langchain_classic.output_parsers import DatetimeOutputParser

dp = DatetimeOutputParser()
r = chat.invoke([("human", "When was the Danish poet Piet Hein born?")])
dp.invoke(r)          # ❌ OutputParserException
```

> **"Va bu mantiqiy. Javobni datetime obyekti sifatida parse qilish MUMKIN EMAS, chunki satr faqat sanadan iborat emas, balki to'liq jumla."**

```python
print(dp.get_format_instructions())
```

```
Write a datetime string that matches the following pattern: '%Y-%m-%dT%H:%M:%S.%fZ'.

Examples: 2023-07-04T14:30:00.000000Z, 1999-12-31T23:59:59.999999Z,
2025-01-01T00:00:00.000000Z

Return ONLY this string, no other words!
```

```python
message_h = HumanMessage(content=f"""When was the Danish poet Piet Hein born?
{dp.get_format_instructions()}
""")
```

> ## ✅ **KURSNING YONDASHUVI TO'G'RI.** Lekin **qanchalik qattiq** ekanini u ko'rsatmaydi.

---

## 3. 💥 `DatetimeOutputParser` — JUDA QATTIQ

```python
for s in ["1905-12-16T00:00:00.000000Z", "1905-12-16", "December 16, 1905"]:
    try:
        print(f"{s!r:32s} → {dp.invoke(s)}")
    except Exception as e:
        print(f"{s!r:32s} → ❌ {type(e).__name__}")
```

```
'1905-12-16T00:00:00.000000Z'    → 1905-12-16 00:00:00          ✅
'1905-12-16'                     → ❌ OutputParserException     💥
'December 16, 1905'              → ❌ OutputParserException     💥
```

> ## 💥💥 **HATTOKI TO'G'RI SANA — `1905-12-16` — RAD ETILADI.**
>
> Parser **aynan** `%Y-%m-%dT%H:%M:%S.%fZ` formatini talab qiladi. Bitta belgi farq qilsa — **xato**.
>
> ## ✅ **VA BU — YAXSHI TOMONI:** u **jim** noto'g'ri ishlamaydi, **darhol** xato beradi *(`CommaSeparatedListOutputParser` dan farqli!)*.
>
> ## ⚠️ **LEKIN AMALDA BU MUAMMO:** model ba'zan `1905-12-16` yozadi va butun zanjir **sinadi**.

### ✅ Yumshoqroq muqobil — `dateutil`

```python
from dateutil import parser as dparser

def moslashuvchan_sana(matn):
    """Model qanday yozsa ham tushunadi."""
    import re
    matn = matn.strip().strip("`")
    try:
        return dparser.parse(matn, fuzzy=True)      # fuzzy — jumla ichidan topadi
    except Exception as e:
        raise ValueError(f"Sana topilmadi: {matn[:60]!r}") from e

for s in ["1905-12-16T00:00:00.000000Z", "1905-12-16", "December 16, 1905",
          "Piet Hein was born on December 16, 1905."]:
    try:
        print(f"{s[:44]!r:48s} → {moslashuvchan_sana(s).date()}")
    except ValueError as e:
        print(f"{s[:44]!r:48s} → ❌ {e}")
```

> ## 🏆 **`fuzzy=True` JUMLA ICHIDAN HAM SANANI TOPADI.**
>
> ## ⚠️ **LEKIN NARXI BOR:** `fuzzy` **noto'g'ri** sanani ham topishi mumkin *(masalan matndagi tasodifiy raqamni)*. **Natijani tekshiring** — sana **mantiqiy oraliqda**mi?

---

## 4. ⭐⭐ Zamonaviy yechim — `PydanticOutputParser`

![Parserlar](assets/01-parserlar.svg)

Kurs uni **ko'rsatmaydi**, lekin bu — **eng kuchli** parser.

```python
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

class Hayvon(BaseModel):
    ism: str = Field(description="hayvon ismi")
    tur: str = Field(description="hayvon turi")
    yosh: int = Field(description="yoshi")

pp = PydanticOutputParser(pydantic_object=Hayvon)
print(pp.get_format_instructions()[:300])
```

```
The output should be formatted as a JSON instance that conforms to the JSON
schema below.

As an example, for the schema {"properties": {"foo": {...}}, "required": ["foo"]}
the object {"foo": ["bar", "baz"]} is a well-formatted instance of the schema...
```

Biz **uchta kirishda** sinadik:

```python
for s in ['{"ism": "Bark Twain", "tur": "it", "yosh": 3}',
          '{"ism": "Bark Twain", "tur": "it"}',
          '{"ism": "Bark Twain", "tur": "it", "yosh": "uch"}']:
    try:
        print(f"{s[:44]!r:48s} → {pp.invoke(s)}")
    except Exception as e:
        print(f"{s[:44]!r:48s} → ❌ {type(e).__name__}")
```

```
'{"ism": "Bark Twain", "tur": "it", "yosh": 3'   → ism='Bark Twain' tur='it' yosh=3    ✅
'{"ism": "Bark Twain", "tur": "it"}'             → ❌ OutputParserException  (yosh YO'Q)
'{"ism": "Bark Twain", "tur": "it", "yosh": "'   → ❌ OutputParserException  (yosh SATR)
```

> ## 🏆 **`PydanticOutputParser` UCHTA NARSANI BIRDANIGA QILADI:**
> ```
> ① Modelga SXEMANI aytadi          (get_format_instructions)
> ② JSON ni parse qiladi
> ③ ⭐ TURLARNI va MAJBURIY maydonlarni TEKSHIRADI
> ```
>
> ## 💡 **`Field(description=...)` — MUHIM.** U **ko'rsatmaga** kiradi va modelga **har maydon nimani anglatishini** aytadi.

### Sana uchun ham ishlaydi

```python
from datetime import date

class Shoir(BaseModel):
    ism: str = Field(description="shoir ismi")
    tugilgan: date = Field(description="tug'ilgan sana, YYYY-MM-DD formatida")
    mamlakat: str = Field(description="mamlakat")

sp = PydanticOutputParser(pydantic_object=Shoir)
print(sp.invoke('{"ism": "Piet Hein", "tugilgan": "1905-12-16", "mamlakat": "Daniya"}'))
```

> ## ✅ **`date` TURI `1905-12-16` NI QABUL QILADI** — `DatetimeOutputParser` dan **ancha yumshoqroq** va **foydaliroq**.

---

## 5. ⭐ `JsonOutputParser` — o'rta yo'l

```python
from langchain_core.output_parsers import JsonOutputParser
jp = JsonOutputParser()

for s in ['{"ism": "Ali", "yosh": 30}',
          '```json\n{"ism": "Ali"}\n```',
          'Mana javob: {"ism": "Ali"}',
          '{"ism": "Ali",}']:
    try:
        print(f"{s[:38]!r:42s} → {jp.invoke(s)}")
    except Exception as e:
        print(f"{s[:38]!r:42s} → ❌ {type(e).__name__}")
```

```
'{"ism": "Ali", "yosh": 30}'               → {'ism': 'Ali', 'yosh': 30}   ✅
'```json\n{"ism": "Ali"}\n```'             → {'ism': 'Ali'}               ✅ ⭐ fence tozalanadi
'Mana javob: {"ism": "Ali"}'               → ❌ OutputParserException     (muqaddima)
'{"ism": "Ali",}'                          → ❌ OutputParserException     (ortiqcha vergul)
```

> ## ⭐ **``` ```json ``` ``` FENCE'NI AVTOMATIK TOZALAYDI** — bu **juda foydali**, chunki modellar **doim** shunday yozadi.
>
> ## ⚠️ **LEKIN MUQADDIMA VA NOTO'G'RI JSON — XATO.** Shuning uchun promptda `"Output nothing else"` **shart**.

---

## 6. 🏆 ENG ISHONCHLI YECHIM — parser EMAS

**38-modul, 3-darsda ko'rgan edik:**

```python
r = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[...],
    response_format={"type": "json_schema", "json_schema": {
        "name": "hayvon", "strict": True,
        "schema": {
            "type": "object",
            "properties": {"ism": {"type": "string"},
                           "tur": {"type": "string"},
                           "yosh": {"type": "integer"}},
            "required": ["ism", "tur", "yosh"],
            "additionalProperties": False}}})
```

LangChain'da esa:

```python
strukturali = chat.with_structured_output(Hayvon)      # ⭐ BITTA SATR
natija = strukturali.invoke("Menda 3 yoshli it bor, ismi Bark Twain")
print(natija)          # Hayvon(ism='Bark Twain', tur='it', yosh=3)
```

> ## 🏆🏆 **`with_structured_output` — ENG YAXSHI YECHIM.**
>
> ```
> Parser         →  model MATNNI to'g'ri yozishiga UMID qiladi
> Structured     →  ⭐ provayder SXEMANI KAFOLATLAYDI
> ```
>
> ## ⚠️ **CHEKLOVI:** faqat **qo'llab-quvvatlaydigan** modellarda ishlaydi *(`gpt-4o-mini` va yangiroq, Claude, Gemini)*. Mahalliy kichik modellarda — **yo'q**.
>
> ## 💡 **AMALIY QOIDA:**
> ```
> ① with_structured_output mavjudmi?  →  ⭐ ISHLATING
> ② Yo'qmi?                           →  PydanticOutputParser + qayta urinish
> ③ Juda oddiy vazifa?                →  StrOutputParser + qo'lda tekshiruv
> ```

---

## 7. 🇺🇿 O'zbekcha strukturali chiqish

```python
from pydantic import BaseModel, Field
from typing import Literal

class Murojaat(BaseModel):
    """Bank mijozining murojaati."""
    bolim: Literal["karta", "depozit", "kredit", "boshqa"] = Field(
        description="qaysi bo'limga tegishli")
    shoshilinch: bool = Field(description="shoshilinch murojaatmi")
    xulosa: str = Field(description="murojaatning bir jumlali xulosasi (o'zbekcha)")

pm = PydanticOutputParser(pydantic_object=Murojaat)

r = chat.invoke([
    ("system", "You extract structured data from Uzbek customer messages. "
               f"{pm.get_format_instructions()}"),
    ("human", "Kartam bloklandi, pul yechib ololmayapman, juda shoshilinch!")])
print(pm.invoke(r))
```

> ## ⭐ **`Literal` — ENG FOYDALI TUR.** U **oq ro'yxatni** sxemaga **o'rnatadi**: model boshqa qiymat qaytarsa — **darhol xato**.
>
> ## 🔑 **VA E'TIBOR BERING:** maydon **nomlari** inglizcha/lotincha, **qiymatlari** — o'zbekcha. Bu — 38-moduldagi naqshning **davomi**.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `langchain.output_parsers` bugun bormi?

**M2.** `DatetimeOutputParser` qanday formatni talab qiladi?

**M3.** `PydanticOutputParser` nima qo'shadi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## ❌ **Yo'q.** `langchain_classic.output_parsers` ga ko'chirilgan.

**M2.** ## Aynan `%Y-%m-%dT%H:%M:%S.%fZ`. Hattoki `1905-12-16` **rad etiladi**.

**M3.** ## **Tur va majburiy maydon tekshiruvi** *(validatsiya)*.

</details>

### 🟡 O'rta

**M4.** ⭐ `DatetimeOutputParser` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_classic.output_parsers import DatetimeOutputParser
dp = DatetimeOutputParser()
for s in ["1905-12-16T00:00:00.000000Z", "1905-12-16", "December 16, 1905"]:
    try:
        print(f"{s!r:32s} → {dp.invoke(s)}")
    except Exception as e:
        print(f"{s!r:32s} → ❌ {type(e).__name__}")
```

</details>

**M5.** ⭐⭐ `dateutil` bilan yumshoq parser.

<details>
<summary>✅ Yechim</summary>

```python
from dateutil import parser as dparser
from datetime import date

def sana_ol(matn, min_yil=1000, max_yil=2100):
    d = dparser.parse(matn.strip().strip("`"), fuzzy=True)
    if not (min_yil <= d.year <= max_yil):
        raise ValueError(f"Mantiqsiz yil: {d.year}")
    return d

for s in ["1905-12-16", "Piet Hein was born on December 16, 1905."]:
    print(f"{s[:40]!r:44s} → {sana_ol(s).date()}")
```

## ⚠️ **YIL ORALIG'INI TEKSHIRING** — `fuzzy` tasodifiy raqamni sana deb olishi mumkin.

</details>

**M6.** ⭐⭐ `PydanticOutputParser` yarating.

<details>
<summary>✅ Yechim</summary>

```python
from pydantic import BaseModel, Field
from langchain_core.output_parsers import PydanticOutputParser

class Kitob(BaseModel):
    sarlavha: str = Field(description="kitob nomi")
    muallif: str = Field(description="muallif ismi")
    yil: int = Field(description="nashr yili", ge=1400, le=2100)

kp = PydanticOutputParser(pydantic_object=Kitob)
print(kp.get_format_instructions()[:220])
print(kp.invoke('{"sarlavha": "O\'tkan kunlar", "muallif": "Abdulla Qodiriy", "yil": 1926}'))
```

## ⭐ **`ge` va `le` — QIYMAT ORALIG'I.** Model `yil: 12` yozsa — **xato**.

</details>

**M7.** ⭐ `JsonOutputParser` chegaralarini toping.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.output_parsers import JsonOutputParser
jp = JsonOutputParser()
for s in ['{"a": 1}', '```json\n{"a": 1}\n```', 'Javob: {"a": 1}', '{"a": 1,}']:
    try:
        print(f"{s!r:30s} → {jp.invoke(s)}")
    except Exception as e:
        print(f"{s!r:30s} → ❌ {type(e).__name__}")
```

</details>

### 🔴 Qiyin

**M8.** ⭐⭐ `with_structured_output` ni sinang *(kalit bilan)*.

<details>
<summary>✅ Yechim</summary>

```python
from typing import Literal

class Murojaat(BaseModel):
    bolim: Literal["karta", "depozit", "kredit", "boshqa"]
    shoshilinch: bool
    xulosa: str

s = chat.with_structured_output(Murojaat)
print(s.invoke("Kartam bloklandi, juda shoshilinch!"))
```

## 🏆 **PROMPTGA KO'RSATMA QO'SHISH SHART EMAS** — sxema **API darajasida** uzatiladi.

</details>

**M9.** ⭐⭐ Qayta uriniladigan parser yozing.

<details>
<summary>✅ Yechim</summary>

```python
def parse_qayta_urinish(chat, messages, parser, urinish=3):
    """Parser sinsa — modelga XATONI ko'rsatib qayta so'raydi."""
    oxirgi_xato = None
    for i in range(urinish):
        msgs = list(messages)
        if oxirgi_xato:
            msgs.append(("human",
                         f"Oldingi javobingiz parse qilinmadi.\n"
                         f"XATO: {oxirgi_xato}\n"
                         f"FORMAT: {parser.get_format_instructions()}\n"
                         f"Faqat to'g'ri formatdagi javobni qaytaring."))
        r = chat.invoke(msgs)
        try:
            return {"ok": True, "natija": parser.invoke(r), "urinish": i + 1}
        except Exception as e:
            oxirgi_xato = f"{type(e).__name__}: {str(e)[:120]}"
    return {"ok": False, "sabab": oxirgi_xato, "urinish": urinish}
```

## 🏆 **XATONI MODELGA QAYTARISH — ENG SAMARALI TUZATISH USULI.**

## ⚠️ **CHEGARA QO'YING** — cheksiz sikl **pul yeydi** *(36-modul)*.

</details>

**M10.** ⭐⭐⭐ Parser ishonchliligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

SINOVLAR = [
    ('{"ism": "A", "tur": "it", "yosh": 3}',    True),
    ('```json\n{"ism": "A", "tur": "it", "yosh": 3}\n```', True),
    ('Javob: {"ism": "A", "tur": "it", "yosh": 3}',        True),
    ('{"ism": "A", "tur": "it"}',                          False),
    ('{"ism": "A", "tur": "it", "yosh": "uch"}',           False),
]

def baho(parser, nom):
    q = []
    for kirish, kutilgan_ok in SINOVLAR:
        try:
            parser.invoke(kirish); ok = True
        except Exception:
            ok = False
        q.append({"kirish": kirish[:34], "kutilgan": kutilgan_ok,
                  "olingan": ok, "to'g'ri": ok == kutilgan_ok})
    d = pd.DataFrame(q)
    print(f"\n{nom}:  {int(d['to\'g\'ri'].sum())}/{len(d)}" if False
          else f"\n{nom}:")
    print(d.to_string(index=False))
    return d

baho(pp, "PydanticOutputParser")
baho(jp, "JsonOutputParser")
```

## ⚠️ **DIQQAT:** ustun nomida **apostrof** ishlatmang — `togri` deb nomlang *(38-modulda ko'rgan tuzoq)*.

</details>

---

## 📌 Xulosa

```
❌ langchain.output_parsers.DatetimeOutputParser   →  MODUL YO'Q
✅ langchain_classic.output_parsers                →  arxiv
⭐ PydanticOutputParser                            →  tur + majburiy maydon
🏆 chat.with_structured_output(Model)              →  ENG ISHONCHLI
```

| Parser | Kuchli | Zaif |
|---|---|---|
| `StrOutputParser` | doim ishlaydi | metadata **yo'qoladi** |
| `CommaSeparatedList...` | sodda | ## 💥 **jim noto'g'ri natija** |
| `DatetimeOutputParser` | ✅ xato beradi | ## 💥 **juda qattiq** |
| `JsonOutputParser` | ``` ```json ``` ``` tozalaydi | muqaddima → xato |
| ## `PydanticOutputParser` | ## **tur tekshiruvi** | model **format buzishi** mumkin |
| ## `with_structured_output` | ## ✅ **kafolat** | faqat yangi modellarda |

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Format ko'rsatmasi | Format instructions | Parserning **modelga** aytgani |
| Validatsiya | Validation | Tur va qiymatni **tekshirish** |
| Strukturali chiqish | Structured output | Sxemani **kafolatlash** |
| `Literal` | Literal type | **Oq ro'yxatni** turga o'rnatish |
| Fuzzy parse | Fuzzy parsing | Jumla **ichidan** topish |

---

⬅️ [2-dars. Ro'yxat parseri](02-Comma-Separated-List-Output-Parser.md) · 🏠 [Modul boshiga](README.md) · ➡️ [41-modul. LCEL](../41-LangChain-LCEL/README.md)
