# 5-dars. Saqlash, retrieval va generatsiya

## 🎬 Boshlashdan oldin

> **"An'anaviy relyatsion ma'lumotlar bazalari bunga yaramaydi, chunki ular bu maqsad uchun OPTIMALLASHTIRILMAGAN."**

---

## 1. Nima uchun vektor bazasi?

```
SQL:     SELECT * FROM student WHERE user_id = 12      →  ANIQ moslik
Vektor:  "dinner ideas" ga eng YAQIN 3 ta hujjat        →  SEMANTIK moslik
```

> ## 🔑 **SQL "TENGMI?" DEB SO'RAYDI. VEKTOR BAZASI "QANCHALIK YAQIN?" DEB SO'RAYDI.**

---

## 2. Retrieval — nafaqat MOSLIK, balki XILMA-XILLIK

> **"Retriever'lar so'rovga eng semantik yaqin, LEKIN AYNI PAYTDA XILMA-XIL bo'laklarni olib chiqishi kerak."**

> **"Vektor omborida bo'laklardan biri tasodifan TAKRORLANGAN bo'lsa... ikkinchi olingan bo'lak faqat oldingisining ma'lumotini TAKRORLAYDI."**

```
❌ FAQAT MOSLIK:
   ① "R va Python — eng mashhur vositalar"   (0.95)
   ② "R va Python — eng mashhur vositalar"   (0.95)  ← DUBLIKAT!
   ③ "R va Python adaptiv"                    (0.93)  ← deyarli bir xil
   →  modelga UCHTA bir xil ma'lumot ketdi

✅ MOSLIK + XILMA-XILLIK (MMR):
   ① "R va Python — eng mashhur vositalar"   (0.95)
   ② "Hadoop katta ma'lumot uchun"           (0.81)  ← YANGI ma'lumot
   ③ "Tableau vizualizatsiya uchun"          (0.78)  ← YANGI ma'lumot
```

> ## 🏆 **BU — 15-DARSDAGI MMR ALGORITMINING SABABI.**

---

## 3. ⭐ To'liq oqim

```
① LOADING     PDF/DOCX  →  Document
② SPLITTING   Document  →  bo'laklar
③ EMBEDDING   bo'lak    →  vektor
④ STORING     vektor    →  vektor bazasi          ┐ INDEKSLASH (bir marta)
                                                   ┘
⑤ RETRIEVAL   savol → vektor → eng mos K bo'lak   ┐ HAR SAVOLDA
⑥ GENERATION  savol + bo'laklar → prompt → LLM    ┘
```

---

## 4. ⚠️ Kursda aytilmagan — vektor bazasini tanlash

| Baza | Qayerda | Narx | Qachon |
|---|---|---|---|
| ## **Chroma** | mahalliy fayl | ## ✅ **bepul** | ## ⭐ **o'rganish, kichik loyiha** |
| FAISS | mahalliy fayl | ✅ bepul | tezlik muhim, metadata kam |
| ## **Pinecone** | bulut | 💰 pullik | ## katta miqyos *(48–51-modul)* |
| Qdrant | mahalliy yoki bulut | ✅/💰 | ## 🇺🇿 **o'z serveringizda** |
| pgvector | PostgreSQL | ✅ bepul | ## 🇺🇿 **mavjud SQL bazangizda** |

> ## 🇺🇿 **O'ZBEKISTONDAGI BANK/TIBBIY LOYIHALAR UCHUN:**
> ```
> ✅ Chroma / Qdrant / pgvector  →  ma'lumot SERVERINGIZDA qoladi
> ⚠️ Pinecone                     →  ma'lumot BULUTGA chiqadi
> ```
>
> ## 💡 **VA EMBEDDING HAM MAHALLIY BO'LSIN** *(4-dars)* — aks holda hujjatlaringiz **embedding uchun** API'ga yuboriladi.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun SQL bazasi yaramaydi?

**M2.** Retriever nima qaytarishi kerak?

**M3.** Chroma qayerda saqlaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** SQL **aniq moslik** qidiradi, bizga esa **semantik yaqinlik** kerak.

**M2.** ## **Mos VA xilma-xil** bo'laklar.

**M3.** ## **Mahalliy faylda** *(`persist_directory`)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Dublikat muammosini taqlid qiling.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np

BO_LAKLAR = ["R va Python — eng mashhur vositalar",
             "R va Python — eng mashhur vositalar",      # DUBLIKAT
             "R va Python juda moslashuvchan",
             "Hadoop katta ma'lumot uchun ishlatiladi",
             "Tableau vizualizatsiya uchun"]

SAVOL = "Data olimlari qanday vositalardan foydalanadi?"

vs = [emb.embed_query(b) for b in BO_LAKLAR]
vq = emb.embed_query(SAVOL)
ballar = sorted(((kosinus(vq, v), b) for v, b in zip(vs, BO_LAKLAR)),
                reverse=True)

print("FAQAT MOSLIK (top-3):")
for s, b in ballar[:3]:
    print(f"  {s:.4f}  {b}")
print("\n⚠️ DUBLIKAT bormi?",
      len({b for _, b in ballar[:3]}) < 3)
```

## 🔑 **AGAR TOP-3 DA TAKRORLANISH BO'LSA — MMR KERAK** *(15-dars)*.

</details>

**M5.** ⭐ Vektor bazasini tanlash mezonlarini yozing.

<details>
<summary>✅ Javob</summary>

```python
def baza_maslahati(hujjatlar_soni, mahalliy_shart, byudjet):
    if mahalliy_shart:
        return "Chroma" if hujjatlar_soni < 100_000 else "Qdrant (o'z serveringizda)"
    if byudjet and hujjatlar_soni > 1_000_000:
        return "Pinecone"
    return "Chroma"

for n, m, b in [(500, True, False), (50_000, True, False),
                (5_000_000, False, True)]:
    print(f"{n:>9,} hujjat  mahalliy={m}  byudjet={b}  →  {baza_maslahati(n, m, b)}")
```

</details>

---

## 📌 Xulosa

```
SQL          →  "TENGMI?"        →  aniq moslik
VEKTOR BAZA  →  "QANCHALIK YAQIN?" →  semantik moslik

RETRIEVAL = MOSLIK + ⭐ XILMA-XILLIK
                       ↑ MMR (15-dars)
```

> ## 🇺🇿 **Ma'lumot serveringizda qolishi kerak bo'lsa:** `Chroma` / `Qdrant` / `pgvector` **+ mahalliy embedding**.

---

⬅️ [4-dars. Embedding](04-Document-Embedding.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. PyPDFLoader](06-Loading-PyPDFLoader.md)
