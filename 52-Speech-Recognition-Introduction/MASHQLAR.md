# 📝 52-modul mashqlari

> **22 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐⭐ **HAMMASI KALITSIZ VA INTERNETSIZ** — mahalliy kutubxonalar bilan.

## ⚙️ Tayyorgarlik

```bash
pip install numpy scipy matplotlib soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import numpy as np, scipy.signal as sig, librosa, soundfile as sf

WAV = "speech_01.wav"        # ⭐ kursning fayli (58-modul materiallari)
C = 343.0                    # tovush tezligi, m/s (20 °C, quruq havo)
```

> ## 💡 **FAYLINGIZ YO'QMI?** ## Telefonda 10–20 soniya gapirib yozing va ## `menim.wav` deb saqlang — **hamma mashq ishlaydi**.

---

# 🟢 OSON *(1–8)*

**M1.** ASR, TTS, NLU va speaker ID farqi nima?

**M2.** Garmonika va formant farqi nima?

**M3.** Nima uchun `librosa.pyin` `NaN` qaytaradi?

**M4.** `f0` uchun nima uchun `median` ishlatiladi?

**M5.** `pre-emphasis` nima qiladi?

**M6.** Audrey nima uchun faqat bitta odam uchun ishladi?

**M7.** HMM ning eng katta afzalligi nima edi?

**M8.** End-to-end yondashuvining ikkita narxi qaysi?

<details>
<summary>✅ Javoblar (1–8)</summary>

**M1.** ## **ASR** audio→matn · **TTS** matn→audio · ## **NLU** matn→ma'no · **speaker ID** audio→kim.

**M2.** ## **Garmonika** — ovoz paychalaridan, `f0` karralari. ## **Formant** — og'iz bo'shlig'idan, `f0` ga **bog'liq emas**.

**M3.** ## Ovozsiz tovushlarda `f0` **yo'q**. ## O'lchandi: freymlarning **35%**.

**M4.** ## Oktava xatolari **o'rtachani buzadi**. ## O'lchandi: median **138.2** vs o'rtacha **148.9**.

**M5.** ## Yuqori chastotalarni **ko'taradi** — ## aks holda F3, F4 **topilmaydi** *(energiyaning 59% i 300 Hz dan past)*.

**M6.** ## Shablonlar **uning ovozidan** yozilgan edi.

**M7.** ## Yangi so'z uchun **shablon kerak emas** — talaffuzini yozish kifoya.

**M8.** ## 💥 Ko'p ma'lumot *(680k soat)* · 💥 **"qora quti"**.

</details>

---

# 🟡 O'RTA *(9–17)*

**M9.** ⭐ Audio faylning to'liq pasportini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
import wave, os


def audio_pasport(yol):
    """⭐ Fayl haqida BILISH KERAK bo'lgan hamma narsa."""
    with wave.open(yol) as w:
        ch, bw, sr, n = (w.getnchannels(), w.getsampwidth(),
                         w.getframerate(), w.getnframes())
    hajm = os.path.getsize(yol)
    bitrate = sr * bw * 8 * ch

    print(f"  kanal          : {ch} ({'mono' if ch == 1 else 'stereo'})")
    print(f"  bit chuqurligi : {bw*8} bit ({2**(bw*8):,} daraja)")
    print(f"  sample rate    : {sr:,} Hz  (Nayqvist {sr//2:,} Hz)")
    print(f"  davomiylik     : {n/sr:.3f} s")
    print(f"  bitrate        : {sr} × {bw*8} × {ch} = {bitrate:,} bit/s "
          f"= {bitrate/1000:.0f} kbps")
    print(f"  fayl           : {hajm:,} bayt "
          f"(sarlavha {hajm - n*ch*bw} bayt)")

    y, _ = sf.read(yol)
    if y.ndim > 1:
        y = y.mean(axis=1)
    rms = float(np.sqrt((y ** 2).mean()))
    print(f"  RMS            : {rms:.6f} = {20*np.log10(rms):.2f} dBFS")
    print(f"  cho'qqi        : {20*np.log10(np.abs(y).max()):.2f} dBFS")
    kesilgan = int((np.abs(y) > 0.99).sum())
    print(f"  {'💥' if kesilgan else '✅'} clipping   : {kesilgan} namuna")
    return y, sr


y, sr = audio_pasport(WAV)
```

```
  kanal          : 1 (mono)
  bit chuqurligi : 24 bit (16,777,216 daraja)
  sample rate    : 44,100 Hz  (Nayqvist 22,050 Hz)
  davomiylik     : 23.512 s
  bitrate        : 44100 × 24 × 1 = 1,058,400 bit/s = 1058 kbps
  fayl           : 3,111,350 bayt (sarlavha 737 bayt)
```

## 🏆 **BU FUNKSIYANI HAR AUDIO LOYIHADA BIRINCHI ISHGA TUSHIRING.**

</details>

**M10.** ⭐ To'lqin uzunligi jadvalini quring.

<details>
<summary>✅ Yechim</summary>

```python
print("  chastota   to'lqin uzunligi      davr      izoh")
IZOH = {50: "past bas · devordan o'tadi",
        440: "A4 (LA) nota",
        1000: "nutqning markazi",
        4000: "telefon chegarasi",
        20000: "eshitish chegarasi"}
for f in [50, 100, 440, 1000, 4000, 10000, 20000]:
    lam = C / f
    print(f"  {f:6d} Hz  {lam:8.4f} m = {lam*100:7.2f} sm  "
          f"{1/f*1000:8.4f} ms  {IZOH.get(f, '')}")
```

```
      50 Hz    6.8600 m =  686.00 sm   20.0000 ms  past bas · devordan o'tadi
     440 Hz    0.7795 m =   77.95 sm    2.2727 ms  A4 (LA) nota
    1000 Hz    0.3430 m =   34.30 sm    1.0000 ms  nutqning markazi
    4000 Hz    0.0858 m =    8.58 sm    0.2500 ms  telefon chegarasi
   20000 Hz    0.0171 m =    1.71 sm    0.0500 ms  eshitish chegarasi
```

## 💡 **NIMA UCHUN QO'SHNINGIZNING BASI ESHITILADI, GAPI ESA — YO'Q?** ## Bas to'lqini **6.9 m** — devordan **o'tib ketadi**. ## Nutq to'lqini **34 sm** — devor uni **yutadi**.

</details>

**M11.** ⭐⭐ `f0` ni o'lchang va `fmin` ta'sirini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
y16, _ = librosa.load(WAV, sr=16000)

for fmin, fmax in [(60, 400), (100, 400), (140, 500)]:
    f0, v, _ = librosa.pyin(y16, fmin=fmin, fmax=fmax, sr=16000)
    ok = f0[~np.isnan(f0)]
    h, _ = np.histogram(ok, bins=[60, 100, 130, 160, 190, 220, 260, 300, 400])
    print(f"  fmin={fmin:3d}  ovozli {v.mean():.0%}  "
          f"median {np.median(ok):6.1f}  o'rt {ok.mean():6.1f}")
    print(f"     60-100-130-160-190-220-260-300-400: {h}")
```

```
  fmin= 60  ovozli 65%  median  138.2  o'rt  148.9
     [  8 205 156  42  33  14  11  11]
  fmin=100  ovozli 67%  median  135.8  o'rt  149.4
     [  0 226 155  40  28  16  16  11]
  fmin=140  ovozli 53%  median  144.5  o'rt  156.4
     [  0   0 300  43  33  11   3   0]
```

## ⭐ **`median` BARQAROR** *(138 → 136 → 145)*, ## **o'rtacha** — **149 → 149 → 156**.

## 💥 **`fmin=140` DA "ovozli" 65% → 53%** — ## haqiqiy past freymlar **rad etildi**. ⚠️ Diapazonni **haddan tashqari** toraytirmang.

</details>

**M12.** ⭐⭐ Formantlarni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def formantlar(x, sr, n_form=4, pre=True):
    x = x * np.hamming(len(x))
    if pre:
        x = sig.lfilter([1, -0.67], 1, x)
    a = librosa.lpc(x.astype(np.float64), order=int(2 + sr / 1000))
    r = np.roots(a)
    r = r[np.imag(r) > 0]
    f = np.sort(np.arctan2(np.imag(r), np.real(r)) * sr / (2 * np.pi))
    return f[(f > 90) & (f < sr / 2 - 200)][:n_form]


y8, _ = librosa.load(WAV, sr=8000)
rms = librosa.feature.rms(y=y8, frame_length=512, hop_length=256)[0]

for i in np.argsort(-rms)[:5]:
    seg = y8[int(i) * 256: int(i) * 256 + 512]
    if len(seg) < 512:
        continue
    f = formantlar(seg, 8000)
    print(f"  t={int(i)*256/8000:5.2f}s  " +
          "  ".join(f"F{k+1}={v:6.0f}" for k, v in enumerate(f)))
```

```
  t= 2.14s  F1=  235  F2= 1204  F3= 1683  F4= 2507
  t= 2.69s  F1=  192  F2= 1690  F3= 2075  F4= 2741
  t= 7.17s  F1=  416  F2= 1804  F3= 2572  F4= 3400
```

## ⚠️ **JADVAL QIYMATLARIGA AYNAN MOS EMAS — VA BU NORMAL.** ## Jadval — **o'rtacha amerikacha talaffuz**, ## har odamning og'iz bo'shlig'i **boshqa**.

</details>

**M13.** ⭐ `pre-emphasis` ta'sirini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
for i in np.argsort(-rms)[:3]:
    seg = y8[int(i) * 256: int(i) * 256 + 512]
    if len(seg) < 512:
        continue
    t = int(i) * 256 / 8000
    for pre, nom in [(True, "✅ pre-emphasis"), (False, "💥 pre-emphasissiz")]:
        f = formantlar(seg, 8000, pre=pre)
        print(f"  t={t:5.2f}s {nom:20s} " +
              "  ".join(f"F{k+1}={v:6.0f}" for k, v in enumerate(f)))
    print()
```

## 💥 **`pre-emphasis` SIZ YUQORI FORMANTLAR YO'QOLADI** yoki **siljiydi**.

</details>

**M14.** ⭐⭐ DTW ni yozing va sinang.

<details>
<summary>✅ Yechim</summary>

```python
def dtw_masofa(a, b):
    n, m = len(a), len(b)
    D = np.full((n + 1, m + 1), np.inf)
    D[0, 0] = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            D[i, j] = (abs(a[i-1] - b[j-1])
                       + min(D[i-1, j], D[i, j-1], D[i-1, j-1]))
    return D[n, m] / (n + m)


etalon = np.array([1, 2, 5, 8, 5, 2, 1], float)
TESTLAR = {
    "aynan":       etalon.copy(),
    "tez":         np.array([1, 3, 8, 4, 1], float),
    "sekin":       np.array([1, 2, 2, 5, 5, 8, 5, 5, 2, 1, 1], float),
    "shovqinli":   etalon + np.random.RandomState(0).normal(0, 0.5, 7),
    "boshqa so'z": np.array([8, 5, 1, 1, 2, 5, 8], float),
}

for nom, x in TESTLAR.items():
    d = dtw_masofa(etalon, x)
    e2 = np.interp(np.linspace(0, 1, len(x)),
                   np.linspace(0, 1, len(etalon)), etalon)
    print(f"  {'✅' if d < 0.6 else '💥'} {nom:12s} "
          f"DTW {d:6.3f}   oddiy ayirma {np.abs(e2-x).mean():6.3f}")
```

```
  ✅ aynan        DTW  0.000   oddiy ayirma  0.000
  ✅ tez          DTW  0.417   oddiy ayirma  0.200
  ✅ sekin        DTW  0.000   oddiy ayirma  0.527
  ✅ shovqinli    DTW  0.328   oddiy ayirma  0.656
  💥 boshqa so'z  DTW  1.714   oddiy ayirma  4.857
```

## 🏆 **`sekin` — DTW 0.000, oddiy usul 0.527.** ## Aynan shu farq uchun DTW **yaratilgan**.

## ⚠️ **`tez` da esa oddiy usul YAXSHIROQ** *(0.200 < 0.417)* — ## chunki bizning etalon **silliq**. ## Haqiqiy nutqda bunday **bo'lmaydi**.

</details>

**M15.** ⭐⭐ HMM yozing va xom ehtimolning muammosini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
def hmm_ehtimol(kuz, H, B, T, E):
    a = {h: B[h] * E[h].get(kuz[0], 1e-9) for h in H}
    for o in kuz[1:]:
        a = {h: sum(a[p] * T[p].get(h, 0) for p in H) * E[h].get(o, 1e-9)
             for h in H}
    return sum(a.values())


H = ["b", "i", "r"]
B = {"b": 1.0, "i": 0.0, "r": 0.0}
T = {"b": {"b": .6, "i": .4}, "i": {"i": .6, "r": .4}, "r": {"r": 1.0}}
E = {"b": {"B": .8, "I": .1, "R": .1},
     "i": {"B": .1, "I": .8, "R": .1},
     "r": {"B": .1, "I": .1, "R": .8}}

for k in ["BIR", "BBIIRR", "BBBBIIIIRRRR", "RIB", "RRIIBB", "BRI"]:
    p = hmm_ehtimol(k, H, B, T, E)
    print(f"  {k:14s} xom {p:.3e}   log/freym {np.log(p)/len(k):8.4f}")
```

```
  BIR            xom 1.021e-01   log/freym  -0.7607
  BBBBIIIIRRRR   xom 8.836e-04   log/freym  -0.5860
  RIB            xom 6.320e-03   log/freym  -1.6880   💥 XOM ehtimoli YUQORI!
```

## 💥 **XOM EHTIMOL ISHLAMAYDI** — uzunlik **hamma narsani hal qiladi**.

## 🏆 **`log/freym` ISHLAYDI:** to'g'ri variantlar **−0.59…−0.76**, noto'g'ri **−1.12…−1.75**.

</details>

**M16.** ⭐⭐ Ikki HMM modelini raqobatlashtiring.

<details>
<summary>✅ Yechim</summary>

```python
H2 = ["r", "i", "b"]
B2 = {"r": 1.0, "i": 0.0, "b": 0.0}
T2 = {"r": {"r": .6, "i": .4}, "i": {"i": .6, "b": .4}, "b": {"b": 1.0}}

for k in ["BIR", "BBIIRR", "RIB", "RRIIBB"]:
    p1, p2 = hmm_ehtimol(k, H, B, T, E), hmm_ehtimol(k, H2, B2, T2, E)
    print(f"  {k:8s} P(bir)={p1:.3e}  P(rib)={p2:.3e}  ->  "
          f"{'bir' if p1 > p2 else 'rib'}")
```

```
  BIR      P(bir)=1.021e-01  P(rib)=6.320e-03  ->  bir   ✅
  BBIIRR   P(bir)=2.421e-02  P(rib)=2.676e-05  ->  bir   ✅
  RIB      P(bir)=6.320e-03  P(rib)=1.021e-01  ->  rib   ✅
  RRIIBB   P(bir)=2.676e-05  P(rib)=2.421e-02  ->  rib   ✅
```

## 🏆 **4/4.** ## Uzunlik **ikkala modelga bir xil ta'sir qiladi** va **qisqaradi** — ## bu **haqiqiy ASR tizimlarining** ishlash prinsipi.

</details>

**M17.** ⭐ `float64` underflow ni ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
p = 1.0
for n in range(1, 1101):
    p *= 0.5
    if n in (1000, 1074, 1075):
        print(f"  {n:5d} qadam: {p:.3e}  "
              f"{'💥 NOLGA AYLANDI' if p == 0 else ''}")

lp = 0.0
for n in range(1, 2001):
    lp += np.log(0.5)
    if n in (1000, 2000):
        print(f"  {n:5d} qadam: log = {lp:10.2f}  ✅ ishlaydi")
```

```
   1000 qadam: 9.333e-302
   1074 qadam: 4.941e-324
   1075 qadam: 0.000e+00  💥 NOLGA AYLANDI
   1000 qadam: log =    -693.15  ✅ ishlaydi
```

## 💥 **10 SONIYALIK AUDIO ≈ 1000 FREYM** — ## ya'ni bu **haqiqiy** muammo, nazariy emas.

</details>

---

# 🔴 QIYIN *(18–22)*

**M18.** ⭐⭐⭐ To'liq ovoz pasportini yozing.

<details>
<summary>✅ Yechim</summary>

```python
def ovoz_pasporti(yol, fmin=60, fmax=400):
    """🇺🇿 Ovozning to'liq akustik tavsifi."""
    y, sr = librosa.load(yol, sr=16000)
    f0, v, _ = librosa.pyin(y, fmin=fmin, fmax=fmax, sr=sr)
    ok = f0[~np.isnan(f0)]
    med = float(np.median(ok))

    print(f"  davomiylik   : {len(y)/sr:.1f} s")
    print(f"  ovozli freym : {v.mean():.0%}  "
          f"(ovozsiz {1-v.mean():.0%} — s, t, k, f)")
    print(f"  f0 median    : {med:.1f} Hz")
    print(f"  f0 o'rtacha  : {ok.mean():.1f} Hz  "
          f"(farq {abs(ok.mean()-med):.1f} — oktava xatolari)")
    print(f"  f0 5–95%     : {np.percentile(ok,5):.0f} – "
          f"{np.percentile(ok,95):.0f} Hz")
    print(f"  garmonikalar : {[round(med*k) for k in range(1,6)]} Hz")

    rms = float(np.sqrt((y**2).mean()))
    print(f"  RMS          : {20*np.log10(rms):.1f} dBFS")
    print(f"  cho'qqi      : {20*np.log10(np.abs(y).max()):.1f} dBFS")
    print(f"  krest-faktor : "
          f"{20*np.log10(np.abs(y).max()/rms):.1f} dB")

    # ⭐ energiya taqsimoti
    Y = np.abs(np.fft.rfft(y))
    fr = np.fft.rfftfreq(len(y), 1/sr)
    jami = (Y**2).sum()
    print("  energiya:")
    for lo, hi in [(0, 300), (300, 1000), (1000, 3400), (3400, 8000)]:
        m = (fr >= lo) & (fr < hi)
        print(f"    {lo:5d}–{hi:5d} Hz : {(Y[m]**2).sum()/jami:6.2%}")

    # ⚠️ jins haqida XULOSA CHIQARMAYMIZ
    print(f"  ⚠️ f0 dan jinsni aniqlab BO'LMAYDI — diapazonlar kesishadi")
    return med


ovoz_pasporti(WAV)
```

## 🏆 **`krest-faktor` — ENG QIMMATLI QATOR.** ## U kvantlash SNR ini **shuncha dB ga** pasaytiradi *(54-modul)*.

</details>

**M19.** ⭐⭐⭐ Manba-filtr modelini simulyatsiya qiling.

<details>
<summary>✅ Yechim</summary>

```python
def unli_sintez(f0, F, sr=16000, davom=0.5, B=(80, 90, 120)):
    """🏆 MANBA (f0 impulslari) → FILTR (formantlar) → unli tovush."""
    n = int(sr * davom)

    # ── ① MANBA: f0 chastotali impuls poyezdi ──
    manba = np.zeros(n)
    manba[::int(sr / f0)] = 1.0

    # ── ② FILTR: har formant = rezonans ──
    y = manba.copy()
    for fc, bw in zip(F, B):
        r = np.exp(-np.pi * bw / sr)
        th = 2 * np.pi * fc / sr
        y = sig.lfilter([1 - r], [1, -2 * r * np.cos(th), r ** 2], y)

    return y / np.abs(y).max()


UNLILAR = {"/i/": (270, 2290, 3010), "/e/": (530, 1840, 2480),
           "/a/": (730, 1090, 2440), "/o/": (570, 840, 2410),
           "/u/": (300, 870, 2240)}

for nom, F in UNLILAR.items():
    for f0 in [100, 200]:          # ⭐ past va baland ovoz
        y = unli_sintez(f0, F)
        top = formantlar(y[:1024], 16000, n_form=3)
        print(f"  {nom} f0={f0:3d}  qo'yilgan {F}  "
              f"topilgan {[round(x) for x in top]}")
    sf.write(f"unli_{nom.strip('/')}.wav", unli_sintez(120, F), 16000)
```

```
  /i/ f0=100  qo'yilgan (270, 2290, 3010)  topilgan [279, 1727, 2295]
  /i/ f0=200  qo'yilgan (270, 2290, 3010)  topilgan [242,  918, 2275]
  /a/ f0=100  qo'yilgan (730, 1090, 2440)  topilgan [721, 1093, 1195]
  /a/ f0=200  qo'yilgan (730, 1090, 2440)  topilgan [774, 1017, 1088]
  /u/ f0=100  qo'yilgan (300,  870, 2240)  topilgan [301,  877, 1157]
  /u/ f0=200  qo'yilgan (300,  870, 2240)  topilgan [288,  832, 1071]
```

## ✅ **F1 HAMMA HOLATDA ANIQ TOPILDI:** ## 270→279/242 · 730→721/774 · 300→301/288. ## 🏆 **f0 100 dan 200 ga o'zgardi — F1 O'ZGARMADI.** ## Bu — **manba-filtr modelining isboti**.

## ⚠⚠ **LEKIN HALOL AYTAMIZ — YUQORI FORMANTLAR ISHONCHSIZ:**
```
/i/ f0=100  F2 qo'yilgan 2290  →  topilgan 1727   ⚠ xato
/i/ f0=200  F2 qo'yilgan 2290  →  topilgan  918   💥 butunlay xato
```

## 🔑 **SABAB — GARMONIKALAR ORASIDAGI MASOFA:**
```
f0 = 100 Hz  →  garmonikalar har 100 Hz da   →  ⭐ formant "ko'rinadi"
f0 = 200 Hz  →  garmonikalar har 200 Hz da   →  💥 formant ULAR ORASIDA YASHIRINADI
```

## 🏆 **BU — HAQIQIY VA MASHHUR HODISA:** ## **baland ovozli nutqni tahlil qilish qiyinroq**. ## Shuning uchun bolalar va yuqori ovozli ayollar nutqida ## formant analizi **yomonroq** ishlaydi.

## ⭐ **YOZILGAN FAYLLARNI TINGLANG** — ## ular haqiqiy unlilarga **o'xshaydi**.

</details>

**M20.** ⭐⭐⭐ Pichirlash simulyatsiyasi.

<details>
<summary>✅ Yechim</summary>

```python
def pichirla(F, sr=16000, davom=0.5, B=(80, 90, 120)):
    """💥 MANBA yo'q (f0 yo'q) — faqat SHOVQIN + FILTR."""
    n = int(sr * davom)
    manba = np.random.RandomState(0).normal(0, 1, n)   # ⭐ impuls emas!
    y = manba.copy()
    for fc, bw in zip(F, B):
        r = np.exp(-np.pi * bw / sr)
        th = 2 * np.pi * fc / sr
        y = sig.lfilter([1 - r], [1, -2 * r * np.cos(th), r ** 2], y)
    return y / np.abs(y).max()


for nom, F in UNLILAR.items():
    ovozli = unli_sintez(120, F)
    pich = pichirla(F)

    for tur, y in [("ovozli   ", ovozli), ("pichirlash", pich)]:
        f0, v, _ = librosa.pyin(y, fmin=60, fmax=400, sr=16000)
        top = formantlar(y[:1024], 16000, n_form=2)
        print(f"  {nom} {tur}  ovozli-freym {v.mean():4.0%}  "
              f"formantlar {[round(x) for x in top]}")
    print()
```

```
  /i/ ovozli      ovozli-freym 100%  formantlar [259, 1241]
  /i/ pichirlash  ovozli-freym  94%  formantlar [243, 1309]   ⚠️
  /e/ ovozli      ovozli-freym 100%  formantlar [523, 1033]
  /e/ pichirlash  ovozli-freym   0%  formantlar [541,  847]   ✅
  /a/ ovozli      ovozli-freym 100%  formantlar [724, 1086]
  /a/ pichirlash  ovozli-freym 100%  formantlar [743,  790]   ⚠️
  /u/ ovozli      ovozli-freym 100%  formantlar [299,  859]
  /u/ pichirlash  ovozli-freym   0%  formantlar [265,  846]   ✅
```

## ✅ **FORMANTLAR SAQLANDI — ASOSIY DA'VO TASDIQLANDI:**
```
/i/  259  ->  243        /e/  523  ->  541
/a/  724  ->  743        /u/  299  ->  265
```
## 🏆 **SHUNING UCHUN PICHIRLAGAN SO'Z TUSHUNARLI QOLADI.**

## ⚠️⚠️ **LEKIN "ovozli-freym" USTUNI ISHONCHSIZ CHIQDI:**
```
/e/ va /u/  ->    0%          ✅ kutilganidek
/i/ va /a/  ->   94% va 100%  💥 pyin SHOVQINDA ham f0 "topdi"
```

## 🔑 **BU — `pyin` NING YOLG'ON IJOBIY NATIJASI.** ## Tor formant filtridan o'tgan **oq shovqin** ## davriy signalga **o'xshab qoladi**, va algoritm **aldanadi**.

## 🏆 **DARS: BITTA ALGORITMNING CHIQISHIGA ISHONMANG.** ## `pyin` — **nutq uchun** yaratilgan; ## sintetik signalda uning natijasi **tekshirilishi** kerak.

## 💥 **VA ASR TIZIMLARI PICHIRLASHNI YOMON TANIYDI** — ## ular **ovozli nutqda** o'qitilgan.

</details>

**M21.** ⭐⭐⭐ Fonema o'zgarishini eshitiladigan qiling.

<details>
<summary>✅ Yechim</summary>

```python
def sozdan_unli(nomlar, f0=120, sr=16000, har=0.25):
    """⭐ Unlilar ketma-ketligidan 'so'z' yasaydi."""
    q = [unli_sintez(f0, UNLILAR[n], sr=sr, davom=har) for n in nomlar]
    jim = np.zeros(int(sr * 0.03))
    return np.concatenate([x for p in q for x in (p, jim)])


for nom, ketma in [("bit-bet-bot", ["/i/", "/e/", "/a/"]),
                   ("boot-bought", ["/u/", "/o/"])]:
    y = sozdan_unli(ketma)
    sf.write(f"soz_{nom}.wav", y, 16000)
    print(f"  ✅ soz_{nom}.wav  ({len(y)/16000:.2f} s)  {ketma}")

print("\n  💡 F1 va F2 farqi:")
for a, b in [("/i/", "/e/"), ("/a/", "/o/"), ("/o/", "/u/")]:
    Fa, Fb = UNLILAR[a], UNLILAR[b]
    print(f"    {a} ↔ {b}:  ΔF1 = {abs(Fa[0]-Fb[0]):4d} Hz  "
          f"ΔF2 = {abs(Fa[1]-Fb[1]):4d} Hz")
```

```
    /i/ ↔ /e/:  ΔF1 = 260 Hz  ΔF2 = 450 Hz
    /a/ ↔ /o/:  ΔF1 = 160 Hz  ΔF2 = 250 Hz
    /o/ ↔ /u/:  ΔF1 = 270 Hz  ΔF2 =  30 Hz
```

## 💡 **`/o/` ↔ `/u/` NING F2 FARQI ATIGI 30 Hz** — ## ularni ajratadigan yagona narsa — **F1** *(270 Hz)*. ## ⚠️ Agar yozuvda past chastotalar kesilgan bo'lsa *(telefon!)* — ## 💥 **bu ikki unli chalkashadi**.

## 💡 **`/a/` ↔ `/o/` — IKKALA FARQ HAM KICHIK** *(160 va 250 Hz)* — ## ular ham **tez-tez chalkashtiriladi**.

## 🇺🇿 **VA `/i/` ↔ `/iː/` FARQI O'ZBEK TILIDA UMUMAN YO'Q** — ## `ship` va `sheep` ni ajratish **qiyin bo'lishining sababi**.

</details>

**M22.** ⭐⭐⭐ Kichik lug'atli ovozli buyruq tizimini DTW bilan quring.

<details>
<summary>✅ Yechim</summary>

```python
def mfcc_ketma(y, sr=16000, n=13):
    """⭐ Audio → xususiyat ketma-ketligi (55-modulda batafsil)."""
    M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n)
    return (M - M.mean(axis=1, keepdims=True)) / (
        M.std(axis=1, keepdims=True) + 1e-9)


def dtw_kop(A, B):
    """⭐ Ko'p o'lchamli DTW (har freym — vektor)."""
    n, m = A.shape[1], B.shape[1]
    D = np.full((n + 1, m + 1), np.inf)
    D[0, 0] = 0
    for i in range(1, n + 1):
        d = np.linalg.norm(A[:, i-1:i] - B, axis=0)      # ⭐ vektorlangan
        for j in range(1, m + 1):
            D[i, j] = d[j-1] + min(D[i-1, j], D[i, j-1], D[i-1, j-1])
    return D[n, m] / (n + m)


# ① har buyruq uchun 1 ta yozuv qiling: yoq.wav, ochir.wav, toxta.wav
# ② sinov: test.wav
LUGAT = ["yoq", "ochir", "toxta"]
etalonlar = {n: mfcc_ketma(librosa.load(f"{n}.wav", sr=16000)[0])
             for n in LUGAT}

T = mfcc_ketma(librosa.load("test.wav", sr=16000)[0])
ballar = {n: dtw_kop(T, E) for n, E in etalonlar.items()}
for n, b in sorted(ballar.items(), key=lambda x: x[1]):
    print(f"  {n:8s} {b:7.3f}")
eng = min(ballar, key=ballar.get)
ikkinchi = sorted(ballar.values())[1]
print(f"\n  🏆 BUYRUQ: {eng}")
print(f"  ishonch: {ikkinchi/ballar[eng]:.2f}× "
      f"({'✅ aniq' if ikkinchi/ballar[eng] > 1.3 else '⚠️ shubhali'})")
```

## 🏆 **BU — HAQIQIY ISHLAYDIGAN TIZIM.** ## Kichik lug'at *(< 20 buyruq)* uchun ## **neyron tarmoq umuman kerak emas**.

## ⭐ **`ishonch` NISBATI — CHEGARA VAZIFASINI BAJARADI** *(51-modul, 7-dars)*: ## 1.3 dan past bo'lsa — *"tushunmadim"* deng.

</details>

---

## 📌 Modulda o'lchangan hamma narsa

| O'lchov | Natija |
|---|---|
| Fayl | 44.1 kHz · 24 bit · mono · 23.512 s |
| Bitrate | ## **1058 kbps** |
| Ovozli freymlar | ## **65%** — 35% da `f0` **yo'q** |
| `f0` median | ## **138.2 Hz** |
| `f0` o'rtacha | ## ⚠️ **148.9 Hz** — oktava xatolaridan |
| Formantlar | F1 **192–416** · F2 **1024–1804** |
| Energiya `< 300 Hz` | ## **59.12%** |
| DTW `sekin` | ## 🏆 **0.000** *(oddiy usul 0.527)* |
| DTW `boshqa so'z` | ## **1.714** — 4× uzoq ✅ |
| HMM xom ehtimol | ## 💥 **ishlamaydi** — uzunlik hal qiladi |
| HMM `log/freym` | ## 🏆 **ishlaydi** |
| HMM modellar raqobati | ## 🏆 **4/4** |
| `float64` underflow | ## 💥 **1075-qadam** |

---

🏠 [Modul boshiga](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
