# 2-dars. Ilova tuzilishi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 1500 savollik ma'lumotlar bazasi haqida gapiradi. Biz uni qurdik — va 'mos savol topilmasa nima bo'ladi?' degan savolga javob berdik."**

---

## 1. Uchta intervyu varianti

| Variant | Nima qiladi |
|---|---|
| **Kompaniyani tanlash** | Tanlangan kompaniya savollari |
| ## **O'z kompaniyangiz** | ## ⚠️ **Foydalanuvchi talablarini yozadi** |
| **Kompaniyasiz** | Umumiy intervyu |

> ## ⚠️ **"O'Z KOMPANIYANGIZ" — ENG XAVFLI VARIANT.** ## Foydalanuvchi **erkin matn** yozadi, ## u esa **to'g'ridan-to'g'ri promptga** tushadi. ## ## 🔑 6-darsda kurs aynan shu holatda ## **gallyutsinatsiya ko'payishini** aytadi.

---

## 2. ⭐ Beshta kategoriya — ikki xil intervyu

| HR intervyu | Texnik intervyu |
|---|---|
| `background` | `background` |
| `technical knowledge` | `technical knowledge` |
| `situational` | `case study` |
| `brain teaser` | ## ⭐ **`database`** |
| `analytical` | ## ⭐ **`coding`** |

> ## 🏆 **KATEGORIYALAR — BU "TUTQICH".** ## Kurs aytadi: ## *"Bu tuzilma savollarni tartibga soladi ## va **LLM ni cheklaydi**"*.
>
> ## ## 🔑 **VA BU — TO'G'RI STRATEGIYA:** ## LLM ga *"savol ber"* deyish o'rniga ## *"`situational` toifasida savol ber"* deyish — ## ⭐ **javob maydonini toraytiradi**.

---

## 3. 📚 1500 savollik ma'lumotlar bazasi

Kurs aytadi: *"Bizda 1500 dan ortiq savol bor... Har intervyu uchun MB dan **ikkita** savol olamiz, qolgan **to'rttasini** LLM yaratadi."*

### 🔬 Quramiz

```python
db.executescript("""
CREATE TABLE savollar (
    id            INTEGER PRIMARY KEY,
    tur           TEXT NOT NULL CHECK (tur IN ('written','coding','database')),
    intervyu      TEXT NOT NULL CHECK (intervyu IN ('HR','texnik')),
    kategoriya    TEXT NOT NULL,
    daraja        TEXT NOT NULL CHECK (daraja IN ('Junior','Mid-level','Senior')),
    lavozim       TEXT NOT NULL,
    kompaniya     TEXT,                       -- ⭐ NULL = umumiy savol
    matn          TEXT NOT NULL,
    misol         TEXT                        -- ⭐ faqat coding uchun
);
CREATE INDEX idx_tanlov ON savollar(intervyu, daraja, lavozim, kategoriya);
""")
```

> ## ⭐ **`CHECK` CHEKLOVLARI** *(63-modul)* — ## noto'g'ri `tur` yoki `daraja` ## **MB ga umuman kirmaydi**.

### ✅ Haqiqiy natija — 1 500 savol

```
jami: 1500
  HR      written     752
  texnik  coding      140
  texnik  database    160
  texnik  written     448
```

---

## 4. 💥 **VA MANA KURS AYTMAGAN SAVOL:** mos savol **topilmasa**?

Foydalanuvchi *"Junior Data Engineer at NOMA'LUM KOMPANIYA"* deb tanlasa — MB da **hech narsa yo'q**.

### ✅ Yechim — **bosqichma-bosqich yumshatish**

```python
def savol_tanla(intervyu, daraja, lavozim, kompaniya, n=2):
    """Aniqdan umumiyga — bosqichma-bosqich yumshatish."""
    bosqichlar = [
        ("kompaniya bilan",
         "intervyu=? AND daraja=? AND lavozim=? AND kompaniya=?",
         (intervyu, daraja, lavozim, kompaniya)),
        ("kompaniyasiz",
         "intervyu=? AND daraja=? AND lavozim=?",
         (intervyu, daraja, lavozim)),
        ("darajasiz",
         "intervyu=? AND lavozim=?", (intervyu, lavozim)),
        ("faqat tur", "intervyu=?", (intervyu,)),
    ]
    for nom, shart, par in bosqichlar:
        r = db.execute(
            f"SELECT id, kategoriya, matn FROM savollar WHERE {shart} "
            f"ORDER BY RANDOM() LIMIT ?", par + (n,)).fetchall()
        if len(r) == n:
            return r, nom
    return [], "topilmadi"
```

### ✅ Haqiqiy natija

```
('HR', 'Junior', 'Data Scientist', 'Meta')            -> [kompaniya bilan] 2 savol
('texnik', 'Senior', 'ML Engineer', 'Spotify')        -> [kompaniya bilan] 2 savol
('HR', 'Mid-level', 'Financial Analyst', 'Nestle')    -> [kompaniya bilan] 2 savol
('texnik', 'Junior', 'Data Engineer', "NOMA'LUM ...") -> [kompaniyasiz]    2 savol
```

> ## 🏆 **TO'RTINCHI HOLAT — AVTOMATIK YUMSHADI.** ## Kompaniya topilmadi → ## ⭐ **kompaniyasiz savollar** ishlatildi.

> ## 💡 **VA BU — UMUMIY NAQSH:** ## qidiruvni **hech qachon bo'sh qaytarmang**. ## ⭐ Shartlarni **birma-bir olib tashlang**.

---

## 5. ⭐ *"Bir vaqtda bitta savol"*

Kurs aytadi:

> *"Butun suhbat tarixi o'rniga bir vaqtda bitta savolni ko'rsatib, jarayonni optimallashtirdik. Bu foydalanuvchiga har bir savolga alohida e'tibor qaratishga imkon beradi va **uzoqroq, o'ylangan javoblar** olib keladi."*

| | Prototip *(66-modul)* | ## Ishlab chiqarish |
|---|---|---|
| Ekranda | butun suhbat | ## ⭐ **bitta savol** |
| Modelga yuboriladi | butun tarix | ## 🏆 **oldingi juftlik** |
| Foydalanuvchi diqqati | tarqoq | ## ⭐ **jamlangan** |

> ## 🏆🏆 **BU — IKKI TOMONLAMA YUTUQ:** ## ① foydalanuvchi uchun **yaxshiroq UX**, ## ② siz uchun ## 💰 **kamroq token** *(3-darsda o'lchaymiz)*.

---

## 6. ⭐ Fikr-mulohaza ekrani — **beshta ko'rsatkich**

| Element | Nima |
|---|---|
| Umumiy ball | 1–10 |
| ## **4 ta mezon** | HR va texnik uchun **har xil** |
| Matnli xulosa | Umumiy tavsif |
| ## **Yaxshilash yo'nalishlari** | ⭐ Amaliy maslahat |
| Har savol bo'yicha baho | ## ⭐ **Asosiy xulosalar** |

> ## 💡 **66-MODULDA BIZDA BITTA BALL BOR EDI.** ## Bu yerda — **beshta**, ## va har biri **JSON maydoni**.

> ## ⚠️ **VA BU — 5-DARSDAGI MUAMMONING SABABI:** ## baholovchi LLM **eng ko'p ma'lumotni** qayta ishlaydi, ## shuning uchun **eng ko'p xato** ham shu yerda.

---

## 7. 🏆 Uchta LLM — arxitektura

```
                  foydalanuvchi sozlamalari
                            |
                            v
   MB (2 savol) -->  [1] SAVOL GENERATORI  --> 6 savol (JSON)
                            |
                            v
   oldingi savol+javob -> [2] HUMANIZER  --> 1 savol (JSON)
                            |          ^
                            v          |
                      foydalanuvchi javobi
                            |
                            v (intervyu tugadi)
       butun tarix -->  [3] BAHOLOVCHI  --> fikr-mulohaza (JSON)
```

| LLM | Vazifa | Kontekst hajmi |
|---|---|---|
| ① Generator | 6 savol yaratish | o'rta |
| ## ② Humanizer | ## Savolni **jonlantirish** | ## ⭐ **kichik** |
| ## ③ Baholovchi | Fikr-mulohaza | ## 💥 **eng katta** |

> ## 💡 **KURS AYTADI: "UCHTA MODEL QIMMATROQ TUYULADI, ## LEKIN AMALDA ARZONROQ."**
>
> ## ## 🔑 **SABAB — ② NING KONTEKSTI KICHIK.** ## U **butun tarixni** emas, ## faqat **oldingi juftlikni** oladi. ## ## ⭐ 3-darsda buni **o'lchaymiz**.

---

## 🎯 Nazorat savollari

1. Qaysi intervyu varianti eng xavfli va nega?
2. MB da mos savol topilmasa nima qilish kerak?
3. *"Bir vaqtda bitta savol"* nima uchun ikki tomonlama yutuq?
4. Uch LLM dan qaysi biri eng katta kontekst oladi?

<details>
<summary>Javoblar</summary>

1. ## **"O'z kompaniyangiz"** — foydalanuvchi **erkin matn** yozadi va u **to'g'ridan-to'g'ri promptga** tushadi. ⚠️ Kurs 6-darsda aynan shu holatda **gallyutsinatsiya ko'payishini** aytadi; 7-darsda esa bu — `prompt injection` yuzasi.
2. ## **Shartlarni bosqichma-bosqich olib tashlash.** O'lchandi: `kompaniya bilan` → topilmasa `kompaniyasiz` → `darajasiz` → `faqat tur`. 🏆 Qidiruv **hech qachon bo'sh qaytmaydi**.
3. ## ① Foydalanuvchi **bitta savolga** diqqat qiladi *(uzunroq javoblar)*, ② modelga **butun tarix emas, oldingi juftlik** yuboriladi 💰 *(kamroq token)*.
4. ## **Baholovchi (③).** U butun suhbat tarixini oladi va **beshta ball + xulosa + har savol bahosi** ni JSON da qaytarishi kerak. ⚠️ Shuning uchun xatolarning ko'pchiligi **shu yerda**.

</details>

---

⬅️ [1-dars](01-Introduction.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Prompt-Structure-HR.md)
