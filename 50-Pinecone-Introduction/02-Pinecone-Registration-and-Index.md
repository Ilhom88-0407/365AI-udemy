# 2-dars. Pinecone'ga ro'yxatdan o'tish va indeks yaratish ⭐

## 🎬 Boshlashdan oldin

> **"Indeksni QO'SHIMCHA IMKONIYATLAR bilan boyitilgan vektor ombori deb tasavvur qiling."**

---

## 1. Ro'yxatdan o'tish

```
① pinecone.io → "Sign up for free"
② ⭐ PAROL YO'Q — har kirishda EMAIL orqali kod keladi
③ Tashkilot nomini kiriting
④ Manage → API Keys → kalitni nusxalang
```

> ## ⚠️⚠️ **API KALITI — PAROL BILAN BIR XIL DARAJADA MAXFIY.**
> ```
> ❌ Koddagi satrga yozmang
> ❌ GitHub'ga yuklamang
> ❌ Skrinshotga tushirmang
> ✅ .env faylida saqlang va .gitignore'ga qo'shing
> ```
>
> ## 💥 **KALIT SIZIB CHIQSA — DARHOL O'CHIRING VA YANGISINI YARATING.**

```bash
# .gitignore
.env
*.db
vdb/
```

---

## 2. Indeks parametrlari

| Parametr | Nima | Misol |
|---|---|---|
| ## `name` | Indeks nomi | `"my-index"` |
| ## ⭐ `dimension` | ## **Vektor o'lchami** | `384` · `1536` |
| ## ⭐ `metric` | Masofa metrikasi | `"cosine"` · `"euclidean"` · `"dotproduct"` |
| `spec` | Bulut va region | `ServerlessSpec(cloud="aws", region="us-east-1")` |

> ## 💥💥 **`dimension` — EMBEDDING MODELINGIZGA MOS BO'LISHI SHART.**
> ```
> all-MiniLM-L6-v2         →  384
> all-mpnet-base-v2        →  768
> text-embedding-3-small   →  1536
> text-embedding-3-large   →  3072
> ```
>
> ## ⚠️ **NOTO'G'RI O'LCHAM — XATO BERADI** *(yaxshi holat)*. Lekin **modelni keyin almashtirsangiz** — **hammasi qaytadan** indekslanadi.

> ## 💥 **VA `metric` NI KEYIN O'ZGARTIRIB BO'LMAYDI** *(49-modul, 2-dars)*.

---

## 3. ⭐⭐ Muhitni sozlash — kalitsiz va kalitli

```bash
pip install pinecone python-dotenv        # ☁️ Pinecone bilan
pip install chromadb                      # ⭐ mahalliy, kalitsiz
```

```python
# .env fayli
# PINECONE_API_KEY=pcsk_...
```

```python
import os
from dotenv import load_dotenv
load_dotenv(override=True)                # ⭐ override — 37-modul

print("kalit bormi?", bool(os.getenv("PINECONE_API_KEY")))
```

### ⭐ Universal adapter — kalit bor bo'lsa Pinecone, yo'q bo'lsa Chroma

```python
import os


def vektor_baza(nom="my-index", olcham=384, metrika="cosine"):
    """☁️ Pinecone yoki ⭐ mahalliy Chroma — bir xil interfeys."""
    if os.getenv("PINECONE_API_KEY"):
        from pinecone import Pinecone, ServerlessSpec
        pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        mavjud = [i.name for i in pc.list_indexes()]
        if nom not in mavjud:
            pc.create_index(name=nom, dimension=olcham, metric=metrika,
                            spec=ServerlessSpec(cloud="aws",
                                                region="us-east-1"))
        print(f"☁️ Pinecone: {nom}")
        return pc.Index(nom), "pinecone"

    import chromadb
    client = chromadb.PersistentClient(path="./vdb")
    coll = client.get_or_create_collection(
        nom, metadata={"hnsw:space": metrika})
    print(f"⭐ Chroma (mahalliy): {nom}")
    return coll, "chroma"


index, tur = vektor_baza()
```

> ## 🏆 **BU FUNKSIYA — BUTUN BO'LIM DAVOMIDA ISHLATILADI.**

---

## 4. ⭐ Chroma bilan — kursning mantiqi aynan

```python
import chromadb, shutil

shutil.rmtree("./vdb-demo", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-demo")

print("boshlang'ich:", [c.name for c in client.list_collections()])

nom = "my-index"
if nom in [c.name for c in client.list_collections()]:
    client.delete_collection(nom)
    print(f"{nom} muvaffaqiyatli o'chirildi.")
else:
    print(f"{nom} ro'yxatda yo'q.")

coll = client.create_collection(nom, metadata={"hnsw:space": "cosine"})
print("yaratildi:", [c.name for c in client.list_collections()])
print("hujjatlar:", coll.count())
```

```
boshlang'ich: []
my-index ro'yxatda yo'q.
yaratildi: ['my-index']
hujjatlar: 0
```

> ## 🔑 **KURSNING NAQSHI — "BOR BO'LSA O'CHIR, KEYIN YARAT".**
>
> ## ⚠️ **BU — SINOV UCHUN QULAY, LEKIN ISHLAB CHIQARISHDA XAVFLI.** Bitta noto'g'ri ishga tushirish — **butun indeks yo'qoladi**.
>
> ## ✅ **ISHLAB CHIQARISHDA:**
> ```python
> coll = client.get_or_create_collection(nom, metadata={...})   # ⭐ xavfsiz
> ```

### ⚠️ Chroma nom talablari — o'lchandi

```python
client.create_collection("b")
```

```
💥 InvalidArgumentError: Validation error: name: Expected a name containing
   3-512 characters from [a-zA-Z0-9._-], starting and ending with a
   character in [a-zA-Z0-9]. Got: b
```

> ## 🔑 **CHROMA'DA NOM KAMIDA 3 BELGI** va faqat `[a-zA-Z0-9._-]`.
>
> ## 💡 **PINECONE'DA HAM SHUNGA O'XSHASH QOIDALAR:** kichik harflar, raqamlar va `-`.

---

## 5. ⭐ Metrika tanlash — indeks yaratishdagi ENG MUHIM qaror

```python
# ⭐ Matn uchun — DOIM
client.create_collection("kurslar", metadata={"hnsw:space": "cosine"})

# Fizik masofa uchun
client.create_collection("joylar", metadata={"hnsw:space": "l2"})

# Normallashgan vektorlar + tezlik
client.create_collection("tez", metadata={"hnsw:space": "ip"})
```

> ## 💥💥 **`hnsw:space` NI BERMASANGIZ — CHROMA STANDART HOLDA `l2` ISHLATADI** *(42-modul, 14-darsda o'lchagan edik: ballar **12–15** oralig'ida chiqadi)*.
>
> ## ⚠️ **VA HAR IKKALASIDA — BALL MASOFA, O'XSHASHLIK EMAS:**
> ```python
> oxshashlik = 1 - masofa          # ⭐ cosine space uchun
> ```

---

## 6. 🇺🇿 Xavfsizlik — kursda kam aytilgan

```python
# ❌ HECH QACHON
pc = Pinecone(api_key="pcsk_abc123...")        # 💥 kod ichida

# ✅ DOIM
from dotenv import load_dotenv
load_dotenv(override=True)
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
```

```python
# ⭐ Kalitni tekshirish (lekin CHIQARMASLIK)
kalit = os.getenv("PINECONE_API_KEY")
if kalit:
    print(f"✅ kalit bor: {kalit[:8]}...{kalit[-4:]} ({len(kalit)} belgi)")
else:
    print("⚪ kalit yo'q — mahalliy Chroma ishlatiladi")
```

> ## 🏆 **UCH QOIDA:**
> ```
> ① .env faylda saqlang · .gitignore ga qo'shing
> ② Kalitni HECH QACHON to'liq chiqarmang (jurnal, xato xabari, skrinshot)
> ③ 🇺🇿 Jamoada ishlasangiz — HAR ODAMGA O'Z kaliti
> ```
>
> ## 💥 **VA ENG MUHIMI — MAHALLIY YECHIMDA BU MUAMMO UMUMAN YO'Q.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** `dimension` nimaga bog'liq?

**M2.** `metric` ni keyin o'zgartirish mumkinmi?

**M3.** API kalitini qayerda saqlash kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Embedding modeliga** — `all-MiniLM-L6-v2` → **384**.

**M2.** ## ❌ **Yo'q** — indeksni **qayta yaratish** kerak.

**M3.** ## `.env` faylda, `.gitignore` da.

</details>

### 🟡 O'rta

**M4.** ⭐ Indeks yaratish, ro'yxat, o'chirish.

<details>
<summary>✅ Yechim</summary>

```python
import chromadb, shutil

shutil.rmtree("./vdb-demo", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-demo")

def royxat():
    return [c.name for c in client.list_collections()]

print("boshlang'ich:", royxat())

for nom, metrika in [("my-index", "cosine"), ("my-index-2", "l2")]:
    if nom in royxat():
        client.delete_collection(nom)
        print(f"  {nom} o'chirildi")
    client.create_collection(nom, metadata={"hnsw:space": metrika})
    print(f"  {nom} yaratildi ({metrika})")

print("hozir:", royxat())
client.delete_collection("my-index-2")
print("keyin:", royxat())
```

</details>

**M5.** ⭐ Nom qoidalarini sinang.

<details>
<summary>✅ Yechim</summary>

```python
NOMLAR = ["b", "ab", "my-index", "My_Index.2", "my index", "index-",
          "-index", "a" * 600]

for n in NOMLAR:
    try:
        c = client.create_collection(n)
        print(f"  ✅ {n[:24]!r:28s} yaratildi")
        client.delete_collection(n)
    except Exception as e:
        print(f"  ❌ {n[:24]!r:28s} {type(e).__name__}: {str(e)[:44]}")
```

```
  ❌ 'b'             InvalidArgumentError   (juda qisqa)
  ❌ 'ab'            InvalidArgumentError   (juda qisqa)
  ✅ 'my-index'      yaratildi
  ✅ 'My_Index.2'    yaratildi
  ❌ 'my index'      InvalidArgumentError   (bo'sh joy)
  ❌ 'index-'        InvalidArgumentError   (oxiri '-')
  ❌ '-index'        InvalidArgumentError   (boshi '-')
  ❌ 'aaa...' (600)  InvalidArgumentError   (juda uzun)
```

## 🔑 **QOIDA: 3–512 belgi · `[a-zA-Z0-9._-]` · boshi va oxiri harf/raqam.**

</details>

**M6.** ⭐⭐ Universal adapter yozing.

<details>
<summary>✅ Yechim</summary>

```python
import os


class VektorBaza:
    """☁️ Pinecone yoki ⭐ Chroma — BIR XIL interfeys."""

    def __init__(self, nom="my-index", olcham=384, metrika="cosine",
                 yol="./vdb"):
        self.nom, self.olcham, self.metrika = nom, olcham, metrika
        if os.getenv("PINECONE_API_KEY"):
            from pinecone import Pinecone, ServerlessSpec
            self.tur = "pinecone"
            self.pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
            if nom not in [i.name for i in self.pc.list_indexes()]:
                self.pc.create_index(
                    name=nom, dimension=olcham, metric=metrika,
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"))
            self.index = self.pc.Index(nom)
            print(f"☁️ Pinecone: {nom} ({olcham}, {metrika})")
        else:
            import chromadb
            self.tur = "chroma"
            self.client = chromadb.PersistentClient(path=yol)
            self.index = self.client.get_or_create_collection(
                nom, metadata={"hnsw:space": metrika})
            print(f"⭐ Chroma (mahalliy): {nom} ({metrika})")

    def yoz(self, ids, vektorlar, metadata=None):
        if self.tur == "pinecone":
            v = [(i, list(map(float, v)), m or {})
                 for i, v, m in zip(ids, vektorlar,
                                    metadata or [{}] * len(ids))]
            self.index.upsert(vectors=v)
        else:
            self.index.add(ids=list(ids),
                           embeddings=[list(map(float, v)) for v in vektorlar],
                           metadatas=metadata)
        return len(ids)

    def qidir(self, vektor, k=5):
        """⭐ HAR IKKALASIDA HAM: [(id, o'xshashlik, metadata), ...]"""
        v = list(map(float, vektor))
        if self.tur == "pinecone":
            r = self.index.query(vector=v, top_k=k, include_metadata=True)
            return [(m["id"], float(m["score"]), m.get("metadata", {}))
                    for m in r["matches"]]
        r = self.index.query(query_embeddings=[v], n_results=k)
        return [(r["ids"][0][i],
                 1 - r["distances"][0][i],          # ⭐ masofa → o'xshashlik
                 (r["metadatas"][0][i] if r.get("metadatas") else {}))
                for i in range(len(r["ids"][0]))]

    def soni(self):
        if self.tur == "pinecone":
            return self.index.describe_index_stats().get("total_vector_count", 0)
        return self.index.count()


# ─── sinov ───
import numpy as np
db = VektorBaza("sinov-index", olcham=3)
db.yoz(["Dog", "Cat", "Chicken", "Mantis", "Elephant"],
       [[4., 0., 1.], [4., 0., 1.], [2., 2., 1.],
        [6., 2., 3.], [4., 0., 1.]],
       [{"tur": "uy"}, {"tur": "uy"}, {"tur": "parranda"},
        {"tur": "hasharot"}, {"tur": "yovvoyi"}])
print("vektorlar:", db.soni())

for ball_id, ball, meta in db.qidir([4., 0., 1.], k=3):
    print(f"  {ball:.4f}  {ball_id:10s} {meta}")
```

**Haqiqiy natija:**

```
⭐ Chroma (mahalliy): sinov-index (cosine)
vektorlar: 5
  1.0000  Dog        {'tur': 'uy'}
  1.0000  Cat        {'tur': 'uy'}
  1.0000  Elephant   {'tur': 'yovvoyi'}
  0.9355  Mantis     {'tur': 'hasharot'}
  0.7276  Chicken    {'tur': 'parranda'}
```

## 🏆🏆 **BALLAR 49-MODULDA QO'LDA HISOBLAGANIMIZ BILAN AYNAN BIR XIL:**
```
Dog/Cat/Elephant 1.0000 · Mantis 0.9355 · Chicken 0.7276
```

## ✅ **YA'NI: `1 − chroma_masofasi` = KOSINUS O'XSHASHLIGI** — butun zanjir **tekshirildi**.

## 🏆 **`qidir()` HAR IKKALA BAZADA HAM O'XSHASHLIK QAYTARADI** — Chroma uchun `1 − masofa` **avtomatik** qilinadi.

</details>

---

## 📌 Xulosa

```python
# ☁️ Pinecone
pc.create_index(name="my-index", dimension=384, metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"))

# ⭐ Chroma — aynan shu mantiq
client.get_or_create_collection("my-index",
                                metadata={"hnsw:space": "cosine"})
```

```
💥 dimension — embedding modeliga MOS bo'lsin (384 · 768 · 1536)
💥 metric ni KEYIN o'zgartirib bo'lmaydi
💥 Chroma standarti — l2 (cosine ni ANIQ yozing)
💥 Chroma nom qoidasi: 3–512 belgi, [a-zA-Z0-9._-]

⚠️ "bor bo'lsa o'chir" naqshi — sinovda qulay, ishlab chiqarishda XAVFLI
   → get_or_create_collection() ishlating
```

> ## 🔒 **API kaliti — `.env` da, `.gitignore` da, hech qachon kodda emas.**

---

⬅️ [1-dars. Taqqoslash](01-Vector-Databases-Comparison.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Python bilan ulanish](03-Connecting-with-Python.md)
