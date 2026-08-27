# 3-dars. OpenAI siyosatlari va ma'lumotni boshqarish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs to'rtta sozlamani tushuntiradi. Biz ularni qaror jadvaliga aylantirdik — va bitta savol ("bu ma'lumot ketsa nima bo'ladi?") to'rttasini ham hal qiladi."**

---

## 1. Kursning to'rtta mexanizmi

| Mexanizm | Nima qiladi | Standart holat |
|---|---|---|
| ## **Model o'qitishga ruxsat** | Suhbat o'qitishga ketadi | ## 💥 **YOQILGAN** |
| Suhbat tarixi | Suhbatlar saqlanadi | ## 💥 **YOQILGAN** |
| ## **Xotira** *(Memory)* | Siz haqingizda **eslab qoladi** | Yoqilgan |
| Vaqtinchalik suhbat | Hech narsa saqlanmaydi | O'chirilgan |

> ## 💥💥 **UCHTASI STANDART HOLATDA YOQILGAN.**
>
> ## ## 🔑 Ya'ni ## ⭐ **hech narsa qilmasangiz** — ## eng ko'p ma'lumot saqlanadi.

### 🏆 Va shifrlash

| Turi | Nimani himoya qiladi |
|---|---|
| ## **AES** | Saqlangan ma'lumot *(suhbat jurnallari)* |
| ## **TLS** | Yo'ldagi ma'lumot |

> ## ⚠️ **IKKALASI HAM — ## "BOSHQA BIROV O'QIMASIN" DEMAK.** ## ## 💥 Ular ## 🔑 **OpenAI ning o'zidan himoya qilmaydi**.

---

## 2. 🔧 To'rtta sozlama — **qaror jadvali**

```python
HOLATLAR = {
    "o'qitishga ketadimi?": {
        "bepul/plus (standart)":  True,
        "bepul/plus (opt-out)":   False,
        "enterprise":             False,
        "vaqtinchalik suhbat":    False,
    },
    "tarixda saqlanadimi?": {
        "bepul/plus (standart)":  True,
        "bepul/plus (opt-out)":   True,      # 💥 opt-out tarixni O'CHIRMAYDI
        "enterprise":             True,
        "vaqtinchalik suhbat":    False,
    },
    "xotiraga tushadimi?": {
        "bepul/plus (standart)":  True,
        "bepul/plus (opt-out)":   True,
        "enterprise":             True,
        "vaqtinchalik suhbat":    False,
    },
    "serverda qoladimi?": {
        "bepul/plus (standart)":  True,
        "bepul/plus (opt-out)":   True,
        "enterprise":             True,
        "vaqtinchalik suhbat":    True,      # 💥 sessiya davomida
    },
}
```

> ## 💥💥💥 **IKKINCHI QATOR — ENG KO'P YANGLISHADIGANI.**
>
> ## ## ⭐ *"Model o'qitishni o'chirdim"* — ## bu ## 🔑 **tarixni o'chirmaydi**.

> ## 🏆 **VA "SERVERDA QOLADIMI?" USTUNIDA — ## HAMMA JOYDA `True`.**
>
> ## ## 💥 Kurs buni aniq aytadi: ## ⭐ *"o'chirgandan keyin ham OpenAI nusxalarni ## ma'lum muddat saqlaydi"*.

---

## 3. 🔑 Bitta savol — **to'rttasini ham hal qiladi**

Sozlamalarni eslab qolish qiyin. **Bitta savol** yetarli:

> ## 💡💡 **"AGAR BU MATN ERTAGA GAZETADA ## CHIQSA, NIMA BO'LADI?"**

| Javob | Nima qilish |
|---|---|
| ## **Hech narsa** | ## ✅ Yuboring |
| Noqulay | ## ⚠️ **Tahrirlang** *(2-dars)* |
| ## **Muammo** | ## 💥 **Yubormang** |

> ## 🔑 **VA BU SAVOL — SOZLAMALARGA ## UMUMAN BOG'LIQ EMAS.**
>
> ## ## ⭐ Chunki 2-darsda ko'rganimizdek: ## 💥 **yuborilgan narsa yuborilgan**.

> ## 🏆 **SOZLAMALAR — XAVFNI KAMAYTIRADI.** ## ## 💡 **BU SAVOL — XAVFNI YARATMAYDI.**

---

## 4. ⭐ Xotira — kursning misoli

> *"ChatGPT ga itingizning ismi **Beethoven** ekanini aytsangiz...
> xotira yoqilgan bo'lsa, keyinroq *"Beethoven ni parkka olib bordim"*
> deganingizda u ismni **tanib oladi**."*

### 🔬 Xotira nima uchun **maxfiylik masalasi?**

| Suhbat tarixi | Xotira |
|---|---|
| Bir suhbat ichida | ## ⭐ **Suhbatlar ORASIDA** |
| Siz ko'rasiz | Siz ko'rasiz *(Personalization)* |
| ## **O'chirsangiz — ketadi** | ## 💥 **Alohida o'chirish kerak** |

> ## 💥💥 **ASOSIY FARQ:** ## suhbatni o'chirsangiz ham, ## ⭐ **xotira qoladi**.

### 🏆 Amaliy tekshiruv

```python
XOTIRA_AUDITI = [
    "Settings -> Personalization -> Memory ni oching",
    "Ro'yxatni O'QING — nima saqlangan?",
    "Ish bilan bog'liq narsa bormi?",
    "Boshqa odam haqida ma'lumot bormi?",   # 💥 ular rozilik bermagan
    "Keraksizini o'chiring",
]
```

> ## 💥💥 **TO'RTINCHI QATOR — ENG MUHIMI.**
>
> ## ## 🔑 Siz **hamkasbingiz** yoki **mijozingiz** haqida ## gapirgan bo'lsangiz — ## ⭐ **ular rozilik bermagan**.

> ## 💡 **VA BU — 72-MODULDAGI ## "ROZILIK YOZUVI" MUAMMOSI,** ## faqat ## ⭐ **siz "ma'lumot to'plovchi"** rolida.

---

## 5. 🏆 Vaqtinchalik suhbat — **qachon ishlatish**

| Holat | Vaqtinchalik? |
|---|---|
| Kod xatosini tushuntirish | Kerak emas |
| ## **Ish shartnomasini tahlil qilish** | ## 🏆 **Ha** |
| Retsept so'rash | Kerak emas |
| ## **Sog'liq savoli** | ## 🏆 **Ha** |
| ## **Nizo/shikoyat matni** | ## 🏆 **Ha** |
| Til o'rganish | Kerak emas |

> ## 💡 **QOIDA:** ## agar mavzu ## ⭐ **siz haqingizda uzoq muddatli ## xulosa** chiqarishga imkon bersa — ## 🏆 **vaqtinchalik suhbat**.

> ## ⚠️ **LEKIN ESLANG:** ## u ham ## 💥 **sessiya davomida serverda** bo'ladi. ## ## 🔑 U *"saqlanmaydi"* demak, ## *"yuborilmaydi"* demak **emas**.

---

## 6. ⚠️ Kursning oxirgi maslahati

> *"OpenAI ning maxfiylik siyosatlaridan **xabardor bo'lib turing**,
> chunki ChatGPT shartlari **o'zgarishi mumkin**."*

> ## 🔧 **BU — TO'G'RI, LEKIN BAJARIB BO'LMAYDI.** ## ## 💥 Hech kim siyosat sahifasini ## ⭐ **muntazam o'qimaydi**.

### 🏆 Bajariladigan shakli

| Kurs maslahati | Bajariladigan shakli |
|---|---|
| *"Siyosatdan xabardor bo'ling"* | ## 🏆 **Tahrirlovchi yozing** *(2-dars)* |
| *"Sozlamalarni tekshiring"* | ## ⭐ **Yiliga bir marta kalendarga** |
| *"Nozik narsa yubormang"* | ## 💡 **"Gazeta" savoli** |

> ## 🔑 **CHAP USTUN SIYOSAT O'ZGARSA — BUZILADI.** ## ## 🏆 **O'NG USTUN — O'ZGARMAYDI.**

> ## 💡💡 **VA BU — BUTUN MODULNING ## AMALIY XULOSASI:** ## ## ⭐ **kompaniya siyosatiga emas, ## O'Z jarayoningizga tayaning.**

---

## 🎯 Nazorat savollari

1. Nechta sozlama standart holatda yoqilgan?
2. *"Model o'qitishni o'chirish"* tarixni o'chiradimi?
3. Xotira va suhbat tarixi orasidagi asosiy farq nima?
4. *"Gazeta savoli"* nega sozlamalardan yaxshiroq?

<details>
<summary>Javoblar</summary>

1. ## **Uchtasi:** o'qitishga ruxsat, suhbat tarixi va xotira. 🔑 Ya'ni ⭐ **hech narsa qilmasangiz** — eng ko'p ma'lumot saqlanadi.
2. ## **Yo'q.** 💥 Bu — eng ko'p yanglishadigan joy. Opt-out faqat **o'qitishni** to'xtatadi; tarix, xotira va serverdagi nusxa ⭐ **qoladi**.
3. ## Xotira — **suhbatlar ORASIDA** ishlaydi. 💥 Suhbatni o'chirsangiz ham **xotira qoladi**, u **alohida** o'chiriladi. ⚠️ Va unda **boshqa odamlar** haqida ma'lumot bo'lishi mumkin — ular rozilik bermagan.
4. ## Chunki u ⭐ **sozlamalarga bog'liq emas**. 🔑 Sozlamalar xavfni **kamaytiradi**, savol esa xavfni **yaratmaydi**. 💡 Va siyosat o'zgarsa — sozlamalar bo'yicha bilimingiz buziladi, savol **buzilmaydi**.

</details>

---

⬅️ [2-dars](02-Privacy-Concerns.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Misinformation.md)
