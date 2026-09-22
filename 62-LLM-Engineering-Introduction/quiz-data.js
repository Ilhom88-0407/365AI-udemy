window.QUIZ = {
  id: "62",
  title: "LLM Engineering — kirish",
  subtitle: "Ace Interview loyihasi, til va token narxi, kalitsiz mahalliy model, LLMAdapter va o'lchanadigan talablar",
  next: { label: "LLM Engineering — rejalashtirish bosqichi", href: "../63-LLM-Planning-Stage/README.md" },
  questions: [
    {
      q: "Kursning bozor prognozi tekshirildi. Bu kod nimani chiqaradi?",
      code: "b2024, b2033 = 6.4, 140.8\nyil = 2033 - 2024\ncagr = (b2033 / b2024) ** (1 / yil) - 1\nprint(f\"CAGR: {cagr*100:.1f}% yiliga\")",
      type: "single",
      options: [
        "CAGR: 22.0% yiliga",
        "CAGR: 233.3% yiliga",
        "CAGR: 41.0% yiliga",
        "CAGR: 14.7% yiliga"
      ],
      answer: [2],
      explain: "140.8 / 6.4 = 22 marta o'sish, 9 yilda bu yiliga 41.0% ga teng. 22.0 — umumiy o'sish koeffitsienti, yillik foiz emas; 41% smartfon portlashidan (35%) ham tez, ya'ni juda optimistik prognoz.",
      lesson: { title: "Kursga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Ilovangiz asosan o'zbek tilida ishlaydi. Darsdagi o'lchovlarga ko'ra tokenizator bo'yicha qaysi tanlov to'g'ri?",
      type: "single",
      options: [
        "cl100k_base li model, chunki o'zbekcha matn unda 33 token bilan aniqroq kodlanadi",
        "o200k_base li model, chunki bir xil o'zbekcha matn 33 emas, 23 token oladi",
        "Farqi yo'q, chunki ikkala tokenizator ham inglizcha matnni 10 tokenda kodlaydi",
        "Tokenizator ahamiyatsiz, narx faqat matndagi belgilar soniga bog'liq"
      ],
      answer: [1],
      explain: "O'zbekcha namuna cl100k_base da 33, o200k_base da 23 token oldi — yangi tokenizator 1.43× tejamliroq. Inglizchada ikkalasi ham 10 token, shuning uchun farq faqat ingliz bo'lmagan matnda ko'rinadi.",
      lesson: { title: "Kursga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "\"Tashkilotlarning 65% i generativ AI dan muntazam foydalanadi\" degan raqamni ko'rdingiz. Darsga ko'ra qaysi savollarni berish kerak? (bir nechta javob)",
      type: "multi",
      options: [
        "Kim o'lchagan?",
        "Qanday usulda o'lchagan?",
        "Hisobot necha tilga tarjima qilingan?",
        "\"Foydalanadi\" deb nimani ta'riflagan?",
        "Raqam yaxlitlanganmi yoki yo'qmi?"
      ],
      answer: [0, 1, 3],
      explain: "Uchta savol: kim, qanday va nima deb ta'riflagan. McKinsey raqami o'z-o'zini baholovchi anketaga asoslangan va \"qabul qilgan\" ta'rifiga bitta pilot loyiha ham kiradi.",
      lesson: { title: "Kursga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Ikki matnda belgilar soni deyarli bir xil bo'lsa, ularning token soni ham deyarli bir xil bo'ladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Talablar ro'yxatida inglizcha 413, o'zbekcha 380 belgi edi, lekin o200k da tokenlar 68 va 123 — 1.81× farq. Belgi/token nisbati tilga bog'liq.",
      lesson: { title: "Kursga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Qwen2.5-0.5B-Instruct mahalliy modelining GPT-4o ga nisbatan afzalliklari qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Narxi 0 — API kaliti kerak emas",
        "Internet kerak emas, offline ishlaydi",
        "O'zbek tilini katta modeldan yaxshiroq tushunadi",
        "Ma'lumot hech qayerga ketmaydi",
        "Javob sifati GPT-4o dan yuqori"
      ],
      answer: [0, 1, 3],
      explain: "494 M parametrli model bepul, offline va maxfiylikni saqlaydi. Lekin sifati oddiy va o'zbek tilida zaif — u o'zbekcha buzuq javob bergan edi.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Mahalliy modelga \"Ask exactly one question\" deyildi, u esa \"What specific aspect of data science would you like to discuss?\" deb javob berdi. Bu natijadan qanday xulosa chiqadi?",
      type: "single",
      options: [
        "Model buyruqni bajarmadi, chunki javobda umuman savol belgisi yo'q",
        "Model to'liq to'g'ri ishladi, bu haqiqiy va yaxshi tuzilgan HR intervyu savoli",
        "Model faqat internet bo'lmagani uchun yomon javob berdi",
        "Buyruq formal bajarildi, lekin model HR intervyusi rolini tushunmadi"
      ],
      answer: [3],
      explain: "Bu intervyu savoli emas, mavzu tanlash taklifi. Model buyruqni formal bajardi, lekin rolni tushunmadi — shuning uchun kichik modellarda prompt muhandisligi muhimroq.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Soddalashtirilgan LLMAdapter. Kod nimani chiqaradi?",
      code: "class LLMAdapter:\n    def __init__(self, backend=\"mahalliy\"):\n        self.backend = backend\n        if backend == \"mahalliy\":\n            self.model = \"Qwen/Qwen2.5-0.5B-Instruct\"\n        elif backend == \"openai\":\n            self.model = \"gpt-4o-mini\"\n        else:\n            raise ValueError(f\"noma'lum backend: {backend}\")\n\nprint(LLMAdapter(\"openai\").model)\nLLMAdapter(\"gemini\")",
      type: "single",
      options: [
        "gpt-4o-mini, keyin ValueError: noma'lum backend: gemini",
        "gpt-4o-mini, keyin Qwen/Qwen2.5-0.5B-Instruct (standart backend)",
        "Birinchi print qatoridayoq ValueError, chunki model yuklanmagan",
        "openai, keyin ValueError: noma'lum backend: gemini"
      ],
      answer: [0],
      explain: "\"openai\" uchun model gpt-4o-mini bo'ladi. \"gemini\" hech bir shartga tushmaydi va else shoxi ValueError ko'taradi — standart qiymatga jimgina o'tib ketmaydi.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Mahalliy model o'zbekcha salomga \"Sizhi salom! Qaysiz mumkin?\" deb javob berdi. Darsning amaliy tavsiyasi qaysi?",
      type: "single",
      options: [
        "max_new_tokens ni oshirish kerak — model javobni oxirigacha yoza olmadi",
        "Ingliz tilida ishlash, o'zbekcha uchun alohida tarjima qatlami qo'yish",
        "temperature ni oshirib, modelni o'zbekchada ijodiyroq qilish kerak",
        "Tizim promptini o'zbekchada uzunroq yozsa, model grammatikani o'rganib oladi"
      ],
      answer: [1],
      explain: "Model o'zbekcha so'zlarni taniydi, lekin grammatikani bilmaydi: matn bo'lak-bo'lak tokenlanadi va o'quv ma'lumotida o'zbek tili kam. Shuning uchun inglizcha ishlab, tarjimani alohida qatlamga chiqarish tavsiya etiladi.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Kursning oltita talabidan qaysi biri o'lchanmaydi va shuning uchun loyiha uchun eng xavfli?",
      type: "single",
      options: [
        "Foydalanuvchi lavozim va kompaniyani tanlay olishi kerak",
        "HR va texnik intervyularning ikkalasi ham bo'lishi kerak",
        "Ilova real ish intervyusi simulyatsiyasini o'tkaza olishi kerak",
        "Savollar bazasi lavozim va kompaniyaga moslashtirilgan bo'lishi kerak"
      ],
      answer: [2],
      explain: "\"Real\" — subyektiv: ikki kishi bir xil ilovaga turlicha baho beradi, uni hech qachon \"bajarildi\" deb belgilab bo'lmaydi. Qolganlarini UI yoki son orqali tekshirish mumkin.",
      lesson: { title: "Intervyu vositasining xususiyatlari", href: "03-The-Interview-Tools-Specifics.md" }
    },
    {
      q: "Jamoa \"ilova tez ishlasin\" degan talab yozdi. Darsdagi qoidaga ko'ra uning to'g'ri shakli qaysi?",
      type: "single",
      options: [
        "\"Ilova foydalanuvchilarga juda tez va qulay tuyulsin\"",
        "\"Javob 95-protsentilda 3 soniyadan kam bo'lsin\"",
        "\"Ilova raqobatchilardan tezroq ishlasin\"",
        "\"Eng tez model tanlansin va server kuchaytirilsin\""
      ],
      answer: [1],
      explain: "Qoida: har bir talab son bilan tugashi kerak, aks holda u talab emas, orzu. \"95-protsentil < 3 s\" ni o'lchab tekshirish mumkin, qolganlari subyektiv yoki yechimni tavsiflaydi.",
      lesson: { title: "Intervyu vositasining xususiyatlari", href: "03-The-Interview-Tools-Specifics.md" }
    },
    {
      q: "MoSCoW da \"Ovozli interfeys\" W (Won't have) deb yozildi. Qilinmaydigan narsani nega baribir hujjatga yozib qo'yish kerak?",
      type: "single",
      options: [
        "Aks holda u har hafta muhokamaga qaytib, rejani buzadi",
        "W talablar birinchi versiyada eng avval bajariladi",
        "W bo'lmasa, MoSCoW jadvali to'rt harfdan iborat bo'lmay qoladi",
        "W talablar avtomatik ravishda o'lchanadigan hisoblanadi"
      ],
      answer: [0],
      explain: "W = \"bu safar yo'q\". Yozib qo'yilmasa, g'oya qayta-qayta muhokama qilinadi. Shuningdek, Must talablar ulushi 60% dan oshmasligi kerak — hamma narsa Must bo'lsa, hech narsa Must emas.",
      lesson: { title: "Intervyu vositasining xususiyatlari", href: "03-The-Interview-Tools-Specifics.md" }
    },
    {
      q: "Talab klassining soddalashtirilgan varianti. Kod nechani chiqaradi?",
      code: "class Talab:\n    def __init__(self, kod, mezon=None, ustuvorlik=\"M\"):\n        self.kod, self.mezon, self.ustuvorlik = kod, mezon, ustuvorlik\n\n    @property\n    def olchanadi(self):\n        return self.mezon is not None\n\nT = [Talab(\"T1\", \"95-protsentil < 3 s\"), Talab(\"T2\", \"\", \"S\"),\n     Talab(\"T3\", None, \"W\")]\nprint(sum(1 for t in T if t.olchanadi))",
      type: "single",
      options: ["1", "3", "0", "2"],
      answer: [3],
      explain: "olchanadi faqat mezon None emasligini tekshiradi. Bo'sh satr \"\" ham None emas, shuning uchun T1 va T2 hisoblanadi — 2. T2 aslida hech narsani o'lchamaydi, ya'ni bunday tekshiruv bo'sh mezonni ham o'tkazib yuboradi.",
      lesson: { title: "Intervyu vositasining xususiyatlari", href: "03-The-Interview-Tools-Specifics.md" }
    },
    {
      q: "Kategoriya lug'atlari bilan prompt quruvchi. Kod nima qiladi?",
      code: "HR = {\"xulq\": \"Past behavior\", \"boshqotirma\": \"Logic puzzle\"}\nTEXNIK = {\"kod\": \"Write or debug Python code\", \"database\": \"SQL query\"}\n\ndef kategoriya_prompti(tur, kategoriya):\n    xarita = HR if tur == \"hr\" else TEXNIK\n    if kategoriya not in xarita:\n        raise ValueError(f\"noma'lum kategoriya: {kategoriya}\")\n    return f\"Question type: {xarita[kategoriya]}.\"\n\nprint(kategoriya_prompti(\"texnik\", \"kod\"))\nprint(kategoriya_prompti(\"hr\", \"kod\"))",
      type: "single",
      options: [
        "Ikki marta Question type: Write or debug Python code. — xato chiqmaydi",
        "Question type: Write or debug Python code., keyin ValueError: noma'lum kategoriya: kod",
        "Birinchi chaqiruvdayoq ValueError, chunki \"texnik\" qiymati \"hr\" ga teng emas va lug'at topilmaydi",
        "Question type: Write or debug Python code., keyin None — xato chiqmaydi"
      ],
      answer: [1],
      explain: "\"texnik\" uchun TEXNIK lug'ati olinadi va \"kod\" unda bor. \"hr\" uchun esa HR lug'ati olinadi — unda \"kod\" yo'q, shuning uchun ValueError ko'tariladi.",
      lesson: { title: "Intervyu vositasining xususiyatlari", href: "03-The-Interview-Tools-Specifics.md" }
    },
    {
      q: "Batafsil kategoriya promptlari bilan mahalliy model 4 ta kategoriyadan faqat 1 tasida to'g'ri savol berdi. Darsdagi tahlilga ko'ra sabab va yechim qaysi?",
      type: "single",
      options: [
        "Prompt 51 tokenlik — juda uzun; uni 5 tokengacha qisqartirish kerak",
        "Model tasodifiy ishladi; temperature ni oshirsa, to'rttasi ham tuzaladi",
        "Model kod va database ni vazifa emas, mavzu deb tushundi; yechim — few-shot",
        "Kategoriyalar noto'g'ri tanlangan; texnik intervyuni olib tashlab, faqat HR qoldirish kerak"
      ],
      answer: [2],
      explain: "Model har bir kategoriyani \"What is the primary goal of ...?\" qolipiga aylantirdi, ya'ni \"kod yozing\" ni vazifa sifatida emas, mavzu sifatida oldi. Buni few-shot misollar tuzatadi (64-modul).",
      lesson: { title: "Intervyu vositasining xususiyatlari", href: "03-The-Interview-Tools-Specifics.md" }
    },
    {
      q: "Kursning talablar ro'yxatida yo'q, lekin intervyu vositasi uchun kerak bo'lgan talablar qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Ma'lumot maxfiyligi — rezyume qayerga ketadi",
        "Prompt injection himoyasi",
        "Lavozim va kompaniyani tanlash",
        "Adolat — model ismga qarab turlicha baholamasligi",
        "HR va texnik intervyularni qo'llab-quvvatlash"
      ],
      answer: [0, 1, 3],
      explain: "Lavozim/kompaniya tanlash va HR/texnik intervyu kursning o'z ro'yxatida bor. Maxfiylik, prompt injection va adolat esa sanalmagan; adolat eng jiddiysi, chunki vosita odamlarni baholaydi.",
      lesson: { title: "Intervyu vositasining xususiyatlari", href: "03-The-Interview-Tools-Specifics.md" }
    }
  ]
};
