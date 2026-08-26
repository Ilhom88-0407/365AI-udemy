# 6-dars. PyPDFLoader bilan yuklash ⭐

## 🎬 Boshlashdan oldin

> **"PDF formatidagi matn faylini qanday yuklashni ko'rsatamiz."**

---

## 1. ⚙️ O'rnatish

```bash
pip install langchain-community pypdf
```

> ## ⚠️ **`pypdf` — ALOHIDA paket.** Usiz `PyPDFLoader` **ImportError** beradi.

---

## 2. Kod va HAQIQIY natija

```python
from langchain_community.document_loaders import PyPDFLoader
import copy

loader_pdf = PyPDFLoader("Introduction_to_Data_and_Data_Science.pdf")
pages_pdf = loader_pdf.load()

print("sahifalar:", len(pages_pdf))
print("metadata :", pages_pdf[0].metadata)
print("xom matn :", repr(pages_pdf[0].page_content[:150]))
```

```
sahifalar: 6
metadata : {'producer': 'Microsoft® Word for Microsoft 365',
            'creator': 'Microsoft® Word for Microsoft 365',
            'creationdate': '2023-11-09T10:16:34+02:00',
            'author': 'Hristina  Hristova',
            'moddate': '2023-11-09T10:16:34+02:00',
            'source': '.../Introduction_to_Data_and_Data_Science.pdf',
            'total_pages': 6, 'page': 0, 'page_label': '1'}
xom matn : 'Analysis vs Analytics \nAlright! So… \nLet's discuss the not-so-obvious differences \nbetween the terms analysis and analytics. \nDue to the similarity of'
```

> ## ⭐ **HAR SAHIFA — ALOHIDA `Document`.** 6 sahifa → **6 ta hujjat**.
>
> ## 💡 **METADATA BOY:** `page`, `total_pages`, `source`, `author`, `creationdate`. Bularni **filtr** uchun ishlatish mumkin *(15-dars)*.

---

## 3. ⭐ Bo'sh qatorlarni tozalash

> **"Har bir matn ustidan ishlab, `page_content` ni tozalaymiz."**

```python
pages_pdf_cut = copy.deepcopy(pages_pdf)          # ⭐ deepcopy — aslini SAQLAB
for i in pages_pdf_cut:
    i.page_content = " ".join(i.page_content.split())

print("tozalangan:", repr(pages_pdf_cut[0].page_content[:150]))
print("uzunlik   :", len(pages_pdf[0].page_content), "→",
      len(pages_pdf_cut[0].page_content))
```

```
tozalangan: 'Analysis vs Analytics Alright! So… Let's discuss the not-so-obvious differences between the terms analysis and analytics. Due to the similarity of the'
uzunlik   : 1580 → 1541
```

> ## ✅ **39 BELGI TEJANDI** *(2.5%)*. Kichik, lekin:
> ```
> ① Token tejash          →  har bo'lakda bir necha token
> ② ⭐ SIFAT               →  \n\n bo'laklashni buzadi
> ③ Embedding tozaroq     →  ortiqcha belgi shovqin
> ```
>
> ## 💡 **`copy.deepcopy` — MUHIM.** Usiz asl hujjatlar **o'zgaradi** va siz **taqqoslay olmaysiz**.

> ## ⚠️⚠️ **LEKIN BU TOZALASH BIR NARSANI YO'QOTADI — PARAGRAF CHEGARALARINI.**
>
> ```
> "matn1\n\nmatn2"  →  "matn1 matn2"
>          ↑ paragraf chegarasi YO'QOLDI
> ```
> ## ✅ **YUMSHOQROQ MUQOBIL:**
> ```python
> import re
> # Faqat 3+ bo'sh qatorni 2 taga qisqartiradi, paragraflarni SAQLAYDI
> matn = re.sub(r"\n{3,}", "\n\n", matn)
> matn = re.sub(r"[ \t]+", " ", matn)
> ```

---

## 4. ⚠️⚠️ PDF — ENG QIYIN FORMAT

Kurs bitta **oddiy** PDF bilan ishlaydi. Amalda:

```
✅ Oddiy matnli PDF (Word'dan)   →  yaxshi ishlaydi     ← kursdagi holat
⚠️ IKKI USTUNLI PDF              →  matn ARALASHIB ketadi
⚠️ JADVALLI PDF                  →  struktura YO'QOLADI
❌ SKANERLANGAN PDF              →  MATN YO'Q (OCR kerak)
❌ Rasmdagi matn                 →  o'qilmaydi
```

> ## ✅ **DOIM TEKSHIRING — KO'ZINGIZ BILAN:**
> ```python
> for i, d in enumerate(pages_pdf[:3]):
>     print(f"\n--- sahifa {i} ({len(d.page_content)} belgi) ---")
>     print(d.page_content[:300])
> ```
>
> ## 💥 **`PyPDFLoader` XATO BERMAYDI.** U skanerlangan PDF uchun **bo'sh matn** qaytaradi — va siz buni **bilmay qolasiz**.

### ✅ Bo'sh sahifalarni aniqlash

```python
def pdf_tekshir(sahifalar, min_uzunlik=50):
    bosh = [i for i, d in enumerate(sahifalar)
            if len(d.page_content.strip()) < min_uzunlik]
    if bosh:
        print(f"💥 {len(bosh)}/{len(sahifalar)} sahifa BO'SH yoki juda qisqa: {bosh}")
        print("   → skanerlangan PDF bo'lishi mumkin, OCR kerak")
    else:
        print(f"✅ {len(sahifalar)} sahifa, hammasida matn bor")
    uz = [len(d.page_content) for d in sahifalar]
    print(f"   uzunliklar: min {min(uz)}  max {max(uz)}  "
          f"o'rtacha {sum(uz)//len(uz)}")
    return bosh

pdf_tekshir(pages_pdf)
```

---

## 5. ⭐ Boshqa PDF yuklovchilar — kursda YO'Q

| Yuklovchi | Kuchli tomoni |
|---|---|
| `PyPDFLoader` | ## Sodda, tez *(kursdagi)* |
| `PyMuPDFLoader` | ## **Tezroq**, sifatliroq matn |
| `PDFPlumberLoader` | ## **Jadvallarni** yaxshiroq oladi |
| `UnstructuredPDFLoader` | Murakkab layout, rasm |
| `PyPDFium2Loader` | Tez, ishonchli |

```python
# pip install pymupdf
from langchain_community.document_loaders import PyMuPDFLoader
p = PyMuPDFLoader("hisobot.pdf").load()
```

> ## 💡 **PDF SIFATI MUAMMO BO'LSA — BOSHQA YUKLOVCHINI SINANG.** Ular **turlicha** natija beradi.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `PyPDFLoader` nechta `Document` qaytaradi?

**M2.** `deepcopy` nima uchun?

**M3.** Skanerlangan PDF bilan nima bo'ladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Har sahifa uchun bitta** — 6 sahifa → **6 ta hujjat**.

**M2.** Asl hujjatlarni **saqlab qolish** — tozalangani bilan **taqqoslash** uchun.

**M3.** ## **Bo'sh matn** qaytadi — va **xato chiqmaydi**. OCR kerak.

</details>

### 🟡 O'rta

**M4.** ⭐ PDF ni yuklab, metadatani ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_community.document_loaders import PyPDFLoader
import pandas as pd

pages = PyPDFLoader("hujjat.pdf").load()
d = pd.DataFrame([{"sahifa": p.metadata.get("page"),
                   "belgilar": len(p.page_content),
                   "so'zlar": len(p.page_content.split()),
                   "boshi": p.page_content[:36].replace("\n", " ")}
                  for p in pages])
print(d.to_string(index=False))
```

</details>

**M5.** ⭐⭐ Bo'sh sahifalarni aniqlovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
def pdf_tekshir(sahifalar, min_uzunlik=50):
    bosh = [i for i, x in enumerate(sahifalar)
            if len(x.page_content.strip()) < min_uzunlik]
    uz = [len(x.page_content) for x in sahifalar]
    if bosh:
        print(f"💥 {len(bosh)}/{len(sahifalar)} sahifa BO'SH: {bosh}")
        print("   → skanerlangan PDF? OCR kerak")
    else:
        print(f"✅ {len(sahifalar)} sahifa — hammasida matn bor")
    print(f"   min {min(uz)}  max {max(uz)}  o'rtacha {sum(uz)//len(uz)}")
    return bosh
```

## 🏆 **HAR PDF NI YUKLAGANDA SHUNI ISHGA TUSHIRING.**

</details>

**M6.** ⭐ Yumshoq tozalashni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import re, copy

def qattiq(s):
    return " ".join(s.split())

def yumshoq(s):
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r"[ \t]+", " ", s)
    return s.strip()

asl = pages_pdf[0].page_content
print(f"asl     : {len(asl):5d}  paragraflar: {asl.count(chr(10)+chr(10))}")
print(f"qattiq  : {len(qattiq(asl)):5d}  paragraflar: {qattiq(asl).count(chr(10)+chr(10))}")
print(f"yumshoq : {len(yumshoq(asl)):5d}  paragraflar: {yumshoq(asl).count(chr(10)+chr(10))}")
```

## 🔑 **`qattiq` PARAGRAF CHEGARALARINI YO'QOTADI** — bu bo'laklashga **ta'sir qiladi**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Bir necha yuklovchini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import time, pandas as pd

YUKLOVCHILAR = {}
for nom, yol in [("PyPDF", "langchain_community.document_loaders.PyPDFLoader"),
                 ("PyMuPDF", "langchain_community.document_loaders.PyMuPDFLoader"),
                 ("PDFPlumber", "langchain_community.document_loaders.PDFPlumberLoader")]:
    try:
        mod, sinf = yol.rsplit(".", 1)
        YUKLOVCHILAR[nom] = getattr(__import__(mod, fromlist=[sinf]), sinf)
    except Exception:
        print(f"⚠️ {nom} mavjud emas")

q = []
for nom, L in YUKLOVCHILAR.items():
    try:
        t0 = time.perf_counter()
        p = L("hujjat.pdf").load()
        q.append({"yuklovchi": nom, "hujjatlar": len(p),
                  "belgilar": sum(len(x.page_content) for x in p),
                  "soniya": round(time.perf_counter() - t0, 2),
                  "metadata": len(p[0].metadata)})
    except Exception as e:
        q.append({"yuklovchi": nom, "xato": type(e).__name__})
print(pd.DataFrame(q).to_string(index=False))
```

## 🔑 **`belgilar` USTUNI — ENG MUHIMI.** Kam belgi = **matn yo'qolgan**.

</details>

---

## 📌 Xulosa

```python
pages = PyPDFLoader("fayl.pdf").load()        # har SAHIFA — bitta Document
for p in pages:
    p.page_content = " ".join(p.page_content.split())     # tozalash
```

```
✅ 6 sahifa → 6 Document · metadata boy (page, source, author, ...)
✅ tozalash: 1580 → 1541 belgi
⚠️ qattiq tozalash PARAGRAF chegaralarini yo'qotadi
💥 skanerlangan PDF → BO'SH matn, XATO YO'Q  →  DOIM tekshiring
```

---

⬅️ [5-dars. Saqlash va retrieval](05-Storing-Retrieval-Generation.md) · 🏠 [Modul boshiga](README.md) · ➡️ [7-dars. Docx2txtLoader](07-Loading-Docx2txtLoader.md)
