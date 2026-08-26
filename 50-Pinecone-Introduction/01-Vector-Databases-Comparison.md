# 1-dars. Vektor bazalarini taqqoslash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Har variantning o'z afzalliklari bor va mukammal yechim YO'Q."**

---

## 1. To'rtta asosiy yechim

| | Pinecone | Milvus | Weaviate | Qdrant |
|---|---|---|---|---|
| Yil | 2019 | 2019 | 2018 | ## **2020** |
| Turi | ## **Boshqariladigan** *(SaaS)* | ## **Ochiq kod** | ## **Ochiq kod** | ## **Ochiq kod** |
| Kuchli | ## ⭐ **Soddalik** · avtomatik miqyos | ## **Millardlab vektor** · indeks turlari | ## **Graf + vektor** · avto-vektorlash | ## ⭐ **Tezlik** · **payload filtri** |
| Zaif | ## 💰 **Qimmat** · sozlash cheklangan | ## O'rganish **qiyin** · infratuzilma | Yangiroq · gibrid savdolar | Yangiroq · hujjatlar kam |
| Qachon | Tez boshlash | Juda katta hajm | Bilim grafi | ## ⭐ **Ishlab chiqarish** |

> ## 🔑 **KURSNING TANLOVI — PINECONE.** Sabab: *"soddaligi, intuitiv interfeysi va kuchli imkoniyatlari uchun"*.
>
> ## ⚠️ **VA BU — TO'G'RI PEDAGOGIK TANLOV.** Pinecone'da **infratuzilma bilan ovoragarchilik yo'q**, tushunchalarga **e'tibor qaratish** oson.

---

## 2. ⭐⭐ Lekin kursda yo'q — mahalliy yechimlar

| | ## **Chroma** | ## **FAISS** | ## **pgvector** |
|---|---|---|---|
| Turi | Ochiq kod, o'rnatiladigan | ## **Kutubxona** *(Meta)* | ## **PostgreSQL kengaytmasi** |
| Kuchli | ## ⭐ **Eng sodda** · o'rnatish oson | ## ⭐ **Eng tez** · GPU | ## 🏆 **SQL + vektor BIR bazada** |
| Zaif | Juda katta hajmda sekin | ## Server yo'q, faqat kutubxona | Millionlab vektorda sekinroq |
| Qachon | ## ⭐ **Prototip · < 1M vektor** | Tadqiqot · maxsus quvurlar | ## 🏆 **SQL allaqachon bor bo'lsa** |

> ## 🏆🏆 **`pgvector` — KURSDA UMUMAN YO'Q, LEKIN AMALDA ENG AMALIY:**
> ```sql
> CREATE EXTENSION vector;
> ALTER TABLE kurslar ADD COLUMN embedding vector(384);
> CREATE INDEX ON kurslar USING hnsw (embedding vector_cosine_ops);
>
> SELECT nom, 1 - (embedding <=> $1) AS oxshashlik
> FROM kurslar
> WHERE texnologiya = 'python'          -- ⭐ SQL filtri BEPUL
> ORDER BY embedding <=> $1
> LIMIT 5;
> ```
>
> ## 🔑 **NIMA UCHUN BU KUCHLI?**
> ```
> ✅ SQL va vektor BIR SO'ROVDA — ikkita baza kerak emas
> ✅ Tranzaksiya (ACID) — vektorlar ham himoyalangan
> ✅ Mavjud PostgreSQL bilimingiz YETADI
> ✅ Zaxira nusxa, replikatsiya — hammasi STANDART
> 🇺🇿 Ma'lumot O'Z SERVERINGIZDA
> ```
>
> ## ⚠️ **CHEKLOVI:** 10M+ vektorda ixtisoslashgan bazalar **tezroq**.

---

## 3. ⭐ Bizning tanlovimiz va uning sababi

```
Kurs        →  Pinecone (API kaliti · pulli · bulutli)
⭐ Biz       →  Chroma (mahalliy · bepul · API kalitisiz)
```

> ## 🔑 **NIMA UCHUN?**
> ```
> ① API kaliti KERAK EMAS   →  hamma darsni ISHGA TUSHIRA olasiz
> ② Natija BIR XIL          →  tushunchalar aynan o'sha
> ③ 🇺🇿 Ma'lumot suvereniteti →  bank/tibbiy loyihalarda MAJBURIY
> ④ Bepul                    →  cheksiz sinov
> ```
>
> ## ⭐⭐ **VA PINECONE KODINI HAM TO'LIQ KO'RSATAMIZ** — kalit olsangiz, **darhol ishlatasiz**.

### 🔬 Interfeyslar deyarli bir xil

| Amal | Pinecone | ## ⭐ Chroma |
|---|---|---|
| Ulanish | `Pinecone(api_key=...)` | `chromadb.PersistentClient(path=...)` |
| Indeks yaratish | `pc.create_index(name, dimension, metric, spec)` | `client.create_collection(name, metadata={"hnsw:space": ...})` |
| Ro'yxat | `pc.list_indexes()` | `client.list_collections()` |
| O'chirish | `pc.delete_index(name)` | `client.delete_collection(name)` |
| Yozish | `index.upsert(vectors=[...])` | `coll.add(ids=, embeddings=, metadatas=)` |
| Qidiruv | `index.query(vector=, top_k=)` | `coll.query(query_embeddings=, n_results=)` |
| Statistika | `index.describe_index_stats()` | `coll.count()` |

> ## 🏆 **BITTAGINA MUHIM FARQ — NATIJA FORMATI:**
> ```
> Pinecone  →  ⭐ O'XSHASHLIK ball (katta = yaxshi)
> Chroma    →  💥 MASOFA (kichik = yaxshi)  →  1 − masofa
> ```
> ## ⚠️ **BU — 42-MODUL, 14-DARSDAGI TUZOQNING O'ZI.**

---

## 4. ⭐ Tanlash bo'yicha amaliy qaror

```
📊 HAJM
   < 1 000        →  numpy (E @ q)         — vektor DB ORTIQCHA
   < 1 000 000    →  ⭐ Chroma / pgvector
   < 100 000 000  →  Qdrant / Milvus / Pinecone
   > 100 000 000  →  Milvus (klaster)

🔒 MAXFIYLIK
   🇺🇿 Bank, tibbiyot, davlat  →  ⭐ FAQAT mahalliy (Chroma · Qdrant · pgvector)
   Ochiq ma'lumot             →  bulut ham bo'ladi

💰 BYUDJET
   $0        →  Chroma · FAISS · pgvector (faqat server)
   $50–200/oy →  Qdrant Cloud · Pinecone Serverless
   $$$        →  boshqariladigan klaster

🗄️ MAVJUD INFRATUZILMA
   PostgreSQL bor  →  ⭐⭐ pgvector (yangi baza KERAK EMAS)
   Kubernetes bor  →  Qdrant / Milvus
   Hech narsa yo'q →  Pinecone (eng tez boshlash)
```

---

## 5. ⚠️ Pinecone bepul tarifining cheklovlari

> **"Bepul versiya faqat 5 ta indeks, 1 loyiha va 1 ish maydonига ruxsat beradi."**

```
Starter (bepul):
   5 indeks · 1 loyiha · 1 ish maydoni
   ⚠️ 2 GB saqlash chegarasi
   💥 FAOLSIZLIKDAN KEYIN indeks O'CHIRILISHI mumkin
```

> ## 💥 **OXIRGI PUNKT — ENG XAVFLI.** Prototipingiz bir necha hafta ishlatilmasa — **ma'lumot yo'qolishi** mumkin.
>
> ## 🏆 **SHUNING UCHUN: MUHIM MA'LUMOT DOIM O'ZINGIZDA SAQLANSIN.** Vektor bazasi — **indeks**, **manba emas**.

---

## 6. 🇺🇿 Bizning sharoitimizda

```
🏦 BANK / 🏥 TIBBIYOT / 🏛️ DAVLAT
   ⭐ pgvector (PostgreSQL allaqachon bor)
   ⭐ Qdrant (self-hosted, Docker bilan bir buyruq)
   ❌ Pinecone — ma'lumot chet el serveriga chiqadi

🚀 STARTAP / PROTOTIP
   ⭐ Chroma — o'rnatish 10 soniya
   ⭐ Qdrant Cloud — bepul tarif yetarli

🎓 O'RGANISH
   ⭐⭐ Chroma — API kaliti kerak emas, hamma narsa mahalliy
```

```bash
# Qdrant — bir buyruq bilan
docker run -p 6333:6333 qdrant/qdrant

# pgvector — mavjud PostgreSQL'ga
CREATE EXTENSION vector;
```

> ## 💡 **VA E'TIBOR BERING — INTERNET TEZLIGI HAM OMIL.** Bulutli bazada har so'rov **tarmoq kechikishi** qo'shadi *(~50–200 ms)*. Mahalliy bazada — **1–2 ms** *(o'lchandi)*.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Kurs qaysi bazani tanlagan va nima uchun?

**M2.** Pinecone'ning asosiy zaif tomoni?

**M3.** `pgvector` nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Pinecone** — **soddaligi** va **boshqariladigan** *(managed)* bo'lgani uchun.

**M2.** ## 💰 **Narx** va **sozlash cheklangan** *(managed service)*.

**M3.** ## **PostgreSQL kengaytmasi** — SQL va vektor **bir bazada**.

</details>

### 🟡 O'rta

**M4.** ⭐ Chroma va Pinecone interfeyslarini yonma-yon yozing.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

TAQQOSLASH = [
    ("Ulanish", "Pinecone(api_key=...)",
     "chromadb.PersistentClient(path=...)"),
    ("Indeks yaratish", "pc.create_index(name, dimension, metric, spec)",
     "client.create_collection(name, metadata={'hnsw:space': 'cosine'})"),
    ("Ro'yxat", "pc.list_indexes()", "client.list_collections()"),
    ("O'chirish", "pc.delete_index(name)", "client.delete_collection(name)"),
    ("Yozish", "index.upsert(vectors=[(id, vec, meta)])",
     "coll.add(ids=, embeddings=, metadatas=)"),
    ("Qidiruv", "index.query(vector=, top_k=, include_metadata=True)",
     "coll.query(query_embeddings=, n_results=)"),
    ("Natija", "⭐ o'xshashlik (katta=yaxshi)", "💥 masofa (kichik=yaxshi)"),
]
d = pd.DataFrame(TAQQOSLASH, columns=["amal", "Pinecone", "Chroma"])
print(d.to_string(index=False))
print("\n💥 ASOSIY FARQ — NATIJA FORMATI: Chroma'da 1 − masofa qiling")
```

</details>

**M5.** ⭐ Chroma bilan indeks yaratib, o'chiring.

<details>
<summary>✅ Yechim</summary>

```python
import chromadb, shutil

shutil.rmtree("./vdb-demo", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-demo")

print("boshlang'ich:", [c.name for c in client.list_collections()])

# ── yaratish ──
coll = client.create_collection("my-index",
                                metadata={"hnsw:space": "cosine"})
print("yaratildi  :", [c.name for c in client.list_collections()])
print("hujjatlar  :", coll.count())

# ── ikkinchi indeks ──
client.create_collection("my-index-2", metadata={"hnsw:space": "l2"})
print("ikkitasi   :", [c.name for c in client.list_collections()])

# ── o'chirish ──
client.delete_collection("my-index-2")
print("o'chirildi :", [c.name for c in client.list_collections()])

# ── mavjudligini tekshirish (kursning naqshi) ──
nom = "my-index"
if nom in [c.name for c in client.list_collections()]:
    client.delete_collection(nom)
    print(f"{nom} muvaffaqiyatli o'chirildi.")
else:
    print(f"{nom} ro'yxatda yo'q.")
```

## 🔑 **AYNAN KURSNING MANTIQI** — faqat Pinecone o'rniga **Chroma**.

</details>

**M6.** ⭐⭐ Mahalliy va bulutli kechikishni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import time, numpy as np, chromadb, shutil

rng = np.random.default_rng(365)
V = rng.normal(size=(5000, 384)).astype("float32")
V /= np.linalg.norm(V, axis=1, keepdims=True)

shutil.rmtree("./vdb-latency", ignore_errors=True)
c = chromadb.PersistentClient(path="./vdb-latency")
coll = c.create_collection("latency-test",
                           metadata={"hnsw:space": "cosine"})
coll.add(ids=[str(i) for i in range(len(V))], embeddings=V.tolist())

t0 = time.perf_counter()
for _ in range(50):
    coll.query(query_embeddings=[V[0].tolist()], n_results=10)
mahalliy = (time.perf_counter() - t0) / 50 * 1000

print(f"⚡ mahalliy Chroma : {mahalliy:.2f} ms")
print(f"🌐 bulut (taxminiy): {mahalliy + 80:.2f} ms  (+80 ms tarmoq)")
print(f"   farq            : {(mahalliy + 80) / mahalliy:.0f}×")
print("\n💡 1000 so'rov/kun × 80 ms = kuniga 80 soniya kutish")
print("🇺🇿 va O'zbekistondan AQSh serverigacha kechikish YANADA katta")
```

**Haqiqiy natija:**

```
⚡ mahalliy Chroma : 0.94 ms
🌐 bulut (taxminiy): 80.94 ms  (+80 ms tarmoq)
   farq            : 86×
```

## 💥 **86× FARQ.** Va bu — **optimistik** baho: O'zbekistondan AQSh serveriga kechikish odatda **150–250 ms**.

## 🏆 **MAHALLIY BAZA — FAQAT MAXFIYLIK EMAS, TEZLIK HAM.**

</details>

---

## 📌 Xulosa

| Hajm | Tanlov |
|---|---|
| < 1 000 | ## **numpy** |
| < 1 000 000 | ## ⭐ **Chroma / pgvector** |
| < 100 000 000 | Qdrant / Milvus / Pinecone |
| > 100 000 000 | Milvus klaster |

```
🇺🇿 MAXFIYLIK KERAK  →  ⭐ pgvector · Qdrant · Chroma (MAHALLIY)
🗄️ PostgreSQL BOR    →  ⭐⭐ pgvector (yangi baza KERAK EMAS)
🚀 TEZ BOSHLASH      →  Pinecone yoki Chroma

💥 Pinecone bepul tarif: 5 indeks · 2 GB · faolsizlikda O'CHIRILISHI mumkin
🏆 VEKTOR BAZASI — INDEKS, MANBA EMAS. Asl ma'lumot SQL'da saqlansin.
```

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Pinecone'ga ro'yxatdan o'tish](02-Pinecone-Registration-and-Index.md)
