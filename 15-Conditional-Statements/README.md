# 15-Modul · Shart operatorlari

## 🐍 Bir jumlada

> **14-modulda siz SHART YOZISHNI o'rgandingiz. 15-modulda kodingiz shu shartga qarab HARAKAT QILADI.**

Ma'ruzachining so'zi bilan: *"dasturchining kundalik hayotining **katta qismi**"*.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [`if` operatori](01-The-IF-Statement.md) ⭐ | `==` · ikki nuqta `:` · chekinish |
| 2 | [`else` operatori](02-The-ELSE-Statement.md) ⭐ | "Qolgan hamma holat" · kod bloklari |
| 3 | [`elif` operatori](03-The-ELIF-Statement.md) ⭐ | Boshqaruv oqimi · **TARTIB MUHIM** |
| 4 | [Boolean qiymatlar haqida](04-A-Note-on-Boolean-Values.md) | Har bir shart → `True`/`False` → yo'l |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **64 ta mashq** — kursning rasmiy topshiriqlari + qo'shimchalar, yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — qaror qabul qiluvchi dasturlar |

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | `if` operatori | 12 |
| B | `else` operatori | 12 |
| C | `elif` operatori | 14 |
| D | Tartib va mantiq | 10 |
| E | Boolean qiymatlar | 8 |
| F | Xatolarni toping | 8 |
| **JAMI** | | **64** |

### Mini-loyihalar

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | Baho tizimi | Ko'p `elif`, tartib | 🟢 |
| 2 | Aqlli chek | Bosqichli chegirma | 🟢 |
| 3 | Oydagi kunlar | Ichma-ich shart + kabisa | 🟡 |
| 4 | Kvadrat tenglama | 3 daraja ichma-ich shart | 🔴 |
| 5 | Yo'l politsiyasi | Jarima shkalasi | 🟡 |
| 6 | Parol ball tizimi | Ball to'plash + daraja | 🔴 |
| 🏆 | O'z qaror tizimingiz (7 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**Sintaksis:**
- [ ] `if shart:` yozasiz — **ikki nuqtani unutmasdan**
- [ ] Blokni **chekintirasiz** (4 bo'sh joy)
- [ ] `if` ichida **`==`** ishlatasiz, `=` emas
- [ ] `else` da **shart yozilmasligini** bilasiz
- [ ] `if` va `else` ni **bir xil ustunda** qo'yasiz
- [ ] `elif` da **shart majburiy** ekanini bilasiz

**Mantiq:**
- [ ] Shart bajarilmasa **hech narsa** chiqmasligini bilasiz
- [ ] `else` — **"qolgan hamma holat"** ekanini bilasiz
- [ ] Nechta `elif` bo'lishi mumkinligini bilasiz (**cheklovsiz**)
- [ ] Kompyuter **yuqoridan pastga** o'qishini bilasiz
- [ ] **Birinchi mos shartda TO'XTASHINI** bilasiz
- [ ] **Eng tor shartni eng oldin** yozasiz
- [ ] **Foydasiz kodni** (hech qachon bajarilmaydigan `elif`) tanib olasiz

**Boolean:**
- [ ] Har bir shart **`True`/`False`** ga aylanishini bilasiz
- [ ] Shartni **alohida o'zgaruvchida** saqlay olasiz
- [ ] **Truthy/Falsy** ni bilasiz (`0`, `""`, `[]`, `None` → yolg'on)

**Amaliyot:**
- [ ] 📝 **64 ta mashqning** kamida 49 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z qaror tizimingizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-if-flow.svg`](assets/01-if-flow.svg) | `if` blok-sxemasi + sintaksis |
| [`02-if-else-flow.svg`](assets/02-if-else-flow.svg) | Ikkita yo'l + chekinish ogohlantirishi |
| [`03-elif-control-flow.svg`](assets/03-elif-control-flow.svg) | To'liq `if/elif/else` zanjiri + tartib tuzog'i |
| [`04-boolean-logic.svg`](assets/04-boolean-logic.svg) | Shart → boolean → yo'l tanlash |

---

## ⚠️ Modulning 7 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **Ikki nuqta yo'q** | `if x > 5` | `if x > 5:` |
| 2 | **Chekinish yo'q** | `IndentationError` | 4 ta bo'sh joy |
| 3 | **`=` va `==`** | `if x = 5:` | `if x == 5:` |
| 4 | **`else` chekintirilgan** | `SyntaxError` | `if` bilan bir ustunda |
| 5 | **`else` ga shart** | `else x < 5:` | `else:` yoki `elif x < 5:` |
| 6 | **Shartlar tartibi** | `elif y<5` oldin `elif y<0` | Tor shart **oldin** |
| 7 | **Ikkita `if`** | Ikkalasi ham bajariladi | `if`/`else` — faqat bittasi |

---

## 🧠 Eng muhim g'oya

```
KOMPYUTER BIRINCHI MOS SHARTDA TO'XTAYDI

def compare_to_five(y):
    if y > 5:
        return "Greater"
    elif y < 5:              ← y = -3 uchun BU rost
        return "Less"        ← MASHINA SHU YERDA TO'XTAYDI
    elif y < 0:              ← BU YERGA HECH QACHON YETMAYDI
        return "Negative"
    else:
        return "Equal"

compare_to_five(-3)  →  "Less"     ← "Negative" EMAS!


TO'G'RI TARTIB:

    if y > 5:      "Greater"
    elif y < 0:    "Negative"    ← TOR shart OLDIN
    elif y < 5:    "Less"        ← KENG shart KEYIN
    else:          "Equal"

compare_to_five(-3)  →  "Negative"  ✅
```

---

## 🔗 Bog'liqlik

```
13-modul  ─  chekinish  ·  ikki nuqta
14-modul  ─  ==  !=  >  <  ·  and  or  not
    ↓
15-modul  ─  SHART OPERATORLARI                ← siz shu yerdasiz
    ↓          if  ·  elif  ·  else
    ↓          boshqaruv oqimi
    ↓
16-modul  ─  Funksiyalar          ← if bilan birga ishlaydi
17-modul  ─  Ketma-ketliklar
18-modul  ─  Iteratsiya (for/while)  ← if sikl ichida
19-modul  ─  Muhim tushunchalar
```

> 💡 **Diqqat qiling:** 3-darsdagi `def compare_to_five(y)` — bu **funksiya**. U to'liq **16-modulda** tushuntiriladi. Hozircha shartlarga e'tibor bering.

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Shart operatori | *conditional statement* | `if`, `elif`, `else` |
| Shart | *condition* | `True`/`False` qaytaruvchi ifoda |
| Ikki nuqta | *colon* | `:` — blok boshlanishi |
| Chekinish | *indentation* | Blokni belgilaydigan bo'sh joy |
| Kod bloki | *block of code* | Bir guruh bog'liq buyruqlar |
| Boshqaruv oqimi | *control flow* | Kod bajarilish tartibi |
| `elif` | *elif (else if)* | "Aks holda, agar..." |
| Tugash nuqtasi | *endpoint* | Shartdan keyin kod davom etadigan joy |
| Foydasiz kod | *unreachable code* | Hech qachon bajarilmaydigan shart |
| Tor / keng shart | *narrow / broad condition* | Kam / ko'p holatni qamraydi |
| Boolean qiymat | *boolean value* | `True` yoki `False` |
| Truthy / Falsy | *truthy / falsy* | `if` da rost / yolg'on hisoblanadi |
| Validatsiya | *validation* | Kiritilgan ma'lumotni tekshirish |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 64 ta mashqdan kamida 49 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z qaror tizimimni yozdim (10+ o'zgaruvchi, 4+ elif)
☐ 5. Shartlar tartibi nima uchun muhimligini tushuntira olaman
☐ 6. Foydasiz kodni tanib ola olaman
☐ 7. Yuqoridagi 7 ta tuzoqni bilaman
```

Hammasi ✅ bo'lsa — **16-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**[16-modul: Funksiyalar](../16-Functions/README.md)** — `def`, `return`, argumentlar

> Ma'ruzachidan: *"Ajoyib! Keyingi bo'limimizda biz **Python funksiyalari** olamiga sho'ng'iymiz."*

---

⬅️ [14-modul](../14-More-on-Operators/README.md) · 🏠 [Bosh sahifa](../README.md)
