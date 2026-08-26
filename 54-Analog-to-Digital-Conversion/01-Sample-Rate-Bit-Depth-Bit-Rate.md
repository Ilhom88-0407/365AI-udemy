# 1-dars. Sample rate, bit chuqurligi va bitrate ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu uch parametr — ASR loyihalaridagi eng ko'p uchraydigan xatoning manbai."**

---

## 1. Analogdan raqamliga — ikki qadam

```
🔊 AKUSTIK  →  🎙️ ANALOG ELEKTR  →  💻 RAQAMLI
                        ↓
              ① SAMPLING       (vaqt bo'yicha bo'lish)
              ② QUANTIZATION   (amplituda bo'yicha bo'lish)
```

> ## 🔑 **KURSNING TA'RIFI TO'G'RI:** *"Sampling — analog signal amplitudasining ko'plab suratlarini soniyasiga bir necha ming marta olish."*
>
> ## ⭐ **IKKI QADAM — IKKI TURLI YO'QOTISH:**
> ```
> SAMPLING     →  💥 CHASTOTA yo'qoladi  (Nayqvistdan yuqorisi)
> QUANTIZATION →  💥 ANIQLIK yo'qoladi   (kvantlash shovqini)
> ```

---

## 2. ⭐⭐⭐ Sample rate va Nayqvist

```
Sample rate = soniyasiga nechta o'lchov

⭐ NAYQVIST QOIDASI:
   maksimal saqlanadigan chastota  =  sample rate / 2
```

| Sample rate | Nayqvist | Qayerda ishlatiladi |
|---|---|---|
| 8 000 Hz | 4 000 Hz | ## 📞 Telefon |
| ## **16 000 Hz** | ## **8 000 Hz** | ## 🏆 **ASR standarti** *(Whisper)* |
| 22 050 Hz | 11 025 Hz | Eski o'yinlar |
| ## **44 100 Hz** | 22 050 Hz | ## 💿 **CD** |
| 48 000 Hz | 24 000 Hz | 🎬 Video |
| 96 000 Hz | 48 000 Hz | 🎛️ Studiya |

> ## 💥 **NIMA UCHUN WHISPER 16 kHz?**
> ```
> Nutqning MA'NOLI chastotalari  →  8 kHz gacha
> 16 kHz sample rate             →  8 kHz Nayqvist   ⭐ AYNAN yetadi
> 44.1 kHz                       →  2.76× ko'proq ma'lumot, 0 foyda
> ```
>
> ## ⚠️ **VA BU — MAJBURIY.** ## Whisper'ga 44.1 kHz bersangiz, u **baribir 16 kHz ga tushiradi**. ## Siz **oldindan** qilsangiz — **tezroq** bo'ladi.

### 💥 Aliasing — Nayqvist buzilganda

```python
import numpy as np

SR = 8000                                    # Nayqvist = 4000 Hz

for f in [500, 1000, 3000, 3900, 5000, 7000, 7500]:
    # ⭐ aliasing formulasi: signal "buklanadi"
    a = abs(((f + SR/2) % SR) - SR/2)
    belgi = "✅" if f < SR/2 else f"💥 {f} Hz -> {a:.0f} Hz deb eshitiladi"
    print(f"  {f:5d} Hz  ->  {a:6.0f} Hz   {belgi}")
```

```
    500 Hz  ->     500 Hz   ✅
   1000 Hz  ->    1000 Hz   ✅
   3000 Hz  ->    3000 Hz   ✅
   3900 Hz  ->    3900 Hz   ✅
   5000 Hz  ->    3000 Hz   💥 5000 Hz -> 3000 Hz deb eshitiladi
   7000 Hz  ->    1000 Hz   💥 7000 Hz -> 1000 Hz deb eshitiladi
   7500 Hz  ->     500 Hz   💥 7500 Hz -> 500 Hz deb eshitiladi
```

> ## 💥💥 **7500 Hz LIK TOVUSH 500 Hz BO'LIB "ESHITILADI".**
>
> ## 🔑 **BU — SHUNCHAKI YO'QOTISH EMAS, BUZILISH.** ## Yuqori chastota **past chastota sifatida** paydo bo'ladi va ## **haqiqiy signalni ifloslantiradi**.
>
> ## 🏆 **SHUNING UCHUN QAYTA NAMUNALASHDA ANTI-ALIASING FILTR SHART:**
> ```python
> # ❌ NOTO'G'RI — har 3-namunani olish
> y8 = y[::3]                          # 💥 ALIASING
>
> # ✅ TO'G'RI — filtr + qayta namunalash
> y8 = librosa.resample(y, orig_sr=24000, target_sr=8000)
> ```
> ## 💡 `librosa.resample` va `scipy.signal.resample_poly` — ## ikkalasi ham **anti-aliasing filtrni o'zi qo'llaydi**.

---

## 3. ⭐⭐ Bit chuqurligi va kvantlash

> ## 🔑 **KURSNING TASHBEHI YAXSHI:** *"Faqat butun sonlar bilan belgilangan chizg'ichni tasavvur qiling."*
>
> ```
> bit chuqurligi = har namunani nechta darajaga yaxlitlash
>
>  8 bit  →  2⁸  =        256 daraja
> 16 bit  →  2¹⁶ =     65 536 daraja
> 24 bit  →  2²⁴ = 16 777 216 daraja
> ```

### 🔬 O'lchangan — nazariy formula va haqiqat

```python
import soundfile as sf

y, _ = sf.read("speech_01.wav")
y = y / np.abs(y).max()

print("  bit   darajalar        SNR(dB)   nazariy 6.02·b+1.76")
for b in [2, 4, 8, 12, 16, 24]:
    L = 2 ** b
    q = np.round(y * (L / 2 - 1)) / (L / 2 - 1)
    xato = y - q
    snr = 10 * np.log10((y ** 2).mean() / max((xato ** 2).mean(), 1e-30))
    print(f"  {b:3d}  {L:12,d}  {snr:9.2f}  {6.02*b+1.76:16.2f}")
```

```
  bit   darajalar        SNR(dB)   nazariy 6.02·b+1.76
    2             4       0.03             13.80
    4            16       9.11             25.84
    8           256      33.87             49.92
   12         4,096      58.00             74.00
   16        65,536      82.06             98.08
   24    16,777,216     130.22            146.24
```

> ## ⚠️⚠️ **HAR QATORDA O'LCHANGAN SNR NAZARIYADAN ~16 dB PAST.**
>
> ## 🔑 **NIMA UCHUN? — `KREST-FAKTOR`.**
> ```
> Nazariy formula 6.02·b + 1.76:
>    ⭐ TO'LIQ shkalali SINUS uchun hisoblangan
>
> Nutq esa:
>    cho'qqi  -1.36 dBFS
>    RMS     -20.47 dBFS
>    ⭐ krest-faktor 19.11 dB
>
> Ya'ni nutq shkalaning FAQAT bir qismidan foydalanadi
>    →  💥 SNR shuncha dB ga PASAYADI
> ```
> ## 🏆 **HAQIQIY FORMULA:**
> ```
> SNR ≈ 6.02·b + 1.76 − krest_faktor + 3
> ```
>
> ## ⭐ **TEKSHIRAMIZ:** `16 bit → 6.02·16 + 1.76 − 19.11 + 3 = 81.97 dB`. ## **O'lchangan: 82.06** — farq **0.09 dB**. ✅
>
> ## 💥 **DARSLIK FORMULASI HAQIQIY SNR NI ~16 dB GA OSHIRIB KO'RSATADI.**

### ⭐ Amalda qancha bit kerak?

```
16 bit  →  SNR 82 dB   ⭐ MUSIQA va ASR uchun YETARLIDAN ORTIQ
                          (eng yaxshi mikrofon ~70 dB beradi)
24 bit  →  SNR 130 dB  ⭐ faqat YOZISH paytida foydali
                          (daraja noto'g'ri bo'lsa — zaxira bor)
 8 bit  →  SNR 34 dB   💥 shovqin ESHITILADI
```

> ## 🏆 **AMALIY QOIDA:**
> ```
> YOZISH   →  24 bit  (xatoga joy qoldiring)
> SAQLASH  →  16 bit  (yetarlidan ortiq)
> ASR      →  16 bit float32  (Whisper shuni kutadi)
> ```

---

## 4. ⭐ Bitrate

```
bitrate = sample_rate × bit_chuqurligi × kanallar_soni
```

### 🔬 Kursning misoli va bizning fayl

```python
def bitrate(sr, bit, kanal):
    b = sr * bit * kanal
    print(f"  {sr:6,} × {bit:2d} × {kanal}  =  {b:>10,} bit/s "
          f"= {b/1000:7.1f} kbps = {b/8/1024/1024*60:6.2f} MB/daqiqa")
    return b


print("KURSNING MISOLI (stereo CD):")
bitrate(44100, 16, 2)

print("\nBIZNING FAYL:")
bitrate(44100, 24, 1)

print("\nASR UCHUN:")
bitrate(16000, 16, 1)
bitrate(8000, 16, 1)
```

```
KURSNING MISOLI (stereo CD):
  44,100 × 16 × 2  =   1,411,200 bit/s =  1411.2 kbps =  10.09 MB/daqiqa

BIZNING FAYL:
  44,100 × 24 × 1  =   1,058,400 bit/s =  1058.4 kbps =   7.57 MB/daqiqa

ASR UCHUN:
  16,000 × 16 × 1  =     256,000 bit/s =   256.0 kbps =   1.83 MB/daqiqa
   8,000 × 16 × 1  =     128,000 bit/s =   128.0 kbps =   0.92 MB/daqiqa
```

> ## ✅ **KURSNING "TAXMINAN 1 400 000 bit/s" — TO'G'RI.** ## Aniq qiymat **1 411 200**.
>
> ## 🏆 **VA ENG MUHIM QATOR — OXIRGISI:**
> ```
> 44.1 kHz / 24 bit / mono  →  7.57 MB/daqiqa
> 16 kHz  / 16 bit / mono   →  1.83 MB/daqiqa   ⭐ 4.1× KICHIK
> ```
> ## 💡 **VA ASR ANIQLIGI — BIR XIL** *(Whisper baribir 16 kHz ga tushiradi)*.

### 🇺🇿 Amaliy hisob

```python
def saqlash_hajmi(soat, sr=16000, bit=16, kanal=1, siqilgan=False):
    """🇺🇿 Call-markaz arxivi qancha joy oladi?"""
    bps = sr * bit * kanal
    if siqilgan:
        bps = 24000                      # ⭐ Opus 24 kbps — nutq uchun
    gb = bps * soat * 3600 / 8 / 1024 ** 3
    print(f"  {soat:6,} soat · {'Opus 24k' if siqilgan else f'WAV {sr//1000}k/{bit}bit'}"
          f"  ->  {gb:8.1f} GB")
    return gb


print("Kuniga 1000 qo'ng'iroq × 4 daqiqa = 67 soat/kun · 24 333 soat/yil\n")
saqlash_hajmi(24333, 44100, 24, 1)
saqlash_hajmi(24333, 16000, 16, 1)
saqlash_hajmi(24333, siqilgan=True)
```

```
  24,333 soat · WAV 44k/24bit  ->  10793.4 GB
  24,333 soat · WAV 16k/16bit  ->   2610.6 GB
  24,333 soat · Opus 24k       ->    244.7 GB
```

> ## 💥 **10.8 TB → 245 GB.** ## **44× tejam** — va **ASR aniqligi deyarli o'zgarmaydi**.
>
> ## ⚠️ **"DEYARLI" — MUHIM SO'Z.** ## Opus **yo'qotishli** siqish. ## 🏆 **60-modulda buni o'lchaymiz.**

---

## 5. 💥 Eng ko'p uchraydigan xatolar

> ### ① 💥 **Sample rate ni metadata'da o'zgartirish**
> ```python
> # 💥 NOTO'G'RI — bu faylni SEKINLASHTIRADI/TEZLASHTIRADI
> sf.write("out.wav", y, 8000)      # y aslida 16 kHz edi
>
> # ✅ TO'G'RI
> y8 = librosa.resample(y, orig_sr=16000, target_sr=8000)
> sf.write("out.wav", y8, 8000)
> ```
>
> ### ② 💥 **Anti-aliasing filtrsiz kesish**
> ```python
> y8 = y[::2]                       # 💥 ALIASING
> ```
>
> ### ③ 💥 **8 kHz dan 16 kHz ga "ko'tarish"**
> ```
> Fayl 8 kHz da yozilgan  →  4 kHz dan yuqorisi YO'Q
> 16 kHz ga ko'tarasiz    →  ⚠️ chastotalar QAYTIB KELMAYDI
> Whisper "16 kHz" deb qabul qiladi, lekin ma'lumot YO'Q
> ```
> ## 🏆 **BUNI ANIQLASH USULI** *(53-modul, LOYIHALAR)*:
> ```python
> if energiya_4kHz_dan_yuqorida < 0.005:
>     print("💥 fayl 8 kHz dan ko'tarilgan")
> ```
>
> ### ④ 💥 **`int16` va `float32` ni aralashtirish**
> ```python
> y_int = sf.read("a.wav", dtype="int16")[0]     # -32768 .. 32767
> y_flt = sf.read("a.wav")[0]                    # -1.0 .. 1.0
>
> # 💥 int16 ni to'g'ridan-to'g'ri modelga berish  →  MA'NOSIZ natija
> y = y_int.astype(np.float32) / 32768.0         # ✅ to'g'ri
> ```
>
> ### ⑤ 💥 **Stereo faylni mono deb hisoblash**
> ```python
> y, sr = sf.read("stereo.wav")      # shakl: (n, 2)
> # 💥 model 1D kutadi
> y = y.mean(axis=1)                 # ✅ mono ga aylantirish
> ```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nayqvist chastotasi nima?

**M2.** Nima uchun Whisper 16 kHz ishlatadi?

**M3.** Bitrate formulasi qanday?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## `sample_rate / 2` — ## saqlanadigan **maksimal** chastota.

**M2.** ## Nutqning ma'noli chastotalari **8 kHz gacha**; ## 16 kHz → Nayqvist **8 kHz** — **aynan yetadi**.

**M3.** ## `sample_rate × bit × kanal`. ## O'lchandi: `44100 × 24 × 1` = **1 058 400 bit/s**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Aliasingni eshitiladigan qiling.

<details>
<summary>✅ Yechim</summary>

```python
import soundfile as sf, librosa, scipy.signal as sig

SR = 44100
t = np.arange(SR * 2) / SR

# ⭐ chastota 100 dan 8000 gacha o'sadigan signal (sweep)
sweep = sig.chirp(t, f0=100, f1=8000, t1=2, method="linear") * 0.5

# ① TO'G'RI: anti-aliasing filtr bilan
togri = librosa.resample(sweep, orig_sr=SR, target_sr=8000)

# ② NOTO'G'RI: har 5.5-namunani olish (filtrsiz)
xato = sweep[::int(SR / 8000)]

sf.write("sweep_asl.wav", sweep, SR)
sf.write("sweep_togri.wav", togri, 8000)
sf.write("sweep_xato.wav", xato, 8000)

for nom, s, srr in [("to'g'ri", togri, 8000), ("xato", xato, 8000)]:
    S = np.abs(np.fft.rfft(s))
    fr = np.fft.rfftfreq(len(s), 1 / srr)
    # ⭐ 3000 Hz dan yuqoridagi energiya
    yuq = (S[fr > 3000] ** 2).sum() / (S ** 2).sum()
    print(f"  {nom:8s} 3 kHz dan yuqorida {yuq:6.2%} energiya")

print("\n  🎧 sweep_xato.wav ni tinglang:")
print("     ⭐ ohang KO'TARILADI, keyin 💥 QAYTIB TUSHADI")
print("     bu — aliasing 'burilishi'")
```

## 🏆 **`sweep_xato.wav` DA OHANG YUQORIGA CHIQIB, KEYIN PASTGA TUSHADI.** ## Bu — aliasingning **eng aniq eshitiladigan** ko'rinishi.

</details>

**M5.** ⭐⭐ Bit chuqurligi va SNR ni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
y, _ = sf.read("speech_01.wav")
y = y / np.abs(y).max()

rms = float(np.sqrt((y ** 2).mean()))
krest = 20 * np.log10(1.0 / rms)
print(f"  krest-faktor: {krest:.2f} dB\n")

print("  bit   o'lchangan  darslik    krest bilan tuzatilgan")
for b in [8, 12, 16, 24]:
    L = 2 ** b
    q = np.round(y * (L/2 - 1)) / (L/2 - 1)
    snr = 10 * np.log10((y**2).mean() / max(((y-q)**2).mean(), 1e-30))
    darslik = 6.02 * b + 1.76
    tuzatilgan = darslik - krest + 3
    print(f"  {b:3d}   {snr:9.2f}  {darslik:8.2f}   {tuzatilgan:9.2f}")
```

```
  krest-faktor: 19.11 dB

  bit   o'lchangan  darslik    krest bilan tuzatilgan
    2        0.03     13.80       -2.31
    4        9.11     25.84        9.73
    8       33.87     49.92       33.81
   12       58.00     74.00       57.89
   16       82.06     98.08       81.97
   24      130.22    146.24      130.13
```

## 🏆 **"KREST BILAN TUZATILGAN" USTUNI O'LCHANGANGA DEYARLI AYNAN MOS** *(8–24 bit da farq < 0.1 dB)*.

## ⚠️ **LEKIN 2 VA 4 BIT DA FORMULA BUZILADI** *(0.03 vs −2.31 · 9.11 vs 9.73)*. ## 🔑 Bunday past chuqurlikda kvantlash xatosi ## **tasodifiy shovqin bo'lmay qoladi** — u signal bilan **bog'lanib qoladi**, ## va formulaning asosiy taxmini **buziladi**.

## 💥 **DARSLIK FORMULASI ESA 16 dB GA OSHIRIB KO'RSATADI.**

</details>

**M6.** ⭐ Saqlash hajmini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
FORMATLAR = {
    "WAV 44.1k/24bit stereo": 44100 * 24 * 2,
    "WAV 44.1k/16bit stereo": 44100 * 16 * 2,
    "WAV 16k/16bit mono":     16000 * 16 * 1,
    "WAV 8k/16bit mono":       8000 * 16 * 1,
    "MP3 128k":               128000,
    "Opus 32k (nutq)":         32000,
    "Opus 16k (nutq)":         16000,
}

soat = 24333                      # yillik call-markaz
print(f"  {soat:,} soat uchun:\n")
asos = None
for nom, bps in FORMATLAR.items():
    gb = bps * soat * 3600 / 8 / 1024 ** 3
    asos = asos or gb
    print(f"  {nom:26s} {gb:9.1f} GB   ({asos/gb:5.1f}× tejam)")
```

## 💡 **NUTQ UCHUN `Opus` — ENG SAMARALI.** ## MP3 musiqa uchun optimallashtirilgan, ## Opus esa **nutqda** ancha yaxshi.

</details>

---

## 📌 Xulosa

```
① SAMPLING     →  Nayqvist = sr/2  →  💥 undan yuqorisi ALIASING
② QUANTIZATION →  2^bit daraja     →  💥 kvantlash shovqini

bitrate = sr × bit × kanal
```

```
🔬 O'LCHANGAN:
   aliasing: 8 kHz sr da 7500 Hz  →  💥 500 Hz bo'lib eshitiladi

   bit chuqurligi   o'lchangan SNR   darslik formulasi
      8 bit             33.87            49.92    💥 16 dB farq
     16 bit             82.06            98.08    💥 16 dB farq
     24 bit            130.22           146.24    💥 16 dB farq

   ⭐ SABAB: krest-faktor 19.11 dB
   ✅ TUZATILGAN: 6.02·b + 1.76 − krest + 3   →  farq < 0.4 dB

   bitrate:  44.1k/24bit/mono  →  7.57 MB/daqiqa
             16k/16bit/mono    →  1.83 MB/daqiqa   ⭐ 4.1× kichik
   24 333 soat: 10.8 TB (WAV 44k) → 245 GB (Opus)  🏆 44× tejam
```

> ## 🏆🏆 **DARSLIK FORMULASI `6.02·b + 1.76` — TO'LIQ SHKALALI SINUS UCHUN.** ## **NUTQ UCHUN U ~16 dB GA XATO.**

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Audio signalni qayta ishlash](02-Audio-Signal-Processing.md)
