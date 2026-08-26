# 1-dars. Hugging Face paketi

## 🎬 Boshlashdan oldin

> **"Xush kelibsiz! Umid qilamanki, GPT modellaridan foydalanib birinchi katta til modeli yechimlaringizni kodlashdan zavq oldingiz."**
>
> ## **"Biroq GPT modellari — mavjud yagona katta til modellari EMAS."**
>
> **"Bizning foydalanish holatimizga qarab ishlatmoqchi bo'lgan juda ko'p turli til modellari bor."**

> ## 💡 **31-modulda siz `transformers` paketidan ALLAQACHON foydalandingiz** — `distilgpt2` va `flan-t5` bilan. Endi uni **tizimli** o'rganamiz.

---

## 1. Hugging Face nima?

> ## **"GPT modellariga OpenAI API orqali kirish mumkin bo'lsa, boshqa modellar bilan ishlashning yana bir juda mashhur usuli HUGGING FACE tomonidan ishlab chiqilgan."**
>
> ## **"Mashhur emoji nomi bilan atalgan Hugging Face 2016-yilda tashkil etilgan va tabiiy tilni qayta ishlash hamda chuqur o'qitishga qaratilgan OCHIQ MANBALI tashkilot."**

```
🤗  Hugging Face
     ↑
  emoji nomidan olingan

  📅 2016-yilda tashkil etilgan
  🔓 OCHIQ MANBALI
  🎯 NLP + chuqur o'qitish
```

> **"Ular tadqiqotchilar va dasturchilarga ILG'OR NLP modellari bilan ishlashni osonlashtirish uchun turli vositalar va kutubxonalar taqdim etadi — jumladan, oldindan o'qitilgan modellar va o'z modellaringizni o'qitish vositalari."**

---

## 2. ⭐ OpenAI vs Hugging Face

| | 🤖 **OpenAI API** | 🤗 **Hugging Face** |
|---|---|---|
| **Narx** | 💵 Pullik *(token bo'yicha)* | ## ✅ **BEPUL** |
| **Qayerda ishlaydi** | Ularning serverida | ## ✅ **Sizning kompyuteringizda** |
| **Internet** | Doim kerak | ✅ Faqat **birinchi marta** |
| **Maxfiylik** | ⚠️ Ma'lumot **yuboriladi** | ## ✅ **Hech qayerga chiqmaydi** |
| **Model tanlash** | Ular bergani | ## ✅ **1 000 000+ model** |
| **Sifat** | ✅ **Eng yuqori** | ⚠️ Modelga bog'liq |
| **Tezlik** | ✅ Tez *(kuchli server)* | ⚠️ Kompyuteringizga bog'liq |

> ## 🔑 **31-modulda buni AMALDA ko'rgandik:** butun modul **API kalitisiz**, `distilgpt2` va `flan-t5` bilan bajarildi.
>
> ## 💡 **Maxfiylik qatoriga alohida e'tibor bering.** Agar siz **tibbiy**, **moliyaviy** yoki **korporativ** ma'lumot bilan ishlasangiz, uni **tashqi serverga yuborish** ko'pincha **taqiqlangan**. Hugging Face bu muammoni **butunlay** hal qiladi.

---

## 3. `transformers` kutubxonasi

> ## **"Hugging Face'ning eng mashhur paketi — TRANSFORMERS kutubxonasi bo'lib, u Python'da katta til modellari bilan ishlash uchun keng qo'llaniladi."**
>
> **"Transformers paketi keng doiradagi oldindan o'qitilgan NLP modellarini taqdim etadi — jumladan BERT, GPT-2, RoBERTa va boshqa ko'plab modellar."**

```python
pip install transformers torch
```

### Nima qila oladi?

> **"U oldindan o'qitilgan modellarni yuklash va ishlatish uchun ODDIY API taqdim etadi. Siz modelni oson yuklashingiz, matnni tokenizatsiya qilishingiz va bashorat qilishingiz yoki ATIGI BIR NECHA QATOR KODDA matn yaratishingiz mumkin."**

| Imkoniyat | Qaysi modulda ko'rgansiz |
|---|---|
| 🔌 **Model yuklash** | 23, 29, 30, 31-modullar |
| ✂️ **Tokenizatsiya** | 30-modul *(5-dars)* |
| 🎯 **Bashorat** | 23, 29-modullar |
| ✍️ **Matn yaratish** | 31-modul |
| 🔧 **Fine-tuning** | ## **34-modul** *(XLNet)* |

> **"Siz oldindan o'qitilgan modellarni SENTIMENT TAHLILI, NOMLI OBYEKTLARNI ANIQLASH yoki MATN TASNIFI kabi aniq vazifalar uchun O'Z MA'LUMOTINGIZDA sozlashingiz mumkin."**

---

## 4. Hamjamiyat va integratsiya

> **"Hugging Face'da ularning loyihalariga hissa qo'shayotgan dasturchilar va tadqiqotchilarning JONLI HAMJAMIYATI bor. Ular turli loyiha va modellar bilan ishlashni boshlash bo'yicha KENG QAMROVLI HUJJATLAR va qo'llanmalar taqdim etadi."**
>
> ## **"Transformers kutubxonasi PyTorch va TensorFlow kabi mashhur chuqur o'qitish freymvorklari bilan UZLUKSIZ INTEGRATSIYALASHADI."**

```
🤗 Transformers
     ├── 🔥 PyTorch      (torch)         ← biz shuni ishlatamiz
     ├── 🧠 TensorFlow    (tf...)
     └── 🍎 JAX/Flax      (Flax...)
```

> Batafsil: [5-dars](05-PyTorch-TensorFlow.md)

---

## 5. 💻 Amaliyot — o'z keshingizni ko'ring

31-modulda siz **allaqachon** bir nechta modelni yuklagansiz. **Ular qayerda?**

```python
from pathlib import Path

kesh = Path.home() / ".cache" / "huggingface" / "hub"
print("Kesh:", kesh)

jami = 0
for m in sorted(kesh.glob("models--*")):
    hajm = sum(f.stat().st_size for f in m.rglob("*") if f.is_file())
    jami += hajm
    nom = m.name.replace("models--", "").replace("--", "/")
    print(f"  {hajm/1e6:>8.1f} MB  {nom}")
print(f"{'-'*44}\n  {jami/1e9:>8.2f} GB  JAMI")
```

> ## 💡 **Modellar BIR MARTA yuklanadi va keshda saqlanadi.** Keyingi safar — **darhol** ishlaydi, internetsiz ham.
>
> ⚠️ **Diqqat:** kesh **tez o'sadi**. Bir necha katta model — **o'nlab gigabayt**. Vaqti-vaqti bilan **tozalang**.

### 🌐 Internetsiz ishlash

```python
import os
os.environ["HF_HUB_OFFLINE"] = "1"      # faqat KESHDAN o'qi

from transformers import pipeline
p = pipeline("sentiment-analysis")      # keshda bo'lsa — ishlaydi
print(p("I love this course"))
```

> ## 🔑 **Bu — Hugging Face'ning katta afzalligi.** Model bir marta yuklangach, u **butunlay sizniki**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Hugging Face qachon tashkil etilgan va nomi qayerdan olingan?

**M2.** Eng mashhur paketi qaysi?

**M3.** Qaysi freymvorklar bilan integratsiyalashadi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **2016-yil**, nomi **emoji** 🤗 dan olingan.

**M2.** ## **`transformers`**.

**M3.** **PyTorch**, **TensorFlow** *(va JAX/Flax)*.

</details>

### 🟡 O'rta

**M4.** ⭐ OpenAI va Hugging Face farqini **beshta mezon** bo'yicha ayting.

**M5.** Keshingizni ko'ring va hajmini o'lchang.

<details>
<summary>✅ Javoblar</summary>

**M4.**
```
              OpenAI              Hugging Face
narx          💵 pullik            ✅ BEPUL
qayerda       ularning serveri     ✅ sizning kompyuteringiz
maxfiylik     ⚠️ ma'lumot chiqadi  ✅ hech qayerga chiqmaydi
model tanlash ular bergani         ✅ 1 000 000+
sifat         ✅ eng yuqori         ⚠️ modelga bog'liq
```

**M5.** 5-bo'limdagi kodni ishlating.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Kesh boshqaruvchisi yozing — hajm, tozalash va offline rejim.

<details>
<summary>✅ Yechim</summary>

```python
import shutil
from pathlib import Path
import pandas as pd

KESH = Path.home() / ".cache" / "huggingface" / "hub"


def kesh_royxati():
    r = []
    for m in KESH.glob("models--*"):
        hajm = sum(f.stat().st_size for f in m.rglob("*") if f.is_file())
        r.append({"model": m.name.replace("models--", "").replace("--", "/"),
                  "hajm_MB": round(hajm / 1e6, 1),
                  "yo'l": str(m)})
    if not r:
        print("Kesh bo'sh.")
        return pd.DataFrame()
    df = pd.DataFrame(r).sort_values("hajm_MB", ascending=False)
    print(df[["model", "hajm_MB"]].to_string(index=False))
    print(f"\nJAMI: {df.hajm_MB.sum()/1000:.2f} GB  ({len(df)} ta model)")
    return df


def kesh_tozala(model_nomi, tasdiq=False):
    """⚠️ EHTIYOT BO'LING — o'chirilgan model QAYTA YUKLANADI."""
    yol = KESH / ("models--" + model_nomi.replace("/", "--"))
    if not yol.exists():
        print(f"❌ Topilmadi: {model_nomi}")
        return
    hajm = sum(f.stat().st_size for f in yol.rglob("*") if f.is_file())
    if not tasdiq:
        print(f"⚠️ {model_nomi} — {hajm/1e6:.1f} MB")
        print("   O'chirish uchun: kesh_tozala(nom, tasdiq=True)")
        return
    shutil.rmtree(yol)
    print(f"✅ O'chirildi: {model_nomi} ({hajm/1e6:.1f} MB bo'shadi)")


kesh_royxati()
```

> ## ⚠️ **`tasdiq=True` bo'lmasa hech narsa o'chirilmaydi** — bu **ataylab**. Tasodifan katta modelni o'chirib, uni qayta yuklash **soatlar** olishi mumkin.
>
> ## 💡 **Offline rejim** *(`HF_HUB_OFFLINE=1`)* ni **ishga tushirishdan OLDIN** o'rnating — `transformers` importidan keyin u **ta'sir qilmaydi**.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Hugging Face nima?
2. `transformers` nima qila oladi?
3. OpenAI'dan asosiy farqi?
4. Modellar qayerda saqlanadi?
5. Internetsiz ishlash mumkinmi?

<details>
<summary>✅ Javoblar</summary>

1. **2016-yilda** tashkil etilgan **ochiq manbali** NLP tashkiloti *(nomi emoji 🤗 dan)*.
2. Model **yuklash**, **tokenizatsiya**, **bashorat**, **matn yaratish**, **fine-tuning**.
3. ## **BEPUL** va **sizning kompyuteringizda** ishlaydi → **maxfiylik** saqlanadi.
4. `~/.cache/huggingface/hub` — **bir marta** yuklanadi.
5. ## ✅ **Ha** — `HF_HUB_OFFLINE=1` *(model keshda bo'lsa)*.

</details>

---

## 📌 Xulosa

```
🤗 HUGGING FACE
   2016-yil · ochiq manbali · nomi EMOJI dan


📦 transformers KUTUBXONASI
   BERT · GPT-2 · RoBERTa · XLNet · T5 · va 1 000 000+ model

   yuklash · tokenizatsiya · bashorat · generatsiya · fine-tuning


⚖️ OpenAI  vs  Hugging Face
                 OpenAI          Hugging Face
   narx          💵 pullik        ✅ BEPUL
   qayerda       ularning server  ✅ SIZNING kompyuter
   maxfiylik     ⚠️ chiqadi        ✅ CHIQMAYDI      ← eng muhimi
   modellar      ular bergani     ✅ 1 000 000+
   sifat         ✅ eng yuqori     ⚠️ modelga bog'liq


🔥 FREYMVORKLAR
   PyTorch · TensorFlow · JAX


💾 KESH
   ~/.cache/huggingface/hub
   bir marta yuklanadi  →  keyin internetsiz ishlaydi
   ⚠️ tez o'sadi — vaqti-vaqti bilan tozalang

   HF_HUB_OFFLINE=1  →  faqat keshdan o'qish
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Ochiq manba | *open source* | Kodi ochiq loyiha |
| Model hub | *model hub* | Modellar ombori |
| Kesh | *cache* | Yuklangan fayllar saqlanadigan joy |
| Freymvork | *framework* | Chuqur o'qitish platformasi |
| Offline rejim | *offline mode* | Internetsiz ishlash |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Transformer pipeline](02-The-Transformer-Pipeline.md)
