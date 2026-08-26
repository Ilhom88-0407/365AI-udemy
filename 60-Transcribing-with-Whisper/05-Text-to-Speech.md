# 5-dars. Teskari jarayon — AI bilan matndan nutqqa ⭐

## 🎬 Boshlashdan oldin

> **"Matnni nutqqa aylantirdik, keyin Whisper bilan qaytarib o'qidik. WER = 0.0000. Tinish belgilarigacha aynan."**

---

## 1. Kursning kodi

```python
from gtts import gTTS
import os

text = """Thank you for taking the time to watch our course on speech recognition!
This concludes the final lesson of this section. See you soon!"""

tts = gTTS(text=text, lang="en")
tts.save("output.mp3")

os.system("start output.mp3")
```

> ## ✅ **UCH QATOR — VA ISHLAYDI.** ## `gTTS` — Google Translate ning TTS xizmatiga **oddiy o'ram**. ## Kalit **kerak emas**.

> ## ⚠️ **LEKIN `os.system("start ...")` — FAQAT WINDOWS.**

| Platforma | Buyruq |
|---|---|
| Windows | `os.system("start output.mp3")` |
| macOS | `os.system("open output.mp3")` |
| Linux | `os.system("xdg-open output.mp3")` |
| ## Jupyter *(hamma joyda)* | ## ⭐ **`Audio("output.mp3")`** |

```python
from IPython.display import Audio
Audio("output.mp3")        # ⭐ platformadan mustaqil, notebook ichida
```

---

## 2. 🔬 O'lchaymiz

```python
import time, os, librosa
from gtts import gTTS

matn = ("Thank you for taking the time to watch our course on speech recognition. "
        "This concludes the final lesson of this section.")

t0 = time.perf_counter()
gTTS(text=matn, lang="en").save("tts60.mp3")
dt = time.perf_counter() - t0

z, s2 = librosa.load("tts60.mp3", sr=16000)
print(f"gTTS: {dt:.2f} s · {os.path.getsize('tts60.mp3')/1024:.1f} KB · {len(z)/16000:.2f} s")
print(f"nutq tezligi: {len(matn.split())/(len(z)/16000)*60:.0f} so'z/daqiqa")
```

```
gTTS: 2.75 s · 65.8 KB · 8.42 s
nutq tezligi: 150 so'z/daqiqa
```

| O'lchov | Qiymat |
|---|---|
| So'rov vaqti | 2.75 s |
| Fayl hajmi | 65.8 KB *(MP3)* |
| Audio davomiyligi | 8.42 s |
| ## **Nutq tezligi** | ## ⭐ **150 so'z/daqiqa** |
| Bir so'zga | ~3.1 KB |

> ## 💡 **150 so'z/daqiqa — ODAM NUTQI TEZLIGI.** ## Odatiy suhbat 120–160, ## diktor 150–180, ## podkast 130–160.

---

## 3. 🏆🏆 Aylanma sinov: **matn → nutq → matn**

Bu — TTS va ASR ning **ikkalasini birga** sinaydigan eng yaxshi test:

```python
qayta = asr(z)["text"].strip()

print(f"asl    : {matn}")
print(f"qaytgan: {qayta}")
print(f"WER {wer(matn, qayta):.4f}  CER {cer(norm(matn), norm(qayta)):.4f}")
```

```
asl    : Thank you for taking the time to watch our course on speech recognition.
         This concludes the final lesson of this section.
qaytgan: Thank you for taking the time to watch our course on speech recognition.
         This concludes the final lesson of this section.

WER xom 0.0000  toza 0.0000  CER toza 0.0000
```

> ## 🏆🏆🏆 **WER = 0.0000. NORMALLASHTIRISHSIZ HAM.**
>
> ## ## 🔑 **HAR BIR HARF, HAR BIR TINISH BELGISI — AYNAN.**

### 💡 Nega bu shunchalik oson?

| Omil | `speech_01.wav` | ## gTTS chiqishi |
|---|---|---|
| Shovqin | ## 💥 **bor** *(59-modul)* | ## ⭐ **yo'q** |
| Aksent | tabiiy | ## ⭐ **standart** |
| Talaffuz | tabiiy | ## ⭐ **mukammal** |
| Pauzalar | tartibsiz | ## ⭐ **muntazam** |
| ## WER | 0.0164 | ## 🏆 **0.0000** |

> ## ⚠️ **VA MANA MUHIM OGOHLANTIRISH:** ## ## 💥 **TTS AUDIOSIDA MODELINGIZNI SINAMANG.** ## U **juda oson** — natijangiz **haqiqiy ko'rsatkichdan yuqori** chiqadi. ## ## ⭐ Haqiqiy sinov uchun — **haqiqiy yozuvlar**.

> ## 💡 **LEKIN AYLANMA SINOV BOSHQA NARSAGA JUDA FOYDALI:** ## quvuringiz **ishlayotganini** tekshirishga. ## WER ≠ 0 chiqsa — **kodda muammo bor**, modelda emas.

---

## 4. 🌍 Tillar

```python
for lang in ["en", "fr", "ru"]:
    gTTS(text="Hello world, this is a test.", lang=lang).save(f"t_{lang}.mp3")
    print(f"{lang}: ✅ {os.path.getsize(f't_{lang}.mp3')/1024:.1f} KB")
```

```
en: ✅ 21.6 KB
fr: ✅ 20.2 KB
ru: ✅ 26.6 KB
```

> ## ⚠️ **O'ZBEK TILI (`uz`) — `gTTS` DA MAVJUD EMAS.** ## Google Translate TTS ro'yxatini `gtts.lang.tts_langs()` bilan ko'rish mumkin.

```python
from gtts.lang import tts_langs
tillar = tts_langs()
print(f"jami {len(tillar)} til")
print("uz bormi:", "uz" in tillar)
```

```
jami 69 til
uz bormi: False
```

| Muqobil | Izoh |
|---|---|
| ## `pyttsx3` | ## ⭐ **offline**, tizim ovozlari, `uz` bo'lishi mumkin emas |
| `edge-tts` | Microsoft Edge ovozlari, **bepul**, ko'p til |
| `Coqui TTS` | ## ⭐ **mahalliy neyron model**, o'z ovozingizni o'rgatish mumkin |
| `espeak-ng` | Ochiq kodli, ## ⭐ **`uz` qo'llab-quvvatlaydi** *(sifati past)* |

---

## 5. ⚠️ `gTTS` ning cheklovlari

| Cheklov | Tafsilot |
|---|---|
| ## Internet | ## 💥 **SHART** |
| Rasmiy API | ## 💥 **yo'q** — Google Translate ning **ichki** interfeysi |
| Limit | ## ⚠️ **e'lon qilinmagan**, ko'p so'rovda bloklanadi |
| Ovozni tanlash | ## 💥 **yo'q** — bitta ovoz |
| Tezlik | ⚠️ faqat `slow=True/False` |
| SSML | ## 💥 **yo'q** |
| Barqarorlik | ## ⚠️ **istalgan vaqtda o'chishi mumkin** |

> ## 🔑 **BU — 58-MODULDAGI GOOGLE WEB SPEECH API BILAN BIR XIL HOLAT.** ## Ikkalasi ham **rasmiy emas**, ikkalasi ham **bepul**, ## ikkalasi ham **kafolatsiz**.

### 🔬 `slow=True` ni ham o'lchaymiz

```python
for slow in [False, True]:
    gTTS(text=matn, lang="en", slow=slow).save(f"s_{slow}.mp3")
    z, _ = librosa.load(f"s_{slow}.mp3", sr=16000)
    print(f"slow={slow}: {len(z)/16000:.2f} s · "
          f"{len(matn.split())/(len(z)/16000)*60:.0f} so'z/daqiqa")
```

---

## 6. ⭐ Ishlatishga tayyor funksiya

```python
import os, io, time, hashlib


def matndan_nutqqa(matn, yol=None, til="en", sekin=False, kesh=True):
    """Matnni MP3 ga aylantiradi. Keshlash bilan.

    Bir xil matn ikkinchi marta so'ralsa — tarmoqqa chiqmaydi.
    """
    from gtts import gTTS

    if yol is None:
        h = hashlib.md5(f"{matn}|{til}|{sekin}".encode()).hexdigest()[:12]
        yol = f"tts_{h}.mp3"

    if kesh and os.path.exists(yol) and os.path.getsize(yol) > 0:
        return {"yol": yol, "keshdan": True, "vaqt": 0.0,
                "hajm_KB": round(os.path.getsize(yol) / 1024, 1)}

    t0 = time.perf_counter()
    gTTS(text=matn, lang=til, slow=sekin).save(yol)
    return {"yol": yol, "keshdan": False,
            "vaqt": round(time.perf_counter() - t0, 2),
            "hajm_KB": round(os.path.getsize(yol) / 1024, 1)}


def aylanma_sinov(matn, til="en"):
    """matn -> nutq -> matn. Quvurni tekshirish uchun."""
    import librosa, re
    from jiwer import wer, cer

    r = matndan_nutqqa(matn, til=til)
    y, _ = librosa.load(r["yol"], sr=16000)
    qayta = _model()(y)["text"].strip()

    def n(s):
        s = " ".join(s.split()).replace("’", "'").lower()
        return " ".join(re.sub(r"[^\w\s']", " ", s).split())

    return {"asl": matn, "qaytgan": qayta,
            "soniya": round(len(y) / 16000, 2),
            "WER_xom": round(wer(matn, qayta), 4),
            "WER_toza": round(wer(n(matn), n(qayta)), 4),
            "CER_toza": round(cer(n(matn), n(qayta)), 4),
            "holat": "✅ quvur ishlayapti" if wer(n(matn), n(qayta)) < 0.05
                     else "💥 quvurda muammo"}
```

```python
import json
print(json.dumps(aylanma_sinov(
    "The quick brown fox jumps over the lazy dog. "
    "Testing one two three."), indent=2, ensure_ascii=False))
```

```
{
  "asl": "The quick brown fox jumps over the lazy dog. Testing one two three.",
  "qaytgan": "The quick brown fox jumps over the lazy dog, testing 1-2-3.",
  "soniya": 5.69,
  "WER_xom": 0.3846,
  "WER_toza": 0.2308,
  "CER_toza": 0.1692,
  "holat": "💥 quvurda muammo"
}
```

> ## 💥 **VA MANA QIZIQARLI NATIJA:** ## Whisper `"one two three"` ni **`"1-2-3"`** deb yozdi.
>
> ## ## 🔑 **BU — XATO EMAS.** ## Whisper raqamlarni **raqam shaklida** yozishga o'rgatilgan. ## ## 💥 **LEKIN WER BUNI "3 TA XATO" DEB SANAYDI.**
>
> ## ⭐ **58-MODULDAGI DARS TAKRORLANDI:** ## metrikaning o'zi **normallashtirishga** bog'liq. ## Raqamlarni solishtirish uchun ## `"one" → "1"` xaritasi kerak.

---

## 7. 🔧 Raqamlarni normallashtirish

```python
RAQAMLAR = {
    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
    "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
    "ten": "10", "eleven": "11", "twelve": "12", "twenty": "20",
    "thirty": "30", "hundred": "100", "thousand": "1000",
}


def raqam_normallash(s):
    """'one two three' -> '1 2 3'"""
    return " ".join(RAQAMLAR.get(w, w) for w in s.split())
```

```python
a = raqam_normallash(n("The quick brown fox jumps over the lazy dog. "
                       "Testing one two three."))
b = raqam_normallash(n("The quick brown fox jumps over the lazy dog, "
                       "testing 1-2-3."))
print(f" a: {a}")
print(f" b: {b}")
print(f"WER {wer(a, b):.4f}")
```

```
 a: the quick brown fox jumps over the lazy dog testing 1 2 3
 b: the quick brown fox jumps over the lazy dog testing 1 2 3
WER 0.0000        🏆 endi mos tushdi
```

> ## 🏆 **0.2308 → 0.0000.** ## Model **hech qanday xato qilmagan edi** — ## **metrika** noto'g'ri o'lchagan.

---

## 8. ⭐ To'liq aylanma: ASR ↔ TTS

```
   ┌──────────────┐    gTTS     ┌──────────────┐
   │              │ ──────────► │              │
   │     MATN     │             │     NUTQ     │
   │              │ ◄────────── │              │
   └──────────────┘   Whisper   └──────────────┘

   Foydali qo'llanishlar:
   ① Quvurni tekshirish        (WER ≈ 0 kutamiz)
   ② Sintetik test ma'lumot    (⚠️ ehtiyot bo'ling — juda oson)
   ③ Ovozli interfeys          (savol -> javob -> ovoz)
   ④ Kirish imkoniyati         (ko'rish qobiliyati cheklanganlar uchun)
   ⑤ Til o'rganish             (talaffuz namunasi)
```

> ## ⚠️ **② HAQIDA JIDDIY OGOHLANTIRISH:** ## TTS bilan yaratilgan ma'lumotda model o'qitsangiz, ## u **faqat sintetik nutqni** yaxshi taniydi. ## ## 💥 **Haqiqiy odam ovozida — yiqiladi.**

---

## 🎯 Nazorat savollari

1. `gTTS` kalit talab qiladimi? Internet-chi?
2. Aylanma sinovda WER qancha chiqdi va nega?
3. Nega TTS audiosida modelni sinash noto'g'ri?
4. `os.system("start ...")` ning muammosi nima?
5. Whisper `"one two three"` ni qanday yozdi va bu xatomi?

<details>
<summary>Javoblar</summary>

1. **Kalit — yo'q.** **Internet — ha, shart.** `gTTS` Google Translate ning **rasmiy bo'lmagan** ichki interfeysidan foydalanadi (58-moduldagi Google Web Speech API bilan bir xil holat).
2. ## **0.0000** — normallashtirishsiz ham. Sabab: gTTS chiqishi **shovqinsiz**, **standart aksent**, **mukammal talaffuz**, **muntazam pauzalar**.
3. Chunki u **juda oson**. Natijangiz haqiqiy ko'rsatkichdan **yuqori** chiqadi. Haqiqiy fayl (`speech_01.wav`) da WER 0.0164, TTS da — 0.0000.
4. **Faqat Windows.** macOS'da `open`, Linux'da `xdg-open`. Jupyter'da esa `Audio("output.mp3")` — **platformadan mustaqil**.
5. **`"1-2-3"`** deb yozdi. **Xato emas** — Whisper raqamlarni raqam shaklida yozishga o'rgatilgan. Lekin WER buni **3 ta xato** deb sanadi (0.2308). Raqam normallashtirishdan keyin — **0.0000**.

</details>

---

⬅️ [4-dars](04-Saving-to-CSV.md) · 🏠 [Modul](README.md) · ➡️ [61-modul](../61-Final-Discussion/README.md)
