# 10-dars. Og'irlikli embedding (kursning topshirig'i) ⭐⭐

## 🎬 Boshlashdan oldin

> **Kursning topshirig'i:** *"Har ustunni alohida vektorlab, og'irlik bilan qo'shing. Lekin — bu katta yaxshilanish bermasligi mumkin."*
>
> ## 🔬 **BIZ — SHUNI TEKSHIRAMIZ.**

---

## 1. G'oya

```
BIRLASHGAN MATN (hozirgi usul):
   "SQL SQL JOINs Learn how to combine tables..."
        ↓ bitta encode()
   [0.12, -0.34, ...]

OG'IRLIKLI (topshiriq):
   "SQL kursi..."       →  encode  →  v₁  ×  1
   "SQL JOINs bo'limi"  →  encode  →  v₂  ×  2   ⭐ MUHIMROQ
   "sql"                →  encode  →  v₃  ×  1
                                      ─────────
                              v = normalize(v₁ + 2·v₂ + v₃)
```

> ## 🔑 **MANTIQ:** *"Bo'lim nomi eng muhim — unga ko'proq og'irlik beraylik."*
>
> ## ⭐ **VA YANA BIR AFZALLIK:** ## har qism **alohida** vektorlanadi — ## demak **256 token chegarasi har qismga alohida** qo'llanadi. ## 💥 **52% kesilish muammosi kamayadi.**

---

## 2. ⭐⭐ Amalga oshirish

```python
import numpy as np


def norm(A):
    return A / np.linalg.norm(A, axis=1, keepdims=True)


def ogirlikli(df, qismlar, model, hajm=32):
    """⭐ Har qismni ALOHIDA vektorlab, og'irlik bilan qo'shadi."""
    jami = None
    for ustun, w in qismlar:
        A = norm(model.encode(df[ustun].tolist(), batch_size=hajm,
                              show_progress_bar=False))
        jami = A * w if jami is None else jami + A * w
    return norm(jami)                       # ⭐ oxirida QAYTA normallash
```

> ## 💥 **IKKI JOYDA NORMALLASH — HAR IKKALASI HAM SHART:**
> ```
> ① har qismni qo'shishdan OLDIN
>    →  aks holda UZUN matn (katta norma) og'irlikni O'ZI belgilaydi
>
> ② qo'shgandan KEYIN
>    →  aks holda yig'indi normasi 1 emas  →  kosinus buziladi
> ```
>
> ## ⚠️ **①-BANDNI TUSHIRIB QOLDIRISH — ENG KO'P UCHRAYDIGAN XATO.** ## `w=1` deb yozasiz, lekin haqiqiy og'irlik **matn uzunligiga** bog'liq bo'lib qoladi.

```python
bolimlar["u_kurs"] = bolimlar.apply(lambda r: tozala(
    f'{r.course_name}. {r.course_description}'), axis=1)
bolimlar["u_bolim"] = bolimlar.apply(lambda r: tozala(
    f'{r.section_name}. {r.section_description}'), axis=1)
bolimlar["u_tex"] = bolimlar.course_technology

E = ogirlikli(bolimlar, [("u_kurs", 1), ("u_bolim", 2), ("u_tex", 1)], model)
```

---

## 3. 🔬 Sakkizta tajriba — o'lchangan

```
               tajriba aniqlik  mos_o'rt  nomos_o'rt  ajratish
        texnologiyasiz     7/8    0.6840      0.1905    0.4935   🏆
             bo'lim ×2     7/8    0.6964      0.2087    0.4877
             bo'lim ×3     7/8    0.6992      0.2152    0.4841
BIRLASHGAN matn (asos)     7/8    0.6552      0.1757    0.4795
          teng (1,1,1)     7/8    0.6695      0.1911    0.4785
               kurs ×2     7/8    0.6574      0.1794    0.4780
          faqat bo'lim     7/8    0.6497      0.2274    0.4224
        texnologiya ×3     7/8    0.5777      0.1795    0.3982   💥
```

> ## 🏆🏆 **KURSNING TAXMINI — TO'LIQ TASDIQLANDI.**
>
> ## 💥 **HAMMA SAKKIZ TAJRIBA — `7/8`. ANIQLIK UMUMAN O'ZGARMADI.**
>
> ## 🔑 **YA'NI: OG'IRLIK TANLASHGA SARFLANGAN VAQT — BEKORGA KETADI.**

### ⭐ Lekin `ajratish` o'zgardi — va bu qiziq

```
🏆 texnologiyasiz    0.4935   ← ENG YAXSHI
   asos (birlashgan) 0.4795
💥 texnologiya ×3    0.3982   ← ENG YOMON  (−20%)
```

> ## 💡 **ENG YAXSHI NATIJA — `course_technology` NI BUTUNLAY OLIB TASHLASH.**
>
> ## 🔑 **NIMA UCHUN?** `"python"` — **bitta so'z**. ## Uni alohida vektorlash **shovqin** qo'shadi: ## `"python"` so'zining vektori **ilon**, **Monty Python**, **dasturlash** — ## hammasining aralashmasi.
>
> ## 💥 **VA `texnologiya ×3` — `mos_o'rt` NI 0.6552 DAN 0.5777 GA TUSHIRDI.**
> ## ## **BITTA SO'ZNI UCH BARAVAR OG'IRLASH — MA'NONI YO'Q QILDI.**
>
> ## 🏆 **UMUMIY QOIDA:** ## **QISQA MATNGA KATTA OG'IRLIK BERMANG.** ## Bitta so'zning vektori — **ma'nosiz o'rtacha**.

---

## 4. ⚠️ Og'irlikli usulning haqiqiy narxi

```
BIRLASHGAN:  680 matn  →  1 marta encode  →  6.0s
OG'IRLIKLI:  680×3 matn →  3 marta encode  →  ~18s     ⭐ 3× SEKIN

Xotira:  bir xil (384 o'lcham)
Kod:     murakkabroq (qismlar, og'irliklar, ikki normallash)
Foyda:   aniqlikda 0    ·   ajratishda +0.014 (asosga nisbatan)
```

> ## 💥 **3× KO'P HISOB — 0% ANIQLIK YAXSHILANISHI.**
>
> ## 🏆 **XULOSA: BU LOYIHADA OG'IRLIKLI EMBEDDING KERAK EMAS.**

---

## 5. ⭐⭐ Qachon og'irlikli embedding FOYDALI?

> ### ✅ **① Qismlar UZUN va MA'NOLI bo'lsa**
> ```
> Maqola:  sarlavha (10 so'z) + annotatsiya (100) + to'liq matn (5000)
>    →  har biri ALOHIDA 256 tokenga sig'adi
>    →  ⭐ 5000 so'zlik matn KESILMAYDI
> ```
> ## 💡 **BIZDA BUNDAY EMAS EDI** — `course_technology` **bitta so'z**.
>
> ### ✅ **② Qismlar TURLI XIL bo'lsa**
> ```
> Mahsulot:  nomi + tavsifi + FOYDALANUVCHI SHARHLARI
>    →  sharhlar boshqa "ovoz"da yozilgan
>    →  ⭐ aralashtirmaslik yaxshiroq
> ```
>
> ### ✅ **③ So'rov turi bo'yicha og'irlik O'ZGARSA**
> ```python
> # ⭐ dinamik og'irlik — ENG KUCHLI qo'llanish
> if savol_texnik(savol):
>     E = ogirlikli(df, [("u_bolim", 3), ("u_kurs", 1)], model)
> else:
>     E = ogirlikli(df, [("u_kurs", 3), ("u_bolim", 1)], model)
> ```
> ## ⚠️ **LEKIN BU HAR SO'ROVDA QAYTA VEKTORLASHNI TALAB QILADI** — ## amalda **ikki indeks** saqlanadi.
>
> ### ❌ **QACHON KERAK EMAS**
> ```
> 💥 qismlar qisqa (1–3 so'z)
> 💥 qismlar bir-birini takrorlaydi
> 💥 sinov to'plamida farq ko'rinmayapti  ← BIZNING HOLAT
> ```

---

## 6. ⭐ Yaxshiroq muqobil — `ko'p vektorli` yondashuv

```python
def kop_vektor_yukla(q, df):
    """🏆 Og'irlik o'rniga: har qism ALOHIDA yozuv bo'ladi."""
    ids, matnlar, metalar = [], [], []
    for _, r in df.iterrows():
        for tur, matn in [("kurs", r.u_kurs), ("bolim", r.u_bolim)]:
            ids.append(f"{r.unique_id}-{tur}")
            matnlar.append(matn)
            metalar.append({"unique_id": r.unique_id, "tur": tur,
                            "course_name": r.course_name[:80],
                            "section_name": r.section_name[:80]})
    q.yukla(ids, matnlar, metalar)


def kop_vektor_qidir(q, savol, k=20):
    """⭐ Natijalarni unique_id bo'yicha MAX bilan birlashtiradi."""
    xom = q.qidir(savol, k=k)
    eng = {}
    for x in xom:
        u = x["meta"]["unique_id"]
        if u not in eng or x["ball"] > eng[u]["ball"]:
            eng[u] = x
    return sorted(eng.values(), key=lambda x: -x["ball"])
```

> ## 🏆 **NIMA UCHUN BU YAXSHIROQ?**
> ```
> Og'irlikli  →  v₁ va v₂ ARALASHADI  →  ikkalasi ham "yuvilib" ketadi
> Ko'p vektor →  har biri O'ZICHA qoladi  →  ⭐ eng mosi TO'LIQ ball oladi
> ```
>
> ## ⚠️ **NARXI:** baza **2× katta**, natijalarni **birlashtirish** kerak.
>
> ## 💡 **VA BU — `ParentDocumentRetriever` NING G'OYASI** *(42-modul, 8-dars)*: ## **kichik bo'lakda qidir, katta hujjatni qaytar**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Og'irlikli embeddingda nechta joyda normallash kerak?

**M2.** Nima uchun `texnologiya ×3` natijani yomonlashtirdi?

**M3.** Og'irlikli usul necha marta sekinroq?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Ikki joyda** — qo'shishdan **oldin** (har qismni) va qo'shgandan **keyin**.

**M2.** ## `"python"` — **bitta so'z**. ## Uni 3× og'irlash **shovqinni** kuchaytirdi, `mos_o'rt` **0.6552 → 0.5777** ga tushdi.

**M3.** ## **3×** — chunki `encode()` **uch marta** chaqiriladi.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Kursning topshirig'ini bajaring — og'irliklarni sinang.

<details>
<summary>✅ Yechim</summary>

```python
TAJRIBALAR = {
    "teng (1,1,1)":   [("u_kurs", 1), ("u_bolim", 1), ("u_tex", 1)],
    "bo'lim x2":      [("u_kurs", 1), ("u_bolim", 2), ("u_tex", 1)],
    "bo'lim x3":      [("u_kurs", 1), ("u_bolim", 3), ("u_tex", 1)],
    "kurs x2":        [("u_kurs", 2), ("u_bolim", 1), ("u_tex", 1)],
    "texnologiya x3": [("u_kurs", 1), ("u_bolim", 1), ("u_tex", 3)],
    "texnologiyasiz": [("u_kurs", 1), ("u_bolim", 1)],
    "faqat bo'lim":   [("u_bolim", 1)],
}

nat = []
for nom, qismlar in TAJRIBALAR.items():
    E = ogirlikli(bolimlar, qismlar, model)
    togri, mos = 0, []
    for savol, kutilgan in SINOVLAR:
        q = model.encode(savol)
        q = q / np.linalg.norm(q)
        b = E @ q
        i = int(np.argmax(b))
        mos.append(float(b[i]))
        togri += int(kutilgan.lower()
                     in bolimlar.iloc[i].course_name.lower())
    nomos = []
    for s in YOQ:
        q = model.encode(s)
        q = q / np.linalg.norm(q)
        nomos.append(float((E @ q).max()))
    nat.append({"tajriba": nom, "aniqlik": f"{togri}/{len(SINOVLAR)}",
                "mos_ort": round(float(np.mean(mos)), 4),
                "nomos_ort": round(float(np.mean(nomos)), 4),
                "ajratish": round(float(np.mean(mos)
                                        - np.mean(nomos)), 4)})

d = pd.DataFrame(nat).sort_values("ajratish", ascending=False)
print(d.to_string(index=False))
print("\n💡 ANIQLIK USTUNI BIR XIL BO'LSA — og'irlik FOYDA BERMAYAPTI")
```

## 💥 **BIZDA HAMMA TAJRIBA `7/8` BERDI** — ## kursning *"katta yaxshilanish bo'lmasligi mumkin"* degani **to'g'ri chiqdi**.

</details>

**M5.** ⭐⭐ Ko'p vektorli yondashuvni sinang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 6-bo'limdagi funksiyalarni ishlatib:

```python
qk = KursQidiruv(nom="kop-vektor")
kop_vektor_yukla(qk, bolimlar)
print("bazada:", qk.soni(), "(680 × 2 = 1360 bo'lishi kerak)")

togri = 0
for savol, kutilgan in SINOVLAR:
    r = kop_vektor_qidir(qk, savol, k=20)
    if not r:
        continue
    ok = kutilgan.lower() in r[0]["meta"]["course_name"].lower()
    togri += ok
    print(f"  {'✅' if ok else '💥'} {savol[:28]:28s} "
          f"{r[0]['ball']:.4f}  {r[0]['meta']['course_name'][:30]} "
          f"[{r[0]['meta']['tur']}]")

print(f"\n  ko'p vektorli: {togri}/{len(SINOVLAR)}")
```

## ⭐ **`[tur]` USTUNIGA E'TIBOR BERING** — ## qaysi qism *(kurs yoki bo'lim)* g'olib chiqqanini ko'rsatadi. ## Bu — **og'irlikli usulda ko'rinmaydigan** ma'lumot.

</details>

**M6.** ⭐ Normallashsiz nima bo'lishini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
def ogirlikli_xato(df, qismlar, model):
    """💥 QISMLARNI normallashtirmaydi — XATO versiya."""
    jami = None
    for ustun, w in qismlar:
        A = model.encode(df[ustun].tolist(), batch_size=32,
                         show_progress_bar=False)   # 💥 norm YO'Q
        jami = A * w if jami is None else jami + A * w
    return jami / np.linalg.norm(jami, axis=1, keepdims=True)


qismlar = [("u_kurs", 1), ("u_bolim", 2), ("u_tex", 1)]

for nom, f in [("✅ to'g'ri", ogirlikli), ("💥 normallashsiz",
                                          ogirlikli_xato)]:
    E = f(bolimlar, qismlar, model)
    togri = 0
    for savol, kutilgan in SINOVLAR:
        q = model.encode(savol)
        q = q / np.linalg.norm(q)
        i = int(np.argmax(E @ q))
        togri += int(kutilgan.lower()
                     in bolimlar.iloc[i].course_name.lower())
    print(f"  {nom:18s} {togri}/{len(SINOVLAR)}")
```

## ⚠️ **`all-MiniLM-L6-v2` ALLAQACHON NORMALLASHGAN** *(norma 1.0)* — ## shuning uchun bu modelda **farq ko'rinmaydi**.

## 💥 **`paraphrase-multilingual` DA** *(norma 5.083)* — ## farq **katta** bo'ladi. ## Shu modelda **qayta sinang**.

</details>

---

## 📌 Xulosa

```python
def ogirlikli(df, qismlar, model):
    jami = None
    for ustun, w in qismlar:
        A = norm(model.encode(df[ustun].tolist()))   # ⭐ ① norm
        jami = A * w if jami is None else jami + A * w
    return norm(jami)                                # ⭐ ② norm
```

```
🔬 O'LCHANGAN (8 tajriba, 8 sinov savoli):
   HAMMA TAJRIBA  →  7/8      💥 ANIQLIK O'ZGARMADI

   ajratish bo'yicha:
     🏆 texnologiyasiz     0.4935
        asos (birlashgan)  0.4795
     💥 texnologiya ×3     0.3982   (mos_o'rt 0.6552 → 0.5777)

   narxi: 3× ko'p hisob  ·  foydasi: aniqlikda 0
```

> ## 🏆🏆 **KURSNING OGOHLANTIRISHI TASDIQLANDI — OG'IRLIK BU LOYIHADA FOYDA BERMAYDI.**
>
> ## 💥 **VA YANGI QOIDA: QISQA MATNGA KATTA OG'IRLIK BERMANG.** ## Bitta so'zning vektori — **ma'nosiz o'rtacha**, uni kuchaytirish **zarar keltiradi**.
>
> ## ⭐ **OG'IRLIK O'RNIGA — `KO'P VEKTORLI` YONDASHUVNI SINANG.**

---

⬅️ [9-dars. Bo'lim darajasi](09-Section-Level-Search.md) · 🏠 [Modul boshiga](README.md) · ➡️ [11-dars. Qo'llanishlar](11-Applications.md)
