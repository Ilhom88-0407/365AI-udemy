# 1-dars. LLM ni hosting qilish vs API ishlatish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 'hosting haftasiga minglab dollar' deydi. Biz hisobladik — $1 680/hafta. Va teng nuqtani topdik: sekundiga 1.7 ta so'rov."**

---

## 1. Ikki yo'l

```
   ┌───────────────────────────────┐   ┌───────────────────────────────┐
   │  ① O'ZINGIZ HOSTING QILASIZ   │   │  ② API ORQALI ISHLATASIZ      │
   ├───────────────────────────────┤   ├───────────────────────────────┤
   │  · to'liq nazorat             │   │  · bir necha qator kod        │
   │  · fine-tuning mumkin         │   │  · apparat KERAK EMAS         │
   │  · ma'lumot ichkarida         │   │  · avtomatik masshtablanish   │
   │                               │   │                               │
   │  💥 GPU kerak                 │   │  💥 ma'lumot tashqariga ketadi│
   │  💥 doimiy xarajat            │   │  💥 narx so'rovga bog'liq     │
   │  💥 texnik bilim              │   │  💥 provayderga bog'liqlik    │
   └───────────────────────────────┘   └───────────────────────────────┘
```

> ## ✅ **KURSNING TANLOVI — API.** ## Sabab: *"maxsus apparat va ilg'or texnik bilim talab qilmaydi."* ## ## 🔑 **Bu — prototip uchun to'g'ri tanlov.**

---

## 2. 🔬 *"Haftasiga minglab dollar"* — tekshiramiz

> ## 🔑 **KURS AYTADI:** ## *"Falcon 180B kabi ochiq model bulut platformasida ## faqat hisoblash va saqlash uchun ## **haftasiga minglab dollar** turishi mumkin."*

### 📐 Hisoblaymiz

```python
GPU_SOAT = 2.50          # A100 80GB taxminiy $/soat (bulut)
GPU_SONI = 4             # 180B model uchun minimal
soat_hafta = 24 * 7

hosting_hafta = GPU_SOAT * GPU_SONI * soat_hafta
print(f"${hosting_hafta:,.0f} / hafta = ${hosting_hafta*52:,.0f} / yil")
```

```
$1,680 / hafta = $87,360 / yil
```

> ## ✅ **KURS HAQ** — *"minglab dollar/hafta"* **tasdiqlandi**.
>
> ## ## ⚠️ **VA BU — ENG PAST BAHO.** ## Hisobga olinmagan: tarmoq, saqlash, monitoring, ## zaxira, DevOps ishi.

> ## 🔧 **TUZATISH — 2-DARSDA ANIQROQ HISOBLADIK.** ## 180B model `fp16` da **469 GB** xotira talab qiladi, ## ya'ni **4 emas, 6 ta A100**. ## ## 💥 **Haqiqiy narx: $2 520/hafta = $131 040/yil.** ## Teng nuqta ham **1.5× yuqoriga** siljiydi.

| Xarajat | Haftasiga |
|---|---|
| 4 × A100 GPU | ## **$1 680** |
| Saqlash *(1 TB SSD)* | ~$25 |
| Tarmoq chiqishi | ~$50–200 |
| Monitoring | ~$20 |
| ## **DevOps vaqti** | ## 💥 **eng qimmati** |

---

## 3. ⭐⭐ Teng nuqta: **necha so'rovdan keyin API qimmatroq?**

```python
kir_t, chiq_t = 3000, 2000        # bitta so'rovdagi tokenlar

for m, (ki, ch) in NARXLAR.items():
    narx_1 = (kir_t * ki + chiq_t * ch) / 1e6
    n = hosting_hafta / narx_1
    print(f"{m:16s} ${narx_1:.6f}/so'rov -> haftasiga {n:>12,.0f} so'rov")
    print(f"{'':16s} = sekundiga {n/(24*7)/3600:.1f} so'rov")
```

### 📊 Natija

| Model | Narx/so'rov | Haftasiga so'rov | ## Sekundiga |
|---|---|---|---|
| ## `gpt-4o-mini` | $0.001650 | ## **1 018 182** | ## 💥 **1.7** |
| `gpt-3.5-turbo` | $0.004500 | 373 333 | 0.6 |
| ## `gpt-4o` | $0.027500 | 61 091 | ## ⭐ **0.1** |

> ## 💥💥 **SEKUNDIGA 1.7 TA SO'ROV — VA BU JUDA KATTA RAQAM.**
>
> ## ## 🔑 **1.7 so'rov/s = kuniga ~147 000 so'rov.** ## Bu — **jiddiy trafik**. ## ## ⭐ **Undan pastda — API har doim arzonroq.**

### 💡 Va nima uchun bu raqam **aldamchi**

| Nima hisobga olinmagan | Ta'siri |
|---|---|
| ## **GPU 24/7 ishlaydi** | ## 💥 **so'rov bo'lmasa ham to'laysiz** |
| API — **so'rov bo'yicha** | ## ⭐ **nol trafik = nol narx** |
| Trafik notekis | ## 💥 **cho'qqi uchun GPU kerak** |
| Model yangilanishi | ## ⭐ API da **avtomatik** |

> ## 🏆 **HAQIQIY QOIDA:** ## API **1.7 so'rov/s dan past** trafikda arzonroq. ## ## ⭐ **Va aksariyat loyihalar hech qachon u yerga yetmaydi.**

---

## 4. 🏆 Uchinchi yo'l — kurs aytmagan

62-modulda **mahalliy kichik model** ni sinadik:

| | Hosting *(180B)* | API | ## Mahalliy *(0.5B)* |
|---|---|---|---|
| Apparat | ## 💥 **4× A100** | yo'q | ## ⭐ **oddiy noutbuk** |
| Haftalik narx | ## 💥 **$1 680** | so'rovga qarab | ## 🏆 **$0** |
| Sifat | ## 🏆 **yuqori** | ## 🏆 **yuqori** | ## ⚠️ **oddiy** |
| Maxfiylik | ## ⭐ **to'liq** | ## 💥 **tashqariga** | ## 🏆 **to'liq** |
| Internet | kerak *(bulut)* | ## 💥 **shart** | ## 🏆 **kerak emas** |
| Kechikish | past | 1–3 s | ## ⭐ **0.8 s** |

> ## 🔑 **UCHINCHI YO'L — QACHON MOS?**
>
> | Vaziyat | Tanlov |
> |---|---|
> | Prototip, o'rganish | ## ⭐ **mahalliy kichik model** |
> | Nozik ma'lumot | ## ⭐ **mahalliy** |
> | Yuqori sifat kerak | ## ⭐ **API** |
> | Internet yo'q | ## ⭐ **mahalliy** |
> | Kuniga > 150 000 so'rov | ## ⭐ **hosting** |

---

## 5. 🔧 Qaror qabul qiluvchi funksiya

```python
def qaysi_yol(sorov_kuniga, nozik_malumot=False, sifat="yuqori",
              internet=True, byudjet_oylik=None):
    """Uchta yo'ldan qaysi biri mos kelishini aytadi."""
    sabablar = []

    if not internet:
        return "mahalliy", ["internet yo'q — boshqa iloj yo'q"]

    if nozik_malumot:
        sabablar.append("nozik ma'lumot — tashqariga chiqmasligi kerak")
        return ("mahalliy" if sifat != "yuqori" else "hosting"), sabablar

    # ⭐ teng nuqta: gpt-4o-mini uchun ~147 000 so'rov/kun
    TENG = 147_000
    if sorov_kuniga > TENG:
        sabablar.append(f"{sorov_kuniga:,} > {TENG:,} so'rov/kun — API qimmat")
        return "hosting", sabablar

    if sifat == "oddiy":
        sabablar.append("oddiy sifat yetarli — bepul mahalliy model bor")
        return "mahalliy", sabablar

    narx = sorov_kuniga * 30 * 0.001650     # gpt-4o-mini
    sabablar.append(f"taxminiy oylik narx ${narx:,.2f}")
    if byudjet_oylik is not None and narx > byudjet_oylik:
        sabablar.append(f"💥 byudjet ${byudjet_oylik:,.2f} dan oshadi")
        return "mahalliy", sabablar

    sabablar.append("trafik past, sifat kerak — API eng oson")
    return "api", sabablar
```

```python
for kw in [
    {"sorov_kuniga": 100},
    {"sorov_kuniga": 100, "nozik_malumot": True},
    {"sorov_kuniga": 500_000},
    {"sorov_kuniga": 5000, "byudjet_oylik": 100},
    {"sorov_kuniga": 50, "internet": False},
]:
    y, s = qaysi_yol(**kw)
    print(f"{str(kw):58s} -> {y.upper():9s} {s}")
```

### ✅ Haqiqiy natija

```
{'sorov_kuniga': 100}                                      -> API       ['taxminiy oylik narx $4.95', 'trafik past, sifat kerak — API eng oson']
{'sorov_kuniga': 100, 'nozik_malumot': True}               -> HOSTING   ["nozik ma'lumot — tashqariga chiqmasligi kerak"]
{'sorov_kuniga': 500000}                                   -> HOSTING   ["500,000 > 147,000 so'rov/kun — API qimmat"]
{'sorov_kuniga': 5000, 'byudjet_oylik': 100}               -> MAHALLIY  ['taxminiy oylik narx $247.50', '💥 byudjet $100.00 dan oshadi']
{'sorov_kuniga': 50, 'internet': False}                    -> MAHALLIY  ["internet yo'q — boshqa iloj yo'q"]
```

> ## ⭐ **E'TIBOR BERING — TO'RTINCHI HOLAT:** ## kuniga atigi 5 000 so'rov, lekin **oyiga $247.50**. ## ## 💥 **$100 byudjet bilan — API mos kelmaydi.**
>
> ## ## 🔑 **VA BU — ENG KO'P UCHRAYDIGAN VAZIYAT:** ## trafik kam, lekin byudjet ham kam.

---

## 🎯 Nazorat savollari

1. Kursning *"minglab dollar/hafta"* da'vosi to'g'rimi?
2. `gpt-4o-mini` uchun teng nuqta qancha?
3. Nega teng nuqta aldamchi?
4. Uchinchi yo'l nima va u qachon mos?
5. Kuniga 5 000 so'rov — bu ko'pmi yoki kam?

<details>
<summary>Javoblar</summary>

1. ## **Ha.** 4 × A100 @ $2.50/soat, 24/7 = **$1 680/hafta** = $87 360/yil. Va bu — **eng past baho** (tarmoq, saqlash, DevOps hisobga olinmagan).
2. ## **Sekundiga 1.7 so'rov** = kuniga ~147 000 = haftasiga ~1 018 000. Undan pastda — API arzonroq.
3. Chunki **GPU 24/7 ishlaydi** — so'rov bo'lmasa ham to'laysiz. API esa **so'rov bo'yicha**. Bundan tashqari trafik **notekis** — cho'qqi uchun GPU kerak.
4. ## **Mahalliy kichik model** (62-modul: `Qwen2.5-0.5B`). Mos: prototip, o'rganish, nozik ma'lumot, internetsiz ish, past byudjet. Mos emas: yuqori sifat kerak bo'lganda.
5. ## **Trafik jihatidan — kam** (teng nuqtaning 3.4% i). ## **Lekin narx jihatidan — ko'p**: oyiga **$247.50**. Bu — ko'p o'quv loyihalari uchun **juda qimmat**.

</details>

---

⬅️ [62-modul](../62-LLM-Engineering-Introduction/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-Open-vs-Closed-Source.md)
