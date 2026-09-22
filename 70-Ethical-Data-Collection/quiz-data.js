window.QUIZ = {
  id: "70",
  title: "Etik ma'lumot to'plash",
  subtitle: "Manba jurnali, xususiy, ommaviy va skreyp qilingan ma'lumot, k-anonimlik va vakillik auditi",
  next: { label: "Etik AI ishlab chiqish", href: "../71-Ethical-AI-Development/README.md" },
  questions: [
    {
      q: "GPT-3 va Gemini o'qitilgan Common Crawl to'plami darsda qaysi muammolar bilan tavsiflanadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Sifat shubhali — soxta yangiliklar, fitna nazariyalari va irqchilik bor",
        "Litsenziya noma'lum",
        "Rozilik olinmagan",
        "Hajmi juda kichik — atigi bir necha ming sahifa",
        "Faqat pullik obuna orqali olinadi"
      ],
      answer: [0, 1, 2],
      explain: "Common Crawl bepul va milliardlab sahifadan iborat, lekin sifati shubhali, litsenziyasi noaniq va rozilik yo'q. Demak bu muammo eng katta modellarda ham bor.",
      lesson: { title: "Etik manbadan olish va ma'lumot turlari", href: "01-Ethical-Sourcing.md" }
    },
    {
      q: "Manba jurnali bu yozuvga qanday baho beradi?",
      code: "m = Manba(\"Blog skreypi\", \"skreyp\", \"CC-BY\",\n          date(2024, 6, 1), \"nazarda tutilgan\")\nfor b in m.etik_baho():\n    print(b)",
      type: "single",
      options: [
        "⚠️ rozilik faqat nazarda tutilgan\n💥 litsenziya noma'lum",
        "⚠️ rozilik faqat nazarda tutilgan\n⚠️ robots.txt tekshirilmagan",
        "💥 rozilik yo'q\n⚠️ robots.txt tekshirilmagan",
        "⚠️ rozilik faqat nazarda tutilgan\n💥 litsenziya noma'lum\n⚠️ robots.txt tekshirilmagan"
      ],
      answer: [1],
      explain: "Rozilik \"nazarda tutilgan\" — ogohlantirish. Litsenziya CC-BY, muammo emas. Tur \"skreyp\" va izohda \"robots\" yo'q, shuning uchun robots.txt ogohlantirishi ham qo'shiladi.",
      lesson: { title: "Etik manbadan olish va ma'lumot turlari", href: "01-Ethical-Sourcing.md" }
    },
    {
      q: "RBS banki mijozga ikkita sayohat sug'urtasi to'layotganini aytdi. Dars bu holatdan qanday xulosa chiqaradi?",
      type: "single",
      options: [
        "Etik qaror har doim daromadni oshiradi, shuning uchun uni o'ylamasdan qabul qilish kerak",
        "Bank mijoz ma'lumotini uchinchi tomon bilan ruxsatsiz bo'lishgani uchun jarima oldi",
        "Mijozlar bank sug'urtasini bekor qildi va bank zarar ko'rdi",
        "Bu safar to'g'ri ish foydali ham chiqdi, lekin ko'pincha etik qaror pul turadi"
      ],
      answer: [3],
      explain: "Mijozlar uchinchi tomon sug'urtasini bekor qildi, ishonch va sodiqlik oshdi. Lekin dars ogohlantiradi: bu kam uchraydigan holat, shuning uchun etika avtomatik natija emas, qaror.",
      lesson: { title: "Xususiy ma'lumot", href: "02-Proprietary-Data.md" }
    },
    {
      q: "Kirish nazorati kodi nima chiqaradi?",
      code: "# ROLLAR: tahlilchi=ICHKI(1), hr=MAXFIY(2), admin=JUDA_MAXFIY(3)\n# MAYDONLAR: ball=ICHKI, ism=MAXFIY, email=JUDA_MAXFIY\nYOZUV = {\"ism\": \"Aziz Karimov\", \"email\": \"a@example.com\", \"ball\": 7}\nprint(yozuv_filtr(\"hr\", YOZUV))",
      type: "single",
      options: [
        "{'ism': 'Aziz Karimov', 'email': 'a@example.com', 'ball': 7}",
        "{'ism': '***', 'email': '***', 'ball': 7}",
        "{'ism': 'Aziz Karimov', 'email': '***', 'ball': 7}",
        "{'ism': '***', 'email': '***', 'ball': '***'}"
      ],
      answer: [2],
      explain: "hr rolining darajasi MAXFIY (2): ball (1) va ism (2) ko'rinadi, email esa JUDA_MAXFIY (3) — shuning uchun niqoblanadi.",
      lesson: { title: "Xususiy ma'lumot", href: "02-Proprietary-Data.md" }
    },
    {
      q: "Shahar trafik ma'lumotidagi GPS izlari shaxsiy ma'lumot emasdek ko'rinadi. Darsga ko'ra bu nima uchun maxfiylik muammosi bo'lishi mumkin?",
      type: "single",
      options: [
        "GPS izlari odam qayerda yashashini aytib, shaxsni aniqlashi mumkin",
        "GPS ma'lumoti har doim litsenziyasiz, ochiq holda tarqatiladi",
        "Trafik ma'lumoti faqat davlat ichki ishlatishi uchun yig'iladi",
        "GPS izlari juda katta hajmli bo'lgani uchun saqlash qimmat"
      ],
      answer: [0],
      explain: "Anonimlashtirilmagan geolokatsiya shaxsiy hayotni oshkor qiladi. Shuning uchun ma'lumot pasporti geo=True bo'lsa anonimlashtirishni shart qilib qo'yadi.",
      lesson: { title: "Ommaviy ma'lumot", href: "03-Public-Data.md" }
    },
    {
      q: "So'rovnomada 20–29 yoshlilarning 14.6% i, 60–69 yoshlilarning 51.5% i daromad savoliga javob bermadi. Model tayyorlashdan oldin shunchaki dropna() qilsangiz nima bo'ladi?",
      type: "single",
      options: [
        "Hech narsa o'zgarmaydi, chunki bo'sh qiymatlar tasodifiy taqsimlangan",
        "Keksalarning yarmiga yaqini yo'qoladi va model yoshlarga moslashadi",
        "Model aniqligi barcha yosh guruhlarida teng ravishda oshadi",
        "Faqat 20–29 yoshlilar guruhi to'plamdan butunlay chiqib ketadi"
      ],
      answer: [1],
      explain: "Bo'sh qiymatlar tasodifiy emas — yashirin bias manbai. Qoida: o'chirishdan oldin ular qaysi guruhda ko'pligini tekshiring.",
      lesson: { title: "Ommaviy ma'lumot", href: "03-Public-Data.md" }
    },
    {
      q: "Mumsnet OpenAI ni ToS va mualliflik huquqini buzgani uchun sudga berdi. Darsga ko'ra to'g'ri tartib qanday bo'lishi kerak edi?",
      type: "single",
      options: [
        "Avval skreyping, keyin litsenziya muzokarasi",
        "Avval sud qarori, keyin skreyping",
        "Avval litsenziya, keyin skreyping",
        "Skreypingdan keyin kontentni anonimlashtirish yetarli"
      ],
      answer: [2],
      explain: "OpenAI teskarisini qildi: skreyp qildi, keyin muzokara qildi va sudga tushdi. Muzokara skreypingdan oldin bo'lishi kerak edi.",
      lesson: { title: "Skreyp qilingan ma'lumot", href: "04-Web-Scraped-Data.md" }
    },
    {
      q: "robots.txt da MyBot uchun quyidagi qoidalar bor. mumkinmi(qoidalar, \"MyBot\", \"/public/jobs\") natijasi qanday?",
      code: "User-agent: MyBot\nAllow: /public/\nDisallow: /",
      type: "single",
      options: [
        "Taqiqlangan, chunki Disallow: / butun saytni to'liq yopadi",
        "Taqiqlangan, chunki Disallow har doim Allow dan ustun",
        "Ruxsat, chunki MyBot uchun alohida qoida umuman yo'q",
        "Ruxsat, chunki eng uzun mos qoida — Allow: /public/ — g'olib"
      ],
      answer: [3],
      explain: "Funksiya eng uzun mos keladigan qoidani tanlaydi: /public/ (8 belgi) / (1 belgi) dan uzun. /jobs yo'li uchun esa faqat Disallow: / mos keladi va u taqiqlanadi.",
      lesson: { title: "Skreyp qilingan ma'lumot", href: "04-Web-Scraped-Data.md" }
    },
    {
      q: "Litsenziya tekshiruvchisi nima qaytaradi?",
      code: "# (\"CC-BY-NC-SA\", \"tijorat\") juftligi MOSLIK jadvalida yo'q\nok, izoh = litsenziya_tekshir(\"CC-BY-NC-SA\", \"tijorat\")\nprint(ok, izoh)",
      type: "single",
      options: [
        "False 💥 NC = non-commercial",
        "True ⚠️ hosila asar ham SA bo'lishi kerak",
        "None ⚠️ qoida yo'q — yurist bilan maslahatlashing",
        "False 💥 litsenziya noma'lum -> DEFAULT DENY"
      ],
      answer: [0],
      explain: "Juftlik jadvalda yo'q va litsenziya noma'lum emas; keyingi tekshiruvda \"NC\" satr ichida bor va maqsad tijorat — shuning uchun non-commercial sababi bilan rad etiladi.",
      lesson: { title: "Skreyp qilingan ma'lumot", href: "04-Web-Scraped-Data.md" }
    },
    {
      q: "robots.txt texnik jihatdan majburiy emas, shuning uchun uni e'tiborsiz qoldirish etik yoki huquqiy jihatdan hech narsani anglatmaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Texnik majburiyat yo'q, lekin etik majburiyat bor. Sudda esa robots.txt ni buzish \"bilgan holda buzdi\" degan dalil bo'lib, niyatni ko'rsatadi.",
      lesson: { title: "Skreyp qilingan ma'lumot", href: "04-Web-Scraped-Data.md" }
    },
    {
      q: "200 nomzod to'plamidan ism o'chirildi, lekin yosh, shahar va lavozim qoldi. Natijada 159 tasi baribir aynan aniqlandi. Buning sababi nima?",
      type: "single",
      options: [
        "Ball ustuni shifrlanmay, ochiq matnda qolgani uchun",
        "Ism to'liq o'chirilmay, qisman qolib ketgani uchun",
        "To'plam GDPR talablariga to'liq javob bermagani uchun",
        "Yosh, shahar va lavozim birga kvazi-identifikator (k = 1)"
      ],
      answer: [3],
      explain: "Alohida hech biri PII emas, birgalikda esa shaxsni aniqlaydi. 159 ta yozuvning kombinatsiyasi to'plamda yagona edi.",
      lesson: { title: "Nozik va himoyalangan ma'lumot", href: "05-Sensitive-Information.md" }
    },
    {
      q: "Yoshni umumlashtirish funksiyasi nima chiqaradi?",
      code: "def yoshni_umumlashtir(y, qadam):\n    a = (y // qadam) * qadam\n    return f\"{a}-{a+qadam-1}\"\n\nprint(yoshni_umumlashtir(37, 10), yoshni_umumlashtir(44, 20))",
      type: "single",
      options: [
        "30-40 40-60",
        "30-39 40-59",
        "37-46 44-63",
        "30-39 20-39"
      ],
      answer: [1],
      explain: "37 // 10 * 10 = 30, oraliq 30-39. 44 // 20 * 20 = 40, oraliq 40-59. Oxirgi qiymat a + qadam − 1 bo'ladi.",
      lesson: { title: "Nozik va himoyalangan ma'lumot", href: "05-Sensitive-Information.md" }
    },
    {
      q: "Anonimlashtirish haqida darsdagi qaysi xulosalar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Anonimlik miqdor masalasi: 200 yozuvda 21.5%, 1000 yozuvda 99.2% saqlandi",
        "k ≥ 5 bajarilsa, guruhdagi nozik qiymat (masalan, ball) har doim yashirin qoladi",
        "k < 5 guruhlarni o'chirish ko'pincha ozchilik guruhlarni yo'qotadi",
        "Netflix Prize da anonim reytinglar IMDb bilan solishtirilib foydalanuvchilar aniqlangan",
        "Anonimlashtirish to'g'ri qilinsa, deanonimlashtirishdan to'liq kafolat beradi"
      ],
      answer: [0, 2, 3],
      explain: "k-anonimlik yetarli emas: guruhdagi hamma bir xil ball olgan bo'lsa (l = 1) ball baribir ma'lum. Anonimlashtirish kafolat emas, riskni kamaytirish.",
      lesson: { title: "Nozik va himoyalangan ma'lumot", href: "05-Sensitive-Information.md" }
    },
    {
      q: "1500 savollik bazada daraja (0.924) va lavozim (0.886) alohida 80% qoidasidan o'tdi, lekin daraja × lavozim kombinatsiyasi 0.713 chiqdi. Bu nimani ko'rsatadi?",
      type: "single",
      options: [
        "Marginal tenglik kesishma tengsizligini yashiradi",
        "80% qoidasi faqat bitta maydon uchun ishlaydi, kesishma uchun ma'nosiz",
        "Hisoblashda xato bor, chunki ikki o'tgan maydon kombinatsiyasi ham o'tishi shart",
        "Kesishma faqat HR intervyularida muhim"
      ],
      answer: [0],
      explain: "Har maydon alohida yaxshi bo'lsa ham, kombinatsiya yomon bo'lishi mumkin. Senior Data Engineer uchun atigi 82 savol bor, ya'ni uning intervyusi eng sifatsiz bo'ladi.",
      lesson: { title: "Ma'lumot biasi va adolatli vakillik", href: "06-Data-Bias-and-Representation.md" }
    },
    {
      q: "Uch tomonlama kesishma (daraja × lavozim × intervyu) 0.529 chiqdi — ikki o'lchovlidan ham yomon. Darsga ko'ra amaliy qoida qanday?",
      type: "single",
      options: [
        "Barcha mumkin bo'lgan o'lchovlar kombinatsiyasida kafolat berish",
        "Kesishma tekshiruvidan butunlay voz kechib, faqat marginal tekshirish",
        "Eng muhim 2–3 o'lchovni tanlab, o'shalarda kafolat berish",
        "Kam guruhlarni sun'iy ma'lumot bilan to'ldirish — bu bias ko'chirmaydi"
      ],
      answer: [2],
      explain: "n ta o'lchov, har birida k ta qiymat — k^n guruh, ma'lumot esa o'zgarmaydi. Sun'iy ma'lumot esa biasni ko'chirishi mumkin; eng arzon qadam — cheklovlarni halol e'lon qilish.",
      lesson: { title: "Ma'lumot biasi va adolatli vakillik", href: "06-Data-Bias-and-Representation.md" }
    }
  ]
};
