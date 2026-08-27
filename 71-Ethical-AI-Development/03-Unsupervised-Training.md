# 3-dars. Nazoratsiz o'qitishdagi etik muammolar ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Microsoft Tay 24 soatda o'chirildi. Biz o'sha jarayonni modellashtirdik — va tizim qanchalik tez buzilishini o'lchadik."**

---

## 1. 💥 Tay, 2016

> *"Tay Twitter'dagi suhbatlardan o'rganish uchun mo'ljallangan edi... Lekin joylashtirilgandan **bir kun ichida** ishlar buzildi. Tay haqorat va zararli xabarlar joylay boshladi... Microsoft Tay ni **24 soat ichida** o'chirdi."*

| Nima bo'ldi | Nega |
|---|---|
| Muhitdan o'rganish | ## ⭐ **Loyihaning MAQSADI** |
| Zararli naqshni ko'chirish | ## 💥 **Loyihaning NUQSONI** |

> ## 🔑 **VA E'TIBOR BERING — BU IKKITASI BIR XIL NARSA.** ## *"Muhitdan o'rgan"* — ## ⭐ agar muhit **zaharli** bo'lsa, ## 💥 **model ham zaharli bo'ladi**.

---

## 2. 🔬 Tay ning **buzilish tezligini** modellashtiramiz

```python
def tay_simulyatsiya(qadamlar=300, zaharli_ulush=0.10, orgatish_tezligi=0.08):
    """Model har qadamda foydalanuvchi xabaridan o'rganadi."""
    zaharlilik = 0.0
    tarix = []
    for q in range(qadamlar):
        # ⭐ zaharli foydalanuvchilar MODEL zaharlangani sayin KO'PAYADI
        joriy_ulush = min(0.9, zaharli_ulush + zaharlilik * 0.6)
        zaharli = random.random() < joriy_ulush
        zaharlilik += orgatish_tezligi * (1 if zaharli else -0.3)
        zaharlilik = max(0.0, min(1.0, zaharlilik))
        tarix.append(zaharlilik)
    return tarix
```

### ✅ Haqiqiy natija *(zaharli ulush 10%)*

```
   qadam   zaharlilik
       0        0.000
      25        0.088
      50        0.000
      75        0.080
     100        0.000
     150        0.000
     200        0.056

  0.50 ga yetgan qadam: 253
  1.00 ga yetgan qadam: 263
```

> ## 💥💥💥 **200 QADAM DAVOMIDA ZAHARLILIK 0.06 ATROFIDA.** ## **253-QADAMDA 0.50. 263-QADAMDA 1.00.**
>
> ## ## ⭐ **O'N QADAMDA — YARIMDAN TO'LIQQA.**

> ## 🔑 **VA MANA ENG XAVFLI TOMONI:** ## tizim **250 qadam davomida sog'lom ko'rinadi**. ## ## 💥 Keyin **birdaniga** qulaydi.
>
> ## ## 🔧 **MEN ASTA-SEKIN O'SISH KUTGAN EDIM —** ## haqiqiy naqsh **kritik nuqta** *(tipping point)*.

### 🔬 Kritik nuqta qayerda?

```
    ulush  yakuniy (5 urug' o'rt.)   1.0 ga yetdi
     0.03                     0.00          0/5
     0.05                     0.40          2/5
     0.07                     0.60          3/5
     0.10                     1.00          5/5
     0.15                     1.00          5/5
     0.20                     1.00          5/5
```

> ## 🏆 **KRITIK NUQTA — 5% VA 10% ORASIDA.** ## 3% da **hech qachon** qulamadi, ## 10% da — ## 💥 **5/5 marta**.

### 🔧 Sekinroq o'rgatish yordam beradimi?

```
  tezlik=0.08  1.0 ga yetgan qadam: 263   yakuniy=1.00
  tezlik=0.04  1.0 ga yetgan qadam: 701   yakuniy=1.00
  tezlik=0.02  1.0 ga yetgan qadam: None  yakuniy=0.00
  tezlik=0.01  1.0 ga yetgan qadam: None  yakuniy=0.00
```

> ## 🔧 **MEN "SEKINLASHTIRISH FAQAT KECHIKTIRADI" DEB YOZMOQCHI EDIM.** ## ## 💥 **O'LCHOV BUNI QISMAN RAD ETDI:**
>
> ## ## ⚠️ **2× sekin — kechiktirdi** *(263 → 701)*. ## ## 🏆 **4× sekin — UMUMAN TO'XTATDI.**

> ## 🔑 **SABAB — YANA KRITIK NUQTA:** ## o'rgatish tezligi pasayganda ## ⭐ **pasayish kuchayishdan ustun keladi**.

---

### 🛡 Uchta himoya — taqqoslash

```
  himoyasiz          yakuniy zaharlilik = 1.00   bloklangan=  0  aralashuv= 0
  faqat filtr        yakuniy zaharlilik = 0.00   bloklangan= 33  aralashuv= 0
  faqat nazorat      yakuniy zaharlilik = 0.00   bloklangan=  0  aralashuv= 1
  filtr + nazorat    yakuniy zaharlilik = 0.00   bloklangan= 33  aralashuv= 0
```

> ## 🏆🏆 **HAR IKKALASI HAM ISHLADI.**
>
> ## ## ⭐ **LEKIN FARQ BOR:** ## filtr **33 ta xabarni** oldindan bloklaydi, ## nazorat esa — ## ⚠️ **1 marta aralashadi**, ya'ni ## 💥 **zarar allaqachon yetgan**.

> ## 💡 **VA BU — ASOSIY AMALIY XULOSA:** ## ⭐ **oldini olish** *(filtr)* ## 🏆 **tuzatishdan** *(nazorat)* **yaxshiroq**, ## chunki tuzatish ## ⚠️ **hodisadan KEYIN** ishlaydi.

---

## 3. 💥 Va Tay sog'liqni saqlashda bo'lsa?

Kurs jiddiy misol beradi:

> *"Tay ma'lum **pochta indekslaridagi** bemorlarni ustun qo'yishi mumkin — ular davolanishni **to'lay oladi** deb o'ylab. Yoki **yaxshi ta'minlangan jamoalarda keng tarqalgan ismlarni** afzal ko'rishi mumkin."*

> ## 🔑 **BU — 2-DARSDAGI PROKSI MUAMMOSINING O'ZI.** ## ## ⭐ Pochta indeksi → **boylik**. ## ⭐ Ism → **madaniy kelib chiqish**.

### 🔬 O'lchaymiz — **naqsh qanchalik tez o'rganiladi?**

```python
def naqsh_orgatish(qadamlar=500):
    """Model tarixiy ma'lumotdan 'kim davolanadi' naqshini o'rganadi."""
    # 💥 tarixiy ma'lumotda A guruhi ko'proq davolangan (boylik tufayli)
    tarix = [{"guruh": "A" if random.random() < 0.5 else "B"}
             for _ in range(qadamlar)]
    for t in tarix:
        t["davolandi"] = 1 if random.random() < (0.70 if t["guruh"] == "A"
                                                 else 0.30) else 0
    # model shunchaki naqshni takrorlaydi
    ulush = {g: sum(t["davolandi"] for t in tarix if t["guruh"] == g) /
                sum(1 for t in tarix if t["guruh"] == g) for g in "AB"}
    return ulush
```

```
  tarixiy ma'lumot:  A=72.5%  B=29.3%   nisbat=0.404
  model o'rgandi:    A=72.5%  B=29.3%   nisbat=0.404  💥 AYNAN TAKRORLADI
```

> ## 💥💥 **MODEL HECH NARSA "O'YLAB TOPMADI".** ## U shunchaki ## ⭐ **tarixni AYNAN takrorladi**.
>
> ## ## 🔑 **VA MANA ETIK SAVOL:** ## agar tarix **adolatsiz** bo'lsa, ## *"tarixga sodiq"* model — ## 💥 **adolatsizlikni davom ettiradi**.

---

## 4. 🏆 Kursning to'rtta maslahati — **kodga aylantiramiz**

```python
class NazoratliOqitish:
    """Kursning 4 ta maslahati amalda."""

    def __init__(self, filtr, nazorat_oraligi=20, jurnal=True):
        self.filtr = filtr                    # ① yaxshi ma'lumot
        self.nazorat_oraligi = nazorat_oraligi  # ② monitoring
        self.jurnal = []                      # ③ hujjatlashtirish
        self.zaharlilik = 0.0
        self.bloklangan = 0
        self.aralashuvlar = 0

    def qadam(self, xabar, zaharlimi, n):
        if self.filtr(xabar):                 # ① FILTR
            self.bloklangan += 1
            self.jurnal.append((n, "bloklandi", xabar[:24]))
            return

        self.zaharlilik += 0.08 * (1 if zaharlimi else -0.3)
        self.zaharlilik = max(0.0, min(1.0, self.zaharlilik))
        self.jurnal.append((n, f"z={self.zaharlilik:.2f}", xabar[:24]))

        if n % self.nazorat_oraligi == 0:     # ② + ④ INSON NAZORATI
            if self.zaharlilik > 0.30:
                self.zaharlilik = 0.0
                self.aralashuvlar += 1
                self.jurnal.append((n, "💥 INSON ARALASHDI", "qayta tiklandi"))
```

> ## 💡 **NATIJALAR — 2-BO'LIMDA** *("Uchta himoya — taqqoslash")*.

> ## ⚠️ **VA FILTR MUKAMMAL EMAS:** ## u faqat **ma'lum naqshlarni** biladi ## *(67-modul: qora ro'yxat muammosi)*. ## ## 🔑 Shuning uchun ## ⭐ **ikkalasi ham kerak** — ## filtr **oldini oladi**, nazorat **qolganini tutadi**.

---

## 5. ⚠️ Va jurnal — **eng kam qadrlanadigan vosita**

```
  qadam  hodisa             xabar
      1  z=0.00             What do you think about
      2  z=0.00             Can you help me with Pyt
      3  z=0.00             Hello, how are you?
      4  z=0.00             Can you help me with Pyt
      5  z=0.00             What do you think about
      6  z=0.00             Can you help me with Pyt
      7  z=0.00             Can you help me with Pyt
      8  bloklandi          I hate those people
```

> ## 🔑 **JURNALSIZ SIZ BILMASDINGIZ:** ## ⭐ nechta xabar bloklandi, ## ⭐ inson necha marta aralashdi, ## ⭐ va **qaysi paytda** buzilish boshlandi.

> ## 💡 **BU — 69-MODULDAGI HODISA JURNALINING ## O'QITISH VERSIYASI.**

---

## 🎯 Nazorat savollari

1. Tay simulyatsiyasi necha qadamda to'liq zaharlandi?
2. O'rgatish tezligini sekinlashtirish yordam berdimi?
3. Model tarixiy naqshni qanchalik aniq takrorladi?
4. Filtr va inson nazorati — qaysi biri samaraliroq?

<details>
<summary>Javoblar</summary>

1. ## **263-qadamda** *(yarmiga — 253-qadamda)*. ⚠️ Ya'ni 250 qadam davomida tizim **sog'lom ko'rindi**, keyin **o'n qadamda** quladi. 🔑 Sabab — **qayta aloqa halqasi**: model zaharlangani sayin zaharli foydalanuvchilarni **ko'proq jalb qiladi**.
2. ## **Qisman.** 🔧 Men *"faqat kechiktiradi"* deb kutgan edim: **2× sekin** — 263 → 701 qadam *(kechiktirdi)*, lekin **4× sekin** — **umuman to'xtatdi**. ⭐ Ya'ni bu yerda ham **kritik nuqta** bor.
3. ## **Aynan:** tarixda `A=72.5%, B=29.3%`, modelda ham `A=72.5%, B=29.3%`. 💥 Model hech narsa *"o'ylab topmadi"* — u **tarixni takrorladi**.
4. ## **Ikkalasi ham 0.00 berdi**, lekin **filtr yaxshiroq**: u **33 ta xabarni oldindan** bloklaydi, nazorat esa **1 marta aralashadi** — ya'ni ⚠️ **zarar allaqachon yetgan**. 🏆 Oldini olish — tuzatishdan yaxshiroq.

</details>

---

⬅️ [2-dars](02-Unlabeled-Data.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Supervised-Fine-Tuning.md)
