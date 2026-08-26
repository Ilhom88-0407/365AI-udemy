# 📝 56-modul mashqlari

> **20 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin

## ⚙️ Tayyorgarlik

```bash
pip install numpy librosa torch transformers scikit-learn
```

```python
import warnings; warnings.filterwarnings("ignore")
import time
import numpy as np, librosa, torch, torch.nn as nn

y, sr = librosa.load("speech_01.wav", sr=16000)
M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=160)
X = np.vstack([M, librosa.feature.delta(M)]).T.astype(np.float32)
_, voiced, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr,
                            frame_length=1024, hop_length=160)

n = min(len(X), len(voiced))
X, Y = X[:n], voiced[:n].astype(np.float32)
X = (X - X.mean(0)) / (X.std(0) + 1e-9)

SEQ, nb = 32, n // 32
Xs = torch.tensor(X[:nb*SEQ].reshape(nb, SEQ, 26))
Ys = torch.tensor(Y[:nb*SEQ].reshape(nb, SEQ, 1))
bol = int(nb * 0.8)
Xtr, Ytr, Xte, Yte = Xs[:bol], Ys[:bol], Xs[bol:], Ys[bol:]
lf = nn.BCEWithLogitsLoss()
```

---

# 🟢 OSON *(1–7)*

**M1.** Akustik va til modelining vazifasi nima?

**M2.** Nima uchun `"wreck a nice beach"` misoli mashhur?

**M3.** HMM qaysi ikki ehtimollikni baholaydi?

**M4.** Nima uchun RNN da gradient yo'qoladi?

**M5.** Whisper kirishi doim qanday o'lchamda?

**M6.** Nima uchun `√d` ga bo'linadi?

**M7.** Kursning ro'yxatidagi qaysi vositalar eskirgan?

<details>
<summary>✅ Javoblar (1–7)</summary>

**M1.** ## **Akustik**: audio → fonema *(nima eshitildi)*. ## **Til**: fonema → so'z *(nima aytilgan bo'lishi mumkin)*.

**M2.** ## Ikki ibora **akustik jihatdan deyarli bir xil** — ## farqni faqat **til modeli** ko'radi.

**M3.** ## `P(fonema₂|fonema₁)` va `P(xususiyat|fonema)`.

**M4.** ## `h_t = tanh(W·h_{t-1})` — har qadamda **ko'paytiriladi**. ## O'lchandi: `SEQ=200` da **aynan 0.0**.

**M5.** ## Doim **`80 × 3000`** = **30 soniya**.

**M6.** ## Usiz softmax **1.0000** ga yig'iladi → ## 💥 gradient **nol**.

**M7.** ## **DeepSpeech**, **wav2letter++**, **Kaldi** *(sekinlashdi)*.

</details>

---

# 🟡 O'RTA *(8–15)*

**M8.** ⭐⭐ n-gramm til modelini yozing.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 1-darsda.)*

```
  === 2-gramm ===  (lug'at 17)
     -0.883   to'g'ri jumla
     -2.020   so'zlar almashgan
     -2.891   tartib buzilgan

  === 3-gramm ===
     -0.768   to'g'ri jumla
     -1.911   so'zlar almashgan
     -2.255   tartib buzilgan
```

## 💥 **3-GRAMM AJRATISHNI YOMONLASHTIRDI** *(farq 2.008 → 1.487)*. ## Sabab — **ma'lumot yetishmasligi**.

</details>

**M9.** ⭐⭐ Whisper encoder/decoder nisbatini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import WhisperForConditionalGeneration

for nom in ["openai/whisper-tiny", "openai/whisper-base",
            "openai/whisper-small"]:
    m = WhisperForConditionalGeneration.from_pretrained(nom)
    e = sum(p.numel() for p in m.model.encoder.parameters())
    d = sum(p.numel() for p in m.model.decoder.parameters())
    print(f"  {nom.split('/')[-1]:14s} encoder {e/1e6:6.1f}M · "
          f"decoder {d/1e6:6.1f}M · nisbat {d/e:.2f}×")
    del m
```

```
  whisper-tiny   encoder    8.2M · decoder   29.6M · nisbat 3.61×
  whisper-base   encoder   20.6M · decoder   52.0M · nisbat 2.53×
  whisper-small  encoder   88.2M · decoder  153.6M · nisbat 1.74×
```

</details>

**M10.** ⭐⭐ Arxitekturalarni solishtiring.

<details>
<summary>✅ Yechim</summary>

*(Model sinflari 2-darsda.)*

```
  model         parametr   o'qitish   sinov aniqligi
  MLP              1,793     0.08s       81.0%
  CNN             28,993     0.15s       83.1%
  RNN              5,953     0.18s       84.6%   🏆
  LSTM            23,617     0.22s       82.5%
  Transformer     68,737     0.38s       80.4%   💥
```

## 💥 **ENG KO'P PARAMETR — ENG PAST ANIQLIK.**

</details>

**M11.** ⭐⭐ Gradient yo'qolishini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
for SEQ2 in [10, 50, 100, 200]:
    torch.manual_seed(0)
    x = torch.randn(1, SEQ2, 26, requires_grad=True)
    for nom, K in [("RNN", RNN), ("LSTM", LSTM)]:
        torch.manual_seed(0)
        m = K()
        g = torch.autograd.grad(m(x)[0, -1].sum(), x)[0][0]
        print(f"  SEQ={SEQ2:4d} {nom:5s} birinchi {g[0].abs().mean():.3e} · "
              f"oxirgi {g[-1].abs().mean():.3e}")
```

```
  SEQ= 200 RNN   birinchi 0.000e+00 · oxirgi 3.083e-02   💥 AYNAN NOL
  SEQ= 200 LSTM  birinchi 1.906e-43 · oxirgi 7.290e-03
```

</details>

**M12.** ⭐⭐ Ketma-ketlik uzunligini o'zgartiring.

<details>
<summary>✅ Yechim</summary>

```python
for SEQ2 in [16, 32, 64, 128, 256]:
    nb2 = n // SEQ2
    X2 = torch.tensor(X[:nb2*SEQ2].reshape(nb2, SEQ2, 26))
    Y2 = torch.tensor(Y[:nb2*SEQ2].reshape(nb2, SEQ2, 1))
    b2 = max(int(nb2 * 0.8), 2)
    q = []
    for K in [RNN, LSTM, TRF]:
        torch.manual_seed(0)
        m = K()
        opt = torch.optim.Adam(m.parameters(), lr=3e-3)
        for _ in range(60):
            opt.zero_grad()
            lf(m(X2[:b2]), Y2[:b2]).backward()
            opt.step()
        with torch.no_grad():
            q.append(float(((torch.sigmoid(m(X2[b2:])) > 0.5).float()
                            == Y2[b2:]).float().mean()))
    print(f"  SEQ={SEQ2:4d} ({nb2:4d} ket.)  RNN {q[0]:.1%} · "
          f"LSTM {q[1]:.1%} · Transformer {q[2]:.1%}")
```

```
  SEQ=  16 ( 147 ket.)  RNN 84.2% · LSTM 81.2% · Transformer 78.5%
  SEQ= 256 (   9 ket.)  RNN 87.3% · LSTM 84.4% · Transformer 73.6%
```

## ⚠️ **RNN HAMMA JOYDA YUTDI** — masala **uzoq xotira talab qilmaydi**.

</details>

**M13.** ⭐⭐ E'tibor mexanizmini yozing.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 4-darsda.)*

```
  √d bilan : ball -1.66 .. 6.30    softmax maks 0.9871  ✅
  √d siz   : ball -6.64 .. 25.20   softmax maks 1.0000  💥
```

</details>

**M14.** ⭐⭐ Ma'lumot sizib chiqishini o'lchang.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 5-darsda.)*

```
  iz    tasodifiy  gapiruvchi   farq
   0.0      98.8%      97.5%    +1.3 punkt   ✅
   2.0      98.8%      53.8%   +45.0 punkt   💥
```

</details>

**M15.** ⭐ Vositalarni tekshiring va solishtiring.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 6-darsda.)*

```
  Whisper (1846 ms):  My name is Yvonne and I am excited... community. Before...
  Google  (5114 ms):  my name is Yvonne and I am excited... Community before...
```

## 🏆 **Whisper 2.8× tez** va **tinish belgilarini qo'yadi**.

</details>

---

# 🔴 QIYIN *(16–20)*

**M16.** ⭐⭐⭐ Uzoq bog'liqlik masalasini yarating.

<details>
<summary>✅ Yechim</summary>

```python
def uzoq_bogliqlik(nb=200, SEQ=100, urug=0):
    """⭐ Javob BIRINCHI freymda — model uni ESLASHI kerak."""
    r = np.random.RandomState(urug)
    Xu = r.randn(nb, SEQ, 26).astype(np.float32)
    b = r.rand(nb) > 0.5
    Xu[b, 0, 0] = 5.0                       # ⭐ signal FAQAT boshida
    Xu[~b, 0, 0] = -5.0
    Yu = np.repeat(b[:, None, None], SEQ, axis=1).astype(np.float32)
    return torch.tensor(Xu), torch.tensor(Yu)


for SEQ2 in [20, 50, 100]:
    X2, Y2 = uzoq_bogliqlik(SEQ=SEQ2)
    print(f"\n  === SEQ={SEQ2} ===")
    for nom, K in [("RNN", RNN), ("LSTM", LSTM), ("Transformer", TRF)]:
        torch.manual_seed(0)
        m = K()
        opt = torch.optim.Adam(m.parameters(), lr=3e-3)
        for _ in range(200):
            opt.zero_grad()
            lf(m(X2[:160])[:, -1], Y2[:160, -1]).backward()
            opt.step()
        with torch.no_grad():
            acc = ((torch.sigmoid(m(X2[160:])[:, -1]) > 0.5).float()
                   == Y2[160:, -1]).float().mean()
        print(f"    {nom:12s} {acc:.1%}")
```

```
  === SEQ=20 ===
    RNN          70.0%
    LSTM         95.0%   🏆
    Transformer  87.5%   ⭐

  === SEQ=50 ===
    RNN          47.5%
    LSTM         52.5%
    Transformer  77.5%   🏆

  === SEQ=100 ===
    RNN          42.5%   💥 tanga tashlash darajasida
    LSTM         55.0%
    Transformer  50.0%
```

## 🏆🏆 **NATIJA 3-DARSNING TESKARISI — VA BU AYNAN KUTILGAN:**
```
3-dars (ovozli/ovozsiz)  →  RNN yutdi  (uzoq xotira KERAK EMAS)
bu masala (uzoq xotira)  →  LSTM 95% · Transformer 87.5% · RNN 70%
```

## ✅ **`SEQ=20` DA LSTM `95.0%`, RNN `70.0%`** — ## darvozalar **ishladi**.

## ⭐ **`SEQ=50` DA TRANSFORMER YETAKCHI** *(77.5%)* — ## e'tibor mexanizmi **masofaga bog'liq emas**.

## 💥 **`SEQ=100` DA HAMMASI QULADI** — ## 160 ta o'qitish namunasi ## bunday masala uchun **yetarli emas**.

## 🏆 **DARS: ARXITEKTURANI MASALA TANLAYDI.** ## Bir xil modellar **ikki masalada teskari** natija berdi.

</details>

**M17.** ⭐⭐⭐ Whisper e'tiborini tahlil qiling.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import WhisperForConditionalGeneration, WhisperProcessor

proc = WhisperProcessor.from_pretrained("openai/whisper-tiny")
f = proc.feature_extractor(y, sampling_rate=16000, return_tensors="pt")
m = WhisperForConditionalGeneration.from_pretrained(
    "openai/whisper-tiny", attn_implementation="eager")     # ⭐ SHART
m.eval()
with torch.no_grad():
    eo = m.model.encoder(f.input_features, output_attentions=True)

for L in range(4):
    A = eo.attentions[L][0]
    H = -(A * torch.log(A + 1e-12)).sum(-1).mean()
    d = np.array([np.trace(A[h].numpy()) / A.shape[-1]
                  for h in range(A.shape[0])])
    print(f"  qatlam {L}: entropiya {H:.3f} · diagonal {d.mean():.4f} "
          f"({d.mean()*A.shape[-1]:.0f}× tasodifiydan)")
```

```
  qatlam 0: entropiya 2.857 · diagonal 0.0102 (15× tasodifiydan)
  qatlam 1: entropiya 5.217 · diagonal 0.0243 (36×)
  qatlam 2: entropiya 3.957 · diagonal 0.0269 (40×)
  qatlam 3: entropiya 3.659 · diagonal 0.0128 (19×)
```

## ⚠️ **ENTROPIYA VA DIAGONAL BIR-BIRIGA ZID:** ## `qatlam 1` eng **tarqoq** *(5.217)*, lekin diagonali **36×**. ## 🔑 U **hamma joyga bir oz**, lekin **o'ziga eng ko'p** qaraydi.

</details>

**M18.** ⭐⭐⭐ Kvantlashni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import time
from transformers import pipeline

asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")
t0 = time.perf_counter()
r1 = asr(y.copy(), generate_kwargs={"language": "en"})["text"].strip()
t1 = time.perf_counter() - t0

par32 = sum(p.numel() * p.element_size()
            for p in asr.model.parameters()) / 1024**2

q = torch.ao.quantization.quantize_dynamic(
    asr.model, {torch.nn.Linear}, dtype=torch.qint8)
asr.model = q
t0 = time.perf_counter()
r2 = asr(y.copy(), generate_kwargs={"language": "en"})["text"].strip()
t2 = time.perf_counter() - t0

print(f"  float32: {t1*1000:7.1f} ms · {par32:.1f} MB")
print(f"  int8   : {t2*1000:7.1f} ms · {t1/t2:.2f}× tez")
print(f"  matn bir xilmi: {'✅' if r1 == r2 else '💥 FARQ BOR'}")
if r1 != r2:
    print(f"    f32: {r1[:90]}")
    print(f"    i8 : {r2[:90]}")
```

## ⚠️ **CPU DA KVANTLASH DOIM TEZLASHTIRMAYDI** — ## bu **apparatga** bog'liq.

## 🏆 **VA MATN O'ZGARSA — BU MUHIM SIGNAL.**

</details>

**M19.** ⭐⭐⭐ Vosita tanlash funksiyasini yozing.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 6-darsda, M5.)*

## 🏆 **UNI O'Z LOYIHANGIZ TALABLARI BILAN TO'LDIRING** — ## u **qaror hujjati** vazifasini bajaradi.

</details>

**M20.** ⭐⭐⭐ To'liq baholash quvurini yozing.

<details>
<summary>✅ Yechim</summary>

```python
from sklearn.model_selection import GroupShuffleSplit


def toliq_bahola(X, Y, G, modellar, n_takror=3):
    """🏆 Gapiruvchi bo'yicha bo'lish + bir necha takror."""
    import pandas as pd

    q = []
    for nom, K in modellar.items():
        ballar = []
        for u in range(n_takror):
            gss = GroupShuffleSplit(n_splits=1, test_size=0.2,
                                    random_state=u)
            tr, te = next(gss.split(X, Y, groups=G))

            torch.manual_seed(u)
            m = K()
            opt = torch.optim.Adam(m.parameters(), lr=3e-3)
            Xt = torch.tensor(X[tr])
            Yt = torch.tensor(Y[tr])[:, None]
            for _ in range(200):
                opt.zero_grad()
                lf(m(Xt), Yt).backward()
                opt.step()
            with torch.no_grad():
                p = (torch.sigmoid(m(torch.tensor(X[te]))) > 0.5).float()
                ballar.append(float((p[:, 0].numpy() == Y[te]).mean()))

        q.append({"model": nom,
                  "parametr": sum(p.numel() for p in K().parameters()),
                  "o'rtacha": round(float(np.mean(ballar)), 4),
                  "std": round(float(np.std(ballar)), 4),
                  "min": round(min(ballar), 4),
                  "maks": round(max(ballar), 4)})

    d = pd.DataFrame(q).sort_values("o'rtacha", ascending=False)
    print(d.to_string(index=False))
    print("\n  💡 'std' — MODEL BARQARORLIGI. Katta bo'lsa — ishonchsiz.")
    return d
```

## 🏆 **UCHTA MAJBURIY ELEMENT:**
```
① GroupShuffleSplit  →  gapiruvchi sizib chiqmasin
② n_takror ≥ 3       →  bitta natija TASODIF bo'lishi mumkin
③ std ni hisobot qiling  →  "84.6%" emas, "84.6% ± 2.1%"
```

## 💥 **BITTA O'LCHOVGA ASOSLANIB XULOSA CHIQARMANG.**

</details>

---

## 📌 Modulda o'lchangan hamma narsa

| O'lchov | Natija |
|---|---|
| n-gramm: to'g'ri / buzilgan | −0.883 / **−2.891** |
| 3-gramm ajratishi | ## 💥 **26% yomonlashdi** *(sparsity)* |
| Whisper `tiny` encoder/decoder | 8.2M / **29.6M** — ## **3.61×** |
| Whisper `small` | 88.2M / 153.6M — **1.74×** |
| Whisper kirishi | ## **(1, 80, 3000)** — doim **30 s** |
| Encoder chiqishi | (1, **1500**, 384) — conv stride 2 |
| E'tibor entropiyasi | 2.857 / 5.217 / 3.957 / 3.659 |
| Diagonal og'irligi | tasodifiydan ## **15–40×** yuqori |
| `√d` bilan / siz | softmax maks **0.9871** / ## 💥 **1.0000** |
| MLP | 1 793 par · **81.0%** |
| RNN | 5 953 par · ## 🏆 **84.6%** |
| Transformer | 68 737 par · ## 💥 **80.4%** |
| Gradient `SEQ=200` | RNN ## **0.00e+00** · LSTM 1.91e-43 |
| Ma'lumot 11→58 | MLP **+6.0** · Transformer ## 🏆 **+22.5** punkt |
| Kontekst oynasi | ±0 81.0% · ## ⭐ **±2 84.0%** · ±10 82.3% |
| Sizib chiqish *(iz=2.0)* | 98.8% vs ## 💥 **53.8%** — **45 punkt** |
| Whisper vs Google *(tezlik)* | **1846** vs 5114 ms — ## **2.8×** |
| 30 s to'ldirish | 1 s **RTF 0.266** · 29 s ## **RTF 0.063** |
| Uzoq bog'liqlik *(SEQ=20)* | RNN 70.0% · LSTM ## 🏆 **95.0%** · Transformer 87.5% |
| Uzoq bog'liqlik *(SEQ=50)* | RNN 47.5% · LSTM 52.5% · Transformer ## 🏆 **77.5%** |

---

🏠 [Modul boshiga](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
