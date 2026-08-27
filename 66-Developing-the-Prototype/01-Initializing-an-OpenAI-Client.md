# 1-dars. OpenAI mijozini ishga tushirish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs birinchi qatordan API kalitini talab qiladi. Biz kalitsiz yo'l qurdik — va kursning kodi bir harf ham o'zgarmadi."**

---

## 1. Kurs nima qiladi

```bash
pip install openai
```

Keyin `.streamlit/secrets.toml` fayli:

```toml
OPENAI_API_KEY = "sk-proj-..."
```

Va `app.py`:

```python
from openai import OpenAI
import streamlit as st

st.set_page_config(page_title="Streamlit Chat", page_icon="💬")
st.title("Chatbot")

client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-4o"
```

| Qator | Nima qiladi |
|---|---|
| `set_page_config` | ## ⭐ **BIRINCHI `st.` chaqiruvi bo'lishi SHART** |
| `st.secrets[...]` | `.streamlit/secrets.toml` dan o'qiydi |
| `OpenAI(api_key=...)` | Mijoz obyekti |
| `session_state["openai_model"]` | Model nomi — **bitta joyda** |

> ## ⚠️ **`set_page_config` — SKRIPTDAGI BIRINCHI `st.` CHAQIRUVI BO'LISHI KERAK** ## — hujjatlar shunday deydi.

### 🔬 Lekin sinab ko'rdik

```python
for nom, kod in [
    ("① title -> set_page_config", 'st.title("S"); st.set_page_config(...)'),
    ("② set_page_config birinchi",  'st.set_page_config(...); st.title("S")'),
    ("③ ikki marta chaqirish",      'st.set_page_config(A); st.set_page_config(B)'),
]:
    at = AppTest.from_string(kod); at.run()
    print(nom, "xato =", len(at.exception))
```

```
① title -> set_page_config       xato=0
② set_page_config birinchi       xato=0
③ ikki marta chaqirish           xato=0
```

> ## 🔧 **MEN `StreamlitAPIException` KUTGAN EDIM — UCHALASIDA HAM XATO YO'Q.**
>
> ## ## ⚠️ **HALOL BO'LSAK: bu — `AppTest` o'lchovi.** ## `AppTest` sahifa konfiguratsiyasini ## **haqiqiy brauzerdek** qo'llamaydi. ## ## ⭐ Shuning uchun qoidaga **baribir amal qiling** — ## brauzerda xulq **boshqacha** bo'lishi mumkin.

---

## 2. 💥💥💥 **KALIT YO'Q. NIMA QILAMIZ?**

Kurs `sk-...` kalitisiz **bir qadam ham** yura olmaydi. Biz esa **butun modulni** kalitsiz o'tamiz.

### 🔑 Sir: kursning kodi mijozning **interfeysiga** bog'liq, **OpenAI ga emas**

```python
client.chat.completions.create(model=..., messages=..., stream=True)
```

Bu — **to'rt daraja**: `client` → `.chat` → `.completions` → `.create(...)`. Biz aynan shu shaklni **mahalliy model** ustiga quramiz.

```python
class MahalliyMijoz:
    """OpenAI mijozining KALITSIZ o'rnini bosuvchi.

    Kursning `client.chat.completions.create(...)` chaqiruvi
    O'ZGARMAYDI — faqat mijoz almashadi.
    """

    class _Msg:
        def __init__(self, c):
            self.content = c
            self.role = "assistant"

    class _Ch:
        def __init__(self, c):
            self.message = MahalliyMijoz._Msg(c)

    class _Resp:
        def __init__(self, c):
            self.choices = [MahalliyMijoz._Ch(c)]       # ⭐ .choices[0].message.content

    class _Comp:
        def __init__(self, p):
            self._p = p

        def create(self, model=None, messages=None, stream=False,
                   max_tokens=150, temperature=0.0, **kw):
            o = self._p(messages, max_new_tokens=max_tokens,
                        do_sample=temperature > 0,
                        **({"temperature": temperature} if temperature > 0 else {}))
            matn = o[0]["generated_text"][-1]["content"].strip()
            if stream:
                return (w + " " for w in matn.split())   # ⭐ GENERATOR
            return MahalliyMijoz._Resp(matn)

    class _Chat:
        def __init__(self, p):
            self.completions = MahalliyMijoz._Comp(p)

    def __init__(self, api_key=None, _pipe=None):
        self.chat = MahalliyMijoz._Chat(_pipe)
```

```python
from transformers import pipeline

p = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct",
             device=-1, dtype="auto")
client = MahalliyMijoz(_pipe=p)          # ⭐ api_key KERAK EMAS
```

> ## 🏆🏆 **BU — ADAPTER NAQSHI** *(62-modulda ko'rgan edik)*. ## ## ⭐ Kursning **butun `app.py` si** endi ## **kalitsiz ishlaydi**.

---

## 3. 🔬 O'lchaymiz — ishlaydimi?

```python
SYS = ("You are an HR executive that interviews an interviewee called Alex "
       "with experience 2 years as a Data Scientist and skills Python, SQL. "
       "You should interview him for the position Senior ML Engineer "
       "at the company Spotify")

msgs = [{"role": "system", "content": SYS},
        {"role": "user", "content": "Hi, I'm Alex. Nice to meet you."}]

r = client.chat.completions.create(model="mahalliy", messages=msgs, max_tokens=120)
print(r.choices[0].message.content)
```

### ✅ Haqiqiy natija

```
yuklash: 2.8 s
vaqt: 1.9 s
javob: Hello Alex! It's nice to meet you too. As a senior data scientist with
2 years of experience in Python and SQL, it's great to have you join our team
at Spotify. What brings you to this role?
```

> ## 🏆 **KURSNING HR PROMPTI MAHALLIY MODELDA ISHLADI.** ## Model ismni, tajribani, kompaniyani — ## **hammasini** ishlatdi.

> ## ⚠️ **BITTA XATO BOR:** ## *"it's great to have you join our team"* — ## model nomzodni **allaqachon qabul qilingan** deb o'yladi. ## ## 🔑 Bu — **kichik model** belgisi. ## 7-darsda buni **prompt bilan** tuzatamiz.

### 🌊 `stream=True` — generator qaytadimi?

```python
g = client.chat.completions.create(model="mahalliy", messages=msgs,
                                   stream=True, max_tokens=60)
print("tur:", type(g).__name__)
print("bo'laklar:", len(list(g)))
```

```
tur: generator
bo'laklar: 38   birinchi 5: ['Hello ', 'Alex! ', "It's ", 'nice ', 'to ']
```

> ## ⭐ **VA MANA NEGA BU MUHIM:** ## 65-modulda o'lchagan edik — ## `st.write_stream` **generator** talab qiladi. ## ## 🏆 Bizning mijozimiz aynan shuni beradi.

---

## 4. ⚠️ Yuklash vaqti — **ikki xil o'lchov**

| O'lchov | Vaqt |
|---|---|
| ## Birinchi ishga tushirish *(sovuq)* | ## 💥 **12.9 s** |
| Keyingi ishga tushirishlar | ## ⭐ **2.8 s** |

> ## 🔧 **MEN BUNI IKKI MARTA O'LCHADIM VA TURLI RAQAM OLDIM.** ## Sabab — **operatsion tizim disk keshi**. ## ## ⚠️ **HALOL BO'LSAK: har ikkalasi ham to'g'ri** — ## foydalanuvchi **birinchi safar 13 s** kutadi.

> ## 🏆 **VA MANA NEGA `@st.cache_resource` SHART** *(65-modul, 4-dars)*: ## Streamlit har rerunda skriptni ## **boshidan** ishga tushiradi.

```python
@st.cache_resource                      # ⭐ HAMMA foydalanuvchiga BITTA
def model_yukla():
    from transformers import pipeline
    return pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct",
                    device=-1, dtype="auto")


client = MahalliyMijoz(_pipe=model_yukla())
```

> ## 💥 **`@st.cache_data` ISHLATMANG** — ## u modelni **nusxalashga** urinadi ## *(65-modul, 9-mashq: `a is b` → `False`)*.

---

## 5. 🔧 Ikki tomonlama mijoz — **kalit bo'lsa ham, bo'lmasa ham**

```python
import os
import streamlit as st


@st.cache_resource
def mijoz_ol():
    """Kalit bor bo'lsa — OpenAI, yo'q bo'lsa — mahalliy."""
    kalit = None
    try:
        kalit = st.secrets["OPENAI_API_KEY"]        # ⭐ fayl yo'q bo'lsa xato beradi
    except Exception:
        kalit = os.environ.get("OPENAI_API_KEY")

    if kalit and kalit.startswith("sk-"):
        from openai import OpenAI
        return OpenAI(api_key=kalit), "gpt-4o-mini"

    from transformers import pipeline
    p = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct",
                 device=-1, dtype="auto")
    return MahalliyMijoz(_pipe=p), "mahalliy"


client, MODEL = mijoz_ol()
st.caption(f"rejim: {MODEL}")
```

> ## ⚠️ **`st.secrets[...]` NI `try` GA O'RANG.** ## `secrets.toml` yo'q bo'lsa u ## **butun ilovani yiqitadi**.
>
> ## ## 🔑 **VA BU — KURSNING KODIDAGI KAMCHILIK:** ## uning `app.py` si `secrets.toml` siz ## **umuman ishga tushmaydi**.

---

## 6. 💥 Va kalit haqida — **eng muhim ogohlantirish**

Kurs 8-darsda aytadi: *"hech qachon API kalitingizni GitHub ga yuklamang"*. **To'g'ri.** Lekin o'sha darsda u aynan shu buyruqni beradi:

```bash
git add .
```

> ## 💥💥💥 **BU BUYRUQ `secrets.toml` NI HAM QO'SHADI.** ## Biz buni **8-darsda o'lchadik** — ## va u haqiqatan **qo'shildi**.
>
> ## ## 🔑 **YECHIM — `.gitignore`,** ## kurs esa uni **umuman eslatmaydi**.

---

## 🎯 Nazorat savollari

1. `set_page_config` skriptning qayeriga qo'yiladi?
2. Kalitsiz ishlash uchun mijozning qanday tuzilishi kerak?
3. `stream=True` nima qaytarishi kerak?
4. Modelni qaysi dekorator bilan keshlash kerak?
5. `st.secrets[...]` ni nega `try` ga o'rash kerak?

<details>
<summary>Javoblar</summary>

1. ## **Eng boshiga** — hujjatlar bo'yicha u **birinchi `st.` chaqiruvi** bo'lishi shart. ⚠️ Lekin `AppTest` da sinaganimizda **xato chiqmadi** (3/3) — men buni xato kutgan edim. ⭐ `AppTest` sahifa konfiguratsiyasini brauzerdek qo'llamaydi, shuning uchun qoidaga baribir amal qiling.
2. ## `client.chat.completions.create(...)` — **to'rt daraja**. `create` esa `.choices[0].message.content` ga ega obyekt (yoki `stream=True` da **generator**) qaytarishi kerak. ⭐ Bu — **Adapter** naqshi.
3. ## **Generator** *(yoki oqimga o'xshash obyekt)*. O'lchadik: 38 ta bo'lak, `['Hello ', 'Alex! ', ...]`. 💥 `st.write_stream` ga satr bersangiz — `StreamlitAPIException`.
4. ## **`@st.cache_resource`** — u **hamma foydalanuvchiga bitta** obyekt beradi. 💥 `cache_data` modelni **nusxalashga** urinadi.
5. `secrets.toml` fayli **yo'q bo'lsa** u xato beradi va **butun ilova yiqiladi**. ⭐ `try/except` bilan mahalliy rejimga o'tish mumkin.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Implementing-the-Chat-Functionality.md)
