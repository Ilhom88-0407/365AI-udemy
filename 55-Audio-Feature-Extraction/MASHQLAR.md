# 📝 55-modul mashqlari

> **22 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin

## ⚙️ Tayyorgarlik

```bash
pip install numpy scipy pandas matplotlib soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import time
import numpy as np, pandas as pd, scipy.signal as sig
import librosa, soundfile as sf

WAV = "speech_01.wav"
y, sr = librosa.load(WAV, sr=16000)
NW, NH = 400, 160                     # ⭐ 25 ms / 10 ms

S = np.abs(librosa.stft(y, n_fft=512, hop_length=NH, win_length=NW))
M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=NH)
f0, voiced, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr,
                             frame_length=1024, hop_length=NH)
```

---

# 🟢 OSON *(1–8)*

**M1.** Uch toifa xususiyat qaysi?

**M2.** ZCR ovozli/ovozsizda qanday farq qiladi?

**M3.** `spectral flatness` nima o'lchaydi?

**M4.** MFCC da `c0` nima va nima uchun tashlanadi?

**M5.** Nima uchun aynan 13 koeffitsient?

**M6.** `25 ms / 10 ms` nima uchun standart?

**M7.** FFT DFT dan necha marta tez?

**M8.** Nima uchun oyna funksiyasi kerak?

<details>
<summary>✅ Javoblar (1–8)</summary>

**M1.** ## ⏱️ **vaqt** *(ZCR, RMS)* · 📊 **chastota** *(centroid)* · ## 🏆 **vaqt-chastota** *(MFCC, spektrogramma)*.

**M2.** ## Ovozsizda **2.49× yuqori** — 0.2355 vs 0.0947.

**M3.** ## Spektr **ton** ga yoki **shovqin** ga o'xshashligini. ## Ovozli **0.0226**, ovozsiz **0.0971**.

**M4.** ## **Umumiy energiya**. ## Mikrofon masofasiga bog'liq → **so'z haqida ma'lumot bermaydi**.

**M5.** ## 13 ta — dispersiyaning **89.40%** i. ## 40 taga o'tish **+10.6%** beradi, o'lchamni **3×** oshiradi.

**M6.** ## 25 ms — fonema **ichida** *(50–100 ms)*, ## 3–4 ta `f0` davri sig'adi. ## 10 ms — **100 freym/s**.

**M7.** ## `N=1024` da **324×** *(o'lchandi)*. ## `O(N²)` → `O(N·logN)`.

**M8.** ## Signal bin markazida bo'lmasa — **sizib chiqish**. ## `boxcar` **−25 dB**, `hann` **−70 dB** — **45 dB farq**.

</details>

---

# 🟡 O'RTA *(9–17)*

**M9.** ⭐ ZCR chegarasini optimallashtiring.

<details>
<summary>✅ Yechim</summary>

```python
zcr = librosa.feature.zero_crossing_rate(y, frame_length=NW,
                                         hop_length=NH)[0]
n = min(len(voiced), len(zcr))
v, z = voiced[:n], zcr[:n]

for ch in [0.05, 0.10, 0.15, 0.20, 0.25, 0.30]:
    print(f"  ZCR < {ch:.2f}  ->  aniqlik {((z < ch) == v).mean():.1%}")
```

```
  ZCR < 0.05  ->  aniqlik 48.6%
  ZCR < 0.10  ->  aniqlik 80.0%    ⭐ eng yaxshi
  ZCR < 0.15  ->  aniqlik 77.3%
  ZCR < 0.20  ->  aniqlik 67.6%
  ZCR < 0.30  ->  aniqlik 65.6%
```

## ⚠️ **ENG YAXSHI CHEGARA — 0.10, IKKI O'RTACHA ORASIDA EMAS** *(0.0947 va 0.2355 → o'rtasi 0.165)*.

## 🔑 **SABAB — TAQSIMOTLAR KESISHADI.**

</details>

**M10.** ⭐⭐ Xususiyatlarni `Cohen's d` bo'yicha saralang.

<details>
<summary>✅ Yechim</summary>

```python
d1 = librosa.feature.delta(M)
XUS = {
    "ZCR": zcr,
    "RMS": librosa.feature.rms(y=y, frame_length=NW, hop_length=NH)[0],
    "centroid": librosa.feature.spectral_centroid(S=S, sr=sr)[0],
    "bandwidth": librosa.feature.spectral_bandwidth(S=S, sr=sr)[0],
    "rolloff": librosa.feature.spectral_rolloff(S=S, sr=sr)[0],
    "flatness": librosa.feature.spectral_flatness(S=S)[0],
    "MFCC c1": M[1], "MFCC c2": M[2],
    "delta c1": d1[1], "delta c2": d1[2],
}

q = []
for nom, x in XUS.items():
    a, b = x[:n][v], x[:n][~v]
    s = np.sqrt((a.var() + b.var()) / 2)
    q.append({"xususiyat": nom,
              "ovozli": round(float(a.mean()), 4),
              "ovozsiz": round(float(b.mean()), 4),
              "Cohen_d": round(abs(float(a.mean()-b.mean()))/max(s, 1e-9), 3)})

print(pd.DataFrame(q).sort_values("Cohen_d", ascending=False)
      .to_string(index=False))
```

```
xususiyat    ovozli   ovozsiz  Cohen_d
      RMS    0.1024    0.0466    1.705   🏆
      ZCR    0.0947    0.2355    0.935
 centroid 1479.6011 2241.7998    0.717
  MFCC c1  103.2377   76.0766    0.583
 flatness    0.0226    0.0971    0.514
  rolloff 2928.1834 3742.2201    0.482
  MFCC c2  -12.3705  -20.9041    0.318
 delta c1    0.2696   -0.4554    0.096
 delta c2   -0.1168    0.1980    0.088
bandwidth 1641.3833 1676.5191    0.079   💥
```

## 🏆 **ENG ODDIY XUSUSIYAT — `RMS` — ENG KUCHLI.**

## 💥 **`bandwidth` va `delta` lar — deyarli ajratmaydi.**

</details>

**M11.** ⭐⭐ MFCC ni noldan yozing.

<details>
<summary>✅ Yechim</summary>

```python
import scipy.fftpack as fftpack


def mfcc_noldan(y, sr, n_mfcc=13, n_fft=512, hop=160, n_mels=40, pre=0.97):
    """🏆 MFCC ning HAMMA olti qadami — qo'lda."""
    x = np.append(y[0], y[1:] - pre * y[:-1])            # ① pre-emphasis

    n_frame = 1 + (len(x) - n_fft) // hop                # ② freymlash
    idx = np.arange(n_fft)[None, :] + hop * np.arange(n_frame)[:, None]
    F = x[idx] * np.hamming(n_fft)

    P = np.abs(np.fft.rfft(F, n_fft, axis=1)) ** 2 / n_fft   # ③ quvvat

    def hz2mel(f):
        return 2595 * np.log10(1 + f / 700)

    def mel2hz(m):
        return 700 * (10 ** (m / 2595) - 1)

    hz = mel2hz(np.linspace(hz2mel(0), hz2mel(sr / 2), n_mels + 2))
    fr = np.fft.rfftfreq(n_fft, 1 / sr)
    B = np.zeros((n_mels, len(fr)))                       # ④ mel filtr
    for i in range(n_mels):
        l, c, r = hz[i], hz[i+1], hz[i+2]
        B[i] = np.maximum(0, np.minimum((fr - l) / (c - l),
                                        (r - fr) / (r - c)))

    E = np.log(np.maximum(P @ B.T, 1e-10))                # ⑤ log
    return fftpack.dct(E, type=2, axis=1, norm="ortho")[:, :n_mfcc].T  # ⑥


me = mfcc_noldan(y, sr)
lb = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=160)
nn = min(me.shape[1], lb.shape[1])
for i in range(5):
    print(f"  c{i}  korrelyatsiya "
          f"{np.corrcoef(me[i, :nn], lb[i, :nn])[0, 1]:+.4f}  "
          f"(meniki {me[i].mean():8.2f} · librosa {lb[i].mean():8.2f})")
```

```
  c0  korrelyatsiya +0.9513  (meniki   -51.13 · librosa  -288.15)
  c1  korrelyatsiya +0.7846  (meniki    -4.31 · librosa    92.15)
  c2  korrelyatsiya +0.8649  (meniki    -4.10 · librosa   -15.85)
  c3  korrelyatsiya +0.8699  (meniki    -2.79 · librosa     6.86)
  c4  korrelyatsiya +0.6183  (meniki     0.40 · librosa    14.06)
```

## ⚠️ **SHKALA FARQ QILADI** *(HTK mel + natural log vs Slaney mel + dB)*, ## lekin **korrelyatsiya 0.62–0.95**.

## 💥 **`c4` DA KORRELYATSIYA TUSHDI** — yuqori koeffitsientlar **sozlamalarga sezgirroq**.

</details>

**M12.** ⭐ Freym parametrlarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
q = []
for mw in [10, 20, 25, 32, 50]:
    for ust in [0.0, 0.5, 0.6, 0.75]:
        nw = int(sr * mw / 1000)
        nh = max(int(nw * (1 - ust)), 1)
        nf = 1 + (len(y) - nw) // nh
        z2 = librosa.feature.zero_crossing_rate(y, frame_length=nw,
                                                hop_length=nh)[0]
        q.append({"oyna_ms": mw, "ustma_ust": f"{ust:.0%}", "freym": nf,
                  "freym_s": round(nf/(len(y)/sr), 1),
                  "xotira_MB": round(nf*nw*4/1024**2, 1),
                  "zcr_std": round(float(z2.std()), 4)})
print(pd.DataFrame(q).to_string(index=False))
```

```
 oyna_ms ustma_ust  freym  freym_s  xotira_MB  zcr_std
      10        0%   2351    100.0        1.4   0.1621
      10       75%   9401    399.8        5.7   0.1619
      25       60%   2349     99.9        3.6   0.1568
      50       75%   1877     79.8        5.7   0.1470
```

## 💡 **`xotira_MB` FAQAT USTMA-USTLIKKA BOG'LIQ** — ## oyna o'lchamiga **umuman emas**.

## ⚠️ **`zcr_std` ustma-ustlikdan MUSTAQIL** — ## ustma-ustlikni oshirish **ma'lumot qo'shmaydi**.

</details>

**M13.** ⭐⭐ DFT ni noldan yozing.

<details>
<summary>✅ Yechim</summary>

```python
def dft_sekin(x):
    n = len(x)
    k = np.arange(n)
    return np.exp(-2j * np.pi * k[:, None] * k[None, :] / n) @ x


for N in [64, 256, 512, 1024]:
    x = y[:N]
    t0 = time.perf_counter(); a = dft_sekin(x)
    td = time.perf_counter() - t0
    t0 = time.perf_counter(); b = np.fft.fft(x)
    tf = time.perf_counter() - t0
    print(f"  N={N:5d}  DFT {td*1000:8.3f} ms · FFT {tf*1000:7.4f} ms · "
          f"{td/max(tf,1e-12):7.1f}× · farq {np.abs(a-b).max():.2e}")
```

```
  N=   64  DFT    1.361 ms · FFT  0.5693 ms ·     2.4× · farq 7.75e-09
  N=  512  DFT    7.405 ms · FFT  0.0573 ms ·   129.2× · farq 5.97e-08
  N= 1024  DFT   27.262 ms · FFT  0.0842 ms ·   323.8× · farq 1.31e-07
```

</details>

**M14.** ⭐⭐ Oyna funksiyalarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
N = 512
for f in [1000.0, 1015.6]:
    print(f"\n  === {f} Hz (bin {f/(sr/N):.3f}) ===")
    t = np.arange(N) / sr
    s = np.sin(2 * np.pi * f * t)
    for nom in ["boxcar", "hamming", "hann", "blackman", "flattop"]:
        w = sig.get_window(nom, N)
        Sx = np.abs(np.fft.rfft(s * w))
        Sx = Sx / Sx.max()
        fr = np.fft.rfftfreq(N, 1 / sr)
        uzoq = np.abs(fr - f) > 300
        print(f"    {nom:9s} {20*np.log10(max(Sx[uzoq].max(), 1e-15)):8.2f} dB")
```

```
  === 1000.0 Hz (bin 32.000) ===       === 1015.6 Hz (bin 32.499) ===
    boxcar     -290.22 dB               boxcar      -25.06 dB   💥
    hamming    -292.83 dB               hamming     -44.15 dB
    hann       -293.12 dB               hann        -69.65 dB   ⭐
    blackman   -294.37 dB               blackman    -77.78 dB
    flattop    -292.75 dB               flattop     -89.23 dB   🏆
```

## 💥 **CHAPDA OYNA FARQ QILMAYDI** — signal **bin markazida**. ## 🏆 **O'NGDA — 64 dB FARQ.**

</details>

**M15.** ⭐⭐ Jim signalni sizib chiqish orasidan toping.

<details>
<summary>✅ Yechim</summary>

```python
N, t = 512, np.arange(512) / sr
s = np.sin(2*np.pi*1015.6*t) + 0.003 * np.sin(2*np.pi*1515.6*t)
print(f"  nazariy: 20*log10(0.003) = {20*np.log10(0.003):.2f} dB\n")

for nom in ["boxcar", "hamming", "hann", "blackman"]:
    w = sig.get_window(nom, N)
    Sx = np.abs(np.fft.rfft(s * w))
    Sx = Sx / Sx.max()
    fr = np.fft.rfftfreq(N, 1 / sr)
    m = np.abs(fr - 1515.6) < 60
    print(f"  {nom:9s} 1515 Hz cho'qqisi {20*np.log10(Sx[m].max()):7.2f} dB")
```

```
  nazariy: 20*log10(0.003) = -50.46 dB

  boxcar    1515 Hz cho'qqisi  -31.26 dB    💥 19 dB XATO
  hamming   1515 Hz cho'qqisi  -44.80 dB    ⚠️  6 dB xato
  hann      1515 Hz cho'qqisi  -50.17 dB    ✅ 0.3 dB
  blackman  1515 Hz cho'qqisi  -50.34 dB    🏆 0.1 dB
```

## 💥 **`boxcar` DA JIM SIGNAL 19 dB BALAND KO'RINDI** — ## chunki o'rniga **sizib chiqish** o'lchandi.

</details>

**M16.** ⭐ STFT parametrlarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
for n_fft in [128, 256, 512, 1024, 2048]:
    S2 = librosa.stft(y, n_fft=n_fft, hop_length=NH)
    davr = 1 / 138.2                                # ⭐ f0 davri
    print(f"  n_fft={n_fft:5d} -> {S2.shape[0]:5d} bin · "
          f"bin {sr/n_fft:7.2f} Hz · oyna {n_fft/sr*1000:6.2f} ms · "
          f"f0 davrlari {n_fft/sr/davr:5.2f} · "
          f"garmonika {138.2/(sr/n_fft):5.2f} bin")
```

```
  n_fft=  128 ->    65 bin · bin  125.00 Hz · oyna   8.00 ms · f0 davrlari  1.11 · garmonika  1.11 bin
  n_fft=  512 ->   257 bin · bin   31.25 Hz · oyna  32.00 ms · f0 davrlari  4.42 · garmonika  4.42 bin
  n_fft= 2048 ->  1025 bin · bin    7.81 Hz · oyna 128.00 ms · f0 davrlari 17.69 · garmonika 17.69 bin
```

## 🏆 **`garmonika ... bin` USTUNI — HAL QILUVCHI:** ## garmonikalar ajralishi uchun **kamida 2 bin** kerak. ## 💥 `n_fft=128` da atigi **1.11 bin** — **chalkashadi**.

</details>

**M17.** ⭐⭐ Spektrogrammalarni chizing.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import librosa.display

mel = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=512,
                                     hop_length=NH, n_mels=80)

fig, ax = plt.subplots(3, 1, figsize=(13, 9), sharex=True)
librosa.display.specshow(librosa.amplitude_to_db(S, ref=np.max),
                         sr=sr, hop_length=NH, x_axis="time",
                         y_axis="hz", ax=ax[0])
ax[0].set_title(f"① Chiziqli spektrogramma {S.shape}")
librosa.display.specshow(librosa.power_to_db(mel, ref=np.max),
                         sr=sr, hop_length=NH, x_axis="time",
                         y_axis="mel", ax=ax[1])
ax[1].set_title(f"② Mel-spektrogramma {mel.shape} — ⭐ Whisper shuni ishlatadi")
librosa.display.specshow(M, sr=sr, hop_length=NH, x_axis="time", ax=ax[2])
ax[2].set_title(f"③ MFCC {M.shape} — ⭐ klassik ASR")
plt.tight_layout()
plt.savefig("xususiyatlar.png", dpi=110)

print(f"  siqilish: {S.shape[0]} -> {mel.shape[0]} -> {M.shape[0]}  "
      f"({S.shape[0]/M.shape[0]:.1f}×)")
```

```
  siqilish: 257 -> 80 -> 13  (19.8×)
```

</details>

---

# 🔴 QIYIN *(18–22)*

**M18.** ⭐⭐⭐ Xususiyatlar bilan ovozli/ovozsiz tasniflagichini quring.

<details>
<summary>✅ Yechim</summary>

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

X = np.vstack([XUS[k][:n] for k in XUS]).T
X = (X - X.mean(axis=0)) / (X.std(axis=0) + 1e-9)      # ⭐ SHART
yv = v.astype(int)

print("  bitta xususiyat:")
for i, k in enumerate(XUS):
    s = cross_val_score(LogisticRegression(max_iter=1000),
                        X[:, [i]], yv, cv=5).mean()
    print(f"    {k:11s} {s:.1%}")

print(f"\n  HAMMASI birga: "
      f"{cross_val_score(LogisticRegression(max_iter=1000), X, yv, cv=5).mean():.1%}")

# ⭐ faqat MFCC (13 + delta)
Xm = np.vstack([M[:, :n], librosa.feature.delta(M)[:, :n]]).T
Xm = (Xm - Xm.mean(axis=0)) / (Xm.std(axis=0) + 1e-9)
print(f"  MFCC 13 + delta 13: "
      f"{cross_val_score(LogisticRegression(max_iter=1000), Xm, yv, cv=5).mean():.1%}")
```

## 🏆 **BU MASHQ `Cohen's d` NI TASDIQLAYDI YOKI RAD ETADI.** ## ⚠️ `Cohen's d` — **bitta** xususiyat uchun. ## Birgalikda ular **kutilganidan yaxshiroq** ishlashi mumkin.

## 💡 **`sklearn` YO'QMI?** `pip install scikit-learn`.

</details>

**M19.** ⭐⭐⭐ Mel filtr bankini vizuallashtiring va HTK/Slaney farqini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

fr = np.fft.rfftfreq(512, 1 / sr)
fig, ax = plt.subplots(2, 1, figsize=(12, 7), sharex=True)

for i, htk in enumerate([True, False]):
    B = librosa.filters.mel(sr=sr, n_fft=512, n_mels=20,
                            norm=None, htk=htk)
    for r in B:
        ax[i].plot(fr, r, lw=1)
    ax[i].set_title(f"{'HTK' if htk else 'Slaney'} mel · 20 filtr")
    ax[i].set_ylabel("og'irlik")
ax[1].set_xlabel("Hz")
plt.tight_layout()
plt.savefig("mel_htk_slaney.png", dpi=110)

# ⭐ markazlarni solishtiramiz
for htk in [True, False]:
    B = librosa.filters.mel(sr=sr, n_fft=512, n_mels=20, norm=None, htk=htk)
    markaz = [fr[np.argmax(r)] for r in B]
    print(f"  {'HTK   ' if htk else 'Slaney'}: "
          f"{[int(x) for x in markaz[:8]]} ...")
```

## 💥 **IKKI SHKALANING MARKAZLARI FARQ QILADI** — ## Slaney **1000 Hz gacha chiziqli**, HTK — **butunlay logarifmik**.

## 🏆 **AMALIY XULOSA:** MFCC hisoblaganda ## `htk=` parametrini **aniq ko'rsating**.

</details>

**M20.** ⭐⭐⭐ Faza tashlanganda nima yo'qolishini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
Sc = librosa.stft(y, n_fft=512, hop_length=NH, win_length=NW)

# ① to'liq tiklash (faza bilan)
y1 = librosa.istft(Sc, hop_length=NH, win_length=NW)

# ② faqat magnituda + Griffin-Lim
y2 = librosa.griffinlim(np.abs(Sc), hop_length=NH, win_length=NW,
                        n_iter=32)

# ③ faqat magnituda + TASODIFIY faza
r = np.random.RandomState(0)
y3 = librosa.istft(np.abs(Sc) * np.exp(2j*np.pi*r.random(Sc.shape)),
                   hop_length=NH, win_length=NW)

for nom, z in [("faza bilan", y1), ("Griffin-Lim", y2),
               ("tasodifiy faza", y3)]:
    m = min(len(z), len(y))
    xato = float(np.sqrt(((z[:m] - y[:m]) ** 2).mean()))
    sf.write(f"faza_{nom.split()[0]}.wav", z / max(np.abs(z).max(), 1e-9), sr)
    print(f"  {nom:16s} RMS xato {xato:.6f}   💾")

print("\n  🎧 uchalasini TINGLANG:")
print("     faza bilan     →  ✅ aynan asl")
print("     Griffin-Lim    →  ⭐ tushunarli, biroz 'metall'")
print("     tasodifiy faza →  💥 shovqin, so'zlar YO'Q")
```

```
  faza bilan       RMS xato 0.000000
  Griffin-Lim      RMS xato 0.134362
  tasodifiy faza   RMS xato 0.102482
```

## 💥💥 **RAQAMLARGA QARANG — ULAR "NOTO'G'RI":** ## `Griffin-Lim` **0.134**, `tasodifiy faza` **0.102**. ## Ya'ni **tasodifiy faza YAXSHIROQ** chiqdi?!

## ⚠⚠ **MEN BU YERDA XATO METRIKA TANLAGAN EDIM.**

## 🔑 **`RMS xato` — FAZA UCHUN YARAMAYDI:** ## Griffin-Lim to'lqinni **qayta quradi**, ## va u **bir necha namuna surilgan** bo'lishi mumkin. ## 💡 Quloq buni **umuman sezmaydi**, RMS esa — **katta xato** deb hisoblaydi.

## 🏆 **YAGONA ISHONCHLI SINOV — TINGLASH:**
```
faza_faza.wav       →  ✅ aynan asl
faza_Griffin-Lim.wav →  ⭐ SO'ZLAR TUSHUNARLI, biroz "metall"
faza_tasodifiy.wav  →  💥 SHOVQIN, so'zlar YO'Q
```

## 🏆 **DARS: SIGNALNI TAQQOSLASHDA `RMS` — KO'PINCHA NOTO'G'RI METRIKA.** ## Idrok sifati uchun **PESQ**, **STOI** yoki **quloq** kerak.

## 🏆 **VA ASOSIY XULOSA O'ZGARMAYDI:** ## **FAZA — QAYTA TIKLASH UCHUN SHART, TANISH UCHUN — YO'Q.**

## 💡 **AYNAN SHUNING UCHUN TTS MODELLARIDA `vocoder` KERAK** *(60-modul, 5-dars)*.

</details>

**M21.** ⭐⭐⭐ Xususiyat quvurining tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def olch(f, n=3):
    q = []
    for _ in range(n):
        t0 = time.perf_counter()
        f()
        q.append(time.perf_counter() - t0)
    return min(q)


QUVURLAR = {
    "ZCR": lambda: librosa.feature.zero_crossing_rate(
        y, frame_length=NW, hop_length=NH),
    "RMS": lambda: librosa.feature.rms(y=y, frame_length=NW, hop_length=NH),
    "STFT": lambda: librosa.stft(y, n_fft=512, hop_length=NH),
    "mel-spek (80)": lambda: librosa.feature.melspectrogram(
        y=y, sr=sr, n_fft=512, hop_length=NH, n_mels=80),
    "MFCC (13)": lambda: librosa.feature.mfcc(
        y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=NH),
    "MFCC + delta": lambda: librosa.feature.delta(
        librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512,
                             hop_length=NH)),
    "pyin (f0)": lambda: librosa.pyin(y, fmin=60, fmax=400, sr=sr,
                                      hop_length=NH),
}

davom = len(y) / sr
for nom, f in QUVURLAR.items():
    dt = olch(f, n=2 if "pyin" in nom else 3)
    print(f"  {nom:16s} {dt*1000:8.1f} ms · RTF {dt/davom:8.5f} · "
          f"1 soat -> {dt/davom*3600:6.1f} s")
```

```
  ZCR                   4.6 ms · RTF  0.00019 · 1 soat ->    0.7 s
  RMS                   1.5 ms · RTF  0.00006 · 1 soat ->    0.2 s
  STFT                  4.6 ms · RTF  0.00020 · 1 soat ->    0.7 s
  mel-spek (80)         7.7 ms · RTF  0.00033 · 1 soat ->    1.2 s
  MFCC (13)            11.6 ms · RTF  0.00049 · 1 soat ->    1.8 s
  pyin (f0)           722.0 ms · RTF  0.03071 · 1 soat ->  110.6 s
```

## 💡 **`RTF` (Real Time Factor) — ENG MUHIM KO'RSATKICH.** ## `RTF < 1` → real vaqtda ishlaydi.

## 🏆 **HAMMASI `RTF < 0.001`** — ya'ni xususiyat ajratish ## **hech qachon tor joy bo'lmaydi**. ## 💡 1 soatlik audio uchun MFCC — atigi **1.8 soniya**.

## ⚠️ **`pyin` — 157× SEKIN** *(722 ms vs MFCC 11.6 ms)*. ## 🔑 U **ehtimollik modeli** *(Viterbi)* ishlatadi. ## 🏆 Real vaqtli tizimda uni **ishlatmang** — ## `yin` yoki `autocorrelation` **ancha tez**.

</details>

**M22.** ⭐⭐⭐ To'liq xususiyat ajratgichini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class XususiyatAjratgich:
    """🏆 Audio -> xususiyatlar: freym ketma-ketligi VA bitta vektor."""

    def __init__(self, sr=16000, nw=400, nh=160, n_fft=512, n_mfcc=13):
        self.sr, self.nw, self.nh = sr, nw, nh
        self.n_fft, self.n_mfcc = n_fft, n_mfcc

    def freymlar(self, y):
        """⭐ ASR uchun — vaqt SAQLANADI. Shakl (o'lcham, freym)."""
        M_ = librosa.feature.mfcc(y=y, sr=self.sr, n_mfcc=self.n_mfcc,
                                  n_fft=self.n_fft, hop_length=self.nh)
        return np.vstack([M_, librosa.feature.delta(M_),
                          librosa.feature.delta(M_, order=2)])

    def vektor(self, y):
        """⭐ TASNIFLASH uchun — bitta vektor. Vaqt YO'QOLADI."""
        S_ = np.abs(librosa.stft(y, n_fft=self.n_fft, hop_length=self.nh,
                                 win_length=self.nw))
        XUS_ = {
            "zcr": librosa.feature.zero_crossing_rate(
                y, frame_length=self.nw, hop_length=self.nh)[0],
            "rms": librosa.feature.rms(y=y, frame_length=self.nw,
                                       hop_length=self.nh)[0],
            "centroid": librosa.feature.spectral_centroid(S=S_, sr=self.sr)[0],
            "rolloff": librosa.feature.spectral_rolloff(S=S_, sr=self.sr)[0],
            "flatness": librosa.feature.spectral_flatness(S=S_)[0],
        }
        q = {}
        for nom, x in XUS_.items():
            for stat, f in [("mean", np.mean), ("std", np.std),
                            ("med", np.median),
                            ("p10", lambda a: np.percentile(a, 10)),
                            ("p90", lambda a: np.percentile(a, 90))]:
                q[f"{nom}_{stat}"] = float(f(x))
        F = self.freymlar(y)
        for i in range(F.shape[0]):
            q[f"f{i}_mean"] = float(F[i].mean())
            q[f"f{i}_std"] = float(F[i].std())
        return q

    def mel(self, y, n_mels=80):
        """🏆 Whisper uslubi — mel-spektrogramma."""
        m = librosa.feature.melspectrogram(
            y=y, sr=self.sr, n_fft=self.n_fft, hop_length=self.nh,
            n_mels=n_mels)
        return librosa.power_to_db(m, ref=np.max)


a = XususiyatAjratgich()
print(f"  freymlar : {a.freymlar(y).shape}   (ASR uchun)")
print(f"  vektor   : {len(a.vektor(y))} o'lcham   (tasniflash uchun)")
print(f"  mel      : {a.mel(y).shape}   (Whisper uslubi)")
```

```
  freymlar : (39, 2352)   (ASR uchun)
  vektor   : 103 o'lcham   (tasniflash uchun)
  mel      : (80, 2352)   (Whisper uslubi)
```

## 🏆 **UCH XIL CHIQISH — UCH XIL MASALA UCHUN:**
```
freymlar  →  ASR, ketma-ketlik modellari       ⭐ vaqt SAQLANADI
vektor    →  janr, emotsiya, gapiruvchi ID     💥 vaqt YO'QOLADI
mel       →  neyron tarmoq (CNN, Transformer)  🏆 zamonaviy standart
```

</details>

---

## 📌 Modulda o'lchangan hamma narsa

| O'lchov | Natija |
|---|---|
| ZCR ovozli / ovozsiz | 0.0947 / **0.2355** — ## **2.49×** |
| ZCR eng yaxshi chegara | ## **0.10** → aniqlik **80.0%** |
| Spektral centroid | o'rt **1790.7 Hz** *(0–6223)* |
| Spektral rolloff *(85%)* | ## **3260.4 Hz** — telefon 3400 da kesadi |
| Flatness ovozli / ovozsiz | 0.0226 / **0.0971** — ## **4.3×** |
| ## **Cohen's d — eng kuchli** | ## 🏆 **RMS 1.705** |
| Cohen's d — eng zaif | ## 💥 **bandwidth 0.079** |
| MFCC dispersiyasi | `c0` **57.56%** · 13 ta **89.40%** · 40 ta 100% |
| MFCC noldan — korrelyatsiya | **0.62–0.95** *(shkala boshqa)* |
| Freym 25/10 ms | **2349 freym** · 60% ustma-ust · **99.9 freym/s** |
| Freymlash xotirasi | 7.2 MB *(asl 1.4 MB)* — ## 💥 **5.1×** |
| `sliding_window_view` | ## 🏆 **nusxasiz** · **15× tez** |
| ZCR o'rtacha / median | 0.1522 / 0.1050 — ## **45% farq** |
| FFT vs DFT | N=64 **2.4×** · N=1024 ## **323.8×** |
| Oyna — bin markazida | hammasi ## **−290 dB** *(farq yo'q)* |
| Oyna — bin 32.499 | boxcar **−25** · hann **−70** · flattop ## **−89 dB** |
| `pyin` sekinligi | ## 💥 **157×** MFCC dan *(722 vs 11.6 ms)* |
| Xususiyat ajratish RTF | ## ✅ hammasi **< 0.001** |
| Jim signal *(nazariy −50.46)* | boxcar **−31.26** 💥 · blackman ## ✅ **−50.34** |
| STFT `n_fft=512` | **(257, 2352)** · `complex64` · bin **31.25 Hz** |
| Siqilish | **257 → 80 → 13** *(19.8×)* |

---

🏠 [Modul boshiga](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
