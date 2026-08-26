# 3-dars. Nutqni tanishning kelajagi ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs beshta 'kelajak trendi' sanaydi. Biz uchtasini oddiy noutbukda bugun ishlab turganini o'lchadik. 'Kelajak' — allaqachon shu yerda."**

---

## 1. Kursning beshta trendi — bugungi holat

| # | Trend | ## Bugungi holat |
|---|---|---|
| ① | Multimodal interfeyslar | ## ⚠️ **rivojlanmoqda** |
| ② | ## **Edge computing** | ## 🏆 **BUGUN ISHLAYDI — o'lchadik** |
| ③ | Shaxsiylashtirish | ## ⚠️ **qisman** |
| ④ | ## **Real vaqtda tarjima** | ## 🏆 **BUGUN ISHLAYDI — o'lchadik** |
| ⑤ | Sog'liqni saqlash | ## ⚠️ **ishlatilmoqda, lekin ehtiyot bilan** |

---

## 2. 🏆🏆 ② Edge computing — **bugun**, sizning noutbukingizda

> ## 🔑 **KURS AYTADI:** *"Eng qiziqarli rivojlanishlardan biri — ## ishlov **foydalanuvchiga yaqinroq**, qurilmaning o'zida bajarilishi."*

### 📊 Biz o'lchadik

| | Kechikish | Yuborilgan | Narx | Limit |
|---|---|---|---|---|
| ## **Mahalliy Whisper** *(CPU)* | ## 🏆 **2.89 s** | ## 🏆 **0 bayt** | ## 🏆 **0** | ## 🏆 **yo'q** |
| Google bulut | ## 💥 **6.24 s** | ## 💥 **0.72 MB** | 0 *(hozircha)* | ## ⚠️ **noma'lum** |

> ## 🏆🏆🏆 **"KELAJAK TRENDI" — 2.16× TEZROQ VA BEPUL. BUGUN.**

### 💾 Va u qanchalik "og'ir"?

| Model | Diskda *(o'lchangan)* | Vaqt | ## RTF *(CPU)* |
|---|---|---|---|
| ## `tiny` | ## 🏆 **148.2 MB** | ## 🏆 **1.83 s** | ## 🏆 **0.078** |
| ## **`base`** | ⭐ 281.1 MB | ⭐ 2.65 s | ## ⭐ **0.113** |
| `small` | ## 💥 **926.4 MB** | ## 💥 **5.73 s** | 0.244 |

> ## ⭐ **`tiny` — 148 MB.** ## Bu — **bitta rasm** hajmi. ## Va u **61 ta so'zdan 60 tasini** to'g'ri tanidi *(60-modul)*.
>
> ## ## 🔑 **YA'NI TELEFONDA HAM ISHLAYDI.** ## `whisper.cpp`, `faster-whisper`, `ONNX Runtime` — ## bularning hammasi **mobil qurilmada** ishlaydi.

---

## 3. 🏆 ④ Real vaqtda tarjima — **bugun**, 0.8 soniyada

*(1-darsda o'lchadik)*

```python
tj = asr(y, generate_kwargs={"task": "translate"})["text"]
```

| Til | Vaqt | Natija |
|---|---|---|
| Fransuz | 0.80 s | ## ⭐ `Hello, my name is Marie and I am an engineer of the sound.` |
| Ispan | 0.82 s | ## 🏆 `Hello, I'm Carlos and I work with Artificial Intelligence.` |
| Nemis | 0.79 s | ## 🏆 `Good day. I work as a data scientist in Berlin.` |
| Rus | 0.81 s | ## 🏆 `Hello, my name is Anna. I study machine learning.` |
| ## Turk | 0.90 s | ## 💥 `Hello, I am a voice teacher and I am learning to give information.` |

> ## 🏆 **TO'RTTA TILDA — ISHLAYDI, BUGUN, MAHALLIY, BEPUL.**
>
> ## 💥 **LEKIN "SEAMLESS" EMAS.** ## Turkchada **to'liq ma'no xatosi**. ## ## 🔑 **Kam resursli tillarda — hali yo'l uzoq.**

### ⚠️ Va bitta muhim cheklov

```
   Whisper task="translate"  →  FAQAT INGLIZ TILIGA
```

| Yo'nalish | Whisper |
|---|---|
| Har qanday til → **ingliz** | ## ✅ |
| Ingliz → boshqa til | ## 💥 **yo'q** |
| Fransuz → nemis | ## 💥 **yo'q** |

> ## ⭐ **YECHIM:** Whisper *(ASR)* + tarjima modeli *(`NLLB`, `M2M100`)* + TTS. ## Uch bosqichli quvur. ## ## ⚠️ **Va har bosqichda xato to'planadi** — ## turk misolida ko'rganimizdek.

---

## 4. ⚠️ ③ Shaxsiylashtirish — nozik mavzu

> ## 🔑 **KURS AYTADI:** *"Tizim ovozingizdan **stress**ni tanib, ## tinchlantiruvchi takliflar berishi mumkin."*

> ## ⚠️⚠️ **BU — EHTIYOT BO'LISH KERAK BO'LGAN JOY.**

| Da'vo | Holat |
|---|---|
| Ovozdan **kim gapirayotganini** tanish | ## ✅ **ishlaydi** *(diarizatsiya)* |
| Ovozdan **jins/yosh** taxmini | ## ⚠️ **ishlaydi, lekin xato qiladi** |
| ## Ovozdan **hissiyot** tanish | ## ⚠️ **laboratoriyada ~70%** |
| ## Ovozdan **stress/sog'liq** tashxisi | ## 💥 **ilmiy jihatdan tasdiqlanmagan** |

> ## 💥 **"OVOZDAN KASALLIKNI ANIQLASH" — ## HOZIRCHA TADQIQOT, MAHSULOT EMAS.**
>
> ## ⚠️ Va bu — **jiddiy etik masala**: ## ish suhbatida ovozdan *"stress"* o'lchash, ## sug'urta narxini *"sog'liq belgilari"* bilan belgilash — ## ## 💥 **kamsitish** ga olib keladi.

> ## 🏆 **68–76-MODULLARDA (AI ETIKASI) BU MAVZUGA QAYTAMIZ.**

---

## 5. ⚠️ ⑤ Sog'liqni saqlash — eng katta imkoniyat va eng katta xavf

> ## 🔑 **KURS AYTADI:** *"Shifokorlar eslatmalarni diktovka qilishi, ## bemor yozuvlarini yangilashi mumkin. ## Bu vaqtni tejaydi va **xatolar xavfini kamaytiradi**."*

> ## ✅ **BIRINCHI QISM — TO'G'RI.** ## Tibbiy diktovka — ASR ning **eng katta bozori**.
>
> ## 💥 **IKKINCHI QISM — XAVFLI.** ## *"Xatolar xavfini kamaytiradi"* — ## bu **faqat tekshiruv bilan** to'g'ri.

### 💥 Nima uchun?

| Xato | Oqibat |
|---|---|
| `VRAM` → `RAM` *(biz o'lchadik)* | ⚠️ noqulaylik |
| ## `hypo-` → `hyper-` | ## 💥💥 **teskari tashxis** |
| ## `50 mg` → `15 mg` | ## 💥💥 **doza xatosi** |
| ## Gallyutsinatsiya | ## 💥💥💥 **yo'q bo'lgan simptom** |

> ## 💥💥💥 **VA WHISPER TIBBIY YOZUVLARDA ## GALLYUTSINATSIYA QILGANI ## HAQIQIY HOLATLARDA QAYD ETILGAN.**
>
> ## ## 🔑 **SABAB — BIZ 60-MODULDA O'LCHAGANIMIZ:** ## shovqin yoki jimlikda model **matn o'ylab topadi**, ## va u **ishonchli ko'rinadi**.

### ✅ To'g'ri arxitektura

```
┌──────────────────────────────────────────────────────────┐
│  ① ASR  →  qoralama matn                                 │
│         ↓                                                │
│  ② AVTOMATIK TEKSHIRUV                                   │
│     · gallyutsinatsiya detektori                         │
│     · raqamlar/dozalar ajratib ko'rsatiladi              │
│     · past ishonchli joylar BELGILANADI                  │
│         ↓                                                │
│  ③ ODAM TASDIQLAYDI  ← 💥 MAJBURIY                       │
│         ↓                                                │
│  ④ Yozuvga kiritiladi + AUDIO SAQLANADI                  │
└──────────────────────────────────────────────────────────┘
```

> ## 🏆 **④ — ENG MUHIM QADAM.** ## Asl audio saqlansa, **har qanday xatoni tekshirish** mumkin. ## ## ⚠️ Faqat matn saqlansa — **xato abadiy** bo'lib qoladi.

---

## 6. ⚠️ ① Multimodal interfeyslar

> ## 🔑 **KURS AYTADI:** *"Ovozingizni tinglaydigan va ## yuz ifodangizni tushunadigan yordamchini tasavvur qiling."*

| Komponent | Holat |
|---|---|
| Nutq → matn | ## ✅ **hal qilingan** |
| Matn → javob *(LLM)* | ## ✅ **hal qilingan** |
| Matn → nutq | ## ✅ **hal qilingan** |
| ## Yuz ifodasi → hissiyot | ## ⚠️ **ishonchsiz** |
| ## Imo-ishora → buyruq | ## ⚠️ **cheklangan** |
| Hammasini **birlashtirish** | ## ⚠️ **kechikish muammosi** |

```
   ASR 0.8 s  +  LLM 1.5 s  +  TTS 1.0 s  =  3.3 s
                                              ▲
                              suhbat uchun JUDA UZOQ
```

> ## 🔑 **ODAM SUHBATIDA PAUZA — 0.2 SONIYA.** ## 3.3 soniya — **noqulay**. ## ## ⭐ Shuning uchun **oqim** *(streaming)* kerak: ## ASR va TTS **bir vaqtda** ishlashi.

---

## 7. 🏆 Kurs aytmagan trendlar

| Trend | Nima |
|---|---|
| ## **Kvantlashtirish** | 4-bit modellar — **4× kichik**, deyarli bir xil aniqlik |
| ## **Diarizatsiya** | *"Kim gapiryapti"* — `pyannote.audio` |
| ## **`faster-whisper`** | `CTranslate2` — **4× tez**, bir xil natija |
| ## **Distillyatsiya** | `distil-whisper` — **6× tez**, WER +1% |
| **Voice cloning** | 5 soniyada nusxa — ## 💥 **xavfsizlik muammosi** |
| **Ochiq datasetlar** | `Common Voice` — ## ⭐ **o'zbek tili ham bor** |

> ## ⭐⭐ **VA ENG MUHIMI O'ZBEK TILI UCHUN:** ## `Common Voice` da o'zbek tili **mavjud**, ## `Whisper` esa uni **qo'llab-quvvatlaydi** *(`language="uz"`)*, ## lekin **sifati past** — o'quv ma'lumoti kam.
>
> ## ## 🏆 **BU — IMKONIYAT.** ## Kam resursli til uchun model **moslashtirish** ## *(fine-tuning)* — bugun **oddiy noutbukda** mumkin.

---

## 8. ⭐ Kurs bo'yicha yakuniy xulosa

### 🏆 Kurs to'g'ri o'rgatgan narsalar

| | |
|---|---|
| ✅ | Tovush fizikasi va raqamli aylantirish |
| ✅ | Spektrogramma va xususiyat ajratish |
| ✅ | ASR arxitekturalari evolyutsiyasi |
| ✅ | WER/CER metrikalari |
| ✅ | Ikkita amaliy vosita: Google API va Whisper |
| ✅ | Ko'p faylni qayta ishlash |
| ✅ | Muammolar ro'yxati — **asosan to'g'ri** |

### 💥 Biz tuzatgan narsalar

| Kurs | ## O'lchov |
|---|---|
| `ffmpeg` shart | ## 🏆 **kerak emas** |
| Pre-emphasis WER ni yaxshilaydi | ## 💥 **25 o'lchovda 0 marta** |
| Whisper stoxastik | ## 💥 **5/5 aynan bir xil** |
| Kattaroq model — yaxshiroq | ## 💥 **tiny = base = small** |
| `Ivan` — to'g'ri ism | ## 💥 **`Yvonne`** |
| WER 0.3390 | ## 💥 **normallashtirilgandan keyin 0.0328** |
| Ovoz bilan autentifikatsiya xavfsiz | ## 💥 **2026-da xavfli** |
| *(aytilmagan)* | ## 💥 **GALLYUTSINATSIYA** |

### 🔑 Va bitta umumiy dars

> ## 🏆🏆🏆 **HAR BIR DA'VONI O'LCHANG.**
>
> ## ⭐ **KURSNIKI HAM. BLOGNIKI HAM.**
>
> ## ## 💥 **VA O'ZINGIZNIKI HAM.**
>
> ## Bu modullarni tayyorlashda **men o'zim** ## o'nlab marta xato qildim — ## va har safar **o'lchov meni tuzatdi**: ## `audioop`, `lazy_loader`, `return_timestamps`, ## gallyutsinatsiya detektorining chegarasi...

---

## 🎯 Nazorat savollari

1. Kursning qaysi "kelajak trendlari" bugun ishlayapti?
2. Whisper qaysi yo'nalishda tarjima qila oladi?
3. Ovozdan stress/sog'liqni aniqlash haqidagi da'vo qanchalik asosli?
4. Tibbiy diktovkada qanday arxitektura kerak?
5. Multimodal yordamchining asosiy texnik to'sig'i nima?
6. O'zbek tili uchun qanday imkoniyat bor?

<details>
<summary>Javoblar</summary>

1. ## **Edge computing** (mahalliy **2.16× tez**, **0 bayt** yuboradi) va ## **real vaqtda tarjima** (0.8 s, to'rtta tilda). Ikkalasi ham **oddiy noutbukda, bepul, bugun**.
2. ## **Faqat ingliz tiliga.** `task="translate"` har qanday tildan **inglizga** tarjima qiladi. Teskari yo'nalish yo'q. Buning uchun alohida tarjima modeli (`NLLB`, `M2M100`) kerak.
3. **Zaif.** Diarizatsiya (kim gapiryapti) ishlaydi, hissiyot tanish laboratoriyada ~70%, **stress/sog'liq tashxisi esa ilmiy jihatdan tasdiqlanmagan**. Va bu — jiddiy **etik** masala (kamsitish xavfi).
4. ## **ASR → avtomatik tekshiruv → ODAM TASDIQLAYDI → yozuv + AUDIO SAQLANADI.** Odam tasdig'i **majburiy**. Asl audioni saqlash — har qanday xatoni keyinchalik tekshirish imkonini beradi.
5. ## **Kechikish.** ASR 0.8 s + LLM 1.5 s + TTS 1.0 s = **3.3 s**. Odam suhbatida pauza — **0.2 s**. Yechim: **oqim** (streaming) — bosqichlar bir vaqtda ishlashi.
6. `Common Voice` da o'zbek tili **bor**, Whisper `language="uz"` ni **qo'llab-quvvatlaydi** (sifati past). ## **Moslashtirish (fine-tuning) bugun oddiy noutbukda mumkin** — bu ochiq imkoniyat.

</details>

---

⬅️ [2-dars](02-Challenges-and-Limitations.md) · 🏠 [Modul](README.md) · ➡️ [62-modul](../62-LLM-Engineering-Introduction/README.md)
