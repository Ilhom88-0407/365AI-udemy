# 📝 59-modul. Mashqlar

> **18 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Har birida **yechim** bor — lekin avval o'zingiz urinib ko'ring.

---

## 🟢 1-mashq. STFT shakli

`librosa.stft()` nima qaytaradi? Shakl, tur va xotira hajmini chiqaring.

<details><summary>Yechim</summary>

```python
import numpy as np, librosa

y, srate = librosa.load("speech_01.wav", sr=None)
S = librosa.stft(y)
print(f"shakl {S.shape}  turi {S.dtype}")
print(f"kirish {y.nbytes/1024/1024:.2f} MB -> STFT {S.nbytes/1024/1024:.2f} MB "
      f"({S.nbytes/y.nbytes:.2f}×)")
```

```
shakl (1025, 2026)  turi complex64
kirish 3.96 MB -> STFT 15.84 MB (4.01×)
```
</details>

---

## 🟢 2-mashq. `n_fft` murosasi

`n_fft` ni 512 dan 4096 gacha o'zgartiring. Chastota va vaqt aniqligi qanday o'zgaradi?

<details><summary>Yechim</summary>

```python
for n in [512, 1024, 2048, 4096]:
    S = librosa.stft(y, n_fft=n)
    print(f"n_fft={n:5d} {str(S.shape):14s} bin {srate/n:6.2f} Hz  "
          f"oyna {n/srate*1000:6.2f} ms  {S.nbytes/1024/1024:.2f} MB")
```

```
n_fft=  512 (257, 8101)    bin  86.13 Hz  oyna  11.61 ms  15.88 MB
n_fft= 4096 (2049, 1013)   bin  10.77 Hz  oyna  92.88 ms  15.84 MB
```

Xotira **deyarli o'zgarmaydi** — binlar ↑, freymlar ↓.
</details>

---

## 🟡 3-mashq. 💥 `top_db=80` tuzog'i

`amplitude_to_db()` ma'lumotning qanchasini kesadi? Haqiqiy eng past qiymat qancha?

<details><summary>Yechim</summary>

```python
a = librosa.amplitude_to_db(np.abs(S), ref=np.max)
b = librosa.amplitude_to_db(np.abs(S), ref=np.max, top_db=None)
print(f"standart : min {a.min():.2f} dB")
print(f"kesishsiz: min {b.min():.2f} dB")
print(f"kesilgan : {(b < -80).mean()*100:.2f}%")
```

```
standart : min -80.00 dB
kesishsiz: min -142.03 dB
kesilgan : 32.40%
```

Rasm uchun — mayli. **Raqam hisoblasangiz** — `top_db=None`.
</details>

---

## 🟡 4-mashq. Chastota zonalari bo'yicha energiya

Shovqin (0–1.5 s) va nutq (5–20 s) energiyasini zonalarga bo'lib solishtiring.

<details><summary>Yechim</summary>

```python
mag = np.abs(S)
freq = librosa.fft_frequencies(sr=srate, n_fft=2048)
tt = librosa.frames_to_time(np.arange(S.shape[1]), sr=srate, hop_length=512)

for nom, a, b in [("shovqin", 0, 1.5), ("nutq", 5, 20)]:
    sp = mag[:, (tt >= a) & (tt < b)].mean(axis=1)
    tot = (sp**2).sum()
    print(f"\n{nom}:")
    for lo, hi in [(0,300), (300,1000), (1000,2000), (2000,4000)]:
        k = (freq >= lo) & (freq < hi)
        print(f"  {lo:5d}-{hi:5d}: {(sp[k]**2).sum()/tot*100:6.2f}%")
```

```
shovqin:  0-300 13.38% · 300-1000 42.39% · 1000-2000 30.81%
nutq   :  0-300 50.12% · 300-1000 28.80% · 1000-2000 10.90%
```
</details>

---

## 🟡 5-mashq. ⭐ SNR spektri

Har bir chastotada nutq shovqindan necha dB baland? Eng yomon nuqtani toping.

<details><summary>Yechim</summary>

```python
sh = 20*np.log10(mag[:, tt < 1.5].mean(axis=1) + 1e-12)
nu = 20*np.log10(mag[:, (tt >= 5) & (tt < 20)].mean(axis=1) + 1e-12)
snr = nu - sh

print(f"o'rtacha SNR : {snr.mean():.2f} dB")
print(f"eng yaxshi   : {freq[np.argmax(snr)]:.0f} Hz -> {snr.max():+.2f} dB")
print(f"eng yomon    : {freq[np.argmin(snr)]:.0f} Hz -> {snr.min():+.2f} dB")
```

```
o'rtacha SNR : 32.79 dB
eng yaxshi   : 12769 Hz -> +76.43 dB
eng yomon    : 2261 Hz -> -4.71 dB      💥 shovqin nutqdan BALAND
```

2 kHz — **undoshlar** zonasi, ya'ni ma'no uchun eng muhim joy.
</details>

---

## 🟡 6-mashq. Fayl qanchalik shovqinli?

`librosa.effects.split()` yordamida jimlik ulushini o'lchang.

<details><summary>Yechim</summary>

```python
for td in [20, 30, 40]:
    iv = librosa.effects.split(y, top_db=td)
    d = sum(b-a for a, b in iv) / srate
    print(f"top_db={td}: {len(iv)} segment · nutq {d/(len(y)/srate)*100:.1f}%")
```

```
top_db=20: 4 segment · nutq 95.8%
top_db=30: 3 segment · nutq 97.4%
top_db=40: 1 segment · nutq 97.5%
```

95.8% "nutq" — chunki **shovqin darajasi juda yuqori**, pauzalar ham chegaradan o'tadi.
</details>

---

## 🟡 7-mashq. Spektrogramma turlari

STFT, mel(128), mel(80) va CQT ni hajm va vaqt bo'yicha solishtiring.

<details><summary>Yechim</summary>

```python
import time
for nom, f in [("stft", lambda: np.abs(librosa.stft(y))),
               ("mel128", lambda: librosa.feature.melspectrogram(y=y, sr=srate, n_mels=128)),
               ("mel80", lambda: librosa.feature.melspectrogram(y=y, sr=srate, n_mels=80)),
               ("cqt", lambda: np.abs(librosa.cqt(y, sr=srate)))]:
    t0 = time.perf_counter(); M = f()
    print(f"{nom:7s} {str(M.shape):14s} {M.nbytes/1024/1024:5.2f} MB "
          f"{(time.perf_counter()-t0)*1000:7.1f} ms")
```

```
stft    (1025, 2026)   7.92 MB   622.7 ms
mel80   (80, 2026)     0.62 MB    72.2 ms      🏆 12.8× kichik, 8.6× tez
```
</details>

---

## 🔴 8-mashq. 💥 Pre-emphasis WER ni yaxshiladimi?

`coef` ni 0 dan 1 gacha o'zgartirib WER ni o'lchang.

<details><summary>Yechim</summary>

```python
for c in [0.0, 0.5, 0.97, 1.0]:
    z = librosa.effects.preemphasis(y, coef=c) if c else y
    z = z / np.abs(z).max() * 0.9
    t, conf = transkript(z)
    print(f"coef {c:.2f}  WER {wer(GT, t):.4f}  ishonch {conf:.4f}")
```

```
coef 0.00  WER 0.3390  ishonch 0.9077
coef 0.50  WER 0.3390  ishonch 0.8673
coef 0.97  WER 0.3390  ishonch 0.7595
coef 1.00  WER 0.3390  ishonch 0.7574
```

## 💥 **WER umuman o'zgarmadi.** Ishonch esa **16.3% tushdi**.
</details>

---

## 🔴 9-mashq. Sun'iy shovqin qo'shish

Berilgan SNR bilan oq shovqin qo'shadigan funksiya yozing va tekshiring.

<details><summary>Yechim</summary>

```python
def shovqin_qo(sig, snr_db, rng):
    p_s = np.mean(sig ** 2)
    n = rng.standard_normal(len(sig)).astype(np.float32) * \
        np.sqrt(p_s / (10 ** (snr_db / 10)))
    return (sig + n).astype(np.float32)

rng = np.random.default_rng(0)
for snr in [30, 10, 0]:
    z = shovqin_qo(y, snr, rng)
    olch = 10*np.log10(np.mean(y**2) / np.mean((z-y)**2))
    print(f"kutilgan {snr:3d} dB  ->  o'lchangan {olch:6.2f} dB")
```

```
kutilgan  30 dB  ->  o'lchangan  30.00 dB
kutilgan  10 dB  ->  o'lchangan  10.00 dB
kutilgan   0 dB  ->  o'lchangan   0.00 dB      ✅
```
</details>

---

## 🔴 10-mashq. ⭐⭐ Adolatli taqqoslash

Beshta usulni beshta SNR darajasida sinang. Nechtasi yaxshiladi?

<details><summary>Yechim</summary>

```python
for snr in [30, 20, 10, 5, 0]:
    sig = shovqin_qo(y16, snr, np.random.default_rng(snr))
    r = []
    for nom, f in USULLAR:
        t, _ = transkript(f(sig.copy()))
        r.append(wer(NGT, norm(t)) if t else 1.0)
    print(f"{snr:3d} dB: " + " ".join(f"{x:.4f}" for x in r))
```

```
 30 dB: 0.0328 0.4098 0.0328 0.4098 0.5082
 20 dB: 0.0328 0.4098 0.0328 0.5082 1.0000
 10 dB: 0.0328 0.2623 0.0328 1.0000 1.0000
  5 dB: 0.0492 0.3115 0.0492 1.0000 1.0000
  0 dB: 0.1967 0.4098 0.1967 1.0000 1.0000
```

## 🏆 **Yaxshilanish: 0/25.** Yomonlashuv: **20/25**.
</details>

---

## 🔴 11-mashq. 💥 Pre-emphasis va chastota

`coef=0.97` ni 44.1 kHz, 16 kHz va 8 kHz da sinang. Farqi bormi?

<details><summary>Yechim</summary>

```python
for srate in [44100, 22050, 16000, 8000]:
    z, _ = librosa.load("speech_01.wav", sr=srate)
    p = librosa.effects.preemphasis(z, coef=0.97)
    t, _ = transkript(p, srate)
    print(f"{srate:6d} Hz  WER {wer(NGT, norm(t)):.4f}  {len(t.split())} so'z")
```

```
 44100 Hz  WER 0.0328  61 so'z
 22050 Hz  WER 0.0328  61 so'z
 16000 Hz  WER 0.4098  37 so'z      💥 24 ta so'z yo'qoldi
  8000 Hz  WER 0.0492  61 so'z
```

Sabab: `H(f) = |1 − 0.97·e^(−j2πf/fs)|` — **`fs` formulada**.
</details>

---

## 🔴 12-mashq. Filtrning chastota xarakteristikasi

Pre-emphasis filtrini turli `fs` da chizib, farqni ko'rsating.

<details><summary>Yechim</summary>

```python
import scipy.signal as ss

for srate in [44100, 16000, 8000]:
    w, h = ss.freqz([1, -0.97], [1], worN=8192, fs=srate)
    r = []
    for f in [100, 300, 1000, 4000]:
        if f > srate/2:
            r.append("  —  ")
        else:
            i = int(np.argmin(np.abs(w - f)))
            r.append(f"{20*np.log10(abs(h[i])):+6.2f}")
    print(f"{srate:6d} Hz: " + " ".join(r))
```

```
 44100 Hz: -29.60 -25.76 -16.86  -5.12
 16000 Hz: -26.23 -18.44  -8.28  +2.88
  8000 Hz: -21.62 -12.64  -2.45  +5.89
```
</details>

---

## 🔴 13-mashq. Spektral ayirish

Spektral ayirish funksiyasini yozing va WER ga ta'sirini o'lchang.

<details><summary>Yechim</summary>

```python
def spektral_ayirish(sig, alfa=2.0, pol=0.05, shovqin_s=1.2):
    S = librosa.stft(sig)
    mag, faza = np.abs(S), np.angle(S)
    nf = max(int(shovqin_s * srate / 512), 4)
    shov = mag[:, :nf].mean(axis=1, keepdims=True)
    toza = np.maximum(mag - alfa * shov, pol * mag)
    return librosa.istft(toza * np.exp(1j*faza), length=len(sig)).astype(np.float32)

for a in [1.0, 2.0, 3.0]:
    t, _ = transkript(spektral_ayirish(y16, alfa=a))
    print(f"α={a}  WER {wer(NGT, norm(t)) if t else 1.0:.4f}  {len(t.split())} so'z")
```

α oshgan sari **yomonlashadi** — "musiqiy shovqin" artefaktlari qo'shiladi.
</details>

---

## 🔴 14-mashq. 💥 HPSS nutqni o'ldiradi

`librosa.effects.harmonic(margin=3.0)` ni sinang.

<details><summary>Yechim</summary>

```python
h = librosa.effects.harmonic(y, margin=3.0)
t, _ = transkript(h / np.abs(h).max() * 0.9)
print(f"HPSS: {len(t.split())} so'z  {t[:50] or '💥 HECH NARSA'}")
```

```
HPSS: 0 so'z  💥 HECH NARSA
```

Kurs uni tavsiya qiladi. Bizning o'lchovda — **61 dan 0**.
</details>

---

## 🔴 15-mashq. ⚠️ `adjust_for_ambient_noise` audioni yeydi

Bu funksiya faylda nima qilishini o'lchang.

<details><summary>Yechim</summary>

```python
import speech_recognition as sr

for dur in [0.5, 1.0, 1.5]:
    r = sr.Recognizer()
    with sr.AudioFile("speech_01.wav") as s:
        r.adjust_for_ambient_noise(s, duration=dur)
        a = r.record(s)
    q = len(a.frame_data) / (a.sample_rate * a.sample_width)
    print(f"duration={dur}: threshold {r.energy_threshold:9.2f}  qolgan {q:.2f} s")
```

```
duration=0.5: threshold 183342.20  qolgan 23.05 s
duration=1.0: threshold 301445.21  qolgan 22.58 s
duration=1.5: threshold 417666.35  qolgan 22.03 s      💥 1.48 s yo'qoldi
```

Va `energy_threshold` `record()` uchun **umuman ishlatilmaydi** — u `Microphone` + `listen()` uchun.
</details>

---

## 🔴 16-mashq. Bandpass — yagona zararsiz usul

80–7500 Hz bandpass filtri yozing va WER ga ta'sirini tekshiring.

<details><summary>Yechim</summary>

```python
import scipy.signal as ss

def bandpass(sig, srate, lo=80, hi=7500):
    ny = srate / 2
    b, a = ss.butter(4, [lo/ny, min(hi, ny-1)/ny], btype="band")
    return ss.filtfilt(b, a, sig).astype(np.float32)

for snr in [30, 10, 0]:
    sig = shovqin_qo(y16, snr, np.random.default_rng(snr))
    for nom, z in [("hech narsa", sig), ("bandpass", bandpass(sig, 16000))]:
        t, _ = transkript(z)
        print(f"{snr:3d} dB {nom:12s} WER {wer(NGT, norm(t)):.4f}")
```

Har uch darajada ham **aynan bir xil** — zarar ham, foyda ham yo'q.
</details>

---

## 🔴 17-mashq. Ikkita spektrogrammani yonma-yon

Asl va pre-emphasis qilingan signalni bitta rasmda taqqoslang.

<details><summary>Yechim</summary>

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(2, 1, figsize=(12, 7))
for a, sig, nom in zip(ax, [y, librosa.effects.preemphasis(y, coef=0.97)],
                       ["asl", "pre-emphasis 0.97"]):
    db = librosa.amplitude_to_db(np.abs(librosa.stft(sig)), ref=np.max)
    im = librosa.display.specshow(db, sr=srate, x_axis="time", y_axis="log", ax=a)
    a.set(title=f"{nom} · RMS {20*np.log10(np.sqrt(np.mean(sig**2))):.2f} dBFS")
fig.colorbar(im, ax=ax, format="%+2.0f dB")
plt.show()
```

Pre-emphasis'da yuqori chastotalar **yorqinroq**, past chastotalar **qorayadi**.
</details>

---

## 🔴 18-mashq. ⭐ Halol shovqin laboratoriyasi

Har bir usulni o'lchaydigan va **yomonlashtirsa aytadigan** sinf yozing.

<details><summary>Yechim</summary>

`ShovqinLab` — [3-dars, 9-bo'lim](03-Dealing-with-Background-Noise.md) ga qarang.

Asosiy g'oya:

```python
for nom in usullar[1:]:
    d = [jadval[(s, "hech narsa")] - jadval[(s, nom)] for s in snr_lar]
    yax = sum(1 for x in d if x > 0.01)
    yom = sum(1 for x in d if x < -0.01)
    print(f"{nom}: yaxshiladi {yax}, yomonlashtirdi {yom}, Δ {np.mean(d):+.4f}")

if max(ortacha_delta) <= 0.01:
    print("🏆 tavsiya: HECH NARSA QILMANG")
```

## 🔑 **Asbob sizga rostini aytishi kerak — hatto siz kutmagan rostni ham.**
</details>

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
