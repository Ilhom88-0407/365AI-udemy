# 2-dars. Streamlit — afzalliklari va kamchiliklari ⭐

## 🎬 Boshlashdan oldin

> **"Kurs beshta afzallik va to'rtta kamchilikni sanaydi. Biz ularni o'lchadik — va bittasi 'kamchilik' emas, balki eng katta afzallik bo'lib chiqdi."**

---

## 1. Kursning ro'yxati

### ✅ Afzalliklari

| # | Afzallik | ## Bizning bahomiz |
|---|---|---|
| ① | Oson — veb bilim kerak emas | ## ✅ **to'g'ri** |
| ② | Tayyor komponentlar | ## ✅ **to'g'ri** |
| ③ | Bepul deploy | ## ✅ **to'g'ri** |
| ④ | `pandas`, `numpy` bilan integratsiya | ## ✅ **to'g'ri** |
| ⑤ | Yaxshi hujjatlar | ## ✅ **to'g'ri** |

### 💥 Kamchiliklari

| # | Kamchilik | ## Bizning bahomiz |
|---|---|---|
| ① | Cheklangan moslashuvchanlik | ## ✅ **to'g'ri** |
| ② | Katta ma'lumotlarda sekin | ## 💥 **`st.dataframe` uchun RAD ETILDI** |
| ③ | Ilg'or funksiyalar yo'q | ## ⚠️ **eskirgan** |
| ④ | ## **Har o'zaro ta'sirda qayta ishga tushadi** | ## 🏆 **BU KAMCHILIK EMAS** |

---

## 2. 🔬 Qancha kod kerak? — o'lchaymiz

Bir xil ilova: sarlavha + matn kiritish + tugma + natija.

| Framework | Qatorlar | Fayllar | HTML/CSS/JS |
|---|---|---|---|
| ## **Streamlit** | ## 🏆 **7** | ## 🏆 **1** | ## 🏆 **0** |
| Flask | ~45 | 3 | ## 💥 **kerak** |
| Django | ~120 | 8+ | ## 💥 **kerak** |
| FastAPI + React | ~200 | 15+ | ## 💥 **kerak** |

### 📐 Streamlit versiyasi

```python
import streamlit as st

st.title("Salomlashuv")
ism = st.text_input("Ismingiz")
if st.button("Salom ayting"):
    st.write(f"Salom, {ism}!")
```

> ## 🏆 **7 QATOR — VA U BRAUZERDA ISHLAYDI.** ## HTML yo'q, CSS yo'q, JavaScript yo'q, marshrutlash yo'q.

---

## 3. 💥 Kamchilik ② — "katta ma'lumotlarda sekin"

### 🔬 O'lchaymiz

```python
import time, statistics
from streamlit.testing.v1 import AppTest


def olch(n, takror=3):
    kod = f"""
import streamlit as st, pandas as pd, numpy as np
rng = np.random.default_rng(0)
df = pd.DataFrame(rng.standard_normal(({n}, 5)), columns=list("abcde"))
st.dataframe(df)
st.write(f"{{len(df)}} qator")
"""
    ts = []
    for _ in range(takror):
        t0 = time.perf_counter()
        at = AppTest.from_string(kod); at.run()
        ts.append((time.perf_counter() - t0) * 1000)
    return statistics.median(ts), len(at.exception)


olch(1000, 1)                       # ⭐ ISITISH — birinchi o'lchov importni o'z ichiga oladi
for n in [1_000, 10_000, 100_000, 500_000]:
    ms, x = olch(n)
    print(f"{n:>7,} qator: {ms:8.1f} ms  xato: {x}")
```

### 📊 Natija *(isitishdan keyin, median)*

| Qatorlar | Vaqt | Xato |
|---|---|---|
| 1 000 | ## **457.4 ms** | ## ✅ **0** |
| 10 000 | ## **440.0 ms** | ## ✅ **0** |
| 100 000 | ## **455.4 ms** | ## ✅ **0** |
| ## **500 000** | ## **524.6 ms** | ## ✅ **0** |

> ## 💥💥💥 **VAQT DEYARLI TEKIS — 1 000 dan 500 000 GACHA.**
>
> ## 1k → 500k: ma'lumot **500×** oshdi, ## vaqt atigi ## ⭐ **1.15×**.

> ## 🔑 **SABAB:** ## ~440 ms — bu **`AppTest` ning doimiy narxi** *(skript ishga tushishi)*. ## `st.dataframe` esa ma'lumotni **darhol chizmaydi** — ## u **serializatsiya** qiladi, brauzer esa **kerakli qismini** ko'rsatadi.

> ## 🔧 **VA BU YERDA MEN IKKI MARTA XATO QILDIM:**
>
> ## ## ① **Birinchi o'lchovim isitishsiz edi:** ## `1 000` qator **1 151.8 ms** chiqdi — ## `10 000` dan (457.9 ms) **sekinroq**! ## 💥 Chunki birinchi ishga tushish **import narxini** o'z ichiga oldi.
>
> ## ## ② **Men "252 ms" degan raqamlarni kutgan edim** — ## ular ham **isitishsiz** o'lchovdan edi.
>
> ## ## 🏆 **57-MODULDAGI DARS TAKRORLANDI:** ## **vaqt o'lchayotganda birinchi chaqiruvni tashlab yuboring.**

### ⚠️ Xulosa: kursning da'vosi **tasdiqlanmadi**

> ## 💥 **"Katta ma'lumotlarda sekin"** — ## `st.dataframe` uchun **noto'g'ri**.
>
> ## ## ⚠️ **LEKIN BU KURSNI TO'LIQ RAD ETMAYDI:** ## biz faqat **ko'rsatishni** o'lchadik. ## ## 🔑 **Haqiqiy muammo — HISOBLASHDA:** ## agar har bir o'zaro ta'sirda ## `df.groupby(...).apply(...)` bajarilsa — ## **o'sha sekin bo'ladi**.
>
> ## ## ⭐ **Yechim — `@st.cache_data`** *(4-darsda ko'ramiz)*.

---

## 4. 🏆🏆 Kamchilik ④ — aslida **afzallik**

> ## 🔑 **KURS AYTADI:** *"Har bir o'zaro ta'sirda **butun skript qayta ishga tushadi**. ## Bu **samarasiz** ko'rinishi mumkin."*

### 🔬 Tekshiramiz

```python
SANAGICH = """
import streamlit as st
if "n" not in st.session_state:
    st.session_state.n = 0
st.session_state.n += 1
st.write(f"skript {st.session_state.n} marta ishga tushdi")
st.button("Bosing", key="b1")
st.slider("Slayder", 0, 10, 5, key="s1")
st.text_input("Matn", key="t1")
"""

at = AppTest.from_string(SANAGICH)
at.run();                          print(at.session_state.n)
at.button[0].click().run();        print(at.session_state.n)
at.slider[0].set_value(8).run();   print(at.session_state.n)
at.text_input[0].set_value("x").run(); print(at.session_state.n)
```

```
1      boshlang'ich
2      tugma bosilgandan keyin
3      slayder o'zgargandan
4      matn kiritilgandan
```

> ## ✅ **KURS HAQ — HAR BIR O'ZARO TA'SIR SKRIPTNI QAYTA ISHGA TUSHIRADI.**

### 💡 Lekin **nega bu yaxshi?**

```
   AN'ANAVIY VEB (React, Vue):
     · holat (state) qayerda?
     · qaysi komponent qayta chizilishi kerak?
     · useEffect qaram bo'lganlar ro'yxati to'g'rimi?
     · eski holat bilan yangi holat mos kelmasa?
     💥 "state management" — butun bir kutubxonalar sinfi

   STREAMLIT:
     · skript yuqoridan pastga ishlaydi
     · nima ko'rinsa — shu holat
     ✅ hech qanday "sinxronlash" yo'q
```

> ## 🏆🏆 **VA BU — STREAMLITNING ASOSIY G'OYASI:** ## **UI = skriptning joriy natijasi.**
>
> ## ## ⭐ **Kamchilik emas — SODDALASHTIRISH.**

### ⚠️ Narxi esa bor

| Narx | Yechim |
|---|---|
| ## Qimmat hisoblash **qayta bajariladi** | ## ⭐ **`@st.cache_data`** |
| ## Model **qayta yuklanadi** | ## ⭐ **`@st.cache_resource`** |
| ## Holat **yo'qoladi** | ## ⭐ **`st.session_state`** *(6-dars)* |

---

## 5. 💥 Kamchilik ③ — "ilg'or funksiyalar yo'q" — **eskirgan**

> ## 🔑 **KURS AYTADI:** *"Ko'p sahifali ilovalar, ## maxsus autentifikatsiya, ## murakkab MB integratsiyasi — Streamlit bunga mos emas."*

| Kurs aytadi | ## 2026-yildagi holat |
|---|---|
| Ko'p sahifali ilovalar yo'q | ## 💥 **`st.navigation` + `st.Page` bor** |
| Autentifikatsiya yo'q | ## ⚠️ **`st.login()` bor** *(OIDC)* |
| Real vaqtda oqim yo'q | ## 💥 **`st.write_stream` bor** |
| Fragmentlar yo'q | ## 💥 **`@st.fragment`** — qisman qayta ishga tushirish |
| ## Holat/URL sinxronizatsiyasi | ## 💥 **`st.query_params` bor** |

### 🔬 Tekshiramiz — bu funksiyalar **haqiqatan bormi?**

```python
import streamlit as st
for nom in ["navigation", "Page", "login", "write_stream", "fragment",
            "query_params", "chat_message", "chat_input", "cache_data",
            "cache_resource", "session_state", "dialog", "toast"]:
    print(f"  st.{nom:16s} {'✅' if hasattr(st, nom) else '💥 yo`q'}")
```

```
  st.navigation      ✅
  st.Page            ✅
  st.login           ✅
  st.write_stream    ✅
  st.fragment        ✅
  st.query_params    ✅
  st.chat_message    ✅
  st.chat_input      ✅
  st.cache_data      ✅
  st.cache_resource  ✅
  st.session_state   ✅
  st.dialog          ✅
  st.toast           ✅
```

> ## 🏆 **13 TADAN 13 TASI MAVJUD.**
>
> ## ## 🔑 **KURSNING KAMCHILIKLAR RO'YXATI — ESKIRGAN.** ## Streamlit **tez rivojlanadi**.
>
> ## ## ⚠️ **VA BU — HAR QANDAY KURS UCHUN OGOHLANTIRISH:** ## *"bu framework buni qila olmaydi"* degan gap ## **bir yildan keyin noto'g'ri** bo'lishi mumkin.

---

## 6. ⭐ Qachon Streamlit — **noto'g'ri** tanlov?

| Vaziyat | Nega |
|---|---|
| ## **Ommaviy sayt** *(SEO kerak)* | ## 💥 **server-side rendering yo'q** |
| ## **Mobil ilova** | ## 💥 **veb-ilova, native emas** |
| Murakkab dizayn | ## ⚠️ **cheklangan** |
| ## **Yuqori yuklama** | ## 💥 **har sessiya — alohida jarayon** |
| Real vaqtli o'yin | ## 💥 **kechikish** |
| ## **Prototip, ichki asbob, demo** | ## 🏆 **IDEAL** |

> ## 🏆 **BIZNING LOYIHAMIZ — PROTOTIP.** ## ## ⭐ **Streamlit — to'g'ri tanlov.**

---

## 🎯 Nazorat savollari

1. Streamlit versiyasi necha qator kod oldi?
2. 100 000 qatorli DataFrame qancha vaqt oldi?
3. "Qayta ishga tushish" — kamchilikmi?
4. Kursning qaysi kamchiliklar ro'yxati eskirgan?
5. Streamlit qachon noto'g'ri tanlov?

<details>
<summary>Javoblar</summary>

1. ## **7 qator, 1 fayl, 0 HTML/CSS/JS.** Flask ~45, Django ~120, FastAPI+React ~200.
2. ## **455 ms** — va bu **1 000 qatorniki bilan deyarli bir xil** (457 ms). 500 000 qator ham **524 ms**. ## 🔑 Vaqt **ma'lumot hajmiga emas**, skript ishga tushishiga bog'liq. ⚠️ Men avval **isitishsiz** o'lchab, noto'g'ri raqamlar olgan edim.
3. ## **Yo'q — bu soddalashtirishning asosi.** *"UI = skriptning joriy natijasi"* — hech qanday state sinxronlash kerak emas. Narxi: `@st.cache_data`, `@st.cache_resource`, `st.session_state` kerak.
4. ## **Kamchilik ③.** `st.navigation`, `st.Page`, `st.login`, `st.write_stream`, `st.fragment`, `st.query_params` — **13 tadan 13 tasi mavjud**.
5. **Ommaviy sayt** *(SEO)*, **mobil ilova**, **yuqori yuklama** *(har sessiya alohida jarayon)*, real vaqtli o'yin. ## ⭐ **Prototip, ichki asbob, demo — ideal.**

</details>

---

⬅️ [1-dars](01-Setting-Up-Environment.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Titles-Headers-Formatting.md)
