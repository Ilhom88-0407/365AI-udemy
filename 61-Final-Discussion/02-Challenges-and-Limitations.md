# 2-dars. Muammolar va cheklovlar ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs oltita muammoni sanaydi. Biz beshtasini o'lchadik. Uchtasi tasdiqlandi, biri qisman, biri esa — kurs umuman aytmagan, lekin eng xavflisi."**

---

## 1. Kursning ro'yxati

| # | Muammo | ## Bizning o'lchov |
|---|---|---|
| ① | Aksentlar va dialektlar | ## ⚠️ **sinovimiz yetarli emas** |
| ② | Ko'p tillilik, til almashinuvi | ## ✅ **tasdiqlandi** |
| ③ | Fon shovqini | ## ✅ **tasdiqlandi** *(59, 60-modul)* |
| ④ | Kontekst, kinoya, idiomalar | ## ⚠️ **o'lchamadik** |
| ⑤ | Maxfiylik | ## ✅ **o'lchandi** |
| ⑥ | Yangi so'zlar, jargon | ## ⚠️ **qisman** — quyida |
| ## ⑦ | ## 💥 **GALLYUTSINATSIYA** | ## 💥 **KURS AYTMAGAN** |

---

## 2. ⚠️ Aksentlar — bizning sinovimiz **yetarli emas** edi

`gTTS` turli mintaqaviy ovozlarni beradi (`tld` parametri):

```python
for tld, nom in [("com", "AQSh"), ("co.uk", "Britaniya"), ("com.au", "Avstraliya"),
                 ("co.in", "Hindiston"), ("ie", "Irlandiya"), ("co.za", "J.Afrika")]:
    gTTS(text=M, lang="en", tld=tld).save(f"acc_{nom}.mp3")
    z = librosa.load(f"acc_{nom}.mp3", sr=16000)[0]
    print(f"{nom:12s} WER {wer(n(M), n(asr(z)['text'])):.4f}")
```

### 📊 Natija

| Ovoz | Davomiylik | WER | Xato |
|---|---|---|---|
| AQSh | 4.63 s | 0.1538 | `river bank → riverbank` |
| Britaniya | 4.63 s | 0.1538 | `river bank → riverbank` |
| ## Avstraliya | 5.26 s | ## 🏆 **0.0000** | — |
| Hindiston | 5.09 s | 0.1538 | `river bank → riverbank` |
| Irlandiya | 4.63 s | 0.1538 | `river bank → riverbank` |
| J.Afrika | 4.63 s | 0.1538 | `river bank → riverbank` |

> ## 🔬 **YAGONA "XATO" — `river bank` → `riverbank`.** ## Bu **tanish xatosi emas**, ## bu — **qo'shib yozish** *(compounding)* qarori.
>
> ## ## 🏆 **YA'NI OLTITA AKSENTDA HAM XATO NOL.**

> ## ⚠️⚠️ **LEKIN BU KURSNI RAD ETMAYDI.**
>
> ## 💥 **SABAB — SINOVIMIZ ZAIF:** ## `gTTS` ning "aksentlari" — ## **sun'iy variantlar**, haqiqiy mintaqaviy so'zlovchilar emas. ## Ular **bir xil sintez modelidan** kelib chiqadi.
>
> ## ## 🔑 **HAQIQIY SINOV UCHUN KERAK:** ## turli mintaqalardan **haqiqiy odamlar** yozuvi ## *(masalan `Common Voice`, `L2-ARCTIC` datasetlari)*.

> ## 🏆 **VA MANA HALOL XULOSA:** ## *"Aksentlar muammo emas"* deb ayta olmaymiz — ## **bunga isbotimiz yo'q**. ## ## ⭐ **Aytishimiz mumkin bo'lgan narsa:** ## sintetik aksent variatsiyasi **ta'sir qilmadi**.

---

## 3. ✅ Til almashinuvi — tasdiqlandi

*(1-darsda o'lchadik)*

```
asl    : The meeting is at nine. La reunión es a las nueve. Thank you.
tanildi: The meeting is at 9. La reunion is a last-new eve. Thank you.
                                💥 bema'nilik
```

> ## ✅ **KURS HAQ.** ## Whisper **butun fayl uchun bitta til** tanlaydi.

---

## 4. ✅ Fon shovqini — tasdiqlandi va **kuchaytirildi**

*(59 va 60-modullarda o'lchadik)*

| SNR | Google | ## Whisper |
|---|---|---|
| 30 dB | 0.0328 | ## 🏆 **0.0164** |
| 10 dB | 0.0656 | ## 🏆 **0.0492** |
| ## 0 dB | ## 🏆 **0.0656** | ## 💥 **0.2623** |
| ## −5 dB | ## 🏆 **0.4262** | ## 💥💥 **5.3279** |

> ## ✅ **KURS HAQ:** shovqin **jiddiy to'siq**.
>
> ## 💥 **VA BIZ QO'SHAMIZ:** ## *"shovqinni kamaytirish"* usullari — ## 25 ta o'lchovdan **hech birida** yordam bermadi *(59-modul)*. ## ## 🔑 **Eng yaxshi usul — HECH NARSA QILMASLIK.**

---

## 5. ⚠️ Yangi so'zlar va jargon — **qisman** tasdiqlandi

> ## 🔑 **KURS AYTADI:** *"Yangi so'zlar, sleng va jargon — cheklov. ## Modellar **qayta o'qitilishi** kerak."*

### 🔬 Beshta sinov

| Turkum | Matn | ## WER |
|---|---|---|
| 2020 gacha atamalar | `The transformer model uses attention and embeddings.` | ## 🏆 **0.0000** |
| ## 2024 jargon | `The agent used retrieval augmented generation with vector embeddings.` | ## 🏆 **0.0000** |
| AI jargon | `We fine-tuned a LoRA adapter with RLHF on the base checkpoint.` | ⚠️ 0.0833 |
| ## Qisqartmalar | `The GPU has sixteen gigabytes of VRAM and uses CUDA cores.` | ## ⚠️ **0.2727** |
| ## Brend nomlari | `I use Hugging Face, PyTorch, LangChain and Chroma daily.` | ## 💥 **0.4444** |

### 💥 Aniq xatolar

```
LoRA        →  Laura          💥 ism deb tushundi
PyTorch     →  pie torch      💥 ikkiga bo'ldi
LangChain   →  lang chain     💥 ikkiga bo'ldi
VRAM        →  RAM            💥💥 "V" TUSHIB QOLDI
sixteen gigabytes → 16GB      ⚠️ format, xato emas
```

> ## 🏆 **KUTILMAGAN NATIJA:** ## `retrieval augmented generation`, `RLHF`, `checkpoint`, `embeddings` — ## **hammasi to'g'ri**. ## ## 💥 **`Hugging Face`, `PyTorch`, `LangChain` esa — xato.**

| Nima ishlaydi | Nima ishlamaydi |
|---|---|
| ## ✅ **Texnik atamalar** *(so'zlardan tuzilgan)* | ## 💥 **Brend nomlari** |
| ## ✅ **Qisqartmalar** *(RLHF, CUDA, GPU)* | ## 💥 **Aralash so'zlar** *(`PyTorch`)* |
| ✅ Umumiy lug'at | ## 💥 **Bir harfli farq** *(`VRAM`/`RAM`)* |

> ## 🔑 **SABAB:** ## `retrieval augmented generation` — ## bu **oddiy inglizcha so'zlar**, model ularni **biladi**. ## ## 💥 `PyTorch` — bu **yangi so'z**, lug'atda **yo'q**.
>
> ## ## 🏆 **XULOSA:** kurs **qisman** haq. ## Muammo *"yangi so'zlar"*da emas, ## **"lug'atda yo'q ATOKAR so'zlar"**da.

### 💥💥 `VRAM` → `RAM` — eng xavfli xato

> ## ⚠️ **BITTA HARF TUSHDI — VA MA'NO O'ZGARDI.** ## `VRAM` (videokarta xotirasi) ≠ `RAM` (tizim xotirasi). ## ## 🔑 **VA WER BUNI "1 TA XATO" DEB SANAYDI** — ## artikl tushishi bilan **bir xil og'irlikda** *(58-modul, 4-dars)*.

---

## 6. ⭐⭐ Maxfiylik — o'lchaymiz

> ## 🔑 **KURS AYTADI:** *"Doimiy tinglayotgan qurilmalar ## nozik ma'lumotni yozib olishi mumkin."*

### 🔬 Nima yuboriladi?

| Usul | Kechikish | ## Serverga yuborilgan |
|---|---|---|
| ## **Mahalliy Whisper** *(CPU)* | ## 🏆 **2.89 s** | ## 🏆 **0 bayt** |
| Google bulut API | ## 💥 **6.24 s** | ## 💥 **0.72 MB** |

> ## 🏆🏆 **MAHALLIY 2.16× TEZ VA 0 BAYT YUBORADI.**
>
> ## ## 🔑 **YA'NI MAXFIYLIK — NARX EMAS, BONUS.**

### ⚠️ Audio **matndan ko'ra ko'proq** narsani oshkor qiladi

| Audiodan bilish mumkin | Matndan |
|---|---|
| Aytilgan so'zlar | ✅ |
| ## Kim gapirayotgani *(ovoz izi)* | ## 💥 **yo'q** |
| ## Jinsi, taxminiy yoshi | ## 💥 **yo'q** |
| ## Aksent → mintaqa | ## 💥 **yo'q** |
| ## Hissiy holat | ## 💥 **yo'q** |
| ## Fon *(uy? ofis? ko'cha?)* | ## 💥 **yo'q** |
| ## Yonidagi boshqa odamlar | ## 💥 **yo'q** |
| ## Sog'liq belgilari | ## 💥 **yo'q** |

> ## 💥💥 **AUDIO — BIOMETRIK MA'LUMOT.** ## Uni yuborish — matn yuborishdan ## **butunlay boshqa daraja**.

### ✅ Amaliy qoida

```
┌────────────────────────────────────────────────────────────┐
│  Audio nozikmi?                                            │
│    · tibbiy suhbat?         → ✅ MAHALLIY                  │
│    · yuridik/moliyaviy?     → ✅ MAHALLIY                  │
│    · shaxsiy xabar?         → ✅ MAHALLIY                  │
│    · bolalar ovozi?         → ✅ MAHALLIY                  │
│    · ochiq podkast?         → ⬜ bulut ham mumkin          │
│                                                            │
│  Va: FOYDALANUVCHIGA AYTING nima qilinayotganini.          │
└────────────────────────────────────────────────────────────┘
```

> ## ⭐ **VA ENDI BU — OSON TANLOV.** ## Mahalliy Whisper **tezroq**, **bepul** va ## **hech narsa yubormaydi**.

---

## 7. 💥💥💥 Kurs **aytmagan** muammo: gallyutsinatsiya

*(60-modulda batafsil o'lchadik)*

```
−5 dB SNR da Whisper qaytardi:
  "I am a sound engineer, a sound engineer, a sound engineer, ..." × 103

  so'zlar    : 338   (kutilgan 61)
  noyob      : 24    (7.1%)
  nutq tezligi: 14.38 so'z/s   (odam ≈ 2.5)
```

> ## 💥💥💥 **BU — ENG XAVFLI TURDAGI XATO.**
>
> ## ⚠️ **NEGA?** Chunki natija **"to'g'ri ko'rinadi"**: ## grammatik jihatdan to'g'ri jumlalar, ## ishonchli ohang, hech qanday xato xabari.
>
> ## ## 🔑 **VA TIBBIY YOKI YURIDIK KONTEKSTDA** ## bu **o'ylab topilgan matn** hujjatga tushishi mumkin.

### ⚠️ Gallyutsinatsiya **faqat shovqinda emas**

| Sabab | Namoyon bo'lishi |
|---|---|
| ## Shovqin | ## 💥 **takrorlanish sikli** *(o'lchadik)* |
| Jimlik | ## 💥 *"Thank you for watching"*, *"Subtitles by..."* |
| Musiqa | ## 💥 **qo'shiq matni o'ylab topiladi** |
| Chet el nutqi | ## 💥 **noto'g'ri tilga "tarjima"** |
| Juda qisqa audio | ## ⚠️ **fon shovqinidan so'z yasaydi** |

> ## 🔑 **"Thank you for watching" — MASHHUR HOLAT.** ## Whisper **YouTube subtitrlarida** o'qitilgan, ## va jim joyda shu iborani **"eslaydi"**.

### ✅ Himoya

```python
def ishonchli_mi(matn, davomiylik_s):
    """Uch qatlamli tekshiruv."""
    w = [x.lower().strip(".,!?;:") for x in matn.split()]
    if not w:
        return False, "bo'sh"
    if len(set(w)) / len(w) < 0.35:                 # ① takrorlanish
        return False, "takrorlanish sikli"
    if len(w) / davomiylik_s > 4.0:                 # ② imkonsiz tezlik
        return False, "nutq tezligi imkonsiz"
    if len(w) / davomiylik_s < 0.5:                 # ③ model taslim
        return False, "juda kam so'z"
    return True, "ok"
```

| Qatlam | Nimani tutadi |
|---|---|
| ① Noyob so'zlar ulushi | ## ⭐ **takrorlanish sikli** |
| ② Yuqori tezlik chegarasi | ## ⭐ **generatsiya portlashi** |
| ③ Past tezlik chegarasi | ## ⭐ **model taslim bo'lishi** |

> ## ⚠️ **BU DETEKTOR HAMMASINI TUTMAYDI.** ## *"Thank you for watching"* — **normal tezlik**, **normal takrorlanish**. ## ## 🔑 **Uni tutish uchun `no_speech_prob` va ## qora ro'yxat kerak.**

---

## 🎯 Nazorat savollari

1. Aksentlar bo'yicha sinovimiz nimani ko'rsatdi va nega bu yetarli emas?
2. Whisper qaysi turdagi yangi so'zlarni tanidi, qaysilarini yo'q?
3. `VRAM → RAM` xatosi nega xavfli?
4. Mahalliy Whisper bulutdan qanchalik tez va nechta bayt yuboradi?
5. Audio matndan ko'ra qanday qo'shimcha ma'lumot beradi?
6. Kurs aytmagan eng xavfli muammo nima?

<details>
<summary>Javoblar</summary>

1. Oltita sintetik aksentda ham **xato nol** (`river bank → riverbank` — bu qo'shib yozish qarori, tanish xatosi emas). **Lekin bu kursni rad etmaydi**: `gTTS` "aksentlari" — bitta sintez modelining variantlari, **haqiqiy mintaqaviy so'zlovchilar emas**. Haqiqiy sinov uchun `Common Voice` kabi datasetlar kerak.
2. ## **Tanidi:** `retrieval augmented generation`, `RLHF`, `CUDA`, `embeddings`, `checkpoint` — ya'ni **oddiy so'zlardan tuzilgan** atamalar va **qisqartmalar**. ## **Tanimadi:** `LoRA` → `Laura`, `PyTorch` → `pie torch`, `LangChain` → `lang chain` — ya'ni **brend nomlari** va **aralash so'zlar**.
3. `VRAM` (videokarta xotirasi) ≠ `RAM` (tizim xotirasi) — **ma'no o'zgardi**. Va WER buni **artikl tushishi bilan bir xil og'irlikda** sanaydi (58-modul, 4-dars).
4. **2.16× tez** (2.89 s vs 6.24 s) va **0 bayt** yuboradi (Google — **0.72 MB**). Maxfiylik — **narx emas, bonus**.
5. Kim gapirayotgani *(ovoz izi)*, jinsi, taxminiy yoshi, mintaqasi, **hissiy holati**, foni *(uy/ofis/ko'cha)*, yonidagi odamlar, **sog'liq belgilari**. ## **Audio — biometrik ma'lumot.**
6. ## **Gallyutsinatsiya.** −5 dB da Whisper **338 ta so'z** qaytardi (`"a sound engineer"` × 103). Xavfli, chunki natija **to'g'ri ko'rinadi** — grammatik jihatdan to'g'ri, ishonchli ohangda, xato xabarisiz.

</details>

---

⬅️ [1-dars](01-Modern-Practices.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-The-Future.md)
