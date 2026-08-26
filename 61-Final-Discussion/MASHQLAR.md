# 📝 61-modul. Mashqlar

> **14 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Bu modul — **muhokama**, lekin har bir da'voni **o'lchash mumkin**.

---

## 🟢 1-mashq. RTF ni o'lchang

Turli bo'lak uzunliklarida Real Time Factor ni hisoblang.

<details><summary>Yechim</summary>

```python
import numpy as np, time, librosa
from transformers import pipeline

asr = pipeline("automatic-speech-recognition", model="openai/whisper-base", device=-1)
y, _ = librosa.load("speech_01.wav", sr=16000)

for b in [1, 2, 3, 5, 10]:
    z = y[:b * 16000]
    ts = []
    for _ in range(3):
        t0 = time.perf_counter(); asr(z.copy()); ts.append(time.perf_counter() - t0)
    dt = float(np.median(ts))
    print(f"{b:2d} s: {dt:.2f} s  RTF {dt/b:.2f}  "
          f"{'✅' if dt/b < 1 else '💥'}  kechikish {b + dt:.2f} s")
```

```
 1 s: 0.65 s  RTF 0.65  ✅  kechikish  1.65 s      ⭐ eng tez
10 s: 1.56 s  RTF 0.16  ✅  kechikish 11.56 s
```

**RTF ≠ kechikish** — foydalanuvchi bo'lak to'lishini ham kutadi.
</details>

---

## 🟢 2-mashq. Model o'lchamlari va RTF

`tiny`, `base`, `small` ni disk hajmi va RTF bo'yicha solishtiring.

<details><summary>Yechim</summary>

```python
import os, glob
H = os.path.expanduser("~/.cache/huggingface/hub")
for m in ["tiny", "base", "small"]:
    a = pipeline("automatic-speech-recognition", model=f"openai/whisper-{m}", device=-1)
    a(y[:16000].copy())                      # ⭐ isitish
    ts = [olcha(lambda: a(y.copy())) for _ in range(3)]
    d = os.path.join(H, f"models--openai--whisper-{m}")
    sz = sum(os.path.getsize(p) for p in glob.glob(f"{d}/**/*", recursive=True)
             if os.path.isfile(p)) / 1024 / 1024
    print(f"{m:6s} {sz:7.1f} MB  RTF {np.median(ts)/(len(y)/16000):.3f}")
```

```
tiny     148.2 MB  RTF 0.078
base     281.1 MB  RTF 0.113
small    926.4 MB  RTF 0.244
```
</details>

---

## 🟡 3-mashq. 🏆 Whisper bilan tarjima

`task="translate"` ni sinang.

<details><summary>Yechim</summary>

```python
from gtts import gTTS
gTTS(text="Bonjour, je m'appelle Marie.", lang="fr").save("fr.mp3")
z, _ = librosa.load("fr.mp3", sr=16000)

print("transkript:", asr(z.copy())["text"])
print("tarjima   :", asr(z.copy(), generate_kwargs={"task": "translate"})["text"])
```

```
transkript: Bonjour, je m'appelle Marie.
tarjima   : Hello, my name is Marie.
```

⚠️ **Faqat ingliz tiliga** tarjima qiladi.
</details>

---

## 🟡 4-mashq. 💥 Kam resursli tilda nima bo'ladi?

Turkcha jumlani transkripsiya va tarjima qiling.

<details><summary>Yechim</summary>

```python
M = "Merhaba, ben bir ses mühendisiyim ve veri bilimi öğreniyorum."
gTTS(text=M, lang="tr").save("tr.mp3")
z, _ = librosa.load("tr.mp3", sr=16000)
print("transkript:", asr(z.copy())["text"])
print("tarjima   :", asr(z.copy(), generate_kwargs={"task": "translate"})["text"])
```

```
transkript: Merhaba, ben bir ses mühendisiyim ve verebilimi öğreniyorum.
                                                 ^^^^^^^^^^ 💥
tarjima   : Hello, I am a voice teacher and I am learning to give information.
                       ^^^^^^^^^^^^^ 💥        ^^^^^^^^^^^^^^^^^^^^^^^ 💥
```

**Xato zanjirlanadi**: transkripsiya xatosi → tarjima xatosi → butunlay boshqa ma'no.
</details>

---

## 🟡 5-mashq. 💥 Til almashinuvi

Gap o'rtasida tilni almashtiring.

<details><summary>Yechim</summary>

```python
M = "The meeting is at nine. La reunión es a las nueve. Thank you."
gTTS(text=M, lang="en").save("mix.mp3")
z, _ = librosa.load("mix.mp3", sr=16000)
print(asr(z)["text"])
```

```
The meeting is at 9. La reunion is a last-new eve. Thank you.
                     ^^^^^^^^^^^^^^^^^^^^^^^^^^ 💥 bema'nilik
```

Whisper **butun fayl uchun bitta til** tanlaydi.
</details>

---

## 🟡 6-mashq. Aksentlar

`gTTS` ning `tld` parametri bilan turli ovozlarni sinang.

<details><summary>Yechim</summary>

```python
M = "The quick brown fox jumps over the lazy dog near the river bank."
for tld, nom in [("com","AQSh"), ("co.uk","Britaniya"), ("com.au","Avstraliya"),
                 ("co.in","Hindiston"), ("ie","Irlandiya"), ("co.za","J.Afrika")]:
    gTTS(text=M, lang="en", tld=tld).save(f"a_{nom}.mp3")
    z, _ = librosa.load(f"a_{nom}.mp3", sr=16000)
    print(f"{nom:12s} WER {wer(n(M), n(asr(z)['text'])):.4f}")
```

```
AQSh         WER 0.1538    (river bank -> riverbank)
Avstraliya   WER 0.0000
Hindiston    WER 0.1538    (river bank -> riverbank)
```

⚠️ **Bu sinov zaif** — `gTTS` aksentlari sun'iy. Haqiqiy sinov uchun `Common Voice`.
</details>

---

## 🟡 7-mashq. 💥 Jargon va brend nomlari

Zamonaviy AI atamalarini sinang.

<details><summary>Yechim</summary>

```python
for nom, m in [("2024 jargon", "The agent used retrieval augmented generation."),
               ("brendlar", "I use Hugging Face, PyTorch, LangChain and Chroma daily."),
               ("qisqartma", "The GPU has sixteen gigabytes of VRAM and uses CUDA cores.")]:
    gTTS(text=m, lang="en").save("j.mp3")
    z, _ = librosa.load("j.mp3", sr=16000)
    t = asr(z)["text"].strip()
    print(f"{nom:12s} WER {wer(n(m), n(t)):.4f}\n  {t}")
```

```
2024 jargon  WER 0.0000
  The agent used retrieval augmented generation.
brendlar     WER 0.4444
  I use hugging face, pie torch, lang chain and chroma daily.      💥
qisqartma    WER 0.2727
  The GPU has 16GB of RAM and uses CUDA cores.                     💥 VRAM->RAM
```
</details>

---

## 🟡 8-mashq. Mahalliy vs bulut

Kechikish va yuborilgan baytlarni solishtiring.

<details><summary>Yechim</summary>

```python
import speech_recognition as sr, soundfile as sf, time

t0 = time.perf_counter(); asr(y.copy()); t_loc = time.perf_counter() - t0

sf.write("e.wav", y, 16000, subtype="PCM_16")
rec = sr.Recognizer()
with sr.AudioFile("e.wav") as s:
    a = rec.record(s)
t0 = time.perf_counter(); rec.recognize_google(a); t_cloud = time.perf_counter() - t0

print(f"mahalliy: {t_loc:.2f} s · 0 bayt")
print(f"bulut   : {t_cloud:.2f} s · {len(a.get_wav_data())/1024/1024:.2f} MB")
```

```
mahalliy: 2.89 s · 0 bayt
bulut   : 6.24 s · 0.72 MB        💥 2.16× sekin
```
</details>

---

## 🔴 9-mashq. 💥💥 Gallyutsinatsiyani ko'ring

Shovqinni −5 dB gacha oshiring.

<details><summary>Yechim</summary>

```python
import collections
rng = np.random.default_rng(95)
p = float(np.mean(y ** 2))
z = (y + rng.standard_normal(len(y)).astype(np.float32) * np.sqrt(p / 10**-0.5))
t = asr(z.astype(np.float32))["text"].strip()

w = [x.lower().strip(".,!?") for x in t.split()]
print(f"so'zlar {len(w)}  noyob {len(set(w))} ({len(set(w))/len(w)*100:.1f}%)")
print("eng ko'p:", collections.Counter(w).most_common(3))
```

```
so'zlar 338  noyob 24 (7.1%)
eng ko'p: [('a', 105), ('sound', 104), ('engineer', 103)]
```
</details>

---

## 🔴 10-mashq. ⭐ Uch qatlamli detektor

Gallyutsinatsiyani **ikki tomondan** aniqlaydigan funksiya yozing.

<details><summary>Yechim</summary>

```python
def ishonchli_mi(matn, davomiylik_s):
    w = [x.lower().strip(".,!?;:") for x in matn.split()]
    if not w:
        return False, "bo'sh"
    if len(set(w)) / len(w) < 0.35:
        return False, "takrorlanish sikli"
    if len(w) / davomiylik_s > 4.0:
        return False, "nutq tezligi imkonsiz"
    if len(w) / davomiylik_s < 0.5:
        return False, "juda kam so'z"
    return True, "ok"
```

⚠️ Bu `"Thank you for watching"` gallyutsinatsiyasini **tutmaydi** — u normal tezlikda.
</details>

---

## 🔴 11-mashq. Whisper qaysi tillarni biladi?

O'zbek tili bormi?

<details><summary>Yechim</summary>

```python
from transformers.models.whisper.tokenization_whisper import LANGUAGES
print(f"jami {len(LANGUAGES)} til")
for k in ["uz", "tr", "kk", "tg", "az"]:
    print(f"  {k}: {LANGUAGES.get(k, '💥 yo`q')}")
```

```
jami 100 til
  uz: uzbek        ✅
  tr: turkish
  kk: kazakh
  tg: tajik
  az: azerbaijani
```

O'zbek tili **bor**, lekin o'quv ma'lumoti kam → sifati past.
</details>

---

## 🔴 12-mashq. Suhbat kechikishini hisoblang

ASR + LLM + TTS zanjirining umumiy kechikishi qancha?

<details><summary>Yechim</summary>

```
ASR  0.8 s
LLM  1.5 s
TTS  1.0 s
─────────
     3.3 s

Odam suhbatida pauza: 0.2 s     💥 16× ko'p
```

Yechim — **oqim** (streaming): bosqichlar bir-birini kutmasdan ishlashi.
</details>

---

## 🔴 13-mashq. Tibbiy diktovka arxitekturasi

Xavfsiz quvurni loyihalashtiring.

<details><summary>Yechim</summary>

```
① ASR → qoralama
② avtomatik tekshiruv (gallyutsinatsiya, raqamlar, ishonch)
③ ODAM TASDIQLAYDI          ← 💥 majburiy
④ yozuv + ASL AUDIO SAQLANADI
```

**④ eng muhim** — faqat matn saqlansa, xato **abadiy** bo'lib qoladi.
</details>

---

## 🔴 14-mashq. ⭐⭐ O'zingizning da'volaringizni tekshiring

Ushbu kursda o'rgangan **bitta** da'voni tanlang va uni **o'lchang**.

<details><summary>Yechim namunasi</summary>

```python
def davo_tekshir(nom, kutilgan, olchov_fn, takror=3):
    """Har qanday da'voni o'lchaydigan universal shablon."""
    natijalar = [olchov_fn() for _ in range(takror)]
    o = float(np.mean(natijalar))
    s = float(np.std(natijalar))
    mos = abs(o - kutilgan) <= max(2 * s, 0.05 * abs(kutilgan))
    print(f"{nom}")
    print(f"  kutilgan  : {kutilgan}")
    print(f"  o'lchangan: {o:.4f} ± {s:.4f}")
    print(f"  {'✅ TASDIQLANDI' if mos else '💥 RAD ETILDI'}")
    return mos
```

## 🏆 **`± std` — eng muhim qism.** ## Usiz farq **shovqin** yoki **haqiqiy** ekanini bilmaysiz (56-modul).
</details>

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
