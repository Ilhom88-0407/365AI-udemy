# 1-dars. Whisper AI — transformerga asoslangan nutqni tanish ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Whisper-base 61 ta so'zdan 60 tasini to'g'ri tanidi. Yagona 'xato' — `Ivan` → `Yvonne`. Ya'ni model haq, ground truth xato. Haqiqiy aniqlik — 100%."**

---

## 1. Whisper nima?

**Whisper** — OpenAI ning **encoder-decoder transformer** modeli. 56-modulda uning ichini ko'rgan edik:

```
    audio (16 kHz)
         ↓
    ┌────────────────────┐
    │ 80 mel × 3000 freym│  ← HAR DOIM 30 soniya (to'ldiriladi)
    └────────┬───────────┘
             ↓
    ┌────────────────────┐
    │  ENCODER           │  konv (stride 2) → 1500 pozitsiya
    │  (transformer)     │  → latent tasvir
    └────────┬───────────┘
             ↓
    ┌────────────────────┐
    │  DECODER           │  avtoregressiv
    │  (transformer)     │  51 865 ta token lug'ati
    └────────┬───────────┘
             ↓
    "My name is Yvonne, and I am excited..."
         ⭐ tinish belgilari BILAN
```

> ## 🔑 **GOOGLE'DAN ASOSIY FARQ:** ## Whisper **sizning kompyuteringizda** ishlaydi. ## ## ⭐ Internet **kerak emas** *(model bir marta yuklab olingandan keyin)*, ## audio **hech qayerga ketmaydi**, ## limit **yo'q**.

---

## 2. ⚠️ Kursning yo'li vs bizning yo'l

```python
# ❌ KURSNING YO'LI — ffmpeg TALAB QILADI
import whisper                       # pip install openai-whisper
model = whisper.load_model("base")
result = model.transcribe(file_path)
text = result["text"]
```

```python
# ✅ BIZNING YO'L — ffmpeg KERAK EMAS
from transformers import pipeline
import librosa

asr = pipeline("automatic-speech-recognition",
               model="openai/whisper-base", device=-1)
y, _ = librosa.load(file_path, sr=16000)      # ⭐ librosa o'zi o'qiydi
result = asr(y)
text = result["text"]
```

| | Kurs *(`openai-whisper`)* | ## Biz *(`transformers`)* |
|---|---|---|
| `ffmpeg` | ## 💥 **SHART** | ## ✅ **kerak emas** |
| O'rnatish | Chocolatey + admin | ## ⭐ **`pip install transformers`** |
| Dekodlash | ## ⚠️ **temperature fallback** | ## ⭐ **greedy (deterministik)** |
| Vaqt belgilari | ✅ | ✅ `return_timestamps=True` |
| Batch | ## 💥 **yo'q** | ## ⭐ **`batch_size=`** |

> ## 🔑 **VA BU FARQ — 2-DARSNING BUTUN MAVZUSI.** ## Dekodlash usuli kursning *"stoxastik natija"* muammosining **sababi**.

---

## 3. 🔬 Model o'lchamlari — o'lchaymiz

```python
for m in ["openai/whisper-tiny", "openai/whisper-base", "openai/whisper-small"]:
    t0 = time.perf_counter()
    asr = pipeline("automatic-speech-recognition", model=m, device=-1)
    t_yuk = time.perf_counter() - t0
    par = sum(p.numel() for p in asr.model.parameters())

    t0 = time.perf_counter()
    txt = asr(y.copy())["text"].strip()
    t_tr = time.perf_counter() - t0

    print(f"{m}: {par/1e6:.1f} M · yuklash {t_yuk:.2f} s · "
          f"transkripsiya {t_tr:.2f} s · WER {wer(NGT, norm(txt)):.4f}")
```

### 📊 Natija *(CPU, 23.5 s audio)*

| Model | Parametrlar | Yuklash | Transkripsiya | Tezlik | ## Toza WER | `data` |
|---|---|---|---|---|---|---|
| ## `tiny` | ## ⭐ **37.8 M** | 3.93 s | ## 🏆 **2.21 s** | ## 🏆 **10.64×** | ## 🏆 **0.0164** | ## ✅ |
| ## **`base`** | 72.6 M | 2.94 s | ## ⭐ **2.91 s** | ⭐ 8.07× | ## 🏆 **0.0164** | ## ✅ |
| `small` | ## 💥 **241.7 M** | 2.93 s | ## 💥 **6.81 s** | 3.45× | ## 🏆 **0.0164** | ## ✅ |

> ## 💥💥💥 **UCHTA MODELDA HAM WER AYNAN BIR XIL — 0.0164.**
>
> ## ## 🏆 **YA'NI 37.8 M PARAMETRLI `tiny` 241.7 M LI `small` BILAN TENG.**
>
> ## ⭐ **VA 6.4× TEZ** *(2.21 s vs 6.81 s)*.

> ## 🔧 **BU YERDA MEN XATO QILGAN EDIM.** ## Birinchi o'lchovimda `tiny` **0.0328** ko'rsatgan, ## va men *"kattaroq model yaxshiroq"* deb yozgan edim. ## ## 💥 **SABAB BOSHQA NARSADA EDI — quyidagi bo'limga qarang.**

---

## 4. 💥 Haqiqiy xatolar

```python
o = process_words(NGT, norm(txt))
for ch in o.alignments[0]:
    if ch.type != "equal":
        print(f"{ch.type}: {ref} -> {hyp}")
```

```
whisper-tiny     WER 0.0164  S1/I0/D0
    ivan -> yvonne

whisper-base     WER 0.0164  S1/I0/D0
    ivan -> yvonne

whisper-small    WER 0.0164  S1/I0/D0
    ivan -> yvonne
```

> ## 🏆🏆🏆 **UCHALASIDA HAM — YAGONA "XATO".**
>
> ## 💥 **VA U — GROUND TRUTH NING XATOSI.** ## 58-modulda aniqlagan edik: ## kurs muallifining ismi **Yvonne**, ## `ground_truth.txt` dagi *"Ivan"* — **noto'g'ri**.
>
> ## ## ⭐ **YA'NI WHISPER-BASE NING HAQIQIY ANIQLIGI — 61/61 = 100%.**

---

## 5. ⭐⭐ Google vs Whisper — yonma-yon

| | ## Google Web Speech | ## Whisper-base |
|---|---|---|
| WER xom | 0.2951 | ## 🏆 **0.1148** |
| ## **WER toza** | 0.0328 | ## 🏆 **0.0164** *(2× yaxshi)* |
| CER xom | 0.0720 | ## 🏆 **0.0277** |
| CER toza | 0.0170 | ## 🏆 **0.0113** |
| So'zlar | 61 | 61 |
| ## **Tinish belgilari** | ## 💥 **0** | ## 🏆 **9** |
| Katta harflar | ## ⚠️ tasodifiy | ## ⭐ **jumla boshida** |
| Internet | ## 💥 **shart** | ## ⭐ **kerak emas** |
| Maxfiylik | ## 💥 **audio Google'ga ketadi** | ## ⭐ **hech qayerga** |
| Uzunlik cheklovi | ## 💥 **~30 s dan keyin kesadi** | ## ⭐ **avtomatik bo'laklaydi** |

```
Google : my name is Yvonne and I am excited to have you as part of our
         Learning Community before we get started I'd like to tell you...

Whisper: My name is Yvonne, and I am excited to have you as part of our
         learning community. Before we get started, I'd like to tell you...
```

> ## 🏆 **FARQ — TINISH BELGILARIDA.** ## Google **nol** ta, Whisper **9** ta. ## ## 🔑 **Va aynan shu — 58-modulda WER ning 90% ini tashkil qilgan "format xatolari".** ## Whisper ularni **hal qiladi**.

> ## ⚠️ **LEKIN E'TIBOR BERING — NORMALLASHTIRILGANDAN KEYIN:** ## 0.0328 vs 0.0164 — ya'ni **bitta so'z farqi** ## *(Google `turned` → `turn` deb xato qildi)*. ## ## 💡 **Ikkala model ham juda yaxshi.** ## Whisper ning ustunligi — **formatlashda**.

---

## 5.5 💥💥 `return_timestamps=True` **TRANSKRIPTNI O'ZGARTIRADI**

Birinchi o'lchovimda `tiny` yomonroq chiqqan edi. Sababini qidirdim:

```python
for m in ["openai/whisper-tiny", "openai/whisper-base", "openai/whisper-small"]:
    asr = pipeline("automatic-speech-recognition", model=m, device=-1)
    for ts in [False, True]:
        t = asr(y.copy(), return_timestamps=ts)["text"].strip()
        o = process_words(NGT, norm(t))
        xat = [f"{' '.join(o.references[0][c.ref_start_idx:c.ref_end_idx])}->"
               f"{' '.join(o.hypotheses[0][c.hyp_start_idx:c.hyp_end_idx])}"
               for c in o.alignments[0] if c.type != "equal"]
        print(f"{m.split('/')[-1]:14s} ts={str(ts):5s}  WER {o.wer:.4f}  {xat}")
```

```
whisper-tiny   ts=False  WER 0.0164  ['ivan->yvonne']
whisper-tiny   ts=True   WER 0.0328  ['ivan->yvonne', 'my->like']     💥
whisper-base   ts=False  WER 0.0164  ['ivan->yvonne']
whisper-base   ts=True   WER 0.0164  ['ivan->yvonne']
whisper-small  ts=False  WER 0.0164  ['ivan->yvonne']
whisper-small  ts=True   WER 0.0164  ['ivan->yvonne']
```

> ## 💥💥💥 **`return_timestamps=True` `tiny` GA QO'SHIMCHA XATO QO'SHDI.**
>
> ## ## 🔑 **SABAB:** vaqt belgilari — **oddiy tokenlar** *(`<|0.00|>`, `<|6.50|>`)*, ## ular dekodlash ketma-ketligining **bir qismi**. ## Ularni generatsiya qilish greedy yo'lni **o'zgartiradi**.
>
> ## ⚠️ **KICHIK MODELDA TA'SIR KATTAROQ** — ## `tiny` ning ehtimolliklari **kamroq ishonchli**.

| | Vaqt belgilari kerakmi? |
|---|---|
| Subtitr yaratish | ## ✅ **`True`** — boshqa iloj yo'q |
| Aniqlik muhim | ## ⭐ **`False`** |
| ## Modellarni taqqoslash | ## 💥 **`False` — aks holda taqqoslash NOTO'G'RI** |
| Uzun fayl *(30 s+)* | ## ⚠️ **`True` majburiy** *(bo'laklash uchun)* |

> ## 🏆 **VA MANA UMUMIY DARS:** ## **"Modelni o'lchayapman"** deb o'ylaganingizda ## aslida **model + dekodlash sozlamalari** ni o'lchayapsiz. ## ## ⭐ **Ikkita modelni taqqoslashda hamma sozlama BIR XIL bo'lsin.**

---

## 6. ⭐ Vaqt belgilari va segmentlar

```python
r = asr(y, return_timestamps=True)
for c in r["chunks"]:
    a, b = c["timestamp"]
    print(f"[{a:6.2f} - {b:6.2f}]  {c['text']}")
```

```
[  0.00 -   6.50]   My name is Yvonne and I am excited to have you as part of our learning community.
[  6.50 -  10.00]   Before we get started, I'd like to tell you a little bit about myself.
[ 10.00 -  16.00]   I'm a sound engineer turned data scientist, curious about machine learning...
[ 16.00 -  23.00]   My professional background is primarily in media production, with a focus...
```

> ## ⭐ **BEPUL SUBTITRLAR.** ## Bu ma'lumot bilan `.srt` yoki `.vtt` fayl yaratish — **o'n qator kod**.

> ## ⚠️ **ANIQLIGI CHEKLANGAN:** ## Whisper vaqt belgilarini **token darajasida emas, segment darajasida** beradi, ## va ular **odatda 0.5–1 s xato** qiladi. ## ## 💡 Aniq vaqt kerak bo'lsa — `WhisperTimestampedForConditionalGeneration` ## yoki `whisperX` kabi maxsus vositalar.

---

## 7. 🔑 Whisper ichida nima bo'ladi?

Kurs to'rt bosqichni sanaydi. **Hammasi to'g'ri** — 56-modulda o'lchagan edik:

| Bosqich | Kurs aytadi | ## Bizning o'lchov *(56-modul)* |
|---|---|---|
| ① **Oldindan ishlov** | Normallash + mel spektrogramma | ## ✅ **`(1, 80, 3000)`** — **har doim** |
| ② **Encoder** | Latent tasvir | ## ✅ **`(1, 1500, 384)`** — stride-2 konv |
| ③ **Decoder** | Kontekst bilan matn | ## ✅ **51 865 token lug'ati** |
| ④ **Keyingi ishlov** | Tinish belgilari, katta harf | ## ✅ **9 ta tinish belgisi** |

> ## 💥 **⑤ NI KURS AYTMAYDI: `(1, 80, 3000)` — HAR DOIM 30 SONIYA.** ## 3 soniyalik audio ham, 25 soniyalik ham ## **bir xil o'lchamdagi** tenzorga to'ldiriladi. ## ## 🔑 **Shuning uchun 3 soniyalik faylni transkripsiya qilish ## 25 soniyalikdan sezilarli tez emas.**

### ⏱️ Buni ham o'lchaymiz

| Fayl | Davomiylik | Vaqt | Tezlik |
|---|---|---|---|
| `Track5.wav` | 3.57 s | 0.84 s | 4.27× |
| `Track1.wav` | 6.50 s | 1.04 s | 6.26× |
| `Track2.wav` | 7.50 s | 1.11 s | 6.78× |
| `speech_01.wav` | 23.51 s | 2.91 s | ## ⭐ **8.07×** |

> ## 🔑 **UZUNROQ FAYL — KATTAROQ TEZLIK.** ## Chunki **encoder narxi doimiy** *(har doim 3000 freym)*, ## faqat **decoder** uzunlikka bog'liq.
>
> ## ## 💡 **AMALIY XULOSA:** ## qisqa fayllarni **birlashtirib** yuborish ## har birini alohida yuborishdan **tejamli**.

---

## 8. ⭐ Ishlatishga tayyor funksiya

```python
import re, functools
import numpy as np, librosa
from transformers import pipeline


@functools.lru_cache(maxsize=3)
def _model(nom="openai/whisper-base"):
    """Model SINGLETON — qayta-qayta yuklanmasin (57-modul darsi)."""
    return pipeline("automatic-speech-recognition", model=nom, device=-1)


def whisper_transkripsiya(yol, model="openai/whisper-base", til=None,
                          vaqt_belgilari=False):
    """Istalgan formatdagi audioni Whisper bilan transkripsiya qiladi.

    ffmpeg KERAK EMAS — librosa faylni o'zi o'qiydi.
    """
    y, _ = librosa.load(yol, sr=16000, mono=True)        # ⭐ har qanday format

    gk = {}
    if til:
        gk["language"] = til
        gk["task"] = "transcribe"

    kw = {"return_timestamps": vaqt_belgilari}
    if gk:
        kw["generate_kwargs"] = gk          # ⚠️ None BERMANG — TypeError
    r = _model(model)(y, **kw)

    d = {"matn": r["text"].strip(), "davomiylik": round(len(y) / 16000, 2)}
    if vaqt_belgilari and "chunks" in r:
        d["segmentlar"] = [
            {"boshi": c["timestamp"][0], "oxiri": c["timestamp"][1],
             "matn": c["text"].strip()}
            for c in r["chunks"]
        ]
    return d
```

```python
r = whisper_transkripsiya("speech_01.wav", vaqt_belgilari=True)
print(f"{r['davomiylik']} s · {len(r['segmentlar'])} segment")
print(r["matn"][:80])
```

```
23.51 s · 4 segment
My name is Yvonne and I am excited to have you as part of our learning community.
```

> ## ⭐ **`lru_cache` — 57-MODUL DARSI.** ## Modelni **har chaqiruvda** yuklash — 3 soniya. ## Singleton bilan — **bir marta**.

---

## 🎯 Nazorat savollari

1. `openai-whisper` va `transformers` orqali Whisper — asosiy farqi nima?
2. `base` va `small` orasida WER farqi qancha chiqdi?
3. Whisper-base ning yagona xatosi nima edi va u haqiqatan xatomi?
4. Google va Whisper orasidagi asosiy farq nimada?
5. Nega uzun fayl qisqa fayldan tezroq transkripsiya qilinadi?
6. Model singleton nega kerak?
7. `return_timestamps=True` natijaga ta'sir qiladimi?

<details>
<summary>Javoblar</summary>

1. `openai-whisper` **`ffmpeg` talab qiladi** (Chocolatey + admin huquqi) va **temperature fallback** bilan dekodlaydi. `transformers` — `librosa` faylni o'zi o'qiydi, dekodlash **greedy va deterministik**.
2. ## **Nol.** Uchalasi ham (`tiny` ham) **0.0164**. Lekin `small` `tiny` dan **6.4× sekin** (6.81 s vs 2.21 s) va **6.4× katta** (241.7 M vs 37.8 M). ⚠️ Bitta faylda o'lchangan — haqiqiy tanlov uchun **20–30 ta** fayl kerak.
3. `ivan → yvonne`. **Xato emas** — 58-modulda aniqladik: muallifning ismi **Yvonne**, `ground_truth.txt` dagi *"Ivan"* noto'g'ri. Ya'ni **haqiqiy aniqlik 61/61 = 100%**.
4. **Tinish belgilari**: Google **0** ta, Whisper **9** ta. Normallashtirilgandan keyin farq **bitta so'z** (`turned`/`turn`). Bundan tashqari Whisper **mahalliy** — internet kerak emas, audio hech qayerga ketmaydi.
5. Whisper kirishi **har doim 30 soniya** (`(1, 80, 3000)`). **Encoder narxi doimiy**, faqat decoder uzunlikka bog'liq. Shuning uchun 23.5 s → **8.07×**, 3.57 s → **4.27×**.
6. Model yuklash — **~3 soniya**. `lru_cache` siz har chaqiruvda qayta yuklanadi. 100 ta fayl uchun bu **5 daqiqa bekorga** (57-modulda 7.5× farq o'lchaganmiz).
7. ## **Ha.** `tiny` da `ts=True` **qo'shimcha xato** qo'shdi (`my → like`), WER 0.0164 → **0.0328**. Vaqt belgilari — **oddiy tokenlar**, ular greedy dekodlash yo'lini o'zgartiradi. **Modellarni taqqoslashda `False` ishlating.**

</details>

---

⬅️ [59-modul](../59-Background-Noise-and-Spectrograms/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-A-Note-on-Variability.md)
