# 7-dars. Ma'lumotlar bazasi va sxema dizayni ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Sxemani yozdik, `PRAGMA foreign_keys = ON` qo'ydik — va yolg'on ma'lumot bemalol kirdi. Sabab: PRAGMA tranzaksiya ichida JIMGINA e'tiborsiz qoldiriladi."**

---

## 1. Asosiy tushunchalar

| Tushuncha | Ta'rif |
|---|---|
| **Birlamchi kalit** *(PK)* | Har bir yozuvning **noyob** identifikatori |
| **Tashqi kalit** *(FK)* | Boshqa jadvalning PK siga **havola** |
| 1:1 | Bir yozuv — **bir** yozuv |
| 1:N | Bir yozuv — **ko'p** yozuv |
| ## N:M | ## **Ko'p — ko'p** → **oraliq jadval** kerak |

> ## ✅ **KURS BULARNI TO'G'RI TUSHUNTIRADI.**

---

## 2. ⭐⭐ Bizning sxema

**Talab:** savollar **lavozimga** ham, **kompaniyaga** ham bog'lanadi. Bitta savol **bir nechta** lavozimga mos kelishi mumkin, va bitta lavozimda **ko'p** savol bo'ladi → ## **N:M**.

```
   positions ────┐              ┌──── companies
       │         │              │         │
       │    question_position   │   question_company
       │         │              │         │
       └─────────┴── questions ─┴─────────┘

                  interviews
                  ├── position_id  (FK)
                  └── company_id   (FK)
```

```sql
CREATE TABLE positions (
    position_id   INTEGER PRIMARY KEY,
    title         TEXT NOT NULL UNIQUE,
    level         TEXT NOT NULL CHECK (level IN ('junior','mid','senior'))
);

CREATE TABLE companies (
    company_id    INTEGER PRIMARY KEY,
    name          TEXT NOT NULL UNIQUE,
    industry      TEXT
);

CREATE TABLE questions (
    question_id    INTEGER PRIMARY KEY,
    body           TEXT NOT NULL,
    interview_type TEXT NOT NULL CHECK (interview_type IN ('hr','technical')),
    category       TEXT NOT NULL
);

CREATE TABLE question_position (            -- ⭐ N:M oraliq jadval
    question_id   INTEGER NOT NULL REFERENCES questions(question_id),
    position_id   INTEGER NOT NULL REFERENCES positions(position_id),
    PRIMARY KEY (question_id, position_id)
);

CREATE TABLE question_company (             -- ⭐ N:M oraliq jadval
    question_id   INTEGER NOT NULL REFERENCES questions(question_id),
    company_id    INTEGER NOT NULL REFERENCES companies(company_id),
    PRIMARY KEY (question_id, company_id)
);

CREATE TABLE interviews (
    interview_id  INTEGER PRIMARY KEY,
    position_id   INTEGER NOT NULL REFERENCES positions(position_id),
    company_id    INTEGER NOT NULL REFERENCES companies(company_id),
    started_at    TEXT NOT NULL,
    score         INTEGER CHECK (score BETWEEN 1 AND 10),
    feedback      TEXT
);
```

### 🔬 Quramiz va o'lchaymiz

```python
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript(SXEMA)

for j in [r[0] for r in db.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]:
    ust = db.execute(f"PRAGMA table_info({j})").fetchall()
    fk = db.execute(f"PRAGMA foreign_key_list({j})").fetchall()
    print(f"{j:20s} {len(ust)} ustun · {len(fk)} tashqi kalit")
```

```
companies             3 ustun · 0 tashqi kalit
interviews            6 ustun · 2 tashqi kalit
positions             3 ustun · 0 tashqi kalit
question_company      2 ustun · 2 tashqi kalit
question_position     2 ustun · 2 tashqi kalit
questions             4 ustun · 0 tashqi kalit
```

> ## ✅ **6 ta jadval, 6 ta tashqi kalit.** ## `CHECK` cheklovlari `level`, `interview_type` va `score` da.

---

## 3. 💥💥💥 SQLite ning eng xavfli tuzog'i

### ① `CHECK` ishlaydimi?

```python
db.execute("INSERT INTO positions VALUES (1,'Data Scientist','junior')")
try:
    db.execute("INSERT INTO positions VALUES (2,'X','principal')")
except sqlite3.IntegrityError as e:
    print(f"✅ CHECK ishladi: {e}")
```

```
✅ CHECK ishladi: CHECK constraint failed: level IN ('junior','mid','senior')
```

### ② Tashqi kalit-chi?

```python
db.execute("PRAGMA foreign_keys = ON")          # ⚠️ INSERT dan KEYIN
try:
    db.execute("INSERT INTO question_position VALUES (999, 1)")
    print("💥 FK ishlamadi!")
except sqlite3.IntegrityError as e:
    print(f"✅ FK ishladi: {e}")
```

```
💥 FK ishlamadi!
```

> ## 💥💥💥 **`question_id = 999` — BUNDAY SAVOL YO'Q.** ## Lekin u **bemalol kirdi**.

### 🔬 Sababni izolyatsiya qilamiz

```python
for nom, tranzaksiya_ochiq in [("INSERT dan KEYIN pragma", True),
                               ("INSERT dan OLDIN pragma", False)]:
    d = sqlite3.connect(":memory:")
    d.executescript(S)
    if tranzaksiya_ochiq:
        d.execute("INSERT INTO positions VALUES (1,'DS')")   # tranzaksiya ochiladi
        d.execute("PRAGMA foreign_keys = ON")                # 💥 e'tiborsiz!
    else:
        d.execute("PRAGMA foreign_keys = ON")
        d.execute("INSERT INTO positions VALUES (1,'DS')")
    h = d.execute("PRAGMA foreign_keys").fetchone()[0]
    print(f"{nom:32s} pragma = {h}   in_transaction = {d.in_transaction}")
```

### 📊 Natija

| Tartib | `PRAGMA foreign_keys` | Natija |
|---|---|---|
| ## **INSERT dan keyin** | ## 💥 **0** | ## 💥 **yolg'on ma'lumot kirdi** |
| INSERT dan oldin | ## ✅ **1** | ## ✅ **FK to'xtatdi** |

> ## 💥💥💥 **`PRAGMA foreign_keys` OCHIQ TRANZAKSIYA ICHIDA ## JIMGINA E'TIBORSIZ QOLDIRILADI.**
>
> ## ## 🔑 **VA HECH QANDAY XATO BERMAYDI.** ## `PRAGMA foreign_keys` ni **o'qib ko'rmasangiz**, ## u yoqilgan deb o'ylab yuraverasiz.

### ⚠️ Va yana ikkita fakt

| Fakt | Izoh |
|---|---|
| ## SQLite da FK **standart holda O'CHIQ** | Orqaga moslik uchun |
| ## Har bir **yangi ulanishda** qayta yoqish kerak | Sozlama saqlanmaydi |

> ## ⭐ **TO'G'RI USUL — ULANISH FUNKSIYASI:**
>
> ```python
> def ulan(yol=":memory:"):
>     d = sqlite3.connect(yol)
>     d.execute("PRAGMA foreign_keys = ON")   # ⭐ BIRINCHI qator
>     d.row_factory = sqlite3.Row
>     return d
> ```
>
> ## ## 💡 **Va hech qachon `sqlite3.connect()` ni to'g'ridan-to'g'ri chaqirmang.**

---

## 4. 🔬 Savollar bazasi qancha joy oladi?

```python
o_rt = len(enc.encode("Tell me about a time you had to work with a difficult "
                      "stakeholder and how you handled the situation."))
for n in [200, 1000, 10000]:
    print(f"{n:>6,} savol -> {n*o_rt:>10,} token · {n*99/1024:>8,.0f} KB")
```

```
o'rtacha savol: 20 token

   200 savol ->      4,000 token ·       19 KB
 1,000 savol ->     20,000 token ·       97 KB
10,000 savol ->    200,000 token ·      967 KB
```

> ## ⭐ **10 000 SAVOL HAM 1 MB DAN KAM.** ## ## 🔑 **MB hajmi — MUAMMO EMAS.**
>
> ## ## 💥 **HAQIQIY MUAMMO BOSHQA:** ## har bir so'rovda promptga **faqat 2 tasi** qo'shiladi. ## ## ⚠️ **Ya'ni 10 000 savolning 99.98% i har safar ISHLATILMAYDI.**

### 💡 Va shuning uchun **tanlash mantig'i** muhim

```python
import random


def savol_tanla(db, lavozim_id, kompaniya_id, tur="hr", n=2, urug=None):
    """Lavozim VA kompaniyaga mos savollarni tanlaydi.

    Agar yetarli bo'lmasa — kengaytiradi (kompaniyasiz, keyin umumiy).
    """
    rng = random.Random(urug)

    # ① eng aniq: lavozim + kompaniya
    q = """SELECT DISTINCT q.question_id, q.body FROM questions q
           JOIN question_position qp ON qp.question_id = q.question_id
           JOIN question_company  qc ON qc.question_id = q.question_id
           WHERE qp.position_id = ? AND qc.company_id = ? AND q.interview_type = ?"""
    nat = db.execute(q, (lavozim_id, kompaniya_id, tur)).fetchall()
    manba = "lavozim+kompaniya"

    # ② kengaytirish: faqat lavozim
    if len(nat) < n:
        q2 = """SELECT DISTINCT q.question_id, q.body FROM questions q
                JOIN question_position qp ON qp.question_id = q.question_id
                WHERE qp.position_id = ? AND q.interview_type = ?"""
        nat = db.execute(q2, (lavozim_id, tur)).fetchall()
        manba = "faqat lavozim"

    # ③ oxirgi chora: umumiy
    if len(nat) < n:
        nat = db.execute(
            "SELECT question_id, body FROM questions WHERE interview_type = ?",
            (tur,)).fetchall()
        manba = "umumiy"

    if not nat:
        return [], "💥 savol topilmadi"
    return rng.sample(list(nat), min(n, len(nat))), manba
```

> ## 🏆 **UCH BOSQICHLI KENGAYTIRISH — MUHIM.** ## Yangi kompaniya qo'shilganda **savol bo'lmasligi mumkin**. ## ## 💥 Kengaytirishsiz — ilova **bo'sh promptda** yiqiladi.

---

## 5. ⭐ Kurs eslatmagan ustunlar

| Ustun | Nega kerak |
|---|---|
| ## `created_at`, `updated_at` | Qachon qo'shilgan/o'zgargan |
| ## `is_active` | ## **O'chirmasdan yashirish** |
| `source` | Savol qayerdan olingan |
| `difficulty` | Junior/senior uchun ajratish |
| ## `usage_count` | ## **Qaysi savol ko'p ishlatilgan** |
| `language` | Ko'p tillilik uchun |

> ## 💥 **`is_active` — ENG MUHIMI.** ## Savolni **o'chirsangiz**, unga havola qilgan ## eski intervyular **buziladi**. ## ## ⭐ `is_active = 0` qilib **yashiring**.

---

## 6. ⚠️ Va bitta maxfiylik masalasi

```sql
CREATE TABLE interviews (
    ...
    feedback      TEXT          -- 💥 foydalanuvchining javoblari shu yerdami?
);
```

> ## 💥💥 **INTERVYU TRANSKRIPTI — SHAXSIY MA'LUMOT.** ## Unda foydalanuvchining **ish tajribasi**, ## **oldingi ish joyi**, ba'zan **ismi** bo'ladi.
>
> ## ## 🔑 **62-MODULDA `TalablarHujjati` AYNAN SHUNI TOPGAN EDI:** ## *"'maxfiylik' tegli talab yo'q"*.

| Savol | Javob **bo'lishi kerak** |
|---|---|
| Transkript saqlanadimi? | ⚠️ **qaror qiling** |
| Qancha vaqt? | ⭐ **aniq muddat** |
| Kim ko'ra oladi? | ⭐ **faqat foydalanuvchi** |
| O'chirish mumkinmi? | ## ⭐ **HA — bu talab** |
| Shifrlanganmi? | ⭐ **kamida diskda** |

---

## 🎯 Nazorat savollari

1. Nega `question_position` oraliq jadvali kerak?
2. SQLite da tashqi kalitlar standart holda yoqilganmi?
3. `PRAGMA foreign_keys` qachon e'tiborsiz qoldiriladi?
4. 10 000 savol qancha joy oladi va bu muammomi?
5. Nega savol tanlashda uch bosqichli kengaytirish kerak?
6. Nega savolni o'chirish o'rniga `is_active = 0` qilish kerak?

<details>
<summary>Javoblar</summary>

1. Chunki bog'liqlik **N:M** — bitta savol ko'p lavozimga, bitta lavozim ko'p savolga. To'g'ridan-to'g'ri FK bilan buni ifodalab bo'lmaydi.
2. ## **Yo'q — o'chiq.** Orqaga moslik uchun. Har bir **yangi ulanishda** `PRAGMA foreign_keys = ON` qilish kerak.
3. ## **Ochiq tranzaksiya ichida.** Biz o'lchadik: `INSERT` dan keyin qo'yilgan pragma → holati **0** bo'lib qoladi va **hech qanday xato bermaydi**. Natija: yolg'on `question_id = 999` bemalol kirdi.
4. ## **967 KB** — 1 MB dan kam. **Muammo emas.** Haqiqiy muammo: har so'rovda promptga **faqat 2 tasi** kiradi, ya'ni **99.98% i ishlatilmaydi** — shuning uchun **tanlash mantig'i** muhim.
5. Yangi kompaniya qo'shilganda unga bog'langan savol **bo'lmasligi** mumkin. Kengaytirishsiz ilova **bo'sh promptda** yiqiladi. Bosqichlar: lavozim+kompaniya → faqat lavozim → umumiy.
6. Savolni **o'chirsangiz**, unga havola qilgan **eski intervyular buziladi** (FK). `is_active = 0` — tarix saqlanadi, savol yangi intervyularga tushmaydi.

</details>

---

⬅️ [6-dars](06-Initial-Prompt-Development-2.md) · 🏠 [Modul](README.md) · ➡️ [8-dars](08-What-Is-an-Activity-Diagram.md)
