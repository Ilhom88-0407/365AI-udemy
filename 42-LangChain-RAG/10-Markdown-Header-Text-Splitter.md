# 10-dars. MarkdownHeaderTextSplitter ⭐⭐

## 🎬 Boshlashdan oldin

> ## ⭐⭐ **BU — MODULNING ENG QIMMATLI TEXNIK G'OYASI.**
>
> `CharacterTextSplitter` matnni **ko'r-ko'rona** kesadi. `MarkdownHeaderTextSplitter` esa **strukturani hurmat qiladi** — va **metadata qo'shadi**.

---

## 1. Kod va HAQIQIY natija

```python
from langchain_community.document_loaders import Docx2txtLoader
from langchain_text_splitters.markdown import MarkdownHeaderTextSplitter

pages = Docx2txtLoader("Introduction_to_Data_and_Data_Science_2.docx").load()
print("uzunlik:", len(pages[0].page_content))
print("boshi  :", repr(pages[0].page_content[:120]))
```

```
uzunlik: 8309
boshi  : '# Introduction to Data and Data Science\n\n## Analysis vs Analytics\n\nAlright! So…\nLet's discuss the not-so-obvious differe'
```

> ## 🔑 **E'TIBOR BERING — DOCX ICHIDA `#` VA `##` BOR.** Bu — **ataylab tayyorlangan** fayl.

```python
md_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "Course Title"),
                         ("##", "Lecture Title")])
pages_md_split = md_splitter.split_text(pages[0].page_content)

print("md bo'laklar:", len(pages_md_split))
for d in pages_md_split[:3]:
    print("  ", d.metadata, "|", d.page_content[:60].replace("\n", " "))
```

```
md bo'laklar: 2
   {'Course Title': 'Introduction to Data and Data Science',
    'Lecture Title': 'Analysis vs Analytics'} | Alright! So… Let's discuss ...
   {'Course Title': 'Introduction to Data and Data Science',
    'Lecture Title': 'Programming Languages & Software Employed in Data Science
    - All the Tools You Need'} | Alright! So… How are the techniques ...
```

---

## 2. 🏆 ENG MUHIM QISM — METADATA AVTOMATIK QO'SHILDI

```
CharacterTextSplitter  →  metadata: {'source': 'fayl.docx'}
MarkdownHeaderSplitter →  metadata: {'source': ...,
                                      'Course Title': '...',
                                      'Lecture Title': '...'}   ⭐
```

> ## 🏆 **VA BU UCHTA IMKONIYAT BERADI:**
> ```
> ① MANBA KO'RSATISH  →  "bu javob 'Analysis vs Analytics' darsidan"
> ② FILTRLASH         →  faqat ma'lum darsdan qidirish (15-dars)
> ③ GURUHLASH         →  bir darsdagi bo'laklarni birlashtirish
> ```
>
> ## 💡 **7-DARSDA KO'RGAN EDIK:** DOCX metadatasida **faqat `source`** bor edi. Bu splitter uni **boyitadi**.

---

## 3. ⭐ Ikki bosqichli bo'laklash — TO'G'RI naqsh

Markdown bo'laklar **juda katta** *(8309 / 2 ≈ 4150 belgi)*. Ularni **yana** bo'lish kerak:

```python
for i in range(len(pages_md_split)):
    pages_md_split[i].page_content = " ".join(pages_md_split[i].page_content.split())

char_splitter = CharacterTextSplitter(separator=".", chunk_size=500,
                                      chunk_overlap=50)
pages_char_split = char_splitter.split_documents(pages_md_split)

print("yakuniy bo'laklar:", len(pages_char_split))
uz = [len(d.page_content) for d in pages_char_split]
print(f"uzunliklar: min {min(uz)} max {max(uz)} o'rtacha {np.mean(uz):.0f}")
```

```
yakuniy bo'laklar: 20
uzunliklar: min 184 max 493 o'rtacha 406
```

> ## 🏆 **VA ENG MUHIMI — METADATA SAQLANIB QOLDI.**
>
> `split_documents` **har bo'lakka** ota-hujjatning metadatasini **ko'chiradi**. Ya'ni 20 ta bo'lakning **hammasida** `Lecture Title` bor.

```
① MarkdownHeaderTextSplitter  →  2 ta katta bo'lak + METADATA
② CharacterTextSplitter        →  20 ta kichik bo'lak, metadata SAQLANDI
```

> ## 🔑 **BU NAQSHNI YODLANG:**
> ```
> STRUKTURA bo'yicha bo'l  →  metadata oling
>          ↓
> HAJM bo'yicha bo'l       →  metadata SAQLANADI
> ```

---

## 4. ⚠️ Cheklovi — Markdown SARLAVHALARI KERAK

```
✅ Markdown fayl (.md)              →  tabiiy ishlaydi
✅ Ataylab tayyorlangan DOCX        →  kursdagi holat
❌ Oddiy DOCX / PDF                 →  sarlavhalar YO'Q  →  bitta bo'lak
```

> ## 💥 **KURS "SEHRLI" DOCX'DAN FOYDALANADI** — unda `#` va `##` **oldindan qo'yilgan**. Sizning haqiqiy fayllaringizda ular **bo'lmaydi**.

### ✅ Uchta yechim

```python
# ① DOCX/PDF ni Markdown'ga aylantirish
#    pip install markitdown    (Microsoft)
from markitdown import MarkItDown
md_matn = MarkItDown().convert("hisobot.docx").text_content

# ② Sarlavhalarni EVRISTIKA bilan topish
import re
def sarlavhalarni_belgila(matn):
    """Qisqa, nuqtasiz, katta harfli qatorlarni sarlavha deb belgilaydi."""
    natija = []
    for q in matn.split("\n"):
        s = q.strip()
        if s and len(s) < 80 and not s.endswith((".", "!", "?")) and s[0].isupper():
            natija.append(f"## {s}")
        else:
            natija.append(q)
    return "\n".join(natija)

# ③ ⭐ ENG ISHONCHLI — metadata'ni QO'LDA berish
#    (7-dars: metadata_boyit funksiyasi)
```

> ## ⚠️ **② EVRISTIKA — EHTIYOT BO'LING.** U ba'zi oddiy jumlalarni ham sarlavha deb belgilashi mumkin. **Natijani tekshiring.**

---

## 5. ⭐ `strip_headers` parametri

```python
md = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "Course"), ("##", "Lecture")],
    strip_headers=False)          # ⭐ sarlavha MATNDA ham qoladi
```

> ## 💡 **QACHON `strip_headers=False` KERAK?**
> ```
> Sarlavha MATNDA ham bo'lsa  →  embedding uni HISOBGA OLADI
>                              →  qidiruv YAXSHILANISHI mumkin
> ```
> ## 🔑 **VA BU BEPUL YAXSHILANISH** — sinab ko'ring, **o'lchang**.

---

## 6. 🇺🇿 O'zbekcha hujjatlar uchun

```python
UZ_HUJJAT = """
# Bank xizmatlari qo'llanmasi

## Depozitlar
Muddatli depozit yillik 18% dan 22% gacha foiz keltiradi.
Minimal summa 1 000 000 so'm. Muddati 6 oydan 36 oygacha.

## Kartalar
Debet karta 3 ish kunida tayyorlanadi. Yillik xizmat haqi 50 000 so'm.

## Kreditlar
Iste'mol krediti 24 oygacha beriladi. Yillik stavka 24% dan boshlanadi.
"""

md = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "Hujjat"), ("##", "Bolim")])
b = md.split_text(UZ_HUJJAT)
for d in b:
    print(f"  {d.metadata}  →  {d.page_content[:50]}")
```

> ## 🏆 **HAR BO'LAKDA `Bolim` METADATASI BOR** — endi *"depozit foizi qancha?"* savoli uchun **faqat `Bolim="Depozitlar"`** bo'laklarini qidirish mumkin.
>
> ## ⚠️ **METADATA KALITLARIDA APOSTROF ISHLATMANG:** `"Bo'lim"` ❌ → `"Bolim"` ✅. Ba'zi vektor bazalari kalitlarda maxsus belgilarni **qabul qilmaydi**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `MarkdownHeaderTextSplitter` nima qo'shadi?

**M2.** Nima uchun ikki bosqichli bo'laklash kerak?

**M3.** Oddiy DOCX'da u ishlaydimi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **METADATA** — sarlavhalarni `metadata` ga qo'yadi.

**M2.** Markdown bo'laklar **juda katta** *(4150 belgi)*. Ikkinchi bosqich ularni kichraytiradi, **metadata saqlanadi**.

**M3.** ## ❌ **Yo'q** — `#` va `##` **bo'lishi kerak**.

</details>

### 🟡 O'rta

**M4.** ⭐ Metadata saqlanishini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
md_b = md_splitter.split_text(pages[0].page_content)
print("md bo'laklar   :", len(md_b))
print("md metadata    :", md_b[0].metadata)

char_b = char_splitter.split_documents(md_b)
print("\nchar bo'laklar :", len(char_b))
print("char metadata  :", char_b[0].metadata)
print("\n✅ metadata saqlandi:",
      set(md_b[0].metadata) <= set(char_b[0].metadata))
```

</details>

**M5.** ⭐ Metadatasiz va metadata bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

a = char_splitter.split_documents(pages)                       # to'g'ridan-to'g'ri
b = char_splitter.split_documents(md_splitter.split_text(pages[0].page_content))

print(pd.DataFrame([
    {"usul": "faqat Character", "bo'laklar": len(a),
     "metadata_maydonlari": len(a[0].metadata)},
    {"usul": "Markdown + Character", "bo'laklar": len(b),
     "metadata_maydonlari": len(b[0].metadata)},
]).to_string(index=False))
```

</details>

**M6.** ⭐ O'zbekcha hujjatni bo'laklang.

<details>
<summary>✅ Yechim</summary>

```python
UZ = """# Bank qo'llanmasi

## Depozitlar
Muddatli depozit yillik 18% dan 22% gacha foiz keltiradi.

## Kartalar
Debet karta 3 ish kunida tayyorlanadi.
"""
md = MarkdownHeaderTextSplitter(headers_to_split_on=[("#", "Hujjat"),
                                                     ("##", "Bolim")])
for d in md.split_text(UZ):
    print(f"{d.metadata}  →  {d.page_content[:44]}")
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Sarlavhalarni evristika bilan toping.

<details>
<summary>✅ Yechim</summary>

```python
import re

def sarlavha_topuvchi(matn, max_uzunlik=80):
    """Sarlavhaga o'xshash qatorlarni ## bilan belgilaydi."""
    natija, topildi = [], 0
    for q in matn.split("\n"):
        s = q.strip()
        sarlavhami = (s and len(s) <= max_uzunlik
                      and not s.endswith((".", "!", "?", ",", ";"))
                      and s[0].isupper()
                      and len(s.split()) <= 10)
        if sarlavhami:
            natija.append(f"## {s}")
            topildi += 1
        else:
            natija.append(q)
    print(f"{topildi} ta sarlavha belgilandi")
    return "\n".join(natija), topildi

belgilangan, n = sarlavha_topuvchi(pages[0].page_content)
print(belgilangan[:400])
```

## ⚠️ **NATIJANI KO'ZINGIZ BILAN TEKSHIRING** — evristika **xato qiladi**.

</details>

**M8.** ⭐⭐⭐ Ikki bosqichli bo'laklovchi sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

class IkkiBosqichliBolakchi:
    """① struktura bo'yicha (metadata) → ② hajm bo'yicha (metadata saqlanadi)."""

    def __init__(self, sarlavhalar=None, chunk_size=500, chunk_overlap=50,
                 strip_headers=True):
        self.md = MarkdownHeaderTextSplitter(
            headers_to_split_on=sarlavhalar or [("#", "Hujjat"), ("##", "Bolim")],
            strip_headers=strip_headers)
        self.rc = RecursiveCharacterTextSplitter(chunk_size=chunk_size,
                                                 chunk_overlap=chunk_overlap)
        self.cs = chunk_size

    def bolakla(self, hujjatlar, tozala=True):
        yakuniy = []
        for h in hujjatlar:
            try:
                md_b = self.md.split_text(h.page_content)
            except Exception:
                md_b = [h]
            if len(md_b) <= 1:
                print(f"⚠️ {h.metadata.get('source', '?')}: sarlavha topilmadi "
                      f"— faqat hajm bo'yicha bo'linadi")
                md_b = [h]
            for d in md_b:
                d.metadata = {**h.metadata, **d.metadata}     # ⭐ birlashtirish
                if tozala:
                    d.page_content = " ".join(d.page_content.split())
            yakuniy += self.rc.split_documents(md_b)
        return yakuniy

    def hisobot(self, bolaklar):
        import numpy as np, pandas as pd
        uz = [len(d.page_content) for d in bolaklar]
        meta = {k for d in bolaklar for k in d.metadata}
        print(f"bo'laklar : {len(bolaklar)}")
        print(f"uzunliklar: min {min(uz)} max {max(uz)} "
              f"o'rtacha {np.mean(uz):.0f}  to'ldirish {np.mean(uz)/self.cs:.0%}")
        print(f"metadata  : {sorted(meta)}")
        oshgan = sum(1 for x in uz if x > self.cs)
        print(f"chunk_size dan oshgan: {oshgan}")
        return bolaklar
```

## 🏆 **`{**h.metadata, **d.metadata}` — IKKALA METADATANI BIRLASHTIRADI:** `source` *(fayldan)* + `Bolim` *(sarlavhadan)*.

</details>

---

## 📌 Xulosa

```
① MarkdownHeaderTextSplitter  →  2 bo'lak + ⭐ METADATA
② CharacterTextSplitter        →  20 bo'lak, metadata SAQLANDI
```

```
CharacterTextSplitter  →  metadata: {'source': ...}
Markdown + Character   →  metadata: {'source': ..., 'Course Title': ...,
                                      'Lecture Title': ...}   ⭐
```

> ## 🏆 **NAQSH: STRUKTURA bo'yicha bo'l → metadata ol → HAJM bo'yicha bo'l.**
>
> ## ⚠️ **Kurs "sehrli" DOCX'dan foydalanadi** — unda `#` **oldindan qo'yilgan**. Sizning fayllaringizda ular **bo'lmaydi**: `markitdown`, evristika yoki **qo'lda metadata**.

---

⬅️ [9-dars. CharacterTextSplitter kod](09-Character-Text-Splitter-Code.md) · 🏠 [Modul boshiga](README.md) · ➡️ [11-dars. Embedding](11-Text-Embedding.md)
