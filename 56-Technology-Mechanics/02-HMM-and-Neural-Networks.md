# 2-dars. HMM va an'anaviy neyron tarmoqlar ⭐⭐

## 🎬 Boshlashdan oldin

> **"HMM 30 yil hukmronlik qildi. Uni neyron tarmoq emas — MA'LUMOT yengdi."**

---

## 1. HMM — ikkita ehtimollik

> ## 🔑 **KURS TO'G'RI TUSHUNTIRADI:** *"HMM ikki narsani baholaydi: bir fonemadan boshqasiga o'tish ehtimoli, va berilgan fonema uchun ma'lum audio xususiyatlarni ko'rish ehtimoli."*
>
> | | Nima | Qayerdan |
> |---|---|---|
> | ## **O'tish** `P(fonema₂ \| fonema₁)` | Ketma-ketlik | Belgilangan matndan **sanash** |
> | ## **Chiqish** `P(xususiyat \| fonema)` | Akustika | Audio + belgidan **o'rganish** |
>
> ## ⭐ **KURSNING MISOLI ANIQ:** *"Agar `s` dan keyin tez-tez `t` kelsa — model bu o'tishga yuqori ehtimol beradi."*

### ⚠️ Markov taxminining narxi

```
Markov taxmini: keyingi fonema FAQAT hozirgisiga bog'liq

"speech" so'zida:
   /s/ → /p/ → /iː/ → /tʃ/
   💥 /tʃ/ ni bashorat qilishda /s/ UNUTILGAN
```

> ## 🔑 **KURS BUNI TO'G'RI AYTADI:** *"HMM keyingi fonemani faqat hozirgisiga qarab bashorat qiladi, butun ketma-ketlikka emas."*
>
> ## ⭐ **AMALDA BU MUAMMONI QANDAY YECHISHGAN?**
> ```
> ① TRIFON — /s/ kontekstidagi /p/ ni ALOHIDA holat qilish
>    →  40 fonema  →  40³ = 64 000 trifon
>    →  💥 juda ko'p, ma'lumot yetmaydi
>    →  ⭐ yechim: klasterlash (decision tree tying)
>
> ② Har fonemaga 3 HOLAT (boshi, o'rtasi, oxiri)
>    →  ⭐ davomiylikni yaxshiroq modellashtiradi
> ```
>
> ## 💡 **YA'NI HMM "SODDA" EMAS EDI** — ## 2010-yillardagi tizimlarda **o'n minglab holat** bo'lgan.

---

## 2. ⭐⭐ HMM ni 52-modulda o'lchagan edik

```
kuzatuv          xom ehtimol   log/freym
BIR              1.021e-01     -0.7607
BBIIRR           2.421e-02     -0.6202
BBBBIIIIRRRR     8.836e-04     -0.5860
RIB              6.320e-03     -1.6880   💥 xom ehtimoli YUQORI
```

> ## 💥 **XOM EHTIMOL ISHLAMAYDI** — **uzunlik** hal qiladi.
>
> ## 🏆 **IKKI YECHIM** *(52-modul, 4-dars)*:
> ```
> ① log/freym  →  uzunlikka normallash
> ② MODELLAR RAQOBATI  →  har so'z uchun alohida HMM   ⭐ amalda shunday
> ```
>
> ## ⭐ **VA HAQIQIY ASR DA IKKINCHISI ISHLATILADI** — ## `Viterbi` algoritmi **butun lug'at** bo'ylab ## eng ehtimolli **yo'lni** topadi.

---

## 3. 🧠 Neyron tarmoq — kursning tushuntirishi

> ## 🔑 **KURSNING TASHBEHI YAXSHI:** *"Og'irliklar — ovoz balandligi regulyatorlari kabi: signal qanchalik kuchli o'tishini boshqaradi."*
>
> ```
> KIRISH        →  MFCC (13 yoki 39 o'lcham)
> YASHIRIN      →  naqshlarni topadi
> CHIQISH       →  fonema ehtimolliklari
>
> o'rganish     →  ⭐ backpropagation (xatodan orqaga)
> ```

### ⚠️ Lekin kurs bitta muhim narsani aytmaydi

```
💥 ODDIY NEYRON TARMOQ VAQTNI KO'RMAYDI

Kirish: bitta freym (25 ms)
   →  u OLDINGI va KEYINGI freymlardan BEXABAR
   →  💥 /s/ va /z/ ni ajratib bo'lmaydi (ular kontekstda farq qiladi)
```

> ## 🏆 **1990-YILLARDAGI YECHIM — "KONTEKST OYNASI":**
> ```python
> # ⭐ bitta freym o'rniga — 11 ta freym (±5)
> kirish = np.concatenate([X[i-5], ..., X[i], ..., X[i+5]])
> # 39 × 11 = 429 o'lcham
> ```
> ## 💡 **BU — ARZON VA SAMARALI HIYLA**, ## va u **hozir ham** ishlatiladi *(masalan, `wav2vec` da)*.

---

## 4. 🔬 Arxitekturalarni **bir xil masalada** solishtiramiz

```python
import numpy as np, librosa, torch, torch.nn as nn, time

y, sr = librosa.load("speech_01.wav", sr=16000)
M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=160)
X = np.vstack([M, librosa.feature.delta(M)]).T.astype(np.float32)
_, voiced, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr,
                            frame_length=1024, hop_length=160)

n = min(len(X), len(voiced))
X, Y = X[:n], voiced[:n].astype(np.float32)
X = (X - X.mean(0)) / (X.std(0) + 1e-9)          # ⭐ SHART

SEQ, nb = 32, n // 32
Xs = torch.tensor(X[:nb*SEQ].reshape(nb, SEQ, 26))
Ys = torch.tensor(Y[:nb*SEQ].reshape(nb, SEQ, 1))
bol = int(nb * 0.8)
Xtr, Ytr, Xte, Yte = Xs[:bol], Ys[:bol], Xs[bol:], Ys[bol:]
```

```
  ma'lumot: (2352, 26) · ovozli ulushi 59.2%
  o'qitish torch.Size([58, 32, 26]) · sinov torch.Size([15, 32, 26])
```

```
  model       parametr   o'qitish   sinov aniqligi
  MLP            1,793     0.08s       81.0%
  CNN           28,993     0.15s       83.1%
  RNN            5,953     0.18s       84.6%   🏆
  LSTM          23,617     0.22s       82.5%
  Transformer   68,737     0.38s       80.4%   💥
```

> ## 💥💥 **TRANSFORMER — ENG KO'P PARAMETR, ENG PAST ANIQLIK.**
>
> ## ⚠️ **VA MEN BUNING TESKARISINI KUTGAN EDIM.**
>
> ## 🔑 **SABAB — MA'LUMOT HAJMI:**
> ```
> O'qitish to'plami: 58 ketma-ketlik × 32 freym = 1856 namuna
>
> MLP          1 793 parametr  →  ⭐ namunaga ~1 parametr
> Transformer 68 737 parametr  →  💥 namunaga 37 parametr
>                                  →  MODEL MA'LUMOTNI YODLAYDI
> ```
>
> ## 🏆🏆 **BU — MODULNING ENG MUHIM DARSI:**
> ## **ARXITEKTURA "ZAMONAVIY" BO'LGANI UCHUN YAXSHI EMAS.**
> ## **KATTA MODEL KATTA MA'LUMOT TALAB QILADI.**
>
> ## ⭐ **VA `MLP` 1 793 PARAMETR BILAN 81.0% BERDI** — ## `Transformer` dan **38× kichik**, lekin **yaxshiroq**.
>
> ## 💡 **NIMA UCHUN `RNN` YUTDI?**
> ```
> ⭐ vaqt bog'liqligini KO'RADI (MLP dan afzal)
> ⭐ atigi 5 953 parametr (LSTM va Transformerdan kam)
> ⭐ qisqa ketma-ketlik (32 freym) — RNN uchun IDEAL
> ```
>
> ## ⚠️ **UZUN KETMA-KETLIKDA NATIJA TESKARI BO'LADI** — ## `RNN` **gradient yo'qolishi** muammosiga duch keladi *(3-dars)*.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** HMM qaysi ikki ehtimollikni baholaydi?

**M2.** Markov taxminining cheklovi nima?

**M3.** Nima uchun oddiy neyron tarmoq vaqtni ko'rmaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **O'tish** `P(fonema₂|fonema₁)` va ## **chiqish** `P(xususiyat|fonema)`.

**M2.** ## Keyingi fonema **faqat hozirgisiga** bog'liq — ## uzoq kontekst **yo'qoladi**.

**M3.** ## U **bitta freymni** oladi. ## ⭐ Yechim — **kontekst oynasi** *(±5 freym)*.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Arxitekturalarni solishtiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 4-bo'limdagi kodni ishlating va **modellarni yozing**:

```python
class MLP(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.f = nn.Sequential(nn.Linear(d, h), nn.ReLU(), nn.Linear(h, 1))

    def forward(s, x):
        return s.f(x)


class CNN(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.c = nn.Sequential(nn.Conv1d(d, h, 5, padding=2), nn.ReLU(),
                            nn.Conv1d(h, h, 5, padding=2), nn.ReLU(),
                            nn.Conv1d(h, 1, 1))

    def forward(s, x):
        return s.c(x.transpose(1, 2)).transpose(1, 2)


class RNN(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.r = nn.RNN(d, h, batch_first=True)
        s.o = nn.Linear(h, 1)

    def forward(s, x):
        return s.o(s.r(x)[0])


class LSTM(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.r = nn.LSTM(d, h, batch_first=True)
        s.o = nn.Linear(h, 1)

    def forward(s, x):
        return s.o(s.r(x)[0])


class TRF(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.p = nn.Linear(d, h)
        s.t = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(h, 4, h * 2, batch_first=True,
                                       dropout=0.0), 2)
        s.o = nn.Linear(h, 1)

    def forward(s, x):
        return s.o(s.t(s.p(x)))


lf = nn.BCEWithLogitsLoss()
for nom, K in [("MLP", MLP), ("CNN", CNN), ("RNN", RNN),
               ("LSTM", LSTM), ("Transformer", TRF)]:
    torch.manual_seed(0)                       # ⭐ takrorlanadigan natija
    m = K()
    par = sum(p.numel() for p in m.parameters())
    opt = torch.optim.Adam(m.parameters(), lr=3e-3)
    t0 = time.perf_counter()
    for _ in range(60):
        opt.zero_grad()
        lf(m(Xtr), Ytr).backward()
        opt.step()
    dt = time.perf_counter() - t0
    with torch.no_grad():
        acc = ((torch.sigmoid(m(Xte)) > 0.5).float() == Yte).float().mean()
    print(f"  {nom:12s} {par:8,d}  {dt:6.2f}s   {acc:.1%}")
```

## 💥 **`torch.manual_seed(0)` — HAR MODELDAN OLDIN.** ## Usiz natijalar **taqqoslab bo'lmaydigan** bo'ladi.

</details>

**M5.** ⭐⭐ Ma'lumot hajmining ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
for ulush in [0.2, 0.4, 0.6, 0.8]:
    k = max(int(bol * ulush), 4)
    print(f"\n  === o'qitish {k}/{bol} ketma-ketlik ===")
    for nom, K in [("MLP", MLP), ("Transformer", TRF)]:
        torch.manual_seed(0)
        m = K()
        opt = torch.optim.Adam(m.parameters(), lr=3e-3)
        for _ in range(60):
            opt.zero_grad()
            lf(m(Xtr[:k]), Ytr[:k]).backward()
            opt.step()
        with torch.no_grad():
            acc = ((torch.sigmoid(m(Xte)) > 0.5).float()
                   == Yte).float().mean()
        print(f"    {nom:12s} {acc:.1%}")
```

## 🏆 **BU MASHQ "KATTA MODEL — KATTA MA'LUMOT" QOIDASINI TASDIQLAYDI.**

## 💡 **KUTILADIGAN NAQSH:** ma'lumot ko'paygani sari ## `Transformer` ning natijasi **tezroq yaxshilanadi**.

</details>

**M6.** ⭐ Kontekst oynasini qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
def kontekst_oyna(X, k=5):
    """⭐ Har freymga ±k qo'shni freymni qo'shadi."""
    n, d = X.shape
    P = np.pad(X, ((k, k), (0, 0)), mode="edge")
    return np.concatenate([P[i:i + n] for i in range(2 * k + 1)], axis=1)


for k in [0, 2, 5, 10]:
    Xk = kontekst_oyna(X, k) if k else X
    Xk = torch.tensor(Xk[:nb*SEQ].reshape(nb, SEQ, -1))
    torch.manual_seed(0)
    m = MLP(d=Xk.shape[-1])
    opt = torch.optim.Adam(m.parameters(), lr=3e-3)
    for _ in range(60):
        opt.zero_grad()
        lf(m(Xk[:bol]), Ytr).backward()
        opt.step()
    with torch.no_grad():
        acc = ((torch.sigmoid(m(Xk[bol:])) > 0.5).float()
               == Yte).float().mean()
    print(f"  ±{k:2d} freym ({Xk.shape[-1]:4d} o'lcham)  ->  {acc:.1%}")
```

## 🏆 **KONTEKST OYNASI `MLP` NI "VAQTNI KO'RADIGAN" QILADI** — ## rekurrent qatlamlarsiz.

## ⚠️ **LEKIN NARXI BOR:** `±10` da o'lcham **26 → 546**, ## ya'ni parametrlar **21× ko'payadi**.

</details>

---

## 📌 Xulosa

```
HMM   →  ① P(fonema₂|fonema₁)   ② P(xususiyat|fonema)
         💥 Markov taxmini: faqat HOZIRGI fonemaga bog'liq
         ⭐ yechim: trifon + har fonemaga 3 holat

NN    →  og'irliklar + backpropagation
         💥 bitta freym — vaqtni KO'RMAYDI
         ⭐ yechim: kontekst oynasi (±5 freym)
```

```
🔬 O'LCHANGAN (2352 freym, 58 o'qitish ketma-ketligi):
   model       parametr   aniqlik
   MLP            1,793    81.0%
   CNN           28,993    83.1%
   RNN            5,953    84.6%   🏆 eng yaxshi
   LSTM          23,617    82.5%
   Transformer   68,737    80.4%   💥 eng ko'p parametr, eng past natija
```

> ## 🏆🏆 **ARXITEKTURA "ZAMONAVIY" BO'LGANI UCHUN YAXSHI EMAS.** ## **1 793 PARAMETRLI `MLP` — 68 737 PARAMETRLI `Transformer` DAN YAXSHIROQ.**
>
> ## 🔑 **CHUNKI O'QITISH TO'PLAMIDA ATIGI 1856 NAMUNA BOR.**

---

⬅️ [1-dars. Akustik va til modeli](01-Acoustic-and-Language-Modeling.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. CNN, RNN, LSTM](03-Deep-Learning-Models.md)
