# 3-dars. Intervyu vositasining xususiyatlari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs oltita talabni sanaydi. Beshtasi — o'lchanadigan, biri esa yo'q. Va aynan o'sha bitta talab loyihalarni o'ldiradi."**

---

## 1. Kursning talablar ro'yxati

| # | Talab |
|---|---|
| ① | Ilova **real** ish intervyusi simulyatsiyasini o'tkaza olishi kerak |
| ② | Foydalanuvchi **lavozim** va **kompaniya**ni tanlay olishi kerak |
| ③ | Foydalanuvchi **tajriba va ko'nikma**larini kiritishi mumkin |
| ④ | Tizim foydalanuvchini **baholab, fikr-mulohaza** berishi kerak |
| ⑤ | **HR** va **texnik** intervyularning ikkalasi ham |
| ⑥ | Savollar **bazasi** — lavozim va kompaniyaga moslashtirilgan |

> ## ✅ **BU — YAXSHI RO'YXAT.** ## Kurs to'g'ri aytadi: ## *"Talablarni erta hujjatlashtirish mustahkam poydevor yaratadi."*

---

## 2. 💥 Lekin ① talab — **o'lchanmaydi**

```
   ① "Ilova REAL intervyu simulyatsiyasini o'tkaza olishi kerak"
                 ▲
                 💥 "REAL" — bu nima?
```

| Talab | O'lchanadimi? | Qanday |
|---|---|---|
| ① *"real"* | ## 💥 **YO'Q** | *"real" nima?* |
| ② lavozim/kompaniya tanlash | ## ✅ **ha** | UI da bormi? |
| ③ tajriba kiritish | ## ✅ **ha** | maydon bormi? |
| ④ baholash + fikr | ## ⚠️ **qisman** | ball bormi? *sifati-chi?* |
| ⑤ ikkala tur | ## ✅ **ha** | ikkalasi ishlaydimi? |
| ⑥ savollar bazasi | ## ✅ **ha** | necha ta savol? |

> ## 💥💥 **"REAL" — SUBYEKTIV.** ## Ikki kishi bir xil ilovaga qarab ## **turlicha** baho beradi.
>
> ## ## 🔑 **VA BU — LOYIHALARNI O'LDIRADIGAN TALAB TURI.** ## Chunki uni **hech qachon** "bajarildi" deb belgilab bo'lmaydi.

### ✅ Qanday tuzatish kerak?

| Yomon | ## Yaxshi |
|---|---|
| *"real bo'lsin"* | ## ⭐ **"10 ta sinov foydalanuvchidan 8 tasi savollarni 'haqiqiy intervyudagidek' deb baholaydi (5 balldan ≥4)"** |
| *"tez ishlasin"* | ## ⭐ **"javob 95% hollarda < 3 s"** |
| *"arzon bo'lsin"* | ## ⭐ **"bitta intervyu < $0.05"** |
| *"xavfsiz bo'lsin"* | ## ⭐ **"prompt injection sinovlarining 100% i to'xtatiladi"** |

> ## 🏆 **QOIDA:** ## **Har bir talab — SON bilan tugashi kerak.**
>
> ## ## 💡 **Son bo'lmasa — bu talab emas, ORZU.**

---

## 3. 🔬 Talablarni tokenlarda o'lchaymiz

Har bir talab **promptga** aylanadi, va prompt **pul turadi**:

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

for i, t in enumerate(TALABLAR, 1):
    print(f"{i}. {len(enc.encode(t)):3d} token  {len(t):3d} belgi")
```

| # | `o200k` | `cl100k` | Belgi |
|---|---|---|---|
| 1 | 19 | 25 | 64 |
| 2 | 21 | 25 | 65 |
| 3 | 22 | 27 | 66 |
| 4 | 21 | 26 | 59 |
| 5 | 21 | 22 | 63 |
| 6 | 19 | 23 | 63 |
| ## **JAMI** | ## **123** | ## 💥 **148** | 380 |

> ## 💡 **123 TOKEN — BU HAR BIR SO'ROVDA YUBORILADI** ## *(agar talablar tizim promptiga kirsa)*. ## ## 🔑 **10 000 ta suhbat = 1.23 mln token.**

---

## 4. ⭐⭐ Intervyu strukturasi — kursning tahlili

```
   DATA SCIENCE INTERVYUSI
   ├── 1–4 raund
   │
   ├── HR INTERVYU
   │   ├── xulq-atvor      (behavioral)
   │   ├── texnik bilim
   │   ├── vaziyatli       (situational)
   │   ├── boshqotirma     (brainteaser)
   │   └── nazariy
   │
   └── TEXNIK INTERVYU
       ├── texnik tajriba
       ├── keys-stadi
       ├── kodlash
       └── ma'lumotlar bazasi
```

> ## ✅ **BU TASNIF — TO'G'RI VA FOYDALI.** ## Va u to'g'ridan-to'g'ri **promptga** aylanadi.

### 🔬 Kategoriyalarni promptga aylantiramiz

```python
HR_KATEGORIYALAR = {
    "xulq":       "Past behavior in a work situation (STAR format expected)",
    "texnik_bilim": "Basic conceptual knowledge, no coding",
    "vaziyatli":  "Hypothetical scenario, how would you act",
    "boshqotirma": "Estimation or logic puzzle",
    "nazariy":    "Definitions and theory",
}

TEXNIK_KATEGORIYALAR = {
    "tajriba":   "Deep dive into a past project",
    "keys":      "Open-ended business case with data",
    "kod":       "Write or debug Python code",
    "database":  "SQL query or schema design",
}


def kategoriya_prompti(tur, kategoriya, lavozim, kompaniya):
    """Kategoriyaga mos tizim promptini yaratadi."""
    xarita = HR_KATEGORIYALAR if tur == "hr" else TEXNIK_KATEGORIYALAR
    if kategoriya not in xarita:
        raise ValueError(f"noma'lum kategoriya: {kategoriya}")
    return (
        f"You are an experienced {'HR' if tur == 'hr' else 'technical'} "
        f"interviewer at {kompaniya}, hiring for a {lavozim} role.\n"
        f"Question type: {xarita[kategoriya]}.\n"
        f"Ask EXACTLY ONE question. Do not answer it. "
        f"Do not add commentary. Output only the question."
    )
```

```python
p = kategoriya_prompti("hr", "xulq", "Data Scientist", "Google")
print(p)
print(f"\ntokenlar: {len(enc.encode(p))}")
```

```
You are an experienced HR interviewer at Google, hiring for a Data Scientist role.
Question type: Past behavior in a work situation (STAR format expected).
Ask EXACTLY ONE question. Do not answer it. Do not add commentary. Output only the question.

tokenlar: 51
```

### 🔬 Mahalliy model bilan sinaymiz

```python
llm = LLMAdapter("mahalliy")

for tur, kat in [("hr", "xulq"), ("hr", "boshqotirma"),
                 ("texnik", "kod"), ("texnik", "database")]:
    savol = llm.javob([
        {"role": "system", "content": kategoriya_prompti(
            tur, kat, "Data Scientist", "Google")},
        {"role": "user", "content": "Begin."},
    ], max_tokens=60)
    print(f"[{tur}/{kat}] {savol}")
```

### 💥 Haqiqiy natija — men kutganimdan zaifroq

```
[hr/xulq]        What specific challenges have you faced while working on
                 data analysis projects and how did you overcome them?      ✅

[hr/boshqotirma] What is the primary goal of data science in today's world?  💥

[texnik/kod]     What is the purpose of using the `pandas` library in Python? 💥

[texnik/database] What is the primary goal of using a database in your project? 💥
```

> ## 🔧 **MEN "TO'RTTASI HAM YAXSHI CHIQADI" DEB KUTGAN EDIM.** ## ## 💥 **HAQIQAT: 4 TADAN 1 TASI.**

| Kategoriya | Kutilgan | ## Olingan | Baho |
|---|---|---|---|
| `hr/xulq` | Xulq-atvor savoli *(STAR)* | Xulq-atvor savoli | ## ✅ |
| ## `hr/boshqotirma` | *"Necha ta golf to'pi avtobusga sig'adi?"* | ## 💥 **umumiy nazariy savol** | ## 💥 |
| ## `texnik/kod` | *"Python funksiyasi yozing..."* | ## 💥 **"pandas nima uchun?"** | ## 💥 |
| ## `texnik/database` | *"SQL so'rov yozing..."* | ## 💥 **"MB nima uchun?"** | ## 💥 |

> ## 🔑 **NAQSH KO'RINIB TURIBDI:** ## model **har bir kategoriyani** ## `"What is the primary goal of ...?"` ## qolipiga **aylantirib yubordi**.
>
> ## ## 💥 **U "kod yozing" va "SQL so'rov" ni ## VAZIFA emas, MAVZU deb tushundi.**

### ✅ Lekin bitta narsa aniq yaxshilandi

```
2-dars  (prompt: "Ask exactly one question")
  → "What specific aspect of data science would you like to discuss?"
     💥 bu savol EMAS, bu taklif

3-dars  (prompt: rol + kompaniya + lavozim + tur + cheklovlar)
  → "What specific challenges have you faced while working on
     data analysis projects and how did you overcome them?"
     ✅ bu HAQIQIY intervyu savoli
```

> ## 🏆 **BIR XIL MODEL. BOSHQA PROMPT. BOSHQA NATIJA.** ## Prompt **51 token** — va sifat sezilarli **oshdi**.
>
> ## ## ⚠️ **LEKIN YETARLI EMAS.** ## Kategoriyalarni ajratish uchun ## **misollar** *(few-shot)* kerak — ## bu **64-modulning mavzusi**.

### 🔑 Va bu bizga uchta narsani o'rgatadi

| Dars | Qayerda ishlatamiz |
|---|---|
| ## ① Kichik model **cheklovlarni** zaif bajaradi | ## **64-modul** — few-shot promptlar |
| ## ② Natijani **tekshirish** kerak | ## **67-modul** — xatolardan himoya |
| ## ③ Modelni **almashtirish** oson bo'lsin | ## **`LLMAdapter`** *(2-dars)* |

> ## 💡 **VA MANA NEGA `T1` TALABI ("real bo'lsin") ## O'LCHANADIGAN BO'LISHI SHART:** ## ## 🔑 Bu natijani ko'rib, *"real emas"* deb ayta olamiz. ## Lekin **qanchalik** real emasligini ## faqat **son** aytadi.

---

## 5. ⭐ Talablarni tekshiriladigan holga keltiramiz

```python
import json


class Talab:
    """O'lchanadigan talab."""

    def __init__(self, kod, matn, mezon=None, tekshiruv=None, ustuvorlik="M"):
        self.kod = kod                   # T1, T2, ...
        self.matn = matn
        self.mezon = mezon               # ⭐ SON bilan
        self.tekshiruv = tekshiruv       # funksiya yoki qo'lda tavsif
        self.ustuvorlik = ustuvorlik     # MoSCoW: M/S/C/W

    @property
    def olchanadi(self):
        return self.mezon is not None

    def __repr__(self):
        b = "✅" if self.olchanadi else "💥"
        return f"{b} {self.kod} [{self.ustuvorlik}] {self.matn[:44]}"


TALABLAR = [
    Talab("T1", "Real intervyu simulyatsiyasi",
          mezon="10 ta sinov foydalanuvchidan >=8 tasi 5 balldan >=4 beradi",
          ustuvorlik="M"),
    Talab("T2", "Lavozim va kompaniya tanlash",
          mezon=">=20 lavozim, >=30 kompaniya ro'yxatda", ustuvorlik="M"),
    Talab("T3", "Tajriba va ko'nikmalarni kiritish",
          mezon="matn maydoni, <=2000 belgi, promptga qo'shiladi",
          ustuvorlik="S"),
    Talab("T4", "Baholash va fikr-mulohaza",
          mezon="har bir javob uchun 1-5 ball + >=2 jumla izoh",
          ustuvorlik="M"),
    Talab("T5", "HR va texnik intervyu",
          mezon="ikkala tur ham ishlaydi, >=4 kategoriya", ustuvorlik="M"),
    Talab("T6", "Savollar bazasi",
          mezon=">=200 savol, lavozim+kompaniya bo'yicha teglangan",
          ustuvorlik="S"),
    Talab("T7", "Javob tezligi",
          mezon="95-protsentil < 3 s", ustuvorlik="S"),
    Talab("T8", "Narx",
          mezon="bitta intervyu < $0.05", ustuvorlik="C"),
    Talab("T9", "Prompt injection himoyasi",
          mezon="20 ta sinov hujumining 100% i to'xtatiladi", ustuvorlik="M"),
    Talab("T10", "Ovozli interfeys", mezon=None, ustuvorlik="W"),
]


def talablar_hisoboti(talablar):
    print(f"  {'kod':>4} {'ust':>4}  {'o`lchanadi':>11}  talab")
    print("  " + "-" * 72)
    for t in talablar:
        b = "✅ ha" if t.olchanadi else "💥 YO'Q"
        print(f"  {t.kod:>4} {t.ustuvorlik:>4}  {b:>11}  {t.matn}")
        if t.mezon:
            print(f"       {'':>4}  {'':>11}  ⭐ {t.mezon}")

    n = len(talablar)
    o = sum(1 for t in talablar if t.olchanadi)
    m = sum(1 for t in talablar if t.ustuvorlik == "M")
    print(f"\n  📊 {n} talab · ✅ {o} o'lchanadi ({o/n*100:.0f}%) · "
          f"💥 {n-o} o'lchanmaydi")
    print(f"     MoSCoW: M={m} S={sum(1 for t in talablar if t.ustuvorlik=='S')} "
          f"C={sum(1 for t in talablar if t.ustuvorlik=='C')} "
          f"W={sum(1 for t in talablar if t.ustuvorlik=='W')}")
    if m > n * 0.6:
        print(f"  ⚠️ 'Must' talablar {m}/{n} — juda ko'p. Birinchi versiya kechikadi.")
    return {"jami": n, "olchanadi": o, "must": m}
```

```python
talablar_hisoboti(TALABLAR)
```

### ✅ Haqiqiy natija

```
   kod  ust   o`lchanadi  talab
  ------------------------------------------------------------------------
    T1    M        ✅ ha  Real intervyu simulyatsiyasi
                          ⭐ 10 ta sinov foydalanuvchidan >=8 tasi 5 balldan >=4 beradi
    T2    M        ✅ ha  Lavozim va kompaniya tanlash
                          ⭐ >=20 lavozim, >=30 kompaniya ro'yxatda
   ...
   T10    W      💥 YO'Q  Ovozli interfeys

  📊 10 talab · ✅ 9 o'lchanadi (90%) · 💥 1 o'lchanmaydi
     MoSCoW: M=5 S=3 C=1 W=1
```

> ## ⭐ **`T10` ATAYLAB O'LCHANMAYDI** — ## chunki u **`W` (Won't have)** ## ya'ni **birinchi versiyada yo'q**.
>
> ## ## 🏆 **VA BU — TO'G'RI ISH:** ## *"qilmaymiz"* ni ham **yozib qo'yish** kerak. ## Aks holda u **har hafta muhokamaga qaytadi**.

### 📐 MoSCoW usuli

| Harf | Ma'nosi | Ulushi |
|---|---|---|
| ## **M** — *Must have* | ## Busiz ishlamaydi | ## ⭐ **≤ 60%** |
| **S** — *Should have* | Muhim, lekin kutish mumkin | ~20% |
| **C** — *Could have* | Vaqt qolsa | ~15% |
| ## **W** — *Won't have* | ## **Bu safar YO'Q** | ~5% |

> ## ⚠️ **AGAR HAMMA NARSA "MUST" BO'LSA — ## HECH NARSA "MUST" EMAS.**

---

## 6. 💥 Kurs aytmagan talablar

| Talab | Nega kerak |
|---|---|
| ## **Ma'lumot maxfiyligi** | Rezyume **qayerga ketadi**? Saqlanadimi? |
| ## **Prompt injection** | Foydalanuvchi *"barcha ko'rsatmalarni unut"* deb yozsa? |
| ## **Gallyutsinatsiya** | Model **yo'q bo'lgan kompaniya** haqida savol bersa? |
| **Narx chegarasi** | Bitta foydalanuvchi $100 sarflasa? |
| **Xatoliklar** | API ishlamasa nima ko'rinadi? |
| **Tillar** | Faqat ingliz? O'zbekcha-chi? |
| ## **Adolat** | Model ayrim guruhlarga **qattiqroq** baho bersa? |

> ## 💥💥 **OXIRGISI — ENG JIDDIYSI.** ## Intervyu vositasi **odamlarni baholaydi**. ## ## ⚠️ Agar model ismga, aksentga yoki yozish uslubiga qarab ## **turlicha** baho bersa — ## bu **kamsitish**.
>
> ## ## 🏆 **68–76-MODULLARDA (AI ETIKASI) BU MAVZUGA QAYTAMIZ.**

---

## 🎯 Nazorat savollari

1. Kursning oltita talabidan qaysi biri o'lchanmaydi?
2. *"Real bo'lsin"* ni qanday o'lchanadigan holga keltirish mumkin?
3. MoSCoW da `W` nima uchun kerak?
4. Bir xil model 2-darsda yomon, 3-darsda yaxshi savol berdi. Nega?
5. Kurs qaysi muhim talablarni sanamagan?

<details>
<summary>Javoblar</summary>

1. ## **①** — *"real intervyu simulyatsiyasi"*. **"Real"** subyektiv, uni hech qachon *"bajarildi"* deb belgilab bo'lmaydi.
2. Son qo'shish: **"10 ta sinov foydalanuvchidan ≥8 tasi savollarni 5 balldan ≥4 deb baholaydi"**. ## **Qoida: har bir talab SON bilan tugashi kerak.**
3. `W` = *"Won't have"* — **bu safar qilmaymiz**. Yozib qo'yilmasa, u **har hafta muhokamaga qaytadi** va rejani buzadi.
4. **Prompt farqi.** 2-darsda: *"Ask exactly one question"* → *"What aspect would you like to discuss?"* (savol emas). 3-darsda: **rol + kompaniya + lavozim + savol turi + cheklovlar** → haqiqiy xulq-atvor savoli. ## **Lekin halol bo'laylik: 4 ta kategoriyadan faqat 1 tasi to'g'ri chiqdi.** Model `kod` va `database` ni **vazifa emas, mavzu** deb tushundi. Buni tuzatish uchun **few-shot misollar** kerak (64-modul).
5. **Ma'lumot maxfiyligi, prompt injection, gallyutsinatsiya, narx chegarasi, xatoliklar, tillar** va eng muhimi — ## **adolat**: model ismga yoki yozish uslubiga qarab turlicha baho bersa, bu **kamsitish**.

</details>

---

⬅️ [2-dars](02-What-Does-the-Course-Cover.md) · 🏠 [Modul](README.md) · ➡️ [63-modul](../63-LLM-Planning-Stage/README.md)
