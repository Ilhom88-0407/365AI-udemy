# 1-dars. AI ga teng kirish ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Bir xil savol — inglizcha 14 token, o'zbekcha 25. Bu shunchaki narx emas: bitta kontekst oynasiga inglizchada 571 ta savol, o'zbekchada 320 ta sig'adi."**

---

## 1. Kursning boshlanishi

> *"Dunyo shunga ishonch hosil qilishi kerakki, **faqat badavlat odamlar
> emas**, hamma sun'iy intellektdan foyda ko'radi."* — **Bill Gates**

Kurs uchta to'siqni sanaydi:

| # | To'siq | Kurs yechimi |
|---|---|---|
| ① | Ulanish | Starlink, Project Taara |
| ② | ## **Bilim** | Google *AI for Everyone*, Black in AI |
| ③ | Hisoblash quvvati | Bepul bulut kreditlari |

> ## ⚠️ **KURS TO'RTINCHISINI AYTMAYDI.** ## ## 💥 **VA U — ENG O'LCHANADIGANI.**

---

## 2. 🔬 To'rtinchi to'siq — **til**

Bir xil savolni uch tilda beramiz va **tokenlarni sanaymiz**.

```python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")

SAVOL = {
 "inglizcha": "Explain the water cycle to a ten year old child in simple words.",
 "ruscha":    "Объясни круговорот воды в природе десятилетнему ребёнку "
              "простыми словами.",
 "o'zbekcha": "Suvning tabiatdagi aylanishini o'n yoshli bolaga oddiy "
              "so'zlar bilan tushuntir.",
}
```

### ✅ Haqiqiy natija

```
  til            belgi   token  token/belgi   nisbat
  inglizcha         64      14        0.219     1.00x
  ruscha            73      18        0.247     1.29x
  o'zbekcha         79      25        0.316     1.79x
```

> ## 💥💥 **BIR XIL SAVOL — O'ZBEKCHADA `1.79x` TOKEN.**

### 💥 Va bu **faqat narx emas**

```
  8000 tokenlik kontekst oynasiga nechta shunday savol sig'adi:
  inglizcha       571 ta
  ruscha          444 ta
  o'zbekcha       320 ta
```

> ## 💥💥💥 **O'ZBEK FOYDALANUVCHISINING ## "XOTIRASI" 44% QISQAROQ.**

> ## 🔑 **VA BU — PUL BILAN HAL BO'LMAYDI.** ## ## ⭐ Kontekst oynasi — ## 💥 **modelning qattiq chegarasi**.

### 🏆 Uchta amaliy oqibat

| Oqibat | Izoh |
|---|---|
| ## **Qisqaroq suhbat** | ## 💥 Model **avvalgi gaplarni tezroq unutadi** |
| Kamroq hujjat | ⭐ RAG da **kamroq kontekst** |
| ## **Qimmatroq** | ## ⚠️ 73-modul: RAG da **+28%** |

---

## 3. 💥 Va til **sifatga** ham ta'sir qiladi

71-modulda o'lchagan edik:

```
  Ingliz idiomalari:  TUSHUNDI 3/5 | SO'ZMA-SO'Z 1/5 | CHALKASHDI 1/5
  O'zbek idiomalari:  TUSHUNDI 0/5 | SO'ZMA-SO'Z 0/5 | CHALKASHDI 5/5
```

> ## 💥💥💥 **YA'NI O'ZBEK FOYDALANUVCHISI ## UCH BARAVAR JAZOLANADI:**
>
> ## ## ① Ko'proq **to'laydi** *(1.79x token)* ## ## ② Kamroq **kontekst** oladi *(571 → 320)* ## ## ③ Yomonroq **javob** oladi *(3/5 → 0/5)*

> ## 🔑 **VA UCHALASI HAM — ## ⭐ BITTA SABABDAN:** ## ## 💥 **o'quv ma'lumotida o'zbek tili kam.**

---

## 4. ⚠️ Kursning yechimlari **bularni hal qiladimi?**

| Kurs yechimi | Qaysi to'siqni hal qiladi | Tilni-chi? |
|---|---|---|
| Starlink / Taara | Ulanish | ## 💥 **Yo'q** |
| Bepul kurslar | Bilim | ## 💥 **Yo'q** |
| Bepul bulut kreditlari | Hisoblash | ## 💥 **Yo'q** |

> ## 💥 **UCHALASI HAM — TILGA TEGMAYDI.**

### ✅ Tilga tegadigan narsalar

| Nima | Kim qiladi |
|---|---|
| ## **Ona tilida ma'lumot to'plash** | ## ⭐ **Mahalliy jamoalar** |
| Ochiq korpuslarga hissa qo'shish | ⭐ Har kim |
| ## **Ona tilida baholash to'plami** | ## 🏆 **Bu kitobdagi 5 idioma — boshlanish** |
| Mahalliy tokenizator | Tadqiqotchilar |

> ## 🏆🏆 **UCHINCHI QATOR — ENG ARZONI VA ## ENG KAM QILINADIGANI.**
>
> ## ## 🔑 Agar sizda ## ⭐ **o'zbekcha 100 ta test savoli** bo'lsa, ## siz allaqachon ## 💡 **ko'p tadqiqotchidan ko'proq narsaga** egasiz.

---

## 5. 💡 Nima qilish mumkin — **bugun**

```python
def til_jarimasini_olchash(savollar, enc):
    """💡 O'Z ilovangizda, O'Z matningizda o'lchang."""
    natija = {}
    for til, matnlar in savollar.items():
        t = sum(len(enc.encode(m)) for m in matnlar)
        b = sum(len(m) for m in matnlar)
        natija[til] = {"token": t, "belgi": b, "token_belgi": t / b}

    asos = min(natija.values(), key=lambda v: v["token_belgi"])["token_belgi"]
    for til, v in natija.items():
        v["jarima"] = v["token_belgi"] / asos
    return natija
```

> ## ⚠️ **VA 73-MODULDA KO'RGANIMIZDEK —** ## jarima ## 💥 **`1.1x` dan `2.6x` gacha** o'zgaradi. ## ## 🔑 Umumiy raqamga ishonmang, ## ⭐ **o'zingiznikini o'lchang**.

### 🏆 Va ilovangizda

| Qadam | Foyda |
|---|---|
| ## **Kontekst oynasini tilga qarab hisoblang** | ## 💥 320 ≠ 571 |
| Suhbat tarixini **qisqartiring** | ⭐ Xulosalash |
| ## **Ona tilida test to'plami** | ## 🏆 **Sifatni o'lchash** |
| Narxni **til bo'yicha** kuzating | ⚠️ +28% |

---

## 🎯 Nazorat savollari

1. Bir xil savol o'zbekchada necha marta ko'proq token oladi?
2. 8 000 tokenlik oynaga har tilda nechta savol sig'adi?
3. O'zbek foydalanuvchisi qaysi uch tomondan jazolanadi?
4. Kursning uchta yechimi tildagi tengsizlikni hal qiladimi?

<details>
<summary>Javoblar</summary>

1. ## **`1.79x`** *(14 → 25 token)*. Ruscha — `1.29x`.
2. ## Inglizcha **571**, ruscha **444**, o'zbekcha **320**. 💥 Ya'ni o'zbek foydalanuvchisining *"xotirasi"* ⭐ **44% qisqaroq** — va bu 🔑 **pul bilan hal bo'lmaydi**.
3. ## ① Ko'proq **to'laydi** *(1.79x)*, ② kamroq **kontekst** oladi *(571 → 320)*, ③ yomonroq **javob** oladi *(idiomalar: 3/5 → 0/5, 71-modul)*. ⭐ Uchalasi ham bitta sabab: **o'quv ma'lumotida o'zbek tili kam**.
4. ## **Yo'q — uchalasi ham tilga tegmaydi.** Starlink ulanishni, kurslar bilimni, bulut kreditlari hisoblashni hal qiladi. 🏆 Tilga tegadigani — **ona tilida ma'lumot va baholash to'plami**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Human-AI-Collaboration.md)
