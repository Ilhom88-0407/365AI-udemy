# 🚀 52-modul mini-loyihalari

> **3 ta tayyor loyiha.** ## ⭐⭐ **Hammasi mahalliy** — internet ham, API kaliti ham **kerak emas**.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install numpy scipy matplotlib soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, json, wave, time
from pathlib import Path
import numpy as np, scipy.signal as sig
import librosa, soundfile as sf

C = 343.0                    # tovush tezligi, m/s
```

---

# 🎤 1-loyiha. Ovoz pasporti generatori

> **Maqsad:** istalgan audio fayl uchun **to'liq akustik hisobot** — ## va u **muammolarni o'zi topsin**.

```python
class OvozPasporti:
    """🏆 Audio faylning to'liq akustik tahlili + muammo tashxisi."""

    # ⚠️ chegaralar — amaliyotdan olingan
    MIN_RMS_DBFS = -35.0        # bundan past — juda jim
    MAKS_RMS_DBFS = -6.0        # bundan baland — clipping xavfi
    MIN_KREST = 6.0             # bundan past — siqilgan/buzilgan
    MIN_OVOZLI = 0.25           # bundan past — nutq kam

    def __init__(self, yol, sr=16000):
        self.yol = yol
        self.sr = sr
        self.y, _ = librosa.load(yol, sr=sr)
        self.xom_info = self._xom_info()
        self.muammolar = []
        self.ogohlar = []

    # ───────────────────────── xom fayl
    def _xom_info(self):
        try:
            with wave.open(self.yol) as w:
                ch, bw, sr, n = (w.getnchannels(), w.getsampwidth(),
                                 w.getframerate(), w.getnframes())
            return {"kanal": ch, "bit": bw * 8, "sr": sr,
                    "davomiylik": n / sr, "bitrate": sr * bw * 8 * ch,
                    "hajm": os.path.getsize(self.yol)}
        except Exception:
            # ⚠️ mp3/flac uchun wave ishlamaydi
            info = sf.info(self.yol)
            return {"kanal": info.channels, "bit": "?",
                    "sr": info.samplerate, "davomiylik": info.duration,
                    "bitrate": None, "hajm": os.path.getsize(self.yol)}

    # ───────────────────────── daraja
    def daraja(self):
        rms = float(np.sqrt((self.y ** 2).mean()))
        cho = float(np.abs(self.y).max())
        rms_db = 20 * np.log10(max(rms, 1e-12))
        cho_db = 20 * np.log10(max(cho, 1e-12))
        krest = cho_db - rms_db
        kesilgan = int((np.abs(self.y) > 0.99).sum())

        if rms_db < self.MIN_RMS_DBFS:
            self.muammolar.append(
                f"JUDA JIM ({rms_db:.1f} dBFS) — ASR aniqligi tushadi")
        elif rms_db > self.MAKS_RMS_DBFS:
            self.ogohlar.append(f"juda baland ({rms_db:.1f} dBFS)")
        if kesilgan > len(self.y) * 0.001:
            self.muammolar.append(
                f"CLIPPING — {kesilgan} namuna ({kesilgan/len(self.y):.2%})")
        if krest < self.MIN_KREST:
            self.ogohlar.append(
                f"krest-faktor past ({krest:.1f} dB) — siqilgan?")

        return {"rms_dbfs": round(rms_db, 2), "cho_dbfs": round(cho_db, 2),
                "krest_db": round(krest, 2), "clipping": kesilgan}

    # ───────────────────────── ovoz
    def ovoz(self, fmin=60, fmax=400):
        f0, v, _ = librosa.pyin(self.y, fmin=fmin, fmax=fmax, sr=self.sr)
        ok = f0[~np.isnan(f0)]
        if len(ok) < 5:
            self.muammolar.append("OVOZLI FREYM DEYARLI YO'Q — nutq bormi?")
            return {}
        if v.mean() < self.MIN_OVOZLI:
            self.ogohlar.append(
                f"ovozli freym kam ({v.mean():.0%}) — jimlik yoki shovqin?")

        med, ort = float(np.median(ok)), float(ok.mean())
        if abs(ort - med) > 15:
            self.ogohlar.append(
                f"f0 median {med:.0f} vs o'rtacha {ort:.0f} — oktava xatolari")

        return {"ovozli": round(float(v.mean()), 3),
                "f0_median": round(med, 1), "f0_ort": round(ort, 1),
                "f0_p5": round(float(np.percentile(ok, 5)), 1),
                "f0_p95": round(float(np.percentile(ok, 95)), 1),
                "garmonikalar": [round(med * k) for k in range(1, 6)]}

    # ───────────────────────── spektr
    def spektr(self):
        Y = np.abs(np.fft.rfft(self.y))
        fr = np.fft.rfftfreq(len(self.y), 1 / self.sr)
        jami = float((Y ** 2).sum())
        zonalar = {}
        for lo, hi in [(0, 300), (300, 1000), (1000, 3400), (3400, 8000)]:
            m = (fr >= lo) & (fr < hi)
            zonalar[f"{lo}-{hi}"] = round(float((Y[m] ** 2).sum()) / jami, 4)

        # ⚠️ 4 kHz dan yuqorida energiya YO'Q  →  fayl qayta namunalangan
        if zonalar["3400-8000"] < 0.005:
            self.ogohlar.append(
                "4 kHz dan yuqorida energiya yo'q — "
                "fayl 8 kHz dan ko'tarilganmi?")
        return zonalar

    # ───────────────────────── formantlar
    @staticmethod
    def _formantlar(x, sr, n_form=3):
        x = x * np.hamming(len(x))
        x = sig.lfilter([1, -0.67], 1, x)
        a = librosa.lpc(x.astype(np.float64), order=int(2 + sr / 1000))
        r = np.roots(a)
        r = r[np.imag(r) > 0]
        f = np.sort(np.arctan2(np.imag(r), np.real(r)) * sr / (2 * np.pi))
        return f[(f > 90) & (f < sr / 2 - 200)][:n_form]

    def formantlar(self, n=3):
        y8 = librosa.resample(self.y, orig_sr=self.sr, target_sr=8000)
        rms = librosa.feature.rms(y=y8, frame_length=512, hop_length=256)[0]
        q = []
        for i in np.argsort(-rms)[:n * 3]:
            seg = y8[int(i) * 256: int(i) * 256 + 512]
            if len(seg) < 512:
                continue
            f = self._formantlar(seg, 8000)
            if len(f) >= 2:
                q.append({"t": round(int(i) * 256 / 8000, 2),
                          "F": [round(float(x)) for x in f]})
            if len(q) >= n:
                break
        return q

    # ───────────────────────── hisobot
    def hisobot(self, jsonga=None):
        d = {"fayl": os.path.basename(self.yol), **self.xom_info,
             "daraja": self.daraja(), "ovoz": self.ovoz(),
             "spektr": self.spektr(), "formantlar": self.formantlar()}
        d["muammolar"] = self.muammolar
        d["ogohlar"] = self.ogohlar

        print(f"\n{'='*66}\n📄 {d['fayl']}\n{'='*66}")
        print(f"  {d['kanal']} kanal · {d['bit']} bit · {d['sr']:,} Hz · "
              f"{d['davomiylik']:.2f} s · {d['hajm']:,} bayt")
        if d["bitrate"]:
            print(f"  bitrate {d['bitrate']:,} bit/s "
                  f"= {d['bitrate']/1000:.0f} kbps")
        g = d["daraja"]
        print(f"  RMS {g['rms_dbfs']:+.1f} dBFS · cho'qqi "
              f"{g['cho_dbfs']:+.1f} · krest {g['krest_db']:.1f} dB")
        if d["ovoz"]:
            o = d["ovoz"]
            print(f"  ovozli {o['ovozli']:.0%} · f0 median "
                  f"{o['f0_median']} Hz ({o['f0_p5']}–{o['f0_p95']})")
            print(f"  garmonikalar: {o['garmonikalar']} Hz")
        print("  energiya: " + " · ".join(
            f"{k} Hz {v:.1%}" for k, v in d["spektr"].items()))
        for f in d["formantlar"]:
            print(f"    t={f['t']:5.2f}s  F={f['F']}")

        if d["muammolar"]:
            print("\n  💥 MUAMMOLAR:")
            for m in d["muammolar"]:
                print(f"     · {m}")
        if d["ogohlar"]:
            print("\n  ⚠️ OGOHLANTIRISHLAR:")
            for m in d["ogohlar"]:
                print(f"     · {m}")
        if not d["muammolar"] and not d["ogohlar"]:
            print("\n  ✅ MUAMMO TOPILMADI — ASR uchun tayyor")

        if jsonga:
            Path(jsonga).write_text(
                json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"\n  💾 {jsonga}")
        return d
```

### ▶️ Ishga tushirish

```python
OvozPasporti("speech_01.wav").hisobot("pasport.json")
```

```
==================================================================
📄 speech_01.wav
==================================================================
  1 kanal · 24 bit · 44,100 Hz · 23.51 s · 3,111,350 bayt
  bitrate 1,058,400 bit/s = 1058 kbps
  RMS -20.9 dBFS · cho'qqi -4.5 · krest 16.4 dB
  ovozli 65% · f0 median 138.2 Hz (102.1–241.5)
  garmonikalar: [138, 276, 415, 553, 691] Hz
  energiya: 0-300 Hz 59.1% · 300-1000 Hz 22.0% · 1000-3400 Hz 9.1% · 3400-8000 Hz 9.8%
    t= 2.14s  F=[235, 1204, 1683]
    t= 2.69s  F=[192, 1690, 2072]
    t= 7.17s  F=[416, 1804, 2572]

  ✅ MUAMMO TOPILMADI — ASR uchun tayyor

  💾 pasport.json
```

> ## ⚠️ **E'TIBOR BERING — `krest 16.4 dB` VA `cho'qqi -4.5 dBFS`.** ## Xom faylda cho'qqi **0.0 dBFS** edi *(52-modul o'lchovi)*. ## 🔑 Farq — `librosa.load()` **16 kHz ga qayta namunaladi**, ## va bu cho'qqilarni **biroz silliqlaydi**.
>
> ## 🏆 **DARS: QAYSI BOSQICHDA O'LCHAYOTGANINGIZNI BILING.** ## Xom fayl va qayta namunalangan signal — **boshqa raqamlar** beradi.

> ## 🏆 **BU LOYIHANING QIYMATI — `muammolar` VA `ogohlar` RO'YXATIDA.** ## U **avtomatik tashxis** qo'yadi.
>
> ## ⭐ **ENG QIMMATLI TEKSHIRUV — `3400-8000` ZONASI:**
> ```
> Agar u ~0 bo'lsa  →  fayl 8 kHz dan 16 kHz ga KO'TARILGAN
>                   →  💥 yuqori chastotalar QAYTIB KELMAYDI
>                   →  ⭐ Whisper'ga berishdan oldin BILING
> ```
> ## 💡 **BU — TELEFON YOZUVLARIDA JUDA KO'P UCHRAYDI.**

---

# 🔊 2-loyiha. Unli tovush sintezatori *(manba-filtr modeli)*

> **Maqsad:** nazariyani **eshitiladigan** qilish — ## `f0` va formantlarni **alohida** boshqarish.

```python
class UnliSintezator:
    """🏆 MANBA (f0) + FILTR (formantlar) = unli tovush."""

    UNLILAR = {
        "i": (270, 2290, 3010),   "e": (530, 1840, 2480),
        "a": (730, 1090, 2440),   "o": (570,  840, 2410),
        "u": (300,  870, 2240),
    }
    KENGLIK = (80, 90, 120)       # ⭐ formant kengligi (bandwidth)

    def __init__(self, sr=16000):
        self.sr = sr

    # ───────────────────────── manba
    def _manba(self, f0, n, tur="impuls", urug=0):
        if tur == "impuls":                       # ⭐ ovozli nutq
            m = np.zeros(n)
            m[::max(int(self.sr / f0), 1)] = 1.0
            return m
        if tur == "shovqin":                      # ⭐ pichirlash
            return np.random.RandomState(urug).normal(0, 1, n)
        if tur == "vibrato":                      # ⭐ tabiiyroq ovoz
            t = np.arange(n) / self.sr
            fi = f0 * (1 + 0.03 * np.sin(2 * np.pi * 5 * t))
            faza = np.cumsum(2 * np.pi * fi / self.sr)
            m = np.zeros(n)
            m[np.diff(faza // (2 * np.pi), prepend=0) > 0] = 1.0
            return m
        raise ValueError(f"noma'lum manba: {tur}")

    # ───────────────────────── filtr
    def _filtr(self, x, F, B=None):
        B = B or self.KENGLIK
        y = x.copy()
        for fc, bw in zip(F, B):
            r = np.exp(-np.pi * bw / self.sr)
            th = 2 * np.pi * fc / self.sr
            y = sig.lfilter([1 - r], [1, -2 * r * np.cos(th), r ** 2], y)
        return y

    # ───────────────────────── ogib
    @staticmethod
    def _ogib(y, sr, hujum=0.02, tushish=0.05):
        """⭐ Hujum/tushish — 'chert' tovushini yo'q qiladi."""
        n = len(y)
        e = np.ones(n)
        h, t = int(sr * hujum), int(sr * tushish)
        e[:h] = np.linspace(0, 1, h)
        e[-t:] = np.linspace(1, 0, t)
        return y * e

    # ───────────────────────── asosiy
    def unli(self, nom, f0=120, davom=0.5, tur="impuls"):
        F = self.UNLILAR[nom]
        n = int(self.sr * davom)
        y = self._filtr(self._manba(f0, n, tur), F)
        y = self._ogib(y, self.sr)
        return y / max(np.abs(y).max(), 1e-9)

    def soz(self, nomlar, f0=120, har=0.22, oraliq=0.03, tur="impuls"):
        jim = np.zeros(int(self.sr * oraliq))
        q = []
        for n in nomlar:
            q += [self.unli(n, f0, har, tur), jim]
        return np.concatenate(q)

    def ohang(self, nomlar, f0_dan=90, f0_gacha=170, har=0.22):
        """⭐ f0 o'zgaradi — SAVOL ohangi."""
        q, jim = [], np.zeros(int(self.sr * 0.03))
        for i, n in enumerate(nomlar):
            f0 = f0_dan + (f0_gacha - f0_dan) * i / max(len(nomlar) - 1, 1)
            q += [self.unli(n, f0, har), jim]
        return np.concatenate(q)

    def saqla(self, y, yol):
        sf.write(yol, y, self.sr)
        print(f"  💾 {yol}  ({len(y)/self.sr:.2f} s)")
```

### ▶️ Ishga tushirish

```python
s = UnliSintezator()

# ① har unlini alohida
for n in s.UNLILAR:
    s.saqla(s.unli(n, f0=120, davom=0.6), f"unli_{n}.wav")

# ② "so'z"
s.saqla(s.soz(["a", "i", "u"]), "soz_aiu.wav")

# ③ ⭐ f0 o'zgaradi, formantlar YO'Q — ohang farqi
s.saqla(s.soz(["a", "i", "u"], f0=90),  "past_ovoz.wav")
s.saqla(s.soz(["a", "i", "u"], f0=220), "baland_ovoz.wav")

# ④ pichirlash — f0 YO'Q
s.saqla(s.soz(["a", "i", "u"], tur="shovqin"), "pichirlash.wav")

# ⑤ savol ohangi
s.saqla(s.ohang(["a", "i", "u"]), "savol.wav")
```

> ## 🏆 **③ VA ④ NI KETMA-KET TINGLANG — BU MODULNING ASOSIY DARSI:**
> ```
> past_ovoz / baland_ovoz  →  BOSHQA ovoz, LEKIN AYNI unlilar
> pichirlash               →  f0 UMUMAN yo'q, LEKIN unlilar TANIB BO'LADI
> ```
> ## ## **MANBA — KIM GAPIRYAPTI. FILTR — NIMA DEYILYAPTI.**
>
> ## ⭐ **`_ogib()` NIMA UCHUN KERAK?** ## Usiz har unli **"chert"** bilan boshlanadi — ## bu **razryad uzilishi** *(discontinuity)*, ## va u spektrga **keng polosali shovqin** qo'shadi.

---

# 🎛️ 3-loyiha. DTW ovozli buyruq tizimi

> **Maqsad:** neyron tarmoqsiz, o'qitishsiz, internetsiz **ishlaydigan** ovozli buyruq tanish.

```python
class DTWBuyruq:
    """🏆 Kichik lug'atli (< 20 buyruq) ovozli tanish tizimi.

    Har buyruq uchun 1–3 ta yozuv kifoya. O'qitish YO'Q.
    """

    def __init__(self, sr=16000, n_mfcc=13, ishonch=1.25):
        self.sr, self.n_mfcc = sr, n_mfcc
        self.ishonch = ishonch          # ⭐ chegara: 2-o'rin / 1-o'rin
        self.etalonlar = {}             # {buyruq: [xususiyat, ...]}

    # ───────────────────────── xususiyat
    def _xus(self, y):
        y, _ = librosa.effects.trim(y, top_db=25)       # ⭐ jimlikni kes
        if len(y) < self.sr * 0.1:
            raise ValueError("💥 juda qisqa yoki jim")
        M = librosa.feature.mfcc(y=y, sr=self.sr, n_mfcc=self.n_mfcc)
        d = librosa.feature.delta(M)                    # ⭐ o'zgarish tezligi
        X = np.vstack([M, d])
        return (X - X.mean(axis=1, keepdims=True)) / (
            X.std(axis=1, keepdims=True) + 1e-9)

    def qosh(self, buyruq, yol):
        y, _ = librosa.load(yol, sr=self.sr)
        self.etalonlar.setdefault(buyruq, []).append(self._xus(y))
        print(f"  ✅ '{buyruq}' <- {os.path.basename(yol)}")

    # ───────────────────────── DTW
    @staticmethod
    def _dtw(A, B, band=0.25):
        """⭐ Sakoe-Chiba bandli DTW — TEZROQ va ANIQROQ."""
        n, m = A.shape[1], B.shape[1]
        w = max(int(max(n, m) * band), abs(n - m) + 1)
        D = np.full((n + 1, m + 1), np.inf)
        D[0, 0] = 0
        for i in range(1, n + 1):
            j0, j1 = max(1, i - w), min(m, i + w)
            d = np.linalg.norm(A[:, i-1:i] - B[:, j0-1:j1], axis=0)
            for k, j in enumerate(range(j0, j1 + 1)):
                D[i, j] = d[k] + min(D[i-1, j], D[i, j-1], D[i-1, j-1])
        return D[n, m] / (n + m)

    # ───────────────────────── tanish
    def tani(self, yol, chop=True):
        y, _ = librosa.load(yol, sr=self.sr)
        X = self._xus(y)

        ballar = {b: min(self._dtw(X, E) for E in Es)   # ⭐ eng yaxshi etalon
                  for b, Es in self.etalonlar.items()}
        tartib = sorted(ballar.items(), key=lambda x: x[1])

        eng, ball = tartib[0]
        nisbat = (tartib[1][1] / ball) if len(tartib) > 1 else 99.0
        ok = nisbat >= self.ishonch

        if chop:
            for b, v in tartib:
                print(f"    {b:12s} {v:7.4f}")
            print(f"  {'🏆' if ok else '❓'} "
                  f"{eng if ok else 'TUSHUNMADIM'}  "
                  f"(ishonch {nisbat:.2f}×, chegara {self.ishonch})")
        return (eng, round(nisbat, 3)) if ok else (None, round(nisbat, 3))

    # ───────────────────────── baholash
    def bahola(self, sinovlar):
        """⭐ sinovlar = [(fayl, kutilgan_buyruq_yoki_None), ...]"""
        togri = radetildi = xato = 0
        for yol, kutilgan in sinovlar:
            topilgan, nis = self.tani(yol, chop=False)
            if topilgan == kutilgan:
                togri += 1
                belgi = "✅"
            elif topilgan is None:
                radetildi += 1
                belgi = "❓"
            else:
                xato += 1
                belgi = "💥"
            print(f"  {belgi} {os.path.basename(yol):22s} "
                  f"kutilgan {str(kutilgan):10s} -> "
                  f"{str(topilgan):10s} ({nis:.2f}×)")
        n = len(sinovlar)
        print(f"\n  aniqlik {togri}/{n} ({togri/n:.0%}) · "
              f"rad etildi {radetildi} · 💥 XATO {xato}")
        print("  💡 'rad etildi' — YOMON EMAS. 'XATO' — yomon.")
        return togri / n
```

### ▶️ Ishga tushirish

```python
# ① har buyruqni 2 marta yozing: yoq_1.wav, yoq_2.wav, ochir_1.wav ...
BUYRUQLAR = ["yoq", "ochir", "toxta", "davom"]

t = DTWBuyruq()
for b in BUYRUQLAR:
    for i in (1, 2):
        t.qosh(b, f"{b}_{i}.wav")

# ② sinov
t.tani("test.wav")

# ③ to'liq baholash (yangi yozuvlar bilan)
t.bahola([(f"{b}_test.wav", b) for b in BUYRUQLAR]
         + [("begona.wav", None)])          # ⭐ lug'atda YO'Q so'z
```

> ## 🏆 **UCHTA MUHIM DIZAYN QARORI:**
>
> ### ① ⭐ **`ishonch` chegarasi** — *2-o'rin / 1-o'rin*
> ```
> nisbat 1.25 dan past  →  "TUSHUNMADIM"
> ```
> ## 💡 **BU — 51-MODULDAGI CHEGARA G'OYASINING AYNAN O'ZI.** ## Tizim **doim** eng yaqin buyruqni topadi — ## uni **rad etishni** siz o'rgatasiz.
>
> ### ② ⭐ **Delta xususiyatlar** *(`librosa.feature.delta`)*
> ## MFCC — **holat**, delta — **o'zgarish tezligi**. ## Ikkalasi birga **ancha aniqroq**.
>
> ### ③ ⭐ **Sakoe-Chiba bandi** *(`band=0.25`)*
> ```
> Oddiy DTW  →  O(n×m)  ·  cheksiz cho'zishga RUXSAT beradi
> Bandli DTW →  ~4× tez  ·  ⭐ mantiqsiz cho'zishni TAQIQLAYDI
> ```
> ## 💥 **CHEKSIZ CHO'ZISH — XATO MANBAI:** ## `"yoq"` ni **cho'zib** `"ochir"` ga moslashtirib bo'ladi.
>
> ## ⚠️ **VA CHEKLOVNI HALOL AYTAMIZ:**
> ```
> ✅ ishlaydi:  < 20 buyruq · bir xil ovoz · tinch muhit
> 💥 ishlamaydi: katta lug'at · turli odamlar · shovqin · uzluksiz nutq
> ```
> ## 🏆 **AYNAN SHU CHEKLOVLAR TUFAYLI 1980-YILLARDA HMM'GA O'TILDI.**

---

## 📌 Uch loyihaning bog'lanishi

```
① OvozPasporti     →  audioni TEKSHIRADI  (ASR dan OLDIN)
② UnliSintezator   →  nazariyani ESHITTIRADI
③ DTWBuyruq        →  1970-yillar texnologiyasi bilan ISHLAYDIGAN tizim

⭐ TO'G'RI TARTIB:  ① har doim  →  ③ kichik lug'at uchun
                    → 57–60-modullar: Whisper (katta lug'at uchun)
```

> ## 🏆 **①-LOYIHA — ENG AMALIYSI.** ## Whisper yomon ishlaganda **birinchi** shuni ishga tushiring: ## ko'pincha muammo **modelda emas, audioda**.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
