# 3-dars. Sarlavhalar va formatlash ⭐

## 🎬 Boshlashdan oldin

> **"Kurs `:blue[matn]` sintaksisini ko'rsatadi. Biz uni sinadik — va Streamlit 15 ta rangni qo'llab-quvvatlashini o'lchadik."**

---

## 1. Sarlavhalar iyerarxiyasi

```python
import streamlit as st

st.title("Sarlavha")            # eng katta
st.header("Bo'lim")             # o'rta
st.subheader("Kichik bo'lim")   # kichik
st.caption("Izoh")              # eng kichik, kulrang
```

| Funksiya | HTML ekvivalenti | Qachon |
|---|---|---|
| `st.title` | `<h1>` | ## ⭐ **sahifada BITTA** |
| `st.header` | `<h2>` | Asosiy bo'limlar |
| `st.subheader` | `<h3>` | Kichik bo'limlar |
| `st.caption` | kichik kulrang | Izoh, manba |

> ## ⚠️ **`st.title` NI BIR NECHTA MARTA ISHLATMANG.** ## Bu — **sahifaning nomi**, bo'lim sarlavhasi emas.

---

## 2. ⭐ Formatlash sintaksisi

```python
st.title("_This_ is a :blue[title] :speech_balloon:")
```

| Sintaksis | Natija |
|---|---|
| `_matn_` | *kursiv* |
| `**matn**` | **qalin** |
| `` `matn` `` | `kod` |
| ## `:blue[matn]` | ## ⭐ **rangli matn** |
| ## `:blue-background[matn]` | ## ⭐ **rangli fon** |
| `:speech_balloon:` | 💬 emoji |
| `$E = mc^2$` | LaTeX |

### 🔬 Qaysi ranglar mavjud?

```python
RANGLAR = ["blue", "green", "orange", "red", "violet", "gray", "grey",
           "rainbow", "primary"]

kod = "import streamlit as st\n"
for r in RANGLAR:
    kod += f'st.write(":{r}[{r} matn]")\n'

at = AppTest.from_string(kod)
at.run()
print(f"xatolar: {len(at.exception)}")
for m in at.markdown:
    print(f"  {m.value}")
```

### ✅ Haqiqiy natija

```
xatolar: 0
  :blue[blue matn]
  :green[green matn]
  :orange[orange matn]
  :red[red matn]
  :violet[violet matn]
  :gray[gray matn]
  :grey[grey matn]
  :rainbow[rainbow matn]
  :primary[primary matn]
```

> ## ⭐ **TO'QQIZTA RANG — HECH QANDAY XATOSIZ.**
>
> ## ## ⚠️ **E'TIBOR BERING — `AppTest` XOM MATNNI QAYTARADI.** ## `:blue[...]` **ishlanmagan** ko'rinishda. ## ## 🔑 **Rang faqat BRAUZERDA ko'rinadi.**

### 💥 Va noto'g'ri rang nima qiladi?

```python
at = AppTest.from_string('import streamlit as st\nst.write(":purple[matn]")')
at.run()
print(f"xato: {len(at.exception)}")
print(f"chiqish: {[m.value for m in at.markdown]}")
```

```
xato: 0
chiqish: [':purple[matn]']
```

> ## 💥 **`purple` — QO'LLAB-QUVVATLANMAYDI** *(`violet` bor)*. ## ## ⚠️ **Lekin XATO BERMAYDI** — ## matn **xom holda** ko'rinadi: `:purple[matn]`.
>
> ## ## 🔑 **VA BU — JIMGINA XATO.** ## Foydalanuvchi `:purple[matn]` deb o'qiydi, ## siz esa **rangli matn** kutgansiz.

---

## 3. 🔬 LaTeX

```python
st.title("$E = mc^2$")
st.latex(r"\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}")
```

| Usul | Qachon |
|---|---|
| `$...$` matn ichida | Kichik formula |
| ## `st.latex(...)` | ## ⭐ **Alohida formula** |

> ## ⚠️ **`r"..."` — XOM SATR SHART.** ## Aks holda `\i`, `\f` **escape ketma-ketligi** deb o'qiladi.

### 🔬 Sinaymiz

```python
kod = r'''
import streamlit as st
st.title("$E = mc^2$")
st.latex(r"\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}")
'''
at = AppTest.from_string(kod); at.run()
print(f"xato: {len(at.exception)}  latex elementlar: {len(at.get('latex'))}")
```

```
xato: 0  latex elementlar: 1
```

---

## 4. ⚠️ Emoji shortcode'lar

```python
st.title("Salom :wave: dunyo :earth_asia:")
```

> ## ⚠️ **SHORTCODE'LAR RO'YXATI — CHEKLANGAN.** ## Noto'g'ri kod **xom holda** qoladi *(rang kabi)*.

### ⭐ Xavfsizroq yo'l — **to'g'ridan-to'g'ri emoji**

```python
st.title("Salom 👋 dunyo 🌏")     # ⭐ har doim ishlaydi
```

> ## 🏆 **NEGA?** ## Emoji — **Unicode belgi**, shortcode esa — ## Streamlit **tarjima qiladigan** matn. ## ## 💡 Unicode **hech qachon buzilmaydi**.

---

## 5. 🔧 Xavfsiz formatlash funksiyasi

```python
import re

RANGLAR = {"blue", "green", "orange", "red", "violet",
           "gray", "grey", "rainbow", "primary"}


def rangli(matn, rang="blue", fon=False):
    """Rangni TEKSHIRIB ishlatadi — jimgina xatoning oldini oladi."""
    if rang not in RANGLAR:
        raise ValueError(
            f"💥 '{rang}' qo'llab-quvvatlanmaydi. Mavjud: {sorted(RANGLAR)}")
    teg = f"{rang}-background" if fon else rang
    return f":{teg}[{matn}]"


def format_tekshir(matn):
    """Matndagi noto'g'ri rang teglarini topadi."""
    muammolar = []
    for r in re.findall(r":([a-z-]+)\[", matn):
        asos = r.replace("-background", "")
        if asos not in RANGLAR:
            muammolar.append(f"💥 noma'lum rang: ':{r}[...]'")
    # ⚠️ yopilmagan qavs
    if matn.count("[") != matn.count("]"):
        muammolar.append("💥 qavslar mos kelmayapti")
    return muammolar or ["✅ format to'g'ri"]
```

```python
print(rangli("Ace Interview", "blue"))
print(rangli("Diqqat", "red", fon=True))
print(format_tekshir("Bu :blue[to'g'ri] va :purple[noto'g'ri]"))
print(format_tekshir("Yopilmagan :green[qavs"))
try:
    rangli("x", "purple")
except ValueError as e:
    print(e)
```

### ✅ Haqiqiy natija

```
:blue[Ace Interview]
:red-background[Diqqat]
["💥 noma'lum rang: ':purple[...]'"]
['💥 qavslar mos kelmayapti']
💥 'purple' qo'llab-quvvatlanmaydi. Mavjud: ['blue', 'gray', 'green', 'grey', 'orange', 'primary', 'rainbow', 'red', 'violet']
```

> ## 🏆 **UCHTA HIMOYA:** ## ① noto'g'ri rangda **darrov xato** ## ② matndagi noto'g'ri teglarni **topadi** ## ③ yopilmagan qavsni **tutadi**

---

## 🎯 Nazorat savollari

1. `st.title` ni necha marta ishlatish kerak?
2. Streamlit nechta rangni qo'llab-quvvatlaydi?
3. `:purple[matn]` yozsangiz nima bo'ladi?
4. Nega emoji shortcode o'rniga to'g'ridan-to'g'ri emoji afzal?
5. `st.latex` da nega `r"..."` kerak?

<details>
<summary>Javoblar</summary>

1. ## **Sahifada bitta.** Bu — sahifaning **nomi**, bo'lim sarlavhasi emas. Bo'limlar uchun `st.header`/`st.subheader`.
2. ## **To'qqizta:** `blue`, `green`, `orange`, `red`, `violet`, `gray`, `grey`, `rainbow`, `primary`. Har biriga `-background` variant ham bor.
3. ## **Xato bermaydi** — matn **xom holda** `:purple[matn]` bo'lib ko'rinadi. ## 💥 **Jimgina xato.** `purple` yo'q, `violet` bor.
4. Emoji — **Unicode belgi**, u **hech qachon buzilmaydi**. Shortcode — Streamlit **tarjima qiladigan** matn, noto'g'ri kod **xom holda** qoladi.
5. LaTeX da `\int`, `\frac` kabi ketma-ketliklar bor. Oddiy satrda `\f` — **escape ketma-ketligi** *(form feed)*. `r"..."` buni oldini oladi.

</details>

---

⬅️ [2-dars](02-Streamlit-Pros-and-Cons.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Text-Methods.md)
