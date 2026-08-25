# 18-Modul · Iteratsiya

## 🐍 Bir jumlada

> ## **"ITERATSIYA — barcha dasturlarning FUNDAMENTAL QURILISH BLOKI. Bu — ma'lum kodni QAYTA-QAYTA bajarish qobiliyati."**

17-modulda ro'yxatga **qo'lda** murojaat qilardingiz. Endi buni **kompyuter** qiladi — 10 ta element uchun ham, **10 million** uchun ham.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [`for` sikllari](01-For-Loops.md) ⭐ | `for x in ...:` · sikl o'zgaruvchisi · `end=" "` |
| 2 | [`while` sikllari](02-While-Loops.md) ⭐ | Shart · **inkrement** · ⚠️ **cheksiz sikl** |
| 3 | [`range()` funksiyasi](03-The-range-Function.md) ⭐ | `start, stop, step` · `list()` bilan ko'rish |
| 4 | [Shartlar va sikllar](04-Conditionals-and-Loops.md) ⭐ | Sikl ichida `if` · siklning **ikki usuli** |
| 5 | [Shartlar, funksiyalar va sikllar](05-Conditionals-Functions-and-Loops.md) ⭐ | **Yig'uvchi summa** naqshi |
| 6 | [Anaconda Assistant — Python vositalari](06-Anaconda-Assistant-Python-Tools.md) | Prompt yozish · AI cheklovlari |
| 7 | [Lug'atlar bo'ylab iteratsiya](07-Iterating-over-Dictionaries.md) ⭐ | `for i in dict:` → `i` = **kalit** |
| 8 | [Anaconda Assistant — lug'atlar](08-Anaconda-Assistant-Dictionaries.md) | Explain · Comments · Refactor |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **76 ta mashq** — kursning rasmiy topshiriqlari + qo'shimchalar, yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — to'liq ishlaydigan dasturlar |

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | `for` sikllari | 12 |
| B | `while` sikllari | 12 |
| C | `range()` funksiyasi | 12 |
| D | Shartlar va sikllar | 14 |
| E | Funksiya + sikl + shart | 12 |
| F | Lug'atlar bo'ylab iteratsiya | 14 |
| **JAMI** | | **76** |

### Mini-loyihalar

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | Baholar hisoboti | Parallel ro'yxatlar + sanoqchi | 🟢 |
| 2 | Kassa tizimi | Lug'at iteratsiyasi + chegirma | 🟡 |
| 3 | Matn tahlilchisi | `split` + harflar chastotasi | 🟡 |
| 4 | Kredit jadvali | `while` + moliyaviy hisob | 🔴 |
| 5 | Sonlar tahlilchisi | Ichma-ich sikl + tub sonlar | 🔴 |
| 6 | Ombor boshqaruvi | To'liq hisobot tizimi | 🔴 |
| 🏆 | O'z to'liq dasturingiz (8 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**`for`:**
- [ ] `for x in ...:` sintaksisini bilasiz
- [ ] Sikl o'zgaruvchisi nomi **istalgan** ekanini bilasiz
- [ ] Chekinish va ikki nuqta **majburiy** ekanini bilasiz
- [ ] `end=" "` bilan **bir qatorda** chiqarasiz
- [ ] Sikl aylanayotgan ro'yxatni **o'zgartirmaslikni** bilasiz

**`while`:**
- [ ] **Inkrement** nima ekanini bilasiz
- [ ] `x += 2` va `x = x + 2` bir xilligini bilasiz
- [ ] **Cheksiz sikl**ning 3 sababini bilasiz
- [ ] Cheksiz sikldan **chiqishni** bilasiz (⏹ / `Ctrl+C`)
- [ ] `for` va `while` ni **qachon** tanlashni bilasiz

**`range()`:**
- [ ] `start, stop, step` ma'nosini bilasiz
- [ ] `stop` **kirmasligini** bilasiz
- [ ] `stop` — **majburiy**, qolganlari — ixtiyoriy ekanini bilasiz
- [ ] `range` **obyekt**, ro'yxat emasligini bilasiz
- [ ] `list(range(...))` bilan ko'rasiz
- [ ] Teskari sanoqda `step=-1` kerakligini bilasiz

**Birlashtirish:**
- [ ] Sikl ichida `if` yozasiz
- [ ] Siklning **ikki usulini** bilasiz (element / indeks)
- [ ] `for i in range(len(x))` qachon kerakligini bilasiz
- [ ] **Yig'uvchi summa** naqshini qo'llaysiz
- [ ] `return` **sikldan tashqarida** bo'lishini bilasiz

**Lug'atlar:**
- [ ] `for i in dict:` → `i` **kalit** ekanini bilasiz
- [ ] `.keys()`, `.values()`, `.items()` ni ishlatasiz
- [ ] Ikki lug'atni **bir xil kalitlar** orqali bog'laysiz

**AI:**
- [ ] Aniq **prompt** yozasiz
- [ ] AI **o'ziga zid** bo'lishi mumkinligini bilasiz
- [ ] **Tushunmagan kodni qabul qilmaysiz**

**Amaliyot:**
- [ ] 📝 **76 ta mashqning** kamida 58 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z to'liq dasturingizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-for-loop.svg`](assets/01-for-loop.svg) | `for` ning har bir qismi + iteratsiyalar ketma-ketligi |
| [`02-while-loop.svg`](assets/02-while-loop.svg) | To'g'ri vs cheksiz sikl + oqim sxemasi + inkrement |
| [`03-range.svg`](assets/03-range.svg) | `start/stop/step` + muhimlik tartibi + `list()` |
| [`04-rolling-sum.svg`](assets/04-rolling-sum.svg) | Yig'uvchi o'zgaruvchi — qadamma-qadam |
| [`05-dict-iteration.svg`](assets/05-dict-iteration.svg) | Ikki lug'at + `i` = kalit ogohlantirishi |

---

## ⚠️ Modulning 9 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **Cheksiz sikl** | `while` da o'zgarish yo'q | `x += 2` qo'shing |
| 2 | **Chekinish yo'q** | `IndentationError` | 4 ta bo'sh joy |
| 3 | **`stop` kiradi deb o'ylash** | `range(1,10)` → 9 gacha | `range(1,11)` |
| 4 | **`range` ni ro'yxat deb o'ylash** | `range(5).append()` | `list(range(5))` |
| 5 | **Teskari sanoqda `step`** | `range(10,0)` → `[]` | `range(10,0,-1)` |
| 6 | **`for x in r: x = x*2`** | Ro'yxat **o'zgarmaydi** | `r[i] = r[i]*2` |
| 7 | **`return` sikl ichida** | 1-aylanishda tugaydi | Sikldan **tashqariga** |
| 8 | **Lug'atda `i` — qiymat deb o'ylash** | `i` = **kalit** | `d[i]` — qiymat |
| 9 | **Sikl ichida ro'yxatni o'zgartirish** | Element **o'tkazib** yuboriladi | `for x in r[:]` |

---

## 🧠 Eng muhim naqsh

```
YIG'UVCHI O'ZGARUVCHI (rolling sum)
Dasturlashdagi ENG KO'P ISHLATILADIGAN naqsh

┌─────────────────────────────────────────────┐
│  1. NOLDAN (yoki bo'shdan) boshlang         │
│  2. Sikl bilan aylaning                     │
│  3. Shart bajarilsa — O'STIRING             │
│  4. Sikldan KEYIN qaytaring                 │
└─────────────────────────────────────────────┘

SANOQCHI                YIG'INDI              RO'YXAT
total = 0               jami = 0              natija = []
for x in lst:           for x in lst:         for x in lst:
    if shart:               jami += x             if shart:
        total += 1                                    natija.append(x)
return total            return jami           return natija


def count(numbers):
    total = 0                ← 1. NOLDAN
    for x in numbers:        ← 2. SIKL
        if x < 20:           ← 3. SHART
            total += 1       ←    O'STIRISH
    return total             ← 4. QAYTARISH (SIKLDAN TASHQARIDA!)
```

---

## 🔗 Bog'liqlik

```
15-modul  ─  if / elif / else
16-modul  ─  def / return
17-modul  ─  list · tuple · dict
    ↓
18-modul  ─  ITERATSIYA                        ← siz shu yerdasiz
    ↓          for  ·  while  ·  range()
    ↓          yig'uvchi summa
    ↓          lug'at iteratsiyasi
    ↓
19-modul  ─  Muhim tushunchalar (OOP, modullar, hujjatlar)
    ↓
20+       ─  NLP · LLM · LangChain · Vector DB

💡 20-modulda so'z chastotasini hisoblaysiz — bu MODULDAGI
   chastota lug'ati naqshining aynan o'zi!
```

> ## 🎉 **Bu modul bilan siz Python'ning ASOSIY QISMINI tugatdingiz.**
>
> `o'zgaruvchi` + `shart` + `funksiya` + `ketma-ketlik` + `sikl` — bu **beshlik** bilan **istalgan** dasturni yozish mumkin.

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Iteratsiya | *iteration* | Kodni qayta-qayta bajarish |
| Sikl | *loop* | Takrorlanuvchi kod bloki |
| Sikl o'zgaruvchisi | *loop variable* | Har aylanishda yangi qiymat |
| Sikl tanasi | *loop body* | Takrorlanadigan qism |
| Siklning o'tishi | *pass of the loop* | Bitta aylanish |
| `end` parametri | *end parameter* | `print` oxiridagi belgi |
| Cheksiz sikl | *infinite loop* | Tugamaydigan sikl |
| Inkrementlash | *incrementing* | Bosqichma-bosqich oshirish |
| Inkrement | *increment* | Qo'shilayotgan miqdor |
| `+=` | *augmented assignment* | Qisqartirilgan biriktirish |
| `range()` | *range* | Butun sonlar ketma-ketligi |
| Range obyekti | *range object* | Tejamli tuzilma (ro'yxat emas) |
| `start / stop / step` | *start / stop / step* | Boshlanish / tugash / qadam |
| Yig'uvchi summa | *rolling sum* | O'sib boruvchi o'zgaruvchi |
| Sanoqchi | *counter* | Nechta marta sodir bo'lganini sanaydi |
| Akkumulyator | *accumulator* | Natijani to'plovchi o'zgaruvchi |
| Ichma-ich sikl | *nested loop* | Sikl ichidagi sikl |
| Filtrlash | *filtering* | Shart bo'yicha tanlash |
| Chastota lug'ati | *frequency dictionary* | Nechta marta uchraganini saqlaydi |
| List comprehension | *list comprehension* | Siklni bir qatorda yozish (19-modul) |
| Prompt | *prompt* | AI ga beriladigan so'rov |
| Refactoring | *refactoring* | Kodni yaxshilash |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 76 ta mashqdan kamida 58 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z to'liq dasturimni yozdim (2+ funksiya, for+while, 3+ yig'uvchi)
☐ 5. Cheksiz siklning sabablarini bilaman va oldini olaman
☐ 6. Yig'uvchi o'zgaruvchi naqshini yoddan yozaman
☐ 7. Lug'at iteratsiyasida `i` KALIT ekanini bilaman
☐ 8. Yuqoridagi 9 ta tuzoqni bilaman
```

Hammasi ✅ bo'lsa — **19-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**[19-modul: Bir necha muhim Python tushunchasi va atamasi](../19-Important-Python-Concepts/README.md)**

> List comprehension, `lambda`, va boshqa ilg'or vositalar.

---

⬅️ [17-modul](../17-Sequences/README.md) · 🏠 [Bosh sahifa](../README.md)
