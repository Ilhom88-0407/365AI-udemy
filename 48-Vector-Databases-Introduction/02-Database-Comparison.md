# 2-dars. SQL, NoSQL va Vektor bazalari ⭐⭐

## 🎬 Boshlashdan oldin

> **"SQL — puxta kutubxonachilar, NoSQL — dinamik hikoyachilar, vektor bazalari — kelajakni ko'ruvchilar."**

---

## 1. Uch turdagi baza

| | ## **SQL** | ## **NoSQL** | ## ⭐ **Vektor** |
|---|---|---|---|
| Tuzilish | ## **Jadval** *(qator/ustun)* | Hujjat · kalit-qiymat · graf | ## **Yuqori o'lchamli vektor** |
| Sxema | ## **Qat'iy** | ## **Yo'q** *(schema-less)* | Vektor + metadata |
| Asosiy so'rov | `WHERE id = 42` | `find({"user": "..."})` | ## ⭐ **"shunga o'xshashini top"** |
| Kuchli tomoni | ## **Tranzaksiya, aniqlik** | ## **Miqyos, moslashuvchanlik** | ## **O'xshashlik qidiruvi** |
| Zaif tomoni | ## Sxema **qattiq** | ## Tranzaksiya **kafolati zaif** | ## **Aniq moslik** samarasiz |
| Misol | 🏦 Bank tranzaksiyalari | 📱 Meta, Netflix | 🔍 Semantik qidiruv |

---

## 2. ⭐ SQL — "puxta kutubxonachi"

```sql
SELECT * FROM kurslar WHERE course_technology = 'python';
```

> ## ✅ **KUCHLI TOMONLARI:**
> ```
> ⭐ ACID tranzaksiyalar     →  bank uchun MAJBURIY
> ⭐ Murakkab JOIN           →  bir necha jadvalni birlashtirish
> ⭐ Ma'lumot yaxlitligi     →  kalitlar va cheklovlar
> ⭐ 50 yillik ekotizim      →  har qanday vosita bilan ishlaydi
> ```
>
> ## ❌ **ZAIF TOMONLARI:**
> ```
> Sxemani o'zgartirish      →  migratsiya kerak
> Gorizontal miqyos         →  qiyin
> 💥 "shunga o'xshash"      →  IMKONSIZ
> ```

### 🇺🇿 Bizning ma'lumotimizda

```
# ❌ SQL bilan
SELECT * FROM sections WHERE section_name LIKE '%clustering%';
# → faqat AYNAN "clustering" so'zi bor bo'limlar
# → "K-means", "unsupervised learning", "segmentatsiya" — TOPILMAYDI
```

---

## 3. ⭐ NoSQL — "dinamik hikoyachi"

```javascript
db.kurslar.find({ "texnologiya": "python", "daraja": { $gte: 2 } })
```

| Tur | Misol | Qachon |
|---|---|---|
| Hujjatli | MongoDB | Tuzilishi **o'zgaruvchan** ma'lumot |
| Kalit-qiymat | Redis | ## ⭐ **Kesh**, sessiya |
| Ustunli | Cassandra | ## Katta **vaqt qatorlari** |
| Graf | Neo4j | ## **Aloqalar** *(ijtimoiy tarmoq)* |

> ## 🔑 **KURSNING TARIXIY IZOHI TO'G'RI:** NoSQL **1960-yillardan** bor, lekin atama **90-yillar oxirida** paydo bo'lgan va **2010-yillarda** ommalashgan.
>
> ## 💡 **SABAB:** Meta, Netflix kabi kompaniyalarda **hajm va tezlik** SQL imkoniyatidan **oshib ketdi**.

---

## 4. ⭐⭐ Vektor — "kelajakni ko'ruvchi"

```python
natija = index.query(vector=savol_vektori, top_k=3)
```

```
Ma'lumot  →  Embedding model  →  Vektor  →  Vektor bazasi
"regression in Python"  →  [0.12, -0.45, ..., 0.88]  (384 son)
```

> ## 🔑 **HAR O'LCHAM — MA'LUMOTNING BIR XUSUSIYATI.** Musiqa uchun: **ritm, ohang, cholg'u, kayfiyat**. Rasm uchun: **rang, shakl, tekstura**.
>
> ## 🏆 **VA VEKTORLAR — FAZODAGI NUQTALAR.** Ya'ni ular orasidagi **masofani o'lchash mumkin** *(49-modul)*.

### 🔬 O'lchangan — bizning ma'lumotimizda

```
680 bo'lim  →  384 o'lchamli vektor  →  0.2 soniyada indekslandi
qidiruv     →  1–2 ms
```

---

## 5. ⭐⭐⭐ Qaysi birini tanlash? — QAROR JADVALI

| Savol | Tanlov |
|---|---|
| "ID 42 bo'lgan mijoz kim?" | ## **SQL** |
| "Bugungi tranzaksiyalar summasi?" | ## **SQL** |
| "Foydalanuvchi profilini saqlash" *(maydonlar o'zgaruvchan)* | ## **NoSQL** |
| "Sessiya ma'lumotini keshlash" | ## **NoSQL** *(Redis)* |
| ## **"Shu maqolaga o'xshash maqolalar"** | ## ⭐ **Vektor** |
| ## **"Bu savolga javob beradigan hujjat"** | ## ⭐ **Vektor** *(RAG — 42-modul)* |
| ## **"Shu rasmga o'xshash mahsulot"** | ## ⭐ **Vektor** |

> ## 🏆🏆 **VA ENG MUHIM XULOSA — ULAR RAQOBATCHI EMAS.**
>
> ## 🔑 **HAQIQIY ARXITEKTURA — HAMMASI BIRGA:**
> ```
> 🏦 Bank ilovasi:
>    SQL     →  hisoblar, tranzaksiyalar, mijoz ma'lumoti   (ACID SHART)
>    Redis   →  sessiya, kesh                                (tezlik)
>    Vektor  →  ⭐ "menga mos mahsulot" · qo'llab-quvvatlash boti
> ```
>
> ## 💡 **VEKTOR BAZASI SQL'NI ALMASHTIRMAYDI** — u **yangi imkoniyat** qo'shadi.

---

## 6. ⚠️ Vektor bazasining zaif tomonlari — kursda kam aytilgan

```
💥 ANIQ MOSLIK SAMARASIZ
   "course_id = 37" → SQL bir zumda, vektor DB ehtimolan sekinroq
   → shuning uchun METADATA FILTRI bor

💥 YANGILANISH QIMMAT
   Matn o'zgarsa → QAYTA embedding kerak (pul va vaqt)

💥 EMBEDDING MODELI O'ZGARSA — HAMMASI QAYTA INDEKSLANADI
   (42-modul, 12-darsdagi "jim xato" muammosi)

💥 TAXMINIY (approximate) NATIJA
   HNSW/IVF algoritmlari TEZLIK uchun ANIQLIKNI biroz qurbon qiladi
   → 100% to'g'ri natija KAFOLATLANMAYDI

💰 XOTIRA
   1M vektor × 384 o'lcham × 4 bayt ≈ 1.5 GB (faqat vektorlar)
```

> ## 🏆 **SHUNING UCHUN: ASOSIY MA'LUMOT SQL'DA, VEKTOR DB — QIDIRUV INDEKSI.**
> ```python
> # ⭐ Amaliy naqsh
> natija = vektor_db.query(savol_vektori, top_k=10)      # ① ID larni top
> ids = [m["id"] for m in natija]
> toliq = sql.query("SELECT * FROM kurslar WHERE id IN (...)", ids)  # ② to'liq ma'lumot
> ```
> **Vektor bazasida faqat `id` va qidiruv uchun kerakli metadata saqlanadi.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Uch turdagi bazani ayting.

**M2.** Vektor bazasining asosiy vazifasi?

**M3.** Vektor DB SQL'ni almashtiradimi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **SQL** *(relyatsion)* · **NoSQL** · ## ⭐ **Vektor**.

**M2.** ## **O'xshashlik qidiruvi** *(similarity search)*.

**M3.** ## ❌ **Yo'q** — u **yangi imkoniyat** qo'shadi. Haqiqiy tizimda **hammasi birga** ishlatiladi.

</details>

### 🟡 O'rta

**M4.** ⭐ Uch bazani bir vazifada solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

VAZIFALAR = [
    ("Mijoz ID 42 ning balansi",            "SQL",    "aniq moslik + ACID"),
    ("Bugungi tranzaksiyalar summasi",      "SQL",    "agregatsiya"),
    ("Foydalanuvchi sozlamalari (o'zgaruvchan)", "NoSQL", "sxema yo'q"),
    ("Sessiya keshi",                       "NoSQL",  "Redis, tezlik"),
    ("'Shunga o'xshash kurs'",              "⭐ Vektor", "o'xshashlik"),
    ("'Bu savolga javob beruvchi hujjat'",  "⭐ Vektor", "RAG"),
    ("'Shu rasmga o'xshash mahsulot'",      "⭐ Vektor", "rasm embedding"),
    ("Do'stlarning do'stlari",              "NoSQL",  "graf DB"),
]
d = pd.DataFrame(VAZIFALAR, columns=["vazifa", "tanlov", "sabab"])
print(d.to_string(index=False))
print("\n🏆 QOIDA: 'o'xshash' yoki 'ma'nosi yaqin' → VEKTOR. Aks holda SQL/NoSQL.")
```

</details>

**M5.** ⭐ Aniq moslikning cheklovini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

SOROVLAR = ["clustering", "clustering in Python", "unsupervised learning",
            "ML", "K-means"]

for s in SOROVLAR:
    # ❌ SQL uslubidagi LIKE '%...%'
    mos = b[b.section_name.str.contains(s, case=False, na=False)
            | b.course_name.str.contains(s, case=False, na=False)]
    belgi = "✅" if len(mos) else "❌"
    print(f"  {belgi} '{s}': {len(mos)} natija")
    for _, r in mos.head(2).iterrows():
        print(f"       {r.course_name[:34]} | {r.section_name[:30]}")
```

## 💥 **"clustering in Python" — 0 NATIJA**, garchi **bir necha kursda** aynan shu mavzu bor.

## 🔑 **BU — KURSNING BUTUN CASE STUDY'SINING SABABI.**

</details>

**M6.** ⭐⭐ Vektor bazasi xotira hajmini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

MODELLAR = {"all-MiniLM-L6-v2": 384,
            "paraphrase-multilingual-MiniLM-L12-v2": 384,
            "all-mpnet-base-v2": 768,
            "text-embedding-3-small": 1536,
            "text-embedding-3-large": 3072}

q = []
for nom, o in MODELLAR.items():
    for n in (10_000, 1_000_000, 100_000_000):
        gb = n * o * 4 / 1024 ** 3          # float32
        q.append({"model": nom[:34], "o'lcham": o, "vektorlar": f"{n:,}",
                  "GB": round(gb, 2)})
d = pd.DataFrame(q)
print(d.pivot(index=["model", "o'lcham"], columns="vektorlar",
              values="GB").to_string())

print("\n💡 float16 bilan — 2× kam")
print("💡 kvantlash (int8) bilan — 4× kam, aniqlik biroz pasayadi")
print("💥 va bu FAQAT vektorlar — metadata va indeks QO'SHIMCHA")
```

## 🔑 **1 MLN VEKTOR × 384 O'LCHAM ≈ 1.5 GB.** Shuning uchun **o'lchamni tanlash — narx qarori**.

</details>

---

## 📌 Xulosa

| | SQL | NoSQL | ⭐ Vektor |
|---|---|---|---|
| Uchun | Tranzaksiya, aniqlik | Miqyos, moslashuvchanlik | ## **O'xshashlik** |
| So'rov | `WHERE id = 42` | `find({...})` | ## `query(vector, top_k)` |

```
🏆 ULAR RAQOBATCHI EMAS — HAQIQIY TIZIMDA HAMMASI BIRGA
   SQL     →  asosiy ma'lumot (ACID)
   Redis   →  kesh
   Vektor  →  ⭐ QIDIRUV INDEKSI (faqat id + metadata)

💥 Vektor DB zaif tomonlari:
   aniq moslik sekin · yangilanish qimmat · natija TAXMINIY
   embedding modeli o'zgarsa — hammasi qayta indekslanadi
   1M vektor × 384 ≈ 1.5 GB
```

---

⬅️ [1-dars. Kirish](01-Introduction-to-the-Course.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Vektor bazalarini tushunish](03-Understanding-Vector-Databases.md)
