# 1-dars. Odam nutqni qanday tanidi? ⭐⭐

## 🎬 Boshlashdan oldin

> **"Mashina nutqni qanday tanishini tushunishning eng yaxshi yo'li — odam buni qanday qilishini bilish."**

---

## 1. Quloqdan miyagacha

```
🔊 TOVUSH TO'LQINI
      ↓
👂 QULOQ SUPRASI     →  yo'naltiradi
      ↓
🕳️ QULOQ YO'LI       →  ⭐ 2–4 kHz ni KUCHAYTIRADI (rezonans)
      ↓
🥁 NOG'ORA PARDA     →  to'lqin chastotasida tebranadi
      ↓
🦴 UCH SUYAKCHA      →  ⭐ bosimni ~20× kuchaytiradi
      ↓
🐚 KOXLEA            →  🏆 CHASTOTALARGA AJRATADI
      ↓
🧠 ESHITISH NERVI    →  elektr impulslar
      ↓
🧠 ESHITISH PO'STLOG'I →  naqsh tanish
```

> ## 🔑 **KURSNING MISOLI TO'G'RI:** ## pianinochi **A4 (LA)** notasini bossa — ## u **440 Hz** to'lqin chiqaradi, ## nog'ora parda **soniyasiga 440 marta** tebranadi.

---

## 2. 🏆 Koxlea — tabiiy Furye analizatori

> ## 🔑 **BU — MODULNING ENG MUHIM G'OYASI.**
>
> ```
> Koxlea — spiral naycha, ichida BAZILYAR MEMBRANA
>
> 🔵 BOSHIDA (tor, qattiq)  →  YUQORI chastotalar (20 kHz)
> 🔴 OXIRIDA (keng, yumshoq) →  PAST chastotalar (20 Hz)
>
> ⭐ HAR JOY — O'Z CHASTOTASIGA javob beradi
> ```
>
> ## 🏆 **YA'NI QULOQ SPEKTROGRAMMANI "APPARAT" DARAJASIDA HISOBLAYDI.** ## Miya **to'lqin shaklini** emas — ## **chastota taqsimotini** oladi.
>
> ## ⭐ **VA AYNAN SHUNING UCHUN HAMMA ASR TIZIMI SPEKTROGRAMMA ISHLATADI** — ## Whisper ham, HMM ham, 1952-yilgi Audrey ham.

### 🔬 Va mel shkalasi — koxleaning matematik modeli

```python
import numpy as np


def hz2mel(f):
    return 2595 * np.log10(1 + f / 700)


def mel2hz(m):
    return 700 * (10 ** (m / 2595) - 1)


print("  Hz      mel     +100 Hz nechta mel?")
for f in [100, 500, 1000, 2000, 4000, 8000, 16000]:
    print(f"  {f:6d}  {hz2mel(f):8.1f}   {hz2mel(f+100)-hz2mel(f):7.2f}")
```

```
     100     150.5    132.74
     500     607.4     90.21
    1000    1000.0     64.42
    2000    1521.4     40.99
    4000    2146.1     23.73
    8000    2840.0     12.88
   16000    3574.9      6.73
```

> ## 💥 **100 Hz DAN 200 Hz GA O'ZGARISH — 132.7 MEL.**
> ## 💥 **16 000 DAN 16 100 GA — ATIGI 6.7 MEL.**
>
> ## 🔑 **YA'NI QULOQ PAST CHASTOTALARDA 20× SEZGIRROQ.**
>
> ## ⭐ **AMALIY OQIBAT — MEL FILTRLAR TENG EMAS:**
> ```python
> m = np.linspace(hz2mel(0), hz2mel(8000), 42)[1:-1]
> c = mel2hz(m)
> print(f"birinchi 10 filtr: {int(c[0])}–{int(c[9])} Hz "
>       f"(kenglik {int(c[9]-c[0])})")
> print(f"oxirgi  10 filtr: {int(c[-10])}–{int(c[-1])} Hz "
>       f"(kenglik {int(c[-1]-c[-10])})")
> ```
> ```
> birinchi 10 filtr:   44– 594 Hz  (kenglik  549)
> oxirgi  10 filtr: 4005–7481 Hz  (kenglik 3476)
> ```
> ## 🏆 **PAST CHASTOTALARGA 6× KO'PROQ E'TIBOR.** ## Va bu — **tasodif emas**: ## nutq energiyasining **59% i 300 Hz dan past** *(52-modulda o'lchandi)*.

---

## 3. ⭐ Ikki quloq — fazoviy eshitish

> ## 🔑 **KURS AYTADI:** *"Bu ikkala quloqda bir vaqtda sodir bo'ladi, bu esa manba joyini aniqlash imkonini beradi."*
>
> ## ⭐ **IKKI MEXANIZM:**
> ```
> ① ITD (vaqt farqi)     →  PAST chastotalar (< 1.5 kHz)
>    boshning kengligi ~22 sm  →  maks farq 0.82 ms (o'lchandi)
>
> ② ILD (daraja farqi)   →  YUQORI chastotalar (> 1.5 kHz)
>    bosh to'lqinni TO'SADI  →  uzoq quloqda TINCHROQ
> ```
>
> ## 💡 **NIMA UCHUN CHASTOTAGA BOG'LIQ?** ## *(52-modulda o'lchangan to'lqin uzunliklari bilan)*
> ```
> 200 Hz  →  λ = 1.72 m   ≫ bosh (0.22 m)  →  bosh TO'SMAYDI  →  ITD
> 4000 Hz →  λ = 0.086 m  ≪ bosh (0.22 m)  →  bosh TO'SADI    →  ILD
> ```
>
> ## 🏆 **VA BU — ASR UCHUN AMALIY:** ## **ikki mikrofonli** qurilmalar *(telefon, kolonka)* ## aynan **ITD** yordamida ## **gapiruvchining ovozini** fon shovqinidan **ajratadi** *(beamforming)*.

---

## 4. 🧠 Miya — naqsh tanish

> ## 🔑 **KURS TO'G'RI BOG'LAYDI:** *"Naqsh tanish dastlabki nutqni tanish tajribalarining asosi edi — mexanizmlar hayratlanarli darajada o'xshash."*
>
> ## ⭐ **LEKIN BITTA MUHIM FARQ BOR:**
> ```
> MIYA  →  KUTADI. Kontekstdan keyingi so'zni OLDINDAN taxmin qiladi.
> ASR   →  eshitadi va TRANSKRIPSIYA qiladi.
> ```
>
> ## 💡 **MISOL — "FONEMANI TIKLASH" HODISASI:**
> ```
> "legi*lature" degan so'zda * o'rniga YO'TAL qo'ying
>    →  odam "legislature" ni ANIQ eshitadi
>    →  💥 yo'q bo'lgan tovushni MIYA O'ZI QO'SHADI
> ```
>
> ## 🏆 **VA WHISPER HAM AYNAN SHUNI QILADI** — ## u **til modeliga** ega va **kutilgan so'zni** yozadi. ## 💥 Shuning uchun u ba'zan **umuman aytilmagan** so'zni yozadi *(gallyutsinatsiya, 61-modul)*.

---

## 5. ⚠️ Odam va mashina — nima farq qiladi

| | 👂 Odam | 🤖 ASR |
|---|---|---|
| Shovqinda | ## 🏆 **juda yaxshi** | ## 💥 **sezilarli yomonlashadi** |
| Aksentga moslashish | ## ⭐ bir necha jumlada | 💥 model qayta o'qitilishi kerak |
| Bir vaqtda 2 kishi | ## ⭐ **birini tanlay oladi** | ## 💥 aralashib ketadi |
| Yangi so'z | Kontekstdan taxmin | 💥 lug'atdagi eng yaqiniga almashtiradi |
| Tezlik | Real vaqtda | ## 🏆 **real vaqtdan tez** *(RTF 0.08)* |
| Charchash | ## 💥 bor | ## 🏆 **yo'q** |
| Bir vaqtda 1000 oqim | ## 💥 imkonsiz | ## 🏆 **oddiy** |

> ## 🔑 **"KOKTEYL BAZMI EFFEKTI"** *(cocktail party effect)* — ## odam shovchoq xonada **bitta suhbatga** e'tibor qarata oladi. ## 💥 **ASR bu masalada hali ham ancha orqada.**
>
> ## 🏆 **XULOSA: ASR ODAMDAN YAXSHIROQ EMAS — U BOSHQACHA.** ## U **charchamaydi** va **miqyoslanadi** — ## qiymati **shunda**, aniqlikda emas.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Koxlea nima qiladi?

**M2.** Mel shkalasi nimani modellashtiradi?

**M3.** ITD va ILD farqi nima?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Tovushni **chastotalarga ajratadi** — ## ya'ni **spektrogrammani apparat darajasida** hisoblaydi.

**M2.** ## Quloqning **noteng sezgirligini**: ## o'lchandi — 100 Hz da **132.7 mel**, 16 kHz da **6.7 mel**.

**M3.** ## **ITD** — vaqt farqi, past chastotalar. ## **ILD** — daraja farqi, yuqori chastotalar *(bosh to'sadi)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Mel filtrlar taqsimotini chizing.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def mel_filtrlar(n_filtr=40, fmin=0, fmax=8000):
    m = np.linspace(hz2mel(fmin), hz2mel(fmax), n_filtr + 2)
    return mel2hz(m)


c = mel_filtrlar()
kengliklar = np.diff(c)

fig, ax = plt.subplots(2, 1, figsize=(10, 7))
ax[0].plot(c[1:-1], "o-", color="#38bdf8")
ax[0].set_title("Mel filtr markazlari — teng EMAS")
ax[0].set_xlabel("filtr raqami")
ax[0].set_ylabel("Hz")
ax[0].grid(alpha=.3)

ax[1].bar(range(len(kengliklar)), kengliklar, color="#4ade80")
ax[1].set_title("Filtr kengligi — past chastotalarda TOR")
ax[1].set_xlabel("filtr raqami")
ax[1].set_ylabel("kenglik, Hz")
ax[1].grid(alpha=.3)
plt.tight_layout()
plt.savefig("mel_filtrlar.png", dpi=110)
print("💾 mel_filtrlar.png")

print(f"  eng tor filtr : {kengliklar.min():7.1f} Hz")
print(f"  eng keng filtr: {kengliklar.max():7.1f} Hz")
print(f"  nisbat        : {kengliklar.max()/kengliklar.min():7.1f}×")
```

```
  eng tor filtr :    44.4 Hz
  eng keng filtr:   518.6 Hz
  nisbat        :    11.7×
```

## 🏆 **ENG KENG FILTR ENG TORIDAN 11.7× KATTA.** ## Bu — **quloqning sezgirlik egri chizig'i**, raqamlarda.

</details>

**M5.** ⭐⭐ ITD ni hisoblang va simulyatsiya qiling.

<details>
<summary>✅ Yechim</summary>

```python
import soundfile as sf

C = 343.0
BOSH = 0.22                                     # boshning kengligi, m


def itd(burchak_deg):
    """⭐ Ikki quloq orasidagi vaqt farqi (Woodworth formulasi)."""
    th = np.deg2rad(burchak_deg)
    return (BOSH / 2) * (th + np.sin(th)) / C


print("  burchak    ITD        namuna (44.1 kHz)")
for b in [0, 15, 30, 45, 60, 90]:
    t = itd(b)
    print(f"  {b:5d}°  {t*1e6:8.1f} µs   {t*44100:7.2f}")

# ⭐ stereo simulyatsiya: chapdan kelayotgan ovoz
sr = 44100
y = np.sin(2 * np.pi * 500 * np.arange(sr) / sr) * np.hanning(sr)
kechikish = int(itd(90) * sr)
chap = y
ong = np.concatenate([np.zeros(kechikish), y])[:len(y)] * 0.8
sf.write("chapdan.wav", np.stack([chap, ong], axis=1), sr)
print(f"\n  💾 chapdan.wav (quloqchin bilan tinglang) "
      f"kechikish {kechikish} namuna")
```

```
      0°       0.0 µs      0.00
     15°     167.0 µs      7.36
     30°     328.3 µs     14.48
     45°     478.6 µs     21.11
     60°     613.6 µs     27.06
     90°     824.5 µs     36.36
```

## 💡 **MAKSIMAL FARQ — ATIGI 0.82 ms.** ## Miya **shu 800 mikrosoniyadan** yo'nalishni aniqlaydi.

## ⚠️ **500 Hz TANLANDI — SABABI BOR.** ## 1.5 kHz dan yuqorida ITD **ishlamaydi**: ## to'lqin uzunligi boshdan **kichik** bo'lib qoladi va ## faza **noaniq** bo'ladi.

</details>

**M6.** ⭐⭐ Fonemani tiklash hodisasini sinang.

<details>
<summary>✅ Yechim</summary>

```python
import librosa

y, sr = librosa.load("speech_01.wav", sr=16000)

# ⭐ 0.15 s lik bo'lakni SHOVQIN bilan almashtiramiz
boshi = int(3.0 * sr)
uzunlik = int(0.15 * sr)
buzilgan = y.copy()
shovqin = np.random.RandomState(0).normal(
    0, np.abs(y[boshi:boshi+uzunlik]).max(), uzunlik)
buzilgan[boshi:boshi+uzunlik] = shovqin

# ⭐ va yana bir variant: JIMLIK bilan
ochirilgan = y.copy()
ochirilgan[boshi:boshi+uzunlik] = 0

for nom, s in [("asl", y), ("shovqin bilan", buzilgan),
               ("jimlik bilan", ochirilgan)]:
    sf.write(f"tiklash_{nom.split()[0]}.wav", s, sr)
    print(f"  💾 tiklash_{nom.split()[0]}.wav — {nom}")

print("\n  💡 Uchalasini TINGLANG:")
print("     shovqin bilan  →  miya yo'q bo'lgan tovushni QO'SHADI")
print("     jimlik bilan   →  💥 'uzilish' ANIQ eshitiladi")
```

## 🏆 **BU — HAYRATLANARLI HODISA:** ## **shovqin bilan** to'ldirilgan bo'shliq — **sezilmaydi**, ## **jimlik** — **darhol sezilar ekan**.

## ⭐ **VA WHISPER'NI HAM SHU IKKALA FAYLDA SINANG** *(60-modul)*: ## u qaysi birida **yaxshiroq** ishlaydi?

</details>

---

## 📌 Xulosa

```
🔊  →  quloq yo'li (2–4 kHz kuchaytirish)  →  nog'ora  →  3 suyakcha (20×)
    →  🐚 KOXLEA: chastotalarga AJRATADI   ←  ⭐ tabiiy spektrogramma
    →  eshitish nervi  →  miya: NAQSH + KUTISH
```

```
🔬 O'LCHANGAN — mel shkalasi (koxlea modeli):
   100 Hz da +100 Hz  →  132.74 mel     ⭐ sezgir
 16000 Hz da +100 Hz  →    6.73 mel     💥 20× kam sezgir

   40 mel filtr (0–8000 Hz):
     birinchi 10  →    44–594 Hz   (kenglik  549)
     oxirgi  10  →  4005–7481 Hz  (kenglik 3476)   ⭐ 6× keng

   ITD maksimum (90°)  →  824.5 µs  =  36.4 namuna (44.1 kHz)
   mel filtr kengligi   →  44.4 Hz ... 518.6 Hz  (11.7× farq)
```

> ## 🏆🏆 **KOXLEA SPEKTROGRAMMANI APPARAT DARAJASIDA HISOBLAYDI** — ## **VA AYNAN SHUNING UCHUN HAMMA ASR TIZIMI SPEKTROGRAMMA ISHLATADI.**
>
> ## ⭐ **ASR ODAMDAN YAXSHIROQ EMAS — U CHARCHAMAYDI VA MIQYOSLANADI.**

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Tovush to'lqinlari](02-Fundamentals-of-Sound-Waves.md)
