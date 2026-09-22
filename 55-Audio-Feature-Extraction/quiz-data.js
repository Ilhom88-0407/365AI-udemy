window.QUIZ = {
  id: "55",
  title: "Audio xususiyatlarini ajratish",
  subtitle: "ZCR, RMS va arzon VAD, spektral xususiyatlar, MFCC quvuri va Cohen's d, freymlash va agregatsiya, DFT, FFT, STFT va oyna funksiyalari",
  next: { label: "Texnologiya mexanikasi", href: "../56-Technology-Mechanics/README.md" },
  questions: [
    {
      q: "O'lchovda ovozsiz freymlarda ZCR ovozlilarga qaraganda 2.49× yuqori chiqdi (0.2355 vs 0.0947). Buning sababi nima?",
      type: "single",
      options: [
        "Ovozsiz tovushlar balandroq aytiladi, shuning uchun signal nolni ko'proq kesadi",
        "Ovozsiz tovushlarda ovoz paychalari tezroq davriy tebranadi",
        "Ovozsiz tovushlar (s, sh, f, t) havo oqimidan shovqin, energiyasi 4–8 kHz da",
        "Ovozsiz freymlar aslida jimlik, jimlikda ZCR doim eng yuqori bo'ladi"
      ],
      answer: [2],
      explain: "Ovozli tovushlarda paychalar f0 ~138 Hz da davriy tebranadi — o'tishlar sekin. Ovozsizlar esa havo oqimidan hosil bo'lgan yuqori chastotali shovqin, shuning uchun nol chizig'ini tez-tez kesadi. Aslida ovozsizlar jimroq aytiladi.",
      lesson: { title: "Vaqt domeni xususiyatlari", href: "01-Time-Domain-Features.md" }
    },
    {
      q: "Nima uchun RMS da kvadrat va ildiz kerakligini ko'rsatuvchi kod nima chiqaradi?",
      code: "import numpy as np\n\nx = np.array([3.0, -3.0, 3.0, -3.0])\nrms = np.sqrt((x ** 2).mean())\nprint(rms, x.mean())",
      type: "single",
      options: ["0.0 0.0", "3.0 0.0", "3.0 3.0", "9.0 0.0"],
      answer: [1],
      explain: "Oddiy o'rtacha musbat va manfiy qiymatlar bir-birini yo'qotgani uchun 0.0 beradi. Kvadrat qiymatlarni musbat qiladi (o'rtacha 9.0), ildiz esa asl birlikka qaytaradi — RMS 3.0.",
      lesson: { title: "Vaqt domeni xususiyatlari", href: "01-Time-Domain-Features.md" }
    },
    {
      q: "percentile(rms, 25) × 2.5 chegarali VAD faylning atigi 37% ini nutq deb topdi, holbuki fayl 97.7% nutq. Dars buni qanday tushuntiradi?",
      type: "single",
      options: [
        "Bu faylda jimlik deyarli yo'q, 25-persentil jimlik emas, jim nutq bo'lib chiqdi",
        "ZCR chegarasi 0.35 juda past bo'lgani uchun ko'p freym tashlab yuborildi",
        "RMS freym uzunligi 400 namuna bo'lgani uchun energiya noto'g'ri hisoblandi",
        "Percentil hisoblash librosa da jimlik freymlarini avtomatik olib tashlaydi"
      ],
      answer: [0],
      explain: "Fayl butunlay nutq bo'lgani uchun p25 ancha baland qiymat berdi va chegara 0.09483 bo'lib ketdi. Xulosa: chegarani ma'lumotdan olish yetarli emas, ma'lumotning o'zi qanday ekanini bilish kerak; librosa.effects.split chegarani cho'qqiga bog'laydi.",
      lesson: { title: "Vaqt domeni xususiyatlari", href: "01-Time-Domain-Features.md" }
    },
    {
      q: "Spektral flatness ovozli freymlarda ~0.02, ovozsizlarda ~0.10 chiqdi. Flatness aslida nimani o'lchaydi?",
      type: "single",
      options: [
        "Energiyaning 85% i qaysi chastotagacha to'planganini",
        "Spektr tonga (o'tkir cho'qqilar) yoki shovqinga (tekis) qanchalik o'xshashligini",
        "Spektrdagi chastotalar o'rtacha chastota atrofida qanchalik tarqoqligini",
        "Freym ichida signal nol chizig'ini necha marta kesganini"
      ],
      answer: [1],
      explain: "Flatness = geometrik o'rtacha / arifmetik o'rtacha: garmonikali ton ~0, oq shovqin ~1. Birinchi variant rolloff, uchinchisi bandwidth, to'rtinchisi ZCR ta'rifi.",
      lesson: { title: "Chastota va vaqt-chastota domeni", href: "02-Frequency-Domain-Features.md" }
    },
    {
      q: "MFCC hisoblash qadamlarining to'g'ri tartibi qaysi?",
      type: "single",
      options: [
        "freym → mel filtrlar → FFT → DCT → |·|² → log",
        "freym → FFT → |·|² → log → DCT → mel filtrlar",
        "FFT → freym → DCT → mel filtrlar → |·|² → log",
        "freym → FFT → |·|² → mel filtrlar → log → DCT"
      ],
      answer: [3],
      explain: "Quvur: audio → freym → FFT → |·|² → mel filtrlar (koxlea modeli) → log → DCT (dekorrelyatsiya) → MFCC. Kurs DCT ni aytmaydi, lekin u qo'shni mel filtrlarning bog'liqligini yo'qotadi.",
      lesson: { title: "Chastota va vaqt-chastota domeni", href: "02-Frequency-Domain-Features.md" }
    },
    {
      q: "Quyidagi kod klassik ASR kirishini tayyorlaydi. U nima chiqaradi?",
      code: "M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13, n_fft=512, hop_length=160)\nX = np.vstack([M, librosa.feature.delta(M),\n               librosa.feature.delta(M, order=2)])\nprint(X.shape[0])",
      type: "single",
      options: ["13", "26", "39", "2352"],
      answer: [2],
      explain: "13 MFCC + 13 delta + 13 delta² = 39 o'lcham — klassik ASR tizimlarining standart kirishi. 2352 esa freymlar soni (X.shape[1]).",
      lesson: { title: "Chastota va vaqt-chastota domeni", href: "02-Frequency-Domain-Features.md" }
    },
    {
      q: "Ovozli va ovozsiz freymlarni ajratishda Cohen's d o'lchovidan qanday xulosalar chiqadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Eng kuchli ajratuvchi eng oddiy xususiyat — RMS (d = 1.705)",
        "MFCC c1 hamma xususiyatdan kuchli ajratuvchi bo'lib chiqdi",
        "Spektral bandwidth deyarli ajratmaydi (d = 0.079)",
        "delta koeffitsientlari freym-freym tasniflashda past natija berdi (d ≈ 0.09)",
        "Spektral centroid eng zaif xususiyat bo'lib chiqdi"
      ],
      answer: [0, 2, 3],
      explain: "RMS birinchi, ZCR ikkinchi, centroid uchinchi (0.717), MFCC c1 esa to'rtinchi (0.583). delta holatni emas, o'zgarishni o'lchaydi, shuning uchun u ketma-ketlik modellarida foydali.",
      lesson: { title: "Chastota va vaqt-chastota domeni", href: "02-Frequency-Domain-Features.md" }
    },
    {
      q: "Nima uchun MFCC da aynan 13 koeffitsient sanoat standarti hisoblanadi?",
      type: "single",
      options: [
        "13 ta koeffitsient dispersiyaning 89.4% ini beradi, 40 ta esa atigi +10.6% qo'shib, o'lchamni 3× oshiradi",
        "librosa 13 dan ortiq koeffitsientni hisoblay olmaydi",
        "13 ta koeffitsient mel filtrlar soniga teng bo'lishi shart",
        "c0 dan boshqa hamma koeffitsientlar 13-dan keyin nolga teng bo'ladi"
      ],
      answer: [0],
      explain: "Bu tasodifiy son emas, dispersiya tahlilining natijasi: c0 yolg'iz 57.56%, 13 ta 89.40%. Mel filtrlar esa odatda 40 ta bo'ladi.",
      lesson: { title: "Chastota va vaqt-chastota domeni", href: "02-Frequency-Domain-Features.md" }
    },
    {
      q: "To'g'rimi: Whisper kirish sifatida 13 ta MFCC koeffitsientidan foydalanadi, chunki ular eng ixcham va dekorrelyatsiyalangan.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Whisper 80 kanalli mel-spektrogramma ishlatadi (30 s → 80 × 3000). DCT ma'lumotning bir qismini yo'qotadi; neyron tarmoq o'zi siqa oladi, shuning uchun unga to'liq mel-spektrogramma foydaliroq.",
      lesson: { title: "Chastota va vaqt-chastota domeni", href: "02-Frequency-Domain-Features.md" }
    },
    {
      q: "16 kHz audio uchun standart freym parametrlari. Kod nima chiqaradi?",
      code: "sr = 16000\nnw, nh = int(sr * 25 / 1000), int(sr * 10 / 1000)\nprint(nw, nh, (nw - nh) / nw)",
      type: "single",
      options: ["400 160 0.4", "250 100 0.6", "400 250 0.375", "400 160 0.6"],
      answer: [3],
      explain: "25 ms = 400 namuna, 10 ms = 160 namuna, ustma-ustlik (400 − 160) / 400 = 0.6, ya'ni 60%. Bu soniyasiga ~100 freym beradi.",
      lesson: { title: "Freymlash va xususiyat hisoblash", href: "03-Framing-and-Computation.md" }
    },
    {
      q: "ZCR ning freymlar bo'yicha o'rtachasi 0.1522, medianasi 0.1050 chiqdi (45% farq). Bundan qanday amaliy xulosa chiqadi?",
      type: "single",
      options: [
        "ZCR noto'g'ri hisoblangan, o'rtacha va median doim teng bo'lishi kerak",
        "Taqsimot nosimmetrik: o'rtacha ishonchsiz, median chetdagi qiymatlarga chidamli",
        "Median faqat RMS uchun ishlatiladi, ZCR uchun esa o'rtacha to'g'ri",
        "Farq freymlar ustma-ust tushgani uchun paydo bo'lgan, ustma-ustlikni olib tashlash kerak"
      ],
      answer: [1],
      explain: "Kam sonli ovozsiz freymlar juda yuqori ZCR berib, o'rtachani yuqoriga tortadi (p10 0.0450, p90 0.3098). Amalda mean, median, std, p10, p90 kabi hammasini berish tavsiya etiladi.",
      lesson: { title: "Freymlash va xususiyat hisoblash", href: "03-Framing-and-Computation.md" }
    },
    {
      q: "Freymlash va xotira haqida qaysi fikrlar darsdagi o'lchovlarga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "sig.get_window() float64 qaytaradi va float32 freymlar xotirasini jim ravishda ikki baravar oshiradi",
        "sliding_window_view nusxa yaratmaydi va nusxali usuldan ~15× tez",
        "Ko'rinish uchun F.base.nbytes haqiqiy xotirani to'g'ri ko'rsatadi",
        "Freymlangan xotira ustma-ustlikka bog'liq, oyna o'lchamiga esa bog'liq emas",
        "sliding_window_view ga oyna ko'paytirilsa ham nusxa yaratilmaydi"
      ],
      answer: [0, 1, 3],
      explain: "F.base.nbytes 573.4 MB kabi yolg'on qiymat beradi — haqiqiy xotira asl signalning o'zi. Ko'rinishga oyna ko'paytirilsa, nusxa baribir yaratiladi. Xotira freym × oyna ko'paytmasiga bog'liq, u faqat ustma-ustlik bilan o'zgaradi.",
      lesson: { title: "Freymlash va xususiyat hisoblash", href: "03-Framing-and-Computation.md" }
    },
    {
      q: "1000 Hz sinus (aynan bin markazida) bilan hamma oyna bir xil −290 dB berdi, 1015.6 Hz da esa boxcar −25 dB, hann −70 dB. Bundan qanday xulosa chiqadi?",
      type: "single",
      options: [
        "Oyna funksiyasi faqat bin markazidagi chastotalar uchun kerak",
        "Boxcar eng aniq oyna, chunki cho'qqisi eng tor",
        "Haqiqiy signallar bin markazida bo'lmaydi, shuning uchun oyna funksiyasi majburiy",
        "Oyna tanlovi natijaga ta'sir qilmaydi, faqat n_fft muhim"
      ],
      answer: [2],
      explain: "Bin markazida signal oynaga butun sonli davr bilan sig'adi va sizib chiqish bo'lmaydi. Nutq chastotalari uzluksiz o'zgaradi, oynasiz (boxcar) kuchli sizib chiqish jim komponentlarni bosib ketadi; nutq uchun hann/hamming standart.",
      lesson: { title: "Furye almashtirishi", href: "04-Fourier-Transform.md" }
    },
    {
      q: "16 kHz dagi y uchun STFT hisoblandi. Kod nima chiqaradi?",
      code: "S = librosa.stft(y, n_fft=512, hop_length=160, win_length=400)\nprint(S.shape[0], S.dtype)",
      type: "single",
      options: ["257 complex64", "512 complex64", "257 float32", "400 float32"],
      answer: [0],
      explain: "Haqiqiy signal spektri simmetrik bo'lgani uchun faqat yarmi qaytadi: 512/2 + 1 = 257 bin. Natija kompleks (complex64): magnituda va faza; xususiyat ajratishda np.abs(S) bilan faza tashlanadi.",
      lesson: { title: "Furye almashtirishi", href: "04-Fourier-Transform.md" }
    },
    {
      q: "Nutq uchun (f0 ≈ 138 Hz) nega 16 kHz da n_fft=512 tanlanadi, 128 yoki 2048 emas?",
      type: "single",
      options: [
        "n_fft=512 da FFT DFT ga qaraganda eng ko'p tezlashadi, boshqa sabab yo'q",
        "Bin 31.25 Hz garmonikalarni ajratadi, 32 ms oyna esa fonema ichida qoladi",
        "n_fft=2048 garmonikalarni chalkashtiradi, n_fft=128 esa fonemalarni aralashtiradi",
        "n_fft=512 librosa da yagona ruxsat etilgan qiymat"
      ],
      answer: [1],
      explain: "n_fft=128 da bin 125 Hz — garmonikalar chalkashadi; n_fft=2048 da oyna 128 ms — bir necha fonema aralashadi. Chastota va vaqt aniqligi o'rtasidagi muvozanat n_fft=512 da topiladi.",
      lesson: { title: "Furye almashtirishi", href: "04-Fourier-Transform.md" }
    }
  ]
};
