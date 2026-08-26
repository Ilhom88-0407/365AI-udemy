# 4-dars. Furye almashtirishi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Furye akkordni alohida notalarga ajratadi. Va bu — sehr emas, matritsa ko'paytmasi."**

---

## 1. Nima uchun vaqt domeni yetarli emas?

> ## 🔑 **KURS TO'G'RI AYTADI:** *"Vaqt domeni faqat balandlik qanday o'zgarishini ko'rsatadi. Qaysi chastotalar borligini — yo'q."*
>
> ## ⭐ **MISOL:**
> ```
> 440 Hz sinus  +  880 Hz sinus
>    vaqt domenida  →  bitta murakkab to'lqin  💥 ajratib bo'lmaydi
>    chastota domenida →  ⭐ IKKI aniq cho'qqi: 440 va 880
> ```
>
> ## 💡 **VA 53-MODULDA O'LCHAGAN EDIK:** ## bitta 25 ms lik nutq bo'lagida — **98–151 ta** sezilarli chastota. ## Ularni **faqat** Furye ko'rsatadi.

---

## 2. ⭐⭐ DFT — bu matritsa ko'paytmasi

```python
import numpy as np


def dft_sekin(x):
    """⭐ DFT ning TO'LIQ ta'rifi — matritsa ko'paytmasi."""
    n = len(x)
    k = np.arange(n)
    M = np.exp(-2j * np.pi * k[:, None] * k[None, :] / n)
    return M @ x
```

> ## 🔑 **BUTUN "SEHR" — SHU IKKI QATORDA.**
> ```
> M[k, t] = e^(-2πi·k·t/n)
>
> ⭐ har qator — bitta CHASTOTA uchun "shablon"
> ⭐ ko'paytma — signal shu chastotaga qanchalik "o'xshaydi"
> ```
>
> ## 💡 **BU — 49-MODULDAGI SKALYAR KO'PAYTMANING O'ZI.** ## Furye — signalning **har chastota bilan** skalyar ko'paytmasi.

### 🔬 FFT bilan solishtiramiz

```python
import time, librosa

y, sr = librosa.load("speech_01.wav", sr=16000)

for N in [64, 256, 512, 1024]:
    x = y[:N]
    t0 = time.perf_counter(); a = dft_sekin(x)
    t_dft = time.perf_counter() - t0
    t0 = time.perf_counter(); b = np.fft.fft(x)
    t_fft = time.perf_counter() - t0
    print(f"  N={N:5d}  DFT {t_dft*1000:8.3f} ms · FFT {t_fft*1000:7.4f} ms"
          f"  ->  {t_dft/max(t_fft,1e-12):8.1f}× · "
          f"maks farq {np.abs(a-b).max():.2e}")
```

```
  N=   64  DFT    1.361 ms · FFT  0.5693 ms  ->       2.4× · maks farq 7.75e-09
  N=  256  DFT    2.958 ms · FFT  0.0673 ms  ->      44.0× · maks farq 2.85e-08
  N=  512  DFT    7.405 ms · FFT  0.0573 ms  ->     129.2× · maks farq 5.97e-08
  N= 1024  DFT   27.262 ms · FFT  0.0842 ms  ->     323.8× · maks farq 1.31e-07
```

> ## ✅ **NATIJALAR AYNAN BIR XIL** *(farq `1e-8` — bu **float** aniqligining chegarasi)*.
>
> ## 🏆 **LEKIN FFT `N=1024` DA 324× TEZ.**
> ```
> DFT  →  O(N²)      1024² = 1 048 576 amal
> FFT  →  O(N·logN)  1024 × 10 = 10 240 amal    ⭐ 102× kam
> ```
>
> ## ⚠️ **`N=64` DA FFT ATIGI 2.4× TEZ** — ## kichik massivda **funksiya chaqiruvi** o'zi vaqt oladi.
>
> ## 💥 **AMALIY MIQYOS:**
> ```
> 1 soat audio · 10 ms qadam  →  360 000 freym
>
> FFT bilan  →  360 000 × 0.057 ms  ≈  20 soniya
> DFT bilan  →  360 000 × 7.4 ms    ≈  44 daqiqa    💥 133× sekin
> ```

---

## 3. ⭐⭐⭐ Oyna funksiyalari — spektral sizib chiqish

> ## 🔑 **KURSDA BU MAVZU UMUMAN YO'Q — LEKIN U HAL QILUVCHI.**

```python
import scipy.signal as sig

N = 512
print(f"  bin kengligi {sr/N:.2f} Hz\n")

for f in [1000.0, 1015.6]:
    print(f"  === {f} Hz  (bin {f/(sr/N):.3f}) ===")
    t = np.arange(N) / sr
    s = np.sin(2 * np.pi * f * t)
    for nom in ["boxcar", "hann", "hamming", "blackman", "flattop"]:
        w = sig.get_window(nom, N)
        S = np.abs(np.fft.rfft(s * w))
        S = S / S.max()
        fr = np.fft.rfftfreq(N, 1 / sr)
        uzoq = np.abs(fr - f) > 300
        print(f"    {nom:9s} yon lepestok "
              f"{20*np.log10(max(S[uzoq].max(), 1e-15)):8.2f} dB · "
              f"cho'qqi kengligi {int((S > 0.5).sum())} bin")
```

```
  bin kengligi 31.25 Hz

  === 1000.0 Hz  (bin 32.000) ===
    boxcar     yon lepestok  -290.22 dB · cho'qqi kengligi 1 bin
    hann       yon lepestok  -293.12 dB · cho'qqi kengligi 2 bin
    hamming    yon lepestok  -292.83 dB · cho'qqi kengligi 1 bin
    blackman   yon lepestok  -294.37 dB · cho'qqi kengligi 3 bin
    flattop    yon lepestok  -292.75 dB · cho'qqi kengligi 5 bin

  === 1015.6 Hz  (bin 32.499) ===
    boxcar     yon lepestok   -25.06 dB · cho'qqi kengligi 2 bin
    hann       yon lepestok   -69.65 dB · cho'qqi kengligi 2 bin
    hamming    yon lepestok   -44.15 dB · cho'qqi kengligi 2 bin
    blackman   yon lepestok   -77.78 dB · cho'qqi kengligi 2 bin
    flattop    yon lepestok   -89.23 dB · cho'qqi kengligi 4 bin
```

> ## 💥💥 **BIRINCHI JADVAL — HAMMA OYNA BIR XIL: −290 dB.** ## ⚠️ Ya'ni **sizib chiqish YO'Q**. Nima uchun?
>
> ## 🔑 **1000 Hz — AYNAN BIN MARKAZIDA** *(bin 32.000)*. ## `16000 / 512 = 31.25`, `1000 / 31.25 = 32` — **butun son**. ## 💡 Signal oynaga **butun sonli davr** bilan sig'adi, ## demak chetlarda **uzilish yo'q**.
>
> ## 🏆🏆 **IKKINCHI JADVAL — HAQIQIY HOLAT** *(bin 32.499)*:
> ```
> boxcar    -25.06 dB    💥 juda ko'p sizib chiqish
> hamming   -44.15 dB    ⭐ 19 dB yaxshiroq
> hann      -69.65 dB    ⭐ 45 dB yaxshiroq
> blackman  -77.78 dB    🏆 53 dB yaxshiroq
> flattop   -89.23 dB    🏆 64 dB — lekin cho'qqi 4 bin keng
> ```
>
> ## 🔑 **VA HAQIQIY SIGNALLAR HECH QACHON BIN MARKAZIDA BO'LMAYDI.** ## Nutq chastotalari **uzluksiz** o'zgaradi. ## 🏆 **Shuning uchun oyna — MAJBURIY.**
>
> ## ⭐ **QAYSI OYNANI TANLASH?**
> ```
> hann / hamming  →  ⭐ NUTQ uchun standart (yaxshi muvozanat)
> blackman        →  kam sizib chiqish, lekin keng cho'qqi
> flattop         →  🏆 AMPLITUDANI aniq o'lchash uchun
> boxcar (oynasiz)→  💥 HECH QACHON
> ```
>
> ## 💡 **VA `librosa` SUKUT BO'YICHA `hann` ISHLATADI** — ## `librosa.stft(y)` da `window="hann"`.

---

## 4. ⭐⭐ STFT — vaqt + chastota

```
DFT   →  butun signalning BITTA spektri     💥 vaqt yo'qoladi
STFT  →  har freymning spektri              ⭐ vaqt SAQLANADI
```

```python
S = librosa.stft(y, n_fft=512, hop_length=160, win_length=400)
print(f"  STFT shakl: {S.shape}  (bin × freym)")
print(f"  tur: {S.dtype}   ⭐ KOMPLEKS")
print(f"  bin kengligi: {sr/512:.2f} Hz")
print(f"  vaqt qadami : {160/sr*1000:.2f} ms")

magnituda = np.abs(S)
faza = np.angle(S)
print(f"  magnituda: {magnituda.shape} · faza: {faza.shape}")
```

```
  STFT shakl: (257, 2352)  (bin × freym)
  tur: complex64   ⭐ KOMPLEKS
  bin kengligi: 31.25 Hz
  vaqt qadami : 10.00 ms
```

> ## ⚠️ **`n_fft=512` → `257` BIN, `512` EMAS.** ## 🔑 Haqiqiy signalning spektri **simmetrik** — ## `rfft` faqat **yarmini** qaytaradi *(512/2 + 1 = 257)*.
>
> ## 🏆 **VA `complex64` — MUHIM:** ## STFT ikki narsani beradi:
> ```
> magnituda = |S|      →  ⭐ qaysi chastota QANCHA kuchli
> faza      = ∠S       →  ⭐ chastotaning JOYI
> ```
>
> ## 💥 **XUSUSIYAT AJRATISHDA FAZA TASHLANADI** *(`np.abs(S)`)*. ## 💡 Sababi: quloq fazani **deyarli sezmaydi**.
>
> ## ⚠️ **LEKIN AUDIONI QAYTA TIKLASHDA FAZA SHART:**
> ```python
> # ✅ to'liq tiklash
> y2 = librosa.istft(S, hop_length=160, win_length=400)
>
> # 💥 faqat magnituda bilan — Griffin-Lim algoritmi kerak
> y3 = librosa.griffinlim(np.abs(S), hop_length=160, win_length=400)
> ```

### ⚖️ Vaqt ↔ chastota muvozanati

```python
for n_fft in [128, 256, 512, 1024, 2048]:
    S2 = librosa.stft(y, n_fft=n_fft, hop_length=160)
    print(f"  n_fft={n_fft:5d}  ->  {S2.shape[0]:5d} bin · "
          f"bin kengligi {sr/n_fft:7.2f} Hz · "
          f"oyna {n_fft/sr*1000:6.2f} ms")
```

```
  n_fft=  128  ->     65 bin · bin kengligi  125.00 Hz · oyna   8.00 ms
  n_fft=  256  ->    129 bin · bin kengligi   62.50 Hz · oyna  16.00 ms
  n_fft=  512  ->    257 bin · bin kengligi   31.25 Hz · oyna  32.00 ms
  n_fft= 1024  ->    513 bin · bin kengligi   15.62 Hz · oyna  64.00 ms
  n_fft= 2048  ->   1025 bin · bin kengligi    7.81 Hz · oyna 128.00 ms
```

> ## 💥💥 **BU — GEYZENBERG NOANIQLIK PRINSIPINING SIGNAL VARIANTI:**
> ```
> Chastota aniqligini oshirish  →  vaqt aniqligi PASAYADI
> Vaqt aniqligini oshirish      →  chastota aniqligi PASAYADI
> ```
>
> ## ⭐ **NUTQ UCHUN TANLOV:**
> ```
> f0 = 138 Hz  →  garmonikalar har 138 Hz da
> n_fft=512    →  bin 31.25 Hz  →  ⭐ garmonikalar AJRALADI (4.4 bin)
> n_fft=128    →  bin 125 Hz    →  💥 garmonikalar CHALKASHADI
> ```
> ## 🏆 **VA `n_fft=512` OYNASI 32 ms** — ## fonema *(50–100 ms)* **ichida** qoladi. ## `n_fft=2048` → **128 ms** — ## 💥 bu **bir necha fonemani** aralashtiradi.
>
> ## 💡 **AYNAN SHUNING UCHUN `n_fft=512` @16 kHz — NUTQ UCHUN STANDART.**

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** DFT nima qiladi — bir jumlada?

**M2.** FFT DFT dan necha marta tez?

**M3.** Nima uchun oyna funksiyasi kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Signalni **har chastota bilan** skalyar ko'paytiradi — ## ya'ni *"bu signal shu chastotaga qanchalik o'xshaydi?"*

**M2.** ## `N=1024` da **324×** *(o'lchandi)*. ## `O(N²)` → `O(N·logN)`.

**M3.** ## Signal bin markazida bo'lmasa — **sizib chiqish**. ## O'lchandi: `boxcar` **−25 dB**, `hann` **−70 dB** — **45 dB farq**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ DFT ni noldan yozing va FFT bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 2-bo'limdagi kodni ishga tushiring, so'ng **Furye matritsasini ko'ring**:

```python
N = 8
k = np.arange(N)
M = np.exp(-2j * np.pi * k[:, None] * k[None, :] / N)

print("  Furye matritsasi (N=8), haqiqiy qism:")
print(np.round(M.real, 2))
print("\n  ⭐ har QATOR — bitta chastota uchun shablon")
print("  ⭐ 0-qator: hamma 1  ->  DC (o'rtacha)")
print(f"  ⭐ 1-qator: {np.round(M[1].real, 2)}  ->  1 davr")
print(f"  ⭐ 4-qator: {np.round(M[4].real, 2)}  ->  Nayqvist")

# ⭐ matritsa UNITAR — teskarisi = konjugat transponirlash
print(f"\n  M @ M.conj().T / N = birlik matritsami? "
      f"{np.allclose(M @ M.conj().T / N, np.eye(N))}")
```

```
  [[ 1.    1.    1.    1.    1.    1.    1.    1.  ]     <- 0-qator: DC
   [ 1.    0.71  0.   -0.71 -1.   -0.71 -0.    0.71]     <- 1 davr
   [ 1.    0.   -1.   -0.    1.    0.   -1.   -0.  ]     <- 2 davr
   [ 1.   -0.71 -0.    0.71 -1.    0.71  0.   -0.71]
   [ 1.   -1.    1.   -1.    1.   -1.    1.   -1.  ]     <- Nayqvist
   [ 1.   -0.71  0.    0.71 -1.    0.71 -0.   -0.71]
   [ 1.   -0.   -1.    0.    1.   -0.   -1.   -0.  ]
   [ 1.    0.71 -0.   -0.71 -1.   -0.71 -0.    0.71]]

  M @ M.conj().T / N = birlik matritsami? True
```

## ⭐ **4-QATOR `[1, -1, 1, -1, ...]` — ENG YUQORI CHASTOTA.** ## Bu — **Nayqvist**: har namunada **belgi almashadi**.

## 🏆 **`M` UNITAR** — ya'ni Furye **ma'lumot yo'qotmaydi**. ## Teskari almashtirish uni **to'liq** tiklaydi.

</details>

**M5.** ⭐⭐ Oyna funksiyalarini solishtiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 3-bo'limdagi kodni ishlating va **ikki chastotali** signalda sinang:

```python
N = 512
t = np.arange(N) / sr
# ⭐ kuchli 1000 Hz + JUDA JIM 1500 Hz
s = np.sin(2*np.pi*1015.6*t) + 0.003 * np.sin(2*np.pi*1515.6*t)

for nom in ["boxcar", "hamming", "hann", "blackman"]:
    w = sig.get_window(nom, N)
    S = np.abs(np.fft.rfft(s * w))
    S = S / S.max()
    fr = np.fft.rfftfreq(N, 1 / sr)
    # ⭐ 1500 Hz atrofidagi cho'qqi ko'rinadimi?
    m = np.abs(fr - 1515.6) < 60
    print(f"  {nom:9s} 1515 Hz cho'qqisi "
          f"{20*np.log10(S[m].max()):7.2f} dB "
          f"(nazariy {20*np.log10(0.003):.2f} dB)")
```

```
  nazariy: 20*log10(0.003) = -50.46 dB

  boxcar    1515 Hz cho'qqisi  -31.26 dB    💥 19 dB XATO
  hamming   1515 Hz cho'qqisi  -44.80 dB    ⚠️  6 dB xato
  hann      1515 Hz cho'qqisi  -50.17 dB    ✅ 0.3 dB
  blackman  1515 Hz cho'qqisi  -50.34 dB    🏆 0.1 dB
```

## 💥💥 **`boxcar` DA JIM SIGNAL 19 dB BALAND KO'RINDI** — ## chunki uning o'rniga **kuchli signalning sizib chiqishi** o'lchandi.

## ✅ **`hann` VA `blackman` — NAZARIY QIYMATNI DEYARLI AYNAN BERDI.**

## 💡 **BU — NUTQDA HAM SODIR BO'LADI:** ## kuchli `f0` garmonikalari **jim formantlarni** bosib ketadi, ## va siz **mavjud bo'lmagan** energiyani o'lchaysiz.

## 💡 **BU — NUTQDA HAM SODIR BO'LADI:** ## kuchli `f0` garmonikalari **jim formantlarni** bosib ketadi.

</details>

**M6.** ⭐⭐ STFT parametrlarini solishtiring va spektrogrammani chizing.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import librosa.display

fig, ax = plt.subplots(3, 1, figsize=(13, 9), sharex=True)
for i, n_fft in enumerate([128, 512, 2048]):
    S2 = np.abs(librosa.stft(y, n_fft=n_fft, hop_length=160))
    librosa.display.specshow(librosa.amplitude_to_db(S2, ref=np.max),
                             sr=sr, hop_length=160, x_axis="time",
                             y_axis="hz", ax=ax[i])
    ax[i].set_ylim(0, 4000)
    ax[i].set_title(f"n_fft={n_fft} · bin {sr/n_fft:.1f} Hz · "
                    f"oyna {n_fft/sr*1000:.0f} ms")
plt.tight_layout()
plt.savefig("stft_taqqoslash.png", dpi=110)
print("💾 stft_taqqoslash.png")
```

## 🏆 **UCHTA RASMNI SOLISHTIRING:**
```
n_fft=128   →  💥 gorizontal chiziqlar (garmonikalar) YO'Q
                ⭐ lekin vertikal o'tishlar ANIQ
n_fft=512   →  ⭐ MUVOZANAT — garmonikalar ham, o'tishlar ham ko'rinadi
n_fft=2048  →  ⭐ garmonikalar juda aniq
                💥 lekin o'tishlar "yoyilgan"
```

## 💡 **BU — GEYZENBERG PRINSIPINING RASMDAGI KO'RINISHI.**

</details>

---

## 📌 Xulosa

```
DFT   →  M[k,t] = e^(-2πi·k·t/n)  ·  M @ x     💥 O(N²)
FFT   →  aynan o'sha natija                     ⭐ O(N·logN)
STFT  →  har freymning DFT si                   🏆 vaqt + chastota
```

```
🔬 O'LCHANGAN:
   FFT vs DFT:  N=64 → 2.4×  ·  N=512 → 129×  ·  N=1024 → 324×
   natijalar farqi 1e-8 (float aniqligi)

   OYNA — 1000 Hz (bin markazida):
     hamma oyna -290 dB   ⚠️ sizib chiqish YO'Q

   OYNA — 1015.6 Hz (bin 32.499):
     boxcar   -25.06 dB   💥
     hamming  -44.15 dB
     hann     -69.65 dB   ⭐ librosa sukut
     blackman -77.78 dB
     flattop  -89.23 dB   🏆

   STFT (n_fft=512): shakl (257, 2352) · complex64 · bin 31.25 Hz
   n_fft:  128 → bin 125 Hz, oyna 8 ms   ·  2048 → bin 7.81 Hz, oyna 128 ms
```

> ## 🏆🏆 **`n_fft=512` @16 kHz — NUTQ UCHUN STANDART:** ## bin **31.25 Hz** *(garmonikalar ajraladi)* + ## oyna **32 ms** *(fonema ichida qoladi)*.
>
> ## 💥 **VA HAQIQIY SIGNALLAR HECH QACHON BIN MARKAZIDA BO'LMAYDI** — ## shuning uchun **oyna funksiyasi majburiy**.

---

⬅️ [3-dars. Freymlash](03-Framing-and-Computation.md) · 🏠 [Modul boshiga](README.md) · ➡️ [⚡ Mashqlar](MASHQLAR.md)
