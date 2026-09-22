window.QUIZ = {
  id: "74",
  title: "Shaxsiy foydalanuvchilar uchun etik AI",
  subtitle: "Til jarimasi va teng kirish, filtr pufagi mexanizmi, AI detektorlari cheklovi va deepfake'dan arzon himoya",
  next: { label: "ChatGPT etikasi", href: "../75-ChatGPT-Ethics/README.md" },
  questions: [
    {
      q: "Bir xil savol inglizchada 14 token, o'zbekchada 25 token oldi. Darsdagi o'lchovga ko'ra o'zbek foydalanuvchisi qancha ko'p token sarflaydi?",
      type: "single",
      options: [
        "Taxminan 1.29 barobar ko'p",
        "Taxminan 1.79 barobar ko'p",
        "Taxminan 2.14 barobar ko'p",
        "Taxminan 2.50 barobar ko'p"
      ],
      answer: [1],
      explain: "25 / 14 ≈ 1.79x. 1.29x — ruscha savolning nisbati, 2.14x esa 75-modulda alohida so'zlar uchun o'lchangan jarima.",
      lesson: { title: "AI ga teng kirish", href: "01-Equity-in-Access.md" }
    },
    {
      q: "8000 tokenlik kontekst oynasiga inglizcha 571 ta, o'zbekcha 320 ta savol sig'adi. Nega dars bu farqni \"pul bilan hal bo'lmaydi\" deydi?",
      type: "single",
      options: [
        "Chunki o'zbek foydalanuvchilari uchun obuna narxi allaqachon eng past qilib belgilangan",
        "Chunki tokenlar soni internet tezligiga bog'liq, pul esa tezlikni oshirmaydi",
        "Chunki kontekst oynasi modelning qattiq chegarasi — ko'proq to'lasangiz ham u kengaymaydi",
        "Chunki o'zbekcha matnlar serverda avtomatik ravishda inglizchaga tarjima qilinadi"
      ],
      answer: [2],
      explain: "Kontekst oynasi modelning qattiq chegarasi. O'zbek foydalanuvchisining \"xotirasi\" taxminan 44% qisqaroq va buni ko'proq pul to'lab o'zgartirib bo'lmaydi.",
      lesson: { title: "AI ga teng kirish", href: "01-Equity-in-Access.md" }
    },
    {
      q: "Darsga ko'ra o'zbek foydalanuvchisi qaysi tomonlardan \"jazolanadi\"? (bir nechta javob)",
      type: "multi",
      options: [
        "Bir xil savol uchun ko'proq token to'laydi",
        "Kontekst oynasiga kamroq matn sig'adi",
        "Bepul onlayn AI kurslariga kira olmaydi",
        "O'zbek idiomalarida yomonroq javob oladi",
        "Model unga javobni sekinroq yuboradi"
      ],
      answer: [0, 1, 3],
      explain: "Uch jazo: 1.79x token, 571 o'rniga 320 savol va idiomalarda 3/5 o'rniga 0/5 tushunish. Uchalasining sababi bitta — o'quv ma'lumotida o'zbek tili kam.",
      lesson: { title: "AI ga teng kirish", href: "01-Equity-in-Access.md" }
    },
    {
      q: "Kurs taklif qilgan uchta yechim (Starlink/Taara, bepul kurslar, bepul bulut kreditlari) o'zbek tilidagi token va sifat tengsizligini ham hal qiladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Ular ulanish, bilim va hisoblash quvvati to'siqlarini hal qiladi, lekin uchalasi ham tilga tegmaydi. Tilga ona tilidagi ma'lumot va baholash to'plamlari tegadi.",
      lesson: { title: "AI ga teng kirish", href: "01-Equity-in-Access.md" }
    },
    {
      q: "Til tengsizligiga qarshi qaysi chora darsda \"eng arzoni va eng kam qilinadigani\" deb ataladi?",
      type: "single",
      options: [
        "Ona tilida baholash (test) to'plamini yaratish",
        "Mahalliy tokenizatorni noldan ishlab chiqish",
        "Hamma so'rovlarni avval inglizchaga tarjima qilish",
        "Faqat eng yangi tokenizatorli modellarni tanlash"
      ],
      answer: [0],
      explain: "Dars ta'kidlaydi: o'zbekcha 100 ta test savoli bo'lsa ham, siz ko'p tadqiqotchidan ko'proq narsaga egasiz. Mahalliy tokenizator esa tadqiqotchilar ishi va ancha qimmat.",
      lesson: { title: "AI ga teng kirish", href: "01-Equity-in-Access.md" }
    },
    {
      q: "Tavsiya halqasi modelida hamma mavzu teng (1.0) boshlaydi va tasodif 0%. Filtr pufagi qachon yopildi?",
      type: "single",
      options: [
        "Taxminan 15-qadamda, qiziqishlar asta-sekin torayib borgach",
        "Faqat 30-qadamda, simulyatsiya oxirida",
        "Urug'ga qarab: ba'zilarida umuman yopilmadi",
        "Birinchi qadamdayoq — 10 ta urug'ning hammasida"
      ],
      answer: [3],
      explain: "Pufak 0-qadamda qotdi va 30 qadamdan keyin ham faqat 5/10 mavzu ko'rildi. Muallif ham asta-sekin torayishni kutgan edi, lekin natija boshqacha chiqdi.",
      lesson: { title: "Inson–AI hamkorligidagi etik masalalar", href: "02-Human-AI-Collaboration.md" }
    },
    {
      q: "Quyidagi kod (tasodifsiz, birinchi qadam) nima chiqaradi?",
      code: "MAVZULAR = [\"sport\", \"siyosat\", \"fan\", \"san'at\", \"iqtisod\", \"sog'liq\"]\nqiziqish = {m: 1.0 for m in MAVZULAR}\n\ntanlangan = sorted(MAVZULAR, key=lambda m: -qiziqish[m])[:3]\nprint(tanlangan)",
      type: "single",
      options: [
        "['fan', 'iqtisod', \"san'at\"] — alifbo tartibida",
        "['sport', 'siyosat', 'fan'] — asl ro'yxat tartibida",
        "Har ishga tushirishda boshqa uchta mavzu",
        "[\"san'at\", 'iqtisod', \"sog'liq\"] — oxirgi uchtasi"
      ],
      answer: [1],
      explain: "Hamma qiziqish teng bo'lgani uchun sorted barqaror ishlaydi va asl ro'yxat tartibini saqlaydi. Darsda aytilganidek, birinchi tanlov faqat ro'yxat tartibiga bog'liq — boshqa hech nimaga emas.",
      lesson: { title: "Inson–AI hamkorligidagi etik masalalar", href: "02-Human-AI-Collaboration.md" }
    },
    {
      q: "Modelda ko'rsatilmagan 5 ta mavzu 30 qadam davomida bir marta ham qaytib kelmadi. Buning to'g'ri talqini qaysi?",
      type: "single",
      options: [
        "Foydalanuvchiga bu mavzular yoqmagani uchun tizim ularni chiqarib tashladi",
        "Bu mavzular boshidanoq pastroq qiziqish qiymati bilan boshlangan edi",
        "Ular ko'rsatilmagani uchun kuchayish imkoniyatini hech qachon olmadi",
        "Tizim bu mavzular bo'yicha yetarli kontent topa olmay, ularni o'tkazib yubordi"
      ],
      answer: [2],
      explain: "Ular \"yoqmadi\" degani emas — hammasi 1.0 dan teng boshlagan edi. Faqat ko'rsatilgan mavzular kuchayadi, ko'rsatilmaganlar esa hech qachon imkoniyat olmaydi.",
      lesson: { title: "Inson–AI hamkorligidagi etik masalalar", href: "02-Human-AI-Collaboration.md" }
    },
    {
      q: "Tavsiyalarga 5% tasodifiy aralashtirish qo'shilsa nima bo'ladi va buni kim hal qiladi?",
      type: "single",
      options: [
        "Ko'rilgan mavzular 5.0 dan 8.3 ga oshadi; buni tizim quruvchi qo'shadi",
        "Ko'rilgan mavzular 5.0 dan 10.0 ga oshadi; buni foydalanuvchi sozlamada yoqadi",
        "Deyarli hech narsa o'zgarmaydi; buning uchun kamida 50% tasodif kerak",
        "Ko'rilgan mavzular 5.0 dan 9.9 ga oshadi; buni foydalanuvchi o'zi tanlaydi"
      ],
      answer: [0],
      explain: "Har 20 ta tavsiyadan bittasi tasodifiy bo'lsa, 5.0 → 8.3 (1.7 barobar). Lekin bu tizim quruvchining qarori — foydalanuvchi uni o'zi tanlay olmaydi. 9.9 esa 25% tasodifda.",
      lesson: { title: "Inson–AI hamkorligidagi etik masalalar", href: "02-Human-AI-Collaboration.md" }
    },
    {
      q: "Darsga ko'ra foydalanuvchi pufakdan chiqish uchun o'zi nima qila oladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Rozi bo'lmagan manbani kuzatishni boshlash",
        "Faqat yoqqan postlarga ko'proq like bosish",
        "Lenta o'rniga qidiruvdan foydalanish",
        "Turli manbalarni atayin ochib turish",
        "Ilovadagi 5% tasodif sozlamasini yoqish"
      ],
      answer: [0, 2, 3],
      explain: "Ro'yxatda: turli manbalarni atayin ochish, tavsiyalarni o'chirish, qidiruv ishlatish, rozi bo'lmagan manbani kuzatish (eng samaralisi) va tarixni tozalash. 5% tasodifni esa foydalanuvchi emas, tizim quruvchi qo'shadi.",
      lesson: { title: "Inson–AI hamkorligidagi etik masalalar", href: "02-Human-AI-Collaboration.md" }
    },
    {
      q: "Kalit so'z detektori muallifning o'zi to'qigan namunalarda 100% aniqlik berdi. Nega bu natija hech narsani isbotlamaydi?",
      type: "single",
      options: [
        "Chunki namunalar soni juda kam — 100 tadan kam matn statistik ahamiyatga ega emas",
        "Chunki \"AI namunalari\" aynan detektorning o'z kalit so'zlari bilan yozilgan",
        "Chunki inson matnlari ham AI yordamida tahrirlangan, farq qolmagan edi",
        "Chunki detektor faqat ruscha matnlarda sinab ko'rilgan, o'zbekchada emas"
      ],
      answer: [1],
      explain: "Bu doiraviy sinov: detektor o'zi qidiradigan iboralarni topdi. Haqiqiy model matnida aniqlik 67% ga tushdi (2/6 topildi).",
      lesson: { title: "AI chiqishlaridan mas'uliyatli foydalanish", href: "03-Responsible-Use.md" }
    },
    {
      q: "Oltita iborani almashtirish (masalan, \"In conclusion,\" → \"So,\") detektor natijasini 5/5 dan 1/5 ga tushirdi, ma'no esa o'zgarmadi. Bundan qanday xulosa chiqadi?",
      type: "single",
      options: [
        "Detektorga ko'proq kalit so'z qo'shilsa, muammo to'liq hal bo'ladi",
        "Detektor faqat qisqa matnlarda xato qiladi, uzun matnlarda ishonchli",
        "Kalit so'z detektori muallifni emas, uslubni o'lchaydi",
        "Almashtirilgan matnni endi inson yozgan deb hisoblash mumkin"
      ],
      answer: [2],
      explain: "Uslubni bir daqiqada o'zgartirish mumkin, muallif esa o'zgarmaydi. Shuning uchun \"buni AI yozganmi?\" savoli o'rniga \"bu da'vo to'g'rimi?\" deb so'rash kerak.",
      lesson: { title: "AI chiqishlaridan mas'uliyatli foydalanish", href: "03-Responsible-Use.md" }
    },
    {
      q: "Kurs raqamlari: 25% odam ovoz klonlashga duch keladi, ulardan 70% i uni ajrata olmaydi. Oilaviy parol so'zi 90% samarali bo'lsa, himoyasiz ulush qancha bo'ladi?",
      type: "single",
      options: [
        "17.5% dan 8.75% ga",
        "25% dan 2.5% ga",
        "70% dan 7% ga",
        "17.5% dan 1.75% ga"
      ],
      answer: [3],
      explain: "0.25 × 0.70 = 17.5% (har 6 kishidan 1 tasi). 90% samarali parol so'zi buni 1.75% gacha tushiradi. 8.75% — 50% samaradorlikdagi natija.",
      lesson: { title: "AI chiqishlaridan mas'uliyatli foydalanish", href: "03-Responsible-Use.md" }
    },
    {
      q: "Qaysi savollar darsdagi \"to'g'ri savol\" ustuniga kiradi, ya'ni AI sifatiga bog'liq emas? (bir nechta javob)",
      type: "multi",
      options: [
        "Bu da'vo to'g'rimi?",
        "Buni AI yozganmi?",
        "Parol so'zini biladimi?",
        "Bu ovoz haqiqiymi?",
        "Manbasi bormi?"
      ],
      answer: [0, 2, 4],
      explain: "\"AI yozganmi?\" va \"ovoz haqiqiymi?\" — noto'g'ri savollar, chunki ularga javob detektor sifatiga bog'liq. O'ng ustundagi savollar yaxshiroq detektor kutmaydi.",
      lesson: { title: "AI chiqishlaridan mas'uliyatli foydalanish", href: "03-Responsible-Use.md" }
    },
    {
      q: "Talaba insho yozishda AI dan foydalandi va buni aytish kerakmi, deb ikkilanyapti. Darsdagi \"shaffoflik sinovi\" nima deydi?",
      type: "single",
      options: [
        "Agar matnning yarmidan ko'pini AI yozgan bo'lsa, aytish shart",
        "Agar AI ishlatganini aytsa natija o'zgarsa — aytishi shart",
        "Agar detektor AI ni topa olmasa, aytishning hojati yo'q",
        "Har qanday holatda AI ishlatish taqiqlangan, aytish ham yordam bermaydi"
      ],
      answer: [1],
      explain: "Sinov savoli: \"AI ishlatganimni aytsam, natija o'zgaradimi?\" Yo'q bo'lsa — ayting va davom eting, ha bo'lsa — aytish shart. U \"qancha AI ko'p\" degan javobsiz savolni chetlab o'tadi.",
      lesson: { title: "AI chiqishlaridan mas'uliyatli foydalanish", href: "03-Responsible-Use.md" }
    }
  ]
};
