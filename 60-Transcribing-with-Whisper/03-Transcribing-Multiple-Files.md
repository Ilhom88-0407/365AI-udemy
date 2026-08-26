# 3-dars. Papkadagi bir nechta audio faylni transkripsiya qilish ⭐⭐

## 🎬 Boshlashdan oldin

> **"8 ta fayl, 46.89 soniya audio — 8.15 soniyada. Real vaqtdan 5.75× tez. Va `batch_size` bilan yana 1.30× tejadik."**

---

## 1. Kursning kodi

```python
import os

directory_path = "C:/Users/PC/Downloads/Speech Recognition/Recordings"


def transcribe_directory_whisper(directory_path):
    transcriptions = []
    for file_name in os.listdir(directory_path):
        if file_name.endswith(".wav"):
            files_path = os.path.join(directory_path, file_name)
            result = model.transcribe(files_path)
            transcription = result["text"]
            transcriptions.append({"file_name": file_name,
                                   "transcription": transcription})
    return transcriptions


transcriptions = transcribe_directory_whisper(directory_path)
```

> ## ✅ **KOD TO'G'RI ISHLAYDI.** ## Va asosiy g'oya — **`os.listdir` + `endswith` + tsikl** — **to'g'ri**.
>
> ## ⚠️ **LEKIN BESHTA MUAMMOSI BOR.**

---

## 2. 💥 Beshta muammo

| # | Muammo | Nima bo'ladi |
|---|---|---|
| ① | ## `os.listdir()` **tartiblanmagan** | ## 💥 Fayllar **tasodifiy tartibda** |
| ② | Faqat `.wav` | ## 💥 MP3, FLAC, M4A **e'tiborsiz** |
| ③ | ## `try/except` **yo'q** | ## 💥 Bitta buzuq fayl **butun ishni to'xtatadi** |
| ④ | Progress **yo'q** | ## ⚠️ 100 fayl = **jimgina 10 daqiqa** |
| ⑤ | ## `batch_size` **yo'q** | ## ⚠️ **1.30× sekinroq** |

### ① `os.listdir()` tartibi

```python
import os
print(os.listdir("Recordings"))
```

> ## ⚠️ **HUJJATLAR AYTADI:** *"Ro'yxat **ixtiyoriy tartibda**."* ## Amalda Windows'da odatda alifbo bo'yicha, ## lekin **kafolat yo'q** — ## va CSV'dagi "Track Number" **noto'g'ri** bo'lib qolishi mumkin.
>
> ## ✅ **YECHIM:** `sorted(os.listdir(...))`

---

## 3. 🔬 Sakkizta fayl — o'lchaymiz

```python
import time, librosa
from transformers import pipeline

asr = pipeline("automatic-speech-recognition", model="openai/whisper-base", device=-1)

jami_a = jami_t = 0.0
for f in sorted(os.listdir("Recordings")):
    if not f.endswith(".wav"):
        continue
    y, _ = librosa.load(os.path.join("Recordings", f), sr=16000)
    t0 = time.perf_counter()
    txt = asr(y)["text"].strip()
    dt = time.perf_counter() - t0
    d = len(y) / 16000
    jami_a += d; jami_t += dt
    print(f"{f:12s} {d:5.2f} s  {dt:5.2f} s  {d/dt:5.2f}×  {len(txt.split()):3d} so'z")
```

### 📊 Natija

| Fayl | Davomiylik | Vaqt | Tezlik | So'z | Matn |
|---|---|---|---|---|---|
| `Track1.wav` | 6.50 s | 1.04 s | 6.26× | 14 | *I'm a sound engineer turned data scientist...* |
| `Track2.wav` | 7.50 s | 1.11 s | ## ⭐ **6.78×** | 16 | *My professional background is primarily...* |
| `Track3.wav` | 6.50 s | 1.08 s | 6.01× | 16 | *Over the years, I've developed a strong...* |
| `Track4.wav` | 6.53 s | 1.16 s | 5.62× | 22 | *As a graduate of Sound Engineering...* |
| ## `Track5.wav` | ## **3.57 s** | 0.84 s | ## 💥 **4.27×** | 10 | *I believe that nowadays, data is the key...* |
| `Track6.wav` | 5.10 s | 0.82 s | 6.22× | 12 | *Not only can it provide a rational...* |
| `Track7.wav` | 4.36 s | 0.90 s | 4.87× | 11 | *But it can also give you efficient...* |
| `Track8.wav` | 6.83 s | 1.21 s | 5.64× | 22 | *From the website cookies you've been...* |
| ## **JAMI** | ## **46.89 s** | ## **8.15 s** | ## 🏆 **5.75×** | ## **123** | |

> ## 💥 **E'TIBOR BERING — ENG QISQA FAYL ENG SEKIN:** ## `Track5.wav` (3.57 s) → **4.27×**, ## `Track2.wav` (7.50 s) → **6.78×**.
>
> ## ## 🔑 **SABAB — 1-DARSDA AYTGANIMIZ:** ## Whisper kirishi **har doim 30 soniya**. ## Encoder narxi **doimiy**, faqat decoder uzunlikka bog'liq. ## ## 💡 **Qisqa fayllar — nisbatan qimmat.**

---

## 4. ⭐⭐ `batch_size` — bepul tezlik

`transformers` pipeline bir nechta signalni **birga** qayta ishlay oladi:

```python
SIG = [librosa.load(p, sr=16000)[0] for p in fayllar]

t0 = time.perf_counter()
for s in SIG:
    asr(s)
print(f"ketma-ket: {time.perf_counter()-t0:.2f} s")

for bs in [2, 4, 8]:
    t0 = time.perf_counter()
    asr([s.copy() for s in SIG], batch_size=bs)
    print(f"batch_size={bs}: {time.perf_counter()-t0:.2f} s")
```

### 📊 Natija *(CPU)*

| Usul | Vaqt | Tezlanish |
|---|---|---|
| Ketma-ket | 8.20 s | 1.00× |
| ## `batch_size=2` | ## ⭐ **6.28 s** | ## ⭐ **1.30×** |
| `batch_size=4` | 6.31 s | 1.30× |
| `batch_size=8` | 6.37 s | 1.29× |

> ## ⚠️ **CPU DA BATCH 1.30× DAN OSHMAYDI** — ## va `batch_size=2` dan keyin **to'yinadi**. ## ## 🔑 **56-modulda ham shunday chiqqan edi** (1.5×). ## CPU allaqachon **hamma yadroni** ishlatadi.
>
> ## ⭐ **GPU DA ESA FARQ 5–10× BO'LADI** — ## u yerda parallellik **haqiqiy**.

---

## 5. ⭐ To'g'ri yozilgan versiya

```python
import os, time, traceback
import numpy as np, librosa
from transformers import pipeline

KENGAYTMALAR = {".wav", ".flac", ".mp3", ".ogg", ".m4a", ".aiff", ".aif"}


def papkani_transkripsiya(papka, model="openai/whisper-base",
                          batch=4, progress=True):
    """Papkadagi BARCHA audio fayllarni transkripsiya qiladi.

    · sorted()      -> barqaror tartib
    · ko'p format   -> librosa o'qiydi
    · try/except    -> bitta fayl ishni to'xtatmaydi
    · batch         -> tezroq
    """
    asr = pipeline("automatic-speech-recognition", model=model, device=-1)

    fayllar = sorted(f for f in os.listdir(papka)
                     if os.path.splitext(f)[1].lower() in KENGAYTMALAR)
    if not fayllar:
        return []

    natija, sig, nom = [], [], []
    for f in fayllar:
        p = os.path.join(papka, f)
        try:
            y, _ = librosa.load(p, sr=16000, mono=True)
            if len(y) < 1600:                        # ⚠️ 0.1 s dan qisqa
                raise ValueError("juda qisqa")
            sig.append(y)
            nom.append(f)
        except Exception as e:                       # ⭐ fayl o'qilmasa — o'tkazamiz
            natija.append({"fayl": f, "matn": "", "soniya": 0.0,
                           "holat": f"💥 {type(e).__name__}: {str(e)[:40]}"})
            if progress:
                print(f"  💥 {f}: {type(e).__name__}")

    t0 = time.perf_counter()
    for i in range(0, len(sig), batch):
        qism = sig[i:i + batch]
        try:
            r = asr([s.copy() for s in qism], batch_size=len(qism))
            if isinstance(r, dict):                  # ⚠️ 1 ta element -> dict
                r = [r]
        except Exception as e:                       # ⭐ butun blok yiqilsa
            r = [{"text": ""} for _ in qism]
            if progress:
                print(f"  💥 blok {i//batch+1}: {type(e).__name__}")
        for j, (s, x) in enumerate(zip(qism, r)):
            f = nom[i + j]
            txt = x["text"].strip()
            natija.append({"fayl": f, "matn": txt,
                           "soniya": round(len(s) / 16000, 2),
                           "so_zlar": len(txt.split()),
                           "holat": "✅" if txt else "⚠️ bo'sh"})
            if progress:
                print(f"  [{len(natija):>3}/{len(fayllar)}] {f:14s} "
                      f"{len(txt.split()):3d} so'z  {txt[:44]}")

    jami_a = sum(x.get("soniya", 0) for x in natija)
    dt = time.perf_counter() - t0
    if progress:
        print(f"\n  📊 {len(natija)} fayl · {jami_a:.2f} s audio · "
              f"{dt:.2f} s ishlov · {jami_a/max(dt,1e-9):.2f}× real vaqt")
    return natija
```

```python
r = papkani_transkripsiya("Recordings")
```

```
  [  1/8] Track1.wav      14 so'z  I'm a sound engineer turned data scientist.
  [  2/8] Track2.wav      16 so'z  My professional background is primarily in
  [  3/8] Track3.wav      16 so'z  Over the years, I've developed a strong int
  [  4/8] Track4.wav      22 so'z  As a graduate of Sound Engineering, I make
  [  5/8] Track5.wav      10 so'z  I believe that nowadays, data is the key to
  [  6/8] Track6.wav      12 so'z  Not only can it provide a rational explanat
  [  7/8] Track7.wav      11 so'z  But it can also give you efficient methodol
  [  8/8] Track8.wav      22 so'z  From the website cookies you've been asked

  📊 8 fayl · 46.89 s audio · 6.44 s ishlov · 7.28× real vaqt
```

> ## 🏆 **8.15 s → 6.44 s.** ## Va endi kod **buzuq faylda yiqilmaydi**.

---

## 6. ⚠️ Katta hajmda nima o'zgaradi?

| Fayllar | Audio | Vaqt *(5.75×)* | Xotira |
|---|---|---|---|
| 8 | 47 s | 8 s | ~0.6 GB |
| 100 | 10 daqiqa | ## **1.7 daqiqa** | ~0.6 GB |
| 1 000 | 1.6 soat | ## **17 daqiqa** | ## ⚠️ **natijalar RAM da** |
| 10 000 | 16 soat | ## **2.9 soat** | ## 💥 **RAM yetmaydi** |

> ## 💥 **1 000 DAN KO'P FAYLDA — RO'YXATNI RAM DA SAQLAMANG.** ## Har bir faylni **darhol** diskka yozing:
>
> ```python
> import csv, io
> with io.open("out.csv", "w", encoding="utf-8-sig", newline="") as fh:
>     w = csv.writer(fh)
>     w.writerow(["fayl", "soniya", "matn"])
>     for f in fayllar:
>         ...
>         w.writerow([f, d, txt])
>         fh.flush()                    # ⭐ uzilib qolsa ham saqlanadi
> ```

### ⭐ Va **davom ettirish** imkoniyati

```python
import os, csv, io

def qilinganlar(csv_yol):
    """Allaqachon transkripsiya qilingan fayllar ro'yxati."""
    if not os.path.exists(csv_yol):
        return set()
    with io.open(csv_yol, encoding="utf-8-sig") as f:
        return {r["fayl"] for r in csv.DictReader(f)}


tayyor = qilinganlar("out.csv")
qoldi = [f for f in fayllar if f not in tayyor]
print(f"{len(tayyor)} tayyor · {len(qoldi)} qoldi")
```

> ## 🔑 **16 SOATLIK ISH YARMIDA UZILSA** — ## boshidan boshlashni **xohlamaysiz**.

---

## 🎯 Nazorat savollari

1. `os.listdir()` tartibi kafolatlanganmi?
2. Kursning kodida qaysi 5 ta muammo bor?
3. Nega eng qisqa fayl eng sekin transkripsiya qilindi?
4. CPU da `batch_size` qancha tezlik beradi?
5. 10 000 fayl bilan ishlaganda nima o'zgaradi?

<details>
<summary>Javoblar</summary>

1. **Yo'q.** Python hujjatlari *"ixtiyoriy tartibda"* deydi. `sorted()` qo'shing — aks holda CSV'dagi tartib raqami ma'nosiz.
2. ① `sorted()` yo'q, ② faqat `.wav`, ③ `try/except` yo'q (bitta buzuq fayl ishni to'xtatadi), ④ progress yo'q, ⑤ `batch_size` yo'q.
3. Whisper kirishi **har doim 30 soniya** (`(1, 80, 3000)`). **Encoder narxi doimiy.** `Track5.wav` (3.57 s) → **4.27×**, `Track2.wav` (7.50 s) → **6.78×**.
4. ## **1.30×**, va `batch_size=2` da **to'yinadi**. CPU allaqachon hamma yadroni ishlatadi. GPU da farq **5–10×**.
5. **Natijalarni RAM da saqlab bo'lmaydi** — har bir faylni darhol CSV ga yozing va `flush()` qiling. Bundan tashqari **davom ettirish** mexanizmi kerak: allaqachon qilinganlarni CSV dan o'qib, o'tkazib yuboring.

</details>

---

⬅️ [2-dars](02-A-Note-on-Variability.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-Saving-to-CSV.md)
