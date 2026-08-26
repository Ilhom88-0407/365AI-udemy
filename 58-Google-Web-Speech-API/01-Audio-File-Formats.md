# 1-dars. Nutqni tanish uchun audio formatlar ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: WAV — nutqni tanish uchun oltin standart. Biz MP3, OGG va WAV ni bir xil API ga berdik. Uchtasi ham AYNAN bir xil matn qaytardi."**

---

## 1. Format nima — va nega u muhim?

54-modulda **analog → raqamli** aylantirishni ko'rdik: signal `sr` marta o'lchanadi, har bir o'lchov `bit_depth` bit bilan yoziladi. **Format** — bu shu raqamlar **diskda qanday saqlanishi**.

```
         analog                raqamli namunalar              FAYL
    ∿∿∿∿∿∿∿∿∿  ──ADC──►  [0.31, -0.15, 0.44, ...]  ──format──►  📄
                              (float32 massiv)
                                                    ┌─────────────────┐
                                                    │ WAV  — xomligicha│
                                                    │ FLAC — siqilgan, │
                                                    │        yo'qotishsiz│
                                                    │ MP3  — siqilgan, │
                                                    │        yo'qotish bilan│
                                                    └─────────────────┘
```

> ## 🔑 **UCHTA SAVOLGA JAVOB BERADI:**
> ## ① **Qancha joy egallaydi?** ② **Sifat yo'qoladimi?** ③ **Vositangiz uni o'qiy oladimi?**

---

## 2. Kursning ro'yxati

| Format | Kurs nima deydi |
|---|---|
| **WAV** | Siqilmagan · 192 kHz gacha · 32 bit gacha · ## 🏆 *"oltin standart"* |
| **FLAC** | Yo'qotishsiz siqish · *"650 kHz gacha"* |
| **MP3** | Yo'qotish bilan siqish · *"kundalik ishlatish uchun"* |
| **AAC** | MP3 dan yaxshiroq shu bitreytda |
| **M4A** | Mobil va striming uchun |

> ## ⚠️ **KURSDAGI XATO:** ## FLAC ning maksimal chastotasi **650 kHz emas**, ## rasmiy spetsifikatsiyada **655 350 Hz** — ya'ni ≈ **655 kHz**. ## Bu mayda gap, lekin **raqamlarni tekshirish odati** shu yerdan boshlanadi.

---

## 3. 🔬 O'lchaymiz — beshta formatni yonma-yon

Bir xil 16 soniyalik audio, beshta formatda:

```python
import os, time
import numpy as np, soundfile as sf, librosa
import speech_recognition as sr

y, srate = librosa.load("speech_01.wav", sr=None)
y16 = y[: 16 * srate]                       # 16 s

for ext, sub in [("wav", "PCM_16"), ("wav", "PCM_24"), ("flac", "PCM_16"),
                 ("mp3", None), ("ogg", None)]:
    p = f"test_{ext}_{sub or 'def'}.{ext}"

    t0 = time.perf_counter()
    sf.write(p, y16, srate, subtype=sub) if sub else sf.write(p, y16, srate)
    tw = (time.perf_counter() - t0) * 1000

    kb = os.path.getsize(p) / 1024
    z, _ = sf.read(p, dtype="float32")

    n = min(len(z), len(y16))
    err = z[:n] - y16[:n]
    snr = 10 * np.log10(np.mean(y16[:n] ** 2) / np.mean(err ** 2))

    try:                                    # SpeechRecognition o'qiy oladimi?
        with sr.AudioFile(p) as s:
            sr.Recognizer().record(s)
        ok = "✅"
    except Exception:
        ok = "💥"

    print(f"{ext.upper():5s} {sub or 'default':8s} {kb:8.1f} KB  "
          f"{tw:6.1f} ms  SNR {snr:7.2f} dB  SR:{ok}")
```

### 📊 Natija

| Format | Subtype | Hajm | Nisbat | Yozish | SNR | `SpeechRecognition` |
|---|---|---|---|---|---|---|
| WAV | `PCM_16` | 1378.2 KB | 1.00× | 7.6 ms | 74.82 dB | ## ✅ |
| WAV | `PCM_24` | ## **2067.2 KB** | 0.67× | 8.0 ms | ## 🏆 **279.72 dB** | ## ✅ |
| FLAC | `PCM_16` | ## ⭐ **798.5 KB** | ## ⭐ **1.73×** | 17.3 ms | 80.83 dB | ## ✅ |
| MP3 | *default* | 186.0 KB | ## **7.41×** | 68.5 ms | ## ⚠️ **19.86 dB** | ## 💥 |
| OGG | *default* | ## 🏆 **151.4 KB** | ## 🏆 **9.10×** | ## 💥 **168.0 ms** | ## ⚠️ **15.28 dB** | ## 💥 |

> ## 🔑 **UCHTA NARSA DARROV KO'RINADI:**
>
> ## ① **`PCM_24` ning SNR i 279.72 dB** — bu **"xato yo'q"** degani. ## Manba `float32` edi, 24 bit uni **to'liq** ushlaydi.
> ## ② **OGG eng kichik, lekin eng sekin** — 168 ms, ## ya'ni WAV dan **22×** sekin.
> ## ③ ## 💥 **`SpeechRecognition` MP3 VA OGG NI UMUMAN O'QIMAYDI.**

---

## 4. 💥 `SpeechRecognition` faqat uchta formatni biladi

Kutubxonaning **manba kodiga** qaraymiz:

```python
import inspect, speech_recognition as sr
print(inspect.getsource(sr.AudioFile.__enter__))
```

```
# attempt to read the file as WAV
self.audio_reader = wave.open(self.filename_or_fileobject, "rb")
...
# attempt to read the file as AIFF
...
# attempt to read the file as FLAC
flac_converter = get_flac_converter()
...
raise ValueError("Audio file could not be read as PCM WAV,
                  AIFF/AIFF-C, or Native FLAC; check if file is
                  corrupted or in another format")
```

> ## 🏆 **BU — TAXMIN EMAS, KODNING O'ZI.** ## `AudioFile` ketma-ket **WAV → AIFF → FLAC** ni sinaydi, ## uchtasi ham bo'lmasa — `ValueError`.

| Format | `sf.write` yozadimi | `AudioFile` o'qiydimi |
|---|---|---|
| WAV | ✅ | ## ✅ |
| FLAC | ✅ | ## ✅ *(ichki `flac.exe` orqali)* |
| AIFF | ✅ | ## ✅ |
| MP3 | ## ✅ *(`soundfile 0.14`)* | ## 💥 **`ValueError`** |
| OGG | ✅ | ## 💥 **`ValueError`** |

> ## 💡 **AMALIY XULOSA:** ## MP3 faylni transkripsiya qilish uchun ## **avval WAV ga aylantiring** — bu bir qator kod:
> ```python
> y, s = librosa.load("audio.mp3", sr=16000)   # librosa MP3 ni o'qiydi
> sf.write("audio.wav", y, s)                  # WAV ga yozamiz
> ```

---

## 5. ⭐⭐⭐ Eng muhim savol: siqish **transkripsiyani** buzadimi?

Kurs aytadi: *"WAV fayllar har bir nozik jihatni saqlab, nutqni matnga aylantirish tizimlari uchun eng yaxshi sifatli kirishni beradi."*

**Sinab ko'ramiz.** Bir xil audio, uch xil yo'l bilan API ga:

```python
rec = sr.Recognizer()

for label, src in [("asl WAV", None),
                   ("MP3 -> WAV", "test_mp3_def.mp3"),
                   ("OGG -> WAV", "test_ogg_def.ogg")]:
    z, s2 = (y16, srate) if src is None else sf.read(src, dtype="float32")
    sf.write("api.wav", z, s2)

    with sr.AudioFile("api.wav") as s:
        a = rec.record(s)
    txt = rec.recognize_google(a)
    print(f"{label:12s} WER {wer(GT, txt):.4f}  ({len(txt.split())} so'z)")
    print(f"             {txt[:74]}")
```

```
asl WAV      WER 0.4754  (45 so'z)
             my name is Yvonne and I am excited to have you as part of our Learning Com
MP3 -> WAV   WER 0.4754  (45 so'z)
             my name is Yvonne and I am excited to have you as part of our Learning Com
OGG -> WAV   WER 0.4754  (45 so'z)
             my name is Yvonne and I am excited to have you as part of our Learning Com
```

> ## 🏆🏆🏆 **UCHTASI HAM AYNAN BIR XIL MATN QAYTARDI.**
>
> ## 💥 **VA BU — SNR 279 dB DAN 15 dB GACHA TUSHGANDA HAM.**
>
> ## 🔑 **SABAB:** ## MP3 va OGG **psixoakustik** siqish ishlatadi — ## ular **odam qulog'i sezmaydigan** qismlarni tashlaydi. ## Nutq esa **0–4 kHz** da, ya'ni siqish **eng kam** tegadigan zonada.

### ⚠️ Lekin bu "har doim shunday" degani emas

Sinovimiz **bitta fayl** va **bitta bitreyt** da. Nima **haqiqatan** o'zgaradi:

| Vaziyat | Ta'sir |
|---|---|
| Yuqori bitreyt MP3 *(128 kbps+)* | ## ✅ **sezilmaydi** — biz shuni o'lchadik |
| Juda past bitreyt *(≤ 32 kbps)* | ## ⚠️ **yuqori formantlar yo'qoladi** |
| Ketma-ket qayta siqish | ## 💥 **har safar yomonlashadi** |
| Telefon kodeklari *(GSM, AMR)* | ## 💥 **4 kHz da kesadi** — 56-modulga qarang |

> ## 💡 **TO'G'RI XULOSA:** ## *"WAV eng yaxshi"* — **noto'g'ri emas**, lekin **noaniq**. ## To'g'risi: **"WAV eng ishonchli, ## chunki siqish artefaktlari haqida o'ylash kerak emas."** ## Sifat farqi — nutqda **odatda nolga teng**.

---

## 6. 💥 Kutilmagan topilma: `soundfile` OGG da **qulaydi**

Kattaroq fayl bilan sinaganda Python **umuman xato bermay** o'ldi:

```
Windows fatal exception: stack overflow

Current thread 0x00008ed0 (most recent call first):
  File "...\soundfile.py", line 1434 in _cdata_io
  File "...\soundfile.py", line 1089 in write
```

### 🔬 Chegarani topamiz

```python
import numpy as np, soundfile as sf

for n in [700_000, 750_000, 800_000]:
    sf.write("t.ogg", np.zeros(n, dtype="float32"), 44100)
    print(n, "✅")
```

| Namunalar | Davomiylik *(44.1 kHz)* | Natija |
|---|---|---|
| 700 000 | 15.9 s | ## ✅ |
| ## **750 000** | 17.0 s | ## 💥 **stack overflow** |
| 800 000 | 18.1 s | ## 💥 |
| 960 000 *(16 kHz da 60 s)* | 60.0 s | ## 💥 |

> ## 🔑 **BU DAVOMIYLIKKA EMAS, NAMUNALAR SONIGA BOG'LIQ** — ## 16 kHz da 60 s ham quladi. ## Chegara **700 000 va 750 000 oralig'ida**.

> ## ⚠️ **VA BU — `Exception` EMAS.** ## `try/except` **ushlamaydi**. ## Jarayon **butunlay o'ladi**. ## ## 💥 Skriptingiz jimgina to'xtaydi.

### ✅ Yechim — bloklab yozish

```python
with sf.SoundFile("uzun.ogg", "w", samplerate=srate,
                  channels=1, format="OGG") as f:
    for i in range(0, len(y), srate):        # 1 soniyalik bloklar
        f.write(y[i:i + srate])
```

```
blokli ✅ 218.4 KB          # 23.5 s — muammosiz
```

| Format | 3 000 000 namuna *(68 s)* |
|---|---|
| WAV | ## ✅ |
| FLAC | ## ✅ |
| MP3 | ## ✅ |
| ## OGG | ## 💥 **KRASH** |

> ## 🔧 **57-MODULGA TUZATISH.** ## O'sha yerda *"OGG ✅ ishladi"* deb yozgan edim — ## sinov fayli **3 soniyalik** edi. ## Bu **to'g'ri, lekin to'liq emas**: ## OGG **qisqa** fayllarda ishlaydi, ## uzunlarida **bir yo'la yozib bo'lmaydi**.

---

## 7. Qaysi formatni tanlash kerak?

```
                    ┌──────────────────────────────┐
                    │  Audio menda qaysi formatda? │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
         WAV / FLAC            MP3 / OGG            M4A / AAC
         / AIFF                 / boshqa             / video
              │                    │                    │
              ▼                    ▼                    ▼
     SpeechRecognition    librosa.load() bilan   ffmpeg KERAK
     to'g'ridan-to'g'ri     WAV ga aylantiring   (57-modul)
       o'qiy oladi ✅
```

| Vaziyat | Tanlov | Sabab |
|---|---|---|
| Arxiv, qayta ishlanadigan manba | ## ⭐ **FLAC** | 1.73× kichik, **yo'qotishsiz** |
| `SpeechRecognition` ga berish | ## ⭐ **WAV `PCM_16`** | to'g'ridan-to'g'ri o'qiladi |
| Katta hajmni tarmoqda uzatish | ## ⭐ **MP3** | 7.41× kichik, WER **o'zgarmaydi** |
| Uzun OGG yozish | ## ⚠️ **bloklab** | aks holda **krash** |
| Whisper ga berish | ## ⭐ **farqi yo'q** | 60-modulda ko'ramiz |

---

## 8. ⭐ Universal yuklovchi

Har qanday formatni qabul qiladigan, `SpeechRecognition` uchun tayyorlaydigan funksiya:

```python
import os, tempfile
import librosa, soundfile as sf
import speech_recognition as sr

SR_TUSHUNADI = {".wav", ".flac", ".aiff", ".aif", ".aifc"}


def asr_uchun_tayyorla(yol, chastota=16000):
    """Istalgan audioni SpeechRecognition o'qiy oladigan WAV ga aylantiradi.

    Qaytaradi: (wav_yoli, vaqtinchalik_mi)
    """
    ken = os.path.splitext(yol)[1].lower()

    # allaqachon mos va chastota ham to'g'ri bo'lsa — tegmaymiz
    if ken in SR_TUSHUNADI:
        info = sf.info(yol)
        if info.samplerate == chastota and info.channels == 1:
            return yol, False

    y, _ = librosa.load(yol, sr=chastota, mono=True)      # ⭐ hamma narsani o'qiydi
    fd, vaqt = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    sf.write(vaqt, y, chastota, subtype="PCM_16")
    return vaqt, True


def transkripsiya(yol):
    wav, vaqtinchalik = asr_uchun_tayyorla(yol)
    try:
        rec = sr.Recognizer()
        with sr.AudioFile(wav) as s:
            audio = rec.record(s)
        return rec.recognize_google(audio)
    finally:
        if vaqtinchalik:
            os.remove(wav)                                # ⭐ tozalash SHART
```

```python
print(transkripsiya("speech_01.wav"))   # ✅
print(transkripsiya("nutq.mp3"))        # ✅ endi MP3 ham ishlaydi
print(transkripsiya("nutq.ogg"))        # ✅
```

> ## 💡 **`try/finally` NEGA KERAK?** ## API xato bersa ham vaqtinchalik fayl **o'chirilishi** kerak. ## Aks holda `%TEMP%` papkangiz **sekin-asta to'ladi**.

---

## 🎯 Nazorat savollari

1. `SpeechRecognition` nechta formatni o'qiy oladi? Ular qaysilar?
2. MP3 ga siqish transkripsiyani buzadimi? Bizning o'lchovimiz nima ko'rsatdi?
3. `PCM_24` ning SNR i nega 279 dB chiqdi?
4. `soundfile` OGG da qachon quladi va nega `try/except` yordam bermaydi?
5. FLAC WAV dan necha marta kichik — va sifat yo'qoladimi?
6. `asr_uchun_tayyorla()` da `try/finally` nima uchun ishlatilgan?

<details>
<summary>Javoblar</summary>

1. **Uchta**: WAV *(PCM)*, AIFF/AIFF-C, FLAC. Manba kodida `__enter__` ketma-ket shu uchtasini sinaydi, keyin `ValueError`.
2. **Yo'q.** WAV, MP3 va OGG **aynan bir xil** matn berdi (WER 0.4754 uchalasida), SNR 279 → 15 dB tushganiga qaramay. Nutq energiyasi 0–4 kHz da, siqish esa asosan yuqori chastotalarni tashlaydi.
3. Manba `float32` massiv edi. `PCM_24` ≈ 16.7 mln daraja beradi — bu `float32` ning nutq diapazonidagi aniqligidan yuqori, shuning uchun **xato deyarli nol**.
4. **≈ 750 000 namunadan** boshlab (davomiylikka emas, **namunalar soniga** bog'liq). Bu Python darajasidagi `Exception` emas, C kutubxonasidagi **stack overflow** — jarayon butunlay o'ladi. Yechim: `sf.SoundFile` bilan **bloklab** yozish.
5. **1.73×** kichik (1378.2 → 798.5 KB). **Yo'qotishsiz** — SNR 80.83 dB, bu `PCM_16` ning o'z chegarasi.
6. API **xato bersa ham** vaqtinchalik WAV o'chirilishi kerak. `finally` bloki istisno bo'lganda ham bajariladi.

</details>

---

⬅️ [56-modul](../56-Technology-Mechanics/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-Importing-Audio-in-Jupyter.md)
