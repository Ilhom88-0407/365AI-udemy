# 🗄️ 48-modul. Vektor bazalari — kirish

> ## 🏆 **YANGI BO'LIM BOSHLANADI: VEKTOR BAZALARI** *(48–51-modullar)*.
>
> ## ⭐⭐ **HAMMASI API KALITISIZ** — kurs Pinecone ishlatadi, biz **mahalliy** bazada.

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [Kirish](01-Introduction-to-the-Course.md) ⭐ | Semantik qidiruv · ## 🇺🇿 **o'zbekcha ogohlantirish** |
| 2 | [SQL, NoSQL, Vektor](02-Database-Comparison.md) ⭐⭐ | ## **Qaror jadvali** · zaif tomonlar |
| 3 | [Vektor bazalarini tushunish](03-Understanding-Vector-Databases.md) ⭐⭐ | Indeks · ## 💥 **HNSW taxminiy** |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**16 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**2 ta mini-loyiha**](LOYIHALAR.md) | 🔬 **baza tanlovchi** · 📊 **hajm kalkulyatori** |

---

## 🧭 Uch baza — bir jadvalda

| | SQL | NoSQL | ## ⭐ Vektor |
|---|---|---|---|
| So'rov | `WHERE id = 42` | `find({...})` | ## `query(vector, top_k)` |
| Kuchli | ## **Tranzaksiya** | ## **Miqyos** | ## **O'xshashlik** |
| Zaif | Sxema qattiq | Tranzaksiya zaif | ## Aniq moslik sekin |

> ## 🏆 **ULAR RAQOBATCHI EMAS.** Haqiqiy tizimda: SQL — **asosiy ma'lumot**, Redis — **kesh**, Vektor — ## ⭐ **qidiruv indeksi**.

---

## 📊 Modulda o'lchangan

| O'lchov | Natija |
|---|---|
| 365 ma'lumoti | ## **106 kurs · 680 bo'lim** |
| CSV kodirovkasi | ## 💥 **`cp1252`** — UTF-8 bilan **xato** |
| Boshqaruv belgilari | ## 💥 **3848 ta `\r`** *(3009 + 839)* |
| `all-MiniLM-L6-v2` norma | ## ✅ **1.0000** — `dot` **=** kosinus |
| `multilingual` norma | ## 💥 **5.8556** — normaga **bo'ling** |
| 680 embedding | 6.0 s *(113/s, CPU)* |
| Chroma indekslash | ## ⚡ **0.2 s** |
| Qidiruv | ## ⚡ **1–2 ms** |
| 50 000 vektor: brute force | ## **2.05 ms** |
| 50 000 vektor: HNSW | ## **1.30 ms** — atigi **2× tez** |
| HNSW aniqligi *(tasodifiy)* | ## 💥 **3/10** — o'lchamlar la'nati |

---

## 💥 Kurs aytmagan 5 ta narsa

```
① 💥 HNSW TAXMINIY — 100% aniqlik KAFOLATLANMAYDI
     va < 100 000 vektorda numpy brute force YETADI (va 100% aniq)

② 💥 CSV fayllar cp1252 kodirovkasida — UTF-8 bilan UnicodeDecodeError

③ 💥 Ma'lumotda 3848 ta \r belgisi — embedding sifatiga ta'sir qiladi

④ ⚠️ Vektor DB zaif tomonlari: aniq moslik sekin · yangilanish qimmat ·
     embedding modeli o'zgarsa hammasi qayta indekslanadi

⑤ 🇺🇿 all-MiniLM-L6-v2 o'zbekchani BILMAYDI (ballar 0.20–0.38)
```

---

## 🇺🇿 Bizga nima uchun kerak?

```
🏦 Bank        →  "menga mos kredit turi qaysi?"
🏥 Klinika     →  "shunga o'xshash simptomlar"
🎓 Ta'lim      →  ⭐ 51-moduldagi case study
🛒 E-tijorat   →  "shunga o'xshash mahsulot"
⚖️ Yuridik     →  "shunga o'xshash sud qarorlari"

🔒 MAXFIYLIK: mahalliy Chroma/FAISS/Qdrant → ma'lumot CHIQMAYDI
```

---

## ⚙️ O'rnatish

```bash
pip install sentence-transformers chromadb pandas numpy
# ixtiyoriy (Pinecone bilan ishlash uchun):
pip install pinecone python-dotenv
```

---

## 🔗 Bog'liq modullar

| Modul | Nima uchun |
|---|---|
| [24](../24-Vectorizing-Text/README.md) | Matnni vektorlashtirish asoslari |
| [42](../42-LangChain-RAG/README.md) | ## ⭐ **Chroma, embedding, ball chegarasi** |
| [49](../49-Vector-Space-Basics/README.md) | ## **Masofa metrikalari** |
| [51](../51-Semantic-Search-Case-Study/README.md) | ## 🏆 **Haqiqiy case study** |

---

⬅️ [47-modul. Thread-level persistence](../47-LangGraph-Thread-Level-Persistence/README.md) · 🏠 [Kurs boshiga](../README.md) · ➡️ [49-modul. Vektor fazosi](../49-Vector-Space-Basics/README.md)
