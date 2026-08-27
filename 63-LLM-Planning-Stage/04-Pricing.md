# 4-dars. Narx: hosting vs token bo'yicha to'lov ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs kalkulyator misolini beradi: 1000 foydalanuvchi, 7 so'rov. Biz hisobladik — `gpt-4o` bilan $192.50, `gpt-4o-mini` bilan $11.55. 16.7× farq. Bitta parametr o'zgarishi bilan."**

---

## 1. Kursning misoli

> ## 🔑 **KURS AYTADI:** ## *"1000 foydalanuvchili chatbot. ## Har biri o'rtacha 7 ta so'rov beradi — ## **7000 bajarilish**. ## Taxminan **3000 kirish** va **2000 chiqish** tokeni."*

```python
foyd, sorov = 1000, 7
bajarilish = foyd * sorov
kir_t, chiq_t = 3000, 2000

print(f"bajarilish   : {bajarilish:,}")
print(f"kirish jami  : {bajarilish*kir_t:,} token")
print(f"chiqish jami : {bajarilish*chiq_t:,} token")
```

```
bajarilish   : 7,000
kirish jami  : 21,000,000 token
chiqish jami : 14,000,000 token
```

---

## 2. 📊 Narxni hisoblaymiz

| Model | Kirish | Chiqish | ## JAMI | Bir foydalanuvchiga |
|---|---|---|---|---|
| ## **`gpt-4o-mini`** | $3.15 | $8.40 | ## 🏆 **$11.55** | ## 🏆 **$0.0116** |
| `gpt-3.5-turbo` | $10.50 | $21.00 | $31.50 | $0.0315 |
| ## `gpt-4o` | $52.50 | $140.00 | ## 💥 **$192.50** | ## 💥 **$0.1925** |

> ## 💥💥 **`gpt-4o` — `gpt-4o-mini` DAN 16.7× QIMMAT.**
>
> ## ## 🔑 **VA E'TIBOR BERING — CHIQISH HAR DOIM KO'PROQ TURADI:** ## `gpt-4o-mini` da $8.40 vs $3.15 *(2.7×)*, ## `gpt-4o` da $140 vs $52.50 *(2.7×)*.
>
> ## ⚠️ **Garchi chiqish tokenlari 1.5× KAM bo'lsa ham** *(14 mln vs 21 mln)*.

### 💡 Nega chiqish qimmat?

```
   KIRISH  — model bir marta o'qiydi (parallel)
   CHIQISH — model token-token generatsiya qiladi (ketma-ket)
              ▲
      har bir token uchun butun model qayta ishlaydi
```

> ## 🔑 **SHUNING UCHUN NARX ODATDA 4× FARQ QILADI** ## *(`gpt-4o-mini`: $0.150 vs $0.600)*.
>
> ## ## ⭐ **AMALIY XULOSA:** ## **`max_tokens` ni cheklang.** ## Bu — eng oson tejash usuli.

---

## 3. ⭐⭐ Narxni kamaytirishning beshta usuli

| # | Usul | Tejash | Sifatga ta'siri |
|---|---|---|---|
| ① | ## **Arzonroq model** | ## 🏆 **16.7×** | ⚠️ pasayishi mumkin |
| ② | ## **`max_tokens` cheklash** | ## ⭐ **2–3×** | ✅ odatda yo'q |
| ③ | ## **Tarixni qisqartirish** | ## ⭐ **2–5×** | ⚠️ kontekst yo'qoladi |
| ④ | Prompt keshlash | ~2× *(kirish)* | ## ✅ **nol** |
| ⑤ | Batch API | ~2× | ## ⚠️ **kechikish** |

### 🔬 ③ ni o'lchaymiz — tarixni qisqartirish

```python
def suhbat_narxi(tizim_tok, navbatlar, oyna=None,
                 savol_tok=40, javob_tok=120, ki=0.150, ch=0.600):
    """oyna=None -> butun tarix; oyna=N -> faqat oxirgi N navbat."""
    kirish = 0
    tarix = []
    for _ in range(navbatlar):
        korinadigan = tarix if oyna is None else tarix[-oyna * 2:]
        kirish += tizim_tok + sum(korinadigan)
        tarix += [savol_tok, javob_tok]
    chiqish = navbatlar * javob_tok
    return kirish, chiqish, (kirish * ki + chiqish * ch) / 1e6
```

```python
for oyna in [None, 6, 4, 2]:
    k, c, n = suhbat_narxi(200, 20, oyna)
    nom = "butun tarix" if oyna is None else f"oxirgi {oyna} navbat"
    print(f"{nom:16s} kirish {k:>7,} · chiqish {c:>5,} · "
          f"${n:.6f} · 10k suhbat ${n*10000:>8,.2f}")
```

### ✅ Haqiqiy natija

```
butun tarix      kirish  34,400 · chiqish 2,400 · $0.006600 · 10k suhbat $   66.00
oxirgi 6 navbat  kirish  19,840 · chiqish 2,400 · $0.004416 · 10k suhbat $   44.16
oxirgi 4 navbat  kirish  15,200 · chiqish 2,400 · $0.003720 · 10k suhbat $   37.20
oxirgi 2 navbat  kirish   9,920 · chiqish 2,400 · $0.002928 · 10k suhbat $   29.28
```

> ## 🏆 **20 NAVBATLI SUHBATDA:** ## butun tarix **$66.00**, oxirgi 2 navbat **$29.28** — ## ## ⭐ **2.3× tejash.**
>
> ## ## ⚠️ **LEKIN NARX BOR:** ## model **oldingi savollarni eslamaydi** → ## takroriy savol berishi mumkin.

> ## 💡 **ORALIQ YECHIM:** ## tizim prompti + **birinchi 2 navbat** *(kontekst)* + ## **oxirgi 4 navbat** *(joriy suhbat)*. ## Bu — **67-modulda** batafsil ko'riladi.

---

## 4. 💥 Kurs eslatmagan xarajatlar

| Xarajat | Izoh |
|---|---|
| ## **Qayta urinishlar** | Xato → qayta so'rov → **2× to'lov** |
| ## **Muvaffaqiyatsiz javoblar** | Model noto'g'ri format bersa — **qayta so'raysiz** |
| Testlash | Har bir prompt sinovi — **pul** |
| ## **Prompt injection sinovlari** | Xavfsizlik testi ham **to'lanadi** |
| Fikr-mulohaza generatsiyasi | Alohida katta so'rov |
| Suhbat oqimi *(streaming)* | Narxi bir xil, lekin **uzilib qolsa ham to'laysiz** |

> ## ⚠️ **AMALIY QOIDA:** ## Hisoblangan narxni **1.5–2× ga ko'paytiring**. ## ## 🔑 **Va byudjet chegarasini KODGA qo'ying**, ## hisobga emas.

---

## 5. 🔧 Byudjet nazoratchisi

```python
import time


class ByudjetNazorat:
    """Sarflangan pulni kuzatadi va chegaradan oshirmaydi.

    ⚠️ Bu — TAXMINIY hisob. Rasmiy raqam — provayderning hisobida.
    """

    NARXLAR = {"gpt-4o-mini": (0.150, 0.600), "gpt-4o": (2.500, 10.00),
               "gpt-3.5-turbo": (0.500, 1.500), "mahalliy": (0.0, 0.0)}

    def __init__(self, model="gpt-4o-mini", kunlik_limit=1.00,
                 sorov_limit=0.05):
        self.model = model
        self.kunlik_limit = kunlik_limit
        self.sorov_limit = sorov_limit
        self.sarflangan = 0.0
        self.sorovlar = 0
        self.rad = 0
        self.tarix = []

    def narx(self, kirish_tok, chiqish_tok):
        ki, ch = self.NARXLAR[self.model]
        return (kirish_tok * ki + chiqish_tok * ch) / 1e6

    def ruxsat(self, kirish_tok, kutilgan_chiqish=200):
        """So'rovdan OLDIN chaqiring."""
        n = self.narx(kirish_tok, kutilgan_chiqish)
        if n > self.sorov_limit:
            self.rad += 1
            return False, (f"💥 bitta so'rov ${n:.4f} > "
                           f"chegara ${self.sorov_limit:.4f}")
        if self.sarflangan + n > self.kunlik_limit:
            self.rad += 1
            return False, (f"💥 kunlik limit ${self.kunlik_limit:.2f} "
                           f"to'lardi (sarflangan ${self.sarflangan:.4f})")
        return True, f"✅ taxminiy ${n:.6f}"

    def qayd(self, kirish_tok, chiqish_tok):
        """So'rovdan KEYIN chaqiring — HAQIQIY tokenlar bilan."""
        n = self.narx(kirish_tok, chiqish_tok)
        self.sarflangan += n
        self.sorovlar += 1
        self.tarix.append({"kirish": kirish_tok, "chiqish": chiqish_tok,
                           "narx": round(n, 8)})
        return n

    def hisobot(self):
        k = sum(x["kirish"] for x in self.tarix)
        c = sum(x["chiqish"] for x in self.tarix)
        print(f"\n  💰 {self.model}")
        print(f"     so'rovlar   : {self.sorovlar}   rad etilgan: {self.rad}")
        print(f"     kirish      : {k:,} token")
        print(f"     chiqish     : {c:,} token")
        print(f"     sarflangan  : ${self.sarflangan:.6f} / "
              f"${self.kunlik_limit:.2f}  "
              f"({self.sarflangan/self.kunlik_limit*100:.1f}%)")
        if self.sorovlar:
            print(f"     o'rtacha    : ${self.sarflangan/self.sorovlar:.6f}/so'rov")
        return self.sarflangan
```

```python
b = ByudjetNazorat("gpt-4o-mini", kunlik_limit=0.05, sorov_limit=0.01)

for i, (kir, chiq) in enumerate([(500, 200), (2000, 300), (60000, 500),
                                 (1500, 250), (3000, 400)], 1):
    ok, izoh = b.ruxsat(kir, chiq)
    print(f"{i}. kirish {kir:>6,}  {izoh}")
    if ok:
        b.qayd(kir, chiq)

b.hisobot()
```

### ✅ Haqiqiy natija

```
1. kirish    500  ✅ taxminiy $0.000195
2. kirish  2,000  ✅ taxminiy $0.000480
3. kirish 60,000  ✅ taxminiy $0.009300
4. kirish  1,500  ✅ taxminiy $0.000375
5. kirish  3,000  ✅ taxminiy $0.000690

  💰 gpt-4o-mini
     so'rovlar   : 5   rad etilgan: 0
     kirish      : 67,000 token
     chiqish     : 1,650 token
     sarflangan  : $0.011040 / $0.05  (22.1%)
     o'rtacha    : $0.002208/so'rov
```

> ## 🔧 **BU YERDA MEN XATO QILDIM.** ## Uchinchi so'rov — **60 000 token**. ## Men uni **"rad etiladi"** deb kutgan edim. ## ## 💥 **HAQIQAT: $0.0093 — chegaradan PAST, o'tib ketdi.**
>
> ## ## 🔑 **SABAB: `gpt-4o-mini` JUDA ARZON.** ## 60 000 kirish tokeni **atigi $0.0093** turadi. ## ## ⚠️ **`sorov_limit=0.01` — bu model uchun deyarli cheksiz.**
>
> ## 💥 **VA OQIBATI KO'RINIB TURIBDI:** ## bitta so'rov kunlik byudjetning **19% ini** yeb qo'ydi ## *(jami 22.1%, qolgan 4 tasi — atigi 3.1%)*.

### ✅ Chegarani to'g'rilaymiz

```python
b2 = ByudjetNazorat("gpt-4o-mini", kunlik_limit=0.05, sorov_limit=0.005)
ok, izoh = b2.ruxsat(60000, 500)
print(izoh)
```

```
💥 bitta so'rov $0.0093 > chegara $0.0050
```

> ## 🏆 **VA MANA UMUMIY DARS:** ## **chegarani model narxiga qarab qo'ying.** ## `gpt-4o` uchun $0.01 — qattiq, ## `gpt-4o-mini` uchun — **deyarli cheksiz**.

---

## 🎯 Nazorat savollari

1. Kursning misolida `gpt-4o` va `gpt-4o-mini` narxi qanchaga farq qiladi?
2. Nega chiqish tokenlari qimmatroq?
3. Tarixni 2 navbatgacha qisqartirsak qancha tejaymiz?
4. Kurs qaysi xarajatlarni eslatmagan?
5. Byudjet chegarasini qanday qo'yish kerak?

<details>
<summary>Javoblar</summary>

1. ## **16.7×** — $192.50 vs $11.55 (7 000 bajarilish uchun). Bir foydalanuvchiga: $0.1925 vs **$0.0116**.
2. Kirish **parallel** o'qiladi, chiqish esa **token-token ketma-ket** generatsiya qilinadi — har bir token uchun butun model qayta ishlaydi. Narx odatda **4× farq** qiladi.
3. ## **2.3×** — $66.00 dan **$29.04** ga (20 navbatli suhbat, 10 000 marta). ⚠️ Lekin model **oldingi savollarni eslamaydi**.
4. **Qayta urinishlar, muvaffaqiyatsiz javoblar, testlash, xavfsizlik sinovlari, fikr-mulohaza generatsiyasi.** Qoida: hisoblangan narxni **1.5–2×** ga ko'paytiring.
5. ## **Model narxiga qarab.** `gpt-4o-mini` da 60 000 token atigi **$0.009** — `$0.01` chegara deyarli cheksiz. Men shu yerda **xato qildim** va chegarani `$0.005` ga tushirdim.

</details>

---

⬅️ [3-dars](03-Tokens.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Initial-Prompt-Development-1.md)
