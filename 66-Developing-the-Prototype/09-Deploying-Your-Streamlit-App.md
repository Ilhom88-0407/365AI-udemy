# 9-dars. Streamlit ilovasini deploy qilish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `pip freeze > requirements.txt` ni 'kutubxonalar ko'p bo'lsa' deb tavsiya qiladi. Biz uni ishga tushirdik — 244 qator chiqdi. Qo'lda yozilgani — 3 qator."**

---

## 1. `requirements.txt` — nima uchun kerak?

Streamlit Community Cloud sizning kodingizni **toza serverda** ishga tushiradi. U qaysi kutubxonalar kerakligini **bilmaydi**.

```
streamlit
openai
streamlit_js_eval
```

> ## ⭐ **UCHTA QATOR — VA HAMMASI SHU.**

---

## 2. 💥💥 `pip freeze` — kursning "oson yo'li"

Kurs aytadi:

> *"Agar kutubxonalar shunchalik ko'p bo'lsaki, ularni kuzata olmasangiz, quyidagi buyruqni ishlatishingiz mumkin."*

```bash
pip freeze > requirements.txt
```

### 🔬 O'lchaymiz

```bash
python -m pip freeze | wc -l
```

### ✅ Haqiqiy natija

```
pip freeze qatorlari: 244
qo'lda yozilgan: 3
```

```
accelerate==1.14.0
aiohappyeyeballs==2.7.1
aiohttp==3.14.3
aiosignal==1.4.0
aiosqlite==0.22.1
...
```

> ## 💥💥💥 **244 QATOR — 3 O'RNIGA.**
>
> ## ⭐ Va bularning **ko'pchiligi** — ## `librosa`, `torch`, `jupyter`, ## ya'ni ## 💥 **bu loyihaga umuman aloqasi yo'q**.

### ⚠️ Nima uchun bu yomon?

| Muammo | Oqibat |
|---|---|
| ## **Sekin o'rnatish** | ## 💥 Deploy **daqiqalar** davom etadi |
| Ziddiyatli versiyalar | ## 💥 **Deploy yiqiladi** |
| ## **Platformaga bog'liq paketlar** | ## 💥 `torch==2.12.0+cpu` — ## Linux serverida **topilmasligi** mumkin |
| Xotira chegarasi | 💥 Bepul tarifda **1 GB** |

> ## 🏆 **TO'G'RI YO'L — QO'LDA YOZISH.** ## Loyihada nechta `import` bor? ## ⭐ Odatda **3–7 ta**.

### ⭐ Agar avtomatlashtirmoqchi bo'lsangiz

```bash
pip install pipreqs
pipreqs . --force
```

> ## ⭐ **`pipreqs` — FAQAT `import` QILINGANLARNI YOZADI.** ## `pip freeze` esa — **hamma o'rnatilganni**.

---

## 3. 🔧 Kutubxonalarni **koddan** topish

```python
import ast
import pathlib


def importlar(katalog="."):
    """Loyihadagi barcha TASHQI import larni topadi."""
    ichki = set(__import__("sys").stdlib_module_names)
    topilgan = set()

    for f in pathlib.Path(katalog).rglob("*.py"):
        try:
            daraxt = ast.parse(f.read_text(encoding="utf-8"))
        except (SyntaxError, UnicodeDecodeError):
            continue
        for n in ast.walk(daraxt):
            if isinstance(n, ast.Import):
                for a in n.names:
                    topilgan.add(a.name.split(".")[0])
            elif isinstance(n, ast.ImportFrom) and n.level == 0 and n.module:
                topilgan.add(n.module.split(".")[0])

    return sorted(topilgan - ichki)
```

```python
print(importlar("."))
```

### ✅ Haqiqiy natija *(kursning `app.py` si uchun)*

```
['openai', 'streamlit', 'streamlit_js_eval']
```

> ## 🏆 **AYNAN UCHTA — VA AYNAN TO'G'RI.**
>
> ## ## ⭐ **`sys.stdlib_module_names`** — ## Python ning **o'z** modullarini ## avtomatik chiqarib tashlaydi.

---

## 4. ⭐ Versiyalarni **qotirish** kerakmi?

| Yozuv | Ma'nosi | Qachon |
|---|---|---|
| `streamlit` | **Eng yangi** | ## ⚠️ Prototip |
| ## `streamlit>=1.60` | Minimal versiya | ## ⭐ **Yaxshi muvozanat** |
| ## `streamlit==1.62.0` | ## **Aynan shu** | ## 🏆 **Ishlab chiqarish** |

> ## 💥 **VERSIYASIZ — "BUGUN ISHLAYDI, ERTAGA YO'Q".** ## Streamlit **tez-tez** yangilanadi, ## va API o'zgarishlari **bo'ladi**.

### ⭐ Tavsiya etiladigan `requirements.txt`

```
streamlit>=1.60,<2.0
openai>=1.50,<2.0
```

> ## 🏆 **`>=` VA `<` BIRGA:** ## ① xatolar tuzatilgan yangilanishlar **keladi**, ## ② katta versiya o'zgarishi ## ⭐ **ilovani buzmaydi**.

> ## 💡 **VA `streamlit_js_eval` — KERAK EMAS** *(7-dars)*: ## `st.session_state.clear(); st.rerun()` ## ⭐ **ikki qator** bilan o'sha ishni qiladi.

---

## 5. ⭐ Deploy qadamlari

| Qadam | Nima qilinadi |
|---|---|
| 1 | `share.streamlit.io` ga kiring *(GitHub bilan)* |
| 2 | **Create App** → *Deploy a public app from GitHub* |
| 3 | Repozitoriy, shox *(`main`)*, fayl yo'li *(`app.py`)* |
| 4 | ## ⭐ **Advanced settings** → secrets |
| 5 | **Deploy** |

### 🔑 Secrets — **`secrets.toml` ning o'zi**

```toml
OPENAI_API_KEY = "sk-proj-..."
```

> ## 🏆 **BU — TO'G'RI YO'L:** ## kalit **GitHub da emas**, ## Streamlit ning **o'z panelida**.
>
> ## ## ⭐ **YA'NI 8-DARSDAGI `.gitignore` MUAMMOSI ## SHU YERDA HAL BO'LADI:** ## `secrets.toml` faylini repozitoriyga ## **umuman qo'ymaslik** kerak.

---

## 6. ⚠️ Bepul tarifning **chegaralari**

| Resurs | Chegara |
|---|---|
| ## **Xotira** | ## 1 GB |
| Repozitoriy | ## 💥 **ochiq bo'lishi shart** |
| Ilovalar soni | cheklangan |
| ## **Uxlash rejimi** | ## ⚠️ Faolsiz ilova **to'xtaydi** |

> ## 💥💥 **VA MANA NEGA MAHALLIY MODEL BU YERDA ISHLAMAYDI:** ## `Qwen2.5-0.5B` — **~1 GB**, ## `torch` — **yana ~800 MB**. ## ## ⭐ **1 GB chegarasiga sig'maydi.**

> ## 🏆 **YA'NI BU KITOBDAGI KALITSIZ YO'L — ## MAHALLIY ISHLASH UCHUN,** ## deploy uchun esa ## ⭐ **API kaliti kerak**.

### ⭐ Muqobil variantlar

| Platforma | Xotira | Izoh |
|---|---|---|
| Streamlit Cloud | 1 GB | ## ⭐ **Eng oson** |
| Hugging Face Spaces | 16 GB *(bepul CPU)* | ## 🏆 **Mahalliy model SIG'ADI** |
| Render / Railway | o'zgaruvchan | Konteyner kerak |
| ## **O'z serveringiz** | ## cheksiz | ## ⭐ To'liq nazorat |

> ## 💡 **AGAR KALITSIZ DEPLOY QILMOQCHI BO'LSANGIZ —** ## ⭐ **Hugging Face Spaces** ni ko'ring: ## u 16 GB beradi va `transformers` ni ## **o'zi qo'llab-quvvatlaydi**.

---

## 7. 🔧 Deploy oldidan **tekshiruv ro'yxati**

```python
import pathlib


def deploy_tayyormi(katalog="."):
    p = pathlib.Path(katalog)
    tekshiruvlar = []

    def yoz(nom, ok, izoh=""):
        tekshiruvlar.append((nom, ok, izoh))

    yoz("app.py bor", (p / "app.py").exists())
    yoz("requirements.txt bor", (p / "requirements.txt").exists())
    yoz(".gitignore bor", (p / ".gitignore").exists())

    gi = (p / ".gitignore")
    yoz("secrets .gitignore da",
        gi.exists() and "secrets.toml" in gi.read_text(encoding="utf-8"))

    req = (p / "requirements.txt")
    if req.exists():
        n = len([q for q in req.read_text(encoding="utf-8").splitlines() if q.strip()])
        yoz(f"requirements qatorlari ({n})", n <= 15,
            "💥 pip freeze ishlatilgan bo'lishi mumkin" if n > 15 else "")

    yoz("secrets.toml kuzatilmaydi",
        not (p / ".streamlit" / "secrets.toml").exists()
        or (gi.exists() and "secrets.toml" in gi.read_text(encoding="utf-8")))
    return tekshiruvlar
```

```python
for nom, ok, izoh in deploy_tayyormi("."):
    print(f"  {'✅' if ok else '💥'} {nom}{'  ' + izoh if izoh else ''}")
```

### ✅ Haqiqiy natija

```
  ✅ app.py bor
  ✅ requirements.txt bor
  ✅ .gitignore bor
  ✅ secrets .gitignore da
  ✅ requirements qatorlari (2)
  ✅ secrets.toml kuzatilmaydi
```

### 💥 Va kursning tuzilishida

```
  ✅ app.py bor
  ✅ requirements.txt bor
  💥 .gitignore bor
  💥 secrets .gitignore da
  ✅ requirements qatorlari (3)
  💥 secrets.toml kuzatilmaydi
```

> ## 💥 **UCHTA TEKSHIRUV YIQILDI** — ## va uchalasi ham ## ⭐ **bitta sabab: `.gitignore` yo'q**.

---

## 8. 🏆 Modulning yakuni

Kurs oxirida aytadi:

> *"Keyingi bo'limda Ace Interview — bugun ishlab turgan va minglab talabalarga intervyuga tayyorlanishda yordam berayotgan intervyu simulyatorimizni qanday qurganimizni ichkaridan ko'rasiz."*

| Biz qurgan narsa | Holat |
|---|---|
| Kalitsiz mijoz *(Adapter)* | ## 🏆 **ishlaydi** |
| Sozlash → suhbat → fikr-mulohaza | ## 🏆 **3/3 sinov o'tdi** |
| Xabar chegarasi | ## ✅ **tuzatildi** *(5/5 javob)* |
| Kirish validatsiyasi | ## ✅ **qo'shildi** |
| ## **Prompt injection himoyasi** | ## ⭐ **qisman** *(regex 3/3, prompt 0/3)* |
| JSON fikr-mulohaza | ## 🏆 **few-shot bilan 5/5** |
| `.gitignore` | ## ✅ **qo'shildi** |

---

## 🎯 Nazorat savollari

1. `pip freeze` nechta qator chiqardi?
2. Nima uchun `pip freeze` deploy uchun yomon?
3. Kutubxonalarni koddan qanday topish mumkin?
4. Nega mahalliy model Streamlit Cloud da ishlamaydi?
5. Kalit deploy da qayerga qo'yiladi?

<details>
<summary>Javoblar</summary>

1. ## **244 ta** — qo'lda yozilgan **3** ta o'rniga. 💥 Ularning ko'pchiligi (`librosa`, `torch`, `jupyter`) bu loyihaga **aloqasi yo'q**.
2. ## **Sekin o'rnatish**, **ziddiyatli versiyalar**, va eng muhimi — **platformaga bog'liq paketlar** *(`torch==2.12.0+cpu`)* Linux serverida **topilmasligi** mumkin. 💥 Deploy **yiqiladi**.
3. ## **`ast` moduli bilan** — barcha `.py` fayllarni parse qilib, `Import`/`ImportFrom` tugunlarini yig'ish va `sys.stdlib_module_names` ni chiqarib tashlash. ⭐ Yoki `pipreqs`.
4. ## **1 GB xotira chegarasi.** `Qwen2.5-0.5B` ~1 GB + `torch` ~800 MB. ⭐ Muqobil — **Hugging Face Spaces** (16 GB bepul).
5. ## **Streamlit panelida:** *Advanced settings* → secrets. 🏆 GitHub da **emas** — 8-darsdagi muammo shu bilan hal bo'ladi.

</details>

---

⬅️ [8-dars](08-Uploading-Your-Project-in-GitHub.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
