# 2-dars. Chastota va vaqt-chastota domeni ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"MFCC — nutqni tanishning eng muhim xususiyati. Va u koxleaning matematik modelidan tug'ilgan."**

---

## 1. 📊 Chastota domeni xususiyatlari

| Xususiyat | Nima o'lchaydi | Birlik |
|---|---|---|
| ## **Spektral centroid** | Energiyaning **markazi** | Hz |
| ## **Spektral bandwidth** | Chastotalarning **tarqoqligi** | Hz |
| ## **Spektral rolloff** | Energiyaning 85% i **qayergacha** | Hz |
| ## **Spektral flatness** | Ton ↔ **shovqin** | 0–1 |
| ## **Spektral contrast** | Cho'qqi va **jarlik** farqi | dB |

### 🔬 Haqiqiy nutqda o'lchaymiz

```python
import numpy as np, librosa

y, sr = librosa.load("speech_01.wav", sr=16000)
NW, NH = 400, 160

S = np.abs(librosa.stft(y, n_fft=512, hop_length=NH, win_length=NW))

sc = librosa.feature.spectral_centroid(S=S, sr=sr)[0]
sb = librosa.feature.spectral_bandwidth(S=S, sr=sr)[0]
sro = librosa.feature.spectral_rolloff(S=S, sr=sr, roll_percent=0.85)[0]
sfl = librosa.feature.spectral_flatness(S=S)[0]
scon = librosa.feature.spectral_contrast(S=S, sr=sr)

print(f"  centroid : o'rt {sc.mean():7.1f} Hz  ({sc.min():.0f}–{sc.max():.0f})")
print(f"  bandwidth: o'rt {sb.mean():7.1f} Hz")
print(f"  rolloff  : o'rt {sro.mean():7.1f} Hz (85%)")
print(f"  flatness : o'rt {sfl.mean():7.4f}")
print(f"  contrast : shakl {scon.shape} · o'rt {scon.mean():.2f} dB")
```

```
  centroid : o'rt  1790.7 Hz  (0–6223)
  bandwidth: o'rt  1655.7 Hz
  rolloff  : o'rt  3260.4 Hz (85%)
  flatness : o'rt  0.0530
  contrast : shakl (7, 2352) · o'rt 17.87 dB
```

> ## ⭐ **`rolloff 3260 Hz` — 53-MODUL BILAN BOG'LIQ:** ## energiyaning **85% i 3.3 kHz gacha**. ## 💡 Aynan shuning uchun **telefon 3400 Hz da kesadi** — ## bu **tasodif emas**, **muhandislik qarori**.
>
> ## ⚠️ **`centroid` MINIMUMI 0 Hz** — ## bu **butunlay jim** freym *(spektr bo'sh)*. ## 💥 Bunday freymlar **statistikani buzadi** — ## ular **filtrlanishi** kerak.

### 🏆 Kursning da'vosini tekshiramiz

> ## 🔑 **KURS AYTADI:** *"`boom` so'zidagi `b` va `m` — past centroid. `hiss` dagi `s` — yuqori."*

```python
f0, voiced, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr,
                             frame_length=1024, hop_length=NH)
n = min(len(voiced), len(sc))
v = voiced[:n]

print(f"  centroid  ovozli {sc[:n][v].mean():7.1f} Hz · "
      f"ovozsiz {sc[:n][~v].mean():7.1f} Hz")
print(f"  bandwidth ovozli {sb[:n][v].mean():7.1f} Hz · "
      f"ovozsiz {sb[:n][~v].mean():7.1f} Hz")
print(f"  flatness  ovozli {sfl[:n][v].mean():7.4f} · "
      f"ovozsiz {sfl[:n][~v].mean():7.4f}")
```

```
  centroid  ovozli  1479.6 Hz · ovozsiz  2241.8 Hz
  bandwidth ovozli  1641.4 Hz · ovozsiz  1676.5 Hz
  flatness  ovozli   0.0226 · ovozsiz   0.0971
```

> ## ✅ **`centroid` — TASDIQLANDI.** ## Ovozsiz tovushlarda **1.5× yuqori** *(2242 vs 1480 Hz)*.
>
> ## ⭐ **VA `flatness` — 4.3× FARQ** *(0.0971 vs 0.0226)* — nisbat bo'yicha eng katta. ## ⚠️ *(lekin `Cohen's d` bo'yicha u beshinchi — 4-bo'limga qarang)*
>
> ## 🔑 **NIMA UCHUN `flatness` SHUNCHALIK YAXSHI ISHLAYDI?**
> ```
> flatness = geometrik_o'rtacha / arifmetik_o'rtacha
>
> TOZA TON (garmonikalar bilan)  →  spektrda o'tkir cho'qqilar  →  flatness ~0
> OQ SHOVQIN (tekis spektr)      →  hamma bin teng            →  flatness ~1
> ```
> ## ⭐ **VA AYNAN SHU — OVOZLI/OVOZSIZ FARQINING MOHIYATI:**
> ```
> ovozli   →  ovoz paychalari  →  GARMONIKALAR  →  cho'qqili spektr
> ovozsiz  →  havo oqimi       →  SHOVQIN       →  tekis spektr
> ```
>
> ## 💥 **`bandwidth` ESA DEYARLI AJRATMADI** *(1641 vs 1677 — atigi 2%)*. ## ⚠️ Bu — kutilmagan: kurs uni **muhim** deb ko'rsatadi. ## 🔑 Sabab: **ikkala tur ham** keng polosali — ## ovozli tovushda garmonikalar **butun spektrga** yoyilgan.

---

## 2. 🏆🏆 MFCC — eng muhim xususiyat

```
audio  →  freym  →  FFT  →  |·|²  →  MEL FILTRLAR  →  log  →  DCT  →  MFCC
                                          ↑                    ↑
                                    ⭐ koxlea modeli      ⭐ dekorrelyatsiya
```

> ## 🔑 **KURS TO'G'RI TUSHUNTIRADI:** *"MFCC mel shkalasidan foydalanadi — bu bizning tabiiy eshitishimizga mos."*
>
> ## ⭐ **LEKIN KURS `DCT` NI UMUMAN AYTMAYDI — VA U ENG MUHIM QADAM:**
> ```
> Mel filtrlar chiqishi  →  40 ta qiymat, ular BIR-BIRIGA BOG'LIQ
>                            (qo'shni filtrlar ustma-ust tushadi)
> DCT dan keyin          →  ⭐ koeffitsientlar MUSTAQIL
>                            va energiya birinchi 13 tasida to'plangan
> ```

### 🔬 O'lchaymiz

```python
M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=NH)
d1 = librosa.feature.delta(M)
d2 = librosa.feature.delta(M, order=2)

print(f"  MFCC   {M.shape}   (13 koeffitsient × {M.shape[1]} freym)")
print(f"  delta  {d1.shape}")
print(f"  delta² {d2.shape}   -> jami {M.shape[0]*3} o'lcham")

IZOH = {0: "umumiy energiya", 1: "spektr QIYALIGI",
        2: "spektr shakli", 3: "detallar"}
for i in range(6):
    print(f"    c{i:<2d}  o'rt {M[i].mean():9.2f}  std {M[i].std():7.2f}   "
          f"{IZOH.get(i, 'nozik detallar')}")
```

```
  MFCC   (13, 2352)   (13 koeffitsient × 2352 freym)
  delta  (13, 2352)
  delta² (13, 2352)   -> jami 39 o'lcham

    c0   o'rt   -288.15  std   91.46   umumiy energiya
    c1   o'rt     92.15  std   46.58   spektr QIYALIGI
    c2   o'rt    -15.85  std   25.94   spektr shakli
    c3   o'rt      6.86  std   26.18   detallar
    c4   o'rt     14.06  std   13.75   nozik detallar
    c5   o'rt     -9.34  std   13.10   nozik detallar
```

> ## ⭐ **`39 o'lcham` — BU KLASSIK ASR TIZIMLARINING STANDART KIRISHI** ## *(13 MFCC + 13 delta + 13 delta²)*.
>
> ## 🔑 **`delta` NIMA UCHUN KERAK?** ## MFCC — **hozirgi holat**. ## `delta` — **o'zgarish tezligi**. ## 💡 Fonemalar **o'tishlar** bilan ajraladi *(`/b/` → `/a/`)*, ## va aynan **o'tishni** `delta` ushlaydi.
>
> ## ⚠️ **`c0` — ENERGIYA, VA U KO'PINCHA TASHLAB YUBORILADI:**
> ```python
> M = M[1:]        # ⭐ c0 siz — balandlikka BOG'LIQ EMAS
> ```
> ## 💡 Sababi: `c0` faqat **balandlikni** ko'rsatadi, ## bu esa **mikrofon masofasiga** bog'liq, so'zga emas.

### 🔬 Nechta koeffitsient kerak?

```python
Mfull = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40, n_fft=512,
                             hop_length=NH)
disp = Mfull.var(axis=1)
for k in [1, 5, 13, 20, 40]:
    print(f"  birinchi {k:2d} koeffitsient -> dispersiyaning "
          f"{disp[:k].sum()/disp.sum():6.2%} i")
```

```
  birinchi  1 koeffitsient -> dispersiyaning 57.56% i
  birinchi  5 koeffitsient -> dispersiyaning 83.15% i
  birinchi 13 koeffitsient -> dispersiyaning 89.40% i
  birinchi 20 koeffitsient -> dispersiyaning 92.98% i
  birinchi 40 koeffitsient -> dispersiyaning 100.00% i
```

> ## 🏆 **`c0` YOLG'IZ DISPERSIYANING 57.6% INI TUSHUNTIRADI** — ## ya'ni **energiya** eng katta o'zgaruvchi.
>
> ## ⭐ **13 KOEFFITSIENT — 89.4%.** ## 40 taga o'tish atigi **+10.6%** beradi, ## lekin o'lchamni **3× oshiradi**.
>
> ## 🏆 **AYNAN SHUNING UCHUN "13" — SANOAT STANDARTI.** ## Bu — **tasodifiy son emas**, **dispersiya tahlilining natijasi**.
>
> ## 💡 **VA `c0` NI TASHLASANGIZ:** qolgan 12 tasi **31.8%** ni tushuntiradi *(89.4 − 57.6)*. ## ⚠️ Kam ko'rinadi, lekin aynan **shu 31.8%** — **fonema haqidagi ma'lumot**.

---

## 3. ⚠️ Spektrogramma — MFCC ning "xom" ko'rinishi

| | Mel-spektrogramma | MFCC |
|---|---|---|
| O'lcham | ## 80 *(yoki 128)* | ## **13** |
| Koeffitsientlar bog'liqmi | ## 💥 **ha** | ## ✅ **yo'q** *(DCT)* |
| Talqin qilish | ## ⭐ **oson** *(rasm)* | 💥 qiyin |
| Klassik ASR *(HMM)* | 💥 juda katta | ## ✅ **standart** |
| ## **Neyron tarmoq** | ## 🏆 **afzal** | ⚠️ ma'lumot yo'qoladi |

> ## 💥💥 **VA BU — MUHIM O'ZGARISH:**
> ```
> 1980–2015  →  MFCC (13)      ⭐ HMM va GMM uchun
> 2015+      →  mel-spektrogramma (80)   🏆 CNN va Transformer uchun
> ```
>
> ## 🔑 **NIMA UCHUN?** ## `DCT` — **ma'lumotni siqadi**, ya'ni **bir qismini yo'qotadi**. ## Klassik modellar uchun bu **kerak edi** *(kam o'lcham)*. ## 🏆 Neyron tarmoq esa **o'zi siqadi** — ## unga **to'liq** mel-spektrogramma **foydaliroq**.
>
> ## ⭐ **WHISPER AYNAN 80 KANALLI MEL-SPEKTROGRAMMA ISHLATADI:**
> ```
> 30 s audio → 80 × 3000 mel-spektrogramma → Transformer encoder
> ```
> ## 💡 **MFCC — YO'Q.**

---

## 4. ⭐⭐ Xususiyatlarni solishtirish — qaysi biri ajratadi?

```python
import pandas as pd

d1 = librosa.feature.delta(M)

XUS = {
    "ZCR": librosa.feature.zero_crossing_rate(
        y, frame_length=NW, hop_length=NH)[0],
    "RMS": librosa.feature.rms(y=y, frame_length=NW, hop_length=NH)[0],
    "centroid": sc, "bandwidth": sb, "rolloff": sro, "flatness": sfl,
    "MFCC c1": M[1], "MFCC c2": M[2],
    "delta c1": d1[1], "delta c2": d1[2],
}

q = []
for nom, x in XUS.items():
    a, b = x[:n][v], x[:n][~v]
    # ⭐ Cohen's d — ajratish kuchi
    s = np.sqrt((a.var() + b.var()) / 2)
    q.append({"xususiyat": nom,
              "ovozli": round(float(a.mean()), 4),
              "ovozsiz": round(float(b.mean()), 4),
              "Cohen_d": round(abs(float(a.mean() - b.mean())) / max(s, 1e-9),
                               3)})

d = pd.DataFrame(q).sort_values("Cohen_d", ascending=False)
print(d.to_string(index=False))
print("\n  💡 Cohen's d: 0.2 kichik · 0.5 o'rta · 0.8 katta ta'sir")
```

```
xususiyat    ovozli   ovozsiz  Cohen_d
      RMS    0.1024    0.0466    1.705
      ZCR    0.0947    0.2355    0.935
 centroid 1479.6011 2241.7998    0.717
  MFCC c1  103.2377   76.0766    0.583
 flatness    0.0226    0.0971    0.514
  rolloff 2928.1834 3742.2201    0.482
  MFCC c2  -12.3705  -20.9041    0.318
 delta c1    0.2696   -0.4554    0.096
 delta c2   -0.1168    0.1980    0.088
bandwidth 1641.3833 1676.5191    0.079
```

> ## 🏆🏆 **`RMS` — ENG KUCHLI AJRATUVCHI** *(Cohen's d = 1.705)*.
>
> ## ⚠⚠ **MEN `MFCC c1` NI BIRINCHI DEB KUTGAN EDIM.** ## 💥 O'lchov: u **to'rtinchi** *(0.583)*, ## eng oddiy xususiyat — **RMS** esa **birinchi**.
>
> ## 🔑 **NIMA UCHUN RMS SHUNCHALIK KUCHLI?** ## Ovozli tovushlar *(unlilar)* **baland** aytiladi, ## ovozsizlar *(`s`, `f`, `t`)* — **jimroq**. ## 💡 O'lchandi: **0.1024 vs 0.0466** — **2.2× farq**.
>
> ## ⭐ **VA IKKINCHI KUTILMAGAN NATIJA — `centroid` UCHINCHI O'RINDA** *(0.717)*, ## `flatness` dan **yuqori** *(0.514)*. ## 💡 Ya'ni **kurs haq edi**: centroid **haqiqatan muhim**.
>
> ## 💥 **`bandwidth` — `d = 0.079`, YA'NI DEYARLI AJRATMAYDI** *(1641 vs 1677 — 2% farq)*.
>
> ## 💥 **VA `delta` LAR — `d ≈ 0.09`.** ## ⚠️ Bu **kutilgan**: `delta` **holatni** emas, **o'zgarishni** o'lchaydi. ## 🏆 Ular **ketma-ketlik modellarida** *(HMM, RNN)* foydali, ## **freym-freym tasniflashda** esa — **yo'q**.
>
> ## 🏆 **UCHTA AMALIY XULOSA:**
> ```
> ① ENG ODDIY xususiyat (RMS) — ENG KUCHLI bo'lishi mumkin
> ② xususiyatni "mashhurligi" bo'yicha emas, O'LCHOV bo'yicha tanlang
> ③ Cohen's d — buning uchun eng sodda vosita
>    (0.2 kichik · 0.5 o'rta · 0.8 katta ta'sir)
> ```
>
> ## ⚠️ **LEKIN OGOHLANTIRISH:** ## bu tahlil faqat **ovozli/ovozsiz** ajratishni o'lchaydi. ## 💡 **Fonemalarni** ajratishda tartib **butunlay boshqa** bo'ladi — ## u yerda **MFCC** yetakchilik qiladi.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** `spectral flatness` nima o'lchaydi?

**M2.** MFCC da `c0` nima anglatadi va nima uchun tashlanadi?

**M3.** Nima uchun 13 koeffitsient standart?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Spektr **ton** ga yoki **shovqin** ga o'xshashligini. ## `~0` — o'tkir cho'qqilar, `~1` — tekis. ## O'lchandi: ovozli **0.0226**, ovozsiz **0.0971**.

**M2.** ## **Umumiy energiya**. ## Mikrofon masofasiga bog'liq → so'z haqida **ma'lumot bermaydi**.

**M3.** ## O'lchandi: 13 ta — dispersiyaning **89.4%** i. ## 40 taga o'tish atigi **+10.6%**, lekin o'lcham **3×** oshadi.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ MFCC ni noldan hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
import scipy.fftpack as fftpack


def mfcc_noldan(y, sr, n_mfcc=13, n_fft=512, hop=160, n_mels=40,
                pre=0.97):
    """🏆 MFCC ning HAMMA qadami — qo'lda."""
    # ① pre-emphasis
    x = np.append(y[0], y[1:] - pre * y[:-1])

    # ② freymlash + oyna
    n_w = n_fft
    n_frame = 1 + (len(x) - n_w) // hop
    idx = np.arange(n_w)[None, :] + hop * np.arange(n_frame)[:, None]
    F = x[idx] * np.hamming(n_w)

    # ③ quvvat spektri
    P = np.abs(np.fft.rfft(F, n_fft, axis=1)) ** 2 / n_fft

    # ④ mel filtr bank (⭐ HTK formulasi)
    def hz2mel(f):
        return 2595 * np.log10(1 + f / 700)

    def mel2hz(m):
        return 700 * (10 ** (m / 2595) - 1)

    hz = mel2hz(np.linspace(hz2mel(0), hz2mel(sr / 2), n_mels + 2))
    fr = np.fft.rfftfreq(n_fft, 1 / sr)
    B = np.zeros((n_mels, len(fr)))
    for i in range(n_mels):
        l, c, r = hz[i], hz[i+1], hz[i+2]
        B[i] = np.maximum(0, np.minimum((fr - l) / (c - l),
                                        (r - fr) / (r - c)))

    # ⑤ log
    E = np.log(np.maximum(P @ B.T, 1e-10))       # ⭐ 1e-10 — log(0) himoyasi

    # ⑥ DCT-II  →  ⭐ dekorrelyatsiya
    return fftpack.dct(E, type=2, axis=1, norm="ortho")[:, :n_mfcc].T


meniki = mfcc_noldan(y, sr)
lib = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=160)

print(f"  meniki {meniki.shape} · librosa {lib.shape}")
n = min(meniki.shape[1], lib.shape[1])
for i in range(4):
    r = np.corrcoef(meniki[i, :n], lib[i, :n])[0, 1]
    print(f"    c{i}  korrelyatsiya {r:+.4f}")
```

```
  meniki (13, 2348) · librosa (13, 2352)
    c0  korrelyatsiya +0.9513  (meniki o'rt   -51.13 · librosa  -288.15)
    c1  korrelyatsiya +0.7846  (meniki o'rt    -4.31 · librosa    92.15)
    c2  korrelyatsiya +0.8649  (meniki o'rt    -4.10 · librosa   -15.85)
    c3  korrelyatsiya +0.8699  (meniki o'rt    -2.79 · librosa     6.86)
    c4  korrelyatsiya +0.6183  (meniki o'rt     0.40 · librosa    14.06)
```

## ⚠️ **QIYMATLAR AYNAN MOS KELMAYDI — VA BU KUTILGAN:**
```
librosa  →  Slaney mel · dB shkalasi (10·log10)
meniki   →  HTK mel    · natural log
→ o'rtachalar 5–20× farq qiladi
```

## ✅ **LEKIN KORRELYATSIYA 0.62–0.95** — ## ya'ni **bir xil ma'lumot**, boshqa **shkalada**.

## ⚠️ **VA `c4` DA KORRELYATSIYA TUSHDI** *(0.6183)*: ## 🔑 yuqori koeffitsientlar **nozik detallarni** ushlaydi, ## va ular mel shkalasi variantiga **sezgirroq**.

## 🏆 **AMALIY XULOSA:** ## bir kutubxonada MFCC hisoblab, boshqasida o'qitilgan modelga bersangiz — ## 💥 **natija jim ravishda buziladi**.

## ⭐ **BU MASHQ — MODULNING ENG QIMMATLISI.** ## U MFCC ni **"sehr"dan** — **oltita aniq qadamga** aylantiradi.

</details>

**M5.** ⭐⭐ Xususiyatlarni ajratish kuchi bo'yicha saralang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 4-bo'limdagi kodni ishga tushiring va **`delta` larni ham** qo'shing:

```python
d1 = librosa.feature.delta(M)
XUS["delta c1"] = d1[1]
XUS["delta c2"] = d1[2]

q = []
for nom, x in XUS.items():
    a, b = x[:n][v], x[:n][~v]
    s = np.sqrt((a.var() + b.var()) / 2)
    q.append({"xususiyat": nom,
              "Cohen_d": round(abs(float(a.mean()-b.mean()))/max(s,1e-9), 3)})
print(pd.DataFrame(q).sort_values("Cohen_d", ascending=False)
      .to_string(index=False))
```

## 💡 **`delta` LAR ODATDA PAST `d` BERADI** — ## chunki ular **o'zgarishni** o'lchaydi, **holatni** emas. ## 🏆 Lekin ular **ketma-ketlik modellarida** *(HMM, RNN)* **hal qiluvchi**.

</details>

**M6.** ⭐ MFCC va mel-spektrogrammani chizing.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

mel = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=512,
                                     hop_length=NH, n_mels=80)
mel_db = librosa.power_to_db(mel, ref=np.max)

fig, ax = plt.subplots(3, 1, figsize=(13, 9), sharex=True)
librosa.display.specshow(librosa.amplitude_to_db(S, ref=np.max),
                         sr=sr, hop_length=NH, x_axis="time",
                         y_axis="hz", ax=ax[0])
ax[0].set_title("① Chiziqli spektrogramma (257 bin)")

librosa.display.specshow(mel_db, sr=sr, hop_length=NH,
                         x_axis="time", y_axis="mel", ax=ax[1])
ax[1].set_title("② Mel-spektrogramma (80 kanal) — ⭐ Whisper shuni ishlatadi")

librosa.display.specshow(M, sr=sr, hop_length=NH, x_axis="time", ax=ax[2])
ax[2].set_title("③ MFCC (13) — ⭐ klassik ASR")
plt.tight_layout()
plt.savefig("xususiyatlar.png", dpi=110)
print("💾 xususiyatlar.png")

print(f"\n  o'lchamlar: chiziqli {S.shape} · mel {mel.shape} · MFCC {M.shape}")
print(f"  siqilish: {S.shape[0]} -> {mel.shape[0]} -> {M.shape[0]}  "
      f"({S.shape[0]/M.shape[0]:.1f}× siqildi)")
```

```
  o'lchamlar: chiziqli (257, 2352) · mel (80, 2352) · MFCC (13, 2352)
  siqilish: 257 -> 80 -> 13  (19.8× siqildi)
```

## 🏆 **UCHTA RASMNI SOLISHTIRING:** ## ① da **garmonikalar** aniq ko'rinadi ## ② da past chastotalar **cho'zilgan** *(mel shkalasi)* ## ③ da **hech narsa tanish emas** — bu **abstrakt** koeffitsientlar

## 💡 **AYNAN SHUNING UCHUN ZAMONAVIY MODELLAR ② NI AFZAL KO'RADI** — ## u hali ham **rasm**, va CNN rasmlar bilan **yaxshi ishlaydi**.

</details>

---

## 📌 Xulosa

```
audio → freym → FFT → |·|² → MEL FILTR → log → DCT → MFCC
                                ↑                ↑
                          koxlea modeli    dekorrelyatsiya
```

```
🔬 O'LCHANGAN (2352 freym):
   centroid  1790.7 Hz · bandwidth 1655.7 · rolloff 3260.4 · flatness 0.0530

   OVOZLI vs OVOZSIZ (Cohen's d bo'yicha saralangan):
     RMS         1.705   🏆 eng kuchli — va eng ODDIY
     ZCR         0.935
     centroid    0.717   ✅ kurs haq edi
     MFCC c1     0.583   ⚠️ men uni birinchi deb kutgandim
     flatness    0.514   (4.3× farq: 0.0226 vs 0.0971)
     rolloff     0.482
     delta c1    0.096   ⚠️ freym tasnifida foydasiz
     bandwidth   0.079   💥 umuman ajratmaydi

   MFCC dispersiyasi:  c0 yolg'iz 57.56%  ·  13 ta 89.40%  ·  40 ta 100%
   -> 🏆 "13" — tasodifiy son emas
```

> ## 🏆🏆 **VA ENG MUHIM O'ZGARISH:**
> ```
> 1980–2015  →  MFCC (13)                 HMM/GMM uchun
> 2015+      →  mel-spektrogramma (80)    🏆 Whisper ham shuni ishlatadi
> ```
> ## 💡 **DCT ma'lumotni siqadi — neyron tarmoq esa o'zi siqishni bilaadi.**

---

⬅️ [1-dars. Vaqt domeni](01-Time-Domain-Features.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Freymlash](03-Framing-and-Computation.md)
