# 5-dars. Chat elementlari ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `st.chat_input(..., max_chars=50)` ni 'belgi chegarasi' deb ko'rsatadi. Biz 200 ta belgi yubordik — va hammasi o'tdi."**

---

## 1. Uchta element

| Element | Nima qiladi | Kimga |
|---|---|---|
| ## `st.chat_message` | ## **Avatar + pufakcha** | Har bir xabar |
| ## `st.chat_input` | ## **Pastdagi kirish maydoni** | Foydalanuvchi |
| ## `st.write_stream` | ## ⭐ **Harf-harf chiqarish** | LLM javobi |

```python
import streamlit as st

with st.chat_message("user"):
    st.write("Salom!")

with st.chat_message("assistant"):
    st.write("Salom, qanday yordam bera olaman?")
```

### 🔬 `AppTest` bilan sinaymiz

```python
from streamlit.testing.v1 import AppTest

kod = '''
import streamlit as st
with st.chat_message("user"):
    st.write("Salom!")
with st.chat_message("assistant"):
    st.write("Salom, qanday yordam bera olaman?")
'''
at = AppTest.from_string(kod); at.run()
print("xato:", len(at.exception))
print("elementlar:", [type(e).__name__ for e in at.main])
print("chat_message:", len(at.get("chat_message")))
for c in at.get("chat_message"):
    print(f"   name={c.name!r}  avatar={c.avatar!r}")
```

### ✅ Haqiqiy natija

```
xato: 0
elementlar: ['SpecialBlock', 'ChatMessage', 'Markdown', 'ChatMessage', 'Markdown']
chat_message: 2
   name='user'  avatar='user'
   name='assistant'  avatar='assistant'
```

> ## ⭐ **`with` BLOKI — KONTEKST MENEJERI.** ## Blok ichidagi **hamma narsa** pufakcha ichiga tushadi.
>
> ## ## 🔑 **VA E'TIBOR BERING:** ## `Markdown` element **`ChatMessage` dan keyin** keladi — ## ya'ni `at.markdown` da **hammasi aralash** yotadi.

---

## 2. 💥💥 Rol nomi — va **jimgina xato**

Kurs aytadi: *"rolni `user`, `assistant`, `ai`, `human` yoki **istalgan qo'llab-quvvatlanadigan satr** qilib qo'yish mumkin"*.

### 🔬 Nima "qo'llab-quvvatlanadi"?

```python
for rol in ["user", "assistant", "ai", "human", "system", "Aziz", "🤖", ""]:
    kod = f'''
import streamlit as st
with st.chat_message({rol!r}):
    st.write("x")
'''
    at = AppTest.from_string(kod); at.run()
    c = at.get("chat_message")[0]
    print(f"  {rol!r:12} xato={len(at.exception)}  "
          f"name={c.name!r}  avatar={c.avatar!r}")
```

### ✅ Haqiqiy natija

| Rol | Xato | `avatar` |
|---|---|---|
| `"user"` | 0 | ## ✅ `'user'` |
| `"assistant"` | 0 | ## ✅ `'assistant'` |
| `"ai"` | 0 | ## ⭐ `'assistant'` |
| `"human"` | 0 | ## ⭐ `'user'` |
| ## `"system"` | 0 | ## 💥 **`''`** |
| ## `"Aziz"` | 0 | ## 💥 **`''`** |
| `"🤖"` | 0 | ## ⭐ `'🤖'` |
| ## `""` | 0 | ## 💥 **`''`** |

> ## 🏆 **IKKITA TAQQOSLASH — IKKITA KASHFIYOT:**
>
> ## ## ① **`ai` → `assistant` avatarini oladi,** ## `human` → `user` avatarini. ## ⭐ Ya'ni **taxallus** (alias) mavjud.
>
> ## ## ② 💥💥 **`system`, `Aziz`, `""` — XATO BERMAYDI,** ## lekin ## **`avatar` BO'SH QOLADI.**

> ## 💥 **VA BU — 3-DARSDAGI `:purple[...]` NING AYNAN O'ZI:** ## Streamlit **jim qoladi**, ## siz esa **avatar kutgansiz**.
>
> ## ## 🔑 **Emoji — istisno:** ## `st.chat_message("🤖")` da emoji ## **o'zi avatarga aylanadi**.

### ✅ Xavfsiz yechim

```python
ROLLAR = {"user", "assistant", "ai", "human"}


def xabar(rol, matn, avatar=None):
    """Rolni TEKSHIRIB ishlatadi — avatarsiz qolishning oldini oladi."""
    if rol not in ROLLAR and avatar is None:
        raise ValueError(
            f"💥 '{rol}' uchun avatar yo'q. "
            f"Mavjud rollar: {sorted(ROLLAR)}, yoki avatar= bering.")
    with st.chat_message(rol, avatar=avatar):
        st.write(matn)
```

```python
xabar("assistant", "Salom")            # ✅
xabar("intervyuchi", "Salom", "🎤")    # ✅ avatar berildi
xabar("intervyuchi", "Salom")          # 💥 ValueError
```

---

## 3. ⭐ `st.chat_input` — kirish maydoni

```python
prompt = st.chat_input("Xabaringizni yozing", max_chars=50)
if prompt:
    st.write(f"Siz yozdingiz: {prompt}")
```

### 🔬 `AppTest` bilan boshqaramiz

```python
at = AppTest.from_string(kod); at.run()
print("boshlang'ich:", [m.value for m in at.markdown])
print("value:", repr(at.chat_input[0].value))

at.chat_input[0].set_value("Salom").run()
print("keyin:", [m.value for m in at.markdown])
print("value:", repr(at.chat_input[0].value))
```

### ✅ Haqiqiy natija

```
boshlang'ich: ["hali hech narsa yo'q"]
value: None
keyin: ['Siz yozdingiz: Salom']
value: 'Salom'
```

> ## ⭐ **`chat_input` BOSHIDA `None` QAYTARADI** — ## shuning uchun `if prompt:` **shart**.

---

## 4. 💥💥💥 `max_chars` — **serverda ISHLAMAYDI**

Kurs aytadi: *"`max_chars` parametrini 50 ga qo'ysangiz, o'ng burchakda belgi chegarasi paydo bo'ladi"*.

### 🔬 Chegarani **aylanib o'tamiz**

```python
at = AppTest.from_string(kod); at.run()
at.chat_input[0].set_value("A" * 200).run()      # ⭐ 200 ta belgi, chegara 50
out = [m.value for m in at.markdown][0]
print("xato:", len(at.exception))
print("chiqish uzunligi:", len(out))
```

### ✅ Haqiqiy natija

```
xato: 0
chiqish uzunligi: 215
```

> ## 💥💥💥 **200 TA BELGI — `max_chars=50` BO'LSA HAM O'TDI.**
>
> ## Xato **yo'q**. Kesish **yo'q**. ## Ilova matnni **to'liq qabul qildi**.

> ## 🔑 **SABAB:** ## `max_chars` — bu **brauzer** cheklovi *(HTML `maxlength`)*. ## Server tomonda **hech qanday tekshiruv yo'q**.

> ## ## 💥 **VA BU — HAQIQIY XAVF:** ## foydalanuvchi ## ① brauzer DevTools da `maxlength` ni o'chirishi, ## ② yoki to'g'ridan-to'g'ri **WebSocket** ga yuborishi mumkin.
>
> ## ## ⭐ **LLM ILOVASIDA BU — PUL:** ## 200 000 belgilik matn = ## ~50 000 token = ## 💥 **bitta so'rov uchun $0.50+**.

### ✅ Yechim — **ikki qavatli** himoya

```python
MAX_BELGI = 500

prompt = st.chat_input("Javobingiz", max_chars=MAX_BELGI)   # ① brauzer — qulaylik

if prompt:
    if len(prompt) > MAX_BELGI:                             # ② server — HIMOYA
        st.error(f"💥 Xabar juda uzun: {len(prompt)} / {MAX_BELGI}")
        st.stop()
    st.write(prompt)
```

> ## 🏆 **UMUMIY QOIDA:** ## **brauzerdagi hech qanday cheklovga ishonmang.** ## ## 🔑 67-modulda buni `prompt injection` ## kontekstida yana ko'ramiz.

---

## 5. ⭐⭐ `st.write_stream` — **harf-harf** effekti

```python
def oqim():
    for so in "Bu oqim bilan chiqadi".split():
        yield so + " "

natija = st.write_stream(oqim())
st.write(f"QAYTGAN TUR: {type(natija).__name__}")
st.write(f"QAYTGAN QIYMAT: {natija!r}")
```

### ✅ Haqiqiy natija

```
xato: 0
markdown: ['Bu oqim bilan chiqadi',
           'QAYTGAN TUR: str',
           "QAYTGAN QIYMAT: 'Bu oqim bilan chiqadi '"]
```

> ## 🏆🏆 **`write_stream` — FAQAT CHIZMAYDI, ## U TO'PLANGAN MATNNI QAYTARADI HAM.**
>
> ## ## ⭐ **VA BU — JUDA MUHIM:** ## siz oqimni **chiqarasiz** ## va **bir vaqtda** to'liq javobni ## `session_state` ga **saqlaysiz**.

```python
javob = st.write_stream(model_javobi())          # ⭐ chizadi VA qaytaradi
st.session_state.tarix.append({"rol": "assistant", "matn": javob})
```

### 💥 Va satr bersangiz?

```python
st.write_stream("oddiy satr")
```

```
StreamlitAPIException: `st.write_stream` expects a generator or stream-like
object as input not <class 'str'>. Please use `st.write` instead for this
data type.
```

> ## ⭐ **BU — YAXSHI XATO XABARI.** ## Streamlit nafaqat **muammoni**, ## balki **yechimni ham** aytadi.

### ⚠️ Va u **bloklaydi**

```python
def sekin():
    for i in range(5):
        time.sleep(0.1)      # ⭐ jami 0.5 s
        yield f"{i} "

st.write_stream(sekin())
```

```
xato: 0   vaqt: 0.94 s   (5 x 0.1 s = 0.5 s uyqu)
```

> ## ⚠️ **0.94 s** — undan **0.5 s** uyqu, ## qolgani `AppTest` ning doimiy narxi *(2-darsdagi ~440 ms)*.
>
> ## ## 🔑 **YA'NI `write_stream` — SINXRON.** ## Oqim tugamaguncha **skript kutadi**. ## ## ⭐ Foydalanuvchi uchun bu **yaxshi** — ## u matnni **kutish o'rniga o'qiydi**.

---

## 6. 🏆🏆 To'liq chat — va **eng muhim tuzoq**

```python
import streamlit as st

st.title("Ace Interview — suhbat")

if "tarix" not in st.session_state:
    st.session_state.tarix = []

# ① AVVAL — butun tarixni qayta chizamiz
for x in st.session_state.tarix:
    with st.chat_message(x["rol"]):
        st.write(x["matn"])

# ② KEYIN — yangi kirishni kutamiz
savol = st.chat_input("Javobingizni yozing")
if savol:
    st.session_state.tarix.append({"rol": "user", "matn": savol})
    with st.chat_message("user"):
        st.write(savol)

    javob = f"'{savol}' — yaxshi javob! Keyingi savol?"
    st.session_state.tarix.append({"rol": "assistant", "matn": javob})
    with st.chat_message("assistant"):
        st.write(javob)

st.write(f"TARIX UZUNLIGI: {len(st.session_state.tarix)}")
```

### 🔬 Uch bosqichli sinov

```python
at = AppTest.from_string(CHAT); at.run()
print(f"① {len(at.get('chat_message'))} ta xabar")

at.chat_input[0].set_value("Men Python bilaman").run()
print(f"② {len(at.get('chat_message'))} ta xabar")

at.chat_input[0].set_value("Va SQL ham").run()
print(f"③ {len(at.get('chat_message'))} ta xabar")

at.run()                                    # ⭐ hech narsa bosmasdan
print(f"④ {len(at.get('chat_message'))} ta xabar")
```

### ✅ Haqiqiy natija

```
① 0 ta xabar    ['TARIX UZUNLIGI: 0']
② 2 ta xabar    ['Men Python bilaman',
                 "'Men Python bilaman' — yaxshi javob! Keyingi savol?",
                 'TARIX UZUNLIGI: 2']
③ 4 ta xabar    [... , 'Va SQL ham',
                 "'Va SQL ham' — yaxshi javob! Keyingi savol?",
                 'TARIX UZUNLIGI: 4']
④ 4 ta xabar    TARIX UZUNLIGI: 4      ← ⭐ O'ZGARMADI
```

> ## 🏆 **① → ② → ③: tarix 0 → 2 → 4.** ## ⭐ `session_state` **ishlaydi**.

### 💥 Va endi — **④ nima uchun muhim?**

Men shundan qo'rqqan edim: **oddiy qayta ishga tushirishda** *(masalan boshqa tugma bosilganda)* `chat_input` **eski qiymatini qaytarib**, xabar **ikki marta** qo'shilmaydimi?

```python
print("chat_input.value =", repr(at.chat_input[0].value))
```

```
chat_input.value = None
```

> ## ✅ **YO'Q — `chat_input` O'ZINI AVTOMATIK TOZALAYDI.**
>
> ## Yuborilgandan **keyingi** qayta ishga tushishda ## u yana **`None`** bo'ladi.

> ## ## 🔑 **VA BU — `st.text_input` DAN MUHIM FARQ:** ## `text_input` qiymatini **ushlab turadi**, ## `chat_input` esa **bir martalik**.

> ## ## 💡 **AYNAN SHUNING UCHUN** chat uchun ## `text_input + tugma` emas, ## ⭐ **`chat_input`** ishlatiladi.

### ⚠️ Tartib muhim: **avval tarix, keyin kirish**

```text
# ❌ NOTO'G'RI                        # ✅ TO'G'RI
savol = st.chat_input(...)           for x in st.session_state.tarix:
if savol:                                with st.chat_message(x["rol"]):
    ...                                      st.write(x["matn"])
for x in st.session_state.tarix:     savol = st.chat_input(...)
    ...                              if savol:
                                         ...
```

> ## 💥 **NOTO'G'RI VARIANTDA** yangi xabar ## tarixga qo'shilib, ## **darrov yana chiziladi** → ## ⭐ **dublikat**.

---

## 🎯 Nazorat savollari

1. `st.chat_message("system")` xato beradimi?
2. `max_chars=50` bo'lsa, 200 ta belgi yuborilsa nima bo'ladi?
3. `st.write_stream` nimani **qaytaradi**?
4. `chat_input` bilan `text_input` orasidagi asosiy farq nima?
5. Nega tarixni `chat_input` dan **oldin** chizish kerak?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q, xato bermaydi** — lekin `avatar` **bo'sh** (`''`) qoladi. 💥 Bu — **jimgina xato**, xuddi 3-darsdagi `:purple[...]` kabi. ⭐ `ai` → `assistant` avatarini, `human` → `user` avatarini oladi; emoji (`"🤖"`) esa o'zi avatarga aylanadi.
2. ## **Hammasi o'tadi** — 200 ta belgi, xatosiz. 💥 `max_chars` — faqat **brauzer** cheklovi (HTML `maxlength`), serverda **tekshiruv yo'q**. ⭐ Python tomonda `if len(prompt) > MAX: st.error(...); st.stop()` **shart**.
3. ## **To'plangan to'liq matnni `str` sifatida.** ⭐ Shuning uchun `javob = st.write_stream(...)` deb yozib, javobni **darrov `session_state` ga** saqlash mumkin.
4. ## **`chat_input` — bir martalik.** Yuborilgandan keyingi qayta ishga tushishda u yana **`None`** bo'ladi. `text_input` esa qiymatini **ushlab turadi**. 💡 Aynan shuning uchun chat uchun `chat_input` ishlatiladi — dublikat xabar bo'lmaydi.
5. Aks holda yangi xabar tarixga qo'shilib, **o'sha rerunda yana chiziladi** → 💥 **dublikat**. ⭐ Tartib: ① tarix, ② kirish.

</details>

---

⬅️ [4-dars](04-Text-Methods.md) · 🏠 [Modul](README.md) · ➡️ [6-dars](06-Session-State.md)
