# 🚀 12-modul · Mini-loyihalar

Bu yerdagi **6 ta loyiha** faqat shu modulda o'rganilgan narsalardan foydalanadi:

```
o'zgaruvchilar · int · float · bool · str
type() · int() · float() · str() · round()
print() · plyus · vergul · escape belgilari
```

**Shartlar ham, sikllar ham, funksiyalar ham YO'Q** — ular keyingi modullarda.

> 💡 **Qanday ishlash kerak:** avval **o'zingiz** yozishga urinib ko'ring, keyin yechimni oching va **solishtiring**. Oxirida **"O'zgartirish"** bo'limidagi vazifalarni bajaring.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | [Vizitka](#loyiha-1--vizitka) | Satrlar, `print`, formatlash | 🟢 |
| 2 | [Do'kon cheki](#loyiha-2--dokon-cheki) | `float`, hisob, `str()` | 🟢 |
| 3 | [Harorat konvertori](#loyiha-3--harorat-konvertori) | Formulalar, `float` | 🟢 |
| 4 | [BMI kalkulyator](#loyiha-4--bmi-kalkulyator) | `round()`, hisob | 🟡 |
| 5 | [Sayohat budjeti](#loyiha-5--sayohat-budjeti) | Ko'p o'zgaruvchi, bo'lish | 🟡 |
| 6 | [Ism formatlovchi](#loyiha-6--ism-formatlovchi) | Satr metodlari, indekslar | 🔴 |

---

## Loyiha 1 · Vizitka

**Vazifa:** o'zingiz haqingizda ma'lumotni chiroyli ramkada chop etadigan dastur yozing.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
ism = "Ilhom"
familiya = "Islomov"
lavozim = "AI Engineer"
kompaniya = "365 Data Science"
email = "ilhom@example.com"
telefon = "+998 90 123 45 67"

# ===== CHOP ETISH =====
print("=" * 40)
print("  " + ism + " " + familiya)
print("  " + lavozim)
print("  " + kompaniya)
print("-" * 40)
print("  Email:   " + email)
print("  Telefon: " + telefon)
print("=" * 40)
```

**Natija:**

```
========================================
  Ilhom Islomov
  AI Engineer
  365 Data Science
----------------------------------------
  Email:   ilhom@example.com
  Telefon: +998 90 123 45 67
========================================
```

</details>

### 🔑 Yangi hiyla

```python
"=" * 40
```

Satrni songa **ko'paytirish** — uni **40 marta takrorlaydi**. Bu — 11-modulning 4-darsidagi `x * 2` bilan bir xil mantiq.

### ✏️ O'zgartirish

1. Ramkani `*` belgisi bilan chizing.
2. Kenglikni 50 ga oshiring.
3. `veb_sayt` maydonini qo'shing.
4. Ismni **katta harflar** bilan chiqaring *(ilgak: `.upper()`)*.

---

## Loyiha 2 · Do'kon cheki

**Vazifa:** 3 ta mahsulot uchun QQS bilan chek chiqaring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MAHSULOTLAR =====
mahsulot_1 = "Noutbuk";    narx_1 = 8500000.0;  soni_1 = 1
mahsulot_2 = "Sichqoncha"; narx_2 = 150000.0;   soni_2 = 2
mahsulot_3 = "Klaviatura"; narx_3 = 410000.0;   soni_3 = 1

# ===== HISOB =====
jami_1 = narx_1 * soni_1
jami_2 = narx_2 * soni_2
jami_3 = narx_3 * soni_3

oraliq = jami_1 + jami_2 + jami_3
qqs = oraliq * 0.12
umumiy = oraliq + qqs

# ===== CHEK =====
print("=" * 46)
print("           TEXNO-MARKET  CHEK")
print("=" * 46)
print(mahsulot_1 + "  x" + str(soni_1) + "   " + str(jami_1) + " so'm")
print(mahsulot_2 + "  x" + str(soni_2) + "   " + str(jami_2) + " so'm")
print(mahsulot_3 + "  x" + str(soni_3) + "   " + str(jami_3) + " so'm")
print("-" * 46)
print("Oraliq jami:  " + str(oraliq) + " so'm")
print("QQS (12%):    " + str(qqs) + " so'm")
print("UMUMIY:       " + str(umumiy) + " so'm")
print("=" * 46)
```

**Natija:**

```
==============================================
           TEXNO-MARKET  CHEK
==============================================
Noutbuk  x1   8500000.0 so'm
Sichqoncha  x2   300000.0 so'm
Klaviatura  x1   410000.0 so'm
----------------------------------------------
Oraliq jami:  9210000.0 so'm
QQS (12%):    1105200.0 so'm
UMUMIY:       10315200.0 so'm
==============================================
```

</details>

### ⚠️ Diqqat

`str()` **shart** — chunki `jami_1` bu **float**, uni satr bilan **plyus** orqali qo'shib bo'lmaydi. *(4-darsdagi `TypeError` ni eslang.)*

### ✏️ O'zgartirish

1. Ustunlarni **tekislang** *(ilgak: har bir nomdan keyin `" " * (12 - len(nom))`)*.
2. `.0` yo'qolsin — `int()` yoki `round()` qo'llang.
3. To'rtinchi mahsulot qo'shing.
4. QQS ni 15% ga o'zgartiring.
5. Chegirma qo'shing: `chegirma = oraliq * 0.05`.

---

## Loyiha 3 · Harorat konvertori

**Vazifa:** Selsiyni Farengeyt va Kelvinga aylantiring.

<details>
<summary>💻 Yechim</summary>

```python
selsiy = 25.0

farengeyt = selsiy * 9 / 5 + 32
kelvin = selsiy + 273.15

print("Selsiy:     " + str(selsiy) + " C")
print("Farengeyt:  " + str(farengeyt) + " F")
print("Kelvin:     " + str(kelvin) + " K")
```

**Natija:**

```
Selsiy:     25.0 C
Farengeyt:  77.0 F
Kelvin:     298.15 K
```

</details>

### ✏️ O'zgartirish

1. Teskari konvertor yozing: Farengeytdan Selsiyga.
2. Natijalarni **1 kasr** bilan yaxlitlang *(`round(x, 1)`)*.
3. Uchta shaharning haroratini bir vaqtda ko'rsating.
4. Suv muzlash (`0 C`) va qaynash (`100 C`) nuqtalarini tekshiring — Farengeytda `32` va `212` chiqishi kerak.

---

## Loyiha 4 · BMI kalkulyator

**Vazifa:** tana massasi indeksini hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
ism = "Dilnoza"
ogirlik = 62.5      # kg
boy = 1.68          # metr

bmi = ogirlik / (boy * boy)
bmi_yaxlit = round(bmi, 1)

print(ism + " uchun hisob:")
print("  Og'irlik: " + str(ogirlik) + " kg")
print("  Bo'y:     " + str(boy) + " m")
print("  BMI:      " + str(bmi_yaxlit))
print("  Norma oralig'i: 18.5 - 24.9")
```

**Natija:**

```
Dilnoza uchun hisob:
  Og'irlik: 62.5 kg
  Bo'y:     1.68 m
  BMI:      22.1
  Norma oralig'i: 18.5 - 24.9
```

</details>

### 🔑 Yangi funksiya

```python
round(bmi, 1)     # 1 kasrgacha yaxlitlaydi
round(bmi)        # butun songacha
```

`round()` va `int()` **farqini eslang** *(3-darsdagi M8 mashqi)*.

### ✏️ O'zgartirish

1. `boy * boy` o'rniga `boy ** 2` yozing *(daraja belgisi)*.
2. Ideal og'irlikni hisoblang: `22 * boy ** 2`.
3. Normadan farqni chiqaring.
4. Uch kishi uchun hisoblang.

---

## Loyiha 5 · Sayohat budjeti

**Vazifa:** sayohat xarajatlarini rejalashtiring.

<details>
<summary>💻 Yechim</summary>

```python
shahar = "Samarqand"
kunlar = 3

mehmonxona_kun = 350000.0
ovqat_kun = 120000.0
yol = 180000.0

mehmonxona = mehmonxona_kun * kunlar
ovqat = ovqat_kun * kunlar
jami = mehmonxona + ovqat + yol
bir_kunga = jami / kunlar

print(shahar + " ga " + str(kunlar) + " kunlik sayohat")
print("-" * 34)
print("Mehmonxona:  " + str(mehmonxona) + " so'm")
print("Ovqat:       " + str(ovqat) + " so'm")
print("Yo'l:        " + str(yol) + " so'm")
print("-" * 34)
print("JAMI:        " + str(jami) + " so'm")
print("Kuniga:      " + str(round(bir_kunga)) + " so'm")
```

**Natija:**

```
Samarqand ga 3 kunlik sayohat
----------------------------------
Mehmonxona:  1050000.0 so'm
Ovqat:       360000.0 so'm
Yo'l:        180000.0 so'm
----------------------------------
JAMI:        1590000.0 so'm
Kuniga:      530000 so'm
```

</details>

### ✏️ O'zgartirish

1. Ikki kishi uchun hisoblang *(yo'l — har biriga alohida)*.
2. Ko'ngilochar xarajat qo'shing.
3. `budjet = 2000000` yarating va **qolgan pulni** hisoblang.
4. Har bir xarajatning **foizini** chiqaring: `mehmonxona / jami * 100`.
5. Kunlar sonini 7 ga o'zgartiring — kuniga xarajat qanday o'zgardi?

---

## Loyiha 6 · Ism formatlovchi

**Vazifa:** tartibsiz yozilgan ismdan turli formatlar yasang.

<details>
<summary>💻 Yechim</summary>

```python
xom_ism = "ilhom"
xom_familiya = "islomov"

toliq = xom_ism.capitalize() + " " + xom_familiya.upper()
bosh_harflar = xom_ism[0].upper() + "." + xom_familiya[0].upper() + "."
login = xom_ism.lower() + "_" + xom_familiya.lower()

print("Xom ma'lumot:  " + xom_ism + " " + xom_familiya)
print("To'liq ism:    " + toliq)
print("Bosh harflar:  " + bosh_harflar)
print("Login:         " + login)
print("Email:         " + login + "@company.uz")
```

**Natija:**

```
Xom ma'lumot:  ilhom islomov
To'liq ism:    Ilhom ISLOMOV
Bosh harflar:  I.I.
Login:         ilhom_islomov
Email:         ilhom_islomov@company.uz
```

</details>

### 🔑 Yangi tushunchalar

| Kod | Nima qiladi |
|---|---|
| `.upper()` | Hamma harfni **katta** qiladi |
| `.lower()` | Hamma harfni **kichik** qiladi |
| `.capitalize()` | Faqat **birinchi** harfni katta qiladi |
| `xom_ism[0]` | **Birinchi** belgini oladi (indeks **0 dan** boshlanadi!) |

> ⚠️ **Diqqat:** `[0]` — bu **indekslash**. Uni **17-modulda** (Ketma-ketliklar) chuqur o'rganamiz. Hozircha shuni bilib qo'ying: **Python'da sanash 0 dan boshlanadi**.

### ✏️ O'zgartirish

1. Otasining ismini qo'shing va `I.I.O.` formatini yasang.
2. Familiyaning **oxirgi** harfini oling *(ilgak: `[-1]`)*.
3. `Islomov I.` formatini yasang.
4. Login uchun **nuqta** ishlating: `ilhom.islomov`.
5. Ism uzunligini chiqaring *(ilgak: `len()`)*.

---

## 🏆 Yakuniy loyiha · O'z dasturingiz

Endi **o'zingiz** loyiha o'ylab toping. Shartlar:

```
☐ Kamida 8 ta o'zgaruvchi
☐ Kamida 3 xil ma'lumot turi (int, float, str, bool)
☐ Kamida 2 ta hisob-kitob
☐ str() yoki vergul bilan formatlangan chiqish
☐ Chiroyli ramka yoki ajratgich chiziqlar
☐ Kamida 6 qatorlik natija
```

### G'oyalar

| Loyiha | Nima hisoblanadi |
|---|---|
| **Talaba reyting kartochkasi** | 5 fan bahosi, o'rtacha, foiz |
| **Avtomobil xarajati** | Yoqilg'i, masofa, 100 km ga sarf |
| **Kafe buyurtmasi** | Taomlar, xizmat haqi, umumiy |
| **Kredit kalkulyatori** | Summa, foiz, oylik to'lov |
| **Fitnes hisoboti** | Qadamlar, kaloriya, masofa |
| **Kitob o'qish rejasi** | Sahifalar, kunlar, kuniga necha sahifa |

### Shablon

```python
# ===== 1 · MA'LUMOTLAR =====
# (o'zgaruvchilar bu yerda)


# ===== 2 · HISOB-KITOB =====
# (formulalar bu yerda)


# ===== 3 · NATIJA =====
print("=" * 40)
# (chop etish bu yerda)
print("=" * 40)
```

---

## ✅ O'zingizni tekshiring

Har bir loyihadan keyin:

```
☐ Kod xatosiz ishladimi?
☐ Natija KUTGANIMDEK chiqdimi?
☐ Barcha o'zgaruvchi nomlari MA'NOLI mi?
   (10-modulning 1-darsidagi "kod uslubi")
☐ 6 oydan keyin bu kodni tushuna olamanmi?
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
