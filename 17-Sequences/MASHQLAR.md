# 📝 17-modul · Barcha mashqlar

**72 ta mashq** — 6 ta bo'lim. Yechimlar `<details>` ichida: **avval o'zingiz bajaring**.

| Bo'lim | Mavzu | Mashqlar |
|---|---|---|
| [A](#a--royxatlar) | Ro'yxatlar | 12 |
| [B](#b--metodlar) | Metodlar | 12 |
| [C](#c--kesish-slicing) | Kesish (slicing) | 14 |
| [D](#d--tuple-lar) | Tuple lar | 12 |
| [E](#e--lugatlar) | Lug'atlar | 14 |
| [F](#f--xatolarni-toping) | Xatolarni toping | 8 |
| | **JAMI** | **72** |

---

## A · Ro'yxatlar

**A1.** `Numbers` ro'yxati yarating: `10, 25, 40, 50`. *(rasmiy)*

**A2.** `2`-indeksdagi elementni chiqaring. *(rasmiy)*

**A3.** `0`-elementni chiqaring. *(rasmiy)*

**A4.** Oxiridan uchinchi elementni **manfiy indeks** bilan chiqaring. *(rasmiy)*

**A5.** `10` ni `15` bilan almashtiring. *(rasmiy)*

**A6.** `25` ni o'chiring. *(rasmiy)*

**A7.** Beshta shahardan ro'yxat yarating. Birinchi va oxirgisini chiqaring.

**A8.** Ro'yxatning **o'rtadagi** elementini formula bilan toping.

**A9.** Turli turdagi elementlardan ro'yxat yarating va turlarini chiqaring.

**A10.** Ikkita elementni ketma-ket o'chiring. Indekslar surilishini kuzating.

**A11.** Ro'yxat ichida ro'yxat yarating va ichkaridagi elementga murojaat qiling.

**A12.** Satrni `s[0] = 'X'` bilan o'zgartirib ko'ring. Ro'yxat bilan-chi?

<details>
<summary>✅ A bo'limi yechimlari</summary>

```python
# A1
Numbers = [10, 25, 40, 50]

# A2
print(Numbers[2])               # 40

# A3
print(Numbers[0])               # 10

# A4
print(Numbers[-3])              # 25
#  10   25   40   50
#  -4   -3   -2   -1

# A5
Numbers[0] = 15
print(Numbers)                  # [15, 25, 40, 50]

# A6
del Numbers[1]
print(Numbers)                  # [15, 40, 50]

# A7
sh = ["Toshkent", "Samarqand", "Buxoro", "Xiva", "Namangan"]
print(sh[0])                    # Toshkent
print(sh[-1])                   # Namangan

# A8
print(sh[len(sh) // 2])         # Buxoro

# A9
a = [10, 3.14, "salom", True]
print(type(a[0]))               # <class 'int'>
print(type(a[1]))               # <class 'float'>
print(type(a[2]))               # <class 'str'>
print(type(a[3]))               # <class 'bool'>

# A10
r = ['a', 'b', 'c', 'd', 'e']
del r[1]
print(r)                        # ['a', 'c', 'd', 'e']
del r[1]
print(r)                        # ['a', 'd', 'e']
# ⚠️ Ikkinchi marta 'c' o'chdi — indekslar SURILDI

# A11
ii = [['a', 'b'], ['c', 'd']]
print(ii[0])                    # ['a', 'b']
print(ii[0][1])                 # b

# A12
r = ['a', 'b', 'c']
r[0] = 'X'
print(r)                        # ['X', 'b', 'c']  ✅
# s = "abc";  s[0] = 'X'
# TypeError: 'str' object does not support item assignment
# RO'YXAT — MUTABLE,  SATR — IMMUTABLE
```

</details>

---

## B · Metodlar

**B1.** `Numbers` ga `100` ni `append` bilan qo'shing. *(rasmiy)*

**B2.** `extend` bilan `115` va `140` ni qo'shing. *(rasmiy)*

**B3.** `"The fourth element of the Numbers list is"` va qiymatni chiqaring. *(rasmiy)*

**B4.** `Numbers` da nechta element bor? *(rasmiy)*

**B5.** Bo'sh ro'yxat yarating va `append` bilan uchta element qo'shing.

**B6.** Ikkita ro'yxatni `extend` bilan birlashtiring.

**B7.** `append` va `extend` farqini **isbotlang**.

**B8.** `insert`, `remove`, `pop` metodlarini sinang.

**B9.** Funksiya va metod sintaksisini yonma-yon ko'rsating.

**B10.** `extend("abc")` nima qiladi? Nima uchun?

**B11.** `remove` va `del` farqini ko'rsating.

**B12.** `pop()` va `pop(0)` farqini ko'rsating.

<details>
<summary>✅ B bo'limi yechimlari</summary>

```python
# B1
Numbers = [15, 40, 50]
Numbers.append(100)
print(Numbers)                  # [15, 40, 50, 100]

# B2
Numbers.extend([115, 140])
print(Numbers)                  # [15, 40, 50, 100, 115, 140]

# B3
print('The fourth element of the Numbers list is', Numbers[3])
# The fourth element of the Numbers list is 100

# B4
print(len(Numbers))             # 6

# B5
r = []
r.append("a"); r.append("b"); r.append("c")
print(r)                        # ['a', 'b', 'c']

# B6
a = [1, 2, 3]; b = [4, 5, 6]
a.extend(b)
print(a)                        # [1, 2, 3, 4, 5, 6]

# B7
a1 = [1, 2]
a1.append([3, 4])
print(a1, len(a1))              # [1, 2, [3, 4]] 3    ← ICHMA-ICH
b1 = [1, 2]
b1.extend([3, 4])
print(b1, len(b1))              # [1, 2, 3, 4] 4      ✅

# B8
r = ['b', 'a', 'c']
r.insert(1, 'X')
print(r)                        # ['b', 'X', 'a', 'c']
r.remove('X')
print(r)                        # ['b', 'a', 'c']
print(r.pop())                  # c
print(r)                        # ['b', 'a']

# B9
s = [15, 42, 8]
print(len(s), max(s), min(s), sum(s))     # 3 42 8 65   ← FUNKSIYA
s.append(99)                              # ← METOD
print(s)                                  # [15, 42, 8, 99]

# B10
b2 = [1, 2]
b2.extend("abc")
print(b2)                       # [1, 2, 'a', 'b', 'c']
# SATR ham KETMA-KETLIK — extend uni harflarga AJRATADI

# B11
r1 = ['a', 'b', 'c']; r1.remove('b'); print(r1)     # ['a', 'c']  ← QIYMAT
r2 = ['a', 'b', 'c']; del r2[1];      print(r2)     # ['a', 'c']  ← INDEKS
# remove('z')  →  ValueError
# del r[5]     →  IndexError

# B12
r3 = ['a', 'b', 'c']
print(r3.pop())                 # c   ← OXIRGISI
print(r3.pop(0))                # a   ← BIRINCHISI
print(r3)                       # ['b']
```

</details>

---

## C · Kesish (slicing)

`Numbers = [15, 40, 50, 100, 115, 140]`

**C1.** Kesish bilan `100` va `115` ni oling. *(rasmiy)*

**C2.** Dastlabki to'rtta elementni oling. *(rasmiy)*

**C3.** 3-pozitsiyadan boshlab hammasini oling. *(rasmiy)*

**C4.** Oxirgi 4 tani oling. *(rasmiy)*

**C5.** `15` ning pozitsiyasini toping. *(rasmiy)*

**C6.** `Two_Numbers = [1,2]` va `All_Numbers` yarating. *(rasmiy)*

**C7.** Barcha sonlarni kattadan kichikka tartiblang. *(rasmiy)*

**C8.** `[10,20,30,40,50]` dan o'rtadagi uchtasini oling.

**C9.** `P[1]` va `P[1:2]` farqini ko'rsating.

**C10.** `sort()` va `sorted()` farqini isbotlang.

**C11.** Ro'yxatlar ro'yxatidan ichkaridagi elementga murojaat qiling.

**C12.** `P[:3] + P[3:]` nima beradi?

**C13.** `P[10:20]` xato beradimi? `P[10]` -chi?

**C14.** Ro'yxatning **nusxasini** oling va asl nusxaga ta'sir qilmasligini isbotlang.

<details>
<summary>✅ C bo'limi yechimlari</summary>

```python
Numbers = [15, 40, 50, 100, 115, 140]

# C1
print(Numbers[3:5])             # [100, 115]

# C2
print(Numbers[:4])              # [15, 40, 50, 100]

# C3
print(Numbers[3:])              # [100, 115, 140]

# C4
print(Numbers[-4:])             # [50, 100, 115, 140]

# C5
print(Numbers.index(15))        # 0

# C6
Two_Numbers = [1, 2]
All_Numbers = [Two_Numbers, Numbers]
print(All_Numbers)
# [[1, 2], [15, 40, 50, 100, 115, 140]]

# C7
Numbers.sort(reverse=True)
print(Numbers)                  # [140, 115, 100, 50, 40, 15]

# C8
r = [10, 20, 30, 40, 50]
print(r[1:4])                   # [20, 30, 40]

# C9
P = ['a', 'b', 'c']
print(P[1], type(P[1]))         # b <class 'str'>     ← ELEMENT
print(P[1:2], type(P[1:2]))     # ['b'] <class 'list'>  ← RO'YXAT

# C10
x = [3, 1, 2]
print(x.sort())                 # None    ← QAYTARMAYDI
print(x)                        # [1, 2, 3]  ← O'ZINI o'zgartirdi
y = [3, 1, 2]
print(sorted(y))                # [1, 2, 3]  ← YANGI ro'yxat
print(y)                        # [3, 1, 2]  ← o'zgarmadi

# C11
g = [['Ali', 'Vali'], ['Hasan', 'Husan']]
print(g[0][1])                  # Vali
print(g[1][0])                  # Hasan
print(len(g))                   # 2   ← 4 emas!

# C12
PP = ['a', 'b', 'c', 'd', 'e']
print(PP[:3] + PP[3:])          # ['a', 'b', 'c', 'd', 'e']
# BUTUN ro'yxat — hech narsa tushmaydi, takrorlanmaydi

# C13
print(PP[10:20])                # []           ← KESISH xato bermaydi
# print(PP[10])                 # IndexError   ← INDEKSLASH beradi

# C14
asl = ['a', 'b', 'c']
nusxa = asl[:]
nusxa[0] = 'X'
print(asl)                      # ['a', 'b', 'c']   ✅ o'zgarmadi
print(nusxa)                    # ['X', 'b', 'c']
# ⚠️ Oddiy biriktirish NUSXA EMAS:
asl2 = ['a', 'b', 'c']
n2 = asl2
n2[0] = 'X'
print(asl2)                     # ['X', 'b', 'c']   😱 O'ZGARDI
print(asl2 is n2)               # True
```

</details>

---

## D · Tuple lar

**D1.** `Cars` tuple yarating: `"BMW"`, `"Dodge"`, `"Ford"` — **ikki xil** usulda. *(rasmiy)*

**D2.** Ikkinchi elementga murojaat qiling. *(rasmiy)*

**D3.** `'Peter,24'` dan `name` va `age` ni ajrating. *(rasmiy)*

**D4.** To'g'ri to'rtburchakning yuzasi va perimetrini qaytaruvchi funksiya. *(rasmiy)*

**D5.** Tuple'ni indekslang va kesing.

**D6.** Tuple'ni o'zgartirishga urinib ko'ring. Qanday xato?

**D7.** Funksiya yozing — **uchta** qiymat qaytarsin (min, max, o'rtacha).

**D8.** `split()` bilan sanani kun/oy/yilga ajrating.

**D9.** Tuple biriktirish bilan ikki o'zgaruvchini almashtiring.

**D10.** `(5)` va `(5,)` farqini ko'rsating.

**D11.** Tuple ichida ro'yxat bo'lsa — uni o'zgartirib bo'ladimi?

**D12.** Tuple'larni ro'yxatga joylang.

<details>
<summary>✅ D bo'limi yechimlari</summary>

```python
# D1
Cars = "BMW", "Dodge", "Ford"
print(Cars)                     # ('BMW', 'Dodge', 'Ford')
Cars2 = ("BMW", "Dodge", "Ford")
print(Cars2)                    # ('BMW', 'Dodge', 'Ford')
print(Cars == Cars2)            # True

# D2
print(Cars[1])                  # Dodge

# D3
name, age = 'Peter,24'.split(',')
print(name)                     # Peter
print(age)                      # 24
# ⚠️ name, age = 'Peter,24'  →  ValueError

# D4
def rectangle_info(x, y):
    A = x * y
    P = 2 * (x + y)
    print("Area and Parameter:")
    return A, P
print(rectangle_info(2, 10))
# Area and Parameter:
# (20, 24)

# D5
t = ("Toshkent", "Samarqand", "Buxoro")
print(t[0])                     # Toshkent
print(t[-1])                    # Buxoro
print(t[0:2])                   # ('Toshkent', 'Samarqand')
print(len(t))                   # 3

# D6
# t[0] = "Xiva"    →  TypeError: 'tuple' object does not support item assignment
# t.append("Xiva") →  AttributeError: 'tuple' object has no attribute 'append'

# D7
def statistika(sonlar):
    return min(sonlar), max(sonlar), sum(sonlar) / len(sonlar)
print(statistika([15, 42, 8, 31]))          # (8, 42, 24.0)
mn, mx, o = statistika([15, 42, 8, 31])
print(mn, mx, o)                            # 8 42 24.0

# D8
kun, oy, yil = "25.08.2026".split('.')
print(kun, oy, yil)             # 25 08 2026
print(int(yil) + 1)             # 2027

# D9
a, b = "birinchi", "ikkinchi"
a, b = b, a
print(a, b)                     # ikkinchi birinchi

# D10
print(type((5)))                # <class 'int'>     ← TUPLE EMAS
print(type((5,)))               # <class 'tuple'>   ✅ VERGUL
print(len((5,)))                # 1

# D11 — HA, chunki RO'YXAT o'zgaruvchan
t2 = (1, 2, [3, 4])
t2[2][0] = 99
print(t2)                       # (1, 2, [99, 4])
# t2[0] = 99  →  TypeError

# D12
x = (40, 41, 42)
y = (50, 51, 52)
L = [x, y]
print(L)                        # [(40, 41, 42), (50, 51, 52)]
print(L[0][1])                  # 41
```

</details>

---

## E · Lug'atlar

`Menu = {'meal_1':'Spaghetti', 'meal_2':'Fries', 'meal_3':'Hamburger', 'meal_4':'Lasagna'}`

**E1.** Ikkinchi taom qaysi? *(rasmiy)*

**E2.** `"Soup"` ni qo'shing. *(rasmiy)*

**E3.** Hamburger'ni Cheeseburger bilan almashtiring. *(rasmiy)*

**E4.** `Desserts` ro'yxatini oltinchi taom sifatida qo'shing. *(rasmiy)*

**E5.** `Price_list` yarating — 5 ta taom va narxlari. *(rasmiy)*

**E6.** `.get()` bilan Spaghetti narxini tekshiring. *(rasmiy)*

**E7.** Uchta mamlakat-poytaxt lug'ati yarating.

**E8.** Yangi mamlakat qo'shing va bittasining poytaxtini almashtiring.

**E9.** `[ ]` va `.get()` farqini **isbotlang**.

**E10.** Qiymat sifatida **ro'yxat** bo'lgan lug'at yarating.

**E11.** `.keys()`, `.values()` va `in` ni sinang.

**E12.** Bir xil kalitni **ikki marta** qo'ysangiz nima bo'ladi?

**E13.** Ro'yxatni kalit sifatida ishlatib ko'ring. Tuple-chi?

**E14.** Ikki lug'atni birlashtiring.

<details>
<summary>✅ E bo'limi yechimlari</summary>

```python
Menu = {'meal_1':'Spaghetti', 'meal_2':'Fries', 'meal_3':'Hamburger', 'meal_4':'Lasagna'}

# E1
print(Menu['meal_2'])           # Fries

# E2
Menu['meal_5'] = "Soup"
print(Menu)

# E3
Menu['meal_3'] = 'Cheesburger'
print(Menu)

# E4
Dessert = ['Pancakes', 'Ice-cream', 'Tiramisu']
Menu['meal_6'] = Dessert
print(Menu)

# E5
Price_list = {}
Price_list['Spaghetti'] = 10
Price_list['Fries'] = 5
Price_list['Cheesburger'] = 8
Price_list['Lasagna'] = 12
Price_list['Soup'] = 5
print(Price_list)
# {'Spaghetti': 10, 'Fries': 5, 'Cheesburger': 8, 'Lasagna': 12, 'Soup': 5}
# 💡 Kursda alifbo tartibida ko'rsatilgan — bu ESKI Python.
#    Python 3.7+ da QO'SHILISH tartibi saqlanadi.

# E6
print(Price_list.get('Spaghetti'))          # 10

# E7
p = {"O'zbekiston": "Toshkent", "Qozog'iston": "Ostona", "Qirg'iziston": "Bishkek"}
print(p["O'zbekiston"])         # Toshkent

# E8
p["Tojikiston"] = "Dushanbe"
p["Qozog'iston"] = "Astana"
print(len(p))                   # 4

# E9
d = {'a': 1, 'b': 2}
print(d.get('z'))               # None
print(d.get('z', 'topilmadi'))  # topilmadi
# print(d['z'])  →  KeyError: 'z'

# E10
g = {'A-guruh': ['Ali', 'Vali', 'Hasan'], 'B-guruh': ['Husan', 'Karim']}
print(g['A-guruh'])             # ['Ali', 'Vali', 'Hasan']
print(g['A-guruh'][0])          # Ali
print(len(g['A-guruh']))        # 3
print(len(g))                   # 2   ← 5 emas!

# E11
n = {'Apple': 189.5, 'Tesla': 242.8, 'Google': 141.2}
print(list(n.keys()))           # ['Apple', 'Tesla', 'Google']
print(list(n.values()))         # [189.5, 242.8, 141.2]
print('Tesla' in n)             # True
print('Amazon' in n)            # False
print(max(n.values()))          # 242.8
print(sum(n.values()))          # 573.5

# E12
d2 = {'a': 1, 'a': 2}
print(d2)                       # {'a': 2}   ← OXIRGISI g'olib

# E13
# {[1, 2]: 'x'}  →  TypeError: unhashable type: 'list'
d3 = {(1, 2): 'qiymat'}         # TUPLE bo'ladi ✅
print(d3[(1, 2)])               # qiymat

# E14
a = {'x': 1, 'y': 2}
b = {'z': 3}
a.update(b)
print(a)                        # {'x': 1, 'y': 2, 'z': 3}
```

</details>

---

## F · Xatolarni toping

**F1.**
```python
P = ('John', 'Leila', 'Maria')
P.append('Dwayne')
```

**F2.**
```python
P = ['John', 'Leila', 'Maria']
print(P[3])
```

**F3.**
```python
P = ['John', 'Leila']
P.extend('Dwayne')
```

**F4.**
```python
d = {'k1': 'cat'}
print(d['k2'])
```

**F5.**
```python
d = ('k1': 'cat', 'k2': 'dog')
```

**F6.**
```python
P = [3, 1, 2]
yangi = P.sort()
print(yangi[0])
```

**F7.**
```python
t = (5)
print(len(t))
```

**F8.**
```python
P = ['a', 'b', 'c']
P.remove('z')
```

<details>
<summary>✅ F bo'limi yechimlari</summary>

```python
# F1 — TUPLE o'zgarmas
# AttributeError: 'tuple' object has no attribute 'append'
P = ['John', 'Leila', 'Maria']      # RO'YXAT qilish kerak
P.append('Dwayne')
print(P)                            # ['John', 'Leila', 'Maria', 'Dwayne']

# F2 — 3 element, indekslar 0..2
P = ['John', 'Leila', 'Maria']
print(P[2])                         # Maria
print(P[-1])                        # Maria
# P[3]  →  IndexError: list index out of range

# F3 — extend satrni HARFLARGA ajratadi
P = ['John', 'Leila']
P.append('Dwayne')                  # BITTA element uchun append
print(P)                            # ['John', 'Leila', 'Dwayne']
# P.extend('Dwayne')  →  ['John','Leila','D','w','a','y','n','e']

# F4 — kalit yo'q
d = {'k1': 'cat'}
print(d.get('k2'))                  # None    ✅ xatosiz
# d['k2']  →  KeyError: 'k2'

# F5 — lug'at uchun FIGURALI qavslar
d = {'k1': 'cat', 'k2': 'dog'}
print(d)                            # {'k1': 'cat', 'k2': 'dog'}
# ( ) bilan  →  SyntaxError

# F6 — sort() None qaytaradi
P = [3, 1, 2]
P.sort()
print(P[0])                         # 1
# yoki:
P2 = [3, 1, 2]
yangi = sorted(P2)
print(yangi[0])                     # 1

# F7 — (5) tuple EMAS
t = (5,)                            # VERGUL kerak
print(len(t))                       # 1
# len((5))  →  TypeError: object of type 'int' has no len()

# F8 — 'z' ro'yxatda yo'q
P = ['a', 'b', 'c']
if 'z' in P:
    P.remove('z')
print(P)                            # ['a', 'b', 'c']
# P.remove('z')  →  ValueError: list.remove(x): x not in list
```

</details>

---

## 🎯 O'zingizni baholang

Har bir to'g'ri javob — **1 ball**. Jami: **72**.

| Ball | Baho | Nima qilish kerak |
|---|---|---|
| **65–72** | 🏆 **A'lo** | 18-modulga o'ting |
| **54–64** | 🥈 **Yaxshi** | Xato qilgan bo'limlarni takrorlang |
| **43–53** | 🥉 **Qoniqarli** | Darslarni qayta o'qing |
| **0–42** | 📚 **Takrorlash kerak** | Modulni boshidan o'ting |

### Bo'limlar bo'yicha tahlil

| Bo'lim | Ballim | Zaif bo'lsa |
|---|---|---|
| A · Ro'yxatlar | ___ / 12 | [1-dars](01-Lists.md) |
| B · Metodlar | ___ / 12 | [2-dars](02-Using-Methods.md) |
| C · Kesish | ___ / 14 | [3-dars](03-List-Slicing.md) |
| D · Tuple lar | ___ / 12 | [4-dars](04-Tuples.md) |
| E · Lug'atlar | ___ / 14 | [5-dars](05-Dictionaries.md) |
| F · Xatolar | ___ / 8 | Barcha darslar |

---

⬅️ [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
