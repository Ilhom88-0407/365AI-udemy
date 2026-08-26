# 🚀 60-modul. Mini-loyihalar

> **Uchta tayyor loyiha.** Har biri **ishga tushirilgan va tekshirilgan**.
> Kalit **kerak emas**, internet **faqat modelni birinchi yuklashda** kerak.

---

## 📦 Umumiy importlar

```python
import os, io, re, csv, json, time, hashlib, functools, collections, datetime
import warnings
warnings.filterwarnings("ignore")
import numpy as np
import librosa
import soundfile as sf
from jiwer import wer, cer, process_words
from transformers import pipeline
```

---

# 🎙️ 1-loyiha. `WhisperStudio` — to'liq transkripsiya studiyasi

**Muammo:** Whisper kuchli, lekin **gallyutsinatsiya qiladi**, uzun fayllarni sekin qayta ishlaydi, va natijaning **ishonchliligini aytmaydi**.

```python
class WhisperStudio:
    """Whisper ustidan ishonchli qatlam.

    · model singleton    -> qayta yuklanmaydi
    · sifat bahosi       -> gallyutsinatsiyani aniqlaydi
    · batch              -> tezroq
    · SRT/VTT eksport    -> subtitrlar
    """

    ODAM_TEZLIGI = (1.2, 4.0)      # so'z/soniya — o'lchov asosida

    def __init__(self, model="openai/whisper-base"):
        self.model_nomi = model

    @functools.cached_property
    def asr(self):
        t0 = time.perf_counter()
        p = pipeline("automatic-speech-recognition",
                     model=self.model_nomi, device=-1)
        self.yuklash_s = round(time.perf_counter() - t0, 2)
        return p

    # ---------- sifat ----------
    def sifat(self, matn, davomiylik_s):
        """Chiqishning ishonchliligini baholaydi."""
        w = [x.lower().strip(".,!?;:\"'()") for x in matn.split()]
        d = {"sozlar": len(w), "noyob": len(set(w))}
        if not w:
            d.update({"noyob_ulush": 0.0, "eng_kop": 0, "tezlik": 0.0,
                      "holat": "💥 bo'sh natija"})
            return d

        d["noyob_ulush"] = round(len(set(w)) / len(w), 3)
        d["eng_kop"] = collections.Counter(w).most_common(1)[0][1]
        d["tezlik"] = round(len(w) / max(davomiylik_s, 1e-9), 2)

        lo, hi = self.ODAM_TEZLIGI
        if d["noyob_ulush"] < 0.35 or d["tezlik"] > hi:
            d["holat"] = "💥 GALLYUTSINATSIYA"
        elif d["tezlik"] < 0.5:
            d["holat"] = "💥 model taq qoldi"
        elif d["noyob_ulush"] < 0.5 or d["eng_kop"] > len(w) * 0.15:
            d["holat"] = "⚠️ shubhali"
        elif d["tezlik"] < lo:
            d["holat"] = "⚠️ juda sekin nutq"
        else:
            d["holat"] = "✅ normal"
        return d

    # ---------- transkripsiya ----------
    def bitta(self, yol, vaqt_belgilari=True, til=None):
        y, _ = librosa.load(yol, sr=16000, mono=True)
        dur = len(y) / 16000

        kw = {"return_timestamps": vaqt_belgilari}
        if til:
            kw["generate_kwargs"] = {"language": til, "task": "transcribe"}

        t0 = time.perf_counter()
        r = self.asr(y, **kw)
        dt = time.perf_counter() - t0

        matn = r["text"].strip()
        d = {"fayl": os.path.basename(yol), "soniya": round(dur, 2),
             "vaqt_s": round(dt, 2), "tezlik_x": round(dur / max(dt, 1e-9), 2),
             "model": self.model_nomi.split("/")[-1], "matn": matn}
        d.update(self.sifat(matn, dur))
        if vaqt_belgilari and r.get("chunks"):
            d["segmentlar"] = [
                {"boshi": c["timestamp"][0], "oxiri": c["timestamp"][1],
                 "matn": c["text"].strip()} for c in r["chunks"]]
        return d

    def papka(self, papka, batch=4, progress=True):
        KEN = {".wav", ".flac", ".mp3", ".ogg", ".m4a", ".aiff", ".aif"}
        fayllar = sorted(f for f in os.listdir(papka)
                         if os.path.splitext(f)[1].lower() in KEN)
        natija = []
        for i, f in enumerate(fayllar, 1):
            try:
                d = self.bitta(os.path.join(papka, f), vaqt_belgilari=False)
            except Exception as e:                        # ⭐ bitta fayl ishni to'xtatmasin
                d = {"fayl": f, "matn": "", "soniya": 0.0,
                     "holat": f"💥 {type(e).__name__}"}
            natija.append(d)
            if progress:
                print(f"  [{i:>3}/{len(fayllar)}] {f:14s} {d.get('sozlar',0):3d} so'z "
                      f"{d.get('tezlik_x',0):5.2f}×  {d['holat']}")
        return natija

    # ---------- eksport ----------
    @staticmethod
    def _vaqt(sek, vergul=True):
        sek = max(float(sek or 0), 0.0)
        s, ms = int(sek), int(round((sek - int(sek)) * 1000))
        return (f"{s//3600:02d}:{s//60%60:02d}:{s%60:02d}"
                f"{',' if vergul else '.'}{ms:03d}")

    def srt(self, d, yol=None):
        """SubRip subtitr fayli."""
        yol = yol or os.path.splitext(d["fayl"])[0] + ".srt"
        with io.open(yol, "w", encoding="utf-8") as f:
            for i, s in enumerate(d.get("segmentlar", []), 1):
                oxiri = s["oxiri"] if s["oxiri"] is not None else d["soniya"]
                f.write(f"{i}\n{self._vaqt(s['boshi'])} --> "
                        f"{self._vaqt(oxiri)}\n{s['matn']}\n\n")
        return yol

    def vtt(self, d, yol=None):
        """WebVTT subtitr fayli."""
        yol = yol or os.path.splitext(d["fayl"])[0] + ".vtt"
        with io.open(yol, "w", encoding="utf-8") as f:
            f.write("WEBVTT\n\n")
            for s in d.get("segmentlar", []):
                oxiri = s["oxiri"] if s["oxiri"] is not None else d["soniya"]
                f.write(f"{self._vaqt(s['boshi'], False)} --> "
                        f"{self._vaqt(oxiri, False)}\n{s['matn']}\n\n")
        return yol

    def hisobot(self, d):
        print(f"\n{'='*66}")
        print(f"  🎙️  {d['fayl']}   {d['soniya']} s   [{d['model']}]")
        print(f"{'='*66}")
        print(f"  vaqt     : {d['vaqt_s']} s  ({d['tezlik_x']}× real vaqt)")
        print(f"  so'zlar  : {d['sozlar']}  (noyob {d['noyob']} = "
              f"{d['noyob_ulush']*100:.1f}%)")
        print(f"  tezlik   : {d['tezlik']} so'z/s   eng ko'p takror {d['eng_kop']}")
        print(f"  holat    : {d['holat']}")
        if "segmentlar" in d:
            print(f"\n  {len(d['segmentlar'])} segment:")
            for s in d["segmentlar"]:
                o = s["oxiri"] if s["oxiri"] is not None else d["soniya"]
                print(f"    [{s['boshi']:6.2f} - {o:6.2f}]  {s['matn'][:52]}")
        return d
```

### 🔬 Ishga tushiramiz

```python
st = WhisperStudio()
d = st.hisobot(st.bitta("speech_01.wav"))
print("\n  📄", st.srt(d), "·", st.vtt(d))
print(io.open(os.path.splitext(d["fayl"])[0] + ".srt", encoding="utf-8").read()[:180])
```

### ✅ Haqiqiy natija

```
==================================================================
  🎙️  speech_01.wav   23.51 s   [whisper-base]
==================================================================
  vaqt     : 6.79 s  (3.46× real vaqt)
  so'zlar  : 61  (noyob 51 = 83.6%)
  tezlik   : 2.59 so'z/s   eng ko'p takror 3
  holat    : ✅ normal

  4 segment:
    [  0.00 -   6.50]  My name is Yvonne and I am excited to have you as par
    [  6.50 -  10.00]  Before we get started, I'd like to tell you a little
    [ 10.00 -  16.00]  I'm a sound engineer turned data scientist, curious a
    [ 16.00 -  23.00]  My professional background is primarily in media prod

  📄 speech_01.srt · speech_01.vtt
1
00:00:00,000 --> 00:00:06,500
My name is Yvonne and I am excited to have you as part of our learning community.

2
00:00:06,500 --> 00:00:10,000
```

> ## 🏆 **BEPUL SUBTITRLAR** — YouTube, Vimeo va har qanday pleyer o'qiydi.

### 🔬 Endi — gallyutsinatsiyani tutamiz

```python
y, _ = librosa.load("speech_01.wav", sr=16000)
rng = np.random.default_rng(95)
p = float(np.mean(y ** 2))
n = rng.standard_normal(len(y)).astype(np.float32) * np.sqrt(p / 10**(-0.5))
sf.write("shovqinli.wav", (y + n).astype(np.float32), 16000)

st.hisobot(st.bitta("shovqinli.wav", vaqt_belgilari=False))
```

```
==================================================================
  🎙️  shovqinli.wav   23.51 s   [whisper-base]
==================================================================
  vaqt     : 18.03 s  (1.3× real vaqt)
  so'zlar  : 338  (noyob 24 = 7.1%)
  tezlik   : 14.38 so'z/s   eng ko'p takror 105
  holat    : 💥 GALLYUTSINATSIYA
```

> ## 🏆🏆 **SINF O'ZI TUTDI.**
>
> ## ⭐ **VA E'TIBOR BERING — VAQT HAM SIGNAL:** ## 6.79 s → **18.03 s** (2.7× sekin). ## Decoder 338 ta token generatsiya qildi. ## ## 💡 **Gallyutsinatsiya — sekin ham.**

---

# 📊 2-loyiha. `ModelJangi` — modellarni halol taqqoslash

**Muammo:** *"Qaysi modelni tanlashim kerak?"* — javob **sizning ma'lumotingizga** bog'liq, blogdagi jadvalga emas.

```python
class ModelJangi:
    """Bir nechta ASR modelini bir xil ma'lumotda taqqoslaydi."""

    def __init__(self, modellar=None):
        self.modellar = modellar or ["openai/whisper-tiny",
                                     "openai/whisper-base",
                                     "openai/whisper-small"]

    @staticmethod
    def norm(s):
        s = " ".join(s.split()).replace("’", "'").replace("‘", "'").lower()
        return " ".join(re.sub(r"[^\w\s']", " ", s).split())

    def jang(self, juftliklar, shovqin_snr=None):
        """juftliklar: [(audio_yoli, havola_matni), ...]"""
        jadval = {}
        for m in self.modellar:
            t0 = time.perf_counter()
            asr = pipeline("automatic-speech-recognition", model=m, device=-1)
            yuk = time.perf_counter() - t0
            par = sum(p.numel() for p in asr.model.parameters())

            wers, cers, vaqt, jami_dur = [], [], 0.0, 0.0
            for yol, havola in juftliklar:
                y, _ = librosa.load(yol, sr=16000, mono=True)
                if shovqin_snr is not None:
                    rng = np.random.default_rng(shovqin_snr)
                    ps = float(np.mean(y ** 2))
                    y = (y + rng.standard_normal(len(y)).astype(np.float32) *
                         np.sqrt(ps / 10 ** (shovqin_snr / 10))).astype(np.float32)
                t0 = time.perf_counter()
                t = asr(y)["text"].strip()
                vaqt += time.perf_counter() - t0
                jami_dur += len(y) / 16000
                wers.append(wer(self.norm(havola), self.norm(t)) if t else 1.0)
                cers.append(cer(self.norm(havola), self.norm(t)) if t else 1.0)

            jadval[m] = {
                "par_M": round(par / 1e6, 1), "yuklash_s": round(yuk, 2),
                "vaqt_s": round(vaqt, 2),
                "tezlik_x": round(jami_dur / max(vaqt, 1e-9), 2),
                "WER": round(float(np.mean(wers)), 4),
                "WER_std": round(float(np.std(wers)), 4),
                "CER": round(float(np.mean(cers)), 4),
            }
            del asr
        return self.hisobot(jadval)

    def hisobot(self, jadval):
        print(f"\n  {'model':16s} {'par(M)':>8} {'vaqt':>7} {'tezlik':>8} "
              f"{'WER':>8} {'±std':>8} {'CER':>8}")
        print("  " + "-" * 68)
        eng_w = min(v["WER"] for v in jadval.values())
        eng_t = max(v["tezlik_x"] for v in jadval.values())
        for m, v in jadval.items():
            b = ("🏆" if v["WER"] == eng_w else "  ") + \
                ("⚡" if v["tezlik_x"] == eng_t else "  ")
            print(f"  {m.split('/')[-1]:16s} {v['par_M']:>8} {v['vaqt_s']:>7} "
                  f"{v['tezlik_x']:>7}× {v['WER']:>8.4f} {v['WER_std']:>8.4f} "
                  f"{v['CER']:>8.4f} {b}")

        # ⭐ eng KICHIK model, eng yaxshi WER bilan
        eng = [m for m, v in jadval.items() if v["WER"] == eng_w]
        tavsiya = min(eng, key=lambda m: jadval[m]["par_M"])
        print(f"\n  🏆 TAVSIYA: {tavsiya.split('/')[-1]}  "
              f"({jadval[tavsiya]['par_M']} M · WER {eng_w:.4f})")
        katta = [m for m in jadval if jadval[m]["par_M"] > jadval[tavsiya]["par_M"]]
        if katta:
            print(f"     Kattaroq modellar WER ni yaxshilamadi — "
                  f"{jadval[tavsiya]['par_M']} M yetarli.")
        return jadval
```

### 🔬 Ishga tushiramiz

```python
GT = ("My name is Ivan and I am excited to have you as part of our learning "
      "community! Before we get started, I’d like to tell you a little bit "
      "about myself. I’m a sound engineer turned data scientist, curious about "
      "machine learning and Artificial Intelligence. My professional background "
      "is primarily in media production, with a focus on audio, IT, and communications")

mj = ModelJangi()
print("\n### TOZA AUDIO ###")
mj.jang([("speech_01.wav", GT)])
```

### ✅ Haqiqiy natija

```
### TOZA AUDIO ###

  model              par(M)    vaqt   tezlik      WER     ±std      CER
  --------------------------------------------------------------------
  whisper-tiny         37.8    1.78   13.17×   0.0164   0.0000   0.0113 🏆⚡
  whisper-base         72.6    2.57    9.14×   0.0164   0.0000   0.0113 🏆
  whisper-small       241.7    5.88     4.0×   0.0164   0.0000   0.0113 🏆

  🏆 TAVSIYA: whisper-tiny  (37.8 M · WER 0.0164)
     Kattaroq modellar WER ni yaxshilamadi — 37.8 M yetarli.
```

> ## 🏆 **SINF TO'G'RI XULOSAGA KELDI:** ## `small` `tiny` dan **6.4× katta**, **3.3× sekin** — ## va **hech narsa yaxshilamaydi**.
>
> ## ⚠️ **LEKIN "TAVSIYA: tiny" NI KO'R-KO'RONA QABUL QILMANG.** ## Bu — **bitta fayl**, va u **toza**. ## ➕ `tiny` **sozlamaga sezgir**: `return_timestamps=True` bilan ## u qo'shimcha xato qiladi *(1-dars, 5.5-bo'lim)*. ## ## 🔑 **Ishlab chiqarish uchun `base` — xavfsizroq tanlov.**

> ## ⚠️ **`WER_std = 0.0000` — CHUNKI BITTA FAYL.** ## Haqiqiy taqqoslash uchun **kamida 20–30 ta** fayl kerak. ## ## 💡 56-modulda ko'rgan edik: ## **std siz farq ma'nosiz**.

---

# 🔁 3-loyiha. `AylanmaSinov` — quvurni tekshiruvchi

**Muammo:** transkripsiya quvuringiz ishlayaptimi? Buni **modelsiz** tekshirib bo'lmaydi — ma'lumot kerak. Ma'lumotni esa **o'zimiz yaratamiz**.

```python
class AylanmaSinov:
    """matn -> TTS -> ASR -> matn. Quvurni tekshirish uchun.

    ⚠️ Bu — MODEL sifatini emas, QUVUR to'g'riligini tekshiradi.
    """

    RAQAMLAR = {"zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
                "five": "5", "six": "6", "seven": "7", "eight": "8",
                "nine": "9", "ten": "10", "eleven": "11", "twelve": "12"}

    SINOVLAR = [
        ("oddiy jumla", "The quick brown fox jumps over the lazy dog."),
        ("raqamlar", "Testing one two three four five."),
        ("tinish belgilari", "Wait! Is this correct? Yes, absolutely."),
        ("uzun jumla",
         "Machine learning and artificial intelligence are transforming the way "
         "we process audio data in modern speech recognition systems today."),
        ("qisqa", "Hello."),
    ]

    def __init__(self, studio=None, til="en"):
        self.st = studio or WhisperStudio()
        self.til = til

    def norm(self, s, raqam=False):
        s = " ".join(s.split()).replace("’", "'").lower()
        s = " ".join(re.sub(r"[^\w\s']", " ", s).split())
        if raqam:
            s = " ".join(self.RAQAMLAR.get(w, w) for w in s.split())
        return s

    def bitta(self, matn):
        from gtts import gTTS
        h = hashlib.md5(f"{matn}|{self.til}".encode()).hexdigest()[:10]
        mp3 = f"rt_{h}.mp3"
        if not os.path.exists(mp3):                     # ⭐ kesh
            gTTS(text=matn, lang=self.til).save(mp3)
        y, _ = librosa.load(mp3, sr=16000)
        qayta = self.st.asr(y)["text"].strip()

        w_xom = wer(self.norm(matn), self.norm(qayta))
        w_raq = wer(self.norm(matn, True), self.norm(qayta, True))
        return {"asl": matn, "qaytgan": qayta,
                "soniya": round(len(y) / 16000, 2),
                "WER": round(w_xom, 4), "WER_raqamsiz": round(w_raq, 4),
                "holat": "✅" if w_raq < 0.05 else
                         ("⚠️" if w_raq < 0.2 else "💥")}

    def hammasi(self):
        print(f"\n  {'sinov':18s} {'s':>5} {'WER':>8} {'raqamsiz':>9}  natija")
        print("  " + "-" * 66)
        r = []
        for nom, matn in self.SINOVLAR:
            d = self.bitta(matn)
            d["nom"] = nom
            r.append(d)
            print(f"  {nom:18s} {d['soniya']:>5} {d['WER']:>8.4f} "
                  f"{d['WER_raqamsiz']:>9.4f}  {d['holat']} {d['qaytgan'][:30]}")
        ok = sum(1 for x in r if x["holat"] == "✅")
        print(f"\n  📊 {ok}/{len(r)} sinov o'tdi")
        print(f"  {'🏆 QUVUR ISHLAYAPTI' if ok == len(r) else '⚠️ TEKSHIRING'}")
        return r
```

### 🔬 Ishga tushiramiz

```python
AylanmaSinov().hammasi()
```

### ✅ Haqiqiy natija

```
  sinov                  s      WER  raqamsiz  natija
  ------------------------------------------------------------------
  oddiy jumla         3.53   0.0000    0.0000  ✅ The quick brown fox jumps over
  raqamlar            2.83   0.8333    0.0000  ✅ Testing 1, 2, 3, 4, 5.
  tinish belgilari    4.37   0.0000    0.0000  ✅ Wait. Is this correct? Yes. Ab
  uzun jumla          9.89   0.0000    0.0000  ✅ Machine learning and artificia
  qisqa               0.89   0.0000    0.0000  ✅ Hello!

  📊 5/5 sinov o'tdi
  🏆 QUVUR ISHLAYAPTI
```

> ## 💥💥 **"raqamlar" SINOVIGA E'TIBOR BERING:** ## xom WER **0.8333**, raqam normallashtirilgandan keyin — **0.0000**.
>
> ## ## 🔑 **MODEL HECH QANDAY XATO QILMAGAN.** ## U `"one two three four five"` ni **`"1, 2, 3, 4, 5"`** deb yozdi — ## bu **to'g'ri**, faqat **boshqa yozuvda**.
>
> ## ⭐ **VA MANA NEGA `WER_raqamsiz` USTUNI KERAK.** ## Bitta raqam bilan **butun sinov "yiqilgan"** bo'lib ko'rinardi.

> ## ⚠️ **VA YANA ESLATMA:** ## bu sinov **quvurni** tekshiradi, **modelni** emas. ## TTS audiosi juda toza — ## 5/5 o'tishi **kutilgan natija**. ## ## 💥 O'tmasa — **kodingizda xato bor**.

---

## 🎯 Loyihalarni kengaytirish

| Fikr | Qanday |
|---|---|
| Ko'p tilli sinov | `AylanmaSinov(til="fr")` — model tilni **aniqlaydimi**? |
| `medium`/`large` | `ModelJangi(["openai/whisper-medium"])` — ⚠️ 3–6 GB |
| Shovqin ostida jang | `mj.jang(juftliklar, shovqin_snr=5)` |
| GPU | `pipeline(..., device=0)` — 5–10× tez |
| Diarizatsiya *(kim gapiryapti)* | `pyannote.audio` |
| Real vaqt | `sounddevice` + 5 s bo'laklar |
| Aniq vaqt belgilari | `whisperX` yoki `whisper-timestamped` |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md)
