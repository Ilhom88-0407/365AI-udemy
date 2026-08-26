# 📝 37-modul mashqlari

> **28 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **HAMMASI API KALITISIZ** — bu modul **muhit** haqida, model haqida emas.

## ⚙️ Tayyorgarlik

```bash
pip install python-dotenv pandas
```

```python
import os, re, sys, platform, subprocess
import importlib.metadata as md
from pathlib import Path
from dotenv import load_dotenv, dotenv_values
```

> ## 💡 **Sinov `.env` fayli** — mashqlar uchun:

```python
Path(".env").write_text(
    'OPENAI_API_KEY="sk-test-abc123"\n'
    'MENING_KALITIM=oddiy_qiymat\n'
    '# izoh satri\n'
    "BOSHQA = \"bo'shliq bilan\"\n", encoding="utf-8")
```

---

# 🟢 OSON *(1–10)*

**M1.** Nima uchun alohida virtual muhit kerak?

**M2.** `ipykernel` nima uchun?

**M3.** Muhit o'zgaruvchisi qayerda yashaydi?

**M4.** API kalitini necha marta ko'rish mumkin?

**M5.** ChatGPT Plus API'ga kirish beradimi?

<details>
<summary>✅ Javoblar M1–M5</summary>

**M1.** Turli loyihalarning **paket versiyalarini ajratish** uchun. Bu kursda **hal qiluvchi** — kurs kodi `langchain 0.1` ni kutadi.

**M2.** Muhitni **Jupyter kerneli** sifatida ro'yxatga qo'shish uchun.

**M3.** ## **Jarayon ichida.** Kernel qayta ishga tushsa — **yo'qoladi**.

**M4.** ## **Bir marta** — yaratilgan paytda.

**M5.** ## ❌ **Yo'q.** Bular **alohida** xizmatlar.

</details>

**M6.** `%dotenv` qayerda ishlaydi?

**M7.** `.gitignore` ga nima qo'shish kerak?

**M8.** `load_dotenv()` ning `override` standart qiymati?

**M9.** Kalit sizib chiqsa birinchi qadam?

**M10.** API kalitisiz kursni davom ettirish mumkinmi?

<details>
<summary>✅ Javoblar M6–M10</summary>

**M6.** ## **Faqat Jupyter'da** *(IPython sehrli buyrug'i)*. `.py` da — `load_dotenv()`.

**M7.** ## `.env`, `.env.*`, `!.env.example`, `*.key`, `secrets/`.

**M8.** ## **`False`** — mavjud o'zgaruvchi **ustun** turadi *(jim xato manbai!)*.

**M9.** ## **Darhol BEKOR QILING** *(revoke)*, keyin yangisini yarating va **git tarixidan** o'chiring.

**M10.** ## ✅ **Ha** — Ollama / Google AI Studio / HuggingFace bilan. Kod **95%** o'zgarishsiz.

</details>

---

# 🟡 O'RTA *(11–21)*

**M11.** ⭐ Notebook qaysi Python'da ishlayotganini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import sys, platform
print("Python   :", sys.version.split()[0])
print("Yo'l     :", sys.executable)
print("Platforma:", platform.platform())
print("Kodlash  :", sys.stdout.encoding)
```

## ⚠️ **Yo'lda muhit nomi BO'LISHI kerak.** Aks holda siz **global** Python'da ishlayapsiz.

</details>

**M12.** ⭐ Paketlar versiyasini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
PAKETLAR = ["openai", "python-dotenv", "langchain", "langchain-core",
            "langchain-openai", "langchain-community", "tiktoken",
            "ipykernel", "jupyterlab"]
for p in PAKETLAR:
    try:
        print(f"✅ {p:22s} {md.version(p)}")
    except md.PackageNotFoundError:
        print(f"❌ {p:22s} o'rnatilmagan")
```

</details>

**M13.** ⭐ Muhit o'zgaruvchilarini XAVFSIZ ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
# ❌ XAVFLI
# print(os.environ)

# ✅ XAVFSIZ — faqat NOMLAR
print(f"jami: {len(os.environ)}")
print(sorted(os.environ.keys())[:20])

# ✅ Tanlangan qiymatlarni maskalab
for k in ["OPENAI_API_KEY", "GOOGLE_API_KEY", "ANTHROPIC_API_KEY"]:
    v = os.getenv(k)
    print(f"{k:22s}", f"{v[:7]}...{v[-4:]}" if v else "— yo'q")
```

</details>

**M14.** ⭐⭐ `dotenv_values()` va `load_dotenv()` farqini ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
os.environ.pop("BOSHQA", None)
print("dotenv_values:", dict(dotenv_values(".env")))
print("os.getenv('BOSHQA'):", os.getenv("BOSHQA"))     # None — muhit O'ZGARMADI
load_dotenv()
print("load_dotenv keyin :", os.getenv("BOSHQA"))
```

## 🔑 **`dotenv_values()` — muhitni O'ZGARTIRMAY o'qiydi.** Nosozlik tuzatishda **xavfsiz**.

</details>

**M15.** ⭐⭐ `override` xatti-harakatini sinang.

<details>
<summary>✅ Yechim</summary>

```python
os.environ["MENING_KALITIM"] = "QO'LDA"
load_dotenv()
print("override=False:", os.getenv("MENING_KALITIM"))
load_dotenv(override=True)
print("override=True :", os.getenv("MENING_KALITIM"))
```

```
override=False: QO'LDA
override=True : oddiy_qiymat
```

## 💥 **`.env` ni tahrirlab `load_dotenv()` chaqirsangiz — ESKI qiymat qoladi.** Bu — **jim xato**.

</details>

**M16.** ⭐ `.env` faylini Python bilan yarating va tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
Path(".env").write_text('OPENAI_API_KEY="sk-test-123"\n', encoding="utf-8")
print("mavjud:", Path(".env").exists())
print("nomlar:", [p.name for p in Path(".").iterdir() if "env" in p.name.lower()])
```

## ⚠️ **Agar `.env.txt` ko'rsangiz** — Notepad `.txt` qo'shib yuborgan. **Qayta nomlang.**

</details>

**M17.** ⭐ Kalitni maskalab chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
def maskala(v, b=7, o=4):
    return "***" if not v or len(v) < b + o + 3 else f"{v[:b]}...{v[-o:]}"

print(maskala(os.getenv("OPENAI_API_KEY", "")))
print(maskala("qisqa"))
```

## 🔑 **JURNAL VA XATO XABARLARIDA DOIM MASKALANG.**

</details>

**M18.** ⭐ `.gitignore` yarating.

<details>
<summary>✅ Yechim</summary>

```python
Path(".gitignore").write_text("""\
# Maxfiy
.env
.env.*
!.env.example
*.key
secrets/

# Python
__pycache__/
*.py[cod]
.venv/
venv/
langchain_env/

# Jupyter
.ipynb_checkpoints/

# Ma'lumot
chroma_db/
*.faiss
""", encoding="utf-8")
print("✅ yaratildi")
```

</details>

**M19.** ⭐ `.env.example` yarating.

<details>
<summary>✅ Yechim</summary>

```python
Path(".env.example").write_text("""\
# Bu faylni .env deb nusxalang va kalitlaringizni qo'ying
OPENAI_API_KEY="sk-..."
# GOOGLE_API_KEY="AIza..."
# ANTHROPIC_API_KEY="sk-ant-..."
""", encoding="utf-8")
```

## 🔑 **Jamoa ishi uchun STANDART.** Yangi dasturchi **qanday** o'zgaruvchilar kerakligini **darhol** biladi.

</details>

**M20.** ⭐ Kalit tekshiruvchini sinang.

<details>
<summary>✅ Yechim</summary>

```python
NAQSHLAR = {
    "OpenAI":      r"sk-[A-Za-z0-9_-]{20,}",
    "Anthropic":   r"sk-ant-[A-Za-z0-9_-]{20,}",
    "Google":      r"AIza[A-Za-z0-9_-]{30,}",
    "HuggingFace": r"hf_[A-Za-z0-9]{30,}",
}

def kalit_qidir(matn):
    return [(n, m[:8] + "..." + m[-4:])
            for n, p in NAQSHLAR.items() for m in re.findall(p, matn)]

SINOV = """client = OpenAI(api_key="sk-proj-abcdefghij1234567890KLMNOP")
Google: AIzaSyD-1234567890abcdefghijklmnopqrstuv"""
for n, m in kalit_qidir(SINOV):
    print(f"💥 {n}: {m}")
```

```
💥 OpenAI: sk-proj-...MNOP
💥 Google: AIzaSyD-...stuv
```

</details>

**M21.** ⭐ Muhit aktivligini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
conda = os.getenv("CONDA_DEFAULT_ENV")
venv  = os.getenv("VIRTUAL_ENV")
if conda:
    print(f"✅ conda muhiti: {conda}")
elif venv:
    print(f"✅ venv muhiti: {venv}")
else:
    print("⚠️  MUHIT AKTIV EMAS — global Python'da ishlayapsiz!")
```

</details>

---

# 🔴 QIYIN *(22–28)*

**M22.** ⭐⭐ To'liq muhit diagnostikasi.

<details>
<summary>✅ Yechim</summary>

```python
def diagnostika(paketlar=None):
    print("=" * 56)
    print(f"Python     : {sys.version.split()[0]}")
    print(f"Yo'l       : {sys.executable}")
    print(f"Platforma  : {platform.platform()}")
    print(f"Kodlash    : {sys.stdout.encoding}")
    print(f"CONDA_ENV  : {os.getenv('CONDA_DEFAULT_ENV', '—')}")
    print(f"VIRTUAL_ENV: {os.getenv('VIRTUAL_ENV', '—')}")

    v = sys.version_info
    print("✅ Python versiyasi mos" if (3, 10) <= v < (3, 14)
          else "⚠️  Python versiyasi tavsiya etilgan oraliqdan tashqarida")

    if not (os.getenv("CONDA_DEFAULT_ENV") or os.getenv("VIRTUAL_ENV")):
        print("⚠️  MUHIT AKTIV EMAS")
    if sys.stdout.encoding and "utf" not in sys.stdout.encoding.lower():
        print("⚠️  UTF-8 EMAS — o'zbekcha matn buzilishi mumkin")
        print("    set PYTHONIOENCODING=utf-8")

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

## 🏆 **`diagnostika.py` GA SAQLANG.** Har muammoda **birinchi** ishga tushiring.

</details>

**M23.** ⭐⭐ Xavfsizlik auditi.

<details>
<summary>✅ Yechim</summary>

```python
def xavfsizlik_auditi(papka="."):
    p, muammolar = Path(papka), []

    if (p / ".env").exists():
        gi = p / ".gitignore"
        if not gi.exists():
            muammolar.append("💥 .gitignore YO'Q, .env esa BOR")
        elif ".env" not in gi.read_text(encoding="utf-8"):
            muammolar.append("💥 .gitignore da .env YO'Q")

    NAQSH = re.compile(r"(sk-[A-Za-z0-9_-]{20,}|AIza[A-Za-z0-9_-]{30,})")
    for f in p.rglob("*"):
        if f.suffix not in (".py", ".ipynb", ".md", ".txt") or ".git" in f.parts:
            continue
        try:
            for m in NAQSH.findall(f.read_text(encoding="utf-8", errors="ignore")):
                muammolar.append(f"💥 KALIT: {f} → {m[:8]}...{m[-4:]}")
        except Exception:
            pass

    try:
        r = subprocess.run(["git", "log", "--all", "--full-history", "--", ".env"],
                           capture_output=True, text=True, cwd=papka, timeout=10)
        if r.stdout.strip():
            muammolar.append("💥 .env GIT TARIXIDA — kalitni BEKOR QILING")
    except Exception:
        pass

    print("\n".join(muammolar) if muammolar else "✅ Audit toza")
    return muammolar

xavfsizlik_auditi()
```

</details>

**M24.** ⭐⭐ Kalit boshqaruvchisi sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

class KalitBoshqaruv:
    PROVAYDERLAR = {
        "openai":    ("OPENAI_API_KEY",    "sk-"),
        "anthropic": ("ANTHROPIC_API_KEY", "sk-ant-"),
        "google":    ("GOOGLE_API_KEY",    "AIza"),
        "hf":        ("HUGGINGFACE_TOKEN", "hf_"),
    }

    def __init__(self, fayl=".env", override=True):
        if Path(fayl).exists():
            load_dotenv(fayl, override=override)

    def mavjudlar(self):
        n = []
        for p, (k, pre) in self.PROVAYDERLAR.items():
            v = os.getenv(k)
            if v:
                n.append({"provayder": p, "o'zgaruvchi": k,
                          "kalit": f"{v[:7]}...{v[-4:]}",
                          "format": "✅" if v.startswith(pre) else "⚠️ prefiks"})
        return n

    def hisobot(self):
        n = self.mavjudlar()
        if not n:
            print("❌ Kalit topilmadi → Ollama'ga o'ting")
            return
        print(pd.DataFrame(n).to_string(index=False))

    def talab(self, provayder):
        k, _ = self.PROVAYDERLAR[provayder]
        v = os.getenv(k)
        if not v:
            raise RuntimeError(f"❌ {k} topilmadi. .env fayliga qo'shing.")
        return v

KalitBoshqaruv().hisobot()
```

</details>

**M25.** ⭐⭐ `requirements.txt` ni versiya bilan yarating.

<details>
<summary>✅ Yechim</summary>

```python
KERAKLI = ["langchain", "langchain-core", "langchain-openai",
           "langchain-community", "langchain-text-splitters",
           "python-dotenv", "tiktoken"]

qatorlar = []
for p in KERAKLI:
    try:
        qatorlar.append(f"{p}=={md.version(p)}")
    except md.PackageNotFoundError:
        qatorlar.append(f"# {p}   (o'rnatilmagan)")

Path("requirements.txt").write_text("\n".join(qatorlar) + "\n", encoding="utf-8")
print("\n".join(qatorlar))
```

## 🔑 **VERSIYASIZ `requirements.txt` — FOYDASIZ.** Bir necha oydan keyin **boshqa** versiyalar o'rnatiladi va kod **ishlamaydi**.

</details>

**M26.** ⭐⭐ Provayder tanlash yordamchisi.

<details>
<summary>✅ Yechim</summary>

```python
import importlib.util, shutil

def provayder_maslahati():
    v = []
    if os.getenv("OPENAI_API_KEY"):
        v.append(("OpenAI", "gpt-4o-mini", "💰 pullik", 1))
    if os.getenv("GOOGLE_API_KEY"):
        v.append(("Google", "gemini-2.0-flash", "bepul kvota", 2))
    if shutil.which("ollama"):
        v.append(("Ollama", "qwen2.5", "✅ BEPUL, mahalliy", 3))
    if importlib.util.find_spec("transformers"):
        v.append(("HuggingFace", "Qwen2.5-1.5B", "✅ BEPUL", 4))

    if not v:
        print("❌ Hech narsa topilmadi.\n"
              "  1) https://ollama.com\n"
              "  2) ollama pull qwen2.5\n"
              "  3) pip install langchain-ollama")
        return None
    for nom, m, narx, _ in v:
        print(f"✅ {nom:12s} {m:22s} {narx}")
    eng = min(v, key=lambda x: x[3])
    print(f"\n⭐ TAVSIYA: {eng[0]} ({eng[1]})")
    return eng

provayder_maslahati()
```

</details>

**M27.** ⭐⭐⭐ Xavfsiz kalit yuklovchini yozing.

<details>
<summary>✅ Yechim</summary>

```python
def kalit_yukla(fayl=".env", majburiy=("OPENAI_API_KEY",), override=True,
                jim=False):
    p = Path(fayl)
    if p.exists():
        load_dotenv(p, override=override)
        if not jim:
            print(f"✅ {fayl} yuklandi")
    elif not jim:
        print(f"ℹ️  {fayl} topilmadi — tizim o'zgaruvchilari ishlatiladi")

    yoq = [k for k in majburiy if not os.getenv(k)]
    if yoq:
        raise RuntimeError(
            f"❌ Kerakli o'zgaruvchilar yo'q: {yoq}\n"
            f"   .env fayliga qo'shing yoki Ollama'ga o'ting")

    if not jim:
        for k in majburiy:
            v = os.getenv(k)
            print(f"   {k}: {v[:7]}...{v[-4:]}  ({len(v)} belgi)")
    return True

kalit_yukla(majburiy=("OPENAI_API_KEY",))
```

## 🏆 **TO'RTTA HIMOYA:** tushunarli xabar · darhol to'xtash · `override=True` · **maskalash**.

</details>

**M28.** ⭐⭐⭐ Loyiha skeletini yaratuvchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
def loyiha_yarat(nom="mening_loyiham"):
    p = Path(nom)
    (p / "src").mkdir(parents=True, exist_ok=True)
    (p / "data").mkdir(exist_ok=True)

    (p / ".gitignore").write_text(
        ".env\n.env.*\n!.env.example\n*.key\nsecrets/\n"
        "__pycache__/\n.venv/\nvenv/\n.ipynb_checkpoints/\n"
        "chroma_db/\n", encoding="utf-8")

    (p / ".env.example").write_text(
        '# .env deb nusxalang\nOPENAI_API_KEY="sk-..."\n', encoding="utf-8")

    (p / "requirements.txt").write_text(
        "langchain\nlangchain-core\nlangchain-openai\n"
        "python-dotenv\ntiktoken\n", encoding="utf-8")

    (p / "src" / "kalit.py").write_text('''\
import os
from pathlib import Path
from dotenv import load_dotenv


def kalit_yukla(fayl=".env", majburiy=("OPENAI_API_KEY",), override=True):
    if Path(fayl).exists():
        load_dotenv(fayl, override=override)
    yoq = [k for k in majburiy if not os.getenv(k)]
    if yoq:
        raise RuntimeError(f"Kerakli o'zgaruvchilar yo'q: {yoq}")
    return True


def maskala(v, b=7, o=4):
    return "***" if not v or len(v) < b + o + 3 else f"{v[:b]}...{v[-o:]}"
''', encoding="utf-8")

    print(f"✅ {nom}/ yaratildi:")
    for f in sorted(p.rglob("*")):
        print("   ", f.relative_to(p.parent))

loyiha_yarat()
```

## 🏆 **HAR YANGI LOYIHANI SHU SKELET BILAN BOSHLANG.** `.gitignore` va `.env.example` — **birinchi kundan**.

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
