window.QUIZ = {
  id: "58",
  title: "Google Web Speech API bilan transkripsiya",
  subtitle: "Audio formatlar, Jupyter'da yuklash, SpeechRecognition tuzoqlari, WER/CER va halol normallashtirish",
  next: { label: "Fon shovqini va spektrogrammalar", href: "../59-Background-Noise-and-Spectrograms/README.md" },
  questions: [
    {
      q: "Bu kod nutq.mp3 faylini transkripsiyaga tayyorlamoqchi. Darsga ko'ra nima bo'ladi va qanday yechiladi?",
      code: "import speech_recognition as sr\n\nrec = sr.Recognizer()\nwith sr.AudioFile(\"nutq.mp3\") as s:\n    audio = rec.record(s)",
      type: "single",
      options: [
        "UnknownValueError chiqadi — MP3 dagi nutq juda siqilgan; avval bitreytni oshirish kerak",
        "ValueError chiqadi — AudioFile faqat WAV, AIFF, FLAC o'qiydi; avval WAV ga aylantirish kerak",
        "Kod muammosiz ishlaydi — soundfile 0.14 MP3 ni qo'llab-quvvatlagani uchun AudioFile ham o'qiydi",
        "RequestError chiqadi — MP3 fayllar Google serveriga yuborilmaydi; language= berish kerak"
      ],
      answer: [1],
      explain: "AudioFile.__enter__ ketma-ket WAV → AIFF → FLAC ni sinaydi, uchtasi ham bo'lmasa ValueError. soundfile MP3 ni yoza olsa ham, AudioFile uni o'qimaydi; yechim: librosa.load(...) va sf.write(\"audio.wav\", ...).",
      lesson: { title: "Nutqni tanish uchun audio formatlar", href: "01-Audio-File-Formats.md" }
    },
    {
      q: "Bir xil audio WAV, MP3 va OGG ko'rinishida (keyin WAV ga aylantirilib) Google API ga berildi. SNR 279 dB dan 15 dB gacha tushdi. Transkripsiya natijasi qanday bo'ldi va nega?",
      type: "single",
      options: [
        "OGG eng yomon natija berdi, chunki u eng kichik va eng ko'p siqilgan format",
        "MP3 va OGG da WER ikki baravar oshdi, chunki SNR 279 dB dan 15 dB ga tushdi",
        "Uchalasi bir xil matn berdi: siqish nutq zonasiga (0–4 kHz) deyarli tegmaydi",
        "WAV eng yaxshi natija berdi, chunki u siqilmagan va har bir nozik jihatni saqlaydi"
      ],
      answer: [2],
      explain: "Uchala holatda WER 0.4754 va matn bir xil chiqdi. MP3/OGG psixoakustik siqish ishlatadi, nutq esa siqish eng kam tegadigan zonada. Lekin juda past bitreyt yoki ketma-ket qayta siqish natijani buzishi mumkin.",
      lesson: { title: "Nutqni tanish uchun audio formatlar", href: "01-Audio-File-Formats.md" }
    },
    {
      q: "To'g'ri yoki noto'g'ri: soundfile uzun OGG faylni yozishda qulasa, sf.write ni try/except ichiga olib, xatoni ushlab qolish mumkin.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "~750 000 namunadan boshlab C kutubxonasida stack overflow yuz beradi — bu Python Exception emas, jarayon butunlay o'ladi. Yechim: sf.SoundFile bilan bloklab (masalan 1 soniyadan) yozish.",
      lesson: { title: "Nutqni tanish uchun audio formatlar", href: "01-Audio-File-Formats.md" }
    },
    {
      q: "speech_01.wav fayli 44 100 Hz da yozilgan. Kod nimani chiqaradi?",
      code: "import librosa\n\ny, s = librosa.load(\"speech_01.wav\")\nprint(s, len(y))",
      type: "single",
      options: [
        "44100 1036871",
        "16000 376190",
        "22050 518436",
        "22050 1036871"
      ],
      answer: [2],
      explain: "sr=None berilmasa librosa faylni jimgina 22 050 Hz ga tushiradi va namunalarning yarmi yo'qoladi (1 036 871 → 518 436). Asl chastotani saqlash uchun sr=None yozish kerak.",
      lesson: { title: "Jupyter'da audio faylni import qilish", href: "02-Importing-Audio-in-Jupyter.md" }
    },
    {
      q: "Diskda 2.97 MB bo'lgan PCM_24 WAV fayl librosa bilan yuklangach xotirada 3.96 MB egalladi. Buning sababi nima?",
      type: "single",
      options: [
        "librosa faylni ikki kanalga (stereo) aylantirib yuklaydi",
        "Diskda namunaga 3 bayt, xotirada float32 — namunaga 4 bayt; nisbat 4/3",
        "librosa sukut bo'yicha chastotani oshirib, namunalar sonini ko'paytiradi",
        "Xotirada WAV sarlavhasi har bir namunaga qo'shib saqlanadi"
      ],
      answer: [1],
      explain: "PCM_24 — namunaga 3 bayt, librosa esa har doim float32 (4 bayt) qaytaradi. 2.97 × 4/3 ≈ 3.96 MB — raqam aynan mos keladi.",
      lesson: { title: "Jupyter'da audio faylni import qilish", href: "02-Importing-Audio-in-Jupyter.md" }
    },
    {
      q: "Kurs to'lqin grafigiga qarab \"eng baland joylar maksimumning 75% iga yetadi\" deydi. Sanaganda nima chiqdi?",
      type: "single",
      options: [
        "Maksimum 0.8556, 0.75 dan oshgan namuna esa 1 036 871 tadan atigi bitta",
        "Signalning taxminan chorak qismi 0.75 dan baland va faylda clipping bor",
        "Maksimum aynan 0.75, chunki yozuv shu chegarada cheklangan",
        "Namunalarning 99.9% i 0.75 dan yuqori, RMS esa 0 dBFS ga yaqin"
      ],
      answer: [0],
      explain: "Grafikdagi \"±0.75\" — bitta cho'qqi; signalning 99.9% i |y| < 0.41 ichida, RMS esa −20.47 dBFS. To'lqin grafigi tipik darajani emas, cho'qqilarni ko'rsatadi, clipping esa 0 namuna.",
      lesson: { title: "Jupyter'da audio faylni import qilish", href: "02-Importing-Audio-in-Jupyter.md" }
    },
    {
      q: "SpeechRecognition kutubxonasi va recognize_google() haqida qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Model og'irliklari birinchi chaqiruvda kompyuteringizga yuklab olinadi",
        "Akustik model, til modeli va dekodlash Google serverida bajariladi",
        "Internet ulanishi shart",
        "5.80 s umumiy vaqtning asosiy qismini record() oladi",
        "Audio Google serveriga yuboriladi"
      ],
      answer: [1, 2, 4],
      explain: "Kutubxona faqat interfeys: model og'irliklari hech qachon sizga kelmaydi. record() 0.01 s oldi, qolgan ~5.79 s — Google serveriga borib-kelish.",
      lesson: { title: "SpeechRecognition kutubxonasi va Google Web Speech API", href: "03-SpeechRecognition-Google-API.md" }
    },
    {
      q: "30 daqiqalik intervyu bitta recognize_google() chaqiruvi bilan transkripsiya qilindi. Kod xatosiz ishladi va matn to'g'ri ko'rinadi. Darsga ko'ra asosiy xavf nima?",
      type: "single",
      options: [
        "API uzun faylda language= ni e'tiborsiz qoldirib, boshqa tilda javob beradi",
        "Matn to'liq, lekin tinish belgilari yo'qligi sabab WER sun'iy ravishda oshadi",
        "API uzun faylni rad etib, UnknownValueError yoki RequestError tashlaydi",
        "API faqat birinchi segmentni qaytaradi — qolgan audio jimgina tashlab yuboriladi"
      ],
      answer: [3],
      explain: "Tajribada 47 s dan 141 s gacha bo'lgan fayllarda har safar 62 ta so'z qaytdi, xato ham, ogohlantirish ham bo'lmadi. Yechim: audioni bo'laklab (masalan record(source, duration=30)) yuborish.",
      lesson: { title: "SpeechRecognition kutubxonasi va Google Web Speech API", href: "03-SpeechRecognition-Google-API.md" }
    },
    {
      q: "jimlik.wav — 3 soniyalik mutlaq tinchlik. Darsga ko'ra kod nimani chiqaradi?",
      code: "with sr.AudioFile(\"jimlik.wav\") as s:\n    a = rec.record(s)\n\nr = rec.recognize_google(a, show_all=True)\nif not r:\n    print(\"nutq yo'q\")\nelse:\n    print(r[\"alternative\"][0][\"transcript\"])",
      type: "single",
      options: [
        "UnknownValueError istisnosi bilan to'xtaydi",
        "Google o'ylab topgan qisqa matnni chiqaradi",
        "Bo'sh qatorni chiqaradi, chunki transcript \"\" bo'ladi",
        "nutq yo'q"
      ],
      answer: [3],
      explain: "show_all=True bilan nutq topilmasa istisno emas, bo'sh ro'yxat [] qaytadi, shuning uchun if not r ishlaydi. show_all siz esa UnknownValueError tashlanardi; Google jimlikda gallyutsinatsiya qilmaydi.",
      lesson: { title: "SpeechRecognition kutubxonasi va Google Web Speech API", href: "03-SpeechRecognition-Google-API.md" }
    },
    {
      q: "Bir xil audio 8 000, 16 000, 22 050 va 44 100 Hz da Google API ga yuborildi. Natija va undan kelib chiqadigan amaliy maslahat qaysi?",
      type: "single",
      options: [
        "WER hammasida 0.3390; Google o'zi 16 kHz ga tushiradi, shuning uchun 16 kHz mono yetarli",
        "44 100 Hz eng past WER berdi; shuning uchun imkon qadar yuqori chastotada yuborish kerak",
        "8 000 Hz da WER keskin oshdi; demak telefon sifatidagi 8 kHz audio API ga yaramaydi",
        "WER bir xil, lekin 8 000 Hz da matn boshqa tilda qaytdi; language= ni berish shart"
      ],
      answer: [0],
      explain: "To'rtala chastotada WER aynan 0.3390 bo'ldi, 8 kHz da ham (5.5× kichik fayl bilan). 44.1 kHz yuborish tarmoqni bekorga band qiladi; 16 kHz mono ga tushirish hajmni 4.1× kamaytiradi.",
      lesson: { title: "SpeechRecognition kutubxonasi va Google Web Speech API", href: "03-SpeechRecognition-Google-API.md" }
    },
    {
      q: "Kod nimani chiqaradi?",
      code: "from jiwer import wer\n\nref = \"hello\"\nhyp = \"hello world how are you doing today\"\nprint(wer(ref, hyp))",
      type: "single",
      options: [
        "0.8571",
        "1.0",
        "0.1667",
        "6.0"
      ],
      answer: [3],
      explain: "WER = (S + I + D) / N, maxrajda havola uzunligi turadi: I = 6, N = 1, demak WER = 6.0. Shuning uchun WER ni foiz deb atash noto'g'ri — u 0 dan cheksizgacha bo'lishi mumkin; har doim [0, 1] ichidagi ko'rsatkich esa MER.",
      lesson: { title: "Baholash metrikalari: WER va CER", href: "04-WER-and-CER.md" }
    },
    {
      q: "Havola: \"the meeting is at nine o'clock tomorrow\". Darsdagi o'lchovlarga ko'ra qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "\"the\" tushishi, tomorrow → yesterday va nine → five — uchalasida WER bir xil 0.1429",
        "WER ma'noni o'zgartiruvchi xatoni artikl tushishidan og'irroq jazolaydi",
        "nine → five xatosi eng past CER (0.0513) ga ega",
        "Faqat imlo xatolarida WER past, CER esa yuqori chiqadi",
        "WER yuqori va CER past bo'lsa — odatda imlo/format muammosi, ma'no saqlangan"
      ],
      answer: [0, 2, 4],
      explain: "WER va CER — ma'no emas, shakl metrikalari: uchta turli vaziyat bir xil WER oladi. Imlo xatolarida aksincha WER yuqori (0.4286), CER past (0.0769) bo'ladi.",
      lesson: { title: "Baholash metrikalari: WER va CER", href: "04-WER-and-CER.md" }
    },
    {
      q: "jiwer matnni probel bo'yicha bo'ladi. Kursning ko'p qatorli ground_truth muammosini ko'rsatuvchi bu kod nimani chiqaradi?",
      code: "s = \"I am a scientist,\\ncurious about AI\"\nprint(len(s.split(\" \")), len(s.split()))",
      type: "single",
      options: [
        "7 7",
        "6 7",
        "6 6",
        "7 6"
      ],
      answer: [1],
      explain: "split(\" \") \\n ni ajratmaydi va 'scientist,\\ncurious' bitta token bo'lib qoladi (6 ta). split() esa har qanday bo'sh joy bo'yicha bo'ladi (7 ta). Kursda aynan shu ikki token WER ni 0.2951 dan 0.3390 ga ko'tardi.",
      lesson: { title: "Python'da WER va CER ni hisoblash", href: "05-Calculating-WER-CER-in-Python.md" }
    },
    {
      q: "Darsdagi normallashtirish zanjirining soddalashtirilgan versiyasi. Kod nimani chiqaradi?",
      code: "import re\n\ndef normallash(s):\n    s = \" \".join(s.split())\n    s = s.lower()\n    s = re.sub(r\"[^\\w\\s']\", \" \", s)\n    return \" \".join(s.split())\n\nprint(normallash(\"I'd like it,\\nIT!\"))",
      type: "single",
      options: [
        "i'd like it it",
        "id like it it",
        "i'd like it,\\nit!",
        "i d like it it"
      ],
      answer: [0],
      explain: "Avval \\n probelga aylanadi, keyin kichik harf, so'ng apostrofdan boshqa tinish belgilari probelga almashtiriladi va ortiqcha probellar tekislanadi. Apostrof [^\\w\\s'] ichida saqlangani uchun i'd buzilmaydi.",
      lesson: { title: "Python'da WER va CER ni hisoblash", href: "05-Calculating-WER-CER-in-Python.md" }
    },
    {
      q: "To'liq normallashtirishdan keyin 61 so'zdan ikkita xato qoldi: ivan → yvonne va turned → turn. Muallif videoda o'z ismini Yvonne deb aytadi. Darsga ko'ra to'g'ri xulosa qaysi?",
      type: "single",
      options: [
        "Model ikkita xato qildi, aniqlik 96.7% — ground truth'ni o'zgartirib bo'lmaydi",
        "Google ismni noto'g'ri tanidi, chunki Whisper generate() uni Iván deb yozgan",
        "Ground truth'ning o'zi xato: model bitta xato qilgan, aniqlik 60/61 = 98.4%",
        "Ismlar WER ga kirmaydi, shuning uchun ikkala xato ham hisobga olinmaydi"
      ],
      answer: [2],
      explain: "ground_truth.txt dagi \"Ivan\" — havolaning o'zidagi xato; Google va Whisper pipeline() Yvonne deb to'g'ri tanigan. Shuning uchun WER yuqori chiqsa, xatolar ro'yxatini qo'lda ko'rib, havola to'g'rimi deb so'rash kerak.",
      lesson: { title: "Python'da WER va CER ni hisoblash", href: "05-Calculating-WER-CER-in-Python.md" }
    }
  ]
};
