# 1-dars. Anaconda muhitini sozlash

## 🎬 Boshlashdan oldin

> **"Loyihalaringiz uchun yangi muhitlar yaratish — juda tavsiya etiladigan amaliyot. Shu tarzda siz turli Python va paket versiyalarini IZOLYATSIYA qilib, potentsial versiya to'qnashuvlarining oldini olasiz."**

---

## 1. Nima uchun alohida muhit?

```
BITTA umumiy muhit                 HAR LOYIHAGA ALOHIDA muhit
──────────────────                 ──────────────────────────
loyiha A: langchain 0.1       →    loyiha A muhiti: langchain 0.1
loyiha B: langchain 1.3            loyiha B muhiti: langchain 1.3
        ↓                                  ↓
   💥 TO'QNASHUV                      ✅ MUSTAQIL
```

> ## 🔑 **VA BU KURS UCHUN AYNIQSA MUHIM** *(35-modul, 4-dars)*:
> ```
> Kurs kodi     →  langchain 0.1 / 0.2 kutadi
> Yangi loyiha  →  langchain 1.3 kerak
> ```
> **Ikkalasini bir muhitda saqlab bo'lmaydi.** Alohida muhit — **yagona** yechim.

---

## 2. Kursdagi yo'l — `conda`

> **"Anaconda promptni oching. Keyin `conda create --name` yozib yangi muhit yarating. Unga tavsiflovchi nom bering. Men `langchain_env` ni tanlayman. Nihoyat, o'rnatmoqchi bo'lgan Python versiyasini ko'rsating. Bu kursda men Python 3.10 ni tanladim."**

```bash
conda create --name langchain_env python=3.10
conda env list                       # ro'yxatni tekshirish
conda activate langchain_env
python --version
```

```bash
pip install openai python-dotenv ipykernel jupyterlab notebook
```

> **"Birinchisi OpenAI API'ga chaqiruvlar qilishga imkon beradi. Ikkinchisi bilan OpenAI API kalitini muhit o'zgaruvchisi sifatida osongina o'rnatishimiz mumkin. Oxirgi uchtasi bu muhitni Jupyter Notebook'ga kernel sifatida qo'shish uchun kerak."**

```bash
python -m ipykernel install --user --name langchain_env
```

> ## ✅ **BU YO'L ISHLAYDI.** Lekin **yagona** emas va **eng yengil** ham emas.

---

## 3. ⭐⭐ Uchta muqobil — kursda YO'Q

### ① `venv` — Python bilan BIRGA keladi

```bash
python -m venv langchain_env

# Windows
langchain_env\Scripts\activate
# Linux / macOS
source langchain_env/bin/activate

pip install openai python-dotenv ipykernel jupyterlab notebook
python -m ipykernel install --user --name langchain_env
```

> ## ✅ **AFZALLIKLARI:**
> ```
> ✅ Anaconda O'RNATISH SHART EMAS  (Anaconda ~3 GB!)
> ✅ Python bilan BIRGA keladi
> ✅ Loyiha papkasida turadi — ko'chirish oson
> ```
> ## ⚠️ **KAMCHILIGI:** ilmiy paketlarni *(`numpy`, `scipy`)* kompilyatsiya qilishi mumkin — `conda` ularni **tayyor** beradi.

### ② `uv` — ⭐ ENG TEZ *(2024-dan)*

```bash
pip install uv                       # yoki: winget install astral-sh.uv

uv venv langchain_env
langchain_env\Scripts\activate       # Windows
uv pip install openai python-dotenv ipykernel jupyterlab notebook
```

> ## 🏆 **`uv` — `pip` dan 10–100× TEZ.** Rust'da yozilgan. LangChain kabi **ko'p bog'liqlikli** paketlarda farq **sezilarli**.
>
> ## 💡 **Sintaksis `pip` bilan BIR XIL** — o'rganish kerak emas.

### ③ Loyiha fayli bilan — takrorlanuvchanlik

```bash
# requirements.txt yarating
pip freeze > requirements.txt

# Boshqa kompyuterda:
pip install -r requirements.txt
```

> ## ⚠️⚠️ **KURS BUNI AYTMAYDI — LEKIN BU JIDDIY MUAMMO.**
>
> Kurs `pip install langchain` deydi, **versiyani ko'rsatmaydi**. Natijada:
> ```
> 2024-yilda o'rnatgan talaba  →  langchain 0.1   ✅ kurs kodi ishlaydi
> 2026-yilda o'rnatgan talaba  →  langchain 1.3   ❌ kod ISHLAMAYDI
> ```
>
> ## ✅ **VERSIYANI QOTIRING:**
> ```
> # requirements.txt — kurs kodini ISHLATISH uchun
> langchain-classic==1.0.8
> langchain==1.3.17
> langchain-openai==1.6.0
> langchain-core==1.6.0
> python-dotenv
> tiktoken
> ```
> ## 🔑 **`requirements.txt` — LOYIHANGIZNING ENG MUHIM FAYLLARIDAN BIRI.** Usiz kodingiz **bir necha oydan keyin** ishlamay qoladi.

---

## 4. ⚠️ Python versiyasi — kurs 3.10 deydi

> **"Bu kursda men Python 3.10 ni tanladim."**

```
Kurs davri (2024)  →  Python 3.10  ✅ to'g'ri edi
Bugun              →  Python 3.11 / 3.12  ⭐ tavsiya
```

> ## ⚠️ **ENG YANGI VERSIYANI OLMANG.** Python 3.14 chiqqanda ko'p paket **hali qo'llab-quvvatlamaydi**.
>
> ## 🔑 **QOIDA:** eng yangi versiyadan **bitta yoki ikkita** orqada turing.
> ```
> ✅ 3.11 · 3.12   →  barqaror, hamma paket ishlaydi
> ⚠️ 3.13          →  ba'zi paketlar hali tayyor emas
> ❌ 3.14          →  ko'p paket ishlamaydi
> ```

---

## 5. Kernelni tekshiramiz

```bash
jupyter kernelspec list
```

```
Available kernels:
  langchain_env    C:\Users\...\jupyter\kernels\langchain_env
  python3          C:\Users\...\share\jupyter\kernels\python3
```

> ## ⚠️ **ENG KO'P UCHRAYDIGAN XATO — NOTO'G'RI KERNEL.**
>
> ```
> Terminalda:   pip install langchain     →  langchain_env ga o'rnatildi
> Notebookda:   import langchain          →  ModuleNotFoundError!
>                                             (chunki python3 kerneli tanlangan)
> ```
>
> ## ✅ **DOIM TEKSHIRING — notebook ichida:**
> ```python
> import sys
> print(sys.executable)
> print(sys.version)
> ```
> Yo'lda `langchain_env` **bo'lishi kerak**.

> ## 💡 **VA ENG ISHONCHLI USUL — NOTEBOOK ICHIDAN O'RNATISH:**
> ```python
> import sys
> !{sys.executable} -m pip install langchain-openai
> ```
> `{sys.executable}` **aynan joriy kernel** ga o'rnatishni **kafolatlaydi**.

---

## 6. 🇺🇿 Windows'da uchraydigan muammolar

```
① UTF-8 kodlash
   Windowsda standart kodlash — cp1251
   O'zbekcha matn BUZILADI

   ✅ Yechim:
      set PYTHONIOENCODING=utf-8         (cmd)
      $env:PYTHONIOENCODING="utf-8"      (PowerShell)

   Kodda esa DOIM:
      open(fayl, encoding="utf-8")
```

```
② Uzun yo'l cheklovi (260 belgi)
   conda muhitlar chuqur papkalarda bo'lsa — xato

   ✅ Yechim: muhitni C:\envs\ kabi QISQA yo'lga qo'ying
      conda create --prefix C:\envs\langchain_env python=3.11
```

```
③ PowerShell'da activate ishlamaydi
   ✅ Yechim:  conda init powershell
              (keyin terminalni QAYTA OCHING)
```

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun alohida muhit kerak?

**M2.** `ipykernel` nima uchun?

**M3.** Kurs qaysi Python versiyasini tanlaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Turli loyihalarning **paket versiyalarini ajratish** uchun. Bu kursda — **hal qiluvchi**, chunki kurs kodi `langchain 0.1` ni kutadi.

**M2.** Muhitni **Jupyter kerneli** sifatida ro'yxatga qo'shish uchun.

**M3.** ## **3.10**. Bugun **3.11 / 3.12** tavsiya etiladi.

</details>

### 🟡 O'rta

**M4.** ⭐ Notebook qaysi Python'da ishlayotganini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import sys, platform
print("Python  :", sys.version.split()[0])
print("Yo'l    :", sys.executable)
print("Platforma:", platform.platform())
print("\n⚠️ Yo'lda muhit nomi BO'LISHI kerak!")
```

</details>

**M5.** ⭐ O'rnatilgan paketlar versiyasini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
import importlib.metadata as md

PAKETLAR = ["openai", "python-dotenv", "langchain", "langchain-core",
            "langchain-openai", "langchain-community", "tiktoken"]
for p in PAKETLAR:
    try:
        print(f"{p:22s} {md.version(p)}")
    except md.PackageNotFoundError:
        print(f"{p:22s} ❌ o'rnatilmagan")
```

## 💡 **BU RO'YXATNI SAQLANG.** Muammo chiqqanda — **birinchi** tekshiradigan narsa.

</details>

**M6.** ⭐⭐ `requirements.txt` yarating.

<details>
<summary>✅ Yechim</summary>

```bash
pip freeze > requirements.txt
```

⚠️ **`pip freeze` HAMMA narsani yozadi** — shu jumladan **tranzitiv** bog'liqliklarni. Aniqroq usul:

```bash
pip install pipreqs
pipreqs . --force            # faqat KODDA ishlatilganlarini yozadi
```

## 🔑 **YOKI QO'LDA — eng ishonchli:**
```
langchain==1.3.17
langchain-core==1.6.0
langchain-openai==1.6.0
python-dotenv
tiktoken
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Muhit diagnostikasi skriptini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import sys, os, platform, importlib.metadata as md

def diagnostika(paketlar=None):
    print("=" * 56)
    print(f"Python     : {sys.version.split()[0]}")
    print(f"Yo'l       : {sys.executable}")
    print(f"Platforma  : {platform.platform()}")
    print(f"Kodlash    : {sys.getdefaultencoding()} / "
          f"{sys.stdout.encoding}")
    print(f"CONDA_ENV  : {os.getenv('CONDA_DEFAULT_ENV', '— (venv yoki global)')}")
    print(f"VIRTUAL_ENV: {os.getenv('VIRTUAL_ENV', '—')}")

    v = sys.version_info
    if v < (3, 10):
        print("⚠️  Python 3.10+ tavsiya etiladi")
    elif v >= (3, 14):
        print("⚠️  Juda yangi — ba'zi paketlar ishlamasligi mumkin")
    else:
        print("✅ Python versiyasi mos")

    if not (os.getenv("CONDA_DEFAULT_ENV") or os.getenv("VIRTUAL_ENV")):
        print("⚠️  MUHIT AKTIV EMAS — global Python'da ishlayapsiz!")

    print("-" * 56)
    for p in (paketlar or ["openai", "python-dotenv", "langchain",
                           "langchain-core", "langchain-openai", "tiktoken"]):
        try:
            print(f"✅ {p:22s} {md.version(p)}")
        except md.PackageNotFoundError:
            print(f"❌ {p:22s} o'rnatilmagan")
    print("=" * 56)

diagnostika()
```

## 🏆 **BU SKRIPTNI `diagnostika.py` FAYLIGA SAQLANG.** Har muammoda **birinchi** ishga tushiring — vaqtingizni **soatlab** tejaydi.

</details>

**M8.** ⭐⭐ `uv` bilan muhit yarating va tezlikni solishtiring.

<details>
<summary>✅ Yechim</summary>

```bash
# pip bilan
time pip install langchain langchain-openai

# uv bilan
pip install uv
time uv pip install langchain langchain-openai
```

## 🏆 **`uv` odatda 10–100× tez.** LangChain'da bog'liqliklar **ko'p** — farq **sezilarli**.

</details>

---

## 🧠 O'zini tekshirish

<details>
<summary>❓ Anaconda shartmi?</summary>

**Yo'q.** `venv` *(Python bilan birga keladi)* yoki `uv` *(eng tez)* **yetadi**. Anaconda ~3 GB joy oladi.
</details>

<details>
<summary>❓ Nima uchun `pip install` qilgandim, lekin notebook topmayapti?</summary>

**Noto'g'ri kernel.** Notebookda `import sys; print(sys.executable)` ni ishga tushiring — yo'lda **muhit nomi** bo'lishi kerak.
</details>

<details>
<summary>❓ Nima uchun versiyani qotirish kerak?</summary>

Chunki paketlar **buzuvchi o'zgarishlar** kiritadi. Kursning `langchain 0.1` kodi `1.3` da **ishlamaydi** *(35-modul, 4-dars)*.
</details>

---

## 📌 Xulosa

```
① MUHIT YARATISH
   conda create --name langchain_env python=3.11     (kurs)
   python -m venv langchain_env                       (yengil)
   uv venv langchain_env                              ⭐ tez

② AKTIVLASHTIRISH
   conda activate langchain_env
   langchain_env\Scripts\activate                     (Windows venv)

③ PAKETLAR
   pip install openai python-dotenv ipykernel jupyterlab notebook

④ KERNEL
   python -m ipykernel install --user --name langchain_env

⑤ ⭐ VERSIYALARNI QOTIRING
   requirements.txt  ←  usiz kod bir necha oydan keyin ISHLAMAYDI
```

| | Kurs | Biz qo'shdik |
|---|---|---|
| `conda` | ✅ | ✅ + `venv`, `uv` |
| Python 3.10 | ✅ | ⚠️ **3.11 / 3.12** |
| `requirements.txt` | ❌ | ## ✅ **shart** |
| Kernel tekshiruvi | ❌ | ✅ `sys.executable` |
| Windows/UTF-8 | ❌ | ## ✅ 🇺🇿 **muhim** |

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Virtual muhit | Virtual environment | Izolyatsiyalangan Python **o'rnatmasi** |
| Kernel | Kernel | Notebook ishlatadigan **Python jarayoni** |
| Bog'liqlik | Dependency | Loyihangiz talab qiladigan **paket** |
| Versiyani qotirish | Version pinning | Aniq versiyani **belgilash** |
| Takrorlanuvchanlik | Reproducibility | Kod **boshqa joyda ham** ishlashi |

---

⬅️ [36-modul. Tokenlar va narxlar](../36-LangChain-Tokens-Models-Prices/README.md) · 🏠 [Modul boshiga](README.md) · ➡️ [2-dars. OpenAI API kalitini olish](02-Obtaining-an-OpenAI-API-Key.md)
