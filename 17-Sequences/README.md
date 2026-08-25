# 17-Modul · Ketma-ketliklar

## 🐍 Bir jumlada

> **"Ro'yxatlarni tushunish sizning MA'LUMOTNI TASHKIL QILISH qobiliyatingiz bilan bog'liq — bugungi mehnat bozorida HAL QILUVCHI ko'nikma."**

Shu paytgacha bitta o'zgaruvchi — **bitta qiymat**. Endi u **yuzlab** qiymatni saqlaydi.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [Ro'yxatlar](01-Lists.md) ⭐ | `[ ]` · indekslash · `del` · indekslar **suriladi** |
| 2 | [Metodlar](02-Using-Methods.md) ⭐ | Nuqta operatori · `append` vs `extend` |
| 3 | [Kesish (slicing)](03-List-Slicing.md) ⭐ | `[a:b]` · `sort` vs `sorted` |
| 4 | [Tuple lar](04-Tuples.md) | `( )` · **o'zgarmas** · bir necha qiymat qaytarish |
| 5 | [Lug'atlar](05-Dictionaries.md) ⭐ | `{ }` · kalit-qiymat · `.get()` |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **72 ta mashq** — kursning rasmiy topshiriqlari + qo'shimchalar, yechimlari bilan |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — ma'lumot tizimlari |

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | Ro'yxatlar | 12 |
| B | Metodlar | 12 |
| C | Kesish (slicing) | 14 |
| D | Tuple lar | 12 |
| E | Lug'atlar | 14 |
| F | Xatolarni toping | 8 |
| **JAMI** | | **72** |

### Mini-loyihalar

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | Talabalar ballari | Parallel ro'yxatlar + `index` | 🟢 |
| 2 | Xaridlar savati | `dict` + `tuple` qiymat | 🟡 |
| 3 | Kontaktlar kitobi | Ichma-ich lug'at | 🟡 |
| 4 | Matn tahlilchisi | `split` + kesish | 🟡 |
| 5 | Dars jadvali | Lug'at + ro'yxat qiymat | 🔴 |
| 6 | Ombor inventari | To'liq hisobot tizimi | 🔴 |
| 🏆 | O'z ma'lumot tizimingiz (7 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**Ro'yxatlar:**
- [ ] `[ ]` bilan ro'yxat yaratasiz
- [ ] Musbat va **manfiy** indeks bilan element olasiz
- [ ] Elementni **almashtirasiz** va `del` bilan **o'chirasiz**
- [ ] O'chirishda **indekslar surilishini** bilasiz
- [ ] Ro'yxat **o'zgaruvchan**, satr — **o'zgarmas** ekanini bilasiz

**Metodlar:**
- [ ] **Nuqta operatori** sintaksisini bilasiz
- [ ] `append` va `extend` **farqini** aytasiz
- [ ] `insert`, `remove`, `pop`, `index`, `sort`, `count` ni ishlatasiz
- [ ] **Funksiya** va **metod** ni sintaksis bo'yicha farqlaysiz

**Kesish:**
- [ ] `[a:b]` da **`b` kirmasligini** bilasiz
- [ ] `[:b]`, `[a:]`, `[-n:]`, `[:]` shakllarini ishlatasiz
- [ ] `P[1]` va `P[1:2]` **farqini** bilasiz
- [ ] `sort()` **`None`** qaytarishini bilasiz
- [ ] Kesish **`IndexError` bermasligini** bilasiz

**Tuple:**
- [ ] `( )` va **o'zgarmasligini** bilasiz
- [ ] Tuple — Python'ning **standart turi** ekanini bilasiz
- [ ] **Tuple biriktirish** bilan qiymatlarni almashtirasiz
- [ ] Funksiyadan **bir necha qiymat** qaytarasiz
- [ ] `(5,)` da **vergul shartligini** bilasiz

**Lug'at:**
- [ ] `{ }` va **kalit-qiymat** juftligini bilasiz
- [ ] Kalit bilan **qo'shasiz** va **almashtirasiz**
- [ ] Qiymat sifatida **ro'yxat/lug'at** ishlatasiz
- [ ] `.get()` **xatosiz** ekanini bilasiz
- [ ] `KeyError` sababini topasiz

**Amaliyot:**
- [ ] 📝 **72 ta mashqning** kamida 55 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **O'z ma'lumot tizimingizni** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-list-anatomy.svg`](assets/01-list-anatomy.svg) | Ro'yxat + musbat/manfiy indekslar + qavslar ogohlantirishi |
| [`02-function-vs-method.svg`](assets/02-function-vs-method.svg) | `len(P)` vs `P.append()` + `append`/`extend` |
| [`03-slicing.svg`](assets/03-slicing.svg) | Barcha kesish shakllari + "oxirgi kirmaydi" qoidasi |
| [`04-three-sequences.svg`](assets/04-three-sequences.svg) | `list` / `tuple` / `dict` yonma-yon |
| [`05-dictionary.svg`](assets/05-dictionary.svg) | Kalit-qiymat + `KeyError` vs `.get()` |

---

## ⚠️ Modulning 9 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **O'chirishdan keyin indeks** | `del r[1]` ikki marta | Indekslarni **qayta** tekshiring |
| 2 | **`append` ro'yxat bilan** | `[1,2,[3,4]]` | `extend([3,4])` |
| 3 | **`extend` satr bilan** | `['a','b','c']` | `append("abc")` |
| 4 | **Kesishda `b` kiradi deb o'ylash** | `[1:3]` → 2 ta | `b` **kirmaydi** |
| 5 | **`sort()` natijasini saqlash** | `x = r.sort()` → `None` | `x = sorted(r)` |
| 6 | **Tuple'ni o'zgartirish** | `TypeError` | `list` ishlating |
| 7 | **`(5)` tuple deb o'ylash** | `int` | `(5,)` |
| 8 | **Lug'atda `[ ]`** | `KeyError` | `.get()` |
| 9 | **Nusxa o'rniga havola** | `b = a` → ikkalasi o'zgaradi | `b = a[:]` |

---

## 🧠 Eng muhim jadval

```
UCHTA KETMA-KETLIK

┌──────────┬──────────┬──────────┬──────────┐
│          │  list    │  tuple   │  dict    │
├──────────┼──────────┼──────────┼──────────┤
│ Qavslar  │   [ ]    │   ( )    │   { }    │
│ O'zgarad.│   HA     │  YO'Q    │   HA     │
│ Murojaat │ indeks   │ indeks   │  KALIT   │
│ Kesish   │   HA     │   HA     │  YO'Q    │
│ Tezlik   │ sekinroq │  TEZROQ  │   tez    │
└──────────┴──────────┴──────────┴──────────┘

QACHON NIMA ISHLATILADI

list   →  ma'lumot O'ZGARADI          [15, 40, 50]
tuple  →  ma'lumot O'ZGARMAYDI        (kenglik, balandlik)
dict   →  NOM bilan izlash            {'Tesla': 242.8}


KESISH — "OXIRGI KIRMAYDI"

P = ['a','b','c','d','e']
     0   1   2   3   4

P[1:3]  →  ['b','c']       1 dan, 3 GACHA
P[:2]   →  ['a','b']       boshidan
P[3:]   →  ['d','e']       oxirigacha
P[-2:]  →  ['d','e']       oxirgi 2 ta
P[:]    →  NUSXA

🔑 P[:3] + P[3:]  =  butun ro'yxat
```

---

## 🔗 Bog'liqlik

```
13-modul  ─  indekslash  "Friday"[3]
16-modul  ─  len(), max(), min(), sum()  ·  metodlar bilan tanishuv
    ↓
17-modul  ─  KETMA-KETLIKLAR                   ← siz shu yerdasiz
    ↓          list [ ]  ·  tuple ( )  ·  dict { }
    ↓          kesish  ·  metodlar
    ↓
18-modul  ─  Iteratsiya (for / while)   ← RO'YXAT bo'ylab aylanish
19-modul  ─  Muhim tushunchalar
    ↓
20+       ─  NLP, LLM, LangChain...     ← hamma joyda list va dict!
```

> ## 💡 **Bu modul — butun kursning eng ko'p ishlatiladigan qismi.**
> NLP'da matn — **so'zlar ro'yxati**. LLM'da xabar — **lug'at**. Vector DB'da — **vektorlar ro'yxati**. Hamma joyda.

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Ketma-ketlik | *sequence* | Tartiblangan ma'lumotlar to'plami |
| Ro'yxat | *list* | `[ ]` — o'zgaruvchan |
| Tuple | *tuple* | `( )` — o'zgarmas |
| Lug'at | *dictionary* | `{ }` — kalit-qiymat |
| Element | *element / item* | Ketma-ketlikning a'zosi |
| Indekslash | *indexing* | Pozitsiya bo'yicha murojaat |
| Kesish | *slicing* | Bo'lak olish `[a:b]` |
| Metod | *method* | Obyektga nuqta orqali qo'llanadigan funksiya |
| Nuqta operatori | *dot operator* | `.` |
| O'zgaruvchan | *mutable* | O'zgartirish mumkin |
| O'zgarmas | *immutable* | O'zgartirib bo'lmaydi |
| Kalit | *key* | Lug'atda qiymatni topish nomi |
| Qiymat | *value* | Kalitga biriktirilgan ma'lumot |
| Tuple biriktirish | *tuple assignment* | `a, b = 1, 2` |
| CSV | *comma separated values* | Vergul bilan ajratilgan qiymatlar |
| Ichma-ich | *nested* | Tuzilma ichidagi tuzilma |
| `IndexError` | *IndexError* | Chegaradan chiqish |
| `KeyError` | *KeyError* | Kalit topilmadi |
| `ValueError` | *ValueError* | Qiymat topilmadi |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 72 ta mashqdan kamida 55 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. O'z ma'lumot tizimimni yozdim (list + tuple + dict)
☐ 5. list / tuple / dict qachon ishlatilishini bilaman
☐ 6. append va extend farqini tushuntira olaman
☐ 7. Kesishda "oxirgi kirmaydi" qoidasini bilaman
☐ 8. Yuqoridagi 9 ta tuzoqni bilaman
```

Hammasi ✅ bo'lsa — **18-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**18-modul: Iteratsiya** — `for`, `while`, `range()`

> Endi ro'yxat bo'ylab **avtomatik** aylanasiz — qo'lda indeks yozish tugaydi.

---

⬅️ [16-modul](../16-Functions/README.md) · 🏠 [Bosh sahifa](../README.md)
