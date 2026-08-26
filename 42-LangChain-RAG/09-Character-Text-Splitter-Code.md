# 9-dars. CharacterTextSplitter — kod ⭐⭐

## 🎬 Boshlashdan oldin

> **"Uni kodda amalga oshirish vaqti keldi."**

---

## 1. Kod va HAQIQIY natija

```python
from langchain_community.document_loaders import Docx2txtLoader
from langchain_text_splitters.character import CharacterTextSplitter

pages = Docx2txtLoader("Introduction_to_Data_and_Data_Science.docx").load()
for i in range(len(pages)):
    pages[i].page_content = " ".join(pages[i].page_content.split())

print("asl uzunlik:", len(pages[0].page_content))

char_splitter = CharacterTextSplitter(separator=".", chunk_size=500,
                                      chunk_overlap=50)
pages_char_split = char_splitter.split_documents(pages)
print("bo'laklar:", len(pages_char_split))
```

```
asl uzunlik: 8259
bo'laklar  : 21
```

---

## 2. 🔬 Kurs hisobini TEKSHIRAMIZ

Kurs `8259 / 500 = 16.5` deb hisoblaydi va `0.518 × 500` ni ko'rsatadi. Lekin **haqiqiy natija — 21 ta bo'lak**.

```python
import numpy as np
uz = [len(d.page_content) for d in pages_char_split]
print(f"uzunliklar: min {min(uz)}  max {max(uz)}  o'rtacha {np.mean(uz):.0f}")
print(f"500 dan OSHGANLAR: {sum(1 for x in uz if x > 500)} ta  (eng katta {max(uz)})")
```

```
uzunliklar: min 184  max 499  o'rtacha 400
500 dan OSHGANLAR: 0 ta  (eng katta 499)
```

> ## 💥 **NIMA UCHUN 16.5 EMAS, 21?**
>
> ```
> ① chunk_overlap = 50   →  har bo'lak 50 belgi TAKRORLAYDI
>                          →  effektiv qadam 450, 500 emas
> ② separator = "."      →  bo'linish faqat NUQTADA
>                          →  bo'laklar 500 GA YETMASDAN tugaydi
> ```
>
> ## ✅ **VA SHUNING UCHUN O'RTACHA 400, 500 EMAS.**
>
> ## 🔑 **`chunk_size` — MAKSIMUM, MAQSAD EMAS.** Bu — ko'p odam adashadigan joy.

```
8259 belgi  →  21 bo'lak  →  o'rtacha 400 belgi (500 emas)
```

---

## 3. ⭐ Bo'laklarni KO'ZINGIZ bilan ko'ring

```python
print("1-bo'lak:", repr(pages_char_split[0].page_content[:120]))
```

```
'Analysis vs Analytics Alright! So… Let's discuss the not-so-obvious differences between the terms analysis and analytics'
```

> ## ⚠️ **E'TIBOR BERING — OXIRIDA NUQTA YO'Q.**
>
> `separator="."` bo'lakni nuqtada **kesadi** va nuqtaning **o'zini tashlab yuboradi**. Bu — normal, lekin **kutilmagan** bo'lishi mumkin.

```python
import pandas as pd
d = pd.DataFrame([{"n": i, "belgi": len(x.page_content),
                   "boshi": x.page_content[:44],
                   "oxiri": x.page_content[-30:]}
                  for i, x in enumerate(pages_char_split[:8])])
print(d.to_string(index=False))
```

> ## 🏆 **HAR YANGI HUJJATDA SHU JADVALNI CHIQARING.** Bo'laklar **mantiqiy** joyda bo'linayotganini **ko'zingiz bilan** tekshiring.

---

## 4. ⭐⭐ `RecursiveCharacterTextSplitter` — kursda YO'Q

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

rc = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
split_r = rc.split_documents(pages_md_split)

uz3 = [len(d.page_content) for d in split_r]
print(f"bo'laklar: {len(split_r)}  min {min(uz3)} max {max(uz3)} "
      f"o'rtacha {np.mean(uz3):.0f}")
print(f"500 dan OSHGANLAR: {sum(1 for x in uz3 if x > 500)} ta")
```

Ikkalasini **solishtiramiz** *(bir xil kirishda)*:

```
CharacterTextSplitter    : 20 bo'lak   min 184  max 493  o'rtacha 406
RecursiveCharacterSplitter: 19 bo'lak   min  95  max 500  o'rtacha 470
```

> ## ✅ **`Recursive` — O'RTACHA UZUNLIK `chunk_size` GA YAQINROQ** *(470 vs 406)*.
>
> Ya'ni u **`chunk_size` ni to'liqroq ishlatadi** — kamroq bo'lak, kamroq qidiruv.

> ## 🔑 **QANDAY ISHLAYDI — KETMA-KET AJRATUVCHILAR:**
> ```python
> RecursiveCharacterTextSplitter(
>     separators=["\n\n", "\n", ". ", " ", ""],     # ⭐ standart
>     chunk_size=500, chunk_overlap=50)
> ```
> ```
> ① "\n\n" bilan bo'l  →  bo'lak hali kattami?
> ② "\n"   bilan bo'l  →  hali kattami?
> ③ ". "   bilan bo'l  →  hali kattami?
> ④ " "    bilan bo'l  →  hali kattami?
> ⑤ ""     — belgi bo'yicha  →  ⭐ KAFOLATLANGAN sig'adi
> ```
>
> ## 🏆 **NATIJA: `chunk_size` HECH QACHON OSHMAYDI** *(bizda max = 500, aynan chegara)*.

> ## 🇺🇿 **VA O'ZBEKCHA UCHUN — QISQARTMALAR MUAMMOSI KAMAYADI**, chunki `Recursive` avval **paragraf** va **qatorni** sinaydi, nuqtani esa **oxirida**.

---

## 5. ⭐ Token bo'yicha bo'laklash

Belgilar **taxminiy**. Aniqroq usul — **token** bo'yicha:

```python
splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    encoding_name="o200k_base",
    chunk_size=200,          # ⭐ endi bu TOKEN
    chunk_overlap=20)
```

> ## 🏆 **🇺🇿 O'ZBEKCHA UCHUN BU ANIQROQ** — 36-modulda ko'rgan **1.88× ustama** endi **avtomatik** hisobga olinadi.
>
> ## 💡 **`chunk_size=200` token ≈ 400–500 inglizcha belgi ≈ 250–300 o'zbekcha belgi.**

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** 8259 belgi 500 lik bo'laklarga bo'linsa — nechta bo'lak?

**M2.** Nima uchun o'rtacha uzunlik 400, 500 emas?

**M3.** `chunk_size` — maksimum yoki maqsad?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **21 ta** *(hisobda 16.5)* — `overlap` va `separator` tufayli.

**M2.** `separator="."` bo'laklarni **nuqtada** kesadi — ular 500 ga **yetmasdan** tugaydi.

**M3.** ## **MAKSIMUM.** Bo'laklar undan **kichik** bo'lishi normal.

</details>

### 🟡 O'rta

**M4.** ⭐ Bo'laklar statistikasini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd

def bolak_statistika(bolaklar, chunk_size):
    uz = [len(d.page_content) for d in bolaklar]
    print(f"bo'laklar : {len(bolaklar)}")
    print(f"uzunliklar: min {min(uz)}  max {max(uz)}  "
          f"o'rtacha {np.mean(uz):.0f}  median {np.median(uz):.0f}")
    osh = sum(1 for x in uz if x > chunk_size)
    print(f"chunk_size dan oshganlar: {osh} ta")
    print(f"to'ldirish darajasi: {np.mean(uz)/chunk_size:.0%}")
    if np.mean(uz) / chunk_size < 0.7:
        print("⚠️ bo'laklar JUDA KICHIK — separator ni o'zgartiring "
              "yoki RecursiveCharacterTextSplitter ishlating")
    return uz

bolak_statistika(pages_char_split, 500)
```

## 🏆 **`to'ldirish darajasi` — SAMARADORLIK O'LCHOVI.** 70% dan past bo'lsa — sozlamani **o'zgartiring**.

</details>

**M5.** ⭐⭐ Ikki splitterni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_text_splitters import (CharacterTextSplitter,
                                      RecursiveCharacterTextSplitter)

SPLITTERLAR = {
    'Character(".")':   CharacterTextSplitter(separator=".", chunk_size=500,
                                              chunk_overlap=50),
    'Character("\\n\\n")': CharacterTextSplitter(separator="\n\n", chunk_size=500,
                                                 chunk_overlap=50),
    "Recursive":        RecursiveCharacterTextSplitter(chunk_size=500,
                                                       chunk_overlap=50),
}
q = []
for nom, s in SPLITTERLAR.items():
    b = s.split_documents(pages)
    uz = [len(x.page_content) for x in b]
    q.append({"splitter": nom, "bo'laklar": len(b), "min": min(uz),
              "max": max(uz), "o'rtacha": round(np.mean(uz)),
              "oshgan": sum(1 for x in uz if x > 500),
              "to'ldirish": f"{np.mean(uz)/500:.0%}"})
print(pd.DataFrame(q).to_string(index=False))
```

## 🔑 **`oshgan` USTUNI 0 BO'LISHI KERAK.** Aks holda kontekst oynasi **buzilishi** mumkin.

</details>

**M6.** ⭐ Token bo'yicha bo'laklashni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

s = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    encoding_name="o200k_base", chunk_size=150, chunk_overlap=20)
b = s.split_documents(pages)
tok = [len(enc.encode(x.page_content)) for x in b]
print(f"bo'laklar {len(b)}   tokenlar: min {min(tok)} max {max(tok)} "
      f"o'rtacha {np.mean(tok):.0f}")
print(f"150 dan oshganlar: {sum(1 for x in tok if x > 150)}")
```

## 🏆 **🇺🇿 O'ZBEKCHA UCHUN — ANIQROQ.** `1.88×` ustama **avtomatik** hisobga olinadi.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Bo'lak sifatini baholang.

<details>
<summary>✅ Yechim</summary>

```python
import re

def bolak_sifati(bolaklar):
    """Bo'laklar MANTIQIY joyda bo'lingannmi?"""
    q = []
    for i, d in enumerate(bolaklar):
        t = d.page_content.strip()
        q.append({
            "n": i, "belgi": len(t),
            "jumla_ortasida": t[-1:] not in ".!?»\"'",
            "kichik_harfdan": bool(t) and t[0].islower(),
            "juda_qisqa": len(t) < 100,
        })
    d = pd.DataFrame(q)
    print(f"jumla o'rtasida tugagan : {int(d.jumla_ortasida.sum())}/{len(d)}")
    print(f"kichik harfdan boshlangan: {int(d.kichik_harfdan.sum())}/{len(d)}")
    print(f"juda qisqa (<100)        : {int(d.juda_qisqa.sum())}/{len(d)}")
    return d
```

## ⚠️ **USTUN NOMIDA APOSTROF ISHLATMANG** — `jumla_ortasida` deb nomlang *(38-moduldagi tuzoq)*.

## 🔑 **YUQORI ko'rsatkichlar — bo'laklash SIFATSIZ degani.**

</details>

**M8.** ⭐⭐⭐ Optimal `chunk_size` ni toping.

<details>
<summary>✅ Yechim</summary>

```python
def optimal_chunk(pages, olchamlar=(200, 300, 500, 800, 1200),
                  overlap_ulush=0.1):
    q = []
    for cs in olchamlar:
        s = RecursiveCharacterTextSplitter(
            chunk_size=cs, chunk_overlap=int(cs * overlap_ulush))
        b = s.split_documents(pages)
        uz = [len(x.page_content) for x in b]
        q.append({"chunk_size": cs, "bo'laklar": len(b),
                  "o'rtacha": round(np.mean(uz)),
                  "to'ldirish": round(np.mean(uz) / cs, 2),
                  "juda_qisqa": sum(1 for x in uz if x < cs * 0.3)})
    d = pd.DataFrame(q)
    print(d.to_string(index=False))
    print("\n💡 'to'ldirish' 0.8+ va 'juda_qisqa' 0 bo'lgan qatorni tanlang.")
    print("⚠️ LEKIN YAKUNIY QARORNI QIDIRUV SIFATI bilan o'lchang "
          "(LOYIHALAR.md, 2-loyiha).")
    return d

optimal_chunk(pages)
```

## 🏆 **STATISTIKA — BOSHLANG'ICH NUQTA.** Haqiqiy mezon — **qidiruv aniqligi**.

</details>

---

## 📌 Xulosa

```
CharacterTextSplitter(separator=".", chunk_size=500, chunk_overlap=50)
→ 8259 belgi → 21 bo'lak (16.5 EMAS!) · o'rtacha 400 · max 499

⭐ RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
→ 19 bo'lak · o'rtacha 470 · max 500  ← chunk_size ni TO'LIQROQ ishlatadi
```

| | `Character` | ## `Recursive` |
|---|---|---|
| Ajratuvchi | **bitta** | ## **ketma-ket ro'yxat** |
| `chunk_size` oshadimi | ⚠️ **ha** | ## ✅ **yo'q** |
| To'ldirish | 81% | ## **94%** |
| 🇺🇿 Qisqartmalar | ⚠️ tuzoq | ## ✅ **kamroq** |

> ## 🏆 **TAVSIYA: `RecursiveCharacterTextSplitter`** — yoki **token** bo'yicha `from_tiktoken_encoder`.

---

⬅️ [8-dars. Nazariya](08-Character-Text-Splitter-Theory.md) · 🏠 [Modul boshiga](README.md) · ➡️ [10-dars. MarkdownHeaderTextSplitter](10-Markdown-Header-Text-Splitter.md)
