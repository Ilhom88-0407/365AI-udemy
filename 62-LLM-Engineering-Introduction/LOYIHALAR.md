# 🚀 62-modul. Mini-loyihalar

> **Ikkita loyiha.** Ikkalasi ham **ishga tushirilgan va tekshirilgan**.
> Kalit **kerak emas**.

---

## 📦 Umumiy importlar

```python
import os, io, re, json, time, functools
import warnings
warnings.filterwarnings("ignore")
import tiktoken
```

---

# 💰 1-loyiha. `TokenBudjet` — narxni oldindan bilish

**Muammo:** LLM loyihasining narxi **kod yozilgandan keyin** ma'lum bo'ladi. Va u odatda **kutilganidan yuqori**.

**Yechim:** loyihani boshlashdan **oldin** hisoblaydigan asbob.

```python
class TokenBudjet:
    """LLM loyihasining token va pul byudjetini hisoblaydi.

    ⚠️ NARXLAR TEZ O'ZGARADI — har doim rasmiy sahifadan tekshiring.
    """

    NARXLAR = {   # $ / 1M token
        "gpt-4o-mini":   {"in": 0.150, "out": 0.600, "enc": "o200k_base"},
        "gpt-4o":        {"in": 2.500, "out": 10.00, "enc": "o200k_base"},
        "gpt-3.5-turbo": {"in": 0.500, "out": 1.500, "enc": "cl100k_base"},
        "mahalliy":      {"in": 0.000, "out": 0.000, "enc": "o200k_base"},
    }

    def __init__(self, model="gpt-4o-mini"):
        if model not in self.NARXLAR:
            raise ValueError(f"noma'lum model: {model}")
        self.model = model
        self.enc = tiktoken.get_encoding(self.NARXLAR[model]["enc"])

    def tok(self, matn):
        return len(self.enc.encode(matn or ""))

    def suhbat(self, tizim_prompt, navbatlar, savol_tok=40, javob_tok=120):
        """Bitta suhbatning to'liq narxini hisoblaydi.

        ⚠️ MUHIM: har bir navbatda BUTUN tarix qayta yuboriladi.
        """
        tizim = self.tok(tizim_prompt)
        kirish_jami = 0
        chiqish_jami = 0
        tarix = tizim

        qadamlar = []
        for i in range(1, navbatlar + 1):
            kirish_jami += tarix                    # ⭐ butun tarix qayta ketadi
            chiqish_jami += savol_tok + javob_tok
            tarix += savol_tok + javob_tok
            qadamlar.append({"navbat": i, "kirish": tarix, "jami_kirish": kirish_jami})

        n = self.NARXLAR[self.model]
        narx = (kirish_jami * n["in"] + chiqish_jami * n["out"]) / 1_000_000
        return {
            "model": self.model,
            "tizim_tok": tizim,
            "navbatlar": navbatlar,
            "kirish_tok": kirish_jami,
            "chiqish_tok": chiqish_jami,
            "jami_tok": kirish_jami + chiqish_jami,
            "narx_usd": round(narx, 6),
            "qadamlar": qadamlar,
        }

    def hisobot(self, tizim_prompt, navbatlar=10, foydalanuvchilar=(100, 1000, 10000)):
        d = self.suhbat(tizim_prompt, navbatlar)
        print(f"\n{'='*62}")
        print(f"  💰 {d['model']}   {navbatlar} navbatli suhbat")
        print(f"{'='*62}")
        print(f"  tizim prompt : {d['tizim_tok']:>8,} token")
        print(f"  kirish jami  : {d['kirish_tok']:>8,} token   "
              f"⚠️ tarix qayta yuboriladi")
        print(f"  chiqish jami : {d['chiqish_tok']:>8,} token")
        print(f"  JAMI         : {d['jami_tok']:>8,} token")
        print(f"  narx         : ${d['narx_usd']:.6f} / suhbat")

        print(f"\n  Tarixning o'sishi:")
        for q in d["qadamlar"][::max(1, navbatlar // 5)]:
            print(f"    {q['navbat']:>3}-navbat: kontekst {q['kirish']:>6,} token")

        print(f"\n  Masshtab:")
        for f in foydalanuvchilar:
            print(f"    {f:>7,} suhbat -> ${d['narx_usd']*f:>10,.2f}")
        return d

    def taqqosla(self, tizim_prompt, navbatlar=10):
        print(f"\n  {'model':16s} {'jami token':>12} {'narx/suhbat':>13} "
              f"{'10k suhbat':>13}")
        print("  " + "-" * 58)
        for m in self.NARXLAR:
            d = TokenBudjet(m).suhbat(tizim_prompt, navbatlar)
            print(f"  {m:16s} {d['jami_tok']:>12,} ${d['narx_usd']:>12.6f} "
                  f"${d['narx_usd']*10000:>12,.2f}")
```

### 🔬 Ishga tushiramiz

```python
TIZIM = (
    "You are an experienced HR interviewer at Google, hiring for a Data "
    "Scientist role. Conduct a realistic interview. Ask exactly one question "
    "at a time. Wait for the candidate's answer before asking the next one. "
    "After 10 questions, provide a score from 1 to 5 for each of these "
    "criteria: communication, technical depth, structure, and cultural fit. "
    "Add at least two sentences of feedback per criterion."
)

b = TokenBudjet("gpt-4o-mini")
b.hisobot(TIZIM, navbatlar=10)
b.taqqosla(TIZIM, navbatlar=10)
```

### ✅ Haqiqiy natija

```
==============================================================
  💰 gpt-4o-mini   10 navbatli suhbat
==============================================================
  tizim prompt :       82 token
  kirish jami  :    8,020 token   ⚠️ tarix qayta yuboriladi
  chiqish jami :    1,600 token
  JAMI         :    9,620 token
  narx         : $0.002163 / suhbat

  Tarixning o'sishi:
      1-navbat: kontekst    242 token
      3-navbat: kontekst    562 token
      5-navbat: kontekst    882 token
      7-navbat: kontekst  1,202 token
      9-navbat: kontekst  1,522 token

  Masshtab:
        100 suhbat -> $      0.22
      1,000 suhbat -> $      2.16
     10,000 suhbat -> $     21.63

  model              jami token   narx/suhbat    10k suhbat
  ----------------------------------------------------------
  gpt-4o-mini             9,620 $    0.002163 $       21.63
  gpt-4o                  9,620 $    0.036050 $      360.50
  gpt-3.5-turbo           9,620 $    0.006410 $       64.10
  mahalliy                9,620 $    0.000000 $        0.00
```

> ## 💥💥 **ENG MUHIM QATOR — `kirish jami: 8 020`.**
>
> ## ## 🔑 **Suhbatda faqat 1 600 token GENERATSIYA QILINDI, ## lekin 8 020 token YUBORILDI — 5.0× ko'p.**
>
> ## ⚠️ **SABAB:** har bir navbatda **butun tarix** qayta ketadi. ## Kontekst **242 → 1 522** tokenga o'sdi *(6.3×)*.

> ## 🏆 **VA MANA XULOSA:** ## `gpt-4o` `gpt-4o-mini` dan **16.7× qimmat** ## *($360.50 vs $21.63 — 10 000 suhbat uchun)*. ## ## ⭐ **Va uchalasi ham bir xil ishni qiladi.**

> ## 🔧 **BU YERDA MEN XATO QILGAN EDIM.** ## Men *"`gpt-3.5-turbo` eski tokenizator tufayli ## ko'proq token oladi"* deb kutgan edim. ## ## 💥 **HAQIQAT: uchala modelda ham 9 620 token.**
>
> ## ## 🔑 **SABAB:** tizim prompti **inglizcha**, ## va `cl100k` bilan `o200k` ## inglizcha matnni **deyarli bir xil** kodlaydi *(82 token)*. ## ## ⭐ **Tokenizator farqi FAQAT ingliz bo'lmagan matnda ko'rinadi** ## *(1-dars: o'zbekcha 23 vs 33)*.
>
> ## ⚠️ **`gpt-3.5-turbo` baribir 3.0× qimmat** — ## lekin **token soni tufayli emas, NARX tufayli**.

---

# 📋 2-loyiha. `TalablarHujjati` — o'lchanadigan spetsifikatsiya

**Muammo:** *"real bo'lsin"*, *"tez ishlasin"*, *"arzon bo'lsin"* — bular **talab emas**.

```python
class Talab:
    USTUVORLIK = {"M": "Must have", "S": "Should have",
                  "C": "Could have", "W": "Won't have"}

    def __init__(self, kod, matn, mezon=None, ustuvorlik="M", teg=None):
        if ustuvorlik not in self.USTUVORLIK:
            raise ValueError(f"noma'lum ustuvorlik: {ustuvorlik}")
        self.kod, self.matn = kod, matn
        self.mezon = mezon
        self.ustuvorlik = ustuvorlik
        self.teg = teg or []

    @property
    def olchanadi(self):
        """Mezonda RAQAM bormi?"""
        return bool(self.mezon) and bool(re.search(r"\d", self.mezon))

    def dict(self):
        return {"kod": self.kod, "matn": self.matn, "mezon": self.mezon,
                "ustuvorlik": self.ustuvorlik, "teg": self.teg,
                "olchanadi": self.olchanadi}


class TalablarHujjati:
    """Talablarni tekshiradi va hisobot beradi."""

    def __init__(self, loyiha):
        self.loyiha = loyiha
        self.talablar = []

    def qosh(self, *args, **kw):
        t = Talab(*args, **kw)
        if any(x.kod == t.kod for x in self.talablar):
            raise ValueError(f"takroriy kod: {t.kod}")
        self.talablar.append(t)
        return self

    # ---------- tekshiruv ----------
    def muammolar(self):
        p = []
        n = len(self.talablar)
        if not n:
            return ["💥 talablar yo'q"]

        olch = [t for t in self.talablar if not t.olchanadi]
        for t in olch:
            if t.ustuvorlik != "W":
                p.append(f"💥 {t.kod}: mezonda raqam yo'q — o'lchanmaydi")

        m = sum(1 for t in self.talablar if t.ustuvorlik == "M")
        if m > n * 0.6:
            p.append(f"⚠️ 'Must' {m}/{n} ({m/n*100:.0f}%) — 60% dan ko'p")
        if not any(t.ustuvorlik == "W" for t in self.talablar):
            p.append("⚠️ bitta ham 'Won't have' yo'q — nimani QILMAYSIZ?")

        teglar = {x for t in self.talablar for x in t.teg}
        for kerak in ["xavfsizlik", "maxfiylik", "narx"]:
            if kerak not in teglar:
                p.append(f"⚠️ '{kerak}' tegli talab yo'q")
        return p or ["✅ jiddiy muammo topilmadi"]

    def hisobot(self):
        n = len(self.talablar)
        o = sum(1 for t in self.talablar if t.olchanadi)
        print(f"\n{'='*72}")
        print(f"  📋 {self.loyiha}   ({n} talab)")
        print(f"{'='*72}")
        for u in ["M", "S", "C", "W"]:
            qism = [t for t in self.talablar if t.ustuvorlik == u]
            if not qism:
                continue
            print(f"\n  [{u}] {Talab.USTUVORLIK[u]}  ({len(qism)})")
            for t in qism:
                b = "✅" if t.olchanadi else "💥"
                teg = f"  #{' #'.join(t.teg)}" if t.teg else ""
                print(f"    {b} {t.kod:>4}  {t.matn}{teg}")
                if t.mezon:
                    print(f"           ⭐ {t.mezon}")
        print(f"\n  📊 o'lchanadi: {o}/{n} ({o/n*100:.0f}%)")
        print(f"\n  TEKSHIRUV:")
        for x in self.muammolar():
            print(f"    {x}")
        return self

    def json_ga(self, yol="talablar.json"):
        with io.open(yol, "w", encoding="utf-8") as f:
            json.dump({"loyiha": self.loyiha,
                       "talablar": [t.dict() for t in self.talablar]},
                      f, ensure_ascii=False, indent=2)
        return yol
```

### 🔬 Kursning talablarini kiritamiz

```python
h = (TalablarHujjati("Ace Interview")
     .qosh("T1", "Real intervyu simulyatsiyasi",
           "10 ta sinov foydalanuvchidan >=8 tasi 5 balldan >=4 beradi", "M",
           ["sifat"])
     .qosh("T2", "Lavozim va kompaniya tanlash",
           ">=20 lavozim, >=30 kompaniya", "M", ["ui"])
     .qosh("T3", "Tajriba kiritish",
           "matn maydoni <=2000 belgi", "S", ["ui"])
     .qosh("T4", "Baholash va fikr-mulohaza",
           "har bir mezon uchun 1-5 ball + >=2 jumla", "M", ["sifat"])
     .qosh("T5", "HR va texnik intervyu",
           "2 tur, har birida >=4 kategoriya", "M", ["sifat"])
     .qosh("T6", "Savollar bazasi",
           ">=200 savol, teglangan", "S", ["ma'lumot"])
     .qosh("T7", "Javob tezligi", "95-protsentil < 3 s", "S", ["ishlash"])
     .qosh("T8", "Narx", "bitta intervyu < $0.05", "C", ["narx"])
     .qosh("T9", "Prompt injection himoyasi",
           "20 ta sinov hujumining 100% i to'xtatiladi", "M", ["xavfsizlik"])
     .qosh("T10", "Ovozli interfeys", None, "W", ["ui"]))

h.hisobot()
```

### ✅ Haqiqiy natija

```
========================================================================
  📋 Ace Interview   (10 talab)
========================================================================

  [M] Must have  (5)
    ✅   T1  Real intervyu simulyatsiyasi  #sifat
           ⭐ 10 ta sinov foydalanuvchidan >=8 tasi 5 balldan >=4 beradi
    ✅   T2  Lavozim va kompaniya tanlash  #ui
           ⭐ >=20 lavozim, >=30 kompaniya
    ✅   T4  Baholash va fikr-mulohaza  #sifat
           ⭐ har bir mezon uchun 1-5 ball + >=2 jumla
    ✅   T5  HR va texnik intervyu  #sifat
           ⭐ 2 tur, har birida >=4 kategoriya
    ✅   T9  Prompt injection himoyasi  #xavfsizlik
           ⭐ 20 ta sinov hujumining 100% i to'xtatiladi

  [S] Should have  (3)
    ✅   T3  Tajriba kiritish  #ui
           ⭐ matn maydoni <=2000 belgi
    ✅   T6  Savollar bazasi  #ma'lumot
           ⭐ >=200 savol, teglangan
    ✅   T7  Javob tezligi  #ishlash
           ⭐ 95-protsentil < 3 s

  [C] Could have  (1)
    ✅   T8  Narx  #narx
           ⭐ bitta intervyu < $0.05

  [W] Won't have  (1)
    💥  T10  Ovozli interfeys  #ui

  📊 o'lchanadi: 9/10 (90%)

  TEKSHIRUV:
    ⚠️ 'maxfiylik' tegli talab yo'q
```

> ## 🏆🏆 **SINF BITTA HAQIQIY BO'SHLIQNI TOPDI:**
>
> ## ## 💥 **`maxfiylik` TEGLI TALAB YO'Q.**
>
> ## ⚠️ **VA BU — JIDDIY:** ## foydalanuvchi **rezyumesini** kiritadi. ## U **qayerga ketadi**? Saqlanadimi? Qancha vaqt? ## ## 🔑 **Kurs ham buni sanamagan edi** *(3-dars)*.

> ## ⭐ **E'TIBOR BERING — `T10` "💥" DEB BELGILANDI,** ## lekin **muammolar ro'yxatiga tushmadi**. ## ## 💡 Chunki u **`W` (Won't have)** — ## *"bu safar qilmaymiz"* deb **ataylab** yozilgan.

### ⚠️ Va endi maxfiylik talabini qo'shamiz

```python
h.qosh("T11", "Ma'lumot maxfiyligi",
       "rezyume 24 soatdan keyin o'chiriladi, uchinchi tomonga berilmaydi",
       "M", ["maxfiylik", "xavfsizlik"])
print("\n".join(h.muammolar()))
```

```
✅ jiddiy muammo topilmadi
```

> ## ✅ **`maxfiylik` OGOHLANTIRISHI YO'QOLDI.**
>
> ## ⭐ Va `Must` ulushi endi **6/11 = 55%** — ## **60% chegarasidan past**, shuning uchun ## u haqda ham ogohlantirish yo'q.
>
> ## ## 🏆 **HUJJAT TOZA.** ## Endi bu ro'yxat bilan **ishlashni boshlash mumkin**.

---

## 🎯 Loyihalarni kengaytirish

| Fikr | Qanday |
|---|---|
| Narxlarni avtomatik yangilash | Rasmiy narx sahifasidan o'qish |
| Keshlash chegirmasi | OpenAI *prompt caching* — 50% gacha |
| Tarixni qisqartirish | Faqat oxirgi N navbat — **67-modul** |
| Talablarni testga bog'lash | Har bir `mezon` → `pytest` funksiyasi |
| Markdown eksport | `h.markdown_ga("SPEC.md")` |
| Talablar o'zgarishini kuzatish | `git` + `talablar.json` |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md)
