# 🚀 61-modul. Mini-loyihalar

> **Ikkita loyiha.** Ikkalasi ham **ishga tushirilgan va tekshirilgan**.
> Bular — butun bo'limning **yakuniy asboblari**.

---

## 📦 Umumiy importlar

```python
import os, io, re, csv, json, time, hashlib, functools, collections
import warnings
warnings.filterwarnings("ignore")
import numpy as np
import librosa
import soundfile as sf
from jiwer import wer, cer, process_words
from transformers import pipeline
```

---

# 🛡️ 1-loyiha. `IshonchliASR` — ishlab chiqarishga tayyor quvur

**Muammo:** butun bo'lim davomida **oltita** turdagi muammoni o'lchadik:

| # | Muammo | Qayerda |
|---|---|---|
| ① | Uzun fayl **jimgina kesiladi** | 58-modul |
| ② | Format qo'llab-quvvatlanmaydi | 58-modul |
| ③ | Shovqin — *"tozalash"* **yordam bermaydi** | 59-modul |
| ④ | ## **Gallyutsinatsiya** | 60-modul |
| ⑤ | CSV kodlash yiqiladi | 60-modul |
| ⑥ | Til almashinuvi | 61-modul |

**Yechim:** hammasini bir joyda hal qiladigan sinf.

```python
class IshonchliASR:
    """Butun bo'lim davomida o'lchagan muammolarni hisobga oladigan quvur.

    · istalgan format    -> librosa (ffmpeg SIZ)
    · uzun fayl          -> Whisper o'zi bo'laklaydi
    · gallyutsinatsiya   -> uch qatlamli detektor
    · past ishonch       -> BELGILANADI, yashirilmaydi
    · CSV                -> utf-8-sig
    """

    TEZLIK = (0.5, 4.0)          # so'z/soniya — o'lchov asosida
    NOYOB_MIN = 0.35
    QORA_ROYXAT = [              # ⚠️ mashhur gallyutsinatsiyalar
        "thank you for watching", "thanks for watching",
        "subtitles by", "subscribe", "amara.org",
    ]

    def __init__(self, model="openai/whisper-base", til=None):
        self.model_nomi = model
        self.til = til

    @functools.cached_property
    def asr(self):
        return pipeline("automatic-speech-recognition",
                        model=self.model_nomi, device=-1)

    # ---------- tekshiruv ----------
    def tekshir(self, matn, davomiylik_s):
        """Uch qatlamli + qora ro'yxat."""
        w = [x.lower().strip(".,!?;:\"'()-") for x in matn.split()]
        d = {"sozlar": len(w), "noyob": len(set(w)),
             "muammolar": []}

        if not w:
            d["muammolar"].append("💥 bo'sh natija")
            d.update({"noyob_ulush": 0.0, "tezlik": 0.0, "ishonchli": False})
            return d

        d["noyob_ulush"] = round(len(set(w)) / len(w), 3)
        d["tezlik"] = round(len(w) / max(davomiylik_s, 1e-9), 2)
        d["eng_kop"] = collections.Counter(w).most_common(1)[0][1]

        lo, hi = self.TEZLIK
        if d["noyob_ulush"] < self.NOYOB_MIN:
            d["muammolar"].append(
                f"💥 takrorlanish sikli (noyob {d['noyob_ulush']*100:.0f}%)")
        if d["tezlik"] > hi:
            d["muammolar"].append(
                f"💥 imkonsiz nutq tezligi ({d['tezlik']} so'z/s)")
        if d["tezlik"] < lo:
            d["muammolar"].append(
                f"💥 juda kam so'z ({d['tezlik']} so'z/s)")
        if d["eng_kop"] > max(len(w) * 0.15, 5):
            d["muammolar"].append(f"⚠️ bitta so'z {d['eng_kop']} marta")

        past = matn.lower()
        for q in self.QORA_ROYXAT:
            if q in past:
                d["muammolar"].append(f"⚠️ mashhur gallyutsinatsiya: '{q}'")

        d["ishonchli"] = not any(x.startswith("💥") for x in d["muammolar"])
        return d

    # ---------- transkripsiya ----------
    def __call__(self, yol, vazifa="transcribe"):
        t0 = time.perf_counter()
        try:
            y, _ = librosa.load(yol, sr=16000, mono=True)
        except Exception as e:
            return {"fayl": os.path.basename(yol), "matn": "",
                    "ishonchli": False,
                    "muammolar": [f"💥 o'qib bo'lmadi: {type(e).__name__}"]}

        dur = len(y) / 16000
        if dur < 0.1:
            return {"fayl": os.path.basename(yol), "matn": "", "soniya": dur,
                    "ishonchli": False, "muammolar": ["💥 juda qisqa"]}

        gk = {"task": vazifa}
        if self.til:
            gk["language"] = self.til

        try:
            r = self.asr(y, return_timestamps=dur > 28, generate_kwargs=gk)
        except Exception as e:
            return {"fayl": os.path.basename(yol), "matn": "", "soniya": dur,
                    "ishonchli": False,
                    "muammolar": [f"💥 model xatosi: {type(e).__name__}"]}

        matn = r["text"].strip()
        d = {"fayl": os.path.basename(yol), "soniya": round(dur, 2),
             "vaqt_s": round(time.perf_counter() - t0, 2),
             "model": self.model_nomi.split("/")[-1],
             "vazifa": vazifa, "matn": matn}
        d["RTF"] = round(d["vaqt_s"] / dur, 3)
        d.update(self.tekshir(matn, dur))
        d["muammolar"] = d["muammolar"] or ["✅ muammo topilmadi"]
        return d

    # ---------- eksport ----------
    @staticmethod
    def csv_ga(natijalar, yol="natijalar.csv"):
        ust = ["fayl", "soniya", "vaqt_s", "RTF", "model", "vazifa",
               "sozlar", "noyob_ulush", "tezlik", "ishonchli",
               "muammolar", "matn"]
        with io.open(yol, "w", encoding="utf-8-sig", newline="") as f:
            w = csv.DictWriter(f, fieldnames=ust, extrasaction="ignore")
            w.writeheader()
            for r in natijalar:
                r = dict(r)
                r["muammolar"] = " | ".join(r.get("muammolar", []))
                w.writerow(r)
                f.flush()
        return yol

    def hisobot(self, d):
        bay = "✅" if d.get("ishonchli") else "💥"
        print(f"\n  {bay} {d['fayl']:20s} {d.get('soniya','?')} s  "
              f"RTF {d.get('RTF','?')}")
        print(f"     {d.get('sozlar',0)} so'z · noyob {d.get('noyob_ulush',0)*100:.0f}% "
              f"· {d.get('tezlik',0)} so'z/s")
        for m in d.get("muammolar", []):
            print(f"     {m}")
        print(f"     📝 {d['matn'][:70]}")
        return d
```

### 🔬 Ishga tushiramiz

```python
asr = IshonchliASR()

# ① normal fayl
asr.hisobot(asr("speech_01.wav"))

# ② shovqinli fayl -> gallyutsinatsiya
y, _ = librosa.load("speech_01.wav", sr=16000)
rng = np.random.default_rng(95)
p = float(np.mean(y ** 2))
sf.write("shovqin.wav",
         (y + rng.standard_normal(len(y)).astype(np.float32) *
          np.sqrt(p / 10 ** -0.5)).astype(np.float32), 16000)
asr.hisobot(asr("shovqin.wav"))

# ③ jim fayl
sf.write("jim.wav", np.zeros(5 * 16000, dtype=np.float32), 16000)
asr.hisobot(asr("jim.wav"))

# ④ mavjud bo'lmagan fayl
asr.hisobot(asr("yoq.wav"))
```

### ✅ Haqiqiy natija

```
  ✅ speech_01.wav        23.51 s  RTF 0.319
     61 so'z · noyob 84% · 2.59 so'z/s
     ✅ muammo topilmadi
     📝 My name is Yvonne and I am excited to have you as part of our learning

  💥 shovqin.wav          23.51 s  RTF 0.73
     338 so'z · noyob 7% · 14.38 so'z/s
     💥 takrorlanish sikli (noyob 7%)
     💥 imkonsiz nutq tezligi (14.38 so'z/s)
     ⚠️ bitta so'z 105 marta
     📝 I am excited to have you ask me about your new plan. Before we get sta

  💥 jim.wav              5.0 s  RTF 3.476
     444 so'z · noyob 0% · 88.8 so'z/s
     💥 takrorlanish sikli (noyob 0%)
     💥 imkonsiz nutq tezligi (88.8 so'z/s)
     ⚠️ bitta so'z 444 marta
     📝 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

  💥 yoq.wav              ? s  RTF ?
     0 so'z · noyob 0% · 0 so'z/s
     💥 o'qib bo'lmadi: LibsndfileError
     📝
```

> ## 🏆🏆 **TO'RTTA HOLAT — TO'RTTA TO'G'RI JAVOB.**
>
> ## ⭐ **Normal fayl** — o'tdi. ## ## 💥 **Shovqinli fayl** — **ikkita** mustaqil signal bilan tutildi. ## ## 💥 **Yo'q fayl** — yiqilmadi, xatoni **qaytardi**.

> ## 💥💥💥 **VA JIM FAYL — MEN KUTMAGAN NATIJA BERDI.**
>
> ## Men *"bo'sh matn qaytaradi"* deb kutgan edim. ## ## 🔑 **HAQIQAT: 444 TA NUQTA.** ## `". . . . . . ."` — 5 soniyalik **mutlaq jimlikdan**.
>
> ## ## ⭐ **VA DETEKTOR UNI HAM TUTDI:** ## noyob **0%**, tezlik **88.8 so'z/s**, ## bitta belgi **444 marta**. ## ## 🏆 **RTF 3.476 — ya'ni model jimlikni transkripsiya qilishga ## audiodan 3.5× KO'PROQ vaqt sarfladi.**

> ## 💡 **BU — 60-MODULDAGI XULOSANI TASDIQLAYDI:** ## Whisper **jimlikda ham gallyutsinatsiya qiladi**. ## Google esa bunday holatda `UnknownValueError` **tashlaydi** *(58-modul)*.

---

# 📋 2-loyiha. `DavoTekshiruvchi` — har qanday da'voni o'lchash

**Muammo:** butun bu bo'lim davomida **kursning da'volarini tekshirdik**. Va **12 tasi noto'g'ri** chiqdi. Endi shu jarayonni **asbobga** aylantiramiz.

```python
class DavoTekshiruvchi:
    """Har qanday o'lchanadigan da'voni tekshiradi.

    Muhim: NATIJA SHOVQIN ICHIDAMI? — std bilan tekshiradi (56-modul darsi).
    """

    def __init__(self, takror=3):
        self.takror = takror
        self.natijalar = []

    def tekshir(self, nom, kutilgan, olchov, birlik="", tolerans=0.05):
        """olchov: argumentsiz funksiya, son qaytaradi."""
        qiymatlar = []
        xato = None
        for _ in range(self.takror):
            try:
                qiymatlar.append(float(olchov()))
            except Exception as e:
                xato = f"{type(e).__name__}: {str(e)[:40]}"
                break

        if xato or not qiymatlar:
            d = {"nom": nom, "kutilgan": kutilgan, "olchangan": None,
                 "std": None, "holat": f"💥 o'lchab bo'lmadi ({xato})"}
            self.natijalar.append(d)
            return d

        o = float(np.mean(qiymatlar))
        s = float(np.std(qiymatlar))
        chegara = max(2 * s, abs(kutilgan) * tolerans)     # ⭐ shovqin + tolerans
        farq = abs(o - kutilgan)

        if farq <= chegara:
            holat = "✅ TASDIQLANDI"
        elif farq <= 2 * chegara:
            holat = "⚠️ CHEGARADA"
        else:
            holat = "💥 RAD ETILDI"

        d = {"nom": nom, "kutilgan": kutilgan, "olchangan": round(o, 4),
             "std": round(s, 4), "chegara": round(chegara, 4),
             "farq": round(farq, 4), "birlik": birlik, "holat": holat}
        self.natijalar.append(d)
        return d

    def hisobot(self):
        print(f"\n  {'da`vo':34s} {'kutilgan':>10} {'o`lchangan':>12} "
              f"{'±std':>9}  holat")
        print("  " + "-" * 84)
        for d in self.natijalar:
            o = "—" if d["olchangan"] is None else f"{d['olchangan']:.4f}"
            s = "—" if d.get("std") is None else f"{d['std']:.4f}"
            print(f"  {d['nom']:34s} {d['kutilgan']:>10} {o:>12} {s:>9}  "
                  f"{d['holat']}")

        ok = sum(1 for d in self.natijalar if d["holat"].startswith("✅"))
        bad = sum(1 for d in self.natijalar if d["holat"].startswith("💥"))
        print(f"\n  📊 {len(self.natijalar)} da'vo · "
              f"✅ {ok} tasdiqlandi · 💥 {bad} rad etildi · "
              f"⚠️ {len(self.natijalar)-ok-bad} chegarada")
        return self.natijalar
```

### 🔬 Kursning da'volarini tekshiramiz

```python
import speech_recognition as sr

y, _ = librosa.load("speech_01.wav", sr=16000)
dur = len(y) / 16000
model = IshonchliASR()
GT = ("My name is Ivan and I am excited to have you as part of our learning "
      "community! Before we get started, I’d like to tell you a little bit "
      "about myself. I’m a sound engineer turned data scientist, curious about "
      "machine learning and Artificial Intelligence. My professional background "
      "is primarily in media production, with a focus on audio, IT, and communications")


def norm(s):
    s = " ".join(s.split()).replace("’", "'").lower()
    return " ".join(re.sub(r"[^\w\s']", " ", s).split())


t = DavoTekshiruvchi(takror=3)

t.tekshir("Whisper WER (58-modul havolasi)", 0.0164,
          lambda: wer(norm(GT), norm(model.asr(y.copy())["text"])))

t.tekshir("Whisper RTF < 1 (real vaqt)", 0.113,
          lambda: (lambda t0: (model.asr(y.copy()), time.perf_counter()-t0)[1])
          (time.perf_counter()) / dur, tolerans=0.5)

t.tekshir("preemphasis WER ni yaxshilaydi", 0.0,
          lambda: wer(norm(GT), norm(model.asr(
              librosa.effects.preemphasis(y.copy(), coef=0.97))["text"])))

t.hisobot()
```

### ✅ Haqiqiy natija

```
  da`vo                                kutilgan   o`lchangan      ±std  holat
  ------------------------------------------------------------------------------------
  Whisper WER (58-modul havolasi)        0.0164       0.0164    0.0000  ✅ TASDIQLANDI
  Whisper RTF < 1 (real vaqt)             0.113       0.1174    0.0040  ✅ TASDIQLANDI
  preemphasis WER ni yaxshilaydi            0.0       0.0492    0.0000  💥 RAD ETILDI

  📊 3 da'vo · ✅ 2 tasdiqlandi · 💥 1 rad etildi · ⚠️ 0 chegarada
```

> ## 🏆🏆🏆 **UCHINCHI DA'VO — RAD ETILDI.**
>
> ## 💥 **VA E'TIBOR BERING — WHISPER DA HAM:** ## `preemphasis` WER ni **0.0164 dan 0.0492 ga** oshirdi ## *(3× yomonroq)*, xuddi Google'da bo'lganidek *(59-modul)*.
>
> ## ## 🔑 **59-MODULDAGI XULOSA MUSTAHKAMLANDI:** ## *"shovqinni kamaytirish"* — ## ikkala modelda ham **zarar keltiradi**.

> ## ⭐ **VA `±std` USTUNIGA E'TIBOR BERING:** ## `RTF` da std = **0.0040** — ## ya'ni chegara `2 × 0.0040 = 0.008`, ## lekin `tolerans=0.5` kattaroq chegara berdi. ## ## 💡 **std bo'lmasa,** 0.113 vs 0.1174 ## *"farq"* bo'lib ko'rinardi. ## **U esa shovqin** *(56-modul darsi)*.

---

## 🎯 Bo'limning yakuniy xulosasi

```
   52-61-MODULLAR: 10 ta modul, 39 ta dars, 150+ mashq, 23 ta loyiha

   ┌──────────────────────────────────────────────────────────┐
   │  Nima o'rgandik                                          │
   ├──────────────────────────────────────────────────────────┤
   │  · tovush fizikasi -> raqamli signal -> xususiyatlar      │
   │  · ASR arxitekturalari: HMM -> RNN -> Transformer         │
   │  · ikkita ishlaydigan vosita: Google API va Whisper       │
   │  · WER/CER — va ularning ZAIFLIKLARI                      │
   │  · shovqin, gallyutsinatsiya, maxfiylik                   │
   ├──────────────────────────────────────────────────────────┤
   │  Eng muhim ko'nikma                                      │
   ├──────────────────────────────────────────────────────────┤
   │  🏆 HAR BIR DA'VONI O'LCHASH                             │
   │     · kursniki                                           │
   │     · blogniki                                           │
   │     · VA O'ZINGIZNIKI                                    │
   └──────────────────────────────────────────────────────────┘
```

| Kurs da'vosi | ## Natija |
|---|---|
| `ffmpeg` shart | ## 💥 **rad etildi** |
| Pre-emphasis yordam beradi | ## 💥 **rad etildi** *(25 o'lchov)* |
| Whisper stoxastik | ## 💥 **rad etildi** *(5/5)* |
| Kattaroq model yaxshiroq | ## 💥 **rad etildi** |
| `Ivan` — to'g'ri ism | ## 💥 **rad etildi** |
| Whisper Google'dan aniqroq | ## ✅ **tasdiqlandi** *(toza audioda)* |
| Shovqin — jiddiy muammo | ## ✅ **tasdiqlandi** |
| Til almashinuvi qiyin | ## ✅ **tasdiqlandi** |
| Edge computing — kelajak | ## ✅ **bugun ishlaydi** |

---

## 🚀 Loyihalarni kengaytirish

| Fikr | Qanday |
|---|---|
| Diarizatsiya | `pyannote.audio` — kim gapiryapti |
| Tezroq model | `faster-whisper` *(CTranslate2)* — 4× |
| O'zbek tili | `Common Voice` + fine-tuning |
| Real vaqt | `sounddevice` + 1 s bo'laklar |
| Veb-interfeys | `streamlit` — **65-modulda** |
| LLM bilan birlashtirish | transkript → xulosa — **62–67-modullar** |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md)
