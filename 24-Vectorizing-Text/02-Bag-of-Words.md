# 2-dars. Bag of Words modeli

## 🎬 Boshlashdan oldin

> **"Keling, So'zlar xaltasi modelimizni yaratishni boshlaylik. Bizga pandas paketi kerak bo'ladi, keyin `sklearn.feature_extraction.text` paketidan keladigan `CountVectorizer` funksiyasidan foydalanamiz."**

📁 **Ma'lumot:** [`data/sentences.txt`](data/sentences.txt) — **6 ta tasodifiy jumla**.

---

## 1. Import

```python
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
```

> 🔑 **`sklearn`** *(scikit-learn)* — Python'dagi **asosiy** mashinali o'qitish kutubxonasi. Bu modulda uni **birinchi marta** ishlatamiz, keyingi modullarda esa **doim** ishlatamiz.

```bash
pip install scikit-learn pandas
```

---

## 2. Ma'lumot

> **"Bu misol uchun foydalanadigan ma'lumot — atigi OLTITA TASODIFIY jumla. Ular shunchaki tasodifiy generatsiya qilingan, shunda nima chiqishini ko'ramiz."**

```python
data = [' Most shark attacks occur about 10 feet from the beach since that is where the people are',
        'the efficiency with which he paired the socks in the drawer was quite admirable',
        'carol drank the blood as if she were a vampire',
        'giving directions that the mountains are to the west only works when you can see them',
        'the sign said there was road work ahead so he decided to speed up',
        'the gruff old man sat in the back of the bait shop grumbling to himself as he scooped out a handful of worms']
```

| № | Jumla | Tarjima |
|---|---|---|
| 0 | *Most shark attacks occur about 10 feet from the beach...* | Akula hujumlarining ko'pi qirg'oqdan 10 fut narida sodir bo'ladi... |
| 1 | *The efficiency with which he paired the socks...* | U paypoqlarni juftlashtirgan samaradorlik... |
| 2 | *Carol drank the blood as if she were a vampire* | Kerol vampirdek qon ichdi |
| 3 | *Giving directions that the mountains are to the west...* | Tog'lar g'arbda deb yo'l ko'rsatish... |
| 4 | *The sign said there was road work ahead...* | Belgi oldinda yo'l ishlari borligini aytdi... |
| 5 | *The gruff old man sat in the back of the bait shop...* | Qo'pol chol qarmoq do'konining orqasida o'tirardi... |

> 💡 **Jumlalar bir-biriga bog'liq emas** — bu **ataylab**. Shunda har bir jumlaning **o'z so'zlari** bo'ladi va natijani ko'rish oson.

---

## 3. Uch qadamda tayyor

> **"So'zlar xaltasini yaratish JUDA ODDIY."**

### 1-qadam — ishga tushirish

> **"Birinchi qadam — `CountVectorizer` ni ishga tushirish. `count_vec` o'zgaruvchimizni yaratamiz va uni bo'sh qavslar bilan `CountVectorizer()` orqali ishga tushiramiz."**

```python
count_vec = CountVectorizer()
```

### 2-qadam — fit + transform

> **"Keyin buni ma'lumotimizga MOSLASHTIRMOQCHIMIZ. `count_vec_fit` yaratamiz va ishga tushirilgan `count_vec` ga murojaat qilib `.fit_transform()` ni chaqiramiz."**
>
> **"Bu sklearn'ning `fit` va `transform` funksiyalaridan foydalanadi — lekin `fit_transform` orqali biz buni HAMMASINI BITTA TEZ QATORDA qila olamiz."**

```python
count_vec_fit = count_vec.fit_transform(data)
```

### 🔑 `fit` va `transform` — nima farqi?

```
fit()        →  LUG'ATNI o'rganadi
                "qanday so'zlar bor? har biriga qaysi ustun?"

transform()  →  Matnni RAQAMGA aylantiradi
                o'rganilgan lug'at asosida

fit_transform() → IKKALASI BIRGA ⭐
```

> ## ⚠️ **JUDA MUHIM QOIDA** *(keyingi modullarda kerak bo'ladi)*:
>
> ```python
> X_train = vec.fit_transform(train_data)   # ✅ o'rgatuvchi ma'lumot: fit_transform
> X_test  = vec.transform(test_data)        # ✅ sinov ma'lumoti: FAQAT transform
> ```
>
> Sinov ma'lumotida `fit` qilsangiz — **yangi lug'at** yaratiladi va ustunlar **mos kelmaydi**. Bu — boshlovchilarning **eng keng tarqalgan xatosi**.

### 3-qadam — DataFrame

> **"Keyin so'zlar xaltamizni yaratamiz va uni pandas DataFrame'da xohlaymiz. `pd.DataFrame()` dan foydalanamiz. Ma'lumotimiz `count_vec_fit` dan keladi va DataFrame'ga to'g'ri formatda kirishi uchun `.toarray()` ishlatamiz."**
>
> **"Ustun nomlariga `count_vec` dan murojaat qilish mumkin — `.get_feature_names_out()` orqali. Bu ma'lumotimizdagi turli so'zlarni tortib oladi va ularni to'g'ri ustun nomlariga tayinlaydi."**

```python
bag_of_words = pd.DataFrame(count_vec_fit.toarray(),
                            columns=count_vec.get_feature_names_out())

print(bag_of_words.shape)
```

```
(6, 71)
```

> 🔑 **6 ta qator** *(hujjat)* × **71 ta ustun** *(noyob so'z)*.

---

## 4. Natijani ko'ramiz

```python
print(list(bag_of_words.columns[:20]))
```

```
['10', 'about', 'admirable', 'ahead', 'are', 'as', 'attacks', 'back', 'bait',
 'beach', 'blood', 'can', 'carol', 'decided', 'directions', 'drank', 'drawer',
 'efficiency', 'feet', 'from']
```

> 💡 **Ustunlar ALIFBO TARTIBIDA** — `CountVectorizer` ularni shunday saralaydi.

```python
print(bag_of_words.iloc[:, :14])
```

```
   10  about  admirable  ahead  are  as  attacks  back  bait  beach  blood  can  carol  decided
0   1      1          0      0    1   0        1     0     0      1      0    0      0        0
1   0      0          1      0    0   0        0     0     0      0      0    0      0        0
2   0      0          0      0    0   1        0     0     0      0      1    0      1        0
3   0      0          0      0    1   0        0     0     0      0      0    1      0        0
4   0      0          0      1    0   0        0     0     0      0      0    0      0        1
5   0      0          0      0    0   1        0     1     1      0      0    0      0        0
```

### Qatorlarni o'qish

> **"Har bir QATOR — bu ma'lumotimizdagi turli matn bo'lagi."**
>
> **"Masalan, 0-qator — bu matn *'Most shark attacks occur about ten feet from the beach, since that is where the people are'*. Shunday qilib, biz bu yerda `ten`, `about`, `are`, `attacks`, `beach` so'zlari shu matnda BORLIGINI ko'rishimiz mumkin."**

```
0-QATOR:  "Most shark attacks occur about 10 feet from the beach..."
           ↓
   10=1  about=1  are=1  attacks=1  beach=1     ← BOR
   admirable=0  ahead=0  back=0  bait=0         ← YO'Q
```

> **"Har bir qator ma'lumotimizdagi har bir matn bo'lagiga, har bir USTUN esa barcha ma'lumot ichida mavjud alohida so'zlardan biriga tegishli."**

---

## 5. ⚠️ MUHIM TUZATISH — bu faqat 0 va 1 EMAS!

> **O'qituvchi shunday deydi:** *"Qiymatlar shunchaki nol va bir — bir o'sha so'z shu matn bo'lagida BORLIGINI bildiradi, nol esa BORLIGI YO'QLIGINI."*

## ❌ **Bu — noto'g'ri.**

`CountVectorizer` nomidan ko'rinib turibdiki, u **SANAYDI** — faqat borligini belgilamaydi. Tekshiramiz:

```python
print("Butun jadvaldagi MAKSIMAL qiymat:", bag_of_words.values.max())
```

```
Butun jadvaldagi MAKSIMAL qiymat: 3
```

```python
print("'the' ustuni:", bag_of_words["the"].tolist())
```

```
'the' ustuni: [2, 3, 1, 2, 1, 3]
```

### 🔍 Tekshiramiz — 1-jumlada nechta `the` bor?

```
"the efficiency with which he paired the socks in the drawer was quite admirable"
 ↑                                   ↑                ↑
 1                                   2                3

✅ HAQIQATAN 3 ta!  bag_of_words["the"][1] = 3
```

> ## 🔑 **`CountVectorizer` — bu SANOVCHI.** Agar so'z hujjatda 3 marta uchrasa — katakda **3** turadi, **1** emas.

### 💡 Faqat 0/1 kerakmi? — `binary=True`

```python
count_vec_binary = CountVectorizer(binary=True)
bow_binary = pd.DataFrame(
    count_vec_binary.fit_transform(data).toarray(),
    columns=count_vec_binary.get_feature_names_out())

print("'the' ustuni:", bow_binary["the"].tolist())
print("MAKSIMAL qiymat:", bow_binary.values.max())
```

```
'the' ustuni: [1, 1, 1, 1, 1, 1]
MAKSIMAL qiymat: 1
```

> ## ✅ **MANA endi** faqat 0 va 1. Buni ba'zan **"binary bag of words"** yoki **"one-hot"** deb atashadi.

| | `CountVectorizer()` | `CountVectorizer(binary=True)` |
|---|---|---|
| Qiymat | **Necha marta** *(0,1,2,3...)* | Faqat **bor/yo'q** *(0,1)* |
| `the` | `[2, 3, 1, 2, 1, 3]` | `[1, 1, 1, 1, 1, 1]` |
| Qachon | Takrorlanish **muhim** bo'lsa | Faqat **borligi** muhim bo'lsa |

---

## 6. Ma'lumotni tahlil qilamiz

### Har bir hujjatda nechta so'z?

```python
print(bag_of_words.sum(axis=1).tolist())
```

```
[17, 14, 9, 16, 14, 22]
```

```
0:  17 so'z   ██████████████████
1:  14 so'z   ██████████████
2:   9 so'z   █████████        ← eng qisqa
3:  16 so'z   ████████████████
4:  14 so'z   ██████████████
5:  22 so'z   ██████████████████████  ← eng uzun
```

### Eng ko'p uchraydigan so'zlar

```python
print(bag_of_words.sum(axis=0).sort_values(ascending=False).head(8))
```

```
the     12
he       3
to       3
in       2
are      2
as       2
that     2
of       2
```

### ⚠️ Mana MUAMMO

```
"the"  →  12 marta!   Barcha so'zlarning ~11%

Lekin "the" bizga NIMA aytadi?
  · Jumla nima haqida?      ❌ hech narsa
  · Jumla ijobiymi?         ❌ hech narsa
  · Jumlalarni ajratadimi?  ❌ hech narsa (hammasida bor)

U shunchaki JOY EGALLAYDI va MODELNI CHALG'ITADI.
```

> ## 💡 **Ikkita yechim bor:**
>
> **①** To'xtatish so'zlarni **o'chirish** *(21-modul)* — `CountVectorizer(stop_words='english')`
>
> **②** ## **TF-IDF ishlatish** — u `the` ga **avtomatik past ball** beradi *(keyingi dars)* ⭐

---

## 7. 🎯 Siyraklik muammosi (sparsity)

```python
jami = bag_of_words.size
nollar = (bag_of_words == 0).sum().sum()
print(f"Jami katak : {jami}")
print(f"Nollar     : {nollar}  ({nollar/jami:.1%})")
```

```
Jami katak : 426
Nollar     : 341  (80.0%)
```

```
   6 hujjat × 71 so'z = 426 katak
        ↓
   341 tasi NOL  (80.0%)
        ↓
   Faqat 85 tasi foydali
```

> ## ⚠️ **Bu — 6 ta jumla uchun.** Endi tasavvur qiling: **10 000 ta hujjat** va **50 000 ta noyob so'z**:
>
> ```
> 10 000 × 50 000 = 500 000 000 katak
> Ularning ~99.9% i — NOL
> ```
>
> Shuning uchun `sklearn` natijani **siyrak matritsa** *(sparse matrix)* sifatida saqlaydi — faqat **nolmas** qiymatlarni. `.toarray()` esa uni **to'liq** jadvalga aylantiradi — **katta ma'lumotda buni qilmang!**

```python
print(type(count_vec_fit))
print(count_vec_fit)          # faqat nolmas qiymatlar ko'rsatiladi
```

---

## 8. ⚙️ Foydali parametrlar

```python
CountVectorizer(
    stop_words='english',   # to'xtatish so'zlarni O'CHIRADI
    max_features=1000,      # faqat eng ko'p uchraydigan 1000 ta so'z
    min_df=2,               # kamida 2 ta hujjatda bo'lsin
    max_df=0.9,             # hujjatlarning 90% dan ko'pida bo'lmasin
    ngram_range=(1, 2),     # 1 va 2 so'zli birikmalar (20-modulni eslang!)
    lowercase=True,         # kichik harf (standart: True)
    binary=False,           # True = faqat 0/1
)
```

### Sinab ko'ramiz — `stop_words='english'`

```python
cv2 = CountVectorizer(stop_words='english')
bow2 = pd.DataFrame(cv2.fit_transform(data).toarray(),
                    columns=cv2.get_feature_names_out())
print("Oldin:", bag_of_words.shape, " Keyin:", bow2.shape)
print("'the' bormi?", "the" in bow2.columns)
print(bow2.sum(axis=0).sort_values(ascending=False).head(5).to_string())
```

```
Oldin: (6, 71)  Keyin: (6, 39)
'the' bormi? False
10           1
admirable    1
ahead        1
attacks      1
bait         1
```

> ## 🔑 **71 → 39 ta so'z.** `the`, `is`, `was`, `of`, `to` — **32 tasi** ketdi. Endi qolgan so'zlarning **hammasi ma'noli**.
>
> ⚠️ Va e'tibor bering: eng ko'p uchraydigan so'z endi atigi **1** marta. Ya'ni bizning 6 ta jumla **hech qanday ma'noli so'zni baham ko'rmaydi** — ular haqiqatan **tasodifiy** jumlalar.

### `ngram_range=(1, 2)` — birikmalar

```python
cv3 = CountVectorizer(ngram_range=(1, 2))
bow3 = pd.DataFrame(cv3.fit_transform(data).toarray(),
                    columns=cv3.get_feature_names_out())
print("Ustunlar:", bow3.shape[1])
print([c for c in bow3.columns if " " in c][:5])
```

```
Ustunlar: 156
['10 feet', 'about 10', 'ahead so', 'are to', 'as he']
```

> ## 💡 **Endi `"not good"` bitta ustun bo'ladi!** Bu — so'z tartibi muammosini **qisman** hal qiladi. Lekin ustunlar soni **71 → 156** ga o'sdi — bu **narxi**.

---

## 9. 💻 To'liq kod

```python
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer

data = [' Most shark attacks occur about 10 feet from the beach since that is where the people are',
        'the efficiency with which he paired the socks in the drawer was quite admirable',
        'carol drank the blood as if she were a vampire',
        'giving directions that the mountains are to the west only works when you can see them',
        'the sign said there was road work ahead so he decided to speed up',
        'the gruff old man sat in the back of the bait shop grumbling to himself as he scooped out a handful of worms']

# ===== 3 QADAM =====
count_vec = CountVectorizer()                       # 1 · ishga tushirish
count_vec_fit = count_vec.fit_transform(data)       # 2 · fit + transform
bag_of_words = pd.DataFrame(                        # 3 · DataFrame
    count_vec_fit.toarray(),
    columns=count_vec.get_feature_names_out())

print("Shakl:", bag_of_words.shape)
print(bag_of_words.iloc[:, :14])

# ===== TAHLIL =====
print("\nMAKSIMAL qiymat:", bag_of_words.values.max())
print("'the' ustuni   :", bag_of_words["the"].tolist())
print("Har hujjatda so'z:", bag_of_words.sum(axis=1).tolist())
print("\nEng ko'p so'zlar:")
print(bag_of_words.sum(axis=0).sort_values(ascending=False).head(5).to_string())

nollar = (bag_of_words == 0).sum().sum()
print(f"\nSiyraklik: {nollar}/{bag_of_words.size} = {nollar/bag_of_words.size:.1%} nol")
```

**Natija:**

```
Shakl: (6, 71)
   10  about  admirable  ahead  are  as  attacks  back  bait  beach  blood  can  carol  decided
0   1      1          0      0    1   0        1     0     0      1      0    0      0        0
1   0      0          1      0    0   0        0     0     0      0      0    0      0        0
2   0      0          0      0    0   1        0     0     0      0      1    0      1        0
3   0      0          0      0    1   0        0     0     0      0      0    1      0        0
4   0      0          0      1    0   0        0     0     0      0      0    0      0        1
5   0      0          0      0    0   1        0     1     1      0      0    0      0        0

MAKSIMAL qiymat: 3
'the' ustuni   : [2, 3, 1, 2, 1, 3]
Har hujjatda so'z: [17, 14, 9, 16, 14, 22]

Eng ko'p so'zlar:
the    12
he      3
to      3
in      2
are     2

Siyraklik: 341/426 = 80.0% nol
```

---

## 10. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** Lug'atda nechta so'z bor?

**M2.** `"shark"` qaysi hujjatda bor?

**M3.** Faqat bitta hujjatda uchraydigan so'zlarni sanang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M1
print(len(count_vec.get_feature_names_out()))     # 71
print(len(count_vec.vocabulary_))                 # 71
# 💡 vocabulary_ — bu {so'z: ustun_indeksi} lug'ati
print(count_vec.vocabulary_["shark"])             # 45

# M2
print(bag_of_words["shark"].tolist())             # [1, 0, 0, 0, 0, 0]
print("Hujjat:", bag_of_words.index[bag_of_words["shark"] > 0].tolist())   # [0]

# M3
bir_hujjatda = (bag_of_words > 0).sum(axis=0)
print("Faqat 1 ta hujjatda:", (bir_hujjatda == 1).sum(), "ta so'z")
# Faqat 1 ta hujjatda: 63 ta so'z
# 🔑 71 tadan 63 tasi (89%) FAQAT BITTA hujjatda!
#    Bu — kichik korpusda normal holat.
```

</details>

### 🟡 O'rta

**M4.** `stop_words='english'` bilan va usiz solishtiring.

**M5.** `min_df=2` nima qiladi?

**M6.** Ikki hujjatning **o'xshashligini** hisoblang.

<details>
<summary>✅ Yechimlar</summary>

```python
# M4
cv2 = CountVectorizer(stop_words='english')
bow2 = pd.DataFrame(cv2.fit_transform(data).toarray(),
                    columns=cv2.get_feature_names_out())
print(f"Usiz : {bag_of_words.shape[1]} ustun")     # 71
print(f"Bilan: {bow2.shape[1]} ustun")             # 39
print("O'chgan:", bag_of_words.shape[1] - bow2.shape[1], "ta")   # 32 ta

# M5 — kamida 2 ta hujjatda bo'lgan so'zlar
cv3 = CountVectorizer(min_df=2)
bow3 = pd.DataFrame(cv3.fit_transform(data).toarray(),
                    columns=cv3.get_feature_names_out())
print(f"min_df=2 → {bow3.shape[1]} ustun")         # 8
print(list(bow3.columns))
# ['are', 'as', 'he', 'in', 'that', 'the', 'to', 'was']
#
# 🔑 71 → 8! Faqat 8 ta so'z 2+ hujjatda uchraydi.
#    ⚠️ Va ularning HAMMASI to'xtatish so'zi!
#       Bu — kichik va bog'liq bo'lmagan korpusning muammosi:
#       jumlalar hech qanday MA'NOLI so'zni baham ko'rmaydi.

# M6 — KOSINUS O'XSHASHLIGI
from sklearn.metrics.pairwise import cosine_similarity
o = cosine_similarity(bag_of_words)
print(pd.DataFrame(o).round(2).to_string())
#       0     1     2     3     4     5
# 0  1.00  0.31  0.15  0.32  0.12  0.25
# 1  0.31  1.00  0.22  0.32  0.30  0.45
# 2  0.15  0.22  1.00  0.16  0.09  0.24
# 3  0.32  0.32  0.16  1.00  0.19  0.30
# 4  0.12  0.30  0.09  0.19  1.00  0.24
# 5  0.25  0.45  0.24  0.30  0.24  1.00
#
# 💡 Diagonal 1.0 — har bir hujjat O'ZIGA 100% o'xshash.
# ⚠️ Eng yuqori juftlik: 1 va 5 (0.45). Lekin ular MA'NAN
#    bog'liq emas! O'xshashlik faqat "the", "in", "as", "he"
#    to'xtatish so'zlaridan kelib chiqqan — SOXTA o'xshashlik.
#    Mana nima uchun TF-IDF kerak (keyingi dars).
```

</details>

### 🔴 Qiyin

**M7.** `ngram_range` ni o'zgartirib ustunlar sonini kuzating.

**M8.** Bag of Words yordamida "qidiruv" qiling.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
for ng in [(1,1), (1,2), (1,3), (2,2)]:
    cv = CountVectorizer(ngram_range=ng)
    n = cv.fit_transform(data).shape[1]
    print(f"ngram_range={ng}  →  {n:4d} ustun")
# ngram_range=(1, 1)  →    71 ustun
# ngram_range=(1, 2)  →   156 ustun
# ngram_range=(1, 3)  →   236 ustun
# ngram_range=(2, 2)  →    85 ustun
#
# ⚠️ (1,3) da ustunlar 3.3 BARAVAR ko'paydi!
#    Ko'proq kontekst = ko'proq ustun = SEKINROQ va KO'PROQ XOTIRA.
#    Bu — "o'lchov la'nati" (curse of dimensionality).

# M8 — QIDIRUV TIZIMI
from sklearn.metrics.pairwise import cosine_similarity

def qidir(sorov):
    """So'rovga eng mos hujjatni topadi."""
    s_vec = count_vec.transform([sorov])       # ⭐ FAQAT transform!
    ballar = cosine_similarity(s_vec, count_vec_fit)[0]
    eng = ballar.argmax()
    return eng, round(ballar[eng], 4)

for s in ["shark beach", "old man worms", "vampire blood"]:
    i, b = qidir(s)
    print(f"'{s}' → hujjat {i} (ball {b})")
    print(f"    {data[i][:60]}...")
# 'shark beach'   → hujjat 0 (ball 0.3244)   ✅
# 'old man worms' → hujjat 5 (ball 0.3162)   ✅
# 'vampire blood' → hujjat 2 (ball 0.4714)   ✅
#
# 🎉 UCHALASI HAM TO'G'RI TOPILDI!
#
# 🔑 count_vec.transform() — count_vec.fit_transform() EMAS!
#    So'rov uchun YANGI lug'at yaratmasligimiz kerak.
```

</details>

---

## 🧠 O'zini tekshirish savollari

1. `CountVectorizer` qaysi paketdan keladi?
2. Uch qadam qaysi?
3. `fit` va `transform` farqi nimada?
4. `.toarray()` nima uchun kerak?
5. `get_feature_names_out()` nima qaytaradi?
6. Qiymatlar faqat 0 va 1 mi?
7. Faqat 0/1 kerak bo'lsa nima qilish kerak?
8. Siyraklik nima va nima uchun muammo?

<details>
<summary>✅ Javoblar</summary>

1. `sklearn.feature_extraction.text`
2. ① `CountVectorizer()` ishga tushirish ② `.fit_transform(data)` ③ `pd.DataFrame(...)`
3. **`fit`** — lug'atni **o'rganadi**. **`transform`** — matnni **raqamga aylantiradi**. `fit_transform` — ikkalasi birga.
4. `fit_transform` **siyrak matritsa** qaytaradi. `pd.DataFrame` uchun uni **oddiy massivga** aylantirish kerak.
5. **Ustun nomlarini** — ya'ni lug'atdagi barcha noyob so'zlarni *(alifbo tartibida)*.
6. ## **YO'Q!** `CountVectorizer` **SANAYDI**. Bizning ma'lumotda maksimum **3** *(`the` so'zi)*.
7. `CountVectorizer(binary=True)`
8. **Nollar ulushi.** Bizda **80.8%**. Katta korpusda **99.9%** ga chiqadi — bu **xotira** va **tezlik** muammosi.

</details>

---

## 📌 Xulosa

```python
from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd

# ===== 3 QADAM =====
count_vec = CountVectorizer()                    # 1
count_vec_fit = count_vec.fit_transform(data)    # 2
bag_of_words = pd.DataFrame(                     # 3
    count_vec_fit.toarray(),
    columns=count_vec.get_feature_names_out())


NATIJA: (6, 71)   6 hujjat × 71 noyob so'z

   10  about  admirable  ahead  are  as  attacks
0   1      1          0      0    1   0        1
1   0      0          1      0    0   0        0
2   0      0          0      0    0   1        0
...


⚠️  KURSDAGI XATO TUZATILDI
   O'qituvchi: "qiymatlar shunchaki 0 va 1"
   HAQIQAT:    CountVectorizer SANAYDI!
               'the' ustuni = [2, 3, 1, 2, 1, 3]
               maksimal qiymat = 3

   Faqat 0/1 kerakmi?  →  CountVectorizer(binary=True)


⚠️  FIT vs TRANSFORM  (keyingi modullarda MUHIM!)
   X_train = vec.fit_transform(train)   ✅
   X_test  = vec.transform(test)        ✅ faqat transform!


MUAMMOLAR
  · "the" 12 marta — hech narsa aytmaydi
  · Siyraklik 80.8% nol
  · So'z tartibi YO'QOLGAN

YECHIMLAR
  · stop_words='english'    →  71 → 42 ustun
  · ngram_range=(1,2)       →  "not good" bitta ustun
  · TF-IDF  ⭐              →  keyingi dars
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| `CountVectorizer` | *count vectorizer* | Sanovchi vektorlashtirgich |
| `fit` | *fit* | Lug'atni o'rganish |
| `transform` | *transform* | Raqamga aylantirish |
| Xususiyat | *feature* | Ustun (bitta so'z) |
| Siyrak matritsa | *sparse matrix* | Asosan nollardan iborat jadval |
| Siyraklik | *sparsity* | Nollar ulushi |
| Ikkilik | *binary* | Faqat 0/1 |
| Kosinus o'xshashligi | *cosine similarity* | Ikki vektor o'xshashligi |

---

⬅️ [Oldingi: Matnning raqamli tasviri](01-Numerical-Representation-of-Text.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: TF-IDF](03-TF-IDF.md)
