# 16-dars. Vectorstore-backed retriever ⭐⭐

## 🎬 Boshlashdan oldin

> **"`retriever = vectorstore.as_retriever(search_type='mmr', search_kwargs={'k': 3, 'lambda_mult': 0.7})`"**

---

## 1. Nima uchun retriever kerak?

```python
docs = vectorstore.similarity_search(query=Q, k=3)          # ⚠️ USUL
docs = retriever.invoke(Q)                                  # ⭐ RUNNABLE
```

> ## 🔑 **FARQI BITTA, LEKIN HAL QILUVCHI:**
> ```
> vectorstore  →  oddiy obyekt, USULLARI bor
> retriever    →  ⭐ RUNNABLE — 41-modulning HAMMA imkoniyati unda
> ```
>
> ## 🏆 **YA'NI:**
> ```python
> retriever | format_docs | prompt | model | parser      # ⭐ ZANJIRGA ULANADI
> retriever.batch([savol1, savol2, savol3])              # ⭐ BATCH
> retriever.with_retry()                                 # ⭐ QAYTA URINISH
> await retriever.ainvoke(Q)                             # ⭐ ASINXRON
> ```
> ## 💡 **`similarity_search` BULARNING HECH BIRINI QILA OLMAYDI.**

---

## 2. ⭐⭐ Uchta `search_type` — O'LCHANGAN

```python
for st, kw in [("similarity",                 {"k": 3}),
               ("mmr",                        {"k": 3, "lambda_mult": 0.7}),
               ("similarity_score_threshold", {"k": 3, "score_threshold": 0.3})]:
    r = vs.as_retriever(search_type=st, search_kwargs=kw)
    t0 = time.perf_counter()
    d = r.invoke(Q)
    print(f"  {st:28s} {len(d)} ta  {(time.perf_counter()-t0)*1000:.0f} ms")
```

```
  similarity                   3 ta  19 ms
  mmr                          3 ta  11 ms
  similarity_score_threshold   0 ta   9 ms     ← 💥
```

```
⚠️ No relevant docs were retrieved using the relevance score threshold 0.3
```

> ## 💥💥 **UCHINCHISI 0 TA HUJJAT QAYTARDI — SAVOL MOS BO'LGANIGA QARAMAY!**
>
> ## 🔑 **SABAB — 14-DARSDAGI MASOFA MUAMMOSI:**
> ```
> Chroma standart holda  →  L2 MASOFASI (12–15 oralig'ida)
> score_threshold        →  0..1 dagi O'XSHASHLIK kutadi
>                        →  💥 aylantirish noto'g'ri chiqadi → HAMMASI rad etiladi
> ```
>
> ## ✅ **YECHIM — bazani `cosine` fazoda yarating:**
> ```python
> vs = Chroma.from_documents(bolaklar, embedding,
>         persist_directory="./db",
>         collection_metadata={"hnsw:space": "cosine"})    # ⭐ SHART
>
> r = vs.as_retriever(search_type="similarity_score_threshold",
>                     search_kwargs={"k": 3, "score_threshold": 0.3})
> ```
>
> ## 💥 **VA E'TIBOR BERING — BU FAQAT OGOHLANTIRISH EDI, XATO EMAS.** Zanjirda bu **bo'sh kontekst** bo'ladi va model **hech narsasiz javob to'qiydi**.

---

## 3. ⭐ `batch` — bir necha savol birdan

```python
t0 = time.perf_counter()
b = retriever.batch([Q, "What is analysis vs analytics?", "What is big data?"])
print(f"batch(3): {[len(x) for x in b]}  {(time.perf_counter()-t0)*1000:.0f} ms")
```

```
batch(3): [3, 3, 3]  45 ms
```

> ## ⚡ **3 ta savol — 45 ms.** Bittasi ~11–19 ms, ya'ni **deyarli chiziqli** *(vektor qidiruvda tarmoq kutish yo'q)*.
>
> ## 💡 **BATCH'NING ASOSIY FOYDASI — LLM CHAQIRUVIDA** *(41-modul, 2-dars: 4× tezlanish)*. Retriever'da esa **qulaylik** uchun.

---

## 4. ⭐⭐ To'liq RAG zanjiri — kursning kodi

```python
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough

TEMPLATE = """
Answer the following question:
{question}

To answer the question, use only the following context:
{context}
"""
pt = PromptTemplate.from_template(TEMPLATE)

retriever = vs.as_retriever(search_type="mmr",
                            search_kwargs={"k": 3, "lambda_mult": 0.7})

zanjir = {"context": retriever, "question": RunnablePassthrough()} | pt
r = zanjir.invoke(Q)
print("prompt uzunligi:", len(r.text))
```

```
prompt uzunligi: 1911
```

> ## 🔑 **BU — 41-MODUL, 8-DARSDAGI NAQSH:**
> ```
> {"context": retriever, "question": RunnablePassthrough()}
>          ↓ dict AVTOMATIK RunnableParallel'ga aylanadi
> ① retriever   savolni oladi → hujjatlarni qaytaradi
> ② Passthrough savolni oladi → savolni O'ZINI qaytaradi
>          ↓ ikkalasi PARALLEL ishlaydi
> {"context": [...], "question": "..."}  →  prompt
> ```

> ## 💥💥 **LEKIN BU PROMPTDA JIDDIY MUAMMO BOR — 17-DARSDA KO'RAMIZ.** *(Ko'rsatma: `1911` belgi juda ko'p.)*

---

## 5. ⭐ `search_kwargs` — to'liq ro'yxat

```python
vs.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 3,                          # nechta qaytarsin
        "fetch_k": 20,                   # nechta nomzod (faqat mmr)
        "lambda_mult": 0.7,              # moslik ↔ xilma-xillik (faqat mmr)
        "filter": {"til": "uz"},         # ⭐ metadata bo'yicha
        "score_threshold": 0.3,          # faqat similarity_score_threshold
    })
```

> ## 🏆 **`filter` — RETRIEVERGA KO'CHIRISHNI UNUTMANG.** Ko'p kishi `similarity_search(filter=...)` da ishlatadi, keyin `as_retriever` ga o'tganda **tashlab yuboradi**.

---

## 6. ⭐⭐ Dinamik filtr — kursda YO'Q

Foydalanuvchiga qarab **har xil hujjatlar** ko'rsatish:

```python
from langchain_core.runnables import RunnableLambda

def foydalanuvchi_retrieveri(kirish):
    """Foydalanuvchi bo'limiga qarab filtrni O'ZGARTIRADI."""
    r = vs.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 3, "lambda_mult": 0.7,
                       "filter": {"bolim": kirish["bolim"]}})
    return r.invoke(kirish["savol"])

zanjir = ({"context": RunnableLambda(foydalanuvchi_retrieveri),
           "question": lambda x: x["savol"]} | pt)

zanjir.invoke({"savol": "Foiz qancha?", "bolim": "depozit"})
```

> ## 🏆 **BU — KO'P IJARACHILI (multi-tenant) RAG'NING ASOSI:**
> ```
> 🏦 Bank      →  har filial faqat O'Z hujjatlarini ko'radi
> 🏥 Klinika   →  shifokor faqat O'Z bemorlarini
> 🏢 Kompaniya →  bo'lim faqat O'Z ichki hujjatlarini
> ```
>
> ## ⚠️⚠️ **VA BU — XAVFSIZLIK MASALASI.** Filtr **serverda** qo'yilsin, **foydalanuvchi so'rovidan** olinmasin — aks holda u **boshqaning ma'lumotini** so'rab olishi mumkin.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `as_retriever` nima qaytaradi?

**M2.** Uchta `search_type` qaysilar?

**M3.** Nima uchun `similarity_search` o'rniga retriever?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `VectorStoreRetriever` — **Runnable**.

**M2.** ## `similarity` · `mmr` · `similarity_score_threshold`.

**M3.** ## Chunki u **Runnable** — `|`, `batch`, `with_retry`, `ainvoke` **hammasi ishlaydi**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Uchta turni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import time, pandas as pd

TURLAR = [("similarity", {"k": 3}),
          ("mmr", {"k": 3, "lambda_mult": 0.7}),
          ("mmr", {"k": 3, "lambda_mult": 0.3}),
          ("similarity_score_threshold", {"k": 3, "score_threshold": 0.3})]

q = []
for st, kw in TURLAR:
    r = vs.as_retriever(search_type=st, search_kwargs=kw)
    t0 = time.perf_counter()
    try:
        d = r.invoke(Q)
        q.append({"tur": st[:26], "kw": str(kw)[:30], "topildi": len(d),
                  "ms": round((time.perf_counter() - t0) * 1000)})
    except Exception as e:
        q.append({"tur": st[:26], "kw": str(kw)[:30],
                  "topildi": f"XATO {type(e).__name__}"})
print(pd.DataFrame(q).to_string(index=False))
```

## 💥 **`similarity_score_threshold` 0 TA QAYTARSA** — bazangiz **L2 fazoda**. `hnsw:space="cosine"` bilan qayta yarating.

</details>

**M5.** ⭐ To'liq zanjir tuzing va promptni ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough

pt = PromptTemplate.from_template(
    "Answer the following question:\n{question}\n\n"
    "To answer the question, use only the following context:\n{context}\n")

r = vs.as_retriever(search_type="mmr", search_kwargs={"k": 3, "lambda_mult": 0.7})
z = {"context": r, "question": RunnablePassthrough()} | pt

out = z.invoke("What software do data scientists use?")
print("uzunlik:", len(out.text))
print(out.text[:400])
```

## 🔑 **CHIQISHDA `[Document(id=..., metadata={...}, page_content=...)]` KO'RSANGIZ** — 17-darsga **tayyorsiz**.

</details>

**M6.** ⭐⭐ `cosine` fazoda chegarali retriever yarating.

<details>
<summary>✅ Yechim</summary>

```python
import shutil
shutil.rmtree("./cos-db", ignore_errors=True)
cos_vs = Chroma.from_documents(bolaklar, embedding,
                               persist_directory="./cos-db",
                               collection_metadata={"hnsw:space": "cosine"})

r = cos_vs.as_retriever(search_type="similarity_score_threshold",
                        search_kwargs={"k": 3, "score_threshold": 0.3})

for s in ["What software do data scientists use?",
          "What is the weather in Tashkent?"]:
    d = r.invoke(s)
    holat = "✅ topildi" if d else "🛡️ RAD ETILDI"
    print(f"{holat}  {len(d)} ta  ← {s}")
```

## 🏆 **IKKINCHI SAVOL RAD ETILISHI KERAK** — bu **himoya ishlayotganining isboti**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Ko'p ijarachili xavfsiz retriever yozing.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.runnables import RunnableLambda

class XavfsizRetriever:
    """Filtr SERVERDA qo'yiladi — foydalanuvchi so'rovi bilan O'ZGARTIRILMAYDI."""

    def __init__(self, vs, ruxsatlar, k=3, lambda_mult=0.7):
        self.vs = vs
        self.ruxsatlar = ruxsatlar      # {"user1": ["depozit", "karta"], ...}
        self.k, self.lm = k, lambda_mult

    def _filtr(self, foydalanuvchi):
        bolimlar = self.ruxsatlar.get(foydalanuvchi)
        if not bolimlar:
            raise PermissionError(f"💥 '{foydalanuvchi}' uchun RUXSAT YO'Q")
        if len(bolimlar) == 1:
            return {"bolim": bolimlar[0]}
        return {"bolim": {"$in": bolimlar}}

    def qidir(self, foydalanuvchi, savol):
        r = self.vs.as_retriever(
            search_type="mmr",
            search_kwargs={"k": self.k, "lambda_mult": self.lm,
                           "filter": self._filtr(foydalanuvchi)})
        d = r.invoke(savol)
        # ⭐ IKKI QAVATLI HIMOYA: natijani QAYTA tekshiramiz
        ruxsat = set(self.ruxsatlar[foydalanuvchi])
        for x in d:
            b = x.metadata.get("bolim")
            if b not in ruxsat:
                raise RuntimeError(f"💥 SIZIB CHIQISH: '{b}' bo'limi qaytdi!")
        return d

    def runnable(self, foydalanuvchi):
        return RunnableLambda(lambda s: self.qidir(foydalanuvchi, s))


xr = XavfsizRetriever(uz_vs, {"ali": ["depozit"], "vali": ["depozit", "karta"]})
print(len(xr.qidir("ali", "Foiz qancha?")))
try:
    xr.qidir("begona", "Foiz qancha?")
except PermissionError as e:
    print(e)
```

## 🏆 **IKKI QAVATLI HIMOYA — FILTR + NATIJANI QAYTA TEKSHIRISH.**

## 💥 **BITTA QAVAT YETMAYDI:** metadata yozilmay qolgan bo'lak filtrga **tushmasligi** mumkin.

</details>

---

## 📌 Xulosa

```python
retriever = vs.as_retriever(
    search_type="mmr",                                    # similarity · mmr · threshold
    search_kwargs={"k": 3, "lambda_mult": 0.7,
                   "filter": {"bolim": "depozit"}})

zanjir = {"context": retriever,
          "question": RunnablePassthrough()} | pt        # ⭐ RAG naqshi
```

```
similarity                  3 ta  19 ms
mmr                         3 ta  11 ms
similarity_score_threshold  0 ta   9 ms   ← 💥 L2 fazoda ISHLAMAYDI
batch(3)                    45 ms
prompt uzunligi             1911 belgi   ← ⚠️ 17-darsda tuzatamiz
```

> ## 🏆 **RETRIEVER — RUNNABLE.** Shuning uchun `|`, `batch`, `with_retry`, `ainvoke` — **hammasi bepul keladi**.
>
> ## 💥 **`score_threshold` NI ISHLATSANGIZ — BAZANI `hnsw:space="cosine"` BILAN YARATING**, aks holda **jim 0 ta hujjat** qaytadi.

---

⬅️ [15-dars. MMR qidiruv](15-MMR-Search.md) · 🏠 [Modul boshiga](README.md) · ➡️ [17-dars. Hujjatlarni promptga joylash](17-Stuffing-Documents.md)
