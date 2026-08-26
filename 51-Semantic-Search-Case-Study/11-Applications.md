# 11-dars. Vektor bazalarining qo'llanishlari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Biz kurs qidiruvini qurdik. Lekin AYNAN SHU naqsh yana o'nlab joyda ishlaydi."**

---

## 1. Kurs sanab o'tgan sohalar

| Soha | Nima vektorlanadi | Nima qidiriladi |
|---|---|---|
| ## ⭐ **Tavsiya tizimlari** | Foydalanuvchi tarixi | O'xshash mahsulot |
| ## ⭐ **Rasm qidiruvi** | Rasm (CLIP) | Matn yoki rasm |
| ## **Biotibbiy tadqiqot** | Oqsil ketma-ketligi | O'xshash struktura |
| ## **Anomaliya aniqlash** | Normal xatti-harakat | Uzoq nuqtalar |
| ## 🏆 **RAG** | Hujjat bo'laklari | Foydalanuvchi savoli |

> ## 🔑 **HAMMASINING SKELETI BIR XIL:**
> ```
> obyekt  →  vektor  →  baza  →  eng yaqin qo'shnilar  →  chegara
> ```
>
> ## ⭐ **FARQ — FAQAT `ENCODER` DA.** ## Matn uchun `sentence-transformers`, rasm uchun `CLIP`, ## oqsil uchun `ESM`. ## **Qolgan hamma kod — o'zgarmaydi.**

---

## 2. ⭐⭐ Tavsiya tizimi — kurs bazamiz ustida

```python
def oxshash_kurslar(E, df, kurs_nomi, k=5):
    """⭐ 'Bu kursni yoqtirsangiz, buni ham ko'ring'."""
    mos = df.index[df.course_name == kurs_nomi]
    if len(mos) == 0:
        return []
    i = int(mos[0])

    ballar = E @ E[i]                       # ⭐ savol emas, KURS o'zi
    top = np.argsort(-ballar)

    natija, korilgan = [], {kurs_nomi}
    for j in top:
        nom = df.iloc[int(j)].course_name
        if nom in korilgan:                 # ⭐ o'zini va takrorni tashla
            continue
        korilgan.add(nom)
        natija.append((nom, round(float(ballar[int(j)]), 4)))
        if len(natija) >= k:
            break
    return natija
```

> ## 🔑 **YAGONA FARQ — SO'ROV VEKTORI:**
> ```
> Qidiruv      →  q = model.encode("regression in Python")
> Tavsiya      →  q = E[i]      ⭐ mavjud obyektning vektori
> ```
>
> ## 💡 **YA'NI TAVSIYA TIZIMI — QIDIRUVNING O'ZI.** ## Yangi model, yangi baza, yangi kod **kerak emas**.
>
> ## ⚠️ **`korilgan` TO'PLAMI — MUHIM.** ## Bo'lim darajasidagi bazada ## bitta kursning **40 ta bo'limi** ro'yxatni **to'ldirib yuboradi**.

### ⭐ Foydalanuvchi tarixiga qarab

```python
def tarix_asosida(E, df, korilgan_kurslar, k=5, kamayish=0.8):
    """🏆 Bir necha kursdan O'RTACHA profil — yangilari MUHIMROQ."""
    ind = [int(df.index[df.course_name == n][0])
           for n in korilgan_kurslar
           if len(df.index[df.course_name == n])]
    if not ind:
        return []

    # ⭐ oxirgi ko'rilgan kurs eng katta og'irlikka ega
    ogirlik = np.array([kamayish ** (len(ind) - 1 - t)
                        for t in range(len(ind))])
    profil = (E[ind] * ogirlik[:, None]).sum(axis=0)
    profil = profil / np.linalg.norm(profil)

    ballar = E @ profil
    top, natija, korilgan = np.argsort(-ballar), [], set(korilgan_kurslar)
    for j in top:
        nom = df.iloc[int(j)].course_name
        if nom in korilgan:
            continue
        korilgan.add(nom)
        natija.append((nom, round(float(ballar[int(j)]), 4)))
        if len(natija) >= k:
            break
    return natija
```

> ## 🏆 **`kamayish=0.8` — VAQT OG'IRLIGI.** ## Kecha ko'rilgan kurs — bir yil oldingisidan **muhimroq**.
>
> ## 💥 **VA BU YERDA `10-DARSNING DARSI` QAYTADAN KELADI:** ## profilni **normallashtiring**, aks holda ## **ko'p kurs ko'rgan** foydalanuvchining vektori **ulkan** bo'lib ketadi.

---

## 3. ⭐⭐ Rasm qidiruvi — CLIP

```python
# pip install sentence-transformers pillow
from sentence_transformers import SentenceTransformer
from PIL import Image

clip = SentenceTransformer("clip-ViT-B-32")

rasmlar = [Image.open(p) for p in yollar]
Er = clip.encode(rasmlar, batch_size=16)
Er = Er / np.linalg.norm(Er, axis=1, keepdims=True)

q = clip.encode("a cat sitting on a laptop")     # ⭐ MATN so'rovi
q = q / np.linalg.norm(q)

top = np.argsort(-(Er @ q))[:5]
```

> ## 🏆 **CLIP'NING SEHRI: RASM VA MATN — BIR XIL VEKTOR FAZOSIDA.**
> ```
> rasm  →  [0.12, -0.34, ...]  (512 o'lcham)
> matn  →  [0.11, -0.31, ...]  (512 o'lcham)
>                 ↓
>          bir-biri bilan SOLISHTIRILADI
> ```
>
> ## ⭐ **VA BIZNING BUTUN KODIMIZ O'ZGARISHSIZ ISHLAYDI** — ## `KursQidiruv` sinfida faqat `model` ni almashtiring.
>
> ## 🇺🇿 **⚠️ LEKIN CLIP — INGLIZCHA.** ## O'zbekcha so'rov uchun: `sentence-transformers/clip-ViT-B-32-multilingual-v1`.

---

## 4. ⭐ Anomaliya aniqlash — chegaraning teskarisi

```python
def anomaliya_top(E, chegara=0.5):
    """💥 Hech kimga O'XSHAMAGAN yozuvlarni topadi."""
    S = E @ E.T                             # hamma-hammaga
    np.fill_diagonal(S, -1)                 # ⭐ o'zini hisobga olmaslik
    eng_yaqin = S.max(axis=1)

    ind = np.argsort(eng_yaqin)
    return [(int(i), round(float(eng_yaqin[i]), 4))
            for i in ind if eng_yaqin[i] < chegara]
```

> ## 🔑 **QIDIRUVDA — ENG YAQINI KERAK. ANOMALIYADA — ENG UZOG'I.**
> ```
> eng_yaqin ball YUQORI  →  ✅ normal, o'xshashlari bor
> eng_yaqin ball PAST    →  💥 anomaliya, yolg'iz
> ```
>
> ## ⭐ **AMALIY QO'LLANISH — KATALOG SIFATINI TEKSHIRISH:** ## eng past ballga ega bo'lim odatda ## **bo'sh tavsif** yoki **xato yozilgan** yozuv bo'lib chiqadi.
>
> ## 💥 **VA `E @ E.T` — `n²` XOTIRA.** ## 680 vektorda — 3.7 MB ✅. ## 100 000 vektorda — **80 GB** 💥. ## Katta bazada `to'plamlab` yoki `ANN` ishlating.

---

## 5. ⭐⭐⭐ Gibrid qidiruv — amaliyotdagi eng foydali qo'shimcha

```python
from collections import defaultdict


def rrf(vektor_natija, kalit_natija, k=60, n=10):
    """🏆 Reciprocal Rank Fusion — ikki ro'yxatni birlashtiradi."""
    ball = defaultdict(float)
    for r, x in enumerate(vektor_natija):
        ball[x] += 1 / (k + r + 1)
    for r, x in enumerate(kalit_natija):
        ball[x] += 1 / (k + r + 1)
    return sorted(ball.items(), key=lambda i: -i[1])[:n]
```

> ## 🔑 **NIMA UCHUN KERAK?** *(2-darsdan eslang)*
> ```
> Vektor qidiruvi  💥  ANIQ nomni topa olmaydi
>    savol: "SQLAlchemy"  →  "SQL" kurslarini beradi
>
> Kalit so'z (BM25) 💥  MA'NONI bilmaydi
>    savol: "predicting numbers"  →  0 natija
>
> ⭐ IKKALASI birga  →  har ikkala kuchli tomon
> ```
>
> ## 🏆 **`RRF` NING GO'ZALLIGI — BALLARNI EMAS, `O'RINLARNI` QO'SHADI.** ## Shuning uchun ## **kosinus (0–1)** va **BM25 (0–50)** ni ## **normallashtirish kerak emas**.
>
> ## ⭐ **`k=60` — SANOAT STANDARTI.** ## Kichik `k` birinchi o'rinlarni **haddan tashqari** kuchaytiradi.

---

## 6. 🇺🇿 O'zbekcha loyihalar uchun tayyor g'oyalar

> ### ① ⭐ **O'zbek tilidagi qonun hujjatlari qidiruvi**
> ```
> vektorlanadi:  moddalar matni
> qidiriladi:    "ish haqidan qancha soliq ushlanadi?"
> model:         paraphrase-multilingual  (UZ/EN 0.80)
> ⚠️ 128 token   →  moddalarni QISQA bo'laklarga bo'ling
> ```
>
> ### ② ⭐ **Universitet kurslari tavsiyasi**
> ```
> ⭐ AYNAN shu modul — faqat ma'lumot o'zbekcha
> ```
>
> ### ③ ⭐⭐ **Bank mahsulotlari yordamchisi**
> ```
> 💥 49-modulda o'lchangan: "uy sotib olish uchun pul kerak"
>    →  UCHALA metrika ham "Ipoteka" ni TOPA OLMADI
> ⭐ demak: ko'p tilli model + gibrid qidiruv MAJBURIY
> ```
>
> ### ④ **Tibbiy savol-javob**
> ```
> ⚠️ chegarani BALAND qo'ying (0.6+)
> ⚠️ noaniq bo'lsa — "shifokorga murojaat qiling"
> 💥 tibbiyotda "eng yaqin javob" YETARLI EMAS
> ```

---

## 7. ⭐ Loyihani ishlab chiqarishga chiqarish

```
✅ TEKSHIRUV RO'YXATI

① Sinov to'plami        →  kamida 20 savol (BOR + YO'Q)
② Chegara               →  o'lchangan, taxmin qilingan EMAS
③ Metadata'da _model    →  model almashsa BILINADI
④ Barqaror ID           →  course_id-section_id
⑤ Xeshli sinxronlash    →  arvoh yozuv YO'Q
⑥ Guruhlash             →  max(), += EMAS
⑦ Monitoring            →  0 natijali so'rovlarni YOZING
⑧ Zaxira                →  CSV manba + qayta indekslash skripti
```

> ## 🏆 **⑦ — ENG QIMMATLI BAND.** ## Chegaradan o'tmagan so'rovlar ro'yxati — ## **kataloginggizda nima yetishmayotganini** ko'rsatadigan **bepul tadqiqot**.
>
> ```python
> if not mos:
>     with open("topilmadi.log", "a", encoding="utf-8") as f:
>         f.write(f"{savol}\t{xom[0]['ball'] if xom else 0:.4f}\n")
> ```

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Tavsiya tizimi qidiruvdan nimasi bilan farq qiladi?

**M2.** CLIP nima uchun maxsus?

**M3.** RRF nima uchun normallashtirishni talab qilmaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Faqat **so'rov vektori** bilan: ## `model.encode(savol)` o'rniga `E[i]` — **mavjud obyektning vektori**.

**M2.** ## Rasm va matn **bitta vektor fazosida** — ## matn bilan rasm qidirsa bo'ladi.

**M3.** ## U **ballarni emas, o'rinlarni** qo'shadi — ## `1/(k+o'rin)`.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Kurs tavsiya tizimini quring.

<details>
<summary>✅ Yechim</summary>

```python
for kurs in ["Introduction to Python", "SQL",
             "Machine Learning in Python"]:
    print(f"\n🎓 '{kurs}' ni yoqtirsangiz:")
    for nom, ball in oxshash_kurslar(Eb, bolimlar, kurs, k=5):
        print(f"   {ball:.4f}  {nom}")
```

## ⚠️ **NATIJAGA TANQIDIY QARANG:** ## agar tavsiyalar **juda o'xshash** bo'lsa *(hammasi Python kurslari)* — ## foydalanuvchi **yangi narsa ko'rmaydi**.

## 🏆 **YECHIM — `xilma-xillik` (MMR):**
```python
def mmr(E, i, k=5, lambda_=0.7):
    """⭐ O'xshashlik VA xilma-xillik muvozanati."""
    ballar = E @ E[i]
    tanlangan = []
    nomzod = [j for j in np.argsort(-ballar)[:50] if j != i]

    while len(tanlangan) < k and nomzod:
        eng_yaxshi, eng_ball = None, -9
        for j in nomzod:
            oxshash = ballar[j]
            takror = max([float(E[j] @ E[t]) for t in tanlangan],
                         default=0)
            b = lambda_ * oxshash - (1 - lambda_) * takror
            if b > eng_ball:
                eng_yaxshi, eng_ball = j, b
        tanlangan.append(eng_yaxshi)
        nomzod.remove(eng_yaxshi)
    return tanlangan
```

## 💡 **`lambda_=1.0` — sof o'xshashlik. `lambda_=0.0` — sof xilma-xillik.** ## Amalda **0.6–0.8** yaxshi ishlaydi.

</details>

**M5.** ⭐⭐ Anomaliyalarni toping va sababini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
anom = anomaliya_top(Eb, chegara=0.55)
print(f"💥 {len(anom)} ta anomaliya (eng yaqin qo'shnisi 0.55 dan past)\n")

for i, ball in anom[:10]:
    r = bolimlar.iloc[i]
    print(f"  {ball:.4f}  {r.course_name[:32]:32s} / "
          f"{r.section_name[:28]:28s} "
          f"({len(str(r.section_description))} belgi)")
```

## 🔑 **SABABLARINI TEKSHIRING:**
```
① tavsif JUDA QISQA  →  ma'lumot yetarli emas
② noyob mavzu        →  ✅ normal, katalogda yagona
③ xato yozilgan matn →  💥 tozalash kerak
```

## 🏆 **BU — KATALOG SIFATINI TEKSHIRISHNING ENG TEZ USULI.**

</details>

**M6.** ⭐⭐ Gibrid qidiruvni quring va vektor qidiruvi bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
# pip install rank-bm25
from rank_bm25 import BM25Okapi

korpus = [m.lower().split() for m in bolimlar.matn.tolist()]
bm25 = BM25Okapi(korpus)

QIYIN = ["SQLAlchemy", "requests-html", "PD model",
         "predicting numbers from data", "tables joining"]

for savol in QIYIN:
    q = model.encode(savol)
    q = q / np.linalg.norm(q)
    v_top = list(np.argsort(-(Eb @ q))[:10])
    k_top = list(np.argsort(-bm25.get_scores(savol.lower().split()))[:10])
    g_top = [i for i, _ in rrf([int(x) for x in v_top],
                               [int(x) for x in k_top], n=3)]

    print(f"\n🔎 {savol}")
    for nom, ind in [("vektor", v_top[:3]), ("BM25", k_top[:3]),
                     ("🏆 gibrid", g_top)]:
        s = " | ".join(bolimlar.iloc[int(i)].section_name[:22]
                       for i in ind)
        print(f"   {nom:10s} {s}")
```

## 💡 **"SQLAlchemy" VA "requests-html" — ANIQ NOMLAR.** ## BM25 ularni **yaxshi topadi**, vektor qidiruvi — **yo'q**.

## 💡 **"predicting numbers from data" — MA'NO SAVOLI.** ## Vektor qidiruvi **regressiyani** topadi, BM25 — **hech narsani**.

## 🏆 **GIBRID — IKKALASIDA HAM ISHLAYDI.**

</details>

---

## 📌 Xulosa

```python
# ⭐ Qidiruv:  q = model.encode(savol)
# ⭐ Tavsiya:  q = E[i]                    ← YAGONA farq
# ⭐ Rasm:     q = clip.encode(rasm)       ← faqat model boshqa
# ⭐ Anomaliya: eng_yaqin ball PAST        ← chegaraning teskarisi
```

```
🔑 HAMMA QO'LLANISHNING SKELETI BIR XIL:
   obyekt  →  vektor  →  baza  →  eng yaqin  →  chegara

⭐ Tavsiyada: profil vektorini NORMALLASHTIRING
⭐ Guruhlashda: max(), += EMAS
⭐ Anomaliyada: E @ E.T  →  n² xotira (100k da 80 GB 💥)
🏆 Gibrid (RRF): aniq nomlar + ma'no — ikkalasi ham
🇺🇿 Ko'p tilli model + gibrid = o'zbekcha loyihada MAJBURIY
```

> ## 🏆🏆 **SIZ BITTA NARSANI O'RGANDINGIZ — VEKTOR QIDIRUVINI. LEKIN U O'NLAB MASALANI YECHADI.**

---

⬅️ [10-dars. Og'irlikli embedding](10-Weighted-Embeddings.md) · 🏠 [Modul boshiga](README.md) · ➡️ [⚡ Mashqlar](MASHQLAR.md) · [🚀 Loyihalar](LOYIHALAR.md)
