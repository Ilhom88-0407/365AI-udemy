# 3-dars. Kalitni muhit o'zgaruvchisi qilish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Muhit o'zgaruvchisi — operatsion tizim ishlatadigan KALIT-QIYMAT juftligi, bunda kalit o'zgaruvchi nomiga, qiymat esa bizning holatimizda OpenAI API kalitiga to'g'ri keladi."**

---

## 1. Muhit o'zgaruvchisi nima?

```
KALIT                 =  QIYMAT
─────                    ──────
PATH                  =  C:\Windows\System32;C:\Python311;...
HOME / HOMEPATH       =  C:\Users\admin
OPENAI_API_KEY        =  sk-...
```

```python
import os

print("jami o'zgaruvchilar:", len(os.environ))
for k in ["PATH", "HOME", "HOMEPATH", "USERNAME", "CONDA_DEFAULT_ENV"]:
    v = os.getenv(k)
    print(f"{k:20s}", str(v)[:44] if v else "— (yo'q)")
```

> ## ⚠️⚠️ **KURS `os.environ.items()` NI CHOP ETISHNI TAKLIF QILADI — EHTIYOT BO'LING.**
>
> O'qituvchining o'zi ham aytadi: *"Men bu katakni ishga tushirmayman, muhit o'zgaruvchilarimni ommaga ko'rsatmaslik uchun."*
>
> ## 💥 **VA BU — HAQIQIY XAVF.** Notebookda `print(os.environ)` qilsangiz va uni **commit qilsangiz** — kalitingiz **GitHub'da**.
>
> ## ✅ **XAVFSIZ USUL — FAQAT NOMLARNI chiqaring:**
> ```python
> print(sorted(os.environ.keys()))       # qiymatlarsiz
> ```

---

## 2. Nima uchun kalit KODDA turmasligi kerak?

![Kalit qayerda](assets/01-muhit.svg)

> **"Uning qiymatini QATTIQ KODLASH kutilmagan oshkor bo'lish xavfini tug'diradi — masalan, kodingizni do'stlaringiz yoki hamkasblaringiz bilan bo'lishganingizda. Bu jiddiy xavfsizlik muammosi, chunki OpenAI modellarini API orqali chaqirish tokenlardan foydalanishga to'g'ri keladi — bu esa PULLIK xizmat."**

```python
# ❌❌ HECH QACHON BUNDAY QILMANG
client = OpenAI(api_key="sk-proj-abc123...")

# ⚠️ BU HAM YOMON — kod ichida
os.environ["OPENAI_API_KEY"] = "sk-proj-abc123..."

# ✅ TO'G'RI — fayldan o'qish
from dotenv import load_dotenv
load_dotenv()
```

> ## 🔑 **VA YANA BIR SABAB — TOZA KOD:**
> ```
> Kalit KODDA     →  o'zgartirish uchun HAMMA faylni tahrirlash
> Kalit .env DA   →  ⭐ BITTA joyda o'zgartirasiz
> ```

---

## 3. Kursning birinchi usuli — `os.environ[...]`

> **"Muhit o'zgaruvchisini o'rnatishning bir yo'li — `os.environ` yozib, keyin qavslar ichida o'zgaruvchi nomini satr sifatida ko'rsatish. OpenAI moduli kutadigan nom — `OPENAI_API_KEY`, katta harflarda."**

```python
import os
os.environ["OPENAI_API_KEY"] = "sk-..."       # ⚠️ kodda TURIBDI
```

> **"Endi kernelni qayta ishga tushiring... Kernel qayta ishga tushirilgandan so'ng `OPENAI_API_KEY` o'zgaruvchisi YO'QOLADI va uni ro'yxatga qayta qo'shish kerak. Biz uni kodda oshkor qilganimiz uchun, siz allaqachon tushungansiz — bu yondashuv TAVSIYA ETILMAYDI."**

> ## ✅ **KURS BU YERDA TO'G'RI IKKI NARSANI KO'RSATADI:**
> ```
> ① Muhit o'zgaruvchisi JARAYON ichida yashaydi
>    →  kernel qayta ishga tushsa — YO'QOLADI
> ② Kodda yozish — XAVFLI
> ```

---

## 4. ⭐ Kursning ikkinchi usuli — `.env` fayli

> **"Faylni oching va quyidagini yozing: `OPENAI_API_KEY` va bu sizning API kalitingizga teng bo'lsin. Faylni saqlang, yoping va uni `.env` deb qayta nomlang."**

```
# .env fayli
OPENAI_API_KEY="sk-proj-..."
```

```python
%load_ext dotenv
%dotenv
```

> **"`%load_ext` buyrug'i yordamida kengaytmani yuklang. Bizga kerak bo'lgani — `dotenv`. Keyin `%dotenv` sehrli buyrug'idan foydalanib, matn faylida saqlangan kalit-qiymat juftligini o'qing."**

> ## ⚠️ **BU FAQAT JUPYTER'DA ISHLAYDI.** `%` bilan boshlanadigan **sehrli buyruqlar** oddiy `.py` faylida **xato** beradi.

### ✅ Umumiy usul — HAR QANDAY joyda ishlaydi

```python
from dotenv import load_dotenv
import os

load_dotenv()                                  # ⭐ .py da ham, .ipynb da ham
print("topildi:", bool(os.getenv("OPENAI_API_KEY")))
```

---

## 5. 🔬 `python-dotenv` NI CHUQURROQ O'RGANAMIZ

Kurs faqat `%dotenv` ni ko'rsatadi. Biz **hammasini** sinab ko'rdik:

```python
# .env faylimiz:
#   OPENAI_API_KEY="sk-test-abc123"
#   MENING_KALITIM=oddiy_qiymat
#   # izoh satri
#   BOSHQA = "bo'shliq bilan"

from dotenv import load_dotenv, dotenv_values
import os

print("OLDIN OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
print("dotenv_values():", dotenv_values(".env"))
print("load_dotenv() ->", load_dotenv())
print("KEYIN OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
print("BOSHQA:", repr(os.getenv("BOSHQA")))
```

```
OLDIN OPENAI_API_KEY: None
dotenv_values(): OrderedDict({'OPENAI_API_KEY': 'sk-test-abc123',
                              'MENING_KALITIM': 'oddiy_qiymat',
                              'BOSHQA': "bo'shliq bilan"})
load_dotenv() -> True
KEYIN OPENAI_API_KEY: sk-test-abc123
BOSHQA: "bo'shliq bilan"
```

> ## ✅ **UCHTA FOYDALI KUZATUV:**
> ```
> ① # bilan boshlangan satr — IZOH, o'qilmaydi
> ② " = " atrofidagi bo'shliqlar TOZALANADI
> ③ Qo'shtirnoq ICHIDAGI apostrof muammo tug'dirmaydi  ← 🇺🇿 muhim!
> ```
>
> ## 💡 **`dotenv_values()` — MUHITNI O'ZGARTIRMAY O'QIYDI.** Nosozlik tuzatishda **juda foydali**:
> ```python
> print(list(dotenv_values(".env").keys()))     # qiymatlarsiz — xavfsiz
> ```

### 💥💥 ENG MUHIM TOPILMA — `override` standart holda `False`

```python
os.environ["MENING_KALITIM"] = "QO'LDA"

load_dotenv()
print("override=False (standart):", os.getenv("MENING_KALITIM"))

load_dotenv(override=True)
print("override=True            :", os.getenv("MENING_KALITIM"))
```

```
override=False (standart): QO'LDA
override=True            : oddiy_qiymat
```

> ## 💥💥 **AGAR O'ZGARUVCHI ALLAQACHON MAVJUD BO'LSA — `.env` UNI ALMASHTIRMAYDI.**
>
> ```
> Siz .env ni tahrirlaysiz  →  yangi kalit yozasiz
> load_dotenv() chaqirasiz  →  ✅ "ishladi" deb o'ylaysiz
> Aslida esa                →  💥 ESKI qiymat ishlatilmoqda
> ```
>
> ## 🔑 **BU — JIM XATO.** Ogohlantirish **chiqmaydi**.
>
> ## ✅ **IKKI YECHIM:**
> ```python
> load_dotenv(override=True)          # .env DOIM ustun
> # yoki
> os.environ.pop("OPENAI_API_KEY", None)      # avval tozalang
> load_dotenv()
> ```
>
> ## 💡 **QACHON `override=False` TO'G'RI?** Ishlab chiqarishda — u yerda kalit **serverning muhit o'zgaruvchisidan** keladi va `.env` uni **buzmasligi** kerak.

---

## 6. ⚠️ Windows'da `.env` faylini yaratish

Kurs *"matn faylini yaratib, `.env` deb qayta nomlang"* deydi. Windows'da bu **muammoli**:

```
💥 Windows Explorer nuqta bilan boshlanadigan nomni RAD ETADI
💥 Notepad avtomatik ".txt" qo'shadi  →  ".env.txt"
```

> ## ✅ **UCHTA ISHLAYDIGAN YO'L:**

```bash
# ① Terminal (eng sodda)
echo OPENAI_API_KEY="sk-..." > .env
```

```python
# ② Python bilan  ⭐ ENG ISHONCHLI
from pathlib import Path
Path(".env").write_text('OPENAI_API_KEY="sk-..."\n', encoding="utf-8")
print("mavjud:", Path(".env").exists())
```

```
# ③ VS Code / PyCharm  →  New File  →  .env
```

> ## ⚠️ **TEKSHIRING — fayl nomi aynan `.env` bo'lsin:**
> ```python
> from pathlib import Path
> print([p.name for p in Path(".").iterdir() if "env" in p.name.lower()])
> ```
> Agar `.env.txt` ko'rsangiz — **qayta nomlang**.

---

## 7. ⭐⭐ Kurs AYTMAYDIGAN eng muhim narsa — `.gitignore`

> ## 💥💥 **`.env` FAYLI GIT'GA TUSHMASLIGI KERAK.**
>
> Kurs `.env` ni yaratishni ko'rsatadi, lekin `.gitignore` ni **umuman eslatmaydi**. Bu — **eng ko'p uchraydigan kalit sizib chiqish sababi**.

```gitignore
# .gitignore
.env
.env.*
!.env.example

*.key
secrets/
.ipynb_checkpoints/
__pycache__/
```

```python
from pathlib import Path

def env_xavfsizligini_tekshir(papka="."):
    p = Path(papka)
    env, gi = p / ".env", p / ".gitignore"

    if not env.exists():
        print("ℹ️  .env fayli yo'q")
        return
    print("✅ .env fayli bor")

    if not gi.exists():
        print("💥💥 .gitignore YO'Q — .env GIT'GA TUSHADI!")
        return
    t = gi.read_text(encoding="utf-8")
    if ".env" in t:
        print("✅ .gitignore da .env bor")
    else:
        print("💥💥 .gitignore BOR, LEKIN .env YO'Q — XAVF!")

env_xavfsizligini_tekshir()
```

---

## 8. 🏗️ To'liq, xavfsiz naqsh

```python
"""kalit.py — loyihangizning HAR joyida import qiling."""
import os
from pathlib import Path
from dotenv import load_dotenv


def kalit_yukla(fayl=".env", majburiy=("OPENAI_API_KEY",), override=True):
    """Kalitlarni yuklaydi va TEKSHIRADI."""
    p = Path(fayl)
    if p.exists():
        load_dotenv(p, override=override)
        print(f"✅ {fayl} yuklandi")
    else:
        print(f"ℹ️  {fayl} topilmadi — tizim o'zgaruvchilari ishlatiladi")

    yoq = [k for k in majburiy if not os.getenv(k)]
    if yoq:
        raise RuntimeError(
            f"❌ Kerakli o'zgaruvchilar yo'q: {yoq}\n"
            f"   .env fayliga qo'shing yoki Ollama'ga o'ting "
            f"(2-dars, 3-bo'lim)")

    for k in majburiy:
        v = os.getenv(k)
        print(f"   {k}: {v[:7]}...{v[-4:]}   ({len(v)} belgi)")
    return True


def kalit_maskala(v, boshi=7, oxiri=4):
    """Kalitni XAVFSIZ ko'rsatish — jurnal va xato xabarlarida."""
    if not v or len(v) < boshi + oxiri + 3:
        return "***"
    return f"{v[:boshi]}...{v[-oxiri:]}"
```

**Ishlatish:**

```python
kalit_yukla()
```

```
✅ .env yuklandi
   OPENAI_API_KEY: sk-test...c123   (18 belgi)
```

> ## 🏆 **TO'RTTA HIMOYA BU FUNKSIYADA:**
> ```
> ① .env bo'lmasa — TUSHUNARLI xabar (jim xato emas)
> ② Kerakli kalit yo'q bo'lsa — DARHOL to'xtaydi
> ③ override=True — eski qiymat ALDAMAYDI
> ④ Kalit MASKALANIB ko'rsatiladi — jurnalga to'liq tushmaydi
> ```

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** Muhit o'zgaruvchisi qayerda yashaydi?

**M2.** `%dotenv` qayerda ishlaydi?

**M3.** Nima uchun kalit kodda turmasligi kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Jarayon** ichida. Kernel qayta ishga tushsa — **yo'qoladi**.

**M2.** ## **Faqat Jupyter'da** *(IPython sehrli buyrug'i)*. `.py` da — `load_dotenv()`.

**M3.** ① Kodni **bo'lishganda** sizib chiqadi · ② **GitHub** botlari topadi · ③ o'zgartirish **qiyin**.

</details>

### 🟡 O'rta

**M4.** ⭐ `.env` faylini Python bilan yarating.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path
Path(".env").write_text(
    'OPENAI_API_KEY="sk-test-123"\n'
    'MENING_KALITIM=oddiy\n', encoding="utf-8")

from dotenv import dotenv_values
print(list(dotenv_values(".env").keys()))     # ⚠️ faqat NOMLAR
```

</details>

**M5.** ⭐⭐ `override` xatti-harakatini o'zingiz sinang.

<details>
<summary>✅ Yechim</summary>

```python
import os
from dotenv import load_dotenv

os.environ["MENING_KALITIM"] = "ESKI"
load_dotenv()
print("override=False:", os.getenv("MENING_KALITIM"))
load_dotenv(override=True)
print("override=True :", os.getenv("MENING_KALITIM"))
```

```
override=False: ESKI
override=True : oddiy
```

## 💥 **`.env` ni tahrirlab, `load_dotenv()` chaqirsangiz — ESKI qiymat qoladi.** Bu — **jim xato**.

</details>

**M6.** ⭐ Kalitni maskalab chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
def maskala(v, b=7, o=4):
    return "***" if not v or len(v) < b+o+3 else f"{v[:b]}...{v[-o:]}"

import os
print("OPENAI_API_KEY:", maskala(os.getenv("OPENAI_API_KEY", "")))
```

## 🔑 **XATO XABARLARIDA VA JURNALDA DOIM MASKALANG.**

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ Ko'p provayderli kalit boshqaruvchisi.

<details>
<summary>✅ Yechim</summary>

```python
import os
from pathlib import Path
from dotenv import load_dotenv

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
        for p, (k, prefiks) in self.PROVAYDERLAR.items():
            v = os.getenv(k)
            if v:
                ok = v.startswith(prefiks)
                n.append({"provayder": p, "o'zgaruvchi": k,
                          "kalit": f"{v[:7]}...{v[-4:]}",
                          "format": "✅" if ok else "⚠️ prefiks mos emas"})
        return n

    def hisobot(self):
        n = self.mavjudlar()
        if not n:
            print("❌ Hech qanday API kaliti topilmadi")
            print("   → Ollama'ga o'ting (2-dars, 3-bo'lim)")
            return
        import pandas as pd
        print(pd.DataFrame(n).to_string(index=False))

    def talab(self, provayder):
        k, _ = self.PROVAYDERLAR[provayder]
        v = os.getenv(k)
        if not v:
            raise RuntimeError(f"❌ {k} topilmadi. .env fayliga qo'shing.")
        return v

KalitBoshqaruv().hisobot()
```

## 🏆 **`format` USTUNI — SODDA, LEKIN FOYDALI TEKSHIRUV.** Kalitni noto'g'ri o'zgaruvchiga qo'yish — **tez-tez** uchraydi.

</details>

**M8.** ⭐⭐ `.env` va `.gitignore` xavfsizligini to'liq tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import re, subprocess
from pathlib import Path

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
                muammolar.append(f"💥 KALIT: {f}  →  {m[:8]}...{m[-4:]}")
        except Exception:
            pass

    try:
        r = subprocess.run(["git", "log", "--all", "--full-history", "--", ".env"],
                           capture_output=True, text=True, cwd=papka, timeout=10)
        if r.stdout.strip():
            muammolar.append("💥 .env GIT TARIXIDA BOR — kalitni BEKOR QILING")
    except Exception:
        pass

    if muammolar:
        print("=" * 56)
        for m in muammolar:
            print(m)
        print("=" * 56)
    else:
        print("✅ Xavfsizlik auditi toza")
    return muammolar

xavfsizlik_auditi()
```

## 🏆 **BU AUDITNI HAR COMMIT'DAN OLDIN ISHGA TUSHIRING.**

</details>

---

## 🧠 O'zini tekshirish

<details>
<summary>❓ `.env` ni tahrirladim, lekin eski kalit ishlayapti. Nega?</summary>

`load_dotenv()` ning `override` **standart holda `False`** — mavjud o'zgaruvchi **ustun** turadi. Yechim: `load_dotenv(override=True)`.
</details>

<details>
<summary>❓ `%dotenv` `.py` faylida ishlamayapti.</summary>

Bu — **IPython sehrli buyrug'i**, faqat Jupyter'da ishlaydi. Universal usul: `from dotenv import load_dotenv; load_dotenv()`.
</details>

<details>
<summary>❓ Kalitni `os.environ["..."] = "sk-..."` bilan qo'ysam bo'ladimi?</summary>

**Sinov uchun** — ha. **Hech qachon commit qilmang**. Va u kernel qayta ishga tushganda **yo'qoladi**.
</details>

---

## 📌 Xulosa

```
❌ client = OpenAI(api_key="sk-...")           qattiq kodlangan
⚠️ os.environ["OPENAI_API_KEY"] = "sk-..."     kodda turibdi, yo'qoladi
✅ %load_ext dotenv  +  %dotenv                Jupyter'da
⭐ from dotenv import load_dotenv               HAR JOYDA
   load_dotenv(override=True)

⚠️⚠️ .gitignore ga .env ni QO'SHING  ←  kurs BUNI AYTMAYDI
```

| | Kurs | Biz qo'shdik |
|---|---|---|
| `os.environ` | ✅ | ✅ ⚠️ **`print(os.environ)` xavfli** |
| `%dotenv` | ✅ | ✅ + `load_dotenv()` |
| `override` | ❌ | ## 💥 **jim xato manbai** |
| `dotenv_values()` | ❌ | ✅ xavfsiz nosozlik tuzatish |
| Windows `.env` | ❌ | ## ✅ **uchta yo'l** |
| `.gitignore` | ## ❌ | ## ✅ **ENG MUHIMI** |
| Maskalash | ❌ | ✅ jurnal uchun |

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Muhit o'zgaruvchisi | Environment variable | OT saqlaydigan **kalit-qiymat** |
| Qattiq kodlash | Hardcoding | Qiymatni **kodda** yozish |
| Sehrli buyruq | Magic command | IPython'ning `%` **buyruqlari** |
| Override | Override | Mavjud qiymatni **almashtirish** |
| Maskalash | Masking | Maxfiy qiymatni **qisman** ko'rsatish |

---

⬅️ [2-dars. OpenAI API kaliti](02-Obtaining-an-OpenAI-API-Key.md) · 🏠 [Modul boshiga](README.md) · ➡️ [38-modul. OpenAI API](../38-LangChain-OpenAI-API/README.md)
