# 🚀 53-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham mahalliy** — internet kerak emas.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install numpy scipy matplotlib soundfile librosa
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, json
from pathlib import Path
import numpy as np, scipy.signal as sig
import librosa, soundfile as sf

C = 343.0
```

---

# 🎧 1-loyiha. Akustik tashxis stansiyasi

> **Maqsad:** ASR ga berishdan **oldin** audioni tekshirish — ## va **aniq qaysi muammo borligini** aytish.

```python
class AkustikTashxis:
    """🏆 ASR dan OLDIN: audio nima uchun yomon transkripsiya bo'lishini topadi."""

    # ⚠️ chegaralar — amaliyotdan
    JIM_DBFS = -35.0
    BALAND_DBFS = -6.0
    MIN_KREST = 6.0
    MIN_YUQORI = 0.005          # >4 kHz energiya ulushi
    MAKS_PAST = 0.80            # <300 Hz energiya ulushi
    MIN_NUTQ = 0.10             # 300–3400 Hz ulushi

    def __init__(self, yol, sr=16000):
        self.yol, self.sr = yol, sr
        self.y, _ = librosa.load(yol, sr=sr)
        self.muammo, self.ogoh, self.info = [], [], {}

    # ───────────────────────── daraja
    def _daraja(self):
        rms = float(np.sqrt((self.y ** 2).mean()))
        cho = float(np.abs(self.y).max())
        rms_db = 20 * np.log10(max(rms, 1e-12))
        cho_db = 20 * np.log10(max(cho, 1e-12))
        krest = cho_db - rms_db
        kes = int((np.abs(self.y) > 0.99).sum())

        if rms_db < self.JIM_DBFS:
            self.muammo.append(
                f"JUDA JIM {rms_db:.1f} dBFS — normallashtiring")
        elif rms_db > self.BALAND_DBFS:
            self.ogoh.append(f"juda baland {rms_db:.1f} dBFS")
        if kes > len(self.y) * 0.001:
            self.muammo.append(
                f"CLIPPING {kes} namuna ({kes/len(self.y):.2%}) — "
                f"qayta yozing, tuzatib bo'lmaydi")
        if krest < self.MIN_KREST:
            self.muammo.append(
                f"krest {krest:.1f} dB — haddan tashqari siqilgan")

        self.info["daraja"] = {"rms_dbfs": round(rms_db, 2),
                               "cho_dbfs": round(cho_db, 2),
                               "krest_db": round(krest, 2),
                               "clipping": kes}

    # ───────────────────────── spektr
    def _spektr(self):
        Y = np.abs(np.fft.rfft(self.y))
        fr = np.fft.rfftfreq(len(self.y), 1 / self.sr)
        jami = float((Y ** 2).sum())

        zona = {}
        for lo, hi, nom in [(0, 300, "past"), (300, 800, "F1"),
                            (800, 2500, "F2"), (2500, 4000, "F34"),
                            (4000, self.sr // 2, "yuqori")]:
            m = (fr >= lo) & (fr < hi)
            zona[nom] = round(float((Y[m] ** 2).sum()) / jami, 4)
        nutq = round(float((Y[(fr >= 300) & (fr < 3400)] ** 2).sum())
                     / jami, 4)

        if zona["yuqori"] < self.MIN_YUQORI:
            self.muammo.append(
                f"4 kHz dan yuqorida {zona['yuqori']:.2%} — "
                f"TELEFON kanali yoki 8 kHz dan ko'tarilgan · "
                f"s/sh/f/t yo'qolgan")
        if zona["past"] > self.MAKS_PAST:
            self.ogoh.append(
                f"past chastotalar {zona['past']:.0%} — "
                f"guvillash (50/60 Hz) yoki shamol?")
        if nutq < self.MIN_NUTQ:
            self.muammo.append(
                f"nutq diapazoni atigi {nutq:.1%} — nutq bormi?")

        self.info["spektr"] = zona
        self.info["nutq_ulushi"] = nutq

    # ───────────────────────── guvillash
    def _guvillash(self):
        """⚠️ 50/60 Hz elektr tarmog'i guvillashi."""
        Y = np.abs(np.fft.rfft(self.y))
        fr = np.fft.rfftfreq(len(self.y), 1 / self.sr)
        topilgan = []
        for f0 in (50, 60):
            for k in (1, 2, 3):
                f = f0 * k
                m = np.abs(fr - f) < 3
                atrof = (np.abs(fr - f) >= 6) & (np.abs(fr - f) < 30)
                if m.any() and atrof.any():
                    nisbat = Y[m].max() / max(Y[atrof].mean(), 1e-12)
                    if nisbat > 8:
                        topilgan.append((f, round(float(nisbat), 1)))
        if topilgan:
            self.ogoh.append(
                f"GUVILLASH: {topilgan} — notch filtr qo'llang")
        self.info["guvillash"] = topilgan

    # ───────────────────────── ovoz
    def _ovoz(self):
        f0, v, _ = librosa.pyin(self.y, fmin=60, fmax=400, sr=self.sr)
        ok = f0[~np.isnan(f0)]
        if len(ok) < 5:
            self.muammo.append("OVOZLI FREYM YO'Q — nutq emasmi?")
            return
        med = float(np.median(ok))
        if v.mean() < 0.25:
            self.ogoh.append(
                f"ovozli freym {v.mean():.0%} — jimlik ko'p yoki shovqin")
        self.info["ovoz"] = {"ovozli": round(float(v.mean()), 3),
                             "f0_median": round(med, 1)}

    # ───────────────────────── dinamik diapazon va shovqin poli
    def _dinamik(self):
        """⭐ Dinamik diapazon + shovqin ko'rsatkichi.

        ⚠️ Bu SNR EMAS — quyidagi izohga qarang.
        """
        r = librosa.feature.rms(y=self.y, frame_length=1024,
                                hop_length=256)[0]
        rdb = 20 * np.log10(np.maximum(r, 1e-12))
        pol = float(np.percentile(rdb, 5))          # shovqin poli
        nutq = rdb[rdb > pol + 12]
        jim = rdb[rdb <= pol + 12]
        jim_ulush = len(jim) / len(rdb)

        dd = float(nutq.mean() - pol) if len(nutq) else 0.0

        # 🏆 ASOSIY KO'RSATKICH — "jim" freymlar ULUSHI
        if jim_ulush > 0.92:
            self.muammo.append(
                f"jim freymlar {jim_ulush:.0%} — SHOVQIN POLI YUQORI "
                f"(uzluksiz shovqin, guvillash yoki juda past SNR)")
        elif jim_ulush > 0.80:
            self.ogoh.append(f"jim freymlar {jim_ulush:.0%} — shovqin bor?")

        self.info["dinamik_db"] = round(dd, 1)
        self.info["jim_ulush"] = round(jim_ulush, 3)

    # ───────────────────────── hisobot
    def hisobot(self, jsonga=None):
        for f in (self._daraja, self._spektr, self._guvillash,
                  self._ovoz, self._dinamik):
            f()

        d = self.info
        print(f"\n{'='*64}\n🎧 {os.path.basename(self.yol)}  "
              f"({len(self.y)/self.sr:.2f} s)\n{'='*64}")
        g = d["daraja"]
        print(f"  RMS {g['rms_dbfs']:+.1f} dBFS · cho'qqi "
              f"{g['cho_dbfs']:+.1f} · krest {g['krest_db']:.1f} dB")
        print(f"  dinamik diapazon {d['dinamik_db']} dB · "
              f"jim freymlar {d['jim_ulush']:.0%} · "
              f"nutq diapazoni {d['nutq_ulushi']:.1%}")
        print("  energiya: " + " · ".join(
            f"{k} {v:.1%}" for k, v in d["spektr"].items()))
        if "ovoz" in d:
            print(f"  ovozli {d['ovoz']['ovozli']:.0%} · "
                  f"f0 {d['ovoz']['f0_median']} Hz")

        if self.muammo:
            print("\n  💥 MUAMMOLAR:")
            for m in self.muammo:
                print(f"     · {m}")
        if self.ogoh:
            print("\n  ⚠️ OGOHLANTIRISHLAR:")
            for m in self.ogoh:
                print(f"     · {m}")
        if not self.muammo:
            print("\n  ✅ JIDDIY MUAMMO YO'Q — ASR uchun yaroqli")

        if jsonga:
            Path(jsonga).write_text(json.dumps(
                {**d, "muammo": self.muammo, "ogoh": self.ogoh},
                ensure_ascii=False, indent=2), encoding="utf-8")
        return not self.muammo

    # ───────────────────────── tuzatish
    def tuzat(self, chiqish=None):
        """⭐ Topilgan muammolarning TUZATSA BO'LADIGANLARINI tuzatadi."""
        z = self.y.copy()
        qilingan = []

        # ① guvillash → notch filtr
        for f, _ in self.info.get("guvillash", []):
            b, a = sig.iirnotch(f, Q=30, fs=self.sr)
            z = sig.filtfilt(b, a, z)
            qilingan.append(f"{f} Hz notch")

        # ② past chastota shovqini → high-pass 70 Hz
        if self.info.get("spektr", {}).get("past", 0) > 0.80:
            b, a = sig.butter(4, 70 / (self.sr / 2), btype="high")
            z = sig.filtfilt(b, a, z)
            qilingan.append("70 Hz high-pass")

        # ③ normallash → -20 dBFS RMS
        rms = float(np.sqrt((z ** 2).mean()))
        z = z * (10 ** (-20 / 20) / max(rms, 1e-12))
        if np.abs(z).max() > 0.99:                 # ⚠️ clipping oldini olish
            z = z / np.abs(z).max() * 0.99
        qilingan.append("RMS -20 dBFS ga normallash")

        yol = chiqish or self.yol.replace(".wav", "_tuzatilgan.wav")
        sf.write(yol, z, self.sr)
        print(f"  🔧 {' · '.join(qilingan)}")
        print(f"  💾 {yol}")
        return yol
```

### ▶️ Ishga tushirish

```python
t = AkustikTashxis("speech_01.wav")
t.hisobot("tashxis.json")

# ⭐ va endi buzilgan variantlarda sinab ko'ramiz
y, sr = librosa.load("speech_01.wav", sr=16000)

BUZUQLAR = {
    "jim":       y * 0.01,
    "clipping":  np.clip(y * 8, -1, 1),
    "guvillash": y + 0.05 * np.sin(2*np.pi*50*np.arange(len(y))/sr),
}
for nom, z in BUZUQLAR.items():
    sf.write(f"buzuq_{nom}.wav", z, sr)
    AkustikTashxis(f"buzuq_{nom}.wav").hisobot()
```

> ## 🏆 **BU LOYIHANING QIYMATI — U MUAMMONI *NOMLAYDI*.**
> ```
> ❌ "Whisper yomon ishladi"
> ✅ "audio -48 dBFS, SNR 9 dB, 4 kHz dan yuqorida 0.01% energiya"
> ```
>
> ## ⭐ **VA `tuzat()` — FAQAT TUZATSA BO'LADIGANINI TUZATADI:**
> ```
> ✅ guvillash      →  notch filtr
> ✅ past shovqin   →  high-pass
> ✅ jim            →  normallash
> 💥 CLIPPING       →  TUZATIB BO'LMAYDI — qayta yozing
> 💥 telefon kanali →  yo'qolgan chastotalar QAYTMAYDI
> ```
> ## 🔑 **OXIRGI IKKI QATOR — ENG MUHIMI.** ## Ba'zi muammolar **qaytarib bo'lmaydigan**, ## va buni **bilish** — yarim yechim.

---

# 🔬 2-loyiha. Akustik laboratoriya

> **Maqsad:** to'lqin xossalarini **eshitiladigan** va **o'lchanadigan** qilish.

```python
class AkustikLaboratoriya:
    """🏆 Beshta to'lqin xossasini AMALDA ko'rsatadi."""

    def __init__(self, sr=44100):
        self.sr = sr

    def _t(self, davom):
        return np.arange(int(self.sr * davom)) / self.sr

    def _saqla(self, y, nom, stereo=False):
        y = y / max(np.abs(y).max(), 1e-9) * 0.9
        sf.write(nom, y, self.sr)
        print(f"  💾 {nom}")
        return y

    # ───────────────── ① amplituda
    def amplituda(self, f=440, davom=0.6):
        t = self._t(davom)
        q = []
        for db in [0, -6, -12, -20, -40]:
            q.append(np.sin(2*np.pi*f*t) * 10 ** (db / 20))
            q.append(np.zeros(int(self.sr * 0.15)))
            print(f"    {db:+4d} dB  ->  amplituda {10**(db/20):.4f}")
        return self._saqla(np.concatenate(q), "01_amplituda.wav")

    # ───────────────── ② chastota
    def chastota(self, davom=0.5):
        q = []
        for f in [100, 200, 440, 1000, 4000, 8000]:
            t = self._t(davom)
            q.append(np.sin(2*np.pi*f*t) * np.hanning(len(t)))
            q.append(np.zeros(int(self.sr * 0.12)))
            print(f"    {f:5d} Hz  ->  λ = {C/f*100:7.2f} sm  "
                  f"davr = {1/f*1000:7.4f} ms")
        return self._saqla(np.concatenate(q), "02_chastota.wav")

    # ───────────────── ③ faza
    def faza(self, f=440, davom=0.8):
        t = self._t(davom)
        a = np.sin(2*np.pi*f*t)
        q = []
        for deg in [0, 90, 120, 180]:
            b = np.sin(2*np.pi*f*t + np.deg2rad(deg))
            s = (a + b) * np.hanning(len(t))
            q.append(s)
            q.append(np.zeros(int(self.sr * 0.2)))
            print(f"    {deg:3d}°  ->  amplituda {np.abs(a+b).max():.4f}  "
                  f"quvvat {((a+b)**2).mean()/(a**2).mean():.4f}×")
        return self._saqla(np.concatenate(q), "03_faza.wav")

    # ───────────────── ④ urish (beats)
    def urish(self, f1=440, davom=3.0):
        t = self._t(davom)
        q = []
        for f2 in [441, 443, 450, 470]:
            s = np.sin(2*np.pi*f1*t) + np.sin(2*np.pi*f2*t)
            q.append(s * np.hanning(len(t)))
            q.append(np.zeros(int(self.sr * 0.3)))
            print(f"    {f1} + {f2} Hz  ->  urish {abs(f2-f1)} Hz "
                  f"({'eshitiladi' if abs(f2-f1) < 20 else 'alohida ohang'})")
        return self._saqla(np.concatenate(q), "04_urish.wav")

    # ───────────────── ⑤ ITD
    def itd(self, f=500, davom=1.0):
        BOSH = 0.22
        t = self._t(davom)
        tone = np.sin(2*np.pi*f*t) * np.hanning(len(t))
        q = []
        for burchak in [-90, -45, 0, 45, 90]:
            th = np.deg2rad(abs(burchak))
            dt = (BOSH / 2) * (th + np.sin(th)) / C
            d = int(dt * self.sr)
            kech = np.concatenate([np.zeros(d), tone])[:len(tone)]
            chap, ong = (tone, kech) if burchak < 0 else (kech, tone)
            if burchak == 0:
                chap = ong = tone
            q.append(np.stack([chap, ong], axis=1))
            q.append(np.zeros((int(self.sr * 0.3), 2)))
            print(f"    {burchak:+4d}°  ->  ITD {dt*1e6:6.1f} µs "
                  f"({d} namuna)")
        y = np.concatenate(q)
        sf.write("05_itd.wav", y / np.abs(y).max() * 0.9, self.sr)
        print("  💾 05_itd.wav  🎧 QULOQCHIN bilan tinglang")
        return y

    # ───────────────── hammasi
    def hammasi(self):
        for nom, f in [("① AMPLITUDA", self.amplituda),
                       ("② CHASTOTA", self.chastota),
                       ("③ FAZA", self.faza),
                       ("④ URISH", self.urish),
                       ("⑤ ITD", self.itd)]:
            print(f"\n{nom}")
            f()
```

### ▶️ Ishga tushirish

```python
AkustikLaboratoriya().hammasi()
```

```
① AMPLITUDA
      +0 dB  ->  amplituda 1.0000
      -6 dB  ->  amplituda 0.5012
     -12 dB  ->  amplituda 0.2512
     -20 dB  ->  amplituda 0.1000
     -40 dB  ->  amplituda 0.0100
  💾 01_amplituda.wav

③ FAZA
      0°  ->  amplituda 2.0000  quvvat 4.0000×
     90°  ->  amplituda 1.4142  quvvat 2.0000×
    120°  ->  amplituda 1.0000  quvvat 1.0000×
    180°  ->  amplituda 0.0000  quvvat 0.0000×
  💾 03_faza.wav
```

> ## 🏆 **`03_faza.wav` NI TINGLANG — TO'RTINCHI BO'LAK JIMLIK.** ## Ikki bir xil tovush qo'shildi va **yo'q bo'ldi**.
>
> ## ⭐ **`04_urish.wav` — ENG QIZIQARLISI:**
> ```
> 440 + 441 Hz  →  urish  1 Hz   ⭐ sekundiga 1 marta "puls"
> 440 + 443 Hz  →  urish  3 Hz   ⭐ aniq eshitiladi
> 440 + 450 Hz  →  urish 10 Hz   ⭐ "titroq" bo'lib eshitiladi
> 440 + 470 Hz  →  urish 30 Hz   💥 ikki ALOHIDA ohang
> ```
> ## 💡 **~20 Hz — CHEGARA.** Undan tez urish ## quloq tomonidan **alohida ohang** sifatida qabul qilinadi.
> ## 💡 **AYNAN SHU HODISA BILAN GITARA SOZLANADI** — ## urish **yo'qolguncha** tor buraladi.
>
> ## ⚠️ **`05_itd.wav` — QULOQCHINSIZ ISHLAMAYDI.** ## Kolonkada ikkala kanal **aralashadi** va ITD **yo'qoladi**.

---

## 📌 Ikki loyihaning bog'lanishi

```
① AkustikTashxis      →  AMALIY: har ASR loyihasida BIRINCHI qadam
② AkustikLaboratoriya →  NAZARIY: xossalarni eshitib tushunish

🏆 ①-ni har audio faylga qo'llang — Whisper'dan OLDIN
```

> ## 🏆 **VA ①-LOYIHANING ENG QIMMATLI QISMI — `tuzat()` NING CHEKLOVI:** ## u **clipping** ni ham, **telefon kanalini** ham **tuzatolmaydi**. ## 💡 Bu — **halol dasturiy ta'minot**: ## qila olmaydigan narsasini **da'vo qilmaydi**.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
