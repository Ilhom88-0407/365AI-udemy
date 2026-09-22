window.QUIZ = {
  id: "38",
  title: "OpenAI API",
  subtitle: "openai paketi LangChain'siz: klient va base_url, rollar va few-shot, javob anatomiyasi, temperature, seed va streaming",
  next: { label: "Model kirishlari", href: "../39-LangChain-Model-Inputs/README.md" },
  questions: [
    {
      q: "openai 3.3.1 da quyidagi kod ishga tushirilsa nima bo'ladi?",
      code: "import os, openai\nfrom openai import OpenAI\n\nos.environ.pop(\"OPENAI_API_KEY\", None)\nopenai.api_key = \"sk-KURSDAGI-USUL\"\nclient = OpenAI()",
      type: "single",
      options: [
        "Klient yaratiladi va \"sk-KURSDAGI-USUL\" kalitidan foydalanadi",
        "Faqat ogohlantirish chiqadi, klient esa baribir ishlayveradi",
        "OpenAIError: Missing credentials xatosi chiqadi",
        "AttributeError: openai modulida api_key atributi yo'q"
      ],
      answer: [2],
      explain: "OpenAI() klienti global openai.api_key ni o'qimaydi — faqat api_key= argumenti yoki OPENAI_API_KEY muhit o'zgaruvchisidan oladi. Muhit tozalangani uchun kalit topilmaydi.",
      lesson: { title: "Birinchi qadamlar", href: "01-First-Steps.md" }
    },
    {
      q: "Sizda OpenAI API kaliti yo'q, lekin kompyuteringizda Ollama ishlab turibdi. Modul kodini o'zgartirmasdan ishlatish uchun klientni qanday yaratasiz?",
      type: "single",
      options: [
        "OpenAI(api_key=\"ollama\", base_url=\"http://localhost:11434/v1\")",
        "OpenAI(api_key=None, model=\"qwen2.5\", local=True)",
        "openai.api_key = \"ollama\" deb yozib, keyin OpenAI() chaqirish",
        "OpenAI(provider=\"ollama\") — kalit va manzil avtomatik topiladi"
      ],
      answer: [0],
      explain: "base_url openai paketini har qanday OpenAI-mos serverga (Ollama, LM Studio, Groq, vLLM) ulaydi; messages, temperature, max_tokens, stream kodi aynan bir xil qoladi. openai.api_key esa hech narsa qilmaydi.",
      lesson: { title: "Birinchi qadamlar", href: "01-First-Steps.md" }
    },
    {
      q: "Darsga ko'ra, OpenAI() klientiga kalitni berishning qaysi usullari haqiqatan ishlaydi? (bir nechta javob)",
      type: "multi",
      options: [
        "load_dotenv(override=True) dan keyin OpenAI() chaqirish",
        "OpenAI(api_key=\"sk-...\") deb to'g'ridan-to'g'ri berish",
        "openai.api_key = os.getenv(\"OPENAI_API_KEY\") deb yozib qo'yish",
        "os.environ[\"OPENAI_API_KEY\"] ni o'rnatib, keyin OpenAI() chaqirish"
      ],
      answer: [0, 1, 3],
      explain: "Klient kalitni api_key= argumentidan yoki OPENAI_API_KEY muhit o'zgaruvchisidan oladi (load_dotenv ham aynan shu o'zgaruvchini o'rnatadi). openai.api_key satri kursda faqat %dotenv tufayli \"ishlagan\", o'zi esa bezak edi.",
      lesson: { title: "Birinchi qadamlar", href: "01-First-Steps.md" }
    },
    {
      q: "apply_chat_template natijasi ko'rsatganidek, system, user va assistant rollari model uchun aslida nima?",
      type: "single",
      options: [
        "Har bir rol uchun modelning alohida neyron tarmog'i ishlaydi",
        "Server rollarni alohida so'rovlar sifatida ketma-ket yuboradi",
        "Rollar modelning og'irliklarini vaqtincha o'zgartiruvchi sozlamalar",
        "Maxsus tokenlar bilan belgilangan oddiy matn bo'laklari"
      ],
      answer: [3],
      explain: "Rollar <|im_start|>rol ... <|im_end|> kabi maxsus tokenlar bilan ajratilgan matnga aylanadi — model faqat matn ko'radi. Oxirgi <|im_start|>assistant satri esa modelga \"endi sen yozasan\" degan ishora.",
      lesson: { title: "System, user va assistant rollari", href: "02-System-User-Assistant-Roles.md" }
    },
    {
      q: "Qwen modeliga faqat user xabarini yubordingiz, system xabari bermadingiz. Chat shablonida nima sodir bo'ladi?",
      type: "single",
      options: [
        "Shablon faqat user va assistant qismlaridan iborat bo'lib qoladi",
        "Model o'zining standart sistem xabarini avtomatik qo'shadi",
        "apply_chat_template sistem xabari yo'qligi uchun xato qaytaradi",
        "User xabari avtomatik ravishda system roliga ko'chiriladi"
      ],
      answer: [1],
      explain: "Qwen shabloni \"You are Qwen, created by Alibaba Cloud. You are a helpful assistant.\" ni o'zi qo'yadi — \"sistem xabari yo'q\" holati umuman mavjud emas. Bot kutilmagan uslubda javob bersa, avval sistem xabarini tekshirish kerak.",
      lesson: { title: "System, user va assistant rollari", href: "02-System-User-Assistant-Roles.md" }
    },
    {
      q: "Few-shot promptda uchta user/assistant misoli berilganda model ularni o'rganadi — ya'ni uning og'irliklari yangilanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Few-shot o'qitish emas: og'irliklar o'zgarmaydi, model shunchaki promptdagi naqshni davom ettiradi. Shuning uchun misollar har chaqiruvda qayta yuboriladi va har safar pul turadi.",
      lesson: { title: "System, user va assistant rollari", href: "02-System-User-Assistant-Roles.md" }
    },
    {
      q: "Bu funksiya suhbatni \"eslab qolishi\" uchun # ??? o'rniga qaysi satr yozilishi kerak?",
      code: "tarix = [{\"role\": \"system\", \"content\": \"...\"}]\n\ndef sora(savol):\n    tarix.append({\"role\": \"user\", \"content\": savol})\n    r = client.chat.completions.create(model=\"gpt-4o-mini\", messages=tarix)\n    javob = r.choices[0].message.content\n    # ???\n    return javob",
      type: "single",
      options: [
        "tarix.append({\"role\": \"system\", \"content\": javob})",
        "tarix = [{\"role\": \"user\", \"content\": javob}]",
        "tarix.append({\"role\": \"assistant\", \"content\": javob})",
        "tarix.insert(0, {\"role\": \"user\", \"content\": savol})"
      ],
      answer: [2],
      explain: "Modelning javobi ham assistant roli xabari, uni ro'yxatga qo'shish — \"xotira\"ning butun siri. Lekin tarix o'sgan sari narx O(n²) tarzida oshadi, shuning uchun uni qisqartirib turish kerak.",
      lesson: { title: "System, user va assistant rollari", href: "02-System-User-Assistant-Roles.md" }
    },
    {
      q: "Yaxshi sistem promptning to'rtta elementidan (rol, vazifa, format, chegara) qaysi biri eng ko'p unutiladi va usiz model yolg'on to'qiy boshlaydi?",
      type: "single",
      options: [
        "Format — \"qisqa, 2-3 jumla, ro'yxatsiz\" kabi ko'rsatma",
        "Chegara — \"bilmasangiz, operatorga yo'naltiring\"",
        "Rol — \"siz bank yordamchisisiz\" kabi qisqa ta'rif",
        "Vazifa — \"mijoz savollariga javob bering\" ko'rsatmasi"
      ],
      answer: [1],
      explain: "Chegara eng ko'p unutiladigan va eng muhim element: model bilmagan holatda nima deyishini aytmasangiz, u javob to'qiydi. 31-modulda \"reply exactly: NOT FOUND\" ko'rsatmasi RAG yolg'onini shunday to'xtatgan edi.",
      lesson: { title: "System, user va assistant rollari", href: "02-System-User-Assistant-Roles.md" }
    },
    {
      q: "Kod gpt-4o-mini dan javob oldi. Javob matnini qaysi ifoda to'g'ri chiqaradi?",
      code: "completion = client.chat.completions.create(\n    model=\"gpt-4o-mini\",\n    messages=[{\"role\": \"user\", \"content\": \"Salom\"}])\nprint(completion.______)",
      type: "single",
      options: [
        "choices.message.content",
        "choices[0].delta.content",
        "choices[0].content.text",
        "choices[0].message.content"
      ],
      answer: [3],
      explain: "ChatCompletion ichida choices — Choice obyektlari ro'yxati, har birida message, uning ichida content. delta esa faqat stream=True bo'lgandagi chunk'larda bo'ladi.",
      lesson: { title: "Sarkastik chatbot yaratamiz", href: "03-Creating-a-Sarcastic-Chatbot.md" }
    },
    {
      q: "Modeldan JSON so'radingiz, lekin json.loads xato berdi: JSON yarmida uzilgan. finish_reason nimani ko'rsatgan bo'lishi ehtimoli katta va nima qilish kerak?",
      type: "single",
      options: [
        "'length' — javob max_tokens ga urilib kesilgan, limitni oshirish kerak",
        "'stop' — model tabiiy tugatgan, faqat JSON'ni qo'lda tuzatish kerak",
        "'content_filter' — kontent bloklangan, temperature ni oshirish kerak",
        "'tool_calls' — model vosita chaqirgan, n parametrini oshirish kerak"
      ],
      answer: [0],
      explain: "'length' javob limitga urilib kesilganini bildiradi. Uni tekshirmasangiz kesilgan javobni to'liq deb qabul qilasiz — bu jim xato: JSON yarim qoladi, jumla uziladi.",
      lesson: { title: "Sarkastik chatbot yaratamiz", href: "03-Creating-a-Sarcastic-Chatbot.md" }
    },
    {
      q: "n=3 parametri so'rovning umumiy narxini aynan 3 marta oshiradi, chunki kirish ham, chiqish ham uch marta hisoblanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Kirish tokenlari bir marta hisoblanadi, faqat chiqish qismi n marta ko'payadi. Yana temperature=0 bilan n=3 ma'nosiz — uchala javob bir xil chiqadi.",
      lesson: { title: "Sarkastik chatbot yaratamiz", href: "03-Creating-a-Sarcastic-Chatbot.md" }
    },
    {
      q: "Kompaniya hujjatlari bo'yicha RAG savol-javob boti uchun darsdagi jadvalga ko'ra qaysi temperature mos?",
      type: "single",
      options: [
        "0.7 – 1.0, chunki javob ravon va jonli bo'lishi kerak",
        "1.5 dan yuqori, chunki model kontekstdan tashqariga chiqa oladi",
        "1.0 – 1.2, chunki javoblar xilma-xil bo'lishi kerak",
        "0, chunki bu yerda ijod emas, faktlar kerak"
      ],
      answer: [3],
      explain: "Tasnif, ekstraksiya va RAG uchun temperature=0: aniqlik va faktlar muhim. 0.7–1.0 marketing matni kabi ijodiy vazifalarga, 1.5 dan yuqorisi deyarli hech qachon foydali emas.",
      lesson: { title: "Temperature, max tokens va streaming", href: "04-Temperature-Max-Tokens-Streaming.md" }
    },
    {
      q: "Darsdagi sinovda temperature=2.0 da ham matn mazmunli qoldi, kurs esa \"ma'nosiz matn\" va'da qilgan edi. Dars qaysi sabablarni ko'rsatadi? (bir nechta javob)",
      type: "multi",
      options: [
        "top_p=0.95 ishlatilgani — u ehtimolsiz tokenlarni kesib tashlaydi",
        "seed=365 berilgani — u tasodifiylikni butunlay o'chirib qo'yadi",
        "0.5B modelning lug'ati va uslubi cheklangani",
        "API temperature ni jimgina 1.0 gacha kamaytirib yuborgani"
      ],
      answer: [0, 2],
      explain: "Ikkita sabab: top_p=0.95 yuqori temperature zararini kamaytirdi va kichik model \"chetga chiqish\" uchun yetarli xilma-xillikka ega emas. Seed faqat natijani takrorlanuvchan qiladi, tasodifiylikni o'chirmaydi.",
      lesson: { title: "Temperature, max tokens va streaming", href: "04-Temperature-Max-Tokens-Streaming.md" }
    },
    {
      q: "stream=True bilan bu tsikl ishlaganda oxirgi chunk'da delta.content None bo'ladi. Qaysi tuzatish darsda tavsiya etilgan?",
      code: "for chunk in completion:\n    print(chunk.choices[0].delta.content, end=\"\")",
      type: "single",
      options: [
        "delta o'rniga message yozish: chunk.choices[0].message.content",
        "c = chunk.choices[0].delta.content, keyin faqat if c: chop etish",
        "stream_options={\"include_usage\": True} qo'shish kifoya bo'ladi",
        "print(...) ichida .strip() chaqirib, None ni olib tashlash"
      ],
      answer: [1],
      explain: "Oqimda javob delta.content da keladi va oxirgi chunk'da u None bo'ladi, shuning uchun if c: tekshiruvi kerak. stream_options esa boshqa tuzoqni — usage yo'qligini hal qiladi.",
      lesson: { title: "Temperature, max tokens va streaming", href: "04-Temperature-Max-Tokens-Streaming.md" }
    },
    {
      q: "Ishlab chiqarishda OpenAI API'dan takrorlanuvchan natija kerak. Dars nimaga tayanishni maslahat beradi?",
      type: "single",
      options: [
        "seed ga — u OpenAI serverida to'liq determinizmni kafolatlaydi",
        "n=3 ga — uchta javobdan eng ko'p takrorlanganini tanlash uchun",
        "temperature=0 ga — seed OpenAI'da kafolat bermaydi",
        "top_p=0.95 va temperature=2 ni birga sozlashga"
      ],
      answer: [2],
      explain: "Mahalliy modelda torch.manual_seed to'liq determinizm beradi, OpenAI serverida esa backend o'zgarishi mumkin (shuning uchun system_fingerprint bor). Takrorlanuvchanlik uchun temperature=0 ishonchliroq.",
      lesson: { title: "Temperature, max tokens va streaming", href: "04-Temperature-Max-Tokens-Streaming.md" }
    }
  ]
};
