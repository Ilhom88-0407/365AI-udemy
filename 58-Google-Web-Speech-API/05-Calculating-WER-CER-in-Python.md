# 5-dars. Python'da WER va CER ni hisoblash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kursning WER i — 0.3390. Bizniki ham 0.3390. Keyin ground truth'dagi ikkita `\n` ni probelga almashtirdik: 0.2951. Bitta ham harf o'zgarmagan."**

---

## 1. Kursning kodi

```python
from jiwer import wer, cer

ground_truth = """My name is Ivan and I am excited to have you as part of our learning community!
Before we get started, I’d like to tell you a little bit about myself. I’m a sound engineer turned data scientist,
curious about machine learning and Artificial Intelligence. My professional background is primarily in media production,
with a focus on audio, IT, and communications"""

calculated_wer = wer(ground_truth, transcribed_text)
calculated_cer = cer(ground_truth, transcribed_text)
print(f"Word Error Rate (WER): {calculated_wer:.4f}")
print(f"Character Error Rate (CER): {calculated_cer:.4f}")
```

### 📊 Bizning natija

```
Word Error Rate (WER): 0.3390          ← kurs: 0.3390  ✅ AYNAN BIR XIL
Character Error Rate (CER): 0.0801     ← kurs: 0.0884  ⚠️ farq bor
```

> ## ✅ **WER AYNAN MOS TUSHDI.** ## Bir yil o'tgan, boshqa kompyuter, boshqa `jiwer` versiyasi — ## va Google **o'sha raqamni** berdi.
>
> ## ⚠️ **CER ESA 0.0083 GA FARQ QILADI.** ## Sabab — quyida.

---

## 2. 💥 Kursning transkripti bizникidan **boshqacha** edi

Kurs videosi transkriptni tahlil qiladi va aytadi:

> *"`term` so'zi to'g'ri so'z o'rniga ishlatilgan, ## `machine learning **in** artificial intelligence` da `in` noto'g'ri."*

**Bizning transkriptda esa:**

```
... a sound engineer turn data scientist ...          ← "turn", "term" emas
... machine learning and artificial intelligence ...  ← "and", "in" emas
... a focus on audio it and Communications            ← "it"
```

| So'z | Kursda | ## Bizda |
|---|---|---|
| `turned` | ## `term` | ## `turn` |
| `and` | ## `in` | ## ✅ **`and`** *(to'g'ri!)* |

> ## 🔑🔑 **BIR XIL FAYL. BIR XIL API. BOSHQA JAVOB.**
>
> ## ⭐ **VA BIZNIKI YAXSHIROQ:** `and` to'g'ri tanildi. ## Google modeli **o'sha vaqtdan beri yangilangan**.
>
> ## ## 💡 **VA MANA NEGA CER FARQ QILADI:** ## `term`/`turn` — bir xil so'z uzunligi (WER ga ta'siri bir xil), ## lekin **boshqa harflar** (CER ga ta'siri **boshqa**).

> ## ⚠️ **AMALIY XULOSA:** ## Bulutli API ga asoslangan natijalar **eskiradi**. ## Testlaringizda **qattiq kodlangan WER** ni kutmang — ## chegara (`< 0.40`) ishlating.

---

## 3. 💥💥💥 ENG KATTA TOPILMA: `\n` WER ni buzadi

Kursning `ground_truth` matni — **ko'p qatorli**. `jiwer` esa matnni **probel bo'yicha** bo'ladi.

```python
from jiwer import process_words

o = process_words(ground_truth, transcribed_text)
for w in o.references[0]:
    if "\n" in w:
        print(repr(w))
```

```
'scientist,\ncurious'
'production,\nwith'
```

> ## 💥💥 **`jiwer` BULARNI BITTA SO'Z DEB HISOBLAYDI.**
>
> ## ## `'scientist,\ncurious'` — bir so'z. ## `'production,\nwith'` — bir so'z.

### 🔬 Faqat probellarni tekislaymiz

```python
GT_toza = " ".join(ground_truth.split())     # ⭐ hech qanday boshqa o'zgarish yo'q

print(f"tokenlar: xom {len(process_words(ground_truth, hyp).references[0])}  "
      f"toza {len(process_words(GT_toza, hyp).references[0])}")
print(f"WER xom  = {wer(ground_truth, hyp):.4f}")
print(f"WER toza = {wer(GT_toza, hyp):.4f}")
print(f"CER xom  = {cer(ground_truth, hyp):.4f}")
print(f"CER toza = {cer(GT_toza, hyp):.4f}")
```

```
tokenlar: xom 59  toza 61
WER xom  = 0.3390       ← kurs shu raqamni ko'rsatadi
WER toza = 0.2951
CER xom  = 0.0801
CER toza = 0.0720
```

| | Tokenlar | WER | CER |
|---|---|---|---|
| Xom *(kurs)* | ## 💥 **59** | ## 💥 **0.3390** | 0.0801 |
| Probel tekislangan | ## ✅ **61** | ## ⭐ **0.2951** | 0.0720 |
| **Farq** | +2 | ## 🏆 **−13%** | −10% |

> ## 🏆🏆🏆 **BITTA HAM HARF O'ZGARMADI — WER 13% GA TUSHDI.**
>
> ## 💥 **YA'NI KURSNING BOSH RAQAMI QISMAN — MATN FORMATLASH ARTEFAKTI.**
>
> ## ## 🔑 **SABAB:** `'scientist,\ncurious'` hech qachon ## `'curious'` ga mos kelmaydi → **majburiy almashtirish**. ## Ikkita bunday token = ikkita **bepul xato**.

---

## 4. ⭐⭐⭐ To'liq normallashtirish zanjiri

Endi bosqichma-bosqich boramiz va **har bir qadamning narxini** o'lchaymiz:

```python
import re

def norm(s, ws=False, apos=False, lower=False, punct=False):
    if ws:
        s = " ".join(s.split())            # ① \n va ortiqcha probel
    if apos:
        s = s.replace("’", "'")            # ② tipografik apostrof
    if lower:
        s = s.lower()                      # ③ katta harf
    if punct:
        s = " ".join(re.sub(r"[^\w\s']", " ", s).split())   # ④ tinish belgilari
    return s


steps = [
    ("0. xom (kurs)",             {}),
    ("1. + probel/\\n tekislandi", dict(ws=True)),
    ("2. + apostrof birxil",      dict(ws=True, apos=True)),
    ("3. + kichik harf",          dict(ws=True, apos=True, lower=True)),
    ("4. + tinish belgilari",     dict(ws=True, apos=True, lower=True, punct=True)),
]
for name, kw in steps:
    r, h = norm(GT, **kw), norm(HYP, **kw)
    print(f"{name:30s} WER {wer(r,h):.4f}  CER {cer(r,h):.4f}  "
          f"xato so'z {round(wer(r,h)*59):2d}")
```

### 📊 Natija

| Qadam | WER | CER | Xato so'z |
|---|---|---|---|
| **0.** Xom *(kurs)* | ## 💥 **0.3390** | 0.0801 | ## **20** |
| **1.** + probel / `\n` | 0.2951 | 0.0720 | 17 |
| **2.** + apostrof birxil | 0.2623 | 0.0665 | 15 |
| **3.** + kichik harf | 0.1639 | 0.0388 | 10 |
| ## **4.** + tinish belgilari | ## 🏆 **0.0328** | ## 🏆 **0.0170** | ## 🏆 **2** |

```
   WER
  0.34 ┤ ████████████████████  0.3390  xom
  0.30 ┤ █████████████████     0.2951  + \n
  0.26 ┤ ███████████████       0.2623  + apostrof
  0.16 ┤ ██████████            0.1639  + kichik harf
  0.03 ┤ ██                    0.0328  + tinish belgilari
       └──────────────────────────────────────────────►
                                        10.3× yaxshilanish
```

> ## 🏆🏆🏆 **0.3390 → 0.0328 — 10.3 MARTA.**
>
> ## 💥 **VA MODEL BIR HARFNI HAM BOSHQACHA TANIMADI.**

### 💥 Nihoyat — **haqiqiy** xatolar

```python
o = process_words(norm(GT, ws=1, apos=1, lower=1, punct=1),
                  norm(HYP, ws=1, apos=1, lower=1, punct=1))
for ch in o.alignments[0]:
    if ch.type != "equal":
        print(f"{ch.type}: {o.references[0][ch.ref_start_idx:ch.ref_end_idx]}"
              f" -> {o.hypotheses[0][ch.hyp_start_idx:ch.hyp_end_idx]}")
```

```
substitute: 'ivan'   -> 'yvonne'
substitute: 'turned' -> 'turn'
```

> ## 🏆 **61 TA SO'ZDAN ATIGI IKKITASI XATO.**
>
> ## ① **`ivan` → `yvonne`** — ism *(quyida alohida gaplashamiz)*
> ## ② **`turned` → `turn`** — `-ed` qo'shimchasi yo'qolgan
>
> ## ## 🔑 **YA'NI GOOGLE'NING HAQIQIY ANIQLIGI — 96.7%, 66.1% EMAS.**

---

## 5. ⭐⭐ Ishonch balli qanchalik to'g'ri?

```
Google aytdi     : 0.9095
Haqiqiy aniqlik  : 0.6610   (xom WER bo'yicha)         💥 12.5 punkt farq... teskari tomonga
Haqiqiy aniqlik  : 0.9672   (normallashtirilgan)       ⭐ 5.8 punkt farq
```

> ## 🏆 **ISHONCH BALLI (0.9095) HAQIQATGA (0.9672) YAQIN.**
>
> ## 💥 **LEKIN FAQAT SIZ TO'G'RI O'LCHASANGIZ.** ## Xom WER bilan taqqoslasangiz, model ## *"o'ta ishonchli"* ko'rinadi — ## bu esa **sizning o'lchov xatoyingiz**, modelniki emas.

| Nima | Qiymat |
|---|---|
| Google ishonchi | 0.9095 |
| Normallashtirilgan aniqlik | ## ⭐ **0.9672** |
| Farq | ## ✅ **−5.8 punkt** *(ehtiyotkor baho)* |

> ## 💡 **MODEL O'ZINI BIR OZ KAMSITIB BAHOLAGAN.** ## Bu — **yaxshi kalibratsiya**. ## Aksincha bo'lsa *(ishonch yuqori, aniqlik past)* — ## bu **xavfli** model bo'lardi.

---

## 6. 💥💥💥 "Ivan" mi, "Yvonne" mi? — **ground truth ham xato bo'lishi mumkin**

Kursning `ground_truth.txt` faylida: **`My name is Ivan`**
Google qaytardi: **`my name is Yvonne`**
Kurs muallifi videoda aytadi: *"Yvonne — bu mening ismim, u `y-v-o-n-n-e` deb yozdi."*

> ## 💥💥💥 **YA'NI GROUND TRUTH FAYLINING O'ZI XATO.**
>
> ## Muallifning ismi — **Yvonne**. ## `ground_truth.txt` da esa **Ivan** yozilgan. ## ## 🔑 **VA API TO'G'RI TANIGAN — LEKIN "XATO" DEB SANALGAN.**

### 🔬 Uchta manba, uchta javob

| Manba | Natija |
|---|---|
| Kurs `ground_truth.txt` | `Ivan` |
| Kurs videosidagi og'zaki gap | ## ⭐ **`Yvonne`** |
| Google Web Speech API | ## ⭐ **`Yvonne`** |
| Whisper `pipeline()` *(60-modul)* | ## ⭐ **`Yvonne`** |
| Whisper `generate()` *(60-modul)* | ## 💥 **`Iván`** |

> ## ⚠️ **ISMLAR — ASR NING ENG ZAIF NUQTASI.** ## Til modeli ismlarni **kontekstdan** taxmin qiladi, ## va ismlar **kam uchraydi** → **ehtimollik past**.

> ## 🏆🏆 **VA MANA ENG MUHIM DARS:**
>
> ## ## 💥 **WER 0.0328 NING YARMI — GROUND TRUTH XATOSI.**
>
> ## Ya'ni model **ikkita** emas, aslida **bitta** xato qilgan: ## `turned` → `turn`. ## ## ⭐ **HAQIQIY ANIQLIK: 60/61 = 98.4%.**

### ✅ Nima qilish kerak

```
┌──────────────────────────────────────────────────────┐
│  WER yuqori chiqdi                                   │
│         ↓                                            │
│  ① Xatolar RO'YXATINI chiqaring (alignments)        │
│         ↓                                            │
│  ② Har bir xatoni QO'LDA ko'ring                    │
│         ↓                                            │
│  ③ Savol bering: "havola to'g'rimi?"                │
│         ↓                                            │
│  ④ Ba'zan MODEL to'g'ri, HAVOLA xato                │
└──────────────────────────────────────────────────────┘
```

---

## 7. 💥 `ground_truth.txt` faylining o'zi ham tuzoq

```python
raw = open("ground_truth.txt", "rb").read()
print("bayt:", len(raw))
print(raw[:20])
raw.decode("utf-8")
```

```
bayt: 373
b'"""My name is Ivan a'
UnicodeDecodeError: 'utf-8' codec can't decode byte 0x92 in position 109
```

| Muammo | Tafsilot |
|---|---|
| ## 💥 Fayl `"""` **bilan boshlanadi** | Python sintaksisi **matnga qo'shib yuborilgan** |
| ## 💥 `UTF-8` da **o'qilmaydi** | `0x92` — `cp1252` dagi `’` |
| ## ⚠️ Oxirida `\r\n` | Windows qator uzilishi |

```python
t = open("ground_truth.txt", encoding="cp1252").read()
print(repr(t[:5]), "...", repr(t[-5:]))
print("ASCII bo'lmagan:", sorted({hex(ord(c)) for c in t if ord(c) > 127}))
```

```
'"""My' ... '"""\r\n'
ASCII bo'lmagan: ['0x2019']       # ’ RIGHT SINGLE QUOTATION MARK
```

> ## ⭐ **TO'G'RI O'QISH USULI:**
> ```python
> t = open("ground_truth.txt", encoding="cp1252").read()
> t = t.strip().strip('"')                 # ⭐ """ ni olib tashlash
> t = " ".join(t.split())                  # ⭐ \r\n tekislash
> ```

---

## 8. ⭐ To'liq baholash funksiyasi

```python
import re
from jiwer import wer, cer, process_words


def normallash(s):
    """Formatga bog'liq farqlarni olib tashlaydi."""
    s = " ".join(s.split())
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"')
    s = s.lower()
    s = " ".join(re.sub(r"[^\w\s']", " ", s).split())
    return s


def baho(havola, gipoteza, kalitlar=None):
    """WER/CER ni xom va normallashtirilgan holda, xatolar ro'yxati bilan."""
    n_h, n_g = normallash(havola), normallash(gipoteza)
    o = process_words(n_h, n_g)

    xatolar = []
    for ch in o.alignments[0]:
        if ch.type == "equal":
            continue
        xatolar.append({
            "tur": ch.type,
            "havola": " ".join(o.references[0][ch.ref_start_idx:ch.ref_end_idx]),
            "gipoteza": " ".join(o.hypotheses[0][ch.hyp_start_idx:ch.hyp_end_idx]),
        })

    d = {
        "xom_WER": round(wer(havola, gipoteza), 4),
        "xom_CER": round(cer(havola, gipoteza), 4),
        "toza_WER": round(o.wer, 4),
        "toza_CER": round(cer(n_h, n_g), 4),
        "MER": round(o.mer, 4),
        "so_zlar": len(o.references[0]),
        "S": o.substitutions, "I": o.insertions, "D": o.deletions, "H": o.hits,
        "xatolar": xatolar,
    }
    d["format_ulushi"] = round(
        (d["xom_WER"] - d["toza_WER"]) / d["xom_WER"], 3) if d["xom_WER"] else 0.0

    if kalitlar:
        top = [k for k in kalitlar if normallash(k) in n_g]
        d["kalit_recall"] = round(len(top) / len(kalitlar), 3)
        d["kalit_yo_q"] = [k for k in kalitlar if k not in top]
    return d
```

```python
import json
r = baho(GT, HYP, kalitlar=["machine learning", "artificial intelligence",
                            "media production", "sound engineer"])
print(json.dumps(r, indent=2, ensure_ascii=False))
```

```
{
  "xom_WER": 0.339,
  "xom_CER": 0.0801,
  "toza_WER": 0.0328,
  "toza_CER": 0.017,
  "MER": 0.0328,
  "so_zlar": 61,
  "S": 2, "I": 0, "D": 0, "H": 59,
  "xatolar": [
    {"tur": "substitute", "havola": "ivan",   "gipoteza": "yvonne"},
    {"tur": "substitute", "havola": "turned", "gipoteza": "turn"}
  ],
  "format_ulushi": 0.903,
  "kalit_recall": 1.0,
  "kalit_yo_q": []
}
```

> ## 🏆 **`format_ulushi = 0.903`** ## — ya'ni **xatolarning 90.3% i formatlash**, ma'no emas.
>
> ## 🏆 **`kalit_recall = 1.0`** ## — barcha muhim atamalar **to'g'ri tanildi**.
>
> ## ## 💡 **BU IKKI RAQAM `WER = 0.3390` DAN JUDA KO'P NARSA AYTADI.**

---

## 🎯 Nazorat savollari

1. Kursning WER i 0.3390. Ground truth'dagi `\n` larni probelga almashtirsangiz nima bo'ladi va nega?
2. To'liq normallashtirishdan keyin nechta **haqiqiy** xato qoldi?
3. `ground_truth.txt` faylini `encoding="utf-8"` bilan ochsangiz nima bo'ladi?
4. "Ivan" mi, "Yvonne" mi — kim haq?
5. `format_ulushi` nimani o'lchaydi?
6. Google'ning ishonch balli (0.9095) haqiqatga mos keldimi?

<details>
<summary>Javoblar</summary>

1. WER **0.2951** ga tushadi (−13%). Sabab: `jiwer` probel bo'yicha bo'ladi, shuning uchun `'scientist,\ncurious'` va `'production,\nwith'` — **bitta so'z** deb qaraladi va hech qachon mos kelmaydi. Ikkita **bepul xato**.
2. **Ikkita**: `ivan → yvonne` va `turned → turn`. 61 ta so'zdan. WER 0.3390 → **0.0328** (10.3×).
3. `UnicodeDecodeError` — `0x92` bayti. Fayl `cp1252` da yozilgan, undagi `’` (U+2019). To'g'ri: `encoding="cp1252"`.
4. **Yvonne.** Kurs muallifi videoda o'z ismini shunday aytadi, Google ham, Whisper `pipeline()` ham shunday tanidi. `ground_truth.txt` dagi *"Ivan"* — **havolaning o'zidagi xato**. Ya'ni haqiqiy aniqlik **60/61 = 98.4%**.
5. Xatolarning qancha ulushi **shakl** (katta harf, tinish belgisi, apostrof, `\n`) va qanchasi **ma'no** ekanini. Bizda **0.903** — ya'ni 90% i formatlash.
6. **Ha.** 0.9095 vs haqiqiy 0.9672 — model o'zini **biroz kamsitib** baholagan, bu yaxshi kalibratsiya. Xom WER bilan taqqoslash (0.6610) — **o'lchov xatosi**, model xatosi emas.

</details>

---

⬅️ [4-dars](04-WER-and-CER.md) · 🏠 [Modul](README.md) · ➡️ [59-modul](../59-Background-Noise-and-Spectrograms/README.md)
