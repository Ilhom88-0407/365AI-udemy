# 8-dars. `RunnableParallel` ni boshqa Runnable'lar bilan ulash ⭐

## 🎬 Boshlashdan oldin

> **"`chain_time2 = ({'books': chain_books, 'projects': chain_projects} | chat_template_time | chat | string_parser)`"**

---

## 1. To'liq naqsh

```python
chat_template_time = ChatPromptTemplate.from_template("""
Consider the following literature:
{books}

Also, consider the following projects:
{projects}

Roughly how much time would it take me to complete the literature
and the projects?
""")

chain_time = ({"books": chain_books, "projects": chain_projects}
              | chat_template_time
              | chat
              | string_parser)

print(chain_time.invoke({"programming language": "Python"}))
```

```
{"programming language": "Python"}
        ↓
   ┌────────────────┬────────────────┐
   │  chain_books   │ chain_projects │      ⭐ PARALLEL
   └────────────────┴────────────────┘
        ↓
{"books": "...", "projects": "..."}          ⭐ shablon KUTGAN kalitlar
        ↓  chat_template_time
ChatPromptValue  →  chat  →  string_parser
        ↓
"vaqt hisobi"
```

> ## 🔑 **KALITLAR MOS KELISHI SHART:**
> ```
> RunnableParallel kalitlari  :  "books", "projects"
> Shablon o'zgaruvchilari      :  {books}, {projects}
>                                  ↑ AYNAN BIR XIL bo'lishi kerak
> ```

---

## 2. ⚠️ Mos kelmasa — `KeyError`

```python
noto_gri = ({"kitoblar": chain_books, "loyihalar": chain_projects}
            | chat_template_time)        # shablon {books} kutadi
noto_gri.invoke({"programming language": "Python"})
```

```
KeyError: Input to ChatPromptTemplate is missing variables {'books', 'projects'}.
Expected: ['books', 'projects'] Received: ['kitoblar', 'loyihalar']
```

> ## ✅ **XATO ANIQ VA TUSHUNARLI** — 39-modulda ko'rgan naqsh.

---

## 3. ⭐ Grafda ko'ramiz

```python
chain_time.get_graph().print_ascii()
```

> ## 💡 **PARALLEL QISM GRAFDA SHOXLANIB KO'RINADI** — bu **tuzilishni tekshirishning** eng tez usuli.

---

## 4. ⭐⭐ Amaliy naqsh — RAG'ning asosi

```python
from operator import itemgetter

rag = ({"kontekst": itemgetter("savol") | retriever | format_docs,
        "savol": itemgetter("savol")}                       # ⭐ savol ham OLIB O'TILADI
       | prompt
       | chat
       | StrOutputParser())
```

> ## 🔑 **`"savol": itemgetter("savol")` — SAVOLNI KEYINGI QADAMGA O'TKAZADI.**
>
> Usiz prompt'ga faqat `kontekst` yetib borardi va u savolga **javob bera olmasdi**.
>
> ## ⭐ **MUQOBIL YOZUV — `assign`** *(5-dars)*:
> ```python
> rag = (RunnablePassthrough.assign(
>            kontekst=lambda x: format_docs(retriever.invoke(x["savol"])))
>        | prompt | chat | StrOutputParser())
> ```
> ```
> Lug'at + itemgetter  →  aniq, lekin uzunroq
> assign               →  ⭐ qisqaroq, eski kalitlar AVTOMATIK qoladi
> ```

---

## 5. ⚠️ Chuqur ichma-ich zanjirlardan saqlaning

```python
# ❌ O'QILISHI QIYIN
z = ({"a": ({"x": r1, "y": r2} | r3), "b": r4} | r5 | {"c": r6} | r7)

# ✅ NOMLANGAN QISMLAR
ichki = {"x": r1, "y": r2} | r3
birinchi = {"a": ichki, "b": r4} | r5
z = birinchi | {"c": r6} | r7
```

> ## 🏆 **HAR QISMNI ALOHIDA SINASH MUMKIN:**
> ```python
> print(ichki.invoke(kirish))          # ⭐ o'rtadagi natijani KO'RASIZ
> ```
> **Uzun bir qatorli zanjirda buni qila olmaysiz.**

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Parallel natijasi keyingi shablonga qanday yetadi?

**M2.** Kalitlar mos kelmasa nima bo'ladi?

**M3.** Savolni keyingi qadamga qanday o'tkazish mumkin?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Lug'at** sifatida — kalitlar shablon **o'zgaruvchilari** bilan **mos** bo'lishi kerak.

**M2.** ## **`KeyError`** — LangChain kutilgan va olingan kalitlarni **ko'rsatadi**.

**M3.** ## `{"savol": itemgetter("savol"), ...}` yoki ## `RunnablePassthrough.assign(...)`.

</details>

### 🟡 O'rta

**M4.** ⭐ Modelsiz parallel → ketma-ket zanjir.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnableLambda
from operator import itemgetter

tahlil = ({"soni": RunnableLambda(lambda s: len(s.split())),
           "harflar": RunnableLambda(lambda s: len(s)),
           "eng_uzun": RunnableLambda(lambda s: max(s.split(), key=len))}
          | RunnableLambda(lambda d: f"{d['soni']} so'z, {d['harflar']} harf, "
                                     f"eng uzun: {d['eng_uzun']}"))

print(tahlil.invoke("Salom dunyo bu LangChain sinovi"))
```

</details>

**M5.** ⭐⭐ Kalit mos kelmasligini sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.prompts import ChatPromptTemplate

sh = ChatPromptTemplate.from_template("Books: {books}\nProjects: {projects}")
noto_gri = ({"kitoblar": RunnableLambda(lambda x: "K"),
             "loyihalar": RunnableLambda(lambda x: "L")} | sh)
try:
    noto_gri.invoke({})
except KeyError as e:
    print("❌", str(e)[:140])
```

</details>

**M6.** ⭐ Grafda parallel shoxni ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
z = ({"a": RunnableLambda(sum), "b": RunnableLambda(max)}
     | RunnableLambda(lambda d: d["a"] + d["b"]))
z.get_graph().print_ascii()
print(z.invoke([1, 2, 5]))          # 8 + 5 = 13
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Ko'p manbali javob zanjiri.

<details>
<summary>✅ Yechim</summary>

```python
from operator import itemgetter

MANBALAR = {
    "faq":      lambda q: "FAQ: Depozit foizi 18–22%.",
    "hujjat":   lambda q: "Hujjat: Minimal summa 1 000 000 so'm.",
    "tarix":    lambda q: "Tarix: Mijoz oldin karta so'ragan edi.",
}

koп_manbali = (
    RunnablePassthrough.assign(**{
        nom: RunnableLambda(lambda d, f=f: f(d["savol"]))
        for nom, f in MANBALAR.items()})
    | RunnableLambda(lambda d:
        "SAVOL: {savol}\n\nMANBALAR:\n- {faq}\n- {hujjat}\n- {tarix}".format(**d)))

print(koп_manbali.invoke({"savol": "Depozit foizi qancha?"}))
```

## 🏆 **`assign(**{...})` — DINAMIK SHOXLAR.** Manba qo'shish — **lug'atga bitta qator**.

## ⚠️ **`lambda d, f=f: ...` — MUHIM NOZIKLIK.** Usiz Python **yopilish** (closure) tufayli **hamma lambda oxirgi `f` ni** ishlatadi. Bu — klassik tuzoq.

</details>

---

## 📌 Xulosa

```python
({"books": chain_books, "projects": chain_projects}     # ⭐ PARALLEL
 | chat_template_time                                    # kalitlar MOS bo'lsin
 | chat
 | string_parser)
```

```
⭐ RAG naqshi:
   {"kontekst": itemgetter("savol") | retriever | format_docs,
    "savol": itemgetter("savol")}                ← savol OLIB O'TILADI
   | prompt | chat | parser
```

> ## 🏆 **UZUN ZANJIRNI NOMLANGAN QISMLARGA BO'LING** — har birini **alohida sinash** mumkin bo'ladi.

---

⬅️ [7-dars. RunnableParallel](07-RunnableParallel.md) · 🏠 [Modul boshiga](README.md) · ➡️ [9-dars. RunnableLambda](09-RunnableLambda.md)
