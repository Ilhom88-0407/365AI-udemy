# 1-dars. GPT va BERT

## 🎬 Boshlashdan oldin

> **"Shu paytgacha bu kursda biz katta til modellari nima ekanini, ular nima qila olishini va qanday ishlashini ko'rib chiqdik."**
>
> ## **"GPT modellari promptga javoban matn yaratishda AJOYIB. Biroq boshqa katta til modellari USTUNLIK QILADIGAN NLP vazifalari ham bor."**

> ## 💡 **Siz bu nomlarni ALLAQACHON ko'rgansiz** — 32-modulda BERT va XLNet tokenizatorlarini solishtirgandik.

---

## 1. BERT nima degani?

> ## **"BERT — Bidirectional Encoder Representations from Transformers degani."**

```
B  =  Bidirectional      →  IKKI TOMONLAMA
E  =  Encoder            →  ENCODER (30-modul!)
R  =  Representations    →  vakilliklar
T  =  Transformers       →  transformer arxitekturasi
```

> **"GPT modellari kabi, BERT ham tabiiy tilni qayta ishlash va tushunish uchun transformer arxitekturasidan foydalanadigan OLDINDAN O'QITILGAN model."**
>
> ## **"U 2018-yilda GOOGLE tomonidan ishlab chiqilgan va NLP sohasida ishlaydigan dasturchilar uchun tez orada ASOSIY modelga aylandi."**

---

## 2. Nimadan o'qitilgan?

> **"GPT modellari kabi, BERT ham ULKAN hajmdagi matn ma'lumotida o'qitilgan — jumladan 11 000 dan ortiq kitobni o'z ichiga olgan BOOKS CORPUS ma'lumot to'plami, shuningdek WIKIPEDIA'dan olingan katta matn korpusi."**

```
📚 BooksCorpus   →  11 000+ kitob
📖 Wikipedia      →  katta matn korpusi
```

### Ikki o'lcham

> ## **"BERT dastlab ingliz tilida IKKI MODEL O'LCHAMIDA amalga oshirilgan: birinchisi BERT BASE — 110 MILLION parametr, va BERT LARGE — 340 MILLION parametrgacha yetadi."**

| Model | Parametr | Qatlamlar |
|---|---|---|
| **BERT Base** | 110 million | 12 |
| **BERT Large** | 340 million | ## **24** |

> ## 💡 **Taqqoslang:** GPT-1 *(o'sha yili chiqqan)* — **117 million**. Ya'ni BERT Base va GPT-1 **deyarli teng**, BERT Large esa **3 baravar** kattaroq.

---

## 3. ⭐⭐ ASOSIY FARQ — ikki tomonlamalik

> ## **"BERT'ni NOYOB va KUCHLI qiladigan narsa — uning IKKI TOMONLAMA kontekstni tushunishi."**
>
> ## **"GPT modellari AVTOREGRESSIV — ya'ni ular jumladagi keyingi so'zni OLDINGI so'zlarga asoslanib bashorat qilish orqali matn yaratadi."**
>
> ## **"BERT esa oldindan o'qitish jarayonidan foydalanadi — u jumladagi YETISHMAYOTGAN so'zlarni BUTUN KONTEKSTNI hisobga olib bashorat qilishni o'rganadi: maqsad so'zning HAM CHAPIDAGI, HAM O'NGIDAGI so'zlarni."**

![GPT vs BERT](assets/01-gpt-vs-bert.svg)

```
🟢 GPT — AVTOREGRESSIV

   "The cat sat on the ___"
    ←────────────────┘
    faqat ORQAGA qaraydi

   30-MODUL: niqoblangan e'tibor (pastki uchburchak)


🔵 BERT — IKKI TOMONLAMA

   "The cat ___ on the mat"
    ←──────┘ └──────→
    IKKALA tomonga qaraydi

   30-MODUL: to'liq e'tibor matritsasi
```

> **"Bu ikki tomonlama yondashuv BERT'ga tilning nozikliklarini ilg'ashga va so'zlarning ma'nosini ANCHA KONTEKSTGA MOS tarzda tushunishga yordam beradi."**

### 🔁 Siz buni 30-modulda O'LCHAGANSIZ

```python
# 30-modul, 4-loyiha
distilgpt2   →  72/72 bosh niqoblangan  (100%)  →  🟢 faqat ORQAGA
distilbert   →   0/72 bosh niqoblangan    (0%)  →  🔵 IKKI TOMONLAMA
```

> ## 🔑 **Mana `B` harfining texnik ma'nosi** — niqob **yo'q**, model **butun jumlani** ko'radi.

---

## 4. Qaysi vazifa uchun qaysi model?

> ## **"Bu modellar kontekst va ma'noni tushunishni QANDAY o'rganishidagi farqlar tufayli, ular TURLI TURDAGI vazifalarda ustunlik qiladi."**
>
> ## **"GPT modellari SUHBAT AI va CHATBOTLAR uchun ishlatilganda alohida yaxshi natija beradi, BERT esa asosan SENTIMENT TAHLILI, SAVOL-JAVOB va NOMLI OBYEKTLARNI ANIQLASH kabi vazifalar uchun ishlatiladi."**

| Vazifa | 🟢 GPT | 🔵 BERT | Qaysi modulda |
|---|---|---|---|
| 💬 **Chatbot / suhbat** | ## ✅ **Zo'r** | ❌ | 31-modul |
| ✍️ **Matn yaratish** | ## ✅ **Zo'r** | ❌ | 31-modul |
| 😊 **Sentiment tahlili** | ⚠️ Mumkin | ## ✅ **Zo'r** | 23, 29, 32-modullar |
| ❓ **Savol-javob** | ⚠️ Mumkin | ## ✅ **Zo'r** | ## **BU MODUL** |
| 🏷️ **NER** | ⚠️ Mumkin | ## ✅ **Zo'r** | 22, 32-modullar |
| 🎭 **`[MASK]` to'ldirish** | ❌ | ## ✅ **Asosiy vazifasi** | 32-modul |

> ## 💡 **32-modulda buni o'lchagandik:**
> ```
> "The capital of France is ___"
>
>   distilgpt2 (82M)  →  Parij DEMADI, o'zini takrorladi   ❌
>   BERT [MASK] (110M) →  'paris'  0.4168                   ✅
> ```
> **Deyarli bir xil hajm — butunlay boshqa natija.** Chunki `[MASK]` — BERT'ning **asosiy** o'qitish vazifasi.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** BERT nimaning qisqartmasi?

**M2.** Kim va qachon ishlab chiqqan?

**M3.** Ikki o'lchami qanday?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Bidirectional Encoder Representations from Transformers**.

**M2.** ## **Google**, **2018-yil**.

**M3.** **BERT Base** — 110M *(12 qatlam)* · **BERT Large** — 340M *(24 qatlam)*.

</details>

### 🟡 O'rta

**M4.** ⭐ GPT va BERT ning asosiy farqi? Buni **kodda** isbotlang.

<details>
<summary>✅ Yechim</summary>

```python
import warnings; warnings.filterwarnings("ignore")
import torch, numpy as np
from transformers import AutoTokenizer, AutoModel, AutoModelForCausalLM

def niqob_tekshir(model_id, causal=False):
    t = AutoTokenizer.from_pretrained(model_id)
    if t.pad_token is None:
        t.pad_token = t.eos_token
    sinf = AutoModelForCausalLM if causal else AutoModel
    m = sinf.from_pretrained(model_id, attn_implementation="eager")
    e = t("The cat sat on the mat", return_tensors="pt")
    with torch.no_grad():
        A = m(**e, output_attentions=True).attentions
    nq = sum(1 for L in range(len(A)) for H in range(A[L].shape[1])
             if np.allclose(np.triu(A[L][0, H].numpy(), 1), 0, atol=1e-6))
    jami = len(A) * A[0].shape[1]
    print(f"{model_id:22s} {nq}/{jami} niqoblangan  →  "
          f"{'🟢 GPT (bir tomonlama)' if nq > jami*0.9 else '🔵 BERT (IKKI tomonlama)'}")

niqob_tekshir("distilgpt2", causal=True)
niqob_tekshir("bert-base-uncased")
```

> ## 🔑 **Kutilgan natija:**
> ```
> distilgpt2         72/72 niqoblangan  →  🟢 GPT (bir tomonlama)
> bert-base-uncased   0/72 niqoblangan  →  🔵 BERT (IKKI tomonlama)
> ```
>
> ## 💥 **Mana `B` harfining texnik isboti.** BERT'da niqob **umuman yo'q** — u chapga ham, o'ngga ham qaraydi.

</details>

**M5.** Nima uchun GPT chatbot uchun, BERT esa savol-javob uchun yaxshi?

<details>
<summary>✅ Javob</summary>

```
🟢 GPT — kelajakni KO'RMAYDI
     →  u "keyingi so'z" o'yinini o'ynagan
     →  MATN YARATADI  →  chatbot, kontent

🔵 BERT — BUTUN matnni ko'radi
     →  u "yetishmayotgan so'z" o'yinini o'ynagan
     →  MATNNI TUSHUNADI  →  savol-javob, NER, sentiment
```

> ## 💡 **Savol-javobda javob KONTEKSTNING ICHIDA turadi.** Uni topish uchun **butun matnni** ko'rish kerak — GPT'ning "faqat orqaga" cheklovi bu yerda **to'siq**.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ BERT va GPT ni **bir xil vazifada** solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import pipeline

SAVOLLAR = ["The capital of France is",
            "Water freezes at zero degrees",
            "The largest planet is"]

print("🟢 GPT (davom ettirish):")
g = pipeline("text-generation", model="distilgpt2")
for s in SAVOLLAR:
    r = g(s, max_new_tokens=6, do_sample=False, pad_token_id=50256)
    print(f"   {r[0]['generated_text']!r}")

print("\n🔵 BERT ([MASK] to'ldirish):")
fm = pipeline("fill-mask", model="bert-base-uncased")
for s in SAVOLLAR:
    r = fm(s + " [MASK].")[0]
    print(f"   {s} → {r['token_str']!r}  ({r['score']:.4f})")
```

> ## 🔑 **Kutilgan naqsh:** BERT **faktik** savollarda ancha yaxshi — chunki `[MASK]` uning **asosiy vazifasi**.
>
> ## ⚠️ **LEKIN adolatli bo'laylik:** bu — BERT foydasiga **qiya** taqqoslash. GPT'ni **matn yaratishda** sinasangiz, u **yutadi**. Har model **o'z vazifasida** kuchli.
>
> ## 💡 **Amaliy xulosa:** *"qaysi model yaxshiroq?"* — **noto'g'ri savol**. To'g'ri savol: *"mening vazifam uchun qaysi model?"*

</details>

---

## 🧠 O'zini tekshirish savollari

1. BERT nimaning qisqartmasi?
2. `B` harfi texnik jihatdan nimani anglatadi?
3. BERT nimadan o'qitilgan?
4. GPT va BERT qaysi vazifalarda kuchli?
5. BERT Large nechta parametr va qatlamga ega?

<details>
<summary>✅ Javoblar</summary>

1. ## **Bidirectional Encoder Representations from Transformers**.
2. **Niqob YO'Q** — model chapga ham, o'ngga ham qaraydi *(0/72 bosh niqoblangan)*.
3. **BooksCorpus** *(11 000+ kitob)* va **Wikipedia**.
4. **GPT** — chatbot, matn yaratish · **BERT** — sentiment, savol-javob, NER.
5. ## **340 million** parametr, **24** qatlam.

</details>

---

## 📌 Xulosa

```
BERT = Bidirectional Encoder Representations from Transformers
       Google · 2018


NIMADAN O'QITILGAN
  📚 BooksCorpus (11 000+ kitob)  ·  📖 Wikipedia


IKKI O'LCHAM
  BERT Base    110 M   12 qatlam
  BERT Large   340 M   24 qatlam


⭐⭐ ASOSIY FARQ — IKKI TOMONLAMALIK

  🟢 GPT   "The cat sat on the ___"     faqat ORQAGA
  🔵 BERT  "The cat ___ on the mat"     IKKALA tomonga

  O'LCHANGAN (30-modul):
     distilgpt2  →  72/72 bosh niqoblangan   (bir tomonlama)
     distilbert  →   0/72 bosh niqoblangan   (IKKI tomonlama)


QAYSI VAZIFA UCHUN?
  🟢 GPT   →  chatbot · matn yaratish
  🔵 BERT  →  sentiment · SAVOL-JAVOB · NER · [MASK]

  💡 32-modulda o'lchangan:
     "capital of France"  →  GPT ❌  ·  BERT 'paris' 0.4168 ✅
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| BERT | *BERT* | Ikki tomonlama encoder modeli |
| Ikki tomonlama | *bidirectional* | Chapga ham, o'ngga ham |
| Avtoregressiv | *autoregressive* | O'z natijasidan davom etuvchi |
| BooksCorpus | *BooksCorpus* | 11 000+ kitobdan iborat korpus |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: BERT arxitekturasi](02-BERT-Architecture.md)
