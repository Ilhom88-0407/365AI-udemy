# 4-dars. Skreyp qilingan ma'lumot ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs Mumsnet ishini keltiradi: forum OpenAI ni sudga berdi. Biz esa `robots.txt` ni o'qiydigan tekshiruvchi yozdik — va u `GPTBot` ga butun saytni taqiqlaganini topdi."**

---

## 1. Skreyping — **noqonuniy emas**

> *"Va yo'q, bu **hakerlik emas**, hamda to'g'ri qilinganda **noqonuniy emas**. Veb-skreyping avtomatik vositalar bilan **allaqachon ommaga ochiq** bo'lgan ma'lumotni yig'adi."*

| Savol | Javob |
|---|---|
| Texnik jihatdan mumkinmi | ## ✅ **Ha** |
| Qonuniymi | ## ⚠️ **Bog'liq** |
| ## **Etikmi** | ## 💥 **Alohida savol** |

> ## 🔑 **UCHALASI HAR XIL SAVOL** — ## va ular **bir xil javobga** ega emas.

---

## 2. 💥 Mumsnet va OpenAI

> *"2024-yilda Buyuk Britaniyaning mashhur ota-onalar forumi Mumsnet OpenAI ni **foydalanuvchi kontentini skreyp qilgani** uchun sudga berdi. Mumsnet direktori muhokamalar **rozilliksiz** ishlatilganini aytdi... litsenziya kelishuviga erisha olmagach, ular **ToS va mualliflik huquqini buzgani** uchun da'vo qildi."*

| Bosqich | Nima bo'ldi |
|---|---|
| ① Skreyping | Kontent yig'ildi |
| ② Litsenziya muzokarasi | ## ⚠️ **Muvaffaqiyatsiz** |
| ③ Sud | ## 💥 **ToS + mualliflik huquqi** |

> ## 🔑 **E'TIBOR BERING — MUZOKARA IKKINCHI O'RINDA.** ## ## ⭐ **To'g'ri tartib: avval litsenziya, keyin skreyping.**

---

## 3. 🤖 `robots.txt` — **birinchi tekshiruv**

```python
def robots_tahlil(matn):
    """robots.txt ni User-agent bo'yicha qoidalarga ajratadi."""
    qoidalar, joriy = {}, None
    for ln in matn.splitlines():
        ln = ln.split("#")[0].strip()
        if not ln:
            continue
        k, _, v = ln.partition(":")
        k, v = k.strip().lower(), v.strip()
        if k == "user-agent":
            joriy = v
            qoidalar.setdefault(joriy, {"allow": [], "disallow": [], "delay": None})
        elif joriy and k in ("allow", "disallow"):
            qoidalar[joriy][k].append(v)
        elif joriy and k == "crawl-delay":
            qoidalar[joriy]["delay"] = float(v)
    return qoidalar


def mumkinmi(qoidalar, agent, yol):
    q = qoidalar.get(agent) or qoidalar.get("*")
    if not q:
        return True, "qoida yo'q -> ruxsat"
    eng, natija = -1, True                       # ⭐ eng UZUN mos qoida g'olib
    for a in q["allow"]:
        if a and yol.startswith(a) and len(a) > eng:
            eng, natija = len(a), True
    for d in q["disallow"]:
        if d and yol.startswith(d) and len(d) > eng:
            eng, natija = len(d), False
    return natija, f"agent={agent or '*'} delay={q['delay']}"
```

```
User-agent: *
Disallow: /private/
Disallow: /api/
Crawl-delay: 10

User-agent: GPTBot
Disallow: /

User-agent: MyBot
Allow: /public/
Disallow: /
```

### ✅ Haqiqiy natija

```
  MyBot      /public/jobs     ✅ MUMKIN         agent=MyBot delay=None
  MyBot      /jobs            💥 TAQIQLANGAN    agent=MyBot delay=None
  GPTBot     /anything        💥 TAQIQLANGAN    agent=GPTBot delay=None
  *          /private/data    💥 TAQIQLANGAN    agent=* delay=10.0
  *          /jobs            ✅ MUMKIN         agent=* delay=10.0
  BoshqaBot  /api/v1          💥 TAQIQLANGAN    agent=BoshqaBot delay=10.0
```

> ## 🏆 **`MyBot` UCHUN ENG UZUN QOIDA G'OLIB:** ## `/public/` *(Allow, 8 belgi)* ## `/` *(Disallow, 1 belgi)* dan **ustun**.

> ## 💥 **`GPTBot: Disallow: /` — BUTUN SAYT TAQIQLANGAN.** ## ## 🔑 Bu — Mumsnet kabi saytlar ## ⭐ **hozir aynan shunday qiladi**.

### ⚠️ Va `robots.txt` — **majburiy emas**

| | Holat |
|---|---|
| Texnik majburiyat | ## 💥 **Yo'q** |
| Huquqiy kuch | ## ⚠️ **Yurisdiksiyaga bog'liq** |
| ## **Etik majburiyat** | ## ✅ **Ha** |
| Sudda dalil | ## ⭐ **Ha — "bilgan holda buzdi"** |

> ## 🔑 **VA OXIRGI QATOR — ENG MUHIMI.** ## `robots.txt` ni e'tiborsiz qoldirish ## **niyatni** ko'rsatadi.

---

## 4. 📄 Litsenziya tekshiruvchisi

Kurs **metama'lumot** haqida gapiradi: *"ma'lumot haqidagi ma'lumot — yaratuvchi, egalik, litsenziya shartlari, foydalanish huquqlari"*.

```python
MOSLIK = {
    ("CC0", "tijorat"): True,
    ("CC-BY", "tijorat"): True,
    ("CC-BY-SA", "tijorat"): True,
    ("CC-BY-NC", "tijorat"): False,
    ("CC-BY-ND", "model o'qitish"): False,
    ("MIT", "tijorat"): True,
    ("GPL-3.0", "yopiq kod"): False,
    ("noma'lum", "tijorat"): False,
    ("ToS taqiqlaydi", "tijorat"): False,
}


def litsenziya_tekshir(lits, maqsad):
    k = (lits, maqsad)
    if k in MOSLIK:
        return MOSLIK[k], ""
    if lits == "noma'lum" or not lits:
        return False, "💥 litsenziya noma'lum -> DEFAULT DENY"
    if "NC" in lits and maqsad == "tijorat":
        return False, "💥 NC = non-commercial"
    if "ND" in lits:
        return False, "💥 ND = hosila asar taqiqlangan"
    return None, "⚠️ qoida yo'q — yurist bilan maslahatlashing"
```

### ✅ Haqiqiy natija

```
  Common Crawl           noma'lum         💥 TAQIQ
  Wikipedia              CC-BY-SA         ✅ MUMKIN
  Flickr rasm            CC-BY-NC         💥 TAQIQ
  O'z mijoz ma'lumoti    MIT              ✅ MUMKIN
  Forum posti            ToS taqiqlaydi   💥 TAQIQ
  Kitob matni            CC-BY-ND         💥 TAQIQ
  Yangi manba            Apache-2.0       ⚠️ NOANIQ  ⚠️ qoida yo'q — yurist bilan maslahatlashing
```

> ## 🔧 **OXIRGI QATOR — MENING JADVALIMDAGI BO'SHLIQ.** ## `Apache-2.0` ro'yxatda **yo'q**.
>
> ## ## 🏆 **VA BU — TO'G'RI XULQ:** ## kod *"mumkin"* deb **taxmin qilmadi**, ## ⭐ **"bilmayman"** dedi.

> ## 💡 **`CC-BY-SA` — QIZIQ HOLAT:** ## u tijorat uchun **mumkin**, ## lekin ## ⚠️ **hosila asar ham `SA`** *(share-alike)* bo'lishi kerak. ## ## 💥 Ya'ni modelingiz **ochiq** bo'lishi kerakmi? ## 🔑 Bu — **hal qilinmagan huquqiy savol**.

---

## 5. 🏆 Skreyping oldidan — **beshta qadam**

```python
def skreyp_mumkinmi(sayt):
    """Beshta tekshiruv. Bittasi ham yiqilsa — TO'XTAYMIZ."""
    xatolar = []

    if not sayt.get("robots_tekshirildi"):
        xatolar.append("💥 robots.txt tekshirilmagan")
    elif not sayt.get("robots_ruxsat"):
        xatolar.append("💥 robots.txt TAQIQLAYDI")

    if sayt.get("tos_taqiqlaydi"):
        xatolar.append("💥 Foydalanish shartlari taqiqlaydi")

    lits, izoh = litsenziya_tekshir(sayt.get("litsenziya", "noma'lum"),
                                    sayt.get("maqsad", "tijorat"))
    if lits is not True:
        xatolar.append(f"💥 litsenziya: {izoh or lits}")

    if sayt.get("shaxsiy_malumot") and not sayt.get("anonimlashtirish"):
        xatolar.append("💥 shaxsiy ma'lumot + anonimlashtirish yo'q")

    if not sayt.get("crawl_delay"):
        xatolar.append("⚠️ crawl-delay belgilanmagan (serverni ortiqcha yuklaydi)")

    return (not [x for x in xatolar if x.startswith("💥")]), xatolar
```

```python
SAYTLAR = [
    ("ochiq API", {"robots_tekshirildi": True, "robots_ruxsat": True,
                   "litsenziya": "CC-BY", "maqsad": "tijorat",
                   "crawl_delay": 1}),
    ("Mumsnet kabi forum", {"robots_tekshirildi": True, "robots_ruxsat": False,
                            "tos_taqiqlaydi": True, "litsenziya": "noma'lum",
                            "shaxsiy_malumot": True}),
    ("ish e'lonlari sayti", {"robots_tekshirildi": True, "robots_ruxsat": True,
                             "litsenziya": "noma'lum", "crawl_delay": 5}),
]

for nom, s in SAYTLAR:
    ok, x = skreyp_mumkinmi(s)
    print(f"  {nom:22} {'✅ MUMKIN' if ok else '🛑 TO‘XTATING'}")
    for e in x:
        print(f"      {e}")
```

### ✅ Haqiqiy natija

```
  ochiq API              ✅ MUMKIN
  Mumsnet kabi forum     🛑 TO'XTATING
      💥 robots.txt TAQIQLAYDI
      💥 Foydalanish shartlari taqiqlaydi
      💥 litsenziya: False
      💥 shaxsiy ma'lumot + anonimlashtirish yo'q
      ⚠️ crawl-delay belgilanmagan (serverni ortiqcha yuklaydi)
  ish e'lonlari sayti    🛑 TO'XTATING
      💥 litsenziya: False
```

> ## 🔧 **VA MANA MENING KODIMDAGI XATO:** ## `💥 litsenziya: False` — ## ⭐ **tushuntirish yo'qoldi**.
>
> ## ## 🔑 **SABAB:** `("noma'lum", "tijorat")` juftligi ## `MOSLIK` jadvalida **bor**, ## shuning uchun funksiya `(False, "")` qaytardi, ## va `izoh or lits` — ## 💥 **bo'sh satr o'rniga `False` ni** oldi.

### ✅ Tuzatish — jadvalga IZOH ham qo'shamiz

```python
MOSLIK = {
    ("CC0", "tijorat"):            (True,  ""),
    ("CC-BY", "tijorat"):          (True,  ""),
    ("CC-BY-SA", "tijorat"):       (True,  "⚠️ hosila asar ham SA bo'lishi kerak"),
    ("CC-BY-NC", "tijorat"):       (False, "NC = non-commercial"),
    ("CC-BY-ND", "model o'qitish"): (False, "ND = hosila asar taqiqlangan"),
    ("MIT", "tijorat"):            (True,  ""),
    ("GPL-3.0", "yopiq kod"):      (False, "GPL kodni ochiq qilishni talab qiladi"),
    ("noma'lum", "tijorat"):       (False, "litsenziya noma'lum -> DEFAULT DENY"),
    ("ToS taqiqlaydi", "tijorat"): (False, "Foydalanish shartlari taqiqlaydi"),
}
```

> ## 🏆 **DARS:** ## xato xabari **ma'noli** bo'lishi kerak. ## ⭐ `False` — **hech nimani tushuntirmaydi**.

> ## 💥💥 **`Mumsnet kabi forum` — TO'RTTA JIDDIY MUAMMO.** ## Aynan sud ishiga olib kelgan holat.

> ## ⚠️ **UCHINCHI QATOR — ENG KO'P UCHRAYDIGANI:** ## sayt skreypingga **ruxsat beradi**, ## lekin ## 💥 **litsenziya aytilmagan**. ## ## 🔑 **Bu "mumkin" degani EMAS.**

---

## 🎯 Nazorat savollari

1. Skreyping noqonuniymi?
2. Mumsnet ishida to'g'ri tartib qanday bo'lishi kerak edi?
3. `MyBot` uchun qaysi qoida g'olib chiqdi va nega?
4. Litsenziya tekshiruvchisi `Apache-2.0` ga nima dedi?
5. Eng ko'p uchraydigan skreyping muammosi nima?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q** — u ommaga ochiq ma'lumotni yig'adi. ⚠️ Lekin *"texnik jihatdan mumkin"*, *"qonuniy"* va *"etik"* — **uchta har xil savol**.
2. ## **Avval litsenziya, keyin skreyping.** 💥 OpenAI teskarisini qildi: skreyp qildi, keyin muzokara qildi, keyin sudga tushdi.
3. ## `Allow: /public/` *(8 belgi)* — chunki **eng uzun mos keluvchi** qoida g'olib. `Disallow: /` atigi **1 belgi**.
4. ## **`⚠️ NOANIQ`** — jadvalda yo'q. 🏆 Va bu **to'g'ri xulq**: kod *"mumkin"* deb **taxmin qilmadi**.
5. ## Sayt skreypingga **ruxsat beradi**, lekin **litsenziya aytilmagan**. 🔑 *"Ruxsat"* ≠ *"litsenziya"*.

</details>

---

⬅️ [3-dars](03-Public-Data.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Sensitive-Information.md)
