window.QUIZ = {
  id: "46",
  title: "Xabarlarni boshqarish",
  subtitle: "Annotated va reducerlar, add_messages, MessagesState, RemoveMessage, qirqish (trim) va xulosalash",
  next: { label: "Thread-level persistence", href: "../47-LangGraph-Thread-Level-Persistence/README.md" },
  questions: [
    {
      q: "Bu kod nimani chiqaradi?",
      code: "from langgraph.graph import add_messages\nfrom langchain_core.messages import HumanMessage\n\na = HumanMessage(\"asl matn\", id=\"x1\")\nb = HumanMessage(\"YANGILANGAN matn\", id=\"x1\")\nr = add_messages([a], [b])\nprint(len(r), r[0].content)",
      type: "single",
      options: [
        "ValueError: takroriy id",
        "1 asl matn",
        "1 YANGILANGAN matn",
        "2 YANGILANGAN matn"
      ],
      answer: [2],
      explain: "add_messages faqat qo'shmaydi: id bir xil bo'lsa, eski xabarni yangisi bilan almashtiradi. Xabarni tahrirlash usuli ham shu.",
      lesson: { title: "Annotated va reducer funksiyalar", href: "01-Annotated-and-Reducer-Functions.md" }
    },
    {
      q: "O'zingiz yozgan reducerlar bilan bu graf nimani chiqaradi?",
      code: "def oxirgi_n(n):\n    def r(eski, yangi): return (list(eski or []) + list(yangi or []))[-n:]\n    return r\nclass S(TypedDict):\n    xs: Annotated[list, oxirgi_n(3)]\n    urinish: Annotated[int, operator.add]\n\ng = StateGraph(S)\nfor i in (1, 2, 3):\n    g.add_node(f\"n{i}\", lambda s, i=i: {\"xs\": [i], \"urinish\": 1})\ng.add_edge(START, \"n1\"); g.add_edge(\"n1\", \"n2\"); g.add_edge(\"n2\", \"n3\"); g.add_edge(\"n3\", END)\nprint(g.compile().invoke({\"xs\": [0], \"urinish\": 0}))",
      type: "single",
      options: [
        "{'xs': [0, 1, 2, 3], 'urinish': 3}",
        "{'xs': [3], 'urinish': 1}",
        "{'xs': [1, 2, 3], 'urinish': 1}",
        "{'xs': [1, 2, 3], 'urinish': 3}"
      ],
      answer: [3],
      explain: "oxirgi_n(3) ro'yxatni birlashtirib, faqat oxirgi 3 tasini qoldiradi — avtomatik trim. urinish da operator.add bor: har tugun 1 qaytaradi, reducer o'zi qo'shib 3 ni hosil qiladi.",
      lesson: { title: "Annotated va reducer funksiyalar", href: "01-Annotated-and-Reducer-Functions.md" }
    },
    {
      q: "Darsga ko'ra o'z reduceringizni yozganda qaysi qoidalarga amal qilish kerak? (bir nechta javob)",
      type: "multi",
      options: [
        "Ikki argument oladi: (eski, yangi)",
        "Eskisini o'zgartirmasdan yangi qiymat qaytaradi",
        "Reducer ichida LLM chaqirilishi shart",
        "eski birinchi marta None bo'lishi mumkinligini hisobga oladi",
        "Faqat add_messages dan meros olgan funksiya reducer bo'la oladi"
      ],
      answer: [0, 1, 3],
      explain: "Reducer — oddiy funksiya: (eski, yangi) oladi, yangi qiymat qaytaradi, eski None bo'lishi mumkin va tez bo'lishi kerak. LLM kerak bo'lgan murakkab mantiq (xulosalash) uchun esa alohida tugun ishlatiladi.",
      lesson: { title: "Annotated va reducer funksiyalar", href: "01-Annotated-and-Reducer-Functions.md" }
    },
    {
      q: "Reducerli siklli grafda har burilishda: ask_question AI savol + Human javob, chatbot bitta AI javob, ask_another_question AI savol + Human \"yes\"/\"no\" qaytaradi. 3 burilishdan keyin state'da nechta xabar bo'ladi?",
      type: "single",
      options: [
        "10",
        "15",
        "12",
        "18"
      ],
      answer: [1],
      explain: "Har burilishda 2 + 1 + 2 = 5 ta xabar qo'shiladi: 3 × 5 = 15. Chatbot javobini unutsangiz 12, har tugunni 2 ta deb hisoblasangiz 18 chiqadi; reducersiz 45-moduldagi grafda esa faqat 1 ta xabar qolardi.",
      lesson: { title: "Reducerlar amalda", href: "02-Reducer-Functions-in-Action.md" }
    },
    {
      q: "Xabarlar shunchaki qo'shib borilsa, 20 burilishda kontekst 67 dan 1344 tokengacha o'sadi, jami kirish tokeni esa 13 440 ga yetadi. Nega jami narx kvadratik o'sadi?",
      type: "single",
      options: [
        "Chunki har burilishda butun tarix modelga qayta yuboriladi",
        "Chunki add_messages har xabarni ikki marta saqlaydi",
        "Chunki model javoblari har burilishda ikki barobar uzayadi",
        "Chunki o'zbekcha matn inglizchadan 1.88× ko'p token oladi"
      ],
      answer: [0],
      explain: "Bitta chaqiruvdagi kontekst chiziqli o'sadi, lekin har burilishda butun tarix qayta yuborilgani uchun yig'indi (67 + 134 + ... + 1344) kvadratik bo'ladi. 1.88× koeffitsient narxni oshiradi, lekin o'sish shaklini o'zgartirmaydi.",
      lesson: { title: "Reducerlar amalda", href: "02-Reducer-Functions-in-Action.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "from langgraph.graph import MessagesState\n\nclass State(MessagesState):\n    summary: str\n\ns = State(messages=[HumanMessage(\"a\")])\nprint(\"summary\" in s, repr(s.get(\"summary\", \"\")))",
      type: "single",
      options: [
        "True ''",
        "False None",
        "False ''",
        "KeyError: 'summary'"
      ],
      answer: [2],
      explain: "TypedDict'da maydonni e'lon qilish kalitni yaratmaydi, shuning uchun \"summary\" in s — False. .get(\"summary\", \"\") esa xatosiz bo'sh satr qaytaradi; s[\"summary\"] yozilganda KeyError chiqardi.",
      lesson: { title: "MessagesState sinfi", href: "03-The-MessagesState-Class.md" }
    },
    {
      q: "messages maydoniga add_messages o'rniga oxirgi_n(5) reducerini qo'ymoqchisiz. Darsga ko'ra qaysi yo'l to'g'ri?",
      type: "single",
      options: [
        "MessagesState dan meros olib, messages ni oxirgi_n(5) bilan qayta e'lon qilish",
        "O'z TypedDict: messages: Annotated[list[AnyMessage], oxirgi_n(5)]",
        "MessagesState ni o'zgartirmay, oxirgi_n ni compile() ga parametr qilib berish",
        "Buning iloji yo'q: messages maydonida faqat add_messages ishlaydi"
      ],
      answer: [1],
      explain: "MessagesState'dagi reducer'ni merosda almashtirishga urinish chalkashlik keltirib chiqaradi. Boshqa reducer kerak bo'lsa, o'z TypedDict'ingizni yozing — MessagesState qulaylik, majburiyat emas.",
      lesson: { title: "MessagesState sinfi", href: "03-The-MessagesState-Class.md" }
    },
    {
      q: "suhbat — add_messages orqali yaratilgan 10 ta xabarli ro'yxat. Kod nimani chiqaradi?",
      code: "rm = [RemoveMessage(id=m.id) for m in suhbat[:-5]]\nqolgan = add_messages(suhbat, rm)\nprint(len(rm), len(qolgan))",
      type: "single",
      options: [
        "5 5",
        "5 15",
        "10 5",
        "5 10"
      ],
      answer: [0],
      explain: "suhbat[:-5] — oxirgi beshtasidan tashqari hammasi, ya'ni 5 ta RemoveMessage yaratiladi. add_messages ularni ro'yxatga qo'shmaydi, balki o'sha id li xabarlarni o'chiradi: oxirgi 5 tasi qoladi.",
      lesson: { title: "RemoveMessage sinfi", href: "04-The-RemoveMessage-Class.md" }
    },
    {
      q: "Mavjud bo'lmagan id bilan berilgan RemoveMessage add_messages tomonidan jimgina e'tiborsiz qoldiriladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "O'lchangan natija: ValueError (Attempting to delete a message with an ID that doesn't exist). Darsda bu yaxshi xatti-harakat deyiladi, lekin siklda ikki tugun bir xabarni o'chirmoqchi bo'lsa, ikkinchisi xato beradi.",
      lesson: { title: "RemoveMessage sinfi", href: "04-The-RemoveMessage-Class.md" }
    },
    {
      q: "Xulosalash tugunida barcha xabarlarni o'chirish kerak. Nega [RemoveMessage(id=REMOVE_ALL_MESSAGES)] har bir xabar uchun RemoveMessage(id=m.id) yasashdan afzal?",
      type: "single",
      options: [
        "U xabarlarni o'chirish bilan birga avtomatik xulosa ham yaratadi",
        "U faqat SystemMessage'dan boshqa xabarlarni o'chiradi",
        "U o'chirilgan xabarlarni checkpointer'da zaxira qilib qo'yadi",
        "Bitta obyekt hammasini o'chiradi, id=None xabarda ham yiqilmaydi"
      ],
      answer: [3],
      explain: "REMOVE_ALL_MESSAGES ('__remove_all__') bitta RemoveMessage bilan hamma xabarni o'chiradi (10 → 0). Har xabar uchun id bilan yasalgan variant esa ro'yxatda id si None xabar bo'lsa yiqiladi.",
      lesson: { title: "RemoveMessage sinfi", href: "04-The-RemoveMessage-Class.md" }
    },
    {
      q: "Kurs trim tugunini def trim_messages(state): ... deb nomlaydi. Darsga ko'ra bu nomning muammosi nimada?",
      type: "single",
      options: [
        "Tugun nomi grafda \"__end__\" bilan to'qnashadi",
        "langchain_core'dagi shu nomli funksiyani berkitib qo'yadi",
        "LangGraph \"_messages\" bilan tugaydigan tugun nomlarini qabul qilmaydi",
        "Bu nom bilan tugun compile() da ValueError beradi"
      ],
      answer: [1],
      explain: "langchain_core.messages da ham trim_messages funksiyasi bor, kursdagi tugun esa uni berkitadi. Darsda qirqish yoki trim_node kabi boshqa nom berish tavsiya qilinadi.",
      lesson: { title: "Xabarlarni qirqish (trimming)", href: "05-Trimming-Messages.md" }
    },
    {
      q: "O'zbekcha bank botida kursdagi [:-5] trim o'rniga lc_trim(..., strategy=\"last\", include_system=True, start_on=\"human\") ishlatildi. Bu nima beradi? (bir nechta javob)",
      type: "multi",
      options: [
        "Xabar soni emas, token bo'yicha qirqiladi: uzun xabar chegarani buzmaydi",
        "\"O'zbek tilida javob bering\" yozilgan SystemMessage o'chmaydi",
        "Qirqilgan eski xabarlar LLM yordamida avtomatik xulosalanadi",
        "Saqlangan qism HumanMessage'dan boshlanadi, juftlik buzilmaydi",
        "include_system strategy=\"first\" bilan ham tizim xabarini saqlaydi"
      ],
      answer: [0, 1, 3],
      explain: "trim_messages token bo'yicha qirqadi, include_system tizim ko'rsatmasini saqlaydi, start_on=\"human\" juftlikni buzmaydi. include_system faqat strategy=\"last\" bilan ishlaydi (\"first\" bilan ValueError), xulosalash esa alohida usul.",
      lesson: { title: "Xabarlarni qirqish (trimming)", href: "05-Trimming-Messages.md" }
    },
    {
      q: "Kursdagi chatbot tuguni xulosa bo'sh bo'lsa ham \"Here's a quick summary...\" SystemMessage'ini yuboradi va model chalkashadi. Darsdagi tuzatish qaysi?",
      type: "single",
      options: [
        "summary maydoniga operator.add reducerini qo'shish",
        "SystemMessage'ni messages ga bir marta qo'shib, keyin qayta yubormaslik",
        "xul bo'sh bo'lmasagina SystemMessage'ni kirishga qo'shish",
        "state[\"summary\"] ni to'g'ridan-to'g'ri o'qib, KeyError bo'lsa grafni to'xtatish"
      ],
      answer: [2],
      explain: "Bo'sh satr bool() da False, shuning uchun if xul orqali xulosa bor-yo'qligi tekshiriladi va SystemMessage faqat kerak bo'lganda qo'shiladi. summary ga operator.add qo'yish esa xulosalarni almashtirish o'rniga ulab yuboradi.",
      lesson: { title: "Xabarlarni xulosalash", href: "06-Summarizing-Messages.md" }
    },
    {
      q: "O'lchovlarga ko'ra xulosalash qo'shishdan 26× kam kirish tokeni ishlatadi. Uning asosiy kamchiligi nima?",
      type: "single",
      options: [
        "LLM chaqiruvlari 2× ko'payadi (20 → 40), kechikish ham oshadi",
        "Xulosalash faqat gpt-4o bilan ishlaydi, gpt-4o-mini bilan emas",
        "Xulosalashda summary maydoni reducersiz bo'lgani uchun xulosa yo'qoladi",
        "Xulosa har burilishda eskisiga ulanib, cheksiz uzayib boradi"
      ],
      answer: [0],
      explain: "Xulosalash token narxini keskin kamaytiradi, lekin har burilishda qo'shimcha chaqiruv qo'shadi: 20 o'rniga 40 ta chaqiruv, foydalanuvchi ikki marta kutadi. summary ning reducersizligi esa to'g'ri — xulosa yangilanishi kerak.",
      lesson: { title: "Xabarlarni xulosalash", href: "06-Summarizing-Messages.md" }
    },
    {
      q: "Kredit botida xulosa \"Foydalanuvchi kredit bilan qiziqmoqda\" bo'lib qoldi, 50 000 000 so'm va 24 oy yo'qoldi. Darsga ko'ra eng ishonchli yechim qaysi?",
      type: "single",
      options: [
        "Xulosalashni butunlay o'chirib, barcha xabarlarni so'zma-so'z saqlash",
        "Har burilishda xulosani ikki marta yaratib, natijalarni solishtirish",
        "trim=5 ni trim=2 ga kamaytirib, xulosani tez-tez yangilash",
        "Muhim faktlarni summa, muddat kabi alohida state maydonlarida saqlash"
      ],
      answer: [3],
      explain: "Alohida state maydonlariga trim ham, xulosalash ham tegmaydi. Qo'shimcha ravishda promptda raqamlar, sanalar va ismlarni saqlash talab qilinadi; gibrid naqshda esa oxirgi xabarlar so'zma-so'z qoladi.",
      lesson: { title: "Xabarlarni xulosalash", href: "06-Summarizing-Messages.md" }
    }
  ]
};
