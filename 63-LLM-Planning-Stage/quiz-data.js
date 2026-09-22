window.QUIZ = {
  id: "63",
  title: "LLM Engineering — rejalashtirish bosqichi",
  subtitle: "Hosting vs API, model xotirasi, tokenlar va narx, tizim prompti, JSON baholash, MB sxemasi va faoliyat diagrammalari",
  next: { label: "AI promptlarini yaratish va sinash", href: "../64-Crafting-and-Testing-Prompts/README.md" },
  questions: [
    {
      q: "Darsdagi qaror funksiyasining soddalashtirilgan varianti. Kod nimani chiqaradi?",
      code: "def qaysi_yol(sorov_kuniga, nozik_malumot=False, internet=True, byudjet_oylik=None):\n    if not internet:\n        return \"mahalliy\"\n    if nozik_malumot:\n        return \"hosting\"\n    if sorov_kuniga > 147_000:\n        return \"hosting\"\n    narx = sorov_kuniga * 30 * 0.001650\n    if byudjet_oylik is not None and narx > byudjet_oylik:\n        return \"mahalliy\"\n    return \"api\"\nprint(qaysi_yol(5000, byudjet_oylik=100))",
      type: "single",
      options: ["api", "hosting", "mahalliy", "None"],
      answer: [2],
      explain: "5 000 so'rov teng nuqtadan ancha past, lekin oylik narx 5000 × 30 × 0.00165 = $247.50 — $100 byudjetdan oshadi, shuning uchun \"mahalliy\". Trafik kam, lekin byudjet ham kam — eng ko'p uchraydigan vaziyat.",
      lesson: { title: "LLM ni hosting qilish vs API ishlatish", href: "01-Hosting-vs-API.md" }
    },
    {
      q: "gpt-4o-mini uchun teng nuqta sekundiga ~1.7 so'rov chiqdi. Nega bu raqam hostingni real hayotdagidan arzonroq ko'rsatib, aldashi mumkin?",
      type: "single",
      options: [
        "Chunki API narxi so'rovlar ko'paygan sari avtomatik ravishda oshib boradi va chegirma yo'qoladi",
        "Chunki GPU 24/7 ishlaydi va so'rov bo'lmasa ham to'lanadi, trafik esa notekis",
        "Chunki hostingda model yangilanishi avtomatik va bepul bo'ladi",
        "Chunki teng nuqta faqat gpt-4o uchun to'g'ri, mini modelga tegishli emas"
      ],
      answer: [1],
      explain: "API so'rov bo'yicha to'lanadi — nol trafik nol narx. GPU esa doim ishlaydi, cho'qqi uchun zaxira ham kerak, model yangilanishi esa API da avtomatik. Hisobga DevOps, saqlash va tarmoq ham kirmagan.",
      lesson: { title: "LLM ni hosting qilish vs API ishlatish", href: "01-Hosting-vs-API.md" }
    },
    {
      q: "Darsga ko'ra model parametrlari soni qaysi narsalarni to'g'ridan-to'g'ri bashorat qiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Modelni yuklash uchun kerakli xotira",
        "Sizning aniq vazifangizdagi javob sifati",
        "Kechikish",
        "Hosting narxi",
        "Tijorat litsenziyasining turi"
      ],
      answer: [0, 2, 3],
      explain: "Xotira, kechikish va hosting narxi parametrlarga to'g'ridan-to'g'ri bog'liq. Vazifangizdagi sifat esa kafolatlanmaydi: whisper tiny, base va small 6.4× parametr farqi bilan bir xil WER berdi. Litsenziya model egasiga bog'liq.",
      lesson: { title: "Ochiq vs yopiq kodli modellar", href: "02-Open-vs-Closed-Source.md" }
    },
    {
      q: "Siz 1000 belgilik JSON promptni \"1 token ≈ 4 belgi\" qoidasi bilan 250 token deb rejalashtirdingiz. Darsdagi o'lchovlarga ko'ra nima bo'ladi?",
      type: "single",
      options: [
        "Taxmin deyarli aniq chiqadi, chunki qoida barcha matn turlari uchun tekshirilgan",
        "Haqiqiy token soni kamroq bo'ladi, chunki JSON belgilari yopishib kodlanadi",
        "Faqat eski cl100k tokenizatorda farq chiqadi, o200k da qoida aniq ishlaydi",
        "Haqiqatda ~403 token — byudjetdan 61% ko'p, chunki JSON da ~2.5 belgi/token"
      ],
      answer: [3],
      explain: "URL/JSON 2.48 belgi/token bilan kodlanadi, shuning uchun 1000 belgi ~403 token bo'ladi. Oddiy nasrda esa aksincha 6.72 belgi/token (~149 token). Qoida GPT-3 davridagi ~50 000 tokenli lug'atdan qolgan — taxmin qilmang, tiktoken bilan sanang.",
      lesson: { title: "Tokenlar", href: "03-Tokens.md" }
    },
    {
      q: "Chat formatidagi qo'shimcha tokenlarni hisoblash (bu yerda soddalik uchun token = so'z). Kod nechani chiqaradi?",
      code: "def sana(matn):\n    return len(matn.split())\ndef xabarlar(msgs, tok_per_msg=3):\n    jami = 0\n    for m in msgs:\n        jami += tok_per_msg\n        for k, v in m.items():\n            jami += sana(str(v))\n    return jami + 3\nprint(xabarlar([{\"role\": \"system\", \"content\": \"You are an HR interviewer.\"},\n                {\"role\": \"user\", \"content\": \"Hello\"}]))",
      type: "single",
      options: ["6", "14", "11", "17"],
      answer: [3],
      explain: "Har xabarga 3 ta qo'shimcha: 1-xabar 3 + \"system\" (1) + 5 so'z = 9, 2-xabar 3 + \"user\" (1) + 1 = 5, jami 14, javob boshlanishi uchun yana +3 = 17. Sof matn atigi 6 — qisqa xabarlarda slujebniy tokenlar juda sezilarli.",
      lesson: { title: "Tokenlar", href: "03-Tokens.md" }
    },
    {
      q: "Kurs narx hisobida eslatmagan, lekin real byudjetga ta'sir qiladigan xarajatlar qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Xato sabab qayta urinishlar — ikki marta to'lov",
        "Streaming uzilib qolsa, token uchun to'lov olinmasligi",
        "Model noto'g'ri format berganda qayta so'rash",
        "Har bir prompt sinovi va prompt injection testlari",
        "Kirish tokenlarining chiqishdan qimmatroq bo'lishi"
      ],
      answer: [0, 2, 3],
      explain: "Qayta urinishlar, muvaffaqiyatsiz javoblar va testlar ham pul turadi. Streaming uzilsa ham to'lanadi, chiqish esa kirishdan qimmat (gpt-4o-mini da 4×). Amaliy qoida: hisoblangan narxni 1.5–2× ga ko'paytiring.",
      lesson: { title: "Narx: hosting vs token bo'yicha to'lov", href: "04-Pricing.md" }
    },
    {
      q: "Byudjet nazoratida bitta so'rov chegarasi $0.01 qilib qo'yilgan. 60 000 kirish tokenli so'rov bilan kod nimani chiqaradi?",
      code: "NARX = {\"gpt-4o-mini\": (0.150, 0.600)}\n\ndef narx(kir, chiq, model=\"gpt-4o-mini\"):\n    ki, ch = NARX[model]\n    return (kir * ki + chiq * ch) / 1e6\n\nn = narx(60000, 500)\nprint(\"rad\" if n > 0.01 else \"ruxsat\", round(n, 4))",
      type: "single",
      options: ["rad 0.0093", "ruxsat 0.0093", "rad 0.093", "ruxsat 0.093"],
      answer: [1],
      explain: "(60000 × 0.15 + 500 × 0.6) / 1e6 = 0.0093 — chegaradan past, so'rov o'tib ketadi va kunlik byudjetning katta qismini yeydi. Dars: chegarani model narxiga qarab qo'ying; gpt-4o-mini uchun $0.01 deyarli cheksiz.",
      lesson: { title: "Narx: hosting vs token bo'yicha to'lov", href: "04-Pricing.md" }
    },
    {
      q: "Kursning tizim prompti rol, kontekst va vazifani o'z ichiga oladi. Beshta qism nuqtai nazaridan unda nima butunlay yo'q va bu nimaga olib keladi?",
      type: "single",
      options: [
        "Format — javob istalgan ko'rinishda keladi, uni parse qilib bo'lmaydi",
        "Rol — model o'zini kim deb bilishini tushunmaydi va umumiy javob beradi",
        "Kontekst — model lavozim va kompaniyani bilmaydi va savollar umumiy bo'ladi",
        "Vazifa — model nechta savol berishni bilmaydi va intervyu tugamaydi"
      ],
      answer: [0],
      explain: "Rol (\"HR interviewer\"), kontekst ({position}, {company}) va vazifa (6 savol) bor, cheklov qisman, format esa umuman yo'q. Natijada ba'zan izohli, ba'zan raqamlangan javob keladi — parse qilib bo'lmaydi.",
      lesson: { title: "Boshlang'ich prompt ishlab chiqish — 1-qism", href: "05-Initial-Prompt-Development-1.md" }
    },
    {
      q: "Baholashni intervyu promptining o'zida emas, suhbatdan keyin alohida ikkinchi so'rov bilan qilish tanlandi. Darsdagi o'lchov bu tanlovni qanday asoslaydi?",
      type: "single",
      options: [
        "Ikkinchi so'rov arzonroq, chunki suhbat tarixi qayta yuborilmaydi",
        "Ikkinchi so'rov ikki baravar qimmat, lekin baholash natijasi foydalanuvchiga tezroq chiqadi",
        "Atigi 14.2% qimmat, lekin model 6 navbat davomida ko'rsatmani eslashi shart emas",
        "Ikkala usul narxi va ishonchliligi bir xil, farq faqat kodning uzunligida"
      ],
      answer: [2],
      explain: "10 000 suhbat uchun $15.61 vs $13.67 — 14.2% qimmat. Evaziga ishonchlilik oshadi va baholash promptini intervyu promptiga tegmasdan alohida sinash mumkin.",
      lesson: { title: "Boshlang'ich prompt ishlab chiqish — 2-qism", href: "06-Initial-Prompt-Development-2.md" }
    },
    {
      q: "baho_tekshir() ning soddalashtirilgan qismi. Kod nimani chiqaradi?",
      code: "d = {\"overall_score\": 7, \"improvements\": [\"I should ask more\"]}\nxato = []\ns = d.get(\"overall_score\")\nif not isinstance(s, int) or not 1 <= s <= 10:\n    xato.append(\"score\")\nv = d.get(\"improvements\")\nif len(v) < 2:\n    xato.append(\"kam\")\nelif any(str(x).lower().startswith((\"i \", \"i'\")) for x in v):\n    xato.append(\"rol\")\nprint(xato)",
      type: "single",
      options: ["[]", "['kam', 'rol']", "['kam']", "['score', 'kam']"],
      answer: [2],
      explain: "Ball 7 diapazonda, shuning uchun \"score\" qo'shilmaydi. Ro'yxatda 1 ta element bor — \"kam\" qo'shiladi, elif esa endi tekshirilmaydi, shuning uchun \"I ...\" bilan boshlanishi sezilmay qoladi. Bu JSON sintaktik to'g'ri bo'lsa ham mazmunni tekshirish kerakligini ko'rsatadi.",
      lesson: { title: "Boshlang'ich prompt ishlab chiqish — 2-qism", href: "06-Initial-Prompt-Development-2.md" }
    },
    {
      q: "Dasturchi SQLite bazaga ulanib, avval bitta INSERT bajardi, keyin PRAGMA foreign_keys = ON qo'ydi. Shundan so'ng mavjud bo'lmagan question_id = 999 bilan yozuv kiritdi. Nima bo'ladi?",
      type: "single",
      options: [
        "IntegrityError chiqadi, chunki tashqi kalit tekshiruvi yoqilgan",
        "PRAGMA bajarilayotganda xato chiqadi va dasturchi muammoni darrov ko'radi",
        "SQLite avtomatik ravishda 999 raqamli savolni questions jadvaliga qo'shadi",
        "Yozuv bemalol kiradi — PRAGMA tranzaksiya ichida jimgina e'tiborsiz qoldi"
      ],
      answer: [3],
      explain: "INSERT tranzaksiyani ochadi, undan keyingi PRAGMA foreign_keys hech qanday xatosiz e'tiborsiz qoladi (qiymati 0). To'g'ri usul — ulanish funksiyasida PRAGMA ni birinchi qator qilib qo'yish.",
      lesson: { title: "Ma'lumotlar bazasi va sxema dizayni", href: "07-Database-Design.md" }
    },
    {
      q: "SQLite da PRAGMA foreign_keys = ON ni bir marta yoqsangiz, bu sozlama bazada saqlanadi va keyingi yangi ulanishlarda ham amal qiladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "SQLite da tashqi kalitlar standart holda o'chiq va sozlama saqlanmaydi — har bir yangi ulanishda qayta yoqish kerak. Shuning uchun sqlite3.connect() ni to'g'ridan-to'g'ri emas, ulanish funksiyasi orqali chaqirish tavsiya etiladi.",
      lesson: { title: "Ma'lumotlar bazasi va sxema dizayni", href: "07-Database-Design.md" }
    },
    {
      q: "Diagrammada bitta qaror (D: Ha/Yo'q) va bitta tsikl (I → H) bor. yollarni_sana(..., max_tsikl=1) nechta yo'l qaytaradi va nega?",
      type: "single",
      options: [
        "4 ta — tsikl bir marta aylanadi, qaror esa har bir yo'lni yana ikkiga bo'ladi",
        "2 ta — har bir tugunga faqat bir marta kiriladi, tsikl umuman aylanmaydi",
        "6 ta — har bir daraja (qaror va tsikl) yo'llar soniga 2 tadan qo'shadi",
        "Cheksiz — tsikl bo'lgani uchun yo'llarni max_tsikl bilan ham sanab bo'lmaydi"
      ],
      answer: [1],
      explain: "max_tsikl=1 \"har bir tugunga bir marta kirish\" degani, shuning uchun faqat qarorning ikki shoxi qoladi — 2 yo'l. Tsikl bir marta aylanishi uchun max_tsikl=2 kerak (4 yo'l = 4 ta test).",
      lesson: { title: "Faoliyat diagrammasi nima?", href: "08-What-Is-an-Activity-Diagram.md" }
    },
    {
      q: "Diagrammadagi \"Format to'g'rimi? → Yo'q → Baholash so'rovi\" tsiklida qanday xavf bor va darsdagi tuzatish qaysi?",
      type: "single",
      options: [
        "Ilova abadiy aylanishi mumkin; urinishlarni (< 3) cheklab, zaxira yo'l qo'shish kerak",
        "Tsikl diagrammada ortiqcha; format xatosi bo'lsa, ilovani darhol to'xtatish kerak",
        "Xavf yo'q, chunki qayta so'rovlar bepul hisoblanadi; faqat foydalanuvchi kutish vaqtini oshirish kerak",
        "Model har safar bir xil xato qiladi; shuning uchun temperature ni oshirib, har gal boshqa javob olish kerak"
      ],
      answer: [0],
      explain: "Chiqish sharti yo'q tsikl har aylanishda pul turadi (~4 964 kirish + 1 360 chiqish token). Tuzatish: urinish hisoblagichi va zaxira — erkin matnni ko'rsatish.",
      lesson: { title: "Faoliyat diagrammasini yaratish", href: "09-Creating-an-Activity-Diagram.md" }
    },
    {
      q: "Yakuniy reja hisobotida teng nuqta 230 681 suhbat/kun chiqdi, 1-darsda esa ~147 000 so'rov/kun edi. Bu farqning asosiy sababi nima?",
      type: "single",
      options: [
        "1-darsda gpt-4o, yakuniy hisobotda esa ancha arzonroq gpt-4o-mini modeli ishlatilgani uchun",
        "Yakuniy hisobotda GPU hosting narxi umuman hisobga olinmagani va nolga tenglashtirilgani uchun",
        "Birlik boshqa: 6 navbatli suhbat (4 964 + 1 360 token) vs bitta so'rov (3 000 + 2 000)",
        "1-darsdagi hisobda arifmetik xato bo'lgani uchun"
      ],
      answer: [2],
      explain: "Ikkala hisobda ham gpt-4o-mini, lekin bitta birlikning token tarkibi boshqa, hosting ham 6 × A100 ($2 520/hafta) bilan tuzatilgan. Xulosa: teng nuqta suhbat shakliga bog'liq.",
      lesson: { title: "Rejalashtirish bosqichini yakunlash", href: "10-Concluding-the-Planning-Stage.md" }
    }
  ]
};
