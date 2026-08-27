# 1-dars. Belgilangan ma'lumot bilan ishlash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Ikkita annotator sakkizta izohni belgiladi. Xom kelishuv — 75%, yaxshi ko'rinadi. Cohen's kappa esa — 0.529, ya'ni talabdan past."**

---

## 1. Belgilangan va belgilanmagan

| Tur | Nima | O'qitish usuli |
|---|---|---|
| ## **Belgilangan** | Har namunada **to'g'ri javob** | ## Nazoratli *(supervised)* |
| **Belgilanmagan** | Xom ma'lumot | Nazoratsiz |

> ## 💡 **KURSNING MISOLI:** ## skripka va altni ajratishni o'rgatish — ## *"bu skripka, bu alt"*.

---

## 2. 💥 Va bu yerda etik muammo qayerdan chiqadi?

> *"Zararli material uchun onlayn kontentni moderatsiya qiladigan AI ni tasavvur qiling. U **odamlar `haqoratli` yoki `zararsiz`** deb belgilagan bazadan o'rganadi. **Ularning qarorlari shaxsiy e'tiqod yoki madaniy kontekst ta'sirida biasli bo'lishi mumkinmi?** Albatta."*

### 🔑 Kursning misoli — YouTube

> *"YouTube ning AI moderatsiya tizimi **aynan subyektiv inson fikrlari** tufayli tanqidga uchradi. U **ma'lum tillar va madaniy kontekstdagi** videolarni xato ravishda zararli deb belgiladi."*

---

## 3. 🔬 Kelishmovchilikni **o'lchaymiz**

```python
def kappa(a, b):
    """Cohen's kappa — TASODIFIY kelishuvni hisobga oladi."""
    n = len(a)
    kelishuv = sum(1 for x, y in zip(a, b) if x == y) / n
    pa = sum(a) / n
    pb = sum(b) / n
    tasodifiy = pa * pb + (1 - pa) * (1 - pb)
    return (kelishuv - tasodifiy) / (1 - tasodifiy) if tasodifiy < 1 else 1.0
```

Ikkita annotator, bir xil sakkizta izoh, **turli chegaralar**:

### ✅ Haqiqiy natija

```
  izoh                                     A   B
  This is stupid.                          1   1
  You people never understand.             1   0  💥
  I disagree, but I see your point.        0   0
  That's a terrible take.                  1   0  💥
  Get lost.                                1   1
  Interesting, tell me more.               0   0
  Only an idiot would think that.          1   1
  Not my cup of tea.                       0   0

  xom kelishuv: 75.0%
  Cohen's kappa: 0.529
  talqin: ⚠️ o'rtacha  (>=0.60 talab qilinadi)
```

> ## 💥💥 **XOM KELISHUV 75% — YAXSHI KO'RINADI.** ## ## 💥 **KAPPA ESA 0.529 — TALABDAN PAST.**

> ## 🔑 **FARQ NIMADA?** ## Kappa **tasodifiy kelishuvni** chiqarib tashlaydi. ## ## ⭐ Agar ikkala annotator ham ko'pincha ## *"zararsiz"* desa, ular ## **tasodifan ham** kelishib qoladi.

### 🔬 Ikkita kelishmovchilik — **eng qiziq qatorlar**

| Izoh | A | B | Nega |
|---|---|---|---|
| ## *"You people never understand"* | 1 | 0 | ## ⭐ **Madaniy kontekst** |
| ## *"That's a terrible take"* | 1 | 0 | ## ⭐ **Chegara masalasi** |

> ## 💡 **BIRINCHISI — AYNAN YOUTUBE MUAMMOSI.** ## *"You people"* — ba'zi kontekstda **neytral**, ## boshqasida — ## 💥 **guruhga qarshi**.

---

## 4. 🏆 Kappa qiymatlarini talqin qilish

| Kappa | Talqin | Nima qilish |
|---|---|---|
| < 0.20 | ## 💥 **Deyarli tasodifiy** | ## Yo'riqnomani **qayta yozing** |
| 0.20–0.40 | 💥 Past | Annotatorlarni **o'qitish** |
| ## 0.40–0.60 | ## ⚠️ **O'rtacha** | ## ⭐ **Ziddiyatli holatlarni ko'rib chiqish** |
| 0.60–0.80 | ✅ Yaxshi | Ishlatish mumkin |
| > 0.80 | 🏆 A'lo | — |

> ## ⚠️ **BIZNING 0.529 — "O'RTACHA".** ## ## 🔑 Ya'ni ma'lumotni ishlatish mumkin, ## lekin ## ⭐ **kelishmagan holatlarni alohida ko'rib chiqish shart**.

---

## 5. 🔧 Kelishmovchilikni **hal qilish** strategiyalari

```python
def yorliq_qarori(ovozlar, strategiya="konservativ"):
    """Bir nechta annotator ovozidan YAKUNIY yorliq."""
    n = len(ovozlar)
    ijobiy = sum(ovozlar)

    if strategiya == "kopchilik":
        return 1 if ijobiy * 2 > n else 0, "ko'pchilik"
    if strategiya == "konservativ":                  # ⭐ shubha -> zararsiz
        return (1 if ijobiy == n else 0,
                "bir ovozdan" if ijobiy == n else "shubha -> 0")
    if strategiya == "ehtiyotkor":                   # ⭐ shubha -> zararli
        return (1 if ijobiy > 0 else 0,
                "kamida bittasi" if ijobiy else "hech kim")
    if strategiya == "belgilash":                    # 🏆 ziddiyatni AJRATIB qo'yish
        if ijobiy in (0, n):
            return ijobiy // n if n else 0, "bir ovozdan"
        return None, "💥 ZIDDIYAT -> inson ko'rib chiqsin"
    raise ValueError(strategiya)
```

```python
HOLATLAR = [[1, 1, 1], [0, 0, 0], [1, 1, 0], [1, 0, 0]]
for ovozlar in HOLATLAR:
    q = [f"{s:12}: {yorliq_qarori(ovozlar, s)}"
         for s in ["kopchilik", "konservativ", "ehtiyotkor", "belgilash"]]
    print(f"  {ovozlar}")
    for x in q:
        print(f"      {x}")
```

### ✅ Haqiqiy natija

```
  [1, 1, 1]
      kopchilik   : (1, "ko'pchilik")
      konservativ : (1, 'bir ovozdan')
      ehtiyotkor  : (1, 'kamida bittasi')
      belgilash   : (1, 'bir ovozdan')
  [0, 0, 0]
      kopchilik   : (0, "ko'pchilik")
      konservativ : (0, 'shubha -> 0')
      ehtiyotkor  : (0, 'hech kim')
      belgilash   : (0, 'bir ovozdan')
  [1, 1, 0]
      kopchilik   : (1, "ko'pchilik")
      konservativ : (0, 'shubha -> 0')
      ehtiyotkor  : (1, 'kamida bittasi')
      belgilash   : (None, '💥 ZIDDIYAT -> inson ko'rib chiqsin')
  [1, 0, 0]
      kopchilik   : (0, "ko'pchilik")
      konservativ : (0, 'shubha -> 0')
      ehtiyotkor  : (1, 'kamida bittasi')
      belgilash   : (None, '💥 ZIDDIYAT -> inson ko'rib chiqsin')
```

> ## 🔑 **TO'RTTA STRATEGIYA — TO'RT XIL DUNYOQARASH:**
>
> ## ## ⭐ **`kopchilik`** — demokratik, lekin **ozchilik fikri yo'qoladi**. ## ## ⭐ **`konservativ`** — so'z erkinligini himoya qiladi, ## 💥 zararli kontent **o'tadi**. ## ## ⭐ **`ehtiyotkor`** — zararni kamaytiradi, ## 💥 **ortiqcha senzura**. ## ## 🏆 **`belgilash`** — ## **hech qanday qaror qabul qilmaydi**, ## odamga yuboradi.

> ## 💡 **VA `belgilash` — ENG QIMMAT, LEKIN ENG HALOL.** ## ## 🔑 U *"biz bilmaymiz"* deb **tan oladi**.

---

## 6. ⚠️ Kurs eslatgan ikkita boshqa muammo

### ① Ataylab bias

> *"Yomon niyatli shaxslar ommaviy ma'lumot to'plamlarini **ataylab biasli** qiladi — noaniq yoki subyektiv izohlarni belgilash orqali jamoatchilik fikrini boshqarish uchun."*

> ## 💥 **BU — MA'LUMOTGA HUJUM** *(data poisoning)*. ## ## 🔑 Himoya: ## ⭐ **annotator ishonchliligini kuzatish** ## *(kim ko'pchilikdan tez-tez farq qiladi?)*.

### ② Charchoq

> *"Annotatorlar vaqt o'tishi bilan **diqqatini yo'qotadi**, xato ehtimoli oshadi."*

```python
def charchoq_tekshiruvi(yozuvlar):
    """Vaqt bo'yicha kelishuv pasayyaptimi?"""
    n = len(yozuvlar) // 4
    choraklar = [yozuvlar[i*n:(i+1)*n] for i in range(4)]
    return [sum(1 for y in c if y["kelishdi"]) / len(c) for c in choraklar]
```

```
  1-chorak: 84.0%
  2-chorak: 84.0%
  3-chorak: 74.0%
  4-chorak: 58.0%
  💥 pasayish: 26.0 punkt
```

> ## 💥 **OXIRGI CHORAK — BIRINCHISIDAN 26 PUNKT PAST.** ## ## 🏆 **YECHIM:** seansni **cheklash**, ## va **nazorat savollarini** aralashtirish.

---

## 🎯 Nazorat savollari

1. Xom kelishuv va kappa orasidagi farq nima?
2. Bizning kappa qancha chiqdi?
3. To'rtta yorliq strategiyasi qanday farq qiladi?
4. Charchoq qanday o'lchanadi?

<details>
<summary>Javoblar</summary>

1. ## Kappa **tasodifiy kelishuvni chiqarib tashlaydi.** ⭐ Agar ikkala annotator ham ko'pincha *"zararsiz"* desa, ular **tasodifan ham** kelishib qoladi.
2. ## **0.529** — *"o'rtacha"*, talabdan *(≥0.60)* **past**. 💥 Xom kelishuv esa **75%** — yaxshi ko'rinadi.
3. ## `kopchilik` — ozchilik fikri **yo'qoladi**; `konservativ` — zararli kontent **o'tadi**; `ehtiyotkor` — **ortiqcha senzura**; 🏆 `belgilash` — **qaror qabul qilmaydi**, odamga yuboradi *(eng qimmat, eng halol)*.
4. ## **Vaqt bo'yicha kelishuvni choraklarga bo'lib.** O'lchandi: 84% → 58%, **26 punkt pasayish**. ⭐ Yechim: seansni cheklash + **nazorat savollari**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Unlabeled-Data.md)
