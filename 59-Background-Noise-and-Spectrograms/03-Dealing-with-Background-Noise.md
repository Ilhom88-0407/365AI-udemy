# 3-dars. Fon shovqini bilan ishlash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: pre-emphasis WER ni 0.3390 dan 0.3220 ga tushirdi. Biz beshta usulni beshta shovqin darajasida sinadik — 25 ta o'lchov. Yaxshilanish: NOL. Yomonlashuv: 20 ta."**

---

## 1. Kursning yechimi

```python
signal_filtered = librosa.effects.preemphasis(audio_signal, coef=0.97)
sf.write("speech_01_filtered.wav", signal_filtered, sample_rate)
```

**Pre-emphasis** — birinchi tartibli yuqori chastota filtri:

```
   y[n] = x[n] − coef · x[n−1]
```

> ## 🔑 **G'OYA:** ## Undoshlar (`s`, `t`, `k`) **yuqori** chastotada, ## va ular so'zlarni **ajratish** uchun muhim. ## Ularni **kuchaytirsak**, model yaxshiroq tanishi kerak.

> ## ⚠️ **G'OYA MANTIQIY.** ## Endi uni **tekshiramiz**.

---

## 2. 🔬 Birinchi sinov — asl faylda

```python
from jiwer import wer

for c in [0.0, 0.5, 0.9, 0.95, 0.97, 0.99, 1.0]:
    z = librosa.effects.preemphasis(y, coef=c) if c else y
    z = z / max(np.abs(z).max(), 1e-9) * 0.9
    t, conf = transkript(z)
    print(f"coef {c:.2f}  RMS {rms:.2f}  WER {wer(GT, t):.4f}  "
          f"toza {wer(norm(GT), norm(t)):.4f}  ishonch {conf:.4f}")
```

### 📊 Natija *(44.1 kHz, asl fayl)*

| `coef` | RMS | Krest | WER | Toza WER | ## Ishonch |
|---|---|---|---|---|---|
| ## **0.00** *(hech narsa)* | −20.03 | 19.11 | ## **0.3390** | ## **0.0328** | ## 🏆 **0.9077** |
| 0.50 | −26.11 | 25.20 | 0.3390 | 0.0328 | 0.8673 |
| 0.90 | −29.69 | 28.77 | 0.3390 | 0.0328 | 0.7201 |
| 0.95 | −29.75 | 28.83 | 0.3390 | 0.0328 | 0.7416 |
| ## **0.97** *(kurs)* | −29.74 | 28.83 | ## **0.3390** | ## **0.0328** | ## 💥 **0.7595** |
| 0.99 | −29.72 | 28.81 | 0.3390 | 0.0328 | 0.7775 |
| 1.00 | −29.71 | 28.79 | 0.3390 | 0.0328 | 0.7574 |

> ## 💥💥💥 **WER YETTI QIYMATDA HAM AYNAN BIR XIL — 0.3390.**
>
> ## 💥 **TRANSKRIPT BIR HARFGA HAM O'ZGARMADI.**
>
> ## ## 💥 **VA ISHONCH TUSHDI: 0.9077 → 0.7595 (−16.3%).**

### 🔑 Nega kurs boshqacha natija oldi?

Kursning **asl** transkriptida `term` va `in` xato bor edi. Bizning transkriptda ular **allaqachon to'g'ri** — `turn` va `and`.

```
kurs (2024):  ... engineer term data scientist ... learning in artificial ...
biz  (2026):  ... engineer turn data scientist ... learning and artificial ...
```

> ## 🏆 **YA'NI GOOGLE MODELI SHU IKKI XATONI O'ZI TUZATDI.**
>
> ## ## 💡 **PRE-EMPHASIS TUZATADIGAN NARSA QOLMAGAN.**
>
> ## ⚠️ **XULOSA:** kursning natijasi **soxta emas** — ## u **o'sha vaqtdagi modelga** to'g'ri edi. ## ## 💥 **Lekin uni "pre-emphasis ishlaydi" deb umumlashtirib bo'lmaydi.**

---

## 3. 💥💥 Ikkinchi sinov — **beshta usul yonma-yon**

Faqat pre-emphasis emas, kurs eslatgan **hamma** usulni sinaymiz:

```python
usullar = [
    ("① asl (hech narsa)",       lambda s: s),
    ("② pre-emphasis 0.97",      lambda s: librosa.effects.preemphasis(s, coef=0.97)),
    ("③ trim (jimlikni kesish)", lambda s: librosa.effects.trim(s, top_db=25)[0]),
    ("④ bandpass 80-8000 Hz",    bandpass),
    ("⑤ spektral ayirish α=2",   spektral_ayirish),
    ("⑥ HPSS harmonik",          hpss_harmonik),
    ("⑦ preemph + bandpass",     lambda s: bandpass(librosa.effects.preemphasis(s, coef=0.97))),
    ("⑧ spektral + preemph",     lambda s: librosa.effects.preemphasis(spektral_ayirish(s), coef=0.97)),
]
```

### 📊 Natija *(asl 44.1 kHz fayl)*

| Usul | Vaqt | RMS | WER | ## Toza WER | Ishonch | So'z |
|---|---|---|---|---|---|---|
| ① asl | ## 🏆 **0.8 ms** | −20.03 | 0.3390 | ## **0.0328** | ## 🏆 **0.9077** | 61 |
| ② pre-emphasis | 2.8 ms | −29.74 | 0.3390 | **0.0328** | 0.7595 | 61 |
| ③ trim | 18.8 ms | −19.92 | 0.3390 | **0.0328** | 0.9120 | 61 |
| ④ bandpass | 16.3 ms | −16.52 | 0.3390 | **0.0328** | ## ⭐ **0.9187** | 61 |
| ⑤ spektral ayirish | 321.1 ms | −20.41 | 0.3390 | **0.0328** | 0.8953 | 61 |
| ## ⑥ HPSS harmonik | ## 💥 **1610.9 ms** | −16.09 | ## 💥 **1.0000** | ## 💥 **1.0000** | — | ## 💥 **0** |
| ⑦ preemph + bandpass | 18.1 ms | −26.64 | 0.3390 | **0.0328** | 0.7603 | 61 |
| ## ⑧ spektral + preemph | 142.5 ms | −29.58 | ## 💥 **1.0000** | ## 💥 **1.0000** | — | ## 💥 **0** |

### 💥 Qolgan xatolar — hammasida bir xil

```
① asl                  WER 0.0328  ['ivan->yvonne', 'turned->turn']
② pre-emphasis 0.97    WER 0.0328  ['ivan->yvonne', 'turned->turn']
③ trim                 WER 0.0328  ['ivan->yvonne', 'turned->turn']
④ bandpass 80-8000     WER 0.0328  ['ivan->yvonne', 'turned->turn']
⑤ spektral ayirish     WER 0.0328  ['ivan->yvonne', 'turned->turn']
⑦ preemph + bandpass   WER 0.0328  ['ivan->yvonne', 'turned->turn']

⑥ HPSS harmonik        WER 1.0000  💥 hech narsa tanilmadi
⑧ spektral + preemph   WER 1.0000  💥 hech narsa tanilmadi
```

> ## 💥💥💥 **OLTITASI — HECH QANDAY FARQ.**
>
> ## 💥💥 **IKKITASI — AUDIONI BUTUNLAY YO'Q QILDI.**
>
> ## ## ⚠️ **`librosa.effects.harmonic(margin=3.0)` NUTQNI O'LDIRDI.** ## Kurs uni *"nutqni shovqindan ajratish uchun foydali"* deb tavsiya qiladi. ## ## 💥 **Bizning o'lchovimizda — 61 ta so'zdan 0 ta.**

---

## 4. ⭐⭐⭐ **Adolatli** sinov: sun'iy shovqin qo'shamiz

Balki asl fayl **yetarlicha shovqinli emasdir**? Nazorat ostida shovqin qo'shamiz:

```python
def shovqin_qo(sig, snr_db, rng):
    """Berilgan SNR bilan oq shovqin qo'shadi."""
    p_s = np.mean(sig ** 2)
    p_n = p_s / (10 ** (snr_db / 10))
    n = rng.standard_normal(len(sig)).astype(np.float32) * np.sqrt(p_n)
    return (sig + n).astype(np.float32)
```

**16 kHz, 5 ta SNR darajasi, 6 ta usul = 30 ta o'lchov.**

### 📊 WER *(normallashtirilgan)*

| SNR | Hech narsa | Pre-emph .97 | Bandpass | Spektral α=2 | Spektral α=3 | Sp+preemph |
|---|---|---|---|---|---|---|
| **30 dB** | ## 🏆 **0.0328** | 💥 0.4098 | ## 🏆 **0.0328** | 💥 0.4098 | 💥 0.5082 | 💥 0.4098 |
| **20 dB** | ## 🏆 **0.0328** | 💥 0.4098 | ## 🏆 **0.0328** | 💥 0.5082 | ## 💥 **1.0000** | 💥 0.5082 |
| **10 dB** | ## 🏆 **0.0328** | 💥 0.2623 | ## 🏆 **0.0328** | ## 💥 **1.0000** | ## 💥 **1.0000** | 💥 0.4098 |
| **5 dB** | ## 🏆 **0.0492** | 💥 0.3115 | ## 🏆 **0.0492** | ## 💥 **1.0000** | ## 💥 **1.0000** | 💥 0.3443 |
| **0 dB** | ## 🏆 **0.1967** | 💥 0.4098 | ## 🏆 **0.1967** | ## 💥 **1.0000** | ## 💥 **1.0000** | 💥 0.7049 |

### 📊 Tanilgan so'zlar soni

| SNR | Hech narsa | Pre-emph | Bandpass | Spektral α=2 | Spektral α=3 |
|---|---|---|---|---|---|
| 30 dB | ## ⭐ **61** | 37 | ## ⭐ **61** | 37 | 31 |
| 20 dB | ## ⭐ **61** | 37 | ## ⭐ **61** | 31 | ## 💥 **0** |
| 10 dB | ## ⭐ **61** | 47 | ## ⭐ **61** | ## 💥 **0** | ## 💥 **0** |
| 5 dB | ## ⭐ **61** | 44 | ## ⭐ **61** | ## 💥 **0** | ## 💥 **0** |
| 0 dB | ## ⭐ **61** | 50 | ## ⭐ **61** | ## 💥 **0** | ## 💥 **0** |

### 🏁 Yakuniy hisob

| Usul | Yaxshiladi | Yomonlashtirdi | O'rtacha Δ WER |
|---|---|---|---|
| ## Pre-emphasis 0.97 | ## 💥 **0/5** | ## 💥 **5/5** | ## 💥 **−0.2918** |
| ## **Bandpass 80–7500** | ## **0/5** | ## ✅ **0/5** | ## ⭐ **+0.0000** |
| Spektral ayirish α=2 | ## 💥 **0/5** | ## 💥 **5/5** | ## 💥 **−0.7148** |
| Spektral ayirish α=3 | ## 💥 **0/5** | ## 💥 **5/5** | ## 💥 **−0.8328** |
| Spektral + preemph | ## 💥 **0/5** | ## 💥 **5/5** | ## 💥 **−0.4066** |

> ## 💥💥💥 **25 TA O'LCHOV. YAXSHILANISH — NOL.**
>
> ## 💥💥 **20 TASIDA — YOMONLASHUV.**
>
> ## ## 🏆 **ENG YAXSHI "SHOVQIN KAMAYTIRISH" USULI — HECH NARSA QILMASLIK.**

> ## ⭐ **VA E'TIBOR BERING — 0 dB SNR DA HAM:** ## shovqin nutq bilan **teng quvvatda**, ## va "hech narsa" **61 ta so'zdan 49 tasini** to'g'ri tanidi (WER 0.1967).

---

## 5. 🔑 **NEGA?** — sabab

```
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │  Google modeli MILLIONLAB SOATLIK shovqinli audioda        │
  │  o'qitilgan.                                               │
  │                                                            │
  │  U shovqinni "ko'rishga" O'RGANGAN.                        │
  │                                                            │
  │  Siz shovqinni "olib tashlaganingizda":                    │
  │    ① nutqning bir qismini ham olib tashlaysiz              │
  │    ② model kutmagan ARTEFAKTLAR qo'shasiz                  │
  │       (musiqiy shovqin, faza buzilishi)                    │
  │    ③ model bunday signalni HECH QACHON ko'rmagan           │
  │                                                            │
  │  Natija: MODEL UCHUN YOMONLASHADI.                         │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

| Usul | Nima qo'shadi |
|---|---|
| Spektral ayirish | ## 💥 **"musiqiy shovqin"** — tasodifiy tonlar |
| Pre-emphasis | ## 💥 **spektral qiyalik** — modelning kutganidan boshqa |
| HPSS | ## 💥 **faza artefaktlari** |
| ## Bandpass | ## ✅ **deyarli hech narsa** — shuning uchun zarar ham yo'q |

> ## 🏆 **BANDPASS 80–7500 Hz — YAGONA XAVFSIZ USUL.** ## Chunki u **nutq zonasidan tashqarini** kesadi, ## nutqning o'ziga **tegmaydi**. ## Va shuning uchun **hech narsani yaxshilamaydi ham**.

---

## 6. 💥💥 Pre-emphasis **chastotaga bog'liq** — kurs buni aytmaydi

`coef=0.97` filtri **diskretlash chastotasiga** qarab **butunlay boshqacha** ishlaydi:

```python
for srate in [44100, 16000, 8000]:
    y, _ = librosa.load("speech_01.wav", sr=srate)
    z = librosa.effects.preemphasis(y, coef=0.97)
    t, conf = transkript(z, srate)
    print(f"{srate} Hz  WER {wer(NGT, norm(t)):.4f}  {len(t.split())} so'z")
```

### 📊 Natija

| Chastota | `coef=0` | ## `coef=0.97` | So'z |
|---|---|---|---|
| 44 100 Hz | 0.0328 | ## ✅ **0.0328** | 61 |
| 22 050 Hz | 0.0328 | ## ✅ **0.0328** | 61 |
| ## **16 000 Hz** | 0.0328 | ## 💥 **0.4098** | ## 💥 **37** |
| 8 000 Hz | 0.0492 | ## ✅ **0.0492** | 61 |

> ## 💥💥 **16 kHz DA PRE-EMPHASIS 61 TA SO'ZDAN 24 TASINI YO'QOTDI.**
>
> ## ## ⚠️ **VA 16 kHz — AYNAN GOOGLE ICHKI ISHLATADIGAN CHASTOTA.**

### 🔬 Takrorlanuvchanligini tekshiramiz

```
16 kHz + preemph 0.97, 3 marta:
  1. WER 0.4098   37 so'z
  2. WER 0.4098   37 so'z
  3. WER 0.3934   38 so'z          ⭐ barqaror

16 kHz preemph SIZ, 2 marta:
  1. WER 0.0328   61 so'z
  2. WER 0.0328   61 so'z
```

### 🔬 `coef` bo'yicha — monoton

| `coef` *(16 kHz)* | WER | So'z |
|---|---|---|
| 0.50 | ## ✅ **0.0328** | 61 |
| 0.80 | ⚠️ 0.1475 | 53 |
| ## 0.90 | ## 💥 **0.4098** | 37 |
| 0.95 | 💥 0.3934 | 38 |
| ## **0.97** *(kurs)* | ## 💥 **0.3934** | 38 |
| 0.99 | 💥 0.4098 | 37 |

> ## ✅ **BU TASODIF EMAS** — natija **takrorlanadi** va `coef` bo'yicha **monoton**.

### 📐 Nega? — filtrning chastota xarakteristikasi

```
   H(f) = |1 − 0.97·e^(−j2πf/fs)|
```

| `fs` | 100 Hz | 300 Hz | 1000 Hz | 2000 Hz | 4000 Hz | 8000 Hz |
|---|---|---|---|---|---|---|
| 44 100 | −29.60 dB | −25.76 dB | −16.86 dB | −11.02 dB | −5.12 dB | +0.53 dB |
| ## **16 000** | −26.23 dB | ## 💥 **−18.44 dB** | ## 💥 **−8.28 dB** | −2.45 dB | +2.88 dB | +5.89 dB |
| 8 000 | −21.62 dB | −12.64 dB | −2.45 dB | +2.88 dB | +5.89 dB | — |

> ## 🔑 **BIR XIL `coef` — TURLI FILTR.** ## Chunki `e^(−j2πf/fs)` da `fs` bor. ## ## 💥 **16 kHz da 300 Hz `−18.44 dB` ga tushadi** — ## bu **asosiy ton** zonasi.

> ## ⭐ **QOIDA:** ## Pre-emphasis ishlatsangiz — ## `coef` ni **chastotangizga moslang**, ## va natijani **o'lchang**.

---

## 7. ⚠️ `adjust_for_ambient_noise()` — yashirin ma'lumot yo'qotish

Kurs buni tavsiya qiladi. Nima qilishini o'lchaymiz:

```python
for dur in [0.5, 1.0, 1.5]:
    r = sr.Recognizer()
    with sr.AudioFile("speech_01.wav") as s:
        r.adjust_for_ambient_noise(s, duration=dur)
        a = r.record(s)
    print(f"duration={dur}: threshold {r.energy_threshold:.2f}  "
          f"qolgan {len(a.frame_data)/(a.sample_rate*a.sample_width):.2f} s")
```

```
boshlang'ich energy_threshold: 300
duration=0.5: threshold 183342.20   qolgan audio 23.05 s
duration=1.0: threshold 301445.21   qolgan audio 22.58 s
duration=1.5: threshold 417666.35   qolgan audio 22.03 s
```

> ## 💥💥 **AUDIO QISQARDI: 23.51 s → 22.03 s.**
>
> ## ## 🔑 **`adjust_for_ambient_noise()` FAYLNING BOSHIDAN O'QIYDI** — ## va o'sha qism **`record()` ga yetib bormaydi**.

| `duration` | Yo'qolgan | Ulush |
|---|---|---|
| 0.5 s | 0.46 s | 2.0% |
| 1.0 s | 0.93 s | 4.0% |
| ## 1.5 s | ## 💥 **1.48 s** | ## 💥 **6.3%** |

> ## ⚠️ **VA `energy_threshold` 300 → 417 666 GA SAKRADI** *(1392×)*. ## Bu — `AudioFile` uchun **ma'nosiz**, ## chunki `record()` chegarani **ishlatmaydi**. ## ## 💥 **U faqat `listen()` — ya'ni MIKROFON uchun kerak.**

> ## ✅ **TO'G'RI ISHLATISH:**
> ```python
> with sr.Microphone() as manba:            # ⭐ MIKROFON, fayl emas
>     rec.adjust_for_ambient_noise(manba, duration=1.0)
>     audio = rec.listen(manba)
> ```

---

## 8. ⭐ Xulosa: **qachon** shovqin bilan ishlash kerak?

```
┌────────────────────────────────────────────────────────────────┐
│  ① Avval HECH NARSA QILMASDAN o'lchang                        │
│         ↓                                                      │
│  ② Natija yetarlimi?  ──► HA ──►  ✅ TO'XTANG                  │
│         │ YO'Q                                                 │
│         ↓                                                      │
│  ③ Xatolar QAYERDA? (alignments)                              │
│     · ismlar?      -> shovqin emas, LUG'AT muammosi            │
│     · undoshlar?   -> yuqori chastota yo'qolgan                │
│     · butun blok?  -> jimlik/kesilish muammosi                 │
│         ↓                                                      │
│  ④ Faqat ANIQ muammoga ANIQ yechim qo'llang                   │
│         ↓                                                      │
│  ⑤ QAYTA O'LCHANG — yomonlashtirmadingizmi?                   │
└────────────────────────────────────────────────────────────────┘
```

| Muammo | ## Ishlaydigan yechim |
|---|---|
| Doimiy gul (50/60 Hz) | ## ⭐ **notch filtr** — aniq chastotada |
| Kesilgan uzun fayl | ## ⭐ **bo'laklash** *(58-modul)* |
| Juda jim yozuv | ## ⭐ **normallash** |
| Stereo/chastota mos emas | ## ⭐ **`librosa.load(sr=16000, mono=True)`** |
| ## Umumiy fon shovqini | ## 💥 **hech narsa qilmang — yoki modelni almashtiring** |
| Reverberatsiya | ## 💥 **filtr yordam bermaydi** |

> ## 🏆🏆 **ENG KUCHLI "SHOVQIN KAMAYTIRISH" — YAXSHIROQ MODEL.**
>
> ## ## ⭐ **60-modulda Whisper ni sinaymiz** — ## u shu shovqinli faylda **qanday ishlashini** ko'ramiz.

---

## 9. 🔧 Halol shovqin laboratoriyasi

```python
import numpy as np, librosa, soundfile as sf, scipy.signal as ss


class ShovqinLab:
    """Shovqin kamaytirish usullarini HALOL taqqoslaydi.

    Har bir usulni o'lchaydi va YOMONLASHTIRSA — aytadi.
    """

    def __init__(self, srate=16000):
        self.srate = srate

    # ---------- usullar ----------
    def preemph(self, s, coef=0.97):
        return librosa.effects.preemphasis(s, coef=coef)

    def bandpass(self, s, lo=80, hi=7500):
        ny = self.srate / 2
        b, a = ss.butter(4, [lo / ny, min(hi, ny - 1) / ny], btype="band")
        return ss.filtfilt(b, a, s).astype(np.float32)

    def spektral(self, s, alfa=2.0, pol=0.05, shovqin_s=1.2):
        S = librosa.stft(s)
        mag, faza = np.abs(S), np.angle(S)
        nf = max(int(shovqin_s * self.srate / 512), 4)
        shov = mag[:, :nf].mean(axis=1, keepdims=True)
        toza = np.maximum(mag - alfa * shov, pol * mag)
        return librosa.istft(toza * np.exp(1j * faza),
                             length=len(s)).astype(np.float32)

    def normallash(self, s, maqsad_dbfs=-20.0):
        rms = np.sqrt(np.mean(s ** 2))
        if rms < 1e-9:
            return s
        k = 10 ** (maqsad_dbfs / 20) / rms
        return np.clip(s * k, -1.0, 1.0).astype(np.float32)

    # ---------- sinov ----------
    def sinov(self, sig, baholovchi, usullar=None, snr_lar=(30, 10, 0)):
        """baholovchi(signal) -> WER qaytaradigan funksiya."""
        usullar = usullar or {
            "hech narsa": lambda s: s,
            "normallash": self.normallash,
            "bandpass": self.bandpass,
            "pre-emphasis": self.preemph,
            "spektral α=2": self.spektral,
        }
        jadval = {}
        for snr in snr_lar:
            rng = np.random.default_rng(snr)
            p_s = np.mean(sig ** 2)
            n = rng.standard_normal(len(sig)).astype(np.float32) * \
                np.sqrt(p_s / (10 ** (snr / 10)))
            shovqinli = (sig + n).astype(np.float32)
            for nom, f in usullar.items():
                jadval[(snr, nom)] = baholovchi(f(shovqinli.copy()))
        return self._hisobot(jadval, list(usullar), list(snr_lar))

    def _hisobot(self, jadval, usullar, snr_lar):
        print(f"\n  {'SNR':>7} | " + " | ".join(f"{n:>14s}" for n in usullar))
        print("  " + "-" * (9 + 17 * len(usullar)))
        for snr in snr_lar:
            print(f"  {snr:5d} dB | " +
                  " | ".join(f"{jadval[(snr,n)]:14.4f}" for n in usullar))

        print(f"\n  {'usul':>16s}  yaxshiladi  yomonlashtirdi  o'rtacha Δ")
        xulosa = {}
        for n in usullar[1:]:
            d = [jadval[(s, usullar[0])] - jadval[(s, n)] for s in snr_lar]
            yax = sum(1 for x in d if x > 0.01)
            yom = sum(1 for x in d if x < -0.01)
            xulosa[n] = (yax, yom, float(np.mean(d)))
            bay = "⭐" if yax > yom else ("💥" if yom else "  ")
            print(f"  {n:>16s}  {yax:>10d}  {yom:>14d}  {np.mean(d):+10.4f} {bay}")

        eng = max(xulosa.items(), key=lambda kv: kv[1][2]) if xulosa else None
        if eng and eng[1][2] > 0.01:
            print(f"\n  🏆 tavsiya: {eng[0]}")
        else:
            print(f"\n  🏆 tavsiya: HECH NARSA QILMANG "
                  f"— hech bir usul yaxshilamadi")
        return xulosa
```

### ✅ Ishlatish

```python
lab = ShovqinLab(srate=16000)
y, _ = librosa.load("speech_01.wav", sr=16000)
lab.sinov(y, baholovchi=lambda s: wer(NGT, norm(transkript(s)[0])))
```

```
      SNR |     hech narsa |     normallash |       bandpass |   pre-emphasis |   spektral α=2
  ----------------------------------------------------------------------------------------------
     30 dB |         0.0328 |         0.0328 |         0.0328 |         0.4098 |         0.4098
     10 dB |         0.0328 |         0.0328 |         0.0328 |         0.2623 |         1.0000
      0 dB |         0.1967 |         0.1967 |         0.1967 |         0.4098 |         1.0000

              usul  yaxshiladi  yomonlashtirdi  o'rtacha Δ
        normallash           0               0     +0.0000
          bandpass           0               0     +0.0000
      pre-emphasis           0               3     -0.2732 💥
      spektral α=2           0               3     -0.7158 💥

  🏆 tavsiya: HECH NARSA QILMANG — hech bir usul yaxshilamadi
```

> ## 🏆 **SINF O'ZI TO'G'RI XULOSAGA KELDI.**
>
> ## ## 💡 **SHU YO'SIN YOZING:** ## har bir "yaxshilash"ni **o'lchang**, ## va sinf sizga **rostini aytsin**.

---

## 🎯 Nazorat savollari

1. Kurs pre-emphasis WER ni yaxshiladi dedi. Bizda nima chiqdi va nega farq bor?
2. 25 ta o'lchovdan nechtasida shovqin kamaytirish yordam berdi?
3. Nega Google modeli uchun "tozalangan" audio yomonroq?
4. `coef=0.97` 44.1 kHz va 16 kHz da bir xil ishlaydimi?
5. `adjust_for_ambient_noise()` faylda nima qiladi?
6. Qaysi usul yagona "zararsiz" bo'ldi va nega?

<details>
<summary>Javoblar</summary>

1. Bizda **hech qanday o'zgarish yo'q** — WER 0.3390 yetti xil `coef` da ham bir xil. Sabab: kursning **asl** transkriptida `term` va `in` xato bor edi, bizda esa Google **allaqachon** `turn` va `and` deb to'g'ri tanidi. **Tuzatadigan narsa qolmagan.**
2. ## **Nolta.** 25 o'lchovdan **20 tasida yomonlashdi**, 5 tasida o'zgarmadi. Eng yaxshi natija — **hech narsa qilmaslik**.
3. Model **millionlab soatlik shovqinli** audioda o'qitilgan — u shovqinni "ko'rishga" o'rgangan. Tozalash (a) nutqning bir qismini ham olib tashlaydi, (b) model **hech qachon ko'rmagan artefaktlar** qo'shadi (musiqiy shovqin, faza buzilishi).
4. **Yo'q.** `H(f) = |1 − 0.97·e^(−j2πf/fs)|` — `fs` formulada. 44.1 kHz da 300 Hz `−25.76 dB`, 16 kHz da `−18.44 dB`. 16 kHz da 61 ta so'zdan **24 tasi yo'qoldi**.
5. Faylning **boshidan `duration` soniya o'qiydi** — va o'sha qism `record()` ga **yetib bormaydi**. `duration=1.5` da 23.51 s → **22.03 s**. Bundan tashqari `energy_threshold` `record()` uchun **ishlatilmaydi** — u faqat `Microphone` + `listen()` uchun.
6. ## **Bandpass 80–7500 Hz.** U nutq zonasidan **tashqarini** kesadi, nutqning o'ziga tegmaydi. Shuning uchun zarar ham, foyda ham **nol** (Δ = +0.0000).

</details>

---

⬅️ [2-dars](02-Creating-a-Spectrogram.md) · 🏠 [Modul](README.md) · ➡️ [60-modul](../60-Transcribing-with-Whisper/README.md)
