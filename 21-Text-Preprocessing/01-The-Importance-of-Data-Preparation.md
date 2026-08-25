# 1-dars. Ma'lumot tayyorlashning ahamiyati

## 🎬 Boshlashdan oldin

> ## **"Tabiiy tilni qayta ishlashda har qanday mashinali o'rganish yoki olmoqchi bo'lgan insaytlaringizning ANIQLIGINI belgilaydigan ENG MUHIM omillardan biri — siz taqdim etadigan MA'LUMOTNING SIFATI va u qanday TOZALANGANI."**

---

## 1. "Axlat kirsa, axlat chiqadi"

> **"Siz avval GARBAGE IN, GARBAGE OUT iborasini eshitgan bo'lishingiz mumkin."**

```
GARBAGE IN  →  GARBAGE OUT
axlat kirsa  →  axlat chiqadi
```

> ## **"Bu asosan shuni anglatadiki: agar siz algoritmni AXLAT MA'LUMOT bilan oziqlantirsangiz — ya'ni to'g'ri tozalanmagan, to'g'ri formatda bo'lmagan, ichida KO'P SHOVQIN bo'lgan ma'lumot bilan — u holda mashinali o'rganishingizning har qanday aniqligi shundan ZARAR KO'RADI."**

### Amaliy misol

```
XOM ma'lumot:
  "Great HOTEL!!!"     va     "great hotel"
        ↓                          ↓
  Model buni IKKI XIL so'z deb hisoblaydi

TOZALANGAN:
  "great hotel"        va     "great hotel"
        ↓                          ↓
  Model buni BIR XIL deb hisoblaydi  ✅
```

---

## 2. Uch bosqich

> **"Matn ma'lumotlarimizni oldindan qayta ishlash va uni keyingi tahlilga tayyorlashda bir necha bosqich bor."**

### 1-bosqich — umumiy tozalash

> **"Birinchi qadam — shunchaki UMUMIY TOZALASH. Ya'ni ma'lumot to'plamimizni olib, uni tartibga solish, matnni tozalash — bilasizmi, bizga xato beradigan har qanday narsani olib tashlash."**

### 2-bosqich — shovqinni olib tashlash

> ## **"Ikkinchi qadam — ma'lumot to'plamimizdan SHOVQINNI olib tashlash."**
>
> **"Agar ma'lumotimizda hech qanday QIYMAT QO'SHMAYDIGAN va shunchaki XOTIRADA JOY EGALLAYDIGAN jihatlar bo'lsa — biz ularni olib tashlashimiz mumkin va bizda ishlash uchun KICHIKROQ, TOZAROQ ma'lumot to'plami qoladi."**

### 3-bosqich — to'g'ri format

> **"Uchinchi qadam — shunchaki o'sha ma'lumotni biz ishlatmoqchi bo'lgan mashinali o'rganish algoritmi uchun TO'G'RI FORMATGA keltirish."**

---

## 3. Natija

> **"Matn ma'lumotlarimizni oldindan qayta ishlash uni MANA BUNDAY ko'rinishdan MANA BUNGA olib keladi."**
>
> **"Bu yerda KO'P O'ZGARTIRISHLAR qilinganini ko'rishimiz mumkin."**

```
XOM MATN
"Her Cat's name is Luna! It was TOO far to go to the shop."
                       ↓
              5 BOSQICHLI QUVUR
                       ↓
TOZA TOKENLAR
['cat', 'name', 'luna', 'far', 'go', 'shop']
```

![Oldindan qayta ishlash quvuri](assets/01-preprocessing-pipeline.svg)

---

## 4. Bo'limda nima bo'ladi

> **"Bu bo'limdagi darslar buni QADAMMA-QADAM qamrab oladi — ma'lumotni keyingi tahlilga tayyorlash uchun zarur bo'lgan har bir o'zgartirishni ko'rib chiqamiz."**

| № | Dars | Nima qiladi |
|---|---|---|
| 2 | **Kichik harf** | `Her` → `her` |
| 3 | **To'xtatish so'zlari** | `the`, `and`, `of` — olib tashlash |
| 4 | **Regex** | Tinish belgilarni tozalash |
| 5 | **Tokenizatsiya** | Matn → so'zlar ro'yxati |
| 6 | **Stemming** | `connecting` → `connect` |
| 7 | **Lemmatization** | `worse` → `worse` *(ma'noli)* |
| 8 | **N-grammalar** | Tekshirish va tahlil |
| 9 | **Amaliy** | Hammasi birga — 109 ta mehmonxona sharhi |

---

## 5. 🛠 Kerakli kutubxonalar

Bu moduldan boshlab quyidagilar **kerak**:

```bash
pip install nltk pandas matplotlib
```

Va **NLTK ma'lumotlari**:

```python
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')
```

> ⚠️ **Bir marta** yuklab olish kifoya. Keyin ular kompyuteringizda saqlanadi.

---

## 6. 💻 Amaliy: tozalash NIMA UCHUN kerak?

Buni **o'z ko'zingiz bilan** ko'ring:

```python
sharhlar = [
    "Great HOTEL!!!",
    "great hotel",
    "The hotel was great.",
    "GREAT hotel, and the staff!",
]

# ===== TOZALASHSIZ =====
ch_xom = {}
for s in sharhlar:
    for soz in s.split():
        ch_xom[soz] = ch_xom.get(soz, 0) + 1

print("TOZALASHSIZ —", len(ch_xom), "ta turli 'so'z':")
for s in ch_xom:
    print("  ", repr(s), ":", ch_xom[s])
```

**Natija:**

```
TOZALASHSIZ — 12 ta turli 'so'z':
   'Great' : 1
   'HOTEL!!!' : 1
   'great' : 1
   'hotel' : 2
   'The' : 1
   'was' : 1
   'great.' : 1
   'GREAT' : 1
   'hotel,' : 1
   'and' : 1
   'the' : 1
   'staff!' : 1
```

### ⚠️ Muammo ko'rinyaptimi?

`Great`, `great`, `great.`, `GREAT` — bu **bitta** so'z, lekin model **to'rttasini** ko'radi!

`hotel`, `HOTEL!!!`, `hotel,` — yana **uchta** o'rniga bittasi bo'lishi kerak edi.

```python
# ===== TOZALASH BILAN =====
import re

toxtatish = ["the", "was", "and"]

ch_toza = {}
for s in sharhlar:
    s = s.lower()                          # 1. kichik harf
    s = re.sub(r"[^\w\s]", "", s)          # 2. tinish belgilar
    for soz in s.split():
        if soz not in toxtatish:           # 3. to'xtatish so'zlari
            ch_toza[soz] = ch_toza.get(soz, 0) + 1

print()
print("TOZALASH BILAN —", len(ch_toza), "ta turli so'z:")
for s in ch_toza:
    print("  ", repr(s), ":", ch_toza[s])
```

**Natija:**

```
TOZALASH BILAN — 3 ta turli so'z:
   'great' : 4
   'hotel' : 4
   'staff' : 1
```

> ## 🔑 **12 ta "so'z" → 3 ta haqiqiy so'z.**
>
> Endi model `"great"` 4 marta uchraganini **to'g'ri** ko'radi. Bu — **aniqlikni oshiradi** va **xotirani tejaydi**.

---

## 7. ⚡ Qo'shimcha mashqlar

### 🟢 Oson

**M1.** O'zingizning 5 ta sharhingiz bilan tozalashsiz/tozalash bilan solishtiring.

**M2.** Faqat `.lower()` qo'llasangiz — nechta so'z qoladi?

**M3.** Faqat tinish belgilarni olib tashlasangiz-chi?

<details>
<summary>✅ Yechimlar</summary>

```python
import re
sharhlar = ["Great HOTEL!!!", "great hotel", "The hotel was great.", "GREAT hotel, and the staff!"]

# M2 — faqat lowercase
ch = {}
for s in sharhlar:
    for soz in s.lower().split():
        ch[soz] = ch.get(soz, 0) + 1
print(len(ch), "ta")          # 9 ta
print(list(ch.keys()))
# ['great', 'hotel!!!', 'hotel', 'the', 'was', 'great.', 'hotel,', 'and', 'staff!']

# M3 — faqat tinish belgilar
ch2 = {}
for s in sharhlar:
    for soz in re.sub(r"[^\w\s]", "", s).split():
        ch2[soz] = ch2.get(soz, 0) + 1
print(len(ch2), "ta")         # 10 ta
print(list(ch2.keys()))
# ['Great', 'HOTEL', 'great', 'hotel', 'The', 'was', 'GREAT', 'and', 'the', 'staff']
```

**Xulosa:** har bir bosqich **alohida** foyda beradi, lekin **birgalikda** ular eng kuchli.

</details>

### 🟡 O'rta

**M4.** "Axlat kirsa, axlat chiqadi" ga o'z misolingizni keltiring.

**M5.** Tozalashning uchta bosqichini o'z so'zlaringiz bilan tushuntiring.

**M6.** Qaysi bosqich **eng ko'p** so'z sonini kamaytiradi?

<details>
<summary>✅ Yechimlar</summary>

```python
# M4 — MISOL
# Telefon raqamlari bazasi:
#   "+998901112233", "998901112233", "90 111 22 33", "+998 90 111-22-33"
# Bular BIR XIL raqam, lekin model 4 xil deb ko'radi.
# → Tozalash: faqat raqamlarni qoldirish

# M5
# 1. UMUMIY TOZALASH  — xato beradigan narsalarni olib tashlash
#    (bo'sh qatorlar, noto'g'ri belgilar, dublikatlar)
# 2. SHOVQINNI OLIB TASHLASH — qiymat qo'shmaydigan,
#    faqat XOTIRA egallaydigan qismlar (to'xtatish so'zlari, tinish belgilar)
# 3. FORMAT — ML algoritmi kutgan ko'rinishga keltirish
#    (tokenlar ro'yxati, keyin vektorlar — 24-modul)

# M6
import re
sharhlar = ["Great HOTEL!!!", "great hotel", "The hotel was great.", "GREAT hotel, and the staff!"]
toxtatish = ["the","was","and"]

def sana(f):
    ch = {}
    for s in sharhlar:
        for soz in f(s).split():
            if soz: ch[soz] = ch.get(soz,0)+1
    return len(ch)

print("Xom:            ", sana(lambda s: s))                            # 12
print("Lowercase:      ", sana(lambda s: s.lower()))                    # 9
print("Tinish belgilar:", sana(lambda s: re.sub(r"[^\w\s]","",s)))      # 10
print("Ikkalasi:       ", sana(lambda s: re.sub(r"[^\w\s]","",s.lower())))  # 6
# Eng ko'p foyda — IKKALASI BIRGA
```

</details>

### 🔴 Qiyin

**M7.** 10 000 ta sharhda tozalash **xotirani** qancha tejashini hisoblang.

**M8.** Tozalash **zarar** keltiradigan holatni o'ylab toping.

<details>
<summary>✅ Yechimlar</summary>

```python
# M7
sharhlar_soni = 10000
sozlar_bir_sharhda = 50
toxtatish_ulushi = 0.4      # ~40% to'xtatish so'zlari

xom = sharhlar_soni * sozlar_bir_sharhda
toza = xom * (1 - toxtatish_ulushi)
print("Xom tokenlar: ", xom)                        # 500000
print("Toza tokenlar:", int(toza))                  # 300000
print("Tejaldi:      ", round((1-toza/xom)*100), "%")   # 40 %

# M8 — TOZALASH ZARAR KELTIRADIGAN HOLATLAR
#
# 1. "US" → "us"
#    Mamlakat nomi oddiy olmoshga aylanadi (ma'ruzachi aytgan!)
#
# 2. "not good" → "good"
#    "not" to'xtatish so'zlar ro'yxatida — INKOR YO'QOLADI!
#    → Shuning uchun ma'ruzachi "not" ni ro'yxatdan OLIB TASHLAYDI
#
# 3. ":-)" va ":-(" → ""
#    Emotikonlar — sentiment uchun MUHIM belgi, lekin tinish
#    belgi sifatida o'chiriladi
#
# 4. "C++" → "c"
#    Dasturlash tili nomi buziladi
#
# 🔑 QOIDA: tozalash — MEXANIK amal EMAS.
#    Har bir bosqichda "bu MA'NONI buzadimi?" deb so'rang.
```

</details>

---

## 8. 🧠 O'zini tekshirish savollari

1. Aniqlikni belgilaydigan eng muhim omil nima?
2. "Garbage in, garbage out" nimani anglatadi?
3. Axlat ma'lumot nima?
4. Nechta bosqich bor?
5. Birinchi bosqich nima?
6. Ikkinchi bosqich nima uchun kerak?
7. Uchinchi bosqich nima?

<details>
<summary>✅ Javoblar</summary>

1. Siz taqdim etadigan **ma'lumotning sifati** va u **qanday tozalangani**.
2. Algoritmni **axlat ma'lumot** bilan oziqlantirsangiz — natijaning **aniqligi zarar ko'radi**.
3. **To'g'ri tozalanmagan**, **to'g'ri formatda bo'lmagan**, ichida **ko'p shovqin** bo'lgan ma'lumot.
4. **Uchta.**
5. **Umumiy tozalash** — ma'lumotni tartibga solish, xato beradigan narsalarni olib tashlash.
6. Qiymat qo'shmaydigan va faqat **xotirada joy egallaydigan** jihatlarni olib tashlash → **kichikroq, tozaroq** ma'lumot.
7. Ma'lumotni ishlatmoqchi bo'lgan ML algoritmi uchun **to'g'ri formatga** keltirish.

</details>

---

## 📌 Xulosa

```
🗑 GARBAGE IN  →  GARBAGE OUT
   axlat kirsa  →  axlat chiqadi

"Algoritmni AXLAT ma'lumot bilan oziqlantirsangiz —
 aniqligi ZARAR KO'RADI."


UCH BOSQICH

1. UMUMIY TOZALASH
   tartibga solish · xato beradigan narsalarni olib tashlash

2. SHOVQINNI OLIB TASHLASH
   qiymat qo'shmaydigan · faqat XOTIRA egallaydigan qismlar
   → KICHIKROQ, TOZAROQ ma'lumot

3. TO'G'RI FORMAT
   ML algoritmi kutgan ko'rinish


AMALIY ISBOT

XOM:     "Great HOTEL!!!" · "great hotel" · "GREAT hotel,"
         → 12 ta turli "so'z"

TOZA:    lowercase + tinish belgilar + to'xtatish so'zlari
         → 3 ta haqiqiy so'z  ✅


⚠️  TOZALASH — MEXANIK AMAL EMAS
   "US"      → "us"     mamlakat → olmosh
   "not good"→ "good"   INKOR yo'qoladi!
   ":-)"     → ""       emotikon yo'qoladi
   "C++"     → "c"      til nomi buziladi

   Har bosqichda: "bu MA'NONI buzadimi?"
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Oldindan qayta ishlash | *preprocessing* | Matnni tayyorlash |
| Shovqin | *noise* | Foydasiz ma'lumot |
| Tozalash | *cleaning* | Keraksizni olib tashlash |
| Aniqlik | *accuracy* | Model to'g'ri javob berish darajasi |
| Ma'lumot sifati | *data quality* | Ma'lumotning tozaligi |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: Kichik harf](02-Lowercase.md)
