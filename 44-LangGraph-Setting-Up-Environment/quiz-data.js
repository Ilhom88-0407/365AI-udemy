window.QUIZ = {
  id: "44",
  title: "LangGraph — muhitni sozlash",
  subtitle: "venv, paketlar, uchta model varianti (OpenAI, Ollama, FakeListChatModel), grandalf, requirements.txt va Windows'da UTF-8",
  next: { label: "Graf komponentlari va amalga oshirish", href: "../45-LangGraph-Graph-Components/README.md" },
  questions: [
    {
      q: "Kurs Anaconda va conda muhitini ishlatadi. Darsga ko'ra LangGraph bo'limini boshlash uchun nima yetarli?",
      type: "single",
      options: [
        "Faqat Anaconda, chunki langgraph conda kanalisiz o'rnatilmaydi",
        "Oddiy python -m venv bilan yaratilgan virtual muhit",
        "Hech qanday muhit kerak emas, paketlarni global o'rnatish yetadi",
        "Docker konteyneri, chunki LangGraph faqat Linux'da ishlaydi"
      ],
      answer: [1],
      explain: "Darsda Anaconda shart emasligi, oddiy venv yetishi ta'kidlanadi. Global o'rnatish esa paket ziddiyatlarini boshqa loyihalarga ham tarqatadi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Nima uchun loyiha uchun alohida virtual muhit yaratish foydali? (bir nechta javob)",
      type: "multi",
      options: [
        "Paket ziddiyatlari boshqa loyihalarga tegmaydi",
        "Biror narsa buzilsa, muhitni o'chirib qayta yaratish mumkin",
        "Virtual muhit modelning javob sifatini oshiradi",
        "requirements.txt bilan boshqa mashinada aynan takrorlash mumkin",
        "Virtual muhitda API kaliti avtomatik yaratiladi"
      ],
      answer: [0, 1, 3],
      explain: "Alohida muhit ziddiyatlarni ajratadi, qayta yaratishni osonlashtiradi va requirements.txt bilan takrorlanadi. Model sifati yoki API kalitiga uning aloqasi yo'q.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Kurs Python 3.11.11 ni aytadi. Kompyuteringizda Python 3.12 o'rnatilgan. Darsga ko'ra nima qilasiz?",
      type: "single",
      options: [
        "3.12 ni o'chirib, aynan 3.11.11 ni o'rnatasiz",
        "3.9 ga tushirasiz, chunki LangGraph yangi versiyalarda ishlamaydi",
        "3.12 bilan davom etasiz, chunki LangGraph 3.10+ da ishlaydi",
        "Faqat conda orqali 3.11.11 muhitini yaratasiz"
      ],
      answer: [2],
      explain: "Darsga ko'ra 3.11.11 shart emas: LangGraph 3.10+ da ishlaydi, mualliflar 3.14 da sinab ko'rgan.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "pip install langgraph buyrug'i o'zi bilan qaysi paketlarni olib keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "langgraph-checkpoint",
        "langgraph-prebuilt",
        "langchain-openai",
        "langgraph-sdk"
      ],
      answer: [0, 1, 3],
      explain: "langgraph o'zi bilan checkpointer asosi, tayyor agentlar va server bilan ishlash paketlarini olib keladi. langchain-openai esa alohida, ixtiyoriy o'rnatiladi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Bu kod nimani chiqaradi (oxirgi qator)?",
      code: "from langchain_core.language_models.fake_chat_models import FakeListChatModel\n\nchat = FakeListChatModel(responses=[\"Birinchi javob.\", \"Ikkinchi javob.\"])\nchat.invoke(\"savol\")\nchat.invoke(\"yana\")\nprint(chat.invoke(\"uchinchi\").content)",
      type: "single",
      options: [
        "Ikkinchi javob.",
        "Xato: javoblar ro'yxati tugadi",
        "Birinchi javob.",
        "Bo'sh satr chiqadi"
      ],
      answer: [2],
      explain: "FakeListChatModel javoblarni navbat bilan qaytaradi va ro'yxat tugagach boshidan sikl qiladi, shuning uchun uchinchi chaqiruv yana \"Birinchi javob.\" beradi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Darsga ko'ra LangGraph'ni o'rganish uchun nega aynan FakeListChatModel eng yaxshi variant hisoblanadi?",
      type: "single",
      options: [
        "Bepul, tez va takrorlanuvchan — xato grafda ekani aniq ko'rinadi",
        "U gpt-4o dan ham sifatliroq javob beradi va internet talab qilmaydi",
        "U faqat o'zbek tilidagi savollarga to'g'ri javob bera oladigan yagona model",
        "U grafni avtomatik chizadi, shuning uchun grandalf o'rnatish shart emas"
      ],
      answer: [0],
      explain: "LangGraph grafni boshqarish haqida, model sifati haqida emas. Soxta model bepul, tez va har safar bir xil javob beradi, shuning uchun muammo graf mantiqida ekanini aniq ko'rasiz.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Jamoa chatbot javoblarining sifati va to'g'riligini baholamoqchi. FakeListChatModel bu vazifaga mos keladimi?",
      type: "single",
      options: [
        "Ha, chunki interfeysi ChatOpenAI bilan bir xil",
        "Ha, chunki u takrorlanuvchan va bepul",
        "Yo'q, chunki u LangGraph grafiga ulanmaydi",
        "Yo'q, chunki javoblari soxta va sifatni sinab bo'lmaydi"
      ],
      answer: [3],
      explain: "Darsda ogohlantiriladi: FakeListChatModel javoblari soxta, shuning uchun javob sifatini sinab bo'lmaydi. U grafga bemalol ulanadi, faqat sifat uchun ChatOpenAI yoki Ollama kerak.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Darsdagi model_ol() funksiyasi OPENAI_API_KEY yo'q va Ollama ishga tushirilmagan kompyuterda nima qaytaradi?",
      code: "def model_ol(temperature=0, seed=365):\n    if os.getenv(\"OPENAI_API_KEY\"):\n        return ChatOpenAI(model=\"gpt-4o-mini\", temperature=temperature, seed=seed)\n    try:\n        m = ChatOllama(model=\"qwen2.5:7b\", temperature=temperature)\n        m.invoke(\"test\")\n        return m\n    except Exception:\n        pass\n    return FakeListChatModel(responses=[\"Sinov javobi.\"] * 100)",
      type: "single",
      options: [
        "ChatOllama obyektini, chunki u try ichida yaratiladi",
        "FakeListChatModel obyektini",
        "None qiymatini, chunki xato ushlab qolindi",
        "Exception ko'tariladi va dastur to'xtaydi"
      ],
      answer: [1],
      explain: "Kalit yo'q bo'lsa birinchi shart o'tmaydi. m.invoke(\"test\") Ollama ishlamagani uchun xato beradi, except uni ushlaydi va funksiya oxiridagi FakeListChatModel qaytariladi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Kurs gpt-4o ishlatadi. Darsga ko'ra bu bo'lim uchun qaysi model yetarli va qanchalik arzon?",
      type: "single",
      options: [
        "gpt-4o-mini — taxminan 17 marta arzon",
        "gpt-4o-mini — taxminan 2 marta arzon",
        "qwen2.5:7b — OpenAI orqali 17 marta arzon",
        "gpt-3.5 — taxminan 100 marta arzon"
      ],
      answer: [0],
      explain: "Darsda bo'lim uchun gpt-4o-mini yetishi va u 17× arzonligi aytiladi. qwen2.5:7b esa OpenAI emas, Ollama orqali mahalliy va bepul ishlaydi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Bu tekshiruv skripti nimani chiqaradi?",
      code: "from typing_extensions import TypedDict\nfrom langgraph.graph import START, END, StateGraph\n\nclass S(TypedDict):\n    n: int\n\ng = StateGraph(S)\ng.add_node(\"qosh\", lambda s: {\"n\": s[\"n\"] + 1})\ng.add_edge(START, \"qosh\"); g.add_edge(\"qosh\", END)\nprint(g.compile().invoke({\"n\": 41}))",
      type: "single",
      options: [
        "{'n': 41}",
        "42",
        "{'n': 42}",
        "Xato: model berilmagan"
      ],
      answer: [2],
      explain: "Yagona tugun n ni bittaga oshiradi va invoke butun holat lug'atini qaytaradi: {'n': 42}. Tugun oddiy funksiya, shuning uchun model umuman kerak emas.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "graph_compiled.get_graph().draw_ascii() chaqiruvi ImportError berdi. Eng ehtimoliy sabab nima?",
      type: "single",
      options: [
        "OPENAI_API_KEY o'rnatilmagan",
        "Graf compile() qilinmagan",
        "PYTHONIOENCODING utf-8 ga sozlanmagan",
        "grandalf paketi o'rnatilmagan"
      ],
      answer: [3],
      explain: "draw_ascii() grafni ASCII da chizish uchun grandalf paketini talab qiladi, usiz ImportError chiqadi. Yechim: pip install grandalf.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "draw_mermaid_png() internetsiz ham ishlaydi, draw_mermaid() esa internet talab qiladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Aksincha: draw_mermaid() shunchaki mermaid matnini qaytaradi, PNG yaratuvchi draw_mermaid_png() esa internet talab qiladi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "requirements.txt va pip freeze > requirements.lock.txt bilan olingan fayl farqi qanday?",
      type: "single",
      options: [
        "Ikkalasi bir xil, lock fayl faqat zaxira nusxa",
        "requirements.txt — oraliq versiyalar, lock fayl — aniq o'rnatilgan versiyalar",
        "requirements.txt aniq versiyalarni, lock fayl esa faqat paket nomlarini saqlaydi",
        "lock fayl faqat Anaconda muhitida ishlaydi, requirements.txt esa venv'da"
      ],
      answer: [1],
      explain: "Darsga ko'ra requirements.txt — oraliq (masalan, langgraph>=1.0), requirements.lock.txt esa pip freeze bergan aynan o'rnatilgan versiyalar.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Windows'da o'zbekcha matn chiqarganda UnicodeEncodeError: 'charmap' codec ... xatosi chiqdi. Qaysi yechimlar darsda keltirilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "PowerShell'da $env:PYTHONIOENCODING=\"utf-8\" o'rnatish",
        "Fayl boshida sys.stdout.reconfigure(encoding=\"utf-8\") chaqirish",
        "langgraph ni 0.x versiyasiga tushirish",
        "cmd'da set PYTHONIOENCODING=utf-8 o'rnatish",
        "Barcha o'zbekcha harflarni lotin ASCII ga almashtirish"
      ],
      answer: [0, 1, 3],
      explain: "Darsda uchta yechim bor: cmd yoki PowerShell'da PYTHONIOENCODING ni utf-8 ga o'rnatish yoki sys.stdout.reconfigure(encoding=\"utf-8\"). Versiyani tushirish muammoni hal qilmaydi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    },
    {
      q: "Suhbatni JSON faylga saqlayapsiz va o'zbekcha matn faylda buzilmasdan, o'qiladigan holda qolishi kerak. Qaysi variant to'g'ri?",
      type: "single",
      options: [
        "open(\"suhbat.json\", \"w\") va json.dump(data, f)",
        "open(\"suhbat.json\", \"w\", encoding=\"utf-8\") va json.dump(data, f)",
        "open(\"suhbat.json\", \"w\") va json.dump(data, f, ensure_ascii=False)",
        "open(\"suhbat.json\", \"w\", encoding=\"utf-8\") va json.dump(data, f, ensure_ascii=False)"
      ],
      answer: [3],
      explain: "Darsga ko'ra faylni doim encoding=\"utf-8\" bilan ochish va json.dump ga ensure_ascii=False berish kerak. Faqat bittasi bo'lsa matn yo buzilishi, yo kodlangan belgilar bilan o'qib bo'lmaydigan bo'lib qolishi mumkin.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-the-Environment.md" }
    }
  ]
};
