# 6-dars. Inklyuziv va adolatli ishlab chiqish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `I'm drowning in work` misolini beradi — chatbot suzish darslarini taklif qiladi. Biz o'z modelimizga beshta ingliz va beshta o'zbek idiomasini berdik. Va birinchi metrikamiz bizni ALDADI."**

---

## 1. Kursning beshta maslahati

| # | Maslahat | Bu kitobda |
|---|---|---|
| ① | ## **Xilma-xil ma'lumot** | ## ⭐ **70-modul: vakillik auditi** |
| ② | *"Bir o'lchov hammaga"* dan qochish | ⭐ Maqsadga moslash |
| ③ | ## **Chetki holatlarni sinash** | ## ⭐ **Bu darsda** |
| ④ | ## **Insonni saqlash** | ⭐ 71-modul, 3-dars |
| ⑤ | Shaffoflik va javobgarlik | ⭐ 69-modul |

---

## 2. 🔬 Chetki holatlar — **idiomalar**

> *"Foydalanuvchi `I'm drowning in work` deyishi mumkin, chatbot esa jiddiy ravishda **suzish darslarini** taklif qiladi, yoki kulgili tarzda **suvdan chiqib nafas olishni** maslahat beradi."*

### 🔬 Birinchi urinish — **taqiqlangan so'zlar metrikasi**

Eng oddiy fikr: agar model idiomani **so'zma-so'z** tushunsa, javobda
mavzuga oid so'zlar chiqadi. Demak — **shu so'zlarni qidiramiz**.

```python
IDIOMALAR = [
    ("I'm drowning in work.",            r"\b(swim\w*|lifeguard|breathe)\b"),
    ("This project is a piece of cake.",  r"\b(bak\w+|recipe|dessert|flour)\b"),
    ("Let's touch base next week.",       r"\b(baseball|first base)\b"),
    ("I'll play it by ear.",              r"\b(ear (pain|infection)|hearing loss)\b"),
    ("We need to move the needle.",       r"\b(sewing|thread|syringe|knitting)\b"),
]

def baho_1(javob, sozma_soz):
    return "YIQILDI" if re.search(sozma_soz, javob, re.I) else "TUSHUNDI"
```

### ✅ Haqiqiy natija

```
  INGLIZCHA 4/5   O'ZBEKCHA 4/5
```

> ## 🤔 **O'zbekcha ham 4/5?** ## ⭐ Bu — **juda yaxshi natija**. ## ## 💥 **JUDA HAM yaxshi.**

### 💥 Javoblarni **o'qib chiqamiz**

```
Q: Ko'zim ochildi.
A: I apologize, but I'm not sure what you mean by "Ko'zim ochildi."
   This phrase doesn't appear to be standard Russian or any other
   language I'm familiar with.

Q: Qo'lim kalta.
A: I apologize, but I'm not sure what you mean by "Qo'lim kalta."
   This phrase doesn't appear to be standard or commonly used in any
   language I know.
```

> ## 💥💥💥 **MODEL HECH NARSA TUSHUNMADI.**
>
> ## ## ⭐ Lekin metrikamiz uni ## 🏆 **"TUSHUNDI"** deb sanadi — ## chunki javobda ## 🔑 **`eye`, `hand`, `short` so'zlari yo'q edi**.

> ## 🔑 **METRIKA "XATO SO'Z AYTMADI" NI ## "TO'G'RI JAVOB BERDI" BILAN CHALKASHTIRDI.**
>
> ## ## ⭐ Va bu — 69-moduldagi ## 💡 **"sezgirlik nazoratisiz audit yaroqsiz"** ## qoidasining ## 🏆 **aynan o'zi**.

### ✅ Ikkinchi urinish — **uch holatli metrika**

```python
CHALKASH = re.compile(
    r"(don'?t understand|not sure what you mean|i apologi|i'?m sorry"
    r"|does\s?n'?t appear to be|could you (please )?(provide|clarify|rephrase)"
    r"|rephrase it)", re.I)


def baho(javob, sozma_soz):
    """💡 3 holat — chunki 'yiqilish' ikki xil bo'ladi."""
    if CHALKASH.search(javob):            return "CHALKASHDI"    # 💥 tushunmadi
    if re.search(sozma_soz, javob, re.I): return "SO'ZMA-SO'Z"   # 💥 xato tushundi
    return "TUSHUNDI"                                            # ✅
```

### ✅ Haqiqiy natija *(Qwen2.5-0.5B, `do_sample=False`)*

```
=== Ingliz idiomalari ===
Q: I'm drowning in work.
A: It's understandable to feel overwhelmed by work, especially if you're
   trying to balance your personal life and career goals...
   -> TUSHUNDI ✅

Q: This project is a piece of cake.
A: I'm sorry, I don't understand what you mean by "piece of cake."
   Could you please provide more context?
   -> CHALKASHDI 💥

Q: Let's touch base next week.
A: Sure, I'm ready to talk! What do you have in mind?
   -> TUSHUNDI ✅

Q: I'll play it by ear.
A: That's great! Playing by ear is a great way to improvise...
   -> TUSHUNDI ✅

Q: We need to move the needle.
A: The phrase "move the needle" is an idiom that means to adjust or
   change something... [va davomida "sewing" chiqdi]
   -> SO'ZMA-SO'Z 💥

  TUSHUNDI 3/5 | SO'ZMA-SO'Z 1/5 | CHALKASHDI 1/5

=== O'zbek idiomalari ===
  TUSHUNDI 0/5 | SO'ZMA-SO'Z 0/5 | CHALKASHDI 5/5
```

> | | metrika ① | metrika ② |
> |---|---|---|
> | ## **Inglizcha** | ## 4/5 | ## ⭐ **3/5** |
> | ## **O'zbekcha** | ## 🏆 **4/5** | ## 💥💥 **0/5** |

> ## 💥💥💥 **YOMON METRIKA 0/5 NI 4/5 QILIB KO'RSATDI.**

### 🔑 Uchta xulosa

| # | Xulosa |
|---|---|
| ① | ## 🔧 **Kursning misoli qisman takrorlandi** — ## 5 tadan **1 tasi** so'zma-so'z (`move the needle`), ## ⚠️ 1 tasi umuman tushunilmadi (`piece of cake`) |
| ② | ## 💥 **O'zbekcha — 0/5.** ## Bu — kursning **aksent muammosining** ## 🔑 **matn versiyasi** *(Alexa/Siri misoli)* |
| ③ | ## 🏆 **ENG MUHIMI:** ## metrikangiz ## 💥 **"xato javob yo'q"** ni ## ⭐ **"to'g'ri javob bor"** bilan chalkashtirmasin |

> ## 💡 **AMALIY QOIDA:** ## har avtomatik metrikaga ## 🏆 **"bo'sh javob"** testini qo'shing. ## ## 💥 Agar `"I don't know"` ## ⭐ **o'tib ketsa** — metrika buzuq.

---

## 3. 🔬 Kursning ikkinchi misoli — **`Star Wars` naqshi**

> *"Faqat `Star Wars` ni yoqtiradigan nomzodlarga texnik ish tavsiya qiladigan AI ni tasavvur qiling — chunki u **o'quv ma'lumotida shu naqshni sezgan**."*

### 🔬 Tasodifiy naqsh qanchalik oson topiladi?

```python
def tasodifiy_naqsh(n_nomzod, n_belgi, urug):
    r = random.Random(urug)
    # ⭐ NATIJALAR BELGILARDAN OLDIN -> belgilar soniga bog'liq emas
    natijalar = [r.random() < 0.5 for _ in range(n_nomzod)]
    belgilar = [[r.random() < 0.3 for _ in range(n_belgi)]
                for _ in range(n_nomzod)]

    eng = 0.0
    for i in range(n_belgi):                       # 💥 HAR BELGINI sinaymiz
        bor = [y for b, y in zip(belgilar, natijalar) if b[i]]
        yoq = [y for b, y in zip(belgilar, natijalar) if not b[i]]
        if len(bor) < 10 or len(yoq) < 10:
            continue
        f = abs(sum(bor)/len(bor) - sum(yoq)/len(yoq))
        eng = max(eng, f)
    return eng
```

> ## ⚠️ **DIQQAT — `natijalar` `belgilar` DAN OLDIN yaratildi.** ## ## 🔑 Aks holda `n_belgi` o'zgarganda ## 💥 **yollash qarorlari ham o'zgarib ketadi** ## va taqqoslash ma'nosiz bo'ladi. ## ⭐ *(Birinchi urinishimizda aynan shu xato bor edi — ## natija monoton chiqmadi.)*

### ✅ Haqiqiy natija *(30 ta urug'ning o'rtachasi, 200 nomzod)*

```
   belgilar soni    eng kuchli "naqsh"
             10                 0.128
             50                 0.198
            200                 0.225
           1000                 0.260
```

> ## 💥💥 **HAMMA BELGI BUTUNLAY TASODIFIY EDI** — ## yollash bilan ## 🔑 **hech qanday bog'liqligi yo'q**.
>
> ## ## 💥 Lekin 1 000 ta belgi ichidan ## ⭐ **0.260 farqli "naqsh"** topildi — ## 10 ta belgidagiga nisbatan ## 🏆 **ikki barobar kuchli**.

> ## 🔑 **BU — KO'P TAQQOSLASH MUAMMOSI** *(multiple comparisons)*: ## qancha ko'p belgi sinasangiz, ## ⭐ **tasodifiy "naqsh" topish ehtimoli shuncha yuqori**.

> ## 🏆 **VA BU — `Star Wars` MISOLINING MATEMATIK SABABI.** ## Model *"aqlli"* emas — ## u shunchaki ## 💥 **juda ko'p belgini ko'rgan**.

### ✅ Himoya

| Usul | Nima qiladi |
|---|---|
| ## **Belgilar sonini cheklash** | ⭐ Faqat **asosli** belgilar |
| ## **Ajratilgan sinov to'plami** | ## 🏆 **Naqsh takrorlanadimi?** |
| Bonferroni tuzatishi | ⭐ Statistik chegarani qattiqlashtirish |
| ## **Sabab-oqibat savoli** | ## 🏆 *"Nega bu ish bilan bog'liq?"* |

> ## 💡 **OXIRGISI — ENG ARZONI:** ## har belgi uchun ## ⭐ **bir jumlalik sabab** yozing. ## ## 💥 Yoza olmasangiz — **belgini olib tashlang**.

---

## 4. 🏆 Inklyuziv ishlab chiqish — **tekshiruv ro'yxati**

```python
INKLYUZIV_TEKSHIRUV = [
    ("Ma'lumot vakilligi tekshirildimi? (marginal VA kesishma)", "70-modul"),
    ("Chetki holatlar FOYDALANUVCHI TILIDA sinaldimi?", "71-modul"),
    ("Metrika 'bo'sh javob' testidan o'tdimi?", "71-modul"),
    ("Har belgi uchun sabab yozilganmi?", "71-modul"),
    ("Bias auditi SEZGIRLIK nazorati bilan qilinganmi?", "69-modul"),
    ("Proksi o'zgaruvchilar tekshirildimi?", "71-modul"),
    ("Inson nazorati mavjudmi?", "71-modul"),
    ("Chiqish monitoringi bormi?", "71-modul"),
]


def inklyuziv_audit(holat):
    ok = 0
    for savol, manba in INKLYUZIV_TEKSHIRUV:
        bor = holat.get(savol, False)
        ok += bor
        print(f"  {'OK ' if bor else 'BAD'} {savol}  [{manba}]")
    n = len(INKLYUZIV_TEKSHIRUV)
    print(f"\n  {ok}/{n} = {ok/n:.0%}")
    return ok
```

> ## ⚠️ **Bu ro'yxatning uchinchi qatori — ## shu darsda TUG'ILDI.** ## ## 🔑 Har yiqilgan test ## ⭐ **ro'yxatga yangi qator qo'shadi**.

---

## 5. ⚠️ Kursning oxirgi maslahati

> *"Etik AI ishlab chiqish tizim ishga tushgach **to'xtamaydi**. Xuddi musiqachi mashq qilishda davom etgani kabi, AI ham **jamiyat kontekstiga mos** bo'lib qolishi uchun **muntazam yangilanishga** muhtoj."*

| Nima | Qanchalik tez-tez |
|---|---|
| Chetki holat testlari | ## ⭐ **Har relizda** |
| Bias auditi | ## ⭐ **Har chorak** |
| Vakillik auditi | Har yarim yil |
| ## **Model qayta ko'rib chiqish** | ⭐ **6 oy** *(68-modul)* |

> ## 🏆 **VA ENG MUHIMI — BULARNI CI/CD GA QO'YING.** ## ## 🔑 Qo'lda qilinadigan audit ## 💥 **hech qachon qilinmaydi**.

---

## 🎯 Nazorat savollari

1. Birinchi metrika o'zbek idiomalari uchun nima ko'rsatdi? Nega u xato edi?
2. Ikkinchi metrika nega **uchta** holatga ajratdi?
3. `Star Wars` naqshining matematik sababi nima?
4. `tasodifiy_naqsh` da `natijalar` nega `belgilar` dan **oldin** yaratiladi?

<details>
<summary>Javoblar</summary>

1. ## **4/5** ko'rsatdi. 💥 Xato — chunki u faqat **taqiqlangan so'z bormi** deb qaradi. Model `"I apologize, but I'm not sure what you mean"` deb javob berdi — ⭐ unda `eye`/`hand` so'zlari **yo'q**, demak *"o'tdi"*. 🔑 Metrika **"xato javob yo'q"** ni **"to'g'ri javob bor"** bilan chalkashtirdi.
2. ## Chunki yiqilish **ikki xil**: 💥 `SO'ZMA-SO'Z` (xato tushundi) va 💥 `CHALKASHDI` (umuman tushunmadi). ⭐ Ikkovini bitta *"YIQILDI"* ga qo'shsangiz — birinchi metrikaning xatosi qaytadi. 🏆 To'g'ri natija: inglizcha **3/5**, o'zbekcha **0/5**.
3. ## **Ko'p taqqoslash muammosi.** O'lchandi *(30 urug'ning o'rtachasi)*: **butunlay tasodifiy** belgilar orasidan 10 ta belgida `0.128`, 1 000 ta belgida `0.260` farqli *"naqsh"* topildi — ⭐ **ikki barobar kuchli**. Model *"aqlli"* emas, u **ko'p belgini ko'rgan**.
4. ## Aks holda `n_belgi` o'zgarganda `random` oqimi siljib, ⚠️ **yollash qarorlari ham o'zgarib ketadi**. 💥 Birinchi urinishda aynan shu xato bor edi — natija `0.181 → 0.243 → 0.208 → 0.268`, ya'ni **monoton emas**. ✅ Tuzatgandan keyin: `0.128 → 0.198 → 0.225 → 0.260`.

</details>

---

⬅️ [5-dars](05-RLHF.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
