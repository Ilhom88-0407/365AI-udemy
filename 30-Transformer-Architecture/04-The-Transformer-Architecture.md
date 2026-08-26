# 4-dars. Transformer arxitekturasi

## 🎬 Boshlashdan oldin

> **"Endi bizda transformerlar qanchalik kuchli bo'lishi mumkinligi haqida tasavvur bor. Keling, ularning ARXITEKTURASIGA chuqurroq nazar tashlaymiz."**
>
> ## **"Bu diagramma transformer arxitekturasining umumiy ko'rinishini beradi. Bu dastlab ANCHA MURAKKAB ko'rinishi mumkin, lekin biz har bir qadamni ko'rib chiqamiz va uni bo'laklarga ajratamiz."**

---

## 1. 🗺️ Umumiy xarita

![Transformer arxitekturasi](assets/04-architecture.svg)

```
                KIRISH (fransuzcha)          CHIQISH (inglizcha)
                       │                            │
                       ▼                            ▼
              ┌─────────────────┐          ┌─────────────────┐
              │ Input Embedding │          │Output Embedding │
              └────────┬────────┘          └────────┬────────┘
                       │ + pozitsion kodlash        │ + pozitsion
                       ▼                            ▼
        ╔══════════════════════╗       ╔═════════════════════════╗
        ║      ENCODER         ║       ║        DECODER          ║
        ║                      ║       ║                         ║
        ║  Multi-Head          ║       ║  MASKED Multi-Head      ║
        ║  Attention           ║       ║  Attention              ║
        ║        ↓             ║       ║        ↓                ║
        ║  Feed-Forward        ║       ║  Multi-Head Attention   ║
        ║                      ║══════▶║  (encoder'dan ham       ║
        ╚══════════════════════╝       ║   ma'lumot oladi)       ║
             5-, 6-, 7-darslar         ║        ↓                ║
                                       ║  Feed-Forward           ║
                                       ╚════════════╤════════════╝
                                          8-, 9-darslar
                                                    ▼
                                             Linear → Softmax
                                                    ▼
                                            KEYINGI SO'Z
```

---

## 2. Asosiy farq — hammasi BIR VAQTDA

> **"Transformerlarni o'zimiz ishlata boshlashdan oldin, fransuz va ingliz tillari orasida tarjima qilish misolimizni eslaylik."**
>
> ## **"Agar biz buning uchun RNN — rekurrent neyron tarmoq modelini tanlagan bo'lsak, har bir so'z kirish sifatida BIRDAN uzatilardi."**
>
> ## **"Transformerda esa biz barcha kirish so'zlarini modelga BIR VAQTNING O'ZIDA berib, ularni BIR PAYTDA qayta ishlay olamiz."**
>
> **"Bu — transformerlarning shunday kuchli jihati. Lekin bu qanday mumkin?"**

### 🤔 Savol: agar hammasi bir vaqtda kelsa, TARTIB qanday saqlanadi?

```
RNN:          tartib KETMA-KETLIKDAN kelib chiqadi
              1-so'z → 2-so'z → 3-so'z

TRANSFORMER:  hammasi BIR VAQTDA keladi
              so'z, so'z, so'z  →  tartib QAYERDA?
                     ↑
              ⚠️ MUAMMO!
```

> ## ✅ **Javob — POZITSION KODLASH.** Har bir tokenga uning **o'rni** haqida ma'lumot **qo'shiladi**. Buni [5-darsda](05-Input-Embeddings.md) batafsil ko'ramiz.

---

## 3. Encoder–Decoder arxitekturasi

> ## **"Transformer ENCODER–DECODER arxitekturasidan foydalanadi, biz uni batafsilroq ko'rib chiqamiz. Avval encoder blokiga qarab, u yerda nima bo'layotganini ko'raylik."**

| Blok | Vazifasi | Tarjima misolida |
|---|---|---|
| 🔵 **ENCODER** | Kirishni **tushunish** | 🇫🇷 Fransuzcha jumlani o'qiydi |
| 🟢 **DECODER** | Chiqishni **yaratish** | 🇬🇧 Inglizcha jumlani yozadi |

```
🔵 ENCODER  — "MEN NIMA O'QIDIM?"
     kirish → ma'noli vektorlar

🟢 DECODER  — "MEN NIMA YOZAMAN?"
     ma'noli vektorlar + hozirgacha yozganim → keyingi so'z
```

---

## 4. ⭐ Uchta oila — qaysi blok ishlatiladi?

Kurs buni aytmaydi, lekin bu **amalda juda muhim**:

| Oila | Bloklar | Nima uchun yaxshi | Misollar |
|---|---|---|---|
| 🔵 **Faqat ENCODER** | Encoder | **Tushunish** *(tasniflash, NER)* | ## **BERT**, DistilBERT, RoBERTa |
| 🟢 **Faqat DECODER** | Decoder | **Yaratish** *(matn yozish)* | ## **GPT**, LLaMA, Claude |
| 🔵🟢 **Ikkalasi** | Encoder + Decoder | **Tarjima**, xulosalash | T5, BART |

> ## 💡 **Siz ishlatgan modellar qaysi oiladan?**
> ```
> distilbert  (23, 29-modul)   →  🔵 faqat ENCODER   (tasniflash)
> distilgpt2  (29-modul)       →  🟢 faqat DECODER   (matn yaratish)
> t5-small    (29-modul)       →  🔵🟢 IKKALASI      (tarjima)
> ```

### Buni kodda ko'ramiz

```python
import warnings; warnings.filterwarnings("ignore")
from transformers import AutoConfig

for m in ["distilbert-base-uncased-finetuned-sst-2-english", "distilgpt2"]:
    c = AutoConfig.from_pretrained(m)
    print(f"{m:50s} {c.model_type:12s} "
          f"qatlam={getattr(c, 'num_hidden_layers', getattr(c, 'n_layer', '?'))}")
```

```
distilbert-base-uncased-finetuned-sst-2-english    distilbert   qatlam=6
distilgpt2                                         gpt2         qatlam=6
```

---

## 5. 🔍 Modelning ichiga QARAYMIZ

Diagramma chizmasi emas, **haqiqiy struktura**:

```python
from transformers import AutoModel
mod = AutoModel.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
print(mod)
```

```
DistilBertModel(
  (embeddings): Embeddings(
    (word_embeddings): Embedding(30522, 768, padding_idx=0)
    (position_embeddings): Embedding(512, 768)
    (LayerNorm): LayerNorm((768,), eps=1e-12, elementwise_affine=True, bias=True)
    (dropout): Dropout(p=0.1, inplace=False)
  )
  (transformer): Transformer(
    (layer): ModuleList(
      (0-5): 6 x TransformerBlock(
        (attention): DistilBertSelfAttention(
          (q_lin): Linear(in_features=768, out_features=768, bias=True)
          (k_lin): Linear(in_features=768, out_features=768, bias=True)
          (v_lin): Linear(in_features=768, out_features=768, bias=True)
          (out_lin): Linear(in_features=768, out_features=768, bias=True)
          (dropout): Dropout(p=0.1, inplace=False)
        )
        (sa_layer_norm): LayerNorm((768,), eps=1e-12, elementwise_affine=True, bias=True)
        (ffn): FFN(
          (dropout): Dropout(p=0.1, inplace=False)
          (lin1): Linear(in_features=768, out_features=3072, bias=True)
          (lin2): Linear(in_features=3072, out_features=768, bias=True)
          (activation): GELUActivation()
        )
        (output_layer_norm): LayerNorm((768,), eps=1e-12, elementwise_affine=True, bias=True)
      )
    )
  )
)
```

### 🎯 Diagrammani KOD bilan solishtiring

```
DIAGRAMMADA              KODDA                        DARS
─────────────────────────────────────────────────────────────
Input Embedding      →   word_embeddings              5-dars
Positional Encoding  →   position_embeddings          5-dars
Multi-Head Attention →   q_lin, k_lin, v_lin, out_lin 6-dars
Add & Norm           →   sa_layer_norm                6-dars
Feed Forward         →   ffn (lin1 → GELU → lin2)     7-dars
Add & Norm           →   output_layer_norm            7-dars
       ↑
   6 X TransformerBlock  — hammasi 6 MARTA takrorlanadi
```

> ## 🔑 **Mana butun arxitektura — 20 qator matnda.** Qolgan darslar shu qatorlarni **birma-bir** ochib beradi.
>
> 💡 **`(0-5): 6 x TransformerBlock`** — bir xil blok **6 marta** ketma-ket. Har qatlam oldingisining natijasini oladi va **chuqurroq** tushuncha quradi. `BERT-large` da bunday qatlam **24 ta**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Transformer qaysi ikki blokdan iborat?

**M2.** RNN va transformerning kirish bilan ishlashidagi asosiy farq?

**M3.** Encoder va decoder nima qiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **ENCODER** va **DECODER**.

**M2.** RNN — **bittadan, ketma-ket**. Transformer — **hammasi bir vaqtda**.

**M3.** **Encoder** — kirishni **tushunadi** · **Decoder** — chiqishni **yaratadi**.

</details>

### 🟡 O'rta

**M4.** ⭐ Hammasi bir vaqtda kelsa, so'z **tartibi** qanday saqlanadi?

**M5.** BERT va GPT qaysi bloklardan foydalanadi? Nima uchun?

<details>
<summary>✅ Javoblar</summary>

**M4.** ## **POZITSION KODLASH** orqali — har tokenga uning **o'rni** haqidagi ma'lumot **qo'shiladi**. *(5-dars)*

**M5.**
```
BERT  →  🔵 faqat ENCODER
         Maqsad: TUSHUNISH (tasniflash, NER, savol-javob)
         Butun jumlani BIR VAQTDA ko'radi — chapga ham, o'ngga ham

GPT   →  🟢 faqat DECODER
         Maqsad: YARATISH (keyingi so'zni bashorat qilish)
         Faqat OLDINGI so'zlarni ko'radi (masked — 8-dars)
```
> 🔑 **Farq — "kelajakni ko'ra oladimi?"** BERT ha, GPT yo'q. Shuning uchun GPT matn **yozadi**, BERT esa **tushunadi**.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Model strukturasidan **har komponentning parametr ulushini** hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

qatorlar = []
for nom, p in mod.named_parameters():
    if "embeddings" in nom:
        guruh = "① Embeddinglar"
    elif "attention" in nom:
        guruh = "② E'tibor (Q,K,V,out)"
    elif "ffn" in nom:
        guruh = "③ Feed-Forward"
    else:
        guruh = "④ LayerNorm"
    qatorlar.append({"guruh": guruh, "soni": p.numel()})

df = (pd.DataFrame(qatorlar).groupby("guruh")["soni"].sum()
      .reset_index().sort_values("soni", ascending=False))
df["ulush_%"] = (100 * df.soni / df.soni.sum()).round(1)
print(df.to_string(index=False))
print(f"\nJAMI: {df.soni.sum():,}")
```

```
                guruh     soni  ulush_%
       ③ Feed-Forward 28334592     42.7
       ① Embeddinglar 23835648     35.9
② E'tibor (Q,K,V,out) 14174208     21.4
          ④ LayerNorm    18432      0.0

JAMI: 66,362,880
```

> ## 😲 **KUTILMAGAN NATIJA — E'TIBOR ENG KICHIK QISM!**
>
> ```
> Feed-Forward   42.7%   ← ENG KATTA
> Embeddinglar   35.9%
> E'TIBOR        21.4%   ← "Attention is all you need" ning o'zi
> LayerNorm       0.0%
> ```
>
> ## 🔑 **Maqola nomi "Attention Is All You Need" bo'lsa ham, parametrlarning atigi 21% i e'tiborga tegishli.**
>
> Bu **qarama-qarshilik emas**. Maqola nomi *"e'tibor — kerakli YANGILIK"* degani, *"e'tibor — parametrlarning ko'pi"* degani emas. **YANGILIK** e'tiborda, **HAJM** esa feed-forward va embeddinglarda.
>
> 💡 `LayerNorm` — atigi **18 432** parametr *(jamining **0.03%**)*, lekin usiz model **umuman o'qimaydi**. **Muhimlik ≠ hajm.**

</details>

---

## 🧠 O'zini tekshirish savollari

1. Arxitektura qaysi ikki blokdan iborat?
2. Nima uchun transformer parallel ishlay oladi?
3. Tartib qanday saqlanadi?
4. BERT qaysi oiladan?
5. `distilbert` da nechta transformer qatlami bor?

<details>
<summary>✅ Javoblar</summary>

1. **Encoder** va **decoder**.
2. Har token **boshqasini kutmaydi** — hammasi **bir vaqtda** hisoblanadi.
3. ## **Pozitsion kodlash** bilan.
4. ## 🔵 **Faqat encoder** — tushunish uchun.
5. ## **6 ta** — `(0-5): 6 x TransformerBlock`.

</details>

---

## 📌 Xulosa

```
TRANSFORMER = ENCODER + DECODER

  🔵 ENCODER   "men NIMA O'QIDIM?"     → 5,6,7-darslar
  🟢 DECODER   "men NIMA YOZAMAN?"     → 8,9-darslar


ASOSIY FARQ
  RNN          bittadan, KETMA-KET
  TRANSFORMER  hammasi BIR VAQTDA
                     ↑
        Tartib?  →  POZITSION KODLASH (5-dars)


UCHTA OILA
  🔵 faqat ENCODER   BERT, DistilBERT     →  TUSHUNISH
  🟢 faqat DECODER   GPT, LLaMA, Claude   →  YARATISH
  🔵🟢 IKKALASI      T5, BART             →  TARJIMA


HAQIQIY STRUKTURA (distilbert)
  embeddings (word + position)
  6 x TransformerBlock:
      attention: q_lin, k_lin, v_lin, out_lin
      sa_layer_norm
      ffn: lin1(768→3072) → GELU → lin2(3072→768)
      output_layer_norm


⭐ PARAMETR ULUSHLARI (o'lchangan)
  ③ Feed-Forward   42.7%   ← ENG KATTA (28,334,592)
  ① Embeddinglar   35.9%          (23,835,648)
  ② E'TIBOR        21.4%   ← maqola nomi shu haqda! (14,174,208)
  ④ LayerNorm       0.0%   ← 18,432 — lekin usiz model o'qimaydi

  🔑 Muhimlik ≠ hajm
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Encoder | *encoder* | Kirishni tushunuvchi blok |
| Decoder | *decoder* | Chiqishni yaratuvchi blok |
| Pozitsion kodlash | *positional encoding* | So'z o'rnini belgilash |
| Transformer bloki | *transformer block* | Takrorlanuvchi asosiy qatlam |
| GELU | *GELU* | Aktivatsiya funksiyasi |

---

⬅️ [Oldingi: Attention is All You Need](03-Attention-is-All-You-Need.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Kirish embeddinglari](05-Input-Embeddings.md)
