# 📝 58-modul. Mashqlar

> **20 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Har birida **yechim** bor — lekin avval o'zingiz urinib ko'ring.

---

## 🟢 1-mashq. Format pasporti

`speech_01.wav` haqida `soundfile` yordamida chastota, subtype, kanallar sonini va davomiylikni chiqaring.

<details><summary>Yechim</summary>

```python
import soundfile as sf

info = sf.info("speech_01.wav")
print(f"{info.samplerate} Hz · {info.subtype} · {info.channels} kanal · {info.duration:.3f} s")
```

```
44100 Hz · PCM_24 · 1 kanal · 23.512 s
```
</details>

---

## 🟢 2-mashq. Diskda va xotirada

Fayl diskda necha MB, `librosa.load()` dan keyin xotirada necha MB? Nisbatni tushuntiring.

<details><summary>Yechim</summary>

```python
import os, librosa

y, sr_ = librosa.load("speech_01.wav", sr=None)
d = os.path.getsize("speech_01.wav") / 1024 / 1024
x = y.nbytes / 1024 / 1024
print(f"diskda {d:.2f} MB · xotirada {x:.2f} MB · nisbat {x/d:.3f}")
```

```
diskda 2.97 MB · xotirada 3.96 MB · nisbat 1.333
```

`PCM_24` = **3 bayt**/namuna, `float32` = **4 bayt**/namuna → 4/3 = **1.333**.
</details>

---

## 🟢 3-mashq. `sr=None` ni unutsangiz

`sr=None` bilan va usiz yuklang. Namunalar soni qanday farq qiladi?

<details><summary>Yechim</summary>

```python
for s in [None, "standart"]:
    z, ss = librosa.load("speech_01.wav", sr=None) if s else librosa.load("speech_01.wav")
    print(f"{str(s):10s} -> {ss:6d} Hz · {len(z):8d} namuna")
```

```
None       ->  44100 Hz ·  1036871 namuna
standart   ->  22050 Hz ·   518436 namuna
```

**Yarmi yo'qoladi** — Nayquist 22 050 → 11 025 Hz.
</details>

---

## 🟢 4-mashq. Krest omili

Signalning cho'qqi/RMS nisbatini dB da hisoblang. Nutq uchun bu normalmi?

<details><summary>Yechim</summary>

```python
import numpy as np

rms = np.sqrt(np.mean(y ** 2))
cho = np.abs(y).max()
print(f"RMS {20*np.log10(rms):.2f} dBFS · cho'qqi {cho:.4f} · "
      f"krest {20*np.log10(cho/rms):.2f} dB")
```

```
RMS -20.47 dBFS · cho'qqi 0.8556 · krest 19.11 dB
```

Nutq uchun **12–20 dB** normal. 19.11 dB — chegarada, chunki 2–3 s da baland qism bor.
</details>

---

## 🟡 5-mashq. Kursning "±0.75" da'vosini tekshiring

`|y| > 0.75` bo'lgan namunalar nechta? Foizda qancha?

<details><summary>Yechim</summary>

```python
n = (np.abs(y) > 0.75).sum()
print(f"{n} namuna / {len(y)} = {n/len(y)*100:.4f}%")
print(f"99.9-protsentil: {np.percentile(np.abs(y), 99.9):.4f}")
```

```
1 namuna / 1036871 = 0.0001%
99.9-protsentil: 0.4058
```

Kursning da'vosi **noto'g'ri**: grafikda ko'ringan "±0.75" — **bitta cho'qqi**.
</details>

---

## 🟡 6-mashq. `SpeechRecognition` MP3 ni o'qiydimi?

MP3 fayl yarating va `sr.AudioFile` ga bering. Nima bo'ladi?

<details><summary>Yechim</summary>

```python
import soundfile as sf, speech_recognition as sr

sf.write("t.mp3", y[:5*sr_], sr_)
try:
    with sr.AudioFile("t.mp3") as s:
        sr.Recognizer().record(s)
    print("✅ o'qidi")
except Exception as e:
    print(f"💥 {type(e).__name__}: {str(e)[:60]}")
```

```
💥 ValueError: Audio file could not be read as PCM WAV, AIFF/AIFF-C, or Nativ
```

Faqat **WAV, AIFF, FLAC**. MP3 uchun avval `librosa.load()` + `sf.write(".wav")`.
</details>

---

## 🟡 7-mashq. `show_all=True` bilan variantlar

Nechta variant qaytadi? Ular bir-biridan qanday farq qiladi?

<details><summary>Yechim</summary>

```python
rec = sr.Recognizer()
with sr.AudioFile("speech_01.wav") as s:
    a = rec.record(s)
res = rec.recognize_google(a, show_all=True)

print(f"variantlar: {len(res['alternative'])}")
for i, v in enumerate(res["alternative"][:2]):
    print(f"{i+1}. ishonch {v.get('confidence', '—')}  {v['transcript'][-60:]}")
```

```
variantlar: 5
1. ishonch 0.90954059  ... turn data scientist curious about machine ...
2. ishonch 0.90954059  ... turn data scientists curious about machine ...
```

Variantlar **juda o'xshash** — bitta dekodlash yo'lining mayda tarmoqlari.
</details>

---

## 🟡 8-mashq. Uzun fayl kesiladimi?

Faylni 3 marta takrorlang va butun holda yuboring. Nechta so'z qaytadi?

<details><summary>Yechim</summary>

```python
import numpy as np

y16, s16 = librosa.load("speech_01.wav", sr=16000)
sf.write("uzun.wav", np.tile(y16, 3), s16)

with sr.AudioFile("uzun.wav") as s:
    a = rec.record(s)
txt = rec.recognize_google(a)
print(f"70.5 s · kutilgan ~183 so'z · olingan {len(txt.split())} so'z")
```

```
70.5 s · kutilgan ~183 so'z · olingan 62 so'z
```

## 💥 **33.9% — va hech qanday xato yo'q.**
</details>

---

## 🟡 9-mashq. Bo'laklab yuborish

Yuqoridagi faylni 10 soniyalik bo'laklarga bo'lib yuboring. Farqi qancha?

<details><summary>Yechim</summary>

```python
parts = []
with sr.AudioFile("uzun.wav") as source:
    while True:
        audio = rec.record(source, duration=10)
        if len(audio.frame_data) == 0:
            break
        try:
            parts.append(rec.recognize_google(audio))
        except sr.UnknownValueError:
            parts.append("")

print(f"{len(parts)} bo'lak · {sum(len(p.split()) for p in parts)} so'z")
```

```
8 bo'lak · 135 so'z          ⭐ 2.2× ko'p
```
</details>

---

## 🟡 10-mashq. Chastota WER ga ta'sir qiladimi?

8 kHz, 16 kHz, 44.1 kHz da yuboring. WER qanday o'zgaradi?

<details><summary>Yechim</summary>

```python
from jiwer import wer

for t in [8000, 16000, 44100]:
    z = librosa.resample(y, orig_sr=sr_, target_sr=t) if t != sr_ else y
    sf.write("t.wav", z, t)
    with sr.AudioFile("t.wav") as s:
        a = rec.record(s)
    txt = rec.recognize_google(a)
    print(f"{t:6d} Hz  {os.path.getsize('t.wav')/1024:7.1f} KB  WER {wer(GT, txt):.4f}")
```

```
  8000 Hz    367.4 KB  WER 0.3390
 16000 Hz    734.8 KB  WER 0.3390
 44100 Hz   2025.2 KB  WER 0.3390
```

**Nol farq.** Google baribir 16 kHz ga tushiradi → **16 kHz yuboring**.
</details>

---

## 🟡 11-mashq. `\n` tuzog'i

`ground_truth` dagi `\n` larni probelga almashtiring. WER qanday o'zgaradi va nega?

<details><summary>Yechim</summary>

```python
from jiwer import wer, process_words

GT1 = " ".join(GT.split())
print(f"tokenlar: {len(process_words(GT, HYP).references[0])} -> "
      f"{len(process_words(GT1, HYP).references[0])}")
print(f"WER: {wer(GT, HYP):.4f} -> {wer(GT1, HYP):.4f}")

for w in process_words(GT, HYP).references[0]:
    if "\n" in w:
        print("birlashib qolgan:", repr(w))
```

```
tokenlar: 59 -> 61
WER: 0.3390 -> 0.2951
birlashib qolgan: 'scientist,\ncurious'
birlashib qolgan: 'production,\nwith'
```
</details>

---

## 🟡 12-mashq. Normallashtirish zanjiri

Probel → apostrof → kichik harf → tinish belgilari. Har bir qadamda WER ni chiqaring.

<details><summary>Yechim</summary>

```python
import re

def norm(s, ws=0, apos=0, lower=0, punct=0):
    if ws:    s = " ".join(s.split())
    if apos:  s = s.replace("’", "'")
    if lower: s = s.lower()
    if punct: s = " ".join(re.sub(r"[^\w\s']", " ", s).split())
    return s

for name, kw in [("xom", {}), ("+ws", dict(ws=1)), ("+apos", dict(ws=1, apos=1)),
                 ("+lower", dict(ws=1, apos=1, lower=1)),
                 ("+punct", dict(ws=1, apos=1, lower=1, punct=1))]:
    print(f"{name:8s} WER {wer(norm(GT,**kw), norm(HYP,**kw)):.4f}")
```

```
xom      WER 0.3390
+ws      WER 0.2951
+apos    WER 0.2623
+lower   WER 0.1639
+punct   WER 0.0328        🏆 10.3× yaxshi
```
</details>

---

## 🟡 13-mashq. Haqiqiy xatolar ro'yxati

Normallashtirilgandan keyin **qaysi** so'zlar xato bo'lib qoldi?

<details><summary>Yechim</summary>

```python
o = process_words(norm(GT, 1, 1, 1, 1), norm(HYP, 1, 1, 1, 1))
for ch in o.alignments[0]:
    if ch.type != "equal":
        print(f"{ch.type}: {o.references[0][ch.ref_start_idx:ch.ref_end_idx]}"
              f" -> {o.hypotheses[0][ch.hyp_start_idx:ch.hyp_end_idx]}")
```

```
substitute: ['ivan']   -> ['yvonne']
substitute: ['turned'] -> ['turn']
```

**61 ta so'zdan 2 tasi.** Va biri — **havolaning o'zidagi xato**.
</details>

---

## 🔴 14-mashq. `ground_truth.txt` ni to'g'ri o'qing

Faylni `utf-8` da ochib ko'ring. Nima bo'ladi? To'g'ri usulni toping.

<details><summary>Yechim</summary>

```python
raw = open("ground_truth.txt", "rb").read()
try:
    raw.decode("utf-8")
except UnicodeDecodeError as e:
    print("💥", e)

t = raw.decode("cp1252").strip().strip('"')
t = " ".join(t.split())
print(repr(t[:40]))
print("ASCII bo'lmagan:", sorted({hex(ord(c)) for c in t if ord(c) > 127}))
```

```
💥 'utf-8' codec can't decode byte 0x92 in position 109: invalid start byte
'My name is Ivan and I am excited to have'
ASCII bo'lmagan: ['0x2019']
```

Fayl `cp1252` da, `"""` bilan o'ralgan, `\r\n` bilan tugaydi.
</details>

---

## 🔴 15-mashq. WER 1.0 dan katta

WER ni 1.0 dan katta qiladigan misol yozing va nega shundayligini tushuntiring.

<details><summary>Yechim</summary>

```python
print(wer("hello", "hello world how are you doing today"))     # 6.0
print(wer("hi", "hi hi hi hi hi hi hi hi hi hi"))              # 4.5
```

Maxrajda **havola** uzunligi `N` turadi, gipoteza emas. `I` cheksiz o'sishi mumkin.
`MER = (S+I+D)/(S+I+D+H)` — bu muammosi yo'q, har doim `[0,1]`.
</details>

---

## 🔴 16-mashq. WER ma'noni bilmaydi

`tomorrow → yesterday` va `the` ni o'chirish — bir xil WER berishini ko'rsating.

<details><summary>Yechim</summary>

```python
ref = "the meeting is at nine o'clock tomorrow"
for h in ["meeting is at nine o'clock tomorrow",
          "the meeting is at nine o'clock yesterday",
          "the meeting is at five o'clock tomorrow"]:
    print(f"WER {wer(ref,h):.4f}  CER {cer(ref,h):.4f}  {h}")
```

```
WER 0.1429  CER 0.1026  meeting is at nine o'clock tomorrow
WER 0.1429  CER 0.2051  the meeting is at nine o'clock yesterday
WER 0.1429  CER 0.0513  the meeting is at five o'clock tomorrow
```

Uchtasi bir xil WER. Eng xavflisi (`nine→five`) **eng past CER** ga ega.
</details>

---

## 🔴 17-mashq. Kalit so'z metrikasi

Muhim atamalar transkriptga tushdimi? Funksiya yozing.

<details><summary>Yechim</summary>

```python
def kalit_recall(gipoteza, kalitlar):
    g = gipoteza.lower()
    top = [k for k in kalitlar if k.lower() in g]
    return len(top) / len(kalitlar), [k for k in kalitlar if k not in top]

print(kalit_recall(HYP, ["machine learning", "artificial intelligence",
                         "sound engineer", "media production"]))
```

```
(1.0, [])
```

Barcha muhim atamalar to'g'ri tanildi — WER 0.3390 buni **ko'rsatmagan** edi.
</details>

---

## 🔴 18-mashq. API takrorlanuvchanmi?

Bir xil faylni 5 marta yuboring. Matn va ishonch qanday o'zgaradi?

<details><summary>Yechim</summary>

```python
import hashlib

for i in range(5):
    r = rec.recognize_google(a, show_all=True)
    t = r["alternative"][0]
    print(f"{i+1}. {t['confidence']:.6f}  {hashlib.md5(t['transcript'].encode()).hexdigest()[:8]}")
```

```
1. 0.909894  63bb3b05
2. 0.909894  63bb3b05
3. 0.909541  63bb3b05
4. 0.909541  63bb3b05
5. 0.909894  63bb3b05
```

**Matn — barqaror.** **Ishonch — yo'q** (serverda bir nechta nusxa).
</details>

---

## 🔴 19-mashq. Siqish transkripsiyani buzadimi?

WAV, MP3 va OGG dan bir xil audioni API ga yuboring. Natijalarni solishtiring.

<details><summary>Yechim</summary>

```python
y16 = y[:16*sr_]
sf.write("a.wav", y16, sr_); sf.write("a.mp3", y16, sr_); sf.write("a.ogg", y16, sr_)

for f in ["a.wav", "a.mp3", "a.ogg"]:
    z, s2 = sf.read(f, dtype="float32")
    sf.write("api.wav", z, s2)
    with sr.AudioFile("api.wav") as s:
        aa = rec.record(s)
    print(f"{f:7s} WER {wer(GT, rec.recognize_google(aa)):.4f}")
```

```
a.wav   WER 0.4754
a.mp3   WER 0.4754
a.ogg   WER 0.4754
```

**Aynan bir xil** — SNR 279 dB dan 15 dB gacha tushganiga qaramay.
</details>

---

## 🔴 20-mashq. `soundfile` OGG krashi

23 soniyalik faylni OGG ga yozing. Nima bo'ladi? Yechimini toping.

<details><summary>Yechim</summary>

```python
# 💥 BU JARAYONNI O'LDIRADI — try/except YORDAM BERMAYDI
# sf.write("uzun.ogg", y, sr_)        # stack overflow

# ✅ TO'G'RI USUL — bloklab
with sf.SoundFile("uzun.ogg", "w", samplerate=sr_, channels=1, format="OGG") as f:
    for i in range(0, len(y), sr_):
        f.write(y[i:i + sr_])
print(f"✅ {os.path.getsize('uzun.ogg')/1024:.1f} KB")
```

```
✅ 218.4 KB
```

Chegara **~750 000 namuna** (davomiylikka emas, namunalar soniga bog'liq).
</details>

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
