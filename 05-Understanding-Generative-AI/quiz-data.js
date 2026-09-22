window.QUIZ = {
  id: "05",
  title: "Generativ AI ni tushunish",
  subtitle: "ChatGPT dan LLM gacha: NLP tarixi, embeddings, self-supervised learning, Transformer, LLM qurish bosqichlari va buy vs make",
  next: { label: "Generativ AI dagi amaliy qiyinchiliklar", href: "../06-Practical-challenges-in-Generative-AI/README.md" },
  questions: [
    {
      q: "ChatGPT ikki oydan kam vaqtda 100 million foydalanuvchiga yetdi. Darsga ko'ra bu portlovchi o'sishning asosiy sababi nima edi?",
      type: "single",
      options: [
        "Reklamaga sarflangan ulkan byudjet tufayli bir haftada millionlab odam jalb qilindi",
        "U faqat bitta vazifani mukammal bajargani uchun mutaxassislar orasida tez tarqaldi",
        "Odamlar u kundalik ishlarida yordam berishini darhol angladi, dasturchi bo'lish shart emas edi",
        "U birinchi kundanoq GPT 4.0 asosida chiqarilgani uchun barcha modellardan kuchliroq edi"
      ],
      answer: [2],
      explain: "Ma'ruza javobi oddiy: mahsulot ajoyib edi va har kim uni matnni umumlashtirish, texnik savollar va vazifalarda darhol ishlata oldi. Dastlab GPT 4.0 emas, ChatGPT 3.5 chiqarilgan.",
      lesson: { title: "Gen AI ning ko'tarilishi — ChatGPT bilan tanishuv", href: "01-The-rise-of-GenAI-ChatGPT.md" }
    },
    {
      q: "90-yillardagi statistik \"can\" so'zi jumlada ot yoki fe'l ekanini qanday aniqlagan bo'lardi?",
      type: "single",
      options: [
        "Grammatika qoidalarini qo'lda yozib, ularni har bir jumlaga ketma-ket qo'llab",
        "So'zni yuqori o'lchamli vektorga aylantirib, attention score orqali tahlil qilib",
        "Jumlalarni belgisiz holda tasodifiy guruhlab, o'xshash klasterlarni qidirib",
        "Belgilangan ko'p jumlalardagi kontekst chastotalaridan ehtimollikni hisoblab"
      ],
      answer: [3],
      explain: "Statistik can bor jumlalarni yig'ib, ot/fe'l deb annotatsiya qiladi va kontekstni tahlil qiladi: yaqinda you yoki I bo'lsa odatda fe'l, soda bo'lsa ot. Ma'ruzachi buni ibtidoiy machine learning'ga qiyoslaydi.",
      lesson: { title: "NLP ga dastlabki yondashuvlar", href: "02-Early-approaches-to-NLP.md" }
    },
    {
      q: "Vector embeddings haqida qaysi fikrlar darsga mos keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Odatda 2 yoki 3 o'lchamli bo'ladi, shuning uchun ularni grafikda chizish oson",
        "Matn, rasm, audio kabi strukturalanmagan ma'lumotni ifodalay oladi",
        "Yozilishi o'xshash so'zlar (olma va olmos) fazoda yonma-yon joylashadi",
        "Haqiqiy modelda har bir o'lchamga odam aniq nom berib chiqqan bo'ladi",
        "Ma'lumotni semantik o'xshashlik bo'yicha saqlash va topishga imkon beradi"
      ],
      answer: [1, 4],
      explain: "Embeddings strukturalanmagan ma'lumotni ifodalaydi va semantik o'xshashlik bo'yicha qidirishga xizmat qiladi. Ular bir necha yuzdan minglab o'lchamli, o'lchamlar nomsiz, yaqinlik esa yozilish emas, ma'no bo'yicha.",
      lesson: { title: "Zamonaviy NLP yutuqlari", href: "03-Recent-NLP-advancements.md" }
    },
    {
      q: "\"___ 1991-yilda mustaqillikka erishdi\" jumlasidagi bo'sh joyni to'ldirish uchun qaysi til modeli turi mos va nega?",
      type: "single",
      options: [
        "Masked — chunki bo'sh joydan keyingi so'zlardan ham foydalana oladi",
        "Autoregressive — chunki u faqat oldingi so'zlar kontekstiga tayanadi",
        "Autoregressive — chunki GPT modellari aynan shu turga kiradi",
        "Unigram — chunki matndagi eng ko'p uchraydigan so'zni tanlaydi"
      ],
      answer: [0],
      explain: "Bo'sh joy jumla boshida, oldida hech qanday so'z yo'q. Masked model yetishmayotgan so'zni joyidan qat'i nazar, oldingi va keyingi kontekst bilan topadi; autoregressive esa faqat keyingi so'zni bashorat qiladi.",
      lesson: { title: "Language Model dan Large Language Model (LLM) ga", href: "04-From-LM-to-LLM.md" }
    },
    {
      q: "To'g'rimi: LLM atamasining rasmiy ta'rifi bor — 100 milliarddan ortiq parametrli har qanday model \"large\" hisoblanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "LLM ning rasmiy ta'rifi yo'q va atama erkin ishlatiladi. \"Large\" katta ma'lumotda o'qitilganini aks ettiradi, bu hajm esa o'sib boradi: bugun large bo'lgan narsa bir necha yildan keyin bunday bo'lmaydi.",
      lesson: { title: "Language Model dan Large Language Model (LLM) ga", href: "04-From-LM-to-LLM.md" }
    },
    {
      q: "Nima uchun LLM lar oddiy supervised learning emas, balki self-supervised learning bilan o'qitiladi?",
      type: "single",
      options: [
        "Self-supervised belgilarni matnning o'zidan avtomatik yaratadi va internet miqyosida masshtablanadi",
        "Self-supervised aniq maqsadsiz ishlaydi va ma'lumot tuzilmasini hech qanday bashoratsiz topadi",
        "Self-supervised o'quv ma'lumotidagi barcha bias'larni butunlay va avtomatik yo'q qiladi",
        "Self-supervised har bir namunani tajribali mutaxassis qo'lda belgilaganiga kafolat beradi"
      ],
      answer: [0],
      explain: "Matnning o'zi o'z belgisi: \"suv nol darajada ___\" uchun belgi matnda allaqachon bor, shuning uchun belgilash bepul va masshtablanadi. Maqsadsiz ishlash unsupervised'ning kamchiligi, ma'lumot bias'i esa self-supervised'da ham qoladi.",
      lesson: { title: "LLM o'qitish samaradorligi — Supervised vs Semi-supervised", href: "05-Efficiency-of-LLM-training.md" }
    },
    {
      q: "Self-supervised o'quv namunalarini yaratuvchi bu kod nechta \"kirish -> belgi\" qatorini chiqaradi va birinchisi qanday bo'ladi?",
      code: "MATN = \"suv nol darajada muzlaydi\"\nsozlar = MATN.split()\nfor i in range(1, len(sozlar)):\n    kirish = \" \".join(sozlar[:i])\n    print(kirish, \"->\", sozlar[i])",
      type: "single",
      options: [
        "4 ta; birinchisi: suv -> nol",
        "3 ta; birinchisi: suv nol -> darajada",
        "3 ta; birinchisi: suv -> nol",
        "4 ta; birinchisi:  -> suv"
      ],
      answer: [2],
      explain: "Jumlada 4 so'z bor, range(1, 4) esa i = 1, 2, 3 beradi — 3 ta namuna. i = 1 da kirish sozlar[:1] = \"suv\", belgi sozlar[1] = \"nol\". Umuman n so'zli jumladan n-1 ta namuna olinadi.",
      lesson: { title: "LLM o'qitish samaradorligi — Supervised vs Semi-supervised", href: "05-Efficiency-of-LLM-training.md" }
    },
    {
      q: "RNN uzun romanning oxirgi bobiga yetganda bosh qahramonning ismini \"unutib qo'yadi\". Bu muammo qanday ataladi va uni qaysi arxitektura yumshatdi?",
      type: "single",
      options: [
        "Sparsity — uni bigram modeli oldingi bitta so'zga qarab yechdi",
        "Vanishing gradient — uni unigram modeli chastotalar bilan yechdi",
        "Vanishing gradient — uni LSTM gate arxitekturasi bilan yumshatdi",
        "Overfitting — uni N-gram modeli oldingi n-1 so'z bilan yechdi"
      ],
      answer: [2],
      explain: "Matn o'sgan sari RNN oldingi axborotni yo'qotadi — bu vanishing gradient. LSTM gate arxitekturasi qaysi axborotni saqlash va qaysini tashlashni tanlab, muhim uzoq muddatli axborotni saqlay oldi.",
      lesson: { title: "N-gram dan RNN va Transformer gacha — NLP evolyutsiyasi", href: "06-From-Ngrams-to-Transformers.md" }
    },
    {
      q: "LSTM uzoq muddatli axborotni saqlay olsa ham, nega LLM lar Transformer arxitekturasiga qurildi?",
      type: "single",
      options: [
        "LSTM tartibni hisobga olmaydi, Transformer esa faqat so'zlar chastotasiga tayanadi",
        "LSTM faqat bitta oldingi so'zga qaraydi, Transformer esa butun korpusni yodlaydi",
        "LSTM gate'lari axborotni hech tashlamaydi, Transformer esa uzoq kontekstni unutadi",
        "LSTM qimmat va sekin o'qitiladi, attention esa muhim so'zlarga tayanib masshtablanadi"
      ],
      answer: [3],
      explain: "LSTM ning kamchiligi — yuqori hisoblash narxi va sekin o'qitish, ya'ni masshtablanmaydi. Attention har bir tokenga ball berib, muhim so'zlarga kuchliroq e'tibor qaratadi: bu narxni pasaytiradi va uzoq masofali bog'liqliklarni boshqaradi.",
      lesson: { title: "N-gram dan RNN va Transformer gacha — NLP evolyutsiyasi", href: "06-From-Ngrams-to-Transformers.md" }
    },
    {
      q: "Quyidagi ishlardan qaysilari LLM qurishning dataset engineering bosqichiga tegishli? (bir nechta javob)",
      type: "multi",
      options: [
        "Neyron tarmoqdagi qatlamlar soni va umumiy parametrlar hajmini belgilash",
        "Internetdan ochiq ma'lumotni scraping qilib, tozalash va strukturalash",
        "Modelning weights larini tezlik va sifat uchun qayta yangilab chiqish",
        "Oxirgi foydalanuvchi nigohidan modelning etik xulqini sinab ko'rish",
        "Xilma-xillik va turli bias'larni hisobga olgan datasetlar qurish"
      ],
      answer: [1, 4],
      explain: "Dataset engineering — ma'lumotni to'plash, tozalash va strukturalash, shuningdek xilma-xillik va bias kabi etik masalalar. Qatlamlar soni model design'ga, weights ni yangilash fine-tuning'ga, etik xulqni sinash final testing'ga tegishli.",
      lesson: { title: "LLM qurish bosqichlari", href: "07-Phases-in-building-LLMs.md" }
    },
    {
      q: "Internet forumlarida pre-train qilingan model dastlabki baholashda haqoratli til ishlatayotgani aniqlandi. Darsga ko'ra bu keyin qaysi bosqichda va qanday tuzatiladi?",
      type: "single",
      options: [
        "Model design'da — arxitekturani Transformer'dan CNN ga almashtirib, qayta qurish orqali",
        "Pre-training'da — xuddi shu forum ma'lumotida ikki barobar uzoqroq o'qitish orqali",
        "Final testing'da — testni o'tkazib yuborib, modelni darhol foydalanuvchilarga berish orqali",
        "Post-training'da — sifatli ma'lumotda supervised fine-tuning va inson fikri orqali"
      ],
      answer: [3],
      explain: "Preliminary evaluation nimani yaxshilash kerakligini ko'rsatadi, bu masalalar esa post-training'da hal qilinadi: yuqori sifatli ma'lumot bilan supervised fine-tuning va annotatsiya kabi inson fikr-mulohazasi.",
      lesson: { title: "LLM qurish bosqichlari", href: "07-Phases-in-building-LLMs.md" }
    },
    {
      q: "Bank chatboti yaxshi ohangda javob beradi, lekin bankning ichki qoidalarini umuman bilmaydi. Darsdagi qaror daraxtiga ko'ra qaysi texnika mos?",
      type: "single",
      options: [
        "Prompt engineering — ko'rsatmalarni aniqroq yozish muammoni to'liq hal qiladi",
        "RAG — ichki hujjatlar bazasini ulab, modelning weights lariga tegmaslik",
        "Fine-tuning — modelni yangi weights bilan qayta o'qitib, tezroq qilish",
        "Pre-training — modelni noldan faqat bank hujjatlarida o'qitib chiqish"
      ],
      answer: [1],
      explain: "Model biror narsani bilmasa (hujjatlar, ichki qoidalar), RAG kerak: baza kengaytirilgan kontekst uchun kutubxona bo'ladi. Prompt engineering format va ohang uchun, fine-tuning esa qimmat va faqat qolganlari yetmasa ishlatiladi.",
      lesson: { title: "Prompt engineering vs Fine-tuning vs RAG", href: "08-Prompt-engineering-vs-Fine-tuning-vs-RAG.md" }
    },
    {
      q: "365 jamoasi GPT asosidagi intervyu simulyatorida nega fine-tuning ishlatmadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Fine-tuning modelning weights lariga umuman ta'sir qilmaydi, natija o'zgarmaydi",
        "O'sha paytda OpenAI fine-tuning'i ochiq bo'lmagan eksperimental dastur edi",
        "RAG va fine-tuning'ni bitta loyihada birga ishlatib bo'lmaydi, ular to'qnashadi",
        "Ularga yaxshi umumlashtiradigan, sharoitga moslashadigan bot kerak edi",
        "Prompt engineering fine-tuning'dan qimmatroq va sekinroq bo'lib chiqdi"
      ],
      answer: [1, 3],
      explain: "Fine-tuning o'sha paytda ochiq emas edi, mavjud bo'lganda ham to'g'ri kelmasdi: u modelni torroq va tezroq qiladi, ularga esa keng va moslashuvchan bot kerak edi. Natijada RAG va eng ko'p vaqt olgan prompt engineering ishlatildi.",
      lesson: { title: "Prompt engineering vs Fine-tuning vs RAG", href: "08-Prompt-engineering-vs-Fine-tuning-vs-RAG.md" }
    },
    {
      q: "Sam Altman bashoratiga ko'ra, kelajakda ko'pchilik tashkilotlar nima qiladi?",
      type: "single",
      options: [
        "Ilovaga xos ichki modellar quradi yoki foundation modellar ustiga quradi",
        "Har biri noldan o'zining alohida foundation modelini quradi",
        "Faqat davlatlar qurgan foundation modellardan foydalanishga majbur bo'ladi",
        "Tor vazifali image recognition va time series modellariga qaytadi"
      ],
      answer: [0],
      explain: "Altman fikricha, o'z foundation modelini faqat kam tashkilot — yirik texnologiya kompaniyalari va ba'zi davlatlar quradi, qolganlar ustiga quradi. Ma'ruzachi esa open source hamjamiyat bu bashoratni nohaq chiqarishi mumkinligini qo'shadi.",
      lesson: { title: "Foundation modellarning ahamiyati", href: "09-The-importance-of-foundation-models.md" }
    },
    {
      q: "Agar hamma kompaniya bitta API chaqiruvi bilan bir xil OpenAI modellaridan foydalansa, darsga ko'ra raqobatdagi haqiqiy farqlovchi omil nima bo'ladi?",
      type: "single",
      options: [
        "Eng ko'p API chaqiruvi uchun pul to'lay oladigan kompaniyaning byudjeti",
        "OpenAI bilan birinchi bo'lib eksklyuziv shartnoma tuzgan kompaniya",
        "AI ni o'z holatiga moslashtira oladigan ichki AI muhandislari ekspertizasi",
        "AI ni asosiy bo'lmagan faoliyat deb, uni butunlay tashqariga berish"
      ],
      answer: [2],
      explain: "Model hammada bir xil bo'lganda, AI ni aniq qo'llanish holatlariga moslashtirish — prompt engineering, RAG va fine-tuning ekspertizasi — ustunlik beradi. Shuning uchun malakali AI muhandislariga talab keskin oshishi kutilmoqda.",
      lesson: { title: "Buy vs Make — Foundation modellar va shaxsiy modellar", href: "10-Buy-vs-Make.md" }
    }
  ]
};
