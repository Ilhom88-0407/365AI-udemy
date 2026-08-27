# 3-dars. Sozlash sahifasini qurish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu darsda kurs o'zi xato qiladi — va o'zi tan oladi. Biz o'sha xatoni o'lchadik va aniq sababini topdik."**

---

## 1. Sozlash formasi

```python
st.subheader('Personal information', divider='rainbow')

name = st.text_input(label="Name", max_chars=None,
                     placeholder="Enter your name")

experience = st.text_area(label="Expirience", value="", height=None,
                          max_chars=None, placeholder="Describe your experience")

skills = st.text_area(label="Skills", value="", height=None,
                      max_chars=None, placeholder="List your skills")
```

| Widget | Qachon |
|---|---|
| `st.text_input` | ## Bir qatorli — **ism** |
| ## `st.text_area` | ## ⭐ **Ko'p qatorli** — tajriba, ko'nikmalar |

> ## ⚠️ **`divider='rainbow'` — 65-MODULDAGI 9 TA RANGDAN BIRI.** ## `blue`, `green`, `orange`, `red`, `violet`, ## `gray`, `grey`, `rainbow`, `primary`.
>
> ## ## 💥 **`divider='purple'` YOZSANGIZ — ## xato bermaydi, ajratgich ham chizilmaydi.**

### ⚠️ Kursning kodida terish xatosi

```text
st.text_area(label="Expirience", ...)     # 💥 "Experience" bo'lishi kerak
```

> ## ⚠️ **`"Expirience"`** — ## kursning `app2.py` va `app3.py` sida shunday. ## Yakuniy `app.py` da **tuzatilgan**. ## ## 🔑 Bu — foydalanuvchiga ko'rinadigan **yorliq**.

---

## 2. ⭐ Ustunlar

```python
col1, col2 = st.columns(2)

with col1:
    level = st.radio("Choose level", key="visibility",
                     options=["Junior", "Mid-level", "Senior"])

with col2:
    position = st.selectbox("Choose a position",
                            ("Data Scientist", "Data engineer", "ML Engineer",
                             "BI Analyst", "Financial Analyst"))

company = st.selectbox("Choose a Company",
                       ("Amazon", "Meta", "Udemy", "365 Company",
                        "Nestle", "LinkedIn", "Spotify"))
```

| Widget | Ko'rinishi | Qachon |
|---|---|---|
| ## `st.radio` | Hammasi **ko'rinib turadi** | ## ⭐ **2–5 variant** |
| ## `st.selectbox` | **Ochiladigan** ro'yxat | ## ⭐ **5+ variant** |

> ## 💡 **KURS TO'G'RI TANLAGAN:** ## daraja — **3 ta** *(radio)*, ## kompaniya — **7 ta** *(selectbox)*.

### ⚠️ `key="visibility"` — g'alati nom

```text
st.radio("Choose level", key="visibility", ...)
```

> ## ⚠️ **`key` — WIDGETNING `session_state` DAGI NOMI.** ## `"visibility"` esa **daraja** haqida hech narsa demaydi.
>
> ## ## 🔑 **4-DARSDA BUNI O'LCHAYMIZ** — ## va u yerda **kutilmagan** narsa chiqadi.

---

## 3. 💥💥💥 **KURSNING XATOSI — o'zi ko'rsatadi**

Kurs promptni shunday quradi:

```python
if "messages" not in st.session_state:
    st.session_state.messages = [{
        "role": "system",
        "content": f"You are an HR executive that interviews an interviewee "
                   f"called {name} with expirience {experience} and skills {skills}..."}]
```

Keyin videoda:

> *"Chatdan 'ismim nima?' deb so'raymiz. Afsuski, chat ismimizni bilmaydi."*

### 🔬 **O'lchaymiz — nima uchun?**

```python
at = AppTest.from_string(APP2); at.run()
print("① boshida:", SYSTEM_xabari)

at.text_input[0].set_value("Alex").run()
print("② ism kiritildi:", SYSTEM_xabari)

at.text_area[0].set_value("2 yil DS").run()
print("③ tajriba kiritildi:", SYSTEM_xabari)
```

### ✅ Haqiqiy natija

```
① boshida:          'You are an HR executive that interviews  with experience  and skills'
② ism kiritildi:    'You are an HR executive that interviews  with experience  and skills'
③ tajriba kiritildi:'You are an HR executive that interviews  with experience  and skills'
```

> ## 💥💥💥 **UCHALASIDA HAM — BO'SH JOYLAR.** ## `Alex` **hech qachon** promptga tushmadi.

### 🔑 Sabab — **bitta qatorda**

```text
if "messages" not in st.session_state:        # ⭐ FAQAT BIRINCHI RERUNDA
```

| Rerun | `"messages" in session_state`? | Prompt |
|---|---|---|
| ① yuklash | ## ❌ yo'q | ## 💥 **quriladi — hamma maydon BO'SH** |
| ② ism kiritildi | ✅ bor | o'zgarmaydi |
| ③ tajriba kiritildi | ✅ bor | o'zgarmaydi |

> ## 🏆 **PROMPT BIRINCHI RERUNDA "MUZLAB QOLADI".** ## O'sha paytda `name`, `experience`, `skills` — ## **hammasi bo'sh satr**.

> ## 💡 **VA BU — LLM ILOVALARIDA ENG KENG TARQALGAN XATO:** ## *"prompt bir marta quriladi, ## ma'lumot esa keyin keladi"*.

---

## 4. ⭐ Uchta yechim — **qaysi biri to'g'ri?**

### ❌ Yechim 1: promptni **har rerunda** qayta qurish

```python
st.session_state.messages[0] = {"role": "system", "content": f"...{name}..."}
```

> ## 💥 **ISHLAYDI, LEKIN XAVFLI:** ## foydalanuvchi suhbat **o'rtasida** ## formani o'zgartirsa — ## ⭐ model **kontekstni yo'qotadi**.

### ❌ Yechim 2: `messages` ni **har safar tozalash**

```text
st.session_state.messages = [{"role": "system", ...}]      # har rerunda
```

> ## 💥💥 **BUTUN SUHBAT TARIXI YO'QOLADI.**

### ✅ Yechim 3: **bosqichlarni ajratish** — kursning yo'li

```python
if not st.session_state.setup_complete:
    # ① sozlash formasi
    ...
    st.button("Start Interview", on_click=complete_setup)

if st.session_state.setup_complete:
    # ② suhbat — prompt SHU YERDA quriladi
    if "messages" not in st.session_state:
        st.session_state.messages = [{"role": "system", "content": f"...{...}..."}]
```

> ## 🏆🏆 **BU TO'G'RI YO'L:** ## prompt **sozlash tugagandan KEYIN** quriladi, ## ya'ni maydonlar **allaqachon to'ldirilgan**.
>
> ## ## ⭐ **VA SHU BILAN BIRGA — TARIX SAQLANADI,** ## chunki `if "messages" not in ...` ## baribir **bir marta** ishlaydi.

> ## 🔑 **4-DARSDA AYNAN SHUNI QURAMIZ.**

---

## 5. 🔧 Formani **tekshiruvchi** funksiya

Kursda validatsiya **umuman yo'q**. Bo'sh forma bilan ham `Start Interview` bosiladi.

```python
def forma_tekshir(s):
    """Sozlash ma'lumotlarini tekshiradi. Xato ro'yxatini qaytaradi."""
    xatolar = []
    if not s.get("name", "").strip():
        xatolar.append("💥 Ism kiritilmagan")
    elif len(s["name"].strip()) > 40:
        xatolar.append(f"💥 Ism juda uzun: {len(s['name'])}/40")

    if len(s.get("experience", "").strip()) < 10:
        xatolar.append("💥 Tajriba juda qisqa (kamida 10 belgi)")
    if len(s.get("skills", "").strip()) < 3:
        xatolar.append("💥 Ko'nikmalar kiritilmagan")

    for k in ["level", "position", "company"]:
        if not s.get(k):
            xatolar.append(f"💥 {k} tanlanmagan")
    return xatolar
```

```python
for holat in [
    {},
    {"name": "Alex", "experience": "2 yil", "skills": "Python",
     "level": "Junior", "position": "DS", "company": "Amazon"},
    {"name": "Alex", "experience": "2 yil Data Scientist sifatida",
     "skills": "Python, SQL", "level": "Senior",
     "position": "ML Engineer", "company": "Spotify"},
]:
    x = forma_tekshir(holat)
    print(f"  {x if x else '✅ to‘g‘ri'}")
```

### ✅ Haqiqiy natija

```
  ['💥 Ism kiritilmagan', '💥 Tajriba juda qisqa (kamida 10 belgi)',
   "💥 Ko'nikmalar kiritilmagan", '💥 level tanlanmagan',
   '💥 position tanlanmagan', '💥 company tanlanmagan']
  ['💥 Tajriba juda qisqa (kamida 10 belgi)']
  ✅ to'g'ri
```

```python
xatolar = forma_tekshir(st.session_state)
st.button("Start Interview", on_click=complete_setup, disabled=bool(xatolar))
for x in xatolar:
    st.warning(x)
```

> ## 🏆 **`disabled=bool(xatolar)`** — ## forma to'liq bo'lmaguncha ## tugma **bosilmaydi**.

---

## 🎯 Nazorat savollari

1. `st.radio` va `st.selectbox` orasida qanday tanlaysiz?
2. Kursning prompti nega foydalanuvchi ismini bilmaydi?
3. Promptni har rerunda qayta qurish nega yomon?
4. To'g'ri yechim nima?
5. `divider='purple'` yozsangiz nima bo'ladi?

<details>
<summary>Javoblar</summary>

1. ## **Variantlar soniga qarab:** 2–5 ta → `radio` *(hammasi ko'rinadi)*, 5+ → `selectbox` *(ochiladigan)*. ⭐ Kurs to'g'ri tanlagan: daraja 3 ta (radio), kompaniya 7 ta (selectbox).
2. ## `if "messages" not in st.session_state:` — prompt **faqat birinchi rerunda** quriladi. O'sha paytda `name`, `experience`, `skills` — **bo'sh satr**. 💥 O'lchadik: uchala bosqichda ham prompt **o'zgarmadi**.
3. Foydalanuvchi suhbat **o'rtasida** formani o'zgartirsa — model **kontekstni yo'qotadi**. 💥 Va agar `messages` ni butunlay qayta yaratsangiz — **tarix ham** yo'qoladi.
4. ## **Bosqichlarni ajratish:** `setup_complete` bayrog'i bilan sozlash va suhbatni **ikkiga bo'lish**. Prompt sozlash **tugagandan keyin** quriladi. ⭐ Tarix ham saqlanadi.
5. ## **Xato bermaydi, ajratgich ham chizilmaydi** *(65-modul, 3-dars)*. Streamlit **9 ta** rangni biladi, `purple` ular orasida **yo'q** (`violet` bor).

</details>

---

⬅️ [2-dars](02-Implementing-the-Chat-Functionality.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Enhancing-with-Session-State.md)
