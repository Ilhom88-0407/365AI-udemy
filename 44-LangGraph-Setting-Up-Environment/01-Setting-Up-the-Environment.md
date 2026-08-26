# 1-dars. Muhitni sozlash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Virtual muhit yaratamiz, kerakli paketlarni o'rnatamiz va muhitni Jupyter Notebook bilan bog'laymiz."**

---

## 1. Kursning yo'li — Anaconda

```bash
conda create --name langgraph_env python=3.11.11
conda activate langgraph_env
```

## ✅ Bizning yo'l — oddiy `venv` *(Anaconda SHART EMAS)*

```bash
python -m venv langgraph_env

# Windows
langgraph_env\Scripts\activate
# macOS / Linux
source langgraph_env/bin/activate
```

> ## 💡 **NIMA UCHUN ALOHIDA MUHIT?**
> ```
> ✅ Paket ziddiyatlari boshqa loyihalarga TEGMAYDI
> ✅ Biror narsa buzilsa — o'chirib QAYTA yaratasiz
> ✅ requirements.txt bilan boshqa mashinada AYNAN takrorlanadi
> ```
>
> ## ⚠️ **PYTHON 3.11.11 SHART EMAS** — LangGraph **3.10+** da ishlaydi. Biz **3.14** da sinadik.

---

## 2. Paketlar

```bash
pip install langgraph
pip install langgraph-checkpoint-sqlite
pip install langchain langchain-core
```

> ## 💡 **`langgraph` O'ZI BILAN NIMA OLIB KELADI?**
> ```
> langgraph-checkpoint    →  checkpointer asosi (47-modul)
> langgraph-prebuilt      →  tayyor agentlar
> langgraph-sdk           →  server bilan ishlash
> ```

### ⚠️ Kurs versiyani QOTIRADI — biz esa yangisini sinadik

```bash
pip install langchain==0.3.x        # ⚠️ kursdagidek
```

```
🔬 BIZNING VERSIYALAR (o'lchandi):
   langgraph                    1.2.11
   langgraph-checkpoint         4.2.0
   langgraph-checkpoint-sqlite  3.1.1
   langchain-core               1.6.0
   langchain                    1.3.17
```

> ## ✅ **KURSNING BUTUN KODI 1.x DA ISHLAYDI** — biz **hammasini sinab ko'rdik**.
>
> ## ⚠️ **BITTA MUHIM O'ZGARISH:** `recursion_limit` standarti — endi **10 000+** *(ilgari 25 edi)*. Sikl bilan ishlaganda bu **xavfli**. *(45-modulda batafsil.)*

---

## 3. ⭐⭐ Model — UCHTA YO'L

### ☁️ A. OpenAI *(kursning yo'li)*

```bash
pip install langchain-openai python-dotenv
```

```python
# .env fayli:
# OPENAI_API_KEY=sk-...
from dotenv import load_dotenv
load_dotenv(override=True)

from langchain_openai import ChatOpenAI
chat = ChatOpenAI(model="gpt-4o", seed=365, temperature=0,
                  max_completion_tokens=100)
```

> ## ⚠️ **KURS `gpt-4o` ISHLATADI.** Bo'lim uchun `gpt-4o-mini` **yetadi** va **17× arzon**.

### 🏠 B. Ollama — mahalliy, bepul

```bash
# https://ollama.com dan o'rnating
ollama pull qwen2.5:7b
pip install langchain-ollama
```

```python
from langchain_ollama import ChatOllama
chat = ChatOllama(model="qwen2.5:7b", temperature=0)
```

### ⭐⭐ C. `FakeListChatModel` — hech narsa kerak emas

```python
from langchain_core.language_models.fake_chat_models import FakeListChatModel

chat = FakeListChatModel(responses=["Birinchi javob.", "Ikkinchi javob."])
print(chat.invoke("savol").content)     # "Birinchi javob."
print(chat.invoke("yana").content)      # "Ikkinchi javob."
print(chat.invoke("uchinchi").content)  # "Birinchi javob."  ← sikl
```

> ## 🏆🏆 **LANGGRAPH O'RGANISH UCHUN — C VARIANTI ENG YAXSHISI.**
>
> ## 🔑 **NIMA UCHUN?**
> ```
> ✅ BEPUL va bir zumda
> ✅ TAKRORLANUVCHAN → xato GRAFDA ekani aniq bo'ladi
> ✅ Interfeys ChatOpenAI bilan BIR XIL → keyin almashtirasiz
> ⚠️ Javoblar SOXTA → javob SIFATINI sinab bo'lmaydi
> ```
>
> ## 💡 **LANGGRAPH — GRAFNI BOSHQARISH HAQIDA, MODEL SIFATI HAQIDA EMAS.** Model — **bitta tugun ichida**.

### 🏆 Universal tanlovchi — butun bo'lim uchun

```python
import os

def model_ol(temperature=0, seed=365):
    """Kalit bor bo'lsa OpenAI, yo'q bo'lsa Ollama, u ham yo'q bo'lsa sinov."""
    if os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        print("✅ ChatOpenAI (gpt-4o-mini)")
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature, seed=seed)
    try:
        from langchain_ollama import ChatOllama
        m = ChatOllama(model="qwen2.5:7b", temperature=temperature)
        m.invoke("test")
        print("✅ ChatOllama (mahalliy)")
        return m
    except Exception:
        pass
    from langchain_core.language_models.fake_chat_models import FakeListChatModel
    print("⚠️ FakeListChatModel — javoblar SOXTA, faqat graf mantiqi uchun")
    return FakeListChatModel(responses=["Sinov javobi."] * 100)
```

---

## 4. Jupyter bilan bog'lash

```bash
pip install ipykernel jupyterlab notebook
python -m ipykernel install --user --name=langgraph_env
```

> ## 💡 **KEYIN JUPYTER'DA `Kernel → Change Kernel → langgraph_env`.**

### ⚠️ Kursning ikkita "sehrli" kengaytmasi

```
%load_ext dotenv
%dotenv                     # .env ni yuklaydi
%load_ext mypy_ipython      # tip tekshiruvchi
%mypy                       # tekshirishni ishga tushiradi
```

```bash
pip install python-dotenv mypy ipython
```

> ## ⚠️ **`mypy_ipython` — IXTIYORIY.** Kod **ishlashiga ta'sir qilmaydi**.
>
> ## ✅ **`.py` FAYLDA MUQOBIL:**
> ```python
> from dotenv import load_dotenv
> load_dotenv(override=True)        # ⭐ override — mavjud qiymatni ALMASHTIRADI
> ```
> ```bash
> mypy mening_grafim.py             # tip tekshiruvi
> ```

---

## 5. ⭐ `grandalf` — grafni ASCII da ko'rish

```bash
pip install grandalf
```

```python
print(graph_compiled.get_graph().draw_ascii())
```

```
+-----------+
| __start__ |
+-----------+
      *
      *
      *
 +---------+
 | chatbot |
 +---------+
      *
      *
      *
 +---------+
 | __end__ |
 +---------+
```

> ## ⚠️ **`grandalf` BO'LMASA — `ImportError`.** *(41-modulda ham shu muammo bor edi.)*
>
> ## 💡 **JUPYTER'DA SODDAROQ:** shunchaki `graph_compiled` yozing — **PNG rasm** chiqadi.
>
> ## ⭐ **`.py` FAYLDA:**
> ```python
> print(graph_compiled.get_graph().draw_mermaid())      # mermaid matni
> png = graph_compiled.get_graph().draw_mermaid_png()   # ⚠️ INTERNET kerak
> ```

---

## 6. ⭐⭐ To'liq tekshiruv skripti

```python
import sys, importlib.metadata as md

print("Python:", sys.version.split()[0])

PAKETLAR = ["langgraph", "langgraph-checkpoint", "langgraph-checkpoint-sqlite",
            "langchain", "langchain-core", "grandalf", "tiktoken"]
for p in PAKETLAR:
    try:
        print(f"  ✅ {p:30s} {md.version(p)}")
    except Exception:
        print(f"  ❌ {p:30s} O'RNATILMAGAN")

IXTIYORIY = ["langchain-openai", "langchain-ollama", "python-dotenv", "mypy"]
print("\nixtiyoriy:")
for p in IXTIYORIY:
    try:
        print(f"  ✅ {p:30s} {md.version(p)}")
    except Exception:
        print(f"  ⚪ {p:30s} yo'q")

import os
print("\nOPENAI_API_KEY:", "✅ bor" if os.getenv("OPENAI_API_KEY") else "⚪ yo'q")

# ── ishlaydimi? ──
print("\n── graf sinovi ──")
from typing_extensions import TypedDict
from langgraph.graph import START, END, StateGraph

class S(TypedDict):
    n: int

g = StateGraph(S)
g.add_node("qosh", lambda s: {"n": s["n"] + 1})
g.add_edge(START, "qosh"); g.add_edge("qosh", END)
gc = g.compile()
print("  natija:", gc.invoke({"n": 41}))
try:
    print(gc.get_graph().draw_ascii())
except ImportError:
    print("  ⚠️ grandalf yo'q — pip install grandalf")
print("✅ LangGraph ISHLAYAPTI")
```

```
natija: {'n': 42}
```

> ## 🏆 **BU SKRIPT MODEL TALAB QILMAYDI** — chunki tugun **oddiy funksiya**. LangGraph **modelsiz ham to'liq ishlaydi**.

---

## 7. ⚠️⚠️ `requirements.txt` — kursda YO'Q, lekin SHART

```
langgraph>=1.0
langgraph-checkpoint-sqlite>=2.0
langchain>=1.0
langchain-core>=1.0
tiktoken
grandalf
pandas

# ixtiyoriy
langchain-openai
langchain-ollama
python-dotenv
```

```bash
pip install -r requirements.txt
pip freeze > requirements.lock.txt     # ⭐ AYNIQ versiyalar
```

> ## 💥 **USIZ NIMA BO'LADI?** Olti oydan keyin loyihangizni boshqa mashinada ishga tushirasiz va **hech narsa ishlamaydi**.
>
> ## 🏆 **`requirements.txt` — ORALIQ** *(o'rnatish uchun)*. **`requirements.lock.txt` — AYNIQ** *(takrorlash uchun)*.

---

## 8. 🇺🇿 Windows'da tez-tez uchraydigan muammolar

```python
# 💥 UnicodeEncodeError: 'charmap' codec can't encode character
#    (o'zbekcha matn yoki emoji chiqarganda)
```

```bash
# ✅ YECHIM
set PYTHONIOENCODING=utf-8            # cmd
$env:PYTHONIOENCODING="utf-8"         # PowerShell
```

```python
# ✅ Yoki fayl boshida
import sys
sys.stdout.reconfigure(encoding="utf-8")
```

> ## ⚠️ **VA FAYLLARNI DOIM `encoding="utf-8"` BILAN OCHING:**
> ```python
> open("suhbat.json", "w", encoding="utf-8")     # ⭐ SHART
> json.dump(data, f, ensure_ascii=False)         # ⭐ o'zbekcha o'qilsin
> ```
>
> ## 💥 **USIZ:** `so'm` → `so‘m`, `o'zbek` → **buzilgan matn**.

---

## 9. ⚡ Mashqlar

### 🟢 Oson

**M1.** Anaconda shartmi?

**M2.** API kaliti shartmi?

**M3.** `grandalf` nima uchun kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## ❌ **Yo'q** — oddiy `venv` **yetadi**.

**M2.** ## ❌ **Yo'q** — `FakeListChatModel` yoki **Ollama**.

**M3.** ## `draw_ascii()` uchun. Usiz — `ImportError`.

</details>

### 🟡 O'rta

**M4.** ⭐ Muhitni to'liq tekshiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 6-bo'limdagi skriptni ishga tushiring. Natija:

```
natija: {'n': 42}
✅ LangGraph ISHLAYAPTI
```

## 🔑 **AGAR SHU CHIQSA — BO'LIMNI BOSHLASHGA TAYYORSIZ.**

</details>

**M5.** ⭐ Uch model variantini sinang.

<details>
<summary>✅ Yechim</summary>

```python
import os, time
from langchain_core.messages import HumanMessage

VARIANTLAR = []

# ① OpenAI
if os.getenv("OPENAI_API_KEY"):
    try:
        from langchain_openai import ChatOpenAI
        VARIANTLAR.append(("ChatOpenAI",
                           ChatOpenAI(model="gpt-4o-mini", temperature=0)))
    except Exception as e:
        print("❌ OpenAI:", type(e).__name__)

# ② Ollama
try:
    from langchain_ollama import ChatOllama
    m = ChatOllama(model="qwen2.5:7b", temperature=0)
    m.invoke("hi")
    VARIANTLAR.append(("ChatOllama", m))
except Exception as e:
    print("⚪ Ollama yo'q:", type(e).__name__)

# ③ Fake
from langchain_core.language_models.fake_chat_models import FakeListChatModel
VARIANTLAR.append(("FakeListChatModel",
                   FakeListChatModel(responses=["Sinov javobi."] * 10)))

for nom, m in VARIANTLAR:
    t0 = time.perf_counter()
    r = m.invoke([HumanMessage("Salom! Bir jumlada javob ber.")])
    print(f"  {nom:20s} {time.perf_counter()-t0:6.2f}s  {r.content[:52]}")
```

## 💡 **`FakeListChatModel` — ~0.00s.** Shuning uchun graf mantiqini **darhol** sinaysiz.

</details>

**M6.** ⭐ `requirements.txt` yarating.

<details>
<summary>✅ Yechim</summary>

```python
from pathlib import Path
import importlib.metadata as md

ASOSIY = ["langgraph", "langgraph-checkpoint-sqlite", "langchain",
          "langchain-core", "tiktoken", "grandalf", "pandas"]

q = []
for p in ASOSIY:
    try:
        v = md.version(p)
        katta = v.split(".")[0]
        q.append(f"{p}>={katta}.0")
    except Exception:
        q.append(f"# {p}   ← O'RNATILMAGAN")

Path("requirements.txt").write_text("\n".join(q) + "\n", encoding="utf-8")
print("\n".join(q))
```

```bash
pip freeze > requirements.lock.txt
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐⭐ Muhit tashxis vositasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import sys, os, platform, importlib.metadata as md
import pandas as pd

class MuhitTashxis:
    """LangGraph muhitini to'liq tekshiradi va MUAMMONI ayta oladi."""

    ASOSIY = {"langgraph": "1.0", "langchain-core": "1.0", "langchain": "1.0"}
    QOSHIMCHA = ["langgraph-checkpoint", "langgraph-checkpoint-sqlite",
                 "tiktoken", "grandalf", "pandas"]
    IXTIYORIY = ["langchain-openai", "langchain-ollama", "python-dotenv",
                 "mypy", "ipykernel"]

    def __init__(self):
        self.muammolar, self.ogohlar = [], []

    def _v(self, paket):
        try:
            return md.version(paket)
        except Exception:
            return None

    def tekshir(self):
        print(f"🖥️  {platform.system()} {platform.release()} · "
              f"Python {sys.version.split()[0]}")
        if sys.version_info < (3, 10):
            self.muammolar.append(
                f"Python {sys.version.split()[0]} — LangGraph 3.10+ talab qiladi")

        q = []
        for p, min_v in self.ASOSIY.items():
            v = self._v(p)
            if v is None:
                self.muammolar.append(f"{p} O'RNATILMAGAN → pip install {p}")
            elif int(v.split(".")[0]) < int(min_v.split(".")[0]):
                self.ogohlar.append(f"{p} {v} — eski (kutilgan {min_v}+)")
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "❌", "tur": "asosiy"})
        for p in self.QOSHIMCHA:
            v = self._v(p)
            if v is None and p == "grandalf":
                self.ogohlar.append("grandalf yo'q → draw_ascii() ISHLAMAYDI")
            elif v is None:
                self.ogohlar.append(f"{p} yo'q")
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "⚠️", "tur": "qo'shimcha"})
        for p in self.IXTIYORIY:
            v = self._v(p)
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "⚪", "tur": "ixtiyoriy"})
        print(pd.DataFrame(q).to_string(index=False))
        return q

    def model_tekshir(self):
        print("\n── MODEL ──")
        if os.getenv("OPENAI_API_KEY"):
            print("  ✅ OPENAI_API_KEY topildi")
        else:
            print("  ⚪ OPENAI_API_KEY yo'q")
            if self._v("langchain-ollama"):
                print("  ✅ langchain-ollama bor → mahalliy model ishlatiladi")
            else:
                print("  ⚠️ FakeListChatModel ishlatiladi (javoblar SOXTA)")

    def kodirovka(self):
        print("\n── KODIROVKA ──")
        enc = sys.stdout.encoding or ""
        print(f"  stdout: {enc}")
        try:
            print("  sinov : o'zbekcha so'm — ⭐ 🇺🇿")
            print("  ✅ UTF-8 ishlayapti")
        except UnicodeEncodeError:
            self.muammolar.append(
                "UnicodeEncodeError → set PYTHONIOENCODING=utf-8")

    def graf_sinov(self):
        print("\n── GRAF SINOVI ──")
        try:
            from typing_extensions import TypedDict
            from langgraph.graph import START, END, StateGraph

            class S(TypedDict):
                n: int

            g = StateGraph(S)
            g.add_node("qosh", lambda s: {"n": s["n"] + 1})
            g.add_edge(START, "qosh"); g.add_edge("qosh", END)
            r = g.compile().invoke({"n": 41})
            print(f"  ✅ graf ishladi: {r}")
        except Exception as e:
            self.muammolar.append(f"graf ishlamadi: {type(e).__name__}: {e}")
            print(f"  ❌ {type(e).__name__}: {str(e)[:80]}")

    def hisobot(self):
        self.tekshir()
        self.model_tekshir()
        self.kodirovka()
        self.graf_sinov()
        print("\n" + "═" * 56)
        if self.muammolar:
            print(f"❌ {len(self.muammolar)} MUAMMO:")
            for m in self.muammolar:
                print(f"    {m}")
        if self.ogohlar:
            print(f"⚠️ {len(self.ogohlar)} ogohlantirish:")
            for o in self.ogohlar:
                print(f"    {o}")
        if not self.muammolar:
            print("🏆 MUHIT TAYYOR — bo'limni boshlashingiz mumkin")
        return not self.muammolar


MuhitTashxis().hisobot()
```

## 🏆 **BU SKRIPTNI LOYIHANGIZ PAPKASIGA `tashxis.py` DEB SAQLANG.** Biror narsa ishlamay qolganda — **birinchi ishga tushiradiganingiz**.

</details>

---

## 📌 Xulosa

```bash
python -m venv langgraph_env && langgraph_env\Scripts\activate
pip install langgraph langgraph-checkpoint-sqlite langchain langchain-core
pip install tiktoken grandalf pandas
```

```python
# ⭐ API KALITISIZ
from langchain_core.language_models.fake_chat_models import FakeListChatModel
chat = FakeListChatModel(responses=["Birinchi.", "Ikkinchi."])
```

```
✅ Anaconda SHART EMAS — venv yetadi
✅ API kaliti SHART EMAS — Fake yoki Ollama
✅ Python 3.11.11 SHART EMAS — 3.10+ (biz 3.14 da sinadik)
⚠️ grandalf — draw_ascii() uchun
🇺🇿 Windows: set PYTHONIOENCODING=utf-8
```

```
🔬 O'LCHANGAN VERSIYALAR:
   langgraph 1.2.11 · langchain-core 1.6.0 · langchain 1.3.17
   → kursning butun kodi ISHLAYDI
```

---

🏠 [Modul boshiga](README.md) · ➡️ [45-modul. Graf komponentlari](../45-LangGraph-Graph-Components/README.md)
