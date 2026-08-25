# 16-Modul · Funksiyalar

## 🐍 Bir jumlada

> **"Python funksiyalari — dasturchilar uchun BEBAHO vosita."**

Shu paytgacha siz kod **yozdingiz**. Endi siz **vositalar yaratasiz** — bir marta yozib, **cheksiz marta** ishlatasiz.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [Funksiya e'lon qilish](01-Defining-a-Function.md) ⭐ | `def` · e'lon ≠ bajarish · qavslar = "bajar!" |
| 2 | [Parametrli funksiya](02-Function-with-a-Parameter.md) ⭐ | `return` · **parametr** va **argument** farqi |
| 3 | [Boshqa usul](03-Another-Way-to-Define-a-Function.md) ⭐ | `print` va `return` — **bir xil emas** |
| 4 | [Funksiya ichida funksiya](04-Using-a-Function-in-Another-Function.md) | DRY — o'zingizni takrorlamang |
| 5 | [Shartlar va funksiyalar](05-Combining-Conditionals-and-Functions.md) ⭐ | **Fundamental tushuncha** |
| 6 | [Bir necha argument](06-Functions-with-a-Few-Arguments.md) | Pozitsiyali va **nomli** argumentlar |
| 7 | [Ichki funksiyalar](07-Notable-Built-in-Functions.md) ⭐ | `max` `min` `abs` `sum` `round` `pow` `len` |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **68 ta mashq** — kursning rasmiy topshiriqlari + qo'shimchalar, yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — funksiyalardan qurilgan dasturlar |

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | Funksiya e'lon qilish | 10 |
| B | Parametrlar va `return` | 14 |
| C | `print` va `return` | 10 |
| D | Funksiya ichida funksiya | 10 |
| E | Shartlar va funksiyalar | 12 |
| F | Ichki funksiyalar | 12 |
| **JAMI** | | **68** |

### Mini-loyihalar

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | Modulli kalkulyator | Ko'p funksiya + validatsiya | 🟢 |
| 2 | Chek tizimi | Funksiyalar zanjiri | 🟡 |
| 3 | Harorat konvertori | Ikki tomonlama konvertatsiya | 🟡 |
| 4 | Baho tizimi | Funksiya + shart + GPA | 🟡 |
| 5 | Parol tekshiruvchi | Ball to'plash funksiyalari | 🔴 |
| 6 | Statistika hisoblagichi | Ichki funksiyalar birga | 🔴 |
| 🏆 | O'z funksiyalar kutubxonangiz (7 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**Asoslar:**
- [ ] `def` — **kalit so'z** ekanini bilasiz
- [ ] **E'lon qilish** va **chaqirish** farqini bilasiz
- [ ] Qavslar `()` — **"bajar!"** buyrug'i ekanini bilasiz
- [ ] Funksiya **avval e'lon** qilinishi kerakligini bilasiz
- [ ] Nolta parametrli funksiya bo'lishi mumkinligini bilasiz

**`return`:**
- [ ] **Parametr** va **argument** farqini aytasiz
- [ ] `return` funksiyani **darrov tugatishini** bilasiz
- [ ] `return` **siz** funksiya `None` qaytarishini bilasiz
- [ ] Funksiyadan **faqat bitta** natija qaytishini bilasiz
- [ ] `print` va `return` ni **hech qachon** adashtirmaysiz

**Kompozitsiya:**
- [ ] Funksiya ichida funksiya chaqirasiz
- [ ] **DRY** tamoyilini qo'llaysiz
- [ ] Funksiya + `if/else` ni birlashtirasiz
- [ ] **Validatsiya** qo'shasiz

**Argumentlar:**
- [ ] Bir nechta argumentni **vergul** bilan berasiz
- [ ] **Tartib muhim** ekanini bilasiz
- [ ] **Nomli argumentlar** bilan tartibdan qutulasiz
- [ ] **Standart qiymat** berasiz

**Ichki funksiyalar:**
- [ ] `max`, `min`, `abs`, `sum`, `round`, `pow`, `len` ni ishlatasiz
- [ ] **Bankir yaxlitlashini** bilasiz (`round(2.5)` → `2`)
- [ ] `type()` bilan tur tekshirasiz

**Amaliyot:**
- [ ] 📝 **68 ta mashqning** kamida 52 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z kutubxonangizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-function-anatomy.svg`](assets/01-function-anatomy.svg) | Funksiyaning har bir qismi + e'lon vs chaqiruv |
| [`02-print-vs-return.svg`](assets/02-print-vs-return.svg) | `print` va `return` yonma-yon + ikkita `return` tuzog'i |
| [`03-function-in-function.svg`](assets/03-function-in-function.svg) | `with_bonus(8)` → `wage(8)` → `250` zanjiri |
| [`04-builtin-functions.svg`](assets/04-builtin-functions.svg) | Barcha ichki funksiyalar + `round()` tuzog'i |

---

## ⚠️ Modulning 8 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **Qavslarsiz chaqirish** | `simple` | `simple()` |
| 2 | **`return` unutish** | natija `None` | `return result` |
| 3 | **`print` ni `return` deb o'ylash** | `a = f_print(5)` → `None` | `return` ishlating |
| 4 | **Ikkita `return`** | 2-si **o'lik kod** | `print` + `return` |
| 5 | **E'londan oldin chaqirish** | `NameError` | Avval `def` |
| 6 | **Argument tartibi** | `bolish(2, 10)` → `0.2` | Tartibga e'tibor |
| 7 | **Pozitsiyali nomlidan keyin** | `f(a=10, 3)` → `SyntaxError` | `f(10, b=3)` |
| 8 | **`round(2.5)` → `3` deb o'ylash** | aslida **`2`** | Bankir yaxlitlashi |

---

## 🧠 Eng muhim jadval

```
print  va  return

┌──────────────────┬─────────────────┬──────────────────┐
│                  │      print      │      return      │
├──────────────────┼─────────────────┼──────────────────┤
│ Kimga            │  dasturchiga    │  dasturga        │
│ Ekranda ko'rinadi│  HA             │  yo'q            │
│ Funksiyani tugat.│  yo'q           │  HA              │
│ Necha marta      │  cheklovsiz     │  BITTA bajarilad.│
│ Natijani saqlash │  yo'q  (None)   │  HA              │
│ Hisobga ta'sir   │  yo'q           │  HA              │
└──────────────────┴─────────────────┴──────────────────┘

def f(x): print(x * 2)
a = f(5)        →  ekranda 10,  a = None    ❌

def f(x): return x * 2
a = f(5)        →  ekranda hech narsa,  a = 10   ✅
a + 1           →  11                             ✅
```

---

## 🔗 Bog'liqlik

```
13-modul  ─  def, return bilan TANISHUV (chekinish darsida)
14-modul  ─  ==, and, or, not
15-modul  ─  if / elif / else
    ↓
16-modul  ─  FUNKSIYALAR                       ← siz shu yerdasiz
    ↓          def · return · parametr/argument
    ↓          funksiya ichida funksiya
    ↓          ichki funksiyalar
    ↓
17-modul  ─  Ketma-ketliklar (list, tuple, dict)  ← sum(), len() u yerda
18-modul  ─  Iteratsiya (for / while)             ← funksiya + sikl
19-modul  ─  Muhim tushunchalar (lambda va h.k.)
```

> 💡 **Diqqat qiling:** 7-darsda `sum([1,2,3,4])` va `list_1 = [1,2,3,4]` ko'rdingiz. **Ro'yxatlar** to'liq **17-modulda** ochiladi.

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Funksiya | *function* | Qayta ishlatiladigan kod bloki |
| Kalit so'z | *keyword* | Python tilining o'z so'zi |
| E'lon qilish | *define* | Funksiyani yaratish |
| Chaqirish | *call* | Funksiyani bajarish |
| Parametr | *parameter* | E'londa ko'rsatilgan o'zgaruvchi |
| Argument | *argument* | Chaqiruvda berilgan haqiqiy qiymat |
| Tana | *body* | Funksiyaning chekintirilgan qismi |
| `return` | *return* | Qiymat qaytaradi va funksiyani tugatadi |
| Kirish / Chiqish | *input / output* | Funksiyaga kiruvchi / undan chiquvchi |
| `None` | *None* | "Hech narsa" qiymati |
| Pozitsiyali argument | *positional argument* | Tartib bo'yicha |
| Nomli argument | *keyword argument* | Nom bilan |
| Standart qiymat | *default value* | Oldindan belgilangan qiymat |
| Ichki funksiya | *built-in function* | Python bilan birga keladi |
| Mutlaq qiymat | *absolute value* | Ishorasiz qiymat |
| Bankir yaxlitlashi | *banker's rounding* | `.5` ni juft songa |
| DRY | *Don't Repeat Yourself* | O'zingizni takrorlamang |
| Rekursiya | *recursion* | Funksiyaning o'zini chaqirishi |
| O'lik kod | *dead code* | Bajarilmaydigan kod |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 68 ta mashqdan kamida 52 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z funksiyalar kutubxonamni yozdim (8+ funksiya)
☐ 5. print va return farqini tushuntira olaman
☐ 6. Parametr va argument farqini bilaman
☐ 7. Yuqoridagi 8 ta tuzoqni bilaman
```

Hammasi ✅ bo'lsa — **17-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**[17-modul: Ketma-ketliklar](../17-Sequences/README.md)** — `list`, `tuple`, `dict`

---

⬅️ [15-modul](../15-Conditional-Statements/README.md) · 🏠 [Bosh sahifa](../README.md)
