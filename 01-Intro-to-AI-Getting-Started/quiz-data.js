window.QUIZ = {
  id: "01",
  title: "Intro to AI — Getting Started",
  subtitle: "AI nima: intellekt ta'rifi, qisqacha tarix, AI/ML/DL/DS farqi va narrow AI dan AGI gacha",
  next: { label: "Ma'lumot — AI ning asosiy ingredienti", href: "../02-Data-is-essential-for-building-AI/README.md" },
  questions: [
    {
      q: "Demoda hujjat 200 tokendan oshmaydigan bo'laklarga ajratildi. Buning asosiy sababi nima?",
      type: "single",
      options: [
        "Model har bir savolda butun PDF ni ko'rib, aniqroq javob berishi uchun",
        "Modelga qisqa matn berib, token uchun to'lanadigan narxni kamaytirish uchun",
        "Chroma vektor bazasi uzun matnlarni umuman saqlay olmagani uchun",
        "Streamlit interfeysi uzun javoblarni ekranga chiqara olmagani uchun"
      ],
      answer: [1],
      explain: "LLM lar har bir token uchun pul oladi, shuning uchun Q&A bosqichida modelga imkon qadar qisqa matn beriladi va ilova narxi optimallashadi. Butun PDF ni yuborish aksincha har bir savolni qimmatlashtiradi.",
      lesson: { title: "5 daqiqada AI vositasini yaratish — amaliy demo", href: "01-Building-an-AI-tool-in-5-minutes.md" }
    },
    {
      q: "Siz kompaniya qo'llanmasi bo'yicha savol-javob boti qurmoqdasiz. temperature qiymatini qanday tanlaysiz va nega?",
      type: "single",
      options: [
        "1 — javoblar har safar boshqacha va ijodkorroq bo'lishi uchun",
        "1 — model kontekstdan tashqariga chiqib ko'proq bilim berishi uchun",
        "0 — model tezroq ishlashi va kamroq xotira sarflashi uchun",
        "0 — bir xil savolga barqaror, deterministik javob olish uchun"
      ],
      answer: [3],
      explain: "temperature = 0 deterministik xatti-harakat beradi: bir xil savolga o'xshash javob olinadi, bu faktlar kerak bo'lgan Q&A bot uchun ideal. 1 qiymati ijodiy vazifalar (masalan, she'r) uchun mos.",
      lesson: { title: "5 daqiqada AI vositasini yaratish — amaliy demo", href: "01-Building-an-AI-tool-in-5-minutes.md" }
    },
    {
      q: "Darsdagi solishtirishga ko'ra, o'z PDF hujjatingiz bo'yicha ishlaydigan RAG botning oddiy ChatGPT'dan afzalliklari qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Javobni aynan sizning hujjatingizdagi kontekstga tayanib beradi",
        "PDF yangilansa, yangi ma'lumotni darhol biladi",
        "Internetdagi umumiy bilimni kengroq qamrab oladi",
        "To'qib chiqarish xavfi pastroq, chunki kontekst bilan cheklangan",
        "Javoblari har doim ChatGPT javoblaridan uzunroq bo'ladi"
      ],
      answer: [0, 1, 3],
      explain: "Bot manba sifatida aynan sizning PDF ingizdan foydalanadi, yangilangan hujjatni darrov biladi va kontekst bilan cheklangani uchun kamroq to'qiydi. Demoda bot javobi aksincha qisqaroq bo'lgan, umumiy internet bilimi esa ChatGPT'ning manbasi.",
      lesson: { title: "5 daqiqada AI vositasini yaratish — amaliy demo", href: "01-Building-an-AI-tool-in-5-minutes.md" }
    },
    {
      q: "O'qituvchi nima uchun ma'ruzalarni tashlab ketmaslikni qat'iy tavsiya qiladi?",
      type: "single",
      options: [
        "Har bir ma'ruza oxirida bonus kursga kirish uchun maxsus havola beriladi",
        "Ma'ruzalar ko'rilmasa, yuklab olinadigan resurs va quizlar ochilmaydi",
        "Ular bilimni bosqichma-bosqich chuqurlashtirib, keyingilarga poydevor bo'ladi",
        "Kurs Python'ni oldindan bilishingizni faraz qiladi, takrorlash shart"
      ],
      answer: [2],
      explain: "Ma'ruzalar bilimni bosqichma-bosqich chuqurlashtiradi va boshidan boshlash keyingi murakkab mavzular uchun poydevor yaratadi. Kurs aksincha Python'ni bilmaysiz deb faraz qiladi va noldan o'rgatadi.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "02-What-does-the-course-cover.md" }
    },
    {
      q: "Kir yuvish mashinasi dasturni tanlaydi, suv miqdorini o'lchaydi va \"smart\" deb yozilgan. Oksford ta'rifiga ko'ra u aqllimi?",
      type: "single",
      options: [
        "Yo'q, chunki u qat'iy parametrlar bilan ishlaydi va o'rganmaydi",
        "Ha, chunki u vaziyatga qarab dasturni o'zi mustaqil tanlay oladi",
        "Ha, chunki u murakkab va foydali vazifalarni o'zi bajaradi",
        "Yo'q, chunki u inson bilan tabiiy tilda muloqot qila olmaydi"
      ],
      answer: [0],
      explain: "Intellekt — bilim va ko'nikmalarni egallash hamda qo'llash qobiliyati. Kir yuvish mashinasi dasturni tanlasa ham, hech narsa o'rganmaydi; kuchli yoki foydali bo'lish aqlli degani emas.",
      lesson: { title: "Tabiiy va sun'iy intellekt", href: "03-Natural-vs-Artificial-Intelligence.md" }
    },
    {
      q: "Darsdagi \"Aqllimi yoki yo'q?\" mashqiga ko'ra, quyidagilardan qaysilari aqlli tizim hisoblanadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Ilmiy kalkulyator",
        "Netflix tavsiya tizimi",
        "Ko'p qavatli uydagi lift",
        "Telefondagi Face ID",
        "Avtomobildagi kruiz-kontrol"
      ],
      answer: [1, 3],
      explain: "Netflix ko'rish tarixingizdan o'rganadi, Face ID yuzingizni o'rgangan va vaqt o'tishi bilan moslashadi. Kalkulyator, lift va kruiz-kontrol qat'iy qoidalar bo'yicha ishlaydi va o'rganmaydi.",
      lesson: { title: "Tabiiy va sun'iy intellekt", href: "03-Natural-vs-Artificial-Intelligence.md" }
    },
    {
      q: "Darsga ko'ra, 1950-yilda Alan Turingning asosiy hissasi nimada edi?",
      type: "single",
      options: [
        "Muhokamani falsafiydan amaliy tekislikka ko'chirib, sinab ko'riladigan mezon taklif qildi",
        "\"Mashinalar fikrlay oladimi?\" degan savolni tarixda birinchi bo'lib o'rtaga tashladi",
        "\"Artificial intelligence\" atamasini ilmiy maqolasida birinchi marta ishlatdi",
        "Inson miyasidan ilhomlangan birinchi neyron tarmoqni qurib, sinovdan o'tkazdi"
      ],
      answer: [0],
      explain: "Bu savol Turinggacha ham so'ralgan edi; uning hissasi — cheksiz falsafiy bahs o'rniga aniq, sinab ko'rish mumkin bo'lgan mezon (Turing testi) taklif qilish. \"Artificial intelligence\" atamasi esa 1956-yilda Dartmouth konferensiyasida kiritilgan.",
      lesson: { title: "AI ning qisqacha tarixi", href: "04-Brief-history-of-AI.md" }
    },
    {
      q: "Turing testi aslida nimani tekshiradi?",
      type: "single",
      options: [
        "Mashina haqiqatan ham fikrlayaptimi yoki yo'qmi",
        "Mashina matematik masalalarni insondan tezroq yechadimi",
        "Mashina o'z xatolaridan o'rganib, yaxshilanib boradimi",
        "Mashina so'roqchiga fikrlayotgandek ko'rinadimi"
      ],
      answer: [3],
      explain: "Test mashina fikrlayaptimi deb emas, fikrlayotgandek ko'rinadimi deb so'raydi: so'roqchi uni insondan ishonchli ajrata olmasa, test o'tilgan hisoblanadi. Turing \"fikrlash\" ni kuzatiladigan xatti-harakat bilan ataylab almashtirgan.",
      lesson: { title: "AI ning qisqacha tarixi", href: "04-Brief-history-of-AI.md" }
    },
    {
      q: "Algoritmik g'oyalar 1950-yillardayoq bor edi, lekin AI keskin rivojlanishi ancha keyin boshlandi. Dars bunga qanday izoh beradi?",
      type: "single",
      options: [
        "Deep Blue g'alabasidan keyin hukumatlar AI ga cheksiz mablag' ajrata boshladi",
        "Transformers paydo bo'lguncha neyron tarmoq g'oyasining o'zi mavjud bo'lmagan",
        "Internet ulkan raqamli ma'lumot berdi, hisoblash quvvati ham keskin oshdi",
        "AI Winter davrida qo'lda yozilgan qoidalar bazasi nihoyat yetarli hajmga yetdi"
      ],
      answer: [2],
      explain: "1990-yillar oxiri – 2000-yillarda ikki ingredient — ma'lumot va hisoblash quvvati — joyiga tushdi va bu AI tadqiqotlari uchun burilish nuqtasi bo'ldi. AI Winter aynan shu ikkisi yetishmagani uchun bo'lgan.",
      lesson: { title: "AI ning qisqacha tarixi", href: "04-Brief-history-of-AI.md" }
    },
    {
      q: "To'g'rimi: 2012-yilgi Stanford va Google tizimiga rasmlar \"bu mushuk\" deb belgilab berilgan va u shu belgilar yordamida mushukni tanishni o'rgangan.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Tizimga hech kim \"bu mushuk\" deb aytmagan: u millionlab YouTube kadrlarini ko'rib, mushuk tushunchasini o'zi shakllantirgan. Maqola nomidagi \"large-scale unsupervised learning\" ham shuni bildiradi.",
      lesson: { title: "AI ning qisqacha tarixi", href: "04-Brief-history-of-AI.md" }
    },
    {
      q: "Quyidagi vazifalardan qaysilari ML ishlatmasdan bajariladigan data science ishi hisoblanadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Savdo ma'lumotini grafikda tasvirlab, mavsumiy trendni ko'rsatish",
        "Mijozning keyingi oy ketib qolish ehtimolini bashorat qilish",
        "A/B testi natijasi statistik ahamiyatlimi — tekshirish",
        "Rasmdagi yuzni tanib, u kimga tegishli ekanini aniqlash",
        "O'rtacha chek summasi va uning standart og'ishini hisoblash"
      ],
      answer: [0, 2, 4],
      explain: "Vizualizatsiya, statistical inference va oddiy statistika — ML ga tayanmaydigan, lekin to'liq qiymatli data science ishi. Mijoz ketishini bashorat qilish ML, yuzni tanish esa DL masalasi.",
      lesson: { title: "AI, Data Science, Machine Learning va Deep Learning farqi", href: "05-Demystifying-AI-DS-ML-DL.md" }
    },
    {
      q: "Qaysi fikr AI, ML va DL munosabatini to'g'ri ifodalaydi?",
      type: "single",
      options: [
        "ML — DL ning ichida, chunki DL kengroq intizom",
        "AI — ML ning bir turi, DL esa ulardan alohida soha",
        "DL — ML ning ichida, ML esa AI ning ichida joylashgan",
        "AI, ML va DL — bitta narsaning turli nomlari"
      ],
      answer: [2],
      explain: "AI — keng intizom, ML uning kichik sohasi, DL esa ML ning kichik sohasi. Shuning uchun har bir DL modeli ML modeli, lekin masalan oddiy chiziqli regressiya ML bo'lsa ham DL emas.",
      lesson: { title: "AI, Data Science, Machine Learning va Deep Learning farqi", href: "05-Demystifying-AI-DS-ML-DL.md" }
    },
    {
      q: "Darsda muzqaymoq sotuvi va cho'kish holatlari birga oshishi misoli keltiriladi. Bu misol ML haqida nimani ko'rsatadi?",
      type: "single",
      options: [
        "ML ikki ko'rsatkich birga o'sishini topish bilan cheklanib qoladi",
        "ML ko'p omilni birga hisobga olib, murakkab bog'liqliklarni topadi",
        "ML faqat muzqaymoq kabi mavsumiy mahsulotlar savdosini bashorat qiladi",
        "ML bitta omilni oladi va yashirin sababni (yozni) e'tiborsiz qoldiradi"
      ],
      answer: [1],
      explain: "Oddiy korrelyatsiya faqat \"ikkalasi birga o'sadi\" deydi, yashirin sabab esa yoz. ML harorat, mavsum, hudud kabi yuzlab omilni bir vaqtda hisobga olib, murakkab bog'liqliklarni (intricate dependencies) aniqlaydi.",
      lesson: { title: "AI, Data Science, Machine Learning va Deep Learning farqi", href: "05-Demystifying-AI-DS-ML-DL.md" }
    },
    {
      q: "Shaxmat dasturi jahon chempionini yuta oladi, lekin boshqa hech narsa qila olmaydi. U qaysi pog'onaga kiradi?",
      type: "single",
      options: [
        "Narrow AI — chunki faqat bitta aniq vazifani bajaradi",
        "AGI — chunki o'z vazifasida insondan ustun keladi",
        "Semi-strong AI — chunki juda murakkab o'yinni o'ynay oladi",
        "Hech biriga — chunki kuchli dastur AI hisoblanmaydi"
      ],
      answer: [0],
      explain: "Narrow AI faqat o'zi mo'ljallangan aniq bir vazifani bajaradi, lekin shu vazifada ko'pincha insondan ustun bo'ladi. \"Weak\" so'zi \"tor\" degani, \"kuchsiz\" emas.",
      lesson: { title: "Weak (Narrow) AI va Strong AI (AGI)", href: "06-Weak-vs-Strong-AI.md" }
    },
    {
      q: "Nima uchun ChatGPT hozircha AGI emas, balki semi-strong AI deb ataladi?",
      type: "single",
      options: [
        "U Turing testidan o'ta olmaydi va javoblari insondan ajralib turadi",
        "U faqat matn bilan ishlaydi va rasmlarni o'qiy ham, yarata ham olmaydi",
        "U faqat bitta aniq vazifa uchun mo'ljallangan va boshqasini bajarmaydi",
        "U keng vazifalarni bajaradi, lekin mustaqil ravishda yangi fan yarata olmaydi"
      ],
      answer: [3],
      explain: "ChatGPT keng doiradagi vazifalarni hal qiladi va Turing testidan o'ta oladi, ammo mustaqil maqsad qo'ymaydi va yangi fan yarata olmaydi. Ko'pchilik fikricha, aynan mustaqil fan yaratish AGI ning belgisi.",
      lesson: { title: "Weak (Narrow) AI va Strong AI (AGI)", href: "06-Weak-vs-Strong-AI.md" }
    }
  ]
};
