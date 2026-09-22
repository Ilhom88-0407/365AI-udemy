window.QUIZ = {
  id: "45",
  title: "Graf komponentlari va amalga oshirish",
  subtitle: "State, node, edge, reducer, compile(), stream, shartli qirralar, interrupt va recursion_limit",
  next: { label: "Xabarlarni boshqarish", href: "../46-LangGraph-Message-Management/README.md" },
  questions: [
    {
      q: "Bu kod nimani chiqaradi?",
      code: "from langgraph.graph import START, END\n\nprint(START == \"__start__\", type(END).__name__)",
      type: "single",
      options: [
        "False Node",
        "True Sentinel",
        "True str",
        "False str"
      ],
      answer: [2],
      explain: "START va END sehrli obyekt emas, oddiy satrlar: '__start__' va '__end__'. Shuning uchun routing funksiya \"__end__\" qaytarsa, bu aynan END ning o'zi.",
      lesson: { title: "State, node va edge", href: "01-States-Nodes-and-Edges.md" }
    },
    {
      q: "Sxema TypedDict bilan yozilgan bo'lsa, State(messages=[], notogri_kalit=42) chaqiruvi xato beradi, chunki sxemada bunday kalit yo'q.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "TypedDict asosidagi State(...) oddiy dict qaytaradi va ish vaqtida hech narsani tekshirmaydi. Tekshiruv kerak bo'lsa (masalan, kredit summasi), Pydantic ishlatiladi.",
      lesson: { title: "State, node va edge", href: "01-States-Nodes-and-Edges.md" }
    },
    {
      q: "a va b tugunlari parallel ishlaydi, c ikkalasini kutadi. Kod nimani chiqaradi?",
      code: "class S(TypedDict):\n    natijalar: Annotated[list, operator.add]\n\ndef a(s): return {\"natijalar\": [\"A dan\"]}\ndef b(s): return {\"natijalar\": [\"B dan\"]}\ndef c(s): return {\"natijalar\": s[\"natijalar\"]}\n\ng = StateGraph(S)\ng.add_node(\"a\", a); g.add_node(\"b\", b); g.add_node(\"c\", c)\ng.add_edge(START, \"a\"); g.add_edge(START, \"b\")\ng.add_edge(\"a\", \"c\"); g.add_edge(\"b\", \"c\"); g.add_edge(\"c\", END)\nprint(g.compile().invoke({\"natijalar\": []}))",
      type: "single",
      options: [
        "{'natijalar': ['A dan', 'B dan']} — c yangi hech narsa qo'shmaydi",
        "{'natijalar': ['A dan', 'B dan', 'A dan', 'B dan']}",
        "InvalidUpdateError: Can receive only one value per step",
        "{'natijalar': ['B dan']} — oxirgi yozgan tugun g'olib"
      ],
      answer: [1],
      explain: "operator.add reducer bo'lgani uchun parallel yozuvlar birlashadi. Lekin c mavjud ro'yxatni qaytardi va reducer uni yana qo'shdi, shuning uchun ma'lumot ikkilandi. Reducerli maydonga tugun faqat yangi qismni qaytarishi kerak.",
      lesson: { title: "State, node va edge", href: "01-States-Nodes-and-Edges.md" }
    },
    {
      q: "graph = StateGraph(State) va graph_compiled = graph.compile() bo'lsin. Qaysi amallar darsga ko'ra to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "graph_compiled.batch([s1, s2, s3]) bilan bir necha suhbatni yuritish",
        "graph_compiled.stream(state) bilan qadamma-qadam kuzatish",
        "graph_compiled ni | orqali boshqa LCEL zanjiriga ulash",
        "graph obyektining o'zini Runnable sifatida invoke qilish",
        "isinstance(graph, Runnable) True qaytishini kutish"
      ],
      answer: [0, 1, 2],
      explain: "Faqat compile() natijasi (CompiledStateGraph) Runnable: invoke, batch, stream, ainvoke va | ishlaydi. graph esa qurilish obyekti, isinstance(graph, Runnable) False beradi.",
      lesson: { title: "Birinchi graf — importlar", href: "02-Importing-Relevant-Classes.md" }
    },
    {
      q: "Tizimda eski OPENAI_API_KEY allaqachon o'rnatilgan, .env faylda esa yangisi bor. load_dotenv() qaysi holatda yangi kalitni ishlatadi?",
      type: "single",
      options: [
        "Standart load_dotenv() bilan — .env avtomatik ustun turadi",
        "Faqat Jupyter'da %dotenv sehrli buyrug'i yozilganda",
        "load_dotenv(override=True) bilan — .env qiymati ustun bo'ladi",
        "Iloji yo'q — tizimdagi kalitni avval qo'lda o'chirish kerak"
      ],
      answer: [2],
      explain: "Standart override=False tizimda bor kalitni saqlab qoladi. override=True bo'lsa .env dagi qiymat uni almashtiradi — eski kalit bilan kurashishning sababi shu.",
      lesson: { title: "Birinchi graf — importlar", href: "02-Importing-Relevant-Classes.md" }
    },
    {
      q: "Kursdagi kabi reducersiz sxema bilan bu kod nimani chiqaradi?",
      code: "class State(TypedDict):\n    messages: Sequence[BaseMessage]\n\ndef bot(s): return {\"messages\": [AIMessage(\"javob\")]}\n\ng = StateGraph(State); g.add_node(\"bot\", bot)\ng.add_edge(START, \"bot\"); g.add_edge(\"bot\", END)\nr = g.compile().invoke({\"messages\": [HumanMessage(\"savol\")]})\nprint(len(r[\"messages\"]), r[\"messages\"][0].type)",
      type: "single",
      options: [
        "2 human",
        "1 human",
        "InvalidUpdateError",
        "1 ai"
      ],
      answer: [3],
      explain: "messages maydonida reducer yo'q, shuning uchun tugun qaytargan ro'yxat eski qiymatni almashtiradi: savol jimgina yo'qoladi va faqat AI javobi qoladi. Yechim — Annotated[Sequence[BaseMessage], add_messages].",
      lesson: { title: "State va tugunni aniqlash", href: "03-Defining-a-State-and-a-Node.md" }
    },
    {
      q: "Tugunga model, retriever va chaqiruvlar hisoblagichini berib qo'ymoqchisiz. Darsda qaysi naqsh eng amaliy deb ko'rsatilgan?",
      type: "single",
      options: [
        "Konfiguratsiyani state ichiga har safar yangidan yozish",
        "__call__ metodli sinf obyektini tugun qilish, sozlamalar __init__ da",
        "Model va retrieverni global o'zgaruvchi qilib, lambda tugun ishlatish",
        "Har bir sozlama uchun alohida graf qurib, ularni ketma-ket chaqirish"
      ],
      answer: [1],
      explain: "Sinf tuguni __init__ da model, retriever kabi konfiguratsiyani saqlaydi, __call__ esa uni tugun sifatida ishlatish imkonini beradi (masalan, self.chaqiruv bilan narxni kuzatish).",
      lesson: { title: "State va tugunni aniqlash", href: "03-Defining-a-State-and-a-Node.md" }
    },
    {
      q: "graph.compile() qaysi xatolarni ishga tushirishdan oldin ushlaydi? (bir nechta javob)",
      type: "multi",
      options: [
        "messages maydonida reducer yo'qligi",
        "START dan birorta ham qirra chiqmagani",
        "Hech kim kirmaydigan (yetib bo'lmaydigan) tugun",
        "Mavjud bo'lmagan tugunga qo'yilgan qirra",
        "END ga olib boruvchi yo'l yo'qligi"
      ],
      answer: [1, 3],
      explain: "compile() \"Graph must have an entrypoint\" va \"unknown node\" xatolarini beradi. Reducer yo'qligi, yetib bo'lmaydigan tugun va END ga yo'l yo'qligini esa tekshirmaydi.",
      lesson: { title: "Grafni qurish", href: "04-Building-the-Graph.md" }
    },
    {
      q: "Chat UI da foydalanuvchi javob yozilayotganini token-token ko'rishi kerak. graph_compiled.stream(...) ga qaysi stream_mode beriladi?",
      type: "single",
      options: [
        "stream_mode=\"messages\"",
        "stream_mode=\"updates\"",
        "stream_mode=\"values\"",
        "stream_mode=\"debug\""
      ],
      answer: [0],
      explain: "\"messages\" LLM tokenlarini oqizadi — haqiqiy chatbot uchun. \"updates\" (standart) faqat tugun o'zgarishini, \"values\" esa har qadamdan keyin butun state'ni beradi.",
      lesson: { title: "Grafni qurish", href: "04-Building-the-Graph.md" }
    },
    {
      q: "Bank kredit grafida oylik to'lovni hisoblaydigan tugun bor. Darsga ko'ra bu tugunni qanday qurish kerak?",
      type: "single",
      options: [
        "LLM ga formulani berib, hisoblashni undan so'rash",
        "LLM ga hisoblatib, natijani ikkinchi LLM bilan tekshirish",
        "Hisobni Python kodiga, tushuntirishni LLM ga berish",
        "Hisoblashni butunlay grafdan tashqariga, foydalanuvchiga qoldirish"
      ],
      answer: [2],
      explain: "Qoida: hisob-kitobni kodga, tushuntirishni modelga bering. LLM arifmetikada ishonchsiz, sekin va pulli; darsdagi kredit grafida LLM umuman ishlatilmagan.",
      lesson: { title: "Grafni qurish", href: "04-Building-the-Graph.md" }
    },
    {
      q: "Telegram bot quryapsiz: bot savol berib, foydalanuvchi javobini soatlab kutishi mumkin. Kursdagi input() o'rniga darsda nima tavsiya qilinadi?",
      type: "single",
      options: [
        "input() ni alohida thread ichida chaqirib, javobni navbatda kutish",
        "interrupt() + checkpointer, keyin Command(resume=...) bilan davom",
        "Tugun ichida time.sleep() bilan javob kelguncha tsiklda kutish",
        "recursion_limit ni oshirib, javob kelguncha grafni aylantirish"
      ],
      answer: [1],
      explain: "input() jarayonni bloklaydi va veb, bot, testda ishlamaydi. interrupt grafni to'xtatadi, holat checkpointer'da saqlanadi va keyinroq Command(resume=...) bilan davom etadi.",
      lesson: { title: "Shartli qirralar — tugunlar va routing funksiya", href: "05-Conditional-Edges-Nodes-and-Routing.md" }
    },
    {
      q: "messages ga reducer qo'shilgach xabarlar yig'ila boshladi. Bu routing funksiya nimani qaytaradi?",
      code: "xs = [HumanMessage(\"Piet Hein kim?\"),\n      AIMessage(\"Daniyalik olim va shoir.\"),\n      HumanMessage(\"yes\")]\n\ndef routing(xs):\n    return \"ask_question\" if xs[0].content == \"yes\" else \"__end__\"\n\nprint(routing(xs))",
      type: "single",
      options: [
        "__end__",
        "ask_question",
        "yes",
        "IndexError"
      ],
      answer: [0],
      explain: "xs[0] — doim birinchi savol, \"yes\" emas, shuning uchun routing har safar \"__end__\" qaytaradi va sikl ishlamaydi. To'g'risi — oxirgi xabarni tekshirish: xs[-1].",
      lesson: { title: "Shartli qirralar — tugunlar va routing funksiya", href: "05-Conditional-Edges-Nodes-and-Routing.md" }
    },
    {
      q: "Siklli grafda routing funksiya hech qachon \"__end__\" qaytarmaydi va recursion_limit berilmagan. O'lchangan natijaga ko'ra nima bo'ladi?",
      type: "single",
      options: [
        "25 qadamdan keyin graf jimgina to'xtab, oxirgi state'ni qaytaradi",
        "compile() bosqichidayoq sikl topilib, xato chiqadi",
        "Graf abadiy aylanadi, hech qanday xato chiqmaydi",
        "~5000 aylanishdan so'ng GraphRecursionError (10 007)"
      ],
      answer: [3],
      explain: "Yangi versiyada standart chegara 10 007: sikl ~5000 marta aylanadi. Haqiqiy model bilan bu bitta so'rov uchun soatlab vaqt va dollarlar, shuning uchun recursion_limit ni qo'lda qo'yish kerak.",
      lesson: { title: "Shartli grafni qurish", href: "06-Conditional-Edges-Building-the-Graph.md" }
    },
    {
      q: "Darsdagi ikki qavatli himoyada state hisoblagichi (masalan, burilish >= 20) nega faqat recursion_limit dan yaxshiroq?",
      type: "single",
      options: [
        "Hisoblagich grafni tezroq ishlatadi va har burilishdagi token sarfini kamaytiradi",
        "Hisoblagich nazoratli to'xtaydi va xabar bera oladi, recursion_limit esa xato bilan",
        "recursion_limit faqat Jupyter'da ishlaydi, hisoblagich esa veb va botlarda ham",
        "Hisoblagich bo'lsa recursion_limit ni butunlay olib tashlash mumkin bo'ladi"
      ],
      answer: [1],
      explain: "Hisoblagich routing ichida \"__end__\" qaytarib nazoratli to'xtaydi. recursion_limit esa oxirgi himoya sifatida qoladi: u GraphRecursionError bilan to'xtatadi va foydalanuvchi nima bo'lganini bilmaydi.",
      lesson: { title: "Shartli grafni qurish", href: "06-Conditional-Edges-Building-the-Graph.md" }
    },
    {
      q: "add_conditional_edges(source=\"ask_another_question\", path=routing_function) qo'shildi, lekin vizualizatsiyada bu tugundan tarmoqlanish ko'rinmayapti. Qaysi yechimlar darsda keltirilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "routing_function ga -> Literal[\"ask_question\", \"__end__\"] qo'shish",
        "add_conditional_edges ga path_map xaritasini (qiymat → tugun) berish",
        "Shartli qirra o'rniga ikkita oddiy add_edge bilan ikkala yo'lni qo'shish",
        "draw_mermaid_png() ishlatish — u shartli qirrani o'zi topadi"
      ],
      answer: [0, 1],
      explain: "LangGraph mumkin bo'lgan yo'llarni Literal tip ko'rsatmasidan yoki path_map dan oladi. Ikkita oddiy add_edge esa shartni yo'q qiladi — ikkala tugun doim ishlaydi.",
      lesson: { title: "Shartli grafni qurish", href: "06-Conditional-Edges-Building-the-Graph.md" }
    }
  ]
};
