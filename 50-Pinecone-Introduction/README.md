# 🌲 50-modul. Pinecone bilan tanishuv

> ## ⭐⭐ **KURS PINECONE ISHLATADI — BIZ MAHALLIY CHROMA'DA.** Natija **bir xil**, API kaliti **kerak emas**.
>
> ## 🏆 **PINECONE KODI HAM TO'LIQ KO'RSATILADI** — kalit olsangiz, darhol ishlatasiz.

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [Bazalarni taqqoslash](01-Vector-Databases-Comparison.md) ⭐⭐ | Pinecone · Milvus · Weaviate · Qdrant · ## ⭐ **pgvector** |
| 2 | [Ro'yxatdan o'tish va indeks](02-Pinecone-Registration-and-Index.md) ⭐ | `dimension` · `metric` · ## 🔒 **xavfsizlik** |
| 3 | [Python bilan ulanish](03-Connecting-with-Python.md) ⭐ | `.env` · ## ⭐ **universal adapter** |
| 4 | [Indeks yaratish/o'chirish](04-Creating-and-Deleting-Index.md) ⭐ | ## 💥 **"o'chir va yarat" xavfi** · nomlash |
| 5 | [Upsert](05-Upserting-Data.md) ⭐⭐ | ## ⭐ **barqaror ID** · batch · metadata |
| 6 | [Katta ma'lumot](06-Large-Dataset-Upserting.md) ⭐⭐⭐ | ## 💥 **kursning 3 muammosi** · oqimli indekslash |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**20 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**2 ta mini-loyiha**](LOYIHALAR.md) | 🔌 **universal adapter** · 📥 **oqimli indekslovchi** |

---

## 🧭 Pinecone ↔ Chroma

| Amal | ☁️ Pinecone | ## ⭐ Chroma |
|---|---|---|
| Ulanish | `Pinecone(api_key=...)` | `chromadb.PersistentClient(path=...)` |
| Yaratish | `pc.create_index(name, dimension, metric, spec)` | `client.create_collection(name, metadata={...})` |
| Yozish | `index.upsert(vectors=[(id, vec, meta)])` | `coll.upsert(ids=, embeddings=, metadatas=)` |
| Qidiruv | `index.query(vector=, top_k=)` | `coll.query(query_embeddings=, n_results=)` |
| ## **Natija** | ## ⭐ **o'xshashlik** *(katta = yaxshi)* | ## 💥 **masofa** *(kichik = yaxshi)* |

```python
oxshashlik = 1 - masofa          # ⭐ Chroma uchun SHART
```

---

## 📊 Modulda o'lchangan hamma narsa

| O'lchov | Natija |
|---|---|
| Mahalliy Chroma qidiruvi | ## ⚡ **0.94 ms** |
| Bulut *(taxminiy +80 ms)* | ## **86× sekinroq** |
| Chroma nom qoidasi | ## **3–512 belgi** · `[a-zA-Z0-9._-]` · boshi/oxiri harf-raqam |
| Hayvonlar qidiruvi | ## ✅ **1.0000 · 0.9355 · 0.7276** — 49-modul bilan **aynan** |
| Metadata: `str/int/float/bool` | ## ✅ ruxsat |
| Metadata: `list`, `None` | ## ✅ **ruxsat** *(chromadb 1.5.9)* |
| Metadata: `dict` | ## 💥 `ValueError` |
| Bir chaqiruvda takror ID | ## 💥 `DuplicateIDError` |
| Alohida chaqiruvda ayni ID | ## ⭐ **yangilanadi** *(dublikat yo'q)* |
| O'lcham mos kelmasa | ## 💥 `InvalidArgumentError` |
| Embedding: bitta-bitta | 0.87 s *(229/s)* |
| Embedding: `batch_size=64` | ## ⭐ **0.11 s** *(1842/s)* — **8× tez** |
| Natijalar bir xilmi? | ## ✅ `np.allclose` → **True** |

---

## 💥 Kurs aytmagan 7 ta narsa

```
① ⭐ pgvector — SQL va vektor BIR bazada (kursda umuman yo'q)

② 💥 "bor bo'lsa o'chir, keyin yarat" — ishlab chiqarishda XAVFLI
     → get_or_create_collection() · tasdiqlash · versiyalash

③ 💥 O'lcham MOS, lekin MODEL boshqa → xato CHIQMAYDI, natija MA'NOSIZ
     → model nomini METADATA'ga yozing

④ 💥 Kursning embeddingi BITTA-BITTA — 8× sekin (o'lchandi)

⑤ 💥 Kursning kodi hammasini RAMga to'playdi — 1M yozuvda 1.5 GB

⑥ 💥 256 token chegarasi — FineWeb maqolalari JIMGINA kesiladi

⑦ ⭐ Namespace / metadata filtri — 🌐 til · 👥 mijoz · 📅 versiya bo'yicha
```

---

## 🇺🇿 Baza tanlash

```
🏦 BANK / 🏥 TIBBIYOT / 🏛️ DAVLAT
   ⭐ pgvector (PostgreSQL bor bo'lsa) · Qdrant (Docker) · Chroma
   ❌ Pinecone — ma'lumot chet el serveriga CHIQADI

📊 HAJM
   < 1 000        →  numpy (vektor DB ORTIQCHA)
   < 1 000 000    →  ⭐ Chroma / pgvector
   > 1 000 000    →  Qdrant / Milvus / Pinecone

⚡ TEZLIK
   mahalliy 0.94 ms · bulut ~80 ms  →  86× farq (o'lchandi)
```

---

## ⚙️ O'rnatish

```bash
pip install chromadb sentence-transformers        # ⭐ kalitsiz
pip install pinecone python-dotenv                # ☁️ Pinecone bilan
```

```python
# ⭐ Universal — kalit bor bo'lsa Pinecone, yo'q bo'lsa Chroma
def vektor_baza(nom="my-index", olcham=384, metrika="cosine"):
    import os
    if os.getenv("PINECONE_API_KEY"):
        from pinecone import Pinecone, ServerlessSpec
        pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        if nom not in [i.name for i in pc.list_indexes()]:
            pc.create_index(name=nom, dimension=olcham, metric=metrika,
                            spec=ServerlessSpec(cloud="aws",
                                                region="us-east-1"))
        return pc.Index(nom), "pinecone"
    import chromadb
    client = chromadb.PersistentClient(path="./vdb")
    return client.get_or_create_collection(
        nom, metadata={"hnsw:space": metrika}), "chroma"
```

---

## 📌 Modulning bitta xulosasi

> ## 🏆🏆 **VEKTOR BAZASI — INDEKS, MANBA EMAS.**
>
> ```
> Asl ma'lumot   →  SQL / fayl tizimi (ACID, zaxira nusxa)
> Vektor bazasi  →  ⭐ id + vektor + qidiruv metadatasi
> ```
>
> ## 💥 **SHUNING UCHUN:** indeks yo'qolsa — **qayta qurasiz**. Asl ma'lumot yo'qolsa — **tamom**.
>
> ## ⚠️ **VA PINECONE BEPUL TARIFIDA INDEKS FAOLSIZLIKDAN KEYIN O'CHIRILISHI MUMKIN.**

---

⬅️ [49-modul. Vektor fazosi](../49-Vector-Space-Basics/README.md) · 🏠 [Kurs boshiga](../README.md) · ➡️ [51-modul. Case study](../51-Semantic-Search-Case-Study/README.md)
