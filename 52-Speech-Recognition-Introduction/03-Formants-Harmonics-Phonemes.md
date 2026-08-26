# 3-dars. Formant, garmonika, fonema ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"1950-yillarda Bell Labs tadqiqotchilari uchta narsani kashf etdi. Ular bugungi hamma tizimning asosida turibdi."**

---

## 1. 🎵 Garmonikalar — ovozning "rangi"

> ## 🔑 **KURSNING TA'RIFI:** *"Ovoz paychalaringiz tebranganda asosiy chastota — `f0` — hosil bo'ladi. Garmonikalar — uning karralari."*
>
> ```
> f0 = 100 Hz  →  garmonikalar: 200, 300, 400, 500, 600, 700, 800 Hz
>                              ⭐ f0 × 2, ×3, ×4, ×5 ...
> ```

### 🔬 Haqiqiy nutqda o'lchaymiz

```python
import librosa, numpy as np

y, sr = librosa.load("speech_01.wav", sr=16000)
f0, voiced, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr)
f0ok = f0[~np.isnan(f0)]

print(f"ovozli freymlar: {voiced.mean():.0%}")
print(f"f0 median: {np.median(f0ok):.1f} Hz")
print(f"garmonikalar: {[round(np.median(f0ok)*k) for k in range(1, 6)]}")
```

```
ovozli freymlar: 65%
f0 median: 138.2 Hz   (min 83.9 · maks 399.0)
garmonikalar: [138, 276, 415, 553, 691] Hz
```

> ## ⭐ **UCHTA MUHIM O'LCHOV:**
>
> ### ① **Faqat 65% freym "ovozli"**
> ```
> ovozli (voiced)    →  a, o, i, m, n, l, r  — ovoz paychalari TEBRANADI
> ovozsiz (unvoiced) →  s, sh, f, t, k, p    — 💥 f0 YO'Q
> ```
> ## 💡 **YA'NI NUTQNING UCHDAN BIRIDA `f0` UMUMAN YO'Q.** ## Shuning uchun `librosa.pyin` **NaN** qaytaradi — bu **xato emas**.
>
> ### ② **f0 diapazoni 83.9 – 399.0 Hz — juda keng**
> ## 💥 Bu **oktava xatosi** *(octave error)* bo'lishi mumkin: ## algoritm ba'zan `f0` ni **ikki barobar kam** yoki **ko'p** o'lchaydi.
> ```python
> # ⭐ diapazonni TORAYTIRING — xatolar kamayadi
> f0, v, _ = librosa.pyin(y, fmin=100, fmax=300, sr=sr)
> ```
>
> ### ③ **Median 138 Hz — o'rtacha 149 dan past**
> ## 🏆 **NUTQ TAHLILIDA DOIM `median` ISHLATING.** ## Bir nechta oktava xatosi **o'rtachani** buzadi, ## **medianni** — deyarli buzmaydi.

---

## 2. 🗣️ Formantlar — unlilarni ajratadigan narsa

> ## 🔑 **KURSNING TA'RIFI:** *"Formantlar — og'zingiz nutq paytida kuchaytiradigan chastota diapazonlari."*
>
> ## ⭐ **FARQNI TUSHUNING:**
> ```
> GARMONIKA  →  ovoz PAYCHALARIDAN keladi  →  f0 ga bog'liq
> FORMANT    →  og'iz BO'SHLIG'IDAN keladi →  ⭐ f0 ga BOG'LIQ EMAS
> ```
>
> ## 💡 **SHUNING UCHUN:** ## siz **past** ovozda ham, **baland** ovozda ham ## `"a"` ni aytsangiz — u **bir xil `a`** bo'lib eshitiladi. ## Chunki **formantlar o'zgarmaydi**.

### 📐 Nazariy qiymatlar

| Unli | F1 | F2 | F3 |
|---|---|---|---|
| `/i/` *(bit)* | ## 270 | ## 🏆 **2290** | 3010 |
| `/e/` *(bet)* | 530 | 1840 | 2480 |
| `/a/` *(bot)* | ## 🏆 **730** | ## 1090 | 2440 |
| `/o/` *(bought)* | 570 | 840 | 2410 |
| `/u/` *(boot)* | 300 | ## 870 | 2240 |

> ## 🏆 **F1 va F2 — UNLINI TO'LIQ ANIQLAYDI:**
> ```
> F1 PAST + F2 YUQORI  →  /i/    (til oldinda, og'iz yopiq)
> F1 YUQORI + F2 PAST  →  /a/    (til pastda, og'iz ochiq)
> F1 PAST + F2 PAST    →  /u/    (til orqada, lablar dumaloq)
> ```
> ## ⭐ **F1 = og'iz ochiqligi · F2 = tilning oldinda-orqadaligi.**

### 🔬 LPC bilan o'lchaymiz

```python
import scipy.signal as sig


def formantlar(x, sr, n_form=4):
    """⭐ LPC orqali formantlarni topadi."""
    x = x * np.hamming(len(x))
    x = sig.lfilter([1, -0.67], 1, x)              # ⭐ pre-emphasis
    a = librosa.lpc(x.astype(np.float64), order=int(2 + sr / 1000))
    r = np.roots(a)
    r = r[np.imag(r) > 0]                          # ⭐ yuqori yarim tekislik
    f = np.sort(np.arctan2(np.imag(r), np.real(r)) * sr / (2 * np.pi))
    return f[(f > 90) & (f < sr / 2 - 200)][:n_form]
```

```
  eng baland 5 freym formantlari (Hz):
    t= 2.14s  F1=  235  F2= 1204  F3= 1683  F4= 2507
    t= 2.69s  F1=  192  F2= 1690  F3= 2075  F4= 2741
    t= 7.17s  F1=  416  F2= 1804  F3= 2572  F4= 3400
    t= 1.92s  F1=  306  F2= 1024  F3= 1846  F4= 2714
    t=11.10s  F1=  226  F2= 1423  F3= 1724  F4= 2649
```

> ## ⭐ **NATIJALAR MANTIQIY:**
> ```
> t=1.92s  F1=306 F2=1024  →  /u/ yoki /o/ ga yaqin
> t=7.17s  F1=416 F2=1804  →  /e/ ga yaqin
> ```
>
> ## ⚠️ **LEKIN AYNAN MOS EMAS — VA BU NORMAL:**
> ```
> ① jadval AMERIKA inglizchasining O'RTACHA qiymatlari
> ② har odamning og'iz bo'shlig'i BOSHQA
> ③ tabiiy nutqda unlilar QISQARADI (reduksiya)
> ④ 8 kHz da LPC tartibi cheklangan
> ```
>
> ## 🏆 **DARS: FORMANT ANALIZI — YAQINLASHTIRISH, O'LCHOV EMAS.** ## Shuning uchun zamonaviy tizimlar formantni **ishlatmaydi** — ## ular **MFCC** *(55-modul)* ishlatadi.
>
> ## ⭐ **`pre-emphasis` NIMA UCHUN KERAK?**
> ```
> Nutqda energiya PAST chastotalarda to'plangan (o'lchandi: 59% < 300 Hz)
>    →  yuqori formantlar "ko'rinmaydi"
> pre-emphasis yuqori chastotalarni KO'TARADI
>    →  ⭐ F2, F3 aniqroq topiladi
> ```
> ## 💥 **`pre-emphasis` SIZ — F3 va F4 ko'pincha TOPILMAYDI.**

---

## 3. 🔤 Fonemalar — ma'noni o'zgartiradigan eng kichik birlik

> ## 🔑 **KURSNING MISOLI:** `cat` ↔ `hat` — ## bitta fonema o'zgardi, **so'z butunlay boshqa**.
>
> ## 💥 **VA KURSNING TRANSKRIPTIDA XATO BOR:** ## *"Replacing k with k changes the word's meaning"* — ## bu **`k` ni `h` ga** almashtirish bo'lishi kerak edi. ## *(Transkripsiya xatosi — `/h/` fonemasi `k` deb yozilgan.)*
>
> ## ⭐ **FONEMA ≠ HARF:**
> ```
> "ship"   →  4 harf, 3 fonema:  /ʃ/ /ɪ/ /p/     (sh = BITTA fonema)
> "box"    →  3 harf, 4 fonema:  /b/ /ɒ/ /k/ /s/  (x = IKKI fonema)
> "knight" →  6 harf, 3 fonema:  /n/ /aɪ/ /t/
> ```

### 🇺🇿 O'zbek tilida

```
O'zbek tilida ~30 fonema (6 unli + 24 undosh)
Ingliz tilida  ~44 fonema (20 unli + 24 undosh)

💥 ENG KATTA FARQ — UNLILAR:
   ingliz:  ship /ɪ/  ≠  sheep /iː/     ⭐ MA'NO farq qiladi
   o'zbek:  bunday farq YO'Q

💥 NATIJA: o'zbek tilida so'zlashuvchi uchun ingliz unlilarini
   ajratish qiyin — VA ASR modeli uchun ham
```

> ## 🔑 **BU — AKSENT MUAMMOSINING ILDIZI.** ## Model **o'z tilining fonemalarini** eshitadi, ## siz **o'z tilingizning fonemalarini** aytasiz.
>
> ## 🏆 **VA BU 61-MODULDA O'LCHANADIGAN NARSA:** ## Whisper aksentli inglizchada **qanchalik yomon** ishlaydi.

---

## 4. ⭐⭐ Uchalasi qanday bog'lanadi

```
         OVOZ PAYCHALARI              OG'IZ BO'SHLIG'I
              ↓                             ↓
      f0 + GARMONIKALAR    ──filtr──>   FORMANTLAR
      (manba: 138, 276, 415...)      (rezonans: F1, F2, F3)
                                            ↓
                                        FONEMA
                                    (/a/, /i/, /s/...)
                                            ↓
                                          SO'Z
```

> ## 🏆 **BU — "MANBA-FILTR MODELI" *(source-filter model)*, 1960.**
> ```
> MANBA (source) →  ovoz paychalari  →  ⭐ ohang, pitch, jins
> FILTR (filter) →  og'iz bo'shlig'i →  ⭐ FONEMA, ma'no
> ```
>
> ## 💡 **SHUNING UCHUN SIZ PICHIRLAB HAM GAPIRA OLASIZ:** ## pichirlashda **manba yo'q** *(f0 yo'q)*, ## lekin **filtr bor** *(formantlar saqlanadi)* — ## va **so'zlar tushunarli** qoladi.
>
> ## 💥 **LEKIN ASR TIZIMLARI PICHIRLASHNI YOMON TANIYDI** — ## chunki ular **ovozli nutqda** o'qitilgan.

---

## 5. 📜 Tarix — nima uchun bilish kerak

| Yil | Tizim | Imkoniyat | Usul |
|---|---|---|---|
| 1952 | **Audrey** *(Bell Labs)* | 0–9 raqamlari | Shablon moslash |
| 1962 | **Shoebox** *(IBM)* | 16 so'z | Elektromexanik |
| 1971 | **Harpy** *(DARPA)* | ## 1011 so'z | Grammatika grafi |
| 1980-lar | ## 🏆 **HMM** | Minglab so'z | ## ⭐ **Ehtimollik** |
| 1990-lar | Neyron tarmoqlar | Uzluksiz nutq | Naqsh o'rganish |
| 2010-lar | ## 🏆 **Deep learning** | Ochiq lug'at | ## ⭐ **End-to-end** |
| 2022 | ## 🏆 **Whisper** | ## 99 til | ## ⭐ **Transformer** |

> ## 🔑 **ASOSIY BURILISH — 1980-yillar, HMM:**
> ```
> OLDIN:  shablon  →  "aynan mos keladimi?"     💥 mo'rt
> KEYIN:  ehtimol  →  "qanchalik ehtimolli?"   ⭐ moslashuvchan
> ```
>
> ## 🏆 **IKKINCHI BURILISH — 2010-yillar, end-to-end:**
> ```
> OLDIN:  audio → xususiyat → fonema → so'z → jumla   (4 model)
> KEYIN:  audio ──────────────────────────→ jumla     ⭐ 1 model
> ```
> ## 💥 **VA AYNAN SHU SABABLI FORMANT ANALIZI BUGUN ISHLATILMAYDI** — ## model **o'zi kerakli xususiyatni topadi**.
>
> ## ⚠️ **UNDA NIMA UCHUN BULARNI O'RGANAMIZ?**
> ```
> ⭐ Whisper "qora quti" — u nima uchun xato qilganini AYTMAYDI
> ⭐ SIZ tashxis qo'yasiz:  f0 yo'qmi? shovqinmi? sample rate xatomi?
> 🏆 tashxis — nazariyani TALAB qiladi
> ```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Garmonika va formant farqi nima?

**M2.** Nima uchun `librosa.pyin` `NaN` qaytaradi?

**M3.** `"box"` so'zida nechta harf va nechta fonema bor?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Garmonika** — ovoz paychalaridan, `f0` **karralari**. ## **Formant** — og'iz bo'shlig'idan, `f0` ga **bog'liq emas**.

**M2.** ## Ovozsiz tovushlarda *(`s`, `t`, `k`)* `f0` **yo'q**. ## O'lchandi: freymlarning **35%** ovozsiz.

**M3.** ## **3 harf**, **4 fonema** — `/b/ /ɒ/ /k/ /s/`.

</details>

### 🟡 O'rta

**M4.** ⭐ `f0` ni o'lchang va `median` va `o'rtacha` ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import librosa, numpy as np

y, sr = librosa.load("speech_01.wav", sr=16000)

for fmin, fmax in [(60, 400), (100, 400), (140, 500)]:
    f0, v, _ = librosa.pyin(y, fmin=fmin, fmax=fmax, sr=sr)
    ok = f0[~np.isnan(f0)]
    h, _ = np.histogram(ok, bins=[60, 100, 130, 160, 190, 220, 260, 300, 400])
    print(f"  fmin={fmin:3d}  ovozli {v.mean():.0%}  "
          f"median {np.median(ok):6.1f}  o'rt {ok.mean():6.1f}")
    print(f"     gistogramma: {h}")
```

```
  fmin= 60  ovozli 65%  median  138.2  o'rt  148.9
     gistogramma: [  8 205 156  42  33  14  11  11]
  fmin=100  ovozli 67%  median  135.8  o'rt  149.4
     gistogramma: [  0 226 155  40  28  16  16  11]
  fmin=140  ovozli 53%  median  144.5  o'rt  156.4
     gistogramma: [  0   0 300  43  33  11   3   0]
```

## ⭐ **`median` BARQAROR: 138 → 136 → 145.** ## `o'rtacha` — **149 → 149 → 156** *(yuqori qiymatlardan buziladi)*.

## 💥 **VA `fmin=140` DA "ovozli" 65% DAN 53% GA TUSHDI** — ## haqiqiy past freymlar **rad etildi**. ## ⚠️ Diapazonni **haddan tashqari** toraytirmang.

</details>

**M5.** ⭐⭐ Formantlarni o'lchang va `pre-emphasis` ta'sirini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
import scipy.signal as sig


def formantlar(x, sr, n_form=4, pre=True):
    x = x * np.hamming(len(x))
    if pre:
        x = sig.lfilter([1, -0.67], 1, x)
    a = librosa.lpc(x.astype(np.float64), order=int(2 + sr / 1000))
    r = np.roots(a)
    r = r[np.imag(r) > 0]
    f = np.sort(np.arctan2(np.imag(r), np.real(r)) * sr / (2 * np.pi))
    return f[(f > 90) & (f < sr / 2 - 200)][:n_form]


y8, _ = librosa.load("speech_01.wav", sr=8000)
rms = librosa.feature.rms(y=y8, frame_length=512, hop_length=256)[0]

for i in np.argsort(-rms)[:3]:
    seg = y8[int(i) * 256: int(i) * 256 + 512]
    if len(seg) < 512:
        continue
    for pre, nom in [(True, "✅ pre-emphasis"), (False, "💥 pre-emphasissiz")]:
        f = formantlar(seg, 8000, pre=pre)
        print(f"  t={int(i)*256/8000:5.2f}s {nom:20s} " +
              "  ".join(f"F{k+1}={v:6.0f}" for k, v in enumerate(f)))
    print()
```

## 💥 **`pre-emphasis` SIZ — YUQORI FORMANTLAR YO'QOLADI** yoki **noto'g'ri** chiqadi.

</details>

**M6.** ⭐⭐ O'z ovozingizni yozing va `f0` ni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
# ① telefon yoki noutbukda 10 soniya gapirib yozing → menim.wav
# ② quyidagini ishga tushiring

def ovoz_pasporti(yol):
    """🇺🇿 Ovozingizning akustik pasporti."""
    y, sr = librosa.load(yol, sr=16000)
    f0, v, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr)
    ok = f0[~np.isnan(f0)]

    med = float(np.median(ok))
    print(f"  davomiylik : {len(y)/sr:.1f} s")
    print(f"  ovozli     : {v.mean():.0%}")
    print(f"  f0 median  : {med:.1f} Hz")
    print(f"  f0 diapazon: {np.percentile(ok,5):.0f} – "
          f"{np.percentile(ok,95):.0f} Hz")
    print(f"  garmonikalar: {[round(med*k) for k in range(1,6)]} Hz")
    print(f"  RMS dBFS   : {20*np.log10(np.sqrt((y**2).mean())):.1f} dB")

    # ⚠️ f0 dan jinsni ANIQLAB BO'LMAYDI — faqat diapazon
    if med < 165:
        print("  💡 f0 past diapazonda (odatda erkak, lekin past ayol "
              "ovozi ham shu yerda)")
    elif med < 255:
        print("  💡 f0 o'rta-yuqori diapazonda")
    else:
        print("  💡 f0 juda yuqori — oktava xatosi bo'lishi mumkin")


ovoz_pasporti("menim.wav")
```

## ⚠️ **`f0` DAN JINSNI ANIQLAB BO'LMAYDI.** ## Diapazonlar **kesishadi**, va bunday xulosa chiqarish — ## **texnik jihatdan ham, axloqiy jihatdan ham** noto'g'ri *(68–76-modullar)*.

</details>

---

## 📌 Xulosa

```
OVOZ PAYCHALARI  →  f0 + GARMONIKALAR   (manba)
                        ↓ filtr
OG'IZ BO'SHLIG'I →  FORMANTLAR F1, F2   (filtr)
                        ↓
                    FONEMA  →  SO'Z
```

```
🔬 O'LCHANGAN (kursning speech_01.wav fayli):
   ovozli freymlar   65%      →  35% da f0 UMUMAN YO'Q
   f0 median      138.2 Hz    →  garmonikalar 138, 276, 415, 553, 691
   f0 o'rtacha    148.9 Hz    →  💥 oktava xatolaridan BUZILGAN
   formantlar     F1 192–416 · F2 1024–1804

⭐ median ishlating, o'rtacha EMAS
⭐ pre-emphasis SIZ F3, F4 topilmaydi
⭐ F1 = og'iz ochiqligi · F2 = til oldinda-orqada
🇺🇿 o'zbekcha ~30 fonema · inglizcha ~44  →  aksent muammosining ildizi
```

> ## 🏆🏆 **BUGUN FORMANT ANALIZI ISHLATILMAYDI — MODEL O'ZI KERAKLI XUSUSIYATNI TOPADI.** ## **LEKIN MODEL XATO QILGANDA — TASHXISNI SIZ QO'YASIZ.**

---

⬅️ [2-dars. Kurs yondashuvi](02-Course-Approach.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Rivojlanish tarixi](04-Development-and-Evolution.md)
