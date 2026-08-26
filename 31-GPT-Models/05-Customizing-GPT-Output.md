# 5-dars. GPT natijasini sozlash

## 🎬 Boshlashdan oldin

> **"Men sizga yaratgan funksiyamiz uchun turli variantlarni muhokama qilishga qaytishimizni aytgandim."**
>
> ## **"MAX TOKENS va TEMPERATURE argumentlari — modeldan boshqacha natija olish uchun o'zgartirishimiz mumkin bo'lgan narsalar."**

---

## 1. `max_tokens` — uzunlik

> ## **"Max tokens — modeldan qaytarilishini xohlagan TOKENLAR SONI. Agar buni kattaroq songa qo'ysak, uzunroq natija olamiz."**

### 💻 O'lchaymiz

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

tok = AutoTokenizer.from_pretrained("distilgpt2")
model = AutoModelForCausalLM.from_pretrained("distilgpt2")


def matn_yarat(prompt, maks_token=20, temperatura=None, seed=42):
    torch.manual_seed(seed)
    e = tok(prompt, return_tensors="pt")
    kw = dict(max_new_tokens=maks_token, pad_token_id=tok.eos_token_id)
    if temperatura is None:
        kw["do_sample"] = False
    else:
        kw.update(do_sample=True, temperature=temperatura, top_k=0)
    with torch.no_grad():
        o = model.generate(**e, **kw)
    return tok.decode(o[0], skip_special_tokens=True)


for m in [5, 20, 50]:
    print(f"maks_token={m:2d}: {matn_yarat('Once upon a time', maks_token=m)!r}\n")
```

```
maks_token= 5: 'Once upon a time of war, the United'

maks_token=20: 'Once upon a time of war, the United States was the only country in the world to have a
                military presence. The'

maks_token=50: 'Once upon a time of war, the United States was the only country in the world to have a
                military presence. The United States was the only country in the world to have a
                military presence. The United States was the only country in the world to have a
                military presence'
```

> ## ✅ **Kursdagi bilan bir xil naqsh.** O'qituvchi ham `5` da tugallanmagan bo'lak, `20` da to'liq jumla oldi.

### ⚠️ LEKIN 50 DA MUAMMO PAYDO BO'LDI

```
"The United States was the only country in the world to have a military presence."
"The United States was the only country in the world to have a military presence."
"The United States was the only country in the world to have a military presence"
                        ↑
              UCH MARTA TAKRORLANDI!
```

> ## 🔑 **`max_tokens` ni oshirish — natijani YAXSHILAMAYDI.** U shunchaki modelga **ko'proq joy** beradi. Model esa o'sha joyni **takrorlanish** bilan to'ldirishi mumkin.
>
> ## 💡 **Bu — 30-modul, 9-darsdagi muammo.** Sabab: `do_sample=False` = `argmax` = **doim eng ehtimolli so'z** = **halqa**.
>
> ✅ **Yechim — `temperature`**. Keyingi bo'lim.

---

## 2. `temperature` — tasodifiylik

> ## **"TEMPERATURE javobning TASODIFIYLIGINI boshqaradi — NOL kamroq tasodifiy, BIR esa eng tasodifiy."**

### 💻 To'rt xil temperaturada o'lchaymiz

```python
for t in [0.01, 0.5, 1.0, 1.5]:
    print(f"temperatura={t}:")
    print(f"   {matn_yarat('Once upon a time', maks_token=30, temperatura=t)!r}\n")
```

```
temperatura=0.01:
   'Once upon a time of war, the United States was the only country in the world to have a
    military presence. The United States was the only country in the world to'

temperatura=0.5:
   "Once upon a time when the first step was to have a conversation, I'd say, 'Hey,
    I'm going to have a conversation with the next person. I"

temperatura=1.0:
   'Once upon a time frame there was a barter in the mill, chewing, slicing slices and
    then grinding them together while it was still wound. For this reason ACM'

temperatura=1.5:
   'Once upon a time frame fairy tales work nowadays. Intellect will abound: science-based
    Sci-Fi would rank 133.5 for 2010. Other comparable topping ACM'
```

## 🎯 NAQSH JUDA ANIQ KO'RINIB TURIBDI

| Temp | Natija | Baho |
|---|---|---|
| **0.01** | *"...the only country... the only country..."* | ## 🔁 **TAKRORLANADI** |
| **0.5** | *"...when the first step was to have a conversation..."* | ## ✅ **ENG YAXSHI** |
| **1.0** | *"...a barter in the mill, chewing, slicing slices..."* | ⚠️ G'alati |
| **1.5** | *"...Intellect will abound: science-based Sci-Fi would rank 133.5..."* | ## ❌ **MA'NOSIZ** |

> ## **"Temperatura NOL bo'lganda javob ancha SODDA. U unchalik tasodifiy emas. U MA'NOLI."**
>
> ## **"Temperatura BIR bo'lganda u ko'proq TASODIFIY bo'ladi."**

### 🔬 Nima uchun bunday bo'ladi? *(30-modul, 9-darsdan)*

```
softmax(logits / temperature)
                     ↑
   temp KICHIK  →  ehtimolliklar O'TKIRLASHADI
                   [0.9, 0.05, 0.03, 0.02]
                   →  DOIM birinchisi tanlanadi  →  TAKRORLANISH

   temp KATTA   →  ehtimolliklar TEKISLASHADI
                   [0.3, 0.25, 0.24, 0.21]
                   →  hatto YOMON variantlar ham tanlanadi  →  MA'NOSIZLIK
```

**Buni ko'rsatamiz:**

```python
import torch

logits = torch.tensor([3.0, 1.0, 0.5, 0.2])     # 4 ta so'zning "balli"
for t in [0.1, 0.5, 1.0, 2.0]:
    p = torch.softmax(logits / t, dim=-1)
    print(f"temp={t:4.1f}: {[round(float(x), 3) for x in p]}")
```

```
temp= 0.1: [1.0, 0.0, 0.0, 0.0]
temp= 0.5: [0.972, 0.018, 0.007, 0.004]
temp= 1.0: [0.782, 0.106, 0.064, 0.048]
temp= 2.0: [0.526, 0.194, 0.151, 0.13]
```

> ## 💥 **MANA MEXANIZM — RAQAMLARDA:**
> ```
> temp=0.1  →  birinchi so'z 100%  →  boshqalar HECH QACHON tanlanmaydi
> temp=2.0  →  birinchi so'z  53%  →  to'rtinchisi ham 13% imkoniyat oladi
> ```
>
> ## 🔑 **`temperature` — bu "ijodkorlik" emas.** Bu — **ehtimollik taqsimotining o'tkirligi**.

---

## 3. ⚠️ Kursdagi bir noaniqlik

O'qituvchi aytadi: *"nol kamroq tasodifiy, BIR esa ENG TASODIFIY"*.

> ## ⚠️ **"Bir eng tasodifiy" — bu NOTO'G'RI.**
>
> ```
> OpenAI API'da temperature  →  0 dan 2 gacha
> Bizning o'lchovda           →  1.5 da 1.0 dan ANCHA tasodifiyroq
> ```
>
> **Ehtimol o'qituvchi `text-davinci-002` ning o'sha paytdagi cheklovini nazarda tutgan.** Bugungi API'da chegara — **2.0**.
>
> ## 💡 **Amaliy diapazon:**
> ```
> 0.0 – 0.3   →  faktlar, tarjima, kod        (aniqlik kerak)
> 0.7 – 0.9   →  suhbat, kontent               ⭐ ENG KENG TARQALGAN
> 1.0 – 1.5   →  ijodiy yozuv, g'oyalar        (xilma-xillik kerak)
> > 1.5       →  odatda ISHLATILMAYDI          (ma'nosizlik xavfi)
> ```

---

## 4. 🎬 Kursdagi natija bilan taqqoslash

O'qituvchi `max_tokens=50, temperature=0` da shuni oldi:

> *"Once upon a time, there was a little girl who was born with a very special gift. She could see things that others could not. She could see the future and she could see the past. She could see the present and she could see the future."*

> ## 🔑 **DIQQAT — O'QITUVCHINING NATIJASIDA HAM TAKRORLANISH BOR:**
> ```
> "She could see the future and she could see the past."
> "She could see the present and she could see the future."
>                    ↑
>        "she could see" — TO'RT MARTA
>        "the future"    — IKKI MARTA
> ```
>
> ## 💡 **Ya'ni bu — bizning kichik modelimizning kamchiligi EMAS.** `text-davinci-002` **ham** `temperature=0` da takrorlanadi. Bu — **`argmax` ning tabiati**.

Va `temperature=1` da o'qituvchi shuni oldi:

> *"Once upon a time, I was told everything. I'm guessing this might be in reference to how it's always been a strange position to be in..."*

> ## ✅ **Bizning natijamiz ham xuddi shunday**: `temp=1.0` da *"a barter in the mill, chewing, slicing slices"* — **tasodifiyroq, kamroq mantiqiy**.
>
> ## 🎯 **Xulosa: KICHIK BEPUL MODEL ham AYNAN SHU DARSNI o'rgatadi.**

---

## 5. Boshqa sozlamalar

> **"Boshqa moslashtirish variantlari ham mavjud, shuning uchun hujjatlarni ko'rib chiqing."**
>
> **"Siz ularni OpenAI API o'yin maydonchasida ham sinab ko'rishingiz mumkin."**

| Sozlama | Nima qiladi | Amalda |
|---|---|---|
| `temperature` | Tasodifiylik | **0.7–0.9** |
| `top_p` | Faqat eng ehtimolli **p** ulushidan tanlash | **0.9** |
| `top_k` | Faqat eng ehtimolli **k** tadan tanlash | **40–50** |
| `frequency_penalty` | Takrorlangan so'zlarni **jazolaydi** | ## **takrorlanishga qarshi!** |
| `presence_penalty` | Yangi mavzularni rag'batlantiradi | 0–1 |
| `stop` | Qayerda **to'xtash** kerak | `["\n\n"]` |

### 💊 Takrorlanish dardiga dori

```python
def matn_yarat_yaxshi(prompt, maks_token=50, temperatura=0.8, seed=42):
    """Takrorlanishga qarshi himoyalangan versiya."""
    torch.manual_seed(seed)
    e = tok(prompt, return_tensors="pt")
    with torch.no_grad():
        o = model.generate(
            **e,
            max_new_tokens=maks_token,
            do_sample=True,
            temperature=temperatura,
            top_p=0.9,
            repetition_penalty=1.2,        # ⭐ TAKRORLANISHNI JAZOLAYDI
            pad_token_id=tok.eos_token_id,
        )
    return tok.decode(o[0], skip_special_tokens=True)


print(repr(matn_yarat_yaxshi("Once upon a time")))
```

> ## 🔑 **`repetition_penalty=1.2`** — allaqachon ishlatilgan so'zlarning ehtimolligini **kamaytiradi**. Bu — 1-bo'limdagi *"United States... United States... United States"* muammosining **to'g'ridan-to'g'ri yechimi**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `max_tokens` nima qiladi?

**M2.** `temperature` nima qiladi?

**M3.** Amalda qaysi temperatura ko'proq ishlatiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Natijaning **maksimal uzunligini** belgilaydi *(tokenlarda)*.

**M2.** Javobning **tasodifiyligini** boshqaradi — texnik jihatdan `softmax(logits / temperature)`.

**M3.** ## **0.7–0.9** — ijodkorlik va mazmunlilik o'rtasidagi muvozanat.

</details>

### 🟡 O'rta

**M4.** ⭐ `max_tokens=50` da nima uchun takrorlanish paydo bo'ldi?

**M5.** ⭐ `temperature` matematik jihatdan nima qiladi? Kodda ko'rsating.

<details>
<summary>✅ Javoblar</summary>

**M4.** `do_sample=False` = **`argmax`** = **doim eng ehtimolli** so'z. Model bir jumlani tugatib, **yana o'sha eng ehtimolli** yo'lga tushadi → **halqa**.

> ## 💡 **`max_tokens` ni oshirish sifatni yaxshilamaydi** — u faqat **ko'proq joy** beradi. Sifat uchun `temperature` va `repetition_penalty` kerak.

**M5.**
```python
logits = torch.tensor([3.0, 1.0, 0.5, 0.2])
for t in [0.1, 0.5, 1.0, 2.0]:
    print(f"temp={t:4.1f}: {[round(float(x),3) for x in torch.softmax(logits/t, -1)]}")
```
```
temp= 0.1: [1.0, 0.0, 0.0, 0.0]
temp= 0.5: [0.972, 0.018, 0.007, 0.004]
temp= 1.0: [0.782, 0.106, 0.064, 0.048]
temp= 2.0: [0.526, 0.194, 0.151, 0.13]
```
> `temperature` — **logitlarni bo'luvchi son**. Kichik bo'lsa taqsimot **o'tkirlashadi**, katta bo'lsa **tekislashadi**.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Turli sozlamalarni **taqqoslash jadvalini** yarating.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

def sozlama_sinovi(prompt="Once upon a time", maks=30, seed=42):
    variantlar = [
        ("argmax (temp=0)",   dict(do_sample=False)),
        ("temp=0.5",          dict(do_sample=True, temperature=0.5, top_k=0)),
        ("temp=0.8",          dict(do_sample=True, temperature=0.8, top_k=0)),
        ("temp=0.8 + top_p",  dict(do_sample=True, temperature=0.8, top_p=0.9)),
        ("temp=0.8 + rep_pen", dict(do_sample=True, temperature=0.8, top_p=0.9,
                                    repetition_penalty=1.2)),
        ("temp=1.5",          dict(do_sample=True, temperature=1.5, top_k=0)),
    ]
    qatorlar = []
    for nom, kw in variantlar:
        torch.manual_seed(seed)
        e = tok(prompt, return_tensors="pt")
        with torch.no_grad():
            o = model.generate(**e, max_new_tokens=maks,
                               pad_token_id=tok.eos_token_id, **kw)
        matn = tok.decode(o[0], skip_special_tokens=True)

        # takrorlanishni O'LCHAYMIZ
        sozlar = matn.lower().split()
        noyob = len(set(sozlar)) / len(sozlar) if sozlar else 0
        qatorlar.append({
            "sozlama": nom,
            "noyoblik": round(noyob, 3),
            "natija": matn[len(prompt):][:60] + "...",
        })
    return pd.DataFrame(qatorlar)


print(sozlama_sinovi().to_string(index=False))
```

> ## 🔑 **`noyoblik` — takrorlanishning SON bilan o'lchovi:**
> ```
> noyoblik = noyob so'zlar / jami so'zlar
>
> 1.00  →  hech narsa takrorlanmagan
> 0.50  →  har ikkinchi so'z takror
> ```
>
> ## 🎯 **Kutilgan naqsh:**
> ```
> argmax             →  noyoblik PAST   (takrorlanish ko'p)
> temp=0.8+rep_pen   →  noyoblik YUQORI (eng yaxshi)
> temp=1.5           →  noyoblik yuqori, LEKIN ma'no yo'q
> ```
>
> ## ⚠️ **MUHIM OGOHLANTIRISH:** yuqori `noyoblik` — **avtomatik ravishda yaxshi degani EMAS**. Tasodifiy so'zlar to'plami ham 1.00 beradi. Bu o'lchov faqat **takrorlanishni** ko'rsatadi, **ma'noni** emas.
>
> 💡 **Ma'noni faqat ODAM baholay oladi** — yoki boshqa, kattaroq model.

</details>

---

## 🧠 O'zini tekshirish savollari

1. `max_tokens` nima?
2. `temperature` matematik jihatdan nima qiladi?
3. `temperature=0` da qanday muammo paydo bo'ladi?
4. `repetition_penalty` nima uchun kerak?
5. Kursdagi *"bir eng tasodifiy"* to'g'rimi?

<details>
<summary>✅ Javoblar</summary>

1. Natijaning **maksimal uzunligi** *(tokenlarda)*.
2. Logitlarni **bo'ladi**: `softmax(logits / T)`. Kichik `T` → taqsimot **o'tkir**, katta `T` → **tekis**.
3. ## **TAKRORLANISH** — `argmax` doim eng ehtimollisini olib, **halqaga** tushadi.
4. Allaqachon ishlatilgan so'zlarning ehtimolligini **kamaytirish** uchun — takrorlanishga qarshi.
5. ## ❌ **Yo'q** — bugungi OpenAI API'da chegara **2.0**. Bizning o'lchovda `1.5` `1.0` dan **ancha tasodifiyroq** chiqdi.

</details>

---

## 📌 Xulosa

```
IKKI ASOSIY SOZLAMA

  max_tokens   →  UZUNLIK
  temperature  →  TASODIFIYLIK


O'LCHANGAN — max_tokens (distilgpt2, "Once upon a time")
  mx= 5  →  'of war, the United'                    tugallanmagan
  mx=20  →  '...military presence. The'             ✅ to'liq jumla
  mx=50  →  '...military presence.' × 3 MARTA        🔁 TAKRORLANISH!

  🔑 max_tokens ni oshirish SIFATNI YAXSHILAMAYDI


O'LCHANGAN — temperature (mx=30)
  0.01  →  '...the only country... the only country...'   🔁 takror
  0.5   →  '...when the first step was to have a...'      ✅ ENG YAXSHI
  1.0   →  '...a barter in the mill, chewing, slicing'    ⚠️ g'alati
  1.5   →  '...Intellect will abound: Sci-Fi rank 133.5'  ❌ ma'nosiz


MEXANIZM:  softmax(logits / temperature)
  logits = [3.0, 1.0, 0.5, 0.2]
  temp=0.1 →  [1.000, 0.000, 0.000, 0.000]   O'TKIR  → doim birinchi
  temp=2.0 →  [0.526, 0.194, 0.151, 0.130]   TEKIS   → xilma-xil


⚠️ KURSDAGI NOANIQLIK
   "bir eng tasodifiy"  →  aslida chegara 2.0

   AMALIY DIAPAZON:
     0.0-0.3   fakt, tarjima, kod
     0.7-0.9   suhbat, kontent      ⭐ eng keng tarqalgan
     1.0-1.5   ijodiy yozuv


💊 TAKRORLANISHGA DORI
   repetition_penalty=1.2  +  top_p=0.9  +  temperature=0.8


💡 O'QITUVCHINING NATIJASIDA HAM TAKRORLANISH BOR
   "she could see" — 4 marta
   → bu KICHIK MODEL kamchiligi emas, argmax TABIATI
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Temperatura | *temperature* | Tasodifiylik darajasi |
| `top_p` | *nucleus sampling* | Eng ehtimolli p ulushidan tanlash |
| `top_k` | *top-k sampling* | Eng ehtimolli k tadan tanlash |
| Takrorlanish jazosi | *repetition penalty* | Takrorni kamaytiruvchi sozlama |
| Logit | *logit* | Softmax'dan oldingi xom ball |

---

⬅️ [Oldingi: Matn yaratish](04-Generating-Text.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Kalit so'zlar bilan xulosalash](06-Keyword-Text-Summarization.md)
