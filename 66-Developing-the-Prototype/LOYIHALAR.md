# 🚀 66-modul. Mini-loyihalar

> **Ikkita loyiha.** Ikkalasi ham **ishga tushirilgan va tekshirilgan**.
> **Kalit kerak emas** — 1-darsdagi `MahalliyMijoz` adapteri.

---

# 🎤 1-loyiha. `AceInterviewPro` — kursning ilovasi, **tuzatilgan**

**Muammo:** kursning `app.py` si ishlaydi, lekin **oltita** kamchiligi bor. Biz hammasini bitta ilovada tuzatamiz — va uni **brauzersiz** sinaymiz.

| Kamchilik | Dars | Tuzatish |
|---|---|---|
| Forma validatsiyasi yo'q | 3 | ## `forma_tekshir()` + `disabled=` |
| ## **5-xabar javobsiz** | ## 6 | ## `count < CHEGARA` **bitta shart** |
| `"   "` o'tib ketadi | 5 | ## `matn.strip()` |
| ## **Prompt injection** | ## 7 | ## `shubhali()` regex filtri |
| Fikr-mulohaza matn shaklida | 7 | ## **JSON + few-shot** |
| Tizim prompti baholovchiga | 7 | ## `if m["role"] != "system"` |

```python
import streamlit as st, re, json

CHEGARA   = 3
MAX_JAVOB = 1000
LIMITLAR  = {"name": 40, "experience": 200, "skills": 200}

NAQSHLAR = [r"ignore\s+(all\s+)?previous", r"disregard\s+(all\s+)?(previous|prior)",
            r"you\s+are\s+now\s+a", r"^\s*system\s*:",
            r"overal?l?\s+score\s*:", r"new\s+instructions?"]


def shubhali(m):
    return [n for n in NAQSHLAR if re.search(n, m, re.I | re.M)]


def forma_tekshir(s):
    x = []
    if not s.get("name", "").strip():
        x.append("Ism kiritilmagan")
    if len(s.get("experience", "").strip()) < 10:
        x.append("Tajriba juda qisqa (kamida 10 belgi)")
    if len(s.get("skills", "").strip()) < 3:
        x.append("Ko'nikmalar kiritilmagan")
    return x


def hr_prompt(s):
    return (f"You are an HR executive interviewing {s['name']}, "
            f"who has experience: {s['experience']}, and skills: {s['skills']}. "
            f"Interview this candidate for the {s['level']} {s['position']} "
            f"role at {s['company']}. Ask one question at a time.")


def json_ol(matn, standart=None):
    m = re.search(r"\{.*\}", matn or "", re.S)
    if not m:
        return standart, "JSON topilmadi"
    try:
        d = json.loads(m.group(0))
    except json.JSONDecodeError as e:
        return standart, f"parse xato: {e.msg}"
    if not isinstance(d.get("score"), int) or not 1 <= d["score"] <= 10:
        return standart, f"ball noto'g'ri: {d.get('score')!r}"
    return d, "ok"


def himoyalangan(gen):
    try:
        yield from gen
    except Exception as e:
        yield f"\n\n[Javob uzildi: {e}]"
```

### ⭐ Holat — **bitta joyda**

```python
for k, v in [("setup_complete", False), ("count", 0), ("messages", []),
             ("chat_complete", False), ("feedback_shown", False),
             ("bloklangan", 0), ("name", ""), ("experience", ""),
             ("skills", ""), ("level", "Junior"),
             ("position", "Data Scientist"), ("company", "Amazon")]:
    st.session_state.setdefault(k, v)


def sozlash_tugadi(): st.session_state.setup_complete = True
def fikr_korsat():    st.session_state.feedback_shown = True
```

### ① Sozlash — **validatsiya bilan**

```python
if not st.session_state.setup_complete:
    st.subheader("Shaxsiy ma'lumot", divider="rainbow")
    st.session_state["name"] = st.text_input(
        "Ism", value=st.session_state["name"], max_chars=LIMITLAR["name"])
    st.session_state["experience"] = st.text_area(
        "Tajriba", value=st.session_state["experience"],
        max_chars=LIMITLAR["experience"])
    st.session_state["skills"] = st.text_area(
        "Ko'nikmalar", value=st.session_state["skills"],
        max_chars=LIMITLAR["skills"])

    st.subheader("Kompaniya va lavozim", divider="rainbow")
    c1, c2 = st.columns(2)
    with c1:
        st.radio("Daraja", ["Junior", "Mid-level", "Senior"], key="level")
    with c2:
        st.selectbox("Lavozim", ["Data Scientist", "ML Engineer", "BI Analyst"],
                     key="position")
    st.selectbox("Kompaniya", ["Amazon", "Spotify", "Udemy"], key="company")

    xatolar = forma_tekshir(st.session_state)
    st.button("Intervyuni boshlash", on_click=sozlash_tugadi,
              disabled=bool(xatolar))          # ⭐ TO'LDIRILMASA — BOSILMAYDI
    for x in xatolar:
        st.warning(x)
```

> ## ⭐ **E'TIBOR BERING — `key="level"`,** ## kursdagi `key="visibility"` emas. ## ## 🔑 4-darsda o'lchagan edik: ## `key=` o'zi holatni saqlaydi, ## **nusxa ham, `index=` ham kerak emas**.

### ② Suhbat — **to'rt qavatli himoya**

```python
if (st.session_state.setup_complete and not st.session_state.chat_complete
        and not st.session_state.feedback_shown):
    st.info("O'zingiz haqingizda gapirib bering", icon="👋")

    if not st.session_state.messages:
        st.session_state.messages = [
            {"role": "system", "content": hr_prompt(st.session_state)}]

    for m in st.session_state.messages:
        if m["role"] != "system":
            with st.chat_message(m["role"]):
                st.markdown(m["content"])

    tugadi = st.session_state.count >= CHEGARA
    if (p := st.chat_input("Javobingiz", max_chars=MAX_JAVOB,
                           disabled=tugadi)) is not None:
        matn = p.strip()
        if not matn:                                    # ① bo'sh
            st.warning("Bo'sh javob qabul qilinmaydi"); st.stop()
        if len(matn) > MAX_JAVOB:                       # ② uzunlik (SERVER)
            st.error(f"Juda uzun: {len(matn)}/{MAX_JAVOB}"); st.stop()
        if shubhali(matn):                              # ③ injection
            st.session_state.bloklangan += 1
            st.error("Javobda ko'rsatmaga o'xshash matn topildi. Qayta yozing.")
            st.stop()

        st.session_state.messages.append({"role": "user", "content": matn})
        with st.chat_message("assistant"):
            r = st.write_stream(himoyalangan(                # ④ oqim himoyasi
                client.chat.completions.create(
                    model="x", messages=st.session_state.messages, stream=True)))
        st.session_state.messages.append({"role": "assistant", "content": r})

        st.session_state.count += 1
        if st.session_state.count >= CHEGARA:
            st.session_state.chat_complete = True
        st.rerun()
```

> ## 🏆 **BITTA `if count < CHEGARA` — IKKITA EMAS.** ## Kursning `< 5` / `< 4` juftligi ## 💥 **oxirgi javobni javobsiz** qoldirar edi.

### ③ ④ Fikr-mulohaza — **JSON + few-shot**

```python
if st.session_state.chat_complete and not st.session_state.feedback_shown:
    st.button("Fikr-mulohaza olish", on_click=fikr_korsat)

if st.session_state.feedback_shown:
    st.subheader("Fikr-mulohaza")
    tarix = "\n".join(f"{m['role']}: {m['content']}"
                      for m in st.session_state.messages
                      if m["role"] != "system")           # ⭐ TIZIM PROMPTI EMAS

    FB = ('You are an interview evaluator. Return ONLY valid JSON.\n'
          'Format: {"score": <int 1-10>, "feedback": "<2 sentences>"}\n\n'
          'Example:\nInterview: user: I use Python daily.\n'
          'Output: {"score": 5, "feedback": "The answer is brief."}')

    r = client.chat.completions.create(model="x", messages=[
        {"role": "system", "content": FB},
        {"role": "user", "content": f"<transcript>\n{tarix}\n</transcript>"}])

    d, holat = json_ol(r.choices[0].message.content)
    if d:
        st.metric("Ball", f"{d['score']}/10")
        st.write(d["feedback"])
    else:
        st.error(f"Fikr-mulohaza o'qilmadi: {holat}")

    st.caption(f"bloklangan javoblar: {st.session_state.bloklangan}")
    if st.button("Qayta boshlash", type="primary"):
        st.session_state.clear()                          # ⭐ js_eval SIZ
        st.rerun()
```

---

## 🔬 Uchdan uchga sinov — **brauzersiz**

```python
at = AppTest.from_string(APP); at.run()
```

### ✅ Haqiqiy natija

```
① bo'sh forma
   xato: 0
   tugma o'chirilgan: True
   ogohlantirishlar: ['Ism kiritilmagan',
                      'Tajriba juda qisqa (kamida 10 belgi)',
                      "Ko'nikmalar kiritilmagan"]

② forma to'ldiriladi
   tugma o'chirilgan: False
   ogohlantirishlar: []

③ intervyu boshlanadi
   SYSTEM: You are an HR executive interviewing Alex, who has experience:
           2 yil Data Scientist sifatida, a ...
   info: ["O'zingiz haqingizda gapirib bering"]

④ 💥 bo'sh javob
   warning: ["Bo'sh javob qabul qilinmaydi"]   count: 0

⑤ 💥 prompt injection
   error: ["Javobda ko'rsatmaga o'xshash matn topildi. Qayta yozing."]
   count: 0   bloklangan: 1

⑥ ✅ normal javoblar
   count=1  chat_complete=False  button=[]
   count=2  chat_complete=False  button=[]
   count=3  chat_complete=True   button=['Fikr-mulohaza olish']

⑦ fikr-mulohaza
   subheader: ['Fikr-mulohaza']
   metric: [('Ball', '7/10')]
   markdown: ["Yaxshi javoblar. Aniq misol qo'shing."]
   caption: ['bloklangan javoblar: 1']
   xato: 0

⑧ qayta boshlash
   button: ['Intervyuni boshlash']
   setup_complete: False
   xato: 0

⑨ ⏱ boshlang'ich yuklash median: 462.6 ms
```

> ## 🏆🏆🏆 **SAKKIZ BOSQICH — XATOSIZ.**
>
> ## ⭐ ① validatsiya **tutdi** ## ⭐ ④ bo'sh javob **tutildi** ## ⭐ ⑤ injection **tutildi**, `count` **o'zgarmadi** ## ⭐ ⑥ uchta javobga **uchta javob** ## ⭐ ⑦ JSON **o'qildi**, ball **7/10** ## ⭐ ⑧ qayta boshlash **kutubxonasiz**

> ## 💡 **VA E'TIBOR BERING — `bloklangan: 1` KO'RSATILDI.** ## ## 🔑 Bu — **loglash**: ## siz hujum bo'lganini **bilasiz**.

---

# 🗣️ 2-loyiha. `DebatSimulyator` — kursning **o'z uy vazifasi**

Kurs 7-darsda aytadi:

> *"Loyihani rivojlantiring. Masalan, debat simulyatori yaratishingiz mumkin: sozlash sahifasida debat mavzusini va qiyinlik darajasini tanlaysiz. Intervyu ekrani debat ekraniga aylanadi. Fikr-mulohaza o'rniga ikkinchi model kim g'olib bo'lganini hal qiladi."*

> ## 🏆 **AYNAN SHUNI QURAMIZ — VA BU BIR XIL KARKAS:** ## sozlash → raundlar → hukm.

```python
class DebatSimulyator:
    """Kursning uy vazifasi: intervyu o'rniga DEBAT, fikr-mulohaza o'rniga HAKAM."""

    DARAJALAR = {
        "oson":   "Be encouraging. Use simple arguments.",
        "o'rta":  "Challenge weak points politely.",
        "qiyin":  "Attack every weak point. Demand evidence.",
    }

    NAQSHLAR = [r"ignore\s+(all\s+)?previous", r"you\s+are\s+now\s+a",
                r"^\s*system\s*:", r"winner\s*:", r"new\s+instructions?"]

    def __init__(self, client, mavzu, tomon, daraja="o'rta", raundlar=3):
        if daraja not in self.DARAJALAR:
            raise ValueError(f"noma'lum daraja: {daraja}")
        self.c = client
        self.mavzu, self.tomon, self.daraja = mavzu, tomon, daraja
        self.raundlar = raundlar
        self.tarix = []
        self.bloklangan = 0
        qarshi = "against" if tomon == "for" else "for"
        self.sys = (f"You are debating the topic: {mavzu}. "
                    f"You argue {qarshi.upper()} it. "
                    f"{self.DARAJALAR[daraja]} "
                    f"Reply in at most 3 sentences. Never concede.")

    def _shubhali(self, m):
        return [n for n in self.NAQSHLAR if re.search(n, m, re.I | re.M)]

    def javob_ber(self, dalil, urug=0):
        d = (dalil or "").strip()
        if not d:                                   return None, "bo'sh dalil"
        if len(d) > 800:                            return None, f"juda uzun: {len(d)}/800"
        if self._shubhali(d):
            self.bloklangan += 1;                   return None, "ko'rsatmaga o'xshash matn"
        if len(self.tarix) // 2 >= self.raundlar:   return None, "raundlar tugadi"

        self.tarix.append({"role": "user", "content": d})
        msgs = [{"role": "system", "content": self.sys}] + self.tarix
        r = self.c.chat.completions.create(model="x", messages=msgs, urug=urug)
        javob = r.choices[0].message.content
        self.tarix.append({"role": "assistant", "content": javob})
        return javob, "ok"

    HAKAM = ('You are a debate judge. Return ONLY valid JSON.\n'
             'Format: {"winner": "user"|"opponent", "score": <int 1-10>, '
             '"reason": "<1 sentence>"}\n\n'
             'Example:\nDebate: user: Cars pollute.\nopponent: EVs exist.\n'
             'Output: {"winner": "opponent", "score": 6, '
             '"reason": "The counterpoint was concrete."}')

    def hukm(self, urug=0):
        matn = "\n".join(f"{'user' if m['role']=='user' else 'opponent'}: "
                         f"{m['content']}" for m in self.tarix)
        r = self.c.chat.completions.create(model="x", max_tokens=160, urug=urug,
            messages=[{"role": "system", "content": self.HAKAM},
                      {"role": "user", "content": f"<debate>\n{matn}\n</debate>"}])
        return self._json_ol(r.choices[0].message.content)

    @staticmethod
    def _json_ol(matn):
        m = re.search(r"\{.*?\}", matn or "", re.S)
        if not m:
            return None, "JSON topilmadi"
        try:
            d = json.loads(m.group(0))
        except json.JSONDecodeError as e:
            return None, f"parse xato: {e.msg}"
        if d.get("winner") not in ("user", "opponent"):
            return None, f"winner noto'g'ri: {d.get('winner')!r}"
        if not isinstance(d.get("score"), int) or not 1 <= d["score"] <= 10:
            return None, f"ball noto'g'ri: {d.get('score')!r}"
        return d, "ok"
```

---

## 🔬 Haqiqiy debat — **mahalliy model bilan**

```python
d = DebatSimulyator(client, "Remote work is better than office work",
                    tomon="for", daraja="qiyin", raundlar=3)
```

### ✅ Haqiqiy natija

```
model yuklandi: 2.9 s

SYSTEM: You are debating the topic: Remote work is better than office work.
        You argue AGAINST it. Attack every weak point. Demand evidence.
        Reply in at most 3 sentences. Never concede.

raund 1 [ok]
  men : Remote work removes commuting, which saves 1-2 hours every day.
  bot : While remote work can indeed save time by eliminating the need for
        daily commutes to and from the workplace, this alone does not justify
        the additiona...

raund 2 [ok]
  men : Studies show remote workers report higher job satisfaction.
  bot : Research has consistently shown that remote workers often report higher
        levels of job satisfaction compared to their office counterparts...

raund 3 [ok]
  men : Companies also save money on office space and utilities.
  bot : In many cases, companies do save money through the use of remote work
        arrangements...
```

> ## 💥💥 **VA MANA HALOL BAHO — MODEL POZITSIYASINI TASHLAB KETDI.**
>
> ## Promptda **`Never concede`** yozilgan edi. ## ## 💥 2-raundda: *"Research has **consistently shown** that remote workers ## **often report higher** levels of job satisfaction"* — ## ⭐ bu **rozilik**, e'tiroz emas. ## ## 💥 3-raundda: *"companies **do save money**"* — ## yana **rozilik**.

> ## 🔑 **SABAB — MODEL HAJMI.** ## `Qwen2.5-0.5B` — **494 mln parametr**. ## Uzoq muddatli pozitsiyani ushlab turish ## ⭐ **katta model** ishi.
>
> ## ## 💡 **YECHIM YO'LLARI:** ## ① har raundda tizim promptini **takrorlash**, ## ② javobni **tekshirish** *(rozilik so'zlari bormi?)*, ## ③ **katta model**.

---

## 🔬 Himoya sinovlari

```
bo'sh              -> bo'sh dalil
juda uzun          -> juda uzun: 900/800
injection          -> ko'rsatmaga o'xshash matn
chegaradan keyin   -> raundlar tugadi
bloklangan: 1
```

> ## 🏆 **TO'RTTA HOLAT — TO'RTTASI HAM TUTILDI.**

## 🔬 Hakam hukmi — **uch marta**

```
urug=0: [ok] {'winner': 'opponent', 'score': 8, 'reason': 'The opponent provides
             a balanced perspective, acknowledging both the positive aspects...'}
urug=1: [ok] (bir xil)
urug=2: [ok] (bir xil)
```

> ## 🏆 **JSON 3/3 — few-shot ishladi** *(7-dars: few-shotsiz 0/5)*.
>
> ## ## ⭐ **VA NATIJA BARQAROR:** ## `do_sample=False` bilan uchala urug' ham ## **bir xil** javob berdi.

> ## ⚠️ **LEKIN HAKAM `opponent` NI TANLADI** — ## chunki bot **rozi bo'lib ketgan** edi, ## ya'ni "muvozanatli" ko'rindi. ## ## 💥 Bu — yuqoridagi muammoning **oqibati**.

---

## 🔬 Uchta qiyinlik darajasi — **farq bormi?**

Birinchi qarashda javoblar **bir xil** ko'rindi. Shuning uchun **o'lchadim**.

```python
import difflib

for i in range(3):
    for j in range(i + 1, 3):
        r = difflib.SequenceMatcher(None, out[ks[i]], out[ks[j]]).ratio()
        print(f"{ks[i]} vs {ks[j]}: {r:.3f}")
```

### ✅ Haqiqiy natija

```
O'XSHASHLIK (difflib ratio):
  oson   vs o'rta : 0.437
  oson   vs qiyin : 0.366
  o'rta  vs qiyin : 0.470

UZUNLIK:
  oson  : 521 belgi
  o'rta : 394 belgi
  qiyin : 249 belgi
```

> ## 🔧 **MEN "DARAJALAR ISHLAMAYAPTI" DEB O'YLAGAN EDIM** — ## chunki **birinchi 120 belgi** deyarli bir xil edi.
>
> ## ## 💥 **O'LCHOV BUNI RAD ETDI:** ## o'xshashlik atigi **0.37–0.47**, ## va uzunlik ## ⭐ **521 → 394 → 249** ga **tushdi**.

> ## 🏆 **YA'NI "qiyin" DARAJA HAQIQATAN ## QISQAROQ VA KESKINROQ JAVOB BERADI.**
>
> ## ## 💡 **VA BU — UMUMIY DARS:** ## ⚠️ **matnning boshiga qarab xulosa chiqarmang.** ## ⭐ Farqni **o'lchang**.

---

## ⚠️ Halol baho — bu loyihalar **nima qilmaydi**

| Yetishmayapti | Qayerda |
|---|---|
| ## **Prompt injection to'liq himoyasi** | ## ⭐ **67-modul** |
| Gallyutsinatsiya tekshiruvi | ## ⭐ **67-modul** |
| Ko'p foydalanuvchi / MB | 63-modul naqshlari |
| ## **Katta model** *(pozitsiya ushlash)* | API kaliti kerak |
| Deploy | 9-dars *(HF Spaces)* |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md) · ➡️ [67-modul](../67-Solving-Real-World-Challenges/README.md)
