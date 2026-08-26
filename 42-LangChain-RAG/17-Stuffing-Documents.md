# 17-dars. Hujjatlarni promptga joylash (stuffing) ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Topilgan hujjatlarni promptga 'tiqib' qo'yamiz — bu 'stuffing' deb ataladi."**

---

## 1. 💥💥 KURSNING KODIDA 46% PUL ISROF BO'LADI

16-darsdagi zanjirni **ikki xil** qilib o'lchadik:

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")

# ── ① KURSDAGIDEK — retriever'ni TO'G'RIDAN-TO'G'RI ulash ──
xom = ({"context": retriever, "question": RunnablePassthrough()} | pt).invoke(Q)
print("XOM  :", len(xom.text), "belgi ·", len(enc.encode(xom.text)), "token")

# ── ② FORMATLANGAN ──
def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

fmt = ({"context": retriever | RunnableLambda(format_docs),
        "question": RunnablePassthrough()} | pt).invoke(Q)
print("FMT  :", len(fmt.text), "belgi ·", len(enc.encode(fmt.text)), "token")
```

```
XOM  : 1895 belgi · 417 token
FMT  : 1176 belgi · 223 token
TEJASH: 194 token (46.5%)
```

> ## 💥💥💥 **46.5% TOKEN — BEKORGA.**

### Nima uchun? Promptning boshiga qarang:

```
❌ XOM:
To answer the question, use only the following context:
[Document(id='cd48166d-e254-4af7-92be-cab4c2f9cc54', metadata={'Course Title':
'Introduction to Data and Data Science', 'Lecture Title': 'Programming Languages
& Software Employed in Data Science...'}, page_content='Great! We hope we gave...
```

```
✅ FORMATLANGAN:
To answer the question, use only the following context:
Great! We hope we gave you a good idea about the level of applicability...
```

> ## 🔑 **`{context}` GA RO'YXAT BERSANGIZ, PYTHON UNI `str()` QILADI** — ya'ni promptga **`Document(...)` REPR'i** tushadi:
> ```
> "[Document(id='cd48166d-...', metadata={...}, page_content='...')]"
>   ↑ UUID     ↑ qavslar      ↑ metadata      ↑ ⭐ FAQAT SHU KERAK
> ```
>
> ## 💰 **HAR SO'ROVDA. HAR FOYDALANUVCHIDA. HAR KUNI.**
> ```
> 10 000 so'rov/kun × 194 token × $0.15/1M (gpt-4o-mini) ≈ $0.29/kun ≈ $106/yil
> 10 000 so'rov/kun × 194 token × $2.50/1M (gpt-4o)      ≈ $4.85/kun ≈ $1 770/yil
> ```

> ## 💥 **VA BU FAQAT PUL EMAS — SIFAT HAM.** UUID va qavslar model uchun **shovqin**: u haqiqiy matnni **topib olishi** kerak bo'ladi.

---

## 2. ✅ To'g'ri yechim

```python
from langchain_core.runnables import RunnableLambda

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

zanjir = ({"context": retriever | RunnableLambda(format_docs),
           "question": RunnablePassthrough()}
          | pt)
```

> ## 💡 **`retriever | RunnableLambda(format_docs)`** — bu **kichik zanjir** *(41-modul, 5-dars)*. `RunnablePassthrough` bilan **parallel** ishlaydi.
>
> ## 🔑 **YOKI YANADA QISQA** *(LangChain funksiyani avtomatik `RunnableLambda` qiladi)*:
> ```python
> {"context": retriever | format_docs, "question": RunnablePassthrough()} | pt
> ```

---

## 3. ⭐⭐ Manbali format — 60 token evaziga MANBA

```python
def format_manbali(docs):
    q = []
    for i, d in enumerate(docs, 1):
        m = d.metadata.get("Lecture Title", "?")
        q.append(f"[{i}] ({m})\n{d.page_content}")
    return "\n\n".join(q)
```

```
FORMATLANGAN : 223 token
MANBALI      : 283 token      (+60 token, +27%)
```

> ## 🏆 **+60 TOKEN — VA MODEL ENDI MANBAGA HAVOLA QILA OLADI:**
> ```
> "Ma'lumotlarga ko'ra [2], data scientistlar Python va R ishlatadi."
> ```
>
> ## 💥 **VA BU — YOLG'ON TO'QISHGA QARSHI ENG YAXSHI VOSITA.** Foydalanuvchi javobni **tekshira oladi**.
>
> ## 💡 **UCHTA VARIANT:**
> ```
> XOM        417 token   ❌ hech qachon
> FMT        223 token   ✅ eng arzon
> MANBALI    283 token   🏆 ⭐ ISHLAB CHIQARISH UCHUN
> ```

---

## 4. ⚠️⚠️ Kontekst byudjeti — kursda YO'Q

```python
import tiktoken

def kontekst_byudjeti(docs, maks_token=3000, model="gpt-4o-mini"):
    """Bo'laklarni token chegarasigacha QIRQADI."""
    enc = tiktoken.encoding_for_model(model)
    q, jami = [], 0
    for i, d in enumerate(docs, 1):
        t = len(enc.encode(d.page_content))
        if jami + t > maks_token:
            print(f"⚠️ {len(docs)-len(q)} ta bo'lak TASHLANDI "
                  f"(byudjet {maks_token} token)")
            break
        q.append(d)
        jami += t
    print(f"kontekst: {len(q)}/{len(docs)} bo'lak · {jami} token")
    return "\n\n".join(x.page_content for x in q)
```

> ## 💥 **USIZ NIMA BO'LADI?**
> ```
> k=20 · har bo'lak 500 belgi  →  ~2500 token
> 🇺🇿 O'ZBEKCHADA esa           →  ~4700 token   (1.88×, 36-modul)
> ```
> ## ⚠️ **KONTEKST OYNASI TO'LSA — XATO** *(yaxshi holat)* yoki **jim qirqilish** *(yomon holat)*.

> ## 🇺🇿 **VA BU — O'ZBEKCHA RAG'NING ASOSIY CHEKLOVI:**
> ```
> Inglizcha:  k=20 → 2500 token   ✅ bemalol
> O'zbekcha:  k=20 → 4700 token   ⚠️ ikki barobar
>             →  k ni KAMAYTIRING yoki bo'lakni QISQARTIRING
> ```

---

## 5. ⭐ Boshqa strategiyalar — nomlarini biling

| Strategiya | Qanday | Qachon |
|---|---|---|
| ## **Stuff** | ## Hammasini **bitta promptga** | ## ⭐ **standart** — 95% holat |
| **Map-Reduce** | Har bo'lakka alohida chaqiruv → xulosa | Juda ko'p hujjat, xulosa |
| **Refine** | Javobni bo'lakma-bo'lak **yaxshilash** | Uzun hujjat, batafsil javob |
| **Map-Rerank** | Har bo'lak javob + **ball** → eng yaxshisi | Bitta aniq javob kerak |

> ## 💰 **STUFF — 1 TA LLM CHAQIRUVI. QOLGANLARI — N TA.**
> ```
> Stuff       →  1 chaqiruv   ✅ tez, arzon
> Map-Reduce  →  N+1 chaqiruv ⚠️ N barobar qimmat va sekin
> ```
> ## 🏆 **STUFFDAN BOSHLANG.** Faqat kontekst **sig'masa** boshqasiga o'ting.
>
> ## ⚠️ **VA E'TIBOR:** `load_qa_chain`, `MapReduceDocumentsChain` — bular **`langchain.chains` da edi**, ya'ni **LangChain 1.0 da olib tashlangan** *(35-modul)*. Bugun ularni **LCEL bilan qo'lda** yozasiz.

---

## 6. ⭐⭐ Bo'laklar tartibi — "lost in the middle"

```python
def markazga_bosish(docs):
    """Eng mos bo'laklarni BOSH va OXIRGA, eng zaifini O'RTAGA qo'yadi."""
    bosh, oxir = [], []
    for i, d in enumerate(docs):
        (bosh if i % 2 == 0 else oxir).append(d)
    return bosh + oxir[::-1]
```

> ## 🔑 **TADQIQOT NATIJASI** *(Liu va boshqalar, 2023 — "Lost in the Middle")*: modellar **prompt boshi va oxiridagi** ma'lumotni **o'rtasidagidan yaxshiroq** eslaydi.
>
> ## 💡 **SHUNING UCHUN:** eng mos bo'lak **1-o'ringa**, ikkinchisi **oxirgi o'ringa**, eng zaifi **o'rtaga**.
>
> ## ⚠️ **BU — KICHIK YAXSHILANISH.** Avval **retriever sifatini** tuzating *(chegara, MMR, filtr)* — u **ancha kattaroq** ta'sir beradi.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** "Stuffing" nima?

**M2.** `{context}` ga ro'yxat bersangiz nima bo'ladi?

**M3.** `format_docs` nechi foiz token tejadi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Topilgan bo'laklarni **promptga joylash**.

**M2.** ## Python `str()` qiladi → promptga **`Document(...)` repr'i** tushadi *(UUID, metadata, qavslar)*.

**M3.** ## **46.5%** *(417 → 223 token, o'lchandi)*.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Tejashni o'zingiz o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, pandas as pd
enc = tiktoken.get_encoding("cl100k_base")

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

def format_manbali(docs):
    return "\n\n".join(
        f"[{i}] ({d.metadata.get('Lecture Title','?')[:30]})\n{d.page_content}"
        for i, d in enumerate(docs, 1))

VARIANTLAR = {"xom (kursdagidek)": retriever,
              "format_docs": retriever | RunnableLambda(format_docs),
              "manbali": retriever | RunnableLambda(format_manbali)}

q = []
for nom, ctx in VARIANTLAR.items():
    out = ({"context": ctx, "question": RunnablePassthrough()} | pt).invoke(Q)
    q.append({"variant": nom, "belgi": len(out.text),
              "token": len(enc.encode(out.text))})
d = pd.DataFrame(q)
d["ortiqcha_%"] = (100 * (d.token / d.token.min() - 1)).round(1)
print(d.to_string(index=False))
```

## 🔑 **`ortiqcha_%` — HAR SO'ROVDA TO'LAYDIGAN ORTIQCHA PULINGIZ.**

</details>

**M5.** ⭐ Kontekst byudjetini qo'ying.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken

def byudjetli_format(maks_token=1000):
    enc = tiktoken.get_encoding("cl100k_base")
    def f(docs):
        q, jami = [], 0
        for d in docs:
            t = len(enc.encode(d.page_content))
            if jami + t > maks_token:
                break
            q.append(d.page_content)
            jami += t
        if len(q) < len(docs):
            print(f"⚠️ {len(docs)-len(q)}/{len(docs)} bo'lak tashlandi "
                  f"({jami}/{maks_token} token)")
        return "\n\n".join(q)
    return f

z = ({"context": retriever | RunnableLambda(byudjetli_format(300)),
      "question": RunnablePassthrough()} | pt)
print(len(z.invoke(Q).text))
```

## 💡 **`300` NI PASAYTIRIB KO'RING** — ogohlantirish chiqishi kerak.

</details>

**M6.** ⭐⭐ 🇺🇿 O'zbekcha kontekst narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
o200 = tiktoken.get_encoding("o200k_base")

EN = ("Data scientists primarily use Python and R for their work. "
      "SQL is essential for querying relational databases.")
UZ = ("Data scientistlar asosan Python va R dan foydalanadi. "
      "Relyatsion ma'lumotlar bazasini so'rovlash uchun SQL zarur.")

for nom, m in [("EN", EN), ("UZ", UZ)]:
    print(f"{nom}: {len(m):3d} belgi · cl100k {len(enc.encode(m)):3d} · "
          f"o200k {len(o200.encode(m)):3d}")

nis = len(enc.encode(UZ)) / len(enc.encode(EN))
print(f"\n🇺🇿 nisbat: {nis:.2f}×")
print(f"k=20 uchun: EN ~{20*125} token · UZ ~{int(20*125*nis)} token")
```

## 💥 **36-MODULDA O'LCHAGAN 1.88× SHU YERDA HAM CHIQADI.** 🇺🇿 O'zbekcha RAG'da `k` ni **kamaytiring**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ To'liq kontekst quruvchi sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
from langchain_core.runnables import RunnableLambda

class KontekstQuruvchi:
    """Formatlash + byudjet + manba + tartib — bir joyda."""

    def __init__(self, maks_token=3000, manba=True, tartib="markazga",
                 kodlash="cl100k_base"):
        self.maks = maks_token
        self.manba = manba
        self.tartib = tartib
        self.enc = tiktoken.get_encoding(kodlash)
        self.oxirgi = {}

    def _tartibla(self, docs):
        if self.tartib == "markazga":
            bosh, oxir = [], []
            for i, d in enumerate(docs):
                (bosh if i % 2 == 0 else oxir).append(d)
            return bosh + oxir[::-1]
        return docs

    def _byudjet(self, docs):
        q, jami, tashlandi = [], 0, 0
        for d in docs:
            t = len(self.enc.encode(d.page_content))
            if jami + t > self.maks:
                tashlandi += 1
                continue
            q.append(d)
            jami += t
        return q, jami, tashlandi

    def __call__(self, docs):
        if not docs:
            self.oxirgi = {"bolak": 0, "token": 0, "tashlandi": 0}
            return "(kontekst topilmadi)"

        saqlangan, jami, tashlandi = self._byudjet(docs)
        saqlangan = self._tartibla(saqlangan)

        if self.manba:
            matn = "\n\n".join(
                f"[{i}] ({d.metadata.get('Lecture Title', d.metadata.get('source','?'))[:40]})"
                f"\n{d.page_content}"
                for i, d in enumerate(saqlangan, 1))
        else:
            matn = "\n\n".join(d.page_content for d in saqlangan)

        self.oxirgi = {"bolak": len(saqlangan), "token": jami,
                       "tashlandi": tashlandi,
                       "byudjet_%": round(100 * jami / self.maks, 1)}
        if tashlandi:
            print(f"⚠️ {tashlandi} bo'lak byudjetga sig'madi")
        return matn

    def runnable(self):
        return RunnableLambda(self)


kq = KontekstQuruvchi(maks_token=1500, manba=True)
z = ({"context": retriever | kq.runnable(),
      "question": RunnablePassthrough()} | pt)
out = z.invoke(Q)
print(out.text[:300])
print("\nstatistika:", kq.oxirgi)
```

## 🏆 **`kq.oxirgi` — HAR SO'ROVDAN KEYIN TEKSHIRING.**

## 💥 **`byudjet_%` DOIM 95+ BO'LSA** — `k` **juda katta**. **`tashlandi` > 0 bo'lsa** — pul to'lab olgan bo'laklaringiz **tashlanmoqda**.

</details>

---

## 📌 Xulosa

```python
def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

zanjir = ({"context": retriever | RunnableLambda(format_docs),   # ⭐ SHART
           "question": RunnablePassthrough()} | pt)
```

```
❌ XOM (kursdagidek)  417 token   ← Document(id=..., metadata={...}) repr'i
✅ format_docs        223 token   ← 💰 46.5% TEJASH
🏆 manbali            283 token   ← +60 token, MANBA ko'rsatiladi
```

> ## 💥💥 **`{context}` GA RETRIEVER'NI TO'G'RIDAN-TO'G'RI ULAMANG.** Har so'rovda **46% ortiqcha to'laysiz** va model **shovqin** ichida ishlaydi.
>
> ## 🇺🇿 **O'ZBEKCHADA KONTEKST 1.88× QIMMAT** — `k` ni kamaytiring, byudjet qo'ying.

---

⬅️ [16-dars. Retriever](16-Vectorstore-Backed-Retriever.md) · 🏠 [Modul boshiga](README.md) · ➡️ [18-dars. Javob generatsiyasi](18-Generating-Response.md)
