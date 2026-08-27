# 1-dars. ChatGPT ni tushunish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: token — so'z, so'zning qismi yoki belgi. Biz `o'zbekcha` so'zini ochib ko'rdik: `['o', "'z", 'bek', 'cha']` — to'rtta token, va apostrof alohida."**

---

## 1. Kursning tashbehi

> *"ChatGPT — dunyodagi barcha bilimni saqlaydigan **cheksiz kutubxona**
> kabi... lekin xaritasiz kerakli kitobni topish deyarli imkonsiz."*

> ## 🔑 **VA KURSNING ENG MUHIM JUMLASI:**
>
> ## ## ⭐ *"U sehrli, hamma narsani biladigan orakul emas ## va **ta'lim, tajriba yoki tanqidiy fikrlashni ## almashtira olmaydi**."*

---

## 2. 🔬 Token nima? — **ochib ko'ramiz**

> *"Siz xabar yozganingizda, AI uni **tokenlar** deb ataladigan kichik
> bo'laklarga ajratadi. Ular so'zlar, so'zlarning qismlari yoki
> belgilar bo'lishi mumkin."*

```python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")

for soz in ["cat", "unbelievable", "Toshkent", "o'zbekcha"]:
    tokenlar = enc.encode(soz)
    qismlar = [enc.decode([t]) for t in tokenlar]   # ⭐ har tokenni ALOHIDA
    print(f"{soz:16} {len(tokenlar)} token  {qismlar}")
```

### ✅ Haqiqiy natija

```
  so'z                              token  bo'linish
  cat                                   1  ['cat']
  unbelievable                          3  ['un', 'bel', 'ievable']
  tokenization                          2  ['token', 'ization']
  Tashkent                              3  ['T', 'ash', 'kent']
  Toshkent                              3  ['T', 'osh', 'kent']
  o'zbekcha                             4  ['o', "'z", 'bek', 'cha']
  qaytarish                             4  ['q', 'ay', 'tar', 'ish']
  antidisestablishmentarianism          6  ['ant', 'idis', 'est', 'ablishment', 'arian', 'ism']
```

> ## 🏆 **KURSNING TA'RIFI TASDIQLANDI:** ## `cat` — **bir so'z**, ## `unbelievable` — **uchta bo'lak**, ## `q` — **bitta belgi**.

### 💥 Va uchta muhim tafsilot

| Kuzatuv | Ma'nosi |
|---|---|
| ## **`o'zbekcha` → `['o', "'z", 'bek', 'cha']`** | ## 💥 **Apostrof ALOHIDA token** |
| ## **`Toshkent` va `Tashkent` — ikkalasi 3 token** | ## ⭐ Lekin bo'linish **boshqacha** |
| `antidises...` *(28 harf)* — atigi 6 token | ## 🔑 **Uzunlik ≠ token soni** |

> ## 💡 **BIRINCHISI — O'ZBEK TILI UCHUN JIDDIY:** ## `o'` va `g'` harflari ## ⭐ **har safar qo'shimcha token** yeydi.

---

## 3. 🔬 Bir so'z — necha token?

```
  inglizcha       tok   o'zbekcha       tok   ruscha          tok
  water             1   suv               2   вода              2
  teacher           1   o'qituvchi        4   учитель           2
  university        2   universitet       2   университет       3
  friendship        2   do'stlik          4   дружба            3
  computer          1   kompyuter         3   компьютер         4

  JAMI: inglizcha 7, o'zbekcha 15 (2.14x), ruscha 14 (2.00x)
```

> ## 💥💥 **ALOHIDA SO'ZLARDA JARIMA `2.14x` —** ## 74-modulda **butun jumlada** ## ⭐ **`1.79x`** edi.

> ## 🔑 **SABAB:** ## jumlada `.`, `,`, bo'sh joy kabi ## ⭐ **"arzon" tokenlar** bor, ## ular jarimani ## 💡 **suyultiradi**.

> ## 🏆 **YA'NI ALOHIDA SO'Z — ENG YOMON HOLAT.** ## Va u ## ⭐ **kalit so'zlar, teglar, ## qisqa buyruqlar** uchun muhim.

> ## 💥 **E'TIBOR BERING — `o'qituvchi` VA `do'stlik`** ## har biri **4 token**, ## `teacher` va `friendship` esa ## ⭐ **1 va 2**.

---

## 4. 🔑 Model *"biladimi"* yoki *"bashorat qiladimi"*?

> *"Faktlarni oddiygina saqlash o'rniga, u **naqshlarni** o'rgandi —
> so'zlar qanday bog'lanishi, g'oyalar qanday oqishi..."*

> ## 🏆 **BU — 72-MODULDAGI MANGO TAJRIBASINING ## NAZARIY IZOHI.**

72-modulda o'lchagan edik:

```
SOXTA ASOS: "Mexico produces over 90% of the world's mango crop"
OCHIQ SAVOL: "The world's top mango producer is India."
```

> ## 🔑 **MODEL IKKALA JAVOBNI HAM "BILADI".** ## ## 💥 U shunchaki ## ⭐ **kontekstga mos keladiganini** tanlaydi.

| Kurs aytadi | Bizning o'lchov *(72-modul)* |
|---|---|
| Naqshlarni o'rganadi, faktlarni emas | ## 💥 **7/8 soxta asos qabul qilindi** |
| Kontekstga mos javob beradi | ## ✅ **Ochiq savolda to'g'ri javob** |
| *"Bilmayman"* mexanizmi yo'q | ## 💥 **Ko'rsatma bilan ham 62%** |

---

## 5. ⚠️ Kurs sanagan muammolar

| Muammo | Qayerda o'lchandi |
|---|---|
| Noto'g'ri javoblar | ## 💥 **72-modul: 7/8** |
| Nomuvofiqlik | ## 💥 **72-modul: 37.5%** |
| Gallyutsinatsiya | ## 💥 **72-modul: mango** |
| Stereotiplar va bias | ## 💥 **71-modul: proksi +32.7%** |
| Soxta yangiliklar | ⭐ 4-dars |
| ## **Maxfiylik** | ## ⭐ **2 va 3-dars** |

> ## 💡 **YA'NI BU MODUL — YANGI MAVZU EMAS.** ## ## 🔑 U 68–74-modullardagi hamma narsani ## ⭐ **bitta aniq vositaga** qo'llaydi.

---

## 6. 🏆 Amaliy natija — **tokenni bilish nima beradi?**

```python
def sorov_tahlili(matn, enc, oyna=8000, javob_token=500):
    """💡 So'rov yuborishdan OLDIN."""
    t = len(enc.encode(matn))
    return {
        "token": t,
        "oynadagi_ulush": f"{t / oyna:.1%}",
        "javobga_qoldi": oyna - t - javob_token,
        "ogohlantirish": "SO'ROV JUDA UZUN" if t > oyna * 0.5 else None,
    }
```

| Nima uchun kerak | Izoh |
|---|---|
| ## **Uzun hujjat yuborishdan oldin** | ## 💥 Oynaga **sig'adimi?** |
| Narxni oldindan bilish | ⭐ 73-modul: `$162/yil` |
| ## **Nega javob KESILDI?** | ## 🔑 **Javobga joy qolmadi** |
| Til jarimasini o'lchash | ⭐ 74-modul |

---

## 🎯 Nazorat savollari

1. `o'zbekcha` so'zi qanday bo'linadi?
2. Alohida so'zlarda til jarimasi qancha? Jumlada-chi? Nega farq qiladi?
3. Model faktlarni *"biladimi"*?
4. Nega `antidisestablishmentarianism` atigi 6 token?

<details>
<summary>Javoblar</summary>

1. ## **`['o', "'z", 'bek', 'cha']`** — **4 token**, va 💥 **apostrof alohida token**. ⭐ Bu o'zbek tili uchun jiddiy: `o'` va `g'` har safar **qo'shimcha token** yeydi.
2. ## Alohida so'zlarda **`2.14x`**, jumlada **`1.79x`** *(74-modul)*. 🔑 Sabab: jumlada `.`, `,`, bo'sh joy kabi ⭐ **"arzon" tokenlar** jarimani **suyultiradi**. 🏆 Ya'ni alohida so'z — **eng yomon holat**.
3. ## **Yo'q — u naqshlarni o'rgangan.** 💥 72-modulda o'lchandi: model *"Meksika"* va *"Hindiston"* javoblarini **ikkalasini ham** beradi, ⭐ **kontekstga qarab**.
4. ## Chunki 🔑 **uzunlik ≠ token soni**. Tokenizator **tez-tez uchraydigan bo'laklarni** *(`ant`, `ablishment`, `ism`)* birlashtiradi — ular ⭐ **o'quv ma'lumotida ko'p uchragan**.

</details>

---

🏠 [Modul](README.md) · ➡️ [2-dars](02-Privacy-Concerns.md)
