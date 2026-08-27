# 1-dars. Muhitni sozlash ⭐

## 🎬 Boshlashdan oldin

> **"Kurs VS Code + Python + Anaconda + Streamlit talab qiladi. Bizga faqat ikkitasi kerak — va Anaconda ularning ichida emas."**

---

## 1. Kursning ro'yxati

| # | Nima | Kurs | ## Haqiqatan kerakmi? |
|---|---|---|---|
| ① | **VS Code** | ✅ talab | ## ⚠️ **istalgan muharrir** |
| ② | **Python** | ✅ talab | ## ✅ **SHART** |
| ③ | ## **Anaconda** | ✅ talab | ## 💥 **KERAK EMAS** |
| ④ | Python kengaytmasi | ✅ talab | ## ⚠️ **qulaylik** |
| ⑤ | **Streamlit** | ✅ talab | ## ✅ **SHART** |

> ## 💥 **ANACONDA — 3–5 GB.** ## 57-modulda buni allaqachon ko'rgan edik: ## ## 🏆 **`venv` — ~50 MB va yetarli.**

---

## 2. ⭐ Minimal sozlash

```bash
python -m venv llm_env
llm_env\Scripts\activate            # Windows
# source llm_env/bin/activate       # macOS / Linux

python -m pip install --upgrade pip
pip install streamlit
```

### 🔬 Tekshiruv

```python
import streamlit, sys
print(f"Python     {sys.version.split()[0]}")
print(f"Streamlit  {streamlit.__version__}")
print(f"muhit      {'✅ virtual' if sys.prefix != sys.base_prefix else '⚠️ GLOBAL'}")
```

```
Python     3.14.2
Streamlit  1.62.0
muhit      ✅ virtual
```

---

## 3. 🔬 Birinchi ilova

```python
# app.py
import streamlit as st

st.title("Hello world")
```

```bash
streamlit run app.py
```

```
  You can now view your Streamlit app in your browser.
  Local URL: http://localhost:8501
```

| Buyruq | Nima qiladi |
|---|---|
| `streamlit run app.py` | Serverni ishga tushiradi |
| `Ctrl + C` | To'xtatadi |
| `↑` *(terminalda)* | Oxirgi buyruqni qaytaradi |
| `R` *(brauzerda)* | Qayta ishga tushiradi |
| ## `streamlit run --server.headless true` | ## ⭐ **brauzer ochilmaydi** |

---

## 4. 🏆🏆 Kurs ko'rsatmagan narsa: **brauzersiz sinash**

Streamlit ilovasini **kodda** sinash mumkin — bu **rasmiy** vosita:

```python
from streamlit.testing.v1 import AppTest

at = AppTest.from_string("""
import streamlit as st
st.title("Hello world")
st.write("salom")
""")
at.run()

print("title    :", at.title[0].value)
print("markdown :", [m.value for m in at.markdown])
print("xato     :", at.exception)
```

```
title    : Hello world
markdown : ['salom']
xato     : ElementList()
```

> ## 🏆🏆 **BU — BUTUN MODULNING ENG MUHIM VOSITASI.**
>
> ## ## ⭐ **U bilan biz:**
> ## · brauzersiz **tugma bosamiz**
> ## · `session_state` ni **o'qiymiz**
> ## · **avtomatik test** yozamiz
> ## · **CI da ishlatamiz**

### 📋 `AppTest` ning asosiy metodlari

| Metod | Nima qiladi |
|---|---|
| `AppTest.from_file("app.py")` | Fayldan yuklash |
| `AppTest.from_string(kod)` | Satrdan yuklash |
| `at.run()` | Skriptni bajarish |
| ## `at.button[0].click().run()` | ## ⭐ **Tugma bosish** |
| `at.text_input[0].set_value("x").run()` | Matn kiritish |
| `at.slider[0].set_value(8).run()` | Slayder |
| ## `at.session_state` | ## ⭐ **Holatni o'qish** |
| `at.exception` | Xatolar |
| `at.markdown`, `at.title`, `at.chat_message` | Elementlar |

---

## 5. ⚠️ Amaliy maslahatlar

| Muammo | Yechim |
|---|---|
| Port band | `streamlit run app.py --server.port 8502` |
| Brauzer ochilmasin | ## ⭐ **`--server.headless true`** |
| Har o'zgarishda qayta yuklash | Brauzerda **`Always rerun`** |
| Kesh tozalash | `st.cache_data.clear()` |
| ## Konfiguratsiya | ## ⭐ **`.streamlit/config.toml`** |

### ⭐ Foydali `.streamlit/config.toml`

```toml
[server]
headless = true
runOnSave = true

[browser]
gatherUsageStats = false

[theme]
base = "dark"
```

> ## ⚠️ **`gatherUsageStats = false`** — ## Streamlit standart holda **telemetriya** yuboradi.

---

## 🎯 Nazorat savollari

1. Kursning ro'yxatidan nima kerak emas?
2. `AppTest` nima uchun kerak?
3. Brauzersiz ishga tushirish qanday?
4. `gatherUsageStats` nima?

<details>
<summary>Javoblar</summary>

1. ## **Anaconda** *(3–5 GB)*. `venv` **~50 MB** va yetarli *(57-modul)*. VS Code ham majburiy emas — istalgan muharrir.
2. Streamlit ilovasini **brauzersiz, kodda** sinash uchun: tugma bosish, `session_state` o'qish, **avtomatik test**, **CI**.
3. `streamlit run app.py --server.headless true` yoki `.streamlit/config.toml` da `headless = true`.
4. Streamlit standart holda **telemetriya** yuboradi. `false` qilib **o'chiring**.

</details>

---

⬅️ [64-modul](../64-Crafting-and-Testing-Prompts/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-Streamlit-Pros-and-Cons.md)
