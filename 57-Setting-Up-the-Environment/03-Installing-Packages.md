# 3-dars. Paketlarni o'rnatish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `ffmpeg` ni majburiy deydi. Biz uni o'rnatmadik — va hamma narsa ishladi."**

---

## 1. Kursning ro'yxati

```bash
pip install librosa
pip install SpeechRecognition
pip install jiwer
pip install matplotlib
pip install gTTS

# ⚠️ va eng murakkab qism:
# ① PyTorch (pytorch.org dan)
# ② Chocolatey (Windows paket menejeri)
# ③ choco install ffmpeg
# ④ pip install -U openai-whisper
```

> ## 💥💥 **`②` VA `③` — KURSNING ENG QIYIN QISMI.** ## Chocolatey **administrator huquqi** talab qiladi, ## va korporativ kompyuterlarda **ko'pincha taqiqlangan**.
>
> ## 🏆 **VA BIZ UNI UMUMAN O'RNATMAYMIZ.**

---

## 2. ⭐⭐⭐ `ffmpeg` haqiqatan kerakmi?

> ## 🔑 **KURS AYTADI:** *"Whisper turli audio formatlarni (WAV, MP3) qayta ishlash uchun FFmpeg ni talab qiladi."*
>
> ## ⚠️ **BU — `openai-whisper` PAKETI UCHUN TO'G'RI.** ## Lekin biz **boshqa yo'ldan** boramiz.

### 🔬 O'lchaymiz

```python
import shutil, soundfile as sf

print(f"  ffmpeg: {shutil.which('ffmpeg') or '💥 TOPILMADI'}")
print(f"\n  soundfile qo'llab-quvvatlaydigan formatlar:")
fm = sorted(sf.available_formats().keys())
print(f"    {', '.join(fm)}")
print(f"\n  MP3: {'✅' if 'MP3' in fm else '💥'} · "
      f"OGG: {'✅' if 'OGG' in fm else '💥'} · "
      f"FLAC: {'✅' if 'FLAC' in fm else '💥'}")
```

```
  ffmpeg: 💥 TOPILMADI

  soundfile qo'llab-quvvatlaydigan formatlar:
    AIFF, AU, AVR, CAF, FLAC, HTK, IRCAM, MAT4, MAT5, MP3, MPC2K,
    NIST, OGG, PAF, PVF, RAW, RF64, SD2, SDS, SVX, VOC, W64, WAV,
    WAVEX, WVE, XI

  MP3: ✅ · OGG: ✅ · FLAC: ✅
```

> ## 🏆🏆 **`soundfile 0.14` MP3 NI O'ZI QO'LLAB-QUVVATLAYDI — `ffmpeg` KERAK EMAS.**
>
> ## 🔬 **VA BUNI AMALDA SINAB KO'RAMIZ:**
> ```python
> y, sr = sf.read("speech_01.wav")
> sf.write("test.mp3", y[:sr*3], sr)         # ⭐ MP3 YOZISH
> z, s2 = sf.read("test.mp3")                # ⭐ MP3 O'QISH
> print(f"MP3: {z.shape} @ {s2} Hz")
>
> import librosa
> a, s3 = librosa.load("test.mp3", sr=16000) # ⭐ librosa ham ishlaydi
> print(f"librosa: {a.shape}")
> ```
> ```
> MP3: (132300,) @ 44100 Hz
> librosa: (48000,)
> ```
>
> ## ✅ **MP3 YOZISH HAM, O'QISH HAM ISHLADI — `ffmpeg` SIZ.**
>
> ## ⚠️ **QACHON `ffmpeg` HAQIQATAN KERAK?**
> ```
> ⭐ VIDEO fayllardan audio ajratish (.mp4, .mkv)
> ⭐ M4A / AAC formatlari
> ⭐ rasmiy `openai-whisper` paketi
> 💥 WAV, MP3, FLAC, OGG uchun — KERAK EMAS
> ```

---

## 3. ⭐⭐ `openai-whisper` yoki `transformers`?

| | `openai-whisper` | ## ⭐ `transformers` |
|---|---|---|
| `ffmpeg` | ## 💥 **SHART** | ## ✅ **kerak emas** |
| O'rnatish | `pip install -U openai-whisper` | `pip install transformers` |
| Model formati | `.pt` | Hugging Face |
| Modellar tanlovi | 6 ta *(tiny…large)* | ## 🏆 **minglab** *(fine-tuned ham)* |
| Batch qayta ishlash | ## 💥 yo'q | ## ⭐ **bor** |
| Ichini ko'rish | ## 💥 qiyin | ## 🏆 **oson** *(56-modul)* |
| So'z darajasida vaqt | ✅ bor | ⚠️ qo'shimcha kod |

```python
# ── kursnikidek ──
import whisper                              # 💥 ffmpeg kerak
m = whisper.load_model("base")
r = m.transcribe("audio.mp3")
print(r["text"])

# ── bizning yo'l ──
from transformers import pipeline           # ✅ ffmpeg kerak emas
import librosa

y, sr = librosa.load("audio.mp3", sr=16000)
asr = pipeline("automatic-speech-recognition", model="openai/whisper-base")
print(asr(y)["text"])
```

> ## 🏆 **`transformers` YO'LINING KATTA AFZALLIGI — 🇺🇿 FINE-TUNED MODELLAR:**
> ```
> Hugging Face da o'zbekcha uchun MOSLASHTIRILGAN
> Whisper modellari bor
>    →  ⭐ ularni BIR QATOR bilan ishlatasiz
>    →  💥 openai-whisper bilan bu MUMKIN EMAS
> ```

---

## 4. ⭐ To'liq o'rnatish — bizning versiya

```bash
# ① muhit
python -m venv speech_env
speech_env\Scripts\activate
python -m pip install --upgrade pip

# ② asosiy
pip install numpy scipy pandas matplotlib

# ③ audio  (⭐ ffmpeg KERAK EMAS)
pip install soundfile librosa

# ④ transkripsiya  (⚠️ CPU versiyasi)
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install transformers

# ⑤ baholash
pip install jiwer

# ⑥ Jupyter
pip install jupyter ipykernel
python -m ipykernel install --user --name speech_env \
    --display-name "Python (speech_env)"

# ⑦ ixtiyoriy — kursnikidek
pip install SpeechRecognition gTTS
```

> ## ⭐ **YETTI QADAM. `Chocolatey` YO'Q, `ffmpeg` YO'Q, ADMINISTRATOR HUQUQI YO'Q.**
>
> ## 💾 **HAJM:**
> ```
> torch (CPU)      0.49 GB     ⭐ eng katta
> transformers     ~0.1 GB
> librosa+scipy    ~0.2 GB
> qolgani          ~0.1 GB
> ─────────────────────────
> JAMI            ~0.9 GB
>
> vs Anaconda + ffmpeg + GPU torch  →  💥 ~6 GB
> ```

---

## 5. 💥 Eng ko'p uchraydigan o'rnatish xatolari

> ### ① 💥 **`pip install speech recognition`** *(bo'sh joy bilan)*
> ```
> ✅ TO'G'RI:  pip install SpeechRecognition
> ```
> ## ⚠️ Kurs buni **maxsus ta'kidlaydi** — va **haq**.
>
> ### ② 💥 **`pip install librosa` sekin ishlaydi**
> ```
> Sabab: numba, llvmlite kompilyatsiya qilinishi mumkin
> ⭐ Yechim: pip ni yangilang yoki `uv pip install` ishlating
> ```
>
> ### ③ 💥 **`torch` 2.5 GB yuklab oldi**
> ```
> ⭐ Yechim:  pip install torch --index-url \
>              https://download.pytorch.org/whl/cpu
> ```
>
> ### ④ 💥 **"ModuleNotFoundError" — garchi o'rnatgan bo'lsangiz ham**
> ```
> Sabab: BOSHQA muhitga o'rnatilgan
> ⭐ Tekshiring:  python -c "import sys; print(sys.executable)"
> ```
>
> ### ⑤ 💥 **`resampy` topilmadi** *(librosa da)*
> ```python
> librosa.resample(y, orig_sr=44100, target_sr=16000,
>                  res_type="kaiser_fast")   # 💥 resampy kerak
>
> librosa.resample(y, orig_sr=44100, target_sr=16000)   # ✅ soxr (o'rnatilgan)
> ```
> ## 🔬 **VA 54-MODULDA O'LCHAGAN EDIK:** ## sukut `soxr_hq` — `scipy` dan **2× tez** va **aniqroq**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** `ffmpeg` MP3 uchun kerakmi?

**M2.** `openai-whisper` va `transformers` — qaysi biri afzal?

**M3.** `SpeechRecognition` ni qanday yozish kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## 💥 **Yo'q** — `soundfile 0.14` MP3 ni **o'zi** qo'llab-quvvatlaydi. ## ⭐ `ffmpeg` faqat **video** va **M4A** uchun.

**M2.** ## ⭐ **`transformers`** — `ffmpeg` kerak emas, ## minglab model, batch, va 🇺🇿 **fine-tuned** modellar.

**M3.** ## **Bitta so'z**, bosh harflar bilan: `SpeechRecognition`.

</details>

### 🟡 O'rta

**M4.** ⭐ Format qo'llab-quvvatlashini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import soundfile as sf, shutil, numpy as np
from pathlib import Path

y, sr = sf.read("speech_01.wav")
if y.ndim > 1:
    y = y.mean(axis=1)
bolak = y[:sr * 3]

print(f"  ffmpeg: {shutil.which('ffmpeg') or '⬜ topilmadi'}\n")
print("  format   yozish   o'qish   hajm      izoh")

for fmt, kengaytma in [("WAV", "wav"), ("FLAC", "flac"),
                       ("OGG", "ogg"), ("MP3", "mp3")]:
    yol = Path(f"test.{kengaytma}")
    try:
        sf.write(yol, bolak, sr, format=fmt)
        z, s2 = sf.read(yol)
        h = yol.stat().st_size / 1024
        print(f"  {fmt:8s}   ✅       ✅     {h:7.1f} KB")
        yol.unlink()
    except Exception as e:
        print(f"  {fmt:8s}   💥 {type(e).__name__}")

# ⭐ librosa ham sinaymiz
import librosa
sf.write("t.mp3", bolak, sr)
a, _ = librosa.load("t.mp3", sr=16000)
print(f"\n  librosa MP3 o'qish: ✅ {a.shape}")
Path("t.mp3").unlink()
```

```
  ffmpeg: ⬜ topilmadi

  format   yozish   o'qish   hajm
  WAV        ✅       ✅      258.4 KB
  FLAC       ✅       ✅      136.0 KB
  OGG        ✅       ✅       29.5 KB
  MP3        ✅       ✅       32.4 KB

  librosa MP3 o'qish: ✅ (48000,)
```

## 🏆 **TO'RTALA FORMAT HAM `ffmpeg` SIZ ISHLAYDI.**

## 💡 **VA HAJM FARQINI KO'RING** *(3 soniyalik bo'lak)*:
```
WAV   258.4 KB   — siqilmagan
FLAC  136.0 KB   — ⭐ YO'QOTISHSIZ siqish (1.9×)
MP3    32.4 KB   — 8.0× kichik  (yo'qotishli)
OGG    29.5 KB   — 🏆 8.8× kichik  (yo'qotishli)
```

## ⭐ **FLAC — ARXIV UCHUN IDEAL:** ## 1.9× kichik va **hech narsa yo'qolmaydi**.

</details>

**M5.** ⭐⭐ Ikki Whisper yo'lini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import time, librosa
from transformers import pipeline

y, sr = librosa.load("speech_01.wav", sr=16000)

t0 = time.perf_counter()
asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")
yuk = time.perf_counter() - t0

t0 = time.perf_counter()
r = asr(y.copy(), generate_kwargs={"language": "en"})["text"].strip()
dt = time.perf_counter() - t0

print(f"  transformers:")
print(f"    yuklash      {yuk:6.2f} s")
print(f"    transkripsiya {dt:6.2f} s · RTF {dt/(len(y)/sr):.3f}")
print(f"    natija: {r[:90]}")

# ── openai-whisper (agar o'rnatilgan bo'lsa) ──
try:
    import whisper as ow
    t0 = time.perf_counter()
    m = ow.load_model("tiny")
    print(f"\n  openai-whisper yuklash {time.perf_counter()-t0:.2f} s")
    t0 = time.perf_counter()
    r2 = m.transcribe("speech_01.wav")["text"].strip()
    print(f"    transkripsiya {time.perf_counter()-t0:.2f} s")
    print(f"    natija: {r2[:90]}")
    print(f"\n  matnlar bir xilmi: {'✅' if r == r2 else '💥 FARQ BOR'}")
except ImportError:
    print("\n  ⬜ openai-whisper o'rnatilmagan (va kerak emas)")
except Exception as e:
    print(f"\n  💥 openai-whisper: {type(e).__name__}: {str(e)[:80]}")
    print("     (ehtimol ffmpeg yo'q)")
```

## ⚠️ **`openai-whisper` `ffmpeg` SIZ FAYLNI OCHA OLMAYDI** — ## u audio o'qishni **butunlay** `ffmpeg` ga topshiradi.

</details>

**M6.** ⭐ O'rnatish tekshiruvchisini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import importlib, shutil, sys, subprocess


def ornatish_tekshir(tuzat=False):
    """🏆 Nima yetishmayotganini topadi va o'rnatish buyrug'ini beradi."""
    KERAK = {
        "numpy": "numpy", "scipy": "scipy", "pandas": "pandas",
        "matplotlib": "matplotlib", "soundfile": "soundfile",
        "librosa": "librosa", "torch": "torch",
        "transformers": "transformers", "jiwer": "jiwer",
    }
    IXTIYORIY = {
        "speech_recognition": "SpeechRecognition",
        "gtts": "gTTS", "ipykernel": "ipykernel",
    }

    yoq_kerak, yoq_ixt = [], []
    for d, ro in [(KERAK, yoq_kerak), (IXTIYORIY, yoq_ixt)]:
        for mod, paket in d.items():
            try:
                m = importlib.import_module(mod)
                print(f"  ✅ {paket:20s} {getattr(m, '__version__', '?')}")
            except Exception:
                ro.append(paket)
                belgi = "💥" if d is KERAK else "⬜"
                print(f"  {belgi} {paket:20s} yo'q")

    print(f"\n  ffmpeg: {shutil.which('ffmpeg') or '⬜ yo`q (SHART EMAS)'}")

    if yoq_kerak:
        buyruq = f"{sys.executable} -m pip install {' '.join(yoq_kerak)}"
        print(f"\n  💥 O'RNATING:\n    {buyruq}")
        if tuzat:
            subprocess.run(buyruq.split())
    else:
        print("\n  🏆 HAMMA KERAKLI PAKET BOR")

    if yoq_ixt:
        print(f"  ⬜ ixtiyoriy: pip install {' '.join(yoq_ixt)}")
    return not yoq_kerak


ornatish_tekshir()
```

## ⭐ **`sys.executable -m pip`** — ## bu **aynan shu** Python ning `pip` i, ## global emas.

</details>

---

## 📌 Xulosa

```bash
python -m venv speech_env && speech_env\Scripts\activate
pip install --upgrade pip
pip install numpy scipy pandas matplotlib soundfile librosa
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install transformers jiwer jupyter ipykernel
```

```
🔬 O'LCHANGAN:
   ffmpeg: TOPILMADI  ->  va hech narsa buzilmadi

   soundfile 0.14 formatlar (27 ta):
     ✅ WAV · MP3 · FLAC · OGG · AIFF · CAF · W64 ...
   MP3 yozish/o'qish  →  ✅ ISHLADI (ffmpeg SIZ)
   librosa MP3 o'qish →  ✅ ISHLADI

   torch (CPU) 0.49 GB · jami muhit ~0.9 GB
   vs Anaconda + ffmpeg + GPU torch  →  💥 ~6 GB
```

> ## 🏆🏆 **KURSNING ENG QIYIN QADAMI — `Chocolatey` + `ffmpeg` — UMUMAN KERAK EMAS.**
>
> ## ⚠️ **U FAQAT VIDEO VA M4A UCHUN, YOKI RASMIY `openai-whisper` PAKETI UCHUN KERAK.**

---

⬅️ [2-dars. Muhit yaratish](02-Creating-an-Environment.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Paketlarni import qilish](04-Importing-Packages.md)
