# 📝 12-modul · Barcha mashqlar

Bu yerda **modulning barcha mashqlari** bir joyda — kursning rasmiy topshiriqlari va qo'shimchalari.

> 💡 **Qanday ishlash kerak:** yechimni **ochishdan oldin** kamida 5 daqiqa o'zingiz urinib ko'ring. Yechimni ko'rgandan keyin — **yopib qo'ying va noldan qayta yozing**.

---

## 📋 Mundarija

| Bo'lim | Mashqlar | Manba |
|---|---|---|
| [A · O'zgaruvchilar](#a--ozgaruvchilar) | 6 + 6 | Rasmiy + qo'shimcha |
| [B · Sonlar va Boolean](#b--sonlar-va-boolean) | 7 + 8 | Rasmiy + qo'shimcha |
| [C · Satrlar](#c--satrlar) | 7 + 8 | Rasmiy + qo'shimcha |
| [D · Aralash sinov](#d--aralash-sinov) | 10 | Yangi |
| [E · Xatolarni toping](#e--xatolarni-toping) | 8 | Yangi |

**Jami: 60 ta mashq**

---

# A · O'zgaruvchilar

## 📝 Rasmiy mashqlar (kursdan)

**A1.** `x` nomli o'zgaruvchi yarating va unga 10 qiymatini bering.

**A2.** Kompyuterga o'sha o'zgaruvchining qiymatini ko'rsatishni ayting.

**A3.** Xuddi shu natijani olishning ikkinchi yo'lini toping.

**A4.** Bitta qatorda to'rtta o'zgaruvchi yarating: `a`, `b`, `c`, `d` — 10, 20, 30, 40.

**A5.** `b` qiymatini ko'rsating.

**A6.** `d` uchun ham xuddi shunday qiling.

<details>
<summary>✅ Yechimlar A1–A6</summary>

```python
# A1
x = 10

# A2
x                     # → 10

# A3
print(x)              # → 10

# A4
a, b, c, d = (10, 20, 30, 40)
# yoki: a, b, c, d = 10, 20, 30, 40

# A5
b                     # → 20
print(b)              # → 20

# A6
d                     # → 40
print(d)              # → 40
```

</details>

## ⚡ Qo'shimcha mashqlar

**A7.** 🟢 `ism` ga o'z ismingizni, `yosh` ga yoshingizni bering. Ikkalasini chop eting.

**A8.** 🟢 Uchta o'zgaruvchini bitta qatorda: `uzunlik`, `kenglik`, `balandlik` = 5, 3, 2.

**A9.** 🟢 `narx = 15000`, keyin `narx = 20000`. Chop eting. Nima ko'rasiz va nega?

**A10.** 🟡 `a = 5`, `b = 10`. Qiymatlarini **bitta qatorda** almashtiring.

**A11.** 🟡 Xatolarni toping:
```python
Ism = "Ali"
yosh = 20
print(ism)
print(Yosh)
x, y = (1, 2, 3)
```

**A12.** 🔴 3 ta mahsulot nomi va narxini **ikki qatorda** yarating, keyin juftlab chop eting.

<details>
<summary>✅ Yechimlar A7–A12</summary>

```python
# A7
ism = "Ilhom"
yosh = 25
print(ism)
print(yosh)

# A8
uzunlik, kenglik, balandlik = 5, 3, 2
print(uzunlik, kenglik, balandlik)      # 5 3 2

# A9
narx = 15000
narx = 20000
print(narx)                              # 20000
# Eski qiymat YO'QOLADI — quti bitta, ichidagi almashadi

# A10
a, b = 5, 10
a, b = b, a
print(a, b)                              # 10 5

# A11 — 3 ta xato
ism = "Ali"          # 1. Ism → ism
yosh = 20
print(ism)
print(yosh)          # 2. Yosh → yosh
x, y = (1, 2)        # 3. 3 ta qiymat, 2 ta o'zgaruvchi

# A12
m1, m2, m3 = "Non", "Sut", "Guruch"
n1, n2, n3 = 5000, 12000, 18000
print(m1, n1)        # Non 5000
print(m2, n2)        # Sut 12000
print(m3, n3)        # Guruch 18000
```

</details>

---

# B · Sonlar va Boolean

## 📝 Rasmiy mashqlar (kursdan)

**B1.** `True` ga teng o'zgaruvchi yarating.

**B2.** Uning turini tekshiring.

**B3.** 99 ga teng o'zgaruvchi yarating.

**B4.** Uning turini tekshiring.

**B5.** `0.99` qiymatining turini tekshiring.

**B6.** 99 ni *float* ga aylantiring.

**B7.** `0.99` ni integerga aylantiring. Qanday qiymat oldingiz?

<details>
<summary>✅ Yechimlar B1–B7</summary>

```python
# B1
a = True

# B2
type(a)               # bool

# B3
b = 99

# B4
type(b)               # int

# B5
type(0.99)            # float

# B6
float(b)              # 99.0

# B7
int(0.99)             # 0   ← ⚠️ 1 EMAS! int() yaxlitlamaydi
```

</details>

## ⚡ Qo'shimcha mashqlar

**B8.** 🟢 Turini **avval taxmin qiling**, keyin tekshiring:
```python
type(100)    type(100.0)   type(-3)
type(0)      type(True)    type(False)
```

**B9.** 🟢 `narx = 15000`, `chegirma = 0.15`. Ikkalasining turini chop eting.

**B10.** 🟢 Taxmin qiling: `int(7.99)`, `int(7.01)`, `int(-7.99)`.

**B11.** 🟡 `5 / 2` va `5 // 2` — natija va turlarini solishtiring.

**B12.** 🟡 Xatoni toping: `javob = true`

**B13.** 🟡 Bitta qatorda: `son`, `kasr`, `mantiq` — turli turlar. Turlarini chop eting.

**B14.** 🔴 Tushuntiring: `True + True`, `True + 5`, `False + 10`.

**B15.** 🔴 `12500.75` ni butun so'mga aylantirishning **ikki yo'li**.

<details>
<summary>✅ Yechimlar B8–B15</summary>

```python
# B8
type(100)     # int
type(100.0)   # float   ← .0 bor!
type(-3)      # int
type(0)       # int
type(True)    # bool
type(False)   # bool

# B9
narx = 15000
chegirma = 0.15
print(type(narx))       # <class 'int'>
print(type(chegirma))   # <class 'float'>

# B10
int(7.99)     # 7
int(7.01)     # 7
int(-7.99)    # -7    ← -8 emas! Nolga qarab qisqartiradi

# B11
print(5 / 2,  type(5 / 2))     # 2.5  <class 'float'>
print(5 // 2, type(5 // 2))    # 2    <class 'int'>
# / doim float, // butun qism

# B12
javob = True                    # true → True

# B13
son, kasr, mantiq = 42, 3.14, True
print(type(son), type(kasr), type(mantiq))

# B14
print(True + True)     # 2
print(True + 5)        # 6
print(False + 10)      # 10
# Python'da True = 1, False = 0

# B15
narx = 12500.75
print(int(narx))       # 12500   ← tashlaydi
print(round(narx))     # 12501   ← yaxlitlaydi
```

</details>

---

# C · Satrlar

## 📝 Rasmiy mashqlar (kursdan)

**C1.** `m` ga 100 bering.

**C2.** `m` yordamida `100 days` natijasini chiqaring. *(4 xil yo'l bor!)*

**C3.** `It's cool, isn't it?` chiqaring.

**C4.** Tuzating: `'Don't be shy`

**C5.** `Click "OK"` chiqaring.

**C6.** **Plyus** bilan `'Big Houses'` chiqaring.

**C7.** **Vergul** bilan `Big Houses` chiqaring.

<details>
<summary>✅ Yechimlar C1–C7</summary>

```python
# C1
m = 100

# C2 — 4 variant
print(str(m), 'days')
print(str(m), "days")
print(str(m) + ' days')
print(str(m) + " days")
# Bonus: print(m, 'days')  — str() ham kerak emas!

# C3 — 3 variant
print('It\'s cool, isn\'t it?')
print("It's cool, isn't it?")
print("It\'s cool, isn\'t it?")

# C4
"Don't be shy"

# C5
print('Click "OK"')

# C6
'Big ' + 'Houses'
# yoki: 'Big' + ' Houses'

# C7
print('Big', 'Houses')
```

</details>

## ⚡ Qo'shimcha mashqlar

**C8.** 🟢 `ism` va `familiya` ni **3 xil usulda** birlashtiring.

**C9.** 🟢 `yosh = 25`. `"Men 25 yoshdaman"` — **2 xil usulda**.

**C10.** 🟢 To'g'ri yozing:
```
a) O'zbekiston - bu mening vatanim
b) U "salom" dedi
c) It's a "big" day
```

**C11.** 🟡 Xatoni toping:
```python
narx = 5000
print("Narx: " + narx + " so'm")
```

**C12.** 🟡 `print('Red' 'car')` va `print('Red', 'car')` — nega farq qiladi?

**C13.** 🟡 **Bitta `print`** bilan chiqaring:
```
Mahsulot: Noutbuk | Narx: 8500000 so'm | Mavjud: True
```

**C14.** 🔴 `str()` **ishlatmasdan** chiqaring: `Jami: 3 ta mahsulot, 45000.5 so'm`

**C15.** 🔴 Escape belgilarini sinang va tushuntiring:
```python
print("Birinchi\nIkkinchi")
print("Ustun1\tUstun2")
print("Backslash: \\")
```

<details>
<summary>✅ Yechimlar C8–C15</summary>

```python
# C8
ism = "Ilhom"; familiya = "Islomov"
print(ism + " " + familiya)
print(ism, familiya)
print(ism + ' ' + familiya)

# C9
yosh = 25
print("Men " + str(yosh) + " yoshdaman")
print("Men", yosh, "yoshdaman")

# C10
print("O'zbekiston - bu mening vatanim")    # tashqarida "
print('U "salom" dedi')                      # tashqarida '
print('It\'s a "big" day')                   # escape + "

# C11
narx = 5000
print("Narx: " + str(narx) + " so'm")        # ✅
print("Narx:", narx, "so'm")                 # ✅ osonroq

# C12
print('Red' 'car')     # Redcar  — yonma-yon, bo'shliq YO'Q
print('Red', 'car')    # Red car — vergul bo'shliq QO'SHADI

# C13
mahsulot = "Noutbuk"; narx = 8500000; mavjud = True
print("Mahsulot:", mahsulot, "| Narx:", narx, "so'm | Mavjud:", mavjud)

# C14
soni = 3; summa = 45000.5
print("Jami:", soni, "ta mahsulot,", summa, "so'm")

# C15
print("Birinchi\nIkkinchi")   # \n = yangi qator
print("Ustun1\tUstun2")       # \t = tabulyatsiya
print("Backslash: \\")        # \\ = bitta backslash
```

</details>

---

# D · Aralash sinov

> Bu mashqlar **butun modulni** birlashtiradi.

**D1.** 🟢 Uchta o'zgaruvchi yarating — har biri **boshqa turda**. Turlarini chop eting.

**D2.** 🟢 `harorat = 23.7`. Uni butun songa aylantirib chop eting: `Harorat: 23 daraja`.

**D3.** 🟡 `soat = 14`, `daqiqa = 35`. Chiqaring: `Hozir 14:35`.

**D4.** 🟡 `narx = 12000`, `soni = 7`. Chiqaring: `7 ta x 12000 so'm = 84000 so'm`.

**D5.** 🟡 `foiz = 0.185`. Uni **foizda** chiqaring: `18.5%`.

**D6.** 🟡 `ball = 87`, `maks = 100`. Foizni hisoblab chiqaring: `Natija: 87.0%`.

**D7.** 🔴 `sekund = 3725`. Uni chiqaring: `1 soat 2 daqiqa 5 sekund`.

**D8.** 🔴 `mavjud = True`. Chiqaring: `Mahsulot mavjud: True (1 ta belgi)`.

**D9.** 🔴 Ramka chizing: yuqori va past — `=` dan 30 ta, o'rtada markazlashgan matn.

**D10.** 🔴 `kg = 5.5`, `narx_kg = 18000`. Chek qatorini chiqaring:
```
Olma      5.5 kg x 18000 = 99000.0 so'm
```

<details>
<summary>✅ Yechimlar D1–D10</summary>

```python
# D1
a, b, c = 42, 3.14, "salom"
print(type(a), type(b), type(c))

# D2
harorat = 23.7
print("Harorat:", int(harorat), "daraja")        # Harorat: 23 daraja

# D3
soat = 14; daqiqa = 35
print("Hozir " + str(soat) + ":" + str(daqiqa))  # Hozir 14:35

# D4
narx = 12000; soni = 7
print(soni, "ta x", narx, "so'm =", narx * soni, "so'm")

# D5
foiz = 0.185
print(str(foiz * 100) + "%")                     # 18.5%

# D6
ball = 87; maks = 100
print("Natija: " + str(ball / maks * 100) + "%") # Natija: 87.0%

# D7
sekund = 3725
soat = sekund // 3600
qoldiq = sekund % 3600
daqiqa = qoldiq // 60
qolgan = qoldiq % 60
print(soat, "soat", daqiqa, "daqiqa", qolgan, "sekund")

# D8
mavjud = True
print("Mahsulot mavjud:", mavjud, "(" + str(int(mavjud)) + " ta belgi)")

# D9
print("=" * 30)
print(" " * 10 + "SARLAVHA")
print("=" * 30)

# D10
kg = 5.5; narx_kg = 18000
print("Olma      " + str(kg) + " kg x " + str(narx_kg) + " = " + str(kg * narx_kg) + " so'm")
```

**D7 dagi yangi belgilar:** `//` — butun bo'lish, `%` — qoldiq. Ularni **14-modulda** batafsil ko'ramiz.

</details>

---

# E · Xatolarni toping

> Har bir kodda **kamida bitta xato** bor. Xato **turini** ayting va tuzating.

**E1.**
```python
x = 5
print(X)
```

**E2.**
```python
print(George)
```

**E3.**
```python
yosh = 25
print("Yosh: " + yosh)
```

**E4.**
```python
javob = true
```

**E5.**
```python
print('It's fine')
```

**E6.**
```python
a, b = 1, 2, 3
```

**E7.**
```python
narx = 100
soni = 3
print("Jami: " + narx * soni)
```

**E8.**
```python
print("Bu qator ochilgan
```

<details>
<summary>✅ Yechimlar E1–E8</summary>

| № | Xato turi | Sabab | Tuzatish |
|---|---|---|---|
| E1 | `NameError` | Case sensitive: `X` ≠ `x` | `print(x)` |
| E2 | `NameError` | Qo'shtirnoq yo'q | `print("George")` |
| E3 | `TypeError` | int + str | `print("Yosh: " + str(yosh))` |
| E4 | `NameError` | `true` → `True` | `javob = True` |
| E5 | `SyntaxError` | Apostrof satrni yopdi | `print("It's fine")` |
| E6 | `ValueError` | 2 ta o'zgaruvchi, 3 ta qiymat | `a, b, c = 1, 2, 3` |
| E7 | `TypeError` | `narx * soni` int | `print("Jami: " + str(narx * soni))` |
| E8 | `SyntaxError` | Qo'shtirnoq yopilmagan | `print("Bu qator ochilgan")` |

```python
# To'g'ri kodlar
x = 5;                print(x)
print("George")
yosh = 25;            print("Yosh: " + str(yosh))
javob = True
print("It's fine")
a, b, c = 1, 2, 3
narx = 100; soni = 3; print("Jami: " + str(narx * soni))
print("Bu qator ochilgan")
```

</details>

---

## 🏁 O'zingizni baholang

```
A · O'zgaruvchilar     ___ / 12
B · Sonlar va Boolean  ___ / 15
C · Satrlar            ___ / 15
D · Aralash sinov      ___ / 10
E · Xatolarni toping   ___ / 8

JAMI: ___ / 60
```

| Natija | Baho |
|---|---|
| **54–60** | 🏆 A'lo — 13-modulga tayyorsiz |
| **45–53** | ✅ Yaxshi — zaif joylarni takrorlang |
| **36–44** | ⚠️ Qoniqarli — darslarni qayta o'qing |
| **< 36** | 🔄 Modulni boshidan takrorlang |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
