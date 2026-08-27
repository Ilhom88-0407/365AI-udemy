# 2-dars. Suhbat funksiyasini yozish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kursning `app1.py` si — 40 qator. Biz uni to'liq ishga tushirdik va har qadamini o'lchadik. U ishlaydi. Lekin bitta qatorda kurs o'zi tuzoqni ko'rsatadi."**

---

## 1. Kursning `app1.py` si

```python
from openai import OpenAI
import streamlit as st

st.set_page_config(page_title="Streamlit Chat", page_icon="💬")
st.title("Chatbot")

client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-4o"

# ① suhbat tarixi + tizim xabari
if "messages" not in st.session_state:
    st.session_state.messages = [{
        "role": "system",
        "content": "You are a helpful tool that speaks like a pirate"}]

# ② AVVAL tarixni chizamiz
for message in st.session_state.messages:
    if message["role"] != "system":              # ⭐ tizim xabari YASHIRIN
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

# ③ KEYIN kirish
if prompt := st.chat_input("Your answer."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        stream = client.chat.completions.create(
            model=st.session_state["openai_model"],
            messages=[{"role": m["role"], "content": m["content"]}
                      for m in st.session_state.messages],
            stream=True)
        response = st.write_stream(stream)        # ⭐ chizadi VA qaytaradi

    st.session_state.messages.append({"role": "assistant", "content": response})
```

> ## ⭐ **TARTIB — 65-MODULDAGI QOIDA:** ## ① tarix, ② kirish. ## Aks holda **dublikat**.

---

## 2. 🔑 `:=` — **morj operatori**

```text
if prompt := st.chat_input("Your answer."):
```

Bu — ikki amalning qisqartmasi:

```python
prompt = st.chat_input("Your answer.")
if prompt:
    ...
```

| Yozuv | Nima qiladi |
|---|---|
| `prompt := ...` | ## **Qiymat berish** |
| `if prompt := ...` | ## ⭐ **Berish VA tekshirish** |

> ## 💥 **VA BU YERDA 65-MODULDAGI TUZOQ:** ## `if prompt:` — **`"   "` ni O'TKAZADI**. ## ## ⭐ To'g'ri: `if (prompt := st.chat_input(...)) and prompt.strip():`

---

## 3. 🔬 Kursning kodini **ishga tushiramiz**

Kalit yo'q — 1-darsdagi `MahalliyMijoz` ni ishlatamiz. **Kod bir harf ham o'zgarmaydi.**

```python
from streamlit.testing.v1 import AppTest

at = AppTest.from_string(APP1)          # ⭐ kursning kodi + soxta mijoz
at.run()
print("xato:", len(at.exception))
print("chat_message:", len(at.get("chat_message")))

at.chat_input[0].set_value("Salom").run()
print("1-xabar keyin: chat_message =", len(at.get("chat_message")))
print("  markdown:", [m.value for m in at.markdown])

at.chat_input[0].set_value("Yana bir savol").run()
print("2-xabar keyin: chat_message =", len(at.get("chat_message")))
```

### ✅ Haqiqiy natija

```
xato: 0
chat_message: 0
1-xabar keyin: chat_message = 2
  markdown: ['Salom', '[gpt-4o] 1-savol javobi']
2-xabar keyin: chat_message = 4
```

```
messages:
  ('system',    'You are a helpful tool that sp')
  ('user',      'Salom')
  ('assistant', '[gpt-4o] 1-savol javobi ')
  ('user',      'Yana bir savol')
  ('assistant', '[gpt-4o] 2-savol javobi ')
```

> ## 🏆 **KURSNING KODI ISHLAYDI** — ## `0 → 2 → 4` chat pufakchasi, ## tarix **to'g'ri** o'sdi.

> ## ⭐ **VA E'TIBOR BERING — `system` PUFAKCHA EMAS.** ## `messages` da **bor**, ekranda **yo'q**. ## ## 🔑 `if message["role"] != "system"` shuni qiladi.

### ⚠️ Bitta kichik narsa

```
'assistant': '[gpt-4o] 1-savol javobi '
```

> ## ⚠️ **OXIRIDA PROBEL BOR.** ## `write_stream` bo'laklarni **shundayligicha** yig'adi. ## ## 🔑 Agar javobni keyin **taqqoslasangiz** — ## `.strip()` qiling.

---

## 4. ⭐ Kurs **o'zi ko'rsatgan** tuzoq

Kurs videoda aytadi:

> *"Bizda javob bor, lekin butun suhbat tarixini ekranda ko'ra olmayapmiz. Faqat bitta foydalanuvchi xabari va bitta javob."*

Bu — **② bo'lim yo'q bo'lgan** holat:

```python
# ❌ tarixni chizadigan sikl YO'Q
if prompt := st.chat_input("Your answer."):
    ...
```

> ## 💥 **HAR RERUNDA EKRAN TOZALANADI** ## *(65-modul: skript boshidan ishlaydi)*. ## Faqat **shu rerunda** chizilgan narsa qoladi.
>
> ## ## ⭐ **YECHIM — `session_state` DAN QAYTA CHIZISH.** ## Bu — 65-moduldagi ## **eng muhim naqsh**.

---

## 5. 🔬 `messages` ro'yxati — nima uchun **list comprehension**?

```python
messages=[{"role": m["role"], "content": m["content"]}
          for m in st.session_state.messages]
```

Nega to'g'ridan-to'g'ri `st.session_state.messages` bermaymiz?

```python
kod = '''
import streamlit as st
st.session_state.setdefault("m", [{"role": "user", "content": "a", "vaqt": 123}])
toza = [{"role": x["role"], "content": x["content"]} for x in st.session_state.m]
st.write(f"xom  : {st.session_state.m}")
st.write(f"toza : {toza}")
'''
```

```
xom  : [{'role': 'user', 'content': 'a', 'vaqt': 123}]
toza : [{'role': 'user', 'content': 'a'}]
```

> ## ⭐ **LIST COMPREHENSION — FILTR.** ## U faqat **`role` va `content`** ni oladi.
>
> ## ## 🔑 **VA BU AMALDA KERAK:** ## ilovada har xabarga **vaqt, ball, ID** ## qo'shishingiz mumkin — ## 💥 OpenAI API bunday kalitlarni ## **qabul qilmaydi**.

---

## 6. 💰 Har xabarda **butun tarix** yuboriladi

```python
messages=[... for m in st.session_state.messages]      # ⭐ HAMMASI
```

| Xabar # | Yuborilgan xabarlar |
|---|---|
| 1 | 2 *(system + user)* |
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |
| ## 5 | ## 💥 **10** |

> ## 💰💰 **NARX CHIZIQLI EMAS — KVADRATIK.** ## 5 ta savollik suhbatda ## jami **2+4+6+8+10 = 30** xabar yuboriladi.
>
> ## ## 🔑 **VA MANA NEGA 5-DARSDA CHEGARA QO'YAMIZ.** ## Chegarasiz suhbat — ## 💥 **cheksiz hisob**.

### ⚠️ Va bu — 63-modul bilan bog'liq

> ## 🔑 **O'ZBEK TILIDA BU 2.30× QIMMATROQ** ## *(63-modulda o'lchagan edik)*. ## ## ⭐ Mahalliy modelda — **$0.00**, ## lekin **vaqt** o'sha kvadratik.

---

## 🎯 Nazorat savollari

1. `:=` operatori nima qiladi?
2. Nega tizim xabari ekranda ko'rinmaydi?
3. Tarixni chizadigan sikl bo'lmasa nima bo'ladi?
4. Nega `messages` ro'yxati list comprehension bilan qayta quriladi?
5. 5 ta savollik suhbatda jami nechta xabar yuboriladi?

<details>
<summary>Javoblar</summary>

1. ## **Qiymat beradi VA tekshiradi** — `prompt = ...` va `if prompt:` ning qisqartmasi. 💥 Lekin `if prompt:` `"   "` ni **o'tkazadi** *(65-modul)* — `and prompt.strip()` qo'shing.
2. ## `if message["role"] != "system"` — sikl **tizim xabarini o'tkazib yuboradi**. ⭐ U `messages` da **bor** *(model uni ko'radi)*, ekranda **yo'q**.
3. ## **Har rerunda ekran tozalanadi** — faqat shu rerunda chizilgan narsa qoladi. Kurs buni videoda o'zi ko'rsatadi. ⭐ Yechim — `session_state` dan **qayta chizish**.
4. ## **Filtr uchun.** Ilovangizda xabarlarga `vaqt`, `ball`, `ID` qo'shishingiz mumkin — 💥 OpenAI API bunday qo'shimcha kalitlarni qabul qilmaydi.
5. ## **30 ta** *(2+4+6+8+10)*. 💰 Narx **kvadratik** o'sadi — shuning uchun 5-darsda **chegara** qo'yamiz.

</details>

---

⬅️ [1-dars](01-Initializing-an-OpenAI-Client.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Building-the-Setup-Page.md)
