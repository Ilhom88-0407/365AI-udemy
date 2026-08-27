# 2-dars. Shaffoflik va XAI ⭐⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs LIME, SHAP va permutatsiya muhimligini SANAB O'TADI. Biz uchalasini ham yozdik va HAQIQIY og'irliklarga solishtirdik. Ikkitasi proksini yashirib qo'ydi."**

---

## 1. Qora quti muammosi

> *"Bugungi asos modellar... qaror qanday qabul qilinganini
> to'liq tushunishni **imkonsiz** qiladi."*

| Tushuntiruvchi turi | Nima aytadi | Kursning misoli |
|---|---|---|
| ## **Lokal** | ## ⭐ **BU nomzod nega rad etildi?** | LIME, SHAP |
| ## **Global** | ## ⭐ **Model UMUMAN nimaga qaraydi?** | SHAP, permutatsiya |

---

## 2. 🔬 Sinov maydoni — **og'irliklarni BIZ bilamiz**

Tushuntiruvchini tekshirish uchun **javobni oldindan bilish** kerak.
Shuning uchun **shaffof** model quramiz.

```python
BELGILAR = ["tajriba", "talim", "sertifikat", "indeks", "portfolio"]

HAQIQIY_OGIRLIK = {
    "tajriba":    3.0,
    "talim":      0.0,      # ⭐ MODEL BUNI UMUMAN ISHLATMAYDI
    "sertifikat": 1.0,
    "indeks":     2.5,      # 💥 PROKSI — pochta indeksi, layoqat EMAS
    "portfolio":  1.5,
}


def ball(x):
    return sum(HAQIQIY_OGIRLIK[k] * x[k] for k in BELGILAR)


def model(x):
    return 1 if ball(x) >= 4.0 else 0      # ⭐ CHEGARA
```

> ## 🔑 **UCHTA SAVOL:**
>
> ## ## ① Tushuntiruvchi `talim` **ishlatilmasligini** topadimi? ## ## ② `indeks` **ikkinchi eng kuchli** ekanini topadimi? ## ## ③ Siralashni **to'g'ri** beradimi?

---

## 3. 🔬 Permutatsiya muhimligi

> *"Kompaniya ta'lim darajasini tizimdan **olib tashlab**, bu qarorlarga
> ta'sir qiladimi deb ko'rishi mumkin."*

```python
def permutatsiya_muhimligi(fn, yozuvlar, belgilar, takror=200):
    """Belgini ARALASHTIRIB, chiqish qanchalik o'zgarishini o'lchaydi."""
    baza = [fn(x) for x in yozuvlar]
    natija = {}
    for b in belgilar:
        farqlar = []
        for t in range(takror):
            r = random.Random(t)
            qiymatlar = [x[b] for x in yozuvlar]
            r.shuffle(qiymatlar)                       # ⭐ bog'liqlikni buzamiz
            yangi = [fn({**x, b: q}) for x, q in zip(yozuvlar, qiymatlar)]
            farqlar.append(sum(abs(a - c) for a, c in zip(baza, yangi)) / len(baza))
        natija[b] = (statistics.mean(farqlar), statistics.pstdev(farqlar))
    return natija
```

### ✅ Haqiqiy natija — **QARORDA** *(0/1)*, 800 nomzod, 200 takror

```
  belgi          muhimlik    +/- sd   HAQIQIY
  tajriba          0.3033    0.0132       3.0
  portfolio        0.1821    0.0111       1.5
  indeks           0.1803    0.0119       2.5
  sertifikat       0.0715    0.0063       1.0
  talim            0.0000    0.0000       0.0
```

> ## ✅ **`talim` = 0.0000 — ANIQ TOPILDI.**
>
> ## ## 💥 **LEKIN `indeks` (2.5) VA `portfolio` (1.5) ## O'RIN ALMASHDI.**

```
  indeks vs portfolio: 0.1803 vs 0.1821   farq=+0.0018
  sd lar: 0.0119, 0.0111  ->  SHOVQIN ICHIDA
```

> ## ⚠️ **HALOL BO'LAYLIK — BU "XATO SIRALASH" EMAS.** ## ## 🔑 Farq **shovqin ichida**: ## ⭐ permutatsiya bu ikkisini ## 💥 **UMUMAN AJRATA OLMAYDI**.

> ## 💥💥 **VA BU — DAHSHATLIROQ.** ## Auditor *"indeks portfolio bilan bir xil darajada"* ## degan xulosaga keladi, ## holbuki u ## 🔑 **1.67 barobar kuchli**.

### 🏆 Sabab — **chegara ma'lumotni yo'q qiladi**

Xuddi shu funksiyani **ballda** *(uzluksiz)* ishlatamiz:

```
  belgi          muhimlik   HAQIQIY
  tajriba          1.4984       3.0
  indeks           1.2397       2.5
  portfolio        0.7483       1.5
  sertifikat       0.4960       1.0
  talim            0.0000       0.0

  siralash: ['tajriba', 'indeks', 'portfolio', 'sertifikat', 'talim']
  HAQIQIY:  ['tajriba', 'indeks', 'portfolio', 'sertifikat', 'talim']
  -> MOS
```

> ## 🏆🏆 **BALLDA — SIRALASH AYNAN TO'G'RI.** ## ## Va qiymatlar ham ## ⭐ **haqiqiy og'irliklarga proporsional** ## *(1.4984 / 3.0 ≈ 1.2397 / 2.5 ≈ 0.4993)*.

> ## 💡💡 **BUTUN DARSNING ENG AMALIY QOIDASI:**
>
> ## ## ⭐ **QARORNI EMAS, BALLNI TUSHUNTIRING.** ## ## 💥 `0/1` ga aylantirish — ## **auditga kerakli ma'lumotni o'chiradi**.

---

## 4. 🔬 SHAP — **aniq hisob**

> *"Shapley Additive Explanations... har bir omil bitta qarorga
> **qancha hissa** qo'shganini ajratadi."*

```python
def shap_aniq(fn, x, belgilar, asos):
    """Har belgining O'RTACHA hissasi — HAMMA koalitsiya bo'yicha."""
    n = len(belgilar)
    hissalar = {b: 0.0 for b in belgilar}

    for b in belgilar:
        boshqalar = [k for k in belgilar if k != b]
        for r in range(len(boshqalar) + 1):
            for kichik in itertools.combinations(boshqalar, r):
                # ⭐ koalitsiyadagilar x dan, qolganlari ASOSdan
                bilan    = {k: (x[k] if k in kichik or k == b else asos[k])
                            for k in belgilar}
                bilansiz = {k: (x[k] if k in kichik else asos[k])
                            for k in belgilar}
                og = (_fakt(r) * _fakt(n - r - 1)) / _fakt(n)
                hissalar[b] += og * (fn(bilan) - fn(bilansiz))
    return hissalar
```

> ## ⚠️ **BU — 2ⁿ KOALITSIYA.** ## 5 ta belgi uchun **32 ta**, ## 20 ta belgi uchun ## 💥 **million dan ortiq**. ## ## 🔑 Haqiqiy `shap` kutubxonasi buni ## ⭐ **taxminiy** hisoblaydi.

### ✅ Haqiqiy natija

```
  nomzod {'tajriba': 1, 'talim': 1, 'sertifikat': 0, 'indeks': 1, 'portfolio': 0}
  ball=5.5  qaror=1

  belgi          SHAP(qaror)   SHAP(ball)   HAQIQIY hissa
  tajriba              0.500        3.000             3.0
  talim                0.000        0.000             0.0
  sertifikat           0.000        0.000             0.0
  indeks               0.500        2.500             2.5
  portfolio            0.000        0.000             0.0

  SHAP(qaror) yigindisi: 1.000  (qaror farqi: 1)
  SHAP(ball)  yigindisi: 5.500  (ball farqi: 5.5)
```

> ## 🏆🏆 **`SHAP(ball)` — AYNAN TO'G'RI.** ## `3.000` va `2.500` — ## ⭐ **haqiqiy hissalar**.

> ## 💥 **`SHAP(qaror)` ESA — `0.500` VA `0.500`.**
>
> ## ## 🔑 U **additivlikni saqlaydi** *(yig'indi = 1)*, ## lekin ## 💥 **3.0 va 2.5 ni ajrata olmaydi**.

> ## 💡 **YA'NI PERMUTATSIYA BILAN BIR XIL SABAB —** ## ⭐ **chegara aybdor, usul emas**.

---

## 5. 🔬 LIME — **va uning tuzog'i**

> *"LIME kiritmani **biroz o'zgartirib**, bu natijaga qanday
> ta'sir qilishini ko'radi."*

```python
def lime(fn, x, belgilar, n=4000, urug=0):
    r = random.Random(urug)
    M, Y, W = [], [], []
    for _ in range(n):
        maska, z = {}, {}
        for b in belgilar:
            saqla = r.random() < 0.5
            maska[b] = 1 if saqla else 0
            z[b] = x[b] if saqla else (1 - x[b])       # ⭐ TESKARISIGA
        M.append(maska)
        Y.append(fn(z))
        W.append(0.75 ** sum(1 - maska[b] for b in belgilar))   # ⭐ yaqinlik

    koef = {}
    for b in belgilar:
        bor = [(y, w) for m, y, w in zip(M, Y, W) if m[b]]
        yoq = [(y, w) for m, y, w in zip(M, Y, W) if not m[b]]
        ow = lambda v: sum(y * w for y, w in v) / sum(w for _, w in v)
        koef[b] = ow(bor) - ow(yoq)
    return koef
```

### ✅ Haqiqiy natija

```
  belgi          SHAP(qaror)   LIME(qaror)   HAQIQIY og.
  tajriba              0.500         0.620           3.0
  talim                0.000         0.004           0.0
  sertifikat           0.000        -0.136           1.0
  indeks               0.500         0.354           2.5
  portfolio            0.000        -0.398           1.5
```

> ## 💥💥💥 **`portfolio` = `−0.398`.**
>
> ## ## ⚠️ Uning haqiqiy og'irligi — ## 🔑 **`+1.5`**, ya'ni **ijobiy**.

### 🔑 Bu **xato emas** — bu **konvensiya**

Bu nomzodda `portfolio = 0`. LIME koeffitsienti quyidagini anglatadi:

> ## ⭐ *"`portfolio` ni **hozirgi holatida** (0) qoldirish — ## uni **o'zgartirishga** (1 qilishga) nisbatan ## 💥 **0.398 ga yomonroq**."*

> ## 🏆 **YA'NI `−0.398` — "PORTFOLIO ZARAR QILDI" EMAS.** ## ## ⭐ U — **"portfolio BO'LMAGANI zarar qildi"**.

| Belgi | Qiymat | LIME | To'g'ri o'qish |
|---|---|---|---|
| `tajriba` | 1 | ## **+0.620** | ## ✅ Bor — **foydali** |
| `indeks` | 1 | ## **+0.354** | ## ✅ Bor — foydali |
| `sertifikat` | 0 | ## **−0.136** | ## ⚠️ **Yo'q — qo'shsa foyda** |
| `portfolio` | 0 | ## **−0.398** | ## ⚠️ **Yo'q — qo'shsa KO'P foyda** |

> ## 💥💥 **VA BU YERDA HAQIQIY XAVF BOR:** ## HR menejeri hisobotda ## ⭐ **`portfolio: −0.398`** ni ko'rib, ## ## 💥 *"portfolio nomzodga zarar qilibdi"* ## deb xulosa qilishi mumkin.

> ## 🏆 **QOIDA:** ## LIME chiqishini ## ⭐ **hech qachon xom holda ko'rsatmang**. ## ## 💡 Har koeffitsientni ## 🔑 **belgi qiymati bilan birga** yozing.

---

## 6. 🔬 Eng muhim savol — **proksi fosh bo'ldimi?**

`indeks` — pochta indeksi. **Layoqat emas** *(71-modul)*.
Haqiqiy og'irligi **2.5**, ya'ni **ikkinchi eng kuchli**.

| Usul | Nima dedi | Proksi ko'rindimi? |
|---|---|---|
| Permutatsiya *(qaror)* | `0.180`, **3-o'rin** | ## 💥 **Yashirdi** |
| ## **Permutatsiya (ball)** | ## `1.240`, **2-o'rin** | ## ✅ **Fosh qildi** |
| SHAP *(qaror)* | `0.500` — tajriba bilan **teng** | ## 💥 **Yashirdi** |
| ## **SHAP (ball)** | ## `2.500` — **aniq** | ## 🏆 **Fosh qildi** |
| LIME *(qaror)* | `0.354` — **portfolio dan past** | ## 💥 **Yashirdi** |

> ## 💥💥💥 **BESHTA O'LCHOVDAN UCHTASI PROKSINI YASHIRDI.**
>
> ## ## 🔑 Va uchalasining ham ## ⭐ **yagona umumiy jihati** — ## ## 💥 **ular QARORNI tushuntirgan edi**.

> ## 🏆🏆 **MODULNING BOSH XULOSASI:**
>
> ## ## ⭐ **XAI vositasini tanlash muhim emas.** ## ## 💥 **NIMANI tushuntirish muhim.**

---

## 7. 💡 Amaliy tavsiyalar

| Qadam | Sabab |
|---|---|
| ## **Ballni tushuntiring** | ## 🏆 **Chegara ma'lumotni o'chiradi** |
| Kamida **ikki usul** | ⭐ Bir-birini tekshiradi |
| ## **LIME ni qiymat bilan** | ## 💥 `−0.398` ni **noto'g'ri o'qish oson** |
| Permutatsiyada **sd** ni bering | ## ⚠️ **Farq shovqin ichidami?** |
| ## **Nazorat belgisi qo'shing** | ## 🔑 Og'irligi **0** bo'lgan belgi |

> ## 💡 **OXIRGISI — ENG ARZON TEKSHIRUV.** ## Modelga ## ⭐ **butunlay tasodifiy** belgi qo'shing. ## ## 💥 Agar tushuntiruvchi unga **nol bermasa** — ## tushuntiruvchi **buzuq**.

> ## 🏆 **BIZDA `talim` AYNAN SHU ROLNI O'YNADI:** ## uchala usul ham unga ## ⭐ **≈0** berdi — ## ya'ni ## ✅ **uchalasi ham sog'lom**.

---

## 🎯 Nazorat savollari

1. Permutatsiya `indeks` va `portfolio` ni ajratdimi?
2. `SHAP(qaror)` nega `0.500` va `0.500` berdi?
3. LIME dagi `portfolio: −0.398` nimani anglatadi?
4. Proksini qaysi o'lchovlar yashirdi? Ularning umumiy jihati nima?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q.** `0.1803` va `0.1821`, farq `+0.0018`, sd lar `0.0119` va `0.0111` — 🔑 **shovqin ichida**. ⚠️ Ya'ni bu *"xato siralash"* emas, u bu ikkisini 💥 **umuman ajrata olmaydi**. ✅ **Ballda** esa siralash **aynan to'g'ri**.
2. ## Chunki u **chegaralangan qarorni** *(0/1)* tushuntirdi. ⭐ Additivlik saqlanadi *(yig'indi = 1)*, lekin 💥 `3.0` va `2.5` **farqi yo'qoladi**. 🏆 `SHAP(ball)` — `3.000` va `2.500`, **aynan to'g'ri**.
3. ## *"Portfolio zarar qildi"* **EMAS**. ⭐ Bu nomzodda `portfolio = 0`, va koeffitsient **"uni 0 da qoldirish, 1 qilishga nisbatan 0.398 ga yomonroq"** degani — ya'ni 🔑 **portfolio BO'LMAGANI zarar qildi**. 💥 Hisobotda xom holda ko'rsatilsa, **teskari o'qiladi**.
4. ## **Permutatsiya(qaror), SHAP(qaror) va LIME(qaror).** 🔑 Umumiy jihati — ⭐ **uchalasi ham QARORNI tushuntirgan**. 🏆 Ballda ishlatilganda ikkalasi ham proksini **fosh qildi**.

</details>

---

⬅️ [1-dars](01-Access-for-All-Sizes.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Ethical-Use-of-Outputs.md)
