# 2-dars. Shaffoflik ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs DeepMind/NHS ishini keltiradi: 1.6 million bemor ma'lumoti. Biz esa savol beramiz: bizning ilovamiz foydalanuvchiga NIMANI aytmayapti?"**

---

## 1. Ta'rif

> *"Shaffoflik — ma'lumot **qanday to'planishi va ishlatilishi**, AI tizimlari **qanday ishlashi** va ular qanday **ta'sir** ko'rsatishi mumkinligi haqida ochiq bo'lish."*

### 🔑 Uchta savol

| Savol | Kim so'raydi |
|---|---|
| Ma'lumotim **qayerga** ketadi? | Foydalanuvchi |
| Qaror **qanday** qabul qilindi? | ## ⭐ **Ta'sirlangan shaxs** |
| **Kim** javobgar? | Tartibga soluvchi |

---

## 2. 💥 DeepMind va NHS

> *"2015-yilda DeepMind Royal Free London NHS Foundation Trust bilan ma'lumot almashish shartnomasi imzoladi... **taxminan 1.6 million bemorning** shaxsiy sog'liq ma'lumoti **aniq rozilliksiz** va **yetarli shaffoflik** siz uzatildi."*

| Nima bo'ldi | Natija |
|---|---|
| 1.6 mln bemor ma'lumoti | ## 💥 **Rozilik yo'q** |
| ICO tekshiruvi | ## 💥 **Qonun buzilgan** deb topildi |
| NHS | ## ⚠️ **Ommaviy uzr so'radi** |

> ## 🔑 **VA E'TIBOR BERING — MAQSAD YAXSHI EDI:** ## buyrak shikastlanishini **aniqlash** ilovasi.
>
> ## ## 💥 **YAXSHI MAQSAD — YOMON JARAYONNI OQLAMAYDI.**

---

## 3. ⚠️ Shaffoflik **qanday buziladi**

Kurs uchta shaklni sanaydi:

| Shakl | Misol |
|---|---|
| ## **Bilmagan holda ishtirok** | Chatbot **kimningdir** shaxsini ishlatadi |
| ## **Tushuntirilmagan qaror** | ## 💥 **Yollash, kredit** — sabab yo'q |
| ## **Tushunarsiz siyosat** | 40 sahifalik maxfiylik matni |

> ## 💡 **UCHINCHISI — ENG KENG TARQALGAN:** ## siyosat **bor**, lekin ## ⭐ **hech kim o'qimaydi**.

---

## 4. 🔬 O'qish qiyinligini **o'lchaymiz**

```python
import re


def oqilishi(matn):
    """Flesch Reading Ease ga o'xshash sodda baho (ingliz tili uchun)."""
    jumlalar = max(1, len(re.findall(r"[.!?]+", matn)))
    sozlar = matn.split()
    n = max(1, len(sozlar))

    def bo_gin(s):
        s = s.lower().strip(".,;:!?()")
        v = len(re.findall(r"[aeiouy]+", s))
        return max(1, v)

    bo_ginlar = sum(bo_gin(s) for s in sozlar)
    ball = 206.835 - 1.015 * (n / jumlalar) - 84.6 * (bo_ginlar / n)
    daraja = ("juda oson" if ball >= 80 else "oson" if ball >= 60 else
              "o'rta" if ball >= 50 else "qiyin" if ball >= 30 else
              "juda qiyin")
    return round(ball, 1), daraja, round(n / jumlalar, 1)
```

```python
MATNLAR = {
    "tipik siyosat": (
        "The Company may, at its sole discretion and without prior notification "
        "to the User, process, aggregate, anonymize, and otherwise utilize any "
        "and all Personal Data provided by or collected from the User in "
        "connection with the provision, improvement, personalization, and "
        "analysis of the Services, including but not limited to the training "
        "and evaluation of machine learning models."),
    "sodda variant": (
        "We store your answers for 30 days. We use them to run the interview "
        "and to fix bugs. We do not use them to train AI models. "
        "You can delete them at any time."),
}

for nom, m in MATNLAR.items():
    b, d, uz = oqilishi(m)
    print(f"  {nom:16} ball={b:6}  {d:12}  o'rt. jumla={uz} so'z  "
          f"({len(m.split())} so'z)")
```

### ✅ Haqiqiy natija

```
  tipik siyosat    ball= -29.1  juda qiyin    o'rt. jumla=57.0 so'z  (57 so'z)
  sodda variant    ball=  86.2  juda oson     o'rt. jumla=8.5 so'z   (34 so'z)
```

> ## 💥💥💥 **BIRINCHISI — MANFIY BALL: −29.1.**
>
> ## Bitta jumla **57 so'z**. ## ⭐ Ikkinchisida — **8.5 so'z**, ball **86.2**.
>
> ## ## 🔑 **FARQ — 115 BALL.**

> ## 🔑 **VA MAZMUN DEYARLI BIR XIL** — ## ikkinchisi hatto **aniqroq** *("30 kun", "model o'qitish uchun EMAS")*.

> ## ⚠️ **METRIKA INGLIZ TILI UCHUN MO'LJALLANGAN** — ## o'zbekchada raqamlar boshqacha bo'ladi. ## ## ⭐ Lekin **taqqoslash** uchun yaroqli: ## bitta jumladagi **so'zlar soni** — ## universal signal.

---

## 5. 🔧 Shaffoflik darajalari

Hamma narsani aytish — **mumkin emas**. Nima kerak?

```python
DARAJALAR = {
    1: "Bu — AI tizimi",
    2: "Qanday ma'lumot yig'iladi",
    3: "Ma'lumot qancha saqlanadi",
    4: "Qaror qanday qabul qilindi (umumiy)",
    5: "Qaror qanday qabul qilindi (aynan bu holat)",
    6: "Model qanday o'qitilgan",
    7: "Model vaznlari / kod",
}

MAJBURIY = {
    "past xavf":   [1, 2, 3],
    "o'rta xavf":  [1, 2, 3, 4],
    "yuqori xavf": [1, 2, 3, 4, 5],           # ⭐ yollash, kredit, tibbiyot
}


def shaffoflik_audit(xavf, mavjud):
    kerak = MAJBURIY[xavf]
    yo_q = [d for d in kerak if d not in mavjud]
    return (len(kerak) - len(yo_q)) / len(kerak) * 100, yo_q
```

```python
BIZNING = [1, 2]          # "bu AI" + "javoblar yig'iladi"
ball, yo_q = shaffoflik_audit("yuqori xavf", BIZNING)
print(f"  bizning ilova (yuqori xavf): {ball:.0f}%")
for d in yo_q:
    print(f"    💥 {d}. {DARAJALAR[d]}")
```

### ✅ Haqiqiy natija

```
  bizning ilova (yuqori xavf): 40%
    💥 3. Ma'lumot qancha saqlanadi
    💥 4. Qaror qanday qabul qilindi (umumiy)
    💥 5. Qaror qanday qabul qilindi (aynan bu holat)
```

> ## 💥 **40%.** ## Va uchta yetishmayotgan banddan ## ⭐ **ikkitasi — QAROR TUSHUNTIRISHI**.

> ## 🔑 **NEGA "YUQORI XAVF"?** ## Intervyu vositasi **yollash** qaroriga ta'sir qiladi. ## ## ⚠️ EU AI Act da yollash — ## ⭐ **`high-risk`** toifasida *(76-modul)*.

---

## 6. 🏆 5-daraja: *"aynan bu holat"* — **qanday qilamiz?**

67-modulda ko'rgan edik: ball **LLM dan** keladi va **tushuntirilmaydi**.

### ✅ Kod bilan tushuntirish

```python
def qaror_tushuntir(javob, ball, belgilar):
    """Ballning SABABINI kodda hisoblaydi (67-modul, 6-dars)."""
    q = [f"Ball: {ball}/10", "", "Nima hisobga olindi:"]
    NOM = {"raqam": "aniq raqam yoki metrika",
           "tradeoff": "murosa yoki narx eslatilgani",
           "validatsiya": "natija qanday tekshirilgani"}
    for k, bor in belgilar.items():
        q.append(f"  {'✅' if bor else '💥'} {NOM[k]}")
    yetishmaydi = [NOM[k] for k, v in belgilar.items() if not v]
    if yetishmaydi:
        q += ["", "Ballni oshirish uchun: " + ", ".join(yetishmaydi)]
    return "\n".join(q)
```

```python
JAVOB = "I cut inference latency from 800ms to 120ms by quantising the model."
print(qaror_tushuntir(JAVOB, 6, {"raqam": True, "tradeoff": False,
                                 "validatsiya": False}))
```

### ✅ Haqiqiy natija

```
Ball: 6/10

Nima hisobga olindi:
  ✅ aniq raqam yoki metrika
  💥 murosa yoki narx eslatilgani
  💥 natija qanday tekshirilgani

Ballni oshirish uchun: murosa yoki narx eslatilgani, natija qanday tekshirilgani
```

> ## 🏆🏆 **BU — 5-DARAJALI SHAFFOFLIK.** ## Foydalanuvchi **nima uchun** 6 olganini ## va **nima qilish kerakligini** biladi.

> ## 🔑 **VA E'TIBOR BERING — BU LLM DAN EMAS,** ## ⭐ **koddan** keladi *(67-modul, 6-dars)*. ## ## 💡 Shuning uchun u ## **har doim bir xil** va **tekshiriladigan**.

---

## 🎯 Nazorat savollari

1. DeepMind/NHS ishida asosiy xato nima edi?
2. Tipik maxfiylik siyosatining o'qilish balli qancha chiqdi?
3. Bizning ilovamiz shaffoflik auditidan qanday o'tdi?
4. 5-darajali shaffoflikni qanday amalga oshirdik?

<details>
<summary>Javoblar</summary>

1. ## **Rozilik va shaffoflik yo'qligi** — 1.6 mln bemor ma'lumoti **aniq rozilliksiz** uzatildi. 🔑 Maqsad *(buyrak shikastlanishini aniqlash)* **yaxshi** edi — lekin **yaxshi maqsad yomon jarayonni oqlamaydi**.
2. ## **−29.1** *("juda qiyin")* — bitta jumla **57 so'z**. ⭐ Sodda variant: **86.2** *("juda oson")*, jumla **8.5 so'z** — va mazmun **aniqroq**. 🔑 Farq — **115 ball**.
3. ## **40%** *(yuqori xavf uchun 5 talabdan 2 tasi)*. 💥 Yetishmaydi: saqlash muddati, qaror tushuntirishi *(umumiy va aynan bu holat)*.
4. ## **Kodda hisoblab.** `belgilar()` funksiyasi qaysi mezon bajarilganini aytadi *(raqam / murosa / validatsiya)*, tushuntirish esa **ulardan quriladi**. ⭐ LLM dan emas — shuning uchun **har doim bir xil** va **tekshiriladigan**.

</details>

---

⬅️ [1-dars](01-Privacy.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Accountability.md)
