# 3-dars. Case study ma'lumoti bilan tanishish ⭐

## 🎬 Boshlashdan oldin

> **"Asosiy maqsadimiz — 365 platformasining qidiruv mexanizmini yaxshilash."**

---

## 1. Ikkita fayl

```python
import pandas as pd

kurslar = pd.read_csv("course_descriptions.csv", encoding="cp1252")
bolimlar = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

print("kurslar :", kurslar.shape, list(kurslar.columns))
print("bo'limlar:", bolimlar.shape)
```

```
kurslar : (106, 6) ['course_name', 'course_slug', 'course_technology',
                     'course_description', 'course_topic',
                     'course_description_short']
bo'limlar: (680, 11)
```

> ## 💥💥 **`encoding="cp1252"` — SHART.**
> ```python
> pd.read_csv("course_descriptions.csv")     # UTF-8 (standart)
> # 💥 UnicodeDecodeError: 'utf-8' codec can't decode byte 0x92
> ```
>
> ## 🔑 **KURS UNI `"ANSI"` DEB ATAYDI** — bu **Windows-1252** ning eski nomi. Pandas'da `"cp1252"` yoki `"windows-1252"`.
>
> ## 💡 **SABAB:** faylda `'` *(o'ng qo'shtirnoq, `0x92`)* kabi **Windows-ga xos belgilar** bor.

---

## 2. ⭐ Ustunlar

### 📄 `course_descriptions.csv` *(106 qator)*

| Ustun | Nima | Misol |
|---|---|---|
| `course_name` | Kurs nomi | `Introduction to Tableau` |
| `course_slug` | URL qismi | `tableau` |
| ## `course_technology` | ## **Texnologiya** | `python` · `sql` · `tableau` |
| `course_description` | ## **Uzun tavsif** | ~400 belgi |
| ## `course_topic` | Mavzu | `data visualization` |
| `course_description_short` | Qisqa tavsif | ~200 belgi |

### 📄 `course_section_descriptions.csv` *(680 qator)*

Yuqoridagilar **plus**:

| Ustun | Nima |
|---|---|
| ## `course_id` | Kurs raqami |
| ## `section_id` | ## **Bo'lim raqami** |
| ## `section_name` | ## ⭐ **Bo'lim nomi** |
| ## `section_description` | ## ⭐ **Bo'lim tavsifi** |
| `course_instructor_quote` | O'qituvchi iqtibosi |

> ## 🔑 **BU — DENORMALLASHTIRILGAN JADVAL.** Kurs ma'lumoti **har bo'lim uchun takrorlanadi** *(SQL `JOIN` natijasi)*.
>
> ## 💡 **VA BU — BIZ UCHUN QULAY:** har qatorda **butun kontekst** bor.

---

## 3. 🔬 Ma'lumot sifati — o'lchandi

```python
print("noyob kurs (bo'limlar faylida):", bolimlar.course_id.nunique())
print("\nbo'sh qiymatlar:")
print(bolimlar.isna().sum()[lambda x: x > 0].to_string())

print("\ntexnologiyalar:")
print(bolimlar.course_technology.value_counts().to_string())
```

```
noyob kurs (bo'limlar faylida): 105

course_instructor_quote    20

python     259
theory     192
excel       90
tableau     43
sql         41
chatgpt     16
powerbi     15
r           11
```

> ## ⚠️ **UCHTA KUZATUV:**
> ```
> ① 106 kurs, LEKIN bo'limlar faylida 105 noyob kurs
>    →  bitta kursda bo'lim YO'Q
>
> ② course_instructor_quote — 20 ta bo'sh
>    →  💥 metadata'ga yozsangiz: NaN → None → xato (50-modul)
>
> ③ Texnologiyalar NOTEKIS taqsimlangan
>    →  python 259 · r 11  →  23× farq
>    →  ⚠️ "R kurslarini top" so'rovi kam natija beradi
> ```

---

## 4. 💥💥 Yashirin muammo — boshqaruv belgilari

```python
for ustun in ["course_description", "section_description"]:
    n = bolimlar[ustun].map(
        lambda s: ("\r" in str(s)) or ("\n" in str(s))).sum()
    cr = bolimlar[ustun].map(lambda s: str(s).count("\r")).sum()
    print(f"  {ustun:22s} {n:3d}/{len(bolimlar)} qator · {cr:5d} ta \\r")

print("\nnamuna:")
print(repr(bolimlar.section_description.iloc[0][-56:]))
```

```
  course_description     199/680 qator ·  3009 ta \r
  section_description    108/680 qator ·   839 ta \r

'install Tableau Public (Tableau’s free version).\r\r\r\r\r\r\r\r\n'
```

> ## 💥 **JAMI 3848 TA `\r` BELGISI.**
>
> ## 🔑 **NIMA UCHUN MUHIM?**
> ```
> ① Tokenlarni BEHUDA yeydi (256 token chegarasida har token qimmat)
> ② Embedding sifatiga TA'SIR qiladi
> ③ Natijani ko'rsatganda EKRANDA buziq ko'rinadi
> ```
>
> ## ✅ **TOZALASH — BIR SATR:**
> ```python
> def tozala(s):
>     return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
> ```
> ## 💡 **`" ".join(s.split())` — HAMMA ORTIQCHA BO'SH JOYNI BITTAGA aylantiradi.**
>
> ## ⚠️ **KURS BU MUAMMONI UMUMAN KO'RMAYDI.**

---

## 5. ⭐⭐ Matn uzunligi — hal qiluvchi o'lchov

```python
def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


# ── kursning tartibi ──
bolimlar["kurs_tartibi"] = bolimlar.apply(lambda r: tozala(
    f'{r.course_name} {r.course_technology} {r.course_description} '
    f'{r.section_name} {r.section_description}'), axis=1)

# ── ⭐ bizning tartib: eng muhim matn OLDINDA ──
bolimlar["bizniki"] = bolimlar.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1)

for nom in ["kurs_tartibi", "bizniki"]:
    u = bolimlar[nom].str.len()
    tok = u / 4
    print(f"  {nom:14s} o'rt {int(u.mean()):5d} belgi (~{int(tok.mean()):4d} tok) "
          f"· 256 dan oshgan: {(tok > 256).sum()}/{len(u)} "
          f"({(tok>256).mean():.0%})")
```

```
  kurs_tartibi   o'rt  1254 belgi (~ 313 tok) · 256 dan oshgan: 351/680 (52%)
  bizniki        o'rt   377 belgi (~  94 tok) · 256 dan oshgan:   2/680 ( 0%)
```

> ## 💥💥💥 **KURSNING TARTIBIDA MATNLARNING 52% QISMI 256 TOKEN CHEGARASIDAN OSHADI.**
>
> ## 🔑 **YA'NI YARMIDAN KO'PIDA — `section_description` EMBEDDINGGA UMUMAN KIRMAYDI.**
>
> ## 💥 **VA HECH QANDAY OGOHLANTIRISH YO'Q** *(49-modul, 3-dars)*.
>
> ## ⚠️⚠️ **LEKIN HALOL BO'LAYLIK — BIZ BUNI SINAB KO'RDIK, VA NATIJA KUTILGANDEK EMAS:**
> ```
> kurs tartibi (52% kesilgan)  →  aniqlik 7/8
> bizning tartib (0% kesilgan) →  aniqlik 6/8
> ```
> ## 🔑 **QISQAROQ MATN ANIQLIKNI OSHIRMADI.**
>
> ## 💡 **SABAB EHTIMOL:** kursning tartibida `course_description` **oldinda** — u kurs mavzusini **yaxshi tavsiflaydi**, va aynan **shu qism** embeddingga kiradi. Bizning tartibda esa `section_name` oldinda — u **juda qisqa** *(masalan "Conclusion")*.
>
> ## 🏆 **XULOSA:** matn tartibi **muhim**, lekin **"qisqaroq = yaxshiroq" degani emas**. **O'LCHASH SHART.** *(10-darsda batafsil.)*

---

## 6. ⭐ Ma'lumotni ko'rish

```python
pd.set_option("display.max_colwidth", 60)

print("── namuna kurs ──")
print(kurslar.iloc[0][["course_name", "course_technology",
                       "course_topic"]].to_string())
print("\n── namuna bo'lim ──")
print(bolimlar.iloc[0][["course_name", "section_name",
                        "course_technology"]].to_string())

print("\n── bo'limlar soni bo'yicha eng katta kurslar ──")
print(bolimlar.course_name.value_counts().head(5).to_string())
```

> ## 💡 **KURS `pd.set_option("display.max_rows", 106)` ISHLATADI** — barcha 106 kursni ko'rish uchun. Bu — **ma'lumotni tekshirishning yaxshi odati**.

---

## 7. 🇺🇿 O'z ma'lumotingiz bilan ishlashda

```
✅ TEKSHIRISH RO'YXATI:

① Kodirovka         →  cp1252? utf-8? utf-8-sig?
                        pd.read_csv(..., encoding="...")

② Bo'sh qiymatlar   →  df.isna().sum()
                        💥 metadata'ga NaN yozib bo'lmaydi

③ Boshqaruv belgi   →  \r · \n · \t
                        →  tozala() funksiyasi

④ ⭐ MATN UZUNLIGI  →  256 token chegarasidan oshadimi?
                        →  o'lchang va TARTIBNI sinang

⑤ Turkumlar         →  value_counts() — notekis taqsimotmi?

⑥ Dublikatlar       →  df.duplicated().sum()
```

> ## 🏆 **④ — ENG KO'P E'TIBORSIZ QOLDIRILADIGAN, LEKIN ENG MUHIM.**

---

## 8. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun `encoding="cp1252"`?

**M2.** Nechta kurs va nechta bo'lim bor?

**M3.** Qancha `\r` belgisi topildi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Faylda **Windows-ga xos belgilar** *(`0x92` = `'`)* bor. UTF-8 bilan ## 💥 `UnicodeDecodeError`.

**M2.** ## **106 kurs** · **680 bo'lim** *(bo'limlar faylida 105 noyob kurs)*.

**M3.** ## **3848 ta** *(3009 + 839)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Ma'lumot sifatini to'liq tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

kurslar = pd.read_csv("course_descriptions.csv", encoding="cp1252")
bolimlar = pd.read_csv("course_section_descriptions.csv", encoding="cp1252")

print("═══ SHAKL ═══")
print(f"  kurslar : {kurslar.shape}")
print(f"  bo'limlar: {bolimlar.shape}")
print(f"  noyob kurs (bo'limlarda): {bolimlar.course_id.nunique()}")

print("\n═══ BO'SH QIYMATLAR ═══")
for d, nom in [(kurslar, "kurslar"), (bolimlar, "bo'limlar")]:
    bosh = d.isna().sum()[lambda x: x > 0]
    print(f"  {nom}: {dict(bosh) if len(bosh) else 'yo‘q ✅'}")

print("\n═══ DUBLIKATLAR ═══")
print(f"  kurslar : {kurslar.duplicated().sum()}")
print(f"  bo'limlar: {bolimlar.duplicated().sum()}")
uid = bolimlar.course_id.astype(str) + "-" + bolimlar.section_id.astype(str)
print(f"  noyob ID: {uid.nunique()}/{len(bolimlar)} "
      f"{'✅' if uid.nunique() == len(bolimlar) else '💥'}")

print("\n═══ BOSHQARUV BELGILARI ═══")
for u in ["course_description", "section_description",
          "course_description_short"]:
    if u not in bolimlar:
        continue
    cr = bolimlar[u].map(lambda s: str(s).count("\r")).sum()
    nl = bolimlar[u].map(lambda s: str(s).count("\n")).sum()
    print(f"  {u:26s} \\r={cr:5d}  \\n={nl:4d}")

print("\n═══ TURKUMLAR ═══")
print(bolimlar.course_technology.value_counts().to_string())
print(f"\n  eng ko'p / eng kam = "
      f"{bolimlar.course_technology.value_counts().iloc[0] / bolimlar.course_technology.value_counts().iloc[-1]:.0f}×")
```

</details>

**M5.** ⭐⭐ Matn uzunligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
MAKS = model.max_seq_length
print(f"model chegarasi: {MAKS} token\n")


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


VARIANTLAR = {
    "kurs tartibi": lambda r: (f'{r.course_name} {r.course_technology} '
                               f'{r.course_description} {r.section_name} '
                               f'{r.section_description}'),
    "bizniki": lambda r: (f'{r.section_name}. {r.course_name}. '
                          f'{r.course_technology}. {r.section_description}'),
    "faqat bo'lim": lambda r: f'{r.section_name}. {r.section_description}',
    "faqat nomlar": lambda r: f'{r.section_name}. {r.course_name}',
}

for nom, f in VARIANTLAR.items():
    u = bolimlar.apply(lambda r: len(tozala(f(r))), axis=1)
    tok = u / 4
    oshgan = int((tok > MAKS).sum())
    kesilgan = float((tok - MAKS).clip(lower=0).sum())
    print(f"  {nom:16s} o'rt {int(u.mean()):5d} belgi (~{int(tok.mean()):4d} tok)")
    print(f"  {'':16s} oshgan {oshgan:3d}/{len(u)} ({oshgan/len(u):5.0%}) · "
          f"kesilgan ~{int(kesilgan):,} token ({kesilgan/tok.sum():.0%})")
```

```
  kurs tartibi     o'rt  1254 belgi (~ 313 tok)
                   oshgan 351/680 ( 52%)
  bizniki          o'rt   377 belgi (~  94 tok)
                   oshgan   2/680 (  0%)
```

## 💥 **KURSNING TARTIBIDA 52% MATN KESILADI** — va **hech qanday ogohlantirish yo'q**.

## ⚠️ **LEKIN 10-DARSDA KO'RAMIZ:** kesilish **aniqlikni pasaytirmadi**. Sabab — kesilgan qism **kamroq muhim** edi.

</details>

**M6.** ⭐ Tozalash funksiyasini yozing va ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())


xom = bolimlar.section_description
toza = xom.map(tozala)

print(f"xom  : {xom.str.len().sum():,} belgi")
print(f"toza : {toza.str.len().sum():,} belgi")
print(f"tejaldi: {xom.str.len().sum() - toza.str.len().sum():,} belgi "
      f"({1 - toza.str.len().sum()/xom.str.len().sum():.1%})")
print(f"       ≈ {(xom.str.len().sum() - toza.str.len().sum())//4:,} token")

print("\nnamuna:")
print(" xom :", repr(xom.iloc[0][-56:]))
print(" toza:", repr(toza.iloc[0][-56:]))
```

## 💡 **TEJALGAN TOKENLAR — 256 TOKEN CHEGARASIDA HAR BIRI QIMMAT.**

</details>

---

## 📌 Xulosa

```python
pd.read_csv("course_descriptions.csv", encoding="cp1252")   # 💥 SHART


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
```

```
📊 106 kurs · 680 bo'lim · 105 noyob kurs (bittasida bo'lim yo'q)
💥 encoding="cp1252" — UTF-8 bilan UnicodeDecodeError
💥 3848 ta \r belgisi — tokenlarni behuda yeydi
⚠️ course_instructor_quote — 20 ta bo'sh (metadata'da NaN muammosi)
⚠️ python 259 · r 11 → 23× notekis taqsimot

💥💥 kurs tartibi: matnlarning 52% qismi 256 token chegarasidan OSHADI
     bizning tartib: 0%
     ⚠️ LEKIN aniqlik OSHMADI (7/8 → 6/8) — 10-darsda batafsil
```

> ## 🏆 **XULOSA: MATN TARTIBI MUHIM, LEKIN "QISQAROQ = YAXSHIROQ" DEGANI EMAS. O'LCHANG.**

---

⬅️ [2-dars. Muammo](02-Case-Study-Problem.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Ma'lumotni tayyorlash](04-Data-Preprocessing.md)
