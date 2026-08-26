# 1-dars. Nutqni tanish dunyosiga xush kelibsiz ⭐

## 🎬 Boshlashdan oldin

> **"Nutqni tanish — bu sehr emas. Bu — mikrofon, raqamli signal va algoritm."**

---

## 1. Nutqni tanish nima?

```
🗣️ AYTILGAN NUTQ  →  📝 O'QILADIGAN MATN
```

> ## 🔑 **KURSNING TA'RIFI:** *"Nutqni tanish — bu aytilgan tilni o'qiladigan matnga aylantirish."*
>
> ## ⭐ **UCH BOSQICH:**
> ```
> ① Mikrofon    →  tovush to'lqinlarini elektr signalga
> ② Raqamlash   →  signalni sonlar ketma-ketligiga
> ③ Algoritm    →  sonlardan so'z va iboralarni ajratish
> ```

---

## 2. ⚠️ Nima nutqni tanish EMAS

| Bu | Nutqni tanish emas |
|---|---|
| ## 🗣️ **Nutqni tanish** *(ASR)* | ## ⭐ **audio → matn** |
| Nutqni sintez qilish *(TTS)* | ## 🔄 **matn → audio** *(60-modul, 5-dars)* |
| Tabiiy tilni tushunish *(NLU)* | ## 🧠 **matn → ma'no** |
| Ovozni tanish *(speaker ID)* | ## 👤 **audio → kim gapiryapti** |
| ## Ovozli yordamchi *(Siri)* | ## 🏆 **hammasi birgalikda** |

> ## 💥 **BU FARQ MUHIM.** ## *"Siri qanday ishlaydi?"* degan savolga javob — ## **kamida to'rt xil texnologiya**, va ular **alohida** o'qitiladi.
>
> ## 🇺🇿 **VA O'ZBEK TILIDA:** ## ASR uchun modellar **bor** *(Whisper)*, ## NLU uchun — **deyarli yo'q**. ## Bu — **muhim cheklov**.

---

## 3. Amaliy qo'llanishlar

> ### ① 📊 **Ma'lumot to'plash va tahlil**
> ```
> qo'ng'iroq yozuvlari  →  matn  →  ⭐ qidiriladigan, tahlil qilinadigan
> "mijozlar eng ko'p nimadan shikoyat qiladi?"
> ```
>
> ### ② 📞 **Avtomatlashtirilgan mijozlar xizmati**
> ```
> "qo'ng'irog'ingiz sababini ayting"  →  bo'limga yo'naltirish
> ```
>
> ### ③ 🤖 **AI til modellari**
> ```
> ovoz  →  matn  →  LLM  →  matn  →  ovoz
> ⭐ ChatGPT ovozli rejimi AYNAN shunday ishlaydi
> ```
>
> ### ④ ♿ **Qulaylik (accessibility)**
> ```
> ⭐ eshitish qobiliyati cheklangan foydalanuvchilar uchun subtitr
> ⭐ qo'l ishlatolmaydiganlar uchun ovozli boshqaruv
> ```
> ## 🏆 **BU — TEXNOLOGIYANING ENG QIMMATLI QO'LLANISHI**, ## garchi kurs uni oxirida sanab o'tsa ham.

---

## 4. 💰 Bozor

> ## 🔑 **KURSNING RAQAMLARI:**
> ```
> 2023-yil  →  $17.2 mlrd
> 2030-yil  →  $54.3 mlrd (prognoz)
> ```
> ## ⭐ Yiliga **~17.8%** o'sish *(CAGR)*.
>
> ## ⚠️ **BUNDAY PROGNOZLARGA TANQIDIY QARANG.** ## Ular **marketing tadqiqotlaridan** olinadi va ## ko'pincha **haddan tashqari optimistik** bo'ladi.
>
> ## 🏆 **ISHONCHLIROQ SIGNAL — NARXNING TUSHISHI:**
> ```
> 2018:  Google Speech-to-Text  ~$1.44 / soat
> 2025:  OpenAI Whisper API     ~$0.36 / soat
>        ⭐ mahalliy Whisper     $0.00      ← noutbukda ishlaydi
> ```

---

## 5. ⭐⭐ Amaliy hisob — 🇺🇿 loyiha uchun

```python
# 🇺🇿 Call-markaz: kuniga 1000 qo'ng'iroq, o'rtacha 4 daqiqa
SOAT_KUNIGA = 1000 * 4 / 60          # 66.7 soat/kun
KUN_YILIGA = 365

VARIANTLAR = {
    "OpenAI Whisper API":  0.36,     # $/soat
    "Google STT standart": 0.96,
    "Azure Speech":        1.00,
    "Mahalliy Whisper":    0.00,     # ⭐ + elektr va server
}

print(f"  {SOAT_KUNIGA:.0f} soat/kun · {SOAT_KUNIGA*KUN_YILIGA:,.0f} soat/yil\n")
for nom, narx in VARIANTLAR.items():
    yillik = SOAT_KUNIGA * KUN_YILIGA * narx
    print(f"  {nom:22s} ${yillik:10,.0f}/yil   "
          f"🇺🇿 {yillik*12650:,.0f} so'm")
```

```
  67 soat/kun · 24,333 soat/yil

  OpenAI Whisper API     $     8,760/yil   🇺🇿 110,814,000 so'm
  Google STT standart    $    23,360/yil   🇺🇿 295,504,000 so'm
  Azure Speech           $    24,333/yil   🇺🇿 307,812,450 so'm
  Mahalliy Whisper       $         0/yil   🇺🇿 0 so'm
```

> ## 🏆🏆 **MAHALLIY WHISPER — YILIGA $8 760 TEJAM.** ## Va u **oddiy noutbukda** ishlaydi *(o'lchandi: 23.5 s audio → 1.9 s, 60-modul)*.
>
> ## ⚠️ **LEKIN "BEPUL" — TO'LIQ EMAS:**
> ```
> ⭐ server yoki noutbuk    →  bir martalik xarajat
> ⭐ elektr                 →  yiliga ~$50–200
> ⭐ sozlash va qo'llab-quvvatlash  →  💥 ENG KATTA xarajat
> ⚠️ API — sifat va yangilanish AVTOMATIK
> ```

---

## 6. 🇺🇿 Bu texnologiya o'zbek tilida ishlaydimi?

> ## ✅ **HA — LEKIN KUTGANINGIZDEK EMAS.**
> ```
> ⭐ Whisper o'zbek tilini QO'LLAB-QUVVATLAYDI (99 tildan biri)
> ⚠️ lekin o'zbekcha o'quv ma'lumoti KAM edi
> 💥 natijada aniqlik inglizchadan SEZILARLI past
> ```
>
> ## 🔬 **BUNI 60-MODULDA O'LCHAYMIZ** — ## taxmin bilan emas, **o'z ovozingiz bilan**.
>
> ## 🏆 **VA BU — KURSDA UMUMAN YO'Q MAVZU.** ## Kurs faqat **inglizcha** audio bilan ishlaydi.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** ASR va TTS farqi nima?

**M2.** Nutqni tanishning uch bosqichi qaysi?

**M3.** Nima uchun bozor prognozlariga tanqidiy qarash kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **ASR**: audio → matn. ## **TTS**: matn → audio. ## Ular — **teskari** jarayonlar.

**M2.** ## ① mikrofon *(tovush → elektr)* ## ② raqamlash *(elektr → sonlar)* ## ③ algoritm *(sonlar → so'zlar)*.

**M3.** ## Ular **marketing tadqiqotlaridan**. ## Ishonchliroq signal — ## **narxning tushishi** *(2018: $1.44/soat → 2025: $0.36)*.

</details>

### 🟡 O'rta

**M4.** ⭐ O'z loyihangiz uchun narx hisobini qiling.

<details>
<summary>✅ Yechim</summary>

```python
def narx_hisobi(soat_kuniga, kun_yiliga=365, kurs=12650):
    """🇺🇿 ASR variantlarini yillik narx bo'yicha solishtiradi."""
    VARIANTLAR = {
        "OpenAI Whisper API":    0.36,
        "Google STT standart":   0.96,
        "Google STT enhanced":   1.44,
        "Azure Speech":          1.00,
        "AWS Transcribe":        1.44,
        "Mahalliy Whisper":      0.00,
    }
    soat = soat_kuniga * kun_yiliga
    print(f"  {soat:,.0f} soat/yil\n")
    eng_arzon_pulli = min(v for k, v in VARIANTLAR.items() if v > 0)
    for nom, narx in sorted(VARIANTLAR.items(), key=lambda x: x[1]):
        y = soat * narx
        belgi = "🏆" if narx == 0 else ("⭐" if narx == eng_arzon_pulli
                                        else "  ")
        print(f"  {belgi} {nom:22s} ${y:10,.0f}   "
              f"🇺🇿 {y*kurs:15,.0f} so'm")

    # ⭐ mahalliy variantning HAQIQIY narxi
    server = 1200          # bir martalik GPU server
    elektr = 150           # yiliga
    qollab = 2000          # yiliga (vaqt)
    print(f"\n  💡 'Mahalliy Whisper' ning HAQIQIY narxi:")
    print(f"     server ${server} (bir marta) + elektr ${elektr}/yil "
          f"+ qo'llab ${qollab}/yil")
    print(f"     1-yil: ${server+elektr+qollab:,} · "
          f"2-yil: ${elektr+qollab:,}")
    api = soat * VARIANTLAR["OpenAI Whisper API"]
    if api > elektr + qollab:
        print(f"     ✅ 2-yildan boshlab API dan ${api-elektr-qollab:,.0f} "
              f"arzon")
    else:
        print(f"     💥 API ARZONROQ — mahalliy yechim BEHUDA")


narx_hisobi(1000 * 4 / 60)      # call-markaz
narx_hisobi(2 * 1 / 60)         # kichik loyiha: kuniga 2 daqiqa
```

## 🏆 **IKKINCHI CHAQIRUVGA E'TIBOR BERING** — ## kichik loyihada **API arzonroq**. ## Mahalliy yechim **hamma joyda to'g'ri emas**.

</details>

**M5.** ⭐ Har qo'llanish uchun qaysi texnologiya kerakligini aniqlang.

<details>
<summary>✅ Yechim</summary>

| Vazifa | Kerak |
|---|---|
| Uchrashuv yozuvini matnga | ## ⭐ **ASR** |
| "Chiroqni yoq" ni bajarish | ## ASR + **NLU** |
| Kitobni ovozli qilish | ## 🔄 **TTS** |
| "Bu kim gapiryapti?" | ## 👤 **speaker ID** |
| Qo'ng'iroqlarda kayfiyat tahlili | ## ASR + **sentiment** |
| ChatGPT ovozli rejimi | ## 🏆 **ASR + LLM + TTS** |

## 💡 **ENG KO'P XATO** — ## *"ASR ni qo'ysam, ovozli yordamchi bo'ladi"*. ## 💥 **Yo'q** — ASR faqat **matn** beradi.

</details>

---

## 📌 Xulosa

```
🗣️ NUTQ  →  ① mikrofon  →  ② raqamlash  →  ③ algoritm  →  📝 MATN

⭐ ASR ≠ TTS ≠ NLU ≠ speaker ID
⭐ Bozor: $17.2 mlrd (2023) → $54.3 mlrd (2030)
🏆 Ishonchliroq signal: narx 2018 $1.44/soat → 2025 $0.36/soat
🏆 Mahalliy Whisper — $0.00, oddiy noutbukda ishlaydi
⚠️ lekin kichik loyihada API ARZONROQ
🇺🇿 O'zbek tili Whisper'da BOR, lekin aniqligi past — 60-modulda o'lchaymiz
```

> ## 🏆 **KURSNING ENG TO'G'RI JUMLASI:** *"Bu sehr emas — bu fon rejimida ishlayotgan tizim."*

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Kurs yondashuvi](02-Course-Approach.md)
