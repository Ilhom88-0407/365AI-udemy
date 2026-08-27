# 📝 65-modul. Mashqlar

> **20 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> **Brauzer kerak emas** — hammasi `streamlit.testing.v1.AppTest` bilan bajarilgan.
> Har bir natija — **haqiqatan ishga tushirilgan**.

```python
import warnings; warnings.filterwarnings("ignore")
from streamlit.testing.v1 import AppTest
```

---

## 🟢 1-mashq. `st.text` / `st.markdown` / `st.write` — bir xil matnda

Uchalasiga **bir xil** matn bering. `AppTest` da nechta **turli element** paydo bo'ladi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
M = "# Sarlavha\\n**qalin**"
st.text(M)
st.markdown(M)
st.write(M)
'''
at = AppTest.from_string(kod); at.run()
print("elementlar:", [type(e).__name__ for e in at.main])
print("markdown  :", [m.value for m in at.markdown])
print("text      :", [t.value for t in at.get("text")])
```

```
elementlar: ['SpecialBlock', 'Text', 'Markdown', 'Markdown']
markdown  : ['# Sarlavha\n**qalin**', '# Sarlavha\n**qalin**']
text      : ['# Sarlavha\n**qalin**']
```

> ## ⭐ **`markdown` va `write` — BIR XIL ELEMENT.** ## `st.write` satr uchun **`st.markdown` ning o'zi**.
>
> ## ## ⚠️ **`AppTest` UCHALASIDA HAM XOM MATN QAYTARADI** — ## farq faqat **brauzerda** ko'rinadi.
</details>

---

## 🟢 2-mashq. Barcha ranglar `-background` bilan

To'qqizta rangning **fon** variantini sinang. Xato bo'ladimi?

<details><summary>Yechim</summary>

```python
RANGLAR = ["blue","green","orange","red","violet","gray","grey","rainbow","primary"]
kod = "import streamlit as st\n"
for r in RANGLAR:
    kod += f'st.write(":{r}-background[{r}]")\n'
at = AppTest.from_string(kod); at.run()
print("xato:", len(at.exception), " elementlar:", len(at.markdown))
```

```
xato: 0  elementlar: 9
```

> ## ✅ **TO'QQIZTASI HAM `-background` BILAN ISHLAYDI.**
</details>

---

## 🟢 3-mashq. Sarlavha darajalari — element turlari

`title`, `header`, `subheader`, `caption` — `AppTest` da qanday ko'rinadi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
st.title("T"); st.header("H"); st.subheader("S"); st.caption("C")
'''
at = AppTest.from_string(kod); at.run()
print([type(e).__name__ for e in at.main])
print(at.title[0].value, at.header[0].value,
      at.subheader[0].value, at.caption[0].value)
```

```
['SpecialBlock', 'Title', 'Header', 'Subheader', 'Caption']
T H S C
```

> ## ⭐ **HAR BIRI — ALOHIDA ELEMENT TURI.** ## Ya'ni testda `at.title`, `at.header` ## bilan **aniq** murojaat qilish mumkin.
</details>

---

## 🟡 4-mashq. 💥 `st.write` — 4-darsdagi 8 turdan **tashqari**

`None`, `bytes`, `date`, `Decimal`, `set`, `tuple` — nima bo'ladi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
import datetime, decimal
st.write(None)
st.write(b"baytlar")
st.write(datetime.date(2026, 1, 1))
st.write(decimal.Decimal("1.5"))
st.write({1, 2, 3})
st.write((1, 2))
'''
at = AppTest.from_string(kod); at.run()
print("xato:", len(at.exception))
print("markdown:", [m.value for m in at.markdown])
print("json:", len(at.get("json")))
```

```
xato: 0
markdown: ['`None`', "`b'baytlar'`", '`2026-01-01`', '`1.5`',
           '`{1, 2, 3}`', '`(1, 2)`']
json: 0
```

> ## 💥💥 **`set` VA `tuple` — `json` GA AYLANMAYDI!** ## Faqat **`dict` va `list`** `json` elementiga tushadi.
>
> ## ## ⭐ **QOLGANLARI — BEKTIK ICHIDAGI MATN.** ## `st.write` **noma'lum turni** `repr()` qilib, ## `` `...` `` ichiga soladi.

> ## 🔑 **AMALIY XULOSA:** ## `tuple` bergan bo'lsangiz, **jadval kutmang** — ## ⭐ oldin `list(...)` ga aylantiring.
</details>

---

## 🟡 5-mashq. Qaysi widgetlar rerun keltiradi?

`checkbox`, `selectbox`, `number_input` — har biri **skriptni qayta ishga tushiradimi**?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
st.session_state.setdefault("n", 0)
st.session_state.n += 1
st.checkbox("C", key="c")
st.selectbox("S", ["a","b"], key="s")
st.number_input("N", key="nu")
st.write(f"n={st.session_state.n}")
'''
at = AppTest.from_string(kod); at.run()
print("boshida:", at.session_state.n)
at.checkbox[0].check().run();          print("checkbox:", at.session_state.n)
at.selectbox[0].select("b").run();     print("selectbox:", at.session_state.n)
at.number_input[0].set_value(5).run(); print("number_input:", at.session_state.n)
```

```
boshida: 1
checkbox: 2
selectbox: 3
number_input: 4
```

> ## ✅ **UCHALASI HAM.** ## 6-darsdagi `button`/`slider`/`text_input` bilan birga — ## ⭐ **oltita widget, oltitasi ham rerun keltiradi**.
</details>

---

## 🟡 6-mashq. `@st.cache_data` — `1`, `1.0`, `True`, `"1"`

To'rttasi **bir xil kesh kaliti** bo'ladimi? *(Python lug'atida `1 == 1.0 == True`!)*

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
st.session_state.setdefault("c", 0)

@st.cache_data
def f(x):
    st.session_state.c += 1
    return str(x)

f(1); f(1.0); f(True); f("1")
st.write(f"chaqiruvlar={st.session_state.c}")
'''
at = AppTest.from_string(kod); at.run()
print([m.value for m in at.markdown])
```

```
['chaqiruvlar=4']
```

> ## 🏆 **TO'RTTA ALOHIDA CHAQIRUV.** ## Men **`1` va `1.0` birlashadi** deb kutgan edim ## *(lug'at kaliti mantig'i)* — ## ## 💥 **yo'q, Streamlit TURNI ham hisobga oladi.**
>
> ## ## ⭐ **VA BU — YAXSHI:** ## `f(1)` va `f(True)` ## turli natija berishi mumkin.
</details>

---

## 🟡 7-mashq. 💥 `@st.cache_data` ga **ro'yxat** bersak?

Ro'yxat — **hash qilinmaydigan** obyekt. Xato bo'ladimi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st

@st.cache_data
def f(xs):
    return sum(xs)

st.write(f([1,2,3]))
'''
at = AppTest.from_string(kod); at.run()
print("xato:", len(at.exception), [m.value for m in at.markdown])
```

```
xato: 0
['`6`']
```

> ## ✅ **ISHLADI.** ## Men **`UnhashableParamError`** kutgan edim — ## ## 💥 **noto'g'ri.**
>
> ## ## 🔑 **SABAB:** ## `cache_data` `hash()` emas, ## o'zining **serializatsiya** mexanizmini ishlatadi ## *(list, dict, DataFrame — hammasi qo'llab-quvvatlanadi)*.

> ## ⚠️ **LEKIN MODEL/ULANISH UCHUN U ISHLAMAYDI** — ## o'shanda `@st.cache_resource` kerak *(8-mashq)*.
</details>

---

## 🟡 8-mashq. `@st.cache_resource` — **bir xil** obyektmi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st

@st.cache_resource
def resurs():
    return []

a = resurs(); b = resurs()
a.append("x")
st.write(f"bir xil obyekt: {a is b}  b={b}")
'''
at = AppTest.from_string(kod); at.run()
print("①", [m.value for m in at.markdown])
at.run()
print("②", [m.value for m in at.markdown])
```

```
① ["bir xil obyekt: True  b=['x']"]
② ["bir xil obyekt: True  b=['x', 'x']"]
```

> ## 🏆 **`a is b` → `True`** — ## ⭐ **AYNAN O'SHA obyekt**.
>
> ## ## 💥 **VA E'TIBOR BERING — ② DA IKKITA `'x'`:** ## ro'yxat **rerunlar orasida omon qoldi** ## va **yana o'sdi**.

> ## ⚠️ **BU — XAVF:** ## `cache_resource` obyektini **o'zgartirmang**. ## ## 🔑 U **hamma foydalanuvchiga umumiy** — ## bir kishining o'zgarishi **hammaga** tegadi.
</details>

---

## 🟡 9-mashq. `@st.cache_data` — **nusxa** qaytaradimi?

8-mashqning aynan o'zi, faqat `cache_data` bilan.

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st

@st.cache_data
def data():
    return []

a = data(); b = data()
a.append("x")
st.write(f"bir xil obyekt: {a is b}  b={b}")
'''
```

```
① ['bir xil obyekt: False  b=[]']
② ['bir xil obyekt: False  b=[]']
```

> ## 🏆🏆 **`a is b` → `False`, VA `b` BO'SH QOLDI.**
>
> ## ## ⭐ **`cache_data` HAR CHAQIRUVDA NUSXA BERADI** — ## shuning uchun `a` ni o'zgartirish ## `b` ga **ta'sir qilmaydi**.

| | `cache_data` | `cache_resource` |
|---|---|---|
| `a is b` | ## ✅ **`False`** *(nusxa)* | ## ⚠️ **`True`** *(bir obyekt)* |
| O'zgartirish xavfli | ## ✅ **yo'q** | ## 💥 **ha** |
| Kimga | ma'lumot | ## ⭐ **model, MB** |
</details>

---

## 🟡 10-mashq. 💥 `chat_input` — **bo'sh satr** va **probellar**

`if prompt:` ni chalg'itadigan holat toping.

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
p = st.chat_input("yoz")
st.write(f"qiymat={p!r}  rost={bool(p)}")
'''
at = AppTest.from_string(kod); at.run()
print("①", [m.value for m in at.markdown])
at.chat_input[0].set_value("").run()
print("②", [m.value for m in at.markdown])
at.chat_input[0].set_value("   ").run()
print("③", [m.value for m in at.markdown])
```

```
① ['qiymat=None  rost=False']
② ["qiymat=''  rost=False"]
③ ["qiymat='   '  rost=True"]
```

> ## 💥💥 **UCHTA PROBEL — `rost=True`.**
>
> ## `if prompt:` **o'tkazib yuboradi**, ## va siz LLM ga ## ⭐ **bo'sh so'rov** yuborasiz — ## 💰 **pul ketadi, javob esa ma'nosiz**.

### ✅ To'g'ri shart

```python
if prompt and prompt.strip():
    ...
```
</details>

---

## 🟡 11-mashq. `chat_message` ichida DataFrame

Chat pufakchasiga **jadval** joylashtiring.

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st, pandas as pd
with st.chat_message("assistant"):
    st.write("Natijalar:")
    st.dataframe(pd.DataFrame({"ball":[8,9]}))
'''
at = AppTest.from_string(kod); at.run()
print("xato:", len(at.exception))
print([type(e).__name__ for e in at.main])
```

```
xato: 0
['SpecialBlock', 'ChatMessage', 'Markdown', 'Dataframe']
```

> ## ⭐ **KURS HAQ:** ## chat xabariga **jadval, rasm, grafik** — ## hammasini qo'yish mumkin.
>
> ## ## 💡 **INTERVYU BOTIDA BU — BAHOLASH JADVALI:** ## har javobdan keyin ## `chat_message` ichida **ballar**.
</details>

---

## 🔴 12-mashq. 💥 `write_stream` o'rtasida **xato** chiqsa?

Model yarim yo'lda uzilsa — allaqachon chiqarilgan matn nima bo'ladi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st

def oqim():
    yield "boshi "
    raise RuntimeError("model uzildi")

try:
    st.write_stream(oqim())
except RuntimeError as e:
    st.write(f"TUTILDI: {e}")
'''
at = AppTest.from_string(kod); at.run()
print("xato:", len(at.exception), [m.value for m in at.markdown])
```

```
xato: 0
['boshi', 'TUTILDI: model uzildi']
```

> ## ⭐ **YARIM MATN EKRANDA QOLADI** *(`'boshi'`)*, ## keyin xato xabari qo'shiladi.
>
> ## ## 💥 **VA BU — MUAMMO:** ## foydalanuvchi **chala javobni** ko'radi ## va uni **to'liq** deb o'ylashi mumkin.

### ✅ Xavfsiz oqim

```python
def himoyalangan(gen):
    try:
        yield from gen
    except Exception as e:
        yield f"\n\n⚠️ **Javob uzildi:** {e}"
```
</details>

---

## 🟡 13-mashq. `st.stop()` — keyingi kod bajariladimi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
st.write("oldin")
st.stop()
st.write("keyin")
'''
at = AppTest.from_string(kod); at.run()
print("xato:", len(at.exception), [m.value for m in at.markdown])
```

```
xato: 0
['oldin']
```

> ## ✅ **`"keyin"` CHIQMADI — VA XATO HAM YO'Q.** ## `st.stop()` skriptni **toza** to'xtatadi.
>
> ## ## ⭐ **VALIDATSIYA UCHUN IDEAL:**

```python
if len(prompt) > MAX:
    st.error("💥 juda uzun")
    st.stop()          # ⭐ LLM ga umuman bormaydi
```
</details>

---

## 🟡 14-mashq. Kirishni tekshiruvchi funksiya

`None`, bo'sh satr, faqat probel, juda uzun — hammasini tuting.

<details><summary>Yechim</summary>

```python
def tekshir(matn, maxb=50):
    if matn is None:      return None, "bo'sh"
    m = matn.strip()
    if not m:             return None, "faqat probel"
    if len(m) > maxb:     return None, f"juda uzun: {len(m)}/{maxb}"
    return m, "ok"

for t in [None, "", "   ", "salom", "A"*60]:
    print(f"  {t!r:12} -> {tekshir(t)}")
```

```
  None         -> (None, "bo'sh")
  ''           -> (None, 'faqat probel')
  '   '        -> (None, 'faqat probel')
  'salom'      -> ('salom', 'ok')
  'AAAA...'    -> (None, 'juda uzun: 60/50')
```

> ## 🏆 **BU FUNKSIYA — 5-DARSDAGI IKKI KASHFIYOTNING YECHIMI:** ## ① `max_chars` serverda ishlamaydi, ## ② `"   "` — `True`.
</details>

---

## 🟡 15-mashq. `session_state` ni **faylga** saqlash

Brauzer yopilsa `session_state` yo'qoladi. Uni **omon qoldiring**.

<details><summary>Yechim</summary>

```python
import json, os, tempfile

YO = os.path.join(tempfile.gettempdir(), "ss65.json")

def saqla(d):
    json.dump(d, open(YO, "w", encoding="utf-8"), ensure_ascii=False)

def tikla():
    try:
        return json.load(open(YO, encoding="utf-8"))
    except Exception:      # ⭐ fayl yo'q, buzuq JSON — hammasi
        return {}

saqla({"tarix": [{"rol": "user", "matn": "salom"}]})
print("tiklandi:", tikla())
os.remove(YO)
print("fayl yo'q bo'lsa:", tikla())
```

```
tiklandi: {'tarix': [{'rol': 'user', 'matn': 'salom'}]}
fayl yo'q bo'lsa: {}
```

> ## ⭐ **`except Exception` — ATAYLAB KENG:** ## fayl yo'q, ruxsat yo'q, JSON buzuq — ## ## 🏆 **ilova baribir ishga tushishi kerak**.
</details>

---

## 🟡 16-mashq. 💥 Tugma vs checkbox — qaysi **eslab qoladi**?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
st.write(f"tugma={st.button('T', key='b')}  checkbox={st.checkbox('C', key='c')}")
'''
at = AppTest.from_string(kod); at.run()
print("①", [m.value for m in at.markdown])
at.button[0].click().run();   print("②", [m.value for m in at.markdown])
at.run();                     print("③", [m.value for m in at.markdown])
at.checkbox[0].check().run(); print("④", [m.value for m in at.markdown])
at.run();                     print("⑤", [m.value for m in at.markdown])
```

```
① ['tugma=False  checkbox=False']
② ['tugma=True   checkbox=False']     ← bosildi
③ ['tugma=False  checkbox=False']     ← 💥 UNUTDI
④ ['tugma=False  checkbox=True']      ← belgilandi
⑤ ['tugma=False  checkbox=True']      ← ⭐ ESLADI
```

> ## 🏆🏆 **MANA — 6-DARSDAGI MUAMMONING ILDIZI, BITTA JADVALDA:**
>
> | Widget | Keyingi rerunda |
> |---|---|
> | ## `st.button` | ## 💥 **`False`** — bir martalik |
> | ## `st.checkbox` | ## ✅ **saqlanadi** |

> ## 💡 **YA'NI `nested buttons` MUAMMOSI ## `checkbox` DA UMUMAN YO'Q.** ## ⭐ Ba'zan eng oddiy yechim — ## **tugma o'rniga checkbox**.
</details>

---

## 🟡 17-mashq. `AppTest` ning **doimiy narxi**

2-darsda `st.dataframe` ~440 ms chiqdi. **Bo'sh** skript-chi?

<details><summary>Yechim</summary>

```python
import time, statistics

kod = "import streamlit as st\nst.write('x')"
AppTest.from_string(kod).run()          # ⭐ ISITISH
ts = []
for _ in range(5):
    t0 = time.perf_counter()
    AppTest.from_string(kod).run()
    ts.append((time.perf_counter() - t0) * 1000)
print(f"median: {statistics.median(ts):.1f} ms "
      f"(min {min(ts):.1f}, max {max(ts):.1f})")
```

```
median: 424.5 ms  (min 420.2, max 428.5)
```

> ## 🏆🏆 **BITTA `st.write` — 424 ms.** ## 500 000 qatorli DataFrame — **524 ms**.
>
> ## ## ⭐ **YA'NI 2-DARSDAGI XULOSA TASDIQLANDI:** ## ~424 ms — bu **`AppTest` ning o'zi**, ## ma'lumot hajmi emas.

> ## 💡 **VA BU — TEST YOZISHDA MUHIM:** ## 100 ta `AppTest` sinovi = ## ⚠️ **~42 soniya**. ## ⭐ Bitta `at` ni **qayta ishlating**.
</details>

---

## 🔴 18-mashq. Foydalanuvchi matnini **ekranlash**

4-darsda ko'rdik: `st.write` foydalanuvchi yozgan `# sarlavha` ni **haqiqiy sarlavha** qiladi. Buni to'xtating.

<details><summary>Yechim</summary>

```python
BELGILAR = r"\`*_{}[]()#+-.!>|"

def xavfsiz(m):
    return "".join("\\" + c if c in BELGILAR else c for c in m)

S = "# Sarlavha *kursiv* [havola](x) `kod`"
print("xom   :", S)
print("ekran :", xavfsiz(S))

kod = "import streamlit as st\nst.write(%r)\nst.text(%r)" % (xavfsiz(S), S)
at = AppTest.from_string(kod); at.run()
print("write :", [m.value for m in at.markdown])
print("text  :", [t.value for t in at.get("text")])
```

```
xom   : # Sarlavha *kursiv* [havola](x) `kod`
ekran : \# Sarlavha \*kursiv\* \[havola\]\(x\) \`kod\`
xato  : 0
write : ['\\# Sarlavha \\*kursiv\\* \\[havola\\]\\(x\\) \\`kod\\`']
text  : ['# Sarlavha *kursiv* [havola](x) \`kod\`']
```

> ## ⭐ **IKKI YO'L, IKKALASI HAM ISHLAYDI:**
>
> ## ① **`st.text`** — hech narsani ishlamaydi. ## 🏆 **Eng oddiy.**
> ## ② **Ekranlash + `st.write`** — ## matn **markdown ichida**, lekin **zararsiz**.

> ## 💡 **QAYSI BIRI?** ## Agar chat pufakchasida **format kerak bo'lsa** *(qalin, ro'yxat)* — ## ekranlash. ## ⭐ Aks holda — **`st.text`**.
</details>

---

## 🔴 19-mashq. Chat tarixini **kesish**

LLM kontekst oynasi cheklangan. Tarixni **oxiridan** boshlab kesing.

<details><summary>Yechim</summary>

```python
def kes(tarix, maxs=20):
    """Oxiridan boshlab, jami so'z maxs dan oshmasin."""
    ch, jami = [], 0
    for x in reversed(tarix):              # ⭐ OXIRIDAN — eng yangi muhim
        n = len(x["matn"].split())
        if jami + n > maxs:
            break
        ch.append(x)
        jami += n
    return list(reversed(ch)), jami        # ⭐ tartibni tiklaymiz

T = [{"rol": "user", "matn": " ".join(["so"] * 8)} for _ in range(5)]
ch, j = kes(T)
print(f"kirish {len(T)} xabar -> chiqish {len(ch)} xabar, {j} so'z")
```

```
kirish 5 xabar -> chiqish 2 xabar, 16 so'z
```

> ## ⭐ **NEGA OXIRIDAN?** ## Suhbatda **oxirgi xabarlar** eng muhim.
>
> ## ## ⚠️ **LEKIN TIZIM PROMPTINI ALOHIDA SAQLANG** — ## u **hech qachon kesilmasligi** kerak.

> ## 🔑 **HAQIQIY ILOVADA `tiktoken` ISHLATING:** ## `len(enc.encode(matn))`, so'z emas ## *(63-modul: o'zbekcha 2.3× ko'proq token)*.
</details>

---

## 🔴 20-mashq. Widget kaliti `session_state` da ko'rinadimi?

<details><summary>Yechim</summary>

```python
kod = '''
import streamlit as st
st.session_state.setdefault("oddiy", 1)
st.text_input("W", key="widget")
st.write("x")
'''
at = AppTest.from_string(kod); at.run()
print("filtered_state:", dict(at.session_state.filtered_state))
```

```
filtered_state: {'oddiy': 1, 'widget': ''}
```

> ## ⭐ **IKKALASI HAM BIR JOYDA.** ## Widget kaliti — **oddiy `session_state` kaliti**, ## faqat uni **widget to'ldiradi**.
>
> ## ## 💡 **VA SHUNING UCHUN 6-DARSDAGI NAQSH ISHLAYDI:** ## `st.session_state["slayder"] = 7` deb ## widgetdan **oldin** qiymat qo'yish mumkin.

> ## ⚠️ **`at.session_state._state` — MAVJUD EMAS** *(`AttributeError`)*. ## ⭐ To'g'ri yo'l — **`filtered_state`**.
</details>

---

## 🏆 Nimalarni o'lchadik

| Mashq | Kutilgan | ## Haqiqiy |
|---|---|---|
| 4 | `set`/`tuple` → `json` | ## 💥 **markdown, bektikda** |
| 6 | `1` va `1.0` — bir kesh | ## 💥 **4 ta alohida** |
| 7 | ro'yxat → `UnhashableParamError` | ## 💥 **ishladi** |
| 9 | `cache_data` — nusxa | ## ✅ **`a is b` → `False`** |
| 10 | `"   "` → `False` | ## 💥 **`True`** |
| 16 | tugma holatni saqlaydi | ## 💥 **`False`, checkbox esa saqlaydi** |
| 17 | bo'sh skript tez | ## 💥 **424 ms** |

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md) · ⬅️ [6-dars](06-Session-State.md)
