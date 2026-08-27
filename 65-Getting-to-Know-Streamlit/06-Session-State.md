# 6-dars. Session State ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `nested buttons` muammosini ko'rsatib, yechimni beradi — va oxirida 'ikkinchi tugma uchun ham session_state kerak bo'lishi mumkin, buni o'zingiz sinab ko'ring' deydi. Biz sinadik. U haq edi."**

---

## 1. Asos: **har bir o'zaro ta'sirda butun skript qayta ishlaydi**

Kursning asosiy da'vosi. **O'lchaymiz.**

```python
SANAGICH = '''
import streamlit as st

if "ishga_tushishlar" not in st.session_state:
    st.session_state.ishga_tushishlar = 0
st.session_state.ishga_tushishlar += 1

st.write(f"skript {st.session_state.ishga_tushishlar} marta ishga tushdi")
st.button("Bosing", key="b1")
st.slider("Slayder", 0, 10, 5, key="s1")
st.text_input("Matn", key="t1")
'''

at = AppTest.from_string(SANAGICH); at.run()
print("boshlang'ich          :", at.session_state.ishga_tushishlar)
at.button[0].click().run()
print("tugma bosilgandan keyin:", at.session_state.ishga_tushishlar)
at.slider[0].set_value(8).run()
print("slayder o'zgargandan   :", at.session_state.ishga_tushishlar)
at.text_input[0].set_value("salom").run()
print("matn kiritilgandan     :", at.session_state.ishga_tushishlar)
```

### ✅ Haqiqiy natija

```
boshlang'ich          : 1
tugma bosilgandan keyin: 2
slayder o'zgargandan   : 3
matn kiritilgandan     : 4
```

> ## ✅ **KURS HAQ.** ## Tugma, slayder, matn — ## ## ⭐ **har biri skriptni BOSHIDAN ishga tushiradi.**

> ## 💡 **VA MANA NEGA `session_state` KERAK:** ## oddiy Python o'zgaruvchisi ## har rerunda **nolga qaytadi**. ## `st.session_state` esa — **omon qoladi**.

---

## 2. 💥💥 Kursning `nested buttons` muammosi

```python
BUZUQ = '''
import streamlit as st
st.title("Nested buttons example")
if st.button("Birinchi tugma", key="b1"):
    st.write("ochildi")
    if st.button("Ikkinchi tugma", key="b2"):
        st.write("ikkinchi tugma bosildi")
'''
```

### 🔬 Qadam-baqadam sinaymiz

```python
at = AppTest.from_string(BUZUQ); at.run()
print("① boshida       : tugmalar", len(at.button), [m.value for m in at.markdown])
at.button[0].click().run()
print("② 1-tugma bosildi: tugmalar", len(at.button), [m.value for m in at.markdown])
at.button[1].click().run()
print("③ 2-tugma bosildi: tugmalar", len(at.button), [m.value for m in at.markdown])
```

### ✅ Haqiqiy natija

```
① boshida       : tugmalar 1  matnlar []
② 1-tugma bosildi: tugmalar 2  matnlar ['ochildi']
③ 2-tugma bosildi: tugmalar 1  matnlar []
```

> ## 💥💥💥 **③ DA HAMMASI YO'QOLDI.**
>
> ## Tugmalar **2 → 1**. Matnlar **['ochildi'] → []**. ## ## ⭐ **"ikkinchi tugma bosildi" HECH QACHON KO'RINMAYDI.**

### 🔑 Nega?

| Qadam | Skript ishlaydi | `birinchi_tugma` | Natija |
|---|---|---|---|
| ① yuklash | 1-marta | `False` | 1 ta tugma |
| ② 1-tugma bosildi | 2-marta | ## `True` | 2 ta tugma |
| ③ **2-tugma bosildi** | 3-marta | ## 💥 **`False`** | ## 💥 **hech narsa** |

> ## 💥 **TUGMA — BIR MARTALIK.** ## `st.button(...)` **faqat o'sha rerunda** `True`. ## Keyingi rerunda — yana **`False`**.
>
> ## ## 🔑 **VA 2-TUGMA 1-TUGMANING `if` I ICHIDA.** ## 1-tugma `False` bo'lgach — ## `if` bloki umuman **bajarilmaydi**. ## ## ⭐ 2-tugma **mavjud bo'lmay qoladi**, ## uning bosilishi esa **hech kimga kerak emas**.

---

## 3. ✅ Kursning yechimi — `session_state`

```python
import streamlit as st

if "ikkinchini_korsat" not in st.session_state:
    st.session_state.ikkinchini_korsat = False

if st.button("Birinchi tugma", key="b1"):
    st.session_state.ikkinchini_korsat = True     # ⭐ ESLAB QOLAMIZ

if st.session_state.ikkinchini_korsat:            # ⭐ TUGMANI EMAS, HOLATNI tekshiramiz
    st.write("ochildi")
    if st.button("Ikkinchi tugma", key="b2"):
        st.write("ikkinchi tugma bosildi")
```

### ✅ Haqiqiy natija

```
① boshida       : tugmalar 1  matnlar []
② 1-tugma bosildi: tugmalar 2  matnlar ['ochildi']
③ 2-tugma bosildi: tugmalar 2  matnlar ['ochildi', 'ikkinchi tugma bosildi']
```

> ## 🏆 **ISHLADI.** ## ⭐ **Sir — bitta so'zda:** ## `if st.button(...)` **emas**, ## `if st.session_state.<holat>` .

---

## 4. ⭐⭐ Kurs **topshiriq qilib qoldirgan** qism

Kurs oxirida aytadi:

> *"2-tugmaning hali session state'i yo'q, shuning uchun boshqa elementlar bilan ishlasangiz yoki 1-tugmani qayta bossangiz, uning holati tiklanadi. Buni tuzatish uchun 2-tugmaga ham session state qo'shish mumkin — lekin buni sizga topshiriq qilib qoldiraman."*

### 🔬 **Sinaymiz — u haqmi?**

```python
# 3-bo'limdagi holatdan davom etamiz (2-tugma bosilgan)
at.button[0].click().run()          # ⭐ 1-tugmani QAYTA bosamiz
print("1-tugma qayta bosildi:", [m.value for m in at.markdown])
```

### ✅ Haqiqiy natija

```
1-tugma qayta bosildi: ['ochildi']
```

> ## 💥 **"ikkinchi tugma bosildi" — YO'QOLDI.**
>
> ## ## ✅ **KURS HAQ EDI.** ## ⭐ Men buni **tekshirib ko'rdim**, ## chunki *"balki abzalligi bordir"* deb o'ylagandim — ## ## 💥 **yo'q, muammo aynan aytilganidek.**

### ✅ To'liq yechim — **ikkala** tugma ham `session_state` da

```python
import streamlit as st

for k in ["ikkinchini_korsat", "ikkinchi_bosildi"]:
    if k not in st.session_state:
        st.session_state[k] = False

if st.button("Birinchi tugma", key="b1"):
    st.session_state.ikkinchini_korsat = True

if st.session_state.ikkinchini_korsat:
    st.write("ochildi")
    if st.button("Ikkinchi tugma", key="b2"):
        st.session_state.ikkinchi_bosildi = True     # ⭐ BUNI HAM ESLAYMIZ

if st.session_state.ikkinchi_bosildi:                # ⭐ ALOHIDA `if` — ichkarida EMAS
    st.write("ikkinchi tugma bosildi")
```

```
2-tugma bosilgandan keyin: ['ochildi', 'ikkinchi tugma bosildi']
1-tugma QAYTA bosilgandan: ['ochildi', 'ikkinchi tugma bosildi']
```

> ## 🏆🏆 **HOLAT SAQLANDI.**
>
> ## ## ⭐ **VA E'TIBOR BERING:** ## oxirgi `if` — **ichkarida emas, tashqarida**. ## ## 🔑 Bu — **umumiy naqsh:** ## ① tugmalar holatni **yozadi**, ## ② alohida bloklar holatni **o'qiydi**.

---

## 5. ⭐⭐ Kurs aytmagan: `on_click` **callback**

Bundan ham toza yo'l bor.

```python
kod = '''
import streamlit as st

if "log" not in st.session_state:
    st.session_state.log = []

def qayta_ishlash():
    st.session_state.log.append("CALLBACK")

st.session_state.log.append("SKRIPT")
st.button("Bos", on_click=qayta_ishlash, key="b")
st.write(" -> ".join(st.session_state.log))
'''
at = AppTest.from_string(kod); at.run()
print("①", [m.value for m in at.markdown])
at.button[0].click().run()
print("②", [m.value for m in at.markdown])
```

### ✅ Haqiqiy natija

```
① ['SKRIPT']
② ['SKRIPT -> CALLBACK -> SKRIPT']
```

> ## 🏆🏆🏆 **BU — DARSNING ENG MUHIM KASHFIYOTI:**
>
> ## ## ⭐ **`CALLBACK` — IKKINCHI `SKRIPT` DAN OLDIN.**
>
> ## Ya'ni tartib: ## ① tugma bosildi → ## ② ## **callback ishlaydi** → ## ③ **keyin** skript boshidan qayta ishlaydi.

> ## 💡 **VA BU NEGA MUHIM?** ## Callback ichida `session_state` ni o'zgartirsangiz — ## skript **allaqachon yangi holat bilan** ishlaydi. ## ## 🔑 `st.rerun()` **kerak emas**.

```python
# ⭐ nested buttons — callback bilan
def ochish():
    st.session_state.ikkinchini_korsat = True

st.button("Birinchi tugma", on_click=ochish, key="b1")
```

---

## 6. 💥💥 To'rtta tuzoq — **o'lchangan**

### ① `session_state` — **havola** saqlaydi, nusxa emas

```python
kod = '''
import streamlit as st
st.session_state.setdefault("ro", [])
mahalliy = st.session_state.ro       # ⭐ NUSXA EMAS — HAVOLA
mahalliy.append("x")
st.write(f"uzunlik = {len(st.session_state.ro)}")
'''
```

```
① ['uzunlik = 1']
② ['uzunlik = 2']
③ ['uzunlik = 3']
```

> ## 💥 **RO'YXAT HAR RERUNDA O'SADI.** ## `mahalliy` — bu **o'sha ro'yxatning o'zi**.
>
> ## ## 🔑 **CHAT TARIXIDA BU — XATO MANBAI:** ## `tarix = st.session_state.tarix` deb olib, ## keyin `tarix.append(...)` qilsangiz — ## ⭐ **bu `session_state` ni o'zgartiradi**. ## ## 💡 Ba'zan bu **kerak**, ba'zan — **xato**. ## ⚠️ Nusxa kerak bo'lsa: `list(st.session_state.tarix)`.

### ② Kalitni **o'chirish** mumkin

```python
if st.button("Tozalash", key="b"):
    del st.session_state.son
st.write(f"son = {st.session_state.get('son')}")
```

```
① ['son = 1']
② ['son = 2']
③ tozalangandan keyin ['son = None']
```

> ## ⭐ **`del` ISHLAYDI.** ## ⚠️ Lekin keyin `st.session_state.son` ga murojaat — ## **`KeyError`**. ## ## 🔑 Shuning uchun **`.get()`** ishlating.

### ③ Widget kalitiga **oldindan qiymat** berish mumkin

```python
st.session_state["slayder"] = 7          # ⭐ WIDGETDAN OLDIN
st.slider("S", 0, 10, key="slayder")
st.write(f"slayder = {st.session_state.slayder}")
```

```
xato: 0
['slayder = 7']
```

> ## ⭐ **XATO YO'Q** — va slayder **7** bilan boshlanadi.
>
> ## ## 💡 Bu — **saqlangan sozlamalarni tiklash** uchun ## foydali naqsh.

### ④ `session_state` — **istalgan** obyektni saqlaydi

```python
st.session_state.a = [1, 2, 3]
st.session_state.b = {"x": 1}
st.session_state.c = pd.DataFrame({"q": [1]})
st.session_state.d = lambda z: z * 2       # ⭐ funksiya!
st.session_state.e = open                  # ⭐ builtin!
```

```
xato: 0
list ok: [1, 2, 3]
dict ok: {'x': 1}
df ok: (1, 1)
lambda ok: 42
builtin ok: open
```

> ## ⭐ **HECH QANDAY SERIALIZATSIYA CHEKLOVI YO'Q.** ## `lambda`, ochiq fayl, model — **hammasi mumkin**.
>
> ## ## ⚠️ **LEKIN MODEL UCHUN `@st.cache_resource` AFZAL** *(4-dars)*: ## `session_state` — **har foydalanuvchiga alohida**, ## `cache_resource` — ## ⭐ **hammaga bitta**. ## ## 💥 100 ta foydalanuvchi = ## `session_state` da **100 ta model nusxasi**.

---

## 7. ⭐ `st.rerun()` — qo'lda qayta ishga tushirish

```python
st.session_state.setdefault("n", 0)
st.session_state.n += 1
if st.session_state.n < 3:
    st.rerun()
st.write(f"n = {st.session_state.n}")
```

```
xato: 0   ['n = 3']
```

> ## ⭐ **SKRIPT 3 MARTA ISHLADI** — ## foydalanuvchi esa faqat **oxirgi natijani** ko'radi.

> ## 💥 **EHTIYOT BO'LING — CHEKSIZ SIKL OSON:** ## shart bo'lmasa, `st.rerun()` ## ilovani **muzlatib qo'yadi**.
>
> ## ## 🔑 **VA KO'PINCHA U KERAK EMAS:** ## `on_click` callback allaqachon ## rerundan **oldin** ishlaydi *(5-bo'lim)*.

---

## 8. 🏆 Xotira xaritasi

| Saqlash joyi | Yashash muddati | Kimga tegishli | Misol |
|---|---|---|---|
| Oddiy o'zgaruvchi | ## 💥 **1 rerun** | — | vaqtinchalik hisob |
| ## `st.session_state` | ## ⭐ **sessiya** | ## **1 foydalanuvchi** | chat tarixi, holat |
| ## `@st.cache_data` | ## **TTL / kod** | ## **hamma** | DataFrame, hisob |
| ## `@st.cache_resource` | ## **jarayon** | ## 🏆 **hamma** | ## ⭐ **model, MB** |
| Fayl / MB | ## **doimiy** | hamma | foydalanuvchi profili |

> ## 💥 **`session_state` — DOIMIY EMAS.** ## Brauzer yopilsa — ## ⭐ **hammasi yo'qoladi**. ## ## 🔑 Saqlash kerak bo'lsa — **faylga yoki MB ga** yozing.

---

## 🎯 Nazorat savollari

1. Nega `st.button` ning natijasini o'zgaruvchiga saqlab, keyingi rerunda ishlatib bo'lmaydi?
2. `nested buttons` yechimida `if` ni nima bilan almashtiramiz?
3. `on_click` callback **qachon** ishlaydi — rerundan oldinmi yoki keyinmi?
4. `mahalliy = st.session_state.ro; mahalliy.append("x")` nima qiladi?
5. Modelni `session_state` da saqlash nega yomon fikr?

<details>
<summary>Javoblar</summary>

1. ## **`st.button` — bir martalik.** U **faqat bosilgan rerunda** `True`, keyingisida yana **`False`**. 💥 O'lchadik: 2-tugma bosilganda 1-tugma `False` bo'lib, uning `if` bloki umuman bajarilmadi — tugmalar **2 → 1**, matnlar **['ochildi'] → []**.
2. ## `if st.button(...)` **→** `if st.session_state.<holat>`. Tugma **holatni yozadi**, alohida `if` esa **holatni o'qiydi**. ⭐ Va o'qiydigan `if` — **ichkarida emas, tashqarida**.
3. ## **OLDIN.** O'lchangan tartib: `SKRIPT -> CALLBACK -> SKRIPT`. 🔑 Shuning uchun callback ichida `session_state` ni o'zgartirsangiz, skript **allaqachon yangi holat bilan** ishlaydi va `st.rerun()` **kerak emas**.
4. ## **`session_state` dagi ro'yxatning O'ZINI o'zgartiradi** — `mahalliy` bu **havola**, nusxa emas. 💥 O'lchadik: har rerunda uzunlik **1 → 2 → 3**. ⚠️ Nusxa kerak bo'lsa `list(...)`.
5. `session_state` — ## **har foydalanuvchiga alohida**. 💥 100 ta foydalanuvchi = **100 ta model nusxasi** xotirada. ⭐ To'g'ri yo'l — `@st.cache_resource`: u **hammaga bitta** obyekt beradi.

</details>

---

⬅️ [5-dars](05-Chat-Elements.md) · 🏠 [Modul](README.md) · ➡️ [Mashqlar](MASHQLAR.md)
