# 📝 54-modul mashqlari

> **18 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin

## ⚙️ Tayyorgarlik

```bash
pip install numpy scipy matplotlib soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import time
import numpy as np, scipy.signal as sig
import librosa, soundfile as sf

WAV = "speech_01.wav"
y, sr = librosa.load(WAV, sr=16000)
y44, sr44 = librosa.load(WAV, sr=None)          # ⭐ asl 44 100 Hz
```

---

# 🟢 OSON *(1–6)*

**M1.** Nayqvist chastotasi nima va nima uchun muhim?

**M2.** Nima uchun Whisper 16 kHz ishlatadi?

**M3.** `bitrate` formulasi qanday?

**M4.** Nima uchun `y[::2]` xato?

**M5.** `z-normallash` to'lqin shakli uchun nima uchun yaramaydi?

**M6.** Darslikning `6.02·b + 1.76` formulasi nima uchun xato ko'rsatadi?

<details>
<summary>✅ Javoblar (1–6)</summary>

**M1.** ## `sample_rate / 2`. ## Undan yuqori chastotalar **aliasing** hosil qiladi — ## ya'ni **past chastota bo'lib** paydo bo'ladi.

**M2.** ## Nutqning ma'noli chastotalari **8 kHz gacha**; ## 16 kHz → Nayqvist 8 kHz — ⭐ **aynan yetadi**.

**M3.** ## `sr × bit × kanal`. ## O'lchandi: `44100 × 24 × 1` = **1 058 400 bit/s**.

**M4.** ## `44100/16000 = 2.75625` — butun son emas. ## 💥 Uzunlik **518 436** *(kerakli 376 190)* + **aliasing**.

**M5.** ## RMS ni **1.0** ga *(0 dBFS)* keltiradi → ## 💥 o'lchandi **97 958 ta clipping** *(26%)*.

**M6.** ## U **to'liq shkalali sinus** uchun. ## Nutqning **krest-faktori 19.11 dB** — ## SNR shuncha dB ga **pastroq**.

</details>

---

# 🟡 O'RTA *(7–14)*

**M7.** ⭐ Aliasing jadvalini quring.

<details>
<summary>✅ Yechim</summary>

```python
def alias(f, sr_):
    """⭐ f chastotasi sr_ da qanday 'eshitiladi'?"""
    return abs(((f + sr_ / 2) % sr_) - sr_ / 2)


for sr_ in [8000, 16000]:
    print(f"\n  sample rate {sr_} Hz (Nayqvist {sr_//2}):")
    for f in [500, 3000, 3900, 5000, 7000, 7500, 9000, 15000]:
        a = alias(f, sr_)
        belgi = "✅" if f < sr_ / 2 else "💥"
        print(f"    {belgi} {f:6d} Hz  ->  {a:6.0f} Hz")
```

```
  sample rate 8000 Hz (Nayqvist 4000):
    ✅    500 Hz  ->     500 Hz
    ✅   3900 Hz  ->    3900 Hz
    💥   5000 Hz  ->    3000 Hz
    💥   7500 Hz  ->     500 Hz
```

## 💥 **7500 Hz — 500 Hz BO'LIB "ESHITILADI".**

</details>

**M8.** ⭐⭐ Aliasingni eshitiladigan qiling.

<details>
<summary>✅ Yechim</summary>

```python
SR = 44100
t = np.arange(SR * 2) / SR
sweep = sig.chirp(t, f0=100, f1=8000, t1=2, method="linear") * 0.5

togri = librosa.resample(sweep, orig_sr=SR, target_sr=8000)
xato = sweep[::int(SR / 8000)]              # 💥 filtrsiz

sf.write("sweep_asl.wav", sweep, SR)
sf.write("sweep_togri.wav", togri, 8000)
sf.write("sweep_xato.wav", xato, 8000)

for nom, s in [("to'g'ri", togri), ("💥 xato", xato)]:
    S = np.abs(np.fft.rfft(s))
    fr = np.fft.rfftfreq(len(s), 1 / 8000)
    print(f"  {nom:10s} uzunlik {len(s):6d} · davomiylik {len(s)/8000:5.2f} s "
          f"· 3 kHz+ {(S[fr>3000]**2).sum()/(S**2).sum():6.2%}")

print("\n  🎧 sweep_xato.wav: ohang ko'tariladi, keyin 💥 QAYTIB TUSHADI")
```

```
  to'g'ri    uzunlik  16000 · davomiylik  2.00 s · 3 kHz+ 21.64%
  💥 xato    uzunlik  17640 · davomiylik  2.21 s · 3 kHz+ 27.75%
```

## 💥 **DAVOMIYLIK HAM NOTO'G'RI** — 2.00 o'rniga **2.21 s**.

## 🏆 **ASOSIY ISBOT — QULOQDA:** ohang **yuqoriga chiqib, pastga tushadi**.

</details>

**M9.** ⭐⭐ Bit chuqurligi va SNR ni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
x, _ = sf.read(WAV)
x = x / np.abs(x).max()
krest = 20 * np.log10(1.0 / float(np.sqrt((x ** 2).mean())))
print(f"  krest-faktor: {krest:.2f} dB\n")

print("  bit   o'lchangan   darslik   krest bilan tuzatilgan   farq")
for b in [2, 4, 8, 12, 16, 24]:
    L = 2 ** b
    q = np.round(x * (L/2 - 1)) / (L/2 - 1)
    snr = 10 * np.log10((x**2).mean() / max(((x-q)**2).mean(), 1e-30))
    tuz = 6.02 * b + 1.76 - krest + 3
    print(f"  {b:3d}   {snr:9.2f}  {6.02*b+1.76:8.2f}   {tuz:14.2f}   "
          f"{abs(snr-tuz):6.2f}")
```

```
  krest-faktor: 19.11 dB

  bit   o'lchangan   darslik   krest bilan tuzatilgan   farq
    2        0.03     13.80            -2.31             2.34
    4        9.11     25.84             9.73             0.62
    8       33.87     49.92            33.81             0.06
   12       58.00     74.00            57.89             0.11
   16       82.06     98.08            81.97             0.09
   24      130.22    146.24           130.13             0.09
```

## ✅ **8 BIT DAN YUQORIDA FARQ < 0.11 dB** — formula **ishlaydi**.

## 💥 **2 VA 4 BIT DA BUZILADI** — ## juda past chuqurlikda kvantlash xatosi ## **tasodifiy shovqin bo'lmay qoladi**.

</details>

**M10.** ⭐ Saqlash hajmini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
FORMATLAR = {
    "WAV 44.1k/24bit mono": 44100 * 24,
    "WAV 44.1k/16bit mono": 44100 * 16,
    "WAV 16k/16bit mono":   16000 * 16,
    "WAV 8k/16bit mono":     8000 * 16,
    "MP3 128k":             128000,
    "Opus 32k":              32000,
    "Opus 16k":              16000,
}

soat = 24333                            # yillik call-markaz
asos = None
print(f"  {soat:,} soat uchun:\n")
for nom, bps in FORMATLAR.items():
    gb = bps * soat * 3600 / 8 / 1024 ** 3
    asos = gb if asos is None else asos
    print(f"  {nom:24s} {gb:9.1f} GB   ({asos/gb:5.1f}× tejam)")
```

```
  WAV 44.1k/24bit mono      10793.4 GB   (  1.0× tejam)
  WAV 44.1k/16bit mono       7195.6 GB   (  1.5× tejam)
  WAV 16k/16bit mono         2610.6 GB   (  4.1× tejam)
  WAV 8k/16bit mono          1305.3 GB   (  8.3× tejam)
  MP3 128k                   1305.3 GB   (  8.3× tejam)
  Opus 32k                    326.3 GB   ( 33.1× tejam)
  Opus 16k                    163.2 GB   ( 66.2× tejam)
```

## 🏆 **10.8 TB → 163 GB.** ## Va nutq uchun **Opus 16k** ham **yetarli**.

## 💡 **`MP3 128k` VA `WAV 8k/16bit` — AYNAN BIR XIL HAJM** *(1305.3 GB)*. ## ⚠️ Lekin MP3 **to'liq 16 kHz polosani** saqlaydi, ## WAV 8k esa — **4 kHz dan yuqorisini yo'qotadi**. ## 🏆 **BIR XIL NARXGA — IKKI BARAVAR POLOSA.**

</details>

**M11.** ⭐⭐ Normallashtirish usullarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def norm_cho(x, maks=0.99):
    return x / max(np.abs(x).max(), 1e-12) * maks


def norm_rms(x, hedef=-20.0):
    r = float(np.sqrt((x ** 2).mean()))
    z = x * (10 ** (hedef / 20) / max(r, 1e-12))
    return z / np.abs(z).max() * 0.99 if np.abs(z).max() > 0.99 else z


def norm_z(x):
    return (x - x.mean()) / max(x.std(), 1e-12)


for nom, f in [("asl", lambda a: a), ("cho'qqi", norm_cho),
               ("RMS -20", norm_rms), ("z-norm", norm_z)]:
    z = f(y)
    r = float(np.sqrt((z ** 2).mean()))
    print(f"  {nom:10s} RMS {20*np.log10(max(r,1e-12)):+7.2f} dBFS · "
          f"cho'qqi {np.abs(z).max():7.3f} · "
          f"clipping {int((np.abs(z)>0.99).sum()):6d}")
```

```
  asl        RMS  -20.87 dBFS · cho'qqi   0.594 · clipping      0
  cho'qqi    RMS  -16.44 dBFS · cho'qqi   0.990 · clipping      0
  RMS -20    RMS  -20.00 dBFS · cho'qqi   0.657 · clipping      0
  z-norm     RMS   +0.00 dBFS · cho'qqi   6.570 · clipping  97958
```

</details>

**M12.** ⭐⭐ Qayta namunalash usullarini o'lchang.

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


USULLAR = {
    "librosa soxr_hq": lambda: librosa.resample(
        y44, orig_sr=sr44, target_sr=16000),
    "librosa soxr_mq": lambda: librosa.resample(
        y44, orig_sr=sr44, target_sr=16000, res_type="soxr_mq"),
    "scipy resample_poly": lambda: sig.resample_poly(y44, 160, 441),
    "💥 y[::k]": lambda: y44[::int(sr44 / 16000)],
}

etalon = None
for nom, f in USULLAR.items():
    dt = olch(f)
    z = f()
    etalon = z if etalon is None else etalon
    n = min(len(z), len(etalon))
    print(f"  {nom:22s} {dt*1000:7.1f} ms · uzunlik {len(z):6d} · "
          f"farq {float(np.sqrt(((z[:n]-etalon[:n])**2).mean())):.6f}")
```

```
  librosa soxr_hq          4.2 ms · uzunlik 376190 · farq 0.000000
  librosa soxr_mq          4.1 ms · uzunlik 376190 · farq 0.000337
  scipy resample_poly      8.0 ms · uzunlik 376190 · farq 0.007574
  💥 y[::k]                 0.0 ms · uzunlik 518436 · farq 0.131524
```

## ⚠️ **`librosa` `scipy` DAN 2× TEZ — KUTILGANNING TESKARISI.**

## 💥 **VA `res_type="kaiser_fast"` — `resampy` PAKETI KERAK** *(librosa 1.0 da yo'q)*.

</details>

**M13.** ⭐⭐ Augmentatsiyani o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
r = np.random.RandomState(0)
ASL = y                                  # ⭐ HAR VARIANT ASLDAN

V = {
    "asl": ASL,
    "shovqin (SNR 20 dB)": ASL + r.normal(
        0, np.sqrt((ASL ** 2).mean()) / 10, len(ASL)),
    "tezlik 1.1×": librosa.effects.time_stretch(ASL, rate=1.1),
    "pitch +2": librosa.effects.pitch_shift(ASL, sr=sr, n_steps=2),
    "siljish 0.3 s": np.roll(ASL, int(sr * 0.3)),
    "hajm -10 dB": ASL * 10 ** (-10 / 20),
}

for nom, z in V.items():
    f0, _, _ = librosa.pyin(z, fmin=60, fmax=400, sr=sr)
    ok = f0[~np.isnan(f0)]
    print(f"  {nom:22s} {len(z)/sr:6.2f} s · "
          f"RMS {20*np.log10(np.sqrt((z**2).mean())):+6.2f} dBFS · "
          f"f0 {np.median(ok) if len(ok) else 0:6.1f} Hz")

print(f"\n  nazariy pitch: 138.2 × 2^(2/12) = {138.2*2**(2/12):.1f} Hz")
```

```
  asl                     23.51 s · RMS -20.87 dBFS · f0  138.2 Hz
  tezlik 1.1×             21.37 s · RMS -24.41 dBFS · f0  141.1 Hz
  pitch +2                23.51 s · RMS -24.39 dBFS · f0  152.9 Hz
  siljish 0.3 s           23.51 s · RMS -20.87 dBFS · f0  140.3 Hz

  nazariy pitch: 138.2 × 2^(2/12) = 155.1 Hz
```

## 💥 **`tezlik` VA `pitch` RMS NI 3.5 dB TUSHIRDI** — ## fazali vokoder energiya **yo'qotadi**. ## 🏆 **Augmentatsiyadan KEYIN qayta normallashtiring.**

## ⚠️ **`siljish` ham `f0` ni 140.3 ko'rsatdi** — ## signal **o'zgarmagan**! ## Bu — `pyin` ning **±2 Hz noaniqligi**.

</details>

**M14.** ⭐⭐ Segmentatsiyani sinang.

<details>
<summary>✅ Yechim</summary>

```python
for db in [15, 20, 25, 30, 40, 60]:
    o = librosa.effects.split(y, top_db=db)
    jami = sum(e - b for b, e in o) / sr
    uz = [(e - b) / sr for b, e in o]
    print(f"  top_db={db:3d}  {len(o):3d} bo'lak · "
          f"nutq {jami:6.2f} s ({jami/(len(y)/sr):5.1%}) · "
          f"eng qisqa {min(uz):.2f} s")
```

```
  top_db= 15    5 bo'lak · nutq  21.98 s (93.5%) · eng qisqa 0.16 s
  top_db= 20    2 bo'lak · nutq  22.85 s (97.2%) · eng qisqa 0.19 s
  top_db= 25    1 bo'lak · nutq  22.94 s (97.6%) · eng qisqa 22.94 s
  top_db= 60    1 bo'lak · nutq  23.01 s (97.9%) · eng qisqa 23.01 s
```

## 💥 **BU FAYLDA UZUN JIMLIK YO'Q** — ## `top_db=25` dan boshlab **bitta bo'lak**.

## 🏆 **DARS: segmentatsiya foydasini AVVAL O'LCHANG.**

</details>

---

# 🔴 QIYIN *(15–18)*

**M15.** ⭐⭐⭐ Kvantlash shovqinini eshitiladigan qiling.

<details>
<summary>✅ Yechim</summary>

```python
def kvantla(x, bit, dither=False, urug=0):
    """⭐ bit chuqurligini kamaytiradi. dither — kvantlash artefaktini
    tasodifiy shovqinga aylantiradi."""
    L = 2 ** bit
    z = x.copy()
    if dither:                          # ⭐ TPDF dither
        r = np.random.RandomState(urug)
        q = 1.0 / (L / 2 - 1)
        z = z + (r.random(len(z)) - r.random(len(z))) * q
    return np.round(z * (L/2 - 1)) / (L/2 - 1)


x = y / np.abs(y).max()
for bit in [2, 4, 6, 8, 16]:
    for d in (False, True):
        q = kvantla(x, bit, dither=d)
        snr = 10*np.log10((x**2).mean() / max(((x-q)**2).mean(), 1e-30))
        nom = f"{bit:2d} bit {'dither' if d else '      '}"
        sf.write(f"kvant_{bit}{'_d' if d else ''}.wav", q, sr)
        print(f"  {nom}  SNR {snr:7.2f} dB   💾")

print("\n  🎧 kvant_4.wav va kvant_4_d.wav ni SOLISHTIRING")
print("     dither'siz  →  💥 'g'ijirlash', signalga BOG'LIQ buzilish")
print("     dither bilan →  ⭐ tekis 'shitirlash', quloqqa YOQIMLIROQ")
```

```
   2 bit         SNR    0.11 dB
   2 bit dither  SNR  -10.33 dB
   4 bit         SNR   11.60 dB
   4 bit dither  SNR    6.58 dB
   6 bit         SNR   24.38 dB
   6 bit dither  SNR   19.49 dB
   8 bit         SNR   36.63 dB
   8 bit dither  SNR   31.75 dB
  16 bit         SNR   84.83 dB
  16 bit dither  SNR   79.98 dB
```

## 💥 **DITHER SNR NI HAR DOIM ~5 dB PASAYTIRDI** *(2 bit da esa 10.4 dB)*.

## 🏆 **`dither` SNR NI PASAYTIRADI, LEKIN SIFATNI OSHIRADI.** ## Bu — **paradoks emas**: ## quloq **tasodifiy shovqinni** signal bilan bog'liq ## **buzilishdan ko'ra** oson kechiradi.

## ⭐ **AYNAN SHUNING UCHUN CD MASTERING'DA DITHER ISHLATILADI.**

</details>

**M16.** ⭐⭐⭐ Sample rate ning ASR ga ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import pipeline

asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")

etalon = None
for sr_test in [4000, 8000, 11025, 16000, 22050, 44100]:
    # ⭐ pasaytirib, keyin QAYTA 16 kHz ga ko'taramiz
    past = librosa.resample(y44, orig_sr=sr44, target_sr=sr_test)
    qayta = librosa.resample(past, orig_sr=sr_test, target_sr=16000)

    r = asr(qayta.copy(), generate_kwargs={"language": "en"})["text"].strip()
    etalon = r if etalon is None else etalon
    print(f"\n  {sr_test:6d} Hz -> {r[:90]}")
```

## ⭐ **BU MASHQ 60-MODULGA TAYYORGARLIK.** ## U yerda **WER** bilan aniq o'lchaymiz.

## 💡 **KUTILADIGAN NATIJA:** 8 kHz dan boshlab ## `s`/`sh` fonemalari **chalkasha boshlaydi**.

</details>

**M17.** ⭐⭐⭐ To'liq tayyorlash quvurini yozing.

<details>
<summary>✅ Yechim</summary>

```python
def asr_uchun_tayyorla(yol, hedef_sr=16000, hedef_dbfs=-20.0,
                       kesish_db=None, chiqish=None):
    """🏆 Whisper uchun audio tayyorlashning TO'LIQ quvuri."""
    xabar = []

    # ① o'qish (asl sample rate saqlanadi)
    x, s = librosa.load(yol, sr=None)
    xabar.append(f"o'qildi {s} Hz, {len(x)/s:.2f} s")

    # ② mono
    if x.ndim > 1:
        x = x.mean(axis=0)
        xabar.append("stereo -> mono")

    # ③ qayta namunalash (⭐ anti-aliasing avtomatik)
    if s != hedef_sr:
        x = librosa.resample(x, orig_sr=s, target_sr=hedef_sr)
        xabar.append(f"{s} -> {hedef_sr} Hz")

    # ④ DC siljishni olib tashlash
    dc = float(x.mean())
    if abs(dc) > 1e-4:
        x = x - dc
        xabar.append(f"DC {dc:+.5f} olib tashlandi")

    # ⑤ boshi/oxiridagi jimlik
    if kesish_db:
        oldin = len(x)
        x, _ = librosa.effects.trim(x, top_db=kesish_db)
        if len(x) < oldin:
            xabar.append(f"jimlik kesildi {(oldin-len(x))/hedef_sr:.2f} s")

    # ⑥ RMS normallash (⭐ clipping himoyasi bilan)
    rms = float(np.sqrt((x ** 2).mean()))
    if rms > 1e-9:
        x = x * (10 ** (hedef_dbfs / 20) / rms)
        if np.abs(x).max() > 0.99:
            x = x / np.abs(x).max() * 0.99
            xabar.append("⚠️ clipping oldini olish uchun pasaytirildi")
        xabar.append(f"RMS -> {hedef_dbfs} dBFS")

    # ⑦ TEKSHIRUV
    ogoh = []
    X = np.abs(np.fft.rfft(x))
    fr = np.fft.rfftfreq(len(x), 1 / hedef_sr)
    yuq = (X[fr >= 4000] ** 2).sum() / (X ** 2).sum()
    if yuq < 0.005:
        ogoh.append(f"💥 4 kHz+ atigi {yuq:.2%} — telefon kanali?")
    if (np.abs(x) > 0.99).sum():
        ogoh.append("💥 CLIPPING qoldi")

    print(f"  📄 {yol}")
    for m in xabar:
        print(f"     · {m}")
    for m in ogoh:
        print(f"     {m}")
    if not ogoh:
        print("     ✅ Whisper uchun tayyor")

    if chiqish:
        sf.write(chiqish, x, hedef_sr)
        print(f"     💾 {chiqish}")
    return x, hedef_sr


asr_uchun_tayyorla(WAV, chiqish="tayyor.wav", kesish_db=40)
```

## 🏆 **BU FUNKSIYA — 54-MODULNING AMALIY XULOSASI.** ## Uni **har ASR loyihasida** ishlating.

## ⭐ **④-BAND (`DC siljish`) — KURSDA YO'Q, LEKIN MUHIM:** ## ba'zi arzon mikrofonlar signalga **doimiy siljish** qo'shadi, ## bu esa **dinamik diapazonni** yeydi.

</details>

**M18.** ⭐⭐⭐ Siqish formatlarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import subprocess, os, shutil

# ⚠️ ffmpeg kerak: https://ffmpeg.org
if not shutil.which("ffmpeg"):
    print("💥 ffmpeg topilmadi — bu mashqni o'tkazib yuboring")
else:
    sf.write("test_asl.wav", y, sr)
    asos = os.path.getsize("test_asl.wav")

    FORMATLAR = [
        ("mp3_128", ["-b:a", "128k"], "mp3"),
        ("mp3_64",  ["-b:a", "64k"],  "mp3"),
        ("opus_32", ["-b:a", "32k"],  "opus"),
        ("opus_16", ["-b:a", "16k"],  "opus"),
    ]

    for nom, args, kengaytma in FORMATLAR:
        chiq = f"test_{nom}.{kengaytma}"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error",
                        "-i", "test_asl.wav", *args, chiq], check=True)
        h = os.path.getsize(chiq)

        # ⭐ qayta ochib, ASL bilan solishtiramiz
        z, _ = librosa.load(chiq, sr=sr)
        n = min(len(z), len(y))
        xato = float(np.sqrt(((z[:n] - y[:n]) ** 2).mean()))
        print(f"  {nom:9s} {h:8,d} bayt ({asos/h:5.1f}× tejam) · "
              f"farq {xato:.6f}")
```

## ⭐ **VA ENG MUHIM SAVOL — WER QANCHA OSHADI?** ## Buni **60-modulda** o'lchaymiz.

## 💡 **KUTILADIGAN NATIJA:** `opus_16` da ham WER **deyarli o'zgarmaydi** — ## Opus **nutq uchun** optimallashtirilgan.

</details>

---

## 📌 Modulda o'lchangan hamma narsa

| O'lchov | Natija |
|---|---|
| Aliasing *(8 kHz)* | 7500 Hz → ## 💥 **500 Hz** |
| Krest-faktor | ## **19.11 dB** |
| SNR 16 bit: o'lchangan | ## **82.06 dB** |
| SNR 16 bit: darslik | ## 💥 **98.08 dB** *(16 dB xato)* |
| SNR 16 bit: tuzatilgan | ## ✅ **81.97 dB** *(farq 0.09)* |
| Bitrate 44.1k/24/mono | ## **1 058 400 bit/s** = 7.57 MB/daq |
| Bitrate 16k/16/mono | ## **256 000 bit/s** = 1.83 MB/daq |
| 24 333 soat: WAV 44k | ## **10 793 GB** |
| 24 333 soat: Opus 16k | ## 🏆 **163 GB** *(66× tejam)* |
| `librosa soxr_hq` | ## 🏆 **4.2 ms** · xato **0.000000** |
| `scipy resample_poly` | 8.0 ms · xato **0.007574** |
| `y[::k]` | ## 💥 xato **0.131524** · uzunlik **518 436** |
| `z-norm` clipping | ## 💥 **97 958** *(26%)* |
| `tezlik 1.1×` → `f0` | 138.2 → **141.1** *(+2.1%)* |
| `pitch +2` → `f0` | 138.2 → **152.9** *(nazariy 155.1)* |
| `tezlik`/`pitch` → RMS | ## 💥 **−3.5 dB** |
| `siljish` → `f0` | ## ⚠️ **140.3** *(signal o'zgarmagan!)* |
| Segmentatsiya `top_db=25+` | ## **1 bo'lak** — jimlik yo'q |
| Dither *(4 bit)* | SNR **11.60 → 6.58 dB** — pasaytiradi, ## ⭐ **sifatni oshiradi** |
| `MP3 128k` = `WAV 8k/16bit` | ## **1305.3 GB** — bir xil hajm, ## 🏆 **2× polosa** |

---

🏠 [Modul boshiga](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
