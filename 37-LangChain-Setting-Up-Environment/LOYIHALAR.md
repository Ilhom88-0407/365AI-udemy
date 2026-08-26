# 🚀 37-modul mini-loyihalari

> **4 ta tayyor loyiha.** Hammasi **API kalitisiz** ishlaydi.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install python-dotenv pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, re, sys, json, platform, shutil, subprocess
import importlib.util, importlib.metadata as md
from pathlib import Path
from datetime import datetime, timezone
import pandas as pd
from dotenv import load_dotenv, dotenv_values
```

---

# 🩺 1-loyiha. Muhit doktori

> **Maqsad:** *"Nima uchun ishlamayapti?"* savoliga **bir buyruq** bilan javob berish.

```python
class MuhitDoktor:
    """Muhitni to'liq tekshiradi va MUAMMONI KO'RSATADI."""

    KERAKLI = ["python-dotenv", "langchain", "langchain-core",
               "langchain-openai", "langchain-community",
               "langchain-text-splitters", "tiktoken", "openai"]

    IXTIYORIY = ["langchain-chroma", "langchain-ollama",
                 "langchain-huggingface", "langchain-classic",
                 "ipykernel", "jupyterlab"]

    def __init__(self):
        self.muammolar = []
        self.ogohlar = []

    # ── ① Python ──
    def python_tekshir(self):
        v = sys.version_info
        print(f"Python     : {sys.version.split()[0]}")
        print(f"Yo'l       : {sys.executable}")
        print(f"Platforma  : {platform.platform()}")
        if v < (3, 10):
            self.muammolar.append("Python 3.10+ kerak")
        elif v >= (3, 14):
            self.ogohlar.append("Python juda yangi — ba'zi paketlar ishlamasligi mumkin")

    # ── ② Muhit ──
    def muhit_tekshir(self):
        conda, venv = os.getenv("CONDA_DEFAULT_ENV"), os.getenv("VIRTUAL_ENV")
        if conda:
            print(f"Muhit      : conda / {conda}")
        elif venv:
            print(f"Muhit      : venv / {Path(venv).name}")
        else:
            print("Muhit      : — (global)")
            self.ogohlar.append("Virtual muhit AKTIV EMAS — global Python'da ishlayapsiz")

    # ── ③ Kodlash ──
    def kodlash_tekshir(self):
        e = sys.stdout.encoding or ""
        print(f"Kodlash    : {e}")
        if "utf" not in e.lower():
            self.muammolar.append(
                f"stdout kodlashi UTF-8 emas ({e}) — o'zbekcha matn BUZILADI.\n"
                f"      set PYTHONIOENCODING=utf-8")

    # ── ④ Paketlar ──
    def paketlar_tekshir(self):
        q = []
        for p in self.KERAKLI:
            try:
                q.append({"paket": p, "versiya": md.version(p), "holat": "✅"})
            except md.PackageNotFoundError:
                q.append({"paket": p, "versiya": "—", "holat": "❌ KERAK"})
                self.muammolar.append(f"{p} o'rnatilmagan: pip install {p}")
        for p in self.IXTIYORIY:
            try:
                q.append({"paket": p, "versiya": md.version(p), "holat": "✅"})
            except md.PackageNotFoundError:
                q.append({"paket": p, "versiya": "—", "holat": "⚪ ixtiyoriy"})
        return pd.DataFrame(q)

    # ── ⑤ LangChain versiyasi ──
    def langchain_tekshir(self):
        try:
            v = md.version("langchain")
        except md.PackageNotFoundError:
            return
        katta = int(v.split(".")[0])
        if katta >= 1:
            self.ogohlar.append(
                f"langchain {v} (1.x) — kursning langchain.chains / .memory /\n"
                f"      .output_parsers importlari ISHLAMAYDI.\n"
                f"      → pip install langchain-classic   yoki LCEL ishlating "
                f"(35-modul, 4-dars)")

    # ── ⑥ Provayderlar ──
    def provayderlar(self):
        q = []
        if os.getenv("OPENAI_API_KEY"):
            q.append(("OpenAI", "gpt-4o-mini", "💰 pullik", 1))
        if os.getenv("GOOGLE_API_KEY"):
            q.append(("Google", "gemini-2.0-flash", "bepul kvota", 2))
        if shutil.which("ollama"):
            q.append(("Ollama", "qwen2.5", "✅ BEPUL, mahalliy", 3))
        if importlib.util.find_spec("transformers"):
            q.append(("HuggingFace", "Qwen2.5-1.5B", "✅ BEPUL", 4))
        if not q:
            self.ogohlar.append(
                "Hech qanday LLM provayderi yo'q.\n"
                "      → https://ollama.com  +  ollama pull qwen2.5")
        return q

    # ── ⑦ Xavfsizlik ──
    def xavfsizlik(self, papka="."):
        p = Path(papka)
        if (p / ".env").exists():
            gi = p / ".gitignore"
            if not gi.exists():
                self.muammolar.append("💥 .env BOR, lekin .gitignore YO'Q")
            elif ".env" not in gi.read_text(encoding="utf-8"):
                self.muammolar.append("💥 .gitignore da .env YO'Q — kalit git'ga tushadi")

    # ── ⑧ Hisobot ──
    def tekshir(self, papka="."):
        print("=" * 60)
        self.python_tekshir()
        self.muhit_tekshir()
        self.kodlash_tekshir()
        print("-" * 60)
        print(self.paketlar_tekshir().to_string(index=False))
        self.langchain_tekshir()
        print("-" * 60)

        pr = self.provayderlar()
        if pr:
            for nom, m, narx, _ in pr:
                print(f"✅ {nom:12s} {m:22s} {narx}")
            eng = min(pr, key=lambda x: x[3])
            print(f"⭐ TAVSIYA: {eng[0]} ({eng[1]})")
        self.xavfsizlik(papka)

        print("=" * 60)
        if self.muammolar:
            print("💥 MUAMMOLAR:")
            for m in self.muammolar:
                print(f"   • {m}")
        if self.ogohlar:
            print("⚠️  OGOHLANTIRISHLAR:")
            for m in self.ogohlar:
                print(f"   • {m}")
        if not self.muammolar and not self.ogohlar:
            print("✅ HAMMASI JOYIDA")
        print("=" * 60)
        return not self.muammolar
```

**Ishlatish:**

```python
MuhitDoktor().tekshir()
```

> ## 🏆 **BU SINFNI `doktor.py` GA SAQLANG.**
>
> Har muammoda **birinchi** ishga tushiring. Ko'p soatlik nosozlik tuzatishni **bir buyruqqa** aylantiradi.
>
> ## 🔑 **`langchain_tekshir()` — ENG QIMMATLI METOD.** U `langchain 1.x` o'rnatilganini **darhol** aniqlaydi va **nima qilishni** aytadi *(35-modul, 4-dars)*.

---

# 🔒 2-loyiha. Maxfiylik auditi

> **Maqsad:** kalit **git'ga tushib ketmasligini** kafolatlash.

```python
class MaxfiylikAudit:
    """Sizib chiqqan kalitlarni topadi — kodda, notebookda va GIT TARIXIDA."""

    NAQSHLAR = {
        "OpenAI":      r"sk-(?:proj-)?[A-Za-z0-9_-]{20,}",
        "Anthropic":   r"sk-ant-[A-Za-z0-9_-]{20,}",
        "Google":      r"AIza[A-Za-z0-9_-]{30,}",
        "HuggingFace": r"hf_[A-Za-z0-9]{30,}",
        "AWS":         r"AKIA[0-9A-Z]{16}",
        "Slack":       r"xox[baprs]-[A-Za-z0-9-]{10,}",
    }

    TEKSHIRILADIGAN = (".py", ".ipynb", ".md", ".txt", ".json",
                       ".yaml", ".yml", ".cfg", ".ini", ".sh")

    O_TKAZILADIGAN = {".git", "node_modules", "__pycache__",
                      ".venv", "venv", ".ipynb_checkpoints"}

    def __init__(self, papka="."):
        self.p = Path(papka)
        self.topilmalar = []

    def _mask(self, m):
        return f"{m[:8]}...{m[-4:]}" if len(m) > 14 else "***"

    # ── ① Fayllar ──
    def fayllar(self):
        for f in self.p.rglob("*"):
            if (f.suffix not in self.TEKSHIRILADIGAN
                    or self.O_TKAZILADIGAN & set(f.parts)):
                continue
            try:
                t = f.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            for nom, n in self.NAQSHLAR.items():
                for m in re.findall(n, t):
                    self.topilmalar.append({
                        "manba": "fayl", "joy": str(f.relative_to(self.p)),
                        "tur": nom, "kalit": self._mask(m)})
        return self

    # ── ② Git tarixi ──
    def git_tarixi(self):
        try:
            r = subprocess.run(
                ["git", "log", "--all", "--full-history", "--name-only",
                 "--pretty=format:"],
                capture_output=True, text=True, cwd=self.p, timeout=20)
            fayllar = {x.strip() for x in r.stdout.splitlines() if x.strip()}
            for xavfli in [".env", ".env.local", "secrets.json", "config.json"]:
                if xavfli in fayllar:
                    self.topilmalar.append({
                        "manba": "git tarixi", "joy": xavfli,
                        "tur": "MAXFIY FAYL", "kalit": "—"})
        except Exception as e:
            print(f"ℹ️  git tekshiruvi o'tkazilmadi ({type(e).__name__})")
        return self

    # ── ③ .gitignore ──
    def gitignore(self):
        gi = self.p / ".gitignore"
        kerakli = [".env", "*.key", "secrets/"]
        if not gi.exists():
            if (self.p / ".env").exists():
                self.topilmalar.append({
                    "manba": ".gitignore", "joy": "—",
                    "tur": "FAYL YO'Q", "kalit": "—"})
            return self
        t = gi.read_text(encoding="utf-8")
        for k in kerakli:
            if k not in t:
                self.topilmalar.append({
                    "manba": ".gitignore", "joy": k,
                    "tur": "QATOR YO'Q", "kalit": "—"})
        return self

    # ── ④ Notebook chiqishlari ──
    def notebook_chiqishlari(self):
        for f in self.p.rglob("*.ipynb"):
            if self.O_TKAZILADIGAN & set(f.parts):
                continue
            try:
                nb = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                continue
            for i, c in enumerate(nb.get("cells", [])):
                for o in c.get("outputs", []):
                    matn = json.dumps(o)
                    for nom, n in self.NAQSHLAR.items():
                        for m in re.findall(n, matn):
                            self.topilmalar.append({
                                "manba": "notebook CHIQISHI",
                                "joy": f"{f.name} [{i}]",
                                "tur": nom, "kalit": self._mask(m)})
        return self

    def hisobot(self):
        if not self.topilmalar:
            print("✅ MAXFIYLIK AUDITI TOZA")
            return True
        print("=" * 60)
        print("💥💥 MUAMMOLAR TOPILDI")
        print(pd.DataFrame(self.topilmalar).to_string(index=False))
        print("=" * 60)
        print("NIMA QILISH KERAK:")
        print("  ① Topilgan HAR BIR kalitni DARHOL bekor qiling")
        print("  ② Yangi kalit yarating")
        print("  ③ Usage sahifasini tekshiring (g'ayrioddiy sarf?)")
        print("  ④ Git tarixidan o'chiring:")
        print("     pip install git-filter-repo")
        print("     git filter-repo --path .env --invert-paths --force")
        print("  ⑤ .gitignore ni to'g'rilang")
        print("=" * 60)
        return False

    def toliq(self):
        return (self.fayllar().notebook_chiqishlari()
                    .git_tarixi().gitignore().hisobot())
```

**Ishlatish:**

```python
MaxfiylikAudit(".").toliq()
```

> ## 🏆 **`notebook_chiqishlari()` — ENG KO'P UNUTILADIGAN JOY.**
>
> Siz `print(os.environ)` qildingiz, chiqish **notebook faylida saqlandi**, va uni **commit qildingiz**. Kod tozadek ko'rinadi — **chiqish** esa kalitni **saqlab qolgan**.
>
> ## ✅ **OLDINI OLISH:** commit'dan oldin `Kernel → Restart & Clear Output`.
>
> ## 💡 **YOKI AVTOMATLASHTIRING:**
> ```bash
> pip install nbstripout
> nbstripout --install          # git hook o'rnatadi
> ```

> ## 💥 **`git_tarixi()` — IKKINCHI ENG MUHIM.** `git rm .env` faylni **hozirgi holatdan** o'chiradi, lekin **tarixda qoladi** va **hamma ko'ra oladi**.

---

# 🏗️ 3-loyiha. Loyiha skeleti generatori

> **Maqsad:** har yangi loyihani **xavfsiz** boshlash — birinchi kundan.

```python
class LoyihaSkelet:
    """Xavfsiz LangChain loyihasining boshlang'ich strukturasi."""

    GITIGNORE = """\
# ── Maxfiy ma'lumot ──
.env
.env.*
!.env.example
*.key
*.pem
secrets/

# ── Python ──
__pycache__/
*.py[cod]
*.egg-info/
.venv/
venv/
env/
langchain_env/

# ── Jupyter ──
.ipynb_checkpoints/

# ── Ma'lumot va modellar ──
chroma_db/
*.faiss
*.sqlite3
data/xom/

# ── OT ──
.DS_Store
Thumbs.db
"""

    ENV_NAMUNA = """\
# Bu faylni ".env" deb nusxalang va kalitlaringizni qo'ying.
# ⚠️ .env HECH QACHON git'ga tushmasligi kerak!

OPENAI_API_KEY="sk-..."

# Ixtiyoriy:
# ANTHROPIC_API_KEY="sk-ant-..."
# GOOGLE_API_KEY="AIza..."
# LANGCHAIN_TRACING_V2="true"
# LANGCHAIN_API_KEY="ls__..."
"""

    KALIT_PY = '''\
"""kalit.py — API kalitlarini XAVFSIZ yuklash."""
import os
from pathlib import Path
from dotenv import load_dotenv


def kalit_yukla(fayl=".env", majburiy=(), override=True, jim=False):
    """Kalitlarni yuklaydi va tekshiradi.

    override=True  →  .env DOIM ustun turadi (jim xatoning oldini oladi)
    """
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
            f"❌ Kerakli o'zgaruvchilar yo'q: {yoq}\\n"
            f"   .env fayliga qo'shing yoki mahalliy modelga o'ting.")
    return True


def maskala(v, boshi=7, oxiri=4):
    """Kalitni jurnal/xato uchun XAVFSIZ ko'rinishga keltiradi."""
    if not v or len(v) < boshi + oxiri + 3:
        return "***"
    return f"{v[:boshi]}...{v[-oxiri:]}"
'''

    MODEL_PY = '''\
"""model.py — provayderdan MUSTAQIL model fabrikasi."""
import os
import importlib.util


def _bor(paket):
    return importlib.util.find_spec(paket) is not None


def model_yasa(provayder="auto", model=None, **kw):
    """Mavjud provayderni avtomatik tanlaydi.

    Kursda ChatOpenAI(...) yozilgan HAR YERDA shuni ishlating.
    """
    if provayder == "auto":
        if _bor("langchain_openai") and os.getenv("OPENAI_API_KEY"):
            provayder = "openai"
        elif _bor("langchain_google_genai") and os.getenv("GOOGLE_API_KEY"):
            provayder = "google"
        elif _bor("langchain_ollama"):
            provayder = "ollama"
        else:
            raise RuntimeError(
                "Hech qanday provayder yo'q.\\n"
                "  pip install langchain-ollama  &&  ollama pull qwen2.5")

    if provayder == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=model or "gpt-4o-mini", **kw)
    if provayder == "google":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model=model or "gemini-2.0-flash", **kw)
    if provayder == "ollama":
        from langchain_ollama import ChatOllama
        return ChatOllama(model=model or "qwen2.5", **kw)
    raise ValueError(provayder)
'''

    README = """\
# {nom}

## Boshlash

```bash
python -m venv .venv
.venv\\Scripts\\activate          # Windows
pip install -r requirements.txt

copy .env.example .env            # keyin kalitingizni qo'ying
```

## Struktura

```
src/kalit.py   →  API kalitlarini xavfsiz yuklash
src/model.py   →  provayderdan mustaqil model fabrikasi
data/          →  ma'lumot fayllari (git'ga tushmaydi)
```

## ⚠️ Xavfsizlik

- `.env` **hech qachon** git'ga tushmasligi kerak
- Commit'dan oldin: `Kernel → Restart & Clear Output`
- `nbstripout --install` — notebook chiqishlarini avtomatik tozalaydi
"""

    REQ = """\
langchain
langchain-core
langchain-openai
langchain-community
langchain-text-splitters
python-dotenv
tiktoken
"""

    def yarat(self, nom="mening_loyiham", versiya_bilan=True):
        p = Path(nom)
        (p / "src").mkdir(parents=True, exist_ok=True)
        (p / "data").mkdir(exist_ok=True)
        (p / "notebooks").mkdir(exist_ok=True)

        (p / ".gitignore").write_text(self.GITIGNORE, encoding="utf-8")
        (p / ".env.example").write_text(self.ENV_NAMUNA, encoding="utf-8")
        (p / "README.md").write_text(self.README.format(nom=nom), encoding="utf-8")
        (p / "src" / "kalit.py").write_text(self.KALIT_PY, encoding="utf-8")
        (p / "src" / "model.py").write_text(self.MODEL_PY, encoding="utf-8")
        (p / "src" / "__init__.py").write_text("", encoding="utf-8")

        req = self.REQ
        if versiya_bilan:
            q = []
            for satr in self.REQ.strip().splitlines():
                try:
                    q.append(f"{satr}=={md.version(satr)}")
                except md.PackageNotFoundError:
                    q.append(satr)
            req = "\n".join(q) + "\n"
        (p / "requirements.txt").write_text(req, encoding="utf-8")

        print(f"✅ {nom}/ yaratildi:\n")
        for f in sorted(p.rglob("*")):
            if f.is_file():
                print("   ", f.relative_to(p.parent))
        print(f"\n⚠️  Keyingi qadam:  copy {nom}\\.env.example {nom}\\.env")
        return p
```

**Ishlatish:**

```python
LoyihaSkelet().yarat("bank_chatbot")
```

> ## 🏆 **`versiya_bilan=True` — ENG MUHIM PARAMETR.**
>
> U `requirements.txt` ga **aynan o'rnatilgan** versiyalarni yozadi. Usiz loyihangiz **bir necha oydan keyin** ishlamay qoladi — **35-modulda ko'rgan `langchain 1.0` holati** aynan shu.

> ## 💡 **`src/model.py` — 35-MODUL 4-LOYIHASINING SODDALASHTIRILGAN VARIANTI.** Kursda `ChatOpenAI(...)` yozilgan **har yerda** `model_yasa()` ni qo'ying — kod **kalit bilan ham, kalitsiz ham** ishlaydi.

---

# 📋 4-loyiha. Muhit "snapshot" tizimi

> **Maqsad:** *"Kecha ishlayotgan edi, bugun ishlamayapti"* muammosini **hal qilish**.

```python
class MuhitSnapshot:
    """Muhit holatini SAQLAYDI va o'zgarishlarni TOPADI."""

    def __init__(self, fayl="muhit_snapshot.json"):
        self.fayl = Path(fayl)

    def _hozirgi(self):
        paketlar = {}
        for d in md.distributions():
            try:
                paketlar[d.metadata["Name"].lower()] = d.version
            except Exception:
                pass
        return {
            "vaqt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "python": sys.version.split()[0],
            "platforma": platform.platform(),
            "muhit": (os.getenv("CONDA_DEFAULT_ENV")
                      or os.getenv("VIRTUAL_ENV") or "global"),
            "paketlar": paketlar,
        }

    def saqla(self):
        s = self._hozirgi()
        self.fayl.write_text(json.dumps(s, indent=1, ensure_ascii=False),
                             encoding="utf-8")
        print(f"✅ snapshot saqlandi: {len(s['paketlar'])} paket → {self.fayl}")
        return s

    def solishtir(self):
        if not self.fayl.exists():
            print("❌ Snapshot yo'q — avval saqla() chaqiring")
            return None
        eski = json.loads(self.fayl.read_text(encoding="utf-8"))
        yangi = self._hozirgi()

        print(f"ESKI : {eski['vaqt']}   python {eski['python']}")
        print(f"YANGI: {yangi['vaqt']}   python {yangi['python']}")
        if eski["python"] != yangi["python"]:
            print(f"💥 PYTHON VERSIYASI O'ZGARDI: "
                  f"{eski['python']} → {yangi['python']}")
        if eski["muhit"] != yangi["muhit"]:
            print(f"💥 MUHIT O'ZGARDI: {eski['muhit']} → {yangi['muhit']}")

        e, y = eski["paketlar"], yangi["paketlar"]
        farqlar = []
        for k in sorted(set(e) | set(y)):
            if k not in y:
                farqlar.append({"paket": k, "eski": e[k], "yangi": "—",
                                "o'zgarish": "❌ O'CHIRILGAN"})
            elif k not in e:
                farqlar.append({"paket": k, "eski": "—", "yangi": y[k],
                                "o'zgarish": "➕ yangi"})
            elif e[k] != y[k]:
                farqlar.append({"paket": k, "eski": e[k], "yangi": y[k],
                                "o'zgarish": "🔄 YANGILANGAN"})
        if not farqlar:
            print("✅ Paketlarda o'zgarish YO'Q")
            return None
        d = pd.DataFrame(farqlar)
        print(f"\n{len(d)} ta o'zgarish:")
        print(d.to_string(index=False))

        muhim = d[d.paket.str.startswith(("langchain", "openai", "pydantic"))]
        if len(muhim):
            print("\n💥 MUHIM PAKETLAR O'ZGARDI — muammo shu yerda bo'lishi mumkin:")
            print(muhim.to_string(index=False))
        return d

    def qayta_tikla_buyrugi(self):
        """Snapshotdagi versiyalarni tiklash uchun buyruq."""
        if not self.fayl.exists():
            print("❌ Snapshot yo'q")
            return
        eski = json.loads(self.fayl.read_text(encoding="utf-8"))
        muhim = {k: v for k, v in eski["paketlar"].items()
                 if k.startswith(("langchain", "openai", "tiktoken",
                                  "pydantic", "python-dotenv"))}
        buyruq = "pip install " + " ".join(f"{k}=={v}" for k, v in sorted(muhim.items()))
        print(buyruq)
        return buyruq
```

**Ishlatish:**

```python
s = MuhitSnapshot()
s.saqla()                       # ① hozir — hamma narsa ishlayotganda

# ... bir necha hafta o'tdi, biror narsa buzildi ...

s.solishtir()                   # ② nima o'zgardi?
s.qayta_tikla_buyrugi()         # ③ eski holatga qaytarish buyrug'i
```

> ## 🏆 **BU LOYIHA `langchain 1.0` KABI HODISALAR UCHUN.**
>
> ```
> Kecha:  langchain 0.2.16   →  kod ISHLAYOTGAN edi
> Bugun:  langchain 1.3.17   →  💥 ModuleNotFoundError
>
> solishtir()  →  "🔄 langchain: 0.2.16 → 1.3.17"    ← sabab TOPILDI
> ```
>
> ## 💡 **`saqla()` NI HAR "HAMMASI ISHLAYAPTI" PAYTIDA CHAQIRING.** Bu — **bepul sug'urta**.
>
> ## ⚠️ **`requirements.txt` DAN FARQI:** `requirements.txt` — **nima kerakligi**. Snapshot — **aynan nima o'rnatilgani**, shu jumladan **tranzitiv** bog'liqliklar. Muammo ko'pincha **aynan ularda** bo'ladi.

---

## 🎯 Loyihalarni birlashtirish

```
3-loyiha (skelet)     →  loyihani XAVFSIZ boshlaysiz
        ↓
1-loyiha (doktor)     →  muhit to'g'ri sozlanganini tekshirasiz
        ↓
4-loyiha (snapshot)   →  ishlayotgan holatni SAQLAYSIZ
        ↓
2-loyiha (audit)      →  ⭐ commit'dan oldin KALIT tekshiruvi
```

> ## 🚀 **HAR LOYIHA UCHUN BIR MARTA SOZLANG:**
> ```bash
> python -c "from loyiha_skelet import LoyihaSkelet; LoyihaSkelet().yarat('yangi')"
> cd yangi
> python -c "from doktor import MuhitDoktor; MuhitDoktor().tekshir()"
> python -c "from snapshot import MuhitSnapshot; MuhitSnapshot().saqla()"
> ```

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
