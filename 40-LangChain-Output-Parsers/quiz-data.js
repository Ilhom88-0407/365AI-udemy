window.QUIZ = {
  id: "40",
  title: "Chiqish parserlari",
  subtitle: "StrOutputParser, vergulli ro'yxat parserining jim xatosi, DatetimeOutputParser, Pydantic va with_structured_output",
  next: { label: "LangChain Expression Language (LCEL)", href: "../41-LangChain-LCEL/README.md" },
  questions: [
    {
      q: "Bu kod nima chiqaradi?",
      code: "from langchain_core.output_parsers import StrOutputParser\nfrom langchain_core.messages import AIMessage\n\np = StrOutputParser()\nprint(repr(p.invoke(AIMessage(content=\"Salom\"))), repr(p.invoke(\"oddiy satr\")))",
      type: "single",
      options: [
        "AIMessage(content='Salom') 'oddiy satr'",
        "'Salom', keyin satr uchun TypeError",
        "'Salom' 'oddiy satr'",
        "'Salom' None"
      ],
      answer: [2],
      explain: "StrOutputParser AIMessage dan content ni oladi va oddiy satrni ham qabul qiladi. Shuning uchun satr qaytaradigan mahalliy modellar bilan ham zanjir provayderdan mustaqil bo'ladi.",
      lesson: { title: "String output parser", href: "01-String-Output-Parser.md" }
    },
    {
      q: "r = chat.invoke(...) natijasini StrOutputParser().invoke(r) dan o'tkazgach qaysi ma'lumotlar yo'qoladi? (bir nechta javob)",
      type: "multi",
      options: [
        "finish_reason — javob kesilganmi yoki yo'q",
        "Modelning javob matni (content)",
        "usage_metadata — chaqiruv narxi",
        "Javob bergan modelning aniq versiyasi"
      ],
      answer: [0, 2, 3],
      explain: "Parser content dan boshqa hamma narsani tashlaydi: response_metadata (finish_reason, model) va usage_metadata. Matnning o'zi esa aynan natija sifatida qoladi.",
      lesson: { title: "String output parser", href: "01-String-Output-Parser.md" }
    },
    {
      q: "Zanjiringiz oxirida StrOutputParser turibdi, lekin siz kesilgan javoblar va token sarfini jurnalga yozmoqchisiz. Dars nimani tavsiya qiladi?",
      type: "single",
      options: [
        "StrOutputParser dan keyin natija satrining uzunligini o'lchash kifoya",
        "Metadatani parserdan oldin olish, masalan RunnableLambda bilan",
        "StrOutputParser o'rniga CommaSeparatedListOutputParser qo'yish",
        "Parser tashlagan metadatani keyinroq chat obyektidan so'rash"
      ],
      answer: [1],
      explain: "Metadata faqat AIMessage da bor, shuning uchun uni parserdan oldin olish kerak — oddiy funksiyada yoki LCEL'da RunnableLambda bilan (41-modul). Satr uzunligidan esa javob kesilganini bilib bo'lmaydi.",
      lesson: { title: "String output parser", href: "01-String-Output-Parser.md" }
    },
    {
      q: "Model \"and\" bog'lovchisi bilan javob berdi. Parser nima qaytaradi?",
      code: "from langchain_core.output_parsers import CommaSeparatedListOutputParser\n\nlp = CommaSeparatedListOutputParser()\nprint(lp.invoke(\"Bark Twain, Sir Waggington, and Chewbarka\"))",
      type: "single",
      options: [
        "['Bark Twain', 'Sir Waggington', 'Chewbarka']",
        "OutputParserException — \"and\" ruxsat etilmagan",
        "['Bark Twain, Sir Waggington, and Chewbarka']",
        "['Bark Twain', 'Sir Waggington', 'and Chewbarka']"
      ],
      answer: [3],
      explain: "Parser shunchaki vergul bo'yicha bo'ladi, shuning uchun \"and\" uchinchi elementda qoladi. U xato ham bermaydi — bu jim noto'g'ri natija.",
      lesson: { title: "Vergul bilan ajratilgan ro'yxat parseri", href: "02-Comma-Separated-List-Output-Parser.md" }
    },
    {
      q: "CommaSeparatedListOutputParser model formatni buzganda (masalan, muqaddima yozganda) OutputParserException beradi, shuning uchun xatoni darhol sezasiz.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "U doim ro'yxat qaytaradi: \"Here are some names: Bark Twain\" ham birinchi element bo'lib chiqadi. Xato bermaydigan parser eng qimmat xatoni beradi — siz muammoni bilmay qolasiz.",
      lesson: { title: "Vergul bilan ajratilgan ro'yxat parseri", href: "02-Comma-Separated-List-Output-Parser.md" }
    },
    {
      q: "Model raqamli ro'yxat qaytardi, parser esa vergulli ro'yxat kutadi. Kurs modelga kerakli formatni qanday aytadi?",
      type: "single",
      options: [
        "parser.get_format_instructions() matnini promptga qo'shadi",
        "Model sozlamalarida output_format=\"csv\" parametrini beradi",
        "Parserni modelning o'ziga argument sifatida uzatadi",
        "temperature=0 qo'yib, modeldan qat'iy format kutadi"
      ],
      answer: [0],
      explain: "Parser o'zi ko'rsatma beradi: \"Your response should be a list of comma separated values...\". Bu matn human xabariga qo'shiladi va model shu formatda javob beradi.",
      lesson: { title: "Vergul bilan ajratilgan ro'yxat parseri", href: "02-Comma-Separated-List-Output-Parser.md" }
    },
    {
      q: "Darsdagi to'rtta himoya qatlamidan qaysi biri eng arzon va eng foydali deb ko'rsatilgan?",
      type: "single",
      options: [
        "Muqaddimani ikki nuqta bo'yicha kesib tashlash",
        "Har bir elementdagi raqam va nuqtalarni tozalash",
        "Promptda \"exactly 3\" deb yozib, elementlar sonini tekshirish",
        "Juda uzun elementlarni ro'yxatdan chiqarib tashlash"
      ],
      answer: [2],
      explain: "Sonini tekshirish eng arzon himoya: aniq son so'raladi va natija sanaladi — mos kelmasa, darhol ogohlantirish yoki qayta urinish mumkin.",
      lesson: { title: "Vergul bilan ajratilgan ro'yxat parseri", href: "02-Comma-Separated-List-Output-Parser.md" }
    },
    {
      q: "Toshkentdagi joylar ro'yxati so'raldi: \"Amir Temur maydoni, shahar markazida, Chorsu va Minor\". Dars bu muammoga qanday yechim beradi?",
      type: "single",
      options: [
        "Vergul o'rniga yangi qator yoki ' | ' ajratuvchisini talab qilish",
        "Sistem promptni o'zbekcha yozib, vergulni saqlab qolish",
        "Parserni ikki marta ketma-ket chaqirish",
        "Javobni StrOutputParser bilan olib, uni qo'lda o'qish"
      ],
      answer: [0],
      explain: "O'zbekcha ro'yxatda \"va\" bog'lovchisi element bo'lib qoladi va jumla ichidagi vergul bitta joyni ikkiga bo'ladi. Yangi qator (MarkdownListOutputParser) yoki ' | ' ancha xavfsizroq.",
      lesson: { title: "Vergul bilan ajratilgan ro'yxat parseri", href: "02-Comma-Separated-List-Output-Parser.md" }
    },
    {
      q: "Kursdagi from langchain.output_parsers import DatetimeOutputParser satri bugun ishlamaydi. Darsdagi yechim qaysi?",
      type: "single",
      options: [
        "from langchain_core.output_parsers import DatetimeOutputParser",
        "from langchain_openai import DatetimeOutputParser",
        "pip install langchain-classic, keyin langchain_classic.output_parsers dan import",
        "langchain ni 0.x versiyasiga tushirish — boshqa yo'l yo'q"
      ],
      answer: [2],
      explain: "langchain.output_parsers moduli umuman yo'q; DatetimeOutputParser arxiv paket langchain_classic ga ko'chgan. Zamonaviy muqobil — PydanticOutputParser dagi date turi.",
      lesson: { title: "Datetime parser va zamonaviy muqobillar", href: "03-Datetime-Output-Parser.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "from langchain_classic.output_parsers import DatetimeOutputParser\n\ndp = DatetimeOutputParser()\nfor s in [\"1905-12-16T00:00:00.000000Z\", \"1905-12-16\"]:\n    try:\n        print(dp.invoke(s))\n    except Exception as e:\n        print(type(e).__name__)",
      type: "single",
      options: [
        "1905-12-16 00:00:00, keyin yana 1905-12-16 00:00:00",
        "Ikkala satr uchun ham OutputParserException",
        "1905-12-16 00:00:00, keyin 1905-12-16",
        "1905-12-16 00:00:00, keyin OutputParserException"
      ],
      answer: [3],
      explain: "Parser aynan '%Y-%m-%dT%H:%M:%S.%fZ' formatini talab qiladi, shuning uchun hatto to'g'ri sana 1905-12-16 ham rad etiladi. Yaxshi tomoni — u jim emas, darhol xato beradi.",
      lesson: { title: "Datetime parser va zamonaviy muqobillar", href: "03-Datetime-Output-Parser.md" }
    },
    {
      q: "Model JSON'da yosh maydonini tushirib qoldirdi. Bu kodda nima bo'ladi?",
      code: "from pydantic import BaseModel\nfrom langchain_core.output_parsers import PydanticOutputParser\n\nclass Hayvon(BaseModel):\n    ism: str\n    tur: str\n    yosh: int\n\npp = PydanticOutputParser(pydantic_object=Hayvon)\npp.invoke('{\"ism\": \"Bark Twain\", \"tur\": \"it\"}')",
      type: "single",
      options: [
        "Hayvon(ism='Bark Twain', tur='it', yosh=None) qaytadi",
        "OutputParserException — majburiy yosh maydoni yo'q",
        "Hayvon(ism='Bark Twain', tur='it', yosh=0) qaytadi",
        "Oddiy lug'at {'ism': 'Bark Twain', 'tur': 'it'} qaytadi"
      ],
      answer: [1],
      explain: "PydanticOutputParser JSON'ni parse qiladi va turlar hamda majburiy maydonlarni tekshiradi: yosh yo'q bo'lsa yoki \"uch\" kabi satr bo'lsa — xato beradi.",
      lesson: { title: "Datetime parser va zamonaviy muqobillar", href: "03-Datetime-Output-Parser.md" }
    },
    {
      q: "Darsdagi sinovda JsonOutputParser qaysi kirishlarni muvaffaqiyatli parse qildi? (bir nechta javob)",
      type: "multi",
      options: [
        "'{\"ism\": \"Ali\", \"yosh\": 30}'",
        "'```json\\n{\"ism\": \"Ali\"}\\n```'",
        "'Mana javob: {\"ism\": \"Ali\"}'",
        "'{\"ism\": \"Ali\",}'"
      ],
      answer: [0, 1],
      explain: "JsonOutputParser ```json fence'ini avtomatik tozalaydi, lekin muqaddima va ortiqcha vergulli noto'g'ri JSON xato beradi. Shuning uchun promptda \"Output nothing else\" shart.",
      lesson: { title: "Datetime parser va zamonaviy muqobillar", href: "03-Datetime-Output-Parser.md" }
    },
    {
      q: "Bank murojaatlarini tasniflashda bolim maydoni faqat \"karta\", \"depozit\", \"kredit\" yoki \"boshqa\" bo'lishi kerak. Pydantic modelda buni qanday ta'minlaysiz?",
      type: "single",
      options: [
        "bolim: str = Field(description=\"karta, depozit, kredit yoki boshqa\")",
        "bolim: list[str] — to'rtta qiymatni ro'yxat qilib berish",
        "bolim: Literal[\"karta\", \"depozit\", \"kredit\", \"boshqa\"]",
        "bolim: bool — bo'lim tanlanganmi yoki yo'q"
      ],
      answer: [2],
      explain: "Literal oq ro'yxatni to'g'ridan-to'g'ri sxemaga o'rnatadi: model boshqa qiymat qaytarsa, darhol xato. Field(description=...) esa faqat modelga tavsiya beradi, qiymatni tekshirmaydi.",
      lesson: { title: "Datetime parser va zamonaviy muqobillar", href: "03-Datetime-Output-Parser.md" }
    },
    {
      q: "Nega chat.with_structured_output(Hayvon) PydanticOutputParser dan ishonchliroq deb ko'rsatilgan?",
      type: "single",
      options: [
        "Sxemani provayder kafolatlaydi, parser esa model matnni to'g'ri yozishiga umid qiladi",
        "U javobni tezroq qaytaradi va har chaqiruvda kamroq token sarflaydi",
        "U istalgan mahalliy kichik modelda ham bir xil ishlaydi",
        "U format ko'rsatmasini promptga ikki marta qo'shib yuboradi"
      ],
      answer: [0],
      explain: "with_structured_output sxemani API darajasida uzatadi, shuning uchun promptga ko'rsatma qo'shish ham shart emas. Cheklovi: faqat qo'llab-quvvatlaydigan modellarda (gpt-4o-mini va yangiroq, Claude, Gemini) ishlaydi.",
      lesson: { title: "Datetime parser va zamonaviy muqobillar", href: "03-Datetime-Output-Parser.md" }
    },
    {
      q: "Loyihangiz with_structured_output ni qo'llab-quvvatlamaydigan mahalliy kichik modelda ishlaydi, lekin sizga tipli obyekt kerak. Darsdagi amaliy qoidaga ko'ra nima tanlanadi?",
      type: "single",
      options: [
        "CommaSeparatedListOutputParser — u hech qachon xato bermaydi",
        "DatetimeOutputParser — u eng qat'iy tekshiruvni beradi",
        "Faqat StrOutputParser, tekshiruvsiz",
        "PydanticOutputParser va xato bo'lsa qayta urinish"
      ],
      answer: [3],
      explain: "Qoida: with_structured_output bo'lsa — uni ishlating; bo'lmasa — PydanticOutputParser va qayta urinish (xatoni modelga ko'rsatib, cheklangan marta); juda oddiy vazifada — StrOutputParser va qo'lda tekshiruv.",
      lesson: { title: "Datetime parser va zamonaviy muqobillar", href: "03-Datetime-Output-Parser.md" }
    }
  ]
};
