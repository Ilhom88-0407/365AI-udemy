# 12-dars. Chroma vectorstore yaratish ⭐

## 🎬 Boshlashdan oldin

> **"`vectorstore = Chroma.from_documents(documents=..., embedding=..., persist_directory=...)`"**

---

## 1. ⚠️ AVVAL — import o'zgargan

```python
# KURSDAGI KOD
from langchain_community.vectorstores import Chroma        # ⚠️ eskirgan
```

```python
# ✅ ZAMONAVIY
from langchain_chroma import Chroma                        # ⭐ alohida paket
```

```bash
pip install langchain-chroma
```

> ## 💡 **KURSNING IMPORTI HALI ISHLAYDI**, lekin **eskirish ogohlantirishi** beradi. Yangi paket **faolroq** yangilanadi.

---

## 2. Kod va HAQIQIY natija

```python
from langchain_chroma import Chroma
import time

t0 = time.perf_counter()
vectorstore = Chroma.from_documents(
    documents=pages_char_split,
    embedding=embedding,
    persist_directory="./intro-to-ds-lectures")

print(f"indekslash: {time.perf_counter()-t0:.1f}s")
print("hujjatlar :", len(vectorstore.get()["documents"]))
```

```
indekslash: 1.1s
hujjatlar : 20
```

> ## ⚡ **20 ta bo'lak — 1.1 SONIYA** *(mahalliy embedding bilan)*. Indekslash **tez va arzon**.

---

## 3. Diskdan qayta yuklash

```python
vectorstore_from_directory = Chroma(
    persist_directory="./intro-to-ds-lectures",
    embedding_function=embedding)          # ⚠️ embedding EMAS, embedding_function
```

> ## 💥💥 **ENG KO'P UCHRAYDIGAN XATO — PARAMETR NOMI BOSHQACHA:**
> ```
> Chroma.from_documents(...)  →  embedding=
> Chroma(...)                 →  embedding_function=      ⚠️
> ```
> Bu — **noqulay**, lekin shunday.

> ## ⚠️⚠️ **VA ENG XAVFLI TUZOQ — EMBEDDING MODELI BIR XIL BO'LISHI SHART.**
> ```
> Indekslashda  :  paraphrase-multilingual-MiniLM-L12-v2   (384 o'lcham)
> Yuklashda     :  text-embedding-3-small                   (1536 o'lcham)
>                  →  💥 o'lchamlar MOS KELMAYDI
> ```
> Yaxshi holatda — **xato**. Yomon holatda — **ma'nosiz natijalar**, **xatosiz**.
>
> ## ✅ **YECHIM — MODEL NOMINI METADATA'GA YOZING:**
> ```python
> import json
> from pathlib import Path
> Path("./intro-to-ds-lectures/embedding.json").write_text(
>     json.dumps({"model": "paraphrase-multilingual-MiniLM-L12-v2",
>                 "o'lcham": 384}), encoding="utf-8")
> ```

---

## 4. ⚠️ `persist_directory` bo'lmasa

```python
vs = Chroma.from_documents(documents=docs, embedding=embedding)   # yo'l YO'Q
```

> ## 💥 **BAZA FAQAT XOTIRADA** — dastur tugagach **yo'qoladi**.
>
> ## ✅ **Sinov uchun qulay, ishlab chiqarish uchun — `persist_directory` SHART.**

---

## 5. ⭐ Katta hajmda — batch bilan

```python
def katta_indekslash(hujjatlar, embedding, yol, batch=500):
    """Ko'p hujjatni bo'lib-bo'lib indekslaydi."""
    from langchain_chroma import Chroma
    import time

    vs = Chroma(persist_directory=yol, embedding_function=embedding)
    t0 = time.perf_counter()
    for i in range(0, len(hujjatlar), batch):
        b = hujjatlar[i:i + batch]
        vs.add_documents(b)
        print(f"  {i + len(b)}/{len(hujjatlar)}  "
              f"({time.perf_counter()-t0:.0f}s)")
    print(f"✅ {len(vs.get()['documents'])} hujjat, "
          f"{time.perf_counter()-t0:.1f}s")
    return vs
```

> ## 💡 **NIMA UCHUN BATCH?**
> ```
> ① Xotira        →  100 000 hujjatni birdan embedding qilish RAM ni to'ldiradi
> ② Progress      →  qancha qolganini KO'RASIZ
> ③ Xato holati   →  hammasi emas, bitta batch yo'qoladi
> ```

---

## 6. 🇺🇿 Ma'lumot qayerda saqlanadi?

```python
from pathlib import Path
for f in sorted(Path("./intro-to-ds-lectures").rglob("*")):
    if f.is_file():
        print(f"  {f.relative_to('.')}  {f.stat().st_size/1024:.0f} KB")
```

> ## ✅ **CHROMA — MAHALLIY FAYL BAZASI.** Hech qanday serverga **ulanmaydi**.
>
> ## 🏆 **MAHALLIY EMBEDDING + CHROMA = MA'LUMOT UMUMAN CHIQMAYDI.**
> ```
> Hujjat  →  mahalliy embedding  →  mahalliy Chroma
>            (kompyuteringizda)      (kompyuteringizda)
> ```
> ## 💡 **35-modul, 2-darsdagi "ma'lumot suvereniteti" muammosining TO'LIQ yechimi** — bank, tibbiy va davlat loyihalari uchun.
>
> ## ⚠️ **FAQAT LLM CHAQIRUVI QOLADI** — u uchun ham **Ollama** *(37-modul)*.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Chroma qayerda saqlaydi?

**M2.** `persist_directory` bo'lmasa nima bo'ladi?

**M3.** Qayta yuklashda parametr nomi qanday?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Mahalliy faylda** — hech qanday serverga ulanmaydi.

**M2.** ## Baza **faqat xotirada** — dastur tugagach **yo'qoladi**.

**M3.** ## `embedding_function=` *(`from_documents` da esa `embedding=`)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Vectorstore yarating va tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_chroma import Chroma
import time, shutil

shutil.rmtree("./test-db", ignore_errors=True)
t0 = time.perf_counter()
vs = Chroma.from_documents(documents=pages_char_split, embedding=embedding,
                           persist_directory="./test-db")
print(f"indekslash: {time.perf_counter()-t0:.1f}s")

d = vs.get()
print("hujjatlar:", len(d["documents"]))
print("kalitlar :", list(d))
print("metadata :", d["metadatas"][0])
```

</details>

**M5.** ⭐ Diskdan qayta yuklang.

<details>
<summary>✅ Yechim</summary>

```python
vs2 = Chroma(persist_directory="./test-db", embedding_function=embedding)
print("qayta yuklandi:", len(vs2.get()["documents"]))
print("✅ bir xil:", len(vs.get()["documents"]) == len(vs2.get()["documents"]))
```

</details>

**M6.** ⭐ Baza hajmini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path

def baza_hajmi(yol):
    fayllar = [f for f in Path(yol).rglob("*") if f.is_file()]
    jami = sum(f.stat().st_size for f in fayllar)
    for f in sorted(fayllar, key=lambda x: -x.stat().st_size)[:5]:
        print(f"  {f.name:36s} {f.stat().st_size/1024:8.0f} KB")
    print(f"JAMI: {jami/1024/1024:.2f} MB")
    return jami

baza_hajmi("./test-db")
```

## 💡 **HUJJAT SONI × O'LCHAM × 4 BAYT ≈ VEKTORLAR HAJMI.** 20 × 384 × 4 ≈ 30 KB.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Embedding mosligini tekshiruvchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
import json
from pathlib import Path

def baza_yarat(hujjatlar, embedding, yol, model_nomi):
    """Baza yaratadi va embedding modelini QAYD QILADI."""
    vs = Chroma.from_documents(documents=hujjatlar, embedding=embedding,
                               persist_directory=yol)
    (Path(yol) / "embedding.json").write_text(
        json.dumps({"model": model_nomi,
                    "olcham": len(embedding.embed_query("x"))},
                   ensure_ascii=False), encoding="utf-8")
    return vs


def baza_yukla(embedding, yol, model_nomi):
    """Yuklashdan OLDIN embedding modelini TEKSHIRADI."""
    m = Path(yol) / "embedding.json"
    if m.exists():
        saqlangan = json.loads(m.read_text(encoding="utf-8"))
        hozirgi_olcham = len(embedding.embed_query("x"))
        if saqlangan["model"] != model_nomi:
            raise RuntimeError(
                f"💥 EMBEDDING MODELI MOS EMAS!\n"
                f"   baza  : {saqlangan['model']} ({saqlangan['olcham']})\n"
                f"   hozir : {model_nomi} ({hozirgi_olcham})\n"
                f"   → bazani QAYTA indekslang")
        print(f"✅ embedding mos: {model_nomi}")
    else:
        print("⚠️ embedding.json yo'q — moslikni tekshirib bo'lmadi")
    return Chroma(persist_directory=yol, embedding_function=embedding)
```

## 🏆 **BU TEKSHIRUV SOATLAB NOSOZLIK TUZATISHDAN QUTQARADI.**

## 💥 **NOTO'G'RI EMBEDDING — JIM XATO:** natijalar **ma'nosiz** bo'ladi, lekin **xato chiqmaydi**.

</details>

---

## 📌 Xulosa

```python
from langchain_chroma import Chroma          # ⚠️ langchain_community EMAS

vs = Chroma.from_documents(documents=..., embedding=...,        # embedding=
                           persist_directory="./db")

vs = Chroma(persist_directory="./db",
            embedding_function=embedding)                        # ⚠️ boshqa nom!
```

```
✅ 20 bo'lak → 1.1s (mahalliy embedding)
💥 embedding modeli BOSHQACHA bo'lsa — jim ma'nosiz natijalar
🇺🇿 Mahalliy embedding + Chroma = ma'lumot UMUMAN CHIQMAYDI
```

---

⬅️ [11-dars. Embedding](11-Text-Embedding.md) · 🏠 [Modul boshiga](README.md) · ➡️ [13-dars. Hujjatlarni boshqarish](13-Managing-Documents.md)
