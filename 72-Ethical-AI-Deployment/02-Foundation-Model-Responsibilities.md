# 2-dars. Asos modellar ishlab chiquvchilarining javobgarligi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs shaffoflikni talab qiladi. Biz uchta model kartani audit qildik — bizning ilovamiz 8 tadan 1 tasini bajargan."**

---

## 1. Asos modellar

> *"GPT-4, Gemini, Claude, Llama va DeepSeek — hozirda eng kuchli asos
> modellar qatorida."*

| Nima | Ma'no |
|---|---|
| ## **Asos model** *(foundation model)* | Katta ma'lumotda o'qitilgan, ## ⭐ **ko'p vazifaga yaroqli** |
| Undan quriladi | ChatGPT, Copilot, ## **sizning ilovangiz** |

> ## 🔑 **VA SHU YERDA MUHIM NARSA BOR:** ## siz asos modelni o'qitmaysiz, ## lekin ## 💥 **uning muammolarini meros qilib olasiz**.

---

## 2. Kursning uchta talabi

| # | Talab | O'lchash mumkinmi? |
|---|---|---|
| ① | ## **Shaffoflik** — nima bilan o'qitilgan | ## ⭐ **Ha — model karta** |
| ② | Xavfsizlik va huquqiy muvofiqlik | ⭐ Qisman |
| ③ | ## **Xilma-xil ovozlar** | ## ⚠️ Bilvosita |

---

## 3. 🔬 **Model karta** auditi

Shaffoflikni tekshirishning eng amaliy yo'li — **model karta**.

```python
KARTA_TALABLARI = [
    "o'quv ma'lumoti manbasi",
    "litsenziya",
    "baholash natijalari",
    "ma'lum cheklovlar",
    "bias auditi",
    "mo'ljallangan foydalanish",
    "MO'LJALLANMAGAN foydalanish",      # ⭐ eng ko'p unutiladigani
    "aloqa/shikoyat kanali",
]


def karta_auditi(bor):
    yoq = [t for t in KARTA_TALABLARI if t not in bor]
    return len(bor), yoq
```

### ✅ Haqiqiy natija

```
  bizning ilova        1/8   yetishmaydi: o'quv ma'lumoti manbasi, litsenziya,
                             baholash natijalari, ma'lum cheklovlar, bias auditi,
                             MO'LJALLANMAGAN foydalanish, aloqa/shikoyat kanali
  tipik ochiq model    4/8   yetishmaydi: ma'lum cheklovlar, bias auditi,
                             MO'LJALLANMAGAN foydalanish, aloqa/shikoyat kanali
  yaxshi karta         8/8   yetishmaydi: -
```

> ## 💥💥 **BIZNING ILOVA — 1/8.**
>
> ## ## ⭐ Va yagona bajarilgan band — ## 🔑 **"mo'ljallangan foydalanish"**, ## ya'ni ## 💥 **marketing matni**.

### 🏆 Eng muhim ikkita band

| Band | Nega muhim |
|---|---|
| ## **MO'LJALLANMAGAN foydalanish** | ## 🔑 *"Bu modelni tibbiy tashxis uchun ## **ISHLATMANG**"* — ## ⭐ buni yozmasangiz, ## 💥 **kimdir ishlatadi** |
| ## **Aloqa/shikoyat kanali** | ## 💥 Muammoni ## ⭐ **kim aytadi sizga?** |

> ## 💡 **"MO'LJALLANMAGAN FOYDALANISH" — ## ENG ARZON XAVFSIZLIK VOSITASI.** ## ## 🏆 U **bir necha qator matn**, ## lekin ## ⭐ **javobgarlik chegarasini** belgilaydi.

---

## 4. ⚠️ Kurs to'g'ri aytgan narsa — **tushunarsizlik**

> *"Asos modellar shu qadar murakkabki, ular qarorga **qanday
> kelganini aytish mumkin emas**."*

Bu — **69-moduldagi** *"tushuntirib bo'ladiganlik"* muammosining
eng og'ir ko'rinishi.

| Model turi | Tushuntirish |
|---|---|
| Chiziqli regressiya | ## ✅ **Har koeffitsient ko'rinadi** |
| Qaror daraxti | ✅ Yo'lni chizish mumkin |
| ## **Asos model** | ## 💥 **Amalda mumkin emas** |

> ## 🔑 **AMALIY YECHIM:** ## modelni tushuntirib bo'lmasa — ## ⭐ **jarayonni** tushuntiring: ## qanday ma'lumot, qanday testlar, ## 🏆 **qanday shikoyat kanali**.

> ## 💡 **VA BU — MODEL KARTANING ASOSIY MA'NOSI.** ## U modelning **ichini** emas, ## ⭐ **atrofidagi jarayonni** hujjatlashtiradi.

---

## 5. ⚠️ Kursning uchinchi talabi — **xilma-xil ovozlar**

> *"Doktor Timnit Gebru asos solgan **Distributed AI Research Institute**
> (DAIR) kam vakillik qilingan jamoalarning ehtiyojlarini o'rganadi."*

> ## ✅ **BU — TO'G'RI VA MUHIM MISOL.** ## ## ⚠️ Lekin kurs uni ## 🔑 **o'lchanadigan qadamga** aylantirmaydi.

### 🏆 Buni **o'lchanadigan** qilamiz

| Savol | Manba |
|---|---|
| Vakillik auditi qilinganmi? *(marginal **va** kesishma)* | ## ⭐ **70-modul** |
| Chetki holatlar **foydalanuvchi tilida** sinalganmi? | ## 🏆 **71-modul** |
| Model karta **cheklovlarni** aytadimi? | ## ⭐ Bu dars |
| Shikoyat kanali bormi va **ishlaydimi?** | ⭐ 6-dars |

> ## 💡 **"XILMA-XIL OVOZLARNI JALB QILING" — ## YAXSHI MASLAHAT, LEKIN BAJARIB BO'LMAYDI.** ## ## 🏆 Yuqoridagi to'rtta savol — ## ⭐ **o'sha maslahatning bajariladigan shakli**.

---

## 6. 🔑 Meros qilib olinadigan xavflar

Siz asos modelni **o'zingiz o'qitmaysiz**. Lekin quyidagilar
**sizniki** bo'lib qoladi:

| Xavf | Kimdan keladi | Sizda nima qoladi |
|---|---|---|
| Bias | ## Asos model | ## 💥 **Sizning qaroringiz** |
| Gallyutsinatsiya | Asos model | ## 💥 **Sizning javobgarligingiz** |
| ## **Mualliflik huquqi** | ## Asos model | ## 💥 **Sizning sudingiz** |
| Nomuvofiqlik | Asos model | ## ⚠️ Sizning mijozingiz |

> ## 💥💥 **"BIZ FAQAT API CHAQIRAMIZ" — HIMOYA EMAS.**
>
> ## ## 🔑 Foydalanuvchi ## ⭐ **sizning ilovangizni** ko'radi, ## OpenAI ni emas.

> ## 🏆 **SHUNING UCHUN 4–6-DARSLAR — ## ENG AMALIY QISM:** ## nomuvofiqlik, gallyutsinatsiya, monitoring ## ⭐ **sizning tomoningizda** hal qilinadi.

---

## 🎯 Nazorat savollari

1. Bizning ilovamiz model karta auditidan qanday o'tdi?
2. Model kartaning eng ko'p unutiladigan bandi qaysi?
3. Asos modelni tushuntirib bo'lmasa, nima qilinadi?
4. *"Biz faqat API chaqiramiz"* — bu himoyami?

<details>
<summary>Javoblar</summary>

1. ## **1/8.** 💥 Va yagona bajarilgan band — *"mo'ljallangan foydalanish"*, ya'ni ⭐ **marketing matni**. Tipik ochiq model — **4/8**.
2. ## **"MO'LJALLANMAGAN foydalanish".** 🔑 *"Bu modelni tibbiy tashxis uchun ishlatmang"* — buni yozmasangiz, 💥 **kimdir ishlatadi**. ⭐ Bu — **eng arzon xavfsizlik vositasi**.
3. ## **Jarayonni tushuntiring.** Model ichini emas — ⭐ qanday ma'lumot, qanday testlar, 🏆 **qanday shikoyat kanali**. Model kartaning asosiy ma'nosi shu.
4. ## **Yo'q.** 💥 Bias, gallyutsinatsiya, mualliflik huquqi va nomuvofiqlik asos modeldan keladi, lekin 🔑 **javobgarlik sizda qoladi** — foydalanuvchi ⭐ **sizning ilovangizni** ko'radi.

</details>

---

⬅️ [1-dars](01-IP-and-Consent.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Open-Source-Data.md)
