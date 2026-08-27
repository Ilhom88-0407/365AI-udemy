# 8-dars. Tokenlarni sanash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs `cl100k_base` kodlashini tavsiya qiladi. Biz uni `o200k_base` bilan taqqoslandik: ingliz tilida farq deyarli yo'q, o'zbek tilida esa 36%."**

---

## 1. Nega OpenAI paneli yetarli emas?

Kurs uchta sababni sanaydi:

| Muammo | Ma'nosi |
|---|---|
| ## **Kechikish** | Sarflangan token panelda **darhol ko'rinmaydi** |
| ## **Bosqichlar ko'rinmaydi** | Generator? Humanizer? Baholovchi? — ## 💥 **noma'lum** |
| **Intervyu bo'yicha** | Aniq foydalanuvchi qancha sarfladi — ## 💥 **noma'lum** |

> ## 💡 **KURS TAKLIF QILGAN "OSON YO'L":** ## *"Jami tokenni intervyu soniga bo'lish"* — ## ## ⚠️ **lekin bu o'rtacha qiymat, ## va u anomaliyalarni yashiradi.**

> ## 🔑 **VA MANA NEGA BU MUHIM:** ## bitta foydalanuvchi 200 000 belgi yuborsa, ## o'rtacha ## ⭐ **buni ko'rsatmaydi**.

---

## 2. ⭐ `tiktoken` — aniq hisob

```python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")
tok = lambda s: len(enc.encode(s))
```

| Kodlash | Modellar |
|---|---|
| ## `o200k_base` | ## ⭐ **`gpt-4o`, `gpt-4o-mini`** |
| `cl100k_base` | `gpt-4`, `gpt-3.5-turbo`, `text-embedding-3` |
| `p50k_base` | eski `davinci` |

> ## ⚠️ **KURS `cl100k_base` NI TAVSIYA QILADI** ## va uni *"GPT oilasidagi ilg'or modellar uchun"* deb ataydi. ## ## 🔑 **Bu — `gpt-4` uchun to'g'ri.** ## `gpt-4o` uchun esa — **`o200k_base`**.

---

## 3. 🔬 Ikkalasini **taqqoslaymiz**

```python
NAMUNALAR = {
    "ingliz HR prompt": TIZIM,
    "ingliz javob": JAVOB,
    "JSON struktura": '{"type":"written","question_category":...}',
    "SQL so'rov": "SELECT c.name, SUM(t.amount) FROM customers c ...",
    "o'zbekcha": "Menda mashinali o'qitish modellarini ishlab chiqarishga "
                 "joylashtirish bo'yicha tajriba bor.",
}
```

### ✅ Haqiqiy natija

| Namuna | `o200k` | `cl100k` | ## Farq |
|---|---|---|---|
| ingliz HR prompt | 34 | 34 | **+0.0%** |
| ingliz javob | 53 | 54 | +1.9% |
| JSON struktura | 23 | 24 | +4.3% |
| SQL so'rov | 47 | 47 | **+0.0%** |
| ## **o'zbekcha** | ## **25** | ## **34** | ## 💥 **+36.0%** |
| ## **JAMI** | ## **182** | ## **193** | ## **+6.0%** |

> ## 🏆 **INGLIZ TILIDA — DEYARLI FARQ YO'Q** *(0–4%)*.
>
> ## ## 💥💥 **O'ZBEK TILIDA — 36%.**

> ## 🔑 **SABAB:** ## `o200k_base` lug'ati **200 000** token, ## `cl100k_base` — **100 000**. ## ## ⭐ Kattaroq lug'at — **kamroq bo'lak** ## noingliz tillar uchun.

### 💰 Va bu — pul

```
10 000 intervyu, 6 000 token/intervyu, gpt-4o kirish $2.50/1M:

  o200k_base      6,000 tok/intervyu  $  150.00
  cl100k_base     6,363 tok/intervyu  $  159.07
```

> ## 💡 **INGLIZCHA ILOVADA FARQ — $9.** ## ## 💥 **O'ZBEKCHA ILOVADA — ANCHA KO'PROQ,** ## chunki matnning **hammasi** o'zbekcha.

> ## 🏆 **QOIDA:** ## ## ⭐ **modelingizga MOS kodlashni ishlating.** ## ## 🔑 Aniq bilmasangiz: ## `tiktoken.encoding_for_model("gpt-4o")`.

---

## 4. 🔧 Bosqichma-bosqich hisoblagich

Kurs aytadi: *"Intervyudan keyin jarayonda ishlatilgan tokenlarni yig'amiz, MB ga saqlaymiz va o'z panelimizda ko'rsatamiz."*

```python
import time
import tiktoken


class TokenHisobi:
    """Har BOSQICH bo'yicha token va narxni kuzatadi."""

    NARX = {                                   # $/1M (kirish, chiqish)
        "gpt-4o":      (2.50, 10.00),
        "gpt-4o-mini": (0.150, 0.600),
        "mahalliy":    (0.0, 0.0),
    }

    def __init__(self, model="gpt-4o-mini", kodlash="o200k_base"):
        self.model = model
        self.enc = tiktoken.get_encoding(kodlash)
        self.yozuvlar = []

    def yoz(self, bosqich, xabarlar, javob, davomiylik=None):
        kirish = sum(len(self.enc.encode(m["content"])) for m in xabarlar)
        chiqish = len(self.enc.encode(javob or ""))
        ki, ch = self.NARX[self.model]
        narx = (kirish * ki + chiqish * ch) / 1e6
        self.yozuvlar.append({
            "bosqich": bosqich, "kirish": kirish, "chiqish": chiqish,
            "narx": narx, "vaqt": davomiylik})
        return narx

    def hisobot(self):
        print(f"  {'bosqich':16} {'kirish':>8} {'chiqish':>8} "
              f"{'jami':>8} {'narx':>10}")
        print("  " + "-" * 54)
        ki = ch = n = 0
        for y in self.yozuvlar:
            ki += y["kirish"]; ch += y["chiqish"]; n += y["narx"]
            print(f"  {y['bosqich']:16} {y['kirish']:8,} {y['chiqish']:8,} "
                  f"{y['kirish']+y['chiqish']:8,} ${y['narx']:9.5f}")
        print("  " + "-" * 54)
        print(f"  {'JAMI':16} {ki:8,} {ch:8,} {ki+ch:8,} ${n:9.5f}")
        return ki + ch, n
```

### ✅ Haqiqiy natija — bitta intervyu *(6 savol)*

```
  bosqich            kirish  chiqish     jami       narx
  ------------------------------------------------------
  generator             180      183      363 $  0.00014
  humanizer_1            91       41      132 $  0.00004
  humanizer_2            91       41      132 $  0.00004
  humanizer_3            91       41      132 $  0.00004
  humanizer_4            91       41      132 $  0.00004
  humanizer_5            91       41      132 $  0.00004
  humanizer_6            91       41      132 $  0.00004
  baholovchi            274      129      403 $  0.00012
  ------------------------------------------------------
  JAMI                1,000      558    1,558 $  0.00048
```

> ## 🏆 **VA MANA NEGA BOSQICHMA-BOSQICH HISOB KERAK:**
>
> ## ## ⭐ **BITTA CHAQIRUVDA eng arzoni — Humanizer** *(132 token)*. ## ## 💥 **LEKIN U 6 MARTA CHAQIRILADI — JAMI 792 token,** ## ya'ni generator (363) va baholovchidan (403) ## **ko'proq**.

| Bosqich | Chaqiruvlar | Bitta chaqiruv | ## JAMI | Ulush |
|---|---|---|---|---|
| generator | 1 | 363 | 363 | 23% |
| ## **humanizer** | ## **6** | ## ⭐ **132** | ## 💥 **792** | ## **51%** |
| baholovchi | 1 | 403 | 403 | 26% |

> ## 🔧 **MEN "HUMANIZER ARZON" DEB O'YLAGAN EDIM** — ## bitta chaqiruvga qarab.
>
> ## ## 💥 **JAMI BO'YICHA U — ENG QIMMAT BOSQICH (51%).**

> ## 🔑 **VA BU — O'RTACHA QIYMAT KO'RSATMAYDIGAN NARSA.** ## Panel *"intervyuga 1 558 token"* deb aytadi, ## qaysi bosqich ekanini esa ## ⭐ **faqat siz bilasiz**.

> ## 💡 **AMALIY XULOSA:** ## Humanizer ni optimallashtirish — ## ⭐ **eng katta ta'sir beradi** ## *(masalan tizim promptini qisqartirish: ## har chaqiruvda **6 marta** tejaladi)*.

---

## 5. ⭐ MB ga saqlash

```sql
CREATE TABLE token_hisobi (
    id          INTEGER PRIMARY KEY,
    intervyu_id TEXT    NOT NULL,
    bosqich     TEXT    NOT NULL,
    model       TEXT    NOT NULL,
    kirish      INTEGER NOT NULL CHECK (kirish  >= 0),
    chiqish     INTEGER NOT NULL CHECK (chiqish >= 0),
    narx        REAL    NOT NULL CHECK (narx    >= 0),
    vaqt        REAL,
    yaratilgan  TEXT    NOT NULL
);
CREATE INDEX idx_intervyu ON token_hisobi(intervyu_id);
CREATE INDEX idx_bosqich   ON token_hisobi(bosqich);
```

```sql
-- ⭐ eng qimmat bosqich
SELECT bosqich,
       COUNT(*)                 AS chaqiruvlar,
       SUM(kirish + chiqish)    AS tokenlar,
       ROUND(SUM(narx), 4)      AS narx,
       ROUND(AVG(kirish + chiqish)) AS ortacha
FROM token_hisobi
GROUP BY bosqich
ORDER BY narx DESC;
```

```sql
-- 💥 anomaliya: o'rtachadan 3x ko'p sarflagan intervyular
SELECT intervyu_id, SUM(kirish + chiqish) AS tokenlar
FROM token_hisobi
GROUP BY intervyu_id
HAVING tokenlar > 3 * (SELECT AVG(t) FROM
        (SELECT SUM(kirish + chiqish) AS t FROM token_hisobi
         GROUP BY intervyu_id))
ORDER BY tokenlar DESC;
```

> ## 🏆 **IKKINCHI SO'ROV — HUJUM DETEKTORI.** ## Prompt injection urinishlari odatda ## ⭐ **uzun matn** bilan keladi *(7-dars)*.

---

## 6. ⚠️ `tiktoken` — **taxminiy**, aniq emas

> ## ⚠️ **`tiktoken` FAQAT MATNNI SANAYDI.** ## API esa har xabarga ## **qo'shimcha token** qo'shadi *(rol, ajratgichlar)*.

| Manba | Aniqlik |
|---|---|
| ## `tiktoken` | ## ⭐ **~95%** — rejalashtirish uchun |
| ## API javobidagi `usage` | ## 🏆 **100%** — hisob-kitob uchun |

```python
r = client.chat.completions.create(...)
print(r.usage.prompt_tokens, r.usage.completion_tokens)   # ⭐ ANIQ
```

> ## 🏆 **TO'G'RI YONDASHUV — IKKALASI HAM:** ## ## ⭐ `tiktoken` — **so'rovdan OLDIN** ## *(chegaradan oshmaslik uchun)*, ## ## ⭐ `usage` — **so'rovdan KEYIN** ## *(haqiqiy hisob uchun)*.

---

## 7. ⭐ Kurs eslatgan muqobil — LangSmith

| | LangSmith | O'z hisoblagichingiz |
|---|---|---|
| Sozlash | ⭐ tez | bir necha soat |
| Narx | ## 💥 **pullik** | ## ⭐ **$0** |
| Ma'lumot | ## ⚠️ **tashqi xizmatda** | ## 🏆 **o'zingizda** |
| Moslashuvchanlik | cheklangan | ## ⭐ **to'liq** |

> ## 💡 **KURS HALOL AYTADI:** ## *"Bu platforma bepul emas"*.
>
> ## ## 🔑 **VA MAXFIYLIK MASALASI HAM BOR:** ## intervyu javoblari — ## ⭐ **shaxsiy ma'lumot**.

---

## 🎯 Nazorat savollari

1. Nega OpenAI paneli yetarli emas?
2. `o200k` va `cl100k` orasidagi farq qancha?
3. Bosqichma-bosqich hisob nimani ko'rsatdi?
4. `tiktoken` aniqmi?
5. Anomaliyani qanday topasiz?

<details>
<summary>Javoblar</summary>

1. ## **Kechikish**, **bosqichlar ko'rinmasligi**, va **intervyu bo'yicha ajratilmasligi**. ⚠️ O'rtacha qiymat **anomaliyalarni yashiradi**.
2. ## **Ingliz tilida — 0–4%** *(deyarli yo'q)*, ## **o'zbek tilida — 36%**. 🔑 `o200k_base` lug'ati **200 000** token, `cl100k` — **100 000**.
3. ## **Bitta chaqiruvda Humanizer eng arzon** *(132 token)*, 💥 **lekin 6 marta chaqirilgani uchun jami 792 token — 51%**, ya'ni generator (363) va baholovchidan (403) **ko'proq**. 🔧 Men buni **teskari kutgan edim**. ⭐ Optimallashtirish joyi — **Humanizer ning tizim prompti**.
4. ## **~95%.** U faqat **matnni** sanaydi; API har xabarga rol va ajratgichlar uchun **qo'shimcha token** qo'shadi. 🏆 Aniq hisob — `r.usage.prompt_tokens`.
5. ## SQL bilan: `HAVING tokenlar > 3 * (o'rtacha)`. ⭐ Prompt injection urinishlari odatda **uzun matn** bilan keladi.

</details>

---

⬅️ [7-dars](07-Prompt-Injection.md) · 🏠 [Modul](README.md) · ➡️ [9-dars](09-Cost-Reduction.md)
