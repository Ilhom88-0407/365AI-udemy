window.QUIZ = {
  id: "07",
  title: "AI tech stack",
  subtitle: "Python, API lar, vector database lar, open source va closed source, Hugging Face, LangChain hamda AI baholash vositalari",
  next: { label: "AI sohasidagi lavozimlar", href: "../08-AI-job-positions/README.md" },
  questions: [
    {
      q: "Darsga ko'ra kod yozish ko'nikmasi no-code vositalar hozircha yeta olmaydigan qaysi imkoniyatlarni beradi? (bir nechta javob)",
      type: "multi",
      options: [
        "Prompt engineering orqali AI xulqini chuqur moslashtirish",
        "Chatbot prototipini bir necha daqiqada, hech narsa o'rganmasdan qurish",
        "Ma'lumotlar bazalarini AI ilovaga integratsiya qilish",
        "O'rganish egri chizig'ini boshlovchilar uchun pasaytirish",
        "temperature, max_tokens kabi model parametrlarini o'zgartirish"
      ],
      answer: [0, 2, 4],
      explain: "Kod OpenAI, Llama, Anthropic API laridan foydalanish, prompt engineering, baza integratsiyasi va parametrlarni o'zgartirish imkonini beradi. Tez prototip va past o'rganish egri chizig'i esa aksincha no-code ning afzalliklari.",
      lesson: { title: "Python dasturlash", href: "01-Python-programming.md" }
    },
    {
      q: "Darsda tilga olingan Python kutubxonalari va ularning vazifalari qaysi variantda to'g'ri moslashtirilgan?",
      type: "single",
      options: [
        "NumPy — vizuallashtirish, pandas — massivlar, matplotlib — preprocessing",
        "NumPy — massiv va matritsalar, pandas — preprocessing, matplotlib — vizuallashtirish",
        "NumPy — preprocessing, pandas — vizuallashtirish, matplotlib — matritsalar",
        "NumPy — massiv va matritsalar, pandas — vizuallashtirish, matplotlib — preprocessing"
      ],
      answer: [1],
      explain: "NumPy ko'p o'lchamli massivlar, matritsalar va matematik funksiyalar uchun, pandas ma'lumotni oldindan tayyorlash uchun, matplotlib esa vizuallashtirish uchun ishlatiladi.",
      lesson: { title: "Python dasturlash", href: "01-Python-programming.md" }
    },
    {
      q: "365 kompaniyasi talabalar qancha o'rganganini ish e'lonlari platformasiga har hafta Excel fayl bilan emas, API orqali bermoqchi. Buning asosiy afzalligi nima?",
      type: "single",
      options: [
        "Platforma 365 serverlarining ichki kodini to'liq ko'ra va o'zgartira oladi",
        "Ma'lumot bir marta to'liq yuboriladi, keyin esa qayta so'rash shart bo'lmaydi",
        "Platforma so'rov yuboradi va eng so'nggi ma'lumotni bevosita 365 serveridan oladi",
        "API to'g'ri ishlashi uchun klient ham, server ham bitta kompyuterda turishi shart"
      ],
      answer: [2],
      explain: "API klient va server o'rtasidagi ko'prik: klient request yuboradi, server response qaytaradi. Shuning uchun ma'lumot doim yangi; klient esa server ichida nima borligini bilmaydi, faqat so'rov va javob formatini biladi.",
      lesson: { title: "API bilan ishlash", href: "02-Working-with-APIs.md" }
    },
    {
      q: "Darsdagi soxta (mock) API ning qisqartirilgan varianti. Kod nima chiqaradi?",
      code: "BAZA = {\"talaba_101\": {\"ism\": \"Ali\"}}\n\ndef api_endpoint(sorov):\n    talaba_id = sorov.get(\"talaba_id\")\n    if talaba_id not in BAZA:\n        return {\"status\": 404, \"xato\": \"Talaba topilmadi\"}\n    return {\"status\": 200, \"malumot\": BAZA[talaba_id]}\n\njavob = api_endpoint({\"talaba_id\": \"talaba_999\"})\nprint(javob[\"status\"], javob.get(\"malumot\"))",
      type: "single",
      options: [
        "200 {'ism': 'Ali'}",
        "404 Talaba topilmadi",
        "KeyError xatosi chiqadi",
        "404 None"
      ],
      answer: [3],
      explain: "talaba_999 bazada yo'q, shuning uchun server status 404 li javob qaytaradi. Bu lug'atda \"malumot\" kaliti yo'q, lekin .get() xato bermay None qaytaradi. \"Talaba topilmadi\" matni \"xato\" kalitida turadi.",
      lesson: { title: "API bilan ishlash", href: "02-Working-with-APIs.md" }
    },
    {
      q: "Mijozlarni qo'llab-quvvatlash chatboti siz va o'xshash mijozlar bilan bo'lgan oldingi suhbatlarni hisobga olib, xabardorroq javob berishi kerak. Darsga ko'ra vector database bunga qanday yordam beradi?",
      type: "single",
      options: [
        "Oldingi suhbatlarni satr va ustunli jadvalga yozib, ularni SQL bilan tartiblaydi",
        "O'tmish suhbatlarni vektor ko'rinishida saqlaydi, model kontekst uchun ularni topadi",
        "Modelning weights larini har bir suhbatdan keyin avtomatik ravishda qayta o'qitadi",
        "Har bir yangi savolda barcha eski suhbatlarni to'liq promptga qo'shib yuboradi"
      ],
      answer: [1],
      explain: "Vector database ning eng ajoyib qo'llanishlaridan biri — LLM larga uzoq muddatli xotira berish: o'tmish muloqotlar vektor sifatida saqlanadi va kerakli bo'lak topilib, kontekstga qo'shiladi. Weights o'zgarmaydi.",
      lesson: { title: "Vector databases", href: "03-Vector-databases.md" }
    },
    {
      q: "Darsda indekslash nima uchun kerakligini ko'rsatuvchi taxminiy hisob bor. Bu kod nima chiqaradi?",
      code: "import math\n\nfor n in (1_000, 1_000_000):\n    print(n, round(math.log2(n)))",
      type: "single",
      options: [
        "1000 3 va 1000000 6",
        "1000 10 va 1000000 20",
        "1000 1000 va 1000000 1000000",
        "1000 10 va 1000000 10000"
      ],
      answer: [1],
      explain: "log2(1000) ≈ 9.97 → 10, log2(1 000 000) ≈ 19.93 → 20. Ya'ni ma'lumot ming barobar oshsa ham indeks bilan taqqoslashlar soni juda sekin o'sadi — shuning uchun vector database lar indekslash va ML texnikalariga tayanadi.",
      lesson: { title: "Vector databases", href: "03-Vector-databases.md" }
    },
    {
      q: "Sizib chiqqan Google hujjatiga ko'ra, Google va OpenAI o'rtasidagi poygada \"tushlikni yeb qo'ygan\" uchinchi tomon kim?",
      type: "single",
      options: [
        "Open source modellari — chunki Google ham, OpenAI ham \"maxfiy retsept\"ga ega emas",
        "Meta — chunki u Llama ni faqat yopiq litsenziya bilan sotishni boshladi",
        "Davlatlar — chunki ular o'z foundation modellarini qurishni boshladi",
        "Microsoft — chunki u GitHub va Hugging Face ni sotib olib, bozorni egalladi"
      ],
      answer: [0],
      explain: "Hujjat uchinchi tomon tahdidi open source modellardan kelishini va Google yoki OpenAI da modellarni yaxshiroq qiladigan secret sauce yo'qligini aytadi. Sifat tafovuti hayratlanarli tezlikda yopilmoqda.",
      lesson: { title: "Open source ning ahamiyati", href: "04-The-importance-of-open-source.md" }
    },
    {
      q: "To'g'rimi: open source AI modelidan foydalanish butunlay bepul — litsenziya to'lovi ham, boshqa xarajatlar ham bo'lmaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Google yoki OpenAI to'lovlaridan qutulasiz, lekin hisoblash (compute) xarajatlarini baribir to'laysiz. Moslashtirish va fine-tuning xarajatlari OpenAI to'lovidan oshib ketishi yoki ketmasligi esa noaniq va subyektiv.",
      lesson: { title: "Open source ning ahamiyati", href: "04-The-importance-of-open-source.md" }
    },
    {
      q: "Kompaniya tor, domenga xos vazifani (masalan, ichki hujjatlarni toifalash) hal qilmoqchi. Ma'ruzachining bashoratiga ko'ra qaysi yondashuv ustun?",
      type: "single",
      options: [
        "GPT kabi keng closed source modelni ishlatish, chunki u har qanday vazifada arzonroq",
        "Noldan o'z foundation modelini qurish, chunki tor vazifalar uchun boshqa yo'l yo'q",
        "Open source bazaviy modelni fine-tune qilish, chunki keng modelni ishlatish ancha qimmat",
        "Closed source modelni fine-tune qilish, chunki bu doim eng arzon variant"
      ],
      answer: [2],
      explain: "Tor, ixtisoslashgan vazifalarda open source ustun: bazaviy modelni fine-tune qilish bunday muammolarni yaxshi hal qiladi. GPT kabi keng modelni tor muammoga ishlatish qimmatroq, closed source'ni fine-tune qilish esa sezilarli to'lov talab qilishi mumkin.",
      lesson: { title: "Open source ning ahamiyati", href: "04-The-importance-of-open-source.md" }
    },
    {
      q: "Hugging Face platformasining ochiqligi haqida qaysi fikr to'g'ri?",
      type: "single",
      options: [
        "Platforma infratuzilmasi ham, undagi modellar ham to'liq yopiq va pullik",
        "Platforma infratuzilmasi ochiq, lekin foydalanuvchilar yuklagan modellar yopiq",
        "Platforma faqat Microsoft ga tegishli yopiq modellarni tarqatadi",
        "Infratuzilma open source emas, lekin yuklangan modellar va datasetlar ochiq"
      ],
      answer: [3],
      explain: "GitHub kabi, Hugging Face ning o'zi (kod, serverlar, infratuzilma) open source emas, lekin foydalanuvchilar yuklagan modellar va datasetlar ochiq. Shuning uchun uni \"machine learning ning GitHub'i\" deyishadi.",
      lesson: { title: "Hugging Face", href: "05-Hugging-Face.md" }
    },
    {
      q: "Kichik startapda LLM ni noldan o'qitishga mablag' yo'q. Hugging Face ular uchun muammoni qanday hal qiladi?",
      type: "single",
      options: [
        "Transformers orqali bepul pre-trained modellardan oson foydalanish imkonini beradi",
        "Startaplarga LLM ni noldan o'qitish uchun bepul GPU va bulut grantlari ajratadi",
        "OpenAI ning yopiq modellarini litsenziya asosida arzonroq narxda qayta sotadi",
        "Faqat modellarni baholash xizmatini ko'rsatadi, modellarning o'zini esa ulashmaydi"
      ],
      answer: [0],
      explain: "Hugging Face jarayonni demokratlashtiradi: platformadagi pre-trained modellar bepul, Transformers kutubxonasi esa ularga API orqali oson kirish va ML pipeline lar yaratish imkonini beradi. Platformada modellarni ulashish, fine-tune, hosting va baholash ham mumkin.",
      lesson: { title: "Hugging Face", href: "05-Hugging-Face.md" }
    },
    {
      q: "Ilovangiz GPT bilan qurilgan, endi arzonroq va tezroq boshqa modelga o'tmoqchisiz. LangChain bu vaziyatda nima uchun qulay?",
      type: "single",
      options: [
        "U yangi modelni avtomatik fine-tune qilib, uning weights larini ilovaga moslab yangilaydi",
        "Modullari tufayli modelni kodni qayta yozmasdan, Lego bloki kabi almashtirish mumkin",
        "U faqat bitta foundation model bilan ishlaydi, shuning uchun tanlov muammosi bo'lmaydi",
        "U API chaqiruvlarini butunlay olib tashlab, modelni lokal kompyuterda o'qitadi"
      ],
      answer: [1],
      explain: "LangChain — Python va JavaScript'dagi open source orkestratsiya muhiti: funksiyalar va obyekt klasslari kabi modular komponentlar bir foundation modelni boshqasiga strukturalangan tarzda almashtiradi, kodni qayta yozish shart emas.",
      lesson: { title: "LangChain", href: "06-LangChain.md" }
    },
    {
      q: "Darsga ko'ra LangChain ishlatishning asosiy \"narxi\" (kamchiligi) nima?",
      type: "single",
      options: [
        "U faqat JavaScript'da mavjud, Python loyihalarida esa ishlamaydi",
        "U ilovaga uzoq muddatli xotira qo'shishni amalda imkonsiz qiladi",
        "Qo'lda yozilgan integratsiyaga nisbatan moslashuvchanligi kamroq",
        "U kod hajmini oshirib, prototip ishlab chiqish vaqtini uzaytiradi"
      ],
      answer: [2],
      explain: "Klassik trade-off: framework LLM ni tez va qulay integratsiya qilish yo'lini beradi, lekin qo'lda yozishga nisbatan moslashtirish erkinligini cheklaydi. Kod hajmi aksincha kamayadi, uzoq muddatli xotira esa uning tez-tez uchraydigan qo'llanishi.",
      lesson: { title: "LangChain", href: "06-LangChain.md" }
    },
    {
      q: "Darsga ko'ra \"AI as a judge\" yondashuvining qaysi fikrlari to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Narx samaradorligi beradi",
        "Inson hakamlarga bo'lgan ehtiyojni butunlay yo'qotadi",
        "Mijozlar bilan katta hajmdagi muloqotni ko'rib chiqish imkonini beradi",
        "Axloqiy hukmlarda inson intuitsiyasidan ishonchliroq",
        "Masshtablilik va tezlik beradi, ayniqsa minglab foydalanuvchida"
      ],
      answer: [0, 2, 4],
      explain: "AI hakam arzon, masshtablanadigan, tez va katta hajmdagi muloqotni ko'rib chiqa oladi. Lekin AI da inson intuitsiyasi va etikasi yo'q, shuning uchun baholashga inson hakamlarni ham jalb qilish shart.",
      lesson: { title: "AI baholash vositalari", href: "07-AI-evaluation-tools.md" }
    },
    {
      q: "Darsdagi AI hakamning yopiq uchli (kod) savollar uchun soddalashtirilgan funksiyasi. Kod nima chiqaradi?",
      code: "def hakam_kod(javob, kutilgan):\n    ok = javob.strip() == kutilgan.strip()\n    return 10 if ok else 0\n\nprint(hakam_kod(\" 120\", \"120\"), hakam_kod(\"3\", \"2\"))",
      type: "single",
      options: [
        "0 0",
        "10 10",
        "0 10",
        "10 0"
      ],
      answer: [3],
      explain: "strip() bo'shliqni olib tashlaydi, shuning uchun \" 120\" va \"120\" teng — 10 ball; \"3\" va \"2\" teng emas — 0 ball. Kod savollarida kutilgan natija ma'lum, shuning uchun ular ochiq uchli savollardan ancha oson baholanadi.",
      lesson: { title: "AI baholash vositalari", href: "07-AI-evaluation-tools.md" }
    }
  ]
};
