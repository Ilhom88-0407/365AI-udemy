# 2-dars. Ochiq vs yopiq kodli modellar ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 'ko'proq parametr = yaxshiroq' deydi va darrov 'lekin yagona omil emas' deb qo'shadi. 60-modulda buni o'lchagan edik: tiny (37.8 M) = base (72.6 M) = small (241.7 M). Bir xil WER."**

---

## 1. Ikki turkum

| | Ochiq kodli | Yopiq kodli |
|---|---|---|
| Og'irliklar | ## ⭐ **yuklab olish mumkin** | ## 💥 **yo'q** |
| Fine-tuning | ## ⭐ **mumkin** | ## ⚠️ **cheklangan** |
| Offline | ## ⭐ **ha** | ## 💥 **yo'q** |
| Narx | ## ⭐ **apparat** | token bo'yicha |
| Sifat *(2026)* | ## ⚠️ **yaqinlashmoqda** | ## 🏆 **odatda yuqori** |
| Litsenziya | ## ⚠️ **O'QING!** | shartnoma |

> ## ⚠️ **"OCHIQ KODLI" ≠ "ISTAGANINGIZNI QILING".**
>
> | Litsenziya | Tijorat uchun |
> |---|---|
> | Apache 2.0, MIT | ## ✅ **erkin** |
> | Llama Community License | ## ⚠️ **700 mln foydalanuvchidan keyin ruxsat kerak** |
> | ## Ba'zi modellar | ## 💥 **faqat tadqiqot uchun** |
>
> ## ## 🔑 **Modelni tanlashdan oldin LITSENZIYANI O'QING.**

---

## 2. 💥 *"Ko'proq parametr = yaxshiroq"* — kurs o'zi shubhalanadi

> ## 🔑 **KURS AYTADI:** ## *"Parametrlar soni modelning murakkab naqshlarni ## ushlash qobiliyatiga sezilarli ta'sir qiladi, ## **lekin bu yagona omil emas**."*

### 🔬 60-modulda buni **o'lchagan** edik

| Model | Parametrlar | Vaqt | ## WER |
|---|---|---|---|
| `whisper-tiny` | ## ⭐ **37.8 M** | ## 🏆 **2.21 s** | ## **0.0164** |
| `whisper-base` | 72.6 M | 2.91 s | ## **0.0164** |
| `whisper-small` | ## 💥 **241.7 M** | ## 💥 **6.81 s** | ## **0.0164** |

> ## 💥💥 **6.4× KO'PROQ PARAMETR — BIR XIL NATIJA.**
>
> ## ## 🔑 **VA BU — ASR MODELIDA. LLM DA HAM SHUNDAY.**

### ⚠️ Parametrlar soni **nimani** bashorat qiladi?

| Nima | Bog'liqmi? |
|---|---|
| ## **Xotira talabi** | ## ✅ **to'g'ridan-to'g'ri** |
| ## **Kechikish** | ## ✅ **to'g'ridan-to'g'ri** |
| ## **Narx** *(hosting)* | ## ✅ **to'g'ridan-to'g'ri** |
| Umumiy bilim | ⚠️ **odatda ha** |
| ## **Sizning vazifangizdagi sifat** | ## 💥 **KAFOLAT YO'Q** |

> ## 🏆 **QOIDA:** ## **Parametrlar sonini emas, ## O'Z VAZIFANGIZDAGI NATIJANI o'lchang.**

---

## 3. 📐 Parametrlar → xotira

```python
def model_xotirasi(parametrlar_mlrd, aniqlik="fp16"):
    """Modelni yuklash uchun qancha xotira kerak?"""
    BAYT = {"fp32": 4, "fp16": 2, "int8": 1, "int4": 0.5}
    if aniqlik not in BAYT:
        raise ValueError(f"noma'lum aniqlik: {aniqlik}")
    ogirlik = parametrlar_mlrd * 1e9 * BAYT[aniqlik] / 1024**3
    return {
        "og_irliklar_GB": round(ogirlik, 2),
        # ⚠️ KV-kesh, aktivatsiyalar va parchalanish uchun ~1.4×
        "amaliy_GB": round(ogirlik * 1.4, 2),
        "A100_80GB_soni": max(1, math.ceil(ogirlik * 1.4 / 80)),
    }
```

```python
for p in [0.5, 7, 13, 70, 180]:
    for a in ["fp16", "int4"]:
        d = model_xotirasi(p, a)
        print(f"{p:>5}B {a:5s} og'irliklar {d['og_irliklar_GB']:>7} GB · "
              f"amaliy {d['amaliy_GB']:>7} GB · {d['A100_80GB_soni']} × A100")
```

### 📊 Natija

| Model | `fp16` og'irliklar | `fp16` amaliy | ## `int4` amaliy | A100 *(fp16)* |
|---|---|---|---|---|
| ## **0.5B** | ## 🏆 **0.93 GB** | ## 🏆 **1.30 GB** | ## 🏆 **0.33 GB** | 1 |
| 7B | 13.04 GB | 18.25 GB | ## ⭐ **4.56 GB** | 1 |
| 13B | 24.21 GB | 33.90 GB | 8.48 GB | 1 |
| 70B | 130.39 GB | 182.54 GB | ## ⚠️ **45.63 GB** | ## **3** |
| ## **180B** | ## 💥 **335.28 GB** | ## 💥 **469.39 GB** | 117.35 GB | ## 💥 **6** |

> ## 🔑 **1-DARSDA 180B UCHUN "4 × A100" DEGAN EDIK.** ## ## 💥 **Aniqroq hisob: `fp16` da 6 ta kerak.** ## Ya'ni haftalik narx **$1 680 emas, $2 520**.
>
> ## ## ⭐ **`int4` KVANTLASHTIRISH BILAN — 2 ta yetadi.** ## Bu **4× arzonroq**, sifat esa odatda **1–3% pasayadi**.

> ## 💡 **VA MANA NEGA `int4` MUHIM:** ## `7B` model **4.56 GB** ga tushadi — ## ya'ni **oddiy o'yin videokartasida** ishlaydi.

---

## 4. ⭐ Model tanlash — amaliy jadval

| Vazifa | Tavsiya | Nega |
|---|---|---|
| O'rganish, prototip | ## ⭐ **0.5–3B mahalliy** | bepul, tez, offline |
| Ishlab chiqarish, ingliz | ## ⭐ **API** *(mini sinf)* | sifat/narx muvozanati |
| Nozik ma'lumot | ## ⭐ **7–13B mahalliy, `int4`** | ma'lumot chiqmaydi |
| ## O'zbek tili | ## ⚠️ **API** *(katta model)* | kichik modellar **zaif** |
| Juda yuqori trafik | hosting | 1-dars, teng nuqta |
| Maxsus soha | fine-tuning | ochiq model + o'z ma'lumoting |

> ## 💥 **O'ZBEK TILI QATORIGA E'TIBOR BERING.** ## 62-modulda o'lchadik: ## `Qwen2.5-0.5B` o'zbekcha **buzuq javob** berdi ## *(`"Sizhi salom! Qaysiz mumkin?"`)*.
>
> ## ## 🔑 **Kichik model + kam resursli til = ishlamaydi.**

---

## 5. 🔧 Model taqqoslash jadvali

```python
import math


MODELLAR = [
    # nom, parametr(B), ochiq, litsenziya
    ("Qwen2.5-0.5B-Instruct", 0.5,  True,  "Apache 2.0"),
    ("Qwen2.5-7B-Instruct",   7.0,  True,  "Apache 2.0"),
    ("Llama-3.1-8B-Instruct", 8.0,  True,  "Llama Community"),
    ("Mistral-7B-Instruct",   7.0,  True,  "Apache 2.0"),
    ("Falcon-180B",         180.0,  True,  "TII Falcon (shartli)"),
    ("gpt-4o-mini",           None, False, "OpenAI shartnoma"),
    ("gpt-4o",                None, False, "OpenAI shartnoma"),
]


def model_jadvali(modellar=None, aniqlik="int4"):
    modellar = modellar or MODELLAR
    print(f"  {'model':24s} {'par(B)':>7} {'ochiq':>6} {'xotira':>9} "
          f"{'noutbuk?':>9}  litsenziya")
    print("  " + "-" * 78)
    for nom, p, ochiq, lits in modellar:
        if p is None:
            print(f"  {nom:24s} {'—':>7} {'💥':>5} {'—':>9} {'—':>9}  {lits}")
            continue
        d = model_xotirasi(p, aniqlik)
        gb = d["amaliy_GB"]
        nb = "✅ ha" if gb <= 8 else ("⚠️ 16GB" if gb <= 16 else "💥 yo'q")
        print(f"  {nom:24s} {p:>7} {'⭐':>5} {gb:>8.2f}G {nb:>9}  {lits}")
```

```python
model_jadvali(aniqlik="int4")
```

### ✅ Haqiqiy natija

```
  model                     par(B)  ochiq    xotira  noutbuk?  litsenziya
  ------------------------------------------------------------------------------
  Qwen2.5-0.5B-Instruct        0.5     ⭐     0.33G      ✅ ha  Apache 2.0
  Qwen2.5-7B-Instruct          7.0     ⭐     4.56G      ✅ ha  Apache 2.0
  Llama-3.1-8B-Instruct        8.0     ⭐     5.22G      ✅ ha  Llama Community
  Mistral-7B-Instruct          7.0     ⭐     4.56G      ✅ ha  Apache 2.0
  Falcon-180B                180.0     ⭐   117.35G    💥 yo'q  TII Falcon (shartli)
  gpt-4o-mini                    —     💥         —         —  OpenAI shartnoma
  gpt-4o                         —     💥         —         —  OpenAI shartnoma
```

> ## 🏆🏆 **`int4` BILAN 8B MODEL — 5.22 GB.** ## Ya'ni **8 GB videokartali oddiy noutbukda** ishlaydi. ## ## ⭐ **Bu — 2026-yildagi eng muhim o'zgarish.**

> ## ⚠️ **LITSENZIYA USTUNIGA E'TIBOR BERING.** ## `Apache 2.0` — **erkin**. ## `Llama Community` — **shartli**. ## `TII Falcon` — **shartli**. ## ## 💥 **Tijorat loyihasida — huquqshunosga ko'rsating.**

---

## 🎯 Nazorat savollari

1. *"Ko'proq parametr = yaxshiroq"* — bu qoidami?
2. Parametrlar soni nimani **aniq** bashorat qiladi?
3. 180B model `fp16` da nechta A100 talab qiladi?
4. `int4` kvantlashtirish nima beradi?
5. *"Ochiq kodli"* — bu *"istaganingizni qiling"* deganimi?
6. O'zbek tili uchun qaysi model kerak?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q.** 60-modulda o'lchadik: `whisper-tiny` (37.8 M), `base` (72.6 M) va `small` (241.7 M) — **bir xil WER 0.0164**. **6.4× ko'proq parametr, bir xil natija.**
2. **Xotira talabi, kechikish va narx** — bularni **to'g'ridan-to'g'ri**. **Sizning vazifangizdagi sifatni — kafolatlamaydi.**
3. ## **6 ta** (335.28 GB og'irliklar × 1.4 = 469.39 GB amaliy ÷ 80 GB). 1-darsda men **4 ta** degan edim — **aniqroq hisob 6 ta**, ya'ni haftalik narx $1 680 emas, **$2 520**.
4. **4× kam xotira.** `7B` model 18.25 GB dan **4.56 GB** ga tushadi — oddiy noutbukda ishlaydi. Sifat odatda **1–3% pasayadi**.
5. ## **Yo'q.** `Apache 2.0`/`MIT` — erkin. `Llama Community` — 700 mln foydalanuvchidan keyin **ruxsat kerak**. Ba'zilari — **faqat tadqiqot uchun**. ## **Litsenziyani o'qing.**
6. ## **Katta model** (API yoki 70B+). 62-modulda o'lchadik: `Qwen2.5-0.5B` o'zbekcha **buzuq javob** berdi. **Kichik model + kam resursli til = ishlamaydi.**

</details>

---

⬅️ [1-dars](01-Hosting-vs-API.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Tokens.md)
