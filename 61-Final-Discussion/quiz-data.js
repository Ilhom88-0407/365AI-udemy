window.QUIZ = {
  id: "61",
  title: "Yakuniy muhokama va kelajak yo'nalishlari",
  subtitle: "Real vaqt va tarjima, ASR ning cheklovlari, gallyutsinatsiya, maxfiylik va nutqni tanishning kelajagi",
  next: { label: "LLM Engineering — kirish", href: "../62-LLM-Engineering-Introduction/README.md" },
  questions: [
    {
      q: "Kurs \"transformer modellari (Whisper) murakkab va shovqinli audio muammosini hal qiladi\" deydi. O'lchovlarimiz nimani ko'rsatdi?",
      type: "single",
      options: [
        "Whisper barcha SNR darajalarida Google dan kamida 2× yaxshi natija berdi, ayniqsa −5 dB da",
        "Toza audioda Whisper yaxshi, 0 dB va pastda esa Google yutdi, Whisper gallyutsinatsiya qildi",
        "Ikkala model shovqinda bir xil yiqildi, farq faqat tinish belgilari va katta harflarda qoldi",
        "Toza audioda Google yaxshiroq, shovqinda esa Whisper kontekst tufayli aniq ustun keldi"
      ],
      answer: [1],
      explain: "0 dB da Google 0.0656, Whisper 0.2623; −5 dB da esa 0.4262 va 5.3279. Transformerlar kontekst bilan yaxshiroq ishlaydi, lekin shovqinga chidamlilik har doim ham kafolatlanmaydi.",
      lesson: { title: "Zamonaviy amaliyot va qo'llanmalar", href: "01-Modern-Practices.md" }
    },
    {
      q: "Oqim simulyatsiyasida 10 soniyalik bo'lak 1.56 soniyada qayta ishlandi. Quyidagi kod nima chiqaradi?",
      code: "bolak_s = 10\ndt = 1.56\nprint(f\"RTF {dt/bolak_s:.2f}  kechikish {bolak_s + dt:.2f} s\")",
      type: "single",
      options: [
        "RTF 1.56  kechikish 1.56 s",
        "RTF 6.41  kechikish 11.56 s",
        "RTF 0.16  kechikish 1.56 s",
        "RTF 0.16  kechikish 11.56 s"
      ],
      answer: [3],
      explain: "RTF = ishlov vaqti / audio uzunligi = 0.156 ≈ 0.16. Foydalanuvchi esa bo'lak to'lishini ham kutadi, shuning uchun haqiqiy kechikish = bo'lak uzunligi + ishlov vaqti = 11.56 s.",
      lesson: { title: "Zamonaviy amaliyot va qo'llanmalar", href: "01-Modern-Practices.md" }
    },
    {
      q: "RTF eng yomon bo'lishiga (0.65) qaramay, jonli transkripsiya uchun 1 soniyalik bo'lak eng yaxshi tanlov deyiladi. Nega, va uning kamchiligi nima?",
      type: "single",
      options: [
        "Jami kechikish eng kichik (1.65 s), lekin qisqa bo'lakda kontekst yo'q — aniqlik bilan murosa",
        "1 s bo'lakda Whisper encoder'i ishlamaydi, shuning uchun tez, lekin tinish belgilari yo'qoladi",
        "1 s bo'lakda gallyutsinatsiya bo'lmaydi, lekin CPU yuklamasi 10× oshadi",
        "1 s bo'lak GPU talab qilmaydi, uzunroq bo'laklar esa faqat GPU da real vaqtda ishlaydi"
      ],
      answer: [0],
      explain: "1 s → 1 + 0.65 = 1.65 s, 10 s → 11.56 s. Foydalanuvchi uchun eng tezi 1 s, lekin Whisper ning kuchi uzun kontekstda, shuning uchun real vaqt va aniqlik o'rtasida murosa bor.",
      lesson: { title: "Zamonaviy amaliyot va qo'llanmalar", href: "01-Modern-Practices.md" }
    },
    {
      q: "Whisper turkcha \"ses mühendisi ... veri bilimi\" gapini \"voice teacher ... give information\" deb tarjima qildi. Asosiy sabab nima?",
      type: "single",
      options: [
        "task=\"translate\" turk tilini qo'llab-quvvatlamaydi, shuning uchun model tasodifiy so'z tanladi",
        "Tarjima 0.9 soniyada bajarilgani uchun model gapni oxirigacha eshitmay qoldi",
        "Transkripsiyada veri bilimi → verebilimi deb xato tanilib, xato tarjimaga zanjirlanib o'tdi",
        "Turkcha audio stereo bo'lgani uchun ikkala kanal bir-biriga aralashib ketdi"
      ],
      answer: [2],
      explain: "Transkripsiya xatosi → tarjima xatosi → butunlay boshqa ma'no. Turk tili Whisper ning o'quv ma'lumotida ingliz yoki nemisga qaraganda ancha kam — bu kam resursli tillar muammosi, o'zbek tili uchun ham xuddi shunday.",
      lesson: { title: "Zamonaviy amaliyot va qo'llanmalar", href: "01-Modern-Practices.md" }
    },
    {
      q: "Darsga ko'ra 2026-yilda bank uchun faqat ovoz bilan shaxsni tasdiqlash xavfsiz va qulay usul hisoblanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Bugun ovozni klonlash uchun 5–10 soniyalik namuna yetarli, uni esa telefon qo'ng'irog'i yoki ovozli xabardan olish oson. Ovoz faqat qo'shimcha omil bo'lishi mumkin: ovoz + parol + qurilma.",
      lesson: { title: "Zamonaviy amaliyot va qo'llanmalar", href: "01-Modern-Practices.md" }
    },
    {
      q: "gTTS ning oltita mintaqaviy \"aksent\"ida Whisper xato qilmadi (faqat river bank → riverbank). Nega bu \"aksentlar muammo emas\" degan xulosaga asos bo'lmaydi?",
      type: "single",
      options: [
        "Chunki riverbank xatosi aslida aksent tufayli yuzaga kelgan jiddiy tanish xatosi bo'lib chiqdi",
        "Chunki gTTS aksentlari bitta sintez modelining sun'iy variantlari, haqiqiy so'zlovchilar emas",
        "Chunki sinov faqat 4.63 soniyalik audioda o'tkazilgan, 30 soniyadan kam audio hisobga olinmaydi",
        "Chunki Whisper aksentni sezsa, avtomatik ravishda ingliz tilidan boshqa tilga o'tib ketadi"
      ],
      answer: [1],
      explain: "riverbank — tanish xatosi emas, qo'shib yozish qarori. Haqiqiy sinov uchun Common Voice yoki L2-ARCTIC kabi haqiqiy odamlar yozuvlari kerak; aytish mumkin bo'lgani faqat: sintetik aksent variatsiyasi ta'sir qilmadi.",
      lesson: { title: "Muammolar va cheklovlar", href: "02-Challenges-and-Limitations.md" }
    },
    {
      q: "Yangi so'zlar va jargon sinovida qaysi atamalar noto'g'ri tanildi? (bir nechta javob)",
      type: "multi",
      options: [
        "LoRA",
        "retrieval augmented generation",
        "PyTorch",
        "RLHF",
        "VRAM"
      ],
      answer: [0, 2, 4],
      explain: "LoRA → Laura, PyTorch → pie torch, VRAM → RAM bo'ldi. Oddiy so'zlardan tuzilgan atamalar va RLHF kabi qisqartmalar to'g'ri tanildi — muammo lug'atda yo'q brend va aralash so'zlarda.",
      lesson: { title: "Muammolar va cheklovlar", href: "02-Challenges-and-Limitations.md" }
    },
    {
      q: "\"The meeting is at nine. La reunión es a las nueve. Thank you.\" audiosi \"La reunion is a last-new eve\" kabi bema'nilikka aylandi. Sababi va darsdagi yechim qaysi?",
      type: "single",
      options: [
        "Whisper ispan tilini bilmaydi — yechim: ispancha qismni kesib, faqat inglizcha audio yozish",
        "gTTS ispancha qismni noto'g'ri o'qigan — yechim: boshqa TTS bilan audioni qayta yaratish",
        "Model butun faylga bitta til tanlaydi — yechim: jimlik bo'yicha bo'laklab, tilni alohida aniqlash",
        "Audio juda qisqa — yechim: task=\"translate\" bilan hammasini bitta ingliz tiliga o'tkazish"
      ],
      answer: [2],
      explain: "Til ingliz deb tanlangach, ispancha qism ham ingliz tokenlari bilan dekodlanadi. Bo'laklab, har bir bo'lak uchun tilni alohida aniqlash bu muammoni chetlab o'tadi.",
      lesson: { title: "Muammolar va cheklovlar", href: "02-Challenges-and-Limitations.md" }
    },
    {
      q: "Klinika shifokor–bemor suhbatlarini transkripsiya qilmoqchi. Darsdagi maxfiylik qoidasiga ko'ra qaysi yo'l to'g'ri va nega?",
      type: "single",
      options: [
        "Mahalliy Whisper — audio biometrik ma'lumot, u esa 0 bayt yuboradi va bulutdan ~2× tez",
        "Google bulut API — u tezroq va audio matnga aylangach maxfiylik muammosi qolmaydi",
        "Istalgan yo'l — audio matndan ortiq hech qanday ma'lumot oshkor qilmaydi",
        "Bulut API, lekin audioni avval pre-emphasis bilan qayta ishlab, ovoz izini yo'qotish"
      ],
      answer: [0],
      explain: "Audio ovoz izi, jins, yosh, hissiy holat va sog'liq belgilarini ham oshkor qiladi. Tibbiy suhbat — mahalliy ishlov. O'lchovda mahalliy Whisper 2.89 s va 0 bayt, Google esa 6.24 s va 0.72 MB.",
      lesson: { title: "Muammolar va cheklovlar", href: "02-Challenges-and-Limitations.md" }
    },
    {
      q: "Darsdagi uch qatlamli tekshiruv funksiyasi berilgan. Quyidagi kod nima chiqaradi?",
      code: "def ishonchli_mi(matn, davomiylik_s):\n    w = [x.lower().strip(\".,!?;:\") for x in matn.split()]\n    if not w:\n        return False, \"bo'sh\"\n    if len(set(w)) / len(w) < 0.35:\n        return False, \"takrorlanish sikli\"\n    if len(w) / davomiylik_s > 4.0:\n        return False, \"nutq tezligi imkonsiz\"\n    if len(w) / davomiylik_s < 0.5:\n        return False, \"juda kam so'z\"\n    return True, \"ok\"\nprint(ishonchli_mi(\"Thank you for watching.\", 2.0))",
      type: "single",
      options: [
        "(False, 'takrorlanish sikli')",
        "(False, 'nutq tezligi imkonsiz')",
        "(True, 'ok')",
        "(False, \"juda kam so'z\")"
      ],
      answer: [2],
      explain: "4 ta so'z, hammasi noyob (ulush 1.0), tezlik 2 so'z/s — barcha chegaralardan o'tadi. Aynan shuning uchun bu detektor jim joyda paydo bo'ladigan \"Thank you for watching\" gallyutsinatsiyasini tutmaydi; buning uchun no_speech_prob va qora ro'yxat kerak.",
      lesson: { title: "Muammolar va cheklovlar", href: "02-Challenges-and-Limitations.md" }
    },
    {
      q: "Kurs sanagan beshta \"kelajak trendi\"dan qaysilari bugun oddiy noutbukda ishlashi o'lchab ko'rsatildi? (bir nechta javob)",
      type: "multi",
      options: [
        "Multimodal interfeyslar",
        "Edge computing (qurilmaning o'zida ishlov)",
        "Ovozdan stressni tanib shaxsiylashtirish",
        "Real vaqtda tarjima",
        "Sog'liqni saqlashda avtomatik tashxis"
      ],
      answer: [1, 3],
      explain: "Mahalliy Whisper bulutdan 2.16× tez va 0 bayt yuboradi; task=\"translate\" to'rtta tilda ~0.8 s da ishladi. Multimodal hali rivojlanmoqda, shaxsiylashtirish qisman, sog'liqni saqlash esa faqat ehtiyot bilan.",
      lesson: { title: "Nutqni tanishning kelajagi", href: "03-The-Future.md" }
    },
    {
      q: "y_ru — ruscha nutq yozuvi. Quyidagi kod qaysi tilda matn qaytaradi?",
      code: "tj = asr(y_ru, generate_kwargs={\"task\": \"translate\"})[\"text\"]\nprint(tj)",
      type: "single",
      options: [
        "Rus tilida — translate faqat tilni aniqlaydi",
        "Ingliz tilida — translate faqat inglizga tarjima qiladi",
        "Tizim tilida — language berilmasa shunday bo'ladi",
        "Hech qaysi — language berilmagani uchun xato chiqadi"
      ],
      answer: [1],
      explain: "Whisper task=\"translate\" har qanday tildan faqat inglizga tarjima qiladi; ruscha misol \"Hello, my name is Anna. I study machine learning.\" bo'ldi. Boshqa yo'nalishlar uchun NLLB yoki M2M100 kabi alohida tarjima modeli kerak.",
      lesson: { title: "Nutqni tanishning kelajagi", href: "03-The-Future.md" }
    },
    {
      q: "Shifokor diktovkasini bemor kartasiga yozuvchi tizim loyihalanmoqda. Darsdagi to'g'ri arxitekturaning eng muhim qismi qaysi?",
      type: "single",
      options: [
        "Eng katta Whisper modelini tanlash — shunda odam tekshiruvi kerak bo'lmaydi",
        "Faqat tayyor matnni saqlash, audioni esa maxfiylik uchun darhol o'chirish",
        "Pre-emphasis va spektral ayirish bilan audioni oldindan tozalash",
        "Avtomatik tekshiruvdan keyin odam majburiy tasdiqlaydi va asl audio saqlanadi"
      ],
      answer: [3],
      explain: "hypo-/hyper- yoki 50 mg/15 mg kabi xatolar va gallyutsinatsiya xavfli. Asl audio saqlansa har qanday xatoni tekshirish mumkin, faqat matn saqlansa xato abadiy qoladi.",
      lesson: { title: "Nutqni tanishning kelajagi", href: "03-The-Future.md" }
    },
    {
      q: "Ovozli multimodal yordamchi (ASR 0.8 s + LLM 1.5 s + TTS 1.0 s) yig'ildi. Uning asosiy texnik to'sig'i va yechimi nima?",
      type: "single",
      options: [
        "Jami ~3.3 s kechikish (odam pauzasi ~0.2 s) — yechim: bosqichlarni oqim (streaming) qilish",
        "LLM nutqni tushunmaydi — ASR ni olib tashlab, LLM ga to'g'ridan-to'g'ri audio berish kerak",
        "TTS sifati past — gTTS ning slow=True rejimini yoqib, ovozni tabiiyroq qilish kerak",
        "Xotira yetmaydi — uchala modelni ham bulutga ko'chirib, noutbukni bo'shatish kerak"
      ],
      answer: [0],
      explain: "3.3 soniya suhbat uchun juda uzoq va noqulay. Yechim — oqim: ASR va TTS ketma-ket emas, bir vaqtda ishlashi kerak.",
      lesson: { title: "Nutqni tanishning kelajagi", href: "03-The-Future.md" }
    },
    {
      q: "Kurs \"tizim ovozingizdan stressni tanib, tinchlantiruvchi takliflar berishi mumkin\" deydi. Darsdagi baho qanday?",
      type: "single",
      options: [
        "To'liq to'g'ri — bu bugun laboratoriyadan chiqqan, ishonchli ishlaydigan mahsulot",
        "Noto'g'ri — ovozdan hatto kim gapirayotganini ham ishonchli tanib bo'lmaydi",
        "Ehtiyot kerak — stress tashxisi ilmiy tasdiqlanmagan, kamsitish xavfi ham bor",
        "To'g'ri, lekin faqat bulut API orqali, mahalliy modellarda ishlamaydi"
      ],
      answer: [2],
      explain: "Diarizatsiya (kim gapiryapti) ishlaydi, hissiyot tanish laboratoriyada ~70%, stress yoki sog'liq tashxisi esa hali tadqiqot. Ish suhbati yoki sug'urtada qo'llash kamsitishga olib keladi.",
      lesson: { title: "Nutqni tanishning kelajagi", href: "03-The-Future.md" }
    }
  ]
};
