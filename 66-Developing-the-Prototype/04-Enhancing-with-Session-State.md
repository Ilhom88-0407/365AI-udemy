# 4-dars. Session State bilan kuchaytirish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `index=` parametri 'tanlovni saqlash uchun kerak' deydi. Men ham shunday o'ylagandim. Biz uni olib tashlab sinadik — tanlov baribir saqlandi."**

---

## 1. Bosqichlarni ajratish

```python
if "setup_complete" not in st.session_state:
    st.session_state.setup_complete = False


def complete_setup():                       # ⭐ CALLBACK
    st.session_state.setup_complete = True


if not st.session_state.setup_complete:
    # ① SOZLASH bosqichi
    ...
    if st.button("Start Interview", on_click=complete_setup):
        st.write("Setup complete. Starting interview...")

if st.session_state.setup_complete:
    # ② SUHBAT bosqichi
    ...
```

> ## 🏆 **KURS `on_click` NI ISHLATADI — VA BU TO'G'RI.** ## 65-modulda o'lchagan edik: ## ## ⭐ **`SKRIPT -> CALLBACK -> SKRIPT`** — ## callback **rerundan OLDIN** ishlaydi.

### 🔑 Nega bu muhim?

| Yondashuv | Nima bo'ladi |
|---|---|
| ## `if st.button(...): st.session_state.x = True` | ## ⚠️ Holat **o'sha rerunda** o'zgaradi — ## pastdagi `if` uni **ko'radi** |
| ## `on_click=funksiya` | ## 🏆 **Holat rerundan OLDIN** o'zgaradi — ## kod **tozaroq** |

> ## 💡 **IKKALASI HAM ISHLAYDI.** ## Lekin `on_click` bilan mantiq ## **bitta joyda** yig'iladi.

---

## 2. Ma'lumotni `session_state` ga ko'chirish

Kurs har maydonni shunday yozadi:

```python
if "name" not in st.session_state:
    st.session_state["name"] = ""

st.session_state["name"] = st.text_input(
    label="Name", value=st.session_state["name"], placeholder="Enter your name")
```

### 🔬 **Bu naqsh ishlaydimi?**

```python
at = AppTest.from_string(kod); at.run()
print("①", [m.value for m in at.markdown])
at.text_input[0].set_value("Alex").run()
print("② kiritildi:", [m.value for m in at.markdown])
at.run()                                # ⭐ boshqa amal, oddiy rerun
print("③ oddiy rerun:", [m.value for m in at.markdown])
```

### ✅ Haqiqiy natija

```
①            ["name = ''"]
② kiritildi: ["name = 'Alex'"]
③ oddiy rerun:["name = 'Alex'"]
```

> ## ✅ **ISHLAYDI.** ## Qiymat **rerunlar orasida saqlanadi**.

---

## 3. 💥💥 `key="visibility"` — **ikkita nom, bitta qiymat**

Kursning radio kodi:

```python
st.session_state["level"] = st.radio(
    "Choose level",
    key="visibility",                   # ⭐ WIDGETNING nomi
    options=["Junior", "Mid-level", "Senior"],
    index=["Junior", "Mid-level", "Senior"].index(st.session_state["level"]))
```

Ya'ni `session_state` da **ikkita** kalit paydo bo'ladi: `"visibility"` *(widget)* va `"level"` *(nusxa)*.

### 🔬 O'lchaymiz

```python
st.write(f"level={st.session_state['level']!r}  "
         f"visibility={st.session_state.get('visibility', 'YOQ')!r}")
```

### ✅ Haqiqiy natija

```
①             ["level='Junior'  visibility='Junior'"]
② Senior tanlandi: ["level='Senior'  visibility='Senior'"]
③ oddiy rerun:  ["level='Senior'  visibility='Senior'"]
```

> ## ⭐ **IKKALASI HAM BIR XIL — VA IKKALASI HAM SAQLANADI.**
>
> ## ## 🔑 **YA'NI `"level"` — SHUNCHAKI NUSXA.** ## Haqiqiy holat `"visibility"` da yotadi.

> ## ⚠️ **BU — ORTIQCHA MURAKKABLIK.** ## Agar `key="level"` deb yozilsa, ## ⭐ **nusxa umuman kerak bo'lmasdi**.

### ✅ Soddaroq variant

```python
st.radio("Choose level", key="level",
         options=["Junior", "Mid-level", "Senior"])
# st.session_state["level"] — ⭐ o'zi to'ldiriladi
```

---

## 4. 💥💥💥 **`index=` — KERAK EMAS EKAN**

Kurs `app3.py` da `index=` **yo'q**, yakuniy `app.py` da esa **bor**. Videoda:

> *"index parametrini session state ga o'rnatamiz"*

Men buni shunday tushundim: *"`index=` bo'lmasa, tanlov har rerunda `Junior` ga qaytadi"*.

### 🔬 **`index=` NI OLIB TASHLAYMIZ**

```python
st.session_state["level"] = st.radio("Choose level", key="visibility",
                                     options=["Junior", "Mid-level", "Senior"])
# ⭐ index= YO'Q
```

### ✅ Haqiqiy natija

```
①              ["level='Junior'"]
② Senior tanlandi: ["level='Senior'"]
③ oddiy rerun:   ["level='Senior'"]     ← ⭐ SAQLANDI
```

> ## 💥💥 **MEN XATO KUTGAN EDIM — TANLOV SAQLANDI.**
>
> ## ## 🔑 **SABAB:** ## `key="visibility"` **o'z-o'zidan** holatni saqlaydi. ## `index=` faqat **BIRINCHI** chizishda ishlatiladi, ## ## ⭐ keyingi rerunlarda **e'tiborga olinmaydi**.

### ⚠️ Unda `index=` **qachon** kerak?

| Holat | `index=` |
|---|---|
| Widget `key` bilan | ## 💥 **kerak emas** — holat o'zi saqlanadi |
| ## Widget `key` SIZ | ## ⭐ **kerak** — boshlang'ich tanlovni belgilaydi |
| ## Tashqaridan tiklash *(fayldan)* | ## ⭐ **kerak** yoki `session_state[key] = ...` |

> ## 🏆 **KURSNING KODI ISHLAYDI, LEKIN `index=` — ORTIQCHA.** ## ## ⚠️ **VA U XAVFLI HAM:** ## `.index(...)` — agar saqlangan qiymat ## ro'yxatda **bo'lmasa** ## 💥 **`ValueError`** beradi.

```python
PS = ("Data Scientist", "Data Engineer", ...)
index=PS.index(st.session_state["position"])
```

> ## 💥 **KURSNING `app3.py` SIDA `"Data engineer"` (kichik `e`),** ## yakuniy `app.py` da esa `"Data Engineer"` (katta `E`). ## ## 🔑 Eski `session_state` bilan yangi ro'yxat — ## ⚠️ **`ValueError: tuple.index(x): x not in tuple`**.

---

## 5. ⭐ `st.info` — foydalanuvchini yo'naltirish

```python
st.info("Start by introducing yourself", icon="👋")
```

| Funksiya | Rang | Qachon |
|---|---|---|
| `st.info` | ko'k | ## ⭐ **Ko'rsatma** |
| `st.success` | yashil | Yakun, muvaffaqiyat |
| `st.warning` | sariq | Ogohlantirish |
| `st.error` | qizil | ## 💥 **Xato** |

> ## 💡 **KURS TO'G'RI QILGAN:** ## bo'sh chat oynasi — ## foydalanuvchi uchun **noqulay**. ## ⭐ `st.info` unga **birinchi qadamni** aytadi.

---

## 6. 🏆 Promptni **session_state** dan qurish

```python
if "messages" not in st.session_state:
    st.session_state.messages = [{
        "role": "system",
        "content": (f"You are an HR executive that interviews an interviewee "
                    f"called {st.session_state['name']} "
                    f"with experience {st.session_state['experience']} "
                    f"and skills {st.session_state['skills']}. "
                    f"You should interview him for the position "
                    f"{st.session_state['level']} {st.session_state['position']} "
                    f"at the company {st.session_state['company']}")}]
```

### ✅ Haqiqiy natija — **to'liq oqim**

```
② to'ldirildi: {'name': 'Alex', 'experience': '2 yil Data Scientist',
                'skills': 'Python, SQL', 'level': 'Senior',
                'position': 'ML Engineer', 'company': 'Spotify'}
③ Start Interview bosildi:
   setup_complete: True
   chat_input: 1   info: ['Start by introducing yourself']
   SYSTEM: HR for Alex / Senior ML Engineer at Spotify
```

> ## 🏆🏆 **3-DARSDAGI XATO TUZATILDI.** ## Prompt endi **haqiqiy ma'lumot** bilan quriladi.

### 🔑 Nega endi ishlaydi?

| | 3-dars | ## 4-dars |
|---|---|---|
| Prompt qachon quriladi | ## 💥 **1-rerunda** | ## ✅ **`Start Interview` dan keyin** |
| Maydonlar holati | ## 💥 **bo'sh** | ## ✅ **to'ldirilgan** |
| Ma'lumot qayerda | mahalliy o'zgaruvchi | ## ⭐ **`session_state`** |

---

## 7. ⚠️ Kurs aytmagan: **jins** muammosi

```python
"You should interview him for the position ..."
```

> ## 💥 **`him` — QATTIQ YOZILGAN.** ## Model **hamma nomzodni** erkak deb hisoblaydi.

### ✅ Yechim

```python
"You should interview this candidate for the position ..."
```

> ## ⭐ **`them` yoki `this candidate`** — ## jinsdan **mustaqil**. ## ## 🔑 Bu — **ishlab chiqarishga chiqadigan** ilovada ## jiddiy masala.

---

## 🎯 Nazorat savollari

1. `on_click` va `if st.button(...)` — farqi nima?
2. `key="visibility"` bo'lsa, `session_state` da nechta kalit paydo bo'ladi?
3. `index=` ni olib tashlasangiz nima bo'ladi?
4. `index=PS.index(...)` qachon xato beradi?
5. Prompt endi nega to'g'ri quriladi?

<details>
<summary>Javoblar</summary>

1. ## **`on_click` rerundan OLDIN ishlaydi** *(65-modulda o'lchangan: `SKRIPT -> CALLBACK -> SKRIPT`)*. Ikkalasi ham ishlaydi, lekin `on_click` bilan mantiq **bitta joyda** yig'iladi.
2. ## **Ikkita:** `"visibility"` *(widgetning haqiqiy holati)* va `"level"` *(nusxa)*. ⚠️ Bu — **ortiqcha murakkablik**; `key="level"` deb yozilsa nusxa kerak bo'lmasdi.
3. ## **Hech narsa — tanlov baribir saqlanadi.** 💥 Men buni **xato kutgan edim**. Sabab: `key=` o'z-o'zidan holatni saqlaydi, `index=` esa faqat **birinchi** chizishda ishlatiladi.
4. ## Saqlangan qiymat ro'yxatda **bo'lmasa** — `ValueError`. 💥 Kursning `app3.py` sida `"Data engineer"`, `app.py` sida `"Data Engineer"` — ⚠️ eski holat + yangi ro'yxat = **yiqilish**.
5. Prompt **sozlash tugagandan keyin** — `if st.session_state.setup_complete:` bloki ichida — quriladi. ⭐ O'sha paytda `session_state` **to'ldirilgan**. O'lchandi: `SYSTEM: HR for Alex / Senior ML Engineer at Spotify`.

</details>

---

⬅️ [3-dars](03-Building-the-Setup-Page.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Refining-Our-Project.md)
