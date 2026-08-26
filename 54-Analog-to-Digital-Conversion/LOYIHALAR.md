# 🚀 54-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham ASR quvurining amaliy qismi.**

## ⚙️ Umumiy tayyorgarlik

```bash
pip install numpy scipy soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, json, time
from pathlib import Path
import numpy as np, scipy.signal as sig
import librosa, soundfile as sf
```

---

# 🔧 1-loyiha. ASR tayyorlash quvuri

> **Maqsad:** istalgan audio faylni **Whisper uchun ideal holatga** keltirish — ## va **har qadamni hisobot qilish**.

```python
class ASRTayyorlovchi:
    """🏆 Audio → Whisper uchun tayyor 16 kHz float32 mono.

    Har qadam LOGGA yoziladi — nima o'zgargani BILINADI.
    """

    HEDEF_SR = 16000
    HEDEF_DBFS = -20.0
    MIN_YUQORI = 0.005            # >4 kHz energiya ulushi

    def __init__(self, hedef_sr=None, hedef_dbfs=None):
        self.sr = hedef_sr or self.HEDEF_SR
        self.dbfs = hedef_dbfs if hedef_dbfs is not None else self.HEDEF_DBFS

    # ───────────────────────── bir fayl
    def tayyorla(self, yol, chiqish=None, kesish_db=None, jim=False):
        log, ogoh = [], []
        t0 = time.perf_counter()

        # ① o'qish — ASL sample rate saqlanadi
        x, s = librosa.load(yol, sr=None, mono=False)
        asl_shakl = x.shape
        log.append(f"o'qildi {s} Hz · shakl {asl_shakl}")

        # ② stereo → mono
        if x.ndim > 1:
            # ⚠️ o'rtacha olishdan OLDIN kanallar farqini tekshiramiz
            farq = float(np.abs(x[0] - x[1]).mean())
            x = x.mean(axis=0)
            log.append(f"stereo -> mono (kanal farqi {farq:.5f})")
            if farq < 1e-6:
                log.append("  ⭐ kanallar AYNAN bir xil — fayl aslida mono")

        # ③ qayta namunalash — ⭐ anti-aliasing avtomatik
        if s != self.sr:
            x = librosa.resample(x, orig_sr=s, target_sr=self.sr)
            log.append(f"{s} -> {self.sr} Hz")
            if s < self.sr:
                ogoh.append(
                    f"⚠️ {s} Hz dan KO'TARILDI — yangi ma'lumot QO'SHILMAYDI")

        # ④ DC siljish
        dc = float(x.mean())
        if abs(dc) > 1e-4:
            x = x - dc
            log.append(f"DC siljish {dc:+.5f} olib tashlandi")

        # ⑤ jimlikni kesish
        if kesish_db:
            oldin = len(x)
            x, _ = librosa.effects.trim(x, top_db=kesish_db)
            if len(x) < oldin:
                log.append(f"jimlik kesildi "
                           f"{(oldin-len(x))/self.sr:.2f} s")

        # ⑥ clipping tekshiruvi — ⚠️ normallashdan OLDIN
        kes = int((np.abs(x) > 0.99).sum())
        if kes > len(x) * 0.001:
            ogoh.append(f"💥 CLIPPING {kes} namuna ({kes/len(x):.2%}) — "
                        f"TUZATIB BO'LMAYDI, qayta yozing")

        # ⑦ RMS normallash
        rms = float(np.sqrt((x ** 2).mean()))
        if rms < 1e-9:
            ogoh.append("💥 SIGNAL YO'Q (butunlay jim)")
        else:
            x = x * (10 ** (self.dbfs / 20) / rms)
            if np.abs(x).max() > 0.99:
                x = x / np.abs(x).max() * 0.99
                log.append("⚠️ clipping oldini olish uchun pasaytirildi")
            log.append(f"RMS -> {self.dbfs} dBFS")

        # ⑧ float32 — ⭐ Whisper shuni kutadi
        x = x.astype(np.float32)

        # ⑨ yakuniy tekshiruv
        tekshir = self._tekshir(x)
        if tekshir["yuqori"] < self.MIN_YUQORI:
            ogoh.append(f"💥 4 kHz+ atigi {tekshir['yuqori']:.2%} — "
                        f"telefon kanali yoki ko'tarilgan fayl")

        dt = time.perf_counter() - t0
        if not jim:
            print(f"\n  📄 {os.path.basename(yol)}  ({dt*1000:.0f} ms)")
            for m in log:
                print(f"     · {m}")
            for m in ogoh:
                print(f"     {m}")
            if not ogoh:
                print("     ✅ Whisper uchun tayyor")

        if chiqish:
            sf.write(chiqish, x, self.sr)

        return {"audio": x, "sr": self.sr, "log": log, "ogoh": ogoh,
                **tekshir, "vaqt_ms": round(dt * 1000, 1)}

    # ───────────────────────── tekshiruv
    def _tekshir(self, x):
        X = np.abs(np.fft.rfft(x))
        fr = np.fft.rfftfreq(len(x), 1 / self.sr)
        jami = float((X ** 2).sum()) or 1.0
        rms = float(np.sqrt((x ** 2).mean()))
        return {
            "davomiylik": round(len(x) / self.sr, 3),
            "rms_dbfs": round(20 * np.log10(max(rms, 1e-12)), 2),
            "krest_db": round(20 * np.log10(
                max(float(np.abs(x).max()), 1e-12) / max(rms, 1e-12)), 2),
            "past": round(float((X[fr < 300] ** 2).sum()) / jami, 4),
            "nutq": round(float(
                (X[(fr >= 300) & (fr < 3400)] ** 2).sum()) / jami, 4),
            "yuqori": round(float((X[fr >= 4000] ** 2).sum()) / jami, 4),
        }

    # ───────────────────────── papka
    def papka(self, kirish, chiqish, kesish_db=40, kengaytmalar=(".wav",
                                                                 ".mp3",
                                                                 ".m4a",
                                                                 ".flac")):
        """⭐ Butun papkani qayta ishlaydi + CSV hisobot."""
        Path(chiqish).mkdir(parents=True, exist_ok=True)
        q = []
        fayllar = [f for f in sorted(os.listdir(kirish))
                   if f.lower().endswith(kengaytmalar)]

        for i, f in enumerate(fayllar, 1):
            try:
                r = self.tayyorla(
                    os.path.join(kirish, f),
                    chiqish=os.path.join(chiqish,
                                         Path(f).stem + "_16k.wav"),
                    kesish_db=kesish_db, jim=True)
                q.append({"fayl": f, "holat": "ok" if not r["ogoh"]
                          else "ogoh", "muammo": " | ".join(r["ogoh"]),
                          **{k: v for k, v in r.items()
                             if k not in ("audio", "log", "ogoh")}})
            except Exception as e:
                q.append({"fayl": f, "holat": "💥 XATO",
                          "muammo": f"{type(e).__name__}: {e}"})
            print(f"  [{i}/{len(fayllar)}] {f}")

        import pandas as pd
        d = pd.DataFrame(q)
        d.to_csv(os.path.join(chiqish, "hisobot.csv"),
                 index=False, encoding="utf-8-sig")

        print(f"\n  ✅ {len(d)} fayl · "
              f"{(d.holat == 'ok').sum()} muammosiz · "
              f"{(d.holat == 'ogoh').sum()} ogohlantirishli · "
              f"{(d.holat.str.contains('XATO')).sum()} xato")
        print(f"  💾 {chiqish}/hisobot.csv")
        return d
```

### ▶️ Ishga tushirish

```python
t = ASRTayyorlovchi()
r = t.tayyorla("speech_01.wav", chiqish="tayyor.wav", kesish_db=40)
print(f"\n  natija: {r['davomiylik']} s · RMS {r['rms_dbfs']} dBFS · "
      f"krest {r['krest_db']} dB")
```

```
  📄 speech_01.wav  (836 ms)
     · o'qildi 44100 Hz · shakl (1036871,)
     · 44100 -> 16000 Hz
     · jimlik kesildi 0.54 s
     · RMS -> -20.0 dBFS
     ✅ Whisper uchun tayyor

  natija: 22.976 s · RMS -20.0 dBFS · krest 16.25 dB
```

```python
# ⭐ va telefon kanalidan o'tgan fayl (53-modul, M19)
t.tayyorla("telefon.wav", kesish_db=40)
```

```
  📄 telefon.wav  (19 ms)
     · o'qildi 16000 Hz · shakl (376190,)
     · jimlik kesildi 0.57 s
     · RMS -> -20.0 dBFS
     💥 4 kHz+ atigi 0.00% — telefon kanali yoki ko'tarilgan fayl
```

> ## 🏆 **UCHTA MUHIM DIZAYN QARORI:**
>
> ### ① ⭐ **Clipping — normallashdan OLDIN tekshiriladi**
> ## Normallashdan **keyin** clipping **yo'qoladi** *(ko'rinmaydi)*, ## lekin **buzilish qoladi**.
>
> ### ② ⭐ **Stereo → mono da kanal farqi o'lchanadi**
> ```
> farq < 1e-6  →  fayl aslida MONO (ikki nusxa)
> farq katta   →  haqiqiy stereo, o'rtacha olish MA'NOLI
> ```
>
> ### ③ ⭐ **Sample rate KO'TARILSA — ogohlantirish**
> ```
> 8000 -> 16000  →  ⚠️ yangi ma'lumot QO'SHILMAYDI
> ```
> ## 💥 Ko'p odam buni **sifat oshirish** deb o'ylaydi. ## Bu — **noto'g'ri**.
>
> ## ⚠️ **VA `float32` — MAJBURIY.** ## `int16` ni to'g'ridan-to'g'ri Whisper'ga bersangiz — ## 💥 natija **ma'nosiz** bo'ladi *(qiymatlar −32768…32767)*.

---

# 🎚️ 2-loyiha. Raqamlash laboratoriyasi

> **Maqsad:** sample rate va bit chuqurligining ta'sirini ## **eshitib** va **o'lchab** ko'rish.

```python
class RaqamlashLab:
    """🔬 Sampling va quantization ta'sirini o'lchaydi va eshittiradi."""

    def __init__(self, yol, sr=44100):
        self.asl, self.sr = librosa.load(yol, sr=sr)
        self.asl = self.asl / max(np.abs(self.asl).max(), 1e-9) * 0.9

    # ───────────────── sample rate
    def sample_rate(self, ro_yxat=(4000, 8000, 11025, 16000, 22050, 44100),
                    saqla=True):
        """⭐ Har sample rate da nima yo'qoladi?"""
        print("  sr        Nayqvist   >Nayqvist energiya   RMS xato")
        etalon = self.asl
        for s in ro_yxat:
            past = librosa.resample(etalon, orig_sr=self.sr, target_sr=s)
            qayta = librosa.resample(past, orig_sr=s, target_sr=self.sr)

            n = min(len(qayta), len(etalon))
            xato = float(np.sqrt(((qayta[:n] - etalon[:n]) ** 2).mean()))

            X = np.abs(np.fft.rfft(etalon))
            fr = np.fft.rfftfreq(len(etalon), 1 / self.sr)
            yoq = float((X[fr >= s / 2] ** 2).sum()) / float((X ** 2).sum())

            print(f"  {s:6d}  {s//2:8d}   {yoq:16.2%}   {xato:9.6f}")
            if saqla:
                sf.write(f"sr_{s}.wav", past, s)

    # ───────────────── bit chuqurligi
    def bit_chuqurligi(self, ro_yxat=(2, 4, 6, 8, 12, 16), dither=False,
                       saqla=True):
        x = self.asl
        krest = 20 * np.log10(
            float(np.abs(x).max()) / float(np.sqrt((x ** 2).mean())))
        print(f"  krest-faktor {krest:.2f} dB\n")
        print("  bit   o'lchangan   darslik   tuzatilgan   farq")
        for b in ro_yxat:
            q = self._kvantla(x, b, dither)
            snr = 10 * np.log10(
                (x ** 2).mean() / max(((x - q) ** 2).mean(), 1e-30))
            tuz = 6.02 * b + 1.76 - krest + 3
            print(f"  {b:3d}   {snr:9.2f}  {6.02*b+1.76:8.2f}  "
                  f"{tuz:11.2f}  {abs(snr-tuz):6.2f}")
            if saqla:
                sf.write(f"bit_{b}{'_d' if dither else ''}.wav", q, self.sr)

    @staticmethod
    def _kvantla(x, bit, dither=False, urug=0):
        L = 2 ** bit
        z = x.copy()
        if dither:                              # ⭐ TPDF dither
            r = np.random.RandomState(urug)
            q = 1.0 / (L / 2 - 1)
            z = z + (r.random(len(z)) - r.random(len(z))) * q
        return np.round(z * (L / 2 - 1)) / (L / 2 - 1)

    # ───────────────── aliasing
    def aliasing(self, saqla=True):
        """💥 Anti-aliasing filtrsiz nima bo'ladi?"""
        t = np.arange(self.sr * 2) / self.sr
        sweep = sig.chirp(t, f0=100, f1=8000, t1=2, method="linear") * 0.5

        togri = librosa.resample(sweep, orig_sr=self.sr, target_sr=8000)
        xato = sweep[::int(self.sr / 8000)]

        for nom, s, srr in [("✅ to'g'ri", togri, 8000),
                            ("💥 filtrsiz", xato, 8000)]:
            print(f"  {nom:12s} uzunlik {len(s):6d} · "
                  f"davomiylik {len(s)/srr:5.2f} s "
                  f"({'✅' if abs(len(s)/srr - 2.0) < 0.01 else '💥 XATO'})")
            if saqla:
                sf.write(f"alias_{nom.split()[1]}.wav", s, srr)
        print("\n  🎧 filtrsiz faylda ohang ko'tarilib, keyin TUSHADI")

    # ───────────────── hammasi
    def hammasi(self):
        print("\n① SAMPLE RATE")
        self.sample_rate()
        print("\n② BIT CHUQURLIGI")
        self.bit_chuqurligi()
        print("\n③ BIT CHUQURLIGI + DITHER")
        self.bit_chuqurligi(dither=True, saqla=True)
        print("\n④ ALIASING")
        self.aliasing()
```

### ▶️ Ishga tushirish

```python
RaqamlashLab("speech_01.wav").hammasi()
```

```
① SAMPLE RATE
  sr        Nayqvist   >Nayqvist energiya   RMS xato
    4000      2000             20.22%       0.045064
    8000      4000             17.36%       0.041627
   11025      5512             15.87%       0.040280
   16000      8000              7.28%       0.029405
   22050     11025              1.31%       0.012922
   44100     22050              0.00%       0.000000

② BIT CHUQURLIGI
  krest-faktor 19.11 dB

  bit   o'lchangan   darslik   tuzatilgan   farq
    2        0.02     13.80        -2.31     2.33
    4        8.33     25.84         9.73     1.40
    6       20.73     37.88        21.77     1.04
    8       32.96     49.92        33.81     0.85
   12       57.08     74.00        57.89     0.80
   16       81.15     98.08        81.97     0.81

④ ALIASING
  ✅ to'g'ri    uzunlik  16000 · davomiylik  2.00 s (✅)
  💥 filtrsiz   uzunlik  17640 · davomiylik  2.21 s (💥 XATO)
```

> ## 🏆 **BIRINCHI JADVAL — MODULNING ENG QIMMATLI O'LCHOVI.**
>
> ## ⚠⚠ **VA MEN BU YERDA HAM XATO KUTGAN EDIM:** ## *"16 kHz da atigi 0.09% energiya yo'qoladi"* deb o'ylagandim. ## 💥 **O'LCHOV 7.28% BERDI — 81× KO'P.**
>
> ## 🔑 **NIMA UCHUN?** ## Bu ustun **44.1 kHz spektrida** o'lchanadi, ## ya'ni 8 kHz dan **22 kHz gacha** bo'lgan hamma narsani sanaydi — ## nafaqat nutqni, balki **shovqin va artefaktlarni** ham.
>
> ## 🏆 **`RMS xato` USTUNI ESA ISHONCHLIROQ:**
> ```
> 22.05 kHz  →  0.012922
> 16 kHz     →  0.029405     ⭐ 2.3× ko'proq
>  8 kHz     →  0.041627     ⚠️ 3.2× ko'proq
>  4 kHz     →  0.045064     💥 3.5× ko'proq
> ```
> ## 💡 **VA E'TIBOR BERING — 8 kHz DAN 4 kHz GA O'TISHDA XATO ATIGI 8% OSHDI** *(0.0416 → 0.0451)*. ## 🔑 Chunki 4 kHz dan yuqoridagi energiya ## allaqachon **yo'qolgan edi**.
>
> ## 🏆 **AMALIY XULOSA:** ## ✅ **44.1 → 16 kHz** — arzon va xavfsiz ## ⚠️ **16 → 8 kHz** — `s`/`sh`/`f`/`t` shikastlanadi ## 💥 **8 → 4 kHz** — nutq **tushunarsiz** bo'ladi
>
> ## ⚠️ **IKKINCHI JADVALDA HAM FARQ 0.8 dB ATROFIDA** — ## MASHQLARDAGI **0.09 dB** dan **9× katta**. ## 🔑 Sabab: bu yerda audio **0.9 ga normallashtirilgan**, ## MASHQLARDA esa **1.0 ga**. ## 💡 **Krest-faktor formulasi normallash darajasiga sezgir.**

---

## 📌 Ikki loyihaning bog'lanishi

```
① ASRTayyorlovchi  →  AMALIY: har ASR loyihasida ishlatiladi
② RaqamlashLab     →  NAZARIY: parametr tanlashni ASOSLAYDI

🏆 ② bilan o'lchang → ① da qo'llang
```

> ## 🏆 **VA ①-LOYIHANING `papka()` METODI — ENG AMALIYSI.** ## U **minglab faylni** qayta ishlaydi va ## **CSV hisobot** beradi: qaysi fayl **muammoli**, ## qaysinisi **Whisper uchun tayyor**.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
