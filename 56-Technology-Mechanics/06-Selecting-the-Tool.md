# 6-dars. To'g'ri vositani tanlash ⭐⭐

## 🎬 Boshlashdan oldin

> **"Savol 'qaysi eng yaxshi?' emas. Savol — 'sizning vazifangiz uchun qaysi biri yetadi?'"**

---

## 1. Kursning ro'yxati — bugungi holat bilan

| Vosita | Kurs aytadi | ## ⚠️ **2025-yildagi holat** |
|---|---|---|
| ## **SpeechRecognition** | Oddiy, bepul, internet kerak | ## ⚠️ Google API **hujjatlashtirilmagan** |
| **Kaldi** | Kuchli, sozlanuvchan | ## 💥 **Rivojlanish sekinlashdi** — `k2`/`icefall` ga o'tdi |
| **DeepSpeech** *(Mozilla)* | RNN, real vaqtli | ## 💥 **2021-da to'xtatilgan** |
| **wav2letter++** *(Meta)* | Tez, samarali | ## 💥 **`Flashlight` ga ko'chgan**, kam ishlatiladi |
| ## 🏆 **Whisper** *(OpenAI)* | Mustahkam, 99 til | ## 🏆 **Bugungi standart** |
| **AssemblyAI** | API, pulli | ✅ faol |
| Google / AWS / Azure | Bulut, miqyoslanadi | ✅ faol |

> ## ⚠️⚠️ **KURSNING RO'YXATIDA UCHTA VOSITA ALLAQACHON ESKIRGAN.** ## Bu — kursning aybi emas: **soha juda tez o'zgaradi**.
>
> ## 🏆 **VA KURSDA YO'Q, LEKIN BUGUN MUHIM:**
> ```
> ⭐ faster-whisper     →  Whisper, 4× tez (CTranslate2)
> ⭐ whisper.cpp        →  C++ da, telefonda ham ishlaydi
> ⭐ WhisperX           →  so'z darajasida vaqt belgilari
> ⭐ NVIDIA NeMo        →  o'qitish va fine-tuning uchun
> ⭐ SpeechBrain        →  PyTorch, tadqiqot uchun
> ⭐ wav2vec2 (Meta)    →  Hugging Face da, fine-tune oson
> ```

---

## 2. ⭐⭐ Tanlash daraxti

```
Internet ishlatsa bo'ladimi?
├─ ❌ YO'Q (maxfiylik, oflayn)
│   └─ 🏆 Whisper (mahalliy) yoki whisper.cpp
│
└─ ✅ HA
    ├─ Byudjet $0?
    │   ├─ ✅ HA  →  🏆 Whisper (mahalliy)
    │   └─ ❌ YO'Q
    │       ├─ Diarizatsiya kerakmi?  →  ⭐ AssemblyAI
    │       └─ Katta miqyos?          →  ⭐ Google / AWS / Azure
    │
    └─ Real vaqtli oqim kerakmi?
        ├─ ✅ HA  →  ⚠️ Whisper YARAMAYDI (30 s bo'lak)
        │            🏆 Google Streaming · Deepgram · faster-whisper VAD bilan
        └─ ❌ YO'Q →  🏆 Whisper
```

> ## 💥💥 **"REAL VAQTLI OQIM" SHOXI — ENG MUHIMI, VA KURSDA YO'Q.**
>
> ## 🔑 **WHISPER OQIM UCHUN YARATILMAGAN:**
> ```
> U 30 s lik BO'LAKNI to'liq oladi va keyin ishlaydi
>    →  💥 kamida 30 s kechikish
>    →  ⚠️ VAD bilan bo'laklab, qisman hal qilsa bo'ladi
> ```

---

## 3. 🔬 Vositalarni o'lchaymiz

```python
import importlib, sys

VOSITALAR = {
    "speech_recognition": "SpeechRecognition (Google API)",
    "whisper": "openai-whisper (rasmiy)",
    "faster_whisper": "faster-whisper (CTranslate2)",
    "transformers": "Hugging Face (Whisper, wav2vec2)",
    "vosk": "Vosk (oflayn, yengil)",
    "deepspeech": "DeepSpeech (💥 to'xtatilgan)",
}

for m, izoh in VOSITALAR.items():
    try:
        mod = importlib.import_module(m)
        print(f"  ✅ {m:20s} {getattr(mod, '__version__', '?'):10s} {izoh}")
    except Exception:
        print(f"  ⬜ {m:20s} {'yo`q':10s} {izoh}")
```

```
  ✅ speech_recognition   3.17.0     SpeechRecognition (Google API)
  ⬜ whisper              yo'q       openai-whisper (rasmiy)
  ⬜ faster_whisper       yo'q       faster-whisper (CTranslate2)
  ✅ transformers         5.15.1     Hugging Face (Whisper, wav2vec2)
  ⬜ vosk                 yo'q       Vosk (oflayn, yengil)
  ⬜ deepspeech           yo'q       DeepSpeech (💥 to'xtatilgan)

  TIZIM VOSITALARI:
  ⬜ ffmpeg     topilmadi
  ⬜ sox        topilmadi

  CUDA: ⬜ yo'q (CPU) · torch 2.12.0+cpu
```

> ## ⭐ **`transformers` YETARLI** — ## u orqali Whisper ham, `wav2vec2` ham ishlaydi. ## 💡 Alohida `openai-whisper` paketi **shart emas**.

## ⚠⚠ **VA `ffmpeg` TOPILMADI — BU JIDDIY CHEKLOV:**
```
✅ WAV fayllar  →  ishlaydi (soundfile o'zi o'qiydi)
💥 MP3, M4A, video  →  ISHLAMAYDI
💥 rasmiy `openai-whisper` paketi ham ffmpeg TALAB qiladi
```
## 🏆 **SHUNING UCHUN BIZ `transformers` + `librosa` ISHLATAMIZ** — ## ular WAV bilan **ffmpeg'siz** ishlaydi.

---

## 4. ⚠️ Google Web Speech API — kurs boshlaydigan vosita

```python
import speech_recognition as sr

r = sr.Recognizer()
with sr.AudioFile("speech_01.wav") as manba:
    audio = r.record(manba)

matn = r.recognize_google(audio)      # ⚠️ hujjatlashtirilmagan test kaliti
print(matn)
```

> ## 💥💥 **BU KOD BILAN BESHTA MUAMMO BOR:**
> ```
> ① Kalit HUJJATLASHTIRILMAGAN — istalgan vaqtda o'chishi mumkin
> ② Internet SHART
> ③ 🔒 Audio Google serveriga YUBORILADI (maxfiylik!)
> ④ Tinish belgilari va bosh harflar YO'Q
> ⑤ Kunlik limit bor (rasman e'lon qilinmagan)
> ```
>
> ## 🇺🇿 **VA ③ — O'ZBEKISTONDAGI LOYIHALAR UCHUN JIDDIY MASALA:** ## tibbiy, huquqiy, bank yozuvlarini ## **uchinchi tomon serveriga yuborish** — ## ko'pincha **taqiqlangan**.
>
> ## 🏆 **WHISPER MAHALLIY ISHLAYDI — AUDIO KOMPYUTERINGIZDAN CHIQMAYDI.**

---

## 5. ⭐ 🇺🇿 O'zbekcha loyiha uchun aniq tavsiya

| Vazifa | Tavsiya | Nima uchun |
|---|---|---|
| Podkast / video subtitr | ## 🏆 **Whisper `small`/`medium`** | Sifat muhim, real vaqt shart emas |
| Call-markaz arxivi | ## ⭐ **faster-whisper `base`** | Hajm katta, tezlik muhim |
| Ovozli buyruq *(< 20 so'z)* | ## ⭐ **DTW yoki Vosk** | Whisper **ortiqcha** |
| Real vaqtli subtitr | ## ⚠️ **faster-whisper + VAD** | Whisper yolg'iz **yaramaydi** |
| Tibbiy / huquqiy | ## 🔒 **faqat MAHALLIY** | Maxfiylik |
| O'zbekcha aniqlik muhim | ## 🏆 **fine-tuned Whisper** | 5-dars, ② variant |

> ## 💥 **VA BITTA OGOHLANTIRISH:** ## Whisper'ning **o'zbekcha** aniqligi **inglizchadan ancha past**. ## 🔬 **Buni 60-modulda o'z ovozingiz bilan o'lchaysiz.**

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Kursning ro'yxatidagi qaysi vositalar eskirgan?

**M2.** Nima uchun Whisper real vaqtli oqim uchun yaramaydi?

**M3.** Google Web Speech API ning eng jiddiy muammosi qaysi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **DeepSpeech** *(2021-da to'xtatilgan)*, ## **wav2letter++** *(Flashlight ga ko'chgan)*, ## **Kaldi** *(k2/icefall ga o'tdi)*.

**M2.** ## U **30 s lik bo'lakni** to'liq oladi → ## 💥 kamida **30 s kechikish**.

**M3.** ## 🔒 **Audio Google serveriga yuboriladi** — ## maxfiylik. ## *(Va kalit hujjatlashtirilmagan.)*

</details>

### 🟡 O'rta

**M4.** ⭐ Muhitingizdagi vositalarni tekshiring.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 3-bo'limdagi kodni ishga tushiring va **qo'shing**:

```python
import shutil, subprocess

print("\n  TIZIM VOSITALARI:")
for v in ["ffmpeg", "sox"]:
    yol = shutil.which(v)
    print(f"  {'✅' if yol else '⬜'} {v:10s} {yol or 'topilmadi'}")

# ⭐ GPU bormi?
import torch
print(f"\n  CUDA: {'✅ ' + torch.cuda.get_device_name(0) if torch.cuda.is_available() else '⬜ yo`q (CPU)'}")
print(f"  torch {torch.__version__}")
```

## 💡 **`ffmpeg` — MP3/M4A/video bilan ishlash uchun SHART.** ## `librosa` va `whisper` ikkalasi ham unga **tayanadi**.

</details>

**M5.** ⭐⭐ Tanlash daraxtini funksiyaga aylantiring.

<details>
<summary>✅ Yechim</summary>

```python
def vosita_tanla(internet=True, byudjet=0, real_vaqt=False,
                 maxfiylik=False, diarizatsiya=False,
                 lugat_hajmi=10000, soat_oyiga=100):
    """🏆 Talablardan kelib chiqib vositani tavsiya qiladi."""
    sabab = []

    if maxfiylik or not internet:
        sabab.append("maxfiylik/oflayn -> faqat MAHALLIY")
        v = "faster-whisper (mahalliy)" if soat_oyiga > 50 else "Whisper"
        if real_vaqt:
            v += " + VAD (⚠️ 30 s kechikish qisman hal bo'ladi)"
        return v, sabab

    if lugat_hajmi < 50:
        sabab.append("kichik lug'at -> Whisper ORTIQCHA")
        return "Vosk yoki DTW (52-modul)", sabab

    if real_vaqt:
        sabab.append("real vaqtli oqim -> Whisper YARAMAYDI")
        return ("Google Streaming / Deepgram" if byudjet > 0
                else "faster-whisper + VAD"), sabab

    if diarizatsiya:
        sabab.append("diarizatsiya kerak")
        return ("AssemblyAI" if byudjet > 0
                else "WhisperX + pyannote (bepul)"), sabab

    if byudjet == 0:
        sabab.append("byudjet $0")
        return ("faster-whisper" if soat_oyiga > 100 else "Whisper"), sabab

    narx_api = soat_oyiga * 0.36 * 12
    sabab.append(f"API yillik narxi ≈ ${narx_api:,.0f}")
    if narx_api > 3000:
        sabab.append("$3000+ -> mahalliy ARZONROQ")
        return "faster-whisper (o'z serveringizda)", sabab
    return "OpenAI Whisper API", sabab


HOLATLAR = [
    ("Podkast subtitri", dict(soat_oyiga=20)),
    ("Call-markaz arxivi", dict(soat_oyiga=2000, byudjet=1)),
    ("Tibbiy transkripsiya", dict(maxfiylik=True, soat_oyiga=200)),
    ("Ovozli buyruq (10 ta)", dict(lugat_hajmi=10)),
    ("Real vaqtli subtitr", dict(real_vaqt=True, byudjet=1)),
    ("Uchrashuv (kim gapirdi)", dict(diarizatsiya=True, byudjet=0)),
]

for nom, kw in HOLATLAR:
    v, s = vosita_tanla(**kw)
    print(f"\n  📋 {nom}")
    print(f"     🏆 {v}")
    for x in s:
        print(f"        · {x}")
```

## 🏆 **BU FUNKSIYANI O'Z TALABLARINGIZ BILAN TO'LDIRING** — ## u **qaror hujjati** vazifasini bajaradi.

</details>

**M6.** ⭐⭐ Google API va Whisper ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import time, librosa

y, sr = librosa.load("speech_01.wav", sr=16000)

# ── ① Whisper (mahalliy) ──
from transformers import pipeline
asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")
t0 = time.perf_counter()
w = asr(y.copy(), generate_kwargs={"language": "en"})["text"].strip()
tw = time.perf_counter() - t0
print(f"  Whisper ({tw*1000:.0f} ms):\n    {w[:120]}")

# ── ② Google Web Speech API ──
try:
    import speech_recognition as sr_lib
    r = sr_lib.Recognizer()
    with sr_lib.AudioFile("speech_01.wav") as manba:
        audio = r.record(manba)
    t0 = time.perf_counter()
    g = r.recognize_google(audio)
    tg = time.perf_counter() - t0
    print(f"\n  Google ({tg*1000:.0f} ms):\n    {g[:120]}")
    print("\n  ⚠️ FARQLARGA E'TIBOR BERING:")
    print("     tinish belgilari · bosh harflar · raqamlar")
except Exception as e:
    print(f"\n  💥 Google API: {type(e).__name__}: {str(e)[:100]}")
    print("     (internet yo'q yoki kalit ishlamayapti)")
```

```
  Whisper (1846 ms):
    My name is Yvonne and I am excited to have you as part of our
    learning community. Before we get started, I'd like to tell you
    a little bit about myself...

  Google (5114 ms):
    my name is Yvonne and I am excited to have you as part of our
    Learning Community before we get started I'd like to tell you
    a little bit about myself
```

## 🏆 **ASOSIY FARQ — TINISH BELGILARI VA BOSH HARFLAR:**
```
Whisper  →  "community. Before we get started, I'd like..."   ⭐ nuqta, vergul
Google   →  "Learning Community before we get started I'd..."  💥 hech narsa
```

## ⚠️ **VA GOOGLE "Learning Community" NI BOSH HARF BILAN YOZDI** — ## u buni **atoqli ot** deb hisobladi. ## 💡 Whisper esa **kichik harf** bilan — **to'g'ri**.

## ⭐ **TEZLIK: Whisper 1846 ms · Google 5114 ms** — ## mahalliy model **2.8× tez** *(internet kechikishisiz)*.

## 💡 **VA BU — 58-MODULDA `WER` GA JIDDIY TA'SIR QILADI:** ## tinish belgilari va registr **normallashtirilmasa**, ## Google ning WER i **sun'iy ravishda yomon** ko'rinadi.

</details>

---

## 📌 Xulosa

```
🏆 BUGUNGI STANDART — Whisper (va uning tezroq variantlari)

⚠️ KURSNING RO'YXATIDA UCHTA VOSITA ESKIRGAN:
   DeepSpeech (2021-da to'xtatilgan) · wav2letter++ · Kaldi (sekinlashdi)

⭐ KURSDA YO'Q, LEKIN MUHIM:
   faster-whisper · whisper.cpp · WhisperX · NeMo · SpeechBrain · wav2vec2
```

```
TANLASH:
   maxfiylik/oflayn   →  🏆 mahalliy Whisper
   real vaqtli oqim   →  ⚠️ Whisper YARAMAYDI (30 s kechikish)
   kichik lug'at      →  ⭐ Vosk yoki DTW (Whisper ortiqcha)
   diarizatsiya       →  ⭐ WhisperX + pyannote (bepul) yoki AssemblyAI
   katta miqyos       →  💰 narxni HISOBLANG: $3000+ da mahalliy arzonroq
```

> ## 💥 **GOOGLE WEB SPEECH API — 🔒 AUDIO SERVERGA YUBORILADI.** ## Tibbiy, huquqiy va bank yozuvlari uchun — ## **ko'pincha taqiqlangan**.
>
> ## 🏆 **WHISPER MAHALLIY ISHLAYDI. AUDIO KOMPYUTERINGIZDAN CHIQMAYDI.**

---

⬅️ [5-dars. Modelni qurish](05-Building-a-Model.md) · 🏠 [Modul boshiga](README.md) · ➡️ [⚡ Mashqlar](MASHQLAR.md)
