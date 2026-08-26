# 5-dars. Zanjirlarni ulash va `RunnablePassthrough` ⭐⭐

## 🎬 Boshlashdan oldin

> **"`RunnablePassthrough().invoke([1, 2, 3])`"**

---

## 1. `RunnablePassthrough` — "hech nima qilmaydigan" Runnable

```python
from langchain_core.runnables import RunnablePassthrough

print(RunnablePassthrough().invoke([1, 2, 3]))      # [1, 2, 3]
print(RunnablePassthrough().invoke({"a": 1}))       # {'a': 1}
```

> ## 🤔 **"HECH NIMA QILMAYDIGAN NARSA NIMAGA KERAK?"**
>
> ## 🔑 **JAVOB: TURNI O'ZGARTIRISH UCHUN.**
> ```
> Zanjir chiqishi:  str          ("1. Python\n2. SQL\n...")
> Keyingi shablon:  {tools}      →  dict kutadi!
>
> {"tools": RunnablePassthrough()}   →  str ni {"tools": str} ga o'raydi  ⭐
> ```

---

## 2. Kursning misoli — ikkita zanjirni ulash

```python
chat_template_tools = ChatPromptTemplate.from_template("""
What are the five most important tools a {job title} needs?
Answer only by listing the tools.
""")

chat_template_strategy = ChatPromptTemplate.from_template("""
Considering the tools provided, develop a strategy for effectively
learning and mastering them:
{tools}
""")

chain_tools = (chat_template_tools | chat | string_parser
               | {"tools": RunnablePassthrough()})       # ⭐ str → dict
chain_strategy = chat_template_strategy | chat | string_parser

chain_combined = chain_tools | chain_strategy
print(chain_combined.invoke({"job title": "data scientist"}))
```

```
{"job title": "data scientist"}
        ↓  chat_template_tools
ChatPromptValue
        ↓  chat
AIMessage
        ↓  string_parser
"1. Python\n2. R\n3. SQL\n4. Tableau\n5. Hadoop"        ← str
        ↓  {"tools": RunnablePassthrough()}
{"tools": "1. Python\n2. R\n..."}                        ← dict  ⭐
        ↓  chat_template_strategy
ChatPromptValue
        ↓  chat  →  string_parser
"strategiya matni"
```

---

## 3. ⭐ Lug'at AVTOMATIK `RunnableParallel` ga aylanadi

Kurs buni **eslatib o'tadi**, biz **isbotlaymiz**:

```python
z = ({"yigindi": RunnableLambda(lambda x: sum(x)),
      "max": RunnableLambda(lambda x: max(x))}
     | RunnableLambda(lambda d: d["yigindi"] * d["max"]))

print("turi:", type(z).__name__)
print(z.invoke([1, 2, 5]))
```

```
turi: RunnableSequence
40
```

> ## 🔑 **`{"a": runnable, "b": runnable}` — `RunnableParallel` GA AVTOMATIK AYLANADI.**
>
> `8 × 5 = 40` — ikkala funksiya **parallel** ishladi va natijalar **lug'atga** yig'ildi.

---

## 4. ⭐⭐ `RunnablePassthrough.assign` — eng foydali variant

```python
r = RunnablePassthrough.assign(
        birinchi=lambda x: list(x["input"])[0],
        ikkinchi=lambda x: list(x["input"])[1]).invoke({"input": "hi"})
print(r)
```

```
{'input': 'hi', 'birinchi': 'h', 'ikkinchi': 'i'}
```

> ## 🏆 **`assign` — ESKI KALITLARNI SAQLAB, YANGISINI QO'SHADI.**
>
> ```
> {"tools": RunnablePassthrough()}   →  faqat "tools" qoladi, qolgani YO'QOLADI
> RunnablePassthrough.assign(...)    →  ⭐ hammasi QOLADI + yangisi qo'shiladi
> ```
>
> ## 💡 **AMALDA `assign` ANCHA KO'P ISHLATILADI** — chunki zanjirning keyingi qadamiga **bir necha qiymat** kerak bo'ladi.

### Amaliy misol — RAG naqshi

```python
from operator import itemgetter

rag_zanjir = (
    RunnablePassthrough.assign(
        kontekst=lambda x: retriever.invoke(x["savol"]))     # ⭐ savol QOLADI
    | prompt                                                  # {savol} va {kontekst}
    | chat
    | StrOutputParser())
```

> ## 🔑 **`{"kontekst": ...}` BO'LGANIDA `savol` YO'QOLARDI.** `assign` uni **saqlab qoladi** — va prompt **ikkalasini ham** ishlatadi.
>
> ## ⭐ **42-MODULDA (RAG) AYNAN SHU NAQSHNI ISHLATAMIZ.**

---

## 5. ⭐ `itemgetter` — lug'atdan qiymat olish

```python
from operator import itemgetter

z = ({"n": itemgetter("son"), "m": itemgetter("matn")}
     | RunnableLambda(lambda d: f"{d['m']} × {d['n']}"))

print(z.invoke({"son": 3, "matn": "salom"}))
```

```
salom × 3
```

> ## 💡 **`itemgetter("x")` — `lambda d: d["x"]` NING QISQA SHAKLI.** LangChain hujjatlarida **juda ko'p** uchraydi.

---

## 6. ⚠️ Uzun zanjir — o'qilishi qiyin

```python
chain_long = (chat_template_tools | chat | string_parser
              | {"tools": RunnablePassthrough()}
              | chat_template_strategy | chat | string_parser)
```

> ## ⚠️ **BU KOD ISHLAYDI, LEKIN O'QILISHI QIYIN.**
>
> ## ✅ **YAXSHIROQ — NOMLANGAN QISMLARGA BO'LING:**
> ```python
> vositalar_zanjiri = chat_template_tools | chat | string_parser
> strategiya_zanjiri = chat_template_strategy | chat | string_parser
>
> toliq = (vositalar_zanjiri
>          | {"tools": RunnablePassthrough()}
>          | strategiya_zanjiri)
> ```
> **Natija bir xil, o'qilishi ancha yaxshi** — va har qismni **alohida sinash** mumkin.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `RunnablePassthrough` nima qiladi?

**M2.** U nima uchun kerak?

**M3.** `assign` dan farqi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Kirishni o'zgarishsiz** qaytaradi.

**M2.** ## **Turni o'zgartirish** uchun: `str` → `{"tools": str}`.

**M3.** ## `assign` — **eski kalitlarni saqlaydi** va yangisini qo'shadi.

</details>

### 🟡 O'rta

**M4.** ⭐ Lug'at `RunnableParallel` ga aylanishini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
z = ({"yigindi": RunnableLambda(sum),
      "uzunlik": RunnableLambda(len),
      "max": RunnableLambda(max)}
     | RunnableLambda(lambda d: d))
print(type(z).__name__)
print(z.invoke([1, 2, 5]))
```

</details>

**M5.** ⭐⭐ `assign` va `{"x": Passthrough()}` ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
kirish = {"savol": "Depozit nima?", "til": "uz"}

a = ({"kontekst": RunnableLambda(lambda d: "hujjat matni")}
     | RunnableLambda(lambda d: d))
b = RunnablePassthrough.assign(kontekst=lambda d: "hujjat matni")

print("lug'at :", a.invoke(kirish))
print("assign :", b.invoke(kirish))
```

```
lug'at : {'kontekst': 'hujjat matni'}                      ← savol YO'QOLDI 💥
assign : {'savol': 'Depozit nima?', 'til': 'uz', 'kontekst': 'hujjat matni'}  ✅
```

## 🏆 **RAG'da `assign` SHART** — prompt'ga **savol ham, kontekst ham** kerak.

</details>

**M6.** ⭐ `itemgetter` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from operator import itemgetter

z = ({"a": itemgetter("x"), "b": itemgetter("y")}
     | RunnableLambda(lambda d: d["a"] + d["b"]))
print(z.invoke({"x": 10, "y": 5, "z": "ishlatilmaydi"}))     # 15
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Ikki bosqichli zanjir yasang *(modelsiz)*.

<details>
<summary>✅ Yechim</summary>

```python
bosqich1 = (RunnableLambda(lambda d: d["matn"].split())
            | RunnableLambda(lambda w: [x.lower() for x in w]))

bosqich2 = (RunnableLambda(lambda d: d["sozlar"])
            | RunnableLambda(lambda w: {"soni": len(w),
                                        "noyob": len(set(w)),
                                        "eng_uzun": max(w, key=len)}))

toliq = bosqich1 | {"sozlar": RunnablePassthrough()} | bosqich2
print(toliq.invoke({"matn": "Salom dunyo salom LangChain dunyo"}))
```

```
{'soni': 5, 'noyob': 3, 'eng_uzun': 'langchain'}
```

## 🏆 **MODELSIZ — LEKIN AYNAN O'SHA NAQSH.**

</details>

**M8.** ⭐⭐⭐ RAG naqshini modelsiz taqlid qiling.

<details>
<summary>✅ Yechim</summary>

```python
HUJJATLAR = {
    "depozit": "Muddatli depozit yillik 18–22% foiz keltiradi.",
    "karta":   "Karta 3 ish kunida tayyorlanadi.",
    "kredit":  "Iste'mol krediti 24 oygacha beriladi.",
}

def qidir(savol):
    past = savol.lower()
    for k, v in HUJJATLAR.items():
        if k in past:
            return v
    return "Ma'lumot topilmadi."

rag = (RunnablePassthrough.assign(kontekst=lambda d: qidir(d["savol"]))
       | RunnableLambda(lambda d: f"KONTEKST: {d['kontekst']}\n"
                                  f"SAVOL: {d['savol']}\n"
                                  f"JAVOB: (model shu yerda javob beradi)"))

print(rag.invoke({"savol": "Depozit foizi qancha?"}))
print()
print(rag.invoke({"savol": "Ob-havo qanday?"}))
```

## 🏆 **42-MODULNING BUTUN NAQSHI — SHU YERDA, MODELSIZ.**

## 🔑 **`assign` `savol` ni SAQLAB QOLDI** — usiz prompt uni **ko'ra olmasdi**.

</details>

---

## 📌 Xulosa

```python
{"tools": RunnablePassthrough()}          # str → dict   (eskilari YO'QOLADI)
RunnablePassthrough.assign(x=...)         # ⭐ eskilari QOLADI + yangisi
{"a": r1, "b": r2}                        # AVTOMATIK RunnableParallel
itemgetter("x")                           # lambda d: d["x"] ning qisqasi
```

> ## 🏆 **RAG NAQSHI** *(42-modul)*:
> ```python
> RunnablePassthrough.assign(kontekst=lambda x: retriever.invoke(x["savol"]))
> | prompt | chat | StrOutputParser()
> ```

---

⬅️ [4-dars. Runnable sinflari](04-Runnable-and-RunnableSequence.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. Runnable'larni grafda ko'rish](06-Graphing-Runnables.md)
