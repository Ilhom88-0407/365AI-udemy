# 2-dars. "Variativlik haqida eslatma" — kursning uy vazifasi ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: Whisper stoxastik, `data` so'zi ba'zan yo'qoladi. Biz 5 marta ishga tushirdik — 5/5 aynan bir xil, `data` har safar joyida. Keyin sababini topdik."**

---

## 1. Kursning eslatmasi

Kurs `60.2` resursida **HTML eslatma** beradi. Uning mazmuni:

> ## 🔑 **KURS AYTADI:**
> ## *"Transkripsiyada muhim so'z yo'q. ## `I'm a sound engineer turned **a** scientist` — ## `data` so'zi **tushib qolgan**."*
>
> ## *"Whisper kabi modellar bir xil faylga ## **turli natija** berishi mumkin, chunki dekodlash jarayoni **stoxastik**."*
>
> ## **Uy vazifasi:** `medium` modelni sinang. ## Ismni to'g'ri tanidimi? `data` paydo bo'ldimi?

---

## 2. 🔬 Birinchi tekshiruv: **bizda `data` bormi?**

```python
for m in ["openai/whisper-tiny", "openai/whisper-base", "openai/whisper-small"]:
    asr = pipeline("automatic-speech-recognition", model=m, device=-1)
    txt = asr(y.copy())["text"]
    print(f"{m}: 'data' {'✅' if 'data' in txt.lower() else '💥 YO`Q'}")
```

```
openai/whisper-tiny : 'data' ✅
openai/whisper-base : 'data' ✅
openai/whisper-small: 'data' ✅
```

> ## 💥 **UCHTA MODELDA HAM `data` JOYIDA.**
>
> ## ## 🔑 **HATTO `tiny` DA HAM** — 37.8 M parametrli eng kichik modelda.

---

## 3. 💥💥 Ikkinchi tekshiruv: **model haqiqatan stoxastikmi?**

```python
import hashlib

for i in range(5):
    t = asr(y.copy())["text"].strip()
    print(f"{i+1}. hash {hashlib.md5(t.encode()).hexdigest()[:8]}  "
          f"WER {wer(NGT, norm(t)):.4f}  'data' {'✅' if 'data' in t.lower() else '💥'}")
```

```
1.  2.64 s  hash 43f6f29c  WER 0.0164  'data' ✅
2.  2.80 s  hash 43f6f29c  WER 0.0164  'data' ✅
3.  2.57 s  hash 43f6f29c  WER 0.0164  'data' ✅
4.  2.57 s  hash 43f6f29c  WER 0.0164  'data' ✅
5.  2.70 s  hash 43f6f29c  WER 0.0164  'data' ✅

→ turli natijalar: 1
```

> ## 💥💥💥 **5/5 — AYNAN BIR XIL HASH.**
>
> ## ## 🔑 **MODEL STOXASTIK EMAS.**

---

## 4. 🏆🏆🏆 **Sabab: dekodlash usuli**

Whisper modelining o'zi — **deterministik funksiya**. Tasodifiylik **dekodlashda** paydo bo'ladi.

```
   MODEL                         DEKODLASH
   ┌──────────────┐             ┌──────────────────────────────┐
   │  transformer │             │  greedy:                     │
   │              │  logits     │    har qadamda ENG YUQORI    │
   │  determinis- │ ──────────► │    ehtimollikni tanla        │
   │  tik         │             │    → DETERMINISTIK ✅        │
   │              │             │                              │
   │              │             │  sampling (temperature > 0): │
   │              │             │    ehtimollikka QARAB TANLA  │
   │              │             │    → TASODIFIY 💥            │
   └──────────────┘             └──────────────────────────────┘
```

### 🔬 Isbotlaymiz — `temperature` ni majburan yoqamiz

```python
for temp in [0.0, 0.2, 0.5, 0.8, 1.0]:
    hashlar = set()
    for i in range(3):
        gk = {"temperature": temp, "do_sample": temp > 0}
        t = asr(y.copy(), generate_kwargs=gk)["text"].strip()
        hashlar.add(hashlib.md5(t.encode()).hexdigest()[:8])
    print(f"temperature={temp}: turli natijalar {len(hashlar)}/3")
```

### 📊 Natija

| `temperature` | Turli natijalar | WER | ## `data` |
|---|---|---|---|
| ## **0.0** *(greedy)* | ## ⭐ **1/3** | ## 🏆 **0.0164** | ## ✅ |
| 0.2 | ⚠️ 2/3 | 0.0328 | ## 💥 **YO'Q** |
| 0.5 | 💥 3/3 | 0.0328 | ## 💥 **YO'Q** |
| 0.8 | 💥 3/3 | ## 💥 **0.0820** | ## 💥 **YO'Q** |
| 1.0 | 💥 3/3 | ## 💥 **0.0820** | ## 💥 **YO'Q** |

> ## 🏆🏆🏆 **BIZ KURSNING XATOSINI QAYTA HOSIL QILDIK.**
>
> ## ## 💥 **`temperature > 0` → natija tasodifiy → `data` YO'QOLADI.**
> ## ## ✅ **`temperature = 0` → natija barqaror → `data` JOYIDA.**

---

## 5. 🔑 Nega kursda `temperature > 0` bo'lgan?

`openai-whisper` paketining `transcribe()` funksiyasi **temperature fallback** ishlatadi:

```python
# openai-whisper ning standart sozlamasi:
temperature = (0.0, 0.2, 0.4, 0.6, 0.8, 1.0)
compression_ratio_threshold = 2.4
logprob_threshold = -1.0
no_speech_threshold = 0.6
```

**Mantiq:**

```
   ① temperature=0.0 bilan urin
        ↓
   ② natija "shubhali"mi?
      · compression_ratio > 2.4   (takrorlanish)
      · o'rtacha logprob < -1.0   (ishonchsizlik)
        ↓ HA
   ③ temperature=0.2 bilan QAYTA urin
        ↓ hali shubhali
   ④ temperature=0.4 ... 1.0
```

> ## 💥 **VA MANA MUAMMO:** ## Shovqinli faylda **birinchi urinish "shubhali"** deb topiladi, ## model `temperature=0.2` ga o'tadi — ## va **tasodifiylik boshlanadi**.
>
> ## ## 🔑 **BU — MODELNING XOSSASI EMAS. BU — SOZLAMA.**

### ✅ `openai-whisper` da ham tuzatish mumkin

```python
result = model.transcribe(file_path, temperature=0.0)      # ⭐ fallback O'CHIRILDI
```

### ✅ `transformers` da esa bu **standart holat**

```python
asr = pipeline("automatic-speech-recognition", model="openai/whisper-base")
asr(y)              # ⭐ greedy — allaqachon deterministik
```

---

## 6. ⭐⭐ Kursning uy vazifasini bajaramiz

> ## 🔑 **VAZIFA:** *"`medium` modelni sinang. Ismni to'g'ri tanidimi?"*

| Model | Parametrlar | Vaqt | ## WER toza | Ism | `data` |
|---|---|---|---|---|---|
| ## **`tiny`** | ## ⭐ **37.8 M** | ## 🏆 **2.21 s** | ## 🏆 **0.0164** | `Yvonne` | ✅ |
| `base` | 72.6 M | 2.91 s | ## 🏆 **0.0164** | `Yvonne` | ✅ |
| `small` | ## 💥 **241.7 M** | ## 💥 **6.81 s** | ## 🏆 **0.0164** | `Yvonne` | ✅ |

> ## 💥💥 **VA MANA JAVOB, KURS KUTMAGAN JAVOB:**
>
> ## ## 🏆 **KATTAROQ MODEL ISMNI "TUZATMAYDI" — CHUNKI ISM ALLAQACHON TO'G'RI.**
>
> ## `Yvonne` — bu **haqiqiy ism** *(58-modul)*. ## `ground_truth.txt` dagi `Ivan` — **havolaning xatosi**.

> ## 💥💥 **VA UCHALASI HAM BIR XIL WER BERDI.** ## `small` `tiny` dan **6.4× katta** va **6.4× sekin** — ## va **hech narsa yaxshilamaydi**.
>
> ## ## 💡 **"Kattaroq model = yaxshiroq natija" — BU QOIDA EMAS.**

### ⚠️ Lekin bitta shart bilan

Bu o'lchov `return_timestamps=False` bilan olingan. **`True`** bilan `tiny`
qo'shimcha xato qiladi *(1-dars, 5.5-bo'lim)*:

```
whisper-tiny   ts=False  WER 0.0164  ['ivan->yvonne']
whisper-tiny   ts=True   WER 0.0328  ['ivan->yvonne', 'my->like']    💥
whisper-base   ts=True   WER 0.0164  ['ivan->yvonne']                ✅
```

> ## 🔑 **KATTAROQ MODELNING HAQIQIY AFZALLIGI — BARQARORLIK.** ## `base` sozlama o'zgarganda ham **natijani saqlaydi**, ## `tiny` esa **sezgir**.

> ## ⚠️ **VA YANA — BU BITTA FAYL.** ## Haqiqiy tanlov uchun **20–30 ta** fayl va ## **standart og'ish** kerak *(56-modul darsi)*.

---

## 7. 💥💥💥 Lekin Whisper ning **haqiqiy** zaifligi bor

Kurs *"stoxastiklik"*ni muammo deb ko'rsatdi. **Haqiqiy** muammo boshqacha.

### 🔬 Shovqin ostida Whisper vs Google

```python
for snr in [30, 20, 10, 5, 0, -5]:
    z = shovqin_qo(y, snr)
    tw = asr(z.copy())["text"].strip()
    tg = google(z.copy())
    print(f"{snr:3d} dB  Whisper WER {wer(NGT, norm(tw)):.4f} ({len(tw.split())} so'z) | "
          f"Google WER {wer(NGT, norm(tg)):.4f} ({len(tg.split())} so'z)")
```

### 📊 Natija

| SNR | ## Whisper WER | So'z | ## Google WER | So'z |
|---|---|---|---|---|
| 30 dB | ## 🏆 **0.0164** | 61 | 0.0328 | 61 |
| 20 dB | ## 🏆 **0.0164** | 61 | 0.0328 | 61 |
| 10 dB | ## 🏆 **0.0492** | 61 | 0.0656 | 61 |
| 5 dB | 0.0656 | 62 | 0.0656 | 61 |
| ## **0 dB** | ## 💥 **0.2623** | 63 | ## 🏆 **0.0656** | 60 |
| ## **−5 dB** | ## 💥💥 **5.3279** | ## 💥 **338** | ## 🏆 **0.4262** | 58 |

> ## 💥💥💥 **−5 dB DA WHISPER 338 TA SO'Z QAYTARDI.**
>
> ## ## 🔑 **BU — GALLYUTSINATSIYA.**

### 💥 Chiqishning o'zi

```
I am excited to have you ask me about your new plan. Before we get started,
we will teach you a little bit about us. I am a sound engineer, a sound
engineer, a sound engineer, a sound engineer, a sound engineer, a sound
engineer, a sound engineer, a sound engineer, a sound engineer, a sound
engineer, a sound engineer, ... (103 marta)
```

| O'lchov | Qiymat |
|---|---|
| So'zlar | ## 💥 **338** |
| Noyob so'zlar | ## 💥 **24** |
| ## **Noyob ulushi** | ## 💥 **7.1%** |
| `"engineer"` takrori | ## 💥 **103** |
| Nutq tezligi | ## 💥 **14.38 so'z/s** *(odam ≈ 2.5)* |

> ## ⚠️⚠️ **VA E'TIBOR BERING — 0 dB DA GOOGLE WHISPERNI YENGDI.** ## 0.0656 vs 0.2623 — **4× yaxshi**. ## ## 🔑 **"Whisper har doim yaxshiroq" — NOTO'G'RI.**

---

## 8. ⭐⭐ Gallyutsinatsiya detektori

Yaxshi xabar: gallyutsinatsiyani **o'lchash mumkin**.

```python
import collections


def gallyutsinatsiya_bahosi(matn, davomiylik_s):
    """Whisper chiqishining ishonchliligini baholaydi."""
    w = [x.lower().strip(".,!?;:\"'") for x in matn.split()]
    if not w:
        return {"holat": "💥 bo'sh", "noyob_ulush": 0.0, "sozlar": 0}

    noyob = len(set(w)) / len(w)
    eng_kop = collections.Counter(w).most_common(1)[0][1]
    tezlik = len(w) / max(davomiylik_s, 1e-9)

    d = {"sozlar": len(w), "noyob": len(set(w)),
         "noyob_ulush": round(noyob, 3),
         "eng_kop_takror": eng_kop,
         "sozlar_sekundiga": round(tezlik, 2)}

    # ⚠️ chegaralar o'lchov asosida tanlangan
    if noyob < 0.35 or tezlik > 4.0:
        d["holat"] = "💥 GALLYUTSINATSIYA"
    elif tezlik < 0.5:
        d["holat"] = "💥 MODEL TAQ QOLDI"          # ⚠️ juda kam so'z
    elif noyob < 0.5 or eng_kop > len(w) * 0.15:
        d["holat"] = "⚠️ shubhali"
    else:
        d["holat"] = "✅ normal"
    return d
```

### 📊 Sinov

| SNR | So'z | Noyob | Ulush | Eng ko'p | So'z/s | ## Holat |
|---|---|---|---|---|---|---|
| 30 dB | 61 | 51 | 83.6% | 3 | 2.59 | ## ✅ normal |
| 20 dB | 61 | 51 | 83.6% | 3 | 2.59 | ## ✅ normal |
| 10 dB | 61 | 51 | 83.6% | 3 | 2.59 | ## ✅ normal |
| 5 dB | 62 | 50 | 80.6% | 3 | 2.64 | ## ✅ normal |
| 0 dB | 63 | 51 | 81.0% | 4 | 2.68 | ## ✅ normal |
| ## **−5 dB** | ## 💥 **338** | 24 | ## 💥 **7.1%** | ## 💥 **105** | ## 💥 **14.38** | ## 💥 **GALLYUTSINATSIYA** |
| ## **−10 dB** | ## 💥 **1** | 1 | 100.0% | 1 | ## 💥 **0.04** | ## 💥 **MODEL TAQ QOLDI** |

> ## 🔧 **BIRINCHI VERSIYAM XATO QILGAN EDI.** ## Faqat `noyob_ulush` ni tekshirganda ## **−10 dB dagi bitta so'z "100% noyob"** bo'lib, ## `✅ normal` deb belgilangan edi.
>
> ## ## ⭐ **TUZATISH:** `sozlar_sekundiga < 0.5` shartini qo'shdim. ## ## 🔑 **Detektor ikkala tomondan ham chegara qo'yishi kerak.**

> ## 💡 **ODAM NUTQI — 2.0–3.5 so'z/soniya.** ## 14.38 — **jismonan imkonsiz**. ## 0.04 — **model taslim bo'lgan**.

---

## 🎯 Nazorat savollari

1. Kurs Whisper ni stoxastik dedi. Bizning o'lchov nima ko'rsatdi?
2. Tasodifiylik qayerdan keladi?
3. `openai-whisper` da uni qanday o'chirish mumkin?
4. `medium`/`small` model ismni "tuzatadimi"?
5. Whisper ning haqiqiy zaifligi nima?
6. Gallyutsinatsiyani qanday aniqlash mumkin?

<details>
<summary>Javoblar</summary>

1. **5/5 aynan bir xil** (bir xil MD5 hash), `data` har safar joyida. `transformers` pipeline **greedy** dekodlash ishlatadi — **deterministik**.
2. **Modeldan emas — dekodlashdan.** `openai-whisper` **temperature fallback** ishlatadi: `(0.0, 0.2, 0.4, 0.6, 0.8, 1.0)`. Birinchi urinish "shubhali" deb topilsa (`compression_ratio > 2.4` yoki `logprob < −1.0`), `temperature=0.2` ga o'tadi — **va tasodifiylik boshlanadi**.
3. `model.transcribe(path, temperature=0.0)` — fallback **o'chadi**. `transformers` da bu **allaqachon standart**.
4. **Yo'q — chunki tuzatadigan narsa yo'q.** `Yvonne` **to'g'ri ism**. `ground_truth.txt` dagi `Ivan` — **havolaning xatosi** (58-modul). Uchala model ham **bir xil WER** (0.0164) berdi, `small` ning vaqti esa **6.4× ko'p**.
5. ## **Gallyutsinatsiya.** −5 dB SNR da **338 ta so'z** qaytardi (`"a sound engineer"` × 103), WER **5.3279**. Google esa **0.4262**. 0 dB da ham Google yutdi (0.0656 vs 0.2623).
6. **Noyob so'zlar ulushi** (normal 80%+, gallyutsinatsiyada **7.1%**), **eng ko'p takror** (3 vs **105**) va **so'z/soniya** (odam 2–3.5, gallyutsinatsiyada **14.38**). Ikkala tomondan chegara kerak — juda **kam** so'z ham xato belgisi (−10 dB da **0.04 so'z/s**).

</details>

---

⬅️ [1-dars](01-Whisper-Transformer-STT.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Transcribing-Multiple-Files.md)
