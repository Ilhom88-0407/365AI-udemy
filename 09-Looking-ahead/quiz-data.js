window.QUIZ = {
  id: "09",
  title: "Kelajakka nazar",
  subtitle: "AI etikasi, moral hazard, EU AI Act va AI o'sishini belgilovchi uchta resurs",
  next: { label: "Nima uchun Python", href: "../10-Why-Python/README.md" },
  questions: [
    {
      q: "Darsdagi ta'rifga ko'ra AI etikasi nima?",
      type: "single",
      options: [
        "AI tizimlarining xatolarini aniqlaydigan texnik standartlar va testlar to'plami",
        "AI foydasini umumiy manfaat uchun maksimallashtirish va zararini minimallashtirish uchun moral tamoyillar",
        "AI ishlab chiqaruvchi kompaniyalarning foydasini himoya qiluvchi huquqiy qoidalar",
        "Faqat AI qurollarini taqiqlashga qaratilgan xalqaro kelishuvlar majmuasi"
      ],
      answer: [1],
      explain: "AI etikasi — AI ning umumiy manfaat uchun foydasini maksimallashtirish va rivojlanishidan kelib chiqadigan potensial zararni minimallashtirish uchun moral tamoyillar to'plami.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "Avtonom avtomobil piyodani urib yubordi. Dars nima uchun bunday holatda javobgarlik masalasini AI etikasining hayotiy masalasi deb biladi?",
      type: "single",
      options: [
        "Chunki AI modellari hali ham insonlar tomonidan loyihalanadi va o'qitiladi, lekin kim javobgarligi hali aniq emas",
        "Chunki AI to'liq mustaqil qaror qiladi va javobgarlik faqat algoritmning o'ziga tushadi",
        "Chunki qonunlarga ko'ra bunday holatda har doim faqat haydovchi javob beradi",
        "Chunki avtonom avtomobillar hech qachon sinovdan o'tkazilmaydi"
      ],
      answer: [0],
      explain: "Dars AI ni inson nazoratidan tashqaridagi narsa deb o'ylashni xato deydi: modellarni hali ham odamlar quradi. Shuning uchun inson mas'uliyatini va AI harakatlari uchun kim javobgarligini belgilash — hali javobi yo'q savol.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "Bir nechta davlat qobiliyatliroq AI ni birinchi bo'lib yaratish uchun poyga qilmoqda: foydani ular oladi, xavf esa hammaga taqsimlanadi. Bu qaysi tushunchaning klassik namunasi?",
      type: "single",
      options: [
        "Model collapse",
        "Texno-diktatura",
        "Feedback loop",
        "Moral hazard"
      ],
      answer: [3],
      explain: "Moral hazard — bir nechtasi texnologiya foydasini olib, potensial xavf va zarar ko'pchilikka taqsimlanadigan holat. U chegaralarni surish rag'batini oshiradi.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "AQSh Oq uyi tahliliga ko'ra qaysi ishchilar AI ga ayniqsa zaif va bu nimaga olib kelishi mumkin?",
      type: "single",
      options: [
        "Yuqori malakali dasturchilar — bu IT sohasida ish haqini keskin tushiradi",
        "Faqat qishloq xo'jaligi ishchilari — bu oziq-ovqat narxlarini oshiradi",
        "Kam ma'lumotli va past daromadli ishchilar — bu tengsizlikni kuchaytirish xavfini oshiradi",
        "Davlat xizmatchilari — bu davlat boshqaruvini falaj qiladi"
      ],
      answer: [2],
      explain: "Hisobot kam ma'lumotli va past daromadli ishchilar AI ga ayniqsa zaif ekanini aniqladi, bu esa texnologiya tengsizlikni kuchaytirishi xavfini oshiradi. Umuman AQSh ishchilarining taxminan 10% i eng jiddiy xavf ostida.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "Darsga ko'ra quyidagilardan qaysilari noetik yoki IP o'g'irligi sifatida ko'rilishi mumkin? (bir nechta javob)",
      type: "multi",
      options: [
        "Kerakli foydalanuvchi ruxsatisiz shaxsiy ma'lumot bilan model o'qitish",
        "Sayt siyosatiga zid ravishda web-scraped ma'lumot bilan o'qitish",
        "Litsenziya shartnomasi asosida olingan ma'lumot bilan o'qitish",
        "Modelni bias va diskriminatsiyadan himoya qilishga investitsiya qilish"
      ],
      answer: [0, 1],
      explain: "Ruxsatsiz shaxsiy ma'lumot va sayt siyosatiga zid scraping qilingan ma'lumot bilan o'qitish noetik va IP o'g'irligi sifatida ko'rilishi mumkin. Litsenziyalangan ma'lumot va bias ga qarshi investitsiya — aksincha, mas'uliyatli yondashuv.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "Papa G7 sammitida AI ni tartibga solishni yoqlab chiqdi. Darsga ko'ra uning e'tiborini nima tortgan edi?",
      type: "single",
      options: [
        "AI tufayli Italiyada ishsizlik keskin oshgani haqidagi hisobot",
        "Uning o'zi deepfake orqali Balenciaga palto kiygan holda yolg'on tasvirlangani",
        "Vatikan kompyuter tizimlariga AI yordamida masofadan hujum qilingani",
        "Cherkov kitoblaridan ruxsatsiz LLM o'qitilgani haqidagi sud da'vosi"
      ],
      answer: [1],
      explain: "Papa gen AI deepfake orqali Balenciaga palto kiygan holda yolg'on tasvirlangan birinchi global shaxslardan biri edi. U AI yangi erkinliklar bilan birga texno-diktatura xavfini ham beradi, dedi.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "EU AI Act haqida qaysi fikr darsga mos keladi?",
      type: "single",
      options: [
        "U AI ni tartibga solishning birinchi global ramkasi bo'lib, fuqarolar, bizneslar va davlat idoralarini himoya qilishni maqsad qiladi",
        "U barcha davlatlar uchun majburiy bo'lgan yagona xalqaro AI boshqaruvi ramkasidir",
        "U AI ishlab chiquvchilardan hech qanday qo'shimcha xarajat talab qilmaydi",
        "U faqat AI qurollarini taqiqlaydi va boshqa sohalarga tegmaydi"
      ],
      answer: [0],
      explain: "EU AI Act — birinchi global tartibga solish ramkasi, AI ni xavfsizroq va shaffofroq qilishni maqsad qiladi. Dastlab u qo'shimcha xarajat talab qiladi, milliy chegaralardan oshib o'tadigan yagona ramka esa hali faqat umid.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "To'g'rimi: darsga ko'ra iloji boricha ko'proq ma'lumotdan foydalanmagan ishlab chiquvchilar ehtimol kamroq mukammal model yaratadi, shuning uchun ma'lumot yig'ishda etik ziddiyat paydo bo'ladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Dars buni nozik ziddiyat deb ataydi: ko'proq ma'lumot ishlatish tabiiy va modelni yaxshilaydi, lekin ruxsatsiz shaxsiy ma'lumot yoki siyosatga zid scraping noetik bo'lishi mumkin.",
      lesson: { title: "AI etikasi", href: "01-AI-ethics.md" }
    },
    {
      q: "Bloomberg generativ AI bozorini 2032-yilga $1.3 trillion, PwC esa 2030-yilga $15.7 trillion deb bashorat qildi. Ma'ruzachi bundan qanday xulosa chiqaradi?",
      type: "single",
      options: [
        "PwC prognozi to'g'ri, chunki u yangiroq va chuqurroq tahlilga asoslangan",
        "Bloomberg prognozi to'g'ri, chunki u AQSh YaIM iga yaqinroq",
        "Ikki prognoz ham noto'g'ri, chunki AI bozori tez orada qisqaradi",
        "Qaysi biri to'g'riligini bilmaymiz, lekin sektor misli ko'rilmagan o'sishni boshdan kechiradi"
      ],
      answer: [3],
      explain: "Ma'ruzachi halol tan oladi: prognozlar orasida ulkan tafovut bor va qaysi biri to'g'ri chiqishini bilmaymiz. Aniq ma'lum narsa — AI sektori misli ko'rilmagan o'sishni boshdan kechiradi.",
      lesson: { title: "AI ning kelajagi", href: "02-Future-of-AI.md" }
    },
    {
      q: "Darsga ko'ra AI o'sish sur'ati bog'liq bo'lgan uchta muhim resurs qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Elektr energiyasi",
        "Malakali AI strategistlar",
        "Ma'lumot",
        "Hisoblash quvvati (AI chiplar)",
        "Davlat subsidiyalari"
      ],
      answer: [0, 2, 3],
      explain: "AI modellariga kerak bo'lgan uchta muhim resurs — elektr energiyasi, ma'lumot va hisoblash quvvati. Strategistlar va subsidiyalar bu ro'yxatda yo'q.",
      lesson: { title: "AI ning kelajagi", href: "02-Future-of-AI.md" }
    },
    {
      q: "Internetdagi AI yaratgan kontent yangi modellarni o'qitishda ishlatilsa, darsga ko'ra qaysi xavf yuzaga kelmaydi?",
      type: "single",
      options: [
        "Feedback loop lar paydo bo'lishi",
        "Model aniqligining pasayishi",
        "Chip taqchilligining butunlay yo'qolishi",
        "Mavjud bias larning kuchayishi"
      ],
      answer: [2],
      explain: "AI kontenti bilan o'qitish feedback loop yaratishi, aniqlikni pasaytirishi va bias larni kuchaytirishi mumkin. Chip taqchilligi esa alohida resurs muammosi va bunga bog'liq emas.",
      lesson: { title: "AI ning kelajagi", href: "02-Future-of-AI.md" }
    },
    {
      q: "Darsda ma'lumot muammosi bo'yicha keltirilgan ehtimoliy stsenariylardan biri qaysi?",
      type: "single",
      options: [
        "LLM ishlab chiqaruvchilar foydalanuvchilarga shaxsiy ma'lumotlaridan foydalangani uchun pul to'lashi",
        "Barcha AI kompaniyalari ma'lumot yig'ishni butunlay to'xtatib, faqat sintetik ma'lumot ishlatishi",
        "Ijtimoiy tarmoqlar o'z ma'lumotlarini hamma uchun bepul va cheklovsiz ochishi",
        "Hukumatlar barcha foundation modellarni davlat mulkiga aylantirishi"
      ],
      answer: [0],
      explain: "Uchta stsenariy: ko'proq litsenziya shartnomalari, ba'zi hukumatlar shaxsiy ma'lumot bilan o'qitishni taqiqlashi va tashkilotlar foydalanuvchilarga ma'lumoti uchun pul to'lashi.",
      lesson: { title: "AI ning kelajagi", href: "02-Future-of-AI.md" }
    },
    {
      q: "Nima uchun dars AI uchun elektr talabi keskin oshishini kutadi?",
      type: "single",
      options: [
        "Chunki yangi AI chiplar eski chiplarga qaraganda doim ko'proq energiya iste'mol qiladi",
        "Chunki odamlar AI uchun yangi qo'llanishlar topmoqda va AI global miqyosda qabul qilinmoqda",
        "Chunki EU AI Act kompaniyalarni ko'proq server qurishga majbur qiladi",
        "Chunki AI kontenti ko'payishi sabab modellarni har kuni qayta o'qitish kerak bo'ladi"
      ],
      answer: [1],
      explain: "Katta modellar sezilarli energiya talab qiladi, va yangi qo'llanishlar topilib, AI global qabul qilingani sari umumiy foydalanish, demak elektr talabi ham keskin oshadi.",
      lesson: { title: "AI ning kelajagi", href: "02-Future-of-AI.md" }
    },
    {
      q: "Darsga ko'ra 2023–2024-yillarda Nvidia qiymati nima uchun keskin oshdi va bu vaziyat nega o'zgarishi mumkin?",
      type: "single",
      options: [
        "Nvidia o'z LLM ini chiqargani uchun; raqobatchilar undan yaxshiroq LLM yaratmoqda",
        "Nvidia narxlarni tushirgani uchun; endi narxlar yana ko'tarilmoqda",
        "Hukumatlar Nvidia ni subsidiya qilgani uchun; subsidiyalar tugashi kutilmoqda",
        "ChatGPT shov-shuvi chiplarga talabni oshirgani uchun; ulkan foyda boshqa ishlab chiqaruvchilarni jalb qilmoqda"
      ],
      answer: [3],
      explain: "Nvidia ChatGPT yaratgan AI shov-shuvi tufayli yarimo'tkazgichlarga o'sgan talabdan foyda ko'rish uchun eng yaxshi holatda edi. Sifatli chiplarda taqchillik bor, lekin Nvidia foydasi boshqa ishlab chiqaruvchilar e'tiborini tortdi.",
      lesson: { title: "AI ning kelajagi", href: "02-Future-of-AI.md" }
    },
    {
      q: "Dars AI sanoatidagi asosiy ochiq savol sifatida nimani ko'rsatadi?",
      type: "single",
      options: [
        "AI chiplar narxi qachon kompyuter protsessorlari darajasiga tushishi",
        "EU AI Act boshqa qit'alarda ham qabul qilinishi",
        "Open source modellar closed source bilan raqobatbardosh bo'ladimi yoki big tech hukmronligi davom etadimi",
        "Generativ AI bozori qachon AQSh YaIM idan oshib ketishi"
      ],
      answer: [2],
      explain: "Asosiy syujet chizig'i: open source hamjamiyati modellari closed source AI bilan raqobatlasha oladimi, yoki Google va OpenAI kabi big tech firmalari bozorda hukmronlik qilishda davom etadimi.",
      lesson: { title: "AI ning kelajagi", href: "02-Future-of-AI.md" }
    }
  ]
};
