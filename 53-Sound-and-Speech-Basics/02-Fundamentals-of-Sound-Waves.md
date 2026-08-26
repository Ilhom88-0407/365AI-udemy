# 2-dars. Tovush to'lqinlarining asoslari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Zarralar to'lqin bilan birga ketmaydi. Faqat ENERGIYA harakatlanadi."**

---

## 1. To'lqin nima?

> ## 🔑 **KURSNING TA'RIFI:** *"To'lqin — energiyani bir joydan boshqasiga muhit orqali yoki bo'sh fazo orqali uzatuvchi buzilish."*
>
> | | 🔊 **Mexanik** *(tovush)* | 💡 **Elektromagnit** *(yorug'lik)* |
> |---|---|---|
> | Muhit | ## ⭐ **SHART** | ## 💥 kerak emas |
> | Kosmosda | ## 💥 **tarqalmaydi** | ## ✅ tarqaladi |
> | Tezlik *(havoda)* | ## **343 m/s** | ## **300 000 000 m/s** |
> | Tebranish yo'nalishi | ## Bo'ylama *(longitudinal)* | Ko'ndalang |
>
> ## 💡 **TEZLIK FARQI — 874 000 MARTA.** ## Shuning uchun chaqmoqni **ko'rasiz**, ## momaqaldiroqni esa **keyinroq eshitasiz**.
>
> ```python
> masofa_km = 3
> print(f"yorug'lik: {masofa_km*1000/3e8*1000:.5f} ms")
> print(f"tovush   : {masofa_km*1000/343:.2f} s")
> ```
> ```
> yorug'lik: 0.01000 ms
> tovush   : 8.75 s
> ```
> ## 🏆 **QOIDA: chaqmoqdan keyin soniyalarni sanang, 3 ga bo'ling — masofa km da.**

---

## 2. ⭐⭐ Zarralar ketmaydi — energiya ketadi

> ## 🔑 **KURSNING MISOLI JUDA YAXSHI:** *"Yonma-yon turgan odamlar qatorini tasavvur qiling. Biri ikkinchisini turtsa — turtki qator bo'ylab ketadi, lekin har bir odam O'Z JOYIDA qoladi."*
>
> ## ⭐ **RAQAMLARDA:**
> ```
> Oddiy suhbat (60 dB SPL) da havo zarrasining siljishi:
>    ≈ 0.00000001 m  =  10 nanometr
>    (atom o'lchamidan atigi ~50× katta)
>
> To'lqinning tezligi   →  343 m/s
> Zarraning tezligi     →  ~0.00005 m/s
>                          ⭐ 7 MILLION marta kam
> ```
>
> ## 💥 **SHUNING UCHUN GAPIRGANDA HAVO OQIMI HOSIL BO'LMAYDI.** ## Sham alangasi **tebranmaydi** — ## garchi tovush **shu yerdan o'tsa ham**.

### 🔬 Simulyatsiya

```python
import numpy as np


def zarra_harakati(f=1.0, n_zarra=30, kadr=40, amplituda=1.5):
    """⭐ Zarralar TEBRANADI, to'lqin ILGARILAYDI."""
    x0 = np.arange(n_zarra, dtype=float)
    k = 2 * np.pi / 8                      # to'lqin soni
    for t in np.linspace(0, 2, kadr)[:6]:
        x = x0 + amplituda * np.sin(k * x0 - 2 * np.pi * f * t)
        qator = [" "] * (n_zarra * 2)
        for p in x:
            i = int(round(p * 2))
            if 0 <= i < len(qator):
                qator[i] = "|"
        print(f"  t={t:4.2f}  " + "".join(qator))
    print(f"\n  ⭐ 1-zarraning joyi: "
          f"{x0[0]:.2f} -> {x0[0] + amplituda*np.sin(-2*np.pi*f*2):.2f}")
    print("     u JOYIDAN KETMADI — faqat tebrandi")
```

```
  t=0.00  |   |  |||  |   |   |  |||  |   |   |  |||  |   |   |  ||
  t=0.05     |   | | |   |   |   | | |   |   |   | | |   |   |   | |
  t=0.10    |   |  |||  |   |   |  |||  |   |   |  |||  |   |   |  ||
  t=0.15   |    |  |||  |  |    |  |||  |  |    |  |||  |  |    |  |||
  ...
  ⭐ 1-zarraning joyi: 0.00 -> 0.00
     u JOYIDAN KETMADI — faqat tebrandi
```

> ## 🏆 **NAQSH SIJIYAPTI, ZARRALAR ESA — YO'Q.** ## Bu — to'lqinning **butun mohiyati**.

---

## 3. ⭐⭐ Tovush qanday so'nadi

> ## 🔑 **KURS AYTADI:** *"To'lqinlar tarqalar ekan, energiya yo'qotadi, yoyiladi va kuchsizlanadi."*
>
> ## ⭐ **IKKI ALOHIDA MEXANIZM BOR — VA ULAR BUTUNLAY BOSHQACHA:**

### ① Geometrik yoyilish — **chastotaga bog'liq EMAS**

```python
for d in [1, 2, 4, 10, 100]:
    print(f"  {d:4d} m -> {20*np.log10(1/d):+7.2f} dB")
```

```
     1 m ->   +0.00 dB
     2 m ->   -6.02 dB
     4 m ->  -12.04 dB
    10 m ->  -20.00 dB
   100 m ->  -40.00 dB
```

> ## 🏆 **MASOFA IKKI BARAVAR ORTSA — 6 dB PASAYADI.** ## Bu — **hamma chastota** uchun **bir xil**.

### ② Havoda yutilish — 💥 **chastotaga JUDA bog'liq**

```
  chastota  dB/km   10 m da   100 m da
     125 Hz     0.4   0.004 dB    0.04 dB
     500 Hz     1.9   0.019 dB    0.19 dB
    1000 Hz     3.7   0.037 dB    0.37 dB
    4000 Hz    32.8   0.328 dB    3.28 dB
    8000 Hz   117.0   1.170 dB   11.70 dB
```
*(ISO 9613-1, 20 °C, 50% namlik — taxminiy qiymatlar)*

> ## 💥 **8 kHz — 125 Hz DAN 292× TEZ YUTILADI.**
>
> ## 🔑 **KURSNING MISOLI SHU BILAN TUSHUNTIRILADI:** ## *"Baland chastotali qush sayrashini eshitsangiz — qush yaqin. Uzoq konsertdan esa faqat basni eshitasiz."*
>
> ## ⚠️ **LEKIN KURS SABABNI TO'LIQ AYTMAYDI.** ## Aslida **ikkita** sabab bor:
> ```
> ① Havoda yutilish   →  yuqori chastotalar TEZROQ so'nadi   ⭐ asosiy
> ② Difraksiya        →  uzun to'lqin to'siqni AYLANIB o'tadi
>    (52-modul: 100 Hz → λ 3.43 m · 10 kHz → λ 3.4 sm)
> ```

### 🇺🇿 Amaliy oqibat — ASR uchun

```
📞 TELEFON YOZUVI:
   300–3400 Hz oralig'i  →  💥 4 kHz dan yuqorisi YO'Q
   →  s/sh/f/t fonemalari YOMON ajraladi
   →  ⭐ "sh" va "s" — ASR ning eng ko'p xatosi

🏞️ UZOQDAN YOZILGAN AUDIO:
   yuqori chastotalar YUTILGAN  →  aynan o'sha muammo

🏆 QOIDA: mikrofonni OG'IZGA YAQIN qo'ying (15–30 sm)
   →  har 2× yaqinlashish = +6 dB signal
```

---

## 4. ⭐ Muhitning ta'siri

| Muhit | Tezlik | Nisbat |
|---|---|---|
| Havo *(0 °C)* | 331 m/s | 1.0× |
| Havo *(20 °C)* | ## **343 m/s** | 1.04× |
| Suv | 1480 m/s | ## **4.3×** |
| Yog'och | 3300 m/s | 9.6× |
| Po'lat | ## **5100 m/s** | ## **14.9×** |
| Vakuum | ## 💥 **0** | ## 💥 **tarqalmaydi** |

```python
def tovush_tezligi(t_C):
    """⭐ Havodagi tezlik haroratga bog'liq."""
    return 331.3 * np.sqrt(1 + t_C / 273.15)


for t in [-20, 0, 20, 40]:
    v = tovush_tezligi(t)
    print(f"  {t:+4d} °C -> {v:6.1f} m/s   "
          f"(1 kHz to'lqin uzunligi {v/1000*100:5.1f} sm)")
```

```
   -20 °C -> 318.9 m/s   (1 kHz to'lqin uzunligi  31.9 sm)
     0 °C -> 331.3 m/s   (1 kHz to'lqin uzunligi  33.1 sm)
   +20 °C -> 343.2 m/s   (1 kHz to'lqin uzunligi  34.3 sm)
   +40 °C -> 354.7 m/s   (1 kHz to'lqin uzunligi  35.5 sm)
```

> ## 💡 **HARORAT 60 °C GA O'ZGARSA — TEZLIK ATIGI 11% O'ZGARADI.** ## Shuning uchun `343 m/s` — **amalda yetarli** aniqlik.
>
> ## ⚠️ **VA MUHIM: TEZLIK O'ZGARSA HAM, CHASTOTA O'ZGARMAYDI.** ## O'zgaradigan narsa — **to'lqin uzunligi** *(λ = v/f)*. ## 🏆 Shuning uchun **suv ostida ham** ovoz **o'sha ohangda** eshitiladi.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun kosmosda tovush tarqalmaydi?

**M2.** Zarralar to'lqin bilan birga ketadimi?

**M3.** Masofa 2× ortsa, daraja necha dB pasayadi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Tovush — **mexanik** to'lqin, ## unga **zarralardan iborat muhit** kerak.

**M2.** ## 💥 **Yo'q** — ular **tebranadi**, ## faqat **energiya** ilgarilaydi.

**M3.** ## **6.02 dB** *(o'lchandi)*.

</details>

### 🟡 O'rta

**M4.** ⭐ So'nishni ikki mexanizm bo'yicha hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
YUTILISH = {125: 0.4, 250: 1.0, 500: 1.9, 1000: 3.7,
            2000: 9.7, 4000: 32.8, 8000: 117.0}      # dB/km


def sonish(masofa_m, f):
    """⭐ Geometrik yoyilish + havoda yutilish."""
    geom = 20 * np.log10(1 / max(masofa_m, 1e-9))
    yut = -YUTILISH[f] * masofa_m / 1000
    return geom, yut, geom + yut


print("  masofa   chastota   geometrik  yutilish     JAMI")
for d in [1, 10, 50, 200]:
    for f in [125, 1000, 8000]:
        g, y, j = sonish(d, f)
        print(f"  {d:5d} m  {f:6d} Hz  {g:+8.2f}  {y:+8.2f}  {j:+8.2f} dB")
    print()
```

```
      1 m     125 Hz     +0.00     -0.00     -0.00 dB
      1 m    1000 Hz     +0.00     -0.00     -0.00 dB
      1 m    8000 Hz     +0.00     -0.12     -0.12 dB

    200 m     125 Hz    -46.02     -0.08    -46.10 dB
    200 m    1000 Hz    -46.02     -0.74    -46.76 dB
    200 m    8000 Hz    -46.02    -23.40    -69.42 dB
```

## 🏆 **200 m DA 8 kHz — 125 Hz DAN 23 dB TINCHROQ.** ## Bu — **14× amplituda** farqi.

## 💡 **SHUNING UCHUN UZOQ KONSERTDAN FAQAT BASNI ESHITASIZ.**

</details>

**M5.** ⭐⭐ Zarralar harakatini simulyatsiya qiling.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi `zarra_harakati()` ni ishga tushiring, so'ng grafik variantini yozing:

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

n, A, k = 40, 1.5, 2 * np.pi / 8
x0 = np.arange(n, dtype=float)
kuzat = 10                                    # ⭐ kuzatiladigan zarra

fig, ax = plt.subplots(2, 1, figsize=(11, 6))
for t in [0, 0.25, 0.5]:
    x = x0 + A * np.sin(k * x0 - 2 * np.pi * t)
    ax[0].plot(x, np.full(n, t), "|", ms=14,
               color="#38bdf8", alpha=1 - t / 1.5)
    ax[0].plot(x[kuzat], t, "o", ms=9, color="#f87171")
ax[0].set_title("Zarralar joylashuvi — qizil zarrani KUZATING")
ax[0].set_ylabel("vaqt")
ax[0].invert_yaxis()

tt = np.linspace(0, 3, 300)
ax[1].plot(tt, x0[kuzat] + A * np.sin(k * x0[kuzat] - 2 * np.pi * tt),
           color="#f87171")
ax[1].axhline(x0[kuzat], ls="--", color="#94a3b8")
ax[1].set_title("O'sha zarraning joyi — u MUVOZANAT ATROFIDA tebranadi")
ax[1].set_xlabel("vaqt")
plt.tight_layout()
plt.savefig("zarra.png", dpi=110)
print("💾 zarra.png")
```

## 🏆 **PASTKI GRAFIK — SINUSOIDA, YA'NI ZARRA HECH QAYERGA KETMAYDI.**

</details>

**M6.** ⭐ Chaqmoq masofasini hisoblovchi funksiya.

<details>
<summary>✅ Yechim</summary>

```python
def chaqmoq_masofasi(soniya, harorat_C=20):
    v = 331.3 * np.sqrt(1 + harorat_C / 273.15)
    m = soniya * v
    print(f"  {soniya:.1f} s · {harorat_C} °C · {v:.1f} m/s")
    print(f"  masofa: {m:.0f} m = {m/1000:.2f} km")
    print(f"  💡 taxminiy qoida (÷3): {soniya/3:.2f} km  "
          f"(xato {abs(m/1000 - soniya/3)/(m/1000):.1%})")
    return m


chaqmoq_masofasi(9)
chaqmoq_masofasi(9, harorat_C=-20)
```

```
  9.0 s · 20 °C · 343.2 m/s
  masofa: 3089 m = 3.09 km
  💡 taxminiy qoida (÷3): 3.00 km  (xato 2.9%)

  9.0 s · -20 °C · 318.9 m/s
  masofa: 2870 m = 2.87 km
  💡 taxminiy qoida (÷3): 3.00 km  (xato 4.5%)
```

## ✅ **"÷3" QOIDASI — 3–5% XATO BILAN ISHLAYDI.** ## Sovuqda biroz **yomonroq**.

</details>

---

## 📌 Xulosa

```
TOVUSH = mexanik to'lqin  →  MUHIT SHART  →  kosmosda YO'Q
ZARRALAR tebranadi (~10 nm), ENERGIYA ilgarilaydi (343 m/s)
```

```
🔬 O'LCHANGAN — SO'NISHNING IKKI MEXANIZMI:
   ① geometrik   masofa 2×  →  −6.02 dB   (chastotaga BOG'LIQ EMAS)
   ② yutilish    8 kHz      →  117 dB/km
                 125 Hz     →    0.4 dB/km   ⭐ 293× farq

   200 m da:  125 Hz −46.10 dB  ·  8 kHz −69.42 dB   (23 dB farq)

   tezlik:  −20 °C → 318.9 m/s  ·  +40 °C → 354.7 m/s   (11% farq)
   chaqmoq "÷3" qoidasi  →  3–5% xato ✅
```

> ## 🏆 **ASR UCHUN AMALIY XULOSA:** ## **MIKROFONNI OG'IZGA YAQIN QO'YING.** ## Har 2× yaqinlashish — **+6 dB signal**, ## va yuqori chastotalar *(s, sh, f, t)* **saqlanadi**.

---

⬅️ [1-dars. Odam nutqni qanday tanidi](01-How-Humans-Recognize-Speech.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. To'lqin xossalari](03-Properties-of-Sound-Waves.md)
