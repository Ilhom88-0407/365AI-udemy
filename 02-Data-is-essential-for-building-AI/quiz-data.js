window.QUIZ = {
  id: "02",
  title: "02-Modul · Ma'lumot — AI ning asosiy ingredienti",
  subtitle: "Ma'lumot turlari, to'planishi, belgilanishi va metadata bo'yicha bilimingizni sinang",
  next: { label: "03-Modul · AI ning asosiy texnikalari", href: "../03-Key-AI-techniques/README.md" },
  questions: [
    {
      q: "Shifoxona uchta turdagi ma'lumotni saqlaydi. Ulardan qaysi biri strukturalangan (structured) ma'lumot hisoblanadi?",
      type: "single",
      options: [
        "Bemorlarning rentgen suratlari va MRT tasvirlari",
        "Shifokorlarning diktofonga yozgan ovozli izohlari",
        "Qabullar jadvali: sana, shifokor, xona raqami",
        "Bemorlarning erkin matnli shikoyat xatlari"
      ],
      answer: [2],
      explain: "Qabullar jadvalida har bir qiymatning oldindan belgilangan maydoni (ustuni) bor, shuning uchun u strukturalangan. Rasm, audio va erkin matn satr-ustunga tabiiy ravishda joylashmaydi.",
      lesson: { title: "Strukturalangan va strukturalanmagan ma'lumot", href: "01-Structured-vs-unstructured-data.md" }
    },
    {
      q: "Ilgari nima uchun strukturalangan ma'lumot strukturalanmagan ma'lumotdan qimmatliroq hisoblangan?",
      type: "single",
      options: [
        "Uning hajmi dunyodagi ma'lumotning katta qismini tashkil qilgan",
        "Uni tahlil qilish osonroq edi — SQL so'rovining o'zi yetardi",
        "Undan faqat Meta va Google kabi yirik kompaniyalar foydalangan",
        "U AI yordamida osongina insight'larga aylantirilar edi"
      ],
      answer: [1],
      explain: "Darsga ko'ra, strukturalangan ma'lumotni tahlil qilish oson bo'lgani uchun u qimmatliroq sanalgan. Aslida u dunyodagi ma'lumotning atigi ~10–20% ini tashkil qiladi.",
      lesson: { title: "Strukturalangan va strukturalanmagan ma'lumot", href: "01-Structured-vs-unstructured-data.md" }
    },
    {
      q: "Tasdiq: \"Dunyodagi ma'lumotning 80–90% i strukturalangan, ya'ni asosan Excel va SQL jadvallarida saqlanadi.\"",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Aksincha: dunyodagi ma'lumotning 80–90% i strukturalanmagan — matn, rasm, video va audio. Jadvallar aysbergning faqat kichik uchi.",
      lesson: { title: "Strukturalangan va strukturalanmagan ma'lumot", href: "01-Structured-vs-unstructured-data.md" }
    },
    {
      q: "MNIST rasmidagi bitta pikselning qiymati 0 ga teng. Bu piksel qanday rangda?",
      type: "single",
      options: ["Qora", "O'rta kul rang", "To'q kul rang", "Oq"],
      answer: [3],
      explain: "Darsdagi shkalada 0 — oq, 255 — qora. Oradagi qiymatlar kul rangning turli tuslarini bildiradi.",
      lesson: { title: "Ma'lumotni qanday to'playmiz", href: "02-How-we-collect-data.md" }
    },
    {
      q: "Siz va do'stingiz yozgan \"3\" raqamlari tashqi ko'rinishda farq qiladi. Nega kompyuter uchun ular baribir o'xshash?",
      type: "single",
      options: [
        "Ikkalasi ham o'xshash raqamli ketma-ketliklarga aylanadi",
        "Kompyuter rasmni odam kabi yaxlit shakl sifatida ko'radi",
        "MNIST dagi barcha \"3\" lar bir xil qo'l yozuvida yozilgan",
        "Kompyuter faqat rasmning fayl nomiga qarab ajratadi"
      ],
      answer: [0],
      explain: "Har bir piksel son sifatida, so'ng binar shaklda saqlanadi. Turli \"3\" lar o'xshash sonlar ketma-ketligini hosil qiladi va model aynan shu ketma-ketliklarni farqlashga o'rgatiladi.",
      lesson: { title: "Ma'lumotni qanday to'playmiz", href: "02-How-we-collect-data.md" }
    },
    {
      q: "Ob-havo ilovasi haroratni meteo-xizmatning o'zi taqdim etgan rasmiy so'rov interfeysi orqali oladi. Bu qaysi ma'lumot to'plash usuli?",
      type: "single",
      options: ["Web scraping", "Big data analytics", "API", "Qo'lda belgilash (labelling)"],
      answer: [2],
      explain: "API — xizmatning rasmiy so'rov interfeysi. Web scraping esa sahifadan ma'lumotni o'zi \"qirib\" oladi va har doim ham ruxsat etilmagan bo'ladi.",
      lesson: { title: "Ma'lumotni qanday to'playmiz", href: "02-How-we-collect-data.md" }
    },
    {
      q: "\"Garbage in, garbage out\" qoidasiga ko'ra, quyidagi holatlardan qaysilari modelning yomon ishlashiga olib kelishi mumkin? (bir nechta javob)",
      type: "multi",
      options: [
        "Model faqat yorug'da olingan it rasmlari bilan o'rgatilgan",
        "Piksel qiymatlari kompyuterda binar shaklda saqlangan",
        "Datasetda noto'g'ri belgilangan rasmlar bor",
        "Sifatli ma'lumot va oddiy algoritm ishlatilgan",
        "Model faqat bir hududdagi odamlar yuzi bilan o'rgatilgan"
      ],
      answer: [0, 2, 4],
      explain: "Bir tomonlama yoki xato belgilangan ma'lumot modelni ham xato qiladi (bias). Binar saqlash — barcha ma'lumot uchun odatiy holat, zo'r ma'lumot esa oddiy algoritm bilan ham yaxshi model beradi.",
      lesson: { title: "Ma'lumotni qanday to'playmiz", href: "02-How-we-collect-data.md" }
    },
    {
      q: "Bank 1 mln mijozni o'xshash guruhlarga ajratmoqchi, lekin guruhlar qanday bo'lishi oldindan noma'lum. Qaysi turdagi ma'lumot mos keladi?",
      type: "single",
      options: [
        "Labelled — har bir mijozga oldindan guruh nomi berilishi shart",
        "Labelled — faqat \"positive\" va \"negative\" belgilari kerak",
        "Metadata — mijozlar faylining hajmi va sanasi yetarli",
        "Unlabelled — model o'xshashliklarni o'zi topib guruhlaydi"
      ],
      answer: [3],
      explain: "Guruhlar oldindan noma'lum bo'lsa, belgilanmagan ma'lumot beriladi va model o'xshashliklar asosida guruhlarni mustaqil topadi (clustering).",
      lesson: { title: "Belgilangan (labelled) va belgilanmagan (unlabelled) ma'lumot", href: "03-Labelled-and-unlabelled-data.md" }
    },
    {
      q: "Darsdagi oddiy qoidaga asoslangan model \"Yomon emas, aksincha juda yaxshi!\" izohini xato \"negative\" deb baholadi. Bu xatoni qanday qilib aniqlay oldik?",
      type: "single",
      options: [
        "Izohning haqiqiy belgisi (positive) labelled datasetda bor edi",
        "Unlabelled ro'yxatdagi izohlar soni kamroq bo'lgani uchun",
        "Model o'zi xato qilganini avtomatik ravishda xabar qildi",
        "Izohning metadatasida uning muallifi ko'rsatilgan edi"
      ],
      answer: [0],
      explain: "Aniqlikni o'lchash uchun \"to'g'ri javob\" kerak va u faqat labelled datasetda bo'ladi. Unlabelled ro'yxatda model xuddi shu xatoni qilardi, lekin biz buni sezmasdik.",
      lesson: { title: "Belgilangan (labelled) va belgilanmagan (unlabelled) ma'lumot", href: "03-Labelled-and-unlabelled-data.md" }
    },
    {
      q: "Tasdiq: \"10 000 ta belgilanmagan hayvon rasmini ko'rgan model ulardan bir guruhni mustaqil ravishda 'it' deb nomlay oladi.\"",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Model faqat \"bular bir xil turdagi narsalar\" deb guruhlay oladi. Unga hech kim \"it\" so'zini o'rgatmagan, shuning uchun guruhga nom qo'yish baribir odamning ishi.",
      lesson: { title: "Belgilangan (labelled) va belgilanmagan (unlabelled) ma'lumot", href: "03-Labelled-and-unlabelled-data.md" }
    },
    {
      q: "Nega real jamoalar barcha ma'lumotni cheksiz belgilash o'rniga \"oltin o'rta\" ni qidiradi?",
      type: "single",
      options: [
        "Chunki belgilangan ma'lumot ko'paysa, model aniqligi pasayib ketadi",
        "Chunki unlabelled data doim labelled'dan yuqoriroq aniqlik beradi",
        "Chunki ma'lum nuqtadan keyin har bir yangi belgidan foyda kamayadi",
        "Chunki belgilash faqat rasmlar uchun qo'llaniladi, matnga emas"
      ],
      answer: [2],
      explain: "Trade-off egri chizig'i ma'lum nuqtadan keyin yassilashadi (diminishing returns): 100 000-rasmni belgilash 100-rasmchalik foyda bermaydi, xarajat esa o'sib boraveradi.",
      lesson: { title: "Belgilangan (labelled) va belgilanmagan (unlabelled) ma'lumot", href: "03-Labelled-and-unlabelled-data.md" }
    },
    {
      q: "Papkada IMG_0001.jpg, IMG_0002.jpg ... nomli 10 000 ta rasm bor. \"2024-yil yozida olingan rasmlarni\" eng samarali qanday topasiz?",
      type: "single",
      options: [
        "Har bir rasmni ochib, tasvirga qarab faslini aniqlaysiz",
        "Metadatadagi olingan sana maydoni bo'yicha filtrlaysiz",
        "Rasmlarni piksel qiymatlari bo'yicha saralab chiqasiz",
        "Avval barcha rasmlarni \"dog\" / \"not a dog\" deb belgilaysiz"
      ],
      answer: [1],
      explain: "Metadata — ma'lumotni tavsiflovchi ma'lumot. Sana maydoni bo'yicha bitta filtr bilan kerakli rasmlar topiladi, birorta faylni ochish shart emas.",
      lesson: { title: "Metadata — ma'lumotni tavsiflovchi ma'lumot", href: "04-Metadata-Data-that-describes-data.md" }
    },
    {
      q: "Quyidagilardan qaysilari data emas, balki metadata hisoblanadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Qo'shiq ijrochisi va albom nomi",
        "Rasmdagi itning tasviri",
        "Video davomiyligi: 10:24",
        "Kitobning to'liq matni",
        "Rasm hajmi: 2.4 MB"
      ],
      answer: [0, 2, 4],
      explain: "Qoida: mazmunning o'zi — data, mazmun haqidagi ma'lumot — metadata. Ijrochi, davomiylik va fayl hajmi mazmunni tavsiflaydi.",
      lesson: { title: "Metadata — ma'lumotni tavsiflovchi ma'lumot", href: "04-Metadata-Data-that-describes-data.md" }
    },
    {
      q: "Uyda olingan rasmni EXIF metadatasini tozalamasdan ochiq internetga joylashning asosiy xavfi nima?",
      type: "single",
      options: [
        "Rasm sifati avtomatik ravishda siqilib, pasayib ketadi",
        "Rasmning fayl hajmi bir necha barobar oshib ketadi",
        "Rasm strukturalangan ma'lumotga aylanib qoladi",
        "GPS koordinatalari uyingiz joylashuvini oshkor qiladi"
      ],
      answer: [3],
      explain: "EXIF da aniq vaqt, qurilma modeli va GPS koordinatalari bo'lishi mumkin. Ular rasm bilan birga tarqalsa, shaxsiy joylashuvingizni ochib beradi.",
      lesson: { title: "Metadata — ma'lumotni tavsiflovchi ma'lumot", href: "04-Metadata-Data-that-describes-data.md" }
    },
    {
      q: "Darsga ko'ra, AI aynan so'nggi yillarda jadal rivojlanishining asosiy sababi nima?",
      type: "single",
      options: [
        "Algoritmlar endi ma'lumotga umuman muhtoj bo'lmay qoldi",
        "Dunyodagi ma'lumot asosan strukturalangan holga keldi",
        "Hayotning jadal raqamlashuvi ma'lumotni keskin ko'paytirdi",
        "Ma'lumotni qo'lda belgilash arzon va tez bo'lib qoldi"
      ],
      answer: [2],
      explain: "Onlayn do'konlar, telefonlar, kameralar, ijtimoiy tarmoqlar, sensorlar va IoT o'sishi ma'lumot generatsiyasini eksponensial oshirdi, uning sifati ham yaxshilandi.",
      lesson: { title: "Metadata — ma'lumotni tavsiflovchi ma'lumot", href: "04-Metadata-Data-that-describes-data.md" }
    }
  ]
};
