window.QUIZ = {
  id: "52",
  title: "Nutqni tanish — kirish",
  subtitle: "ASR nima, blok xaritasi, garmonika, formant va fonema, manba-filtr modeli hamda Audrey'dan Whisper'gacha: DTW, HMM, end-to-end",
  next: { label: "Tovush va nutq asoslari", href: "../53-Sound-and-Speech-Basics/README.md" },
  questions: [
    {
      q: "Qaysi moslashtirishlar darsdagi ta'riflarga to'g'ri keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "ASR (nutqni tanish) — audio → matn",
        "TTS — matn → audio",
        "NLU — audio → kim gapiryapti",
        "Speaker ID — audio → kim gapiryapti",
        "Ovozli yordamchi (Siri) — faqat ASR'ning o'zi"
      ],
      answer: [0, 1, 3],
      explain: "ASR audio → matn, TTS matn → audio, NLU matn → ma'no, speaker ID esa kim gapirayotganini aniqlaydi. Siri kabi yordamchi bularning hammasini birgalikda ishlatadi.",
      lesson: { title: "Nutqni tanish dunyosiga xush kelibsiz", href: "01-Welcome-to-Speech-Recognition.md" }
    },
    {
      q: "Call-markazda kuniga 1000 ta, o'rtacha 4 daqiqalik qo'ng'iroq bor. Whisper API narxi soatiga $0.36. Kod nima chop etadi?",
      code: "SOAT_KUNIGA = 1000 * 4 / 60\nyillik = SOAT_KUNIGA * 365 * 0.36\nprint(f\"${yillik:,.0f}/yil\")",
      type: "single",
      options: [
        "$24,333/yil",
        "$8,760/yil",
        "$1,440/yil",
        "$87,600/yil"
      ],
      answer: [1],
      explain: "1000 × 4 / 60 ≈ 66.7 soat/kun, yiliga ≈ 24 333 soat, × $0.36 = $8 760. 24 333 — narx emas, soatlar soni. Mahalliy Whisper bilan aynan shu summa tejaladi.",
      lesson: { title: "Nutqni tanish dunyosiga xush kelibsiz", href: "01-Welcome-to-Speech-Recognition.md" }
    },
    {
      q: "Darsga ko'ra nutqni tanish bozori rivojining bozor prognozlaridan ko'ra ishonchliroq signali nima?",
      type: "single",
      options: [
        "Bozor hajmi 2023-yilda $17.2 mlrd ga yetgani haqidagi hisobot",
        "Yiliga ~17.8% o'sish (CAGR) haqidagi tahlilchilar prognozi",
        "Narxning tushishi: ~$1.44/soat (2018) → ~$0.36/soat (2025)",
        "2030-yilga bozor $54.3 mlrd bo'lishi haqidagi prognoz"
      ],
      answer: [2],
      explain: "Bozor prognozlari marketing tadqiqotlaridan olinadi va ko'pincha haddan tashqari optimistik bo'ladi. Narxning real tushishi (mahalliy Whisper esa $0) ishonchliroq ko'rsatkich.",
      lesson: { title: "Nutqni tanish dunyosiga xush kelibsiz", href: "01-Welcome-to-Speech-Recognition.md" }
    },
    {
      q: "Whisper transkripsiyasi yomon chiqdi. Darsda nazariyaning amaliy qiymati misolida birinchi tekshiriladigan narsa qaysi?",
      type: "single",
      options: [
        "Audio 16 kHz sample rate'dami — Whisper shuni kutadi",
        "Boshqa modelni sinab ko'rish — biri albatta yaxshiroq ishlaydi",
        "Audio stereo qilib qayta yozilganmi — Whisper ikki kanal kutadi",
        "Fayl hajmi 3 MB dan kichikmi — katta fayl sifatni tushiradi"
      ],
      answer: [0],
      explain: "Nazariya taxminni tekshirishga aylantiradi: sample rate 16 kHz mi, SNR qancha, audio kesilganmi (clipping), til to'g'ri ko'rsatilganmi. Modelni birma-bir almashtirish — nazariyasiz yondashuv.",
      lesson: { title: "Kurs yondashuvi va yo'l xaritasi", href: "02-Course-Approach.md" }
    },
    {
      q: "Toza Python 3.14 o'rnatilgan, hech qanday qo'shimcha paket yo'q. Bu kod nima qiladi?",
      code: "import audioop\nprint(audioop.__file__)",
      type: "single",
      options: [
        "Standart kutubxonadagi audioop.py yo'lini chop etadi",
        "DeprecationWarning chiqarib, keyin yo'lni chop etadi",
        "site-packages\\audioop\\__init__.py yo'lini chop etadi",
        "ModuleNotFoundError beradi"
      ],
      answer: [3],
      explain: "audioop Python 3.13 da standart kutubxonadan olib tashlangan (PEP 594). pip install SpeechRecognition'dan keyin esa audioop-lts paketi o'rnatilib, site-packages ichidagi yo'l chiqadi.",
      lesson: { title: "Kurs yondashuvi va yo'l xaritasi", href: "02-Course-Approach.md" }
    },
    {
      q: "speech_01.wav uchun f0 median 138.2 Hz chiqdi. Kod qanday garmonikalar ro'yxatini chop etadi?",
      code: "med = 138.2\nprint([round(med * k) for k in range(1, 6)])",
      type: "single",
      options: [
        "[138, 276, 415, 553, 691]",
        "[276, 415, 553, 691, 829]",
        "[138, 276, 414, 552, 691]",
        "[138, 238, 338, 438, 538]"
      ],
      answer: [0],
      explain: "Garmonikalar f0 ning karralari: 138.2 × 1…5 = 138.2, 276.4, 414.6, 552.8, 691.0, yaxlitlanganda 138, 276, 415, 553, 691. range(1, 6) 1 dan boshlanadi, shuning uchun f0 ning o'zi ham kiradi.",
      lesson: { title: "Formant, garmonika, fonema", href: "03-Formants-Harmonics-Phonemes.md" }
    },
    {
      q: "pyin natijasida bitta oktava xatosi (276 Hz) bor. Kod nima chop etadi va darsda qaysi qiymatni ishlatish tavsiya qilinadi?",
      code: "import numpy as np\nf0 = np.array([130., 135., 138., 140., 276.])\nprint(np.median(f0), np.mean(f0))",
      type: "single",
      options: [
        "138.0 163.8 — o'rtacha, chunki u hamma qiymatni hisobga oladi",
        "163.8 138.0 — median, chunki u chetdagi qiymatga chidamli",
        "138.0 163.8 — median, chunki oktava xatosi uni deyarli buzmaydi",
        "138.0 138.0 — ikkalasi bir xil, qaysi birini olish farqsiz"
      ],
      answer: [2],
      explain: "Median 138.0, o'rtacha 819 / 5 = 163.8. Bitta oktava xatosi o'rtachani yuqoriga tortadi, medianni esa deyarli o'zgartirmaydi — real faylda ham median 138.2, o'rtacha 148.9 chiqqan.",
      lesson: { title: "Formant, garmonika, fonema", href: "03-Formants-Harmonics-Phonemes.md" }
    },
    {
      q: "Unli tovushda F1 yuqori, F2 esa past. Darsdagi qoidaga ko'ra bu qaysi unli?",
      type: "single",
      options: [
        "/i/ — til oldinda, og'iz yopiq",
        "/u/ — til orqada, lablar dumaloq",
        "/e/ — til o'rtada",
        "/a/ — til pastda, og'iz ochiq"
      ],
      answer: [3],
      explain: "F1 og'iz ochiqligini, F2 tilning oldinda-orqadaligini ko'rsatadi. F1 yuqori + F2 past → /a/ (730 va 1090 Hz). /i/ da F1 past, F2 yuqori; /u/ da ikkalasi past.",
      lesson: { title: "Formant, garmonika, fonema", href: "03-Formants-Harmonics-Phonemes.md" }
    },
    {
      q: "Darsdagi misollarga ko'ra harflar va fonemalar soni qaysi so'zda to'g'ri ko'rsatilgan?",
      type: "single",
      options: [
        "\"ship\" — 4 harf, 4 fonema",
        "\"box\" — 3 harf, 4 fonema",
        "\"knight\" — 6 harf, 6 fonema",
        "\"box\" — 3 harf, 3 fonema"
      ],
      answer: [1],
      explain: "\"box\" da x ikki fonema (/k/ /s/), shuning uchun 3 harf, 4 fonema. \"ship\" da sh bitta fonema (3 fonema), \"knight\" esa 3 fonema: /n/ /aɪ/ /t/.",
      lesson: { title: "Formant, garmonika, fonema", href: "03-Formants-Harmonics-Phonemes.md" }
    },
    {
      q: "Manba-filtr modeliga ko'ra pichirlashda f0 (manba) yo'q, lekin formantlar (filtr) saqlanadi — shuning uchun pichirlangan so'zlar tushunarli bo'lib qoladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Manba — ovoz paychalari (ohang, pitch), filtr — og'iz bo'shlig'i (fonema, ma'no). Simulyatsiyada ham pichirlashda formantlar saqlangan. Lekin ASR tizimlari pichirlashni yomon taniydi, chunki ovozli nutqda o'qitilgan.",
      lesson: { title: "Formant, garmonika, fonema", href: "03-Formants-Harmonics-Phonemes.md" }
    },
    {
      q: "LPC bilan formant topishdan oldin pre-emphasis filtri qo'llanadi. Buning sababi nima?",
      type: "single",
      options: [
        "Energiya pastda to'plangan; pre-emphasis yuqori chastotani ko'tarib F2, F3 ni ochadi",
        "Pre-emphasis f0 ni olib tashlab, formantlar o'rniga faqat garmonikalarni qoldiradi",
        "Pre-emphasis sample rate'ni 16 kHz ga tushirib, LPC hisobini tezlashtiradi",
        "Pre-emphasis oktava xatolarini tuzatib, f0 median va o'rtachasini tenglashtiradi"
      ],
      answer: [0],
      explain: "Energiyaning 59% qismi 300 Hz dan past, shuning uchun yuqori formantlar \"ko'rinmaydi\". Pre-emphasis siz F3 va F4 ko'pincha topilmaydi.",
      lesson: { title: "Formant, garmonika, fonema", href: "03-Formants-Harmonics-Phonemes.md" }
    },
    {
      q: "Etalon [1, 2, 3], kirish esa uning sekin aytilgan varianti. Darsdagi dtw_masofa() nima qaytaradi?",
      code: "import numpy as np\n\ndef dtw_masofa(a, b):\n    n, m = len(a), len(b)\n    D = np.full((n + 1, m + 1), np.inf)\n    D[0, 0] = 0\n    for i in range(1, n + 1):\n        for j in range(1, m + 1):\n            narx = abs(a[i - 1] - b[j - 1])\n            D[i, j] = narx + min(D[i-1, j], D[i, j-1], D[i-1, j-1])\n    return D[n, m] / (n + m)\n\nprint(dtw_masofa([1, 2, 3], [1, 1, 2, 2, 3, 3]))",
      type: "single",
      options: [
        "1.0",
        "0.5",
        "0.0",
        "inf"
      ],
      answer: [2],
      explain: "DTW har etalon qiymatini cho'zilgan ikki nusxaga moslashtiradi va barcha qadamlar narxi 0 bo'ladi. Darsda ham \"sekin\" signal uchun DTW 0.000 bergan, oddiy ayirma esa 0.527.",
      lesson: { title: "Rivojlanish va evolyutsiya", href: "04-Development-and-Evolution.md" }
    },
    {
      q: "HMM misolida to'g'ri, lekin sekin aytilgan BBBBIIIIRRRR ning xom ehtimoli (8.8e-04) noto'g'ri RIB nikidan (6.3e-03) past chiqdi. Sababi va yechimi qanday?",
      type: "single",
      options: [
        "O'tish ehtimollari noto'g'ri; o'z-o'ziga o'tishni 0.6 dan 0.9 ga oshirish kerak",
        "Forward algoritmi uzun ketma-ketlikda to'g'ri ishlamaydi; DTW'ga qaytish kerak",
        "Chiqish ehtimollari juda kichik; 1e-9 o'rniga 0 qo'yib qayta hisoblash kerak",
        "Uzun ketma-ketlik pastroq chiqadi; log/freym normallash yoki modellar raqobati kerak"
      ],
      answer: [3],
      explain: "Har qadamda 1 dan kichik songa ko'paytirilgani uchun uzun ketma-ketlik doim past chiqadi. log/freym bilan to'g'ri variantlar −0.59…−0.76, noto'g'rilari −1.12…−1.75; modellar raqobatida esa 4/4.",
      lesson: { title: "Rivojlanish va evolyutsiya", href: "04-Development-and-Evolution.md" }
    },
    {
      q: "End-to-end yondashuv haqida darsda qaysi fikrlar aytilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "Talaffuz lug'ati kerak emas — kam resursli tillar uchun hal qiluvchi",
        "Juda ko'p ma'lumot kerak — Whisper 680 000 soat audioda o'qitilgan",
        "Model nima uchun xato qilganini aniq tushuntirib beradi",
        "Model \"qora quti\" — xato sababi bilinmaydi",
        "Har komponent alohida o'qitiladi, shuning uchun sozlash oson"
      ],
      answer: [0, 1, 3],
      explain: "End-to-end bitta model bilan audiodan to'g'ridan-to'g'ri jumla chiqaradi va talaffuz lug'atini talab qilmaydi — shu tufayli o'zbekcha ASR mavjud. Narxi: juda ko'p ma'lumot va \"qora quti\". Alohida komponentlar esa eski quvurga xos.",
      lesson: { title: "Rivojlanish va evolyutsiya", href: "04-Development-and-Evolution.md" }
    },
    {
      q: "1952-yilgi Audrey'ning qaysi cheklovini 1970-yillarda DTW yechdi?",
      type: "single",
      options: [
        "Faqat 0–9 raqamlarini tanishi, ya'ni lug'ati juda kichikligi",
        "So'z tez/sekin aytilganda signal cho'zilib, shablonga mos kelmasligi",
        "Talaffuz lug'ati bo'lmagani uchun yangi so'z qo'shib bo'lmasligi",
        "Faqat ingliz tilida, bitta so'zlovchining ovozida ishlashi"
      ],
      answer: [1],
      explain: "Audrey shablon moslashga asoslangan edi va vaqt cho'zilishida mos kelmasdi. DTW ikki turli uzunlikdagi ketma-ketlikni \"cho'zib\" moslashtiradi. Yangi so'z uchun shablon kerak bo'lmasligi esa HMM'ning yutug'i.",
      lesson: { title: "Rivojlanish va evolyutsiya", href: "04-Development-and-Evolution.md" }
    }
  ]
};
