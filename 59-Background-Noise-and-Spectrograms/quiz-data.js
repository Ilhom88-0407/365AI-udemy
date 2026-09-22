window.QUIZ = {
  id: "59",
  title: "Fon shovqini va spektrogrammalar",
  subtitle: "Shovqin qayerda, spektrogramma qanday quriladi va nega shovqin kamaytirish ko'pincha zarar qiladi",
  next: { label: "OpenAI Whisper bilan transkripsiya", href: "../60-Transcribing-with-Whisper/README.md" },
  questions: [
    {
      q: "Xona aks-sadosi (reverberatsiya) bor yozuvni oddiy chastota filtri bilan tozalab bo'lmaydi. Buning sababi nima?",
      type: "single",
      options: [
        "Reverberatsiya faqat 50/60 Hz da bo'ladi, filtr esa bu chastotani o'tkazib yuboradi",
        "Reverberatsiya — boshqa tovush emas, signalning o'zining kechikkan nusxasi",
        "Reverberatsiya barcha chastotalarda teng bo'lgani uchun uni oq shovqindan ajratib bo'lmaydi",
        "Reverberatsiya juda qisqa impuls bo'lgani uchun filtr uni sezishga ulgurmaydi"
      ],
      answer: [1],
      explain: "Reverberatsiya — shu tovushning kechikkan nusxasi, uning chastota tarkibi nutqning o'zi bilan bir xil. Shuning uchun chastota filtri uni ajrata olmaydi (53-modulda DRR bilan o'lchangan).",
      lesson: { title: "Audio fayllardagi shovqinni tushunish", href: "01-Understanding-Noise.md" }
    },
    {
      q: "speech_01.wav ning boshidagi faqat shovqin bo'lgan qismni tahlil qildik. Shovqin energiyasining asosiy qismi qaysi zonada to'plangan?",
      type: "single",
      options: [
        "0–300 Hz — asosiy ton zonasida, taxminan 50%",
        "4000–8000 Hz — yuqori chastotalarda, taxminan 60%",
        "300–2000 Hz — jami taxminan 73%",
        "8000 Hz dan yuqorida — deyarli barcha energiya"
      ],
      answer: [2],
      explain: "Boshidagi shovqinda 300–1000 Hz 42.39%, 1000–2000 Hz 30.81% — jami 73.2%, kurs aytgan 512–2048 Hz ga yaqin. 0–300 Hz dagi 50% esa nutqqa (asosiy tonga) tegishli.",
      lesson: { title: "Audio fayllardagi shovqinni tushunish", href: "01-Understanding-Noise.md" }
    },
    {
      q: "Chastotalar bo'yicha SNR o'lchanganda eng yomon nuqta ≈ 2261 Hz chiqdi (−4.71 dB). Nega aynan shu joy eng katta muammo?",
      type: "single",
      options: [
        "Bu undoshlar (s, sh, t, k) zonasi — o'chirsangiz nutq buziladi, qoldirsangiz shovqin",
        "Bu chastotada energiya juda kam, shuning uchun uni bemalol kesib tashlash mumkin",
        "Bu elektr tarmog'ining garmonikasi, uni notch filtr bilan osongina olib tashlash mumkin",
        "Bu asosiy ton (f0) zonasi, u yo'qolsa model gapiruvchini va urg'uni aniqlay olmaydi"
      ],
      answer: [0],
      explain: "2 kHz atrofi undoshlar zonasi, ma'noning katta qismi shu yerda. Shovqin va nutq eng muhim zonada ustma-ust tushgani uchun filtr bilan ajratib bo'lmaydi.",
      lesson: { title: "Audio fayllardagi shovqinni tushunish", href: "01-Understanding-Noise.md" }
    },
    {
      q: "librosa.effects.split(y, top_db=20) faylning 95.8% ini \"nutq\" deb topdi, holbuki quloq nutq oralarida pauzalarni eshitadi. Bu nimani bildiradi?",
      type: "single",
      options: [
        "split() pauzalarni ham nutq deb hisoblaydi, chunki u so'zlarni ma'no bo'yicha ajratadi",
        "top_db noto'g'ri tanlangan — 60 qilinsa, pauzalar jimlik sifatida to'g'ri ajraladi",
        "Fayl diskretlash chastotasi noto'g'ri o'qilgan, load() da sr=16000 berish kerak edi",
        "split() energiya bo'yicha ishlaydi: shovqin tufayli pauzalar ham chegaradan oshadi"
      ],
      answer: [3],
      explain: "split() energiyaga qaraydi: doimiy fon shovqini pauzalarni ham \"baland\" qiladi. Jimlik ulushi qanchalik kam bo'lsa, fayl shunchalik shovqinli — bu eng yaxshi belgi. top_db ni oshirish ham deyarli farq qilmadi.",
      lesson: { title: "Audio fayllardagi shovqinni tushunish", href: "01-Understanding-Noise.md" }
    },
    {
      q: "Standart sozlamalar bilan quyidagi kod nima chiqaradi?",
      code: "import librosa\n\ny, srate = librosa.load(\"speech_01.wav\", sr=None)\nS = librosa.stft(y)\nprint(S.shape[0], S.dtype)",
      type: "single",
      options: [
        "2048 float32",
        "1024 complex64",
        "1025 complex64",
        "2026 float64"
      ],
      answer: [2],
      explain: "Standart n_fft=2048, chastota binlari soni n_fft/2 + 1 = 1025. STFT murakkab sonlar (amplituda + faza) qaytaradi, shuning uchun turi complex64. 2026 esa vaqt freymlari soni.",
      lesson: { title: "Python'da spektrogramma yaratish", href: "02-Creating-a-Spectrogram.md" }
    },
    {
      q: "Nutq tahlili uchun n_fft ni 2048 dan 4096 ga oshirdingiz. Nima o'zgaradi?",
      type: "single",
      options: [
        "Ikkala aniqlik ham yaxshilanadi, faqat xotira va hisoblash 2× oshadi",
        "Chastota aniqligi yaxshilanadi (21.53 → 10.77 Hz), vaqt aniqligi yomonlashadi",
        "Vaqt aniqligi yaxshilanadi (46.44 → 23.22 ms), chastota aniqligi yomonlashadi",
        "Hech narsa o'zgarmaydi, faqat spektrogramma rasmi kattaroq va silliqroq chiqadi"
      ],
      answer: [1],
      explain: "Bu Geyzenberg noaniqligi: chastotani aniq bilsangiz, vaqtni aniq bilmaysiz. Xotira esa deyarli o'zgarmaydi — binlar ko'payadi, freymlar kamayadi. Qisqa fonemali nutq uchun 512–1024 tavsiya qilinadi.",
      lesson: { title: "Python'da spektrogramma yaratish", href: "02-Creating-a-Spectrogram.md" }
    },
    {
      q: "Quyidagi kodda spektrogrammaning barcha dB qiymatlari 2× noto'g'ri chiqadi. Qaysi tuzatish to'g'ri?",
      code: "S = librosa.stft(y)\nS_db = librosa.power_to_db(np.abs(S), ref=np.max)\nlibrosa.display.specshow(S_db, sr=srate, x_axis=\"time\", y_axis=\"log\")",
      type: "single",
      options: [
        "np.abs(S) ni olib tashlab, to'g'ridan-to'g'ri power_to_db(S, ref=np.max) yozish",
        "y_axis=\"log\" ni y_axis=\"linear\" ga almashtirib, past chastotalarni to'g'rilash",
        "ref=np.max o'rniga ref=np.median yozib, shkalani medial darajaga moslash",
        "power_to_db o'rniga amplitude_to_db(np.abs(S), ref=np.max) ishlatish"
      ],
      answer: [3],
      explain: "np.abs(S) — amplituda, u uchun amplitude_to_db (20·log10) kerak. power_to_db (10·log10) faqat quvvat, ya'ni |S|² uchun. Murakkab S ni abs() siz berish esa ComplexWarning yoki xato beradi.",
      lesson: { title: "Python'da spektrogramma yaratish", href: "02-Creating-a-Spectrogram.md" }
    },
    {
      q: "Spektrogramma sozlamalari haqida qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Faqat rasm chizayotgan bo'lsangiz, amplitude_to_db ning top_db=80 standartini qoldirish mumkin",
        "ref=np.max bilan ikki xil balandlikdagi faylni bir shkalada bemalol taqqoslash mumkin",
        "80 ta mel bo'lagi bilan spektrogramma — Whisper kirishi, u STFT dan 12.8× kichik",
        "Shovqinning aniq chastotasini (masalan 2261 Hz) topish uchun mel spektrogramma eng qulay",
        "Raqamlar hisoblayotgan bo'lsangiz, top_db=None yozish kerak — aks holda 32.4% qiymat −80 ga tenglashadi"
      ],
      answer: [0, 2, 4],
      explain: "top_db=80 vizualizatsiyaga zarar qilmaydi, lekin hisoblashda ma'lumotni kesadi. ref=np.max nisbiy, taqqoslash uchun ref=1.0 kerak. Mel shkalasi yuqori chastotalarni siqadi, shuning uchun shovqin tahliliga chiziqli STFT mos.",
      lesson: { title: "Python'da spektrogramma yaratish", href: "02-Creating-a-Spectrogram.md" }
    },
    {
      q: "Kursda pre-emphasis WER ni 0.3390 dan 0.3220 ga tushirgan edi. Bizda yetti xil coef da ham WER 0.3390 qoldi. Farqning sababi nima?",
      type: "single",
      options: [
        "Biz coef ni noto'g'ri tanlaganmiz — kursdagi natija uchun 0.97 o'rniga 0.5 bo'lishi kerak edi",
        "Kurs natijasi soxta — pre-emphasis hech qachon va hech qaysi modelda WER ga ta'sir qilmaydi",
        "Google modeli kurs transkriptidagi term va in xatolarini o'zi tuzatgan — tuzatadigan narsa qolmagan",
        "Bizning fayl kursnikidan kamroq shovqinli bo'lgani uchun filtr kuchaytiradigan undosh qolmagan"
      ],
      answer: [2],
      explain: "Bizning transkriptda bu so'zlar allaqachon to'g'ri (turn, and). Kurs natijasi o'sha vaqtdagi model uchun to'g'ri edi, lekin uni \"pre-emphasis ishlaydi\" deb umumlashtirib bo'lmaydi. Ishonch esa 0.9077 dan 0.7595 ga tushdi.",
      lesson: { title: "Fon shovqini bilan ishlash", href: "03-Dealing-with-Background-Noise.md" }
    },
    {
      q: "Sun'iy oq shovqin qo'shib, 5 ta SNR darajasida 5 ta usul sinaldi (25 ta o'lchov). Yakuniy natija qanday bo'ldi?",
      type: "single",
      options: [
        "Hech bir o'lchovda yaxshilanish bo'lmadi, 20 tasida WER yomonlashdi",
        "Pre-emphasis past SNR da yordam berdi, spektral ayirish esa yuqori SNR da",
        "Spektral ayirish α=3 barcha darajalarda eng yaxshi natija berdi",
        "Faqat 0 dB da barcha usullar WER ni sezilarli kamaytirdi"
      ],
      answer: [0],
      explain: "Yaxshilanish — nol, 20 ta o'lchovda yomonlashuv, bandpass esa hech narsani o'zgartirmadi. Eng yaxshi \"shovqin kamaytirish\" usuli — hech narsa qilmaslik; 0 dB da ham asl audio 61 so'zdan 49 tasini to'g'ri tanidi.",
      lesson: { title: "Fon shovqini bilan ishlash", href: "03-Dealing-with-Background-Noise.md" }
    },
    {
      q: "Nega Google modeli uchun \"tozalangan\" audio asl shovqinli audiodan yomonroq tanildi?",
      type: "single",
      options: [
        "Tozalangan audio haddan tashqari baland bo'lib qoladi va model uni clipping deb rad etadi",
        "Model shovqinli audioda o'qitilgan; tozalash nutqni qisman buzib, notanish artefaktlar qo'shadi",
        "Google API faqat 44.1 kHz faylni qabul qiladi, tozalash esa chastotani o'zgartiradi",
        "Tozalash usullari faylni stereo qilib qo'yadi, model esa faqat mono bilan ishlaydi"
      ],
      answer: [1],
      explain: "Model shovqinni \"ko'rishga\" o'rgangan. Spektral ayirish musiqiy shovqin, pre-emphasis spektral qiyalik, HPSS faza artefaktlarini qo'shadi — model bunday signalni hech qachon ko'rmagan.",
      lesson: { title: "Fon shovqini bilan ishlash", href: "03-Dealing-with-Background-Noise.md" }
    },
    {
      q: "Pre-emphasis filtri coef=0.97 bilan 44.1 kHz va 16 kHz fayllarda bir xil ta'sir ko'rsatadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "H(f) = |1 − 0.97·e^(−j2πf/fs)| formulasida fs bor, shuning uchun bir xil coef turli filtr beradi. 16 kHz da 300 Hz −18.44 dB ga tushib, 61 so'zdan 24 tasi yo'qoldi, 44.1 kHz da esa WER o'zgarmadi.",
      lesson: { title: "Fon shovqini bilan ishlash", href: "03-Dealing-with-Background-Noise.md" }
    },
    {
      q: "23.51 soniyalik faylda quyidagi kod nima qiladi?",
      code: "r = sr.Recognizer()\nwith sr.AudioFile(\"speech_01.wav\") as s:\n    r.adjust_for_ambient_noise(s, duration=1.5)\n    a = r.record(s)",
      type: "single",
      options: [
        "Shovqin profilini o'lchab, uni audiodan ayiradi va to'liq 23.51 s ni record() ga beradi",
        "energy_threshold ni pasaytiradi, shuning uchun record() faqat jim joylarni kesib, nutqni saqlaydi",
        "Boshidagi ~1.5 s ni o'qib oladi (u record() ga yetmaydi), threshold esa record() da umuman ishlatilmaydi",
        "Faylni 16 kHz ga o'tkazib, shovqin profilini keyingi listen() chaqiruvlari uchun diskka saqlaydi"
      ],
      answer: [2],
      explain: "Audio 23.51 s dan 22.03 s ga qisqardi, energy_threshold esa 300 dan 417 666 ga sakradi. Bu chegara faqat listen() uchun, ya'ni sr.Microphone() bilan ishlaganda kerak.",
      lesson: { title: "Fon shovqini bilan ishlash", href: "03-Dealing-with-Background-Noise.md" }
    },
    {
      q: "Bandpass 80–7500 Hz yagona \"zararsiz\" usul bo'ldi (Δ WER = +0.0000). Buning sababi nima?",
      type: "single",
      options: [
        "U undoshlar zonasini kuchaytirib, shovqinda yo'qolgan so'zlarni qaytaradi",
        "U shovqinni to'liq olib tashlaydi, lekin Google baribir o'z filtrini qo'llaydi",
        "U faqat 16 kHz fayllarda ishlaydi, sinov esa 44.1 kHz da o'tkazilgan",
        "U faqat nutq zonasidan tashqarini kesadi, nutqqa tegmaydi — foydasi ham yo'q"
      ],
      answer: [3],
      explain: "Bandpass deyarli hech qanday artefakt qo'shmaydi, chunki nutq chastotalariga tegmaydi. Aynan shu sababli u hech narsani yaxshilamaydi ham.",
      lesson: { title: "Fon shovqini bilan ishlash", href: "03-Dealing-with-Background-Noise.md" }
    },
    {
      q: "Darsdagi \"muammo → ishlaydigan yechim\" jadvaliga ko'ra qaysi juftliklar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Doimiy 50/60 Hz g'uvillash — shu chastotadagi notch filtr",
        "Reverberatsiya (aks sado) — spektral ayirish α=3",
        "Juda jim yozuv — amplitudani normallash",
        "Umumiy fon shovqini — tegmaslik yoki modelni almashtirish",
        "Kesilgan uzun fayl — pre-emphasis 0.97 qo'llash"
      ],
      answer: [0, 2, 3],
      explain: "Aniq muammoga aniq yechim: notch filtr, normallash, umumiy shovqinda esa tegmaslik yoki yaxshiroq model. Reverberatsiyaga filtr yordam bermaydi, uzun fayl esa bo'laklash bilan hal qilinadi.",
      lesson: { title: "Fon shovqini bilan ishlash", href: "03-Dealing-with-Background-Noise.md" }
    }
  ]
};
