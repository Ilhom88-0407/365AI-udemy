# 3-dars. Freymlash va xususiyat hisoblash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Bitta namuna — ma'nosiz. Bitta harf ham ma'nosiz. Ma'no — guruhda."**

---

## 1. Nima uchun freymlash kerak?

> ## 🔑 **KURSNING TASHBEHI JUDA YAXSHI:** *"Bu — kitob o'qishga o'xshaydi. Bitta harf yoki so'z ko'p narsa bermaydi, lekin so'zlarni jumlaga guruhlasangiz — ma'no paydo bo'ladi."*
>
> ## ⭐ **RAQAMLARDA:**
> ```
> 1 namuna @16 kHz     →  0.0625 ms   💥 hech narsa
> 400 namuna (25 ms)   →  ⭐ 3–4 ta f0 davri sig'adi
>                          →  chastotani O'LCHASA BO'LADI
> ```
>
> ## 💡 **`f0 = 138 Hz` → davr **7.25 ms**.** ## 25 ms oynaga **3.4 ta davr** sig'adi — ## bu **minimal yetarli** miqdor.

---

## 2. ⭐⭐ Oyna va qadam

```
oyna (window)  →  freymning UZUNLIGI
qadam (hop)    →  freymlar orasidagi SILJISH
ustma-ust      →  (oyna − qadam) / oyna
```

### 🔬 O'lchangan

```python
import numpy as np, librosa

y, sr = librosa.load("speech_01.wav", sr=16000)

for ms_w, ms_h in [(25, 10), (25, 25), (32, 8), (10, 5), (50, 25)]:
    nw, nh = int(sr * ms_w / 1000), int(sr * ms_h / 1000)
    n = 1 + (len(y) - nw) // nh
    print(f"  oyna {ms_w:3d} ms ({nw:4d}) · qadam {ms_h:3d} ms ({nh:4d})"
          f"  ->  {n:6d} freym · ustma-ust {(nw-nh)/nw:5.0%} · "
          f"{n/(len(y)/sr):6.1f} freym/s")
```

```
  oyna  25 ms ( 400) · qadam  10 ms ( 160)  ->    2349 freym · ustma-ust  60% ·   99.9 freym/s
  oyna  25 ms ( 400) · qadam  25 ms ( 400)  ->     940 freym · ustma-ust   0% ·   40.0 freym/s
  oyna  32 ms ( 512) · qadam   8 ms ( 128)  ->    2935 freym · ustma-ust  75% ·  124.8 freym/s
  oyna  10 ms ( 160) · qadam   5 ms (  80)  ->    4701 freym · ustma-ust  50% ·  199.9 freym/s
  oyna  50 ms ( 800) · qadam  25 ms ( 400)  ->     939 freym · ustma-ust  50% ·   39.9 freym/s
```

> ## 🏆 **`25 ms / 10 ms` — SANOAT STANDARTI. NIMA UCHUN?**
> ```
> 25 ms oyna  →  ⭐ fonema ichida qoladi (fonema ~50–100 ms)
>                 va 3–4 f0 davri sig'adi
>
> 10 ms qadam →  ⭐ soniyasiga 100 freym
>                 fonema o'tishlarini o'tkazib yubormaydi
>
> 60% ustma-ust →  ⭐ chegara effektlarini yumshatadi
> ```
>
> ## 💡 **VA `100 freym/s` — ASR MODELLARINING STANDART TEZLIGI.** ## Whisper ham aynan shunday ishlaydi *(30 s → 3000 freym)*.

---

## 3. ⚠️ Kursning misoli — muhim nozik jihat

> ## 🔑 **KURS AYTADI:** *"Freym 1 — 1-128 namunalar, freym 2 — 64-192, freym 3 — 128-256."*
>
> ## ✅ **G'OYA TO'G'RI:** oyna **128**, qadam **64**, ustma-ust **50%**.
>
> ## ⚠️ **LEKIN 16 kHz DA BU:**
> ```
> 128 namuna  →  8 ms oyna    💥 standart 25 ms dan 3× KICHIK
>  64 namuna  →  4 ms qadam
> ```
>
> ## 💥 **8 ms OYNADA MUAMMO BOR:**
> ```
> f0 = 138 Hz  →  davr 7.25 ms
> 8 ms oyna    →  atigi 1.1 ta davr sig'adi
>                 💥 chastotani ISHONCHLI o'lchab bo'lmaydi
> ```
>
> ## 🏆 **KURSNING RAQAMLARI — TUSHUNTIRISH UCHUN SODDALASHTIRISH.** ## Amalda **25 ms / 10 ms** ishlating.
>
> ## ⭐ **VA YANA BIR NOZIK JIHAT — INDEKSLASH:**
> ```
> Kurs: "1-128, 64-192, 128-256"
> Python: y[0:128], y[64:192], y[128:256]     ⭐ 0 dan boshlanadi
> ```

---

## 4. ⭐⭐ Freymlashni o'zimiz yozamiz

```python
def freymla(y, nw=400, nh=160, oyna="hamming"):
    """⭐ Vektorlangan freymlash — halqasiz, tez."""
    import scipy.signal as sig

    n_frame = 1 + (len(y) - nw) // nh
    # ⭐ indeks matritsasi: har qator — bitta freym
    idx = np.arange(nw)[None, :] + nh * np.arange(n_frame)[:, None]
    F = y[idx]

    if oyna:
        F = F * sig.get_window(oyna, nw)
    return F                                  # shakl: (n_frame, nw)


F = freymla(y)
print(f"  shakl {F.shape}  ({F.shape[0]} freym × {F.shape[1]} namuna)")
print(f"  xotira {F.nbytes/1024**2:.1f} MB  "
      f"(asl signal {y.nbytes/1024**2:.1f} MB)")
```

```
  shakl (2349, 400)  (2349 freym × 400 namuna)
  xotira 7.2 MB  (asl signal 1.4 MB)
```

> ## ⚠️ **XOTIRA 5.1× OSHDI.** ## 🔑 Ikki sabab bor:
> ```
> ① 60% ustma-ust tushgan namunalar TAKRORLANADI   →  2.5×
> ② oynaga ko'paytirish float32 ni float64 ga aylantirdi  →  yana 2×
> ```
> ## 💥 **② — JIM XATO.** `scipy.signal.get_window()` **`float64`** qaytaradi, ## va ko'paytirishda butun massiv **ikki baravar** kattalashadi.
>
> ## ✅ **YECHIM:**
> ```python
> F = F * sig.get_window(oyna, nw).astype(np.float32)   # ⭐ float32
> ```
>
> ## 🏆 **NUSXASIZ VARIANT HAM BOR:**
> ```python
> from numpy.lib.stride_tricks import sliding_window_view
>
> F = sliding_window_view(y, nw)[::nh]      # ⭐ NUSXA YO'Q — ko'rinish
> print(F.base is not None)                 # True — ko'rinish
> ```
> ```
>   nusxa       2.80 ms · shakl (2349, 400) · nusxami: HA
>   ko'rinish   0.19 ms · shakl (2349, 400) · nusxami: yo'q   ⭐ 15× tez
> ```
>
> ## ⚠⚠ **VA BU YERDA MEN XOTIRANI NOTO'G'RI O'LCHAGAN EDIM:**
> ```
> F.base.nbytes / 1024**2     ->  573.4 MB   💥 YOLG'ON
> ```
> ## 🔑 `F.base` — bu **oraliq ko'rinish** *(376 190 × 400)*, ## haqiqiy xotira emas. ## ✅ **Haqiqiy xotira — asl signalning o'zi: 1.4 MB.**
>
> ## 🏆 **DARS: `nbytes` KO'RINISHLAR UCHUN HAQIQIY XOTIRANI KO'RSATMAYDI.**
>
> ## 💥 **VA OGOHLANTIRISH:** ## `sliding_window_view` — **faqat o'qish uchun**. ## Unga oyna ko'paytirsangiz — **nusxa baribir yaratiladi**.

---

## 5. ⭐ Agregatsiya — freymlardan bitta vektorga

> ## 🔑 **KURS AYTADI:** *"Har freymning xususiyatlari birlashtiriladi — o'rtacha yoki median orqali."*

```python
import pandas as pd

zcr = librosa.feature.zero_crossing_rate(y, frame_length=400,
                                         hop_length=160)[0]
rms = librosa.feature.rms(y=y, frame_length=400, hop_length=160)[0]
sc = librosa.feature.spectral_centroid(y=y, sr=sr, n_fft=512,
                                       hop_length=160)[0]

def agregat(x, nom):
    return {"xususiyat": nom,
            "o'rtacha": round(float(x.mean()), 4),
            "median": round(float(np.median(x)), 4),
            "std": round(float(x.std()), 4),
            "p10": round(float(np.percentile(x, 10)), 4),
            "p90": round(float(np.percentile(x, 90)), 4)}

print(pd.DataFrame([agregat(zcr, "ZCR"), agregat(rms, "RMS"),
                    agregat(sc, "centroid")]).to_string(index=False))
```

```
xususiyat  o'rtacha    median       std       p10       p90
      ZCR    0.1522    0.1050    0.1568    0.0450    0.3098
      RMS    0.0796    0.0819    0.0430    0.0309    0.1353
 centroid 1816.6941 1514.6279 1065.0262 1041.6166 3351.9810
```

> ## ⚠️ **`ZCR`: o'rtacha 0.1522, median 0.1050 — 45% FARQ.**
>
> ## ⚠️ **`centroid`: o'rtacha 1816.7, median 1514.6 — 20% FARQ.**
>
> ## 🔑 **SABAB — TAQSIMOT NOSIMMETRIK.** ## `ZCR` da `p10 = 0.0450`, `p90 = 0.3098` — ## ya'ni **kam sonli** ovozsiz freymlar **juda yuqori** ZCR beradi ## va **o'rtachani yuqoriga tortadi**.
>
> ## 🏆 **AMALIY QOIDA:**
> ```
> o'rtacha  →  ⚠️ nosimmetrik taqsimotda ISHONCHSIZ
> median    →  ⭐ chetdagi qiymatlarga CHIDAMLI
> std       →  ⭐ o'zgaruvchanlikni ko'rsatadi — ko'pincha MEDIANDAN foydaliroq
> p10, p90  →  🏆 taqsimotning SHAKLINI beradi
> ```
>
> ## ⭐ **VA AMALDA — HAMMASINI BERING:** ## `[mean, median, std, p10, p90, min, max]` × har xususiyat. ## 💡 Model **o'zi** qaysi biri foydali ekanini **aniqlaydi**.

---

## 6. 🇺🇿 Amaliy vosita — xususiyat vektori

```python
def xususiyat_vektori(y, sr, nw=400, nh=160, n_mfcc=13):
    """🏆 Butun audiodan BITTA vektor — tasniflash uchun."""
    q = {}

    # ── vaqt domeni ──
    XUS = {
        "zcr": librosa.feature.zero_crossing_rate(
            y, frame_length=nw, hop_length=nh)[0],
        "rms": librosa.feature.rms(y=y, frame_length=nw, hop_length=nh)[0],
        "centroid": librosa.feature.spectral_centroid(
            y=y, sr=sr, n_fft=512, hop_length=nh)[0],
        "rolloff": librosa.feature.spectral_rolloff(
            y=y, sr=sr, n_fft=512, hop_length=nh)[0],
        "flatness": librosa.feature.spectral_flatness(
            y=y, n_fft=512, hop_length=nh)[0],
    }
    for nom, x in XUS.items():
        q[f"{nom}_mean"] = float(x.mean())
        q[f"{nom}_std"] = float(x.std())
        q[f"{nom}_med"] = float(np.median(x))

    # ── MFCC + delta ──
    M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc, n_fft=512,
                             hop_length=nh)
    D = librosa.feature.delta(M)
    for i in range(n_mfcc):
        q[f"mfcc{i}_mean"] = float(M[i].mean())
        q[f"mfcc{i}_std"] = float(M[i].std())
        q[f"dmfcc{i}_mean"] = float(D[i].mean())

    return q


v = xususiyat_vektori(y, sr)
print(f"  o'lcham: {len(v)}")
print(f"  birinchi 6: "
      f"{ {k: round(x, 3) for k, x in list(v.items())[:6]} }")
```

```
  o'lcham: 54
  birinchi 6: {'zcr_mean': 0.152, 'zcr_std': 0.157, 'zcr_med': 0.105,
               'rms_mean': 0.08, 'rms_std': 0.043, 'rms_med': 0.082}
```

> ## 🏆 **54 O'LCHAMLI VEKTOR — BUTUN AUDIONI TASVIRLAYDI.**
>
> ## ⭐ **BU — TASNIFLASH MASALALARI UCHUN:**
> ```
> ✅ janr aniqlash · gapiruvchini tanish · emotsiya · til aniqlash
> 💥 NUTQNI TANISH uchun EMAS
> ```
>
> ## 💥 **NIMA UCHUN ASR UCHUN YARAMAYDI?** ## Bu vektor **vaqtni yo'qotadi** — ## `"salom"` va `"molas"` **bir xil** vektor beradi.
>
> ## 🏆 **ASR UCHUN — FREYMLAR KETMA-KETLIGI KERAK** *(13 × 2349)*, ## bitta vektor emas.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun freymlash kerak?

**M2.** `25 ms / 10 ms` nima uchun standart?

**M3.** Nima uchun `median` `o'rtacha` dan yaxshiroq?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Bitta namuna **ma'nosiz**. ## 25 ms da **3–4 ta `f0` davri** sig'adi — chastotani **o'lchasa bo'ladi**.

**M2.** ## 25 ms — fonema **ichida** qoladi *(fonema 50–100 ms)*. ## 10 ms — **100 freym/s**, o'tishlarni **o'tkazib yubormaydi**.

**M3.** ## Taqsimot **nosimmetrik**. ## O'lchandi: ZCR o'rtacha **0.1522**, median **0.1053** — **45% farq**.

</details>

### 🟡 O'rta

**M4.** ⭐ Freym parametrlarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

q = []
for ms_w in [10, 20, 25, 32, 50]:
    for ust in [0.0, 0.5, 0.6, 0.75]:
        nw = int(sr * ms_w / 1000)
        nh = max(int(nw * (1 - ust)), 1)
        n = 1 + (len(y) - nw) // nh
        z = librosa.feature.zero_crossing_rate(
            y, frame_length=nw, hop_length=nh)[0]
        q.append({"oyna_ms": ms_w, "ustma_ust": f"{ust:.0%}",
                  "freym": n, "freym_s": round(n/(len(y)/sr), 1),
                  "xotira_MB": round(n * nw * 4 / 1024**2, 1),
                  "zcr_std": round(float(z.std()), 4)})

print(pd.DataFrame(q).to_string(index=False))
```

```
 oyna_ms ustma_ust  freym  freym_s  xotira_MB  zcr_std
      10        0%   2351    100.0        1.4   0.1621
      10       75%   9401    399.8        5.7   0.1619
      25        0%    940     40.0        1.4   0.1569
      25       60%   2349     99.9        3.6   0.1568
      25       75%   3758    159.8        5.7   0.1568
      50        0%    470     20.0        1.4   0.1461
      50       75%   1877     79.8        5.7   0.1470
```

## 💡 **`xotira_MB` FAQAT USTMA-USTLIKKA BOG'LIQ, OYNA O'LCHAMIGA EMAS:** ## 0% → **1.4 MB** · 50% → 2.9 · 60% → 3.6 · 75% → **5.7 MB** — ## har oyna o'lchamida **aynan bir xil**.

## 🔑 Sabab: `freym × oyna` ko'paytmasi **doimiy** — ## oyna 2× katta bo'lsa, freymlar 2× kam.

## 🏆 **VA `zcr_std` USTMA-USTLIKDAN DEYARLI MUSTAQIL** ## *(0.1621 → 0.1619 · 0.1569 → 0.1568)*: ## ustma-ustlikni oshirish **ma'lumot qo'shmaydi**, faqat **xotira yeydi**.

## ⭐ **O'ZGARADIGAN YAGONA NARSA — OYNA O'LCHAMI:** ## 10 ms → **0.1621** · 50 ms → **0.1461** *(10% kam)*. ## 💡 Katta oyna — **silliqroq**, lekin **tez o'zgarishlar yo'qoladi**.

</details>

**M5.** ⭐⭐ Freymlashni ikki usulda yozing va xotirani o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
from numpy.lib.stride_tricks import sliding_window_view
import time


def freymla_nusxa(y, nw=400, nh=160):
    n = 1 + (len(y) - nw) // nh
    idx = np.arange(nw)[None, :] + nh * np.arange(n)[:, None]
    return y[idx]


def freymla_korinish(y, nw=400, nh=160):
    return sliding_window_view(y, nw)[::nh]        # ⭐ NUSXA YO'Q


for nom, f in [("nusxa", freymla_nusxa), ("ko'rinish", freymla_korinish)]:
    t0 = time.perf_counter()
    F = f(y)
    dt = time.perf_counter() - t0
    o_z = F.nbytes if F.base is None else F.base.nbytes
    print(f"  {nom:10s} {dt*1000:7.2f} ms · shakl {F.shape} · "
          f"xotira {o_z/1024**2:6.1f} MB · "
          f"nusxami: {'yo`q' if F.base is not None else 'HA'}")
```

## 🏆 **`sliding_window_view` — NUSXA YARATMAYDI.** ## 1 soatlik audioda bu **yuzlab MB** tejaydi.

## ⚠️ **LEKIN OYNA KO'PAYTIRSANGIZ** *(`F * hamming`)* — ## nusxa **baribir** yaratiladi.

</details>

**M6.** ⭐⭐ Xususiyat vektorini yozing va ikki faylni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
# ⭐ 53-modulda yaratilgan fayllar bilan
FAYLLAR = ["speech_01.wav", "telefon.wav", "xona_vannaxona.wav"]

vektorlar = {}
for f in FAYLLAR:
    try:
        x, s = librosa.load(f, sr=16000)
        vektorlar[f] = xususiyat_vektori(x, s)
    except Exception as e:
        print(f"  ⚠️ {f}: {e}")

if len(vektorlar) >= 2:
    kalitlar = list(next(iter(vektorlar.values())).keys())
    A = np.array([[v[k] for k in kalitlar] for v in vektorlar.values()])
    # ⭐ z-normallash — o'lchamlar turli shkalada
    A = (A - A.mean(axis=0)) / (A.std(axis=0) + 1e-9)

    nomlar = list(vektorlar)
    for i in range(len(nomlar)):
        for j in range(i + 1, len(nomlar)):
            masofa = float(np.linalg.norm(A[i] - A[j]))
            print(f"  {nomlar[i][:22]:22s} ↔ {nomlar[j][:22]:22s} "
                  f"masofa {masofa:7.2f}")
```

## ⚠️ **`z-normallash` — SHART.** ## `centroid` ~1800, `zcr` ~0.15 — ## normallashsiz **centroid hammasini bosib ketadi**.

</details>

---

## 📌 Xulosa

```
audio → FREYMLASH (25 ms / 10 ms) → xususiyat → AGREGATSIYA → vektor
                 ⭐ 100 freym/s              ⭐ mean, median, std, p10, p90
```

```
🔬 O'LCHANGAN:
   oyna 25 / qadam 10 ms  ->  2349 freym · 60% ustma-ust · 99.9 freym/s
   oyna 10 / qadam  5 ms  ->  4701 freym · 50% ustma-ust · 199.9 freym/s

   xotira: freymlangan 7.2 MB vs asl signal 1.4 MB  (5.1×)
      💥 2.5× ustma-ustlikdan · yana 2× float32 -> float64 dan
   sliding_window_view  →  ⭐ NUSXA YO'Q, 15× tez (0.19 vs 2.80 ms)
      ⚠️ lekin .nbytes ko'rinishda YOLG'ON qiymat beradi (573 MB)

   AGREGATSIYA (ZCR):  o'rtacha 0.1522 · median 0.1050  →  45% FARQ
      sabab: taqsimot NOSIMMETRIK (p10 0.0450 · p90 0.3098)

   xotira ustma-ustlikka bog'liq, OYNA O'LCHAMIGA EMAS (1.4 / 2.9 / 3.6 / 5.7 MB)

   xususiyat vektori: 54 o'lcham
```

> ## ⚠️ **KURSNING "128 namuna" MISOLI — 16 kHz DA 8 ms**, ## ya'ni `f0` ning atigi **1.1 davri**. ## 🏆 **Amalda 25 ms / 10 ms ishlating.**
>
> ## 💥 **VA BITTA VEKTOR — ASR UCHUN YARAMAYDI:** ## `"salom"` va `"molas"` **bir xil** vektor beradi. ## 🏆 **ASR uchun freymlar KETMA-KETLIGI kerak.**

---

⬅️ [2-dars. Chastota domeni](02-Frequency-Domain-Features.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Furye almashtirishi](04-Fourier-Transform.md)
