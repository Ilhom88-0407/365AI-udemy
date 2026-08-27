# 🚀 65-modul. Mini-loyihalar

> **Ikkita loyiha.** Ikkalasi ham **ishga tushirilgan va tekshirilgan**.
> **Brauzer kerak emas** — hammasi `AppTest` bilan.

```python
import time, statistics, warnings
warnings.filterwarnings("ignore")
from streamlit.testing.v1 import AppTest
```

---

# 🧪 1-loyiha. `StreamlitSinov` — brauzersiz test ramkasi

**Muammo:** Streamlit ilovasini sinash uchun odatda **brauzer**, **Selenium** va **daqiqalar** kerak. `AppTest` buni **425 ms** ga tushiradi — lekin uning API si **xom**.

```python
class StreamlitSinov:
    """Streamlit ilovasini BRAUZERSIZ sinaydi va HISOBOT beradi.

    · har bir tekshiruv alohida yoziladi
    · vaqt o'lchanadi (isitish bilan)
    · yiqilish o'rniga hisobot
    """

    def __init__(self, kod, nom="ilova"):
        self.kod = kod
        self.nom = nom
        self.natijalar = []
        self.at = None

    # ---------- ishga tushirish ----------
    def boshla(self, **holat):
        self.at = AppTest.from_string(self.kod)
        for k, v in holat.items():              # ⭐ boshlang'ich holat
            self.at.session_state[k] = v
        self.at.run()
        return self

    def qadam(self, tur, indeks=0, amal="set_value", qiymat=None):
        w = getattr(self.at, tur)[indeks]
        if amal == "click":
            w.click()
        elif amal == "check":
            w.check()
        elif amal == "select":
            w.select(qiymat)
        else:
            w.set_value(qiymat)
        self.at.run()
        return self

    # ---------- tekshiruvlar ----------
    def _yoz(self, nom, ok, izoh=""):
        self.natijalar.append((nom, ok, izoh))
        return self

    def xatosiz(self):
        n = len(self.at.exception)
        izoh = self.at.exception[0].message.splitlines()[-1][:80] if n else ""
        return self._yoz("xatosiz", n == 0, izoh)

    def matn_bor(self, parcha):
        bor = any(parcha in m.value for m in self.at.markdown)
        return self._yoz(f"matn: {parcha!r}", bor,
                         "" if bor else f"topilmadi ({len(self.at.markdown)} markdown)")

    def matn_yoq(self, parcha):
        bor = any(parcha in m.value for m in self.at.markdown)
        return self._yoz(f"matn YO'Q: {parcha!r}", not bor,
                         "topildi" if bor else "")

    def element_soni(self, tur, kutilgan):
        n = len(self.at.get(tur))
        return self._yoz(f"{tur} soni == {kutilgan}", n == kutilgan,
                         f"haqiqiy: {n}")

    def holat(self, kalit, kutilgan):
        try:                                    # 💥 .get() MAVJUD EMAS
            haq = self.at.session_state[kalit]
        except KeyError:
            haq = None
        return self._yoz(f"session_state[{kalit!r}] == {kutilgan!r}",
                         haq == kutilgan, f"haqiqiy: {haq!r}")

    # ---------- tezlik ----------
    def tezlik(self, takror=3):
        AppTest.from_string(self.kod).run()          # ⭐ ISITISH
        ts = []
        for _ in range(takror):
            t0 = time.perf_counter()
            AppTest.from_string(self.kod).run()
            ts.append((time.perf_counter() - t0) * 1000)
        return statistics.median(ts)

    # ---------- hisobot ----------
    def hisobot(self):
        ok = sum(1 for _, o, _ in self.natijalar if o)
        jami = len(self.natijalar)
        print(f"\n  📋 {self.nom}: {ok}/{jami}")
        for nom, o, izoh in self.natijalar:
            belgi = "✅" if o else "💥"
            qosh = f"   <- {izoh}" if izoh and not o else ""
            print(f"    {belgi} {nom}{qosh}")
        return ok == jami
```

> ## 💥 **BIR TUZOQ — `at.session_state.get(...)` ISHLAMAYDI:**
>
> ```
> AttributeError: get not found in session_state.
> ```
>
> ## ## 🔑 **SABAB:** ## `SafeSessionState.__getattr__` **har qanday nomni** ## kalit deb qabul qiladi — ## `.get` ni ham **kalit** deb qidiradi. ## ## ⭐ To'g'ri yo'l: `at.session_state[kalit]` + `try/except KeyError`.

---

## 🔬 Sinovda: kursning **buzuq** va **tuzatilgan** kodi

```python
BUZUQ = '''
import streamlit as st
st.title("Nested buttons example")
if st.button("Birinchi tugma", key="b1"):
    st.write("ochildi")
    if st.button("Ikkinchi tugma", key="b2"):
        st.write("ikkinchi tugma bosildi")
'''

TUZATILGAN = '''
import streamlit as st
st.title("Nested buttons — to'liq")

for k in ["korsat", "bosildi"]:
    st.session_state.setdefault(k, False)

if st.button("Birinchi tugma", key="b1"):
    st.session_state.korsat = True
if st.session_state.korsat:
    st.write("ochildi")
    if st.button("Ikkinchi tugma", key="b2"):
        st.session_state.bosildi = True
if st.session_state.bosildi:
    st.write("ikkinchi tugma bosildi")
'''
```

```python
s1 = (StreamlitSinov(BUZUQ, "buzuq nested buttons")
      .boshla()
      .qadam("button", 0, "click")
      .qadam("button", 1, "click")
      .xatosiz()
      .matn_bor("ikkinchi tugma bosildi")
      .element_soni("button", 2))
o1 = s1.hisobot()
print(f"  ⏱  {s1.tezlik():.1f} ms")

s2 = (StreamlitSinov(TUZATILGAN, "tuzatilgan nested buttons")
      .boshla()
      .qadam("button", 0, "click")
      .qadam("button", 1, "click")
      .qadam("button", 0, "click")          # ⭐ 1-tugmani QAYTA bosamiz
      .xatosiz()
      .matn_bor("ikkinchi tugma bosildi")
      .element_soni("button", 2)
      .holat("bosildi", True))
o2 = s2.hisobot()
print(f"  ⏱  {s2.tezlik():.1f} ms")

print(f"\n  🏆 BUZUQ o'tdimi: {o1}   TUZATILGAN o'tdimi: {o2}")
```

### ✅ Haqiqiy natija

```
--- BUZUQ versiya ---

  📋 buzuq nested buttons: 1/3
    ✅ xatosiz
    💥 matn: 'ikkinchi tugma bosildi'   <- topilmadi (0 markdown)
    💥 button soni == 2   <- haqiqiy: 1
  ⏱  436.0 ms

--- TUZATILGAN versiya ---

  📋 tuzatilgan nested buttons: 4/4
    ✅ xatosiz
    ✅ matn: 'ikkinchi tugma bosildi'
    ✅ button soni == 2
    ✅ session_state['bosildi'] == True
  ⏱  432.0 ms

  🏆 BUZUQ o'tdimi: False   TUZATILGAN o'tdimi: True
```

> ## 🏆🏆 **SINOV BUZUQ KODNI TUTDI — 1/3.**
>
> ## ## ⭐ **VA E'TIBOR BERING — `xatosiz` IKKALASIDA HAM ✅.** ## Buzuq kod **xato bermaydi**, ## u shunchaki ## 💥 **noto'g'ri ishlaydi**.

> ## 🔑 **MANA NEGA `try/except` YETARLI EMAS:** ## Streamlit ilovalarida ko'p xato ## **jimgina** *(3-dars `:purple[]`, 4-dars `None`, 5-dars `avatar=''`)*. ## ## ⭐ **Ularni faqat NATIJANI tekshirib topasiz.**

> ## ⏱ **436 ms va 432 ms** — ## ikkala sinov **deyarli bir xil**. ## Bu — 2-darsdagi **doimiy narx**.

---

# 🎤 2-loyiha. `Ace Interview` prototipi

**Muammo:** Bu — kursning **asosiy loyihasi**. 66-modulda unga LLM ulanadi. Bu yerda **karkasni** quramiz — va u **hamma tuzoqni** hisobga oladi.

### 🏆 Modulning barcha kashfiyotlari **bitta ilovada**

| Kashfiyot | Dars | Ilovada |
|---|---|---|
| `max_chars` serverda ishlamaydi | 5 | ## `tekshir()` |
| `"   "` → `True` | mashq 10 | ## `m.strip()` |
| `chat_input` o'zini tozalaydi | 5 | ## `st.rerun()` xavfsiz |
| Tarix **avval**, kirish **keyin** | 5 | ## ① → ③ tartib |
| `write_stream` matnni **qaytaradi** | 5 | ## oqim + saqlash |
| `st.stop()` toza to'xtatadi | mashq 13 | ## validatsiya |
| Tarixni kesish | mashq 19 | ## `kes()` |

```python
import streamlit as st

# ---------- sozlamalar ----------
MAX_BELGI = 300
MAX_SO_Z = 60          # tarix uchun kontekst chegarasi

SAVOLLAR = [
    "O'zingiz haqingizda qisqacha gapirib bering.",
    "Eng qiyin texnik muammo qaysi edi?",
    "Jamoada kelishmovchilik bo'lsa nima qilasiz?",
]


# ---------- kirishni tekshirish ----------
def tekshir(matn, maxb=MAX_BELGI):
    """💥 max_chars SERVERDA ishlamaydi — shuning uchun bu funksiya SHART."""
    if matn is None:
        return None, "bo'sh"
    m = matn.strip()
    if not m:
        return None, "faqat probel"        # ⭐ "   " -> rost=True tuzog'i
    if len(m) > maxb:
        return None, f"juda uzun: {len(m)}/{maxb}"
    return m, "ok"


# ---------- tarixni kesish ----------
def kes(tarix, maxs=MAX_SO_Z):
    """Oxiridan boshlab — eng yangi xabarlar muhim."""
    ch, jami = [], 0
    for x in reversed(tarix):
        n = len(x["matn"].split())
        if jami + n > maxs:
            break
        ch.append(x)
        jami += n
    return list(reversed(ch))


# ---------- "model" (66-modulda LLM bilan almashtiriladi) ----------
def baho(javob):
    n = len(javob.split())
    ball = min(10, max(1, n // 3))
    if n < 5:
        maslahat = "Javob juda qisqa — misol keltiring."
    elif n > 40:
        maslahat = "Javob uzun — asosiy fikrni oldinga chiqaring."
    else:
        maslahat = "Yaxshi hajm."
    return ball, maslahat


def oqim(matn):
    for so in matn.split():
        yield so + " "


# ---------- holat ----------
for k, v in [("tarix", []), ("indeks", 0), ("ballar", [])]:
    st.session_state.setdefault(k, v)

st.title("🎤 Ace Interview")

# ① AVVAL tarix
for x in st.session_state.tarix:
    with st.chat_message(x["rol"]):
        st.write(x["matn"])

# ② joriy savol yoki yakun
i = st.session_state.indeks
if i < len(SAVOLLAR):
    st.caption(f"Savol {i+1}/{len(SAVOLLAR)}: {SAVOLLAR[i]}")
else:
    o = sum(st.session_state.ballar) / max(1, len(st.session_state.ballar))
    st.success(f"Suhbat tugadi. O'rtacha ball: {o:.1f}/10")
    st.stop()                              # ⭐ chat_input umuman chizilmaydi

# ③ KEYIN kirish
javob = st.chat_input("Javobingiz", max_chars=MAX_BELGI)
if javob:
    toza, sabab = tekshir(javob)
    if toza is None:
        st.error(f"⚠️ Qabul qilinmadi: {sabab}")
        st.stop()                          # ⭐ modelga umuman bormaydi

    st.session_state.tarix.append({"rol": "user", "matn": toza})
    with st.chat_message("user"):
        st.write(toza)

    ball, maslahat = baho(toza)
    st.session_state.ballar.append(ball)
    javob_matn = f"Ball: {ball}/10. {maslahat}"

    st.session_state.tarix.append({"rol": "assistant", "matn": javob_matn})
    with st.chat_message("assistant"):
        yigilgan = st.write_stream(oqim(javob_matn))     # ⭐ chizadi VA qaytaradi

    st.session_state.indeks += 1
    st.session_state.tarix = kes(st.session_state.tarix)
    st.rerun()

st.caption(f"tarix: {len(st.session_state.tarix)} xabar · "
           f"ballar: {st.session_state.ballar}")
```

---

## 🔬 Sinov 1: boshlang'ich holat

```python
at = AppTest.from_string(ILOVA); at.run()
print("xato:", len(at.exception))
print("caption:", [c.value for c in at.caption])
print("chat_message:", len(at.get("chat_message")))
```

```
xato: 0
caption: ["Savol 1/3: O'zingiz haqingizda qisqacha gapirib bering.",
          'tarix: 0 xabar · ballar: []']
chat_message: 0
```

## 🔬 Sinov 2: 💥 **uchta probel**

```python
at.chat_input[0].set_value("   ").run()
print("error:", [e.value for e in at.error])
print("tarix:", len(at.session_state.tarix))
```

```
error: ['Qabul qilinmadi: faqat probel']
tarix: 0
```

> ## 🏆 **TUTILDI.** ## ⭐ Tarix **o'zgarmadi**, model **chaqirilmadi**. ## ## 💰 Haqiqiy ilovada bu — **tejalgan pul**.

## 🔬 Sinov 3: ✅ normal javob

```python
at.chat_input[0].set_value(
    "Men olti yildan beri Python bilan backend ishlab chiqaman").run()
```

```
chat_message: 2
markdown: ['Men olti yildan beri Python bilan backend ishlab chiqaman',
           'Ball: 3/10. Yaxshi hajm.']
ballar: [3]  indeks: 1
caption: ['Savol 2/3: Eng qiyin texnik muammo qaysi edi?',
          'tarix: 2 xabar · ballar: [3]']
```

> ## ⭐ **SAVOL 1/3 → 2/3 GA O'TDI,** ## `st.rerun()` dan keyin ham ## ## 🏆 **tarix DUBLIKATSIZ** — ## `chat_input` o'zini tozalagani uchun.

## 🔬 Sinov 4: 💥 **400 ta belgi** *(`max_chars=300` bo'lsa ham)*

```python
at.chat_input[0].set_value("A" * 400).run()
```

```
error: ['Qabul qilinmadi: juda uzun: 400/300']
ballar o'zgardimi: [3]
```

> ## 💥💥 **`AppTest` 400 TA BELGINI O'TKAZDI** *(5-darsdagi kashfiyot)*, ## ## 🏆 **LEKIN BIZNING `tekshir()` UNI TUTDI.**

## 🔬 Sinov 5: to'liq suhbat

```python
JAVOBLAR = [
    "Men olti yildan beri Python bilan backend ishlab chiqaman",
    "Eng qiyin muammo ma'lumotlar bazasidagi deadlock edi buni "
    "indekslarni qayta ko'rib chiqib hal qildim",
    "Ochiq gaplashaman va dalillarga tayanaman",
]
for j in JAVOBLAR:
    at.chat_input[0].set_value(j).run()
    print(f"indeks={at.session_state.indeks}  "
          f"ballar={at.session_state.ballar}  "
          f"tarix={len(at.session_state.tarix)}")
```

```
indeks=1  ballar=[3]        tarix=2
indeks=2  ballar=[3, 4]     tarix=4
indeks=3  ballar=[3, 4, 1]  tarix=6
```

```
success: ["Suhbat tugadi. O'rtacha ball: 2.7/10"]
xato: 0
chat_input bormi: 0
```

> ## 🏆🏆 **`chat_input` SONI — `0`.** ## `st.stop()` ishlagani uchun ## ⭐ **kirish maydoni umuman chizilmadi**.
>
> ## ## 💡 **VA BU — `disabled=True` DAN YAXSHIROQ:** ## foydalanuvchi **urinib ham ko'rmaydi**.

## 🔬 Sinov 6: avtomatik to'plam va tezlik

```python
t = (StreamlitSinov(ILOVA, "AceInterview to'liq")
     .boshla()
     .qadam("chat_input", 0, "set_value", JAVOBLAR[0])
     .qadam("chat_input", 0, "set_value", JAVOBLAR[1])
     .qadam("chat_input", 0, "set_value", JAVOBLAR[2])
     .xatosiz()
     .holat("indeks", 3)
     .element_soni("chat_input", 0))
t.hisobot()
print(f"boshlang'ich yuklash median: {t.tezlik():.1f} ms")
```

```
  📋 AceInterview to'liq: 3/3
    ✅ xatosiz
    ✅ session_state['indeks'] == 3
    ✅ chat_input soni == 0

boshlang'ich yuklash median: 424.8 ms
```

> ## 🏆🏆🏆 **UCHTA SAVOLLIK TO'LIQ SUHBAT — ## BRAUZERSIZ, `3/3`.**
>
> ## ## ⭐ **BU — CI/CD DA ISHLAYDI:** ## har `commit` da suhbat oqimi **tekshiriladi**.

---

## ⚠️ Halol baholash — bu prototip **nima qilmaydi**

| Yetishmayapti | Qayerda qo'shiladi |
|---|---|
| ## **Haqiqiy LLM** | ## ⭐ **66-modul** |
| Javobni **saqlash** *(brauzer yopilsa yo'qoladi)* | 15-mashq naqshi |
| `prompt injection` himoyasi | ## ⭐ **67-modul** |
| Token hisobi *(so'z emas)* | `tiktoken`, 63-modul |
| Ko'p foydalanuvchi | `cache_resource` + MB |

> ## 🔑 **`baho()` — SODDA QOIDA, MODEL EMAS:** ## u faqat **so'z sanaydi**. ## ## 💥 Shuning uchun *"Ochiq gaplashaman va dalillarga tayanaman"* ## — mazmunan **yaxshi javob** — ## **1/10** oldi.
>
> ## ## ⭐ **VA BU — ATAYLAB:** ## karkas **modelsiz ham to'liq sinaladi**. ## 66-modulda `baho()` ni ## **bitta funksiya** bilan almashtiramiz.

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md) · ➡️ [66-modul](../66-Developing-the-Prototype/README.md)
