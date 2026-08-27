# 🚀 63-modul. Mini-loyihalar

> **Uchta loyiha.** Uchalasi ham **ishga tushirilgan va tekshirilgan**.
> Kalit **kerak emas**.

---

## 📦 Umumiy importlar

```python
import os, io, re, json, math, sqlite3, random, warnings
warnings.filterwarnings("ignore")
import tiktoken
```

---

# 💰 1-loyiha. `LoyihaKalkulyator` — qaror qabul qiluvchi

**Muammo:** *"Hosting yoki API? Qaysi model? Qancha turadi?"* — bu savollarga **raqam bilan** javob berish kerak.

```python
class LoyihaKalkulyator:
    """LLM loyihasining texnik va moliyaviy qarorlarini hisoblaydi."""

    NARXLAR = {   # $ / 1M token — TEKSHIRING
        "gpt-4o-mini":   {"in": 0.150, "out": 0.600, "enc": "o200k_base"},
        "gpt-4o":        {"in": 2.500, "out": 10.00, "enc": "o200k_base"},
        "gpt-3.5-turbo": {"in": 0.500, "out": 1.500, "enc": "cl100k_base"},
        "mahalliy":      {"in": 0.000, "out": 0.000, "enc": "o200k_base"},
    }
    GPU_SOAT = 2.50
    BAYT = {"fp32": 4, "fp16": 2, "int8": 1, "int4": 0.5}

    def __init__(self, model="gpt-4o-mini"):
        self.model = model
        self.enc = tiktoken.get_encoding(self.NARXLAR[model]["enc"])

    # ---------- tokenlar ----------
    def tok(self, matn):
        return len(self.enc.encode(matn or ""))

    def matn_profili(self, matn):
        """Matn turini token zichligi bo'yicha baholaydi."""
        n = max(self.tok(matn), 1)
        z = len(matn) / n
        tur = ("nasr" if z >= 5.5 else "texnik" if z >= 4.0 else
               "kod/aralash" if z >= 3.0 else "raqam/JSON")
        return {"belgi": len(matn), "token": n,
                "belgi_per_token": round(z, 2), "tur": tur}

    # ---------- suhbat ----------
    def suhbat(self, tizim_tok, navbatlar, savol_tok=40, javob_tok=120,
               oyna=None, baholash_tok=0):
        kirish, tarix = 0, []
        for _ in range(navbatlar):
            kor = tarix if oyna is None else tarix[-oyna * 2:]
            kirish += tizim_tok + sum(kor)
            tarix += [savol_tok, javob_tok]
        chiqish = navbatlar * javob_tok
        if baholash_tok:
            kirish += tizim_tok + sum(tarix) + 120
            chiqish += baholash_tok
        n = self.NARXLAR[self.model]
        return {"kirish": kirish, "chiqish": chiqish,
                "narx": (kirish * n["in"] + chiqish * n["out"]) / 1e6}

    # ---------- hosting ----------
    def hosting(self, parametrlar_mlrd, aniqlik="fp16"):
        g = parametrlar_mlrd * 1e9 * self.BAYT[aniqlik] / 1024**3
        gpu = max(1, math.ceil(g * 1.4 / 80))
        hafta = self.GPU_SOAT * gpu * 24 * 7
        return {"og_irlik_GB": round(g, 2), "amaliy_GB": round(g * 1.4, 2),
                "gpu": gpu, "hafta_usd": round(hafta, 2),
                "yil_usd": round(hafta * 52, 2)}

    # ---------- qaror ----------
    def qaror(self, tizim_tok, navbatlar, suhbat_kuniga,
              parametrlar_mlrd=180, aniqlik="fp16", baholash_tok=400):
        s = self.suhbat(tizim_tok, navbatlar, baholash_tok=baholash_tok)
        h = self.hosting(parametrlar_mlrd, aniqlik)
        kunlik = s["narx"] * suhbat_kuniga
        teng = (h["hafta_usd"] / 7 / s["narx"]) if s["narx"] else float("inf")

        d = {"model": self.model,
             "suhbat": {k: (round(v, 6) if k == "narx" else v)
                        for k, v in s.items()},
             "kunlik_usd": round(kunlik, 2),
             "oylik_usd": round(kunlik * 30, 2),
             "yillik_usd": round(kunlik * 365, 2),
             "hosting": h,
             "teng_nuqta_kuniga": (round(teng) if math.isfinite(teng) else None)}
        d["tavsiya"] = ("hosting" if teng < suhbat_kuniga else "api")
        d["farq_x"] = (round(h["hafta_usd"] / 7 / max(kunlik, 1e-9), 1)
                       if kunlik else None)
        return d

    def hisobot(self, d):
        s, h = d["suhbat"], d["hosting"]
        print(f"\n{'='*64}")
        print(f"  💰 {d['model']}")
        print(f"{'='*64}")
        print(f"  suhbat   : {s['kirish']:>7,} kirish + {s['chiqish']:>5,} chiqish "
              f"= ${s['narx']:.6f}")
        print(f"  kunlik   : ${d['kunlik_usd']:>10,.2f}")
        print(f"  oylik    : ${d['oylik_usd']:>10,.2f}")
        print(f"  yillik   : ${d['yillik_usd']:>10,.2f}")
        print(f"\n  hosting  : {h['gpu']} × A100 · {h['amaliy_GB']:,} GB · "
              f"${h['hafta_usd']:,.2f}/hafta")
        if d["teng_nuqta_kuniga"]:
            print(f"  teng nuqta: {d['teng_nuqta_kuniga']:,} suhbat/kun")
        if d["farq_x"]:
            print(f"  hosting API dan {d['farq_x']}× "
                  f"{'qimmat' if d['farq_x'] > 1 else 'arzon'}")
        print(f"  🏆 TAVSIYA: {d['tavsiya'].upper()}")
        return d
```

### 🔬 Ishga tushiramiz

```python
k = LoyihaKalkulyator("gpt-4o-mini")

print(json.dumps(k.matn_profili(
    "Machine learning is a subfield of artificial intelligence."),
    indent=2, ensure_ascii=False))
print(json.dumps(k.matn_profili(
    '{"url": "https://api.openai.com/v1/chat", "id": "chatcmpl-9xY2z"}'),
    indent=2, ensure_ascii=False))

k.hisobot(k.qaror(tizim_tok=212, navbatlar=6, suhbat_kuniga=300))
k.hisobot(k.qaror(tizim_tok=212, navbatlar=6, suhbat_kuniga=500_000))
```

### ✅ Haqiqiy natija

```
{
  "belgi": 58,
  "token": 10,
  "belgi_per_token": 5.8,
  "tur": "nasr"
}
{
  "belgi": 65,
  "token": 28,
  "belgi_per_token": 2.32,
  "tur": "raqam/JSON"
}

================================================================
  💰 gpt-4o-mini
================================================================
  suhbat   :   4,964 kirish + 1,120 chiqish = $0.001417
  kunlik   : $      0.42
  oylik    : $     12.75
  yillik   : $    155.12

  hosting  : 6 × A100 · 469.39 GB · $2,520.00/hafta
  teng nuqta: 254,130 suhbat/kun
  hosting API dan 847.1× qimmat
  🏆 TAVSIYA: API

================================================================
  💰 gpt-4o-mini
================================================================
  suhbat   :   4,964 kirish + 1,120 chiqish = $0.001417
  kunlik   : $    708.30
  oylik    : $ 21,249.00
  yillik   : $258,529.50

  hosting  : 6 × A100 · 469.39 GB · $2,520.00/hafta
  teng nuqta: 254,130 suhbat/kun
  hosting API dan 0.5× arzon
  🏆 TAVSIYA: HOSTING

```

> ## 🏆 **BIR XIL LOYIHA, IKKITA TRAFIK — IKKITA TAVSIYA.**
>
> ## ⭐ **300/kun:** hosting **847.1× qimmat** → **API**
> ## ⭐ **500 000/kun:** hosting **2× arzon** → **HOSTING**

> ## 💡 **VA `matn_profili()` TURNI TO'G'RI ANIQLADI:** ## nasr **5.80** belgi/token, JSON **2.32**. ## ## 🔑 **Ya'ni "1 token = 4 belgi" — ikkalasida ham noto'g'ri:** ## nasrda **45% past**, JSON da **72% yuqori** baholaydi.

> ## ⚠️ **E'TIBOR BERING — CHIQISH 1 120 TOKEN, 1 360 EMAS.** ## 10-darsda `hisobotni_chiqar()` da **1 360** chiqqan edi. ## ## 🔑 **Farq: bu yerda `baholash_tok=400` va `navbatlar*javob_tok` ## boshqa tartibda qo'shiladi.** ## ## 💡 **Ikkala hisob ham to'g'ri — ular BOSHQA narsani modellaydi.** ## Muhimi: **qaysi formulani ishlatayotganingizni bilish.**

---

# 🗄️ 2-loyiha. `SavollarBazasi` — ishonchli MB qatlami

**Muammo:** 7-darsda topdik — `PRAGMA foreign_keys` **jimgina o'chib qoladi**, va savol tanlash **bo'sh natija** berishi mumkin.

```python
SXEMA = """
CREATE TABLE IF NOT EXISTS positions (
    position_id   INTEGER PRIMARY KEY,
    title         TEXT NOT NULL UNIQUE,
    level         TEXT NOT NULL CHECK (level IN ('junior','mid','senior'))
);
CREATE TABLE IF NOT EXISTS companies (
    company_id    INTEGER PRIMARY KEY,
    name          TEXT NOT NULL UNIQUE,
    industry      TEXT
);
CREATE TABLE IF NOT EXISTS questions (
    question_id    INTEGER PRIMARY KEY,
    body           TEXT NOT NULL,
    interview_type TEXT NOT NULL CHECK (interview_type IN ('hr','technical')),
    category       TEXT NOT NULL,
    is_active      INTEGER NOT NULL DEFAULT 1,
    usage_count    INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS question_position (
    question_id INTEGER NOT NULL REFERENCES questions(question_id),
    position_id INTEGER NOT NULL REFERENCES positions(position_id),
    PRIMARY KEY (question_id, position_id)
);
CREATE TABLE IF NOT EXISTS question_company (
    question_id INTEGER NOT NULL REFERENCES questions(question_id),
    company_id  INTEGER NOT NULL REFERENCES companies(company_id),
    PRIMARY KEY (question_id, company_id)
);
"""


class SavollarBazasi:
    """FK har doim YOQILGAN, tanlash har doim NATIJA beradi."""

    def __init__(self, yol=":memory:"):
        self.db = sqlite3.connect(yol)
        self.db.execute("PRAGMA foreign_keys = ON")   # ⭐ BIRINCHI qator!
        self.db.row_factory = sqlite3.Row
        self.db.executescript(SXEMA)
        assert self.db.execute("PRAGMA foreign_keys").fetchone()[0] == 1, \
            "💥 FK yoqilmadi"

    # ---------- yozish ----------
    def lavozim(self, title, level):
        c = self.db.execute(
            "INSERT OR IGNORE INTO positions (title, level) VALUES (?,?)",
            (title, level))
        self.db.commit()
        return c.lastrowid or self.db.execute(
            "SELECT position_id FROM positions WHERE title=?", (title,)).fetchone()[0]

    def kompaniya(self, name, industry=None):
        c = self.db.execute(
            "INSERT OR IGNORE INTO companies (name, industry) VALUES (?,?)",
            (name, industry))
        self.db.commit()
        return c.lastrowid or self.db.execute(
            "SELECT company_id FROM companies WHERE name=?", (name,)).fetchone()[0]

    def savol(self, body, tur, kategoriya, lavozimlar=(), kompaniyalar=()):
        c = self.db.execute(
            "INSERT INTO questions (body, interview_type, category) VALUES (?,?,?)",
            (body, tur, kategoriya))
        qid = c.lastrowid
        for p in lavozimlar:
            self.db.execute("INSERT OR IGNORE INTO question_position VALUES (?,?)",
                            (qid, p))
        for k in kompaniyalar:
            self.db.execute("INSERT OR IGNORE INTO question_company VALUES (?,?)",
                            (qid, k))
        self.db.commit()
        return qid

    # ---------- o'qish ----------
    def tanla(self, lavozim_id, kompaniya_id, tur="hr", n=2, urug=None):
        """Uch bosqichli kengaytirish — HAR DOIM natija beradi."""
        rng = random.Random(urug)
        bosqichlar = [
            ("lavozim+kompaniya", """
                SELECT DISTINCT q.question_id, q.body FROM questions q
                JOIN question_position qp ON qp.question_id=q.question_id
                JOIN question_company  qc ON qc.question_id=q.question_id
                WHERE qp.position_id=? AND qc.company_id=?
                  AND q.interview_type=? AND q.is_active=1""",
             (lavozim_id, kompaniya_id, tur)),
            ("faqat lavozim", """
                SELECT DISTINCT q.question_id, q.body FROM questions q
                JOIN question_position qp ON qp.question_id=q.question_id
                WHERE qp.position_id=? AND q.interview_type=? AND q.is_active=1""",
             (lavozim_id, tur)),
            ("umumiy", """
                SELECT question_id, body FROM questions
                WHERE interview_type=? AND is_active=1""",
             (tur,)),
        ]
        for nom, q, p in bosqichlar:
            r = self.db.execute(q, p).fetchall()
            if len(r) >= n:
                tanlangan = rng.sample(r, n)
                for x in tanlangan:                    # ⭐ statistika
                    self.db.execute(
                        "UPDATE questions SET usage_count=usage_count+1 "
                        "WHERE question_id=?", (x["question_id"],))
                self.db.commit()
                return [dict(x) for x in tanlangan], nom
        return [], "💥 savol topilmadi"

    def statistika(self):
        q = self.db.execute(
            "SELECT COUNT(*) c, SUM(is_active) a, SUM(usage_count) u "
            "FROM questions").fetchone()
        return {"savollar": q["c"], "faol": q["a"] or 0,
                "ishlatilgan": q["u"] or 0,
                "lavozimlar": self.db.execute(
                    "SELECT COUNT(*) c FROM positions").fetchone()["c"],
                "kompaniyalar": self.db.execute(
                    "SELECT COUNT(*) c FROM companies").fetchone()["c"]}
```

### 🔬 Ishga tushiramiz

```python
b = SavollarBazasi()
ds = b.lavozim("Data Scientist", "mid")
de = b.lavozim("Data Engineer", "senior")
g = b.kompaniya("Google", "tech")
y = b.kompaniya("Yandex", "tech")

b.savol("Tell me about a time you disagreed with a stakeholder.",
        "hr", "xulq", [ds], [g])
b.savol("How do you prioritise competing requests?", "hr", "vaziyatli", [ds], [g])
b.savol("Describe a failed project and what you learned.", "hr", "xulq", [ds])
b.savol("What motivates you?", "hr", "nazariy")

# ① to'liq mos
print(b.tanla(ds, g, n=2, urug=0)[1])
# ② kompaniyada savol yo'q -> kengaytirish
print(b.tanla(ds, y, n=2, urug=0)[1])
# ③ boshqa lavozim -> umumiy
print(b.tanla(de, y, n=2, urug=0)[1])

print(json.dumps(b.statistika(), indent=2))

# 💥 FK ishlaydimi?
try:
    b.db.execute("INSERT INTO question_position VALUES (999, 1)")
    print("💥 FK ishlamadi!")
except sqlite3.IntegrityError as e:
    print(f"✅ FK ishladi: {e}")
```

### ✅ Haqiqiy natija

```
lavozim+kompaniya
faqat lavozim
umumiy
{
  "savollar": 4,
  "faol": 4,
  "ishlatilgan": 6,
  "lavozimlar": 2,
  "kompaniyalar": 2
}
✅ FK ishladi: FOREIGN KEY constraint failed
```

> ## 🏆🏆 **UCH BOSQICH — UCHTASI HAM ISHLADI:**
>
> ## ① `Data Scientist` + `Google` → **to'liq mos**
> ## ② `Data Scientist` + `Yandex` → ## ⭐ **kompaniyada savol yo'q, lavozimga tushdi**
> ## ③ `Data Engineer` + `Yandex` → ## ⭐ **umumiy savollarga tushdi**
>
> ## ## 💥 **KENGAYTIRISHSIZ ② VA ③ — BO'SH PROMPT.**

> ## ⭐ **VA FK ISHLADI** — chunki `PRAGMA` ## **ulanishdan keyin darrov** qo'yilgan *(7-dars tuzog'i)*.

---

# 📐 3-loyiha. `DiagrammaTekshiruvchi` — CI uchun

**Muammo:** diagramma **eskiradi**, va buni hech kim sezmaydi.

```python
from collections import defaultdict


class DiagrammaTekshiruvchi:
    """Mermaid flowchart ni parse qiladi va tuzilish xatolarini topadi."""

    def __init__(self, matn):
        self.matn = matn
        self.qirralar, self.tugunlar = self._parse(matn)

    @staticmethod
    def _parse(matn):
        qirralar = defaultdict(list)
        tugunlar = {}
        for qator in matn.splitlines():
            q = qator.strip()
            if not q or q.startswith(("flowchart", "graph", "%%", "subgraph", "end")):
                continue
            for kod, ochq, ichi in re.findall(r"(\w+)([\(\[\{]+)([^\)\]\}]*)", q):
                tur = ("boshi_oxiri" if ochq.startswith("([") else
                       "qaror" if ochq.startswith("{") else "faoliyat")
                tugunlar.setdefault(kod, {"tur": tur, "matn": ichi.strip()})
            m = re.match(r"(\w+)[\(\[\{]?[^-]*?-->\s*(?:\|([^|]*)\|)?\s*(\w+)", q)
            if m:
                a, yorliq, bb = m.group(1), m.group(2), m.group(3)
                qirralar[a].append((bb, (yorliq or "").strip()))
                tugunlar.setdefault(a, {"tur": "faoliyat", "matn": ""})
                tugunlar.setdefault(bb, {"tur": "faoliyat", "matn": ""})
        return dict(qirralar), tugunlar

    # ---------- tekshiruvlar ----------
    def muammolar(self):
        p = []
        kiruvchi = defaultdict(int)
        for a, lst in self.qirralar.items():
            for b, _ in lst:
                kiruvchi[b] += 1

        boshlar = [k for k in self.tugunlar if kiruvchi[k] == 0]
        oxirlar = [k for k in self.tugunlar if not self.qirralar.get(k)]

        if len(boshlar) != 1:
            p.append(f"💥 boshlanish: {boshlar} (1 ta kerak)")
        if not oxirlar:
            p.append("💥 tugash tuguni yo'q — cheksiz oqim")

        for k, v in self.tugunlar.items():
            n = len(self.qirralar.get(k, []))
            if v["tur"] == "qaror" and n < 2:
                p.append(f"💥 {k}: qaror, lekin {n} chiqish")
            if v["tur"] == "faoliyat" and n == 0 and k not in boshlar:
                p.append(f"⚠️ {k}: chiqishsiz faoliyat")

        # ⭐ chegarasiz tsikl — 9-darsdagi muammo
        for k, lst in self.qirralar.items():
            for b, yorliq in lst:
                if b in self.qirralar and any(
                        x == k for x, _ in self.qirralar[b]):
                    if not any("urinish" in (y or "").lower() or
                               "<" in (y or "") for _, y in lst):
                        p.append(f"⚠️ {k}↔{b}: tsiklda chegara ko'rinmayapti")
        return p or ["✅ tuzilish muammosi topilmadi"]

    def yollar(self, boshi=None, oxiri=None, max_tsikl=2):
        kiruvchi = defaultdict(int)
        for a, lst in self.qirralar.items():
            for b, _ in lst:
                kiruvchi[b] += 1
        boshi = boshi or next(k for k in self.tugunlar if kiruvchi[k] == 0)
        oxiri = oxiri or next(k for k in self.tugunlar if not self.qirralar.get(k))

        natija = []

        def yur(t, yol, tashrif):
            if t == oxiri:
                natija.append(yol[:])
                return
            for b, _ in self.qirralar.get(t, []):
                if tashrif.get(b, 0) >= max_tsikl:
                    continue
                tashrif[b] = tashrif.get(b, 0) + 1
                yur(b, yol + [b], tashrif)
                tashrif[b] -= 1

        yur(boshi, [boshi], {boshi: 1})
        return natija

    def hisobot(self):
        print(f"\n  📐 tugunlar {len(self.tugunlar)} · "
              f"qirralar {sum(len(v) for v in self.qirralar.values())}")
        turlar = defaultdict(int)
        for v in self.tugunlar.values():
            turlar[v["tur"]] += 1
        print(f"     {dict(turlar)}")
        y = self.yollar()
        print(f"     yo'llar (max_tsikl=2): {len(y)} → kamida {len(y)} ta test")
        for x in self.muammolar():
            print(f"     {x}")
        return self
```

### 🔬 Ishga tushiramiz

```python
YAXSHI = """flowchart TD
    A([Boshlanish]) --> B[Ma'lumot kiritish]
    B --> C{Kompaniya tanlandimi?}
    C -->|Ha| D[Bazadan savol]
    C -->|Yo'q| E[Umumiy savollar]
    D --> F[Prompt qurish]
    E --> F
    F --> G([Tugash])
"""

BUZUQ = """flowchart TD
    A([Boshlanish]) --> B[Ma'lumot kiritish]
    B --> C{Kompaniya tanlandimi?}
    C -->|Ha| D[Bazadan savol]
    D --> E[Prompt qurish]
    F([Ikkinchi boshlanish]) --> E
"""

for nom, m in [("YAXSHI", YAXSHI), ("BUZUQ", BUZUQ)]:
    print(f"\n=== {nom} ===")
    DiagrammaTekshiruvchi(m).hisobot()
```

### ✅ Haqiqiy natija

```
=== YAXSHI ===

  📐 tugunlar 7 · qirralar 7
     {'boshi_oxiri': 2, 'faoliyat': 4, 'qaror': 1}
     yo'llar (max_tsikl=2): 2 → kamida 2 ta test
     ✅ tuzilish muammosi topilmadi

=== BUZUQ ===

  📐 tugunlar 6 · qirralar 5
     {'boshi_oxiri': 2, 'faoliyat': 3, 'qaror': 1}
     yo'llar (max_tsikl=2): 1 → kamida 1 ta test
     💥 boshlanish: ['A', 'F'] (1 ta kerak)
     💥 C: qaror, lekin 1 chiqish
     ⚠️ E: chiqishsiz faoliyat
```

> ## 🏆🏆 **UCHTA XATO HAM TOPILDI:**
>
> ## ① **ikkita boshlanish** *(`A` va `F`)*
> ## ② **qarorning bitta shoxi** — `Yo'q` yo'li **yo'q**
> ## ③ **`E` chiqishsiz** — tugash tuguni **belgilanmagan**

> ## 💡 **VA "yo'llar: 1" HAM SIGNAL:** ## yaxshi diagrammada **2 ta** yo'l bor edi, ## buzuqda — **1 ta**. ## ## 🔑 **Ya'ni qarorning bir shoxi yo'qolgan.**

> ## 💡 **CI DA ISHLATISH:**
>
> ```python
> import sys
> m = DiagrammaTekshiruvchi(open("docs/oqim.mmd").read()).muammolar()
> if any(x.startswith("💥") for x in m):
>     print("\n".join(m)); sys.exit(1)
> ```

---

## 🎯 Loyihalarni kengaytirish

| Fikr | Qanday |
|---|---|
| Narxlarni avtomatik yangilash | Provayder narx sahifasidan |
| Kesh chegirmasi | *prompt caching* — kirishga 50% |
| Savollarni import qilish | CSV/JSONL dan |
| `usage_count` bo'yicha tanlash | Kam ishlatilganini afzal ko'rish |
| Diagrammadan test skeleti | Har yo'l → `pytest` funksiyasi |
| Sxema migratsiyasi | `alembic` yoki qo'lda versiyalash |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md)
