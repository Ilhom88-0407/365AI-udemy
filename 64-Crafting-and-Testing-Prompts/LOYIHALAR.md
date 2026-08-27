# 🚀 64-modul. Mini-loyihalar

> **Ikkita loyiha.** Ikkalasi ham **ishga tushirilgan va tekshirilgan**.
> Kalit **kerak emas** — mahalliy model.

---

## 📦 Umumiy importlar

```python
import os, io, re, json, statistics, warnings
warnings.filterwarnings("ignore")
import torch, tiktoken
from transformers import pipeline

enc = tiktoken.get_encoding("o200k_base")
llm = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct",
               device=-1, dtype="auto")
```

---

# 🧪 1-loyiha. `PromptLab` — prompt versiyalarini halol taqqoslash

**Muammo:** *"Yangi prompt yaxshiroqmi?"* — bu savolga **qo'lda 2–3 marta sinash** javob bermaydi.

```python
class PromptLab:
    """Prompt versiyalarini o'lchaydi, taqqoslaydi va HALOL xulosa beradi.

    · har bir tekshiruv ALOHIDA kuzatiladi
    · statistik ishonchlilik tekshiriladi
    · versiyalar tokenda o'lchanadi
    """

    def __init__(self, llm, enc=None, n=12):
        self.llm = llm
        self.enc = enc or tiktoken.get_encoding("o200k_base")
        self.n = n
        self.versiyalar = {}
        self.tekshiruvlar = {}

    # ---------- sozlash ----------
    def versiya(self, nom, matn, izoh=""):
        if nom in self.versiyalar:
            raise ValueError(f"{nom} allaqachon mavjud")
        self.versiyalar[nom] = {"matn": matn, "izoh": izoh,
                                "token": len(self.enc.encode(matn))}
        return self

    def tekshiruv(self, nom, f, og_irlik=1.0):
        self.tekshiruvlar[nom] = {"f": f, "w": og_irlik}
        return self

    # ---------- o'lchov ----------
    def _gen(self, tizim, kirish, urug, **gk):
        torch.manual_seed(urug)
        o = self.llm([{"role": "system", "content": tizim},
                      {"role": "user", "content": kirish}],
                     max_new_tokens=gk.pop("max_new_tokens", 90), **gk)
        return o[0]["generated_text"][-1]["content"].strip()

    def ishga_tushir(self, kirish, **gk):
        if not self.tekshiruvlar:
            raise RuntimeError("💥 tekshiruvlar yo'q — avval ularni yozing")
        natija = {}
        for nom, v in self.versiyalar.items():
            javoblar = [self._gen(v["matn"], kirish, i, **dict(gk))
                        for i in range(self.n)]
            per = {}
            for t, d in self.tekshiruvlar.items():
                per[t] = sum(1 for j in javoblar if d["f"](j))
            jami_w = sum(d["w"] for d in self.tekshiruvlar.values())
            ballar = [
                sum(d["w"] for t, d in self.tekshiruvlar.items()
                    if d["f"](j)) / jami_w
                for j in javoblar
            ]
            natija[nom] = {
                "token": v["token"], "izoh": v["izoh"],
                "ort": round(statistics.mean(ballar), 3),
                "std": round(statistics.pstdev(ballar), 3),
                "min": round(min(ballar), 3),
                "per_tekshiruv": per, "javoblar": javoblar,
            }
        self.natija = natija
        return natija

    # ---------- hisobot ----------
    def hisobot(self):
        n = self.natija
        ts = list(self.tekshiruvlar)
        print(f"\n  {'versiya':16s} {'tok':>5} {'o`rt':>6} {'±std':>6} "
              + "  ".join(f"{t[:11]:>11}" for t in ts))
        print("  " + "-" * (36 + 13 * len(ts)))
        for nom, d in n.items():
            hujayralar = "  ".join(f"{d['per_tekshiruv'][t]:>4}/{self.n:<6}"
                                   for t in ts)
            print(f"  {nom:16s} {d['token']:>5} {d['ort']:>6.2f} "
                  f"{d['std']:>6.3f} {hujayralar}")

        # --- har bir tekshiruv bo'yicha g'olib ---
        print(f"\n  Har bir tekshiruv bo'yicha eng yaxshi:")
        for t in ts:
            eng = max(n.items(), key=lambda kv: kv[1]["per_tekshiruv"][t])
            print(f"    {t:16s} -> {eng[0]:16s} "
                  f"({eng[1]['per_tekshiruv'][t]}/{self.n})")

        # --- umumiy ---
        tartib = sorted(n.items(), key=lambda kv: -kv[1]["ort"])
        farq = tartib[0][1]["ort"] - tartib[1][1]["ort"] if len(tartib) > 1 else 0
        shovqin = 2 * max(d["std"] for d in n.values())
        print(f"\n  🏆 umumiy eng yaxshi: {tartib[0][0]} ({tartib[0][1]['ort']:.2f})")
        if farq <= shovqin:
            print(f"  ⚠️ farq {farq:.3f} <= shovqin {shovqin:.3f} — "
                  f"ISHONCHLI EMAS, n ni oshiring yoki tekshiruvlarni ayirib ko'ring")
        else:
            print(f"  ✅ farq {farq:.3f} > shovqin {shovqin:.3f} — ishonchli")

        # --- eng barqaror ---
        barqaror = min(n.items(), key=lambda kv: kv[1]["std"])
        print(f"  ⭐ eng barqaror: {barqaror[0]} (±{barqaror[1]['std']:.3f})")
        return tartib[0][0]
```

### 🔬 Ishga tushiramiz

```python
lab = (PromptLab(llm, n=12)
       .versiya("v1 oddiy", "Ask an interview question.", "baza")
       .versiya("v2 rol",
                "You are an HR interviewer at Amazon hiring a junior "
                "Data Scientist. Ask an interview question.", "rol qo'shildi")
       .versiya("v3 cheklov",
                "You are an HR interviewer at Amazon hiring a junior "
                "Data Scientist. Ask EXACTLY ONE question. Do NOT answer it. "
                "Do NOT add any preamble.", "cheklovlar")
       .versiya("v4 kursniki",
                "You are an HR interviewer at Amazon hiring a junior "
                "Data Scientist. Ask EXACTLY ONE question. Do NOT answer it. "
                "Do NOT add any preamble. Ask each question individually, "
                "creating a conversational flow rather than presenting all "
                "the questions simultaneously.", "kursning qo'shimchasi")
       .versiya("v5 few-shot",
                "You are an HR interviewer at Amazon hiring a junior "
                "Data Scientist. Ask EXACTLY ONE question. Do NOT answer it. "
                "Do NOT add any preamble.\n\n"
                "Example: Tell me about a machine learning project where the "
                "data was messy.\n"
                "Example: Describe a time you had to explain a model to a "
                "non-technical stakeholder.\n\n"
                "Now write ONE NEW question.", "kengroq misollar")
       .tekshiruv("bitta savol", lambda s: s.count("?") == 1)
       .tekshiruv("preambulasiz", lambda s: not re.match(
           r"^\s*(sure|great|certainly|of course|here|okay)", s, re.I))
       .tekshiruv("savol bilan", lambda s: s.rstrip().endswith("?"))
       .tekshiruv("kontekstda", lambda s: any(
           x in s.lower() for x in ["data", "python", "project", "analysis",
                                    "model", "sql", "team"])))

lab.ishga_tushir("Hello, I'm ready.",
                 temperature=0.8, top_p=1.0, top_k=0, do_sample=True)
lab.hisobot()
```

### ✅ Haqiqiy natija

```
  versiya            tok   o`rt   ±std bitta savol  preambulasi  savol bilan   kontekstda
  ----------------------------------------------------------------------------------------
  v1 oddiy             5   0.71  0.093   10/12        12/12        12/12         0/12
  v2 rol              18   0.77  0.190   10/12         7/12        11/12         9/12
  v3 cheklov          31   0.75  0.250   11/12        10/12        10/12         5/12
  v4 kursniki         48   0.58  0.186   11/12         3/12        11/12         3/12
  v5 few-shot         70   0.85  0.160   11/12        12/12        11/12         7/12

  Har bir tekshiruv bo'yicha eng yaxshi:
    bitta savol      -> v3 cheklov       (11/12)
    preambulasiz     -> v1 oddiy         (12/12)
    savol bilan      -> v1 oddiy         (12/12)
    kontekstda       -> v2 rol           (9/12)

  🏆 umumiy eng yaxshi: v5 few-shot (0.85)
  ⚠️ farq 0.083 <= shovqin 0.500 — ISHONCHLI EMAS, n ni oshiring yoki tekshiruvlarni ayirib ko'ring
  ⭐ eng barqaror: v1 oddiy (±0.093)
```

> ## 🏆 **KENGROQ MISOLLAR BILAN `v5` YAXSHILANDI:**
>
> ## 5-darsda `v5` **0.77**, `kontekstda` **1/12**. ## Endi — **0.85**, `kontekstda` **7/12**.
>
> ## ## 🔑 **FARQ MISOLLARDA:** ## eski: *"learn a new tool"*, *"data was messy"* ## yangi: *"machine learning project where the data was messy"*, ## *"explain a model to a non-technical stakeholder"*.
>
> ## ## ⭐ **FEW-SHOT MISOLLARI — PROMPTNING ENG MUHIM QISMI.**

> ## 💥 **VA `v4 kursniki` YANA ENG YOMON — 0.58.** ## `preambulasiz` **3/12**.

> ## ⚠️ **LEKIN STATISTIK G'OLIB HALI HAM YO'Q:** ## farq **0.083**, shovqin **0.500**. ## ## 🔑 **Sabab — `v3` ning `±std` i juda katta (0.250).** ## Bitta beqaror versiya **butun taqqoslashni** buzadi.

> ## 💡 **VA "HAR BIR TEKSHIRUV BO'YICHA" BO'LIMI ENG QIMMATLI:** ## umumiy g'olib `v5`, lekin ## ## ⭐ `bitta savol` bo'yicha — **`v3`** ## ⭐ `preambulasiz`, `savol bilan` bo'yicha — **`v1`** ## ⭐ `kontekstda` bo'yicha — **`v2`** ## ## 🏆 **Bitta "eng yaxshi prompt" yo'q — ## sizga NIMA muhimligiga bog'liq.**

---

# 📋 2-loyiha. `SozlamaTanlovchi` — vazifaga mos parametrlar

**Muammo:** `temperature` va `top_p` ni **taxminan** tanlash — ## eng ko'p uchraydigan xato.

```python
class SozlamaTanlovchi:
    """Vazifa turiga mos generatsiya sozlamalarini beradi va TEKSHIRADI."""

    PROFILLAR = {
        "deterministik": {"temperature": 0.0},
        "aniq":          {"temperature": 0.2, "top_p": 0.3, "top_k": 0},
        "muvozanatli":   {"temperature": 0.7, "top_p": 0.9, "top_k": 0},
        "ijodiy":        {"temperature": 1.0, "top_p": 1.0, "top_k": 0},
    }
    VAZIFALAR = {
        "json": "deterministik", "sql": "deterministik", "hisob": "deterministik",
        "baholash": "deterministik",
        "kod": "aniq", "tarjima": "aniq", "xulosa": "aniq",
        "tahrirlash": "muvozanatli", "savol": "muvozanatli",
        "chatbot": "ijodiy", "gaya": "ijodiy",
    }
    XAVFLI = 1.2          # bundan yuqorida matn buziladi (2-dars o'lchovi)

    def __init__(self, llm=None):
        self.llm = llm

    def sozlama(self, vazifa, max_tokens=200):
        prof = self.VAZIFALAR.get(vazifa)
        if prof is None:
            raise ValueError(f"noma'lum vazifa: {vazifa}. "
                             f"Mavjud: {sorted(self.VAZIFALAR)}")
        gk = dict(self.PROFILLAR[prof])
        gk["max_new_tokens"] = max_tokens
        gk["do_sample"] = gk.get("temperature", 0.0) > 0
        if not gk["do_sample"]:
            gk.pop("temperature", None)
            gk.pop("top_p", None)
            gk.pop("top_k", None)
        return prof, gk

    def ogohlantir(self, **gk):
        """Xavfli sozlamalarni aytadi."""
        p = []
        t = gk.get("temperature")
        if t is not None and t > self.XAVFLI:
            p.append(f"💥 temperature={t} > {self.XAVFLI} — matn buzilishi mumkin")
        if gk.get("do_sample") and t == 0:
            p.append("⚠️ do_sample=True, lekin temperature=0 — ziddiyat")
        if "max_new_tokens" not in gk:
            p.append("⚠️ max_tokens yo'q — cheksiz chiqish xavfi")
        if gk.get("top_p") == 0:
            p.append("💥 top_p=0 — hech qanday token qolmaydi")
        return p or ["✅ sozlama xavfsiz"]

    def barqarorlik(self, vazifa, tizim, kirish, n=5):
        """Sozlama haqiqatan barqarorlik berayotganini TEKSHIRADI."""
        if self.llm is None:
            raise RuntimeError("llm berilmagan")
        prof, gk = self.sozlama(vazifa, max_tokens=60)
        javoblar = []
        for i in range(n):
            torch.manual_seed(i)
            o = self.llm([{"role": "system", "content": tizim},
                          {"role": "user", "content": kirish}], **dict(gk))
            javoblar.append(o[0]["generated_text"][-1]["content"].strip())
        noyob = len(set(javoblar))
        return {"vazifa": vazifa, "profil": prof, "noyob": noyob, "n": n,
                "barqaror": noyob == 1,
                "kutilgan": prof == "deterministik"}

    def hisobot(self, vazifalar, tizim, kirish, n=5):
        print(f"\n  {'vazifa':12s} {'profil':14s} {'noyob':>7} "
              f"{'kutilgan':>10}  holat")
        print("  " + "-" * 60)
        for v in vazifalar:
            d = self.barqarorlik(v, tizim, kirish, n)
            mos = (d["barqaror"] == d["kutilgan"])
            print(f"  {v:12s} {d['profil']:14s} {d['noyob']}/{d['n']:<5} "
                  f"{'barqaror' if d['kutilgan'] else 'o`zgaruvchan':>10}  "
                  f"{'✅' if mos else '💥 KUTILGANDEK EMAS'}")
        return self
```

### 🔬 Ishga tushiramiz

```python
st = SozlamaTanlovchi(llm)

for v in ["json", "kod", "savol", "chatbot"]:
    prof, gk = st.sozlama(v)
    print(f"{v:10s} -> {prof:14s} {gk}")

print()
print("\n".join(st.ogohlantir(temperature=1.8, do_sample=True)))
print("\n".join(st.ogohlantir(temperature=0.7, top_p=0.9, do_sample=True,
                              max_new_tokens=200)))

st.hisobot(["json", "kod", "savol", "chatbot"],
           "You are a helpful assistant.",
           "Give one short tip for writing clean Python code.")
```

### ✅ Haqiqiy natija

```
json       -> deterministik  {'max_new_tokens': 200, 'do_sample': False}
kod        -> aniq           {'temperature': 0.2, 'top_p': 0.3, 'top_k': 0, 'max_new_tokens': 200, 'do_sample': True}
savol      -> muvozanatli    {'temperature': 0.7, 'top_p': 0.9, 'top_k': 0, 'max_new_tokens': 200, 'do_sample': True}
chatbot    -> ijodiy         {'temperature': 1.0, 'top_p': 1.0, 'top_k': 0, 'max_new_tokens': 200, 'do_sample': True}

💥 temperature=1.8 > 1.2 — matn buzilishi mumkin
⚠️ max_tokens yo'q — cheksiz chiqish xavfi
✅ sozlama xavfsiz

  vazifa       profil           noyob   kutilgan  holat
  ------------------------------------------------------------
  json         deterministik  1/5       barqaror  ✅
  kod          aniq           1/5     o`zgaruvchan  💥 KUTILGANDEK EMAS
  savol        muvozanatli    5/5     o`zgaruvchan  ✅
  chatbot      ijodiy         5/5     o`zgaruvchan  ✅
```

> ## 💥💥💥 **`kod` — "KUTILGANDEK EMAS" DEB BELGILANDI.**
>
> ## Men `temperature=0.2, top_p=0.3` ni ## **"o'zgaruvchan"** deb kutgan edim. ## ## 🏆 **HAQIQAT: 1/5 — YA'NI BARQAROR.**

> ## 🔑 **SABAB — `top_p=0.3`.** ## 2-darsda o'lchagan edik: ## `top_p=0.1` da `temperature=1.0` bo'lsa ham **deterministik**. ## ## ⭐ **`top_p=0.3` + `temperature=0.2` — ## ro'yxatni shunchalik qisqartiradiki, ## natija amalda BITTA bo'lib qoladi.**

> ## 🏆🏆 **VA MANA NEGA BU ASBOB KERAK:** ## u mening **kutganimni rad etdi**, ## va **tuzatish kerakligini** ko'rsatdi:
>
> ```
> VAZIFALAR = {..., "kod": "deterministik"}   # ⭐ "aniq" emas
> ```
>
> ## ## 💡 **Yoki — `barqaror` kutilishini profil emas, ## O'LCHOV bo'yicha belgilash.**

> ## ⚠️ **VA E'TIBOR BERING — SINOV VAZIFASI QISQA EDI** ## *("Give one short tip...")*. ## Uzunroq vazifada `top_p=0.3` ham ## **o'zgaruvchan** bo'lishi mumkin. ## ## 🔑 **Barqarorlik — sozlama VA vazifa uzunligining birgalikdagi natijasi.**

---

## 🎯 Loyihalarni kengaytirish

| Fikr | Qanday |
|---|---|
| Tekshiruvlarga og'irlik | `tekshiruv(..., og_irlik=2.0)` |
| Natijalarni saqlash | JSONL + `git` |
| A/B test | Ikkita versiyani **foydalanuvchilarga** |
| LLM-baholovchi | Boshqa model javobni **baholaydi** |
| Regressiya testi | CI da — prompt o'zgarsa **qayta o'lchash** |
| Narx kuzatuvi | Har bir versiyaning **token narxi** |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md)
