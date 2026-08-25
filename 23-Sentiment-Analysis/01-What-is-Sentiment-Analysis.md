# 1-dars. Sentiment tahlili nima?

## 🎬 Boshlashdan oldin

> **"Xush kelibsiz, va umid qilamanki, kurs sizga yoqayotgandir. Bu keyingi bo'limda biz SENTIMENT TAHLILINI ko'rib chiqamiz."**
>
> ## **"Sentiment tahlili — bu matnning ASOSIY HISSIY OHANGINI aniqlash uchun NLP'dagi juda mashhur usul: u IJOBIYMI, SALBIYMI yoki NEYTRALMI."**

---

## 1. Nima uchun bu kerak?

> **"Bu turdagi tahlil odamlar ma'lum narsalarga QANDAY QARASHINI tez tushunishga qiziqqaningizda juda foydali."**
>
> **"Masalan, siz odamlar tvitlarni yoki boshqa ijtimoiy tarmoq ma'lumotlarini tahlil qilganini ko'rgan bo'lishingiz mumkin — va ular turli BRENDLAR, MAHSULOTLAR yoki ODAMLARGA nisbatan sentimentga qiziqishadi."**

```
     10 000 ta tvit
           │
           ▼
   ┌──────────────┐
   │  SENTIMENT   │
   │   TAHLILI    │
   └──────────────┘
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
    😀    😐    😞
   6200  2100  1700

   → "Brendimizga munosabat 62% ijobiy"
```

### 🎯 Haqiqiy hayotda

| Kim | Nima uchun |
|---|---|
| 🏢 **Kompaniya** | Yangi mahsulotga munosabat qanday? |
| 🎬 **Kinostudiya** | Treyler yoqdimi? |
| 🏛️ **Siyosatchi** | Nutqqa reaksiya qanday? |
| 🏨 **Mehmonxona** | *(21-modulni eslang!)* Sharhlar ijobiymi? |
| 📈 **Investor** | Aksiya haqidagi yangiliklar ohangi qanday? |
| 🎧 **Qo'llab-quvvatlash** | Qaysi mijoz **jahli chiqqan** — birinchi javob bering! |

---

## 2. Uchta sentiment — ta'riflar

> **"Kodga o'tishdan oldin, ijobiy, salbiy va neytral sentiment deganda nimani nazarda tutayotganimiz haqida ba'zi TA'RIFLARDAN boshlaylik — shunda hammamiz bir sahifada bo'lamiz."**

![Uchta sentiment](assets/01-three-sentiments.svg)

### 😀 IJOBIY

> **"Jumla IJOBIY sentiment deb tasniflanadi, agar unda biror narsani YOQTIRISH, ZAVQLANISH yoki boshqa turdagi IJOBIY HISSIYOT ifodalangan bo'lsa."**
>
> **"Masalan, jumla: *'Kafedagi musiqa meni juda TINCH va BEMALOL his qildirdi.'* Bu ijobiy sentiment jumlasiga misol bo'lardi."**

```
"The music in the cafe made me feel really calm and relaxed."
 (Kafedagi musiqa meni juda tinch va bemalol his qildirdi)
                                    ↑            ↑
                             IJOBIY HISSIYOT ifodalangan  →  😀
```

### 😞 SALBIY

> **"SALBIY sentiment esa — SALBIY hissiyot ifodasi."**
>
> **"Masalan, jumla: *'Hid juda YOMON edi va u meni KASAL his qildirdi.'* Salbiy hissiyot ifodalayapti. Demak, u salbiy sentiment deb tasniflanadi."**

```
"The smell was really bad and it made me feel sick."
 (Hid juda yomon edi va u meni kasal his qildirdi)
                    ↑                        ↑
             SALBIY HISSIYOT ifodalangan  →  😞
```

### 😐 NEYTRAL

> **"NEYTRAL sentiment ham bor. Agar jumla ijobiy ham, salbiy ham ko'rinmasa — u o'rtada biror joyda turadi — biz uni neytral sentiment deb ayta olamiz."**
>
> ## **"Masalan, *'Yomg'ir yog'ayotgan edi'* iborasi. Bu yerda yomg'ir haqida HECH QANDAY HISSIYOT ifodalanmagan. Bu shunchaki FAKT bayoni. Demak, bu neytral sentiment bo'ladi."**

```
"It was raining."
 (Yomg'ir yog'ardi)
        ↑
  FAKT — hech qanday hissiyot yo'q  →  😐
```

---

## 3. 🔑 Asosiy qoida

> ## 💡 **Sentiment — bu MAVZU emas, HISSIYOT.**

```
❌ NOTO'G'RI tushunish:
   "Urush haqida" → salbiy

✅ TO'G'RI tushunish:
   "Urush tugadi! Odamlar quvonmoqda."  →  😀 IJOBIY
   "Urush boshlandi. Dahshatli."        →  😞 SALBIY
   "Urush 1939-yilda boshlangan."       →  😐 NEYTRAL (fakt)
```

**Bir MAVZU — uchta har xil SENTIMENT.**

### O'zingizni sinab ko'ring

| Jumla | Sentiment? |
|---|---|
| *"Bu telefon 700 dollar turadi."* | ? |
| *"Bu telefon 700 dollar turadi — bu O'G'RILIK!"* | ? |
| *"Bu telefon 700 dollar turadi va bu ARZONLIK!"* | ? |

<details>
<summary>✅ Javob</summary>

1. 😐 **Neytral** — shunchaki narx, **fakt**.
2. 😞 **Salbiy** — `"o'g'rilik"` so'zi **g'azabni** bildiradi.
3. 😀 **Ijobiy** — `"arzonlik"` so'zi **mamnunlikni** bildiradi.

> 🔑 **Bir xil fakt (700$), uchta har xil sentiment.** Farq — **hissiy so'zlarda**.

</details>

---

## 4. Bu bo'limda nima o'rganamiz?

> **"Bu bo'limdagi darslar sentimentni HISOBLASHNING TURLI USULLARINI qamrab oladi. Birinchi darsimiz — QOIDAGA ASOSLANGAN sentimentdan boshlaylik."**

![Ikki yondashuv](assets/02-two-approaches.svg)

| | **Qoidaga asoslangan** *(2-dars)* | **Transformer** *(3-dars)* |
|---|---|---|
| **Qanday ishlaydi** | So'zlar **lug'ati** | **Chuqur o'qitilgan** model |
| **Mashinali o'qitish** | ❌ Yo'q | ✅ Ha |
| **Tezlik** | ⚡ **Juda tez** | 🐢 Sekin |
| **Hajmi** | ~1 MB | **250 MB – 1 GB** |
| **Tushuntirish** | ✅ **Oson** *(qaysi so'z qancha ball berdi)* | ❌ **Qora quti** |
| **Kontekst** | ❌ Ko'rmaydi | ✅ **Ko'radi** |
| **Kinoya (sarkazm)** | ❌ Tushunmaydi | ⚠️ Ba'zan |
| **Paketlar** | `TextBlob`, `VADER` | `transformers` |

---

## 5. ⚠️ Sentiment tahlilining CHEKLOVLARI

Bu — **oson emas**. Mana nima uchun:

### ① Kinoya (sarkazm)

```
"Ajoyib. Yana bir kechikkan reys. Shunchaki AJOYIB."
                                          ↑
    So'zlar IJOBIY, lekin ma'no — chuqur SALBIY  😤
```

### ② Inkor

```
"Bu film yaxshi EMAS edi."
       ↑           ↑
   ijobiy so'z   INKOR → salbiy
```

> 💡 **21-modulni eslang** — biz `not` ni to'xtatish so'zlaridan **atayin olib tashlagan edik**. Mana **nima uchun**.

### ③ Kontekst

```
"Bu sovun DAHSHATLI hidli."     →  😞  yomon
"Bu qahva DAHSHATLI kuchli."    →  😀  ...balki yaxshi?
```

### ④ Solishtirish

```
"Bu telefon eski modelidan YAXSHIROQ."
   → Yangisi haqida IJOBIY
   → Eskisi haqida esa... SALBIY?
```

### ⑤ Madaniyat va til

```
🇬🇧 "Not bad"  =  aslida YAXSHI (britan kamtarligi)
🇺🇸 "Not bad"  =  o'rtacha
```

> ## ⚠️ **Shuning uchun sentiment tahlili 100% aniq BO'LMAYDI.** Yaxshi modellar 85–92% aniqlikka erishadi. Qolgani — **inson ishi**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Quyidagi jumlalarni **qo'lda** tasniflang.

<details>
<summary>✅ Javoblar</summary>

| Jumla | Sentiment | Nima uchun |
|---|---|---|
| *"I love this book!"* | 😀 **Ijobiy** | `love` — kuchli ijobiy hissiyot |
| *"The delivery took 3 days."* | 😐 **Neytral** | Fakt, hissiyot yo'q |
| *"Worst purchase ever."* | 😞 **Salbiy** | `worst` — kuchli salbiy |
| *"It works."* | 😐 **Neytral** | Fakt *(garchi biroz sovuq)* |
| *"It's not terrible."* | 😐/😀 **Neytral-ijobiy** ⚠️ | **Inkor!** `not` + `terrible` |
| *"Fantastic. My flight got cancelled again."* | 😞 **Salbiy** ⚠️ | **KINOYA** — model buni topa olmaydi |

</details>

**M2.** Har bir sentiment uchun o'zingiz 3 tadan jumla yozing.

**M3.** Bir **mavzuni** oling *(masalan, "yomg'ir"*) va u haqida 3 xil sentimentli jumla yozing.

<details>
<summary>✅ Namuna</summary>

```
MAVZU: yomg'ir

😐 NEYTRAL:  "Ertaga yomg'ir yog'adi."
😀 IJOBIY:   "Nihoyat yomg'ir! Bog'imiz uchun ajoyib!"
😞 SALBIY:   "Yana yomg'ir. Sayohatimiz buzildi."
```

> 🔑 **Bir mavzu, uchta sentiment.** Sentiment — **mavzuda emas, HISSIYOTDA**.

</details>

### 🟡 O'rta

**M4.** Sentiment tahlili **noto'g'ri** ishlashi mumkin bo'lgan 5 ta holatni ayting.

**M5.** Qaysi biznes uchun sentiment tahlili **eng foydali**? Nima uchun?

<details>
<summary>✅ Javoblar</summary>

**M4 — 5 ta qiyin holat:**

1. **Kinoya** — `"Ajoyib, yana kechikdi."`
2. **Inkor** — `"yomon emas"`, `"unchalik yaxshi emas"`
3. **Solishtirish** — `"eskisidan yaxshiroq"` *(kim haqida?)*
4. **Aralash sentiment** — `"Ovqat zo'r edi, lekin xizmat dahshatli."`
5. **Kontekstga bog'liq so'zlar** — `"kuchli"` qahva ☕ vs `"kuchli"` hid 🤢
6. **Emoji va sleng** — `"bu 🔥"` = **juda yaxshi** *(yong'in emas!)*

**M5:**

| Biznes | Nima uchun |
|---|---|
| 🎧 **Mijozlarni qo'llab-quvvatlash** | Jahli chiqqan mijozni **darhol** aniqlash → tezroq javob |
| 🛒 **Onlayn do'kon** | Minglab sharhni **qo'lda o'qib bo'lmaydi** |
| 📱 **Ijtimoiy tarmoq** | Brend haqida **real vaqtda** fikr |

</details>

---

## 🧠 O'zini tekshirish savollari

1. Sentiment tahlili nima?
2. Uchta sentiment turi qaysi?
3. Ijobiy sentiment ta'rifi?
4. Neytral sentimentga misol keltiring.
5. Sentiment — mavzumi yoki hissiyot?
6. Sentiment tahlilining 3 ta cheklovini ayting.

<details>
<summary>✅ Javoblar</summary>

1. Matnning **asosiy hissiy ohangini** *(ijobiy/salbiy/neytral)* aniqlash usuli.
2. **Ijobiy**, **salbiy**, **neytral**.
3. Biror narsani **yoqtirish**, **zavqlanish** yoki boshqa **ijobiy hissiyot** ifodasi.
4. `"It was raining"` — **fakt**, hech qanday hissiyot yo'q.
5. ## **HISSIYOT!** Bir mavzu haqida uchala sentiment ham bo'lishi mumkin.
6. **Kinoya**, **inkor**, **kontekst**, **solishtirish**, **madaniyat** *(istalgan 3 tasi)*.

</details>

---

## 📌 Xulosa

```
SENTIMENT TAHLILI
= matnning HISSIY OHANGINI aniqlash


      😀 IJOBIY            😐 NEYTRAL           😞 SALBIY
   yoqtirish, zavq       fakt, hissiyot        yomon his,
   "calm and relaxed"    yo'q                  "bad", "sick"
                         "It was raining"


🔑 SENTIMENT — MAVZU EMAS, HISSIYOT
   "Urush tugadi! Quvonch!"      →  😀
   "Urush boshlandi. Dahshat."   →  😞
   "Urush 1939-da boshlangan."   →  😐


IKKI YONDASHUV
┌────────────────────┬────────────────────┐
│ QOIDAGA ASOSLANGAN │    TRANSFORMER     │
│      (2-dars)      │      (3-dars)      │
├────────────────────┼────────────────────┤
│ So'zlar lug'ati    │ Chuqur o'qitilgan  │
│ ⚡ Juda tez         │ 🐢 Sekin           │
│ ~1 MB              │ 250 MB – 1 GB      │
│ ✅ Tushunarli       │ ❌ Qora quti        │
│ ❌ Kontekst yo'q    │ ✅ Kontekst bor     │
│ TextBlob, VADER    │ transformers       │
└────────────────────┴────────────────────┘


⚠️  QIYIN HOLATLAR
  Kinoya · Inkor · Kontekst · Solishtirish · Madaniyat
  → 100% aniqlik BO'LMAYDI (yaxshi model ~85–92%)
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Sentiment tahlili | *sentiment analysis* | Hissiy ohangni aniqlash |
| Ijobiy | *positive* | Yaxshi hissiyot |
| Salbiy | *negative* | Yomon hissiyot |
| Neytral | *neutral* | Hissiyotsiz, fakt |
| Hissiy ohang | *emotional tone* | Matnning kayfiyati |
| Kinoya | *sarcasm* | Teskari ma'no |
| Qutblilik | *polarity* | Sentiment kuchi (−1…+1) |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Qoidaga asoslangan sentiment](02-Rule-Based-Sentiment.md)
