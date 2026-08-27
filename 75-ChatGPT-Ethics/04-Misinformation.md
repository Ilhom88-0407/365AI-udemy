# 4-dars. Dezinformatsiya va AI kontenti ⭐⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: 'ishonchli manbalar bilan tekshiring — yoki chatdan MANBA SO'RANG'. Biz manba so'radik. Sakkizta manba oldik. Ularning hech birini tekshira olmadim — va MANA SHU asosiy xulosa."**

---

## 1. Kursning ikkita turi

| Turi | Sabab | Qayerda o'lchandi |
|---|---|---|
| ## **Tasodifiy** *(gallyutsinatsiya)* | Model **bilmaydi** | ## 💥 **72-modul: 7/8** |
| ## **Ataylab** | Yomon niyatli foydalanuvchi | ⭐ Bu dars |

---

## 2. 🔬 Kursning maslahatini **sinaymiz**

> *"ChatGPT tomonidan yaratilgan ma'lumotni **ishonchli manbalar
> bilan** solishtiring, **yoki chatdan shunday manbalarni so'rang**."*

Ikkinchi qismini sinab ko'ramiz — **manba so'raymiz**.

```python
SOROVLAR = [
 "Give me three academic sources about the fairness of hiring "
 "algorithms. List author, year and title only.",
 "Cite two papers on k-anonymity. Author, year, title only.",
 "Name three studies on annotator disagreement in text labelling.",
]
```

### ✅ Haqiqiy natija

```
Q: Give me three academic sources about the fairness of hiring algorithms.
A: 1. "The Fairness of Hiring Algorithms: A Review" by Jie Liu et al., 2023.
   2. "Hiring Algorithms: An Overview" by David M. Blei, 2017.
   3. "Fairness in Hiring: A Survey" by Sujay Shah, 2019.

Q: Cite two papers on k-anonymity. Author, year, title only.
A: 1. "A Survey of Privacy-Preserving Data Analysis Techniques" by
      S. Muthukrishnan and A. Raghavan, 2005.
   2. "K-Privacy: An Approach to K-Anonymity for Large-Scale Data Sets"
      by J. Wang, Y. Zhang, and X. Li, 2014.

Q: Name three studies on annotator disagreement in text labelling.
A: 1. "Annotator Agreement and Disagreement in Text Labeling"
      by J. M. Hirsch et al., 2003.
   2. "The Impact of Annotation Agreements on the Accuracy of Text
      Labeling" by A. R. Kowalski et al., 2006.
   3. "Annotator Disagreement in Text Labeling: An Empirical Study"
      by S. P. D. Lee et al., 2008.
```

> ## 🏆 **SAKKIZTA MANBA. ## MUALLIF, YIL, SARLAVHA — HAMMASI JOYIDA.** ## ## ⭐ **Formati mukammal.**

---

## 3. 💥 Ikkita tekshiriladigan narsa

### ① `k`-anonimlik — **kanonik manba yo'q**

`k`-anonimlik tushunchasi **Latanya Sweeney** tomonidan
*(2002)* kiritilgan — bu 70-modulda ishlatgan tushunchamiz.

> ## 💥💥 **MODEL UNI UMUMAN TILGA OLMADI.**
>
> ## ## ⭐ U o'rniga ## 🔑 **ikkita boshqa nom** berdi.

### ② `David M. Blei` — **haqiqiy olim**

Blei — **mavzuli modellashtirish** *(LDA)* sohasining mashhur
tadqiqotchisi. Yollash algoritmlari — **uning sohasi emas**.

> ## 🔑 **BU — GALLYUTSINATSIYANING ## ENG ISHONCHLI KO'RINISHI:** ## ## ⭐ **haqiqiy ism + mavjud bo'lmagan ish.**

> ## 💥 **VA U TEKSHIRUVDAN O'TADI,** ## chunki ismni ## ⚠️ **qidirsangiz — topasiz**.

---

## 4. 🏆 Va endi — **eng muhim qism**

> ## ⚠️⚠️ **MEN BU SAKKIZTA MANBANI ## TEKSHIRA OLMADIM.**
>
> ## ## 🔑 Bu kitob **internetsiz** yozildi. ## ⭐ Men ularning ## 💥 **mavjud yoki mavjud emasligini** ## ayta olmayman.

> ## 🏆🏆 **VA MANA SHU — DARSNING ASOSIY XULOSASI.**

| Nima | Kim qiladi |
|---|---|
| Manba **so'rash** | ## ⭐ 5 soniya |
| Manba **yaratish** | ## ⭐ Model uchun **bepul** |
| ## **Manbani TEKSHIRISH** | ## 💥 **Har biri uchun bir necha daqiqa** |

> ## 💥💥💥 **KURSNING MASLAHATI ## MUAMMONI HAL QILMAYDI — ## U UNI KO'CHIRADI.**
>
> ## ## 🔑 *"Manba so'rang"* → endi sizda ## ⭐ **8 ta tekshirilmagan da'vo** bor, ## bitta o'rniga.

> ## 💡 **VA TEKSHIRMASANGIZ — AHVOL ## YOMONLASHDI:** ## chunki manbali matn ## 💥 **ishonchliroq ko'rinadi**.

---

## 5. 🔧 Ishlaydigan qoida

```python
def manba_qoidasi(javob):
    """💡 Manba - TEKSHIRILGUNCHA da'vo, dalil emas."""
    manbalar = ajrat_manbalar(javob)
    return {
        "manba_soni": len(manbalar),
        "tekshirilgan": 0,                      # ⭐ boshlang'ich holat
        "ishonch": "YO'Q — hech biri tekshirilmagan",
        "keyingi_qadam": "Har birini qidiruvda toping. "
                         "Topilmasa — DA'VONI OLIB TASHLANG.",
    }
```

### 🏆 Uchta amaliy qadam

| # | Qadam | Nega |
|---|---|---|
| ① | ## **Sarlavhani AYNAN qidiring** | ## 💥 Topilmasa — **yo'q** |
| ② | ## **Muallif + mavzuni tekshiring** | ## 🔑 **Blei muammosi** |
| ③ | Yilni tekshiring | ⚠️ Ko'pincha noto'g'ri |

> ## 💡 **IKKINCHISI — ENG KAM QILINADIGANI ## VA ENG MUHIMI.** ## ## ⭐ Ism haqiqiy bo'lishi ## 💥 **ishning haqiqiy ekanini anglatmaydi**.

---

## 6. ⚠️ Kursning boshqa maslahatlari

| Maslahat | Baho |
|---|---|
| Faktlarni tekshiring | ## ✅ **To'g'ri, lekin QIMMAT** |
| ## **Kontekstni tushuning** | ## 🏆 **Eng arzon maslahat** |
| Raqamli savodxonlik | ⭐ Uzoq muddatli |
| ## **Chop etishdan oldin ko'rib chiqish** | ## ✅ 72-modul |
| GPTZero kabi detektorlar | ## 💥 **74-modul: ishlamaydi** |

### 🏆 Ikkinchisi — **nega eng arzon?**

> *"Agar siz ChatGPT dan **fikr, bashorat yoki tor sohadagi
> ma'lumot** so'rasangiz, chiqish noto'g'ri bo'lish ehtimoli
> **yuqoriroq**."*

```python
YUQORI_XAVF = [
    "aniq son yoki statistika",         # 💥 "over 90%"
    "manba, iqtibos, havola",           # 💥 bu dars
    "sana va yil",
    "tor soha tafsilotlari",
    "yaqinda bo'lgan voqealar",
    "huquqiy yoki tibbiy maslahat",
]
```

> ## 🔑 **BU RO'YXAT — TEKSHIRUVNI ## ⭐ ARZONLASHTIRADI.** ## ## 💥 Hammasini emas, ## 🏆 **shu oltitasini** tekshiring.

> ## 💡 **VA BIRINCHI IKKITASI —** ## bu kitobda ## ⭐ **ikkalasi ham yiqilgan**: ## `"over 90%"` *(72-modul)* va ## 🔑 **sakkizta manba** *(bu dars)*.

---

## 🎯 Nazorat savollari

1. Model nechta manba berdi? Formati qanday edi?
2. `k`-anonimlik so'ralganda nima g'alati edi?
3. `David M. Blei` misoli nima ko'rsatadi?
4. Nega *"manba so'rang"* maslahati muammoni hal qilmaydi?

<details>
<summary>Javoblar</summary>

1. ## **Sakkizta** — muallif, yil, sarlavha bilan. ⭐ **Formati mukammal**, va aynan shu 💥 **ishonch uyg'otadi**.
2. ## Kanonik manba — **Latanya Sweeney (2002)** — 💥 **umuman tilga olinmadi**. ⭐ Model o'rniga **boshqa ikkita** nom berdi.
3. ## **Haqiqiy ism + mavjud bo'lmagan ish.** 🔑 Blei — mavzuli modellashtirish sohasining mashhur olimi, yollash algoritmlari **uning sohasi emas**. 💥 Bu — gallyutsinatsiyaning **eng ishonchli ko'rinishi**, chunki ismni qidirsangiz — **topasiz**.
4. ## Chunki u muammoni **hal qilmaydi — KO'CHIRADI**. ⭐ Manba so'rash 5 soniya, model uchun bepul; 💥 **tekshirish esa har biri uchun bir necha daqiqa**. 🔑 Tekshirmasangiz — ahvol **yomonlashdi**, chunki manbali matn ⚠️ **ishonchliroq ko'rinadi**. *(Men ham bu 8 tasini tekshira olmadim — kitob internetsiz yozilgan.)*

</details>

---

⬅️ [3-dars](03-OpenAI-Policies.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Plagiarism.md)
