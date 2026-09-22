window.QUIZ = {
  id: "50",
  title: "Pinecone bilan tanishuv",
  subtitle: "Vektor bazalarini taqqoslash, indeks yaratish, .env bilan ulanish, upsert va katta ma'lumotni oqimli indekslash",
  next: { label: "Semantik qidiruv — amaliy loyiha", href: "../51-Semantic-Search-Case-Study/README.md" },
  questions: [
    {
      q: "Bankda allaqachon PostgreSQL ishlaydi, mijoz ma'lumoti chet elga chiqmasligi kerak, vektorlar soni 200 mingga yaqin. Darsdagi tanlash qoidasiga ko'ra eng mos yechim qaysi?",
      type: "single",
      options: [
        "Pinecone Serverless — eng tez boshlash va avtomatik miqyoslash",
        "pgvector — yangi baza kerak emas, ma'lumot o'z serverda qoladi",
        "Milvus klaster — millardlab vektor uchun mo'ljallangan tizim",
        "numpy massivi — bu hajmda vektor bazasi umuman ortiqcha"
      ],
      answer: [1],
      explain: "PostgreSQL bor va maxfiylik talab qilinsa pgvector eng amaliy: SQL va vektor bir bazada, ma'lumot o'z serverda. Pinecone'da ma'lumot chet el serveriga chiqadi, numpy esa faqat 1 000 dan kam vektor uchun.",
      lesson: { title: "Vektor bazalarini taqqoslash", href: "01-Vector-Databases-Comparison.md" }
    },
    {
      q: "Pinecone bepul (Starter) tarifi haqida darsda qaysi fikrlar aytilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "5 ta indeks, 1 loyiha va 1 ish maydoniga ruxsat beradi",
        "Faolsizlikdan keyin indeks o'chirilishi mumkin",
        "Cheksiz saqlash hajmi beradi, faqat so'rovlar soni cheklangan",
        "2 GB saqlash chegarasi bor",
        "Indeks faqat mahalliy kompyuterda saqlanadi"
      ],
      answer: [0, 1, 3],
      explain: "Starter tarifi: 5 indeks, 1 loyiha, 1 ish maydoni, 2 GB chegara va faolsizlikdan keyin indeks o'chirilishi mumkin. Shuning uchun asl ma'lumot doim o'zingizda saqlanishi kerak.",
      lesson: { title: "Vektor bazalarini taqqoslash", href: "01-Vector-Databases-Comparison.md" }
    },
    {
      q: "Kod Pinecone'dan Chroma'ga ko'chirildi (kolleksiya hnsw:space = cosine). Pinecone'dagi score bilan bir xil o'xshashlik ballini olish uchun belgilangan joyga nima yozish kerak?",
      code: "r = coll.query(query_embeddings=[[4., 0., 1.]], n_results=5)\nfor i in range(len(r[\"ids\"][0])):\n    ball = ...   # o'xshashlik kerak\n    print(f\"{ball:.4f}  {r['ids'][0][i]}\")",
      type: "single",
      options: [
        "r[\"distances\"][0][i]",
        "-r[\"distances\"][0][i]",
        "1 / r[\"distances\"][0][i]",
        "1 - r[\"distances\"][0][i]"
      ],
      answer: [3],
      explain: "Pinecone o'xshashlik (katta = yaxshi) qaytaradi, Chroma esa masofa (kichik = yaxshi). Cosine fazosida o'xshashlik = 1 - masofa; shunda Mantis uchun 0.9355, Chicken uchun 0.7276 chiqadi.",
      lesson: { title: "Vektor bazalarini taqqoslash", href: "01-Vector-Databases-Comparison.md" }
    },
    {
      q: "Indeks all-MiniLM-L6-v2 modeli uchun yaratilmoqda. Pinecone'da dimension qiymati qanday bo'lishi kerak?",
      type: "single",
      options: [
        "384",
        "768",
        "1536",
        "3072"
      ],
      answer: [0],
      explain: "dimension embedding modeliga mos bo'lishi shart: all-MiniLM-L6-v2 384 o'lchamli. 768 — all-mpnet-base-v2, 1536 — text-embedding-3-small uchun.",
      lesson: { title: "Pinecone'ga ro'yxatdan o'tish va indeks yaratish", href: "02-Pinecone-Registration-and-Index.md" }
    },
    {
      q: "Quyidagi Chroma kodi ishga tushirilganda nima bo'ladi?",
      code: "import chromadb\nclient = chromadb.PersistentClient(path=\"./vdb-demo\")\nclient.create_collection(\"b\")",
      type: "single",
      options: [
        "\"b\" nomli kolleksiya odatdagidek diskda yaratiladi",
        "Kolleksiya yaratiladi, lekin nomi avtomatik \"b00\" ga to'ldiriladi",
        "InvalidArgumentError: nom kamida 3 belgi bo'lishi kerak",
        "DuplicateIDError: bunday nomli kolleksiya allaqachon mavjud"
      ],
      answer: [2],
      explain: "Chroma'da nom 3–512 belgi, faqat [a-zA-Z0-9._-] va boshi hamda oxiri harf yoki raqam bo'lishi kerak. \"b\" juda qisqa, shuning uchun InvalidArgumentError chiqadi.",
      lesson: { title: "Pinecone'ga ro'yxatdan o'tish va indeks yaratish", href: "02-Pinecone-Registration-and-Index.md" }
    },
    {
      q: "Tizimda eski PINECONE_API_KEY o'zgaruvchisi bor, .env faylga esa yangi kalit yozildi. load_dotenv() override=False bilan chaqirilsa nima bo'ladi?",
      type: "single",
      options: [
        ".env dagi yangi kalit ishlatiladi, chunki fayl doim ustun",
        "Tizimdagi eski kalit ishlatiladi, siz esa yangisini kutasiz",
        "Ikki kalit birlashtirilib, KeyError xatosi chiqadi",
        "Kalit umuman yuklanmaydi va qiymat None bo'ladi"
      ],
      answer: [1],
      explain: "override=False standart holat bo'lib, tizim o'zgaruvchisi ustun turadi. Shuning uchun darsda load_dotenv(override=True) ishlatish tavsiya qilinadi.",
      lesson: { title: "Python bilan ulanish", href: "03-Connecting-with-Python.md" }
    },
    {
      q: "Darsda nima uchun os.environ.get(\"PINECONE_API_KEY\") o'rniga os.environ[\"PINECONE_API_KEY\"] yozish tavsiya qilinadi?",
      type: "single",
      options: [
        "get() None qaytarib xatoni yashiradi, [] esa darhol aniq KeyError beradi",
        "get() faqat eski Pinecone SDK bilan ishlaydi, [] esa yangi 3.x versiya bilan",
        "[] kalitni jurnalga yozmaydi, get() esa uni ekranga to'liq chiqaradi",
        "get() .env faylni o'qimaydi, [] esa uni papkadan yuqoriga qarab qidiradi"
      ],
      answer: [0],
      explain: "get() kalit topilmasa None qaytaradi va keyinroq tushunarsiz 401 yoki \"Failed to parse API key\" xatosi chiqadi. os.environ[...] esa darhol aniq KeyError beradi.",
      lesson: { title: "Python bilan ulanish", href: "03-Connecting-with-Python.md" }
    },
    {
      q: "Notebook'dagi \"bor bo'lsa o'chir, keyin yarat\" naqshi ishlab chiqarishda nega xavfli va darsda qaysi xavfsiz almashtirish tavsiya qilinadi?",
      type: "single",
      options: [
        "U metrikani jimgina o'zgartiradi; o'rniga list_collections() ishlatiladi",
        "U API kalitini logga oshkor qiladi; o'rniga .env.example ishlatiladi",
        "U o'lchamni tekshirmaydi; o'rniga describe_index_stats() ishlatiladi",
        "Indeks yo'qolishi mumkin; o'rniga get_or_create_collection() ishlatiladi"
      ],
      answer: [3],
      explain: "Notebook'ni qayta ishga tushirish millionlab vektorli indeksni o'chirib yuborishi mumkin. get_or_create_collection() bor bo'lsa oladi, yo'q bo'lsa yaratadi; tasdiqlash va versiyalash ham xavfsiz variantlar.",
      lesson: { title: "Indeks yaratish va o'chirish (Python)", href: "04-Creating-and-Deleting-Index.md" }
    },
    {
      q: "Indeks all-MiniLM-L6-v2 bilan to'ldirilgan, so'rov esa boshqa 384 o'lchamli model bilan qilindi. Darsga ko'ra nima bo'ladi?",
      type: "single",
      options: [
        "InvalidArgumentError chiqadi, chunki modellar nomi mos emas",
        "Chroma so'rovni avtomatik to'g'ri modelga qayta kodlaydi",
        "Xato chiqmaydi, lekin natijalar ma'nosiz bo'ladi",
        "Natijalar biroz sekinlashadi, lekin aniqlik o'zgarmaydi"
      ],
      answer: [2],
      explain: "O'lcham mos bo'lgani uchun baza xato bermaydi, lekin vektorlar boshqa fazodan bo'lgani uchun natija ma'nosiz. Yechim — model nomini metadata'ga yozib, yuklashda tekshirish.",
      lesson: { title: "Indeks yaratish va o'chirish (Python)", href: "04-Creating-and-Deleting-Index.md" }
    },
    {
      q: "Bu Chroma kodidan keyin nima chop etiladi?",
      code: "coll = client.get_or_create_collection(\"upsert-sinov\")\ncoll.upsert(ids=[\"a\"], embeddings=[[1., 2., 3.]], metadatas=[{\"v\": 1}])\ncoll.upsert(ids=[\"a\"], embeddings=[[4., 5., 6.]], metadatas=[{\"v\": 2}])\nprint(coll.count(), coll.get(ids=[\"a\"])[\"metadatas\"])",
      type: "single",
      options: [
        "2 [{'v': 1}, {'v': 2}]",
        "1 [{'v': 2}]",
        "1 [{'v': 1}]",
        "DuplicateIDError"
      ],
      answer: [1],
      explain: "Alohida chaqiruvlarda ayni ID bilan upsert yozuvni yangilaydi, dublikat yaratmaydi: count() 1, metadata esa oxirgi {'v': 2}. DuplicateIDError faqat bitta chaqiruv ichida ID takrorlansa chiqadi.",
      lesson: { title: "Ma'lumot yozish — upsert", href: "05-Upserting-Data.md" }
    },
    {
      q: "Indekslash skripti har kuni qayta ishga tushiriladi va ID sifatida str(uuid.uuid4()) ishlatiladi. Darsga ko'ra natija qanday bo'ladi?",
      type: "single",
      options: [
        "Har ishga tushirishda yangi ID paydo bo'lib, baza dublikatlarga to'ladi",
        "Upsert eski yozuvlarni matni bo'yicha topib, ularni yangilab qo'yadi",
        "Chroma tasodifiy ID'ni rad etib, har safar DuplicateIDError beradi",
        "Hech narsa o'zgarmaydi, chunki vektorlar bir xil bo'lsa ular birlashtiriladi"
      ],
      answer: [0],
      explain: "Tasodifiy ID har safar yangi, shuning uchun upsert yangilash o'rniga qo'shadi va qayta indekslashda baza ikki baravar oshadi. ID ma'lumotdan chiqishi kerak, masalan course_id-section_id yoki xesh.",
      lesson: { title: "Ma'lumot yozish — upsert", href: "05-Upserting-Data.md" }
    },
    {
      q: "Darsda katta ma'lumotni batch bilan yozishning qaysi sabablari keltirilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "So'rov hajmi chegarasi — Pinecone'da taxminan 2 MB",
        "Xato bo'lsa hammasi emas, faqat bitta batch yo'qoladi",
        "Batch bilan yozilganda vektorlar avtomatik siqiladi",
        "Progress — qancha qolganini ko'rish mumkin"
      ],
      answer: [0, 1, 3],
      explain: "Sabablar: so'rov hajmi chegarasi, xato holatida faqat bitta batch yo'qolishi, progress va xotira. Batch vektorlarni siqmaydi.",
      lesson: { title: "Ma'lumot yozish — upsert", href: "05-Upserting-Data.md" }
    },
    {
      q: "FineWeb'ni load_dataset(..., streaming=True) bilan yuklashning asosiy foydasi nima?",
      type: "single",
      options: [
        "Embedding'lar GPU'siz ham 8 marta tezroq hisoblanadi",
        "Ma'lumot qatorma-qator o'qiladi, to'plam diskka yuklanmaydi",
        "Matnlar avtomatik 256 tokenlik bo'laklarga ajratiladi",
        "Faqat ingliz tilidagi sifatli yozuvlar filtrlab olinadi"
      ],
      answer: [1],
      explain: "streaming=True bo'lmasa sample-10BT (taxminan 45 GB) diskka yuklanadi. streaming bilan yozuvlar qatorma-qator o'qiladi. Tezlanish esa batch embedding'dan keladi.",
      lesson: { title: "Katta ma'lumot to'plami bilan ishlash", href: "06-Large-Dataset-Upserting.md" }
    },
    {
      q: "Kursning FineWeb kodi har bir matnni model.encode(item[\"text\"]) bilan bitta-bitta kodlaydi. Darsda o'lchangan natija qanday?",
      type: "single",
      options: [
        "Bitta-bitta tezroq, chunki xotira kam sarflanadi",
        "Ikkala usul teng tez, faqat natijalar biroz farq qiladi",
        "batch_size=64 taxminan 8 marta tez va natijalar bir xil",
        "batch_size=64 tez, lekin np.allclose False qaytaradi"
      ],
      answer: [2],
      explain: "200 ta qisqa matnda bitta-bitta 0.87 s, batch_size=64 bilan 0.11 s — 8 barobar tez, np.allclose esa True qaytardi, ya'ni natijalar bir xil.",
      lesson: { title: "Katta ma'lumot to'plami bilan ishlash", href: "06-Large-Dataset-Upserting.md" }
    },
    {
      q: "FineWeb maqolalari minglab tokenli, all-MiniLM-L6-v2 esa 256 token chegarasiga ega. Qo'shimcha choralarsiz embedding qilinsa, maqolaning ko'p qismi jimgina tashlanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Model faqat birinchi 256 tokenni (taxminan birinchi 1000 belgi) oladi, qolgani xatosiz tashlanadi. Yechim — RecursiveCharacterTextSplitter bilan bo'laklash.",
      lesson: { title: "Katta ma'lumot to'plami bilan ishlash", href: "06-Large-Dataset-Upserting.md" }
    }
  ]
};
