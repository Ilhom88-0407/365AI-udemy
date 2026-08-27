# 3-dars. Tokenlar ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs beshta token qoidasini beradi. Biz beshtasini ham o'lchadik. Eng mashhuri — '1 token ≈ 4 belgi' — 68% xato chiqdi."**

---

## 1. Kursning beshta qoidasi

> ## 🔑 **KURS AYTADI** *(OpenAI tavsiyasiga havola qiladi)*:
>
> | # | Qoida |
> |---|---|
> | ① | 1 token ≈ **4 belgi** *(ingliz)* |
> | ② | 1 token ≈ **0.75 so'z** |
> | ③ | 100 token ≈ **75 so'z** |
> | ④ | 1–2 jumla ≈ **30 token** |
> | ⑤ | 1 paragraf ≈ **100 token** |
> | ⑥ | 1 900 so'z ≈ **2 048 token** |

---

## 2. 🔬 Hammasini o'lchaymiz

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")     # GPT-4o oilasi

MATN = """Machine learning is a subfield of artificial intelligence that focuses
on building systems capable of learning from data. Instead of following explicit
instructions, these systems identify patterns and improve their performance over
time. ..."""                                   # 98 so'zli oddiy nasr
MATN = " ".join(MATN.split())

sozlar, belgilar = len(MATN.split()), len(MATN)
tokenlar = len(enc.encode(MATN))

print(f"{sozlar} so'z · {belgilar} belgi · {tokenlar} token")
print(f"belgi/token : {belgilar/tokenlar:.2f}")
print(f"so'z/token  : {sozlar/tokenlar:.2f}")
```

```
98 so'z · 753 belgi · 112 token
belgi/token : 6.72
so'z/token  : 0.88
```

### 📊 Natija

| # | Kursning qoidasi | Kutilgan | ## O'lchangan | Farq | Holat |
|---|---|---|---|---|---|
| ## ① | **1 token ≈ 4 belgi** | 4.00 | ## 💥 **6.72** | ## 💥 **68%** | ## 💥 |
| ② | 1 token ≈ 0.75 so'z | 0.75 | 0.88 | 17% | ⚠️ |
| ③ | 100 token ≈ 75 so'z | 75.00 | 87.50 | 17% | ⚠️ |
| ## ④ | **1–2 jumla ≈ 30 token** | 30.00 | ## 💥 **37.00** | ## **23%** | ## 💥 |
| ⑤ | Paragraf ≈ 100 token | 100.00 | 114.29 | 14% | ⚠️ |
| ## ⑥ | **1 900 so'z ≈ 2 048 token** | 2048.00 | ## ⭐ **2 171** | ## ✅ **6%** | ## ✅ |

> ## 💥💥💥 **ENG MASHHUR QOIDA — ENG YOMONI.**
>
> ## `1 token ≈ 4 belgi` → haqiqatda **6.72 belgi**. ## ## 🔑 **68% xato.**

### 🔑 Nega?

```
   "1 token ≈ 4 belgi" qoidasi GPT-3 davridan (2020).
   O'shanda tokenizator: p50k_base / r50k_base  (~50 000 token)

   Bugun (o200k_base):  ~200 000 token
                         ▲
              4× katta lug'at = kamroq token = ko'proq belgi/token
```

| Tokenizator | Lug'at | Bizning matnda |
|---|---|---|
| `cl100k_base` *(GPT-3.5/4)* | ~100 000 | 112 token |
| `o200k_base` *(GPT-4o+)* | ~200 000 | ## **112 token** |

> ## ⚠️ **BU MATNDA IKKALASI HAM 112** — chunki matn **sof inglizcha**. ## Farq **ingliz bo'lmagan** matnda ko'rinadi *(62-modul: o'zbekcha 33 vs 23)*.

---

## 3. 💥💥 Va qoida **matn turiga** juda bog'liq

```python
NAMUNALAR = {
    "oddiy nasr": MATN,
    "texnik matn": "The transformer architecture uses multi-head self-attention "
                   "with scaled dot-product computation: softmax(QK^T/sqrt(d))V.",
    "kod": "def tokenize(text: str) -> list[int]:\n"
           "    enc = tiktoken.get_encoding('o200k_base')\n"
           "    return enc.encode(text)\n",
    "raqamlar": "Revenue was 1,234,567.89 USD in Q3 2024, up 12.5% from 1,097,392.11.",
    "URL/JSON": '{"url": "https://api.openai.com/v1/chat/completions", "id": "chatcmpl-9xY2z"}',
    "o'zbekcha": "Mashinali o'rganish sun'iy intellektning bir sohasi bo'lib, "
                 "ma'lumotlardan o'rganadigan tizimlar qurishga qaratilgan.",
}
for nom, t in NAMUNALAR.items():
    n = len(enc.encode(t))
    print(f"{nom:14s} {len(t):5d} belgi {n:4d} token  "
          f"{len(t)/n:5.2f} belgi/tok  {len(t.split())/n:5.2f} so'z/tok")
```

### 📊 Natija

| Tur | Belgi | So'z | Token | ## Belgi/token | So'z/token |
|---|---|---|---|---|---|
| ## **Oddiy nasr** | 753 | 98 | 112 | ## 🏆 **6.72** | 0.88 |
| Texnik matn | 174 | 18 | 37 | 4.70 | 0.49 |
| Kod | 112 | 10 | 30 | 3.73 | 0.33 |
| ## **URL/JSON** | 77 | 4 | 31 | ## 💥 **2.48** | ## 💥 **0.13** |
| ## **Raqamlar** | 68 | 11 | 34 | ## 💥 **2.00** | 0.32 |
| O'zbekcha | 117 | 12 | 37 | 3.16 | 0.32 |

> ## 💥💥💥 **DIAPAZON: 2.00 dan 6.72 gacha — 3.4× FARQ.**
>
> ## ## 🔑 **YA'NI "4 BELGI" QOIDASI:**
> ## ✅ **Kod va texnik matnda** — taxminan to'g'ri
> ## 💥 **Oddiy nasrda** — **68% past baholaydi**
> ## 💥 **Raqam va URL da** — **2× yuqori baholaydi**

### ⚠️ Va nima uchun bu **pul** masalasi

```
   Prompt: 1000 ta belgi

   Agar "4 belgi = 1 token" desangiz:  250 token deb bashorat qilasiz

   Haqiqatda:
     oddiy nasr  ->  149 token   (byudjetdan 40% KAM)
     JSON        ->  403 token   (byudjetdan 61% KO'P)  💥
```

> ## 🏆 **QOIDA:** ## **Taxmin qilmang — `tiktoken` bilan SANANG.** ## ## 💡 Bu **bir qator kod** va **millisekundlar**.

---

## 4. 🔬 Tokenlar aslida nima?

```python
for tok in enc.encode("Machine learning models"):
    print(f"{tok:>7}  {enc.decode([tok])!r}")
```

```
  25519  'Machine'
   7524  ' learning'
   7015  ' models'
```

> ## 🔑 **UCHTA E'TIBOR:**
> ## ① Token — **so'z emas**, lekin ko'pincha unga **teng**
> ## ② Bo'shliq **tokenning ichida** *(`' learning'`)*
> ## ③ Katta/kichik harf — **boshqa token**

### 💥 O'zbekcha esa bo'lak-bo'lak

```python
for tok in enc.encode("Mashinali o'rganish"):
    print(f"{tok:>7}  {enc.decode([tok])!r}")
```

```
 193514  'Mash'
 168152  'inali'
    293  ' o'
  15770  "'r"
   5976  'gan'
   1109  'ish'
```

> ## 💥 **IKKITA SO'Z — OLTITA TOKEN.** ## Inglizcha `"Machine learning"` esa — **ikkita**.
>
> ## ## 🔑 **VA APOSTROF (`'`) ALOHIDA TOKENGA TUSHADI** ## — `"'r"`. ## O'zbek tilida apostrof **ko'p ishlatiladi**, ## va u **har safar pul turadi**.

---

## 5. ⭐ Kursning to'g'ri aytgani

> ## ✅ **KURS AYTADI:** *"Model qayta ishlaydigan **har bir matn** — ## foydalanuvchi promptlari **va model chiqishi** — ## umumiy token soniga hissa qo'shadi."*

```
   HAR BIR SO'ROVDA TO'LANADIGAN NARSA:

   ┌────────────────────────────────────────────────┐
   │  tizim prompti           (har safar!)          │
   │  + suhbat tarixi         (har safar!)          │
   │  + foydalanuvchi savoli                        │
   │  ─────────────────────────────────             │
   │  = KIRISH tokenlari                            │
   │                                                │
   │  + model javobi                                │
   │  ─────────────────────────────────             │
   │  = CHIQISH tokenlari  (odatda 4× qimmat)       │
   └────────────────────────────────────────────────┘
```

> ## ✅ **BU — BUTUNLAY TO'G'RI VA ENG MUHIM TUSHUNCHA.** ## 62-modulda o'lchadik: 10 navbatli suhbatda ## **1 600 token generatsiya qilindi, 8 020 token yuborildi** — ## ya'ni **5.0×**.

---

## 6. 🔧 Ishonchli token o'lchagich

```python
import tiktoken


class TokenOlchagich:
    """Taxmin emas — aniq o'lchov."""

    ENC = {"gpt-4o": "o200k_base", "gpt-4o-mini": "o200k_base",
           "gpt-3.5-turbo": "cl100k_base", "gpt-4": "cl100k_base"}

    def __init__(self, model="gpt-4o-mini"):
        self.model = model
        self.enc = tiktoken.get_encoding(self.ENC.get(model, "o200k_base"))

    def sana(self, matn):
        return len(self.enc.encode(matn or ""))

    def xabarlar(self, xabarlar, tok_per_msg=3, tok_per_name=1):
        """Chat API formatidagi xabarlar uchun — SLUJEBNIY tokenlar bilan.

        ⚠️ Har bir xabar ~3 ta qo'shimcha token oladi (rol, ajratgichlar).
        """
        jami = 0
        for m in xabarlar:
            jami += tok_per_msg
            for k, v in m.items():
                jami += self.sana(str(v))
                if k == "name":
                    jami += tok_per_name
        return jami + 3          # ⭐ javob boshlanishi uchun

    def taqqosla(self, matn):
        """Bir xil matn turli tokenizatorlarda."""
        r = {}
        for e in ["cl100k_base", "o200k_base"]:
            r[e] = len(tiktoken.get_encoding(e).encode(matn))
        r["belgi"] = len(matn)
        r["so_z"] = len(matn.split())
        r["belgi_per_token"] = round(len(matn) / max(r["o200k_base"], 1), 2)
        return r
```

```python
t = TokenOlchagich("gpt-4o-mini")

xabarlar = [
    {"role": "system", "content": "You are an HR interviewer at Google."},
    {"role": "user", "content": "Hello, I'm ready to start."},
]
sof = sum(t.sana(m["content"]) for m in xabarlar)
toliq = t.xabarlar(xabarlar)
print(f"sof matn      : {sof} token")
print(f"chat formatida: {toliq} token   (+{toliq-sof} slujebniy)")
print()
import json
print(json.dumps(t.taqqosla("Mashinali o'rganish modellari"),
                 indent=2, ensure_ascii=False))
```

### ✅ Haqiqiy natija

```
sof matn      : 15 token
chat formatida: 26 token   (+11 slujebniy)

{
  "cl100k_base": 11,
  "o200k_base": 8,
  "belgi": 29,
  "so_z": 3,
  "belgi_per_token": 3.62
}
```

> ## 💥 **+11 SLUJEBNIY TOKEN — 15 TA MATN UCHUN.** ## Ya'ni **73% qo'shimcha**.
>
> ## ## ⚠️ **QISQA XABARLARDA BU JUDA SEZILARLI.** ## 100 ta qisqa xabar = **~1 100 ta "bepul" token** ## — buning uchun ham **to'laysiz**.
>
> ## 🔑 **VA E'TIBOR BERING:** `"Mashinali o'rganish modellari"` — ## `cl100k` da **11**, `o200k` da **8** token. ## ## ⭐ **Yangi tokenizator 1.38× tejamli.**

---

## 🎯 Nazorat savollari

1. *"1 token ≈ 4 belgi"* qoidasi qanchalik to'g'ri?
2. Nega bu qoida eskirgan?
3. Qaysi matn turi eng ko'p token oladi?
4. `"Mashinali o'rganish"` necha token?
5. Chat formatida qancha qo'shimcha token bor?
6. Nega chiqish tokenlari qimmatroq?

<details>
<summary>Javoblar</summary>

1. ## **68% xato** — oddiy inglizcha nasrda **6.72 belgi/token**. Lekin **kodda** (3.73) va **texnik matnda** (4.70) taxminan to'g'ri.
2. Qoida **GPT-3 davridan** (~50 000 tokenli lug'at). Bugungi `o200k_base` — **~200 000 token**, ya'ni **4× katta lug'at** → kamroq token → ko'proq belgi/token.
3. ## **URL/JSON** (2.48 belgi/token) va **raqamlar** (2.00). Ular **belgi-belgi** kodlanadi. Eng kam — **oddiy nasr** (6.72). ## **Diapazon 3.4×.**
4. ## **6 ta token**: `'Mash'`, `'inali'`, `' o'`, `"'r"`, `'gan'`, `'ish'`. Inglizcha `"Machine learning"` — **2 ta**.
5. ## **Har bir xabar uchun ~3 ta** (rol, ajratgichlar) + javob boshlanishi uchun 3 ta. Bizning misolda **15 → 26 token**, ya'ni **+73%**.
6. Chunki **narxi boshqa**: `gpt-4o-mini` da kirish **$0.150**/1M, chiqish **$0.600**/1M — ya'ni **4× qimmat**. `gpt-4o` da ham **4×**.

</details>

---

⬅️ [2-dars](02-Open-vs-Closed-Source.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Pricing.md)
