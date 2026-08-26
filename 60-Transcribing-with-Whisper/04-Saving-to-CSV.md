# 4-dars. Transkriptlarni CSV ga saqlash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kursning kodi `open(file, mode='w', newline='')` — `encoding` yo'q. Bizning Windows'da standart kodlash `cp1251` chiqdi. Transkriptda bitta `“` bo'lsa — `UnicodeEncodeError`."**

---

## 1. Kursning kodi

```python
import csv

output_file = "transcriptions.csv"

with open(output_file, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["Track Number", "File Name", "Transcription"])
    for number, transcription in enumerate(transcriptions, start=1):
        writer.writerow([number, transcription["file_name"],
                         transcription["transcription"]])
```

> ## ✅ **STRUKTURASI TO'G'RI:** ## `with` bilan ochish, `csv.writer`, sarlavha qatori, `enumerate(start=1)` — ## **hammasi to'g'ri va yaxshi amaliyot**.
>
> ## 💥 **LEKIN BITTA MUHIM NARSA YETISHMAYDI.**

---

## 2. 💥💥 `encoding` yo'q

```python
import io
print(f"Windows standart kodlash: {io.open('x.tmp', 'w').encoding}")
```

```
Windows standart kodlash: cp1251
```

> ## 💥 **BIZNING TIZIMDA `cp1251`.** ## Sizniki `cp1252` yoki `cp1254` bo'lishi mumkin — ## bu **kompyuter sozlamalariga** bog'liq. ## ## 🔑 **Ya'ni bir xil kod turli kompyuterda turlicha ishlaydi.**

### 🔬 Sinaymiz

```python
with io.open("csv_ansi.csv", "w", newline="") as f:
    csv.writer(f).writerow(["1", "Track1.wav", "curious about “AI” — ✅"])
```

```
💥 UnicodeEncodeError: 'charmap' codec can't encode character '✅'
   in position 34: character maps to <undefined>
```

> ## 💥💥 **BUTUN ISH YIQILADI.** ## Va bu — **oxirgi qadamda**, ## siz 10 000 ta faylni transkripsiya qilib bo'lganingizdan **keyin**.

### ⚠️ Whisper chiqishida nima bo'lishi mumkin?

| Belgi | Qayerdan | `cp1251` da |
|---|---|---|
| `’` `“` `”` | ## ⭐ **Whisper o'zi qo'yadi** | ## 💥 **xato** |
| `—` *(tire)* | Whisper | ## 💥 **xato** |
| `é`, `ü`, `ñ` | Chet el ismlari | ## 💥 **xato** |
| Kirill, xitoy | Ko'p tilli audio | ## 💥 **xato** |
| `✅`, emoji | Sizning kodingiz | ## 💥 **xato** |

> ## ⭐ **YECHIM — BIR SO'Z:**
> ```
> with io.open(output_file, "w", encoding="utf-8-sig", newline="") as f:
> ```

---

## 3. ⭐⭐ Nega `utf-8` emas, `utf-8-sig`?

```python
for kod in ["utf-8", "utf-8-sig"]:
    with io.open(f"csv_{kod}.csv", "w", encoding=kod, newline="") as f:
        csv.writer(f).writerow(["raqam", "fayl", "matn"])
    print(f"{kod:12s} boshi: {io.open(f'csv_{kod}.csv','rb').read()[:6]!r}")
```

```
utf-8        boshi: b'raqam,'
utf-8-sig    boshi: b'\xef\xbb\xbfraq'          ⭐ BOM
```

| Kodlash | Python o'qiydi | ## Excel o'qiydi |
|---|---|---|
| `utf-8` | ## ✅ | ## 💥 **belgilarni buzadi** |
| ## **`utf-8-sig`** | ## ✅ | ## 🏆 **to'g'ri ochadi** |
| `cp1251` *(standart)* | ⚠️ | ⚠️ | 

> ## 🔑 **`utf-8-sig` = UTF-8 + BOM** *(3 bayt: `EF BB BF`)*. ## Excel BOM ni ko'rib **"bu UTF-8"** deb tushunadi. ## ## 💥 **BOM siz Excel faylni tizim kodlashida o'qiydi** ## va `’`, `“`, o'zbekcha belgilarni **buzadi**.

> ## ⚠️ **VA `newline=""` — SHART.** ## Usiz Windows'da har qator orasida ## **bo'sh qator** paydo bo'ladi *(`\r\r\n`)*. ## Kurs buni **to'g'ri aytadi**.

---

## 4. ⭐ Qaysi ustunlar kerak?

Kursning uchta ustuni — **minimum**. Amalda kerak bo'ladiganlar:

| Ustun | Nega |
|---|---|
| `raqam` | ✅ Kursda bor |
| `fayl` | ✅ Kursda bor |
| `matn` | ✅ Kursda bor |
| ## `soniya` | ## ⭐ **narx/statistika** |
| ## `so_zlar` | ## ⭐ **bo'sh natijani darrov ko'rsatadi** |
| ## `vaqt_s` | ## ⭐ **sekin fayllarni topish** |
| ## `model` | ## ⭐ **qaysi model bilan?** |
| ## `holat` | ## ⭐ **xatoni yashirmaslik** |
| `sana` | Qachon qilingan |

> ## 💥 **`holat` USTUNI — ENG MUHIMI.** ## Kursning kodida buzuq fayl **butun ishni to'xtatadi**. ## To'g'ri kodda u **`💥 XATO` qatori** bo'lib CSV ga tushadi. ## ## 🔑 **Muvaffaqiyatsizlik ham — ma'lumot.**

---

## 5. ⭐ To'liq versiya

```python
import os, io, csv, time, datetime


def csv_ga_yoz(natijalar, yol="transkriptlar.csv", model="whisper-base",
               qoshib=False):
    """Transkriptlarni Excel ham, Python ham o'qiydigan CSV ga yozadi."""
    ustunlar = ["raqam", "fayl", "soniya", "so_zlar", "vaqt_s",
                "model", "holat", "matn"]
    mavjud = os.path.exists(yol) and qoshib
    sana = datetime.date.today().isoformat()

    with io.open(yol, "a" if qoshib else "w",
                 encoding="utf-8-sig", newline="") as f:     # ⭐ utf-8-sig
        w = csv.DictWriter(f, fieldnames=ustunlar + ["sana"],
                           extrasaction="ignore")            # ⭐ ortiqcha kalitlar
        if not mavjud:
            w.writeheader()
        for i, r in enumerate(natijalar, start=1):
            w.writerow({
                "raqam": i,
                "fayl": r.get("fayl", ""),
                "soniya": r.get("soniya", 0),
                "so_zlar": r.get("so_zlar", len(r.get("matn", "").split())),
                "vaqt_s": r.get("vaqt_s", ""),
                "model": model,
                "holat": r.get("holat", "✅"),
                "matn": r.get("matn", ""),
                "sana": sana,
            })
            f.flush()                                        # ⭐ uzilsa ham saqlanadi
    return yol


def csv_dan_oqi(yol):
    """CSV ni qayta o'qiydi (BOM ni to'g'ri hisobga oladi)."""
    with io.open(yol, encoding="utf-8-sig") as f:            # ⭐ utf-8-sig
        return list(csv.DictReader(f))
```

```python
natijalar = papkani_transkripsiya("Recordings", progress=False)
p = csv_ga_yoz(natijalar)

for r in csv_dan_oqi(p):
    print(f"{r['raqam']:>2} {r['fayl']:12s} {r['soniya']:>5} s "
          f"{r['so_zlar']:>3} so'z  {r['holat']}  {r['matn'][:40]}")
```

### ✅ Haqiqiy natija

```
 1 Track1.wav     6.5 s  14 so'z  ✅  I'm a sound engineer turned data scien
 2 Track2.wav     7.5 s  16 so'z  ✅  My professional background is primaril
 3 Track3.wav     6.5 s  16 so'z  ✅  Over the years, I've developed a stron
 4 Track4.wav    6.53 s  22 so'z  ✅  As a graduate of Sound Engineering, I
 5 Track5.wav    3.57 s  10 so'z  ✅  I believe that nowadays, data is the k
 6 Track6.wav     5.1 s  12 so'z  ✅  Not only can it provide a rational exp
 7 Track7.wav    4.36 s  11 so'z  ✅  But it can also give you efficient met
 8 Track8.wav    6.83 s  22 so'z  ✅  From the website cookies you've been a
```

---

## 6. ⚠️ CSV ning boshqa tuzoqlari

### ① Matnda **vergul** bo'lsa?

```python
csv.writer(f).writerow([1, "a.wav", "Hello, world"])
```

```
1,a.wav,"Hello, world"          ⭐ csv moduli O'ZI qo'shtirnoq qo'yadi
```

> ## ✅ **`csv` MODULI BUNI TO'G'RI HAL QILADI.** ## Qo'lda `f.write(f"{a},{b},{c}\n")` yozmang!

### ② Matnda **qator uzilishi** bo'lsa?

```python
csv.writer(f).writerow([1, "a.wav", "Birinchi qator\nIkkinchi qator"])
```

```
1,a.wav,"Birinchi qator
Ikkinchi qator"                 ⭐ qo'shtirnoq ichida — to'g'ri
```

> ## ⚠️ **LEKIN O'QIYOTGANDA `csv.reader` ISHLATING.** ## `f.readlines()` bilan bu qator **ikkiga bo'linadi**.

### ③ Excel raqamlarni "tuzatadi"

| CSV da | Excel ko'rsatadi |
|---|---|
| `007` | ## 💥 **7** |
| `2024-01-05` | ## 💥 **sana formati** |
| `1E5` | ## 💥 **100000** |

> ## ⭐ **YECHIM:** Excel'da `Ma'lumot → Matndan/CSV dan` ## orqali oching va ustun turini **"Matn"** deb belgilang. ## ## 💡 Yoki `.tsv` *(tab bilan)* ishlating.

### ④ Juda uzun matn

| Chegara | Qiymat |
|---|---|
| Excel hujayrasi | ## ⚠️ **32 767 belgi** |
| CSV faylining o'zi | ## ✅ **cheklovsiz** |
| `csv` moduli maydoni | ## ⚠️ **131 072** *(standart)* |

```python
import csv, sys
csv.field_size_limit(min(sys.maxsize, 2**31 - 1))   # ⭐ uzun matnlar uchun
```

> ## 💡 **1 SOATLIK AUDIO ≈ 9 000 SO'Z ≈ 50 000 BELGI.** ## Bu Excel hujayrasiga **sig'adi**, ## lekin 4 soatlik podkast — **yo'q**.

---

## 7. 🔬 Alternativalar

| Format | Hajm | Excel | Ko'p qatorli matn | Tavsiya |
|---|---|---|---|---|
| ## **CSV** | ⭐ kichik | ## ✅ | ⚠️ qo'shtirnoq bilan | ## ⭐ **oddiy holatlar** |
| TSV | ⭐ kichik | ✅ | ⚠️ | Vergulli matnlar |
| ## **JSONL** | ⚠️ kattaroq | ## 💥 | ## 🏆 **muammosiz** | ## ⭐ **ko'p ma'lumot** |
| Parquet | ## 🏆 eng kichik | 💥 | ✅ | Katta hajm |
| SQLite | ⚠️ | 💥 | ✅ | ## ⭐ **davom ettirish** |

### ⭐ JSONL — uzun matnlar uchun eng xavfsiz

```python
import io, json


def jsonl_ga_yoz(natijalar, yol="transkriptlar.jsonl"):
    with io.open(yol, "w", encoding="utf-8") as f:
        for r in natijalar:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")   # ⭐ ensure_ascii=False
    return yol


def jsonl_dan_oqi(yol):
    with io.open(yol, encoding="utf-8") as f:
        return [json.loads(x) for x in f if x.strip()]
```

```python
p = jsonl_ga_yoz(natijalar)
print(f"{os.path.getsize(p)} bayt · {len(jsonl_dan_oqi(p))} qator")
```

```
1423 bayt · 8 qator
```

> ## 🔑 **`ensure_ascii=False` — MUHIM.** ## Usiz `’` → `’` bo'lib **fayl 2× kattalashadi** ## va o'qishga noqulay bo'ladi.

---

## 🎯 Nazorat savollari

1. Kursning kodida `encoding` yo'q. Nima bo'lishi mumkin?
2. `utf-8` va `utf-8-sig` farqi nima?
3. `newline=""` nima uchun kerak?
4. Transkriptda vergul bo'lsa CSV buziladimi?
5. Qachon CSV o'rniga JSONL ishlatish kerak?

<details>
<summary>Javoblar</summary>

1. Python **tizim standart kodlashini** ishlatadi — bizda **`cp1251`**. Whisper chiqishidagi `’`, `“`, `—` yoki chet el harflari → **`UnicodeEncodeError`** va butun ish yiqiladi. Va bu **oxirgi qadamda** sodir bo'ladi.
2. `utf-8-sig` faylning boshiga **BOM** (`EF BB BF`) qo'shadi. Excel BOM ni ko'rib faylni UTF-8 deb tushunadi. **BOM siz Excel belgilarni buzadi.**
3. Usiz Windows'da `csv` moduli `\r\n` yozadi, fayl esa `\n` ni yana `\r\n` ga aylantiradi → **`\r\r\n`** → har qator orasida **bo'sh qator**. Kurs buni to'g'ri aytadi.
4. **Yo'q** — `csv` moduli maydonni avtomatik qo'shtirnoqqa oladi: `1,a.wav,"Hello, world"`. Lekin qo'lda `f.write(f"{a},{b}")` yozsangiz — **buziladi**.
5. Matn **uzun** yoki **ko'p qatorli** bo'lsa, yoki har bir yozuvda **turli maydonlar** bo'lsa (segmentlar, vaqt belgilari). JSONL da qo'shtirnoq/vergul muammosi **umuman yo'q**. `ensure_ascii=False` ni unutmang.

</details>

---

⬅️ [3-dars](03-Transcribing-Multiple-Files.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Text-to-Speech.md)
