# 2-dars. Jupyter'da audio faylni import qilish ⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: eng baland joylar maksimumning 75% iga yetadi. Biz sanadik — 0.75 dan oshgan namunalar soni 1 036 871 tadan ATIGI BITTA."**

---

## 1. Uch qatorlik boshlanish

```python
import librosa
import librosa.display
import matplotlib.pyplot as plt
from IPython.display import Audio

audio_signal, sample_rate = librosa.load("speech_01.wav", sr=None)
print(sample_rate)
```

```
44100
```

> ## 🔑 **`sr=None` — ENG MUHIM ARGUMENT.** ## Usiz `librosa` faylni **jimgina 22 050 Hz ga tushiradi**. ## Kurs buni to'g'ri ta'kidlaydi — va bu **haqiqatan** muhim.

### 🔬 Farqni o'lchaymiz

```python
for s in [None, 22050]:
    z, ss = librosa.load("speech_01.wav", sr=s)
    print(f"sr={str(s):6s} -> {ss:6d} Hz  {len(z):8d} namuna  {z.nbytes/1024/1024:.2f} MB")
```

| `sr` | Natijaviy chastota | Namunalar | Xotira |
|---|---|---|---|
| `None` | ## ⭐ **44 100 Hz** | 1 036 871 | 3.96 MB |
| *(ko'rsatilmasa)* | ## 💥 **22 050 Hz** | 518 436 | 1.98 MB |

> ## ⚠️ **JIMGINA YARIM MA'LUMOT YO'QOLADI.** ## 54-modulda ko'rganimizdek, ## 22 050 Hz → Nayquist **11 025 Hz**. ## Nutq uchun bu **yetarli**, lekin siz buni **bilib** tanlashingiz kerak.

---

## 2. ⭐ `load()` nima qaytaradi?

```python
print(f"turi   = {audio_signal.dtype}")
print(f"shakl  = {audio_signal.shape}")
print(f"diskda = {os.path.getsize('speech_01.wav')/1024/1024:.2f} MB")
print(f"xotirada = {audio_signal.nbytes/1024/1024:.2f} MB")
```

```
turi   = float32
shakl  = (1036871,)
diskda = 2.97 MB
xotirada = 3.96 MB
```

> ## 💡 **XOTIRADA DISKDAN KATTA!** ## Faylda `PCM_24` — namunasiga **3 bayt**. ## Xotirada `float32` — namunasiga **4 bayt**. ## ## 🔑 **Nisbat aynan 4/3 = 1.333** → 2.97 × 1.333 = **3.96 MB** ✅

| Nima | Qiymat |
|---|---|
| Massiv turi | `float32` *(har doim, kirish qanday bo'lsa ham)* |
| Shakl | `(N,)` — **mono**, `(2, N)` — stereo `mono=False` bilan |
| Diapazon | ## ⭐ **`[-1.0, +1.0]`** ga normallashtirilgan |

### ⏱️ Va yana bir 57-modul darsi

```python
import time
t0 = time.perf_counter(); y, s = librosa.load("speech_01.wav", sr=None)
print(f"birinchi: {(time.perf_counter()-t0)*1000:.1f} ms")

t0 = time.perf_counter(); y, s = librosa.load("speech_01.wav", sr=None)
print(f"ikkinchi: {(time.perf_counter()-t0)*1000:.1f} ms")
```

```
birinchi: 932.6 ms
ikkinchi:   6.1 ms          # ⭐ 153× tez
```

> ## 🏆 **`lazy_loader` YANA.** ## Birinchi `load()` `librosa` ning ichki bog'liqliklarini yuklaydi. ## Ikkinchisi — **sof o'qish**. ## Vaqt o'lchayotganda **birinchi chaqiruvni tashlab yuboring**.

---

## 3. To'lqin shaklini chizamiz

```python
plt.figure(figsize=(12, 4))
librosa.display.waveshow(audio_signal, sr=sample_rate)
plt.title("To'lqin shakli")
plt.xlabel("Vaqt (s)")
plt.ylabel("Amplituda")
plt.tight_layout()
plt.show()

Audio("speech_01.wav")        # ⭐ Jupyter'da pleyer
```

```
        amplituda
     +1.0 ┤
          │        ▏
     +0.5 ┤       ▐▌      ▗▖   ▗▖  ▗▄▖   ▗▖
          │   ▗▄▄▄███▄▄▄▄▄██▄▄▄██▄▄███▄▄▄██▄▄▄▖
      0.0 ┼───████████████████████████████████────
          │   ▝▀▀▀███▀▀▀▀▀██▀▀▀██▀▀▀███▀▀▀██▀▀▀▘
     -0.5 ┤       ▝▌      ▝▘   ▝▘  ▝▀▘   ▝▘
          │
     -1.0 ┤
          └──┬────┬────┬────┬────┬────┬───►  vaqt (s)
             0    5    10   15   20   23.5
```

---

## 4. 💥 Kursning "±0.75" da'vosi

> ## 🔑 **KURS AYTADI:** *"−0.75 dan 0.75 gacha qiymatlarni ko'rganimizda, audioning eng baland qismlari maksimal amplitudaning 75% iga yetadi."*

### 🔬 Sanaymiz

```python
import numpy as np

print(f"min = {y.min():+.6f}   max = {y.max():+.6f}")
for p in [50, 90, 99, 99.9, 100]:
    print(f"  {p:5.1f}-protsentil |y| = {np.percentile(np.abs(y), p):.4f}")
print(f"  |y| > 0.75: {(np.abs(y) > 0.75).sum()} namuna "
      f"({(np.abs(y) > 0.75).mean()*100:.4f}%)")
```

```
min = -0.736284   max = +0.855551
   50.0-protsentil |y| = 0.0449
   90.0-protsentil |y| = 0.1641
   99.0-protsentil |y| = 0.2845
   99.9-protsentil |y| = 0.4058
  100.0-protsentil |y| = 0.8556
  |y| > 0.75: 1 namuna (0.0001%)
```

> ## 💥💥 **MAKSIMUM 0.75 EMAS — 0.8556.**
>
> ## 💥 **VA 0.75 DAN OSHGAN NAMUNALAR SONI — 1 036 871 TADAN BITTA.**
>
> ## ## 🔑 **YA'NI GRAFIKDAGI "±0.75" — BITTA CHO'QQI.** ## Signalning **99.9%** i `|y| < 0.41` ichida.

| Ko'rsatkich | Qiymat |
|---|---|
| Medial `|y|` | ## **0.0449** |
| 99-protsentil | 0.2845 |
| Maksimum | 0.8556 |
| ## Krest omili | ## ⭐ **9.03× = 19.11 dB** |
| Clipping *(`|y| ≥ 0.999`)* | ## ✅ **0 namuna** |
| RMS | 0.094742 = ## **−20.47 dBFS** |

> ## 💡 **NEGA BU MUHIM?** ## To'lqin grafigi **cho'qqilarni** ko'rsatadi, **tipik darajani** emas. ## Ko'zga *"baland"* ko'ringan signal aslida ## RMS bo'yicha **−20 dBFS** — ya'ni **jimgina**. ## ## ⭐ **Shuning uchun 55-modulda RMS ni o'lchaganmiz, ko'z bilan qaramaganmiz.**

### ✅ Kurs to'g'ri aytgan joyi

Kurs *"clipping"* ni tushuntiradi va bu **butunlay to'g'ri**:

```python
print(f"clipping: {(np.abs(y) >= 0.999).sum()} namuna")   # 0 ✅
```

> ## ✅ **BU FAYLDA CLIPPING YO'Q.** ## Kursning *"0.75 qiymati buzilishning oldini oladi"* degani — ## sabab-oqibat jihatidan **to'g'ri fikr**, ## faqat **raqami noto'g'ri**.

---

## 5. ⭐⭐ Nutq qachon boshlanadi?

> ## 🔑 **KURS AYTADI:** *"Grafik ko'rsatadiki, signal boshida tinchroq va 2–3 soniyadan keyin balandlashadi."*

### 🔬 Freym-bo'yicha RMS bilan tekshiramiz

```python
h = 512
rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=h)[0]
t = librosa.frames_to_time(np.arange(len(rms)), sr=sample_rate, hop_length=h)
db = 20 * np.log10(rms + 1e-12)

for lo, hi in [(0, 2), (2, 3), (3, 23.5)]:
    m = (t >= lo) & (t < hi)
    print(f"{lo:4.1f}-{hi:4.1f} s: o'rtacha RMS {db[m].mean():7.2f} dB")
```

```
 0.0- 2.0 s: o'rtacha RMS  -27.52 dB
 2.0- 3.0 s: o'rtacha RMS  -19.55 dB      ⭐ eng baland
 3.0-23.5 s: o'rtacha RMS  -26.89 dB
```

> ## ⚠️ **YARIM TO'G'RI.** ## 2–3 s **haqiqatan** eng baland — bu yerda **+7.97 dB** sakrash bor. ## ## 💥 **LEKIN KEYIN QAYTA TUSHADI:** 3 s dan keyin o'rtacha **−26.89 dB**, ## ya'ni boshidagi **−27.52 dB** ga **deyarli teng**.
>
> ## 🔑 **TO'G'RI TAVSIF:** ## *"2–3 s da bitta baland qism bor, qolgan nutq esa fon bilan bir xil darajada."* ## ## Bu **shovqinli fayl** ekanini tasdiqlaydi — 59-modulda shu bilan ishlaymiz.

| Ko'rsatkich | Qiymat |
|---|---|
| Freymlar | 2026 |
| Eng past freym | ## 💥 **−240.0 dB** *(raqamli nol!)* |
| Eng baland freym | −13.5 dB |
| Medial | −21.1 dB |

> ## 💡 **−240 dB — BU `1e-12` NING LOGARIFMI.** ## Ya'ni faylda **butunlay jim** freym bor. ## Bu odatda **fayl boshidagi to'ldiruvchi nol**lar.

---

## 6. 🔧 Foydali funksiya — audio pasporti

```python
import os
import numpy as np, librosa, soundfile as sf


def audio_pasport(yol, chastota=None):
    """Fayl haqida bilish kerak bo'lgan hamma narsani chiqaradi."""
    info = sf.info(yol)
    y, sr_ = librosa.load(yol, sr=chastota, mono=True)

    rms = float(np.sqrt(np.mean(y ** 2)))
    cho = float(np.abs(y).max())
    krest = cho / rms if rms > 0 else float("inf")

    h = 512
    fr = librosa.feature.rms(y=y, frame_length=2048, hop_length=h)[0]
    fdb = 20 * np.log10(fr + 1e-12)
    jim = float((fdb < fdb.max() - 40).mean())

    d = {
        "fayl": os.path.basename(yol),
        "MB_diskda": round(os.path.getsize(yol) / 1024 / 1024, 3),
        "MB_xotirada": round(y.nbytes / 1024 / 1024, 3),
        "chastota": sr_,
        "asl_chastota": info.samplerate,
        "subtype": info.subtype,
        "kanallar": info.channels,
        "soniya": round(len(y) / sr_, 3),
        "namunalar": len(y),
        "RMS_dBFS": round(20 * np.log10(rms + 1e-12), 2),
        "cho_qqi": round(cho, 4),
        "krest_dB": round(20 * np.log10(krest), 2),
        "clipping": int((np.abs(y) >= 0.999).sum()),
        "jim_ulush": round(jim, 3),
    }

    # ⚠️ ogohlantirishlar
    ogoh = []
    if d["clipping"] > 0:
        ogoh.append(f"💥 clipping: {d['clipping']} namuna")
    if d["RMS_dBFS"] < -35:
        ogoh.append(f"⚠️ juda jim ({d['RMS_dBFS']} dBFS)")
    if d["krest_dB"] > 22:
        ogoh.append(f"⚠️ krest yuqori ({d['krest_dB']} dB) — impulsli shovqin?")
    if d["kanallar"] > 1:
        ogoh.append("⚠️ stereo — mono ga aylantirildi")
    if d["asl_chastota"] < 16000:
        ogoh.append(f"⚠️ chastota past ({d['asl_chastota']} Hz)")
    d["ogohlantirish"] = ogoh or ["✅ muammo yo'q"]
    return d
```

```python
import json
print(json.dumps(audio_pasport("speech_01.wav"), indent=2, ensure_ascii=False))
```

```
{
  "fayl": "speech_01.wav",
  "MB_diskda": 2.967,
  "MB_xotirada": 3.955,
  "chastota": 44100,
  "asl_chastota": 44100,
  "subtype": "PCM_24",
  "kanallar": 1,
  "soniya": 23.512,
  "namunalar": 1036871,
  "RMS_dBFS": -20.47,
  "cho_qqi": 0.8556,
  "krest_dB": 19.11,
  "clipping": 0,
  "jim_ulush": 0.026,
  "ogohlantirish": [
    "✅ muammo yo'q"
  ]
}
```

---

## 7. ⚠️ `Audio()` haqida bir nechta nozik gap

```python
Audio("speech_01.wav")           # ① fayl yo'li
Audio(audio_signal, rate=44100)  # ② massiv + chastota SHART
```

| Xato | Nima bo'ladi |
|---|---|
| `Audio(y)` — `rate` siz | ## 💥 `TypeError` |
| `Audio(y, rate=22050)` — noto'g'ri | ## ⚠️ **ovoz sekin/tez** bo'ladi |
| Stereo `(2, N)` massiv | ## ✅ ishlaydi |
| Stereo `(N, 2)` massiv | ## 💥 **shovqin** — o'qni almashtiring |
| Juda uzun fayl | ## ⚠️ notebook `.ipynb` **shishadi** *(base64)* |

> ## 💡 **`Audio(y, rate=...)` MASSIVNI `.ipynb` FAYLIGA base64 QILIB YOZADI.** ## 23 soniyalik audio → notebook **≈ 4 MB** kattalashadi. ## ## ⭐ Uzun fayllar uchun `Audio("fayl.wav")` — **yo'l** bilan bering.

---

## 🎯 Nazorat savollari

1. `sr=None` bo'lmasa `librosa.load()` nima qiladi?
2. Nega xotiradagi hajm diskdagidan katta chiqdi?
3. Kursning "±0.75" da'vosi qanchalik to'g'ri?
4. Krest omili 19.11 dB nimani anglatadi?
5. Nutq 2–3 soniyada boshlanadimi?
6. `Audio(y)` nega xato beradi?

<details>
<summary>Javoblar</summary>

1. Faylni **jimgina 22 050 Hz** ga tushiradi — namunalarning yarmi yo'qoladi. Nutq uchun bu odatda yetarli, lekin **bilib** tanlash kerak.
2. Diskda `PCM_24` = **3 bayt/namuna**, xotirada `float32` = **4 bayt/namuna**. Nisbat 4/3 = 1.333 → 2.97 × 1.333 = 3.96 MB.
3. **Noto'g'ri.** Maksimum **0.8556**, 0.75 dan oshgan namunalar — **1 036 871 tadan 1 ta** (0.0001%). Signalning 99.9% i `|y| < 0.41` ichida. Fikr (*clipping bo'lmasligi kerak*) to'g'ri, **raqami** noto'g'ri.
4. Cho'qqi RMS dan **9.03×** baland. Nutq uchun bu **normal** (nutq impulsli). 22 dB dan yuqori bo'lsa — impulsli shovqin gumoni.
5. **Yarim to'g'ri.** 2–3 s eng baland (−19.55 dB), lekin **keyin qayta tushadi** (−26.89 dB), ya'ni boshidagi darajaga (−27.52 dB) deyarli teng. Bu **shovqinli fayl** ekanini ko'rsatadi.
6. `rate` majburiy argument — massivda chastota haqida ma'lumot yo'q. `Audio(y, rate=sr)` deb yozish kerak.

</details>

---

⬅️ [1-dars](01-Audio-File-Formats.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-SpeechRecognition-Google-API.md)
