# 3-dars. Ommaviy ma'lumot ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs shahar trafik ma'lumotini misol qiladi: eskirgan bo'lsa — navigatsiya haydovchini xavfli yo'ldan yuboradi. Biz esa ma'lumot 'yangimi?' degan savolni kodga aylantiramiz."**

---

## 1. Ta'rif

> *"Ommaviy ma'lumot — ochiq kutubxonaga o'xshaydi, har kim uchun bepul. Masalan: **davlat statistikasi, ob-havo yozuvlari, shahar trafik oqimi, universitet tadqiqot to'plamlari**."*

| Xususiyat | Baho |
|---|---|
| Narx | ## ⭐ **Bepul** |
| Hajm | ## ⭐ **Katta** |
| ## **Ishonchlilik** | ## 💥 **Ko'pincha shubhali** |
| ## **Yangilik** | ## 💥 **Noma'lum** |

---

## 2. 💥 Kursning misoli — **shahar trafigi**

> *"Bu ma'lumot shahar rejalashtirishni yaxshilashi mumkin... lekin **eskirgan yoki to'liqsiz** bo'lsa, u yomon qarorlarga olib keladi: yo'lni **noto'g'ri joyda** ta'mirlash yoki haydovchini **xavfsiz bo'lmagan yo'ldan** yuborish."*

### 🔑 Uchta muammo

| # | Muammo | Oqibat |
|---|---|---|
| ① | ## **Eskirgan** | ## 💥 Noto'g'ri qaror |
| ② | **To'liqsiz** | 💥 Yashirin bias |
| ③ | ## **Anonimlashtirilmagan geolokatsiya** | ## 💥 **Shaxsiy hayot oshkor** |

> ## 💥💥 **UCHINCHISI — ENG KUTILMAGANI:** ## trafik ma'lumoti **shaxsiy ma'lumot emas** ko'rinadi. ## ## ⭐ Lekin GPS izlari — ## **odam qayerda yashashini** aytadi.

---

## 3. 🔧 Ma'lumot sifati pasporti

Ommaviy ma'lumotni ishlatishdan **oldin** tekshiring.

```python
from datetime import date


class MalumotPasporti:
    """Ommaviy to'plamni ishlatishdan OLDIN tekshiradi."""

    def __init__(self, nom, yaratilgan, yangilangan, qatorlar,
                 yetishmaydigan_ulush, manba, litsenziya, geo=False):
        self.nom = nom
        self.yaratilgan = yaratilgan
        self.yangilangan = yangilangan
        self.qatorlar = qatorlar
        self.yetishmaydigan = yetishmaydigan_ulush
        self.manba = manba
        self.litsenziya = litsenziya
        self.geo = geo

    def tekshir(self, bugun, max_yosh_kun=365):
        m = []
        yosh = (bugun - self.yangilangan).days
        if yosh > max_yosh_kun:
            m.append(f"💥 eskirgan: {yosh} kun ({yosh/365:.1f} yil)")
        if self.yetishmaydigan > 0.20:
            m.append(f"💥 bo'sh qiymatlar: {self.yetishmaydigan:.0%}")
        elif self.yetishmaydigan > 0.05:
            m.append(f"⚠️ bo'sh qiymatlar: {self.yetishmaydigan:.0%}")
        if self.litsenziya in ("noma'lum", ""):
            m.append("💥 litsenziya noma'lum")
        if not self.manba:
            m.append("💥 manba ko'rsatilmagan")
        if self.geo:
            m.append("⚠️ GEOLOKATSIYA bor — anonimlashtirish SHART")
        if self.qatorlar < 1000:
            m.append(f"⚠️ kichik to'plam: {self.qatorlar} qator")
        return m or ["✅ tekshiruvdan o'tdi"]
```

```python
BUGUN = date(2026, 8, 27)

TOPLAMLAR = [
    MalumotPasporti("Shahar trafigi 2021", date(2021, 1, 1), date(2021, 6, 1),
                    50_000, 0.03, "shahar hokimiyati", "CC-BY", geo=True),
    MalumotPasporti("Ish e'lonlari", date(2025, 1, 1), date(2026, 7, 1),
                    120_000, 0.08, "job board API", "ToS"),
    MalumotPasporti("Intervyu savollari", date(2024, 1, 1), date(2024, 3, 1),
                    1_500, 0.00, "", "noma'lum"),
    MalumotPasporti("Nomzod so'rovi", date(2026, 6, 1), date(2026, 8, 1),
                    340, 0.35, "ichki so'rov", "ichki"),
]

for t in TOPLAMLAR:
    print(f"  {t.nom}")
    for m in t.tekshir(BUGUN):
        print(f"      {m}")
```

### ✅ Haqiqiy natija

```
  Shahar trafigi 2021
      💥 eskirgan: 1913 kun (5.2 yil)
      ⚠️ GEOLOKATSIYA bor — anonimlashtirish SHART
  Ish e'lonlari
      ⚠️ bo'sh qiymatlar: 8%
  Intervyu savollari
      💥 eskirgan: 909 kun (2.5 yil)
      💥 litsenziya noma'lum
      💥 manba ko'rsatilmagan
  Nomzod so'rovi
      💥 bo'sh qiymatlar: 35%
      ⚠️ kichik to'plam: 340 qator
```

> ## 💥💥 **`Intervyu savollari` — UCHTA MUAMMO.** ## Va bu — ## ⭐ **bizning o'z bazamiz** *(66-modul)*.

> ## 🔑 **VA E'TIBOR BERING — `Ish e'lonlari` YAGONA ## FAQAT OGOHLANTIRISH OLGAN TO'PLAM.**

---

## 4. ⚠️ *"Bo'sh qiymatlar"* — **yashirin bias**

35% bo'sh qiymat — bu **shunchaki kam ma'lumot** emasmi?

```python
import collections, random

random.seed(5)
soravnoma = []
for i in range(1000):
    yosh = random.randint(20, 65)
    # 💥 Keksa respondentlar "daromad" savoliga KAMROQ javob beradi
    javob_beradi = random.random() > (0.10 + (yosh - 20) / 100)
    soravnoma.append({
        "yosh_guruhi": f"{(yosh//10)*10}-{(yosh//10)*10+9}",
        "daromad": random.randint(300, 3000) if javob_beradi else None,
    })

s = collections.defaultdict(lambda: [0, 0])
for r in soravnoma:
    s[r["yosh_guruhi"]][0] += 1
    if r["daromad"] is None:
        s[r["yosh_guruhi"]][1] += 1

print(f"  {'yosh guruhi':14} {'jami':>6} {'bo‘sh':>7} {'ulush':>8}")
for g in sorted(s):
    jami, bosh = s[g]
    print(f"  {g:14} {jami:6} {bosh:7} {bosh/jami:8.1%}")
```

### ✅ Haqiqiy natija

```
  yosh guruhi      jami    bo'sh    ulush
  20-29             219      32    14.6%
  30-39             212      48    22.6%
  40-49             238      80    33.6%
  50-59             201      94    46.8%
  60-69             130      67    51.5%
```

> ## 💥💥💥 **BO'SH QIYMATLAR TASODIFIY EMAS.** ## 20–29: **14.6%**, 60–69: ## ⭐ **51.5%**.

> ## 🔑 **AGAR SIZ SHUNCHAKI `dropna()` QILSANGIZ —** ## ⭐ **keksa respondentlarning yarmini yo'qotasiz**, ## va model ## 💥 **yosh odamlarga moslashadi**.

> ## 🏆 **QOIDA:** ## bo'sh qiymatlarni o'chirishdan oldin ## ⭐ **ular QAYSI GURUHDA ko'pligini** tekshiring.

---

## 5. 🏆 Ommaviy ma'lumotni **halol e'lon qilish**

Kurs aytadi:

> *"Tashkilotlar ommaviy ma'lumotni etik ishlatishini da'vo qilsalar, ular **qayerdan kelganini, qanday ishlatishini** va **qanday cheklov yoki bias** borligini tushuntirishlari kerak."*

```python
def malumot_eloni(pasport, cheklovlar):
    q = [f"Ma'lumot to'plami: {pasport.nom}",
         f"Manba: {pasport.manba or '💥 KO‘RSATILMAGAN'}",
         f"Litsenziya: {pasport.litsenziya}",
         f"Oxirgi yangilanish: {pasport.yangilangan}",
         f"Qatorlar: {pasport.qatorlar:,}",
         "",
         "Ma'lum cheklovlar:"]
    q += [f"  - {c}" for c in cheklovlar] or ["  - (ko'rsatilmagan)"]
    return "\n".join(q)
```

> ## 🔑 **VA "MA'LUM CHEKLOVLAR" — ENG MUHIM BO'LIM.** ## Uni bo'sh qoldirish ## ⭐ *"biz tekshirmadik"* degani.

---

## 🎯 Nazorat savollari

1. Shahar trafik ma'lumotining uchta muammosi nima?
2. Nega trafik ma'lumoti maxfiylik masalasi bo'lishi mumkin?
3. Bo'sh qiymatlar nega bias manbai?
4. Bizning intervyu bazamiz pasport tekshiruvidan qanday o'tdi?

<details>
<summary>Javoblar</summary>

1. ## **Eskirgan**, **to'liqsiz**, va **anonimlashtirilmagan geolokatsiya**.
2. ## GPS izlari **odam qayerda yashashini** aytadi. ⭐ Ma'lumot *"shaxsiy emas"* ko'rinadi, lekin **shaxsni aniqlaydi**.
3. ## Ular **tasodifiy emas.** O'lchandi: 20–29 yoshda **14.6%** bo'sh, 60–69 da — **51.5%** (3.5× ko'p). 💥 `dropna()` keksa respondentlarning **yarmini** yo'qotadi.
4. ## **Uchta muammo:** eskirgan *(909 kun)*, litsenziya noma'lum, manba ko'rsatilmagan. ⭐ Bu — bizning **o'z bazamiz** *(66-modul)*.

</details>

---

⬅️ [2-dars](02-Proprietary-Data.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Web-Scraped-Data.md)
