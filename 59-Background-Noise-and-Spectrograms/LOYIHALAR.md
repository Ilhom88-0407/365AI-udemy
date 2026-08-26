# 🚀 59-modul. Mini-loyihalar

> **Ikkita tayyor loyiha.** Ikkalasi ham **ishga tushirilgan va tekshirilgan**.
> Kalit **kerak emas**.

---

## 📦 Umumiy importlar

```python
import os, re, io, json, time, warnings
warnings.filterwarnings("ignore")
import numpy as np
import soundfile as sf
import librosa
import scipy.signal as ss
import speech_recognition as sr
from jiwer import wer, process_words
```

---

# 🔬 1-loyiha. `SpektrTahlil` — audio faylning to'liq shovqin pasporti

**Muammo:** *"Bu fayl transkripsiya uchun yaroqlimi?"* degan savolga **quloq bilan** javob berib bo'lmaydi.

**Yechim:** o'lchaydigan va **aniq gapiradigan** sinf.

```python
class SpektrTahlil:
    """Audio faylning shovqin profilini o'lchaydi va tashxis qo'yadi."""

    ZONALAR = [("juda past", 0, 100), ("asosiy ton", 100, 300),
               ("formantlar", 300, 1000), ("o'rta", 1000, 2000),
               ("undoshlar", 2000, 4000), ("yuqori", 4000, 8000),
               ("juda yuqori", 8000, 24000)]

    def __init__(self, n_fft=2048, hop=512):
        self.n_fft, self.hop = n_fft, hop

    def tahlil(self, yol, shovqin_s=1.5):
        y, srate = librosa.load(yol, sr=None, mono=True)
        S = librosa.stft(y, n_fft=self.n_fft, hop_length=self.hop)
        mag = np.abs(S)
        freq = librosa.fft_frequencies(sr=srate, n_fft=self.n_fft)
        tt = librosa.frames_to_time(np.arange(S.shape[1]), sr=srate,
                                    hop_length=self.hop)

        d = {"fayl": os.path.basename(yol), "chastota": srate,
             "soniya": round(len(y) / srate, 3)}

        # --- ① umumiy energiya taqsimoti ---
        sp = mag.mean(axis=1)
        tot = float((sp ** 2).sum())
        d["zonalar"] = {nom: round(float((sp[(freq >= lo) & (freq < hi)] ** 2).sum()
                                         / tot * 100), 2)
                        for nom, lo, hi in self.ZONALAR}

        # --- ② SNR spektri ---
        m_sh, m_nu = tt < shovqin_s, tt >= shovqin_s
        if m_sh.sum() >= 4 and m_nu.sum() >= 4:
            sh = 20 * np.log10(mag[:, m_sh].mean(axis=1) + 1e-12)
            nu = 20 * np.log10(mag[:, m_nu].mean(axis=1) + 1e-12)
            snr = nu - sh
            d["SNR"] = {
                "ortacha_dB": round(float(snr.mean()), 2),
                "eng_yomon_Hz": int(freq[int(np.argmin(snr))]),
                "eng_yomon_dB": round(float(snr.min()), 2),
                "eng_yaxshi_Hz": int(freq[int(np.argmax(snr))]),
                "eng_yaxshi_dB": round(float(snr.max()), 2),
            }
            for nom, lo, hi in self.ZONALAR:
                k = (freq >= lo) & (freq < hi)
                if k.any():
                    d["SNR"][f"zona_{nom}"] = round(float(snr[k].mean()), 2)
        else:
            d["SNR"] = None

        # --- ③ dinamika ---
        db_full = librosa.amplitude_to_db(mag, ref=np.max, top_db=None)
        d["dinamika"] = {
            "eng_past_dB": round(float(db_full.min()), 2),
            "top_db80_kesadi_%": round(float((db_full < -80).mean() * 100), 2),
        }

        # --- ④ jimlik ---
        iv = librosa.effects.split(y, top_db=30)
        nutq_s = sum(b - a for a, b in iv) / srate
        d["jimlik"] = {
            "segmentlar": len(iv),
            "nutq_ulush": round(float(nutq_s / (len(y) / srate)), 3),
            "jim_ulush": round(float(1 - nutq_s / (len(y) / srate)), 3),
        }

        # --- ⑤ daraja ---
        rms = float(np.sqrt(np.mean(y ** 2)))
        d["daraja"] = {
            "RMS_dBFS": round(20 * np.log10(rms + 1e-12), 2),
            "krest_dB": round(float(20 * np.log10(float(np.abs(y).max()) / (rms + 1e-12))), 2),
            "clipping": int((np.abs(y) >= 0.999).sum()),
        }

        d["tashxis"] = self._tashxis(d)
        return d

    def _tashxis(self, d):
        t = []
        s = d.get("SNR")
        if s:
            if s.get("zona_undoshlar", 99) < 6:
                t.append(f"💥 undoshlar zonasida SNR {s['zona_undoshlar']} dB — "
                         f"so'zlarni ajratish qiyin")
            if s["eng_yomon_dB"] < 0:
                t.append(f"💥 {s['eng_yomon_Hz']} Hz da shovqin nutqdan "
                         f"{-s['eng_yomon_dB']:.1f} dB BALAND")
        if d["jimlik"]["jim_ulush"] < 0.10:
            t.append(f"⚠️ jimlik atigi {d['jimlik']['jim_ulush']*100:.1f}% — "
                     f"doimiy fon shovqini")
        if d["daraja"]["clipping"] > 0:
            t.append(f"💥 clipping: {d['daraja']['clipping']} namuna")
        if d["daraja"]["RMS_dBFS"] < -35:
            t.append(f"⚠️ juda jim: {d['daraja']['RMS_dBFS']} dBFS")
        if d["daraja"]["krest_dB"] > 22:
            t.append(f"⚠️ krest {d['daraja']['krest_dB']} dB — impulsli shovqin?")
        if d["chastota"] < 16000:
            t.append(f"⚠️ chastota {d['chastota']} Hz — yuqori formantlar yo'q")
        return t or ["✅ jiddiy muammo topilmadi"]

    def hisobot(self, d):
        print(f"\n{'='*68}")
        print(f"  🔬 {d['fayl']}   {d['soniya']} s @ {d['chastota']} Hz")
        print(f"{'='*68}")

        print(f"\n  ENERGIYA TAQSIMOTI")
        for nom, lo, hi in self.ZONALAR:
            v = d["zonalar"][nom]
            bar = "█" * int(v / 2)
            print(f"    {nom:>12s} {lo:5d}-{hi:5d} Hz  {v:6.2f}%  {bar}")

        if d["SNR"]:
            s = d["SNR"]
            print(f"\n  SNR  (nutq − shovqin)")
            print(f"    o'rtacha    : {s['ortacha_dB']:+7.2f} dB")
            print(f"    eng yaxshi  : {s['eng_yaxshi_dB']:+7.2f} dB "
                  f"@ {s['eng_yaxshi_Hz']} Hz")
            print(f"    eng yomon   : {s['eng_yomon_dB']:+7.2f} dB "
                  f"@ {s['eng_yomon_Hz']} Hz")
            print(f"    zonalar bo'yicha:")
            for nom, _, _ in self.ZONALAR:
                k = f"zona_{nom}"
                if k in s:
                    bay = "💥" if s[k] < 6 else ("⚠️" if s[k] < 12 else "✅")
                    print(f"      {bay} {nom:>12s}  {s[k]:+7.2f} dB")

        print(f"\n  DINAMIKA")
        print(f"    haqiqiy eng past : {d['dinamika']['eng_past_dB']:.2f} dB")
        print(f"    top_db=80 kesadi : {d['dinamika']['top_db80_kesadi_%']:.2f}%")

        print(f"\n  JIMLIK va DARAJA")
        print(f"    segmentlar : {d['jimlik']['segmentlar']}  "
              f"jimlik {d['jimlik']['jim_ulush']*100:.1f}%")
        print(f"    RMS {d['daraja']['RMS_dBFS']} dBFS · "
              f"krest {d['daraja']['krest_dB']} dB · "
              f"clipping {d['daraja']['clipping']}")

        print(f"\n  TASHXIS")
        for x in d["tashxis"]:
            print(f"    {x}")
        return d
```

### 🔬 Ishga tushiramiz

```python
sp = SpektrTahlil()
d1 = sp.hisobot(sp.tahlil("speech_01.wav"))
```

### ✅ Haqiqiy natija

```
====================================================================
  🔬 speech_01.wav   23.512 s @ 44100 Hz
====================================================================

  ENERGIYA TAQSIMOTI
       juda past     0-  100 Hz    1.12%
      asosiy ton   100-  300 Hz   51.76%  █████████████████████████
      formantlar   300- 1000 Hz   27.17%  █████████████
           o'rta  1000- 2000 Hz    9.99%  ████
       undoshlar  2000- 4000 Hz    3.16%  █
          yuqori  4000- 8000 Hz    3.96%  █
     juda yuqori  8000-24000 Hz    2.85%  █

  SNR  (nutq − shovqin)
    o'rtacha    :  +32.42 dB
    eng yaxshi  :  +75.65 dB @ 12726 Hz
    eng yomon   :   -4.56 dB @ 2260 Hz
    zonalar bo'yicha:
      💥    juda past    +2.40 dB
      ✅   asosiy ton   +12.89 dB
      💥   formantlar    +4.52 dB
      💥        o'rta    +2.00 dB
      💥    undoshlar    +3.23 dB
      ⚠️       yuqori   +11.77 dB
      ✅  juda yuqori   +46.51 dB

  DINAMIKA
    haqiqiy eng past : -142.03 dB
    top_db=80 kesadi : 32.40%

  JIMLIK va DARAJA
    segmentlar : 3  jimlik 2.6%
    RMS -20.47 dBFS · krest 19.11 dB · clipping 0

  TASHXIS
    💥 undoshlar zonasida SNR 3.23 dB — so'zlarni ajratish qiyin
    💥 2260 Hz da shovqin nutqdan 4.6 dB BALAND
    ⚠️ jimlik atigi 2.6% — doimiy fon shovqini
```

> ## 🏆 **UCHTA TASHXIS — VA UCHALASI TO'G'RI.**
>
> ## ⭐ **VA JADVAL MUAMMONI ANIQ KO'RSATADI:** ## undoshlar zonasida SNR **+3.23 dB** ## *(juda yuqorida esa +46.51 dB)*. ## ## 💡 Ya'ni shovqin **aynan kerakli joyda**.

> ## ⚠️ **VA E'TIBOR BERING — ENERGIYANING 51.76% I 100–300 Hz DA.** ## Bu **asosiy ton** zonasi *(`f0` ≈ 138 Hz)*. ## ## 💥 **0–100 Hz da esa atigi 1.12%** — ## ya'ni bu faylda **gul (50/60 Hz) muammosi yo'q**.

---

# ⚖️ 2-loyiha. `HalolTaqqoslash` — "yaxshilash" haqiqatan yaxshiladimi?

**Muammo:** har bir kurs, blog va StackOverflow javobi *"pre-emphasis qo'shing"* deydi. **Hech kim o'lchamaydi.**

**Yechim:** o'zi o'lchaydigan, o'zi xulosa chiqaradigan va **noxush haqiqatni ham aytadigan** sinf.

```python
class HalolTaqqoslash:
    """Audio 'yaxshilash' usullarini bir nechta shovqin darajasida sinaydi.

    Sinf natijani BEZAMAYDI — usul yomonlashtirsa, shuni aytadi.
    """

    def __init__(self, srate=16000, urinish=1):
        self.srate = srate
        self.urinish = urinish
        self.rec = sr.Recognizer()

    # ---------- yordamchi ----------
    def _shovqin(self, sig, snr_db, urug):
        rng = np.random.default_rng(urug)
        p_s = float(np.mean(sig ** 2))
        n = rng.standard_normal(len(sig)).astype(np.float32) * \
            np.sqrt(p_s / (10 ** (snr_db / 10)))
        return (sig + n).astype(np.float32)

    def _transkript(self, sig):
        sig = sig / max(float(np.abs(sig).max()), 1e-9) * 0.9
        sf.write("_halol.wav", sig, self.srate, subtype="PCM_16")
        try:
            with sr.AudioFile("_halol.wav") as s:
                a = self.rec.record(s)
            r = self.rec.recognize_google(a, show_all=True)
            if not r:
                return "", None
            return r["alternative"][0]["transcript"], \
                r["alternative"][0].get("confidence")
        except Exception:
            return "", None
        finally:
            if os.path.exists("_halol.wav"):
                os.remove("_halol.wav")

    @staticmethod
    def norm(s):
        s = " ".join(s.split()).replace("’", "'").lower()
        return " ".join(re.sub(r"[^\w\s']", " ", s).split())

    # ---------- asosiy ----------
    def sinov(self, sig, havola, usullar, snr_lar=(30, 10, 0)):
        nh = self.norm(havola)
        j = {}
        for snr in snr_lar:
            shov = self._shovqin(sig, snr, urug=snr)
            for nom, f in usullar.items():
                try:
                    z = f(shov.copy())
                except Exception as e:
                    j[(snr, nom)] = {"WER": 1.0, "sozlar": 0,
                                     "xato": type(e).__name__}
                    continue
                t, c = self._transkript(z)
                j[(snr, nom)] = {
                    "WER": round(wer(nh, self.norm(t)), 4) if t else 1.0,
                    "sozlar": len(t.split()),
                    "ishonch": round(c, 4) if c else None,
                }
        return self.hisobot(j, list(usullar), list(snr_lar))

    def hisobot(self, j, usullar, snr_lar):
        baza = usullar[0]
        w = 15
        print(f"\n  WER (past = yaxshi)")
        print(f"  {'SNR':>7} | " + " | ".join(f"{n:>{w}s}" for n in usullar))
        print("  " + "-" * (10 + (w + 3) * len(usullar)))
        for snr in snr_lar:
            hujayralar = []
            for n in usullar:
                v = j[(snr, n)]["WER"]
                bay = "🏆" if v == min(j[(snr, x)]["WER"] for x in usullar) else "  "
                hujayralar.append(f"{v:{w-2}.4f}{bay}")
            print(f"  {snr:5d} dB | " + " | ".join(hujayralar))

        print(f"\n  Tanilgan so'zlar")
        for snr in snr_lar:
            print(f"  {snr:5d} dB | " + " | ".join(
                f"{j[(snr,n)]['sozlar']:{w}d}" for n in usullar))

        print(f"\n  {'usul':>17s} {'yaxshiladi':>11s} {'yomonlashtirdi':>15s} "
              f"{'Δ WER':>10s}")
        xulosa, eng = {}, (None, -9.9)
        for n in usullar[1:]:
            d = [j[(s, baza)]["WER"] - j[(s, n)]["WER"] for s in snr_lar]
            yax = sum(1 for x in d if x > 0.01)
            yom = sum(1 for x in d if x < -0.01)
            o = float(np.mean(d))
            xulosa[n] = {"yaxshiladi": yax, "yomonlashtirdi": yom,
                         "delta": round(o, 4)}
            bay = "⭐" if yax > yom else ("💥" if yom else "  ")
            print(f"  {n:>17s} {yax:>11d} {yom:>15d} {o:>+10.4f} {bay}")
            if o > eng[1]:
                eng = (n, o)

        print()
        if eng[1] > 0.01:
            print(f"  🏆 TAVSIYA: {eng[0]}  (Δ {eng[1]:+.4f})")
        else:
            print(f"  🏆 TAVSIYA: HECH NARSA QILMANG.")
            print(f"     Hech bir usul {baza!r} dan yaxshi chiqmadi.")
        return xulosa
```

### 🔬 Ishga tushiramiz

```python
def bandpass(s, srate=16000, lo=80, hi=7500):
    ny = srate / 2
    b, a = ss.butter(4, [lo/ny, min(hi, ny-1)/ny], btype="band")
    return ss.filtfilt(b, a, s).astype(np.float32)


def spektral(s, alfa=2.0, pol=0.05):
    S = librosa.stft(s)
    mag, faza = np.abs(S), np.angle(S)
    shov = mag[:, :40].mean(axis=1, keepdims=True)
    toza = np.maximum(mag - alfa * shov, pol * mag)
    return librosa.istft(toza * np.exp(1j*faza), length=len(s)).astype(np.float32)


def normallash(s, maqsad=-20.0):
    rms = float(np.sqrt(np.mean(s ** 2)))
    return np.clip(s * (10 ** (maqsad/20) / max(rms, 1e-9)), -1, 1).astype(np.float32)


USULLAR = {
    "hech narsa":   lambda s: s,
    "normallash":   normallash,
    "bandpass":     bandpass,
    "pre-emph .97": lambda s: librosa.effects.preemphasis(s, coef=0.97),
    "spektral α=2": spektral,
    "HPSS":         lambda s: librosa.effects.harmonic(s, margin=3.0).astype(np.float32),
}

GT = ("My name is Ivan and I am excited to have you as part of our learning community! "
      "Before we get started, I’d like to tell you a little bit about myself. "
      "I’m a sound engineer turned data scientist, curious about machine learning "
      "and Artificial Intelligence. My professional background is primarily in "
      "media production, with a focus on audio, IT, and communications")

y16, _ = librosa.load("speech_01.wav", sr=16000)
ht = HalolTaqqoslash(srate=16000)
x = ht.sinov(y16, GT, USULLAR, snr_lar=(30, 10, 0))
```

### ✅ Haqiqiy natija

```
  WER (past = yaxshi)
      SNR |      hech narsa |      normallash |        bandpass |    pre-emph .97 |    spektral α=2 |            HPSS
  ----------------------------------------------------------------------------------------------------------------------
     30 dB |        0.0328🏆 |        0.0328🏆 |        0.0328🏆 |        0.4098   |        0.4098   |        1.0000
     10 dB |        0.0328🏆 |        0.0328🏆 |        0.0328🏆 |        0.4098   |        1.0000   |        1.0000
      0 dB |        0.1967   |        0.1475🏆 |        0.1803   |        0.4098   |        1.0000   |        1.0000

  Tanilgan so'zlar
     30 dB |              61 |              61 |              61 |              37 |              37 |               4
     10 dB |              61 |              61 |              61 |              37 |               0 |               4
      0 dB |              61 |              62 |              61 |              50 |               0 |               2

               usul  yaxshiladi  yomonlashtirdi      Δ WER
         normallash           1               0    +0.0164 ⭐
           bandpass           1               0    +0.0055 ⭐
       pre-emph .97           0               3    -0.3224 💥
       spektral α=2           0               3    -0.7158 💥
               HPSS           0               3    -0.9126 💥

  🏆 TAVSIYA: normallash  (Δ +0.0164)
```

> ## ⚠️ **TAVSIYA — `normallash`, Δ +0.0164. LEKIN BU SHOVQIN ICHIDA.**
>
> ## 💥 **Yagona farq 0 dB SNR da:** 0.1967 vs 0.1475 — ## ya'ni **uchtagina so'z**. ## 30 va 10 dB da esa uchalasi **AYNAN bir xil**. ## ## 🔑 **Δ +0.0164 — "yaxshilash" emas, o'lchov shovqini.**
>
> ## 🏆 **HALOL XULOSA:** ## `normallash` va `bandpass` — **zararsiz**, ## `pre-emph`, `spektral` va `HPSS` — **aniq zararli** ## *(3/3 yomonlashtirdi, Δ −0.32 dan −0.91 gacha)*.

> ## ⭐ **VA E'TIBOR BERING:** ## 0 dB SNR da `pre-emph` **50 ta so'z** tanidi, ## `hech narsa` esa **61 ta**. ## ## 💥 **WER esa 0.4098 vs 0.1967** — ## so'zlar **kamroq VA noto'g'riroq**. ## ## ⚠️ **`HPSS` 4 ta "so'z" qaytardi** — ## bu **matn emas**, shovqindan tug'ilgan bo'g'inlar. ## **So'zlar sonini metrika sifatida ishlatmang.**

---

## 🎯 Loyihalarni kengaytirish

| Fikr | Qanday |
|---|---|
| Whisper bilan takrorlash | **60-modul** — natija **butunlay boshqacha** bo'lishi mumkin |
| Ko'p fayl bo'yicha statistika | Har bir usul uchun **o'rtacha va std** |
| Haqiqiy shovqin | Oq shovqin o'rniga **kafe/transport** yozuvi |
| Notch filtr | 50/60 Hz gulini o'chirish — `ss.iirnotch()` |
| Jimlik bo'yicha bo'laklash | `librosa.effects.split()` + 58-modul quvuri |
| `noisereduce` paketi | `pip install noisereduce` — shu jadvalga qo'shing |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md)
