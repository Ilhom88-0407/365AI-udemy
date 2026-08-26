# 🚀 58-modul. Mini-loyihalar

> **Uchta tayyor loyiha.** Har biri **ishga tushirilgan va tekshirilgan**.
> Kalit **kerak emas** — Google Web Speech API bepul ishlaydi.

---

## 📦 Umumiy importlar

```python
import os, re, io, csv, json, time, tempfile, hashlib
import numpy as np
import soundfile as sf
import librosa
import speech_recognition as sr
from jiwer import wer, cer, process_words
```

---

# 🩺 1-loyiha. `TranskriptorPro` — ishonchli transkripsiya quvuri

**Muammo:** Google API uzun faylni **jimgina kesadi**, MP3 ni **o'qimaydi**, tarmoq **uzilishi mumkin**, va sifat haqida **hech narsa aytmaydi**.

**Yechim:** hammasini hisobga oladigan bitta sinf.

```python
class TranskriptorPro:
    """Har qanday audioni ishonchli transkripsiya qiladi.

    · istalgan format  -> librosa orqali 16 kHz mono WAV
    · uzun fayl        -> 30 s bo'laklarga
    · tarmoq xatosi    -> eksponensial kutish bilan qayta urinish
    · sifat            -> ishonch ballari + ogohlantirishlar
    """

    CHASTOTA = 16000        # Google baribir shunga tushiradi
    BOLAK = 30.0            # soniya
    PAST_ISHONCH = 0.75

    def __init__(self, til="en-US", urinish=3, kutish=1.5):
        self.til = til
        self.urinish = urinish
        self.kutish = kutish
        self.rec = sr.Recognizer()

    # ---------- ichki ----------
    def _wav(self, yol):
        """Istalgan formatni 16 kHz mono PCM_16 WAV ga aylantiradi."""
        y, _ = librosa.load(yol, sr=self.CHASTOTA, mono=True)
        fd, vaqt = tempfile.mkstemp(suffix=".wav")
        os.close(fd)
        sf.write(vaqt, y, self.CHASTOTA, subtype="PCM_16")
        return vaqt, len(y) / self.CHASTOTA, y

    def _bolak(self, audio, raqam):
        """Bitta bo'lakni qayta urinish bilan yuboradi."""
        b = {"raqam": raqam, "matn": "", "ishonch": None,
             "variantlar": 0, "holat": ""}
        for u in range(self.urinish):
            try:
                r = self.rec.recognize_google(audio, language=self.til,
                                              show_all=True)
                if not r:                                   # bo'sh = nutq yo'q
                    b["holat"] = "nutq yo'q"
                    return b
                eng = r["alternative"][0]
                b["matn"] = eng["transcript"]
                b["ishonch"] = round(eng.get("confidence", float("nan")), 4)
                b["variantlar"] = len(r["alternative"])
                b["holat"] = "ok"
                return b
            except sr.UnknownValueError:
                b["holat"] = "nutq yo'q"
                return b
            except sr.RequestError as e:
                b["holat"] = f"tarmoq: {str(e)[:40]}"
                if u < self.urinish - 1:
                    time.sleep(self.kutish * (2 ** u))      # 1.5 · 3 · 6 s
        return b

    # ---------- ochiq ----------
    def transkripsiya(self, yol):
        t0 = time.perf_counter()
        wav, davomiylik, y = self._wav(yol)
        n = {"fayl": os.path.basename(yol), "davomiylik": round(davomiylik, 2),
             "bolaklar": [], "matn": "", "ogohlantirish": []}
        try:
            with sr.AudioFile(wav) as manba:
                i = 0
                while True:
                    audio = self.rec.record(manba, duration=self.BOLAK)
                    if len(audio.frame_data) == 0:
                        break
                    i += 1
                    n["bolaklar"].append(self._bolak(audio, i))
        finally:
            os.remove(wav)                                  # ⭐ har doim

        n["matn"] = " ".join(b["matn"] for b in n["bolaklar"] if b["matn"]).strip()
        n["so_zlar"] = len(n["matn"].split())
        n["vaqt"] = round(time.perf_counter() - t0, 2)
        n["tezlik"] = round(davomiylik / n["vaqt"], 2) if n["vaqt"] else 0.0

        # --- audio sifati ---
        rms = float(np.sqrt(np.mean(y ** 2)))
        n["RMS_dBFS"] = round(20 * np.log10(rms + 1e-12), 2)
        n["clipping"] = int((np.abs(y) >= 0.999).sum())

        # --- ogohlantirishlar ---
        bosh = [b["raqam"] for b in n["bolaklar"] if not b["matn"]]
        if bosh:
            n["ogohlantirish"].append(f"⚠️ bo'sh bo'laklar: {bosh}")
        past = [b["raqam"] for b in n["bolaklar"]
                if b["ishonch"] is not None and b["ishonch"] < self.PAST_ISHONCH]
        if past:
            n["ogohlantirish"].append(f"⚠️ ishonch past: {past}")
        tarm = [b["raqam"] for b in n["bolaklar"] if b["holat"].startswith("tarmoq")]
        if tarm:
            n["ogohlantirish"].append(f"💥 tarmoq muammosi: {tarm}")
        if n["clipping"]:
            n["ogohlantirish"].append(f"⚠️ clipping: {n['clipping']} namuna")
        if n["RMS_dBFS"] < -35:
            n["ogohlantirish"].append(f"⚠️ juda jim: {n['RMS_dBFS']} dBFS")
        if not n["matn"]:
            n["ogohlantirish"].append("💥 hech qanday matn olinmadi")
        n["ogohlantirish"] = n["ogohlantirish"] or ["✅ muammo yo'q"]
        return n

    def hisobot(self, n):
        print(f"\n{'='*66}")
        print(f"  📄 {n['fayl']}   {n['davomiylik']} s")
        print(f"{'='*66}")
        print(f"  bo'laklar : {len(n['bolaklar'])}")
        print(f"  so'zlar   : {n['so_zlar']}")
        print(f"  vaqt      : {n['vaqt']} s   ({n['tezlik']}× real vaqt)")
        print(f"  RMS       : {n['RMS_dBFS']} dBFS   clipping: {n['clipping']}")
        print(f"\n  {'#':>3} {'ishonch':>8} {'var':>4}  holat")
        for b in n["bolaklar"]:
            isb = f"{b['ishonch']:.4f}" if b["ishonch"] is not None else "—"
            bay = "⚠️" if (b["ishonch"] or 1) < self.PAST_ISHONCH else "  "
            print(f"  {b['raqam']:>3} {isb:>8} {b['variantlar']:>4}  {bay} {b['holat']}")
        print()
        for o in n["ogohlantirish"]:
            print(f"  {o}")
        print(f"\n  📝 {n['matn'][:200]}")
        return n
```

### 🔬 Ishga tushiramiz

```python
t = TranskriptorPro()
n1 = t.hisobot(t.transkripsiya("speech_01.wav"))
```

### ✅ Haqiqiy natija

```
==================================================================
  📄 speech_01.wav   23.51 s
==================================================================
  bo'laklar : 1
  so'zlar   : 61
  vaqt      : 5.71 s   (4.12× real vaqt)
  RMS       : -20.87 dBFS   clipping: 0

    #  ishonch  var  holat
    1   0.8357    5     ok

  ✅ muammo yo'q

  📝 my name is Yvonne and I am excited to have you as part of our Learning Community before we get started I'd like to tell you a little bit about myself I'm a sound engineer turn data scientist curious a
```

### 🔬 Endi — uzun fayl

```python
y, s = librosa.load("speech_01.wav", sr=16000)
sf.write("uzun_3x.wav", np.tile(y, 3), s)          # 70.5 s
n2 = t.hisobot(t.transkripsiya("uzun_3x.wav"))
```

```
==================================================================
  📄 uzun_3x.wav   70.54 s
==================================================================
  bo'laklar : 3
  so'zlar   : 133
  vaqt      : 14.66 s   (4.81× real vaqt)
  RMS       : -20.87 dBFS   clipping: 0

    #  ishonch  var  holat
    1   0.8037    5     ok
    2   0.5586    5  ⚠️ ok
    3   0.7655    5     ok

  ⚠️ ishonch past: [2]

  📝 my name is Yvonne and I am excited to have you as part of our Learning Community before we get started I'd like to tell you a little bit about myself I'm a sound engineer turn data scientist curious a
```

> ## 🏆🏆 **62 SO'Z → 133 SO'Z.** ## Butun holda yuborilganda Google **62 ta so'z** qaytargan edi. ## Bo'laklab — **133 ta**, ya'ni **2.1×**.
>
> ## ⭐ **VA SINF 2-BO'LAKNI O'ZI BELGILADI:** ## ishonch **0.5586** — bo'lak chegarasida so'z kesilgani ## ballarda **ko'rinib turibdi**. ## ## 💡 59-modulda buni **jimlik bo'yicha** kesish bilan tuzatamiz.

---

# 📊 2-loyiha. `BahoLab` — halol WER/CER hisoboti

**Muammo:** `wer(gt, hyp)` bitta raqam beradi — va bu raqam **normallashtirishga qarab 10× o'zgaradi**.

**Yechim:** har bir qadamning narxini ko'rsatadigan hisobot.

```python
class BahoLab:
    """WER/CER ni halol, tushuntirib beradigan baholovchi."""

    QADAMLAR = [
        ("xom",              dict()),
        ("+ probel/\\n",      dict(ws=1)),
        ("+ apostrof",       dict(ws=1, apos=1)),
        ("+ kichik harf",    dict(ws=1, apos=1, lower=1)),
        ("+ tinish belgisi", dict(ws=1, apos=1, lower=1, punct=1)),
    ]

    @staticmethod
    def norm(s, ws=0, apos=0, lower=0, punct=0):
        if ws:
            s = " ".join(s.split())
        if apos:
            for a, b in [("’", "'"), ("‘", "'"), ("“", '"'), ("”", '"'),
                         ("–", "-"), ("—", "-")]:
                s = s.replace(a, b)
        if lower:
            s = s.lower()
        if punct:
            s = " ".join(re.sub(r"[^\w\s']", " ", s).split())
        return s

    @classmethod
    def havola_oqi(cls, yol):
        """Kurs uslubidagi ground_truth.txt ni to'g'ri o'qiydi."""
        raw = io.open(yol, "rb").read()
        for kod in ["utf-8", "cp1252", "latin-1"]:
            try:
                t = raw.decode(kod)
                break
            except UnicodeDecodeError:
                continue
        t = t.strip()
        if t.startswith('"""') and t.endswith('"""'):    # ⭐ Python qoldig'i
            t = t[3:-3]
        return " ".join(t.split()), kod

    def baho(self, havola, gipoteza, kalitlar=None):
        r = {"zanjir": [], "so_zlar": len(havola.split())}

        for nom, kw in self.QADAMLAR:
            h, g = self.norm(havola, **kw), self.norm(gipoteza, **kw)
            o = process_words(h, g)
            r["zanjir"].append({
                "qadam": nom, "WER": round(o.wer, 4), "CER": round(cer(h, g), 4),
                "MER": round(o.mer, 4), "S": o.substitutions,
                "I": o.insertions, "D": o.deletions, "H": o.hits,
                "tokenlar": len(o.references[0]),
            })

        oxir = self.norm(havola, 1, 1, 1, 1), self.norm(gipoteza, 1, 1, 1, 1)
        o = process_words(*oxir)
        r["xatolar"] = [{
            "tur": ch.type,
            "havola": " ".join(o.references[0][ch.ref_start_idx:ch.ref_end_idx]),
            "gipoteza": " ".join(o.hypotheses[0][ch.hyp_start_idx:ch.hyp_end_idx]),
        } for ch in o.alignments[0] if ch.type != "equal"]

        x0, x4 = r["zanjir"][0]["WER"], r["zanjir"][-1]["WER"]
        r["format_ulushi"] = round((x0 - x4) / x0, 3) if x0 else 0.0
        r["yaxshilanish"] = round(x0 / x4, 1) if x4 else float("inf")

        if kalitlar:
            g = self.norm(gipoteza, 1, 1, 1, 1)
            top = [k for k in kalitlar if self.norm(k, 1, 1, 1, 1) in g]
            r["kalit_recall"] = round(len(top) / len(kalitlar), 3)
            r["kalit_yo_q"] = [k for k in kalitlar if k not in top]
        return r

    def hisobot(self, r):
        print(f"\n{'='*70}")
        print(f"  📊 BAHO HISOBOTI   ({r['so_zlar']} so'zli havola)")
        print(f"{'='*70}")
        print(f"  {'qadam':18s} {'tokenlar':>8} {'WER':>8} {'CER':>8} {'MER':>8}  S/I/D")
        print(f"  {'-'*64}")
        for z in r["zanjir"]:
            print(f"  {z['qadam']:18s} {z['tokenlar']:>8} {z['WER']:>8.4f} "
                  f"{z['CER']:>8.4f} {z['MER']:>8.4f}  {z['S']}/{z['I']}/{z['D']}")
        print(f"\n  🏆 yaxshilanish   : {r['yaxshilanish']}×")
        print(f"  🔑 format ulushi  : {r['format_ulushi']*100:.1f}% "
              f"(xatolarning shuncha qismi FORMAT edi)")
        if "kalit_recall" in r:
            print(f"  ⭐ kalit so'zlar  : {r['kalit_recall']*100:.0f}%"
                  f"{'  yo`q: ' + str(r['kalit_yo_q']) if r['kalit_yo_q'] else ''}")
        print(f"\n  💥 HAQIQIY XATOLAR ({len(r['xatolar'])} ta):")
        for x in r["xatolar"]:
            print(f"     {x['tur']:10s} {x['havola']!r} -> {x['gipoteza']!r}")
        return r
```

### 🔬 Ishga tushiramiz

```python
lab = BahoLab()
GT, kod = lab.havola_oqi("ground_truth.txt")
print(f"havola {kod} kodlashda o'qildi · {len(GT.split())} so'z")

r = lab.hisobot(lab.baho(GT, n1["matn"],
                kalitlar=["machine learning", "artificial intelligence",
                          "sound engineer", "media production"]))
```

### ✅ Haqiqiy natija

```
havola cp1252 kodlashda o'qildi · 61 so'z

======================================================================
  📊 BAHO HISOBOTI   (61 so'zli havola)
======================================================================
  qadam              tokenlar      WER      CER      MER  S/I/D
  ----------------------------------------------------------------
  xom                      61   0.2951   0.0720   0.2951  18/0/0
  + probel/\n              61   0.2951   0.0720   0.2951  18/0/0
  + apostrof               61   0.2623   0.0665   0.2623  16/0/0
  + kichik harf            61   0.1639   0.0388   0.1639  10/0/0
  + tinish belgisi         61   0.0328   0.0170   0.0328  2/0/0

  🏆 yaxshilanish   : 9.0×
  🔑 format ulushi  : 88.9% (xatolarning shuncha qismi FORMAT edi)
  ⭐ kalit so'zlar  : 100%

  💥 HAQIQIY XATOLAR (2 ta):
     substitute 'ivan' -> 'yvonne'
     substitute 'turned' -> 'turn'
```

> ## ⭐ **E'TIBOR BERING:** `havola_oqi()` `\n` larni **allaqachon tozalagan**, ## shuning uchun 1-qadam **hech narsani o'zgartirmadi** (0.2951 = 0.2951). ## ## 🏆 **BU — TO'G'RI ISH:** muammo **manbada** hal qilindi, ## metrikada emas.
>
> ## 💡 Kursning **0.3390** raqami — `"""..."""` ichidagi ## **tozalanmagan** matndan kelib chiqqan.

---

# 📦 3-loyiha. `PaketTranskriptor` — papkani CSV ga

**Muammo:** 50 ta faylni transkripsiya qilish kerak. Ba'zilari MP3, ba'zilari uzun, ba'zilarida nutq yo'q. Va natija **jadval** bo'lishi kerak.

```python
class PaketTranskriptor:
    """Papkadagi barcha audio fayllarni transkripsiya qilib CSV ga yozadi."""

    KENGAYTMALAR = {".wav", ".flac", ".mp3", ".ogg", ".aiff", ".aif", ".m4a"}

    def __init__(self, til="en-US"):
        self.t = TranskriptorPro(til=til)

    def _fayllar(self, papka):
        return sorted(
            os.path.join(papka, f) for f in os.listdir(papka)
            if os.path.splitext(f)[1].lower() in self.KENGAYTMALAR
        )

    def ishla(self, papka, csv_yol="transkriptlar.csv", havolalar=None):
        """havolalar: {"fayl.wav": "ground truth matni"} — ixtiyoriy."""
        lab = BahoLab()
        qatorlar, xatolar = [], 0

        fayllar = self._fayllar(papka)
        print(f"📂 {papka}: {len(fayllar)} ta fayl\n")

        for i, yol in enumerate(fayllar, 1):
            nom = os.path.basename(yol)
            print(f"  [{i}/{len(fayllar)}] {nom:24s} ", end="", flush=True)
            try:
                n = self.t.transkripsiya(yol)
            except Exception as e:                       # ⚠️ bitta fayl butun ishni to'xtatmasin
                print(f"💥 {type(e).__name__}")
                qatorlar.append({"fayl": nom, "holat": f"XATO: {type(e).__name__}"})
                xatolar += 1
                continue

            q = {
                "fayl": nom,
                "davomiylik_s": n["davomiylik"],
                "bolaklar": len(n["bolaklar"]),
                "so_zlar": n["so_zlar"],
                "vaqt_s": n["vaqt"],
                "tezlik_x": n["tezlik"],
                "RMS_dBFS": n["RMS_dBFS"],
                "ishonch_ort": round(np.mean([b["ishonch"] for b in n["bolaklar"]
                                              if b["ishonch"] is not None]), 4)
                if any(b["ishonch"] is not None for b in n["bolaklar"]) else "",
                "ogohlantirish": " | ".join(n["ogohlantirish"]),
                "matn": n["matn"],
            }

            if havolalar and nom in havolalar:           # ⭐ baholash ham
                b = lab.baho(havolalar[nom], n["matn"])
                q["WER_xom"] = b["zanjir"][0]["WER"]
                q["WER_toza"] = b["zanjir"][-1]["WER"]
                q["format_ulushi"] = b["format_ulushi"]

            qatorlar.append(q)
            print(f"✅ {n['so_zlar']:4d} so'z  {n['vaqt']:5.1f} s  "
                  f"{n['ogohlantirish'][0][:28]}")

        # --- CSV ---
        maydonlar = []
        for q in qatorlar:
            for k in q:
                if k not in maydonlar:
                    maydonlar.append(k)
        with io.open(csv_yol, "w", encoding="utf-8-sig", newline="") as f:
            w = csv.DictWriter(f, fieldnames=maydonlar)
            w.writeheader()
            w.writerows(qatorlar)

        jami = sum(q.get("davomiylik_s", 0) for q in qatorlar)
        vaqt = sum(q.get("vaqt_s", 0) for q in qatorlar)
        print(f"\n{'='*66}")
        print(f"  📊 {len(qatorlar)} fayl · {jami:.1f} s audio · {vaqt:.1f} s ishlov")
        print(f"  💾 {csv_yol}  ({len(maydonlar)} ustun)")
        print(f"  {'💥 ' + str(xatolar) + ' xato' if xatolar else '✅ xatosiz'}")
        return qatorlar
```

### 🔬 Ishga tushiramiz

```python
os.makedirs("paket", exist_ok=True)
y, s = librosa.load("speech_01.wav", sr=16000)

sf.write("paket/a_qisqa.wav", y[:8*s], s)               # 8 s
sf.write("paket/b_mp3.mp3", y[:10*s], s)                # ⭐ MP3
sf.write("paket/c_uzun.wav", np.tile(y, 2), s)          # 47 s -> 2 bo'lak
sf.write("paket/d_jim.wav", np.zeros(4*s, "float32"), s)  # ⚠️ nutq yo'q

p = PaketTranskriptor()
q = p.ishla("paket", "transkriptlar.csv")
```

### ✅ Haqiqiy natija

```
📂 paket: 4 ta fayl

  [1/4] a_qisqa.wav              ✅   24 so'z    1.9 s  ✅ muammo yo'q
  [2/4] b_mp3.mp3                ✅   31 so'z    2.1 s  ✅ muammo yo'q
  [3/4] c_uzun.wav               ✅   84 so'z    9.8 s  ✅ muammo yo'q
  [4/4] d_jim.wav                ✅    0 so'z    0.6 s  ⚠️ bo'sh bo'laklar: [1]

==================================================================
  📊 4 fayl · 69.0 s audio · 14.4 s ishlov
  💾 transkriptlar.csv  (10 ustun)
  ✅ xatosiz
```

> ## ✅ **MP3 ISHLADI** — `librosa` avtomatik aylantirdi.
> ## ✅ **UZUN FAYL BO'LAKLANDI** — 2 ta bo'lak, 84 so'z.
> ## ✅ **JIM FAYL YIQILMADI** — ogohlantirish bilan o'tdi.
> ## ⭐ **69.0 s audio 14.4 s da** — **4.8× real vaqtdan tez**.

> ## ⚠️ **RAQAMLARINGIZ BIROZ BOSHQACHA CHIQADI.** ## Ishonch ballari va vaqt — **serverga bog'liq**: ## `c_uzun.wav` bir ishga tushirishda `⚠️ ishonch past: [2]` bergan, ## keyingisida — `✅ muammo yo'q`. ## ## ⭐ **So'zlar soni va bo'laklar soni esa barqaror.**

### 📄 CSV ni o'qish

```python
import csv
with io.open("transkriptlar.csv", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        print(f"{r['fayl']:14s} {r['so_zlar']:>3} so'z  "
              f"ishonch {r['ishonch_ort'] or '—':>6}  {r['ogohlantirish'][:30]}")
```

```
a_qisqa.wav     24 so'z  ishonch  0.948  ✅ muammo yo'q
b_mp3.mp3       31 so'z  ishonch 0.9767  ✅ muammo yo'q
c_uzun.wav      84 so'z  ishonch 0.8306  ✅ muammo yo'q
d_jim.wav        0 so'z  ishonch      —  ⚠️ bo'sh bo'laklar: [1] | ⚠️ j
```

> ## 💡 **`encoding="utf-8-sig"` NEGA?** ## Excel BOM siz UTF-8 CSV ni **cp1251** deb o'qiydi ## va o'zbekcha `'` belgilarini **buzadi**. ## `utf-8-sig` — BOM qo'shadi, Excel to'g'ri ochadi.

---

## 🎯 Loyihalarni kengaytirish

| Fikr | Qanday |
|---|---|
| Jimlik bo'yicha kesish | `librosa.effects.split()` — **59-modul** |
| Shovqinni kamaytirish | spektral ayirish — **59-modul** |
| Mahalliy model *(internetsiz)* | Whisper — **60-modul** |
| Ikkita modelni taqqoslash | `BahoLab` ni ikkala transkriptga qo'llang |
| Parallel ishlov | `concurrent.futures.ThreadPoolExecutor` *(API — I/O)* |
| Progress bar | `tqdm` |

---

🏠 [Modul](README.md) · 📝 [Mashqlar](MASHQLAR.md)
