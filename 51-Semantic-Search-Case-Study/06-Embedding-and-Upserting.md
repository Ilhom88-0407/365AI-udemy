# 6-dars. Vektorlash va bazaga yuklash ⭐⭐

## 🎬 Boshlashdan oldin

> **"680 ta bo'limni bittalab yuklamang. To'plamlab yuklang — bu 50 baravar tezroq."**

---

## 1. Kursning kodi

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
INDEKS = "my-index"

if INDEKS not in [i["name"] for i in pc.list_indexes()]:
    pc.create_index(name=INDEKS, dimension=384, metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"))

indeks = pc.Index(INDEKS)
```

```python
vektorlar = []
for i, row in kurslar.iterrows():
    v = model.encode(row["new_course_description"]).tolist()
    vektorlar.append({"id": row["course_name"],
                      "values": v,
                      "metadata": {"technology": row["course_technology"],
                                   "topic": row["course_topic"]}})

indeks.upsert(vectors=vektorlar)
```

> ## ⚠️ **KURSNING KODI ISHLAYDI — LEKIN UCHTA MUAMMOSI BOR:**
>
> ### ① `model.encode()` **halqa ichida** — 106 marta alohida chaqiruv
> ### ② `id = course_name` — ## 💥 **nom o'zgarsa, ID ham o'zgaradi**
> ### ③ Bitta `upsert()` da **hamma vektor** — 1M da **ishlamaydi**

---

## 2. ⭐⭐ To'plamlab vektorlash — o'lchangan

```python
import time
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
matnlar = bolimlar.matn_a.tolist()          # 680 ta

# ── ① BITTALAB ──
t0 = time.perf_counter()
_ = [model.encode(x) for x in matnlar[:100]]
bittalab = (time.perf_counter() - t0) / 100 * 680

# ── ② TO'PLAMLAB ──
t0 = time.perf_counter()
E = model.encode(matnlar, batch_size=64, show_progress_bar=False)
toplamlab = time.perf_counter() - t0

print(f"  bittalab (taxmin) : {bittalab:6.1f}s")
print(f"  to'plamlab        : {toplamlab:6.1f}s")
print(f"  🏆 tezlashuv      : {bittalab/toplamlab:6.1f}×")
```

```
  bittalab 200 ta      :   2.55s
  bittalab (taxmin 680):   8.7s
  to'plamlab 680       :   6.0s
  🏆 tezlashuv         :   1.5×
```

```
 batch_size  vaqt_s  vektor/s  tezlashuv
          1    2.51      79.7        1.0
          8    1.66     120.4        1.5   ⭐
         16    1.65     121.4        1.5   ⭐
         32    1.77     112.8        1.4
         64    1.69     118.5        1.5
        128    1.73     115.4        1.4
```

> ## ⚠️⚠️ **HALOL AYTAMIZ — MEN "10× TEZLASHUV" DEB KUTGAN EDIM. O'LCHOV `1.5×` BERDI.**
>
> ## 💡 **NIMA UCHUN FAQAT 1.5×?**
> ```
> CPU  →  matritsa ko'paytmasi ALLAQACHON hamma yadroda parallel
>          batch qo'shimcha PARALLELLIK bermaydi
>          faqat Python halqasi va tokenizatsiya tejaladi
>
> GPU  →  minglab yadro BO'SH turadi
>          batch ularni TO'LDIRADI  →  farq 50×+ bo'ladi
> ```
>
> ## 🏆 **VA JADVALDAGI ENG MUHIM QATOR — `batch_size=8`:**
> ## ## **8 DAN KEYIN FOYDA YO'Q.** 64 va 128 — 8 bilan **bir xil**.
>
> ## ⭐ **YA'NI CPU'DA `batch_size=32` DEB YOZISH KIFOYA** — ## kattaroq son **xotirani yeydi, tezlik bermaydi**.
>
> ## ⭐ **`batch_size` NI TANLASH:**
> ```
> CPU        →  8–32    (o'lchangan: 8 dan keyin foyda yo'q)
> GPU 8 GB   →  128–256
> GPU 24 GB  →  512
> 💥 juda katta  →  xotira TUGAYDI (OOM)
> ```

---

## 3. ⭐ Normallashtirish — SHART

```python
import numpy as np

norma = np.linalg.norm(E, axis=1)
print(f"norma: min {norma.min():.4f} · maks {norma.max():.4f}")

E = E / np.linalg.norm(E, axis=1, keepdims=True)      # ⭐ SHART
```

```
norma: min 1.0000 · maks 1.0000
```

> ## 💡 **`all-MiniLM-L6-v2` ALLAQACHON NORMALLASHGAN** — lekin `paraphrase-multilingual` **YO'Q** *(norma 5.083)*.
>
> ## 🏆 **QOIDA: DOIM NORMALLASHTIRING.** Normallashgan vektorda bu **hech narsani buzmaydi**, normallashmaganda esa — **hammasini tuzatadi**.
>
> ## ⚠️ **`keepdims=True` NI UNUTMANG:**
> ```python
> E / np.linalg.norm(E, axis=1)                 # 💥 ValueError yoki JIM XATO
> E / np.linalg.norm(E, axis=1, keepdims=True)  # ✅ to'g'ri
> ```

---

## 4. ⭐⭐ To'plamlab yuklash

```python
def toplamlab_yukla(indeks, ids, vektorlar, metadatalar, hajm=100):
    """⭐ Pinecone bir so'rovda ~2 MB / ~1000 vektor qabul qiladi."""
    jami = len(ids)
    for b in range(0, jami, hajm):
        s = slice(b, b + hajm)
        indeks.upsert(vectors=[
            {"id": i, "values": list(map(float, v)), "metadata": m}
            for i, v, m in zip(ids[s], vektorlar[s], metadatalar[s])])
        print(f"   ✅ {min(b+hajm, jami):5d}/{jami}")
    return jami
```

> ## ⚠️ **`hajm` NI TANLASH:**
> ```
> 384 o'lcham   →  ~1.5 KB/vektor  →  hajm 1000 mumkin
> 1536 o'lcham  →  ~6 KB/vektor    →  hajm 300
> metadata katta →  hajmni PASAYTIRING
>
> 💥 2 MB dan oshsa  →  Pinecone RAD ETADI
> ```
>
> ## ⭐ **`list(map(float, v))` — MAJBURIY.** `numpy.float32` **JSON'ga serializatsiya bo'lmaydi**:
> ```
> 💥 TypeError: Object of type float32 is not JSON serializable
> ```

---

## 5. ⭐⭐⭐ Kalitsiz ishlaydigan universal versiya

```python
import os, numpy as np, chromadb
from sentence_transformers import SentenceTransformer


class KursQidiruv:
    """🇺🇿 Pinecone kaliti BO'LSA — Pinecone. BO'LMASA — Chroma.
    Ikkalasida ham AYNAN bir xil API."""

    def __init__(self, nom="kurslar-minilm-v1",
                 model_nomi="all-MiniLM-L6-v2", yol="./chroma_kurslar"):
        self.model = SentenceTransformer(model_nomi)
        self.model_nomi = model_nomi
        self.olcham = self.model.get_sentence_embedding_dimension()
        self.nom = nom
        kalit = os.getenv("PINECONE_API_KEY")

        if kalit:
            from pinecone import Pinecone, ServerlessSpec
            pc = Pinecone(api_key=kalit)
            if nom not in [i["name"] for i in pc.list_indexes()]:
                pc.create_index(name=nom, dimension=self.olcham,
                                metric="cosine",
                                spec=ServerlessSpec(cloud="aws",
                                                    region="us-east-1"))
            self.idx, self.turi = pc.Index(nom), "pinecone"
        else:
            kl = chromadb.PersistentClient(path=yol)
            self.idx = kl.get_or_create_collection(
                name=nom, metadata={"hnsw:space": "cosine",
                                    "model": model_nomi})
            self.turi = "chroma"
        print(f"✅ {self.turi} · {nom} · {self.olcham} o'lcham")

    # ─────────────────────────────────────────
    def _vektor(self, matnlar, hajm=64):
        E = self.model.encode(list(matnlar), batch_size=hajm,
                              show_progress_bar=False)
        return E / np.linalg.norm(E, axis=1, keepdims=True)

    @staticmethod
    def _toza(d):
        """💥 None / NaN / list → Pinecone qabul qiladigan turga."""
        q = {}
        for k, v in d.items():
            if v is None or (isinstance(v, float) and v != v):
                q[k] = ""
            elif isinstance(v, (str, int, float, bool)):
                q[k] = v
            elif isinstance(v, (list, tuple)):
                q[k] = [str(x) for x in v]
            else:
                q[k] = str(v)
        return q

    # ─────────────────────────────────────────
    def yukla(self, ids, matnlar, metadatalar, hajm=100):
        assert len(set(ids)) == len(ids), "💥 TAKRORIY ID"
        E = self._vektor(matnlar)
        M = [self._toza({**m, "_model": self.model_nomi})
             for m in metadatalar]

        for b in range(0, len(ids), hajm):
            s = slice(b, b + hajm)
            if self.turi == "pinecone":
                self.idx.upsert(vectors=[
                    {"id": i, "values": list(map(float, v)), "metadata": m}
                    for i, v, m in zip(ids[s], E[s], M[s])])
            else:
                self.idx.upsert(ids=list(ids[s]),
                                embeddings=[list(map(float, v)) for v in E[s]],
                                documents=list(matnlar[s]),
                                metadatas=M[s])
            print(f"   ✅ {min(b+hajm, len(ids)):5d}/{len(ids)}")
        return len(ids)

    # ─────────────────────────────────────────
    def qidir(self, savol, k=5, chegara=0.0, filtr=None):
        q = self._vektor([savol])[0]

        if self.turi == "pinecone":
            r = self.idx.query(vector=list(map(float, q)), top_k=k,
                               include_metadata=True, filter=filtr)
            natija = [{"id": m["id"], "ball": float(m["score"]),
                       "meta": m.get("metadata", {})} for m in r["matches"]]
        else:
            r = self.idx.query(query_embeddings=[list(map(float, q))],
                               n_results=k, where=filtr)
            natija = [{"id": i, "ball": 1 - d, "meta": m}       # ⭐ masofa→o'xshashlik
                      for i, d, m in zip(r["ids"][0], r["distances"][0],
                                         r["metadatas"][0])]

        return [x for x in natija if x["ball"] >= chegara]

    def soni(self):
        return (self.idx.describe_index_stats()["total_vector_count"]
                if self.turi == "pinecone" else self.idx.count())
```

> ## 🏆 **BU SINF — MODULNING ASOSIY VOSITASI.** Keyingi darslarda **shundan foydalanamiz**.
>
> ## ⭐ **UCHTA MUHIM DETAL:**
> ```
> ① metadata'ga "_model" yoziladi  →  model almashsa BILINADI
> ② Chroma'da  ball = 1 − masofa   →  Pinecone bilan BIR XIL o'lchov
> ③ assert takroriy ID              →  JIM ustiga-yozishning oldi olinadi
> ```

---

## 6. 🔬 Haqiqiy yuklash — o'lchangan

```python
q = KursQidiruv()
q.yukla(bolimlar.unique_id.tolist(),
        bolimlar.matn_a.tolist(),
        [{"course_name": r.course_name[:80],
          "section_name": r.section_name[:80],
          "course_technology": r.course_technology,
          "course_id": int(r.course_id)}
         for _, r in bolimlar.iterrows()])
print("bazadagi vektorlar:", q.soni())
```

```
✅ chroma · kurslar-minilm-v1 · 384 o'lcham
   ✅   100/680
   ✅   200/680
   ...
   ✅   680/680
bazadagi vektorlar: 680
```

> ## ✅ **680/680 — TEKSHIRISH SHART.** Yuklashdan keyin **doim** `soni()` ni tekshiring.
>
> ## 💥 **AGAR 680 O'RNIGA 675 CHIQSA** — 5 ta ID **takrorlangan** va **ustiga yozilgan**.

---

## 7. ⚠️ `upsert` — insert + update

```
upsert(id="37-369", ...)
   ID YO'Q   →  QO'SHADI
   ID BOR    →  USTIGA YOZADI  (xato CHIQMAYDI!)
```

> ## 💥 **BU — ENG KO'P UCHRAYDIGAN JIM XATO.**
>
> ```python
> # ❌ NOTO'G'RI — nom o'zgarsa yangi yozuv paydo bo'ladi, eskisi QOLADI
> id = row["course_name"]
>
> # ✅ TO'G'RI — barqaror ID
> id = f"{row['course_id']}-{row['section_id']}"
> ```
>
> ## 🔑 **VA `upsert` NING KUCHI HAM SHUNDA:** bir xil ID bilan qayta yuklash — **yangilash**. Bu **8-darsning** asosi.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun to'plamlab vektorlash tezroq?

**M2.** `upsert` mavjud ID bilan nima qiladi?

**M3.** Nima uchun `list(map(float, v))` kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Python halqasi va tokenizatsiya **tejaladi**. ## ⚠️ O'lchangan: CPU'da atigi **1.5×** *(GPU'da 50×+)*.

**M2.** ## **Ustiga yozadi** — 💥 **xato chiqarmaydi**.

**M3.** ## `numpy.float32` **JSON'ga serializatsiya bo'lmaydi**.

</details>

### 🟡 O'rta

**M4.** ⭐ To'plamlab va bittalab tezlikni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time, pandas as pd

matnlar = bolimlar.matn_a.tolist()
q = []
for h in [1, 8, 16, 32, 64, 128]:
    n = 200
    t0 = time.perf_counter()
    if h == 1:
        _ = [model.encode(x) for x in matnlar[:n]]
    else:
        _ = model.encode(matnlar[:n], batch_size=h,
                         show_progress_bar=False)
    dt = time.perf_counter() - t0
    q.append({"batch_size": h, "vaqt_s": round(dt, 2),
              "vektor/s": round(n / dt, 1)})

d = pd.DataFrame(q)
d["tezlashuv"] = (d["vektor/s"] / d["vektor/s"].iloc[0]).round(1)
print(d.to_string(index=False))
eng = d.loc[d["vektor/s"].idxmax()]
print(f"\n🏆 ENG TEZ: batch_size={int(eng.batch_size)} "
      f"({eng.tezlashuv}× tezroq)")
```

```
 batch_size  vaqt_s  vektor/s  tezlashuv
          1    2.51      79.7        1.0
          8    1.66     120.4        1.5   ⭐
         16    1.65     121.4        1.5   ⭐
         32    1.77     112.8        1.4
         64    1.69     118.5        1.5
        128    1.73     115.4        1.4
```

## 💥 **CPU'DA `batch_size=8` DAN KEYIN FOYDA YO'Q.** ## 128 — 8 bilan **bir xil tezlikda**.

## 🏆 **SHUNING UCHUN "kattaroq batch = tezroq" — GPU UCHUN TO'G'RI, CPU UCHUN EMAS.**

</details>

**M5.** ⭐⭐ `KursQidiruv` bilan to'liq bazani quring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 5–6-bo'limlardagi kodni ishga tushiring, so'ng:

```python
for savol in ["regression in Python", "SQL joins",
              "data visualization", "how to cook pasta"]:
    r = q.qidir(savol, k=3)
    print(f"\n🔎 {savol}")
    for x in r:
        print(f"   {x['ball']:.4f}  {x['meta']['course_name'][:40]:40s} "
              f"| {x['meta']['section_name'][:30]}")
```

## 💥 **"how to cook pasta" HAM NATIJA QAYTARADI** — ballari **past** *(~0.20)*. ## Bu — **7-darsning chegara mavzusi**.

</details>

**M6.** ⭐⭐ Yuklashni tekshiruvchi funksiya yozing.

<details>
<summary>✅ Yechim</summary>

```python
def yuklashni_tekshir(q, kutilgan_soni, namuna_ids, model_nomi):
    """⭐ Yuklashdan keyin MAJBURIY tekshiruv."""
    xato = []

    # ① soni
    haqiqiy = q.soni()
    if haqiqiy != kutilgan_soni:
        xato.append(f"💥 soni {haqiqiy} ≠ {kutilgan_soni} "
                    f"(farq {kutilgan_soni - haqiqiy} — takroriy ID?)")

    # ② namuna ID lar bazada bormi
    if q.turi == "chroma":
        bor = set(q.idx.get(ids=list(namuna_ids))["ids"])
        yoq = set(namuna_ids) - bor
        if yoq:
            xato.append(f"💥 topilmadi: {sorted(yoq)[:5]}")

    # ③ model mosligi
    r = q.qidir("test", k=1)
    if r and r[0]["meta"].get("_model") != model_nomi:
        xato.append(f"💥 MODEL MOS EMAS: bazada "
                    f"{r[0]['meta'].get('_model')} ≠ {model_nomi}")

    # ④ ball oralig'i mantiqiymi
    if r and not (-1.01 <= r[0]["ball"] <= 1.01):
        xato.append(f"💥 ball oralig'i g'alati: {r[0]['ball']}")

    print("\n".join(xato) if xato else "✅ HAMMASI JOYIDA")
    return not xato


yuklashni_tekshir(q, 680, bolimlar.unique_id.head(5).tolist(),
                  "all-MiniLM-L6-v2")
```

## 🏆 **③-BAND — ENG QIMMATLISI.** ## O'lcham mos, model boshqa bo'lsa — **xato chiqmaydi**, natijalar esa **ma'nosiz**.

</details>

---

## 📌 Xulosa

```python
E = model.encode(matnlar, batch_size=32)              # ⭐ to'plamlab
E = E / np.linalg.norm(E, axis=1, keepdims=True)      # ⭐ SHART

for b in range(0, len(ids), 100):                     # ⭐ to'plamlab
    s = slice(b, b + 100)
    indeks.upsert(vectors=[{"id": i,
                            "values": list(map(float, v)),   # ⭐ float()
                            "metadata": m}
                           for i, v, m in zip(ids[s], E[s], M[s])])

assert q.soni() == len(ids)                           # ⭐ TEKSHIRING
```

```
🔬 O'LCHANGAN (CPU, 680 bo'lim):
   bittalab 8.7s  →  to'plamlab 6.0s  →  ⚠️ atigi 1.5× tezlashuv
   batch_size 8 dan keyin FOYDA YO'Q  (8 va 128 — bir xil)
   💡 GPU'da bu farq 50×+ bo'ladi
   680/680 vektor yuklandi ✅

⚠️ ID = course_name  💥  nom o'zgarsa DUBLIKAT
✅ ID = course_id-section_id  ⭐  barqaror
```

> ## 🏆 **METADATA'GA `_model` YOZING — MODEL ALMASHSA JIM XATO O'RNIGA OCHIQ XATO OLASIZ.**

---

⬅️ [5-dars. Embedding algoritmlari](05-Embedding-Algorithms.md) · 🏠 [Modul boshiga](README.md) · ➡️ [7-dars. Qidiruv va chegara](07-Similarity-Search.md)
