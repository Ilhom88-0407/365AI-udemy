window.QUIZ = {
  id: "43",
  title: "LangGraph — kirish",
  subtitle: "Stateless LLM muammosi, State, tugun va qirralar, sikl, xabarlarni boshqarish usullari va Python talablari",
  next: { label: "LangGraph — muhitni sozlash", href: "../44-LangGraph-Setting-Up-Environment/README.md" },
  questions: [
    {
      q: "Foydalanuvchi \"Salom, men Oybek\" deb yozdi, keyingi xabarda \"Mening ismim nima?\" deb so'radi va model \"bilmayman\" dedi. Asosiy sabab nima?",
      type: "single",
      options: [
        "Model o'zbekcha ismlarni tanimaydi, shuning uchun uni eslab qololmadi",
        "LLM stateless: har chaqiruv mustaqil, oldingi xabar yuborilmagan",
        "Modelning kontekst oynasi ikki xabarga ham yetmay qoldi",
        "temperature juda yuqori bo'lgani uchun model tasodifiy javob berdi"
      ],
      answer: [1],
      explain: "LLM hech narsani eslamaydi — har chaqiruv alohida. Ikkinchi chaqiruvga birinchi xabar qo'shilmagani uchun model ismni ko'rmadi.",
      lesson: { title: "LangGraph nima?", href: "01-Welcome-to-the-Course.md" }
    },
    {
      q: "Oddiy chatbotda \"xotira\" qanday hosil qilinadi va buning asosiy muammosi nima?",
      type: "single",
      options: [
        "Model har javobdan keyin og'irliklarini yangilaydi — muammo sekinlikda",
        "LangChain xabarlarni serverda o'zi saqlaydi — muammo maxfiylikda",
        "Butun xabarlar ro'yxati har safar qayta yuboriladi — ro'yxat cheksiz o'sadi va har token pul",
        "Faqat oxirgi xabar yuboriladi — muammo kontekst yetishmasligida"
      ],
      answer: [2],
      explain: "\"Xotira\" — bu HumanMessage va AIMessage'lar ro'yxatini qayta yuborish. Lekin ro'yxat o'sgan sari har chaqiruvda butun tarix uchun to'laysiz.",
      lesson: { title: "LangGraph nima?", href: "01-Welcome-to-the-Course.md" }
    },
    {
      q: "Darsga ko'ra LCEL (41-modul) va LangGraph o'rtasidagi asosiy farq bitta so'zda qanday ifodalanadi?",
      type: "single",
      options: [
        "Sikl: LCEL chiziqli (a | b | c), LangGraph'da orqaga qaytish mumkin",
        "Tezlik: LangGraph zanjirlarni LCEL'dan bir necha barobar tez bajaradi",
        "Model: LangGraph faqat OpenAI modellari bilan ishlaydi",
        "Parallellik: LCEL'da parallel qadamlar umuman yo'q"
      ],
      answer: [0],
      explain: "LCEL — DAG, orqaga qaytish yo'q. Suhbat esa tabiatan sikl (savol → javob → yana savolmi? → ...), buni LangGraph shartli qirralar bilan yozadi. LCEL'da RunnableParallel bor, shuning uchun parallellik farq emas.",
      lesson: { title: "LangGraph nima?", href: "01-Welcome-to-the-Course.md" }
    },
    {
      q: "LangGraph qaysi imkoniyatlarni beradi? (bir nechta javob)",
      type: "multi",
      options: [
        "State — tugundan tugunga o'tib, yo'lda yangilanadigan ma'lumot",
        "Model og'irliklarini suhbat davomida fine-tuning qilish",
        "Shartli qirralar — qaror va sikl qurish",
        "Checkpointer — ishga tushirishlar orasida xotira",
        "Hujjatlarni avtomatik embedding qilib vektor bazasiga yozish"
      ],
      answer: [0, 2, 3],
      explain: "LangGraph'ning asosi — State, Node, Edge, shartli qirra va checkpointer. Fine-tuning va embedding — boshqa vositalarning vazifasi (retriever tugun ichiga qo'yiladi).",
      lesson: { title: "LangGraph nima?", href: "01-Welcome-to-the-Course.md" }
    },
    {
      q: "Bank kredit yordamchisi summa, muddat va daromadni ketma-ket so'rashi, tasdiqlanmasa esa summa so'rashga qaytishi kerak. Nima uchun bu LangGraph uchun tipik vazifa?",
      type: "single",
      options: [
        "Chunki LangGraph'siz modelga bir nechta savol berib bo'lmaydi",
        "Chunki unda ko'p qadam, qaror va orqaga qaytish (sikl) hamda xotira bor",
        "Chunki LangGraph kredit foizini o'zi hisoblaydigan tayyor tugunga ega",
        "Chunki bunday vazifa uchun LLM umuman kerak emas"
      ],
      answer: [1],
      explain: "Darsdagi barcha misollarda (bank, klinika, call-markaz) umumiy narsa — ko'p qadam, qaror va xotira. \"Tasdiqlanmasa qaytish\" — shartli qirra bilan qurilgan sikl.",
      lesson: { title: "LangGraph nima?", href: "01-Welcome-to-the-Course.md" }
    },
    {
      q: "Suhbatni boshqarishning uch usuli bo'yicha qaysi baho darsdagi o'lchovlarga mos?",
      type: "single",
      options: [
        "Qo'shish — eng arzon, chunki tarix bir marta yuboriladi",
        "Qirqish — kontekst to'liq saqlanadi, faqat narx oshadi",
        "Xulosalash — ham token, ham chaqiruvlar sonini kamaytiradi",
        "Xulosalash — tokenni tejaydi, lekin har burilishda 2× LLM chaqiruvi"
      ],
      answer: [3],
      explain: "O'lchovda 5 burilish xulosalash bilan 10 ta LLM chaqiruvi bo'ldi. Bu bepul yaxshilanish emas, savdo: kontekst siqiladi, lekin chaqiruv ikkilanadi.",
      lesson: { title: "Bo'lim nimani qamraydi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Qirqish (trim=5) mantiqi soddalashtirilgan. Bu kod nimani chop etadi?",
      code: "tarix = []\nfor b in range(3):\n    tarix += [\"savol\", \"javob\"]\n    tarix = tarix[-5:]\nprint(len(tarix), tarix[0])",
      type: "single",
      options: [
        "6 savol",
        "5 savol",
        "5 javob",
        "4 savol"
      ],
      answer: [2],
      explain: "1-aylanishda 2, 2-da 4, 3-da 6 ta element bo'ladi va [-5:] ularni 5 taga qisqartiradi. Birinchi \"savol\" tashlanadi, shuning uchun ro'yxat \"javob\" bilan boshlanadi — qirqish eski kontekstni aynan shunday yo'qotadi.",
      lesson: { title: "Bo'lim nimani qamraydi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "10-burilishda trim'siz tarix 30 xabar · 590 token, trim=5 bilan esa 5 xabar · 113 token bo'ldi. Qirqishning asosiy xavfi nima va uni nima yumshatadi?",
      type: "single",
      options: [
        "Eski muhim kontekst yo'qoladi — buni xulosalash yumshatadi",
        "Model javoblari uzunlashadi — buni max_tokens yumshatadi",
        "Chaqiruvlar soni ikki barobar oshadi — buni batch yumshatadi",
        "Token soni kamaygani uchun javob sifati doim oshadi — xavf yo'q"
      ],
      answer: [0],
      explain: "Qirqish arzon va barqaror (5.2× farq), lekin eski kontekst yo'qoladi. Xulosalash eski qismni siqib saqlaydi — narxi esa qo'shimcha LLM chaqiruvi.",
      lesson: { title: "Bo'lim nimani qamraydi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Kurs kodidagi muammolar va ularning darsda taklif qilingan yechimlari to'g'ri juftlangan variantlarni tanlang. (bir nechta javob)",
      type: "multi",
      options: [
        "Tugun ichida input() — faqat notebookda ishlaydi → interrupt",
        "State'da Annotated yo'q — savol yo'qoladi → add_messages",
        "API kaliti majburiy → ChatOpenAI ga seed=365 berish",
        "Sikl to'xtamay 5000 marta aylandi → {\"recursion_limit\": 20}",
        "state[\"messages\"][0] reducer bilan noto'g'ri → [0] o'rniga [1]"
      ],
      answer: [0, 1, 3],
      explain: "API kalitisiz ishlash uchun yechim — FakeListChatModel, seed emas. Reducer bilan oxirgi xabar kerak bo'lganda to'g'ri indeks [-1], [1] emas.",
      lesson: { title: "Bo'lim nimani qamraydi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Darsdagi \"sikl yoki holat kerakmi?\" qoidasiga ko'ra qaysi vazifa uchun LCEL yetarli va LangGraph shart emas?",
      type: "single",
      options: [
        "\"Yana savolingiz bormi?\" deb qayta so'raydigan suhbat",
        "Ko'p qadamli forma to'ldirish",
        "Vosita chaqirish sikliga ega agent",
        "Oddiy RAG: savol → hujjat topish → javob"
      ],
      answer: [3],
      explain: "Chiziqli RAG uchun LCEL yetadi. Sikl, holat yoki ko'p qadamli jarayon bo'lsa — LangGraph; u LCEL o'rniga emas, ustiga quriladi, tugun ichida LCEL zanjiri ishlatiladi.",
      lesson: { title: "Bo'lim nimani qamraydi", href: "02-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "from typing_extensions import TypedDict\n\nclass Foydalanuvchi(TypedDict):\n    ism: str\n    yosh: int\n\nf = Foydalanuvchi(ism=\"Oybek\", yosh=30, notogri_kalit=\"!\")\nprint(f)",
      type: "single",
      options: [
        "TypeError: notogri_kalit kutilmagan argument",
        "{'ism': 'Oybek', 'yosh': 30}",
        "Foydalanuvchi(ism='Oybek', yosh=30)",
        "{'ism': 'Oybek', 'yosh': 30, 'notogri_kalit': '!'}"
      ],
      answer: [3],
      explain: "TypedDict ish vaqtida oddiy dict: noto'g'ri kalit ham xatosiz qo'shiladi, buni faqat mypy kabi tip tekshiruvchi ogohlantiradi. Shuning uchun state.get('summary', '') kabi xavfsiz o'qish tavsiya etiladi.",
      lesson: { title: "Talablar", href: "03-Course-Prerequisites.md" }
    },
    {
      q: "Bu kod oxirida nimani chop etadi?",
      code: "from langchain_core.language_models.fake_chat_models import FakeListChatModel\n\nchat = FakeListChatModel(responses=[\"Birinchi.\", \"Ikkinchi.\", \"Uchinchi.\"])\nfor i in range(4):\n    r = chat.invoke(f\"savol {i}\")\nprint(r.content)",
      type: "single",
      options: [
        "Uchinchi.",
        "Birinchi.",
        "IndexError: javoblar tugadi",
        "savol 3"
      ],
      answer: [1],
      explain: "FakeListChatModel javoblarni sikl bo'yicha qaytaradi: 4-chaqiruvda ro'yxat boshiga qaytib \"Birinchi.\" beradi. Bu graf mantiqini API kalitisiz va takrorlanuvchan sinash uchun qulay.",
      lesson: { title: "Talablar", href: "03-Course-Prerequisites.md" }
    },
    {
      q: "State'da messages maydoni Annotated[Sequence[BaseMessage], add_messages] o'rniga oddiy Sequence[BaseMessage] deb yozilsa, darsdagi o'lchovga ko'ra nima bo'ladi?",
      type: "single",
      options: [
        "Hech narsa o'zgarmaydi — LangGraph xabarlarni baribir qo'shib boradi",
        "Graf kompilyatsiyada xato beradi va ishga tushmaydi",
        "Yangi qiymat eskisini almashtiradi — faqat oxirgi xabar qoladi",
        "Xabarlar ikki marta takrorlanib qo'shiladi"
      ],
      answer: [2],
      explain: "Annotated maydonga reducer biriktiradi va LangGraph'ga \"almashtirma, add_messages bilan birlashtir\" deydi. Usiz o'lchovda 3 xabar o'rniga faqat ['ikkinchi'] qoldi — foydalanuvchi savoli yo'qoladi.",
      lesson: { title: "Talablar", href: "03-Course-Prerequisites.md" }
    },
    {
      q: "Bu routing funksiyasi nimani chop etadi?",
      code: "from typing import Literal\n\ndef yol(javob: str) -> Literal[\"ask_question\", \"__end__\"]:\n    return \"ask_question\" if javob == \"yes\" else \"__end__\"\n\nprint(yol(\"no\"), yol(\"yes\"))",
      type: "single",
      options: [
        "__end__ ask_question",
        "ask_question __end__",
        "False True",
        "TypeError: Literal qiymatlari ish vaqtida tekshiriladi"
      ],
      answer: [0],
      explain: "\"yes\" bo'lsa ask_question, aks holda __end__ qaytadi. Literal esa graf uchun funksiya qaysi qiymatlarni qaytarishi mumkinligini bildiradi, ish vaqtida tekshiruv qilmaydi.",
      lesson: { title: "Talablar", href: "03-Course-Prerequisites.md" }
    },
    {
      q: "LangGraph bo'limini o'rganish uchun OpenAI API kaliti majburiy, chunki graf faqat haqiqiy model bilan ishga tushadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "LangGraph — grafni boshqarish, model esa bitta tugun ichida. FakeListChatModel yoki Ollama ChatOpenAI bilan bir xil interfeysga ega (invoke, batch, stream), shuning uchun butun bo'limni kalitsiz o'rganish mumkin.",
      lesson: { title: "Talablar", href: "03-Course-Prerequisites.md" }
    }
  ]
};
