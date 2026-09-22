window.QUIZ = {
  id: "10",
  title: "Nima uchun Python",
  subtitle: "Dasturlash nima, source code, ikki asosiy ko'nikma va Python ning open source, general purpose, high level xususiyatlari",
  next: { label: "Muhitni sozlash", href: "../11-Setting-Up-the-Environment/README.md" },
  questions: [
    {
      q: "Siz muammoning mukammal yechimini ingliz tilida batafsil yozdingiz. Nega kompyuter uni to'g'ridan-to'g'ri bajara olmaydi?",
      type: "single",
      options: [
        "Chunki kompyuter faqat ingliz tilining rasmiy grammatikasini tushunadi",
        "Chunki yechim juda uzun va kompyuter xotirasiga sig'maydi",
        "Chunki kompyuter faqat nol va birlarni tushunadi, boshqa simvollarni emas",
        "Chunki kompyuter faqat o'zbek tilidagi ko'rsatmalarni qabul qiladi"
      ],
      answer: [2],
      explain: "Kompyuter yorug'lik kaliti kabi faqat ikki holatni — yoqilgan va o'chirilganni, ya'ni 0 va 1 ni taniydi. Shuning uchun source code yozilib, dasturiy ta'minot uni 0 va 1 ga aylantiradi.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "Darsga ko'ra source code nima?",
      type: "single",
      options: [
        "Odam o'qiy oladigan kod; maxsus dastur uni nol va birlarga o'girib beradi",
        "Kompyuter protsessori to'g'ridan-to'g'ri bajaradigan nol va birlar ketma-ketligi",
        "Faqat kompyuter olimlari tushuna oladigan maxfiy mashina buyruqlari to'plami",
        "Dastur ishga tushgandan keyin ekranga chiqadigan yakuniy natija matni"
      ],
      answer: [0],
      explain: "Source code — odam o'qiy oladigan kod. Uni dasturiy ta'minot o'qib, kompyuterga 0 va 1 shaklida yetkazadi; nol va birlarning o'zi source code emas.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "Do'stingiz: \"Dasturlashni o'rganish uchun avval computer science'ni tugatish kerak, ular bir narsa\" deydi. Dars bunga qanday javob beradi?",
      type: "single",
      options: [
        "To'g'ri, chunki dasturlash computer science ning yagona va asosiy predmeti hisoblanadi",
        "Noto'g'ri: CS kompyuter nima qila olishini o'rganadi, dasturlash esa nima qilishni aytadi",
        "To'g'ri, chunki faqat \"geek\" lar va kompyuter olimlari haqiqiy dastur yoza oladi",
        "Noto'g'ri, chunki computer science faqat kompyuter apparatini ta'mirlash bilan shug'ullanadi"
      ],
      answer: [1],
      explain: "Dars bu ikkisini turli narsalar deydi: computer science — kompyuter nima qila olishini tushunish, programming — kompyuterga biz uchun nimadir qilishni aytish. Dasturlash uchun geek yoki olim bo'lish shart emas.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "Darsga ko'ra qaysi til–vazifa juftligi ma'ruzadagi misollarga mos kelmaydi?",
      type: "single",
      options: [
        "C++ — qurilmalarni dasturlash",
        "Python va R — data science va moliya",
        "PHP — veb-dasturlash",
        "PHP — qurilmalarni dasturlash"
      ],
      answer: [3],
      explain: "Ma'ruzada PHP veb-dasturlash uchun yaxshi, lekin qurilmalarni dasturlashga mos emas deyiladi. Qurilmalar uchun C++ misol qilingan.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "Darsga ko'ra dasturlash uchun rivojlantirilishi kerak bo'lgan ikkita asosiy ko'nikma qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Muammoni yechish va abstrakt fikrlash",
        "Mingdan ortiq dasturlash tilini yodlash",
        "Mexanistik fikrlash",
        "Kompyuter apparatini yig'a olish"
      ],
      answer: [0, 2],
      explain: "Birinchi ko'nikma — vazifani kichik qadamlarga bo'lish (muammoni yechish, abstrakt fikrlash), ikkinchisi — toza, tartibli kod yozish uchun mexanistik fikrlash. Tajribali dasturchi ham odatda bir-ikki tilni yaxshi biladi.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "Jon ning boshlig'i so'ragan dastur quyidagicha yozildi. U nimani chop etadi?",
      code: "def qoshish(x):\n    natija = x + 10\n    return natija\n\nprint(qoshish(-3))",
      type: "single",
      options: [
        "-13",
        "7",
        "13",
        "-3"
      ],
      answer: [1],
      explain: "Funksiya x ni argument sifatida olib, x + 10 ni qaytaradi: -3 + 10 = 7.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "Quyidagi ikki versiya bir xil natija beradi. Dars nuqtai nazaridan ikkinchisi nima uchun yaxshiroq?",
      code: "a = 5\nb = a + 10\nprint(b)\n\nboshlangich_son = 5\nnatija = boshlangich_son + 10\nprint(natija)",
      type: "single",
      options: [
        "Ikkinchi versiya kompyuterda ancha tezroq bajariladi",
        "Birinchi versiyada sintaksis xatosi bor va u ishlamaydi",
        "Ikkinchi versiya kamroq operativ xotira egallaydi",
        "Ma'noli nomlar kodni boshqa odamlar uchun o'qishli qiladi"
      ],
      answer: [3],
      explain: "Ikkala versiya ham ishlaydi va 15 ni chop etadi. Lekin amalda yuzlab satr kod boshqalarga yuboriladi, ma'nosiz nomlarga to'la kod esa yomon qabul qilinadi.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "To'g'rimi: darsga ko'ra AI endi kod yoza olgani uchun dasturlash sintaksisini bilish AI bilan ishlashda zarur emas.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Dars aksini aytadi: kuchli dasturlash ko'nikmalari AI xulq-atvorini tushunish, samarali debug qilish va jumboq bo'laklarini bog'lashga yordam beradi, kodni nazorat qilishda esa yakuniy qarorni odamlar qabul qiladi.",
      lesson: { title: "Dasturlash bir necha daqiqada tushuntirildi", href: "01-Programming-explained.md" }
    },
    {
      q: "Darsdagi Python ning texnik ta'rifi qaysi?",
      type: "single",
      options: [
        "Open source, general purpose, high level dasturlash tili",
        "Pullik, domenga xos, low level tizimli dasturlash tili",
        "Open source, domenga xos, low level machine language",
        "Pullik, general purpose, high level dasturlash tili"
      ],
      answer: [0],
      explain: "Python — open source (bepul), general purpose (keng sohalarda qo'llanadi) va high level (inson mantiqiga yaqin sintaksisli) dasturlash tili.",
      lesson: { title: "Nima uchun Python", href: "02-Why-Python.md" }
    },
    {
      q: "Quyidagi xususiyatlardan qaysilari Python ning open source bo'lishi bilan bog'liq? (bir nechta javob)",
      type: "multi",
      options: [
        "Bepul ekani",
        "Django bilan veb-sayt qurish mumkinligi",
        "Katta ilmiy hamjamiyat uni doimiy rivojlantirishi",
        "Windows, Mac va Linux'da ishlashi (cross-platform)",
        "Bajarilishdan oldin past darajali tilga tarjima qilinishi"
      ],
      answer: [0, 2, 3],
      explain: "Open source bepul degani, hamjamiyat manba kodga kirib uni rivojlantiradi va bu cross-platform bo'lishning asosiy sababi. Django — general purpose, tarjima qilinish esa high level xususiyati.",
      lesson: { title: "Nima uchun Python", href: "02-Why-Python.md" }
    },
    {
      q: "Moliya bo'limi MATLAB yoki SAS o'rniga Python ni tanlashni o'ylamoqda. Darsga ko'ra Python ning bu tillarga nisbatan ommaboplikka ta'sir qiluvchi ustunligi nima?",
      type: "single",
      options: [
        "Python faqat moliya va ekonometrika uchun maxsus yaratilgan",
        "Python kompyuterda tarjimasiz, to'g'ridan-to'g'ri bajariladi",
        "MATLAB va SAS pullik, Python esa bepul",
        "MATLAB va SAS faqat Linux'da ishlaydi"
      ],
      answer: [2],
      explain: "Moliyaviy va ekonometrik vazifalar uchun ishlatiladigan MATLAB va SAS kabi domenga xos tillar pullik, Python esa bepul — bu ommaboplikda rol o'ynaydi.",
      lesson: { title: "Nima uchun Python", href: "02-Why-Python.md" }
    },
    {
      q: "High level til haqida qaysi fikr darsga mos keladi?",
      type: "single",
      options: [
        "Kompyuter high level tilni tarjimasiz bajaradi, shuning uchun u ancha tezroq",
        "Avval past darajali tilga tarjima qilinadi, sintaksisi esa inson mantiqiga yaqin",
        "High level tillar juda texnik va faqat tajribali muhandislar uchun mo'ljallangan",
        "High level til — machine language ning boshqacha, zamonaviy nomi"
      ],
      answer: [1],
      explain: "Kompyuterlar faqat past darajali (machine) tillarni ishga tushiradi, shuning uchun high level kod avval tarjima qilinadi. Afzalligi — sintaksis inson mantiqiga yaqin va dasturchi vazifaga e'tibor qaratadi.",
      lesson: { title: "Nima uchun Python", href: "02-Why-Python.md" }
    },
    {
      q: "Quyidagi kod nimani chop etadi?",
      code: "sonlar = [12, 45, 7, 89, 23, 56]\nkattalar = [s for s in sonlar if s > 50]\nprint(kattalar)",
      type: "single",
      options: [
        "[89, 56]",
        "[56, 89]",
        "[12, 45, 7, 23]",
        "2"
      ],
      answer: [0],
      explain: "Ro'yxat ichidagi har bir s tekshiriladi va faqat 50 dan kattalari asl tartibda olinadi: 89, keyin 56. Tartiblash bo'lmagani uchun [56, 89] emas.",
      lesson: { title: "Nima uchun Python", href: "02-Why-Python.md" }
    },
    {
      q: "Quyidagi kod nimani chop etadi?",
      code: "sonlar = [12, 45, 7, 89, 23, 56]\nprint(max(sonlar) - min(sonlar))",
      type: "single",
      options: [
        "77",
        "232",
        "82",
        "44"
      ],
      answer: [2],
      explain: "max(sonlar) 89 ni, min(sonlar) 7 ni qaytaradi: 89 - 7 = 82. 232 esa sum(sonlar) natijasi.",
      lesson: { title: "Nima uchun Python", href: "02-Why-Python.md" }
    },
    {
      q: "Marketing jamoasida millionlab kuzatuvdan iborat mijozlar ma'lumoti bor. Dars nega bunday holatda Excel o'rniga Python ni tavsiya qiladi?",
      type: "single",
      options: [
        "Chunki Excel faqat moliyaviy hisobotlar uchun ishlatilishi mumkin",
        "Chunki Excel faqat Mac kompyuterlarida va bulutda ishlaydi",
        "Chunki Python ma'lumotni avtomatik ravishda strukturalangan jadvalga aylantiradi",
        "Chunki big data uchun Excel kabi an'anaviy vositalar quvvati yetmaydi"
      ],
      answer: [3],
      explain: "Millionlab kuzatuv bo'lganda big data haqida gapiriladi, va bunday vaziyatda Excel kabi an'anaviy ilovalarning hisoblash imkoniyatlari yetmaydi — ancha kuchliroq vosita kerak.",
      lesson: { title: "Nima uchun Python", href: "02-Why-Python.md" }
    }
  ]
};
