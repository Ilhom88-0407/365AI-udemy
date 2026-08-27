# 3-dars. Javobgarlik ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs Uber ishini keltiradi: avtomobil piyodani o'ldirdi. Uchta xato bir vaqtda sodir bo'ldi — va uchalasi ham HAR XIL odamning ishi edi."**

---

## 1. Ta'rif

> *"Javobgarlik — shaxslar, tashkilotlar va hatto hukumatlarning AI tizimlari **etik ishlab chiqilishi, joylashtirilishi va ishlatilishini** ta'minlash mas'uliyati."*

### 🔑 Kursning kalit taqqoslashi

| | Oddiy avtomobil | ## AI tizimi |
|---|---|---|
| Tormoz ishlamadi | ## ✅ **Ishlab chiqaruvchi** | ## 💥 **Kim?** |
| Sabab | Nuqson | ## ⚠️ **Ma'lumot? Model? Sozlama?** |
| Isbot | Ekspertiza | ## 💥 **"Qora quti"** |

---

## 2. 💥 Uber, 2018 — **uchta xato bir vaqtda**

> *"Arizonada sinov haydovi paytida Uber ning avtonom avtomobili piyodani urib o'ldirdi."*

| # | Xato | Kim javobgar |
|---|---|---|
| ① | ## **AI piyodani to'g'ri tasniflay olmadi** | ## Ishlab chiquvchi |
| ② | ## **Xavfsizlik haydovchisi e'tiborsiz edi** | ## Operator |
| ③ | ## **Uber sensorlar sonini kamaytirgan** *(tejash uchun)* | ## 💥 **Menejment** |

> ## 💥💥💥 **UCHINCHISI — ENG MUHIMI.**
>
> ## Bu — **texnik xato emas**, ## ⭐ **biznes qarori**.

> ## 🔑 **VA MANA JAVOBGARLIKNING QIYIN TOMONI:** ## har biri **alohida** *"men emas"* deb aytishi mumkin. ## ## 💥 Birgalikda esa — **odam o'ldi**.

---

## 3. 🔧 Javobgarlik matritsasi — **RACI**

```python
ROLLAR = ["ishlab chiquvchi", "operator", "menejment", "foydalanuvchi"]


class Javobgarlik:
    """Har hodisa uchun ANIQ javobgarni belgilaydi.

    R = Responsible (bajaradi)
    A = Accountable (JAVOB BERADI — faqat BITTA)
    C = Consulted   (maslahat beradi)
    I = Informed    (xabardor qilinadi)
    """

    def __init__(self):
        self.jadval = {}

    def qosh(self, hodisa, **rollar):
        a = [r for r, v in rollar.items() if v == "A"]
        if len(a) != 1:
            raise ValueError(
                f"💥 '{hodisa}': aynan BITTA 'A' bo'lishi kerak, {len(a)} ta topildi")
        self.jadval[hodisa] = rollar
        return self

    def kim_javob_beradi(self, hodisa):
        r = self.jadval.get(hodisa)
        if not r:
            return "💥 hodisa ro'yxatda yo'q — JAVOBGAR BELGILANMAGAN"
        return next(k for k, v in r.items() if v == "A")
```

```python
j = (Javobgarlik()
     .qosh("model gallyutsinatsiya qildi",
           **{"ishlab chiquvchi": "A", "operator": "C", "menejment": "I"})
     .qosh("prompt injection o'tdi",
           **{"ishlab chiquvchi": "R", "operator": "A", "menejment": "I"})
     .qosh("ball haqiqiy sifatni aks ettirmaydi",
           **{"ishlab chiquvchi": "R", "operator": "C", "menejment": "A"})
     .qosh("kalit GitHub ga yuklandi",
           **{"ishlab chiquvchi": "A", "operator": "I"}))

for h in ["model gallyutsinatsiya qildi",
          "prompt injection o'tdi",
          "ball haqiqiy sifatni aks ettirmaydi",
          "kalit GitHub ga yuklandi",
          "foydalanuvchi ma'lumoti sizib chiqdi"]:
    print(f"  {h:38} -> {j.kim_javob_beradi(h)}")
```

### ✅ Haqiqiy natija

```
  model gallyutsinatsiya qildi           -> ishlab chiquvchi
  prompt injection o'tdi                 -> operator
  ball haqiqiy sifatni aks ettirmaydi    -> menejment
  kalit GitHub ga yuklandi               -> ishlab chiquvchi
  foydalanuvchi ma'lumoti sizib chiqdi   -> 💥 hodisa ro'yxatda yo'q — JAVOBGAR BELGILANMAGAN
```

### 💥 Va ikkita `A` qo'yishga urinsak?

```python
try:
    j.qosh("noaniq hodisa",
           **{"ishlab chiquvchi": "A", "operator": "A"})
except ValueError as e:
    print(e)
```

```
💥 'noaniq hodisa': aynan BITTA 'A' bo'lishi kerak, 2 ta topildi
```

> ## 🏆🏆 **KOD ETIK QOIDANI MAJBURLAYDI.**
>
> ## ## 🔑 **BITTA "A" — BU UBER DARSINING O'ZI:** ## agar hamma javobgar bo'lsa — ## 💥 **hech kim javobgar emas**.

> ## ⭐ **VA OXIRGI QATOR HAM MUHIM:** ## ro'yxatda **yo'q** hodisa — ## 💥 **javobgarsiz** deb belgilanadi, ## jimgina o'tkazib yuborilmaydi.

---

## 4. 🔬 Javobgarlik hayot siklida

| Bosqich | Kurs aytadi | Amaliy vosita |
|---|---|---|
| To'plash | *"Ma'lumot etik manbadan, aniq, qonuniy"* | ## ⭐ **Manba jurnali** |
| O'qitish | *"Bias uchun sinash"* | ## ⭐ **4-dars metrikalari** |
| Joylashtirish | *"Faol nazorat"* | ## ⭐ **Monitoring** |

> ## 🔑 **VA KURS TO'RTTA VOSITANI SANAYDI:** ## ① aniq mas'uliyat, ② **mustahkam hujjatlashtirish**, ## ③ **muntazam audit**, ④ **muammoni hal qilish mexanizmi**.

### 💥 Bizning ilovamizda nechtasi bor?

| Vosita | Holat |
|---|---|
| Aniq mas'uliyat | ## 💥 **Yo'q** *(3-bo'limda qurdik)* |
| Hujjatlashtirish | ## ⚠️ **Model kartasi 50%** |
| Muntazam audit | ## 💥 **Yo'q** |
| ## **Muammoni hal qilish** | ## 💥 **Shikoyat kanali YO'Q** |

> ## 💥 **TO'RTTADAN BIRTASI HAM TO'LIQ EMAS.**

---

## 5. 🔧 Hodisa jurnali — **javobgarlikning asosi**

Javobgarlik uchun **nima bo'lganini bilish** kerak.

```python
import json
from datetime import datetime


class HodisaJurnali:
    """Har muhim qarorni YOZADI — keyin javob berish uchun."""

    def __init__(self):
        self.yozuvlar = []

    def yoz(self, vaqt, tur, tafsilot, qaror, manba):
        self.yozuvlar.append({
            "vaqt": vaqt, "tur": tur, "tafsilot": tafsilot,
            "qaror": qaror, "manba": manba,      # ⭐ QAROR QAYERDAN keldi
        })

    def tiklash(self, filtr=None):
        """Nima bo'lganini QAYTA TIKLASH."""
        return [y for y in self.yozuvlar
                if filtr is None or y["tur"] == filtr]

    def javobgarlik_hisoboti(self):
        manbalar = {}
        for y in self.yozuvlar:
            manbalar[y["manba"]] = manbalar.get(y["manba"], 0) + 1
        return manbalar
```

```python
jur = HodisaJurnali()
jur.yoz("10:00:01", "savol", "6 savol yaratildi", "LLM (4) + MB (2)", "LLM+MB")
jur.yoz("10:00:05", "filtr", "kirish tekshirildi", "o'tdi", "kod")
jur.yoz("10:02:11", "ball", "javob 1 baholandi", "7/10", "LLM")
jur.yoz("10:02:11", "filtr", "injection topildi", "BLOKLANDI", "kod")
jur.yoz("10:08:40", "baho", "umumiy ball", "8/10", "LLM")
jur.yoz("10:08:41", "tekshiruv", "ball o'rtachadan uzoq", "RAD ETILDI -> 5", "kod")

for y in jur.tiklash():
    print(f"  {y['vaqt']}  [{y['manba']:6}] {y['tur']:10} {y['qaror']}")

print()
print("  manbalar bo'yicha:", jur.javobgarlik_hisoboti())
```

### ✅ Haqiqiy natija

```
  10:00:01  [LLM+MB] savol      LLM (4) + MB (2)
  10:00:05  [kod   ] filtr      o'tdi
  10:02:11  [LLM   ] ball       7/10
  10:02:11  [kod   ] filtr      BLOKLANDI
  10:08:40  [LLM   ] baho       8/10
  10:08:41  [kod   ] tekshiruv  RAD ETILDI -> 5

  manbalar bo'yicha: {'LLM+MB': 1, 'kod': 3, 'LLM': 2}
```

> ## 🏆🏆 **OXIRGI IKKI QATOR — ENG QIMMATLISI:** ## LLM **8** dedi, ## ⭐ **kod uni RAD ETDI va 5 ga tushirdi**.
>
> ## ## 🔑 **BU YOZUVSIZ SIZ HECH QACHON BILMASDINGIZ.**

> ## 💡 **VA `manba` USTUNI — JAVOBGARLIK KALITI:** ## `kod` — **siz javobgarsiz**, ## `LLM` — **model xatosi**, ## `MB` — **ma'lumot xatosi**.

---

## 6. ⚠️ Javobgarlikni **rad qilishning** uch usuli

| Bahona | Nega ishlamaydi |
|---|---|
| ## *"Model qora quti"* | ## 💥 **Siz uni tanladingiz** |
| ## *"Foydalanuvchi noto'g'ri ishlatdi"* | ## 💥 **Siz cheklov qo'ymadingiz** |
| ## *"Ma'lumot shunday edi"* | ## 💥 **Siz uni tekshirmadingiz** |

> ## 🔑 **UCHALASINING UMUMIY TOMONI:** ## ular **texnik sabab** ni ## **etik javobgarlik** o'rniga qo'yadi.

> ## 🏆 **VA UBER ISHIDA UCHALASI HAM AYTILGANDI.**

---

## 🎯 Nazorat savollari

1. Uber ishida nechta xato bor edi va kim javobgar?
2. Nega har hodisada aynan **bitta** `A` bo'lishi kerak?
3. Hodisa jurnalida `manba` ustuni nima uchun kerak?
4. Javobgarlikni rad qilishning uch usuli qanday?

<details>
<summary>Javoblar</summary>

1. ## **Uchta:** ① AI piyodani tasniflay olmadi *(ishlab chiquvchi)*, ② xavfsizlik haydovchisi e'tiborsiz *(operator)*, ③ **sensorlar soni tejash uchun kamaytirilgan** *(menejment)*. 💥 Uchinchisi — **texnik emas, biznes qarori**.
2. ## Agar **hamma** javobgar bo'lsa — **hech kim** javobgar emas. ⭐ Kod buni majburlaydi: ikkita `A` qo'yishga urinish → `ValueError`.
3. ## **Qaror qayerdan kelganini** ko'rsatadi: `kod` *(siz javobgarsiz)*, `LLM` *(model xatosi)*, `MB` *(ma'lumot xatosi)*. 🏆 O'lchandi: LLM **8** dedi, kod uni **rad etdi va 5 ga tushirdi** — yozuvsiz buni **bilmasdingiz**.
4. ## *"Model qora quti"*, *"foydalanuvchi noto'g'ri ishlatdi"*, *"ma'lumot shunday edi"*. 🔑 Uchalasi **texnik sababni etik javobgarlik o'rniga** qo'yadi — va Uber ishida **uchalasi ham** aytilgan edi.

</details>

---

⬅️ [2-dars](02-Transparency.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Fairness.md)
