# 5-dars. ChatGPT va plagiat ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"n-gramma detektorini yozdik. So'zma-so'z nusxa — 1.00. Parafraz — 0.00. Butunlay begona matn ham — 0.00. Ya'ni parafrazni begona matndan AJRATIB BO'LMAYDI."**

---

## 1. Kursning to'rt turi

| Turi | Nima |
|---|---|
| ## **Global** | Butun matn boshqaniki |
| ## **So'zma-so'z** | Aynan ko'chirilgan, iqtibossiz |
| ## **Parafraz** | G'oya boshqaniki, so'zlar sizniki |
| ## **Yamoq** *(patchwork)* | Bir necha manbadan yig'ilgan |

> ## 🔑 **KURSNING MUHIM KUZATUVI:** ## ## ⭐ birinchisidan boshqasi ## 💥 **ko'pincha BEIXTIYOR** sodir bo'ladi.

---

## 2. 🔬 Detektorlar buni **topa oladimi?**

Eng keng tarqalgan usul — **n-gramma ustma-ustligi**.

```python
import re


def ngramma(matn, n=5):
    sozlar = re.findall(r"[a-z']+", matn.lower())
    return {tuple(sozlar[i:i+n]) for i in range(len(sozlar) - n + 1)}


def ustma_ust(a, b, n=5):
    A, B = ngramma(a, n), ngramma(b, n)
    return len(A & B) / len(A) if A else 0.0
```

To'rtta variantni sinaymiz:

| Variant | Nima |
|---|---|
| So'zma-so'z | Aynan nusxa |
| Kichik tahrir | 3–4 so'z almashtirilgan |
| ## **Parafraz** | ## ⭐ **G'oya bir xil, so'zlar butunlay boshqa** |
| Mustaqil | ## 💥 **Butunlay begona matn** *(nazorat)* |

### ✅ Haqiqiy natija

```
    n     so'zma-so'z   kichik tahrir        parafraz        mustaqil
    3            1.00            0.80            0.00            0.00
    5            1.00            0.67            0.00            0.00
    8            1.00            0.40            0.00            0.00
```

> ## 💥💥💥 **PARAFRAZ — `0.00`.** ## ## VA MUSTAQIL MATN HAM — ## 🔑 **`0.00`.**

> ## 🏆 **YA'NI DETEKTOR PARAFRAZNI ## ⭐ BUTUNLAY BEGONA MATNDAN ## 💥 AJRATA OLMAYDI.**

### 🔑 Va bu — **tasodif emas**

| Kurs turi | Detektor topadimi |
|---|---|
| Global *(aynan nusxa)* | ## ✅ **Ha — 1.00** |
| So'zma-so'z | ## ✅ **Ha** |
| Kichik tahrir | ## ⚠️ **Qisman** *(0.40–0.80)* |
| ## **Parafraz** | ## 💥 **YO'Q** |
| ## **Yamoq** | ## 💥 **Deyarli yo'q** |

> ## 💥💥 **VA KURS AYNAN SHU IKKITASINI ## "ENG KO'P BEIXTIYOR SODIR BO'LADI" DEYDI.**

> ## 🔑 **YA'NI DETEKTOR ## ⭐ ENG KAM UCHRAYDIGAN TURNI TOPADI,** ## va ## 💥 **eng ko'p uchraydiganini o'tkazib yuboradi**.

---

## 3. ⚠️ `n` ni tanlash — **kelishuv**

```
    n     so'zma-so'z   kichik tahrir
    3            1.00            0.80
    5            1.00            0.67
    8            1.00            0.40
```

| `n` kichik | `n` katta |
|---|---|
| ## ⭐ **Ko'proq topadi** | ## ⭐ **Kamroq yolg'on bayroq** |
| 💥 Oddiy iboralar ham mos keladi | 💥 Kichik tahrir **o'tib ketadi** |

> ## 💡 **`n=3` DA:** ## `"in order to make"` kabi ## ⭐ **oddiy iboralar** ham ## 💥 **"plagiat"** deb belgilanadi.

> ## 🏆 **AMALDA `n=5`–`n=8` ISHLATILADI,** ## va bu ## ⚠️ **kichik tahrirni yarim o'tkazadi**.

---

## 4. 💥 AI detektorlari — **74-modulda o'lchandi**

> *"GPTZero kabi tizimlarning aniqligi **cheklangan**. Ular
> ko'pincha inson va AI yozuvini ajrata olmaydi, yoki **original
> ishni AI deb noto'g'ri baholaydi**."*

74-modulda o'lchagan edik:

| Sinov | Aniqlik |
|---|---|
| Men to'qigan namunalar | 🔧 100% *(doiraviy)* |
| ## **Haqiqiy model matni** | ## ⚠️ **67%** |
| Qisqartma | ## 💥 **50%** *(doimiy javob)* |
| ## **6 ta so'z almashtirilgach** | ## 💥 **`5/5` → `1/5`** |

> ## 🏆 **KURSNING DA'VOSI TASDIQLANDI —** ## va u ## ⭐ **kursda aytilganidan ham yomonroq**.

### 💥 Kursning eng muhim jumlasi

> *"Bu **yangi turdagi tengsizlik** yaratadi — foydalanuvchilar
> AI dan **mas'uliyatli** foydalanganda ham **jazolanishi** mumkin."*

> ## 💥💥 **VA 74-MODUL BUNGA SON BERDI:** ## uzunlik detektori ## ⭐ **100% aniqlik** ko'rsatdi, ## lekin u aslida ## 🔑 **"uzunmi?"** ni o'lchardi.

> ## 💡 **YA'NI BATAFSIL YOZADIGAN TALABA — ## ⭐ AVTOMATIK "AI" DEB BELGILANADI.**

---

## 5. 🏆 Nima ishlaydi — **jarayon, detektor emas**

Detektorlar ishlamasa, nima qoladi?

```python
JARAYON = [
    ("Qoralamalar tarixini saqlang",
     "versiyalar ketma-ketligi — AI da yo'q"),

    ("Manbalarni YOZIB BORING",
     "4-dars: keyin tekshirib bo'lmaydi"),

    ("AI qismini BELGILANG",
     "74-modul: shaffoflik sinovi"),

    ("O'z so'zlaringiz bilan QAYTA yozing",
     "parafraz emas — TUSHUNIB yozish"),

    ("Faktlarni tekshiring",
     "4-dars: soxta manba + plagiat = ikki muammo"),
]
```

> ## 🏆🏆 **BIRINCHISI — ENG KUCHLI HIMOYA.** ## ## 🔑 Qoralamalar ketma-ketligi ## ⭐ **ishning sizniki ekanini ko'rsatadi**, ## va uni ## 💥 **soxtalashtirish qiyin**.

> ## 💡 **VA U DETEKTORGA UMUMAN BOG'LIQ EMAS** — ## xuddi 74-moduldagi ## ⭐ **parol so'zi** kabi.

---

## 6. ⚠️ Kursning maslahati — **taqiq ishlaydimi?**

> *"Ko'p ta'lim muassasalari ChatGPT ni **butunlay taqiqlashga**
> qaror qildi... Lekin taqiqlar **uzoq muddatli yechim emas**."*

| Taqiq | Natija |
|---|---|
| Ishlatishni taqiqlash | ## 💥 **Yashirin ishlatiladi** |
| Detektorga tayanish | ## 💥 **67% / 50%** |
| ## **Jarayonni talab qilish** | ## 🏆 **Qoralamalar, manbalar** |
| ## **Ochiq e'lon qilishni talab qilish** | ## ⭐ **Shaffoflik** |

> ## 🔑 **OXIRGI IKKITASI —** ## ⭐ **AI sifatiga bog'liq emas**, ## va ular ## 🏆 **modellar yaxshilanganda ham ishlaydi**.

> ## 💡 **BU — BUTUN KITOBDA ## TAKRORLANADIGAN NAQSH:** ## ## 💥 **texnik aniqlashga tayangan yechim — yiqiladi.** ## ## 🏆 **JARAYONGA tayangan yechim — qoladi.**

---

## 🎯 Nazorat savollari

1. Parafraz uchun n-gramma ustma-ustligi qancha chiqdi?
2. Nega bu natija jiddiy?
3. `n` ni oshirish nima beradi, nima olib qo'yadi?
4. Detektorlar ishlamasa, nima ishlaydi?

<details>
<summary>Javoblar</summary>

1. ## **`0.00`** — hamma `n` da. 💥 Va **butunlay begona matn** ham `0.00`. 🔑 Ya'ni detektor ularni **ajrata olmaydi**.
2. ## Chunki kurs **parafraz va yamoq** turlarini ⭐ *"eng ko'p beixtiyor sodir bo'ladi"* deydi. 💥 Detektor esa **eng kam uchraydigan** turni *(aynan nusxa)* topadi va **eng ko'p uchraydiganini o'tkazib yuboradi**.
3. ## `n=8` da so'zma-so'z nusxa hamon `1.00`, lekin **kichik tahrir** `0.80` → **`0.40`** ga tushadi. ⭐ `n` kichik bo'lsa ko'proq topadi, lekin 💥 `"in order to make"` kabi **oddiy iboralar** ham plagiat deb belgilanadi.
4. ## **Jarayon:** 🏆 **qoralamalar tarixi** *(eng kuchlisi)*, manbalarni yozib borish, AI qismini belgilash. 💡 Ular ⭐ **detektorga bog'liq emas** — xuddi 74-moduldagi **parol so'zi** kabi.

</details>

---

⬅️ [4-dars](04-Misinformation.md) · 🏠 [Modul](README.md) · ➡️ [6-dars](06-Environment.md)
