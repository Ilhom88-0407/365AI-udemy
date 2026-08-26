# 2-dars. Kurs yondashuvi va yo'l xaritasi ⭐

## 🎬 Boshlashdan oldin

> **"Nazariyasiz kod yozsangiz — ishlaydi. Lekin buzilganda nima qilishni bilmaysiz."**

---

## 1. Kursning va'dasi

> ## 🔑 **KURS SHUNDAY DEYDI:** *"Asoslarni egallash sizga tizimni ishlab chiqish, sozlash va samarali joriy etish imkonini beradi."*
>
> ## ⭐ **VA BU — TO'G'RI. MISOL:**
> ```
> 💥 Whisper transkripsiyasi yomon chiqdi. Nima qilasiz?
>
> Nazariyasiz  →  boshqa modelni sinaysiz, keyin yana boshqasini...
>
> Nazariya bilan:
>    ① sample rate 16 kHz mi?     ← Whisper AYNAN shuni kutadi
>    ② fon shovqini SNR qancha?   ← 59-modul
>    ③ audio kesilganmi (clipping)? ← 54-modul
>    ④ til to'g'ri ko'rsatilganmi? ← 60-modul
> ```
>
> ## 🏆 **BU — NAZARIYANING AMALIY QIYMATI.** ## U **taxmin qilishni** — **tekshirishga** aylantiradi.

---

## 2. ⭐⭐ Blokning to'liq xaritasi

| Modul | Mavzu | Nima beradi |
|---|---|---|
| ## **52** | Kirish · tarix | Formant · garmonika · fonema |
| ## **53** | Tovush asoslari | To'lqin · chastota · amplituda · faza |
| ## **54** | 🏆 **Analog → raqamli** | Sample rate · bit chuqurligi · bitrate |
| ## **55** | 🏆 **Audio xususiyatlari** | ZCR · RMS · ⭐ **MFCC** · Furye |
| ## **56** | Texnologiya mexanikasi | HMM · CNN/RNN/LSTM · ⭐ **Transformer** |
| ## **57** | Muhitni sozlash | ## 💥 **Python 3.13+ da muammo bor** |
| ## **58** | Google Web Speech API | ## ⭐ **WER va CER** |
| ## **59** | Shovqin va spektrogramma | SNR · shovqin kamaytirish |
| ## **60** | 🏆 **OpenAI Whisper** | Mahalliy · ko'p fayl · CSV · TTS |
| ## **61** | Yakuniy muhokama | Cheklovlar · kelajak |

> ## ⭐ **AGAR VAQTINGIZ KAM BO'LSA — ENG MUHIM UCHTASI:**
> ```
> 54  →  sample rate va bit chuqurligi (💥 eng ko'p xato shu yerda)
> 55  →  MFCC (⭐ hamma modelning kirishi)
> 60  →  Whisper (🏆 amalda ishlatadiganingiz)
> ```

---

## 3. ⚠️ Kursning yondashuvidagi bo'shliqlar

> ### ① 💥 **Kurs faqat INGLIZCHA audio bilan ishlaydi**
> ## 🇺🇿 Biz **o'zbekcha** ni ham sinaymiz — va natijani **halol** aytamiz.
>
> ### ② 💥 **Kurs Anaconda talab qiladi**
> ## ⭐ Biz `venv` bilan ham ko'rsatamiz — **yengilroq** va **tezroq**.
>
> ### ③ 💥 **Kurs Google Web Speech API dan boshlaydi**
> ```
> ⚠️ u BEPUL, lekin:
>    · rasmiy hujjatlashtirilmagan (test kaliti)
>    · internet SHART
>    · ⚠️ audio Google serveriga YUBORILADI
>    · istalgan vaqtda O'CHIRILISHI mumkin
> ```
> ## 🏆 **BIZ WHISPER'NI BIRINCHI O'RINGA QO'YAMIZ** — ## u **mahalliy**, **bepul** va **maxfiy**.
>
> ### ④ 💥 **Kurs baholashni yuzaki o'tadi**
> ## ⭐ Biz **WER, CER, RTF** ni o'lchaymiz va ## 💥 **etalon matnning o'zi xato bo'lishi mumkinligini** ko'rsatamiz.

---

## 4. 🔬 Biz nimani o'lchaymiz

```
Bu blokdagi HAMMA raqam HAQIQIY faylda o'lchangan:
   audio: 23.5 s · 44.1 kHz · 24 bit · mono · 3.1 MB
          (kursning o'z speech_01.wav fayli)
```

| Nima | Qayerda |
|---|---|
| Bitrate = `sr × bit × kanal` | ## 54-modul — **1058 kbps** |
| Kvantlash SNR | ## 54-modul — 💥 **formula xato ko'rsatadi** |
| Nutq energiyasining taqsimoti | ## 54-modul — **59% 300 Hz dan past** |
| Formantlar *(LPC)* | ## 52-modul — F1/F2/F3 |
| f0 *(asosiy chastota)* | ## 52-modul — **median 136 Hz** |
| MFCC o'lchamlari | ## 55-modul |
| Whisper tezligi | ## 60-modul — **RTF 0.08** |
| WER va CER | ## 58-modul — 💥 **etalon xato** |

---

## 5. ⭐ Talablar

```bash
# ⭐ minimal
pip install numpy scipy matplotlib soundfile librosa

# ⭐ transkripsiya
pip install transformers torch jiwer

# ⚠️ ixtiyoriy (kursnikidek)
pip install SpeechRecognition
```

> ## 💥 **PYTHON 3.13+ DA MUHIM O'ZGARISH:**
> ```
> audioop moduli STANDART KUTUBXONADAN OLIB TASHLANDI (PEP 594)
>    →  💥 pydub ISHLAMAYDI
>    →  💥 SpeechRecognition ning ba'zi funksiyalari ISHLAMAYDI
> ```
> ## ⭐ **YECHIM — 57-MODULDA.** Biz `soundfile` + `librosa` ishlatamiz — ## ular `audioop` ga **bog'liq emas**.
>
> ## 🔬 **BU — O'LCHANGAN, TAXMIN EMAS:**
> ```python
> import audioop      # 💥 ModuleNotFoundError (Python 3.14.2)
> ```

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nazariya nima uchun kerak — bitta amaliy misol bilan.

**M2.** Nima uchun Whisper Google Web Speech API dan afzal?

**M3.** Python 3.13+ da qaysi modul yo'qoldi va bu nimaga ta'sir qiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Transkripsiya yomon chiqsa — ## **sample rate**, **SNR**, **clipping**, **til** ni **ketma-ket tekshirasiz**, ## modelni tasodifiy almashtirmaysiz.

**M2.** ## ⭐ **Mahalliy** *(internet kerak emas)* · **bepul** · ## 🔒 **audio hech qayerga yuborilmaydi** · **99 til**.

**M3.** ## `audioop` *(PEP 594)*. ## 💥 `pydub` va `SpeechRecognition` ning bir qismi **ishlamaydi**.

</details>

### 🟡 O'rta

**M4.** ⭐ Muhitingizni tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
import importlib, sys, platform

print(f"Python {sys.version.split()[0]} · {platform.system()} "
      f"{platform.machine()}\n")

KERAK = {
    "numpy": "asosiy", "scipy": "signal", "matplotlib": "grafik",
    "soundfile": "audio o'qish", "librosa": "audio tahlil",
    "transformers": "Whisper", "torch": "Whisper",
    "jiwer": "WER/CER",
}
IXTIYORIY = {
    "speech_recognition": "Google API (kursnikidek)",
    "audioop": "💥 Python 3.13+ da YO'Q",
    "pydub": "💥 audioop ga bog'liq",
}

for d, izoh in [(KERAK, "KERAK"), (IXTIYORIY, "IXTIYORIY")]:
    print(f"── {izoh} ──")
    for m, t in d.items():
        try:
            mod = importlib.import_module(m)
            v = getattr(mod, "__version__", "?")
            print(f"  ✅ {m:20s} {v:12s} {t}")
        except Exception:
            belgi = "⚠️" if d is IXTIYORIY else "💥"
            print(f"  {belgi} {m:20s} {'YO`Q':12s} {t}")
    print()
```

```
Python 3.14.2 · Windows AMD64

── KERAK ──
  ✅ numpy                2.5.1        asosiy
  ✅ scipy                1.18.1       signal
  ✅ librosa              1.0.0        audio tahlil
  ✅ transformers         5.15.1       Whisper
  ✅ torch                2.12.0+cpu   Whisper
  ...
── IXTIYORIY ──
  ⚠️ audioop             YO'Q         💥 Python 3.13+ da YO'Q
  ⚠️ pydub               YO'Q         💥 audioop ga bog'liq
```

## 🏆 **BU SKRIPTNI SAQLANG** — ## har yangi muhitda **birinchi** ishga tushiring.

</details>

---

## 📌 Xulosa

```
⭐ NAZARIYA = taxminni TEKSHIRISHGA aylantiradi

Blok xaritasi:
   52-53  akustika asoslari
   54     🏆 analog → raqamli  (eng ko'p xato shu yerda)
   55     🏆 audio xususiyatlari (MFCC)
   56     modellar (HMM → Transformer)
   57-60  🏆 amaliyot (Whisper)
   61     cheklovlar va kelajak

💥 Python 3.13+ da audioop YO'Q  →  pydub va SpeechRecognition qisman buzilgan
⭐ Yechim: soundfile + librosa
🇺🇿 Kurs faqat inglizcha ishlaydi — biz o'zbekchani ham O'LCHAYMIZ
```

---

⬅️ [1-dars. Xush kelibsiz](01-Welcome-to-Speech-Recognition.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Formant, garmonika, fonema](03-Formants-Harmonics-Phonemes.md)
