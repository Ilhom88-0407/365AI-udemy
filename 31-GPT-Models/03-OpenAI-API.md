# 3-dars. OpenAI API

## 🎬 Boshlashdan oldin

> **"API'dan foydalanishni boshlash uchun birinchi qilishimiz kerak bo'lgan narsa — OpenAI veb-saytidan API KALITINI yaratish."**

> ## ⚠️⚠️ **DIQQAT — BU MODUL BO'YICHA MUHIM OGOHLANTIRISH.**
>
> Bu darsdan boshlab kurs **pullik OpenAI API** dan foydalanadi. Bundan tashqari, **kursdagi kod ESKIRGAN** — u ishlamaydi.
>
> ## ✅ **Bu darslikda har bir dars uchun UCHTA variant beriladi:**
> ```
> ① Kursdagi kod          →  o'qituvchi ko'rsatgani (ESKIRGAN, ishlamaydi)
> ② Zamonaviy OpenAI kodi →  bugungi to'g'ri sintaksis (pullik)
> ③ BEPUL MAHALLIY MUQOBIL →  o'z kompyuteringizda, PULSIZ  ⭐
> ```

---

## 1. API kalitini olish

> **"platform.openai.com ga o'ting va akkauntingizga kiring yoki yarating."**
>
> **"Keyin ekranning yuqori o'ng qismidagi akkaunt sozlamalariga o'ting va API kalitlarini ko'rish bo'limiga kiring."**
>
> **"Yangi maxfiy kalit yaratish tugmasini bosamiz. Keyin bu maxfiy kalitga nom berishingiz kerak."**

```
① platform.openai.com  →  ro'yxatdan o'ting
② Settings → API keys
③ "Create new secret key"
④ Nom bering (masalan: "llm-kursi")
⑤ ⚠️ KALITNI NUSXA OLING — u BOSHQA KO'RSATILMAYDI
```

> ## **"Maxfiy kalit endi biz uchun yaratildi va biz uni XAVFSIZ JOYDA saqlashimiz kerak, chunki bu safardan keyin uni QAYTA KO'RA OLMAYMIZ."**

---

## 2. ⚠️ Kalitni saqlash — kursdagi usul va XAVFSIZROQ usul

> **"Kodda API kalitingizdan foydalanish uchun siz uni TO'G'RIDAN-TO'G'RI KODGA tashlashingiz yoki KONFIGURATSIYA FAYLIGA qo'shishingiz mumkin."**
>
> **"Ba'zi tashkilotlarda bu API kalitlarini koddan yashirishning boshqa usullari ham bo'lishi mumkin."**

### 🎬 Kursdagi usul — `config.py`

```python
# config.py
api_key = "sk-proj-..."
```

```python
# notebook
import openai
import config
api_key = config.api_key
```

> ## ❌ **BU USUL XAVFLI.** `config.py` — bu **oddiy Python fayli**, va u **osongina** `git` ga tushib qoladi.

### ✅ TO'G'RI usul — muhit o'zgaruvchisi

```python
import os
api_key = os.environ.get("OPENAI_API_KEY")

if not api_key:
    raise RuntimeError(
        "OPENAI_API_KEY o'rnatilmagan!\n"
        "Windows: setx OPENAI_API_KEY \"sizning-kalitingiz\"\n"
        "Linux/Mac: export OPENAI_API_KEY=\"sizning-kalitingiz\""
    )
```

**Kalitni o'rnatish:**

```bash
setx OPENAI_API_KEY "sk-proj-sizning-kalitingiz"
```

> ⚠️ `setx` dan keyin **terminalni qayta oching** — o'zgaruvchi faqat **yangi** sessiyalarda ko'rinadi.

### 🔒 `.gitignore` — MAJBURIY

```
config.py
.env
*.key
__pycache__/
.ipynb_checkpoints/
```

> ## 💥 **NIMA UCHUN BU SHUNCHALIK MUHIM?**
>
> ```
> GitHub'da ochiq kalitlarni QIDIRADIGAN botlar bor.
> Odatda kalit yuklangandan keyin BIR NECHA DAQIQADA topiladi.
>
> Natija: sizning hisobingizdan PUL yechiladi.
> ```
>
> ## ⚠️ **VA ENG YOMONI:** `git rm config.py` **YETARLI EMAS** — kalit **tarixda** qoladi. Yagona to'g'ri yo'l: **kalitni BEKOR QILIB**, yangisini olish.

---

## 3. ⚠️⚠️ KURSDAGI KOD ESKIRGAN

O'qituvchi bu kodni ko'rsatadi:

```python
# ❌ ESKIRGAN — ISHLAMAYDI
import openai
openai.api_key = api_key
response = openai.Completion.create(model="text-davinci-002", prompt=prompt)
```

> ## ❌ **BU KOD BUGUN XATO BERADI.**
>
> ```
> openai v1.0 (2023-yil noyabr) da:
>    · openai.Completion.create      →  OLIB TASHLANDI
>    · openai.ChatCompletion.create  →  OLIB TASHLANDI
>    · openai.api_key = ...          →  OLIB TASHLANDI
>
> Va model:
>    · text-davinci-002/003          →  BUTUNLAY YOPILDI (2024-yil yanvar)
> ```

### ✅ ZAMONAVIY sintaksis

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

javob = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Once upon a time"}],
    max_tokens=50,
    temperature=0.7,
)
print(javob.choices[0].message.content)
```

### 📋 Eski → yangi jadval

| Kursdagi *(eski)* | Bugungi *(to'g'ri)* |
|---|---|
| `openai.api_key = k` | `client = OpenAI(api_key=k)` |
| `openai.Completion.create(...)` | `client.chat.completions.create(...)` |
| `openai.ChatCompletion.create(...)` | `client.chat.completions.create(...)` |
| `prompt="..."` | `messages=[{"role":"user","content":"..."}]` |
| `response.choices[0].text` | `javob.choices[0].message.content` |
| `text-davinci-002` | `gpt-4o-mini` *(yoki yangiroq)* |

> ## 💡 **Bu — kursning aybi emas.** U 2023-yilda yozilgan, OpenAI esa API'ni **2023-yil oxirida** butunlay o'zgartirdi. Lekin **siz buni bilishingiz kerak**, aks holda kodni ko'chirib xato olasiz.

---

## 4. 💰 Narx

> **"Narxlar haqida qisqacha eslatma. OpenAI bu API orqali bizga taqdim etadigan turli modellar TURLI NARXDA keladi."**
>
> ## **"Narxlar HAR 1000 TOKEN uchun belgilanadi."**
>
> **"Albatta, qimmatroq modellar — bu yangiroq modellar."**

```
⚠️ NARXLAR DOIM O'ZGARADI — rasmiy sahifani tekshiring:
   platform.openai.com/docs/pricing
```

### 🇺🇿 O'zbek tili uchun MUHIM ogohlantirish

30-modulda o'lchagandik:

```
o'zbekcha matn  →  ingliz matnidan ~2 BARAVAR ko'p token
                        ↑
        Narx TOKEN bo'yicha  →  IKKI BARAVAR QIMMAT
```

```python
from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained(
    "distilbert-base-uncased-finetuned-sst-2-english")

en = "This book is very interesting and I recommend it to everyone"
uz = "Bu kitob juda qiziqarli va men uni hammaga tavsiya qilaman"
print(f"ingliz: {len(tok.encode(en)):3d} token")
print(f"o'zbek: {len(tok.encode(uz)):3d} token")
```

```
ingliz:  13 token
o'zbek:  25 token
```

> ## 💡 **Bir xil ma'noli jumla — 1.9 baravar qimmat.** Bu — o'zbek tilida LLM ishlatishning **yashirin narxi**.

---

## 5. ⭐⭐ BEPUL MAHALLIY MUQOBIL

**API kaliti yo'qmi? Muammo emas.** Bu darslikdagi **hamma narsa** mahalliy modellarda ham ko'rsatiladi.

```bash
pip install transformers torch
```

### Ikkita bepul model bilan tanishing

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import (AutoTokenizer, AutoModelForCausalLM,
                          AutoModelForSeq2SeqLM)

# ① distilgpt2 — MATN DAVOM ETTIRADI (GPT kabi)
gpt_tok = AutoTokenizer.from_pretrained("distilgpt2")
gpt = AutoModelForCausalLM.from_pretrained("distilgpt2")

# ② flan-t5-small — KO'RSATMAGA AMAL QILADI (ChatGPT kabi)
t5_tok = AutoTokenizer.from_pretrained("google/flan-t5-small")
t5 = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")

print("distilgpt2   :", f"{sum(p.numel() for p in gpt.parameters()):,}")
print("flan-t5-small:", f"{sum(p.numel() for p in t5.parameters()):,}")
```

```
distilgpt2   : 81,912,576
flan-t5-small: 76,961,152
```

### 🔑 Ikkalasining FARQI — bu 2-darsdagi GPT vs ChatGPT farqi!

```python
def gpt_yarat(matn, mx=20):
    e = gpt_tok(matn, return_tensors="pt")
    with torch.no_grad():
        o = gpt.generate(**e, max_new_tokens=mx, do_sample=False,
                         pad_token_id=gpt_tok.eos_token_id)
    return gpt_tok.decode(o[0], skip_special_tokens=True)


def t5_javob(korsatma, mx=50):
    e = t5_tok(korsatma, return_tensors="pt")
    with torch.no_grad():
        o = t5.generate(**e, max_new_tokens=mx)
    return t5_tok.decode(o[0], skip_special_tokens=True)


print("distilgpt2  :", repr(gpt_yarat("Translate English to French: The book was very interesting")))
print("flan-t5     :", repr(t5_javob("Translate English to French: The book was very interesting")))
```

```
distilgpt2  : 'Translate English to French: The book was very interesting. I was very impressed with the book. I was very impressed with the book. I was very'
flan-t5     : 'Le livre était très intéressant.'
```

> ## 💥 **MANA FARQ — VA U JUDA KATTA.**
>
> ```
> distilgpt2  →  ko'rsatmani MATN deb qabul qildi va uni DAVOM ETTIRDI  ❌
>                (va yana o'zini TAKRORLAB qoldi)
> flan-t5     →  ko'rsatmaga AMAL QILDI va TARJIMA qildi                 ✅
>                (fransuzcha, grammatik TO'G'RI)
> ```
>
> `distilgpt2` "Translate English to French:" iborasini **buyruq** deb tushunmadi — u buni shunchaki **davom ettiriladigan matn** deb qabul qildi va inglizcha gap yozdi.
>
> ## 🔑 **Ikkalasi ham ~80 million parametr. Farq — HAJMDA EMAS, SOZLASHDA.**
>
> `flan-t5` **ko'rsatmalarga amal qilishga** sozlangan *(instruction-tuned)* — bu aynan **ChatGPT** ni GPT'dan ajratib turadigan narsa *(2-dars)*.

---

## 6. ⚠️ Mahalliy modelning CHEKLOVLARI — halol ko'rsatamiz

`flan-t5-small` ni **to'rtta** vazifada sinadik:

```python
sinovlar = [
    "Extract keywords from this text: A flying saucer landed near the "
    "guest house in Roswell in 1947 and witnesses reported strange lights in the sky.",
    "Answer the question: When was Google founded?",
    "Summarize: Sri Lanka is an island country in South Asia known for its tea, "
    "beaches and ancient temples. It has a population of 22 million people.",
    "Translate English to French: The book was very interesting",
]
for s in sinovlar:
    print(">>>", s[:62])
    print("   ", t5_javob(s))
```

```
>>> Extract keywords from this text: A flying saucer landed near the
    light, witness, witness

>>> Answer the question: When was Google founded?
    1897

>>> Summarize: Sri Lanka is an island country in South Asia known for
    Sri Lanka has a population of 74,269 people, compared to the rest of the world.

>>> Translate English to French: The book was very interesting
    Le livre était très intéressant.
```

### 📊 Halol baho

| Vazifa | Natija | Baho |
|---|---|---|
| 🌍 **Tarjima** | `Le livre était très intéressant.` | ## ✅ **MUKAMMAL** |
| 🏷️ **Kalit so'zlar** | `light, witness, witness` | ⚠️ Qisman *(takrorlanadi, "flying saucer" yo'q)* |
| ❓ **Fakt** | Google → **1897** | ## ❌ **XATO** *(aslida 1998)* |
| 📄 **Xulosa** | *"74,269 people"* | ## ❌❌ **FALOKAT** |

### 💥 To'rtinchi qatorga ALOHIDA e'tibor bering

```
MATNDA YOZILGAN:  "a population of 22 million people"
MODEL AYTDI    :  "a population of 74,269 people"
                              ↑
        JAVOB PROMPTNING O'ZIDA EDI — model baribir O'YLAB TOPDI
```

> ## 🔑 **BU — GALLYUTSINATSIYANING ENG XAVFLI TURI.**
>
> Model **berilgan matnga ZID** ma'lumot chiqardi. U matnni **o'qidi**, lekin **o'z "xotirasidan"** son to'qib qo'shdi.
>
> ## ⚠️ **AMALIY XULOSA:**
> ```
> ✅ ISHLATING:  tarjima · uslub · struktura · format
> ❌ ISHLATMANG: faktlar · sonlar · sanalar · ismlar
>
> Har qanday SONNI natijadan olishdan oldin — MANBADA tekshiring.
> ```
>
> ## 💡 **Va bu KATTA modellarda ham yo'qolmaydi** — faqat **kamayadi**. GPT-4 ham gallyutsinatsiya qiladi. 27-moduldagi **tekshirish odati** — LLM davrida **majburiy**.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** API kalitini qayerdan olasiz?

**M2.** Kalitni saqlashning eng xavfsiz usuli?

**M3.** Narx nima bo'yicha hisoblanadi?

<details>
<summary>✅ Javoblar</summary>

**M1.** `platform.openai.com` → Settings → API keys → *"Create new secret key"*.

**M2.** ## **Muhit o'zgaruvchisi** — `os.environ.get("OPENAI_API_KEY")`. Va `.gitignore` ga `config.py`, `.env` ni qo'shish.

**M3.** ## **Har 1000 token** uchun.

</details>

### 🟡 O'rta

**M4.** ⭐ Kursdagi kod nima uchun ishlamaydi? Uchta o'zgarishni ayting.

**M5.** ⭐ 🇺🇿 O'zbekcha matn nima uchun qimmatroq?

<details>
<summary>✅ Javoblar</summary>

**M4.**
```
① openai.Completion.create      →  client.chat.completions.create
② openai.api_key = k            →  client = OpenAI(api_key=k)
③ prompt="..."                  →  messages=[{"role":"user",...}]

+ text-davinci-002 modeli BUTUNLAY YOPILDI (2024-yil yanvar)
```
> `openai` paketi **v1.0** da *(2023-yil noyabr)* butunlay qayta yozildi.

**M5.** Narx **token** bo'yicha, o'zbekcha matn esa **~2 baravar ko'p** token oladi *(30-modul: `o'zbekiston` → 6 token, `uzbekistan` → 1 token)*.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Kalit xavfsizligini tekshiruvchi skript yozing.

<details>
<summary>✅ Yechim</summary>

```python
import os
import re
from pathlib import Path

NAQSHLAR = [
    (r"sk-[A-Za-z0-9_\-]{20,}", "OpenAI API kaliti"),
    (r"AKIA[0-9A-Z]{16}",       "AWS kaliti"),
    (r"ghp_[A-Za-z0-9]{36}",    "GitHub tokeni"),
    (r"AIza[0-9A-Za-z_\-]{35}", "Google API kaliti"),
]


def kalit_qidir(papka=".", kengaytmalar=(".py", ".ipynb", ".md", ".txt",
                                         ".json", ".yaml", ".yml", ".env")):
    topildi = []
    for f in Path(papka).rglob("*"):
        if not f.is_file() or f.suffix not in kengaytmalar:
            continue
        if any(x in f.parts for x in (".git", "__pycache__", "node_modules")):
            continue
        try:
            matn = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for naqsh, nom in NAQSHLAR:
            for m in re.finditer(naqsh, matn):
                qator = matn[:m.start()].count("\n") + 1
                topildi.append({"fayl": str(f), "qator": qator, "tur": nom})

    if topildi:
        print(f"🚨 {len(topildi)} ta MUMKIN BO'LGAN KALIT TOPILDI!\n")
        for t in topildi:
            print(f"   {t['fayl']}:{t['qator']}  →  {t['tur']}")
        print("\n⚠️ AGAR BU HAQIQIY KALIT BO'LSA:")
        print("   ① Kalitni DARHOL BEKOR QILING (rasmiy saytda)")
        print("   ② Yangi kalit oling")
        print("   ③ .gitignore ni to'g'rilang")
        print("   ⚠️ git rm YETARLI EMAS — kalit TARIXDA qoladi")
    else:
        print("✅ Ochiq kalit topilmadi.")
    return topildi


def gitignore_tekshir(papka="."):
    g = Path(papka) / ".gitignore"
    kerak = {"config.py", ".env", "*.key", "__pycache__/"}
    if not g.exists():
        print("❌ .gitignore FAYLI YO'Q!")
        return
    bor = set(g.read_text(encoding="utf-8").split())
    yetishmayotgan = kerak - bor
    print("✅ .gitignore to'liq" if not yetishmayotgan
          else f"⚠️ .gitignore da yetishmaydi: {yetishmayotgan}")


kalit_qidir()
gitignore_tekshir()
```

> ## 🔑 **Bu skriptni HAR SAFAR `git push` dan OLDIN ishlating.**
>
> 💡 Yaxshiroq yechim — **pre-commit hook**: skript **avtomatik** ishga tushadi va kalit topilsa commit'ni **to'xtatadi**.
>
> ⚠️ **Diqqat:** skript `.ipynb` fayllarni ham tekshiradi — Jupyter noutbuklar **chiqish natijalarida** ham kalit saqlab qolishi mumkin, bu esa juda tez-tez unutiladi.

</details>

---

## 🧠 O'zini tekshirish savollari

1. API kalitini nima uchun qayta ko'rib bo'lmaydi?
2. Kursdagi kod nima uchun ishlamaydi?
3. `client.chat.completions.create` da xabar formati qanday?
4. `flan-t5` va `distilgpt2` farqi nimada?
5. Model manbadagi songa zid javob berdi — bu nima deyiladi?

<details>
<summary>✅ Javoblar</summary>

1. **Xavfsizlik uchun** — OpenAI kalitni faqat **bir marta** ko'rsatadi, keyin uni **hech kim** *(hatto OpenAI ham)* ko'ra olmaydi.
2. `openai` paketi **v1.0** da *(2023-yil noyabr)* qayta yozildi; `text-davinci-*` modellari **2024-yil yanvarda yopildi**.
3. `messages=[{"role": "user", "content": "..."}]` — ro'yxat ichida lug'atlar.
4. `distilgpt2` — matnni **davom ettiradi**; `flan-t5` — **ko'rsatmaga amal qiladi** *(instruction-tuned)*. Bu — GPT vs ChatGPT farqining kichik nusxasi.
5. ## **GALLYUTSINATSIYA** — model ishonch bilan **noto'g'ri** ma'lumot chiqarishi. Bu holda u **berilgan matnga zid** javob berdi *(22 million → 74,269)*.

</details>

---

## 📌 Xulosa

```
API KALITI
  platform.openai.com → Settings → API keys → Create new secret key
  ⚠️ FAQAT BIR MARTA ko'rsatiladi

  ❌ config.py           →  git ga tushib qoladi
  ✅ os.environ.get()    →  TO'G'RI YO'L
  ✅ .gitignore          →  MAJBURIY
  ⚠️ git rm YETARLI EMAS —  kalitni BEKOR QILING


⚠️ KURSDAGI KOD ESKIRGAN (openai v1.0, 2023-noyabr)

  ESKI                            YANGI
  openai.api_key = k              client = OpenAI(api_key=k)
  openai.Completion.create()      client.chat.completions.create()
  prompt="..."                    messages=[{"role":"user",...}]
  response.choices[0].text        javob.choices[0].message.content
  text-davinci-002                gpt-4o-mini
      ↑
  BUTUNLAY YOPILGAN (2024-yanvar)


💰 NARX — har 1000 TOKEN uchun
  🇺🇿 o'zbekcha matn ~2× ko'p token  →  ~2× QIMMAT


⭐ BEPUL MAHALLIY MUQOBIL
  distilgpt2     81,912,576   matnni DAVOM ETTIRADI  (GPT kabi)
  flan-t5-small  76,961,152   KO'RSATMAGA amal qiladi (ChatGPT kabi)

  Bir xil hajm — FARQ SOZLASHDA


⚠️ MAHALLIY MODEL CHEKLOVLARI (o'lchangan)
  ✅ tarjima     "Le livre était très intéressant."   MUKAMMAL
  ⚠️ kalit so'z  "light, witness, witness"            qisman
  ❌ fakt        Google → 1897  (aslida 1998)
  ❌❌ xulosa     "74,269 people"  (matnda 22 MILLION!)
                        ↑
       JAVOB PROMPTDA EDI — model baribir O'YLAB TOPDI

  🔑 ISHLATING: tarjima · uslub · struktura
     ISHLATMANG: fakt · son · sana · ism
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| API kaliti | *API key* | Xizmatga kirish uchun maxfiy kod |
| Muhit o'zgaruvchisi | *environment variable* | Tizim darajasidagi sozlama |
| Token | *token* | Narx va uzunlik birligi |
| Instruction-tuned | *instruction-tuned* | Ko'rsatmaga amal qilishga sozlangan |
| Gallyutsinatsiya | *hallucination* | Ishonch bilan noto'g'ri javob |

---

⬅️ [Oldingi: ChatGPT rivojlanishi](02-The-Development-of-ChatGPT.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Matn yaratish](04-Generating-Text.md)
