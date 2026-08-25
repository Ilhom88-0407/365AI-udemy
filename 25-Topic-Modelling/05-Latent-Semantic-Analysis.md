# 5-dars. LSA — Latent Semantic Analysis

## 🎬 Boshlashdan oldin

> **"Latent semantic analysis IKKITA G'OYAGA tayanadi."**

---

## 1. Birinchi g'oya — taqsimot gipotezasi

> ## **"Birinchisi — TAQSIMOT GIPOTEZASI (distributional hypothesis), unga ko'ra O'XSHASH MA'NOLI so'zlar TEZ-TEZ BIRGA uchraydi."**

```
"You shall know a word by the company it keeps"
       — J.R. Firth, 1957

"So'zni u yuradigan davra bilan bilasan"
```

### Misol

```
"doctor"  bilan birga uchraydi:  patient · hospital · nurse · treatment
"nurse"   bilan birga uchraydi:  patient · hospital · doctor · care
                                    ↑
                        JUDA O'XSHASH davra!
                                    ↓
              "doctor" va "nurse" — O'XSHASH MA'NOLI
```

> ## 💡 **Bu — g'oyaning butun mohiyati.** Algoritm `doctor` va `nurse` **ma'nosini bilmaydi**. U shunchaki ular **bir xil qo'shnilar** bilan uchrashini ko'radi — va shundan **ma'no o'xshashligini** chiqaradi.

```
Bir xil qo'shnilar  →  bir xil ma'no  →  BIR MAVZU
```

---

## 2. Ikkinchi g'oya — SVD

> **"Ikkinchi g'oya — SINGULAR VALUE DECOMPOSITION, biz uni SVD deb qisqartiramiz."**
>
> **"SVD matn hujjatlarini TURLI VEKTORLARGA qayta yaratadi. Har bir vektor matndagi ma'noga QARASHNING BOSHQA USULINI ifodalaydi."**

![LSA va SVD](assets/03-lsa-svd.svg)

### Formula

> **"Vektorlarni quyidagi tenglama bilan ifodalash mumkin."**

```
        M  =  U  ×  Σ  ×  Vᵀ
```

> **"`M` — bu bizning HUJJAT-TERMIN MATRITSAMIZ, bu yerda qatorlar — har bir alohida hujjat, ustunlar esa — bizning terminlarimiz. Qiymatlar shunchaki bu termin shu hujjatda bor-yo'qligini ifodalaydi."**

```
M — HUJJAT × TERMIN
    ┌──────────────────────┐
    │      the  cat  dog   │
    │ D1    1    1    0    │
    │ D2    1    0    1    │
    │ D3    1    1    0    │
    └──────────────────────┘
```

> **"`U` — bu HUJJAT-MAVZU matritsasi. Ya'ni terminlarimiz o'rniga ustunlarimiz MAVZULAR."**

```
U — HUJJAT × MAVZU        ⭐ "Bu hujjat qaysi mavzuda?"
    ┌──────────────────┐
    │      M0     M1   │
    │ D1  0.82  0.12   │
    │ D2  0.15  0.91   │
    │ D3  0.79  0.09   │
    └──────────────────┘
```

> **"`Σ` (sigma) — bu VEKTOR, uning qiymatlari har bir yashirin mavzu umumiy ma'lumotdagi O'ZGARUVCHANLIKNI QANCHALIK TUSHUNTIRISHINI ifodalaydi."**

```
Σ — MAVZU KUCHI          ⭐ "Bu mavzu qanchalik MUHIM?"
    [ 4.82,  2.31,  1.05,  0.44 ]
       ↑              ↑
   eng muhim      kamroq muhim
```

> **"`V` — bu TERMIN-HUJJAT matritsasi, bu yerda qatorlarimiz — mavzular, ustunlarimiz esa — terminlar. Kichik `T` shunchaki bu TRANSPONIRLANGAN degani."**

```
Vᵀ — MAVZU × TERMIN       ⭐ "Bu mavzuda qaysi so'zlar?"
    ┌──────────────────────┐
    │      the  cat  dog   │
    │ M0  0.21 0.68 0.05   │
    │ M1  0.19 0.03 0.72   │
    └──────────────────────┘
```

---

## 3. 🔑 Uchta matritsa — uchta savol

```
        M    =    U     ×    Σ    ×    Vᵀ
        │         │          │          │
        │         │          │          └─ "Mavzuda qaysi SO'ZLAR?"
        │         │          └──────────── "Mavzu qanchalik MUHIM?"
        │         └─────────────────────── "Hujjat qaysi MAVZUDA?"
        └───────────────────────────────── ASL ma'lumot
```

> ## 💡 **LDA ham xuddi shu ikkita natijani beradi** *(hujjat→mavzu, mavzu→so'z)*. Farqi — **qanday hisoblanishida**: LDA **ehtimollik**, LSA **chiziqli algebra**.

---

## 4. O'lchovni kamaytirish

> ## **"SVD — bu O'LCHOVNI KAMAYTIRISH (dimensionality reduction) usuli."**

```
OLDIN:  100 hujjat × 8663 so'z
                     ↑
              8663 O'LCHOV!

KEYIN:  100 hujjat × 5 mavzu
                     ↑
              5 O'LCHOV  ⭐

        8663 → 5     (99.94% siqilish!)
```

### Nima uchun bu ishlaydi?

```
8663 ta so'z — lekin ular MUSTAQIL EMAS!

  "doctor" bo'lsa  →  "patient" ham bo'lishi EHTIMOL
  "trump"  bo'lsa  →  "president" ham bo'lishi EHTIMOL

Ya'ni ma'lumotda ANCHA KAM haqiqiy "o'lchov" bor.
SVD aynan shu YASHIRIN o'lchovlarni topadi.
```

> 💡 **Analogiya:** rangli rasmda millionlab piksel bor, lekin siz uni **"quyosh botishi"** deb **bitta so'zda** tasvirlay olasiz. SVD ham shunday — **ortiqchani tashlab, mohiyatni** qoldiradi.

---

## 5. Nima uchun foydali?

> **"Vektorlardan KLASTERLASH va O'XSHASHLIK BALLARI orqali o'xshash so'zlar va hujjatlarni aniqlash uchun foydalanish mumkin."**

| Foydalanish | Izoh |
|---|---|
| 🔍 **Semantik qidiruv** | `"car"` so'rovi `"automobile"` bo'lgan hujjatni ham topadi |
| 📊 **Klasterlash** | O'xshash hujjatlarni guruhlash |
| 🔗 **O'xshashlik** | Ikki hujjat qanchalik o'xshash |
| 🗜️ **Siqish** | 8663 → 5 o'lchov |
| 🎯 **Shovqinni yo'qotish** | Kam muhim o'lchovlar tashlanadi |

### 🎯 Semantik qidiruv — LSA'ning super kuchi

```
24-MODULDAGI TF-IDF QIDIRUV:
   so'rov: "car"
   hujjat: "the automobile was fast"
   natija: 0.0  ❌  (bir xil so'z YO'Q!)

LSA QIDIRUV:
   "car" va "automobile" BIR XIL qo'shnilar bilan uchraydi
   → ular BIR MAVZUDA
   → natija: 0.71  ✅
```

> ## 🔑 **Mana LSA'ning asosiy afzalligi:** u **so'zlarni emas, MA'NONI** solishtiradi.

---

## 6. LDA va LSA — solishtirish

| | **LDA** | **LSA** |
|---|---|---|
| **Asosi** | Ehtimollik *(Bayes)* | Chiziqli algebra *(SVD)* |
| **Kiritish** | Bag of Words | **TF-IDF** *(odatda)* |
| **Natija** | **Ehtimollar** *(0–1, jami 1)* | **Vaznlar** *(manfiy ham bo'ladi!)* |
| **Talqin qilish** | ✅ Osonroq | ⚠️ Qiyinroq *(manfiy vaznlar)* |
| **Tezlik** | 🐢 Sekinroq *(iterativ)* | ⚡ **Tezroq** *(bir marta hisoblanadi)* |
| **Barqarorlik** | ⚠️ Tasodifiy | ✅ **Deterministik** |
| **Mavzu sifati** | Odatda **aniqroq** | Ba'zan **aralashroq** |
| **`sklearn`** | `LatentDirichletAllocation` | `TruncatedSVD` |
| **`gensim`** | `LdaModel` | `LsiModel` |

> ## ⚠️ **LSA vaznlari MANFIY bo'lishi mumkin** — bu ehtimollik **emas**. Manfiy vazn *"bu so'z bu mavzuga QARAMA-QARSHI"* degani. Bu **talqinni qiyinlashtiradi**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** LSA qaysi ikki g'oyaga tayanadi?

**M2.** SVD formulasidagi 4 ta harf nimani anglatadi?

<details>
<summary>✅ Javoblar</summary>

**M1.**
1. **Taqsimot gipotezasi** — o'xshash ma'noli so'zlar **birga** uchraydi
2. **SVD** — singular value decomposition

**M2.**
```
M  = hujjat × termin   (asl ma'lumot)
U  = hujjat × mavzu    ⭐ "hujjat qaysi mavzuda?"
Σ  = mavzu kuchi       ⭐ "mavzu qanchalik muhim?"
Vᵀ = mavzu × termin    ⭐ "mavzuda qaysi so'zlar?"
```

</details>

### 🟡 O'rta

**M3.** Taqsimot gipotezasini o'z misolingiz bilan tushuntiring.

**M4.** Nima uchun SVD "o'lchovni kamaytirish" deb ataladi?

<details>
<summary>✅ Javoblar</summary>

**M3 — namuna:**

```
"choy"  qo'shnilari:  ichmoq · issiq · piyola · shakar · non
"qahva" qo'shnilari:  ichmoq · issiq · piyola · shakar · sut
                          ↑
                  4 ta qo'shni BIR XIL!
                          ↓
        Algoritm "choy" va "qahva" ni O'XSHASH deb biladi —
        garchi u ICHIMLIK nima ekanini BILMASA HAM.
```

**M4.** Chunki u **8663 ta ustunni** *(o'lchov)* **5 ta mavzuga** siqadi.

```
Har bir hujjat OLDIN:  8663 ta raqam bilan tasvirlanadi
Har bir hujjat KEYIN:     5 ta raqam bilan tasvirlanadi
```

Ma'lumotning **mohiyati** saqlanadi, **ortiqchasi** tashlanadi.

</details>

### 🔴 Qiyin

**M5.** LSA qidiruvi TF-IDF qidiruvidan nimasi bilan ustun?

**M6.** LSA vaznlari nima uchun manfiy bo'lishi mumkin?

<details>
<summary>✅ Javoblar</summary>

**M5 — SEMANTIK QIDIRUV**

```
TF-IDF:  faqat AYNI so'zni topadi
         "car" ≠ "automobile"  →  ball 0.0  ❌

LSA:     MA'NONI solishtiradi
         "car" va "automobile" bir mavzuda  →  ball 0.71  ✅
```

Bu **24-moduldagi OOV muammosining** qisman yechimi.

**M6.** Chunki SVD — **chiziqli algebra**, ehtimollik emas. Vektorlar **fazoda yo'nalish** ko'rsatadi, va yo'nalish **manfiy** bo'lishi mumkin.

```
Mavzu 1:  +0.62*"trump"  −0.31*"song"
                            ↑
        "song" so'zi bu mavzuga QARAMA-QARSHI —
        ya'ni "song" bor bo'lsa, bu mavzu EHTIMOL EMAS.
```

> ⚠️ Bu — LSA'ni talqin qilishni **LDA'dan qiyinroq** qiladi.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Taqsimot gipotezasi nima deydi?
2. SVD nimaning qisqartmasi?
3. `U` matritsasi nimani ko'rsatadi?
4. `Σ` nimani ko'rsatadi?
5. O'lchovni kamaytirish nima?
6. LSA va LDA farqi nimada?
7. LSA vaznlari ehtimollikmi?

<details>
<summary>✅ Javoblar</summary>

1. **O'xshash ma'noli so'zlar TEZ-TEZ BIRGA uchraydi.**
2. **Singular Value Decomposition.**
3. **Hujjat → mavzu**: qaysi hujjat qaysi mavzuga tegishli.
4. Har bir mavzu **qanchalik muhim** *(o'zgaruvchanlikni qancha tushuntiradi)*.
5. Ko'p ustunni **kam ustunga** siqish. Bizda: **8663 → 5**.
6. **LDA** — ehtimollik, Bag of Words, iterativ, tasodifiy. **LSA** — chiziqli algebra, TF-IDF, bir marta hisoblanadi, deterministik.
7. ## **YO'Q!** Ular **vaznlar** — **manfiy** ham bo'lishi mumkin.

</details>

---

## 📌 Xulosa

```
LSA = Latent Semantic Analysis
      (LSI = Latent Semantic Indexing — BIR XIL narsa)


IKKITA G'OYA

1 · TAQSIMOT GIPOTEZASI
    "O'xshash ma'noli so'zlar BIRGA uchraydi"

    "doctor" qo'shnilari: patient, hospital, nurse
    "nurse"  qo'shnilari: patient, hospital, doctor
              ↑ bir xil davra = bir xil ma'no

2 · SVD — Singular Value Decomposition

        M   =   U    ×   Σ   ×   Vᵀ
        │       │        │       │
     asl     hujjat→   mavzu   mavzu→
    ma'lumot  mavzu     kuchi   so'z


O'LCHOVNI KAMAYTIRISH
    100 × 8663  →  100 × 5
                    99.94% siqildi!


⭐ SEMANTIK QIDIRUV — LSA'ning SUPER KUCHI

    TF-IDF:  "car" ≠ "automobile"  →  0.00  ❌
    LSA:     bir mavzuda            →  0.71  ✅


LDA vs LSA
┌──────────────┬──────────────┬──────────────┐
│              │     LDA      │     LSA      │
├──────────────┼──────────────┼──────────────┤
│ Asosi        │ ehtimollik   │ chiziqli alg.│
│ Kiritish     │ Bag of Words │ TF-IDF       │
│ Natija       │ ehtimol 0-1  │ vazn (± !)   │
│ Tezlik       │ sekinroq     │ TEZROQ       │
│ Barqarorlik  │ tasodifiy    │ DETERMINISTIK│
│ Talqin       │ osonroq      │ qiyinroq     │
│ sklearn      │ LatentDiri.. │ TruncatedSVD │
└──────────────┴──────────────┴──────────────┘
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| LSA / LSI | *Latent Semantic Analysis/Indexing* | Bir xil narsa |
| Taqsimot gipotezasi | *distributional hypothesis* | Birga uchrasa — o'xshash |
| SVD | *singular value decomposition* | Matritsani 3 ga ajratish |
| O'lchovni kamaytirish | *dimensionality reduction* | Ustunlarni siqish |
| Transponirlash | *transpose* | Qator↔ustun almashish |
| Semantik | *semantic* | Ma'noga oid |
| Deterministik | *deterministic* | Har safar bir xil natija |

---

⬅️ [Oldingi: LDA Python'da](04-LDA-in-Python.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: LSA Python'da](06-LSA-in-Python.md)
