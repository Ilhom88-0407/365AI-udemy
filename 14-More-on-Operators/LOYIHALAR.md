# 🚀 14-modul · Mini-loyihalar

Bu 6 ta loyiha — **mantiqiy fikrlash** mashqi. Ularda `if` **yo'q** (u 15-modulda), lekin **butun mantiq** allaqachon bor.

```
==  !=  >  <  >=  <=          ← solishtirish
and  or  not                  ← mantiqiy
is  is not                    ← ayniyat
```

> 💡 **G'oya:** har bir shartni **alohida o'zgaruvchiga** yozing, keyin ularni birlashtiring. Bu — professional dasturchilar uslubi: mantiq **o'qiladigan** bo'ladi.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | [Kirish nazoratchisi](#loyiha-1--kirish-nazoratchisi) | `==` + `and` | 🟢 |
| 2 | [Chipta narxi](#loyiha-2--chipta-narxi) | `or` + `not` | 🟢 |
| 3 | [Kabisa yili](#loyiha-3--kabisa-yili) | Murakkab shart + qavslar | 🟡 |
| 4 | [Parol kuchi](#loyiha-4--parol-kuchi) | Ko'p shartni birlashtirish | 🟡 |
| 5 | [Chegirma mantig'i](#loyiha-5--chegirma-mantigi) | `bool` ni son sifatida | 🔴 |
| 6 | [Uchburchak tekshiruvi](#loyiha-6--uchburchak-tekshiruvi) | Geometriya + mantiq | 🔴 |

---

## Loyiha 1 · Kirish nazoratchisi

**Vazifa:** login va parolni tekshirib, ruxsat berish yoki bermaslikni aniqlang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== SAQLANGAN MA'LUMOTLAR =====
login = "admin"
parol = "Python2025"

# ===== FOYDALANUVCHI KIRITGANI =====
kiritilgan_login = "admin"
kiritilgan_parol = "Python2025"

# ===== TEKSHIRUVLAR =====
login_ok      = kiritilgan_login == login
parol_ok      = kiritilgan_parol == parol
uzunlik_ok    = len(kiritilgan_parol) >= 8
bosh_harf_ok  = kiritilgan_parol[0] == kiritilgan_parol[0].upper()

kirish = login_ok and parol_ok

# ===== NATIJA =====
print("Login to'g'rimi?     ", login_ok)
print("Parol to'g'rimi?     ", parol_ok)
print("Uzunlik >= 8?        ", uzunlik_ok)
print("Bosh harf katta?     ", bosh_harf_ok)
print("Parol kuchlimi?      ", uzunlik_ok and bosh_harf_ok)
print("-" * 34)
print("KIRISHGA RUXSAT:     ", kirish)
```

**Natija:**

```
Login to'g'rimi?      True
Parol to'g'rimi?      True
Uzunlik >= 8?         True
Bosh harf katta?      True
Parol kuchlimi?       True
----------------------------------
KIRISHGA RUXSAT:      True
```

</details>

### ✏️ O'zgartirish

1. `kiritilgan_parol` ni noto'g'ri qiling — natija qanday?
2. Registr farqi bilan sinang: `"ADMIN"`.
3. Uchinchi shart qo'shing: parolda **raqam** bo'lsin *(ilgak: `parol[-1]` raqammi?)*.
4. `kirish` ni **uchala** shart bilan hisoblang.
5. Login **yoki** email bilan kirishga ruxsat bering.

---

## Loyiha 2 · Chipta narxi

**Vazifa:** yosh va toifaga qarab chipta bepulmi, chegirmalimi yoki to'liq narxdami — aniqlang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
yosh    = 65
talaba  = False
nogiron = False

# ===== MANTIQ =====
bepul     = yosh < 7 or yosh >= 60 or nogiron
chegirma  = talaba and not bepul
toliq     = not bepul and not chegirma

# ===== NATIJA =====
print("Yosh:", yosh, " Talaba:", talaba, " Nogiron:", nogiron)
print("-" * 34)
print("Bepul?          ", bepul)
print("Chegirma (50%)? ", chegirma)
print("To'liq narx?    ", toliq)
```

**Natija:**

```
Yosh: 65  Talaba: False  Nogiron: False
----------------------------------
Bepul?           True
Chegirma (50%)?  False
To'liq narx?     False
```

</details>

### 🔑 Naqsh

Uchala natija **bir-birini istisno qiladi** — faqat bittasi `True`. Buni `not` bilan ta'minladik:

```
bepul     →  o'z sharti
chegirma  →  o'z sharti  AND  not bepul
toliq     →  not bepul  AND  not chegirma
```

### ✏️ O'zgartirish

1. `yosh = 5` qiling — natija qanday?
2. `yosh = 20`, `talaba = True` qiling.
3. `yosh = 30`, hamma `False` — qaysi biri `True` bo'ladi?
4. Yangi toifa qo'shing: **harbiy xizmatchi** (bepul).
5. Uchala natija yig'indisi doim `1` ekanini tekshiring: `bepul + chegirma + toliq == 1`.

---

## Loyiha 3 · Kabisa yili

**Vazifa:** yil kabisa yilmi? Qoida ko'rinishidan oddiy, aslida **tuzoqli**.

> **Qoida:** yil `4` ga bo'linsa — kabisa. **LEKIN** `100` ga bo'linsa — kabisa **emas**. **LEKIN** `400` ga bo'linsa — **baribir** kabisa.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOT =====
yil = 2024

# ===== BOSQICHMA-BOSQICH =====
b4   = yil % 4   == 0
b100 = yil % 100 == 0
b400 = yil % 400 == 0

kabisa = b4 and (not b100 or b400)

# ===== NATIJA =====
print("Yil:", yil)
print("4 ga bo'linadi?  ", b4)
print("100 ga bo'linadi?", b100)
print("400 ga bo'linadi?", b400)
print("-" * 34)
print("KABISA YILIMI?   ", kabisa)
print("Fevral kunlari:  ", 28 + kabisa)
```

**Natija:**

```
Yil: 2024
4 ga bo'linadi?   True
100 ga bo'linadi? False
400 ga bo'linadi? False
----------------------------------
KABISA YILIMI?    True
Fevral kunlari:   29
```

</details>

### 🔑 Ikkita hiyla

**1 · Qavs SHART.** `and` `or` dan muhimroq bo'lgani uchun:

```python
b4 and (not b100 or b400)     # ✅ TO'G'RI
b4 and not b100 or b400       # ❌ NOTO'G'RI — 2000 uchun ham "True", lekin 1900 uchun ham!
```

**2 · `28 + kabisa`.** Python'da `True = 1`, `False = 0`. Shuning uchun `28 + True` = `29`.

### ✏️ O'zgartirish

1. `yil = 1900` qiling — kabisa emasligini tekshiring.
2. `yil = 2000` qiling — kabisa ekanini tekshiring.
3. Qavsni **olib tashlang** va `1900` bilan sinang. Nima o'zgardi?
4. Yildagi kunlar sonini hisoblang: `365 + kabisa`.
5. `2023`, `2024`, `2025`, `2100` — to'rttasini ham sinang.

<details>
<summary>💡 Qavssiz variant nima uchun noto'g'ri</summary>

```python
yil = 1900
b4, b100, b400 = yil%4==0, yil%100==0, yil%400==0

print(b4 and (not b100 or b400))     # False  ← TO'G'RI
print(b4 and not b100 or b400)       # False  ← bu holda tasodifan to'g'ri

yil = 2100
b4, b100, b400 = yil%4==0, yil%100==0, yil%400==0
print(b4 and (not b100 or b400))     # False  ← TO'G'RI
print(b4 and not b100 or b400)       # False
```

Farq boshqacha yozilishda chiqadi — shuning uchun **qavsga ishoning**, tasodifga emas.

</details>

---

## Loyiha 4 · Parol kuchi

**Vazifa:** parolni bir necha mezon bo'yicha baholang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOT =====
p = "Uzbek2025!"

# ===== MEZONLAR =====
uzun        = len(p) >= 8
juda_uzun   = len(p) >= 12
katta_harf  = p[0] == p[0].upper()
belgi       = p[-1] == "!" or p[-1] == "?" or p[-1] == "#"

# ===== BAHOLASH =====
kuchli = uzun and katta_harf and belgi
zaif   = not uzun or not katta_harf

# ===== NATIJA =====
print("Parol:", p, " (uzunlik:", len(p), ")")
print("-" * 34)
print("Uzunlik >= 8?    ", uzun)
print("Uzunlik >= 12?   ", juda_uzun)
print("Bosh harf katta? ", katta_harf)
print("Maxsus belgi?    ", belgi)
print("-" * 34)
print("KUCHLI?          ", kuchli)
print("ZAIF?            ", zaif)
```

**Natija:**

```
Parol: Uzbek2025!  (uzunlik: 10 )
----------------------------------
Uzunlik >= 8?     True
Uzunlik >= 12?    False
Bosh harf katta?  True
Maxsus belgi?     True
----------------------------------
KUCHLI?           True
ZAIF?             False
```

</details>

### ✏️ O'zgartirish

1. `p = "abc"` qiling — `zaif` `True` bo'ladimi?
2. `p = "SuperMaxfiyParol2025!"` bilan sinang.
3. **Ball tizimi** qo'shing: `ball = uzun + juda_uzun + katta_harf + belgi` (0 dan 4 gacha).
4. `o_rta` darajani qo'shing: kuchli **emas**, lekin zaif ham **emas**.
5. Yangi mezon: parolning **ikkinchi** belgisi ham katta harf bo'lmasin.

---

## Loyiha 5 · Chegirma mantig'i

**Vazifa:** murakkab chegirma qoidalarini mantiqiy operatorlar bilan yozing.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
summa         = 1500000
doimiy_mijoz  = True
bayram        = False

# ===== QOIDALAR =====
chegirma_15  = summa > 1000000 and doimiy_mijoz
chegirma_10  = summa > 1000000 or doimiy_mijoz or bayram
hech_narsa   = not chegirma_10

# ===== NATIJA =====
print("Summa:", summa, " Doimiy:", doimiy_mijoz, " Bayram:", bayram)
print("-" * 40)
print("15% chegirma (summa>1M VA doimiy)?  ", chegirma_15)
print("10% chegirma (kamida bittasi)?      ", chegirma_10)
print("Chegirma yo'q?                      ", hech_narsa)
print("-" * 40)

# ===== bool NI SON SIFATIDA =====
foiz = 15 * chegirma_15 + 10 * (chegirma_10 and not chegirma_15)
print("Chegirma foizi:", foiz, "%")
print("To'lov:        ", summa - summa * foiz / 100)
```

**Natija:**

```
Summa: 1500000  Doimiy: True  Bayram: False
----------------------------------------
15% chegirma (summa>1M VA doimiy)?   True
10% chegirma (kamida bittasi)?       True
Chegirma yo'q?                       False
----------------------------------------
Chegirma foizi: 15 %
To'lov:         1275000.0
```

</details>

### 🔑 Eng qiziq qator

```python
foiz = 15 * chegirma_15 + 10 * (chegirma_10 and not chegirma_15)
```

`True = 1`, `False = 0` bo'lgani uchun:
- `chegirma_15` `True` → `15 * 1 = 15`, ikkinchi qism `10 * 0 = 0` → **jami 15**
- Faqat `chegirma_10` → `15 * 0 = 0`, `10 * 1 = 10` → **jami 10**
- Hech biri → **0**

> ⚠️ Bu — **chiroyli hiyla**, lekin haqiqiy kodda `if/elif` **o'qish osonroq**. Buni 15-modulda ko'rasiz.

### ✏️ O'zgartirish

1. `summa = 500000`, `doimiy_mijoz = False` qiling.
2. `bayram = True` qiling — qaysi chegirma ishlaydi?
3. **20% chegirma** qo'shing: summa `> 5 000 000` **va** doimiy **va** bayram.
4. Chegirma summasini alohida chiqaring.
5. Barcha 8 ta kombinatsiyani sinab ko'ring (`2 × 2 × 2`).

---

## Loyiha 6 · Uchburchak tekshiruvi

**Vazifa:** uch tomon berilgan. Uchburchak hosil bo'ladimi? Qaysi turdagi?

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
a, b, c = 3, 4, 5

# ===== TEKSHIRUVLAR =====
mavjud        = a + b > c and a + c > b and b + c > a
teng_tomonli  = a == b and b == c
teng_yonli    = a == b or b == c or a == c
turli         = not teng_yonli
tugri = a**2 + b**2 == c**2 or a**2 + c**2 == b**2 or b**2 + c**2 == a**2

# ===== NATIJA =====
print("Tomonlar:", a, b, c)
print("-" * 34)
print("Uchburchak mavjudmi?", mavjud)
print("Teng tomonli?       ", teng_yonli and teng_tomonli)
print("Teng yonli?         ", teng_yonli)
print("Turli tomonli?      ", turli)
print("To'g'ri burchakli?  ", tugri)
```

**Natija:**

```
Tomonlar: 3 4 5
----------------------------------
Uchburchak mavjudmi? True
Teng tomonli?        False
Teng yonli?          False
Turli tomonli?       True
To'g'ri burchakli?   True
```

</details>

### 🔑 Uchburchak tengsizligi

Uchburchak **mavjud bo'lishi** uchun **har ikki tomon yig'indisi** uchinchisidan katta bo'lishi shart:

```
a + b > c   AND   a + c > b   AND   b + c > a
```

Bitta ham buzilsa — uchburchak **yo'q**.

### ✏️ O'zgartirish

1. `a, b, c = 1, 2, 10` qiling — `mavjud` nima beradi?
2. `a, b, c = 5, 5, 5` — teng tomonlimi?
3. `a, b, c = 5, 5, 8` — teng yonlimi?
4. `a, b, c = 6, 8, 10` — to'g'ri burchaklimi?
5. **Perimetr** va **yuzani** qo'shing *(Geron formulasi: `s=(a+b+c)/2`, `S = (s*(s-a)*(s-b)*(s-c)) ** 0.5`)*.

---

## 🏆 Yakuniy loyiha · O'z mantiqiy tizimingiz

```
☐ Kamida 8 ta o'zgaruvchi
☐ Kamida 5 xil solishtirish operatori (==, !=, >, <, >=, <=)
☐ and, or va not — uchalasi ham
☐ Kamida 1 ta QAVS bilan tartibni o'zgartirish
☐ Har bir shart ALOHIDA o'zgaruvchida
☐ Har bir bo'limga izoh
☐ Chiroyli formatlangan natija
```

### G'oyalar

| Loyiha | Qanday mantiq |
|---|---|
| **Universitetga qabul** | Ball, imtiyoz, kvota |
| **Kredit tasdiqlash** | Daromad, yosh, ish staji, kredit tarixi |
| **O'yin qoidalari** | Sog'liq, energiya, qurol, daraja |
| **Yo'l harakati** | Chiroq rangi, piyoda, tezlik |
| **Restoran buyurtmasi** | Vegetarian, allergiya, budjet |
| **Ish vaqti** | Kun, soat, bayram, navbatchilik |

### Shablon

```python
# ===============================================
#   TIZIM NOMI
#   Muallif: ______
# ===============================================

# ===== 1 · KIRISH MA'LUMOTLARI =====


# ===== 2 · ALOHIDA SHARTLAR =====
shart_1 = ...
shart_2 = ...
shart_3 = ...

# ===== 3 · MANTIQNI BIRLASHTIRISH =====
natija = ...

# ===== 4 · CHIQISH =====
print("=" * 40)

print("=" * 40)
```

---

## ✅ O'zingizni tekshiring

```
☐ Kod xatosiz ishladimi?
☐ and, or, not — uchalasini ham ishlatdimmi?
☐ Muhimlik tartibini (not→and→or) hisobga oldimmi?
☐ Kerak joyda QAVS qo'ydimmi?
☐ Har bir shartga ma'noli NOM berdimmi?
☐ Barcha kombinatsiyalarni sinab ko'rdimmi?
☐ "O'zgartirish" vazifalarini bajardimmi?
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
