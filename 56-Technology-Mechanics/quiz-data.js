window.QUIZ = {
  id: "56",
  title: "Texnologiya mexanikasi",
  subtitle: "Akustik va til modeli, HMM, CNN/RNN/LSTM, Transformer va Whisper ichi, model qurish va vosita tanlash",
  next: { label: "Muhitni sozlash", href: "../57-Setting-Up-the-Environment/README.md" },
  questions: [
    {
      q: "Akustik model \"recognize speech\" va \"wreck a nice beach\" iboralarini deyarli bir xil deb baholadi. Qaysi ibora yozilishini nima hal qiladi?",
      type: "single",
      options: [
        "Akustik modelning o'zi — u fonemalarni aniqroq ajratgani sari farq ko'rinadi",
        "MFCC o'rniga mel-spektrogramma ishlatilsa, farq akustik darajada paydo bo'ladi",
        "Til modeli — u qaysi so'z ketma-ketligi tilda ehtimolliroq ekanini baholaydi",
        "Talaffuz lug'ati — u har bir fonemani faqat bitta so'zga bog'lab qo'yadi"
      ],
      answer: [2],
      explain: "Ikkala ibora akustik jihatdan deyarli bir xil, shuning uchun tanlovni til modeli ehtimollik orqali qiladi: P(\"recognize speech\") yuqori, P(\"wreck a nice beach\") juda past.",
      lesson: { title: "Akustik va til modellashtirish", href: "01-Acoustic-and-Language-Modeling.md" }
    },
    {
      q: "Darsdagi n-gramm til modelida ehtimol alfa=0.1 bilan (Laplas silliqlashi) hisoblanadi. Silliqlash olib tashlansa nima bo'ladi?",
      type: "single",
      options: [
        "Korpusda uchramagan juftlik ehtimoli 0 bo'ladi, log(0) = -inf va butun jumla rad etiladi",
        "Qisqa jumlalar doim yutadi, chunki ehtimol uzunlikka normallanmay qoladi",
        "Model tartibni ajratmay qo'yadi, lekin barcha jumlalar bir xil chekli ball oladi",
        "Hech narsa o'zgarmaydi, chunki kichik korpusda barcha juftliklar uchragan bo'ladi"
      ],
      answer: [0],
      explain: "Silliqlashsiz korpusda uchramagan juftlik ehtimoli 0 ga teng, log(0) = -inf bo'lib, jumla butunlay rad etiladi. Qisqa jumla ustunligi esa silliqlash emas, uzunlikka normallash (/ len) bilan bog'liq.",
      lesson: { title: "Akustik va til modellashtirish", href: "01-Acoustic-and-Language-Modeling.md" }
    },
    {
      q: "Whisper'ning encoder va decoder qismlari haqida qaysi fikrlar darsdagi o'lchovlarga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Encoder akustik model vazifasini bajaradi: audio → vakillik",
        "Whisper parametrlarining asosiy qismi encoderda joylashgan",
        "whisper-tiny da decoder encoderdan taxminan 3.6 marta katta",
        "Decoder faqat audio xususiyatlarni fonemalarga aylantiradi",
        "Kuchli til modeli sabab Whisper eshitmagan so'zni ham yozishi mumkin"
      ],
      answer: [0, 2, 4],
      explain: "Encoder — akustik model, decoder — til modeli; tiny da 8.2M ga qarshi 29.6M (3.61×), parametrlarning ~70% i decoderda. Aynan kuchli til modeli tufayli Whisper kutilgan, lekin aytilmagan so'zni yozib qo'yishi mumkin.",
      lesson: { title: "Akustik va til modellashtirish", href: "01-Acoustic-and-Language-Modeling.md" }
    },
    {
      q: "\"speech\" so'zida /s/ → /p/ → /iː/ → /tʃ/ ketma-ketligi bor. HMM ning Markov taxmini bu yerda qanday cheklov keltirib chiqaradi?",
      type: "single",
      options: [
        "HMM har fonemaga faqat bitta holat beradi, shuning uchun davomiylikni umuman bilmaydi",
        "/tʃ/ ni bashorat qilishda faqat hozirgi fonema hisobga olinadi, /s/ esa unutiladi",
        "HMM chiqish ehtimolini hisoblay olmaydi, faqat o'tish ehtimolini sanaydi",
        "Keyingi fonema butun ketma-ketlikka bog'liq bo'lgani uchun hisoblash juda sekinlashadi"
      ],
      answer: [1],
      explain: "Markov taxminiga ko'ra keyingi fonema faqat hozirgisiga bog'liq, uzoq kontekst yo'qoladi. Amalda buni trifonlar va har fonemaga 3 holat (boshi, o'rtasi, oxiri) berish orqali yumshatishgan.",
      lesson: { title: "HMM va an'anaviy neyron tarmoqlar", href: "02-HMM-and-Neural-Networks.md" }
    },
    {
      q: "Darsdagi kontekst oynasi funksiyasi 26 o'lchamli freymlarga qo'llanildi. Kod nimani chiqaradi?",
      code: "import numpy as np\n\ndef kontekst_oyna(X, k=5):\n    n, d = X.shape\n    P = np.pad(X, ((k, k), (0, 0)), mode=\"edge\")\n    return np.concatenate([P[i:i + n] for i in range(2 * k + 1)], axis=1)\n\nX = np.zeros((100, 26))\nprint(kontekst_oyna(X, 5).shape)",
      type: "single",
      options: [
        "(110, 26)",
        "(100, 130)",
        "(110, 286)",
        "(100, 286)"
      ],
      answer: [3],
      explain: "Chetlari to'ldirilgach har freymga 2k+1 = 11 ta qo'shni freym ulanadi: freymlar soni 100 bo'lib qoladi, o'lcham esa 26 × 11 = 286 bo'ladi (darsdagi ±5 freym, 286 o'lcham).",
      lesson: { title: "HMM va an'anaviy neyron tarmoqlar", href: "02-HMM-and-Neural-Networks.md" }
    },
    {
      q: "SEQ=200 da RNN ning birinchi freymga gradienti aynan 0.0 chiqdi, LSTM niki esa noldan farqli qoldi. Darsga ko'ra asosiy sabab nima?",
      type: "single",
      options: [
        "LSTM da parametrlar ko'proq, shuning uchun gradient kattaroq bo'lib qoladi",
        "LSTM freymlarni teskari tartibda ham o'qiydi va boshini yaxshiroq eslaydi",
        "RNN da tanh o'rniga ReLU ishlatilgani uchun gradient nolga kesiladi",
        "RNN da holat har qadamda W ga ko'paytiriladi, LSTM da esa c_{t-1} ga qo'shiladi"
      ],
      answer: [3],
      explain: "RNN: h_t = tanh(W·h_{t-1} + U·x_t) — har qadamda ko'paytirish gradientni eksponensial kamaytiradi. LSTM: c_t = f_t·c_{t-1} + i_t·g_t — qo'shish va unutish darvozasi f_t ≈ 1 bo'lsa gradient saqlanadi.",
      lesson: { title: "Chuqur o'rganish: CNN, RNN, LSTM", href: "03-Deep-Learning-Models.md" }
    },
    {
      q: "To'g'ri yoki noto'g'ri: ovozli/ovozsiz freym masalasida uzun ketma-ketlikda (SEQ=256) LSTM RNN dan ustun chiqdi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "RNN hamma uzunlikda yutdi (SEQ=256 da 87.3% ga qarshi LSTM 84.4%): masala uzoq xotirani talab qilmaydi va ma'lumot kam. LSTM va Transformer faqat javob birinchi freymda bo'lgan uzoq bog'liqlik masalasida ustun chiqdi.",
      lesson: { title: "Chuqur o'rganish: CNN, RNN, LSTM", href: "03-Deep-Learning-Models.md" }
    },
    {
      q: "23.51 soniyalik audio Whisper feature extractor'iga berildi. Kod qanday shaklni chiqaradi?",
      code: "from transformers import WhisperProcessor\nimport librosa\n\nproc = WhisperProcessor.from_pretrained(\"openai/whisper-tiny\")\ny, sr = librosa.load(\"speech_01.wav\", sr=16000)   # 23.51 s\nf = proc.feature_extractor(y, sampling_rate=16000, return_tensors=\"pt\")\nprint(tuple(f.input_features.shape))",
      type: "single",
      options: [
        "(1, 80, 2351)",
        "(1, 80, 3000)",
        "(1, 3000, 80)",
        "(1, 1500, 384)"
      ],
      answer: [1],
      explain: "Whisper kirishi doim 80 × 3000 (30 soniya): qisqa audio jimlik bilan to'ldiriladi. (1, 1500, 384) esa encoder chiqishi — conv stride=2 tufayli 3000 → 1500 siqilgan holat.",
      lesson: { title: "Transformerlar", href: "04-Transformers.md" }
    },
    {
      q: "Darsdagi e'tibor funksiyasi tasodifiy Q, K, V bilan chaqirildi. Kod nimani chiqaradi?",
      code: "import torch\n\ndef etibor(Q, K, V):\n    d = Q.shape[-1]\n    ball = Q @ K.transpose(-2, -1) / (d ** 0.5)\n    w = torch.softmax(ball, dim=-1)\n    return w @ V, w\n\ntorch.manual_seed(0)\nQ = K = V = torch.randn(1, 8, 16)\nout, w = etibor(Q, K, V)\nprint(tuple(out.shape), tuple(w.shape))",
      type: "single",
      options: [
        "(1, 8, 8) (1, 8, 16)",
        "(1, 16, 16) (1, 8, 8)",
        "(1, 8, 16) (1, 8, 8)",
        "(1, 8, 16) (1, 16, 16)"
      ],
      answer: [2],
      explain: "Q·Kᵀ har freymni har freym bilan solishtiradi, shuning uchun og'irliklar 8 × 8; ularni V (8 × 16) ga ko'paytirish chiqishni (1, 8, 16) qiladi.",
      lesson: { title: "Transformerlar", href: "04-Transformers.md" }
    },
    {
      q: "E'tibor formulasida Q·Kᵀ ni √d ga bo'lish olib tashlansa, darsga ko'ra nima bo'ladi?",
      type: "single",
      options: [
        "Softmax taqsimoti tekislanadi va model hamma freymga teng qaraydi",
        "Ballar katta bo'lib, softmax bitta freymga yig'iladi va gradient deyarli nolga tushadi",
        "Og'irliklar qatorlari yig'indisi 1 dan katta bo'lib, ehtimollik buziladi",
        "Hisoblash murakkabligi O(n²) dan O(n³) ga oshadi"
      ],
      answer: [1],
      explain: "√d siz ball diapazoni -6.64..25.20 gacha kengaydi va softmax maksimumi aynan 1.0000 bo'ldi. Softmax gradienti p(1−p) bo'lgani uchun p = 1 da gradient 0 — model o'rganmaydi. Qatorlar yig'indisi esa baribir 1 bo'lib qoladi.",
      lesson: { title: "Transformerlar", href: "04-Transformers.md" }
    },
    {
      q: "Quyidagi kod ishlaydi va xato bermaydi, lekin darsga ko'ra e'tibor matritsalari olinmaydi. Qaysi o'zgartirish buni tuzatadi?",
      code: "m = WhisperForConditionalGeneration.from_pretrained(\"openai/whisper-tiny\")\nm.eval()\nwith torch.no_grad():\n    eo = m.model.encoder(f.input_features, output_attentions=True)\nprint(len(eo.attentions))",
      type: "single",
      options: [
        "encoder chaqiruviga output_hidden_states=True qo'shish",
        "torch.no_grad() blokini olib tashlash",
        "from_pretrained ga attn_implementation=\"eager\" qo'shish",
        "m.eval() o'rniga m.train() chaqirish"
      ],
      answer: [2],
      explain: "Sukut bo'yicha tezroq sdpa ishlatiladi va u output_attentions=True ni qo'llab-quvvatlamaydi — jimgina bo'sh natija qaytadi. attn_implementation=\"eager\" bilan 4 qatlam × (1, 6, 1500, 1500) e'tibor olinadi.",
      lesson: { title: "Transformerlar", href: "04-Transformers.md" }
    },
    {
      q: "Jamoa har bir gapiruvchining 40 ta yozuvini tasodifiy train_test_split bilan bo'ldi va 98.8% oldi. Gapiruvchi bo'yicha bo'lishda natija 53.8% chiqdi. Nima bo'lgan?",
      type: "single",
      options: [
        "Gapiruvchi bo'yicha bo'lishda sinov to'plami juda kichik bo'lib, natija tasodifan tushgan",
        "Tasodifiy bo'lishda model ko'proq ma'lumot ko'rgani uchun haqiqatan yaxshiroq o'rgangan",
        "Model gapiruvchilarning individual \"izi\"ni yodlab oldi — bu ma'lumot sizib chiqishi",
        "GroupShuffleSplit o'qitish va sinovga bir xil gapiruvchilarni joylashtirib yuborgan"
      ],
      answer: [2],
      explain: "Tasodifiy bo'lishda bir gapiruvchi ikkala to'plamda bo'ladi va model uning ovozidan belgini taxmin qiladi. Yangi gapiruvchida bu bilim behuda, shuning uchun GroupShuffleSplit bilan gapiruvchi bo'yicha bo'lish kerak.",
      lesson: { title: "Nutqni tanish modelini qurish", href: "05-Building-a-Model.md" }
    },
    {
      q: "Nutqni tanish modelini qurish bo'yicha qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Noldan o'qitish 10–100 soat audio va bitta GPU bilan bir necha kunda bajariladi",
        "Holatlarning taxminan 90% ida tayyor modelni ishlatish yetarli",
        "Whisper — CNN (ikki Conv1d) va Transformer gibridi",
        "WER hech qachon 1.0 dan oshmaydi, chunki u xato so'zlar foizi",
        "O'zbek tili uchun eng mantiqiy yo'l — Whisper'ni fine-tuning qilish"
      ],
      answer: [1, 2, 4],
      explain: "10–100 soat va bir necha kun — bu fine-tuning; noldan o'qitish 680 000 soat va oylar talab qiladi. WER esa model etalondan ko'p so'z yozsa 1.0 dan oshishi mumkin (gallyutsinatsiyada 3.0 ham).",
      lesson: { title: "Nutqni tanish modelini qurish", href: "05-Building-a-Model.md" }
    },
    {
      q: "Klinika shifokor–bemor suhbatlarini transkripsiya qilmoqchi. Darsdagi tavsiyaga ko'ra qaysi yo'l to'g'ri?",
      type: "single",
      options: [
        "Google Web Speech API — bepul va sozlash eng oson",
        "Faqat mahalliy model (Whisper) — audio kompyuterdan chiqmaydi",
        "DeepSpeech — real vaqtli va oflayn ishlaydi, shuning uchun eng xavfsiz",
        "AssemblyAI — diarizatsiya bor, shuning uchun tibbiy yozuvga eng mos"
      ],
      answer: [1],
      explain: "Tibbiy, huquqiy va bank yozuvlarini uchinchi tomon serveriga yuborish ko'pincha taqiqlangan; Google API esa audioni serverga yuboradi. DeepSpeech 2021-da to'xtatilgan.",
      lesson: { title: "To'g'ri vositani tanlash", href: "06-Selecting-the-Tool.md" }
    },
    {
      q: "Jonli efir uchun real vaqtli subtitr kerak. Nega Whisper'ni o'zicha ishlatish darsda yaramaydi deb baholangan?",
      type: "single",
      options: [
        "U 30 soniyalik bo'lakni to'liq olib keyin ishlaydi — kamida 30 s kechikish bo'ladi",
        "U faqat ingliz tilini biladi, subtitr esa ko'p tilli bo'lishi kerak",
        "U GPU siz ishlamaydi, efir serverlarida esa odatda GPU bo'lmaydi",
        "U tinish belgilarini qo'ymaydi, subtitr esa o'qilishi qiyin bo'lib qoladi"
      ],
      answer: [0],
      explain: "Whisper oqim uchun yaratilmagan: 30 s lik bo'lakni kutadi. Real vaqt uchun Google Streaming, Deepgram yoki faster-whisper + VAD tavsiya qilinadi.",
      lesson: { title: "To'g'ri vositani tanlash", href: "06-Selecting-the-Tool.md" }
    }
  ]
};
