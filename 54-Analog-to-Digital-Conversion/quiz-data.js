window.QUIZ = {
  id: "54",
  title: "Analogdan raqamliga",
  subtitle: "Sample rate va Nayqvist, aliasing, bit chuqurligi va SNR, bitrate, normallashtirish, qayta namunalash, augmentatsiya va segmentatsiya",
  next: { label: "Audio xususiyatlarini ajratish", href: "../55-Audio-Feature-Extraction/README.md" },
  questions: [
    {
      q: "Nima uchun Whisper uchun 16 kHz sample rate yetarli, 44.1 kHz esa ortiqcha hisoblanadi?",
      type: "single",
      options: [
        "16 kHz da bit chuqurligi avtomatik 24 bit ga oshib, sifat saqlanadi",
        "44.1 kHz faqat stereo musiqa yozuvlari uchun mo'ljallangan format",
        "Nutqning ma'noli chastotalari 8 kHz gacha, bu 16 kHz ning Nayqvisti",
        "16 kHz da aliasing umuman yuz bermaydi, 44.1 kHz da esa yuz beradi"
      ],
      answer: [2],
      explain: "Nayqvist = sample rate / 2, ya'ni 16 kHz 8 kHz gacha chastotani saqlaydi. 44.1 kHz 2.76× ko'proq ma'lumot beradi, lekin foyda yo'q — Whisper baribir 16 kHz ga tushiradi.",
      lesson: { title: "Sample rate, bit chuqurligi va bitrate", href: "01-Sample-Rate-Bit-Depth-Bit-Rate.md" }
    },
    {
      q: "Darsdagi aliasing formulasi bilan kod nima chiqaradi?",
      code: "SR = 8000\nf = 7000\na = abs(((f + SR/2) % SR) - SR/2)\nprint(a)",
      type: "single",
      options: ["7000.0", "1000.0", "3000.0", "4000.0"],
      answer: [1],
      explain: "(7000 + 4000) % 8000 = 3000, 3000 − 4000 = −1000, moduli 1000.0. 8 kHz sample rate da 7000 Hz lik tovush 1000 Hz bo'lib \"eshitiladi\" — bu shunchaki yo'qotish emas, buzilish.",
      lesson: { title: "Sample rate, bit chuqurligi va bitrate", href: "01-Sample-Rate-Bit-Depth-Bit-Rate.md" }
    },
    {
      q: "24 kHz dagi faylni 8 kHz ga o'tkazish uchun quyidagi kod yozildi. Asosiy muammo nima?",
      code: "y, sr = librosa.load('a.wav', sr=24000)\ny8 = y[::3]\nsf.write('a8.wav', y8, 8000)",
      type: "single",
      options: [
        "Anti-aliasing filtr yo'q: 4 kHz dan yuqorisi pastga buklanadi",
        "Fayl uzunligi 3 baravar ortib, audio sekin ijro etiladi",
        "sf.write 8000 Hz sample rate ni qabul qilmay, xato beradi",
        "y[::3] faqat stereo fayllarda ishlaydi, mono faylda xato beradi"
      ],
      answer: [0],
      explain: "Har 3-namunani olish filtrsiz kesish: Nayqvistdan yuqori chastotalar aliasing bilan past chastota sifatida paydo bo'ladi. To'g'ri usul — librosa.resample(y, orig_sr=24000, target_sr=8000), u filtrni o'zi qo'llaydi.",
      lesson: { title: "Sample rate, bit chuqurligi va bitrate", href: "01-Sample-Rate-Bit-Depth-Bit-Rate.md" }
    },
    {
      q: "Nutq faylida 16 bit kvantlashning o'lchangan SNR i 82.06 dB, darslik formulasi 6.02·b + 1.76 esa 98.08 dB beradi. ~16 dB farqning sababi nima?",
      type: "single",
      options: [
        "16 bit da haqiqiy darajalar soni formulada hisoblanganidan kam",
        "Kvantlash xatosi 16 bit da tasodifiy bo'lmay, signalga bog'lanadi",
        "Formula to'liq shkalali sinus uchun, nutq krest-faktori esa 19.11 dB",
        "SNR 10·log10 o'rniga 20·log10 bilan noto'g'ri hisoblangani"
      ],
      answer: [2],
      explain: "Nutq shkalaning faqat bir qismidan foydalanadi. Tuzatilgan formula 6.02·b + 1.76 − krest + 3 16 bit uchun 81.97 dB beradi — o'lchangandan farqi 0.09 dB. Tasodifiylik buzilishi faqat 2 va 4 bit da kuzatilgan.",
      lesson: { title: "Sample rate, bit chuqurligi va bitrate", href: "01-Sample-Rate-Bit-Depth-Bit-Rate.md" }
    },
    {
      q: "Kursning stereo CD misoli uchun kod nima chiqaradi?",
      code: "def bitrate(sr, bit, kanal):\n    return sr * bit * kanal\n\nprint(bitrate(44100, 16, 2))",
      type: "single",
      options: ["705600", "1058400", "2822400", "1411200"],
      answer: [3],
      explain: "bitrate = sample_rate × bit × kanal = 44100 × 16 × 2 = 1 411 200 bit/s. Kursning \"taxminan 1 400 000\" degani to'g'ri; 1 058 400 esa 44.1k/24bit mono fayl uchun.",
      lesson: { title: "Sample rate, bit chuqurligi va bitrate", href: "01-Sample-Rate-Bit-Depth-Bit-Rate.md" }
    },
    {
      q: "Darsdagi \"eng ko'p uchraydigan xatolar\" ro'yxatiga ko'ra qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "16 kHz dagi y ni sf.write(\"out.wav\", y, 8000) bilan yozish faylni sekinlashtiradi",
        "sf.read(..., dtype=\"int16\") qiymatlari −32768..32767, modelga float kerak",
        "Stereo fayl (n, 2) shaklda o'qiladi va y.mean(axis=1) bilan mono ga aylantiriladi",
        "sf.write da sample rate ni o'zgartirish librosa.resample bilan bir xil natija beradi",
        "int16 massivni to'g'ridan-to'g'ri modelga berish natijaga ta'sir qilmaydi, model moslashadi"
      ],
      answer: [0, 1, 2],
      explain: "Metadata dagi sample rate ni almashtirish signalni qayta namunalamaydi, faqat tezligini buzadi. int16 ni /32768.0 bilan float ga o'tkazish, stereoni esa mono ga aylantirish kerak — aks holda model ma'nosiz natija beradi.",
      lesson: { title: "Sample rate, bit chuqurligi va bitrate", href: "01-Sample-Rate-Bit-Depth-Bit-Rate.md" }
    },
    {
      q: "To'g'rimi: 8 kHz da yozilgan qo'ng'iroqni librosa bilan 16 kHz ga ko'tarsangiz, 4 kHz dan yuqori chastotalar qaytib keladi va Whisper uni to'liq polosali audio sifatida oladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "8 kHz yozuvda 4 kHz dan yuqorisi umuman yo'q, ko'tarish ularni qaytarmaydi — Whisper \"16 kHz\" deb qabul qiladi, lekin ma'lumot yo'q. Buni 4 kHz dan yuqoridagi energiya (< 0.005) orqali aniqlash mumkin.",
      lesson: { title: "Sample rate, bit chuqurligi va bitrate", href: "01-Sample-Rate-Bit-Depth-Bit-Rate.md" }
    },
    {
      q: "To'g'rimi: darsga ko'ra faqat toza audioda o'qitilgan model haqiqiy dunyoda yomon ishlaydi, shuning uchun model shovqinli ma'lumotdan ham o'rganishi kerak.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Kurs: toza audio muhim, lekin model shovqinli ma'lumotdan ham o'rganishi kerak — kalit muvozanatda. Whisper aynan shunday: 680 000 soat internetdan olingan, tozalanmagan audioda o'qitilgan.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    },
    {
      q: "Xom to'lqin shakliga z-normallash qo'llanganda 97 958 ta clipping (namunalarning 26%) paydo bo'ldi. Sababi nima?",
      type: "single",
      options: [
        "Z-normallash o'rtachani olib tashlagani uchun signal teskari bo'lib qoladi",
        "Dispersiya 1 ga keltiriladi: RMS 1.0 (0 dBFS), cho'qqilar 6.57 gacha",
        "Z-normallash sample rate ni o'zgartirib, aliasing va clipping hosil qiladi",
        "Z-normallash faqat int16 formatida clipping beradi, float32 da emas"
      ],
      answer: [1],
      explain: "RMS 1.0 bo'lgach, cho'qqi ruxsat etilgan chegaradan 6.6× yuqori bo'ladi. Z-normallash MFCC, spektrogramma kabi xususiyatlar uchun mos, to'lqin shakli uchun emas.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    },
    {
      q: "Bir nechta faylni ASR uchun normallashtirish kerak. Nima uchun cho'qqi bo'yicha emas, RMS −20 dBFS bo'yicha normallash tavsiya etiladi?",
      type: "single",
      options: [
        "RMS hamma faylni bir xil balandlikka keltiradi, cho'qqini bitta \"chert\" buzadi",
        "RMS usuli faylni siqib, uning hajmini taxminan ikki baravar kamaytiradi",
        "Cho'qqi usuli har doim clipping hosil qiladi, RMS usulida esa u bo'lmaydi",
        "RMS usuli past darajadagi fon shovqinini avtomatik olib tashlaydi"
      ],
      answer: [0],
      explain: "RMS −20 dBFS dan keyin hamma faylda RMS aynan −20.00 bo'ladi. Cho'qqi usuli esa har faylni turlicha ko'taradi (masalan, −20.87 dan −16.44 ga). RMS usulida ham clipping himoyasi qo'shiladi.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    },
    {
      q: "44.1 kHz faylni 16 kHz ga \"oddiy kesish\" bilan o'tkazmoqchisiz. Kod nima chiqaradi?",
      code: "sr44 = 44100\nk = int(sr44 / 16000)\nprint(k, sr44 / k)",
      type: "single",
      options: ["3 14700.0", "2.75625 16000.0", "2 22050.0", "2 16000.0"],
      answer: [2],
      explain: "44100 / 16000 = 2.75625 butun son emas, int() uni 2 ga qisqartiradi. y[::2] bilan 16 000 emas, 22 050 Hz olinadi — uzunlik 518 436 bo'lib, fayl sekinlashadi va aliasing paydo bo'ladi.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    },
    {
      q: "Darsdagi o'lchovga ko'ra 44.1 kHz → 16 kHz qayta namunalash uchun qaysi tanlov eng yaxshi?",
      type: "single",
      options: [
        "scipy resample_poly — eng tez va eng aniq, qo'shimcha sozlashsiz",
        "librosa.resample (sukut bo'yicha soxr_hq) — eng tez va eng aniq",
        "res_type=\"kaiser_fast\" — qo'shimcha paketsiz eng tez ishlaydi",
        "y[::k] — eng tez usul, shuning uchun katta arxivlar uchun mos"
      ],
      answer: [1],
      explain: "soxr_hq 4.2 ms da etalon natija berdi, scipy resample_poly 8.0 ms va xatosi 0.007574. kaiser_fast uchun alohida resampy paketi kerak, y[::k] esa hech qachon ishlatilmaydi.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    },
    {
      q: "ASR modelini o'qitish uchun qaysi augmentatsiyalar darsda foydali deb baholangan? (bir nechta javob)",
      type: "multi",
      options: [
        "Shovqin qo'shish",
        "Vaqt bo'yicha siljitish (np.roll)",
        "Tezlikni 0.9–1.1× o'zgartirish",
        "Signalni teskari o'girish",
        "Aks-sado qo'shish"
      ],
      answer: [0, 2, 4],
      explain: "Shovqin, tezlik va aks-sado haqiqiy dunyodagi o'zgarishlarni taqlid qiladi. Vaqt siljishi foydasiz (ASR pozitsiyaga bog'liq emas), teskari o'girish esa zararli — nutq teskari bo'lib qoladi.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    },
    {
      q: "time_stretch (1.1×) va pitch_shift (+2) dan keyin RMS −20.87 dan taxminan −24.4 dBFS ga tushdi. Amalda nima qilish kerak?",
      type: "single",
      options: [
        "Bu augmentatsiyalardan butunlay voz kechish kerak",
        "Faqat z-normallashni qo'llash kifoya qiladi",
        "Sample rate ni 44.1 kHz ga ko'tarib qayta hisoblash",
        "Augmentatsiyadan keyin audioni qayta normallashtirish"
      ],
      answer: [3],
      explain: "Fazali vokoder qayta qurishda energiyaning bir qismini yo'qotadi (~3.5 dB). Shuning uchun augmentatsiyadan keyin qayta normallashtiriladi; g'oyaning o'zi to'g'ri va foydali.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    },
    {
      q: "librosa.effects.split(top_db=20) bilan segmentatsiyada \"salom\" so'zi \"sa\" va \"om\" ga bo'linib qoldi. Dars qanday yechim taklif qiladi?",
      type: "single",
      options: [
        "Bo'laklar chegarasiga ~200 ms padding qo'shish",
        "top_db ni 5 ga tushirib, jimlikni qattiqroq ta'riflash",
        "Segmentatsiyadan oldin audioni z-normallash",
        "Faylni 8 kHz ga tushirib, keyin segmentlash"
      ],
      answer: [0],
      explain: "Jim /l/ tovushi qattiq chegarada jimlik deb qabul qilinadi, shuning uchun bo'laklarga 200 ms oldin va keyin padding qo'shiladi. top_db ni kichraytirish esa kesishni yanada ko'paytiradi.",
      lesson: { title: "ML uchun audio signalni qayta ishlash", href: "02-Audio-Signal-Processing.md" }
    }
  ]
};
