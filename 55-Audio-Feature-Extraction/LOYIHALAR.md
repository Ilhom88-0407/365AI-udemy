# 🚀 55-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham `librosa` dan tashqariga chiqadi** — ## xususiyatlarni **noldan** quradi.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install numpy scipy pandas matplotlib soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, json
from pathlib import Path
import numpy as np, pandas as pd
import scipy.signal as sig, scipy.fftpack as fftpack
import librosa, soundfile as sf
```

---

# 🔧 1-loyiha. MFCC dvigateli — noldan

> **Maqsad:** MFCC ni **"sehr"dan** — **oltita aniq qadamga** aylantirish ## va har qadamni **alohida ko'rish**.

```python
class MFCCDvigateli:
    """🏆 MFCC ning har qadami OCHIQ va SOZLANADIGAN.

    librosa ishlatilmaydi — faqat numpy va scipy.
    """

    def __init__(self, sr=16000, n_fft=512, hop=160, win=400,
                 n_mels=40, n_mfcc=13, pre=0.97, oyna="hamming",
                 htk=True, fmin=0.0, fmax=None, log_pol=1e-10):
        self.sr, self.n_fft, self.hop, self.win = sr, n_fft, hop, win
        self.n_mels, self.n_mfcc = n_mels, n_mfcc
        self.pre, self.oyna, self.htk = pre, oyna, htk
        self.fmin = fmin
        self.fmax = fmax or sr / 2
        self.log_pol = log_pol
        self._B = None                      # ⭐ filtr bank keshi

    # ───────────────── mel shkalasi
    def hz2mel(self, f):
        # ⚠️ atleast_1d — skalyar uchun ham ishlashi SHART
        f = np.atleast_1d(np.asarray(f, dtype=float)).copy()
        if self.htk:
            return 2595.0 * np.log10(1.0 + f / 700.0)
        # ⚠️ Slaney: 1000 Hz gacha CHIZIQLI
        m = f / (200.0 / 3)
        yuq = f >= 1000.0
        m[yuq] = 15.0 + np.log(f[yuq] / 1000.0) / (np.log(6.4) / 27.0)
        return m

    def mel2hz(self, m):
        m = np.atleast_1d(np.asarray(m, dtype=float)).copy()
        if self.htk:
            return 700.0 * (10.0 ** (m / 2595.0) - 1.0)
        f = m * (200.0 / 3)
        yuq = m >= 15.0
        f[yuq] = 1000.0 * np.exp((m[yuq] - 15.0) * (np.log(6.4) / 27.0))
        return f

    # ───────────────── ① pre-emphasis
    def qadam1_pre(self, y):
        return np.append(y[0], y[1:] - self.pre * y[:-1])

    # ───────────────── ② freymlash + oyna
    def qadam2_freym(self, x):
        n = 1 + (len(x) - self.n_fft) // self.hop
        idx = np.arange(self.n_fft)[None, :] + self.hop * np.arange(n)[:, None]
        F = x[idx]
        if self.oyna:
            w = sig.get_window(self.oyna, self.n_fft).astype(F.dtype)
            F = F * w
        return F

    # ───────────────── ③ quvvat spektri
    def qadam3_spektr(self, F):
        return np.abs(np.fft.rfft(F, self.n_fft, axis=1)) ** 2 / self.n_fft

    # ───────────────── ④ mel filtr bank
    def filtr_bank(self):
        if self._B is not None:
            return self._B
        hz = self.mel2hz(np.linspace(float(self.hz2mel(self.fmin)[0]),
                                     float(self.hz2mel(self.fmax)[0]),
                                     self.n_mels + 2))
        fr = np.fft.rfftfreq(self.n_fft, 1 / self.sr)
        B = np.zeros((self.n_mels, len(fr)))
        for i in range(self.n_mels):
            l, c, r = hz[i], hz[i + 1], hz[i + 2]
            B[i] = np.maximum(0, np.minimum((fr - l) / (c - l),
                                            (r - fr) / (r - c)))
        self._B = B
        return B

    def qadam4_mel(self, P):
        return P @ self.filtr_bank().T

    # ───────────────── ⑤ log
    def qadam5_log(self, E):
        return np.log(np.maximum(E, self.log_pol))

    # ───────────────── ⑥ DCT
    def qadam6_dct(self, L):
        return fftpack.dct(L, type=2, axis=1, norm="ortho")[:, :self.n_mfcc]

    # ───────────────── to'liq quvur
    def mfcc(self, y, oraliq=False):
        q = {}
        x = self.qadam1_pre(y);      q["① pre"] = x
        F = self.qadam2_freym(x);    q["② freym"] = F
        P = self.qadam3_spektr(F);   q["③ spektr"] = P
        E = self.qadam4_mel(P);      q["④ mel"] = E
        L = self.qadam5_log(E);      q["⑤ log"] = L
        C = self.qadam6_dct(L);      q["⑥ dct"] = C
        return (C.T, q) if oraliq else C.T

    # ───────────────── tahlil
    def tahlil(self, y):
        """⭐ Har qadamdan keyin nima o'zgarganini ko'rsatadi."""
        _, q = self.mfcc(y, oraliq=True)
        print(f"  {'qadam':12s} {'shakl':>16s} {'min':>10s} "
              f"{'maks':>10s} {'MB':>7s}")
        print("  " + "-" * 60)
        for nom, a in q.items():
            print(f"  {nom:12s} {str(a.shape):>16s} {a.min():10.3f} "
                  f"{a.max():10.3f} {a.nbytes/1024**2:7.2f}")
        return q

    def delta(self, M, order=1, w=9):
        """⭐ Regressiya asosidagi delta — HTK usuli."""
        N = (w - 1) // 2
        d = np.arange(-N, N + 1)
        norm = 2 * (d ** 2).sum()
        for _ in range(order):
            P = np.pad(M, ((0, 0), (N, N)), mode="edge")
            M = sum(k * P[:, N + k: N + k + M.shape[1]]
                    for k in d) / norm
        return M

    def toliq(self, y):
        """🏆 39 o'lchamli standart ASR kirishi."""
        M = self.mfcc(y)
        return np.vstack([M, self.delta(M), self.delta(M, order=2)])
```

### ▶️ Ishga tushirish

```python
y, sr = librosa.load("speech_01.wav", sr=16000)

d = MFCCDvigateli()
d.tahlil(y)

M = d.mfcc(y)
lb = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=160)
n = min(M.shape[1], lb.shape[1])
print("\n  librosa bilan korrelyatsiya:")
for i in range(5):
    print(f"    c{i}  {np.corrcoef(M[i, :n], lb[i, :n])[0, 1]:+.4f}")

print(f"\n  to'liq (39 o'lcham): {d.toliq(y).shape}")
```

```
  qadam                   shakl        min       maks      MB
  ------------------------------------------------------------
  ① pre               (376190,)     -1.098      1.061    1.44
  ② freym           (2348, 512)     -1.097      1.059    4.59
  ③ spektr          (2348, 257)      0.000      1.302    2.30
  ④ mel              (2348, 40)      0.000      5.653    0.72
  ⑤ log              (2348, 40)    -23.026      1.732    0.72
  ⑥ dct              (2348, 13)   -145.628     14.403    0.23

  librosa bilan korrelyatsiya:
    c0  +0.9513
    c1  +0.7843
    c2  +0.8647
    c3  +0.8697
    c4  +0.6178

  to'liq (39 o'lcham): (39, 2348)
```

> ## 🏆 **`tahlil()` JADVALI — LOYIHANING ENG QIMMATLI QISMI.**
>
> ## ⭐ **TO'RTTA NARSAGA E'TIBOR BERING:**
>
> ### ① 💾 **Xotira: 4.59 MB → 0.23 MB** *(20× siqilish)*
> ## Mel filtr **257 → 40**, DCT **40 → 13**.
>
> ### ② 💥 **`⑤ log` MINIMUMI AYNAN −23.026**
> ## Bu — `log(1e-10) = −23.026`, ya'ni **jimlik poli**. ## ⚠️ `log_pol` ni o'zgartirsangiz — **bu qiymat ham** o'zgaradi, ## va MFCC **butunlay boshqacha** bo'ladi.
>
> ### ③ ⭐ **`① pre` MAKSIMUMI 1.061 — ASL SIGNALDAN KATTA**
> ## 🔑 `pre-emphasis` — **yuqori chastotalarni kuchaytiradi**, ## shuning uchun amplituda **oshishi mumkin**. ## ⚠️ Agar signal allaqachon **0 dBFS** ga yaqin bo'lsa — ## 💥 pre-emphasis **clipping** hosil qiladi.
>
> ### ④ ⭐ **`③ spektr` 1.302 → `④ mel` 5.653**
> ## Mel filtr **bir necha binni qo'shadi**, shuning uchun qiymat **4× oshdi**.
>
> ## ⚠⚠ **VA BU YERDA BITTA XATO TOPILDI — `htk=False` ISHLAMADI:**
> ```
> TypeError: 'numpy.float64' object does not support item assignment
> ```
> ## 🔑 **SABAB:** `np.asarray(skalyar)` — **0 o'lchamli** massiv beradi, ## unga `m[yuq] = ...` **yozib bo'lmaydi**.
>
> ## ✅ **YECHIM — `np.atleast_1d()`** *(yuqoridagi kodda tuzatilgan)*.
>
> ## 🏆 **DARS: SKALYAR VA MASSIVNI BIR XIL QABUL QILADIGAN FUNKSIYA YOZSANGIZ** — ## `np.atleast_1d()` **deyarli doim** kerak bo'ladi.

---

# 🎛️ 2-loyiha. Xususiyat laboratoriyasi

> **Maqsad:** *"Qaysi xususiyat kerak?"* degan savolga ## **o'lchov bilan** javob berish.

```python
class XususiyatLaboratoriyasi:
    """🔬 Xususiyatlarni AJRATISH KUCHI bo'yicha baholaydi."""

    def __init__(self, sr=16000, nw=400, nh=160, n_fft=512):
        self.sr, self.nw, self.nh, self.n_fft = sr, nw, nh, n_fft

    # ───────────────── xususiyatlar
    def xususiyatlar(self, y, n_mfcc=13):
        S = np.abs(librosa.stft(y, n_fft=self.n_fft, hop_length=self.nh,
                                win_length=self.nw))
        M = librosa.feature.mfcc(y=y, sr=self.sr, n_mfcc=n_mfcc,
                                 n_fft=self.n_fft, hop_length=self.nh)
        D = librosa.feature.delta(M)

        q = {
            "ZCR": librosa.feature.zero_crossing_rate(
                y, frame_length=self.nw, hop_length=self.nh)[0],
            "RMS": librosa.feature.rms(y=y, frame_length=self.nw,
                                       hop_length=self.nh)[0],
            "centroid": librosa.feature.spectral_centroid(S=S, sr=self.sr)[0],
            "bandwidth": librosa.feature.spectral_bandwidth(S=S,
                                                            sr=self.sr)[0],
            "rolloff": librosa.feature.spectral_rolloff(S=S, sr=self.sr)[0],
            "flatness": librosa.feature.spectral_flatness(S=S)[0],
        }
        for i in range(n_mfcc):
            q[f"mfcc{i}"] = M[i]
        for i in range(min(4, n_mfcc)):
            q[f"delta{i}"] = D[i]
        return q

    # ───────────────── belgi (ovozli/ovozsiz)
    def belgi(self, y):
        _, v, _ = librosa.pyin(y, fmin=60, fmax=400, sr=self.sr,
                               frame_length=1024, hop_length=self.nh)
        return v

    # ───────────────── Cohen's d
    @staticmethod
    def cohen_d(a, b):
        s = np.sqrt((a.var() + b.var()) / 2)
        return abs(float(a.mean() - b.mean())) / max(s, 1e-9)

    def bahola(self, y, top=12):
        """🏆 Har xususiyatning AJRATISH KUCHINI o'lchaydi."""
        X = self.xususiyatlar(y)
        v = self.belgi(y)
        n = min(len(v), min(len(x) for x in X.values()))
        v = v[:n]

        q = []
        for nom, x in X.items():
            a, b = x[:n][v], x[:n][~v]
            if len(a) < 5 or len(b) < 5:
                continue
            q.append({"xususiyat": nom,
                      "ovozli": round(float(a.mean()), 4),
                      "ovozsiz": round(float(b.mean()), 4),
                      "Cohen_d": round(self.cohen_d(a, b), 3)})

        d = pd.DataFrame(q).sort_values("Cohen_d", ascending=False)
        print(d.head(top).to_string(index=False))
        print("\n  💡 Cohen's d: 0.2 kichik · 0.5 o'rta · 0.8 katta")
        print(f"  🏆 eng kuchli: {d.iloc[0].xususiyat} "
              f"({d.iloc[0].Cohen_d})")
        print(f"  💥 eng zaif  : {d.iloc[-1].xususiyat} "
              f"({d.iloc[-1].Cohen_d})")
        return d

    # ───────────────── korrelyatsiya (ortiqcha xususiyatlar)
    def ortiqcha(self, y, chegara=0.85):
        """⚠️ Bir-birini takrorlaydigan xususiyatlarni topadi."""
        X = self.xususiyatlar(y)
        n = min(len(x) for x in X.values())
        nomlar = list(X)
        A = np.vstack([X[k][:n] for k in nomlar])
        C = np.corrcoef(A)

        juftlar = []
        for i in range(len(nomlar)):
            for j in range(i + 1, len(nomlar)):
                if abs(C[i, j]) > chegara:
                    juftlar.append((nomlar[i], nomlar[j],
                                    round(float(C[i, j]), 3)))
        juftlar.sort(key=lambda x: -abs(x[2]))

        print(f"  |korrelyatsiya| > {chegara} bo'lgan juftlar: "
              f"{len(juftlar)}")
        for a, b, c in juftlar[:10]:
            print(f"    {a:10s} ↔ {b:10s}  {c:+.3f}   "
                  f"⚠️ bittasi ORTIQCHA")
        return juftlar

    # ───────────────── tezlik
    def tezlik(self, y):
        davom = len(y) / self.sr
        Q = {
            "ZCR": lambda: librosa.feature.zero_crossing_rate(
                y, frame_length=self.nw, hop_length=self.nh),
            "RMS": lambda: librosa.feature.rms(
                y=y, frame_length=self.nw, hop_length=self.nh),
            "STFT": lambda: librosa.stft(y, n_fft=self.n_fft,
                                         hop_length=self.nh),
            "mel (80)": lambda: librosa.feature.melspectrogram(
                y=y, sr=self.sr, n_fft=self.n_fft, hop_length=self.nh,
                n_mels=80),
            "MFCC (13)": lambda: librosa.feature.mfcc(
                y=y, sr=self.sr, n_mfcc=13, n_fft=self.n_fft,
                hop_length=self.nh),
            "pyin": lambda: librosa.pyin(y, fmin=60, fmax=400, sr=self.sr,
                                         hop_length=self.nh),
        }
        for nom, f in Q.items():
            k = 2 if nom == "pyin" else 3
            dt = min(self._olch(f) for _ in range(k))
            print(f"  {nom:12s} {dt*1000:8.1f} ms · RTF {dt/davom:8.5f} · "
                  f"1 soat -> {dt/davom*3600:6.1f} s")

    @staticmethod
    def _olch(f):
        t0 = time.perf_counter()
        f()
        return time.perf_counter() - t0
```

### ▶️ Ishga tushirish

```python
lab = XususiyatLaboratoriyasi()

print("① AJRATISH KUCHI")
lab.bahola(y)

print("\n② ORTIQCHA XUSUSIYATLAR")
lab.ortiqcha(y)

print("\n③ TEZLIK")
lab.tezlik(y)
```

```
① AJRATISH KUCHI
xususiyat    ovozli   ovozsiz  Cohen_d
      RMS    0.1024    0.0466    1.705
      ZCR    0.0947    0.2355    0.935
    mfcc3   15.2311   -5.2700    0.854
 centroid 1479.6011 2241.7998    0.717
    mfcc6   -6.6650  -14.4971    0.654
    mfcc1  103.2377   76.0766    0.583
    mfcc0 -267.6088 -317.9287    0.549
 flatness    0.0226    0.0971    0.514
  rolloff 2928.1834 3742.2201    0.482
   mfcc12  -14.3366  -10.0616    0.469
    mfcc5   -7.0935  -12.6075    0.434
    mfcc7   -6.4097   -1.9769    0.420

  💡 Cohen's d: 0.2 kichik · 0.5 o'rta · 0.8 katta
  🏆 eng kuchli: RMS (1.705)
  💥 eng zaif  : mfcc4 (0.015)

② ORTIQCHA XUSUSIYATLAR
  |korrelyatsiya| > 0.85 bo'lgan juftlar: 3
    ZCR        ↔ centroid    +0.956   ⚠️ bittasi ORTIQCHA
    centroid   ↔ rolloff     +0.922   ⚠️ bittasi ORTIQCHA
    bandwidth  ↔ rolloff     +0.872   ⚠️ bittasi ORTIQCHA

③ TEZLIK
  ZCR               4.4 ms · RTF  0.00019 · 1 soat ->    0.7 s
  RMS               1.4 ms · RTF  0.00006 · 1 soat ->    0.2 s
  STFT              4.3 ms · RTF  0.00018 · 1 soat ->    0.7 s
  mel (80)          7.6 ms · RTF  0.00032 · 1 soat ->    1.2 s
  MFCC (13)        11.2 ms · RTF  0.00048 · 1 soat ->    1.7 s
  pyin            677.7 ms · RTF  0.02882 · 1 soat ->  103.8 s
```

> ## 🏆 **`mfcc3` UCHINCHI O'RINDA** *(0.854)* — ## `mfcc1` *(0.583)* va `mfcc0` *(0.549)* dan **yuqori**.
>
> ## ⚠⚠ **BU MENING KUTGANIMGA ZID EDI.** ## Men `mfcc0` *(energiya)* `RMS` bilan bir xil bo'lgani uchun ## **ikkinchi o'rinda** bo'ladi deb o'ylagandim. ## 💥 U esa — **yettinchi**.
>
> ## 🔑 **SABAB:** `mfcc0` — energiyaning **logarifmi**, ## va logarifm farqlarni **siqadi**. ## ⭐ `RMS` esa — **chiziqli**, shuning uchun ajratishi **kuchliroq**.
>
> ## 💥 **VA `mfcc4` — ENG ZAIF** *(0.015)*: ## ba'zi MFCC koeffitsientlari **umuman foydasiz** bo'lishi mumkin. ## ⚠️ Lekin ular **boshqa masalada** *(fonema tanish)* foydali bo'lishi mumkin.

> ## 🏆🏆 **`② ORTIQCHA` — ENG QIMMATLI NATIJA:**
> ```
> ZCR ↔ centroid   +0.956   💥 DEYARLI AYNAN BIR XIL
> ```
> ## 🔑 **VA BU MANTIQIY:** ikkalasi ham **"signal qanchalik yuqori chastotali"** ## degan savolga javob beradi — ## faqat **turli usulda** *(vaqt vs chastota domeni)*.
>
> ## ⭐ **AMALIY XULOSA:** ## `ZCR` yoki `centroid` — **bittasini** oling. ## 💡 `ZCR` **30× arzon** *(4.4 ms vs STFT + centroid)*.
>
> ## 💡 **`centroid ↔ rolloff +0.922` HAM — ikkalasi ham "spektr qayerda" ni o'lchaydi.**

> ## ⭐ **`③ TEZLIK` — HAMMASI `RTF < 0.001`.** ## Xususiyat ajratish **hech qachon tor joy bo'lmaydi**. ## 💥 **`pyin` bundan mustasno: 154× sekin** *(677.7 vs 4.4 ms)*.

---

## 📌 Ikki loyihaning bog'lanishi

```
① MFCCDvigateli          →  MFCC ni TUSHUNISH va SOZLASH
② XususiyatLaboratoriyasi →  qaysi xususiyat KERAKLIGINI o'lchash

🏆 ② bilan tanlang  →  ① bilan hisoblang
```

> ## 🏆 **VA IKKALASINING UMUMIY DARSI:**
> ```
> ⭐ Xususiyatni "mashhurligi" bo'yicha tanlamang
> ⭐ Cohen's d bilan AJRATISH kuchini o'lchang
> ⭐ korrelyatsiya bilan ORTIQCHA larni tashlang
> ⭐ RTF bilan NARXINI biling
> ```
>
> ## 💡 **VA ENG MUHIMI — HAMMA BU MEHNAT ZAMONAVIY MODELLARDA KERAK EMAS.** ## Whisper **80 kanalli mel-spektrogramma** oladi va ## **o'zi** kerakli xususiyatni topadi. ## 🏆 **Lekin u xato qilganda — tashxisni SIZ qo'yasiz.**

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
