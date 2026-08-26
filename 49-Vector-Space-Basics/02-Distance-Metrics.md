# 2-dars. Vektor fazosidagi masofa metrikalari ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Masofa metrikasi TANLOVIGA qarab, 'yaqinlik' HAR XIL o'lchanadi."**

---

## 1. To'rt metrika

```python
import numpy as np

def evklid(a, b):
    return float(np.sqrt(np.sum((np.array(a) - np.array(b)) ** 2)))

def manhetten(a, b):
    return float(np.sum(np.abs(np.array(a) - np.array(b))))

def skalyar(a, b):
    return float(np.dot(a, b))

def kosinus(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
```

| Metrika | Formula | Nima o'lchaydi | Yaxshi |
|---|---|---|---|
| ## **Evklid** | `√Σ(pᵢ−qᵢ)²` | ## **To'g'ri chiziq** masofasi | ## **KICHIK** |
| ## **Manhetten** | `Σ\|pᵢ−qᵢ\|` | ## **To'rtburchak** yo'l | ## **KICHIK** |
| ## **Skalyar** | `Σ pᵢqᵢ` | ## **Yo'nalish × MAGNITUDA** | ## **KATTA** |
| ## ⭐ **Kosinus** | `(p·q)/(\|p\|\|q\|)` | ## **FAQAT yo'nalish** | ## **KATTA** |

---

## 2. 💥💥 METRIKA TANLOVI NATIJANI O'ZGARTIRADI — o'lchandi

Kursning **o'z hayvonlari** bilan sinaymiz:

```python
HAYVONLAR = {"Dog": [4., 0., 1.], "Cat": [4., 0., 1.], "Chicken": [2., 2., 1.],
             "Mantis": [6., 2., 3.], "Elephant": [4., 0., 1.]}
SOROV = [4., 0., 1.]                    # "Dog" ning aynan o'zi
```

```
  hayvon          vektor  evklid  manhetten  skalyar  kosinus
     Dog [4.0, 0.0, 1.0]  0.0000        0.0     17.0   1.0000
     Cat [4.0, 0.0, 1.0]  0.0000        0.0     17.0   1.0000
 Chicken [2.0, 2.0, 1.0]  2.8284        4.0      9.0   0.7276
  Mantis [6.0, 2.0, 3.0]  3.4641        6.0     27.0   0.9355
Elephant [4.0, 0.0, 1.0]  0.0000        0.0     17.0   1.0000
```

### 🏆 Har metrika bo'yicha eng yaqin 3 ta

```
evklid     → ['Dog', 'Cat', 'Elephant']
manhetten  → ['Dog', 'Cat', 'Elephant']
skalyar    → ['Mantis', 'Dog', 'Cat']        ← 💥 MANTIS BIRINCHI!
kosinus    → ['Dog', 'Cat', 'Elephant']
```

> ## 💥💥💥 **SKALYAR KO'PAYTMA `Mantis` NI BIRINCHI QO'YDI** — garchi u so'rovga **AYNAN TENG EMAS**!
>
> ## 🔑 **NIMA UCHUN?**
> ```
> Mantis = [6, 2, 3]  →  magnitudasi KATTA (|v| = 7.0)
> Dog    = [4, 0, 1]  →  magnitudasi kichik (|v| = 4.12)
>
> Skalyar = yo'nalish × MAGNITUDA
>         → UZUN vektor DOIM yuqori ball oladi
> ```

### 💥 Mantis va Chicken — metrika tanloviga qarab teskari natija

```
evklid    : Mantis  3.4641 · Chicken  2.8284  →  yaqinroq: Chicken
skalyar   : Mantis 27.0000 · Chicken  9.0000  →  yaqinroq: Mantis
kosinus   : Mantis  0.9355 · Chicken  0.7276  →  yaqinroq: Mantis
```

> ## 🏆🏆 **BU — BUTUN MODULNING ENG MUHIM DARSI:**
> ## **BIR XIL MA'LUMOT, BIR XIL SO'ROV — LEKIN METRIKA TANLOVIGA QARAB JAVOB BOSHQACHA.**
>
> ## ⚠️ **VA BU — KURSDA KO'RSATILMAGAN.** U metrikalarni **alohida-alohida** tushuntiradi, lekin **ular bir xil ma'lumotda qarama-qarshi natija berishini** ko'rsatmaydi.

---

## 3. ⭐⭐ Skalyar va kosinus — MAGNITUDA farqi

```python
A = np.array([1., 1.])
B = np.array([10., 10.])      # ⭐ AYNAN bir yo'nalish, 10× uzun
C = np.array([1., 0.])        # 45° burchak

print(f"A·B = {np.dot(A,B):5.2f}   kosinus(A,B) = {kosinus(A,B):.4f}")
print(f"A·C = {np.dot(A,C):5.2f}   kosinus(A,C) = {kosinus(A,C):.4f}")
```

```
A·B = 20.00   kosinus(A,B) = 1.0000
A·C =  1.00   kosinus(A,C) = 0.7071
```

> ## 🔑 **IKKALASI HAM `B` NI YAQINROQ DEDI — LEKIN BOSHQA SABABGA KO'RA:**
> ```
> Skalyar : B ustun, chunki U UZUNROQ (magnituda 14.14 vs 1.0)
> Kosinus : B ustun, chunki U AYNAN BIR YO'NALISHDA (burchak 0°)
> ```
>
> ## 💥 **FARQ SHU YERDA KO'RINADI:**
> ```
> D = np.array([0.1, 0.1])          # bir yo'nalish, LEKIN JUDA KALTA
> print(f"A·D = {np.dot(A,D):.2f}   kosinus(A,D) = {kosinus(A,D):.4f}")
> # A·D = 0.20   kosinus(A,D) = 1.0000
> ```
> ## 🏆 **KOSINUS: `D` VA `B` BIR XIL (1.0000). SKALYAR: `B` 100× YUQORI.**

---

## 4. ⭐⭐⭐ Qaysi metrikani tanlash?

| Vaziyat | Metrika | Sabab |
|---|---|---|
| ## **Matn embeddinglari** | ## ⭐ **Kosinus** | ## Uzunlik **ahamiyatsiz**, **ma'no** muhim |
| Vektorlar **normallashgan** | ## **Skalyar** ≡ kosinus | ## ⭐ **Tezroq** *(bo'lish yo'q)* |
| Fizik masofa *(GPS, robot)* | ## **Evklid** | ## Haqiqiy **masofa** |
| Shahar yo'llari | **Manhetten** | Diagonal **yurib bo'lmaydi** |
| Tavsiya *(reyting)* | ## Skalyar | ## **Faollik** ham hisobga olinsin |
| Yuqori o'lchamli, siyrak | Manhetten | Evklidga qaraganda **barqarorroq** |

> ## 🏆🏆 **AMALIY QOIDA — MATN UCHUN DOIM KOSINUS.**
>
> ## 💡 **VA AGAR MODEL VEKTORLARNI NORMALLASHTIRSA** *(masalan `all-MiniLM-L6-v2`, norma **1.0**)*:
> ```
> skalyar == kosinus   →  ⭐ SKALYARNI ISHLATING (tezroq)
> ```
> ## 💥 **AGAR NORMALLASHTIRMASA** *(`paraphrase-multilingual`, norma **5.86**)*:
> ```
> skalyar ≠ kosinus   →  💥 MAGNITUDA natijaga ARALASHADI
> ```
> ## ⚠️ **VA MAGNITUDA NIMAGA BOG'LIQLIGI — OLDINDAN AYTIB BO'LMAYDI** *(quyida o'lchaymiz)*. Aynan **shuning uchun** kosinus **xavfsizroq**.

### 💥 Bu — haqiqiy xato manbai

```python
qisqa = model.encode("Python")
uzun  = model.encode("Python " * 50)
savol = model.encode("programming language")

print(f"qisqa |v|={np.linalg.norm(qisqa):.2f}  skalyar={np.dot(qisqa, savol):.4f}")
print(f"uzun  |v|={np.linalg.norm(uzun):.2f}  skalyar={np.dot(uzun, savol):.4f}")
print(f"kosinus: qisqa={kosinus(qisqa,savol):.4f}  uzun={kosinus(uzun,savol):.4f}")
```

```
qisqa |v|=5.84  skalyar=16.8628
uzun  |v|=6.98  skalyar= 8.0413
kosinus: qisqa=0.5127  uzun=0.2045
```

> ## ⚠️⚠️ **VA BU HAM KUTILGANDEK EMAS — HALOL AYTAMIZ.**
>
> ## 🔑 **MEN "UZUN MATN YUQORI BALL OLADI" DEB KUTGAN EDIM. HAQIQATDA — TESKARI:**
> ```
> uzun matn:  |v| 1.2× katta  (5.84 → 6.98)
>             skalyar 2× KICHIK (16.86 → 8.04)
>             kosinus 2.5× KICHIK (0.5127 → 0.2045)
> ```
>
> ## 💡 **SABAB:** `"Python " * 50` — bu **takror**, uzun **ma'noli matn emas**. Model takrorni **suyultirilgan signal** deb qabul qiladi: vektor **boshqa yo'nalishga** buriladi.
>
> ## 🏆 **XULOSA:** magnituda **matn uzunligiga to'g'ridan-to'g'ri proporsional emas**. Lekin **skalyar baribir magnitudaga bog'liq** — shuning uchun:
>
> ## ⭐ **HAR DOIM `hnsw:space="cosine"` QO'YING** yoki **vektorlarni o'zingiz normallashtiring**. Shunda **hech qanday kutilmagan holat bo'lmaydi**.

---

## 5. ⭐ Chroma / Pinecone da metrika

```python
# Chroma
coll = client.create_collection("kurslar",
                                metadata={"hnsw:space": "cosine"})
#                                                       ↑ "l2" · "cosine" · "ip"

# Pinecone
pc.create_index(name="my-index", dimension=384,
                metric="cosine",                # ⭐ "cosine" · "euclidean" · "dotproduct"
                spec=ServerlessSpec(cloud="aws", region="us-east-1"))
```

> ## 💥💥 **METRIKANI KEYIN O'ZGARTIRIB BO'LMAYDI** — indeksni **qayta yaratish** kerak *(va hammasini qayta yuklash)*.
>
> ## ⚠️ **VA CHROMA'DA STANDART — `l2`** *(42-modul, 14-darsda ko'rgan edik)*:
> ```
> hnsw:space="l2"      →  MASOFA (kichik = yaxshi) · ballar 12–15
> hnsw:space="cosine"  →  ⭐ MASOFA (0 = aynan bir xil, 2 = teskari)
> ```
> ## 🔑 **IKKALASIDA HAM — KICHIK BALL YAXSHI.** Chunki bu **masofa**, o'xshashlik **emas**.
>
> ## ✅ **O'XSHASHLIKKA O'TKAZISH:** `oxshashlik = 1 − kosinus_masofa`.

---

## 6. 🇺🇿 Amaliy misol — bank mahsulotlari

```python
from sentence_transformers import SentenceTransformer
import numpy as np, pandas as pd

m = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

MAHSULOTLAR = {
    "Iste'mol krediti": "Iste'mol krediti yillik 24% dan, 24 oygacha",
    "Ipoteka": "Ipoteka krediti yillik 18% dan, 20 yilgacha, uy sotib olish",
    "Avtokredit": "Avtomobil krediti yillik 21% dan, 5 yilgacha",
    "Muddatli depozit": "Muddatli depozit yillik 18-22% foiz keltiradi",
    "Debet karta": "Debet karta 3 kunda tayyor, yillik 50 000 so'm",
}

SOROV = "uy sotib olish uchun pul kerak"

E = m.encode(list(MAHSULOTLAR.values()))
q = m.encode(SOROV)

print(f"vektor normalari: {np.linalg.norm(E, axis=1).round(2)}")
print(f"so'rov normasi  : {np.linalg.norm(q):.2f}\n")

nomlar = list(MAHSULOTLAR)
r = []
for i, nom in enumerate(nomlar):
    r.append({"mahsulot": nom,
              "skalyar": round(float(np.dot(E[i], q)), 4),
              "kosinus": round(float(np.dot(E[i], q)
                                     / (np.linalg.norm(E[i])
                                        * np.linalg.norm(q))), 4),
              "evklid": round(float(np.linalg.norm(E[i] - q)), 4)})
d = pd.DataFrame(r)
print(d.to_string(index=False))

print(f"\n🏆 skalyar bo'yicha: {d.loc[d.skalyar.idxmax(), 'mahsulot']}")
print(f"🏆 kosinus bo'yicha: {d.loc[d.kosinus.idxmax(), 'mahsulot']}")
print(f"🏆 evklid bo'yicha : {d.loc[d.evklid.idxmin(), 'mahsulot']}")
```

**Haqiqiy natija — VA U KUTILGANDEK EMAS:**

```
normalar: [3.16 3.7  3.94 2.55 2.62]  so'rov normasi: 2.22

        mahsulot  skalyar  kosinus  evklid
Iste'mol krediti   2.3132   0.3297  3.2098
         Ipoteka   0.8432   0.1029  4.1095    ← 💥 ENG PAST!
      Avtokredit   1.5505   0.1776  4.1621
Muddatli depozit   2.2337   0.3952  2.6356
     Debet karta   3.4072   0.5872  2.2249    ← 💥 ENG YUQORI

skalyar: Debet karta
kosinus: Debet karta
evklid : Debet karta
```

> ## 💥💥💥 **UCHALA METRIKA HAM NOTO'G'RI JAVOB BERDI.**
>
> ## 🔑 **TO'G'RI JAVOB — `Ipoteka`** *(tavsifda aynan "uy sotib olish" bor)*. Model esa **`Debet karta`** ni tanladi va `Ipoteka` ga **eng past ball** *(0.1029)* berdi.
>
> ## ⚠️ **SABAB — METRIKADA EMAS, MODELDA:**
> ```
> paraphrase-multilingual-MiniLM-L12-v2 o'zbekchani QISMAN tushunadi
> "uy sotib olish uchun pul kerak" iborasini u TO'G'RI kodlay olmadi
> ```
>
> ## 🏆🏆 **VA BU — ENG MUHIM AMALIY DARS:**
> ## **METRIKA TANLOVI — EMBEDDING SIFATIDAN KEYIN KELADI.** Model ma'noni tushunmasa, **hech qanday metrika yordam bermaydi**.
>
> ## ✅ **NIMA QILISH KERAK?**
> ```
> ① Tavsiflarni BOYITING — "uy", "kvartira", "ko'chmas mulk" so'zlarini qo'shing
> ② Kalit so'z filtri bilan BIRLASHTIRING (gibrid qidiruv)
> ③ 🇺🇿 o'zbekcha uchun MODELNI SINANG — bu misol aynan shu uchun keltirildi
> ④ Kuchliroq model: multilingual-e5-large · LaBSE
> ```
>
> ## 💡 **BU — 42-MODUL, 14-DARSDAGI "BALL CHEGARASI" MUAMMOSINING BOSHQA YUZI.** Eng yuqori ball **0.5872** — u **ishonchli ko'rinadi**, lekin **noto'g'ri**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** To'rt metrikani ayting.

**M2.** Skalyar va kosinus farqi?

**M3.** Matn uchun qaysi metrika?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Evklid** · **Manhetten** · **Skalyar** · ## ⭐ **Kosinus**.

**M2.** ## Skalyar **MAGNITUDANI** ham hisobga oladi, kosinus — **faqat yo'nalishni**.

**M3.** ## ⭐ **Kosinus** *(yoki normallashgan vektorlarda — skalyar, u tezroq)*.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Kursning hayvonlarini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd

HAYVONLAR = {"Dog": [4., 0., 1.], "Cat": [4., 0., 1.],
             "Chicken": [2., 2., 1.], "Mantis": [6., 2., 3.],
             "Elephant": [4., 0., 1.]}
SOROV = [4., 0., 1.]

q = []
for nom, v in HAYVONLAR.items():
    q.append({"hayvon": nom, "vektor": str(v),
              "|v|": round(float(np.linalg.norm(v)), 4),
              "evklid": round(evklid(SOROV, v), 4),
              "manhetten": round(manhetten(SOROV, v), 4),
              "skalyar": round(skalyar(SOROV, v), 4),
              "kosinus": round(kosinus(SOROV, v), 4)})
d = pd.DataFrame(q)
print(d.to_string(index=False))

print("\n── har metrika bo'yicha eng yaqin 3 ta ──")
for m, katta_yaxshi in [("evklid", False), ("manhetten", False),
                        ("skalyar", True), ("kosinus", True)]:
    top = d.sort_values(m, ascending=not katta_yaxshi).head(3).hayvon.tolist()
    print(f"  {m:10s} → {top}")
```

```
skalyar    → ['Mantis', 'Dog', 'Cat']     ← 💥 Mantis BIRINCHI
kosinus    → ['Dog', 'Cat', 'Elephant']   ✅
```

## 💥 **SKALYAR MAGNITUDAGA ALDANADI.** `Mantis` **eng uzun** vektor *(|v| = 7.0)*.

</details>

**M5.** ⭐ Magnituda ta'sirini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
A = np.array([1., 1.])
VARIANTLAR = {"B (10× uzun, bir yo'nalish)": np.array([10., 10.]),
              "D (0.1× kalta, bir yo'nalish)": np.array([0.1, 0.1]),
              "C (45° burchak)": np.array([1., 0.]),
              "E (teskari)": np.array([-1., -1.])}

for nom, v in VARIANTLAR.items():
    print(f"  {nom:32s} |v|={np.linalg.norm(v):6.2f}  "
          f"skalyar={np.dot(A,v):7.2f}  kosinus={kosinus(A,v):+.4f}")
```

```
  B (10× uzun, bir yo'nalish)      |v|= 14.14  skalyar=  20.00  kosinus=+1.0000
  D (0.1× kalta, bir yo'nalish)    |v|=  0.14  skalyar=   0.20  kosinus=+1.0000
  C (45° burchak)                  |v|=  1.00  skalyar=   1.00  kosinus=+0.7071
  E (teskari)                      |v|=  1.41  skalyar=  -2.00  kosinus=-1.0000
```

*(o'lchandi)*

## 🏆 **KOSINUS: B va D — BIR XIL (1.0000).** ## 💥 **SKALYAR: B, D dan 100× YUQORI.**

## 🔑 **TESKARI YO'NALISHDA KOSINUS MANFIY** *(−1.0)* — bu **muhim signal**.

</details>

**M6.** ⭐⭐ 🇺🇿 Bank mahsulotlarida metrikalarni solishtiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 6-bo'limdagi kodni ishga tushiring va qo'shing:

```python
# ⭐ normallashgandan KEYIN
En = E / np.linalg.norm(E, axis=1, keepdims=True)
qn = q / np.linalg.norm(q)

print("\n── normallashgandan KEYIN ──")
for i, nom in enumerate(nomlar):
    print(f"  {nom:20s} skalyar={np.dot(En[i], qn):+.4f}  "
          f"(kosinus bilan TENG)")
```

## 🏆 **NORMALLASHTIRGANDAN KEYIN — SKALYAR VA KOSINUS AYNAN TENG.**

## 💡 **SHUNING UCHUN: BIR MARTA NORMALLASHTIRING, KEYIN SKALYAR ISHLATING** — **tezroq**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Metrika tanlovchi vositasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd


class MetrikaTanlovchi:
    """Sinov juftliklari asosida ENG MOS metrikani tanlaydi."""

    METRIKALAR = {
        "evklid":    (lambda a, b: float(np.linalg.norm(a - b)), False),
        "manhetten": (lambda a, b: float(np.sum(np.abs(a - b))), False),
        "skalyar":   (lambda a, b: float(np.dot(a, b)), True),
        "kosinus":   (lambda a, b: float(np.dot(a, b)
                                         / (np.linalg.norm(a)
                                            * np.linalg.norm(b))), True),
    }

    def __init__(self, model):
        self.model = model
        self.normallashgan = None

    def norma_tekshir(self):
        v = self.model.encode("test")
        n = float(np.linalg.norm(v))
        self.normallashgan = abs(n - 1.0) < 0.01
        print(f"📏 model normasi: {n:.4f} → "
              f"{'✅ normallashgan' if self.normallashgan else '💥 NORMALLASHMAGAN'}")
        if not self.normallashgan:
            print("   ⚠️ skalyar ≠ kosinus. Uzun matnlar yuqori ball oladi.")
        return self.normallashgan

    def bahola(self, sinovlar):
        """sinovlar = [(savol, to'g'ri_javob, [nomos_javoblar]), ...]"""
        self.norma_tekshir()
        q = []
        for nom, (f, katta_yaxshi) in self.METRIKALAR.items():
            togri, farqlar = 0, []
            for savol, mos, nomoslar in sinovlar:
                qv = self.model.encode(savol)
                mos_b = f(self.model.encode(mos), qv)
                nomos_b = [f(self.model.encode(x), qv) for x in nomoslar]
                eng_nomos = max(nomos_b) if katta_yaxshi else min(nomos_b)
                yutdi = (mos_b > eng_nomos) if katta_yaxshi \
                    else (mos_b < eng_nomos)
                togri += int(yutdi)
                farqlar.append(abs(mos_b - eng_nomos))
            q.append({"metrika": nom,
                      "aniqlik": round(togri / len(sinovlar), 3),
                      "o'rt_farq": round(float(np.mean(farqlar)), 4)})
        d = pd.DataFrame(q).sort_values(["aniqlik", "o'rt_farq"],
                                        ascending=[False, False])
        print()
        print(d.to_string(index=False))

        eng = d.iloc[0]
        ajratish = eng["o'rt_farq"]
        print(f"\n🏆 TAVSIYA: {eng.metrika} "
              f"(aniqlik {eng.aniqlik}, ajratish {ajratish})")

        # ── qo'shimcha tekshiruv: uzunlik ta'siri ──
        print("\n── 💥 UZUNLIK TA'SIRI ──")
        qisqa = self.model.encode("Python")
        uzun = self.model.encode("Python " * 50)
        sv = self.model.encode("programming language")
        print(f"  qisqa matn |v| = {np.linalg.norm(qisqa):.2f} · "
              f"skalyar = {np.dot(qisqa, sv):.4f}")
        print(f"  uzun  matn |v| = {np.linalg.norm(uzun):.2f} · "
              f"skalyar = {np.dot(uzun, sv):.4f}")
        if not self.normallashgan:
            print("  💥 UZUN MATN faqat uzunligi uchun yuqori ball oldi")
            print("  ✅ kosinus bu muammoni HAL QILADI")
        return d


SINOVLAR = [
    ("uy sotib olish uchun pul kerak",
     "Ipoteka krediti yillik 18% dan, 20 yilgacha, uy sotib olish",
     ["Debet karta 3 kunda tayyor", "Muddatli depozit 18-22% foiz"]),
    ("pulimni jamg'armoqchiman",
     "Muddatli depozit yillik 18-22% foiz keltiradi",
     ["Iste'mol krediti yillik 24% dan", "Avtomobil krediti yillik 21%"]),
    ("avtomobil olmoqchiman",
     "Avtomobil krediti yillik 21% dan, 5 yilgacha",
     ["Debet karta 3 kunda tayyor", "Muddatli depozit 18-22%"]),
]

from sentence_transformers import SentenceTransformer
mt = MetrikaTanlovchi(
    SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2"))
mt.bahola(SINOVLAR)
```

## 🏆 **UCHTA TEKSHIRUV:**
```
📏 norma           →  skalyar ≡ kosinus mi?
🎯 aniqlik         →  mos javob nomosdan ustunmi?
📐 o'rt_farq       →  ⭐ AJRATISH kuchi (katta = yaxshi)
💥 uzunlik ta'siri →  skalyar uzun matnga aldanadimi?
```

## 💡 **`o'rt_farq` — ENG MUHIM KO'RSATKICH.** Ikki metrika bir xil aniqlik bersa, **ajratishi kattarog'i** yaxshiroq: chegara qo'yish **osonroq**.

</details>

---

## 📌 Xulosa

```
kosinus(a, b) = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

```
🔬 O'LCHANGAN (kursning hayvonlari):
   skalyar    → ['Mantis', 'Dog', 'Cat']      💥 Mantis BIRINCHI
   kosinus    → ['Dog', 'Cat', 'Elephant']    ✅
   evklid     → ['Dog', 'Cat', 'Elephant']    ✅

   Mantis vs Chicken:
     evklid  → Chicken yaqinroq
     skalyar → Mantis yaqinroq      💥 TESKARI natija
```

> ## 🏆🏆 **METRIKA TANLOVI — JAVOBNI O'ZGARTIRADI.** Bu **texnik detal emas**, bu **mahsulot qarori**.
>
> ## ⭐ **MATN UCHUN — DOIM KOSINUS.** Model normallashtirsa — **skalyar** *(tezroq, aynan teng)*.
>
> ## 💥 **METRIKANI KEYIN O'ZGARTIRIB BO'LMAYDI** — indeksni **qayta yaratish** kerak.

---

⬅️ [1-dars. Vektor fazosi](01-Introduction-to-Vector-Space.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Embedding jarayoni](03-Vector-Embeddings-Walkthrough.md)
