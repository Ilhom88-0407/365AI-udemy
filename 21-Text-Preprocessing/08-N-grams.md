# 8-dars. N-grammalar

## 🎬 Boshlashdan oldin

> **"Matnimizni N-GRAMMALAR deb nomlanuvchi narsaga bo'lishimiz mumkin — bu bizga oldindan qayta ishlashimizni TEKSHIRISH, ma'lumotimiz mazmunini O'RGANISH, shuningdek mashinali o'rganish uchun YANGI XUSUSIYATLAR yaratish imkonini beradi."**

---

## 1. N-gramma nima?

> ## **"N-GRAMMA — bu shunchaki QO'SHNI `n` ta so'z yoki tokenlar KETMA-KETLIGI, bu yerda `n` — istalgan son."**

```
Matn:  "it was the best of times"

n = 1 (UNIGRAMMA):   ("it")  ("was")  ("the")  ("best")  ("of")  ("times")

n = 2 (BIGRAMMA):    ("it","was")  ("was","the")  ("the","best") ...

n = 3 (TRIGRAMMA):   ("it","was","the")  ("was","the","best") ...
```

### Atamalar

| `n` | Nom | Inglizcha |
|---|---|---|
| 1 | **Unigramma** | unigram |
| 2 | **Bigramma** | bigram |
| 3 | **Trigramma** | trigram |
| 4+ | **N-gramma** | n-gram |

> **"Terminologiya bo'yicha yana bir eslatma: bizda `unigram`, `bigram` va `trigram` iboralari bor. `n` uchdan ORTIQ bo'lganda biz shunchaki `n-gram` iborasidan foydalanamiz."**

---

## 2. Nima uchun kerak?

**Uch maqsad** *(ma'ruzachidan)*:

```
1. Oldindan qayta ishlashni TEKSHIRISH
   → to'xtatish so'zlari haqiqatan olib tashlandimi?

2. Ma'lumot mazmunini O'RGANISH
   → matnda qanday MAVZULAR bor?

3. ML uchun YANGI XUSUSIYATLAR yaratish
   → "great location" — bu bitta xususiyat bo'lishi mumkin
```

---

## 3. Import

> **"Buni qilish uchun biz uchta paketni import qilamiz: NLTK paketi, pandas paketi va matplotlib paketi."**

```python
import nltk
import pandas as pd
import matplotlib.pyplot as plt
```

> 💡 **`pd`**, **`plt`** — bu **19-modulda** o'rgangan **standart qisqartmalar**.

---

## 4. Tokenlarimiz

> **"Endi bu misol uchun ba'zi tokenlar yaratamiz. Bu tokenlar TO'LIQ oldindan qayta ishlanmagan — buni keyingi amaliy darsimizda ko'rib chiqamiz."**

```python
tokens = ['It','was','the','best','of','times','it','was','the','worst','of','times',
          'it','was','the','age','of','wisdom','it','was','the','age','of','foolishness',
          'it','was','the','epoch','of','belief','it','was','the','epoch','of','incredulity']
```

*(Bu — Charlz Dikkensning "Ikki shahar haqida hikoya" romanining mashhur boshlanishi.)*

---

## 5. Unigrammalar

> **"Demak, biz tokenlarimizni olib, bu ma'lumotdagi UNIGRAMMALARNI ko'rmoqchimiz."**
>
> **"Unigramma — bu shunchaki `n = 1` bo'lgandagi atama."**

> **"Biz pandas SERIYASINI yaratmoqchimiz. `pd.Series()` dan foydalanamiz va keyin `nltk.ngrams()` ni ishga tushiramiz."**
>
> **"Bu ikkita argument oladi: birinchisi — TOKENLAR, ikkinchisi — `n` ning QIYMATI."**

```python
unigrams = pd.Series(nltk.ngrams(tokens, 1)).value_counts()
print(unigrams[:10])
```

> **"Oxirida `value_counts()` ni qo'shamiz. Shunda u barcha unigrammalarni ko'rib chiqib, biz uchun sanaydi."**

```
(was,)      6
(the,)      6
(of,)       6
(it,)       5
(times,)    2
(age,)      2
(epoch,)    2
(It,)       1
(best,)     1
(worst,)    1
Name: count, dtype: int64
```

> **"Buni chop etganimizda eng keng tarqalgan unigrammalarni ko'ramiz. Bu holda — bizning eng keng tarqalgan tokenlarimiz, eng keng tarqalgan so'zlarimiz."**

### ⚠️ Ikki muammo ko'rinyaptimi?

**1 · `It` va `it` alohida sanalgan!**

```
(it,)  5      ← kichik harfli
(It,)  1      ← BOSH harfli
       ↑ Bular BITTA so'z bo'lishi kerak edi = 6
```

> ## 🔑 **Mana nima uchun LOWERCASE muhim** *(2-dars)*.

**2 · `was`, `the`, `of` — bularning hammasi to'xtatish so'zlari!**

> **"Va tasavvur qila olasizmi, oldindan qayta ishlashimizni tugatib, to'xtatish so'zlarimizni olib tashlaganimizdan keyin bu qanchalik BOSHQACHA ko'rinardi."**

---

## 6. Grafik chizish

> **"Bularni taqdimotlarda foydalanish uchun chiroyli diagrammalar va vizuallarga ham joylashtira olamiz."**

```python
unigrams[:10].sort_values().plot.barh(color='lightsalmon',
                                       width=.9,
                                       figsize=(12, 8))
plt.title('10 ta eng ko\'p uchraydigan unigramma')
plt.show()
```

> **"Agar top o'nta unigrammani olib, `sort_values()`, keyin `plot.barh()` dan foydalansak — bu yerda GORIZONTAL ustundan foydalanmoqchimiz."**
>
> **"Keyin grafikamizni standartdan biroz chiroyliroq qilish uchun ba'zi argumentlardan foydalanishimiz mumkin: rang `lightsalmon`, kenglik va grafik o'lchamini ko'rsatamiz."**
>
> **"Albatta, bu grafikaga SARLAVHA ham berishimiz kerak."**

### 🔑 Metodlar zanjiri

```python
unigrams[:10].sort_values().plot.barh(...)
   ↑          ↑             ↑
   kesish     tartiblash    chizish
```

Bu — **17-modulning metod** g'oyasi: har bir metod **natijani qaytaradi**, keyingisi **unga qo'llanadi**.

> ⚠️ **`sort_values()` nima uchun kerak?** Gorizontal ustunlar **pastdan yuqoriga** chiziladi. Tartiblashsiz eng katta ustun **pastda** qoladi.

---

## 7. Bigrammalar

> **"Keyin BIGRAMMALARIMIZNI hisoblashimiz mumkin. Bigramma — `n = 2` bo'lgandagi atama."**
>
> **"Demak, biz qo'shni SO'Z JUFTLIKLARINING keng tarqalgan uchrashlarini ko'ramiz."**
>
> **"Bu — bir xil kod. Biz faqat `n` ni 2 ga o'zgartiramiz va uni `bigrams` deb qayta nomlaymiz."**

```python
bigrams = pd.Series(nltk.ngrams(tokens, 2)).value_counts()
print(bigrams[:6])
```

```
(was, the)     6
(it, was)      5
(of, times)    2
(times, it)    2
(the, age)     2
(age, of)      2
Name: count, dtype: int64
```

---

## 8. Trigrammalar

> **"Yana, trigrammalarimizni hisoblashimiz mumkin. Taxmin qilgandirsiz — bu shunchaki `n = 3` bo'lganda. Demak, biz BIRGA uchraydigan uchta tokenni ko'ramiz."**

```python
trigrams = pd.Series(nltk.ngrams(tokens, 3)).value_counts()
print(trigrams[:6])
```

```
(it, was, the)       5
(of, times, it)      2
(times, it, was)     2
(was, the, age)      2
(the, age, of)       2
(was, the, epoch)    2
Name: count, dtype: int64
```

> **"Lekin siz ANCHA KATTA ma'lumot yoki ANCHA PUXTA oldindan qayta ishlangan ma'lumot bilan ishlaganingizda, bu bigramma va trigramma tahlili HAQIQATAN QIZIQARLI natijalar bera oladi."**

---

## 9. 💡 Nima uchun bigrammalar qimmatli?

**9-darsdagi amaliyotdan oldindan ko'rish** — 109 ta mehmonxona sharhida:

```
UNIGRAMMALAR:              BIGRAMMALAR:
hotel     292              great location    24
room      275              space needle      21
great     126              hotel monaco      16
not       122              staff friendly    12
stay       95              pike place        12
```

> ## 🔑 **Farqni ko'rdingizmi?**
>
> - **Unigramma** aytadi: `"great"` so'zi 126 marta uchradi
> - **Bigramma** aytadi: `"great location"` 24 marta — **mijozlar JOYLASHUVNI maqtashadi!**
>
> Bu — **haqiqiy biznes insayti**. Bir so'z buni bermaydi.

> **"Bu sizga hech qanday QIYIN yoki KO'P VAQT TALAB QILADIGAN tahlil qilmasdan ma'lumotingizda qanday MAVZULAR va TEMALAR paydo bo'layotgani haqida juda yaxshi tasavvur beradi."**

---

## 10. 💻 To'liq kod

```python
import nltk
import pandas as pd
import matplotlib.pyplot as plt

tokens = ['It','was','the','best','of','times','it','was','the','worst','of','times',
          'it','was','the','age','of','wisdom','it','was','the','age','of','foolishness',
          'it','was','the','epoch','of','belief','it','was','the','epoch','of','incredulity']

print("Jami token:", len(tokens))
print()

# ===== UNIGRAMMALAR =====
unigrams = pd.Series(nltk.ngrams(tokens, 1)).value_counts()
print(unigrams[:10])
print()

# ===== BIGRAMMALAR =====
bigrams = pd.Series(nltk.ngrams(tokens, 2)).value_counts()
print(bigrams[:6])
print()

# ===== TRIGRAMMALAR =====
trigrams = pd.Series(nltk.ngrams(tokens, 3)).value_counts()
print(trigrams[:6])
print()

# ===== GRAFIK =====
unigrams[:10].sort_values().plot.barh(color='lightsalmon',
                                       width=.9,
                                       figsize=(12, 8))
plt.title("10 ta eng ko'p uchraydigan unigramma")
plt.show()

# ===== LOWERCASE MUAMMOSI =====
tokens_lower = [t.lower() for t in tokens]
uni_lower = pd.Series(nltk.ngrams(tokens_lower, 1)).value_counts()
print("Lowercase SIZ  — 'it':", unigrams[('it',)], " 'It':", unigrams[('It',)])
print("Lowercase BILAN — 'it':", uni_lower[('it',)])
```

**Natija:**

```
Jami token: 36

(was,)      6
(the,)      6
(of,)       6
(it,)       5
(times,)    2
(age,)      2
(epoch,)    2
(It,)       1
(best,)     1
(worst,)    1
Name: count, dtype: int64

(was, the)     6
(it, was)      5
(of, times)    2
(times, it)    2
(the, age)     2
(age, of)      2
Name: count, dtype: int64

(it, was, the)       5
(of, times, it)      2
(times, it, was)     2
(was, the, age)      2
(the, age, of)       2
(was, the, epoch)    2
Name: count, dtype: int64

Lowercase SIZ  — 'it': 5  'It': 1
Lowercase BILAN — 'it': 6
```

> 📊 **Grafik** — `plt.show()` alohida oyna ochadi *(Jupyter'da hujayra ostida ko'rinadi)*.

---

## 11. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** O'z matningizdan unigrammalarni hisoblang.

**M2.** Bigrammalarni hisoblang.

**M3.** Trigrammalarni hisoblang.

<details>
<summary>✅ Yechimlar</summary>

```python
import nltk, pandas as pd

t = "the cat sat on the mat the cat ate the rat".split()

# M1
print(pd.Series(nltk.ngrams(t, 1)).value_counts()[:4])
# (the,)  4
# (cat,)  2
# (sat,)  1
# (on,)   1

# M2
print(pd.Series(nltk.ngrams(t, 2)).value_counts()[:4])
# (the, cat)  2
# (cat, sat)  1
# (sat, on)   1
# (on, the)   1

# M3
print(pd.Series(nltk.ngrams(t, 3)).value_counts()[:3])
# (the, cat, sat)  1
# (cat, sat, on)   1
# (sat, on, the)   1
```

</details>

### 🟡 O'rta

**M4.** N-grammalar sonini `n` ga qarab hisoblang.

**M5.** To'xtatish so'zlarini olib tashlab, bigrammalarni qayta hisoblang.

**M6.** Faqat **1 martadan ko'p** uchraganlarini chiqaring.

<details>
<summary>✅ Yechimlar</summary>

```python
import nltk, pandas as pd
from nltk.corpus import stopwords

t = "the cat sat on the mat the cat ate the rat".split()

# M4
for n in [1, 2, 3, 4]:
    print("n =", n, "→", len(list(nltk.ngrams(t, n))), "ta")
# n = 1 → 11 ta
# n = 2 → 10 ta
# n = 3 → 9 ta
# n = 4 → 8 ta
# 🔑 FORMULA:  len(tokens) - n + 1

# M5
sw = stopwords.words('english')
t_clean = [w for w in t if w not in sw]
print(t_clean)                  # ['cat', 'sat', 'mat', 'cat', 'ate', 'rat']
print(pd.Series(nltk.ngrams(t_clean, 2)).value_counts()[:3])
# (cat, sat)  1
# (sat, mat)  1
# (mat, cat)  1
# ⚠️ DIQQAT: "sat mat" — asl matnda YONMA-YON EMAS edi!

# M6
bi = pd.Series(nltk.ngrams(t, 2)).value_counts()
print(bi[bi > 1])
# (the, cat)  2
```

</details>

### 🔴 Qiyin

**M7.** To'xtatish so'zlarini olib tashlash bigrammalarni **buzishini** isbotlang.

**M8.** Eng ma'noli bigrammalarni **chastota** bo'yicha filtrlang.

**M9.** Unigramma va bigramma **qaysi holda** ko'proq foyda beradi?

<details>
<summary>✅ Yechimlar</summary>

```python
import nltk, pandas as pd
from nltk.corpus import stopwords
sw = stopwords.words('english')

# M7 — TO'XTATISH SO'ZLARI BIGRAMMALARNI BUZADI
matn = "the food was not good but the service was very nice"
t = matn.split()
print("XOM bigrammalar:")
for b in list(nltk.ngrams(t, 2))[:5]:
    print("  ", b)
# ('the', 'food') ('food', 'was') ('was', 'not') ('not', 'good') ('good', 'but')

t2 = [w for w in t if w not in sw]
print("TOZALANGAN:", t2)         # ['food', 'good', 'service', 'nice']
print("TOZALANGAN bigrammalar:")
for b in nltk.ngrams(t2, 2):
    print("  ", b)
# ('food', 'good')       ⚠️ "not" YO'QOLDI — ma'no TESKARISIGA!
# ('good', 'service')    ⚠️ asl matnda YONMA-YON EMAS!
# ('service', 'nice')
#
# 🔑 XULOSA: bigramma tahlili uchun to'xtatish so'zlarini
#    olib tashlash EHTIYOTKORLIK talab qiladi.
#    Kamida "not" ni SAQLANG.

# M8
tokens = ("great location great hotel great location nice room "
          "great location clean room nice staff").split()
bi = pd.Series(nltk.ngrams(tokens, 2)).value_counts()
mano = bi[bi >= 2]
print(mano)
# (great, location)  3

# M9 — QAYSI HOLDA QAYSI BIRI
#
# UNIGRAMMA foydali:
#   • Umumiy mavzuni bilish        "hotel", "room" — bu mehmonxona haqida
#   • Lug'at hajmini baholash
#   • Tozalashni tekshirish        "the" hali ham bormi?
#
# BIGRAMMA foydali:
#   • ANIQ iboralar                "great location" — nima maqtalyapti
#   • Atoqli otlar                 "space needle", "hotel monaco"
#   • Inkor                        "not clean" — SALBIY
#   • Sifat + ot juftliklari       "friendly staff"
#
# TRIGRAMMA foydali:
#   • Uzun iboralar                "walking distance from"
#   • ⚠️ Lekin KATTA ma'lumot kerak — aks holda hammasi 1 marta uchraydi
```

</details>

---

## 12. 🧠 O'zini tekshirish savollari

1. N-gramma nima?
2. Nima uchun ularni hisoblaymiz? Uch maqsad.
3. Qaysi paketlar import qilinadi?
4. Unigramma nima?
5. `nltk.ngrams()` nechta argument oladi?
6. `value_counts()` nima qiladi?
7. Bigramma va trigramma nima?
8. `n` uchdan ortiq bo'lsa nima deyiladi?

<details>
<summary>✅ Javoblar</summary>

1. **Qo'shni `n` ta so'z yoki tokenlar ketma-ketligi.**
2. (a) Oldindan qayta ishlashni **tekshirish**; (b) ma'lumot mazmunini **o'rganish**; (c) ML uchun **yangi xususiyatlar** yaratish.
3. **`nltk`**, **`pandas`**, **`matplotlib`**.
4. **`n = 1`** bo'lganda — bitta token.
5. **Ikkita:** tokenlar va `n` ning qiymati.
6. Barcha n-grammalarni **sanaydi**.
7. **`n = 2`** va **`n = 3`**.
8. Shunchaki **`n-gram`**.

</details>

---

## 📌 Xulosa

```python
import nltk, pandas as pd

pd.Series(nltk.ngrams(tokens, n)).value_counts()
                              ↑
                     1 · unigramma
                     2 · bigramma
                     3 · trigramma
                     4+ · n-gramma


"it was the best of times"

n=1:  (it) (was) (the) (best) (of) (times)
n=2:  (it,was) (was,the) (the,best) ...
n=3:  (it,was,the) (was,the,best) ...

🔑 N-GRAMMALAR SONI = len(tokens) - n + 1


UCH MAQSAD
1. Oldindan qayta ishlashni TEKSHIRISH
2. Ma'lumot MAZMUNINI o'rganish
3. ML uchun YANGI XUSUSIYATLAR


💡 BIGRAMMANING KUCHI (109 ta mehmonxona sharhi)

UNIGRAMMA:              BIGRAMMA:
great  126              great location  24  ← MIJOZLAR JOYLASHUVNI maqtaydi!
hotel  292              space needle    21
room   275              hotel monaco    16

→ Bigramma HAQIQIY biznes insaytini beradi


⚠️  IKKI OGOHLANTIRISH

1. LOWERCASE qilmasangiz:
   (it) 5  va  (It) 1     ← alohida sanaladi!

2. To'xtatish so'zlarini olib tashlash BIGRAMMALARNI BUZADI:
   "was not good"  →  "good"       inkor YO'QOLDI!
   → kamida "not" ni SAQLANG


GRAFIK
unigrams[:10].sort_values().plot.barh(color='lightsalmon',
                                       width=.9, figsize=(12,8))
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| N-gramma | *n-gram* | Qo'shni `n` ta token |
| Unigramma | *unigram* | `n = 1` |
| Bigramma | *bigram* | `n = 2` |
| Trigramma | *trigram* | `n = 3` |
| Xususiyat | *feature* | ML uchun kirish belgisi |
| Pandas seriya | *pandas Series* | Bir o'lchovli ma'lumot |
| `value_counts()` | *value counts* | Chastotani sanaydi |
| Gorizontal ustun | *horizontal bar* | `plot.barh()` |

---

⬅️ [Oldingi: Lemmatization](07-Lemmatization.md) · ➡️ [Keyingi: Amaliy vazifa](09-Practical-Task.md)
