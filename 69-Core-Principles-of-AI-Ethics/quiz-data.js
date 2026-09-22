window.QUIZ = {
  id: "69",
  title: "AI etikasining asosiy prinsiplari",
  subtitle: "Maxfiylik, shaffoflik, javobgarlik va adolat: PII, saqlash siyosati, RACI, adolat metrikalari va bias auditi",
  next: { label: "Etik ma'lumot to'plash", href: "../70-Ethical-Data-Collection/README.md" },
  questions: [
    {
      q: "Meta 2007-yildan beri ulashilgan postlarni AI o'qitish uchun ishlatganini oshkor qildi. Darsga ko'ra bu ishda qaysi muammolar bir vaqtda bor? (bir nechta javob)",
      type: "multi",
      options: [
        "Vaqt — 2007-yilda post yozilganda AI hali yo'q edi",
        "Xabardorlik — foydalanuvchilar bundan bilmasdi",
        "Mintaqaviy tengsizlik — EU da opt-out bor, AQSh da yo'q",
        "Manba — postlar asosan soxta akkauntlardan yig'ilgan",
        "Til — model faqat ingliz tilidagi postlarda o'qitilgan"
      ],
      answer: [0, 1, 2],
      explain: "Darsda aynan uchta muammo sanaladi: vaqt, xabardorlik va mintaqaviy tengsizlik — bir xil kompaniya va ma'lumot, lekin turli huquqlar.",
      lesson: { title: "Maxfiylik", href: "01-Privacy.md" }
    },
    {
      q: "Foydalanuvchi model o'qitilgandan keyin o'z postini o'chirdi. Bu model ichidagi ma'lumotni ham o'chiradimi?",
      type: "single",
      options: [
        "Ha, post o'chirilishi bilan model uni keyingi so'rovdayoq unutadi",
        "Ha, lekin faqat EU foydalanuvchilari uchun, GDPR talabi bilan",
        "Yo'q, model mazmunni saqlab qolishi mumkin; qayta o'qitish kerak",
        "Yo'q, lekin buni model vaznlaridan bitta qatorni o'chirib hal qilish mumkin"
      ],
      answer: [2],
      explain: "Modeldan ma'lumotni o'chirish (machine unlearning) — ochiq ilmiy muammo. Amalda buning uchun modelni qayta o'qitish kerak bo'ladi.",
      lesson: { title: "Maxfiylik", href: "01-Privacy.md" }
    },
    {
      q: "Regex asosidagi PII detektori email, telefon, IP va profil havolasini topdi. Darsga ko'ra u nimani topa olmadi va eng xavflisi qaysi?",
      type: "single",
      options: [
        "Karta raqamini; eng xavflisi — bo'shliq bilan yozilgan 16 xonali raqamlar",
        "Ism-familiyani; eng xavflisi — \"yosh + shahar + kasb\" kabi kombinatsiya",
        "Email manzilini; eng xavflisi — yashirilgan yoki qisqartirilgan domenlar",
        "Pasport raqamini; eng xavflisi — kichik harf bilan yozilgan seriyalar"
      ],
      answer: [1],
      explain: "\"Aziz Karimov\" matnda qoldi — ismni regex bilan topib bo'lmaydi. Alohida PII bo'lmagan belgilar birgalikda odamni aniqlaydi; bu k-anonimlik muammosi.",
      lesson: { title: "Maxfiylik", href: "01-Privacy.md" }
    },
    {
      q: "Saqlash siyosati kodi nima chiqaradi?",
      code: "s = MaxfiylikSiyosati(date(2026, 8, 27))\n# MUDDATLAR: javob_matni=30, ball=365,\n#            audit_logi=730, shaxsiy_malumot=0\nok, sabab = s.saqlanadimi(\"video\", date(2026, 8, 26))\nprint(ok, sabab)",
      type: "single",
      options: [
        "True ✅ saqlanadi (29 kun qoldi)",
        "False 💥 bu tur UMUMAN saqlanmaydi",
        "False 🗑 muddati o'tdi: 1/0 kun",
        "False 💥 noma'lum tur: video"
      ],
      answer: [3],
      explain: "\"video\" MUDDATLAR ro'yxatida yo'q, shuning uchun u birinchi tekshiruvdayoq rad etiladi. Bu \"default deny\" naqshi: ruxsat berilmagan hamma narsa taqiqlangan.",
      lesson: { title: "Maxfiylik", href: "01-Privacy.md" }
    },
    {
      q: "DeepMind va NHS ishidan darsda qanday asosiy saboq chiqariladi?",
      type: "single",
      options: [
        "Yaxshi maqsad yomon jarayonni oqlamaydi",
        "Tibbiy AI umuman ishlab chiqilmasligi kerak",
        "Sog'liq ma'lumoti faqat davlat kompaniyalariga berilishi kerak",
        "Buyrak shikastlanishini AI aniqlay olmaydi"
      ],
      answer: [0],
      explain: "Maqsad — buyrak shikastlanishini aniqlash — yaxshi edi, lekin 1.6 mln bemor ma'lumoti aniq rozilliksiz va yetarli shaffofliksiz uzatildi; ICO buni qonun buzilishi deb topdi.",
      lesson: { title: "Shaffoflik", href: "02-Transparency.md" }
    },
    {
      q: "O'qilish metrikasida tipik maxfiylik siyosati −29.1 ball, sodda variant 86.2 ball oldi. Bu farqning asosiy sababi nima?",
      type: "single",
      options: [
        "Sodda variantda mazmun ancha kam, shartlar esa noaniqroq",
        "Tipik siyosatda yuridik atamalar noto'g'ri va chalkash yozilgan",
        "Jumla uzunligi: tipikda 57 so'z, soddasida o'rtacha 8.5 so'z",
        "Metrika faqat o'zbek tilidagi matnlar uchun mo'ljallangan"
      ],
      answer: [2],
      explain: "Jumla uzunligi — universal signal. Mazmun deyarli bir xil, sodda variant hatto aniqroq (\"30 kun\", model o'qitish uchun emas). Metrika esa ingliz tili uchun mo'ljallangan.",
      lesson: { title: "Shaffoflik", href: "02-Transparency.md" }
    },
    {
      q: "Shaffoflik auditi natijasi qanday?",
      code: "MAJBURIY = {\n    \"past xavf\":   [1, 2, 3],\n    \"o'rta xavf\":  [1, 2, 3, 4],\n    \"yuqori xavf\": [1, 2, 3, 4, 5],\n}\nkerak = MAJBURIY[\"o'rta xavf\"]\nmavjud = [1, 2, 5]\nyo_q = [d for d in kerak if d not in mavjud]\nprint((len(kerak) - len(yo_q)) / len(kerak) * 100, yo_q)",
      type: "single",
      options: [
        "75.0 [4]",
        "50.0 [3, 4]",
        "60.0 [3, 4]",
        "40.0 [3, 4, 5]"
      ],
      answer: [1],
      explain: "O'rta xavf uchun [1, 2, 3, 4] kerak; 3 va 4 yo'q. (4 − 2) / 4 × 100 = 50.0. Mavjud 5-daraja hisobga kirmaydi, chunki u o'rta xavf uchun talab qilinmaydi.",
      lesson: { title: "Shaffoflik", href: "02-Transparency.md" }
    },
    {
      q: "Uber avtonom avtomobili 2018-yilda piyodani o'ldirdi. Uchta xatodan qaysi biri texnik emas, balki biznes qarori edi?",
      type: "single",
      options: [
        "AI piyodani to'g'ri tasniflay olmagani",
        "Tejash uchun sensorlar soni kamaytirilgani",
        "Xavfsizlik haydovchisi yo'lga e'tiborsiz bo'lgani",
        "Sinovlar ochiq yo'lda, Arizonada o'tkazilgani"
      ],
      answer: [1],
      explain: "Sensorlarni kamaytirish — menejment qarori. Qolgan ikki xato ishlab chiquvchi va operatorga tegishli; har biri alohida \"men emas\" deyishi mumkin edi.",
      lesson: { title: "Javobgarlik", href: "03-Accountability.md" }
    },
    {
      q: "Javobgarlik matritsasi bilan bu kod nima qiladi?",
      code: "j = Javobgarlik()\ntry:\n    j.qosh(\"ma'lumot sizib chiqdi\",\n           **{\"ishlab chiquvchi\": \"R\", \"operator\": \"C\"})\n    print(j.kim_javob_beradi(\"ma'lumot sizib chiqdi\"))\nexcept ValueError as e:\n    print(e)",
      type: "single",
      options: [
        "💥 'ma'lumot sizib chiqdi': aynan BITTA 'A' bo'lishi kerak, 2 ta topildi",
        "💥 'ma'lumot sizib chiqdi': 'C' roli faqat 'A' bilan birga bo'lishi mumkin",
        "💥 'ma'lumot sizib chiqdi': aynan BITTA 'A' bo'lishi kerak, 0 ta topildi",
        "💥 hodisa ro'yxatda yo'q — JAVOBGAR BELGILANMAGAN"
      ],
      answer: [2],
      explain: "qosh() A rolini sanaydi: bu yerda \"A\" umuman yo'q, len(a) = 0 ≠ 1, shuning uchun ValueError ko'tariladi va qo'shilish bajarilmaydi. \"R\" javob beruvchi emas, faqat bajaruvchi.",
      lesson: { title: "Javobgarlik", href: "03-Accountability.md" }
    },
    {
      q: "Hodisa jurnalida LLM ballni 8 dedi, kod esa uni rad etib 5 ga tushirdi. Jurnaldagi manba ustuni javobgarlik uchun nima beradi?",
      type: "single",
      options: [
        "Qaror qayerdan kelganini: kod, LLM yoki MB — xato kimniki ekanini",
        "Faqat hodisa vaqtini — qaysi soatda xato bo'lganini aniqlash uchun",
        "LLM chaqiruvlari narxini — qaysi qaror qimmatga tushganini bilish uchun",
        "Foydalanuvchi qaysi qurilma va IP manzildan kirganini ko'rsatadi"
      ],
      answer: [0],
      explain: "manba ustuni qarorning manbasini yozadi va nima bo'lganini qayta tiklash imkonini beradi. Bu yozuvsiz kod LLM ballini rad etganini hech qachon bilmasdingiz.",
      lesson: { title: "Javobgarlik", href: "03-Accountability.md" }
    },
    {
      q: "COMPAS bahsida kompaniya PPV tengligini, jurnalistlar esa FPR tengsizligini ko'rsatdi. Darsga ko'ra kim haq edi?",
      type: "single",
      options: [
        "Faqat kompaniya, chunki PPV farqi atigi 0.029 — chegaradan past",
        "Faqat jurnalistlar, chunki PPV umuman adolat metrikasi emas",
        "Hech kim, chunki ma'lumot sun'iy va namunalar juda kam edi",
        "Ikkalasi ham haq — ular turli adolat ta'riflarini ishlatgan"
      ],
      answer: [3],
      explain: "PPV farqi 0.029 (o'tdi), FPR farqi 0.156 (buzildi). Shuning uchun \"model adolatli\" degan gap qaysi ta'rif ekani aytilmasa ma'nosiz.",
      lesson: { title: "Adolat", href: "04-Fairness.md" }
    },
    {
      q: "80% qoidasi (disparate impact) bo'yicha nima chiqadi?",
      code: "ulush_A = 0.459   # guruh A: 'yuqori xavf' ulushi\nulush_B = 0.628   # guruh B: 'yuqori xavf' ulushi\nnisbat = min(ulush_A, ulush_B) / max(ulush_A, ulush_B)\nprint(round(nisbat, 3), \"O'TDI\" if nisbat >= 0.80 else \"YIQILDI\")",
      type: "single",
      options: [
        "0.731 YIQILDI",
        "1.368 O'TDI",
        "0.831 O'TDI",
        "0.169 YIQILDI"
      ],
      answer: [0],
      explain: "0.459 / 0.628 ≈ 0.731, bu 0.80 dan kam — kamsitish belgisi. Teskari nisbat 1.37 ga teng: guruh B 1.37 marta ko'proq \"yuqori xavf\" deb belgilangan.",
      lesson: { title: "Adolat", href: "04-Fairness.md" }
    },
    {
      q: "Mukammal, biassiz model (ehtimolni to'g'ri biladi, ikkala guruhga bir xil chegara) baza darajasi 20% va 50% bo'lgan guruhlarda demografik tenglik va tenglashtirilgan ehtimolni buzdi. Bunga nima sabab?",
      type: "single",
      options: [
        "Modelda o'qitish ma'lumotidan kelgan yashirin bias bor edi",
        "Chegara 0.5 noto'g'ri tanlangan — 0.3 bo'lishi kerak edi",
        "Guruhlarda baza darajasi har xil — impossibility theorem",
        "Namunalar soni 20 000 ta bo'lgani uchun juda kam"
      ],
      answer: [2],
      explain: "Kleinberg va Chouldechova natijasi: baza darajalari har xil bo'lsa, bashorat tengligi va tenglashtirilgan ehtimol bir vaqtda bajarila olmaydi. Sabab — bias emas, baza darajasi.",
      lesson: { title: "Adolat", href: "04-Fairness.md" }
    },
    {
      q: "Intervyu vositasi sakkiz demografik guruhda bir xil javobga hammasi 7.00 ball berdi, farq 0.00. Bu natija ilovaning adolatli ekanini isbotlaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Nazorat sinovida Toshkentdagi ob-havo haqidagi javob 8, mukammal texnik javob 7 oldi. Tizim umuman ajrata olmaydi, shuning uchun \"bias topilmadi\" xulosasi hech narsani anglatmaydi.",
      lesson: { title: "Adolat", href: "04-Fairness.md" }
    },
    {
      q: "Siz yollash modelida bias auditini boshlayapsiz. Darsga ko'ra birinchi qadam va to'g'ri talqin qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Avval audit farqni seza olishini sifati turlicha javoblar bilan tekshirish",
        "\"Farq yo'q\" chiqsa, darhol modelni adolatli deb e'lon qilib, auditni yopish",
        "\"Model adolatli\" deganda qaysi adolat ta'rifi nazarda tutilganini aytish",
        "Faqat bitta metrika — aniqlikni guruhlar bo'yicha solishtirish yetarli deb bilish",
        "Adolat faqat kamsitmaslik emas, hamma uchun to'g'ri baholash ekanini hisobga olish"
      ],
      answer: [0, 2, 4],
      explain: "Sezgirlik nazorati har qanday bias auditida birinchi qadam. Adolatning bir nechta ta'rifi bor va ular bir vaqtda bajarilmasligi mumkin; kurs adolatni \"hamma uchun yaxshi ishlash\" deb ham ta'riflaydi.",
      lesson: { title: "Adolat", href: "04-Fairness.md" }
    }
  ]
};
