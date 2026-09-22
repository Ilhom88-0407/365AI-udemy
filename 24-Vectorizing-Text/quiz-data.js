window.QUIZ = {
  id: "24",
  title: "Matnni vektorlashtirish",
  subtitle: "Nima uchun matn raqamga aylanadi, Bag of Words (CountVectorizer) va TF-IDF (TfidfVectorizer)",
  next: { label: "Mavzu modellashtirish", href: "../25-Topic-Modelling/README.md" },
  questions: [
    {
      q: "Matn tozalandi (kichik harf, to'xtatish so'zlar, lemmatizatsiya). Nega uni hali ham to'g'ridan-to'g'ri ML algoritmiga berib bo'lmaydi?",
      type: "single",
      options: [
        "Chunki tozalangan matnda hali ham tinish belgilar qolgan bo'ladi",
        "Chunki algoritm matematik funksiya — unga matn emas, raqamlar kerak",
        "Chunki algoritm faqat ingliz tilidagi matnni tushuna oladi",
        "Chunki tozalangan matn ML uchun juda qisqa bo'lib qoladi"
      ],
      answer: [1],
      explain: "Oldindan qayta ishlashning uchinchi qadami — vektorlashtirish: matn algoritm tushunadigan raqamli tasvirga aylantiriladi. \"great\" ni ko'paytirib bo'lmaydi, 0.847 ni esa bo'ladi.",
      lesson: { title: "Matnning raqamli tasviri", href: "01-Numerical-Representation-of-Text.md" }
    },
    {
      q: "\"Sobir Aliyni urdi\" va \"Ali Sobirni urdi\" yoki \"yaxshi emas\" va \"emas yaxshi\" misollari Bag of Words'ning qaysi kamchiligini ko'rsatadi?",
      type: "single",
      options: [
        "U kam uchraydigan so'zlarga juda katta vazn beradi",
        "U bir xil so'zlarni turli ustunlarga joylashtiradi",
        "U so'zlar tartibini hisobga olmaydi",
        "U faqat butun sonlar bilan emas, kasrlar bilan ishlaydi"
      ],
      answer: [2],
      explain: "So'zlar xaltaga solinib silkitilgandek: faqat qaysi so'z borligi qoladi, tartib yo'qoladi. Shuning uchun ma'nosi teskari jumlalar bir xil vektorga aylanadi.",
      lesson: { title: "Matnning raqamli tasviri", href: "01-Numerical-Representation-of-Text.md" }
    },
    {
      q: "6 ta mehmonxona sharhida \"the\" hamma sharhda, \"parking\" 2 tasida, \"cockroach\" faqat 1 tasida bor. TF-IDF qaysi so'zga eng yuqori ball beradi?",
      type: "single",
      options: [
        "\"cockroach\" — u hujjatni boshqalardan ajratib turadi",
        "\"the\" — u eng ko'p uchraydi",
        "\"parking\" — u o'rtacha tez-tez uchraydi",
        "Uchalasi ham bir xil ball oladi"
      ],
      answer: [0],
      explain: "TF-IDF noyoblikni mukofotlaydi: hamma joyda uchraydigan so'z hech narsa aytmaydi, faqat bitta hujjatda uchraydigan so'z esa aynan shu hujjatni ajratib turadi.",
      lesson: { title: "Matnning raqamli tasviri", href: "01-Numerical-Representation-of-Text.md" }
    },
    {
      q: "Bag of Words va TF-IDF haqida qaysi gaplar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Ikkalasi ham so'z tartibini yo'qotadi",
        "TF-IDF so'z boshqa hujjatlarda qanday uchrashini hisobga oladi",
        "Bag of Words \"the\" kabi so'zlarga avtomatik past qiymat beradi",
        "Bag of Words qiymatlari butun sonlar, TF-IDF qiymatlari kasr sonlar",
        "TF-IDF so'z tartibini saqlaydi, shuning uchun u doim yaxshiroq"
      ],
      answer: [0, 1, 3],
      explain: "BOW sanaydi (0, 1, 2…), TF-IDF muhimlikni kasr ball bilan o'lchaydi va boshqa hujjatlarni ham inobatga oladi. Tartibni esa ikkalasi ham yo'qotadi — buning uchun embeddings va transformerlar kerak.",
      lesson: { title: "Matnning raqamli tasviri", href: "01-Numerical-Representation-of-Text.md" }
    },
    {
      q: "Bu kod nima chop etadi?",
      code: "from sklearn.feature_extraction.text import CountVectorizer\n\nvec = CountVectorizer()\nX = vec.fit_transform([\"the cat sat on the mat\"])\nprint(vec.get_feature_names_out())\nprint(X.toarray())",
      type: "single",
      options: [
        "['cat' 'mat' 'on' 'sat' 'the']\n[[1 1 1 1 1]]",
        "['the' 'cat' 'sat' 'on' 'mat']\n[[2 1 1 1 1]]",
        "['cat' 'mat' 'on' 'sat' 'the']\n[[1 1 1 1 2]]",
        "['the' 'cat' 'sat' 'on' 'the' 'mat']\n[[1 1 1 1 1 1]]"
      ],
      answer: [2],
      explain: "Ustunlar alifbo tartibida saralanadi, CountVectorizer esa sanaydi: \"the\" 2 marta uchragani uchun oxirgi katakda 2 turadi (faqat 0/1 emas).",
      lesson: { title: "Bag of Words modeli", href: "02-Bag-of-Words.md" }
    },
    {
      q: "Quyidagi kodda boshlovchilarning eng keng tarqalgan xatosi bor. Uchinchi qatorni qanday tuzatish kerak?",
      code: "vec = CountVectorizer()\nX_train = vec.fit_transform(train_data)\nX_test = vec.fit_transform(test_data)",
      type: "single",
      options: [
        "X_test = vec.fit(test_data)",
        "X_test = CountVectorizer().fit_transform(test_data)",
        "X_test = vec.fit_transform(train_data + test_data)",
        "X_test = vec.transform(test_data)"
      ],
      answer: [3],
      explain: "Sinov ma'lumotida fit qilinsa yangi lug'at yaratiladi va ustunlar o'rgatuvchi ma'lumotga mos kelmaydi. Sinov uchun faqat transform ishlatiladi.",
      lesson: { title: "Bag of Words modeli", href: "02-Bag-of-Words.md" }
    },
    {
      q: "Bu kod nima chop etadi?",
      code: "from sklearn.feature_extraction.text import CountVectorizer\n\nvec = CountVectorizer(binary=True)\nX = vec.fit_transform([\"good good good\", \"good bad\"])\nprint(X.toarray())",
      type: "single",
      options: [
        "[[0 3]\n [1 1]]",
        "[[0 1]\n [1 1]]",
        "[[1 0]\n [1 1]]",
        "[[3 0]\n [1 1]]"
      ],
      answer: [1],
      explain: "Ustunlar alifbo tartibida: bad, good. binary=True bo'lgani uchun \"good\" 3 marta uchrasa ham faqat 1 yoziladi.",
      lesson: { title: "Bag of Words modeli", href: "02-Bag-of-Words.md" }
    },
    {
      q: "sklearn fit_transform natijasini siyrak matritsa (sparse matrix) sifatida saqlaydi. Buning sababi nima?",
      type: "single",
      options: [
        "Hujjat-so'z jadvalining katta qismi noldan iborat, faqat nolmas qiymatlarni saqlash xotirani tejaydi",
        "Siyrak matritsa so'zlar tartibini saqlab qolish uchun kerak",
        "Siyrak matritsada qiymatlar avtomatik ravishda 0 va 1 ga aylanadi",
        "pd.DataFrame siyrak matritsani .toarray() siz ham to'g'ridan-to'g'ri qabul qiladi"
      ],
      answer: [0],
      explain: "6 ta jumlada ham kataklarning ~80% nol edi, katta korpusda esa ~99.9%. Shuning uchun katta ma'lumotda .toarray() bilan to'liq jadvalga aylantirmaslik kerak.",
      lesson: { title: "Bag of Words modeli", href: "02-Bag-of-Words.md" }
    },
    {
      q: "CountVectorizer parametrlari haqida qaysi gaplar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "stop_words='english' — \"the\", \"is\" kabi to'xtatish so'zlarni o'chiradi",
        "min_df=2 — faqat kamida 2 ta hujjatda uchragan so'zlarni qoldiradi",
        "ngram_range=(1, 2) — \"not good\" kabi birikmalarni ham ustun qiladi",
        "binary=True — qiymatlarni 0 va 1 orasidagi kasrlarga normallashtiradi",
        "max_features=1000 — har bir hujjatdan birinchi 1000 ta so'zni oladi"
      ],
      answer: [0, 1, 2],
      explain: "binary=True kasr emas, faqat 0/1 (bor/yo'q) beradi; max_features esa korpusdagi eng ko'p uchraydigan so'zlarni tanlaydi. ngram_range=(1, 2) bilan darsda ustunlar 71 dan 156 ga o'sdi.",
      lesson: { title: "Bag of Words modeli", href: "02-Bag-of-Words.md" }
    },
    {
      q: "TF qanday hisoblanadi va nega bo'lish amali kerak?",
      type: "single",
      options: [
        "So'z bor hujjatlar soni / jami hujjatlar — so'zning noyobligini o'lchash uchun",
        "So'z hujjatda necha marta / hujjatdagi jami so'zlar — hujjat uzunligini tenglashtirish uchun",
        "So'z korpusda necha marta / lug'at hajmi — ballarni 0 va 1 orasiga keltirish uchun",
        "Hujjatdagi jami so'zlar / so'z necha marta — kam uchraydigan so'zga yuqori ball berish uchun"
      ],
      answer: [1],
      explain: "Uzun hujjatda so'z tabiiy ravishda ko'proq uchraydi. Bo'lish uzunlikni tenglashtiradi: \"the cat\" da TF(the)=0.5, sakkiz so'zli jumlada 2 marta bo'lsa ham 0.25.",
      lesson: { title: "TF-IDF", href: "03-TF-IDF.md" }
    },
    {
      q: "Klassik formulada hamma hujjatda uchraydigan so'zning IDF'i log(N/N) = 0. sklearn'da esa ln((1+N)/(1+df)) + 1 ishlatiladi. Buning natijasi qanday?",
      type: "single",
      options: [
        "Hamma joyda uchraydigan so'z butunlay lug'atdan o'chiriladi",
        "Noyob so'zlarning IDF'i klassikdagidan ikki baravar kichik bo'ladi",
        "IDF manfiy qiymat ham olishi mumkin bo'ladi",
        "Hamma joyda uchraydigan so'zning balli kichik bo'ladi, lekin nol bo'lmaydi"
      ],
      answer: [3],
      explain: "Silliqlash (+1) tufayli \"the\" ning IDF'i ln(7/7) + 1 = 1.0 bo'ldi — kichik, lekin nol emas, so'z butunlay yo'qolmaydi.",
      lesson: { title: "TF-IDF", href: "03-TF-IDF.md" }
    },
    {
      q: "Bu kod qanday IDF qiymatlarini chop etadi?",
      code: "from sklearn.feature_extraction.text import TfidfVectorizer\n\ndocs = [\"the cat\", \"the dog\", \"the bird\"]\nvec = TfidfVectorizer()\nvec.fit(docs)\nprint(vec.get_feature_names_out())\nprint(vec.idf_.round(4))",
      type: "single",
      options: [
        "\"the\" uchun 0.0, qolgan uchta so'z uchun 1.0986",
        "\"the\" uchun 1.0, qolgan uchta so'z uchun 1.6931",
        "To'rttala so'z uchun ham 1.0",
        "\"the\" uchun 1.6931, qolgan uchta so'z uchun 1.0"
      ],
      answer: [1],
      explain: "N=3. \"the\" 3 ta hujjatda: ln(4/4)+1 = 1.0. cat, dog, bird 1 tadan: ln(4/2)+1 = 1.6931. sklearn'da IDF hech qachon 0 bo'lmaydi.",
      lesson: { title: "TF-IDF", href: "03-TF-IDF.md" }
    },
    {
      q: "1-hujjatda ham, 5-hujjatda ham \"the\" 3 martadan uchraydi, lekin TF-IDF ballari 0.391 va 0.290. Bunga nima sabab?",
      type: "single",
      options: [
        "5-hujjat uzunroq (22 so'z), shuning uchun \"the\" ning ulushi kichikroq",
        "5-hujjatda \"the\" boshqa hujjatlarga qaraganda kamroq uchraydi",
        "IDF har bir hujjat uchun alohida hisoblangani uchun",
        "1-hujjatda to'xtatish so'zlar olib tashlangani uchun"
      ],
      answer: [0],
      explain: "BOW ikkalasiga ham 3 deydi. TF-IDF esa hujjat uzunligini hisobga oladi: qisqa (14 so'zli) 1-hujjatda \"the\" ulushi kattaroq. IDF esa so'z uchun butun korpusda bitta.",
      lesson: { title: "TF-IDF", href: "03-TF-IDF.md" }
    },
    {
      q: "TfidfVectorizer standart sozlamada har bir hujjat vektorining uzunligini (L2 normasini) 1.0 ga keltiradi. Shu gap to'g'rimi?",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Standart norm='l2' tufayli har bir qator normasi 1.0 bo'ladi, shunda uzun hujjat faqat uzunligi tufayli muhimroq ko'rinmaydi.",
      lesson: { title: "TF-IDF", href: "03-TF-IDF.md" }
    },
    {
      q: "Bu kod nima chop etadi? (nnz — nolmas qiymatlar soni)",
      code: "from sklearn.feature_extraction.text import TfidfVectorizer\n\nvec = TfidfVectorizer()\nvec.fit([\"the shark swam\", \"the beach is sunny\"])\nyangi = vec.transform([\"a shark attacked near the beach\"])\nprint(yangi.nnz)",
      type: "single",
      options: ["6", "5", "0", "3"],
      answer: [3],
      explain: "transform faqat fit paytida ko'rilgan so'zlarni biladi: shark, the, beach. \"attacked\", \"near\" lug'atda yo'q (OOV), \"a\" esa bir harfli bo'lgani uchun umuman tokenga aylanmaydi.",
      lesson: { title: "TF-IDF", href: "03-TF-IDF.md" }
    }
  ]
};
