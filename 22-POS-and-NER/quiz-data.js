window.QUIZ = {
  id: "22",
  title: "POS teglash va NER",
  subtitle: "spaCy bilan nutq qismlarini teglash, nomlangan ob'ektlarni tanib olish va tozalashni qachon qilish",
  next: { label: "Sentiment tahlili", href: "../23-Sentiment-Analysis/README.md" },
  questions: [
    {
      q: "Jumlada \"the\" so'zi va \"Larry Page\" ismi bor. POS teglash va NER ularni qanday qayta ishlaydi?",
      type: "single",
      options: [
        "POS \"the\" ni e'tiborsiz qoldiradi; NER \"Larry\" va \"Page\" ni ikkita PERSON qiladi",
        "POS \"the\" ni DET, \"Larry\" va \"Page\" ni ikkita PROPN deb teglaydi; NER \"the\" ni o'tkazib, \"Larry Page\" ni bitta PERSON qiladi",
        "Ikkalasi ham har bir tokenni teglaydi, faqat yorliq nomlari farq qiladi",
        "NER \"the\" ni DET deb teglaydi; POS esa \"Larry Page\" ni bitta PERSON qiladi"
      ],
      answer: [1],
      explain: "POS teglash har bir tokenga nutq qismini qo'yadi. NER esa matndan faqat nomlangan ob'ektlarni tortib oladi va bir necha so'zni bitta ob'ektga birlashtiradi.",
      lesson: { title: "Matnni teglash", href: "01-Text-Tagging.md" }
    },
    {
      q: "Qaysi vazifalar uchun darsga ko'ra aynan NER mos keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Rezyumedan nomzodning ismi va ishlagan kompaniyasini ajratib olish",
        "Chatbotda \"Toshkentga chipta\" so'rovidan shahar nomini topish",
        "Grammatik tekshirgichda fe'l va ot mosligini tekshirish",
        "Matndagi faqat otlarni ajratib, mavzuni aniqlash"
      ],
      answer: [0, 1],
      explain: "Ism, kompaniya (PERSON, ORG) va shahar (GPE) — nomlangan ob'ektlar, ya'ni NER vazifasi. Fe'l–ot mosligi va otlarni ajratish esa POS teglash ishi.",
      lesson: { title: "Matnni teglash", href: "01-Text-Tagging.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "import spacy\nnlp = spacy.load(\"en_core_web_sm\")\n\ndoc = nlp(\"Google was founded by Larry Page in 1998 in California.\")\nprint([e.text for e in doc.ents if e.label_ == \"PERSON\"])",
      type: "single",
      options: [
        "['Larry', 'Page']",
        "['Google', 'Larry Page']",
        "['Larry Page', 'California']",
        "['Larry Page']"
      ],
      answer: [3],
      explain: "doc.ents to'liq ob'ektlarni beradi: Google — ORG, Larry Page — PERSON, 1998 — DATE, California — GPE. PERSON faqat bitta, u ham ikki so'zdan iborat bitta ob'ekt.",
      lesson: { title: "Matnni teglash", href: "01-Text-Tagging.md" }
    },
    {
      q: "POS teglashdan oldin matndan to'xtatish so'zlarini olib tashlash teglar sifatini yaxshilaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "POS teglash grammatikaga tayanadi. To'xtatish so'zlarisiz jumla tuzilishi buziladi va \"affectionate\" → VERB, \"governess\" → ADJ kabi ma'nosiz teglar chiqadi.",
      lesson: { title: "POS teglash — nutq qismlari", href: "02-POS-Tagging.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "import spacy\nnlp = spacy.load(\"en_core_web_sm\")\n\ndoc = nlp(\"Google was founded by Larry Page in 1998 in California.\")\nt = doc[0]\nprint(t.text, t.pos_)",
      type: "single",
      options: ["Google ORG", "Google PROPN", "Google 96", "Google NOUN"],
      answer: [1],
      explain: "pos_ (pastki chiziq bilan) nutq qismini matn sifatida qaytaradi: Google — atoqli ot, PROPN. Pastki chiziqsiz pos raqam (ichki ID) beradi, ORG esa NER yorlig'i.",
      lesson: { title: "POS teglash — nutq qismlari", href: "02-POS-Tagging.md" }
    },
    {
      q: "\"Emma\" matnidagi eng ko'p tokenlar ro'yxati \"of, her, had, and, the...\" bo'lib chiqdi. Matn nima haqida ekanini bilish uchun keyingi qadam qaysi?",
      type: "single",
      options: [
        "Matnni qayta yuklab, to'xtatish so'zlarini o'chirib, qaytadan teglash",
        "Kattaroq en_core_web_lg modeliga o'tib, xuddi shu ro'yxatni olish",
        "pos_df_counts[pos_df_counts.pos_tag == \"NOUN\"][:10] bilan teg bo'yicha filtrlash",
        "pos_df_counts.sort_values(by=\"counts\") bilan o'sish tartibida saralash"
      ],
      answer: [2],
      explain: "Umumiy ro'yxatda faqat to'xtatish so'zlari bo'ladi. Otlar bo'yicha filtrlash governess, friend, mother, sisters kabi so'zlarni ko'rsatadi — matn ayollar va oila haqida.",
      lesson: { title: "POS teglash — nutq qismlari", href: "02-POS-Tagging.md" }
    },
    {
      q: "Kichik harfdagi \"Emma\" matnida \"emma\" 3 marta uchradi, lekin spaCy uni faqat 1 marta PROPN deb tegladi. Buning sababi nima?",
      type: "single",
      options: [
        "Bosh harf — atoqli otning eng kuchli belgisi yo'qolgan, spaCy faqat kontekstga tayanadi",
        "en_core_web_sm modeli ayol ismlarini umuman tanimaydi",
        "Matndan to'xtatish so'zlari olib tashlangani uchun grammatika buzilgan",
        "spaCy har bir so'zni faqat birinchi uchraganida to'g'ri teglaydi"
      ],
      answer: [0],
      explain: "Matn kichik harfga o'tkazilgan, to'xtatish so'zlari esa qoldirilgan. Bosh harf yo'qligi sababli spaCy kontekstga tayanishga majbur, bu esa har doim ham yetarli emas.",
      lesson: { title: "POS teglash — nutq qismlari", href: "02-POS-Tagging.md" }
    },
    {
      q: "Google matni tozalangach, NER 24 ta o'rniga atigi 13 ta ob'ekt topdi. Darsga ko'ra to'g'ri ish tartibi qanday?",
      type: "single",
      options: [
        "Avval to'liq tozalash, keyin NER — shunda shovqin kamroq bo'ladi",
        "Avval lemmatizatsiya, keyin NER, oxirida tinish belgilarni olib tashlash",
        "NER faqat tokenlarga ajratilgan va kichik harfli matnda ishlatiladi",
        "Avval xom matnda NER, ob'ektlarni saqlab, keyin tozalash"
      ],
      answer: [3],
      explain: "NER aynan tozalashda o'chiriladigan bosh harf va tinish belgilarga tayanadi. Shuning uchun u xom matnda birinchi bajariladi, tozalash esa keyin qilinadi.",
      lesson: { title: "NER — nomlangan ob'ektlarni tanib olish", href: "03-Named-Entity-Recognition.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "import re\n\ntext = \"They own about 14% of its shares.\"\nprint(re.sub(r\"[^\\w\\s]\", \"\", text).lower())",
      type: "single",
      options: [
        "they own about 14% of its shares",
        "They own about 14 of its shares",
        "they own about 14 of its shares",
        "they own about 14 of its shares."
      ],
      answer: [2],
      explain: "Regex % va nuqtani o'chiradi, .lower() esa hammasini kichik harfga o'tkazadi. Aynan shu sababli NER \"about 14%\" ni PERCENT o'rniga CARDINAL (oddiy son) deb teglay boshlaydi.",
      lesson: { title: "NER — nomlangan ob'ektlarni tanib olish", href: "03-Named-Entity-Recognition.md" }
    },
    {
      q: "Tozalangan matnda spaCy \"alphabet inc google\" ni bitta ORG deb topdi. Nega bunday bo'ldi?",
      type: "single",
      options: [
        "Chunki kichik harfda \"alphabet\" va \"google\" bir xil kompaniya nomi deb qaraladi",
        "Chunki \"Inc.\" dagi nuqta o'chirilib, jumla chegarasi yo'qoldi",
        "Chunki lemmatizer \"inc\" ni \"google\" bilan birlashtirib yubordi",
        "Chunki spaCy bir jumlada faqat bitta ORG ob'ektini qaytaradi"
      ],
      answer: [1],
      explain: "Xom matnda \"...Alphabet Inc. Google is...\" dagi nuqta jumla chegarasi edi. U o'chirilgach, spaCy keyingi jumladagi Google ni ham shu ob'ektga qo'shib yubordi.",
      lesson: { title: "NER — nomlangan ob'ektlarni tanib olish", href: "03-Named-Entity-Recognition.md" }
    },
    {
      q: "NER'ni tozalashdan keyin qilishga majbur bo'lsangiz, darsdagi tajribaga ko'ra qaysi qadamdan albatta voz kechish kerak?",
      type: "single",
      options: [
        "Tinish belgilarni o'chirishdan — ular PERSON ob'ektlarining ko'pini yo'qotadi",
        "Tokenizatsiyadan — NER faqat butun matn bilan ishlaydi",
        "Kichik harfga o'tkazishdan — u PERSON sonini 5 tadan 1 taga tushiradi",
        "To'xtatish so'zlarini o'chirishdan — NER ularga tayanadi"
      ],
      answer: [2],
      explain: "Faqat .lower() qilinganda PERSON 5 tadan 1 taga tushdi, faqat tinish belgilar o'chirilganda esa 4 tasi qoldi. Bosh harf odam ismini tanishning asosiy belgisi.",
      lesson: { title: "NER — nomlangan ob'ektlarni tanib olish", href: "03-Named-Entity-Recognition.md" }
    },
    {
      q: "BBC amaliyotida nega sarlavhalardan ikki xil token ro'yxati — tokens_raw va tokens_clean_lemmatized — yaratildi?",
      type: "single",
      options: [
        "Xom tokenlar NER uchun kerak (bosh harf, tinish belgi saqlanadi), tozasi esa ML va solishtirish uchun",
        "Xom tokenlar lemmatizatsiya uchun, tozasi esa faqat displacy vizuali uchun",
        "spaCy bir vaqtda faqat 1000 tadan kam tokenni qayta ishlay olgani uchun",
        "Ikkalasi bir xil, faqat biri zaxira nusxa sifatida saqlanadi"
      ],
      answer: [0],
      explain: "NER bosh harf va tinish belgiga tayanadi, shuning uchun xom tokenlar saqlanadi. Tozalangan, lemmatizatsiya qilingan tokenlar esa mashinali o'qitish uchun yaxshi va ikkalasini solishtirish mumkin.",
      lesson: { title: "Amaliy vazifa — 1000 ta BBC yangiligi", href: "04-Practical-Task.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "import spacy\nnlp = spacy.load(\"en_core_web_sm\")\n\ndoc = nlp(\"Google was founded by Larry Page in 1998 in California.\")\ntokens = [t for t in doc if t.ent_type_ != \"\"]\nprint(len(tokens), len(doc.ents))",
      type: "single",
      options: ["4 4", "4 5", "5 4", "5 5"],
      answer: [2],
      explain: "Token darajasida Google, Larry, Page, 1998, California — 5 ta token ob'ekt turiga ega. doc.ents esa \"Larry Page\" ni bitta ob'ekt deb sanaydi, shuning uchun 4 ta.",
      lesson: { title: "Amaliy vazifa — 1000 ta BBC yangiligi", href: "04-Practical-Task.md" }
    },
    {
      q: "token.ent_type_ o'rniga doc.ents ishlatilganda BBC natijalaridagi qaysi muammolar hal bo'ldi? (bir nechta javob)",
      type: "multi",
      options: [
        "\"World\", \"Cup\", \"2022\" bitta \"World Cup 2022\" ob'ektiga birlashdi",
        "\"'s\" va \"-\" belgilar endi PERSON deb chiqmaydi",
        "\"Covid\" endi PERSON deb teglanmaydi",
        "\"Liz Truss\", \"Boris Johnson\" kabi to'liq ismlar bitta ob'ekt bo'lib chiqdi"
      ],
      answer: [0, 1, 3],
      explain: "doc.ents ob'ekt darajasida ishlaydi: ko'p so'zli nomlarni birlashtiradi va bo'lak tokenlarni chiqarmaydi. Lekin Covid va Quiz baribir PERSON bo'lib qoldi — bu spaCy xatosi, uni qo'lda filtrlash kerak.",
      lesson: { title: "Amaliy vazifa — 1000 ta BBC yangiligi", href: "04-Practical-Task.md" }
    },
    {
      q: "Xom BBC sarlavhalarida eng ko'p uchragan token \":\" (543 marta) bo'ldi. Bu natijadan qanday xulosa chiqarish mumkin?",
      type: "single",
      options: [
        "Sarlavhalar noto'g'ri yuklangan, CSV faylni qayta o'qish kerak",
        "spaCy \":\" ni PUNCT emas, NOUN deb teglagan, bu model xatosi",
        "Sarlavhalarda vaqt ko'p ko'rsatiladi, masalan \"10:30\" kabi",
        "BBC sarlavhalari ko'pincha \"Mavzu: Xabar\" uslubida yoziladi"
      ],
      answer: [3],
      explain: "\"Ukraine war: Russia strikes Kyiv\" kabi sarlavhalar BBC'ning tahririy uslubi. Xom tokenlardagi top-10 asosan axlat bo'lsa ham, bu kabi kuzatuv ham insayt beradi.",
      lesson: { title: "Amaliy vazifa — 1000 ta BBC yangiligi", href: "04-Practical-Task.md" }
    }
  ]
};
