# 4-dars. Ma'lumotni tayyorlash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Ustunlarni alohida vektorlarga aylantirish o'rniga — ularni BITTA MATNGA birlashtirsak-chi?"**

---

## 1. Kursning yondashuvi

```python
def create_course_description(row):
    return (f"The course name is {row['course_name']}, "
            f"the slug is {row['course_slug']}, "
            f"the technology is {row['course_technology']}, "
            f"and the course topic is {row['course_topic']}.")


kurslar["new_course_description"] = kurslar.apply(
    create_course_description, axis=1)
print(kurslar.new_course_description.iloc[0])
```

```
The course name is Introduction to Tableau, the slug is tableau,
the technology is tableau, and the course topic is data visualization.
```

> ## 🔑 **KURSNING IZOHI TO'G'RI:** *"So'zlarni shunchaki ulash o'rniga, MAZMUNLI JUMLA tuzdim."*
>
> ## 💡 **NIMA UCHUN JUMLA?**
> ```
> ❌ "Introduction to Tableau tableau tableau data visualization"
>    →  model uchun SHOVQIN, takroriy so'zlar
>
> ✅ "The course name is Introduction to Tableau, the technology is tableau..."
>    →  ⭐ model TABIIY MATNDA o'qitilgan — bu unga TANISHROQ
> ```

---

## 2. ⚠️ Lekin — bu haqiqatan yaxshiroqmi?

> ## 🔬 **BUNI SINAB KO'RING** *(mashqlarda)*:
> ```
> ① "The course name is X, the technology is Y..."     (kursning usuli)
> ② "X. Y. Z."                                          (nuqta bilan ajratish)
> ③ "X Y Z"                                             (oddiy ulash)
> ```
>
> ## ⚠️ **VA ESLATMA:** har qo'shimcha so'z — **token**. `"The course name is"` = **4 token**, va u **106 marta** takrorlanadi.
>
> ## 💥 **256 TOKEN CHEGARASIDA BU — SEZILARLI YO'QOTISH.**

---

## 3. ⭐⭐ Tozalash — kursda YO'Q, lekin SHART

```python
def tozala(s):
    """💥 3848 ta \\r belgisini olib tashlaydi."""
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


# ⭐ Hamma matn ustunini tozalaymiz
for d in (kurslar, bolimlar):
    for c in d.columns:
        if d[c].dtype == object:
            d[c] = d[c].map(tozala)
```

> ## 🏆 **BU — BIRINCHI QADAM BO'LISHI KERAK.** Undan keyingi hamma narsa **toza matn** bilan ishlaydi.

---

## 4. ⭐ Barqaror ID

```python
bolimlar["unique_id"] = (bolimlar.course_id.astype(str) + "-"
                         + bolimlar.section_id.astype(str))
print("noyob ID:", bolimlar.unique_id.nunique(), "/", len(bolimlar))
```

```
noyob ID: 680 / 680
```

> ## ✅ **680/680 — DUBLIKAT YO'Q.** Bu — **majburiy tekshiruv**.
>
> ## 🏆 **VA `course_id-section_id` — MUKAMMAL BARQAROR ID:**
> ```
> ✅ Ma'lumotdan KELIB CHIQADI (tasodifiy emas)
> ✅ Qayta indekslashda AYNAN o'sha ID
> ✅ O'QILADI — "37-369" nima ekanini bilasiz
> ✅ SQL bilan bog'lash oson
> ```
>
> ## 💥 **`uuid.uuid4()` ISHLATMANG** — qayta indekslashda **baza ikki baravar** oshadi *(50-modul, 5-dars)*.

---

## 5. ⭐⭐ Metadata — nima yozish kerak?

```python
metadata = [{"course_name": r.course_name[:80],
             "section_name": r.section_name[:80],
             "course_technology": r.course_technology,
             "course_id": int(r.course_id),
             "section_id": int(r.section_id)}
            for _, r in bolimlar.iterrows()]
```

> ## 🔑 **KURSNING METADATASI:**
> ```python
> {"course_name": ..., "section_name": ..., "section_description": ...}
> ```
>
> ## ⚠️ **`section_description` — TO'LIQ MATN METADATA'DA.**
> ```
> 680 × ~1000 belgi ≈ 680 KB    ✅ bu hajmda arzimas
> 1M × ~1000 belgi  ≈ 1 GB      💥 sezilarli
> ```
>
> ## 🏆 **AMALIY NAQSH:**
> ```
> Metadata'ga  →  filtrlash uchun maydonlar + QISQA sarlavha
> SQL'dan      →  to'liq matn, id bo'yicha
> ```
>
> ## 💥 **VA `course_instructor_quote` — 20 TA BO'SH.** Metadata'ga yozsangiz:
> ```
> NaN → None → 💥 Pinecone rad etadi
> ```
> ```python
> def toza_metadata(d):
>     return {k: ("" if v is None or (isinstance(v, float) and v != v)
>                 else v if isinstance(v, (str, int, float, bool))
>                 else str(v))
>             for k, v in d.items()}
> ```

---

## 6. ⭐⭐⭐ Matn tartibi — o'lchangan

```python
# ── ① kursning tartibi ──
bolimlar["kurs_tartibi"] = bolimlar.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.course_description} '
    f'{r.section_name} {r.section_description}'), axis=1)

# ── ② eng muhim matn OLDINDA ──
bolimlar["bizniki"] = bolimlar.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1)
```

```
kurs_tartibi   o'rt  1254 belgi (~ 313 tok) · 256 dan oshgan: 351/680 (52%)
bizniki        o'rt   377 belgi (~  94 tok) · 256 dan oshgan:   2/680 ( 0%)
```

### 🔬 Va endi — ANIQLIK

```
                       savol  kurs_tartibi  kurs_ok  bizniki  biz_ok
        regression in Python        0.7435       ✅   0.7208      ✅
        clustering in Python        0.7190       💥   0.7544      💥
                   SQL joins        0.6512       ✅   0.7175      ✅
deep learning neural network        0.5358       ✅   0.5248      ✅
  data visualization Tableau        0.7941       ✅   0.7627      💥
     time series forecasting        0.5326       ✅   0.5802      ✅
                web scraping        0.7269       ✅   0.6762      ✅
                 credit risk        0.5383       ✅   0.5799      ✅

kurs tartibi: 7/8
bizning     : 6/8
```

> ## ⚠️⚠️⚠️ **HALOL AYTAMIZ — MENING "YAXSHILANISHIM" NATIJANI YOMONLASHTIRDI.**
>
> ## 🔑 **MEN SHUNDAY DEB KUTGAN EDIM:** *"52% matn kesilyapti → qisqartirsak yaxshilanadi"*. **Haqiqatda — teskari.**
>
> ## 💡 **NIMA UCHUN?**
> ```
> Kursning tartibida course_description OLDINDA
>    →  u kursning MAVZUSINI yaxshi tavsiflaydi
>    →  aynan SHU QISM embeddingga kiradi
>
> Bizning tartibda section_name OLDINDA
>    →  u ba'zan JUDA QISQA ("Conclusion", "Setting up")
>    →  ma'nosiz signal oldinga chiqadi
> ```
>
> ## 🏆🏆 **ASOSIY DARS:**
> ## **"KESILISH YOMON" — TO'G'RI. LEKIN "QISQAROQ = YAXSHIROQ" — NOTO'G'RI.**
> ## **MUHIMI — QAYSI MATN KESILADI.**
>
> ## ⭐ **TO'G'RI YONDASHUV:**
> ```
> ① Bir necha variant TUZING
> ② Sinov to'plamida O'LCHANG
> ③ Eng yaxshisini TANLANG
> ④ Taxmin qilmang — kesilish o'zi YOMON emas, ma'noli matn kesilsa yomon
> ```

---

## 7. 🇺🇿 Amaliy tayyorlash quvuri

```python
import pandas as pd


def tayyorla(yol, encoding="cp1252"):
    """🇺🇿 To'liq tayyorlash: o'qish → tozalash → ID → matn → tekshirish."""
    d = pd.read_csv(yol, encoding=encoding)

    # ① tozalash
    for c in d.columns:
        if d[c].dtype == object:
            d[c] = d[c].map(tozala)

    # ② barqaror ID
    d["unique_id"] = d.course_id.astype(str) + "-" + d.section_id.astype(str)
    assert d.unique_id.nunique() == len(d), "💥 TAKRORIY ID"

    # ③ birlashgan matn (bir necha variant)
    d["matn_a"] = d.apply(lambda r: tozala(
        f'{r.course_name} {r.course_technology} {r.course_description} '
        f'{r.section_name} {r.section_description}'), axis=1)
    d["matn_b"] = d.apply(lambda r: tozala(
        f'{r.section_name}. {r.course_name}. {r.course_technology}. '
        f'{r.section_description}'), axis=1)
    d["matn_c"] = d.apply(lambda r: tozala(
        f'{r.course_name}. {r.section_name}. {r.section_description}. '
        f'{r.course_technology}'), axis=1)

    # ④ tekshirish
    print(f"✅ {len(d)} qator · {d.unique_id.nunique()} noyob ID")
    for c in ["matn_a", "matn_b", "matn_c"]:
        tok = d[c].str.len() / 4
        print(f"   {c}: o'rt {int(tok.mean()):4d} tok · "
              f"256 dan oshgan {(tok > 256).sum():3d}/{len(d)}")
    bosh = d.isna().sum()[lambda x: x > 0]
    if len(bosh):
        print(f"   ⚠️ bo'sh qiymatlar: {dict(bosh)}")
    return d


bolimlar = tayyorla("course_section_descriptions.csv")
```

> ## 🏆 **UCH VARIANT — CHUNKI QAYSI BIRI YAXSHIROQ EKANINI OLDINDAN BILMAYSIZ.**
>
> ## ⭐ **`assert d.unique_id.nunique() == len(d)` — JIM XATONI OLDINDAN TO'XTATADI.**

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun ustunlarni birlashtirish?

**M2.** Nima uchun jumla tuziladi?

**M3.** Barqaror ID nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Vektor **butun kontekstni** ushlaydi; alohida ustun — **ma'nosiz**.

**M2.** ## Model **tabiiy matnda** o'qitilgan — jumla unga **tanishroq**.

**M3.** ## Ma'lumotdan **kelib chiqadigan** ID — `course_id-section_id`. Qayta indekslashda **aynan o'sha**.

</details>

### 🟡 O'rta

**M4.** ⭐ Matn variantlarini tuzing va uzunligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
MAKS = model.max_seq_length

VARIANTLAR = {
    "① kurs tartibi": lambda r: (f'{r.course_name} {r.course_technology} '
                                 f'{r.course_description} {r.section_name} '
                                 f'{r.section_description}'),
    "② bo'lim oldinda": lambda r: (f'{r.section_name}. {r.course_name}. '
                                   f'{r.course_technology}. '
                                   f'{r.section_description}'),
    "③ kurs+bo'lim": lambda r: (f'{r.course_name}. {r.section_name}. '
                                f'{r.section_description}. '
                                f'{r.course_technology}'),
    "④ jumla (kurs)": lambda r: (
        f"The course name is {r.course_name}, the technology is "
        f"{r.course_technology}, the section is {r.section_name}: "
        f"{r.section_description}"),
    "⑤ faqat nomlar": lambda r: f'{r.section_name}. {r.course_name}',
}

for nom, f in VARIANTLAR.items():
    u = bolimlar.apply(lambda r: len(tozala(f(r))), axis=1)
    tok = u / 4
    print(f"  {nom:18s} o'rt {int(tok.mean()):4d} tok · "
          f"oshgan {int((tok > MAKS).sum()):3d}/{len(u)} "
          f"({(tok > MAKS).mean():5.0%})")
```

## 🔑 **HAR VARIANT — BOSHQA MIQDORDA MA'LUMOT SAQLAYDI.** Qaysi biri yaxshiroq — **o'lchash kerak**.

</details>

**M5.** ⭐⭐ Variantlarni sinov to'plamida solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np

SINOVLAR = [
    ("regression in Python",        "Machine Learning in Python"),
    ("clustering in Python",        "Customer Analytics in Python"),
    ("SQL joins",                   "SQL"),
    ("deep learning neural networks", "Deep Learning with TensorFlow"),
    ("data visualization Tableau",  "Introduction to Tableau"),
    ("time series forecasting",     "Time Series Analysis"),
    ("web scraping",                "Web Scraping"),
    ("credit risk",                 "Credit Risk Modeling"),
]

natijalar = []
for nom, f in VARIANTLAR.items():
    matnlar = bolimlar.apply(lambda r: tozala(f(r)), axis=1).tolist()
    E = model.encode(matnlar, show_progress_bar=False, batch_size=64)
    E = E / np.linalg.norm(E, axis=1, keepdims=True)

    togri, ballar = 0, []
    for savol, kutilgan in SINOVLAR:
        q = model.encode(savol)
        q = q / np.linalg.norm(q)
        b = E @ q
        i = int(np.argmax(b))
        ballar.append(float(b[i]))
        togri += int(kutilgan.lower() in bolimlar.iloc[i].course_name.lower())

    tok = pd.Series(matnlar).str.len() / 4
    natijalar.append({"variant": nom,
                      "aniqlik": f"{togri}/{len(SINOVLAR)}",
                      "o'rt_ball": round(float(np.mean(ballar)), 4),
                      "o'rt_tok": int(tok.mean()),
                      "kesilgan_%": round(float((tok > MAKS).mean()) * 100)})

d = pd.DataFrame(natijalar)
print(d.to_string(index=False))
print("\n💡 'kesilgan_%' PAST bo'lgan variant DOIM ham aniqroq EMAS")
```

## 💥 **BIZNING O'LCHOVIMIZDA:** kurs tartibi **7/8** *(52% kesilgan)*, bo'lim oldinda **6/8** *(0% kesilgan)*.

## 🏆 **XULOSA: TAXMIN QILMANG — O'LCHANG.**

</details>

**M6.** ⭐ Tozalash quvurini yozing.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 7-bo'limdagi `tayyorla()` funksiyasini ishga tushiring va qo'shing:

```python
# ── tozalash TA'SIRI ──
xom = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")
toza = tayyorla("course_section_descriptions.csv")

for u in ["course_description", "section_description"]:
    x = xom[u].str.len().sum()
    t = toza[u].str.len().sum()
    print(f"  {u:22s} {x:,} → {t:,} belgi ({1-t/x:5.1%} tejaldi)")
```

## 💡 **TEJALGAN BELGILAR — 256 TOKEN CHEGARASIDA HAR BIRI QIMMAT.**

</details>

---

## 📌 Xulosa

```python
def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


bolimlar["unique_id"] = (bolimlar.course_id.astype(str) + "-"
                         + bolimlar.section_id.astype(str))
assert bolimlar.unique_id.nunique() == len(bolimlar)     # ⭐ SHART

bolimlar["matn"] = bolimlar.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.course_description} '
    f'{r.section_name} {r.section_description}'), axis=1)
```

```
⭐ Ustunlarni BIR matnga birlashtiring — vektor kontekstni ushlaydi
⭐ Barqaror ID: course_id-section_id  (680/680 noyob ✅)
⭐ Tozalash BIRINCHI qadam — 3848 ta \r
⚠️ Metadata'da to'liq matn saqlamang · NaN → "" ga aylantiring

🔬 O'LCHANGAN — VA KUTILGANDEK EMAS:
   kurs tartibi   52% kesilgan  →  aniqlik 7/8
   bo'lim oldinda  0% kesilgan  →  aniqlik 6/8
```

> ## 🏆🏆 **"KESILISH YOMON" — TO'G'RI. "QISQAROQ = YAXSHIROQ" — NOTO'G'RI.**
> ## **MUHIMI — QAYSI MATN KESILADI. TAXMIN QILMANG, O'LCHANG.**

---

⬅️ [3-dars. Ma'lumot](03-Getting-to-Know-the-Data.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Embedding algoritmlari](05-Embedding-Algorithms.md)
