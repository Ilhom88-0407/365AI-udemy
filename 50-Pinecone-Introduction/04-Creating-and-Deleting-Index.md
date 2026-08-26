# 4-dars. Indeks yaratish va o'chirish (Python) ⭐

## 🎬 Boshlashdan oldin

> **"Indeks mavjud bo'lsa — o'chiramiz, keyin yangisini yaratamiz."**

---

## 1. Kursning kodi

```python
index_name = "my-index"
dimension = 3
metric = "cosine"

# ── mavjudligini tekshirish ──
if index_name in [index.name for index in pc.list_indexes()]:
    pc.delete_index(index_name)
    print(f"{index_name} succesfully deleted.")
else:
    print(f"{index_name} not in index list.")

# ── yaratish ──
pc.create_index(
    name=index_name,
    dimension=dimension,
    metric=metric,
    spec=ServerlessSpec(cloud="aws", region="us-east-1"))

pc.list_indexes()
```

> ## 🔑 **`dimension = 3` — O'QUV UCHUN.** Haqiqiy embeddinglar **384–3072** o'lchamli.
>
> ## ⭐ **KURS IKKINCHI INDEKSNI HAM YARATADI:**
> ```python
> index_name_2 = "my-index-2"
> dimension_2 = 1536              # ⭐ OpenAI o'lchami
> metric_2 = "euclidean"          # ⭐ BOSHQA metrika
> ```

---

## 2. ⭐ Mahalliy variant — aynan shu mantiq

```python
import chromadb, shutil

shutil.rmtree("./vdb-lesson", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-lesson")


def royxat():
    return [c.name for c in client.list_collections()]


def yarat(nom, olcham, metrika):
    """Kursning 'bor bo'lsa o'chir, keyin yarat' naqshi."""
    if nom in royxat():
        client.delete_collection(nom)
        print(f"{nom} muvaffaqiyatli o'chirildi.")
    else:
        print(f"{nom} ro'yxatda yo'q.")
    # ⭐ Chroma o'lchamni oldindan talab qilmaydi — birinchi add() da aniqlanadi
    return client.create_collection(nom, metadata={"hnsw:space": metrika,
                                                   "olcham": olcham})


print("boshlang'ich:", royxat())
c1 = yarat("my-index", 3, "cosine")
print("hozir:", royxat())
c2 = yarat("my-index-2", 1536, "l2")
print("ikkitasi:", royxat())
```

```
boshlang'ich: []
my-index ro'yxatda yo'q.
hozir: ['my-index']
my-index-2 ro'yxatda yo'q.
ikkitasi: ['my-index', 'my-index-2']
```

> ## 💥💥 **MUHIM FARQ:**
> ```
> Pinecone  →  dimension OLDINDAN e'lon qilinadi va MAJBURIY tekshiriladi
> Chroma    →  ⚠️ o'lcham BIRINCHI add() da aniqlanadi
> ```
>
> ## ⚠️ **YA'NI CHROMA'DA NOTO'G'RI O'LCHAM KEYINROQ CHIQADI:**
> ```python
> coll = client.create_collection("test")
> coll.add(ids=["1"], embeddings=[[1., 2., 3.]])       # o'lcham = 3
> coll.add(ids=["2"], embeddings=[[1., 2., 3., 4.]])   # 💥 XATO
> ```

---

## 3. ⭐⭐ Indeks ma'lumotini ko'rish

```python
# ☁️ Pinecone
for i in pc.list_indexes():
    print(f"{i.name:16s} o'lcham {i.dimension:5d} · metrika {i.metric:10s} "
          f"· {i.status['state']}")
print(pc.describe_index("my-index"))
print(index.describe_index_stats())      # ⭐ vektorlar soni
```

```python
# ⭐ Chroma
for c in client.list_collections():
    coll = client.get_collection(c.name)
    metrika = (c.metadata or {}).get("hnsw:space", "l2")
    print(f"{c.name:16s} {coll.count():6d} vektor · metrika {metrika}")
```

> ## 🔑 **`describe_index_stats()` — PINECONE'DA ENG FOYDALI METOD:**
> ```python
> {'dimension': 384,
>  'index_fullness': 0.0,
>  'namespaces': {'': {'vector_count': 680}},
>  'total_vector_count': 680}
> ```
>
> ## 💡 **`index_fullness` — BEPUL TARIFDA 1.0 GA YETSA, YOZISH TO'XTAYDI.**

---

## 4. ⚠️⚠️ "O'chir va yarat" naqshi — jiddiy xavf

```python
# ❌ KURSNING NAQSHI — sinovda qulay, ishlab chiqarishda XAVFLI
if nom in royxat():
    client.delete_collection(nom)      # 💥 BUTUN INDEKS YO'QOLADI
client.create_collection(nom)
```

> ## 💥 **STSENARIY:**
> ```
> ① Notebook'ni yuqoridan pastga ishga tushirasiz
> ② 1 million vektorli indeks O'CHIRILADI
> ③ Qayta indekslash — 3 soat va $50
> ```

### ✅ Xavfsiz variantlar

```python
# ⭐ ① Bor bo'lsa oling, yo'q bo'lsa yarating
coll = client.get_or_create_collection(nom, metadata={"hnsw:space": "cosine"})

# ⭐ ② Aniq tasdiqlash bilan
def xavfsiz_ochir(client, nom, tasdiq=False):
    if nom not in [c.name for c in client.list_collections()]:
        print(f"'{nom}' yo'q")
        return False
    n = client.get_collection(nom).count()
    if n > 0 and not tasdiq:
        print(f"💥 '{nom}' da {n:,} vektor bor!")
        print(f"   O'chirish uchun: xavfsiz_ochir(client, '{nom}', tasdiq=True)")
        return False
    client.delete_collection(nom)
    print(f"✅ '{nom}' o'chirildi ({n:,} vektor)")
    return True

# ⭐ ③ Yangi versiya yarating, eskisini SAQLANG
import time
yangi = f"{nom}-v{int(time.time())}"
client.create_collection(yangi, metadata={"hnsw:space": "cosine"})
# ... to'ldiring, sinang ...
# ... faqat KEYIN eskisini o'chiring
```

> ## 🏆 **③ — "KO'K/YASHIL" JOYLASHTIRISH NAQSHI.** Yangi indeks **tayyor bo'lgunicha** eskisi **ishlab turadi**.

---

## 5. ⭐ O'lcham mos kelmasligi — o'lchandi

```python
coll = client.create_collection("olcham-sinov")
coll.add(ids=["1"], embeddings=[[1., 2., 3.]])
print("birinchi qo'shildi (o'lcham 3)")

try:
    coll.add(ids=["2"], embeddings=[[1., 2., 3., 4.]])
except Exception as e:
    print("💥", type(e).__name__, ":", str(e)[:100])
```

> ## 💥 **VA BU — ENG YOMON HOLAT EMAS.**
>
> ## ⚠️⚠️ **ENG YOMONI — O'LCHAM MOS, LEKIN MODEL BOSHQA:**
> ```
> Indeks:  all-MiniLM-L6-v2 bilan to'ldirilgan        (384)
> So'rov:  paraphrase-multilingual bilan qilingan     (384)
>          →  o'lcham MOS
>          →  💥 XATO CHIQMAYDI
>          →  💥 NATIJALAR MA'NOSIZ
> ```
>
> ## ✅ **YECHIM — MODEL NOMINI METADATA'GA YOZING** *(42-modul, 12-dars)*:
> ```python
> client.create_collection(nom, metadata={
>     "hnsw:space": "cosine",
>     "model": "all-MiniLM-L6-v2",         # ⭐ SHART
>     "olcham": 384})
> ```
> ```python
> # ── yuklashda tekshirish ──
> c = client.get_collection(nom)
> if (c.metadata or {}).get("model") != MODEL_NOMI:
>     raise RuntimeError(f"💥 MODEL MOS EMAS: baza {c.metadata.get('model')}, "
>                        f"hozir {MODEL_NOMI}")
> ```

---

## 6. 🇺🇿 Indeks nomlash konvensiyasi

```
# ❌ Yomon
"my-index" · "test" · "index2" · "data"

# ✅ Yaxshi — nima, qaysi model, qaysi versiya
"kurslar-minilm-v1"
"bolimlar-multilingual-v2"
"mijozlar-e5large-v1"
```

> ## 🏆 **UCH QISM:**
> ```
> ① NIMA saqlanadi     →  kurslar · bolimlar · mijozlar
> ② QAYSI model        →  ⭐ minilm · multilingual · e5large
> ③ VERSIYA            →  v1 · v2
> ```
>
> ## 💡 **NIMA UCHUN MODEL NOMI?** Modelni almashtirsangiz — **yangi indeks** kerak. Nomida bo'lsa — **chalkashmaydi**.
>
> ## ⚠️ **VA VERSIYA — "KO'K/YASHIL" JOYLASHTIRISH UCHUN.** `v2` ni to'ldirasiz, sinaysiz, keyin ilovani unga o'tkazasiz.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Kursning "bor bo'lsa o'chir" naqshining xavfi?

**M2.** Chroma va Pinecone'da `dimension` farqi?

**M3.** `describe_index_stats()` nima qaytaradi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Butun indeks yo'qolishi** — qayta indekslash **soatlar va pul**.

**M2.** ## Pinecone **oldindan** talab qiladi, Chroma — ## **birinchi `add()` da** aniqlaydi.

**M3.** ## Vektorlar **soni**, o'lcham, `index_fullness`, namespace'lar.

</details>

### 🟡 O'rta

**M4.** ⭐ Ikki indeks yarating va ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
import chromadb, shutil

shutil.rmtree("./vdb-lesson", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-lesson")

INDEKSLAR = [("my-index", 3, "cosine"),
             ("my-index-2", 1536, "l2")]

for nom, olcham, metrika in INDEKSLAR:
    if nom in [c.name for c in client.list_collections()]:
        client.delete_collection(nom)
        print(f"{nom} o'chirildi")
    client.create_collection(nom, metadata={"hnsw:space": metrika,
                                            "olcham": olcham})
    print(f"{nom} yaratildi ({olcham}, {metrika})")

print("\n── ro'yxat ──")
for c in client.list_collections():
    coll = client.get_collection(c.name)
    m = c.metadata or {}
    print(f"  {c.name:14s} {coll.count():6d} vektor · "
          f"{m.get('hnsw:space', 'l2'):8s} · o'lcham {m.get('olcham', '?')}")
```

</details>

**M5.** ⭐ O'lcham mos kelmasligini sinang.

<details>
<summary>✅ Yechim</summary>

```python
coll = client.get_or_create_collection("olcham-sinov")
coll.add(ids=["1"], embeddings=[[1., 2., 3.]])
print("✅ birinchi qo'shildi (o'lcham 3):", coll.count())

for olcham, v in [(3, [4., 5., 6.]), (4, [1., 2., 3., 4.]), (2, [1., 2.])]:
    try:
        coll.add(ids=[f"x{olcham}"], embeddings=[v])
        print(f"  ✅ o'lcham {olcham} qo'shildi")
    except Exception as e:
        print(f"  💥 o'lcham {olcham}: {type(e).__name__}: {str(e)[:60]}")
```

</details>

**M6.** ⭐⭐ Xavfsiz o'chirish funksiyasi.

<details>
<summary>✅ Yechim</summary>

```python
def xavfsiz_ochir(client, nom, tasdiq=False, zaxira=True):
    """O'chirishdan OLDIN ogohlantiradi va ixtiyoriy zaxira oladi."""
    mavjud = [c.name for c in client.list_collections()]
    if nom not in mavjud:
        print(f"⚪ '{nom}' topilmadi. Mavjud: {mavjud}")
        return False

    coll = client.get_collection(nom)
    n = coll.count()
    m = coll.metadata or {}

    print(f"📋 '{nom}': {n:,} vektor · metrika "
          f"{m.get('hnsw:space', 'l2')} · model {m.get('model', '?')}")

    if n > 0 and not tasdiq:
        print(f"💥 {n:,} VEKTOR BOR — o'chirilmadi")
        print(f"   O'chirish: xavfsiz_ochir(client, '{nom}', tasdiq=True)")
        return False

    if zaxira and n > 0:
        import json
        from pathlib import Path
        d = coll.get(include=["metadatas", "documents"])
        yol = Path(f"./zaxira/{nom}.json")
        yol.parent.mkdir(parents=True, exist_ok=True)
        yol.write_text(json.dumps({"ids": d["ids"],
                                   "metadatas": d["metadatas"]},
                                  ensure_ascii=False), encoding="utf-8")
        print(f"   💾 metadata zaxirasi: {yol} ({yol.stat().st_size/1024:.1f} KB)")
        print("   ⚠️ VEKTORLAR zaxiralanmadi — qayta embedding kerak bo'ladi")

    client.delete_collection(nom)
    print(f"✅ '{nom}' o'chirildi")
    return True


coll = client.get_or_create_collection("ochirish-sinov")
coll.add(ids=["1", "2"], embeddings=[[1., 2., 3.], [4., 5., 6.]],
         metadatas=[{"nom": "a"}, {"nom": "b"}])

xavfsiz_ochir(client, "ochirish-sinov")                  # ⚠️ rad etadi
xavfsiz_ochir(client, "ochirish-sinov", tasdiq=True)     # ✅ o'chiradi
```

## 🏆 **UCH HIMOYA:** ma'lumotni **ko'rsatadi** · tasdiqsiz **rad etadi** · metadata **zaxirasini oladi**.

## ⚠️ **VEKTORLAR ZAXIRALANMAYDI** — `include=["embeddings"]` bilan olish mumkin, lekin **fayl juda katta** bo'ladi.

</details>

---

## 📌 Xulosa

```python
# ☁️ Pinecone
pc.create_index(name="kurslar-minilm-v1", dimension=384, metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"))

# ⭐ Chroma — model nomi bilan
client.get_or_create_collection("kurslar-minilm-v1", metadata={
    "hnsw:space": "cosine", "model": "all-MiniLM-L6-v2", "olcham": 384})
```

```
💥 "bor bo'lsa o'chir" — sinovda qulay, ISHLAB CHIQARISHDA XAVFLI
   ✅ get_or_create_collection() · tasdiqlash · versiyalash (v1, v2)

💥 O'lcham MOS, lekin MODEL boshqa → xato CHIQMAYDI, natija MA'NOSIZ
   ✅ model nomini METADATA'ga yozing va yuklashda TEKSHIRING

🏆 Nomlash: {nima}-{model}-{versiya}   →  kurslar-minilm-v1
```

---

⬅️ [3-dars. Python bilan ulanish](03-Connecting-with-Python.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Ma'lumot yozish (upsert)](05-Upserting-Data.md)
