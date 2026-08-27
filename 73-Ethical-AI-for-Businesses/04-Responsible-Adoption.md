# 4-dars. Mas'uliyatli joriy qilish va xavfni boshqarish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Xavf reyestrini tuzdik: 7 ta xavf, ulardan 4 tasida CHORA YO'Q — va aynan ular eng yuqori ballni oldi."**

---

## 1. Kursning konteksti

> *"2025-yil yanvarda... AI xavflarini kamaytirishga qaratilgan
> farmon **bekor qilindi**... AQShda AI xavfsizligi endi
> **biznesning javobgarligi**."*

> ## 🔑 **VA KURSNING SAVOLI:**
>
> ## ## ⭐ *"Bizneslar AI joriy qilish xavflarini ## **mustaqil** boshqarishga tayyormi?"*

> ## 💡 **BU KITOBNING JAVOBI —** ## 68–72-modullarda o'lchangan ## 💥 **hamma raqam "yo'q" deydi**.

---

## 2. 🔬 Kursning uchta xavf toifasi

| Toifa | Kurs misoli |
|---|---|
| ## **Ma'lumot xavfi** | Noto'g'ri yoki biasli ma'lumot |
| ## **Operatsion xavf** | Model yomon chiqish beradi |
| ## **Regulyativ xavf** | Maxfiylik qonunlariga zid |

Buni **reyestrga** aylantiramiz.

```python
XAVFLAR = [
 # (toifa, xavf, ta'sir 1-5, ehtimol 1-5, choralar)
 ("ma'lumot",   "O'quv ma'lumotida bias",         4, 4, ["70-modul auditi"]),
 ("ma'lumot",   "Ma'lumot eskirgan",              3, 3, ["6 oylik qayta ko'rish"]),
 ("operatsion", "Model soxta asosni qabul qiladi", 5, 4, []),
 ("operatsion", "Nomuvofiq javoblar",             4, 4, []),
 ("operatsion", "Sudya buzuq",                    5, 3, []),
 ("regulyativ", "Rozilik yozuvi to'liq emas",     4, 5, []),
 ("regulyativ", "Litsenziya noma'lum",            5, 2, ["litsenziya matritsasi"]),
]
```

> ## ⚠️ **HAR QATOR — 72-MODULDA O'LCHANGAN.** ## ## ⭐ *"Soxta asos"* = **7/8**, ## *"nomuvofiqlik"* = **37.5%**, ## *"sudya buzuq"* = **recall 0%**.

### ✅ Haqiqiy natija

```
  toifa       xavf                              ta'sir  ehtimol  ball  chora
  operatsion  Model soxta asosni qabul qiladi        5        4    20  YO'Q
  regulyativ  Rozilik yozuvi to'liq emas             4        5    20  YO'Q
  ma'lumot    O'quv ma'lumotida bias                 4        4    16  70-modul auditi
  operatsion  Nomuvofiq javoblar                     4        4    16  YO'Q
  operatsion  Sudya buzuq                            5        3    15  YO'Q
  regulyativ  Litsenziya noma'lum                    5        2    10  litsenziya matritsasi
  ma'lumot    Ma'lumot eskirgan                      3        3     9  6 oylik qayta ko'rish

  toifa bo'yicha jami ball: {'operatsion': 51, 'regulyativ': 30, "ma'lumot": 25}
  chorasiz xavflar: 4/7 (jami ball 71)
```

> ## 💥💥💥 **ENG YUQORI IKKI XAVFDA — CHORA YO'Q.**
>
> ## ## 🔑 Va bu **tasodif emas**: ## ⭐ chora topilgan xavflar — ## 💥 **eng oson ko'rinadiganlari**.

### 🏆 Toifa bo'yicha xulosa

| Toifa | Jami ball | Izoh |
|---|---|---|
| ## **Operatsion** | ## 💥 **51** | ## Uchtasida ham **chora yo'q** |
| Regulyativ | 30 | ⚠️ Yarmi qoplangan |
| Ma'lumot | 25 | ## ✅ **Ikkalasi qoplangan** |

> ## 💡 **VA BU — KO'P JAMOADA UCHRAYDIGAN NAQSH:** ## ## ⭐ **ma'lumot** xavflari ustida ishlanadi *(ular tanish)*, ## ## 💥 **operatsion** xavflar esa ## 🔑 **model ishga tushgach paydo bo'ladi** — ## va o'shanda ## ⚠️ **hech kim qaramaydi**.

---

## 3. 🔧 Reyestrni **ishlaydigan** qilish

Jadval — hujjat. Uni **testga** aylantiramiz.

```python
CHEGARA = 12          # ⭐ 12 dan yuqori ball — chorasiz qolmasin


def reyestr_testi(xavflar, chegara=CHEGARA):
    ochiq = [(t, n, ta * eh) for t, n, ta, eh, ch in xavflar
             if not ch and ta * eh > chegara]
    if ochiq:
        satrlar = "\n  ".join(f"{n} (ball {b}, toifa {t})" for t, n, b in ochiq)
        raise AssertionError(
            f"{len(ochiq)} ta yuqori xavf CHORASIZ:\n  {satrlar}")
```

### ✅ Haqiqiy chiqish

```
AssertionError: 4 ta yuqori xavf CHORASIZ:
  Model soxta asosni qabul qiladi (ball 20, toifa operatsion)
  Nomuvofiq javoblar (ball 16, toifa operatsion)
  Sudya buzuq (ball 15, toifa operatsion)
  Rozilik yozuvi to'liq emas (ball 20, toifa regulyativ)
```

> ## ⚠️ **DIQQAT — RO'YXAT BALL BO'YICHA SARALANMAGAN.** ## ## 🔑 `20, 16, 15, 20` — ## chunki `reyestr_testi()` ## ⭐ **asl tartibni** saqlaydi.

> ## 💡 **XATO EMAS, LEKIN TUZATISH KERAK:** ## eng xavflisi ## 🏆 **birinchi ko'rinsin** — ## `sorted(ochiq, key=lambda x: -x[2])` qo'shing.

> ## 🏆 **VA BU — 72-MODULDAGI ## `reliz_testi()` NING DAVOMI.**

---

## 4. ⚠️ Kursning ogohlantirishi

> *"AI ishlatmoqchi bo'lganingiz uchun **haddan tashqari
> hayajonlanmang**. Ehtiyotkor rejalashtirmasdan shoshilish...
> kutilmagan oqibatlar xavfini **sezilarli oshiradi**."*

### 🏆 *"Shoshilish"* ni **o'lchanadigan** qilamiz

```python
TAYYORLIK = [
    ("Vazifa QOIDA bilan hal bo'lmasligi tekshirildimi?",  "73/1"),
    ("Bias auditi qilinganmi (kesishma bilan)?",           "70"),
    ("Soxta asos testi bormi?",                            "72/5"),
    ("Muvofiqlik auditi bormi?",                           "72/4"),
    ("Sudya nazorat misollari bilan sinalganmi?",          "72/6"),
    ("Qaytarish yo'li bormi?",                             "73/3"),
    ("Rozilik yozuvi to'liqmi?",                           "72/1"),
    ("Model karta yozilganmi?",                            "72/2"),
    ("Xavf reyestri chorasiz xavfsizmi?",                  "73/4"),
    ("Chegaralar CI/CD da tekshiriladimi?",                "72/6"),
]


def tayyormi(holat, min_ball=8):
    ok = sum(1 for s, _ in TAYYORLIK if holat.get(s))
    for s, m in TAYYORLIK:
        print(f"  {'OK ' if holat.get(s) else 'BAD'} {s}  [{m}-modul]")
    print(f"\n  {ok}/{len(TAYYORLIK)}")
    return ok >= min_ball
```

> ## 💡 **O'NTA SAVOL — VA HAMMASI ## OLDINGI MODULLARDA O'LCHANGAN.**

> ## 🔑 **BIZNING ILOVA:** ## 72-modulda o'lchaganimizdek — ## ⭐ model karta **1/8**, ## rozilik **3/7**, ## sudya **buzuq**, ## 💥 chegaralar **CI/CD da yo'q**.

---

## 5. ✅ Kursning kamaytirish choralari

| Kurs maslahati | Bu kitobda o'lchandi |
|---|---|
| Ma'lumotni toza saqlash | ⭐ 70-modul, ma'lumot pasporti |
| ## **Inson nazorati** | ## 💥 **3-dars: quvvat 60 → 4 aybsiz** |
| Bias tekshiruvi | ## 💥 **69-modul: sezgirlik nazorati shart** |
| ## **Doimiy yaxshilash** | ## ⭐ 72-modul, monitoring paneli |
| Regulyatsiyani kuzatish | ⭐ 76-modul |
| ## **Fikr-mulohaza tinglash** | ## 🏆 **72-modul: yagona nazoratsiz signal** |

> ## 🏆 **OXIRGISI — ENG QIMMATLISI.** ## ## 🔑 Foydalanuvchi shikoyati ## ⭐ **siz o'ylamagan xatoni** topadi. ## ## 💥 Qolgan hamma test — ## siz **o'ylagan** xatolarni tekshiradi.

---

## 🎯 Nazorat savollari

1. Xavf reyestrida eng yuqori ballni kim oldi? Ularda chora bormi?
2. Qaysi toifa eng ko'p ball to'pladi? Nega?
3. Reyestrni qanday *"ishlaydigan"* qilish mumkin?
4. Nega foydalanuvchi shikoyati eng qimmatli signal?

<details>
<summary>Javoblar</summary>

1. ## **"Model soxta asosni qabul qiladi"** *(20)* va **"Rozilik yozuvi to'liq emas"** *(20)*. 💥 **Ikkalasida ham chora yo'q.** ⭐ Jami **4/7** xavf chorasiz, ularning umumiy balli **71**.
2. ## **Operatsion — 51 ball**, va uchala xavfda ham chora yo'q. 🔑 Sabab: ⭐ ma'lumot xavflari **tanish**, shuning uchun ular ustida ishlanadi; 💥 operatsion xavflar esa **model ishga tushgach** paydo bo'ladi — va o'shanda ⚠️ **hech kim qaramaydi**.
3. ## **`AssertionError` ga aylantirib.** ⭐ `ball > 12` bo'lgan chorasiz xavf topilsa — 🏆 **build yiqiladi**. Bu — 72-moduldagi `reliz_testi()` ning davomi.
4. ## Chunki u ⭐ **siz o'ylamagan** xatoni topadi. 💥 Qolgan hamma test — siz **o'ylagan** xatolarni tekshiradi. 🔑 Ya'ni u — **yagona nazoratsiz signal**.

</details>

---

⬅️ [3-dars](03-Ethical-Use-of-Outputs.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
