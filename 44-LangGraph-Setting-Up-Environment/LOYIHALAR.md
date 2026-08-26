# 🚀 44-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐ **Ikkalasi ham API kalitisiz ishlaydi.**
>
> Bu modul **tayyorgarlik** haqida, shuning uchun loyihalar — **loyihangizni ishga tushirishga tayyorlaydigan** vositalar.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langgraph langgraph-checkpoint-sqlite langchain langchain-core
pip install tiktoken grandalf pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import sys, os, platform, time, json, subprocess, sqlite3
import importlib.metadata as md
from pathlib import Path
from typing_extensions import TypedDict
import pandas as pd

from langgraph.graph import START, END, StateGraph
from langchain_core.messages import HumanMessage
from langchain_core.language_models.fake_chat_models import FakeListChatModel
```

---

# 🩺 1-loyiha. Muhit tashxis vositasi

> **Maqsad:** "menda ishlamayapti" muammosini **bir buyruq bilan** aniqlash.

```python
class MuhitTashxis:
    """LangGraph muhitini TO'LIQ tekshiradi va NIMA QILISH kerakligini aytadi."""

    ASOSIY = {"langgraph": 1, "langchain-core": 1, "langchain": 1}
    QOSHIMCHA = ["langgraph-checkpoint", "langgraph-checkpoint-sqlite",
                 "tiktoken", "grandalf", "pandas"]
    IXTIYORIY = ["langchain-openai", "langchain-ollama", "python-dotenv",
                 "mypy", "ipykernel", "jupyterlab"]

    def __init__(self, verbose=True):
        self.verbose = verbose
        self.muammolar, self.ogohlar, self.natija = [], [], {}

    # ───── yordamchi ─────
    def _v(self, paket):
        try:
            return md.version(paket)
        except Exception:
            return None

    def _p(self, *a):
        if self.verbose:
            print(*a)

    # ───── ① tizim ─────
    def tizim(self):
        self._p(f"🖥️  {platform.system()} {platform.release()} · "
                f"{platform.machine()}")
        self._p(f"🐍 Python {sys.version.split()[0]}  ({sys.executable})")
        self.natija["python"] = sys.version.split()[0]
        if sys.version_info < (3, 10):
            self.muammolar.append(
                f"Python {sys.version.split()[0]} — LangGraph 3.10+ talab qiladi")

        # virtual muhitdami?
        venv = (hasattr(sys, "real_prefix")
                or sys.prefix != getattr(sys, "base_prefix", sys.prefix))
        self.natija["venv"] = venv
        if venv:
            self._p(f"📦 virtual muhit: ✅ {Path(sys.prefix).name}")
        else:
            self.ogohlar.append(
                "GLOBAL Python ishlatilmoqda — venv yaratish tavsiya etiladi")
            self._p("📦 virtual muhit: ⚠️ YO'Q (global)")

    # ───── ② paketlar ─────
    def paketlar(self):
        q = []
        for p, min_major in self.ASOSIY.items():
            v = self._v(p)
            if v is None:
                self.muammolar.append(f"{p} O'RNATILMAGAN → pip install {p}")
            elif int(v.split(".")[0]) < min_major:
                self.ogohlar.append(
                    f"{p} {v} eski — kutilgan {min_major}.x+ "
                    f"→ pip install -U {p}")
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "❌", "tur": "asosiy"})

        for p in self.QOSHIMCHA:
            v = self._v(p)
            if v is None:
                if p == "grandalf":
                    self.ogohlar.append(
                        "grandalf yo'q → draw_ascii() ISHLAMAYDI "
                        "→ pip install grandalf")
                elif p == "langgraph-checkpoint-sqlite":
                    self.ogohlar.append(
                        "langgraph-checkpoint-sqlite yo'q → "
                        "47-moduldagi uzoq muddatli xotira ishlamaydi")
                else:
                    self.ogohlar.append(f"{p} yo'q → pip install {p}")
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "⚠️", "tur": "qo'shimcha"})

        for p in self.IXTIYORIY:
            v = self._v(p)
            q.append({"paket": p, "versiya": v or "—",
                      "holat": "✅" if v else "⚪", "tur": "ixtiyoriy"})

        self.natija["paketlar"] = q
        if self.verbose:
            print()
            print(pd.DataFrame(q).to_string(index=False))
        return q

    # ───── ③ model ─────
    def model(self):
        self._p("\n── MODEL ──")
        if os.getenv("OPENAI_API_KEY"):
            kalit = os.getenv("OPENAI_API_KEY")
            self._p(f"  ✅ OPENAI_API_KEY topildi "
                    f"({kalit[:7]}...{kalit[-4:]}, {len(kalit)} belgi)")
            self.natija["model"] = "openai"
        elif self._v("langchain-ollama"):
            self._p("  ⚪ OPENAI_API_KEY yo'q")
            try:
                from langchain_ollama import ChatOllama
                ChatOllama(model="qwen2.5:7b").invoke("hi")
                self._p("  ✅ Ollama ishlayapti → mahalliy model")
                self.natija["model"] = "ollama"
            except Exception as e:
                self.ogohlar.append(
                    f"langchain-ollama o'rnatilgan, lekin Ollama serveri "
                    f"javob bermayapti ({type(e).__name__}) — "
                    f"'ollama serve' ishlayaptimi?")
                self.natija["model"] = "fake"
        else:
            self._p("  ⚠️ FakeListChatModel ishlatiladi — javoblar SOXTA")
            self._p("     graf MANTIQINI sinash uchun mos, SIFAT uchun emas")
            self.natija["model"] = "fake"

    # ───── ④ kodirovka ─────
    def kodirovka(self):
        self._p("\n── KODIROVKA 🇺🇿 ──")
        enc = (sys.stdout.encoding or "").lower()
        self._p(f"  stdout: {sys.stdout.encoding}")
        self.natija["encoding"] = sys.stdout.encoding
        try:
            self._p("  sinov : O'zbekcha — 1 000 000 so'm · ta'lim · ⭐ 🇺🇿")
            self._p("  ✅ UTF-8 ishlayapti")
        except UnicodeEncodeError:
            self.muammolar.append(
                "UnicodeEncodeError → set PYTHONIOENCODING=utf-8")
        if "utf" not in enc:
            self.ogohlar.append(
                f"stdout kodirovkasi '{sys.stdout.encoding}' — "
                f"o'zbekcha matn buzilishi mumkin → PYTHONIOENCODING=utf-8")

    # ───── ⑤ graf ─────
    def graf(self):
        self._p("\n── GRAF SINOVI ──")
        try:
            class S(TypedDict):
                n: int

            g = StateGraph(S)
            g.add_node("qosh", lambda s: {"n": s["n"] + 1})
            g.add_edge(START, "qosh")
            g.add_edge("qosh", END)
            gc = g.compile()
            r = gc.invoke({"n": 41})
            self._p(f"  ✅ invoke: {r}")
            self.natija["graf"] = True
            try:
                gc.get_graph().draw_ascii()
                self._p("  ✅ draw_ascii()")
            except ImportError:
                self._p("  ⚠️ draw_ascii() — grandalf yo'q")
        except Exception as e:
            self.muammolar.append(f"GRAF ISHLAMADI: {type(e).__name__}: {e}")
            self._p(f"  ❌ {type(e).__name__}: {str(e)[:80]}")
            self.natija["graf"] = False

    # ───── ⑥ checkpointer ─────
    def checkpointer(self):
        self._p("\n── CHECKPOINTER ──")
        try:
            from langgraph.checkpoint.memory import InMemorySaver
            InMemorySaver()
            self._p("  ✅ InMemorySaver (qisqa muddatli)")
        except Exception as e:
            self.muammolar.append(f"InMemorySaver: {type(e).__name__}")
            self._p(f"  ❌ InMemorySaver: {type(e).__name__}")
        try:
            from langgraph.checkpoint.sqlite import SqliteSaver
            SqliteSaver(sqlite3.connect(":memory:", check_same_thread=False))
            self._p("  ✅ SqliteSaver (uzoq muddatli)")
        except Exception:
            self.ogohlar.append(
                "SqliteSaver yo'q → pip install langgraph-checkpoint-sqlite")
            self._p("  ⚠️ SqliteSaver yo'q")

    # ───── hisobot ─────
    def hisobot(self):
        self.tizim()
        self.paketlar()
        self.model()
        self.kodirovka()
        self.graf()
        self.checkpointer()

        print("\n" + "═" * 60)
        if self.muammolar:
            print(f"❌ {len(self.muammolar)} MUAMMO — bo'limni boshlab bo'lmaydi:")
            for m in self.muammolar:
                print(f"    • {m}")
        if self.ogohlar:
            print(f"\n⚠️ {len(self.ogohlar)} ogohlantirish:")
            for o in self.ogohlar:
                print(f"    • {o}")
        if not self.muammolar:
            print("\n🏆 MUHIT TAYYOR")
            if self.natija.get("model") == "fake":
                print("   💡 model yo'q — graf mantiqini o'rganish uchun YETARLI")
        return not self.muammolar

    def json_saqla(self, yol="tashxis.json"):
        Path(yol).write_text(
            json.dumps({"natija": self.natija, "muammolar": self.muammolar,
                        "ogohlar": self.ogohlar},
                       ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"\n💾 {yol}")


t = MuhitTashxis()
t.hisobot()
t.json_saqla()
```

> ## 🏆 **NIMA UCHUN BU LOYIHA MUHIM?**
> ```
> ✅ "Menda ishlamayapti" → BIR BUYRUQ bilan sabab topiladi
> ✅ Har muammo uchun ANIQ YECHIM ko'rsatiladi (pip install ...)
> ✅ tashxis.json — muammoni boshqa odamga YUBORISH mumkin
> 🇺🇿 Kodirovka tekshiruvi — o'zbekcha loyihalarda HAL QILUVCHI
> ```
>
> ## 💡 **`ollama serve` ISHLAYAPTIMI?** — tez-tez uchraydigan chalkashlik: paket **o'rnatilgan**, lekin **server ishlamayapti**. Bu tashxis buni **ajratadi**.

---

# 🔌 2-loyiha. Universal model adapteri

> **Maqsad:** kodni **o'zgartirmasdan** OpenAI / Ollama / soxta model orasida **almashish**.

```python
class ModelAdapter:
    """Mavjud eng yaxshi modelni tanlaydi, sinaydi va SIFAT DARAJASINI aytadi."""

    DARAJA = {
        "ChatOpenAI":        ("🏆 to'liq",    "javob sifati va graf mantiqi"),
        "ChatOllama":        ("✅ yaxshi",    "javob sifati (mahalliy) va mantiq"),
        "FakeListChatModel": ("⚠️ faqat sinov", "FAQAT graf mantiqi"),
    }

    def __init__(self, temperature=0, seed=365,
                 openai_model="gpt-4o-mini", ollama_model="qwen2.5:7b",
                 fake_javoblar=None):
        self.temperature, self.seed = temperature, seed
        self.openai_model, self.ollama_model = openai_model, ollama_model
        self.fake_javoblar = fake_javoblar or ["Sinov javobi."] * 200
        self.nom, self.model = None, None
        self.urinishlar = []
        self.chaqiruv, self.jami_s = 0, 0.0

    # ───── sinov ─────
    def _sinov(self, nom, yaratuvchi):
        t0 = time.perf_counter()
        try:
            m = yaratuvchi()
            m.invoke([HumanMessage("hi")])
            self.urinishlar.append({"model": nom, "holat": "✅",
                                    "s": round(time.perf_counter() - t0, 2),
                                    "sabab": "—"})
            return m
        except Exception as e:
            self.urinishlar.append({"model": nom, "holat": "❌",
                                    "s": round(time.perf_counter() - t0, 2),
                                    "sabab": f"{type(e).__name__}: {str(e)[:44]}"})
            return None

    # ───── tanlash ─────
    def ol(self, majburiy=None):
        """majburiy='fake' → tekshirmasdan soxta modelni oladi (sinov uchun)."""
        if majburiy == "fake":
            self.nom = "FakeListChatModel"
            self.model = FakeListChatModel(responses=self.fake_javoblar)
            print("⚠️ MAJBURIY: FakeListChatModel")
            return self._oram()

        if os.getenv("OPENAI_API_KEY"):
            def f():
                from langchain_openai import ChatOpenAI
                return ChatOpenAI(model=self.openai_model,
                                  temperature=self.temperature, seed=self.seed)
            m = self._sinov("ChatOpenAI", f)
            if m is not None:
                self.nom, self.model = "ChatOpenAI", m
                return self._oram()
        else:
            self.urinishlar.append({"model": "ChatOpenAI", "holat": "⚪",
                                    "s": 0.0, "sabab": "OPENAI_API_KEY yo'q"})

        def f2():
            from langchain_ollama import ChatOllama
            return ChatOllama(model=self.ollama_model,
                              temperature=self.temperature)
        m = self._sinov("ChatOllama", f2)
        if m is not None:
            self.nom, self.model = "ChatOllama", m
            return self._oram()

        self.nom = "FakeListChatModel"
        self.model = FakeListChatModel(responses=self.fake_javoblar)
        self.urinishlar.append({"model": self.nom, "holat": "⚠️",
                                "s": 0.0, "sabab": "zaxira variant"})
        return self._oram()

    # ───── o'ram: chaqiruvlarni SANAYDI ─────
    def _oram(self):
        print(pd.DataFrame(self.urinishlar).to_string(index=False))
        daraja, nima = self.DARAJA[self.nom]
        print(f"\n🎯 {self.nom}  —  {daraja}")
        print(f"   sinash mumkin: {nima}")
        if self.nom == "FakeListChatModel":
            print("   ⚠️ javoblar SOXTA — javob sifatini BAHOLAMANG")

        adapter = self

        class OramliModel:
            """invoke chaqiruvlarini sanaydigan yupqa qatlam."""

            def __init__(self, m):
                self._m = m

            def invoke(self, *a, **kw):
                t0 = time.perf_counter()
                r = self._m.invoke(*a, **kw)
                adapter.chaqiruv += 1
                adapter.jami_s += time.perf_counter() - t0
                return r

            def __getattr__(self, nom):
                return getattr(self._m, nom)

        return OramliModel(self.model)

    def statistika(self):
        print(f"\n📊 {self.nom}")
        print(f"   chaqiruvlar : {self.chaqiruv}")
        print(f"   jami vaqt   : {self.jami_s:.2f}s")
        if self.chaqiruv:
            print(f"   o'rtacha    : {self.jami_s/self.chaqiruv*1000:.0f} ms")
        return {"model": self.nom, "chaqiruv": self.chaqiruv,
                "jami_s": round(self.jami_s, 2)}


# ─── ishlatish: grafda ───
adapter = ModelAdapter()
chat = adapter.ol()

class S(TypedDict):
    savol: str
    javob: str

def bot(s: S) -> S:
    return {"javob": chat.invoke([HumanMessage(s["savol"])]).content}

g = StateGraph(S)
g.add_node("bot", bot)
g.add_edge(START, "bot"); g.add_edge("bot", END)
gc = g.compile()

for savol in ["Kredit foizi qancha?", "Karta necha kunda tayyor?",
              "Depozit muddati?"]:
    r = gc.invoke({"savol": savol, "javob": ""})
    print(f"  {savol:32s} → {r['javob'][:44]}")

adapter.statistika()
```

> ## 🏆 **UCHTA FOYDA:**
> ```
> ① Kod O'ZGARMAYDI  →  model almashsa ham graf bir xil
> ② Chaqiruvlar SANALADI  →  💰 narxni bilasiz (46–47-modulda kerak bo'ladi)
> ③ Sifat darajasi AYTILADI  →  soxta model bilan sifat baholab qo'ymaysiz
> ```
>
> ## 💡 **`__getattr__` — O'RAM NAQSHINING KALITI.** `batch`, `stream`, `bind` — **hammasi** asl modelga o'tadi, faqat `invoke` **sanaladi**.
>
> ## ⭐ **`majburiy="fake"` — TESTLARDA ISHLATING.** CI'da API kaliti **bo'lmaydi**, lekin graf mantiqi **sinalishi kerak**.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🩺 **Muhit tashxisi** | "Menda ishlamayapti" | ## Har muammoga **aniq yechim** |
| 2 | 🔌 **Model adapteri** | Model almashinuvi | ## `__getattr__` o'rami + **chaqiruv hisobi** |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
