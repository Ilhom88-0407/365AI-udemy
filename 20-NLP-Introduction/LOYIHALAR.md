# 🚀 20-modul · Mini-loyihalar

Bu 6 ta loyiha — **kutubxonasiz NLP**. Faqat **10–19-modullarda o'rgangan Python** bilan.

> ## 💡 **Nima uchun kutubxonasiz?**
>
> 21-moduldan boshlab `nltk` va `sklearn` ishlatasiz. Lekin **avval ichida nima borligini** bilish kerak — aks holda siz **qora quti** ishlatasiz, tushunmasdan.

```
dict chastota naqshi     ← 18-moduldan
set kesishma / birlashma ← YANGI
funksiyalar              ← 16-moduldan
sikllar                  ← 18-moduldan
```

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | NLP vazifasi | Qiyinlik |
|---|---|---|---|
| 1 | [Sharhlar tahlilchisi](#loyiha-1--sharhlar-tahlilchisi) | Sentiment tahlili | 🟢 |
| 2 | [Kalit so'zlar](#loyiha-2--kalit-sozlar) | Kalit so'z ajratish | 🟢 |
| 3 | [Niyat aniqlagich](#loyiha-3--niyat-aniqlagich) | Chatbot niyati | 🟡 |
| 4 | [Til aniqlagich](#loyiha-4--til-aniqlagich) | Tilni aniqlash | 🟡 |
| 5 | [Hujjat o'xshashligi](#loyiha-5--hujjat-oxshashligi) | Jaccard o'xshashligi | 🔴 |
| 6 | [Mini tasniflagich](#loyiha-6--mini-tasniflagich) | Matn tasniflash | 🔴 |

---

## Loyiha 1 · Sharhlar tahlilchisi

**Vazifa:** sharhlarni ijobiy/salbiy/neytralga ajrating va **statistika** chiqaring.

<details>
<summary>💻 Yechim</summary>

```python
sharhlar = [
    "Mahsulot juda yaxshi keldi tez yetkazildi",
    "Sifat past narxi qimmat afsus",
    "Ajoyib xizmat tavsiya qilaman hammaga",
    "Yetkazish sekin edi lekin mahsulot yaxshi",
    "Pul isrofi sifat juda past",
    "Zo'r narsa ekan mamnun qoldim",
]

ijobiy = ["yaxshi", "ajoyib", "zo'r", "a'lo", "tavsiya", "mamnun", "tez"]
salbiy = ["yomon", "past", "sifatsiz", "isrof", "afsus", "sekin", "qimmat"]

def sentiment(m):
    b = 0
    for s in m.lower().split():
        if s in ijobiy: b += 1
        if s in salbiy: b -= 1
    return b

natijalar = []
for s in sharhlar:
    b = sentiment(s)
    if b > 0:    t = "IJOBIY"
    elif b < 0:  t = "SALBIY"
    else:        t = "NEYTRAL"
    natijalar.append(t)
    print(t, "(", b, ") |", s)

print("-" * 60)
ij  = natijalar.count("IJOBIY")
sal = natijalar.count("SALBIY")
ne  = natijalar.count("NEYTRAL")
print("Ijobiy: ", ij,  "-", round(ij  / len(sharhlar) * 100), "%")
print("Salbiy: ", sal, "-", round(sal / len(sharhlar) * 100), "%")
print("Neytral:", ne,  "-", round(ne  / len(sharhlar) * 100), "%")
```

**Natija:**

```
IJOBIY ( 2 ) | Mahsulot juda yaxshi keldi tez yetkazildi
SALBIY ( -3 ) | Sifat past narxi qimmat afsus
IJOBIY ( 2 ) | Ajoyib xizmat tavsiya qilaman hammaga
NEYTRAL ( 0 ) | Yetkazish sekin edi lekin mahsulot yaxshi
SALBIY ( -1 ) | Pul isrofi sifat juda past
IJOBIY ( 2 ) | Zo'r narsa ekan mamnun qoldim
------------------------------------------------------------
Ijobiy:  3 - 50 %
Salbiy:  2 - 33 %
Neytral: 1 - 17 %
```

</details>

### 🔑 To'rtinchi sharh — NEYTRAL

`"Yetkazish **sekin** edi lekin mahsulot **yaxshi**"` → `-1 + 1 = 0`

Bu **haqiqatan neytral** — sharhda **ikkala** fikr ham bor! Model buni **to'g'ri** aniqladi.

> 💡 **`.count()`** — bu **17-modulning `list` metodi**. Uni endi statistika uchun ishlatyapsiz.

### ✏️ O'zgartirish

1. Yana 4 ta sharh qo'shing.
2. Ijobiy/salbiy so'zlar ro'yxatini kengaytiring.
3. `"emas"` ni hisobga oling *(2-darsdagi M4)*.
4. Eng **kuchli** ijobiy va salbiy sharhni toping.
5. O'rtacha ballni hisoblang.

---

## Loyiha 2 · Kalit so'zlar

**Vazifa:** matndan **eng muhim** so'zlarni ajratib oling.

<details>
<summary>💻 Yechim</summary>

```python
matn = """Python dasturlash tili juda mashhur. Python oson va kuchli.
Ko'p dasturchilar Python dan foydalanadi. Dasturlash qiziqarli soha."""

# ===== TO'XTATISH SO'ZLARI (stop words) =====
toxtatish = ["va", "juda", "ko'p", "dan", "bu", "u", "bir"]

# ===== TOZALASH + CHASTOTA =====
sozlar = matn.lower().replace(".", "").replace("\n", " ").split()
ch = {}
for s in sozlar:
    if s not in toxtatish and len(s) > 2:
        ch[s] = ch.get(s, 0) + 1

# ===== TARTIBLASH =====
juftlar = []
for s in ch:
    juftlar.append((ch[s], s))
juftlar.sort(reverse=True)

print("Jami so'z:", len(sozlar), " Turli:", len(ch))
print("-" * 40)
print("TOP-5 kalit so'z:")
for i in range(5):
    soni, soz = juftlar[i]
    print(" ", i+1, ".", soz, "-", soni, "marta")
```

**Natija:**

```
Jami so'z: 17  Turli: 10
----------------------------------------
TOP-5 kalit so'z:
  1 . python - 3 marta
  2 . dasturlash - 2 marta
  3 . tili - 1 marta
  4 . soha - 1 marta
  5 . qiziqarli - 1 marta
```

</details>

### 🔑 Uchta muhim g'oya

**1 · To'xtatish so'zlari** (*stop words*) — `"va"`, `"bu"`, `"bir"` kabi so'zlar **hech qanday ma'no bermaydi**. Ular **olib tashlanadi**.

> ## 📌 **21-modulda buni `nltk` avtomatik qiladi.**

**2 · Uzunlik filtri** — `len(s) > 2` qisqa so'zlarni chetlab o'tadi.

**3 · Tuple bilan tartiblash** — `(soni, soz)` juftliklarini `sort()` qilsangiz, u **birinchi element** bo'yicha tartiblaydi:

```python
juftlar = [(3, 'python'), (2, 'dasturlash'), (1, 'tili')]
juftlar.sort(reverse=True)      # soni bo'yicha KAMAYISH tartibida
```

*(17-modulning `tuple` va `sort` darslari!)*

### ✏️ O'zgartirish

1. To'xtatish so'zlari ro'yxatini kengaytiring.
2. Uzunlik filtrini `3` ga oshiring.
3. TOP-10 ni chiqaring.
4. Faqat **1 martadan ko'p** uchraganlarini chiqaring.
5. Vergul va boshqa belgilarni ham tozalang.

---

## Loyiha 3 · Niyat aniqlagich

**Vazifa:** chatbot uchun foydalanuvchi **niyatini** aniqlang va javob bering.

<details>
<summary>💻 Yechim</summary>

```python
# ===== NIYAT QOIDALARI =====
qoidalar = {
    "SALOMLASHISH": ["salom", "assalom", "hayrli", "xayrli"],
    "JOY":          ["qayerda", "manzil", "yaqin", "joylashgan"],
    "NARX":         ["qancha", "narx", "narxi", "pul"],
    "VAQT":         ["qachon", "soat", "vaqt", "necha"],
    "XAYRLASHUV":   ["xayr", "rahmat", "tashakkur"],
}

# ===== JAVOBLAR =====
javoblar = {
    "SALOMLASHISH": "Assalomu alaykum! Qanday yordam bera olaman?",
    "JOY":          "Manzilni xaritada ko'rsataymi?",
    "NARX":         "Narxlar ro'yxatini yuboraman.",
    "VAQT":         "Ish vaqtimiz: 9:00 - 18:00",
    "XAYRLASHUV":   "Sizga ham rahmat! Yaxshi kun tilaymiz.",
    "NOMA'LUM":     "Kechirasiz, tushunmadim. Boshqacha yozing.",
}

def niyat(savol):
    s = savol.lower()
    for n in qoidalar:
        for kalit in qoidalar[n]:
            if kalit in s:
                return n
    return "NOMA'LUM"

# ===== SINOV =====
savollar = [
    "Assalomu alaykum",
    "Do'kon qayerda joylashgan",
    "Bu qancha turadi",
    "Soat nechada ochasiz",
    "Rahmat sizga",
    "Ob-havo qanday",
]
for sv in savollar:
    n = niyat(sv)
    print("[", n, "]", sv)
    print("   ->", javoblar[n])
```

**Natija:**

```
[ SALOMLASHISH ] Assalomu alaykum
   -> Assalomu alaykum! Qanday yordam bera olaman?
[ JOY ] Do'kon qayerda joylashgan
   -> Manzilni xaritada ko'rsataymi?
[ NARX ] Bu qancha turadi
   -> Narxlar ro'yxatini yuboraman.
[ VAQT ] Soat nechada ochasiz
   -> Ish vaqtimiz: 9:00 - 18:00
[ XAYRLASHUV ] Rahmat sizga
   -> Sizga ham rahmat! Yaxshi kun tilaymiz.
[ NOMA'LUM ] Ob-havo qanday
   -> Kechirasiz, tushunmadim. Boshqacha yozing.
```

</details>

### 🔑 Ikkita lug'at — ikkita vazifa

```
qoidalar  →  niyatni ANIQLASH   (kirish)
javoblar  →  javob BERISH        (chiqish)
```

Bu — **17-modulning lug'at** naqshi. Ikkalasi **bir xil kalitlarga** ega *(18-modulning lug'at iteratsiyasi!)*.

### ⚠️ Tartib muhim

`qoidalar` da **birinchi mos kelgan** niyat qaytariladi. Agar savolda **ikkita** kalit bo'lsa — birinchisi g'olib.

### ✏️ O'zgartirish

1. Yana 3 ta niyat qo'shing (`SHIKOYAT`, `BUYURTMA`, `YORDAM`).
2. Sinov savollarini o'zingiz yozing.
3. `NOMA'LUM` bo'lganda **taklif** bering ("Balki siz ... so'ramoqchimisiz?").
4. Bir savolda **ikkita** niyat bo'lsa nima bo'ladi? Sinang.
5. **Barcha** mos niyatlarni qaytaring, faqat birinchisini emas.

---

## Loyiha 4 · Til aniqlagich

**Vazifa:** matn qaysi tilda ekanini aniqlang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== HAR TIL UCHUN ENG KENG TARQALGAN SO'ZLAR =====
belgilar = {
    "uz": ["va", "bir", "bu", "uchun", "bilan", "emas", "ham"],
    "en": ["the", "and", "is", "of", "to", "in", "that"],
    "ru": ["и", "в", "не", "на", "что", "это", "как"],
}

def til_aniqla(matn):
    sozlar = matn.lower().split()
    ballar = {}
    for til in belgilar:
        ball = 0
        for s in sozlar:
            if s in belgilar[til]:
                ball += 1
        ballar[til] = ball

    eng_til = ""
    eng_ball = 0
    for t in ballar:
        if ballar[t] > eng_ball:
            eng_ball = ballar[t]
            eng_til = t

    if eng_ball == 0:
        return "noma'lum", ballar
    return eng_til, ballar

# ===== SINOV =====
matnlar = [
    "Bu kitob juda qiziqarli va foydali",
    "This is the book that I like to read",
    "Это книга и она очень интересная",
    "Zzz qqq www",
]
for m in matnlar:
    t, b = til_aniqla(m)
    print("[", t, "]", m)
    print("   ballar:", b)
```

**Natija:**

```
[ uz ] Bu kitob juda qiziqarli va foydali
   ballar: {'uz': 2, 'en': 0, 'ru': 0}
[ en ] This is the book that I like to read
   ballar: {'uz': 0, 'en': 4, 'ru': 0}
[ ru ] Это книга и она очень интересная
   ballar: {'uz': 0, 'en': 0, 'ru': 2}
[ noma'lum ] Zzz qqq www
   ballar: {'uz': 0, 'en': 0, 'ru': 0}
```

</details>

### 🔑 Nima uchun bu ishlaydi?

Har bir tilda **eng ko'p ishlatiladigan so'zlar** — bu aynan **to'xtatish so'zlari**. Ular:

- Har bir jumlada **deyarli doim** uchraydi
- Tillar orasida **kesishmaydi** (`"the"` faqat inglizchada)

> ## 💡 **Bu — chinakam til aniqlagichlarning asosiy g'oyasi.** Google Translate ham shundan boshlanadi *(albatta, ancha murakkabroq).*

### ✏️ O'zgartirish

1. Har bir tilga yana 5 ta so'z qo'shing.
2. To'rtinchi tilni qo'shing (turk, qozoq).
3. Ball o'rniga **foizda ishonch** chiqaring.
4. Qisqa matnlarda sinang (1–2 so'z). Ishonchli ishlaydimi?
5. **Aralash** matn bilan sinang (`"Bu is very yaxshi"`).

---

## Loyiha 5 · Hujjat o'xshashligi

**Vazifa:** ikki matn qanchalik o'xshash ekanini **son** bilan o'lchang.

<details>
<summary>💻 Yechim</summary>

```python
hujjatlar = [
    "Python dasturlash tili oson va kuchli",
    "Java dasturlash tili kuchli va tez",
    "Pizza tayyorlash retsepti oson",
    "Python va Java dasturlash uchun ishlatiladi",
]

# ===== JACCARD O'XSHASHLIGI =====
def jaccard(a, b):
    """Kesishma / Birlashma  →  0.0 dan 1.0 gacha"""
    A = set(a.lower().split())
    B = set(b.lower().split())
    kes = len(A & B)        # kesishma
    bir = len(A | B)        # birlashma
    if bir == 0:
        return 0.0
    return kes / bir

# ===== MATRITSA =====
print("Jaccard o'xshashlik matritsasi:")
print("      ", end="")
for j in range(len(hujjatlar)):
    print(" ", j, "   ", end="")
print()
for i in range(len(hujjatlar)):
    print(i, "  | ", end="")
    for j in range(len(hujjatlar)):
        print(round(jaccard(hujjatlar[i], hujjatlar[j]), 2), " ", end="")
    print()

# ===== ENG O'XSHASH JUFTLIK =====
print("-" * 50)
eng_i, eng_j, eng_o = 0, 1, 0
for i in range(len(hujjatlar)):
    for j in range(i+1, len(hujjatlar)):
        o = jaccard(hujjatlar[i], hujjatlar[j])
        if o > eng_o:
            eng_o, eng_i, eng_j = o, i, j
print("Eng o'xshash juftlik:", eng_i, "va", eng_j, "-", round(eng_o, 3))
print("  ", hujjatlar[eng_i])
print("  ", hujjatlar[eng_j])
```

**Natija:**

```
Jaccard o'xshashlik matritsasi:
        0      1      2      3    
0   | 1.0  0.5  0.11  0.33  
1   | 0.5  1.0  0.0  0.33  
2   | 0.11  0.0  1.0  0.0  
3   | 0.33  0.33  0.0  1.0  
--------------------------------------------------
Eng o'xshash juftlik: 0 va 1 - 0.5
   Python dasturlash tili oson va kuchli
   Java dasturlash tili kuchli va tez
```

</details>

### 🔑 Jaccard formulasi

```
              |A ∩ B|         umumiy so'zlar
J(A,B)  =  ───────────  =  ────────────────────
              |A ∪ B|       barcha turli so'zlar
```

**Misol** — 0 va 1-hujjatlar:

```
A = {python, dasturlash, tili, oson, va, kuchli}
B = {java, dasturlash, tili, kuchli, va, tez}

A ∩ B = {dasturlash, tili, va, kuchli}   →  4 ta
A ∪ B = 8 ta turli so'z

J = 4 / 8 = 0.5   ✅
```

> ## 💡 **`&` va `|` — bu `set` operatorlari.** Ular **17-modulda** aytilmagan, lekin bu yerda **juda foydali**.

### ⚠️ Jaccard'ning kamchiligi

`"Pizza retsepti"` va `"Python dasturlash"` — **0.11** (ikkalasida `"oson"` bor). Lekin ular **butunlay boshqa mavzular**.

> **Yechim:** to'xtatish so'zlarini **olib tashlash** yoki **TF-IDF** ishlatish *(24-modul)*.

### ✏️ O'zgartirish

1. To'xtatish so'zlarini olib tashlab, qayta hisoblang.
2. Yana 3 ta hujjat qo'shing.
3. Berilgan hujjatga **eng o'xshash** hujjatni topuvchi funksiya yozing.
4. `0.3` dan yuqori juftliklarni chiqaring.
5. **Kosinus** o'xshashligi bilan solishtiring *(24-modulda ko'rasiz)*.

---

## Loyiha 6 · Mini tasniflagich

**Vazifa:** shikoyatlarni **toifalarga** ajrating — nazorat ostida o'rganish.

<details>
<summary>💻 Yechim</summary>

```python
# ===== O'RGATISH MA'LUMOTI (yorliqlangan) =====
oquv = [
    ("Yetkazib berish juda sekin bo'ldi", "YETKAZISH"),
    ("Kuryer kech keldi buyurtma",        "YETKAZISH"),
    ("Narxi juda qimmat ekan",            "NARX"),
    ("Bunday pulga arzimaydi qimmat",     "NARX"),
    ("Mahsulot buzuq keldi sifat",        "SIFAT"),
    ("Sifat past bir haftada sindi",      "SIFAT"),
]

# ===== O'RGATISH =====
model = {}          # so'z -> {toifa: soni}
toifalar = {}

for matn, toifa in oquv:
    toifalar[toifa] = toifalar.get(toifa, 0) + 1
    for s in matn.lower().split():
        if s not in model:
            model[s] = {}
        model[s][toifa] = model[s].get(toifa, 0) + 1

print("O'rgatildi:", len(oquv), "ta misol,", len(toifalar), "ta toifa")
print("Lug'at hajmi:", len(model), "ta so'z")
print("-" * 50)

# ===== TASNIFLASH =====
def tasnifla(matn):
    ballar = {}
    for t in toifalar:
        ballar[t] = 0
    for s in matn.lower().split():
        if s in model:
            for t in model[s]:
                ballar[t] += model[s][t]

    eng_t = ""
    eng_b = 0
    for t in ballar:
        if ballar[t] > eng_b:
            eng_b = ballar[t]
            eng_t = t
    if eng_b == 0:
        return "NOMA'LUM", ballar
    return eng_t, ballar

# ===== SINOV (model ko'rmagan matnlar) =====
test = ["Buyurtma sekin keldi", "Juda qimmat narx",
        "Mahsulot sindi", "Ob-havo yaxshi"]
for m in test:
    t, b = tasnifla(m)
    print("[", t, "]", m)
    print("   ballar:", b)
```

**Natija:**

```
O'rgatildi: 6 ta misol, 3 ta toifa
Lug'at hajmi: 22 ta so'z
--------------------------------------------------
[ YETKAZISH ] Buyurtma sekin keldi
   ballar: {'YETKAZISH': 3, 'NARX': 0, 'SIFAT': 1}
[ NARX ] Juda qimmat narx
   ballar: {'YETKAZISH': 1, 'NARX': 3, 'SIFAT': 0}
[ SIFAT ] Mahsulot sindi
   ballar: {'YETKAZISH': 0, 'NARX': 0, 'SIFAT': 2}
[ NOMA'LUM ] Ob-havo yaxshi
   ballar: {'YETKAZISH': 0, 'NARX': 0, 'SIFAT': 0}
```

> ⚠️ **Diqqat:** `"Buyurtma sekin keldi"` da `SIFAT` ham **1 ball** oldi — chunki `"keldi"` so'zi `"Mahsulot buzuq **keldi** sifat"` da ham uchragan. Lekin `YETKAZISH` **3 ball** bilan g'olib chiqdi.
>
> Bu — **ko'p ma'noli so'z** muammosi: `"keldi"` ikkala toifada ham bo'lishi mumkin.

</details>

### 🔑 Ichma-ich lug'at

```python
model = {
    "sekin":  {"YETKAZISH": 1},
    "keldi":  {"YETKAZISH": 1, "SIFAT": 1},     # ← IKKI toifada!
    "qimmat": {"NARX": 2},
}
# model["keldi"]["SIFAT"]  →  1
#        ↑        ↑
#     1-bosqich  2-bosqich
```

Bu — **17-modulning ichma-ich lug'ati**. `model[s][t]` — **ikki bosqichli** murojaat.

### 💡 Bu — Naive Bayes ning soddalashtirilgani

Chinakam **Naive Bayes** tasniflagichi xuddi shu g'oyaga asoslanadi, lekin:
- **Ehtimollik** ishlatadi, oddiy sanoq emas
- **Toifa hajmini** hisobga oladi
- **Ko'rilmagan so'zlarni** to'g'ri qayta ishlaydi (*smoothing*)

> ## 📌 **26-modulda buni `sklearn` bilan qilasiz — 3 qatorda.**

### ✏️ O'zgartirish

1. Yana 2 ta toifa qo'shing (`XIZMAT`, `TO'LOV`).
2. Har bir toifaga yana 2 ta misol qo'shing.
3. `"NOMA'LUM"` o'rniga **eng katta toifani** qaytaring.
4. Ballarni **foizga** aylantiring (ishonch darajasi).
5. Modelning **aniqligini** o'lchang — test to'plami yasab.

---

## 🏆 Yakuniy loyiha · O'z NLP tizimingiz

```
☐ Kamida 20 ta matn ma'lumoti
☐ Chastota lug'ati (dict)
☐ To'xtatish so'zlari filtri
☐ Kamida 3 ta funksiya
☐ Kamida 1 ta set amali (& yoki |)
☐ Nazorat ostida YOKI nazoratsiz yondashuv
☐ Natijani FOIZDA chiqarish
☐ Kamida 1 ta xato tahlili ("nima uchun noto'g'ri chiqdi?")
☐ Chiroyli hisobot
```

### G'oyalar

| Loyiha | Yondashuv | Nima qiladi |
|---|---|---|
| **Sharh tahlilchisi** | Nazorat ostida | Ijobiy/salbiy + statistika |
| **Yangilik guruhlagich** | Nazoratsiz | Mavzu bo'yicha guruhlash |
| **Shikoyat yo'naltiruvchi** | Nazorat ostida | Bo'limga yuborish |
| **Rezyume moslashtiruvchi** | O'xshashlik | Vakansiyaga mos nomzod |
| **Plagiat aniqlagich** | O'xshashlik | Jaccard bilan |
| **FAQ boti** | O'xshashlik | Eng yaqin savolni topish |
| **Kalit so'z bulut** | Chastota | Eng muhim so'zlar |

### Shablon

```python
# ===============================================
#   NLP TIZIMI NOMI
#   Muallif: ______
# ===============================================

# ===== 1 · MA'LUMOT =====
matnlar = []
yorliqlar = []          # nazorat ostida bo'lsa

# ===== 2 · TOZALASH =====
toxtatish = ["va", "bu", "bir", "uchun", "bilan"]

def tozala(matn):
    natija = []
    for s in matn.lower().replace(".", "").split():
        if s not in toxtatish and len(s) > 2:
            natija.append(s)
    return natija

# ===== 3 · CHASTOTA =====
def chastota(sozlar):
    ch = {}
    for s in sozlar:
        ch[s] = ch.get(s, 0) + 1
    return ch

# ===== 4 · ASOSIY MANTIQ =====
def tahlil(matn):
    sozlar = tozala(matn)
    ch = chastota(sozlar)
    return ch

# ===== 5 · HISOBOT =====
def hisobot(matnlar):
    print("=" * 50)
    print("Jami matn:", len(matnlar))
    print("-" * 50)
    for m in matnlar:
        print(tahlil(m))
    print("=" * 50)

# ===== 6 · XATO TAHLILI =====
# Qaysi natija noto'g'ri chiqdi? NIMA UCHUN?
```

---

## ✅ O'zingizni tekshiring

```
☐ Kod xatosiz ishladimi?
☐ To'xtatish so'zlarini filtrladimmi?
☐ Natijalarni FOIZDA chiqardimmi?
☐ Kamida bitta XATO natijani topib, sababini tushuntirdimmi?
☐ Yangi (model ko'rmagan) matnlar bilan sinadimmi?
☐ Yorliqsiz matn kelsa nima bo'lishini bilamanmi?
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

## 🔜 21-modulda nima bo'ladi?

Bu yerda **qo'lda** yozgan hamma narsangiz `nltk` bilan **bir qatorda** bo'ladi:

| Bu modulda (qo'lda) | 21-modulda (`nltk`) |
|---|---|
| `matn.lower().split()` | `word_tokenize(matn)` |
| `toxtatish = [...]` | `stopwords.words('english')` |
| Chastota lug'ati | `FreqDist(sozlar)` |
| — | `PorterStemmer()` — o'zak topish |
| — | `WordNetLemmatizer()` — lug'at shakli |

> ## 💡 **Lekin siz endi ICHIDA nima borligini bilasiz.**

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
