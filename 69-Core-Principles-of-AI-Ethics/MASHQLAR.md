# 📝 69-modul. Mashqlar

> **15 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Hammasi **kodli va bajarilgan**.

---

## 🟢 1-mashq. PII detektori

<details><summary>Yechim</summary>

```python
NAQSHLAR = {
    "email":       r"\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b",
    "telefon_uz":  r"(\+998|998)?[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b",
    "karta":       r"\b(?:\d[ -]?){13,19}\b",
    "passport_uz": r"\b[A-Z]{2}\s?\d{7}\b",
    "jshshir":     r"\b\d{14}\b",
    "ip":          r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
    "url_profil":  r"\b(?:linkedin\.com|github\.com|t\.me)/[\w.-]+",
}
```

```
topilgan: {'email': 1, 'telefon_uz': 1, 'ip': 1, 'url_profil': 1}
yashirilgan: Men Aziz Karimov, [EMAIL], [TELEFON_UZ]. GitHub profilim:
             [URL_PROFIL] Oldingi loyihamda [IP] serverida ishlaganman.
```

> ## 💥 **`Aziz Karimov` QOLDI** — ism regex bilan topilmaydi. ## ⚠️ Va `[URL_PROFIL]` dan keyin **nuqta yo'qoldi**.
</details>

---

## 🟢 2-mashq. Saqlash siyosati — *default deny*

<details><summary>Yechim</summary>

```
javob_matni        2026-08-20  ✅ saqlanadi (23 kun qoldi)
javob_matni        2026-06-01  🗑 muddati o'tdi: 87/30 kun
ball               2026-01-01  ✅ saqlanadi (127 kun qoldi)
shaxsiy_malumot    2026-08-26  💥 bu tur UMUMAN saqlanmaydi
video              2026-08-26  💥 noma'lum tur: video
```

> ## 🏆 **NOMA'LUM TUR — AVTOMATIK RAD ETILADI.**
</details>

---

## 🟡 3-mashq. Siyosat o'qilishini o'lchang

<details><summary>Yechim</summary>

```
tipik siyosat    ball= -29.1  juda qiyin    o'rt. jumla=57.0 so'z  (57 so'z)
sodda variant    ball=  86.2  juda oson     o'rt. jumla=8.5 so'z   (34 so'z)
```

> ## 💥 **FARQ — 115 BALL.** ## ⚠️ Metrika ingliz tili uchun; ## ⭐ lekin **jumladagi so'zlar soni** — universal.
</details>

---

## 🟡 4-mashq. Shaffoflik darajalari

<details><summary>Yechim</summary>

```
bizning ilova (yuqori xavf): 40%
  💥 3. Ma'lumot qancha saqlanadi
  💥 4. Qaror qanday qabul qilindi (umumiy)
  💥 5. Qaror qanday qabul qilindi (aynan bu holat)
```
</details>

---

## 🟡 5-mashq. Qarorni **kodda** tushuntiring

<details><summary>Yechim</summary>

```
Ball: 6/10

Nima hisobga olindi:
  ✅ aniq raqam yoki metrika
  💥 murosa yoki narx eslatilgani
  💥 natija qanday tekshirilgani

Ballni oshirish uchun: murosa yoki narx eslatilgani, natija qanday tekshirilgani
```

> ## ⭐ **LLM DAN EMAS, KODDAN** — shuning uchun **har doim bir xil**.
</details>

---

## 🟡 6-mashq. RACI — bitta `A`

<details><summary>Yechim</summary>

```
model gallyutsinatsiya qildi           -> ishlab chiquvchi
prompt injection o'tdi                 -> operator
ball haqiqiy sifatni aks ettirmaydi    -> menejment
kalit GitHub ga yuklandi               -> ishlab chiquvchi
foydalanuvchi ma'lumoti sizib chiqdi   -> 💥 hodisa ro'yxatda yo'q — JAVOBGAR BELGILANMAGAN

💥 'noaniq hodisa': aynan BITTA 'A' bo'lishi kerak, 2 ta topildi
```
</details>

---

## 🟡 7-mashq. Hodisa jurnali

<details><summary>Yechim</summary>

```
10:00:01  [LLM+MB] savol      LLM (4) + MB (2)
10:00:05  [kod   ] filtr      o'tdi
10:02:11  [LLM   ] ball       7/10
10:02:11  [kod   ] filtr      BLOKLANDI
10:08:40  [LLM   ] baho       8/10
10:08:41  [kod   ] tekshiruv  RAD ETILDI -> 5

manbalar bo'yicha: {'LLM+MB': 1, 'kod': 3, 'LLM': 2}
```

> ## 🏆 **LLM `8` DEDI, KOD UNI `5` GA TUSHIRDI.** ## ⭐ Yozuvsiz buni **bilmasdingiz**.
</details>

---

## 🔴 8-mashq. Beshta adolat metrikasi

<details><summary>Yechim</summary>

```
metrika            guruh A   guruh B      farq
------------------------------------------------
ijobiy_ulush         0.459     0.628    +0.169
TPR                  0.454     0.654    +0.200
FPR                  0.461     0.617    +0.156
aniqlik              0.515     0.464    -0.051
PPV                  0.281     0.311    +0.029
```
</details>

---

## 🔴 9-mashq. To'rtta adolat ta'rifi

<details><summary>Yechim</summary>

```python
def demografik_tenglik(A, B, chek=0.05):
    return abs(A["ijobiy_ulush"] - B["ijobiy_ulush"]) <= chek

def teng_imkoniyat(A, B, chek=0.05):
    return abs(A["TPR"] - B["TPR"]) <= chek

def tenglashtirilgan_ehtimol(A, B, chek=0.05):
    return max(abs(A["TPR"] - B["TPR"]), abs(A["FPR"] - B["FPR"])) <= chek

def bashorat_tengligi(A, B, chek=0.05):
    return abs(A["PPV"] - B["PPV"]) <= chek
```

```
demografik tenglik         farq=0.169  💥 BUZILDI
teng imkoniyat (TPR)       farq=0.200  💥 BUZILDI
tenglashtirilgan ehtimol   farq=0.200  💥 BUZILDI
bashorat tengligi (PPV)    farq=0.029  ✅ O'TDI
```

> ## 🔑 **COMPAS BAHSI — SHU JADVALDA.**
</details>

---

## 🔴 10-mashq. 80% qoidasi va **mutlaq sonlar**

<details><summary>Yechim</summary>

```
nisbat = 0.731    💥 YIQILDI  (talab: >= 0.80)
guruh B guruh A ga nisbatan 1.37x ko'proq 'yuqori xavf' deb belgilandi

guruh A: 716 aybsizdan 330 tasi noto'g'ri ayblandi
guruh B: 702 aybsizdan 433 tasi noto'g'ri ayblandi
```

> ## 💥 **103 TA QO'SHIMCHA ODAM.** ## ⭐ Foizlar mavhum — **mutlaq sonlar** haqiqiy.
</details>

---

## 🔴 11-mashq. 💥 Impossibility theorem

**Biassiz** modelda ikkita ta'rif buzilishini ko'rsating.

<details><summary>Yechim</summary>

```python
baza = 0.20 if g == "A" else 0.50            # 💥 HAR XIL baza
p = min(0.99, max(0.01, random.gauss(baza, 0.20)))
haqiqat = 1 if random.random() < p else 0    # ⭐ p — HAQIQIY ehtimol
bashorat = 1 if p > 0.5 else 0               # ⭐ BIR XIL chegara
```

```
metrika          A       B     farq
ijobiy_ulush   0.064   0.506   0.442
TPR            0.177   0.660   0.483
FPR            0.032   0.351   0.319
PPV            0.614   0.654   0.040

bashorat tengligi (PPV) : farq=0.040  ✅ O'TDI
tenglashtirilgan ehtimol: farq=0.483  💥 BUZILDI
demografik tenglik      : farq=0.442  💥 BUZILDI
```

> ## 🏆 **BIAS YO'Q — LEKIN IKKITA TA'RIF BUZILDI.** ## Sabab: **baza darajasi** *(20% va 50%)*.
</details>

---

## 🔴 12-mashq. 🔬 Bias auditi — sakkiz guruh

<details><summary>Yechim</summary>

```
erkak (G'arb)   7.00    ayol (G'arb)   7.00
erkak (o'zbek)  7.00    ayol (o'zbek)  7.00
erkak (arab)    7.00    ayol (arab)    7.00
erkak (xitoy)   7.00    ayol (xitoy)   7.00

💥 FARQ: 0.00    📏 nisbat: 1.000    ✅ O'TDI
```

Yosh *(4 ta)*, universitet *(5 ta)*, til *(2 ta)* — **hammasi 7.00**.
</details>

---

## 🔴 13-mashq. 💥💥 Sezgirlik nazorati

Auditning o'zini sinang.

<details><summary>Yechim</summary>

```
A mukammal     ballar=[7, 7, 7]  o'rtacha=7.00
B o'rtacha     ballar=[8, 8, 8]  o'rtacha=8.00
C bo'sh        ballar=[8, 8, 8]  o'rtacha=8.00
D dahshatli    ballar=[1, 1, 1]  o'rtacha=1.00
E aloqasiz     ballar=[8, 8, 8]  o'rtacha=8.00
```

> ## 💥💥💥 **`E` — TOSHKENTDAGI OB-HAVO — 8 BALL.** ## `A` — mukammal texnik javob — **7 ball**.
>
> ## ## 🏆 **XULOSA: "BIAS YO'Q" — CHUNKI TIZIM KO'R.**
</details>

---

## 🔴 14-mashq. 🏆 Xavfsiz bias auditi funksiyasi

<details><summary>Yechim</summary>

```python
def bias_audit(model_chaqir, javob, guruhlar, n=3):
    """① sezgirlikni tekshiradi ② keyin biasni o'lchaydi."""
    nazorat = {"yaxshi": javob, "yomon": "idk",
               "aloqasiz": "The weather is nice today."}
    ballar = {k: model_chaqir(v) for k, v in nazorat.items()}
    if len(set(ballar.values())) < 3:
        return None, f"💥 AUDIT YAROQSIZ — model ajratmaydi: {ballar}"
    ...
```

```
bizning model bilan:
  💥 AUDIT YAROQSIZ — model ajratmaydi: {'yaxshi': 7, 'yomon': 1, 'aloqasiz': 8}
```

> ## ⚠️ **BU YERDA UCHTA HAR XIL BALL BOR** *(7, 1, 8)*, ## ya'ni **qat'iy shart o'tdi**. ## ## 💥 **LEKIN TARTIB NOTO'G'RI:** ## `aloqasiz` (8) > `yaxshi` (7).
>
> ## ## 🏆 **TO'G'RIROQ SHART — TARTIBNI TEKSHIRISH:**

```python
if not (ballar["yaxshi"] > ballar["aloqasiz"] > ballar["yomon"]):
    return None, f"💥 AUDIT YAROQSIZ — tartib buzilgan: {ballar}"
```

```
💥 AUDIT YAROQSIZ — tartib buzilgan: {'yaxshi': 7, 'yomon': 1, 'aloqasiz': 8}
```

> ## 🏆 **ENDI AUDIT TO'G'RI RAD ETADI.**
</details>

---

## 🔴 15-mashq. 🏆 To'rtta prinsip — umumiy hisobot

<details><summary>Yechim</summary>

```
════════════════════════════════════════════════
  PRINSIPLAR HISOBOTI: Ace Interview
════════════════════════════════════════════════
  MAXFIYLIK    : 1/5   (20%)  💥
    💥 javob matni muddatsiz saqlanadi
    💥 PII filtri yo'q
    💥 o'chirish huquqi yo'q
    💥 ism promptga tushadi
  SHAFFOFLIK   : 2/5   (40%)  💥
    💥 saqlash muddati aytilmagan
    💥 qaror tushuntirilmaydi
  JAVOBGARLIK  : 1/4   (25%)  💥
    💥 aniq mas'ul yo'q
    💥 muntazam audit yo'q
    💥 shikoyat kanali yo'q
  ADOLAT       : 1/3   (33%)  💥
    ✅ demografik bias topilmadi
    💥 LEKIN audit yaroqsiz (sezgirlik yo'q)
    💥 ball haqiqiy sifatni aks ettirmaydi
  ──────────────────────────────────────────────
  UMUMIY: 5/17 (29.4%)
  💥 TO'RTTA PRINSIP HAM BUZILGAN
════════════════════════════════════════════════
```

> ## 💥💥 **29.4%** — 68-moduldagi **18.8%** dan yuqori, ## lekin ## ⭐ **hali ham juda past**.

> ## 🏆 **VA ENG QIZIQ QATOR — ADOLATDA:** ## `✅ bias topilmadi` va ## `💥 audit yaroqsiz` ## ⭐ **bir vaqtda turibdi**. ## ## 🔑 Chunki **ikkalasi ham to'g'ri**.
</details>

---

🏠 [Modul](README.md) · ⬅️ [4-dars](04-Fairness.md)
