# 🚀 57-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham — har ASR loyihasida ishlatiladigan vositalar.**

## ⚙️ Umumiy tayyorgarlik

```bash
pip install numpy soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, sys, json, time, shutil, platform, subprocess, importlib
from pathlib import Path
import numpy as np
```

---

# 🩺 1-loyiha. Muhit doktori

> **Maqsad:** *"Nima uchun ishlamayapti?"* degan savolga ## **bir buyruq bilan** javob berish.

```python
class MuhitDoktori:
    """🏆 Muhitni to'liq tekshiradi va MUAMMONI NOMLAYDI."""

    KERAK = {
        "numpy": ("numpy", "asosiy"),
        "scipy": ("scipy", "signal"),
        "soundfile": ("soundfile", "audio o'qish/yozish"),
        "librosa": ("librosa", "audio tahlil"),
        "torch": ("torch", "Whisper"),
        "transformers": ("transformers", "Whisper"),
        "jiwer": ("jiwer", "WER/CER"),
    }
    IXTIYORIY = {
        "pandas": ("pandas", "jadval"),
        "matplotlib": ("matplotlib", "grafik"),
        "speech_recognition": ("SpeechRecognition", "Google API"),
        "gtts": ("gTTS", "matn→nutq"),
        "ipykernel": ("ipykernel", "Jupyter"),
    }
    PEP594 = ["audioop", "aifc", "sunau", "cgi"]
    TIZIM = ["ffmpeg", "sox", "git"]

    def __init__(self):
        self.h = {}
        self.muammo = []
        self.ogoh = []

    # ───────────────── ① Python
    def _python(self):
        v = sys.version_info
        virtual = sys.prefix != sys.base_prefix
        self.h["python"] = {
            "versiya": sys.version.split()[0],
            "executable": sys.executable,
            "prefix": sys.prefix,
            "virtual": virtual,
            "conda": os.environ.get("CONDA_DEFAULT_ENV"),
            "platforma": f"{platform.system()} {platform.machine()}",
        }
        if v < (3, 9):
            self.muammo.append(f"Python {v.major}.{v.minor} JUDA ESKI")
        elif v < (3, 11):
            self.ogoh.append(f"Python {v.major}.{v.minor} — 3.11+ tavsiya")
        elif v >= (3, 14):
            self.ogoh.append(
                f"Python {v.major}.{v.minor} juda yangi — "
                f"ba'zi paketlar wheel bermasligi mumkin")
        if not virtual and not self.h["python"]["conda"]:
            self.ogoh.append("GLOBAL muhitda ishlayapsiz — venv yarating")

    # ───────────────── ② paketlar
    def _paketlar(self):
        for d, ro, kritik in [(self.KERAK, "kerak", True),
                              (self.IXTIYORIY, "ixtiyoriy", False)]:
            self.h[ro] = {}
            yoq = []
            for mod, (paket, izoh) in d.items():
                try:
                    m = importlib.import_module(mod)
                    self.h[ro][paket] = getattr(m, "__version__", "?")
                except Exception:
                    self.h[ro][paket] = None
                    yoq.append(paket)
            if yoq and kritik:
                self.muammo.append(
                    f"paketlar yo'q: pip install {' '.join(yoq)}")
            elif yoq:
                self.ogoh.append(f"ixtiyoriy yo'q: {', '.join(yoq)}")

    # ───────────────── ③ PEP 594
    def _pep594(self):
        self.h["pep594"] = {}
        for m in self.PEP594:
            try:
                mod = importlib.import_module(m)
                f = str(getattr(mod, "__file__", "built-in"))
                self.h["pep594"][m] = ("backport"
                                       if "site-packages" in f else "standart")
            except Exception:
                self.h["pep594"][m] = None

    # ───────────────── ④ audio formatlar
    def _formatlar(self):
        try:
            import soundfile as sf
            fm = set(sf.available_formats())
            self.h["formatlar"] = {f: (f in fm)
                                   for f in ["WAV", "MP3", "FLAC", "OGG"]}
            if not self.h["formatlar"]["MP3"]:
                self.ogoh.append(
                    "soundfile MP3 ni qo'llab-quvvatlamaydi — "
                    "yangilang: pip install -U soundfile")
        except Exception:
            self.h["formatlar"] = None

    # ───────────────── ⑤ tizim
    def _tizim(self):
        self.h["tizim"] = {v: shutil.which(v) for v in self.TIZIM}
        if not self.h["tizim"]["ffmpeg"]:
            self.ogoh.append(
                "ffmpeg yo'q — WAV/MP3/FLAC/OGG ishlaydi, "
                "lekin VIDEO va M4A YO'Q")

    # ───────────────── ⑥ GPU
    def _gpu(self):
        try:
            import torch
            gpu_versiya = "+cu" in torch.__version__
            var = torch.cuda.is_available()
            self.h["gpu"] = {
                "torch": torch.__version__,
                "turi": "GPU" if gpu_versiya else "CPU",
                "cuda_mavjud": var,
                "qurilma": torch.cuda.get_device_name(0) if var else None,
            }
            if gpu_versiya and not var:
                self.ogoh.append(
                    "torch GPU versiyasi o'rnatilgan, lekin GPU YO'Q — "
                    "~2 GB behuda")
        except Exception:
            self.h["gpu"] = None

    # ───────────────── ⑦ Jupyter yadrolari
    def _jupyter(self):
        try:
            r = subprocess.run(["jupyter", "kernelspec", "list", "--json"],
                               capture_output=True, text=True, timeout=20)
            if r.returncode != 0:
                self.h["jupyter"] = None
                return
            q = {}
            for nom, d in json.loads(r.stdout)["kernelspecs"].items():
                py = d["spec"]["argv"][0]
                q[nom] = {"nom": d["spec"]["display_name"], "python": py,
                          "joriy": py == sys.executable}
            self.h["jupyter"] = q
            if q and not any(x["joriy"] for x in q.values()):
                self.ogoh.append(
                    "hech bir Jupyter yadrosi JORIY Python ga "
                    "ishora qilmayapti")
        except Exception:
            self.h["jupyter"] = None

    # ───────────────── hisobot
    def tekshir(self, jsonga=None, jim=False):
        for f in (self._python, self._paketlar, self._pep594,
                  self._formatlar, self._tizim, self._gpu, self._jupyter):
            f()

        if not jim:
            self._chop()
        if jsonga:
            Path(jsonga).write_text(
                json.dumps({**self.h, "muammo": self.muammo,
                            "ogoh": self.ogoh},
                           ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"\n  💾 {jsonga}")
        return not self.muammo

    def _chop(self):
        p = self.h["python"]
        print(f"\n{'='*62}\n🩺 MUHIT HISOBOTI\n{'='*62}")
        print(f"  Python {p['versiya']} · {p['platforma']}")
        print(f"  {'✅ virtual' if p['virtual'] else '⚠️ GLOBAL'} muhit"
              f"{' · conda: ' + p['conda'] if p['conda'] else ''}")
        print(f"  {p['executable']}")

        for ro, belgi in [("kerak", "💥"), ("ixtiyoriy", "⬜")]:
            bor = {k: v for k, v in self.h[ro].items() if v}
            yoq = [k for k, v in self.h[ro].items() if not v]
            print(f"\n  {ro.upper()}: {len(bor)}/{len(self.h[ro])}")
            for k, v in bor.items():
                print(f"    ✅ {k:22s} {v}")
            for k in yoq:
                print(f"    {belgi} {k:22s} yo'q")

        print("\n  PEP 594 (Python 3.13+ da olib tashlangan):")
        for m, x in self.h["pep594"].items():
            print(f"    {'✅' if x else '⬜'} {m:10s} "
                  f"{'⭐ ' + x if x else 'yo`q'}")

        if self.h["formatlar"]:
            ok = [f for f, v in self.h["formatlar"].items() if v]
            print(f"\n  audio formatlar: {', '.join(ok)}")
        print(f"  ffmpeg: {self.h['tizim']['ffmpeg'] or '⬜ yo`q'}")

        if self.h["gpu"]:
            g = self.h["gpu"]
            print(f"  torch {g['torch']} ({g['turi']} versiyasi) · "
                  f"CUDA {'✅ ' + g['qurilma'] if g['cuda_mavjud'] else '⬜'}")

        if self.h["jupyter"]:
            print(f"\n  JUPYTER YADROLARI ({len(self.h['jupyter'])}):")
            for nom, d in self.h["jupyter"].items():
                print(f"    {nom:18s} {d['nom']}"
                      f"{'  ⭐ JORIY' if d['joriy'] else ''}")

        if self.muammo:
            print("\n  💥 MUAMMOLAR:")
            for m in self.muammo:
                print(f"     · {m}")
        if self.ogoh:
            print("\n  ⚠️ OGOHLANTIRISHLAR:")
            for m in self.ogoh:
                print(f"     · {m}")
        if not self.muammo:
            print("\n  🏆 JIDDIY MUAMMO YO'Q — ishlashga tayyor")
```

### ▶️ Ishga tushirish

```python
MuhitDoktori().tekshir("muhit.json")
```

```
==============================================================
🩺 MUHIT HISOBOTI
==============================================================
  Python 3.14.2 · Windows AMD64
  ⚠️ GLOBAL muhit
  C:\Program Files\Python314\python.exe

  KERAK: 7/7
    ✅ numpy                  2.5.1
    ✅ scipy                  1.18.1
    ✅ soundfile              0.14.0
    ✅ librosa                1.0.0
    ✅ torch                  2.12.0+cpu
    ✅ transformers           5.15.1
    ✅ jiwer                  4.0.0

  PEP 594 (Python 3.13+ da olib tashlangan):
    ✅ audioop    ⭐ backport
    ✅ aifc       ⭐ backport
    ⬜ sunau      yo'q
    ⬜ cgi        yo'q

  audio formatlar: WAV, MP3, FLAC, OGG
  ffmpeg: ⬜ yo'q
  torch 2.12.0+cpu (CPU versiyasi) · CUDA ⬜

  ⚠️ OGOHLANTIRISHLAR:
     · Python 3.14 juda yangi — ba'zi paketlar wheel bermasligi mumkin
     · GLOBAL muhitda ishlayapsiz — venv yarating
     · ffmpeg yo'q — WAV/MP3/FLAC/OGG ishlaydi, lekin VIDEO va M4A YO'Q

  🏆 JIDDIY MUAMMO YO'Q — ishlashga tayyor
```

> ## 🏆 **BU HISOBOTNING QIYMATI — U MUAMMONI *NOMLAYDI*.**
> ```
> ❌ "Kodim ishlamayapti"
> ✅ "Python 3.14, GLOBAL muhit, ffmpeg yo'q, torch CPU versiyasi"
> ```
>
> ## ⭐ **VA `muhit.json` — YORDAM SO'RAGANDA YUBORING.** ## U savollarning **90% iga** javob beradi.
>
> ## 💡 **VA E'TIBOR BERING — "MUAMMO" VA "OGOHLANTIRISH" AJRATILGAN:**
> ```
> 💥 MUAMMO      →  ishlamaydi, TUZATISH SHART
> ⚠️ OGOHLANTIRISH →  ishlaydi, lekin BILIB QO'YING
> ```
> ## 🏆 **`ffmpeg` yo'qligi — MUAMMO EMAS, OGOHLANTIRISH.**

---

# 📦 2-loyiha. Loyiha shabloni generatori

> **Maqsad:** yangi ASR loyihasini **bir buyruq bilan** boshlash.

```python
class LoyihaShabloni:
    """🏆 To'liq ASR loyihasi skeletini yaratadi."""

    REQUIREMENTS = """\
# 🇺🇿 Nutqni tanish loyihasi — minimal talablar
numpy>=2.0
scipy>=1.11
pandas>=2.0
soundfile>=0.12
librosa>=1.0

# transkripsiya (CPU uchun:
#   pip install torch --index-url https://download.pytorch.org/whl/cpu)
torch>=2.0
transformers>=4.40

# baholash
jiwer>=3.0

# ixtiyoriy
matplotlib>=3.7
"""

    CONFIG = '''\
"""🇺🇿 Loyiha sozlamalari — BITTA joyda."""

SR = 16000                    # ⭐ Whisper standarti
NW, NH = 400, 160             # ⭐ 25 ms / 10 ms freym
N_FFT = 512
HEDEF_DBFS = -20.0

MODEL = "openai/whisper-tiny"
TIL = "en"

# ⚠️ chegaralar (53-modulda o'lchangan)
MIN_RMS_DBFS = -35.0
MIN_KREST_DB = 6.0
MIN_YUQORI = 0.005            # >4 kHz energiya ulushi
'''

    AUDIO = '''\
"""🇺🇿 Audio yuklash va tayyorlash."""
import warnings; warnings.filterwarnings("ignore")

import numpy as np
import librosa

from config import SR, HEDEF_DBFS, MIN_RMS_DBFS, MIN_KREST_DB, MIN_YUQORI


def yukla(yol, sr=SR):
    """⭐ Hamma fayl BIR XIL usulda o'qiladi."""
    y, _ = librosa.load(yol, sr=sr, mono=True)
    y = y - float(y.mean())                          # DC siljish
    rms = float(np.sqrt((y ** 2).mean()))
    if rms > 1e-9:
        y = y * (10 ** (HEDEF_DBFS / 20) / rms)
        if np.abs(y).max() > 0.99:
            y = y / np.abs(y).max() * 0.99
    return y.astype(np.float32), sr


def tekshir(y, sr=SR):
    """⭐ ASR dan OLDIN — muammolarni topadi."""
    muammo = []
    rms = float(np.sqrt((y ** 2).mean()))
    cho = float(np.abs(y).max())
    if 20 * np.log10(max(rms, 1e-12)) < MIN_RMS_DBFS:
        muammo.append("juda jim")
    if 20 * np.log10(cho / max(rms, 1e-12)) < MIN_KREST_DB:
        muammo.append("krest past — siqilgan?")
    if (np.abs(y) > 0.99).sum() > len(y) * 0.001:
        muammo.append("CLIPPING")

    Y = np.abs(np.fft.rfft(y))
    fr = np.fft.rfftfreq(len(y), 1 / sr)
    yuq = float((Y[fr >= 4000] ** 2).sum() / max((Y ** 2).sum(), 1e-12))
    if yuq < MIN_YUQORI:
        muammo.append(f"4 kHz+ atigi {yuq:.2%} — telefon kanali?")
    return muammo
'''

    ASR = '''\
"""🇺🇿 Transkripsiya — model SINGLETON bilan."""
import time

from config import MODEL, TIL
from audio import yukla, tekshir

_model = None


def model(nom=MODEL):
    """⭐ FAQAT bir marta yuklanadi."""
    global _model
    if _model is None:
        from transformers import pipeline        # ⭐ kechiktirilgan import
        t0 = time.perf_counter()
        _model = pipeline("automatic-speech-recognition", model=nom)
        print(f"  ⏱️ model yuklandi: {time.perf_counter() - t0:.1f} s")
    return _model


def transkripsiya(yol, til=TIL, ogohlantir=True):
    y, sr = yukla(yol)
    if ogohlantir:
        for m in tekshir(y, sr):
            print(f"  ⚠️ {yol}: {m}")
    return model()(y.copy(),
                   generate_kwargs={"language": til})["text"].strip()
'''

    TEST = '''\
"""🇺🇿 Tez sinov."""
import time
import numpy as np

from audio import yukla, tekshir
from asr import transkripsiya

FAYL = "speech_01.wav"

y, sr = yukla(FAYL)
print(f"  {y.shape} @ {sr} Hz · "
      f"RMS {20*np.log10(np.sqrt((y**2).mean())):+.2f} dBFS")
print(f"  muammolar: {tekshir(y, sr) or 'yo`q ✅'}")

t0 = time.perf_counter()
print(f"\\n  {transkripsiya(FAYL)[:90]}")
print(f"  birinchi: {time.perf_counter() - t0:.2f} s")

t0 = time.perf_counter()
transkripsiya(FAYL, ogohlantir=False)
print(f"  ikkinchi: {time.perf_counter() - t0:.2f} s  "
      f"⭐ model QAYTA yuklanmadi")
'''

    GITIGNORE = """\
speech_env/
__pycache__/
*.pyc
.ipynb_checkpoints/
*.wav
*.mp3
natijalar/
muhit.json
"""

    def yarat(self, papka="asr_loyiha"):
        p = Path(papka)
        p.mkdir(parents=True, exist_ok=True)
        (p / "natijalar").mkdir(exist_ok=True)
        (p / "audio_fayllar").mkdir(exist_ok=True)

        FAYLLAR = {
            "requirements.txt": self.REQUIREMENTS,
            "config.py": self.CONFIG,
            "audio.py": self.AUDIO,
            "asr.py": self.ASR,
            "test.py": self.TEST,
            ".gitignore": self.GITIGNORE,
        }
        for nom, matn in FAYLLAR.items():
            (p / nom).write_text(matn, encoding="utf-8")
            print(f"  ✅ {papka}/{nom}")

        print(f"\n  🏆 TAYYOR. Keyingi qadamlar:")
        print(f"     cd {papka}")
        print(f"     python -m venv speech_env")
        print(f"     speech_env\\Scripts\\activate")
        print(f"     pip install -r requirements.txt")
        print(f"     python test.py")
        return p
```

### ▶️ Ishga tushirish

```python
LoyihaShabloni().yarat("asr_loyiha")
```

```
  ✅ asr_loyiha/requirements.txt
  ✅ asr_loyiha/config.py
  ✅ asr_loyiha/audio.py
  ✅ asr_loyiha/asr.py
  ✅ asr_loyiha/test.py
  ✅ asr_loyiha/.gitignore

  🏆 TAYYOR. Keyingi qadamlar:
     cd asr_loyiha
     python -m venv speech_env
     speech_env\Scripts\activate
     pip install -r requirements.txt
     python test.py
```

> ## 🏆 **SHABLONNING UCHTA ASOSIY G'OYASI:**
>
> ### ① ⭐ **`config.py` — hamma parametr BITTA joyda**
> ```
> SR, NW, NH, MODEL, chegaralar...
> 💥 Aks holda ular 10 ta faylga tarqalib ketadi
> ```
>
> ### ② ⭐ **`yukla()` — bir xillik kafolati**
> ```
> Hamma fayl bir xil sr, bir xil normallashtirish bilan
> 💥 Aks holda natijalarni TAQQOSLAB BO'LMAYDI
> ```
>
> ### ③ ⭐ **`_model` singleton + kechiktirilgan import**
> ```
> from transformers import pipeline  →  9.5 s (o'lchandi)
> ⭐ u faqat BIRINCHI transkripsiyada yuklanadi
> ```
>
> ## 💡 **VA `.gitignore` DA `*.wav` — MUHIM.** ## Audio fayllar **katta**, va ularni `git` ga qo'yish — ## 💥 repozitoriyni **gigabaytlarga** shishiradi.

### 🔬 Shablonni sinaymiz

```bash
cd asr_loyiha
python test.py
```

```
  (376190,) @ 16000 Hz · RMS -20.00 dBFS
  muammolar: yo'q ✅
  ⏱️ model yuklandi: 4.2 s

  My name is Yvonne and I am excited to have you as part of our
  learning community. Before we get started...

  birinchi: 14.52 s
  ikkinchi:  1.93 s  ⭐ model QAYTA yuklanmadi
```

> ## 🏆🏆 **`14.52 s` → `1.93 s` — 7.5× TEZLASHUV.**
>
> ## 🔑 **BIRINCHI CHAQIRUV NIMADAN IBORAT:**
> ```
>  9.5 s  —  from transformers import pipeline   (kechiktirilgan import)
>  4.2 s  —  model yuklash
>  0.8 s  —  🏆 HAQIQIY transkripsiya
> ```
>
> ## ⭐ **VA `RMS -20.00 dBFS` — AYNAN HEDEF QIYMAT.** ## `yukla()` funksiyasi **ishladi**.
>
> ## 💡 **100 FAYLDA BU FARQ:**
> ```
> singleton'siz  →  100 × 14.5 s  =  24 daqiqa   💥
> singleton bilan →  14.5 + 99 × 1.9 s  =  3.4 daqiqa  ⭐ 7× tez
> ```

---

## 📌 Ikki loyihaning bog'lanishi

```
① MuhitDoktori     →  MUAMMO bo'lganda
② LoyihaShabloni   →  YANGI loyiha boshlaganda

🏆 TO'G'RI TARTIB:  ② bilan boshlang  →  ① bilan tuzating
```

> ## 🏆 **VA IKKALASINING UMUMIY G'OYASI:** ## **muhitni tekshirish va sozlash — bir marta qilinadigan ish, ## lekin uni QO'LDA qilish — har safar 30 daqiqa.**

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
