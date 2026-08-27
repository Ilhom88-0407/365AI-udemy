# 6-dars. Ma'lumot biasi va adolatli vakillik ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Bizning 1500 savollik bazamiz to'rtta maydondan uchtasida 80% qoidasini o'tdi. Keyin ikkita maydonni birlashtirdik — va yiqildi."**

---

## 1. 💥 Google Photos ishi

> *"Google ning foto teglash AI tizimi qora tanli shaxslar rasmlarini **gorilla** deb noto'g'ri tasniflagani uchun keskin tanqid ostiga tushdi. Bu shundan yuz berdiki, o'quv ma'lumotida **qora tanli shaxslar rasmlari juda kam** edi."*

| Sabab | Oqibat |
|---|---|
| ## **Vakillik yetishmovchiligi** | ## 💥 Model **ba'zi guruhlarda ishlamaydi** |

> ## 🔑 **VA E'TIBOR BERING — MODEL "IRQCHI" QILIB YOZILMAGAN.** ## U shunchaki ## ⭐ **kam ko'rgan narsani tanimaydi**.
>
> ## ## 💥 **NATIJA ESA — BARIBIR ZARARLI.**

---

## 2. ⭐ Kursning uchta maslahati

| # | Maslahat | Amaliy vosita |
|---|---|---|
| ① | ## **Xilma-xil vakillik** | ## ⭐ **Vakillik auditi** |
| ② | ## **Muntazam qayta ko'rish** | 68-modul: **6 oy** |
| ③ | ## **Jamoani jalb qilish** | Foydalanuvchi guruhlari |

---

## 3. 🔬 Vakillik auditi — **bizning 1500 savol**

```python
def vakillik(yozuvlar, maydon):
    s = collections.Counter(y[maydon] for y in yozuvlar)
    jami = sum(s.values())
    ideal = jami / len(s)
    return s, min(s.values()) / max(s.values()), ideal
```

### ✅ Haqiqiy natija

```
  daraja       turlar= 3  nisbat=0.924 ✅  eng kam=Senior (476)
  lavozim      turlar= 5  nisbat=0.886 ✅  eng kam=Financial Analyst (288)
  kompaniya    turlar= 8  nisbat=0.856 ✅  eng kam=None (173)
  kategoriya   turlar= 8  nisbat=0.446 💥  eng kam=analytical (135)
```

> ## ✅ **UCHTA MAYDON 80% QOIDASINI O'TDI.**
>
> ## ## 💥 **`kategoriya` — 0.446.** ## Sabab: HR va texnik intervyu ## **turli kategoriyalarga** ega, ## ⭐ va ba'zilari **faqat bittasida** uchraydi.

---

## 4. 💥💥 **KESISHMA (intersectional) tekshiruvi**

> ## 🔑 **HAR MAYDON ALOHIDA YAXSHI BO'LSA HAM,** ## ularning **kombinatsiyasi** yomon bo'lishi mumkin.

```python
kesishma = collections.Counter(
    (y["daraja"], y["lavozim"]) for y in savollar)
```

### ✅ Haqiqiy natija

```
  kombinatsiyalar: 15
  eng kam: ('Senior', 'Data Engineer') = 82 savol
  eng ko'p: ('Mid-level', 'ML Engineer') = 115 savol
  nisbat: 0.713  💥
```

> ## 💥💥💥 **`daraja` 0.924, `lavozim` 0.886 — IKKALASI HAM O'TDI.** ## ## 💥 **KOMBINATSIYA ESA — 0.713. YIQILDI.**

> ## 🔑 **VA BU — VAKILLIK AUDITINING ASOSIY DARSI:** ## ⭐ **marginal tenglik kesishma tengsizligini yashiradi**.
>
> ## ## 💡 **AMALIY MA'NOSI:** ## *"Senior Data Engineer"* nomzod uchun ## bizda **eng kam savol** bor — ## ya'ni uning intervyusi ## 💥 **eng sifatsiz** bo'ladi.

---

## 5. 🔧 To'liq vakillik auditi

```python
def vakillik_auditi(yozuvlar, maydonlar, chek=0.80):
    """Marginal VA kesishma tekshiruvi."""
    natija = {"marginal": {}, "kesishma": {}}

    for m in maydonlar:                                     # marginal
        s = collections.Counter(y[m] for y in yozuvlar)
        natija["marginal"][m] = (min(s.values()) / max(s.values()),
                                 min(s, key=s.get), min(s.values()))

    for i, a in enumerate(maydonlar):                       # kesishma (juftlik)
        for b in maydonlar[i + 1:]:
            s = collections.Counter((y[a], y[b]) for y in yozuvlar)
            natija["kesishma"][f"{a} x {b}"] = (
                min(s.values()) / max(s.values()),
                min(s, key=s.get), min(s.values()))

    yiqilgan = [k for d in natija.values() for k, v in d.items() if v[0] < chek]
    return natija, yiqilgan
```

```python
n, yiqilgan = vakillik_auditi(savollar, ["daraja", "lavozim", "intervyu"])
for tur, d in n.items():
    print(f"  --- {tur} ---")
    for k, (nisbat, eng_kam, son) in sorted(d.items(), key=lambda x: x[1][0]):
        print(f"    {k:26} {nisbat:.3f} {'✅' if nisbat >= 0.80 else '💥'}  "
              f"eng kam: {eng_kam} ({son})")
print(f"\n  yiqilgan: {yiqilgan}")
```

### ✅ Haqiqiy natija

```
  --- marginal ---
    lavozim                    0.886 ✅  eng kam: Financial Analyst (288)
    daraja                     0.924 ✅  eng kam: Senior (476)
    intervyu                   0.995 ✅  eng kam: texnik (748)
  --- kesishma ---
    daraja x lavozim           0.713 💥  eng kam: ('Senior', 'Data Engineer') (82)
    lavozim x intervyu         0.764 💥  eng kam: ('BI Analyst', 'texnik') (139)
    daraja x intervyu          0.877 ✅  eng kam: ('Senior', 'texnik') (229)

  yiqilgan: ['daraja x lavozim', 'lavozim x intervyu']
```

> ## 🏆🏆 **UCHTA MARGINAL — UCHTASI HAM O'TDI.** ## ## 💥 **UCHTA KESISHMA — IKKITASI YIQILDI.**

> ## 🔑 **AGAR SIZ FAQAT MARGINAL TEKSHIRSANGIZ —** ## ⭐ **hech qanday muammo ko'rmaysiz**.

---

## 6. ⚠️ Va **uch tomonlama** kesishma?

```
  daraja x lavozim x intervyu   0.529 💥  eng kam: ('Senior','BI Analyst','texnik') (36)
```

> ## 💥💥 **0.529 — IKKI O'LCHOVLI 0.713 DAN HAM YOMONROQ.**
>
> ## ## 🔑 **NAQSH AYON:** ## ⭐ **o'lchov qancha ko'p bo'lsa, ## vakillik shuncha yomon.**

> ## ⚠️ **VA BU — MATEMATIK MUQARRARLIK:** ## `n` ta o'lchov, har birida `k` ta qiymat = ## `k^n` guruh, ## ma'lumot esa **bir xil** qoladi.
>
> ## ## 🏆 **AMALIY QOIDA:** ## eng muhim **2–3 o'lchovni** tanlang ## va **o'shalarda** kafolat bering.

---

## 7. 🏆 Nima qilish kerak?

| Muammo | Yechim | Narx |
|---|---|---|
| Kam guruh | ## ⭐ **Ko'proq ma'lumot yig'ish** | Vaqt, pul |
| Kam guruh | ## **Qayta tortish** *(reweighting)* | ⚠️ Overfitting xavfi |
| Kam guruh | Sun'iy ma'lumot | ## 💥 **Bias ko'chishi mumkin** |
| ## **Kesishma** | ## 🏆 **O'lchovlarni kamaytirish** | ## ⭐ Soddaroq model |
| Hamma | ## 🏆 **HALOL E'LON QILISH** | ## ⭐ **Bepul** |

> ## 💡 **OXIRGI QATOR — ENG ARZONI VA ENG KAM QILINADIGANI:**

```python
def vakillik_elon(natija, yiqilgan):
    q = ["Ma'lumot to'plamining vakilligi:", ""]
    for tur, d in natija.items():
        for k, (nisbat, eng_kam, son) in sorted(d.items(), key=lambda x: x[1][0]):
            belgi = "✅" if nisbat >= 0.80 else "⚠️"
            q.append(f"  {belgi} {k}: {nisbat:.2f} (eng kam: {eng_kam}, {son} yozuv)")
    if yiqilgan:
        q += ["", "⚠️ MA'LUM CHEKLOV: quyidagi guruhlarda model sifati "
                  "pastroq bo'lishi mumkin:"]
        q += [f"    - {k}" for k in yiqilgan]
    return "\n".join(q)
```

> ## 🏆 **BU MATN — MODEL KARTASIGA KIRADI** *(69-modul)*. ## ⭐ Foydalanuvchi **nimani kutishini** biladi.

---

## 8. 🔬 Kursning uchinchi maslahati — **jamoani jalb qilish**

> *"Alexa yoki Siri kabi AI ovozli yordamchilar **turli mintaqa aksentlarini** tushunishda qiynalgan. Ma'lumot yig'ish paytida **xilma-xil foydalanuvchi guruhlari** bilan ishlash orqali bu tizimlar hamma uchun yaxshi ishlashi mumkin."*

> ## 🔑 **VA BIZDA HAM SHU MUAMMO BOR** *(66-modul)*: ## model **o'zbekcha javobni** ## ⭐ inglizcha bilan **bir xil** baholadi — ## 💥 lekin bu **sezgirlik yo'qligidan** edi *(69-modul)*.

### ⭐ Amaliy qadam

```python
SINOV_GURUHLARI = {
    "ingliz ona tili":     ["I reduced latency from 800ms to 120ms."],
    "ingliz ikkinchi til": ["I make the latency to become 120ms from 800ms."],
    "o'zbek":              ["Kechikishni 800 ms dan 120 ms ga tushirdim."],
    "qisqa uslub":         ["Latency: 800ms -> 120ms. int8. A/B tested."],
    "batafsil uslub":      ["First I profiled... then I applied... finally..."],
}
```

> ## 💡 **BESH GURUH — VA HAR BIRIDA `n >= 30` O'LCHOV.** ## ## 🏆 Bu — 69-moduldagi bias auditining ## ⭐ **til va uslub versiyasi**.

---

## 🎯 Nazorat savollari

1. Google Photos ishining sababi nima?
2. Bizning bazamizda qaysi maydon 80% qoidasini yiqitdi?
3. Marginal va kesishma tekshiruvi qanday farq qildi?
4. Nega uch tomonlama kesishma yomonroq?
5. Eng arzon yechim qaysi?

<details>
<summary>Javoblar</summary>

1. ## **Vakillik yetishmovchiligi** — o'quv ma'lumotida qora tanli shaxslar rasmlari **juda kam** edi. 🔑 Model *"irqchi qilib yozilmagan"* — u **kam ko'rgan narsani tanimaydi**. 💥 Natija esa **baribir zararli**.
2. ## `kategoriya` — **0.446**. ⭐ Sabab: HR va texnik intervyu **turli kategoriyalarga** ega.
3. ## **Marginal: 3/3 o'tdi** *(0.886, 0.924, 0.995)*. 💥 **Kesishma: 2/3 yiqildi** — `daraja × lavozim` **0.713**, `lavozim × intervyu` **0.764**. 🔑 Marginal tenglik kesishma tengsizligini **yashiradi**.
4. ## **Matematik muqarrarlik:** `n` o'lchov × `k` qiymat = `k^n` guruh, ma'lumot esa **bir xil**. O'lchandi: ikki o'lchovli **0.713**, uch o'lchovli — **0.529**.
5. ## **Halol e'lon qilish** — bepul. ⭐ Model kartasiga *"quyidagi guruhlarda sifat pastroq"* deb yozish.

</details>

---

⬅️ [5-dars](05-Sensitive-Information.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
