# 🚀 23-modul — Mini-loyihalar

> 6 ta tayyor loyiha. Har biri **ishga tushirilgan va tekshirilgan**.

---

## ⚙️ Umumiy tayyorgarlik

```bash
pip install textblob vaderSentiment pandas
pip install transformers torch          # ⚠️ katta yuklab olish
```

```python
import pandas as pd, re
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import pipeline

vader = SentimentIntensityAnalyzer()
tf = pipeline("sentiment-analysis")
```

---

## 1️⃣ Loyiha — Uch usulli tekshirgich

**Maqsad:** Har qanday matnni **uchala usul** bilan bir vaqtda baholash.

```python
def sentiment_tekshir(matn):
    """Matnni uchta usul bilan baholaydi va yonma-yon ko'rsatadi."""
    tb = TextBlob(matn).sentiment.polarity
    vd = vader.polarity_scores(matn)["compound"]
    t  = tf(matn[:512])[0]

    def yorliq(b):
        return "😀 ijobiy" if b > 0.1 else ("😞 salbiy" if b < -0.1 else "😐 neytral")

    print(f'\n"{matn}"')
    print(f"  TextBlob    : {tb:+.4f}   {yorliq(tb)}")
    print(f"  VADER       : {vd:+.4f}   {yorliq(vd)}")
    print(f"  Transformer : {t['label']:8s}  ({t['score']:.1%})")


for m in ["This product exceeded all my expectations!",
          "The delivery was fast but the item was broken.",
          "The package arrived on Tuesday."]:
    sentiment_tekshir(m)
```

**Natija:**

```
"This product exceeded all my expectations!"
  TextBlob    : +0.0000   😐 neytral
  VADER       : +0.0000   😐 neytral
  Transformer : POSITIVE  (99.9%)

"The delivery was fast but the item was broken."
  TextBlob    : -0.1000   😐 neytral
  VADER       : -0.6310   😞 salbiy
  Transformer : NEGATIVE  (99.9%)

"The package arrived on Tuesday."
  TextBlob    : +0.0000   😐 neytral
  VADER       : +0.0000   😐 neytral
  Transformer : POSITIVE  (98.3%)
```

### 🎯 Birinchi natija — LUG'ATNING CHEKLOVI ochiq ko'rindi

```
"This product exceeded all my expectations!"
                 ↑                  ↑
   Bu jumla ANIQ IJOBIY — har qanday odam shunday deydi.

TextBlob :  0.0000   ❌  hech narsa topmadi
VADER    :  0.0000   ❌  hech narsa topmadi
Transformer: POSITIVE 99.9%  ✅
```

**Nima uchun?** Lug'atlarda `"exceeded"` va `"expectations"` **yo'q**. Ular **neytral** so'zlar. Ijobiylik esa ularning **BIRIKMASIDA** — *"kutganimdan oshib ketdi"*.

> ## 🔑 **Mana qoidaga asoslangan usulning haqiqiy chegarasi:** lug'atda **hissiy so'z** bo'lmasa — natija **nol**. Model esa **ma'noni** tushunadi.

### ⚠️ Uchinchi natija — Transformer YIQILDI

```
"The package arrived on Tuesday."   ← sof FAKT

TextBlob   : 0.0000        ✅ to'g'ri
VADER      : 0.0000        ✅ to'g'ri
Transformer: POSITIVE 98.3% ❌ XATO
```

> 💡 **Har biri boshqa joyda yiqiladi.** Shuning uchun **uchalasini** ko'rish foydali.

---

## 2️⃣ Loyiha — Sharhlar monitoring paneli

**Maqsad:** Sharhlar to'plamidan **avtomatik hisobot**.

```python
data = pd.read_csv("data/book_reviews_sample.csv")
data["clean"] = data["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())
data["score"] = data["clean"].apply(lambda r: vader.polarity_scores(r)["compound"])

bins  = [-1, -0.1, 0.1, 1]
names = ["negative", "neutral", "positive"]
data["label"] = pd.cut(data["score"], bins=bins, labels=names)

jami = len(data)
vc = data["label"].value_counts()

print("=" * 48)
print("        SHARHLAR MONITORING PANELI")
print("=" * 48)
print(f"Jami sharh : {jami}")
print(f"O'rtacha   : {data['score'].mean():+.4f}")
print()
for k in ["positive", "neutral", "negative"]:
    n = vc.get(k, 0)
    print(f"  {k:9s} {n:3d}  {'█' * (n // 2)} {n/jami:.0%}")
print()
print("--- ⚠️ ENG SALBIY 2 TA (darhol ko'rib chiqing!) ---")
for _, r in data.nsmallest(2, "score").iterrows():
    print(f"  {r['score']:+.3f} ({r['rating']}⭐) {r['reviewText'][:60]}")
print("=" * 48)
```

**Natija:**

```
================================================
        SHARHLAR MONITORING PANELI
================================================
Jami sharh : 100
O'rtacha   : +0.3429

  positive   68  ██████████████████████████████████ 68%
  neutral    13  ██████ 13%
  negative   19  █████████ 19%

--- ⚠️ ENG SALBIY 2 TA (darhol ko'rib chiqing!) ---
  -0.843 (1⭐) The art was no as amazing as everyone rated.the idea of the
  -0.804 (1⭐) This book was not very good because the drawings were bad an
================================================
```

### ✅ Ikkala eng salbiy sharh ham HAQIQATAN 1 ⭐

VADER eng yomon ikkitasini **to'g'ri** topdi. Bu — panelning asosiy vazifasi: **eng muammoli sharhlarni yuqoriga chiqarish**.

> 💡 **Haqiqiy hayotda:** bu panel har kuni ishga tushadi va eng salbiy 10 ta sharhni **qo'llab-quvvatlash bo'limiga** yuboradi.

---

## 3️⃣ Loyiha — Inkor stress-testi

**Maqsad:** Uch usul **inkorni** qanchalik yaxshi tushunishini o'lchash.

```python
juftlar = [
    ("This is good",            "This is not good"),
    ("I liked it",              "I did not like it"),
    ("The service was great",   "The service wasn't great"),
    ("Worth buying",            "Not worth buying"),
]

print(f"{'JUMLA':30s} {'TextBlob':>9s} {'VADER':>9s} {'Transformer':>16s}")
print("-" * 68)
for ijobiy, inkor in juftlar:
    for x in (ijobiy, inkor):
        t = TextBlob(x).sentiment.polarity
        v = vader.polarity_scores(x)["compound"]
        r = tf(x)[0]
        print(f"{x:30s} {t:+9.3f} {v:+9.4f} {r['label']:>10s}{r['score']*100:5.1f}%")
    print()
```

**Natija:**

```
JUMLA                           TextBlob     VADER     Transformer
--------------------------------------------------------------------
This is good                      +0.700   +0.4404   POSITIVE100.0%
This is not good                  -0.350   -0.3412   NEGATIVE100.0%

I liked it                        +0.600   +0.4215   POSITIVE100.0%
I did not like it                 +0.000   -0.2755   NEGATIVE 99.8%

The service was great             +0.800   +0.6249   POSITIVE100.0%
The service wasn't great          +0.800   -0.5096   NEGATIVE100.0%

Worth buying                      +0.300   +0.2263   POSITIVE100.0%
Not worth buying                  -0.150   -0.1695   NEGATIVE100.0%
```

### 📊 Ballar jadvali

| Test | **TextBlob** | **VADER** | **Transformer** |
|---|---|---|---|
| `not good` | ✅ −0.35 | ✅ −0.34 | ✅ NEGATIVE |
| `did not like` | ⚠️ **0.00** | ✅ −0.28 | ✅ NEGATIVE |
| `wasn't great` | ❌ **+0.80** | ✅ −0.51 | ✅ NEGATIVE |
| `Not worth buying` | ✅ −0.15 | ✅ −0.17 | ✅ NEGATIVE |
| **Natija** | **2 / 4** | **4 / 4** 🏆 | **4 / 4** 🏆 |

### 🔍 Uchta xulosa

**① `wasn't` — TextBlob'ning ko'r nuqtasi**

```
"was great"   →  +0.800
"wasn't great" →  +0.800     ← HECH QANDAY o'zgarish!

TextBlob "not" ni ko'radi, lekin "wasn't" ni KO'RMAYDI.
```

**② `did not like` → 0.00**

TextBlob inkorni **sezdi** *(0.6 → 0.0)*, lekin **manfiy qilmadi** — faqat **o'chirdi**.

**③ Transformer 4/4 va deyarli 100% ishonch bilan**

Inkor — transformerning **kuchli tomoni**. U `"wasn't"` va `"great"` **bog'lanishini** ko'radi.

---

## 4️⃣ Loyiha — Model tanlash yordamchisi

**Maqsad:** *Sizning* ma'lumotingiz uchun **qaysi model** yaxshi ekanini aniqlash.

```python
def model_tanla(sharhlar, haqiqiy_yorliqlar):
    """Uch usulni sizning ma'lumotingizda sinaydi va aniqlikni o'lchaydi."""
    bins  = [-1, -0.1, 0.1, 1]
    names = ["negative", "neutral", "positive"]

    tb = pd.cut([TextBlob(s).sentiment.polarity for s in sharhlar],
                bins=bins, labels=names).astype(str)
    vd = pd.cut([vader.polarity_scores(s)["compound"] for s in sharhlar],
                bins=bins, labels=names).astype(str)
    tr = [tf(s[:512])[0]["label"].lower() for s in sharhlar]

    print(f"{'MODEL':14s} {'ANIQLIK':>8s}")
    print("-" * 24)
    natijalar = {}
    for nom, taxmin in [("TextBlob", tb), ("VADER", vd), ("Transformer", tr)]:
        a = sum(p == h for p, h in zip(taxmin, haqiqiy_yorliqlar)) / len(sharhlar)
        natijalar[nom] = a
        print(f"{nom:14s} {a:7.1%}")

    golib = max(natijalar, key=natijalar.get)
    print(f"\n🏆 G'olib: {golib} ({natijalar[golib]:.1%})")
    return natijalar


data = pd.read_csv("data/book_reviews_sample.csv")
data["clean"] = data["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())
haqiqiy = data["rating"].apply(
    lambda r: "negative" if r <= 2 else ("neutral" if r == 3 else "positive")).tolist()

model_tanla(data["clean"].tolist(), haqiqiy)
```

**Natija:**

```
MODEL           ANIQLIK
------------------------
TextBlob         53.0%
VADER            64.0%
Transformer      79.0%

🏆 G'olib: Transformer (79.0%)
```

> ## 💡 **Bu funksiyani O'Z ma'lumotingizda ishga tushiring.** Natija boshqacha bo'lishi mumkin — tvitlarda VADER, rasmiy matnlarda transformer yaxshiroq bo'ladi. **Sinamasdan bilib bo'lmaydi.**

---

## 5️⃣ Loyiha — Real vaqt fikr-mulohaza tizimi

**Maqsad:** Mijoz xabari kelganda **darhol** ustuvorlikni aniqlash.

```python
def ustuvorlik(xabar):
    """Mijoz xabarining shoshilinchlik darajasini aniqlaydi."""
    v = vader.polarity_scores(xabar)
    ball = v["compound"]

    if ball <= -0.5:
        daraja, belgi, javob = "SHOSHILINCH", "🔴", "Darhol menejerga!"
    elif ball <= -0.1:
        daraja, belgi, javob = "YUQORI",      "🟠", "1 soat ichida javob"
    elif ball < 0.1:
        daraja, belgi, javob = "ODDIY",       "🟡", "24 soat ichida"
    else:
        daraja, belgi, javob = "PAST",        "🟢", "Minnatdorchilik yuboring"

    return {"daraja": daraja, "belgi": belgi,
            "ball": round(ball, 4), "amal": javob,
            "salbiy_ulush": v["neg"]}


xabarlar = [
    "This is absolutely terrible. Worst service I have ever experienced!",
    "The product is okay but shipping was slow.",
    "My order number is 4471.",
    "Thank you so much, everything was perfect!",
]

for x in xabarlar:
    n = ustuvorlik(x)
    print(f"{n['belgi']} {n['daraja']:12s} ({n['ball']:+.4f})  → {n['amal']}")
    print(f"   {x[:60]}\n")
```

**Natija:**

```
🔴 SHOSHILINCH  (-0.8427)  → Darhol menejerga!
   This is absolutely terrible. Worst service I have ever exp

🟢 PAST         (+0.1154)  → Minnatdorchilik yuboring
   The product is okay but shipping was slow.

🟡 ODDIY        (+0.0772)  → 24 soat ichida
   My order number is 4471.

🟢 PAST         (+0.7574)  → Minnatdorchilik yuboring
   Thank you so much, everything was perfect!
```

### ❌ Ikkinchi xabar — TIZIM YIQILDI

```
"The product is okay but shipping was slow."
   → +0.1154  🟢 PAST  →  "Minnatdorchilik yuboring"  😬

Aslida bu SHIKOYAT — yetkazib berish sekin edi!
Tizim mijozga "rahmat" yozmoqchi.
```

**Nima uchun?**

```python
print(vader.polarity_scores("The product is okay but shipping was slow."))
# {'neg': 0.0, 'neu': 0.828, 'pos': 0.172, 'compound': 0.1154}
#         ↑ NOL!
```

> ## 🔑 **`neg = 0.0`** — VADER `"slow"` so'zini **salbiy deb umuman bilmaydi**. U lug'atda **yo'q**. Faqat `"okay"` ijobiy ball berdi.

### ✅ Yechim — LUG'ATGA O'Z SO'ZLARINGIZNI QO'SHING

```python
vader.lexicon.update({
    "slow": -1.5, "late": -1.5, "delayed": -2.0,
    "broken": -2.5, "damaged": -2.5, "missing": -2.0,
})

print(vader.polarity_scores("The product is okay but shipping was slow."))
# {'neg': 0.304, 'neu': 0.561, 'pos': 0.136, 'compound': -0.4215}
#         ↑ endi SALBIY!

n = ustuvorlik("The product is okay but shipping was slow.")
print(f"{n['belgi']} {n['daraja']} ({n['ball']:+.4f}) → {n['amal']}")
# 🟠 YUQORI (-0.4215) → 1 soat ichida javob     ✅ TO'G'RI!
```

> ## 💡 **Bu — qoidaga asoslangan usulning ENG KATTA AFZALLIGI:** siz uni **bir qatorda** o'z sohangizga **moslashtira olasiz**. Transformerni moslashtirish uchun esa **qayta o'qitish** kerak — bu **kunlar** va **GPU** talab qiladi.
>
> `vader.lexicon` — bu oddiy Python **lug'ati**. Unga logistika, tibbiyot, moliya — **istalgan sohaning** so'zlarini qo'shing.

---

## 6️⃣ Loyiha — Ansambl va ishonch darajasi

**Maqsad:** Uchta modelni **birlashtirish** va **qachon odam kerakligini** aniqlash.

```python
data = pd.read_csv("data/book_reviews_sample.csv")
data["clean"] = data["reviewText"].apply(lambda x: re.sub(r"[^\w\s]", "", x).lower())

bins  = [-1, -0.1, 0.1, 1]
names = ["negative", "neutral", "positive"]

data["vlab"]  = pd.cut(data["clean"].apply(
    lambda r: vader.polarity_scores(r)["compound"]), bins=bins, labels=names).astype(str)
data["tlab"]  = pd.cut(data["clean"].apply(
    lambda r: TextBlob(r).sentiment.polarity), bins=bins, labels=names).astype(str)
data["tflab"] = [tf(r[:512])[0]["label"].lower() for r in data["clean"]]

data["haq"] = data["rating"].apply(
    lambda r: "negative" if r <= 2 else ("neutral" if r == 3 else "positive"))

def ovoz_ber(r):
    ovozlar = [r["vlab"], r["tlab"], r["tflab"]]
    golib = max(set(ovozlar), key=ovozlar.count)
    return golib, ovozlar.count(golib)

data[["ovoz", "kelishuv"]] = data.apply(lambda r: pd.Series(ovoz_ber(r)), axis=1)

print("=== ALOHIDA vs ANSAMBL ===")
for nom, c in [("VADER", "vlab"), ("TextBlob", "tlab"),
               ("Transformer", "tflab"), ("ENSEMBLE", "ovoz")]:
    print(f"  {nom:12s} {(data[c] == data['haq']).mean():.1%}")

print("\n=== KELISHUV = ISHONCH ===")
for k in sorted(data["kelishuv"].unique()):
    g = data[data["kelishuv"] == k]
    print(f"  {k} ta model rozi: {len(g):3d} ta sharh, "
          f"aniqlik {(g['ovoz'] == g['haq']).mean():.1%}")
```

**Natija:**

```
=== ALOHIDA vs ANSAMBL ===
  VADER        64.0%
  TextBlob     53.0%
  Transformer  79.0%
  ENSEMBLE     63.0%

=== KELISHUV = ISHONCH ===
  1 ta model rozi:   9 ta sharh, aniqlik 11.1%
  2 ta model rozi:  33 ta sharh, aniqlik 39.4%
  3 ta model rozi:  58 ta sharh, aniqlik 84.5%
```

### ❌ KUTILMAGAN NATIJA — Ansambl YOMONROQ!

```
Transformer YAKKA O'ZI :  79.0%   🏆
ANSAMBL (3 model)      :  63.0%   ❌ 16 foizga PASTROQ!
```

> ## 🔑 **Nima uchun?** Ko'pchilik ovozi faqat modellar **teng kuchli** bo'lganda ishlaydi. Bu yerda esa **ikkita kuchsiz model** *(TextBlob 53%, VADER 64%)* birgalikda **kuchli modelni** *(79%)* **bosib ketdi**.
>
> ## 💡 **Saboq:** *"ko'proq model = yaxshiroq"* — **noto'g'ri**. Yomon modelni qo'shish natijani **buzadi**.

### ✅ LEKIN — KELISHUV oltin qiymatga ega!

```
3 ta model ROZI  →  58 ta sharh  →  84.5% aniqlik   ✅ ISHONING
2 ta model rozi  →  33 ta sharh  →  39.4% aniqlik   ⚠️ shubhali
1 ta model rozi  →   9 ta sharh  →  11.1% aniqlik   ❌ ODAM KERAK
```

### 🎯 Amaliy foydalanish

```python
def aqlli_qaror(r):
    if r["kelishuv"] == 3:
        return f"✅ AVTOMATIK: {r['ovoz']}"
    else:
        return "👤 ODAM TEKSHIRSIN"

data["qaror"] = data.apply(aqlli_qaror, axis=1)
print(data["qaror"].str[:12].value_counts())
```

```
✅ AVTOMATIK    58
👤 ODAM TEKSH   42
```

> ## 💡 **Mana HAQIQIY qiymat:** ansambl **javob berish** uchun emas — **qachon ishonmaslikni bilish** uchun. Ishning **58%** ini avtomatlashtirdik va **84.5% aniqlik** bilan. Qolgan **42%** ni **odamga** yubordik — aynan u yerda modellar **chalkashadi**.
>
> Bu — sanoatda **"human-in-the-loop"** deb ataladi va **eng amaliy** yondashuvlardan biri.

---

## 🎓 Yakuniy vazifa

Oltita loyihani **bitta sentiment platformasiga** birlashtiring:

```
========== SENTIMENT PLATFORMASI ==========
1 · Matnni tekshirish (3 usul)
2 · Sharhlar paneli
3 · Inkor stress-testi
4 · Model tanlash (o'z ma'lumotingizda)
5 · Xabar ustuvorligi
6 · Ansambl + ishonch darajasi
0 · Chiqish
Tanlang:
```

<details>
<summary>💡 Karkas</summary>

```python
def menyu():
    amallar = {
        "1": lambda: sentiment_tekshir(input("Matn: ")),
        "5": lambda: print(ustuvorlik(input("Xabar: "))),
    }
    while True:
        print("\n========== SENTIMENT PLATFORMASI ==========")
        print("1 · Matnni tekshirish   4 · Model tanlash")
        print("2 · Sharhlar paneli     5 · Xabar ustuvorligi")
        print("3 · Inkor testi         6 · Ansambl")
        print("0 · Chiqish")
        t = input("Tanlang: ")
        if t == "0":
            print("Xayr! 👋"); break
        amallar.get(t, lambda: print("Noto'g'ri tanlov!"))()

menyu()
```

</details>

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md)
