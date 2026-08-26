# 7-dars. O'xshashlik qidiruvi va chegara ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Vektor bazasi HAR DOIM natija qaytaradi. Hatto savol butunlay begona bo'lsa ham."**

---

## 1. Kursning kodi

```python
savol = "regression"
q = model.encode(savol).tolist()

natija = indeks.query(vector=q, top_k=12, include_metadata=True)

for m in natija["matches"]:
    if m["score"] > 0.4:
        print(f"{m['id']} ({m['score']:.2f})")
        print(f"   {m['metadata']['course_name']}")
```

> ## 🔑 **KURSNING ASOSIY G'OYASI TO'G'RI:** *"Ball 0.4 dan past bo'lsa — ko'rsatmang."*
>
> ## ⚠️ **LEKIN 0.4 QAYERDAN KELDI?** Kurs buni **tushuntirmaydi**. Biz — **o'lchaymiz**.

---

## 2. 💥 Nima uchun chegara SHART

```python
BOR = ["regression in Python", "clustering in Python", "SQL joins",
       "deep learning neural networks", "data visualization Tableau",
       "time series forecasting", "web scraping", "credit risk"]

YOQ = ["how to cook pasta", "weather in Tashkent", "football scores",
       "buy a used car", "history of Rome", "yoga for beginners"]
```

```
javob BOR  →  min 0.5326  maks 0.7941  o'rt 0.6552
javob YO'Q →  min 0.1208  maks 0.2190  o'rt 0.1757
```

> ## 💥 **"HOW TO COOK PASTA" HAM 0.1743 BALL OLDI VA NATIJA QAYTARDI.**
>
> ## 🔑 **VEKTOR BAZASI "TOPILMADI" DEB AYTMAYDI.** U **eng yaqin** k ta vektorni qaytaradi — **qanchalik uzoq bo'lsa ham**.
>
> ## 🏆 **CHEGARA — "JAVOB YO'Q" DEYISHNING YAGONA YO'LI.**

---

## 3. ⭐⭐⭐ Chegarani hisoblash

```python
oraliq = 0.5326 - 0.2190          # eng past BOR - eng yuqori YO'Q
chegara = (0.5326 + 0.2190) / 2
```

```
🏆 CHEGARA 0.3758  (oraliq 0.3136)
   →  kursning 0.4 si TO'G'RI ✅
```

> ## ✅ **KURSNING TAXMINI TASDIQLANDI** — 0.4 va o'lchangan 0.3758 **deyarli bir xil**.
>
> ## ⭐ **LEKIN ENDI BIZ NIMA UCHUN EKANINI BILAMIZ:**
> ```
> eng past BOR    0.5326   ← undan PAST qo'ysak, axlat kiradi
> eng yuqori YO'Q 0.2190   ← undan YUQORI qo'ysak, kerakli chiqib ketadi
> ORALIQ          0.3136   ← katta oraliq = ishonchli ajratish
> ```
>
> ## ⚠️ **VA E'TIBOR BERING — CHEGARA MATN TARTIBIGA HAM BOG'LIQ.**
> ```
> kurs tartibi (matn_a)  →  chegara 0.3758  oraliq 0.3136
> bo'lim oldinda         →  chegara 0.3889  oraliq 0.2717
> ```
> ## 🔑 **YA'NI MATNNI O'ZGARTIRSANGIZ — CHEGARANI HAM QAYTA O'LCHANG.**
>
> ## 💥 **ORALIQ MANFIY BO'LSA** *(eng past BOR < eng yuqori YO'Q)* — ## **hech qanday chegara ishlamaydi.** ## Bu — **model yomon** degani, chegara emas.

---

## 4. ⭐⭐ Chegarani avtomatik topish funksiyasi

```python
import numpy as np, pandas as pd


def chegara_top(qidiruv, bor_savollar, yoq_savollar, k=5):
    """🏆 Sinov to'plamidan CHEGARANI hisoblaydi."""
    bor = [qidiruv.qidir(s, k=k)[0]["ball"] for s in bor_savollar]
    yoq = [qidiruv.qidir(s, k=k)[0]["ball"] for s in yoq_savollar]

    bor_min, yoq_maks = min(bor), max(yoq)
    oraliq = bor_min - yoq_maks
    chegara = (bor_min + yoq_maks) / 2

    print(f"  javob BOR  min {bor_min:.4f} maks {max(bor):.4f} "
          f"o'rt {np.mean(bor):.4f}")
    print(f"  javob YO'Q min {min(yoq):.4f} maks {yoq_maks:.4f} "
          f"o'rt {np.mean(yoq):.4f}")

    if oraliq <= 0:
        print(f"  💥 ORALIQ MANFIY ({oraliq:.4f}) — MODELNI ALMASHTIRING")
        return None
    print(f"  🏆 CHEGARA {chegara:.4f}  (oraliq {oraliq:.4f})")
    return round(chegara, 4)


CHEGARA = chegara_top(q, BOR, YOQ)
```

> ## ⭐ **BU FUNKSIYANI HAR MODEL ALMASHGANDA QAYTA ISHLATING.** ## Chegara — **modelga bog'liq**, universal emas.
>
> ## ⚠️ **BIZNING UCH MODELDA:**
> ```
> all-MiniLM-L6-v2         ajratish 0.4596  →  chegara ~0.39
> all-mpnet-base-v2        ajratish 0.4988  →  chegara BOSHQA
> paraphrase-multilingual  ajratish 0.4177  →  chegara BOSHQA
> ```
> ## 💥 **BIR MODELNING CHEGARASINI BOSHQASIGA QO'LLAMANG.**

---

## 5. ⭐ To'liq qidiruv funksiyasi

```python
def qidiruv_natijasi(qidiruv, savol, k=12, chegara=0.3758,
                     texnologiya=None):
    """🇺🇿 Chegarali, filtrli, guruhlangan qidiruv."""
    filtr = {"course_technology": texnologiya} if texnologiya else None
    xom = qidiruv.qidir(savol, k=k, filtr=filtr)
    mos = [x for x in xom if x["ball"] >= chegara]

    if not mos:
        eng = xom[0]["ball"] if xom else 0
        print(f"❌ '{savol}' — mos kurs topilmadi "
              f"(eng yuqori ball {eng:.4f} < {chegara})")
        return []

    # ⭐ kurs bo'yicha guruhlash — bir kursning 5 bo'limi ko'rinmasin
    kurslar = {}
    for x in mos:
        nom = x["meta"]["course_name"]
        if nom not in kurslar:
            kurslar[nom] = {"ball": x["ball"], "bolimlar": []}
        kurslar[nom]["bolimlar"].append(x["meta"]["section_name"])

    print(f"\n🔎 '{savol}' — {len(kurslar)} kurs")
    for nom, d in sorted(kurslar.items(), key=lambda i: -i[1]["ball"]):
        print(f"  {d['ball']:.4f}  {nom}")
        for b in d["bolimlar"][:3]:
            print(f"            +-- {b}")
    return list(kurslar.items())
```

```
🔎 'regression in Python' — 4 kurs
  0.7435  Machine Learning in Python
            +-- Linear Regression with sklearn
            +-- Linear Regression
            +-- Linear Regression Practical Example
  0.6682  Python for Finance
            +-- Using Regressions for Financial Analysis
            +-- Multivariate Regression Analysis
            +-- Measuring Investment Risk
  0.5536  Introduction to Python
            +-- Functions
            +-- Python Variables and Data Types
            +-- Basic Python Syntax
  0.5206  Customer Analytics in Python
            +-- Modeling Purchase Quantity

🔎 'how to cook pasta' — mos kurs topilmadi (eng yuqori ball 0.1743 < 0.3758)
```

> ## 🏆 **GURUHLASH — KURSDA YO'Q, LEKIN FOYDALANUVCHI UCHUN MUHIM.** ## Aks holda **"Machine Learning in Python"** ning 3 ta regressiya bo'limi ro'yxatni **to'ldirib yuboradi**.
>
> ## ⚠️ **VA UCHINCHI NATIJAGA E'TIBOR BERING:**
> ```
> 0.5536  Introduction to Python
>            +-- Functions
>            +-- Python Variables and Data Types
> ```
> ## 💥 **BU BO'LIMLARDA REGRESSIYA YO'Q** — ular faqat *"Python"* so'zi tufayli chiqdi.
>
> ## 🔑 **CHEGARADAN O'TGAN HAR BIR NATIJA TO'G'RI DEGANI EMAS.** ## Chegara — **axlatni** kesadi, **yaqin-lekin-noto'g'ri** ni emas. ## Buning yechimi — **qayta tartiblash (reranking)**, *42-modul, 12-dars*.

---

## 6. ⚠️ Chegara bilan bog'liq tuzoqlar

> ### ① 💥 **Chroma masofasi ≠ o'xshashlik**
> ```python
> # Chroma "distance" qaytaradi — KICHIK = yaxshi
> ball = 1 - masofa          # ⭐ kosinusda shunday
> ```
> ## ⚠️ **`hnsw:space` `"l2"` BO'LSA — `1 - masofa` NOTO'G'RI.** ## Kosinus ishlatayotganingizni **tekshiring**.
>
> ### ② 💥 **Chegara — kurs uchun emas, MODEL uchun**
> ## Model almashsa — **qayta o'lchang**.
>
> ### ③ 💥 **`top_k` ni chegaradan OLDIN qo'llash**
> ```
> ❌ top_k=3   →  chegaradan o'tgani 1 ta bo'lishi mumkin
> ✅ top_k=12  →  chegara  →  keyin 3 tasini ko'rsating
> ```
>
> ### ④ 🇺🇿 **O'zbekcha so'rovda chegara BOSHQA**
> ```
> all-MiniLM-L6-v2:  UZ ballar o'rtacha 0.2371
>                    →  💥 0.3758 CHEGARASIDAN PASTDA
>                    →  💥 HAMMA O'ZBEKCHA SO'ROV "topilmadi" beradi
> ```
> ## 🏆 **BU — 🇺🇿 LOYIHADAGI ENG XAVFLI XATO.** ## Ko'p tilli modelda UZ o'rtacha **0.5541** — chegara **ishlaydi**.

---

## 7. ⭐⭐ Metadata filtri

```python
# faqat Python kurslari
r = q.qidir("regression", k=5,
            filtr={"course_technology": "python"})

# bir necha texnologiya
r = q.qidir("regression", k=5,
            filtr={"course_technology": {"$in": ["python", "sql"]}})
```

> ## ⚠️ **CHROMA VA PINECONE FILTR SINTAKSISI BIR XIL EMAS:**
> ```
> Chroma   :  {"course_technology": {"$in": [...]}}   ✅ ishlaydi
> Chroma   :  {"a": 1, "b": 2}   →  💥 {"$and": [...]} kerak
> Pinecone :  {"a": 1, "b": 2}   →  ✅ ishlaydi
> ```
>
> ## 💥 **O'LCHANGAN — CHROMA'DA IKKI SHART XATO BERADI:**
> ```
> ValueError: Expected where to have exactly one operator,
>             got {'course_technology': 'python', 'course_id': 30}
> ```
>
> ## ✅ **CHROMA'DA TO'G'RI YOZILISHI:**
> ```python
> filtr = {"$and": [{"course_technology": "python"},
>                   {"course_id": {"$gte": 30}}]}     # ✅ 5 natija
> ```
>
> ## ⭐ **YAXSHI XABAR — BU OCHIQ XATO, JIM EMAS.** ## Kodni ko'chirganda **darhol bilinadi**.
>
> ## 💥 **VA FILTR NATIJANI KAMAYTIRADI** — `top_k=5` so'rasangiz, filtrdan keyin **2 ta** qolishi mumkin.

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun chegara kerak?

**M2.** Chegara qanday hisoblanadi?

**M3.** Oraliq manfiy bo'lsa nima qilish kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Baza **doim** natija qaytaradi. ## Chegarasiz — **"how to cook pasta"** ham kurs tavsiya qiladi.

**M2.** ## `(eng past BOR + eng yuqori YO'Q) / 2` — ## sinov to'plamida **o'lchanadi**.

**M3.** ## 💥 **Model yomon** — chegara yordam bermaydi. ## **Modelni almashtiring**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Chegarani o'z ma'lumotingizda o'lchang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi `chegara_top()` ni ishga tushiring, so'ng chegaralar bo'yicha jadval quring:

```python
q_natija = []
for c in [0.0, 0.2, 0.3, 0.3758, 0.4, 0.5, 0.6]:
    bor_otdi = sum(q.qidir(s, k=1)[0]["ball"] >= c for s in BOR)
    yoq_otdi = sum(q.qidir(s, k=1)[0]["ball"] >= c for s in YOQ)
    q_natija.append({"chegara": c,
                     "BOR_otdi": f"{bor_otdi}/{len(BOR)}",
                     "YOQ_otdi": f"{yoq_otdi}/{len(YOQ)}",
                     "sof": bor_otdi - yoq_otdi})

d = pd.DataFrame(q_natija)
print(d.to_string(index=False))
eng = d.loc[d["sof"].idxmax()]
print(f"\n🏆 ENG YAXSHI CHEGARA: {eng.chegara}")
```

```
 chegara BOR_otdi YOQ_otdi  sof
  0.0000      8/8      6/6    2
  0.2000      8/8      2/6    6
  0.3000      8/8      0/6    8   ⭐
  0.3758      8/8      0/6    8   ⭐
  0.4000      8/8      0/6    8   ⭐
  0.5000      8/8      0/6    8   ⭐
  0.6000      5/8      0/6    5
```

## 💡 **0.3–0.5 ORALIG'I BIR XIL ISHLAYDI** — ## chunki oraliq **katta** *(0.3136)*. ## O'rtasini olish — **eng xavfsiz**.

## 💥 **0.6 DA `5/8` — UCHTA TO'G'RI JAVOB YO'QOLDI.** ## "Chegarani baland qo'ysam ishonchliroq" — **noto'g'ri**.

</details>

**M5.** ⭐⭐ 🇺🇿 O'zbekcha so'rovlarda chegarani tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
UZ_BOR = ["Python da regressiya", "SQL birlashtirish",
          "ma'lumotlarni vizualizatsiya qilish", "chuqur o'rganish"]
UZ_YOQ = ["osh qanday pishiriladi", "Toshkentda ob-havo"]

for model_nomi in ["all-MiniLM-L6-v2",
                   "paraphrase-multilingual-MiniLM-L12-v2"]:
    qq = KursQidiruv(nom=f"uz-{model_nomi[:12].lower()}",
                     model_nomi=model_nomi)
    qq.yukla(bolimlar.unique_id.tolist(), bolimlar.matn_a.tolist(),
             [{"course_name": r.course_name[:80]}
              for _, r in bolimlar.iterrows()])
    print(f"\n🇺🇿 {model_nomi}")
    ch = chegara_top(qq, UZ_BOR, UZ_YOQ)
    if ch and ch < 0.3:
        print("   ⚠️ chegara JUDA PAST — ajratish zaif")
```

## 💥 **`all-MiniLM-L6-v2` DA UZ BALLARI 0.2371 O'RTACHA** — ## inglizcha chegara *(0.3758)* **hamma o'zbekcha so'rovni rad etadi**.

## 🏆 **KO'P TILLI MODELDA UZ 0.5541** — chegara **ishlaydi**.

</details>

**M6.** ⭐ Guruhlangan qidiruvni yozing va sinang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi `qidiruv_natijasi()` ni ishlatib:

```python
for s in ["regression in Python", "SQL joins", "neural networks",
          "how to cook pasta", "Excel formulas"]:
    qidiruv_natijasi(q, s, k=12, chegara=CHEGARA)
```

## 💡 **"Excel formulas" — QIZIQ HOLAT.** ## 365 da Excel kursi **bor**, shuning uchun ball **yuqori**. ## Bu — chegara **to'g'ri ishlayotganini** ko'rsatadi.

</details>

---

## 📌 Xulosa

```python
xom = indeks.query(vector=q, top_k=12, include_metadata=True)
mos = [m for m in xom["matches"] if m["score"] >= 0.3758]   # ⭐ CHEGARA

if not mos:
    print("❌ mos kurs topilmadi")
```

```
🔬 O'LCHANGAN (8 ta BOR + 6 ta YO'Q savol):
   javob BOR   min 0.5326  maks 0.7941  o'rt 0.6552
   javob YO'Q  min 0.1208  maks 0.2190  o'rt 0.1757
   🏆 CHEGARA  0.3758   (oraliq 0.3136)
   ✅ kursning 0.4 si — TASDIQLANDI

💥 top_k ni chegaradan OLDIN emas, KEYIN qisqartiring
💥 chegara MODELGA bog'liq — almashsa QAYTA o'lchang
🇺🇿 all-MiniLM da UZ o'rtacha 0.2371  →  chegara HAMMASINI rad etadi
💥 chegarani BALAND qo'yish ham zarar: 0.6 da 5/8 (3 to'g'ri javob yo'qoldi)
```

> ## 🏆🏆 **VEKTOR BAZASI HECH QACHON "TOPILMADI" DEMAYDI. BUNI SIZ AYTASIZ — CHEGARA ORQALI.**

---

⬅️ [6-dars. Yuklash](06-Embedding-and-Upserting.md) · 🏠 [Modul boshiga](README.md) · ➡️ [8-dars. Bazani yangilash](08-Updating-the-Database.md)
