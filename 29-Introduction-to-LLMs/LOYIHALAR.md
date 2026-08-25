# 🚀 29-modul mini-loyihalari

> **6 ta tayyor loyiha.** Hammasi **ishlab tekshirilgan**.
>
> Bu modul nazariy, lekin loyihalar — **haqiqiy asboblar**: model tanlash, baholash va **o'zbek tilida tekshirish** uchun.

## ⚙️ Umumiy tayyorgarlik

```python
import warnings; warnings.filterwarnings("ignore")
import time
import numpy as np
import pandas as pd
from pathlib import Path
from transformers import pipeline, AutoModel, AutoTokenizer
```

---

# 🔍 1-loyiha. Model pasporti

> **Maqsad:** istalgan Hugging Face modeli haqida **to'liq ma'lumot** oladigan vosita.
> Yangi model bilan ishlashdan **oldin** ishlatiladi.

```python
def model_pasporti(model_id):
    """Model haqida to'liq texnik ma'lumot."""
    natija = {"model": model_id}

    try:
        tok = AutoTokenizer.from_pretrained(model_id)
        natija["lug'at"] = tok.vocab_size
        natija["maks_uzunlik"] = getattr(tok, "model_max_length", "?")
    except Exception as e:
        natija["tokenizator"] = f"❌ {type(e).__name__}"

    try:
        m = AutoModel.from_pretrained(model_id)
        n = sum(p.numel() for p in m.parameters())
        natija["parametr"] = n
        natija["hajm_MB"] = round(n * 4 / 1e6, 1)      # float32 = 4 bayt
        natija["arxitektura"] = m.config.model_type
        natija["qatlamlar"] = getattr(m.config, "num_hidden_layers", "?")
        natija["yashirin_o'lcham"] = getattr(m.config, "hidden_size", "?")
    except Exception as e:
        natija["model_yuklash"] = f"❌ {type(e).__name__}"

    return natija


modellar = [
    "distilbert-base-uncased-finetuned-sst-2-english",
    "cardiffnlp/twitter-roberta-base-sentiment-latest",
    "nlptown/bert-base-multilingual-uncased-sentiment",
]
df = pd.DataFrame([model_pasporti(m) for m in modellar])
df["model"] = df.model.str.split("/").str[-1].str[:34]
print(df.to_string(index=False))
```

```
                             model  lug'at                    maks_uzunlik  parametr  hajm_MB arxitektura  qatlamlar  yashirin_o'lcham
distilbert-base-uncased-finetuned-   30522                             512  66362880    265.5  distilbert          6               768
twitter-roberta-base-sentiment-lat   50265 1000000000000000019884624838656 124645632    498.6     roberta         12               768
bert-base-multilingual-uncased-sen  105879                             512 167356416    669.4        bert         12               768
```

### 📖 Pasportni qanday o'qish

```
lug'at 105 879        →  KO'P TILLI model (104 til)
qatlamlar 6 vs 12     →  distilbert "distillangan" — YARIM qatlam, shuning uchun tez
yashirin_o'lcham 768  →  UCHALASIDA BIR XIL — farq lug'at va qatlamlar sonida
hajm_MB 669           →  RAM va disk talabi (float32 = 4 bayt/parametr)
```

### 😲 IKKINCHI QATORGA QARANG — `maks_uzunlik`

```
1000000000000000019884624838656
              ↑
      Bu — HAQIQIY chegara EMAS!
```

> ## ⚠️ **Bu — `int(1e30)` — "chegara O'RNATILMAGAN" degan MAXSUS QIYMAT.**
>
> RoBERTa tokenizatorining sozlamasida `model_max_length` **ko'rsatilmagan**, shuning uchun `transformers` ushbu "cheksizlik" qiymatini qo'yadi.
>
> ## ❌ **Lekin modelning HAQIQIY chegarasi baribir 512** — RoBERTa'ning pozitsion embeddinglari shuncha.
>
> **Isbot:**
> ```python
> m = AutoModel.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")
> print(m.config.max_position_embeddings)     # → 514  (512 + 2 xizmat tokeni)
> ```

> ## 🔑 **SABOQ: `model_max_length` ga KO'R-KO'RONA ishonmang.**
>
> Agar bu raqamga ishonib `truncation=False` qo'ysangiz, uzun matnda **model ishga tushib, keyin xato beradi** — yoki bundan ham yomoni, **noto'g'ri natija** qaytaradi.
>
> **Ishonchli usul:** `config.max_position_embeddings` ni tekshiring yoki shunchaki **doim `truncation=True`** qo'ying.

---

# ⚖️ 2-loyiha. Model taqqoslash paneli

> **Maqsad:** bir nechta modelni **bir xil ma'lumotda** halol solishtirish.

```python
def taqqoslash_paneli(matnlar, haqiqiy, modellar, bazaviy=True):
    """Modellarni bir xil ma'lumotda solishtiradi."""
    qatorlar = []

    if bazaviy:
        eng_kop = pd.Series(haqiqiy).value_counts().index[0]
        qatorlar.append({
            "model": "BAZAVIY (eng ko'p sinf)",
            "parametr": 0,
            "aniqlik": round(float(np.mean([y == eng_kop for y in haqiqiy])), 3),
            "noaniq": 0,
            "vaqt_sek": 0.0,
        })

    for nom, model_id, ozgartir in modellar:
        t0 = time.time()
        p = pipeline("sentiment-analysis", model=model_id, truncation=True)
        pred = [ozgartir(r) for r in p(list(matnlar))]
        qatorlar.append({
            "model": nom,
            "parametr": sum(x.numel() for x in p.model.parameters()),
            "aniqlik": round(sum(a == b for a, b in zip(pred, haqiqiy)) / len(haqiqiy), 3),
            "noaniq": pred.count("?"),
            "vaqt_sek": round(time.time() - t0, 1),
        })

    df = pd.DataFrame(qatorlar).sort_values("aniqlik", ascending=False)
    df["parametr"] = df.parametr.map(lambda x: f"{x:,}" if x else "—")
    return df


def yulduz(r):
    n = int(r["label"].split()[0])
    return "ijobiy" if n >= 4 else ("salbiy" if n <= 2 else "?")

MODELLAR = [
    ("distilbert EN", "distilbert-base-uncased-finetuned-sst-2-english",
     lambda r: "ijobiy" if r["label"] == "POSITIVE" else "salbiy"),
    ("bert KO'P TILLI", "nlptown/bert-base-multilingual-uncased-sentiment", yulduz),
]
```

### 🧪 Sinov ① — INGLIZ kitob sharhlari

```python
d = pd.read_csv("../26-Text-Classifier/data/book_reviews_sample.csv")
d = d[d.rating != 3].copy()
d["y"] = (d.rating > 3).map({True: "ijobiy", False: "salbiy"})

print(taqqoslash_paneli(d.reviewText, d.y.tolist(), MODELLAR).to_string(index=False))
```

> ## ✅ **Bu yerda `distilbert EN` — 0.976** *(6-darsda o'lchangan)*, bazaviydan **+42 punkt**.

### 🧪 Sinov ② — 🇺🇿 O'ZBEK jumlalari

```python
IJOBIY = ["Bu kitob juda ajoyib va qiziqarli", "Zo'r asar, hammaga tavsiya qilaman",
          "Menga judayam yoqdi, ajoyib chiqibdi", "Mazmuni chuqur, tili ravon",
          "Ajoyib kitob, bir o'tirishda o'qib chiqdim", "Muallifga rahmat, juda foydali",
          "Sifati yaxshi, narxi arzon", "Qiziqarli syujet, kutilmagan yakun"]
SALBIY = ["Juda zerikarli va sifatsiz kitob", "Vaqtimni behuda sarfladim, yomon",
          "Umuman yoqmadi, zerikarli asar", "Tili og'ir, tushunish qiyin",
          "Puliga arzimaydi, afsus", "Yarmida tashlab qo'ydim, zerikarli",
          "Sifati past, sahifalari yirtilgan", "Kutganimdek chiqmadi, tavsiya qilmayman"]
X_uz = IJOBIY + SALBIY
y_uz = ["ijobiy"] * 8 + ["salbiy"] * 8

print(taqqoslash_paneli(X_uz, y_uz, MODELLAR).to_string(index=False))
```

```
                  model     parametr  aniqlik  noaniq  vaqt_sek
          distilbert EN   66,955,010    0.562       0       2.1
BAZAVIY (eng ko'p sinf)            —    0.500       0       0.0
        bert KO'P TILLI  167,360,261    0.500       3       2.4
```

> ## 📉 **167 MILLIONLIK MODEL — BAZAVIY DARAJADA.**
>
> `bazaviy` qatorini panelga **ataylab** qo'shdik. Usiz **0.500** ni ko'rib *"yomonroq, lekin ishlayapti"* deb o'ylash mumkin edi.
>
> ## 🔑 **Bazaviy bilan solishtirilganda ma'lum bo'ladi: model UMUMAN o'rganmagan.**
>
> Bu — **26-modulning 3-tuzog'i**: `DummyClassifier` bilan solishtirmaslik. LLM davrida ham **aynan shu** tuzoq.

---

# 🇺🇿 3-loyiha. O'zbek tili uchun LLM tayyorlik testi

> **Maqsad:** yangi modelni o'zbek tilida **avtomatik** sinash.
> ⭐ **Yangi model ko'rganingizda BIRINCHI ishlatadigan skriptingiz.**

```python
UZ_SINOV = [
    ("Bu kitob juda ajoyib va qiziqarli",         "ijobiy"),
    ("Zo'r asar, hammaga tavsiya qilaman",        "ijobiy"),
    ("Menga judayam yoqdi, ajoyib chiqibdi",      "ijobiy"),
    ("Sifati yaxshi, narxi arzon",                "ijobiy"),
    ("Juda zerikarli va sifatsiz kitob",          "salbiy"),
    ("Vaqtimni behuda sarfladim, yomon",          "salbiy"),
    ("Umuman yoqmadi, zerikarli asar",            "salbiy"),
    ("Kutganimdek chiqmadi, tavsiya qilmayman",   "salbiy"),
]


def uz_tayyorlik(model_id, ozgartir, batafsil=True):
    """Model o'zbek tilida ishlaydimi? Halol javob."""
    try:
        p = pipeline("sentiment-analysis", model=model_id, truncation=True)
    except Exception as e:
        print(f"❌ Yuklab bo'lmadi: {type(e).__name__}")
        return None

    matnlar = [t for t, _ in UZ_SINOV]
    haqiqiy = [y for _, y in UZ_SINOV]
    natijalar = p(matnlar)
    pred = [ozgartir(r) for r in natijalar]

    aniqlik = sum(a == b for a, b in zip(pred, haqiqiy)) / len(haqiqiy)
    ort_ball = float(np.mean([r["score"] for r in natijalar]))
    bir_xil = len(set(pred)) == 1                 # hammaga bir xil javob?

    print(f"\n{'='*60}")
    print(f"  {model_id}")
    print(f"{'='*60}")
    print(f"  parametr   : {sum(x.numel() for x in p.model.parameters()):,}")
    print(f"  aniqlik    : {aniqlik:.3f}   (bazaviy = 0.500)")
    print(f"  o'rt. ball : {ort_ball:.3f}")

    # ── TASHXIS ────────────────────────────────────────
    print("\n  TASHXIS:")
    if bir_xil:
        print(f"  ❌ HAMMAGA bir xil javob ('{pred[0]}') → model TUSHUNMAYAPTI")
    if aniqlik <= 0.55:
        print("  ❌ Bazaviy darajada → model O'RGANMAGAN")
    if aniqlik <= 0.55 and ort_ball > 0.8:
        print("  ⚠️⚠️ ISHONCH BILAN YANGLISHMOQDA — ENG XAVFLI HOLAT")
    if aniqlik >= 0.85:
        print("  ✅ Ishlayapti — lekin KATTAROQ namunada qayta tekshiring")

    if batafsil:
        print("\n  XATOLAR:")
        xato = 0
        for (t, tr), r, pr in zip(UZ_SINOV, natijalar, pred):
            if pr != tr:
                xato += 1
                print(f"    {r['label']:9s}({r['score']:.2f}) → {pr:7s} "
                      f"| to'g'risi: {tr:7s} | {t[:42]}")
        if not xato:
            print("    yo'q ✅")

    print(f"\n  ⚠️ Namuna: {len(UZ_SINOV)} ta jumla — bu KAM.")
    print("     Aniq raqamga emas, NAQSHGA ishoning.")
    return {"model": model_id, "aniqlik": round(aniqlik, 3),
            "ort_ball": round(ort_ball, 3), "bir_xil": bir_xil}
```

### 🧪 Ishlatish

```python
def yulduz(r):
    n = int(r["label"].split()[0])
    return "ijobiy" if n >= 4 else ("salbiy" if n <= 2 else "?")

uz_tayyorlik("distilbert-base-uncased-finetuned-sst-2-english",
             lambda r: "ijobiy" if r["label"] == "POSITIVE" else "salbiy")
uz_tayyorlik("nlptown/bert-base-multilingual-uncased-sentiment", yulduz)
```

> ## 🎯 **Ikkita tashxis belgisi ENG MUHIM:**
>
> ```
> ① bir_xil = True        →  model hammaga BIR XIL javob beryapti
>                            (o'ylayotgandek ko'rinadi, aslida yo'q)
>
> ② aniqlik ≈ 0.5  VA  ort_ball > 0.8
>                         →  ISHONCH BILAN YANGLISHMOQDA
>                            ⚠️ ENG XAVFLI: ball sizni aldaydi
> ```
>
> ## 💡 **Ikkinchi belgi — bu darslikdagi eng muhim amaliy topilmalardan biri.** Ball `0.986` bo'lsa ham model **noto'g'ri** bo'lishi mumkin — ball *"men ishonchim komil"* degani, *"men haqman"* degani **emas**.

---

# 🧭 4-loyiha. Vosita tanlash yordamchisi

> **Maqsad:** *"Qaysi vositani ishlatay?"* savoliga **dalilga asoslangan** javob.

```python
def vosita_tanla(vazifa, til="ingliz", yorliqli_malumot=False,
                 hajm=1000, tushuntirish_kerak=False, byudjet="past"):
    """20-29-modullardagi o'lchangan natijalarga asoslangan tavsiya."""

    if tushuntirish_kerak:
        return ("sklearn (26-modul)",
                ["Qarorni TUSHUNTIRISH kerak → coef_ bo'lishi shart",
                 "LLM 'nima uchun' savoliga javob bermaydi"])

    if hajm > 100_000 and byudjet == "past":
        return ("sklearn (26-modul)",
                [f"{hajm:,} ta hujjat + past byudjet",
                 "sklearn: ~10 sek, $0 | LLM: soatlar, $$$"])

    if til.lower() not in ("ingliz", "english", "en"):
        if yorliqli_malumot:
            return ("O'z sklearn modelingiz (28-modul uznlp)",
                    [f"{til} tili tayyor modellarda zaif qo'llanadi",
                     "O'lchangan: o'zbekcha sklearn 0.625 vs LLM 0.500",
                     "Sizda yorliqli ma'lumot BOR → foydalaning"])
        return ("LLM'ga so'rov (GPT/Claude) + MAJBURIY tekshirish",
                [f"{til} tilida yorliqli ma'lumot yo'q",
                 "Tayyor transformer ISHLAMAYDI (o'lchangan)",
                 "⚠️ Natijani QO'LDA tekshiring"])

    if vazifa in ("sentiment", "tasniflash", "ner", "savol-javob"):
        return ("AVVAL zero-shot pipeline() ni sinang",
                ["Ingliz tili + keng tarqalgan vazifa",
                 "O'lchangan: zero-shot 0.976 vs sklearn 0.869",
                 "10 daqiqa vaqt oladi — yetarli bo'lsa, TAYYOR"])

    return ("LLM (generativ)", ["Bu vazifa uchun klassik ML muqobili yo'q"])


HOLATLAR = [
    ("sentiment",  "ingliz", False, 1_000,     False, "o'rta"),
    ("sentiment",  "o'zbek", True,  500,       False, "past"),
    ("sentiment",  "o'zbek", False, 500,       False, "past"),
    ("tasniflash", "ingliz", True,  2_000_000, False, "past"),
    ("sentiment",  "ingliz", True,  1_000,     True,  "yuqori"),
]
for h in HOLATLAR:
    tavsiya, sabab = vosita_tanla(*h)
    print(f"\n{h[0]} | {h[1]} | yorliq={h[2]} | {h[3]:,} ta | tushuntirish={h[4]}")
    print(f"  → {tavsiya}")
    for s in sabab:
        print(f"     · {s}")
```

```
sentiment | ingliz | yorliq=False | 1,000 ta | tushuntirish=False
  → AVVAL zero-shot pipeline() ni sinang

sentiment | o'zbek | yorliq=True | 500 ta | tushuntirish=False
  → O'z sklearn modelingiz (28-modul uznlp)

sentiment | o'zbek | yorliq=False | 500 ta | tushuntirish=False
  → LLM'ga so'rov (GPT/Claude) + MAJBURIY tekshirish

tasniflash | ingliz | yorliq=True | 2,000,000 ta | tushuntirish=False
  → sklearn (26-modul)

sentiment | ingliz | yorliq=True | 1,000 ta | tushuntirish=True
  → sklearn (26-modul)
```

> ## 🎯 **5 ta holatdan FAQAT BITTASIDA zero-shot tavsiya etildi.**
>
> Bu — LLM'ga qarshi emas. Bu — **to'g'ri vosita tanlash**. Va bu tanlovni **siz** qila olasiz, chunki **20–28-modullarni** o'tgansiz.

---

# 📏 5-loyiha. Uzunlik va kesish tekshiruvi

> **Maqsad:** `maks_uzunlik = 512` cheklovining ma'lumotingizga **haqiqiy** ta'sirini o'lchash.

```python
def kesish_tahlili(matnlar, model_id="distilbert-base-uncased-finetuned-sst-2-english"):
    """Qancha matn kesiladi va bu natijaga ta'sir qiladimi?"""
    tok = AutoTokenizer.from_pretrained(model_id)
    chek = tok.model_max_length

    uzunliklar = [len(tok.encode(t, truncation=False,
                                 add_special_tokens=True)) for t in matnlar]
    u = pd.Series(uzunliklar)
    kesiladi = (u > chek).sum()

    print(f"model chegarasi : {chek} token")
    print(f"o'rtacha uzunlik: {u.mean():.0f}")
    print(f"eng uzun        : {u.max()}")
    print(f"KESILADI        : {kesiladi} / {len(u)}  ({100*kesiladi/len(u):.1f}%)")
    print(f"\nkvantillar: {u.quantile([.5, .9, .99]).round(0).to_dict()}")
    return u, kesiladi


d = pd.read_csv("../26-Text-Classifier/data/book_reviews_sample.csv")
u, kesiladi = kesish_tahlili(d.reviewText.tolist())
```

```
model chegarasi : 512 token
o'rtacha uzunlik: 24
eng uzun        : 30
KESILADI        : 0 / 100  (0.0%)

kvantillar: {0.5: 25.0, 0.9: 27.0, 0.99: 30.0}
```

> ## ✅ **NATIJA: BU MA'LUMOTDA MUAMMO YO'Q.** Eng uzun sharh — **30 token**, chegara esa **512**. Kesish **umuman sodir bo'lmaydi**.

### 🤔 Unda nima uchun bu loyiha kerak?

> ## 🔑 **AYNAN SHUNING UCHUN.**
>
> ```
> ❌ TAXMIN:   "sharhlar uzun bo'lsa kerak, truncation kerak"
> ✅ O'LCHOV:  eng uzuni 30 token — muammo YO'Q
> ```
>
> Agar o'lchamaganingizda, **yo'q muammoni hal qilishga** vaqt sarflagan bo'lardingiz — yoki bundan yomoni, `truncation=True` ni **ko'r-ko'rona** qo'yib, **boshqa** ma'lumotda **jimgina** ma'lumot yo'qotgan bo'lardingiz.
>
> ## 💡 **27-modul saboqi yana:** taxmin qilmang — **o'lchang**.

### ⚠️ Bu ma'lumotda emas — LEKIN qayerda muammo BO'LADI?

```
kitob sharhlari (26-modul)      →   24 token o'rtacha   ✅ muammo yo'q
yangilik maqolalari (27-modul)  →  ~500+ token          ⚠️ TEKSHIRING
ilmiy maqolalar                 →   1000+ token         ❌ ALBATTA kesiladi
huquqiy shartnomalar            →  10 000+ token        ❌ jiddiy muammo
```

> ## 🔑 **Shuning uchun bu skriptni HAR BIR yangi ma'lumot to'plamida ishga tushiring** — 5 soniya vaqt oladi, keyin bilib ishlaysiz.

### Agar kesiladigan matn bo'lsa — ta'sirini o'lchang

```python
def kesish_tasiri(matnlar, model_id="distilbert-base-uncased-finetuned-sst-2-english"):
    """To'liq matn va uning YARMI bir xil javob beradimi?"""
    p = pipeline("sentiment-analysis", model=model_id, truncation=True)
    ozgargan = 0
    for t in matnlar:
        sozlar = t.split()
        if len(sozlar) < 60:
            continue
        tola = p(t)[0]
        yarim = p(" ".join(sozlar[:len(sozlar) // 2]))[0]
        if tola["label"] != yarim["label"]:
            ozgargan += 1
            print(f"⚠️ O'ZGARDI: to'liq={tola['label']}({tola['score']:.2f}) "
                  f"yarim={yarim['label']}({yarim['score']:.2f})")
            print(f"   {t[:80]}...")
    print(f"\nJavob o'zgargan matnlar: {ozgargan}")
    return ozgargan
```

> ## 🔑 **Nima uchun bu MUHIM?**
>
> ```
> Sharhning XULOSASI ko'pincha OXIRIDA bo'ladi:
>    "...syujeti qiziq edi, personajlar yaxshi ishlangan,
>     LEKIN UMUMAN OLGANDA TAVSIYA QILMAYMAN."
>                    ↑
>        Kesilsa — AYNAN SHU qism yo'qoladi
> ```
>
> ## ⚠️ **`truncation=True` xato bermaydi — u JIMGINA ma'lumot yo'qotadi.** Shuning uchun uni **o'lchash** kerak.
>
> **Javob o'zgarsa → uch yechim:**
> ```
> ① Matnni BO'LAKLASH va natijalarni birlashtirish
> ② Matnning OXIRINI olish (boshini emas)
> ③ Uzun kontekstli model (longformer, bigbird)
> ```

---

# 🎓 6-loyiha. Yakuniy loyiha — LLM baholash to'plami

> **Maqsad:** 1–5-loyihalarni **bitta sinfga** jamlash.

```python
class LLMBaholash:
    """Modelni ishlatishdan OLDIN to'liq baholash."""

    def __init__(self, model_id, ozgartir):
        self.model_id = model_id
        self.ozgartir = ozgartir
        self.p = pipeline("sentiment-analysis", model=model_id, truncation=True)
        self.tok = AutoTokenizer.from_pretrained(model_id)

    # ── 1-loyiha ───────────────────────────────────────
    def pasport(self):
        n = sum(x.numel() for x in self.p.model.parameters())
        return {
            "parametr": f"{n:,}",
            "hajm_MB": round(n * 4 / 1e6, 1),
            "lug'at": self.tok.vocab_size,
            "maks_uzunlik": self.tok.model_max_length,
            "arxitektura": self.p.model.config.model_type,
        }

    # ── 2-loyiha ───────────────────────────────────────
    def bahola(self, matnlar, haqiqiy):
        pred = [self.ozgartir(r) for r in self.p(list(matnlar))]
        eng_kop = pd.Series(haqiqiy).value_counts().index[0]
        return {
            "aniqlik": round(sum(a == b for a, b in zip(pred, haqiqiy)) / len(haqiqiy), 3),
            "bazaviy": round(float(np.mean([y == eng_kop for y in haqiqiy])), 3),
            "bir_xil_javob": len(set(pred)) == 1,
        }

    # ── 5-loyiha ───────────────────────────────────────
    def uzunlik(self, matnlar):
        u = pd.Series([len(self.tok.encode(t, truncation=False)) for t in matnlar])
        kesiladi = int((u > self.tok.model_max_length).sum())
        return {"o'rtacha": int(u.mean()), "maks": int(u.max()),
                "kesiladi": kesiladi,
                "kesiladi_%": round(100 * kesiladi / len(u), 1)}

    # ── TO'LIQ HISOBOT ─────────────────────────────────
    def hisobot(self, matnlar, haqiqiy):
        print("=" * 62)
        print(f"  {self.model_id}")
        print("=" * 62)

        print("\n① PASPORT")
        for k, v in self.pasport().items():
            print(f"   {k:14s}: {v}")

        print("\n② UZUNLIK")
        for k, v in self.uzunlik(matnlar).items():
            print(f"   {k:14s}: {v}")

        print("\n③ ANIQLIK")
        b = self.bahola(matnlar, haqiqiy)
        for k, v in b.items():
            print(f"   {k:14s}: {v}")

        print("\n④ QAROR")
        farq = b["aniqlik"] - b["bazaviy"]
        if b["bir_xil_javob"]:
            print("   ❌ ISHLATMANG — hammaga bir xil javob beryapti")
        elif farq < 0.05:
            print(f"   ❌ ISHLATMANG — bazaviydan atigi +{farq:.3f}")
        elif farq < 0.20:
            print(f"   ⚠️ EHTIYOT — bazaviydan +{farq:.3f}, kuchsiz")
        else:
            print(f"   ✅ ISHLATSA BO'LADI — bazaviydan +{farq:.3f}")
        print("=" * 62)
        return b
```

### 🧪 Ishlatish

```python
d = pd.read_csv("../26-Text-Classifier/data/book_reviews_sample.csv")
d = d[d.rating != 3].copy()
d["y"] = (d.rating > 3).map({True: "ijobiy", False: "salbiy"})

b = LLMBaholash("distilbert-base-uncased-finetuned-sst-2-english",
                lambda r: "ijobiy" if r["label"] == "POSITIVE" else "salbiy")
b.hisobot(d.reviewText.tolist(), d.y.tolist())

# Endi O'ZBEKCHA
b.hisobot(X_uz, y_uz)
```

> ## 🎯 **④ QAROR bo'limi — butun sinfning MAQSADI.**
>
> ```
> INGLIZ sharhlar :  0.976 − 0.554 = +0.422   →  ✅ ISHLATSA BO'LADI
> O'ZBEK jumlalar :  0.562 − 0.500 = +0.062   →  ⚠️ EHTIYOT (kuchsiz)
> ```
>
> ## 🔑 **BIR XIL MODEL. IKKI XIL QAROR.** Va bu qaror **raqamdan** kelib chiqadi, taxmindan emas.

---

## 🏆 Siz nimalarni qurdingiz?

```
1️⃣  Model pasporti          →  modelni ishlatishdan OLDIN bilish
2️⃣  Taqqoslash paneli       →  bazaviy bilan HALOL solishtirish
3️⃣  🇺🇿 O'zbek tayyorlik testi →  "bu model menga to'g'ri keladimi?"
4️⃣  Vosita tanlash          →  dalilga asoslangan qaror
5️⃣  Kesish tahlili          →  JIMGINA ma'lumot yo'qotishni topish
6️⃣  Baholash to'plami       →  hammasi bitta sinfda
```

> ## 💡 **Bu oltita vosita — 30–34-modullarda ham, LangChain bo'limida ham kerak bo'ladi.** Ularni `llm_baholash.py` fayliga saqlang.

---

## 🎯 Keyingi qadamingiz

```
① Har bir YANGI model uchun:
     · pasportini oling
     · bazaviy bilan solishtiring
     · o'zbekcha sinovdan o'tkazing

② Ma'lumotingiz uzunligini TEKSHIRING (512 token!)

③ zero-shot ni AVVAL sinang — 10 daqiqa vaqt oladi

④ Natija bazaviydan +0.05 dan kam bo'lsa — MODELNI ISHLATMANG

⑤ 🇺🇿 O'zbek tilida ishlasangiz — 28-moduldagi uznlp ga qayting
```

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md) · ➡️ **30-modul: Transformer arxitekturasi**
