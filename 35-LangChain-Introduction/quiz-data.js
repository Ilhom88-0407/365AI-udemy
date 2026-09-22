window.QUIZ = {
  id: "35",
  title: "LangChain'ga kirish",
  subtitle: "LangChain adapter sifatida, biznes holatlari va PII maskalash, to'rtta komponent va LangChain 1.0 migratsiyasi",
  next: { label: "Tokenlar, modellar va narxlar", href: "../36-LangChain-Tokens-Models-Prices/README.md" },
  questions: [
    {
      q: "Kurs butun bo'lim davomida chatbotning uchta xususiyatiga e'tibor qaratadi. Qaysi moslashtirishlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Holatli (stateful) — oldingi suhbatni eslaydi",
        "Kontekstga xabardor — o'qitilmagan ma'lumot haqida ham javob beradi",
        "Mulohazali (reasoning) — kerakli vositalarni o'zi tanlaydi",
        "Holatli — model suhbatni o'z vaznlarida saqlab boradi",
        "Kontekstga xabardor — model internetni o'zi mustaqil qidiradi"
      ],
      answer: [0, 1, 2],
      explain: "Uchta xususiyat: stateful (xotira, 39-modul), context-aware (RAG, 42-modul) va reasoning (vositalar va agentlar). LLM o'zi stateless — suhbat vaznlarda emas, har safar qayta yuboriladigan tarixda turadi.",
      lesson: { title: "LangChain kursiga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "O'zbekcha javob beradigan chatbot uchun dars sistem promptni qanday yozishni maslahat beradi?",
      type: "single",
      options: [
        "To'liq o'zbekcha — model ko'rsatmani javob tilida aniqroq tushunsin",
        "Ko'rsatma inglizcha, masalan \"You are a helpful assistant. Answer in Uzbek.\"",
        "Inglizcha va o'zbekcha aralash — model ikkala tilga ham bir xil moslashsin",
        "Sistem promptni umuman yozmaslik — model tilni savoldan o'zi aniqlaydi"
      ],
      answer: [1],
      explain: "Ko'rsatmalarga bo'ysunish asosan inglizcha matnda o'qitilgan, shuning uchun o'zbekcha ko'rsatmani model e'tiborsiz qoldirishi mumkin. Ko'rsatma inglizcha, javob esa o'zbekcha bo'ladi.",
      lesson: { title: "LangChain kursiga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "OpenAI GPT-4 ning parametrlar sonini rasman 1.7 trillion deb e'lon qilgan.",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "GPT-4 ning parametrlar soni rasmiy sir: internetdagi \"1.7 trillion\" kabi raqamlar tasdiqlanmagan taxmin. GPT-3 niki esa ma'lum — 175 milliard.",
      lesson: { title: "LangChain kursiga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Quyidagi oddiy regex maskalagich ishga tushirildi. Nima chiqadi?",
      code: "import re\nNAQSHLAR = {\n    \"EMAIL\": r\"\\b[\\w.+-]+@[\\w-]+\\.[\\w.]+\\b\",\n    \"KARTA\": r\"\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b\",\n}\nt = \"Mijoz: Alisher Karimov, pochta a.karimov@mail.uz, karta 4276 1234 5678 9012\"\nfor nom, naqsh in NAQSHLAR.items():\n    for m in re.findall(naqsh, t):\n        t = t.replace(m, f\"<{nom}>\")\nprint(t)",
      type: "single",
      options: [
        "Mijoz: <PERSON>, pochta <EMAIL>, karta <KARTA>",
        "Mijoz: Alisher Karimov, pochta a.karimov@mail.uz, karta <KARTA>",
        "Mijoz: <PERSON>, pochta a.karimov@mail.uz, karta 4276 1234 5678 9012",
        "Mijoz: Alisher Karimov, pochta <EMAIL>, karta <KARTA>"
      ],
      answer: [3],
      explain: "Email va karta raqami qat'iy naqshga ega, shuning uchun maskalanadi. Ism esa hech qaysi naqshga tushmaydi — ismlar uchun NER modeli kerak, bu maskalashning eng zaif joyi.",
      lesson: { title: "LangChain'ning biznes qo'llanmalari", href: "02-Business-Applications.md" }
    },
    {
      q: "Adyen tizimi \"support agent copilot\" deb atalgan. Bu nimani anglatadi va nega dars ishlab chiqarishni aynan shunday boshlashni tavsiya qiladi?",
      type: "single",
      options: [
        "LLM javobni taklif qiladi, operator tasdiqlaydi — bu eng xavfsiz naqsh",
        "LLM chiptaga o'zi javob beradi — bu operatorlar sonini tezda kamaytiradi",
        "Operator javob yozadi, LLM faqat imloni tekshiradi — bu eng arzon yo'l",
        "Ikki LLM bir-birini tekshiradi — shunda inson nazorati kerak bo'lmaydi"
      ],
      answer: [0],
      explain: "Copilot — LLM taklif qiladi, inson tasdiqlaydi. Uchala holatda ham (Ally, Adyen, RoboCorp) LLM qaror qabul qilmaydi: bu tasodif emas, balki loyiha naqshi.",
      lesson: { title: "LangChain'ning biznes qo'llanmalari", href: "02-Business-Applications.md" }
    },
    {
      q: "Nega RoboCorp'ning kod yozuvchi yordamchisi Adyen'ning avtomatik javoblariga qaraganda past xavfli hisoblanadi?",
      type: "single",
      options: [
        "Chunki kod yozish uchun RAG kerak emas va model hujjatlarsiz ishlaydi",
        "Chunki kodni yozishda LLM hech qachon yolg'on to'qimaydi",
        "Chunki kod ishlamasa xato darhol ko'rinadi va uni tuzatish arzon",
        "Chunki RoboCorp mijozlari moliyaviy maslahat so'ramaydi va xato yo'q"
      ],
      answer: [2],
      explain: "Kod tekshirilishi mumkin: ishlamasa darhol ma'lum bo'ladi. Fakt aytishda esa xato sezilmay qolishi mumkin. RoboCorp ham RAG ishlatadi — model hujjatlarga asoslanib kod yozadi.",
      lesson: { title: "LangChain'ning biznes qo'llanmalari", href: "02-Business-Applications.md" }
    },
    {
      q: "PII maskalash uchun NER chegarasi 0.9 emas, 0.75 qilib olindi. Buning sababi nima?",
      type: "single",
      options: [
        "0.75 da NER modeli tezroq ishlaydi va maskalash arzonroq tushadi",
        "O'tkazib yuborish ortiqcha maskalashdan qimmat: maxfiy ma'lumot chiqadi",
        "0.9 chegarasi o'zbekcha matndagi ismlarning hech birini topmaydi",
        "Presidio 0.8 dan yuqori ishonch chegarasini qo'llab-quvvatlamaydi"
      ],
      answer: [1],
      explain: "Xavfsizlikda asimmetriya bor: ortiqcha maskalash xulosani biroz noaniq qiladi (arzon), o'tkazib yuborish esa maxfiy ma'lumotni chiqarib yuboradi (qimmat). Shuning uchun chegara pastroq qo'yiladi.",
      lesson: { title: "LangChain'ning biznes qo'llanmalari", href: "02-Business-Applications.md" }
    },
    {
      q: "Loyihada model OpenAI'dan Anthropic'ga almashtirilmoqda. Quyidagi koddan qaysi qismini o'zgartirish kerak?",
      code: "from langchain_openai import ChatOpenAI\nmodel = ChatOpenAI(model=\"gpt-4o-mini\")\n\nzanjir = prompt | model | parser\njavob = zanjir.invoke({\"savol\": \"Salom\"})",
      type: "single",
      options: [
        "Hamma satrni — har provayder uchun zanjir boshqacha quriladi",
        "Faqat oxirgi ikki satrni — invoke Anthropic'da boshqacha chaqiriladi",
        "Import va model satrlarini hamda prompt va parser'ni ham",
        "Faqat import va model = ... satrlarini, qolgan kod bir xil qoladi"
      ],
      answer: [3],
      explain: "LangChain — adapter: provayder almashganda faqat import va model yaratish satri o'zgaradi (masalan, ChatAnthropic). Prompt, zanjir, xotira va RAG kodi o'zgarmaydi.",
      lesson: { title: "LangChain'ni nima kuchli qiladi", href: "03-What-Makes-LangChain-Powerful.md" }
    },
    {
      q: "Har xabarda butun tarix qayta yuboriladi deb hisoblaymiz (har xabar 60 token). Kod nima chiqaradi?",
      code: "def suhbat_narxi(n_xabar, o_rt_token=60):\n    return sum((i + 1) * o_rt_token for i in range(n_xabar))\n\nprint(suhbat_narxi(5))",
      type: "single",
      options: [
        "300",
        "900",
        "360",
        "1500"
      ],
      answer: [1],
      explain: "60 × (1+2+3+4+5) = 60 × 15 = 900 token. Tarix har safar qayta yuborilgani uchun jami narx kvadratik — O(n²) — o'sadi; window xotirasi uni chiziqli qiladi.",
      lesson: { title: "LangChain'ni nima kuchli qiladi", href: "03-What-Makes-LangChain-Powerful.md" }
    },
    {
      q: "Sizning botingiz har doim bir xil ketma-ketlikda ishlaydi: hujjat topish → prompt → javob. Dars nimani tavsiya qiladi?",
      type: "single",
      options: [
        "Agent yozish — u vositalarni o'zi tanlab, oqimni moslashtiradi",
        "Qat'iy zanjir (LCEL) yozish — arzonroq, tezroq va ishonchliroq",
        "Agent yozib, max_iterations ni cheksiz qilib qo'yish",
        "Har savol uchun modelni almashtirib turadigan agent yozish"
      ],
      answer: [1],
      explain: "Oqim oldindan ma'lum bo'lsa, zanjir yozish kerak. Agent faqat oqim haqiqatan noma'lum bo'lganda kerak — u eng noishonchli qism: noto'g'ri vosita, cheksiz sikl, har qadam pul turadi.",
      lesson: { title: "LangChain'ni nima kuchli qiladi", href: "03-What-Makes-LangChain-Powerful.md" }
    },
    {
      q: "Hujjat yuklovchi skanerlangan PDF dan matn o'qiy olmasa, xato (exception) chiqarib ogohlantiradi.",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "Yuklovchi xato bermaydi — u shunchaki bo'sh yoki aralash matn qaytaradi. Skanerlangan PDF da matn yo'q (OCR kerak), shuning uchun page_content ni har doim ko'z bilan tekshirish kerak.",
      lesson: { title: "LangChain'ni nima kuchli qiladi", href: "03-What-Makes-LangChain-Powerful.md" }
    },
    {
      q: "langchain 1.3.17 o'rnatilgan muhitda quyidagi kod nima chiqaradi?",
      code: "import importlib\nfor mod in [\"langchain.chains\", \"langchain.memory\", \"langchain.output_parsers\"]:\n    try:\n        importlib.import_module(mod); print(\"OK  \", mod)\n    except ModuleNotFoundError:\n        print(\"YO'Q\", mod)",
      type: "single",
      options: [
        "Uchala qatorda ham OK — modullar faqat eskirgan deb belgilangan",
        "chains va memory uchun YO'Q, output_parsers uchun OK",
        "Uchala qatorda ham YO'Q — modullar butunlay olib tashlangan",
        "Birinchi qatorda YO'Q, keyin sikl ModuleNotFoundError bilan to'xtaydi"
      ],
      answer: [2],
      explain: "LangChain 1.x da langchain.chains, langchain.memory va langchain.output_parsers umuman mavjud emas. Xato except'da ushlangani uchun sikl to'xtamaydi va uchala qator ham YO'Q chiqadi.",
      lesson: { title: "Kurs nimalarni qamraydi", href: "04-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Eski kurs sinfi va uning zamonaviy o'rnini bosuvchisi to'g'ri juftlangan qatorlarni tanlang. (bir nechta javob)",
      type: "multi",
      options: [
        "LLMChain → prompt | model (LCEL)",
        "ConversationChain → RunnableWithMessageHistory",
        "langchain.chat_models.ChatOpenAI → langchain_openai.ChatOpenAI",
        "langchain_core.prompts → langchain_classic.prompts ga ko'chirilgan",
        "LCEL zanjirlari → faqat langchain_classic ichida ishlaydi"
      ],
      answer: [0, 1, 2],
      explain: "Jadvalga ko'ra LLMChain o'rnida prompt | model, ConversationChain o'rnida RunnableWithMessageHistory, ChatOpenAI esa langchain_openai paketida. langchain_core va LCEL joyida qolgan va to'liq ishlaydi.",
      lesson: { title: "Kurs nimalarni qamraydi", href: "04-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Siz yangi ishlab chiqarish loyihasini boshlayapsiz va kursdagi LLMChain misoliga duch keldingiz. Qaysi yo'l to'g'ri?",
      type: "single",
      options: [
        "pip install langchain-classic va from langchain_classic.chains import LLMChain",
        "langchain 0.1 ni o'rnatib, kursdagi kodni o'zgartirmasdan ishlatish",
        "LCEL bilan qayta yozish: zanjir = prompt | model | parser",
        "LLMChain ni o'zingiz langchain.chains nomli modul qilib yozish"
      ],
      answer: [2],
      explain: "langchain-classic — tez yo'l, lekin u arxiv paket (v1.0.8) va yangi loyihada ishlatilmasligi kerak. To'g'ri yo'l — LCEL, u eskirmagan va kelajakda ham ishlaydi.",
      lesson: { title: "Kurs nimalarni qamraydi", href: "04-What-Does-the-Course-Cover.md" }
    },
    {
      q: "O'quvchida OpenAI API kaliti yo'q va u kursni o'zbekcha misollar bilan davom ettirmoqchi. Dars qaysi variantni eng yaxshi deb tavsiya qiladi?",
      type: "single",
      options: [
        "Ollama va qwen2.5 — bepul, maxfiy, kurs kodining 95% i o'zgarmaydi",
        "Ollama va llama3.2 modeli — u o'zbekchada eng ko'p o'qitilgan model",
        "Groq bepul kvotasi — tez ishlaydi va ma'lumot hech qayerga chiqmaydi",
        "HuggingFace'ning kichik modeli — sifati gpt-4o bilan deyarli bir xil"
      ],
      answer: [0],
      explain: "Tavsiya — Ollama: bepul, internetsiz, ma'lumot kompyuterdan chiqmaydi. O'zbekcha uchun llama3.2 emas, qwen2.5 tanlanadi — u ko'p tilli ma'lumotda ko'proq o'qitilgan. Bepul kvotali provayderlarda ma'lumot chet elga chiqadi.",
      lesson: { title: "Kurs nimalarni qamraydi", href: "04-What-Does-the-Course-Cover.md" }
    }
  ]
};
