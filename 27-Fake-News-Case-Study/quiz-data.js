window.QUIZ = {
  id: "27",
  title: "Soxta yangiliklarni aniqlash (keys)",
  subtitle: "POS, NER, tozalash, sentiment, LDA/LSA mavzular va tasniflagich — bitta haqiqiy loyihada",
  next: { label: "NLP ning kelajagi", href: "../28-Future-of-NLP/README.md" },
  questions: [
    {
      q: "Ma'lumotni ko'z bilan tekshirganda haqiqiy yangiliklar \"WASHINGTON (Reuters) - ...\" bilan boshlanishi aniqlandi. Nega bu tozalanmasa xavfli?",
      type: "single",
      options: [
        "Prefiks matnni juda uzun qilib, spaCy ishlashini sekinlashtiradi",
        "Model mazmunni emas, \"Reuters bor → haqiqiy\" qoidasini o'rganib oladi",
        "Prefiksdagi katta harflar VADER sentiment ballini buzib yuboradi",
        "Reuters to'xtatish so'zlari ro'yxatida bo'lgani uchun lug'at buziladi"
      ],
      answer: [1],
      explain: "Agentlik prefiksi faqat haqiqiy yangiliklarda bor, shuning uchun model shipchani topadi. Haqiqiy hayotda AP yoki BBC yangiligida Reuters yo'q bo'lsa, model uni soxta deb qo'yadi.",
      lesson: { title: "Loyihani tanishtirish", href: "01-Introducing-the-Project.md" }
    },
    {
      q: "Soxta va haqiqiy yangiliklarni spaCy hujjatlariga aylantirishda darsda qaysi usul tavsiya qilingan?",
      code: "# A\ndocs = [nlp(t) for t in fake_news[\"text\"]]\n\n# B\ndocs = list(nlp.pipe(fake_news[\"text\"]))",
      type: "single",
      options: [
        "A — har bir matnni alohida qayta ishlash aniqroq natija beradi",
        "Ikkalasi ham ishlamaydi, avval matnni tozalash kerak",
        "B — nlp.pipe() matnlarni paketda qayta ishlaydi va ancha tez",
        "B faqat bitta matn uchun ishlaydi, A esa DataFrame uchun"
      ],
      answer: [2],
      explain: "nlp.pipe() matnlarni guruhlab qayta ishlaydi — 198 ta maqolada bu sezilarli tezlik beradi. POS va NER esa tozalashdan oldin qilinishi kerak.",
      lesson: { title: "POS teglar bilan o'rganish", href: "02-Exploring-with-POS-Tags.md" }
    },
    {
      q: "POS teglar va otlarni solishtirish soxta yangiliklar haqida qaysi topilmalarni berdi? (bir nechta javob)",
      type: "multi",
      options: [
        "Soxta yangiliklarda ravishlar (ADV) nisbatan ancha ko'p",
        "Soxta yangiliklarda sonlar (NUM) haqiqiylarga qaraganda ko'proq",
        "Soxta yangiliklarda eng ko'p ot — people, haqiqiylarda — government",
        "Haqiqiy yangiliklar top-10 tokenlarida said bor, soxtalarda yo'q",
        "Ikkala to'plamda POS teglar taqsimoti butunlay boshqacha"
      ],
      answer: [0, 2, 3],
      explain: "ADV/NOUN nisbati soxtada 32.3% yuqori, NUM esa 9.2% past. Teglar taqsimoti o'xshash, lekin so'zlar farq qiladi: people/women/media va government/bill/court.",
      lesson: { title: "POS teglar bilan o'rganish", href: "02-Exploring-with-POS-Tags.md" }
    },
    {
      q: "Top-10 nomlangan ob'ektni solishtirganda soxta va haqiqiy yangiliklar orasida qanday farq topildi?",
      type: "single",
      options: [
        "Soxtada ko'proq joy nomlari (GPE), haqiqiyda ko'proq odamlar",
        "Ikkalasida ham 10 tadan 6 tasi PERSON, farq faqat sanalarda",
        "Haqiqiy yangiliklarda ob'ektlar umuman topilmadi",
        "Soxtada 10 tadan 6 tasi odam, haqiqiyda esa atigi 1 tasi"
      ],
      answer: [3],
      explain: "Soxta yangiliklarda Trump, Clinton, Hillary, Obama, McCain kabi ismlar ustun. Haqiqiy yangiliklarda esa U.S., Reuters, House kabi tashkilot va joylar ko'p, yagona ism — Trump.",
      lesson: { title: "Nomlangan ob'ektlarni ajratish", href: "03-Extracting-Named-Entities.md" }
    },
    {
      q: "Soxta maqolalarning 1/98 tasida, haqiqiylarning 100/100 tasida Reuters bor. Bu kod butun ma'lumotda qanday aniqlik beradi?",
      code: "bashorat = np.where(data[\"text\"].str.contains(\"Reuters\"),\n                    \"Factual News\", \"Fake News\")\nprint(f\"{(bashorat == data['fake_or_factual']).mean():.1%}\")",
      type: "single",
      options: [
        "99.5%",
        "50.5%",
        "100.0%",
        "88.9%"
      ],
      answer: [0],
      explain: "Faqat Reuters'li bitta soxta maqola noto'g'ri tasniflanadi: 197/198 = 99.5%. Bu mashinali o'qitish emas, ma'lumot to'plamidagi nuqson (shortcut learning).",
      lesson: { title: "Nomlangan ob'ektlarni ajratish", href: "03-Extracting-Named-Entities.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "import re\nmatn = \"WASHINGTON (Reuters) - Former FBI Director James Comey\"\nprint(re.sub(r\"^[^-]*-\\s*\", \"\", matn))",
      type: "single",
      options: [
        "WASHINGTON Former FBI Director James Comey",
        "(Reuters) - Former FBI Director James Comey",
        "Former FBI Director James Comey",
        "WASHINGTON (Reuters)"
      ],
      answer: [2],
      explain: "Regex matn boshidan birinchi chiziqchagacha bo'lgan hamma narsani, chiziqcha va undan keyingi bo'shliqlar bilan birga o'chiradi.",
      lesson: { title: "Matnni qayta ishlash", href: "04-Processing-the-Text.md" }
    },
    {
      q: "Bu modulda nega stemming emas, lemmatization tanlandi?",
      type: "single",
      options: [
        "Ma'lumot kichik (198 maqola), shu bois tezlikdan ko'ra ma'no muhim",
        "Stemming ingliz tilida ishlamaydi, faqat lemmatization ishlaydi",
        "Lemmatization Reuters prefiksini ham avtomatik olib tashlaydi",
        "Stemming to'xtatish so'zlarini ham qaytarib qo'shib yuboradi"
      ],
      answer: [0],
      explain: "Qoida: ma'lumot katta bo'lsa — stemming (tez), kichik bo'lsa — lemmatization (aniq, kontekst va ma'noni saqlaydi). 25-modulda katta ma'lumot uchun stemming ishlatilgan edi.",
      lesson: { title: "Matnni qayta ishlash", href: "04-Processing-the-Text.md" }
    },
    {
      q: "Nega VADER sentiment balli text_clean emas, xom text ustunida hisoblandi?",
      type: "single",
      options: [
        "text_clean ro'yxat ko'rinishida bo'lgani uchun VADER uni o'qiy olmaydi",
        "Xom matnda Reuters prefiksi bor va u sentimentni aniqroq qiladi",
        "text_clean'da to'xtatish so'zlari, jumladan not, no, never o'chirilgan",
        "VADER faqat lemmatizatsiya qilinmagan matnda ball hisoblay oladi"
      ],
      answer: [2],
      explain: "Sentiment uchun inkor hal qiluvchi. To'xtatish so'zlari olib tashlangan matnda \"not good\" shunchaki \"good\" bo'lib qoladi.",
      lesson: { title: "Sentiment yangilik turiga qarab farq qiladimi?", href: "05-Sentiment-by-News-Type.md" }
    },
    {
      q: "Soxta va haqiqiy yangiliklar sentimentini t-test bilan solishtirganda p = 0.83 chiqdi. Demak, ikki tur orasida sentiment bo'yicha statistik ahamiyatli farq bor.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Ahamiyat chegarasi p < 0.05. p = 0.83 farq yo'qligini ko'rsatadi: o'rtacha ballar farqi (0.025) standart og'ish (0.79–0.84) ichida ko'milgan. Bu \"natija yo'q\" ham qimmatli natija.",
      lesson: { title: "Sentiment yangilik turiga qarab farq qiladimi?", href: "05-Sentiment-by-News-Type.md" }
    },
    {
      q: "Koherentlik ballari 2, 7 yoki 11 ta mavzuni ko'rsatdi. O'qituvchi 7 ni tanladi. Buning sababi nima edi?",
      type: "single",
      options: [
        "7 ta mavzuda koherentlik eng yuqori, 2 va 11 da esa manfiy chiqqan edi",
        "2 tasi yetarlicha qiziqarli emas, 11 tasini manfaatdorga tushuntirish qiyin",
        "LDA algoritmi kichik ma'lumotda 7 dan ko'p mavzu bilan ishlay olmaydi",
        "Soxta maqolalar soni 98 bo'lgani uchun ularni 7 ga teng bo'lish qulay"
      ],
      answer: [1],
      explain: "Koherentlik faqat taklif qiladi, qarorni inson qabul qiladi. 2 juda kam, 11 juda ko'p bo'lgani uchun 7 tanlandi.",
      lesson: { title: "Soxta yangiliklarda qanday mavzular bor? — LDA", href: "06-Topics-LDA.md" }
    },
    {
      q: "Bag of Words bilan qurilgan LDA mavzularida said 5/7, trump 4/7 mavzuda takrorlandi. Buning asosiy sababi nima?",
      type: "single",
      options: [
        "LDA har mavzuga faqat eng qisqa so'zlarni kiritadi, uzunlarini tashlaydi",
        "Koherentlik noto'g'ri hisoblangani uchun mavzular soni xato tanlangan",
        "Matn tozalanmagani uchun tinish belgilar va raqamlar mavzularga tushgan",
        "Bag of Words ko'p uchraydigan so'zlarga har mavzuda katta og'irlik beradi"
      ],
      answer: [3],
      explain: "LDA Bag of Words ishlatadi: trump ko'p uchragani uchun har mavzuda og'ir bo'lib chiqadi. Keyingi darsdagi yechim — TF-IDF.",
      lesson: { title: "Soxta yangiliklarda qanday mavzular bor? — LDA", href: "06-Topics-LDA.md" }
    },
    {
      q: "7-darsda 6-darsga nisbatan qaysi ikki o'zgarish qilindi? (bir nechta javob)",
      type: "multi",
      options: [
        "Bag of Words o'rniga TF-IDF ishlatildi",
        "Mavzular soni 7 dan 2 ga tushirildi",
        "LDA o'rniga LSA (TruncatedSVD) ishlatildi",
        "Tozalangan matn o'rniga xom text ishlatildi"
      ],
      answer: [0, 2],
      explain: "BoW → TF-IDF va LDA → LSA. Mavzular soni solishtirish uchun yana 7 qoldirildi, matn esa tozalangan text_clean edi.",
      lesson: { title: "Mavzular — 2-qism: TF-IDF va LSA", href: "07-Topics-LSA.md" }
    },
    {
      q: "LSA mavzusi boiler · room · acr · jay · dyer · mediamaniacs chiqdi. Nega bu mavzu LDA'da ko'rinmagan va u qanday amaliy foyda beradi?",
      type: "single",
      options: [
        "TF-IDF noyob so'zlarni ko'tardi; bu konkret manba — uni alohida kuzatish mumkin",
        "LSA tasodifiy so'zlarni tanlaydi; bu mavzu foydasiz shovqin",
        "Bu so'zlar faqat haqiqiy yangiliklarda bor; ularni shipcha sifatida olib tashlash kerak",
        "Bag of Words bu so'zlarni ko'p sanadi; ular Reuters prefiksining qoldig'i"
      ],
      answer: [0],
      explain: "TF-IDF keng tarqalgan so'zlarga past, noyob so'zlarga yuqori vazn beradi. \"Boiler Room\" podkasti — konkret manba, shuning uchun uni platformada alohida kuzatish tavsiya qilindi.",
      lesson: { title: "Mavzular — 2-qism: TF-IDF va LSA", href: "07-Topics-LSA.md" }
    },
    {
      q: "Bitta bo'linishda LR 88.3%, SVM 81.7% berdi; 5-buklamali cross-validation'da esa LR 88.9%, SVM 90.4%. To'g'ri xulosa qaysi?",
      type: "single",
      options: [
        "LR yaxshiroq, chunki u bitta bo'linishda aniq farq bilan g'olib chiqdi",
        "Ikkala natija ham ishonchsiz, chunki 198 ta misol juda kam",
        "SVM yaxshiroq — bitta bo'linishda u omadsiz bo'linishga tushgan",
        "Farq yo'q, chunki ikkalasi ham 80% dan yuqori va bir-biriga yaqin"
      ],
      answer: [2],
      explain: "Bitta bo'linish — bitta o'lchov. Cross-validation 5 marta o'lchaydi va xulosani teskari aylantirdi: SVM aslida yaxshiroq. Modellarni solishtirishda doim CV ishlating.",
      lesson: { title: "Soxta yangiliklarni tasniflagich bilan aniqlash", href: "08-Fake-News-Classifier.md" }
    },
    {
      q: "198 qatorli ma'lumot uchun bu kod nima chiqaradi?",
      code: "X_train, X_test, y_train, y_test = train_test_split(\n    bag_of_words, y, test_size=0.3, random_state=42)\nprint(\"Train:\", X_train.shape[0], \" Test:\", X_test.shape[0])",
      type: "single",
      options: [
        "Train: 139  Test: 59",
        "Train: 138  Test: 60",
        "Train: 60  Test: 138",
        "Train: 148  Test: 50"
      ],
      answer: [1],
      explain: "Sinovga 60 ta misol ketadi, o'qitishga 138 tasi qoladi. 60 ta test misolida har bir xato atigi 1.7% — 26-moduldagi 6 ta misoldan ancha ishonchli.",
      lesson: { title: "Soxta yangiliklarni tasniflagich bilan aniqlash", href: "08-Fake-News-Classifier.md" }
    }
  ]
};
