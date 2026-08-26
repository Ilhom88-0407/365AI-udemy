# 6-dars. Modellarni saqlash va yuklash

## 🎬 Boshlashdan oldin

> **"Aytaylik, siz model ustida ishlagansiz va endi uni KELAJAKDA FOYDALANISH uchun saqlamoqchisiz — shunda har safar uni o'z ma'lumotingiz bilan QAYTA O'QITISHINGIZ shart bo'lmaydi."**
>
> ## **"Hugging Face buni oson qilishga imkon beradi."**

---

## 1. Saqlash

> **"Avval modellarimizni saqlamoqchi bo'lgan MODEL KATALOGINI belgilaymiz."**
>
> ## **"Keyin `save_pretrained` metodidan foydalanib modelimiz va tokenizatorimizni saqlashimiz mumkin."**

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_nomi = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_nomi)
model = AutoModelForSequenceClassification.from_pretrained(model_nomi)

KATALOG = "./my_saved_models"

tokenizer.save_pretrained(KATALOG)
model.save_pretrained(KATALOG)
print("✅ Saqlandi:", KATALOG)
```

### Nima saqlanadi?

```python
import os
print(sorted(os.listdir(KATALOG)))
print("hajm:", round(sum(os.path.getsize(os.path.join(KATALOG, f))
                         for f in os.listdir(KATALOG)) / 1e6, 1), "MB")
```

```
['config.json', 'model.safetensors', 'tokenizer.json', 'tokenizer_config.json']
hajm: 268.5 MB
```

### 📋 Har bir fayl nima uchun?

| Fayl | Nima | Hajm |
|---|---|---|
| `model.safetensors` | ## **OG'IRLIKLAR** *(66M parametr)* | ~268 MB |
| `config.json` | Arxitektura: qatlamlar, boshlar, `id2label` | ~1 KB |
| `tokenizer.json` | ## **LUG'AT** va tokenizatsiya qoidalari | ~700 KB |
| `tokenizer_config.json` | Tokenizator sozlamalari | ~1 KB |

> ## ⚠️ **KURSDAGIDAN FARQ — `vocab.txt` yo'q.**
>
> Kurs yozilgan paytda BERT tokenizatori `vocab.txt` **matn faylini** saqlardi. Endi u **`tokenizer.json`** ichida — bu **tezroq** *(Rust'da yozilgan "fast" tokenizator)*.
>
> ## 💡 **`model.bin` o'rniga `model.safetensors`** — bu ham **yangilanish**:
> ```
> ❌ pytorch_model.bin   →  Python "pickle" (XAVFLI — kod bajarilishi mumkin)
> ✅ model.safetensors   →  XAVFSIZ format (faqat raqamlar)
> ```
> **Notanish manbadan model yuklaganda** bu **jiddiy** xavfsizlik masalasi.

---

## 2. Qayta yuklash

> ## **"Keyin biz modellarimizni `from_pretrained` yordamida QAYTA YUKLASHIMIZ mumkin."**
>
> **"Agar hozirgina saqlagan tokenizatorimizni yuklamoqchi bo'lsak, `AutoTokenizer.from_pretrained` dan foydalanib, tokenizator saqlangan model katalogini ko'rsatamiz."**

```python
my_tokenizer = AutoTokenizer.from_pretrained(KATALOG)
my_model = AutoModelForSequenceClassification.from_pretrained(KATALOG)
print("✅ Yuklandi")
```

> ## 🔑 **`from_pretrained()` — IKKI XIL narsani qabul qiladi:**
> ```
> "distilbert-base-..."   →  Hugging Face Hub'dan YUKLAB OLADI
> "./my_saved_models"     →  DISKDAN o'qiydi
>
> Bir xil funksiya, ikki xil manba.
> ```

---

## 3. ✅ Tekshiramiz — natija BIR XILMI?

Kurs buni ko'rsatmaydi, lekin **doim tekshiring**:

```python
import torch

jumla = "I am so excited to be learning about large language models"

# ① ASL model
with torch.no_grad():
    logits_asl = model(**tokenizer(jumla, return_tensors="pt")).logits

# ② QAYTA YUKLANGAN model
with torch.no_grad():
    logits_yangi = my_model(**my_tokenizer(jumla, return_tensors="pt")).logits

print("asl   :", logits_asl)
print("yangi :", logits_yangi)
print("BIR XILMI?", bool(torch.allclose(logits_asl, logits_yangi)))
```

```
asl   : tensor([[-3.9707,  4.2408]])
yangi : tensor([[-3.9707,  4.2408]])
BIR XILMI? True
```

> ## ✅ **BIT-DARAJADA BIR XIL.** Saqlash **hech narsani yo'qotmaydi**.

---

## 4. 🎯 Nima uchun bu kerak?

| Holat | Nima uchun saqlash kerak |
|---|---|
| 🔧 **Fine-tuning** | ## O'qitilgan modelni **yo'qotmaslik** *(34-modul)* |
| 🌐 **Offline ishlash** | Internetsiz **ishga tushirish** |
| 📦 **Ishlab chiqarish** | Serverga **aniq versiyani** joylash |
| 🔒 **Barqarorlik** | Hub'dagi model **o'zgarishi/o'chirilishi** mumkin |
| ⚡ **Tezlik** | Yuklab olishni **kutmaslik** |

> ## ⚠️ **TO'RTINCHI QATOR — eng ko'p unutiladigan sabab.**
>
> Hugging Face Hub'dagi model **muallif tomonidan yangilanishi** yoki **butunlay o'chirilishi** mumkin. Agar sizning tizimingiz undan **to'g'ridan-to'g'ri** yuklab olsa — bir kun **ishlamay qolishi** mumkin.
>
> ## ✅ **Yechim:** ishlab chiqarishda modelni **o'zingizda saqlang**.

---

## 5. 🚀 Modelni Hub'ga yuklash

Kurs buni ko'rsatmaydi, lekin bu — **juda foydali**:

```python
# pip install huggingface_hub
from huggingface_hub import login
login()                                    # tokeningizni kiritasiz

model.push_to_hub("mening-modelim")
tokenizer.push_to_hub("mening-modelim")
```

> ## ⚠️ **DIQQAT — BU OMMAVIY NASHR.**
>
> ```
> ① Model HAMMAGA ko'rinadi (private=True bermasangiz)
> ② O'quv ma'lumotingiz haqida ma'lumot CHIQIB KETISHI mumkin
> ③ Litsenziya va model card YOZING
> ```
>
> ## 🔑 **Maxfiy model uchun:**
> ```python
> model.push_to_hub("mening-modelim", private=True)
> ```

---

## 6. 🇺🇿 O'zbekcha loyiha uchun amaliy naqsh

```python
from pathlib import Path
import json


def modelni_saqla(model, tokenizer, katalog, metadata=None):
    """Modelni METADATA bilan saqlaydi."""
    k = Path(katalog)
    k.mkdir(parents=True, exist_ok=True)

    tokenizer.save_pretrained(k)
    model.save_pretrained(k)

    # ⭐ O'z metadatangizni ham saqlang
    meta = {
        "asl_model": model.config._name_or_path,
        "vazifa": "sentiment",
        "til": "uz",
        "izoh": "O'zbekcha sharhlar uchun sozlangan",
        **(metadata or {}),
    }
    (k / "meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    hajm = sum(f.stat().st_size for f in k.rglob("*") if f.is_file())
    print(f"✅ Saqlandi: {k}  ({hajm/1e6:.1f} MB)")
    return k


def modelni_yukla(katalog, model_sinfi=AutoModelForSequenceClassification):
    k = Path(katalog)
    tok = AutoTokenizer.from_pretrained(k)
    m = model_sinfi.from_pretrained(k)
    meta_f = k / "meta.json"
    if meta_f.exists():
        meta = json.loads(meta_f.read_text(encoding="utf-8"))
        print("📋 Metadata:", meta)
    return tok, m
```

> ## 🔑 **`meta.json` — kurs ko'rsatmaydigan, lekin AMALDA ZARUR qism.**
>
> Olti oydan keyin `my_saved_models` papkasini ochganingizda:
> ```
> ❌ metadata YO'Q  →  "bu qaysi model edi? qanday ma'lumotda o'qitilgan?"
> ✅ metadata BOR   →  hammasi yozilgan
> ```
>
> ## 💡 **27-modul saboqini eslang:** modelni **tushuntira olish** kerak. Metadata — buning **birinchi** qadami.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Qaysi metod bilan saqlanadi?

**M2.** Qanday fayllar yaratiladi?

**M3.** `from_pretrained()` nima qabul qiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **`save_pretrained(katalog)`** — model va tokenizator uchun **alohida**.

**M2.** `config.json` · `model.safetensors` · `tokenizer.json` · `tokenizer_config.json`.

**M3.** ## **Hub nomi** *(`"bert-base-uncased"`)* **yoki** **disk yo'li** *(`"./my_models"`)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Saqlangan model **bir xil** natija berishini isbotlang.

**M5.** `safetensors` nima uchun `.bin` dan yaxshiroq?

<details>
<summary>✅ Javoblar</summary>

**M4.**
```python
print(torch.allclose(logits_asl, logits_yangi))    # True
```
```
asl   : tensor([[-3.9707,  4.2408]])
yangi : tensor([[-3.9707,  4.2408]])
BIR XILMI? True
```

**M5.**
```
❌ .bin          →  Python "pickle"  →  yuklashda KOD BAJARILISHI mumkin
✅ .safetensors  →  faqat RAQAMLAR   →  XAVFSIZ
```
> ⚠️ **Notanish manbadan** model yuklaganda bu **jiddiy** masala. Zararli `.bin` fayl kompyuteringizda **kod ishga tushirishi** mumkin.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ To'liq **model boshqaruvchisi** yozing.

<details>
<summary>✅ Yechim</summary>

```python
import json, shutil
from pathlib import Path
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification


class ModelBoshqaruvchi:
    """Mahalliy modellar omborini boshqaradi."""

    def __init__(self, ildiz="./models"):
        self.ildiz = Path(ildiz)
        self.ildiz.mkdir(parents=True, exist_ok=True)

    def saqla(self, model, tokenizer, nom, **meta):
        k = self.ildiz / nom
        k.mkdir(parents=True, exist_ok=True)
        tokenizer.save_pretrained(k)
        model.save_pretrained(k)
        (k / "meta.json").write_text(
            json.dumps({"asl": getattr(model.config, "_name_or_path", "?"),
                        **meta}, ensure_ascii=False, indent=2),
            encoding="utf-8")
        print(f"✅ {nom} saqlandi")
        return k

    def royxat(self):
        r = []
        for k in sorted(self.ildiz.iterdir()):
            if not k.is_dir():
                continue
            hajm = sum(f.stat().st_size for f in k.rglob("*") if f.is_file())
            meta = {}
            mf = k / "meta.json"
            if mf.exists():
                meta = json.loads(mf.read_text(encoding="utf-8"))
            r.append({"nom": k.name, "hajm_MB": round(hajm / 1e6, 1),
                      "asl": str(meta.get("asl", "?"))[:34],
                      "til": meta.get("til", "?")})
        if not r:
            print("Ombor bo'sh.")
            return pd.DataFrame()
        df = pd.DataFrame(r)
        print(df.to_string(index=False))
        print(f"\nJAMI: {df.hajm_MB.sum()/1000:.2f} GB")
        return df

    def yukla(self, nom):
        k = self.ildiz / nom
        if not k.exists():
            raise FileNotFoundError(f"❌ Topilmadi: {nom}")
        return (AutoTokenizer.from_pretrained(k),
                AutoModelForSequenceClassification.from_pretrained(k))

    def ochir(self, nom, tasdiq=False):
        k = self.ildiz / nom
        if not k.exists():
            print(f"❌ Topilmadi: {nom}")
            return
        if not tasdiq:
            hajm = sum(f.stat().st_size for f in k.rglob("*") if f.is_file())
            print(f"⚠️ {nom} — {hajm/1e6:.1f} MB")
            print("   O'chirish: ochir(nom, tasdiq=True)")
            return
        shutil.rmtree(k)
        print(f"✅ O'chirildi: {nom}")


mb = ModelBoshqaruvchi()
mb.saqla(model, tokenizer, "sentiment-en", til="en", vazifa="sentiment")
mb.royxat()
```

> ## 🔑 **UCHTA MUHIM XUSUSIYAT:**
> ```
> ① meta.json      →  "bu qaysi model edi?" savoliga javob
> ② royxat()       →  hajm nazorati (modellar TEZ o'sadi)
> ③ tasdiq=True    →  tasodifan o'chirishdan HIMOYA
> ```
>
> ## 💡 **Bu sinf — 34-modulda** *(fine-tuning)* **juda foydali bo'ladi:** siz bir nechta sozlangan versiyani saqlab, ularni **solishtirasiz**.

</details>

---

## 🧠 O'zini tekshirish savollari

1. Modelni qanday saqlash mumkin?
2. Nechta fayl yaratiladi?
3. `from_pretrained()` disk yo'lini qabul qiladimi?
4. `safetensors` nima uchun?
5. Nima uchun ishlab chiqarishda modelni saqlash kerak?

<details>
<summary>✅ Javoblar</summary>

1. ## **`save_pretrained(katalog)`** — model va tokenizator uchun alohida.
2. **To'rtta** — `config.json`, `model.safetensors`, `tokenizer.json`, `tokenizer_config.json`.
3. ## ✅ **Ha** — Hub nomi ham, disk yo'li ham.
4. **Xavfsizlik** — `.bin` *(pickle)* yuklashda **kod bajarishi** mumkin.
5. Hub'dagi model **o'zgarishi** yoki **o'chirilishi** mumkin → tizimingiz **ishlamay qoladi**.

</details>

---

## 📌 Xulosa

```
SAQLASH
   tokenizer.save_pretrained(KATALOG)
   model.save_pretrained(KATALOG)

YUKLASH
   AutoTokenizer.from_pretrained(KATALOG)
   AutoModelForSequenceClassification.from_pretrained(KATALOG)

   💡 from_pretrained() IKKI XIL manbani qabul qiladi:
      "bert-base-uncased"  →  Hub'dan
      "./my_models"        →  diskdan


TO'RTTA FAYL (268.5 MB)
   model.safetensors        ← OG'IRLIKLAR (66M parametr)
   config.json              ← arxitektura + id2label
   tokenizer.json           ← LUG'AT
   tokenizer_config.json    ← sozlamalar

   ⚠️ vocab.txt YO'Q  →  endi tokenizer.json ichida
   ✅ .safetensors     →  .bin (pickle) dan XAVFSIZROQ


✅ TEKSHIRISH (kurs ko'rsatmaydi, lekin SHART)
   asl   : tensor([[-3.9707,  4.2408]])
   yangi : tensor([[-3.9707,  4.2408]])
   allclose  →  True     BIT-DARAJADA bir xil


NIMA UCHUN SAQLASH?
   🔧 fine-tuning (34-modul)   🌐 offline
   📦 ishlab chiqarish          ⚡ tezlik
   🔒 BARQARORLIK  ←  Hub'dagi model O'ZGARISHI/O'CHIRILISHI mumkin


💡 meta.json QO'SHING (kurs ko'rsatmaydi)
   "olti oydan keyin bu qaysi model edi?" savoliga javob
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `save_pretrained` | *save pretrained* | Modelni diskka saqlash |
| `from_pretrained` | *from pretrained* | Modelni yuklash |
| safetensors | *safetensors* | Xavfsiz og'irlik formati |
| Model card | *model card* | Model hujjati |
| Metadata | *metadata* | Model haqidagi ma'lumot |

---

⬅️ [Oldingi: PyTorch va TensorFlow](05-PyTorch-TensorFlow.md) · 🏠 [Modul boshiga](README.md) · ➡️ [33-modul: BERT bilan savol-javob](../33-BERT-Question-Answering/README.md)
