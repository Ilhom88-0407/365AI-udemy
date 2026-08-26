# 📝 44-modul mashqlari

> **12 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI API KALITISIZ.**

## ⚙️ Tayyorgarlik

```bash
pip install langgraph langgraph-checkpoint-sqlite langchain langchain-core
pip install tiktoken grandalf pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import sys, os, platform, time, json
import importlib.metadata as md
from pathlib import Path
from typing_extensions import TypedDict
import pandas as pd

from langgraph.graph import START, END, StateGraph
from langchain_core.messages import HumanMessage
from langchain_core.language_models.fake_chat_models import FakeListChatModel
```

---

# 🟢 OSON *(1–5)*

**M1.** Anaconda shartmi?

**M2.** API kaliti shartmi?

**M3.** `grandalf` nima uchun?

**M4.** Qaysi Python versiyasi kerak?

**M5.** `venv` nima uchun kerak?

<details>
<summary>✅ Javoblar M1–M5</summary>

**M1.** ## ❌ **Yo'q** — `python -m venv` **yetadi**.

**M2.** ## ❌ **Yo'q** — `FakeListChatModel` yoki **Ollama**. LangGraph **modelsiz ham to'liq ishlaydi**.

**M3.** ## `draw_ascii()` uchun. Usiz — `ImportError`.

**M4.** ## **3.10+** *(kurs 3.11.11 aytadi, biz 3.14 da sinadik)*.

**M5.** Paket **ziddiyatlari** boshqa loyihalarga tegmasligi uchun.

</details>

---

# 🟡 O'RTA *(6–9)*

**M6.** ⭐ Muhitni to'liq tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
print("Python:", sys.version.split()[0], "·", platform.system())

ASOSIY = ["langgraph", "langgraph-checkpoint", "langgraph-checkpoint-sqlite",
          "langchain", "langchain-core", "grandalf", "tiktoken", "pandas"]
IXTIYORIY = ["langchain-openai", "langchain-ollama", "python-dotenv", "mypy"]

q = []
for p in ASOSIY + IXTIYORIY:
    try:
        q.append({"paket": p, "versiya": md.version(p), "holat": "✅",
                  "tur": "asosiy" if p in ASOSIY else "ixtiyoriy"})
    except Exception:
        q.append({"paket": p, "versiya": "—",
                  "holat": "❌" if p in ASOSIY else "⚪",
                  "tur": "asosiy" if p in ASOSIY else "ixtiyoriy"})
print(pd.DataFrame(q).to_string(index=False))
print("\nOPENAI_API_KEY:", "✅ bor" if os.getenv("OPENAI_API_KEY") else "⚪ yo'q")
```

</details>

**M7.** ⭐ Modelsiz graf ishga tushiring.

<details>
<summary>✅ Yechim</summary>

```python
class S(TypedDict):
    n: int
    tarix: list

def qosh(s: S) -> S:
    return {"n": s["n"] + 1, "tarix": s.get("tarix", []) + ["qosh"]}

def kopaytir(s: S) -> S:
    return {"n": s["n"] * 2, "tarix": s.get("tarix", []) + ["kopaytir"]}

g = StateGraph(S)
g.add_node("qosh", qosh); g.add_node("kopaytir", kopaytir)
g.add_edge(START, "qosh"); g.add_edge("qosh", "kopaytir")
g.add_edge("kopaytir", END)
gc = g.compile()

print("natija:", gc.invoke({"n": 20, "tarix": []}))
try:
    print(gc.get_graph().draw_ascii())
except ImportError:
    print("⚠️ pip install grandalf")
```

```
natija: {'n': 42, 'tarix': ['qosh', 'kopaytir']}
```

## 🏆 **MODEL UMUMAN KERAK BO'LMADI.** LangGraph — **grafni boshqarish** haqida.

## ⚠️ **E'TIBOR:** `tarix` da **reducer yo'q**, shuning uchun tugun **butun ro'yxatni** qaytarishi kerak. Aks holda **almashtiriladi**.

</details>

**M8.** ⭐ Uch model variantini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
VARIANTLAR = []
if os.getenv("OPENAI_API_KEY"):
    try:
        from langchain_openai import ChatOpenAI
        VARIANTLAR.append(("ChatOpenAI",
                           ChatOpenAI(model="gpt-4o-mini", temperature=0)))
    except Exception as e:
        print("❌ OpenAI:", type(e).__name__)
try:
    from langchain_ollama import ChatOllama
    m = ChatOllama(model="qwen2.5:7b", temperature=0)
    m.invoke("hi")
    VARIANTLAR.append(("ChatOllama", m))
except Exception:
    print("⚪ Ollama yo'q")
VARIANTLAR.append(("FakeListChatModel",
                   FakeListChatModel(responses=["Sinov javobi."] * 10)))

for nom, m in VARIANTLAR:
    t0 = time.perf_counter()
    r = m.invoke([HumanMessage("Salom! Bir jumlada javob ber.")])
    print(f"  {nom:20s} {time.perf_counter()-t0:6.2f}s  {r.content[:52]}")
```

## 💡 **`FakeListChatModel` ~0.00s** — graf mantiqini **bir zumda** sinaysiz.

</details>

**M9.** ⭐⭐ 🇺🇿 UTF-8 muammosini sinang.

<details>
<summary>✅ Yechim</summary>

```python
print("stdout kodirovkasi:", sys.stdout.encoding)

MATN = "O'zbekcha: 1 000 000 so'm · ta'lim · ⭐ 🇺🇿"
try:
    print("chiqish:", MATN)
    print("✅ UTF-8 ishlayapti")
except UnicodeEncodeError as e:
    print("💥 UnicodeEncodeError:", e)
    print("   → set PYTHONIOENCODING=utf-8")

# ── faylga yozish ──
d = {"savol": "Kredit foizi qancha?",
     "javob": "Yillik 24% dan boshlanadi, 1 000 000 so'm dan."}

Path("sinov_yaxshi.json").write_text(
    json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
Path("sinov_yomon.json").write_text(
    json.dumps(d), encoding="utf-8")           # ensure_ascii=True

print("\n✅ ensure_ascii=False:")
print(Path("sinov_yaxshi.json").read_text(encoding="utf-8"))
print("💥 ensure_ascii=True:")
print(Path("sinov_yomon.json").read_text(encoding="utf-8"))
```

## 💥 **`ensure_ascii=True` DA O'ZBEKCHA `‘` GA AYLANADI** — fayl **o'qib bo'lmaydigan** bo'ladi.

</details>

---

# 🔴 QIYIN *(10–12)*

**M10.** ⭐⭐⭐ Muhit tashxis vositasi.

<details>
<summary>✅ Yechim</summary>

```python
class MuhitTashxis:
    ASOSIY = {"langgraph": 1, "langchain-core": 1, "langchain": 1}
    QOSHIMCHA = ["langgraph-checkpoint", "langgraph-checkpoint-sqlite",
                 "tiktoken", "grandalf", "pandas"]
    IXTIYORIY = ["langchain-openai", "langchain-ollama", "python-dotenv",
                 "mypy", "ipykernel"]

    def __init__(self):
        self.muammolar, self.ogohlar = [], []

    def _v(self, p):
        try:
            return md.version(p)
        except Exception:
            return None

    def paketlar(self):
        print(f"🖥️  {platform.system()} · Python {sys.version.split()[0]}")
        if sys.version_info < (3, 10):
            self.muammolar.append("Python 3.10+ kerak")
        q = []
        for p, min_major in self.ASOSIY.items():
            v = self._v(p)
            if v is None:
                self.muammolar.append(f"{p} yo'q → pip install {p}")
            elif int(v.split(".")[0]) < min_major:
                self.ogohlar.append(f"{p} {v} — eski (kutilgan {min_major}.x+)")
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "❌", "tur": "asosiy"})
        for p in self.QOSHIMCHA:
            v = self._v(p)
            if v is None:
                self.ogohlar.append(
                    "grandalf yo'q → draw_ascii() ISHLAMAYDI" if p == "grandalf"
                    else f"{p} yo'q")
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "⚠️", "tur": "qo'shimcha"})
        for p in self.IXTIYORIY:
            v = self._v(p)
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "⚪", "tur": "ixtiyoriy"})
        print(pd.DataFrame(q).to_string(index=False))

    def model(self):
        print("\n── MODEL ──")
        if os.getenv("OPENAI_API_KEY"):
            print("  ✅ OPENAI_API_KEY topildi")
        elif self._v("langchain-ollama"):
            print("  ⚪ kalit yo'q · ✅ langchain-ollama bor → mahalliy")
        else:
            print("  ⚠️ FakeListChatModel ishlatiladi (javoblar SOXTA)")

    def kodirovka(self):
        print("\n── KODIROVKA ──")
        print(f"  stdout: {sys.stdout.encoding}")
        try:
            print("  sinov : o'zbekcha so'm ⭐ 🇺🇿  → ✅")
        except UnicodeEncodeError:
            self.muammolar.append("set PYTHONIOENCODING=utf-8")

    def graf(self):
        print("\n── GRAF SINOVI ──")
        try:
            class S(TypedDict):
                n: int
            g = StateGraph(S)
            g.add_node("qosh", lambda s: {"n": s["n"] + 1})
            g.add_edge(START, "qosh"); g.add_edge("qosh", END)
            print("  ✅", g.compile().invoke({"n": 41}))
        except Exception as e:
            self.muammolar.append(f"graf ishlamadi: {type(e).__name__}")
            print(f"  ❌ {type(e).__name__}: {str(e)[:80]}")

    def checkpointer(self):
        print("\n── CHECKPOINTER ──")
        try:
            from langgraph.checkpoint.memory import InMemorySaver
            InMemorySaver()
            print("  ✅ InMemorySaver")
        except Exception as e:
            self.muammolar.append(f"InMemorySaver: {type(e).__name__}")
        try:
            from langgraph.checkpoint.sqlite import SqliteSaver
            import sqlite3
            SqliteSaver(sqlite3.connect(":memory:", check_same_thread=False))
            print("  ✅ SqliteSaver")
        except Exception as e:
            self.ogohlar.append("SqliteSaver yo'q → "
                                "pip install langgraph-checkpoint-sqlite")

    def hisobot(self):
        self.paketlar(); self.model(); self.kodirovka()
        self.graf(); self.checkpointer()
        print("\n" + "═" * 56)
        for m in self.muammolar:
            print(f"❌ {m}")
        for o in self.ogohlar:
            print(f"⚠️ {o}")
        if not self.muammolar:
            print("🏆 MUHIT TAYYOR")
        return not self.muammolar


MuhitTashxis().hisobot()
```

## 🏆 **`tashxis.py` DEB SAQLANG** — biror narsa ishlamay qolganda **birinchi ishga tushiradiganingiz**.

</details>

**M11.** ⭐⭐⭐ Universal model adapteri.

<details>
<summary>✅ Yechim</summary>

```python
class ModelAdapter:
    """Mavjud eng yaxshi modelni tanlaydi va SIFAT DARAJASINI aytadi."""

    DARAJA = {"ChatOpenAI": "🏆 to'liq", "ChatOllama": "✅ yaxshi",
              "FakeListChatModel": "⚠️ faqat sinov"}

    def __init__(self, temperature=0, seed=365, ollama_model="qwen2.5:7b"):
        self.temperature, self.seed = temperature, seed
        self.ollama_model = ollama_model
        self.nom, self.model, self.urinishlar = None, None, []

    def _sinov(self, nom, yaratuvchi):
        t0 = time.perf_counter()
        try:
            m = yaratuvchi()
            m.invoke([HumanMessage("hi")])
            self.urinishlar.append(
                {"model": nom, "holat": "✅",
                 "s": round(time.perf_counter() - t0, 2), "sabab": "—"})
            return m
        except Exception as e:
            self.urinishlar.append(
                {"model": nom, "holat": "❌",
                 "s": round(time.perf_counter() - t0, 2),
                 "sabab": f"{type(e).__name__}: {str(e)[:40]}"})
            return None

    def ol(self):
        if os.getenv("OPENAI_API_KEY"):
            def f():
                from langchain_openai import ChatOpenAI
                return ChatOpenAI(model="gpt-4o-mini",
                                  temperature=self.temperature, seed=self.seed)
            m = self._sinov("ChatOpenAI", f)
            if m:
                self.nom, self.model = "ChatOpenAI", m
                return self._qaytar()
        else:
            self.urinishlar.append({"model": "ChatOpenAI", "holat": "⚪",
                                    "s": 0, "sabab": "OPENAI_API_KEY yo'q"})

        def f2():
            from langchain_ollama import ChatOllama
            return ChatOllama(model=self.ollama_model,
                              temperature=self.temperature)
        m = self._sinov("ChatOllama", f2)
        if m:
            self.nom, self.model = "ChatOllama", m
            return self._qaytar()

        self.nom = "FakeListChatModel"
        self.model = FakeListChatModel(responses=["Sinov javobi."] * 200)
        self.urinishlar.append({"model": self.nom, "holat": "⚠️",
                                "s": 0, "sabab": "zaxira variant"})
        return self._qaytar()

    def _qaytar(self):
        print(pd.DataFrame(self.urinishlar).to_string(index=False))
        print(f"\n🎯 tanlandi: {self.nom}  —  {self.DARAJA[self.nom]}")
        if self.nom == "FakeListChatModel":
            print("   ⚠️ javoblar SOXTA — graf MANTIQINI sinash uchun mos,")
            print("      javob SIFATINI baholash uchun EMAS")
        return self.model


a = ModelAdapter()
chat = a.ol()
print("\njavob:", chat.invoke([HumanMessage("salom")]).content[:60])
```

## 🏆 **`urinishlar` JADVALI — NIMA UCHUN SHU MODEL TANLANGANINI KO'RSATADI.**

</details>

**M12.** ⭐⭐⭐ `requirements` generatori.

<details>
<summary>✅ Yechim</summary>

```python
def requirements_yarat(papka=".", lock=True):
    """requirements.txt (oraliq) va requirements.lock.txt (aniq) yaratadi."""
    ASOSIY = ["langgraph", "langgraph-checkpoint-sqlite", "langchain",
              "langchain-core", "tiktoken", "grandalf", "pandas"]
    IXTIYORIY = ["langchain-openai", "langchain-ollama", "python-dotenv"]

    q, yoq = [], []
    for p in ASOSIY:
        try:
            v = md.version(p)
            q.append(f"{p}>={v.split('.')[0]}.0")
        except Exception:
            yoq.append(p)

    q.append("")
    q.append("# ixtiyoriy")
    for p in IXTIYORIY:
        try:
            v = md.version(p)
            q.append(f"{p}>={v.split('.')[0]}.0")
        except Exception:
            q.append(f"# {p}")

    Path(papka, "requirements.txt").write_text("\n".join(q) + "\n",
                                               encoding="utf-8")
    print("── requirements.txt ──")
    print("\n".join(q))

    if yoq:
        print(f"\n💥 {len(yoq)} ASOSIY paket o'rnatilmagan: {yoq}")
        print(f"   pip install {' '.join(yoq)}")

    if lock:
        import subprocess
        r = subprocess.run([sys.executable, "-m", "pip", "freeze"],
                           capture_output=True, text=True)
        Path(papka, "requirements.lock.txt").write_text(r.stdout,
                                                        encoding="utf-8")
        n = len(r.stdout.strip().split("\n"))
        print(f"\n✅ requirements.lock.txt — {n} paket (AYNIQ versiyalar)")
    return q


requirements_yarat()
```

## 🏆 **IKKI FAYL, IKKI MAQSAD:**
```
requirements.txt       →  ORALIQ  →  yangi mashinada o'rnatish
requirements.lock.txt  →  AYNIQ   →  muammoni TAKRORLASH va tuzatish
```

</details>

---

## 📌 Xulosa

```bash
python -m venv langgraph_env && langgraph_env\Scripts\activate
pip install langgraph langgraph-checkpoint-sqlite langchain langchain-core
pip install tiktoken grandalf pandas
set PYTHONIOENCODING=utf-8        # 🇺🇿 Windows
```

```
✅ Anaconda · API kaliti · Python 3.11.11 — HECH BIRI SHART EMAS
🔬 langgraph 1.2.11 · langchain-core 1.6.0 → kursning kodi ISHLAYDI
```

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
