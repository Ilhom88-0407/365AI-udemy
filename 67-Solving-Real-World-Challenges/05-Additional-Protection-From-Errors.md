# 5-dars. Xatolardan qo'shimcha himoya ⭐⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: 'har 20 intervyudan 1 tasida buzuq JSON'. Bizning kichik modelimizda — 12 dan 12 tasi. Lekin sabab kutilganidan boshqa chiqdi, va yechim ikki qatordan iborat bo'ldi."**

---

## 1. Kurs nima topgan

> *"Keng qamrovli sinovlar va ko'plab prompt iteratsiyalaridan so'ng, biz taxminan **har 20 intervyudan 1 tasida** xato yuz berishini aniqladik. Xususan, xato LLM tomonidan yaratilgan **buzuq yoki noto'g'ri JSON** bilan bog'liq edi."*

| Xato qayerda | Nega |
|---|---|
| ## Savol generatori | ## 💥 **Eng ko'p ma'lumot** |
| ## Baholovchi | ## 💥 **Eng ko'p ma'lumot** |
| Humanizer | ⭐ kam — konteksti kichik |

> ## 🔑 **NAQSH AYON:** ## **kontekst qancha katta bo'lsa, JSON shuncha ko'p buziladi.**

---

## 2. ⭐ Kursning beshta tekshiruvi

| # | Tekshiruv |
|---|---|
| ① | JSON **to'g'ri formatlanganmi** |
| ② | **Aynan 6 ta** savol bormi |
| ③ | Kategoriyalar **ro'yxatdanmi** |
| ④ | `coding` savolda **misol** bormi |
| ⑤ | `type` **to'g'rimi** |

```python
KATEGORIYALAR = ["background", "technical knowledge", "situational",
                 "brain teaser", "analytical"]


def tekshir(matn, kutilgan_soni=6):
    """Kursning 5 ta tekshiruvi."""
    xatolar = []
    m = re.search(r"\[.*\]", matn or "", re.S)
    if not m:
        return ["JSON massiv topilmadi"]                   # ①
    try:
        d = json.loads(m.group(0))
    except json.JSONDecodeError as e:
        return [f"JSON parse xato: {e.msg}"]               # ①
    if not isinstance(d, list):
        return ["massiv emas"]
    if len(d) != kutilgan_soni:
        xatolar.append(f"savollar soni {len(d)} != {kutilgan_soni}")   # ②

    for i, q in enumerate(d):
        if not isinstance(q, dict):
            xatolar.append(f"{i}: lug'at emas"); continue
        if q.get("question_category") not in KATEGORIYALAR:            # ③
            xatolar.append(f"{i}: noto'g'ri kategoriya "
                           f"{q.get('question_category')!r}")
        if q.get("type") not in ("written", "coding", "database"):     # ⑤
            xatolar.append(f"{i}: noto'g'ri type {q.get('type')!r}")
        if not isinstance(q.get("question_text"), str) or not q["question_text"]:
            xatolar.append(f"{i}: question_text yo'q")
        if q.get("type") == "coding" and "example" not in str(q):      # ④
            xatolar.append(f"{i}: coding savolda misol yo'q")
    return xatolar
```

---

## 3. 💥💥💥 O'lchaymiz — **12 marta**

Kursning **o'z tavsiya qilgan qattiq prompti** bilan ham sinaymiz:

```python
QATTIQ = ODDIY + (
    "\n\nMake sure the output is stringified JSON which can be parsed without "
    "problems. Do not add any additional text in front or after the object. "
    "Do not change the object in any way other than what you have been "
    "instructed to do. Do not add json tags."
    "\n\nExample of one item:\n"
    '{"type":"written","question_category":"background",'
    '"question_text":"Tell me about your background.","current_question":1}')
```

### ✅ Haqiqiy natija

```
oddiy prompt               0/12 (0%)
   💥 12x  JSON massiv topilmadi

kursning qattiq prompti    0/12 (0%)
   💥 12x  JSON massiv topilmadi
```

> ## 💥💥💥 **IKKALASI HAM 0/12.** ## Kursning **qo'shimcha ko'rsatmalari** ## bu modelda ## **hech narsani o'zgartirmadi**.

> ## ⚠️ **HALOL BO'LSAK — BU BIZNING MODELIMIZ.** ## `Qwen2.5-0.5B` — **494 mln parametr**. ## Kurs `GPT-4o` bilan **5%** olgan. ## ## 🔑 Ya'ni raqamlar taqqoslanmaydi, ## lekin ## ⭐ **muammoning tabiati bir xil**.

---

## 4. 🔬 **SABABNI TOPAMIZ** — model nima yozdi?

```python
t = gen(QATTIQ, SETUP)
print(repr(t[:700]))
print(f"'[' bormi: {'[' in t}   '{{' bormi: {'{' in t}")
```

### ✅ Haqiqiy natija

```
'{"type":"written","question_category":"technical knowledge",
"question_text":"What are some key skills you have developed through your
experience as a Data Scientist?","current_question":2}\n
{"type":"written","question_category":"analytical","question_text":"Can you
describe a time when you had to adapt your approach to a new project...",
"current_question":3}\n
{"type":"written","question_category":"background",...}'

uzunlik: 950 belgi
'[' bormi: False   '{' bormi: True
```

> ## 🏆🏆🏆 **VA MANA HAQIQIY SABAB:**
>
> ## ## ⭐ **JSON OBYEKTLARI — MUKAMMAL.** ## ## 💥 **FAQAT MASSIV QAVSLARI `[` `]` YO'Q.**

> ## 🔑 **YA'NI "BUZUQ JSON" — NOTO'G'RI TASHXIS.** ## Mazmun **to'g'ri**, ## faqat **o'ram** noto'g'ri. ## ## ⭐ Model **JSONL** *(qatorma-qator JSON)* yozdi.

---

## 5. 🏆🏆 Ikki qatorli yechim — **yumshoq parser**

```python
def yumshoq_parse(t):
    """Massiv bo'lmasa ham, ALOHIDA obyektlarni yig'adi."""
    d = qattiq_parse(t)
    if isinstance(d, list):
        return d

    objs, chuq, boshi = [], 0, None
    for i, c in enumerate(t or ""):
        if c == "{":
            if chuq == 0:
                boshi = i
            chuq += 1
        elif c == "}":
            chuq -= 1
            if chuq == 0 and boshi is not None:
                try:
                    objs.append(json.loads(t[boshi:i + 1]))
                except json.JSONDecodeError:
                    pass                       # ⭐ bitta buzuq obyekt — qolganlari saqlanadi
                boshi = None
    return objs or None
```

### ✅ Haqiqiy natija — **10 marta**

```
QATTIQ parser (faqat massiv) : 0/10
YUMSHOQ parser (obyekt yig'ish): 10/10
topilgan savollar soni       : [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
```

> ## 🏆🏆🏆 **0/10 → 10/10.**
>
> ## ## ⭐ **KURS BU YECHIMNI UMUMAN ESLATMAYDI.**

> ## ⚠️ **LEKIN 6 EMAS, 5 TA SAVOL TOPILDI** — ## oxirgisi `max_new_tokens` bilan **kesilgan**. ## ## 🔑 Ya'ni yumshoq parser ## **kesilgan chiqishni ham qutqaradi**, ## va sizga **nechta topilganini** aytadi.

> ## 💡 **QAVS SANASH — NEGA `regex` EMAS?** ## `{"a": {"b": 1}}` — **ichma-ich** obyektlar. ## ⭐ `re` ularni **to'g'ri ajrata olmaydi**, ## qavs sanagichi esa — **oson**.

---

## 6. ⭐ Vazifani **bo'lish** — ikkinchi yechim

63-moduldagi dars: *"murakkab vazifani bo'ling"*.

```python
BITTA = ('You generate ONE interview question. Return ONLY a JSON object, '
         'no other text.\n'
         'Format: {"type":"written","question_category":"<category>",'
         '"question_text":"<string>","current_question":<int>}\n\n'
         'Example:\n'
         '{"type":"written","question_category":"background",'
         '"question_text":"Tell me about your background.","current_question":1}')
```

```python
for i, kat in enumerate(KATEGORIYALAR, 1):
    t = gen(BITTA, f"{SETUP}\nCategory: {kat}\nQuestion number: {i}", urug=i)
```

### ✅ Haqiqiy natija

```
1. [background          ] ok   'Could you describe your experience in data analysis...'
2. [technical knowledge ] ok   'Could you describe the key data analysis techniques...'
3. [situational         ] ok   'What are some of the key responsibilities you have...'
4. [brain teaser        ] ok   'What is the first step in creating a data model...'
5. [analytical          ] ok   'What are the key skills you have developed through...'
6. [technical knowledge ] ok   'Could you describe the key data analysis techniques...'

🏆 BITTADAN: 6/6 to'g'ri   (massiv bilan: 0/12)
```

> ## 🏆🏆🏆 **6/6 — VA MASSIV KODDA YIG'ILADI.**
>
> ## ## ⭐ **BU — UMUMIY QOIDA:** ## LLM dan **struktura** so'ramang — ## **bitta elementni** so'rang, ## strukturani **Python** yig'sin.

### ⚠️ Va massiv o'lchamiga bog'liqmi?

```
n=2: 0/4 to'g'ri massiv
n=3: 4/4 to'g'ri massiv
n=6: 0/4 to'g'ri massiv
```

> ## 💥 **JAVOB — OLDINDAN AYTIB BO'LMAYDI.** ## `n=3` ishladi, `n=2` va `n=6` — yo'q.
>
> ## ## 🔑 **VA BU — ENG MUHIM XULOSA:** ## LLM ning strukturaviy chiqishi ## ⭐ **barqaror emas**. ## Shuning uchun **tekshiruv va zaxira** shart.

---

## 7. 🏆 Kursning tizimi — **3 urinish + fallback**

```python
def savollar_ol(sys_p, urug_boshi=0, urinishlar=3):
    """Kursning tizimi: 3 marta urinish, keyin MB ga tushish."""
    tarix = []
    for k in range(urinishlar):
        t = gen(sys_p, SETUP, urug=urug_boshi * 10 + k)
        x = tekshir(t)
        tarix.append("✅" if not x else f"💥 {x[0][:38]}")
        if not x:
            return json.loads(re.search(r"\[.*\]", t, re.S).group(0)), tarix, "LLM"
    return MB_SAVOLLARI, tarix, "MB fallback"          # ⭐ ZAXIRA
```

### ✅ Haqiqiy natija — 6 intervyu

```
intervyu 1: 💥 -> 💥 -> 💥  ==> MB fallback (2 savol)
intervyu 2: 💥 -> 💥 -> 💥  ==> MB fallback (2 savol)
...
intervyu 6: 💥 -> 💥 -> 💥  ==> MB fallback (2 savol)

🏆 LLM: 0/6   MB fallback: 6/6
⭐ Foydalanuvchi HECH QACHON xato ko'rmadi — intervyu har doim boshlandi
```

> ## 🏆🏆 **VA MANA NEGA BU TIZIM AJOYIB:** ## LLM **6/6 marta ishlamadi**, ## foydalanuvchi esa ## ⭐ **6/6 marta intervyudan o'tdi**.
>
> ## ## 🔑 **BU — "GRACEFUL DEGRADATION"** ## *(bosqichma-bosqich pasayish)*: ## sifat pasayadi, **xizmat to'xtamaydi**.

### ⭐ To'liq himoya — **uch qatlam**

```python
def savollar_ishonchli(sys_p, mb_savollari, urinishlar=3):
    """① yumshoq parser  ② 3 urinish  ③ MB zaxirasi"""
    for k in range(urinishlar):
        t = gen(sys_p, SETUP, urug=k)
        d = yumshoq_parse(t)                     # ① yumshoq
        if d:
            toza = [q for q in d if tekshir_bitta(q)]
            if len(toza) >= 4:                   # ⭐ 4 tasi yetarli
                return toza[:6] + mb_savollari[:max(0, 6 - len(toza))], "LLM+MB"
    return mb_savollari, "MB fallback"           # ③ zaxira
```

| Qatlam | Nima qutqaradi |
|---|---|
| ## ① Yumshoq parser | ## 🏆 **0/10 → 10/10** |
| ② 3 urinish | Tasodifiy xatolar |
| ## ③ MB zaxirasi | ## 🏆 **Xizmat hech qachon to'xtamaydi** |

---

## 🎯 Nazorat savollari

1. Kursning qattiq prompti JSON ni tuzatdimi?
2. Model aslida nima yozdi?
3. Yumshoq parser natijani qanday o'zgartirdi?
4. Nega `re` o'rniga qavs sanagichi?
5. Fallback tizimi nimani kafolatlaydi?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q — 0/12, aynan oddiy prompt kabi.** ⚠️ Bu — kichik modelda; kurs `GPT-4o` bilan **5%** xato olgan.
2. ## **To'g'ri JSON obyektlari, lekin massiv qavslarisiz** (`[` `]` yo'q). ⭐ Ya'ni model **JSONL** yozdi. 🔑 *"Buzuq JSON"* — **noto'g'ri tashxis**: mazmun to'g'ri, **o'ram** noto'g'ri.
3. ## **0/10 → 10/10.** ⭐ Qavs sanash bilan alohida obyektlar yig'iladi. ⚠️ 6 emas, **5 ta** savol topildi — oxirgisi `max_new_tokens` bilan kesilgan.
4. ## **Ichma-ich obyektlar uchun.** `{"a": {"b": 1}}` da `re` tashqi qavsni **to'g'ri topa olmaydi**; qavs sanagichi esa — oson va aniq.
5. ## **Xizmat to'xtamasligini.** O'lchandi: LLM **6/6 marta ishlamadi**, foydalanuvchi esa **6/6 marta intervyudan o'tdi**. ⭐ Bu — *graceful degradation*: sifat pasayadi, xizmat qoladi.

</details>

---

⬅️ [4-dars](04-Prompt-Structure-Technical.md) · 🏠 [Modul](README.md) · ➡️ [6-dars](06-Hallucinations.md)
