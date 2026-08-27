# 6-dars. Gallyutsinatsiyalar ⭐⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs uchta gallyutsinatsiya toifasini sanaydi. Biz uchalasini ham o'lchadik — va IKKITASI takrorlanmadi. Keyin kursning 'chain of thought yordam beradi' maslahatini sinadik: u natijani BUZDI."**

---

## 1. ⚠️ Kursning statistikasi haqida

> *"Journal of Medical Internet Research tadqiqotiga ko'ra, GPT-3.5 ning gallyutsinatsiya darajasi **39.6%**, GPT-4 niki **28.6%**."*

> ## ⚠️ **BU RAQAMLARNI TEKSHIRA OLMAYMIZ** *(kalit yo'q)*. ## Lekin ularni **qanday o'qish kerakligi** aniq:
>
> ## ## 🔑 **① BU — TIBBIY KONTEKSTDAGI O'LCHOV,** ## odatda **ilmiy manbalarni** tekshirish. ## ⭐ *"Manba o'ylab topish"* darajasi ## **HR savol berish** darajasi bilan **bir xil emas**.
>
> ## ## 🔑 **② VA GPT-3.5/GPT-4 — ESKI MODELLAR.** ## Bugungi modellar **boshqacha** ishlaydi.

> ## 🏆 **TO'G'RI YONDASHUV — O'Z VAZIFANGIZDA O'LCHASH.** ## Aynan shuni qilamiz.

---

## 2. 💥 1-toifa: *"LLM foydalanuvchi javobini o'zi davom ettiradi"*

Kurs aytadi:

> *"LLM foydalanuvchi javobini go'yo o'zi intervyu oluvchidek davom ettiradi... intervyuchi rolini buzadi... savollarni **ro'yxat** qilib beradi."*

### 🔬 O'lchaymiz — 8 marta, `temperature=0.7`

```python
HR = ("You are an HR interviewer. Ask exactly ONE question. "
      "Do not answer for the candidate. Do not list multiple questions.")
JAVOB = "I have two years of experience as a data scientist."

for i in range(8):
    t = gen(HR, JAVOB, urug=i, temp=0.7)
    savollar = t.count("?")
    rol = bool(re.search(r"\b(as (a|the) candidate|my experience is|I have \d)",
                         t, re.I))
```

### ✅ Haqiqiy natija

```
0: savollar=1 rol_buzildi=False
   'How would you like to explore your data science skills?'
1: savollar=1 rol_buzildi=False
2: savollar=1 rol_buzildi=False

aynan 1 savol : 8/8
💥 1 dan ko'p  : 0/8
💥 rol buzildi : 0/8
```

> ## 💥 **TAKRORLANMADI — 0/8.**
>
> ## ## 🔧 **MEN BUNI TAKRORLANISHINI KUTGAN EDIM.** ## Kichik model — ko'proq xato qiladi degan mantiq. ## ## ⭐ **O'LCHOV BUNI RAD ETDI.**

> ## 🔑 **NEGA?** ## Bizning promptimizda ikkita **aniq taqiq** bor: ## *"Do not answer for the candidate"*, ## *"Do not list multiple questions"*. ## ## 💡 **Ya'ni kursning muammosi — ## prompt bilan hal qilinadigan muammo.**

---

## 3. 💥 2-toifa: *"uzun lekin ahamiyatsiz javobni yuqori baholaydi"*

Kurs aytadi:

> *"Ballash nomuvofiqliklari: **uzun lekin ahamiyatsiz** javoblarni ortiqcha baholash, **qisqa va yaxshi** javoblarni kam baholash."*

### 🔬 Uchta javob — bir xil savolga

| Javob | So'z | Mazmun |
|---|---|---|
| **A** | 12 | ## ⭐ **qisqa + aniq raqam** |
| **B** | 72 | ## 💥 **uzun + bo'sh** |
| **C** | 54 | ## ⭐ **uzun + aniq** |

```
A: "I cut inference latency from 800ms to 120ms by quantising the model."

B: "Well, I think that data science is a really interesting and very broad
    field... I have always been passionate about data and about numbers, and
    I believe that passion is the most important thing..."

C: "I reduced inference latency from 800ms to 120ms. First I profiled the
    model... I applied int8 quantisation, which cost 0.4 points of accuracy...
    We validated with a two-week A/B test on 5% of traffic..."
```

### ✅ Haqiqiy natija

```
A qisqa+aniq (12 so'z)     so'z= 12  ballar=[9, 9, 9]
B uzun+bo'sh (78 so'z)     so'z= 72  ballar=[8, 8, 8]
C uzun+aniq (61 so'z)      so'z= 54  ballar=[9, 9, 9]
```

> ## 💥 **KURSNING DA'VOSI TAKRORLANMADI.** ## Model **uzun+bo'sh** javobga ## **eng past ball** berdi *(8)*, ## qisqa+aniq va uzun+aniq esa ## **9** oldi.

### ⚠️ Lekin **haqiqiy muammo boshqa joyda**

> ## 💥💥 **BUTUN DIAPAZON — 8 DAN 9 GACHA.**
>
> ## Ya'ni model **butunlay bo'sh** javob bilan ## **texnik jihatdan mukammal** javobni ## ⭐ **bir ball bilan** ajratdi.

| Muammo | Kurs aytgan | ## Biz topgan |
|---|---|---|
| Uzunni ortiqcha baholash | ha | ## ✅ **yo'q** |
| ## **Ajrata olmaslik** | ## aytilmagan | ## 💥 **HA — 8 vs 9** |

> ## 🔑 **VA BU YOMONROQ MUAMMO.** ## Ortiqcha baholash — **noto'g'ri**, ## ajrata olmaslik — ## ⭐ **foydasiz**.

### 🔧 Birinchi urinish — **modelga mezon berish** *(ishlamadi)*

```python
MEZONLI = ('Return ONLY JSON: {"score": <int 1-10>, "reason": "<1 sentence>", '
           '"has_number": <true|false>, "has_tradeoff": <true|false>, '
           '"has_validation": <true|false>}\n\n'
           'Scoring rules:\n'
           '- Start at 3.\n'
           '- +3 if the answer contains a concrete number or metric.\n'
           '- +2 if it names a tradeoff or a cost.\n'
           '- +2 if it describes how the result was validated.\n')
```

### ✅ Haqiqiy natija

```
--- SODDA ---
  A qisqa+aniq     ball=9
  B uzun+bo'sh     ball=8
  C uzun+aniq      ball=9
  diapazon: 8..9  (tarqoqlik 1)

--- MEZONLI ---
  A qisqa+aniq     ball=9  num=True  trade=False val=False
  B uzun+bo'sh     ball=8  num=True  trade=True  val=True
  C uzun+aniq      ball=9  num=True  trade=True  val=True
  diapazon: 8..9  (tarqoqlik 1)
```

> ## 💥💥 **MENING YECHIMIM ISHLAMADI — TARQOQLIK O'ZGARMADI.**
>
> ## ## 💥💥💥 **VA YOMONROG'I — `B` (BO'SH JAVOB) UCHUN:** ## `has_number=True`, `has_tradeoff=True`, `has_validation=True`. ## ⭐ **Uchalasi ham YOLG'ON** — ## o'sha javobda **birorta raqam ham yo'q**.

> ## 🔑 **VA QOIDALAR HAM BAJARILMADI:** ## `3 + 3 + 2 + 2 = 10`, ## model esa **8** yozdi. ## ## ⚠️ Ya'ni model qoidalarni ## **o'qidi, lekin qo'llamadi**.

### ✅ Ikkinchi urinish — **mezonni KODDA tekshirish**

```python
import re


def belgilar(javob):
    """Mezonlarni KODDA tekshiradi — modelga ishonmaydi."""
    j = javob.lower()
    raqam = bool(re.search(
        r"\d+\s*(%|ms|s\b|x\b|k\b|points?|percent)|\d+\s*->|\bfrom\s+\d+", j))
    tradeoff = bool(re.search(
        r"\b(cost|tradeoff|trade-off|at the expense|but |however|"
        r"downside|sacrific|dropped|lost)\b", j))
    validatsiya = bool(re.search(
        r"\b(a/b test|ab test|cross-?validat|held.?out|validated|measured|"
        r"monitored|rollout|experiment|benchmark)\b", j))

    ball = 3 + 3 * raqam + 2 * tradeoff + 2 * validatsiya
    return ball, raqam, tradeoff, validatsiya
```

### ✅ Haqiqiy natija

```
  javob             ball  raqam  tradeoff  validatsiya
  ----------------------------------------------------
  A qisqa+aniq         6  True   False     False
  B uzun+bo'sh         3  False  False     False
  C uzun+aniq         10  True   True      True

  diapazon: 3..10  (tarqoqlik 7)
  LLM bilan tarqoqlik: 1
```

> ## 🏆🏆🏆 **TARQOQLIK 1 → 7.**
>
> ## Bo'sh javob **3**, mukammal javob **10**. ## ⭐ Endi ball **ma'noga ega**.

> ## 🔑 **VA MANA UMUMIY QOIDA — 66-MODULDAGI DARSNING TAKRORI:** ## **o'lchash mumkin bo'lgan narsani modelga bermang.** ## ⭐ Raqam bormi, A/B test eslatilganmi — ## bularni **kod** ancha aniqroq aytadi.

> ## ⚠️ **VA HALOL BO'LSAK — REGEX HAM MUKAMMAL EMAS:** ## u ingliz tiliga moslangan, ## va *"but"* so'zi har doim ham **tradeoff** emas. ## ## ⭐ To'g'ri yondashuv — **ikkalasini birlashtirish:** ## kod **belgilarni** topadi, ## LLM ularga **izoh** yozadi.

---

## 4. ✅ 3-toifa: *"JSON oldidan/keyinidan matn"*

Kurs beradigan qattiq ko'rsatmalar:

```
Make sure the output is stringified JSON which can be parsed without problems.
Do not add any additional text in front or after the object.
Do not change the object in any way other than what you have been instructed to do.
Do not add json tags.
```

### ✅ Haqiqiy natija — 8 marta, `temperature=0.7`

```
sodda prompt               toza: 8/8
kursning qattiq prompti    toza: 8/8
```

> ## 💥 **BU TOIFA HAM TAKRORLANMADI** — ## ikkala promptda ham **8/8 toza**.
>
> ## ## ⚠️ **YA'NI KURSNING QO'SHIMCHA QATORLARI ## O'LCHANADIGAN FOYDA BERMADI** *(bu vazifada)*.

> ## 🔑 **LEKIN 5-DARSDA KO'RDIK:** ## **massiv** so'ralganda hammasi buziladi. ## ## ⭐ **XULOSA:** muammo *"matn qo'shish"* da emas, ## **strukturaning murakkabligida**.

---

## 5. 💥💥💥 *"Chain of thought xatolarni kamaytiradi"* — **RAD ETILDI**

Kurs aytadi:

> *"Modelni aniq mantiqiy yo'lni ifodalashga majburlash yoki **chain of thought** promptlaridan foydalanish eng yaxshi amaliyot. Bu yondashuv xatolar yoki gallyutsinatsiyalarni **sezilarli darajada kamaytiradi**."*

### 🔬 Ikkita prompt

```python
BEVOSITA = ('You are an interview evaluator. Return ONLY JSON: '
            '{"score": <int 1-10>}')

COT = ('You are an interview evaluator. First think step by step inside '
       '<think></think> tags: (1) what was asked, (2) what was answered, '
       '(3) what is missing. Then output ONLY the JSON object after the '
       'closing tag.\nFormat: {"score": <int 1-10>}')
```

### ✅ Haqiqiy natija

```
bevosita             JSON: 6/6  ballar=[9, 10, 9, 9, 7, 9]   tarqoqlik=3
chain of thought     JSON: 6/6  ballar=[95, 9, 9, 95, 95, 95] tarqoqlik=86
```

> ## 💥💥💥 **`95` — BALL 1 DAN 10 GACHA SO'RALGAN EDI.**

### 🔬 Xom chiqishga qaraymiz

```python
t = gen(COT, f"Answer: {J}", urug=0)
print(repr(t))
```

```
'{"score": 95}'
```

> ## 💥💥 **MODEL O'YLASHNI UMUMAN QILMADI.** ## `<think>` teglari **yo'q**, ## faqat **noto'g'ri ball**.

### 🔬 Sxema tekshiruvi bilan

```python
def ball_sxema(t):
    m = re.search(r"\{.*?\}", t or "", re.S)
    if not m: return None, "JSON yo'q"
    try: d = json.loads(m.group(0))
    except json.JSONDecodeError: return None, "parse xato"
    s = d.get("score")
    if not isinstance(s, int):  return None, f"int emas: {s!r}"
    if not 1 <= s <= 10:        return None, f"diapazondan tashqari: {s}"
    return s, "ok"
```

```
bevosita             to'g'ri: 6/6   ['ok','ok','ok','ok','ok','ok']
chain of thought     to'g'ri: 2/6   ['diapazondan tashqari: 95', 'ok', 'ok',
                                     'diapazondan tashqari: 95',
                                     'diapazondan tashqari: 95',
                                     'diapazondan tashqari: 95']
```

> ## 💥💥💥 **CHAIN OF THOUGHT: 6/6 → 2/6.**
>
> ## ## 🔧 **BU — KURSNING MASLAHATINING TESKARISI.**

### 🔑 Nega shunday bo'ldi?

> ## ## ⭐ **CoT PROMPTI IKKITA ISH SO'RAYDI:** ## ① `<think>` bloki, ② JSON.
>
> ## ## 💥 **0.5B MODEL IKKALASINI HAM BAJARA OLMADI** — ## u o'ylashni **tashlab yubordi**, ## va JSON ni ham **buzdi**.

> ## 🏆 **HALOL XULOSA:** ## chain of thought — ## ⭐ **katta modellarda** ishlaydigan usul. ## ## ⚠️ Kichik modelda u ## **qo'shimcha yuk** bo'lib qoladi.

> ## 💡 **VA UMUMIY DARS:** ## *"eng yaxshi amaliyot"* deb ataladigan har qanday usulni ## ⭐ **o'z modelingizda o'lchang**. ## ## 🔑 Bu — 64-moduldagi dars *(kursning ## tavsiya qilgan prompti eng yomon chiqqan edi)* ## **takrorlandi**.

---

## 6. 🏆 Nima **haqiqatan** ishladi

| Usul | Kurs | ## O'lchov |
|---|---|---|
| Aniq taqiqlar *(`Do not ...`)* | ⭐ | ## 🏆 **8/8 — rol buzilmadi** |
| Qattiq struktura *(kategoriyalar)* | ⭐ | ## 🏆 **javob maydonini toraytiradi** |
| ## **Past `temperature`** | ⭐ | ## 🏆 **6/6 vs 0/6** *(7-bo'lim)* |
| ## **Vazifani bo'lish** | aytilmagan | ## 🏆 **0/12 → 6/6** *(5-dars)* |
| ## **Yumshoq parser** | aytilmagan | ## 🏆 **0/10 → 10/10** *(5-dars)* |
| ## **Zaxira (fallback)** | ⭐ | ## 🏆 **xizmat to'xtamaydi** |
| JSON ko'rsatmalari | ⭐ | ## ⚠️ **farq sezilmadi** |
| ## **Chain of thought** | ⭐ | ## 💥 **6/6 → 2/6** |

---

## 7. 🌡️ `temperature` — **eng kuchli tutqich**

Kurs aytadi: *"Biz baholovchi LLM ning temperature sini pasaytirdik."*

### ✅ Haqiqiy natija

| `temperature` | JSON to'g'ri | Ballar | Turli qiymat |
|---|---|---|---|
| ## **0.0** | ## 🏆 **6/6** | `[8,8,8,8,8,8]` | ⭐ 1 |
| **0.3** | 🏆 6/6 | `[8,8,8,8,8,8]` | ⭐ 1 |
| **0.5** | 🏆 6/6 | `[8,8,8,8,8,8]` | ⭐ 1 |
| ## **1.0** | ## ⚠️ **5/6** | ## 💥 `[9,8,4,4,8]` | 💥 3 |
| ## **1.5** | ## 💥 **0/6** | `[]` | — |

> ## 🏆🏆🏆 **KURS MUTLAQO HAQ — VA BIZ BUNI ANIQLASHTIRDIK:**
>
> ## ## ⭐ **0.0–0.5 — bir xil natija.** ## ## ⚠️ **1.0 — ball 4 dan 9 gacha sakraydi.** ## ## 💥 **1.5 — JSON butunlay buziladi.**

> ## 💡 **VA E'TIBOR BERING — `temp=1.0` DA ## BIR XIL JAVOBGA `4` VA `9`.**
>
> ## ## 🔑 **KURS AYNAN SHU HODISANI TASVIRLAGAN:** ## *"Humanizer `temperature=1` bilan ## oldingi javobni noto'g'ri deb belgiladi... ## baholovchi esa `temperature=0.5` bilan ## uni **to'g'ri** deb tan oldi."*

> ## 🏆 **QOIDA:** ## **JSON va baholash uchun `temperature ≤ 0.5`.**

---

## 🎯 Nazorat savollari

1. Kursning uchta toifasidan nechtasi takrorlandi?
2. 2-toifada haqiqiy muammo nima bo'lib chiqdi?
3. Chain of thought nima qildi?
4. `temperature` ning xavfsiz diapazoni qanday?
5. Nima haqiqatan ishladi?

<details>
<summary>Javoblar</summary>

1. ## **Bittasi ham to'liq takrorlanmadi.** ① rol buzilishi **0/8**, ② uzunni ortiqcha baholash **yo'q**, ③ JSON atrofida matn **8/8 toza**. ⚠️ Lekin bu — kichik model va **boshqa prompt**; kurs `GPT-4o` bilan ishlagan.
2. ## **Ajrata olmaslik.** Butun diapazon — **8 dan 9 gacha**: butunlay bo'sh javob **8**, texnik jihatdan mukammal javob **9**. 🔑 Bu — ortiqcha baholashdan **yomonroq**, chunki baho **foydasiz**.
3. ## **Natijani BUZDI: 6/6 → 2/6.** Model `<think>` blokini umuman yozmadi va `{"score": 95}` qaytardi. ⭐ CoT — **katta modellar** usuli; 0.5B da u **qo'shimcha yuk**.
4. ## **`≤ 0.5`.** O'lchandi: `0.0/0.3/0.5` — **6/6 JSON, bir xil ball**; `1.0` — **5/6, ball 4 dan 9 gacha**; `1.5` — **0/6**.
5. ## Aniq **taqiqlar**, qattiq **struktura**, past **`temperature`**, **vazifani bo'lish**, **yumshoq parser**, **zaxira**. 💥 Ishlamagani: chain of thought, JSON ko'rsatmalari.

</details>

---

⬅️ [5-dars](05-Additional-Protection-From-Errors.md) · 🏠 [Modul](README.md) · ➡️ [7-dars](07-Prompt-Injection.md)
