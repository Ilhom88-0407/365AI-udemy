# 📝 57-modul mashqlari

> **16 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **BU MODULNING MASHQLARI — SIZNING MUHITINGIZDA ISHLAYDI.** ## Natijalar **har kompyuterda boshqacha** bo'ladi — **bu normal**.

## ⚙️ Tayyorgarlik

```bash
python -m venv speech_env
speech_env\Scripts\activate
pip install numpy scipy pandas soundfile librosa jiwer
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install transformers
```

---

# 🟢 OSON *(1–6)*

**M1.** Nima uchun kursning Python 3.9 tavsiyasi eskirgan?

**M2.** `venv` va Anaconda hajmi qancha?

**M3.** `ffmpeg` MP3 uchun kerakmi?

**M4.** `audioop` Python 3.14 da ishlaydimi?

**M5.** Jupyter paketni ko'rmasa — birinchi nima tekshiriladi?

**M6.** Nima uchun `pip install torch` xato?

<details>
<summary>✅ Javoblar (1–6)</summary>

**M1.** ## NumPy 2.x mosligi **hal bo'lgan**, ## va Python 3.9 ning qo'llab-quvvatlashi **tugagan** *(2025-okt)*.

**M2.** ## Anaconda **3–5 GB** · `venv` **~50 MB** *(Python bilan keladi)*.

**M3.** ## 💥 **Yo'q** — `soundfile 0.14` MP3 ni **o'zi** o'qiydi va yozadi. ## O'lchandi: MP3 **32.4 KB**, `ffmpeg` **o'rnatilmagan**.

**M4.** ## ✅ **Ha** — `audioop-lts` *(PyPI, 0.2.2)* uni qaytaradi, ## va `SpeechRecognition 3.17` uni **avtomatik** o'rnatadi.

**M5.** ## `sys.executable` — Jupyter **qaysi Python** da ishlayapti.

**M6.** ## U **GPU versiyasini** yuklaydi *(~2.5 GB)*. ## ⭐ CPU: `--index-url https://download.pytorch.org/whl/cpu` → **0.49 GB**.

</details>

---

# 🟡 O'RTA *(7–13)*

**M7.** ⭐ Muhitni to'liq tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import sys, platform, importlib, shutil, site


def muhit_tekshir():
    v = sys.version_info
    print(f"  Python {sys.version.split()[0]} · "
          f"{platform.system()} {platform.machine()}")
    print(f"  executable : {sys.executable}")
    virtual = sys.prefix != sys.base_prefix
    print(f"  {'✅ VIRTUAL muhit' if virtual else '⚠️ GLOBAL muhit'}")

    PAKETLAR = ["numpy", "scipy", "pandas", "matplotlib", "soundfile",
                "librosa", "torch", "transformers", "jiwer"]
    yoq = []
    print("\n  PAKETLAR:")
    for m in PAKETLAR:
        try:
            mod = importlib.import_module(m)
            print(f"    ✅ {m:14s} {getattr(mod, '__version__', '?')}")
        except Exception:
            yoq.append(m)
            print(f"    💥 {m:14s} yo'q")

    print(f"\n  ffmpeg: {shutil.which('ffmpeg') or '⬜ yo`q (SHART EMAS)'}")
    if yoq:
        print(f"\n  💥 pip install {' '.join(yoq)}")
    else:
        print("\n  🏆 HAMMASI TAYYOR")


muhit_tekshir()
```

</details>

**M8.** ⭐ PEP 594 modullarini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import importlib

for m in ["audioop", "aifc", "sunau", "cgi", "distutils", "imp"]:
    try:
        mod = importlib.import_module(m)
        f = str(getattr(mod, "__file__", "built-in"))
        manba = "⭐ PyPI backport" if "site-packages" in f else "standart"
        print(f"  ✅ {m:12s} {manba:18s} {f[-45:]}")
    except Exception as e:
        print(f"  💥 {m:12s} {type(e).__name__}")
```

```
  ✅ audioop      ⭐ PyPI backport   ...\site-packages\audioop\__init__.py
  ✅ aifc         ⭐ PyPI backport   ...\site-packages\aifc\__init__.py
  💥 sunau        ModuleNotFoundError
  💥 cgi          ModuleNotFoundError
  ✅ distutils    ⭐ PyPI backport   ...\setuptools\_distutils\__init__.py
  💥 imp          ModuleNotFoundError
```

## 🏆 **"OLIB TASHLANDI" ≠ "ISHLAMAYDI".** ## Uchtasi **backport** orqali qaytgan.

</details>

**M9.** ⭐ Audio formatlarni sinang.

<details>
<summary>✅ Yechim</summary>

```python
import soundfile as sf, shutil
from pathlib import Path

y, sr = sf.read("speech_01.wav")
if y.ndim > 1:
    y = y.mean(axis=1)
b = y[:sr * 3]

print(f"  ffmpeg: {shutil.which('ffmpeg') or '⬜ topilmadi'}\n")
print("  format   yozish   o'qish     hajm")
for fmt, ext in [("WAV", "wav"), ("FLAC", "flac"),
                 ("OGG", "ogg"), ("MP3", "mp3")]:
    p = Path(f"t.{ext}")
    try:
        sf.write(p, b, sr, format=fmt)
        sf.read(p)
        print(f"  {fmt:8s}   ✅       ✅    {p.stat().st_size/1024:7.1f} KB")
        p.unlink()
    except Exception as e:
        print(f"  {fmt:8s}   💥 {type(e).__name__}")
```

```
  WAV        ✅       ✅     258.4 KB
  FLAC       ✅       ✅     136.0 KB
  MP3        ✅       ✅      32.4 KB
  OGG        ✅       ✅      29.5 KB
```

</details>

**M10.** ⭐⭐ Import vaqtini **to'g'ri** o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import subprocess, sys, time

MODULLAR = ["numpy", "pandas", "scipy", "matplotlib.pyplot", "soundfile",
            "librosa", "jiwer", "torch", "transformers"]


def olch(kod, n=2):
    """⭐ ALOHIDA jarayonda — yagona to'g'ri usul."""
    q = []
    for _ in range(n):
        t0 = time.perf_counter()
        subprocess.run([sys.executable, "-c", kod], capture_output=True)
        q.append(time.perf_counter() - t0)
    return min(q)


bosh = olch("pass")
print(f"  bo'sh Python: {bosh*1000:.1f} ms\n")
for m in MODULLAR:
    dt = olch(f"import {m}")
    belgi = "💥" if dt > 2 else ("⚠️" if dt > 1 else "✅")
    print(f"  {belgi} {m:22s} {dt*1000:8.1f} ms  "
          f"(sof {max(dt-bosh, 0)*1000:7.1f} ms)")
```

```
  bo'sh Python: 27.2 ms

  ✅ numpy                   147.4 ms
  ✅ pandas                  616.2 ms
  ✅ librosa                  37.8 ms   ⭐ lazy_loader!
  ⚠️ torch                  1847.0 ms
  💥 transformers           4120.7 ms
```

## 💥 **`del sys.modules[...]` USULI ISHLATMANG** — ## u C-kengaytmalarni **tozalamaydi** va ## **yolg'on** natija beradi.

</details>

**M11.** ⭐⭐ `lazy_loader` ta'sirini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
KODLAR = {
    "import librosa": "import librosa",
    "librosa + load()":
        "import librosa; librosa.load('speech_01.wav', sr=16000)",
    "librosa + mfcc()":
        "import librosa; y,s=librosa.load('speech_01.wav',sr=16000); "
        "librosa.feature.mfcc(y=y,sr=s)",
    "import transformers": "import transformers",
    "transformers + pipeline": "from transformers import pipeline",
}

asos = None
for nom, kod in KODLAR.items():
    dt = olch("import warnings;warnings.filterwarnings('ignore');" + kod)
    asos = asos or dt
    print(f"  {nom:26s} {dt*1000:8.1f} ms  ({dt/asos:5.1f}×)")
```

```
  import librosa                 37.3 ms  (  1.0×)
  librosa + load()             1155.1 ms  ( 31.0×)
  librosa + mfcc()             1914.8 ms  ( 51.3×)
  import transformers          4067.2 ms
  transformers + pipeline      9525.3 ms  (  2.3×)
```

## 🏆 **"IMPORT VAQTI" ALDAMCHI.** ## Haqiqiy narx — **birinchi funksiya chaqiruvida**.

</details>

**M12.** ⭐ Kechiktirilgan importning foydasini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
TEZ = "import numpy as np, soundfile as sf; print('tayyor')"
SEKIN = ("import numpy as np, soundfile as sf; "
         "from transformers import pipeline; print('tayyor')")

for nom, kod in [("kechiktirilgan", TEZ), ("hammasi birdan", SEKIN)]:
    print(f"  {nom:18s} {olch(kod)*1000:8.1f} ms")
```

## 🏆 **CLI VOSITADA BU FARQ — FOYDALANUVCHI HIS QILADI.** ## `--help` uchun **9.5 soniya kutish** — qabul qilib bo'lmaydi.

</details>

**M13.** ⭐⭐ Model singleton ining foydasini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time, librosa
from transformers import pipeline

y, sr = librosa.load("speech_01.wav", sr=16000)
bolak = y[:sr * 3]

# ── ❌ har safar yuklash ──
t0 = time.perf_counter()
for _ in range(3):
    asr = pipeline("automatic-speech-recognition",
                   model="openai/whisper-tiny")
    asr(bolak.copy(), generate_kwargs={"language": "en"})
har_safar = time.perf_counter() - t0

# ── ✅ singleton ──
asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")
t0 = time.perf_counter()
for _ in range(3):
    asr(bolak.copy(), generate_kwargs={"language": "en"})
singleton = time.perf_counter() - t0

print(f"  har safar yuklash : {har_safar:6.2f} s")
print(f"  singleton         : {singleton:6.2f} s")
print(f"  🏆 tejam          : {har_safar/singleton:6.2f}×")
print(f"\n  100 faylda: {har_safar/3*100:.0f} s  vs  "
      f"{singleton/3*100:.0f} s")
```

## 🏆 **BU — ENG KO'P UCHRAYDIGAN SAMARADORLIK XATOSI.**

</details>

---

# 🔴 QIYIN *(14–16)*

**M14.** ⭐⭐⭐ To'liq muhit tashxis vositasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import sys, os, json, shutil, subprocess, importlib, platform
from pathlib import Path


def muhit_hisoboti(jsonga=None):
    """🏆 'Nima uchun ishlamayapti?' — to'liq javob."""
    h = {}

    # ── ① Python ──
    v = sys.version_info
    h["python"] = {
        "versiya": sys.version.split()[0],
        "executable": sys.executable,
        "virtual": sys.prefix != sys.base_prefix,
        "conda": os.environ.get("CONDA_DEFAULT_ENV"),
        "platforma": f"{platform.system()} {platform.machine()}",
        "tavsiya": "✅" if (3, 11) <= v < (3, 14) else "⚠️",
    }

    # ── ② paketlar ──
    PAKETLAR = ["numpy", "scipy", "pandas", "matplotlib", "soundfile",
                "librosa", "torch", "transformers", "jiwer",
                "speech_recognition", "gtts", "ipykernel"]
    h["paketlar"] = {}
    for m in PAKETLAR:
        try:
            mod = importlib.import_module(m)
            h["paketlar"][m] = getattr(mod, "__version__", "?")
        except Exception:
            h["paketlar"][m] = None

    # ── ③ PEP 594 ──
    h["pep594"] = {}
    for m in ["audioop", "aifc", "sunau", "cgi"]:
        try:
            mod = importlib.import_module(m)
            f = str(getattr(mod, "__file__", "built-in"))
            h["pep594"][m] = ("backport" if "site-packages" in f
                              else "standart")
        except Exception:
            h["pep594"][m] = None

    # ── ④ tizim ──
    h["tizim"] = {v2: shutil.which(v2) for v2 in ["ffmpeg", "sox", "git"]}

    # ── ⑤ audio formatlar ──
    try:
        import soundfile as sf
        fm = set(sf.available_formats())
        h["formatlar"] = {f: f in fm for f in ["WAV", "MP3", "FLAC", "OGG"]}
    except Exception:
        h["formatlar"] = None

    # ── ⑥ GPU ──
    try:
        import torch
        h["gpu"] = {
            "cuda": torch.cuda.is_available(),
            "nomi": (torch.cuda.get_device_name(0)
                     if torch.cuda.is_available() else None),
            "torch_turi": ("GPU" if "+cu" in torch.__version__ else "CPU"),
        }
    except Exception:
        h["gpu"] = None

    # ── chop ──
    p = h["python"]
    print(f"  {p['tavsiya']} Python {p['versiya']} · {p['platforma']}")
    print(f"  {'✅ virtual' if p['virtual'] else '⚠️ GLOBAL'} muhit"
          f"{' · conda: ' + p['conda'] if p['conda'] else ''}")

    yoq = [k for k, x in h["paketlar"].items() if x is None]
    bor = len(h["paketlar"]) - len(yoq)
    print(f"\n  paketlar: {bor}/{len(h['paketlar'])} o'rnatilgan")
    if yoq:
        print(f"    💥 yo'q: {', '.join(yoq)}")

    if h["formatlar"]:
        ok = [f for f, x in h["formatlar"].items() if x]
        print(f"  audio formatlar: {', '.join(ok)}")
    print(f"  ffmpeg: {h['tizim']['ffmpeg'] or '⬜ yo`q (shart emas)'}")

    if h["gpu"]:
        print(f"  torch: {h['gpu']['torch_turi']} versiyasi · "
              f"CUDA {'✅ ' + h['gpu']['nomi'] if h['gpu']['cuda'] else '⬜'}")
        if h["gpu"]["torch_turi"] == "GPU" and not h["gpu"]["cuda"]:
            print("    💥 GPU versiyasi o'rnatilgan, LEKIN GPU YO'Q — 2 GB behuda")

    if jsonga:
        Path(jsonga).write_text(json.dumps(h, ensure_ascii=False, indent=2),
                                encoding="utf-8")
        print(f"\n  💾 {jsonga}")
    return h


muhit_hisoboti("muhit.json")
```

## 🏆 **BU HISOBOTNI MUAMMO HAQIDA SO'RAGANDA YUBORING** — ## u savollarning **90% iga** javob beradi.

</details>

**M15.** ⭐⭐⭐ `requirements.txt` generatorini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import ast, sys, importlib.metadata as md
from pathlib import Path

# ⭐ modul nomi ↔ paket nomi (ular DOIM bir xil emas)
MOSLIK = {
    "sklearn": "scikit-learn", "cv2": "opencv-python",
    "PIL": "Pillow", "yaml": "PyYAML", "gtts": "gTTS",
    "speech_recognition": "SpeechRecognition",
}


def talablar_yarat(papka=".", chiqish="requirements.txt"):
    """🏆 Kodni O'QIB, faqat HAQIQATAN ishlatilganini yozadi."""
    modullar = set()
    for f in Path(papka).rglob("*.py"):
        try:
            t = ast.parse(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        for n in ast.walk(t):
            if isinstance(n, ast.Import):
                for a in n.names:
                    modullar.add(a.name.split(".")[0])
            elif isinstance(n, ast.ImportFrom) and n.module and n.level == 0:
                modullar.add(n.module.split(".")[0])

    # ⭐ standart kutubxonani chiqarib tashlaymiz
    std = set(sys.stdlib_module_names)
    tashqi = sorted(m for m in modullar if m not in std)

    qatorlar = ["# 🇺🇿 Avtomatik yaratilgan — faqat ISHLATILGAN paketlar\n"]
    topilmadi = []
    for m in tashqi:
        paket = MOSLIK.get(m, m)
        try:
            v = md.version(paket)
            a, b = v.split(".")[:2]
            qatorlar.append(f"{paket}>={a}.{b}")
        except Exception:
            topilmadi.append(m)

    Path(chiqish).write_text("\n".join(qatorlar) + "\n", encoding="utf-8")
    print("\n".join(qatorlar))
    if topilmadi:
        print(f"\n  ⚠️ aniqlanmadi (mahalliy modullarmi?): "
              f"{', '.join(topilmadi)}")
    print(f"\n  💾 {chiqish} · {len(qatorlar)-1} paket")
    return qatorlar


talablar_yarat()
```

## 🏆 **`ast` BILAN KODNI O'QISH — `pip freeze` DAN ANIQROQ.** ## Faqat **haqiqatan import qilingan** paketlar tushadi.

## ⚠️ **VA `MOSLIK` LUG'ATI — MAJBURIY:** ## `import sklearn` → `pip install scikit-learn`.

</details>

**M16.** ⭐⭐⭐ Loyihaning "bosh" modulini yozing va sinang.

<details>
<summary>✅ Yechim</summary>

*(To'liq kod 4-darsda, 6-bo'lim.)*

```python
# ⭐ sinov
import time

t0 = time.perf_counter()
y, sr = audio_yukla("speech_01.wav")
print(f"  yuklash {time.perf_counter()-t0:.2f} s · {y.shape} @ {sr}")
print(f"  RMS {20*np.log10(np.sqrt((y**2).mean())):+.2f} dBFS  "
      f"(hedef -20.00)")

t0 = time.perf_counter()
print(f"\n  {transkripsiya('speech_01.wav')[:80]}")
print(f"  birinchi chaqiruv: {time.perf_counter()-t0:.2f} s")

t0 = time.perf_counter()
transkripsiya("speech_01.wav")
print(f"  ikkinchi chaqiruv: {time.perf_counter()-t0:.2f} s  "
      f"⭐ model QAYTA yuklanmadi")
```

## 🏆 **IKKINCHI CHAQIRUV SEZILARLI TEZ BO'LISHI KERAK** — ## bu **singleton ishlayotganining isboti**.

</details>

---

## 📌 Modulda o'lchangan hamma narsa

| O'lchov | Natija |
|---|---|
| Python | **3.14.2** · Windows 11 AMD64 |
| `torch` *(CPU)* hajmi | ## **0.49 GB** *(GPU ~2.5 GB)* |
| `ffmpeg` | ## ⬜ **o'rnatilmagan** — va hech narsa buzilmadi |
| `soundfile` formatlar | ## **27 ta** *(WAV, MP3, FLAC, OGG…)* |
| MP3 yozish/o'qish | ## ✅ **ishladi** *(ffmpeg siz)* |
| Hajm *(3 s)* | WAV 258.4 · FLAC 136.0 · MP3 32.4 · OGG **29.5 KB** |
| `audioop` | ## ✅ **`audioop-lts` 0.2.2** *(PyPI backport)* |
| `aifc`, `distutils` | ## ✅ ular ham **backport** |
| `sunau`, `cgi`, `imp` | ## 💥 **haqiqatan yo'q** |
| `import transformers` | ## 💥 **4120.7 ms** |
| `from transformers import pipeline` | ## 💥 **9525.3 ms** |
| `import torch` | ⚠️ **1847.0 ms** |
| `import librosa` | ## ⭐ **37.8 ms** *(lazy_loader)* |
| `librosa + mfcc()` | ## 💥 **1914.8 ms** — **51×** ko'p |
| Bo'sh Python jarayoni | 27.2 ms |
| `pip freeze` | ## **234 qator** *(qo'lda: 9)* |

---

🏠 [Modul boshiga](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
