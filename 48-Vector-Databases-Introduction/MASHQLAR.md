# 📝 48-modul mashqlari

> **16 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ.**

## ⚙️ Tayyorgarlik

```bash
pip install sentence-transformers chromadb pandas numpy
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, shutil
import numpy as np, pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb

# ⭐ 51-modul papkasidagi ma'lumot
KURSLAR = "../51-Semantic-Search-Case-Study/course_descriptions.csv"
BOLIMLAR = "../51-Semantic-Search-Case-Study/course_section_descriptions.csv"

def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
```

---

# 🟢 OSON *(1–6)*

**M1.** Semantik qidiruv nima?

**M2.** Uch turdagi bazani ayting.

**M3.** Vektor bazasining uch qismi?

**M4.** HNSW aniqmi?

**M5.** Vektor DB SQL'ni almashtiradimi?

**M6.** CSV fayllar qanday kodirovkada?

<details>
<summary>✅ Javoblar M1–M6</summary>

**M1.** ## **Ma'no bo'yicha** qidiruv — aniq moslik **emas**.

**M2.** ## **SQL** · **NoSQL** · ## ⭐ **Vektor**.

**M3.** ## **ID** · **vektor** · **metadata** *(+ indeks)*.

**M4.** ## ❌ **Taxminiy** *(ANN)* — 100% kafolat **yo'q**.

**M5.** ## ❌ **Yo'q** — u **yangi imkoniyat** qo'shadi.

**M6.** ## `cp1252` — UTF-8 bilan ## 💥 `UnicodeDecodeError`.

</details>

---

# 🟡 O'RTA *(7–13)*

**M7.** ⭐ Ma'lumotni yuklang va tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
kurslar = pd.read_csv(KURSLAR, encoding="cp1252")
bolimlar = pd.read_csv(BOLIMLAR, encoding="cp1252")

print("kurslar :", kurslar.shape, list(kurslar.columns))
print("bo'limlar:", bolimlar.shape)
print("noyob kurs:", bolimlar.course_id.nunique())
print("\nbo'sh qiymatlar:")
print(bolimlar.isna().sum()[lambda x: x > 0].to_string())
print("\ntexnologiyalar:")
print(bolimlar.course_technology.value_counts().to_string())
```

```
kurslar : (106, 6)
bo'limlar: (680, 11)
noyob kurs: 105          ← ⚠️ 106 kurs, LEKIN 105 tasida bo'lim bor

course_instructor_quote    20
```

</details>

**M8.** ⭐ Boshqaruv belgilarini toping.

<details>
<summary>✅ Yechim</summary>

```python
for ustun in ["course_description", "section_description"]:
    n = bolimlar[ustun].map(
        lambda s: ("\r" in str(s)) or ("\n" in str(s))).sum()
    cr = bolimlar[ustun].map(lambda s: str(s).count("\r")).sum()
    print(f"  {ustun:22s} {n:3d}/{len(bolimlar)} qator · {cr:5d} ta \\r")

print("\nnamuna:")
print(repr(bolimlar.section_description.iloc[0][-56:]))
print("tozalangan:")
print(repr(tozala(bolimlar.section_description.iloc[0])[-56:]))
```

```
  course_description     199/680 qator ·  3009 ta \r
  section_description    108/680 qator ·   839 ta \r
```

## 💥 **JAMI 3848 TA `\r`** — tokenlarni **behuda yeydi**.

</details>

**M9.** ⭐ Aniq moslikning cheklovini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
SOROVLAR = ["clustering", "clustering in Python", "unsupervised learning",
            "ML", "K-means", "regression in Python"]

for s in SOROVLAR:
    mos = bolimlar[
        bolimlar.section_name.str.contains(s, case=False, na=False)
        | bolimlar.course_name.str.contains(s, case=False, na=False)]
    belgi = "✅" if len(mos) else "❌"
    print(f"  {belgi} '{s}': {len(mos)} natija")
```

## 💥 **"clustering in Python" — 0 NATIJA**, garchi mavzu **bir necha kursda bor**.

</details>

**M10.** ⭐ Embedding normasini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
for nom in ["all-MiniLM-L6-v2", "paraphrase-multilingual-MiniLM-L12-v2"]:
    m = SentenceTransformer(nom)
    v = m.encode("test")
    n = float(np.linalg.norm(v))
    print(f"  {nom[:38]:38s} o'lcham {len(v)} · norma {n:.4f} · "
          f"maks_token {m.max_seq_length} · "
          f"{'✅' if abs(n-1) < 0.01 else '💥 normaga BO‘LING'}")
```

</details>

**M11.** ⭐⭐ Numpy bilan "vektor bazasi" quring.

<details>
<summary>✅ Yechim</summary>

```python
b = pd.read_csv(BOLIMLAR, encoding="cp1252")
matnlar = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1).tolist()

model = SentenceTransformer("all-MiniLM-L6-v2")
t0 = time.perf_counter()
E = model.encode(matnlar, show_progress_bar=False, batch_size=64)
print(f"embedding: {time.perf_counter()-t0:.1f}s · {E.shape}")

def qidir(savol, k=3):
    q = model.encode(savol)
    ballar = E @ q                          # ⭐ normallashgan → dot = kosinus
    top = np.argsort(-ballar)[:k]
    return [(round(float(ballar[i]), 4), b.iloc[i].course_name,
             b.iloc[i].section_name) for i in top]

for s in ["regression in Python", "SQL joins", "deep learning"]:
    t0 = time.perf_counter()
    r = qidir(s)
    print(f"\n🔍 '{s}'  ({(time.perf_counter()-t0)*1000:.1f} ms)")
    for ball, kurs, bolim in r:
        print(f"   {ball:.4f}  {kurs[:34]:34s} | {bolim[:28]}")
```

## 🏆 **680 QATOR UCHUN VEKTOR BAZASI KERAK EMAS.**

</details>

**M12.** ⭐⭐ Chroma bilan qiling va solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
shutil.rmtree("./vdb-test", ignore_errors=True)
client = chromadb.PersistentClient(path="./vdb-test")
coll = client.create_collection("kurslar",
                                metadata={"hnsw:space": "cosine"})

b["unique_id"] = b.course_id.astype(str) + "-" + b.section_id.astype(str)
t0 = time.perf_counter()
coll.add(ids=b.unique_id.tolist(), embeddings=E.tolist(),
         metadatas=[{"course_name": r.course_name,
                     "section_name": r.section_name}
                    for _, r in b.iterrows()])
print(f"indekslash: {time.perf_counter()-t0:.1f}s · {coll.count()} vektor")

qv = model.encode("regression in Python").tolist()
t0 = time.perf_counter()
r = coll.query(query_embeddings=[qv], n_results=3)
print(f"qidiruv: {(time.perf_counter()-t0)*1000:.1f} ms\n")
for i in range(3):
    oxsh = 1 - r["distances"][0][i]         # ⭐ masofa → o'xshashlik
    m = r["metadatas"][0][i]
    print(f"  {oxsh:.4f}  {m['course_name'][:34]:34s} | {m['section_name'][:28]}")
```

## ⚠️ **CHROMA MASOFA QAYTARADI** — `1 − masofa` bilan **o'xshashlikka** o'tkazing.

</details>

**M13.** ⭐⭐ Xotira hajmini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
MODELLAR = {"all-MiniLM-L6-v2": 384, "all-mpnet-base-v2": 768,
            "text-embedding-3-small": 1536, "text-embedding-3-large": 3072}
q = []
for nom, o in MODELLAR.items():
    for n in (10_000, 1_000_000, 100_000_000):
        q.append({"model": nom[:30], "o'lcham": o, "vektorlar": f"{n:,}",
                  "GB_f32": round(n * o * 4 / 1024**3, 2),
                  "GB_f16": round(n * o * 2 / 1024**3, 2),
                  "GB_int8": round(n * o * 1 / 1024**3, 2)})
d = pd.DataFrame(q)
print(d.to_string(index=False))
print("\n💡 f16 → 2× kam · int8 (kvantlash) → 4× kam (aniqlik biroz pasayadi)")
```

</details>

---

# 🔴 QIYIN *(14–16)*

**M14.** ⭐⭐⭐ Brute force va HNSW ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, time, shutil, chromadb, pandas as pd

def benchmark(N, O=384, haqiqiy=False, model=None, matnlar=None):
    if haqiqiy and model is not None:
        V = model.encode(matnlar[:N], show_progress_bar=False, batch_size=64)
    else:
        rng = np.random.default_rng(365)
        V = rng.normal(size=(N, O)).astype("float32")
    V = V / np.linalg.norm(V, axis=1, keepdims=True)
    q = V[0]

    t0 = time.perf_counter()
    for _ in range(10):
        top_bf = np.argsort(-(V @ q))[:10]
    bf = (time.perf_counter() - t0) / 10 * 1000

    shutil.rmtree("./bench-db", ignore_errors=True)
    c = chromadb.PersistentClient(path="./bench-db")
    coll = c.create_collection("bench-coll",
                               metadata={"hnsw:space": "cosine"})
    t0 = time.perf_counter()
    for i in range(0, len(V), 5000):
        coll.add(ids=[str(x) for x in range(i, min(i + 5000, len(V)))],
                 embeddings=V[i:i + 5000].tolist())
    idx = time.perf_counter() - t0

    t0 = time.perf_counter()
    for _ in range(10):
        r = coll.query(query_embeddings=[q.tolist()], n_results=10)
    hn = (time.perf_counter() - t0) / 10 * 1000
    mos = len(set(top_bf.tolist()) & {int(x) for x in r["ids"][0]})

    return {"N": f"{len(V):,}", "tur": "haqiqiy" if haqiqiy else "tasodifiy",
            "indekslash_s": round(idx, 1),
            "brute_ms": round(bf, 2), "hnsw_ms": round(hn, 2),
            "tezlanish": f"{bf/hn:.1f}×", "aniqlik": f"{mos}/10"}

q = [benchmark(N) for N in (1_000, 10_000, 50_000)]
print(pd.DataFrame(q).to_string(index=False))
print("\n💥 TASODIFIY vektorlarda aniqlik PAST — o'lchamlar la'nati")
print("🏆 HAQIQIY matn bilan qayta sinang: haqiqiy=True, model va matnlar bering")
```

**Bizning o'lchovimiz *(50 000 tasodifiy vektor)*:**

```
indekslash 8.0s · brute force 2.05 ms · HNSW 1.30 ms (2× tez) · aniqlik 3/10
```

## 💥 **IKKI KUTILMAGAN NATIJA:** HNSW atigi **2× tez** *(numpy BLAS juda optimallashtirilgan)* va aniqlik **30%** *(tasodifiy vektorlar — o'lchamlar la'nati)*.

</details>

**M15.** ⭐⭐⭐ Baza tanlash yordamchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class BazaTanlovchi:
    """Talablar asosida DB turini tavsiya qiladi."""

    def tavsiya(self, *, yozuvlar, oxshashlik_kerak, aniq_moslik_kerak,
                tranzaksiya_kerak, maxfiylik_kerak, tez_ozgaradi,
                byudjet="past"):
        sabab, tavsiyalar = [], []

        if tranzaksiya_kerak:
            tavsiyalar.append("SQL (PostgreSQL)")
            sabab.append("ACID tranzaksiya kerak → SQL SHART")

        if oxshashlik_kerak:
            if yozuvlar < 1_000:
                tavsiyalar.append("⭐ numpy (E @ q)")
                sabab.append(f"{yozuvlar:,} yozuv — vektor DB ORTIQCHA, "
                             f"numpy tezroq va 100% aniq")
            elif yozuvlar < 1_000_000:
                tavsiyalar.append("⭐ Chroma / FAISS (mahalliy)")
                sabab.append(f"{yozuvlar:,} yozuv — mahalliy baza YETARLI")
            else:
                tavsiyalar.append("Qdrant / Milvus"
                                  + ("" if maxfiylik_kerak else " / Pinecone"))
                sabab.append(f"{yozuvlar:,} yozuv — miqyoslanadigan yechim")

        if aniq_moslik_kerak and not oxshashlik_kerak:
            tavsiyalar.append("SQL yoki Elasticsearch")
            sabab.append("faqat aniq moslik → vektor DB KERAK EMAS")

        if maxfiylik_kerak:
            sabab.append("🔒 MAXFIYLIK → faqat MAHALLIY (Pinecone'da "
                         "ma'lumot serverdan CHIQADI)")

        if tez_ozgaradi and oxshashlik_kerak:
            sabab.append("⚠️ ma'lumot tez o'zgaradi → har o'zgarishda "
                         "QAYTA embedding (💰 pul va vaqt)")

        if byudjet == "past" and oxshashlik_kerak:
            sabab.append("💰 byudjet past → mahalliy embedding "
                         "(sentence-transformers) BEPUL")

        print("🎯 TAVSIYA:")
        for t in dict.fromkeys(tavsiyalar):
            print(f"   • {t}")
        print("\n📋 SABAB:")
        for x in sabab:
            print(f"   • {x}")

        # hajm
        if oxshashlik_kerak:
            gb = yozuvlar * 384 * 4 / 1024**3
            print(f"\n💾 taxminiy hajm (384 o'lcham, f32): {gb:.2f} GB")
            if gb > 8:
                print("   ⚠️ RAMga sig'maydi — diskli yechim yoki kvantlash kerak")
        return tavsiyalar


bt = BazaTanlovchi()

print("═══ 🎓 365 kurs qidiruvi ═══")
bt.tavsiya(yozuvlar=680, oxshashlik_kerak=True, aniq_moslik_kerak=False,
           tranzaksiya_kerak=False, maxfiylik_kerak=False,
           tez_ozgaradi=False, byudjet="past")

print("\n═══ 🏦 Bank mijozlar bazasi + mahsulot tavsiyasi ═══")
bt.tavsiya(yozuvlar=500_000, oxshashlik_kerak=True, aniq_moslik_kerak=True,
           tranzaksiya_kerak=True, maxfiylik_kerak=True,
           tez_ozgaradi=True, byudjet="o'rta")

print("\n═══ 🛒 Katta e-tijorat ═══")
bt.tavsiya(yozuvlar=50_000_000, oxshashlik_kerak=True, aniq_moslik_kerak=True,
           tranzaksiya_kerak=True, maxfiylik_kerak=False,
           tez_ozgaradi=True, byudjet="yuqori")
```

## 🏆 **UCHTA NATIJA — UCHTA BOSHQA ARXITEKTURA.**

## 💡 **VA E'TIBOR BERING — 680 YOZUV UCHUN VEKTOR BAZASI TAVSIYA ETILMAYDI.** `numpy` **tezroq** va **100% aniq**.

</details>

**M16.** ⭐⭐⭐ 🇺🇿 O'zbekcha qidiruvni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd
from sentence_transformers import SentenceTransformer

b = pd.read_csv(BOLIMLAR, encoding="cp1252")
matnlar = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1).tolist()

SOROVLAR_UZ = ["Python dasturlash",
               "ma'lumotlarni vizualizatsiya qilish",
               "mashinali o'qitish",
               "chuqur o'rganish",
               "ma'lumotlar bazasi so'rovlari"]
SOROVLAR_EN = ["Python programming",
               "data visualization",
               "machine learning",
               "deep learning",
               "database queries"]

q = []
for nom in ["all-MiniLM-L6-v2", "paraphrase-multilingual-MiniLM-L12-v2"]:
    m = SentenceTransformer(nom)
    E = m.encode(matnlar, show_progress_bar=False, batch_size=64)
    E = E / np.linalg.norm(E, axis=1, keepdims=True)      # ⭐ SHART
    for til, soravlar in [("🇺🇿 UZ", SOROVLAR_UZ), ("🇬🇧 EN", SOROVLAR_EN)]:
        ballar = []
        for s in soravlar:
            qv = m.encode(s)
            qv = qv / np.linalg.norm(qv)
            ballar.append(float((E @ qv).max()))
        q.append({"model": nom.split("/")[-1][:34], "til": til,
                  "o'rt_ball": round(float(np.mean(ballar)), 4),
                  "min": round(min(ballar), 4),
                  "maks": round(max(ballar), 4)})

d = pd.DataFrame(q)
print(d.to_string(index=False))

print("\n🏆 XULOSA:")
for model in d.model.unique():
    uz = d[(d.model == model) & (d.til == "🇺🇿 UZ")]["o'rt_ball"].iloc[0]
    en = d[(d.model == model) & (d.til == "🇬🇧 EN")]["o'rt_ball"].iloc[0]
    nisbat = uz / en
    belgi = "✅" if nisbat > 0.7 else "💥"
    print(f"  {belgi} {model[:34]:34s} UZ/EN = {nisbat:.2f}")
```

## 💥 **`all-MiniLM-L6-v2` DA UZ/EN NISBATI JUDA PAST BO'LADI** — model **o'zbekchani bilmaydi**.

## 🏆 **KO'P TILLI MODELDA NISBAT ANCHA YAXSHIROQ.** 🇺🇿 Loyihada **shuni tanlang**.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
365 ma'lumoti: 106 kurs · 680 bo'lim · cp1252 kodirovka · 3848 ta \r
all-MiniLM-L6-v2  →  384 o'lcham · norma 1.0000 ✅ · maks 256 token
680 embedding 6.0s · Chroma indekslash 0.2s · qidiruv 1–2 ms

50 000 vektor (tasodifiy):
   brute force 2.05 ms · HNSW 1.30 ms (2× tez) · aniqlik 3/10
   💥 HNSW afzalligi FAQAT millionlab vektorda sezilarli
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
