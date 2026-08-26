# 1-dars. Vaqt domeni xususiyatlari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Xom to'lqindan to'g'ridan-to'g'ri hisoblanadi. Furye kerak emas."**

---

## 1. Uch toifa

| Toifa | Nima ko'radi | Misol |
|---|---|---|
| ## ⏱️ **Vaqt domeni** | To'lqinning **o'zi** | ZCR · RMS · ogib |
| ## 📊 **Chastota domeni** | Qaysi **tonlar** bor | Spektral centroid |
| ## 🏆 **Vaqt-chastota** | Tonlar **qanday o'zgaradi** | ## ⭐ **MFCC** · spektrogramma |

> ## 🔑 **VAQT DOMENINING AFZALLIGI — TEZLIK.** ## Furye kerak emas, ## demak **real vaqtda** hisoblasa bo'ladi.

---

## 2. ⭐⭐ ZCR — nol chizig'ini kesish tezligi

> ## 🔑 **KURSNING TA'RIFI:** *"Signal musbatdan manfiyga necha marta o'tishini sanaydi."*
>
> ```
> ZCR yuqori  →  signal tez o'zgaradi  →  YUQORI chastota
> ZCR past    →  signal sekin o'zgaradi →  PAST chastota
> ```

### 🔬 Kursning da'vosini tekshiramiz

```python
import numpy as np, librosa

y, sr = librosa.load("speech_01.wav", sr=16000)
NW, NH = 400, 160                     # ⭐ 25 ms / 10 ms — standart

zcr = librosa.feature.zero_crossing_rate(y, frame_length=NW,
                                         hop_length=NH)[0]
f0, voiced, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr,
                             frame_length=1024, hop_length=NH)

n = min(len(voiced), len(zcr))
v, z = voiced[:n], zcr[:n]

print(f"  ovozli  ({int(v.sum()):4d} freym): ZCR o'rt {z[v].mean():.4f}")
print(f"  ovozsiz ({int((~v).sum()):4d} freym): ZCR o'rt {z[~v].mean():.4f}")
print(f"  nisbat: {z[~v].mean()/z[v].mean():.2f}×")
```

```
  ovozli  (1392 freym): ZCR o'rt 0.0947
  ovozsiz ( 960 freym): ZCR o'rt 0.2355
  nisbat: 2.49×
```

> ## ✅✅ **KURSNING DA'VOSI TASDIQLANDI.** ## Ovozsiz tovushlarda ZCR **2.49× yuqori**.
>
> ## 🔑 **NIMA UCHUN?**
> ```
> OVOZLI (a, o, m, n)  →  ovoz paychalari davriy tebranadi
>                          f0 ~138 Hz  →  sekin o'tishlar
>
> OVOZSIZ (s, sh, f, t) →  havo oqimidan SHOVQIN
>                          energiya 4–8 kHz da  →  ⭐ tez o'tishlar
> ```
>
> ## ⭐ **AMALIY QO'LLANISH — ARZON VAD** *(Voice Activity Detection)*:
> ```python
> nutq = (rms > rms_chegara) & (zcr < zcr_chegara)
> ```
> ## 💡 **RMS + ZCR birgalikda** — **jimlik**, **nutq** va **shovqinni** ajratadi.
>
> ## ⚠️ **LEKIN CHEKLOVI BOR:**
> ```
> 💥 fon shovqini ham YUQORI ZCR beradi
> 💥 shuning uchun ZCR YOLG'IZ ishlatilmaydi
> ```

---

## 3. ⭐ RMS energiya

```
RMS = √( mean( x² ) )
```

> ## 🔑 **KURS TO'G'RI TUSHUNTIRADI:** *"Amplituda musbat ham, manfiy ham bo'lishi mumkin. Yechim: kvadratga oshiring, o'rtachasini oling, ildiz chiqaring."*

```python
rms = librosa.feature.rms(y=y, frame_length=NW, hop_length=NH)[0]
print(f"  RMS: o'rt {rms.mean():.4f} · min {rms.min():.6f} · "
      f"maks {rms.max():.4f}")
```

```
  RMS: o'rt 0.0796 · min 0.000000 · maks 0.1968
```

> ## ⚠️ **`min 0.000000` — DIQQAT.** ## Bu — **butunlay jim** freym. ## 💥 `20*log10(0)` = **−inf** → keyingi hisoblar **buziladi**.
>
> ## 🏆 **DOIM HIMOYA QO'YING:**
> ```python
> db = 20 * np.log10(np.maximum(rms, 1e-12))     # ⭐ SHART
> ```

---

## 4. ⭐ Temporal centroid — energiyaning "og'irlik markazi"

> ## 🔑 **KURSNING TASHBEHI YAXSHI:** *"Bu — teng og'irlikli tarozi. Qo'shiq baland qismga qarab og'ib ketadi."*

```python
t = np.arange(len(rms)) * NH / sr
tc = float((t * rms ** 2).sum() / (rms ** 2).sum())
print(f"  temporal centroid: {tc:.2f} s / {len(y)/sr:.2f} s "
      f"({tc/(len(y)/sr):.1%})")
```

```
  temporal centroid: 11.62 s / 23.51 s (49.4%)
```

> ## ✅ **49.4% — DEYARLI ANIQ O'RTASIDA.** ## Bu — **tekis, bir maromli** nutq belgisi.
>
> ## ⭐ **QACHON FOYDALI:**
> ```
> ~50%   →  tekis nutq (e'lon, o'qish)
> < 35%  →  boshida baland, keyin so'nadi
> > 65%  →  sekin boshlanib, oxirida kuchayadi
> ```
> ## 💥 **LEKIN NUTQNI TANISHDA DEYARLI ISHLATILMAYDI** — ## u **butun fayl** haqida bitta son beradi, ## fonemalar haqida esa **hech narsa**.

---

## 5. ⭐ Amplituda ogibi

```python
env = np.array([np.abs(y[i:i+NW]).max()
                for i in range(0, len(y)-NW, NH)])
print(f"  ogib: o'rt {env.mean():.4f} · maks {env.max():.4f}")
print(f"  RMS bilan korrelyatsiya: "
      f"{np.corrcoef(env[:len(rms)], rms[:len(env)])[0,1]:.4f}")
```

```
  ogib: o'rt 0.2149 · maks 0.5941
  RMS bilan korrelyatsiya: 0.8682
```

> ## ⚠️⚠️ **KORRELYATSIYA 0.87 — YA'NI OGIB VA RMS DEYARLI BIR XIL NARSANI O'LCHAYDI.**
>
> ## 🔑 **AMALIY XULOSA — IKKALASINI BIRGA ISHLATISH KAM FOYDA:** ## model uchun bu **ortiqcha o'lcham**.
>
> ## 💡 **FARQI QAYERDA?**
> ```
> RMS  →  o'rtacha energiya      ⭐ barqaror, shovqinga chidamli
> ogib →  MAKSIMAL amplituda     ⚠️ bitta "chert" hammasini buzadi
> ```
> ## 🏆 **NUTQ UCHUN — `RMS`.** ## Ogib — **musiqada** *(attack/sustain/release)* foydaliroq.

---

## 6. 🇺🇿 Amaliy vosita — arzon VAD

```python
def vad(y, sr, nw=400, nh=160, rms_p=25, zcr_maks=0.35):
    """⭐ RMS + ZCR asosidagi nutq detektori. Furye KERAK EMAS."""
    rms = librosa.feature.rms(y=y, frame_length=nw, hop_length=nh)[0]
    zcr = librosa.feature.zero_crossing_rate(
        y, frame_length=nw, hop_length=nh)[0]
    n = min(len(rms), len(zcr))
    rms, zcr = rms[:n], zcr[:n]

    # ⭐ chegara — ma'lumotdan, taxmin EMAS
    chegara = float(np.percentile(rms, rms_p)) * 2.5
    nutq = (rms > chegara) & (zcr < zcr_maks)

    print(f"  RMS chegarasi {chegara:.5f} · "
          f"nutq {nutq.mean():.1%} · jimlik {1-nutq.mean():.1%}")
    return nutq, rms, zcr
```

```
  RMS chegarasi 0.09483 · nutq 37.0% · jimlik 63.0%
```

> ## 💥💥 **37% — BU JUDA PAST.** ## Fayl aslida **97.7% nutq** *(54-modulda `librosa` bilan o'lchandi)*.
>
> ## 🔑 **NIMA UCHUN?** ## `percentile(rms, 25) × 2.5` — ## bu faylda **juda baland** chegara chiqdi *(0.09483)*, ## chunki bu fayl **butunlay nutq** — ## ya'ni `percentile(rms, 25)` **jimlik emas**, **jim nutq**.
>
> ## 🏆 **UCH USULNI SOLISHTIRAMIZ:**
> ```
> p25 × 2.5                      chegara 0.09483  ->  nutq 37.0%   💥
> min(p10 × 3, maks × 0.10)      chegara 0.01968  ->  nutq 86.6%   ⭐
> librosa.effects.split(top_db=30)               ->  nutq 97.7%   ✅
> ```
>
> ## ⭐ **IKKINCHI USUL ANCHA YAXSHI:**
> ```python
> # ⚠️ mutlaq chegara ham, nisbiy ham EMAS — ikkalasining KICHIGI
> chegara = min(float(np.percentile(rms, 10)) * 3.0,
>               float(rms.max()) * 0.10)
> ```
>
> ## 💡 **VA `librosa.effects.split()` — ENG YAXSHISI:** ## u **cho'qqidan** `top_db` past bo'lgan joyni jimlik deb hisoblaydi, ## ya'ni chegara **doim signalning o'z darajasiga** bog'langan.
>
> ## 🏆 **DARS: CHEGARANI "MA'LUMOTDAN" OLISH — YETARLI EMAS.** ## Ma'lumotning **o'zi** qanday ekanini bilish kerak.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** ZCR ovozli va ovozsiz tovushlarda qanday farq qiladi?

**M2.** Nima uchun RMS da kvadrat va ildiz kerak?

**M3.** Ogib va RMS orasidagi korrelyatsiya qancha?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Ovozsizda **2.49× yuqori** *(o'lchandi: 0.2355 vs 0.0947)*.

**M2.** ## Amplituda **manfiy** ham bo'ladi; ## kvadrat uni **musbat** qiladi, ildiz esa **asl birlikka** qaytaradi.

**M3.** ## **0.8682** — ya'ni ular **deyarli bir xil narsani** o'lchaydi.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ ZCR va ovozlilikni bog'lang.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

t = np.arange(n) * NH / sr
fig, ax = plt.subplots(3, 1, figsize=(12, 7), sharex=True)
ax[0].plot(np.arange(len(y)) / sr, y, lw=.3, color="#38bdf8")
ax[0].set_ylabel("to'lqin")
ax[1].plot(t, z, lw=.8, color="#fbbf24")
ax[1].axhline(z[v].mean(), ls="--", color="#4ade80", label="ovozli o'rt")
ax[1].axhline(z[~v].mean(), ls="--", color="#f87171", label="ovozsiz o'rt")
ax[1].set_ylabel("ZCR")
ax[1].legend(fontsize=8)
ax[2].fill_between(t, v.astype(float), step="mid", color="#4ade80", alpha=.5)
ax[2].set_ylabel("ovozli")
ax[2].set_xlabel("s")
plt.tight_layout()
plt.savefig("zcr_ovozli.png", dpi=110)
print("💾 zcr_ovozli.png")

# ⭐ ZCR yolg'iz ovozlilikni qanchalik aniqlaydi?
for ch in [0.10, 0.15, 0.20, 0.25]:
    taxmin = z < ch
    aniqlik = (taxmin == v).mean()
    print(f"  ZCR < {ch:.2f}  ->  aniqlik {aniqlik:.1%}")
```

```
  ZCR < 0.10  ->  aniqlik 80.0%
  ZCR < 0.15  ->  aniqlik 77.3%
  ZCR < 0.20  ->  aniqlik 67.6%
  ZCR < 0.25  ->  aniqlik 65.9%
  ZCR < 0.30  ->  aniqlik 65.6%
```

## ⭐ **ENG YAXSHISI — `ZCR < 0.10` da 80.0%.**

## ⚠️ **VA E'TIBOR BERING — CHEGARA OSHGANI SARI ANIQLIK TUSHADI.** ## Men **o'rtacha qiymatlar orasidan** *(0.0947 va 0.2355)* ## eng yaxshi chegara chiqadi deb kutgandim — ## 💥 aslida **eng past chegarada** eng yaxshi natija.

## 🔑 **SABAB:** taqsimotlar **kesishadi**. ## Ko'p ovozsiz freymning ZCR i **past**, ## shuning uchun chegarani pasaytirish ## **ko'proq ovozsizni to'g'ri** tasniflaydi.

## 🏆 **80% — YOMON EMAS, LEKIN YETARLI EMAS.** ## Shuning uchun ZCR **doim boshqa xususiyatlar bilan** ishlatiladi.

</details>

**M5.** ⭐ Freym o'lchamining ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
for ms_w, ms_h in [(10, 5), (25, 10), (32, 8), (50, 25)]:
    nw, nh = int(sr * ms_w / 1000), int(sr * ms_h / 1000)
    zz = librosa.feature.zero_crossing_rate(
        y, frame_length=nw, hop_length=nh)[0]
    rr = librosa.feature.rms(y=y, frame_length=nw, hop_length=nh)[0]
    print(f"  oyna {ms_w:3d} ms qadam {ms_h:3d} ms -> {len(zz):5d} freym · "
          f"ZCR std {zz.std():.4f} · RMS std {rr.std():.4f}")
```

```
  oyna  10 ms qadam   5 ms ->  4703 freym · ZCR std 0.1619 · RMS std 0.0443
  oyna  25 ms qadam  10 ms ->  2352 freym · ZCR std 0.1568 · RMS std 0.0430
  oyna  32 ms qadam   8 ms ->  2939 freym · ZCR std 0.1542 · RMS std 0.0424
  oyna  50 ms qadam  25 ms ->   941 freym · ZCR std 0.1469 · RMS std 0.0412
```

## 💡 **KICHIK OYNA → KO'PROQ FREYM, KATTAROQ `std` (shovqinliroq).** ## **KATTA OYNA → SILLIQROQ, LEKIN TEZ O'ZGARISHLAR YO'QOLADI.**

## ⚠️ **LEKIN FARQ KICHIK:** `std` 0.1619 dan 0.1469 gacha — atigi **9%**. ## 🔑 Ya'ni oyna o'lchami — **hal qiluvchi parametr emas**; ## muhimi **freymlar soni** *(4703 vs 941 — 5× farq)*.

## 🏆 **25 ms / 10 ms — SANOAT STANDARTI.** ## Sabab: fonema **~50–100 ms**, ## 25 ms oyna uning **ichida** qoladi.

</details>

**M6.** ⭐⭐ VAD yozing va uni `librosa.effects.split()` bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def vad2(y, sr, nw=400, nh=160, zcr_maks=0.35):
    """⭐ Ikki chegaraning KICHIGI — barqarorroq."""
    rms = librosa.feature.rms(y=y, frame_length=nw, hop_length=nh)[0]
    zcr = librosa.feature.zero_crossing_rate(
        y, frame_length=nw, hop_length=nh)[0]
    n = min(len(rms), len(zcr))
    rms, zcr = rms[:n], zcr[:n]

    chegara = min(float(np.percentile(rms, 10)) * 3.0,
                  float(rms.max()) * 0.10)
    return (rms > chegara) & (zcr < zcr_maks), chegara


nutq, ch = vad2(y, sr)
print(f"  vad2:  chegara {ch:.5f} · nutq {nutq.mean():.1%}")

# ⭐ librosa bilan solishtiramiz
oraliq = librosa.effects.split(y, top_db=30)
lib_nutq = sum(e - b for b, e in oraliq) / len(y)
print(f"  librosa (top_db=30): nutq {lib_nutq:.1%}")
```

## ⚠️ **NATIJALAR FARQ QILADI — VA BU NORMAL.** ## Ikki usul **"nutq" ni turlicha** ta'riflaydi.

## 🏆 **QAYSI BIRI TO'G'RI? — MAQSADGA BOG'LIQ.** ## Whisper'ga berish uchun — **kesmagan** ma'qul.

</details>

---

## 📌 Xulosa

```
VAQT DOMENI = xom to'lqindan TO'G'RIDAN-TO'G'RI  →  ⭐ Furye kerak emas

ZCR   →  nol kesishlar soni    →  ovozli/ovozsiz
RMS   →  √(mean(x²))           →  energiya
tc    →  energiya markazi      →  butun fayl haqida 1 son
ogib  →  maksimal amplituda    →  RMS bilan 0.87 korrelyatsiya
```

```
🔬 O'LCHANGAN (23.5 s, 25/10 ms freym, 2352 freym):
   ZCR ovozli  0.0947  ·  ovozsiz 0.2355   →  ✅ 2.49× (kurs HAQ)
   RMS o'rt 0.0796 · min 0.000000 💥        →  log oldidan himoya SHART
   temporal centroid 11.62 s (49.4%)        →  tekis nutq
   ogib ↔ RMS korrelyatsiya 0.8682          →  ⚠️ ortiqcha o'lcham

⚠️ ZCR YOLG'IZ ovozlilikni eng yaxshi holda 80.0% aniqlaydi
💥 "percentile(rms,25)×2.5" chegarasi 37% nutq berdi (aslida 97.7%)
⭐ "min(p10×3, maks×0.10)" → 86.6%  ·  librosa.split → 97.7%
```

> ## 🏆 **DARS: CHEGARANI MA'LUMOTDAN OLISH YETARLI EMAS — MA'LUMOTNING O'ZI QANDAY EKANINI BILING.**

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Chastota domeni](02-Frequency-Domain-Features.md)
