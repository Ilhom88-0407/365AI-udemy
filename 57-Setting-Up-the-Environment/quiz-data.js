window.QUIZ = {
  id: "57",
  title: "Muhitni sozlash",
  subtitle: "Python versiyasi, venv/conda/uv, Jupyter yadrosi, ffmpeg'siz o'rnatish va importlarning haqiqiy narxi",
  next: { label: "Google Web Speech API bilan transkripsiya", href: "../58-Google-Web-Speech-API/README.md" },
  questions: [
    {
      q: "Kurs Python 3.9 ni tavsiya qiladi. Darsga ko'ra bu tavsiya bugun nima uchun eskirgan?",
      type: "single",
      options: [
        "Python 3.9 da venv moduli yo'q, shuning uchun faqat Anaconda bilan ishlaydi",
        "NumPy 2.x bilan moslik muammosi hal bo'lgan, 3.9 ning qo'llab-quvvatlashi esa tugagan",
        "librosa 1.0 Python 3.9 ni umuman o'rnatishga ruxsat bermaydi",
        "Python 3.9 da transformers ishlamaydi, faqat openai-whisper ishlaydi"
      ],
      answer: [1],
      explain: "Kurs NumPy 2.0 mosligi sababli 3.9 ni tanlagan edi, lekin librosa, scipy, soundfile va transformers endi numpy 2.x ni qo'llab-quvvatlaydi. 3.9 esa 2025-yil oktyabrdan xavfsizlik yangilanishlarini olmaydi.",
      lesson: { title: "Python va Anaconda", href: "01-Python-and-Anaconda.md" }
    },
    {
      q: "GPU'si yo'q noutbukda talaba shunchaki pip install torch yozdi va yuklab olish juda uzoq davom etdi. Darsga ko'ra nima bo'lgan?",
      type: "single",
      options: [
        "Sukut bo'yicha GPU versiyasi (~2.5 GB) yuklangan; CPU versiyasi --index-url bilan ~0.49 GB",
        "pip eski bo'lgani uchun torch manbadan kompilyatsiya qilingan va shu sabab sekinlashgan",
        "torch Anaconda'siz o'rnatilmaydi, shuning uchun pip uni qayta-qayta urinib ko'rgan",
        "torch bilan birga avtomatik ravishda ffmpeg ham yuklab olingan"
      ],
      answer: [0],
      explain: "pip install torch GPU bo'lmasa ham GPU versiyasini yuklaydi. CPU uchun pip install torch --index-url https://download.pytorch.org/whl/cpu — o'lchangan hajm 0.49 GB, taxminan 5 marta kichik.",
      lesson: { title: "Python va Anaconda", href: "01-Python-and-Anaconda.md" }
    },
    {
      q: "Muhit tekshiruvchi skriptdagi bu qator True chiqardi. Bu nimani bildiradi?",
      code: "import sys\nprint(sys.prefix != sys.base_prefix)",
      type: "single",
      options: [
        "Python versiyasi 3.11 va 3.14 oralig'ida — ideal holat",
        "Kod global muhitda ishlayapti, venv yaratish kerak",
        "Kod virtual muhit ichida ishlayapti",
        "Jupyter yadrosi boshqa Python'ga ulangan"
      ],
      answer: [2],
      explain: "Virtual muhitda sys.prefix muhit papkasini, sys.base_prefix esa asosiy Python'ni ko'rsatadi, shuning uchun ular farq qiladi. Bu darsda eng ko'p unutiladigan tekshiruv deb aytilgan.",
      lesson: { title: "Python va Anaconda", href: "01-Python-and-Anaconda.md" }
    },
    {
      q: "Kompyuterda faqat Python 3.14 bor, loyihaga esa Python 3.12 muhiti kerak. Darsga ko'ra venv va uv ning farqi bu yerda qanday namoyon bo'ladi?",
      type: "single",
      options: [
        "venv kerakli versiyani o'zi yuklab oladi, uv esa faqat mavjud versiyadan foydalanadi",
        "Ikkalasi ham faqat mavjud versiyadan muhit yaratadi, buning uchun conda shart",
        "venv faqat mavjud Python'dan muhit yaratadi, uv esa kerakli versiyani o'zi yuklab oladi",
        "uv faqat Linux'da ishlaydi, Windows'da esa venv yagona yo'l"
      ],
      answer: [2],
      explain: "venv ning yagona jiddiy cheklovi — u mavjud Python versiyasidan muhit yaratadi. uv venv speech_env --python 3.12 esa kerakli versiyani o'zi yuklab oladi va paketlarni 10–100× tez o'rnatadi.",
      lesson: { title: "Muhit yaratish va Jupyter yadrosi", href: "02-Creating-an-Environment.md" }
    },
    {
      q: "To'g'ri yoki noto'g'ri: Python 3.13+ da audioop standart kutubxonadan olib tashlangani uchun SpeechRecognition 3.17 bu versiyalarda umuman ishlamaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Modul olib tashlangan, lekin PyPI dagi audioop-lts uni qaytaradi va SpeechRecognition 3.17 uni bog'liqlik sifatida avtomatik o'rnatadi. Darsdagi xulosa: \"olib tashlandi\" — \"ishlamaydi\" degani emas.",
      lesson: { title: "Muhit yaratish va Jupyter yadrosi", href: "02-Creating-an-Environment.md" }
    },
    {
      q: "Talaba librosa'ni o'rnatdi, lekin notebook'da ModuleNotFoundError chiqyapti. sys.executable boshqa Python'ni ko'rsatdi. Notebook ichida qaysi buyruq paketni aynan shu yadroga o'rnatadi?",
      code: "import sys\nprint(sys.executable)",
      type: "single",
      options: [
        "!pip install librosa",
        "!{sys.executable} -m pip install librosa",
        "!jupyter kernelspec install librosa",
        "!python -m venv librosa"
      ],
      answer: [1],
      explain: "!{sys.executable} -m pip aynan ishlayotgan yadroning pip'ini chaqiradi. Oddiy !pip install esa boshqa muhitga o'rnatib yuborishi mumkin.",
      lesson: { title: "Muhit yaratish va Jupyter yadrosi", href: "02-Creating-an-Environment.md" }
    },
    {
      q: "Darsga ko'ra pip freeze > requirements.txt ning qaysi kamchiliklari bor? (bir nechta javob)",
      type: "multi",
      options: [
        "Paket versiyalarini umuman yozmaydi",
        "Hamma paketni, bog'liqliklarni ham yozadi — fayl 200+ qatorli bo'ladi",
        "Faqat siz import qilgan paketlarni yozadi, bog'liqliklarni tashlab ketadi",
        "Platformaga xos paketlarni ham yozadi — Windows'da yozilgani Linux'da ishlamasligi mumkin"
      ],
      answer: [1, 3],
      explain: "O'lchovda pip freeze 234 qator berdi, qo'lda yozilgan requirements.txt esa 9 qator. U hamma narsani, jumladan platformaga xos paketlarni yozadi; versiyalarni esa yozadi.",
      lesson: { title: "Muhit yaratish va Jupyter yadrosi", href: "02-Creating-an-Environment.md" }
    },
    {
      q: "Darsdagi o'lchovlarga ko'ra qaysi hollarda ffmpeg haqiqatan kerak bo'ladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Rasmiy openai-whisper paketini ishlatish",
        "soundfile 0.14 bilan MP3 faylni o'qish",
        ".mp4 yoki .mkv videodan audio ajratish",
        "M4A / AAC formatlari bilan ishlash",
        "librosa bilan FLAC faylni yuklash"
      ],
      answer: [0, 2, 3],
      explain: "soundfile 0.14 WAV, MP3, FLAC va OGG ni ffmpeg'siz yozadi va o'qiydi, librosa ham MP3 ni o'qidi. ffmpeg faqat video, M4A/AAC va rasmiy openai-whisper uchun kerak.",
      lesson: { title: "Paketlarni o'rnatish", href: "03-Installing-Packages.md" }
    },
    {
      q: "O'zbekcha nutq uchun Hugging Face'dagi fine-tuned Whisper modelidan foydalanmoqchisiz. Darsga ko'ra nima uchun transformers yo'li openai-whisper'dan qulayroq?",
      type: "single",
      options: [
        "openai-whisper faqat tiny modelini beradi, boshqa o'lchamlar yo'q",
        "transformers so'z darajasidagi vaqt belgilarini qo'shimcha kodsiz beradi",
        "openai-whisper Python 3.12 da o'rnatilmaydi",
        "transformers fine-tuned modellarni bir qatorda ishlatadi va ffmpeg talab qilmaydi"
      ],
      answer: [3],
      explain: "transformers orqali minglab modellar, jumladan o'zbekchaga moslashtirilgan Whisper'lar bir qator bilan ishlatiladi, ffmpeg kerak emas. So'z darajasidagi vaqt belgilari esa aksincha openai-whisper'da tayyor, transformers'da qo'shimcha kod talab qiladi.",
      lesson: { title: "Paketlarni o'rnatish", href: "03-Installing-Packages.md" }
    },
    {
      q: "Muhitda resampy o'rnatilmagan. Qaysi chaqiruv xatosiz ishlaydi?",
      type: "single",
      options: [
        "librosa.resample(y, orig_sr=44100, target_sr=16000, res_type=\"kaiser_fast\")",
        "librosa.resample(y, orig_sr=44100, target_sr=16000)",
        "Faqat scipy.signal.resample — librosa resampy'siz qayta namunalamaydi",
        "Hech biri — librosa har qanday qayta namunalashda resampy talab qiladi"
      ],
      answer: [1],
      explain: "res_type=\"kaiser_fast\" resampy ni talab qiladi. Sukut bo'yicha esa o'rnatilgan soxr (soxr_hq) ishlatiladi — u scipy dan 2× tez va aniqroq.",
      lesson: { title: "Paketlarni o'rnatish", href: "03-Installing-Packages.md" }
    },
    {
      q: "Kursdagi Google Web Speech API kutubxonasini o'rnatish uchun qaysi buyruq to'g'ri yozilgan?",
      type: "single",
      options: [
        "pip install speech recognition",
        "pip install speech_recognition-google",
        "pip install SpeechRecognition",
        "pip install speech-recognition-api"
      ],
      answer: [2],
      explain: "Paket nomi bitta so'z, bosh harflar bilan: SpeechRecognition. Bo'sh joyli \"speech recognition\" — eng ko'p uchraydigan o'rnatish xatosi, kurs ham buni maxsus ta'kidlaydi. Import qilishda esa speech_recognition ishlatiladi.",
      lesson: { title: "Paketlarni o'rnatish", href: "03-Installing-Packages.md" }
    },
    {
      q: "Alohida jarayonda o'lchanganda import librosa 37.8 ms oldi — numpy dan ham tez. Lekin import + librosa.load() 1155 ms bo'ldi. Sababi nima?",
      type: "single",
      options: [
        "librosa lazy_loader ishlatadi: bog'liqliklar import paytida emas, birinchi ishlatishda yuklanadi",
        "librosa C tilida yozilgan, shuning uchun uning importi har doim tez bo'ladi",
        "O'lchov xato: librosa allaqachon sys.modules da bo'lgani uchun qayta yuklanmagan",
        "load() faylni internetdan yuklab oladi, import esa faqat mahalliy ishlaydi"
      ],
      answer: [0],
      explain: "librosa 1.0 numba, scipy, soundfile kabi bog'liqliklarni birinchi funksiya chaqiruvida yuklaydi, shuning uchun \"import vaqti\" aldamchi. Alohida jarayonda o'lchangani uchun sys.modules keshi bu yerda sabab emas.",
      lesson: { title: "Paketlarni import qilish", href: "04-Importing-Packages.md" }
    },
    {
      q: "Bu kod AttributeError beradi. Darsga ko'ra qanday tuzatiladi?",
      code: "import librosa\n\nS = librosa.feature.melspectrogram(y=y, sr=sr)\nlibrosa.display.specshow(S)",
      type: "single",
      options: [
        "librosa.load() ni specshow dan oldin chaqirish kerak",
        "specshow o'rniga librosa.feature.specshow ishlatish kerak",
        "matplotlib'ni o'chirish kerak, chunki u librosa bilan to'qnashadi",
        "import librosa.display qatorini alohida qo'shish kerak"
      ],
      answer: [3],
      explain: "librosa.display — matplotlib'ga bog'liq ixtiyoriy submodul, u import librosa bilan avtomatik yuklanmaydi. Shuning uchun uni alohida import qilish kerak.",
      lesson: { title: "Paketlarni import qilish", href: "04-Importing-Packages.md" }
    },
    {
      q: "Jupyter'da asl audio va 0.05 ga ko'paytirilgan (26 dB tinchroq) nusxasi tinglandi. Ikkalasi bir xil balandlikda eshitildi. Nega va haqiqiy farqni qanday eshitish mumkin?",
      code: "jim = y * 0.05\ndisplay(Audio(y, rate=sr))\ndisplay(Audio(jim, rate=sr))",
      type: "single",
      options: [
        "rate noto'g'ri berilgan; rate=22050 qilinsa farq eshitiladi",
        "Audio sukut bo'yicha normallashtiradi; normalize=False bilan haqiqiy farq eshitiladi",
        "Brauzer ovozni avtomatik tekislaydi; buni faqat fayl sifatida saqlab tekshirish mumkin",
        "0.05 ga ko'paytirish balandlikni o'zgartirmaydi; dB ga aylantirish kerak"
      ],
      answer: [1],
      explain: "Audio sukut bo'yicha signalni normallashtiradi, shuning uchun jim va baland fayl bir xil eshitiladi. Audio darajasini baholash uchun doim Audio(y, rate=sr, normalize=False) ishlating.",
      lesson: { title: "Paketlarni import qilish", href: "04-Importing-Packages.md" }
    },
    {
      q: "Loyiha faylidagi asr_model() funksiyasi global _asr o'zgaruvchisini ishlatadi. Darsga ko'ra bu nima uchun eng muhim detal?",
      code: "_asr = None\n\ndef asr_model(model=MODEL):\n    global _asr\n    if _asr is None:\n        from transformers import pipeline\n        _asr = pipeline(\"automatic-speech-recognition\", model=model)\n    return _asr",
      type: "single",
      options: [
        "U har chaqiruvda yangi model yaratib, xotira sizishining oldini oladi",
        "U transformers ni fayl boshida import qilishni majburiy qiladi",
        "Model faqat bir marta yuklanadi: 100 faylda ~430 s o'rniga ~4 s",
        "U modelni GPU ga ko'chirib, transkripsiyani tezlashtiradi"
      ],
      answer: [2],
      explain: "Singleton modelni faqat birinchi chaqiruvda yuklaydi; har fayl uchun qayta yuklash +4 soniyadan qimmatga tushadi (100 × 4.3 s = 430 s). Import esa funksiya ichida — kechiktirilgan.",
      lesson: { title: "Paketlarni import qilish", href: "04-Importing-Packages.md" }
    }
  ]
};
