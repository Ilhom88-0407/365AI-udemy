# 3-dars. AQSh: shtatlar bo'yicha regulyatsiya ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 'yamoq' (patchwork) deydi. Sanadik: bitta shtatda 4 ta talab, beshtasida 10 ta. Va NY qonuni bizdan AYNAN 71-modulda qilmagan ishimizni talab qiladi."**

---

## 1. Kursning modeli

> *"Yagona keng qamrovli federal qonun o'rniga, AQShda AI **soha
> qoidalari, shtat qonunlari va ixtiyoriy yo'riqnomalar** orqali
> tartibga solinadi."*

### Sohaga xos qonunlar

| Qonun | Soha | Nima talab qiladi |
|---|---|---|
| ## **HIPAA** | Tibbiyot | Shifrlash, kirish nazorati |
| ## **FCRA** | Moliya | ## ⭐ **Aniqlik, shaffoflik, XATOGA E'TIROZ** |
| ## **EEOC** | Ishga qabul | Kamsitishga qarshi |

> ## 💡 **`FCRA` NING UCHINCHI BANDI —** ## ⭐ **"xatoga e'tiroz bildirish huquqi"** — ## bu ## 🏆 **73-moduldagi "qaytarish yo'li"** ning ## 🔑 **qonuniy shakli**.

> ## 💥 **VA BIZ UNI 73-MODULDA ## O'LCHAB, "YO'Q" DEGAN EDIK.**

---

## 2. 🔬 *"Yamoq"* ni **o'lchaymiz**

```python
SHTATLAR = {
 "Kaliforniya (CCPA/CPRA)": {"opt_out", "kirish", "o'chirish", "shaffoflik"},
 "Nyu-York (LL144)":        {"bias auditi", "nomzodga xabar", "audit e'loni"},
 "Illinoys (BIPA)":         {"biometrik rozilik", "biometrik saqlash muddati"},
 "Kolorado (CPA)":          {"opt_out", "ta'sir baholovi", "kirish"},
 "Virjiniya (VCDPA)":       {"opt_out", "kirish", "o'chirish"},
}
```

### ✅ Haqiqiy natija

```
   nechta shtat   jami noyob talab
              1                  4
              2                  7
              3                  9
              4                 10
              5                 10

  Hamma 5 shtatda ishlash: 10 ta noyob talab
  Bitta shtatda:            4 ta
  -> 2.5x ko'p
```

> ## 🔑 **VA E'TIBOR BERING — O'SISH TO'XTAYDI:** ## `4 → 7 → 9 → 10 → 10`.

> ## 💡 **SABAB — QOPLASHISH:** ## `opt_out` va `kirish` ## ⭐ **uchta shtatda ham** bor. ## ## 🏆 Ya'ni yamoq **chalkash**, ## lekin **cheksiz emas**.

### 🏆 Amaliy xulosa

> ## ⭐ **`4 → 10` — BU JIDDIY,** ## lekin ## 💡 **10 ta talab — bajarib bo'ladigan ro'yxat**.

> ## 💥 **HAQIQIY QIYINCHILIK — SONDA EMAS:** ## ## ⚠️ har shtat **boshqacha ta'riflaydi**, ## boshqa **muddat** beradi, ## va boshqa ## 🔑 **jarima** qo'yadi.

---

## 3. 💥 NY LL144 — **bizga to'g'ridan-to'g'ri tegishli**

> *"Yaqinda qabul qilingan Nyu-York qonuni kompaniyalardan yollashda
> ishlatiladigan AI vositalari uchun **bias auditini** o'tkazishni
> talab qiladi."*

### 🔑 Uchta talab

| Talab | Bizda bormi |
|---|---|
| ## **Mustaqil bias auditi** | ## 💥 **Yo'q** *(71-modul)* |
| ## **Audit natijasini E'LON qilish** | ## 💥 **Yo'q** |
| Nomzodga oldindan xabar | ## 💥 **Yo'q** |

> ## 💥💥💥 **3/3 BAJARILMAGAN.**

### 🏆 Lekin bizda **vositalar** bor

69–71-modullarda aynan shu auditni **qurgan edik**:

```python
def ll144_auditi(qarorlar, himoyalangan_belgilar):
    """💡 69-71-modullardagi funksiyalarni birlashtiradi."""
    hisobot = {}

    for belgi in himoyalangan_belgilar:
        ulush, nisbat = nomutanosib_tasir(qarorlar, belgi)   # 69-modul
        hisobot[belgi] = {
            "tanlov_nisbati": ulush,
            "ta'sir_nisbati": nisbat,
            "80%_qoidasi": "O'TDI" if nisbat >= 0.80 else "YIQILDI",
        }

    # ⚠️ 69-MODULNING SABOQI: sezgirlik nazoratisiz audit YAROQSIZ
    hisobot["_nazorat"] = sezgirlik_nazorati(qarorlar)       # 69-modul
    return hisobot
```

> ## 🏆 **OXIRGI QATOR — 69-MODULNING ASOSIY SABOQI:** ## ## 💥 *"farq yo'q"* deb hisobot beruvchi audit ## ⭐ **sezgirlik nazoratisiz — yaroqsiz**.

> ## 💡 **VA QONUN BUNI TALAB QILMAYDI.** ## ## 🔑 Ya'ni **qonunga muvofiq**, lekin ## 💥 **ilmiy jihatdan bo'sh** audit ## chiqarish **mumkin**.

---

## 4. ⚠️ AQSh modelining ikki tomoni

> *"AQSh modeli sohalarga ko'proq **moslashuvchanlik** beradi...
> Lekin bu markazlashmagan tizim **nomuvofiqlik va murakkablik**
> ham yaratadi."*

| Ustunlik | Kamchilik |
|---|---|
| Tez rivojlanish | ## 💥 **10 ta talab, 5 ta shtat** |
| Sohaga moslashgan | ## 💥 **Kichik biznes uchun qimmat** |
| ## **Innovatsiya erkinligi** | ## ⚠️ **Foydalanuvchi himoyasi — shtatga bog'liq** |

> ## 🔑 **UCHINCHI QATOR — ETIK MASALA:** ## ## ⭐ bir shtatdagi foydalanuvchi ## 💥 **boshqasidagidan kam himoyalangan**.

> ## 💡 **VA BU — 74-MODULDAGI ## "TENGLIK" MAVZUSINING ## ⭐ HUQUQIY VERSIYASI.**

---

## 5. 🏆 Amaliy yondashuv — **eng qattig'iga qurish**

```python
def aqsh_talablari(shtatlar, SHTATLAR):
    """💡 Har shtatga alohida tizim qurmang."""
    jami = set().union(*(SHTATLAR[s] for s in shtatlar))
    print(f"  {len(shtatlar)} shtat -> {len(jami)} talab")
    for t in sorted(jami):
        kim = [s for s in shtatlar if t in SHTATLAR[s]]
        print(f"    {t:28} {len(kim)}/{len(shtatlar)} shtatda")
    return jami
```

> ## 🏆 **VA `len(kim)` USTUNI MUHIM:** ## ## ⭐ **hamma shtatda** talab qilinadigan narsa ## *(`opt_out`, `kirish`)* — ## 🔑 **birinchi navbatda** bajariladi.

---

## 🎯 Nazorat savollari

1. Beshta shtatda ishlash nechta talab keltirib chiqaradi?
2. Nega o'sish `10` da to'xtadi?
3. NY LL144 bizdan nima talab qiladi? Bajarilganmi?
4. Qonunga muvofiq audit *"yaroqli"* auditmi?

<details>
<summary>Javoblar</summary>

1. ## **10 ta** — bitta shtatdagi **4 ta** ga nisbatan ⭐ **2.5 barobar**.
2. ## **Qoplashish tufayli.** `opt_out` va `kirish` ⭐ **uchta shtatda ham** bor. 🏆 Ya'ni yamoq **chalkash**, lekin **cheksiz emas**. 💥 Haqiqiy qiyinchilik sonda emas — har shtat **boshqacha ta'riflaydi** va boshqa **jarima** qo'yadi.
3. ## **Uchta:** mustaqil bias auditi, natijani **e'lon qilish**, nomzodga **oldindan xabar**. 💥 **3/3 bajarilmagan** — garchi vositalarni 69–71-modullarda **qurgan** bo'lsak ham.
4. ## **Yo'q — shart emas.** 🔑 69-modulning saboqi: **sezgirlik nazoratisiz** audit ⭐ *"farq yo'q"* degan natija bersa, u **yaroqsiz**. 💥 Qonun buni **talab qilmaydi**, ya'ni **muvofiq, lekin bo'sh** audit chiqarish mumkin.

</details>

---

⬅️ [2-dars](02-EU-GDPR-and-AI-Act.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Asia-Pacific.md)
