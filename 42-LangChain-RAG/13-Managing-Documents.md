# 13-dars. Vectorstore'da hujjatlarni boshqarish

## 🎬 Boshlashdan oldin

> **"`vectorstore.get()`, `add_documents()`, `update_document()`, `delete()`"**

---

## 1. To'rtta amal — HAQIQIY natija

```python
from langchain_core.documents import Document

print("boshlang'ich:", len(vs.get()["documents"]))

# ── QO'SHISH ──
yangi = Document(page_content="Uzbek test document about banking.",
                 metadata={"Course Title": "Test", "Lecture Title": "Test"})
ids = vs.add_documents([yangi])
print("qo'shildi:", ids, " jami:", len(vs.get()["documents"]))

# ── O'QISH ──
print("olindi   :", vs.get(ids[0])["documents"])

# ── YANGILASH ──
vs.update_document(document_id=ids[0],
                   document=Document(page_content="YANGILANGAN matn.",
                                     metadata={"Course Title": "Test",
                                               "Lecture Title": "Test"}))
print("yangilandi:", vs.get(ids[0])["documents"])

# ── O'CHIRISH ──
vs.delete(ids[0])
print("o'chirildi:", vs.get(ids[0])["documents"], " jami:", len(vs.get()["documents"]))
```

```
boshlang'ich: 20
qo'shildi: ['9b3461c2-6d2e-4c28-918d-73df5f82c06a']  jami: 21
olindi   : ['Uzbek test document about banking.']
yangilandi: ['YANGILANGAN matn.']
o'chirildi: []  jami: 20
```

> ## ✅ **TO'RTALA AMAL HAM ISHLADI** *(o'lchandi)*.

---

## 2. ⭐ ID lar

```python
d = vs.get()
print("kalitlar:", list(d))
print("ID namuna:", d["ids"][0])
```

> ## 🔑 **ID lar AVTOMATIK UUID.** Kurs ularni **qo'lda nusxalaydi** — bu **amaliy emas**.
>
> ## ✅ **O'Z ID LARINGIZNI BERING:**
> ```python
> import hashlib
>
> def barqaror_id(hujjat):
>     """Bir xil matn → bir xil ID. Takroriy qo'shish oldini oladi."""
>     kalit = f"{hujjat.metadata.get('source','')}|{hujjat.page_content}"
>     return hashlib.sha256(kalit.encode()).hexdigest()[:32]
>
> ids = [barqaror_id(d) for d in bolaklar]
> vs.add_documents(bolaklar, ids=ids)        # ⭐ takroriy qo'shilsa — YANGILANADI
> ```
>
> ## 🏆 **BARQAROR ID — INDEKSLASHNING ENG MUHIM NAQSHI.** Usiz hujjatni ikki marta indekslasangiz — **dublikat** hosil bo'ladi *(15-darsdagi MMR muammosi!)*.

---

## 3. ⭐ `include` parametri

```python
vs.get(ids=..., include=["embeddings"])            # vektorlar ham
vs.get(include=["documents", "metadatas"])         # standart
```

> ## 💡 **`embeddings` KATTA.** 1000 hujjat × 384 o'lcham = **384 000 raqam**. Kerak bo'lmasa — **so'ramang**.

---

## 4. ⭐⭐ `where` bilan filtrlash — kursda YO'Q

```python
# Metadata bo'yicha
r = vs.get(where={"Lecture Title": "Analysis vs Analytics"})
print("topildi:", len(r["documents"]))

# Bir necha shart
r = vs.get(where={"$and": [{"til": "uz"}, {"yil": {"$gte": 2024}}]})

# Matn bo'yicha
r = vs.get(where_document={"$contains": "depozit"})
```

> ## 🏆 **BU — HUJJATLARNI BOSHQARISHNING ASOSIY VOSITASI:**
> ```
> ① Eski versiyani TOPIB o'chirish
> ② Ma'lum bo'limni QAYTA indekslash
> ③ 🇺🇿 Faqat o'zbekcha hujjatlarni ko'rish
> ```

---

## 5. ⭐ Yangilash strategiyasi

```python
def hujjatni_yangila(vs, manba, yangi_bolaklar):
    """Bir manbaning ESKI bo'laklarini o'chirib, yangisini qo'yadi."""
    eski = vs.get(where={"source": manba})
    if eski["ids"]:
        vs.delete(ids=eski["ids"])
        print(f"  {len(eski['ids'])} ta eski bo'lak o'chirildi")
    ids = [barqaror_id(d) for d in yangi_bolaklar]
    vs.add_documents(yangi_bolaklar, ids=ids)
    print(f"  {len(yangi_bolaklar)} ta yangi bo'lak qo'shildi")
    return vs
```

> ## 💥 **USIZ NIMA BO'LADI?** Hujjatni yangilaganingizda **eski bo'laklar bazada qoladi** va model **eskirgan ma'lumotni** javob qilib beradi.
>
> ## 🔑 **VA BU — JIM XATO.** Hech qanday ogohlantirish **yo'q**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** To'rtta amal qaysilar?

**M2.** ID lar qanday beriladi?

**M3.** `include=["embeddings"]` nima uchun ehtiyot bo'lish kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `get` · `add_documents` · `update_document` · `delete`.

**M2.** ## **Avtomatik UUID**, yoki ## **o'zingiz** *(`ids=` parametri)*.

**M3.** Vektorlar **katta** — 1000 × 384 = **384 000 raqam**.

</details>

### 🟡 O'rta

**M4.** ⭐ To'rtala amalni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.documents import Document

n0 = len(vs.get()["documents"])
ids = vs.add_documents([Document(page_content="sinov",
                                 metadata={"tur": "sinov"})])
print("qo'shildi:", len(vs.get()["documents"]) - n0)
print("o'qildi  :", vs.get(ids[0])["documents"])
vs.update_document(ids[0], Document(page_content="yangilandi",
                                    metadata={"tur": "sinov"}))
print("yangilandi:", vs.get(ids[0])["documents"])
vs.delete(ids[0])
print("o'chirildi:", len(vs.get()["documents"]) == n0)
```

</details>

**M5.** ⭐⭐ Barqaror ID yaratuvchini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import hashlib

def barqaror_id(hujjat):
    kalit = f"{hujjat.metadata.get('source','')}|{hujjat.page_content}"
    return hashlib.sha256(kalit.encode("utf-8")).hexdigest()[:32]

d1 = Document(page_content="matn", metadata={"source": "a.docx"})
d2 = Document(page_content="matn", metadata={"source": "a.docx"})
d3 = Document(page_content="boshqa", metadata={"source": "a.docx"})
print(barqaror_id(d1) == barqaror_id(d2))      # True  ⭐
print(barqaror_id(d1) == barqaror_id(d3))      # False
```

## 🏆 **TAKRORIY INDEKSLASHDA DUBLIKAT HOSIL BO'LMAYDI.**

</details>

**M6.** ⭐ `where` bilan filtrlang.

<details>
<summary>✅ Yechim</summary>

```python
r = vs.get(where={"Lecture Title": "Analysis vs Analytics"})
print("filtr bo'yicha:", len(r["documents"]))

r2 = vs.get(where_document={"$contains": "Python"})
print("matn bo'yicha :", len(r2["documents"]))

hammasi = vs.get()
from collections import Counter
c = Counter(m.get("Lecture Title", "?") for m in hammasi["metadatas"])
for k, v in c.items():
    print(f"  {v:3d}  {k[:56]}")
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Hujjat boshqaruvchisi sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import hashlib, pandas as pd
from collections import Counter

class HujjatBoshqaruv:
    """Vectorstore'dagi hujjatlarni qo'shish, yangilash, o'chirish va TEKSHIRISH."""

    def __init__(self, vs):
        self.vs = vs

    @staticmethod
    def _id(d):
        kalit = f"{d.metadata.get('source','')}|{d.page_content}"
        return hashlib.sha256(kalit.encode("utf-8")).hexdigest()[:32]

    def qosh(self, bolaklar):
        ids = [self._id(d) for d in bolaklar]
        noyob = len(set(ids))
        if noyob < len(ids):
            print(f"⚠️ {len(ids)-noyob} ta DUBLIKAT bo'lak — birlashtiriladi")
        self.vs.add_documents(bolaklar, ids=ids)
        return ids

    def yangila(self, manba, yangi_bolaklar):
        eski = self.vs.get(where={"source": manba})
        if eski["ids"]:
            self.vs.delete(ids=eski["ids"])
            print(f"  {len(eski['ids'])} eski bo'lak o'chirildi")
        self.qosh(yangi_bolaklar)
        print(f"  {len(yangi_bolaklar)} yangi bo'lak qo'shildi")

    def ochir_manba(self, manba):
        r = self.vs.get(where={"source": manba})
        if r["ids"]:
            self.vs.delete(ids=r["ids"])
        print(f"{len(r['ids'])} bo'lak o'chirildi")

    def hisobot(self):
        d = self.vs.get()
        n = len(d["documents"])
        print(f"jami hujjatlar: {n}")

        # dublikat matnlar
        c = Counter(d["documents"])
        dub = {k: v for k, v in c.items() if v > 1}
        if dub:
            print(f"💥 {len(dub)} ta TAKRORLANGAN matn "
                  f"({sum(dub.values())-len(dub)} ortiqcha)")
            for k, v in list(dub.items())[:3]:
                print(f"    ×{v}  {k[:56]}")
        else:
            print("✅ dublikat yo'q")

        # metadata bo'yicha
        kalitlar = {k for m in d["metadatas"] for k in m}
        print(f"metadata kalitlari: {sorted(kalitlar)}")
        for k in sorted(kalitlar):
            cc = Counter(m.get(k, "—") for m in d["metadatas"])
            if len(cc) <= 8:
                print(f"  {k}: {dict(cc)}")

        # uzunliklar
        uz = [len(x) for x in d["documents"]]
        print(f"uzunliklar: min {min(uz)} max {max(uz)} "
              f"o'rtacha {sum(uz)//len(uz)}")
        qisqa = sum(1 for x in uz if x < 100)
        if qisqa:
            print(f"⚠️ {qisqa} ta bo'lak JUDA QISQA (<100) — "
                  f"ular qidiruvda shovqin qiladi")
        return d

hb = HujjatBoshqaruv(vs)
hb.hisobot()
```

## 🏆 **`hisobot()` — INDEKSLASHDAN KEYIN DOIM ISHGA TUSHIRING.**

## 💥 **`dublikat` VA `juda qisqa` — RAG SIFATINING IKKI ASOSIY DUSHMANI.**

</details>

---

## 📌 Xulosa

```python
vs.get(ids=..., include=["embeddings"])       # o'qish
vs.add_documents(docs, ids=barqaror_id_lar)   # ⭐ BARQAROR ID
vs.update_document(doc_id, yangi_hujjat)      # yangilash
vs.delete(ids=[...])                          # o'chirish
vs.get(where={"source": "a.docx"})            # ⭐ filtrlash
```

> ## 🏆 **BARQAROR ID — TAKRORIY INDEKSLASHDA DUBLIKAT HOSIL BO'LMAYDI.**
>
> ## 💥 **HUJJATNI YANGILAGANDA ESKI BO'LAKLARNI O'CHIRING** — usiz model **eskirgan ma'lumotni** javob qilib beradi, **jim**.

---

⬅️ [12-dars. Chroma yaratish](12-Creating-Chroma-Vectorstore.md) · 🏠 [Modul boshiga](README.md) · ➡️ [14-dars. Similarity search](14-Similarity-Search.md)
