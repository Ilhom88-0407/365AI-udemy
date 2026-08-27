# 3-dars. AI chiqishlaridan etik foydalanish ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kursning firibgarlik misolini o'lchadik. Model 68 ta hisobga bayroq qo'ydi — ulardan atigi 19 tasi haqiqiy edi. Avtomatik yopilsa, 49 ta AYBSIZ mijoz yo'qoladi."**

---

## 1. Kursning misollari

> *"AI yollash tizimi juda malakali nomzodni rad etadi, lekin **hech kim
> nega ekanini tushuntira olmaydi**."*

| Kurs keltirgan holat | Oqibat |
|---|---|
| Yollash tizimi — tushuntirilmagan rad | ## 💥 **Adolatsizlik** |
| Moliyaviy AI — katta zarar | 💥 Mijoz yo'qotishi |
| ## **Tesla FSD tekshiruvi** | ## 💥 **2.4 mln avtomobil, 2023-yilda o'limli hodisa** |

> ## 🔑 **KURSNING ASOSIY FIKRI:** ## AI chiqishi — ## ⭐ **javob emas, TAKLIF**.

---

## 2. 🔬 Firibgarlik bayrog'i — **haqiqiy raqamlar**

> *"AI tizimi mijoz hisobini firibgarlik uchun belgilaydi va
> **yopishni tavsiya qiladi**."*

Yaxshi model quramiz: **85% sezgirlik**, **6% yolg'on bayroq**.
Firibgarlik darajasi — **2%** *(realistik)*.

```python
random.seed(17)
HISOBLAR = []
for i in range(1000):
    haqiqiy = random.random() < 0.02              # ⭐ 2% haqiqiy firibgarlik
    bayroq = (random.random() < 0.85) if haqiqiy else (random.random() < 0.06)
    HISOBLAR.append({"id": i, "haqiqiy": haqiqiy, "bayroq": bayroq})
```

### ✅ Haqiqiy natija

```
  jami hisob:          1000
  haqiqiy firibgarlik:   24
  model bayroq qo'ydi:   68
  ulardan HAQIQIY:       19

  ANIQLIK (precision): 27.9%
  -> avtomatik yopilsa: 49 ta AYBSIZ mijoz yo'qotiladi
```

> ## 💥💥💥 **MODEL "85% ANIQ" EDI — ## LEKIN BAYROQLARNING 72% I YOLG'ON.**

### 🔑 Nega? — **asosiy stavka xatosi** *(base rate fallacy)*

| Nima | Son |
|---|---|
| Haqiqiy firibgar | ## **24** |
| Ulardan topilgan *(85%)* | ## ✅ **19** |
| ## **Aybsiz mijoz** | ## **976** |
| Ulardan yolg'on bayroq *(6%)* | ## 💥 **49** |

> ## 💥💥 **976 × 6% = 49 > 24 × 85% = 19.**
>
> ## ## 🔑 Aybsizlar ## ⭐ **shunchalik ko'pki**, ## ularning ## 💥 **kichik foizi ham** ## haqiqiy holatlardan **ko'proq**.

> ## 🏆 **VA BU — MODEL SIFATI MUAMMOSI EMAS.** ## ## ⭐ 6% yolg'on bayroq — ## **juda yaxshi** ko'rsatkich. ## ## 💥 Muammo — **hodisa nodir**.

---

## 3. 🔬 Inson nazorati — **qancha kerak?**

> *"Inson tajribasi AI chiqishlari **oqilona va etik** ekanini
> ta'minlashi kerak."*

Yaxshi. Lekin **inson quvvati cheklangan**. O'lchaymiz.

```python
def inson_nazorati(hisoblar, quvvat):
    """Inson faqat QUVVATI yetganicha ko'radi — qolgani AVTOMATIK."""
    b = [h for h in hisoblar if h["bayroq"]]
    korilgan, korilmagan = b[:quvvat], b[quvvat:]
    return {
        "korilgan": len(korilgan),
        "avtomatik_yopiladi": len(korilmagan),
        "AYBSIZ_yopilgan": sum(not h["haqiqiy"] for h in korilmagan),
    }
```

### ✅ Haqiqiy natija

```
    inson quvvati   ko'rilgan   avto yopilgan   AYBSIZ yopilgan
                0           0              68                49
               20          20              48                37
               40          40              28                21
               60          60               8                 4
               68          68               0                 0
```

> ## ⚠️ **QISMAN NAZORAT — QISMAN HIMOYA.**
>
> ## ## ⭐ Quvvat **60** bo'lganda ham ## 💥 **4 ta aybsiz mijoz** yo'qoladi.

> ## 💡 **AMALIY QOIDA:** ## agar hamma bayroqni ko'ra olmasangiz — ## ## 🏆 **bayroqlar sonini kamaytiring**, ## quvvatni oshirishga urinmang.

### 🏆 Va buni **qanday qilish** mumkin

| Usul | Ta'siri |
|---|---|
| ## **Chegarani ko'tarish** | ## ⭐ Kamroq bayroq, **kamroq topilgan** |
| ## **Ikki bosqichli** | ## 🏆 **Arzon filtr → qimmat model** |
| Avtomatik **yopmaslik** | ## ✅ **Faqat cheklash**, yopish emas |
| Mijozga xabar + 24 soat | 🏆 **Qaytarish yo'li** |

> ## 💡 **UCHINCHI QATOR — ENG ARZON VA ENG SAMARALI.** ## ## ⭐ *"Yopish"* o'rniga *"tranzaksiyani to'xtatish"* ## ## 🔑 zararni **qaytarib bo'ladigan** qiladi.

---

## 4. 🔧 Kursning to'rtta savoli — **kodga aylantiramiz**

> *"Biznes quyidagi savollarni berishi kerak: Chiqish qanday hosil bo'ldi?
> U kamsitishi mumkinmi? Nega bu natija tanlanganini asoslay olamizmi?
> Agar bu qaror **noto'g'ri** bo'lsa nima bo'ladi?"*

```python
KURS_SAVOLLARI = [
    ("Chiqish qanday hosil bo'ldi?",                    "tushuntiruvchi bormi?"),
    ("Kamsitishi mumkinmi?",                            "bias auditi qilinganmi?"),
    ("Nega bu natija tanlanganini asoslay olamizmi?",   "log saqlanadimi?"),
    ("Qaror NOTO'G'RI bo'lsa nima bo'ladi?",            "qaytarish yo'li bormi?"),
]
```

### ✅ Haqiqiy natija — **bizning ilova**

```
  OK  Chiqish qanday hosil bo'ldi?                   [tushuntiruvchi bormi?]
  BAD Kamsitishi mumkinmi?                           [bias auditi qilinganmi?]
  OK  Nega bu natija tanlanganini asoslay olamizmi?  [log saqlanadimi?]
  BAD Qaror NOTO'G'RI bo'lsa nima bo'ladi?           [qaytarish yo'li bormi?]

  2/4
```

> ## 💥💥 **TO'RTINCHI SAVOL — ENG KO'P UNUTILADIGANI.**
>
> ## ## 🔑 *"Qaytarish yo'li"* bo'lmasa, ## ⭐ xatoni **aniqlasangiz ham** ## 💥 **tuzatib bo'lmaydi**.

> ## 🏆 **VA U — ENG ARZONI:** ## hisobni **yopish** o'rniga **muzlatish**, ## ## ⭐ 24 soatlik **e'tiroz oynasi**, ## 💡 va **bekor qilish tugmasi**.

---

## 5. 💡 Chiqish nazorati — **to'liq qadamlar**

```python
def chiqish_nazorati(qaror, kontekst):
    """AI taklifini QARORGA aylantirishdan oldin."""
    tekshiruv = {
        "tushuntirish": tushuntir(qaror),              # 2-dars: SHAP(ball)
        "guruh_farqi":  guruh_farqi(kontekst),         # 69/72-modul
        "ishonch":      qaror["ishonch"],
        "oqibat":       oqibat_darajasi(qaror),
    }

    if tekshiruv["oqibat"] == "qaytarib bo'lmaydi":
        return "INSONGA"                               # 💥 har doim
    if tekshiruv["ishonch"] < 0.90:
        return "INSONGA"
    if tekshiruv["guruh_farqi"] > 0.05:                # 72-modul: kalibrlash
        return "INSONGA"
    return "AVTOMATIK"
```

> ## 🏆 **BIRINCHI SHART — ENG MUHIMI.** ## ## ⭐ *"Qaytarib bo'lmaydigan"* qarorlar ## 🔑 **hech qachon avtomatik bo'lmasin** — ## ishonch qanday bo'lishidan **qat'i nazar**.

> ## 💥 **VA 72-MODUL BUNGA SABAB BERGAN EDI:** ## `0.93` ishonch ## ⭐ B guruhida ## 💥 **haqiqiy 0.69** ni anglatardi.

---

## 🎯 Nazorat savollari

1. Model 85% aniq edi. Bayroqlarning necha foizi yolg'on chiqdi? Nega?
2. Inson quvvati 60 bo'lganda nechta aybsiz mijoz yo'qoladi?
3. Kursning qaysi savoli eng ko'p unutiladi?
4. Qaysi qarorlar hech qachon avtomatik bo'lmasligi kerak?

<details>
<summary>Javoblar</summary>

1. ## **72%** *(68 tadan 49 tasi)*. 🔑 Sabab — **asosiy stavka xatosi**: aybsizlar **976** ta, ularning **6%** i = **49**; haqiqiy firibgarlar **24** ta, ularning **85%** i = **19**. ⭐ 💥 **49 > 19**. 🏆 Bu — model sifati emas, **hodisaning nodirligi**.
2. ## **4 ta.** ⚠️ Qisman nazorat — qisman himoya. 💡 Agar hamma bayroqni ko'ra olmasangiz, 🏆 **bayroqlar sonini kamaytiring**, quvvatni oshirmang.
3. ## **"Qaror noto'g'ri bo'lsa nima bo'ladi?"** — ya'ni **qaytarish yo'li**. 💥 Usiz xatoni aniqlasangiz ham **tuzatib bo'lmaydi**. ⭐ Va u eng arzoni: yopish o'rniga **muzlatish** + **24 soatlik e'tiroz oynasi**.
4. ## **Qaytarib bo'lmaydigan qarorlar** — ishonch qanday bo'lishidan qat'i nazar. 💥 72-modul sababini bergan: `0.93` ishonch B guruhida **haqiqiy `0.69`** ni anglatardi.

</details>

---

⬅️ [2-dars](02-Transparency-and-XAI.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Responsible-Adoption.md)
