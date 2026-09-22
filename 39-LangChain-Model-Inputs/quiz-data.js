window.QUIZ = {
  id: "39",
  title: "Model kirishlari",
  subtitle: "LangChain Model I/O: ChatOpenAI va seed, xabar sinflari, few-shot, prompt va chat shablonlari, MessagesPlaceholder",
  next: { label: "Chiqish parserlari", href: "../40-LangChain-Output-Parsers/README.md" },
  questions: [
    {
      q: "Darsdagi sxemaga ko'ra quyidagilardan qaysilari LangChain'ning Model I/O moduliga kiradi? (bir nechta javob)",
      type: "multi",
      options: [
        "Prompt template",
        "Output parser",
        "Vector store",
        "Chat model",
        "Text splitter"
      ],
      answer: [0, 1, 3],
      explain: "Model I/O — prompt template, chat model, output parser va example selector. Vector store va text splitter esa Retrieval moduliga tegishli (42-modul).",
      lesson: { title: "LangChain freymvorki", href: "01-The-LangChain-Framework.md" }
    },
    {
      q: "Oddiy str.format() ham joy egallovchini to'ldiradi. Darsga ko'ra PromptTemplate ning asosiy qiymati nimada?",
      type: "single",
      options: [
        "U matnni modelga str.format() dan tezroq yuboradi",
        "U promptdagi tokenlar sonini avtomatik kamaytiradi",
        "U LCEL zanjiriga | orqali ulanadi",
        "U promptni avtomatik ingliz tiliga tarjima qiladi"
      ],
      answer: [2],
      explain: "PromptTemplate input_variables tekshiruvi va xabar rollarini ham beradi, lekin dars asosiy qiymat sifatida LCEL zanjiriga ulanishini (prompt | model | parser) ko'rsatadi.",
      lesson: { title: "LangChain freymvorki", href: "01-The-LangChain-Framework.md" }
    },
    {
      q: "Kursdagi usul bilan seed berildi. Bugungi langchain-openai da bu kod nima chiqaradi?",
      code: "c = ChatOpenAI(model=\"gpt-4o-mini\", model_kwargs={\"seed\": 365})\nprint(c.model_kwargs, c.seed)",
      type: "single",
      options: [
        "{'seed': 365} None — seed faqat model_kwargs ichida qoladi",
        "{} 365 — va seed ni bevosita berish haqida UserWarning chiqadi",
        "TypeError — model_kwargs parametri endi mavjud emas",
        "{'seed': 365} 365 — seed ikkala joyda ham saqlanadi"
      ],
      answer: [1],
      explain: "LangChain seed ni model_kwargs dan chiqarib oladi (model_kwargs bo'sh qoladi) va ogohlantiradi. Zamonaviy yozuv: ChatOpenAI(model=\"gpt-4o-mini\", seed=365).",
      lesson: { title: "ChatOpenAI", href: "02-ChatOpenAI.md" }
    },
    {
      q: "chat.invoke(...) metodi darsga ko'ra qanday kirishlarni qabul qiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Oddiy satr, masalan \"Salom\"",
        "pandas DataFrame obyekti",
        "Xabarlar ro'yxati: [SystemMessage(...), HumanMessage(...)]",
        "Shablon natijasi bo'lgan PromptValue obyekti",
        "Prompt yozilgan .txt faylning yo'li"
      ],
      answer: [0, 2, 3],
      explain: "invoke satr, xabarlar ro'yxati va PromptValue ni qabul qiladi. PromptValue eng muhimi: shablon invoke'ining chiqishi model invoke'ining kirishi bo'lib, zanjir g'oyasini yaratadi.",
      lesson: { title: "ChatOpenAI", href: "02-ChatOpenAI.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "from langchain_core.messages import HumanMessage, AIMessage\n\nprint(HumanMessage(content=\"a\").type, AIMessage(content=\"b\").type)",
      type: "single",
      options: [
        "user assistant",
        "HumanMessage AIMessage",
        "human assistant",
        "human ai"
      ],
      answer: [3],
      explain: "LangChain o'z nomlarini ishlatadi: HumanMessage.type — 'human', AIMessage.type — 'ai'. OpenAI'ga yuborishdan oldin ularni user va assistant ga tarjima qiladi.",
      lesson: { title: "System va human xabarlar", href: "03-System-and-Human-Messages.md" }
    },
    {
      q: "\"Be brief\" sistem xabari bilan model baribir 10 ta nom berdi. Darsdagi qoidaga ko'ra qaysi ko'rsatma yaxshiroq?",
      type: "single",
      options: [
        "\"Please be very, very brief\" — talabni kuchaytirish kifoya",
        "\"List exactly 3 names\" — o'lchanadigan aniq cheklov",
        "\"Be brief\" ni human xabariga ko'chirish",
        "Sistem xabarini butunlay olib tashlash"
      ],
      answer: [1],
      explain: "\"Qisqa\" subyektiv — model o'zi hal qiladi. \"List exactly 3 names\" yoki \"at most 3 words\" kabi aniq son tekshirilishi mumkin bo'lgan natija beradi.",
      lesson: { title: "System va human xabarlar", href: "03-System-and-Human-Messages.md" }
    },
    {
      q: "Aniq sistem xabari bilan sinovda few-shot BILAN ham, SIZ ham 'positive' chiqdi. Dars shundan qanday amaliy tartibni tavsiya qiladi?",
      type: "single",
      options: [
        "Darhol fine-tuning qilish, chunki u eng ishonchli",
        "Har doim kamida 10 ta misol bilan boshlash",
        "Avval aniq sistem prompt, yetmasa 2–3 misol qo'shish",
        "Sistem promptni olib tashlab, faqat misollarga tayanish"
      ],
      answer: [2],
      explain: "Arzondan qimmatga: aniq sistem prompt bepul, misollar esa har chaqiruvda token turadi, fine-tuning faqat ko'p so'rovda. Ko'p dasturchi misollardan boshlab, aniq promptni tashlab ketadi — bu behuda token.",
      lesson: { title: "AI xabarlar — few-shot prompting", href: "04-AI-Messages.md" }
    },
    {
      q: "chat.invoke(tarix) natijasi AIMessage bo'lgani uchun uni tarix ro'yxatiga hech qanday o'zgartirishsiz qo'shib, suhbat \"xotirasi\"ni yuritish mumkin.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Modelning javobi ham AIMessage, shuning uchun tarix.append(javob) yetarli. \"Xotira\" — shunchaki ro'yxatga qo'shish, lekin uning narxi O(n²) o'sadi.",
      lesson: { title: "AI xabarlar — few-shot prompting", href: "04-AI-Messages.md" }
    },
    {
      q: "Bu kod ishga tushirilganda nima bo'ladi?",
      code: "from langchain_core.prompts import ChatPromptTemplate\n\nct = ChatPromptTemplate.from_messages([\n    (\"human\", 'JSON qaytaring: {\"a\": 1} va {savol}')])\nct.invoke({\"savol\": \"test\"})",
      type: "single",
      options: [
        "KeyError: shablon \"a\" ni o'zgaruvchi deb hisoblab, uni topa olmaydi",
        "Matn to'g'ri to'ldiriladi: JSON qaytaring: {\"a\": 1} va test",
        "ValueError: human roli JSON matnini qabul qilmaydi",
        "Xato yo'q, lekin {\"a\": 1} qismi matndan jimgina o'chiriladi"
      ],
      answer: [0],
      explain: "Figurali qavs ichidagi \"a\" o'zgaruvchi deb olinadi: input_variables = ['\"a\"', 'savol'] va invoke KeyError beradi. Xato xabarining o'zi {{...}} bilan ekranlashni maslahat beradi.",
      lesson: { title: "Prompt shablonlari va prompt qiymatlari", href: "05-Prompt-Templates-and-Prompt-Values.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "from langchain_core.prompts import PromptTemplate\n\nT = \"{description}\\nI adopted a {pet}. Suggest some {pet} names?\"\npt = PromptTemplate.from_template(T)\nprint(pt.input_variables)",
      type: "single",
      options: [
        "['description', 'pet', 'pet']",
        "['pet']",
        "['description', 'pet']",
        "[] — ro'yxatni qo'lda berish kerak"
      ],
      answer: [2],
      explain: "input_variables shablondagi {...} lardan avtomatik aniqlanadi va {pet} ikki marta ishlatilsa ham ro'yxatda bir marta chiqadi.",
      lesson: { title: "Prompt shablonlari va prompt qiymatlari", href: "05-Prompt-Templates-and-Prompt-Values.md" }
    },
    {
      q: "Promptga {\"ism\": \"...\"} ko'rinishidagi JSON namunani qo'ymoqchisiz, lekin shablon xato beryapti. Qaysi yozuv muammoni hal qiladi?",
      type: "single",
      options: [
        "Namunani uch qavatli qo'shtirnoq ichiga olish",
        "Qo'shtirnoqlarni olib, {ism: ...} deb yozish",
        "Ikki qavat figurali qavs: {{\"ism\": \"...\"}}",
        "Namunani human o'rniga system xabariga ko'chirish"
      ],
      answer: [2],
      explain: "{{ va }} shablonda oddiy figurali qavsga aylanadi. Boshqa yechimlar — .partial(namuna=...) yoki namunani umuman qo'ymay response_format ishlatish; {ism: ...} esa baribir o'zgaruvchi deb olinadi.",
      lesson: { title: "Prompt shablonlari va prompt qiymatlari", href: "05-Prompt-Templates-and-Prompt-Values.md" }
    },
    {
      q: "Chatbot shabloniga oldingi suhbatdagi xabarlar ro'yxatini (human va ai) sistem xabari bilan yangi savol orasiga qo'yish kerak. Qaysi vosita mos?",
      type: "single",
      options: [
        "MessagesPlaceholder(\"tarix\")",
        "HumanMessagePromptTemplate.from_template(\"{tarix}\")",
        "PromptTemplate.from_template(\"{tarix}\")",
        "FewShotChatMessagePromptTemplate(examples=tarix)"
      ],
      answer: [0],
      explain: "MessagesPlaceholder shablonga butun xabarlar ro'yxatini qo'yadi — langchain.memory olib tashlangach, zamonaviy xotira aynan shu naqsh bilan quriladi. {tarix} joy egallovchisi esa ro'yxatni bitta matnga aylantirib yuborardi.",
      lesson: { title: "Chat prompt shablonlari va chat prompt qiymatlari", href: "06-Chat-Prompt-Templates.md" }
    },
    {
      q: "Kursdagi sinf yozuvi va kortej yozuvi solishtirildi. Kod nima chiqaradi?",
      code: "a = ChatPromptTemplate.from_messages([\n    SystemMessagePromptTemplate.from_template(\"{d}\"),\n    HumanMessagePromptTemplate.from_template(\"{q}\")])\nb = ChatPromptTemplate.from_messages([(\"system\", \"{d}\"), (\"human\", \"{q}\")])\n\nprint(a.invoke({\"d\": \"X\", \"q\": \"Y\"}).messages ==\n      b.invoke({\"d\": \"X\", \"q\": \"Y\"}).messages)",
      type: "single",
      options: [
        "False",
        "KeyError",
        "TypeError",
        "True"
      ],
      answer: [3],
      explain: "Ikkala shablon ham [SystemMessage(content='X'), HumanMessage(content='Y')] beradi. Kortejlar — kamroq import va kamroq kod; sinflar faqat qo'shimcha parametrlar kerak bo'lganda kerak.",
      lesson: { title: "Chat prompt shablonlari va chat prompt qiymatlari", href: "06-Chat-Prompt-Templates.md" }
    },
    {
      q: "FewShotChatMessagePromptTemplate bilan qurilgan shablonga yangi \"parrot\" misolini qo'shish uchun nima qilinadi?",
      type: "single",
      options: [
        "Yangi HumanMessage va AIMessage o'zgaruvchilarini yaratib, shablonga qo'shish",
        "examples ro'yxatiga bitta yangi lug'at qo'shish",
        "example_prompt shablonini yangi misol uchun qayta yozish",
        "input_variables ro'yxatiga \"parrot\" so'zini qo'shish"
      ],
      answer: [1],
      explain: "Misollar lug'atlar ro'yxati sifatida saqlanadi, shuning uchun examples.append({\"pet\": \"parrot\", \"response\": \"...\"}) yetarli. Har misol uchun ikkita o'zgaruvchi yaratish 4-darsdagi miqyoslanmaydigan usul edi.",
      lesson: { title: "Few-shot chat xabar shablonlari", href: "07-Few-Shot-Chat-Message-Prompt-Templates.md" }
    },
    {
      q: "Sizda 100 ta few-shot misol bor, lekin har chaqiruvda faqat savolga eng o'xshash 3 tasini yubormoqchisiz. Qaysi vosita mos?",
      type: "single",
      options: [
        "LengthBasedExampleSelector, max_length=3",
        "MessagesPlaceholder(\"examples\")",
        "examples=examples[:3] deb birinchi uchtasini berish",
        "SemanticSimilarityExampleSelector"
      ],
      answer: [3],
      explain: "Semantik selektor savolga o'xshash misollarni tanlaydi (embedding kerak — 42-modul): sifat yuqori, narx past. LengthBasedExampleSelector esa faqat uzunlik chegarasiga qaraydi, uning max_length i ham token emas, so'z.",
      lesson: { title: "Few-shot chat xabar shablonlari", href: "07-Few-Shot-Chat-Message-Prompt-Templates.md" }
    }
  ]
};
