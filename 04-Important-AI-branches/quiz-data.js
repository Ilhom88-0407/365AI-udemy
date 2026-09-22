window.QUIZ = {
  id: "04",
  title: "04-Modul · AI ning muhim tarmoqlari",
  subtitle: "Robototexnika, computer vision, an'anaviy ML va generativ AI — qaysi tarmoq qaysi muammoni yechadi",
  next: { label: "05-Modul · Generativ AI ni tushunish", href: "../05-Understanding-Generative-AI/README.md" },
  questions: [
    {
      q: "Ombor robotining vazifasi — o'zi ombordagi qaysi joyda turganini aniqlash va shu bilan birga omborning xaritasini tuzish. Bu ish robotning qaysi moduliga tegishli?",
      type: "single",
      options: ["Computer vision", "SLAM", "Reinforcement learning", "NLP model"],
      answer: [1],
      explain: "SLAM (Simultaneous Localization and Mapping) navigatsiya va xaritalash uchun javob beradi: \"qayerdaman\" savoli — SLAM. Computer vision esa obyektni aniqlaydi, lekin xarita tuzmaydi.",
      lesson: { title: "Robototexnika", href: "01-Robotics.md" }
    },
    {
      q: "Robot qurishda uch xil mutaxassis qatnashadi. Robotning qaror qabul qilishi va xulq-atvorini kim boshqaradi?",
      type: "single",
      options: [
        "Mexanika muhandislari — harakatlanish mexanizmlari orqali",
        "Elektronika va elektr muhandislari — boshqaruv tizimlari orqali",
        "AI ishlab chiquvchilari va muhandislari",
        "Sensor va kamera ishlab chiqaruvchi zavodlar"
      ],
      answer: [2],
      explain: "Darsga ko'ra qaror qabul qilish va xulq-atvorni AI ishlab chiquvchilari va muhandislari boshqaradi. Mexanika muhandislari jismoniy tuzilmani, elektronika muhandislari esa ishlash va harakatni boshqaruvchi tizimlarni loyihalaydi.",
      lesson: { title: "Robototexnika", href: "01-Robotics.md" }
    },
    {
      q: "Nima uchun avtonom robot uchun hammasini bajaradigan bitta model o'rniga ko'p modelli tizim ko'rib chiqiladi?",
      type: "single",
      options: [
        "Ko'rish, joyni aniqlash, qaror qabul qilish va muloqot — turli vazifalar, har biriga alohida model mos",
        "Bitta katta model robotning elektr tizimini tez ishdan chiqaradi, shuning uchun bo'lish shart",
        "Ko'p model har doim bir-birining javobini ovozga qo'yib, xatolarni avtomatik ravishda tuzatib turadi",
        "Bitta model robot sensorlaridan keladigan xom ma'lumotni texnik jihatdan umuman qabul qila olmaydi"
      ],
      answer: [0],
      explain: "CV, SLAM, RL va NLP modellarini birlashtirish robotga atrofni idrok etish, qaror qabul qilish, odamlar bilan muloqot qilish va mos harakat qilish imkonini beradi. Bu butun AI muhandisligining asosiy tamoyili.",
      lesson: { title: "Robototexnika", href: "01-Robotics.md" }
    },
    {
      q: "Robot g'oyasi yangi emasligini ko'rsatuvchi tarixiy misollardan qaysi biri \"dasturlanadigan\" mashinalar bilan bog'liq?",
      type: "single",
      options: [
        "Hefest qurgan bronza gigant Talos",
        "Leonardo da Vinchining mexanik ritsari",
        "Leonardo da Vinchining mexanik sheri",
        "O'rta asrlardagi al-Jazariy avtomatlari"
      ],
      answer: [3],
      explain: "Al-Jazariy avtomatlari qatorida suv soatlari va dasturlanadigan mashinalar bo'lgan — kompyuterdan ancha oldin. Talos Kritni qo'riqlagan mifik bronza odam, da Vinchi esa mexanik ritsar va sher chizmalarini yaratgan.",
      lesson: { title: "Robototexnika", href: "01-Robotics.md" }
    },
    {
      q: "Dastlabki davrlarda oddiy neyron tarmoqlar tasvirlar bilan nima uchun qiynalgan va CNN aynan shuni yechgan?",
      type: "single",
      options: [
        "Tasvirlar labelled bo'lmagani uchun ularni umuman o'rgatib bo'lmasdi",
        "Neyron tarmoqlar o'sha paytda faqat matnli ma'lumot qabul qila olardi",
        "Har bir piksel har bir tugunga bog'lanib, parametrlar juda ko'payardi",
        "Rangli rasmlarni sonlarga aylantirishning hech qanday usuli yo'q edi"
      ],
      answer: [2],
      explain: "Yuqori o'lchamli tasvirlar juda katta miqdordagi parametr talab qilardi (Full HD va 1000 tugun — taxminan 2 milliard weight). CNN esa bitta kichik kernelni butun rasm bo'ylab qayta ishlatib, parametrlarni keskin kamaytiradi.",
      lesson: { title: "Computer Vision", href: "02-Computer-vision.md" }
    },
    {
      q: "CNN ning qatlamli tuzilmasi belgilarni qanday tartibda o'rganadi?",
      type: "single",
      options: [
        "Dastlabki qatlamlar shakl va obyektlarni, chuqur qatlamlar chekkalarni",
        "Dastlabki qatlamlar chekkalarni, chuqurroq qatlamlar shakl va obyektlarni",
        "Barcha qatlamlar bir vaqtda bir xil belgilarni parallel o'rganadi",
        "Dastlabki qatlamlar ranglarni, chuqur qatlamlar piksellar sonini"
      ],
      answer: [1],
      explain: "CNN oddiydan murakkabga boradi: dastlabki qatlamlarda chekkalar kabi asosiy belgilar, chuqurroq qatlamlarda shakllar va obyektlar kabi yuqori darajadagi belgilar o'rganiladi.",
      lesson: { title: "Computer Vision", href: "02-Computer-vision.md" }
    },
    {
      q: "Spatial hierarchy qoidalariga ko'ra rasmdagi qaysi elementlar yaqinroq yoki muhimroq ko'rinadi? (Bir nechta to'g'ri javob)",
      type: "multi",
      options: [
        "Kattaroq obyektlar",
        "Rasm chetidagi xira va kichik obyektlar",
        "Ustma-ust tushganda oldinda turgan obyekt",
        "Markazda yoki yuqorida joylashgan elementlar",
        "Fonga eng yaqin joylashgan obyektlar"
      ],
      answer: [0, 2, 3],
      explain: "Darsda uchta qoida keltirilgan: kattaroq obyektlar yaqinroq, ustma-ust tushganda oldingisi yaqinroq, markaz yoki yuqoridagi elementlar ko'proq diqqat tortadi. Fon — aksincha, eng uzoq plan.",
      lesson: { title: "Computer Vision", href: "02-Computer-vision.md" }
    },
    {
      q: "Klinika rentgen va MRT tasvirlarida organlarni ma'noli qismlarga ajratib beradigan model qidirmoqda. Darsdagi qaysi maxsus tarmoq aynan shunga ixtisoslashgan?",
      type: "single",
      options: ["EfficientNet", "GAN", "SLAM", "U-Net"],
      answer: [3],
      explain: "U-Net tibbiy tasvir segmentatsiyasida kuchli. EfficientNet esa tarmoq o'lchamlarini samarali masshtablash va hisoblash resurslarini optimal ishlatishga qaratilgan.",
      lesson: { title: "Computer Vision", href: "02-Computer-vision.md" }
    },
    {
      q: "Computer vision foydali mahsulot bo'lishi uchun albatta robotning bir qismi bo'lishi kerak.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Shart emas: masalan, yuzni tanish dasturi robot tanasisiz, shunchaki dasturiy mahsulotga o'rnatilgan model sifatida ishlaydi.",
      lesson: { title: "Computer Vision", href: "02-Computer-vision.md" }
    },
    {
      q: "Darsning asosiy fikriga ko'ra, AI bugun yaratayotgan qiymatning kattaroq qismi qayerdan keladi?",
      type: "single",
      options: [
        "ChatGPT kabi sarlavhalarga chiqqan generativ AI mahsulotlaridan",
        "Firibgarlikni aniqlash kabi kamroq yaltiroq biznes holatlaridan",
        "Tesla Bot kabi umumiy maqsadli humanoid robotlar loyihalaridan",
        "O'zi yuruvchi mashinalar va kosmik tadqiqot robotlari loyihalaridan"
      ],
      answer: [1],
      explain: "ChatGPT, o'zi yuruvchi mashinalar va robotlar sarlavhalarga chiqadi, lekin qiymatning kattaroq qismi an'anaviy ML ning biznes qo'llanishlari bilan bog'liq — ular o'n yildan ortiq vaqtdan beri ishlab turibdi.",
      lesson: { title: "An'anaviy Machine Learning", href: "03-Traditional-ML.md" }
    },
    {
      q: "Quyidagilardan qaysilari darsda an'anaviy ML ning real biznes qo'llanishi sifatida keltirilgan? (Bir nechta to'g'ri javob)",
      type: "multi",
      options: [
        "Sug'urta paketlari uchun aniqroq narx belgilash",
        "Tavsif bo'yicha noyob rasm yoki reklama banneri yaratish",
        "Riteylda talabni bashorat qilib, buyurtmalarni optimallashtirish",
        "Omborda robot uchun navigatsiya xaritasini real vaqtda tuzish",
        "Xarid tarixiga qarab keyingi xaridni bashorat qilish"
      ],
      answer: [0, 2, 4],
      explain: "Sug'urta narxi, riteyl talab prognozi va Amazon'ning keyingi xaridni bashorat qilishi — an'anaviy ML misollari. Tavsif bo'yicha rasm yaratish generativ AI (DALL·E), xarita tuzish esa robotning SLAM moduli vazifasi.",
      lesson: { title: "An'anaviy Machine Learning", href: "03-Traditional-ML.md" }
    },
    {
      q: "Siz ChatGPT'ga bir savolni ikki marta, ikki xil chatda berdingiz va ikki xil javob oldingiz. Buning sababi nima?",
      type: "single",
      options: [
        "Model javobni tayyor bazadan oladi, baza esa har kuni yangilanadi",
        "Bu tizimdagi xato bo'lib, ikkinchi javob odatda noto'g'ri chiqadi",
        "Ikki chat ikki xil model bilan ishlaydi va ular turlicha o'rgatilgan",
        "Model javobni eslab qolmaydi, naqshlar asosida har safar yangidan yaratadi"
      ],
      answer: [3],
      explain: "Generativ AI mavjud ma'lumotni qayta ishlamaydi, balki o'quv ma'lumotidagi naqshlardan yangi kontent yaratadi. Keyingi so'z uchun bir necha ehtimoliy variant bo'lgani sabab natija har safar boshqacha chiqadi.",
      lesson: { title: "Generativ AI", href: "04-Generative-AI.md" }
    },
    {
      q: "Arxitektor bino ichini 3D ko'rinishda qayta tiklamoqchi. Generativ AI ning qaysi texnikasi aynan 3D modellashtirishga ixtisoslashgan?",
      type: "single",
      options: ["Neural Radiance Fields (NeRF)", "Diffusion model (shovqindan rasm)", "Large Language Model (LLM)", "LLM va GAN gibrid arxitekturasi"],
      answer: [0],
      explain: "NeRF — taxminan 2020-yilda paydo bo'lgan, 3D modellashtirish uchun ixtisoslashgan AI. Diffusion asosan rasm va video, LLM esa matn uchun ishlatiladi.",
      lesson: { title: "Generativ AI", href: "04-Generative-AI.md" }
    },
    {
      q: "GAN ning ishlash tamoyilini qaysi tavsif to'g'ri ifodalaydi?",
      type: "single",
      options: [
        "Tasodifiy shovqindan boshlab, uni bosqichma-bosqich batafsil rasmga aylantiradi",
        "Ulkan matnda o'rganib, jumladagi keyingi ehtimoliy so'zni bashorat qilib boradi",
        "Biri yaratadi, ikkinchisi realligini baholaydi — ikki algoritm bir-birini kuchaytiradi",
        "Bir necha kamera suratidan sahnaning 3D modelini nuqtama-nuqta qurib chiqadi"
      ],
      answer: [2],
      explain: "GAN (2014) ikki algoritmni raqobatlashtiradi: generator kontent yaratadi, baholovchi uning realligini tekshiradi va o'zaro ta'sir natijasida ikkalasi ham yaxshilanadi. Shovqindan rasm yaratish esa diffusion modelning ishlash usuli.",
      lesson: { title: "Generativ AI", href: "04-Generative-AI.md" }
    },
    {
      q: "LLM lar haqida qaysi fikrlar darsga mos keladi? (Bir nechta to'g'ri javob)",
      type: "multi",
      options: [
        "Ular ulkan matn hajmlarida o'rgatilgan neyron tarmoqlar",
        "Ular so'zlar orasidagi aloqalarni bashorat qilishni o'rganadi",
        "Ular tasodifiy shovqin naqshidan boshlab kontent yaratadi",
        "Ular jumladagi keyingi ehtimoliy so'zni bashorat qiladi"
      ],
      answer: [0, 1, 3],
      explain: "LLM — ChatGPT ortidagi fundamental texnologiya: ulkan matnda o'rgatilgan, so'zlar orasidagi aloqalarni va keyingi ehtimoliy so'zni bashorat qiladi. Shovqindan boshlash — diffusion modelga xos.",
      lesson: { title: "Generativ AI", href: "04-Generative-AI.md" }
    }
  ]
};
