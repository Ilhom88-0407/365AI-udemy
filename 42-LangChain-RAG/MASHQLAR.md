# 📝 42-modul mashqlari

> **44 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **BUTUN QUVUR API KALITISIZ SINALADI** — mahalliy embedding + mahalliy Chroma.

## ⚙️ Tayyorgarlik

```bash
pip install langchain langchain-core langchain-community langchain-chroma
pip install langchain-huggingface sentence-transformers
pip install pypdf docx2txt tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, copy, shutil, hashlib
from collections import Counter
import numpy as np, pandas as pd

from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain_text_splitters.character import CharacterTextSplitter
from langchain_text_splitters.markdown import MarkdownHeaderTextSplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import (RunnableLambda, RunnablePassthrough,
                                      RunnableParallel)
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


def kosinus(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)
```

> ## ⚠️ **BIRINCHI ISHGA TUSHIRISHDA MODEL YUKLANADI (~42s, ~470 MB).** Keyingi safar **keshdan**.

---

# 🟢 OSON *(1–14)*

**M1.** Modelga o'z ma'lumotingizni berishning uchta yo'li qaysi?

**M2.** "Model NIMANI bilsin?" savoliga qaysi yo'l javob beradi?

**M3.** RAG ning uchta qismi qaysi?

**M4.** RAG dagi eng zaif halqa qaysi?

**M5.** `Document` obyektining ikkita maydoni qaysi?

**M6.** Nima uchun hujjatlar bo'laklanadi? Uchta sabab.

**M7.** `PyPDFLoader` nechta hujjat qaytaradi?

**M8.** `Docx2txtLoader` nechta hujjat qaytaradi?

<details>
<summary>✅ Javoblar M1–M8</summary>

**M1.** ## Prompt muhandisligi · fine-tuning · ## ⭐ **RAG**.

**M2.** ## **RAG.** *("Model QANDAY javob bersin?" → prompt/fine-tuning.)*

**M3.** ## **Retrieval** *(topish)* · **Augmentation** *(promptga qo'shish)* · **Generation** *(javob)*.

**M4.** ## **Retriever.** Noto'g'ri bo'lak topilsa — model **yolg'on to'qiydi**.

**M5.** ## `page_content` *(matn)* va `metadata` *(dict)*.

**M6.** ## ① kontekst oynasi · ② narx · ## ⭐ ③ **sifat** *(aniq bo'lak topiladi)*.

**M7.** ## **Har sahifa uchun bittadan** — bizda **6 ta**.

**M8.** ## **Faqat bitta** — butun hujjat **bir bo'lak**.

</details>

**M9.** `chunk_size=500` — belgi yoki token?

**M10.** `chunk_overlap` nima uchun kerak?

**M11.** Chroma standart holda qanday masofa ishlatadi?

**M12.** `similarity_search_with_score` da kichik ball yaxshimi?

**M13.** MMR formulasi qanday?

**M14.** `λ = 1.0` nima beradi?

<details>
<summary>✅ Javoblar M9–M14</summary>

**M9.** ## **BELGI** — token **emas**. 🇺🇿 O'zbekchada 500 belgi ≈ **200 token** *(1.88×)*.

**M10.** Bo'lak chegarasida **jumla kesilib** ma'no yo'qolmasligi uchun.

**M11.** ## **L2 (Evklid)** masofasi — kosinus **emas**.

**M12.** ## ✅ **Ha** — bu **masofa**, o'xshashlik emas *(12.4015 · 15.2941 · 15.5754)*.

**M13.** ## `λ × moslik + (1−λ) × xilma-xillik`.

**M14.** ## Aynan `similarity_search` — xilma-xillik **o'chirilgan** *(o'lchandi)*.

</details>

---

# 🟡 O'RTA *(15–34)*

**M15.** ⭐ PDF va DOCX yuklovchilarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
PDF = "Introduction_to_Data_and_Data_Science.pdf"
DOCX = "Introduction_to_Data_and_Data_Science.docx"

q = []
for nom, L, yol in [("PyPDFLoader", PyPDFLoader, PDF),
                    ("Docx2txtLoader", Docx2txtLoader, DOCX)]:
    t0 = time.perf_counter()
    d = L(yol).load()
    q.append({"yuklovchi": nom, "hujjat": len(d),
              "belgi": sum(len(x.page_content) for x in d),
              "metadata": len(d[0].metadata),
              "s": round(time.perf_counter() - t0, 2)})
print(pd.DataFrame(q).to_string(index=False))
```

## 🔑 **PDF: 6 hujjat, 8+ metadata. DOCX: 1 hujjat, 1 metadata.**

</details>

**M16.** ⭐ Bo'sh sahifalarni toping.

<details>
<summary>✅ Yechim</summary>

```python
def bosh_sahifalar(hujjatlar, chegara=50):
    bosh = [(i, len(d.page_content.strip()))
            for i, d in enumerate(hujjatlar)
            if len(d.page_content.strip()) < chegara]
    if bosh:
        print(f"⚠️ {len(bosh)}/{len(hujjatlar)} sahifa deyarli BO'SH:")
        for i, n in bosh:
            print(f"    sahifa {i}: {n} belgi")
    else:
        print(f"✅ hamma sahifada {chegara}+ belgi bor")
    return bosh
```

## 💥 **BO'SH SAHIFA — SKANERLANGAN PDF BELGISI.** Unda OCR kerak.

</details>

**M17.** ⭐ Ortiqcha bo'sh joyni tozalang.

<details>
<summary>✅ Yechim</summary>

```python
pages = PyPDFLoader(PDF).load()
cut = copy.deepcopy(pages)                 # ⭐ deepcopy — aslini SAQLAYDI
for i in cut:
    i.page_content = " ".join(i.page_content.split())

print("oldin :", len(pages[0].page_content))
print("keyin :", len(cut[0].page_content))
print("tejash:", len(pages[0].page_content) - len(cut[0].page_content), "belgi")
```

## 🔑 **1580 → 1541 belgi** *(o'lchandi)*. **`deepcopy` shart** — aks holda aslini buzasiz.

</details>

**M18.** ⭐⭐ `CharacterTextSplitter` haqiqiy bo'lak sonini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
pages = Docx2txtLoader(DOCX).load()
for i in range(len(pages)):
    pages[i].page_content = " ".join(pages[i].page_content.split())

n = len(pages[0].page_content)
cs = CharacterTextSplitter(separator=".", chunk_size=500, chunk_overlap=50)
b = cs.split_documents(pages)
uz = [len(x.page_content) for x in b]

print(f"asl uzunlik : {n}")
print(f"kutilgan    : {n/500:.1f}")
print(f"HAQIQATDA   : {len(b)}")
print(f"min {min(uz)} max {max(uz)} o'rtacha {sum(uz)//len(uz)}")
print(f"500 dan katta: {sum(1 for x in uz if x > 500)}")
```

## 💥 **8262/500 = 16.5 KUTILGAN, HAQIQATDA 21.** Separator `.` chegarani **buzadi**.

</details>

**M19.** ⭐ `Recursive` bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
q = []
for nom, S in [("Character",
                CharacterTextSplitter(separator=".", chunk_size=500,
                                      chunk_overlap=50)),
               ("Recursive",
                RecursiveCharacterTextSplitter(chunk_size=500,
                                               chunk_overlap=50))]:
    b = S.split_documents(pages)
    uz = [len(x.page_content) for x in b]
    q.append({"bo'lakchi": nom, "bo'lak": len(b), "min": min(uz),
              "max": max(uz), "o'rt": sum(uz) // len(uz),
              "500+": sum(1 for x in uz if x > 500)})
print(pd.DataFrame(q).to_string(index=False))
```

## 🏆 **RECURSIVE — 19 bo'lak, max 500, oshib ketish 0.** ⭐ **Standart tanlov**.

</details>

**M20.** ⭐⭐ Ikki bosqichli bo'laklash *(Markdown + Character)*.

<details>
<summary>✅ Yechim</summary>

```python
DOCX2 = "Introduction_to_Data_and_Data_Science_2.docx"
p = Docx2txtLoader(DOCX2).load()

md = MarkdownHeaderTextSplitter([("#", "Course Title"), ("##", "Lecture Title")])
bosqich1 = md.split_text(p[0].page_content)
print("① Markdown:", len(bosqich1), "bo'lak")
print("   metadata:", bosqich1[0].metadata)

for x in bosqich1:
    x.page_content = " ".join(x.page_content.split())
bosqich2 = CharacterTextSplitter(separator=".", chunk_size=500,
                                 chunk_overlap=50).split_documents(bosqich1)
print("② Character:", len(bosqich2), "bo'lak")
print("   metadata SAQLANDI:", bosqich2[0].metadata)
```

## 🏆 **20 BO'LAK, HAR BIRIDA `Course Title` + `Lecture Title`.** Bu — 15-darsdagi `filter` ning **asosi**.

</details>

**M21.** ⭐⭐ Embedding normasini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
v = embedding.embed_query("test")
n = float(np.linalg.norm(v))
print(f"o'lcham: {len(v)}  norma: {n:.4f}")
if abs(n - 1.0) > 0.01:
    print("💥 NORMA 1.0 EMAS — np.dot KOSINUS EMAS! Normaga BO'LING.")
else:
    print("✅ normallashtirilgan — np.dot = kosinus")
```

## 💥 **BIZDA 5.8556** — ya'ni `np.dot` **kosinus emas**.

</details>

**M22.** ⭐⭐ 🇺🇿 O'zbekcha juftliklarni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
JUFTLAR = [("bank", "kredit"), ("bank", "osmon"),
           ("mushuk", "it"), ("mushuk", "avtomobil"),
           ("cat", "mushuk"), ("dog", "it")]
q = []
for a, b in JUFTLAR:
    q.append({"a": a, "b": b,
              "kosinus": round(kosinus(embedding.embed_query(a),
                                       embedding.embed_query(b)), 4)})
d = pd.DataFrame(q).sort_values("kosinus", ascending=False)
print(d.to_string(index=False))
```

## ✅ **`bank↔kredit` 0.6898 — eng yuqori.** 💥 **`cat↔mushuk` 0.2829 — tillar orasi ZAIF.**

</details>

**M23.** ⭐ Chroma yarating va qayta yuklang.

<details>
<summary>✅ Yechim</summary>

```python
shutil.rmtree("./m-db", ignore_errors=True)
t0 = time.perf_counter()
vs = Chroma.from_documents(bosqich2, embedding, persist_directory="./m-db")
print(f"indekslash: {time.perf_counter()-t0:.1f}s · {len(vs.get()['documents'])} hujjat")

vs2 = Chroma(persist_directory="./m-db", embedding_function=embedding)
print("qayta yuklandi:", len(vs2.get()["documents"]))
```

## ⚠️ **`from_documents` → `embedding=` · `Chroma(...)` → `embedding_function=`.**

</details>

**M24.** ⭐⭐ Ballarni ko'ring va turini aniqlang.

<details>
<summary>✅ Yechim</summary>

```python
Q = "What programming languages do data scientists use?"

print("--- with_score (MASOFA) ---")
for d, s in vs.similarity_search_with_score(Q, k=3):
    print(f"  {s:8.4f}  {d.page_content[:52]}")

print("\n--- with_relevance_scores (0..1) ---")
for d, s in vs.similarity_search_with_relevance_scores(Q, k=3):
    print(f"  {s:8.4f}  {d.page_content[:52]}")
```

## 💥 **BIRINCHISI 12–15 — MASOFA. IKKINCHISI 0..1 — O'XSHASHLIK.**

</details>

**M25.** ⭐ `cosine` fazoda baza yarating.

<details>
<summary>✅ Yechim</summary>

```python
shutil.rmtree("./cos-db", ignore_errors=True)
cos_vs = Chroma.from_documents(bosqich2, embedding,
                               persist_directory="./cos-db",
                               collection_metadata={"hnsw:space": "cosine"})
for d, s in cos_vs.similarity_search_with_score(Q, k=3):
    print(f"  {s:.4f}")
```

## 🔑 **Endi ballar 0..2 oralig'ida** *(0 = aynan bir xil)*.

</details>

**M26.** ⭐⭐ λ ning ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
q = []
for lam in [0.0, 0.3, 0.5, 0.7, 1.0]:
    docs = vs.max_marginal_relevance_search(Q, k=3, lambda_mult=lam)
    m = [d.page_content for d in docs]
    q.append({"lambda": lam, "noyob": len(set(m)),
              "1-natija": m[0][:32], "3-natija": m[2][:32]})
print(pd.DataFrame(q).to_string(index=False))
```

## 🔑 **1-natija bir xil, 3-natija O'ZGARADI.** `λ=0.0` da **aloqasiz** natija chiqadi.

</details>

**M27.** ⭐ Metadata filtri.

<details>
<summary>✅ Yechim</summary>

```python
c = Counter(m.get("Lecture Title", "?") for m in vs.get()["metadatas"])
for k, v in c.items():
    print(f"  {v:3d}  {k[:56]}")

dars = list(c)[0]
docs = vs.max_marginal_relevance_search("What software do data scientists use?",
                                        k=3, filter={"Lecture Title": dars})
print(f"\nfiltr bo'yicha: {len(docs)}")
```

## 🏆 **FILTR — 10-DARSDAGI METADATA TUFAYLI ISHLAYDI.**

</details>

**M28.** ⭐⭐ Uchta `search_type` ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
q = []
for st, kw in [("similarity", {"k": 3}),
               ("mmr", {"k": 3, "lambda_mult": 0.7}),
               ("similarity_score_threshold", {"k": 3, "score_threshold": 0.3})]:
    r = vs.as_retriever(search_type=st, search_kwargs=kw)
    t0 = time.perf_counter()
    d = r.invoke(Q)
    q.append({"tur": st[:26], "topildi": len(d),
              "ms": round((time.perf_counter() - t0) * 1000)})
print(pd.DataFrame(q).to_string(index=False))
```

## 💥 **`similarity_score_threshold` 0 TA QAYTARADI** — L2 fazoda. `cos_vs` bilan sinang.

</details>

**M29.** ⭐⭐⭐ Token tejashni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")

pt = PromptTemplate.from_template(
    "Answer the following question:\n{question}\n\n"
    "To answer the question, use only the following context:\n{context}\n")
r = vs.as_retriever(search_type="mmr", search_kwargs={"k": 3, "lambda_mult": 0.7})

def format_manbali(docs):
    return "\n\n".join(
        f"[{i}] ({d.metadata.get('Lecture Title','?')[:30]})\n{d.page_content}"
        for i, d in enumerate(docs, 1))

q = []
for nom, ctx in [("xom (kursdagidek)", r),
                 ("format_docs", r | RunnableLambda(format_docs)),
                 ("manbali", r | RunnableLambda(format_manbali))]:
    out = ({"context": ctx, "question": RunnablePassthrough()} | pt).invoke(Q)
    q.append({"variant": nom, "belgi": len(out.text),
              "token": len(enc.encode(out.text))})
d = pd.DataFrame(q)
d["ortiqcha_%"] = (100 * (d.token / d.token.min() - 1)).round(1)
print(d.to_string(index=False))
```

## 💥 **XOM 417 → FMT 223 TOKEN = 46.5% ISROF** *(o'lchandi)*.

</details>

**M30.** ⭐ Kontekst byudjetini qo'ying.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken

def byudjetli(maks_token=1000, kodlash="cl100k_base"):
    enc = tiktoken.get_encoding(kodlash)
    def f(docs):
        q, jami = [], 0
        for d in docs:
            t = len(enc.encode(d.page_content))
            if jami + t > maks_token:
                break
            q.append(d.page_content); jami += t
        if len(q) < len(docs):
            print(f"⚠️ {len(docs)-len(q)} bo'lak tashlandi ({jami}/{maks_token})")
        return "\n\n".join(q)
    return f

print(len(({"context": r | RunnableLambda(byudjetli(300)),
            "question": RunnablePassthrough()} | pt).invoke(Q).text))
```

</details>

**M31.** ⭐⭐ 🇺🇿 O'zbekcha kontekst narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
o200 = tiktoken.get_encoding("o200k_base")

EN = ("Data scientists primarily use Python and R. SQL is essential for "
      "querying relational databases.")
UZ = ("Data scientistlar asosan Python va R dan foydalanadi. Relyatsion "
      "ma'lumotlar bazasini so'rovlash uchun SQL zarur.")
for nom, m in [("EN", EN), ("UZ", UZ)]:
    print(f"{nom}: {len(m):3d} belgi · cl100k {len(enc.encode(m)):3d} · "
          f"o200k {len(o200.encode(m)):3d}")
print(f"nisbat: {len(enc.encode(UZ))/len(enc.encode(EN)):.2f}×")
```

## 💥 **36-MODULDAGI 1.88× SHU YERDA HAM.** 🇺🇿 `k` ni **kamaytiring**.

</details>

**M32.** ⭐ Barqaror ID yaratuvchi.

<details>
<summary>✅ Yechim</summary>

```python
def barqaror_id(d):
    kalit = f"{d.metadata.get('source','')}|{d.page_content}"
    return hashlib.sha256(kalit.encode("utf-8")).hexdigest()[:32]

ids = [barqaror_id(d) for d in bosqich2]
print("noyob ID:", len(set(ids)), "/", len(ids))
if len(set(ids)) < len(ids):
    print("💥 DUBLIKAT BO'LAKLAR BOR")
```

</details>

**M33.** ⭐⭐ CRUD amallarini sinang.

<details>
<summary>✅ Yechim</summary>

```python
n0 = len(vs.get()["documents"])
ids = vs.add_documents([Document(page_content="sinov", metadata={"tur": "sinov"})])
print("qo'shildi:", len(vs.get()["documents"]) - n0)
print("o'qildi  :", vs.get(ids[0])["documents"])
vs.update_document(ids[0], Document(page_content="yangi", metadata={"tur": "sinov"}))
print("yangilandi:", vs.get(ids[0])["documents"])
vs.delete(ids[0])
print("o'chirildi:", len(vs.get()["documents"]) == n0)
```

</details>

**M34.** ⭐⭐ To'liq zanjirni tuzing va promptni ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
z = ({"context": r | RunnableLambda(format_docs),
      "question": RunnablePassthrough()} | pt)
out = z.invoke(Q)
print("uzunlik:", len(out.text))
print(out.text[:400])
```

## 🔑 **`Document(id=...)` KO'RSANGIZ — `format_docs` NI UNUTGANSIZ.**

</details>

---

# 🔴 QIYIN *(35–44)*

**M35.** ⭐⭐⭐ Universal yuklovchi yozing *(PDF, DOCX, TXT, MD)*.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path
from langchain_community.document_loaders import TextLoader

class UniversalYuklovchi:
    YUKLOVCHILAR = {".pdf": PyPDFLoader, ".docx": Docx2txtLoader,
                    ".txt": TextLoader, ".md": TextLoader}

    def __init__(self, tozalash=True):
        self.tozalash = tozalash
        self.xatolar = []

    def yukla(self, yol):
        p = Path(yol)
        L = self.YUKLOVCHILAR.get(p.suffix.lower())
        if L is None:
            raise ValueError(f"qo'llab-quvvatlanmaydi: {p.suffix}")
        d = L(str(p)).load()
        for x in d:
            if self.tozalash:
                x.page_content = " ".join(x.page_content.split())
            x.metadata.setdefault("source", str(p))
            x.metadata["fayl_turi"] = p.suffix.lower()
        return d

    def papka(self, papka, naqsh="*"):
        q = []
        for f in sorted(Path(papka).rglob(naqsh)):
            if f.is_file() and f.suffix.lower() in self.YUKLOVCHILAR:
                try:
                    d = self.yukla(f)
                    q.extend(d)
                    print(f"  ✅ {f.name:40s} {len(d)} hujjat")
                except Exception as e:
                    self.xatolar.append((str(f), type(e).__name__, str(e)[:60]))
                    print(f"  ❌ {f.name:40s} {type(e).__name__}")
        if self.xatolar:
            print(f"\n⚠️ {len(self.xatolar)} fayl YUKLANMADI:")
            for f, t, m in self.xatolar:
                print(f"    {Path(f).name}: {t} — {m}")
        return q
```

## 🏆 **XATOLARNI YIG'ADI, BUTUN JARAYONNI TO'XTATMAYDI.**

</details>

**M36.** ⭐⭐⭐ Bo'laklash sifatini baholovchi.

<details>
<summary>✅ Yechim</summary>

```python
def bolaklash_sifati(bolaklar, maks=500):
    uz = [len(d.page_content) for d in bolaklar]
    d = pd.Series(uz)
    print(f"bo'laklar : {len(uz)}")
    print(f"min/o'rt/max: {d.min()} / {d.mean():.0f} / {d.max()}")
    print(f"mediana   : {d.median():.0f}")

    oshgan = (d > maks).sum()
    qisqa = (d < maks * 0.2).sum()
    if oshgan:
        print(f"💥 {oshgan} bo'lak {maks} dan OSHGAN "
              f"(eng kattasi {d.max()}) — separator chegarani buzmoqda")
    if qisqa:
        print(f"⚠️ {qisqa} bo'lak JUDA QISQA (<{int(maks*0.2)}) — "
              f"qidiruvda shovqin qiladi")
    bosh = sum(1 for x in bolaklar if not x.page_content.strip())
    if bosh:
        print(f"💥 {bosh} BO'SH bo'lak")

    kalitlar = {k for x in bolaklar for k in x.metadata}
    print(f"metadata  : {sorted(kalitlar) or '⚠️ YO‘Q — filter ishlamaydi'}")
    return d.describe()
```

</details>

**M37.** ⭐⭐⭐ Chegarani o'lchab tanlang.

<details>
<summary>✅ Yechim</summary>

```python
def chegara_izla(vs, sinovlar, k=1):
    """sinovlar = [(savol, javob_bor_mi), ...]"""
    q = []
    for savol, bor in sinovlar:
        n = vs.similarity_search_with_relevance_scores(savol, k=k)
        q.append({"savol": savol[:34], "javob_bor": bor,
                  "eng_ball": round(n[0][1], 4) if n else 0.0})
    d = pd.DataFrame(q)
    print(d.to_string(index=False))

    bor = d[d.javob_bor].eng_ball
    yoq = d[~d.javob_bor].eng_ball
    print(f"\njavob BOR : {bor.min():.4f} … {bor.max():.4f}")
    print(f"javob YO'Q: {yoq.min():.4f} … {yoq.max():.4f}")
    if bor.min() > yoq.max():
        ch = (bor.min() + yoq.max()) / 2
        print(f"🏆 CHEGARA = {ch:.4f}  (oraliq {bor.min()-yoq.max():.4f})")
        return ch
    print("⚠️ ORALIQ YO'Q — embedding yoki bo'laklashni yaxshilang")
    return None

chegara_izla(cos_vs, [
    ("What programming languages do data scientists use?", True),
    ("What software do data scientists use?", True),
    ("What is analysis vs analytics?", True),
    ("What is the weather in Tashkent?", False),
    ("How do I cook pasta?", False),
    ("Who won the World Cup?", False)])
```

## 🏆 **33-MODULDAGI USUL** — to'g'ri va xato javoblar **oralig'ini** toping.

</details>

**M38.** ⭐⭐⭐ Optimal λ ni toping.

<details>
<summary>✅ Yechim</summary>

```python
def lambda_izla(vs, embedding, savollar, k=3,
                lambdalar=(0.0, 0.3, 0.5, 0.7, 1.0)):
    q = []
    for lam in lambdalar:
        noyob, moslik = [], []
        for s in savollar:
            docs = vs.max_marginal_relevance_search(s, k=k, lambda_mult=lam)
            m = [d.page_content for d in docs]
            noyob.append(len(set(m)) / max(1, len(m)))
            vq = np.array(embedding.embed_query(s))
            vq /= np.linalg.norm(vq)
            V = np.array(embedding.embed_documents(m))
            V /= np.linalg.norm(V, axis=1, keepdims=True)
            moslik.append(float((V @ vq).mean()))
        q.append({"lambda": lam, "noyoblik": round(np.mean(noyob), 3),
                  "moslik": round(np.mean(moslik), 4)})
    d = pd.DataFrame(q)
    d["ball"] = (d.moslik * d.noyoblik).round(4)
    print(d.to_string(index=False))
    print(f"\n🏆 ENG YAXSHI lambda = {d.loc[d.ball.idxmax(), 'lambda']}")
    return d
```

## 🔑 **`ball = moslik × noyoblik`** — MMR ning **ikkala maqsadi** bir raqamda.

</details>

**M39.** ⭐⭐⭐ Ko'p ijarachili xavfsiz retriever.

<details>
<summary>✅ Yechim</summary>

```python
class XavfsizRetriever:
    def __init__(self, vs, ruxsatlar, k=3, lambda_mult=0.7):
        self.vs, self.ruxsatlar = vs, ruxsatlar
        self.k, self.lm = k, lambda_mult

    def _filtr(self, u):
        b = self.ruxsatlar.get(u)
        if not b:
            raise PermissionError(f"💥 '{u}' uchun RUXSAT YO'Q")
        return {"bolim": b[0]} if len(b) == 1 else {"bolim": {"$in": b}}

    def qidir(self, u, savol):
        r = self.vs.as_retriever(
            search_type="mmr",
            search_kwargs={"k": self.k, "lambda_mult": self.lm,
                           "filter": self._filtr(u)})
        d = r.invoke(savol)
        ruxsat = set(self.ruxsatlar[u])
        for x in d:                                  # ⭐ IKKINCHI QAVAT
            if x.metadata.get("bolim") not in ruxsat:
                raise RuntimeError(f"💥 SIZIB CHIQISH: {x.metadata.get('bolim')}")
        return d
```

## 🏆 **FILTR + NATIJANI QAYTA TEKSHIRISH.** Metadata yozilmagan bo'lak filtrga **tushmasligi** mumkin.

</details>

**M40.** ⭐⭐⭐ Hujjat boshqaruvchisi *(dublikat va qisqa bo'lak tashxisi)*.

<details>
<summary>✅ Yechim</summary>

```python
class HujjatBoshqaruv:
    def __init__(self, vs):
        self.vs = vs

    @staticmethod
    def _id(d):
        return hashlib.sha256(
            f"{d.metadata.get('source','')}|{d.page_content}".encode()
        ).hexdigest()[:32]

    def qosh(self, bolaklar):
        ids = [self._id(d) for d in bolaklar]
        if len(set(ids)) < len(ids):
            print(f"⚠️ {len(ids)-len(set(ids))} DUBLIKAT — birlashtiriladi")
        self.vs.add_documents(bolaklar, ids=ids)
        return ids

    def yangila(self, manba, yangi):
        eski = self.vs.get(where={"source": manba})
        if eski["ids"]:
            self.vs.delete(ids=eski["ids"])
            print(f"  {len(eski['ids'])} eski bo'lak o'chirildi")
        self.qosh(yangi)

    def hisobot(self):
        d = self.vs.get()
        c = Counter(d["documents"])
        dub = {k: v for k, v in c.items() if v > 1}
        print(f"jami: {len(d['documents'])}")
        print(f"{'💥 ' + str(len(dub)) + ' TAKRORLANGAN matn' if dub else '✅ dublikat yo‘q'}")
        uz = [len(x) for x in d["documents"]]
        print(f"uzunlik: min {min(uz)} max {max(uz)} o'rt {sum(uz)//len(uz)}")
        q = sum(1 for x in uz if x < 100)
        if q:
            print(f"⚠️ {q} bo'lak <100 belgi — shovqin")
        return d
```

</details>

**M41.** ⭐⭐⭐ Kontekst quruvchi *(byudjet + manba + tartib)*.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken

class KontekstQuruvchi:
    def __init__(self, maks_token=3000, manba=True, tartib="markazga"):
        self.maks, self.manba, self.tartib = maks_token, manba, tartib
        self.enc = tiktoken.get_encoding("cl100k_base")
        self.oxirgi = {}

    def _tartibla(self, docs):
        if self.tartib != "markazga":
            return docs
        bosh, oxir = [], []
        for i, d in enumerate(docs):
            (bosh if i % 2 == 0 else oxir).append(d)
        return bosh + oxir[::-1]

    def __call__(self, docs):
        if not docs:
            self.oxirgi = {"bolak": 0, "token": 0}
            return "(kontekst topilmadi)"
        q, jami, tashlandi = [], 0, 0
        for d in docs:
            t = len(self.enc.encode(d.page_content))
            if jami + t > self.maks:
                tashlandi += 1
                continue
            q.append(d); jami += t
        q = self._tartibla(q)
        if self.manba:
            matn = "\n\n".join(
                f"[{i}] ({str(d.metadata.get('Lecture Title', d.metadata.get('source','?')))[:38]})"
                f"\n{d.page_content}" for i, d in enumerate(q, 1))
        else:
            matn = "\n\n".join(d.page_content for d in q)
        self.oxirgi = {"bolak": len(q), "token": jami, "tashlandi": tashlandi,
                       "byudjet_%": round(100 * jami / self.maks, 1)}
        if tashlandi:
            print(f"⚠️ {tashlandi} bo'lak byudjetga sig'madi")
        return matn

    def runnable(self):
        return RunnableLambda(self)
```

## 💥 **`byudjet_%` DOIM 95+ BO'LSA — `k` juda katta.**

</details>

**M42.** ⭐⭐⭐ Manbani qaytaruvchi zanjir.

<details>
<summary>✅ Yechim</summary>

```python
z = (RunnableParallel(context=r, question=RunnablePassthrough())
     .assign(javob=(lambda x: {"context": format_docs(x["context"]),
                               "question": x["question"]})
                   | pt | llm | StrOutputParser()))
out = z.invoke(Q)
print("JAVOB:", out["javob"][:180])
for i, d in enumerate(out["context"], 1):
    print(f"  [{i}] {d.metadata.get('Lecture Title','?')[:44]}")
```

## 🏆 **MANBASIZ RAG — ISHLAB CHIQARISHGA YAROQSIZ.**

</details>

**M43.** ⭐⭐⭐ Ikki qavatli himoyali RAG.

<details>
<summary>✅ Yechim</summary>

```python
QATTIQ = """Use ONLY the context below to answer.
If the context does not contain the answer, reply EXACTLY:
"I don't know based on the provided documents."
Cite the source number, e.g. [1].

Context:
{context}

Question: {question}
Answer:"""

def himoyalangan(vs, llm, savol, min_ball=0.3, k=3):
    n = vs.similarity_search_with_relevance_scores(savol, k=k)
    yaxshi = [(d, s) for d, s in n if s >= min_ball]
    if not yaxshi:                                    # ① CHEGARA
        return {"javob": "Hujjatlarimda javob topilmadi.",
                "himoya": "chegara",
                "eng_ball": round(max((s for _, s in n), default=0), 4)}
    kontekst = "\n\n".join(
        f"[{i}] {d.page_content}" for i, (d, _) in enumerate(yaxshi, 1))
    j = (PromptTemplate.from_template(QATTIQ) | llm | StrOutputParser()).invoke(
        {"context": kontekst, "question": savol})     # ② QATTIQ PROMPT
    return {"javob": j.strip(),
            "himoya": "prompt" if "don't know" in j.lower() else "yo'q",
            "eng_ball": round(yaxshi[0][1], 4),
            "manba": [d.metadata for d, _ in yaxshi]}
```

## 💥 **CHEGARA — MODELGA BOG'LIQ BO'LMAGAN YAGONA HIMOYA.**

</details>

**M44.** ⭐⭐⭐ 🇺🇿 To'liq o'zbekcha RAG quring va sinang.

<details>
<summary>✅ Yechim</summary>

```python
UZ = [
    Document(page_content="Muddatli depozit yillik 18% dan 22% gacha foiz "
                          "keltiradi. Minimal summa 1 000 000 so'm. "
                          "Muddat 6 oydan 36 oygacha.",
             metadata={"bolim": "depozit", "til": "uz"}),
    Document(page_content="Debet karta 3 ish kunida tayyorlanadi. Yillik "
                          "xizmat haqi 50 000 so'm.",
             metadata={"bolim": "karta", "til": "uz"}),
    Document(page_content="Iste'mol krediti 24 oygacha beriladi. Yillik "
                          "stavka 24% dan boshlanadi. Daromad spravkasi shart.",
             metadata={"bolim": "kredit", "til": "uz"}),
]
shutil.rmtree("./uz-db", ignore_errors=True)
uz_vs = Chroma.from_documents(UZ, embedding, persist_directory="./uz-db",
                              collection_metadata={"hnsw:space": "cosine"})

SAVOLLAR = [("Depozit foizi qancha?", True),
            ("Karta necha kunda tayyor?", True),
            ("Kredit stavkasi qancha?", True),
            ("Toshkentda ob-havo qanday?", False),
            ("Pizza qanday pishiriladi?", False)]

q = []
for s, bor in SAVOLLAR:
    n = uz_vs.similarity_search_with_relevance_scores(s, k=1)
    ball = n[0][1] if n else 0
    q.append({"savol": s[:30], "javob_bor": bor, "ball": round(ball, 4),
              "bolim": n[0][0].metadata["bolim"] if n else "—"})
d = pd.DataFrame(q)
print(d.to_string(index=False))

bor, yoq = d[d.javob_bor].ball, d[~d.javob_bor].ball
print(f"\nBOR : {bor.min():.4f} … {bor.max():.4f}")
print(f"YO'Q: {yoq.min():.4f} … {yoq.max():.4f}")
print("🏆 CHEGARA:", f"{(bor.min()+yoq.max())/2:.4f}"
      if bor.min() > yoq.max() else "⚠️ ORALIQ YO'Q")
```

## 🏆 **RETRIEVAL — MAHALLIY VA BEPUL.** ⚠️ **GENERATSIYA UCHUN kuchli model kerak** *(18-dars)*.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
PyPDFLoader        6 sahifa · 8 metadata     Docx2txt   1 hujjat · 1 metadata
Character(".",500) 21 bo'lak (16.5 kutilgan) Recursive  19 · max 500 · 0 oshgan
Embedding          384 o'lcham · norma 5.8556 💥 np.dot ≠ kosinus
🇺🇿 bank↔kredit    0.6898 ✅   cat↔mushuk    0.2829 💥 tillar orasi zaif
Chroma             1.1s/20 · qidiruv 11–19 ms · ballar L2 MASOFA (12–15)
Retriever          similarity 3 · mmr 3 · score_threshold 0 💥
Stuffing           xom 417 → format 223 token = 💰 46.5% tejash
Generatsiya        "ob-havo" savoliga model YOLG'ON TO'QIDI
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
