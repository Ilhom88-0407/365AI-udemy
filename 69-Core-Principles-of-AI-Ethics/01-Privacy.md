# 1-dars. Maxfiylik ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs Meta ishini keltiradi: 2007-yildan beri chop etilgan postlar model o'qitish uchun ishlatilgan. Biz esa savol beramiz: bizning ilovamiz nomzod javoblarini nima qiladi?"**

---

## 1. Ta'rif

> *"Maxfiylik — shaxslarning o'z shaxsiy ma'lumotlarini va uning **qanday ishlatilishini** nazorat qilishini ta'minlash."*

| Kalit so'z | Ma'nosi |
|---|---|
| ## **Nazorat** | Ma'lumot **kimniki** |
| ## **Qanday ishlatiladi** | ## ⭐ **Maqsad chegarasi** |
| Rozilik | **Aniq** va **xabardor** |

---

## 2. 💥 Meta ishi

> *"2024-yil o'rtalarida Meta **2007-yildan beri** ommaviy ulashilgan postlarni AI modellarini o'qitish uchun ishlatayotganini oshkor qildi."*

### 🔑 Uchta muammo bir vaqtda

| Muammo | Tafsilot |
|---|---|
| ## **Vaqt** | 2007-yilgi post — ## 💥 **AI hali yo'q edi** |
| ## **Xabardorlik** | Foydalanuvchilar ## 💥 **bilmasdi** |
| ## **Mintaqaviy tengsizlik** | ## 💥 **EU: opt-out bor, AQSh: yo'q** |

> ## 💥💥 **UCHINCHISI — ENG QIZIQ:** ## bir xil kompaniya, bir xil ma'lumot, ## ⭐ **turli huquqlar**.
>
> ## ## 🔑 **VA BU — 68-MODULDAGI "QONUN ORQADA" MUAMMOSI:** ## GDPR **2018**, ma'lumot esa **2007** dan.

### ⚠️ Va o'chirish yordam beradimi?

> *"Postni o'chirsangiz ham, model **o'sha mazmunni saqlab qolishi** mumkin."*

```
post yozildi ──► model o'qitildi ──► post o'chirildi
                       │
                       └──► 💥 MODEL BILADI
```

> ## 💥 **MODELDAN MA'LUMOTNI "O'CHIRISH" — ## OCHIQ ILMIY MUAMMO** *(machine unlearning)*. ## ## ⭐ Amalda: **qayta o'qitish** kerak.

---

## 3. 🔬 Maxfiylik hayot siklining **qaysi bosqichlarida?**

Kurs to'rtta nuqtani sanaydi:

| Bosqich | Xavf |
|---|---|
| To'plash | ## 💥 **Rozilliksiz yig'ish** |
| Tayyorlash | ## 💥 **PII olib tashlanmadi** |
| O'qitish | ## 💥 **Model eslab qoladi** |
| Monitoring | ## 💥 **O'chirish mexanizmi yo'q** |

---

## 4. 🔧 PII detektori — **birinchi vosita**

```python
import re

NAQSHLAR = {
    "email":        r"\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b",
    "telefon_uz":   r"(\+998|998)?[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b",
    "karta":        r"\b(?:\d[ -]?){13,19}\b",
    "passport_uz":  r"\b[A-Z]{2}\s?\d{7}\b",
    "jshshir":      r"\b\d{14}\b",
    "ip":           r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
    "url_profil":   r"\b(?:linkedin\.com|github\.com|t\.me)/[\w.-]+",
}


def pii_top(matn):
    """Matnda shaxsiy ma'lumot bormi?"""
    topilgan = {}
    for nom, n in NAQSHLAR.items():
        m = re.findall(n, matn or "")
        if m:
            topilgan[nom] = len(m)
    return topilgan


def pii_yashir(matn):
    """PII ni [TUR] belgisi bilan almashtiradi."""
    t = matn or ""
    for nom, n in NAQSHLAR.items():
        t = re.sub(n, f"[{nom.upper()}]", t)
    return t
```

```python
JAVOB = ("Men Aziz Karimov, aziz.karimov@example.com, +998 90 123 45 67. "
         "GitHub profilim: github.com/azizkarimov. "
         "Oldingi loyihamda 192.168.1.10 serverida ishlaganman.")

print("topilgan:", pii_top(JAVOB))
print()
print("yashirilgan:")
print(" ", pii_yashir(JAVOB))
```

### ✅ Haqiqiy natija

```
topilgan: {'email': 1, 'telefon_uz': 1, 'ip': 1, 'url_profil': 1}

yashirilgan:
  Men Aziz Karimov, [EMAIL], [TELEFON_UZ]. GitHub profilim: [URL_PROFIL] Oldingi
  loyihamda [IP] serverida ishlaganman.
```

> ## 🏆 **TO'RTTA PII TOPILDI VA YASHIRILDI.**
>
> ## ## 💥 **LEKIN E'TIBOR BERING — `Aziz Karimov` QOLDI.** ## Ism — **regex bilan topilmaydi**.

> ## 🔧 **VA YANA BIR KICHIK XATO CHIQDI:** ## `[URL_PROFIL]` dan keyin **nuqta yo'qoldi** — ## `[\w.-]+` naqshi jumla oxiridagi nuqtani ham **yutib yubordi**.
>
> ## ## ⭐ **TUZATISH:** `[\w-]+(?:\.[\w-]+)*` yoki oxirida `(?<![.,])`. ## 🔑 Bu — kichik narsa, lekin ## **PII maskalash matnni buzishi mumkinligini** ko'rsatadi.

### ⚠️ Halol baho — bu detektor **nima qilmaydi**

| Yetishmaydi | Nega |
|---|---|
| ## **Ism-familiya** | ## 💥 Regex bilan **imkonsiz** |
| Manzil | Juda o'zgaruvchan |
| Ish joyi nomi | Kontekstga bog'liq |
| ## **Kombinatsiya** | ## 💥 *"32 yosh + Toshkent + ML muhandis"* |

> ## 💥💥 **OXIRGISI — ENG XAVFLISI.** ## Alohida hech biri PII emas, ## birgalikda esa ## ⭐ **odamni aniqlaydi**.
>
> ## ## 🔑 **BU — `k`-ANONIMLIK MUAMMOSI** *(70-modulda o'lchaymiz)*.

---

## 5. 🔧 Saqlash siyosati — **kod bilan**

```python
from datetime import date, timedelta


class MaxfiylikSiyosati:
    """Ma'lumot saqlash qoidalarini KODDA amalga oshiradi."""

    MUDDATLAR = {                     # kun
        "javob_matni": 30,
        "ball": 365,
        "audit_logi": 730,
        "shaxsiy_malumot": 0,         # ⭐ UMUMAN SAQLANMAYDI
    }

    def __init__(self, bugun):
        self.bugun = bugun

    def saqlanadimi(self, tur, yaratilgan):
        if tur not in self.MUDDATLAR:
            return False, f"💥 noma'lum tur: {tur}"
        m = self.MUDDATLAR[tur]
        if m == 0:
            return False, "💥 bu tur UMUMAN saqlanmaydi"
        yosh = (self.bugun - yaratilgan).days
        if yosh > m:
            return False, f"🗑 muddati o'tdi: {yosh}/{m} kun"
        return True, f"✅ saqlanadi ({m - yosh} kun qoldi)"
```

```python
s = MaxfiylikSiyosati(date(2026, 8, 27))
for tur, sana in [
    ("javob_matni", date(2026, 8, 20)),
    ("javob_matni", date(2026, 6, 1)),
    ("ball", date(2026, 1, 1)),
    ("shaxsiy_malumot", date(2026, 8, 26)),
    ("video", date(2026, 8, 26)),
]:
    ok, sabab = s.saqlanadimi(tur, sana)
    print(f"  {tur:18} {sana}  {sabab}")
```

### ✅ Haqiqiy natija

```
  javob_matni        2026-08-20  ✅ saqlanadi (23 kun qoldi)
  javob_matni        2026-06-01  🗑 muddati o'tdi: 87/30 kun
  ball               2026-01-01  ✅ saqlanadi (127 kun qoldi)
  shaxsiy_malumot    2026-08-26  💥 bu tur UMUMAN saqlanmaydi
  video              2026-08-26  💥 noma'lum tur: video
```

> ## 🏆 **OXIRGI QATOR — ENG MUHIMI.** ## Noma'lum tur ## ⭐ **avtomatik RAD ETILADI**.
>
> ## ## 🔑 **BU — "DEFAULT DENY" NAQSHI:** ## ruxsat berilmagan hamma narsa — ## **taqiqlangan**.

---

## 6. 💥 Bizning ilovamiz — **maxfiylik auditi**

| Savol | Javob |
|---|---|
| Javob matni saqlanadimi? | ## 💥 **Ha, muddat yo'q** |
| PII filtri bormi? | ## 💥 **Yo'q** |
| Foydalanuvchi o'chira oladimi? | ## 💥 **Yo'q** |
| Ism promptga tushadimi? | ## 💥 **Ha** |
| Model o'qitish uchun ishlatiladimi? | ## ⚠️ **Aytilmagan** |

> ## 💥💥 **BESH SAVOL — TO'RTTASI `💥`, BIRTASI `⚠️`.**
>
> ## ## ⭐ **VA OXIRGI QATOR — META ISHINING O'ZI:** ## *"aytilmagan"* — ## **eng xavfli javob**.

### ✅ Uch qatorli tuzatish

```python
# ① PII ni promptdan olib tashlaymiz
toza_javob = pii_yashir(javob)

# ② ismni promptga umuman qo'ymaymiz
SYS = "You are an HR interviewer. Interview this candidate for ..."   # ism YO'Q

# ③ saqlash muddatini majburlaymiz
siyosat.saqlanadimi("javob_matni", yaratilgan)
```

---

## 🎯 Nazorat savollari

1. Meta ishida nechta muammo bor?
2. Postni o'chirish modelni tozalaydimi?
3. PII detektorimiz nimani topa olmadi?
4. *"Default deny"* nima?
5. Bizning ilovamiz maxfiylik auditidan qanday o'tdi?

<details>
<summary>Javoblar</summary>

1. ## **Uchta:** ① **vaqt** *(2007-yilgi post, AI hali yo'q edi)*, ② **xabardorlik** *(foydalanuvchilar bilmasdi)*, ③ **mintaqaviy tengsizlik** *(EU da opt-out bor, AQSh da yo'q)*.
2. ## **Yo'q.** Model mazmunni **saqlab qoladi**. 💥 Modeldan ma'lumotni o'chirish — **ochiq ilmiy muammo** *(machine unlearning)*; amalda **qayta o'qitish** kerak.
3. ## **Ism-familiya** *(`Aziz Karimov` qoldi)*, manzil, ish joyi, va eng xavflisi — **kombinatsiya** *("32 yosh + Toshkent + ML muhandis")*. 🔑 Bu — `k`-anonimlik muammosi.
4. ## **Ruxsat berilmagan hamma narsa taqiqlangan.** O'lchandi: `video` turi ro'yxatda yo'q → **avtomatik rad etildi**.
5. ## **5 savoldan 4 tasi `💥`, 1 tasi `⚠️`.** ⭐ Va `⚠️` *("model o'qitish uchun ishlatiladimi — aytilmagan")* — **Meta ishining o'zi**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Transparency.md)
