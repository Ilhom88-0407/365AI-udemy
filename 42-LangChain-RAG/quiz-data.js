window.QUIZ = {
  id: "42",
  title: "LangChain — RAG (Retrieval Augmented Generation)",
  subtitle: "Yuklash, bo'laklash, embedding, Chroma, similarity va MMR qidiruv, retriever, stuffing va himoyalangan javob",
  next: { label: "LangGraph — kirish", href: "../43-LangGraph-Introduction/README.md" },
  questions: [
    {
      q: "Bankning \"depozit foizimiz 18%\" degan yangi faktini modelga o'rgatishning to'g'ri yo'li — fine-tuning, chunki u model og'irliklarini o'zgartiradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Fine-tuning uslub, format va vazifani o'rgatadi, yangi faktlarni emas — model buni eslamaydi va yolg'on to'qiydi. \"Model NIMANI bilsin?\" savoliga javob — RAG.",
      lesson: { title: "Modelga o'z ma'lumotingizni qanday qo'shish mumkin", href: "01-How-to-Integrate-Custom-Data.md" }
    },
    {
      q: "Darsga ko'ra quyidagi savollardan qaysilariga oddiy RAG yaxshi javob bera olmaydi? (bir nechta javob)",
      type: "multi",
      options: [
        "\"2023-yilda jami savdo qancha bo'ldi?\"",
        "\"Muddatli depozit foizi qancha?\"",
        "\"Bu hisobotning asosiy g'oyasi nima?\"",
        "\"Debet karta necha kunda tayyorlanadi?\"",
        "\"Nechta mijoz shikoyat qilgan?\""
      ],
      answer: [0, 2, 4],
      explain: "RAG — \"matndan matn topish\" vositasi: u bo'laklarni topadi, lekin qo'shish, sanash yoki butun hujjatni xulosalashni bilmaydi (bular SQL, kod yoki agent vazifasi). Aniq faktual savollar esa RAG uchun ayni muddao.",
      lesson: { title: "RAG'ga kirish", href: "02-Introduction-to-RAG.md" }
    },
    {
      q: "Normallashtirilmagan ikki vektor uchun bu kod nimani chop etadi?",
      code: "import numpy as np\n\na = np.array([3.0, 4.0])\nb = np.array([6.0, 8.0])\nprint(np.dot(a, b), np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))",
      type: "single",
      options: [
        "1.0 1.0",
        "50.0 0.5",
        "25.0 1.0",
        "50.0 1.0"
      ],
      answer: [3],
      explain: "np.dot = 3·6 + 4·8 = 50, normalar 5 va 10, kosinus = 50 / 50 = 1.0. Norma 1 bo'lmaganda np.dot kosinus emas — shuning uchun mahalliy embedding (norma 5.86) bilan doim normaga bo'lish kerak.",
      lesson: { title: "Hujjat embeddingi", href: "04-Document-Embedding.md" }
    },
    {
      q: "Skanerlangan (rasmdan iborat) PDF ni PyPDFLoader bilan yuklasangiz, u xato beradi va sizni OCR kerakligi haqida ogohlantiradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "PyPDFLoader xato bermaydi — u bo'sh matn qaytaradi va siz buni bilmay qolasiz. Shuning uchun har PDF dan keyin bo'sh yoki juda qisqa sahifalarni tekshirish kerak.",
      lesson: { title: "PyPDFLoader bilan yuklash", href: "06-Loading-PyPDFLoader.md" }
    },
    {
      q: "Bir xil matn 6 sahifalik PDF va DOCX ko'rinishida bor. Docx2txtLoader natijasi PyPDFLoader'nikidan qanday farq qiladi?",
      type: "single",
      options: [
        "DOCX ham 6 ta Document beradi, lekin metadata'da page maydoni bo'lmaydi",
        "DOCX 1 ta katta Document beradi va metadata'da faqat source bo'ladi",
        "DOCX har paragrafni alohida Document qiladi va sarlavhalarni metadata'ga yozadi",
        "DOCX 1 ta Document beradi, lekin metadata PDF'dagidan ham boyroq bo'ladi"
      ],
      answer: [1],
      explain: "PDF'da har sahifa alohida Document va 8+ metadata maydoni bor, DOCX esa butun faylni bitta Document qiladi va faqat source beradi. Shuning uchun DOCX'ni bo'laklash shart, manba uchun esa metadata'ni o'zingiz boyitasiz.",
      lesson: { title: "Docx2txtLoader bilan yuklash", href: "07-Loading-Docx2txtLoader.md" }
    },
    {
      q: "8259 belgili matn CharacterTextSplitter(separator=\".\", chunk_size=500, chunk_overlap=50) bilan 16.5 emas, 21 ta bo'lakka bo'lindi, o'rtacha uzunlik esa 400. Buning sababi nima?",
      type: "single",
      options: [
        "chunk_size tokenlarni sanaydi, belgilarni emas, shuning uchun bo'laklar qisqaroq",
        "Splitter nuqtalarni ham alohida bo'lak deb sanaydi, shuning uchun soni oshadi",
        "chunk_size — maksimum: overlap qadamni 450 ga qisqartiradi, kesish esa nuqtada",
        "Docx2txtLoader matnni oldindan 21 ta sahifaga bo'lgan, splitter ularni saqlaydi"
      ],
      answer: [2],
      explain: "chunk_size maqsad emas, maksimum. Overlap har bo'lakda 50 belgini takrorlaydi, separator=\".\" esa bo'lakni 500 ga yetmasdan nuqtada kesadi. chunk_size belgilarni sanaydi, tokenlarni emas.",
      lesson: { title: "CharacterTextSplitter — kod", href: "09-Character-Text-Splitter-Code.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "from langchain_text_splitters.markdown import MarkdownHeaderTextSplitter\n\nMATN = \"\"\"# Bank\n\n## Depozitlar\nFoiz 18%.\n\n## Kartalar\nKarta 3 kunda.\"\"\"\n\nmd = MarkdownHeaderTextSplitter(\n    headers_to_split_on=[(\"#\", \"Hujjat\"), (\"##\", \"Bolim\")])\nb = md.split_text(MATN)\nprint(len(b), b[0].metadata)",
      type: "single",
      options: [
        "3 {'Hujjat': 'Bank', 'Bolim': 'Depozitlar'}",
        "2 {'Hujjat': 'Bank', 'Bolim': 'Depozitlar'}",
        "2 {'Bolim': 'Depozitlar', 'source': 'Bank'}",
        "1 {'Hujjat': 'Bank', 'Bolim': 'Kartalar'}"
      ],
      answer: [1],
      explain: "Splitter sarlavhalar bo'yicha bo'ladi va ularni metadata'ga yozadi: har bo'lakda ham # (Hujjat), ham ## (Bolim) qiymati bo'ladi. \"# Bank\" ostida matn yo'q, shuning uchun 2 ta bo'lak chiqadi.",
      lesson: { title: "MarkdownHeaderTextSplitter", href: "10-Markdown-Header-Text-Splitter.md" }
    },
    {
      q: "10 000 ta bo'lakni indekslayapsiz, keyin foydalanuvchi savollarini qidirasiz. embed_query va embed_documents ni qanday ishlatish kerak?",
      type: "single",
      options: [
        "Hamma joyda embed_query — u bitta matn uchun eng aniq vektor beradi",
        "Bo'laklar uchun embed_query, savol uchun embed_documents — ular o'zaro almashtiriladi",
        "Faqat embed_documents — savolni ham ro'yxatga o'rab berish kerak",
        "Bo'laklar uchun embed_documents (batch, tez), savol uchun embed_query"
      ],
      answer: [3],
      explain: "embed_documents batch bo'lgani uchun indekslashda ancha tez. Ba'zi modellar (masalan e5) savol va hujjatga turli prefiks qo'shadi, shuning uchun ularni aralashtirmaslik kerak.",
      lesson: { title: "Matn embeddingi — kod", href: "11-Text-Embedding.md" }
    },
    {
      q: "Baza yaratildi, keyin boshqa sessiyada diskdan qayta yuklanmoqda. Ikkinchi qismdagi xato nima?",
      code: "from langchain_chroma import Chroma\n\nvs = Chroma.from_documents(documents=bolaklar, embedding=embedding,\n                           persist_directory=\"./db\")\n\n# ... keyinroq, boshqa sessiyada:\nvs2 = Chroma(persist_directory=\"./db\", embedding=embedding)",
      type: "single",
      options: [
        "Chroma(...) da parametr nomi embedding_function= bo'lishi kerak",
        "Chroma(...) ga documents= ham qayta berilishi shart",
        "persist_directory bilan saqlangan bazani qayta yuklab bo'lmaydi",
        "Chroma ni langchain_community.vectorstores dan import qilish kerak"
      ],
      answer: [0],
      explain: "from_documents da embedding=, Chroma(...) konstruktorida esa embedding_function= ishlatiladi. Yana bir muhim shart: yuklashdagi embedding modeli indekslashdagisi bilan bir xil bo'lishi kerak. langchain_community importi esa eskirgan.",
      lesson: { title: "Chroma vectorstore yaratish", href: "12-Creating-Chroma-Vectorstore.md" }
    },
    {
      q: "Bazada boshida 20 ta hujjat bor. Oxirgi print nimani chiqaradi?",
      code: "from langchain_core.documents import Document\n\nyangi = Document(page_content=\"Test hujjat.\", metadata={\"til\": \"uz\"})\nids = vs.add_documents([yangi])\nprint(len(vs.get()[\"documents\"]))\n\nvs.delete(ids[0])\nprint(len(vs.get()[\"documents\"]), vs.get(ids[0])[\"documents\"])",
      type: "single",
      options: [
        "21 ['Test hujjat.']",
        "20 None",
        "20 []",
        "KeyError — o'chirilgan ID bo'yicha get() xato beradi"
      ],
      answer: [2],
      explain: "add_documents avtomatik UUID ro'yxatini qaytaradi va jami 21 bo'ladi. delete dan keyin jami yana 20, o'chirilgan ID bo'yicha get() esa xato emas, bo'sh ro'yxat qaytaradi.",
      lesson: { title: "Vectorstore'da hujjatlarni boshqarish", href: "13-Managing-Documents.md" }
    },
    {
      q: "Chroma standart sozlamada yaratilgan va bu savol uchun ballar 12.40, 15.29, 15.58 chiqadi. Kod nimani chop etadi?",
      code: "Q = \"What programming languages do data scientists use?\"\ntanlangan = []\nfor d, s in vs.similarity_search_with_score(query=Q, k=3):\n    if s > 0.7:\n        tanlangan.append(d)\nprint(len(tanlangan))",
      type: "single",
      options: [
        "0 — ballar 0..1 oralig'idan tashqarida, shuning uchun hammasi rad etiladi",
        "3 — bu L2 masofa (kichigi yaxshi), hammasi 0.7 chegarasidan katta",
        "1 — faqat eng yaqin hujjat chegaradan o'tadi, qolganlari rad etiladi",
        "ValueError — ball 1 dan katta bo'lishi mumkin emas, tekshiruv to'xtaydi"
      ],
      answer: [1],
      explain: "Chroma standart holda L2 masofani qaytaradi, kosinusni emas: ballar 12–15 va hammasi 0.7 dan katta. Bu jim xato; 0..1 o'xshashlik uchun similarity_search_with_relevance_scores yoki hnsw:space=\"cosine\" kerak.",
      lesson: { title: "Similarity search", href: "14-Similarity-Search.md" }
    },
    {
      q: "max_marginal_relevance_search da lambda_mult qiymatlari haqida darsda o'lchangan natijalarga qaysi tavsif mos?",
      type: "single",
      options: [
        "1.0 — similarity_search bilan bir xil; 0.0 — xilma-xil, hatto aloqasiz",
        "1.0 — faqat xilma-xillik; 0.0 — faqat moslik, dublikatlar ham qaytadi",
        "Qiymat natijaga ta'sir qilmaydi, faqat fetch_k natijalar sonini belgilaydi",
        "0.7 — similarity_search bilan bir xil; 1.0 — birinchi natija ham o'zgaradi"
      ],
      answer: [0],
      explain: "MMR = λ × moslik + (1 − λ) × xilma-xillik. λ=1.0 oddiy similarity bilan bir xil, λ=0.7 da uchinchi natija yangi ma'lumotga almashdi, λ=0.0 da esa kiyim uslublari haqidagi aloqasiz bo'lak chiqdi.",
      lesson: { title: "Maximal Marginal Relevance (MMR)", href: "15-MMR-Search.md" }
    },
    {
      q: "vs.as_retriever(search_type=\"similarity_score_threshold\", search_kwargs={\"k\": 3, \"score_threshold\": 0.3}) mos savolga ham 0 ta hujjat qaytardi va faqat ogohlantirish chiqdi. Sabab va yechim?",
      type: "single",
      options: [
        "k juda kichik — chegaradan o'tadigan hujjat bo'lishi uchun k ni 10 ga oshirish kerak",
        "score_threshold faqat mmr bilan ishlaydi — search_type=\"mmr\" qo'yish kerak",
        "Baza L2 fazoda — collection_metadata={\"hnsw:space\": \"cosine\"} bilan qayta yaratish",
        "Retriever Runnable emas — invoke o'rniga to'g'ridan-to'g'ri similarity_search ga qaytish kerak"
      ],
      answer: [2],
      explain: "score_threshold 0..1 dagi o'xshashlikni kutadi, L2 masofaning aylantirilishi esa noto'g'ri chiqib, hammasi rad etiladi. Bu xato emas, ogohlantirish — zanjirda bo'sh kontekst bo'lib, model hech narsasiz javob to'qiydi.",
      lesson: { title: "Vectorstore-backed retriever", href: "16-Vectorstore-Backed-Retriever.md" }
    },
    {
      q: "{\"context\": retriever, \"question\": RunnablePassthrough()} | pt zanjirida prompt 417 token, format_docs qo'shilganda esa 223 token bo'ldi. Farq nimadan?",
      type: "single",
      options: [
        "Retriever'ni to'g'ridan-to'g'ri ulaganda k avtomatik ikki barobar oshadi",
        "Ro'yxat str() qilinib, promptga Document(id=..., metadata={...}) repr'i ham tushadi",
        "format_docs bo'laklarning yarmini tashlab yuboradi, shuning uchun token kamayadi",
        "RunnablePassthrough savolni ham kontekstga, ham question ga — ikki marta qo'yadi"
      ],
      answer: [1],
      explain: "{context} ga ro'yxat berilsa, UUID, metadata va qavslar ham promptga tushadi — 46.5% token bekorga ketadi va model shovqin ichida ishlaydi. format_docs faqat page_content larni \"\\n\\n\" bilan birlashtiradi.",
      lesson: { title: "Hujjatlarni promptga joylash (stuffing)", href: "17-Stuffing-Documents.md" }
    },
    {
      q: "18-darsdagi sinovlar va xulosalarga ko'ra qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Promptdagi \"use only the following context\" ko'rsatmasi yolg'on to'qishni to'xtatish uchun yetarli emas",
        "RAG umumiy bilim savollarida ham javobni doim RAGsiz variantdan yaxshiroq qiladi",
        "Ball chegarasi — modelga bog'liq bo'lmagan asosiy himoya qavati",
        "seed=365 bir xil javobni kafolatlaydi, shuning uchun temperature ahamiyatsiz",
        "temperature=0 RAG uchun to'g'ri tanlov — javob ijoddan emas, kontekstdan kelishi kerak"
      ],
      answer: [0, 2, 4],
      explain: "Ob-havo savolida model \"qualitative analytics\" deb to'qidi, shuning uchun prompt ko'rsatmasi yetmaydi va ball chegarasi asosiy himoyadir. Umumiy bilim savolida RAGsiz javob yaxshiroq chiqdi, seed esa faqat yordam beradi, kafolat emas.",
      lesson: { title: "Javob generatsiyasi", href: "18-Generating-Response.md" }
    }
  ]
};
