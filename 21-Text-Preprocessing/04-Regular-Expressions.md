# 4-dars. Regular expressions (regex)

## 🎬 Boshlashdan oldin

> ## **"REGULAR EXPRESSIONS — yoki qisqacha REGEX — belgilangan NAQSHGA mos keladigan satrlarni qidirish uchun MAXSUS SINTAKSIS."**
>
> **"Bu — qattiq kodlangan satr o'rniga NAQSHLARGA moslashtirmoqchi bo'lganingizda matnni FILTRLASH va SARALASH uchun ajoyib vosita."**

> **"Sintaksis uchun juda ko'p variant bor, shuning uchun eng yaxshisi shunchaki MISOLLAR bilan boshlash."**

---

## 1. Import

> **"Birinchi qiladigan narsamiz — `re` paketini import qilish."**

```python
import re
```

> 💡 `re` — **standart kutubxona** *(19-modul)*. O'rnatish **kerak emas**.

---

## 2. Xom satrlar (raw strings)

> **"Regex kodiga o'tishdan oldin, avval XOM SATRLAR tushunchasini ko'rib chiqaylik."**

> **"Python ma'lum belgilarni MAXSUS MA'NOGA ega deb tanidi. Masalan, Python'da `\n` YANGI QATORNI bildirish uchun ishlatiladi."**

*(12-modulning 4-darsida escape belgilarni ko'rgan edingiz.)*

> **"Biroq, ba'zan Python ma'lum ma'noga ega deb taniydigan bu kodlar bizning SATRLARIMIZDA paydo bo'ladi — va biz Python'ga matnimizdagi `\n` YANGI QATOR emas, HAQIQIY `\n` ekanini aytmoqchimiz."**

> ## **"Matnimiz XOM SATR ekanini Python'ga bildirish uchun satrlar oldiga `r` belgisidan foydalanishimiz mumkin."**

### Isbot

```python
my_folder = "c:\desktop\notes"
print(my_folder)
```

```
c:\desktop
otes
```

> **"Ko'ryapsizmi — bu `\n` YANGI QATOR deb qabul qilindi. `\n` olib tashlandi va `notes` ning oxiri ikkinchi qatorga tushdi."**

```python
my_folder = r"c:\desktop\notes"
print(my_folder)
```

```
c:\desktop\notes
```

> **"Endi satrimiz oldiga shunchaki kichik `r` qo'shib qayta chop etsak — bu to'g'ri chop etilganini va `\n` XOM SATR sifatida qabul qilinganini ko'ramiz."**

> ## **"Bu regular expressionlar bilan ishlaganda YODDA TUTISH MUHIM — chunki maxsus belgilar bilan ishlaganda XOM SATRLARDAN foydalanayotganimizga ishonch hosil qilishimiz kerak."**

![Regex ma'lumotnoma](assets/03-regex-cheatsheet.svg)

---

## 3. `re.search()` — qidirish

> **"Birinchisi — `re.search`. Bu funksiya satrda ma'lum NAQSH borligini tekshirish imkonini beradi."**
>
> **"U `re.search` mantig'idan foydalanadi va birinchi argument — TOPILADIGAN NAQSH, ikkinchi argument — bu naqshni topmoqchi bo'lgan SATR."**

```python
re.search("abc", "abcdef")
```
```
<re.Match object; span=(0, 3), match='abc'>
```

> **"Agar naqsh satrda topilsa — u naqshni qaytaradi. Aks holda, naqsh topilmasa — `None` qaytaradi."**

```python
re.search("xyz", "abcdef")
```
```
None
```

> 🔑 `re.search()` natijasi `if` ichida **ishlatiladi** — chunki `None` **yolg'on**, `Match` obyekti — **rost** *(15-modulning truthy/falsy!)*.

---

## 4. `re.sub()` — almashtirish

> **"Keyingisi — `re.sub` funksiyasi ma'lum matnni TOPIB, uni ALMASHTIRISH imkonini beradi."**
>
> ## **"U `re.sub` mantig'idan foydalanadi: birinchi argument — topiladigan NAQSH, ikkinchi argument — ALMASHTIRUVCHI matn, uchinchi argument — qidirayotgan SATR."**

```
re.sub( naqsh , yangi_matn , satr )
```

> **"Buni ko'rsataylik. Satrdan boshlaymiz: `Sarah was able to help me find the items I needed quickly`."**
>
> **"Lekin aytaylik, biz `Sarah` yozilishi noto'g'ri ekanini bilamiz va u `Sara` bo'lishi kerak."**

```python
string = "Sarah was able to help me find the items I needed quickly"
new_string = re.sub("Sarah", "Sara", string)
print(new_string)
```

```
Sara was able to help me find the items I needed quickly
```

> **"Yangi satrni chop etganimizdan so'ng `Sarah` `Sara` ga almashtirilganini ko'ramiz."**

---

## 5. Amaliy misol: mijoz sharhlari

> **"Endi regex sintaksisining KUCHI haqida biroz batafsilroq gapiraylik."**
>
> **"Aytaylik, bizda jamoamiz xodimlari haqida turli mijozlardan olti xil sharh bor."**

```python
customer_reviews = [
    "Sarah was a great help in the store",
    "Sara found me the items I needed quickly",
    "Amazing work from Sardine",
    "The store was terrible but the staff were friendly",
    "I wanted a refund but they were unhelpful",
    "Great service, will come again",
]
```

---

## 6. `?` — ixtiyoriy belgi

> **"Aytaylik, biz faqat Sara'ning sharhlarini topmoqchimiz — lekin `Sarah` ning NOTO'G'RI yozilishini ham hisobga olishimiz kerak."**
>
> **"Bu holda biz oxirida SAVOL BELGISI bilan `Sarah?` dan foydalanamiz."**
>
> ## **"`r` dan keyingi savol belgisi u MOSLASHTIRISH UCHUN IXTIYORIY belgi ekanini bildiradi. Demak, qidiruvimiz `Sara` va `Sarah` — IKKALASINI ham izlaydi."**

```python
saras_reviews = []
pattern_to_find = "Sarah?"

for string in customer_reviews:
    if re.search(pattern_to_find, string):
        saras_reviews.append(string)

print(saras_reviews)
```

```
['Sarah was a great help in the store', 'Sara found me the items I needed quickly']
```

> **"Ikkita to'g'ri sharh ajratib olinib, bu yangi ro'yxatga qo'yilganini ko'ramiz."**

### 🔑 `?` qanday ishlaydi

```
"Sarah?"
      ↑ oldingi belgi (h) IXTIYORIY

Mos keladi:  "Sara"    ✅   (h yo'q)
             "Sarah"   ✅   (h bor)
             "Sardine" ❌   S-a-r-D — to'rtinchi harf "a" EMAS
```

> ⚠️ **Diqqat:** `"Amazing work from Sardine"` **topilmadi** — chunki naqsh **`Sara`** ni talab qiladi, `Sardine` esa `Sar` + **`d`**.

---

## 7. `^` — satr boshi

> **"Endi boshqacha narsani sinab, `A` harfi bilan BOSHLANADIGAN sharhlarni qidiraylik."**
>
> **"Bu yerda xom satrni bildirish uchun `r` ni ishlatyapmiz. Va satr ichida `^` (karet) belgisi va `A` bor."**
>
> ## **"Karet operatori SATR BOSHINI bildiradi."**

```python
a_reviews = []
pattern_to_find = r"^A"

for string in customer_reviews:
    if re.search(pattern_to_find, string):
        a_reviews.append(string)

print(a_reviews)
```

```
['Amazing work from Sardine']
```

> **"`Amazing work from Sardine` biz uchun to'g'ri ajratib olinganini ko'ramiz."**

---

## 8. `$` — satr oxiri

> **"Boshqa tomondan, ma'lum harflar bilan TUGAYDIGAN sharhlarni ham topa olamiz."**
>
> **"Demak, buni `Y` harfi bilan tugaydigan sharhlarni topishga o'zgartiraylik."**
>
> ## **"Satr OXIRINI bildirish uchun DOLLAR operatoridan foydalanamiz."**

```python
y_reviews = []
pattern_to_find = r"y$"

for string in customer_reviews:
    if re.search(pattern_to_find, string):
        y_reviews.append(string)

print(y_reviews)
```

```
['Sara found me the items I needed quickly', 'The store was terrible but the staff were friendly']
```

---

## 9. `|` — yoki (pipe)

> **"Bir nechta so'zga mos keladigan sharhlarni topish uchun ham sintaksisdan foydalanishimiz mumkin."**
>
> **"Bu yerda biz `needed` yoki `wanted` so'zlarini o'z ichiga olgan sharhlarni topmoqchimiz."**
>
> **"Buning uchun PIPE operatoridan foydalanamiz."**

```python
need_want_reviews = []
pattern_to_find = r"(need|want)ed"

for string in customer_reviews:
    if re.search(pattern_to_find, string):
        need_want_reviews.append(string)

print(need_want_reviews)
```

```
['Sara found me the items I needed quickly', 'I wanted a refund but they were unhelpful']
```

> **"Bu yerda `need` so'zini oxirida `ed` bilan izlaydi — ya'ni `needed`. Yoki `want` so'zini oxirida `ed` bilan — ya'ni `wanted`."**

### 🔑 Qavslar guruhlaydi

```
r"(need|want)ed"
  ↑          ↑ ↑
  |          | ikkalasiga ham qo'shiladi
  |          YOKI
  guruh boshlanishi

→  "needed"  yoki  "wanted"
```

---

## 10. ⭐ Tinish belgilarni olib tashlash

> **"Nihoyat, regex ishlatiladigan ENG FOYDALI va ENG KUCHLI narsalardan birini ko'raylik — bu satrlarimizdan TINISH BELGILARNI olib tashlash."**
>
> ## **"Bu — NLP uchun HAQIQATAN MUHIM qadam, shuning uchun bu sintaksis nima qilayotganini tushunishga harakat qiling."**

```python
no_punct_reviews = []
pattern_to_find = r"[^\w\s]"

for string in customer_reviews:
    no_punct_string = re.sub(pattern_to_find, "", string)
    no_punct_reviews.append(no_punct_string)

print(no_punct_reviews)
```

```
['Sarah was a great help in the store', 'Sara found me the items I needed quickly', 'Amazing work from Sardine', 'The store was terrible but the staff were friendly', 'I wanted a refund but they were unhelpful', 'Great service will come again']
```

> **"Buni chop etganimizda sharhlarning tinish belgilari muvaffaqiyatli olib tashlanganini ko'rasiz."**

### 🔑 `r"[^\w\s]"` ni parchalash

> **"Bizda xom satr uchun `r`, KVADRAT QAVSLAR va KARET belgisi INKORNI bildiradi. `\w` SO'Z degani, `\s` esa BO'SH JOY degani."**
>
> ## **"Ya'ni biz so'z HAM, bo'sh joy HAM BO'LMAGAN har qanday narsani topmoqchimiz."**

```
r" [  ^  \w  \s  ] "
      ↑   ↑   ↑
      |   |   bo'sh joy (probel, tab)
      |   so'z belgisi (harf, raqam, _)
      INKOR: "bularning HECH BIRI emas"

→  faqat TINISH BELGILAR qoladi:  . , ! ? ; : " ' -
```

> **"Bizning `for` sikllarimiz ham bu yerda biroz boshqacha ko'rinadi. `re.sub` funksiyasidan foydalanamiz."**
>
> **"Demak, naqshimizni izlaymiz — so'z yoki bo'sh joy bo'lmagan narsani, ya'ni tinish belgilarni — va uni HECH NARSAGA almashtiramiz. Ya'ni bu shunchaki uni OLIB TASHLAYDI."**

---

## 11. Yakuniy so'z

> **"Regex uchun juda ko'p variant bor, va nima qila olishingiz va uning kuchini bilish uchun biroz vaqt ketadi — lekin bu ma'lumotni filtrlash va MUAYYAN NAQSHLARGA mos keladigan matnni topish uchun HAQIQATAN foydali vosita."**

---

## 12. 💻 To'liq kod

```python
import re

# ===== XOM SATRLAR =====
my_folder = "c:\desktop\notes"
print(my_folder)

my_folder_r = r"c:\desktop\notes"
print(my_folder_r)

# ===== SEARCH =====
print(re.search("abc", "abcdef"))
print(re.search("xyz", "abcdef"))

# ===== SUB =====
string = "Sarah was able to help me find the items I needed quickly"
print(re.sub("Sarah", "Sara", string))

# ===== MIJOZ SHARHLARI =====
customer_reviews = [
    "Sarah was a great help in the store",
    "Sara found me the items I needed quickly",
    "Amazing work from Sardine",
    "The store was terrible but the staff were friendly",
    "I wanted a refund but they were unhelpful",
    "Great service, will come again",
]

# ===== ? — IXTIYORIY BELGI =====
saras = [s for s in customer_reviews if re.search("Sarah?", s)]
print(saras)

# ===== ^ — SATR BOSHI =====
a_rev = [s for s in customer_reviews if re.search(r"^A", s)]
print(a_rev)

# ===== $ — SATR OXIRI =====
y_rev = [s for s in customer_reviews if re.search(r"y$", s)]
print(y_rev)

# ===== | — YOKI =====
nw = [s for s in customer_reviews if re.search(r"(need|want)ed", s)]
print(nw)

# ===== TINISH BELGILARNI OLIB TASHLASH =====
no_punct = [re.sub(r"[^\w\s]", "", s) for s in customer_reviews]
print(no_punct)
```

**Natija:**

```
c:\desktop
otes
c:\desktop\notes
<re.Match object; span=(0, 3), match='abc'>
None
Sara was able to help me find the items I needed quickly
['Sarah was a great help in the store', 'Sara found me the items I needed quickly']
['Amazing work from Sardine']
['Sara found me the items I needed quickly', 'The store was terrible but the staff were friendly']
['Sara found me the items I needed quickly', 'I wanted a refund but they were unhelpful']
['Sarah was a great help in the store', 'Sara found me the items I needed quickly', 'Amazing work from Sardine', 'The store was terrible but the staff were friendly', 'I wanted a refund but they were unhelpful', 'Great service will come again']
```

---

## 13. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** `re.search()` bilan matnda so'z borligini tekshiring.

**M2.** `re.sub()` bilan so'zni almashtiring.

**M3.** Tinish belgilarni olib tashlang.

<details>
<summary>✅ Yechimlar</summary>

```python
import re

# M1
print(re.search("hotel", "the hotel was great"))    # Match
print(re.search("motel", "the hotel was great"))    # None

# M2
print(re.sub("bad", "good", "the food was bad"))    # the food was good

# M3
print(re.sub(r"[^\w\s]", "", "Great! Really... good?"))  # Great Really good
```

</details>

### 🟡 O'rta

**M4.** `^` va `$` bilan boshlanish/tugashni tekshiring.

**M5.** `|` bilan bir necha so'zni qidiring.

**M6.** Raqamlarni topib olib tashlang.

<details>
<summary>✅ Yechimlar</summary>

```python
import re
r = ["Apple is good", "Good apple", "Great service", "Bad apple"]

# M4
print([s for s in r if re.search(r"^A", s)])        # ['Apple is good']
print([s for s in r if re.search(r"e$", s)])
# ['Good apple', 'Great service', 'Bad apple']   ← UCHTASI ham e bilan tugaydi!

# M5
print([s for s in r if re.search(r"(Good|Bad)", s)])
# ['Good apple', 'Bad apple']

# M6
print(re.sub(r"\d", "", "Room 205 costs 150 dollars"))
# Room  costs  dollars
print(re.findall(r"\d+", "Room 205 costs 150 dollars"))
# ['205', '150']
```

</details>

### 🔴 Qiyin

**M7.** Email manzillarni topuvchi naqsh yozing.

**M8.** Telefon raqamlarni topuvchi naqsh yozing.

**M9.** Faqat 4 harfdan uzun so'zlarni qoldiring.

<details>
<summary>✅ Yechimlar</summary>

```python
import re

# M7
matn = "Yozing: ali@mail.uz yoki vali@gmail.com"
print(re.findall(r"[\w.]+@[\w.]+", matn))
# ['ali@mail.uz', 'vali@gmail.com']

# M8
matn = "Tel: +998901112233 yoki 998 90 111 22 33"
print(re.findall(r"\+?\d[\d\s]{8,}", matn))
# ['+998901112233 ', '998 90 111 22 33']

# M9
matn = "the quick brown fox is very fast"
print(re.findall(r"\b\w{5,}\b", matn))
# ['quick', 'brown']
# \b — SO'Z CHEGARASI,  \w{5,} — 5 va undan ko'p belgi
```

</details>

---

## 14. 🧠 O'zini tekshirish savollari

1. Regex nima?
2. U qachon foydali?
3. Xom satr nima uchun kerak?
4. `r` belgisi nima qiladi?
5. `re.search()` nima qaytaradi?
6. `re.sub()` da nechta argument bor?
7. `?` nima qiladi?
8. `^` va `$` nimani bildiradi?
9. `|` nima qiladi?
10. `[^\w\s]` nimani topadi?

<details>
<summary>✅ Javoblar</summary>

1. Belgilangan **naqshga** mos keladigan satrlarni qidirish uchun **maxsus sintaksis**.
2. Qattiq kodlangan satr o'rniga **naqshlarga** moslashtirmoqchi bo'lganda.
3. Python `\n` kabi belgilarni **maxsus ma'noga** ega deb taniydi — xom satr esa ularni **oddiy belgi** qiladi.
4. Satrni **xom satr** qiladi.
5. Naqsh topilsa — **Match obyekti**, topilmasa — **`None`**.
6. **Uchta:** naqsh, almashtiruvchi matn, satr.
7. Oldingi belgini **ixtiyoriy** qiladi.
8. `^` — **satr boshi**, `$` — **satr oxiri**.
9. **YOKI** — bir necha variantdan birini.
10. **So'z ham, bo'sh joy ham bo'lmagan** narsani — ya'ni **tinish belgilarni**.

</details>

---

## 📌 Xulosa

```python
import re

# UCHTA ASOSIY FUNKSIYA
re.search(naqsh, matn)       →  Match yoki None
re.sub(naqsh, yangi, matn)   →  topib ALMASHTIRADI
re.findall(naqsh, matn)      →  BARCHASINI ro'yxatda


⚠️  XOM SATR
"c:\desktop\notes"     →  \n YANGI QATOR  ❌
r"c:\desktop\notes"    →  oddiy belgi     ✅
→ Regex da DOIM r"..." ishlating


BELGILAR
^     satr BOSHI            r"^A"
$     satr OXIRI            r"y$"
?     IXTIYORIY belgi       "Sarah?"  →  Sara VA Sarah
|     YOKI                  r"(need|want)ed"
\w    so'z belgisi          harf, raqam, _
\s    bo'sh joy             probel, tab
\d    raqam                 0-9
\b    so'z chegarasi
[^..] INKOR                 "bularning hech biri emas"
+     1 yoki KO'P marta
{n,}  n va undan KO'P


⭐ NLP DAGI ENG MUHIM REGEX
re.sub(r"[^\w\s]", "", matn)
              ↑
     so'z HAM, bo'sh joy HAM emas
     →  faqat TINISH BELGILAR
     →  ular HECH NARSAGA almashtiriladi = O'CHIRILADI
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Regex | *regular expression* | Naqsh sintaksisi |
| Naqsh | *pattern* | Qidiriladigan shakl |
| Xom satr | *raw string* | `r"..."` |
| Karet | *caret* | `^` — satr boshi |
| Dollar | *dollar sign* | `$` — satr oxiri |
| Pipe | *pipe* | `\|` — yoki |
| Inkor | *negation* | `[^...]` |
| So'z chegarasi | *word boundary* | `\b` |

---

⬅️ [Oldingi: To'xtatish so'zlari](03-Removing-Stop-Words.md) · ➡️ [Keyingi: Tokenizatsiya](05-Tokenization.md)
