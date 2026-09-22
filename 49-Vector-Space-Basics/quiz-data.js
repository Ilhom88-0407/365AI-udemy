window.QUIZ = {
  id: "49",
  title: "Vektor fazosi va yuqori o'lchamli ma'lumot",
  subtitle: "Vektor amallari, o'lchamlar la'nati, to'rt masofa metrikasi va embedding cheklovlari",
  next: { label: "Pinecone bilan tanishuv", href: "../50-Pinecone-Introduction/README.md" },
  questions: [
    {
      q: "Kod nimani chop etadi?",
      code: "import numpy as np\na = np.array([3., 4.])\nb = np.array([1., 2.])\nprint(a + b, np.linalg.norm(a))",
      type: "single",
      options: [
        "[4. 6.] 7.0",
        "[4. 6.] 5.0",
        "[3. 8.] 5.0",
        "[4. 6.] 25.0"
      ],
      answer: [1],
      explain: "Qo'shish elementma-element: [4. 6.]. Magnituda √(3² + 4²) = 5.0; 7.0 — elementlar yig'indisi, 25.0 esa ildizsiz kvadratlar yig'indisi.",
      lesson: { title: "Vektor fazosiga kirish", href: "01-Introduction-to-Vector-Space.md" }
    },
    {
      q: "Galereya sinovida Mona Lisa bilan eng yuqori kosinus ballini (0.833) qaysi rasm oldi va nega?",
      type: "single",
      options: [
        "Girl with a Pearl Earring — ikkalasi ham ayol portreti bo'lgani uchun",
        "The Starry Night — ikkalasi ham mashhur rassomlar asari bo'lgani uchun",
        "Lady with an Ermine — rassom, davr, uslub va mavzu bir xil bo'lgani uchun",
        "Campbell's Soup Cans — tavsiflar uzunligi bir xil bo'lgani uchun"
      ],
      answer: [2],
      explain: "Lady with an Ermine ham Da Vinchi, Uyg'onish davri, sfumato va ayol portreti — shuning uchun 0.833. Girl with a Pearl Earring faqat mavzu bo'yicha yaqin (0.446), Soup Cans esa eng uzoq (0.325).",
      lesson: { title: "Vektor fazosiga kirish", href: "01-Introduction-to-Vector-Space.md" }
    },
    {
      q: "Tasodifiy normallashgan vektorlarda kosinus ballari std'si 2 o'lchamda 0.7068, 1536 o'lchamda 0.0256 chiqdi. Bundan qanday amaliy xulosa kelib chiqadi?",
      type: "single",
      options: [
        "O'lchamni oshirgan sari qidiruv aniqligi o'z-o'zidan yaxshilanib boradi",
        "Yuqori o'lchamda kosinus o'rniga faqat evklid masofasini ishlatish kerak",
        "1536 o'lchamli modellar 384 o'lchamlilardan doim yomonroq ishlaydi",
        "Masofalar tenglashadi, shuning uchun modelning klasterlashini sinash kerak"
      ],
      answer: [3],
      explain: "O'lchamlar la'nati: yuqori o'lchamda tasodifiy masofalar deyarli teng. Qidiruv ishlashi uchun model vektorlarni klasterlashi kerak — buni o'z ma'lumotingizda mos va nomos juftliklar bilan tekshiring.",
      lesson: { title: "Vektor fazosiga kirish", href: "01-Introduction-to-Vector-Space.md" }
    },
    {
      q: "v = 0.6 * kurs_vektori + 0.4 * bolim_vektori. Ikkala vektor normallashgan va koeffitsientlar yig'indisi 1 bo'lgani uchun v ni qayta normallashtirish shart emas.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Dars har amaldan keyin (o'rtacha, og'irlikli birlashma) qayta normallashtirishni talab qiladi — aks holda dot ≠ kosinus. Shuning uchun kodda v /= np.linalg.norm(v) turibdi.",
      lesson: { title: "Vektor fazosiga kirish", href: "01-Introduction-to-Vector-Space.md" }
    },
    {
      q: "Skalyar ko'paytma bo'yicha eng yuqori ball olgan hayvon qaysi?",
      code: "import numpy as np\nSOROV = np.array([4., 0., 1.])\nH = {'Dog': [4., 0., 1.], 'Chicken': [2., 2., 1.],\n     'Mantis': [6., 2., 3.]}\nball = {k: float(np.dot(SOROV, v)) for k, v in H.items()}\nprint(max(ball, key=ball.get))",
      type: "single",
      options: [
        "Dog",
        "Mantis",
        "Chicken",
        "Dog va Mantis teng"
      ],
      answer: [1],
      explain: "Dog: 16+0+1 = 17, Chicken: 8+0+1 = 9, Mantis: 24+0+3 = 27. So'rovga aynan teng bo'lgan Dog emas, eng uzun vektor Mantis birinchi chiqdi.",
      lesson: { title: "Vektor fazosidagi masofa metrikalari", href: "02-Distance-Metrics.md" }
    },
    {
      q: "Nega skalyar ko'paytma Mantis'ni so'rovning aynan nusxasi bo'lgan Dog'dan yuqori qo'ydi, kosinus esa Dog'ni birinchi qo'ydi?",
      type: "single",
      options: [
        "Skalyar magnitudani ham hisobga oladi, Mantis esa eng uzun vektor (|v| = 7.0)",
        "Skalyar faqat birinchi o'lchamga qaraydi, Mantis'da esa u eng katta (6)",
        "Kosinus manfiy qiymatlarni hisobga olmaydi, skalyar esa ularni ham qo'shadi",
        "Skalyar — masofa, shuning uchun unda kichikroq qiymat yaxshiroq hisoblanadi"
      ],
      answer: [0],
      explain: "Skalyar = yo'nalish × magnituda, shuning uchun uzun vektor yuqori ball oladi. Kosinus esa faqat yo'nalishni o'lchaydi: Dog so'rov bilan bir xil yo'nalishda, ya'ni 1.0000.",
      lesson: { title: "Vektor fazosidagi masofa metrikalari", href: "02-Distance-Metrics.md" }
    },
    {
      q: "Kod nimani chop etadi?",
      code: "import numpy as np\n\ndef kosinus(a, b):\n    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))\n\nA = np.array([1., 1.])\nD = np.array([0.1, 0.1])\nprint(round(float(np.dot(A, D)), 2), round(kosinus(A, D), 4))",
      type: "single",
      options: [
        "2.0 1.0",
        "0.2 0.1",
        "0.02 0.7071",
        "0.2 1.0"
      ],
      answer: [3],
      explain: "Skalyar 0.1 + 0.1 = 0.2, kosinus esa 1.0, chunki D aynan A yo'nalishida (faqat kalta). Kosinus uchun uzunlik ahamiyatsiz, skalyar esa unga bog'liq.",
      lesson: { title: "Vektor fazosidagi masofa metrikalari", href: "02-Distance-Metrics.md" }
    },
    {
      q: "Qaysi vaziyat–metrika juftliklari darsdagi tavsiyaga mos keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Matn embeddinglari — kosinus",
        "Matn embeddinglari — skalyar, chunki uzun matn doim muhimroq",
        "Normallashgan vektorlar — skalyar (kosinusga teng va tezroq)",
        "Fizik masofa (GPS, robot) — evklid",
        "Shahar yo'llari — kosinus"
      ],
      answer: [0, 2, 3],
      explain: "Matn uchun kosinus, normallashgan vektorlarda skalyar ≡ kosinus va tezroq, fizik masofa uchun evklid. Shahar yo'llari uchun esa Manhetten tavsiya etiladi.",
      lesson: { title: "Vektor fazosidagi masofa metrikalari", href: "02-Distance-Metrics.md" }
    },
    {
      q: "Chroma kolleksiyasi metadata={\"hnsw:space\": \"cosine\"} bilan yaratilgan va qidiruv 0.12 ball qaytardi. Buni qanday talqin qilish kerak?",
      type: "single",
      options: [
        "Bu o'xshashlik: 0.12 juda past, ya'ni natija deyarli mos emas",
        "Bu kosinus masofa: kichigi yaxshi, o'xshashlik ≈ 1 − 0.12 = 0.88",
        "Bu l2 masofa: Chroma cosine berilsa ham baribir l2 qaytaradi",
        "Bu skalyar ko'paytma: uni avval vektor normasiga bo'lish kerak"
      ],
      answer: [1],
      explain: "Chroma ballari — masofa, o'xshashlik emas: cosine'da 0 aynan bir xil, 2 teskari. O'xshashlikka o'tkazish: 1 − kosinus_masofa. Metrikani esa keyin o'zgartirib bo'lmaydi — indeksni qayta yaratish kerak.",
      lesson: { title: "Vektor fazosidagi masofa metrikalari", href: "02-Distance-Metrics.md" }
    },
    {
      q: "\"uy sotib olish uchun pul kerak\" so'rovida skalyar, kosinus va evklid — uchalasi ham Debet kartani tanladi, Ipoteka esa eng past kosinus ballini (0.1029) oldi. Darsga ko'ra birinchi navbatda nima qilish kerak?",
      type: "single",
      options: [
        "Metrikani Manhettenga almashtirish — u siyrak vektorlarda ancha barqarorroq",
        "Ball chegarasini 0.5872 dan yuqoriga ko'tarib, zaif natijalarni kesish",
        "Modelni o'zbekcha juftliklarda sinash, tavsifni boyitish, kalit so'z filtri",
        "Normallashtirishni olib tashlab, skalyar ko'paytmaning o'zini ishlatish"
      ],
      answer: [2],
      explain: "Sabab metrikada emas, modelda: u o'zbekcha iborani to'g'ri kodlay olmadi. Metrika tanlovi embedding sifatidan keyin keladi — model ma'noni tushunmasa, hech qanday metrika yordam bermaydi.",
      lesson: { title: "Vektor fazosidagi masofa metrikalari", href: "02-Distance-Metrics.md" }
    },
    {
      q: "\"He plays the lead guitar in a band.\" va \"They found high levels of lead in the drinking water.\" jumlalari atigi 0.1256 kosinus ball oldi. Bu nimani ko'rsatadi?",
      type: "single",
      options: [
        "Jumla embeddingi kontekstni kodlab, lead so'zining ikki ma'nosini ajratdi",
        "Model lead so'zini tanimadi va uni jumladan jimgina olib tashladi",
        "Jumlalar uzunligi va so'zlar soni har xil bo'lgani uchun ball past chiqdi",
        "word2vec kabi model har so'zga bitta vektor bergani uchun ball past chiqdi"
      ],
      answer: [0],
      explain: "Sentence Transformers butun jumlani kodlaydi, shuning uchun bir xil so'z turli kontekstda turli vektor oladi. word2vec'da esa lead doim bir xil vektor bo'lardi.",
      lesson: { title: "Embedding jarayoni", href: "03-Vector-Embeddings-Walkthrough.md" }
    },
    {
      q: "\"This course is good.\" va \"This course is not good.\" 0.7931 ball oldi. Foydalanuvchi \"Python emas\" deb qidirsa, darsga ko'ra qaysi choralar yordam beradi? (bir nechta javob)",
      type: "multi",
      options: [
        "Kalit so'z filtrini qo'shish (gibrid qidiruv)",
        "Kosinus o'rniga evklid masofasiga o'tish",
        "Metadata filtri, masalan course_technology != \"python\"",
        "Cross-encoder bilan qayta tartiblash (reranking)",
        "So'rovni \"Python\" so'zini takrorlab uzaytirish"
      ],
      answer: [0, 2, 3],
      explain: "Embedding inkorni yomon tushunadi, shuning uchun darsdagi yechimlar: kalit so'z filtri, metadata filtri va cross-encoder reranking. Metrikani almashtirish muammoni hal qilmaydi.",
      lesson: { title: "Embedding jarayoni", href: "03-Vector-Embeddings-Walkthrough.md" }
    },
    {
      q: "model = SentenceTransformer(\"all-MiniLM-L6-v2\"). Ikkala qatorda ham 0.4959 chiqdi. Sabab nima?",
      code: "qisqa = 'Machine learning in Python'\nvq = model.encode(qisqa)\nfor n in [50, 2000]:\n    matn = qisqa + ' ' + ('Completely unrelated cooking recipe text. ' * n)\n    print(n, round(float(model.encode(matn) @ vq), 4))",
      type: "single",
      options: [
        "Model uzun matnlarni avtomatik bo'laklab, bo'laklar vektorini o'rtachalaydi",
        "Model faqat dastlabki 256 tokenni ko'radi, qolgani jimgina tashlanadi",
        "Takrorlangan jumla modelga bir marta kiritilgandek hisoblanadi",
        "Ball 0.4959 dan pastga tushmaydi, chunki vektorlar normallashgan"
      ],
      answer: [1],
      explain: "max_seq_length = 256: 531 tokendan keyin ham, 21 000 tokenda ham vektor bir xil, ogohlantirish esa yo'q. Shuning uchun eng muhim matnni oldinga qo'yish kerak.",
      lesson: { title: "Embedding jarayoni", href: "03-Vector-Embeddings-Walkthrough.md" }
    },
    {
      q: "365 bo'limlarini embedding qilishda matn qismlari qaysi tartibda birlashtirilgani ma'qul va nega?",
      type: "single",
      options: [
        "course_description birinchi — u eng uzun va eng ko'p ma'lumot beradigan qism",
        "section_description birinchi, keyin qolganlari — tartib natijaga ta'sir qilmaydi",
        "Ixtiyoriy tartib — model butun matnni baribir o'qiydi, uzunlik muhim emas",
        "section_name, course_name, course_technology, section_description — muhimi oldinda"
      ],
      answer: [3],
      explain: "Uzun course_description oldinda bo'lsa, 256 token chegarasini yeydi va section_description umuman kirmasligi mumkin. Shuning uchun eng muhim ma'lumot oldinga qo'yiladi.",
      lesson: { title: "Embedding jarayoni", href: "03-Vector-Embeddings-Walkthrough.md" }
    },
    {
      q: "all-MiniLM-L6-v2 o'zbekcha loyiha uchun yaxshi tanlov, chunki u 384 o'lchamli va ro'yxatdagi eng tez model.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "U faqat inglizcha: o'zbekcha so'rovlar 0.20–0.38 ball oldi, inglizchada esa 0.65–0.81. O'zbekcha uchun ko'p tilli model (masalan paraphrase-multilingual-MiniLM-L12-v2) va normallashtirish kerak.",
      lesson: { title: "Embedding jarayoni", href: "03-Vector-Embeddings-Walkthrough.md" }
    }
  ]
};
