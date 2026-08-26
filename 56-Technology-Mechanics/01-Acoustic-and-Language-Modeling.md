# 1-dars. Akustik va til modellashtirish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Akustik model — nima ESHITILDI. Til modeli — nima AYTILGAN bo'lishi mumkin."**

---

## 1. Ikki model, ikki vazifa

```
🎙️ AUDIO  →  xususiyatlar  →  🔊 AKUSTIK MODEL  →  fonemalar
                                                        ↓
📝 MATN   ←  🧠 TIL MODELI  ←──────────────────────────┘
```

| | 🔊 **Akustik model** | 🧠 **Til modeli** |
|---|---|---|
| Kirish | MFCC / mel-spektrogramma | Fonemalar / tokenlar |
| Chiqish | ## **Fonema ehtimolliklari** | ## **So'z ketma-ketligi** |
| Nimani biladi | Tovush **qanday eshitiladi** | ## Tilda **nima mumkin** |
| Nimadan o'rganadi | Audio + transkripsiya | ## ⭐ **Faqat matn** |
| Xato turi | 💥 `sat` ↔ `sad` | 💥 mavjud bo'lmagan so'z |

> ## 🔑 **KURSNING MISOLI ANIQ:** *"`cat` so'zida `k` da energiya portlashi bor, `a` ga o'tganda pitch va energiya silliq o'zgaradi."*
>
> ## ⭐ **VA BU — 52 va 55-MODULLARDA O'LCHAGAN NARSA:**
> ```
> /k/  →  portlovchi   →  💥 RMS keskin ko'tariladi, ZCR yuqori
> /a/  →  unli         →  ⭐ f0 bor, formantlar barqaror
> /t/  →  portlovchi   →  💥 yana portlash
> ```

---

## 2. ⭐⭐ Nima uchun til modeli **shart**?

```
Akustik model eshitdi:  /r/ /e/ /k/ /o/ /g/ /n/ /a/ /y/ /z/ /s/ /p/ /i/ /ch/

Til modelisiz:
   "recognize speech"      ✅
   "wreck a nice beach"    💥 AKUSTIK JIHATDAN DEYARLI BIR XIL
```

> ## 🏆 **BU — ASR TARIXIDAGI ENG MASHHUR MISOL** *(1980-yillar, Bell Labs)*.
>
> ## 🔑 **AKUSTIK MODEL IKKALASINI HAM MUMKIN DEB HISOBLAYDI.** ## Tanlovni **til modeli** qiladi:
> ```
> P("recognize speech")     →  yuqori
> P("wreck a nice beach")   →  💥 juda past
> ```

### 🔬 n-gramm til modelini o'zimiz quramiz

```python
from collections import Counter, defaultdict
import math

KORPUS = """
speech recognition converts spoken language into text
speech recognition uses machine learning
machine learning converts data into models
the model converts audio into text
"""


def ngramm_model(matn, n=2):
    """⭐ Eng oddiy til modeli — n-gramm."""
    sozlar = ["<s>"] + matn.lower().split() + ["</s>"]
    hisob = defaultdict(Counter)
    for i in range(len(sozlar) - n + 1):
        kontekst = tuple(sozlar[i:i + n - 1])
        hisob[kontekst][sozlar[i + n - 1]] += 1
    return hisob


def ehtimol(model, ketma, n=2, alfa=0.1, lugat=None):
    """⭐ Laplas silliqlashi bilan log-ehtimol."""
    sozlar = ["<s>"] + ketma.lower().split() + ["</s>"]
    V = len(lugat) if lugat else 50
    lp = 0.0
    for i in range(n - 1, len(sozlar)):
        k = tuple(sozlar[i - n + 1:i])
        c = model[k]
        lp += math.log((c[sozlar[i]] + alfa) / (sum(c.values()) + alfa * V))
    return lp / len(sozlar)          # ⭐ uzunlikka normallash


m = ngramm_model(KORPUS)
lugat = set(KORPUS.lower().split()) | {"<s>", "</s>"}

for s in ["speech recognition converts spoken language into text",
          "speech recognition converts text into spoken language",
          "recognition speech into converts text spoken language"]:
    print(f"  {ehtimol(m, s, lugat=lugat):7.3f}   {s}")
```

```
   -0.883   speech recognition converts spoken language into text
   -2.020   speech recognition converts text into spoken language
   -2.891   recognition speech into converts text spoken language
```

> ## ✅ **TIL MODELI TARTIBNI ANIQ AJRATDI:**
> ```
> to'g'ri jumla       -0.883   ⭐ eng yuqori
> so'zlar almashgan   -2.020   (2.3× past)
> tartib buzilgan     -2.891   💥 (3.3× past)
> ```
>
> ## 🏆 **VA UCHALA JUMLADA HAM AYNAN O'SHA SO'ZLAR BOR** — ## faqat **tartib** boshqa. ## Akustik model bunday farqni **ko'rmaydi**.
>
> ## ⚠️ **`alfa=0.1` — LAPLAS SILLIQLASHI, VA U MAJBURIY:** ## usiz korpusda **uchramagan** juftlik ehtimoli **0** bo'ladi, ## `log(0) = −inf` — ## 💥 **butun jumla rad etiladi**.
>
> ## 💡 **VA `/ len(sozlar)` — 52-MODULDAGI DARSNING O'ZI:** ## ehtimolni **uzunlikka normallash** shart, ## aks holda **qisqa jumla doim yutadi**.

---

## 3. ⭐ Zamonaviy tizimlarda ular **birlashgan**

```
❌ KLASSIK QUVUR (1990–2015):
   audio → akustik model → fonema → talaffuz lug'ati
         → so'z → til modeli → jumla
   ⚠️ 3 ta ALOHIDA o'qitiladigan komponent

✅ END-TO-END (2016+):
   audio ────────────────────────────────→ jumla
   ⭐ BITTA model, lekin ICHIDA ikkalasi ham bor
```

> ## 🔬 **VA BUNI WHISPER'DA O'LCHASH MUMKIN:**
> ```
> whisper-tiny:   encoder 8.2M  ·  decoder 29.6M
> whisper-base:   encoder 20.6M ·  decoder 52.0M
> whisper-small:  encoder 88.2M ·  decoder 153.6M
> ```
>
> ## 💥💥 **DECODER ENCODERDAN 2.5–3.6× KATTA.**
>
> ## 🔑 **ENCODER — AKUSTIK MODEL** *(audio → vakillik)*. ## **DECODER — TIL MODELI** *(vakillik → matn)*.
>
> ## 🏆 **YA'NI WHISPER PARAMETRLARINING ~70% I — TIL MODELI.**
>
> ## ⭐ **VA BU MANTIQIY:** ## `decoder` da **51 865 ta token** lug'ati bor — ## faqat chiqish qatlami **20M+** parametr *(small da)*.
>
> ## 💡 **AMALIY OQIBAT:** Whisper **eshitmagan** so'zni ham ## **yozib qo'yishi** mumkin — ## chunki uning til modeli **juda kuchli** *(gallyutsinatsiya, 61-modul)*.

---

## 4. ⚠️ Til modelining qorong'i tomoni

```
🏆 FOYDA:
   ✅ shovqinli audioda ham to'g'ri so'zni tanlaydi
   ✅ grammatikani tiklaydi
   ✅ tinish belgilarini qo'yadi

💥 ZARAR:
   💥 KUTILGAN so'zni yozadi, AYTILGANINI emas
   💥 kam uchraydigan ism/atamani "tuzatib" yuboradi
   💥 jimlikda ham matn "o'ylab topadi"
```

> ## 🔬 **VA BUNI 60-MODULDA HAQIQIY MISOLDA KO'RAMIZ:** ## kursning `speech_01.wav` faylida ismni Whisper **noto'g'ri** yozadi — ## chunki u **kam uchraydigan ism**, ## va til modeli uni **tanish so'zga** almashtiradi.
>
> ## 🇺🇿 **VA BU — O'ZBEKCHA UCHUN JIDDIY MUAMMO:**
> ```
> O'zbekcha ismlar, joy nomlari, atamalar
>    →  Whisper'ning til modelida KAM uchragan
>    →  💥 u ularni inglizcha/ruscha so'zga almashtiradi
> ```

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** Akustik va til modelining kirishi nima?

**M2.** Nima uchun `"wreck a nice beach"` muammosi til modelisiz yechilmaydi?

**M3.** Whisper'da encoder va decoder — qaysi biri katta?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Akustik**: MFCC / mel-spektrogramma → fonemalar. ## **Til**: fonemalar/tokenlar → so'zlar.

**M2.** ## Ikkala ibora **akustik jihatdan deyarli bir xil**. ## Tanlovni faqat **ehtimollik** qiladi.

**M3.** ## 💥 **Decoder** — 2.5–3.6× katta. ## `tiny`: 8.2M vs **29.6M**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ n-gramm til modelini yozing va sinang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 2-bo'limdagi kodni ishga tushiring, so'ng **n ni o'zgartiring**:

```python
for n in [2, 3]:
    m = ngramm_model(KORPUS, n=n)
    print(f"\n  === {n}-gramm ===")
    for s in ["speech recognition converts spoken language into text",
              "speech recognition converts text into spoken language",
              "recognition speech into converts text spoken language"]:
        print(f"    {ehtimol(m, s, n=n, lugat=lugat):7.3f}   {s[:46]}")
```

```
  === 2-gramm ===  (lug'at 17)
     -0.883   to'g'ri jumla
     -2.020   so'zlar almashgan
     -2.891   tartib buzilgan

  === 3-gramm ===
     -0.768   to'g'ri jumla
     -1.911   so'zlar almashgan
     -2.255   tartib buzilgan
```

## ⚠⚠ **KUTILMAGAN NATIJA — 3-GRAMM AJRATISHNI YOMONLASHTIRDI:**
```
2-gramm:  to'g'ri → buzilgan farqi  2.008
3-gramm:  to'g'ri → buzilgan farqi  1.487   💥 26% KAM
```

## 🔑 **SABAB — MA'LUMOT YETISHMASLIGI** *(sparsity)*. ## Korpus **kichik**, va 3-grammlarning **deyarli hammasi** ## unda **uchramaydi** — shuning uchun ## ham to'g'ri, ham xato jumla **bir xil silliqlash** oladi.

## 🏆 **AYNAN SHUNING UCHUN NEYRON TIL MODELLARI G'ALABA QILDI** — ## ular **ko'rmagan** ketma-ketlikni ham baholay oladi.

</details>

**M5.** ⭐⭐ Whisper'ning encoder/decoder nisbatini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import WhisperForConditionalGeneration

for nom in ["openai/whisper-tiny", "openai/whisper-base",
            "openai/whisper-small"]:
    m = WhisperForConditionalGeneration.from_pretrained(nom)
    enc = sum(p.numel() for p in m.model.encoder.parameters())
    dec = sum(p.numel() for p in m.model.decoder.parameters())
    c = m.config
    print(f"  {nom.split('/')[-1]:14s} encoder {enc/1e6:6.1f}M · "
          f"decoder {dec/1e6:6.1f}M · nisbat {dec/enc:.2f}×")
    print(f"                 {c.encoder_layers} enc qatlam · "
          f"{c.decoder_layers} dec · d_model {c.d_model} · "
          f"lug'at {c.vocab_size:,}")
    del m
```

```
  whisper-tiny   encoder    8.2M · decoder   29.6M · nisbat 3.61×
  whisper-base   encoder   20.6M · decoder   52.0M · nisbat 2.53×
  whisper-small  encoder   88.2M · decoder  153.6M · nisbat 1.74×
```

## ⚠️ **NISBAT MODEL KATTALASHGANI SARI KAMAYADI** *(3.61 → 1.74)*.

## 🔑 **SABAB:** `decoder` dagi **lug'at qatlami** *(51 865 token)* — ## kichik modelda **ustunlik qiladi**, kattasida esa **nisbatan kamayadi**.

</details>

**M6.** ⭐ Til modelining "tuzatishini" ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
import librosa
from transformers import pipeline

asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")
y, sr = librosa.load("speech_01.wav", sr=16000)

# ⭐ oxirini kesamiz — jumla TUGAMAGAN bo'ladi
for ulush in [1.0, 0.5, 0.25, 0.1]:
    z = y[:int(len(y) * ulush)]
    r = asr(z.copy(), generate_kwargs={"language": "en"})["text"].strip()
    print(f"\n  {ulush:.0%} ({len(z)/sr:5.1f} s): {r[:100]}")
```

## 💡 **KUZATING:** model kesilgan jumlani ## ko'pincha **tugallangan** qilib yozadi — ## bu **til modelining ishi**.

## ⚠️ **VA JUDA QISQA BO'LAKDA** *(0.1)* — ## u **umuman boshqa** narsa yozishi mumkin.

</details>

---

## 📌 Xulosa

```
AKUSTIK MODEL  →  audio → fonema      "nima ESHITILDI"
TIL MODELI     →  fonema → so'z       "nima AYTILGAN bo'lishi mumkin"
```

```
🔬 O'LCHANGAN:
   n-gramm til modeli (bir xil so'zlar, turli tartib):
     to'g'ri jumla      -0.883   ⭐
     so'zlar almashgan  -2.020
     tartib buzilgan    -2.891   💥

   Whisper encoder ↔ decoder:
     tiny    8.2M ↔ 29.6M   nisbat 3.61×
     base   20.6M ↔ 52.0M   nisbat 2.53×
     small  88.2M ↔ 153.6M  nisbat 1.74×

   🏆 parametrlarning ~70% i — TIL MODELI (decoder)
```

> ## 🏆🏆 **`"recognize speech"` VA `"wreck a nice beach"` — AKUSTIK JIHATDAN DEYARLI BIR XIL.** ## **FARQNI FAQAT TIL MODELI KO'RADI.**
>
> ## 💥 **LEKIN AYNAN SHU SABABLI WHISPER "ESHITMAGAN" SO'ZNI HAM YOZADI.**

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. HMM va neyron tarmoqlar](02-HMM-and-Neural-Networks.md)
