# 2-dars. Muhit yaratish va Jupyter yadrosi ⭐⭐

## 🎬 Boshlashdan oldin

> **"Alohida muhit — bu injenerlik odati emas, ehtiyot chorasi. Bir loyiha boshqasini buzmasin."**

---

## 1. Nima uchun alohida muhit?

> ## 🔑 **KURS TO'G'RI TUSHUNTIRADI:** *"Yangi muhit yaratganingizda, boshqa muhitlarga ta'sir qilmasdan aniq paketlar va Python versiyalarini o'rnatish uchun alohida joy yaratasiz."*
>
> ## 💥 **REAL MISOL — KONFLIKT:**
> ```
> Loyiha A:  numpy 1.24 talab qiladi (eski model)
> Loyiha B:  numpy 2.5 talab qiladi (librosa 1.0)
>
> Bitta global muhitda  →  💥 BIRINI O'RNATSANGIZ, IKKINCHISI SINADI
> ```

---

## 2. ⭐⭐ Uch yo'l — taqqoslash

### ① `venv` *(standart, tavsiya etiladi)*

```bash
python -m venv speech_env

speech_env\Scripts\activate           # Windows
source speech_env/bin/activate        # macOS / Linux

deactivate                             # chiqish
```

### ② `conda` *(kursnikidek)*

```bash
conda create -n speech_env python=3.12
conda activate speech_env
conda deactivate
```

### ③ `uv` *(zamonaviy, eng tez)*

```bash
pip install uv                         # bir marta

uv venv speech_env --python 3.12
speech_env\Scripts\activate
uv pip install librosa transformers    # ⭐ 10–100× tez
```

| | `venv` | `conda` | ## ⭐ `uv` |
|---|---|---|---|
| O'rnatish tezligi | Sekin | ## 💥 **eng sekin** | ## 🏆 **10–100× tez** |
| Python versiyasini tanlash | ## 💥 **yo'q** | ## ✅ ha | ## ✅ **ha** |
| Bog'liqlik yechish | Oddiy | ## ⭐ kuchli | ## 🏆 **kuchli va tez** |
| Hajm | ~50 MB | 3–5 GB | ~30 MB |

> ## 💥 **`venv` NING YAGONA JIDDIY CHEKLOVI:** ## u **mavjud** Python versiyasidan muhit yaratadi. ## Boshqa versiya kerak bo'lsa — uni **alohida o'rnatishingiz** kerak.
>
> ## 🏆 **`uv` BU MUAMMONI HAL QILADI** — ## u kerakli Python versiyasini **o'zi yuklab oladi**.

---

## 3. 💥💥 `audioop` — Python 3.13+ dagi hikoya

> ## 🔑 **`PEP 594`: 3.13 da 19 ta "o'lik batareya" moduli olib tashlandi.** ## Ular orasida — audio bilan ishlaydigan **uchtasi**.

```python
import importlib

for m in ["audioop", "aifc", "sunau", "cgi", "distutils", "imp"]:
    try:
        mod = importlib.import_module(m)
        yol = getattr(mod, "__file__", "built-in")
        print(f"  ✅ {m:12s} {yol}")
    except Exception as e:
        print(f"  💥 {m:12s} {type(e).__name__}")
```

```
  ✅ audioop      ...\site-packages\audioop\__init__.py
  ✅ aifc         ...\site-packages\aifc.py
  💥 sunau        ModuleNotFoundError
  💥 cgi          ModuleNotFoundError
  ✅ distutils    ...
```

> ## ⚠️⚠️ **BU YERDA MEN XATO QILGAN EDIM.**
>
> ## 💥 **MEN "`audioop` YO'Q → `SpeechRecognition` ISHLAMAYDI" DEB YOZGAN EDIM.**
>
> ## ✅ **HAQIQAT — U ISHLAYDI, VA MANA NIMA UCHUN:**
> ```
> pip show SpeechRecognition
>   Version: 3.17.0
>   Requires: audioop-lts, standard-aifc, typing-extensions
> ```
>
> ## 🔑 **PyPI DA `audioop-lts` PAKETI BOR** *(0.2.2)* — ## u standart kutubxonadan **olib tashlangan** modulni ## **qaytadan** taqdim etadi.
>
> ## 🏆 **VA `SpeechRecognition` UNI AVTOMATIK O'RNATADI.** ## Ya'ni siz **hech narsa qilmaysiz** — muammo **o'z-o'zidan** hal bo'ladi.
>
> ## ⚠️ **LEKIN OGOHLANTIRISH:**
> ```
> Agar paket audioop ni ISHLATSA, lekin audioop-lts ni
> bog'liqlikka QO'SHMAGAN bo'lsa  →  💥 u sinadi
>
> ⭐ YECHIM:  pip install audioop-lts
> ```
>
> ## 💡 **`__file__` NI TEKSHIRISH — ENG ISHONCHLI USUL:**
> ```
> site-packages ichida  →  ⭐ PyPI backport
> built-in              →  standart kutubxona
> ```
>
> ## ⭐ **VA O'LCHOVDA `aifc` VA `distutils` HAM BACKPORT CHIQDI:**
> ```
> aifc       →  standard-aifc paketi (SpeechRecognition o'rnatgan)
> distutils  →  setuptools ichidan keladi
> sunau, cgi, imp  →  💥 haqiqatan YO'Q
> ```
> ## 🏆 **YA'NI "MODUL OLIB TASHLANDI" — "ISHLAMAYDI" DEGANI EMAS.**

---

## 4. ⭐⭐ Jupyter yadrosi *(kernel)*

```bash
pip install ipykernel

python -m ipykernel install --user \
    --name speech_env \
    --display-name "Python (speech_env)"
```

> ## 🔑 **NIMA BO'LADI?**
> ```
> Jupyter yadro fayli yaratiladi:
>   ~/.local/share/jupyter/kernels/speech_env/kernel.json   (Linux/Mac)
>   %APPDATA%\jupyter\kernels\speech_env\kernel.json        (Windows)
>
> ⭐ Ichida — SIZNING muhitingizdagi python.exe ga yo'l
> ```

### 💥 Eng ko'p uchraydigan xato

```
"Men paketni o'rnatdim, lekin Jupyter uni ko'rmayapti!"
```

> ## 🔑 **SABAB — JUPYTER BOSHQA YADRODA ISHLAYAPTI.**
>
> ## ✅ **TEKSHIRUV — NOTEBOOK ICHIDA:**
> ```python
> import sys
> print(sys.executable)      # ⭐ QAYSI python ishlayapti?
> print(sys.prefix)
> ```
>
> ## 🏆 **VA TO'G'RIDAN-TO'G'RI O'SHA YADROGA O'RNATISH:**
> ```
> # ⭐ notebook ICHIDA (Jupyter sintaksisi — oddiy Python emas)
> import sys
> !{sys.executable} -m pip install librosa
> ```
> ## 💡 **`!{sys.executable} -m pip`** — ## bu **aniq shu yadroning** `pip` i. ## ⚠️ Oddiy `!pip install` — **boshqa muhitga** o'rnatishi mumkin.

### ⭐ Yadrolarni boshqarish

```bash
jupyter kernelspec list                   # ro'yxat
jupyter kernelspec remove speech_env      # o'chirish
```

```python
# ⭐ yoki Python dan
import json, subprocess

r = subprocess.run(["jupyter", "kernelspec", "list", "--json"],
                   capture_output=True, text=True)
if r.returncode == 0:
    for nom, d in json.loads(r.stdout)["kernelspecs"].items():
        print(f"  {nom:20s} {d['spec']['display_name']}")
        print(f"    {d['spec']['argv'][0]}")
else:
    print("💥 jupyter topilmadi")
```

---

## 5. 🇺🇿 Amaliy: `requirements.txt`

```bash
# ⭐ hozirgi muhitni saqlash
pip freeze > requirements.txt

# ⭐ boshqa kompyuterda tiklash
pip install -r requirements.txt
```

> ## ⚠️ **`pip freeze` NING IKKI MUAMMOSI:**
> ```
> ① HAMMA paketni yozadi — bog'liqliklarni ham
>    →  💥 fayl 200+ qatorli bo'ladi
> ② Platformaga xos paketlarni ham yozadi
>    →  💥 Windows da yozilgani Linux da ishlamaydi
> ```
>
> ## 🏆 **YAXSHIROQ — QO'LDA YOZILGAN `requirements.txt`:**
> ```
> # asosiy
> numpy>=2.0
> scipy>=1.11
> pandas>=2.0
> matplotlib>=3.7
>
> # audio
> soundfile>=0.12
> librosa>=1.0
>
> # transkripsiya
> torch>=2.0
> transformers>=4.40
>
> # baholash
> jiwer>=3.0
>
> # ixtiyoriy
> SpeechRecognition>=3.10
> gTTS>=2.4
> ```
> ## ⭐ **FAQAT TO'G'RIDAN-TO'G'RI ISHLATADIGANLARINGIZ.** ## `pip` bog'liqliklarni **o'zi** hal qiladi.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun alohida muhit kerak?

**M2.** `audioop` Python 3.14 da ishlaydimi?

**M3.** Jupyter paketni ko'rmasa — birinchi nima tekshiriladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Loyihalar **turli versiyalarni** talab qilishi mumkin. ## Global muhitda ular **bir-birini buzadi**.

**M2.** ## ✅ **Ha** — standart kutubxonadan **olib tashlangan**, ## lekin PyPI dagi **`audioop-lts`** uni qaytaradi *(o'lchandi: 0.2.2)*.

**M3.** ## `sys.executable` — ## Jupyter **qaysi Python** da ishlayapti?

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Muhit tashxis skriptini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import sys, os, json, subprocess, importlib
from pathlib import Path


def muhit_tashxis():
    """🏆 'Nima uchun ishlamayapti?' savoliga javob beradi."""
    print(f"  Python      : {sys.version.split()[0]}")
    print(f"  executable  : {sys.executable}")
    print(f"  prefix      : {sys.prefix}")
    print(f"  base_prefix : {sys.base_prefix}")

    virtual = sys.prefix != sys.base_prefix
    print(f"  {'✅ VIRTUAL muhit' if virtual else '⚠️ GLOBAL muhit'}")
    if virtual:
        print(f"     nomi: {Path(sys.prefix).name}")

    # ⭐ conda ichidamizmi?
    conda = os.environ.get("CONDA_DEFAULT_ENV")
    if conda:
        print(f"  🐍 conda muhiti: {conda}")

    # ⭐ site-packages qayerda?
    import site
    sp = site.getsitepackages()
    print(f"  site-packages: {sp[0] if sp else '?'}")

    # ⭐ olib tashlangan modullar
    print("\n  PEP 594 modullari:")
    for m in ["audioop", "aifc", "sunau", "cgi", "distutils"]:
        try:
            mod = importlib.import_module(m)
            f = getattr(mod, "__file__", "built-in")
            manba = ("⭐ PyPI backport" if "site-packages" in str(f)
                     else "standart")
            print(f"    ✅ {m:12s} {manba}")
        except Exception:
            print(f"    ⬜ {m:12s} yo'q")

    # ⭐ Jupyter yadrolari
    print("\n  JUPYTER YADROLARI:")
    try:
        r = subprocess.run(["jupyter", "kernelspec", "list", "--json"],
                           capture_output=True, text=True, timeout=15)
        if r.returncode == 0:
            for nom, d in json.loads(r.stdout)["kernelspecs"].items():
                py = d["spec"]["argv"][0]
                joriy = "  ⭐ JORIY" if py == sys.executable else ""
                print(f"    {nom:18s} {d['spec']['display_name']}{joriy}")
        else:
            print("    ⬜ jupyter topilmadi")
    except Exception as e:
        print(f"    ⬜ {type(e).__name__}")


muhit_tashxis()
```

## 🏆 **`⭐ JORIY` BELGISI — ENG QIMMATLI QATOR.** ## U *"Jupyter paketni ko'rmayapti"* muammosini ## **darhol** hal qiladi.

</details>

**M5.** ⭐ `audioop` manbasini aniqlang.

<details>
<summary>✅ Yechim</summary>

```python
import audioop, subprocess

print(f"  audioop.__file__ : {getattr(audioop, '__file__', 'built-in')}")
print(f"  paket            : {getattr(audioop, '__package__', '?')}")

r = subprocess.run(["pip", "show", "audioop-lts"],
                   capture_output=True, text=True)
if r.returncode == 0:
    for q in r.stdout.splitlines()[:4]:
        print(f"  {q}")
    print("\n  ⭐ Ya'ni bu — PyPI BACKPORT, standart kutubxona EMAS")
else:
    print("\n  ⭐ Standart kutubxonadan (Python < 3.13)")

# ⭐ kim uni talab qilyapti?
r2 = subprocess.run(["pip", "show", "SpeechRecognition"],
                    capture_output=True, text=True)
for q in r2.stdout.splitlines():
    if q.lower().startswith("requires"):
        print(f"\n  SpeechRecognition {q}")
```

```
  audioop.__file__ : ...\site-packages\audioop\__init__.py
  paket            : audioop
  Name: audioop-lts
  Version: 0.2.2

  ⭐ Ya'ni bu — PyPI BACKPORT, standart kutubxona EMAS

  SpeechRecognition Requires: audioop-lts, standard-aifc, typing-extensions
```

</details>

**M6.** ⭐ Minimal `requirements.txt` yozing va sinang.

<details>
<summary>✅ Yechim</summary>

```python
import subprocess, sys, importlib.metadata as md

TOGRIDAN = ["numpy", "scipy", "pandas", "matplotlib", "soundfile",
            "librosa", "torch", "transformers", "jiwer"]

qatorlar = ["# 🇺🇿 Nutqni tanish — minimal talablar\n"]
for p in TOGRIDAN:
    try:
        v = md.version(p)
        qatorlar.append(f"{p}>={v.split('.')[0]}.{v.split('.')[1]}")
    except Exception:
        qatorlar.append(f"# 💥 {p} — o'rnatilmagan")

open("requirements.txt", "w", encoding="utf-8").write(
    "\n".join(qatorlar) + "\n")
print("\n".join(qatorlar))

# ⭐ pip freeze bilan solishtiramiz
r = subprocess.run([sys.executable, "-m", "pip", "freeze"],
                   capture_output=True, text=True)
print(f"\n  qo'lda yozilgan : {len(TOGRIDAN)} qator")
print(f"  pip freeze      : {len(r.stdout.strip().splitlines())} qator")
```

```
  qo'lda yozilgan : 9 qator
  pip freeze      : 234 qator
```

## 💡 **FARQNI KO'RING** — **26×** — ## `pip freeze` **hamma bog'liqlikni** yozadi, ## qo'lda yozilgani — faqat **siz ishlatadiganini**.

</details>

---

## 📌 Xulosa

```bash
python -m venv speech_env
speech_env\Scripts\activate
python -m pip install --upgrade pip
pip install ipykernel
python -m ipykernel install --user --name speech_env \
    --display-name "Python (speech_env)"
```

```
⭐ MUHIT: venv (50 MB) · conda (3–5 GB) · uv (30 MB, 10–100× tez)

💥 audioop — Python 3.13+ da standart kutubxonadan OLIB TASHLANDI
✅ lekin `audioop-lts` (PyPI) uni qaytaradi
   va SpeechRecognition 3.17 uni AVTOMATIK o'rnatadi
⭐ tekshiruv: audioop.__file__ ichida "site-packages" bormi?

💥 "Jupyter paketni ko'rmayapti"  →  sys.executable ni tekshiring
⭐ yechim: !{sys.executable} -m pip install <paket>

⚠️ pip freeze  →  o'lchandi: 234 qator, platformaga xos
🏆 qo'lda yozilgan requirements.txt  →  9 qator  (26× kam)
```

---

⬅️ [1-dars. Python va Anaconda](01-Python-and-Anaconda.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Paketlarni o'rnatish](03-Installing-Packages.md)
