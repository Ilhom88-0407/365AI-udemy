# 3-dars. Turli vazifalar uchun `temperature` va `top_p` ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs oltita vazifa uchun sozlama beradi. Biz oltitasini ham sinadik — va past sozlamali uchtasi 1/3, yuqori sozlamali uchtasi 3/3 turli natija berdi. Kursning mantiqi ishlaydi."**

---

## 1. Kursning jadvali

| Vazifa | `temperature` | `top_p` | Sabab |
|---|---|---|---|
| Kampaniya g'oyalari | ## **1.1** | 1.0 | ijodkorlik, kutilmagan g'oyalar |
| Marketing matni | 0.3 | 0.5 | aniq, lekin nafis |
| ## **Kod** | ## **0.3** | ## **0.3** | toza, ishonchli |
| ## **Ma'lumot tahlili** | ## **0.2** | ## **0.1** | maksimal aniqlik |
| Hisobot | 0.3 | 0.5 | aniq, lekin o'qishli |
| Chatbot | 1.0 | 1.0 | tabiiy, jonli |

> ## ✅ **MANTIQ TO'G'RI:** ## *"Mantiqiy fikrlash talab qiladigan vazifalar — **past**, ## ijodkorlik talab qiladiganlar — **yuqori**."*

---

## 2. 🔬 Hammasini sinaymiz

```python
HOLATLAR = [
    ("kampaniya g'oyalari", 1.1, 1.0, "Suggest 3 fresh marketing campaign ideas..."),
    ("marketing matni",     0.3, 0.5, "Write one short tagline for a coffee brand."),
    ("kod",                 0.3, 0.3, "Write a Python function that reverses a string."),
    ("ma'lumot tahlili",    0.2, 0.1, "Write a SQL query to count orders per customer."),
    ("hisobot",             0.3, 0.5, "Summarise: sales rose 12% in Q3..."),
    ("chatbot",             1.0, 1.0, "Greet a customer who just asked about delivery."),
]

for nom, t, p, q in HOLATLAR:
    h = set()
    for i in range(3):
        torch.manual_seed(i)
        h.add(hash(gen(q, temperature=t, top_p=p, top_k=0)))
    print(f"{nom:22s} temp={t} top_p={p}  {len(h)}/3 turli")
```

### 📊 Natija

| Holat | `temp` | `top_p` | ## Turli/3 | Javob namunasi |
|---|---|---|---|---|
| ## Kampaniya g'oyalari | 1.1 | 1.0 | ## 💥 **3/3** | *"Sure, here are three fresh marketing c..."* |
| ## Marketing matni | 0.3 | 0.5 | ## 💥 **3/3** | *"Experience the perfect blend of flavo..."* |
| ## **Kod** | 0.3 | 0.3 | ## ⭐ **1/3** | *"Certainly! Here's a simple Python func..."* |
| ## **Ma'lumot tahlili** | 0.2 | 0.1 | ## ⭐ **1/3** | *"To count the number of orders per cust..."* |
| ## **Hisobot** | 0.3 | 0.5 | ## ⭐ **1/3** | *"Sales increased by 12% in the third qu..."* |
| ## Chatbot | 1.0 | 1.0 | ## 💥 **3/3** | *"Hello! How can I assist you better tod..."* |

> ## 🏆 **KURSNING MANTIQI ISHLAYDI:**
>
> ## ⭐ **Past sozlama** *(kod, tahlil)* → **1/3** = barqaror
> ## 💥 **Yuqori sozlama** *(g'oyalar, chatbot)* → **3/3** = o'zgaruvchan

### 💥 Lekin bitta anomaliya bor

```
marketing matni   temp=0.3  top_p=0.5  →  3/3 turli    💥
hisobot           temp=0.3  top_p=0.5  →  1/3 turli    ✅
```

> ## 💥 **AYNAN BIR XIL SOZLAMA — TURLI NATIJA.**
>
> ## ## 🔑 **SABAB — VAZIFANING O'ZIDA:** ## *"Bitta shior yozing"* — model **ko'p variantni** teng ehtimolli deb ko'radi. ## *"12% o'sishni xulosalang"* — **bitta to'g'ri javob** bor.
>
> ## ## ⭐ **YA'NI: `temperature` — YAGONA OMIL EMAS.** ## Vazifaning **o'zi** qanchalik "ochiq" ekani ham muhim.

---

## 3. ⭐⭐ Amaliy tavsiya jadvali

| Vazifa turi | `temp` | `top_p` | Nega |
|---|---|---|---|
| ## **JSON/struktura** | ## ⭐ **0.0** | 1.0 | ## **Parse qilinishi shart** |
| Kod generatsiyasi | 0.0–0.2 | 0.3 | Sintaksis xato bo'lmasin |
| SQL / hisob-kitob | ## ⭐ **0.0** | 0.1 | ## **Bitta to'g'ri javob** |
| Tarjima | 0.0–0.3 | 0.5 | Aniqlik |
| Xulosa | 0.2–0.4 | 0.5 | Aniq, lekin o'qishli |
| Tahrirlash | 0.3 | 0.5 | Ozgina erkinlik |
| ## **Intervyu savoli** | ## ⭐ **0.7–1.0** | 1.0 | ## **Har safar boshqa** |
| Ijodiy yozuv | 1.0–1.2 | 1.0 | Kutilmagan g'oyalar |
| ## Hech qachon | ## 💥 **≥ 1.5** | — | ## 💥 **matn buziladi** |

> ## 💥 **KURSNING JADVALIDA `temperature=0` YO'Q.** ## ## 🔑 **VA BU — KATTA BO'SHLIQ.** ## JSON, SQL va kod uchun **`0` eng to'g'ri tanlov**: ## ## ⭐ **takrorlanuvchan, testlanadigan, xatosi bashoratli.**

---

## 4. 💥 Bizning loyihamiz uchun — **ikkita** sozlama

Intervyu vositasi **ikkita** turli ishni bajaradi:

| Bosqich | Nima kerak | `temp` | `top_p` |
|---|---|---|---|
| ## **Intervyu savoli** | Har safar **boshqa** savol | ## ⭐ **0.8** | 1.0 |
| ## **Baholash (JSON)** | ## **Barqaror, parse qilinadigan** | ## ⭐ **0.0** | 1.0 |

> ## 🏆 **VA BU — 63-MODULNING 6-DARSIDAGI QARORNI MUSTAHKAMLAYDI:** ## baholash **alohida so'rov** bo'lishi kerak — ## chunki unda **boshqa sozlama** kerak.
>
> ## ## 💥 **BITTA SO'ROVDA IKKALASINI QILIB BO'LMAYDI.**

### 🔬 Buni ham o'lchaymiz

```python
BAHO = ("Score this answer 1-10 and return ONLY JSON: "
        '{"score": <int>, "reason": "<one sentence>"}\n'
        "Answer: I used stratified sampling because the data was imbalanced.")

for t in [0.0, 0.8]:
    natijalar, xatolar = [], 0
    for i in range(5):
        torch.manual_seed(i)
        s = gen(BAHO, temperature=t, top_p=1.0, top_k=0)
        try:
            natijalar.append(json.loads(s[s.find("{"):s.rfind("}")+1])["score"])
        except Exception:
            xatolar += 1
    print(f"temp={t}: ballar {natijalar}  parse xatolari {xatolar}/5")
```

### ✅ Haqiqiy natija

```
temp=0.0: ballar [8, 8, 8, 8, 8]  parse xatolari 0/5
temp=0.8: ballar [8, 0, 8, 8, 7]  parse xatolari 0/5
```

> ## ⭐ **`temp=0.0` — BALL BARQAROR: 8, 8, 8, 8, 8.**
>
> ## ## 💥💥 **`temp=0.8` — BALL: 8, 0, 8, 8, 7.**

> ## 💥💥💥 **IKKINCHI QIYMATGA E'TIBOR BERING — `0`.**
>
> ## Promptda **`1-10`** deb yozilgan edi. ## ## 🔑 **Model DIAPAZONDAN TASHQARIDAGI ball berdi.**
>
> ## ## ⚠️ **VA JSON PARSE MUVAFFAQIYATLI O'TDI** — ## ya'ni **kod buni sezmaydi**.

> ## 🔧 **MEN "temp=0.8 DA PARSE XATOLARI BO'LADI" DEB KUTGAN EDIM.** ## Haqiqat: **0/5 parse xatosi** — ikkala sozlamada ham. ## ## 💥 **Xato boshqa joyda edi: QIYMATDA.**

### 🔑 Va bu bizga uchta narsani o'rgatadi

| Dars | Izoh |
|---|---|
| ## ① **`temp=0` baholash uchun majburiy** | Aks holda ball **beqaror** |
| ## ② **Diapazonni KODDA tekshiring** | ## 💥 `0` ni JSON parser tutmadi |
| ③ Bir xil javob → bir xil ball | Foydalanuvchi ishonchi |

> ## ⭐ **63-MODULDAGI `baho_tekshir()` BUNI TUTGAN BO'LARDI:**
>
> ```python
> if not isinstance(s, int) or not 1 <= s <= 10:
>     xato.append(f"overall_score noto'g'ri: {s!r}")
> ```
>
> ## ## 🏆 **VA MANA NEGA SXEMA TEKSHIRUVI KERAK:** ## `json.loads()` — **sintaksisni** tekshiradi, ## **ma'noni** emas.

---

## 5. 🔧 Sozlama profillari

```python
PROFILLAR = {
    "deterministik": {"temperature": 0.0},
    "aniq":          {"temperature": 0.2, "top_p": 0.3, "top_k": 0},
    "muvozanatli":   {"temperature": 0.7, "top_p": 0.9, "top_k": 0},
    "ijodiy":        {"temperature": 1.0, "top_p": 1.0, "top_k": 0},
}

VAZIFA_PROFIL = {
    "json": "deterministik", "sql": "deterministik", "kod": "aniq",
    "tarjima": "aniq", "xulosa": "aniq", "tahrirlash": "muvozanatli",
    "savol": "muvozanatli", "chatbot": "ijodiy", "gaya": "ijodiy",
}


def sozlama(vazifa, max_tokens=200):
    """Vazifa turiga mos generatsiya sozlamalarini qaytaradi."""
    prof = VAZIFA_PROFIL.get(vazifa)
    if prof is None:
        raise ValueError(
            f"noma'lum vazifa: {vazifa}. Mavjud: {sorted(VAZIFA_PROFIL)}")
    gk = dict(PROFILLAR[prof])
    gk["max_new_tokens"] = max_tokens
    gk["do_sample"] = gk.get("temperature", 0.0) > 0
    if not gk["do_sample"]:
        gk.pop("temperature", None)      # ⚠️ do_sample=False da temperature keraksiz
    return prof, gk
```

```python
for v in ["json", "kod", "savol", "chatbot"]:
    p, gk = sozlama(v)
    print(f"{v:10s} -> {p:14s} {gk}")
```

```
json       -> deterministik  {'max_new_tokens': 200, 'do_sample': False}
kod        -> aniq           {'temperature': 0.2, 'top_p': 0.3, 'top_k': 0, 'max_new_tokens': 200, 'do_sample': True}
savol      -> muvozanatli    {'temperature': 0.7, 'top_p': 0.9, 'top_k': 0, 'max_new_tokens': 200, 'do_sample': True}
chatbot    -> ijodiy         {'temperature': 1.0, 'top_p': 1.0, 'top_k': 0, 'max_new_tokens': 200, 'do_sample': True}
```

> ## ⭐ **E'TIBOR BERING — `json` DA `temperature` UMUMAN YO'Q.** ## `do_sample=False` bo'lganda u **keraksiz** ## *(va ba'zi kutubxonalarda ogohlantirish beradi)*.

---

## 🎯 Nazorat savollari

1. Kursning sozlamalar mantiqi tasdiqlandimi?
2. Bir xil sozlamada nega turli natija chiqdi?
3. Kursning jadvalida qaysi muhim qiymat yo'q?
4. Bizning loyihamizda nechta sozlama kerak?
5. `temp=0.8` da baholash nima uchun muammo?

<details>
<summary>Javoblar</summary>

1. ## **Ha.** Past sozlama *(kod, tahlil, hisobot)* → **1/3** turli natija. Yuqori sozlama *(g'oyalar, chatbot)* → **3/3**.
2. `marketing matni` va `hisobot` — ikkalasi ham `temp=0.3, top_p=0.5`, lekin **3/3** va **1/3**. ## **Sabab vazifaning o'zida:** *"shior yozing"* — ko'p teng variant, *"xulosalang"* — bitta to'g'ri javob. ## **`temperature` — yagona omil emas.**
3. ## **`temperature=0`.** JSON, SQL va kod uchun eng to'g'ri tanlov — **takrorlanuvchan va testlanadigan**.
4. ## **Ikkita:** intervyu savoli uchun **0.8** *(har safar boshqa)*, baholash uchun **0.0** *(barqaror JSON)*. Bu — 63-modulning *"alohida so'rov"* qarorini mustahkamlaydi.
5. Ball **o'zgarib turadi**: `[8, 0, 8, 8, 7]` vs `temp=0` da `[8, 8, 8, 8, 8]`. ## 💥 **Va ikkinchi qiymat — `0`, ya'ni promptdagi `1-10` diapazondan TASHQARIDA.** JSON parse esa **muvaffaqiyatli o'tdi** — kod buni **sezmaydi**. ## ⭐ Shuning uchun **sxema tekshiruvi** shart (63-modul, 6-dars).

</details>

---

⬅️ [2-dars](02-The-OpenAI-Playground.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Prompt-Engineering.md)
