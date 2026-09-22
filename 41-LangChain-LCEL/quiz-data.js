window.QUIZ = {
  id: "41",
  title: "LangChain Expression Language (LCEL)",
  subtitle: "| operatori, batch va stream, Runnable metodlari, RunnablePassthrough, RunnableParallel, RunnableLambda va @chain",
  next: { label: "LangChain — RAG (Retrieval Augmented Generation)", href: "../42-LangChain-RAG/README.md" },
  questions: [
    {
      q: "Bu kod nimani chop etadi?",
      code: "from langchain_core.runnables import RunnableLambda\n\na = RunnableLambda(lambda x: sum(x))\nb = RunnableLambda(lambda x: x ** 2)\nchain = a | b\nprint(type(chain).__name__, chain.invoke([1, 2, 5]))",
      type: "single",
      options: [
        "RunnableLambda 64",
        "RunnableSequence 8",
        "RunnableSequence 64",
        "RunnableParallel [1, 4, 25]"
      ],
      answer: [2],
      explain: "a | b Runnable'ning __or__ metodi orqali RunnableSequence yasaydi. [1, 2, 5] avval sum bilan 8 ga, keyin kvadrat bilan 64 ga aylanadi.",
      lesson: { title: "Prompt, model va parserni ulash", href: "01-Piping-Prompt-Model-Parser.md" }
    },
    {
      q: "Darsdagi \"uchta tuzoq\"ga ko'ra quyidagi zanjirlardan qaysilari xato beradi? (bir nechta javob)",
      type: "multi",
      options: [
        "chat_template | chat | parser",
        "\"salom\" | chat",
        "RunnablePassthrough() | chat",
        "chat | chat_template | parser"
      ],
      answer: [1, 3],
      explain: "Birinchi element Runnable bo'lishi kerak, shuning uchun \"salom\" | chat TypeError beradi. Tartib ham muhim: chat lug'at qabul qilmaydi, u PromptValue kutadi. RunnablePassthrough() bilan boshlash esa tavsiya etilgan yechim.",
      lesson: { title: "Prompt, model va parserni ulash", href: "01-Piping-Prompt-Model-Parser.md" }
    },
    {
      q: "Har chaqiruvi 0.3 soniya uxlaydigan Runnable bor. Bu kod taxminan qancha vaqt oladi va nimani chop etadi?",
      code: "import time\nfrom langchain_core.runnables import RunnableLambda\n\nsekin = RunnableLambda(lambda x: (time.sleep(0.3), x * 2)[1])\nr = sekin.batch(list(range(4)), config={\"max_concurrency\": 2})\nprint(r)",
      type: "single",
      options: [
        "~0.30s, [0, 2, 4, 6]",
        "~0.60s, [0, 2, 4, 6]",
        "~1.20s, [0, 2, 4, 6]",
        "~0.60s, [0, 1, 2, 3]"
      ],
      answer: [1],
      explain: "max_concurrency=2 bo'lganda 4 ta so'rov 2 tadan ikki to'lqinda ketadi: 2 × 0.3 = 0.60s. Cheklovsiz batch 0.30s, ketma-ket esa 1.20s olardi; natija har doim x * 2.",
      lesson: { title: "Batching — parallel bajarish", href: "02-Batching.md" }
    },
    {
      q: "Siz 100 ta so'rovni chain.batch() bilan yubordingiz, ulardan bittasi xato berdi. Qolgan 99 ta natijani yo'qotmaslik uchun nima qilish kerak?",
      type: "single",
      options: [
        "batch() ga return_exceptions=True berib, natijalar ichidan Exception'larni ajratish",
        "batch() o'rniga batch_as_completed() ishlatish — u xatolarni o'zi o'tkazib yuboradi",
        "max_concurrency ni 1 ga tushirish, shunda xato boshqa so'rovlarga ta'sir qilmaydi",
        "abatch() ishlatish, chunki async versiya xatoda to'xtamaydi"
      ],
      answer: [0],
      explain: "return_exceptions=True bo'lmasa, bitta xato butun batchni to'xtatadi. U bilan xatoli so'rov o'rnida Exception obyekti qaytadi, qolganlari esa odatdagidek keladi.",
      lesson: { title: "Batching — parallel bajarish", href: "02-Batching.md" }
    },
    {
      q: "Chatbot UI'da javobni bo'lakma-bo'lak ko'rsatmoqchisiz. Darsga ko'ra qaysi parser bilan oqim to'liq ishlamaydi va natija faqat oxirida keladi?",
      type: "single",
      options: [
        "StrOutputParser",
        "CommaSeparatedListOutputParser",
        "Parsersiz zanjir (AIMessageChunk bo'laklari)",
        "PydanticOutputParser"
      ],
      answer: [3],
      explain: "PydanticOutputParser JSON to'liq bo'lishini kutadi, shuning uchun faqat oxirida beradi. StrOutputParser har bo'lakni beradi, CommaSeparatedListOutputParser esa har element tayyor bo'lganda.",
      lesson: { title: "Streaming", href: "03-Streaming.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "from langchain_core.runnables import RunnableLambda\n\nasosiy = RunnableLambda(lambda x: 1 / 0)\nzaxira1 = RunnableLambda(lambda x: 1 / 0)\nzaxira2 = RunnableLambda(lambda x: \"oxirgi zaxira\")\n\nr = asosiy.with_fallbacks([zaxira1, zaxira2])\nprint(r.invoke(None))",
      type: "single",
      options: [
        "ZeroDivisionError — birinchi zaxira ham sindi",
        "None",
        "oxirgi zaxira",
        "[ZeroDivisionError, 'oxirgi zaxira']"
      ],
      answer: [2],
      explain: "Zaxiralar ketma-ket sinaladi va birinchi ishlagan zaxirada to'xtaydi. zaxira1 ham xato berdi, shuning uchun zaxira2 ning natijasi qaytadi.",
      lesson: { title: "Runnable va RunnableSequence sinflari", href: "04-Runnable-and-RunnableSequence.md" }
    },
    {
      q: "Runnable metodlari va ularning vazifasi bo'yicha qaysi juftliklar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "assign — lug'atga yangi maydon qo'shadi, eskilarini saqlaydi",
        "map — batch kabi alohida parallel chaqiruvlar, faqat zanjir tashqarisida",
        "pick — lug'atdan faqat kerakli maydonlarni oladi",
        "with_fallbacks — xato bo'lsa aynan shu Runnable'ni qayta chaqiradi",
        "bind — parametrlarni (masalan temperature) oldindan biriktiradi"
      ],
      answer: [0, 2, 4],
      explain: "map zanjir ichida ro'yxatning har elementini qayta ishlaydi, batch esa tashqaridagi alohida chaqiruvlar. Xuddi shu Runnable'ni qayta chaqirish — with_retry, with_fallbacks esa boshqa zaxira Runnable'ga o'tadi.",
      lesson: { title: "Runnable va RunnableSequence sinflari", href: "04-Runnable-and-RunnableSequence.md" }
    },
    {
      q: "chat.with_retry(stop_after_attempt=3) ga nima uchun wait_exponential_jitter=True ham qo'shish tavsiya etiladi?",
      type: "single",
      options: [
        "Usiz qayta urinishlar darhol ketadi va rate limit'ni yanada yomonlashtiradi",
        "Usiz with_retry faqat bitta urinish qiladi va stop_after_attempt e'tiborga olinmaydi",
        "U muvaffaqiyatsiz urinishlar narxini OpenAI'dan qaytarib olishga yordam beradi",
        "U xato bo'lganda avtomatik ravishda arzonroq modelga o'tkazadi"
      ],
      answer: [0],
      explain: "wait_exponential_jitter urinishlar orasida ortib boruvchi kutish qo'shadi. Arzonroq modelga o'tish esa with_fallbacks ning vazifasi.",
      lesson: { title: "Runnable va RunnableSequence sinflari", href: "04-Runnable-and-RunnableSequence.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "from langchain_core.runnables import RunnablePassthrough\n\nkirish = {\"savol\": \"Depozit nima?\"}\nb = RunnablePassthrough.assign(kontekst=lambda d: \"hujjat matni\")\nprint(b.invoke(kirish))",
      type: "single",
      options: [
        "[{'savol': 'Depozit nima?'}, 'hujjat matni']",
        "{'savol': 'Depozit nima?', 'kontekst': 'hujjat matni'}",
        "{'savol': 'hujjat matni', 'kontekst': 'Depozit nima?'}",
        "{'savol': 'Depozit nima?', 'kontekst': <lambda>}"
      ],
      answer: [1],
      explain: "assign eski kalitlarni saqlab, yangisini qo'shadi. {\"kontekst\": ...} lug'atini ishlatganda esa savol yo'qolib, faqat kontekst qolardi — RAG'da bu prompt'ni buzadi.",
      lesson: { title: "Zanjirlarni ulash va RunnablePassthrough", href: "05-Piping-Chains-RunnablePassthrough.md" }
    },
    {
      q: "Birinchi zanjir str qaytaradi, ikkinchi zanjirning shabloni esa {tools} o'zgaruvchili lug'at kutadi. Ularni ulash uchun o'rtaga nima qo'yiladi?",
      type: "single",
      options: [
        "StrOutputParser() — u str ni avtomatik {tools} lug'atiga o'raydi",
        "RunnableLambda(str) — natijani qatorga aylantirib shablonga beradi",
        "{\"tools\": RunnablePassthrough()} — str ni kalit ostiga o'raydi",
        "Hech narsa — LangChain yagona str ni o'zi {tools} ga joylaydi"
      ],
      answer: [2],
      explain: "RunnablePassthrough kirishni o'zgarishsiz qaytaradi, lug'at ichida esa u str ni kerakli kalit ostiga o'raydi. Lug'at avtomatik RunnableParallel ga aylanadi.",
      lesson: { title: "Zanjirlarni ulash va RunnablePassthrough", href: "05-Piping-Chains-RunnablePassthrough.md" }
    },
    {
      q: "Zanjiringiz sekin ishlayapti va qaysi qadam qancha vaqt olayotganini hamda nima qaytarayotganini bilmoqchisiz. Qaysi vosita mos?",
      type: "single",
      options: [
        "chain.get_graph().print_ascii() — har tugun yonida vaqt ko'rsatiladi",
        "chain.get_graph().draw_mermaid() — Mermaid diagrammasida qiymatlar chiqadi",
        "chain.steps — har qadamning natijasi va vaqtini saqlab boradi",
        "chain.astream_events(kirish, version=\"v2\") — ish vaqti hodisalarini beradi"
      ],
      answer: [3],
      explain: "Graf faqat statik tuzilishni (ketma-ketlik, parallel shoxlar) ko'rsatadi; vaqt, qiymat va xato joyi uchun astream_events kerak. Eslatma: print_ascii() uchun alohida grandalf paketi o'rnatiladi.",
      lesson: { title: "Runnable'larni grafda ko'rish", href: "06-Graphing-Runnables.md" }
    },
    {
      q: "RunnableParallel ichida 3 ta shox bor, har biri modelni bir marta chaqiradi. Ketma-ket zanjirga nisbatan vaqt va narx qanday o'zgaradi?",
      type: "single",
      options: [
        "Vaqt ham, narx ham kamayadi — shoxlar bitta so'rovga birlashadi",
        "Vaqt taxminan bitta chaqiruvnikicha, narx esa 3 barobar ko'p",
        "Vaqt o'zgarmaydi, narx esa bitta chaqiruvnikiga tushadi",
        "Vaqt 3 barobar oshadi, lekin narx bitta chaqiruvnikiga teng"
      ],
      answer: [1],
      explain: "Parallel shoxlar bir vaqtda ishlaydi (3 ta 0.4s → 0.40s o'lchandi), lekin har shox alohida model chaqiruvi, ya'ni 3× narx. Siz pulga vaqt sotib olasiz.",
      lesson: { title: "RunnableParallel", href: "07-RunnableParallel.md" }
    },
    {
      q: "Shablonda {books} va {projects} bor, lekin oldidagi lug'at {\"kitoblar\": ..., \"loyihalar\": ...} kalitlarini beradi. invoke paytida nima bo'ladi?",
      type: "single",
      options: [
        "KeyError: shablon kutgan va olingan kalitlar ko'rsatiladi",
        "Shablon kalitlarni tartib bo'yicha avtomatik moslaydi",
        "Model bo'sh o'zgaruvchilar bilan javob qaytaradi, xato chiqmaydi",
        "TypeError: lug'atni shablonga ulab bo'lmaydi"
      ],
      answer: [0],
      explain: "RunnableParallel kalitlari shablon o'zgaruvchilari bilan aynan bir xil bo'lishi shart. Aks holda ChatPromptTemplate Expected: ['books', 'projects'] Received: ['kitoblar', 'loyihalar'] deb KeyError beradi.",
      lesson: { title: "RunnableParallel ni boshqa Runnable'lar bilan ulash", href: "08-Piping-RunnableParallel.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "from langchain_core.runnables import RunnableLambda\n\nqisqa = RunnableLambda(lambda d: \"QISQA\")\nuzun = RunnableLambda(lambda d: \"UZUN\")\n\nmarshrut = RunnableLambda(lambda d: qisqa if len(d[\"matn\"]) < 30 else uzun)\nprint(marshrut.invoke({\"matn\": \"salom\"}))",
      type: "single",
      options: [
        "RunnableLambda obyektining tavsifi",
        "UZUN",
        "TypeError: RunnableLambda Runnable qaytara olmaydi",
        "QISQA"
      ],
      answer: [3],
      explain: "RunnableLambda ichida Runnable qaytarilsa, LangChain uni o'sha kirish bilan chaqiradi — bu dinamik marshrutlash. \"salom\" 30 belgidan qisqa, shuning uchun qisqa ishlaydi.",
      lesson: { title: "RunnableLambda", href: "09-RunnableLambda.md" }
    },
    {
      q: "@chain dekoratori bilan belgilangan mening_funksiyam ni keyin oddiy funksiya kabi mening_funksiyam(5) deb chaqirish mumkin.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Dekoratordan keyin u RunnableLambda bo'lib qoladi, funksiya emas — faqat .invoke(5) ishlaydi. Asl funksiya ham kerak bo'lsa, RunnableLambda(mening_funksiyam) bilan alohida o'rash kerak.",
      lesson: { title: "@chain dekoratori", href: "10-The-Chain-Decorator.md" }
    }
  ]
};
