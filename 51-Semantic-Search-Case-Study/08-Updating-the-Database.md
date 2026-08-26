# 8-dars. Bazani yangilash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs katalogi o'zgaradi. Yangi kurs qo'shiladi, eskisi olib tashlanadi. Bazani QANDAY yangilaymiz?"**

---

## 1. Kursning yondashuvi

```python
yangi = pd.read_csv("course_descriptions_new.csv", encoding="cp1252")

yangi["new_course_description"] = yangi.apply(
    create_course_description, axis=1)

vektorlar = [{"id": r.course_name,
              "values": model.encode(r.new_course_description).tolist(),
              "metadata": {...}}
             for _, r in yangi.iterrows()]

indeks.upsert(vectors=vektorlar)      # ⭐ upsert = insert + update
```

> ## 🔑 **KURSNING NUQTAI NAZARI TO'G'RI:** *"`upsert` — bitta amal bilan yangi qo'shiladi, mavjudi yangilanadi."*
>
> ## 💥 **LEKIN UCHTA HOLAT QOPLANMAGAN:**
> ```
> ① O'CHIRILGAN kurs  →  bazada QOLADI (arvoh yozuv)
> ② O'ZGARMAGAN kurs  →  BEHUDA qayta vektorlanadi
> ③ Yangilash YARIM yo'lda uzilsa  →  baza NOMUVOFIQ holatda
> ```

---

## 2. ⭐⭐⭐ To'liq sinxronlash

```python
import hashlib


def matn_xesh(s):
    """⭐ Matn o'zgarganini ANIQLASH uchun."""
    return hashlib.md5(s.encode("utf-8")).hexdigest()[:16]


def sinxronla(qidiruv, ids, matnlar, metadatalar, hajm=100):
    """🏆 To'liq sinxronlash: QO'SHISH + YANGILASH + O'CHIRISH."""
    yangi_xesh = {i: matn_xesh(m) for i, m in zip(ids, matnlar)}

    # ── ① bazadagi holatni o'qiymiz ──
    eski = {}
    if qidiruv.turi == "chroma":
        d = qidiruv.idx.get(include=["metadatas"])
        eski = {i: (m or {}).get("_xesh", "")
                for i, m in zip(d["ids"], d["metadatas"])}
    else:
        for b in range(0, len(ids), 100):        # Pinecone: id bo'yicha
            r = qidiruv.idx.fetch(ids=list(ids[b:b + 100]))
            for i, v in r.get("vectors", {}).items():
                eski[i] = v.get("metadata", {}).get("_xesh", "")

    # ── ② uchta to'plamni ajratamiz ──
    qoshish = [i for i in ids if i not in eski]
    yangilash = [i for i in ids
                 if i in eski and eski[i] != yangi_xesh[i]]
    ochirish = [i for i in eski if i not in yangi_xesh]
    ozgarmagan = len(ids) - len(qoshish) - len(yangilash)

    print(f"  ➕ qo'shiladi  : {len(qoshish):5d}")
    print(f"  🔄 yangilanadi : {len(yangilash):5d}")
    print(f"  ➖ o'chiriladi : {len(ochirish):5d}")
    print(f"  ⏭️  o'zgarmagan : {ozgarmagan:5d}  (vektorlanmaydi)")

    # ── ③ faqat KERAKLILARINI vektorlaymiz ──
    ishlash = set(qoshish) | set(yangilash)
    if ishlash:
        idx = {i: n for n, i in enumerate(ids)}
        p_ids = [i for i in ids if i in ishlash]
        p_matn = [matnlar[idx[i]] for i in p_ids]
        p_meta = [{**metadatalar[idx[i]], "_xesh": yangi_xesh[i]}
                  for i in p_ids]
        qidiruv.yukla(p_ids, p_matn, p_meta, hajm=hajm)

    # ── ④ o'chirish ──
    if ochirish:
        if qidiruv.turi == "chroma":
            qidiruv.idx.delete(ids=ochirish)
        else:
            for b in range(0, len(ochirish), 1000):
                qidiruv.idx.delete(ids=ochirish[b:b + 1000])
        print(f"  🗑️  {len(ochirish)} yozuv o'chirildi")

    print(f"  ✅ bazada: {qidiruv.soni()} vektor")
    return {"qoshildi": len(qoshish), "yangilandi": len(yangilash),
            "ochirildi": len(ochirish), "ozgarmagan": ozgarmagan}
```

> ## 🏆🏆 **XESH — ENG KATTA TEJAMKORLIK.**
> ```
> 680 bo'lim, 5 tasi o'zgargan
>    xeshsiz  →  680 vektor  ≈  2.9s   (+ API bo'lsa: PUL)
>    xesh bilan →  5 vektor   ≈  0.03s
>    🏆 100× tejam
> ```
>
> ## 💥 **1M HUJJATLI LOYIHADA BU — SOATLAR VA DOLLARLAR FARQI.**

---

## 3. 🔬 O'lchangan natija

```python
q = KursQidiruv(nom="sinx-test")

# ── birinchi yuklash ──
sinxronla(q, ids, matnlar, metalar)
```

```
  ➕ qo'shiladi  :   680
  🔄 yangilanadi :     0
  ➖ o'chiriladi :     0
  ⏭️  o'zgarmagan :     0  (vektorlanmaydi)
     ✅   680/680
  ✅ bazada: 680 vektor
```

```python
# ── ikkinchi marta — HECH NARSA o'zgarmagan ──
sinxronla(q, ids, matnlar, metalar)
```

```
  ➕ qo'shiladi  :     0
  🔄 yangilanadi :     0
  ➖ o'chiriladi :     0
  ⏭️  o'zgarmagan :   680  (vektorlanmaydi)
  ✅ bazada: 680 vektor
```

> ## ✅ **IKKINCHI ISHGA TUSHIRISH — 0 TA VEKTOR HISOBLANDI.**
>
> ## ⭐ **BU — `IDEMPOTENT` AMAL.** Xohlagancha marta ishga tushiring, natija **bir xil**.
>
> ## 🏆 **`cron` BILAN HAR KECHA ISHGA TUSHIRSA BO'LADI** — faqat **o'zgarganini** ishlaydi.

```python
# ── uchinchi: 3 ta o'zgardi, 2 ta o'chdi ──
matnlar2 = matnlar[:678]
matnlar2[0] = matnlar2[0] + " NEW CONTENT ADDED"
sinxronla(q, ids[:678], matnlar2, metalar[:678])
```

```
  ➕ qo'shiladi  :     0
  🔄 yangilanadi :     1
  ➖ o'chiriladi :     2
  ⏭️  o'zgarmagan :   677  (vektorlanmaydi)
     ✅     1/1
  🗑️  2 yozuv o'chirildi
  ✅ bazada: 678 vektor
```

> ## ✅ **678 — TO'G'RI.** ## Kursning oddiy `upsert` usulida **680** qolar edi *(2 ta arvoh yozuv)*.

---

## 4. 💥 Arvoh yozuvlar — jim xato

```
Katalogdan "Deep Learning with TensorFlow 1" olib tashlandi
   →  CSV da YO'Q
   →  upsert() uni KO'RMAYDI
   →  💥 BAZADA QOLADI

Foydalanuvchi qidiradi  →  ESKI kurs chiqadi  →  havola 404
```

> ## 🔑 **BU XATO OYLAB SEZILMAYDI** — chunki **hech qanday xato xabari yo'q**.
>
> ## ⭐ **YAGONA YECHIM — `ochirish` TO'PLAMINI HISOBLASH** *(3-band, yuqorida)*.

---

## 5. ⚠️ O'chirish va joy

```python
# Chroma
q.idx.delete(ids=["37-369", "37-370"])

# Pinecone
indeks.delete(ids=["37-369", "37-370"])
indeks.delete(delete_all=True, namespace="test")   # 💥 EHTIYOT
```

> ## 💥 **O'CHIRISHDAN KEYIN FAYL HAJMI KAMAYMAYDI** *(50-modul, 6-dars)*:
> ```
> SQLite  →  VACUUM kerak
> HNSW    →  indeks QAYTA qurilishi kerak
> ```
>
> ## ⚠️ **VA `delete_all=True` — QAYTARIB BO'LMAYDI.** ## Uni **hech qachon** o'zgaruvchidan olingan `namespace` bilan chaqirmang:
> ```python
> # ❌ XAVFLI
> indeks.delete(delete_all=True, namespace=foydalanuvchi_kiritgan)
>
> # ✅ XAVFSIZ
> assert ns.startswith("test-"), "💥 faqat test namespace"
> indeks.delete(delete_all=True, namespace=ns)
> ```

---

## 6. ⭐⭐ Nol to'xtovli yangilash (blue-green)

```python
def blue_green_yangilash(pc, asosiy_nom, ids, matnlar, metalar, model):
    """🏆 Yangilash paytida qidiruv TO'XTAMAYDI."""
    vaqtinchalik = f"{asosiy_nom}-yangi"

    # ① yangi indeksni to'liq quramiz (eskisi ishlab turadi)
    yangi_q = KursQidiruv(nom=vaqtinchalik, model_nomi=model)
    yangi_q.yukla(ids, matnlar, metalar)

    # ② TEKSHIRAMIZ
    assert yangi_q.soni() == len(ids), "💥 to'liq yuklanmadi"
    sinov = yangi_q.qidir("regression in Python", k=1)
    assert sinov and sinov[0]["ball"] > 0.5, "💥 sifat past"

    # ③ faqat SHUNDAN KEYIN almashtiramiz
    print(f"✅ {vaqtinchalik} tayyor — endi ilovada nomni almashtiring")
    return vaqtinchalik
```

> ## 🔑 **NIMA UCHUN?**
> ```
> ❌ To'g'ridan-to'g'ri yangilash:
>    delete_all()  →  ⏱️ 10 daqiqa yuklash  →  💥 qidiruv ISHLAMAYDI
>
> ✅ Blue-green:
>    yangi indeks quriladi  →  tekshiriladi  →  bir soniyada almashtiriladi
> ```
>
> ## ⭐ **VA `assert` LAR — ENG MUHIM QISM.** ## Tekshirilmagan indeksga o'tish — **eskisidan ham yomon**.

---

## 7. 🇺🇿 Amaliy jadval

| Vaziyat | Yechim |
|---|---|
| Kunlik kichik o'zgarish | ## ⭐ `sinxronla()` + xesh |
| Model almashdi | ## 🏆 **blue-green** — o'lcham o'zgaradi |
| Butun katalog qayta yuklandi | ## `sinxronla()` — o'chirish avtomatik |
| Bir kurs olib tashlandi | ## `delete(ids=[...])` |
| Test ma'lumotini tozalash | ## ⚠️ `delete_all` + `namespace` **asserti** |

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** `upsert` o'chirilgan yozuvni nima qiladi?

**M2.** Xesh nima uchun kerak?

**M3.** `idempotent` nima degani?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## 💥 **Hech narsa** — u bazada **arvoh yozuv** bo'lib qoladi.

**M2.** ## Matn **o'zgarganini** aniqlash — ## o'zgarmaganini **qayta vektorlamaslik** *(100× tejam)*.

**M3.** ## Bir necha marta ishga tushirilsa ham **natija bir xil**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ `sinxronla()` ni yozing va uch senariyni sinang.

<details>
<summary>✅ Yechim</summary>

```python
q = KursQidiruv(nom="sinx-mashq")
ids = bolimlar.unique_id.tolist()
matnlar = bolimlar.matn_a.tolist()
metalar = [{"course_name": r.course_name[:80]}
           for _, r in bolimlar.iterrows()]

print("① BIRINCHI YUKLASH")
sinxronla(q, ids, matnlar, metalar)

print("\n② QAYTA — hech narsa o'zgarmagan")
sinxronla(q, ids, matnlar, metalar)

print("\n③ 1 ta o'zgardi, 2 tasi o'chdi")
m2 = matnlar[:678].copy()
m2[0] += " YANGI MAZMUN"
sinxronla(q, ids[:678], m2, metalar[:678])
```

## ✅ **② DA "o'zgarmagan: 680" CHIQISHI SHART** — ## bu **xesh ishlayotganining isboti**.

</details>

**M5.** ⭐ Arvoh yozuvlarni toping.

<details>
<summary>✅ Yechim</summary>

```python
def arvoh_top(qidiruv, joriy_ids):
    """💥 Bazada bor, lekin manbada YO'Q yozuvlar."""
    if qidiruv.turi == "chroma":
        bazada = set(qidiruv.idx.get()["ids"])
    else:
        raise NotImplementedError("Pinecone: list() bilan sahifalang")

    arvoh = bazada - set(joriy_ids)
    yetishmaydi = set(joriy_ids) - bazada

    print(f"  bazada     : {len(bazada)}")
    print(f"  manbada    : {len(joriy_ids)}")
    print(f"  💥 arvoh   : {len(arvoh)}  {sorted(arvoh)[:5]}")
    print(f"  💥 yetishmas: {len(yetishmaydi)}  {sorted(yetishmaydi)[:5]}")
    return arvoh, yetishmaydi


arvoh_top(q, bolimlar.unique_id.tolist())
```

## 🏆 **BU TEKSHIRUVNI OYIGA BIR MARTA ISHGA TUSHIRING.**

</details>

**M6.** ⭐⭐ Xeshning tejamkorligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time

n = len(matnlar)

# ── xeshsiz: hammasi ──
t0 = time.perf_counter()
_ = model.encode(matnlar, batch_size=64, show_progress_bar=False)
xeshsiz = time.perf_counter() - t0

# ── xesh bilan: 5 tasi o'zgargan ──
t0 = time.perf_counter()
_ = model.encode(matnlar[:5], batch_size=64, show_progress_bar=False)
xeshli = time.perf_counter() - t0

print(f"  xeshsiz  ({n} vektor) : {xeshsiz:6.2f}s")
print(f"  xesh bilan (5 vektor) : {xeshli:6.2f}s")
print(f"  🏆 tejam              : {xeshsiz/max(xeshli,1e-9):6.0f}×")
print(f"\n  1M hujjatda:")
print(f"    xeshsiz    ~{xeshsiz/n*1_000_000/3600:5.1f} soat")
print(f"    xesh bilan ~{xeshli/5*1_000_000*0.007/3600:5.1f} soat "
      f"(0.7% o'zgaradi deb)")
```

## 💥 **API MODELIDA BU — TO'G'RIDAN-TO'G'RI PUL:** ## 1M × 300 token × $0.02/1M ≈ **$6** har to'liq qayta indekslash uchun.

</details>

---

## 📌 Xulosa

```python
yangi_xesh = {i: matn_xesh(m) for i, m in zip(ids, matnlar)}

qoshish   = [i for i in ids if i not in eski]
yangilash = [i for i in ids if i in eski and eski[i] != yangi_xesh[i]]
ochirish  = [i for i in eski if i not in yangi_xesh]   # ⭐ KURSDA YO'Q
```

```
🔬 O'LCHANGAN:
   ① birinchi yuklash  →  qo'shildi 680
   ② qayta ishga tushirish  →  o'zgarmagan 680, vektorlangan 0  ✅
   ③ 1 o'zgardi + 2 o'chdi  →  bazada 678  ✅
      (oddiy upsert da 680 qolar edi — 2 ta ARVOH)

⭐ xesh   →  100× tejam
⭐ blue-green  →  yangilash paytida qidiruv TO'XTAMAYDI
⚠️ delete_all  →  QAYTARIB BO'LMAYDI, assert bilan himoyalang
```

> ## 🏆🏆 **`upsert` — YARIM YECHIM. TO'LIQ SINXRONLASH UCHUN `O'CHIRISH` TO'PLAMI HAM KERAK.**

---

⬅️ [7-dars. Qidiruv va chegara](07-Similarity-Search.md) · 🏠 [Modul boshiga](README.md) · ➡️ [9-dars. Bo'lim darajasidagi qidiruv](09-Section-Level-Search.md)
