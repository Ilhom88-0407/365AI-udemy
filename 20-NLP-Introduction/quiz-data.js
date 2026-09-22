window.QUIZ = {
  id: "20",
  title: "NLP ga kirish",
  subtitle: "NLP nima, uning tarixi, kundalik hayotdagi qo'llanishlari va nazorat ostida/nazoratsiz yondashuvlar",
  next: { label: "Matnni oldindan qayta ishlash", href: "../21-Text-Preprocessing/README.md" },
  questions: [
    {
      q: "Kursga kirish darsiga ko'ra, NLP bo'limini boshlash uchun sizdan nima talab qilinadi?",
      type: "single",
      options: [
        "NLP bo'yicha oldingi tajriba va nltk kutubxonasini bilish",
        "Asosiy Python ko'nikmalari va mashinali o'rganish bilan biroz tanishlik",
        "Chuqur o'rganish va Transformer arxitekturasini yaxshi bilish",
        "Statistika bo'yicha oliy ma'lumot va Jupyter bilan ishlash tajribasi"
      ],
      answer: [1],
      explain: "Ma'ruzachi NLP bo'yicha oldingi bilim kerak emasligini aytadi: asosiy Python va ML bilan biroz tanishlik yetarli.",
      lesson: { title: "Kursga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "matn = \"nlp va nlp va ml\"\nsozlar = matn.split()\nch = {}\nfor s in sozlar:\n    ch[s] = ch.get(s, 0) + 1\nprint(len(sozlar), len(ch))",
      type: "single",
      options: ["3 5", "5 5", "5 3", "3 3"],
      answer: [2],
      explain: "split() 5 ta so'z beradi, lug'atda esa faqat 3 ta turli kalit bor: nlp, va, ml. ch.get(s, 0) kalit yo'q bo'lsa 0 qaytaradi.",
      lesson: { title: "Kursga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Darsdagi ta'rifga ko'ra, NLP kompyuterlarga inson tili bilan qaysi uchta ishni qilish imkonini beradi?",
      type: "single",
      options: [
        "Yozish, o'qish va ovozga aylantirish",
        "Saqlash, tartiblash va tarjima qilish",
        "Tozalash, tokenlash va sanash",
        "Tushunish, talqin qilish va yaratish"
      ],
      answer: [3],
      explain: "NLP — AI ning sohasi bo'lib, kompyuterlarga inson tili ma'lumotlarini tushunish, talqin qilish va yaratish imkonini beradi.",
      lesson: { title: "NLP ga kirish", href: "02-Introduction-to-NLP.md" }
    },
    {
      q: "1950-yillardagi dastlabki NLP tizimlari qanday ishlagan va ularning asosiy cheklovi nima edi?",
      type: "single",
      options: [
        "Grammatik qoidalarga asoslangan, lekin kontekstni tushunmagan",
        "Chuqur o'rganishga asoslangan, lekin katta hisoblash quvvati talab qilgan",
        "Statistik modellarga asoslangan, lekin juda ko'p ma'lumot kerak bo'lgan",
        "Neyron tarmoqlarga asoslangan, lekin faqat ingliz tilida ishlagan"
      ],
      answer: [0],
      explain: "Dastlabki metodlar tilning grammatik qoidalariga tayangan. Masalan, qoida \"bank\" moliya muassasasimi yoki daryo qirg'og'imi, ajrata olmaydi — buning uchun kontekst kerak.",
      lesson: { title: "NLP ga kirish", href: "02-Introduction-to-NLP.md" }
    },
    {
      q: "Bu qoidaga asoslangan funksiya nimani chiqaradi?",
      code: "def baho(matn):\n    ball = 0\n    for soz in matn.lower().split():\n        if soz in [\"yaxshi\", \"ajoyib\"]:\n            ball += 1\n        if soz in [\"yomon\", \"past\"]:\n            ball -= 1\n    return ball\n\nprint(baho(\"Mahsulot yaxshi emas\"))",
      type: "single",
      options: ["-1", "0", "1", "2"],
      answer: [2],
      explain: "Funksiya faqat \"yaxshi\" so'zini ko'radi va ballga +1 qo'shadi; \"emas\" ma'noni teskarisiga o'girishini u bilmaydi. Shuning uchun salbiy sharh ijobiy baholanadi.",
      lesson: { title: "NLP ga kirish", href: "02-Introduction-to-NLP.md" }
    },
    {
      q: "Darsga ko'ra, ChatGPT kabi tizimlarning paydo bo'lishiga nimalar olib keldi? (bir nechta javob)",
      type: "multi",
      options: [
        "Texnologiyadagi juda katta yutuqlar",
        "Grammatik qoidalar ro'yxatining kengaytirilishi",
        "Modellarni o'rgatish uchun katta ma'lumot to'plamlarining mavjudligi",
        "Qidiruv tizimlarida kalit so'zlardan voz kechilishi"
      ],
      answer: [0, 2],
      explain: "Ma'ruzachi yaqindagi texnologik yutuqlar va katta ma'lumot to'plamlari ChatGPT kabi tizimlarga olib kelganini aytadi. Qoidalarni ko'paytirish esa aynan eskirgan yondashuv.",
      lesson: { title: "NLP ga kirish", href: "02-Introduction-to-NLP.md" }
    },
    {
      q: "Foydalanuvchi \"toshkentda eng yaqin dorixona qayerda\" deb qidirdi. Qidiruv tizimi bu so'rovga nima uchun maqola emas, xarita qaytaradi?",
      type: "single",
      options: [
        "Chunki so'rovda \"toshkent\" so'zi bor, shahar nomi har doim xaritaga olib boradi",
        "Chunki \"qayerda\" so'zidan foydalanuvchining niyati joy topish ekanini tushunadi",
        "Chunki dorixonalar haqida maqolalar bazada umuman mavjud emas",
        "Chunki qidiruv tizimi so'rovdagi so'zlar sonini sanab, qisqa so'rovga xarita beradi"
      ],
      answer: [1],
      explain: "Qidiruv tizimi kalit so'zlarni ajratadi, keyin niyatni aniqlaydi. \"qayerda\" joy topish niyatini bildiradi; \"dorixona qanday ishlaydi\" deb so'ralsa, maqola qaytariladi.",
      lesson: { title: "NLP kundalik hayotda", href: "03-NLP-in-Everyday-Life.md" }
    },
    {
      q: "Pochta hisobidagi spam filtri, darsga ko'ra, qanday algoritmlarga tayanadi?",
      type: "single",
      options: [
        "Klasterlash algoritmlariga — xatlarni yorliqsiz guruhlarga bo'ladi",
        "Grammatik qoidalarga — xatdagi imlo xatolarini sanaydi",
        "Tasniflash algoritmlariga — spam va qonuniy xatlarni farqlovchi naqshlarni topadi",
        "Tarjima algoritmlariga — xatni boshqa tilga o'girib tekshiradi"
      ],
      answer: [2],
      explain: "Spam filtri tasniflash algoritmlaridan foydalanadi va yorliqlangan xatlardan naqsh o'rganadi, ya'ni bu nazorat ostida o'rganish.",
      lesson: { title: "NLP kundalik hayotda", href: "03-NLP-in-Everyday-Life.md" }
    },
    {
      q: "Bu soddalashtirilgan spam filtri nimani chiqaradi?",
      code: "spam = {\"bepul\": 2, \"bosing\": 2, \"bugun\": 1}\nnormal = {\"hisobot\": 1, \"savol\": 1}\n\nmatn = \"Ob-havo yaxshi bugun\"\ns, n = 0, 0\nfor soz in matn.lower().split():\n    s += spam.get(soz, 0)\n    n += normal.get(soz, 0)\nprint(\"SPAM\" if s > n else \"NORMAL\")",
      type: "single",
      options: ["NORMAL", "SPAM", "KeyError xatosi", "Hech narsa chiqmaydi"],
      answer: [1],
      explain: "\"bugun\" so'zi tasodifan faqat spam lug'atida bor, shuning uchun s = 1, n = 0 bo'lib, oddiy xat SPAM deb belgilanadi. .get() tufayli yangi so'zlar xato bermaydi.",
      lesson: { title: "NLP kundalik hayotda", href: "03-NLP-in-Everyday-Life.md" }
    },
    {
      q: "Mini spam filtri \"Ob-havo yaxshi bugun\" xatini SPAM deb xato topdi. Darsga ko'ra, bu muammoning asosiy sababi nima?",
      type: "single",
      options: [
        "Model atigi 6 ta xatda o'rgatilgan — yetarli ma'lumot yo'q",
        "Model Naive Bayes o'rniga klasterlashdan foydalangan",
        "Xat matni kichik harfga o'tkazilmagan",
        "Spam lug'atida so'zlar juda ko'p bo'lib ketgan"
      ],
      answer: [0],
      explain: "Kam ma'lumotda tasodifiy so'z (bugun) spam belgisiga aylanib qoladi. Millionlab xatda o'rgatilganda bu so'z ikkala toifada ham uchraydi va neytral bo'ladi.",
      lesson: { title: "NLP kundalik hayotda", href: "03-NLP-in-Everyday-Life.md" }
    },
    {
      q: "Spam filtrida muhim oddiy xatni SPAM deb bloklash (false positive) spam xatni o'tkazib yuborishdan yomonroq xato hisoblanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Spam o'tib ketsa, foydalanuvchi uni o'chiradi; normal xat bloklansa, muhim xat yo'qoladi. Shuning uchun filtrlar ehtiyotkor bo'ladi.",
      lesson: { title: "NLP kundalik hayotda", href: "03-NLP-in-Everyday-Life.md" }
    },
    {
      q: "Sizda 50 000 ta mijoz shikoyati bor, lekin birortasi yorliqlanmagan. Rahbar \"shikoyatlarda qanday mavzular bor?\" deb so'radi. Qaysi yondashuv mos?",
      type: "single",
      options: [
        "Nazorat ostida — shikoyatlarga ball bashorat qiluvchi model o'rgatish",
        "Qoidaga asoslangan — har bir mavzu uchun grammatik qoida yozish",
        "Nazorat ostida — avval barcha 50 000 tasini qo'lda yorliqlash",
        "Nazoratsiz — yorliqsiz matnlarni o'xshashligi bo'yicha guruhlash"
      ],
      answer: [3],
      explain: "Yorliq yo'q va savol \"qanday naqshlar bor?\" turida — bu nazoratsiz o'rganish, masalan klasterlash yoki mavzu modellashtirish holati.",
      lesson: { title: "Nazorat ostida va nazoratsiz NLP", href: "04-Supervised-vs-Unsupervised.md" }
    },
    {
      q: "Nazorat ostida va nazoratsiz o'rganish haqidagi qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Nazorat ostida o'rganishda kirish matni bilan birga to'g'ri chiqish (yorliq) beriladi",
        "Nazoratsiz o'rganish guruhlarni topadi, lekin ularga nomni odam beradi",
        "Nazoratsiz natijani baholash nazorat ostidagidan osonroq",
        "Nazorat ostida yondashuvda yorliqlash eng qimmat qism hisoblanadi",
        "Klasterlash nazorat ostida o'rganishning misoli"
      ],
      answer: [0, 1, 3],
      explain: "Nazorat ostida kirish–chiqish juftliklari kerak va yorliqlash qimmat; nazoratsiz esa guruhlarni topadi, nomlarini odam beradi. Nazoratsizni baholash qiyin, klasterlash esa nazoratsiz texnika.",
      lesson: { title: "Nazorat ostida va nazoratsiz NLP", href: "04-Supervised-vs-Unsupervised.md" }
    },
    {
      q: "Model so'zlarning o'rtacha ballini o'rgandi: \"yomon\" = 2.0, \"xizmat\" = 10.0. \"Yomon xizmat\" uchun 6.0 bashorat qilindi. Nega \"xizmat\" 10.0 ball olgan?",
      type: "single",
      options: [
        "Chunki \"xizmat\" ot so'z turkumi, otlar doim yuqori ball oladi",
        "Chunki u faqat bitta ijobiy sharhda uchragan — ma'lumot kam va xilma-xil emas",
        "Chunki model ballarni o'rtacha emas, eng katta qiymat bo'yicha hisoblaydi",
        "Chunki \"xizmat\" so'zi ijobiy so'zlar ro'yxatiga qo'lda kiritilgan"
      ],
      answer: [1],
      explain: "\"xizmat\" faqat \"Ajoyib xizmat\" (10 ball) sharhida bo'lgani uchun model uni ijobiy belgi deb o'rgandi. Nazorat ostida o'rganish ko'p va xilma-xil yorliqli ma'lumot talab qiladi.",
      lesson: { title: "Nazorat ostida va nazoratsiz NLP", href: "04-Supervised-vs-Unsupervised.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "a = \"Narxi juda qimmat ekan\"\nb = \"Bunday pulga arzimaydi qimmat\"\nA = set(a.lower().split())\nB = set(b.lower().split())\nprint(len(A & B))",
      type: "single",
      options: ["0", "1", "4", "8"],
      answer: [1],
      explain: "& ikki to'plamning kesishmasini beradi; ikkala matnda faqat \"qimmat\" so'zi umumiy, shuning uchun natija 1. Darsdagi sodda klasterlash aynan shu umumiy so'zlar soniga tayanadi.",
      lesson: { title: "Nazorat ostida va nazoratsiz NLP", href: "04-Supervised-vs-Unsupervised.md" }
    }
  ]
};
