# 3-dars. To'xtatish so'zlarini olib tashlash

## 🎬 Boshlashdan oldin

> **"Bu darsda biz matnimizdan TO'XTATISH SO'ZLARINI olib tashlash uchun NLTK paketidan foydalanamiz."**

Bu — sizning **birinchi haqiqiy NLP kutubxonangiz**.

---

## 1. To'xtatish so'zlari nima?

> ## **"TO'XTATISH SO'ZLARI — tilda KENG TARQALGAN so'zlar bo'lib, ular KO'P MA'NO TASHIMAYDI."**
>
> **"Masalan: `and`, `of`, `a` va `to` so'zlari."**

```
"It was too far to go to the shop"
    ↑    ↑    ↑  ↑  ↑  ↑
    hammasi to'xtatish so'zlari — MA'NO bermaydi

Qoladi:  far  go  shop
         ↑ MA'NO shu yerda!
```

---

## 2. Nima uchun olib tashlaymiz?

> **"Biz bu so'zlarni olib tashlaymiz, chunki bu ma'lumotdan KO'P MURAKKABLIKNI olib tashlaydi."**
>
> ## **"Bu so'zlar matnga ko'p ma'no qo'shmaydi, shuning uchun ularni olib tashlab, bizda KICHIKROQ, TOZAROQ ma'lumot to'plami qoladi."**

> ## **"Kichikroq, tozaroq ma'lumot to'plamlari ko'pincha mashinali o'rganishda ANIQLIKNI OSHIRISHGA olib keladi va shuningdek qayta ishlash vaqtimizni TEZLASHTIRADI."**

### Uch foyda

```
1. MURAKKABLIK ↓      lug'at hajmi kamayadi
2. ANIQLIK     ↑      model muhim so'zlarga e'tibor qaratadi
3. TEZLIK      ↑      kamroq ma'lumot = tezroq hisob
```

---

## 3. Kutubxonani o'rnatish

> **"To'xtatish so'zlarini olib tashlashning birinchi qadami — kerakli paketlarni IMPORT QILISH."**
>
> **"Demak, biz NLTK paketini import qilamiz. Keyin bu paketdan Stopwords ni YUKLAB OLAMIZ."**

```python
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
```

> **"Agar ular hali yuklab olinmagan bo'lsa, o'rnatish bir necha daqiqa vaqt olishi mumkin. Va yuklab olganingizdan so'ng ularni shunchaki import qilishingiz mumkin."**

> ⚠️ **`nltk.download()`** — **bir marta** ishlatiladi. Keyin fayllar kompyuteringizda saqlanadi.

---

## 4. To'xtatish so'zlarini olish

> **"Keyin to'xtatish so'zlarimizni `en_stopwords` deb ataydigan o'zgaruvchiga biriktiramiz — chunki biz INGLIZ tilining to'xtatish so'zlaridan foydalanamiz."**
>
> **"Siz `stopwords.words()` dan foydalanasiz va qavslar ichida ishlatmoqchi bo'lgan to'xtatish so'zlari TILINI ko'rsatasiz."**

```python
en_stopwords = stopwords.words('english')
```

> **"Keyin bu to'xtatish so'zlarini chop etib, matnimizdan qaysi so'zlarni olib tashlashingizni ko'rish yaxshi."**

```python
print(len(en_stopwords), "ta")
print(en_stopwords[:20])
```

```
198 ta
['a', 'about', 'above', 'after', 'again', 'against', 'ain', 'all', 'am', 'an', 'and', 'any', 'are', 'aren', "aren't", 'as', 'at', 'be', 'because', 'been']
```

> **"Bu yerda tilda keng tarqalgan, lekin ko'pincha ko'p ma'no qo'shmaydigan bir qancha kichik so'zlar borligini ko'rishingiz mumkin."**

> ⚠️ **Diqqat:** to'xtatish so'zlari soni NLTK versiyasiga qarab **farq qilishi mumkin** *(bizda 198 ta)*.

---

## 5. Olib tashlash

> **"Demak, bu to'xtatish so'zlarini olib tashlamoqchi bo'lgan jumlani olaylik."**
>
> **"Bizning holatda: `It was too far to go to the shop and he did not want her to walk`."**

```python
sentence = "It was too far to go to the shop and he did not want her to walk"
```

> **"Keyin `sentence_no_stopwords` yaratamiz."**
>
> **"Bu yerda `join` funksiyasidan foydalanamiz va keyin jumlamiz bo'ylab aylanamiz."**
>
> **"Har bir so'zni `sentence.split()` orqali ko'rib chiqamiz — u jumlamizni ALOHIDA SO'ZLARGA ajratadi."**
>
> ## **"Va keyin jumlamizdagi har bir so'z uchun: agar so'z to'xtatish so'zlari ro'yxatida BO'LMASA — bu so'zlar birlashtiriladi. Agar so'z ro'yxatda BO'LSA — u shunchaki O'TKAZIB YUBORILADI va e'tiborsiz qoldiriladi."**

```python
sentence_no_stopwords = " ".join([w for w in sentence.split()
                                  if w not in en_stopwords])
print(sentence_no_stopwords)
```

```
It far go shop want walk
```

> **"Demak, `sentence_no_stopwords` ni chop etsak — bizda `far go shop want walk` qolganini ko'ramiz."**

### 🔑 Kodni parchalash

```python
" ".join([w for w in sentence.split() if w not in en_stopwords])
 ↑        ↑ ↑        ↑                  ↑
 |        | |        matnni so'zlarga   SHART: to'xtatish
 |        | |        ajratish            so'zi EMAS bo'lsa
 |        | list comprehension (2-darsdan!)
 |        har bir so'z
 bo'sh joy bilan BIRLASHTIRISH
```

> ⚠️ **Diqqat:** `"It"` **qoldi** — chunki ro'yxatda `"it"` (kichik harfli) bor, `"It"` esa **yo'q**!
>
> ## 🔑 **Mana nima uchun LOWERCASE birinchi qilinadi!** *(2-dars)*

---

## 6. Ro'yxatni o'zgartirish

> **"Ro'yxatdagi to'xtatish so'zlaridan MAMNUN bo'lmagan va ma'lum so'zlarni OLIB TASHLASH yoki QO'SHISH xohlagan paytlaringiz bo'lishi mumkin."**

### Olib tashlash

> **"Buni `remove` varianti bilan qila olasiz. To'xtatish so'zlari ro'yxatingizga murojaat qilasiz — bizning holatda `en_stopwords` — va `.remove()` dan foydalanasiz."**

```python
en_stopwords.remove("did")
en_stopwords.remove("not")
```

### Qo'shish

> **"Bu to'xtatish so'zlari ro'yxatiga so'zlarni qo'shish uchun `append` dan ham foydalanishingiz mumkin."**

```python
en_stopwords.append("go")
```

> **"Demak, biz `did` va `not` so'zlarini olib tashladik va `go` so'zini qo'shdik."**

```python
sentence_no_stopwords_custom = " ".join([w for w in sentence.split()
                                          if w not in en_stopwords])
print(sentence_no_stopwords_custom)
```

```
It far shop did not want walk
```

> ## **"Bizda `far shop did not want walk` qoldi — bu menimcha jumlaning MA'NOSINI biroz YAXSHIROQ ifodalaydi, ayni paytda ko'p kontekst qo'shmaydigan o'sha to'xtatish so'zlarini olib tashlab."**

---

## 7. ⚠️ ENG MUHIM: `"not"` muammosi

> ## **"`not` — to'xtatish so'zlari ro'yxatida. Lekin u INKORNI bildiradi!"**

```
"The hotel was not good"
              ↓  to'xtatish so'zlari olib tashlandi
"hotel good"
              ↓
Model:  IJOBIY  ❌❌❌
Aslida: SALBIY
```

> ## 🔑 **Shuning uchun ma'ruzachi `"not"` ni ro'yxatdan OLIB TASHLAYDI** — va **9-darsdagi amaliyotda** ham shunday qiladi.

### Boshqa xavfli to'xtatish so'zlari

| So'z | Nima uchun xavfli |
|---|---|
| `not` | **Inkor** — ma'noni teskarisiga o'giradi |
| `no` | Xuddi shunday |
| `nor` | Xuddi shunday |
| `against` | `"against the war"` — muhim ma'no |
| `very` | `"very bad"` — kuchaytiruvchi |
| `but` | `"good but expensive"` — qarama-qarshilik |

> ## 🔑 **Qoida: to'xtatish so'zlari ro'yxatini KO'R-KO'RONA ishlatmang. Vazifangizga MOSLASHTIRING.**

---

## 8. 💻 To'liq kod

```python
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

# ===== TO'XTATISH SO'ZLARI =====
en_stopwords = stopwords.words('english')
print(len(en_stopwords), "ta stop word")
print(en_stopwords[:20])

# ===== OLIB TASHLASH =====
sentence = "It was too far to go to the shop and he did not want her to walk"
sentence_no_stopwords = " ".join([w for w in sentence.split()
                                  if w not in en_stopwords])
print(repr(sentence_no_stopwords))

# ===== RO'YXATNI O'ZGARTIRISH =====
en_stopwords.remove("did")
en_stopwords.remove("not")
en_stopwords.append("go")

sentence_no_stopwords_custom = " ".join([w for w in sentence.split()
                                          if w not in en_stopwords])
print(repr(sentence_no_stopwords_custom))

# ===== LOWERCASE BILAN BIRGA (to'g'ri usul) =====
en_stopwords2 = stopwords.words('english')
sentence_togri = " ".join([w for w in sentence.lower().split()
                            if w not in en_stopwords2])
print(repr(sentence_togri))

# ===== "not" MUAMMOSI =====
sharh = "the hotel was not good"
en_sw = stopwords.words('english')

xato = " ".join([w for w in sharh.split() if w not in en_sw])
print("XATO:", repr(xato))

en_sw.remove("not")
togri = " ".join([w for w in sharh.split() if w not in en_sw])
print("TO'G'RI:", repr(togri))

# ===== BOSHQA TILLAR =====
print(len(stopwords.words('russian')), "ta rus")
print(len(stopwords.words('turkish')), "ta turk")
print(stopwords.words('russian')[:10])
```

**Natija:**

```
198 ta stop word
['a', 'about', 'above', 'after', 'again', 'against', 'ain', 'all', 'am', 'an', 'and', 'any', 'are', 'aren', "aren't", 'as', 'at', 'be', 'because', 'been']
'It far go shop want walk'
'It far shop did not want walk'
'far go shop want walk'
XATO: 'hotel good'
TO'G'RI: 'hotel not good'
151 ta rus
53 ta turk
['и', 'в', 'во', 'не', 'что', 'он', 'на', 'я', 'с', 'со']
```

> ## 🔑 **Uchinchi natijaga diqqat:** `lower()` qo'shilgach `"It"` ham yo'qoldi. Endi natija **to'liq toza**.
>
> Va **`XATO`** / **`TO'G'RI`** — bu **butun sentiment tahlilini** buzadigan yoki saqlaydigan bitta so'z.

---

## 9. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Ingliz tilida nechta to'xtatish so'zi bor?

**M2.** O'z jumlangizdan to'xtatish so'zlarini olib tashlang.

**M3.** Ro'yxatga 3 ta so'z qo'shing va olib tashlang.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.corpus import stopwords
sw = stopwords.words('english')

# M1
print(len(sw))          # 198

# M2
s = "The weather is very nice today and I want to go outside"
print(" ".join([w for w in s.lower().split() if w not in sw]))
# weather nice today want go outside

# M3
sw.append("hotel")
sw.append("room")
sw.append("stay")
print("hotel" in sw)        # True
sw.remove("hotel")
print("hotel" in sw)        # False
```

</details>

### 🟡 O'rta

**M4.** Lowercase'siz va lowercase bilan natijani solishtiring.

**M5.** `"not"` ni saqlab, sentiment natijasini solishtiring.

**M6.** To'xtatish so'zlari **nechta foizni** olib tashlaydi?

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.corpus import stopwords
sw = stopwords.words('english')
s = "It Was Too Far To Go To The Shop"

# M4
a = " ".join([w for w in s.split() if w not in sw])
b = " ".join([w for w in s.lower().split() if w not in sw])
print("Lowercase SIZ:  ", repr(a))    # 'It Was Too Far To Go To The Shop'
print("Lowercase BILAN:", repr(b))    # 'far go shop'
# ⚠️ Lowercase'siz — HECH NARSA olib tashlanmadi!

# M5
sharhlar = ["the food was good", "the food was not good"]
sw2 = stopwords.words('english')
for sh in sharhlar:
    print(repr(" ".join([w for w in sh.split() if w not in sw2])))
# 'food good'
# 'food good'    ← IKKALASI BIR XIL! ❌
sw2.remove("not")
print("---")
for sh in sharhlar:
    print(repr(" ".join([w for w in sh.split() if w not in sw2])))
# 'food good'
# 'food not good'    ✅

# M6
matn = """the quick brown fox jumps over the lazy dog and then it
runs to the forest where it is safe from all of the hunters"""
sozlar = matn.lower().split()
qolgan = [w for w in sozlar if w not in sw]
print("Jami:  ", len(sozlar))                                   # 25
print("Qolgan:", len(qolgan))                                   # 10
print("Olib tashlandi:", round((1-len(qolgan)/len(sozlar))*100), "%")   # 60 %
```

</details>

### 🔴 Qiyin

**M7.** Boshqa tillar uchun to'xtatish so'zlarini toping.

**M8.** O'zbek tili uchun to'xtatish so'zlari ro'yxatini yasang.

**M9.** Xavfli to'xtatish so'zlarini olib tashlaydigan funksiya yozing.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.corpus import stopwords

# M7
print(stopwords.fileids()[:15])
# ['albanian', 'arabic', 'azerbaijani', 'basque', 'belarusian', 'bengali',
#  'catalan', 'chinese', 'danish', 'dutch', 'english', 'finnish',
#  'french', 'german', 'greek']
print(len(stopwords.words('russian')))      # 151
print(len(stopwords.words('turkish')))      # 53
# ⚠️ O'ZBEK tili NLTK da YO'Q — o'zingiz yasashingiz kerak

# M8 — O'ZBEK TO'XTATISH SO'ZLARI
uz_stopwords = [
    "va", "bilan", "uchun", "bu", "u", "bir", "ham", "lekin",
    "ammo", "yoki", "agar", "chunki", "keyin", "oldin", "so'ng",
    "har", "hech", "faqat", "juda", "eng", "kabi", "singari",
    "men", "sen", "biz", "siz", "ular", "o'z", "shu", "ana",
    "mana", "qanday", "qachon", "qayer", "nima", "kim", "necha",
]
matn = "Bu kitob juda qiziqarli va men uni har kuni o'qiyman"
print(" ".join([w for w in matn.lower().split() if w not in uz_stopwords]))
# kitob qiziqarli uni kuni o'qiyman

# M9
def xavfsiz_stopwords(til="english"):
    """Inkor va kuchaytiruvchi so'zlarni SAQLAYDI."""
    sw = stopwords.words(til)
    saqlanadigan = ["not", "no", "nor", "against", "very", "but",
                    "never", "none", "cannot"]
    for s in saqlanadigan:
        if s in sw:
            sw.remove(s)
    return sw

sw = xavfsiz_stopwords()
print(len(sw))                              # 192
print("not" in sw, "very" in sw)            # False False
sharh = "the room was not very clean but the staff were nice"
print(" ".join([w for w in sharh.split() if w not in sw]))
# room not very clean but staff nice
# ✅ Ma'no TO'LIQ saqlandi!
```

</details>

---

## 10. 🧠 O'zini tekshirish savollari

1. To'xtatish so'zlari nima?
2. Misollar keltiring.
3. Nima uchun olib tashlaymiz?
4. Uchta foydasi qaysilar?
5. Qaysi paket ishlatiladi?
6. Ro'yxatni qanday olamiz?
7. `join` nima qiladi?
8. `split` nima qiladi?
9. Ro'yxatga qanday so'z qo'shiladi?
10. Qanday olib tashlanadi?

<details>
<summary>✅ Javoblar</summary>

1. Tilda **keng tarqalgan** so'zlar bo'lib, ular **ko'p ma'no tashimaydi**.
2. **`and`, `of`, `a`, `to`.**
3. Bu **ko'p murakkablikni** olib tashlaydi — **kichikroq, tozaroq** ma'lumot qoladi.
4. **Murakkablik ↓**, **aniqlik ↑**, **tezlik ↑**.
5. **NLTK.**
6. **`stopwords.words('english')`** — qavsda **til** ko'rsatiladi.
7. So'zlarni **birlashtiradi** (bo'sh joy bilan).
8. Jumlani **alohida so'zlarga ajratadi**.
9. **`.append()`** bilan.
10. **`.remove()`** bilan.

</details>

---

## 📌 Xulosa

```python
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

en_stopwords = stopwords.words('english')      # 198 ta

# OLIB TASHLASH
" ".join([w for w in sentence.split() if w not in en_stopwords])

sentence:  "It was too far to go to the shop and he did not want her to walk"
natija:    "It far go shop want walk"


# RO'YXATNI O'ZGARTIRISH
en_stopwords.remove("not")     ← olib tashlash
en_stopwords.append("go")      ← qo'shish

natija:    "It far shop did not want walk"


⚠️  "It" QOLDI!
   Ro'yxatda "it" bor, "It" YO'Q
   → LOWERCASE ni BIRINCHI qiling!

   sentence.lower().split()  →  "far go shop want walk"  ✅


⚠️⚠️ ENG MUHIM XAVF — "not"

"the hotel was not good"
        ↓ to'xtatish so'zlari
"hotel good"      →  model: IJOBIY  ❌❌
                     aslida: SALBIY

→ "not" ni ro'yxatdan OLIB TASHLANG!


XAVFLI TO'XTATISH SO'ZLARI
not · no · nor · against · very · but · never


UCH FOYDA
1. MURAKKABLIK ↓
2. ANIQLIK     ↑
3. TEZLIK      ↑
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| To'xtatish so'zlari | *stop words* | Ma'no bermaydigan keng tarqalgan so'zlar |
| NLTK | *Natural Language Toolkit* | NLP kutubxonasi |
| Korpus | *corpus* | Matnlar to'plami |
| `.join()` | *join* | Ro'yxatni satrga birlashtirish |
| `.split()` | *split* | Satrni ro'yxatga ajratish |
| Inkor | *negation* | `not` — ma'noni o'giradi |

---

⬅️ [Oldingi: Kichik harf](02-Lowercase.md) · ➡️ [Keyingi: Regular expressions](04-Regular-Expressions.md)
