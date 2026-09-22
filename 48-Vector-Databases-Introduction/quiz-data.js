window.QUIZ = {
  id: "48",
  title: "Vektor bazalari — kirish",
  subtitle: "Semantik qidiruv, SQL vs NoSQL vs vektor bazasi, embedding normasi, indeks va HNSW",
  next: { label: "Vektor fazosi va yuqori o'lchamli ma'lumot", href: "../49-Vector-Space-Basics/README.md" },
  questions: [
    {
      q: "Foydalanuvchi \"Queen Elizabeth retrospective\" deb qidiradi, maqola nomi esa \"Elizabeth II and the Monarch's Life and Reign\". Nega uni faqat semantik qidiruv topadi?",
      type: "single",
      options: [
        "Chunki semantik qidiruv so'rovdagi har bir so'zni sarlavhada aynan qidiradi",
        "Chunki ma'no bo'yicha solishtiradi va queen bilan monarch yaqin ekanini biladi",
        "Chunki an'anaviy qidiruv inglizcha ismlarni umuman qo'llab-quvvatlamaydi",
        "Chunki maqola sarlavhasi so'rovdan uzunroq, semantik qidiruv esa uzun matnni afzal ko'radi"
      ],
      answer: [1],
      explain: "Semantik qidiruv aniq moslik emas, ma'no bo'yicha ishlaydi: queen ≈ monarch. Aniq moslikda esa bu ibora sarlavhada yo'qligi uchun natija chiqmaydi.",
      lesson: { title: "Vektor bazalari — kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Kod nimani chop etadi?",
      code: "KURSLAR = ['Machine Learning in Python',\n          'Customer Analytics in Python']\ns = 'clustering in Python'\ntopildi = [k for k in KURSLAR if s.lower() in k.lower()]\nprint(len(topildi))",
      type: "single",
      options: [
        "2",
        "1",
        "0",
        "TypeError"
      ],
      answer: [2],
      explain: "Aniq moslikda butun ibora \"clustering in python\" nomlarning birortasida yo'q, shuning uchun 0 natija. Ma'no jihatdan esa ikkala kurs ham mos — semantik qidiruvga aynan shu sabab bilan ehtiyoj bor.",
      lesson: { title: "Vektor bazalari — kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "365 ma'lumotini yuklashda quyidagi qator xato berdi. Darsga ko'ra sabab va yechim qaysi?",
      code: "import pandas as pd\nb = pd.read_csv('course_section_descriptions.csv')",
      type: "single",
      options: [
        "Fayl bo'sh — avval pd.DataFrame() bilan ustunlarni yaratish kerak",
        "Ustunlar nomi noto'g'ri — sep=';' parametrini qo'shish kerak",
        "Faylda \\r belgilari bor — lineterminator='\\r' berish kerak",
        "Fayl UTF-8 emas — UnicodeDecodeError chiqadi, encoding='cp1252' kerak"
      ],
      answer: [3],
      explain: "Fayllar cp1252 kodirovkasida saqlangan, UTF-8 bilan o'qilsa UnicodeDecodeError chiqadi. \\r belgilari esa keyinroq, embeddingdan oldin tozalanadi.",
      lesson: { title: "Vektor bazalari — kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Bu bo'limda Pinecone o'rniga mahalliy Chroma ishlatilishining afzalliklari qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "API kaliti va internet kerak emas",
        "Ma'lumot kompyuterdan chiqmaydi — bank va tibbiy loyihalar uchun muhim",
        "Chroma'da HNSW yo'q, shuning uchun natija doim 100% aniq",
        "Bepul va cheklovsiz ishlatish mumkin",
        "Pinecone tushunchalari boshqacha, ularni o'rganish shart emas"
      ],
      answer: [0, 1, 3],
      explain: "Mahalliy baza API kalitsiz, bepul va ma'lumotni tashqariga chiqarmaydi. Tushunchalar esa bir xil (indeks, o'lcham, metrika, upsert, query, metadata), Chroma ham HNSW ishlatadi.",
      lesson: { title: "Vektor bazalari — kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "all-MiniLM-L6-v2 bilan \"mashinali o'qitish\" so'rovi atigi 0.2150 ball oldi, inglizcha so'rovlar esa 0.65 dan yuqori. Darsdagi yechim qaysi?",
      type: "single",
      options: [
        "O'zbekchani tushunadigan ko'p tilli embedding modeliga o'tish",
        "top_k ni oshirib, ko'proq natija qaytarish va eng yaxshisini tanlash",
        "Ball chegarasini 0.2 gacha tushirib, past ballarni ham qabul qilish",
        "Chroma o'rniga Pinecone indeksidan foydalanib, HNSW'ni sozlash"
      ],
      answer: [0],
      explain: "all-MiniLM-L6-v2 faqat inglizcha, shuning uchun o'zbekcha so'rovlar 0.20–0.38 ball oladi. Yechim — paraphrase-multilingual-MiniLM-L12-v2 kabi ko'p tilli model: muammo modelda, baza yoki chegarada emas.",
      lesson: { title: "Vektor bazalari — kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "Qaysi vazifa uchun darsdagi qaror jadvali vektor bazasini tanlaydi?",
      type: "single",
      options: [
        "Bugungi tranzaksiyalar summasini hisoblash",
        "Sessiya ma'lumotini keshlash",
        "Shu rasmga o'xshash mahsulotlarni topish",
        "ID 42 bo'lgan mijoz balansini olish"
      ],
      answer: [2],
      explain: "\"O'xshash\" yoki \"ma'nosi yaqin\" bo'lsa — vektor. Summa va ID bo'yicha qidiruv SQL'ga, sessiya keshi esa NoSQL'ga (Redis) tegishli.",
      lesson: { title: "SQL, NoSQL va Vektor bazalari", href: "02-Database-Comparison.md" }
    },
    {
      q: "Bank vektor bazasini joriy qilgach, hisoblar va tranzaksiyalar uchun SQL bazasidan voz kechishi mumkin.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Ular raqobatchi emas: SQL — ACID talab qiladigan asosiy ma'lumot, Redis — kesh, vektor bazasi — qidiruv indeksi. Vektor bazasi SQL'ni almashtirmaydi, yangi imkoniyat qo'shadi.",
      lesson: { title: "SQL, NoSQL va Vektor bazalari", href: "02-Database-Comparison.md" }
    },
    {
      q: "Darsga ko'ra vektor bazasining zaif tomonlari qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Qat'iy sxema — har bir yangi maydonda migratsiya kerak",
        "Embedding modeli o'zgarsa, hammasini qayta indekslash kerak",
        "course_id = 37 kabi aniq moslik qidiruvi samarasiz",
        "Metadata saqlab bo'lmaydi, faqat ID va vektor saqlanadi",
        "HNSW/IVF natijasi taxminiy, 100% aniqlik kafolatlanmaydi"
      ],
      answer: [1, 2, 4],
      explain: "Vektor bazasida aniq moslik sekin, yangilanish qimmat, model almashsa qayta indekslash kerak va natija taxminiy. Qat'iy sxema SQL'ning zaif tomoni, metadata esa vektor bazasida bor.",
      lesson: { title: "SQL, NoSQL va Vektor bazalari", href: "02-Database-Comparison.md" }
    },
    {
      q: "1 million vektor, 384 o'lcham, float32 (4 bayt). Faqat vektorlar taxminan qancha xotira egallaydi?",
      type: "single",
      options: [
        "≈ 150 MB",
        "≈ 1.5 GB",
        "≈ 15 GB",
        "≈ 384 MB"
      ],
      answer: [1],
      explain: "1 000 000 × 384 × 4 bayt ≈ 1.5 GB — va bu faqat vektorlar, metadata va indeks alohida. Shuning uchun o'lcham tanlash ham narx qarori.",
      lesson: { title: "SQL, NoSQL va Vektor bazalari", href: "02-Database-Comparison.md" }
    },
    {
      q: "Vektor bazasidagi har bir yozuvda ID va vektor bilan birga metadata ham saqlanadi. Metadata nima uchun kerak?",
      type: "single",
      options: [
        "O'xshashlik ballini hisoblash uchun — vektor faqat ID vazifasini bajaradi",
        "HNSW indeksini metadata'siz qurib bo'lmagani uchun",
        "Natijalarni filtrlash va foydalanuvchiga ko'rsatish uchun",
        "Embedding normasini 1.0 ga keltirish uchun"
      ],
      answer: [2],
      explain: "Uch qism: ID — qaysi yozuv, vektor — o'xshashlik qidiruvi, metadata — filtrlash va natijani ko'rsatish. Tezlik uchun esa ularning ustiga indeks quriladi.",
      lesson: { title: "Vektor bazalarini tushunish", href: "03-Understanding-Vector-Databases.md" }
    },
    {
      q: "model = SentenceTransformer(\"paraphrase-multilingual-MiniLM-L12-v2\") bilan kod ishga tushirildi. Nima chiqadi va undan keyin nima qilish kerak?",
      code: "import numpy as np\nn = np.linalg.norm(model.encode('test'))\nprint('normallashtirilganmi?', abs(n - 1.0) < 0.01)",
      type: "single",
      options: [
        "True — np.dot natijasini to'g'ridan-to'g'ri kosinus sifatida ishlatish mumkin",
        "False — norma ~5.86: np.dot kosinus emas, avval normaga bo'lish kerak",
        "False — model 768 o'lchamli, shuning uchun Chroma'ga yuklab bo'lmaydi",
        "True — lekin faqat inglizcha matnlar uchun, o'zbekchada norma boshqacha"
      ],
      answer: [1],
      explain: "Ko'p tilli modelda norma 5.8556, all-MiniLM-L6-v2 da esa 1.0000. Normallashmagan vektorlarda np.dot ≠ kosinus, shuning uchun avval normaga bo'lish kerak.",
      lesson: { title: "Vektor bazalarini tushunish", href: "03-Understanding-Vector-Databases.md" }
    },
    {
      q: "50 000 ta tasodifiy vektorda HNSW brute force top-10 bilan atigi 3/10 moslik berdi. Dars buni qanday izohlaydi?",
      type: "single",
      options: [
        "Chroma'da hnsw:space noto'g'ri tanlangan, \"l2\" qo'yilsa 10/10 bo'lardi",
        "numpy brute force xato natija bergan, chunki float32 yetarlicha aniq emas",
        "HNSW faqat 1000 vektorgacha ishlaydi, undan keyin tasodifiy natija qaytaradi",
        "Yuqori o'lchamda tasodifiy vektorlar masofasi deyarli teng (o'lchamlar la'nati)"
      ],
      answer: [3],
      explain: "Tasodifiy vektorlarda \"eng yaqin 10 ta\" tushunchasi ma'nosiz bo'lib qoladi. Haqiqiy embeddinglar klasterlangani uchun ularda aniqlik ancha yuqori.",
      lesson: { title: "Vektor bazalarini tushunish", href: "03-Understanding-Vector-Databases.md" }
    },
    {
      q: "Sizda 680 ta bo'lim tavsifi bor, natija 100% aniq bo'lishi kerak va ma'lumot RAMga bemalol sig'adi. Darsdagi amaliy xulosaga ko'ra eng oddiy to'g'ri yechim qaysi?",
      type: "single",
      options: [
        "numpy massivi va E @ q — brute force aniq va shu hajmda yetarlicha tez",
        "Pinecone bulutli indeksi — hajm kichik bo'lsa ham u standart yechim",
        "HNSW indeksli Chroma — u brute force'dan doim 1000× tez va aniqroq",
        "SQL LIKE '%...%' — kichik ma'lumotda u semantik qidiruvga teng"
      ],
      answer: [0],
      explain: "Kichik hajmda (dars bo'yicha 100 000 vektorgacha) numpy brute force yetadi va 100% aniq; 680 qatorda u ~1 ms. HNSW esa taxminiy, 50 000 vektorda ham atigi ~2× tez chiqdi.",
      lesson: { title: "Vektor bazalarini tushunish", href: "03-Understanding-Vector-Databases.md" }
    },
    {
      q: "680 ta embedding 6.0 s, Chroma'da indekslash esa 0.2 s oldi. Tizimni tezlashtirmoqchi bo'lsangiz, qayerdan boshlash kerak?",
      type: "single",
      options: [
        "Indeksdan — HNSW o'rniga Flat indeks qo'yish",
        "Qidiruvdan — top_k ni kamaytirish",
        "Embeddingdan — GPU, batch va kesh ishlatish",
        "Metadata'dan — ortiqcha maydonlarni olib tashlash"
      ],
      answer: [2],
      explain: "Indekslash tez, embedding sekin — shuning uchun optimallashtirish embeddingdan boshlanadi. Flat indeks aksincha qidiruvni sekinlashtiradi.",
      lesson: { title: "Vektor bazalarini tushunish", href: "03-Understanding-Vector-Databases.md" }
    },
    {
      q: "Kod nimani chop etadi?",
      code: "import numpy as np\nballar = np.array([0.2, 0.9, 0.5, 0.7])\ntop = np.argsort(-ballar)[:2]\nprint(top)",
      type: "single",
      options: [
        "[0 2]",
        "[1 3]",
        "[0.9 0.7]",
        "[3 1]"
      ],
      answer: [1],
      explain: "argsort(-ballar) indekslarni ball kamayishi bo'yicha tartiblaydi: 1 (0.9), 3 (0.7), 2, 0. [:2] eng yuqori ikkita indeksni oladi. argsort qiymatlarni emas, indekslarni qaytaradi.",
      lesson: { title: "Vektor bazalarini tushunish", href: "03-Understanding-Vector-Databases.md" }
    }
  ]
};
