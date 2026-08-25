# 2-dars. Kurs materiallari va noutbuklar

## 🎬 Boshlashdan oldin

> **"Salom hammaga! Kurs materiallariga kirishni istaganlar uchun — kursdagi barcha noutbuklar GitHub'da mavjud. Ularni istalgan vaqtda quyidagi havoladan olishingiz va yuklab olishingiz mumkin."**
>
> — *Lauren*

---

## 1. 📦 Rasmiy repozitoriy

> 🔗 **https://github.com/l-newbould/intro-to-llms-365**

```bash
git clone https://github.com/l-newbould/intro-to-llms-365.git
cd intro-to-llms-365
```

Yoki brauzerda ochib, kerakli `.ipynb` faylni **Download** tugmasi bilan olasiz.

---

## 2. ⚙️ Muhitni tayyorlash

LLM bo'limida ishlatiladigan asosiy paketlar:

```bash
pip install transformers torch
pip install openai langchain langchain-openai
pip install jupyter notebook
```

### Tekshirish

```python
import transformers, torch
print("transformers:", transformers.__version__)
print("torch       :", torch.__version__)
print("GPU bormi?  :", torch.cuda.is_available())
```

```
transformers: 5.15.1
torch       : 2.12.0
GPU bormi?  : False
```

> ## 💡 **GPU bo'lmasa ham xavotir olmang.** Bu kursdagi modellarning **ko'pchiligi** oddiy protsessorda ishlaydi — faqat **sekinroq**.
>
> Birinchi ishga tushirishda model **yuklab olinadi** *(66 MB dan bir necha GB gacha)* va keshga saqlanadi. Keyingi safar — **darhol** ishlaydi.

---

## 3. 📁 Modellar qayerga saqlanadi?

```python
from pathlib import Path
kesh = Path.home() / ".cache" / "huggingface" / "hub"
print("Kesh yo'li:", kesh)
if kesh.exists():
    for m in sorted(kesh.iterdir()):
        if m.name.startswith("models--"):
            print("  ", m.name.replace("models--", "").replace("--", "/"))
```

Namuna chiqish:

```
Kesh yo'li: C:\Users\admin\.cache\huggingface\hub
   cardiffnlp/twitter-roberta-base-sentiment-latest
   distilbert/distilbert-base-uncased-finetuned-sst-2-english
   nlptown/bert-base-multilingual-uncased-sentiment
```

> ⚠️ **Diqqat — joy egallaydi.** Bir necha model yuklaganingizdan keyin bu papka **o'nlab gigabayt** bo'lishi mumkin. Vaqti-vaqti bilan tozalab turing.

---

## 4. 🔑 API kalitlari haqida

31-modul va LangChain bo'limida **OpenAI API kaliti** kerak bo'ladi *(pullik)*.

### ⚠️ ENG MUHIM QOIDA

```python
# ❌ HECH QACHON BUNDAY QILMANG:
api_key = "sk-proj-abc123..."      # kod ichida ochiq kalit!

# ✅ TO'G'RI YO'L — muhit o'zgaruvchisi:
import os
api_key = os.environ.get("OPENAI_API_KEY")
```

**Kalitni o'rnatish:**

```bash
setx OPENAI_API_KEY "sizning-kalitingiz"
```

> ## 🔒 **Kalitni GitHub'ga YUKLAMANG.** Bu — eng ko'p uchraydigan va eng qimmatga tushadigan xato. `.gitignore` fayliga `.env` ni qo'shing.

**`.gitignore` namunasi:**

```
.env
*.key
__pycache__/
.ipynb_checkpoints/
```

---

## 5. 💰 Narx haqida ogohlantirish

| Nima | Narx |
|---|---|
| 🤗 **Hugging Face modellari** | ## ✅ **BEPUL** *(o'z kompyuteringizda)* |
| 🤖 **OpenAI API** | 💵 **Pullik** *(har so'rov uchun)* |

> ## 💡 **Bu darslikdagi barcha kod — Hugging Face bilan, ya'ni BEPUL.** OpenAI kaliti faqat 31-modul va LangChain bo'limida kerak bo'ladi, u yerda ham **muqobil yo'llar** ko'rsatiladi.

---

## 6. ⚡ Mashqlar

**M1.** O'z muhitingizni tekshiring — `transformers` va `torch` o'rnatilganmi?

**M2.** Keshdagi modellarni ro'yxatlang.

**M3.** ⭐ API kalitini kod ichida saqlash nima uchun xavfli? Uchta sabab ayting.

<details>
<summary>✅ Javoblar</summary>

**M1.**
```python
import transformers, torch
print(transformers.__version__, torch.__version__)
```
Xato bersa:
```bash
pip install transformers torch
```

**M2.** Yuqoridagi 3-bo'limdagi kodni ishga tushiring.

**M3.**
```
① GitHub'ga tushib qoladi  →  botlar ochiq kalitlarni QIDIRADI
                              (odatda bir necha DAQIQADA topiladi)
② Hisobingizdan PUL yechiladi  →  boshqalar sizning kalitingiz bilan ishlaydi
③ Kodni ulashish IMKONSIZ  →  har safar kalitni o'chirish kerak
```

> 💡 **Qo'shimcha:** kalit tasodifan yuklansa, `git rm` **yetarli emas** — u tarixda qoladi. Yagona to'g'ri yo'l: **kalitni bekor qilib**, yangisini olish.

</details>

---

## 📌 Xulosa

```
📦 MATERIALLAR
   github.com/l-newbould/intro-to-llms-365

⚙️ O'RNATISH
   pip install transformers torch

📁 MODELLAR KESHI
   ~/.cache/huggingface/hub     ← o'nlab GB bo'lishi mumkin

🔒 API KALITI
   ❌ kod ichida         →  HECH QACHON
   ✅ os.environ.get()   →  DOIM
   ✅ .gitignore ga .env →  MAJBURIY

💰 NARX
   Hugging Face  →  BEPUL
   OpenAI API    →  pullik
```

---

⬅️ [Oldingi: Kursga kirish](01-Introduction-to-the-Course.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: LLM nima?](03-What-are-LLMs.md)
