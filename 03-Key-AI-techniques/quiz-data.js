window.QUIZ = {
  id: "03",
  title: "03-Modul · AI ning asosiy texnikalari",
  subtitle: "Machine learning, uchta o'rganish turi va neyron tarmoqlar qanday ishlashi",
  next: { label: "04-Modul · AI ning muhim tarmoqlari", href: "../04-Important-AI-branches/README.md" },
  questions: [
    {
      q: "Ko'chmas mulk agenti uy narxini aytuvchi ilova so'radi. Data scientist birinchi navbatda nimani aniqlashtirdi va nega?",
      type: "single",
      options: [
        "Qaysi algoritm eng aniq ishlashini — chunki loyiha taqdiri model tanlashga bog'liq",
        "O'tmish tranzaksiyalar ro'yxati yetarlicha kattami — chunki ma'lumotsiz model qurib bo'lmaydi",
        "Ilovadan nechta mijoz foydalanishini — chunki biznes foydasi aynan shunga bog'liq",
        "Uylar qaysi mahallada joylashganini — chunki narxni faqat joylashuv belgilaydi"
      ],
      answer: [1],
      explain: "Data scientist avval katta o'tmish tranzaksiyalar bazasi bormi, deb so'radi: ma'lumotsiz model qurib bo'lmaydi, algoritm tanlash esa keyingi masala.",
      lesson: { title: "Machine Learning", href: "01-Machine-learning.md" }
    },
    {
      q: "A jamoa kam ma'lumotda murakkab model quradi, B jamoa ko'p va yaxshi ma'lumotda oddiy model quradi. Darsga ko'ra qaysi biri yaxshiroq ishlashi mumkin?",
      type: "single",
      options: [
        "A jamoa, chunki murakkab model kam ma'lumotda ham ko'proq naqsh topadi",
        "Ikkalasi teng, chunki natija faqat tanlangan algoritmning o'ziga bog'liq",
        "B jamoa, chunki ko'p yaxshi ma'lumot model murakkabligidan muhimroq",
        "A jamoa, chunki kam ma'lumot modelni tezroq va aniqroq o'rgatadi"
      ],
      answer: [2],
      explain: "Yaxshi o'qitilgan o'rtacha o'quvchi tayyorgarliksiz iqtidorlidan ustun kelgani kabi, ko'p yaxshi ma'lumotli oddiy model kam ma'lumotli murakkab modeldan yaxshiroq ishlashi mumkin.",
      lesson: { title: "Machine Learning", href: "01-Machine-learning.md" }
    },
    {
      q: "O'quvchi–ustoz analogiyasida qaysi moslashtirishlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "O'quvchi — ML modeli",
        "Ustoz — data scientist",
        "Yakuniy imtihon — training data",
        "Darslik va mashqlar — training data",
        "Ustoz — ML algoritmi"
      ],
      answer: [0, 1, 3],
      explain: "O'quvchi — model, ustoz — data scientist, o'quv materiali — training data. Yakuniy imtihon esa training data emas, balki model hech qachon ko'rmagan yangi ma'lumotga to'g'ri keladi.",
      lesson: { title: "Machine Learning", href: "01-Machine-learning.md" }
    },
    {
      q: "Training data'dagi eng katta uy 130 m². Model 200 m² uy uchun ham narx aytdi. Nega bu bashoratga ehtiyot bo'lish kerak?",
      type: "single",
      options: [
        "Model 200 m² uylarni training data'da ko'rgani uchun u haddan tashqari ishonchli",
        "Model katta uylar uchun alohida qoidani noto'g'ri yozib olgani uchun",
        "O'rtacha xato 0.9% dan oshib ketgani uchun bashorat baribir yaroqsiz",
        "Model bunday uylar haqida hech narsa bilmaydi, shunchaki naqshni davom ettiradi"
      ],
      answer: [3],
      explain: "Bu extrapolyatsiya: training data chegarasidan tashqarida model faqat topgan naqshini davom ettiradi, real hayotda esa katta uylar narxi boshqa qonuniyatga bo'ysunishi mumkin.",
      lesson: { title: "Machine Learning", href: "01-Machine-learning.md" }
    },
    {
      q: "Quyidagi vazifalardan qaysilari supervised learning bilan yechiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Emaildagi spamni aniqlash",
        "Ertangi valyuta kursini bashorat qilish",
        "Mijozlarni o'xshash guruhlarga bo'lish",
        "O'yin botini g'alaba qozonishga o'rgatish",
        "Rentgen suratida shishni aniqlash"
      ],
      answer: [0, 1, 4],
      explain: "Spam va shish aniqlash — classification, valyuta kursi — regression: hammasida to'g'ri javob ma'lum. Mijozlarni guruhlash — unsupervised (clustering), o'yin boti esa reinforcement learning.",
      lesson: { title: "Supervised, Unsupervised va Reinforcement learning", href: "02-Supervised-Unsupervised-Reinforcement.md" }
    },
    {
      q: "Model o'tmish ma'lumotlari asosida kelasi oydagi savdo hajmini aniq son sifatida bashorat qiladi. Bu qanday masala?",
      type: "single",
      options: [
        "Supervised — regression, chunki chiqish son",
        "Supervised — classification, chunki chiqish toifa",
        "Unsupervised — clustering, chunki chiqish guruh",
        "Reinforcement, chunki chiqish harakat strategiyasi"
      ],
      answer: [0],
      explain: "Natijalar ma'lum bo'lgan ma'lumotda o'rganib, son bashorat qilish — supervised learning'ning regression masalasi. Classification esa \"Bu nima?\" savoliga toifa bilan javob beradi.",
      lesson: { title: "Supervised, Unsupervised va Reinforcement learning", href: "02-Supervised-Unsupervised-Reinforcement.md" }
    },
    {
      q: "Unsupervised model 10 000 ta hayvon rasmini ko'rib chiqib guruhlagach, har bir guruhga \"itlar\", \"mushuklar\" kabi nom qo'yib beradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Unsupervised model rasmlar mazmunini aytmaydi — u faqat o'xshash xususiyatli rasmlarni guruhlaydi. Guruhga nom qo'yish baribir odamning ishi.",
      lesson: { title: "Supervised, Unsupervised va Reinforcement learning", href: "02-Supervised-Unsupervised-Reinforcement.md" }
    },
    {
      q: "Netflix tavsiya tizimi reinforcement learning bilan ishlaganda model asosan nimadan o'rganadi?",
      type: "single",
      options: [
        "Oldindan belgilangan \"yoqadi / yoqmaydi\" datasetidagi to'g'ri javoblardan",
        "Shoularni o'xshash xususiyatlar bo'yicha nomsiz guruhlarga ajratishdan",
        "Foydalanuvchi ro'yxatdan o'tishda to'ldirgan so'rovnoma javoblaridan",
        "Foydalanuvchining tavsiyalarga reaksiyasidan: ko'rish yoki tashlab ketish"
      ],
      answer: [3],
      explain: "RL da belgilangan ma'lumot berilmaydi: model muloqot orqali fikr-mulohaza to'playdi — to'liq ko'rish ijobiy, shouni tashlab ketish salbiy signal bo'ladi.",
      lesson: { title: "Supervised, Unsupervised va Reinforcement learning", href: "02-Supervised-Unsupervised-Reinforcement.md" }
    },
    {
      q: "Netflix simulyatsiyasida exploration darajasi 0.0 qilinsa (model doim hozircha ma'lum eng yaxshi janrni beradi), qanday xavf paydo bo'ladi?",
      type: "single",
      options: [
        "Model faqat tasodifiy tavsiya berib, foydalanuvchini yo'qotadi",
        "Model belgilangan ma'lumotsiz umuman ishlay olmay qoladi",
        "Model yangi, yanada yaxshi janrni hech qachon topmasligi mumkin",
        "Model janrlarni nomsiz guruhlarga ajrata boshlaydi"
      ],
      answer: [2],
      explain: "Doim eng yaxshisini bergan model yangi yaxshi variantni hech qachon sinamaydi. Foydalanuvchini yo'qotish esa aksincha — doim tasodifiy tavsiya berishning (1.0) xavfi.",
      lesson: { title: "Supervised, Unsupervised va Reinforcement learning", href: "02-Supervised-Unsupervised-Reinforcement.md" }
    },
    {
      q: "Nima uchun MNIST raqamlarini tanuvchi tarmoqning input layer'ida odatda 784 ta node bo'ladi?",
      type: "single",
      options: [
        "MNIST'da 784 xil qo'lyozma uslubi borligi uchun",
        "Tasvir 28×28 piksel va har bir piksel bitta input node",
        "Har bir hidden layer'da 784 ta neyron bo'lishi shartligi uchun",
        "784 tarmoqdagi qatlamlar soni, ya'ni depth bo'lgani uchun"
      ],
      answer: [1],
      explain: "28 × 28 = 784 piksel, har bir piksel bitta input node vazifasini bajaradi. 784 — tarmoqning width'i, depth esa qatlamlar soni.",
      lesson: { title: "Deep Learning", href: "03-Deep-learning.md" }
    },
    {
      q: "MNIST tarmog'idagi input node'ning activation qiymati 0 ga teng. Bu nimani anglatadi?",
      type: "single",
      options: [
        "Shu piksel oq rangda",
        "Shu piksel eng qorong'i rangda",
        "Bu node tarmoqdan olib tashlangan",
        "Bu node'ning weights'i hali o'rganilmagan"
      ],
      answer: [0],
      explain: "Activation — tugundagi son: 0 oqni bildiradi, noldan katta qiymat esa boshqa rangni, son qancha katta bo'lsa, shuncha qorong'i.",
      lesson: { title: "Deep Learning", href: "03-Deep-learning.md" }
    },
    {
      q: "Tarmoq input layer, 3 ta hidden layer va output layer'dan iborat. Uning depth'i nechaga teng?",
      type: "single",
      options: ["3", "4", "5", "784"],
      answer: [2],
      explain: "Depth — qatlamlar soni: 1 input + 3 hidden + 1 output = 5. 784 esa MNIST misolidagi width (qatordagi tugunlar soni).",
      lesson: { title: "Deep Learning", href: "03-Deep-learning.md" }
    },
    {
      q: "Deep learning kontekstida \"model o'rganadi\" iborasi aniq nimani anglatadi?",
      type: "single",
      options: [
        "Dasturchi har bir neyron uchun qoidani qo'lda yozib chiqishini",
        "Tarmoqqa har bir takrorlashda yangi qatlam qo'shib borilishini",
        "Model training data'dagi har bir rasmni to'liq yodlab olishini",
        "Minglab takrorlash orqali optimal weights va biases topilishini"
      ],
      answer: [3],
      explain: "Darsdagi ta'rif: o'rganish — aniq masalani yechish uchun optimal weights va biases ni aniqlaydigan tizim loyihalash, bu esa minglab takrorlashni talab qiladi.",
      lesson: { title: "Deep Learning", href: "03-Deep-learning.md" }
    },
    {
      q: "ANN haqidagi qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Biologik neyron tarmoqlardan ilhomlangan, lekin ancha boshqacha ishlaydi",
        "Har bir qatlam tugunlari keyingi qatlamning har bir tuguniga bog'langan",
        "Ko'proq qatlam qo'shish har doim yaxshiroq natija beradi",
        "Qatlam qo'shish o'rganish sig'imini oshiradi, lekin ehtiyotkor boshqaruv talab qiladi",
        "ANN — inson miyasining aniq raqamli nusxasi"
      ],
      answer: [0, 1, 3],
      explain: "ANN miyadan faqat ilhomlangan, uning nusxasi emas. Qatlamlar o'rganish sig'imini oshiradi, ammo ko'proq qatlam har doim ham yaxshiroq degani emas — bu muhandislik qarori.",
      lesson: { title: "Deep Learning", href: "03-Deep-learning.md" }
    },
    {
      q: "3 raqamini tanishga o'rgangan tarmoqda 2-yashirin qatlam odatda nimani ajratadi?",
      type: "single",
      options: [
        "Alohida piksellarning yorqinlik darajasini",
        "Oddiy chekka va egri chiziqlarni",
        "Halqa va kesishmalar kabi murakkabroq shakllarni",
        "Raqam 3 mi yoki yo'qmi degan yakuniy qarorni"
      ],
      answer: [2],
      explain: "1-yashirin qatlam chekka va egri chiziqlarni, 2-si ulardan halqa va kesishmalarni, 3-si umumiy shaklni o'rganadi; yakuniy qarorni esa output layer chiqaradi.",
      lesson: { title: "Deep Learning", href: "03-Deep-learning.md" }
    }
  ]
};
