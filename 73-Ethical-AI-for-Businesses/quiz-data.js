window.QUIZ = {
  id: "73",
  title: "Biznes foydalanuvchilar uchun etik AI",
  subtitle: "Kichik biznes uchun AI narxi va shablonlar, LIME, SHAP va permutatsiya, firibgarlik bayrog'i va inson nazorati, xavf reyestri",
  next: { label: "Shaxsiy foydalanuvchilar uchun etik AI", href: "../74-Ethical-AI-for-Individuals/README.md" },
  questions: [
    {
      q: "Bir xil savol o'zbekchada inglizchadan 1.60 barobar ko'p token oladi, lekin kichik do'konning yillik narxi deyarli bir xil chiqdi ($162.43 va $163.52). Nega?",
      type: "single",
      options: [
        "O'zbekcha savollar kamroq beriladi, shuning uchun jami token teng",
        "API o'zbek tili uchun token narxini avtomatik pasaytiradi",
        "Tizim prompti (400 token) farqni yutadi: nisbat 1.01x ga tushadi",
        "Javob tokenlari o'zbekchada inglizchadan kamroq bo'ladi"
      ],
      answer: [2],
      explain: "Qisqa savolda til jarimasi tizim prompti ichida ko'rinmay qoladi. Lekin RAG konteksti qo'shilsa, hujjatning o'zi o'zbekcha bo'lgani uchun 1.57x token va yiliga +$47 (+28%) qaytib keladi.",
      lesson: { title: "Har o'lchamdagi biznes uchun AI", href: "01-Access-for-All-Sizes.md" }
    },
    {
      q: "Onlayn do'kon mijozlari \"Buyurtmam qayerda?\" deb eng ko'p so'raydi (34%). Darsga ko'ra bu savolni qanday hal qilish kerak?",
      type: "single",
      options: [
        "Shablon va bazaga so'rov bilan — bu model savoli emas",
        "Katta til modeli bilan — u savolni har xil ifodada tushunadi",
        "Faqat inson operatori bilan — xato qimmatga tushadi",
        "RAG bilan — buyurtma hujjatlarini kontekstga qo'shib"
      ],
      answer: [0],
      explain: "Buyurtma holati, qaytarish siyosati va yetkazish narxi birgalikda savollarning 70% ini tashkil qiladi va AI siz hal bo'ladi. Eng arzon AI strategiyasi — AI ishlatmaslik kerak bo'lgan joyni topish.",
      lesson: { title: "Har o'lchamdagi biznes uchun AI", href: "01-Access-for-All-Sizes.md" }
    },
    {
      q: "Nega darsda shablon javoblar 70% savol uchun faqat arzon emas, etik jihatdan ham yaxshiroq deyiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Shablon gallyutsinatsiya qilmaydi",
        "Shablon erkin va turlicha matnlarga yaxshi moslashadi",
        "Har bir javob ko'rinadigan qoida, ya'ni tushuntiriladi",
        "Shablon bir xil savolga har doim bir xil javob beradi",
        "Shablon mijoz tilidan qat'i nazar hamma savolni tushunadi"
      ],
      answer: [0, 2, 3],
      explain: "Shablon xato to'qimaydi, tushuntiriladi va nomuvofiq emas (72-modulda model nomuvofiqligi 37.5% edi). Erkin va turlicha matn esa aynan AI foydali bo'ladigan holat.",
      lesson: { title: "Har o'lchamdagi biznes uchun AI", href: "01-Access-for-All-Sizes.md" }
    },
    {
      q: "Permutatsiya muhimligi qarorda (0/1) indeks uchun 0.1803, portfolio uchun 0.1821 berdi (sd ≈ 0.011–0.012), holbuki haqiqiy og'irliklar 2.5 va 1.5. Bu nimani anglatadi?",
      type: "single",
      options: [
        "Permutatsiya usuli noto'g'ri yozilgan, uni darhol SHAP bilan almashtirish kerak",
        "Portfolio haqiqatan ham indeksdan kuchliroq, og'irliklar noto'g'ri berilgan",
        "Farq shovqin ichida: chegara ma'lumotni o'chirib, ikkalasini ajratmaydi",
        "Takrorlar soni kam, 200 o'rniga 20 takror aniqroq natija beradi"
      ],
      answer: [2],
      explain: "Bu xato siralash emas, ajrata olmaslik. Xuddi shu funksiya uzluksiz ballda ishlatilganda siralash aynan to'g'ri chiqdi — demak chegara aybdor, usul emas.",
      lesson: { title: "Shaffoflik va XAI", href: "02-Transparency-and-XAI.md" }
    },
    {
      q: "Sinov modelida nomzodning ballini hisoblaydigan kod nima chop etadi?",
      code: "W = {\"tajriba\": 3.0, \"talim\": 0.0, \"sertifikat\": 1.0,\n     \"indeks\": 2.5, \"portfolio\": 1.5}\nx = {\"tajriba\": 1, \"talim\": 1, \"sertifikat\": 0,\n     \"indeks\": 1, \"portfolio\": 0}\nball = sum(W[k] * x[k] for k in W)\nprint(ball, 1 if ball >= 4.0 else 0)",
      type: "single",
      options: [
        "6.5 1",
        "5.5 1",
        "3.0 0",
        "5.5 0"
      ],
      answer: [1],
      explain: "3.0 + 0.0 + 2.5 = 5.5, bu 4.0 chegarasidan yuqori, qaror 1. Shu nomzod uchun SHAP(ball) aynan 3.0 va 2.5 ni berdi, SHAP(qaror) esa ikkalasiga 0.5 dan berib, farqni yo'qotdi.",
      lesson: { title: "Shaffoflik va XAI", href: "02-Transparency-and-XAI.md" }
    },
    {
      q: "HR hisobotida nomzod uchun LIME natijasi \"portfolio: -0.398\" deb ko'rsatilgan, bu nomzodda portfolio = 0. Buni qanday o'qish to'g'ri?",
      type: "single",
      options: [
        "Portfolio nomzodga zarar qildi, chunki uning og'irligi manfiy",
        "Portfolio modelda umuman ishlatilmaydi, qiymat shovqin",
        "LIME xato hisobladi, natijani hisobotdan olib tashlash kerak",
        "Portfolio yo'qligi zarar qildi: uni 1 qilish foyda berardi"
      ],
      answer: [3],
      explain: "Koeffitsient \"hozirgi holatda (0) qoldirish 1 qilishga nisbatan 0.398 ga yomonroq\" degani; haqiqiy og'irlik +1.5. Qoida: LIME ni hech qachon xom ko'rsatmang, har koeffitsientni belgi qiymati bilan yozing.",
      lesson: { title: "Shaffoflik va XAI", href: "02-Transparency-and-XAI.md" }
    },
    {
      q: "Beshta o'lchovdan qaysilari indeks proksisini yashirdi? (bir nechta javob)",
      type: "multi",
      options: [
        "Permutatsiya (qaror)",
        "Permutatsiya (ball)",
        "SHAP (qaror)",
        "SHAP (ball)",
        "LIME (qaror)"
      ],
      answer: [0, 2, 4],
      explain: "Yashirgan uchtasining umumiy jihati — ular QARORNI tushuntirgan. Ballda ishlatilgan permutatsiya va SHAP proksini fosh qildi. Bosh xulosa: XAI vositasini emas, nimani tushuntirishni tanlash muhim.",
      lesson: { title: "Shaffoflik va XAI", href: "02-Transparency-and-XAI.md" }
    },
    {
      q: "Modelga butunlay tasodifiy nazorat belgisi qo'shildi. Agar tushuntiruvchi unga nolga yaqin muhimlik bermasa, tushuntiruvchining o'zi buzuq.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Bu eng arzon tekshiruv. Darsda og'irligi 0 bo'lgan talim shu rolni o'ynadi: uchala usul ham unga ≈0 berdi, ya'ni uchalasi ham sog'lom.",
      lesson: { title: "Shaffoflik va XAI", href: "02-Transparency-and-XAI.md" }
    },
    {
      q: "Firibgarlik modeli 85% sezgir va atigi 6% yolg'on bayroq beradi, firibgarlik darajasi 2%. 1 000 hisobda 68 ta bayroqdan faqat 19 tasi haqiqiy chiqdi. Asosiy sabab nima?",
      type: "single",
      options: [
        "Model sifati past: 6% yolg'on bayroq juda yomon ko'rsatkich",
        "Asosiy stavka xatosi: aybsizlar juda ko'p, ularning 6% i ham 19 dan ko'p",
        "Tasodifiy urug' noto'g'ri tanlangan, boshqa urug'da bayroqlar to'g'ri chiqadi",
        "Model firibgarlarning faqat 19 tasini topdi, qolganlarini o'tkazib yubordi"
      ],
      answer: [1],
      explain: "976 × 6% ≈ 49 aybsiz bayroq, 24 × 85% ≈ 19 haqiqiy topilma. Muammo model sifatida emas, hodisaning nodirligida: bayroqlarning 72% i yolg'on.",
      lesson: { title: "AI chiqishlaridan etik foydalanish", href: "03-Ethical-Use-of-Outputs.md" }
    },
    {
      q: "Inson operatori kuniga faqat 60 ta bayroqni ko'ra oladi, model esa 68 ta bayroq qo'yadi va qolganlari avtomatik yopiladi. Darsdagi amaliy qoida qaysi?",
      type: "single",
      options: [
        "Operatorlar sonini oshirib, har qanday narxda hamma bayroqni ko'rish",
        "Ko'rilmagan bayroqlarni tasodifiy tanlab yopish, qolganini qoldirish",
        "Bayroqlar sonini kamaytirish va yopish o'rniga faqat cheklash",
        "Model ishonchini oshirish uchun uni ko'proq ma'lumotda qayta o'qitish"
      ],
      answer: [2],
      explain: "Quvvat 60 bo'lganda ham 4 ta aybsiz mijoz yo'qoladi: qisman nazorat — qisman himoya. Hammasini ko'ra olmasangiz, bayroqlar sonini kamaytiring; avtomatik yopmaslik (faqat cheklash) eng arzon va eng samarali usul.",
      lesson: { title: "AI chiqishlaridan etik foydalanish", href: "03-Ethical-Use-of-Outputs.md" }
    },
    {
      q: "Kursning to'rtta savolidan qaysi biri eng ko'p unutiladi va usiz xatoni aniqlasangiz ham tuzatib bo'lmaydi?",
      type: "single",
      options: [
        "Chiqish qanday hosil bo'ldi?",
        "Kamsitishi mumkinmi?",
        "Nega bu natija tanlanganini asoslay olamizmi?",
        "Qaror noto'g'ri bo'lsa nima bo'ladi?"
      ],
      answer: [3],
      explain: "Bu savol qaytarish yo'lini talab qiladi va u eng arzoni: hisobni yopish o'rniga muzlatish, 24 soatlik e'tiroz oynasi va bekor qilish tugmasi.",
      lesson: { title: "AI chiqishlaridan etik foydalanish", href: "03-Ethical-Use-of-Outputs.md" }
    },
    {
      q: "Chiqish nazorati funksiyasining soddalashtirilgan varianti nima chop etadi?",
      code: "def yonalish(oqibat, ishonch, guruh_farqi):\n    if oqibat == \"qaytarib bo'lmaydi\":\n        return \"INSONGA\"\n    if ishonch < 0.90:\n        return \"INSONGA\"\n    if guruh_farqi > 0.05:\n        return \"INSONGA\"\n    return \"AVTOMATIK\"\n\nprint(yonalish(\"qaytarib bo'lmaydi\", 0.99, 0.01),\n      yonalish(\"qaytarsa bo'ladi\", 0.95, 0.02))",
      type: "single",
      options: [
        "AVTOMATIK AVTOMATIK",
        "INSONGA INSONGA",
        "INSONGA AVTOMATIK",
        "AVTOMATIK INSONGA"
      ],
      answer: [2],
      explain: "Birinchi shart eng muhimi: qaytarib bo'lmaydigan qaror 0.99 ishonchda ham insonga boradi. Ikkinchi holat uchala shartdan o'tadi va avtomatik bo'ladi.",
      lesson: { title: "AI chiqishlaridan etik foydalanish", href: "03-Ethical-Use-of-Outputs.md" }
    },
    {
      q: "Xavf reyestrida operatsion toifa 51 ball to'pladi va uchala operatsion xavfda ham chora yo'q. Darsga ko'ra bu naqshning sababi nima?",
      type: "single",
      options: [
        "Ular model ishga tushgach paydo bo'ladi va o'shanda hech kim qaramaydi",
        "Operatsion xavflarning ta'siri past, shuning uchun ularga chora kerak emas",
        "Operatsion xavflarni faqat regulyatorlar boshqaradi, biznes emas",
        "Operatsion xavflar ma'lumot xavflaridan oldin, o'qitish bosqichida yuzaga keladi"
      ],
      answer: [0],
      explain: "Ma'lumot xavflari tanish, shuning uchun ular ustida ishlanadi (ikkalasi qoplangan). Operatsion xavflar — soxta asos, nomuvofiqlik, buzuq sudya — ishga tushgandan keyin chiqadi va e'tiborsiz qoladi.",
      lesson: { title: "Mas'uliyatli joriy qilish va xavfni boshqarish", href: "04-Responsible-Adoption.md" }
    },
    {
      q: "Reyestr testidagi mantiq bilan qaysi xavflar \"chorasiz yuqori xavf\" deb chiqadi?",
      code: "xavflar = [(\"A\", 4, 3, []),\n           (\"B\", 5, 3, []),\n           (\"C\", 4, 5, [\"chora\"])]\nochiq = [n for n, ta, eh, ch in xavflar\n         if not ch and ta * eh > 12]\nprint(ochiq)",
      type: "single",
      options: [
        "['A', 'B']",
        "['B']",
        "['B', 'C']",
        "[]"
      ],
      answer: [1],
      explain: "A ning balli 4 × 3 = 12, bu 12 dan katta emas. C ning balli 20, lekin chorasi bor. Faqat B (15, chorasiz) qoladi — haqiqiy reyestr_testi() bunday holatda AssertionError bilan build ni yiqitadi.",
      lesson: { title: "Mas'uliyatli joriy qilish va xavfni boshqarish", href: "04-Responsible-Adoption.md" }
    },
    {
      q: "Foydalanuvchi shikoyati eng qimmatli signal, chunki qolgan testlar siz o'ylagan xatolarni tekshiradi, shikoyat esa siz o'ylamagan xatoni topadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Shikoyat — yagona nazoratsiz signal. Shuning uchun kursning \"fikr-mulohaza tinglash\" maslahati eng qimmatli va eng arzon chora sifatida ko'rsatiladi.",
      lesson: { title: "Mas'uliyatli joriy qilish va xavfni boshqarish", href: "04-Responsible-Adoption.md" }
    }
  ]
};
