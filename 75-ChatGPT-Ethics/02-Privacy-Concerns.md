# 2-dars. ChatGPT va maxfiylik ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: xodim kiritmasining 11% i nozik ma'lumot. Biz tahrirlovchi yozdik — 8 ta nozik so'rovdan 8 tasini tozaladi, va HECH BIRI ma'nosini yo'qotmadi."**

---

## 1. Kursning asosiy faktlari

| Fakt | Manba |
|---|---|
| ## **Bepul/Plus:** kiritma o'qitishga ketishi mumkin | OpenAI |
| Enterprise: ketmaydi | OpenAI |
| ## **2023-yil: xatolik boshqalarning suhbatini ko'rsatdi** | ## 💥 Hodisa |
| ## **Alohida promptni o'chirib bo'lmaydi** | ## 💥 OpenAI FAQ |
| Xodim kiritmasining **11%** i nozik | ⚠️ Tadqiqot |

> ## 💥💥 **TO'RTINCHISI — ENG KAM BILINADIGANI:**
>
> ## ## ⭐ *"Biz tarixingizdan **aniq promptlarni** ## o'chira olmaymiz."*

> ## 🔑 **YA'NI SIZ SUHBATNI O'CHIRASIZ,** ## lekin ## 💥 **yuborilgan narsa yuborilgan**.

---

## 2. 🔑 Asosiy xulosa — **himoya YUBORISHDAN OLDIN**

> ## 💥 **HAMMA SIYOSAT, HAMMA SOZLAMA — ## MA'LUMOT KETGANDAN KEYIN ISHLAYDI.**
>
> ## ## 🏆 **YAGONA ISHONCHLI NAZORAT NUQTASI — ## ⭐ "Enter" TUGMASIDAN OLDIN.**

---

## 3. 🔬 Nozik ma'lumot **detektori**

```python
import re

QOIDALAR = [
 ("email",        r"\b[\w.+-]+@[\w-]+\.[\w.]+\b"),
 ("telefon",      r"(\+998|\b8)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b"),
 ("karta",        r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b"),
 ("API kalit",    r"\b(sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}"
                  r"|AKIA[A-Z0-9]{12,})\b"),
 ("parol",        r"\b(password|parol|passwd)\s*[:=]\s*\S+"),
 ("ichki URL",    r"\bhttps?://[\w.-]*\.(internal|local|corp)\b"),
 ("shartnoma",    r"\b(confidential|maxfiy|NDA|internal only)\b"),
 ("ism+lavozim",  r"\b[A-Z][a-z]+ [A-Z][a-z]+,? (CEO|CTO|CFO|direktor|rahbar)\b"),
]


def nozik_tekshiruv(matn):
    return [nom for nom, naqsh in QOIDALAR if re.search(naqsh, matn, re.I)]
```

### ✅ Haqiqiy natija — **18 ta so'rov**

```
  BLOK  ['shartnoma']    Summarise this: our Q3 revenue was 4.2M, confidential...
  BLOK  ['email']        Write a polite reply to john.smith@acme-corp.com...
  BLOK  ['ism+lavozim']  Draft an email to Aziz Karimov, CEO about the merger.
  BLOK  ['parol']        My db password: hunter2 — why does the connection fail?
  BLOK  ['ichki URL']    Review this: https://wiki.acme.internal/roadmap-2026
  BLOK  ['karta']        Customer card 4111 1111 1111 1111 was declined, why?
  BLOK  ['telefon']      Call me at +998 90 123 45 67 if you need details.
  BLOK  ['shartnoma']    Summarise the attached NDA between Acme and Beta.

  8/18 = 44% nozik
```

> ## ⚠️⚠️ **VA BU YERDA HALOL BO'LISH KERAK.**
>
> ## ## 💥 **`44%` — O'LCHOV EMAS.** ## Men 18 ta so'rovning ## ⭐ **8 tasini ATAYIN nozik** qilib yozdim.

> ## 🔑 **KURSNING `11%` I — HAQIQIY QO'LLANISHDAN.** ## ## 💥 Mening `44%` im — ## **mening to'plamimning xususiyati**.

> ## 🏆 **HAQIQATAN O'LCHANADIGAN NARSA BOSHQA:** ## ## ⭐ **detektor ularni TOPDIMI?** ## va ## 💡 **tahrirlovchi ularni QUTQARDIMI?**

---

## 4. 🏆 Tahrirlovchi — **so'rovni yo'qotmaydi**

Nozik so'rovni **bloklash** oson. Lekin foydalanuvchi
**baribir yuboradi** — faqat boshqa vositada.

> ## 💡 **YAXSHIROQ YO'L — TAHRIRLASH.**

```python
def tahrirlash(matn):
    for nom, naqsh in QOIDALAR:
        matn = re.sub(naqsh, f"[{nom.upper()}]", matn, flags=re.I)
    return matn
```

### ✅ Haqiqiy natija — **8/8 tozalandi**

```
  oldin: Write a polite reply to john.smith@acme-corp.com about the delay.
  keyin: Write a polite reply to [EMAIL] about the delay.
  TOZA

  oldin: Customer card 4111 1111 1111 1111 was declined, why?
  keyin: Customer card [KARTA] was declined, why?
  TOZA

  oldin: My db password: hunter2 — why does the connection fail?
  keyin: My db [PAROL] — why does the connection fail?
  TOZA

  oldin: Review this: https://wiki.acme.internal/roadmap-2026
  keyin: Review this: [ICHKI URL]/roadmap-2026
  TOZA
```

> ## 🏆🏆 **8/8 TOZALANDI — VA HAR BIRI ## HAMON JAVOB BERILADIGAN SAVOL.**

| Savol | Tahrirdan keyin javob berish mumkinmi? |
|---|---|
| *"Write a polite reply to `[EMAIL]`"* | ## ✅ **Ha** |
| *"Card `[KARTA]` was declined, why?"* | ## ✅ **Ha** |
| *"My db `[PAROL]` — why does it fail?"* | ## ✅ **Ha** |

> ## 💥 **VA BU — ASOSIY FIKR:** ## nozik qism ## ⭐ **savolning MA'NOSIGA kirmaydi**. ## ## 🔑 U shunchaki **birga ketgan**.

### ⚠️ Bitta halol eslatma

```
  oldin: Review this: https://wiki.acme.internal/roadmap-2026
  keyin: Review this: [ICHKI URL]/roadmap-2026
```

> ## ⚠️ **`roadmap-2026` QOLDI.**
>
> ## ## 🔑 Regex faqat **domenni** tutdi. ## ⭐ Yo'l qismi ham ## 💥 **ma'lumot bo'lishi mumkin**.

> ## 💡 **YA'NI TAHRIRLOVCHI — ## MUKAMMAL EMAS, LEKIN ## 🏆 HECH NARSADAN CHEKSIZ YAXSHIROQ.**

---

## 5. 🔧 Uni **qayerga qo'yish** kerak

```python
def xavfsiz_yuborish(matn, rejim="tahrirlash"):
    """💡 Har chaqiruvdan OLDIN."""
    topilgan = nozik_tekshiruv(matn)
    if not topilgan:
        return matn, []

    if rejim == "blok":
        raise ValueError(f"Nozik ma'lumot: {topilgan}")
    if rejim == "sorash":
        print(f"⚠️  Topildi: {topilgan}. Tahrirlansinmi? [h/y]")
    return tahrirlash(matn), topilgan
```

| Qayerda | Kim uchun |
|---|---|
| ## **Ilova kodida** | ## ⭐ Har `client.chat.completions.create` dan oldin |
| Brauzer kengaytmasi | ⭐ Shaxsiy foydalanish |
| ## **Korporativ proksi** | ## 🏆 **Butun jamoa uchun** |

> ## 🔑 **UCHINCHISI — YAGONA ISHONCHLISI,** ## chunki u ## ⭐ **odamning e'tiboriga bog'liq emas**.

---

## 6. ⚠️ Kursning ogohlantirishi — **o'z fikringiz ham ma'lumot**

> *"Agar siz ChatGPT bilan **noyob biznes g'oyangizni** muhokama
> qilsangiz, uning qismlari boshqalarning shunga o'xshash
> so'rovlariga ta'sir qilishi mumkin."*

> ## ⚠️ **BU — TEXNIK JIHATDAN ANIQ EMAS.** ## Kursning o'zi ham ## ⭐ *"to'g'ridan-to'g'ri kiritmaydi"* deydi.

> ## 🏆 **LEKIN AMALIY MASLAHAT TO'G'RI,** ## va u ## 🔑 **detektor bilan hal bo'lmaydi** — ## g'oyani regex **tanimaydi**.

### 💡 Buning uchun — **boshqa qoida**

```python
YUBORMASLIK_QOIDASI = [
    "Hali e'lon qilinmagan mahsulot nomi",
    "Narx strategiyasi",
    "Hali imzolanmagan shartnoma sharti",
    "Xodim haqida shaxsiy baho",
    "Xavfsizlik zaifligi tafsiloti",
]
```

> ## 💡 **BU RO'YXAT — ODAM UCHUN, KOD UCHUN EMAS.** ## ## ⭐ Uni jamoa **devoriga osing**.

---

## 🎯 Nazorat savollari

1. Suhbatni o'chirish yetarlimi?
2. Nega `44%` raqami o'lchov emas?
3. Tahrirlash bloklashdan nega yaxshiroq?
4. Tahrirlovchi nimani o'tkazib yubordi?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q.** 💥 OpenAI FAQ: *"biz tarixingizdan **aniq promptlarni** o'chira olmaymiz"*. 🔑 Yagona ishonchli nazorat nuqtasi — ⭐ **"Enter" tugmasidan oldin**.
2. ## Chunki men 18 ta so'rovning **8 tasini ATAYIN nozik** qilib yozdim. ⭐ `44%` — **mening to'plamimning xususiyati**, haqiqiy qo'llanish o'lchovi emas. 🏆 To'g'ri o'lchanadigani — **detektor topdimi va tahrirlovchi qutqardimi**.
3. ## Chunki bloklansa, foydalanuvchi 💥 **baribir yuboradi — boshqa vositada**. ⭐ Tahrirlashda esa **8/8 so'rov hamon javob beriladigan** bo'lib qoldi: nozik qism 🔑 **savolning ma'nosiga kirmaydi**.
4. ## **`roadmap-2026`** — regex faqat **domenni** tutdi, ⚠️ yo'l qismi qoldi. 💡 Ya'ni tahrirlovchi **mukammal emas**, lekin 🏆 **hech narsadan cheksiz yaxshiroq**.

</details>

---

⬅️ [1-dars](01-Understanding-ChatGPT.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-OpenAI-Policies.md)
