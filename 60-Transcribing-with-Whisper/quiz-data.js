window.QUIZ = {
  id: "60",
  title: "OpenAI Whisper bilan transkripsiya",
  subtitle: "Whisper transformers orqali, dekodlash va \"stoxastiklik\", ko'p faylni transkripsiya qilish, CSV va matndan nutqqa",
  next: { label: "Yakuniy muhokama va kelajak yo'nalishlari", href: "../61-Final-Discussion/README.md" },
  questions: [
    {
      q: "Kurs Whisper ni openai-whisper paketi bilan ishlatadi, biz esa transformers pipeline bilan. Bizning yo'lning asosiy afzalligi nima?",
      type: "single",
      options: [
        "transformers modeli kattaroq, shuning uchun WER har doim ancha past chiqadi",
        "ffmpeg kerak emas (faylni librosa o'qiydi) va dekodlash greedy, ya'ni deterministik",
        "transformers audioni OpenAI serveriga yuboradi, shuning uchun kompyuter yuklanmaydi",
        "transformers vaqt belgilarini qaytarmaydi, shuning uchun transkripsiya ikki barobar tez"
      ],
      answer: [1],
      explain: "openai-whisper ffmpeg talab qiladi va temperature fallback bilan dekodlaydi. transformers da librosa.load(..., sr=16000) faylni o'zi o'qiydi, dekodlash esa greedy. Vaqt belgilari ham return_timestamps=True bilan mavjud.",
      lesson: { title: "Whisper AI — transformerga asoslangan nutqni tanish", href: "01-Whisper-Transformer-STT.md" }
    },
    {
      q: "Google Web Speech va Whisper-base solishtirilganda qaysi xulosalar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Whisper 9 ta tinish belgisi qo'ydi, Google esa birorta ham qo'ymadi",
        "Normallashtirilgandan keyin Whisper Google dan 10× aniqroq chiqdi",
        "Whisper modeli yuklab olingach internet kerak emas va audio hech qayerga ketmaydi",
        "Whisper ning yagona \"xatosi\" Ivan → Yvonne aslida ground truth ning xatosi",
        "Whisper ~30 soniyadan keyin audioni kesib qo'yadi, Google esa avtomatik bo'laklaydi"
      ],
      answer: [0, 2, 3],
      explain: "Toza WER 0.0328 va 0.0164 — farq bor-yo'g'i bitta so'z (turned/turn), Whisper ning ustunligi asosan formatlashda. ~30 s dan keyin kesish Google ga xos, Whisper esa avtomatik bo'laklaydi.",
      lesson: { title: "Whisper AI — transformerga asoslangan nutqni tanish", href: "01-Whisper-Transformer-STT.md" }
    },
    {
      q: "Track5.wav (3.57 s) 4.27× real vaqtda, speech_01.wav (23.51 s) esa 8.07× real vaqtda transkripsiya qilindi. Nega uzun fayl nisbatan tezroq?",
      type: "single",
      options: [
        "Uzun faylda jimlik ko'p, Whisper jim joylarni o'tkazib yuboradi",
        "Qisqa fayllar uchun Whisper avtomatik ravishda kattaroq modelga o'tadi",
        "Kirish har doim 30 soniyaga to'ldiriladi (1, 80, 3000), encoder narxi doimiy",
        "Uzun fayl birinchi yuklanganda keshga tushadi, qisqa fayl esa tushmaydi"
      ],
      answer: [2],
      explain: "3 soniyalik audio ham 25 soniyalik ham bir xil o'lchamdagi tenzorga to'ldiriladi. Encoder narxi doimiy, faqat decoder uzunlikka bog'liq. Amaliy xulosa: qisqa fayllar nisbatan qimmat.",
      lesson: { title: "Whisper AI — transformerga asoslangan nutqni tanish", href: "01-Whisper-Transformer-STT.md" }
    },
    {
      q: "return_timestamps=True faqat vaqt belgilarini qo'shadi va transkript matniga hech qachon ta'sir qilmaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Vaqt belgilari oddiy tokenlar va ular greedy dekodlash yo'lini o'zgartiradi: whisper-tiny da qo'shimcha xato (my → like) paydo bo'lib, WER 0.0164 dan 0.0328 ga oshdi. Modellarni taqqoslashda False ishlatish kerak.",
      lesson: { title: "Whisper AI — transformerga asoslangan nutqni tanish", href: "01-Whisper-Transformer-STT.md" }
    },
    {
      q: "Kurs \"Whisper stoxastik, data so'zi ba'zan yo'qoladi\" deydi. Darsga ko'ra tasodifiylik qayerdan keladi?",
      type: "single",
      options: [
        "Transformer og'irliklari har ishga tushirishda tasodifiy qayta initsializatsiya qilinadi",
        "Mel spektrogramma har safar turlicha hisoblanadi, chunki STFT tasodifiy oyna tanlaydi",
        "librosa faylni har safar boshqa diskretlash chastotasi bilan o'qiydi",
        "Dekodlashdan: openai-whisper shubhali natijada temperature 0.2, 0.4 ... ga o'tadi"
      ],
      answer: [3],
      explain: "Model deterministik funksiya. openai-whisper ning temperature fallback'i compression_ratio > 2.4 yoki logprob < −1.0 bo'lsa temperature ni oshiradi. model.transcribe(path, temperature=0.0) bilan bu o'chiriladi.",
      lesson: { title: "\"Variativlik haqida eslatma\" — kursning uy vazifasi", href: "02-A-Note-on-Variability.md" }
    },
    {
      q: "asr — transformers Whisper pipeline. Quyidagi kod nima chiqaradi?",
      code: "hashlar = set()\nfor i in range(3):\n    gk = {\"temperature\": 0.0, \"do_sample\": False}\n    t = asr(y.copy(), generate_kwargs=gk)[\"text\"].strip()\n    hashlar.add(hashlib.md5(t.encode()).hexdigest()[:8])\nprint(len(hashlar))",
      type: "single",
      options: [
        "3 — Whisper har ishga tushirishda boshqacha matn beradi",
        "2 — birinchi natija keshsiz bo'lgani uchun farq qiladi",
        "1 — greedy dekodlash har safar aynan bir xil natija beradi",
        "0 — temperature=0.0 da generatsiya bo'sh matn qaytaradi"
      ],
      answer: [2],
      explain: "temperature=0 va do_sample=False — greedy dekodlash, shuning uchun 3 ta natija ham bir xil hash beradi. temperature 0.5 va undan yuqorida esa 3/3 turli natija chiqib, data so'zi yo'qolgan.",
      lesson: { title: "\"Variativlik haqida eslatma\" — kursning uy vazifasi", href: "02-A-Note-on-Variability.md" }
    },
    {
      q: "Whisper chiqishida gallyutsinatsiya yoki model \"taqa qolgani\"ni qaysi belgilar ko'rsatadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Noyob so'zlar ulushi juda past (masalan 7.1%)",
        "Soniyasiga 4 dan ortiq so'z (masalan 14.38 so'z/s)",
        "Matnda tinish belgilari ko'p ekani",
        "Soniyasiga 0.5 dan kam so'z (masalan 0.04 so'z/s)",
        "Jumlalar katta harf bilan boshlanishi"
      ],
      answer: [0, 1, 3],
      explain: "Odam nutqi 2.0–3.5 so'z/s: 14.38 jismonan imkonsiz, 0.04 esa model taslim bo'lganini bildiradi. Shuning uchun detektor ikkala tomondan chegara qo'yadi. Tinish belgilari va katta harflar esa Whisper ning oddiy formatlashi.",
      lesson: { title: "\"Variativlik haqida eslatma\" — kursning uy vazifasi", href: "02-A-Note-on-Variability.md" }
    },
    {
      q: "Kursning papka kodi for file_name in os.listdir(directory_path) bilan ishlaydi va natijalarni \"Track Number\" bilan CSV ga yozadi. Bunda qanday xavf bor?",
      type: "single",
      options: [
        "os.listdir() tartibi kafolatlanmagan — tartib raqamlari noto'g'ri bo'lib qolishi mumkin; sorted() kerak",
        "os.listdir() yashirin fayllarni ham qaytaradi, shuning uchun Whisper ularni ham transkripsiya qiladi",
        "os.listdir() faqat birinchi 100 ta faylni qaytaradi, qolganlari e'tiborsiz qoladi",
        "os.listdir() to'liq yo'l qaytaradi, shuning uchun os.path.join ikki marta yo'l qo'shadi"
      ],
      answer: [0],
      explain: "Python hujjatlari ro'yxat ixtiyoriy tartibda deydi. Windows'da odatda alifbo bo'yicha chiqsa ham kafolat yo'q, shuning uchun sorted(os.listdir(...)) ishlatiladi.",
      lesson: { title: "Papkadagi bir nechta audio faylni transkripsiya qilish", href: "03-Transcribing-Multiple-Files.md" }
    },
    {
      q: "Papkani transkripsiya qiluvchi funksiyada quyidagi tekshiruv bor. U nima uchun kerak?",
      code: "qism = sig[i:i + batch]\nr = asr([s.copy() for s in qism], batch_size=len(qism))\nif isinstance(r, dict):\n    r = [r]",
      type: "single",
      options: [
        "Pipeline bo'sh matn qaytarganda xatoni ushlab, faylni qayta yuborish uchun",
        "Blokda bitta signal qolsa pipeline dict qaytaradi — uni ro'yxatga o'rab, zip() ni saqlash uchun",
        "Vaqt belgilari yoqilganda chunks kalitini matnga birlashtirish uchun",
        "CPU da batch_size to'yinganini aniqlab, ketma-ket rejimga o'tish uchun"
      ],
      answer: [1],
      explain: "Kod izohida aytilganidek, 1 ta element uchun natija dict bo'ladi. Keyingi zip(qism, r) ro'yxat kutadi, shuning uchun dict ro'yxatga o'raladi.",
      lesson: { title: "Papkadagi bir nechta audio faylni transkripsiya qilish", href: "03-Transcribing-Multiple-Files.md" }
    },
    {
      q: "Sizda 10 000 ta audio fayl bor (~16 soat audio). Darsga ko'ra kodni qanday o'zgartirish kerak?",
      type: "single",
      options: [
        "batch_size ni 8 ga oshirish kifoya — CPU da bu ishni taxminan 5–10× tezlashtiradi",
        "Barcha natijalarni ro'yxatda yig'ib, oxirida bitta writerows() bilan yozish",
        "Har faylni darhol CSV ga yozib flush() qilish va allaqachon qilinganlarni o'tkazib davom ettirish",
        "Fayllarni tiny modelga o'tkazish, chunki katta hajmda base xotiraga sig'maydi"
      ],
      answer: [2],
      explain: "Natijalarni RAM da saqlab bo'lmaydi va ish yarmida uzilsa boshidan boshlash kerak bo'lmasligi lozim. CPU da batch faqat ~1.30× beradi, 5–10× esa GPU da.",
      lesson: { title: "Papkadagi bir nechta audio faylni transkripsiya qilish", href: "03-Transcribing-Multiple-Files.md" }
    },
    {
      q: "Standart kodlashi cp1251 bo'lgan Windows'da bu kod nima qiladi va qaysi tuzatish tavsiya qilingan?",
      code: "import csv\n\nwith open(\"out.csv\", mode=\"w\", newline=\"\") as f:\n    csv.writer(f).writerow([\"1\", \"Track1.wav\", \"curious about “AI” — ✅\"])",
      type: "single",
      options: [
        "Hammasi yoziladi, lekin Excel'da bo'sh qatorlar chiqadi — newline=\"\" ni olib tashlash kerak",
        "Belgilar ?? bo'lib yoziladi — encoding=\"ascii\" berish kerak",
        "Hammasi yoziladi — Windows kodlashi har qanday belgini qo'llaydi",
        "UnicodeEncodeError bilan yiqiladi — encoding=\"utf-8-sig\" berish kerak"
      ],
      answer: [3],
      explain: "cp1251 da “, — va ✅ belgilari yo'q, shuning uchun ish oxirgi qadamda yiqiladi. utf-8-sig BOM qo'shadi va Excel faylni UTF-8 deb to'g'ri ochadi. newline=\"\" esa bo'sh qatorlarning oldini oladi, uni olib tashlamaslik kerak.",
      lesson: { title: "Transkriptlarni CSV ga saqlash", href: "04-Saving-to-CSV.md" }
    },
    {
      q: "Quyidagi kod ekranga nima chiqaradi?",
      code: "import csv, sys\n\ncsv.writer(sys.stdout).writerow([1, \"a.wav\", \"Hello, world\"])",
      type: "single",
      options: [
        "1,a.wav,\"Hello, world\"",
        "1,a.wav,Hello, world",
        "\"1\",\"a.wav\",\"Hello, world\"",
        "1;a.wav;Hello, world"
      ],
      answer: [0],
      explain: "csv moduli vergul bor maydonni o'zi qo'shtirnoqqa oladi, qolgan maydonlarga tegmaydi. Qo'lda f.write(f\"{a},{b},{c}\") yozilsa, vergul ustunlarni buzadi.",
      lesson: { title: "Transkriptlarni CSV ga saqlash", href: "04-Saving-to-CSV.md" }
    },
    {
      q: "gTTS haqida qaysi fikr darsga mos?",
      type: "single",
      options: [
        "API kaliti shart, lekin internetsiz ham ishlaydi",
        "Kalit kerak emas, internet shart, uz tili esa ro'yxatda yo'q",
        "Kalit va internet kerak emas, 69 til ichida uz ham bor",
        "Rasmiy Google API, shuning uchun limit va barqarorlik kafolatlangan"
      ],
      answer: [1],
      explain: "gTTS — Google Translate TTS ning rasmiy bo'lmagan ichki interfeysiga o'ram: kalit talab qilmaydi, lekin internet shart. tts_langs() da 69 til bor, \"uz\" in tillar esa False chiqdi.",
      lesson: { title: "Teskari jarayon — AI bilan matndan nutqqa", href: "05-Text-to-Speech.md" }
    },
    {
      q: "gTTS → Whisper aylanma sinovida WER = 0.0000 chiqdi. Darsga ko'ra bu natijadan qanday foydalanish to'g'ri?",
      type: "single",
      options: [
        "Model aniqligini baholash uchun — TTS audio eng adolatli test",
        "Modelni faqat TTS ma'lumotida o'qitish uchun — u haqiqiy ovozda ham yaxshi ishlaydi",
        "Quvur ishlayotganini tekshirish uchun, lekin model aniqligini baholash uchun emas",
        "gTTS ning tinish belgilarini tekshirish uchun — Whisper ularni o'zi qo'ymaydi"
      ],
      answer: [2],
      explain: "TTS audio shovqinsiz va talaffuzi mukammal, shuning uchun juda oson — natija haqiqiydan yuqori chiqadi. Lekin WER ≠ 0 chiqsa, bu kodda muammo borligini bildiradi, shuning uchun quvurni tekshirishga juda foydali.",
      lesson: { title: "Teskari jarayon — AI bilan matndan nutqqa", href: "05-Text-to-Speech.md" }
    },
    {
      q: "Darsdagi RAQAMLAR lug'ati va raqam_normallash funksiyasi berilgan. Quyidagi kod nima chiqaradi?",
      code: "RAQAMLAR = {\"one\": \"1\", \"two\": \"2\", \"three\": \"3\"}\n\ndef raqam_normallash(s):\n    return \" \".join(RAQAMLAR.get(w, w) for w in s.split())\n\nprint(raqam_normallash(\"testing one two three\"))",
      type: "single",
      options: [
        "testing one two three",
        "1 2 3",
        "testing 1-2-3",
        "testing 1 2 3"
      ],
      answer: [3],
      explain: "get(w, w) lug'atda bor so'zni raqamga almashtiradi, qolganini o'zgartirmaydi. Whisper \"one two three\" ni \"1-2-3\" deb yozgan edi; ikkala matn tinish belgilaridan tozalanib, raqamlar shunday normallashtirilgach, WER 0.2308 dan 0.0000 ga tushdi.",
      lesson: { title: "Teskari jarayon — AI bilan matndan nutqqa", href: "05-Text-to-Speech.md" }
    }
  ]
};
