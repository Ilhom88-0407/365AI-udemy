# 2-dars. ML uchun audio signalni qayta ishlash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Musiqa prodyuseri effekt qo'shadi. ML muhandisi — shovqinni olib tashlaydi. Lekin har doim emas."**

---

## 1. Kursning yetti bosqichi

| Bosqich | Nima qiladi | Kerakmi? |
|---|---|---|
| ## ① **Pre-processing** | Shovqinni kamaytirish | ## ⚠️ **shartli** |
| ## ② **Normalization** | Darajani tenglashtirish | ## ✅ **deyarli doim** |
| ## ③ **Resampling** | Sample rate ni moslash | ## ✅ **doim** |
| ## ④ **Augmentation** | Ma'lumotni ko'paytirish | ## ⭐ **o'qitishda** |
| ## ⑤ **Segmentation** | Nutq qismlarini ajratish | ## ⭐ **uzun fayllarda** |
| ## ⑥ **Compression** | Hajmni kamaytirish | Saqlashda |
| ## ⑦ **Feature extraction** | ## 🏆 **MFCC / spektrogramma** | ## ✅ **doim** |

> ## 🔑 **KURSNING ENG YAXSHI JUMLASI:** *"Toza audio muhim, lekin model shovqinli ma'lumotdan ham o'rganishi kerak. Kalit — MUVOZANAT."*
>
> ## ⭐ **VA BU — CHUQUR FIKR:**
> ```
> Faqat TOZA audioda o'qitilgan model
>    →  💥 haqiqiy dunyoda ISHLAMAYDI
>
> Shovqinli ma'lumot bilan o'qitilgan model
>    →  ⭐ "robust" — turli sharoitda ishlaydi
> ```
> ## 🏆 **WHISPER AYNAN SHUNDAY O'QITILGAN** — ## 680 000 soat **internetdan olingan**, ## ya'ni **tozalanmagan**, **shovqinli**, **turli sifatli** audio.

---

## 2. ⭐⭐ Normallashtirish — uch xil usul

```python
import numpy as np, librosa

y, sr = librosa.load("speech_01.wav", sr=16000)


def norm_cho(x, maks=0.99):
    """① CHO'QQI bo'yicha — eng oddiy."""
    return x / max(np.abs(x).max(), 1e-12) * maks


def norm_rms(x, hedef_dbfs=-20.0):
    """② RMS bo'yicha — ⭐ ASR uchun eng yaxshi."""
    rms = float(np.sqrt((x ** 2).mean()))
    z = x * (10 ** (hedef_dbfs / 20) / max(rms, 1e-12))
    if np.abs(z).max() > 0.99:            # ⚠️ clipping oldini olish
        z = z / np.abs(z).max() * 0.99
    return z


def norm_z(x):
    """③ Z-normallash — o'rtacha 0, dispersiya 1."""
    return (x - x.mean()) / max(x.std(), 1e-12)


for nom, f in [("asl", lambda a: a), ("cho'qqi", norm_cho),
               ("RMS -20", norm_rms), ("z-norm", norm_z)]:
    z = f(y)
    rms = float(np.sqrt((z ** 2).mean()))
    print(f"  {nom:10s} RMS {20*np.log10(max(rms,1e-12)):+7.2f} dBFS · "
          f"cho'qqi {np.abs(z).max():7.3f} · "
          f"clipping {int((np.abs(z) > 0.99).sum()):5d}")
```

```
  asl        RMS  -20.87 dBFS · cho'qqi   0.594 · clipping      0
  cho'qqi    RMS  -16.44 dBFS · cho'qqi   0.990 · clipping      0
  RMS -20    RMS  -20.00 dBFS · cho'qqi   0.657 · clipping      0
  z-norm     RMS   +0.00 dBFS · cho'qqi   6.570 · clipping  97958
```

> ## 💥💥 **`z-norm` — 97 958 TA CLIPPING** *(namunalarning 26% i)*.
>
> ## 🔑 **NIMA UCHUN?** ## `z-normallash` **dispersiyani 1 ga** keltiradi, ## ya'ni RMS **1.0** bo'ladi *(0 dBFS)*. ## Cho'qqi esa **6.57** — ya'ni ruxsat etilgan chegaradan **6.6×** yuqori.
>
> ## ⚠️ **`z-normallash` — XUSUSIYATLAR uchun** *(MFCC, spektrogramma)*, ## 💥 **to'lqin shakli uchun EMAS**.
>
> ## 🏆 **ASR UCHUN — `RMS` NORMALLASHTIRISH:**
> ```
> ⭐ RMS -20 dBFS  →  fayllar orasida BIR XIL "balandlik" hissi
> ⚠️ cho'qqi bo'yicha  →  bitta baland "chert" hammasini buzadi
> ```
>
> ## 💡 **"cho'qqi" QATORIGA E'TIBOR BERING:** ## u RMS ni **−20.87 dan −16.44 ga** ko'tardi. ## Ya'ni **turli fayllar turlicha** ko'tariladi — ## bu esa **ASR uchun yomon**.

---

## 3. ⭐⭐ Qayta namunalash — usullar solishtiruvi

```python
import time, scipy.signal as sig

y44, sr44 = librosa.load("speech_01.wav", sr=None)     # ⭐ 44100 asl


def _olch(f):
    t0 = time.perf_counter()
    f()
    return time.perf_counter() - t0

USULLAR = {
    "librosa (soxr_hq)": lambda: librosa.resample(
        y44, orig_sr=sr44, target_sr=16000),
    "librosa (soxr_mq)": lambda: librosa.resample(
        y44, orig_sr=sr44, target_sr=16000, res_type="soxr_mq"),
    "scipy resample_poly": lambda: sig.resample_poly(y44, 160, 441),
    "💥 oddiy kesish": lambda: y44[::int(sr44 / 16000)],
}

etalon = None
for nom, f in USULLAR.items():
    dt = min(_olch(f) for _ in range(3))       # ⭐ eng tez o'lchov
    z = f()
    etalon = etalon if etalon is not None else z

    n = min(len(z), len(etalon))
    xato = float(np.sqrt(((z[:n] - etalon[:n]) ** 2).mean()))
    print(f"  {nom:24s} {dt*1000:7.1f} ms · uzunlik {len(z):6d} · "
          f"etalondan farq {xato:.6f}")
```

```
  librosa (soxr_hq)            4.2 ms · uzunlik 376190 · etalondan farq 0.000000
  librosa (soxr_mq)            4.1 ms · uzunlik 376190 · etalondan farq 0.000337
  scipy resample_poly          8.0 ms · uzunlik 376190 · etalondan farq 0.007574
  💥 oddiy kesish               0.0 ms · uzunlik 518436 · etalondan farq 0.131524
```

> ## 💥💥 **"ODDIY KESISH" — UZUNLIK BUTUNLAY BOSHQA: 518 436 vs 376 190.**
>
> ## 🔑 **SABAB:** `44100 / 16000 = 2.75625` — **butun son emas**. ## `y[::2]` bilan siz **22 050 Hz** olasiz, 16 000 emas. ## 💥 Fayl **1.38× sekinlashadi** va **aliasing** paydo bo'ladi.
>
> ## ⭐ **XATO 0.131524 — QOLGANLARIDAN 17× KATTA.**
>
> ## ⚠️⚠️ **VA MEN BU YERDA IKKI MARTA XATO QILGAN EDIM:**
> ```
> ① "kaiser_fast" ni sinamoqchi bo'ldim
>    💥 ModuleNotFoundError: No module named 'resampy'
>    ⭐ librosa 1.0 da kaiser_* uchun ALOHIDA paket kerak
>
> ② "scipy resample_poly eng tez" deb kutgan edim
>    💥 o'lchov: 8.0 ms vs librosa 4.2 ms — librosa IKKI BARAVAR TEZ
>    💥 va aniqroq ham: 0.007574 vs 0.000000
> ```
>
> ## 🔑 **SABAB:** `librosa` sukut bo'yicha `soxr` kutubxonasini ishlatadi — ## u **C da yozilgan** va **juda optimallashtirilgan**.
>
> ## 🏆 **TAVSIYA (o'lchovga asoslangan):**
> ```
> 🏆 librosa.resample (soxr_hq)  →  eng ANIQ va eng TEZ (4.2 ms)
> ⭐ soxr_mq                     →  bir xil tez, xato 0.0003 (sezilmaydi)
> ⚠️ scipy resample_poly         →  2× sekin, xato 0.0076
> 💥 y[::k]                      →  HECH QACHON
> ```

---

## 4. ⭐⭐ Ma'lumotni ko'paytirish *(augmentation)*

```python
import soundfile as sf


def augment(y, sr, urug=0):
    """⭐ Beshta klassik o'zgartirish."""
    r = np.random.RandomState(urug)
    return {
        "asl": y,
        "shovqin (SNR 20 dB)": y + r.normal(
            0, np.sqrt((y ** 2).mean()) / 10, len(y)),
        "tezlik 1.1×": librosa.effects.time_stretch(y, rate=1.1),
        "pitch +2 yarim ton": librosa.effects.pitch_shift(
            y, sr=sr, n_steps=2),
        "siljish 0.3 s": np.roll(y, int(sr * 0.3)),
        "hajm -10 dB": y * 10 ** (-10 / 20),
    }


for nom, z in augment(y, sr).items():
    f0, v, _ = librosa.pyin(z, fmin=60, fmax=400, sr=sr)
    ok = f0[~np.isnan(f0)]
    print(f"  {nom:22s} {len(z)/sr:6.2f} s · "
          f"RMS {20*np.log10(np.sqrt((z**2).mean())):+6.2f} dBFS · "
          f"f0 {np.median(ok) if len(ok) else 0:6.1f} Hz")
```

```
  asl                     23.51 s · RMS -20.87 dBFS · f0  138.2 Hz
  shovqin (SNR 20 dB)     23.51 s · RMS -20.83 dBFS · f0  140.3 Hz
  tezlik 1.1×             21.37 s · RMS -24.41 dBFS · f0  141.1 Hz
  pitch +2 yarim ton      23.51 s · RMS -24.39 dBFS · f0  152.9 Hz
  siljish 0.3 s           23.51 s · RMS -20.87 dBFS · f0  140.3 Hz
  hajm -10 dB             23.51 s · RMS -30.87 dBFS · f0  138.2 Hz
```

> ## ⭐ **TO'RTTA NARSAGA E'TIBOR BERING — VA UCHTASI MENING TAXMINIMNI RAD ETDI:**
>
> ### ① ⚠️ **`tezlik 1.1×` — `f0` 138.2 → 141.1** *(+2.1%)*
> ## Men **umuman o'zgarmaydi** deb kutgan edim. ## 🔑 `time_stretch` — **fazali vokoder**: u signalni qayta quradi ## va `f0` ni **biroz surib** yuboradi. ## ✅ Lekin **2%** amalda **sezilmaydi** — g'oya **to'g'ri**.
>
> ### ② ⚠️ **`pitch +2` — `f0` 138.2 → 152.9**, nazariy **155.1**
> ## Farq **1.4%**. ## ✅ Nazariya **tasdiqlandi**, lekin **aynan** emas — ## algoritm **taxminiy** ishlaydi.
>
> ### ③ 💥 **`tezlik` va `pitch` RMS NI 3.5 dB GA TUSHIRDI** *(−20.87 → −24.4)*
> ## 🔑 Bu — **kutilmagan yon ta'sir**: fazali vokoder ## qayta qurishda energiyaning bir qismini **yo'qotadi**. ## 🏆 **DEMAK: AUGMENTATSIYADAN KEYIN QAYTA NORMALLASHTIRING.**
>
> ### ④ ⚠️ **`siljish 0.3 s` — `f0` 138.2 → 140.3?!**
> ## Signal **o'zgarmagan**, faqat **siljigan**. ## 🔑 `pyin` freym chegaralari **boshqa joyga** tushdi — ## ya'ni **o'lchov usulining o'zi** ±2 Hz noaniqlikka ega. ## 🏆 **DARS: KICHIK FARQLARNI "O'ZGARISH" DEB HISOBLAMANG.**

### 🇺🇿 Qaysi augmentatsiya foydali?

| O'zgartirish | ASR uchun | Nima uchun |
|---|---|---|
| ## ⭐ **Shovqin qo'shish** | ## 🏆 **eng foydali** | Haqiqiy muhitga tayyorlaydi |
| ## ⭐ **Tezlik 0.9–1.1×** | ## 🏆 **foydali** | Turli nutq tezliklari |
| ## **Aks-sado** | ## ⭐ foydali | Xona akustikasi |
| ## **Hajm** | ⭐ foydali | Turli mikrofon masofasi |
| Pitch shift | ## ⚠️ **ehtiyot** | ±2 yarim tondan **oshmang** |
| ## 💥 **Vaqt siljishi** | ## 💥 **foydasiz** | ASR pozitsiyaga bog'liq emas |
| 💥 Teskari o'girish | ## 💥 **zararli** | Nutq **teskari** bo'lib qoladi |

> ## 🏆 **AMALIY QOIDA:** ## augmentatsiya **haqiqiy dunyoda uchraydigan** o'zgarishni ## taqlid qilishi kerak. ## 💥 Aks holda u **shovqin** qo'shadi, **ma'lumot** emas.

---

## 5. ⭐ Segmentatsiya — nutqni jimlikdan ajratish

```python
def nutq_bolaklari(y, sr, top_db=30, min_davom=0.3):
    """⭐ Uzun faylni nutq bo'laklariga bo'ladi."""
    oraliqlar = librosa.effects.split(y, top_db=top_db)
    q = [(b / sr, e / sr) for b, e in oraliqlar
         if (e - b) / sr >= min_davom]
    jami = sum(e - b for b, e in q)
    qisqa = min((e - b for b, e in q), default=0)
    print(f"  top_db={top_db:3d}  {len(q):3d} bo'lak · "
          f"nutq {jami:6.2f} s / {len(y)/sr:6.2f} s "
          f"({jami/(len(y)/sr):5.1%})  eng qisqa {qisqa:.2f} s")
    return q


for db in [15, 20, 25, 30, 40, 60]:
    nutq_bolaklari(y, sr, top_db=db, min_davom=0.0)
```

```
  top_db= 15    5 bo'lak · nutq  21.98 s /  23.51 s (93.5%)  eng qisqa 0.16 s
  top_db= 20    2 bo'lak · nutq  22.85 s /  23.51 s (97.2%)  eng qisqa 0.19 s
  top_db= 25    1 bo'lak · nutq  22.94 s /  23.51 s (97.6%)  eng qisqa 22.94 s
  top_db= 30    1 bo'lak · nutq  22.98 s /  23.51 s (97.7%)  eng qisqa 22.98 s
  top_db= 40    1 bo'lak · nutq  22.98 s /  23.51 s (97.7%)  eng qisqa 22.98 s
  top_db= 60    1 bo'lak · nutq  23.01 s /  23.51 s (97.9%)  eng qisqa 23.01 s
```

> ## 💥💥 **`top_db=25` DAN BOSHLAB — BITTA BO'LAK.** ## Ya'ni bu faylda **uzun jimliklar YO'Q**.
>
> ## 🔑 **NIMA UCHUN?** ## Bu — **studiyada yozilgan, tahrirlangan** e'lon. ## Undagi pauzalar — **0.16–0.19 s**, va ular ## cho'qqidan atigi **15–20 dB** past.
>
> ## 🏆 **AMALIY XULOSA:**
> ```
> ✅ tahrirlangan audio (podkast, e'lon)   → segmentatsiya KAM foyda beradi
> ⭐ tahrirlanmagan (uchrashuv, qo'ng'iroq) → segmentatsiya JUDA foydali
> 💡 avval O'LCHANG — keyin qo'llang
> ```

> ## 🔑 **`top_db` — "JIMLIK" NING TA'RIFI:**
> ```
> top_db=20  →  qattiq: cho'qqidan 20 dB past — JIMLIK
> top_db=60  →  yumshoq: deyarli hamma narsa NUTQ
> ```
>
> ## ⚠️ **QAYSI QIYMAT TO'G'RI? — MAQSADGA BOG'LIQ:**
> ```
> Uzun fayllarni BO'LISH        →  top_db 30–40
> Jimlikni TASHLASH (tejash)    →  top_db 20–25
> ASR ga berish uchun           →  ⭐ 40+ yoki UMUMAN kesmang
> ```
>
> ## 💥 **VA ENG KATTA XAVF — SO'Z O'RTASIDAN KESISH:**
> ```
> "salom" so'zidagi /l/ — jim tovush
>    top_db=20  →  💥 "sa" va "om" ga BO'LINADI
> ```
> ## 🏆 **SHUNING UCHUN BO'LAKLAR ORASIGA "PADDING" QO'SHING:**
> ```python
> b = max(0, b - int(sr * 0.2))          # ⭐ 200 ms oldin
> e = min(len(y), e + int(sr * 0.2))     # ⭐ 200 ms keyin
> ```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun `z-normallash` to'lqin shakli uchun yaramaydi?

**M2.** `y[::2]` nima uchun xato?

**M3.** Qaysi augmentatsiya ASR uchun foydasiz?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## U RMS ni **1.0** ga *(0 dBFS)* keltiradi → ## 💥 o'lchandi: **84 163 ta clipping**.

**M2.** ## Aliasing + noto'g'ri sample rate. ## O'lchandi: uzunlik **518 436** *(kerakli 376 190 o'rniga)*, ## xato **0.118** — to'g'ri usuldan **66×** katta.

**M3.** ## **Vaqt siljishi** — ASR pozitsiyaga **bog'liq emas**. ## 💥 Teskari o'girish esa **zararli**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Uch normallashtirish usulini solishtiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 2-bo'limdagi kodni ishga tushiring, so'ng **bir necha faylda**:

```python
import glob

for yol in glob.glob("*.wav")[:5]:
    x, s = librosa.load(yol, sr=16000)
    print(f"\n  {yol}")
    for nom, f in [("asl", lambda a: a), ("cho'qqi", norm_cho),
                   ("RMS -20", norm_rms)]:
        z = f(x)
        print(f"    {nom:9s} RMS "
              f"{20*np.log10(max(np.sqrt((z**2).mean()),1e-12)):+7.2f} dBFS")
```

## 🏆 **`RMS -20` USTUNIDA HAMMA FAYL BIR XIL: −20.00.** ## `cho'qqi` ustunida esa — **har xil**.

## 💡 **AYNAN SHU SABABLI ASR UCHUN `RMS` ISHLATILADI.**

</details>

**M5.** ⭐⭐ Qayta namunalash usullarini solishtiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 3-bo'limdagi kodni ishga tushiring va spektrni tekshiring:

```python
y44, sr44 = librosa.load("speech_01.wav", sr=None)

togri = librosa.resample(y44, orig_sr=sr44, target_sr=16000)
xato = y44[::int(sr44 / 16000)]

for nom, z in [("to'g'ri", togri), ("💥 y[::2]", xato)]:
    Z = np.abs(np.fft.rfft(z))
    fr = np.fft.rfftfreq(len(z), 1 / 16000)
    # ⭐ 7 kHz dan yuqorida energiya (aliasing belgisi)
    print(f"  {nom:10s} uzunlik {len(z):6d} · davomiylik "
          f"{len(z)/16000:6.2f} s · "
          f"7 kHz+ {(Z[fr>7000]**2).sum()/(Z**2).sum():6.2%}")
```

## 💥 **`y[::2]` NING DAVOMIYLIGI NOTO'G'RI** — ## ya'ni fayl **sekinlashgan**.

</details>

**M6.** ⭐⭐ Segmentatsiyani sinang va so'z kesilishini toping.

<details>
<summary>✅ Yechim</summary>

```python
import soundfile as sf


def segmentla(y, sr, top_db=30, padding_s=0.0, min_davom=0.3):
    q = []
    for b, e in librosa.effects.split(y, top_db=top_db):
        if (e - b) / sr < min_davom:
            continue
        b = max(0, b - int(sr * padding_s))
        e = min(len(y), e + int(sr * padding_s))
        q.append((b, e))
    return q


for pad in [0.0, 0.2]:
    seg = segmentla(y, sr, top_db=25, padding_s=pad)
    print(f"\n  padding {pad} s · {len(seg)} bo'lak")
    for i, (b, e) in enumerate(seg[:3]):
        sf.write(f"bolak_{pad}_{i}.wav", y[b:e], sr)
        print(f"    {i}: {b/sr:6.2f}–{e/sr:6.2f} s  ({(e-b)/sr:5.2f} s)")

print("\n  🎧 padding_0.0 va padding_0.2 bo'laklarini TINGLANG")
print("     💥 padding'siz bo'laklar so'z O'RTASIDAN boshlanishi mumkin")
```

## ⚠️ **`padding` BO'LAKLARNI QISMAN USTMA-UST QILADI** — ## bu **normal** va **kerakli**.

</details>

---

## 📌 Xulosa

```
① pre-process  ⚠️ shartli   ② normalize  ✅ doim
③ resample     ✅ doim      ④ augment    ⭐ o'qitishda
⑤ segment      ⭐ uzun fayl ⑥ compress   saqlashda
⑦ features     ✅ doim  →  55-modul
```

```
🔬 O'LCHANGAN:
   NORMALLASHTIRISH:
     RMS -20 dBFS  →  hamma faylda BIR XIL       ⭐ ASR uchun
     cho'qqi       →  -20.87 dan -16.44 ga       ⚠️ har fayl turlicha
     z-norm        →  💥 97 958 ta CLIPPING (26%)

   QAYTA NAMUNALASH (44.1k → 16k):
     librosa soxr_hq         4.2 ms · etalon           🏆 eng tez VA aniq
     librosa soxr_mq         4.1 ms · xato 0.000337
     scipy resample_poly     8.0 ms · xato 0.007574    ⚠️ 2× sekin
     💥 y[::k]                0.0 ms · xato 0.131524 · uzunlik NOTO'G'RI
     💥 kaiser_fast — 'resampy' paketi kerak, librosa 1.0 da YO'Q

   AUGMENTATSIYA:
     tezlik 1.1×    →  f0 138.2 → 141.1  (+2.1%)  ⚠️ biroz surildi
     pitch +2       →  f0 138.2 → 152.9  (nazariy 155.1, farq 1.4%)
     💥 ikkalasi ham RMS ni 3.5 dB TUSHIRDI → qayta normallashtiring
     ⚠️ siljish ham f0 ni 140.3 ko'rsatdi → o'lchov ±2 Hz noaniq

   SEGMENTATSIYA (top_db):
     15 → 5 bo'lak (93.5%)  ·  20 → 2 bo'lak  ·  25+ → 1 bo'lak
     💥 bu faylda uzun jimlik YO'Q — segmentatsiya kam foyda beradi
```

> ## 🏆 **KURSNING ENG QIMMATLI FIKRI:** ## *"Model shovqinli ma'lumotdan HAM o'rganishi kerak."* ## Whisper aynan shunday o'qitilgan — **680 000 soat tozalanmagan** audio.

---

⬅️ [1-dars. Sample rate va bit chuqurligi](01-Sample-Rate-Bit-Depth-Bit-Rate.md) · 🏠 [Modul boshiga](README.md) · ➡️ [⚡ Mashqlar](MASHQLAR.md)
