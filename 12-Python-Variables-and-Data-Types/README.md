# 12-Modul · Python o'zgaruvchilari va ma'lumot turlari

## 🐍 Bir jumlada

> **Bu — kursning birinchi HAQIQIY kod moduli.**

Bu yerdan boshlab siz **o'qimaysiz — yozasiz**.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [Python o'zgaruvchilari](01-Python-Variables.md) ⭐ | `=` — tenglik emas, **biriktirish** · case sensitive |
| 2 | [Kodlash mashqlari haqida](02-Python-Coding-Exercises.md) | "Ishladi" ≠ "**to'g'ri**" |
| 3 | [Sonlar va Boolean](03-Numbers-and-Boolean-Values.md) ⭐ | `int` · `float` · `bool` · `type()` |
| 4 | [Satrlar](04-Strings.md) ⭐ | Qo'shtirnoq · escape · **4 xil birlashtirish** |
| 5 | [Anaconda AI — kirish](05-Anaconda-AI-Introduction.md) | Python uchun AI yordamchi |
| 6 | [Assistant bilan ishlash](06-Using-the-Anaconda-Assistant.md) | Debug qilish amalda |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **60 ta mashq** — kursning rasmiy topshiriqlari + qo'shimchalar, yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — to'liq ishlaydigan dasturlar + "o'zgartirish" vazifalari |

### Mashqlar tarkibi

| Bo'lim | Soni | Manba |
|---|---|---|
| A · O'zgaruvchilar | 12 | 6 rasmiy + 6 qo'shimcha |
| B · Sonlar va Boolean | 15 | 7 rasmiy + 8 qo'shimcha |
| C · Satrlar | 15 | 7 rasmiy + 8 qo'shimcha |
| D · Aralash sinov | 10 | Yangi |
| E · Xatolarni toping | 8 | Yangi |
| **JAMI** | **60** | |

### Mini-loyihalar

| № | Loyiha | Qiyinlik |
|---|---|---|
| 1 | Vizitka | 🟢 |
| 2 | Do'kon cheki (QQS bilan) | 🟢 |
| 3 | Harorat konvertori | 🟢 |
| 4 | BMI kalkulyator | 🟡 |
| 5 | Sayohat budjeti | 🟡 |
| 6 | Ism formatlovchi | 🔴 |
| 🏆 | O'z loyihangiz (6 g'oya + shablon) | — |

---

## 🎯 Modul yakunida siz bilasiz

**O'zgaruvchilar:**
- [ ] `=` **biriktirish** ekanini, tenglik emasligini bilasiz
- [ ] Kodni **bajarish** kerakligini (`Shift+Enter`) bilasiz
- [ ] Python **case sensitive** ekanini isbotlaysiz
- [ ] `x` va `print(x)` farqini aytasiz
- [ ] Bir qatorda **ko'p o'zgaruvchi** yaratasiz

**Turlar:**
- [ ] `int`, `float`, `bool`, `str` ni farqlaysiz
- [ ] `type()` bilan turni tekshirasiz
- [ ] `int()` **yaxlitlamasligini** bilasiz (`int(0.99)` → `0`)
- [ ] `True`/`False` **bosh harf** bilan yozilishini bilasiz
- [ ] Python turni **o'zi aniqlashini** bilasiz

**Satrlar:**
- [ ] Qo'shtirnoqsiz satr **`NameError`** berishini bilasiz
- [ ] Turlarni aralashtirish **`TypeError`** berishini bilasiz
- [ ] `str()` bilan turni o'zgartirasiz
- [ ] **Apostrof muammosini** ikki yo'l bilan hal qilasiz
- [ ] **Escape belgisi** `\` nima qilishini bilasiz
- [ ] Satrlarni **4 xil usulda** birlashtirasiz

**Amaliyot:**
- [ ] 📝 **60 ta mashqning** kamida 45 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z loyihangizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-variables.svg`](assets/01-variables.svg) | Biriktirish · case sensitivity · ko'p qiymat |
| [`03-data-types.svg`](assets/03-data-types.svg) | 4 ta tur + turni o'zgartirish |
| [`04-strings.svg`](assets/04-strings.svg) | Qo'shtirnoq · escape · 4 xil birlashtirish |

---

## ⚠️ Modulning 5 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **Case sensitivity** | `Ism` ≠ `ism` | Bir xil yozing |
| 2 | **`int()` yaxlitlamaydi** | `int(0.99)` → `0` | `round(0.99)` → `1` |
| 3 | **`true` kichik harf** | `NameError` | `True` |
| 4 | **Turlarni aralashtirish** | `10 + "so'm"` → `TypeError` | `str(10) + " so'm"` |
| 5 | **Apostrof satrni yopadi** | `'It's'` → `SyntaxError` | `"It's"` |

---

## 🔗 Bog'liqlik

```
10-modul  ─  nima uchun Python · kod uslubi
11-modul  ─  Jupyter · xato xabarlari
    ↓
12-modul  ─  O'ZGARUVCHILAR VA TURLAR          ← siz shu yerdasiz
    ↓          int · float · bool · str
    ↓
13-modul  ─  Asosiy sintaksis
14-modul  ─  Operatorlar (+, -, *, /, //, %)
15-modul  ─  Shartlar (if / elif / else)
...
```

> 💡 **Diqqat qiling:** MASHQLAR.md ning D7 mashqida `//` va `%` belgilarini ko'rdingiz. Ular **14-modulda** to'liq tushuntiriladi. Hozircha shunchaki ishlatib ko'ring.

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| O'zgaruvchi | *variable* | Ma'lumot saqlaydigan nom |
| Biriktirish | *assign / bind* | Qiymat berish |
| Bajarish | *execute* | Kodni ishga tushirish |
| Case sensitive | *case sensitive* | Katta-kichik harfni farqlaydi |
| Butun son | *integer (int)* | Kasr nuqtasiz son |
| Haqiqiy son | *float* | Kasr nuqtali son |
| Mantiqiy qiymat | *boolean (bool)* | `True` yoki `False` |
| Satr | *string (str)* | Matn qiymati |
| Ichki funksiya | *built-in function* | `type()`, `str()`, `int()`, `float()`, `round()` |
| Turni o'zgartirish | *type conversion* | Bir turdan boshqasiga |
| Qisqartirish | *truncation* | Kasr qismini tashlash |
| Yaxlitlash | *rounding* | Eng yaqin butunga keltirish |
| Escape belgisi | *escape character* | `\` — keyingi belgi ma'nosini o'zgartiradi |
| Birlashtirish | *concatenation* | Satrlarni qo'shish |
| Trailing comma | *trailing comma* | `print` ichidagi vergul |

---

## ✅ Yakuniy tekshiruv

Modulni tugatganingizni **shu tarzda** isbotlang:

```
☐ 1. MASHQLAR.md dagi 60 ta mashqdan kamida 45 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z loyihamni yozdim (8+ o'zgaruvchi, 3+ tur, 2+ hisob)
☐ 5. Yuqoridagi 5 ta tuzoqni yoddan aytaman
☐ 6. Barcha kodni Jupyter'da Restart & Run All bilan tekshirdim
```

Hammasi ✅ bo'lsa — **13-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**13-modul: Python ning asosiy sintaksisi**
