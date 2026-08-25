# 3-dars. TF-IDF

## 🎬 Boshlashdan oldin

> **"TF-IDF dan matningizni vektorlashtirish usuli sifatida foydalanish — So'zlar xaltasi modeliga qaraganda KO'PROQ KONTEKSTNI SAQLASHNING ajoyib usuli."**
>
> **"TF-IDF — TERM FREQUENCY, INVERSE DOCUMENT FREQUENCY degani."**
>
> ## **"U ma'lumot to'plamimizdagi har bir satr yoki hujjat uchun so'zning MUHIMLIGINI hisoblaydi — u UMUMAN qanchalik tez-tez uchrashi orqali."**

---

## 1. Ikkita qism

> **"U qanday ishlashini tushunish uchun TERM FREQUENCY va INVERSE DOCUMENT FREQUENCY deganda nimani nazarda tutayotganimizni tushunishimiz kerak."**

![TF-IDF formulasi](assets/02-tfidf-formula.svg)

---

## 2. TF — Term Frequency

> **"Term frequency — bu so'zning HUJJATDA necha marta paydo bo'lishi. Ya'ni bu alohida matn bo'lagi — bu ma'lumotimizdagi satrmi yoki ro'yxatdagi elementmi."**
>
> **"U shunday hisoblanadi: TF(term) = terminning hujjatda paydo bo'lish soni / o'sha hujjatdagi elementlarning umumiy soni."**

```
                 so'z hujjatda necha marta
   TF(so'z) = ────────────────────────────────
                 hujjatdagi JAMI so'zlar
```

### Misol

```
Hujjat:  "the cat sat on the mat"     (6 ta so'z)

TF("the")  =  2 / 6  =  0.333       ← 2 marta
TF("cat")  =  1 / 6  =  0.167       ← 1 marta
TF("mat")  =  1 / 6  =  0.167
```

> ## 🔑 **Nima uchun bo'linadi?** Chunki **uzun** hujjatda har bir so'z tabiiy ravishda ko'proq uchraydi. Bo'lish **hujjat uzunligini tenglashtiradi**.

```
"the cat"                        →  TF("the") = 1/2 = 0.500
"the cat sat on the big red mat" →  TF("the") = 2/8 = 0.250
                                        ↑
   Ikkinchisida "the" KO'PROQ (2 marta), lekin ULUSHI KAMROQ.
```

---

## 3. IDF — Inverse Document Frequency

> **"Inverse document frequency — bu har bir terminning har bir hujjatdagi MUHIMLIGI o'lchovi."**
>
> **"U shunday hisoblanadi: IDF(term) — bu hujjatlarning UMUMIY sonining o'sha terminni O'Z ICHIGA OLGAN hujjatlar soniga bo'lgan nisbatining LOGARIFMI."**

```
                    ⎛  JAMI hujjatlar soni       ⎞
   IDF(so'z) = log ⎜ ─────────────────────────── ⎟
                    ⎝ so'z BOR hujjatlar soni    ⎠
```

> **"Masalan, bu ma'lumot to'plamidagi qatorlar soni bo'lishi mumkin, qidirayotgan aniq terminni o'z ichiga olgan qatorlar soniga bo'lingan."**

### Misol — 6 ta hujjat

```
"the"    →  6 ta hujjatda bor   →  IDF = log(6/6) = log(1)   = 0.00   ⬇⬇
"he"     →  3 ta hujjatda bor   →  IDF = log(6/3) = log(2)   = 0.69
"shark"  →  1 ta hujjatda bor   →  IDF = log(6/1) = log(6)   = 1.79   ⬆⬆
```

### 🔑 Logarifm nima qiladi?

```
Bo'linma      log(bo'linma)
────────      ─────────────
   1              0.00      ← so'z HAMMA joyda  →  0 ball!
   2              0.69
   6              1.79
 100              4.61
```

> ## 💡 **Logarifm o'sishni "yumshatadi".** Agar so'z **1000 ta** hujjatdan **1 tasida** bo'lsa, IDF `log(1000)=6.9` — **10 000 tadan 1 tasida** bo'lsa `log(10000)=9.2`. **10 baravar** noyobroq, lekin ball atigi **1.3 ga** oshdi. Bu — **muvozanat**.

---

## 4. Ikkalasini ko'paytiramiz

```
   TF-IDF(so'z, hujjat)  =  TF(so'z, hujjat)  ×  IDF(so'z)
                              ↑                    ↑
                     "bu hujjatda ko'pmi?"   "boshqalarda kammi?"
```

> **"Keyin bu har bir hujjatdagi har bir termindan o'tadi va har bir hujjat uchun har bir terminga ball hisoblaydi."**
>
> ## **"Hisoblangandan so'ng, KENG TARQALGAN so'zlar PASTROQ ball oladi — bu KAMROQ MUHIMLIKNI anglatadi. KAM UCHRAYDIGAN so'zlar YUQORIROQ ball oladi."**

### To'rtta holat

| TF *(bu hujjatda)* | IDF *(boshqalarda)* | Natija | Misol |
|---|---|---|---|
| ⬆ Ko'p | ⬆ Noyob | ## **ENG YUQORI** ⭐ | `cockroach` 🪳 sharhda 3 marta |
| ⬆ Ko'p | ⬇ Hamma joyda | Past | `the` |
| ⬇ Kam | ⬆ Noyob | O'rta | `cockroach` 1 marta |
| ⬇ Kam | ⬇ Hamma joyda | ## **ENG PAST** | `the` 1 marta |

> ## 💡 **Eng yuqori ball:** so'z **shu hujjatda ko'p**, lekin **boshqalarida yo'q**. Aynan shu — **hujjatni ajratib turadigan** so'z.

---

## 5. ⚠️ sklearn formulani biroz O'ZGARTIRGAN

Yuqoridagi formula — **klassik** versiya. `sklearn` esa **silliqlangan** *(smoothed)* variantdan foydalanadi:

```
                    ⎛  1 + N   ⎞
   IDF(so'z) = ln ⎜ ────────── ⎟  +  1
                    ⎝  1 + df   ⎠

   N  = jami hujjatlar
   df = so'z bor hujjatlar soni
```

### Nima uchun `+1`?

```
Klassik:   "the" hamma joyda  →  IDF = log(6/6) = 0
                                             ↑
                          BALL NOL! So'z BUTUNLAY yo'qoladi.

sklearn:   "the" hamma joyda  →  IDF = ln(7/7) + 1 = 1.0
                                             ↑
                          Ball KICHIK, lekin NOL EMAS.
```

**Tekshiramiz:**

```python
import numpy as np
print("IDF('the')   =", np.log((1+6)/(1+6)) + 1)      # 6 tadan 6 tasida
print("IDF('shark') =", round(np.log((1+6)/(1+1)) + 1, 4))   # 6 tadan 1 tasida
```

```
IDF('the')   = 1.0
IDF('shark') = 2.2528
```

> ✅ Keyinroq sklearn'ning **haqiqiy** `idf_` qiymatlarini ko'ramiz — ular **aynan shunday** chiqadi.

---

## 6. Kodda

> **"Xayriyatki, sklearn paketida `TfidfVectorizer` bor — u hisob-kitoblarning ko'pini biz uchun qiladi."**

```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
```

> **"Keyin u so'zlar xaltamiz bilan DEYARLI BIR XIL ishlaydi. Avval vektorlashtirgichni ishga tushiramiz. `tfidf_vec` o'zgaruvchimizni yaratamiz va uni bo'sh qavslar bilan `TfidfVectorizer()` orqali ishga tushiramiz."**
>
> **"Keyin fit-transform qilamiz. `tfidf_vec_fit` yaratamiz va `tfidf_vec.fit_transform()` dan foydalanib ma'lumotimizga murojaat qilamiz."**
>
> **"Keyin DataFrame'imizni yaratamiz — yana avvalgidek."**

```python
tfidf_vec = TfidfVectorizer()
tfidf_vec_fit = tfidf_vec.fit_transform(data)

tfidf = pd.DataFrame(tfidf_vec_fit.toarray(),
                     columns=tfidf_vec.get_feature_names_out())

print(tfidf.shape)
```

```
(6, 71)
```

### 🔑 Kod DEYARLI BIR XIL

```python
# BAG OF WORDS
count_vec = CountVectorizer()
count_vec_fit = count_vec.fit_transform(data)
bag_of_words = pd.DataFrame(count_vec_fit.toarray(),
                            columns=count_vec.get_feature_names_out())

# TF-IDF   ← faqat NOM o'zgardi!
tfidf_vec = TfidfVectorizer()
tfidf_vec_fit = tfidf_vec.fit_transform(data)
tfidf = pd.DataFrame(tfidf_vec_fit.toarray(),
                     columns=tfidf_vec.get_feature_names_out())
```

> 💡 **`sklearn`ning kuchi shunda** — barcha vektorlashtirgichlar, modellar va o'zgartirgichlar **bir xil interfeys** bilan ishlaydi: `.fit()`, `.transform()`, `.fit_transform()`.

---

## 7. Natija

```python
print(tfidf.iloc[:, :10].round(3))
```

```
      10  about  admirable  ahead    are     as  attacks   back   bait  beach
0  0.257  0.257      0.000  0.000  0.211  0.000    0.257  0.000  0.000  0.257
1  0.000  0.000      0.294  0.000  0.000  0.000    0.000  0.000  0.000  0.000
2  0.000  0.000      0.000  0.000  0.000  0.292    0.000  0.000  0.000  0.000
3  0.000  0.000      0.000  0.000  0.222  0.000    0.000  0.000  0.000  0.000
4  0.000  0.000      0.000  0.291  0.000  0.000    0.000  0.000  0.000  0.000
5  0.000  0.000      0.000  0.000  0.000  0.179    0.000  0.218  0.218  0.000
```

> ## **"Agar buni chop etsak, bu yerda ANCHA KO'PROQ narsa sodir bo'layotganini ko'ramiz. Bu shunchaki BIRLAR VA NOLLAR EMAS. Turli so'zlar va turli hujjatlar uchun TURLI RAQAMLAR bor."**
>
> ## **"Demak, bu terminlarning turli hujjatlarda qanday ishlatilishi haqidagi kontekstning ancha ko'p qismi SAQLANIB QOLGAN. Shunday qilib, mashinali o'qitishga o'tganimizda, biz mashina tushunishi uchun ancha ko'proq nuansni saqlab qolamiz."**

---

## 8. ⭐ Eng muhim tekshiruv — `the` ustuni

```python
print(tfidf["the"].round(4))
```

```
0    0.2282
1    0.3910
2    0.1582
3    0.2406
4    0.1291
5    0.2901
```

### Bag of Words bilan yonma-yon

| Hujjat | **BOW `the`** | **TF-IDF `the`** | Hujjat uzunligi |
|---|---|---|---|
| 0 | **2** | 0.2282 | 17 |
| 1 | **3** | **0.3910** | 14 |
| 2 | **1** | 0.1582 | 9 |
| 3 | **2** | 0.2406 | 16 |
| 4 | **1** | **0.1291** | 14 |
| 5 | **3** | 0.2901 | 22 |

### 🔍 Uchta kuzatuv

**① Ballar 0 va 1 orasida** — normallashtirilgan.

**② 1-hujjatda eng yuqori (0.391)** — u yerda `the` **3 marta**, lekin hujjat **qisqa** *(14 so'z)*. Ya'ni `the` ning **ULUSHI** eng katta.

**③ 5-hujjatda ham `the` 3 marta, lekin ball 0.290** — chunki bu hujjat **eng uzun** *(22 so'z)*. `the` **suyultirildi**.

> ## 💡 **Mana TF-IDF'ning butun mohiyati:** BOW faqat *"3 marta"* deydi. TF-IDF esa *"3 marta, LEKIN hujjat uzun, VA bu so'z hamma joyda bor"* — va shunga yarasha ball beradi.

---

## 9. IDF qiymatlarini ko'ramiz

```python
idf = pd.Series(tfidf_vec.idf_,
                index=tfidf_vec.get_feature_names_out()).sort_values()

print("Eng PAST IDF (eng keng tarqalgan):")
print(idf.head(5).round(4).to_string())
print("\nEng YUQORI IDF (noyob):")
print(idf.tail(3).round(4).to_string())
```

```
Eng PAST IDF (eng keng tarqalgan):
the    1.0000
he     1.5596
to     1.5596
as     1.8473
was    1.8473

Eng YUQORI IDF (noyob):
works    2.2528
worms    2.2528
you      2.2528
```

### ✅ Formulamizni tekshiramiz

```
"the"  →  6 tadan 6 ta hujjatda
          ln((1+6)/(1+6)) + 1 = ln(1) + 1 = 0 + 1 = 1.0     ✅ MOS!

"he"   →  6 tadan 3 ta hujjatda
          ln((1+6)/(1+3)) + 1 = ln(1.75) + 1 = 1.5596       ✅ MOS!

"worms" → 6 tadan 1 ta hujjatda
          ln((1+6)/(1+1)) + 1 = ln(3.5) + 1 = 2.2528        ✅ MOS!
```

> ## 🎉 **Formula ISHLAYDI.** Endi siz TF-IDF'ni **qora quti** sifatida emas, **tushunib** ishlatasiz.

---

## 10. Har qatorning "uzunligi" = 1

```python
import numpy as np
print(np.round(np.sqrt((tfidf.values ** 2).sum(axis=1)), 4))
```

```
[1. 1. 1. 1. 1. 1.]
```

> ## 🔑 **Har bir hujjat vektori NORMALLASHTIRILGAN** — uzunligi aynan **1.0**.

**Nima uchun bu muhim?**

```
❌ NORMALLASHTIRISHSIZ:
   Uzun hujjat  →  katta ballar  →  model uni "muhimroq" deb o'ylaydi

✅ NORMALLASHTIRISH BILAN:
   Uzun ham, qisqa ham  →  uzunlik 1.0
   Faqat NISBAT muhim, absolyut qiymat emas
```

> 💡 Bu `TfidfVectorizer(norm='l2')` — **standart** sozlama. `norm=None` bilan o'chirish mumkin.

---

## 11. Bitta hujjatning eng muhim so'zlari

```python
r0 = tfidf.iloc[0].sort_values(ascending=False)
print(r0[r0 > 0].head(8).round(4).to_string())
```

```
10         0.2571
about      0.2571
attacks    0.2571
most       0.2571
from       0.2571
feet       0.2571
beach      0.2571
since      0.2571
```

```
0-hujjat: "Most shark attacks occur about 10 feet from the beach
           since that is where the people are"

Eng yuqori ball:  attacks · beach · shark · feet · 10
                        ↑
        HAMMASI shu hujjatga XOS so'zlar!

"the" esa faqat 0.2282 — pastroq.
```

> ## 🎯 **TF-IDF avtomatik ravishda "kalit so'zlarni" topdi.** Hech kim unga `the` yomon, `shark` yaxshi deb aytmadi — u buni **o'zi hisobladi**.

---

## 12. 💻 To'liq kod

```python
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

data = [' Most shark attacks occur about 10 feet from the beach since that is where the people are',
        'the efficiency with which he paired the socks in the drawer was quite admirable',
        'carol drank the blood as if she were a vampire',
        'giving directions that the mountains are to the west only works when you can see them',
        'the sign said there was road work ahead so he decided to speed up',
        'the gruff old man sat in the back of the bait shop grumbling to himself as he scooped out a handful of worms']

# ===== 3 QADAM (BOW bilan BIR XIL!) =====
tfidf_vec = TfidfVectorizer()
tfidf_vec_fit = tfidf_vec.fit_transform(data)
tfidf = pd.DataFrame(tfidf_vec_fit.toarray(),
                     columns=tfidf_vec.get_feature_names_out())

print("Shakl:", tfidf.shape)
print(tfidf.iloc[:, :10].round(3))

# ===== 'the' USTUNI =====
print("\n'the' ustuni:")
print(tfidf["the"].round(4).to_string())

# ===== IDF QIYMATLARI =====
idf = pd.Series(tfidf_vec.idf_,
                index=tfidf_vec.get_feature_names_out()).sort_values()
print("\nEng PAST IDF:")
print(idf.head(5).round(4).to_string())

# ===== NORMALLASHTIRISH TEKSHIRUVI =====
print("\nQator normalari:", np.round(np.sqrt((tfidf.values**2).sum(axis=1)), 4))

# ===== 0-HUJJATNING KALIT SO'ZLARI =====
r0 = tfidf.iloc[0].sort_values(ascending=False)
print("\n0-hujjatning eng muhim so'zlari:")
print(r0[r0 > 0].head(5).round(4).to_string())
```

---

## 13. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** BOW va TF-IDF shakllarini solishtiring.

**M2.** TF-IDF'dagi maksimal va minimal nolmas qiymatni toping.

**M3.** Har bir hujjatning eng muhim so'zini toping.

<details>
<summary>✅ Yechimlar</summary>

```python
from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer(); bow = pd.DataFrame(
    cv.fit_transform(data).toarray(), columns=cv.get_feature_names_out())

# M1
print("BOW   :", bow.shape, " qiymatlar:", bow.values.min(), "–", bow.values.max())
print("TF-IDF:", tfidf.shape, " qiymatlar:", round(tfidf.values.min(), 4),
      "–", round(tfidf.values.max(), 4))
# BOW   : (6, 71)  qiymatlar: 0 – 3
# TF-IDF: (6, 71)  qiymatlar: 0.0 – 0.4356
#
# 🔑 BIR XIL SHAKL, boshqa qiymatlar.

# M2
nolmas = tfidf.values[tfidf.values > 0]
print("MAX:", round(nolmas.max(), 4), " MIN:", round(nolmas.min(), 4))
# MAX: 0.4356   MIN: 0.1291

# M3
for i in range(6):
    eng = tfidf.iloc[i].idxmax()
    print(f"Hujjat {i}: '{eng}' ({tfidf.iloc[i].max():.4f})")
# Hujjat 0: '10' (0.2571)
# Hujjat 1: 'the' (0.3910)      ⚠️
# Hujjat 2: 'blood' (0.3565)    ✅
# Hujjat 3: 'can' (0.2710)
# Hujjat 4: 'ahead' (0.2908)    ✅
# Hujjat 5: 'of' (0.4356)       ⚠️
#
# ⚠️ 1 va 5-hujjatda G'OLIB "the" va "of" — TO'XTATISH SO'ZLARI!
#    Nima uchun? Chunki ular O'SHA hujjatlarda 3 va 2 marta TAKRORLANGAN.
#    Yuqori TF past IDF ni YENGDI.
#
# 🔑 TF-IDF SEHRLI TAYOQCHA EMAS. U to'xtatish so'zlarini
#    KAMAYTIRADI, lekin BUTUNLAY yo'q qilmaydi.
#    Shuning uchun stop_words='english' HALI HAM foydali (M5).
```

</details>

### 🟡 O'rta

**M4.** IDF formulasini **qo'lda** hisoblab tekshiring.

**M5.** `stop_words='english'` bilan solishtiring.

**M6.** Kosinus o'xshashligini BOW va TF-IDF'da solishtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
import numpy as np

# M4
N = len(data)
for so in ["the", "he", "shark"]:
    df = sum(1 for d in data if so in d.lower().split())
    qolda = np.log((1 + N) / (1 + df)) + 1
    haqiqiy = tfidf_vec.idf_[list(tfidf_vec.get_feature_names_out()).index(so)]
    print(f"{so:8s} df={df}  qo'lda={qolda:.4f}  sklearn={haqiqiy:.4f}  "
          f"{'✅' if abs(qolda-haqiqiy) < 1e-9 else '❌'}")

# M5
tv2 = TfidfVectorizer(stop_words='english')
t2 = pd.DataFrame(tv2.fit_transform(data).toarray(),
                  columns=tv2.get_feature_names_out())
print("Usiz :", tfidf.shape, " Bilan:", t2.shape)
# Usiz : (6, 71)   Bilan: (6, 39)

for i in range(6):
    print(f"Hujjat {i}: '{t2.iloc[i].idxmax()}'")
# Endi HAR BIR hujjatda g'olib — MA'NOLI so'z. "the"/"of" umuman yo'q.
#
# 💡 ENG YAXSHI AMALIYOT: TfidfVectorizer(stop_words='english')
#    Ikkala himoyani BIRGA ishlating.

# M6 — ⭐ ENG QIZIQARLI MASHQ
from sklearn.metrics.pairwise import cosine_similarity
print("BOW o'xshashligi:")
print(pd.DataFrame(cosine_similarity(bow)).round(2).to_string())
print("\nTF-IDF o'xshashligi:")
print(pd.DataFrame(cosine_similarity(tfidf)).round(2).to_string())

# BOW:                          TF-IDF:
#       0     1     2     3           0     1     2     3
# 0  1.00  0.31  0.15  0.32       0  1.00  0.09  0.04  0.15
# 1  0.31  1.00  0.22  0.32       1  0.09  1.00  0.06  0.09
# 2  0.15  0.22  1.00  0.16       2  0.04  0.06  1.00  0.04
# 3  0.32  0.32  0.16  1.00       3  0.15  0.09  0.04  1.00
#
# 🎯 MANA ISBOT!
#    BOW da 1↔5 juftligi 0.45 edi   →  TF-IDF da atigi 0.19
#    BOW da 0↔3 juftligi 0.32 edi   →  TF-IDF da 0.15
#
# 🔑 BOW jumlalarni "o'xshash" deb ko'rsatgan edi — lekin bu
#    faqat "the", "as", "in", "he" tufayli edi. SOXTA o'xshashlik.
#    TF-IDF bu so'zlarning vaznini kamaytirdi va HAQIQIY
#    (past) o'xshashlik ko'rindi.
#
#    Bu — QIDIRUV TIZIMLARI uchun hal qiluvchi ahamiyatga ega.
```

</details>

### 🔴 Qiyin

**M7.** TF-IDF'ni **noldan** o'zingiz yozing.

**M8.** Yangi hujjatni mavjud vektorlashtirgich bilan aylantiring.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7 — QO'LDA TF-IDF
import numpy as np
from collections import Counter

def qolda_tfidf(hujjatlar):
    tokenlar = [h.lower().split() for h in hujjatlar]
    lugat = sorted({w for t in tokenlar for w in t})
    N = len(hujjatlar)

    natija = []
    for t in tokenlar:
        sanoq = Counter(t)
        qator = []
        for so in lugat:
            tf = sanoq[so] / len(t)                               # TF
            df = sum(1 for x in tokenlar if so in x)
            idf = np.log((1 + N) / (1 + df)) + 1                  # IDF (sklearn usuli)
            qator.append(tf * idf)
        # L2 normallashtirish
        norma = np.sqrt(sum(x**2 for x in qator))
        natija.append([x / norma if norma else 0 for x in qator])
    return pd.DataFrame(natija, columns=lugat)

mening = qolda_tfidf(data)
print("Mening 'the':", mening["the"].round(4).tolist())
print("sklearn 'the':", tfidf["the"].round(4).tolist())
# Mening  'the': [0.2282, 0.391, 0.1519, 0.2406, 0.1291, 0.2856]
# sklearn 'the': [0.2282, 0.391, 0.1582, 0.2406, 0.1291, 0.2901]
#                    ✅      ✅      ⚠️      ✅      ✅      ⚠️
#
# 🎉 6 tadan 4 tasi AYNAN MOS KELDI!
#
# ⚠️ 2 va 5-hujjatda kichik farq bor. Sabab: sklearn 1 HARFLI
#    so'zlarni tashlab yuboradi ("a", "i" uning lug'atida YO'Q).
#    2-hujjatda "a" bor ("were a vampire"), 5-hujjatda ham.
#    Shuning uchun bizning maxrajimiz (so'zlar soni) KATTAROQ.
#
# 🔑 Formula TO'G'RI — faqat tokenizatsiya boshqacha.

# M8 — YANGI HUJJAT ⭐
yangi = ["a shark attacked a swimmer near the beach"]
yangi_vec = tfidf_vec.transform(yangi)      # ⭐ FAQAT transform!

yv = pd.DataFrame(yangi_vec.toarray(),
                  columns=tfidf_vec.get_feature_names_out())
print("Nolmas qiymatlar:")
print(yv.loc[0][yv.loc[0] > 0].sort_values(ascending=False).round(4).to_string())
# beach    0.6747
# shark    0.6747
# the      0.2995
#
# ⚠️ "swimmer", "attacked", "near", "a" — HAMMASI YO'Q!
#    Yangi hujjatning 8 ta so'zidan faqat 3 tasi tanildi.
#    Chunki ular ASL lug'atda yo'q edi.
#
# 🔑 BU — MUHIM CHEKLOV: TfidfVectorizer faqat fit paytida
#    KO'RGAN so'zlarni biladi. Yangi so'zlar E'TIBORSIZ qoldiriladi.
#    Bu "out-of-vocabulary" (OOV) muammosi deb ataladi.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. TF-IDF nimaning qisqartmasi?
2. TF qanday hisoblanadi?
3. IDF qanday hisoblanadi?
4. Nima uchun IDF'da logarifm ishlatiladi?
5. Qanday so'z **eng yuqori** TF-IDF ball oladi?
6. sklearn formulasi klassikdan nimasi bilan farq qiladi?
7. `the` ning IDF'i **1.0** — nima uchun aynan shu son?
8. Nima uchun har qator normasi 1.0?

<details>
<summary>✅ Javoblar</summary>

1. **Term Frequency – Inverse Document Frequency.**
2. So'z hujjatda **necha marta** / hujjatdagi **jami so'z**.
3. `log(jami hujjat / so'z bor hujjat)`.
4. Ballarni **muvozanatlash** uchun — juda noyob so'z **haddan tashqari** ustun kelmasin.
5. Bu hujjatda **ko'p**, lekin boshqa hujjatlarda **kam** uchraydigan so'z.
6. `+1` **silliqlash**: `ln((1+N)/(1+df)) + 1`. Shuning uchun ball **hech qachon 0 bo'lmaydi**.
7. Chunki `the` **6 tadan 6 tasida** bor: `ln(7/7) + 1 = ln(1) + 1 = 0 + 1 = 1.0`.
8. **L2 normallashtirish** *(standart)*. Shunda **uzun hujjat** faqat uzunligi tufayli **muhimroq** ko'rinmaydi.

</details>

---

## 📌 Xulosa

```python
from sklearn.feature_extraction.text import TfidfVectorizer

tfidf_vec = TfidfVectorizer()                     # 1
tfidf_vec_fit = tfidf_vec.fit_transform(data)     # 2
tfidf = pd.DataFrame(tfidf_vec_fit.toarray(),     # 3
                     columns=tfidf_vec.get_feature_names_out())
#   ↑ BAG OF WORDS bilan AYNAN BIR XIL — faqat nom o'zgardi


FORMULA

           so'z hujjatda necha marta
   TF  =  ──────────────────────────
            hujjatdagi JAMI so'z

                ⎛  1 + N   ⎞
   IDF =  ln  ⎜ ────────── ⎟  + 1        (sklearn versiyasi)
                ⎝  1 + df   ⎠

   TF-IDF  =  TF × IDF


TEKSHIRILDI
   "the"   6/6 hujjatda  →  ln(7/7)+1 = 1.0000   ✅
   "he"    3/6 hujjatda  →  ln(7/4)+1 = 1.5596   ✅
   "worms" 1/6 hujjatda  →  ln(7/2)+1 = 2.2528   ✅


NATIJA — 'the' ustuni

  hujjat  BOW   TF-IDF   uzunlik
    0      2    0.2282     17
    1      3    0.3910     14    ← eng yuqori (qisqa hujjat, 3 marta)
    2      1    0.1582      9
    3      2    0.2406     16
    4      1    0.1291     14    ← eng past
    5      3    0.2901     22    ← 3 marta, lekin UZUN hujjat

  BOW:     "3 marta"
  TF-IDF:  "3 marta, LEKIN hujjat uzun, VA so'z hamma joyda"


HAR QATOR NORMASI = 1.0   (L2 normallashtirish)
  → uzun hujjat faqat uzunligi tufayli ustun kelmaydi


⚠️ CHEKLOV — OOV (out-of-vocabulary)
   transform() faqat FIT paytida ko'rilgan so'zlarni biladi.
   Yangi so'zlar E'TIBORSIZ qoldiriladi.
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| TF | *term frequency* | So'zning hujjatdagi ulushi |
| IDF | *inverse document frequency* | So'zning noyobligi |
| `df` | *document frequency* | So'z nechta hujjatda bor |
| Silliqlash | *smoothing* | `+1` qo'shish |
| Normallashtirish | *normalization* | Vektor uzunligini 1 ga keltirish |
| L2 norma | *L2 norm* | Vektor uzunligi *(evklid)* |
| OOV | *out-of-vocabulary* | Lug'atda yo'q so'z |

---

⬅️ [Oldingi: Bag of Words](02-Bag-of-Words.md) · 🏠 [Modul boshiga](README.md)

📝 **Endi amaliyot:** [Barcha mashqlar](MASHQLAR.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
