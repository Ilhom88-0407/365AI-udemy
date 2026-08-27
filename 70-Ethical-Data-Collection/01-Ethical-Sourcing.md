# 1-dars. Etik manbadan olish va ma'lumot turlari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs Common Crawl haqida gapiradi — GPT-3 va Gemini o'qitilgan ma'lumot to'plami. Biz esa savol beramiz: bizning 1500 savollik bazamiz qayerdan keldi?"**

---

## 1. 💥 Common Crawl

> *"Common Crawl — internetdan **milliardlab veb-sahifani** skreyp qiladigan notijorat tashkilot... Lekin muammo bor. Uning ma'lumot sifati **shubhali**: to'plamda **soxta yangiliklar, fitna nazariyalari va hatto irqchilik** borligi ma'lum."*

| Xususiyat | Baho |
|---|---|
| Hajm | ## ⭐ **Milliardlab sahifa** |
| Narx | ## ⭐ **Bepul** |
| Sifat | ## 💥 **Shubhali** |
| Litsenziya | ## 💥 **Noaniq** |

> ## 🔑 **VA KURS AYTADI:** ## *"GPT-3 va Gemini shu manbadan o'qitilgan."*
>
> ## ## 💥 **YA'NI BU MUAMMO — ENG KATTA MODELLARDA HAM BOR.**

---

## 2. ⭐ Uchta savol — **etik manbaning asosi**

Kurs uchta savolni beradi:

| # | Savol |
|---|---|
| ① | ## **Ma'lumot QAYERDAN keldi?** |
| ② | ## **Rozilik olinganmi?** |
| ③ | ## **Hammani ADOLATLI aks ettiradimi?** |

> ## 💡 **UCHALASI HAM — 68-MODULDAGI AUDIT SAVOLLARI.** ## ⭐ Endi ularga **javob beramiz**.

---

## 3. 🔑 Etika uchun **uchta tur**

Kurs ma'lumotni **egalik va kirish** bo'yicha tasniflaydi:

| Tur | Nima | Asosiy xavf |
|---|---|---|
| ## **Xususiy** *(proprietary)* | ## Tashkilotning **o'z** ma'lumoti | ## 💥 **Maxfiylik** |
| ## **Ommaviy** *(public)* | Erkin mavjud | ## 💥 **Sifat** |
| ## **Skreyp qilingan** | Uchinchi tomon saytlaridan | ## 💥 **Rozilik + ToS** |

> ## 🔑 **VA KURS AYTADI:** ## *"Ma'lumot turini tanlash — texnik emas, ## ⭐ **ETIK** qaror."*

---

## 4. 🔧 Manba jurnali — **birinchi vosita**

Har ma'lumot bo'lagining **kelib chiqishini** yozing.

```python
from dataclasses import dataclass, field
from datetime import date


@dataclass
class Manba:
    nom: str
    turi: str                     # xususiy / ommaviy / skreyp
    litsenziya: str
    olingan: date
    rozilik: str                  # "aniq" / "nazarda tutilgan" / "yo'q"
    url: str = ""
    izoh: str = ""

    def etik_baho(self):
        muammolar = []
        if self.rozilik == "yo'q":
            muammolar.append("💥 rozilik yo'q")
        elif self.rozilik == "nazarda tutilgan":
            muammolar.append("⚠️ rozilik faqat nazarda tutilgan")
        if self.litsenziya in ("noma'lum", ""):
            muammolar.append("💥 litsenziya noma'lum")
        if self.turi == "skreyp" and "robots" not in self.izoh:
            muammolar.append("⚠️ robots.txt tekshirilmagan")
        return muammolar or ["✅ muammo topilmadi"]
```

```python
MANBALAR = [
    Manba("Ichki intervyu arxivi", "xususiy", "ichki", date(2024, 3, 1), "aniq"),
    Manba("Common Crawl", "ommaviy", "noma'lum", date(2024, 1, 1), "yo'q"),
    Manba("Kaggle intervyu to'plami", "ommaviy", "CC-BY-SA", date(2024, 5, 1),
          "nazarda tutilgan"),
    Manba("Forum skreypi", "skreyp", "ToS taqiqlaydi", date(2024, 6, 1), "yo'q"),
    Manba("Hamkor MB", "xususiy", "shartnoma", date(2024, 7, 1), "aniq",
          izoh="robots tekshirildi"),
]

for m in MANBALAR:
    print(f"  {m.nom:26} [{m.turi:9}] {m.litsenziya:16}")
    for b in m.etik_baho():
        print(f"      {b}")
```

### ✅ Haqiqiy natija

```
  Ichki intervyu arxivi      [xususiy  ] ichki
      ✅ muammo topilmadi
  Common Crawl               [ommaviy  ] noma'lum
      💥 rozilik yo'q
      💥 litsenziya noma'lum
  Kaggle intervyu to'plami   [ommaviy  ] CC-BY-SA
      ⚠️ rozilik faqat nazarda tutilgan
  Forum skreypi              [skreyp   ] ToS taqiqlaydi
      💥 rozilik yo'q
      ⚠️ robots.txt tekshirilmagan
  Hamkor MB                  [xususiy  ] shartnoma
      ✅ muammo topilmadi
```

> ## 🏆 **BESH MANBADAN IKKITASI TOZA.**
>
> ## ## 💥 **VA `Common Crawl` — IKKITA MUAMMO BILAN.** ## Ya'ni **GPT-3 va Gemini** ham ## ⭐ **shu muammoni meros qilib olgan**.

---

## 5. ⚠️ *"Nazarda tutilgan rozilik"* — **eng chalg'ituvchi holat**

| Rozilik turi | Ma'nosi | Ishonchlilik |
|---|---|---|
| ## **Aniq** | *"Ha, roziman"* deb bosdi | ## ✅ **Yuqori** |
| ## **Nazarda tutilgan** | ## *"Ommaviy chop etdi, demak..."* | ## 💥 **Past** |
| Yo'q | Umuman so'ralmagan | 💥 Yo'q |

> ## 💥💥 **META ISHI — AYNAN "NAZARDA TUTILGAN" ROZILIK EDI** *(69-modul)*: ## *"Ommaviy post — demak ishlatish mumkin."*
>
> ## ## 🔑 **VA FOYDALANUVCHILAR ROZI BO'LMADI.**

---

## 6. 🔬 Bizning MB — **manba tekshiruvi**

66-modulda 1500 savollik baza qurdik. Uning manbasi nima edi?

```python
# 66-modul, 2-dars:
qatorlar.append((i + 1, tur, it, kat, ..., f"Question {i+1} about {kat}..."))
```

> ## ⚠️ **SAVOLLAR — SUN'IY YARATILGAN** *(namoyish uchun)*. ## Haqiqiy ilovada ular **qayerdan** kelardi?

| Manba varianti | Etik baho |
|---|---|
| Ichki intervyu arxivi | ## ✅ **Eng yaxshi** — lekin **nomzod roziligi** kerak |
| Ochiq kitoblar | ## ⚠️ **Litsenziya** tekshirilishi shart |
| ## **Forum skreypi** | ## 💥 **ToS + rozilik** |
| ## **LLM yaratgan** | ## ⚠️ **Model biasini meros qiladi** |

> ## 💡 **OXIRGISI — QIZIQ HOLAT:** ## LLM savol yaratsa, u ## ⭐ **o'z o'quv ma'lumotidagi biasni** ko'chiradi. ## ## 🔑 Bu — 71-modulning mavzusi.

---

## 🎯 Nazorat savollari

1. Common Crawl ning uchta muammosi nima?
2. Etik manbaning uchta savoli qanday?
3. *"Nazarda tutilgan rozilik"* nega xavfli?
4. Manba jurnali nimani beradi?

<details>
<summary>Javoblar</summary>

1. ## **Sifat** *(soxta yangilik, fitna, irqchilik)*, **litsenziya noma'lum**, **rozilik yo'q**. 💥 Va GPT-3 hamda Gemini shu manbadan o'qitilgan — ya'ni muammo **eng katta modellarda ham** bor.
2. ## ① Ma'lumot **qayerdan** keldi? ② **Rozilik** olinganmi? ③ Hammani **adolatli** aks ettiradimi?
3. ## Chunki u **rozilik emas** — bu **taxmin**. 💥 Meta ishi aynan shunday edi: *"ommaviy post — demak mumkin"*, foydalanuvchilar esa **rozi bo'lmadi**.
4. ## **Kelib chiqishni** yozadi va **avtomatik etik baho** beradi. O'lchandi: 5 manbadan **2 tasi toza**, `Common Crawl` — **ikkita muammo** bilan.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Proprietary-Data.md)
