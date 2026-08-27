# 3-dars. Ochiq manbali ma'lumot muammolari ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs uchta adolat metrikasini sanaydi. Biz ularni o'lchadik — model B guruhida `+0.216` ortiqcha ishondi, va bu 80% qoidasidan KO'RINMADI."**

---

## 1. Nega ochiq ma'lumot?

> *"Faqat xususiy ma'lumot bilan katta til modelini qurib bo'lmaydi —
> u shunchaki **yetarli emas**."*

| Ma'lumot | Hajm | Sifat |
|---|---|---|
| Xususiy | ## 💥 **Kam** | ✅ Yuqori |
| ## **Ochiq manbali** | ## ⭐ **Juda ko'p** | ## 💥 **Nazoratsiz** |

> ## 🔑 **KURSNING QOIDASI:** ## *"Ma'lumot to'plami qanchalik katta va cheklanmagan bo'lsa, ## ⭐ **past sifat, bias va ishonchsizlik xavfi shuncha yuqori**."*

---

## 2. Kursning uchta adolat metrikasi

| Metrika | Nimani tekshiradi | Modul |
|---|---|---|
| Demografik tenglik | Bashorat guruhga bog'liqmi? | 69 |
| ## **Guruh bo'yicha kalibrlash** | ## ⭐ **Ishonch to'g'rimi?** | ## 🏆 **Bu dars** |
| Nomutanosib ta'sir | Ijobiy natija nisbati | 69 |

> ## ⭐ **IKKINCHISI — 69-MODULDA YO'Q EDI.** ## Va u ## 🔑 **eng nozigi**.

---

## 3. 🔬 **Guruh bo'yicha kalibrlash**

> *"Model o'z bashoratlariga bo'lgan ishonchi turli guruhlarda
> **bir xil** ekanligini tasdiqlaydi."*

Ya'ni: model *"90% ishonchim komil"* desa — u **haqiqatan** 90% holatda
to'g'ri bo'lishi kerak. **Har guruhda.**

```python
import collections, statistics


def kalibrlash(qarorlar, guruh=None, n_savat=4):
    """Ishonchni savatlarga bo'lib, HAQIQIY aniqlik bilan solishtiradi."""
    q = [x for x in qarorlar if guruh is None or x["guruh"] == guruh]
    savatlar = collections.defaultdict(list)
    for x in q:
        i = min(n_savat - 1, int((x["ishonch"] - 0.5) / 0.5 * n_savat))
        savatlar[i].append(x)

    natija = []
    for i in sorted(savatlar):
        b = savatlar[i]
        natija.append((
            statistics.mean(x["ishonch"] for x in b),      # ⭐ model nima dedi
            sum(x["togri"] for x in b) / len(b),           # ⭐ HAQIQATDA nima bo'ldi
            len(b),
        ))
    return natija
```

### ✅ Haqiqiy natija *(1 200 qaror)*

```
  guruh   ishonch   haqiqiy aniqlik     farq  n
      A      0.56              0.52    +0.04  164
      A      0.68              0.66    +0.02  158
      A      0.81              0.79    +0.02  166
      A      0.93              0.94    -0.01  133

      B      0.57              0.37    +0.20  134
      B      0.68              0.49    +0.20  150
      B      0.81              0.59    +0.23  152
      B      0.93              0.69    +0.24  143

  o'rtacha ortiqcha ishonch:  A=+0.020   B=+0.216
  -> KALIBRLASH ADOLATSIZ
```

> ## 💥💥💥 **B GURUHIDA MODEL `0.93` ISHONCH BILDIRDI —** ## haqiqiy aniqlik esa ## 🔑 **`0.69`**.

> ## ⚠️ **VA ENG XAVFLI QATOR — OXIRGISI.** ## Farq ## 💥 **ishonch oshgan sari kattalashadi** *(+0.20 → +0.24)*. ## ## ⭐ Ya'ni model ## 🏆 **eng ishonchli bo'lganda eng ko'p xato qiladi**.

### 💡 Amaliy ma'nosi

> ## 🔑 **AGAR SIZ *"ishonch > 0.90 bo'lsa avtomatik tasdiqlash"*** ## qoidasini qo'ysangiz — ## ## 💥 A guruhi uchun bu **6% xato**, ## 💥 B guruhi uchun — **31% xato**.

> ## 🏆 **VA HECH KIM BUNI SEZMAYDI,** ## chunki umumiy aniqlik ## ⭐ **yaxshi ko'rinadi**.

---

## 4. 🔬 Nomutanosib ta'sir **buni ko'rsatadimi?**

Xuddi shu 1 200 qarorda kursning **uchinchi** metrikasini ishlatamiz.

```python
def nomutanosib_tasir(qarorlar, guruh="guruh", ijobiy="togri"):
    s = collections.defaultdict(lambda: [0, 0])
    for x in qarorlar:
        s[x[guruh]][0] += bool(x[ijobiy])
        s[x[guruh]][1] += 1
    ulush = {g: a / b for g, (a, b) in s.items()}
    return ulush, min(ulush.values()) / max(ulush.values())
```

### ✅ Haqiqiy natija

```
  ijobiy natija ulushi: {'A': 0.717, 'B': 0.535}
  nomutanosib ta'sir nisbati: 0.747   80% QOIDASINI BUZDI
```

> ## ✅ **BU SAFAR IKKALA METRIKA HAM YIQILDI.**
>
> ## ## ⚠️ **LEKIN ULAR BOSHQA-BOSHQA NARSANI AYTADI:**

| Metrika | Nima deydi | Yechim |
|---|---|---|
| ## **Nomutanosib ta'sir** *(0.747)* | ## ⭐ **B kamroq ijobiy natija oladi** | ## Chegarani sozlash |
| ## **Kalibrlash** *(+0.216)* | ## 🔑 **Model B da o'ziga ortiqcha ishonadi** | ## 🏆 **Qayta o'qitish** |

> ## 💥 **VA CHEGARANI SOZLASH KALIBRLASHNI TUZATMAYDI.** ## ## ⭐ Siz ko'proq B ni tasdiqlaysiz, ## lekin model ## 💥 **hali ham qaysi biri to'g'ri ekanini bilmaydi**.

> ## 🏆🏆 **SHUNING UCHUN IKKALASINI HAM O'LCHANG.** ## ## 🔑 Bittasi *"kimga nima berildi"* ni, ## ikkinchisi *"model o'zini biladimi"* ni tekshiradi.

---

## 5. 🔧 Kursning boshqa maslahatlari

> *"Filtrlash dublikatlarni, eskirgan yoki ahamiyatsiz ma'lumotni
> olib tashlaydi."*

| Maslahat | Bu kitobda |
|---|---|
| Filtrlash va tozalash | ⭐ 70-modul, ma'lumot pasporti |
| Muntazam yangilash | ⭐ 68-modul, 6 oy |
| ## **Statistik tahlil** | ## ⭐ 70-modul, vakillik auditi |
| Ma'lumot vizualizatsiyasi | ⚠️ *"Mikroskop ostiga qo'yish"* |
| ## **Adolat metrikalari** | ## 🏆 **Bu dars + 69-modul** |

> ## ⚠️ **VIZUALIZATSIYA HAQIDA — BITTA ESLATMA:** ## grafik ## ⭐ **muammoni ko'rsatadi**, ## lekin ## 💥 **testdan o'tmaydi**. ## ## 🏆 CI/CD ga **son** kerak, rasm emas.

---

## 🎯 Nazorat savollari

1. Kalibrlash nimani tekshiradi? Demografik tenglikdan farqi nima?
2. B guruhida `0.93` ishonch nimani anglatardi?
3. Farq ishonch oshgani sari qanday o'zgardi? Nega bu xavfli?
4. Nomutanosib ta'siri tuzatilsa, kalibrlash tuzaladimi?

<details>
<summary>Javoblar</summary>

1. ## Kalibrlash — **model o'z ishonchini biladimi**. ⭐ Demografik tenglik *"kimga nima berildi"* ni, kalibrlash 🔑 **"model o'zini biladimi"** ni tekshiradi.
2. ## Haqiqiy aniqlik **`0.69`** edi — 💥 **24 punkt ortiqcha ishonch**. A guruhida bu farq atigi `−0.01`.
3. ## **Kattalashdi:** `+0.20 → +0.24`. 💥 Xavfli, chunki model ⭐ **eng ishonchli bo'lganda eng ko'p xato qiladi** — ya'ni *"ishonch > 0.90 → avtomatik tasdiq"* qoidasi B guruhida **31% xato** beradi.
4. ## **Yo'q.** ⭐ Chegarani sozlash ko'proq B ni tasdiqlaydi, lekin 💥 **model hali ham qaysi biri to'g'ri ekanini bilmaydi**. 🏆 Kalibrlash **qayta o'qitish** talab qiladi.

</details>

---

⬅️ [2-dars](02-Foundation-Model-Responsibilities.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Inconsistency.md)
