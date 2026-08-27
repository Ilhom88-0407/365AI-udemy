# 3-dars. HR intervyu promptining tuzilishi ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs 'butun tarixni yubormaslik intervyuga 5000 tokengacha tejadi' deydi. Biz o'lchadik: mening namunam bilan 1 260 token chiqdi. Kursning raqami ham to'g'ri — lekin faqat javoblar 3 baravar uzun bo'lsa."**

---

## 1. Nima uchun prototip **yetarli emas**?

Kurs prototipdagi muammolarni sanaydi:

| Muammo | Nima bo'lardi |
|---|---|
| ## **Barcha savolni birdaniga** | LLM 10 ta savolni **bir javobda** berardi |
| Javobni davom ettirish | LLM foydalanuvchi o'rniga **o'zi yozardi** |
| ## **Buzuq JSON** | ## 💥 Tarix o'sgani sayin **ko'proq xato** |
| Behuda o'zaro ta'sir | *"Savolni qaytaring"* → **savol yo'qoladi** |
| Narx | Har xabarda **butun tarix** |

> ## 🔑 **VA UMUMIY SABAB BITTA:** ## LLM ni faqat **prompt** cheklab turardi.
>
> ## ## ⭐ **YECHIM — MODELNING ERKINLIGINI KAMAYTIRISH.**

---

## 2. 🏆 Uchta LLM

### ① Savol generatori

| Kirish | Chiqish |
|---|---|
| Foydalanuvchi sozlamalari | ## ⭐ **6 ta savol, JSON massiv** |
| MB dan 2 ta savol | Har biri **kategoriyalangan** |

> ## ⭐ **U MB SAVOLLARINING XATOLARINI HAM TUZATADI** — ## kurs shuni ta'kidlaydi.

### ② Humanizer — **eng qiziq qism**

| Kirish | Chiqish |
|---|---|
| **Joriy** savol | Jonlantirilgan savol |
| ## **Oldingi savol** | ## ⭐ **Oldingi javobning bahosi** |
| ## **Oldingi javob** | JSON |

> ## 💡 **KURS AYTADI:** ## *"Bu — prototipdagiga qaraganda ## **xotirani boshqarishning yangi va yaxshilangan usuli**. ## Eslang, biz LLM ga har o'zaro ta'sirda ## **butun suhbat tarixini** berardik."*

### ③ Baholovchi

> ## ⚠️ **ENG OG'IR VAZIFA:** ## umumiy ball + xulosa + **har savol bo'yicha baho**, ## va hammasi **JSON** da. ## ## 🔑 Kurs aytadi: shuning uchun oxirgi savol bilan ## fikr-mulohaza orasida **kutish** bor.

---

## 3. ⭐⭐ Humanizer qoidalari — **holat mashinasi**

Kurs to'rtta qoidani beradi:

| Qoida | Ma'nosi |
|---|---|
| ball **> 5** | ## ⭐ **davomiy savol** *(follow-up)* |
| ball **≤ 5** | **izoh** *(remark)* + tayyor savol |
| ko'pi bilan **2 ta** davomiy | Tayyor savollar **saqlanadi** |
| ## **ketma-ket bo'lmasin** | ## ⚠️ Ikkitasi **yonma-yon** kelmaydi |

### 🔬 Quramiz va sinaymiz

```python
class Humanizer:
    """Kursning qoidalari:
       ball > 5  -> davomiy savol (follow-up)
       ball <= 5 -> izoh (remark) + oldindan tayyor savol
       ko'pi bilan 2 ta davomiy savol
       davomiy savollar KETMA-KET bo'lmasligi kerak
    """
    MAX_DAVOMIY = 2

    def __init__(self):
        self.davomiy_soni = 0
        self.oxirgi_davomiy = False
        self.jurnal = []

    def qaror(self, ball):
        sabab, mumkin = [], True
        if ball is None or ball <= 5:
            mumkin = False; sabab.append(f"ball={ball} <= 5")
        if self.davomiy_soni >= self.MAX_DAVOMIY:
            mumkin = False; sabab.append("2 ta davomiy ishlatilgan")
        if self.oxirgi_davomiy:
            mumkin = False; sabab.append("ketma-ket bo'lmaydi")

        turi = "davomiy" if mumkin else "izoh"
        if mumkin:
            self.davomiy_soni += 1
        self.oxirgi_davomiy = mumkin
        self.jurnal.append((ball, turi, "; ".join(sabab)))
        return turi
```

### ✅ Haqiqiy natija — ballar `[7, 8, 9, 3, 8, 9]`

```
ball  qaror     sabab
--------------------------------------------------------
   7  davomiy
   8  izoh      ketma-ket bo'lmaydi
   9  davomiy
   3  izoh      ball=3 <= 5; 2 ta davomiy ishlatilgan; ketma-ket bo'lmaydi
   8  izoh      2 ta davomiy ishlatilgan
   9  izoh      2 ta davomiy ishlatilgan

davomiy savollar: 2/2
oldindan tayyor savollar saqlandi: 4/6
```

> ## 🏆 **UCHTA QOIDA — UCHTASI HAM ISHLADI.** ## E'tibor bering: **8 ball ham izoh oldi**, ## chunki **oldingisi davomiy edi**.

### 💥 Chetki holatlar

```
=== HAMMA BALL 10 BO'LSA? ===
  10  davomiy
  10  izoh      ketma-ket bo'lmaydi
  10  davomiy
  10  izoh      2 ta davomiy ishlatilgan; ketma-ket bo'lmaydi
  10  izoh      2 ta davomiy ishlatilgan
  10  izoh      2 ta davomiy ishlatilgan
  davomiy: 2  ✅ chegara ushlandi

=== HAMMA BALL 2 BO'LSA? ===
  davomiy: 0  turlar: ['izoh','izoh','izoh','izoh','izoh','izoh']
```

> ## 🏆🏆 **HAMMA BALL 10 BO'LSA HAM — ATIGI 2 TA DAVOMIY.** ## Kurs aynan shuni istagan edi: ## ## ⭐ *"Bu ko'pchilik oldindan belgilangan savollar berilishini ta'minlaydi."*

### 💡 Izoh vs davomiy — farqi nima?

| | Misol *(kursdan)* |
|---|---|
| ## **Izoh** | *"**Mashinali o'qitish modellarini ishlab chiqarishga joylashtirish tajribangiz borligi ta'sirli.** Modellaringizning ishonchliligini ta'minlash uchun qanday qadamlar qo'ygansiz?"* |
| ## **Davomiy** | *"**Oldingi tajribangizga asoslanib**, bashoratli modelning aniqligini yaxshilagan vaqtingizni tasvirlab bera olasizmi?"* |

> ## 🔑 **IZOH** — oldingi javobga **reaksiya** + ## ⭐ **tayyor savol**. ## ## **DAVOMIY** — oldingi javobdan ## ⭐ **o'sib chiqqan yangi savol**.

---

## 4. 💰💰 *"5 000 tokengacha tejadik"* — **o'lchaymiz**

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")
tok = lambda s: len(enc.encode(s))


def toliq_tarix(n):
    """Prototip: har so'rovda BUTUN tarix."""
    return sum(t_sys + i * (t_q + t_a) for i in range(1, n + 1))


def oyna_2(n):
    """Humanizer: faqat oldingi savol + javob."""
    return sum(t_sys + t_q + t_a for _ in range(n))
```

### ✅ Haqiqiy natija

```
tizim prompt: 34 tok   savol: 31 tok   javob: 53 tok

n=  6  to'liq tarix:   1,968 tok   oyna-2:    708 tok   tejaldi:  1,260 (64%)
n= 10  to'liq tarix:   4,960 tok   oyna-2:  1,180 tok   tejaldi:  3,780 (76%)
n= 20  to'liq tarix:  18,320 tok   oyna-2:  2,360 tok   tejaldi: 15,960 (87%)
```

> ## 🔧 **KURS "5 000 GACHA" DEYDI — MENDA 1 260 CHIQDI.** ## Ya'ni raqam **to'rt baravar** kichik.

### ⭐ Lekin kurs **noto'g'ri emas** — sabab **javob uzunligida**

```
6 savolda 5 000 token tejash uchun javob qancha uzun bo'lishi kerak?

   javob (tok)    ~so'z    tejash
            53       39     1,260      ← mening namunam
           150      112     2,715
           250      187     4,215
           300      225     4,965      ← ⭐ MANA
           350      262     5,715
```

> ## 🏆 **KURSNING RAQAMI ~225 SO'ZLIK JAVOBDA CHIQADI.**
>
> ## ## ⭐ **VA BU — MANTIQIY:** ## kurs *"30–40 daqiqalik intervyu"* va ## *"**uzunroq javoblar** kutamiz"* deb yozgan.

> ## 💡 **HALOL XULOSA:** ## kursning da'vosi — ## ⚠️ **shartli, lekin asosli**. ## ## 🔑 **DARS:** *"X token tejaydi"* degan har qanday raqam ## **kirish o'lchamiga** bog'liq. ## ⭐ O'z ma'lumotingizda **qayta o'lchang**.

### 💰 Va nima uchun bu muhim

| Foydalanuvchilar | To'liq tarix | Oyna-2 | Farq *(gpt-4o)* |
|---|---|---|---|
| 1 000 | 1.97 mln tok | 0.71 mln | ## **$3.15** |
| 100 000 | 197 mln tok | 71 mln | ## 💥 **$315** |
| ## 1 mln | ## 1.97 mlrd | 708 mln | ## 💥 **$3 150** |

---

## 5. ⭐ JSON — **hamma joyda**

Kurs aytadi:

> *"Birinchi qilishimiz kerak bo'lgan narsa — promptlarni ma'lum formatga, xususan **JSON** ga moslashtirish edi. Bu format dasturning javoblarni **aniq olishi** uchun zarur."*

> ## 🏆 **BU — 63-VA 66-MODULLARDAGI DARSNING TAKRORI.** ## ## 💥 66-modulda ko'rdik: ## kursning `Overal Score:` formati ## regex bilan **0/5** ishladi.

### ⭐ Humanizer ning JSON chiqishi

```json
{
  "score": 8,
  "type": "follow_up",
  "question_text": "Based on your previous experience with machine learning models, can you describe a time when you improved the accuracy of a predictive model?",
  "current_question": 3
}
```

| Maydon | Nima uchun |
|---|---|
| `score` | ## ⭐ **Keyingi qarorni belgilaydi** |
| `type` | `follow_up` yoki `remark` |
| `question_text` | Foydalanuvchiga ko'rsatiladi |
| `current_question` | ## ⭐ **Tartibni kuzatadi** |

> ## 💡 **`score` — DASTURGA KERAK, FOYDALANUVCHIGA EMAS.** ## U **holat mashinasini** boshqaradi *(3-bo'lim)*.

---

## 🎯 Nazorat savollari

1. Humanizer qanday uchta ma'lumot oladi?
2. Hamma ball 10 bo'lsa, nechta davomiy savol beriladi?
3. *"5 000 token"* da'vosi to'g'rimi?
4. Nega uchta LLM ikkitadan arzonroq?

<details>
<summary>Javoblar</summary>

1. ## **Joriy savol, oldingi savol, oldingi javob.** ⭐ Butun tarix **emas** — bu prototipdan asosiy farq.
2. ## **Ikkita** — chegara ushlab turadi. O'lchandi: `[10,10,10,10,10,10]` → `davomiy, izoh, davomiy, izoh, izoh, izoh`. 🔑 Uchinchisi *"ketma-ket bo'lmaydi"*, keyingilari *"2 ta ishlatilgan"* sababi bilan rad etildi.
3. ## **Shartli.** Mening namunam bilan *(39 so'zlik javob)* — **1 260 token**. Kursning raqamiga yetish uchun javob **~225 so'z** bo'lishi kerak. ⭐ Kurs *"uzunroq javoblar kutamiz"* deb yozgani uchun — **asosli**. 🔑 Dars: har qanday "X token tejaydi" **kirish o'lchamiga** bog'liq.
4. Ikkinchi model *(Humanizer)* **butun tarixni emas**, faqat **oldingi juftlikni** oladi. 💰 O'lchandi: 6 savolda **1 968 → 708 token** (64% tejash), 20 savolda **87%**.

</details>

---

⬅️ [2-dars](02-Application-Structure.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Prompt-Structure-Technical.md)
