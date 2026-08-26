# 4-dars. Transformerlar ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"RNN zanjir bo'ylab yuradi. Transformer butun ketma-ketlikni BIR VAQTDA ko'radi."**

---

## 1. Encoder + Decoder

> ## 🔑 **KURS TO'G'RI TUSHUNTIRADI:** *"Encoder kirishni tushunishga qaratilgan, decoder esa chiqishni generatsiya qiladi."*
>
> ```
> 🎙️ AUDIO  →  mel-spektrogramma  →  ENCODER  →  vakillik
>                                                    ↓
> 📝 MATN  ←  DECODER  ←──────────────────────────────┘
>              ↑
>       ⭐ oldin yozilgan tokenlar
> ```

### 🔬 Whisper'ning haqiqiy o'lchamlari

```python
from transformers import WhisperForConditionalGeneration

for nom in ["openai/whisper-tiny", "openai/whisper-base",
            "openai/whisper-small"]:
    m = WhisperForConditionalGeneration.from_pretrained(nom)
    c = m.config
    print(f"  {nom.split('/')[-1]:14s} "
          f"{c.encoder_layers:2d} enc · {c.decoder_layers:2d} dec · "
          f"d_model {c.d_model:4d} · {c.encoder_attention_heads:2d} bosh · "
          f"mel {c.num_mel_bins} · lug'at {c.vocab_size:,}")
    del m
```

```
  whisper-tiny    4 enc ·  4 dec · d_model  384 ·  6 bosh · mel 80 · lug'at 51,865
  whisper-base    6 enc ·  6 dec · d_model  512 ·  8 bosh · mel 80 · lug'at 51,865
  whisper-small  12 enc · 12 dec · d_model  768 · 12 bosh · mel 80 · lug'at 51,865
```

> ## ⭐ **HAMMA O'LCHAMDA `mel = 80` VA `lug'at = 51 865`.** ## O'zgaradigan narsa — **qatlamlar soni** va **`d_model`**.
>
> ## 🏆 **VA `lug'at 51 865` — 99 TIL UCHUN UMUMIY.** ## 💡 Aynan shuning uchun Whisper **o'zbekchani ham** biladi.

---

## 2. ⭐⭐⭐ Whisper doim **30 soniya** oladi

```python
from transformers import WhisperProcessor
import librosa

proc = WhisperProcessor.from_pretrained("openai/whisper-tiny")
y, sr = librosa.load("speech_01.wav", sr=16000)
f = proc.feature_extractor(y, sampling_rate=16000, return_tensors="pt")

print(f"  audio  : {y.shape} ({len(y)/sr:.2f} s)")
print(f"  kirish : {tuple(f.input_features.shape)}")
print(f"  ⭐ {f.input_features.shape[-1]} freym = "
      f"{f.input_features.shape[-1]*0.01:.0f} s")
```

```
  audio  : (376190,) (23.51 s)
  kirish : (1, 80, 3000)
  ⭐ 3000 freym = 30 s
```

> ## 💥💥 **23.51 s AUDIO — 30 s GA TO'LDIRILDI.**
>
> ## 🔑 **BU — WHISPER'NING QAT'IY QOIDASI:** ## kirish **doim** `80 × 3000`. ## Qisqa audio **jimlik bilan** to'ldiriladi, ## uzun audio — **30 s lik bo'laklarga** bo'linadi.
>
> ## 🏆 **AMALIY OQIBAT — `ENCODER` UCHUN:**
> ```
> 1 s audio   →  encoder 30 s ishlov beradi   💥 29 s BEKORGA
> 30 s audio  →  encoder 30 s ishlov beradi   ⭐ 100% samarali
> ```
>
> ## ⚠️ **LEKIN UMUMIY VAQT BARIBIR AUDIO UZUNLIGIGA BOG'LIQ** — ## chunki `decoder` **har token uchun** bir qadam qiladi. ## 💡 O'lchandi *(6-bo'lim)*: 1 s → 266 ms, 29 s → 1814 ms.
>
> ## 🏆 **SAMARADORLIK ESA 4.2× OSHADI** *(RTF 0.266 → 0.063)*.

---

## 3. ⭐⭐ Encoder chiqishi va e'tibor

```python
import torch

m = WhisperForConditionalGeneration.from_pretrained(
    "openai/whisper-tiny", attn_implementation="eager")   # ⭐ SHART
m.eval()
with torch.no_grad():
    eo = m.model.encoder(f.input_features, output_attentions=True)

print(f"  encoder chiqishi: {tuple(eo.last_hidden_state.shape)}")
print(f"  e'tibor: {len(eo.attentions)} qatlam × "
      f"{tuple(eo.attentions[0].shape)}")
```

```
  encoder chiqishi: (1, 1500, 384)
  e'tibor: 4 qatlam × (1, 6, 1500, 1500)
```

> ## ⭐ **`3000 → 1500` — IKKI BARAVAR SIQILDI.** ## Sabab: encoder boshida **ikki `Conv1d`** qatlami bor, ## ikkinchisi `stride=2` bilan.
>
> ## 💡 **YA'NI HAR VAKILLIK VEKTORI 20 ms NI QOPLAYDI** *(10 ms × 2)*.
>
> ## 💥💥 **`attn_implementation="eager"` — MAJBURIY:**
> ```
> ⚠️ sukut bo'yicha `sdpa` ishlatiladi (tezroq)
> 💥 lekin u `output_attentions=True` ni QO'LLAB-QUVVATLAMAYDI
> 💥 va JIM ravishda bo'sh ro'yxat qaytaradi
> ```
> ## 🔑 **BU — HAQIQIY TUZOQ:** ## kod **xato bermaydi**, faqat `attentions` **bo'sh** bo'ladi.

### 🔬 E'tibor matritsasi — nima ko'rsatadi?

```python
import numpy as np

a = eo.attentions[0][0, 0]
print(f"  qatorlar yig'indisi: {a.sum(dim=-1).mean():.4f}  (1.0 bo'lishi kerak)")

for L in range(4):
    A = eo.attentions[L][0]
    H = -(A * torch.log(A + 1e-12)).sum(-1).mean()
    print(f"  qatlam {L}: entropiya {H:.3f}  "
          f"(maks {np.log(A.shape[-1]):.3f})")
```

```
  qatorlar yig'indisi: 1.0000  (1.0 bo'lishi kerak)

  qatlam 0: entropiya 2.857  (maks 7.313)
  qatlam 1: entropiya 5.217  (maks 7.313)
  qatlam 2: entropiya 3.957  (maks 7.313)
  qatlam 3: entropiya 3.659  (maks 7.313)
```

> ## ✅ **QATORLAR YIG'INDISI AYNAN `1.0000`** — ## e'tibor **softmax**, ya'ni **ehtimollik taqsimoti**.
>
> ## 🔑 **ENTROPIYA NIMA KO'RSATADI?**
> ```
> PAST entropiya (0 ga yaqin)  →  ⭐ model BIR NECHTA freymga FOKUS qiladi
> YUQORI (7.313 = log 1500)    →  💥 hamma freymga TENG qaraydi (foydasiz)
> ```
>
> ## 🏆 **VA NATIJA QIZIQ:**
> ```
> qatlam 0  →  2.857   ⭐ ENG FOKUSLANGAN (mahalliy naqshlar)
> qatlam 1  →  5.217   💥 eng tarqoq
> qatlam 2  →  3.957
> qatlam 3  →  3.659   ⭐ yana fokuslanadi
> ```
>
> ## ⚠️ **MEN "CHUQURROQ QATLAM — KENGROQ KONTEKST" DEB KUTGAN EDIM.** ## 💥 Naqsh **monoton emas**: `2.86 → 5.22 → 3.96 → 3.66`.
>
> ## 🔑 **TALQIN:** ## `qatlam 0` — **mahalliy akustik naqshlar** *(qo'shni freymlar)* ## `qatlam 1` — **global kontekst yig'ish** *(keng qarash)* ## `qatlam 2–3` — **muhim joylarga qaytish** *(fokus)*
>
> ## 💡 **BU — TRANSFORMERLARDA KUZATILGAN UMUMIY NAQSH**, ## lekin u **model va ma'lumotga bog'liq** — ## uni **universal qoida** deb hisoblamang.

---

## 4. ⭐ E'tibor mexanizmi — formula

```
Attention(Q, K, V) = softmax( Q·Kᵀ / √d ) · V
```

> ## 🔑 **UCH MATRITSA:**
> ```
> Q (query)  →  "men nimani QIDIRYAPMAN?"
> K (key)    →  "menda NIMA bor?"
> V (value)  →  "mana MAZMUN"
> ```
>
> ## ⭐ **`Q·Kᵀ` — BU 49-MODULDAGI SKALYAR KO'PAYTMA.** ## Har freym **har freym bilan** solishtiriladi.
>
> ## 💥 **VA `√d` — MAJBURIY:**
> ```
> d = 384 (whisper-tiny)
> √384 ≈ 19.6
>
> Usiz: Q·Kᵀ qiymatlari KATTA  →  softmax "o'tkir" bo'ladi
>       →  💥 gradient deyarli NOL
> ```

### 🔬 O'zimiz yozamiz

```python
def etibor(Q, K, V, mask=None):
    """⭐ Scaled dot-product attention — 4 qator."""
    d = Q.shape[-1]
    ball = Q @ K.transpose(-2, -1) / (d ** 0.5)
    if mask is not None:
        ball = ball.masked_fill(mask == 0, float("-inf"))
    w = torch.softmax(ball, dim=-1)
    return w @ V, w


torch.manual_seed(0)
Q = K = V = torch.randn(1, 8, 16)          # 8 freym, 16 o'lcham
out, w = etibor(Q, K, V)
print(f"  chiqish {tuple(out.shape)} · og'irliklar {tuple(w.shape)}")
print(f"  qatorlar yig'indisi: {w.sum(-1).flatten().tolist()[:3]}")

# ⭐ √d SIZ nima bo'ladi?
ball_xom = (Q @ K.transpose(-2, -1))
print(f"\n  √d bilan : ball diapazoni "
      f"{(ball_xom/16**0.5).min():.2f} .. {(ball_xom/16**0.5).max():.2f}")
print(f"  √d siz   : ball diapazoni "
      f"{ball_xom.min():.2f} .. {ball_xom.max():.2f}")
print(f"  softmax maksimumi — √d bilan "
      f"{torch.softmax(ball_xom/16**0.5, -1).max():.4f} · "
      f"√d siz {torch.softmax(ball_xom, -1).max():.4f}")
```

```
  chiqish (1, 8, 16) · og'irliklar (1, 8, 8)
  qatorlar yig'indisi: [1.0, 1.0, 1.0]

  √d bilan : ball diapazoni -1.66 .. 6.30
  √d siz   : ball diapazoni -6.64 .. 25.20
  softmax maksimumi — √d bilan 0.9871 · √d siz 1.0000
```

> ## 💥 **`√d` SIZ SOFTMAX MAKSIMUMI AYNAN `1.0000`** — ## ya'ni taqsimot **butunlay bitta freymga** yig'ilgan.
>
> ## ⚠️ **VA `√d` BILAN HAM 0.9871 — ANCHA YUQORI.** ## 🔑 Bu — **tasodifiy** `Q`, `K` bilan ishlagani uchun. ## 💡 O'qitilgan modelda taqsimot **ancha tekisroq** bo'ladi ## *(Whisper'da entropiya 2.86–5.22)*.
>
> ## 🔑 **VA `softmax` ning gradienti `p(1−p)`:** ## `p = 1.0` → gradient **0** → ## 💥 **model o'rganmaydi**.
>
> ## 🏆 **BIR SATRLIK BO'LINISH — BUTUN O'QITISHNI SAQLAYDI.**

---

## 5. ⚠️ Transformerning narxi

```
E'tibor murakkabligi: O(n²)

n = 1500 (Whisper encoder)
   →  1500² = 2 250 000 juftlik
   →  har qatlam, har bosh uchun

whisper-tiny: 4 qatlam × 6 bosh × 2.25M = 54M skalyar ko'paytma
```

> ## 💥 **AYNAN SHU SABABLI WHISPER 30 SONIYA BILAN CHEKLANGAN.** ## 60 s bo'lsa — `n = 3000`, ## e'tibor **4× qimmat** bo'lar edi.
>
> ## ⭐ **VA `conv stride=2` — AYNAN SHU MUAMMONI YECHADI:** ## `3000 → 1500` siqilish e'tiborni **4× arzonlashtiradi**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Whisper kirishi doim qanday o'lchamda?

**M2.** Nima uchun `√d` ga bo'linadi?

**M3.** `attn_implementation="eager"` nima uchun kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Doim **`80 × 3000`** = **30 soniya**. ## Qisqa audio **to'ldiriladi**.

**M2.** ## Usiz `Q·Kᵀ` qiymatlari katta → ## softmax **1.0000** ga yig'iladi → ## 💥 gradient **nol**.

**M3.** ## Sukut `sdpa` — `output_attentions` ni ## 💥 **jim ravishda** qo'llab-quvvatlamaydi.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ E'tibor mexanizmini noldan yozing.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 4-bo'limdagi kodni ishga tushiring, so'ng ## **ko'p boshli** e'tiborni qo'shing:

```python
def kop_boshli(X, n_bosh=4):
    """⭐ Ko'p boshli e'tibor — har bosh BOSHQA narsaga qaraydi."""
    B, T, D = X.shape
    dh = D // n_bosh
    Xh = X.view(B, T, n_bosh, dh).transpose(1, 2)      # (B, bosh, T, dh)
    out, w = etibor(Xh, Xh, Xh)
    return out.transpose(1, 2).reshape(B, T, D), w


torch.manual_seed(0)
X = torch.randn(1, 8, 16)
o, w = kop_boshli(X, n_bosh=4)
print(f"  chiqish {tuple(o.shape)} · og'irliklar {tuple(w.shape)}")

# ⭐ har bosh QANCHALIK farq qiladi?
for i in range(4):
    H = -(w[0, i] * torch.log(w[0, i] + 1e-12)).sum(-1).mean()
    print(f"    bosh {i}: entropiya {H:.3f}")
```

```
  chiqish (1, 8, 16) · og'irliklar (1, 4, 8, 8)
    bosh 0: entropiya 1.665
    bosh 1: entropiya 1.282
    bosh 2: entropiya 1.416
    bosh 3: entropiya 1.414
```

## 🏆 **HAR BOSH TURLI ENTROPIYA BERADI** — ## ya'ni ular **turli narsalarga** qaraydi. ## 💡 Bu — ko'p boshli e'tiborning **butun maqsadi**.

</details>

**M5.** ⭐⭐ Whisper e'tiborini vizuallashtiring.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fig, ax = plt.subplots(2, 3, figsize=(14, 8))
for i in range(6):
    A = eo.attentions[0][0, i].numpy()
    # ⭐ 1500×1500 juda katta — 200×200 ga qisqartiramiz
    ax.flat[i].imshow(A[:200, :200], cmap="magma", aspect="auto")
    H = -(A * np.log(A + 1e-12)).sum(-1).mean()
    ax.flat[i].set_title(f"qatlam 0 · bosh {i} · entropiya {H:.2f}",
                         fontsize=9)
plt.suptitle("Whisper encoder e'tibori — har bosh BOSHQA naqsh")
plt.tight_layout()
plt.savefig("etibor.png", dpi=110)
print("💾 etibor.png")

# ⭐ diagonal og'irligi — mahalliy fokus ko'rsatkichi
for L in range(4):
    A = eo.attentions[L][0].numpy()
    d = np.array([np.trace(A[h]) / A.shape[-1] for h in range(A.shape[0])])
    print(f"  qatlam {L}: diagonal og'irligi o'rt {d.mean():.4f} "
          f"(tasodifiy {1/A.shape[-1]:.6f})")
```

```
  qatlam 0: diagonal o'rt 0.0102 (tasodifiy 0.000667)  ->  15x
  qatlam 1: diagonal o'rt 0.0243 (tasodifiy 0.000667)  ->  36x
  qatlam 2: diagonal o'rt 0.0269 (tasodifiy 0.000667)  ->  40x
  qatlam 3: diagonal o'rt 0.0128 (tasodifiy 0.000667)  ->  19x
```

## 💡 **DIAGONAL OG'IRLIGI — "O'ZIGA QARASH" DARAJASI.** ## Hamma qatlamda u tasodifiydan **15–40× yuqori** — ## ya'ni model **mahalliy kontekstga** kuchli tayanadi.

## ⭐ **VA NAQSH ENTROPIYA BILAN MOS KELMAYDI:** ## `qatlam 1` eng **tarqoq** *(entropiya 5.217)*, ## lekin diagonali **36×** — ancha yuqori. ## 🔑 Ya'ni u **hamma joyga bir oz** qaraydi, ## lekin **o'ziga eng ko'p**.

</details>

**M6.** ⭐ 30 soniya to'ldirishning narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time
from transformers import pipeline

asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")

for davom in [1, 5, 10, 20, 29]:
    z = y[:int(davom * sr)]
    t0 = time.perf_counter()
    asr(z.copy(), generate_kwargs={"language": "en"})
    dt = time.perf_counter() - t0
    print(f"  {davom:2d} s audio  ->  {dt*1000:7.1f} ms · "
          f"RTF {dt/davom:6.3f}")
```

```
   1 s audio  ->    265.6 ms · RTF  0.266
   5 s audio  ->    558.1 ms · RTF  0.112
  10 s audio  ->    989.0 ms · RTF  0.099
  20 s audio  ->   1648.0 ms · RTF  0.082
  29 s audio  ->   1814.4 ms · RTF  0.063
```

## ⚠⚠ **MEN "VAQT AUDIO UZUNLIGIGA BOG'LIQ EMAS" DEB KUTGAN EDIM — XATO.** ## 💥 265.6 ms dan **1814.4 ms** ga oshdi — **6.8×**.

## 🔑 **SABAB — ENCODER VA DECODER TURLICHA ISHLAYDI:**
```
ENCODER  →  doim 3000 freym    ⭐ vaqti O'ZGARMAS
DECODER  →  har token uchun 1 qadam
            1 s audio  →  ~10 token
            29 s audio →  ~90 token   💥 9× ko'p qadam
```

## ✅ **LEKIN ASOSIY XULOSA TASDIQLANDI — `RTF` GA QARANG:**
```
 1 s  →  RTF 0.266
29 s  →  RTF 0.063     🏆 4.2× SAMARALIROQ
```

## 🏆 **YA'NI QISQA FAYLLARNI BIRLASHTIRISH HAQIQATAN FOYDALI** — ## faqat men kutgan **30×** emas, **~4×**.

## ⭐ **VA `RTF 0.266` HAM YOMON EMAS** — ## 1 soniyalik audio **0.27 s** da ishlanadi, ## ya'ni **real vaqtdan tez**.

</details>

---

## 📌 Xulosa

```
Attention(Q, K, V) = softmax( Q·Kᵀ / √d ) · V

ENCODER  →  audio → vakillik    (akustik model)
DECODER  →  vakillik → matn     (til modeli)
```

```
🔬 O'LCHANGAN (whisper-tiny):
   kirish        (1, 80, 3000)   💥 DOIM 30 s
   encoder chiq. (1, 1500, 384)  ⭐ conv stride 2 bilan 2× siqildi
   e'tibor       4 qatlam × (1, 6, 1500, 1500)

   e'tibor entropiyasi (maks 7.313):
     qatlam 0  2.857  ⭐ eng fokuslangan
     qatlam 1  5.217  💥 eng tarqoq
     qatlam 2  3.957
     qatlam 3  3.659

   √d ta'siri (d=16, tasodifiy Q/K):
     √d bilan  ball -1.66..6.30   softmax maks 0.9871  ✅
     √d siz    ball -6.64..25.20  softmax maks 1.0000  💥 gradient NOL

   30 s to'ldirish narxi (whisper-tiny):
      1 s →  265.6 ms · RTF 0.266
     29 s → 1814.4 ms · RTF 0.063    🏆 4.2× samaraliroq
     ⚠️ vaqt O'ZGARMAS EMAS — decoder har token uchun qadam qiladi
```

> ## 🏆🏆 **WHISPER `ENCODER` I DOIM 30 SONIYA ISHLAYDI — AUDIO 1 s BO'LSA HAM.** ## **QISQA FAYLLARNI BIRLASHTIRING: RTF 0.266 → 0.063.**
>
> ## 💥 **VA `attn_implementation="eager"` SIZ `output_attentions` JIM RAVISHDA BO'SH QAYTADI.**

---

⬅️ [3-dars. CNN, RNN, LSTM](03-Deep-Learning-Models.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Modelni qurish](05-Building-a-Model.md)
