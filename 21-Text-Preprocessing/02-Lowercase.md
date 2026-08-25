# 2-dars. Kichik harfga o'girish

## 🎬 Boshlashdan oldin

> ## **"Matn ma'lumotlari bilan ishlashda MUHIM BIRINCHI QADAM — uni KICHIK HARFGA o'girish."**

Bu — **eng oddiy**, lekin **eng ko'p unutiladigan** qadam.

---

## 1. Nima uchun buni qilamiz?

> **"Nima uchun buni qilamiz? Xo'sh, bu ma'lumotimiz va natijalarimizda IZCHILLIKNI saqlashga yordam beradi."**

> **"Matn bilan ishlaganda — bu tadqiqot tahlili bo'ladimi yoki mashinali o'rganish bo'ladimi —"**
>
> ## **"biz so'zlar BIR XIL SO'Z sifatida tushunilishi va SANALISHINI ta'minlashni xohlaymiz."**

> ## **"Modelingiz BOSH HARFLI so'zni bosh harfsiz XUDDI SHU so'zdan BOSHQACHA deb hisoblashi mumkin. Kichik harfga o'girish shunchaki MOSLIKNI ta'minlaydi."**

### Muammo

```
"Her cat"     va     "her cat"
   ↓                    ↓
"Her" ≠ "her"     ← Model uchun IKKI XIL so'z!

Chastota:
  Her : 1
  her : 1
        ↑ Aslida "her" 2 marta uchragan bo'lishi kerak edi
```

---

## 2. Ikkinchi foyda

> **"Bu shuningdek ma'lumotni QO'SHIMCHA TOZALASHNI davom ettirishni OSONLASHTIRADI — chunki biz turli REGISTRLARNI hisobga olishimiz shart emas."**

```python
# ❌ Lowercase SIZ — har bir variantni yozish kerak
toxtatish = ["the", "The", "THE", "and", "And", "AND", ...]

# ✅ Lowercase BILAN — bitta variant yetarli
toxtatish = ["the", "and", ...]
```

---

## 3. ⚠️ Lekin ehtiyot bo'ling!

> ## **"Biroq, ESDA TUTING: kichik harfga o'girish ba'zi matnning MA'NOSINI O'ZGARTIRISHI mumkin."**
>
> ## **"Masalan, BOSH HARFLI `US` — MAMLAKAT deb tushuniladi, oddiy `us` so'zidan farqli."**

| Bosh harfli | Ma'nosi | Kichik harfli | Ma'nosi |
|---|---|---|---|
| `US` | AQSh | `us` | biz |
| `Apple` | kompaniya | `apple` | olma |
| `Turkey` | Turkiya | `turkey` | kurka |
| `March` | mart | `march` | yurish |
| `Bill` | ism | `bill` | hisob |

> ## 🔑 **Bu — savdo-sotiq (*trade-off*).** Siz **izchillik** va **ma'no** orasida tanlaysiz. Ko'p hollarda **izchillik** g'olib chiqadi — lekin har doim emas.

---

## 4. Bitta jumla

> **"Python'ning ichki `lower` funksiyasidan foydalanib ma'lumotimizni kichik harfga o'girish qanchalik oson ekanini ko'raylik."**

> **"Kichik harfga o'girmoqchi bo'lgan jumlamizni yaratamiz. Bu misol uchun `Her cat's name is Luna` iborasidan foydalanamiz."**

```python
sentence = "Her cat's name is Luna"
```

> **"Keyin uni ichki `lower` funksiyasi orqali kichik harfga o'giramiz — shunchaki `sentence` dan keyin `.lower()` va bo'sh qavslar."**

```python
sentence.lower()
```

```
her cat's name is luna
```

> **"Keyin buni chop etib, bosh harfli so'zlar to'g'ri kichik harfga o'girilganini ko'ramiz."**

> 💡 **`.lower()`** — bu **17-modulda** ko'rgan **`str` sinfining metodi**. Yangi narsa emas!

---

## 5. Ro'yxat bo'ylab

> **"Buni RO'YXAT ustida ham ishlatishimiz mumkin."**
>
> **"Bu yerda bizda kichik harfga o'girmoqchi bo'lgan uchta turli jumlalar ro'yxati bor."**

```python
sentence_list = ["Her cat's name is Luna",
                 "Her dog's name is Max",
                 "The DOG is BIG"]
```

> **"`lower_sentence_list` yaratamiz va `x.lower() for x in sentence_list` ni bajaramiz."**

```python
lower_sentence_list = [x.lower() for x in sentence_list]
print(lower_sentence_list)
```

```
["her cat's name is luna", "her dog's name is max", 'the dog is big']
```

> **"Ro'yxatimizdagi hamma narsa biz uchun kichik harfga o'girilganini ko'ramiz."**

---

## 6. 🆕 List comprehension

Bu yerda **yangi sintaksis** ishlatildi:

```python
[x.lower() for x in sentence_list]
```

Bu — **list comprehension**. U **18-modulning oddiy sikliga** teng:

```python
# ODDIY SIKL (siz bilasiz)
lower_list = []
for x in sentence_list:
    lower_list.append(x.lower())

# LIST COMPREHENSION (bir qatorda)
lower_list = [x.lower() for x in sentence_list]
```

### Tuzilmasi

```
[  x.lower()      for x in sentence_list  ]
   ↑              ↑
   nima QILINADI  sikl
```

### Shart bilan

```python
[x.lower() for x in sentence_list if len(x) > 20]
                                    ↑ ixtiyoriy SHART
```

> ## 💡 **19-modulning 8-darsida Anaconda Assistant buni taklif qilgan edi.** Endi siz uni tushunasiz.

---

## 7. 💻 To'liq kod

```python
# ===== BITTA JUMLA =====
sentence = "Her cat's name is Luna"
print(sentence.lower())

# ===== RO'YXAT =====
sentence_list = ["Her cat's name is Luna",
                 "Her dog's name is Max",
                 "The DOG is BIG"]
lower_sentence_list = [x.lower() for x in sentence_list]
print(lower_sentence_list)

# ===== NIMA UCHUN KERAK — ISBOT =====
matn = "Her cat is Luna. HER dog is Max. her bird is Kiwi."

# Lowercase SIZ
ch1 = {}
for s in matn.split():
    ch1[s] = ch1.get(s, 0) + 1
print("Lowercase SIZ:", ch1.get("Her"), ch1.get("HER"), ch1.get("her"))

# Lowercase BILAN
ch2 = {}
for s in matn.lower().split():
    ch2[s] = ch2.get(s, 0) + 1
print("Lowercase BILAN:", ch2.get("her"))

# ===== BOSHQA REGISTR METODLARI =====
s = "her CAT is luna"
print(s.upper())            # BARCHASI KATTA
print(s.title())            # Har So'z Bosh Harfli
print(s.capitalize())       # Faqat birinchi harf
print(s.swapcase())         # Teskarisiga

# ===== TEKSHIRUV METODLARI =====
print("abc".islower())      # True
print("ABC".isupper())      # True
print("Abc".istitle())      # True
```

**Natija:**

```
her cat's name is luna
["her cat's name is luna", "her dog's name is max", 'the dog is big']
Lowercase SIZ: 1 1 1
Lowercase BILAN: 3
HER CAT IS LUNA
Her Cat Is Luna
Her cat is luna
HER cat IS LUNA
True
True
True
```

> ## 🔑 **Eng muhim qator:** `Lowercase SIZ: 1 1 1` va `Lowercase BILAN: 3`.
>
> Bir xil so'z **uch marta** uchragan — lekin lowercase'siz model buni **ko'rmaydi**.

---

## 8. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Bitta jumlani `.lower()` bilan o'giring.

**M2.** Beshta jumlali ro'yxatni list comprehension bilan o'giring.

**M3.** `.upper()`, `.title()`, `.capitalize()` ni sinang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print("Her CAT is Luna".lower())            # her cat is luna

# M2
r = ["Salom DUNYO", "Python Zo'r", "NLP QIZIQARLI", "AI KELAJAK", "Data SCIENCE"]
print([x.lower() for x in r])
# ['salom dunyo', "python zo'r", 'nlp qiziqarli', 'ai kelajak', 'data science']

# M3
s = "her CAT is luna"
print(s.upper())            # HER CAT IS LUNA
print(s.title())            # Her Cat Is Luna
print(s.capitalize())       # Her cat is luna
```

</details>

### 🟡 O'rta

**M4.** Lowercase'siz va lowercase bilan chastotani solishtiring.

**M5.** List comprehension'ni **oddiy sikl** bilan qayta yozing.

**M6.** Shartli list comprehension yozing.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
matn = "Python PYTHON python Python"
ch1 = {}
for s in matn.split(): ch1[s] = ch1.get(s, 0) + 1
print(ch1)          # {'Python': 2, 'PYTHON': 1, 'python': 1}

ch2 = {}
for s in matn.lower().split(): ch2[s] = ch2.get(s, 0) + 1
print(ch2)          # {'python': 4}   ✅

# M5
r = ["ABC", "DEF"]
# List comprehension:
a = [x.lower() for x in r]
# Oddiy sikl:
b = []
for x in r:
    b.append(x.lower())
print(a == b)       # True

# M6
r = ["Salom", "Hi", "Assalomu alaykum", "Hey"]
uzunlar = [x.lower() for x in r if len(x) > 3]
print(uzunlar)      # ['salom', 'assalomu alaykum']
```

</details>

### 🔴 Qiyin

**M7.** Lowercase **zarar** keltiradigan 3 ta so'z toping.

**M8.** `"US"` ni saqlab, qolganini kichik harfga o'giruvchi funksiya yozing.

**M9.** `.lower()` va `.casefold()` farqini toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
# "US"     → "us"      AQSh → biz
# "Apple"  → "apple"   kompaniya → olma
# "Turkey" → "turkey"  Turkiya → kurka
# "March"  → "march"   mart → yurish
# "Polish" → "polish"  polyakcha → sayqallash

# M8
def aqlli_lower(matn, saqlanadigan):
    natija = []
    for soz in matn.split():
        if soz in saqlanadigan:
            natija.append(soz)          # O'ZGARTIRMASDAN
        else:
            natija.append(soz.lower())
    return " ".join(natija)

print(aqlli_lower("The US is BIG and Apple is expensive", ["US", "Apple"]))
# the US is big and Apple is expensive

# M9
print("STRASSE".lower())        # strasse
print("STRASSE".casefold())     # strasse
# Ingliz tilida FARQ YO'Q.
# Nemis tilida esa:
print("ß".lower())              # ß
print("ß".casefold())           # ss    ← nemis ß = ss
# casefold() — AGRESSIVROQ, xalqaro matn uchun
```

</details>

---

## 9. 🧠 O'zini tekshirish savollari

1. Muhim birinchi qadam nima?
2. Nima uchun buni qilamiz?
3. Model bosh harfli so'zni qanday hisoblashi mumkin?
4. Ikkinchi foyda nima?
5. Qanday xavf bor?
6. `US` misolini tushuntiring.
7. Qaysi funksiya ishlatiladi?
8. Ro'yxat bo'ylab qanday qo'llaniladi?

<details>
<summary>✅ Javoblar</summary>

1. Matnni **kichik harfga** o'girish.
2. Ma'lumot va natijalarda **izchillikni** saqlash — so'zlar **bir xil so'z** sifatida sanalishi uchun.
3. Bosh harfli so'zni bosh harfsizdan **boshqacha** deb.
4. Qo'shimcha tozalashni **osonlashtiradi** — turli **registrlarni** hisobga olish shart emas.
5. Kichik harfga o'girish ba'zi matnning **ma'nosini o'zgartirishi** mumkin.
6. **`US`** bosh harfli — **mamlakat**; **`us`** — oddiy **olmosh**.
7. Ichki **`.lower()`** funksiyasi.
8. **List comprehension** bilan: `[x.lower() for x in sentence_list]`.

</details>

---

## 📌 Xulosa

```python
# BITTA JUMLA
sentence.lower()
→  "her cat's name is luna"

# RO'YXAT
[x.lower() for x in sentence_list]
→  ["her cat's...", "her dog's...", "the dog is big"]


NIMA UCHUN?
1. IZCHILLIK — "Her" va "her" BIR XIL sanalsin
2. Keyingi tozalashni OSONLASHTIRADI

Lowercase SIZ:   Her:1  HER:1  her:1     ❌
Lowercase BILAN: her:3                    ✅


⚠️  XAVF — MA'NO O'ZGARISHI
US      → us       AQSh    → biz
Apple   → apple    kompaniya → olma
Turkey  → turkey   Turkiya → kurka


🆕 LIST COMPREHENSION
[x.lower() for x in sentence_list]
 ↑         ↑
 nima      sikl

Teng:
natija = []
for x in sentence_list:
    natija.append(x.lower())


BOSHQA METODLAR
.upper()       BARCHASI KATTA
.title()       Har So'z Bosh Harfli
.capitalize()  Faqat birinchi harf
.casefold()    lower() ning AGRESSIVROQ varianti
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Kichik harf | *lowercase* | `.lower()` |
| Izchillik | *consistency* | Bir xillik |
| Moslik | *conformity* | Bir shaklga keltirish |
| Registr | *case* | Katta/kichik harf |
| List comprehension | *list comprehension* | Siklni bir qatorda yozish |
| Savdo-sotiq | *trade-off* | Ikki foyda orasida tanlov |

---

⬅️ [Oldingi: Ma'lumot tayyorlash](01-The-Importance-of-Data-Preparation.md) · ➡️ [Keyingi: To'xtatish so'zlari](03-Removing-Stop-Words.md)
