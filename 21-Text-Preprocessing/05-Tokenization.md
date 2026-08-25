# 5-dars. Tokenizatsiya

## 🎬 Boshlashdan oldin

> ## **"NLP dagi FUNDAMENTAL qadam — matnimizni TOKENIZATSIYA deb nomlanuvchi jarayon orqali KICHIKROQ BIRLIKLARGA aylantirish."**
>
> **"Bu kichikroq birliklar bizning TOKENLARIMIZ deb ataladi."**

---

## 1. Tokenizatsiya turlari

> ## **"SO'Z tokenizatsiyasi — tokenizatsiyaning eng keng tarqalgan shakli, unda matndagi alohida so'zlar token bo'ladi."**
>
> **"Lekin tokenlar shuningdek JUMLALAR, QISM-SO'ZLAR yoki ALOHIDA BELGILAR ham bo'lishi mumkin — sizning foydalanish holatingizga qarab."**

| Tur | Nima token bo'ladi | Misol |
|---|---|---|
| **So'z** | Har bir so'z | `["Her", "cat", "is", "Luna"]` |
| **Jumla** | Har bir jumla | `["Her cat is Luna.", "Her dog is Max."]` |
| **Qism-so'z** | So'z bo'lagi | `["un", "happi", "ness"]` |
| **Belgi** | Har bir harf | `["H", "e", "r"]` |

> 💡 **Qism-so'z tokenizatsiyasi** — bu **GPT va BERT** ishlatadigan usul *(29–33-modullar)*.

---

## 2. Nima uchun kerak?

> ## **"Biz buni qilamiz, chunki umumiy matnning MA'NOSI ALOHIDA QISMLARNI ham, BUTUNNI ham tahlil qilib tushunsak — YAXSHIROQ tushuniladi."**
>
> **"Bu shuningdek ma'lumotimizni VEKTORLASHTIRISHDAN oldingi muhim qadam — buni kursning keyingi bo'limida ko'proq ko'rib chiqamiz."**

*(Vektorlashtirish — **24-modul**.)*

---

## 3. Import

> **"NLTK paketidan foydalanib jumla va so'z tokenizatsiyasining ba'zi misollarini ko'raylik."**

```python
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
from nltk.tokenize import word_tokenize, sent_tokenize
```

> ⚠️ **`punkt_tab`** — yangi NLTK versiyalarida **kerak**. Eski kodda faqat `punkt` bo'lishi mumkin.

---

## 4. Jumla tokenizatsiyasi

> **"Jumla tokenizatsiyasidan boshlaymiz. Satrimizda ikkita jumla bilan `sentences` yaratamiz."**
>
> **"`Her cat's name is Luna` va ikkinchi jumla `Her dog's name is Max` dan foydalanamiz."**

```python
sentences = "Her cat's name is Luna. Her dog's name is Max."
sent_tokenize(sentences)
```

```
["Her cat's name is Luna.", "Her dog's name is Max."]
```

> **"Bu yerda u ikkita alohida jumlaga bo'linganini ko'ramiz."**

### 🔑 Nima uchun `.split(".")` emas?

```python
# ❌ ODDIY SPLIT
"Dr. Smith went to the U.S.A. yesterday.".split(".")
# ['Dr', ' Smith went to the U', 'S', 'A', ' yesterday', '']
#   ↑ NOTO'G'RI! "Dr." va "U.S.A." buzildi

# ✅ NLTK
sent_tokenize("Dr. Smith went to the U.S.A. yesterday.")
# ['Dr. Smith went to the U.S.A. yesterday.']
#   ↑ TO'G'RI — bu BITTA jumla
```

> ## 🔑 **`sent_tokenize()` qisqartmalarni BILADI.** U shunchaki nuqta bo'yicha bo'lmaydi.

---

## 5. So'z tokenizatsiyasi

> **"Endi so'z tokenizatsiyasini sinab ko'raylik. `Her cat's name is Luna` jumlasini olamiz va bu jumla ustidan `word_tokenize` funksiyasini ishga tushiramiz."**

```python
word_tokenize("Her cat's name is Luna")
```

```
['Her', 'cat', "'s", 'name', 'is', 'Luna']
```

> **"Alohida so'zlar alohida tokenlarga qanday bo'linganini ko'rasiz."**

### 🔑 `cat's` → `cat` + `'s`

E'tibor bering: `word_tokenize` **apostrofni ajratdi**!

```python
"Her cat's name is Luna".split()
# ['Her', "cat's", 'name', 'is', 'Luna']    ← 5 ta token

word_tokenize("Her cat's name is Luna")
# ['Her', 'cat', "'s", 'name', 'is', 'Luna']  ← 6 ta token
```

**Nima uchun bu yaxshi?** Chunki `cat` va `cats` va `cat's` — bularning **o'zagi bir xil**. `split()` esa `cat's` ni **alohida so'z** deb hisoblaydi.

---

## 6. Uzunroq matn

> **"Buni biroz uzunroq jumlada yana sinab ko'raylik. Ikki jumlamizni birlashtirib, ular ustidan `word_tokenize` ni ishga tushirsak..."**

```python
word_tokenize(sentences)
```

```
['Her', 'cat', "'s", 'name', 'is', 'Luna', '.', 'Her', 'dog', "'s", 'name', 'is', 'Max', '.']
```

---

## 7. ⚠️ Lowercase muammosi qaytadi

> **"Bu yerda men lowercase haqida nimani nazarda tutganimni ko'rishingiz mumkin."**
>
> **"Bizning birinchi tokenimiz — BOSH `H` bilan `Her` tokeni. Va pastroqda bizda kichik `h` bilan yana bir token bor."**

> ## **"Agar biz buni oldin kichik harfga o'girganimizda — ular MOS KELGAN bo'lardi."**

> **"Endi agar biz bunda qandaydir CHASTOTA hisoblashga urinsak — bosh harfli `Her` va kichik harfli `her` BIRGA SANALMASLIGI mumkin."**
>
> ## **"Shuning uchun o'sha LOWERCASE qadami haqida o'ylash va ma'lumotlaringiz bo'ylab IZCHILLIKNI ta'minlash uchun uni qo'llash HAQIQATAN MUHIM."**

> ⚠️ **Diqqat:** yuqoridagi natijada `'Her'` **ikki marta** — chunki ikkala jumla ham bosh harf bilan boshlangan. Lekin haqiqiy matnda **`Her`** va **`her`** aralash bo'ladi.

---

## 8. 🔢 To'g'ri tartib

```
1. LOWERCASE           ← BIRINCHI!
2. TINISH BELGILAR     (regex)
3. TO'XTATISH SO'ZLARI
4. TOKENIZATSIYA
5. STEMMING/LEMMATIZATION
```

> ## 🔑 **Nima uchun lowercase birinchi?** Chunki keyingi barcha bosqichlar **registrga sezgir**:
> - To'xtatish so'zlari ro'yxatida `"it"` bor, `"It"` **yo'q**
> - Tokenizatsiya `"Her"` va `"her"` ni **ikki xil** token qiladi

---

## 9. 💻 To'liq kod

```python
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
from nltk.tokenize import word_tokenize, sent_tokenize

# ===== JUMLA TOKENIZATSIYASI =====
sentences = "Her cat's name is Luna. Her dog's name is Max."
print(sent_tokenize(sentences))

# ===== SO'Z TOKENIZATSIYASI =====
print(word_tokenize("Her cat's name is Luna"))
print(word_tokenize(sentences))

# ===== split() BILAN SOLISHTIRISH =====
s = "Her cat's name is Luna."
print("split():        ", s.split())
print("word_tokenize():", word_tokenize(s))

# ===== QISQARTMALAR =====
q = "Dr. Smith went to the U.S.A. yesterday."
print("split('.'):     ", q.split("."))
print("sent_tokenize():", sent_tokenize(q))

# ===== LOWERCASE MUAMMOSI =====
matn = "Her cat is Luna. Her dog is Max."
tokens = word_tokenize(matn)
ch = {}
for t in tokens:
    ch[t] = ch.get(t, 0) + 1
print("Lowercase SIZ:", ch.get("Her"), ch.get("her"))

tokens_lower = word_tokenize(matn.lower())
ch2 = {}
for t in tokens_lower:
    ch2[t] = ch2.get(t, 0) + 1
print("Lowercase BILAN:", ch2.get("her"))

# ===== BELGI TOKENIZATSIYASI =====
print(list("Python"))
```

**Natija:**

```
["Her cat's name is Luna.", "Her dog's name is Max."]
['Her', 'cat', "'s", 'name', 'is', 'Luna']
['Her', 'cat', "'s", 'name', 'is', 'Luna', '.', 'Her', 'dog', "'s", 'name', 'is', 'Max', '.']
split():         ['Her', "cat's", 'name', 'is', 'Luna.']
word_tokenize(): ['Her', 'cat', "'s", 'name', 'is', 'Luna', '.']
split('.'):      ['Dr', ' Smith went to the U', 'S', 'A', ' yesterday', '']
sent_tokenize(): ['Dr. Smith went to the U.S.A. yesterday.']
Lowercase SIZ: 2 None
Lowercase BILAN: 2
['P', 'y', 't', 'h', 'o', 'n']
```

---

## 10. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** O'z matningizni jumlalarga ajrating.

**M2.** O'z matningizni so'zlarga ajrating.

**M3.** `split()` va `word_tokenize()` natijalarini solishtiring.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.tokenize import word_tokenize, sent_tokenize

# M1
m = "Python is great. NLP is fun! Do you agree?"
print(sent_tokenize(m))
# ['Python is great.', 'NLP is fun!', 'Do you agree?']

# M2
print(word_tokenize("Python is great."))
# ['Python', 'is', 'great', '.']

# M3
s = "Don't stop believing!"
print(s.split())                # ["Don't", 'stop', 'believing!']
print(word_tokenize(s))         # ['Do', "n't", 'stop', 'believing', '!']
# word_tokenize "Don't" ni "Do" + "n't" ga ajratdi — INKORNI saqlash uchun!
```

</details>

### 🟡 O'rta

**M4.** Tokenlar sonini `split()` va `word_tokenize()` da solishtiring.

**M5.** Tokenizatsiyadan **oldin** lowercase qo'llang.

**M6.** Tinish belgi tokenlarini filtrlang.

<details>
<summary>✅ Yechimlar</summary>

```python
from nltk.tokenize import word_tokenize
m = "Her cat's name is Luna. Her dog's name is Max."

# M4
print(len(m.split()), "ta (split)")             # 10 ta
print(len(word_tokenize(m)), "ta (tokenize)")   # 14 ta

# M5
t = word_tokenize(m.lower())
print(t)
# ['her', 'cat', "'s", 'name', 'is', 'luna', '.', 'her', 'dog', "'s", 'name', 'is', 'max', '.']

# M6
toza = [x for x in t if x.isalpha()]
print(toza)
# ['her', 'cat', 'name', 'is', 'luna', 'her', 'dog', 'name', 'is', 'max']
# .isalpha() — faqat HARFLARDAN iborat tokenlar
```

</details>

### 🔴 Qiyin

**M7.** To'liq quvurni yozing: lowercase → regex → stopwords → tokenize.

**M8.** `word_tokenize` qisqartmalarni qanday qayta ishlaydi?

**M9.** O'zbekcha matnni tokenizatsiya qiling. Ishlaydimi?

<details>
<summary>✅ Yechimlar</summary>

```python
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# M7 — TO'LIQ QUVUR
sw = stopwords.words('english')
sw.remove("not")

def quvur(matn):
    matn = matn.lower()                        # 1
    matn = re.sub(r"[^\w\s]", "", matn)        # 2
    matn = " ".join([w for w in matn.split() if w not in sw])   # 3
    return word_tokenize(matn)                 # 4

print(quvur("The hotel was NOT very clean, but the staff were great!"))
# ['hotel', 'not', 'clean', 'staff', 'great']

# M8
print(word_tokenize("Dr. Smith works at the U.S.A. office."))
# ['Dr.', 'Smith', 'works', 'at', 'the', 'U.S.A.', 'office', '.']
# ✅ "Dr." va "U.S.A." BUTUN token bo'lib qoldi!

# M9
uz = "Bu kitob juda qiziqarli. Men uni o'qidim!"
print(word_tokenize(uz))
# ['Bu', 'kitob', 'juda', 'qiziqarli', '.', 'Men', 'uni', "o'qidim", '!']
# ✅ ISHLAYDI — chunki lotin alifbosi va tinish belgilar bir xil.
# ⚠️ LEKIN: o'zbek tilining grammatik qoidalarini BILMAYDI.
#    "kitobni" → NLTK uchun bitta token,
#    aslida esa "kitob" + "-ni" (tushum kelishigi)
```

</details>

---

## 11. 🧠 O'zini tekshirish savollari

1. Tokenizatsiya nima?
2. Kichikroq birliklar nima deb ataladi?
3. Eng keng tarqalgan shakli qaysi?
4. Tokenlar yana nima bo'lishi mumkin?
5. Nima uchun buni qilamiz?
6. Bu qaysi qadamdan oldin muhim?
7. Qaysi funksiyalar ishlatiladi?
8. Lowercase muammosi nimada?

<details>
<summary>✅ Javoblar</summary>

1. Matnni **kichikroq birliklarga** aylantirish jarayoni.
2. **Tokenlar.**
3. **So'z** tokenizatsiyasi.
4. **Jumlalar**, **qism-so'zlar** yoki **alohida belgilar**.
5. Chunki matn ma'nosi **alohida qismlarni ham, butunni ham** tahlil qilsak **yaxshiroq** tushuniladi.
6. **Vektorlashtirishdan** oldin.
7. **`word_tokenize()`** va **`sent_tokenize()`**.
8. Bosh harfli `Her` va kichik harfli `her` **birga sanalmaydi** — shuning uchun lowercase **birinchi** qilinishi kerak.

</details>

---

## 📌 Xulosa

```python
from nltk.tokenize import word_tokenize, sent_tokenize

# JUMLA
sent_tokenize("Her cat is Luna. Her dog is Max.")
→ ['Her cat is Luna.', 'Her dog is Max.']

# SO'Z
word_tokenize("Her cat's name is Luna")
→ ['Her', 'cat', "'s", 'name', 'is', 'Luna']


TOKEN TURLARI
so'z       ['Her', 'cat', 'is']        ← eng keng tarqalgan
jumla      ['Her cat is Luna.']
qism-so'z  ['un', 'happi', 'ness']     ← GPT/BERT shu usulda
belgi      ['H', 'e', 'r']


🔑 NIMA UCHUN split() EMAS?

split():         ["cat's"]              1 ta token
word_tokenize(): ['cat', "'s"]          2 ta token  ✅

split("."):      ['Dr', ' Smith', 'U', 'S', 'A']   ❌ buzildi
sent_tokenize(): ['Dr. Smith ... U.S.A. ...']      ✅ qisqartmalarni BILADI


⚠️  LOWERCASE MUAMMOSI
'Her' va 'her'  →  IKKI XIL token
→ LOWERCASE ni BIRINCHI qiling!


TO'G'RI TARTIB
1. lowercase        ← BIRINCHI
2. tinish belgilar  (regex)
3. to'xtatish so'zlari
4. tokenizatsiya
5. stemming/lemmatization
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Tokenizatsiya | *tokenization* | Matnni birliklarga ajratish |
| Token | *token* | Eng kichik birlik |
| So'z tokenizatsiyasi | *word tokenization* | Har bir so'z — token |
| Jumla tokenizatsiyasi | *sentence tokenization* | Har bir jumla — token |
| Qism-so'z | *subword* | So'z bo'lagi |
| Foydalanish holati | *use case* | Vazifa turi |

---

⬅️ [Oldingi: Regular expressions](04-Regular-Expressions.md) · ➡️ [Keyingi: Stemming](06-Stemming.md)
