# 📝 51-modul mashqlari

> **26 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI HAQIQIY 365 MA'LUMOTIDA** — 106 kurs, 680 bo'lim, API kalitisiz.

## ⚙️ Tayyorgarlik

```bash
pip install chromadb sentence-transformers pandas numpy rank-bm25
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, hashlib, shutil
import numpy as np, pandas as pd, chromadb
from sentence_transformers import SentenceTransformer

KURSLAR = "course_descriptions.csv"
BOLIMLAR = "course_section_descriptions.csv"


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


def norm(A):
    return A / np.linalg.norm(A, axis=1, keepdims=True)


def yukla_csv(yol):
    d = pd.read_csv(yol, encoding="cp1252")          # ⭐ utf-8 EMAS
    for c in d.columns:
        if d[c].dtype == object:
            d[c] = d[c].map(tozala)
    return d


kurslar = yukla_csv(KURSLAR)
bolimlar = yukla_csv(BOLIMLAR)
bolimlar["unique_id"] = (bolimlar.course_id.astype(str) + "-"
                         + bolimlar.section_id.astype(str))
bolimlar["matn"] = bolimlar.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.course_description} '
    f'{r.section_name} {r.section_description}'), axis=1)

model = SentenceTransformer("all-MiniLM-L6-v2")
E = norm(model.encode(bolimlar.matn.tolist(), batch_size=32,
                      show_progress_bar=False))

SINOVLAR = [
    ("regression in Python",          "Machine Learning in Python"),
    ("clustering in Python",          "Customer Analytics in Python"),
    ("SQL joins",                     "SQL"),
    ("deep learning neural networks", "Deep Learning with TensorFlow"),
    ("data visualization Tableau",    "Introduction to Tableau"),
    ("time series forecasting",       "Time Series Analysis"),
    ("web scraping",                  "Web Scraping"),
    ("credit risk",                   "Credit Risk Modeling"),
]
YOQ = ["how to cook pasta", "weather in Tashkent", "football scores",
       "buy a used car", "history of Rome", "yoga for beginners"]
```

---

# 🟢 OSON *(1–9)*

**M1.** CSV ni `encoding="utf-8"` bilan o'qing. Nima bo'ladi?

**M2.** `\r` belgilari nechta va nima uchun zarar?

**M3.** Barqaror ID nima uchun `course_name` dan yaxshiroq?

**M4.** Chegara nima uchun kerak?

**M5.** `upsert` mavjud ID bilan nima qiladi?

**M6.** Chroma masofasini o'xshashlikka qanday aylantirasiz?

**M7.** `ajratish` ko'rsatkichi nima?

**M8.** Nima uchun guruhlashda `max()` ishlatiladi, `+=` emas?

**M9.** 🇺🇿 `all-MiniLM-L6-v2` da o'zbekcha so'rovlar nima uchun ishlamaydi?

<details>
<summary>✅ Javoblar (1–9)</summary>

**M1.**
```python
try:
    pd.read_csv(BOLIMLAR, encoding="utf-8")
except UnicodeDecodeError as e:
    print(f"💥 {e}")
```
```
💥 'utf-8' codec can't decode byte 0x92 in position ...
```
## `0x92` — Windows'ning **qiyshiq apostrofi** *(cp1252)*.

**M2.**
```python
xom = pd.read_csv(BOLIMLAR, encoding="cp1252")
print("\\r soni:", sum(str(x).count("\r")
                       for c in xom.columns for x in xom[c]))
```
```
\r soni: 3848
```
## 💥 Ular **token sarflaydi** va matnni **kesib** yuboradi.

**M3.** ## Nom **o'zgaradi** → yangi ID → 💥 **eski yozuv arvoh bo'lib qoladi**.

**M4.** ## Baza **doim** natija qaytaradi — `"how to cook pasta"` ham **0.1743** ball oladi.

**M5.** ## **Ustiga yozadi**, 💥 **xato chiqarmaydi**.

**M6.** ## `ball = 1 - masofa` — faqat `hnsw:space="cosine"` bo'lganda.

**M7.** ## `mos_o'rt − nomos_o'rt`. ## **Katta** bo'lsa — chegara qo'yish **oson**.

**M8.** ## `+=` da **40 bo'limli kurs** 3 bo'limlisini **doim yengadi**.

**M9.** ## O'lchangan **UZ/EN = 0.39** — ## inglizcha chegara *(0.3758)* **hamma o'zbekcha so'rovni** rad etadi.

</details>

---

# 🟡 O'RTA *(10–20)*

**M10.** ⭐ Beshta matn variantini tuzing va uzunligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
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
    "④ jumla": lambda r: (f"The course name is {r.course_name}, the "
                          f"technology is {r.course_technology}, the "
                          f"section is {r.section_name}: "
                          f"{r.section_description}"),
    "⑤ faqat nomlar": lambda r: f'{r.section_name}. {r.course_name}',
}

for nom, f in VARIANTLAR.items():
    tok = bolimlar.apply(lambda r: len(tozala(f(r))), axis=1) / 4
    print(f"  {nom:18s} o'rt {int(tok.mean()):4d} tok · "
          f"kesilgan {int((tok > MAKS).sum()):3d}/{len(tok)} "
          f"({(tok > MAKS).mean():4.0%})")
```

</details>

**M11.** ⭐⭐ Variantlarni aniqlik bo'yicha solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
nat = []
for nom, f in VARIANTLAR.items():
    matnlar = bolimlar.apply(lambda r: tozala(f(r)), axis=1).tolist()
    Ev = norm(model.encode(matnlar, batch_size=32,
                           show_progress_bar=False))
    togri, mos = 0, []
    for savol, kutilgan in SINOVLAR:
        q = model.encode(savol)
        q = q / np.linalg.norm(q)
        b = Ev @ q
        i = int(np.argmax(b))
        mos.append(float(b[i]))
        togri += int(kutilgan.lower()
                     in bolimlar.iloc[i].course_name.lower())
    tok = pd.Series(matnlar).str.len() / 4
    nat.append({"variant": nom, "aniqlik": f"{togri}/{len(SINOVLAR)}",
                "mos_ort": round(float(np.mean(mos)), 4),
                "kesilgan_%": round(float((tok > MAKS).mean()) * 100)})

print(pd.DataFrame(nat).to_string(index=False))
print("\n💡 'kesilgan_%' PAST bo'lgan variant DOIM ham aniqroq EMAS")
```

## 💥 **BIZDA:** kurs tartibi *(52% kesilgan)* **7/8**, bo'lim oldinda *(0% kesilgan)* **6/8**.

</details>

**M12.** ⭐ Chegarani hisoblang va chegara jadvalini quring.

<details>
<summary>✅ Yechim</summary>

```python
def eng_ball(savol):
    q = model.encode(savol)
    return float((E @ (q / np.linalg.norm(q))).max())


bor = [eng_ball(s) for s, _ in SINOVLAR]
yoq = [eng_ball(s) for s in YOQ]
CH = round((min(bor) + max(yoq)) / 2, 4)

print(f"  BOR min {min(bor):.4f} maks {max(bor):.4f} "
      f"o'rt {np.mean(bor):.4f}")
print(f"  YOQ min {min(yoq):.4f} maks {max(yoq):.4f} "
      f"o'rt {np.mean(yoq):.4f}")
print(f"  🏆 CHEGARA {CH} (oraliq {min(bor)-max(yoq):.4f})")

rows = []
for c in [0.0, 0.2, 0.3, CH, 0.4, 0.5, 0.6]:
    rows.append({"chegara": round(c, 4),
                 "BOR": f"{sum(b >= c for b in bor)}/{len(bor)}",
                 "YOQ": f"{sum(b >= c for b in yoq)}/{len(yoq)}",
                 "sof": sum(b >= c for b in bor) - sum(b >= c for b in yoq)})
print(pd.DataFrame(rows).to_string(index=False))
```

```
  🏆 CHEGARA 0.3758 (oraliq 0.3136)
  0.6 da BOR 5/8  →  💥 3 to'g'ri javob YO'QOLDI
```

</details>

**M13.** ⭐⭐ Uch modelni to'liq solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def model_bahola(model_nomi, matnlar, df, nom_ustuni="course_name"):
    t0 = time.perf_counter()
    m = SentenceTransformer(model_nomi)
    yuk = time.perf_counter() - t0

    t0 = time.perf_counter()
    A = m.encode(matnlar, batch_size=32, show_progress_bar=False)
    emb = time.perf_counter() - t0
    An = A / np.linalg.norm(A, axis=1, keepdims=True)

    togri, mos = 0, []
    for savol, kutilgan in SINOVLAR:
        q = m.encode(savol)
        q = q / np.linalg.norm(q)
        b = An @ q
        i = int(np.argmax(b))
        mos.append(float(b[i]))
        togri += int(kutilgan.lower()
                     in str(df.iloc[i][nom_ustuni]).lower())

    nomos = []
    for s in YOQ:
        q = m.encode(s)
        q = q / np.linalg.norm(q)
        nomos.append(float((An @ q).max()))

    nrm = float(np.linalg.norm(m.encode("x")))
    return {"model": model_nomi.split("/")[-1][:32], "olcham": A.shape[1],
            "maks_tok": m.max_seq_length, "norma": round(nrm, 3),
            "aniqlik": f"{togri}/{len(SINOVLAR)}",
            "ajratish": round(float(np.mean(mos) - np.mean(nomos)), 4),
            "emb_s": round(emb, 1), "yuk_s": round(yuk, 1)}


q = [model_bahola(mn, bolimlar.matn.tolist(), bolimlar)
     for mn in ["all-MiniLM-L6-v2", "all-mpnet-base-v2",
                "paraphrase-multilingual-MiniLM-L12-v2"]]
d = pd.DataFrame(q)
print(d.to_string(index=False))
eng = d.loc[d.ajratish.idxmax()]
print(f"\n🏆 ENG YAXSHI AJRATISH: {eng.model} ({eng.ajratish})")
```

</details>

**M14.** ⭐⭐ 🇺🇿 UZ/EN nisbatini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
UZ = ["Python dasturlash", "ma'lumotlarni vizualizatsiya qilish",
      "mashinali o'qitish", "chuqur o'rganish",
      "ma'lumotlar bazasi so'rovlari"]
EN = ["Python programming", "data visualization", "machine learning",
      "deep learning", "database queries"]

for mn in ["all-MiniLM-L6-v2", "paraphrase-multilingual-MiniLM-L12-v2"]:
    m = SentenceTransformer(mn)
    A = norm(m.encode(bolimlar.matn.tolist(), batch_size=32,
                      show_progress_bar=False))
    ball = {}
    for til, sor in [("UZ", UZ), ("EN", EN)]:
        b = []
        for s in sor:
            q = m.encode(s)
            b.append(float((A @ (q / np.linalg.norm(q))).max()))
        ball[til] = float(np.mean(b))
    nisbat = ball["UZ"] / ball["EN"]
    print(f"  {'✅' if nisbat > 0.7 else '💥'} {mn.split('/')[-1][:34]:34s} "
          f"UZ {ball['UZ']:.4f} / EN {ball['EN']:.4f} = {nisbat:.2f}")
```

```
  💥 all-MiniLM-L6-v2                   UZ/EN = 0.39
  ✅ paraphrase-multilingual-MiniLM-L12 UZ/EN = 0.80
```

</details>

**M15.** ⭐ Batch tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
N, q = 200, []
for h in [1, 8, 16, 32, 64, 128]:
    t0 = time.perf_counter()
    if h == 1:
        _ = [model.encode(x) for x in bolimlar.matn[:N]]
    else:
        _ = model.encode(bolimlar.matn[:N].tolist(), batch_size=h,
                         show_progress_bar=False)
    dt = time.perf_counter() - t0
    q.append({"batch_size": h, "vaqt_s": round(dt, 2),
              "vektor_s": round(N / dt, 1)})
d = pd.DataFrame(q)
d["tezlashuv"] = (d.vektor_s / d.vektor_s.iloc[0]).round(1)
print(d.to_string(index=False))
```

## 💥 **CPU'DA `batch_size=8` DAN KEYIN FOYDA YO'Q** — ## o'lchangan tezlashuv atigi **1.5×** *(GPU'da 50×+)*.

</details>

**M16.** ⭐⭐ Xeshli sinxronlashni yozing va uch senariyni sinang.

<details>
<summary>✅ Yechim</summary>

*(To'liq `sinxronla()` kodi 8-darsda.)*

```python
print("① birinchi"); sinxronla(q, ids, matnlar, metalar)
print("② qayta");    sinxronla(q, ids, matnlar, metalar)
print("③ o'zgargan"); sinxronla(q, ids[:678], m2, metalar[:678])
```

```
① qo'shildi 680
② o'zgarmagan 680 · vektorlangan 0        ✅ idempotent
③ yangilandi 1 · o'chirildi 2 · bazada 678 ✅
```

</details>

**M17.** ⭐⭐ Arvoh yozuvlarni toping.

<details>
<summary>✅ Yechim</summary>

```python
def arvoh_top(qidiruv, joriy_ids):
    bazada = set(qidiruv.idx.get()["ids"])
    arvoh = bazada - set(joriy_ids)
    yetishmas = set(joriy_ids) - bazada
    print(f"  bazada {len(bazada)} · manbada {len(joriy_ids)}")
    print(f"  💥 arvoh {len(arvoh)} {sorted(arvoh)[:5]}")
    print(f"  💥 yetishmas {len(yetishmas)} {sorted(yetishmas)[:5]}")
    return arvoh, yetishmas
```

</details>

**M18.** ⭐⭐ Kurs va bo'lim darajasini solishtiring.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 9-darsda, M4.)*

```
  kurs darajasi  (106 vektor) : 7/8
  bo'lim darajasi (680 vektor): 7/8      ⚠️ DURANG
```

## 🏆 **YUTUQ ANIQLIKDA EMAS — GRANULYARLIKDA.**

</details>

**M19.** ⭐⭐ Og'irlikli embeddingni sinang.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 10-darsda, M4.)*

```
   HAMMA 8 TAJRIBA  →  7/8    💥 aniqlik o'zgarmadi
   🏆 texnologiyasiz  ajratish 0.4935
   💥 texnologiya ×3  ajratish 0.3982
```

</details>

**M20.** ⭐ Tavsiya tizimini quring.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 11-darsda.)*

```python
for kurs in ["Introduction to Python", "SQL"]:
    print(f"\n🎓 '{kurs}':")
    for nom, ball in oxshash_kurslar(E, bolimlar, kurs, k=5):
        print(f"   {ball:.4f}  {nom}")
```

</details>

---

# 🔴 QIYIN *(21–26)*

**M21.** ⭐⭐⭐ To'liq baholash quvurini yozing — model, matn varianti va chegarani **birgalikda** optimallashtirsin.

<details>
<summary>✅ Yechim</summary>

```python
def toliq_bahola(model_nomlari, variantlar, df, sinovlar, yoq):
    """🏆 Model × matn varianti — hamma kombinatsiya."""
    nat = []
    for mn in model_nomlari:
        m = SentenceTransformer(mn)
        maks = m.max_seq_length
        for vnom, f in variantlar.items():
            matnlar = df.apply(lambda r: tozala(f(r)), axis=1).tolist()
            A = m.encode(matnlar, batch_size=32, show_progress_bar=False)
            A = A / np.linalg.norm(A, axis=1, keepdims=True)

            togri, mos = 0, []
            for savol, kutilgan in sinovlar:
                qq = m.encode(savol)
                qq = qq / np.linalg.norm(qq)
                b = A @ qq
                i = int(np.argmax(b))
                mos.append(float(b[i]))
                togri += int(kutilgan.lower()
                             in str(df.iloc[i].course_name).lower())
            nomos = []
            for s in yoq:
                qq = m.encode(s)
                qq = qq / np.linalg.norm(qq)
                nomos.append(float((A @ qq).max()))

            oraliq = min(mos) - max(nomos)
            tok = pd.Series(matnlar).str.len() / 4
            nat.append({
                "model": mn.split("/")[-1][:26], "variant": vnom[:16],
                "togri": togri, "aniqlik": f"{togri}/{len(sinovlar)}",
                "ajratish": round(float(np.mean(mos)
                                        - np.mean(nomos)), 4),
                "chegara": round((min(mos) + max(nomos)) / 2, 4),
                "oraliq": round(oraliq, 4),
                "kesilgan_%": round(float((tok > maks).mean()) * 100)})

    d = pd.DataFrame(nat).sort_values(["togri", "oraliq"], ascending=False)
    print(d.drop(columns=["togri"]).to_string(index=False))
    eng = d.iloc[0]
    print(f"\n🏆 ENG YAXSHI: {eng.model} + {eng.variant}")
    print(f"   aniqlik {eng.aniqlik} · chegara {eng.chegara} "
          f"· oraliq {eng.oraliq}")
    return d


toliq_bahola(["all-MiniLM-L6-v2", "all-mpnet-base-v2"],
             VARIANTLAR, bolimlar, SINOVLAR, YOQ)
```

## 🔑 **SARALASH `oraliq` BO'YICHA** — aniqlik teng bo'lganda ## **ajratishi kattaroq** kombinatsiya **ishonchliroq**.

</details>

**M22.** ⭐⭐⭐ Gibrid qidiruv (RRF) quring va faqat-vektor bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from collections import defaultdict
from rank_bm25 import BM25Okapi

korpus = [m.lower().split() for m in bolimlar.matn]
bm25 = BM25Okapi(korpus)


def rrf(*royxatlar, k=60, n=10):
    ball = defaultdict(float)
    for r_lst in royxatlar:
        for r, x in enumerate(r_lst):
            ball[int(x)] += 1 / (k + r + 1)
    return [i for i, _ in sorted(ball.items(), key=lambda x: -x[1])[:n]]


QIYIN = ["SQLAlchemy", "requests-html", "PD model",
         "predicting numbers from data", "tables joining",
         "regression in Python"]

for savol in QIYIN:
    qv = model.encode(savol)
    qv = qv / np.linalg.norm(qv)
    v = list(np.argsort(-(E @ qv))[:10])
    b = list(np.argsort(-bm25.get_scores(savol.lower().split()))[:10])
    g = rrf(v, b, n=3)

    print(f"\n🔎 {savol}")
    for nom, ind in [("vektor", v[:3]), ("BM25", b[:3]), ("🏆 gibrid", g)]:
        s = " | ".join(bolimlar.iloc[int(i)].section_name[:20] for i in ind)
        print(f"   {nom:10s} {s}")
```

## 💡 **ANIQ NOMLAR** *(`SQLAlchemy`)* — BM25 topadi, vektor **yo'q**. ## **MA'NO SAVOLLARI** — vektor topadi, BM25 **yo'q**. ## 🏆 **Gibrid — ikkalasida ham.**

</details>

**M23.** ⭐⭐⭐ "Sinov to'plami xatosi" ni aniqlaydigan tekshiruvchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
def sinov_tekshir(E, df, sinovlar, k=5):
    """🔍 'Xato' natijalarni OCHIB ko'radi — model xatomi yoki sinovmi?"""
    for savol, kutilgan in sinovlar:
        q = model.encode(savol)
        q = q / np.linalg.norm(q)
        b = E @ q
        top = np.argsort(-b)[:k]

        birinchi = df.iloc[int(top[0])]
        if kutilgan.lower() in str(birinchi.course_name).lower():
            continue

        print(f"\n💥 '{savol}' — kutilgan: {kutilgan}")
        print(f"   topilgan: {birinchi.course_name} / "
              f"{birinchi.section_name}  ({b[top[0]]:.4f})")

        # ⭐ kutilgan javob NECHANCHI o'rinda?
        mos = df.index[df.course_name.str.lower()
                       .str.contains(kutilgan.lower(), regex=False)]
        if len(mos) == 0:
            print("   ⚠️ KUTILGAN KURS KATALOGDA YO'Q — sinov xato")
            continue
        eng = max(int(i) for i in mos)
        orin = int(np.where(np.argsort(-b) == np.argmax(b[list(mos)]))[0][0])
        print(f"   kutilgan kursning eng yaxshi ball: "
              f"{b[list(mos)].max():.4f}")
        print(f"   💡 farq atigi "
              f"{b[top[0]] - b[list(mos)].max():.4f} — "
              f"ikkalasi ham maqbulmi?")


sinov_tekshir(E, bolimlar, SINOVLAR)
```

## 🏆 **BIZNING HOLATDA:** `"clustering in Python"` uchun ## `Machine Learning in Python` / `Other Types of Clustering` topildi — ## **bu ham to'g'ri javob**. ## Sinov to'plami **tor** edi, model emas.

</details>

**M24.** ⭐⭐⭐ Anomaliya detektorini yozing va katalog sifatini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
def katalog_sifati(E, df, chegara=0.55):
    S = E @ E.T
    np.fill_diagonal(S, -1)
    eng_yaqin = S.max(axis=1)

    d = pd.DataFrame({
        "course_name": df.course_name.str[:28],
        "section_name": df.section_name.str[:26],
        "eng_yaqin": eng_yaqin.round(4),
        "tavsif_belgi": df.section_description.astype(str).str.len(),
    }).sort_values("eng_yaqin")

    print(f"💥 {int((eng_yaqin < chegara).sum())} ta anomaliya "
          f"(chegara {chegara})\n")
    print(d.head(12).to_string(index=False))

    qisqa = d[d.tavsif_belgi < 100]
    print(f"\n⚠️ 100 belgidan qisqa tavsif: {len(qisqa)} ta")
    print(f"   ularning o'rtacha eng_yaqin bali: "
          f"{qisqa.eng_yaqin.mean():.4f}")
    print(f"   qolganlarniki: "
          f"{d[d.tavsif_belgi >= 100].eng_yaqin.mean():.4f}")
    return d


katalog_sifati(E, bolimlar)
```

## 💥 **`E @ E.T` — `n²` XOTIRA.** ## 680 → 3.7 MB ✅ · 100 000 → **80 GB** 💥.

</details>

**M25.** ⭐⭐⭐ 🇺🇿 To'liq o'zbekcha qidiruv tizimini quring va chegarasini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
UZ_BOR = [
    ("Python da regressiya",                "Machine Learning in Python"),
    ("SQL jadvallarni birlashtirish",       "SQL"),
    ("ma'lumotlarni vizualizatsiya qilish", "Tableau"),
    ("chuqur o'rganish neyron tarmoq",      "Deep Learning"),
    ("veb sahifadan ma'lumot yig'ish",      "Web Scraping"),
]
UZ_YOQ = ["osh qanday pishiriladi", "Toshkentda ob-havo",
          "futbol natijalari", "avtomobil sotib olish"]

for mn in ["all-MiniLM-L6-v2", "paraphrase-multilingual-MiniLM-L12-v2"]:
    m = SentenceTransformer(mn)
    A = norm(m.encode(bolimlar.matn.tolist(), batch_size=32,
                      show_progress_bar=False))

    bor, togri = [], 0
    for savol, kutilgan in UZ_BOR:
        q = m.encode(savol)
        q = q / np.linalg.norm(q)
        b = A @ q
        i = int(np.argmax(b))
        bor.append(float(b[i]))
        togri += int(kutilgan.lower()
                     in bolimlar.iloc[i].course_name.lower())
    yoq = []
    for s in UZ_YOQ:
        q = m.encode(s)
        q = q / np.linalg.norm(q)
        yoq.append(float((A @ q).max()))

    oraliq = min(bor) - max(yoq)
    print(f"\n🇺🇿 {mn.split('/')[-1]}")
    print(f"   aniqlik  {togri}/{len(UZ_BOR)}")
    print(f"   BOR o'rt {np.mean(bor):.4f} · YO'Q o'rt {np.mean(yoq):.4f}")
    if oraliq <= 0:
        print(f"   💥 ORALIQ MANFIY ({oraliq:.4f}) — CHEGARA IMKONSIZ")
    else:
        print(f"   ✅ chegara {(min(bor)+max(yoq))/2:.4f} "
              f"(oraliq {oraliq:.4f})")
```

## 🏆 **BU MASHQ — MODULNING ENG MUHIMI.** ## U 🇺🇿 loyihada **qaysi model** kerakligini ## **taxmin bilan emas, o'lchov bilan** hal qiladi.

</details>

**M26.** ⭐⭐⭐ Ishlab chiqarish uchun to'liq tekshiruv skriptini yozing.

<details>
<summary>✅ Yechim</summary>

```python
def toliq_tekshiruv(qidiruv, df, sinovlar, yoq, chegara, model_nomi):
    """🏆 Deploy oldidan MAJBURIY tekshiruv — 8 band."""
    xatolar, ogoh = [], []

    # ① soni
    if qidiruv.soni() != len(df):
        xatolar.append(f"soni {qidiruv.soni()} != {len(df)}")

    # ② takroriy ID
    if df.unique_id.nunique() != len(df):
        xatolar.append("manbada TAKRORIY ID")

    # ③ arvoh
    if qidiruv.turi == "chroma":
        arvoh = set(qidiruv.idx.get()["ids"]) - set(df.unique_id)
        if arvoh:
            xatolar.append(f"{len(arvoh)} ta ARVOH yozuv")

    # ④ model mosligi
    r = qidiruv.qidir("test", k=1)
    if r and r[0]["meta"].get("_model") != model_nomi:
        xatolar.append(f"MODEL MOS EMAS: {r[0]['meta'].get('_model')}")

    # ⑤ aniqlik
    togri = 0
    for savol, kutilgan in sinovlar:
        rr = qidiruv.qidir(savol, k=1)
        togri += bool(rr) and kutilgan.lower() in rr[0]["meta"][
            "course_name"].lower()
    if togri < len(sinovlar) * 0.75:
        xatolar.append(f"ANIQLIK PAST: {togri}/{len(sinovlar)}")
    elif togri < len(sinovlar):
        ogoh.append(f"aniqlik {togri}/{len(sinovlar)} — "
                    f"xato javoblarni tekshiring")

    # ⑥ chegara YO'Q savollarni to'sadimi
    otdi = [s for s in yoq
            if (rr := qidiruv.qidir(s, k=1)) and rr[0]["ball"] >= chegara]
    if otdi:
        xatolar.append(f"chegara ISHLAMAYAPTI: {otdi}")

    # ⑦ ball oralig'i
    if r and not (-1.01 <= r[0]["ball"] <= 1.01):
        xatolar.append(f"ball oralig'i g'alati: {r[0]['ball']}")

    # ⑧ bo'sh metadata
    if r and any(v is None for v in r[0]["meta"].values()):
        ogoh.append("metadata'da None bor — Pinecone rad etadi")

    print("💥 XATOLAR:\n  " + "\n  ".join(xatolar) if xatolar
          else "✅ HAMMA TEKSHIRUV O'TDI")
    if ogoh:
        print("⚠️ OGOHLANTIRISH:\n  " + "\n  ".join(ogoh))
    return not xatolar
```

## 🏆 **BU SKRIPTNI CI'GA QO'YING.** ## Har indekslashdan keyin **avtomatik** ishlasin.

</details>

---

## 📌 Yakuniy o'lchovlar jadvali

| O'lchov | Natija |
|---|---|
| CSV kodlash | ## `cp1252` · 💥 `utf-8` **xato beradi** |
| `\r` belgilari | ## **3848 ta** |
| Noyob ID | ## ✅ **680/680** |
| Token kesilishi | ## **351/680 (52%)** |
| Chegara | ## 🏆 **0.3758** *(oraliq 0.3136)* |
| Kurs vs bo'lim darajasi | ## **7/8 va 7/8** — ⚠️ **durang** |
| Og'irlikli embedding | ## 💥 **8 tajriba, hammasi 7/8** |
| Batch tezlashuvi (CPU) | ## ⚠️ **1.5×** *(8 dan keyin foyda yo'q)* |
| Xeshli sinxronlash | ## 🏆 **103× tejam** |
| 🇺🇿 UZ/EN — `all-MiniLM` | ## 💥 **0.39** |
| 🇺🇿 UZ/EN — ko'p tilli | ## 🏆 **0.80** |

---

🏠 [Modul boshiga](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
