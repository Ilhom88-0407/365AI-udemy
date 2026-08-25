# 14-Modul · Operatorlar haqida ko'proq

## 🐍 Bir jumlada

> **13-modulda siz HISOBLASHNI o'rgandingiz. 14-modulda QAROR QABUL QILISHNI o'rganasiz.**

Bu modul — **15-modul (shartlar)** ning to'g'ridan-to'g'ri poydevori. `if` yozishdan oldin **shartni** yoza olish kerak.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [Solishtirish operatorlari](01-Comparison-Operators.md) ⭐ | `== != > < >= <=` · natija **doim** `bool` |
| 2 | [Mantiqiy va ayniyat operatorlari](02-Logical-and-Identity-Operators.md) ⭐ | `not → and → or` · `is` va `==` **bir xil emas** |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **58 ta mashq** — kursning rasmiy topshiriqlari + qo'shimchalar, yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — mantiqiy tizimlar + "o'zgartirish" vazifalari |

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | Solishtirish operatorlari | 14 |
| B | Mantiqiy operatorlar | 14 |
| C | Muhimlik tartibi | 12 |
| D | Ayniyat operatorlari | 8 |
| E | Aralash va xatolar | 10 |
| **JAMI** | | **58** |

### Mini-loyihalar

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | Kirish nazoratchisi | `==` + `and` | 🟢 |
| 2 | Chipta narxi | `or` + `not` | 🟢 |
| 3 | Kabisa yili | Murakkab shart + qavslar | 🟡 |
| 4 | Parol kuchi | Ko'p shartni birlashtirish | 🟡 |
| 5 | Chegirma mantig'i | `bool` ni son sifatida | 🔴 |
| 6 | Uchburchak tekshiruvi | Geometriya + mantiq | 🔴 |
| 🏆 | O'z mantiqiy tizimingiz (6 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**Solishtirish:**
- [ ] 6 ta operatorni (`== != > < >= <=`) yoddan aytasiz
- [ ] Natija **doim `bool`** ekanini bilasiz
- [ ] O'ng tomonda **ifoda** bo'lishi mumkinligini bilasiz
- [ ] `=>` va `=<` **yo'q** ekanini bilasiz
- [ ] Satrlar **alifbo tartibida** solishtirilishini bilasiz
- [ ] `10 < 20 < 30` **zanjiri** ishlashini bilasiz

**Mantiqiy:**
- [ ] `and`, `or`, `not` — **so'z**, belgi emasligini bilasiz
- [ ] `and` — **ikkalasi**, `or` — **kamida bittasi** ekanini bilasiz
- [ ] `or` da **tartib ahamiyatsiz** ekanini bilasiz
- [ ] Muhimlik tartibini (**`not → and → or`**) yoddan aytasiz
- [ ] Murakkab ifodani **bosqichma-bosqich** yechasiz
- [ ] Solishtirish **mantiqiydan oldin** bajarilishini bilasiz

**Ayniyat:**
- [ ] `is` va `is not` nima qilishini bilasiz
- [ ] `is` va `==` **farqini** tushuntirasiz
- [ ] `is` ni faqat **`None`** bilan ishlatasiz
- [ ] `5 is 6` **SyntaxWarning** berishini bilasiz

**Amaliyot:**
- [ ] 📝 **58 ta mashqning** kamida 44 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z mantiqiy tizimingizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-comparison-operators.svg`](assets/01-comparison-operators.svg) | 6 ta solishtirish operatori + `=` vs `==` ogohlantirishi |
| [`02-logical-operators.svg`](assets/02-logical-operators.svg) | `and`/`or`/`not` jadvallari + muhimlik tartibi + ishlangan misol |
| [`03-identity-operators.svg`](assets/03-identity-operators.svg) | `is` vs `==` — qiymat va xotira farqi |

---

## ⚠️ Modulning 6 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **`=>` yozish** | `x => 5` → `SyntaxError` | `x >= 5` |
| 2 | **`&&` va `\|\|`** | Python'da **yo'q** | `and` va `or` |
| 3 | **`or` ni birinchi o'ylash** | `True or False and False` | `and` **birinchi** → `True` |
| 4 | **Qavsni unutish** | `b4 and not b100 or b400` | `b4 and (not b100 or b400)` |
| 5 | **`is` ni son bilan** | `x is 5` → `SyntaxWarning` | `x == 5` |
| 6 | **Turlarni solishtirish** | `"5" > 5` → `TypeError` | `int("5") > 5` |

---

## 🧠 Eng muhim jadval

```
MUHIMLIK TARTIBI (yuqoridan pastga)

1.  ( )                    qavslar
2.  **                     daraja
3.  *  /  //  %            ko'paytirish, bo'lish
4.  +  -                   qo'shish, ayirish
5.  ==  !=  >  <  >=  <=   solishtirish
6.  not                    inkor
7.  and                    va
8.  or                     yoki

Misol:   3 + 2 > 4 and not False
         ↓ 1. arifmetika
         5 > 4 and not False
         ↓ 2. solishtirish
         True and not False
         ↓ 3. not
         True and True
         ↓ 4. and
         True
```

---

## 🔗 Bog'liqlik

```
12-modul  ─  bool turi (True / False)
13-modul  ─  ==  ·  arifmetika  ·  chekinish
    ↓
14-modul  ─  OPERATORLAR HAQIDA KO'PROQ        ← siz shu yerdasiz
    ↓          ==  !=  >  <  >=  <=
    ↓          not  and  or   ·   is  is not
    ↓
15-modul  ─  Shartlar (if / elif / else)     ← BU MODULSIZ MUMKIN EMAS
16-modul  ─  Funksiyalar
17-modul  ─  Ketma-ketliklar                 ← `in` operatori
18-modul  ─  Iteratsiya (for / while)        ← shartlar yana kerak
```

> 💡 **Diqqat qiling:** ma'ruzachi darsni shunday tugatadi: *"Keyingi darsimizdan boshlab biz dasturchining kundalik hayotining KATTA QISMI bo'lgan mavzu bilan shug'ullanamiz — SHARTLAR."*

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Solishtirish operatori | *comparison operator* | `== != > < >= <=` |
| Mantiqiy operator | *logical operator* | `not`, `and`, `or` |
| Boolean operator | *boolean operator* | Mantiqiy operatorning ikkinchi nomi |
| Ayniyat operatori | *identity operator* | `is`, `is not` |
| Operand | *operand* | Operator ishlaydigan qiymat |
| Ifoda | *expression* | Qiymat hosil qiluvchi kod |
| Gap | *statement* | Rost yoki yolg'on bo'la oladigan ifoda |
| Muhimlik tartibi | *order of precedence* | Qaysi operator oldin bajariladi |
| Haqiqat jadvali | *truth table* | Barcha kombinatsiyalar jadvali |
| Zanjirli solishtirish | *chained comparison* | `10 < 20 < 30` |
| Obyekt | *object* | Xotiradagi qiymat |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 58 ta mashqdan kamida 44 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z mantiqiy tizimimni yozdim (8+ o'zgaruvchi, and/or/not)
☐ 5. Muhimlik tartibini (not→and→or) yoddan aytaman
☐ 6. `is` va `==` farqini tushuntira olaman
☐ 7. Yuqoridagi 6 ta tuzoqni bilaman
```

Hammasi ✅ bo'lsa — **15-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**15-modul: Shartlar** — `if`, `elif`, `else`

---

⬅️ [13-modul](../13-Basic-Python-Syntax/README.md) · 🏠 [Bosh sahifa](../README.md)
