window.QUIZ = {
  id: "71",
  title: "Etik AI ishlab chiqish",
  subtitle: "Annotator kelishuvi va kappa, proksi o'zgaruvchilar, Tay va kritik nuqta, SFT sinovlari, RLHF baholovchi biasi va inklyuziv sinov",
  next: { label: "Etik AI joylashtirish", href: "../72-Ethical-AI-Deployment/README.md" },
  questions: [
    {
      q: "Ikki annotator sakkizta izohni belgiladi: xom kelishuv 75%, Cohen's kappa esa 0.529. Nega kappa xom kelishuvdan past chiqdi?",
      type: "single",
      options: [
        "Kappa faqat kelishmagan qatorlarni sanaydi, kelishganlarini hisobga olmaydi",
        "Kappa tasodifan yuz beradigan kelishuvni chiqarib tashlaydi",
        "Kappa annotatorlar sonini ikkiga bo'lib, natijani kamaytiradi",
        "Kappa izohlar uzunligiga qarab har bir qatorga og'irlik beradi"
      ],
      answer: [1],
      explain: "Kappa tasodifiy kelishuvni hisobga oladi: ikkala annotator ham ko'pincha \"zararsiz\" desa, ular tasodifan ham kelishib qoladi. Shuning uchun 75% yaxshi ko'rinsa ham, kappa 0.529 — talab qilinadigan 0.60 dan past.",
      lesson: { title: "Belgilangan ma'lumot bilan ishlash", href: "01-Labeled-Data.md" }
    },
    {
      q: "Uchta annotator ovozidan yakuniy yorliq chiqaruvchi kod nima chop etadi?",
      code: "def qaror(ovozlar, strategiya):\n    n, ijobiy = len(ovozlar), sum(ovozlar)\n    if strategiya == \"kopchilik\":\n        return 1 if ijobiy * 2 > n else 0\n    if strategiya == \"konservativ\":\n        return 1 if ijobiy == n else 0\n    if strategiya == \"ehtiyotkor\":\n        return 1 if ijobiy > 0 else 0\n\nv = [1, 0, 0]\nprint(qaror(v, \"kopchilik\"), qaror(v, \"konservativ\"), qaror(v, \"ehtiyotkor\"))",
      type: "single",
      options: [
        "1 0 1",
        "0 1 1",
        "0 0 1",
        "0 0 0"
      ],
      answer: [2],
      explain: "Bitta ijobiy ovoz ko'pchilik emas (0), bir ovozdan ham emas (0), lekin \"ehtiyotkor\" strategiya kamida bitta ovozni yetarli deb biladi (1). Shu sababli ehtiyotkor yondashuv zararni kamaytiradi, lekin ortiqcha senzuraga olib keladi.",
      lesson: { title: "Belgilangan ma'lumot bilan ishlash", href: "01-Labeled-Data.md" }
    },
    {
      q: "Darsda annotator charchashi va ataylab biasli belgilashga qarshi qaysi choralar tilga olingan? (bir nechta javob)",
      type: "multi",
      options: [
        "Belgilash seansini cheklash",
        "Annotatorlar sonini kamaytirib, jarayonni tezlashtirish",
        "Ish orasiga nazorat savollarini aralashtirish",
        "Kim ko'pchilikdan tez-tez farq qilishini kuzatish",
        "Faqat xom kelishuv foiziga qarab sifatni baholash"
      ],
      answer: [0, 2, 3],
      explain: "Charchashda kelishuv 84% dan 58% gacha tushdi; yechim — seansni cheklash va nazorat savollari. Ataylab bias (data poisoning) uchun himoya — annotator ishonchliligini kuzatish. Xom kelishuv esa aldashi mumkin.",
      lesson: { title: "Belgilangan ma'lumot bilan ishlash", href: "01-Labeled-Data.md" }
    },
    {
      q: "Kredit modelidan \"guruh\" ustuni olib tashlandi, lekin pochta indeksi qoldi. Natijada nisbat 0.671 dan 0.785 ga chiqdi. Bundan qanday xulosa chiqadi?",
      type: "single",
      options: [
        "Kamsitish to'liq yo'qoldi, chunki model endi guruhni ko'rmaydi",
        "Kamsitish kuchaydi, chunki model guruh o'rniga tasodifiy belgilarga tayandi",
        "Natija o'zgarmadi, chunki indeks va layoqat bir xil ta'sir qiladi",
        "Kamaydi, lekin indeks guruhni oshkor qilgani uchun 80% qoidasi buzildi"
      ],
      answer: [3],
      explain: "Beshta indeksdan to'rttasi guruhni 100% aniq oshkor qilardi, ya'ni indeks — proksi. Shuning uchun guruhni olib tashlash kamsitishni to'xtatmadi: 0.785 hali ham 0.80 dan past.",
      lesson: { title: "Belgilanmagan ma'lumot", href: "02-Unlabeled-Data.md" }
    },
    {
      q: "Proksi detektori yangi maydon uchun shunday natija berdi: himoyalangan belgini bashorat qilish aniqligi 58%, baza 50%. Darsdagi qoida bo'yicha bu maydon qanday baholanadi?",
      type: "single",
      options: [
        "Proksi hisoblanmaydi: ortiqcha 8 punkt, chegara esa 10 punktdan ortiq",
        "Proksi hisoblanadi: bazadan yuqori har qanday aniqlik proksi belgisi",
        "Proksi hisoblanadi: 58% ikki guruhdan birini ko'proq bashorat qiladi",
        "Baholab bo'lmaydi: detektor faqat pochta indeksi uchun ishlaydi"
      ],
      answer: [0],
      explain: "Qoida: maydon himoyalangan belgini bazadan 10 punktdan ortiq aniqroq bashorat qilsa — u proksi. Darsda indeks +32.7% (proksi), layoqat +1.4% (toza) chiqdi; 8 punkt chegaradan past.",
      lesson: { title: "Belgilanmagan ma'lumot", href: "02-Unlabeled-Data.md" }
    },
    {
      q: "Tay simulyatsiyasida zaharlilik 200 qadam davomida 0.06 atrofida turdi, 253-qadamda 0.50 ga, 263-qadamda 1.00 ga yetdi. Bu naqshning eng xavfli tomoni nima?",
      type: "single",
      options: [
        "Zaharlilik boshidan bir tekis o'sadi, shuning uchun uni oldindan aniq hisoblash mumkin",
        "Tizim uzoq vaqt sog'lom ko'rinadi, keyin kritik nuqtada birdaniga qulaydi",
        "Zaharlilik faqat birinchi qadamlarda yuqori bo'lib, keyin o'z-o'zidan pasayadi",
        "Buzilish faqat zaharli foydalanuvchilar ulushi 50% dan oshganda boshlanadi"
      ],
      answer: [1],
      explain: "Asta-sekin o'sish emas, kritik nuqta (tipping point) kuzatildi: o'n qadamda yarimdan to'liqqa. Sabab — qayta aloqa halqasi: model zaharlangani sayin zaharli foydalanuvchilarni ko'proq jalb qiladi.",
      lesson: { title: "Nazoratsiz o'qitishdagi etik muammolar", href: "03-Unsupervised-Training.md" }
    },
    {
      q: "Tay simulyatsiyasida o'rgatish tezligini 4 barobar sekinlashtirish buzilishni faqat kechiktirdi, lekin to'xtatmadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "2 barobar sekinlashtirish kechiktirdi (263 → 701 qadam), 4 barobar sekinlashtirish esa buzilishni umuman to'xtatdi (yakuniy zaharlilik 0.00). Bu yerda ham kritik nuqta bor: pasayish kuchayishdan ustun keladi.",
      lesson: { title: "Nazoratsiz o'qitishdagi etik muammolar", href: "03-Unsupervised-Training.md" }
    },
    {
      q: "Fine-tuningdan keyingi nozik sinov 3/4 \"o'tdi\" berdi, lekin o'tgan uchtadan ikkitasi \"As an AI language model...\" kabi shablon javob edi. Testni qanday tuzatish kerak?",
      type: "single",
      options: [
        "Taqiqlangan naqshlar ro'yxatini ikki barobar uzaytirishning o'zi kifoya",
        "Testni faqat reliz oldidan bir marta qo'lda ishga tushirish kerak",
        "Ikki tomonlama tekshirish: taqiqlangan naqsh yo'q va javob shablon emas",
        "Shablon javoblarni ham \"o'tdi\" deb hisoblash, chunki ular xavfsiz"
      ],
      answer: [2],
      explain: "Test faqat taqiqlangan naqshni qidirgani uchun javobdan qochishni \"o'tdi\" deb hisobladi. U javobning foydaliligini ham tekshirishi, va CI/CD da har fine-tuningdan keyin avtomatik ishlashi kerak.",
      lesson: { title: "Nazoratli fine-tuning", href: "04-Supervised-Fine-Tuning.md" }
    },
    {
      q: "Yollash tizimining chiqish monitoringi guruhlar nisbatini uchta oynada ko'rsatdi: 0.808, 0.500, 0.487. Faqat ishga tushirishda tekshirgan jamoa nimani ko'rardi?",
      type: "single",
      options: [
        "Hech qanday muammo ko'rmasdi, chunki birinchi oyna chegaradan zo'rg'a o'tgan",
        "Keskin buzilishni darhol ko'rardi, chunki drift har doim birinchi kundan boshlanadi",
        "Nisbat 0.487 ekanini ko'rardi, chunki oxirgi natija birinchi hisoblanadi",
        "Nisbat o'rtachasini ko'rib, tizimni avtomatik to'xtatardi"
      ],
      answer: [0],
      explain: "Drift sekin va sezilmas: birinchi oyna 0.808 bilan o'tdi, keyingilari 80% qoidasini buzdi. Faqat boshida tekshirgan jamoa hech narsa ko'rmasdi — shuning uchun muntazam monitoring kerak.",
      lesson: { title: "Nazoratli fine-tuning", href: "04-Supervised-Fine-Tuning.md" }
    },
    {
      q: "Sodda mukofot funksiyasi bilan \"optimallashgan\" javob uchun kod nima chop etadi?",
      code: "def mukofot(javob):\n    return min(10, len(javob.split()) / 10)\n\njavob = \"Use int8 quantisation.\"\nfor q in range(2):\n    javob += \" This is important to consider carefully.\"\nprint(mukofot(javob))",
      type: "single",
      options: [
        "0.9",
        "2.1",
        "15",
        "1.5"
      ],
      answer: [3],
      explain: "Boshlang'ich javob 3 so'z, har qo'shimcha 6 so'z: jami 15 so'z, mukofot 1.5. Javob yangi ma'lumot olmadi, lekin mukofot oshdi — bu reward hacking: model maqsadga emas, o'lchovga optimallashadi.",
      lesson: { title: "RLHF va etik AI xulqi", href: "05-RLHF.md" }
    },
    {
      q: "Jamoa RLHF uchun baholovchilar sonini 10 dan 200 ga oshirdi, lekin hammasi bir xil kasb va yoshdagi, uzun javoblarni yoqtiradigan odamlar. Darsdagi o'lchovga ko'ra nima bo'ladi?",
      type: "single",
      options: [
        "Bias o'rtachalanib yo'qoladi, chunki 200 baholovchi yetarlicha ko'p",
        "Tizimli bias qoladi: 200 baholovchida ham farq siqilgan holda turadi",
        "Bias kuchayadi, chunki ko'p baholovchi har doim ko'proq shovqin beradi",
        "Mukofot modeli uzunlikni butunlay e'tiborsiz qoldirishni o'rganadi"
      ],
      answer: [1],
      explain: "Tasodifiy bias o'rtachalanadi (farq 6.00 → 6.62), tizimli bias esa qoladi: 200 baholovchida ham farq atigi 4.51. Muhimi baholovchilar soni emas, xilma-xilligi.",
      lesson: { title: "RLHF va etik AI xulqi", href: "05-RLHF.md" }
    },
    {
      q: "Baholovchi profilida C o'rtacha +1.61 ball yuqori (tarqoqlik 1.09), D esa tarqoqligi 2.18. Qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "C da tizimli siljish bor, uni kalibrlash orqali tuzatish mumkin",
        "D barqaror emas: ba'zan juda yuqori, ba'zan juda past baho beradi",
        "D ni kalibrlash yetarli, chunki uning o'rtacha farqi kichik",
        "Ikkala muammo ham ko'pchilik o'rtachasiga qaralsa ko'rinadi",
        "D uchun yechim — qayta o'qitish yoki chiqarib tashlash"
      ],
      answer: [0, 1, 4],
      explain: "C ning xatosi doimiy siljish — uni kalibrlash mumkin. D ning xatosi beqarorlik — uni tuzatib bo'lmaydi, qayta o'qitish yoki chiqarish kerak. Ikkala muammo ham faqat alohida profilda ko'rinadi, umumiy o'rtachada emas.",
      lesson: { title: "RLHF va etik AI xulqi", href: "05-RLHF.md" }
    },
    {
      q: "Birinchi idioma metrikasi quyidagicha ishlaydi. Model o'zbekcha idiomaga shunday javob berdi. Kod nima chop etadi va bu nimani ko'rsatadi?",
      code: "import re\n\ndef baho_1(javob, sozma_soz):\n    return \"YIQILDI\" if re.search(sozma_soz, javob, re.I) else \"TUSHUNDI\"\n\njavob = \"I apologize, but I'm not sure what you mean.\"\nprint(baho_1(javob, r\"\\b(eye|hand|short)\\b\"))",
      type: "single",
      options: [
        "YIQILDI — metrika model idiomani tushunmaganini to'g'ri aniqladi",
        "TUSHUNDI — metrika \"xato so'z yo'q\"ni \"to'g'ri javob\" deb hisobladi",
        "TUSHUNDI — model o'zbekcha idiomani haqiqatan ham to'g'ri tushundi",
        "YIQILDI — javobda \"short\" so'zi uchragani uchun"
      ],
      answer: [1],
      explain: "Javobda eye/hand/short yo'q, shuning uchun metrika \"TUSHUNDI\" deydi, holbuki model hech narsa tushunmagan. Aynan shu tufayli metrika o'zbekcha 0/5 ni 4/5 qilib ko'rsatdi; yechim — CHALKASHDI holatini qo'shgan uch holatli metrika.",
      lesson: { title: "Inklyuziv va adolatli ishlab chiqish", href: "06-Inclusive-Development.md" }
    },
    {
      q: "Butunlay tasodifiy belgilar bilan tajribada 1 000 ta belgi ichidan 10 ta belgidagiga nisbatan ikki barobar kuchli \"naqsh\" topildi. Bu Star Wars misolini qanday tushuntiradi?",
      type: "single",
      options: [
        "Model haqiqiy yashirin qonuniyatni topgan, uni qayta tekshirish shart emas",
        "Tasodifiy belgilar aslida yollash natijasi bilan kuchli bog'langan edi",
        "Ko'p taqqoslash muammosi: belgi ko'paygan sari soxta naqsh osonroq topiladi",
        "Naqsh kuchi faqat nomzodlar soniga bog'liq, belgilar soniga emas"
      ],
      answer: [2],
      explain: "Belgilarning yollash bilan hech qanday bog'liqligi yo'q edi. Model \"aqlli\" emas — u shunchaki juda ko'p belgini ko'rgan (multiple comparisons).",
      lesson: { title: "Inklyuziv va adolatli ishlab chiqish", href: "06-Inclusive-Development.md" }
    },
    {
      q: "Star Wars kabi soxta naqshlarga qarshi darsda qaysi himoya usullari keltirilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "Belgilar sonini faqat asosli belgilar bilan cheklash",
        "Naqsh ajratilgan sinov to'plamida takrorlanishini tekshirish",
        "Iloji boricha ko'proq belgi qo'shib, modelni kuchaytirish",
        "Har belgi uchun bir jumlalik sabab yozish, yoza olmasangiz olib tashlash",
        "Bonferroni tuzatishi bilan statistik chegarani qattiqlashtirish"
      ],
      answer: [0, 1, 3, 4],
      explain: "Darsda to'rtta himoya bor: belgilarni cheklash, ajratilgan sinov to'plami, Bonferroni tuzatishi va sabab-oqibat savoli. Eng arzoni — har belgi uchun bir jumlalik sabab. Ko'proq belgi qo'shish esa soxta naqsh ehtimolini oshiradi.",
      lesson: { title: "Inklyuziv va adolatli ishlab chiqish", href: "06-Inclusive-Development.md" }
    }
  ]
};
