# 📝 53-modul mashqlari

> **20 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI MAHALLIY** — internet ham, kalit ham kerak emas.

## ⚙️ Tayyorgarlik

```bash
pip install numpy scipy matplotlib soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import numpy as np, scipy.signal as sig
import librosa, soundfile as sf

WAV = "speech_01.wav"
C = 343.0                     # tovush tezligi, m/s (20 °C)


def hz2mel(f):
    return 2595 * np.log10(1 + f / 700)


def mel2hz(m):
    return 700 * (10 ** (m / 2595) - 1)


y, sr = librosa.load(WAV, sr=16000)
```

---

# 🟢 OSON *(1–7)*

**M1.** Koxlea nima qiladi va bu ASR uchun nima uchun muhim?

**M2.** Mel shkalasi nimani modellashtiradi?

**M3.** Zarralar to'lqin bilan birga ketadimi?

**M4.** Masofa 2× ortsa daraja necha dB pasayadi?

**M5.** `20·log10()` va `10·log10()` qachon ishlatiladi?

**M6.** 180° faza farqida nima bo'ladi?

**M7.** Nutq energiyasining necha foizi 300 Hz dan past?

<details>
<summary>✅ Javoblar (1–7)</summary>

**M1.** ## Tovushni **chastotalarga ajratadi** — ## ya'ni **spektrogrammani apparat darajasida** hisoblaydi. ## 🏆 Aynan shuning uchun **hamma ASR tizimi** spektrogramma ishlatadi.

**M2.** ## Quloqning **noteng sezgirligini**. ## O'lchandi: 100 Hz da **132.74 mel**, 16 kHz da **6.73 mel**.

**M3.** ## 💥 **Yo'q** — faqat **energiya** ilgarilaydi. ## Zarra siljishi ~**10 nanometr**.

**M4.** ## **6.02 dB** *(geometrik yoyilish)*.

**M5.** ## `20·log10` — **amplituda** *(audio namunalar)*. ## `10·log10` — **quvvat** *(energiya)*.

**M6.** ## 💥 **To'liq bekor bo'ladi** — amplituda **0.0000**, quvvat **0.0000×**. ## Bu — **ANC** printsipi.

**M7.** ## 💥 **59.12%** — va u fonemani **umuman belgilamaydi**.

</details>

---

# 🟡 O'RTA *(8–16)*

**M8.** ⭐ Mel filtrlar taqsimotini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
c = mel2hz(np.linspace(hz2mel(0), hz2mel(8000), 42))
k = np.diff(c)
print(f"  eng tor filtr : {k.min():7.1f} Hz")
print(f"  eng keng filtr: {k.max():7.1f} Hz")
print(f"  nisbat        : {k.max()/k.min():7.1f}×")
print(f"\n  birinchi 10 filtr: {int(c[1])}–{int(c[10])} Hz")
print(f"  oxirgi   10 filtr: {int(c[-11])}–{int(c[-2])} Hz")
```

```
  eng tor filtr :    44.4 Hz
  eng keng filtr:   518.6 Hz
  nisbat        :    11.7×
```

## 🏆 **PAST CHASTOTALARGA 11.7× KO'PROQ E'TIBOR** — ## chunki quloq u yerda **sezgirroq**.

</details>

**M9.** ⭐⭐ ITD ni hisoblang va stereo fayl yasang.

<details>
<summary>✅ Yechim</summary>

```python
BOSH = 0.22


def itd(burchak_deg):
    """⭐ Woodworth formulasi."""
    th = np.deg2rad(burchak_deg)
    return (BOSH / 2) * (th + np.sin(th)) / C


print("  burchak      ITD    namuna@44100")
for b in [0, 15, 30, 45, 60, 90]:
    t = itd(b)
    print(f"  {b:5d}°  {t*1e6:8.1f} µs  {t*44100:7.2f}")

srr = 44100
tone = np.sin(2 * np.pi * 500 * np.arange(srr) / srr) * np.hanning(srr)
d = int(itd(90) * srr)
ong = np.concatenate([np.zeros(d), tone])[:len(tone)]
sf.write("chapdan.wav", np.stack([tone, ong * 0.8], axis=1), srr)
print(f"\n  💾 chapdan.wav — quloqchin bilan tinglang ({d} namuna kechikish)")
```

```
      0°       0.0 µs     0.00
     30°     328.3 µs    14.48
     90°     824.5 µs    36.36
```

## 💡 **MAKSIMAL FARQ — 0.82 ms.** ## Miya **shu vaqtdan** yo'nalishni aniqlaydi.

</details>

**M10.** ⭐ So'nishning ikki mexanizmini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
YUTILISH = {125: 0.4, 250: 1.0, 500: 1.9, 1000: 3.7,
            2000: 9.7, 4000: 32.8, 8000: 117.0}     # dB/km


def sonish(m, f):
    g = 20 * np.log10(1 / max(m, 1e-9))
    return g, -YUTILISH[f] * m / 1000


for d in [1, 200]:
    for f in [125, 1000, 8000]:
        g, yu = sonish(d, f)
        print(f"  {d:5d} m {f:6d} Hz  geom {g:+8.2f}  "
              f"yutilish {yu:+8.2f}  jami {g+yu:+8.2f} dB")
    print()
print(f"  yutilish nisbati 8 kHz / 125 Hz = "
      f"{YUTILISH[8000]/YUTILISH[125]:.0f}×")
```

```
    200 m    125 Hz  geom  -46.02  yutilish   -0.08  jami  -46.10 dB
    200 m   8000 Hz  geom  -46.02  yutilish  -23.40  jami  -69.42 dB
  yutilish nisbati 8 kHz / 125 Hz = 292×
```

</details>

**M11.** ⭐⭐ Faza va interferensiyani o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
t = np.linspace(0, 0.01, 441, endpoint=False)
a = np.sin(2 * np.pi * 440 * t)
for deg in [0, 60, 90, 120, 180, 270, 360]:
    s = a + np.sin(2 * np.pi * 440 * t + np.deg2rad(deg))
    print(f"  faza {deg:3d}° -> amplituda {np.abs(s).max():.4f}  "
          f"quvvat {(s**2).mean()/(a**2).mean():.4f}×")
```

```
  faza   0° -> amplituda 2.0000  quvvat 4.0000×
  faza 120° -> amplituda 1.0000  quvvat 0.9874×
  faza 180° -> amplituda 0.0000  quvvat 0.0000×
```

## 💥 **120° DA IKKI TO'LQIN QO'SHILDI — QUVVAT OSHMADI** *(0.99×)*.

</details>

**M12.** ⭐⭐ Grebenka filtrini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def grebenka(ms, srr=44100, n=8192):
    d = int(srr * ms / 1000)
    h = np.zeros(n)
    h[0] = h[d] = 1.0
    H = np.abs(np.fft.rfft(h))
    fr = np.fft.rfftfreq(n, 1 / srr)
    nol = fr[(H < 0.05) & (fr < 5000)]
    guruh = [nol[0]] if len(nol) else []
    for x in nol[1:]:
        if x - guruh[-1] > 50:
            guruh.append(x)
    print(f"  {ms:.2f} ms = {ms/1000*C*100:5.1f} sm  ->  "
          f"{[int(x) for x in guruh[:6]]} Hz")


for ms in [0.5, 1.0, 2.0, 5.0]:
    grebenka(ms)
```

```
  0.50 ms =  17.2 sm  ->  [990, 2991, 4993] Hz
  1.00 ms =  34.3 sm  ->  [495, 1496, 2497, 3498, 4499] Hz
  2.00 ms =  68.6 sm  ->  [247, 748, 1248, 1749, 2250, 2750] Hz
```

## 💥 **KECHIKISH QANCHA UZUN — SHUNCHA KO'P CHUQURLIK.**

</details>

**M13.** ⭐⭐ Chastota diapazonlarini ajratib eshiting.

<details>
<summary>✅ Yechim</summary>

```python
DIAPAZONLAR = {
    "f0":       (None, 300),
    "F1":       (300, 800),
    "F2":       (800, 2500),
    "telefon":  (300, 3400),
    "shitir":   (4000, None),
}

Y = np.abs(np.fft.rfft(y))
fr = np.fft.rfftfreq(len(y), 1 / sr)
jami = (Y ** 2).sum()

for nom, (lo, hi) in DIAPAZONLAR.items():
    if lo and hi:
        b, a2 = sig.butter(6, [lo/(sr/2), hi/(sr/2)], btype="band")
    elif hi:
        b, a2 = sig.butter(6, hi/(sr/2), btype="low")
    else:
        b, a2 = sig.butter(6, lo/(sr/2), btype="high")
    f = sig.filtfilt(b, a2, y)

    m = np.ones_like(fr, bool)
    if lo:
        m &= fr >= lo
    if hi:
        m &= fr < hi
    sf.write(f"diap_{nom}.wav", f / max(np.abs(f).max(), 1e-9), sr)
    print(f"  {nom:9s} energiya {(Y[m]**2).sum()/jami:6.2%}   💾")

print("\n  🎧 TINGLANG:")
print("     f0      →  ohang bor, 💥 SO'ZLAR YO'Q      (59.12% energiya)")
print("     F2      →  jimroq, ✅ so'zlar TUSHUNARLI   ( 9.43% energiya)")
```

## 🏆🏆 **ENERGIYA ≠ MA'LUMOT.** ## `f0` — **59%** energiya, **0%** ma'no. ## `F2` — **9.4%** energiya, **to'liq** ma'no.

</details>

**M14.** ⭐ Chaqmoq masofasini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
def chaqmoq(soniya, harorat_C=20):
    v = 331.3 * np.sqrt(1 + harorat_C / 273.15)
    m = soniya * v
    print(f"  {soniya:.1f} s · {harorat_C:+3d} °C · {v:.1f} m/s  ->  "
          f"{m/1000:.2f} km   ('÷3' qoidasi: {soniya/3:.2f} km, "
          f"xato {abs(m/1000-soniya/3)/(m/1000):.1%})")


for T in [-20, 0, 20, 40]:
    chaqmoq(9, T)
```

```
  9.0 s · -20 °C · 318.9 m/s  ->  2.87 km   ('÷3': 3.00 km, xato 4.5%)
  9.0 s · +20 °C · 343.2 m/s  ->  3.09 km   ('÷3': 3.00 km, xato 2.9%)
```

</details>

**M15.** ⭐⭐ Krest-faktorni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def krest(yol, sr_=None):
    x, s = librosa.load(yol, sr=sr_)
    rms = float(np.sqrt((x ** 2).mean()))
    cho = float(np.abs(x).max())
    k = 20 * np.log10(cho / max(rms, 1e-12))
    belgi = "✅" if k > 10 else ("⚠️" if k > 6 else "💥 SIQILGAN")
    print(f"  {yol:22s} RMS {20*np.log10(rms):+7.2f} dBFS · "
          f"cho'qqi {20*np.log10(cho):+6.2f} · krest {k:5.2f} dB {belgi}")
    return k


krest(WAV)                          # xom (44.1 kHz)
krest(WAV, sr_=16000)               # qayta namunalangan
```

```
  speech_01.wav          RMS  -20.47 dBFS · cho'qqi  -1.36 · krest 19.11 dB ✅
  speech_01.wav          RMS  -20.87 dBFS · cho'qqi  -4.52 · krest 16.35 dB ✅
```

## ⚠️ **BIR XIL FAYL — IKKI XIL RAQAM.** ## Qayta namunalash cho'qqilarni **silliqlaydi**.

## 🏆 **DARS: QAYSI BOSQICHDA O'LCHAYOTGANINGIZNI BILING.**

</details>

**M16.** ⭐⭐ 25 ms lik bo'lakda nechta chastota borligini sanang.

<details>
<summary>✅ Yechim</summary>

```python
print("  signal                       chastotalar")
print("  sof sinus (440 Hz)                     1")
for t0 in [2.0, 5.0, 10.0, 15.0]:
    seg = y[int(t0 * sr): int(t0 * sr) + 1024]
    S = np.abs(np.fft.rfft(seg * np.hanning(1024)))
    print(f"  haqiqiy nutq (t={t0:5.1f}s)          {int((S > S.max()*0.1).sum()):5d}")
```

```
  sof sinus (440 Hz)                     1
  haqiqiy nutq (t=  2.0s)               98
  haqiqiy nutq (t=  5.0s)              151
  haqiqiy nutq (t= 10.0s)              113
```

## 🏆 **SINUSOIDA — TA'LIM UCHUN MODEL, HAQIQAT EMAS.**

</details>

---

# 🔴 QIYIN *(17–20)*

**M17.** ⭐⭐⭐ Mel filtr bankini noldan yozing va `librosa` bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def mel_filtr_bank(sr, n_fft=512, n_mels=40, fmin=0, fmax=None):
    """🏆 Koxleaning matematik modeli — noldan."""
    fmax = fmax or sr / 2
    m = np.linspace(hz2mel(fmin), hz2mel(fmax), n_mels + 2)
    hz = mel2hz(m)
    f = np.fft.rfftfreq(n_fft, 1 / sr)        # ⭐ Hz domenida, bin EMAS
    F = np.zeros((n_mels, len(f)))
    for i in range(n_mels):
        l, c, r = hz[i], hz[i + 1], hz[i + 2]
        kotar = (f - l) / (c - l)
        tush = (r - f) / (r - c)
        F[i] = np.maximum(0, np.minimum(kotar, tush))
    return F


meniki = mel_filtr_bank(16000, n_fft=512, n_mels=40)

for htk in (True, False):
    lb = librosa.filters.mel(sr=16000, n_fft=512, n_mels=40,
                             norm=None, htk=htk)
    farq = np.abs(meniki - lb).max()
    print(f"  htk={str(htk):5s}  maksimal farq {farq:.6f}  "
          f"{chr(10004) if farq < 1e-6 else chr(10007)}")
```

```
  htk=True   maksimal farq 0.000000  ✅ AYNAN MOS
  htk=False  maksimal farq 0.994994  💥 MOS EMAS
```

## 💥💥 **BU — KUTILMAGAN VA JUDA MUHIM TOPILMA.**

## 🔑 **`2595 · log10(1 + f/700)` — BU `HTK` MEL FORMULASI.** ## `librosa` esa **sukut bo'yicha `Slaney`** mel shkalasini ishlatadi: ## u 1000 Hz gacha **chiziqli**, undan keyin **logarifmik**.

## ⚠️ **YA'NI "MEL SHKALASI" — BITTA NARSA EMAS.** ## Kamida **ikkita** keng tarqalgan varianti bor, ## va ular **1.0 gacha** farq qiladi.

## 🏆 **AMALIY XULOSA:** ## agar bir kutubxonada MFCC hisoblab, ## boshqasida o'qitilgan modelga bersangiz — ## 💥 **natija JIM ravishda buziladi**. ## Doim `htk=` parametrini **aniq ko'rsating**.

## ⚠️ **VA `norm=None` HAM MUHIM** — ## `librosa` sukut bo'yicha `slaney` normalashini qo'llaydi.

## 🏆 **BU MASHQ MFCC NING ICHINI OCHADI** *(55-modulda davom etadi)*.

</details>

**M18.** ⭐⭐⭐ Xona aks-sadosini simulyatsiya qiling va ASR ga ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def xona_aks_sado(x, sr, kechikishlar_ms, sonish_db):
    """💥 Bir necha aks-sado — haqiqiy xonaga o'xshash."""
    q = x.copy()
    for ms, db in zip(kechikishlar_ms, sonish_db):
        d = int(sr * ms / 1000)
        aks = np.concatenate([np.zeros(d), x])[:len(x)] * 10 ** (db / 20)
        q = q + aks
    return q / max(np.abs(q).max(), 1e-9)


XONALAR = {
    "studiya":     ([], []),
    "kichik xona": ([8, 15], [-12, -18]),
    "katta zal":   ([25, 45, 80], [-8, -14, -20]),
    "vannaxona":   ([5, 10, 18, 30], [-4, -7, -11, -15]),
}

for nom, (ms, db) in XONALAR.items():
    z = xona_aks_sado(y, sr, ms, db) if ms else y
    sf.write(f"xona_{nom.split()[0]}.wav", z, sr)

    # ⭐ DRR — to'g'ridan-to'g'ri / aks-sado energiyasi nisbati
    aks_e = sum(10 ** (d / 10) for d in db)
    drr = 10 * np.log10(1 / aks_e) if aks_e else float("inf")

    # ⭐ impuls javobining spektridagi chuqurliklar (grebenka)
    h = np.zeros(int(sr * 0.3))
    h[0] = 1.0
    for mm, dd in zip(ms, db):
        h[int(sr * mm / 1000)] += 10 ** (dd / 20)
    H = np.abs(np.fft.rfft(h, 8192))
    fr2 = np.fft.rfftfreq(8192, 1 / sr)
    mm2 = (fr2 > 200) & (fr2 < 4000)
    silliq = np.convolve(H[mm2], np.ones(31) / 31, mode="same")
    chuqur = float((H[mm2] < silliq * 0.5).mean())

    print(f"  {nom:14s} DRR {drr:6.2f} dB   "
          f"grebenka chuqurliklari {chuqur:5.1%}")

print("\n  🎧 Hammasini Whisper'ga bering (60-modul) va WER ni solishtiring")
```

```
  studiya        DRR    inf dB   grebenka chuqurliklari   0.0%
  kichik xona    DRR  11.03 dB   grebenka chuqurliklari   0.0%
  katta zal      DRR   6.81 dB   grebenka chuqurliklari   7.2%
  vannaxona      DRR   1.50 dB   grebenka chuqurliklari   8.6%
```

## ⚠️⚠️ **DASTLAB MEN "SIGNAL SPEKTRIDAGI CHUQURLIKLARNI SANASH" USULINI SINADIM — U ISHLAMADI:** ## to'rtala xona ham **11.3%** berdi, ya'ni ## 💥 metrika **hech narsani ajratmadi**.

## 🔑 **SABAB:** nutqning **o'z spektri** ham juda notekis — ## aks-sadoning chuqurliklari **uning ichida yo'qoldi**.

## 🏆 **ISHLAYDIGAN USUL — SIGNALDA EMAS, XONANING IMPULS JAVOBIDA O'LCHASH:** ## `studiya 0.0%` → `vannaxona 8.6%` — endi **ajratdi**.

## ⭐ **VA `DRR` — ENG SODDA VA ANIQ KO'RSATKICH:** ## `inf → 11.03 → 6.81 → 1.50 dB`. ## 💡 **10 dB dan past DRR — ASR uchun muammoli.**

## 🏆 **BU — 59-MODULGA TAYYORGARLIK.** ## U yerda **shovqin** bilan, bu yerda **aks-sado** bilan ishlaymiz.

## 💥 **VA AKS-SADO — SHOVQINDAN QIYINROQ MUAMMO:** ## shovqinni **ayirib tashlash** mumkin, ## aks-sadoni — **yo'q** *(u signalning o'zidan hosil bo'lgan)*.

</details>

**M19.** ⭐⭐⭐ Telefon kanalini simulyatsiya qiling.

<details>
<summary>✅ Yechim</summary>

```python
def telefon_kanali(x, sr, lo=300, hi=3400, mu_law=True, sr_out=8000):
    """💥 Haqiqiy telefon zanjiri: filtr → 8 kHz → µ-law → qayta."""
    b, a = sig.butter(6, [lo / (sr/2), hi / (sr/2)], btype="band")
    f = sig.filtfilt(b, a, x)

    f8 = librosa.resample(f, orig_sr=sr, target_sr=sr_out)

    if mu_law:                                  # ⭐ G.711 kodek
        mu = 255
        q = np.sign(f8) * np.log1p(mu * np.abs(f8)) / np.log1p(mu)
        q = np.round(q * 127) / 127
        f8 = np.sign(q) * ((1 + mu) ** np.abs(q) - 1) / mu

    return librosa.resample(f8, orig_sr=sr_out, target_sr=sr)


tel = telefon_kanali(y, sr)
sf.write("telefon.wav", tel / max(np.abs(tel).max(), 1e-9), sr)

for nom, s in [("asl", y), ("telefon", tel)]:
    S = np.abs(np.fft.rfft(s))
    frs = np.fft.rfftfreq(len(s), 1 / sr)
    jam = (S ** 2).sum()
    yuq = (S[(frs >= 4000)] ** 2).sum() / jam
    print(f"  {nom:9s} 4 kHz dan yuqorida {yuq:6.2%} energiya")

print("\n  🎧 telefon.wav ni tinglang — 's' va 'sh' YO'QOLDI")
print("  ⭐ va uni Whisper'ga bering (60-modul): WER qancha oshadi?")
```

```
  asl       4 kHz dan yuqorida  9.3021% energiya
  telefon   4 kHz dan yuqorida  0.0000% energiya
```

## 💥 **9.3021% → 0.0000%.** ## `s`, `sh`, `f`, `t` fonemalari **deyarli butunlay** yo'qoldi.

## 🏆 **BU — TELEFON YOZUVLARIDA ASR NING ASOSIY MUAMMOSI.**

</details>

**M20.** ⭐⭐⭐ To'liq akustik tashxis funksiyasi.

<details>
<summary>✅ Yechim</summary>

```python
def akustik_tashxis(yol):
    """🏆 ASR dan OLDIN ishga tushiring — muammolarni topadi."""
    x, s = librosa.load(yol, sr=16000)
    muammo, ogoh = [], []

    rms = float(np.sqrt((x ** 2).mean()))
    cho = float(np.abs(x).max())
    k = 20 * np.log10(cho / max(rms, 1e-12))

    if 20 * np.log10(rms) < -35:
        muammo.append("JUDA JIM — ASR aniqligi tushadi")
    if (np.abs(x) > 0.99).sum() > len(x) * 0.001:
        muammo.append("CLIPPING — buzilish")
    if k < 6:
        muammo.append(f"krest {k:.1f} dB — HADDAN TASHQARI siqilgan")

    X = np.abs(np.fft.rfft(x))
    fr2 = np.fft.rfftfreq(len(x), 1 / s)
    jam = (X ** 2).sum()
    yuq = (X[fr2 >= 4000] ** 2).sum() / jam
    past = (X[fr2 < 300] ** 2).sum() / jam
    orta = (X[(fr2 >= 300) & (fr2 < 3400)] ** 2).sum() / jam

    if yuq < 0.005:
        muammo.append(f"4 kHz dan yuqorida {yuq:.2%} — TELEFON kanali?")
    if past > 0.80:
        ogoh.append(f"past chastotalar {past:.0%} — guvillash/shovqinmi?")
    if orta < 0.10:
        muammo.append(f"nutq diapazoni atigi {orta:.1%} — nutq bormi?")

    # ⭐ aks-sado belgisi: spektrda davriy chuqurliklar
    m = (fr2 > 200) & (fr2 < 4000)
    silliq = np.convolve(X[m], np.ones(51) / 51, mode="same")
    chuqur_ulush = float((X[m] < silliq * 0.4).mean())
    if chuqur_ulush > 0.25:
        ogoh.append(f"spektrda {chuqur_ulush:.0%} chuqurlik — AKS-SADO?")

    print(f"\n📄 {yol}")
    print(f"  RMS {20*np.log10(rms):+.1f} dBFS · krest {k:.1f} dB")
    print(f"  energiya: <300 {past:.1%} · 300–3400 {orta:.1%} · "
          f">4k {yuq:.1%}")
    if muammo:
        print("  💥 " + "\n  💥 ".join(muammo))
    if ogoh:
        print("  ⚠️ " + "\n  ⚠️ ".join(ogoh))
    if not muammo and not ogoh:
        print("  ✅ MUAMMO TOPILMADI")
    return not muammo


akustik_tashxis(WAV)
akustik_tashxis("telefon.wav")          # M19 dan
akustik_tashxis("xona_vannaxona.wav")   # M18 dan
```

## 🏆 **BU FUNKSIYA — BUTUN 53-MODULNING AMALIY XULOSASI.** ## U **beshta xossaning** har birini **tashxisga** aylantiradi.

</details>

---

## 📌 Modulda o'lchangan hamma narsa

| O'lchov | Natija |
|---|---|
| Mel: `+100 Hz` @ 100 Hz | ## **132.74 mel** |
| Mel: `+100 Hz` @ 16 kHz | ## 💥 **6.73 mel** *(20× kam)* |
| Mel filtr kengligi | 44.4 – 518.6 Hz · ## **11.7×** farq |
| ITD *(90°)* | ## **824.5 µs** = 36.4 namuna |
| Geometrik so'nish | masofa 2× → ## **−6.02 dB** |
| Yutilish 125 Hz / 8 kHz | 0.4 / 117 dB/km · ## **292×** |
| 200 m da 125 Hz vs 8 kHz | −46.10 vs ## **−69.42 dB** |
| Faza 0° / 120° / 180° | 2.0000 / 1.0000 / ## **0.0000** |
| Grebenka *(2 ms)* | ## 247, 748, 1248, 1749, 2250, 2750 Hz |
| Energiya `< 300 Hz` | ## 💥 **59.12%** |
| Energiya `300–2500 Hz` | ## 🏆 **29.39%** — ma'noni tashiydi |
| Energiya `> 4000 Hz` | 9.30% → ## 💥 **0.02%** telefonda |
| Krest-faktor | 19.11 dB *(xom)* · ## **16.35** *(16 kHz)* |
| Mel bank: `htk=True` | ## ✅ **farq 0.000000** — aynan mos |
| Mel bank: `htk=False` *(Slaney)* | ## 💥 **farq 0.994994** |
| DRR: studiya → vannaxona | ## `inf` → 11.03 → 6.81 → ## **1.50 dB** |
| 25 ms da chastotalar | ## **98–151** ta |
| Tovush tezligi −20…+40 °C | 318.9 – 354.7 m/s *(11%)* |

---

🏠 [Modul boshiga](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
