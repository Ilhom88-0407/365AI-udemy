# 1-dars. Python va Anaconda ⭐

## 🎬 Boshlashdan oldin

> **"Kurs Anaconda + Python 3.9 ni tavsiya qiladi. 2025-yilda bu — eng yaxshi tanlov emas."**

---

## 1. Kursning tavsiyasi

> ## 🔑 **KURS AYTADI:** *"Python 3.9 ni tavsiya qilamiz. Keyingi versiyalarda NumPy 2.0 bor, u boshqa kutubxonalar bilan mos kelmasligi mumkin."*
>
> ## ⚠️⚠️ **BU 2024-YIL BOSHIDA TO'G'RI EDI. BUGUN — YO'Q.**

| | Kurs *(2024)* | ## ⭐ **Bugun** |
|---|---|---|
| Python | 3.9 | ## 🏆 **3.11 – 3.13** |
| NumPy | < 2.0 | ## ✅ **2.x — muammo yo'q** |
| Muhit | Anaconda | ## ⭐ **`venv` yetadi** |
| Whisper | `openai-whisper` + `ffmpeg` | ## 🏆 **`transformers` — ffmpeg shart emas** |

> ## 💥 **VA ENG MUHIMI — PYTHON 3.9 NING QO'LLAB-QUVVATLASH MUDDATI TUGADI** *(2025-yil oktyabr)*. ## Ya'ni u endi **xavfsizlik yangilanishlarini olmaydi**.
>
> ## 🔬 **VA NUMPY 2.x MUAMMOSI HAL BO'LGAN:**
> ```
> librosa 1.0     →  ✅ numpy 2.x ni to'liq qo'llab-quvvatlaydi
> scipy 1.18      →  ✅
> soundfile 0.14  →  ✅
> transformers 5  →  ✅
> ```
> ## 💡 **BU DARSLIKDAGI HAMMA KOD `numpy 2.5.1` DA O'LCHANGAN.**

---

## 2. ⭐⭐ Anaconda kerakmi? — halol taqqoslash

| | 🐍 **Anaconda** | ## ⭐ **`venv` + `pip`** |
|---|---|---|
| Hajm | ## 💥 **~3–5 GB** | ## ⭐ **~50 MB** |
| O'rnatish | 10–20 daqiqa | ## ⭐ **0 daqiqa** *(Python bilan keladi)* |
| Ilmiy paketlar | Oldindan o'rnatilgan | `pip` bilan |
| GPU / CUDA | ## ⭐ Osonroq | Qo'lda |
| Yangilash | ## ⚠️ Sekin, konfliktlar | ## ⭐ Tez |
| ## **Bu kurs uchun** | ## ⚠️ **ortiqcha** | ## 🏆 **yetarli** |

> ## 🏆 **BIZNING TAVSIYA — `venv`:**
> ```bash
> python -m venv speech_env
>
> # Windows
> speech_env\Scripts\activate
>
> # macOS / Linux
> source speech_env/bin/activate
> ```
> ## ⭐ **Uch buyruq. Yuklab olish shart emas.**
>
> ## ⚠️ **QACHON ANACONDA AFZAL?**
> ```
> ⭐ Windows da GPU (CUDA) sozlash qiyin bo'lsa
> ⭐ R, Julia bilan birga ishlasangiz
> ⭐ Korporativ muhitda standart bo'lsa
> ```

---

## 3. ⭐ Python versiyasini tanlash

```python
import sys, platform

print(f"Python {sys.version.split()[0]}")
print(f"Tizim  {platform.system()} {platform.release()} {platform.machine()}")

v = sys.version_info
if v < (3, 9):
    print("💥 JUDA ESKI — 3.11+ ga o'ting")
elif v < (3, 11):
    print("⚠️ ishlaydi, lekin 3.11+ tavsiya etiladi")
elif v < (3, 14):
    print("✅ IDEAL")
else:
    print("⚠️ juda yangi — ba'zi paketlar hali moslashmagan bo'lishi mumkin")
```

```
Python 3.14.2
Tizim  Windows 11 AMD64
⚠️ juda yangi — ba'zi paketlar hali moslashmagan bo'lishi mumkin
```

> ## ⚠️ **BU DARSLIK `Python 3.14.2` DA YOZILGAN VA O'LCHANGAN.** ## Hamma kod **ishlaydi**, lekin ikkita nozik jihat bor:
> ```
> ① audioop standart kutubxonadan olib tashlangan (2-dars)
> ② ba'zi paketlar hali 3.14 uchun "wheel" bermaydi
>    →  💥 manbadan kompilyatsiya kerak bo'lishi mumkin
> ```
>
> ## 🏆 **ENG XAVFSIZ TANLOV — `Python 3.12`:** ## u **barqaror**, **keng qo'llab-quvvatlanadi** va ## **2028-yilgacha** yangilanishlarni oladi.

---

## 4. 🇺🇿 Amaliy: to'liq o'rnatish, boshidan oxirigacha

```bash
# ① muhit yaratamiz
python -m venv speech_env

# ② faollashtirish
speech_env\Scripts\activate          # Windows
source speech_env/bin/activate       # macOS / Linux

# ③ pip ni yangilaymiz — ⭐ eski pip ko'p muammo keltiradi
python -m pip install --upgrade pip

# ④ asosiy paketlar
pip install numpy scipy matplotlib pandas

# ⑤ audio
pip install soundfile librosa

# ⑥ transkripsiya (⚠️ CPU versiyasi — GPU uchun pytorch.org ga qarang)
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install transformers

# ⑦ baholash
pip install jiwer

# ⑧ ixtiyoriy — kursnikidek
pip install SpeechRecognition gTTS
```

> ## ⭐ **`⑥` — ENG MUHIM QATOR.** ## `pip install torch` **sukut bo'yicha** ## GPU versiyasini yuklaydi *(~2.5 GB)*, ## garchi sizda GPU **bo'lmasa ham**.
> ```
> CPU versiyasi  →  0.49 GB    ⭐ o'lchangan
> GPU versiyasi  →  ~2.5 GB    💥 5× katta
> ```
>
> ## 💥 **VA KURSDA `pip install openai-whisper` BOR — BIZDA YO'Q.** ## Sababi *(3-darsda batafsil)*: ## `transformers` orqali Whisper **ffmpeg'siz** ishlaydi.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun kurs Python 3.9 ni tavsiya qiladi va bu bugun to'g'rimi?

**M2.** `venv` va Anaconda orasidagi asosiy farq nima?

**M3.** Nima uchun `pip install torch` ni to'g'ridan-to'g'ri yozmaslik kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## NumPy 2.0 mosligi sababli. ## ⚠️ **Bugun bu hal bo'lgan**, ## va 3.9 ning qo'llab-quvvatlashi **tugagan** *(2025-okt)*.

**M2.** ## Anaconda **3–5 GB**, `venv` — **~50 MB** va ## Python bilan **birga keladi**.

**M3.** ## U **GPU versiyasini** yuklaydi *(~2.5 GB)*. ## ⭐ CPU uchun `--index-url .../whl/cpu` — **~5× kichik** *(o'lchandi: 0.49 GB)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Muhitni to'liq tekshiruvchi skript yozing.

<details>
<summary>✅ Yechim</summary>

```python
import sys, platform, importlib, shutil


def muhit_tekshir():
    """🏆 Har yangi muhitda BIRINCHI ishga tushiring."""
    v = sys.version_info
    print(f"  Python {sys.version.split()[0]} · "
          f"{platform.system()} {platform.machine()}")
    print(f"  {'✅' if (3, 11) <= v < (3, 14) else '⚠️'} versiya "
          f"{'ideal' if (3, 11) <= v < (3, 14) else 'tekshiring'}")
    print(f"  muhit: {sys.prefix}")
    print(f"  {'✅ virtual muhit' if sys.prefix != sys.base_prefix else '⚠️ GLOBAL muhit — venv yarating'}")

    PAKETLAR = {
        "numpy": "asosiy", "scipy": "signal", "matplotlib": "grafik",
        "soundfile": "audio o'qish/yozish", "librosa": "audio tahlil",
        "torch": "Whisper uchun", "transformers": "Whisper",
        "jiwer": "WER/CER", "pandas": "jadval",
    }
    print("\n  PAKETLAR:")
    yoq = []
    for m, izoh in PAKETLAR.items():
        try:
            mod = importlib.import_module(m)
            print(f"    ✅ {m:14s} {getattr(mod, '__version__', '?'):12s} {izoh}")
        except Exception:
            yoq.append(m)
            print(f"    💥 {m:14s} {'YO`Q':12s} {izoh}")

    print("\n  TIZIM:")
    for v2 in ["ffmpeg", "sox", "git"]:
        y = shutil.which(v2)
        print(f"    {'✅' if y else '⬜'} {v2:8s} {y or 'topilmadi (shart emas)'}")

    try:
        import torch
        print(f"\n  CUDA: {'✅ ' + torch.cuda.get_device_name(0) if torch.cuda.is_available() else '⬜ yo`q (CPU)'}")
    except Exception:
        pass

    if yoq:
        print(f"\n  💥 O'RNATING:  pip install {' '.join(yoq)}")
    else:
        print("\n  🏆 HAMMASI TAYYOR")
    return not yoq


muhit_tekshir()
```

## 🏆 **`sys.prefix != sys.base_prefix` — VIRTUAL MUHIT TEKSHIRUVI.** ## Bu — **eng ko'p unutiladigan** qadam.

</details>

**M5.** ⭐ `torch` ning ikki versiyasi hajmini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import torch, os, sys
from pathlib import Path

yol = Path(torch.__file__).parent
hajm = sum(f.stat().st_size for f in yol.rglob("*") if f.is_file())

print(f"  torch {torch.__version__}")
print(f"  joylashuv: {yol}")
print(f"  hajm: {hajm/1024**3:.2f} GB")
print(f"  CUDA qo'llab-quvvatlashi: "
      f"{'✅ BOR (katta versiya)' if '+cu' in torch.__version__ else '⬜ yo`q (CPU versiyasi)'}")
print(f"  CUDA mavjudmi: {torch.cuda.is_available()}")

if "+cu" in torch.__version__ and not torch.cuda.is_available():
    print("\n  💥 GPU VERSIYASI O'RNATILGAN, LEKIN GPU YO'Q")
    print("     ⭐ CPU versiyasiga o'ting — 2 GB tejaysiz:")
    print("     pip install torch --index-url "
          "https://download.pytorch.org/whl/cpu")
```

```
  torch 2.12.0+cpu
  hajm: 0.49 GB
  CUDA qo'llab-quvvatlashi: ⬜ yo'q (CPU versiyasi)
  CUDA mavjudmi: False
```

## 💡 **CPU VERSIYASI — 0.49 GB** *(o'lchangan)*. ## GPU versiyasi **~2.5 GB** — taxminan **5× katta**.

## ⚠️ **VA MEN DASTLAB "0.19 GB" DEB YOZGAN EDIM** — ## bu **paket hajmi**, diskdagi hajm emas. ## 🔑 O'rnatilgandan keyin `torch` **kutubxona fayllari** bilan ## **2.5× kattaroq** joy egallaydi.

</details>

---

## 📌 Xulosa

```bash
python -m venv speech_env
speech_env\Scripts\activate                 # Windows
python -m pip install --upgrade pip
pip install numpy scipy matplotlib pandas soundfile librosa
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install transformers jiwer
```

```
⚠️ KURSNING TAVSIYASI ESKIRGAN:
   Python 3.9        →  💥 qo'llab-quvvatlash TUGADI (2025-okt)
   NumPy < 2.0       →  ✅ 2.x muammosi HAL BO'LGAN
   Anaconda (3–5 GB) →  ⭐ venv (~50 MB) yetadi
   openai-whisper    →  🏆 transformers (ffmpeg SHART EMAS)

⭐ ENG XAVFSIZ TANLOV: Python 3.12
💥 pip install torch  →  ~2.5 GB (GPU); --index-url .../cpu  →  0.49 GB
```

> ## 🏆 **VA ENG KO'P UNUTILADIGAN TEKSHIRUV:**
> ```python
> sys.prefix != sys.base_prefix     # ⭐ virtual muhitdamizmi?
> ```

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Muhit yaratish](02-Creating-an-Environment.md)
