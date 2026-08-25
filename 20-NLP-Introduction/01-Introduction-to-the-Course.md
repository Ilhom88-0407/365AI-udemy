# 1-dars. Kursga kirish

## 🎬 Boshlashdan oldin

> **"Salom va bu Tabiiy Tilni Qayta Ishlashga Kirish kursiga xush kelibsiz."**
>
> ## **"Biz NLP ning hayajonli sohasiga sho'ng'iymiz va kompyuterlarga inson tilini TUSHUNISH, YARATISH va TASNIFLASH imkonini beruvchi texnikalarni ko'rib chiqamiz."**

> 🎤 **Ma'ruzachi o'zgardi.** Python bo'limini **365 Careers** jamoasi olib bordi. NLP bo'limini — **Lauren Newbold**, ma'lumot olimi.

---

## 1. Nima kerak?

> **"Bu kursni boshlash uchun sizga NLP bo'yicha OLDINGI BILIM KERAK EMAS."**
>
> ## **"Faqat ASOSIY Python ko'nikmalari va, ehtimol, mashinali o'rganish bilan biroz tanishlik."**

✅ **Sizda allaqachon bor:**

| Ko'nikma | Qayerdan |
|---|---|
| Python asoslari | **10–19-modullar** ✅ |
| `list`, `dict`, `for`, `def` | **16–18-modullar** ✅ |
| `import` va modullar | **19-modul** ✅ |
| Mashinali o'rganish tushunchasi | **03-modul** ✅ |
| Nazorat ostida / nazoratsiz | **03-modul** ✅ |

> ## 🎉 **Siz to'liq tayyorsiz.**

---

## 2. Kurs yo'l xaritasi

> **"Kursning bu birinchi bo'limi bizning tadqiqotimiz uchun ZAMIN yaratadi — bu yerda biz NLP deganda nimani nazarda tutishimizni va kundalik hayotimizdagi ba'zi qo'llanmalarni ko'rib chiqamiz."**

### Bo'limlar

| № | Modul | Nima o'rganiladi |
|---|---|---|
| **20** | **Kirish** | NLP nima · kundalik hayotda · nazorat ostida/nazoratsiz |
| **21** | Matnni oldindan qayta ishlash | *"eng fundamental jihatlaridan biri"* |
| **22** | Nutq qismlari va nomli obyektlar | POS tagging · NER |
| **23** | Sentiment tahlili | Matndagi **hissiyotlar** |
| **24** | Matnni vektorlashtirish | ML uchun ma'lumot tayyorlash |
| **25** | Mavzu modellashtirish | Nazoratsiz — mavzularni topish |
| **26** | O'z tasniflagichingiz | Nazorat ostida — maxsus model |
| **27** | **Amaliy keys** | Soxta yangiliklarni aniqlash |
| **28** | NLP kelajagi | Chuqur o'rganish · LLM |

> **"Har bir mavzuni QADAMMA-QADAM ko'rib chiqamiz, keyin yangi ko'nikmalaringizni mashq qilish uchun AMALIY dars qo'shamiz."**

---

## 3. Amaliy keys — portfolio uchun

> **"8-bo'lim — TO'LIQ, AMALIY keys tadqiqoti, u yerda biz o'rgangan hamma narsani olib, HAQIQIY BIZNES muammosiga qo'llaymiz."**
>
> ## **"Keyin sizda PORTFOLIOGA qo'shish va yangi NLP ko'nikmalaringizni ko'rsatish uchun notebook bo'ladi."**

> 💼 **Bu — ish topishda muhim.** Ish beruvchi sizning **haqiqiy loyihangizni** ko'rishni xohlaydi.

---

## 4. Kurs qanday tugaydi

> **"Kurs NLP ning KELAJAGINI muhokama qilish bilan yakunlanadi — biz chuqur o'rganish va katta til modellarini qamrab olamiz va NLP qayerga yo'nalishi mumkinligi haqida gaplashamiz."**

---

## 5. Ma'ruzachi haqida

> **"Mening ismim Lauren Newbold va men bir necha yil davomida ma'lumot olimi bo'lib ishlaganman — ham yirik tashkilotlarda, ham kichik startaplarda, turli xil muammolar ustida ishlab."**

> **"Yaqinda men rivojlanayotgan hamjamiyatlardagi intervyu ma'lumotlaridan kelgan matnni tasniflash uchun ENG ZAMONAVIY NLP texnologiyalaridan foydalanib MAXSUS matn tasniflagichini qurdim."**

> **"Men shuningdek NLP rivojlanayotgan mamlakatlarga bera oladigan foydalar haqida bir necha konferensiyada nutq so'zladim."**

> ## **"Menda odamlarni ma'lumot va u bera oladigan insaytlar bilan qiziqtirishga ishtiyoq bor. Shuning uchun siz men bilan bu kursni o'tishga qaror qilganingizdan juda xursandman."**

---

## 6. 📓 Kurs materiallari

Kursda **Jupyter notebook** fayllari beriladi. Ushbu darslikda esa:

| Nima | Qayerda |
|---|---|
| **Nazariya** | Har bir dars md faylida |
| **Kod** | Har bir darsning `💻 To'liq kod` bo'limida |
| **Mashqlar** | `MASHQLAR.md` |
| **Loyihalar** | `LOYIHALAR.md` |

> ⚠️ **Muhim:** ushbu darslikdagi **barcha kod bajarib tekshirilgan**. Natijalar **haqiqiy**.

---

## 7. 🛠 Kerakli kutubxonalar

NLP bo'limi uchun quyidagilar kerak bo'ladi:

```bash
pip install nltk scikit-learn pandas matplotlib
```

| Kutubxona | Nima uchun | Qaysi moduldan |
|---|---|---|
| **`nltk`** | Matnni qayta ishlash, POS, sentiment | 21-modul |
| **`scikit-learn`** | Vektorlashtirish, tasniflash | 24-modul |
| **`pandas`** | Ma'lumot jadvallari | 25-modul |
| **`matplotlib`** | Grafiklar | 25-modul |

> 💡 Bularning hammasi — **19-modulda o'rgangan PAKETLAR**. Endi ularni **amalda** ishlatasiz.

---

## 8. 💻 Birinchi NLP kodi

Hech qanday kutubxonasiz ham NLP qila olasiz. Mana **eng oddiy** misol — **so'z chastotasi**:

```python
matn = "NLP juda qiziqarli soha. NLP kompyuterlarga tilni tushunishga yordam beradi."

# ===== TOKENIZATSIYA (so'zlarga ajratish) =====
sozlar = matn.lower().replace(".", "").split()

# ===== CHASTOTA (18-modul naqshi!) =====
ch = {}
for s in sozlar:
    ch[s] = ch.get(s, 0) + 1

print("Jami so'zlar: ", len(sozlar))
print("Turli so'zlar:", len(ch))
print(ch)
```

**Natija:**

```
Jami so'zlar:  10
Turli so'zlar: 9
{'nlp': 2, 'juda': 1, 'qiziqarli': 1, 'soha': 1, 'kompyuterlarga': 1, 'tilni': 1, 'tushunishga': 1, 'yordam': 1, 'beradi': 1}
```

> ## 🔑 **Bu — 18-modulning chastota lug'ati naqshi. NLP shundan boshlanadi.**
>
> `ch.get(s, 0) + 1` — bu **17-modulning `.get()`** metodi *(kalit yo'q bo'lsa `0`)*.

---

## 9. 🧠 O'zini tekshirish savollari

1. NLP kompyuterlarga nima imkonini beradi?
2. Kursni boshlash uchun nima kerak?
3. 2-bo'lim nima haqida?
4. 8-bo'lim nima beradi?
5. Kurs nima bilan tugaydi?
6. Ma'ruzachi kim va u nima ustida ishlagan?

<details>
<summary>✅ Javoblar</summary>

1. Inson tilini **tushunish, yaratish va tasniflash**.
2. **Asosiy Python** ko'nikmalari va **mashinali o'rganish** bilan biroz tanishlik. NLP bo'yicha **oldingi bilim kerak emas**.
3. **Matnni oldindan qayta ishlash** — *"NLP ning eng fundamental jihatlaridan biri"*.
4. **To'liq amaliy keys** — portfolio uchun notebook.
5. **NLP kelajagi** — chuqur o'rganish va katta til modellari.
6. **Lauren Newbold** — ma'lumot olimi; rivojlanayotgan hamjamiyatlardagi intervyu ma'lumotlari uchun **maxsus matn tasniflagichi** qurgan.

</details>

---

## 📌 Xulosa

```
NLP KURSI — YO'L XARITASI

20 · Kirish                    ← siz shu yerdasiz
21 · Matnni oldindan qayta ishlash   ⭐ ENG FUNDAMENTAL
22 · POS tagging + NER
23 · Sentiment tahlili
24 · Vektorlashtirish          ← ML uchun tayyorlash
25 · Mavzu modellashtirish     ← NAZORATSIZ
26 · O'z tasniflagichingiz     ← NAZORAT OSTIDA
27 · Amaliy keys               ⭐ PORTFOLIO
28 · NLP kelajagi


✅ SIZDA BOR
Python asoslari (10-19)  ·  ML tushunchasi (03)


🛠 KERAKLI KUTUBXONALAR
pip install nltk scikit-learn pandas matplotlib


💡 BIRINCHI NLP KODI — chastota lug'ati
ch = {}
for s in sozlar:
    ch[s] = ch.get(s, 0) + 1
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| NLP | *natural language processing* | Tabiiy tilni qayta ishlash |
| Tasniflash | *classification* | Toifalarga ajratish |
| Oldindan qayta ishlash | *preprocessing* | Matnni tayyorlash |
| Sentiment tahlili | *sentiment analysis* | Hissiyotni aniqlash |
| Vektorlashtirish | *vectorization* | Matnni songa aylantirish |
| Mavzu modellashtirish | *topic modelling* | Mavzularni topish |
| Keys tadqiqoti | *case study* | Haqiqiy muammo yechimi |
| Portfolio | *portfolio* | Ishlaringiz to'plami |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: NLP ga kirish](02-Introduction-to-NLP.md)
