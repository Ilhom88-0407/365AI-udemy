# 3-dars. NLP kundalik hayotda

## 🎬 Boshlashdan oldin

> **"Bir necha misol bilan NLP qanchalik uzoqqa borganini va u bizning KUNDALIK HAYOTIMIZ bilan qanchalik ko'p ta'sirlashishini ko'rsataylik."**

Siz bugun **kamida 5 marta** NLP tizimidan foydalangansiz — buni sezmasdan.

---

## 1. Qidiruv tizimlari

> **"Bitta asosiy misol — QIDIRUV TIZIMLARI. Ular foydalanuvchi so'rovini TUSHUNISH va TEGISHLI qidiruv natijalarini berish uchun NLP dan foydalanadi."**

> ## **"NLP texnikalari KALIT SO'ZLARNI ajratib olish, foydalanuvchi so'rovining NIYATINI tushunish va tegishli hamda mos veb-sahifalarni qaytarish uchun ishlatiladi."**

### Uch bosqich

```
"toshkentda eng yaqin dorixona qayerda"
              ↓
1. KALIT SO'ZLAR:  toshkent · yaqin · dorixona
              ↓
2. NIYAT:          JOY topish (ma'lumot emas!)
              ↓
3. NATIJA:         Xarita + eng yaqin dorixonalar ro'yxati
```

> 💡 **Diqqat:** qidiruv tizimi `"qayerda"` so'zidan **niyatni** tushunadi. Agar `"dorixona qanday ishlaydi"` deb so'rasangiz — u **maqola** qaytaradi, xarita emas.

---

## 2. Spam filtri

> **"Yana bir ajoyib misol — pochta hisobingiz spam xatlarni QANDAY AVTOMATIK ANIQLASHI."**
>
> ## **"TASNIFLASH ALGORITMLARI keraksiz va qonuniy xatlarni FARQLAYDIGAN NAQSHLARNI topish uchun ishlatilishi mumkin."**

### Qanday ishlaydi?

```
YORLIQLANGAN ma'lumot (nazorat ostida o'rganish!)

"Siz 1 000 000 dollar yutdingiz!"     →  SPAM
"Ertangi yig'ilish 10:00 da"          →  NORMAL
"BEPUL! DARROV BOSING!!!"             →  SPAM
"Hisobot fayli ilova qilingan"        →  NORMAL
                ↓
    Model NAQSHLARNI o'rganadi
                ↓
    YANGI xat kelganda — o'zi tasniflaydi
```

> 🔑 **Bu — nazorat ostida o'rganish** *(keyingi darsda batafsil)*.

---

## 3. Chatbotlar va mijozlarni qo'llab-quvvatlash

> **"Mijozlarni qo'llab-quvvatlash tizimlari va CHATBOTLAR ham mijoz so'rovlarini tushunish uchun NLP dan foydalanadi."**
>
> **"Ma'lumot olimlari mijoz nima so'rayotganini TUSHUNADIGAN va tegishli JAVOBLARNI qaytaradigan suhbat agentlarini qura oladi."**

```
Mijoz:  "Buyurtmam qayerda?"
           ↓
     NIYAT: buyurtma holati
           ↓
     Bazadan qidirish
           ↓
Bot:    "Buyurtmangiz yo'lda, ertaga yetkaziladi."
```

---

## 4. Yana ko'p misollar

> **"Yana shunchalik ko'p misollar borki, biz ko'rib chiqishimiz mumkin — va men sizni yana bir nechtasini o'ylab ko'rishga undayman."**

### Sizga tanish bo'lgan NLP tizimlari

| Misol | NLP nima qiladi |
|---|---|
| 🔍 **Google qidiruv** | So'rovni tushunish, natija tartiblash |
| 📧 **Gmail spam** | Xatlarni tasniflash |
| 💬 **ChatGPT** | Savolga javob yaratish |
| 🌐 **Google Tarjima** | Bir tildan boshqasiga |
| 📱 **Klaviatura taklifi** | Keyingi so'zni bashorat qilish |
| 🎙 **Siri / Google Assistant** | Ovozni matnga + niyat |
| ⭐ **Amazon sharhlari** | "Foydali" sharhlarni saralash |
| 📰 **Yangiliklar tavsiyasi** | Mavzu bo'yicha guruhlash |
| 🔤 **Avtomatik tuzatish** | Imlo xatolarini topish |
| 📄 **Rezyume skrining** | Mos nomzodlarni topish |

---

## 5. Kurs nima beradi

> ## **"Bu kurs oxirida sizda O'Z NLP yechimlaringizni qurishni boshlash uchun DASTLABKI QURILISH BLOKLARI bo'ladi."**

---

## 6. 💻 Amaliy: mini spam filtri

Chinakam NLP tizimini **hozircha kutubxonasiz** yasab ko'ramiz:

```python
# ===== O'RGATISH MA'LUMOTI (yorliqlangan) =====
xatlar = [
    ("Siz million yutdingiz darrov bosing", "SPAM"),
    ("Ertangi yigilish soat onda", "NORMAL"),
    ("BEPUL taklif faqat bugun bosing", "SPAM"),
    ("Hisobot fayli ilova qilingan", "NORMAL"),
    ("Pul yutuq darhol oling bepul", "SPAM"),
    ("Loyiha bo'yicha savol bor edi", "NORMAL"),
]

# ===== O'RGATISH: har bir so'zni sanash =====
spam_sozlar = {}
normal_sozlar = {}
spam_soni = 0
normal_soni = 0

for matn, yorliq in xatlar:
    for soz in matn.lower().split():
        if yorliq == "SPAM":
            spam_sozlar[soz] = spam_sozlar.get(soz, 0) + 1
            spam_soni += 1
        else:
            normal_sozlar[soz] = normal_sozlar.get(soz, 0) + 1
            normal_soni += 1

print("Spam so'zlar:  ", spam_soni)
print("Normal so'zlar:", normal_soni)
print()

# ===== BASHORAT =====
def spam_mi(matn):
    spam_ball = 0
    normal_ball = 0
    for soz in matn.lower().split():
        spam_ball += spam_sozlar.get(soz, 0)
        normal_ball += normal_sozlar.get(soz, 0)
    if spam_ball > normal_ball:
        return "SPAM"
    elif normal_ball > spam_ball:
        return "NORMAL"
    return "NOMA'LUM"

# ===== SINOV (model ko'rmagan xatlar) =====
yangi = [
    "Bepul pul darhol bosing",
    "Yigilish bo'yicha savol",
    "Ob-havo yaxshi bugun",
]
for x in yangi:
    print(spam_mi(x), "|", x)
```

**Natija:**

```
Spam so'zlar:   15
Normal so'zlar: 13

SPAM | Bepul pul darhol bosing
NORMAL | Yigilish bo'yicha savol
SPAM | Ob-havo yaxshi bugun
```

### 🔑 Nima sodir bo'ldi?

| Xat | Natija | Nima uchun |
|---|---|---|
| `"Bepul pul darhol bosing"` | **SPAM** ✅ | Barcha so'zlar spam'da uchragan |
| `"Yigilish bo'yicha savol"` | **NORMAL** ✅ | Bu so'zlar normal xatlarda |
| `"Ob-havo yaxshi bugun"` | **SPAM** ❌ | **XATO!** — quyida qarang |

### ⚠️ Uchinchi natija — XATO

`"Ob-havo yaxshi bugun"` — bu **normal** xat, lekin model **SPAM** dedi.

**Nima uchun?** Bitta so'z aybdor:

```
ob-havo   →  spam: 0   normal: 0   ← yangi so'z
yaxshi    →  spam: 0   normal: 0   ← yangi so'z
bugun     →  spam: 1   normal: 0   ← ⚠️ "BEPUL taklif faqat BUGUN bosing" dan!
```

`"bugun"` so'zi **tasodifan** faqat spam xatda uchragan. Model uni **spam belgisi** deb o'ylab qoldi.

> ## 🔑 **Bu — HAQIQIY muammo: YETARLI BO'LMAGAN ma'lumot.**
>
> Atigi **6 ta** xat bilan o'rgatilgan model **ishonchsiz**. Chinakam spam filtri **millionlab** xatda o'rgatiladi — shunda `"bugun"` ikkala toifada ham uchraydi va **neytral** bo'lib qoladi.

> ## 💡 **Bu — haqiqiy spam filtrining SODDALASHTIRILGAN modeli.**
>
> Chinakam tizim **Naive Bayes** algoritmini ishlatadi — u **ehtimollik** bilan hisoblaydi. Uni **26-modulda** o'rganasiz.

---

## 7. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Spam filtriga yana 4 ta o'rgatish xati qo'shing.

**M2.** O'zingizning 5 ta test xatini sinang.

**M3.** Har bir so'zning spam/normal ballini chiqaring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
qoshimcha = [
    ("Kredit tasdiqlandi tez oling", "SPAM"),
    ("Shartnoma imzolash uchun keling", "NORMAL"),
    ("Yutuq lotereya darrov", "SPAM"),
    ("Hujjatlar tayyor ekan", "NORMAL"),
]
# xatlar ro'yxatiga qo'shing va qayta o'rgating

# M2
mening = [
    "Kredit yutuq bepul",
    "Shartnoma bo'yicha hujjat",
    "Salom qalaysiz",
    "Darrov bosing pul",
    "Yigilish ertaga",
]
# for x in mening: print(spam_mi(x), "|", x)

# M3
def tahlil(matn):
    for soz in matn.lower().split():
        s = spam_sozlar.get(soz, 0)
        n = normal_sozlar.get(soz, 0)
        print(" ", soz, "\t spam:", s, "\t normal:", n)

tahlil("Bepul pul darhol bosing")
#   bepul    spam: 2   normal: 0
#   pul      spam: 1   normal: 0
#   darhol   spam: 1   normal: 0
#   bosing   spam: 2   normal: 0
```

</details>

### 🟡 O'rta

**M4.** Qidiruv so'rovining **niyatini** aniqlovchi funksiya yozing.

**M5.** Chatbot uchun oddiy **niyat aniqlagich** yozing.

**M6.** `"NOMA'LUM"` holatini kamaytirish uchun nima qilish mumkin?

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
def niyat(sorov):
    s = sorov.lower()
    if "qayerda" in s or "manzil" in s or "yaqin" in s:
        return "JOY"
    elif "qancha" in s or "narx" in s or "necha pul" in s:
        return "NARX"
    elif "qanday" in s or "qanaqa" in s:
        return "MA'LUMOT"
    elif "kim" in s:
        return "SHAXS"
    return "UMUMIY"

print(niyat("Toshkentda eng yaqin dorixona qayerda"))    # JOY
print(niyat("Noutbuk narxi qancha"))                     # NARX
print(niyat("Python qanday o'rganiladi"))                # MA'LUMOT
print(niyat("Python kim tomonidan yaratilgan"))          # SHAXS

# M5
def chatbot(savol):
    n = niyat(savol)
    if n == "JOY":
        return "Xaritada ko'rsataymi?"
    elif n == "NARX":
        return "Narxlar ro'yxatini yuboraman."
    elif n == "MA'LUMOT":
        return "Bu haqda maqola bor, o'qing."
    elif n == "SHAXS":
        return "Bu odam haqida ma'lumot topaman."
    return "Savolingizni aniqroq yozing."

print(chatbot("Do'kon qayerda"))         # Xaritada ko'rsataymi?
print(chatbot("Bu qancha turadi"))       # Narxlar ro'yxatini yuboraman.

# M6 — UCH YO'L
# 1. KO'PROQ o'rgatish ma'lumoti — model ko'proq so'z ko'radi
# 2. STEMMING — "bosing" va "bosdi" bir xil deb hisoblanadi (21-modul)
# 3. TENGLIKDA standart qiymat — masalan, NORMAL deb hisoblash
#    (spam filtrida NORMAL xatni SPAM ga tashlash — YOMONROQ xato)
```

</details>

### 🔴 Qiyin

**M7.** Yana **5 ta** NLP misolini o'ylab toping *(ma'ruzachi shunday so'ragan)*.

**M8.** Spam filtriga **butunlay yangi** so'zlar kelsa nima bo'ladi? Sinang.

**M9.** Qaysi xato yomonroq: spam'ni o'tkazish yoki normal xatni bloklash?

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — YANA 5 TA MISOL
# 1. Subtitr yaratish       →  video ovozini matnga (52-modul!)
# 2. Rezyume tahlili        →  mos nomzodni topish
# 3. Tibbiy yozuvlar        →  shifokor yozuvlaridan tashxis olish
# 4. Yuridik hujjatlar      →  shartnomadagi xavfli bandlarni topish
# 5. Ijtimoiy tarmoq        →  nafrat nutqini avtomatik aniqlash

# M8
print(spam_mi("Zzz qqq www"))       # NOMA'LUM
# Barcha so'zlar YANGI — ikkala ballda ham 0.
# Chinakam tizim bunday holatda:
#   - eng ehtimolli sinfni tanlaydi, yoki
#   - "ishonch past" deb belgilaydi va odamga uzatadi

# M9 — NORMAL XATNI BLOKLASH yomonroq
#
# SPAM o'tib ketsa      →  foydalanuvchi uni o'chiradi (kichik noqulaylik)
# NORMAL bloklansa      →  MUHIM xat yo'qoladi (katta zarar)
#
# Shuning uchun spam filtrlar "ehtiyotkor" bo'ladi:
# shubha bo'lsa — NORMAL deb o'tkazadi.
#
# Bu — MA'LUMOT OLIMINING qarori, algoritm emas.
# Atama: FALSE POSITIVE (noto'g'ri ijobiy) — eng qimmat xato.
```

</details>

---

## 8. 🧠 O'zini tekshirish savollari

1. Qidiruv tizimlari NLP dan qanday foydalanadi?
2. NLP texnikalari nima uchun ishlatiladi?
3. Spam filtri qanday ishlaydi?
4. Qaysi algoritmlar ishlatiladi?
5. Chatbotlar nima qiladi?
6. Ma'lumot olimlari nima qura oladi?
7. Kurs oxirida sizda nima bo'ladi?

<details>
<summary>✅ Javoblar</summary>

1. Foydalanuvchi so'rovini **tushunish** va **tegishli** natijalarni berish uchun.
2. **Kalit so'zlarni ajratib olish**, so'rovning **niyatini** tushunish va mos veb-sahifalarni qaytarish.
3. **Tasniflash algoritmlari** keraksiz va qonuniy xatlarni **farqlaydigan naqshlarni** topadi.
4. **Tasniflash** (*classification*) algoritmlari.
5. Mijoz so'rovlarini **tushunadi** va tegishli **javoblarni** qaytaradi.
6. Mijoz nima so'rayotganini tushunadigan **suhbat agentlarini**.
7. O'z NLP yechimlarini qurish uchun **dastlabki qurilish bloklari**.

</details>

---

## 📌 Xulosa

```
NLP KUNDALIK HAYOTDA

🔍 QIDIRUV TIZIMI
   kalit so'zlar  →  NIYAT  →  mos natijalar

📧 SPAM FILTRI
   tasniflash algoritmlari  →  NAQSHLARNI topadi
   spam ↔ qonuniy

💬 CHATBOT
   mijoz so'rovini TUSHUNADI  →  javob qaytaradi


YANA MISOLLAR
Tarjima · klaviatura taklifi · Siri · avtomatik tuzatish
subtitr · rezyume skrining · tibbiy yozuvlar · nafrat nutqi


💡 MINI SPAM FILTRI (kutubxonasiz)
1. Yorliqlangan ma'lumot yig'ish
2. Har bir so'zni SPAM va NORMAL da sanash
3. Yangi xatda ballarni solishtirish

⚠️  Yangi so'z kelsa → NOMA'LUM
    Yechim: ko'proq ma'lumot · stemming (21-modul)


🔑 QAYSI XATO YOMONROQ?
SPAM o'tib ketsa       →  kichik noqulaylik
NORMAL bloklansa       →  MUHIM xat yo'qoladi  ⚠️
→ Filtrlar EHTIYOTKOR bo'ladi
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Qidiruv tizimi | *search engine* | Google, Bing |
| Kalit so'z | *keyword* | Asosiy so'z |
| Niyat | *intent* | Foydalanuvchi nima xohlaydi |
| Spam | *spam* | Keraksiz xat |
| Tasniflash | *classification* | Toifalarga ajratish |
| Naqsh | *pattern* | Takrorlanuvchi belgi |
| Chatbot | *chatbot* | Suhbat roboti |
| Suhbat agenti | *conversational agent* | Chatbotning rasmiy nomi |
| Noto'g'ri ijobiy | *false positive* | Normalni spam deb belgilash |

---

⬅️ [Oldingi: NLP ga kirish](02-Introduction-to-NLP.md) · ➡️ [Keyingi: Nazorat ostida va nazoratsiz](04-Supervised-vs-Unsupervised.md)
