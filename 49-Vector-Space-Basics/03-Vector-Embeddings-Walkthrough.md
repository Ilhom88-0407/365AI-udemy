# 3-dars. Embedding jarayoni ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kompyuterlar so'zlar bilan yaxshi ishlamaydi, lekin raqamlar bilan a'lo darajada ishlaydi."**

---

## 1. Kursning "lead" misoli

```
① "He plays the lead guitar in a band."         → musiqiy kontekst
② "They found high levels of lead in the water." → modda konteksti
```

> ## 🔑 **BIR XIL SO'Z — IKKI XIL MA'NO.** Kurs uni **ikki o'lchamli** soddalashtirilgan misolda tushuntiradi:
> ```
> o'lcham 1: musiqiy kontekstga aloqadorlik
> o'lcham 2: modda kontekstiga aloqadorlik
>
> "guitar"  →  [0.95, 0.02]     ⭐ eng musiqiy
> "lead" ①  →  [0.80, 0.10]     musiqiy ma'noda
> "lead" ②  →  [0.05, 0.90]     ⭐ modda ma'noda
> "the"     →  [0.05, 0.05]     ma'nosiz
> ```

---

## 2. 🔬 Buni HAQIQIY model bilan sinaymiz

```python
from sentence_transformers import SentenceTransformer
import numpy as np, pandas as pd

model = SentenceTransformer("all-MiniLM-L6-v2")

JUMLALAR = [
    "He plays the lead guitar in a band.",
    "The lead singer performed a beautiful solo.",
    "They found high levels of lead in the drinking water.",
    "Lead poisoning is a serious health concern.",
]
E = model.encode(JUMLALAR)
M = E @ E.T
q = [f"{i+1}. {j[:44]}" for i, j in enumerate(JUMLALAR)]
print(pd.DataFrame(M.round(3), index=q, columns=range(1, 5)).to_string())
```

**Haqiqiy natija:**

```
       1      2      3      4
1  1.000  0.432  0.126  0.177
2  0.432  1.000  0.132  0.111
3  0.126  0.132  1.000  0.648
4  0.177  0.111  0.648  1.000

♫  musiqa  ①↔②  0.4321
☠️ modda   ③↔④  0.6482
💥 aralash ①↔③  0.1256
```

> ## ✅✅ **KURSNING BUTUN G'OYASI TASDIQLANDI:**
> ```
> ③↔④ = 0.6482  ⭐ ikkalasi ham modda/salomatlik
> ①↔② = 0.4321  ✅ ikkalasi ham musiqa
> ①↔③ = 0.1256  ⭐ BIR XIL SO'Z ("lead"), lekin 5× PAST ball
> ```
>
> ## 🏆 **MODEL `lead` SO'ZINING IKKI MA'NOSINI AJRATDI** — chunki u **butun jumlani** kodlaydi, so'zni **alohida emas**.
>
> ## 💡 **ESKI `word2vec` DA BU IMKONSIZ EDI** — u uchun `lead` **doim bir xil vektor**.

---

## 3. ⭐⭐ So'z embeddingi va JUMLA embeddingi — muhim farq

| | Word2Vec / GloVe *(eski)* | ## ⭐ Sentence Transformers *(bugun)* |
|---|---|---|
| Nima kodlaydi | ## **Har so'zni alohida** | ## **Butun jumlani** |
| Kontekst | ## ❌ **yo'q** — `lead` doim bir xil | ## ✅ **bor** — kontekstga qarab |
| Chiqish | Har so'zga bitta vektor | ## **Bitta** vektor |
| Vektor DB uchun | ⚠️ o'rtachalash kerak | ## ⭐ **to'g'ridan-to'g'ri** |

```python
# ❌ ESKI YO'L (word2vec) — so'zlarni o'rtachalash
jumla_v = np.mean([w2v[so] for so in jumla.split()], axis=0)
# 💥 "it is not good" va "it is good" DEYARLI BIR XIL bo'ladi

# ✅ BUGUNGI YO'L
jumla_v = model.encode(jumla)      # ⭐ kontekstni HISOBGA OLADI
```

### 🔬 Inkorni sinaymiz

```python
JUFTLAR = [
    ("This course is good.", "This course is not good."),
    ("I like Python.", "I do not like Python."),
    ("The data is clean.", "The data is dirty."),
]
for a, b in JUFTLAR:
    va, vb = model.encode([a, b])
    print(f"  {float(va @ vb):.4f}  {a[:26]:26s} ↔ {b[:26]}")
```

**Haqiqiy natija:**

```
💥 0.7931  This course is good.     ↔ This course is not good.
💥 0.8510  I like Python.           ↔ I do not like Python.
💥 0.8876  The data is clean.       ↔ The data is dirty.
💥 0.8548  Python is easy.          ↔ Python is difficult.
```

> ## 💥💥💥 **TO'RTALA JUFTLIK HAM 0.79–0.89 BALL OLDI** — garchi ular **QARAMA-QARSHI ma'noda** bo'lsa ham.
>
> ## 🔑 **TAQQOSLANG:** `lead guitar` ↔ `lead in water` atigi **0.1256** oldi. Ya'ni model **omonimni ajratadi**, lekin **inkorni ajratmaydi**.
>
> ## 🏆 **AMALIY XULOSA — VA U KURSDA YO'Q:**
> ```
> Semantik qidiruv INKORNI TUSHUNMAYDI
> "Python emas" so'rovi "Python" natijalarini qaytaradi
> ```
> ## ✅ **YECHIM:**
> ```
> ① Kalit so'z filtri qo'shing (gibrid qidiruv)
> ② Metadata filtri (course_technology != "python")
> ③ Cross-encoder bilan qayta tartiblash (reranking)
> ```

---

## 4. ⭐ Embedding modelini tanlash

| Model | O'lcham | Til | Tezlik | Qachon |
|---|---:|---|---|---|
| ## `all-MiniLM-L6-v2` | ## **384** | 🇬🇧 EN | ## ⭐ **eng tez** | ## Ingliz tilida — **standart** |
| `all-mpnet-base-v2` | 768 | 🇬🇧 EN | sekinroq | Sifat muhim |
| ## `paraphrase-multilingual-MiniLM-L12-v2` | ## **384** | ## 🌍 **50+ til** | tez | ## 🇺🇿 **o'zbekcha** |
| `multilingual-e5-large` | 1024 | 🌍 100+ | sekin | 🇺🇿 **eng sifatli** |
| `text-embedding-3-small` | 1536 | 🌍 | API | ☁️ OpenAI, **pulli** |

### 🔬 O'lchangan

```
all-MiniLM-L6-v2                       o'lcham 384 · norma 1.0000  ✅ normallashgan
paraphrase-multilingual-MiniLM-L12-v2  o'lcham 384 · norma 5.8556  💥 emas

680 embedding (all-MiniLM-L6-v2, CPU) → 6.0 s  (113/s)
```

> ## 💥💥 **VA ENG MUHIM O'LCHOV — 🇺🇿 O'ZBEKCHA SO'ROVLAR:**
> ```
> all-MiniLM-L6-v2 bilan, 365 kurslari bazasida:
>   "Python dasturlash"                    ball 0.3838
>   "ma'lumotlarni vizualizatsiya qilish"  ball 0.2059
>   "mashinali o'qitish"                   ball 0.2150
> ```
> ## 🔑 **BU BALLAR JUDA PAST.** Inglizcha so'rovlarda **0.65–0.81** edi.
>
> ## 🏆 **XULOSA: 🇺🇿 LOYIHADA `all-MiniLM-L6-v2` ISHLATMANG.**

---

## 5. ⚠️ Kontekst oynasi — kursda aytilmagan cheklov

```python
print("maks tokenlar:", model.max_seq_length)
```

```
maks tokenlar: 256
```

> ## 💥💥 **`all-MiniLM-L6-v2` FAQAT 256 TOKENNI KO'RADI.**
>
> ## 🔑 **UNDAN KEYINGISI — JIMGINA TASHLANADI.**
> ```
> Bizning ma'lumotimizda:
>   birlashgan matn: min 379 · max 4076 · o'rtacha 1255 BELGI
>   ≈ o'rtacha 315 token  →  💥 KO'PI 256 dan OSHADI
> ```
>
> ## 💥 **YA'NI: MATNNING OXIRGI QISMI EMBEDDINGGA UMUMAN KIRMAYDI.**
>
> ## ✅ **UCH YECHIM:**
> ```
> ① Matnni QISQARTIRING — eng muhim qismini oldinga qo'ying
> ② BO'LAKLANG — har bo'lak alohida vektor (42-modul)
> ③ Uzun kontekstli model: multilingual-e5-large (512), bge-m3 (8192)
> ```

### 🔬 Buni tekshiring

```python
import numpy as np

qisqa = "Machine learning in Python"
vq = model.encode(qisqa)

for n in [0, 50, 200, 500, 2000]:
    matn = qisqa + " " + ("Completely unrelated cooking recipe text. " * n)
    ball = float(model.encode(matn) @ vq)
    print(f"  {n:5d} takror · ~{len(matn)//4:6d} token · o'xshashlik {ball:.4f}")
```

**Haqiqiy natija:**

```
    0 takror · ~     6 token · o'xshashlik 1.0000
   50 takror · ~   531 token · o'xshashlik 0.4959
  200 takror · ~  2106 token · o'xshashlik 0.4959
  500 takror · ~  5256 token · o'xshashlik 0.4959
 2000 takror · ~ 21006 token · o'xshashlik 0.4959
```

> ## 💥💥💥 **531 TOKENDAN KEYIN BALL UMUMAN O'ZGARMADI — `0.4959` DA QOTIB QOLDI.**
>
> ## 🔑 **YA'NI: 21 000 TOKENLIK MATN VA 531 TOKENLIK MATN — BIR XIL VEKTOR.**
> ```
> Model faqat DASTLABKI ~256 tokenni ko'rdi
> Qolgan 20 750 token — JIMGINA TASHLANDI
> ```
>
> ## 💥 **HECH QANDAY OGOHLANTIRISH YO'Q.** Bu — **jim ma'lumot yo'qolishi**.
>
> ## 🏆 **SHUNING UCHUN — ENG MUHIM MATNNI OLDINGA QO'YING.**

---

## 6. 🇺🇿 Amaliy: 365 ma'lumotini embedding qilish

```python
import pandas as pd, numpy as np, time
from sentence_transformers import SentenceTransformer

b = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

def tozala(s):
    """⭐ 3848 ta \\r belgisini olib tashlaydi"""
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())

# ⭐ MUHIM QISM OLDINGA — 256 token chegarasi tufayli
b["matn"] = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1)

model = SentenceTransformer("all-MiniLM-L6-v2")
t0 = time.perf_counter()
E = model.encode(b.matn.tolist(), show_progress_bar=False, batch_size=64)
print(f"{len(E)} embedding: {time.perf_counter()-t0:.1f}s · shakl {E.shape}")
print(f"normalar: {np.linalg.norm(E, axis=1)[:3].round(4)}")
```

```
680 embedding: 6.0s · shakl (680, 384)
normalar: [1. 1. 1.]
```

> ## 🏆 **DIQQAT — MATN TARTIBI:**
> ```
> ❌ Kurs:  course_name, course_technology, course_description, section_name, section_description
>          → course_description UZUN, 256 token chegarasini yeydi
>          → 💥 section_description umuman KIRMASLIGI mumkin
>
> ✅ Bizda: section_name, course_name, course_technology, section_description
>          → ⭐ ENG MUHIM ma'lumot OLDINDA
> ```
>
> ## 💡 **BU — KURSDA AYTILMAGAN, LEKIN NATIJAGA KUCHLI TA'SIR QILADIGAN DETAL.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Embedding nima?

**M2.** So'z va jumla embeddingi farqi?

**M3.** `all-MiniLM-L6-v2` kontekst oynasi qancha?

<details>
<summary>✅ Javoblar</summary>

**M1.** Ma'lumotni **zich vektorga** aylantirish — o'xshash narsalar **yaqin** joylashadi.

**M2.** ## So'z embeddingi **kontekstni bilmaydi** *(`lead` doim bir xil)*, jumla embeddingi — ## ⭐ **biladi**.

**M3.** ## **256 token** — undan keyingisi **jimgina tashlanadi**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ "lead" misolini sinang.

<details>
<summary>✅ Yechim</summary>

```python
JUMLALAR = [
    "He plays the lead guitar in a band.",
    "The lead singer performed a beautiful solo.",
    "They found high levels of lead in the drinking water.",
    "Lead poisoning is a serious health concern.",
]
E = model.encode(JUMLALAR)
M = E @ E.T
print(pd.DataFrame(M.round(3),
                   index=[f"{i+1}" for i in range(4)],
                   columns=[f"{i+1}" for i in range(4)]).to_string())

print(f"\n♫  musiqa ①↔②     : {M[0,1]:.4f}")
print(f"☠️ modda   ③↔④     : {M[2,3]:.4f}")
print(f"💥 aralash ①↔③     : {M[0,2]:.4f}")
print("\n🏆 ①↔② va ③↔④ YUQORI, ①↔③ PAST bo'lishi kerak")
```

</details>

**M5.** ⭐ Inkor muammosini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
JUFTLAR = [
    ("This course is good.", "This course is not good."),
    ("I like Python.", "I do not like Python."),
    ("The data is clean.", "The data is dirty."),
    ("Python is easy.", "Python is difficult."),
]
for a, b in JUFTLAR:
    va, vb = model.encode([a, b])
    ball = float(va @ vb)
    belgi = "💥" if ball > 0.7 else ("⚠️" if ball > 0.5 else "✅")
    print(f"  {belgi} {ball:.4f}  {a[:24]:24s} ↔ {b[:24]}")

print("\n⚠️ 0.7+ ball — model INKORNI TUSHUNMADI")
print("🏆 agar bu muhim bo'lsa — kalit so'z filtri qo'shing")
```

</details>

**M6.** ⭐⭐ Kontekst oynasi chegarasini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
print("maks_seq_length:", model.max_seq_length)

qisqa = "Machine learning in Python"
UZUNLIKLAR = [0, 50, 200, 500, 2000]

for n in UZUNLIKLAR:
    matn = qisqa + " " + ("Completely unrelated cooking recipe text. " * n)
    v = model.encode(matn)
    q = model.encode(qisqa)
    ball = float(v @ q)
    tok = len(matn) // 4
    belgi = "💥" if tok > 256 and ball > 0.9 else ""
    print(f"  {n:5d} takror · ~{tok:6d} token · o'xshashlik {ball:.4f}  {belgi}")

print("\n💥 ~256 tokendan keyin BALL O'ZGARMAYDI")
print("   → qo'shimcha matn EMBEDDINGGA UMUMAN KIRMADI")
```

## 🏆 **BU — JIM MA'LUMOT YO'QOLISHI.** Hech qanday ogohlantirish **yo'q**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Embedding model tanlovchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, pandas as pd, time
from sentence_transformers import SentenceTransformer


class ModelTanlovchi:
    """Embedding modellarini SIZNING ma'lumotingizda solishtiradi."""

    def __init__(self, sinovlar, til="uz"):
        """sinovlar = [(savol, mos_matn, [nomos_matnlar]), ...]"""
        self.sinovlar = sinovlar
        self.til = til
        self.natijalar = []

    def bahola(self, model_nomi):
        try:
            t0 = time.perf_counter()
            m = SentenceTransformer(model_nomi)
            yuk = time.perf_counter() - t0
        except Exception as e:
            print(f"  ❌ {model_nomi[:40]}: {type(e).__name__}")
            return None

        v = m.encode("test")
        norma = float(np.linalg.norm(v))
        normallashgan = abs(norma - 1) < 0.01

        mos_ballar, nomos_ballar, togri = [], [], 0
        t0 = time.perf_counter()
        for savol, mos, nomoslar in self.sinovlar:
            E = m.encode([savol, mos] + list(nomoslar))
            E = E / np.linalg.norm(E, axis=1, keepdims=True)   # ⭐ SHART
            q = E[0]
            mos_b = float(E[1] @ q)
            nomos_b = [float(x @ q) for x in E[2:]]
            mos_ballar.append(mos_b)
            nomos_ballar += nomos_b
            togri += int(mos_b > max(nomos_b))
        s = time.perf_counter() - t0

        r = {"model": model_nomi.split("/")[-1][:36],
             "o'lcham": len(v),
             "maks_token": getattr(m, "max_seq_length", "?"),
             "norma": round(norma, 3),
             "normallashgan": "✅" if normallashgan else "💥",
             "aniqlik": round(togri / len(self.sinovlar), 3),
             "mos_o'rt": round(float(np.mean(mos_ballar)), 4),
             "nomos_o'rt": round(float(np.mean(nomos_ballar)), 4),
             "yuklash_s": round(yuk, 1),
             "sinov_s": round(s, 2)}
        r["ajratish"] = round(r["mos_o'rt"] - r["nomos_o'rt"], 4)
        self.natijalar.append(r)
        return r

    def hisobot(self, modellar):
        for m in modellar:
            print(f"⏳ {m[:44]} ...")
            self.bahola(m)
        if not self.natijalar:
            print("hech qanday model yuklanmadi")
            return
        d = pd.DataFrame(self.natijalar)
        print()
        print(d.to_string(index=False))

        eng = d.sort_values(["aniqlik", "ajratish"],
                            ascending=[False, False]).iloc[0]
        olcham = eng["o'lcham"]
        print(f"\n🏆 TAVSIYA: {eng.model}")
        print(f"   aniqlik {eng.aniqlik} · ajratish {eng.ajratish} · "
              f"{olcham} o'lcham · {eng.sinov_s}s")

        # ── ogohlantirishlar ──
        print()
        for _, r in d.iterrows():
            if r.aniqlik < 0.7:
                print(f"  💥 {r.model}: aniqlik {r.aniqlik} — "
                      f"{self.til} tilida YARAMAYDI")
            if r.ajratish < 0.1:
                print(f"  ⚠️ {r.model}: ajratish {r.ajratish} — "
                      f"chegara qo'yish QIYIN")
            if r["normallashgan"] == "💥":
                print(f"  ⚠️ {r.model}: normallashmagan — "
                      f"np.dot ≠ kosinus, normaga BO'LING")
        return d


# 🇺🇿 O'ZBEKCHA sinov to'plami
SINOVLAR_UZ = [
    ("uy sotib olish uchun kredit",
     "Ipoteka krediti yillik 18% dan, 20 yilgacha, uy sotib olish uchun",
     ["Debet karta 3 kunda tayyorlanadi",
      "Muddatli depozit yillik 18-22% foiz keltiradi"]),
    ("pulimni jamg'armoqchiman",
     "Muddatli depozit yillik 18-22% foiz keltiradi, minimal 1 mln so'm",
     ["Iste'mol krediti yillik 24% dan boshlanadi",
      "Avtomobil krediti 5 yilgacha beriladi"]),
    ("plastik karta ochmoqchiman",
     "Debet karta 3 ish kunida tayyorlanadi, UzCard va Humo",
     ["Ipoteka krediti 20 yilgacha",
      "Muddatli depozit foizi 18-22%"]),
]

mt = ModelTanlovchi(SINOVLAR_UZ, til="🇺🇿 o'zbek")
mt.hisobot([
    "all-MiniLM-L6-v2",                                   # 🇬🇧 faqat inglizcha
    "paraphrase-multilingual-MiniLM-L12-v2",              # 🌍 ko'p tilli
])
```

## 🏆 **`ajratish = mos_o'rt − nomos_o'rt` — ENG MUHIM KO'RSATKICH.**
```
ajratish KATTA  →  ⭐ chegara qo'yish OSON, natija ishonchli
ajratish KICHIK →  💥 mos va nomos ballar ARALASH → chegara ishlamaydi
```

## 💡 **VA `aniqlik` YETARLI EMAS.** Model 100% aniq bo'lishi mumkin, lekin ballari **0.61 va 0.60** bo'lsa — bu **omadga bog'liq**.

## 🇺🇿 **O'Z MA'LUMOTINGIZDAN 10–20 TA SINOV JUFTLIGI TAYYORLANG** — umumiy benchmarklar **sizning vazifangizni ko'rsatmaydi**.

</details>

---

## 📌 Xulosa

```python
model = SentenceTransformer("all-MiniLM-L6-v2")
E = model.encode(matnlar, batch_size=64)        # (N, 384), norma 1.0
```

```
💥 Jumla embeddingi KONTEKSTNI biladi ("lead guitar" ≠ "lead in water")
⚠️ INKORNI yomon tushunadi ("good" ≈ "not good")
💥 KONTEKST OYNASI 256 token — undan keyingisi JIMGINA tashlanadi
   → ⭐ ENG MUHIM MATNNI OLDINGA qo'ying

🔬 O'LCHANGAN:
   680 embedding → 6.0s (113/s, CPU)
   all-MiniLM-L6-v2 norma 1.0000 ✅ · multilingual 5.8556 💥
   🇺🇿 o'zbekcha so'rovlar 0.20–0.38 (inglizchada 0.65–0.81)
```

> ## 🏆 **🇺🇿 LOYIHADA `all-MiniLM-L6-v2` ISHLATMANG** — u **o'zbekchani bilmaydi**.

---

⬅️ [2-dars. Masofa metrikalari](02-Distance-Metrics.md) · 🏠 [Modul boshiga](README.md) · ➡️ [50-modul. Pinecone](../50-Pinecone-Introduction/README.md)
