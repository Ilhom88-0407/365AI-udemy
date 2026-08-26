# 7-dars. Docx2txtLoader bilan yuklash

## 🎬 Boshlashdan oldin

> **"Xuddi shu jarayonni boshqa fayl kengaytmalariga qo'llab, bu fayllardan olinadigan turli METAMA'LUMOTNI qayd eting."**

---

## 1. ⚙️ O'rnatish

```bash
pip install docx2txt
```

---

## 2. Kod va HAQIQIY natija

```python
from langchain_community.document_loaders import Docx2txtLoader

loader_docx = Docx2txtLoader("Introduction_to_Data_and_Data_Science.docx")
pages_docx = loader_docx.load()

print("hujjatlar:", len(pages_docx))
print("metadata :", pages_docx[0].metadata)
print("uzunlik  :", len(pages_docx[0].page_content))
print("matn     :", repr(pages_docx[0].page_content[:140]))
```

```
hujjatlar: 1
metadata : {'source': '.../Introduction_to_Data_and_Data_Science.docx'}
uzunlik  : 8262
matn     : 'Analysis vs Analytics\n\nAlright! So…\nLet's discuss the not-so-obvious differences\nbetween the terms analysis and analytics.\nDue to the simila'
```

---

## 3. 💥💥 PDF va DOCX — IKKI KATTA FARQ

| | **PDF** | **DOCX** |
|---|---|---|
| Hujjatlar soni | ## **6** *(har sahifa)* | ## **1** *(butun fayl)* |
| Metadata | ## **8 maydon** | ## **1 maydon** *(faqat `source`)* |
| `page` raqami | ✅ bor | ## ❌ **yo'q** |
| Uzunlik | 1580 *(1-sahifa)* | ## **8262** *(hammasi)* |

> ## 💥 **FARQ № 1 — DOCX BITTA KATTA HUJJAT.**
>
> ```
> PDF   →  6 ta Document  →  ⭐ tabiiy bo'linish bor
> DOCX  →  1 ta Document  →  💥 bo'laklash SHART
> ```

> ## 💥💥 **FARQ № 2 — METADATA DEYARLI YO'Q.**
>
> ```
> PDF metadata : producer, creator, creationdate, author, moddate,
>                source, total_pages, page, page_label      ← 8+ maydon
> DOCX metadata: source                                      ← 1 maydon
> ```
>
> ## ⚠️ **AMALIY OQIBAT — SIZ MANBANI KO'RSATA OLMAYSIZ.**
>
> Foydalanuvchi *"bu qayerdan?"* deb so'raganda, PDF'da **sahifa raqamini** aytasiz. DOCX'da — faqat **fayl nomini**.
>
> ## ✅ **YECHIM — METADATA'NI O'ZINGIZ QO'SHING** *(10-dars: `MarkdownHeaderTextSplitter` buni **avtomatik** qiladi)*.

---

## 4. ⭐ Metadata'ni qo'lda boyitish

```python
from pathlib import Path
from datetime import datetime, timezone

def metadata_boyit(hujjatlar, qoshimcha=None):
    """Har hujjatga foydali metadata qo'shadi."""
    for i, d in enumerate(hujjatlar):
        p = Path(d.metadata.get("source", ""))
        d.metadata.update({
            "fayl_nomi": p.name,
            "kengaytma": p.suffix,
            "indeks": i,
            "belgilar": len(d.page_content),
            "yuklangan": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            **(qoshimcha or {})})
    return hujjatlar

pages_docx = metadata_boyit(pages_docx, {"bolim": "data-science",
                                         "til": "en", "versiya": "1.0"})
print(pages_docx[0].metadata)
```

> ## 🏆 **NIMA UCHUN BU MUHIM?**
> ```
> ① MANBA ko'rsatish       →  "bu javob X faylidan"
> ② FILTRLASH              →  faqat 2024-yilgi hujjatlardan qidir (15-dars)
> ③ YANGILASH              →  eski versiyani topib O'CHIRISH
> ④ 🇺🇿 TIL bo'yicha ajratish →  o'zbekcha savol → o'zbekcha hujjatlar
> ```
>
> ## 💡 **④ — 4-DARSDAGI TOPILMAMIZ TUFAYLI:** `cat ↔ mushuk` = **0.2829** *(zaif)*. Tillarni **metadata bilan ajrating**.

---

## 5. ⭐ Boshqa yuklovchilar

```python
from langchain_community.document_loaders import (
    TextLoader,          # .txt
    CSVLoader,           # .csv — har QATOR bitta Document
    JSONLoader,          # .json
    UnstructuredHTMLLoader,
    UnstructuredExcelLoader,
    DirectoryLoader,     # ⭐ butun PAPKA
)

# ⭐ Butun papkani yuklash
from langchain_community.document_loaders import DirectoryLoader
hammasi = DirectoryLoader("./hujjatlar", glob="**/*.docx",
                          loader_cls=Docx2txtLoader).load()
```

> ## ⚠️ **`TextLoader` UCHUN `encoding="utf-8"` SHART** — Windowsda standart `cp1251` va o'zbekcha matn **buziladi** *(37-modul)*.
> ```python
> TextLoader("fayl.txt", encoding="utf-8").load()
> ```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `Docx2txtLoader` nechta hujjat qaytaradi?

**M2.** DOCX metadatasida nechta maydon bor?

**M3.** `TextLoader` uchun nima shart?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Bitta** — butun fayl.

**M2.** ## **Bitta** — faqat `source`. PDF'da **8+**.

**M3.** ## `encoding="utf-8"` — usiz o'zbekcha matn **buziladi**.

</details>

### 🟡 O'rta

**M4.** ⭐ PDF va DOCX ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
import pandas as pd

p = PyPDFLoader("hujjat.pdf").load()
d = Docx2txtLoader("hujjat.docx").load()

print(pd.DataFrame([
    {"format": "PDF", "hujjatlar": len(p),
     "metadata": len(p[0].metadata),
     "jami_belgi": sum(len(x.page_content) for x in p),
     "maydonlar": ", ".join(list(p[0].metadata)[:4])},
    {"format": "DOCX", "hujjatlar": len(d),
     "metadata": len(d[0].metadata),
     "jami_belgi": sum(len(x.page_content) for x in d),
     "maydonlar": ", ".join(list(d[0].metadata)[:4])},
]).to_string(index=False))
```

</details>

**M5.** ⭐ Metadata boyituvchini yozing.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path
from datetime import datetime, timezone

def metadata_boyit(hujjatlar, **qoshimcha):
    for i, d in enumerate(hujjatlar):
        p = Path(d.metadata.get("source", ""))
        d.metadata.update({"fayl_nomi": p.name, "kengaytma": p.suffix,
                           "indeks": i, "belgilar": len(d.page_content),
                           "yuklangan": datetime.now(timezone.utc)
                                        .isoformat(timespec="seconds"),
                           **qoshimcha})
    return hujjatlar
```

</details>

**M6.** ⭐ Butun papkani yuklang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_community.document_loaders import DirectoryLoader, Docx2txtLoader

docs = DirectoryLoader("./hujjatlar", glob="**/*.docx",
                       loader_cls=Docx2txtLoader,
                       show_progress=True).load()
print(f"{len(docs)} hujjat yuklandi")
for d in docs[:3]:
    print(f"  {Path(d.metadata['source']).name}  {len(d.page_content)} belgi")
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Universal yuklovchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path

class UniversalYuklovchi:
    """Kengaytmaga qarab mos yuklovchini tanlaydi va metadatani boyitadi."""

    YUKLOVCHILAR = {
        ".pdf":  ("langchain_community.document_loaders", "PyPDFLoader", {}),
        ".docx": ("langchain_community.document_loaders", "Docx2txtLoader", {}),
        ".txt":  ("langchain_community.document_loaders", "TextLoader",
                  {"encoding": "utf-8"}),
        ".md":   ("langchain_community.document_loaders", "TextLoader",
                  {"encoding": "utf-8"}),
        ".csv":  ("langchain_community.document_loaders", "CSVLoader",
                  {"encoding": "utf-8"}),
    }

    def __init__(self, tozala=True, min_uzunlik=50):
        self.tozala, self.min_uzunlik = tozala, min_uzunlik
        self.hisobot = []

    def yukla(self, yol, **meta):
        p = Path(yol)
        k = p.suffix.lower()
        if k not in self.YUKLOVCHILAR:
            self.hisobot.append({"fayl": p.name, "holat": "❌ qo'llab-quvvatlanmaydi"})
            return []
        mod, sinf, kw = self.YUKLOVCHILAR[k]
        try:
            L = getattr(__import__(mod, fromlist=[sinf]), sinf)
            docs = L(str(p), **kw).load()
        except Exception as e:
            self.hisobot.append({"fayl": p.name,
                                 "holat": f"❌ {type(e).__name__}"})
            return []

        if self.tozala:
            for d in docs:
                d.page_content = " ".join(d.page_content.split())

        bosh = sum(1 for d in docs if len(d.page_content) < self.min_uzunlik)
        for i, d in enumerate(docs):
            d.metadata.update({"fayl_nomi": p.name, "kengaytma": k,
                               "indeks": i, **meta})

        self.hisobot.append({
            "fayl": p.name, "hujjatlar": len(docs),
            "belgilar": sum(len(d.page_content) for d in docs),
            "bosh": bosh,
            "holat": "⚠️ bo'sh sahifalar" if bosh else "✅"})
        return docs

    def papka(self, papka, naqsh="**/*", **meta):
        hammasi = []
        for f in sorted(Path(papka).glob(naqsh)):
            if f.is_file():
                hammasi += self.yukla(f, **meta)
        return hammasi

    def hisobot_chiqar(self):
        import pandas as pd
        d = pd.DataFrame(self.hisobot)
        print(d.to_string(index=False))
        if "bosh" in d and d.bosh.sum():
            print(f"\n💥 {int(d.bosh.sum())} ta BO'SH hujjat — "
                  f"skanerlangan PDF bo'lishi mumkin")
        return d

u = UniversalYuklovchi()
docs = u.papka("./hujjatlar", "**/*", bolim="bank", til="uz")
u.hisobot_chiqar()
```

## 🏆 **`bosh` USTUNI — ENG MUHIM SIGNAL.** U **jim** yuklanmagan fayllarni **fosh qiladi**.

</details>

---

## 📌 Xulosa

```python
pages = Docx2txtLoader("fayl.docx").load()      # BITTA Document
```

| | PDF | DOCX |
|---|---|---|
| Hujjatlar | ## **6** | ## **1** |
| Metadata | ## **8+** maydon | ## **1** maydon |
| `page` | ✅ | ## ❌ |

> ## 🏆 **METADATA'NI O'ZINGIZ BOYITING** — manba ko'rsatish, filtrlash, yangilash va 🇺🇿 **til bo'yicha ajratish** uchun.

---

⬅️ [6-dars. PyPDFLoader](06-Loading-PyPDFLoader.md) · 🏠 [Modul boshiga](README.md) · ➡️ [8-dars. CharacterTextSplitter nazariyasi](08-Character-Text-Splitter-Theory.md)
