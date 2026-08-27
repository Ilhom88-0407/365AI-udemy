# 4-dars. Matn metodlari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `st.write` ni 'eng ko'p qirrali' deydi. Biz uni 8 xil ma'lumot turi bilan sinadik — 8/8 ishladi. Lekin bittasida u sizni aldaydi."**

---

## 1. Uchta metod

| Metod | Nima qiladi | Qachon |
|---|---|---|
| `st.text` | ## **Formatlashsiz** xom matn | Log, kod chiqishi |
| `st.markdown` | Markdown sintaksisi | ## ⭐ **Aniq nazorat** |
| ## `st.write` | ## **Turni O'ZI aniqlaydi** | ## 🏆 **Eng ko'p** |

```python
st.text("This is plain text with no formatting")
st.markdown("# Sarlavha\n**qalin** va *kursiv*\n- ro'yxat")
st.write("Bu ham markdown, lekin **avtomatik**")
```

---

## 2. 🔬 `st.write` — nechta turni tushunadi?

```python
kod = '''
import streamlit as st
import pandas as pd, numpy as np

st.write("matn")                                    # 1
st.write(42)                                        # 2
st.write(3.14159)                                   # 3
st.write(True)                                      # 4
st.write({"ism": "Aziz", "yosh": 28})               # 5
st.write([1, 2, 3])                                 # 6
st.write(pd.DataFrame({"a": [1, 2], "b": [3, 4]}))  # 7
st.write(np.array([1, 2, 3]))                       # 8
'''
at = AppTest.from_string(kod)
at.run()
print(f"xato: {len(at.exception)}")
print(f"markdown : {len(at.markdown)}")
print(f"json     : {len(at.get('json'))}")
print(f"dataframe: {len(at.get('dataframe'))}")     # ⚠️ 'dataframe', 'arrow_data_frame' EMAS
```

### ✅ Haqiqiy natija

```
xato: 0
markdown : 4
json     : 2
dataframe: 2
```

> ## 🏆 **8 TA CHAQIRUV — 3 XIL ELEMENT TURIGA AYLANDI:**
>
> ## ⭐ **markdown 4 ta** — matn, son, float, bool
> ## ⭐ **json 2 ta** — lug'at, ro'yxat
> ## ⭐ **dataframe 2 ta** — DataFrame **va NumPy massiv**

> ## 🔧 **BU YERDA MEN XATO QILDIM:** ## avval `at.get("arrow_data_frame")` deb yozgan edim — ## va u **`0`** qaytardi.
>
> ## ## 🔑 **To'g'ri nom — `at.get("dataframe")`.** ## `at.main` dagi element sinfi: **`Dataframe`**.
>
> ## ## ⚠️ **VA BU — `AppTest` BILAN ISHLAGANDA UMUMIY TUZOQ:** ## element nomini **taxmin qilmang** — ## `[type(el).__name__ for el in at.main]` bilan **ko'ring**.

> ## 💡 **VA MANA `st.write` NING KUCHI:** ## siz **turini aytmaysiz** — u **o'zi tanlaydi**.

---

## 3. 💥 Lekin bitta joyda u **sizni aldaydi**

```python
kod = '''
import streamlit as st
st.write("Salom", "dunyo", 42)
'''
at = AppTest.from_string(kod); at.run()
print([m.value for m in at.markdown])
```

```
['Salom dunyo `42`']
```

> ## ⚠️ **BIR NECHTA ARGUMENT — BITTA QATORGA QO'SHILADI.** ## `print()` kabi.
>
> ## ## 💥 **LEKIN E'TIBOR BERING — `42` BEKTIK ICHIDA:** ## `` `42` ``. ## Ya'ni `st.write` sonni **kod** deb formatlaydi.

### 💥 Va endi — tuzoq

```python
kod = '''
import streamlit as st
javob = None
st.write("Natija:", javob)
'''
at = AppTest.from_string(kod); at.run()
print(repr([m.value for m in at.markdown]))
```

```
['Natija: `None`']
```

> ## 🔧 **MEN "`None` JIMGINA YO'QOLADI" DEB KUTGAN EDIM.** ## ## 💥 **HAQIQAT: u `` `None` `` bo'lib KO'RINADI.**

> ## ⚠️ **VA BU — YAXSHIROQ, LEKIN HALI HAM MUAMMO.** ## Foydalanuvchi ekranda **`Natija: None`** ni ko'radi. ## ## 🔑 **LLM ilovasida bu "texnik nosozlik" taassurotini beradi.**

### ✅ Yechim

```python
st.write("Natija:", javob if javob is not None else "⚠️ javob yo'q")
```

> ## 💡 **VA UMUMIY QOIDA:** ## `st.write` ga **hech qachon `None` bermang** — ## uni **oldindan tekshiring**.

---

## 4. ⭐ `st.write` vs `st.markdown` — qachon qaysi?

| Vaziyat | Tanlov | Nega |
|---|---|---|
| Oddiy matn | `st.write` | Qisqa |
| ## **Foydalanuvchi kiritgan matn** | ## 🏆 **`st.text`** | ## **Markdown ishlanmaydi** |
| Aniq formatlash | `st.markdown` | Nazorat |
| DataFrame, lug'at | ## ⭐ **`st.write`** | Avtomatik |
| ## **HTML kerak** | `st.markdown(..., unsafe_allow_html=True)` | ## 💥 **XAVFLI** |

### 💥💥 Nega foydalanuvchi matnini `st.write` bilan ko'rsatmaslik kerak?

```python
kod = '''
import streamlit as st
foydalanuvchi_kiritdi = "# MEN SARLAVHAMAN\\n**va qalinman**"
st.write(foydalanuvchi_kiritdi)
st.text(foydalanuvchi_kiritdi)
'''
at = AppTest.from_string(kod); at.run()
print("write:", repr([m.value for m in at.markdown]))
```

```
write: ['# MEN SARLAVHAMAN\n**va qalinman**']
```

> ## ⚠️ **`AppTest` XOM MATNNI KO'RSATADI**, lekin brauzerda ## `st.write` uni **katta sarlavha** qilib chizadi.
>
> ## ## 💥 **YA'NI FOYDALANUVCHI SIZNING ILOVANGIZNING ## KO'RINISHINI BUZISHI MUMKIN.**
>
> ## ## 🏆 **`st.text` — xavfsiz:** u **hech narsani ishlamaydi**.

### 💥💥💥 Va `unsafe_allow_html=True` — **hech qachon** foydalanuvchi matni bilan

```python
# ❌ HECH QACHON
st.markdown(foydalanuvchi_kiritdi, unsafe_allow_html=True)
```

> ## 💥 **BU — XSS ZAIFLIGI.** ## Foydalanuvchi `<script>` yozsa — ## u **boshqa foydalanuvchilarning brauzerida** ishlaydi.
>
> ## ## 🔑 **67-modulda `prompt injection` ni ko'ramiz.** ## ## ⭐ **Bu — uning veb versiyasi.**

---

## 5. ⭐⭐ `@st.cache_data` — 2-darsdagi va'da

2-darsda aytgan edik: har o'zaro ta'sirda **butun skript qayta ishlaydi**.

```python
kod = '''
import streamlit as st, time

if "chaqiruvlar" not in st.session_state:
    st.session_state.chaqiruvlar = 0

@st.cache_data
def qimmat_hisob(n):
    st.session_state.chaqiruvlar += 1
    time.sleep(0.05)
    return sum(range(n))

st.write(qimmat_hisob(100_000))
st.write(qimmat_hisob(100_000))     # ⭐ bir xil argument
st.write(qimmat_hisob(200_000))     # boshqa argument
st.write(f"funksiya {st.session_state.chaqiruvlar} marta bajarildi")
'''
at = AppTest.from_string(kod); at.run()
print([m.value for m in at.markdown])
```

### ✅ Haqiqiy natija

```
['`4999950000`', '`4999950000`', '`19999900000`', 'funksiya 2 marta bajarildi']
```

> ## 🏆🏆 **UCHTA CHAQIRUV — IKKITA BAJARILISH.**
>
> ## Ikkinchi `qimmat_hisob(100_000)` **keshdan** olindi.

### ⚠️ `cache_data` vs `cache_resource`

| Dekorator | Nima uchun | Misol |
|---|---|---|
| ## `@st.cache_data` | ## **Ma'lumot** *(nusxa qaytaradi)* | DataFrame, hisob natijasi |
| ## `@st.cache_resource` | ## **Resurs** *(BIR XIL obyekt)* | ## ⭐ **model, MB ulanishi** |

```python
@st.cache_resource                  # ⭐ model uchun
def model_yukla():
    from transformers import pipeline
    return pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct")
```

> ## 💥 **MODEL UCHUN `cache_data` ISHLATMANG** — ## u obyektni **nusxalashga** urinadi. ## ## 🔑 **57-modulda o'lchagan edik:** ## model yuklash **~3 s**, va u har qayta ishga tushishda **takrorlanadi**.

---

## 🎯 Nazorat savollari

1. `st.write` nechta ma'lumot turini tushundi?
2. `st.write("Natija:", None)` nima ko'rsatadi?
3. Foydalanuvchi matnini qaysi metod bilan ko'rsatish kerak?
4. `unsafe_allow_html=True` nima uchun xavfli?
5. `cache_data` va `cache_resource` farqi nima?

<details>
<summary>Javoblar</summary>

1. **8 ta chaqiruv → 3 xil element**: `markdown` **4** *(matn, int, float, bool)*, `json` **2** *(lug'at, ro'yxat)*, `dataframe` **2** *(DataFrame va NumPy massiv)*. ⚠️ `AppTest` da to'g'ri nom — **`at.get("dataframe")`**, `arrow_data_frame` emas (men shu yerda xato qilgan edim).
2. ## **`Natija: `None``** — men *"jimgina yo'qoladi"* deb kutgan edim, lekin `None` **ko'rinadi** (bektik ichida). ⚠️ Baribir foydalanuvchi uchun **texnik nosozlik** taassurotini beradi. ## ⭐ Qoida: `st.write` ga **hech qachon `None` bermang**.
3. ## **`st.text`** — u **hech narsani ishlamaydi**. `st.write` foydalanuvchi yozgan `# sarlavha` ni **haqiqiy sarlavha** qilib chizadi.
4. ## **XSS zaifligi.** Foydalanuvchi `<script>` yozsa — u **boshqa foydalanuvchilarning brauzerida** ishlaydi. ## ⭐ Bu — `prompt injection` ning veb versiyasi *(67-modul)*.
5. `cache_data` — **ma'lumot** uchun, **nusxa** qaytaradi. `cache_resource` — **resurs** uchun (model, MB ulanishi), **bir xil obyekt** qaytaradi. ## 💥 Model uchun `cache_data` ishlatmang.

</details>

---

⬅️ [3-dars](03-Titles-Headers-Formatting.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Chat-Elements.md)
