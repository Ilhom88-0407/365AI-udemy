# 13-Modul · Python ning asosiy sintaksisi

## 🐍 Bir jumlada

> **12-modulda siz o'zgaruvchi YARATDINGIZ. 13-modulda ular bilan ISHLAYSIZ.**

Bu modul — **Python tilining grammatikasi**: qanday hisoblash, qanday tekshirish, qanday izohlash va — eng muhimi — **qanday chekintirish**.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [Arifmetik operatorlar](01-Arithmetic-Operators.md) ⭐ | `+ - * / // % **` · Python 3 da `/` doim **float** |
| 2 | [Ikkilangan tenglik belgisi](02-The-Double-Equality-Sign.md) ⭐ | `=` **biriktiradi**, `==` **tekshiradi** |
| 3 | [Qiymatlarni qayta biriktirish](03-Reassign-Values.md) | **Oxirgi buyruq** g'olib |
| 4 | [Izohlar qo'shish](04-Add-Comments.md) | `#` · kod **NIMA**, izoh **NIMA UCHUN** |
| 5 | [Qator davomi](05-Line-Continuation.md) | `\` · qavslar — xavfsizroq muqobil |
| 6 | [Elementlarni indekslash](06-Indexing-Elements.md) ⭐ | `[n]` · sanash **0 dan** · manfiy indekslar |
| 7 | [Chekinish](07-Indentation.md) ⭐ | Bo'sh joy — **bezak emas, MA'NO** |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **62 ta mashq** — kursning rasmiy topshiriqlari + qo'shimchalar, yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — to'liq ishlaydigan dasturlar + "o'zgartirish" vazifalari |

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | Arifmetik operatorlar | 14 |
| B | `==` va qayta biriktirish | 12 |
| C | Izohlar va qator davomi | 10 |
| D | Indekslash | 12 |
| E | Chekinish | 8 |
| F | Xatolarni toping | 6 |
| **JAMI** | | **62** |

### Mini-loyihalar

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | Kalkulyator | Barcha 7 ta operator | 🟢 |
| 2 | Chegirma hisoblagichi | Foiz + `==` tekshiruv | 🟢 |
| 3 | Vaqt konvertori | `//` va `%` birgalikda | 🟡 |
| 4 | Parol tekshiruvchi | `==`, `len()`, indeks | 🟡 |
| 5 | Matn tahlilchisi | Musbat va manfiy indekslar | 🟡 |
| 6 | Geometriya hisoblagichi | `**` va formulalar | 🔴 |
| 🏆 | O'z dasturingiz (6 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**Arifmetika:**
- [ ] 7 ta operatorni (`+ - * / // % **`) yoddan aytasiz
- [ ] `/` va `//` farqini tushuntirasiz
- [ ] `%` ni **qoldiq** uchun ishlatasiz
- [ ] Python 3 da `10 / 2` **`5.0`** (int emas) ekanini bilasiz
- [ ] `**` **o'ngdan** hisoblanishini bilasiz (`2**2**3` = `256`)

**Tekshirish:**
- [ ] `=` va `==` ni **hech qachon** adashtirmaysiz
- [ ] `==` natijasi `True`/`False` ekanini bilasiz
- [ ] `0.1 + 0.2 == 0.3` → **`False`** ekanini tushuntirasiz
- [ ] Qayta biriktirishda **oxirgi buyruq g'olib** ekanini bilasiz

**Kod uslubi:**
- [ ] `#` bilan izoh yozasiz
- [ ] Kodni **vaqtincha o'chirasiz** (`Ctrl + /`)
- [ ] `\` bilan uzun qatorni bo'lasiz
- [ ] Qavslar `\` dan **xavfsizroq** ekanini bilasiz

**Indekslash:**
- [ ] `satr[n]` sintaksisini ishlatasiz
- [ ] Sanash **0 dan** boshlanishini **hech qachon** unutmaysiz
- [ ] `[-1]` — oxirgi belgi ekanini bilasiz
- [ ] `n` ta belgida oxirgi indeks **`n-1`** ekanini bilasiz

**Chekinish:**
- [ ] Kod blokini chekinish bilan hosil qilasiz
- [ ] **4 ta bo'sh joy** standart ekanini bilasiz
- [ ] `IndentationError` sababini topasiz
- [ ] `return` dan keyingi kod bajarilmasligini bilasiz

**Amaliyot:**
- [ ] 📝 **62 ta mashqning** kamida 47 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z dasturingizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-arithmetic-operators.svg`](assets/01-arithmetic-operators.svg) | 7 ta operator + `/` vs `//` ogohlantirishi |
| [`02-double-equality.svg`](assets/02-double-equality.svg) | `=` va `==` yonma-yon |
| [`06-indexing.svg`](assets/06-indexing.svg) | `"Friday"` — musbat va manfiy indekslar |
| [`07-indentation.svg`](assets/07-indentation.svg) | ❌ noto'g'ri vs ✅ to'g'ri chekinish |

---

## ⚠️ Modulning 6 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **`=` va `==` ni adashtirish** | `if x = 5` → `SyntaxError` | `if x == 5` |
| 2 | **Indeksni 1 dan sanash** | `"Friday"[1]` → `'r'` | `"Friday"[0]` → `'F'` |
| 3 | **Chegaradan chiqish** | `"Salom"[5]` → `IndexError` | `"Salom"[4]` yoki `[-1]` |
| 4 | **Chekinishni unutish** | `IndentationError` | 4 ta bo'sh joy |
| 5 | **`\` dan keyin bo'sh joy** | `SyntaxError` | `\` — **eng oxirgi** belgi |
| 6 | **Kasr sonlarni `==` bilan** | `0.1+0.2 == 0.3` → `False` | Farqni tekshiring |

---

## 🔗 Bog'liqlik

```
11-modul  ─  Jupyter · xato xabarlari
12-modul  ─  o'zgaruvchilar · int · float · bool · str
    ↓
13-modul  ─  ASOSIY SINTAKSIS                   ← siz shu yerdasiz
    ↓          + - * / // % **   ·   ==
    ↓          #  ·  \  ·  [ ]  ·  chekinish
    ↓
14-modul  ─  Operatorlar haqida ko'proq (<, >, !=, and, or, not)
15-modul  ─  Shartlar (if / elif / else)     ← CHEKINISH shu yerda kerak
16-modul  ─  Funksiyalar                     ← def va return to'liq
17-modul  ─  Ketma-ketliklar                 ← INDEKSLASH to'liq
18-modul  ─  Iteratsiya (for / while)
```

> 💡 **Diqqat qiling:** bu modulda `def`, `return` va `[ ]` bilan **tanishdingiz**, lekin ular to'liq **16 va 17-modullarda** ochiladi. Hozircha faqat **sintaksisni** o'zlashtiring.

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Operator | *operator* | Amal belgisi (`+`, `-`, `*`, ...) |
| Butun bo'lish | *floor division* | `//` — kasr qismini tashlaydi |
| Qoldiq | *modulo / remainder* | `%` — bo'lishdan qolgan |
| Daraja | *exponentiation* | `**` |
| Biriktirish | *assignment* | `=` — qiymat berish |
| Solishtirish | *comparison* | `==` — tenglikni tekshirish |
| Mantiqiy qiymat | *boolean* | `True` / `False` |
| Qayta biriktirish | *reassignment* | O'zgaruvchiga yangi qiymat berish |
| Izoh | *comment* | `#` — bajarilmaydigan matn |
| Kodni o'chirish | *commenting out* | Kodni vaqtincha izohga aylantirish |
| Qator davomi | *line continuation* | `\` — buyruqni davom ettirish |
| Teskari chiziq | *backslash* | `\` |
| Indekslash | *indexing* | `[n]` — pozitsiya bo'yicha element |
| Manfiy indeks | *negative index* | `[-1]` — oxiridan sanash |
| Chekinish | *indentation* | Qator boshidagi bo'sh joy |
| Kod bloki | *block of code* | Bir guruh buyruqlar |
| O'lik kod | *dead code* | Hech qachon bajarilmaydigan kod |
| PEP 8 | *PEP 8* | Python kod uslubi standarti |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 62 ta mashqdan kamida 47 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z dasturimni yozdim (10+ o'zgaruvchi, 5+ operator, 1+ indeks)
☐ 5. Yuqoridagi 6 ta tuzoqni yoddan aytaman
☐ 6. Barcha kodni Jupyter'da Restart & Run All bilan tekshirdim
```

Hammasi ✅ bo'lsa — **14-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**14-modul: Operatorlar haqida ko'proq** — `<`, `>`, `!=`, `and`, `or`, `not`

---

⬅️ [12-modul](../12-Python-Variables-and-Data-Types/README.md) · 🏠 [Bosh sahifa](../README.md)
