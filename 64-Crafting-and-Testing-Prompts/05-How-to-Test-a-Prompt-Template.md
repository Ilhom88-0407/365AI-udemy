# 5-dars. Prompt shablonini qanday sinash kerak ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Biz avtomatik sinovchi yozdik va 5 ta prompt versiyasini 60 ta so'rovda o'lchadik. Natija: kursning tavsiya qilgan versiyasi ENG YOMON chiqdi — 0.58, boshqalari 0.71–0.77."**

---

## 1. Kursning usuli

> ## 🔑 **KURS AYTADI:** ## *"Promptni Playground'ga qo'ying, ## `{}` o'rinlarini **soxta ma'lumot** bilan to'ldiring, ## natijani ko'ring va **baholang**."*

```
   Amazon      -> {company}
   Olivia      -> {name}
   Data Scientist / junior -> {position} / {level}
   Python, ML, data analysis -> {skills}
```

> ## ✅ **BU — TO'G'RI BIRINCHI QADAM.** ## Va kurs muhim narsani ko'rsatadi: ## **bir xil prompt — ikki xil natija**.

---

## 2. 💥 Kursning topilgan muammosi

> ## 🔑 **KURS AYTADI:** ## *"Birinchi misolda model **hamma savolni birdaniga** berdi. ## Ikkinchisida esa **bittalab** so'radi."*

### ✅ Kursning yechimi

```
Ask each question individually, creating a conversational flow
rather than presenting all the questions simultaneously.
```

### 🔬 Biz ham sinadik

```python
BAZA = ("You are an HR interviewer at Amazon, hiring for a junior Data Scientist. "
        "The candidate is Olivia. Skills: Python, machine learning, data analysis. "
        "Ask the candidate 6 questions. "
        "Use these as inspiration: 'Tell me about a challenging project.' "
        "'How do you handle tight deadlines?'")
QOSHIMCHA = (" Ask each question individually, creating a conversational flow "
             "rather than presenting all the questions simultaneously.")

for nom, p in [("qo'shimchasiz", BAZA), ("qo'shimcha bilan", BAZA + QOSHIMCHA)]:
    s = gen(p, "Hello, I'm ready.", n=180)
    print(f"[{nom}] savol belgilari: {s.count('?')}")
    print(f"  {s[:120]}")
```

### 📊 Natija

| Variant | Token | `?` belgilari | Natija |
|---|---|---|---|
| Qo'shimchasiz | 58 | ## **2** | *"Great! Let's get started with our first question. **Question:** What was your role..."* |
| Qo'shimcha bilan | 75 | ## ⭐ **1** | *"Great! Let's get started with our conversation. What brings you to this role?"* |

> ## ⚠️ **BIZDA MODEL "HAMMASINI BIRDANIGA" BERMADI** — ## ikkala variantda ham **bitta savol**.
>
> ## ## 🔑 **LEKIN FARQ BOR:** ## qo'shimchasiz **2 ta `?`** *(savol + qo'shimcha savol)*, ## qo'shimcha bilan — **1 ta**.

> ## 🔧 **HALOL BAHO:** ## kursning muammosi **bizda takrorlanmadi**, ## lekin qo'shimcha **natijani toza qildi**. ## ## 💡 **Sabab — model boshqa** *(0.5B vs GPT-4)* ## va **`temperature=0`** *(kursda 1.0)*.

---

## 3. 💥💥 Va mana kursning **eng katta bo'shlig'i**

> ## 🔑 **KURS AYTADI:** *"Modelning xulqi **o'zgarishi mumkin**. ## Shuning uchun shablonni **o'zgartirib, qayta urinamiz**."*
>
> ## ## 💥 **LEKIN QANDAY BILASIZ — YANGI VERSIYA YAXSHIROQMI?**

| Kursning usuli | Muammo |
|---|---|
| Qo'lda 2–3 marta sinash | ## 💥 **namuna juda kichik** |
| *"Yaxshi ko'rinadi"* | ## 💥 **subyektiv** |
| Bitta misolga qarash | ## 💥 **tasodif bo'lishi mumkin** |

> ## 🏆 **YECHIM — AVTOMATIK SINOVCHI.**
>
> ## ## 🔑 **VA BU — 61-MODULDAGI `DavoTekshiruvchi` NING ## PROMPTLAR UCHUN VERSIYASI.**

---

## 4. 🔧 Prompt sinovchisi

```python
import statistics, torch, re


class PromptSinov:
    """Prompt versiyalarini AVTOMATIK tekshiradi va taqqoslaydi."""

    def __init__(self, llm, n=4):
        self.llm = llm
        self.n = n                       # har bir prompt uchun urinishlar

    def _gen(self, tizim, foydalanuvchi, urug, **gk):
        torch.manual_seed(urug)
        o = self.llm([{"role": "system", "content": tizim},
                      {"role": "user", "content": foydalanuvchi}],
                     max_new_tokens=gk.pop("max_new_tokens", 90), **gk)
        return o[0]["generated_text"][-1]["content"].strip()

    def sina(self, promptlar, kirish, tekshiruvlar, **gk):
        """promptlar: {nom: matn}
        tekshiruvlar: {nom: funksiya(javob) -> bool}
        """
        natija = {}
        for nom, p in promptlar.items():
            ballar, javoblar = [], []
            for i in range(self.n):
                j = self._gen(p, kirish, urug=i, **dict(gk))
                javoblar.append(j)
                o = sum(1 for f in tekshiruvlar.values() if f(j))
                ballar.append(o / len(tekshiruvlar))
            natija[nom] = {
                "ort": round(statistics.mean(ballar), 3),
                "std": round(statistics.pstdev(ballar), 3),
                "min": round(min(ballar), 3),
                "javoblar": javoblar,
                "tekshiruv": {t: sum(1 for j in javoblar if f(j))
                              for t, f in tekshiruvlar.items()},
            }
        return natija

    def hisobot(self, natija, tekshiruvlar):
        print(f"\n  {'prompt':18s} {'o`rt':>6} {'±std':>6} {'min':>6}  " +
              "  ".join(f"{t[:9]:>9}" for t in tekshiruvlar))
        print("  " + "-" * (40 + 11 * len(tekshiruvlar)))
        for nom, d in natija.items():
            hujayralar = "  ".join(f"{d['tekshiruv'][t]}/{self.n:<7}"
                                   for t in tekshiruvlar)
            print(f"  {nom:18s} {d['ort']:>6.2f} {d['std']:>6.3f} "
                  f"{d['min']:>6.2f}  {hujayralar}")

        eng = max(natija.items(), key=lambda kv: kv[1]["ort"])
        ikkinchi = sorted(natija.values(), key=lambda d: -d["ort"])[1:2]
        farq = eng[1]["ort"] - (ikkinchi[0]["ort"] if ikkinchi else 0)
        shovqin = 2 * max(d["std"] for d in natija.values())

        print(f"\n  🏆 eng yaxshi: {eng[0]}  ({eng[1]['ort']:.2f})")
        if farq <= shovqin:
            print(f"  ⚠️ farq {farq:.3f} <= shovqin {shovqin:.3f} — "
                  f"G'OLIB ISHONCHLI EMAS")
        else:
            print(f"  ✅ farq {farq:.3f} > shovqin {shovqin:.3f} — ishonchli")
        return eng[0]
```

### 🔬 Beshta prompt versiyasini sinaymiz

```python
PROMPTLAR = {
    "v1 oddiy":     "Ask an interview question.",
    "v2 rol":       "You are an HR interviewer at Amazon hiring a junior "
                    "Data Scientist. Ask an interview question.",
    "v3 cheklov":   "You are an HR interviewer at Amazon hiring a junior "
                    "Data Scientist. Ask EXACTLY ONE question. Do NOT answer "
                    "it. Do NOT add any preamble.",
    "v4 kursniki":  "You are an HR interviewer at Amazon hiring a junior "
                    "Data Scientist. Ask EXACTLY ONE question. Do NOT answer "
                    "it. Do NOT add any preamble. Ask each question "
                    "individually, creating a conversational flow rather than "
                    "presenting all the questions simultaneously.",
    "v5 few-shot":  "You are an HR interviewer at Amazon hiring a junior "
                    "Data Scientist. Ask EXACTLY ONE question. Do NOT answer "
                    "it. Do NOT add any preamble.\n\n"
                    "Example: Tell me about a time you had to learn a new "
                    "tool quickly.\n"
                    "Example: Describe a project where the data was messy.\n\n"
                    "Now write ONE NEW question.",
}

TEKSHIRUVLAR = {
    "bitta savol": lambda s: s.count("?") == 1,
    "preambulasiz": lambda s: not re.match(
        r"^\s*(sure|great|certainly|of course|here|okay)", s, re.I),
    "savol bilan": lambda s: s.rstrip().endswith("?"),
    "kontekstda": lambda s: any(
        x in s.lower() for x in ["data", "python", "project", "analysis",
                                 "model", "sql", "team"]),
}

sinov = PromptSinov(llm, n=4)
natija = sinov.sina(PROMPTLAR, "Hello, I'm ready.", TEKSHIRUVLAR,
                    temperature=0.8, top_p=1.0, top_k=0, do_sample=True)
sinov.hisobot(natija, TEKSHIRUVLAR)
```

### ✅ Haqiqiy natija *(n=4)*

```
  prompt               o`rt   ±std    min  bitta sav  preambula  savol bil  kontekstd
  ------------------------------------------------------------------------------------
  v1 oddiy             0.69  0.108   0.50  3/4        4/4        4/4        0/4
  v2 rol               0.75  0.177   0.50  4/4        1/4        4/4        3/4
  v3 cheklov           0.69  0.207   0.50  4/4        2/4        4/4        1/4
  v4 kursniki          0.62  0.217   0.50  4/4        1/4        4/4        1/4
  v5 few-shot          0.75  0.000   0.75  4/4        4/4        4/4        0/4

  🏆 eng yaxshi: v2 rol  (0.75)
  ⚠️ farq 0.000 <= shovqin 0.434 — G'OLIB ISHONCHLI EMAS
```

### 🔬 `n=12` bilan qayta

```
  prompt               o`rt   ±std    min  bitta sav  preambula  savol bil  kontekstd
  ------------------------------------------------------------------------------------
  v1 oddiy             0.71  0.093   0.50  10/12      12/12      12/12       0/12
  v2 rol               0.77  0.190   0.50  10/12       7/12      11/12       9/12
  v3 cheklov           0.75  0.250   0.25  11/12      10/12      10/12       5/12
  v4 kursniki          0.58  0.186   0.25  11/12       3/12      11/12       3/12
  v5 few-shot          0.77  0.069   0.75  12/12      12/12      12/12       1/12

  🏆 eng yaxshi: v2 rol  (0.77)
  ⚠️ farq 0.000 <= shovqin 0.500 — G'OLIB ISHONCHLI EMAS
```

---

## 5. 💥💥 To'rtta kutilmagan natija

### 💥 ① Kursning qo'shimchasi — **ENG YOMON**

| Versiya | `n=12` o'rt |
|---|---|
| v2 rol | ## 🏆 **0.77** |
| v5 few-shot | ## 🏆 **0.77** |
| v3 cheklov | 0.75 |
| v1 oddiy | 0.71 |
| ## **v4 kursniki** | ## 💥 **0.58** |

> ## 💥💥 **`v4` — `v3` GA KURSNING QO'SHIMCHASINI QO'SHGANIMIZ.** ## Natija **0.75 → 0.58** ga **tushdi**.
>
> ## ## 🔑 **SABAB `preambula` USTUNIDA KO'RINADI:** ## `v3` — **10/12**, `v4` — ## 💥 **3/12**. ## ## ⚠️ Qo'shimcha *"creating a conversational flow"* ## modelni **suhbat boshlashga** undadi: ## `"Great! Let's get started..."`.

> ## 🏆 **VA MANA NEGA AVTOMATIK SINOV KERAK:** ## qo'lda 2–3 marta ko'rganda ## bu **sezilmasdi**.

### 💥 ② `v5 few-shot` — eng **barqaror**, lekin kontekstdan chiqdi

| | `v5` | `v2` |
|---|---|---|
| O'rtacha | 0.77 | 0.77 |
| ## **±std** | ## 🏆 **0.069** | ## 💥 **0.190** |
| `bitta savol` | ## 🏆 **12/12** | 10/12 |
| `preambulasiz` | ## 🏆 **12/12** | 7/12 |
| ## `kontekstda` | ## 💥 **1/12** | ## 🏆 **9/12** |

> ## 💥💥 **`v5` KONTEKST TEKSHIRUVIDAN 1/12 O'TDI.**
>
> ## ## 🔑 **SABAB — MENING MISOLLARIMDA:** ## *"learn a new tool quickly"*, *"data was messy"* — ## bularda `data` bor, lekin model **umumiy savollar** yozdi. ## ## ⚠️ **Few-shot misollari modelni O'ZIGA tortadi** — ## agar misollar tor bo'lsa, natija ham **tor** bo'ladi.

> ## 🏆 **`v5` NING KUCHI — BARQARORLIK:** ## `±std 0.069` vs `v2` ning **0.190**. ## ## ⭐ **Ya'ni u har safar deyarli BIR XIL sifat beradi.**

### 💥 ③ Statistik jihatdan **g'olib yo'q**

```
farq 0.000  <=  shovqin 0.500
```

> ## 💥 **`v2` VA `v5` — TENG (0.77).**
>
> ## ## 🔑 **VA SHOVQIN CHEGARASI 0.500** — ## ya'ni **hech qanday farq ishonchli emas**.
>
> ## ## 🏆 **56-MODULDAGI DARS YANA TAKRORLANDI:** ## **`± std` siz farq — ma'nosiz.**

### 💥 ④ `n` ni oshirish yordam bermadi

| `n` | Eng yaxshi | Shovqin | Xulosa |
|---|---|---|---|
| 4 | 0.75 | 0.434 | ## ⚠️ **ishonchsiz** |
| 12 | 0.77 | 0.500 | ## ⚠️ **hali ishonchsiz** |

> ## ⚠️ **`n` OSHDI, LEKIN SHOVQIN HAM OSHDI.**
>
> ## ## 🔑 **SABAB — TEKSHIRUVLARIM ORASIDA ZIDDIYAT BOR:** ## `preambulasiz` va `kontekstda` ## ko'pincha **bir-biriga qarshi** ishlaydi.
>
> ## ## ⭐ **TO'G'RI YO'L — HAR BIR TEKSHIRUVNI ALOHIDA KUZATISH,** ## o'rtachaga emas.

---

## 5.5 🔑 Va mana **haqiqiy** xulosa

| Nima kerak | Qaysi versiya | Nega |
|---|---|---|
| ## **Format barqarorligi** | ## ⭐ **`v5 few-shot`** | 12/12, ±std 0.069 |
| ## **Mavzuga moslik** | ## ⭐ **`v2 rol`** | kontekst 9/12 |
| ## Ikkalasi | ## 🏆 **`v2` + kengroq misollar** | ## sinash kerak |
| Hech qachon | ## 💥 **`v4`** | preambula 3/12 |

> ## 🏆🏆🏆 **VA BU — QO'LDA SINASH BILAN TOPIB BO'LMAYDIGAN XULOSA.**
>
> ## ## ⭐ **Kurs `v4` ni tavsiya qiladi.** ## ## 💥 **Bizning o'lchov uni ENG YOMON deb ko'rsatdi.**

---

## 6. ⭐ Prompt sinovining to'g'ri tartibi

```
┌────────────────────────────────────────────────────────────┐
│  ① Tekshiruvlarni YOZING (prompt yozishdan OLDIN)          │
│     "Javob qanday bo'lishi kerak?" -> funksiya              │
│         ↓                                                   │
│  ② Bazaviy promptni o'lchang                               │
│         ↓                                                   │
│  ③ Bitta narsani o'zgartiring                              │
│         ↓                                                   │
│  ④ Qayta o'lchang — n >= 20                                │
│         ↓                                                   │
│  ⑤ Farq > 2×std bo'lsa — QABUL QILING                      │
│     Aks holda — TASODIF                                     │
│         ↓                                                   │
│  ⑥ Versiyani saqlang (4-dars, PromptKutubxona)             │
└────────────────────────────────────────────────────────────┘
```

> ## 💥 **ENG KO'P QILINADIGAN XATO — ① NI TASHLAB KETISH.** ## Tekshiruvsiz *"yaxshi ko'rinadi"* — ## bu **o'lchov emas, taassurot**.

---

## 🎯 Nazorat savollari

1. Kursning *"hamma savolni birdaniga"* muammosi bizda takrorlandimi?
2. Kursning qo'shimchasi natijani yaxshiladimi?
3. Qaysi prompt versiyasi eng yaxshi chiqdi?
4. G'olib ishonchlimi?
5. Prompt sinovining birinchi qadami nima?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q** — ikkala variantda ham **bitta savol** chiqdi. Sabab: boshqa model *(0.5B)* va `temperature=0`. ⚠️ Lekin qo'shimchasiz **2 ta `?`**, qo'shimcha bilan **1 ta**.
2. ## 💥 **Yo'q — natijani YOMONLASHTIRDI.** `v4` (kursniki) **0.58**, `v3` esa **0.75**. Sabab `preambula` ustunida: `v3` — **10/12**, `v4` — ## 💥 **3/12**. Qo'shimchadagi *"creating a conversational flow"* modelni `"Great! Let's get started..."` deb boshlashga undadi.
3. ## **`v2 rol` va `v5 few-shot` — teng, 0.77** *(n=12)*. Eng yomoni — ## 💥 **`v4 kursniki`, 0.58**.
4. ## **Yo'q.** Farq **0.000** *(tenglik)*, shovqin chegarasi **0.500**. `n` ni 4 dan 12 ga oshirish ham yordam bermadi. ## ⭐ **To'g'ri yo'l — o'rtachaga emas, HAR BIR TEKSHIRUVGA alohida qarash:** `v5` format bo'yicha 12/12, `v2` kontekst bo'yicha 9/12.
5. ## **Tekshiruvlarni yozish — prompt yozishdan OLDIN.** *"Javob qanday bo'lishi kerak?"* → funksiya. Tekshiruvsiz *"yaxshi ko'rinadi"* — **taassurot, o'lchov emas**.

</details>

---

⬅️ [4-dars](04-Prompt-Engineering.md) · 🏠 [Modul](README.md) · ➡️ [65-modul](../65-Getting-to-Know-Streamlit/README.md)
