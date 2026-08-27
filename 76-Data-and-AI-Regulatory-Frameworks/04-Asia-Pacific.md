# 4-dars. Osiyo-Tinch okeani: kuchli davlat nazorati ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Xitoyning DSL 'ma'lumotni tasniflang' deydi — va bu EU da UMUMAN yo'q talab. 1-darsda o'lchagan edik: GDPR ni bajarsangiz, bu talab qoplanmaydi."**

---

## 1. Xitoyning to'rtta qonuni

| Qonun | Yil | Asosiy talab |
|---|---|---|
| ## **PIPL** | 2021 | Rozilik + ## ⭐ **chegaradan o'tkazish nazorati** |
| ## **DSL** | 2021 | ## ⭐ **Ma'lumotni TASNIFLASH** |
| Kiberxavfsizlik qonuni | 2017 | Tarmoq va infratuzilma |
| ## **Generativ AI choralari** | 2023 | Deepfake, AI kontenti |

> ## 🔑 **KURSNING KONTEKSTI:** ## Xitoy **2017-yilda** 2030-yilgacha ## AI yetakchisi bo'lish maqsadini e'lon qilgan.

---

## 2. 🔬 `DSL` — **ma'lumot tasnifi**

Bu — EU da **yo'q** talab. 1-darsda o'lchagan edik:

```
  EU ni bajarsangiz, QOLGAN talablar:
    - ma'lumot tasnifi              (Xitoy DSL)   💥
    - chegaradan o'tkazish ruxsati  (Xitoy PIPL)  💥
    - nomzodga xabar                (NY LL144)
    - kirish                        (POPIA)
```

### 🏆 Uni **kodga** aylantiramiz

```python
DARAJALAR = ["ommaviy", "ichki", "muhim", "asosiy"]


def malumot_tasnifi(toplam):
    """💡 DSL: har to'plam DARAJAGA ega bo'lishi kerak."""
    if toplam.get("davlat_xavfsizligi") or toplam.get("kritik_infratuzilma"):
        return "asosiy", ["chegaradan o'tkazish TAQIQ", "mahalliy saqlash",
                          "xavfsizlik baholovi"]
    if toplam.get("shaxsiy_malumot_soni", 0) > 1_000_000:
        return "muhim", ["chegaradan o'tkazishga RUXSAT", "yillik audit"]
    if toplam.get("shaxsiy_malumot_soni", 0) > 0:
        return "ichki", ["rozilik", "kirish nazorati"]
    return "ommaviy", []
```

### ✅ Bizning to'plamlarimizga qo'llaymiz

| To'plam | Daraja | Talab |
|---|---|---|
| Ish e'lonlari *(ommaviy)* | ## ⭐ **ommaviy** | — |
| Nomzod bazasi *(200 ta)* | ## **ichki** | Rozilik, kirish nazorati |
| ## **Intervyu arxivi** | ## **ichki** | Rozilik, kirish nazorati |
| Mijoz bazasi *(2 mln)* | ## 💥 **muhim** | ## ⭐ **Chegaradan o'tkazishga RUXSAT** |

> ## 💡 **VA BU TASNIF — FAQAT XITOY UCHUN EMAS.**
>
> ## ## 🏆 U 70-moduldagi ## ⭐ **"ma'lumot pasporti"** ning ## 🔑 **rasmiy versiyasi**.

> ## 💥 **YA'NI XITOY QONUNI SIZDAN ## ⭐ 70-MODULDA QILISHIMIZ KERAK BO'LGAN ISHNI ## TALAB QILADI.**

---

## 3. 🔑 Chegaradan o'tkazish — **eng katta amaliy ta'sir**

> *"Qonun Xitoy ma'lumoti boshqa mamlakatlar bilan **qanday
> ulashilishini** ham nazorat qiladi."*

Bu — **arxitektura** masalasi, siyosat emas.

| Qaror | Oqibat |
|---|---|
| Bulut serverini AQShda saqlash | ## 💥 **PIPL buziladi** |
| OpenAI API ga so'rov yuborish | ## 💥 **Ma'lumot chegaradan o'tadi** |
| ## **Mahalliy model ishlatish** | ## ✅ **Muammo yo'q** |

> ## 🏆🏆 **UCHINCHI QATOR — BU KITOBNING ## O'ZIDA ISHLATILGAN YECHIM.**
>
> ## ## ⭐ 65–75-modullardagi hamma o'lchov ## `Qwen2.5-0.5B` bilan, ## 💡 **bitta noutbukda** bajarildi.

> ## 🔑 **YA'NI "MAHALLIY MODEL" — ## ⭐ FAQAT ARZONLIK EMAS,** ## ## 💥 **ba'zi yurisdiksiyalarda — YAGONA YO'L.**

---

## 4. ⭐ Generativ AI choralari *(2023)*

> *"Deepfake va san'at kabi AI yaratgan kontentni tartibga soladi.
> Qoidalar **muvofiqlikni ta'minlaydi**, zararli ma'lumotning
> oldini oladi va foydalanuvchi ma'lumotini himoya qiladi."*

| Talab | Bu kitobda |
|---|---|
| AI kontentini **belgilash** | ## ⭐ **EU AI Act da ham bor** *(shaffoflik)* |
| Zararli kontentning oldini olish | ## 💥 **72-modul: 7/8 soxta asos** |
| Foydalanuvchi ma'lumotini himoya | ⭐ 75-modul |

> ## 💡 **BIRINCHI QATOR — IKKI REJIMDA HAM BOR.** ## ## 🏆 Ya'ni *"AI yaratganini belgilash"* — ## ⭐ **global konsensusga** yaqin talab.

> ## ⚠️ **LEKIN 74-MODULDA O'LCHAGAN EDIK:** ## ## 💥 **detektorlar ishlamaydi** *(67% / 50%)*. ## ## 🔑 Ya'ni bu talabni ## ⭐ **AI yaratuvchisi** bajarishi kerak, ## **aniqlovchi** emas.

---

## 5. 🏆 Boshqa mamlakatlar

> *"Yaponiya, Malayziya, Singapur va Janubiy Koreya innovatsiya,
> etika va jamoat xavfsizligini muvozanatlash uchun **turli
> yondashuvlarni** qo'llaydi."*

| Mamlakat | Yondashuv |
|---|---|
| Yaponiya | Yumshoq, mualliflik huquqi muhokamasi |
| Singapur | ## ⭐ **AI Verify — sinov to'plami** |
| Janubiy Koreya | Milliy strategiya |
| ## **Hindiston** | DPDP Act + NITI Aayog yo'riqnomalari |

> ## 💡 **SINGAPUR YONDASHUVI — ## ⭐ BU KITOBGA ENG YAQINI:** ## ## 🏆 qoida emas, **sinov to'plami**. ## ## 🔑 Ya'ni *"shunday qiling"* emas, ## ⭐ **"buni o'lchang va ko'rsating"**.

---

## 6. 💡 Uchta rejimni **taqqoslash**

| | EU | AQSh | Xitoy |
|---|---|---|---|
| Manba | ## **Qonun** | Soha + shtat | ## **Davlat** |
| Asos | ## ⭐ **Xavf darajasi** | Soha | ## ⭐ **Ma'lumot darajasi** |
| Kuchi | ## 💥 **Jarima** | Sud da'vosi | ## 💥 **Litsenziya** |
| ## **Bizga qiyin qismi** | ## 🏆 **8 ta talab** | ## 🏆 **Yamoq** | ## 🏆 **Joylashuv** |

> ## 🔑 **VA OXIRGI QATOR — ENG AMALIYSI:** ## ## ⭐ EU **jarayon** talab qiladi, ## AQSh **audit** talab qiladi, ## 💥 Xitoy **arxitektura** talab qiladi.

> ## 💡 **UCHINCHISINI KEYIN TUZATISH ## ⭐ ENG QIMMATI** — ## chunki u ## 💥 **serverni ko'chirishni** anglatadi.

---

## 🎯 Nazorat savollari

1. `DSL` ning asosiy talabi nima? U EU da bormi?
2. Ma'lumot tasnifi qaysi modulimizga o'xshaydi?
3. Chegaradan o'tkazish nega arxitektura masalasi?
4. Uchta rejim bizdan nimani talab qiladi?

<details>
<summary>Javoblar</summary>

1. ## **Ma'lumotni TASNIFLASH** — muhimligiga qarab darajalarga bo'lish. 💥 **EU da bu talab yo'q** — 1-darsda o'lchandi: GDPR ni bajarsangiz ham u **qoplanmaydi**.
2. ## **70-moduldagi "ma'lumot pasporti"** ga. 🏆 Ya'ni Xitoy qonuni bizdan ⭐ **o'sha modulda qilishimiz kerak bo'lgan ishni** talab qiladi.
3. ## Chunki u **server qayerda turishini** belgilaydi. 💥 OpenAI API ga so'rov yuborish — ma'lumot **chegaradan o'tishi**. ✅ **Mahalliy model** — muammo yo'q, va bu 🏆 **shu kitobda ishlatilgan yechim**.
4. ## EU — **jarayon** *(8 ta talab)*, AQSh — **audit** *(yamoq)*, Xitoy — **arxitektura** *(joylashuv)*. 💡 Uchinchisini keyin tuzatish ⭐ **eng qimmati**, chunki u **serverni ko'chirishni** anglatadi.

</details>

---

⬅️ [3-dars](03-United-States.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Africa.md)
