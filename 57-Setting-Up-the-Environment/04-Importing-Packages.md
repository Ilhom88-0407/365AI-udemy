# 4-dars. Paketlarni import qilish ⭐

## 🎬 Boshlashdan oldin

> **"Import qatorlari — bu shunchaki formallik emas. Ular loyihangizning bog'liqlik xaritasi."**

---

## 1. Kursning import bloki

```python
import numpy as np
import matplotlib.pyplot as plt
import librosa
import librosa.display
import soundfile as sf
import speech_recognition as sr
import jiwer
import IPython.display as ipd
import whisper                       # 💥 ffmpeg kerak
import csv, os, tempfile, wave
from gtts import gTTS
```

> ## ⚠️ **BU RO'YXATDA IKKITA MUAMMO BOR:**
> ```
> ① import whisper  →  💥 ffmpeg SHART (3-dars)
> ② hamma narsa BIR CHAKKADA import qilinadi
>    →  ⚠️ torch + whisper yuklash ~10 s oladi
> ```

---

## 2. ⭐ Bizning versiya

```python
# ── standart kutubxona ──
import os, csv, json, time, tempfile, wave
from pathlib import Path

# ── ilmiy ──
import numpy as np
import pandas as pd
import scipy.signal as sig
import matplotlib.pyplot as plt

# ── audio ──
import soundfile as sf
import librosa
import librosa.display

# ── transkripsiya (⭐ ffmpeg kerak emas) ──
from transformers import pipeline

# ── baholash ──
import jiwer

# ── Jupyter ──
from IPython.display import Audio, display
```

> ## ⭐ **`from transformers import pipeline`** — ## kursning `import whisper` o'rniga.
>
> ## 💡 **VA GURUHLARGA BO'LING** — ## bu shunchaki chiroylilik emas: ## **qaysi paket nima uchun** kerakligi **ko'rinib turadi**.

---

## 3. ⭐⭐ Import narxi — o'lchangan

> ## ⚠️ **AVVAL BITTA METODOLOGIK OGOHLANTIRISH.**
>
> ## 💥 **MEN DASTLAB SHUNDAY O'LCHAGAN EDIM:**
> ```python
> for k in list(sys.modules):        # 💥 modulni "tozalash"
>     if k.startswith(m):
>         del sys.modules[k]
> t0 = time.perf_counter()
> importlib.import_module(m)
> ```
>
> ## 💥 **BU USUL YOLG'ON NATIJA BERADI:** ## `librosa` uchun **3.7 ms** ko'rsatdi — ## chunki uning bog'liqliklari **allaqachon yuklangan** edi, ## va `del sys.modules[...]` C-kengaytmalarni **tozalamaydi**.
>
> ## ✅ **YAGONA TO'G'RI USUL — ALOHIDA JARAYON:**

```python
import subprocess, sys, time

MODULLAR = ["numpy", "pandas", "scipy", "matplotlib.pyplot",
            "soundfile", "librosa", "jiwer", "torch",
            "transformers", "speech_recognition"]

print("  modul                  vaqt (alohida jarayonda)")
for m in MODULLAR:
    q = []
    for _ in range(2):                    # ⭐ eng tezini olamiz
        t0 = time.perf_counter()
        subprocess.run([sys.executable, "-c", f"import {m}"],
                       capture_output=True)
        q.append(time.perf_counter() - t0)
    dt = min(q)
    belgi = "💥" if dt > 2.0 else ("⚠️" if dt > 1.0 else "✅")
    print(f"  {belgi} {m:22s} {dt*1000:8.1f} ms")
```

```
  modul                  vaqt (alohida jarayonda)
  ✅ numpy                   147.4 ms
  ✅ pandas                  616.2 ms
  ✅ scipy                   183.4 ms
  ✅ matplotlib.pyplot       555.6 ms
  ✅ soundfile               162.6 ms
  ✅ librosa                  37.8 ms   ⭐ ?!
  ✅ jiwer                    93.7 ms
  ⚠️ torch                  1847.0 ms
  💥 transformers           4120.7 ms
  ✅ speech_recognition      138.8 ms

  bo'sh Python jarayoni: 27.2 ms   (bu HAMMA qatorga kiradi)
```

> ## 🤔 **`librosa` — 37.8 ms? `numpy` DAN 4× TEZ? BU QANDAY MUMKIN?**
>
> ## 🔬 **TEKSHIRAMIZ:**
> ```python
> KODLAR = {
>     "import librosa":            "import librosa",
>     "import librosa + load()":   "import librosa; "
>                                  "librosa.load('speech_01.wav', sr=16000)",
>     "import librosa + mfcc()":   "...; librosa.feature.mfcc(y=y, sr=s)",
>     "import transformers":       "import transformers",
>     "transformers + pipeline":   "from transformers import pipeline",
> }
> ```
> ```
>   import librosa                 37.3 ms
>   import librosa + load()      1155.1 ms    💥 31× ko'p
>   import librosa + mfcc()      1914.8 ms    💥 51× ko'p
>   import transformers          4067.2 ms
>   transformers + pipeline      9525.3 ms    💥 2.3× ko'p
> ```
>
> ## 🏆🏆 **JAVOB — `lazy_loader`.** ## `librosa 1.0` bog'liqliklarni *(numba, scipy, soundfile)* ## **import paytida emas**, ## **birinchi ishlatishda** yuklaydi.
>
> ## 🔑 **YA'NI "IMPORT VAQTI" ALDAMCHI KO'RSATKICH.** ## Haqiqiy narx — **birinchi funksiya chaqiruvida**.
>
> ## 💥 **`transformers` DA HAM SHUNDAY:** ## `import transformers` **4.1 s**, ## lekin `from transformers import pipeline` — **9.5 s**.
>
> ## 🏆 **AMALIY MASLAHAT — KECHIKTIRILGAN IMPORT:**
> ```python
> # ❌ fayl boshida
> from transformers import pipeline           # 💥 9.5 s
>
> # ✅ faqat KERAK bo'lganda
> def transkripsiya(y, sr):
>     from transformers import pipeline       # ⭐ 9.5 s KECHIKTIRILDI
>     asr = pipeline("automatic-speech-recognition",
>                    model="openai/whisper-tiny")
>     return asr(y)["text"]
> ```
> ## 💡 **BU — CLI vositalarda AYNIQSA muhim:** ## `--help` ni ko'rsatish uchun `transformers` **kerak emas**.
>
> ## ⚠️ **LEKIN JUPYTER'DA BU KAM AHAMIYATLI** — ## yadro **bir marta** yuklanadi va **ochiq qoladi**.

---

## 4. ⭐ `librosa.display` — alohida import

```python
import librosa
import librosa.display        # ⭐ ALOHIDA — avtomatik kelmaydi
```

> ## 💥 **ENG KO'P UCHRAYDIGAN XATO:**
> ```python
> import librosa
> librosa.display.specshow(...)     # 💥 AttributeError
> ```
> ## 🔑 **SABAB:** `librosa.display` — **ixtiyoriy** submodul, ## u `matplotlib` ga bog'liq va ## **avtomatik yuklanmaydi**.

---

## 5. ⭐⭐ Jupyter'da audio tinglash

```python
from IPython.display import Audio, display
import librosa

y, sr = librosa.load("speech_01.wav", sr=16000)

display(Audio(y, rate=sr))               # ⭐ numpy massivdan
display(Audio("speech_01.wav"))          # ⭐ fayldan
```

> ## 🏆 **`Audio(y, rate=sr)` — ENG FOYDALI JUPYTER VOSITASI.** ## Har o'zgartirishdan keyin **darhol tinglash** mumkin.
>
> ## ⚠️ **UCHTA NOZIK JIHAT:**
> ```
> ① rate= ni UNUTMANG  →  aks holda 22050 deb hisoblanadi
> ② stereo uchun shakl (2, n) bo'lishi kerak — (n, 2) EMAS
> ③ qiymatlar -1..1 oralig'ida bo'lsin
>    →  💥 aks holda Audio ularni O'ZI normallashtiradi
>       va siz HAQIQIY balandlikni eshitmaysiz
> ```
>
> ## 💡 **③ — MUHIM TUZOQ:** ## `Audio` **doim** normallashtiradi, ## shuning uchun **jim** va **baland** faylni ## **bir xil** eshitasiz.
> ```python
> # ⭐ haqiqiy balandlikni eshitish uchun:
> display(Audio(y, rate=sr, normalize=False))
> ```

---

## 6. 🇺🇿 Amaliy: loyihaning "bosh" fayli

```python
"""🇺🇿 Nutqni tanish loyihasi — umumiy importlar va sozlamalar."""

import os, csv, json, time
from pathlib import Path

import numpy as np
import pandas as pd
import soundfile as sf
import librosa

# ⭐ ogohlantirishlarni o'chiramiz (librosa ko'p chiqaradi)
import warnings
warnings.filterwarnings("ignore")

# ⭐ Windows da konsol kodlashi
if os.name == "nt":
    os.environ.setdefault("PYTHONIOENCODING", "utf-8")

# ── umumiy sozlamalar ──
SR = 16000                 # ⭐ Whisper standarti
NW, NH = 400, 160          # ⭐ 25 ms / 10 ms
N_FFT = 512
MODEL = "openai/whisper-tiny"


def audio_yukla(yol, sr=SR):
    """⭐ Bitta joyda — hamma fayl BIR XIL usulda o'qiladi."""
    y, _ = librosa.load(yol, sr=sr, mono=True)
    y = y - float(y.mean())                        # DC siljish
    rms = float(np.sqrt((y ** 2).mean()))
    if rms > 1e-9:
        y = y * (10 ** (-20 / 20) / rms)           # RMS -20 dBFS
        if np.abs(y).max() > 0.99:
            y = y / np.abs(y).max() * 0.99
    return y.astype(np.float32), sr


_asr = None


def asr_model(model=MODEL):
    """⭐ Model FAQAT bir marta yuklanadi (lazy singleton)."""
    global _asr
    if _asr is None:
        from transformers import pipeline          # ⭐ kechiktirilgan
        t0 = time.perf_counter()
        _asr = pipeline("automatic-speech-recognition", model=model)
        print(f"  ⏱️ model yuklandi: {time.perf_counter()-t0:.1f} s")
    return _asr


def transkripsiya(yol, til="en"):
    y, sr = audio_yukla(yol)
    return asr_model()(y.copy(),
                       generate_kwargs={"language": til})["text"].strip()
```

> ## 🏆 **`_asr` SINGLETON — ENG MUHIM DETAL.** ## Modelni **har chaqiruvda** yuklash — ## 💥 **har fayl uchun +4 soniya**.
>
> ## 🔬 **O'LCHANGAN FARQ:**
> ```
> 100 fayl · har safar yuklash  →  100 × 4.3 s = 430 s  💥
> 100 fayl · singleton bilan    →  1 × 4.3 s   =   4 s  ⭐
> ```
>
> ## ⭐ **VA `audio_yukla()` — BIR XILLIK KAFOLATI:** ## hamma fayl **bir xil** sample rate, ## **bir xil** normallashtirish bilan o'qiladi. ## 💡 Aks holda natijalarni **taqqoslab bo'lmaydi**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun `librosa.display` alohida import qilinadi?

**M2.** `Audio(y, rate=sr)` da `rate` ni unutsangiz nima bo'ladi?

**M3.** Qaysi modul eng sekin import bo'ladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## U — **ixtiyoriy submodul**, `matplotlib` ga bog'liq, ## va **avtomatik yuklanmaydi**.

**M2.** ## Sukut **22050 Hz** deb hisoblanadi → ## 💥 audio **noto'g'ri tezlikda** eshitiladi.

**M3.** ## `transformers` — **4.12 s**. ## ⚠️ Lekin `from transformers import pipeline` — **9.53 s**.

</details>

### 🟡 O'rta

**M4.** ⭐ Import vaqtini o'lchang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 3-bo'limdagi kodni ishga tushiring, so'ng **`-X importtime`** bilan chuqurroq:

```bash
python -X importtime -c "import librosa" 2>&1 | tail -15
python -X importtime -c "import torch" 2>&1 | tail -15
```

## 💡 **`-X importtime` — HAR SUBMODULNI ALOHIDA KO'RSATADI.** ## Sekinlik **qayerdan** kelayotganini aniq topasiz.

## ⚠️ **VA `librosa` DA SIZ DEYARLI HECH NARSA KO'RMAYSIZ** — ## u `lazy_loader` ishlatadi. ## 🏆 Haqiqiy narxni ko'rish uchun **funksiyani chaqiring**:
```bash
python -X importtime -c "import librosa; librosa.load('speech_01.wav')" 2>&1 | tail -15
```

</details>

**M5.** ⭐⭐ Kechiktirilgan importning foydasini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import subprocess, sys, time

TEZ = '''
import numpy as np, soundfile as sf
print("tayyor")
'''

SEKIN = '''
import numpy as np, soundfile as sf
import torch
from transformers import pipeline
print("tayyor")
'''

for nom, kod in [("kechiktirilgan", TEZ), ("hammasi birdan", SEKIN)]:
    q = []
    for _ in range(3):
        t0 = time.perf_counter()
        subprocess.run([sys.executable, "-c", kod],
                       capture_output=True)
        q.append(time.perf_counter() - t0)
    print(f"  {nom:18s} {min(q):.2f} s")
```

## 🏆 **CLI VOSITADA BU FARQ — FOYDALANUVCHI HIS QILADIGAN NARSA.** ## `--help` uchun **6 soniya kutish** — qabul qilib bo'lmaydi.

</details>

**M6.** ⭐⭐ `Audio` normallashtirishini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np, librosa
from IPython.display import Audio, display

y, sr = librosa.load("speech_01.wav", sr=16000)
jim = y * 0.05                                   # ⭐ 26 dB tinchroq

print(f"  asl  RMS {20*np.log10(np.sqrt((y**2).mean())):+.1f} dBFS")
print(f"  jim  RMS {20*np.log10(np.sqrt((jim**2).mean())):+.1f} dBFS")

print("\n  ① normalize=True (sukut) — IKKALASI BIR XIL eshitiladi:")
display(Audio(y, rate=sr))
display(Audio(jim, rate=sr))

print("\n  ② normalize=False — HAQIQIY farq eshitiladi:")
display(Audio(y, rate=sr, normalize=False))
display(Audio(jim, rate=sr, normalize=False))
```

## 💥 **`normalize=True` (SUKUT) — JIM VA BALAND FAYLNI BIR XIL QILADI.**

## 🏆 **AUDIO DARAJASINI BAHOLASH UCHUN DOIM `normalize=False`.**

</details>

---

## 📌 Xulosa

```python
import numpy as np, pandas as pd
import soundfile as sf, librosa, librosa.display
from transformers import pipeline          # ⭐ import whisper EMAS
import jiwer
from IPython.display import Audio, display
```

```
🔬 IMPORT VAQTI (alohida jarayonda o'lchangan):
   transformers       4120.7 ms   💥 eng sekin
   torch              1847.0 ms   ⚠️
   pandas              616.2 ms
   matplotlib.pyplot   555.6 ms
   numpy               147.4 ms   ✅
   librosa              37.8 ms   ⭐ ?! — lazy_loader

💥 VA "IMPORT VAQTI" ALDAMCHI:
   import librosa               37.3 ms
   import librosa + load()    1155.1 ms   💥 31×
   import librosa + mfcc()    1914.8 ms   💥 51×
   transformers + pipeline    9525.3 ms   💥 2.3×

⭐ CLI vositalarda KECHIKTIRILGAN import ishlating
⭐ modelni SINGLETON qiling — 100 faylda 430 s → 4 s
💥 librosa.display — ALOHIDA import
💥 Audio(...) — normalize=False bo'lmasa darajani ESHITMAYSIZ
```

---

⬅️ [3-dars. Paketlarni o'rnatish](03-Installing-Packages.md) · 🏠 [Modul boshiga](README.md) · ➡️ [⚡ Mashqlar](MASHQLAR.md)
