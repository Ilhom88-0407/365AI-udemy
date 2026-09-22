window.QUIZ = {
  id: "31",
  title: "GPT modellari bilan ishlash",
  subtitle: "GPT ma'nosi va tarixi, zamonaviy OpenAI API, max_tokens va temperature, uchta rol, chatbot va RAG'ni noldan qurish",
  next: { label: "Hugging Face Transformers", href: "../32-HuggingFace-Transformers/README.md" },
  questions: [
    {
      q: "GPT qisqartmasidagi uchta harf va darsdagi ma'nosi qaysi qatorda to'g'ri berilgan?",
      type: "single",
      options: [
        "General Purpose Transformer — umumiy maqsadli, oldindan o'qitilgan encoder",
        "Generative Pre-trained Transformer — matn yaratuvchi, oldindan o'qitilgan decoder",
        "Generative Pre-trained Translator — tarjimaga ixtisoslashgan encoder–decoder",
        "Guided Prompt Transformer — ko'rsatmaga amal qiluvchi, encoder asosidagi model"
      ],
      answer: [1],
      explain: "G — keyingi so'zni bashorat qilib matn yaratadi, P — massiv ma'lumotda oldindan o'qitilgan, T — transformer; GPT niqoblangan e'tiborli, faqat decoder turidagi transformer.",
      lesson: { title: "GPT nima degani?", href: "01-What-does-GPT-mean.md" }
    },
    {
      q: "Darsga ko'ra ChatGPT va asosiy GPT modeli o'rtasidagi farq nimada?",
      type: "single",
      options: [
        "ChatGPT GPT-4 dan ko'ra ko'proq parametrga ega bo'lgan alohida arxitektura",
        "ChatGPT faqat encoder bloklaridan iborat, GPT esa faqat decoder",
        "ChatGPT — GPT'ning suhbat uchun qo'shimcha sozlangan versiyasi",
        "ChatGPT oldindan o'qitilmagan, u faqat foydalanuvchi suhbatlaridan o'rganadi"
      ],
      answer: [2],
      explain: "GPT-3.5 suhbat uchun qo'shimcha sozlanib ChatGPT'ga aylandi: asosiy GPT matnni davom ettiradi, ChatGPT esa savolga javob beradi va ko'rsatmaga amal qiladi.",
      lesson: { title: "ChatGPT rivojlanishi", href: "02-The-Development-of-ChatGPT.md" }
    },
    {
      q: "Kursdagi openai.Completion.create(model=\"text-davinci-002\", ...) kodi o'rniga bugun qaysi chaqiruv to'g'ri?",
      type: "single",
      code: "from openai import OpenAI\nclient = OpenAI(api_key=os.environ.get(\"OPENAI_API_KEY\"))",
      options: [
        "client.Completion.create(model=\"gpt-4o-mini\", messages=[{\"role\": \"user\", \"content\": \"Once upon a time\"}])",
        "openai.ChatCompletion.create(model=\"gpt-4o-mini\", messages=[{\"role\": \"user\", \"content\": \"Once upon a time\"}])",
        "client.completions.create(model=\"text-davinci-002\", prompt=[{\"role\": \"user\", \"content\": \"Once upon a time\"}])",
        "client.chat.completions.create(model=\"gpt-4o-mini\", messages=[{\"role\": \"user\", \"content\": \"Once upon a time\"}])"
      ],
      answer: [3],
      explain: "openai v1.0 da Completion va ChatCompletion olib tashlandi, text-davinci-002 esa yopildi. Endi client.chat.completions.create va messages ro'yxati ishlatiladi, javob esa choices[0].message.content dan olinadi.",
      lesson: { title: "OpenAI API", href: "03-OpenAI-API.md" }
    },
    {
      q: "distilgpt2 va flan-t5-small ikkalasi ham ~80 million parametrli. Lekin \"Translate English to French: ...\" promptiga distilgpt2 matnni davom ettirdi, flan-t5 esa tarjima qildi. Sabab nima?",
      type: "single",
      options: [
        "flan-t5 ko'rsatmaga amal qilishga sozlangan (instruction-tuned), distilgpt2 esa yo'q",
        "flan-t5 fransuz matnlarida ham o'qitilgan, distilgpt2 esa faqat inglizcha matnda",
        "distilgpt2 da temperature juda yuqori qo'yilib, u ko'rsatmadan chetga chiqdi",
        "flan-t5 API orqali serverda, distilgpt2 esa mahalliy kompyuterda ishlagani uchun"
      ],
      answer: [0],
      explain: "Farq hajmda emas, sozlashda: flan-t5 instruction-tuned. Bu aynan GPT va ChatGPT o'rtasidagi farqning kichik nusxasi.",
      lesson: { title: "OpenAI API", href: "03-OpenAI-API.md" }
    },
    {
      q: "distilgpt2 \"Once upon a time\" promptini ertak emas, urush haqida davom ettirdi. Darsdagi izoh qaysi?",
      type: "single",
      options: [
        "Prompt noto'g'ri yozilgani uchun model uni ertak boshlanishi emas, savol deb tushundi",
        "Model o'quv ma'lumotida bu ibora qaysi kontekstda ko'p uchragan bo'lsa, shuni takrorladi",
        "max_tokens juda kichik bo'lgani uchun model ertak qismiga yetib borishga ulgurmadi",
        "Model API kalitisiz mahalliy ishlagani uchun uning natijasi tasodifiy buzildi"
      ],
      answer: [1],
      explain: "Ma'lumotda nima bo'lsa, model shuni o'rganadi. Bu 27-moduldagi \"Reuters\" shipchasi bilan bir xil hodisa — ma'lumotning ko'zgusi.",
      lesson: { title: "Matn yaratish", href: "04-Generating-Text.md" }
    },
    {
      q: "Quyidagi kod nimani chop etadi?",
      code: "import torch\nlogits = torch.tensor([3.0, 1.0, 0.5, 0.2])\np = torch.softmax(logits / 0.1, dim=-1)\nprint([round(float(x), 3) for x in p])",
      type: "single",
      options: [
        "[0.526, 0.194, 0.151, 0.13]",
        "[0.782, 0.106, 0.064, 0.048]",
        "[0.25, 0.25, 0.25, 0.25]",
        "[1.0, 0.0, 0.0, 0.0]"
      ],
      answer: [3],
      explain: "Kichik temperatura logitlarni 10 baravar kattalashtirib, taqsimotni o'tkirlashtiradi — birinchi so'z 100% oladi. [0.526, ...] esa temp=2.0 dagi tekis taqsimot.",
      lesson: { title: "GPT natijasini sozlash", href: "05-Customizing-GPT-Output.md" }
    },
    {
      q: "max_tokens=50 va do_sample=False bilan distilgpt2 bir jumlani uch marta takrorladi. Darsga ko'ra qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "max_tokens ni oshirish natija sifatini yaxshilamaydi, faqat ko'proq joy beradi",
        "Takrorlanish argmax doim eng ehtimolli so'zni olgani uchun yuzaga keladi",
        "repetition_penalty=1.2 takrorlangan so'zlar ehtimolini kamaytiradi",
        "Takrorlanish faqat kichik bepul modellarda bo'ladi, text-davinci-002 da bo'lmagan",
        "Bugungi OpenAI API'da temperature uchun eng yuqori qiymat 1.0"
      ],
      answer: [0, 1, 2],
      explain: "O'qituvchining text-davinci-002 natijasida ham \"she could see\" takrorlangan — bu argmax tabiati. Bugungi API'da temperature chegarasi 2.0, \"bir eng tasodifiy\" degan gap noto'g'ri.",
      lesson: { title: "GPT natijasini sozlash", href: "05-Customizing-GPT-Output.md" }
    },
    {
      q: "messages ro'yxatidagi uchta rolning vazifasi qaysi qatorda to'g'ri?",
      type: "single",
      options: [
        "system — foydalanuvchi savoli; user — model javobi; assistant — ko'rsatma",
        "system — ko'rsatma; user — kiritma misoli; assistant — javob misoli",
        "system — suhbat tarixi; user — API kaliti; assistant — xato xabarlari",
        "system — model nomi; user — temperatura; assistant — max_tokens"
      ],
      answer: [1],
      explain: "system modelga nima qilishni aytadi, user/assistant juftliklari esa namunaviy savol-javoblar — bu few-shot o'rganishning amaliy ko'rinishi.",
      lesson: { title: "Kalit so'zlar bilan xulosalash", href: "06-Keyword-Text-Summarization.md" }
    },
    {
      q: "flan-t5-small (77M) few-shot promptda \"tea, island, tea\" berdi, flan-t5-base (248M) esa 5 ta kalit so'z topdi. Dars bundan qanday xulosa chiqaradi?",
      type: "single",
      options: [
        "Few-shot yondashuvi umuman foydasiz, har doim zero-shot yaxshiroq",
        "Kichik model uchun ko'proq misol qo'shilsa, u GPT-3 darajasida ishlaydi",
        "Few-shot miqyos talab qiladigan qobiliyat — u katta modellarda paydo bo'ladi",
        "Natija faqat temperature sozlamasiga bog'liq, model hajmi ahamiyatsiz"
      ],
      answer: [2],
      explain: "Few-shot GPT-3 (175 milliard) bilan rivojlantirilgan; kichik modellarda u deyarli ishlamaydi. Buni \"emergent ability\" — paydo bo'luvchi qobiliyat deyishadi.",
      lesson: { title: "Kalit so'zlar bilan xulosalash", href: "06-Keyword-Text-Summarization.md" }
    },
    {
      q: "flan-t5-base viski haqida \"1808-yilda James Madison tomonidan Shotlandiyada\" degan ravon, batafsil, lekin butunlay noto'g'ri javob berdi. Darsga ko'ra bu nima uchun kichik modelning qisqa xato javobidan xavfliroq?",
      type: "single",
      options: [
        "Chunki uzun, batafsil javob ko'proq token ishlatib, API'da qimmatroq turadi",
        "Chunki ravon javob ishonchli eshitiladi va foydalanuvchi aldanishi mumkin",
        "Chunki katta model system xabarini e'tiborsiz qoldirib, uni butunlay o'chiradi",
        "Chunki bunday ishonchli javobni keyinchalik RAG bilan ham tuzatib bo'lmaydi"
      ],
      answer: [1],
      explain: "Ravonlik to'g'rilikning kafolati emas. Kichik model ochiqchasiga yomon — unga ishonmaysiz; kattaroq model ishonarli eshitiladi va aldashi mumkin. Yechim — faktni modelga berish (RAG).",
      lesson: { title: "Oddiy chatbot yozish", href: "07-Coding-a-Simple-Chatbot.md" }
    },
    {
      q: "Model hech qachon ko'rmagan ichki kompaniya hujjatlari haqida so'ralganda \"bilmayman\" deydimi?",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "Darsda flan-t5-base uchala savolga ham ('physics', '1890', '58') ishonch bilan to'qilgan javob berdi. Model keyingi so'zni bashorat qiladi va bilmasligini bilmaydi.",
      lesson: { title: "LangChain'ga kirish — muammo", href: "08-Introduction-to-LangChain.md" }
    },
    {
      q: "RAG quvuri haqidagi qaysi fikrlar dars bilan mos keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Hujjat bo'laklarga bo'linadi, chunki modelning kontekst chegarasi bor",
        "RAG ishlashi uchun model yangi hujjatlarda qayta o'qitilishi shart",
        "Bo'laklar embeddingga aylantirilib, vektor omboriga saqlanadi",
        "Savolga eng o'xshash bo'laklar topilib, model bilan birga promptga qo'shiladi"
      ],
      answer: [0, 2, 3],
      explain: "RAG'da model o'zgarmaydi — qayta o'qitish ham, sozlash ham yo'q. Faqat to'g'ri ma'lumot promptga qo'shiladi, shuning uchun u arzon va darhol yangilanadi.",
      lesson: { title: "LangChain nima?", href: "09-LangChain.md" }
    },
    {
      q: "Darsdagi bo'laklash funksiyasi quyidagi matnni qanday bo'laklarga ajratadi?",
      code: "def bolaklarga_bol(matn):\n    return [s.strip() + \".\" for s in matn.replace(\"\\n\", \" \").split(\".\") if s.strip()]\n\nprint(bolaklarga_bol(\"A course.\\nB course. C\"))",
      type: "single",
      options: [
        "['A course.', 'B course.', 'C.']",
        "['A course.', 'B course.']",
        "['A course.\\nB course.', 'C.']",
        "['A course', 'B course', 'C']"
      ],
      answer: [0],
      explain: "\\n bo'shliqqa almashtiriladi, matn nuqta bo'yicha bo'linadi, bo'sh qismlar tashlanadi va har biriga nuqta qo'shiladi — oxiridagi \"C\" ham \"C.\" bo'ladi.",
      lesson: { title: "O'z ma'lumotingizni qo'shish", href: "10-Adding-Custom-Data.md" }
    },
    {
      q: "TF-IDF'li RAG \"What is the weather in Tashkent?\" savoliga 0.487 ball bilan LangChain kursi bo'lagini topdi va model \"rainy\" deb to'qidi. Darsdagi himoya choralari qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "k qiymatini 10 ga oshirib, iloji boricha ko'p bo'lak berish",
        "TfidfVectorizer(stop_words=\"english\") — umumiy so'zlar soxta moslik bermasligi uchun",
        "Past balli bo'laklarni rad etuvchi min_ball chegarasi",
        "Kontekstda javob bo'lmasa NOT FOUND deyishni so'rovchi ko'rsatma"
      ],
      answer: [1, 2, 3],
      explain: "Uch qatlamli himoya: stop_words bilan ball 0.487 dan 0.000 ga tushdi, min_ball past moslikni rad etadi, NOT FOUND esa modelga \"bilmayman\" deyishga ruxsat beradi. k=10 esa ortiqcha shovqin keltiradi.",
      lesson: { title: "O'z ma'lumotingizni qo'shish", href: "10-Adding-Custom-Data.md" }
    },
    {
      q: "O'zbekcha hujjatda \"Ofis qayerda?\" savoli \"Bizning ofisimiz Toshkent shahrida joylashgan.\" bo'lagini topa olmadi (ball 0.000). Sababi nima?",
      type: "single",
      options: [
        "TfidfVectorizer lotin yozuvidagi o'zbek tilini qo'llab-quvvatlamaydi",
        "Apostrofli so'zlar standart token_pattern bilan bo'linib, buzilib ketdi",
        "Bo'lak juda uzun bo'lgani uchun modelning kontekst chegarasidan oshdi",
        "TF-IDF uchun \"ofis\" va \"ofisimiz\" turli token, \"qayerda\" esa hujjatda yo'q"
      ],
      answer: [3],
      explain: "TF-IDF ma'noni emas, so'zlarni solishtiradi. Qolgan savollarda o'zbekcha qidiruv yaxshi ishladi; yechim — stemming, sinonimlar yoki neyron embedding.",
      lesson: { title: "O'z ma'lumotingizni qo'shish", href: "10-Adding-Custom-Data.md" }
    }
  ]
};
