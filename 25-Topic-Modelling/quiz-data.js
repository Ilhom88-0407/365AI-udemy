window.QUIZ = {
  id: "25",
  title: "Mavzu modellashtirish",
  subtitle: "Nazoratsiz o'qitish, LDA va LSA nazariyasi va Python'da, max_df/min_df bilan tozalash va koherentlik orqali mavzular sonini tanlash",
  next: { label: "O'z matn tasniflagichingiz", href: "../26-Text-Classifier/README.md" },
  questions: [
    {
      q: "Mavzu modellashtirish nima uchun nazoratsiz (unsupervised) o'qitishga misol hisoblanadi?",
      type: "single",
      options: [
        "Chunki u hujjatlarni oldindan belgilangan turkumlarga joylaydi",
        "Chunki unga har bir hujjat uchun mavzu yorlig'i kerak bo'lmaydi",
        "Chunki u faqat inson nazoratisiz internetdan ma'lumot yig'adi",
        "Chunki u o'qitishdan keyin hech qanday natijani qaytarmaydi"
      ],
      answer: [1],
      explain: "Algoritm yorliqlarsiz, faqat hujjatlar bo'ylab o'xshash so'z naqshlarini topib ishlaydi. 10 000 ta sharhni qo'lda teglash kerak emas — bu asosiy afzallik.",
      lesson: { title: "Mavzu modellashtirish nima?", href: "01-What-is-Topic-Modelling.md" }
    },
    {
      q: "Mavzu modeli har bir hujjatni faqat bitta mavzuga joylaydi. Shu gap to'g'rimi?",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Bir hujjat bir nechta mavzudan iborat bo'lishi mumkin: model hujjatni bitta qutiga solmaydi, balki har bir mavzuning ulushini beradi (masalan, uskuna 30%, media 40%, hukumat 30%).",
      lesson: { title: "Mavzu modellashtirish nima?", href: "01-What-is-Topic-Modelling.md" }
    },
    {
      q: "Quyidagi vazifalardan qaysilari uchun mavzu modeli mos keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "10 000 ta shikoyatda qanday muammolar borligini bilish",
        "Kelgan emailning spam yoki spam emasligini avtomatik aniqlash",
        "500 ta ilmiy maqoladagi yo'nalishlarni topish",
        "Mahsulot sharhining ijobiy yoki salbiy ekanini aniqlash"
      ],
      answer: [0, 2],
      explain: "Kalit savol: \"Men turkumlarni bilamanmi?\" Yo'q bo'lsa — mavzu modeli (kashfiyot). Spam va sentiment kabi ma'lum turkumlar uchun esa tasniflagich kerak.",
      lesson: { title: "Qachon ishlatiladi?", href: "02-When-to-Use-Topic-Modelling.md" }
    },
    {
      q: "Kompaniyada 5000 ta sharh bor va har biriga allaqachon turkum yorlig'i qo'yilgan. Endi yangi sharhlarni shu turkumlarga avtomatik joylash kerak. Darsga ko'ra nima tanlanadi?",
      type: "single",
      options: [
        "LDA — chunki u yorliqlarni hisobga olib mavzularni aniqroq topadi",
        "LSA — chunki u yorliqli ma'lumotda LDA'dan tezroq ishlaydi",
        "Tasniflagich — yorliqlar bor va turkumlar ma'lum",
        "Koherentlik balli — u eng mos turkumni avtomatik tanlaydi"
      ],
      answer: [2],
      explain: "Yorliqlar allaqachon bo'lsa, mavzu modeli ularni e'tiborga olmaydi. Mavzu modeli \"qanday guruhlar bor?\" (kashfiyot), tasniflagich \"bu qaysi guruhga tegishli?\" (bashorat) savoliga javob beradi.",
      lesson: { title: "Qachon ishlatiladi?", href: "02-When-to-Use-Topic-Modelling.md" }
    },
    {
      q: "LDA'dagi Dirichlet taqsimoti farazi nimani bildiradi?",
      type: "single",
      options: [
        "Hujjatda barcha mavzular taxminan teng ulushda uchraydi",
        "Har bir so'z faqat bitta mavzuga tegishli bo'la oladi",
        "Mavzular soni ma'lumotning o'zidan avtomatik aniqlanadi",
        "Hujjat asosan bitta mavzu haqida, boshqalari ozgina"
      ],
      answer: [3],
      explain: "Ulushlar teng bo'lmaydi, biri ustun keladi (masalan, sport 85%, siyosat 8%...). Haqiqiy matnlar ham shunday yoziladi. So'zlar esa bir nechta mavzuga tegishli bo'lishi mumkin (crash, bank).",
      lesson: { title: "LDA — Latent Dirichlet Allocation", href: "03-Latent-Dirichlet-Allocation.md" }
    },
    {
      q: "LDA so'zlarni avval tasodifiy tayinlaydi, keyin har bir so'zni qayta ko'rib chiqadi. Tuzatish bosqichida qaysi ma'lumotlarga qaraladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Shu hujjatdagi boshqa so'zlar qaysi mavzularga tayinlangani",
        "Shu so'z boshqa hujjatlarda qaysi mavzuga tayinlangani",
        "So'zning jumladagi o'rni va undan oldingi so'z qaysi ekani",
        "So'zning sentiment balli, ya'ni ijobiy yoki salbiy ekani"
      ],
      answer: [0, 1],
      explain: "LDA boshqa so'zlar to'g'ri tayinlangan deb faraz qiladi va ikki savolga qaraydi: bu hujjatdagi mavzu ulushlari va bu so'zning boshqa hujjatlardagi mavzusi. Jarayon barqaror holatgacha takrorlanadi.",
      lesson: { title: "LDA — Latent Dirichlet Allocation", href: "03-Latent-Dirichlet-Allocation.md" }
    },
    {
      q: "gensim'da LDA modelini qurish uchun oxirgi qatorga qaysi chaqiruv to'g'ri?",
      code: "from gensim import corpora, models\n\ndictionary = corpora.Dictionary(articles)\ndoc_term_matrix = [dictionary.doc2bow(t) for t in articles]\nlda_model = ...",
      type: "single",
      options: [
        "models.LdaModel(texts=articles, dictionary=dictionary, num_topics=2)",
        "models.LdaModel(corpus=doc_term_matrix, id2word=dictionary, num_topics=2)",
        "models.LdaModel(corpus=articles, id2word=doc_term_matrix, n_components=2)",
        "models.LdaModel(doc_term_matrix, dictionary.doc2bow, k=2)"
      ],
      answer: [1],
      explain: "corpus — hujjat-termin matritsasi (doc2bow natijasi), id2word — lug'at, num_topics — mavzular soni. n_components esa sklearn'dagi LatentDirichletAllocation parametri.",
      lesson: { title: "LDA Python'da", href: "04-LDA-in-Python.md" }
    },
    {
      q: "Yangilik maqolalarida birinchi LDA natijasi mr, said, one kabi so'zlardan iborat bo'ldi. Quyidagi sozlama muammoni qanday hal qiladi?",
      code: "cv2 = CountVectorizer(max_df=0.5, min_df=5)\nX2 = cv2.fit_transform(matn)",
      type: "single",
      options: [
        "Hujjatlarning 50% dan ko'pida va 5 tadan kam hujjatda uchraydigan so'zlarni tashlaydi",
        "Har bir hujjatda 5 martadan kam uchragan so'zlarni va eng uzun so'zlarni tashlaydi",
        "Faqat NLTK to'xtatish so'zlari ro'yxatidagi so'zlarni qo'shimcha o'chiradi",
        "Korpusdagi so'zlarning tasodifiy yarmini va eng qisqa 5 ta so'zni tashlaydi"
      ],
      answer: [0],
      explain: "said va mr NLTK ro'yxatida yo'q, lekin bu korpus uchun to'xtatish so'zi — max_df=0.5 ularni tashlaydi. min_df=5 esa noyob shovqin so'zlarni olib tashlaydi: 8663 dan 1853 ustun qoldi.",
      lesson: { title: "LDA Python'da", href: "04-LDA-in-Python.md" }
    },
    {
      q: "T = lda2.transform(X2) har bir hujjat uchun mavzu ehtimollarini beradi. Bu kod nima chop etadi?",
      code: "import numpy as np\n\nT = np.array([[0.1, 0.9],\n              [0.7, 0.3],\n              [0.2, 0.8]])\nprint(T.argmax(axis=1))",
      type: "single",
      options: ["[0.9 0.7 0.8]", "[1 0 0]", "[1 0 1]", "[0 1 0]"],
      answer: [2],
      explain: "argmax(axis=1) har bir qatorda eng katta ehtimolli mavzu indeksini — ustun (dominant) mavzuni qaytaradi: 0.9 → 1, 0.7 → 0, 0.8 → 1.",
      lesson: { title: "LDA Python'da", href: "04-LDA-in-Python.md" }
    },
    {
      q: "\"doctor\" ham, \"nurse\" ham patient, hospital kabi so'zlar bilan birga uchraydi, shuning uchun LSA ularni o'xshash ma'noli deb biladi. Bu qaysi g'oya?",
      type: "single",
      options: [
        "Taqsimot gipotezasi (distributional hypothesis)",
        "Dirichlet taqsimoti farazi (Dirichlet prior)",
        "TF-IDF'ning teskari hujjat chastotasi (IDF)",
        "Stemming orqali so'zlarning umumiy o'zagini topish"
      ],
      answer: [0],
      explain: "Taqsimot gipotezasiga ko'ra o'xshash ma'noli so'zlar tez-tez birga uchraydi. Algoritm ma'noni bilmaydi — faqat bir xil qo'shnilarni ko'radi.",
      lesson: { title: "LSA — Latent Semantic Analysis", href: "05-Latent-Semantic-Analysis.md" }
    },
    {
      q: "SVD formulasi M = U × Σ × Vᵀ. Qaysi qism \"bu hujjat qaysi mavzuda?\" degan savolga javob beradi?",
      type: "single",
      options: [
        "Σ — har bir mavzuning kuchi",
        "Vᵀ — mavzu × termin matritsasi",
        "M — hujjat × termin matritsasi",
        "U — hujjat × mavzu matritsasi"
      ],
      answer: [3],
      explain: "U — hujjat→mavzu, Σ — mavzu qanchalik muhim, Vᵀ — mavzuda qaysi so'zlar, M esa asl hujjat-termin ma'lumoti.",
      lesson: { title: "LSA — Latent Semantic Analysis", href: "05-Latent-Semantic-Analysis.md" }
    },
    {
      q: "Ikki mavzuli sodda modellarda LSA'ning 1-mavzusi (trump, republican, ryan, cruz) LDA'nikidan (said, mr, state, polic) ancha aniq chiqdi. Asosiy sabab nima?",
      type: "single",
      options: [
        "LSA ko'proq iteratsiya bilan o'qitilgani uchun",
        "LSA TF-IDF ishlatadi, u mr va said ga avtomatik past vazn beradi",
        "LSA stemming o'rniga lemmatizatsiyadan foydalangani uchun",
        "LSA'da mavzular soni avtomatik ravishda to'g'ri tanlangani uchun"
      ],
      answer: [1],
      explain: "sklearn'da LSA = TfidfVectorizer + TruncatedSVD. LDA esa Bag of Words ishlatadi, u yerda mr 1200 marta sanalgan va mavzularni ifloslantirgan.",
      lesson: { title: "LSA Python'da", href: "06-LSA-in-Python.md" }
    },
    {
      q: "LSA komponentidagi vaznlar t. Bu kod qaysi so'zlarni chop etadi?",
      code: "import numpy as np\n\nnames = [\"album\", \"ryan\", \"song\", \"trump\"]\nt = np.array([0.1, 0.5, -0.2, 0.6])\nprint([names[j] for j in t.argsort()[::-1][:2]])",
      type: "single",
      options: [
        "['album', 'ryan']",
        "['song', 'album']",
        "['trump', 'song']",
        "['trump', 'ryan']"
      ],
      answer: [3],
      explain: "argsort o'sish tartibida indekslarni beradi, [::-1] uni teskari qiladi, [:2] eng katta ikkitasini oladi: 0.6 (trump) va 0.5 (ryan). Manfiy vazn (song) esa \"bu so'z mavzuga qarama-qarshi\" degani.",
      lesson: { title: "LSA Python'da", href: "06-LSA-in-Python.md" }
    },
    {
      q: "Tozalashsiz ma'lumotda UMass koherentligi LDA uchun ham, LSA uchun ham k=2 ni eng yaxshi deb ko'rsatdi, lekin mavzular foydasiz edi. Nega?",
      type: "single",
      options: [
        "mr va said deyarli har hujjatda birga uchrab, koherentlikni oshirgan",
        "UMass ballari musbat bo'lgani uchun ularni noto'g'ri talqin qildik",
        "k=2 da model yetarli iteratsiya qilmagani uchun natija tasodifiy chiqdi",
        "Koherentlik faqat LSA uchun ishlaydi, LDA uchun esa noto'g'ri natija beradi"
      ],
      answer: [0],
      explain: "Koherentlik \"so'zlar birga uchraydimi?\" degan savolga javob beradi, \"foydalimi?\" degan savolga emas. Shuning uchun avval max_df/min_df bilan tozalab, keyin o'lchash kerak.",
      lesson: { title: "Nechta mavzu tanlash kerak?", href: "07-How-Many-Topics.md" }
    },
    {
      q: "Koherentlik bo'yicha k=11 ham yaxshi ball oldi, lekin manfaatdor tomonlar 11 ta mavzuni tushunishga qiynaladi. k=5 da esa har bir mavzuga 2-3 so'zda nom berish mumkin. Darsga ko'ra nima qilinadi?",
      type: "single",
      options: [
        "Koherentlik balli eng yuqori bo'lgan k tanlanadi, qolgani ikkinchi darajali",
        "k=11 tanlanadi, chunki mavzular qancha ko'p bo'lsa, tahlil shuncha aniq",
        "k=5 tanlanadi — biznes uchun mantiqiy bo'lsa, optimal bo'lmagan k normal",
        "k ni tanlashdan voz kechib, mavzular sonini model o'zi aniqlashi kutiladi"
      ],
      answer: [2],
      explain: "Matematik eng aniq son har doim biznes uchun eng qimmatli emas. Koherentlik bilan birga intuitsiya va biznes bilimini hisobga olish kerak; oltin qoida — mavzuga nom bera olmasangiz, u mavzu emas.",
      lesson: { title: "Nechta mavzu tanlash kerak?", href: "07-How-Many-Topics.md" }
    }
  ]
};
