# 📝 60-modul. Mashqlar

> **20 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Kalit **kerak emas** — Whisper mahalliy ishlaydi.

---

## 🟢 1-mashq. Birinchi transkripsiya

`transformers` orqali Whisper ni ishga tushiring — `ffmpeg` siz.

<details><summary>Yechim</summary>

```python
import librosa
from transformers import pipeline

asr = pipeline("automatic-speech-recognition",
               model="openai/whisper-base", device=-1)
y, _ = librosa.load("speech_01.wav", sr=16000)
print(asr(y)["text"].strip())
```

```
My name is Yvonne and I am excited to have you as part of our learning
community. Before we get started, I'd like to tell you a little bit...
```
</details>

---

## 🟢 2-mashq. Model o'lchamlari

`tiny`, `base`, `small` ni parametrlar soni va vaqt bo'yicha solishtiring.

<details><summary>Yechim</summary>

```python
import time
for m in ["openai/whisper-tiny", "openai/whisper-base", "openai/whisper-small"]:
    a = pipeline("automatic-speech-recognition", model=m, device=-1)
    par = sum(p.numel() for p in a.model.parameters())
    t0 = time.perf_counter(); a(y.copy()); dt = time.perf_counter() - t0
    print(f"{m.split('/')[-1]:8s} {par/1e6:7.1f} M  {dt:5.2f} s")
```

```
tiny        37.8 M   2.21 s
base        72.6 M   2.91 s
small      241.7 M   6.81 s
```
</details>

---

## 🟢 3-mashq. Vaqt belgilari

Segmentlarni vaqt belgilari bilan chiqaring.

<details><summary>Yechim</summary>

```python
r = asr(y, return_timestamps=True)
for c in r["chunks"]:
    a, b = c["timestamp"]
    print(f"[{a:6.2f} - {b:6.2f}]  {c['text'].strip()[:60]}")
```

```
[  0.00 -   6.50]  My name is Yvonne and I am excited to have you as part...
[  6.50 -  10.00]  Before we get started, I'd like to tell you a little...
[ 10.00 -  16.00]  I'm a sound engineer turned data scientist, curious...
[ 16.00 -  23.00]  My professional background is primarily in media...
```
</details>

---

## 🟡 4-mashq. 💥 Model stoxastikmi?

Bir xil faylni 5 marta transkripsiya qiling. Natijalar bir xilmi?

<details><summary>Yechim</summary>

```python
import hashlib
for i in range(5):
    t = asr(y.copy())["text"].strip()
    print(f"{i+1}. hash {hashlib.md5(t.encode()).hexdigest()[:8]}")
```

```
1. hash 43f6f29c
2. hash 43f6f29c
3. hash 43f6f29c
4. hash 43f6f29c
5. hash 43f6f29c
```

## ✅ **5/5 aynan bir xil.** Kursning "stoxastik" da'vosi — bizda **rad etildi**.
</details>

---

## 🟡 5-mashq. ⭐⭐ Tasodifiylikni **majburan** yoqing

`temperature` ni oshiring va natijaga qarang.

<details><summary>Yechim</summary>

```python
for temp in [0.0, 0.2, 0.5, 1.0]:
    hh = set()
    for i in range(3):
        gk = {"temperature": temp, "do_sample": temp > 0}
        t = asr(y.copy(), generate_kwargs=gk)["text"].strip()
        hh.add(hashlib.md5(t.encode()).hexdigest()[:8])
        if i == 0:
            d = "✅" if "data" in t.lower() else "💥"
    print(f"temperature={temp}: {len(hh)}/3 turli  'data' {d}")
```

```
temperature=0.0: 1/3 turli  'data' ✅
temperature=0.2: 2/3 turli  'data' 💥
temperature=0.5: 3/3 turli  'data' 💥
temperature=1.0: 3/3 turli  'data' 💥
```

## 🏆 **Kursning xatosi qayta hosil qilindi.** Sabab — `openai-whisper` ning **temperature fallback** i.
</details>

---

## 🟡 6-mashq. `data` so'zi joyidami?

Kurs `data` yo'qolganini aytadi. Uchta modelda tekshiring.

<details><summary>Yechim</summary>

```python
for m in ["openai/whisper-tiny", "openai/whisper-base", "openai/whisper-small"]:
    a = pipeline("automatic-speech-recognition", model=m, device=-1)
    t = a(y.copy())["text"]
    print(f"{m.split('/')[-1]:8s} 'data' {'✅' if 'data' in t.lower() else '💥'}")
```

Uchtasida ham **✅** — `temperature=0` bo'lgani uchun.
</details>

---

## 🟡 7-mashq. Haqiqiy xatolar

Normallashtirilgandan keyin qaysi so'zlar xato bo'lib qoldi?

<details><summary>Yechim</summary>

```python
from jiwer import process_words

o = process_words(NGT, norm(txt))
for ch in o.alignments[0]:
    if ch.type != "equal":
        print(f"{ch.type}: {o.references[0][ch.ref_start_idx:ch.ref_end_idx]}"
              f" -> {o.hypotheses[0][ch.hyp_start_idx:ch.hyp_end_idx]}")
```

```
substitute: ['ivan'] -> ['yvonne']
```

**Bitta.** Va u — 58-modulda aniqlaganimizdek **havolaning xatosi**.
</details>

---

## 🟡 8-mashq. Google vs Whisper

Ikkala transkriptni WER, CER va tinish belgilari bo'yicha solishtiring.

<details><summary>Yechim</summary>

```python
for nom, t in [("Google", g_txt), ("Whisper", w_txt)]:
    tin = sum(1 for ch in t if ch in ".,!?;:")
    print(f"{nom:8s} WER xom {wer(GT,t):.4f}  toza {wer(NGT,norm(t)):.4f}  "
          f"tinish {tin}")
```

```
Google   WER xom 0.2951  toza 0.0328  tinish 0
Whisper  WER xom 0.1148  toza 0.0164  tinish 9
```
</details>

---

## 🟡 9-mashq. Nega qisqa fayl sekinroq?

`Track5.wav` (3.57 s) va `Track2.wav` (7.50 s) tezligini solishtiring.

<details><summary>Yechim</summary>

```python
for f in ["Track5.wav", "Track2.wav"]:
    z, _ = librosa.load(f"Recordings/{f}", sr=16000)
    t0 = time.perf_counter(); asr(z); dt = time.perf_counter() - t0
    print(f"{f}: {len(z)/16000:.2f} s -> {dt:.2f} s = {len(z)/16000/dt:.2f}×")
```

```
Track5.wav: 3.57 s -> 0.84 s = 4.27×
Track2.wav: 7.50 s -> 1.11 s = 6.78×
```

Whisper kirishi **har doim 30 soniya**. **Encoder narxi doimiy.**
</details>

---

## 🟡 10-mashq. `batch_size`

Ketma-ket va batch rejimlarni solishtiring.

<details><summary>Yechim</summary>

```python
SIG = [librosa.load(p, sr=16000)[0] for p in fayllar]

t0 = time.perf_counter()
for s in SIG: asr(s)
ket = time.perf_counter() - t0

for bs in [2, 4, 8]:
    t0 = time.perf_counter(); asr([s.copy() for s in SIG], batch_size=bs)
    dt = time.perf_counter() - t0
    print(f"batch_size={bs}: {dt:.2f} s ({ket/dt:.2f}×)")
```

```
ketma-ket    : 8.20 s
batch_size=2 : 6.28 s (1.30×)
batch_size=8 : 6.37 s (1.29×)
```

CPU da **1.30× da to'yinadi**.
</details>

---

## 🔴 11-mashq. 💥 CSV kodlash tuzog'i

Kursning `open(f, "w", newline="")` kodini maxsus belgi bilan sinang.

<details><summary>Yechim</summary>

```python
import io, csv
print("standart kodlash:", io.open("x.tmp", "w").encoding)
try:
    with io.open("t.csv", "w", newline="") as f:
        csv.writer(f).writerow(["1", "a.wav", "curious about “AI” — ✅"])
    print("✅")
except UnicodeEncodeError as e:
    print(f"💥 {str(e)[:60]}")
```

```
standart kodlash: cp1251
💥 'charmap' codec can't encode character '✅' in position 34
```

## ⭐ Yechim: `encoding="utf-8-sig"`.
</details>

---

## 🔴 12-mashq. `utf-8` vs `utf-8-sig`

Farqni baytlar darajasida ko'rsating.

<details><summary>Yechim</summary>

```python
for kod in ["utf-8", "utf-8-sig"]:
    with io.open(f"c_{kod}.csv", "w", encoding=kod, newline="") as f:
        csv.writer(f).writerow(["raqam", "fayl"])
    print(f"{kod:12s} {io.open(f'c_{kod}.csv','rb').read()[:6]!r}")
```

```
utf-8        b'raqam,'
utf-8-sig    b'\xef\xbb\xbfraq'      ⭐ BOM — Excel shuni kutadi
```
</details>

---

## 🔴 13-mashq. 💥💥 Gallyutsinatsiya

Shovqinni oshirib boring. Qachon Whisper "buziladi"?

<details><summary>Yechim</summary>

```python
for snr in [10, 5, 0, -5]:
    rng = np.random.default_rng(snr + 100)
    p = float(np.mean(y ** 2))
    n = rng.standard_normal(len(y)).astype(np.float32) * np.sqrt(p / (10**(snr/10)))
    t = asr((y + n).astype(np.float32))["text"].strip()
    print(f"{snr:3d} dB: {len(t.split()):4d} so'z  WER {wer(NGT, norm(t)):.4f}")
```

```
 10 dB:   61 so'z  WER 0.0492
  5 dB:   62 so'z  WER 0.0656
  0 dB:   63 so'z  WER 0.2623
 -5 dB:  338 so'z  WER 5.3279      💥 GALLYUTSINATSIYA
```
</details>

---

## 🔴 14-mashq. Gallyutsinatsiya matnini tahlil qiling

−5 dB natijasida nima bor?

<details><summary>Yechim</summary>

```python
import collections
w = [x.lower().strip(".,!?") for x in t.split()]
print(f"so'zlar {len(w)}  noyob {len(set(w))} = {len(set(w))/len(w)*100:.1f}%")
print("eng ko'p:", collections.Counter(w).most_common(4))
```

```
so'zlar 338  noyob 24 = 7.1%
eng ko'p: [('a', 105), ('sound', 104), ('engineer', 103), ('i', 2)]
```

`"a sound engineer"` — **103 marta**.
</details>

---

## 🔴 15-mashq. ⭐ Gallyutsinatsiya detektori

Ishonchsiz natijani avtomatik aniqlaydigan funksiya yozing.

<details><summary>Yechim</summary>

```python
def bahola(matn, davomiylik_s):
    w = [x.lower().strip(".,!?;:") for x in matn.split()]
    if not w:
        return "💥 bo'sh"
    noyob = len(set(w)) / len(w)
    tezlik = len(w) / davomiylik_s
    if noyob < 0.35 or tezlik > 4.0:
        return "💥 GALLYUTSINATSIYA"
    if tezlik < 0.5:
        return "💥 MODEL TAQ QOLDI"
    return "✅ normal"
```

⚠️ **Ikki tomondan chegara kerak** — juda **kam** so'z ham xato belgisi (−10 dB da **0.04 so'z/s**).
</details>

---

## 🔴 16-mashq. Whisper shovqinda Google'dan yaxshiroqmi?

Ikkalasini bir xil shovqin darajalarida sinang.

<details><summary>Yechim</summary>

```
 SNR   Whisper   Google
30 dB   0.0164   0.0328    ⭐ Whisper
10 dB   0.0492   0.0656    ⭐ Whisper
 0 dB   0.2623   0.0656    💥 GOOGLE yutdi
-5 dB   5.3279   0.4262    💥 GOOGLE yutdi
```

## 🔑 **"Whisper har doim yaxshiroq" — noto'g'ri.**
</details>

---

## 🔴 17-mashq. Papkani transkripsiya qilish

Kursning kodidagi 5 ta muammoni tuzating.

<details><summary>Yechim</summary>

```python
KENGAYTMALAR = {".wav", ".flac", ".mp3", ".ogg", ".m4a"}

fayllar = sorted(f for f in os.listdir(papka)              # ⭐ sorted
                 if os.path.splitext(f)[1].lower() in KENGAYTMALAR)  # ⭐ ko'p format
for f in fayllar:
    try:                                                    # ⭐ try/except
        y, _ = librosa.load(os.path.join(papka, f), sr=16000)
        ...
    except Exception as e:
        print(f"💥 {f}: {type(e).__name__}")                # ⭐ progress
```

To'liq versiya — [3-dars](03-Transcribing-Multiple-Files.md).
</details>

---

## 🔴 18-mashq. 🔁 Aylanma sinov

Matn → nutq → matn. WER qancha chiqadi?

<details><summary>Yechim</summary>

```python
from gtts import gTTS

matn = "Thank you for taking the time to watch our course on speech recognition."
gTTS(text=matn, lang="en").save("t.mp3")
z, _ = librosa.load("t.mp3", sr=16000)
print(f"WER {wer(matn, asr(z)['text'].strip()):.4f}")
```

```
WER 0.0000
```

⚠️ **TTS audiosida modelni sinamang** — u juda oson.
</details>

---

## 🔴 19-mashq. 💥 Raqamlar tuzog'i

`"one two three"` ni TTS qiling va Whisper bilan qaytaring.

<details><summary>Yechim</summary>

```
asl    : ... Testing one two three.
qaytgan: ... testing 1-2-3.
WER toza 0.2308
```

**Xato emas** — Whisper raqamlarni raqam shaklida yozadi. Normallashtirish kerak:

```python
RAQAMLAR = {"one": "1", "two": "2", "three": "3",
            "four": "4", "five": "5"}


def raqam_normallash(s):
    return " ".join(RAQAMLAR.get(w, w) for w in s.split())
```

Keyin **WER 0.0000**.
</details>

---

## 🔴 20-mashq. `uz` tili `gTTS` da bormi?

<details><summary>Yechim</summary>

```python
from gtts.lang import tts_langs
t = tts_langs()
print(f"jami {len(t)} til · uz bormi: {'uz' in t}")
```

```
jami 69 til · uz bormi: False
```

Muqobillar: `edge-tts`, `Coqui TTS`, `espeak-ng`.
</details>

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
