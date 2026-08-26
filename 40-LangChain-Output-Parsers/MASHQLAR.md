# 📝 40-modul mashqlari

> **26 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **KO'PCHILIGI API KALITISIZ** — parserlar **matn** bilan ishlaydi, model bilan emas.

## ⚙️ Tayyorgarlik

```bash
pip install langchain langchain-core langchain-classic python-dotenv
pip install pydantic python-dateutil pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import re, importlib, pandas as pd
from datetime import date
from pydantic import BaseModel, Field
from typing import Literal

from langchain_core.messages import AIMessage
from langchain_core.output_parsers import (StrOutputParser,
                                           CommaSeparatedListOutputParser,
                                           NumberedListOutputParser,
                                           MarkdownListOutputParser,
                                           JsonOutputParser,
                                           PydanticOutputParser)

sp = StrOutputParser()
lp = CommaSeparatedListOutputParser()
np_ = NumberedListOutputParser()
jp = JsonOutputParser()
```

---

# 🟢 OSON *(1–9)*

**M1.** `StrOutputParser` nima qaytaradi?

**M2.** Parser modelga qanday ko'rsatma beradi?

**M3.** `langchain.output_parsers` bugun bormi?

**M4.** `CommaSeparatedListOutputParser` nima qiladi?

**M5.** U xato beradimi?

<details>
<summary>✅ Javoblar M1–M5</summary>

**M1.** ## **`str`** — `AIMessage.content`.

**M2.** ## `get_format_instructions()` — uni **promptga qo'shasiz**.

**M3.** ## ❌ **Yo'q** — `langchain_classic.output_parsers` ga ko'chirilgan.

**M4.** ## **Faqat vergul bo'yicha bo'ladi.**

**M5.** ## ❌ **Yo'q** — **jim** noto'g'ri natija qaytaradi.

</details>

**M6.** `DatetimeOutputParser` qanday formatni talab qiladi?

**M7.** `PydanticOutputParser` nima qo'shadi?

**M8.** `with_structured_output` parserdan nimasi bilan yaxshi?

**M9.** `StrOutputParser` nimani yo'qotadi?

<details>
<summary>✅ Javoblar M6–M9</summary>

**M6.** Aynan `%Y-%m-%dT%H:%M:%S.%fZ`. Hattoki `1905-12-16` **rad etiladi**.

**M7.** ## **Tur va majburiy maydon validatsiyasi**.

**M8.** ## **Provayder sxemani KAFOLATLAYDI** — model format buza **olmaydi**.

**M9.** ## `response_metadata` *(`finish_reason`)* va `usage_metadata` *(narx)*.

</details>

---

# 🟡 O'RTA *(10–20)*

**M10.** ⭐ `StrOutputParser` ni turli kirishlarda sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.messages import HumanMessage
for x in [AIMessage(content="AI javobi"),
          HumanMessage(content="inson xabari"), "oddiy satr"]:
    print(f"{type(x).__name__:14s} → {sp.invoke(x)!r}")
```

</details>

**M11.** ⭐⭐ Ro'yxat parserini beshta kirishda sinang.

<details>
<summary>✅ Yechim</summary>

```python
for s in ["Bark Twain, Sir Waggington, Chewbarka",
          "Bark Twain,Sir Waggington,Chewbarka",
          "1. Bark Twain\n2. Sir Waggington",
          "Here are some names: Bark Twain, Sir Waggington.",
          "Bark Twain, Sir Waggington, and Chewbarka"]:
    print(f"{s[:44]!r:48s} → {lp.invoke(s)}")
```

## 💥 **Faqat birinchi ikkitasi to'g'ri.** Va parser **xato bermaydi**.

</details>

**M12.** ⭐ Format ko'rsatmalarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
for nom, p in [("Comma", lp), ("Numbered", np_),
               ("Markdown", MarkdownListOutputParser()), ("Json", jp)]:
    print(f"--- {nom} ---")
    print(p.get_format_instructions()[:160], "\n")
```

</details>

**M13.** ⭐ `NumberedListOutputParser` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
print(np_.invoke("1. Bark Twain\n2. Sir Waggington\n3. Chewbarka"))
print(np_.invoke("a, b, c"))                # ⚠️ nima bo'ladi?
```

## 💡 **LLM'lar TABIIY ravishda raqamli ro'yxat yozadi** — ularni vergulga majburlashdan ko'ra **tabiiy** formatini parse qiling.

</details>

**M14.** ⭐⭐ Tozalovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
RUXSATSIZ = {"and", "va", "or", "yoki", ""}

def tozala(elementlar, max_uzunlik=40):
    toza = []
    for x in elementlar:
        x = re.sub(r"^\s*\d+[\.\)]\s*", "", x).strip(" .\n")
        x = re.sub(r"^(and|va|or|yoki)\s+", "", x, flags=re.I).strip()
        if x.lower() not in RUXSATSIZ and len(x) <= max_uzunlik:
            toza.append(x)
    return toza

print(tozala(lp.invoke("Bark Twain, Sir Waggington, and Chewbarka")))
print(tozala(lp.invoke("1. Bark\n2. Sir")))
```

</details>

**M15.** ⭐ `DatetimeOutputParser` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_classic.output_parsers import DatetimeOutputParser
dp = DatetimeOutputParser()
print(dp.get_format_instructions())
for s in ["1905-12-16T00:00:00.000000Z", "1905-12-16", "December 16, 1905"]:
    try:
        print(f"{s!r:32s} → {dp.invoke(s)}")
    except Exception as e:
        print(f"{s!r:32s} → ❌ {type(e).__name__}")
```

</details>

**M16.** ⭐⭐ `dateutil` bilan yumshoq sana parseri.

<details>
<summary>✅ Yechim</summary>

```python
from dateutil import parser as dparser

def sana_ol(matn, min_yil=1000, max_yil=2100):
    d = dparser.parse(matn.strip().strip("`"), fuzzy=True)
    if not (min_yil <= d.year <= max_yil):
        raise ValueError(f"Mantiqsiz yil: {d.year}")
    return d

for s in ["1905-12-16", "December 16, 1905",
          "Piet Hein was born on December 16, 1905."]:
    print(f"{s[:40]!r:44s} → {sana_ol(s).date()}")
```

## ⚠️ **YIL ORALIG'INI TEKSHIRING** — `fuzzy` tasodifiy raqamni sana deb olishi mumkin.

</details>

**M17.** ⭐ `JsonOutputParser` chegaralarini toping.

<details>
<summary>✅ Yechim</summary>

```python
for s in ['{"a": 1}', '```json\n{"a": 1}\n```',
          'Javob: {"a": 1}', '{"a": 1,}']:
    try:
        print(f"{s!r:30s} → {jp.invoke(s)}")
    except Exception as e:
        print(f"{s!r:30s} → ❌ {type(e).__name__}")
```

## ⭐ **``` ```json ``` ``` fence AVTOMATIK tozalanadi.**

</details>

**M18.** ⭐⭐ `PydanticOutputParser` yarating.

<details>
<summary>✅ Yechim</summary>

```python
class Kitob(BaseModel):
    sarlavha: str = Field(description="kitob nomi")
    muallif: str = Field(description="muallif ismi")
    yil: int = Field(description="nashr yili", ge=1400, le=2100)

kp = PydanticOutputParser(pydantic_object=Kitob)
print(kp.get_format_instructions()[:220])
print(kp.invoke('{"sarlavha": "O\'tkan kunlar", '
                '"muallif": "Abdulla Qodiriy", "yil": 1926}'))

for bad in ['{"sarlavha": "X", "muallif": "Y"}',          # yil yo'q
            '{"sarlavha": "X", "muallif": "Y", "yil": 12}']:  # oraliqdan tashqari
    try:
        kp.invoke(bad)
    except Exception as e:
        print("❌", type(e).__name__)
```

## ⭐ **`ge` va `le` — QIYMAT ORALIG'I.**

</details>

**M19.** ⭐ `Literal` bilan oq ro'yxat.

<details>
<summary>✅ Yechim</summary>

```python
class Murojaat(BaseModel):
    bolim: Literal["karta", "depozit", "kredit", "boshqa"]
    shoshilinch: bool

mp = PydanticOutputParser(pydantic_object=Murojaat)
print(mp.invoke('{"bolim": "karta", "shoshilinch": true}'))
try:
    mp.invoke('{"bolim": "ipoteka", "shoshilinch": true}')
except Exception as e:
    print("❌", type(e).__name__, "— 'ipoteka' ro'yxatda yo'q")
```

## 🏆 **`Literal` — OQ RO'YXATNI SXEMAGA O'RNATADI.**

</details>

**M20.** ⭐ Mavjud parserlarni ro'yxatlang.

<details>
<summary>✅ Yechim</summary>

```python
import langchain_core.output_parsers as O
print([x for x in dir(O) if x.endswith("Parser")])
```

</details>

---

# 🔴 QIYIN *(21–26)*

**M21.** ⭐⭐ Ishonchli ro'yxat oluvchi.

<details>
<summary>✅ Yechim</summary>

```python
def ishonchli_royxat(chat, savol, n=3, urinish=2):
    KO_RSATMA = (f"Reply with EXACTLY {n} items, separated by ' | '. "
                 f"No numbering, no preamble, no explanation.")
    el = []
    for i in range(urinish):
        r = chat.invoke([("system", KO_RSATMA), ("human", savol)])
        el = [x.strip() for x in r.content.split("|") if x.strip()]
        if len(el) == n:
            return {"ok": True, "royxat": el, "urinish": i + 1}
    return {"ok": False, "royxat": el,
            "sabab": f"{n} ta kutilgan, {len(el)} olindi"}
```

## 🏆 **`' | '` — VERGULDAN XAVFSIZROQ**, chunki vergul **jumla ichida** bo'lishi mumkin *(ayniqsa o'zbekchada)*.

</details>

**M22.** ⭐⭐ Qayta uriniladigan parser.

<details>
<summary>✅ Yechim</summary>

```python
def parse_qayta(chat, messages, parser, urinish=3):
    oxirgi = None
    for i in range(urinish):
        msgs = list(messages)
        if oxirgi:
            msgs.append(("human",
                         f"Oldingi javobingiz parse qilinmadi.\nXATO: {oxirgi}\n"
                         f"FORMAT: {parser.get_format_instructions()}\n"
                         f"Faqat to'g'ri formatdagi javobni qaytaring."))
        r = chat.invoke(msgs)
        try:
            return {"ok": True, "natija": parser.invoke(r), "urinish": i + 1}
        except Exception as e:
            oxirgi = f"{type(e).__name__}: {str(e)[:120]}"
    return {"ok": False, "sabab": oxirgi}
```

## ⚠️ **CHEGARA QO'YING** — cheksiz sikl **pul yeydi**.

</details>

**M23.** ⭐⭐ Parser ishonchliligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
SINOVLAR = [("a, b, c", ["a", "b", "c"]),
            ("a,b,c", ["a", "b", "c"]),
            ("1. a\n2. b\n3. c", ["a", "b", "c"]),
            ("Here are: a, b, c.", ["a", "b", "c"]),
            ("a, b, and c", ["a", "b", "c"])]

def baho(fn, nom):
    tog = 0
    for kirish, kutilgan in SINOVLAR:
        try:
            tog += (fn(kirish) == kutilgan)
        except Exception:
            pass
    print(f"{nom:34s} {tog}/{len(SINOVLAR)}")

baho(lambda s: lp.invoke(s), "CommaSeparatedList")
baho(lambda s: tozala(lp.invoke(s)), "+ tozalovchi")
baho(lambda s: np_.invoke(s), "NumberedList")
```

</details>

**M24.** ⭐⭐ `with_structured_output` ni sinang *(kalit bilan)*.

<details>
<summary>✅ Yechim</summary>

```python
s = chat.with_structured_output(Murojaat)
print(s.invoke("Kartam bloklandi, juda shoshilinch!"))
```

## 🏆 **PROMPTGA KO'RSATMA QO'SHISH SHART EMAS.**

</details>

**M25.** ⭐⭐⭐ Universal xavfsiz parser sinfi.

<details>
<summary>✅ Yechim</summary>

```python
class XavfsizParser:
    """Har qanday parserni himoya qatlami bilan o'raydi."""

    def __init__(self, parser, tekshiruv=None, tozalovchi=None,
                 urinish=2, nom=""):
        self.p, self.tekshir = parser, tekshiruv
        self.tozala, self.urinish, self.nom = tozalovchi, urinish, nom
        self.statistika = {"jami": 0, "muvaffaqiyat": 0,
                           "tozalandi": 0, "xato": 0}

    def invoke(self, kirish):
        self.statistika["jami"] += 1
        try:
            n = self.p.invoke(kirish)
        except Exception as e:
            self.statistika["xato"] += 1
            return {"ok": False, "sabab": f"{type(e).__name__}: {str(e)[:100]}"}

        if self.tozala:
            asl = n
            n = self.tozala(n)
            if n != asl:
                self.statistika["tozalandi"] += 1

        if self.tekshir and not self.tekshir(n):
            self.statistika["xato"] += 1
            return {"ok": False, "sabab": "tekshiruvdan o'tmadi",
                    "xom": n}

        self.statistika["muvaffaqiyat"] += 1
        return {"ok": True, "natija": n}

    def hisobot(self):
        s = self.statistika
        if not s["jami"]:
            return
        print(f"{self.nom}: {s['muvaffaqiyat']}/{s['jami']} "
              f"({s['muvaffaqiyat']/s['jami']:.0%})  "
              f"tozalandi {s['tozalandi']}  xato {s['xato']}")

xp = XavfsizParser(lp, tekshiruv=lambda x: len(x) == 3,
                   tozalovchi=tozala, nom="ro'yxat(3)")
for s in ["a, b, c", "a, b, and c", "1. a\n2. b\n3. c", "faqat bitta"]:
    print(f"{s[:26]!r:30s} → {xp.invoke(s)}")
xp.hisobot()
```

## 🏆 **`hisobot()` — ISHLAB CHIQARISHDA MAJBURIY.** U parser **qanchalik tez-tez** sinayotganini ko'rsatadi.

</details>

**M26.** ⭐⭐⭐ O'zbekcha strukturali ekstraktor.

<details>
<summary>✅ Yechim</summary>

```python
class UzMurojaat(BaseModel):
    """Bank mijozining murojaati."""
    bolim: Literal["karta", "depozit", "kredit", "boshqa"] = Field(
        description="qaysi bo'limga tegishli")
    shoshilinch: bool = Field(description="shoshilinch murojaatmi")
    kayfiyat: Literal["ijobiy", "neytral", "salbiy"] = Field(
        description="mijozning kayfiyati")
    xulosa: str = Field(description="murojaatning bir jumlali xulosasi, o'zbekcha",
                        max_length=120)

up = PydanticOutputParser(pydantic_object=UzMurojaat)

MUROJAATLAR = [
    "Kartam bloklandi, pul yechib ololmayapman, juda shoshilinch!",
    "Depozit foizlari haqida ma'lumot bering, iltimos.",
    "Kredit to'lovim kechikdi, jarima solindimi?",
]
for m in MUROJAATLAR:
    r = chat.invoke([("system", "You extract structured data from Uzbek "
                                "customer messages.\n"
                                + up.get_format_instructions()),
                     ("human", m)])
    try:
        print(f"✅ {m[:36]:38s} → {up.invoke(r)}")
    except Exception as e:
        print(f"❌ {m[:36]:38s} → {type(e).__name__}")
```

## 🔑 **UCHTA `Literal` — UCHTA OQ RO'YXAT.** Model **boshqa** qiymat qaytara **olmaydi**.

## 💡 **`max_length=120`** — xulosa **uzun bo'lib ketmasin**.

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
