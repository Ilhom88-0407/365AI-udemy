# 4-dars. Dasturiy ta'minot uchun prompt muhandisligi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"62-modulda mahalliy model 4 ta kategoriyadan faqat 1 tasini to'g'ri bajargan edi. Few-shot bilan qayta sinadik — uchtasining ham MAVZUSI tuzatildi, bittasi to'liq."**

---

## 1. Kursning oltita tavsiyasi

| # | Tavsiya | ## O'lchandimi |
|---|---|---|
| ① | Aniq va qisqa bo'ling | ## ⚠️ **63.5-darsda** |
| ② | ## **Strukturalangan javob so'rang** *(JSON)* | ## ✅ **63.6-darsda** |
| ③ | ## **Few-shot promptlash** | ## 🏆 **BU DARSDA** |
| ④ | Qadamlarni ko'rsating | ## ✅ **quyida** |
| ⑤ | Aniq buyruq bering *(nima **mumkin emas**)* | ## ✅ **63.5-darsda** |
| ⑥ | ## **Murakkab vazifani bo'ling** | ## ✅ **63.6-darsda** |

> ## ✅ **OLTITASI HAM TO'G'RI TAVSIYA.** ## Endi **③ ni o'lchaymiz** — chunki u ## 62-moduldagi muvaffaqiyatsizlikning **yechimi**.

---

## 2. 💥 Muammoni eslaymiz — 62-modul

```
[hr/xulq]         "What specific challenges have you faced..."          ✅
[hr/boshqotirma]  "What is the primary goal of data science?"           💥
[texnik/kod]      "What is the purpose of using pandas?"                💥
[texnik/database] "What is the primary goal of using a database?"       💥
```

> ## 💥 **4 TADAN 1 TASI.** ## Model **har bir kategoriyani** ## `"What is the primary goal of ...?"` qolipiga aylantirdi.

---

## 3. 🏆🏆 Few-shot — muammoni tuzatadimi?

### 📐 Zero-shot *(62-moduldagi versiya)*

```python
def zero_shot(kat):
    return (f"You are an experienced interviewer at Google, hiring for a "
            f"Data Scientist role.\nQuestion type: {KATEGORIYALAR[kat]}.\n"
            f"Ask EXACTLY ONE question. Do not answer it. "
            f"Do not add commentary. Output only the question.")
```

### 📐 Few-shot

```python
MISOLLAR = {
    "boshqotirma": [
        "How many tennis balls fit inside a Boeing 747?",
        "Estimate the number of pizzas delivered in New York City on a Friday night.",
    ],
    "kod": [
        "Write a Python function that returns the second largest number in a list.",
        "Debug this: `def mean(xs): return sum(xs)/len(xs)` — what breaks and how do you fix it?",
    ],
    "database": [
        "Write a SQL query that returns the top 5 customers by total order amount "
        "in the last 30 days.",
        "Design a schema for storing product reviews with ratings and moderation status.",
    ],
}


def few_shot(kat):
    misollar = "\n".join(f"Example {i}: {m}"
                         for i, m in enumerate(MISOLLAR[kat], 1))
    return (f"You are an experienced interviewer at Google, hiring for a "
            f"Data Scientist role.\nQuestion type: {KATEGORIYALAR[kat]}.\n\n"
            f"{misollar}\n\n"
            f"Now write ONE NEW question of the same type. "
            f"Do not repeat the examples. Do not answer it. "
            f"Output only the question.")
```

### 📊 Natija

| Kategoriya | Usul | Token | ## Natija |
|---|---|---|---|
| **boshqotirma** | zero-shot | 45 | ## 💥 *"What is the primary goal of data cleaning in a dataset?"* |
| **boshqotirma** | ## **few-shot** | 84 | ## ✅ *"How many people can you count with your eyes closed?"* |
| **kod** | zero-shot | 45 | ## 💥 *"What is the purpose of using the `pandas` library in Python?"* |
| **kod** | ## **few-shot** | 97 | ## 🏆 *"Write a Python function to find the second largest element in a gi..."* |
| **database** | zero-shot | 45 | ## 💥 *"What is the primary goal of using machine learning in predictive a..."* |
| **database** | ## **few-shot** | 93 | ## ✅ *"What is the primary key constraint on the "orders" table to ensure..."* |

> ## 🏆🏆🏆 **UCHTA KATEGORIYA — UCHTASI HAM TUZATILDI.**
>
> ## 💥 **`boshqotirma`:** *"data cleaning maqsadi"* → ## ✅ *"How many people can you count..."* — **haqiqiy baholash savoli**
> ## 💥 **`kod`:** *"pandas nima uchun?"* → ## 🏆 *"Write a Python function..."* — **haqiqiy kod vazifasi**
> ## 💥 **`database`:** *"MB maqsadi"* → ## ✅ *"primary key constraint on orders table"* — **SQL mavzusi**

### 💰 Narxi

| | Token | Farq |
|---|---|---|
| Zero-shot | 45 | — |
| ## **Few-shot** | ## **84–97** | ## **+39–52** *(~2×)* |

> ## 💰 **+52 TOKEN — `gpt-4o-mini` DA $0.0000078.** ## 10 000 so'rov uchun **$0.08**. ## ## 🏆 **VA MUAMMO HAL BO'LDI.**

---

## 4. ⚠️ Lekin halol bo'laylik — ikkita eslatma

### 💥 ① Mening heuristikam **noto'g'ri baho** berdi

Kategoriyaga moslikni **kalit so'zlar** bilan tekshirdim:

```python
if kat == "kod":
    return any(x in s for x in ["write", "function", "code", "python", ...])
```

> ## 💥 **VA U ZERO-SHOT `kod` NI "✅" DEB BELGILADI:** ## *"What is the purpose of using the `pandas` library in **Python**?"* ## ## 🔑 **`"python"` so'zi bor — demak "kod savoli"?** ## ## 💥 **Yo'q. Bu — nazariy savol, kod vazifasi emas.**
>
> ## ## 🏆 **DARS:** ## **avtomatik baholovchining o'zini ham tekshiring.** ## Kalit so'z — **zaif signal**.

### ⚠️ ② `database` javobi ham mukammal emas

```
"What is the primary key constraint on the "orders" table to ensure..."
```

> ## ⚠️ **BU — SQL SO'ROV YOZISH VAZIFASI EMAS**, ## bu **nazariy savol** *(lekin to'g'ri mavzuda)*.
>
> ## ## 🔑 **Ya'ni few-shot MAVZUNI tuzatdi, ## lekin VAZIFA SHAKLINI to'liq emas.**

> ## 🏆 **HALOL BAHO:** ## `kod` — **to'liq tuzatildi**. ## `boshqotirma`, `database` — **qisman**. ## ## ⭐ **3/3 emas, taxminan 2/3.**

---

## 5. ⭐ Qadamlarni ko'rsatish *(④ tavsiya)*

> ## 🔑 **KURS AYTADI:** ## *"Avval elektron xat mazmunini ajratib oling, ## keyin javob mavzusini o'ylab toping, ## keyin javob yozing, ## nihoyat hammasini JSON ga joylang."*

```python
QADAMLI = """You are an email assistant.

Follow these steps IN ORDER:
1. Read the email and identify the sender's main request.
2. Decide on an appropriate subject line for the reply.
3. Draft a reply of at most 4 sentences.
4. End the reply with "Best regards, John Green".
5. Return ONLY JSON: {"request": "...", "subject": "...", "reply": "..."}

Email:
{email}"""
```

### 🔬 Sinaymiz

```python
EMAIL = ("Hi, I ordered a laptop stand last week (order #4471) but received "
         "a keyboard instead. Could you tell me how to return it and when "
         "I'll get the correct item? Thanks, Maria")

for nom, p in [("qadamsiz", ODDIY), ("qadamli", QADAMLI)]:
    s = gen(p.format(email=EMAIL))
    d, holat = json_ajrat(s)
    print(f"[{nom}] JSON: {holat}  kalitlar: {sorted(d) if d else '—'}")
```

### ✅ Haqiqiy natija

```
[qadamsiz] 37 tok · JSON: 💥 xato: Invalid control character at line 4 column 24
                          kalitlar: —

[qadamli ] 90 tok · JSON: ✅ ok · kalitlar: ['reply', 'request', 'subject']
   'Best regards, John Green': ✅ bor
   javob jumlalari: 3
   request: Return order #4471
```

> ## 🏆🏆🏆 **KURSNING TAVSIYASI TASDIQLANDI — VA MEN XATO KUTGAN EDIM.**
>
> ## ## 🔧 **MEN "IKKALASI HAM TO'G'RI JSON BERADI" DEB O'YLAGANDIM.**
>
> ## ## 💥 **HAQIQAT: `qadamsiz` VERSIYA PARSE QILINMADI.** ## `Invalid control character` — ## model JSON satri ichiga **xom qator uzilishi** qo'ygan.

### 📊 To'liq taqqoslash

| | `qadamsiz` | ## `qadamli` |
|---|---|---|
| Prompt | 37 token | 90 token |
| ## **JSON parse** | ## 💥 **XATO** | ## ✅ **ok** |
| Kalitlar | ## 💥 **—** | ## ✅ **3/3** |
| `"Best regards, John Green"` | ## 💥 **—** | ## ✅ **bor** |
| Javob uzunligi | ## 💥 **—** | ## ✅ **3 jumla** *(≤4 talab)* |
| `request` aniqligi | ## 💥 **—** | ## ✅ **`"Return order #4471"`** |

> ## 🏆 **+53 TOKEN — VA HAMMA TALAB BAJARILDI:**
>
> ## ✅ JSON parse qilindi
> ## ✅ Imzo qo'yildi
> ## ✅ Uzunlik cheklovi bajarildi *(3 ≤ 4)*
> ## ✅ `request` **aniq** ajratildi

> ## 💡 **VA NEGA QADAMLAR ISHLADI?**
>
> ## ## 🔑 **Model bir vaqtda TO'RTTA ishni qilishi kerak edi:** ## o'qish, mavzu tanlash, javob yozish, JSON ga joylash. ## ## ⭐ **Qadamlar ularni KETMA-KET qildi** — ## va model har birini **alohida** bajardi.
>
> ## ## 💥 **Qadamsiz esa u hammasini BIRDANIGA qilib, ## JSON ni buzdi.**

---

## 6. 🔧 Prompt kutubxonasi

```python
class PromptKutubxona:
    """Promptlarni versiyalaydi, o'lchaydi va taqqoslaydi."""

    def __init__(self, enc=None):
        self.enc = enc or tiktoken.get_encoding("o200k_base")
        self.promptlar = {}

    def qosh(self, nom, versiya, matn, izoh=""):
        kalit = f"{nom}@{versiya}"
        if kalit in self.promptlar:
            raise ValueError(f"{kalit} allaqachon mavjud")
        self.promptlar[kalit] = {
            "nom": nom, "versiya": versiya, "matn": matn, "izoh": izoh,
            "token": len(self.enc.encode(matn)),
            "orinlar": sorted(set(re.findall(r"\{(\w+)\}", matn))),
        }
        return self

    def ol(self, nom, versiya=None):
        if versiya:
            return self.promptlar[f"{nom}@{versiya}"]
        mos = [v for v in self.promptlar.values() if v["nom"] == nom]
        if not mos:
            raise KeyError(f"prompt topilmadi: {nom}")
        return max(mos, key=lambda x: x["versiya"])      # ⭐ oxirgi versiya

    def toldir(self, nom, versiya=None, **kw):
        p = self.ol(nom, versiya)
        yoq = [o for o in p["orinlar"] if o not in kw]
        if yoq:
            raise ValueError(f"💥 to'ldirilmagan o'rinlar: {yoq}")
        return p["matn"].format(**kw)

    def jadval(self):
        print(f"  {'prompt':22s} {'v':>3} {'token':>6} {'o`rinlar':>9}  izoh")
        print("  " + "-" * 68)
        for k in sorted(self.promptlar):
            p = self.promptlar[k]
            print(f"  {p['nom']:22s} {p['versiya']:>3} {p['token']:>6} "
                  f"{len(p['orinlar']):>9}  {p['izoh'][:26]}")
        return self
```

```python
kb = (PromptKutubxona()
      .qosh("intervyu", 1, "You are an HR interviewer. Ask 6 questions.",
            "birinchi urinish")
      .qosh("intervyu", 2,
            "You are an HR interviewer at {company} hiring a {position}.\n"
            "Ask EXACTLY ONE question per turn. Do not answer it.",
            "rol + cheklov qo'shildi")
      .qosh("intervyu", 3,
            "You are an HR interviewer at {company} hiring a {position}.\n"
            "Question type: {kategoriya}.\n\n{misollar}\n\n"
            "Now write ONE NEW question of the same type. "
            "Output only the question.",
            "few-shot")
      .qosh("baholash", 1,
            'Score 1-10 and return ONLY JSON: {{"score": <int>}}\n{javob}',
            "JSON format")
      .jadval())

print()
print(kb.toldir("intervyu", 2, company="Google", position="Data Scientist"))
try:
    kb.toldir("intervyu", 3, company="Google")
except ValueError as e:
    print(f"\n{e}")
```

### ✅ Haqiqiy natija

```
  prompt                   v  token  o`rinlar  izoh
  --------------------------------------------------------------------
  baholash                 1     22         1  JSON format
  intervyu                 1     11         0  birinchi urinish
  intervyu                 2     27         2  rol + cheklov qo'shildi
  intervyu                 3     41         4  few-shot

You are an HR interviewer at Google hiring a Data Scientist.
Ask EXACTLY ONE question per turn. Do not answer it.

💥 to'ldirilmagan o'rinlar: ['kategoriya', 'misollar', 'position']
```

> ## 🏆 **VERSIYALAR TOKENDA KO'RINADI: 11 → 27 → 41.** ## Va **`toldir()` yetishmayotgan o'rinlarni erta tutdi**.
>
> ## ## ⭐ **BU — 63-MODULDAGI DARSNING DAVOMI:** ## promptni **versiyalash** = ## qaysi o'zgarish qaysi natijani berganini bilish.

---

## 🎯 Nazorat savollari

1. Few-shot 62-moduldagi muammoni tuzatdimi?
2. Few-shot qancha token qo'shadi va bu qimmatmi?
3. Mening baholash heuristikam qanday xato qildi?
4. Qadamli prompt JSON strukturasini yaxshiladimi?
5. Prompt versiyalash nima uchun kerak?

<details>
<summary>Javoblar</summary>

1. ## **Asosan ha.** `kod` — **to'liq** tuzatildi (*"pandas nima uchun?"* → *"Write a Python function..."*). `boshqotirma` va `database` — **mavzu tuzatildi, vazifa shakli qisman**. Halol baho: **~2/3**.
2. ## **+39–52 token** (45 → 84–97, ~2×). `gpt-4o-mini` da bu **$0.0000078**/so'rov, 10 000 so'rov uchun **$0.08**. ## **Arzon.**
3. Kalit so'z bilan tekshirgan edim. *"What is the purpose of using the `pandas` library in **Python**?"* — `"python"` so'zi bor, demak **"✅ kod savoli"**. ## 💥 **Aslida bu nazariy savol.** ## **Avtomatik baholovchining o'zini ham tekshiring.**
4. ## **Ha — va men teskarisini kutgan edim.** `qadamsiz` versiya **JSON parse xatosi** berdi (`Invalid control character` — satr ichida xom qator uzilishi). `qadamli` — **to'liq to'g'ri**: JSON ok, imzo bor, javob **3 jumla** (≤4 talab), `request` aniq. ## ⭐ **+53 token — va hamma talab bajarildi.**
5. Prompt o'zgarsa — **natija o'zgaradi**. Versiyasiz *"kecha yaxshi ishlagan edi"* deyish mumkin, lekin **nima o'zgarganini** bilmaysiz. Bizning kutubxonada tokenlar **11 → 27 → 41** deb ko'rinadi.

</details>

---

⬅️ [3-dars](03-Optimizing-Temperature-and-Top-P.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-How-to-Test-a-Prompt-Template.md)
