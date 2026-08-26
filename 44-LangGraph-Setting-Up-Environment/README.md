# ⚙️ 44-modul. LangGraph — muhitni sozlash

> ## ⭐⭐ **BU MODULNING BITTA MAQSADI: API KALITISIZ VA ANACONDASIZ ISHGA TUSHIRISH.**

---

## 📚 Darslar

| # | Dars | Nima o'rganasiz |
|---|---|---|
| 1 | [Muhitni sozlash](01-Setting-Up-the-Environment.md) ⭐⭐ | `venv` · paketlar · ## ⭐ **uchta model varianti** · 🇺🇿 UTF-8 |

---

## 📝 Amaliyot

| | |
|---|---|
| 📝 [**12 ta mashq**](MASHQLAR.md) | 🟢 Oson · 🟡 O'rta · 🔴 Qiyin |
| 🚀 [**2 ta mini-loyiha**](LOYIHALAR.md) | 🩺 **muhit tashxisi** · 🔌 **universal model adapteri** |

---

## ⚡ Eng tez yo'l

```bash
python -m venv langgraph_env
langgraph_env\Scripts\activate          # Windows
# source langgraph_env/bin/activate     # macOS / Linux

pip install langgraph langgraph-checkpoint-sqlite
pip install langchain langchain-core tiktoken grandalf pandas
```

```python
from typing_extensions import TypedDict
from langgraph.graph import START, END, StateGraph

class S(TypedDict):
    n: int

g = StateGraph(S)
g.add_node("qosh", lambda s: {"n": s["n"] + 1})
g.add_edge(START, "qosh"); g.add_edge("qosh", END)
print(g.compile().invoke({"n": 41}))
```

```
{'n': 42}
```

> ## 🏆 **AGAR SHU ISHLASA — TAYYORSIZ.** Va e'tibor bering: ## **MODEL UMUMAN KERAK BO'LMADI**.

---

## 🔀 Model — uchta yo'l

| Variant | Narx | Qachon |
|---|---|---|
| ☁️ `ChatOpenAI` | $ | Ishlab chiqarish · javob **sifati** kerak |
| 🏠 `ChatOllama` | ## **bepul** | ## 🇺🇿 **Maxfiy ma'lumot** · offline |
| ## ⭐⭐ `FakeListChatModel` | ## **bepul, bir zumda** | ## 🏆 **GRAF MANTIQINI o'rganish va sinash** |

```python
import os

def model_ol(temperature=0, seed=365):
    if os.getenv("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        print("✅ ChatOpenAI")
        return ChatOpenAI(model="gpt-4o-mini", temperature=temperature, seed=seed)
    try:
        from langchain_ollama import ChatOllama
        m = ChatOllama(model="qwen2.5:7b", temperature=temperature)
        m.invoke("test")
        print("✅ ChatOllama")
        return m
    except Exception:
        pass
    from langchain_core.language_models.fake_chat_models import FakeListChatModel
    print("⚠️ FakeListChatModel — javoblar SOXTA")
    return FakeListChatModel(responses=["Sinov javobi."] * 100)
```

> ## 🔑 **BU FUNKSIYANI BUTUN BO'LIM DAVOMIDA ISHLATAMIZ.**

---

## 💥 Kurs aytmagan 5 ta narsa

```
① Anaconda SHART EMAS — venv yetadi
② API kaliti SHART EMAS — LangGraph modelsiz ham to'liq ishlaydi
③ Versiyani QOTIRISH shart emas — 1.x da hamma kod ishlaydi (o'lchandi)
④ requirements.txt YO'Q — olti oydan keyin muhitni tiklab bo'lmaydi
⑤ 🇺🇿 Windows'da UTF-8 — usiz o'zbekcha matn BUZILADI
```

---

## 🔬 O'lchangan versiyalar

| Paket | Versiya |
|---|---|
| `langgraph` | ## **1.2.11** |
| `langgraph-checkpoint` | 4.2.0 |
| `langgraph-checkpoint-sqlite` | 3.1.1 |
| `langchain-core` | 1.6.0 |
| `langchain` | 1.3.17 |
| Python | ## **3.14** *(kurs 3.11.11 aytadi)* |

> ## ✅ **KURSNING BUTUN KODI ISHLADI.**
>
> ## ⚠️ **BITTA MUHIM O'ZGARISH:** `recursion_limit` standarti — endi **10 000+** *(45-modulda batafsil)*.

---

## 🇺🇿 Windows uchun

```bash
set PYTHONIOENCODING=utf-8              # cmd
$env:PYTHONIOENCODING="utf-8"           # PowerShell
```

```python
open("suhbat.json", "w", encoding="utf-8")      # ⭐ DOIM
json.dump(data, f, ensure_ascii=False)          # ⭐ o'zbekcha o'qilsin
```

> ## 💥 **USIZ:** `UnicodeEncodeError` yoki `so'm` → **buzilgan belgilar**.

---

⬅️ [43-modul. Kirish](../43-LangGraph-Introduction/README.md) · 🏠 [Kurs boshiga](../README.md) · ➡️ [45-modul. Graf komponentlari](../45-LangGraph-Graph-Components/README.md)
