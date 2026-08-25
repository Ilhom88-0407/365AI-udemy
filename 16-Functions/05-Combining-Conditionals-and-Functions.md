# 5-dars. Shartlar va funksiyalarni birlashtirish

## 🎬 Boshlashdan oldin

> **"Biz `if` operatorlari bilan ishlashni bilamiz, va funksiyalar bilan ishlashni ham bilamiz."**
>
> **"Bu darsda biz ikkalasini QANDAY BIRLASHTIRISHNI o'rganamiz."**
>
> ## **"Bu — dasturlashdagi FUNDAMENTAL tushuncha, shuning uchun iltimos e'tibor bering."**
>
> **"Kod yozayotganda unga ANCHA MUNTAZAM duch kelasiz."**

---

## 1. Vazifa: Johnny va onasi

> **"Johnny'ning onasi unga aytdi: hafta oxirigacha kamida $100 yig'sa, u yigitga qo'shimcha $10 beradi."**
>
> **"Agar u kamida $100 yig'a olmasa — u qo'shimcha pul bermaslikni afzal ko'radi."**

---

## 2. Funksiyani e'lon qilamiz

> **"Endi `add_10` deb ataladigan funksiya e'lon qilaylik — u parametr sifatida noma'lum `m` ni qabul qiladi, u Johnny hafta oxiriga yig'gan pulni bildiradi."**

```python
def add_10(m):
```

> **"Kompyuterga nima qilishni aytishimiz kerak?"**
>
> **"Agar `m` 100 dan katta yoki teng bo'lsa — u holda yig'ilgan summaga 10 qo'sh."**
>
> **"Agar bunday bo'lmasa — Johnny ko'proq tejashi kerakligini bildiruvchi gapni qaytar."**

---

## 3. `if` qismi

> **"Ya'ni: agar `m` 100 dan katta yoki teng bo'lsa — `m` `m + 10` qiymatini qabul qilsin."**

```python
def add_10(m):
    if m >= 100:
        m = m + 10
```

### ⚠️ `m = m + 10` — bu tenglama emas!

> **"Ha, siz ko'rgan narsa shu. Bizda tenglamaning IKKALA TOMONIDA ham `m` bor, va bu MUTLAQO NORMAL."**
>
> ## **"Aslida bu — tenglama EMAS."**
>
> **"Esda tuting: tenglik belgisi o'ng tomondagi ifodani chap tomonda yozilgan narsaga BIRIKTIRISHNI bildiradi."**

*(13-modulning 3-darsini eslang: `x = x + 3`.)*

```
m = m + 10
      ↓
1. O'ng tomon hisoblanadi:   110 + 10  =  120
2. Natija chapga biriktiriladi:   m  =  120
```

> **"`if` qismini `return m` bilan tugataylik."**

```python
def add_10(m):
    if m >= 100:
        m = m + 10
        return m
```

---

## 4. Mantiqni jamlash

> **"Mantiqiy jihatdan jamlaydigan bo'lsak: biz `m` ni parametr sifatida ko'rsatamiz."**
>
> **"Keyin uning qiymatini `m` dan KATTAROQ qiymat bilan — oxirida 10 qo'shilgan qiymat bilan — ALMASHTIRAMIZ."**
>
> **"Va aytamiz: bundan buyon yangi `m` ga teng qiymatni qaytar."**

---

## 5. `else` qismi

> **"Nihoyat, boshqa BARCHA holatlarda — masalan, `Save more!` (ko'proq tejang)."**
>
> **"Johnny o'rganishi kerak: bir chekkada biroz naqd pul bo'lishi yaxshi odat, shunday emasmi?"**

```python
def add_10(m):
    if m >= 100:
        m = m + 10
        return m
    else:
        return "Save more!"
```

---

## 6. Sinab ko'ramiz

> **"Bizning sezgimiz to'g'ri bo'ldimi, ko'raylik."**

```python
add_10(110)
```

```
120
```

> **"Yaxshi. 120."**

```python
add_10(50)
```

```
'Save more!'
```

> **"Ajoyib. Hammasi to'g'ri."**

### 🔑 Diqqat: turli TURDAGI natijalar

```python
add_10(110)     # 120           ← int
add_10(50)      # 'Save more!'  ← str
```

Bir funksiya **turli turdagi** qiymat qaytarishi mumkin. Bu **ishlaydi**, lekin har doim ham **yaxshi g'oya emas** — chaqiruvchi tomon natija bilan nima qilishni bilmay qolishi mumkin.

---

## 7. 💡 Nima uchun bu fundamental?

> **"Mantiqiy nuqtai nazardan qaraganda, bu mantiqiy, shunday emasmi?"**
>
> **"Kompyuterni nima uchun ishlatasiz? Muammolaringizni HAL QILISH uchun. Va u buni FUNKSIYALAR orqali qila oladi."**
>
> ## **"Sizga, ehtimol, mashinadan biror narsani bajarishni so'rash kerak bo'ladi — AGAR berilgan parametr MA'LUM CHEGARALAR ICHIDA bo'lsa; va parametr bu chegaralardan TASHQARIDA bo'lsa — BOSHQA narsani bajarishni so'raysiz."**
>
> ## **"Shuning uchun Python'dagi shartlar va funksiyalar haqidagi bilimlaringizni birlashtirish — AYNAN KERAKLI narsa."**

```
KIRISH  →  FUNKSIYA  →  SHART  →  turli CHIQISH
   m         add_10     m>=100?    120  yoki  "Save more!"
```

---

## 8. 💻 To'liq kod

```python
# ===== ASOSIY MISOL =====
def add_10(m):
    if m >= 100:
        m = m + 10
        return m
    else:
        return "Save more!"

print(add_10(110))          # 120
print(add_10(100))          # 110
print(add_10(50))           # Save more!
print(add_10(99))           # Save more!

# ===== ELIF BILAN =====
def baho(ball):
    if ball >= 90:
        return "A'lo"
    elif ball >= 70:
        return "Yaxshi"
    elif ball >= 50:
        return "Qoniqarli"
    else:
        return "Qoniqarsiz"

print(baho(95))             # A'lo
print(baho(75))             # Yaxshi
print(baho(30))             # Qoniqarsiz

# ===== VALIDATSIYA =====
def kvadrat_ildiz(n):
    if n < 0:
        return "Manfiy sondan ildiz chiqarib bo'lmaydi"
    else:
        return n ** 0.5

print(kvadrat_ildiz(16))    # 4.0
print(kvadrat_ildiz(-4))    # Manfiy sondan ildiz chiqarib bo'lmaydi

# ===== else SIZ =====
def musbatmi(n):
    if n > 0:
        return "Musbat"
    return "Musbat emas"        # else kerak emas — return tugatadi

print(musbatmi(5))          # Musbat
print(musbatmi(-5))         # Musbat emas

# ===== CHEGIRMA =====
def chegirma_foizi(summa):
    if summa > 5000000:
        return 20
    elif summa > 1000000:
        return 15
    elif summa > 500000:
        return 10
    else:
        return 0

print(chegirma_foizi(2000000))      # 15
print(chegirma_foizi(100000))       # 0
```

**Natija:**

```
120
110
Save more!
Save more!
A'lo
Yaxshi
Qoniqarsiz
4.0
Manfiy sondan ildiz chiqarib bo'lmaydi
Musbat
Musbat emas
15
0
```

---

## 9. 💡 `else` siz yozish

E'tibor bering — 4-misolda `else` **yo'q**:

```python
def musbatmi(n):
    if n > 0:
        return "Musbat"
    return "Musbat emas"
```

Bu **ishlaydi**, chunki `return` funksiyani **darrov tugatadi**. Agar `n > 0` bo'lsa — ikkinchi qatorga **yetilmaydi**.

| Uslub | Qachon yaxshi |
|---|---|
| `if` / `else` | Ikkala holat **teng ahamiyatli** bo'lganda |
| `if` + `return` | Birinchi holat — **maxsus** yoki **xato** bo'lganda |

---

## 10. 📝 Rasmiy mashq (kursdan)

### Mashq 1
**Ikkita argumentli `compare_the_two()` funksiyasini e'lon qiling. Agar birinchisi ikkinchisidan katta bo'lsa — `"Greater"` chop etsin. Ikkinchisi katta bo'lsa — `"Less"`. Ikkala qiymat bir xil son bo'lsa — `"Equal"` chop etsin.**

<details>
<summary>✅ Yechim</summary>

```python
def compare_the_two(x, y):
    if x > y:
        print("Greater")
    elif x < y:
        print("Less")
    else:
        print("Equal")

compare_the_two(10, 10)
```

```
Equal
```

**Boshqa qiymatlar bilan:**

```python
compare_the_two(20, 10)     # Greater
compare_the_two(5, 10)      # Less
```

> 💡 **Diqqat:** bu yerda `print` ishlatilgan, `return` emas — chunki mashqda **"chop etsin"** deyilgan. Agar natijani **saqlash** kerak bo'lsa, `return` yozgan bo'lardik:
> ```python
> def compare_the_two(x, y):
>     if x > y:
>         return "Greater"
>     elif x < y:
>         return "Less"
>     else:
>         return "Equal"
> ```

</details>

---

## 11. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `juftmi(n)` — juft bo'lsa `"Juft"`, aks holda `"Toq"` qaytarsin.

**M2.** `voyaga_yetganmi(yosh)` — `>= 18` bo'lsa `True`, aks holda `False`.

**M3.** `kattasi(a, b)` — ikki sondan kattasini qaytarsin.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
def juftmi(n):
    if n % 2 == 0:
        return "Juft"
    else:
        return "Toq"

print(juftmi(14))               # Juft
print(juftmi(7))                # Toq

# M2
def voyaga_yetganmi(yosh):
    if yosh >= 18:
        return True
    else:
        return False

print(voyaga_yetganmi(20))      # True
print(voyaga_yetganmi(15))      # False
# 💡 Soddaroq:  return yosh >= 18

# M3
def kattasi(a, b):
    if a > b:
        return a
    else:
        return b

print(kattasi(17, 42))          # 42
```

</details>

### 🟡 O'rta

**M4.** `chipta_narxi(yosh)` — `< 7` bepul (`0`), `< 18` yarim (`25000`), `>= 60` bepul, aks holda to'liq (`50000`).

**M5.** `bmi_toifasi(bmi)` — to'rt toifa qaytarsin.

**M6.** `xavfsiz_bolish(a, b)` — `b == 0` bo'lsa xato xabari, aks holda natija.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
def chipta_narxi(yosh):
    if yosh < 7:
        return 0
    elif yosh >= 60:
        return 0
    elif yosh < 18:
        return 25000
    else:
        return 50000

print(chipta_narxi(5))          # 0
print(chipta_narxi(15))         # 25000
print(chipta_narxi(30))         # 50000
print(chipta_narxi(65))         # 0

# M5
def bmi_toifasi(bmi):
    if bmi < 18.5:
        return "Vazn yetishmovchiligi"
    elif bmi < 25:
        return "Normal vazn"
    elif bmi < 30:
        return "Ortiqcha vazn"
    else:
        return "Semizlik"

print(bmi_toifasi(23.4))        # Normal vazn
print(bmi_toifasi(31))          # Semizlik

# M6
def xavfsiz_bolish(a, b):
    if b == 0:
        return "Nolga bo'lib bo'lmaydi"
    else:
        return a / b

print(xavfsiz_bolish(10, 2))    # 5.0
print(xavfsiz_bolish(10, 0))    # Nolga bo'lib bo'lmaydi
```

</details>

### 🔴 Qiyin

**M7.** Shart bilan funksiya **va** funksiya ichida funksiya — ikkalasini birlashtiring.

**M8.** `else` **siz** yozing — `return` ning tugatish xususiyatidan foydalanib.

**M9.** Nima uchun bir funksiya `int` va `str` qaytarishi **muammo** bo'lishi mumkin? Isbotlang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
def asosiy_narx(soni):
    return soni * 50000

def yakuniy_narx(soni):
    narx = asosiy_narx(soni)
    if narx > 500000:
        return narx * 0.9           # 10% chegirma
    else:
        return narx

print(yakuniy_narx(5))              # 250000
print(yakuniy_narx(20))             # 900000.0

# M8
def tekshir(yosh):
    if yosh < 0:
        return "Xato: manfiy yosh"
    if yosh < 18:
        return "Voyaga yetmagan"
    return "Voyaga yetgan"

print(tekshir(-5))                  # Xato: manfiy yosh
print(tekshir(15))                  # Voyaga yetmagan
print(tekshir(25))                  # Voyaga yetgan

# M9
def add_10(m):
    if m >= 100:
        return m + 10
    else:
        return "Save more!"

a = add_10(110)
print(a * 2)            # 240      ← ishlaydi
b = add_10(50)
print(b * 2)            # Save more!Save more!   ← SATR takrorlandi!
# print(b + 10)
# TypeError: can only concatenate str (not "int") to str
```

**Saboq:** funksiya **bir xil turdagi** qiymat qaytarsa — chaqiruvchi tomon **ishonchli** ishlaydi. Bu yerda `None` yoki `0` qaytarish **xavfsizroq** bo'lardi.

</details>

---

## 12. 🧠 O'zini tekshirish savollari

1. Bu darsda nima birlashtiriladi?
2. Nima uchun bu muhim?
3. `m` nimani bildiradi?
4. `m >= 100` bo'lsa nima qilish kerak?
5. `m = m + 10` — bu tenglamami?
6. Tenglik belgisi nimani bildiradi?
7. `add_10(110)` va `add_10(50)` nima qaytaradi?
8. Kompyuter nima uchun kerak va u buni qanday qiladi?

<details>
<summary>✅ Javoblar</summary>

1. **`if` operatorlari** va **funksiyalar**.
2. Bu — dasturlashdagi **fundamental tushuncha**; kod yozganda unga **muntazam** duch kelasiz.
3. Johnny **hafta oxiriga yig'gan pulni**.
4. Yig'ilgan summaga **10 qo'shish**.
5. **Yo'q** — bu **biriktirish**: o'ng tomon hisoblanib, chapga **joylanadi**.
6. O'ng tomondagi ifodani chapdagiga **biriktirishni**.
7. **`120`** va **`'Save more!'`**.
8. **Muammolarni hal qilish** uchun; buni **funksiyalar** orqali qiladi — parametr **chegaralar ichida** bo'lsa bir narsani, **tashqarida** bo'lsa boshqasini bajaradi.

</details>

---

## 📌 Xulosa

```python
def add_10(m):
    if m >= 100:
        m = m + 10        ← tenglama EMAS, BIRIKTIRISH
        return m
    else:
        return "Save more!"

add_10(110)  →  120
add_10(50)   →  'Save more!'


NAQSH:

   KIRISH  →  FUNKSIYA  →  SHART  →  turli CHIQISH


🔑 return  if/else ning HAR BIR shoxida bo'lishi mumkin
🔑 return  funksiyani DARROV tugatadi — else ixtiyoriy:

   def musbatmi(n):
       if n > 0:
           return "Musbat"
       return "Musbat emas"      ← else KERAK EMAS


⚠️  Bir funksiya turli TURDAGI qiymat qaytarishi mumkin,
    lekin bu chaqiruvchi tomon uchun MUAMMO tug'diradi:

    add_10(50) * 2  →  'Save more!Save more!'   😱


💡 MA'RUZACHIDAN
   "Mashinadan biror narsani bajarishni so'raysiz —
    agar parametr MA'LUM CHEGARALAR ICHIDA bo'lsa;
    chegaralardan TASHQARIDA bo'lsa — BOSHQA narsani."
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Biriktirish | *assignment* | `=` — qiymat berish |
| Validatsiya | *validation* | Kiritilgan ma'lumotni tekshirish |
| Chegara | *limit / boundary* | Shart chegarasi |
| Erta qaytarish | *early return* | `else` siz `return` yozish |
| Qaytish turi | *return type* | Funksiya qaytaradigan qiymat turi |

---

⬅️ [Oldingi: Funksiya ichida funksiya](04-Using-a-Function-in-Another-Function.md) · ➡️ [Keyingi: Bir necha argumentli funksiyalar](06-Functions-with-a-Few-Arguments.md)
