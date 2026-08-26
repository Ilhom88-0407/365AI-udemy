# 3-dars. `SpeechRecognition` kutubxonasi va Google Web Speech API ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"70 soniyalik faylni yubordik. Google 62 ta so'z qaytardi — 183 ta o'rniga. Hech qanday xato, hech qanday ogohlantirish. Jimgina."**

---

## 1. Kutubxona nima **emas**

> ## 🔑 **KURS BUNI JUDA TO'G'RI AYTADI:** ## *"`SpeechRecognition` — bu oddiy interfeys. ## U nutqni tanish modellarini **saqlamaydi va ishlatmaydi**."*

```
   sizning kompyuteringiz              Google serverlari
  ┌──────────────────────────┐        ┌──────────────────────────┐
  │  speech_01.wav           │        │  ① STFT -> spektrogramma │
  │        ↓                 │        │  ② akustik model (CNN)   │
  │  sr.AudioFile            │  HTTP  │  ③ til modeli (RNN/TRF)  │
  │        ↓                 │ ═════► │  ④ dekodlash             │
  │  recognizer.record()     │        │                          │
  │        ↓                 │ ◄═════ │  {"transcript": "...",   │
  │  recognize_google()      │  JSON  │   "confidence": 0.909}   │
  └──────────────────────────┘        └──────────────────────────┘
        ~3 MB yuboriladi                   og'ir ish SHU YERDA
```

| Nima | Qayerda |
|---|---|
| Fayl o'qish, WAV ga aylantirish | ## 💻 **sizda** |
| Akustik model, til modeli, dekodlash | ## ☁️ **Google'da** |
| Model og'irliklari | ## ☁️ **hech qachon sizga kelmaydi** |
| Internet | ## ⚠️ **SHART** |

---

## 2. Kursning kodi

```python
import speech_recognition as sr

recognizer = sr.Recognizer()
file_path = "speech_01.wav"


def transcribe_audio(file_path):
    with sr.AudioFile(file_path) as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
        print(text)
        return text


transcribed_text = transcribe_audio(file_path)
```

### 📄 Biz olgan natija

```
my name is Yvonne and I am excited to have you as part of our Learning
Community before we get started I'd like to tell you a little bit about
myself I'm a sound engineer turn data scientist curious about machine
learning and artificial intelligence my professional background is
primarily in media production with a focus on audio it and Communications
```

| O'lchov | Qiymat |
|---|---|
| `record()` | 0.01 s |
| ## Google API | ## **5.80 s** |
| `audio_data.sample_rate` | 44 100 |
| `audio_data.sample_width` | 3 *(bayt = 24 bit)* |
| Serverga yuborilgan | ## ⚠️ **2.97 MB** |
| So'zlar | 61 |

> ## 💥 **HAMMA VAQT TARMOQDA KETADI:** ## 5.80 s dan **5.79 s** — bu Google serveriga borib-kelish. ## Mahalliy hisoblash — **0.01 s**.

---

## 3. ⭐⭐⭐ Yashirin xazina: `show_all=True`

Kurs buni **umuman aytmaydi**. Lekin bu — eng foydali argument:

```python
alt = recognizer.recognize_google(audio_data, show_all=True)
print(json.dumps(alt, indent=2)[:600])
```

```json
{
  "alternative": [
    {"transcript": "my name is Yvonne and I am excited ... audio it and Communications",
     "confidence": 0.90954059},
    {"transcript": "my name is Yvonne ... turn data scientists curious ...",
     "confidence": 0.90954059},
    ...
  ],
  "final": true
}
```

| Nima olamiz | Nega kerak |
|---|---|
| ## ⭐ **`confidence`** | Qaysi fayllarni **qo'lda tekshirish** kerakligini biladi |
| ## ⭐ **5 ta variant** | Ikkinchi variant ba'zan **to'g'riroq** |
| `final` | Oqim rejimida tugaganini bildiradi |

> ## 💡 **`show_all=True` SIZ:** ## API xato bersa `UnknownValueError` **istisno** tashlaydi. ## ## ⭐ **`show_all=True` bilan:** bo'sh ro'yxat `[]` qaytadi — ## istisnosiz, `if` bilan tekshirish oson.

### 🔬 Variantlar bir-biridan qanchalik farq qiladi?

```
1-variant: ... a sound engineer turn data scientist  curious ...
2-variant: ... a sound engineer turn data scientists curious ...
                                              ^^^ faqat bitta harf
```

> ## ⚠️ **VARIANTLAR JUDA O'XSHASH.** ## Google "n-eng yaxshi ro'yxat" beradi, lekin ular ## bir xil dekodlash yo'lining **mayda tarmoqlari**. ## ## 💥 **Ikkinchi variant "Ivan" ni topmaydi** — hammasi "Yvonne" deydi.

---

## 4. ⭐⭐ API takrorlanuvchanmi?

Bir xil faylni **5 marta** yubordik:

```python
import hashlib
for i in range(5):
    res = recognizer.recognize_google(audio_data, show_all=True)
    txt = res["alternative"][0]["transcript"]
    conf = res["alternative"][0]["confidence"]
    print(f"{i+1}. ishonch {conf:.6f}  hash {hashlib.md5(txt.encode()).hexdigest()[:8]}")
```

```
1.  5.73 s  ishonch 0.909894  variantlar 5  hash 63bb3b05  WER 0.3390
2.  5.04 s  ishonch 0.909894  variantlar 5  hash 63bb3b05  WER 0.3390
3.  5.05 s  ishonch 0.909541  variantlar 5  hash 63bb3b05  WER 0.3390
4.  8.12 s  ishonch 0.909541  variantlar 5  hash 63bb3b05  WER 0.3390
5.  4.45 s  ishonch 0.909894  variantlar 5  hash 63bb3b05  WER 0.3390

→ turli natijalar: 1 ta
```

> ## ✅ **MATN — 5/5 AYNAN BIR XIL.** ## Bu yaxshi xabar: natijalaringiz **qayta ishlab chiqariladi**.
>
> ## ⚠️ **LEKIN ISHONCH SAKRAYDI:** `0.909894` ↔ `0.909541`. ## ## 💡 Ya'ni serverda **bir nechta nusxa** ishlaydi va ## ular **bit darajasida bir xil emas**. ## Ishonchni **chegaraviy qiymat** sifatida ishlatsangiz — ## `0.9095` atrofida **beqaror** bo'ladi.

> ## 💥 **VA MUHIMROG'I — VAQT BEQAROR:** ## 4.45 s dan **8.12 s** gacha (1.8× farq). ## Bu **tarmoq**, model emas. ## ## ⭐ Ishlab chiqarishda `timeout` va **qayta urinish** kerak.

---

## 5. 💥💥💥 ENG MUHIM TOPILMA: uzun fayl **jimgina kesiladi**

Faylni 1×, 2×, 3×, 4×, 6× takrorlab yubordik:

```python
y, srate = librosa.load("speech_01.wav", sr=16000)
BIR = 61                                   # bitta nusxadagi so'zlar

for k in [1, 2, 3, 4, 6]:
    sf.write("uzun.wav", np.tile(y, k), srate)
    with sr.AudioFile("uzun.wav") as s:
        a = recognizer.record(s)
    txt = recognizer.recognize_google(a)
    n = len(txt.split())
    print(f"{len(np.tile(y,k))/srate:6.1f} s  kutilgan {k*BIR:4d}  olingan {n:4d}  "
          f"{n/(k*BIR)*100:5.1f}%")
```

### 📊 Natija

| Davomiylik | Hajm | Vaqt | Kutilgan so'z | ## Olingan | Ulush |
|---|---|---|---|---|---|
| 23.5 s | 0.72 MB | 5.4 s | 61 | ## ✅ **61** | 100.0% |
| 47.0 s | 1.44 MB | 6.6 s | 122 | ## 💥 **62** | 50.8% |
| 70.5 s | 2.15 MB | 13.0 s | 183 | ## 💥 **62** | 33.9% |
| 94.0 s | 2.87 MB | 17.0 s | 244 | ## 💥 **62** | 25.4% |
| 141.1 s | 4.31 MB | 12.6 s | 366 | ## 💥 **62** | ## 💥 **16.9%** |

> ## 💥💥💥 **HAR SAFAR 62 TA SO'Z. HAR SAFAR.**
>
> ## 💥 **VA HECH QANDAY XATO, HECH QANDAY OGOHLANTIRISH.**
>
> ## ## 🔑 **API BIRINCHI SEGMENTNI QAYTARADI VA TO'XTAYDI.** ## Qolgan 83% audio — **e'tiborsiz qoldiriladi**.

> ## ⚠️⚠️ **BU — ENG XAVFLI TURDAGI XATO.** ## Kod ishlayapti. Natija bor. Matn **to'g'ri ko'rinadi**. ## Faqat u **audioning oltidan biri**. ## ## 💥 Agar 30 daqiqalik intervyuni transkripsiya qilsangiz — ## siz **20 soniyasini** olasiz va **bilmaysiz**.

### ✅ Yechim — bo'laklash (chunking)

```python
with sr.AudioFile("uzun.wav") as source:
    parts = []
    while True:
        audio = recognizer.record(source, duration=10)   # ⭐ 10 s bo'lak
        if len(audio.frame_data) == 0:
            break
        try:
            parts.append(recognizer.recognize_google(audio))
        except sr.UnknownValueError:
            parts.append("")
```

```
butun holda: 13.49 s  62 so'z          💥
bo'laklab   : 17.03 s  135 so'z  8 bo'lak  ⭐ 2.2× ko'p
```

> ## ⭐ **2.2× KO'PROQ MATN.** ## Narxi — **26% ko'proq vaqt** (8 ta HTTP so'rov).

### ⚠️ Lekin bo'laklashning **o'z narxi** bor

```
1: my name is Yvonne and I am excited to have you as part of our Lear...
2: play a sound engineer turn data scientist curious about machine le...   💥 "play"?
3:                                                                          💥 bo'sh
4: I'm a sound engineer turn data scientist curious about machine lea...
5: focus on audio it and Communications my name is Yvonne and
6: I'm excited to have you as part of our Learning Community before w...
7: tell us about machine learning and artificial intelligence my prof...
8:                                                                          💥 bo'sh
```

| Muammo | Sabab |
|---|---|
| ## 💥 Bo'sh bo'laklar *(3, 8)* | Bo'lak **jim joyga** tushdi |
| ## 💥 `"play a sound engineer"` | So'z **chegarada kesildi** |
| ## 💥 So'z takrorlanishi | Kontekst **yo'qoldi** |

> ## 🔑 **TO'G'RI YECHIM — JIMLIK BO'YICHA KESISH,** ## qattiq 10 soniya emas. ## Buni 59-modulda `librosa.effects.split()` bilan qilamiz.

---

## 6. 🔬 Diskretlash chastotasi natijaga ta'sir qiladimi?

Ko'pchilik *"yuqori chastota = yaxshi natija"* deb o'ylaydi. **Sinaymiz:**

| Chastota | Hajm | Vaqt | ## WER | Ishonch |
|---|---|---|---|---|
| 8 000 Hz | ## ⭐ **367.4 KB** | 5.53 s | ## **0.3390** | 0.8987 |
| 16 000 Hz | 734.8 KB | 7.00 s | ## **0.3390** | 0.8357 |
| 22 050 Hz | 1012.6 KB | 5.13 s | ## **0.3390** | 0.9111 |
| 44 100 Hz | ## 💥 **2025.2 KB** | 4.72 s | ## **0.3390** | 0.9095 |

> ## 🏆🏆 **TO'RTALASIDA HAM WER AYNAN BIR XIL — 0.3390.**
>
> ## 💥 **8 kHz DA HAM. 5.5× KICHIK FAYL BILAN.**
>
> ## ## 🔑 **SABAB:** Google audioni **o'zi 16 kHz ga tushiradi**. ## 44.1 kHz yuborish — **tarmoqni bekorga band qilish**.

> ## 💡 **AMALIY MASLAHAT:** ## API ga yuborishdan oldin **16 kHz mono** ga tushiring. ## Hajm **4.1× kamayadi**, natija **o'zgarmaydi**. ## ## ⚠️ Ishonch ballari biroz sakraydi (0.8357–0.9111), lekin **matn bir xil**.

---

## 7. Til parametri

```python
for lang in ["en-US", "en-GB", "uz-UZ", "ru-RU"]:
    txt = recognizer.recognize_google(audio_data, language=lang)
    print(f"{lang}: WER {wer(GT, txt):.4f}  {txt[:55]}")
```

| Til | Vaqt | WER | Natija |
|---|---|---|---|
| `en-US` | 5.38 s | ## ✅ **0.3390** | `my name is Yvonne and I am excited ...` |
| `en-GB` | 4.95 s | ## ✅ **0.3390** | *(aynan bir xil)* |
| ## `uz-UZ` | 3.21 s | ## 💥 **0.9831** | `buning millions ifoda qilsa production communications` |
| ## `ru-RU` | 4.73 s | ## 💥 **0.9153** | `My Name Is The One And I Am excited to have you Spotify` |

> ## 💥 **NOTO'G'RI TIL — SIZGA AYTMAYDI.** ## `uz-UZ` bilan API **hech qanday xato bermaydi** — ## u shunchaki **bema'ni matn** qaytaradi. ## ## ⚠️ **`language=` ni har doim aniq ko'rsating.**

> ## ⭐ **VA E'TIBOR BERING:** ## `uz-UZ` **mavjud** — ya'ni Google o'zbek tilini qo'llab-quvvatlaydi. ## Bu — o'zbek nutqi bilan ishlaydigan loyihalar uchun **muhim xabar**.

---

## 8. 💥 API "hech narsa yo'q" deganda nima qiladi?

```python
rng = np.random.default_rng(0)
sinovlar = [
    ("mutlaq tinchlik", np.zeros(3 * srate, dtype=np.float32)),
    ("oq shovqin",      (rng.standard_normal(3 * srate) * 0.1).astype(np.float32)),
    ("440 Hz sinus",    (0.3 * np.sin(2*np.pi*440*np.arange(3*srate)/srate)).astype(np.float32)),
]
for name, sig in sinovlar:
    sf.write("x.wav", sig, srate)
    with sr.AudioFile("x.wav") as s:
        a = recognizer.record(s)
    try:
        print(f"{name:16s} -> {recognizer.recognize_google(a)!r}")
    except sr.UnknownValueError:
        print(f"{name:16s} -> 💥 UnknownValueError")
```

```
mutlaq tinchlik  -> 💥 UnknownValueError (matn yo'q)
oq shovqin       -> 💥 UnknownValueError (matn yo'q)
440 Hz sinus     -> 💥 UnknownValueError (matn yo'q)
```

> ## ✅ **YAXSHI XABAR:** Google **gallyutsinatsiya qilmaydi**. ## Nutq yo'q bo'lsa — **rostini aytadi**. ## ## ⚠️ **Whisper bunday qilmaydi** — 60- va 61-modullarda ko'ramiz.

| Istisno | Qachon |
|---|---|
| `sr.UnknownValueError` | ## Nutq **tanilmadi** |
| `sr.RequestError` | ## Tarmoq / server xatosi |
| `ValueError` | ## Format **noto'g'ri** *(MP3, OGG)* |

---

## 9. ⭐ Ishonchli transkripsiya funksiyasi

Yuqoridagi **hamma** muammolarni hisobga oladigan versiya:

```python
import os, time, tempfile
import numpy as np, librosa, soundfile as sf
import speech_recognition as sr

BOLAK = 30.0          # soniya — API ning xavfsiz chegarasi
CHASTOTA = 16000      # Google baribir shunga tushiradi


def _wav_tayyorla(yol):
    y, _ = librosa.load(yol, sr=CHASTOTA, mono=True)
    fd, vaqt = tempfile.mkstemp(suffix=".wav")
    os.close(fd)
    sf.write(vaqt, y, CHASTOTA, subtype="PCM_16")
    return vaqt, len(y) / CHASTOTA


def transkripsiya(yol, til="en-US", urinish=3, kutish=2.0):
    """Uzun audioni bo'laklab, qayta urinish bilan transkripsiya qiladi."""
    rec = sr.Recognizer()
    wav, davomiylik = _wav_tayyorla(yol)
    natija = {"matn": "", "bolaklar": [], "davomiylik": round(davomiylik, 2),
              "ogohlantirish": []}
    try:
        with sr.AudioFile(wav) as manba:
            n = 0
            while True:
                audio = rec.record(manba, duration=BOLAK)
                if len(audio.frame_data) == 0:
                    break
                n += 1
                b = {"raqam": n, "matn": "", "ishonch": None, "holat": ""}

                for u in range(urinish):
                    try:
                        r = rec.recognize_google(audio, language=til, show_all=True)
                        if not r:                                # ⭐ bo'sh = nutq yo'q
                            b["holat"] = "nutq yo'q"
                            break
                        eng = r["alternative"][0]
                        b["matn"] = eng["transcript"]
                        b["ishonch"] = round(eng.get("confidence", float("nan")), 4)
                        b["holat"] = "ok"
                        break
                    except sr.RequestError as e:                 # ⚠️ tarmoq — qayta urinamiz
                        b["holat"] = f"tarmoq xatosi: {e}"
                        if u < urinish - 1:
                            time.sleep(kutish * (2 ** u))        # ⭐ eksponensial kutish
                    except sr.UnknownValueError:
                        b["holat"] = "nutq yo'q"
                        break
                natija["bolaklar"].append(b)
    finally:
        os.remove(wav)

    natija["matn"] = " ".join(b["matn"] for b in natija["bolaklar"] if b["matn"]).strip()

    # ⚠️ sifat tekshiruvi
    bosh = sum(1 for b in natija["bolaklar"] if not b["matn"])
    if bosh:
        natija["ogohlantirish"].append(f"⚠️ {bosh}/{len(natija['bolaklar'])} bo'lak bo'sh")
    past = [b["raqam"] for b in natija["bolaklar"]
            if b["ishonch"] is not None and b["ishonch"] < 0.75]
    if past:
        natija["ogohlantirish"].append(f"⚠️ ishonch past bo'laklar: {past}")
    if not natija["matn"]:
        natija["ogohlantirish"].append("💥 hech qanday matn olinmadi")
    natija["ogohlantirish"] = natija["ogohlantirish"] or ["✅ muammo yo'q"]
    return natija
```

```python
r = transkripsiya("speech_01.wav")
print(f"{r['davomiylik']} s · {len(r['bolaklar'])} bo'lak")
print(r["ogohlantirish"])
print(r["matn"][:90])
```

```
23.51 s · 1 bo'lak
["✅ muammo yo'q"]
my name is Yvonne and I am excited to have you as part of our Learning Community
```

### 🔬 Va endi — uzun fayl bilan

```python
sf.write("u3x.wav", np.tile(y, 3), 16000)      # 70.5 s
r2 = transkripsiya("u3x.wav")
print(f"{r2['davomiylik']} s · {len(r2['bolaklar'])} bo'lak · {len(r2['matn'].split())} so'z")
print(r2["ogohlantirish"])
print("ishonchlar:", [b["ishonch"] for b in r2["bolaklar"]])
```

```
3x: 70.54 s · 3 bo'lak · 133 so'z
["⚠️ ishonch past bo'laklar: [2]"]
ishonchlar: [0.8053, 0.5586, 0.7684]
```

> ## 🏆🏆 **62 SO'Z → 133 SO'Z.** ## Aynan shu fayl, aynan shu API — ## farqi faqat **bo'laklashda**.
>
> ## ⭐ **VA FUNKSIYA 2-BO'LAKNI O'ZI BELGILADI:** ## ishonch **0.5586** — chegara joyida so'z kesilgani ## ballarda **ko'rinib turibdi**.

| Muammo | Funksiya nima qiladi |
|---|---|
| Uzun fayl kesiladi | ## ⭐ **30 s bo'laklab** yuboradi |
| Tarmoq uzildi | ## ⭐ **3 marta** qayta urinadi, kutish **ikkilanadi** |
| Nutq yo'q | ## ⭐ `show_all=True` → bo'sh ro'yxat, **istisnosiz** |
| Format noto'g'ri | ## ⭐ `librosa` bilan **avval WAV** ga |
| Hajm katta | ## ⭐ **16 kHz mono** |
| Sifat past | ## ⭐ **ishonch bo'yicha ogohlantiradi** |
| Vaqtinchalik fayl | ## ⭐ `finally` da **o'chiriladi** |

---

## 🎯 Nazorat savollari

1. `SpeechRecognition` modelni o'zida saqlaydimi?
2. 141 soniyalik fayl yuborsangiz nima bo'ladi?
3. `show_all=True` nima beradi va nega foydali?
4. 8 kHz va 44.1 kHz orasida WER farqi qancha chiqdi?
5. Noto'g'ri `language=` ko'rsatsangiz API xato beradimi?
6. API bir xil faylga bir xil javob beradimi?

<details>
<summary>Javoblar</summary>

1. **Yo'q.** U faqat HTTP mijoz — audioni Google serveriga yuboradi. Barcha hisoblash **serverda**. Shuning uchun **internet shart** va **audio Google'ga ketadi**.
2. **Jimgina kesiladi** — 366 ta so'z o'rniga **62 ta** qaytadi (16.9%). Xato yo'q, ogohlantirish yo'q. Yechim: **30 soniyalik bo'laklarga** bo'lish.
3. `confidence` ballari va **5 tagacha variant**. Bundan tashqari nutq topilmasa **istisno emas, bo'sh ro'yxat** qaytaradi — bu `try/except` siz tekshirishga imkon beradi.
4. **Nol.** To'rtala chastotada ham WER = **0.3390**. Google audioni baribir 16 kHz ga tushiradi, shuning uchun 44.1 kHz yuborish faqat **tarmoqni band qiladi** (5.5× ko'p bayt).
5. **Yo'q.** `uz-UZ` bilan ingliz nutqiga `"buning millions ifoda qilsa..."` qaytardi — WER 0.9831. Xato **umuman bo'lmaydi**, faqat natija bema'ni.
6. **Matn — ha** (5/5 bir xil hash). **Ishonch — yo'q**: `0.909894` ↔ `0.909541` sakraydi. **Vaqt** ham beqaror: 4.45–8.12 s.

</details>

---

⬅️ [2-dars](02-Importing-Audio-in-Jupyter.md) · 🏠 [Modul](README.md) · ➡️ [4-dars](04-WER-and-CER.md)
