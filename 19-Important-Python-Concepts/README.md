# 19-Modul · Bir necha muhim Python tushunchasi va atamasi

## 🐍 Bir jumlada

> **18-modulgacha siz KOD YOZDINGIZ. 19-modulda esa dasturchilar TILIDA GAPIRISHNI o'rganasiz.**

Bu — Python bo'limining **yakuniy** moduli. U **kod emas, TUSHUNCHALARNI** beradi — lekin aynan shular sizni **havaskordan mutaxassisga** aylantiradi.

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [OOP ga kirish](01-Introduction-to-OOP.md) ⭐ | Sinf · obyekt · atribut · metod |
| 2 | [Modullar va paketlar](02-Modules-Packages-Standard-Library.md) ⭐ | Modul · paket · standart kutubxona |
| 3 | [Modullarni import qilish](03-Importing-Modules.md) ⭐ | **4 usul** · `import *` xavfi |
| 4 | [Dasturiy ta'minot hujjatlari](04-What-is-Software-Documentation.md) | Hujjat vs Stack Overflow |
| 5 | [Python hujjatlari](05-The-Python-Documentation.md) ⭐ | `docs.python.org` · Jupyter `Shift+Tab` |

---

## 📝 Mashqlar va loyihalar

| Fayl | Nima bor |
|---|---|
| **[MASHQLAR.md](MASHQLAR.md)** | **52 ta mashq** — shu jumladan **butun Python bo'limini takrorlash** bo'limi |
| **[LOYIHALAR.md](LOYIHALAR.md)** | **6 ta mini-loyiha** — Python bo'limining **yakuniy loyihalari** |

> 📌 **Diqqat:** bu modulda kursning **rasmiy mashqlari yo'q** — u nazariy. Barcha mashqlar ushbu darslikka **maxsus** tayyorlangan.

### Mashqlar tarkibi

| Bo'lim | Mavzu | Soni |
|---|---|---|
| A | OOP: obyekt, sinf, metod | 12 |
| B | Modullar va paketlar | 10 |
| C | Import qilish | 12 |
| D | Hujjatlar bilan ishlash | 10 |
| E | **Butun Python bo'limi — takrorlash** | 8 |
| **JAMI** | | **52** |

### Mini-loyihalar

| № | Loyiha | Qaysi modullar | Qiyinlik |
|---|---|---|---|
| 1 | Geometriya kutubxonasi | `math` | 🟢 |
| 2 | Statistika — o'zim yozaman | `math`, `statistics` | 🟡 |
| 3 | Parol generator | `random`, `string` | 🟡 |
| 4 | Matn tahlili | `string`, `statistics` | 🟡 |
| 5 | Sonlar nazariyasi | `math` | 🔴 |
| 6 | Zar simulyatori | `random` | 🔴 |
| 🏆 | **Python bo'limining CHO'QQISI** (10 g'oya + shablon) | — | — |

---

## 🎯 Modul yakunida siz bilasiz

**OOP:**
- [ ] Python'da **har bir qiymat obyekt** ekanini bilasiz
- [ ] **Sinf**, **obyekt**, **atribut**, **metod** farqini aytasiz
- [ ] Archibald amaki metaforasini tushuntirasiz
- [ ] **Funksiya** va **metod** farqini bilasiz
- [ ] Nima uchun metod **nuqta** bilan yozilishini bilasiz
- [ ] Sinonimlarni bilasiz: obyekt≡namuna, atribut≡xossa

**Modullar:**
- [ ] **Modul**, **paket**, **standart kutubxona** farqini bilasiz
- [ ] Paket ≡ **kutubxona** ekanini bilasiz
- [ ] `len()`, `list` qayerdan kelishini bilasiz
- [ ] pandas tarixini bilasiz (Wes McKinney, 2008)
- [ ] Python **ochiq kodli** ekanini bilasiz

**Import:**
- [ ] **4 ta** import usulini bilasiz
- [ ] `import math` — eng **xavfsiz** ekanini bilasiz
- [ ] `as` bilan qayta nomlaysiz
- [ ] `from ... import *` **xavfini** tushuntirasiz
- [ ] Standart qisqartmalarni bilasiz (`pd`, `np`, `plt`)
- [ ] `help()` bilan ma'lumot olasiz

**Hujjatlar:**
- [ ] Hujjatlar **nima uchun qiyin** ekanini bilasiz
- [ ] Ziddiyat bo'lsa **hujjat ustunligini** bilasiz
- [ ] Metodni **`sinf.metod`** shaklida qidirasiz
- [ ] **Barqaror** versiyani tanlaysiz
- [ ] Jupyter'da **`Tab`** va **`Shift+Tab`** ni ishlatasiz

**Amaliyot:**
- [ ] 📝 **52 ta mashqning** kamida 40 tasini yechdingiz
- [ ] 🚀 **6 ta mini-loyihani** ishga tushirdingiz
- [ ] 🏆 **Python bo'limining cho'qqi loyihasini** yozdingiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-oop-concepts.svg`](assets/01-oop-concepts.svg) | Sinf → obyekt → atribut → metod + funksiya/metod farqi |
| [`02-modules-packages.svg`](assets/02-modules-packages.svg) | Modul / paket / standart kutubxona + pandas tarixi |
| [`03-import-ways.svg`](assets/03-import-ways.svg) | 4 ta import usuli + `import *` xavfi |

---

## ⚠️ Modulning 7 ta eng katta tuzog'i

| № | Tuzoq | Misol | To'g'ri |
|---|---|---|---|
| 1 | **Importsiz ishlatish** | `sqrt(16)` → `NameError` | `import math` |
| 2 | **Nuqtani unutish** | `import math; sqrt(16)` | `math.sqrt(16)` |
| 3 | **`from` bilan nuqta** | `from math import sqrt; math.sqrt(16)` | `sqrt(16)` |
| 4 | **`import *`** | Nom to'qnashuvi | `import math` |
| 5 | **Metodni obyektsiz** | `sort()` → `NameError` | `r.sort()` |
| 6 | **Boshqa sinf metodi** | `"abc".append()` | `list` metodi |
| 7 | **Metodni noto'g'ri qidirish** | `extend` | `list.extend` |

---

## 🧠 Eng muhim jadval

```
🚲 ARCHIBALD AMAKI METAFORASI

┌──────────────┬────────────────────┬──────────────────────┐
│              │  METAFORA          │  PYTHON              │
├──────────────┼────────────────────┼──────────────────────┤
│ SINF         │ velosiped ustasi   │ list                 │
│ OBYEKT       │ yasalgan velosiped │ [1.0, 2.0, 3.0]      │
│ ATRIBUT      │ rangi, o'lchami    │ ma'lumot turi        │
│ METOD        │ chapga burilish    │ .extend()  .index()  │
└──────────────┴────────────────────┴──────────────────────┘

⚠️ Velosiped bo'lmasa — chapga burilib bo'lmaydi.
   Obyekt bo'lmasa — metod ishlamaydi.


FUNKSIYA  vs  METOD

len(my_list)              ← FUNKSIYA: obyekt QAVS ICHIDA
my_list.extend([4])       ← METOD:    obyekt NUQTADAN OLDIN
                             sinfga TEGISHLI


IMPORT — 4 USUL

1. import math                  math.sqrt(16)   ✅ ENG XAVFSIZ
2. from math import sqrt        sqrt(25)        ✅ 1-2 funksiya
3. import math as m             m.sqrt(49)      ✅ EKSPERTLAR
4. from math import *           sqrt(64)        ❌ QOCHING
```

---

## 🔗 Bog'liqlik

```
16-modul  ─  funksiya  ·  ichki funksiyalar
17-modul  ─  metodlar bilan tanishuv (.append, .sort)
    ↓
19-modul  ─  MUHIM TUSHUNCHALAR                 ← siz shu yerdasiz
    ↓          OOP · modullar · import · hujjatlar
    ↓
20-modul  ─  NLP ga kirish
    ↓          import nltk · spacy · sklearn
    ↓
29-modul  ─  LLM
    ↓          import openai · transformers
    ↓
35-modul  ─  LangChain
               import langchain

💡 Bundan buyon HAR BIR modul `import` bilan boshlanadi.
   Bu darsda o'rgangan narsangiz — KUNDALIK vosita.
```

---

## 🎓 Python bo'limi yakunlandi!

```
10-modul  ─  Nima uchun Python
11-modul  ─  Muhitni sozlash
12-modul  ─  O'zgaruvchilar va turlar
13-modul  ─  Asosiy sintaksis
14-modul  ─  Operatorlar
15-modul  ─  Shartlar
16-modul  ─  Funksiyalar
17-modul  ─  Ketma-ketliklar
18-modul  ─  Iteratsiya
19-modul  ─  Muhim tushunchalar       ← TUGADI ✅
```

### Sizda endi bor:

| Vosita | Nima beradi |
|---|---|
| **O'zgaruvchi** | Ma'lumotni saqlash |
| **Shart** | Qaror qabul qilish |
| **Funksiya** | Kodni qayta ishlatish |
| **Ketma-ketlik** | Ma'lumotni tashkil qilish |
| **Sikl** | Takrorlash |
| **Modul** | Boshqalarning ishidan foydalanish |

> ## 🎉 **Bu oltilik bilan ISTALGAN dasturni yozish mumkin.**

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| OOP | *object-oriented programming* | Obyektga yo'naltirilgan dasturlash |
| Obyekt | *object* | Ma'lumot + amallar |
| Namuna | *instance* | Obyektning sinonimi |
| Sinf | *class* | Obyekt yaratish qoidalari |
| Atribut | *attribute* | Obyekt holatiga oid xususiyat |
| Xossa | *property* | Atributning sinonimi |
| Metod | *method* | Sinfga tegishli maxsus funksiya |
| Nuqta operatori | *dot operator* | `.` |
| Modul | *module* | Oldindan yozilgan kod fayli |
| Paket | *package* | Modullar to'plami |
| Kutubxona | *library* | Paketning sinonimi |
| Standart kutubxona | *standard library* | Python bilan keladigan modullar |
| Import | *import* | Modulni dasturga yuklash |
| Taxallus | *alias* | Qisqartirilgan nom (`as`) |
| Nom to'qnashuvi | *name collision* | Ikki funksiya bir xil nomda |
| Ochiq kodli | *open source* | Kodi ochiq va bepul |
| Hujjatlar | *documentation* | Vosita haqidagi rasmiy ma'lumot |
| Imzo | *signature* | Funksiyaning parametrlari ta'rifi |
| Barqaror versiya | *stable version* | To'liq sinalgan versiya |
| FAQ | *frequently asked questions* | Tez-tez so'raladigan savollar |
| Tab to'ldirish | *tab completion* | Tab bilan nomni to'ldirish |
| `dir()` | *dir* | Obyekt atributlarini ko'rsatadi |
| `help()` | *help* | Hujjatni ko'rsatadi |

---

## ✅ Yakuniy tekshiruv

```
☐ 1. MASHQLAR.md dagi 52 ta mashqdan kamida 40 tasini yechdim
☐ 2. LOYIHALAR.md dagi 6 ta loyihani ishga tushirdim
☐ 3. Har bir loyihaning "O'zgartirish" vazifalarini bajardim
☐ 4. Python bo'limining CHO'QQI loyihasini yozdim
☐ 5. Sinf / obyekt / atribut / metod farqini tushuntira olaman
☐ 6. 4 ta import usulini bilaman
☐ 7. `from ... import *` nima uchun xavfli ekanini bilaman
☐ 8. Jupyter'da Shift+Tab ni ishlataman
☐ 9. Metodni `sinf.metod` shaklida qidiraman
```

Hammasi ✅ bo'lsa — **20-modulga (NLP) tayyorsiz**.

---

## ➡️ Keyingi qadam

**[20-modul: NLP ga kirish](../20-NLP-Introduction/README.md)** — tabiiy tilni qayta ishlash

> Endi Python **vosita**, maqsad emas. Undan **AI qurish** uchun foydalanasiz.

---

⬅️ [18-modul](../18-Iteration/README.md) · 🏠 [Bosh sahifa](../README.md)
