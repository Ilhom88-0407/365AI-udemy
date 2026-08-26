# 2-dars. Python'da spektrogramma yaratish ⭐⭐

## 🎬 Boshlashdan oldin

> **"`librosa.amplitude_to_db()` ma'lumotlaringizning 32.4% ini jimgina kesib tashlaydi. Chunki `top_db=80` — standart qiymat, va uni hech kim aytmaydi."**

---

## 1. Kursning kodi

```python
import numpy as np, librosa, librosa.display
import matplotlib.pyplot as plt

S = librosa.stft(audio_signal)
S_db = librosa.amplitude_to_db(np.abs(S), ref=np.max)

plt.figure(figsize=(12, 4))
librosa.display.specshow(data=S_db, sr=sample_rate, x_axis="time", y_axis="log")
plt.colorbar(format="%+2.0f dB")
plt.title("Spektrogramma")
plt.xlabel("Vaqt")
plt.ylabel("Chastota")
plt.show()
```

**Uch qadam:**

```
   ① librosa.stft()          -> murakkab sonlar matritsasi
   ② np.abs() + to_db()      -> dB shkalasi
   ③ specshow()              -> rasm
```

---

## 2. ⭐ `stft()` nima qaytaradi?

```python
S = librosa.stft(y)
print(f"shakl {S.shape}  turi {S.dtype}")
print(f"kirish {y.nbytes/1024/1024:.2f} MB -> STFT {S.nbytes/1024/1024:.2f} MB")
```

```
shakl (1025, 2026)  turi complex64
kirish 3.96 MB -> STFT 15.84 MB          💥 4.01×
```

| O'lcham | Ma'nosi |
|---|---|
| `1025` | Chastota **binlari** = `n_fft/2 + 1` |
| `2026` | Vaqt **freymlari** = `len(y)/hop + 1` |
| `complex64` | ## ⭐ **amplituda + faza** |

> ## 💥 **XOTIRA 4× O'SADI.** ## Har bir namuna → **1025 ta murakkab son** ## (lekin `hop=512` bo'lgani uchun freymlar 512× kam).

### 🔬 `n_fft` — asosiy murosa

```python
for n_fft in [512, 1024, 2048, 4096]:
    S = librosa.stft(y, n_fft=n_fft)
    print(f"n_fft={n_fft:5d} shakl {str(S.shape):14s} "
          f"bin {srate/n_fft:7.2f} Hz  oyna {n_fft/srate*1000:6.2f} ms")
```

| `n_fft` | Shakl | Xotira | ## Chastota aniqligi | ## Vaqt aniqligi |
|---|---|---|---|---|
| 512 | `(257, 8101)` | 15.88 MB | ## 💥 **86.13 Hz** | ## ⭐ **11.61 ms** |
| 1024 | `(513, 4051)` | 15.86 MB | 43.07 Hz | 23.22 ms |
| ## **2048** *(standart)* | `(1025, 2026)` | 15.84 MB | ## **21.53 Hz** | ## **46.44 ms** |
| 4096 | `(2049, 1013)` | 15.84 MB | ## ⭐ **10.77 Hz** | ## 💥 **92.88 ms** |

> ## 🔑 **XOTIRA DEYARLI O'ZGARMAYDI** *(15.84–15.88 MB)* — ## chunki binlar ko'paysa, freymlar kamayadi.
>
> ## ⚠️ **BU — GEYZENBERG NOANIQLIGI:** ## chastotani aniq bilsangiz, **vaqtni** aniq bilmaysiz. ## 55-modulda buni STFT nazariyasida ko'rgan edik.

| Vazifa | Tavsiya |
|---|---|
| Nutq *(fonemalar qisqa)* | ## ⭐ **512–1024** |
| Musiqa *(notalar uzun)* | 2048–4096 |
| ## Shovqin tahlili | ## ⭐ **2048** — muvozanat |

---

## 3. 💥💥 `amplitude_to_db()` ning **yashirin** `top_db=80`

```python
a = librosa.amplitude_to_db(np.abs(S), ref=np.max)             # standart
b = librosa.amplitude_to_db(np.abs(S), ref=np.max, top_db=None)  # kesishsiz

print(f"top_db=80  : min {a.min():8.2f}  max {a.max():.2f} dB")
print(f"top_db=None: min {b.min():8.2f}  max {b.max():.2f} dB")
print(f"kesilgan: {(b < -80).mean()*100:.2f}%")
```

```
top_db=80  : min   -80.00  max 0.00 dB
top_db=None: min  -142.03  max 0.00 dB
kesilgan: 32.40%
```

> ## 💥💥💥 **MA'LUMOTLARINGIZNING 32.4% I JIMGINA `-80` GA TENGLASHTIRILADI.**
>
> ## ## 🔑 **HAQIQIY DINAMIK DIAPAZON — 142 dB, 80 dB EMAS.**

| Nima | Standart | Haqiqiy |
|---|---|---|
| Eng past qiymat | −80.00 dB | ## 💥 **−142.03 dB** |
| Kesilgan hujayralar | — | ## 💥 **32.40%** |

> ## ⚠️ **QACHON MUHIM:**
>
> | Vaziyat | Ta'sir |
> |---|---|
> | **Vizualizatsiya** | ## ✅ **muammo yo'q** — ko'z 80 dB dan ko'pini ajratmaydi |
> | ## **Xususiyat ajratish** | ## 💥 **ma'lumot yo'qoladi** |
> | ## **Shovqin profilini o'lchash** | ## 💥 **jim zonalar tekislanadi** |
> | **Modelga kirish** | ## ⚠️ **modelga qarab** |

> ## ⭐ **QOIDA:** ## Rasm chizsangiz — `top_db=80` **qoldiring**. ## Raqam hisoblasangiz — ## `top_db=None` **yozing**.

---

## 4. ⭐ `ref=np.max` nima qiladi?

```python
S_db = librosa.amplitude_to_db(np.abs(S), ref=np.max)
```

`ref` — **0 dB nima ekanini** belgilaydi.

| `ref` | 0 dB = | Natija |
|---|---|---|
| `np.max` | Fayldagi eng baland nuqta | ## ⭐ **hamma qiymat ≤ 0** |
| `1.0` | To'liq shkala *(dBFS)* | Mutlaq qiymatlar |
| `np.median` | Medial daraja | Nisbatan |

> ## ⚠️ **`ref=np.max` — NISBIY.** ## Ikkita **turli balandlikdagi** faylni ## shu shkalada taqqoslab **bo'lmaydi**. ## ## ⭐ Taqqoslash uchun `ref=1.0` ishlating.

---

## 5. 🔬 Kursning spektrogramma o'qishi — tekshiramiz

> ## 🔑 **KURS AYTADI:** *"64–256 Hz orasidagi sarg'ish ranglar — eng baland. ## Ular inson nutqining asosiy chastotasiga mos keladi."*

### ✅ Tasdiqlaymiz

55-modulda o'lchagan edik: `f0` mediali = **138.2 Hz**. Bu **64–256 Hz** oralig'ida.

Va bu darsda o'lchadik: nutq energiyasining **50.12%** i **0–300 Hz** da.

> ## ✅ **KURS TO'G'RI.**

> ## 🔑 **KURS AYTADI:** *"Oxirgi 1–2 soniyada deyarli shovqin yo'q. ## Yo'qolgan chastotalar asosan 512–2048 Hz va yuqorida."*

### ✅ Bu ham to'g'ri

| Zona | Boshi *(shovqin)* | Oxiri *(toza)* |
|---|---|---|
| 300–1000 Hz | 42.39% | ## ⭐ **8.72%** |
| 1000–2000 Hz | 30.81% | ## ⭐ **1.98%** |

---

## 6. ⭐⭐ Spektrogramma turlari — qaysi birini tanlash?

```python
import time

for nom, f in [("stft (chiziqli)", lambda: np.abs(librosa.stft(y))),
               ("mel (128)", lambda: librosa.feature.melspectrogram(y=y, sr=srate, n_mels=128)),
               ("mel (80)",  lambda: librosa.feature.melspectrogram(y=y, sr=srate, n_mels=80)),
               ("CQT",       lambda: np.abs(librosa.cqt(y, sr=srate)))]:
    t0 = time.perf_counter(); M = f(); dt = (time.perf_counter() - t0) * 1000
    print(f"{nom:16s} {str(M.shape):14s} {M.nbytes/1024/1024:6.2f} MB {dt:8.1f} ms")
```

| Tur | Shakl | Xotira | Vaqt | Qachon |
|---|---|---|---|---|
| ## STFT chiziqli | `(1025, 2026)` | ## 💥 **7.92 MB** | 622.7 ms | ## ⭐ **Shovqin tahlili** |
| ## Mel (128) | `(128, 2026)` | ## ⭐ **0.99 MB** | ## ⭐ **75.3 ms** | Model kirishi |
| ## Mel (80) | `(80, 2026)` | ## 🏆 **0.62 MB** | ## 🏆 **72.2 ms** | ## ⭐ **Whisper** |
| CQT | `(84, 2026)` | 0.65 MB | 306.0 ms | Musiqa |

> ## 🏆 **MEL (80) — STFT DAN 12.8× KICHIK VA 8.6× TEZ.**
>
> ## ⭐ **VA AYNAN SHU — WHISPER NING KIRISHI** ## *(56-modulda `(1, 80, 3000)` shaklini ko'rgan edik)*.

> ## ⚠️ **LEKIN SHOVQIN TAHLILI UCHUN — CHIZIQLI STFT.** ## Mel shkalasi past chastotalarni **cho'zadi**, ## yuqorilarini **siqadi** — ## shovqinning aniq chastotasini **topib bo'lmaydi**.

---

## 7. 🔧 Foydali funksiya — taqqoslovchi spektrogramma

```python
import numpy as np, librosa, librosa.display
import matplotlib.pyplot as plt


def spektr_taqqosla(signallar, srate, sarlavhalar=None, n_fft=2048,
                    top_db=80, y_axis="log", saqla=None):
    """Bir nechta signalni yonma-yon spektrogramma qilib chizadi."""
    n = len(signallar)
    sarlavhalar = sarlavhalar or [f"signal {i+1}" for i in range(n)]

    fig, axes = plt.subplots(n, 1, figsize=(12, 3.2 * n), squeeze=False)
    im = None
    for ax, sig, nom in zip(axes[:, 0], signallar, sarlavhalar):
        S = librosa.stft(sig, n_fft=n_fft)
        db = librosa.amplitude_to_db(np.abs(S), ref=np.max, top_db=top_db)
        im = librosa.display.specshow(db, sr=srate, x_axis="time",
                                      y_axis=y_axis, ax=ax)
        rms = 20 * np.log10(np.sqrt(np.mean(sig ** 2)) + 1e-12)
        ax.set(title=f"{nom}   ·   RMS {rms:.2f} dBFS")
    fig.colorbar(im, ax=axes, format="%+2.0f dB")
    if saqla:
        fig.savefig(saqla, dpi=110, bbox_inches="tight")
    return fig


def zona_energiyasi(sig, srate, zonalar=None, n_fft=2048):
    """Chastota zonalari bo'yicha energiya ulushini qaytaradi."""
    zonalar = zonalar or [(0, 300), (300, 1000), (1000, 2000),
                          (2000, 4000), (4000, 8000), (8000, 24000)]
    S = np.abs(librosa.stft(sig, n_fft=n_fft))
    freq = librosa.fft_frequencies(sr=srate, n_fft=n_fft)
    sp = S.mean(axis=1)
    tot = (sp ** 2).sum()
    return {f"{lo}-{hi} Hz": round(float((sp[(freq >= lo) & (freq < hi)] ** 2).sum()
                                         / tot * 100), 2)
            for lo, hi in zonalar}
```

```python
import json
y, srate = librosa.load("speech_01.wav", sr=None)
print(json.dumps(zona_energiyasi(y, srate), indent=2))
```

```
{
  "0-300 Hz": 52.87,
  "300-1000 Hz": 27.17,
  "1000-2000 Hz": 9.99,
  "2000-4000 Hz": 3.16,
  "4000-8000 Hz": 3.96,
  "8000-24000 Hz": 2.85
}
```

> ## ⭐ **BUTUN FAYL BO'YICHA:** ## 52.87% — 0–300 Hz *(asosiy ton)*, ## 37.16% — 300–2000 Hz *(shovqin + formantlar)*.

---

## 8. ⚠️ Tez-tez uchraydigan xatolar

| Xato | Nima bo'ladi | To'g'ri |
|---|---|---|
| `specshow(S)` — `abs()` siz | ## 💥 `ComplexWarning` yoki xato | `np.abs(S)` |
| `specshow(np.abs(S))` — dB siz | ## 💥 **hamma narsa qora** | `amplitude_to_db()` |
| `power_to_db(np.abs(S))` | ## ⚠️ **2× noto'g'ri shkala** | `amplitude_to_db()` |
| `amplitude_to_db(S**2)` | ## ⚠️ **2× noto'g'ri** | `power_to_db(S**2)` |
| `sr=` berilmagan | ## 💥 **vaqt o'qi noto'g'ri** | `sr=sample_rate` |
| `y_axis="linear"` | ## ⚠️ past chastotalar **siqiladi** | `y_axis="log"` |

> ## 🔑 **`amplitude_to_db` vs `power_to_db`:**
>
> ```
>   amplitude_to_db(x)  =  20 · log10(x)        ← |STFT| uchun
>   power_to_db(x)      =  10 · log10(x)        ← |STFT|² uchun
> ```
>
> ## 💥 **ADASHTIRSANGIZ — HAMMA dB QIYMATI 2× NOTO'G'RI.**

---

## 🎯 Nazorat savollari

1. `librosa.stft()` nima qaytaradi va nega `np.abs()` kerak?
2. `amplitude_to_db()` standart holda ma'lumotning qanchasini kesadi?
3. `n_fft` ni oshirsangiz nima yaxshilanadi, nima yomonlashadi?
4. Nima uchun xotira `n_fft` ga deyarli bog'liq emas?
5. Shovqin tahlili uchun mel spektrogramma nega mos emas?
6. `amplitude_to_db` va `power_to_db` farqi nima?

<details>
<summary>Javoblar</summary>

1. **Murakkab sonlar** matritsasi `(1025, 2026)`, `complex64` — har bir hujayrada **amplituda va faza**. Bizga faqat amplituda kerak, shuning uchun `np.abs()`.
2. ## **32.40%** — `top_db=80` standart qiymati barcha `< −80 dB` qiymatlarni `−80` ga tenglashtiradi. Haqiqiy eng past — **−142.03 dB**. Raqam hisoblasangiz `top_db=None` yozing.
3. **Chastota** aniqligi yaxshilanadi (21.53 → 10.77 Hz), **vaqt** aniqligi yomonlashadi (46.44 → 92.88 ms). Geyzenberg noaniqligi.
4. Binlar soni `n_fft/2+1` ga **o'sadi**, freymlar soni `len(y)/hop` ga **kamayadi** — ko'paytma deyarli o'zgarmaydi (15.84–15.88 MB).
5. Mel shkalasi past chastotalarni **cho'zadi**, yuqorilarini **siqadi**. Shovqinning **aniq chastotasini** (masalan 2261 Hz) topib bo'lmaydi. Model kirishi uchun esa **ideal** — 12.8× kichik.
6. `amplitude_to_db = 20·log10(x)` — **amplituda** uchun. `power_to_db = 10·log10(x)` — **quvvat** (`|S|²`) uchun. Adashtirilsa hamma dB qiymati **2× noto'g'ri**.

</details>

---

⬅️ [1-dars](01-Understanding-Noise.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Dealing-with-Background-Noise.md)
