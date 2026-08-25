# 6-dars. Bir necha argumentli funksiyalar

## 🎬 Boshlashdan oldin

> **"Biz deyarli yetib keldik."**
>
> **"Bu darsda biz funksiyada BIRDAN ORTIQ parametr bilan qanday ishlashni o'rganamiz."**

---

## 1. Sintaksis

> ## **"Python'da bu shunday qilinadi: barcha argumentlarni qavslar ichida VERGUL BILAN AJRATIB ro'yxatga olinadi."**

```python
def subtract_bc(a, b, c):
    result = a - b*c
    print('Parameter a equals', a)
    print('Parameter b equals', b)
    print('Parameter c equals', c)
    return result
```

---

## 2. Chaqirish

> **"Bu yerdagi funksiyani, aytaylik, 10, 3 va 2 uchun chaqiraymi?"**

```python
subtract_bc(10, 3, 2)
```

```
Parameter a equals 10
Parameter b equals 3
Parameter c equals 2
4
```

> **"Men 4 ni olaman."**

**Tekshiruv:** `a - b*c` = `10 - 3*2` = `10 - 6` = `4` ✅

---

## 3. ⚠️ Tartib MUHIM

> **"Bir nechta parametr qo'shish oson ko'rinadi, shunday emasmi? Va bu haqiqatan ham shunday."**
>
> ## **"Faqat ularning qiymatlarini ko'rsatish TARTIBIGA ehtiyot bo'ling."**
>
> **"Bizning holatda men 10 ni `a` o'zgaruvchisiga, 3 ni `b` ga, va 2 ni `c` ga biriktiraman."**

```
def subtract_bc(a,  b,  c):
                ↓   ↓   ↓
subtract_bc(   10,  3,  2)
```

### Tartibni buzsangiz

```python
subtract_bc(2, 3, 10)      # a=2, b=3, c=10  →  2 - 30 = -28
```

**Butunlay boshqa natija!**

---

## 4. Nomli argumentlar

> **"Aks holda, tartib AHAMIYATSIZ bo'ladi — FAQAT VA FAQAT agar siz qavslar ichida o'zgaruvchilarning NOMLARINI ko'rsatsangiz. Mana shunday:"**
>
> **"`b` teng 3, `a` teng 10, va `c` teng 2."**

```python
subtract_bc(b=3, a=10, c=2)
```

```
Parameter a equals 10
Parameter b equals 3
Parameter c equals 2
4
```

> **"Va albatta, biz xuddi shu javobni — 4 ni — olamiz."**

### Ikki xil chaqirish usuli

| Usul | Nomi | Misol | Tartib muhimmi? |
|---|---|---|---|
| Pozitsiya bo'yicha | *positional* | `subtract_bc(10, 3, 2)` | **Ha** |
| Nom bo'yicha | *keyword* | `subtract_bc(b=3, a=10, c=2)` | **Yo'q** |

> 🔑 **Amaliy maslahat:** argumentlar **3 tadan ko'p** bo'lsa — **nomli** argumentlardan foydalaning. Kod **ancha o'qiladigan** bo'ladi.

```python
# ❌ Nima ekanini tushunish qiyin
chek(8500000, 2, 15, 12, True)

# ✅ Hammasi aniq
chek(narx=8500000, soni=2, chegirma=15, qqs=12, doimiy=True)
```

---

## 5. 💡 Aralash chaqirish

```python
subtract_bc(10, c=2, b=3)      # ✅ ishlaydi
subtract_bc(a=10, 3, 2)        # ❌ SyntaxError
```

> ## 🔑 **Qoida: pozitsiyali argumentlar DOIM nomlilardan OLDIN turishi kerak.**

---

## 6. 💻 To'liq kod

```python
# ===== UCH PARAMETRLI FUNKSIYA =====
def subtract_bc(a, b, c):
    result = a - b*c
    print('Parameter a equals', a)
    print('Parameter b equals', b)
    print('Parameter c equals', c)
    return result

print(subtract_bc(10, 3, 2))
print(subtract_bc(b=3, a=10, c=2))

# ===== TARTIB MUHIM =====
def bolish(a, b):
    return a / b

print(bolish(10, 2))        # 5.0
print(bolish(2, 10))        # 0.2   ← BOSHQA natija!

# ===== NOMLI ARGUMENTLAR =====
print(bolish(b=2, a=10))    # 5.0   ← tartib ahamiyatsiz

# ===== ARALASH =====
print(bolish(10, b=2))      # 5.0   ← pozitsiyali OLDIN

# ===== KO'P ARGUMENTLI AMALIY MISOL =====
def chek(narx, soni, chegirma_foizi):
    oraliq = narx * soni
    chegirma = oraliq * chegirma_foizi / 100
    qqs = (oraliq - chegirma) * 0.12
    return oraliq - chegirma + qqs

print(chek(5000, 3, 10))
print(chek(narx=5000, soni=3, chegirma_foizi=10))
```

**Natija:**

```
Parameter a equals 10
Parameter b equals 3
Parameter c equals 2
4
Parameter a equals 10
Parameter b equals 3
Parameter c equals 2
4
5.0
0.2
5.0
5.0
15120.0
15120.0
```

---

## 7. 💡 Standart qiymatlar

Bu ma'ruzada aytilmagan, lekin **juda foydali**: parametrga **oldindan qiymat** berish mumkin.

```python
def chek(narx, soni, chegirma_foizi=0):     # ← standart qiymat
    oraliq = narx * soni
    chegirma = oraliq * chegirma_foizi / 100
    return oraliq - chegirma

print(chek(5000, 3))          # 15000.0   ← chegirma berilmadi → 0
print(chek(5000, 3, 10))      # 13500.0   ← chegirma berildi
```

> ## 🔑 **Qoida: standart qiymatli parametrlar DOIM oxirida turishi kerak.**

```python
def f(a, b=2, c=3):    # ✅ TO'G'RI
def f(a=1, b, c):      # ❌ SyntaxError
```

---

## 8. ⚠️ Keng tarqalgan xatolar

### Xato 1 — argument soni mos kelmaydi

```python
def subtract_bc(a, b, c):
    return a - b*c

subtract_bc(10, 3)
```
```
TypeError: subtract_bc() missing 1 required positional argument: 'c'
```

```python
subtract_bc(10, 3, 2, 5)
```
```
TypeError: subtract_bc() takes 3 positional arguments but 4 were given
```

### Xato 2 — noto'g'ri nom

```python
subtract_bc(x=10, b=3, c=2)
```
```
TypeError: subtract_bc() got an unexpected keyword argument 'x'
```

### Xato 3 — bir argument ikki marta

```python
subtract_bc(10, a=5, b=3, c=2)
```
```
TypeError: subtract_bc() got multiple values for argument 'a'
```

---

## 9. ⚡ Qo'shimcha mashqlar

> 📌 Bu darsda kursning alohida rasmiy mashqi yo'q — keyingi darsda ular ko'p.

### 🟢 Oson

**M1.** `yigindi(a, b, c)` — uch sonning yig'indisini qaytarsin.

**M2.** `to_rtburchak(uz, en)` — perimetr **va** yuzani chiqarsin, yuzani qaytarsin.

**M3.** Xuddi shu funksiyani **nomli argumentlar** bilan chaqiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
def yigindi(a, b, c):
    return a + b + c

print(yigindi(1, 2, 3))                 # 6

# M2
def to_rtburchak(uz, en):
    perimetr = 2 * (uz + en)
    yuza = uz * en
    print("Perimetr:", perimetr)
    print("Yuza:", yuza)
    return yuza

print(to_rtburchak(3, 4))
# Perimetr: 14
# Yuza: 12
# 12

# M3
print(to_rtburchak(en=4, uz=3))
# Perimetr: 14
# Yuza: 12
# 12
```

</details>

### 🟡 O'rta

**M4.** `chek(narx, soni, chegirma)` — chegirmali chekni hisoblasin.

**M5.** `bolish(a, b)` ni ikki xil tartibda chaqirib, farqni ko'rsating.

**M6.** Funksiyaga **standart qiymat** qo'shing.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
def chek(narx, soni, chegirma):
    oraliq = narx * soni
    return oraliq - oraliq * chegirma / 100

print(chek(5000, 3, 10))                # 13500.0
print(chek(soni=3, narx=5000, chegirma=10))     # 13500.0

# M5
def bolish(a, b):
    return a / b

print(bolish(10, 2))                    # 5.0
print(bolish(2, 10))                    # 0.2
print(bolish(b=10, a=2))                # 0.2   ← nomlar bilan ANIQ

# M6
def salomlash(ism, salom="Salom"):
    return salom + ", " + ism + "!"

print(salomlash("Ilhom"))               # Salom, Ilhom!
print(salomlash("Ilhom", "Assalomu alaykum"))   # Assalomu alaykum, Ilhom!
```

</details>

### 🔴 Qiyin

**M7.** `subtract_bc(a=10, 3, 2)` nima uchun xato beradi?

**M8.** Uchta argument berish shart bo'lgan funksiyaga **ikkita** bering. Xato nomini yozing.

**M9.** BMI kalkulyator yozing: `bmi(vazn, boy)` — va **toifani** ham qaytarsin.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — pozitsiyali argument nomlidan KEYIN kelolmaydi
# subtract_bc(a=10, 3, 2)
# SyntaxError: positional argument follows keyword argument
# To'g'ri variantlar:
def subtract_bc(a, b, c):
    return a - b*c
print(subtract_bc(10, 3, 2))            # 4
print(subtract_bc(10, b=3, c=2))        # 4
print(subtract_bc(a=10, b=3, c=2))      # 4

# M8
# subtract_bc(10, 3)
# TypeError: subtract_bc() missing 1 required positional argument: 'c'

# M9
def bmi(vazn, boy):
    qiymat = vazn / (boy ** 2)
    if qiymat < 18.5:
        toifa = "Vazn yetishmovchiligi"
    elif qiymat < 25:
        toifa = "Normal vazn"
    elif qiymat < 30:
        toifa = "Ortiqcha vazn"
    else:
        toifa = "Semizlik"
    print("BMI:", round(qiymat, 1))
    return toifa

print(bmi(70, 1.75))
# BMI: 22.9
# Normal vazn
print(bmi(vazn=95, boy=1.70))
# BMI: 32.9
# Semizlik
```

</details>

---

## 10. 🧠 O'zini tekshirish savollari

1. Python'da bir nechta argument qanday beriladi?
2. `subtract_bc(10, 3, 2)` nima qaytaradi?
3. Nimaga ehtiyot bo'lish kerak?
4. `10`, `3`, `2` qaysi o'zgaruvchilarga biriktiriladi?
5. Tartib qachon ahamiyatsiz bo'ladi?
6. `subtract_bc(b=3, a=10, c=2)` nima qaytaradi?

<details>
<summary>✅ Javoblar</summary>

1. Qavslar ichida **vergul bilan ajratib** ro'yxatga olinadi.
2. **`4`** — chunki `10 - 3*2 = 4`.
3. Qiymatlarni ko'rsatish **tartibiga**.
4. `10` → **`a`**, `3` → **`b`**, `2` → **`c`**.
5. **Faqat va faqat** qavslar ichida o'zgaruvchilarning **nomlari** ko'rsatilganda.
6. **Ayni o'sha `4`** — chunki nomlar berilgan.

</details>

---

## 📌 Xulosa

```python
def subtract_bc(a, b, c):        ← VERGUL bilan ajratilgan
    return a - b*c

subtract_bc(10, 3, 2)   →  4     ← POZITSIYA bo'yicha
                                    a=10, b=3, c=2

subtract_bc(b=3, a=10, c=2)  →  4   ← NOM bo'yicha
                                       tartib AHAMIYATSIZ


⚠️  TARTIB MUHIM (pozitsiyali chaqiruvda)

    bolish(10, 2)  →  5.0
    bolish(2, 10)  →  0.2      ← boshqa natija!


✅ POZITSIYALI DOIM NOMLIDAN OLDIN

    f(10, c=2, b=3)     ✅
    f(a=10, 3, 2)       ❌ SyntaxError


💡 STANDART QIYMAT

    def chek(narx, soni, chegirma=0):    ← DOIM oxirida
        ...
    chek(5000, 3)        →  chegirma = 0
    chek(5000, 3, 10)    →  chegirma = 10


⚠️  TypeError lar:
   • missing 1 required positional argument
   • takes 3 positional arguments but 4 were given
   • got an unexpected keyword argument
   • got multiple values for argument
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Pozitsiyali argument | *positional argument* | Tartib bo'yicha beriladi |
| Nomli argument | *keyword argument* | Nom bilan beriladi |
| Standart qiymat | *default value* | Oldindan belgilangan qiymat |
| `TypeError` | *TypeError* | Argument xatosi |

---

⬅️ [Oldingi: Shartlar va funksiyalar](05-Combining-Conditionals-and-Functions.md) · ➡️ [Keyingi: Ichki funksiyalar](07-Notable-Built-in-Functions.md)
