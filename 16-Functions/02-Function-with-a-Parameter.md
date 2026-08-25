# 2-dars. Parametrli funksiya yaratish

## 🎬 Boshlashdan oldin

1-darsdagi funksiya **doim bir xil** narsa qilardi. Endi u **kirish ma'lumotini** qabul qiladi.

> **"Keyingi vazifamiz — PARAMETRLI funksiya yaratish."**

---

## 1. Vazifa

> **"U `plus_ten` bo'lsin — `a` parametri bilan, va natijada bizga `a` va 10 ning yig'indisini bersin."**

### Qadamlar

> **"Doim `def` kalit so'zi bilan boshlang."**
>
> **"Keyin funksiya nomini yozing: `plus_ten`."**
>
> **"Va qavslar ichida `a` parametrini belgilang."**
>
> **"Bu qatorda yoziladigan oxirgi narsa — IKKI NUQTA belgisi."**

```python
def plus_ten(a):
```

---

## 2. `return` — eng muhim qism

> ## **"Keyingi narsa JUDA MUHIM: funksiyadan QIYMAT QAYTARISHNI unutmang."**
>
> **"Oldingi darsda yozgan funksiyamizga qarasak — u yerda qaytariladigan qiymat YO'Q edi. U shunchaki ma'lum jumlani chop etardi."**
>
> **"Bu yerda vaziyat boshqacha: bizga bu funksiya shunchaki nimadir chop etishi emas, MUAYYAN HISOB-KITOBNI bajarishi kerak."**

> **"`return a + 10` deb yozing."**

```python
def plus_ten(a):
    return a + 10
```

> **"Bu — mana shu funksiyaning TANASI bo'ladi."**

![Funksiya tuzilishi](assets/01-function-anatomy.svg)

---

## 3. Chaqirish

> **"Endi `plus_ten` ni qavslar ichida ko'rsatilgan 2 argumenti bilan chaqiraylik."**

```python
plus_ten(2)
```

```
12
```

> **"Ajoyib. Ishlaydi."**

> **"Funksiyani yaratganimizdan so'ng, uni ARGUMENTINI O'ZGARTIRIB, QAYTA-QAYTA ishga tushira olamiz."**
>
> **"Men `plus_ten` ni 5 argumenti bilan ishga tushirishim mumkin — bu safar javob 15 bo'ladi."**

```python
plus_ten(5)
```

```
15
```

---

## 4. 🔑 Parametr va argument

> **"Quyidagiga e'tibor bering. Funksiyani E'LON QILGANIMIZDA biz qavslar ichida PARAMETRNI ko'rsatamiz. `plus_ten` funksiyasida `a` — PARAMETR."**
>
> **"Keyinroq, bu funksiyani CHAQIRGANIMIZDA — biz ARGUMENT beryapmiz deyish to'g'ri, parametr emas."**
>
> **"Demak, biz shunday deya olamiz: `plus_ten` ni 2 ARGUMENTI bilan chaqir. `plus_ten` ni 5 ARGUMENTI bilan chaqir."**

| Atama | Qachon | Misol |
|---|---|---|
| **Parametr** | Funksiya **e'lon qilinganda** | `def plus_ten(a):` → `a` |
| **Argument** | Funksiya **chaqirilganda** | `plus_ten(2)` → `2` |

```
E'LON:      def plus_ten(a):        ← a  = PARAMETR (bo'sh quti)
                return a + 10

CHAQIRISH:  plus_ten(2)             ← 2  = ARGUMENT (haqiqiy qiymat)
```

> 🧠 **Yodlash:** **P**arametr — **P**lan (reja). **A**rgument — **A**ktual (haqiqiy).

---

## 5. `print` va `return` farqi

> **"Odamlar ko'pincha `print` va `return` ni, hamda ularni qo'llash mumkin bo'lgan vaziyat turlarini chalkashtiradi. Tushunchani yaxshiroq tushunish uchun quyidagini tasavvur qilishga harakat qiling."**

> **"Funksiyaga KIRISH bo'lib xizmat qiladigan `x` argumenti bor. Bu holdagi funksiya — `x + 10`."**
>
> **"`x` kirish ekanini hisobga olsak, uni BIZ ALLAQACHON BILADIGAN qiymat deb o'ylashimiz mumkin."**
>
> **"Demak, `x` va funksiyaning birikmasi bizga CHIQISH qiymatini beradi — `y`."**

```
    x    →    f(x) = x + 10    →    y
  KIRISH        FUNKSIYA          CHIQISH
 (input)                          (output)
                                     ↑
                                  return
```

> **"Dasturlashda `return` `y` ning qiymatiga tegishli. U shunchaki mashinaga aytadi: `f` funksiyasi bajargan amallardan so'ng menga `y` ning qiymatini QAYTAR."**
>
> **"`return` jarayonning IKKINCHI va UCHINCHI bosqichlari orasidagi bog'lanishni ta'minlaydi."**

### Muhim natija

> ## **"Boshqacha aytganda, funksiya BIR YOKI BIR NECHTA o'zgaruvchining kirishini qabul qilishi va bir yoki bir nechta qiymatdan iborat YAGONA CHIQISHNI qaytarishi mumkin."**
>
> ## **"Aynan shuning uchun `return` funksiyada FAQAT BIR MARTA ishlatilishi mumkin."**

> 🔑 Aniqrog'i: `return` **bir necha marta yozilishi** mumkin (masalan, `if`/`else` ichida), lekin **faqat bittasi bajariladi** — va u funksiyani **darrov tugatadi**.

---

## 6. Yaxshi nom berish

> **"E'tiborga olish kerak bo'lgan qo'shimcha afzalliklar ham bor."**
>
> **"Funksiyaga yanada INTUITIV nom berishingiz mumkin — `plus_ten` yoki `addition_of_ten` — va funksiya baribir to'g'ri ishlaydi."**
>
> ## **"Bu — 1000 qatorli kod varag'ida YAXSHI DIZAYN belgisidir."**
>
> **"Agar barcha funksiyalaringizni `x1`, `x2`, `x3` deb chaqirsangiz, hamkasblaringiz CHALKASHIB KETADI va butunlay BAXTSIZ bo'ladi."**
>
> ## **"Funksiyalarni ANIQ va IXCHAM nomlash dasturlash kodingizni TUSHUNARLI qiladi, va bu yaxshi uslublardan biri sifatida qabul qilinadi."**

| ❌ Yomon | ✅ Yaxshi |
|---|---|
| `x1` | `plus_ten` |
| `f` | `hisobla_qqs` |
| `func2` | `chegirma_hisobla` |
| `a` | `oylik_maosh` |

---

## 7. 💻 To'liq kod

```python
# ===== PARAMETRLI FUNKSIYA =====
def plus_ten(a):
    return a + 10

print(plus_ten(2))          # 12
print(plus_ten(5))          # 15
print(plus_ten(100))        # 110
print(plus_ten(-10))        # 0

# ===== NATIJANI SAQLASH =====
natija = plus_ten(2)
print(natija)               # 12
print(natija * 2)           # 24

# ===== IFODA ARGUMENT SIFATIDA =====
print(plus_ten(3 * 5))      # 25
print(plus_ten(plus_ten(0)))    # 20   ← funksiya ichida funksiya

# ===== print QAYTARMAYDI =====
def salom_print(ism):
    print("Salom,", ism)

def salom_return(ism):
    return "Salom, " + ism

a = salom_print("Ali")      # Salom, Ali   ← darrov chiqadi
print(a)                    # None         ← QAYTARMAYDI!

b = salom_return("Vali")    # (hech narsa chiqmaydi)
print(b)                    # Salom, Vali  ← QAYTARDI
```

**Natija:**

```
12
15
110
0
12
24
25
20
Salom, Ali
None
Salom, Vali
```

> ## 🔑 **Eng muhim satr — `print(a)` → `None`.** `print` li funksiya **hech narsa qaytarmaydi**. Uning natijasini **saqlab bo'lmaydi**.

---

## 8. 📝 Rasmiy mashqlar (kursdan)

### Mashq 1
**Argumentini 2 ga ko'paytirilgan qiymatni qaytaradigan funksiya e'lon qiling.**

<details>
<summary>✅ Yechim</summary>

```python
def multiplication_by_2(x):
    return x * 2

print(multiplication_by_2(7))       # 14
```

</details>

### Mashq 2
**Argumentini 2 ga bo'lingan `float` qiymatni qaytaradigan funksiya e'lon qiling.**

<details>
<summary>✅ Yechim</summary>

```python
def division_by_2(x):
    return float(x) / 2

print(division_by_2(7))       # 3.5
```

**Yoki:**

```python
def division_by_2(x):
    return x / 2.0

print(division_by_2(7))       # 3.5
```

> 💡 **Kursdagi izoh:** *"Bu siz uchun yangilik — ha, bo'luvchi float qilib belgilanishi mumkin, va bu chiqishingizni ham suzuvchi nuqtali qiladi!"*
>
> ⚠️ **Python 3 da esa bu ORTIQCHA** — `/` **doim** `float` qaytaradi *(13-modulning 1-darsini eslang)*:
> ```python
> def division_by_2(x):
>     return x / 2        # 7 / 2  →  3.5
> ```

</details>

---

## 9. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `kvadrat(n)` — sonning kvadratini qaytarsin.

**M2.** `salomlash(ism)` — `"Salom, <ism>!"` qaytarsin.

**M3.** `qqs(summa)` — 12% QQS ni qaytarsin.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
def kvadrat(n):
    return n ** 2

print(kvadrat(7))                   # 49

# M2
def salomlash(ism):
    return "Salom, " + ism + "!"

print(salomlash("Ilhom"))           # Salom, Ilhom!

# M3
def qqs(summa):
    return summa * 0.12

print(qqs(1000000))                 # 120000.0
```

</details>

### 🟡 O'rta

**M4.** `farengeytga(c)` — Selsiyni Farengeytga aylantirsin: `C * 9/5 + 32`.

**M5.** `oxirgi_belgi(matn)` — satrning oxirgi belgisini qaytarsin.

**M6.** Funksiyaga **ifoda** argument sifatida bering: `kvadrat(3 + 4)`.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
def farengeytga(c):
    return c * 9 / 5 + 32

print(farengeytga(0))               # 32.0
print(farengeytga(100))             # 212.0
print(farengeytga(37))              # 98.6

# M5
def oxirgi_belgi(matn):
    return matn[-1]

print(oxirgi_belgi("Python"))       # n

# M6
def kvadrat(n):
    return n ** 2

print(kvadrat(3 + 4))               # 49   ← avval 7 hisoblanadi
```

</details>

### 🔴 Qiyin

**M7.** `print` li va `return` li funksiya farqini isbotlang — natijani **o'zgaruvchida saqlab** ko'ring.

**M8.** Funksiya natijasini **boshqa funksiyaga** argument sifatida bering.

**M9.** `return` dan **keyin** kod yozing. U bajariladimi?

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
def f_print(x):
    print(x * 2)

def f_return(x):
    return x * 2

a = f_print(5)          # 10    ← darrov chiqadi
print(a)                # None  ← QAYTARMADI

b = f_return(5)         # (hech narsa)
print(b)                # 10    ← QAYTARDI
print(b + 1)            # 11    ← b bilan ISHLASH mumkin
# a + 1  →  TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'

# M8
def plus_ten(a):
    return a + 10

print(plus_ten(plus_ten(0)))        # 20
#            ↑ 10 ↑
print(plus_ten(plus_ten(plus_ten(0))))     # 30

# M9
def test(x):
    return x * 2
    print("Bu HECH QACHON chiqmaydi")

print(test(5))          # 10
# return funksiyani DARROV tugatadi — undan keyingi kod O'LIK KOD
```

</details>

---

## 10. 🧠 O'zini tekshirish savollari

1. Funksiya e'loni nima bilan boshlanadi?
2. Qavslar ichiga nima yoziladi?
3. Qatorning oxiriga nima qo'yiladi?
4. `return` nima uchun kerak?
5. Oldingi darsdagi funksiyada nima yo'q edi?
6. Funksiyani qayta-qayta ishlatish mumkinmi?
7. `a` — parametrmi yoki argumentmi?
8. `plus_ten(2)` dagi `2` — nima?
9. `return` funksiyada necha marta ishlatiladi?
10. Nima uchun funksiyaga aniq nom berish muhim?

<details>
<summary>✅ Javoblar</summary>

1. **`def`** kalit so'zi bilan.
2. **Parametr** — masalan, `a`.
3. **Ikki nuqta `:`**.
4. Funksiyadan **qiymat qaytarish** uchun.
5. **Qaytariladigan qiymat** — u shunchaki jumla chop etardi.
6. **Ha** — **argumentni o'zgartirib**.
7. **Parametr** — e'londa.
8. **Argument** — chaqiruvda.
9. **Faqat bir marta** bajariladi (funksiya **yagona chiqish** qaytaradi).
10. Kod **1000 qatorli** bo'lganda hamkasblar **chalkashib ketmasligi** uchun; bu — **yaxshi dizayn** belgisi.

</details>

---

## 📌 Xulosa

```python
def plus_ten(a):          ← a = PARAMETR
    return a + 10         ← TANA + return

plus_ten(2)   →  12       ← 2 = ARGUMENT
plus_ten(5)   →  15


PARAMETR  va  ARGUMENT

E'LON:      def plus_ten(a):       a  →  PARAMETR (reja)
CHAQIRISH:  plus_ten(2)            2  →  ARGUMENT (haqiqiy)


JARAYON

   x    →    f(x)    →    y
 KIRISH   FUNKSIYA    CHIQISH
                         ↑
                      return


🔑 return  —  QIYMAT qaytaradi (dasturga)
🔑 print   —  MATN chiqaradi (dasturchiga)

def f(x): print(x)      →  f(5) natijasi = None  ❌
def f(x): return x      →  f(5) natijasi = 5     ✅


✅ YAXSHI NOM:   plus_ten,  hisobla_qqs
❌ YOMON NOM:    x1,  f,  func2
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Parametr | *parameter* | E'londa ko'rsatilgan o'zgaruvchi |
| Argument | *argument* | Chaqiruvda berilgan haqiqiy qiymat |
| `return` | *return* | Qiymatni qaytaradi va funksiyani tugatadi |
| Tana | *body* | Funksiyaning chekintirilgan qismi |
| Kirish | *input* | Funksiyaga beriladigan ma'lumot |
| Chiqish | *output* | Funksiya qaytaradigan natija |
| `None` | *None* | "Hech narsa" qiymati |

---

⬅️ [Oldingi: Funksiya e'lon qilish](01-Defining-a-Function.md) · ➡️ [Keyingi: Funksiyani e'lon qilishning boshqa usuli](03-Another-Way-to-Define-a-Function.md)
