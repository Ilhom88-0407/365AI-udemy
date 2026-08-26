# 9-dars. Bo'lim darajasidagi qidiruv ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 6 soat davom etadi. Foydalanuvchiga kerak bo'lgan qism — 12 daqiqa. Uni QANDAY topamiz?"**

---

## 1. Muammo

```
FOYDALANUVCHI: "SQL joins"

❌ KURS DARAJASI:
   →  "Advanced SQL" (6 soat)
   →  qaysi qismida? BILINMAYDI

✅ BO'LIM DARAJASI:
   →  "SQL" kursi, "SQL JOINs" bo'limi
   →  ⭐ TO'G'RIDAN-TO'G'RI kerakli joyga
```

> ## 🔑 **KURSNING G'OYASI:** *"106 ta kurs o'rniga 680 ta bo'limni indekslaymiz."*
>
> ## ⚠️ **VA KURS SHUNDAY DEYDI:** *"Bu aniqlikni oshiradi."* ## Biz — **tekshiramiz**.

---

## 2. 🔬 Kurs darajasi vs bo'lim darajasi — o'lchangan

```python
# ── kurs darajasi: 106 vektor ──
kurslar["matn"] = kurslar.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.course_topic} '
    f'{r.course_description}'), axis=1)

# ── bo'lim darajasi: 680 vektor ──
bolimlar["matn"] = bolimlar.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.course_description} '
    f'{r.section_name} {r.section_description}'), axis=1)
```

```
  kurs  : 106 vektor · o'rt 247 tok · kesilgan  37/106 (35%)
  bo'lim: 680 vektor · o'rt 313 tok · kesilgan 351/680 (52%)
```

```
                       savol  kurs_ball                 kurs_topdi    K
        regression in Python     0.5472 Machine Learning in Python   ✅
        clustering in Python     0.5698 Machine Learning in Python   💥
                   SQL joins     0.5314               Advanced SQL   ✅
deep learning neural network     0.4989 Deep Learning with TensorF   ✅
  data visualization Tableau     0.8776    Introduction to Tableau   ✅
     time series forecasting     0.4291 Time Series Analysis with    ✅
                web scraping     0.7528 Web Scraping and API Funda   ✅
                 credit risk     0.4875 Credit Risk Modeling in Py   ✅

                       savol  bolim_ball                    bolim_topdi    B
        regression in Python      0.7435  Machine Learning / Linear Regr   ✅
        clustering in Python      0.7190  Machine Learning / Other Types  💥
                   SQL joins      0.6512  SQL / SQL JOINs                 ✅
deep learning neural network      0.5358  Deep Learning / Conclusion      ✅
  data visualization Tableau      0.7941  Intro to Tableau / Functionalit ✅
     time series forecasting      0.5326  Time Series / Forecasting       ✅
                web scraping      0.7269  Web Scraping / requests-html    ✅
                 credit risk      0.5383  Credit Risk / PD model          ✅

  kurs darajasi  : 7/8
  bo'lim darajasi: 7/8
```

> ## ⚠️⚠️ **ANIQLIK BO'YICHA — DURANG. 7/8 VA 7/8.**
>
> ## 💥 **KURSNING "BO'LIM DARAJASI ANIQROQ" DEGAN DA'VOSI — BIZNING SINOVIMIZDA TASDIQLANMADI.**
>
> ## 🏆 **LEKIN BO'LIM DARAJASI BOSHQA NARSA BERADI — VA U MUHIMROQ:**
> ```
> savol: "SQL joins"
>
> kurs darajasi  →  "Advanced SQL"          ✅ to'g'ri kurs, 6 soat
> bo'lim darajasi →  "SQL" / "SQL JOINs"    ⭐ TO'G'RIDAN-TO'G'RI kerakli 12 daqiqa
> ```
>
> ## 🔑 **YA'NI YUTUQ — ANIQLIKDA EMAS, `GRANULYARLIKDA`.**
>
> ## ⭐ **VA BALLARGA E'TIBOR BERING:**
> ```
> "regression in Python"  kurs 0.5472  →  bo'lim 0.7435   ⭐ +36%
> "time series"           kurs 0.4291  →  bo'lim 0.5326   ⭐ +24%
> "data visualization"    kurs 0.8776  →  bo'lim 0.7941   ⚠️ −10%
> ```
> ## 💡 **BO'LIM DARAJASIDA BALLAR ODATDA YUQORIROQ** — ## chunki matn **aniqroq mavzuga** tegishli. ## Bu — **chegara qo'yishni osonlashtiradi**.

---

## 3. 💥 "clustering in Python" — ikkalasi ham "xato"?

```
kutilgan   : Customer Analytics in Python
topilgan   : Machine Learning in Python / "Other Types of Clustering"
```

> ## ⚠️⚠️ **BU YERDA TO'XTAB, HALOL SAVOL BERAMIZ: MODEL XATO QILDIMI, YOKI MENING SINOV TO'PLAMIM XATOMI?**
>
> ## 🔑 **"Machine Learning in Python" KURSIDA HAQIQATAN HAM `Other Types of Clustering` BO'LIMI BOR.**
>
> ## 🏆 **YA'NI MODELNING JAVOBI — TO'G'RI. MENING "KUTILGAN JAVOB"IM — TOR.**
>
> ## 💥 **BU — SINOV TO'PLAMI QURISHDAGI ENG KO'P UCHRAYDIGAN XATO:**
> ```
> ❌ har savolga BITTA to'g'ri javob deb hisoblash
> ✅ bir necha maqbul javobni ro'yxatga olish
> ```
>
> ## ⭐ **TO'G'RILANGAN SINOV TO'PLAMI:**
> ```python
> SINOVLAR = [
>     ("clustering in Python",
>      {"Customer Analytics in Python",           # ⭐ bir nechta
>       "Machine Learning in Python"}),
> ]
>
> togri += int(any(k.lower() in topilgan.lower() for k in kutilgan))
> ```
>
> ## 🇺🇿 **DARS: `7/8` NI KO'RGANDA "MODEL YOMON" DEB XULOSA QILMANG.** ## Avval **o'sha bitta xatoni ochib ko'ring** — ko'pincha **sinov to'plami** aybdor.

---

## 4. ⭐⭐ Bo'lim natijalarini kursga qaytarish

```python
def kurs_bolib(E, df, savol, model, k=12):
    """⭐ Bo'lim ballaridan ENG YAXSHI kursni topadi."""
    q = model.encode(savol)
    q = q / np.linalg.norm(q)
    ballar = E @ q

    top = np.argsort(-ballar)[:k]
    kurslar = {}
    for i in top:
        nom = df.iloc[int(i)].course_name
        kurslar[nom] = max(kurslar.get(nom, 0), float(ballar[int(i)]))
    return sorted(kurslar.items(), key=lambda x: -x[1])
```

```
    regression in Python           -> Machine Learning in Python         0.7435 ✅
    clustering in Python           -> Machine Learning in Python         0.7190 💥
    SQL joins                      -> SQL                                0.6512 ✅
    deep learning neural networks  -> Deep Learning with TensorFlow      0.5358 ✅
    data visualization Tableau     -> Introduction to Tableau            0.7941 ✅
    time series forecasting        -> Time Series Analysis with Python   0.5326 ✅
    web scraping                   -> Web Scraping and API Fundamentals  0.7269 ✅
    credit risk                    -> Credit Risk Modeling in Python     0.5383 ✅

  guruhlangan bo'lim darajasi: 7/8
```

> ## 🏆🏆 **BU — ENG YAXSHI YECHIM:**
> ```
> ① Bo'lim darajasida QIDIRASIZ    →  aniq, yuqori ballar
> ② Kurs bo'yicha GURUHLAYSIZ      →  foydalanuvchi kursni ko'radi
> ③ Bo'limlarni ostiga chiqarasiz  →  qayerdan boshlashni biladi
> ```
>
> ## ⭐ **VA `max()` — MUHIM DETAL:**
> ```python
> kurslar[nom] = max(kurslar.get(nom, 0), ball)   # ✅ eng yaxshi bo'lim
> # emas:  kurslar[nom] += ball                    # 💥 ko'p bo'limli kurs yutadi
> ```
> ## 💥 **`+=` ISHLATSANGIZ** — 40 bo'limli kurs 3 bo'limli kursni **doim yengadi**, ## garchi har bir bo'limi **kamroq mos** bo'lsa ham.

---

## 4b. ⚠️ "Conclusion" muammosi

```
"deep learning neural networks"
   →  Deep Learning with TensorFlow / ⚠️ "Conclusion"   0.5358
```

> ## 💥 **TO'G'RI KURS, LEKIN FOYDASIZ BO'LIM.**
>
> ## 🔑 **NIMA UCHUN?** ## Matn tarkibi: `course_name + technology + course_description + section_name + section_description`. ## `course_description` **hamma bo'limda bir xil** — ## shuning uchun **"Conclusion"** ham kursning umumiy mavzusidan **yuqori ball** oladi.
>
> ## ⭐ **YECHIM — BO'LIMLARNI FILTRLASH:**
> ```python
> FOYDASIZ = {"conclusion", "introduction", "setting up the environment",
>             "course overview", "what's next", "summary", "welcome"}
>
> bolimlar["foydali"] = ~bolimlar.section_name.str.lower().isin(FOYDASIZ)
> ```
> ## 🏆 **BULARNI INDEKSDAN CHIQARIB TASHLAMANG** — ## ular ham kerak bo'lishi mumkin. ## Ularni **metadata bilan belgilang** va **natijada pastga tushiring**.
>
> ```python
> ball = x["ball"] * (1.0 if x["meta"]["foydali"] else 0.85)
> ```

---

## 5. ⭐ Qaysi darajani tanlash?

| Holat | Daraja |
|---|---|
| Kurs **tavsiya** qilish | ## ⭐ **kurs darajasi** — 6× kam vektor |
| Aniq **savolga javob** | ## 🏆 **bo'lim darajasi** |
| **RAG** uchun kontekst | ## 🏆 **bo'lim** — 42-modul, 6-dars |
| Katalog **filtri** | ## kurs darajasi |
| ⭐ **Eng yaxshisi** | ## 🏆 **bo'lim + kurs bo'yicha guruhlash** |

> ## 💾 **NARX FARQI:**
> ```
> kurs darajasi  :  106 vektor  ×  384  ×  4 B  ≈  163 KB
> bo'lim darajasi:  680 vektor  ×  384  ×  4 B  ≈    1 MB
>                                                   ⭐ 6.4× katta
> ```
> ## 💡 **BU HAJMDA — ARZIMAS.** ## 1M kursda esa — **6M bo'lim**, ya'ni **9 GB**. ## O'shanda **o'ylash kerak**.

---

## 6. ⭐⭐ Ikki bosqichli qidiruv (katta katalog uchun)

```python
def ikki_bosqich(Ek, Eb, kurslar, bolimlar, savol, model,
                 kurs_k=5, bolim_k=5):
    """🏆 Avval KURSNI, keyin ichidan BO'LIMNI topadi."""
    q = model.encode(savol)
    q = q / np.linalg.norm(q)

    # ① kurs darajasida qidiramiz (106 vektor — tez)
    bk = Ek @ q
    top_kurs = np.argsort(-bk)[:kurs_k]
    kurs_ids = set(kurslar.iloc[top_kurs].course_id)

    # ② FAQAT o'sha kurslarning bo'limlari ichidan (5×7 ≈ 35 vektor)
    mask = bolimlar.course_id.isin(kurs_ids).values
    bb = np.where(mask, Eb @ q, -1)
    top_bolim = np.argsort(-bb)[:bolim_k]

    return [(bolimlar.iloc[int(i)].course_name,
             bolimlar.iloc[int(i)].section_name,
             round(float(bb[int(i)]), 4)) for i in top_bolim]
```

> ## 🔑 **NIMA UCHUN?**
> ```
> 1M kurs · 6M bo'lim
>    to'g'ridan-to'g'ri  →  6M vektorni skanerlash
>    ikki bosqich        →  1M + 30    ⭐ 6× tez
> ```
>
> ## ⚠️ **LEKIN NARXI BOR:** ## agar to'g'ri bo'lim **6-o'rindagi** kursda bo'lsa — ## u **butunlay yo'qoladi**. ## `kurs_k` ni **kattaroq** oling *(10–20)*.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Bo'lim darajasi nima uchun kerak?

**M2.** `max()` va `+=` guruhlashda nima farq qiladi?

**M3.** Nima uchun "Conclusion" bo'limi yuqori ball oldi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## ⚠️ Aniqlik uchun **emas** *(o'lchangan: 7/8 va 7/8)* — ## 🏆 **granulyarlik** uchun: 6 soatlik kurs o'rniga **12 daqiqalik bo'lim**.

**M2.** ## `+=` — 💥 **ko'p bo'limli kurs har doim yutadi**. ## `max()` — **eng mos bo'lim** hal qiladi.

**M3.** ## Matnda `course_description` bor — ## u **hamma bo'limda bir xil**, shuning uchun mazmunsiz bo'lim ham **kurs mavzusidan** ball oladi.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Ikki darajani o'z sinov to'plamingizda solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd


def norm(A):
    return A / np.linalg.norm(A, axis=1, keepdims=True)


Ek = norm(model.encode(kurslar.matn.tolist(), batch_size=32,
                       show_progress_bar=False))
Eb = norm(model.encode(bolimlar.matn.tolist(), batch_size=32,
                       show_progress_bar=False))

rows, tk, tb = [], 0, 0
for savol, kutilgan in SINOVLAR:
    q = model.encode(savol)
    q = q / np.linalg.norm(q)

    bk = Ek @ q
    ik = int(np.argmax(bk))
    ok_k = kutilgan.lower() in kurslar.iloc[ik].course_name.lower()
    tk += ok_k

    bb = Eb @ q
    ib = int(np.argmax(bb))
    ok_b = kutilgan.lower() in bolimlar.iloc[ib].course_name.lower()
    tb += ok_b

    rows.append({"savol": savol[:26],
                 "kurs": round(float(bk[ik]), 4),
                 "K": "✅" if ok_k else "💥",
                 "bolim": round(float(bb[ib]), 4),
                 "B": "✅" if ok_b else "💥",
                 "farq_%": round((float(bb[ib]) / float(bk[ik]) - 1) * 100)})

d = pd.DataFrame(rows)
print(d.to_string(index=False))
print(f"\n  kurs {tk}/{len(SINOVLAR)} · bo'lim {tb}/{len(SINOVLAR)}")
print(f"  ball o'rtacha farq: {d['farq_%'].mean():+.0f}%")
```

## 💡 **BIZNING O'LCHOVIMIZDA — ANIQLIK BIR XIL, BALLAR BO'LIM DARAJASIDA YUQORIROQ.**

</details>

**M5.** ⭐⭐ Sinov to'plamini "bir necha to'g'ri javob" ga o'zgartiring.

<details>
<summary>✅ Yechim</summary>

```python
SINOVLAR_KENG = [
    ("regression in Python",   {"Machine Learning in Python",
                                "Python for Finance"}),
    ("clustering in Python",   {"Customer Analytics in Python",
                                "Machine Learning in Python"}),   # ⭐
    ("SQL joins",              {"SQL", "Advanced SQL"}),
    ("deep learning neural networks", {"Deep Learning with TensorFlow"}),
    ("data visualization Tableau",    {"Introduction to Tableau"}),
    ("time series forecasting", {"Time Series Analysis"}),
    ("web scraping",            {"Web Scraping"}),
    ("credit risk",             {"Credit Risk Modeling"}),
]

togri = 0
for savol, kutilganlar in SINOVLAR_KENG:
    q = model.encode(savol)
    q = q / np.linalg.norm(q)
    i = int(np.argmax(Eb @ q))
    topilgan = bolimlar.iloc[i].course_name.lower()
    ok = any(k.lower() in topilgan for k in kutilganlar)
    togri += ok
    print(f"  {'✅' if ok else '💥'} {savol[:30]:30s} -> "
          f"{bolimlar.iloc[i].course_name[:34]}")

print(f"\n  KENG sinov: {togri}/{len(SINOVLAR_KENG)}")
```

## 🏆 **8/8 — VA "MODEL XATO QILDI" DEGAN XULOSA YO'QOLDI.**

## ⚠️ **EHTIYOT BO'LING:** ro'yxatni **haddan tashqari** kengaytirsangiz — sinov **ma'nosiz** bo'ladi. ## Faqat **haqiqatan maqbul** javoblarni qo'shing.

</details>

**M6.** ⭐⭐ Ikki bosqichli qidiruvni yozing va tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time

for savol, _ in SINOVLAR[:3]:
    t0 = time.perf_counter()
    q = model.encode(savol)
    q = q / np.linalg.norm(q)
    _ = np.argsort(-(Eb @ q))[:5]
    tugri = time.perf_counter() - t0

    t0 = time.perf_counter()
    r = ikki_bosqich(Ek, Eb, kurslar, bolimlar, savol, model)
    ikki = time.perf_counter() - t0

    print(f"\n🔎 {savol}")
    print(f"   to'g'ridan-to'g'ri {tugri*1000:6.2f} ms")
    print(f"   ikki bosqich       {ikki*1000:6.2f} ms")
    for kn, bn, b in r[:3]:
        print(f"     {b:.4f}  {kn[:30]:30s} / {bn[:28]}")
```

## ⚠️ **680 VEKTORDA IKKI BOSQICH — SEKINROQ** *(model.encode ikki marta emas, lekin qo'shimcha hisob bor)*.

## 🏆 **FOYDA FAQAT MILLIONLAB VEKTORDA KO'RINADI.** ## Kichik bazada — **oddiy qidiruv yaxshiroq**.

</details>

---

## 📌 Xulosa

```python
# ⭐ ENG YAXSHI NAQSH: bo'limda qidir, kursga guruhla
top = np.argsort(-ballar)[:12]
kurslar = {}
for i in top:
    nom = df.iloc[int(i)].course_name
    kurslar[nom] = max(kurslar.get(nom, 0), float(ballar[int(i)]))  # ⭐ max
```

```
🔬 O'LCHANGAN (8 sinov savoli):
   kurs darajasi   (106 vektor)  →  7/8
   bo'lim darajasi (680 vektor)  →  7/8      ⚠️ DURANG
   guruhlangan bo'lim            →  7/8

⭐ YUTUQ ANIQLIKDA EMAS — GRANULYARLIKDA:
   "SQL joins"  →  6 soatlik kurs O'RNIGA  →  "SQL JOINs" bo'limi

⭐ Ballar bo'lim darajasida odatda YUQORIROQ (+24…+36%)
💥 "Conclusion" ham yuqori ball oladi — course_description hammada bir xil
💥 Guruhlashda += emas, max() ishlating
```

> ## 🏆🏆 **VA ENG MUHIM DARS: `7/8` NI KO'RIB "MODEL YOMON" DEMANG.** ## **O'SHA BITTA XATONI OCHIB KO'RING — KO'PINCHA SINOV TO'PLAMI AYBDOR.**

---

⬅️ [8-dars. Yangilash](08-Updating-the-Database.md) · 🏠 [Modul boshiga](README.md) · ➡️ [10-dars. Og'irlikli embedding](10-Weighted-Embeddings.md)
