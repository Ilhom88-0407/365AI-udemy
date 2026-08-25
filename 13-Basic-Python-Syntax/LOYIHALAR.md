# 🚀 13-modul · Mini-loyihalar

Bu yerdagi **6 ta loyiha** 12 va 13-modulda o'rganilgan narsalardan foydalanadi:

```
o'zgaruvchilar · int · float · bool · str
+  -  *  /  //  %  **       ← YANGI
==  (tekshirish)            ← YANGI
indekslash [ ]              ← YANGI
izohlar #                   ← YANGI
qator davomi \              ← YANGI
```

**Shartlar (`if`) va sikllar (`for`) hali YO'Q** — ular 15 va 18-modullarda.

---

## 📋 Loyihalar ro'yxati

| № | Loyiha | Nimani mashq qiladi | Qiyinlik |
|---|---|---|---|
| 1 | [Kalkulyator](#loyiha-1--kalkulyator) | Barcha 7 ta arifmetik operator | 🟢 |
| 2 | [Chegirma hisoblagichi](#loyiha-2--chegirma-hisoblagichi) | Foiz, `==` tekshiruv | 🟢 |
| 3 | [Vaqt konvertori](#loyiha-3--vaqt-konvertori) | `//` va `%` birgalikda | 🟡 |
| 4 | [Parol tekshiruvchi](#loyiha-4--parol-tekshiruvchi) | `==`, `len()`, indekslash | 🟡 |
| 5 | [Matn tahlilchisi](#loyiha-5--matn-tahlilchisi) | Musbat va manfiy indekslar | 🟡 |
| 6 | [Geometriya hisoblagichi](#loyiha-6--geometriya-hisoblagichi) | `**` daraja, formulalar | 🔴 |

---

## Loyiha 1 · Kalkulyator

**Vazifa:** ikkita son ustida **barcha 7 ta amalni** bajarib ko'rsating.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
a = 47
b = 5

# ===== NATIJA =====
print("a =", a, "  b =", b)
print("-" * 38)
print("Qo'shish:        ", a, "+", b, "=", a + b)
print("Ayirish:         ", a, "-", b, "=", a - b)
print("Ko'paytirish:    ", a, "*", b, "=", a * b)
print("Bo'lish:         ", a, "/", b, "=", a / b)
print("Butun bo'lish:   ", a, "//", b, "=", a // b)
print("Qoldiq:          ", a, "%", b, "=", a % b)
print("Daraja:          ", a, "**", b, "=", a ** b)
```

**Natija:**

```
a = 47   b = 5
--------------------------------------
Qo'shish:         47 + 5 = 52
Ayirish:          47 - 5 = 42
Ko'paytirish:     47 * 5 = 235
Bo'lish:          47 / 5 = 9.4
Butun bo'lish:    47 // 5 = 9
Qoldiq:           47 % 5 = 2
Daraja:           47 ** 5 = 229345007
```

</details>

### ✏️ O'zgartirish

1. `a` va `b` ni o'zgartiring — kod ishlaydimi?
2. `b = 0` qo'ying. Nima bo'ladi? *(Ilgak: `ZeroDivisionError`)*
3. Bo'linish formulasini tekshiring: `a // b * b + a % b == a`
4. Kasr sonlar bilan sinang: `a = 47.5`

---

## Loyiha 2 · Chegirma hisoblagichi

**Vazifa:** chegirmani hisoblab, tekshiring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
mahsulot = "Noutbuk"
asl_narx = 8500000
chegirma_foiz = 15

# ===== HISOB =====
chegirma_summa = asl_narx * chegirma_foiz / 100
yangi_narx = asl_narx - chegirma_summa
tejaldi_foiz = chegirma_summa / asl_narx * 100    # teskari tekshiruv

# ===== NATIJA =====
print(mahsulot)
print("-" * 34)
print("Asl narx:      ", asl_narx, "so'm")
print("Chegirma:      ", chegirma_foiz, "%")
print("Chegirma summa:", chegirma_summa, "so'm")
print("YANGI NARX:    ", yangi_narx, "so'm")
print("Tekshiruv:     ", tejaldi_foiz == chegirma_foiz)
```

**Natija:**

```
Noutbuk
----------------------------------
Asl narx:       8500000 so'm
Chegirma:       15 %
Chegirma summa: 1275000.0 so'm
YANGI NARX:     7225000.0 so'm
Tekshiruv:      True
```

</details>

### 🔑 Yangi hiyla

Oxirgi qatorda **teskari tekshiruv** bor: hisobni **orqaga** qaytarib, boshlang'ich qiymat bilan `==` orqali solishtiramiz. Bu — **haqiqiy dasturchilar** usuli.

### ✏️ O'zgartirish

1. Chegirmani 30% ga oshiring.
2. **Ikkinchi chegirma** qo'shing (yangi narxdan yana 10%).
3. Ikki chegirma **birgalikda** necha foiz ekanini hisoblang. `25%` chiqadimi?
4. Natijani butun songa yaxlitlang.

---

## Loyiha 3 · Vaqt konvertori

**Vazifa:** sekundni kun, soat, daqiqa va sekundga ayiring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOT =====
jami_sekund = 100000

# ===== HISOB =====
kun = jami_sekund // 86400          # 1 kun = 86400 sekund
qoldiq = jami_sekund % 86400

soat = qoldiq // 3600               # 1 soat = 3600 sekund
qoldiq = qoldiq % 3600

daqiqa = qoldiq // 60               # 1 daqiqa = 60 sekund
sekund = qoldiq % 60

# ===== NATIJA =====
print(jami_sekund, "sekund =")
print(" ", kun, "kun", soat, "soat", daqiqa, "daqiqa", sekund, "sekund")

# ===== TEKSHIRUV =====
tekshiruv = kun * 86400 + soat * 3600 + daqiqa * 60 + sekund
print("Tekshiruv:", tekshiruv == jami_sekund)
```

**Natija:**

```
100000 sekund =
  1 kun 3 soat 46 daqiqa 40 sekund
Tekshiruv: True
```

</details>

### 🔑 Naqsh

Bu — **`//` va `%` ning klassik juftligi**:

```
qiymat // birlik   →  nechta to'liq birlik bor
qiymat %  birlik   →  qancha qoldi (keyingi bosqichga)
```

### ✏️ O'zgartirish

1. `jami_sekund` ni 1 000 000 ga oshiring.
2. **Hafta** qo'shing (1 hafta = 604800 sekund).
3. Teskari konvertor yozing: kun+soat+daqiqa → jami sekund.
4. **Baytdan gigabaytgacha** xuddi shu naqsh bilan konvertor yozing (1 KB = 1024 B).

---

## Loyiha 4 · Parol tekshiruvchi

**Vazifa:** parolni bir necha mezon bo'yicha tekshiring.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
togri_parol = "Python2025"
kiritilgan = "Python2025"

# ===== TEKSHIRUVLAR =====
uzunlik_ok = len(kiritilgan) == 10
parol_ok = kiritilgan == togri_parol
birinchi_harf = kiritilgan[0]
oxirgi_belgi = kiritilgan[-1]

# ===== NATIJA =====
print("Kiritilgan parol:", kiritilgan)
print("-" * 34)
print("Uzunlik 10 ta?     ", uzunlik_ok)
print("Parol to'g'rimi?   ", parol_ok)
print("Birinchi belgi:    ", birinchi_harf)
print("Oxirgi belgi:      ", oxirgi_belgi)
print("Bosh harf katta?   ", birinchi_harf == birinchi_harf.upper())
```

**Natija:**

```
Kiritilgan parol: Python2025
----------------------------------
Uzunlik 10 ta?      True
Parol to'g'rimi?    True
Birinchi belgi:     P
Oxirgi belgi:       5
Bosh harf katta?    True
```

</details>

### ✏️ O'zgartirish

1. `kiritilgan` ni **noto'g'ri** parolga o'zgartiring — natija qanday?
2. Faqat **registr** farqi bilan sinang: `"python2025"`. Nima bo'ladi?
3. Uzunlik shartini `>= 8` qiling — *(bu **14-modulda**, hozircha `==` bilan cheklaning)*.
4. **Ikkinchi va uchinchi** belgilarni ham chiqaring.
5. Parolning **o'rtadagi** belgisini toping.

---

## Loyiha 5 · Matn tahlilchisi

**Vazifa:** so'zni indekslar orqali tahlil qiling.

<details>
<summary>💻 Yechim</summary>

```python
matn = "Dasturlash"

print("Matn:", matn)
print("-" * 34)
print("Uzunligi:        ", len(matn))
print("1-belgi  [0]:    ", matn[0])
print("3-belgi  [2]:    ", matn[2])
print("Oxirgi   [-1]:   ", matn[-1])
print("Oxirgidan 2 [-2]:", matn[-2])
print("O'rtadagi belgi: ", matn[len(matn) // 2])
print("Birinchi = oxirgi?", matn[0] == matn[-1])
```

**Natija:**

```
Matn: Dasturlash
----------------------------------
Uzunligi:         10
1-belgi  [0]:     D
3-belgi  [2]:     s
Oxirgi   [-1]:    h
Oxirgidan 2 [-2]: s
O'rtadagi belgi:  r
Birinchi = oxirgi? False
```

</details>

### ✏️ O'zgartirish

1. `matn` ni `"level"` ga o'zgartiring. Oxirgi tekshiruv `True` chiqadimi?
2. **Ikkinchi va oxirgidan ikkinchi** belgilarni solishtiring.
3. Faqat indekslash bilan `"Dur"` so'zini yig'ing.
4. So'zning **birinchi yarmidagi oxirgi** belgini toping.
5. `matn` ni **teskari o'qish** mumkinmi? *(Ilgak: `matn[::-1]` — bu **17-modulda**)*

---

## Loyiha 6 · Geometriya hisoblagichi

**Vazifa:** `**` operatori bilan geometrik formulalarni hisoblang.

<details>
<summary>💻 Yechim</summary>

```python
# ===== MA'LUMOTLAR =====
tomon = 4
radius = 3.0
pi = 3.14159

# ===== HISOB =====
kvadrat_yuzi = tomon ** 2
kub_hajmi = tomon ** 3
doira_yuzi = pi * radius ** 2
shar_hajmi = 4 / 3 * pi * radius ** 3

# ===== NATIJA =====
print("Kvadrat (tomon =", tomon, ")")
print("  Yuzi:  ", kvadrat_yuzi)
print("Kub (qirra =", tomon, ")")
print("  Hajmi: ", kub_hajmi)
print("Doira (radius =", radius, ")")
print("  Yuzi:  ", round(doira_yuzi, 2))
print("Shar (radius =", radius, ")")
print("  Hajmi: ", round(shar_hajmi, 2))
```

**Natija:**

```
Kvadrat (tomon = 4 )
  Yuzi:   16
Kub (qirra = 4 )
  Hajmi:  64
Doira (radius = 3.0 )
  Yuzi:   28.27
Shar (radius = 3.0 )
  Hajmi:  113.1
```

</details>

### ✏️ O'zgartirish

1. **To'g'ri to'rtburchak** yuzi va perimetrini qo'shing.
2. **Silindr** hajmini hisoblang: `pi * r² * h`.
3. **Kvadrat ildizni** `** 0.5` bilan hisoblang: `81` ning ildizi.
4. Uzun formulani `\` yoki qavslar bilan **ikki qatorga** bo'ling.
5. Barcha formulalarga **izoh** qo'shing.

---

## 🏆 Yakuniy loyiha · O'z dasturingiz

```
☐ Kamida 10 ta o'zgaruvchi
☐ Kamida 5 xil arifmetik operator (+, -, *, /, //, %, **)
☐ Kamida 1 ta `==` tekshiruv
☐ Kamida 1 ta indekslash [ ]
☐ Har bir bo'limga izoh (#)
☐ Kamida 1 ta uzun qatorni \ yoki qavs bilan bo'lish
☐ Chiroyli formatlangan natija
```

### G'oyalar

| Loyiha | Nima hisoblanadi |
|---|---|
| **Do'kon inventari** | Mahsulotlar, umumiy qiymat, o'rtacha narx |
| **Avtomobil xarajati** | 100 km ga yoqilg'i, oylik xarajat |
| **Kredit kalkulyatori** | Oylik to'lov, umumiy foiz |
| **Fayl hajmi konvertori** | Bayt → KB → MB → GB (`//` va `%`) |
| **Sana tahlili** | Kunlar, haftalar, oylar |
| **Reyting hisoblagichi** | Ballar, foizlar, o'rtacha |

### Shablon

```python
# ===============================================
#   LOYIHA NOMI
#   Muallif: ______
# ===============================================

# ===== 1 · MA'LUMOTLAR =====


# ===== 2 · HISOB-KITOB =====


# ===== 3 · TEKSHIRUV =====
# (== bilan natijani tasdiqlang)


# ===== 4 · NATIJA =====
print("=" * 40)

print("=" * 40)
```

---

## ✅ O'zingizni tekshiring

```
☐ Kod xatosiz ishladimi?
☐ Barcha 7 ta arifmetik operatorni ishlatdimmi?
☐ `==` bilan natijani TEKSHIRDIMmi?
☐ Har bir bo'limga izoh qo'ydimmi?
☐ O'zgaruvchi nomlari ma'nolimi?
☐ "O'zgartirish" vazifalarini bajardimmi?
☐ Jupyter'da Restart & Run All bilan sinadimmi?
```

---

⬅️ [Modul boshiga](README.md) · 📝 [Barcha mashqlar](MASHQLAR.md)
