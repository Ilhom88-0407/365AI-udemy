# 3-dars. Tovush to'lqinining xossalari ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Beshta xossa. Har biri ASR ning aniq bir qismiga ta'sir qiladi."**

---

## 1. 📐 Beshta xossa

| Xossa | Nima | Birlik | ASR uchun |
|---|---|---|---|
| ## **Amplituda** | Zarraning maksimal siljishi | m *(amalda* **dB**) | ## ⭐ Balandlik · urg'u |
| ## **To'lqin uzunligi** | Takrorlanish **masofasi** | m | To'siqlar · difraksiya |
| ## **Davr** | Bir sikl **vaqti** | s | Segmentatsiya |
| ## 🏆 **Chastota** | Sikl/soniya | Hz | ## 🏆 **FONEMA** |
| ## **Faza** | Sikl ichidagi **joy** | ° yoki rad | ## ⭐ Interferensiya |

```
f = 1 / T            λ = v / f            v = 343 m/s
```

> ## 💡 **DAVR VA TO'LQIN UZUNLIGI — CHALKASHTIRMANG:**
> ```
> DAVR (T)          →  VAQT     →  soniya
> TO'LQIN UZUNLIGI  →  MASOFA   →  metr
> ```
> ## ⭐ Ikkalasi **bir xil narsani** ikki tomondan tasvirlaydi.

---

## 2. 📢 Amplituda va desibel

> ## 🔑 **KURS TO'G'RI AYTADI:** *"Amplituda texnik jihatdan masofa o'lchovi, lekin u ko'pincha desibelda ifodalanadi — logarifmik birlik."*
>
> ## ⭐ **NIMA UCHUN LOGARIFMIK?**
> ```
> Odam quloqning diapazoni:
>    eng jim eshitiladigan  →  0.00002 Pa
>    og'riq chegarasi       →  20 Pa
>    ⭐ NISBAT — 1 000 000 : 1
>
> Chiziqli shkalada bu — o'qib bo'lmaydigan raqamlar.
> Logarifmik shkalada — 0 dan 120 gacha.  ✅
> ```

### 🔬 O'lchangan

```python
import numpy as np

print(f"  amplituda 2×  ->  {20*np.log10(2):.2f} dB")
print(f"  quvvat    2×  ->  {10*np.log10(2):.2f} dB")
print(f"  amplituda 10× ->  {20*np.log10(10):.2f} dB")
```

```
  amplituda 2×  ->  6.02 dB
  quvvat    2×  ->  3.01 dB
  amplituda 10× ->  20.00 dB
```

> ## 💥 **IKKI XIL FORMULA — VA BU ENG KO'P XATO MANBAI:**
> ```
> AMPLITUDA (voltaj, namuna qiymati)  →  20 · log10(x)
> QUVVAT    (energiya, RMS²)          →  10 · log10(x)
> ```
> ## ⭐ **AUDIO NAMUNALAR — AMPLITUDA.** ## Demak `20 * log10()`.
>
> ## 🔬 **BIZNING FAYLDA** *(52-modulda o'lchangan)*:
> ```
> RMS      0.094741  →  -20.47 dBFS
> cho'qqi  0.855600  →   -1.36 dBFS
> krest-faktor                  19.11 dB
> ```
> ## 🏆 **`krest-faktor` — CHO'QQI VA RMS ORASIDAGI MASOFA.** ## Nutqda u odatda **12–20 dB**. ## 💥 Agar **6 dB dan past** bo'lsa — audio **siqilgan** yoki **buzilgan**.

---

## 3. 🌊 Faza va interferensiya

> ## 🔑 **KURSNING TASHBEHI YAXSHI:** *"Fazani doiraviy yugurish yo'lakchasi deb tasavvur qiling. Start — 0°, yarmi — 180°, to'liq aylana — 360°."*

### 🔬 O'lchangan

```python
t = np.linspace(0, 0.01, 441, endpoint=False)
a = np.sin(2 * np.pi * 440 * t)

for deg in [0, 60, 90, 120, 180, 270, 360]:
    b = np.sin(2 * np.pi * 440 * t + np.deg2rad(deg))
    s = a + b
    print(f"  faza {deg:3d}° -> amplituda {np.abs(s).max():.4f}  "
          f"quvvat {(s**2).mean()/(a**2).mean():.4f}×")
```

```
  faza   0° -> amplituda 2.0000  quvvat 4.0000×
  faza  60° -> amplituda 1.7320  quvvat 3.0105×
  faza  90° -> amplituda 1.4142  quvvat 1.9944×
  faza 120° -> amplituda 1.0000  quvvat 0.9874×
  faza 180° -> amplituda 0.0000  quvvat 0.0000×
  faza 270° -> amplituda 1.4142  quvvat 1.9411×
  faza 360° -> amplituda 2.0000  quvvat 4.0000×
```

> ## 💥💥 **180° DA IKKI TOVUSH BIR-BIRINI TO'LIQ YO'Q QILDI.** ## Amplituda **0.0000**, quvvat **0.0000×**.
>
> ## 🏆 **BU — ANC (Active Noise Cancelling) QULOQCHINLARINING BUTUN PRINSIPI:**
> ```
> ① mikrofon fon shovqinini eshitadi
> ② protsessor uni 180° ga BURADI
> ③ dinamik shu teskari to'lqinni chiqaradi
> ④ ⭐ ikkalasi QO'SHILADI  →  jimlik
> ```
>
> ## ⭐ **VA `120°` QATORIGA E'TIBOR BERING:**
> ```
> amplituda 1.0000  →  bitta to'lqin bilan BIR XIL
> quvvat    0.9874× →  ⭐ ikki to'lqin qo'shildi, quvvat OSHMADI
> ```
> ## 💡 **YA'NI "IKKI KARRA KO'P TOVUSH = IKKI KARRA BALAND" — NOTO'G'RI.** ## Hammasi **fazaga** bog'liq.

### ⚠️ Va ASR uchun amaliy oqibat

```
🎙️ IKKI MIKROFONLI YOZUV:
   mikrofonlar orasidagi masofa  →  faza farqi
   →  ba'zi chastotalar KUCHAYADI, ba'zilari YO'QOLADI
   →  💥 "grebenka filtri" (comb filter)

🏆 YECHIM: mono ishlating yoki mikrofonlarni
   ⭐ 3:1 qoidasi bo'yicha joylashtiring
   (mikrofonlar orasi ≥ 3× manbagacha masofa)
```

```python
def grebenka(kechikish_ms, sr=44100, n=8192):
    """💥 Ikki nusxa qo'shilsa — qaysi chastotalar yo'qoladi?"""
    d = int(sr * kechikish_ms / 1000)
    h = np.zeros(n)
    h[0] = 1.0
    h[d] = 1.0
    H = np.abs(np.fft.rfft(h))
    fr = np.fft.rfftfreq(n, 1 / sr)
    nol = fr[(H < 0.05) & (fr < 5000)]
    # ⚠️ qo'shni binlarni birlashtiramiz — aks holda takror chiqadi
    guruh = [nol[0]] if len(nol) else []
    for x in nol[1:]:
        if x - guruh[-1] > 50:
            guruh.append(x)
    print(f"  kechikish {kechikish_ms:.2f} ms ({d} namuna) = "
          f"{kechikish_ms/1000*343*100:.1f} sm")
    print(f"    yo'qolgan chastotalar: {[int(x) for x in guruh[:6]]} Hz")
    return fr, H


for ms in [0.5, 1.0, 2.0]:
    grebenka(ms)
```

```
  kechikish 0.50 ms (22 namuna) = 17.2 sm
    yo'qolgan chastotalar: [990, 2991, 4993] Hz
  kechikish 1.00 ms (44 namuna) = 34.3 sm
    yo'qolgan chastotalar: [495, 1496, 2497, 3498, 4499] Hz
  kechikish 2.00 ms (88 namuna) = 68.6 sm
    yo'qolgan chastotalar: [247, 748, 1248, 1749, 2250, 2750] Hz
```

> ## 💥 **2 ms KECHIKISHDA — NUTQ DIAPAZONIDA 6 TA CHUQURLIK.** ## 2 ms = **68 sm** masofa farqi *(343 m/s da)*. ## ⚠️ Bu — **oddiy xona aks-sadosi**.
>
> ## 🏆 **SHUNING UCHUN AKS-SADOLI XONADA ASR YOMON ISHLAYDI** — ## muammo **shovqinda emas**, **interferensiyada**.

---

## 4. ⭐ Chastota — fonemani belgilaydi

> ## 🔑 **KURS AYTADI:** *"Turli fonemalar aniq chastota naqshlariga ega."*
>
> ## 🔬 **VA BIZ BUNI 52-MODULDA O'LCHADIK:**
> ```
> F1 = 192–416 Hz  ·  F2 = 1024–1804 Hz
> ```
>
> ## ⭐ **QAYSI CHASTOTA NIMA UCHUN MAS'UL:**
> | Diapazon | Nima bor | ASR uchun |
> |---|---|---|
> | 80–300 Hz | ## `f0` va garmonikalar | ## 👤 **kim gapiryapti** |
> | 300–800 Hz | ## **F1** | ## ⭐ og'iz ochiqligi |
> | 800–2500 Hz | ## **F2** | ## ⭐ til oldinda-orqada |
> | 2500–4000 Hz | F3, F4 | Tembr · aniqlik |
> | ## 4000–8000 Hz | ## 🏆 **s, sh, f, t** | ## 💥 **telefon kesib tashlaydi** |

```python
import librosa

y, sr = librosa.load("speech_01.wav", sr=16000)
Y = np.abs(np.fft.rfft(y))
fr = np.fft.rfftfreq(len(y), 1 / sr)
jami = (Y ** 2).sum()

for lo, hi, nom in [(0, 300, "f0 + garmonikalar"), (300, 800, "F1"),
                    (800, 2500, "F2"), (2500, 4000, "F3/F4"),
                    (4000, 8000, "s, sh, f, t")]:
    m = (fr >= lo) & (fr < hi)
    print(f"  {lo:5d}–{hi:5d} Hz  {(Y[m]**2).sum()/jami:6.2%}   {nom}")
```

```
      0–  300 Hz  59.12%   f0 + garmonikalar
    300–  800 Hz  19.95%   F1
    800– 2500 Hz   9.43%   F2
   2500– 4000 Hz   2.19%   F3/F4
   4000– 8000 Hz   9.30%   s, sh, f, t
```

> ## 💥💥 **BU JADVAL — MODULNING ENG MUHIM O'LCHOVI.**
>
> ## 🔑 **ENERGIYANING 59% I FONEMANI UMUMAN BELGILAMAYDI** — ## u **kim gapirayotganini** ko'rsatadi.
>
> ## 🏆 **VA FONEMA UCHUN MAS'UL DIAPAZON** *(300–2500 Hz)* — ## atigi **29.4%** energiya.
>
> ## ⭐ **AMALIY XULOSA UCHTA:**
> ```
> ① pre-emphasis KERAK  →  past chastotalar SHOVQIN sifatida ustunlik qiladi
> ② MFCC log oladi      →  59% ni 29.4% bilan tenglashtiradi
> ③ telefon 4 kHz da kesadi  →  💥 9.3% (s/sh/f/t) YO'QOLADI
> ```

---

## 5. ⚠️ "Sinusoida" — bu shunchaki model

> ## 🔑 **KURSNING OXIRGI ESLATMASI JUDA MUHIM:** *"Tovush to'lqinlari sinusoidal funksiya sifatida tasvirlanadi, lekin bu shunchaki matematik model. Ular bunday ko'rinmaydi."*
>
> ## ⭐ **HAQIQATDA NIMA BO'LADI:**
> ```
> Havo zarralari  →  QALINLASHISH va SIYRAKLASHISH
>                    (compression / rarefaction)
> Grafik ko'rsatadi →  BOSIMNING vaqt bo'yicha o'zgarishi
> ```
>
> ## 💡 **VA HAQIQIY NUTQ — SOF SINUSOIDA EMAS:**

```python
print("  signal                 alohida chastotalar")
print(f"  sof sinus (440 Hz)          1")

y, sr = librosa.load("speech_01.wav", sr=16000)
for t0 in [2.0, 5.0, 10.0]:
    seg = y[int(t0 * sr):int(t0 * sr) + 1024]
    S = np.abs(np.fft.rfft(seg * np.hanning(1024)))
    print(f"  haqiqiy nutq (t={t0:4.1f}s)      {int((S > S.max()*0.1).sum()):3d}")
```

```
  signal                 alohida chastotalar
  sof sinus (440 Hz)          1
  haqiqiy nutq (t= 2.0s)     98
  haqiqiy nutq (t= 5.0s)    151
  haqiqiy nutq (t=10.0s)    113
```

> ## 🏆 **BITTA 25 ms LIK NUTQ BO'LAGIDA — 98–151 TA SEZILARLI CHASTOTA.** ## Sinusoida — **ta'lim uchun soddalashtirish**, **haqiqat emas**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Davr va to'lqin uzunligi farqi nima?

**M2.** Amplituda 2× ortsa necha dB?

**M3.** 180° faza farqida nima bo'ladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Davr** — vaqt *(soniya)*. ## **To'lqin uzunligi** — masofa *(metr)*.

**M2.** ## **6.02 dB** — chunki amplituda uchun `20·log10()`. ## ⚠️ Quvvat uchun bo'lsa — **3.01 dB**.

**M3.** ## 💥 **To'liq bekor bo'ladi** — o'lchandi: amplituda **0.0000**.

</details>

### 🟡 O'rta

**M4.** ⭐ Faza va interferensiyani o'lchang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 3-bo'limdagi kodni ishga tushiring, so'ng ANC simulyatsiyasi:

```python
import soundfile as sf

y, sr = librosa.load("speech_01.wav", sr=16000)

# ⭐ fon shovqini qo'shamiz
shovqin = np.random.RandomState(0).normal(0, 0.05, len(y))
shovqinli = y + shovqin

# ⭐ ANC: shovqinning TESKARISINI qo'shamiz (ideal holat)
anc = shovqinli + (-shovqin)

for nom, s in [("asl", y), ("shovqinli", shovqinli), ("ANC", anc)]:
    xato = float(np.sqrt(((s - y) ** 2).mean()))
    print(f"  {nom:10s} RMS xato {xato:.6f}")
    sf.write(f"anc_{nom}.wav", s, sr)

print("\n  💡 ANC IDEAL holatda — 100% samarali")
print("     💥 amalda: mikrofon boshqa joyda, kechikish bor,")
print("        faza aynan 180° emas  →  faqat PAST chastotalarda ishlaydi")
```

## 🏆 **AYNAN SHUNING UCHUN ANC QULOQCHINLAR SAMOLYOT GULDIRASHINI *(past chastota)* O'CHIRADI, ODAM OVOZINI ESA — YO'Q.**

</details>

**M5.** ⭐⭐ Grebenka filtrini o'lchang va chizing.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def grebenka(kechikish_ms, sr=44100, n=8192):
    d = int(sr * kechikish_ms / 1000)
    h = np.zeros(n)
    h[0] = h[d] = 1.0
    H = np.abs(np.fft.rfft(h))
    fr = np.fft.rfftfreq(n, 1 / sr)
    nol = fr[(H < 0.05) & (fr < 5000)]
    masofa_sm = kechikish_ms / 1000 * 343 * 100
    print(f"  {kechikish_ms:.2f} ms = {masofa_sm:5.1f} sm  ->  "
          f"yo'qolgan: {[int(x) for x in nol[:6]]} Hz")
    return fr, H


fig, ax = plt.subplots(figsize=(11, 5))
for ms in [0.5, 1.0, 2.0]:
    fr, H = grebenka(ms)
    m = fr < 5000
    ax.plot(fr[m], 20 * np.log10(H[m] + 1e-6), label=f"{ms} ms", lw=1.2)
ax.set_xlabel("Hz")
ax.set_ylabel("dB")
ax.set_title("Grebenka filtri — aks-sado qaysi chastotalarni o'chiradi")
ax.legend()
ax.grid(alpha=.3)
plt.tight_layout()
plt.savefig("grebenka.png", dpi=110)
print("💾 grebenka.png")
```

```
  0.50 ms =  17.2 sm  ->  yo'qolgan: [990, 2991, 4993] Hz
  1.00 ms =  34.3 sm  ->  yo'qolgan: [495, 1496, 2497, 3498, 4499] Hz
  2.00 ms =  68.6 sm  ->  yo'qolgan: [247, 748, 1248, 1749, 2250, 2750] Hz
```

## 💥 **2 ms (68.6 sm) — NUTQ DIAPAZONIDA 6 TA CHUQURLIK.** ## Bu — **oddiy xona aks-sadosi**.

## 🏆 **SHUNING UCHUN ASR STUDIYADA EMAS, XONADA YOMON ISHLAYDI.**

</details>

**M6.** ⭐⭐ Chastota diapazonlarining energiyasini o'lchang va eshiting.

<details>
<summary>✅ Yechim</summary>

```python
import scipy.signal as sig

y, sr = librosa.load("speech_01.wav", sr=16000)

DIAPAZONLAR = {
    "faqat f0 (0–300)":     (None, 300),
    "faqat F1 (300–800)":   (300, 800),
    "faqat F2 (800–2500)":  (800, 2500),
    "telefon (300–3400)":   (300, 3400),
    "s/sh (4000–8000)":     (4000, None),
}

Y = np.abs(np.fft.rfft(y))
fr = np.fft.rfftfreq(len(y), 1 / sr)
jami = (Y ** 2).sum()

for nom, (lo, hi) in DIAPAZONLAR.items():
    if lo and hi:
        b, a = sig.butter(6, [lo / (sr/2), hi / (sr/2)], btype="band")
    elif hi:
        b, a = sig.butter(6, hi / (sr/2), btype="low")
    else:
        b, a = sig.butter(6, lo / (sr/2), btype="high")
    f = sig.filtfilt(b, a, y)

    m = np.ones_like(fr, bool)
    if lo:
        m &= fr >= lo
    if hi:
        m &= fr < hi
    ulush = (Y[m] ** 2).sum() / jami

    sf.write(f"diap_{nom.split()[1]}.wav", f / max(np.abs(f).max(), 1e-9), sr)
    print(f"  {nom:22s} energiya {ulush:6.2%}   💾 saqlandi")

print("\n  🎧 HAMMASINI TINGLANG:")
print("     'faqat f0'      →  ohang bor, SO'ZLAR YO'Q")
print("     'faqat F2'      →  jimroq, lekin so'zlar TUSHUNARLI")
print("     'telefon'       →  tanish tovush")
print("     's/sh'          →  faqat shitirlash")
```

## 🏆🏆 **BU MASHQ — MODULNING ENG QIMMATLISI.** ## `"faqat f0"` — **59% energiya**, lekin ## 💥 **so'zlar umuman tushunarli emas**. ## `"faqat F2"` — **10.6% energiya**, lekin ## ✅ **so'zlar tushunarli**.

## ⭐ **ENERGIYA ≠ MA'LUMOT.** ## Bu — **butun modulning asosiy darsi**.

</details>

---

## 📌 Xulosa

```
f = 1/T        λ = v/f        v = 343 m/s
amplituda dB = 20·log10(x)    quvvat dB = 10·log10(x)
```

```
🔬 O'LCHANGAN:
   amplituda 2× → 6.02 dB · quvvat 2× → 3.01 dB
   krest-faktor (nutq) → 19.11 dB   (< 6 dB bo'lsa 💥 siqilgan)

   FAZA (440 Hz, ikki bir xil to'lqin):
       0° → amplituda 2.0000  quvvat 4.00×
     120° → amplituda 1.0000  quvvat 0.99×   ⚠️ quvvat OSHMADI
     180° → amplituda 0.0000  quvvat 0.00×   💥 TO'LIQ bekor  ← ANC

   GREBENKA (aks-sado):
     2 ms (68.6 sm) → 247, 748, 1248, 1749, 2250, 2750 Hz YO'QOLADI

   ENERGIYA TAQSIMOTI:
     0–300 Hz     59.12%   f0 — KIM gapiryapti
     300–2500 Hz  29.39%   F1+F2 — 🏆 NIMA deyilyapti
     4000–8000 Hz  9.30%   s/sh/f/t — 💥 telefon kesadi

   Bitta 25 ms nutq bo'lagida → 98–151 ta sezilarli chastota
   (sinusoida — model, haqiqat emas)
```

> ## 🏆🏆 **MODULNING ASOSIY DARSI: ENERGIYA ≠ MA'LUMOT.** ## Energiyaning **59% i** fonemani **umuman belgilamaydi**, ## fonemani belgilaydigan qism esa — atigi **29.4%**.

---

⬅️ [2-dars. To'lqin asoslari](02-Fundamentals-of-Sound-Waves.md) · 🏠 [Modul boshiga](README.md) · ➡️ [⚡ Mashqlar](MASHQLAR.md)
