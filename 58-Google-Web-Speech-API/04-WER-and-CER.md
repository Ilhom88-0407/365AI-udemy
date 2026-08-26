# 4-dars. Baholash metrikalari: WER va CER ⭐⭐

## 🎬 Boshlashdan oldin

> **"`the meeting is at nine o'clock tomorrow` → `... yesterday`. WER = 0.1429. Endi `the` ni o'chiring: WER = 0.1429. Bir xil ball. Biri uchrashuvni buzadi, ikkinchisi hech narsani."**

---

## 1. Ta'rif

**WER** *(Word Error Rate)* — noto'g'ri tanilgan **so'zlar** ulushi.
**CER** *(Character Error Rate)* — noto'g'ri tanilgan **belgilar** ulushi.

```
                S + I + D
        WER = ─────────────
                    N

   S — substitution  (almashtirish)  : "cat" -> "bat"
   I — insertion     (qo'shish)      : "cat" -> "the cat"
   D — deletion      (o'chirish)     : "cat" -> ""
   N — havoladagi (ground truth) so'zlar soni
```

> ## 🔑 **N — GIPOTEZANING EMAS, HAVOLANING UZUNLIGI.** ## Bu — keyinroq ko'radigan **eng katta tuzoqning** ildizi.

### 📐 Levenshtein masofasi

WER — bu **so'z darajasidagi** Levenshtein masofasi, `N` ga bo'lingan.
CER — **belgi darajasidagi**, xuddi shu narsa.

```
    havola:   the  meeting  is  at  nine  o'clock  tomorrow
                                              ▲
    gipoteza: the  meeting  is  at  nine  o'clock  yesterday
                                              │
                                        1 ta almashtirish
                                        7 ta so'zdan
                                        WER = 1/7 = 0.1429
```

---

## 2. 💥 Tuzoq № 1: WER **1.0 dan katta** bo'lishi mumkin

```python
from jiwer import wer

ref = "hello"
hyp = "hello world how are you doing today"
print(f"WER = {wer(ref, hyp):.4f}")
```

```
WER = 6.0000        ← 600% !
```

> ## 💥 **CHUNKI `I = 6`, `N = 1`.** ## Formula maxrajida **havola** turadi, gipoteza emas. ## ## ⚠️ **XULOSA:** WER ni *"foiz"* deb atash — **noto'g'ri**. ## U **0 dan cheksizgacha** bo'ladigan **nisbat**.

| Nima deb atash | To'g'rimi |
|---|---|
| *"WER 33% — ya'ni 33% so'z xato"* | ## ⚠️ **odatda to'g'ri**, lekin kafolatlanmagan |
| *"aniqlik = 1 − WER"* | ## 💥 **noto'g'ri** — manfiy chiqishi mumkin |
| *"WER — xato nisbati"* | ## ✅ **to'g'ri** |

> ## ⚠️ **KURSDAGI NOANIQLIK:** ## Kurs *"WER 0.3390, ya'ni so'zlarning taxminan **40%** i noto'g'ri"* deydi. ## ## 💥 **0.3390 → 34%, 40% emas.** ## Bu — og'zaki xato, lekin **raqamni o'zingiz tekshirish** odati shu yerdan boshlanadi.

---

## 3. 💥💥 Tuzoq № 2: WER **ma'noni bilmaydi**

```python
ref = "the meeting is at nine o'clock tomorrow"

cases = [
    ("mukammal",             "the meeting is at nine o'clock tomorrow"),
    ("bitta artikl tushdi",  "meeting is at nine o'clock tomorrow"),
    ("MA'NO TESKARI",        "the meeting is at nine o'clock yesterday"),
    ("MA'NO TESKARI (raqam)","the meeting is at five o'clock tomorrow"),
    ("faqat imlo",           "the meting is at nine oclock tomorow"),
]
for name, hyp in cases:
    print(f"{name:24s} WER {wer(ref, hyp):.4f}  CER {cer(ref, hyp):.4f}")
```

### 📊 Natija

| Holat | WER | CER | Amaliy oqibat |
|---|---|---|---|
| Mukammal | 0.0000 | 0.0000 | — |
| ## Bitta artikl tushdi | ## **0.1429** | 0.1026 | ## ✅ **hech narsa** |
| ## `tomorrow` → `yesterday` | ## **0.1429** | 0.2051 | ## 💥 **uchrashuvni o'tkazib yuborasiz** |
| ## `nine` → `five` | ## **0.1429** | ## ⭐ **0.0513** | ## 💥 **4 soat kech qolasiz** |
| Faqat imlo xatosi | ## 💥 **0.4286** | ## ⭐ **0.0769** | ## ✅ **o'qish mumkin** |

> ## 💥💥💥 **UCHTA BUTUNLAY BOSHQA VAZIYAT — BIR XIL WER 0.1429.**
>
> ## 💥 **VA ENG XAVFSIZ XATO (`nine`→`five` — 1 harf) ENG PAST CER GA EGA: 0.0513.**
>
> ## ## 🔑 **WER VA CER — MA'NO EMAS, SHAKL METRIKALARI.**

### ⭐ Va e'tibor bering — CER va WER **teskari** ishlaydi

| Xato turi | WER | CER |
|---|---|---|
| Imlo xatolari *(`meting`, `oclock`)* | ## 💥 **0.4286** | ## ⭐ **0.0769** |
| Ma'no o'zgarishi *(`yesterday`)* | ## ⭐ **0.1429** | ## 💥 **0.2051** |

> ## 💡 **IKKALASINI BIRGA O'QING:** ## **WER yuqori + CER past** → imlo/format muammosi, ma'no saqlangan. ## **WER past + CER yuqori** → kam so'z, lekin **muhim** so'zlar buzilgan.

---

## 4. ⭐⭐ Nima uchun bu metrikalar baribir ishlatiladi?

| Sabab | Izoh |
|---|---|
| ## ⭐ **Bitta raqam** | Ikki modelni **taqqoslash** oson |
| ## ⭐ **Ma'lumotsiz ishlaydi** | Faqat matn kerak, model **qora quti** bo'lishi mumkin |
| ## ⭐ **Standart** | Barcha ilmiy maqolalar shuni beradi → **taqqoslanadi** |
| ## ⭐ **Optimallash mumkin** | Trening jarayonida **kuzatiladi** |

> ## ✅ **KURS TO'G'RI AYTADI:** ## *"Ular asosan modelni **o'qitish** bosqichida ishlatiladi."* ## ## 🔑 Bu — **nisbiy** taqqoslash uchun mo'ljallangan asbob: ## *"A modeli B dan yaxshiroqmi?"*, ## *"Bugungi o'zgarish natijani buzdimi?"*

### 💥 Va nima uchun **yolg'iz** ishlatilmasligi kerak

| Savol | WER javob beradimi |
|---|---|
| *"Modelim yaxshilandimi?"* | ## ✅ **ha** |
| *"Transkript o'qishga yaroqlimi?"* | ## ⚠️ **taxminan** |
| *"Muhim ma'lumot to'g'ri chiqdimi?"* | ## 💥 **yo'q** |
| *"Foydalanuvchi mamnun bo'ladimi?"* | ## 💥 **yo'q** |

---

## 5. ⭐ Amaliy metrikalar — WER dan tashqari

### ① **Kalit so'z bo'yicha aniqlik**

Faqat **muhim** so'zlarni tekshiramiz:

```python
def kalit_soz_recall(havola, gipoteza, kalitlar):
    """Muhim so'zlarning qanchasi transkriptga tushdi?"""
    g = gipoteza.lower()
    topilgan = [k for k in kalitlar if k.lower() in g]
    return len(topilgan) / len(kalitlar), topilgan
```

```python
kalitlar = ["nine", "o'clock", "tomorrow", "meeting"]
r, t = kalit_soz_recall(ref, "the meeting is at nine o'clock yesterday", kalitlar)
print(f"recall = {r:.2f}   topilgan = {t}")
```

```
recall = 0.75   topilgan = ["nine", "o'clock", "meeting"]
```

> ## ⭐ **`tomorrow` YO'Q — VA BU DARROV KO'RINADI.** ## WER buni **artikl xatosidan ajratmagan** edi.

### ② **Raqamlar va sanalar bo'yicha aniqlik**

```python
import re

def raqam_aniqlik(havola, gipoteza):
    """Raqamlar to'g'ri tanildimi?"""
    r = re.findall(r"\d+", havola)
    g = re.findall(r"\d+", gipoteza)
    if not r:
        return None
    return sum(1 for x in r if x in g) / len(r)
```

> ## 💡 **TELEFON RAQAMI, NARX, SANA** — ## bularda **bitta raqam** butun natijani buzadi, ## lekin WER ga ta'siri **1/N** ga teng.

### ③ **Normallashtirilgan WER**

Formatga bog'liq farqlarni **oldin olib tashlaymiz**:

```python
import re

def normallash(s):
    s = " ".join(s.split())            # \n va ortiqcha probellar
    s = s.replace("’", "'")       # ’ -> '
    s = s.lower()                      # katta/kichik harf
    s = re.sub(r"[^\w\s']", " ", s)    # tinish belgilari
    return " ".join(s.split())


def toza_wer(havola, gipoteza):
    return wer(normallash(havola), normallash(gipoteza))
```

> ## ⭐ **KEYINGI DARSDA BU FUNKSIYA WER NI 0.3390 DAN 0.0328 GA TUSHIRADI.** ## Ya'ni xatolarning **90% i shakl, ma'no emas** ekan.

---

## 6. 🔬 `jiwer` ichida nima bor?

```python
from jiwer import process_words

o = process_words(havola, gipoteza)
print(f"S={o.substitutions}  I={o.insertions}  D={o.deletions}  H={o.hits}")
print(f"WER={o.wer:.4f}  MER={o.mer:.4f}  WIL={o.wil:.4f}")
```

| Metrika | Formula | Nima yaxshi |
|---|---|---|
| **WER** | `(S+I+D) / N` | Standart |
| ## **MER** | `(S+I+D) / (S+D+I+H)` | ## ⭐ **har doim `[0,1]`** ichida |
| **WIL** | `1 − H²/(N·M)` | Ikkala tomonni hisobga oladi |
| **WIP** | `1 − WIL` | *"Word Information Preserved"* |

> ## 💡 **`MER` (Match Error Rate) — WER NING "1.0 DAN OSHISH" MUAMMOSI YO'Q VERSIYASI.** ## Ko'p hollarda hisobot uchun **undan foydalanish yaxshiroq**.

### ⭐ Va eng foydalisi — `alignments`

```python
for ch in o.alignments[0]:
    if ch.type == "equal":
        continue
    r = " ".join(o.references[0][ch.ref_start_idx:ch.ref_end_idx])
    h = " ".join(o.hypotheses[0][ch.hyp_start_idx:ch.hyp_end_idx])
    print(f"{ch.type:12s} {r!r} -> {h!r}")
```

> ## 🏆 **BU — QAYSI SO'Z QAYSIGA ALMASHGANINI KO'RSATADI.** ## Bitta raqamdan **yuz marta** foydaliroq. ## Keyingi darsda undan to'liq foydalanamiz.

---

## 7. Qanday qilib WER ni **halol** hisoblash kerak

```
┌─────────────────────────────────────────────────────────────┐
│ ① Ground truth ni TEKSHIRING                                │
│    — o'zi to'g'rimi? kim yozgan? qachon?                    │
│                                                              │
│ ② Normallashtirish qoidasini E'LON QILING                   │
│    — katta harf? tinish belgilari? raqamlar so'z bilanmi?   │
│                                                              │
│ ③ IKKALA tomonni bir xil normallashtiring                   │
│                                                              │
│ ④ WER + CER + MER ni birga bering                           │
│                                                              │
│ ⑤ Xatolarning RO'YXATINI ko'rsating (alignments)            │
│                                                              │
│ ⑥ Kalit so'zlar aniqligini ALOHIDA o'lchang                 │
└─────────────────────────────────────────────────────────────┘
```

> ## ⚠️ **NORMALLASHTIRISHNI E'LON QILMASDAN WER BERISH** ## — ilmiy ishda ham, hisobotda ham **noto'g'ri**. ## ## 💥 Bir xil model bir xil faylda ## **0.3390** yoki **0.0328** ko'rsatishi mumkin — ## faqat normallashtirishga qarab.

---

## 🎯 Nazorat savollari

1. WER 1.0 dan katta bo'lishi mumkinmi? Nega?
2. `tomorrow → yesterday` va `the` ni o'chirish — nega bir xil WER?
3. WER yuqori, CER past bo'lsa — bu nimani anglatadi?
4. `MER` ning `WER` dan qanday afzalligi bor?
5. Nima uchun normallashtirish qoidasini e'lon qilish shart?
6. Kurs WER 0.3390 ni qanday izohladi va bunda qanday xato bor?

<details>
<summary>Javoblar</summary>

1. **Ha.** Maxrajda **havola** uzunligi `N` turadi. `ref="hello"`, `hyp="hello world how are you doing today"` → `I=6`, `N=1` → **WER = 6.0**.
2. Ikkalasi ham **bitta** so'z operatsiyasi (biri almashtirish, biri o'chirish), `N=7`. WER **ma'noni bilmaydi** — u faqat **operatsiyalarni sanaydi**.
3. **Imlo/format muammosi, ma'no saqlangan.** `the meting is at nine oclock tomorow` → WER 0.4286, CER 0.0769. Har bir so'z "xato", lekin har biri **bir harfga** xato.
4. `MER = (S+I+D)/(S+D+I+H)` — maxrajda **hamma** operatsiya turadi, shuning uchun natija har doim **`[0,1]`** ichida. Hisobotda chalkashlik kamroq.
5. Bir xil model bir xil faylda normallashtirishga qarab **0.3390** yoki **0.0328** ko'rsatishi mumkin — **10× farq**. Qoidasiz raqam **taqqoslab bo'lmaydi**.
6. Kurs *"0.3390 — ya'ni taxminan **40%** so'z xato"* dedi. **0.3390 → 34%.** Fikr to'g'ri, raqam noto'g'ri.

</details>

---

⬅️ [3-dars](03-SpeechRecognition-Google-API.md) · 🏠 [Modul](README.md) · ➡️ [5-dars](05-Calculating-WER-CER-in-Python.md)
