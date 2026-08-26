# 1-dars. Zamonaviy amaliyot va qo'llanmalar ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: transformerlar parallel ishlaydi, shuning uchun real vaqtda ishlaydi. Biz o'lchadik — 1 soniyalik bo'lakni 0.65 soniyada. CPU da. Ha, ishlaydi."**

---

## 1. Kursning asosiy tezisi

> ## 🔑 **KURS AYTADI:** ## *"An'anaviy usullar (Google Web Speech API) samarali, ## lekin murakkab va shovqinli audio bilan qiynaladi. ## Transformer modellari (Whisper) buni hal qiladi."*

**Bizning o'lchovimiz** *(58–60-modullar)*:

| | Google | ## Whisper-base |
|---|---|---|
| Toza audio *(WER toza)* | 0.0328 | ## 🏆 **0.0164** |
| Tinish belgilari | ## 💥 **0** | ## 🏆 **9** |
| ## Shovqinda *(0 dB SNR)* | ## 🏆 **0.0656** | ## 💥 **0.2623** |
| ## Shovqinda *(−5 dB)* | ## 🏆 **0.4262** | ## 💥 **5.3279** |

> ## ✅ **TOZA AUDIODA — KURS HAQ.**
>
> ## 💥 **SHOVQINDA — TESKARI.** ## 0 dB va pastda **Google yutdi**. ## Whisper **gallyutsinatsiya** qiladi *(60-modul)*.

> ## ⚠️ **XULOSA:** *"Transformerlar shovqinli audio bilan yaxshiroq"* — ## bu **ehtiyot bilan** aytilishi kerak da'vo. ## ## 🔑 **Ular kontekst bilan yaxshiroq, chidamlilik bilan — har doim ham emas.**

---

## 2. ⭐⭐ "Parallel ishlov" da'vosi — o'lchaymiz

> ## 🔑 **KURS AYTADI:** ## *"Transformerlar RNN kabi ketma-ket modellardan ## kirishni **tezroq** qayta ishlaydi. ## Bu **real vaqt** talab qiladigan holatlarda muhim."*

### 🔬 Oqim simulyatsiyasi

```python
for bolak_s in [1, 2, 3, 5, 10]:
    z = y[:int(bolak_s * 16000)]
    vaqtlar = [olcha(lambda: asr(z.copy())) for _ in range(3)]
    dt = float(np.median(vaqtlar))
    print(f"{bolak_s:2d} s bo'lak: {dt:.2f} s  RTF {dt/bolak_s:.2f}  "
          f"{'✅ real vaqt' if dt/bolak_s < 1 else '💥 sekin'}")
```

### 📊 Natija *(CPU, `whisper-base`)*

| Bo'lak | Kechikish | ## RTF | Real vaqtmi? |
|---|---|---|---|
| ## 1 s | ## **0.65 s** | ## **0.65** | ## ✅ **HA** |
| 2 s | 0.53 s | 0.27 | ## ✅ **HA** |
| 3 s | 0.78 s | 0.26 | ## ✅ **HA** |
| 5 s | 1.00 s | 0.20 | ## ✅ **HA** |
| 10 s | 1.56 s | ## 🏆 **0.16** | ## ✅ **HA** |

> ## ✅✅ **KURS HAQ.** ## **RTF** *(Real Time Factor)* — 1.0 dan kichik bo'lsa, ## model audiodan **tezroq** ishlaydi.
>
> ## 🏆 **HAMMA BO'LAK O'LCHAMIDA RTF < 1.0.** ## Va bu — **oddiy noutbukning protsessorida**, GPU siz.

### ⚠️ Lekin nozik joyi bor

```
   1 s bo'lak:  RTF 0.65   →  lekin foydalanuvchi 1 s KUTADI + 0.65 s = 1.65 s
  10 s bo'lak:  RTF 0.16   →  foydalanuvchi 10 s KUTADI + 1.56 s = 11.56 s
```

> ## 💥 **RTF ≠ KECHIKISH.** ## Foydalanuvchi **bo'lak to'lishini** ham kutadi. ## ## 🔑 **Haqiqiy kechikish = bo'lak uzunligi + ishlov vaqti.**
>
> ## ⭐ **VA MANA NEGA 1 s BO'LAK ENG YAXSHI TANLOV** ## *(1.65 s jami)*, ## RTF eng yomon bo'lsa ham.

> ## ⚠️ **VA YANA:** 1 soniyalik bo'lakda **kontekst yo'q**. ## Whisper ning kuchi — **uzun kontekst**. ## ## 💥 **Real vaqt ↔ aniqlik — bu murosa.**

---

## 3. 🏆🏆 Real vaqtda **tarjima** — kursning kelajak da'vosi bugun ishlaydi

> ## 🔑 **KURS AYTADI:** *"Real vaqtda tarjima — orzu, u haqiqatga aylanmoqda."*

**Whisper buni allaqachon qiladi** — `task="translate"`:

```python
tr = asr(y, generate_kwargs={"task": "translate"})["text"]
```

### 📊 Beshta til

| Til | Transkripsiya | ## Tarjima | Vaqt |
|---|---|---|---|
| **fr** | `Bonjour, je m'appelle Marie et je suis ingénieur du son.` | ## ⭐ `Hello, my name is Marie and I am an engineer of the sound.` | 0.8 s |
| **es** | `Hola, me llamo Carlos y trabajo con inteligencia artificial.` | ## 🏆 `Hello, I'm Carlos and I work with Artificial Intelligence.` | 0.82 s |
| **de** | `Guten Tag! Ich arbeite als Datenwissenschaftler in Berlin.` | ## 🏆 `Good day. I work as a data scientist in Berlin.` | 0.79 s |
| **ru** | `Здравствуйте, меня зовут Анна, я изучаю машинное обучение.` | ## 🏆 `Hello, my name is Anna. I study machine learning.` | 0.81 s |
| ## **tr** | `Merhaba, ben bir ses mühendisiyim ve verebilimi öğreniyorum.` | ## 💥 `Hello, I am a voice teacher and I am learning to give information.` | 0.90 s |

> ## 🏆 **TO'RTTA TILDA — DEYARLI MUKAMMAL.** ## Va **0.8 soniyada**, mahalliy CPU da, ## qo'shimcha tarjima modelisiz.

> ## 💥💥 **TURKCHADA ESA — TO'LIQ MA'NO XATOSI:**
>
> ```
> ses mühendisi   (tovush muhandisi)  →  "voice teacher"     💥
> veri bilimi     (ma'lumot fani)     →  "give information"  💥
> ```
>
> ## ## 🔑 **VA SABAB TRANSKRIPSIYADA:** ## `veri bilimi` → **`verebilimi`** deb noto'g'ri tanildi. ## Keyin **noto'g'ri so'z tarjima qilindi**.
>
> ## ⚠️ **XATO ZANJIRLANADI:** ## transkripsiya xatosi → tarjima xatosi → **butunlay boshqa ma'no**.

> ## 💡 **NEGA TURKCHA?** ## Whisper ning o'quv ma'lumotida ## ingliz/ispan/nemis/fransuz — **minglab soat**, ## turk — **ancha kam**. ## ## 🔑 **Bu — "kam resursli tillar" muammosi.** ## O'zbek tili uchun ham **shu**.

---

## 4. 🌍 Til almashinuvi — kurs to'g'ri aytgan

> ## 🔑 **KURS AYTADI:** *"Foydalanuvchi gap o'rtasida tilni almashtirsa, ## tizimlar moslasha olmaydi."*

```python
matn = "Hello everyone. Bonjour tout le monde. Welcome to the course."
print(asr(tts(matn))["text"])
```

```
asl    : Hello everyone. Bonjour tout le monde. Welcome to the course.
tanildi: Hello, everyone. Bonjour, Toute La Monde. Welcome to the course.
                                   ^^^^^^^^^^^^^  💥
```

```
asl    : The meeting is at nine. La reunión es a las nueve. Thank you.
tanildi: The meeting is at 9. La reunion is a last-new eve. Thank you.
                                ^^^^^^^^^^^^^^^^^^^^^^^^^  💥 bema'nilik
```

> ## ✅✅ **KURS BUTUNLAY HAQ.**
>
> ## 💥 **`la reunión es a las nueve` → `La reunion is a last-new eve`** — ## model ispancha so'zlarni **inglizcha tovushlar** deb "eshitdi".
>
> ## ## 🔑 **SABAB:** Whisper **butun fayl uchun bitta til** tanlaydi. ## Ingliz deb qaror qilgach, ispancha qismni ham ## **ingliz tokenlari** bilan dekodlaydi.

> ## ⭐ **YECHIM:** matnni **jimlik bo'yicha bo'laklab**, ## har bir bo'lak uchun tilni **alohida** aniqlash.

---

## 5. ⭐ Kurs sanagan qo'llanmalar — bugungi holat

| Soha | Kurs aytadi | ## Bizning izohimiz |
|---|---|---|
| Virtual yordamchilar | Alexa, Siri, Google | ## ✅ **to'g'ri** |
| Biznes tahlili | Yig'ilishlarni transkripsiya | ## ✅ **60-modulda qildik** |
| Mijozlarga xizmat | Ovozli IVR | ## ✅ to'g'ri |
| Til o'rganish | Duolingo, Babbel | ## ✅ to'g'ri |
| ## Ovoz bilan autentifikatsiya | *"xavfsiz usul"* | ## 💥 **JIDDIY OGOHLANTIRISH — quyida** |
| Sonifikatsiya | Ma'lumotni tovushga | ## ⚠️ **bu ASR emas** |
| Kirish imkoniyati | Subtitrlar, ovozli boshqaruv | ## 🏆 **eng qimmatli qo'llanma** |

### 💥💥 Ovoz bilan autentifikatsiya haqida

> ## 🔑 **KURS AYTADI:** *"Bu texnologiya xavfsizlik tizimlarida, ## bank ishida ishlatiladi, ## **xavfsiz va qulay** shaxsni tasdiqlash usulini beradi."*

> ## 💥💥💥 **BU — 2026-YILDA XAVFLI TAVSIYA.**
>
> ## 🔑 **SABAB:** ovozni **klonlash** bugun ## **bir necha soniyalik namuna** bilan mumkin. ## ## ⚠️ Ochiq kodli modellar (`XTTS`, `RVC`, `F5-TTS`) ## 5–10 soniyalik yozuvdan **ishonarli nusxa** yaratadi.

| Yil | Ovozni klonlash uchun kerak edi |
|---|---|
| 2018 | ## Soatlab yozuv + laboratoriya |
| 2021 | ~30 daqiqa |
| 2023 | ## ⚠️ **~1 daqiqa** |
| 2025+ | ## 💥 **~5–10 soniya** |

> ## ⚠️ **VA 5 SONIYALIK OVOZ NAMUNASINI OLISH OSON:** ## telefon qo'ng'irog'i, Instagram stories, ## YouTube video, ovozli xabar.
>
> ## ## 🏆 **TO'G'RI YONDASHUV:** ## ovoz — **birinchi omil emas, qo'shimcha omil**. ## ## ⭐ Ovoz + parol + qurilma = **ko'p omilli**. ## Faqat ovoz = ## 💥 **xavfli**.

### ⚠️ Sonifikatsiya haqida ham

> ## 🔑 **KURS AYTADI:** *"Nutqni tanish ma'lumotni tovushga aylantirishga imkon beradi"*
>
> ## 💥 **BU NOTO'G'RI.** ## **Sonifikatsiya** — ma'lumotni tovushga aylantirish, ## bu **nutqni tanish** emas, ## hatto **nutq sintezi** ham emas. ## ## 🔑 Qora tuynuk ma'lumotlarining sonifikatsiyasi — ## chastota va amplitudani **to'g'ridan-to'g'ri xaritalash**, ## hech qanday ASR ishtirok etmaydi.

---

## 🎯 Nazorat savollari

1. Whisper real vaqtda ishlay oladimi? RTF nima?
2. Nega 1 soniyalik bo'lak eng yaxshi tanlov?
3. Whisper tarjima qila oladimi? Qaysi tilda muvaffaqiyatsiz bo'ldi va nega?
4. Til almashinuvi bilan nima bo'ladi?
5. Ovoz bilan autentifikatsiya haqidagi kurs tavsiyasi to'g'rimi?

<details>
<summary>Javoblar</summary>

1. **Ha.** **RTF** *(Real Time Factor)* = ishlov vaqti / audio uzunligi. 1.0 dan kichik bo'lsa — real vaqt. Bizda **0.16–0.65**, CPU da.
2. Chunki **kechikish = bo'lak uzunligi + ishlov vaqti**. 1 s → **1.65 s**, 10 s → **11.56 s**. RTF eng yomon bo'lsa ham, foydalanuvchi uchun **eng tez**. ⚠️ Lekin qisqa bo'lakda **kontekst yo'q**.
3. **Ha** — `generate_kwargs={"task": "translate"}`. Fransuz, ispan, nemis, rus — deyarli mukammal, 0.8 s da. ## **Turkchada — to'liq ma'no xatosi**: `ses mühendisi` → *"voice teacher"*. Sabab: transkripsiya bosqichida `veri bilimi` → `verebilimi` deb xato tanildi, keyin **noto'g'ri so'z tarjima qilindi**. Bu — **kam resursli tillar** muammosi.
4. **Buziladi.** `la reunión es a las nueve` → `La reunion is a last-new eve` — bema'nilik. Whisper **butun fayl uchun bitta til** tanlaydi. Yechim: jimlik bo'yicha bo'laklab, har bo'lak uchun tilni alohida aniqlash.
5. ## **Yo'q — bu 2026-yilda xavfli tavsiya.** Ovozni klonlash uchun bugun **5–10 soniyalik** namuna yetarli. Ovoz **qo'shimcha omil** bo'lishi mumkin, lekin **yagona omil emas**.

</details>

---

⬅️ [60-modul](../60-Transcribing-with-Whisper/README.md) · 🏠 [Modul](README.md) · ➡️ [2-dars](02-Challenges-and-Limitations.md)
