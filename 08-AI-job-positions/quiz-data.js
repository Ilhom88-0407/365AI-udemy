window.QUIZ = {
  id: "08",
  title: "AI sohasidagi lavozimlar",
  subtitle: "AI strategist, AI developer va AI engineer: vazifalari, ko'nikmalari va farqlari",
  next: { label: "Kelajakka nazar", href: "../09-Looking-ahead/README.md" },
  questions: [
    {
      q: "Kompaniya AI ga katta pul sarfladi, uchta loyiha boshladi, lekin hech biri natija bermadi. Darsga ko'ra buning eng ehtimoliy sababi nima?",
      type: "single",
      options: [
        "Tanlangan foundation modellar bu vazifalar uchun yetarlicha kuchli emas edi",
        "Loyihalar aniq rejasiz, biznes strategiyasiga bog'lanmasdan boshlangan",
        "Muhandislar Python o'rniga boshqa dasturlash tilidan foydalanishgan",
        "Kompaniya AI ni faqat bitta bo'limda sinab ko'rishga qaror qilgan"
      ],
      answer: [1],
      explain: "Dars ko'p kompaniyalar AI dan foyda ko'rmasligini uni strategik amalga oshira olmagani bilan izohlaydi: aniq rejasiz loyiha boshlab, natija o'z-o'zidan kelishini kutish yetarli emas.",
      lesson: { title: "AI Strategist", href: "01-AI-strategist.md" }
    },
    {
      q: "Onlayn kitob do'koni uchun AI strategist qaysi g'oyani tanlashi ehtimoli ko'proq?",
      type: "single",
      options: [
        "Ofis uchun AI boshqaradigan kofe mashinasi",
        "Xodimlarning bayramlari uchun AI she'r generatori",
        "Mijozlarga kitob tavsiya qiluvchi tizim",
        "Ofis devorlari uchun AI chizgan rasmlar"
      ],
      answer: [2],
      explain: "AI strategist use case larni biznes strategiyasiga eng mos va eng yuqori ta'sirli bo'lishiga qarab tanlaydi. Kitob tavsiyasi sotuvga bevosita ta'sir qiladi, kofe mashinasi yoki she'r generatori esa biznes maqsadiga bog'liq emas.",
      lesson: { title: "AI Strategist", href: "01-AI-strategist.md" }
    },
    {
      q: "Quyidagilardan qaysilari darsda AI strategistning amaliy vazifalari sifatida sanalgan? (bir nechta javob)",
      type: "multi",
      options: [
        "Unumdorlik va narxni hisobga olib optimal AI model turini tanlashda yo'l ko'rsatish",
        "Foundation modelni pre-training uchun ulkan korpusni shaxsan tozalash",
        "Joylashtirilgan modellarni baholash va optimallashtirish protseduralarini o'rnatish",
        "Kompaniya bo'ylab AI ni qabul qilishni targ'ib qilish (AI evangelizm)",
        "Neyron tarmoq necha qatlamdan iborat bo'lishini belgilash"
      ],
      answer: [0, 2, 3],
      explain: "To'rtta amaliy vazifa: model turini tanlashda yo'l ko'rsatish, production'ga joylashtirish va integratsiyani tasavvur qilish, baholash protseduralarini o'rnatish va AI evangelizm. Korpusni tozalash va qatlamlar sonini belgilash AI developer ishi.",
      lesson: { title: "AI Strategist", href: "01-AI-strategist.md" }
    },
    {
      q: "To'g'rimi: AI strategist nomidan ko'rinib turganidek, texnik bo'lmagan, faqat biznes rejalashtirish bilan shug'ullanadigan roldir.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Dars ta'kidlaydiki, nomi texnik bo'lmagandek eshitilsa ham bu haqiqatan texnik rol: strategist use case taklif qilishdan tashqari kompaniyaga ularni amalda bajarishga yordam bera olishi kerak.",
      lesson: { title: "AI Strategist", href: "01-AI-strategist.md" }
    },
    {
      q: "Firma AI strategistni to'liq stavkali xodim emas, konsultant sifatida yolladi. Darsga ko'ra bu yondashuvning xavfi nimada?",
      type: "single",
      options: [
        "Konsultant biznesni chuqur tushunishga ulgurmasligi va strategiya bir martalik loyihaga aylanishi mumkin",
        "Konsultant to'liq stavkali xodimdan doim qimmatroq tushadi va budjetni oshiradi",
        "Konsultant boshqa kompaniyalar tajribasidan foydalana olmaydi va yangi amaliyot keltirmaydi",
        "Konsultant C-suite bilan muloqot qilish huquqiga ega bo'lmaydi"
      ],
      answer: [0],
      explain: "Konsultant arzonroq va sohaning eng yaxshi amaliyotlarini ulasha oladi, lekin biznesni chuqur tushunishga vaqti yetmasligi va AI strategiyasi bir martalik loyihaga aylanishi mumkin.",
      lesson: { title: "AI Strategist", href: "01-AI-strategist.md" }
    },
    {
      q: "Uchta ish e'loni bir xil vazifalarni sanaydi, lekin biri \"AI Developer\", biri \"AI Engineer\", biri \"Machine Learning Engineer\" deb nomlangan. Dars buni qanday izohlaydi?",
      type: "single",
      options: [
        "Bu uch xil lavozim, faqat e'lon yozuvchilar vazifalarni noto'g'ri ko'chirgan",
        "Ish beruvchilar nomzodlarni chalg'itish uchun ataylab turli nom ishlatadi",
        "Nomlar mamlakatga qarab farq qiladi, lekin har birida qat'iy standart bor",
        "Soha hali boshlang'ich bosqichda va lavozim nomlari yaxshi o'rnashmagan"
      ],
      answer: [3],
      explain: "AI sohasi hali erta bosqichda, shuning uchun ish beruvchilar bir xil tavsifli rollar uchun turli nomlardan foydalanadi. Developer va engineer farqi — ma'ruzachining talqini.",
      lesson: { title: "AI Developer", href: "02-AI-developer.md" }
    },
    {
      q: "Darsdagi foundation model va uning egasi juftliklaridan qaysi biri noto'g'ri?",
      type: "single",
      options: [
        "Meta — Llama",
        "Anthropic — Claude",
        "OpenAI — Gemini",
        "Google — BERT"
      ],
      answer: [2],
      explain: "Gemini (va BERT) Google ga tegishli, OpenAI ning modeli esa GPT. Meta — Llama, Anthropic — Claude juftliklari to'g'ri.",
      lesson: { title: "AI Developer", href: "02-AI-developer.md" }
    },
    {
      q: "Nima uchun AI developer vaqtining sezilarli qismini tadqiqotga (R&D) sarflashi kerak?",
      type: "single",
      options: [
        "Chunki tadqiqot natijalari bevosita mijozlarga sotiladi va daromad keltiradi",
        "Chunki R&D soha yangiliklaridan xabardor bo'lish va optimal arxitektura tanlashga yordam beradi",
        "Chunki tadqiqot pre-training bosqichini butunlay keraksiz qilib qo'yadi",
        "Chunki R&D bilan shug'ullanish AI evangelizmning asosiy qismi hisoblanadi"
      ],
      answer: [1],
      explain: "R&D developerga soha rivojlanishlaridan xabardor bo'lish, yangi g'oyalarni sinash hamda optimal arxitektura va model design (neyron tarmoq turi, qatlamlar chuqurligi) ga qaror qilish imkonini beradi.",
      lesson: { title: "AI Developer", href: "02-AI-developer.md" }
    },
    {
      q: "Dars nima uchun pre-training bosqichida \"xato uchun joy yo'q\" deydi?",
      type: "single",
      options: [
        "Chunki pre-training dan keyin modelni hech qanday usulda takomillashtirib bo'lmaydi",
        "Chunki bu bosqichda xato qilgan developer qonun oldida javob beradi",
        "Chunki o'qitish juda qimmat va xato katta xarajatga olib keladi",
        "Chunki pre-training faqat bir marta, kompaniya tashkil topganda o'tkaziladi"
      ],
      answer: [2],
      explain: "O'qitish qimmat (masalan GPT-4 uchun $100 mln dan ortiq), shuning uchun developer aniqlikni sinchkovlik bilan ta'minlashi kerak. Keyingi bosqichlarda model baribir takomillashtiriladi, shuning uchun birinchi variant noto'g'ri.",
      lesson: { title: "AI Developer", href: "02-AI-developer.md" }
    },
    {
      q: "Darsga ko'ra AI developerga statistika, chiziqli algebra, matematik analiz va ehtimollik bo'yicha a'lo bilim asosan nima uchun kerak?",
      type: "single",
      options: [
        "AI tadqiqotini hamda deep learning va transformers kabi murakkab mavzularni tushunish uchun",
        "Docker konteynerlarini sozlash va DevOps jarayonlarini boshqarish uchun",
        "Biznes manfaatdorlariga loyiha ta'sirini raqamlar bilan tushuntirish uchun",
        "Kompaniyaning moliyaviy hisobotlarini tayyorlash va budjetni rejalashtirish uchun"
      ],
      answer: [0],
      explain: "Dars matematikani aynan AI tadqiqotini va deep learning hamda transformers kabi murakkab mavzularni tushunish uchun zarur deb ta'kidlaydi.",
      lesson: { title: "AI Developer", href: "02-AI-developer.md" }
    },
    {
      q: "Quyidagi vazifalardan qaysilari AI engineer ishiga to'g'ri keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Tayyor GPT modelini kompaniya saytiga ulash",
        "Yangi neyron tarmoq arxitekturasini loyihalash",
        "RAG uchun vector database sozlash",
        "Pre-training jarayonini noldan ishga tushirish",
        "Mobil ilovaga AI yordamchi qo'shish"
      ],
      answer: [0, 2, 4],
      explain: "AI engineer foundation modellar ustiga mahsulot quradi: modelni saytga ulash, RAG uchun vector DB sozlash, ilovaga yordamchi qo'shish. Arxitektura loyihalash va pre-training — AI developer ishi.",
      lesson: { title: "AI Engineer", href: "03-AI-engineer.md" }
    },
    {
      q: "Dars AI engineer ning asosiy vazifasini qaysi metafora bilan tasvirlaydi?",
      type: "single",
      options: [
        "Foundation modelni noldan quradigan me'mor",
        "Kompaniya ichida AI ni targ'ib qiluvchi voiz",
        "Ma'lumotlarni to'plab tozalaydigan omborchi",
        "Foundation model va mahsulot o'rtasidagi ko'prik quruvchi"
      ],
      answer: [3],
      explain: "AI engineer OpenAI va Google kabi tashkilotlar yaratgan foundation modellar bilan AI dan foyda ko'radigan mahsulot o'rtasida ko'prik quradi. Targ'ibot (evangelizm) esa strategist vazifasi.",
      lesson: { title: "AI Engineer", href: "03-AI-engineer.md" }
    },
    {
      q: "AI engineer ilovasi embeddings bilan ishlaydi va foydalanuvchilar soni tez o'smoqda. Darsga ko'ra Pinecone kabi vector database unga qanday yordam beradi?",
      type: "single",
      options: [
        "Foundation modelni kompaniya ma'lumotlarida qayta pre-training qiladi",
        "Ma'lumotni samarali saqlab, tez topadi, shunda muhandis latency o'rniga UX va javob sifatiga e'tibor beradi",
        "Turli LLM lar orasidan tanlash va ularni almashtirish imkonini beradi",
        "Promptlarni avtomatik yozib, prompt engineering zaruratini yo'qotadi"
      ],
      answer: [1],
      explain: "Vector database embeddings kabi murakkab tuzilmalarni samarali saqlaydi va tez topadi, bu esa latency va masshtablilik tashvishini kamaytiradi. LLM larni almashtirish moslashuvchanligi LangChain ga tegishli.",
      lesson: { title: "AI Engineer", href: "03-AI-engineer.md" }
    },
    {
      q: "Darsga ko'ra ko'plab kompaniyalar AI engineering rollari uchun qanday nomzodni qidiradi?",
      type: "single",
      options: [
        "Barcha kerakli ko'nikmalarni allaqachon to'liq egallagan mukammal mutaxassisni",
        "Faqat foundation model qurish tajribasi bor AI developerni",
        "ML yoki kompyuter fanlari poydevori bor va yetishmayotgan ko'nikmalarni o'rganishga tayyor odamni",
        "Texnik bilimi bo'lmasa ham kuchli biznes zukkoligiga ega rahbarni"
      ],
      answer: [2],
      explain: "Full-stack ma'lumot nodir bo'lgani uchun kompaniyalar ML yoki kompyuter fanlari poydevoriga ega va o'zida yetishmayotgan sohada ko'nikmasini oshirishga vaqt sarflashga tayyor iste'dodli shaxsni qidiradi.",
      lesson: { title: "AI Engineer", href: "03-AI-engineer.md" }
    },
    {
      q: "To'g'rimi: darsga ko'ra LangChain foundation modellarni mahsulotlarga integratsiya qilish va kerak bo'lganda turli LLM larni almashtirish moslashuvchanligini beradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Dars LangChain ni AI engineer uchun ajralmas vosita deb ataydi: u integratsiyani soddalashtiradi va LLM lar orasidan tanlash hamda almashtirish imkonini beradi.",
      lesson: { title: "AI Engineer", href: "03-AI-engineer.md" }
    }
  ]
};
