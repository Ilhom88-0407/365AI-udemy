# 2-dars. Xususiy ma'lumot ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs RBS ishini keltiradi: bank mijozga 'siz ikkita sug'urta to'layapsiz' dedi — o'z daromadini yo'qotish xavfi bilan. Va mijozlar buni qadrladi."**

---

## 1. Ta'rif

> *"Xususiy ma'lumot — tashkilot **aniq maqsad uchun** yig'adigan eksklyuziv, yuqori sifatli ma'lumot."*

| Xususiyat | Baho |
|---|---|
| Sifat | ## 🏆 **Eng yuqori** |
| Noyoblik | ## ⭐ **Faqat sizda** |
| Litsenziya | ## ✅ **Aniq** |
| ## **Maxfiylik xavfi** | ## 💥 **Eng yuqori** |

> ## 🔑 **KURSNING MISOLI:** ## kasallikni erta aniqlash uchun ## **bemor yozuvlari** bilan o'qitilgan model.
>
> ## ## 💥 **VA SAVOL:** ## *"Bemorlar bilishadimi? Rozimi?"*

---

## 2. 🏆 RBS ishi — **shaffoflik daromaddan ustun**

> *"2018-yilda Royal Bank of Scotland mijozlar ishonchini tiklash uchun jiddiy qadamlar qo'ydi... Masalan, agar mijoz **ikkita sayohat sug'urtasi** to'layotganini sezsa — biri bankdan, biri uchinchi tomondan — ular buni **to'g'ridan-to'g'ri aytishardi**."*

| | Kutilgan | ## Haqiqiy |
|---|---|---|
| Mijoz nima qiladi | ## 💥 **Bank sug'urtasini bekor qiladi** | ## 🏆 **Uchinchi tomonnikini** bekor qildi |
| Natija | Daromad yo'qoladi | ## 🏆 **Ishonch va sodiqlik oshdi** |

> ## 💡 **VA BU — ETIKANING KAM UCHRAYDIGAN HOLATI:** ## *"to'g'ri ish"* va *"foydali ish"* ## ⭐ **bir xil chiqdi**.

> ## ⚠️ **HALOL BO'LSAK — HAR DOIM SHUNDAY EMAS.** ## Ko'p holatda etik qaror ## **pul turadi**. ## ## 🔑 Shuning uchun u **qaror**, ## avtomatik natija emas.

---

## 3. 🔧 Xususiy ma'lumot uchun **himoya qatlamlari**

Kurs bank misolini beradi: *"shifrlash, imkon bo'lsa anonimlashtirish, faqat ruxsat etilgan xodimlarga kirish"*.

```python
import hashlib
from enum import IntEnum


class Daraja(IntEnum):
    OMMAVIY = 0
    ICHKI = 1
    MAXFIY = 2
    JUDA_MAXFIY = 3


MAYDONLAR = {
    "ball":       Daraja.ICHKI,
    "lavozim":    Daraja.ICHKI,
    "javob_matni": Daraja.MAXFIY,
    "ism":        Daraja.MAXFIY,
    "email":      Daraja.JUDA_MAXFIY,
    "jshshir":    Daraja.JUDA_MAXFIY,
}

ROLLAR = {
    "tahlilchi":  Daraja.ICHKI,
    "hr":         Daraja.MAXFIY,
    "admin":      Daraja.JUDA_MAXFIY,
    "mehmon":     Daraja.OMMAVIY,
}


def koradimi(rol, maydon):
    r = ROLLAR.get(rol)
    m = MAYDONLAR.get(maydon)
    if r is None:
        return None, f"💥 noma'lum rol: {rol}"
    if m is None:
        return None, f"💥 noma'lum maydon: {maydon} -> DEFAULT DENY"
    return (r >= m), f"{rol}({r.name}) vs {maydon}({m.name})"


def yozuv_filtr(rol, yozuv):
    """Rolga ko'rinadigan maydonlarni QOLDIRADI, qolganini niqoblaydi."""
    natija = {}
    for k, v in yozuv.items():
        ok, _ = koradimi(rol, k)
        natija[k] = v if ok else "***"
    return natija
```

```python
YOZUV = {"ism": "Aziz Karimov", "email": "a@example.com",
         "lavozim": "ML Engineer", "ball": 7,
         "javob_matni": "I cut latency from 800ms to 120ms."}

for rol in ["mehmon", "tahlilchi", "hr", "admin"]:
    print(f"  {rol:10} {yozuv_filtr(rol, YOZUV)}")

print()
print(" ", koradimi("tahlilchi", "video")[1])
print(" ", koradimi("noma'lum_rol", "ball")[1])
```

### ✅ Haqiqiy natija

```
  mehmon     {'ism': '***', 'email': '***', 'lavozim': '***', 'ball': '***', 'javob_matni': '***'}
  tahlilchi  {'ism': '***', 'email': '***', 'lavozim': 'ML Engineer', 'ball': 7, 'javob_matni': '***'}
  hr         {'ism': 'Aziz Karimov', 'email': '***', 'lavozim': 'ML Engineer', 'ball': 7, 'javob_matni': 'I cut latency from 800ms to 120ms.'}
  admin      {'ism': 'Aziz Karimov', 'email': 'a@example.com', 'lavozim': 'ML Engineer', 'ball': 7, 'javob_matni': 'I cut latency from 800ms to 120ms.'}

  💥 noma'lum maydon: video -> DEFAULT DENY
  💥 noma'lum rol: noma'lum_rol
```

> ## 🏆 **TO'RTTA ROL — TO'RT XIL KO'RINISH.**
>
> ## ## ⭐ **VA `tahlilchi` — ENG QIZIQ QATOR:** ## u **statistika qila oladi** *(lavozim, ball)*, ## lekin ## 🔑 **kimligini bilmaydi**.

> ## ⚠️ **`video` MAYDONI RO'YXATDA YO'Q → RAD ETILDI.** ## ## 💡 Yangi maydon qo'shilganda ## ⭐ **avtomatik himoyalanadi**.

---

## 4. ⚠️ Xususiy ma'lumot — **almashish mumkin**

Kurs eslatadi:

> *"Xususiy ma'lumot **xususiy** bo'lsa ham, u faqat uni yig'gan tashkilotda ishlatilishi shart emas. Egalik va nozikligini himoya qilish uchun u **qat'iy shartlar** ostida ulashilishi mumkin."*

| Shart | Nima qiladi |
|---|---|
| ## **Maxfiylik shartnomasi** | Huquqiy majburiyat |
| ## **Ishlatish cheklovi** | ## ⭐ *"Faqat X maqsad uchun"* |
| Muddat | *"12 oy, keyin o'chiriladi"* |
| ## **Qayta ulashish taqiqi** | ## 💥 **Eng ko'p unutiladigan band** |

> ## 💥 **GREG MARSTON ISHI — AYNAN OXIRGI BAND YO'QLIGI** *(68-modul)*: ## IBM huquqlarni ## ⭐ **boshqa kompaniyaga sotdi**.

---

## 5. 🔬 Bizning ilovamiz — **qanday ma'lumot yig'amiz?**

| Maydon | Daraja | Kerakmi |
|---|---|---|
| `javob_matni` | MAXFIY | ## ✅ **Ha** — baholash uchun |
| `ball` | ICHKI | ✅ Ha |
| `lavozim`, `daraja` | ICHKI | ✅ Ha |
| ## `ism` | ## MAXFIY | ## 💥 **YO'Q** — 69-modulda ko'rdik |
| `email` | JUDA_MAXFIY | ## ⚠️ Faqat natija yuborish uchun |

> ## 🏆 **MA'LUMOTNI MINIMALLASHTIRISH (`data minimisation`) —** ## GDPR ning asosiy prinsiplaridan biri *(76-modul)*.
>
> ## ## 🔑 **SAVOL: "BU MAYDONSIZ ISHLAY OLAMANMI?"** ## Agar **ha** — ## ⭐ **yig'mang**.

---

## 🎯 Nazorat savollari

1. RBS nima qildi va natija qanday bo'ldi?
2. Xususiy ma'lumotning eng katta xavfi nima?
3. `tahlilchi` roli nimani ko'radi?
4. Ma'lumotni minimallashtirish savoli qanday?

<details>
<summary>Javoblar</summary>

1. ## Mijozga **ikkita sug'urta to'layotganini** aytdi — o'z daromadini yo'qotish xavfi bilan. 🏆 Mijozlar **uchinchi tomonnikini** bekor qildi; ishonch va sodiqlik **oshdi**. ⚠️ Lekin bu — kam uchraydigan holat: ko'pincha etik qaror **pul turadi**.
2. ## **Maxfiylik.** Sifat eng yuqori, litsenziya aniq — lekin ma'lumot **haqiqiy odamlarniki**.
3. ## `lavozim` va `ball` — ya'ni **statistika qila oladi**, lekin `ism`, `email`, `javob_matni` **niqoblangan**. 🔑 U **kimligini bilmaydi**.
4. ## *"Bu maydonsiz ishlay olamanmi?"* Agar **ha** — **yig'mang**. ⭐ GDPR ning `data minimisation` prinsipi *(76-modul)*.

</details>

---

⬅️ [1-dars](01-Ethical-Sourcing.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Public-Data.md)
