# 1-dars. Audio fayllardagi shovqinni tushunish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: shovqin asosan 512–2048 Hz da. Biz o'lchadik — eng yomon nuqta 2261 Hz, u yerda shovqin nutqdan 4.71 dB BALAND. Va bu — o'chirib bo'lmaydigan joy."**

---

## 1. Shovqin nima?

**Shovqin** — yozuvda **kerak bo'lmagan** har qanday tovush.

| Tur | Manba | Chastota profili |
|---|---|---|
| **Muhit shovqini** | Transport, shamol, qurilish | Keng, past chastotalarga og'ir |
| **Elektr shovqini** | Yozuv apparati | ## ⚠️ **50/60 Hz va garmonikalari** |
| **Oq shovqin** | Mikrofon, ADC | Barcha chastotalarda **teng** |
| **Impulsli shovqin** | Chertish, taqillash | ## ⚠️ **keng, qisqa** |
| **Reverberatsiya** | Xona aks-sadosi | ## 💥 **signalning o'zi, kechikkan** |

> ## 🔑 **REVERBERATSIYA — ALOHIDA HOLAT.** ## Bu "boshqa tovush" emas, **shu tovushning kechikkan nusxasi**. ## Shuning uchun uni **filtr bilan olib bo'lmaydi** — ## 53-modulda `DRR` bilan o'lchagan edik.

---

## 2. 🔬 Bizning faylimizda shovqin **qayerda**?

Kurs aytadi: *"Birinchi 1–2 soniya faqat shovqin, oxirgi 1–2 soniya esa shovqinsiz nutq."*

**Tekshiramiz.** STFT ni uch zonaga bo'lamiz:

```python
import numpy as np, librosa

y, srate = librosa.load("speech_01.wav", sr=None)
S = librosa.stft(y)
mag = np.abs(S)
freq = librosa.fft_frequencies(sr=srate, n_fft=2048)
tt = librosa.frames_to_time(np.arange(S.shape[1]), sr=srate, hop_length=512)

zonalar = [("boshi 0-1.5 s", 0.0, 1.5),
           ("nutq 5-20 s", 5.0, 20.0),
           ("oxiri 21.5-23.5 s", 21.5, 23.6)]

for nom, a, b in zonalar:
    m = (tt >= a) & (tt < b)
    sp = mag[:, m].mean(axis=1)
    tot = (sp ** 2).sum()
    print(f"\n{nom}")
    for lo, hi in [(0, 300), (300, 1000), (1000, 2000),
                   (2000, 4000), (4000, 8000), (8000, 22050)]:
        k = (freq >= lo) & (freq < hi)
        print(f"   {lo:5d}-{hi:5d} Hz: {(sp[k]**2).sum()/tot*100:6.2f}%")
```

### 📊 Natija

| Chastota | Boshi *(shovqin)* | Nutq | Oxiri |
|---|---|---|---|
| 0–300 Hz | 13.38% | ## ⭐ **50.12%** | ## 🏆 **73.56%** |
| ## 300–1000 Hz | ## 💥 **42.39%** | 28.80% | 8.72% |
| ## 1000–2000 Hz | ## 💥 **30.81%** | 10.90% | 1.98% |
| 2000–4000 Hz | 10.93% | 2.82% | 6.94% |
| 4000–8000 Hz | 2.17% | 4.19% | 6.02% |
| 8000+ Hz | 0.32% | 3.16% | 2.78% |
| ## **RMS** | ## **−29.92 dBFS** | ## **−20.39 dBFS** | ## **−23.49 dBFS** |

> ## ✅ **KURS ASOSAN HAQ.** ## Shovqinning **73.2%** i **300–2000 Hz** da — ## kurs aytgan *"512–2048 Hz"* ga juda yaqin.
>
> ## ⭐ **VA NUTQNING 50.12% I 0–300 Hz DA** — ## bu **asosiy ton** (`f0` ≈ 138 Hz, 55-modulda o'lchagan edik).
>
> ## ✅ **OXIRGI QISM HAQIQATAN TOZAROQ:** ## 73.56% energiya 0–300 Hz da, ## 300–2000 Hz dagi shovqin **42.39% → 10.70%** ga tushgan.

---

## 3. ⭐⭐⭐ Lekin **foiz** — noto'g'ri savol

Foizlar *"qayerda energiya ko'p"* deydi. Bizga esa ***"qayerda nutq shovqindan baland"*** kerak. Bu — **SNR**.

```python
m_sh = tt < 1.5                       # faqat shovqin
m_nu = (tt >= 5) & (tt < 20)          # nutq

sh = 20 * np.log10(mag[:, m_sh].mean(axis=1) + 1e-12)
nu = 20 * np.log10(mag[:, m_nu].mean(axis=1) + 1e-12)

for f0 in [100, 200, 500, 1000, 2000, 4000, 8000, 16000]:
    i = int(np.argmin(np.abs(freq - f0)))
    print(f"{freq[i]:6.0f} Hz  shovqin {sh[i]:7.2f}  nutq {nu[i]:7.2f}  "
          f"SNR {nu[i]-sh[i]:+7.2f} dB")
```

### 📊 Natija

| Chastota | Shovqin | Nutq | ## SNR |
|---|---|---|---|
| 108 Hz | 9.90 | 22.38 | ## ⭐ **+12.48 dB** |
| 194 Hz | 7.02 | 19.15 | +12.13 dB |
| 495 Hz | 4.03 | 12.88 | +8.85 dB |
| 991 Hz | 2.20 | 6.29 | ## ⚠️ **+4.09 dB** |
| ## 2003 Hz | 3.15 | 3.18 | ## 💥 **+0.03 dB** |
| 4005 Hz | −12.99 | −6.66 | +6.33 dB |
| 8010 Hz | −24.02 | −1.64 | ## ⭐ **+22.38 dB** |
| 15999 Hz | −84.14 | −22.95 | ## 🏆 **+61.20 dB** |

```
   SNR (dB)
   +60 ┤                                            ▄▄▄
       │                                        ▄▄▄▀
   +40 ┤                                    ▄▄▄▀
       │                              ▄▄▄▄▀▀
   +20 ┤ ▄▄▄▄▄                   ▄▄▄▄▀
       │▀     ▀▀▄▄▄         ▄▄▄▀▀
     0 ┼───────────▀▀▄▄▄▄▄▀▀────────────────────────►
       │              💥 2261 Hz: −4.71 dB
   -10 ┤
       └──┬─────┬──────┬──────┬───────┬───────┬─────
         100   500    1k     2k      8k     16k   Hz
```

| | |
|---|---|
| O'rtacha SNR *(butun spektr)* | ## **+32.79 dB** |
| ## Eng yaxshi | ## 🏆 **12 769 Hz → +76.43 dB** |
| ## Eng yomon | ## 💥 **2261 Hz → −4.71 dB** |

> ## 💥💥 **2261 Hz DA SHOVQIN NUTQDAN 4.71 dB BALAND.**
>
> ## ## 🔑 **VA MANA MUAMMONING ILDIZI:** ## **2 kHz atrofi — undoshlarning zonasi.** ## `s`, `sh`, `t`, `k` tovushlari aynan shu yerda. ## ## 💥 Bu chastotani **o'chirsangiz** — nutqni buzasiz. ## **Qoldirsangiz** — shovqin qoladi.

---

## 4. ⭐ Nima uchun *"shovqinni olib tashlash"* qiyin

```
   ┌─────────────────────────────────────────────────────┐
   │                                                     │
   │  0-300 Hz     SNR +12 dB   ✅ nutq g'olib           │
   │               ⚠️ lekin bu asosiy ton — ma'no kam     │
   │                                                     │
   │  1-3 kHz      SNR  ~0 dB   💥 TENG                  │
   │               💥 va bu — UNDOSHLAR zonasi            │
   │               💥 ma'noning ko'p qismi shu yerda      │
   │                                                     │
   │  8 kHz+       SNR +22 dB   ✅ toza                  │
   │               ⚠️ lekin bu yerda energiya 3% gina     │
   │                                                     │
   └─────────────────────────────────────────────────────┘

   Shovqin va nutq ENG MUHIM zonada USTMA-UST tushadi.
```

> ## 🔑 **MANA SHUNING UCHUN "shovqinni filtr bilan olib tashlash" ISHLAMAYDI.** ## 3-darsda buni **beshta usul bilan** sinab ko'ramiz — ## va natija **kutilmagan** bo'ladi.

---

## 5. 🔬 Fayl qanchalik shovqinli? — o'lchaymiz

`librosa.effects.split()` jimlik va nutqni ajratadi. Toza faylda **jimlik ko'p** bo'lishi kerak:

```python
for td in [20, 30, 40]:
    iv = librosa.effects.split(y, top_db=td)
    d = sum(b - a for a, b in iv) / srate
    print(f"top_db={td:3d}: {len(iv):3d} segment · "
          f"nutq {d:6.2f} s ({d/(len(y)/srate)*100:5.1f}%) · "
          f"jimlik {len(y)/srate - d:.2f} s")
```

```
top_db= 20:   4 segment · nutq  22.52 s ( 95.8%) · jimlik 0.99 s
top_db= 30:   3 segment · nutq  22.89 s ( 97.4%) · jimlik 0.62 s
top_db= 40:   1 segment · nutq  22.92 s ( 97.5%) · jimlik 0.59 s
```

> ## 💥 **95.8% "NUTQ" DEB TOPILDI.** ## Lekin biz **eshitamiz** — nutq oralarida **pauzalar bor**.
>
> ## ## 🔑 **SABAB: `split()` ENERGIYA BO'YICHA ISHLAYDI.** ## Shovqin darajasi shunchalik yuqoriki, ## **pauzalar ham "baland" ko'rinadi**.
>
> ## ⭐ **BU — SHOVQINLILIKNING ENG YAXSHI O'LCHOVI:** ## *"jimlik ulushi qanchalik kam bo'lsa, fayl shunchalik shovqinli."*

### 📐 `trim()` esa deyarli hech narsa kesmaydi

| `top_db` | Kesilgan | Ulush |
|---|---|---|
| 15 | 1.650 s | 7.02% |
| 20 | 0.733 s | 3.12% |
| 25 | 0.605 s | 2.57% |
| 30 | 0.594 s | 2.53% |
| 60 | 0.559 s | 2.38% |

> ## ⚠️ **`top_db` NI 30 DAN 60 GA OSHIRSANGIZ HAM — DEYARLI FARQ YO'Q.** ## Chunki fayl **boshidan oxirigacha** shovqinli.

---

## 6. 🔧 Shovqin darajasini baholovchi funksiya

```python
import numpy as np, librosa


def shovqin_tashxisi(yol, shovqin_s=1.5):
    """Faylning shovqin profilini o'lchaydi."""
    y, srate = librosa.load(yol, sr=None)
    S = librosa.stft(y)
    mag = np.abs(S)
    freq = librosa.fft_frequencies(sr=srate, n_fft=2048)
    tt = librosa.frames_to_time(np.arange(S.shape[1]), sr=srate, hop_length=512)

    m_sh = tt < shovqin_s
    m_nu = tt >= shovqin_s
    if m_sh.sum() < 4 or m_nu.sum() < 4:
        return {"xato": "fayl juda qisqa"}

    sh = 20 * np.log10(mag[:, m_sh].mean(axis=1) + 1e-12)
    nu = 20 * np.log10(mag[:, m_nu].mean(axis=1) + 1e-12)
    snr = nu - sh

    iv = librosa.effects.split(y, top_db=30)
    nutq_s = sum(b - a for a, b in iv) / srate
    jim = 1 - nutq_s / (len(y) / srate)

    d = {
        "SNR_ortacha_dB": round(float(snr.mean()), 2),
        "SNR_eng_yomon_Hz": int(freq[int(np.argmin(snr))]),
        "SNR_eng_yomon_dB": round(float(snr.min()), 2),
        "jim_ulush": round(float(jim), 3),
        "segmentlar": len(iv),
    }
    # ⚠️ undoshlar zonasi — eng muhim
    k = (freq >= 1500) & (freq <= 4000)
    d["SNR_undoshlar_dB"] = round(float(snr[k].mean()), 2)

    baho = []
    if d["SNR_undoshlar_dB"] < 6:
        baho.append("💥 undoshlar zonasida SNR past — transkripsiya qiyin")
    if d["jim_ulush"] < 0.10:
        baho.append("⚠️ jimlik deyarli yo'q — fon shovqini doimiy")
    if d["SNR_eng_yomon_dB"] < 0:
        baho.append(f"💥 {d['SNR_eng_yomon_Hz']} Hz da shovqin nutqdan BALAND")
    d["baho"] = baho or ["✅ shovqin muammosi sezilmadi"]
    return d
```

```python
import json
print(json.dumps(shovqin_tashxisi("speech_01.wav"), indent=2, ensure_ascii=False))
```

```
{
  "SNR_ortacha_dB": 32.42,
  "SNR_eng_yomon_Hz": 2260,
  "SNR_eng_yomon_dB": -4.56,
  "jim_ulush": 0.026,
  "segmentlar": 3,
  "SNR_undoshlar_dB": 2.67,
  "baho": [
    "💥 undoshlar zonasida SNR past — transkripsiya qiyin",
    "⚠️ jimlik deyarli yo'q — fon shovqini doimiy",
    "💥 2260 Hz da shovqin nutqdan BALAND"
  ]
}
```

> ## 🏆 **UCHTA OGOHLANTIRISH — VA UCHALASI TO'G'RI.** ## Fayl haqiqatan **shovqinli**, va muammo ## **aynan undoshlar zonasida**.

---

## 🎯 Nazorat savollari

1. Shovqin qaysi chastota zonasida eng ko'p energiyaga ega?
2. SNR eng yomon bo'lgan chastota qaysi va u nima uchun muhim?
3. `librosa.effects.split()` nega 95.8% ni "nutq" deb topdi?
4. Reverberatsiyani filtr bilan olib tashlash mumkinmi?
5. Kursning "oxirgi 1–2 s toza" da'vosi to'g'rimi?

<details>
<summary>Javoblar</summary>

1. **300–2000 Hz** — shovqin energiyasining **73.2%** i shu yerda (42.39% + 30.81%). Kurs aytgan *"512–2048 Hz"* ga juda yaqin.
2. **≈ 2261 Hz**, SNR **−4.71 dB** — ya'ni shovqin nutqdan **baland**. Muhim, chunki bu **undoshlar** (`s`, `sh`, `t`, `k`) zonasi — ma'noning katta qismi shu yerda.
3. `split()` **energiya** bo'yicha ishlaydi. Shovqin darajasi shunchalik yuqoriki, pauzalar ham chegaradan yuqori chiqadi. Bu — faylning **shovqinliligini** ko'rsatuvchi eng yaxshi belgi.
4. **Yo'q.** Reverberatsiya — signalning **o'z nusxasi**, boshqa tovush emas. Uni chastota filtri ajrata olmaydi (53-modul, `DRR`).
5. **Ha.** 300–2000 Hz dagi shovqin ulushi **42.39% → 10.70%** ga tushgan, 0–300 Hz esa 73.56% — ya'ni nutq ustun.

</details>

---

⬅️ [58-modul](../58-Google-Web-Speech-API/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-Creating-a-Spectrogram.md)
