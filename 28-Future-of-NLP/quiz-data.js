window.QUIZ = {
  id: "28",
  title: "NLP ning kelajagi",
  subtitle: "Chuqur o'qitish, transformer va LLM'lar, o'zbek tilida NLP va sohaning to'rt yo'nalishi",
  next: { label: "Katta til modellariga kirish", href: "../29-Introduction-to-LLMs/README.md" },
  questions: [
    {
      q: "Neyron tarmoq o'qitilganda aynan nima o'zgaradi va nima maqsad qilinadi?",
      type: "single",
      options: [
        "Qatlamlar soni har epoxada oshiriladi, toki tarmoq \"chuqur\" bo'lsin",
        "Neyronlar orasidagi vaznlar sozlanadi, bashorat va haqiqiy natija farqini kamaytirish uchun",
        "Aktivatsiya funksiyasi olib tashlanadi, toki signal tezroq uzatilsin",
        "Kirish ma'lumoti o'zgartiriladi, toki u chiqish qatlamiga mos kelsin"
      ],
      answer: [1],
      explain: "O'qitish — vaznlarni (bog'lanish kuchlarini) optimallashtirish: model bashorat qiladi, xatoni hisoblaydi, vaznlarni biroz o'zgartiradi va buni ko'p marta takrorlaydi.",
      lesson: { title: "Chuqur o'qitish nima?", href: "01-What-is-Deep-Learning.md" }
    },
    {
      q: "Darsga ko'ra quyidagi moslashtirishlardan qaysilari to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "CNN — fazoviy bog'liqlik tufayli rasm va video uchun kuchli",
        "RNN — teskari aloqa halqalari tufayli til kabi ketma-ket ma'lumot uchun mos",
        "CNN — so'zlar ketma-ket kelgani uchun matn uchun eng mos arxitektura",
        "Transformer — 2017-yildan beri til vazifalarida RNN'ni siqib chiqardi",
        "RNN — hamma so'zni bir vaqtda parallel ko'radi, shuning uchun eng tez"
      ],
      answer: [0, 1, 3],
      explain: "CNN rasm/video uchun, RNN ketma-ket til uchun. Hamma so'zni bir vaqtda parallel ko'rish esa transformerning xususiyati, RNN ketma-ket va sekin ishlaydi.",
      lesson: { title: "Chuqur o'qitish nima?", href: "01-What-is-Deep-Learning.md" }
    },
    {
      q: "Sizda atigi 83 ta yorliqli kitob sharhi bor, GPU yo'q va har bir qarorni tushuntira olish kerak. Qaysi yondashuv mosroq?",
      type: "single",
      options: [
        "Chuqur neyron tarmoq, chunki u xususiyatlarni o'zi topadi",
        "Chuqur neyron tarmoq, chunki u kontekstni saqlaydi va har doim yaxshiroq",
        "An'anaviy ML (masalan, logistik regressiya yoki SVM)",
        "Hech biri — bunday kam ma'lumotda model qurib bo'lmaydi"
      ],
      answer: [2],
      explain: "Kam ma'lumot, GPU yo'qligi va tushuntirish talabi an'anaviy ML foydasiga. 26-modulda 83 ta sharhda oddiy SVM 87% bergan, neyron tarmoq esa u yerda yiqilardi.",
      lesson: { title: "Chuqur o'qitish nima?", href: "01-What-is-Deep-Learning.md" }
    },
    {
      q: "23-modulda pipeline(\"sentiment-analysis\") bilan ishlatgan modelingiz ChatGPT bilan qanday bog'liq?",
      type: "single",
      options: [
        "Hech qanday bog'liqlik yo'q — u qoidaga asoslangan VADER modeli edi",
        "U RNN edi, ChatGPT esa CNN arxitekturasidan foydalanadi",
        "U ChatGPT'ning o'zi edi, faqat bepul versiyasi",
        "Ikkalasi ham transformer; farqi hajmda va bitta vazifaga moslashtirilganida"
      ],
      answer: [3],
      explain: "ChatGPT transformer arxitekturasidan foydalanadi. 23-moduldagi sentiment modeli ham transformer, faqat ancha kichik va bitta vazifaga o'qitilgan.",
      lesson: { title: "NLP uchun chuqur o'qitish", href: "02-Deep-Learning-for-NLP.md" }
    },
    {
      q: "Kompaniya har kuni 1 000 000 ta sharhni tasniflashi va har bir qaror sababini ko'rsatishi kerak. Darsga ko'ra nega bu yerda sklearn modeli LLM'dan afzal bo'lishi mumkin?",
      type: "single",
      options: [
        "sklearn tez va arzon, logistik regressiya esa so'z vaznlari orqali qarorni tushuntiradi",
        "LLM'lar sharhlarni tasniflay olmaydi, faqat matn generatsiya qiladi",
        "sklearn modellari LLM'dan har doim aniqroq natija beradi",
        "LLM'larda shipcha o'rganish muammosi umuman bo'lmaydi"
      ],
      answer: [0],
      explain: "Darsdagi uch sabab: LLM qimmat va sekin (sklearn 10 soniya va bepul), tushuntirib bermaydi (coef_ esa beradi) va uni ham shipchalar uchun tekshirish kerak.",
      lesson: { title: "NLP uchun chuqur o'qitish", href: "02-Deep-Learning-for-NLP.md" }
    },
    {
      q: "Darsdagi fikrga ko'ra, 21–27-modullar LLM'lar paydo bo'lgach eskirdi va endi ularning o'rnini to'liq LLM egallaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Dars xulosasi: 21–27-modullar LLM'ning o'rniga emas, uning fundamenti. Ular LLM nima qilayotganini tushunish va uni tekshirish imkonini beradi.",
      lesson: { title: "NLP uchun chuqur o'qitish", href: "02-Deep-Learning-for-NLP.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "from sklearn.feature_extraction.text import CountVectorizer\ncv = CountVectorizer()\ncv.fit([\"cho'zilgan va yo'q bo'lgan g'alaba\"])\nprint(sorted(cv.get_feature_names_out()))",
      type: "single",
      options: [
        "[\"bo'lgan\", \"cho'zilgan\", \"g'alaba\", 'va', \"yo'q\"]",
        "['bo', 'cho', 'g', 'lgan', 'q', 'va', 'yo', 'zilgan', 'alaba']",
        "['alaba', 'bo', 'cho', 'lgan', 'va', 'yo', 'zilgan']",
        "['bo', 'cho', 'va', 'yo']"
      ],
      answer: [2],
      explain: "Standart tokenizator apostrofni so'z chegarasi deb biladi va kamida 2 belgili tokenlarni oladi, shuning uchun g va q bo'laklari tashlab yuboriladi.",
      lesson: { title: "Ingliz tilidan boshqa tillarda NLP", href: "03-Non-English-NLP.md" }
    },
    {
      q: "O'zbek matnidagi o', g' harfli so'zlar bo'linib ketmasligi uchun vektorlashtirgichni qanday yaratish kerak?",
      type: "single",
      options: [
        "CountVectorizer(stop_words=stopwords.words(\"uzbek\"))",
        "CountVectorizer(lowercase=False)",
        "CountVectorizer(min_df=2)",
        "CountVectorizer(token_pattern=r\"[\\w'ʻ’]+\")"
      ],
      answer: [3],
      explain: "token_pattern ga apostrof belgilarini (', ʻ, ’) qo'shish so'zni butun saqlaydi. To'xtatish so'zlari yoki min_df tokenizatsiya muammosini hal qilmaydi.",
      lesson: { title: "Ingliz tilidan boshqa tillarda NLP", href: "03-Non-English-NLP.md" }
    },
    {
      q: "uz_stopwords = stopwords.words(\"uzbek\") bo'lsa, bu kod nima chiqaradi?",
      code: "matn = \"Bu kitob juda yaxshi va men uni hammaga tavsiya qilaman\"\ntoza = \" \".join(w for w in matn.lower().split() if w not in uz_stopwords)\nprint(toza)",
      type: "single",
      options: [
        "kitob juda yaxshi tavsiya",
        "kitob yaxshi tavsiya qilaman",
        "bu kitob yaxshi men tavsiya qilaman",
        "Xato: NLTK'da uzbek tili yo'q"
      ],
      answer: [1],
      explain: "NLTK'da 288 ta o'zbek to'xtatish so'zi bor: bu, juda, va, men, uni, hammaga olib tashlanadi, ma'noli so'zlar qoladi.",
      lesson: { title: "Ingliz tilidan boshqa tillarda NLP", href: "03-Non-English-NLP.md" }
    },
    {
      q: "Darsga ko'ra quyidagi vazifalardan qaysilari o'zbek tilida mavjud vositalar bilan ishlaydi? (bir nechta javob)",
      type: "multi",
      options: [
        "To'xtatish so'zlarini olib tashlash (NLTK)",
        "spaCy bilan POS teglash va NER",
        "TF-IDF vektorlashtirish (sklearn)",
        "VADER bilan sentiment tahlili",
        "Yorliqli ma'lumotda tasniflagich o'qitish"
      ],
      answer: [0, 2, 4],
      explain: "Ma'lumotdan o'rganadigan hamma narsa ishlaydi: tozalash, vektorlashtirish, mavzular, tasniflagich. Oldindan o'qitilgan model talab qiladigan POS/NER va VADER esa o'zbek tilida yo'q.",
      lesson: { title: "Ingliz tilidan boshqa tillarda NLP", href: "03-Non-English-NLP.md" }
    },
    {
      q: "O'zbek tilining agglyutinativ tabiati Bag of Words uchun qanday muammo tug'diradi?",
      type: "single",
      options: [
        "uyim, uyimda, uylarim, uylarimda alohida ustun bo'lib, lug'at tez kattalashadi",
        "Qo'shimchalar avtomatik o'chirilgani uchun so'z ma'nosi yo'qoladi",
        "Lotin va kirill harflari bir xil ustunga tushib qoladi",
        "Uzun so'zlar CountVectorizer tomonidan umuman qabul qilinmaydi"
      ],
      answer: [0],
      explain: "Bir xil ma'noli so'zning ko'p shakli alohida ustunga aylanadi, shuning uchun min_df muhimroq, ko'proq ma'lumot kerak va stemmer foydali bo'lardi.",
      lesson: { title: "Ingliz tilidan boshqa tillarda NLP", href: "03-Non-English-NLP.md" }
    },
    {
      q: "Bu kod nima chiqaradi va u qaysi muammoni ko'rsatadi?",
      code: "from sklearn.feature_extraction.text import CountVectorizer\ncv = CountVectorizer()\nX = cv.fit_transform([\"The dog bit the man\", \"The man bit the dog\"])\nprint(X.toarray())",
      type: "single",
      options: [
        "[[1 1 1 2] [1 1 1 2]] — ma'nosi teskari jumlalar BOW uchun bir xil, kontekst yo'qoladi",
        "[[1 1 1 2] [2 1 1 1]] — BOW so'z tartibini hisobga oladi",
        "[[1 1 1 1] [1 1 1 1]] — the so'zi to'xtatish so'zi sifatida o'chirilgan",
        "Xato — bir xil so'zli jumlalarni vektorlashtirib bo'lmaydi"
      ],
      answer: [0],
      explain: "Ikkala jumlada so'zlar va sanoqlar bir xil (bit, dog, man, the:2), shuning uchun qatorlar aynan bir xil. Chuqurroq kontekstual tushunish yo'nalishi aynan shu muammoni hal qiladi.",
      lesson: { title: "NLP uchun keyingi nima?", href: "04-Whats-Next-for-NLP.md" }
    },
    {
      q: "Model \"It was hot\" jumlasini cho'l fotosurati bilan birga olib, havo issiq ekanini aniqladi. Bu NLP rivojlanishining qaysi yo'nalishi?",
      type: "single",
      options: [
        "Tezlik va real vaqt",
        "Axloq va shaffoflik",
        "Ko'p modallik",
        "Distillation"
      ],
      answer: [2],
      explain: "Ko'p modallik — matn bilan birga rasm, video va audioni ham ishlatish. Kursda 52–61-modullar (nutqni tanish) aynan audio + matn ko'p modalligiga bag'ishlangan.",
      lesson: { title: "NLP uchun keyingi nima?", href: "04-Whats-Next-for-NLP.md" }
    },
    {
      q: "Modelni tezlashtirish uchun 32-bitli sonlarni 8-bitga o'tkazish qaysi optimallashtirish usuli?",
      type: "single",
      options: [
        "Pruning",
        "Quantization",
        "Caching",
        "Distillation"
      ],
      answer: [1],
      explain: "Quantization sonlar aniqligini kamaytiradi (32-bit → 8-bit, 4× kam xotira). Pruning keraksiz bog'lanishlarni kesadi, distillation'da katta model kichikni o'qitadi.",
      lesson: { title: "NLP uchun keyingi nima?", href: "04-Whats-Next-for-NLP.md" }
    },
    {
      q: "27-moduldagi model 88.9% aniqlik berdi, lekin keyin u tilni emas, Reuters nomini o'rgangani ma'lum bo'ldi. Bu NLP kelajagining qaysi yo'nalishi bilan eng ko'p bog'liq?",
      type: "single",
      options: [
        "Tezlik — model juda sekin ishlagani uchun",
        "Ko'p modallik — rasmlar hisobga olinmagani uchun",
        "Kontekst — model so'z tartibini bilmagani uchun",
        "Axloq va shaffoflik — shipchani faqat modelni tekshirgan odam topa oladi"
      ],
      answer: [3],
      explain: "Bu shortcut learning: shaffoflik va tekshiruv bo'lmasa, yuqori aniqlik aldamchi bo'ladi. Shuning uchun axloqiy ro'yxatda \"shipcha bormi?\" bandi bor.",
      lesson: { title: "NLP uchun keyingi nima?", href: "04-Whats-Next-for-NLP.md" }
    }
  ]
};
