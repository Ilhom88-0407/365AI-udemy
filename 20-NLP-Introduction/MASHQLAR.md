# 📝 20-modul · Barcha mashqlar

**44 ta mashq** — 4 ta bo'lim. Yechimlar `<details>` ichida.

> 📌 Bu modul **nazariy** — kursda rasmiy mashqlar yo'q. Barcha mashqlar ushbu darslikka **maxsus** tayyorlangan.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--nlp-nima) | NLP nima | 10 |
| [B](#b--kundalik-hayotda) | Kundalik hayotda | 12 |
| [C](#c--nazorat-ostida-va-nazoratsiz) | Nazorat ostida va nazoratsiz | 12 |
| [D](#d--birinchi-nlp-kodi) | Birinchi NLP kodi | 10 |
| | **JAMI** | **44** |

---

## A · NLP nima

**A1.** NLP nimaning qisqartmasi? To'liq yozing.

**A2.** NLP ning uchta imkoniyatini ayting.

**A3.** Qanday texnikalar ishlatiladi?

**A4.** NLP qachon paydo bo'ldi?

**A5.** Dastlabki metodlar qanday edi?

**A6.** Nima uchun grammatik qoidalar yetarli emas?

**A7.** Bugun nima o'zgardi?

**A8.** Ma'lumot olimlari uchun NLP nima beradi?

**A9.** NLP ning uchta davrini yozing.

**A10.** Ko'p ma'noli so'zga 3 ta misol keltiring.

<details>
<summary>✅ A bo'limi yechimlari</summary>

```
A1 — Natural Language Processing = Tabiiy Tilni Qayta Ishlash

A2 — TUSHUNISH (understand) · TALQIN QILISH (interpret) · YARATISH (generate)

A3 — Statistika + Mashinali o'rganish + Chuqur o'rganish

A4 — Taxminan 1950-yillarda

A5 — QOIDAGA asoslangan tizimlar (grammatik qoidalar)

A6 — "Til o'rgangan bo'lsangiz bilasiz: oddiy grammatik qoidalarni
     o'rganish tilni HAQIQATAN tushunish uchun YETARLI EMAS."

A7 — Texnologiyada katta yutuqlar + katta MA'LUMOT TO'PLAMLARI
     → ChatGPT kabi tizimlar

A8 — Matn ma'lumotlaridan INSAYT olish uchun kuchli vositalar.
     Ilgari QO'LDA yoki UMUMAN qilinmagan ishni avtomatlashtiradi.

A9 — 1950–1990  qoidaga asoslangan
     1990–2015  statistika + ML
     2015–bugun chuqur o'rganish

A10 — "bank"   → moliya muassasasi / daryo qirg'og'i
      "yosh"   → yil / ko'z yoshi
      "olma"   → meva / buyruq ("olma!")
```

</details>

---

## B · Kundalik hayotda

**B1.** Qidiruv tizimi NLP dan qanday foydalanadi? Uch bosqich.

**B2.** Spam filtri qanday ishlaydi?

**B3.** Chatbot nima qiladi?

**B4.** Yana 5 ta NLP misolini toping.

**B5.** Mini spam filtrini yozing.

**B6.** Unga yana 4 ta o'rgatish xati qo'shing.

**B7.** Har bir so'zning spam/normal ballini chiqaring.

**B8.** Qidiruv so'rovi **niyatini** aniqlovchi funksiya yozing.

**B9.** Oddiy chatbot yozing.

**B10.** Butunlay yangi so'zlar kelsa nima bo'ladi?

**B11.** Qaysi xato yomonroq: spam o'tishi yoki normal bloklanishi?

**B12.** `"NOMA'LUM"` holatini kamaytirish yo'llarini yozing.

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1 — UCH BOSQICH
# 1. KALIT SO'ZLARNI ajratib olish
# 2. Foydalanuvchi so'rovining NIYATINI tushunish
# 3. Tegishli va mos veb-sahifalarni QAYTARISH

# B2 — TASNIFLASH algoritmlari keraksiz va qonuniy xatlarni
#      FARQLAYDIGAN NAQSHLARNI topadi

# B3 — Mijoz so'rovlarini TUSHUNADI va tegishli JAVOBLARNI qaytaradi

# B4 — Subtitr · rezyume tahlili · tibbiy yozuvlar ·
#      yuridik hujjatlar · nafrat nutqini aniqlash

# B5
xatlar = [
    ("Siz million yutdingiz darrov bosing", "SPAM"),
    ("Ertangi yigilish soat onda", "NORMAL"),
    ("BEPUL taklif faqat bugun bosing", "SPAM"),
    ("Hisobot fayli ilova qilingan", "NORMAL"),
    ("Pul yutuq darhol oling bepul", "SPAM"),
    ("Loyiha bo'yicha savol bor edi", "NORMAL"),
]
spam_sozlar = {}
normal_sozlar = {}
for matn, yorliq in xatlar:
    for soz in matn.lower().split():
        if yorliq == "SPAM":
            spam_sozlar[soz] = spam_sozlar.get(soz, 0) + 1
        else:
            normal_sozlar[soz] = normal_sozlar.get(soz, 0) + 1

def spam_mi(matn):
    s = 0; n = 0
    for soz in matn.lower().split():
        s += spam_sozlar.get(soz, 0)
        n += normal_sozlar.get(soz, 0)
    if s > n:   return "SPAM"
    elif n > s: return "NORMAL"
    return "NOMA'LUM"

print(spam_mi("Bepul pul darhol bosing"))     # SPAM
print(spam_mi("Yigilish bo'yicha savol"))     # NORMAL

# B6
qoshimcha = [
    ("Kredit tasdiqlandi tez oling", "SPAM"),
    ("Shartnoma imzolash uchun keling", "NORMAL"),
    ("Yutuq lotereya darrov", "SPAM"),
    ("Hujjatlar tayyor ekan", "NORMAL"),
]

# B7
def tahlil(matn):
    for soz in matn.lower().split():
        print(" ", soz, "\t spam:", spam_sozlar.get(soz, 0),
              "\t normal:", normal_sozlar.get(soz, 0))
tahlil("Bepul pul darhol bosing")

# B8
def niyat(sorov):
    s = sorov.lower()
    if "qayerda" in s or "manzil" in s or "yaqin" in s:  return "JOY"
    elif "qancha" in s or "narx" in s:                    return "NARX"
    elif "qanday" in s or "qanaqa" in s:                  return "MA'LUMOT"
    elif "kim" in s:                                      return "SHAXS"
    return "UMUMIY"

print(niyat("Toshkentda eng yaqin dorixona qayerda"))    # JOY
print(niyat("Noutbuk narxi qancha"))                     # NARX

# B9
def chatbot(savol):
    n = niyat(savol)
    if n == "JOY":       return "Xaritada ko'rsataymi?"
    elif n == "NARX":    return "Narxlar ro'yxatini yuboraman."
    elif n == "MA'LUMOT":return "Bu haqda maqola bor, o'qing."
    elif n == "SHAXS":   return "Bu odam haqida ma'lumot topaman."
    return "Savolingizni aniqroq yozing."

print(chatbot("Do'kon qayerda"))         # Xaritada ko'rsataymi?

# B10
print(spam_mi("Zzz qqq www"))            # NOMA'LUM
# Barcha so'zlar YANGI — ikkala ballda ham 0

# B11 — NORMAL XATNI BLOKLASH yomonroq
# SPAM o'tsa    →  foydalanuvchi o'chiradi (kichik noqulaylik)
# NORMAL bloklansa →  MUHIM xat YO'QOLADI (katta zarar)
# Atama: FALSE POSITIVE — eng qimmat xato

# B12 — UCH YO'L
# 1. KO'PROQ o'rgatish ma'lumoti
# 2. STEMMING — "bosing" va "bosdi" bir xil (21-modul)
# 3. Tenglikda STANDART qiymat (masalan, NORMAL)
```

</details>

---

## C · Nazorat ostida va nazoratsiz

**C1.** Ikki fundamental yondashuv qaysilar?

**C2.** Tanlov nimaga bog'liq?

**C3.** Nazorat ostida o'rganish nimani o'z ichiga oladi?

**C4.** Sharhlar misolida kirish va chiqish nima?

**C5.** Nazoratsiz o'rganishga nima kerak emas?

**C6.** Klasterlash qaysi turga kiradi?

**C7.** 5 ta sharh va ball bilan nazorat ostida misol yozing.

**C8.** Yorliqsiz 6 ta matndan guruh topishga urinib ko'ring.

**C9.** Uchta NLP vazifasini toifalarga ajrating.

**C10.** Yorliqlash **narxini** hisoblang.

**C11.** Nazoratsiz natijani qanday baholash mumkin?

**C12.** Nazoratsizdan nazorat ostidaga o'tish yo'lini yozing.

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
# C1 — NAZORAT OSTIDA (supervised) va NAZORATSIZ (unsupervised)

# C2 — Mavjud MA'LUMOTGA va javob izlayotgan SAVOLLARGA

# C3 — Algoritmni KIRISH va TAQDIM ETILGAN CHIQISH orasidagi
#      BOG'LIQLIKNI o'rganishga o'rgatish

# C4 — KIRISH: sharh matni    CHIQISH: o'ntadan ball

# C5 — YORLIQLAR

# C6 — NAZORATSIZ

# C7
sharhlar = ["Zo'r ishlaydi", "Sekin va noqulay", "Tavsiya qilaman",
            "Pulini bermaydi", "Mukammal sifat"]
baholar  = [10, 3, 9, 2, 10]
for i in range(len(sharhlar)):
    holat = "IJOBIY" if baholar[i] >= 5 else "SALBIY"
    print(sharhlar[i], "->", baholar[i], holat)

# C8
matnlar = ["Telefon batareyasi tez tugaydi",
           "Batareya bir kun ham chidamaydi",
           "Ekrani juda chiroyli",
           "Displey sifati zo'r ekrani",
           "Zaryad tez tugaydi batareya",
           "Kamera yaxshi rasm oladi"]
def umumiy(a, b):
    return len(set(a.lower().split()) & set(b.lower().split()))
for i in range(len(matnlar)):
    for j in range(i+1, len(matnlar)):
        u = umumiy(matnlar[i], matnlar[j])
        if u > 0:
            print(i, "va", j, "->", u, "umumiy so'z")
# 0 va 4 -> 2 umumiy so'z
# 1 va 4 -> 1 umumiy so'z
# 2 va 3 -> 1 umumiy so'z

# C9
# Spam filtri             →  NAZORAT OSTIDA
# Yangiliklarni guruhlash →  NAZORATSIZ
# Sentiment tahlili       →  NAZORAT OSTIDA

# C10
n = 10000 * 20
print("Vaqt:", round(n/3600, 1), "soat")            # 55.6 soat
print("Narx ($15/soat):", round(n/3600 * 15), "$")  # 833 $

# C11 — UCH YO'L
# 1. ODAM BAHOSI — mutaxassis "mantiqlimi?" deb baholaydi
# 2. IChKI METRIKA — guruh ichi o'xshash, guruhlar orasi farqli
# 3. AMALIY FOYDA — natija biznesga yordam berdimi?

# C12 — AMALIY YO'L
# 1. NAZORATSIZ: 10 000 sharhni klasterlash → 5 guruh
# 2. ODAM: guruhlarga NOM berish
# 3. YORLIQLASH: har guruhdan 100 ta (10 000 emas, 500 ta!)
# 4. NAZORAT OSTIDA: 500 yorliq bilan model o'rgatish
# → 55 soat o'rniga 3 SOAT
```

</details>

---

## D · Birinchi NLP kodi

**D1.** Matndan **so'z chastotasi** lug'atini yasang.

**D2.** Eng ko'p uchraydigan so'zni toping.

**D3.** Turli so'zlar sonini hisoblang.

**D4.** Qoidaga asoslangan sentiment funksiyasini yozing.

**D5.** Unga `"emas"` ni hisobga oluvchi qoida qo'shing.

**D6.** Ball o'rniga **foizda** ishonchni chiqaring.

**D7.** Nazorat ostida sodda modelni yozing (so'zlarga ball).

**D8.** Yangi matn uchun ball bashorat qiling.

**D9.** Ikki matn orasidagi **umumiy so'zlarni** toping.

**D10.** O'xshashlik **matritsasini** chiqaring.

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
matn = "NLP juda qiziqarli soha. NLP kompyuterlarga tilni tushunishga yordam beradi."

# D1
sozlar = matn.lower().replace(".", "").split()
ch = {}
for s in sozlar:
    ch[s] = ch.get(s, 0) + 1
print(ch)
# {'nlp': 2, 'juda': 1, 'qiziqarli': 1, 'soha': 1, 'kompyuterlarga': 1,
#  'tilni': 1, 'tushunishga': 1, 'yordam': 1, 'beradi': 1}

# D2
eng = ""; soni = 0
for s in ch:
    if ch[s] > soni:
        soni = ch[s]; eng = s
print(eng, "-", soni)                   # nlp - 2

# D3
print("Jami:", len(sozlar), " Turli:", len(ch))     # Jami: 10  Turli: 9

# D4
def sentiment(matn):
    ij = ["yaxshi", "ajoyib", "zo'r", "a'lo"]
    sal = ["yomon", "past", "sifatsiz", "isrof"]
    b = 0
    for s in matn.lower().split():
        if s in ij:  b += 1
        if s in sal: b -= 1
    if b > 0:   return "IJOBIY"
    elif b < 0: return "SALBIY"
    return "NEYTRAL"
print(sentiment("Juda yaxshi mahsulot"))            # IJOBIY
print(sentiment("Mahsulot yaxshi emas"))            # IJOBIY  ← XATO!

# D5
def sentiment_v3(matn):
    ij = ["yaxshi", "ajoyib", "zo'r", "a'lo"]
    sal = ["yomon", "past", "sifatsiz"]
    sz = matn.lower().split()
    b = 0
    for i in range(len(sz)):
        q = 0
        if sz[i] in ij:  q = 1
        if sz[i] in sal: q = -1
        if i + 1 < len(sz) and sz[i+1] == "emas":
            q = -q
        b += q
    if b > 0:   return "IJOBIY"
    elif b < 0: return "SALBIY"
    return "NEYTRAL"
print(sentiment_v3("Mahsulot yaxshi emas"))         # SALBIY  ✅
print(sentiment_v3("Mahsulot yomon emas"))          # IJOBIY  ✅

# D6
def sentiment_foiz(matn):
    ij = ["yaxshi", "ajoyib", "zo'r", "a'lo"]
    sal = ["yomon", "past", "sifatsiz"]
    i2 = 0; s2 = 0
    for s in matn.lower().split():
        if s in ij:  i2 += 1
        if s in sal: s2 += 1
    j = i2 + s2
    if j == 0:
        return "NEYTRAL (0% ishonch)"
    f = max(i2, s2) / j * 100
    if i2 > s2:
        return "IJOBIY (" + str(round(f)) + "% ishonch)"
    return "SALBIY (" + str(round(f)) + "% ishonch)"
print(sentiment_foiz("Yaxshi va ajoyib"))               # IJOBIY (100% ishonch)
print(sentiment_foiz("Yaxshi lekin yomon va sifatsiz")) # SALBIY (67% ishonch)

# D7
sharhlar = ["Juda yaxshi mahsulot", "Yomon sifat", "Ajoyib xizmat", "Pul isrofi"]
baholar  = [9, 2, 10, 1]
sb = {}; ss = {}
for i in range(len(sharhlar)):
    for s in sharhlar[i].lower().split():
        sb[s] = sb.get(s, 0) + baholar[i]
        ss[s] = ss.get(s, 0) + 1
ort = {}
for s in sb:
    ort[s] = sb[s] / ss[s]
print(ort["yaxshi"], ort["yomon"])       # 9.0 2.0

# D8
def bashorat(matn):
    j = 0; t = 0
    for s in matn.lower().split():
        if s in ort:
            j += ort[s]; t += 1
    if t == 0:
        return "Noma'lum"
    return round(j / t, 1)
print(bashorat("Ajoyib mahsulot"))       # 9.5
print(bashorat("Salom dunyo"))           # Noma'lum

# D9
def umumiy_sozlar(a, b):
    return set(a.lower().split()) & set(b.lower().split())
print(umumiy_sozlar("Narxi juda qimmat", "Bunday pulga qimmat"))    # {'qimmat'}

# D10
sh2 = ["Yetkazib berish sekin bo'ldi", "Kuryer kech keldi juda",
       "Narxi juda qimmat ekan", "Bunday pulga arzimaydi qimmat"]
for i in range(len(sh2)):
    for j in range(len(sh2)):
        print(len(umumiy_sozlar(sh2[i], sh2[j])), end="  ")
    print()
# 4  0  0  0  
# 0  4  1  0  
# 0  1  4  1  
# 0  0  1  4  
```

</details>

---

## 🎯 O'zingizni baholang

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **40–44** | 🏆 **A'lo** | 21-modulga o'ting |
| **33–39** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **26–32** | 🥉 **Qoniqarli** | Darslarni qayta o'qing |
| **0–25** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

| Bo'lim | Ballim | Zaif bo'lsa |
|---|---|---|
| A · NLP nima | ___ / 10 | [2-dars](02-Introduction-to-NLP.md) |
| B · Kundalik hayotda | ___ / 12 | [3-dars](03-NLP-in-Everyday-Life.md) |
| C · Nazorat ostida/siz | ___ / 12 | [4-dars](04-Supervised-vs-Unsupervised.md) |
| D · Birinchi kod | ___ / 10 | Barcha darslar |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
