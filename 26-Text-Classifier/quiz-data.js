window.QUIZ = {
  id: "26",
  title: "O'z matn tasniflagichingiz",
  subtitle: "Nazorat ostida o'qitish: logistik regressiya, Naive Bayes, chiziqli SVM va ko'proq ma'lumot saboqi",
  next: { label: "Soxta yangiliklarni aniqlash (keys)", href: "../27-Fake-News-Case-Study/README.md" },
  questions: [
    {
      q: "Kompaniya murojaatlarni \"to'lov muammosi / yetkazib berish / texnik nosozlik\" deb ajratmoqchi. Nega bu yerda tayyor sentiment modeli (masalan VADER) o'rniga o'z tasniflagichingiz kerak?",
      type: "single",
      options: [
        "Tayyor modellar murojaat kabi qisqa matnlarni umuman o'qiy olmaydi",
        "Tayyor model faqat ijobiy/salbiy qo'yadi, bizga o'z toifalarimiz kerak",
        "O'z modeli aniqroq, chunki u kompaniyaning o'z matnlarida o'qiydi",
        "Tayyor modellar nazoratsiz o'qitilgani uchun yorliq qo'ya olmaydi"
      ],
      answer: [1],
      explain: "Darsda eng kuchli sabab sifatida maxsus yorliqlar ko'rsatilgan: tayyor sentiment modeli faqat ijobiy/salbiy qo'yadi, sizga esa o'z toifalaringiz kerak.",
      lesson: { title: "O'z tasniflagichingizni qurish", href: "01-Building-a-Custom-Classifier.md" }
    },
    {
      q: "25-moduldagi mavzu modeli va 26-moduldagi tasniflagichni to'g'ri tavsiflaydigan fikrlar qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Mavzu modeli nazoratsiz, tasniflagich nazorat ostida o'qitiladi",
        "Tasniflagich yorliqlarsiz ma'lumotdan guruhlarni kashf qiladi",
        "Mavzu modeli yorliq topib berishi, tasniflagich esa ularni ishlatishi mumkin",
        "Tasniflagichda fit() modelni o'qitadi, predict() yangi matnga yorliq qo'yadi",
        "Ikkalasi ham faqat oldindan o'qitilgan tayyor model bilan ishlaydi"
      ],
      answer: [0, 2, 3],
      explain: "Mavzu modeli yorliqsiz kashfiyot qiladi, tasniflagich esa yorliqli ma'lumotda o'qib bashorat qiladi; ular ketma-ket ishlashi mumkin. Tayyor model ishlatish 23-modulga xos edi.",
      lesson: { title: "O'z tasniflagichingizni qurish", href: "01-Building-a-Custom-Classifier.md" }
    },
    {
      q: "Ma'lumotda avval 10 ta positive, keyin 10 ta negative jumla ketma-ket turibdi. Quyidagi qator nima uchun kerak?",
      code: "data = data.sample(frac=1, random_state=42)\ndata = data.reset_index(drop=True)",
      type: "single",
      options: [
        "Qatorlarni aralashtiradi, toki test to'plamiga ikkala sinf ham tushsin",
        "Ma'lumotning faqat birinchi yarmini tanlab, qolganini test uchun ajratadi",
        "Takroriy jumlalarni o'chirib, faqat noyob qatorlarni tartib bilan qoldiradi",
        "Har bir sinfdan teng miqdorda misol olib, ma'lumotni muvozanatlaydi"
      ],
      answer: [0],
      explain: "frac=1 hammasini, lekin tasodifiy tartibda tanlaydi. Aralashtirmasangiz, oxirgi 30% test faqat negative jumlalardan iborat bo'lib qolishi mumkin.",
      lesson: { title: "Logistik regressiya", href: "02-Logistic-Regression.md" }
    },
    {
      q: "bag_of_words 20 qatorli DataFrame. Bu kod nima chiqaradi?",
      code: "X_train, X_test, y_train, y_test = train_test_split(\n    bag_of_words, y, test_size=0.3, random_state=42)\nprint(X_train.shape[0], X_test.shape[0])",
      type: "single",
      options: [
        "6 14",
        "15 5",
        "14 6",
        "20 6"
      ],
      answer: [2],
      explain: "test_size=0.3 bo'lsa 20 × 0.3 = 6 ta misol sinovga ketadi, o'qitishga 14 tasi qoladi.",
      lesson: { title: "Logistik regressiya", href: "02-Logistic-Regression.md" }
    },
    {
      q: "Sinov to'plami atigi 6 ta misol. Bu natijalarni baholashda qanday muammo tug'diradi?",
      type: "single",
      options: [
        "accuracy_score kamida 10 ta misol talab qiladi, shuning uchun xato beradi",
        "Har bir javob 16.7% ga teng, shuning uchun aniqlik qo'pol va tasodifiy",
        "6 ta misolda model sinov jumlalarini o'qitishda ham ko'rib qoladi",
        "classification_report kam misolda faqat bitta sinf uchun natija chiqaradi"
      ],
      answer: [1],
      explain: "6 ta misolda har bir to'g'ri javob 1/6 = 16.7%. Aniqlik faqat 0%, 16.7%, 33.3%... kabi qiymatlarni oladi va bitta xato natijani keskin o'zgartiradi.",
      lesson: { title: "Logistik regressiya", href: "02-Logistic-Regression.md" }
    },
    {
      q: "Logistik regressiya o'rgatuvchi to'plamda 1.0, sinovda 0.33 aniqlik berdi (20 ta misol, 118 ta ustun). Bu hodisa qanday ataladi?",
      type: "single",
      options: [
        "Data leakage — test ma'lumoti o'qitishga sizib chiqqan",
        "Underfitting — model juda sodda bo'lgani uchun o'rganmagan",
        "Class imbalance — bir sinf ikkinchisidan ancha ko'p",
        "Overfitting — model o'rganmasdan misollarni yodlab olgan"
      ],
      answer: [3],
      explain: "118 ta vaznni 14 ta misoldan o'rganishda model o'rgatuvchi ma'lumotni yodlab oladi (100%), lekin yangi ma'lumotda yiqiladi — bu overfitting.",
      lesson: { title: "Logistik regressiya", href: "02-Logistic-Regression.md" }
    },
    {
      q: "Bir xil model va bir xil 20 ta jumla, faqat random_state har xil bo'lgan 20 ta bo'linishda aniqlik 0.17 dan 0.83 gacha o'zgardi. Bundan qanday xulosa chiqadi?",
      type: "single",
      options: [
        "random_state=6 eng yaxshisi, uni keyingi tajribalarda ham ishlatish kerak",
        "Logistik regressiya bu vazifa uchun noto'g'ri, Naive Bayes kerak",
        "Natija model sifatini emas, tasodifni ko'rsatadi — ma'lumot juda kam",
        "Modelni ko'proq iteratsiya bilan o'qitib, barqarorlashtirish kerak"
      ],
      answer: [2],
      explain: "Faqat bo'linish o'zgarganda 66 foizlik farq chiqishi — sof tasodif. O'rtacha 48.3% tanga tashlashdan ham past, ya'ni muammo ma'lumot kamligida.",
      lesson: { title: "Logistik regressiya", href: "02-Logistic-Regression.md" }
    },
    {
      q: "Naive Bayes nima uchun \"naive\" (sodda) deb ataladi?",
      type: "single",
      options: [
        "U har bir so'zni boshqalaridan mustaqil deb faraz qiladi",
        "U faqat juda kichik ma'lumot to'plamlarida ishlaydi",
        "U so'zlar tartibini hisobga olib, lekin ma'nosini tushunmaydi",
        "U hech qanday parametrsiz, faqat tasodifiy bashorat qiladi"
      ],
      answer: [0],
      explain: "Model \"not good\" dagi not va good ni alohida ko'radi — so'zlar mustaqil degan faraz noto'g'ri, lekin amalda baribir yaxshi ishlaydi.",
      lesson: { title: "Naive Bayes", href: "03-Naive-Bayes.md" }
    },
    {
      q: "O'rgatuvchi to'plamda 8 ta positive, 6 ta negative; sinovda 4 ta negative, 2 ta positive bor. Bu kod qanday aniqlik chiqaradi?",
      code: "from sklearn.dummy import DummyClassifier\ndummy = DummyClassifier(strategy=\"most_frequent\").fit(X_train, y_train)\nprint(accuracy_score(dummy.predict(X_test), y_test))",
      type: "single",
      options: [
        "0.6666666666666666",
        "0.3333333333333333",
        "0.8333333333333334",
        "0.16666666666666666"
      ],
      answer: [1],
      explain: "Dummy o'rgatuvchida eng ko'p uchragan sinfni — positive ni hamma uchun aytadi. Sinovda faqat 2 ta positive bor, ya'ni 2/6 = 0.333.",
      lesson: { title: "Naive Bayes", href: "03-Naive-Bayes.md" }
    },
    {
      q: "Naive Bayes 0.5 aniqlik berdi, lekin classification_report'da positive uchun precision va recall 0.00 chiqdi. Bu holatdan qaysi saboqlar chiqadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Faqat aniqlikka qaramay, classification_report ni doim o'qish kerak",
        "Model positive sinfni umuman to'g'ri topa olmagan",
        "0.5 aniqlik modelning yaxshi ishlashini isbotlaydi",
        "Natijani DummyClassifier bilan solishtirish kerak",
        "precision 0.00 bo'lsa, recall avtomatik 1.00 bo'ladi"
      ],
      answer: [0, 1, 3],
      explain: "50% aniqlik yaxshi ko'rinsa ham, model bitta sinfni umuman tanimagan. Shuning uchun hisobotni o'qish va dummy model bilan solishtirish kerak.",
      lesson: { title: "Naive Bayes", href: "03-Naive-Bayes.md" }
    },
    {
      q: "Kursda chiziqli SVM qanday yaratiladi?",
      code: "from sklearn.linear_model import SGDClassifier\n\nsvm = SGDClassifier(random_state=0)\nsvm.fit(X_train, y_train)",
      type: "single",
      options: [
        "Bu kod logistik regressiya yaratadi, SVM uchun LinearSVC shart",
        "Bu kod ishlamaydi, chunki SGDClassifier sklearn.svm modulida joylashgan",
        "SVM uchun avval loss='log_loss' ni ko'rsatish kerak",
        "Standart loss='hinge' bilan SGDClassifier aynan chiziqli SVM'ni beradi"
      ],
      answer: [3],
      explain: "SGD — optimallashtirish usuli, algoritm emas. Standart argumentlar (loss='hinge') bilan SGDClassifier chiziqli SVM bo'ladi; LinearSVC ham deyarli bir xil natija beradi.",
      lesson: { title: "Chiziqli SVM — va muammoni HAL QILAMIZ", href: "04-Linear-SVM.md" }
    },
    {
      q: "Uchala algoritm 20 ta jumlada ≈50% berdi. Ma'lumot 83 ta kitob sharhiga ko'paytirilganda algoritm o'zgarmay SVM 0.869 ga chiqdi. Bu qaysi qoidani tasdiqlaydi?",
      type: "single",
      options: [
        "Aqlliroq algoritm ko'proq ma'lumotdan muhimroq",
        "Ko'proq ma'lumot aqlliroq algoritmdan muhimroq",
        "Cross-validation har doim aniqlikni oshiradi",
        "TF-IDF har doim Bag of Words dan yaxshiroq"
      ],
      answer: [1],
      explain: "Bir xil SGDClassifier va bir xil CountVectorizer ishlatildi, faqat ma'lumot ko'paydi — aniqlik 55% dan 87% ga chiqdi. TF-IDF esa bu tajribada BOW dan yomonroq bo'lgan.",
      lesson: { title: "Chiziqli SVM — va muammoni HAL QILAMIZ", href: "04-Linear-SVM.md" }
    },
    {
      q: "Bu kodda ma'lumot sizib chiqishi (data leakage) bormi?",
      code: "t_train, t_test, ya, yb = train_test_split(\n    b[\"clean\"], b[\"lab\"], test_size=0.3, random_state=42)\ncv4 = CountVectorizer()\nXa = cv4.fit_transform(t_train)\nXb = cv4.fit_transform(t_test)",
      type: "single",
      options: [
        "Yo'q, chunki matn vektorlashtirishdan oldin bo'lingan — kod to'g'ri",
        "Ha, test'da ham fit qilingan; cv4.transform(t_test) bo'lishi kerak",
        "Ha, train_test_split vektorlashtirishdan keyin chaqirilishi kerak",
        "Yo'q, lekin lug'atni kichraytirish uchun min_df=2 ishlatish shart"
      ],
      answer: [1],
      explain: "Yangi (test) ma'lumotda faqat transform ishlatiladi. Test'da qayta fit qilish vektorlashtirgichga test so'zlarini ko'rsatadi va ustunlar train bilan mos kelmay qoladi.",
      lesson: { title: "Chiziqli SVM — va muammoni HAL QILAMIZ", href: "04-Linear-SVM.md" }
    },
    {
      q: "Sentiment tasniflagichida CountVectorizer(stop_words='english') qo'shilganda SVM aniqligi 0.869 dan 0.784 ga tushdi. Buning sababi nima?",
      type: "single",
      options: [
        "Ro'yxatda not, no, never ham bor — ular esa sentimentni hal qiladi",
        "stop_words ustunlar sonini oshirib, overfitting'ga olib keladi",
        "stop_words parametri faqat TfidfVectorizer bilan to'g'ri ishlaydi",
        "Kitob sharhlari ingliz tilida emas, shuning uchun ro'yxat mos kelmadi"
      ],
      answer: [0],
      explain: "Ingliz to'xtatish so'zlari ro'yxati not kabi inkor so'zlarini ham o'chiradi, 83 ta sharhda esa not eng kuchli salbiy so'z bo'lib chiqqan edi.",
      lesson: { title: "Chiziqli SVM — va muammoni HAL QILAMIZ", href: "04-Linear-SVM.md" }
    },
    {
      q: "Pipeline (make_pipeline(CountVectorizer(), SGDClassifier())) ishlatilsa, u fit() paytida vektorlashtirgichni faqat train ma'lumotida o'qitadi va sizib chiqishning oldini oladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Darsda aytilganidek, Pipeline sizib chiqishni imkonsiz qiladi: fit() da vektorlashtirgich avtomatik faqat train ma'lumotida o'qitiladi, ayniqsa cross_val_score bilan foydali.",
      lesson: { title: "Chiziqli SVM — va muammoni HAL QILAMIZ", href: "04-Linear-SVM.md" }
    }
  ]
};
