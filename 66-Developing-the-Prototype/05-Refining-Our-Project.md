# 5-dars. Loyihani takomillashtirish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: 'LLM ga boradigan har bir maydonga chegara qo'ying'. To'g'ri maslahat. Biz uni sinadik — va Streamlit uchta widgetdan ikkitasida chegarani hurmat qiladi, uchinchisida esa YO'Q."**

---

## 1. To'rtta bayroq — **oqim boshqaruvi**

```python
if "setup_complete" not in st.session_state:
    st.session_state.setup_complete = False
if "user_message_count" not in st.session_state:
    st.session_state.user_message_count = 0
if "feedback_shown" not in st.session_state:
    st.session_state.feedback_shown = False
if "chat_complete" not in st.session_state:
    st.session_state.chat_complete = False
if "messages" not in st.session_state:
    st.session_state.messages = []
```

| Bayroq | Nimani bildiradi |
|---|---|
| `setup_complete` | Sozlash **tugadi** |
| ## `user_message_count` | ## ⭐ **Nechta javob berildi** |
| `chat_complete` | Suhbat **tugadi** |
| `feedback_shown` | Fikr-mulohaza **ko'rsatildi** |

> ## 🏆 **KURS BARCHA BOSHLASHNI ENG YUQORIGA KO'CHIRADI — VA BU TO'G'RI.** ## ## ⭐ **Sabab:** holat **bir joyda**, ## har qanday bosqichdan **ko'rinadi**.

### ⭐ Uchta bosqich — uchta shart

```python
# ① SOZLASH
if not st.session_state.setup_complete:
    ...

# ② SUHBAT
if (st.session_state.setup_complete
        and not st.session_state.feedback_shown
        and not st.session_state.chat_complete):
    ...

# ③ FIKR-MULOHAZA
if st.session_state.feedback_shown:
    ...
```

> ## 💡 **BU — HOLAT MASHINASI (state machine).** ## Har bosqich **o'z shartiga** ega, ## ## ⭐ va ular **kesishmaydi**.

---

## 2. 💥💥💥 `max_chars` — **uchta widget, ikkita xulq**

Kurs 5-darsda aytadi:

> *"LLM ga boradigan har qanday kirish maydoniga so'z yoki belgi chegarasi qo'yish kerak."*

```python
st.text_input(label="Name", max_chars=40)
st.text_area(label="Experience", max_chars=200)
st.text_area(label="Skills", max_chars=200)
st.chat_input("Your response", max_chars=1000)
```

### 🔬 **Chegarani aylanib o'tishga urinamiz — uchalasida ham**

```python
kod = '''
import streamlit as st
st.text_input("A", max_chars=50, key="a")
st.text_area("B", max_chars=50, key="b")
p = st.chat_input("C", max_chars=50)
st.write(f"text_input={len(st.session_state.a)}  "
         f"text_area={len(st.session_state.b)}  "
         f"chat_input={len(p) if p else 0}")
'''
at = AppTest.from_string(kod); at.run()
at.text_input[0].set_value("X" * 200).run()
at.text_area[0].set_value("Y" * 200).run()
at.chat_input[0].set_value("Z" * 200).run()
```

### ✅ Haqiqiy natija

```
hammasi 200 belgi yuborildi, max_chars=50:
  text_input=50  text_area=50  chat_input=200
```

> ## 💥💥💥 **`text_input` VA `text_area` — KESADI.** ## ## 💥 **`chat_input` — KESMAYDI.**

| Widget | `max_chars=50` ga 200 belgi | Xulosa |
|---|---|---|
| ## `st.text_input` | ## ✅ **50** | serverda **kesiladi** |
| ## `st.text_area` | ## ✅ **50** | serverda **kesiladi** |
| ## `st.chat_input` | ## 💥 **200** | ## 💥 **faqat brauzerda** |

> ## 🔧 **BU — 65-MODULDAGI XULOSAMNI ANIQLASHTIRADI.** ## U yerda men *"`max_chars` serverda ishlamaydi"* deb yozgan edim — ## ## ⭐ **bu faqat `chat_input` uchun to'g'ri.**

> ## 💥 **VA AYNAN `chat_input` — ENG XAVFLI JOY:** ## u **har xabarda** ishlatiladi, ## sozlash maydonlari esa — **bir marta**.

### ✅ Yechim — **hech qachon widgetga ishonmang**

```python
LIMITLAR = {"name": 40, "experience": 200, "skills": 200, "javob": 1000}


def kes(matn, kalit):
    """Chegarani KODDA qo'llaydi — widget nima qilishidan qat'i nazar."""
    chek = LIMITLAR[kalit]
    m = (matn or "").strip()
    if len(m) > chek:
        return m[:chek], f"⚠️ {kalit}: {len(m)} → {chek} ga kesildi"
    return m, None
```

```python
print(kes("A" * 300, "name"))
print(kes("qisqa javob", "javob"))
print(kes("   ", "javob"))
```

```
('AAAA...(40 ta)', '⚠️ name: 300 → 40 ga kesildi')
('qisqa javob', None)
('', None)
```

---

## 3. 💰 Nega chegara **pul masalasi**?

2-darsda o'lchagan edik: har xabarda **butun tarix** yuboriladi.

| Xabar # | Yuborilgan xabarlar | Har biri 1 000 belgi bo'lsa |
|---|---|---|
| 1 | 2 | ~500 token |
| 3 | 6 | ~1 500 token |
| ## 5 | ## 10 | ## ~2 500 token |
| ## **jami** | ## **30** | ## 💰 **~7 500 token** |

> ## 💰 **`gpt-4o` da bu $0.0262 bitta suhbatga.** ## 1 000 foydalanuvchi = **$26.25**.
>
> ## ## 💥 **CHEGARASIZ:** ## foydalanuvchi 50 000 belgilik matn yuborsa — ## ⭐ **bitta suhbat $2+**.

> ## 🔑 **VA O'ZBEK TILIDA — 2.30× KO'PROQ** *(63-modul)*. ## Ya'ni **$46**.

---

## 4. ⭐ Callbacklar — ikkita funksiya

```python
def complete_setup():
    st.session_state.setup_complete = True


def show_feedback():
    st.session_state.feedback_shown = True
```

> ## 🏆 **HAR IKKALASI HAM — BITTA QATOR.** ## Va ikkalasi ham `on_click` ## orqali chaqiriladi.
>
> ## ## ⭐ **65-MODULDA O'LCHAGAN EDIK:** ## `SKRIPT -> CALLBACK -> SKRIPT`. ## Callback **rerundan oldin** ishlaydi, ## shuning uchun `st.rerun()` **kerak emas**.

---

## 5. 🔧 Kurs qo'shmagan: **xarajat hisoblagichi**

```python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")
NARX = {"gpt-4o": (2.50, 10.00), "gpt-4o-mini": (0.150, 0.600)}   # $/1M


def suhbat_narxi(messages, model="gpt-4o-mini", javob_tok=150):
    """Bitta so'rovning taxminiy narxi."""
    kirish = sum(len(enc.encode(m["content"])) for m in messages)
    ki, ch = NARX[model]
    return kirish, (kirish * ki + javob_tok * ch) / 1e6


def toliq_suhbat(bir_xabar_tok=250, n=5, model="gpt-4o-mini"):
    """N ta savolli suhbatning JAMI narxi — kvadratik o'sish bilan."""
    ki, ch = NARX[model]
    jami_kirish = sum(bir_xabar_tok * 2 * i for i in range(1, n + 1))
    return jami_kirish, (jami_kirish * ki + n * 150 * ch) / 1e6
```

```python
for m in ["gpt-4o-mini", "gpt-4o"]:
    tok, narx = toliq_suhbat(model=m)
    print(f"{m:14} {tok:6,} token  ${narx:.4f}/suhbat  "
          f"${narx*1000:8.2f}/1000 suhbat")
```

### ✅ Haqiqiy natija

```
gpt-4o-mini     7,500 token  $0.0016/suhbat  $    1.57/1000 suhbat
gpt-4o          7,500 token  $0.0262/suhbat  $   26.25/1000 suhbat
```

> ## 🏆 **`gpt-4o-mini` — 16.6× ARZON.** ## HR intervyu botida ## ⭐ **`mini` yetarli**.

> ## 💡 **VA MAHALLIY MODEL — $0.00,** ## lekin har javob **~1.9 s** *(1-darsda o'lchagan)*.

---

## 🎯 Nazorat savollari

1. Nechta bayroq oqimni boshqaradi va ular nima uchun eng yuqorida?
2. `max_chars` qaysi widgetlarda serverda ishlaydi?
3. Nega `chat_input` dagi chegara eng muhim?
4. 5 ta savollik suhbat qancha token oladi?
5. `on_click` callbackdan keyin `st.rerun()` kerakmi?

<details>
<summary>Javoblar</summary>

1. ## **To'rtta:** `setup_complete`, `user_message_count`, `chat_complete`, `feedback_shown` *(+ `messages`)*. ⭐ Eng yuqorida — chunki holat **bir joyda** va har bosqichdan **ko'rinadi**.
2. ## **`st.text_input` va `st.text_area` — kesadi** *(200 → 50)*. 💥 **`st.chat_input` — kesmaydi** *(200 → 200)*. ⭐ Bu — Streamlit ning **ichki nomuvofiqligi**.
3. Chunki u **har xabarda** ishlatiladi *(sozlash maydonlari — bir marta)*, va aynan **u himoyasiz**. 💰 Chegarasiz foydalanuvchi bitta so'rovda **$2+** sarflashi mumkin.
4. ## **~7 500 token** *(kvadratik o'sish: 2+4+6+8+10 = 30 xabar)*. `gpt-4o-mini` da **$0.0016**, `gpt-4o` da **$0.0262**.
5. ## **Yo'q.** Callback rerundan **oldin** ishlaydi *(65-modul: `SKRIPT -> CALLBACK -> SKRIPT`)*, shuning uchun skript **allaqachon yangi holat bilan** ishlaydi.

</details>

---

⬅️ [4-dars](04-Enhancing-with-Session-State.md) · 🏠 [Modul](README.md) · ➡️ [6-dars](06-Feedback-Functionality-Part-1.md)
