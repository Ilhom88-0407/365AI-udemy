# 1-dars. Kursga kirish ⭐

## 🎬 Boshlashdan oldin

> **"Kurs $6.4 mlrd → $140.8 mlrd deydi. Biz hisobladik — bu yiliga 41% o'sish. Smartfon portlashidan ham tez. Bunday prognozlarga qanday qarash kerak?"**

---

## 1. Nima quramiz?

**`Ace Interview`** — LLM asosidagi **intervyu simulyatori**:

```
   ┌─────────────────────────────────────────────────────┐
   │  FOYDALANUVCHI                                      │
   │    · lavozim tanlaydi     (Data Scientist)          │
   │    · kompaniya tanlaydi   (Google)                  │
   │    · tajribasini kiritadi                           │
   └──────────────────────┬──────────────────────────────┘
                          ↓
   ┌─────────────────────────────────────────────────────┐
   │  LLM                                                │
   │    · HR intervyu    (xulq, motivatsiya, moslik)     │
   │    · Texnik intervyu (kod, SQL, keys)               │
   │    · savol -> javob -> keyingi savol                │
   └──────────────────────┬──────────────────────────────┘
                          ↓
   ┌─────────────────────────────────────────────────────┐
   │  BAHOLASH                                           │
   │    · kuchli tomonlar                                │
   │    · yaxshilanishi kerak bo'lgan joylar             │
   │    · ball                                           │
   └─────────────────────────────────────────────────────┘
```

| Bo'lim | Modullar | Nima |
|---|---|---|
| **Rejalashtirish** | 63 | Hosting vs API, tokenlar, narx, diagrammalar |
| **Prototip** | 64–66 | Prompt muhandisligi, Streamlit, ishlaydigan ilova |
| **Ilg'or** | 67 | Gallyutsinatsiya, prompt injection, narxni kamaytirish |

---

## 2. 🔬 Kursning raqamlari — arifmetikasini tekshiramiz

> ## 🔑 **KURS AYTADI:** ## *"Bozor hajmi 2024-yildagi **$6.4 mlrd** dan ## 2033-yilga borib **$140.8 mlrd** ga yetadi."*

### 📐 Bu qanday o'sish?

```python
b2024, b2033 = 6.4, 140.8
yil = 2033 - 2024
cagr = (b2033 / b2024) ** (1 / yil) - 1

print(f"o'sish : {b2033/b2024:.1f}×")
print(f"CAGR   : {cagr*100:.1f}% yiliga")
```

```
o'sish : 22.0×
CAGR   : 41.0% yiliga
```

### 📊 Taqqoslash

| Bozor | Davr | CAGR |
|---|---|---|
| S&P 500 | uzoq muddat | 10.0% |
| Internet reklama | 2000–2010 | 19.0% |
| Bulut hisoblash | 2010–2020 | 20.0% |
| ## Smartfonlar | 2007–2015 | ## **35.0%** |
| ## **LLM *(kurs prognozi)*** | 2024–2033 | ## 💥 **41.0%** |

> ## ⚠️ **KURS BASHORATI — SMARTFON PORTLASHIDAN HAM TEZ.**
>
> ## ## 🔑 **BU "YOLG'ON" DEGANI EMAS** — bu **juda optimistik** degani. ## Bozor tadqiqoti hisobotlari odatda ## **eng yuqori senariyni** ko'rsatadi.

### 🔬 Agar sekinroq bo'lsa?

| CAGR | 2033-yilda |
|---|---|
| 20% *(bulut kabi)* | ## **$33.0 mlrd** |
| 25% | $47.7 mlrd |
| 30% | $67.9 mlrd |
| ## 41% *(kurs)* | ## **$141.0 mlrd** |

> ## 💡 **20% VA 41% ORASIDA — 4.3× FARQ.** ## ## 🔑 **Biznes rejasini prognozga emas, ## o'zingizning birinchi 10 ta mijozingizga asoslang.**

---

## 3. ⚠️ McKinsey raqamlari

> ## 🔑 **KURS AYTADI:** ## *"Tashkilotlarning **72%** i AI ni qabul qilgan, ## **65%** i generativ AI dan muntazam foydalanadi — ## 2023-dagi **33%** dan o'sgan."*

| Nima tekshirish kerak | Nega |
|---|---|
| ## **Manba** | McKinsey *State of AI* so'rovi *(2024)* |
| ## **Usul** | ## ⚠️ **o'z-o'zini baholash** — anketa |
| ## **Namuna** | ## ⚠️ **odatda yirik kompaniyalar** |
| *"Qabul qilgan"* ta'rifi | ## ⚠️ **bitta pilot loyiha ham hisoblanadi** |

> ## ⚠️ **"65% MUNTAZAM FOYDALANADI"** ## — bu *"ishlab chiqarishda ishlatadi"* degani **emas**. ## Anketada *"kamida bitta funksiyada"* deb so'raladi.

> ## 🏆 **DARS:** ## Raqamni ko'rganda **uchta savol** bering: ## ① **kim** o'lchagan? ② **qanday** o'lchagan? ③ **nima** deb ta'riflagan?
>
> ## ## 💡 **BU — BUTUN BO'LIM DAVOMIDA QILGANIMIZ.**

---

## 4. ⭐⭐ Kurs aytmagan raqam: **tilingiz narxga ta'sir qiladi**

LLM lar **tokenlar** bilan ishlaydi va **token bo'yicha to'lanadi**. Va **turli tillar turlicha tokenlanadi**.

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")       # GPT-4o oilasi

NAMUNA = {
    "ingliz": "Machine learning models require large amounts of training data.",
    "o'zbek": "Mashinali o'rganish modellari katta hajmdagi o'quv ma'lumotlarini talab qiladi.",
    "rus":    "Модели машинного обучения требуют больших объёмов обучающих данных.",
}
for til, t in NAMUNA.items():
    print(f"{til:8s} {len(t):3d} belgi -> {len(enc.encode(t)):3d} token")
```

### 📊 Natija

| Til | Belgi | `o200k` | `cl100k` | Belgi/token | ## Nisbat |
|---|---|---|---|---|---|
| ## **Ingliz** | 63 | ## 🏆 **10** | 10 | ## 🏆 **6.30** | 1.00× |
| Nemis | 73 | 14 | 20 | 5.21 | 1.40× |
| Fransuz | 84 | 15 | 20 | 5.60 | 1.50× |
| Rus | 67 | 15 | 28 | 4.47 | 1.50× |
| Turk | 67 | 16 | 27 | 4.19 | 1.60× |
| ## **O'zbek** | 79 | ## 💥 **23** | ## 💥 **33** | ## 💥 **3.43** | ## 💥 **2.30×** |

> ## 💥💥💥 **O'ZBEKCHA MATN INGLIZCHADAN 2.30× KO'PROQ TOKEN TALAB QILADI.**
>
> ## ## 🔑 **YA'NI 2.30× QIMMATROQ.**

### 🔬 Va bu **tokenizatorga** ham bog'liq

| Tokenizator | Model oilasi | Ingliz | ## O'zbek | Nisbat |
|---|---|---|---|---|
| `cl100k_base` | GPT-3.5, GPT-4 | 10 | ## 💥 **33** | ## 💥 **3.30×** |
| ## `o200k_base` | GPT-4o va keyingilari | 10 | ## ⭐ **23** | ## ⭐ **2.30×** |

> ## 🏆 **YANGI TOKENIZATOR O'ZBEK TILINI 1.43× TEJAMLIROQ KODLAYDI** ## *(33 → 23 token)*.
>
> ## ## ⭐ **AMALIY XULOSA:** ## O'zbek tilida ishlasangiz — ## **`o200k` tokenizatorli modellarni** tanlang.

### 💡 Butun talablar ro'yxatida

| | Belgi | `o200k` | `cl100k` |
|---|---|---|---|
| Inglizcha *(6 ta talab)* | 413 | ## 🏆 **68** | 68 |
| ## O'zbekcha *(6 ta talab)* | 380 | ## 💥 **123** | ## 💥 **148** |
| **Nisbat** | 0.92× | ## 💥 **1.81×** | ## 💥 **2.18×** |

> ## ⚠️ **E'TIBOR BERING — BELGILAR SONI DEYARLI BIR XIL** *(413 vs 380)*, ## lekin **tokenlar 1.81× ko'p**. ## ## 🔑 **"Matn uzunligi" ≠ "token soni".**

---

## 5. ⭐ Nima o'rganamiz

| Ko'nikma | Modul | Kalit kerakmi? |
|---|---|---|
| Hosting vs API tanlovi | 63 | ## ✅ **yo'q** |
| Tokenlar va narx | 63 | ## ✅ **yo'q** *(`tiktoken`)* |
| Ma'lumotlar bazasi sxemasi | 63 | ## ✅ **yo'q** |
| Faoliyat diagrammalari | 63 | ## ✅ **yo'q** |
| Model sozlamalari | 64 | ⚠️ tushuntirish |
| Prompt muhandisligi | 64 | ## ✅ **mahalliy model bilan** |
| Streamlit | 65 | ## ✅ **yo'q** |
| To'liq prototip | 66 | ## ⭐ **mahalliy model bilan** |
| Gallyutsinatsiya, injection | 67 | ## ✅ **mahalliy model bilan** |

> ## 🏆 **BU KITOBDA KALITSIZ YO'L KO'RSATILADI.** ## Kurs OpenAI API ni ishlatadi *(pullik)*. ## ## ⭐ **Biz har bir tushunchani ## mahalliy, bepul model bilan ham sinaymiz** — ## va farqni **o'lchaymiz**.

---

## 6. 🔧 Foydali funksiya — token va narx kalkulyatori

```python
import tiktoken


NARXLAR = {                       # $ / 1M token — 2025-yil oxiri, TEKSHIRING!
    "gpt-4o-mini":  {"kirish": 0.150, "chiqish": 0.600, "enc": "o200k_base"},
    "gpt-4o":       {"kirish": 2.500, "chiqish": 10.00, "enc": "o200k_base"},
    "gpt-3.5-turbo": {"kirish": 0.500, "chiqish": 1.500, "enc": "cl100k_base"},
}


def token_narx(matn, model="gpt-4o-mini", chiqish_tokenlar=0):
    """Matnning token sonini va narxini hisoblaydi."""
    if model not in NARXLAR:
        raise ValueError(f"noma'lum model: {model}")
    m = NARXLAR[model]
    enc = tiktoken.get_encoding(m["enc"])
    kirish = len(enc.encode(matn))

    narx = (kirish * m["kirish"] + chiqish_tokenlar * m["chiqish"]) / 1_000_000
    return {
        "model": model,
        "kirish_tokenlar": kirish,
        "chiqish_tokenlar": chiqish_tokenlar,
        "belgilar": len(matn),
        "belgi_per_token": round(len(matn) / max(kirish, 1), 2),
        "narx_usd": round(narx, 8),
        "narx_1000_marta_usd": round(narx * 1000, 4),
    }
```

```python
import json
matn = ("Siz tajribali HR mutaxassisisiz. Data Scientist lavozimiga "
        "nomzod bilan intervyu o'tkazing. Har safar bitta savol bering.")
print(json.dumps(token_narx(matn, "gpt-4o-mini", chiqish_tokenlar=150),
                 indent=2, ensure_ascii=False))
```

```
{
  "model": "gpt-4o-mini",
  "kirish_tokenlar": 39,
  "chiqish_tokenlar": 150,
  "belgilar": 121,
  "belgi_per_token": 3.1,
  "narx_usd": 9.585e-05,
  "narx_1000_marta_usd": 0.0959
}
```

> ## ⚠️ **`NARXLAR` LUG'ATINI HAR DOIM TEKSHIRING.** ## Narxlar **tez-tez o'zgaradi** *(odatda pasayadi)*. ## ## 🔑 **Kodda qattiq yozilgan narx — eskirgan narx.**

---

## 🎯 Nazorat savollari

1. Kursning bozor prognozi qanday CAGR ni anglatadi?
2. McKinsey raqamlariga qanday qarash kerak?
3. O'zbekcha matn inglizchadan necha marta ko'p token oladi?
4. `cl100k_base` va `o200k_base` orasida o'zbek tili uchun farq bormi?
5. Nega "belgilar soni" token sonini bilish uchun yetarli emas?

<details>
<summary>Javoblar</summary>

1. **41.0% yiliga** ($6.4 → $140.8 mlrd, 9 yil = **22×**). Bu smartfon portlashidan (35%) ham tez. **Yolg'on emas, lekin juda optimistik.** 20% da natija **$33 mlrd** bo'lardi — **4.3× kam**.
2. Uchta savol: **kim** o'lchagan (McKinsey), **qanday** (o'z-o'zini baholovchi anketa, odatda yirik kompaniyalar), **nima deb ta'riflagan** (*"qabul qilgan"* — bitta pilot ham hisoblanadi).
3. ## **2.30×** (`o200k_base` bilan). `cl100k_base` bilan esa **3.30×**. Ya'ni **2.3–3.3× qimmatroq**.
4. **Ha, katta farq.** `cl100k` — 33 token, `o200k` — 23 token. Yangi tokenizator **1.43× tejamliroq**. O'zbek tilida ishlasangiz — `o200k` li modellarni tanlang.
5. Belgi/token nisbati **tilga bog'liq**: ingliz **6.30**, o'zbek **3.43**. Talablar ro'yxatida belgilar deyarli teng edi (413 vs 380), lekin **tokenlar 1.81× farq qildi**.

</details>

---

⬅️ [61-modul](../61-Final-Discussion/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-What-Does-the-Course-Cover.md)
