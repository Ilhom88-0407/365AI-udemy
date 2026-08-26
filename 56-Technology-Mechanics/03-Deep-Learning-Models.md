# 3-dars. Chuqur o'rganish: CNN, RNN, LSTM ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"LSTM ni RNN dan ajratadigan narsa — gradient. Va biz uni o'lchaymiz."**

---

## 1. Uch arxitektura, uch g'oya

| | 🖼️ **CNN** | 🔁 **RNN** | 🧠 **LSTM** |
|---|---|---|---|
| G'oya | ## **Mahalliy naqsh** | ## **Ketma-ket xotira** | ## **Boshqariladigan xotira** |
| Kirish | Spektrogramma *(rasm)* | Freymlar ketma-ketligi | Freymlar ketma-ketligi |
| Kuchli tomoni | ## ⭐ Shovqinga chidamli | Vaqt bog'liqligi | ## 🏆 **Uzoq bog'liqlik** |
| Zaif tomoni | 💥 Uzoq kontekst yo'q | ## 💥 **Gradient yo'qoladi** | ⚠️ Sekin, ko'p parametr |

> ## 🔑 **KURS TO'G'RI AYTADI:** *"CNN spektrogramma bilan ishlash uchun a'lo, chunki u aslida rasm."*
>
> ## ⭐ **VA BU — HAQIQATAN CHUQUR G'OYA:**
> ```
> Spektrogramma  →  2D matritsa (chastota × vaqt)
> Rasm           →  2D matritsa (balandlik × kenglik)
>
> ⭐ CNN ikkalasida ham BIR XIL ishlaydi
> ```

---

## 2. 💥💥 Gradient yo'qolishi — o'lchangan

> ## 🔑 **KURS AYTADI:** *"LSTM — RNN ning maxsus turi, uzoqroq muddat ma'lumot saqlash uchun."*
>
> ## ⚠️ **LEKIN KURS SABABNI AYTMAYDI. BIZ UNI O'LCHAYMIZ.**

```python
import torch, torch.nn as nn

for SEQ in [10, 50, 100, 200]:
    torch.manual_seed(0)
    x = torch.randn(1, SEQ, 26, requires_grad=True)
    for nom, K in [("RNN", RNN), ("LSTM", LSTM)]:
        torch.manual_seed(0)
        m = K()
        # ⭐ OXIRGI freymning chiqishi BIRINCHI freymga qanchalik bog'liq?
        g = torch.autograd.grad(m(x)[0, -1].sum(), x)[0][0]
        print(f"  SEQ={SEQ:4d} {nom:5s} birinchi freym grad "
              f"{float(g[0].abs().mean()):.3e} · "
              f"oxirgi {float(g[-1].abs().mean()):.3e}")
```

```
  SEQ=  10 RNN   birinchi 3.520e-05 · oxirgi 3.125e-02   nisbat 1.13e-03
  SEQ=  10 LSTM  birinchi 4.583e-05 · oxirgi 6.564e-03   nisbat 6.98e-03

  SEQ=  50 RNN   birinchi 1.624e-17 · oxirgi 3.035e-02   nisbat 5.35e-16
  SEQ=  50 LSTM  birinchi 8.192e-13 · oxirgi 7.160e-03   nisbat 1.14e-10

  SEQ= 100 RNN   birinchi 1.036e-32 · oxirgi 2.735e-02   nisbat 3.79e-31
  SEQ= 100 LSTM  birinchi 2.352e-23 · oxirgi 6.188e-03   nisbat 3.80e-21

  SEQ= 200 RNN   birinchi 0.000e+00 · oxirgi 3.083e-02   💥 AYNAN NOL
  SEQ= 200 LSTM  birinchi 1.906e-43 · oxirgi 7.290e-03
```

> ## 💥💥💥 **`SEQ=200` DA `RNN` NING BIRINCHI FREYMGA GRADIENTI — AYNAN `0.0`.**
>
> ## 🔑 **BU NIMANI ANGLATADI?** ## Model **200 freym oldingi** ma'lumotdan ## **hech narsa o'rgana olmaydi**. ## Backpropagation u yerga **yetib bormaydi**.
>
> ## 🏆 **LSTM ESA `1.906e-43` — NOL EMAS.** ## Kichik, lekin **mavjud**.
>
> ## ⭐ **VA `SEQ=100` DA FARQ AYNIQSA ANIQ:**
> ```
> RNN   1.036e-32
> LSTM  2.352e-23     🏆 LSTM 10¹¹ marta KATTA
> ```
>
> ## 🔑 **NIMA UCHUN?**
> ```
> RNN:   h_t = tanh(W·h_{t-1} + U·x_t)
>        →  har qadamda W ga KO'PAYTIRILADI
>        →  |W| < 1 bo'lsa  →  💥 eksponensial KAMAYADI
>
> LSTM:  c_t = f_t · c_{t-1} + i_t · g_t
>        →  ⭐ c_{t-1} ga QO'SHILADI, ko'paytirilmaydi
>        →  "unutish darvozasi" f_t ≈ 1 bo'lsa — gradient SAQLANADI
> ```
>
> ## 🏆🏆 **BU — LSTM NING BUTUN MOHIYATI: KO'PAYTIRISH O'RNIGA QO'SHISH.**
>
> ## 💡 **VA 200 FREYM = 2 SONIYA** *(10 ms qadamda)* — ## ya'ni bu **haqiqiy** muammo, nazariy emas.

---

## 3. ⚠️ Lekin amalda LSTM doim yutmaydi

```
for SEQ in [16, 32, 64, 128, 256]:
    # ... RNN, LSTM, Transformer ni bir xil ma'lumotda o'qitamiz
    # (to'liq kod — MASHQLAR.md, M12)
```

```
  SEQ=  16 ( 147 ketma-ketlik)  RNN 84.2% · LSTM 81.2% · Transformer 78.5%
  SEQ=  32 (  73 ketma-ketlik)  RNN 84.6% · LSTM 82.5% · Transformer 80.4%
  SEQ=  64 (  36 ketma-ketlik)  RNN 87.7% · LSTM 81.6% · Transformer 81.2%
  SEQ= 128 (  18 ketma-ketlik)  RNN 87.3% · LSTM 83.6% · Transformer 77.5%
  SEQ= 256 (   9 ketma-ketlik)  RNN 87.3% · LSTM 84.4% · Transformer 73.6%
```

> ## 💥💥 **`RNN` HAMMA UZUNLIKDA YUTDI — HATTO `SEQ=256` DA HAM.**
>
> ## ⚠️ **VA MEN BUNING TESKARISINI KUTGAN EDIM:** ## uzun ketma-ketlikda `LSTM` **ustun** bo'lishi kerak edi.
>
> ## 🔑 **NIMA UCHUN BUNDAY CHIQDI? — UCHTA SABAB:**
> ```
> ① MASALA UZOQ XOTIRANI TALAB QILMAYDI
>    "bu freym ovozlimi?" — javob ±3 freym ichida
>    →  💥 LSTM ning ustunligi ISHGA TUSHMAYDI
>
> ② MA'LUMOT KAM
>    SEQ=256 da atigi 9 ta ketma-ketlik (7 tasi o'qitishda)
>    →  💥 LSTM 23 617 parametrini o'rgatib bo'lmaydi
>
> ③ Transformer eng ko'p azob chekdi (73.6%)
>    →  68 737 parametr, 7 ta namuna  →  💥 umidsiz
> ```
>
> ## 🏆🏆 **DARS: ARXITEKTURANI MASALA VA MA'LUMOT TANLAYDI, MODA EMAS.**
>
> ## ⭐ **VA `LSTM` NING `84.4%` GA O'SISHI** *(81.2 → 84.4)* — ## uzun ketma-ketlikda u **yaxshilanadi**, ## `Transformer` esa **yomonlashadi** *(78.5 → 73.6)*.

---

## 4. ⭐⭐ Ma'lumot hajmi hamma narsani hal qiladi

```
   11/58 ketma-ketlik  MLP 75.0% · Transformer 57.9%
   23/58 ketma-ketlik  MLP 77.1% · Transformer 64.8%
   34/58 ketma-ketlik  MLP 78.8% · Transformer 72.1%
   46/58 ketma-ketlik  MLP 79.4% · Transformer 74.2%
   58/58 ketma-ketlik  MLP 81.0% · Transformer 80.4%
```

> ## 🏆🏆 **BU JADVAL — BUTUN CHUQUR O'RGANISHNING MOHIYATI:**
> ```
> Ma'lumot 5× oshdi (11 → 58):
>    MLP          75.0% → 81.0%   ⭐ +6.0 punkt
>    Transformer  57.9% → 80.4%   🏆 +22.5 punkt
> ```
>
> ## 🔑 **KATTA MODEL — MA'LUMOTDAN KO'PROQ FOYDA OLADI.** ## Lekin **kam ma'lumotda** u **yomonroq**.
>
> ## ⭐ **VA EKSTRAPOLYATSIYA QILING:**
> ```
> 58 ketma-ketlikda ular TENGLASHDI (81.0 vs 80.4)
> →  100 da Transformer O'ZIB KETADI
> →  💡 Whisper 680 000 SOAT audioda o'qitilgan
> ```
>
> ## 🏆 **AYNAN SHU SABABLI TRANSFORMER G'ALABA QILDI** — ## u **1990-yillarda ham bo'lishi mumkin edi**, ## lekin **ma'lumot va GPU yo'q edi**.

---

## 5. ⭐ CNN — kontekst oynasi orqali

```
  ±0 freym (  26 o'lcham,   1,793 parametr)  ->  81.0%
  ±2 freym ( 130 o'lcham,   8,449 parametr)  ->  84.0%   🏆
  ±5 freym ( 286 o'lcham,  18,433 parametr)  ->  82.7%
  ±10 freym ( 546 o'lcham,  35,073 parametr) ->  82.3%
```

> ## 🏆 **`±2 FREYM` — ENG YAXSHI** *(84.0%)*, ## va u `MLP` ni **RNN darajasiga** ko'taradi.
>
> ## 💥 **`±5` VA `±10` DA NATIJA TUSHDI** — ## ko'proq kontekst **doim yaxshi emas**.
>
> ## 🔑 **SABAB:** parametrlar **20× ko'paydi** *(1 793 → 35 073)*, ## ma'lumot esa **o'zgarmadi**.
>
> ## ⭐ **VA `±2 freym = ±20 ms`** — ## bu aynan **fonema ichidagi** kontekst. ## 💡 Undan ortig'i **boshqa fonemani** qo'shadi va **shovqin** bo'ladi.
>
> ## 🏆 **CNN AYNAN SHUNI AVTOMATIK QILADI:** ## `Conv1d(kernel_size=5)` — bu **±2 freym** oynasi. ## ⭐ Lekin CNN da og'irliklar **umumiy** *(shared)*, ## shuning uchun parametrlar **kamroq**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** LSTM ning uch darvozasi qaysi?

**M2.** Nima uchun RNN da gradient yo'qoladi?

**M3.** Kontekst oynasining eng yaxshi kengligi qancha chiqdi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Kirish** *(input)* · **unutish** *(forget)* · **chiqish** *(output)*.

**M2.** ## `h_t = tanh(W·h_{t-1} + ...)` — ## har qadamda `W` ga **ko'paytiriladi**. ## `|W| < 1` → **eksponensial kamayadi**. ## O'lchandi: `SEQ=200` da **aynan 0.0**.

**M3.** ## **±2 freym** *(±20 ms)* → **84.0%**. ## Kattaroq oyna natijani **yomonlashtirdi**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Gradient yo'qolishini o'lchang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 2-bo'limdagi kodni ishga tushiring, so'ng **grafik** chizing:

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

SEQ = 150
torch.manual_seed(0)
x = torch.randn(1, SEQ, 26, requires_grad=True)

fig, ax = plt.subplots(figsize=(11, 5))
for nom, K, rang in [("RNN", RNN, "#f87171"), ("LSTM", LSTM, "#4ade80")]:
    torch.manual_seed(0)
    m = K()
    g = torch.autograd.grad(m(x)[0, -1].sum(), x)[0][0]
    v = g.abs().mean(dim=1).numpy()
    ax.semilogy(np.maximum(v, 1e-45), label=nom, color=rang, lw=1.5)

ax.set_xlabel("freym raqami (oxirgisi — 149)")
ax.set_ylabel("|gradient| (log shkala)")
ax.set_title("Oxirgi freymning chiqishi qaysi freymlarga BOG'LIQ?")
ax.legend()
ax.grid(alpha=.3)
plt.tight_layout()
plt.savefig("gradient.png", dpi=110)
print("💾 gradient.png")
```

## 🏆 **GRAFIKDA `RNN` CHIZIG'I KESKIN TUSHADI, `LSTM` — SEKIN.** ## Bu — **butun farqning ko'rinishi**.

</details>

**M5.** ⭐⭐ Ketma-ketlik uzunligining ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 3-bo'limdagi jadvalni takrorlang, so'ng **sun'iy uzoq bog'liqlik** masalasini yarating:

```python
def uzoq_bogliqlik(nb=200, SEQ=100, urug=0):
    """⭐ Javob BIRINCHI freymda — model uni ESLAB QOLISHI kerak."""
    r = np.random.RandomState(urug)
    X = r.randn(nb, SEQ, 26).astype(np.float32)
    belgi = r.rand(nb) > 0.5
    X[belgi, 0, 0] = 5.0                       # ⭐ signal FAQAT boshida
    X[~belgi, 0, 0] = -5.0
    Y = np.repeat(belgi[:, None, None], SEQ, axis=1).astype(np.float32)
    return torch.tensor(X), torch.tensor(Y)


X2, Y2 = uzoq_bogliqlik()
b2 = 160
for nom, K in [("RNN", RNN), ("LSTM", LSTM), ("Transformer", TRF)]:
    torch.manual_seed(0)
    m = K()
    opt = torch.optim.Adam(m.parameters(), lr=3e-3)
    for _ in range(150):
        opt.zero_grad()
        lf(m(X2[:b2])[:, -1], Y2[:b2, -1]).backward()
        opt.step()
    with torch.no_grad():
        acc = ((torch.sigmoid(m(X2[b2:])[:, -1]) > 0.5).float()
               == Y2[b2:, -1]).float().mean()
    print(f"  {nom:12s} oxirgi freym aniqligi: {acc:.1%}")
```

## 🏆 **BU MASALA UZOQ XOTIRANI *MAJBURAN* TALAB QILADI** — ## javob **100 freym oldinda**.

## 💡 **BU YERDA `LSTM` VA `Transformer` `RNN` DAN USTUN CHIQISHI KERAK.**

</details>

**M6.** ⭐ Kontekst oynasi va CNN ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
class CNN1(nn.Module):
    """⭐ kernel=5 → ±2 freym oynasi, lekin og'irliklar UMUMIY."""
    def __init__(s, d=26, h=64, k=5):
        super().__init__()
        s.c = nn.Sequential(nn.Conv1d(d, h, k, padding=k//2), nn.ReLU(),
                            nn.Conv1d(h, 1, 1))

    def forward(s, x):
        return s.c(x.transpose(1, 2)).transpose(1, 2)


for k in [1, 3, 5, 11, 21]:
    torch.manual_seed(0)
    m = CNN1(k=k)
    par = sum(p.numel() for p in m.parameters())
    opt = torch.optim.Adam(m.parameters(), lr=3e-3)
    for _ in range(60):
        opt.zero_grad()
        lf(m(Xtr), Ytr).backward()
        opt.step()
    with torch.no_grad():
        acc = ((torch.sigmoid(m(Xte)) > 0.5).float() == Yte).float().mean()
    print(f"  kernel={k:3d} (±{k//2} freym, {par:7,d} par)  ->  {acc:.1%}")
```

## ⭐ **CNN NI `MLP + kontekst oyna` BILAN SOLISHTIRING:** ## bir xil oyna kengligida CNN **kamroq parametr** ishlatadi, ## chunki og'irliklar **hamma pozitsiyada umumiy**.

</details>

---

## 📌 Xulosa

```
CNN   →  mahalliy naqsh (Conv kernel = kontekst oynasi)
RNN   →  h_t = tanh(W·h_{t-1} + U·x_t)     💥 KO'PAYTIRISH → gradient yo'qoladi
LSTM  →  c_t = f_t·c_{t-1} + i_t·g_t       ⭐ QO'SHISH → gradient saqlanadi
```

```
🔬 GRADIENT YO'QOLISHI (oxirgi freym → birinchi freym):
   SEQ= 10   RNN 3.52e-05  ·  LSTM 4.58e-05
   SEQ=100   RNN 1.04e-32  ·  LSTM 2.35e-23   🏆 LSTM 10¹¹× katta
   SEQ=200   RNN 0.00e+00  ·  LSTM 1.91e-43   💥 RNN da AYNAN NOL

🔬 AMALIY ANIQLIK (bizning masala):
   SEQ= 16   RNN 84.2% · LSTM 81.2% · Transformer 78.5%
   SEQ=256   RNN 87.3% · LSTM 84.4% · Transformer 73.6%
   ⚠️ RNN hamma joyda yutdi — masala uzoq xotira TALAB QILMAYDI

🔬 MA'LUMOT HAJMI:
   11 → 58 ketma-ketlik
     MLP          75.0% → 81.0%   (+6.0)
     Transformer  57.9% → 80.4%   🏆 (+22.5)

🔬 KONTEKST OYNASI:
   ±0 → 81.0%  ·  ±2 → 84.0% 🏆  ·  ±5 → 82.7%  ·  ±10 → 82.3%
```

> ## 🏆🏆 **LSTM NING BUTUN MOHIYATI — KO'PAYTIRISH O'RNIGA QO'SHISH.**
>
> ## 💥 **LEKIN ARXITEKTURANI MASALA VA MA'LUMOT TANLAYDI, MODA EMAS.**

---

⬅️ [2-dars. HMM va NN](02-HMM-and-Neural-Networks.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Transformerlar](04-Transformers.md)
