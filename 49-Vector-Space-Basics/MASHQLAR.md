# 📝 49-modul mashqlari

> **18 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ.**

## ⚙️ Tayyorgarlik

```bash
pip install sentence-transformers numpy pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")           # 🇬🇧 EN, norma 1.0
# model_uz = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")


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

---

# 🟢 OSON *(1–7)*

**M1.** Vektor fazosining ikki asosiy amali?

**M2.** To'rt metrikani ayting.

**M3.** Skalyar va kosinus farqi?

**M4.** Matn uchun qaysi metrika?

**M5.** `max_seq_length` nima?

**M6.** Metrikani keyin o'zgartirish mumkinmi?

**M7.** "O'lchamlar la'nati" nima?

<details>
<summary>✅ Javoblar M1–M7</summary>

**M1.** ## **Qo'shish** va **songa ko'paytirish**.

**M2.** ## **Evklid** · **Manhetten** · **Skalyar** · ## ⭐ **Kosinus**.

**M3.** ## Skalyar **magnitudani** ham hisobga oladi, kosinus — **faqat yo'nalishni**.

**M4.** ## ⭐ **Kosinus** *(normallashgan vektorlarda skalyar ≡ kosinus, tezroq)*.

**M5.** ## Model **ko'radigan maksimal token** — `all-MiniLM-L6-v2` da **256**.

**M6.** ## ❌ **Yo'q** — indeksni **qayta yaratish** kerak.

**M7.** ## O'lcham oshganda **tasodifiy vektorlar orasidagi masofalar tenglashadi**.

</details>

---

# 🟡 O'RTA *(8–14)*

**M8.** ⭐ Galereya misolini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
RASMLAR = {
    "Mona Lisa": "Renaissance portrait of a woman by Leonardo da Vinci, "
                 "sfumato technique, mysterious smile",
    "Lady with Ermine": "Renaissance portrait of a woman by Leonardo da "
                        "Vinci, sfumato technique, holding an animal",
    "Girl w Pearl": "Dutch Golden Age portrait of a girl by Johannes "
                    "Vermeer, tronie, pearl earring",
    "Starry Night": "Post-impressionist landscape painting of a night sky "
                    "by Vincent van Gogh, swirling brushstrokes",
    "Soup Cans": "Pop art painting of soup cans by Andy Warhol, "
                 "commercial silkscreen",
}
n = list(RASMLAR)
E = model.encode(list(RASMLAR.values()))
M = E @ E.T
print(pd.DataFrame(M.round(3), index=n, columns=n).to_string())

M2 = M.copy()
np.fill_diagonal(M2, np.nan)
i, j = np.unravel_index(np.nanargmax(M2), M2.shape)
print(f"\n🏆 ENG O'XSHASH: {n[i]} ↔ {n[j]}  ({M2[i,j]:.4f})")
i, j = np.unravel_index(np.nanargmin(M2), M2.shape)
print(f"💥 ENG UZOQ    : {n[i]} ↔ {n[j]}  ({M2[i,j]:.4f})")
```

```
🏆 ENG O'XSHASH: Mona Lisa ↔ Lady with Ermine  (0.8331)
💥 ENG UZOQ    : Mona Lisa ↔ Soup Cans          (0.3251)
```

</details>

**M9.** ⭐⭐ Kursning hayvonlarini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
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

for m, katta in [("evklid", False), ("manhetten", False),
                 ("skalyar", True), ("kosinus", True)]:
    print(f"  {m:10s} → "
          f"{d.sort_values(m, ascending=not katta).head(3).hayvon.tolist()}")
```

```
skalyar    → ['Mantis', 'Dog', 'Cat']     💥 Mantis BIRINCHI
kosinus    → ['Dog', 'Cat', 'Elephant']   ✅
```

</details>

**M10.** ⭐ Magnituda ta'sirini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
A = np.array([1., 1.])
for nom, v in {"B (10× uzun)": np.array([10., 10.]),
               "D (0.1× kalta)": np.array([0.1, 0.1]),
               "C (45°)": np.array([1., 0.]),
               "E (teskari)": np.array([-1., -1.])}.items():
    print(f"  {nom:18s} |v|={np.linalg.norm(v):6.2f}  "
          f"skalyar={np.dot(A,v):7.2f}  kosinus={kosinus(A,v):+.4f}")
```

```
  B (10× uzun)       |v|= 14.14  skalyar=  20.00  kosinus=+1.0000
  D (0.1× kalta)     |v|=  0.14  skalyar=   0.20  kosinus=+1.0000
  C (45°)            |v|=  1.00  skalyar=   1.00  kosinus=+0.7071
  E (teskari)        |v|=  1.41  skalyar=  -2.00  kosinus=-1.0000
```

## 🏆 **KOSINUS: B va D BIR XIL. SKALYAR: B, D dan 100× yuqori.**

</details>

**M11.** ⭐⭐ O'lchamlar la'natini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
rng = np.random.default_rng(365)
q = []
for o in [2, 5, 10, 50, 100, 384, 1536]:
    V = rng.normal(size=(500, o))
    V /= np.linalg.norm(V, axis=1, keepdims=True)
    M = V @ V.T
    np.fill_diagonal(M, np.nan)
    q.append({"o'lcham": o, "o'rtacha": round(float(np.nanmean(M)), 4),
              "std": round(float(np.nanstd(M)), 4),
              "maks-min": round(float(np.nanmax(M) - np.nanmin(M)), 4)})
print(pd.DataFrame(q).to_string(index=False))
```

```
    2 o'lcham: std 0.7068 · maks-min 2.0000
 1536 o'lcham: std 0.0256 · maks-min 0.2352     💥 28× kamaydi
```

</details>

**M12.** ⭐⭐ "lead" omonimini sinang.

<details>
<summary>✅ Yechim</summary>

```python
J = ["He plays the lead guitar in a band.",
     "The lead singer performed a beautiful solo.",
     "They found high levels of lead in the drinking water.",
     "Lead poisoning is a serious health concern."]
E = model.encode(J)
M = E @ E.T
print(pd.DataFrame(M.round(3), index=[1,2,3,4],
                   columns=[1,2,3,4]).to_string())
print(f"\n♫  musiqa  ①↔②  {M[0,1]:.4f}")
print(f"☠️ modda   ③↔④  {M[2,3]:.4f}")
print(f"💥 aralash ①↔③  {M[0,2]:.4f}")
```

```
♫  musiqa  ①↔②  0.4321
☠️ modda   ③↔④  0.6482
💥 aralash ①↔③  0.1256     ⭐ 5× PAST — model KONTEKSTNI ajratdi
```

</details>

**M13.** ⭐⭐ Inkor muammosini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
JUFTLAR = [("This course is good.", "This course is not good."),
           ("I like Python.", "I do not like Python."),
           ("The data is clean.", "The data is dirty."),
           ("Python is easy.", "Python is difficult.")]
for a, b in JUFTLAR:
    va, vb = model.encode([a, b])
    s = float(va @ vb)
    belgi = "💥" if s > 0.7 else ("⚠️" if s > 0.5 else "✅")
    print(f"  {belgi} {s:.4f}  {a[:24]:24s} ↔ {b[:24]}")
```

```
💥 0.7931  This course is good.  ↔ This course is not good.
💥 0.8510  I like Python.        ↔ I do not like Python.
💥 0.8876  The data is clean.    ↔ The data is dirty.
💥 0.8548  Python is easy.       ↔ Python is difficult.
```

## 💥 **TO'RTALASI HAM 0.79–0.89** — omonimda esa atigi **0.1256**.

</details>

**M14.** ⭐⭐ Kontekst oynasi chegarasi.

<details>
<summary>✅ Yechim</summary>

```python
print("max_seq_length:", model.max_seq_length)

q = "Machine learning in Python"
vq = model.encode(q)
for n in [0, 50, 200, 500, 2000]:
    matn = q + " " + ("Completely unrelated cooking recipe text. " * n)
    print(f"  {n:5d} takror · ~{len(matn)//4:6d} token · "
          f"o'xshashlik {float(model.encode(matn) @ vq):.4f}")
```

```
    0 takror · ~     6 token · o'xshashlik 1.0000
   50 takror · ~   531 token · o'xshashlik 0.4959
 2000 takror · ~ 21006 token · o'xshashlik 0.4959    💥 O'ZGARMADI
```

## 💥 **20 750 TOKEN JIMGINA TASHLANDI.**

</details>

---

# 🔴 QIYIN *(15–18)*

**M15.** ⭐⭐⭐ Metrika tanlovchi.

<details>
<summary>✅ Yechim</summary>

```python
class MetrikaTanlovchi:
    METRIKALAR = {
        "evklid": (lambda a, b: float(np.linalg.norm(a - b)), False),
        "manhetten": (lambda a, b: float(np.sum(np.abs(a - b))), False),
        "skalyar": (lambda a, b: float(np.dot(a, b)), True),
        "kosinus": (lambda a, b: float(np.dot(a, b)
                                       / (np.linalg.norm(a)
                                          * np.linalg.norm(b))), True),
    }

    def __init__(self, model):
        self.model = model

    def norma_tekshir(self):
        n = float(np.linalg.norm(self.model.encode("test")))
        ok = abs(n - 1.0) < 0.01
        print(f"📏 norma {n:.4f} → "
              f"{'✅ normallashgan' if ok else '💥 NORMALLASHMAGAN'}")
        return ok

    def bahola(self, sinovlar):
        self.norma_tekshir()
        q = []
        for nom, (f, katta) in self.METRIKALAR.items():
            togri, farqlar = 0, []
            for savol, mos, nomoslar in sinovlar:
                qv = self.model.encode(savol)
                mos_b = f(self.model.encode(mos), qv)
                nomos_b = [f(self.model.encode(x), qv) for x in nomoslar]
                eng = max(nomos_b) if katta else min(nomos_b)
                togri += int((mos_b > eng) if katta else (mos_b < eng))
                farqlar.append(abs(mos_b - eng))
            q.append({"metrika": nom,
                      "aniqlik": round(togri / len(sinovlar), 3),
                      "ajratish": round(float(np.mean(farqlar)), 4)})
        d = pd.DataFrame(q).sort_values(["aniqlik", "ajratish"],
                                        ascending=[False, False])
        print()
        print(d.to_string(index=False))
        eng = d.iloc[0]
        print(f"\n🏆 TAVSIYA: {eng.metrika} "
              f"(aniqlik {eng.aniqlik}, ajratish {eng.ajratish})")
        if d.aniqlik.max() < 0.8:
            print("💥 HECH BIR metrika 80% ga yetmadi — MUAMMO MODELDA")
        return d


SINOVLAR = [
    ("regression analysis",
     "Linear Regression with sklearn in Python",
     ["SQL JOINs and subqueries", "Tableau dashboard design"]),
    ("neural networks",
     "Deep Learning with TensorFlow and neural network layers",
     ["Excel pivot tables", "SQL window functions"]),
    ("database queries",
     "SQL SELECT statements and JOINs for data analysis",
     ["Deep learning backpropagation", "Tableau color palettes"]),
]
MetrikaTanlovchi(model).bahola(SINOVLAR)
```

## 🏆 **`ajratish` — ENG MUHIM.** Ikki metrika bir xil aniqlik bersa, **ajratishi kattarog'i** yaxshiroq.

## 💥 **"HECH BIR metrika 80% ga yetmadi"** — bu **model muammosi**, metrika emas.

</details>

**M16.** ⭐⭐⭐ Embedding model tanlovchi.

<details>
<summary>✅ Yechim</summary>

```python
import time

class ModelTanlovchi:
    def __init__(self, sinovlar):
        self.sinovlar = sinovlar
        self.natijalar = []

    def bahola(self, nom):
        try:
            t0 = time.perf_counter()
            m = SentenceTransformer(nom)
            yuk = time.perf_counter() - t0
        except Exception as e:
            print(f"  ❌ {nom[:40]}: {type(e).__name__}")
            return
        v = m.encode("test")
        norma = float(np.linalg.norm(v))

        mos_b, nomos_b, togri = [], [], 0
        t0 = time.perf_counter()
        for savol, mos, nomoslar in self.sinovlar:
            E = m.encode([savol, mos] + list(nomoslar))
            E = E / np.linalg.norm(E, axis=1, keepdims=True)
            q = E[0]
            mb = float(E[1] @ q)
            nb = [float(x @ q) for x in E[2:]]
            mos_b.append(mb); nomos_b += nb
            togri += int(mb > max(nb))
        s = time.perf_counter() - t0

        r = {"model": nom.split("/")[-1][:34], "o'lcham": len(v),
             "maks_tok": getattr(m, "max_seq_length", "?"),
             "norma": round(norma, 3),
             "norm": "✅" if abs(norma - 1) < 0.01 else "💥",
             "aniqlik": round(togri / len(self.sinovlar), 3),
             "mos": round(float(np.mean(mos_b)), 4),
             "nomos": round(float(np.mean(nomos_b)), 4),
             "yuk_s": round(yuk, 1), "sinov_s": round(s, 2)}
        r["ajratish"] = round(r["mos"] - r["nomos"], 4)
        self.natijalar.append(r)

    def hisobot(self, modellar):
        for m in modellar:
            print(f"⏳ {m[:44]} ...")
            self.bahola(m)
        d = pd.DataFrame(self.natijalar)
        print()
        print(d.to_string(index=False))
        eng = d.sort_values(["aniqlik", "ajratish"],
                            ascending=[False, False]).iloc[0]
        print(f"\n🏆 TAVSIYA: {eng.model} "
              f"(aniqlik {eng.aniqlik} · ajratish {eng.ajratish})")
        for _, r in d.iterrows():
            if r.aniqlik < 0.7:
                print(f"  💥 {r.model}: aniqlik {r.aniqlik} — YARAMAYDI")
            if r.ajratish < 0.1:
                print(f"  ⚠️ {r.model}: ajratish {r.ajratish} — "
                      f"chegara qo'yish QIYIN")
        return d


SINOVLAR_UZ = [
    ("uy sotib olish uchun kredit",
     "Ipoteka krediti yillik 18% dan, 20 yilgacha, uy sotib olish uchun",
     ["Debet karta 3 kunda tayyorlanadi",
      "Muddatli depozit yillik 18-22% foiz"]),
    ("pulimni jamg'armoqchiman",
     "Muddatli depozit yillik 18-22% foiz keltiradi",
     ["Iste'mol krediti yillik 24% dan", "Avtomobil krediti 5 yilgacha"]),
    ("plastik karta ochmoqchiman",
     "Debet karta 3 ish kunida tayyorlanadi, UzCard va Humo",
     ["Ipoteka krediti 20 yilgacha", "Muddatli depozit foizi 18-22%"]),
]
ModelTanlovchi(SINOVLAR_UZ).hisobot([
    "all-MiniLM-L6-v2",
    "paraphrase-multilingual-MiniLM-L12-v2",
])
```

## 🇺🇿 **O'Z MA'LUMOTINGIZDAN 10–20 TA SINOV JUFTLIGI TAYYORLANG** — umumiy benchmarklar **sizning vazifangizni ko'rsatmaydi**.

</details>

**M17.** ⭐⭐⭐ Haqiqiy va tasodifiy embedding tarqalishi.

<details>
<summary>✅ Yechim</summary>

```python
b = pd.read_csv("../51-Semantic-Search-Case-Study/"
                "course_section_descriptions.csv", encoding="cp1252")
matnlar = b.section_name.head(300).tolist()

E_real = model.encode(matnlar, show_progress_bar=False)
M_real = E_real @ E_real.T
np.fill_diagonal(M_real, np.nan)

rng = np.random.default_rng(365)
E_rand = rng.normal(size=E_real.shape)
E_rand /= np.linalg.norm(E_rand, axis=1, keepdims=True)
M_rand = E_rand @ E_rand.T
np.fill_diagonal(M_rand, np.nan)

for nom, M in [("HAQIQIY", M_real), ("TASODIFIY", M_rand)]:
    print(f"  {nom:10s} o'rt {np.nanmean(M):+.4f} · "
          f"std {np.nanstd(M):.4f} · maks {np.nanmax(M):.4f} · "
          f"min {np.nanmin(M):.4f}")

nisbat = np.nanstd(M_real) / np.nanstd(M_rand)
print(f"\n📐 std nisbati: {nisbat:.2f}×")
print("✅ > 1.5 → model ma'lumotni TUSHUNADI" if nisbat > 1.5
      else "💥 ≈ 1.0 → model YARAMAYDI")
```

```
  HAQIQIY    o'rt +0.1441 · std 0.1191 · maks 1.0000 · min -0.1552
  TASODIFIY  o'rt -0.0001 · std 0.0512 · maks 0.1952 · min -0.2437
📐 std nisbati: 2.33×  ✅
```

## 🏆 **BU — MODELNI TEKSHIRISHNING ENG TEZ USULI.** Sinov juftliklari **kerak emas**.

</details>

**M18.** ⭐⭐⭐ 🇺🇿 Bank mahsulotlarida uchala metrikani sinang.

<details>
<summary>✅ Yechim</summary>

```python
m_uz = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

MAHSULOTLAR = {
    "Iste'mol krediti": "Iste'mol krediti yillik 24% dan, 24 oygacha",
    "Ipoteka": "Ipoteka krediti yillik 18% dan, 20 yilgacha, uy sotib olish",
    "Avtokredit": "Avtomobil krediti yillik 21% dan, 5 yilgacha",
    "Muddatli depozit": "Muddatli depozit yillik 18-22% foiz keltiradi",
    "Debet karta": "Debet karta 3 kunda tayyor, yillik 50 000 so'm",
}
SOROVLAR = {"uy sotib olish uchun pul kerak": "Ipoteka",
            "avtomobil olmoqchiman": "Avtokredit",
            "pulimni jamg'armoqchiman": "Muddatli depozit"}

nomlar = list(MAHSULOTLAR)
E = m_uz.encode(list(MAHSULOTLAR.values()))

for savol, kutilgan in SOROVLAR.items():
    q = m_uz.encode(savol)
    r = []
    for i, nom in enumerate(nomlar):
        r.append({"mahsulot": nom,
                  "skalyar": round(float(np.dot(E[i], q)), 4),
                  "kosinus": round(kosinus(E[i], q), 4),
                  "evklid": round(float(np.linalg.norm(E[i] - q)), 4)})
    d = pd.DataFrame(r)
    tanlov = {"skalyar": d.loc[d.skalyar.idxmax(), "mahsulot"],
              "kosinus": d.loc[d.kosinus.idxmax(), "mahsulot"],
              "evklid": d.loc[d.evklid.idxmin(), "mahsulot"]}
    print(f"\n🔍 '{savol}'  (kutilgan: {kutilgan})")
    for m, t in tanlov.items():
        print(f"   {'✅' if t == kutilgan else '💥'} {m:8s} → {t}")
```

## 💥 **BIZNING SINOVIMIZDA UCHALA METRIKA HAM "Ipoteka" NI TOPA OLMADI** *(o'lchandi)*.

## 🏆 **BU — MODELNING KAMCHILIGI, METRIKANING EMAS.** 🇺🇿 O'zbekcha loyihada **modelni sinash — birinchi qadam**.

</details>

---

## 📌 Modulning eng muhim o'lchovlari

```
Da Vinchi rasmlari 0.833 · Mona Lisa ↔ Soup Cans 0.325
O'lchamlar la'nati: std 0.7068 (2 o'lch.) → 0.0256 (1536) — 28× kamaydi
Haqiqiy vs tasodifiy embedding: std 2.33× kengroq  ✅

💥 skalyar → ['Mantis', 'Dog', 'Cat'] · kosinus → ['Dog', 'Cat', 'Elephant']
💥 inkor: "good" ↔ "not good" = 0.79–0.89 (omonim esa 0.1256)
💥 kontekst oynasi 256 token — 21 000 token JIMGINA tashlandi
🇺🇿 "uy sotib olish" → Ipoteka eng PAST ball oldi (model xatosi)
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
