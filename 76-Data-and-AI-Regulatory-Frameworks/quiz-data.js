window.QUIZ = {
  id: "76",
  title: "Ma'lumot va AI regulyatsiyasi asoslari",
  subtitle: "Global yondashuvlar, GDPR va EU AI Act, AQSh shtatlari yamog'i, Xitoy PIPL/DSL va Afrikadagi bias muammosi",
  questions: [
    {
      q: "O'zbekistonda joylashgan startap nemis va fransuz foydalanuvchilarga xizmat ko'rsatadi. Darsga ko'ra qaysi qonunlar qo'llanishini aniqlash uchun qaysi savol to'g'ri?",
      type: "single",
      options: [
        "Kompaniya qaysi mamlakatda ro'yxatdan o'tgan?",
        "Serverlarimiz qaysi mamlakatda turadi?",
        "Mening foydalanuvchilarim qayerda?",
        "Asoschilar qaysi mamlakat fuqarosi?"
      ],
      answer: [2],
      explain: "GDPR qayerda joylashganidan qat'i nazar, EI fuqarolari ma'lumotini ishlovchi har qanday kompaniyaga tegishli. \"Men qayerdaman?\" — xato savol.",
      lesson: { title: "Global AI va ma'lumot regulyatsiyasi", href: "01-Global-Overview.md" }
    },
    {
      q: "Kompaniya EU, NY, Xitoy va Janubiy Afrikada ishlaydi va GDPR + AI Act ni to'liq bajardi. Qaysi talablar hali QOPLANMAGAN qoladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Ma'lumot tasnifi (Xitoy DSL)",
        "Aniq rozilik olish (Xitoy PIPL)",
        "Chegaradan o'tkazish (Xitoy PIPL)",
        "Nomzodga xabar berish (NY LL144)",
        "Saqlash muddatini cheklash (POPIA)"
      ],
      answer: [0, 2, 3],
      explain: "EU 10 ta talabning faqat 6 tasini (60%) qoplaydi. Qolgan to'rttasi: ma'lumot tasnifi, chegaradan o'tkazish ruxsati, nomzodga xabar va POPIA ning kirish talabi. Rozilik va saqlash muddati EU da bor.",
      lesson: { title: "Global AI va ma'lumot regulyatsiyasi", href: "01-Global-Overview.md" }
    },
    {
      q: "Quyidagi kod nima chiqaradi va yagona talablar ro'yxati uchun qaysi natijadan foydalanish kerak?",
      code: "YURISDIKSIYA = {\n    \"EU\": {\"rozilik\", \"o'chirish\", \"bias auditi\"},\n    \"NY\": {\"bias auditi\", \"nomzodga xabar\"},\n}\nbirlashma = set().union(*YURISDIKSIYA.values())\nkesishma = set.intersection(*YURISDIKSIYA.values())\nprint(len(birlashma), len(kesishma))",
      type: "single",
      options: [
        "4 1 — kesishmadan, chunki faqat umumiy talablar majburiy",
        "5 1 — birlashmadan, chunki takrorlar ham hisoblanadi",
        "4 1 — birlashmadan, chunki eng cheklovchi shart g'olib",
        "3 2 — kesishmadan, chunki u eng xavfsiz tanlov"
      ],
      answer: [2],
      explain: "Birlashma {rozilik, o'chirish, bias auditi, nomzodga xabar} — 4 ta, kesishma faqat {bias auditi} — 1 ta. Hamma joyda ishlash uchun union kerak, intersection emas.",
      lesson: { title: "Global AI va ma'lumot regulyatsiyasi", href: "01-Global-Overview.md" }
    },
    {
      q: "Cambridge Analytica ~87 mln foydalanuvchi ma'lumotini qanday qo'lga kiritgani darsda qanday tushuntiriladi?",
      type: "single",
      options: [
        "~270 000 kishi testni to'ldirdi va ularning ~320 tadan do'sti profili ham olindi",
        "87 mln kishining har biri shaxsiyat testini to'ldirib, rozilik bergan edi",
        "Facebook serverlari buzib kirilib, 87 mln profil to'g'ridan-to'g'ri o'g'irlandi",
        "~87 000 kishi testni to'ldirdi va har biri 1000 tadan do'stini taklif qildi"
      ],
      answer: [0],
      explain: "270 000 × 320 = 86.4 mln, kuchaytirish koeffitsienti ~322x. 270 ming odam rozilik berdi, 87 mln esa bermadi — bu GDPR tug'ilishining sababi.",
      lesson: { title: "EI: GDPR va AI Act", href: "02-EU-GDPR-and-AI-Act.md" }
    },
    {
      q: "Darsdagi AI Act tasniflagichiga ko'ra yollashda ishlatiladigan AI ilova va mijoz chatboti qaysi toifalarga tushadi?",
      type: "single",
      options: [
        "Ikkalasi ham minimal xavf — hech qanday majburiy talab yo'q",
        "Yollash — yuqori xavf, chatbot — shaffoflik majburiyati",
        "Yollash — taqiqlangan amaliyot, chatbot — yuqori xavf",
        "Yollash — shaffoflik majburiyati, chatbot — minimal xavf"
      ],
      answer: [1],
      explain: "Yollash AI Act da aniq nomlangan yuqori xavfli soha. Chatbot odam bilan muloqot qilgani uchun foydalanuvchi AI bilan gaplashayotganini bilishi kerak — bu shaffoflik majburiyati.",
      lesson: { title: "EI: GDPR va AI Act", href: "02-EU-GDPR-and-AI-Act.md" }
    },
    {
      q: "Nega darsda o'chirish huquqi (erasure) GDPR ning eng chuqur muammosi deb ataladi?",
      type: "single",
      options: [
        "Chunki foydalanuvchilar bu huquqdan amalda juda kam foydalanadi",
        "Chunki bazadan va zaxira nusxalardan o'chirish texnik jihatdan imkonsiz",
        "Chunki bu huquq faqat davlat tashkilotlariga nisbatan qo'llanadi",
        "Chunki bazadan o'chirish oson, modeldan o'chirish esa deyarli imkonsiz"
      ],
      answer: [3],
      explain: "Model o'qigan narsani unutmaydi. Shuning uchun 70-modul qoidasi muhim: ma'lumotni yig'maslik keyin o'chirishdan arzonroq.",
      lesson: { title: "EI: GDPR va AI Act", href: "02-EU-GDPR-and-AI-Act.md" }
    },
    {
      q: "Bitta shtatda 4 ta talab, beshtasida 10 ta. O'sish 4 → 7 → 9 → 10 → 10 bo'lib to'xtadi. Nega?",
      type: "single",
      options: [
        "Chunki federal qonun shtat talablarini 10 ta bilan cheklaydi",
        "Chunki talablar qoplashadi: opt_out va kirish bir necha shtatda bor",
        "Chunki beshinchi shtatda AI bo'yicha umuman alohida qonun yo'q",
        "Chunki Nyu-York talablari boshqa shtatlarnikini bekor qiladi"
      ],
      answer: [1],
      explain: "Qoplashish tufayli yamoq chalkash, lekin cheksiz emas. Haqiqiy qiyinchilik sonda emas — har shtat talabni boshqacha ta'riflaydi, boshqa muddat va jarima qo'yadi.",
      lesson: { title: "AQSh: shtatlar bo'yicha regulyatsiya", href: "03-United-States.md" }
    },
    {
      q: "Nyu-Yorkning LL144 qonuni yollashda AI ishlatuvchi kompaniyadan nimalarni talab qiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Mustaqil bias auditi",
        "Auditga sezgirlik nazoratini qo'shish",
        "Audit natijasini e'lon qilish",
        "Nomzodga oldindan xabar berish",
        "Ma'lumotni AES bilan shifrlash"
      ],
      answer: [0, 2, 3],
      explain: "LL144 ning uchta talabi: mustaqil bias auditi, natijani e'lon qilish va nomzodga xabar. Sezgirlik nazoratini qonun talab qilmaydi — bu 69-modulning ilmiy saboqi.",
      lesson: { title: "AQSh: shtatlar bo'yicha regulyatsiya", href: "03-United-States.md" }
    },
    {
      q: "Qonunga (NY LL144) muvofiq o'tkazilgan bias auditi har doim ilmiy jihatdan yaroqli bo'ladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Qonun sezgirlik nazoratini talab qilmaydi. Nazoratsiz \"farq yo'q\" degan audit yaroqsiz, ya'ni qonunga muvofiq, lekin ilmiy jihatdan bo'sh audit chiqarish mumkin.",
      lesson: { title: "AQSh: shtatlar bo'yicha regulyatsiya", href: "03-United-States.md" }
    },
    {
      q: "Xitoyning DSL qonuni qo'yadigan asosiy talab nima va u EU da bormi?",
      type: "single",
      options: [
        "Ma'lumotni muhimligiga qarab tasniflash; EU da bunday talab yo'q",
        "Foydalanuvchidan aniq rozilik olish; EU da ham xuddi shunday talab",
        "AI kontentini belgilash; EU da bu faqat ixtiyoriy tavsiya sifatida",
        "Yollashda bias auditi; EU da bu AI Act orqali to'liq qoplanadi"
      ],
      answer: [0],
      explain: "DSL ma'lumotni tasniflashni talab qiladi va GDPR ni bajarish uni qoplamaydi. Bu tasnif 70-moduldagi \"ma'lumot pasporti\"ning rasmiy versiyasi.",
      lesson: { title: "Osiyo-Tinch okeani: kuchli davlat nazorati", href: "04-Asia-Pacific.md" }
    },
    {
      q: "Xitoydagi foydalanuvchilar uchun ilova ularning ma'lumotini OpenAI API ga yuboradi. Darsga ko'ra muammo nima va qanday yechim bor?",
      type: "single",
      options: [
        "Muammo yo'q, chunki TLS ma'lumotni yo'lda to'liq shifrlab himoya qiladi",
        "Ma'lumot chegaradan o'tadi (PIPL); mahalliy model buni bartaraf qiladi",
        "Faqat narx muammosi; arzonroq API tarifiga o'tish kifoya qiladi",
        "Muammo AI kontentini belgilamaslikda; watermark qo'shish kerak"
      ],
      answer: [1],
      explain: "Chegaradan o'tkazish — siyosat emas, arxitektura masalasi. Uni keyin tuzatish eng qimmat, chunki serverni ko'chirishni anglatadi; mahalliy model esa ba'zi yurisdiksiyalarda yagona yo'l.",
      lesson: { title: "Osiyo-Tinch okeani: kuchli davlat nazorati", href: "04-Asia-Pacific.md" }
    },
    {
      q: "Soddalashtirilgan DSL tasniflagichi nima chiqaradi?",
      code: "def malumot_tasnifi(toplam):\n    if toplam.get(\"davlat_xavfsizligi\"):\n        return \"asosiy\"\n    if toplam.get(\"shaxsiy_malumot_soni\", 0) > 1_000_000:\n        return \"muhim\"\n    if toplam.get(\"shaxsiy_malumot_soni\", 0) > 0:\n        return \"ichki\"\n    return \"ommaviy\"\n\nprint(malumot_tasnifi({\"shaxsiy_malumot_soni\": 200}),\n      malumot_tasnifi({\"shaxsiy_malumot_soni\": 2_000_000}))",
      type: "single",
      options: [
        "ommaviy muhim",
        "ichki asosiy",
        "ichki ichki",
        "ichki muhim"
      ],
      answer: [3],
      explain: "200 ta nomzod bazasi 0 dan katta, lekin 1 mln dan kichik — \"ichki\". 2 mln mijoz bazasi 1 mln dan katta — \"muhim\", bu darajada chegaradan o'tkazish uchun ruxsat kerak.",
      lesson: { title: "Osiyo-Tinch okeani: kuchli davlat nazorati", href: "04-Asia-Pacific.md" }
    },
    {
      q: "Beshta mintaqa ismlarini tokenlashda AQSh/Britaniya ismlari uchun qanday g'alati natija chiqdi?",
      type: "single",
      options: [
        "Ular eng ko'p token oldi, chunki inglizcha familiyalar uzun",
        "Ular 2 tadan 5 tagacha tokenga bo'lindi, o'rtacha 3.5 token",
        "Hammasi aynan 2 token: tokenizator ularni butun so'z sifatida biladi",
        "Ular o'zbek ismlari bilan bir xil natija berdi — o'rtacha 6.67 token"
      ],
      answer: [2],
      explain: "AQSh/Britaniya ismlarining har biri 2 token, Shahnoza Yo'ldosheva esa 10 token — 5 barobar qimmat. O'zbek ismlari o'rtacha 6.67, Nigeriya 6.17 token.",
      lesson: { title: "Afrikaning AI boshqaruviga intilishi", href: "05-Africa.md" }
    },
    {
      q: "Ism tokenlash o'lchovi kursning \"G'arb ma'lumotida qurilgan modellar mahalliy voqelikni aks ettirmaydi\" degan da'vosini isbotlaydimi?",
      type: "single",
      options: [
        "Ha, to'liq: token soni yollash qarorlarini bevosita belgilaydi",
        "Qisman — bilvosita dalil: tokenlash o'lchandi, yollash qarori emas",
        "Yo'q, chunki token soni faqat narxga ta'sir qiladi, sifatga emas",
        "Yo'q, chunki Afrika ismlari o'zbek ismlaridan kamroq token oldi"
      ],
      answer: [1],
      explain: "Tokenizator ma'lumot taqsimotini ko'rsatadi va u G'arb tomon og'gan, lekin yollash qarori o'lchanmagan. Bu oltinchi mustaqil o'lchov — hammasi bir yo'nalishda.",
      lesson: { title: "Afrikaning AI boshqaruviga intilishi", href: "05-Africa.md" }
    },
    {
      q: "Darsga ko'ra mahalliy model qaysi muammolarni hal qiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Ma'lumot chegaradan chiqmaydi",
        "AI yaratgan matnni aniq aniqlash imkonini beradi",
        "Mahalliy tilda sozlash mumkin bo'ladi",
        "Tokenizator jarimasini avtomatik yo'q qiladi",
        "Narx nazorat ostida bo'ladi"
      ],
      answer: [0, 2, 4],
      explain: "Mahalliy model: ma'lumot chegaradan chiqmaydi, mahalliy tilda sozlash, narx nazorati va o'z tilingizda baholash to'plami. U detektor muammosini ham, tokenizator jarimasini ham o'z-o'zidan hal qilmaydi.",
      lesson: { title: "Afrikaning AI boshqaruviga intilishi", href: "05-Africa.md" }
    }
  ]
};
