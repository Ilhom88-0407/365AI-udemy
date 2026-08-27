# 4-dars. Texnik intervyu promptining tuzilishi ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: 'butun SQLite faylini promptga solishga urindik — juda ko'p token yedi'. Biz uni o'lchadik: 128 791 token. Ularning yechimi esa — 216 token. 596 barobar farq."**

---

## 1. Ikkita yangi savol turi

| Tur | Nima | Ko'rinishi |
|---|---|---|
| `written` | Matnli savol | Oddiy matn maydoni |
| ## `coding` | ## ⭐ **Python / R masala** | ## **Kod muharriri** + misol |
| ## `database` | ## ⭐ **SQL so'rov** | ## **MB ko'rinishi** |

```json
{
  "type": "coding",
  "question_category": "coding",
  "question_text": "Write a function that returns the second largest element.\n\nExample:\nInput: [3, 1, 4, 1, 5]\nOutput: 4",
  "current_question": 5
}
```

> ## ⭐ **`type` MAYDONI — VEB ILOVA UCHUN KALIT.** ## U qaysi **ko'rinishni** ochishni aytadi.

> ## 💡 **VA KURS AYTADI:** ## *"Kodlash savollariga yetganda **Humanizer o'chiriladi**"* — ## chunki masala **suhbat emas, topshiriq**.

---

## 2. 💥💥 Uchta urinish — **ikkitasi muvaffaqiyatsiz**

Kurs MB savollari uchun **uchta yechimni** sinaganini aytadi:

| Urinish | Natija |
|---|---|
| ① Butun SQLite faylni satrga aylantirib promptga solish | ## 💥 **juda katta** |
| ② LLM ning o'zi MB yaratishi | ## 💥 **token chegarasi**, 20 dan ortiq yozuv yo'q |
| ## ③ **Tayyor MB + qisqa xulosa** | ## 🏆 **ishladi** |

### 🔬 **Birinchi urinishni o'lchaymiz**

Uchta jadvalli, **4 550 yozuvli** moliya bazasi:

```python
import sqlite3, tiktoken

enc = tiktoken.get_encoding("o200k_base")
tok = lambda s: len(enc.encode(s))

toliq = "\n".join(fdb.iterdump())          # ⭐ butun MB
sxema = "\n".join(r[0] for r in fdb.execute(
    "SELECT sql FROM sqlite_master WHERE sql IS NOT NULL"))
```

### ✅ Haqiqiy natija

```
① butun MB dump :   341,368 belgi    128,791 token
② faqat sxema   :       358 belgi         86 token
③ QISQA XULOSA  :       628 belgi        216 token

🏆 dump -> xulosa: 596x kichikroq
```

> ## 💥💥💥 **128 791 TOKEN — `gpt-4o` KONTEKST OYNASI 128 000.**
>
> ## Ya'ni bu MB **umuman sig'maydi**. ## ⭐ Va bu — atigi **4 550 yozuv**.

> ## ✅ **KURS MUTLAQO HAQ.** ## *"SQLite bazalari juda katta, ko'p token yeydi"* — ## ⭐ **o'lchov buni to'liq tasdiqladi**.

---

## 3. 🏆 Uchinchi yechim — **qisqa xulosa**

Kurs aytadi:

> *"Biz **ixcham xulosalar** yaratdik. Bu xulosalar MB tuzilishi haqida muhim ma'lumot berdi: jadval nomlari, ma'lumot turlari, jadvallar orasidagi bog'lanishlar. Shuningdek, **ma'lumot yozuvlari haqida aniq tafsilotlar** ham kiritdik. Masalan, moliyaviy bazada tranzaksiya sanalari **2022 dan 2024 gacha** ekanini ko'rsatdik."*

### 🔧 Buni **avtomatik** qilamiz

```python
def xulosa_yasa(conn, nom, tavsif):
    """SQLite bazasidan LLM uchun IXCHAM xulosa quradi."""
    q = [f"Database: {nom}", tavsif, ""]

    for (jadval,) in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"):
        n = conn.execute(f"SELECT COUNT(*) FROM {jadval}").fetchone()[0]
        ustunlar = [(r[1], r[2]) for r in
                    conn.execute(f"PRAGMA table_info({jadval})")]
        q.append(f"TABLE {jadval} ({n} rows): " +
                 ", ".join(f"{c} {t}" for c, t in ustunlar))

        for c, t in ustunlar:
            if t.upper() == "DATE":                 # ⭐ SANA DIAPAZONI
                mn, mx = conn.execute(
                    f"SELECT MIN({c}), MAX({c}) FROM {jadval}").fetchone()
                q.append(f"  {c}: {mn} .. {mx}")
            elif t.upper() == "TEXT" and c != "ism":
                v = [r[0] for r in conn.execute(
                    f"SELECT DISTINCT {c} FROM {jadval} LIMIT 8")]
                if len(v) <= 8:                     # ⭐ KAM QIYMATLI USTUN
                    q.append(f"  {c}: {v}")

    fk = []
    for (jadval,) in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"):
        for r in conn.execute(f"PRAGMA foreign_key_list({jadval})"):
            fk.append(f"{jadval}.{r[3]} -> {r[2]}.{r[4]}")
    if fk:
        q.append("RELATIONS: " + "; ".join(fk))

    return "\n".join(q)
```

### ✅ Haqiqiy natija — **216 token**

```
Database: moliya
Financial transactions for a fintech company.

TABLE mijozlar (200 rows): id INTEGER, ism TEXT, mamlakat TEXT, ro_yxatdan DATE
  mamlakat: ['US', 'DE', 'JP', 'UZ']
  ro_yxatdan: 2020-01-15 .. 2022-09-15
TABLE hisoblar (350 rows): id INTEGER, mijoz_id INTEGER, valyuta TEXT, ochilgan DATE
  valyuta: ['USD', 'UZS', 'EUR']
  ochilgan: 2020-01-20 .. 2022-09-20
TABLE tranzaksiyalar (4000 rows): id INTEGER, hisob_id INTEGER, summa REAL, sana DATE, turi TEXT
  sana: 2022-01-01 .. 2024-12-28
  turi: ['transfer', 'credit', 'debit']
RELATIONS: hisoblar.mijoz_id -> mijozlar.id; tranzaksiyalar.hisob_id -> hisoblar.id
```

> ## 🏆🏆 **KURS AYTGAN HAMMA NARSA BOR:**
>
> ## ⭐ jadval nomlari ✅ ## ⭐ ma'lumot turlari ✅ ## ⭐ bog'lanishlar ✅ ## ⭐ **sana diapazoni** ✅ *(`2022-01-01 .. 2024-12-28`)*

> ## 💡 **VA MANA NEGA SANA DIAPAZONI MUHIM** *(kurs ta'kidlaydi)*: ## ## 💥 **usiz LLM `2021` yil tranzaksiyalarini so'rashi mumkin** — ## ular esa **umuman yo'q**.

### ⚠️ Nega faqat sxema (86 token) yetarli emas?

| | Sxema | ## Xulosa |
|---|---|---|
| Jadval, ustun, tur | ✅ | ✅ |
| Bog'lanishlar | ✅ | ✅ |
| ## **Yozuvlar soni** | ## ❌ | ## ⭐ **✅** |
| ## **Sana diapazoni** | ## ❌ | ## ⭐ **✅** |
| ## **Mumkin qiymatlar** | ## ❌ | ## ⭐ **✅** |

> ## 🏆 **+130 TOKEN — VA LLM ENDI "2021" DEB SO'RAMAYDI.**

---

## 4. 💰 Narx — **har intervyuda ikki marta**

MB tavsifi **savol generatoriga** va **baholovchiga** yuboriladi.

| Yondashuv | Tokenlar ×2 | 1 intervyu | ## 10 000 intervyu |
|---|---|---|---|
| ## Butun dump | 257 582 | $0.6440 | ## 💥 **$6 439.55** |
| Faqat sxema | 172 | $0.0004 | $4.30 |
| ## **Qisqa xulosa** | ## 432 | ## $0.0011 | ## 🏆 **$10.80** |

> ## 💥💥 **$6 439 vs $10.80 — 596 BAROBAR.**
>
> ## ## ⭐ **VA XULOSA SXEMADAN ATIGI $6.50 QIMMAT** ## *(10 000 intervyuga)* — ## lekin **sifat ancha yuqori**.

---

## 5. ⭐ Baholovchi SQL javobni **qanday tekshiradi**?

Kurs aytadi:

> *"Bu fikr-mulohaza LLM idan to'g'ri so'rov tuzilishini tushunishni, **so'rovni MB ga qarshi bajarishni**, va chiqish kutilgan natijaga mos kelishini tekshirishni talab qildi."*

### 🔧 Xavfsiz bajarish

```python
import sqlite3


def sql_tekshir(mb_yoli, foydalanuvchi_sql, kutilgan_sql, vaqt_chegarasi=2.0):
    """Foydalanuvchi SQL ini XAVFSIZ bajaradi va natijani taqqoslaydi."""
    taqiq = ("insert", "update", "delete", "drop", "alter",
             "create", "attach", "pragma")
    past = foydalanuvchi_sql.lower()
    for t in taqiq:
        if t in past:
            return None, f"💥 taqiqlangan buyruq: {t}"

    try:
        conn = sqlite3.connect(f"file:{mb_yoli}?mode=ro", uri=True)   # ⭐ FAQAT O'QISH
        conn.set_progress_handler(lambda: None, 100_000)              # ⭐ cheksiz sikl
        haqiqiy = conn.execute(foydalanuvchi_sql).fetchall()
        kutilgan = conn.execute(kutilgan_sql).fetchall()
    except sqlite3.Error as e:
        return None, f"💥 SQL xatosi: {e}"
    finally:
        try: conn.close()
        except Exception: pass

    return (sorted(map(str, haqiqiy)) == sorted(map(str, kutilgan))), "ok"
```

### ✅ Haqiqiy natija — olti holat

```
  to'g'ri            natija=True   ok
  boshqa tartib      natija=True   ok            ← ⭐ ORDER BY farq qilmadi
  noto'g'ri          natija=False  ok
  zararli            natija=None   💥 taqiqlangan buyruq: drop
  yashirin zararli   natija=None   💥 taqiqlangan buyruq: delete
  sintaksis xato     natija=None   💥 SQL: near "tranzaksiyalar": syntax error

  MB omon qoldimi: 50 yozuv
```

> ## 🏆 **OLTITA HOLAT — OLTITASI HAM TO'G'RI ISHLADI,** ## va MB **omon qoldi**.
>
> ## ## ⭐ **E'TIBOR BERING — `SELECT 1; DELETE FROM ...`** ## ham tutildi. ## 🔑 Bu — klassik **SQL injection** shakli.

> ## ⭐ **UCHTA HIMOYA:** ## ① **`mode=ro`** — MB ni o'zgartirib bo'lmaydi, ## ② **taqiqlangan so'zlar** ro'yxati, ## ③ **`set_progress_handler`** — cheksiz so'rov to'xtatiladi.

> ## 💥 **NEGA BU SHART?** ## Foydalanuvchi `DROP TABLE tranzaksiyalar;` yozishi mumkin. ## ## 🔑 Bu — **SQL injection ning intervyu versiyasi**.

> ## ⚠️ **VA TARTIB MUHIM:** ## `sorted(...)` — chunki `ORDER BY` bo'lmasa ## SQL natija tartibi **kafolatlanmaydi**.

---

## 6. 🏆 To'liq oqim

```
sozlash
  |
  +--> MB dan 2 savol (bosqichma-bosqich yumshatish)
  +--> MB xulosasi (216 token)
  |
  v
[1] GENERATOR --> 6 savol: 3 written, 1 coding, 1 database, 1 written
  |
  +--> written --> [2] HUMANIZER --> jonlantirilgan savol
  +--> coding  --> ⭐ HUMANIZER O'CHIRILADI --> to'g'ridan-to'g'ri
  +--> database--> ⭐ HUMANIZER O'CHIRILADI --> MB ko'rinishi
  |
  v
[3] BAHOLOVCHI  <-- tarix + MB xulosasi + kod misollari
```

> ## 💡 **E'TIBOR BERING — MB XULOSASI IKKI JOYGA BORADI:** ## generatorга *(savol yaratish uchun)* ## va baholovchiga *(javobni tekshirish uchun)*. ## ## 🔑 Shuning uchun 4-bo'limda **×2** hisobladik.

---

## 🎯 Nazorat savollari

1. Butun SQLite dump qancha token oladi?
2. Nega faqat sxema yetarli emas?
3. Nega sana diapazoni muhim?
4. `coding` savolda Humanizer nima qiladi?
5. Foydalanuvchi SQL ini bajarishda qanday himoya kerak?

<details>
<summary>Javoblar</summary>

1. ## **128 791 token** *(4 550 yozuvli uchta jadval)*. 💥 Bu — `gpt-4o` kontekst oynasidan (128 000) **kattaroq**, ya'ni umuman sig'maydi. ⭐ Qisqa xulosa — **216 token**, 596× kichik.
2. Sxemada **yozuvlar soni**, **sana diapazoni** va **mumkin qiymatlar** yo'q. ⭐ Xulosa +130 token evaziga bularni beradi.
3. ## **LLM mavjud bo'lmagan ma'lumotni so'ramasligi uchun.** Kurs misoli: baza `2022–2024` bo'lsa, LLM `2021` yilni so'rasa — savol **javobsiz**.
4. ## **O'chiriladi.** Kodlash savoli — **suhbat emas, topshiriq**; u **aynan** berilishi kerak.
5. ## ① `mode=ro` *(faqat o'qish)*, ② **taqiqlangan so'zlar** ro'yxati (`DROP`, `DELETE`...), ③ **`set_progress_handler`** *(cheksiz so'rov)*. ⚠️ Va natijani `sorted()` bilan taqqoslang — `ORDER BY` bo'lmasa tartib kafolatlanmaydi.

</details>

---

⬅️ [3-dars](03-Prompt-Structure-HR.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Additional-Protection-From-Errors.md)
