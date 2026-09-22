window.QUIZ = {
  id: "19",
  title: "Bir necha muhim Python tushunchasi va atamasi",
  subtitle: "OOP asoslari, modullar va paketlar, import qilishning to'rt usuli, dasturiy hujjatlar va Python hujjatlari",
  next: { label: "NLP ga kirish", href: "../20-NLP-Introduction/README.md" },
  questions: [
    {
      q: "Archibald amaki metaforasida qaysi moslashtirishlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Velosiped ustalari — sinf",
        "Yasalgan velosiped — obyekt",
        "Velosiped rangi va o'lchami — metod",
        "Chapga burilish yoki tezlashish — metod",
        "Velosiped ustalari — atribut"
      ],
      answer: [0, 1, 3],
      explain: "Sinf obyektni yaratish qoidalarini belgilaydi (ustalar), obyekt — yasalgan velosiped, metod — obyektga qo'llanadigan amal. Rang va o'lcham esa obyekt holatini bildiruvchi atributlar.",
      lesson: { title: "Obyektga yo'naltirilgan dasturlashga kirish (OOP)", href: "01-Introduction-to-OOP.md" }
    },
    {
      q: "Bu kod nima bilan tugaydi?",
      code: "matn = \"Python\"\nmatn.append(\"!\")\nprint(matn)",
      type: "single",
      options: [
        "Python! chop etiladi",
        "NameError: name 'append' is not defined",
        "['P', 'y', 't', 'h', 'o', 'n', '!'] chop etiladi",
        "AttributeError: 'str' object has no attribute 'append'"
      ],
      answer: [3],
      explain: "Metod ma'lum sinfga tegishli: append — list sinfining metodi, str sinfida esa u yo'q. Shuning uchun satr obyektiga uni qo'llab bo'lmaydi.",
      lesson: { title: "Obyektga yo'naltirilgan dasturlashga kirish (OOP)", href: "01-Introduction-to-OOP.md" }
    },
    {
      q: "Darsga ko'ra metod oddiy funksiyadan nimasi bilan farq qiladi?",
      type: "single",
      options: [
        "Metod parametr qabul qilmaydi, funksiya esa doim kamida bitta parametr oladi",
        "Metod ma'lum sinfga tegishli va parametrlaridan biri obyektning o'zi, funksiya esa o'zicha mavjud",
        "Metod faqat import qilingan modullarda bo'ladi, funksiya esa faqat standart kutubxonada",
        "Farqi faqat nomda: ikkalasi ham obyektsiz bir xil chaqiriladi"
      ],
      answer: [1],
      explain: "Metod — maxsus funksiya: u sinfga tegishli va qo'llanilayotgan obyektni o'z ichiga oladi, shuning uchun obyekt.metod() ko'rinishida yoziladi. Velosiped bo'lmasa — chapga burilib bo'lmaydi.",
      lesson: { title: "Obyektga yo'naltirilgan dasturlashga kirish (OOP)", href: "01-Introduction-to-OOP.md" }
    },
    {
      q: "Kurs davomida len() funksiyasini va list metodlarini hech narsa import qilmasdan ishlata oldik. Buning sababi nima?",
      type: "single",
      options: [
        "Ular Jupyter'ning maxsus buyruqlari, Python'ga tegishli emas",
        "Ular pandas paketi ichida keladi va avtomatik o'rnatiladi",
        "Ular Python o'rnatilishi bilanoq mavjud bo'ladigan standart kutubxonaga kiradi",
        "Ularni har bir dastur boshida Python o'zi qaytadan yozib chiqadi"
      ],
      answer: [2],
      explain: "Standart kutubxona — Python'ni o'rnatganingiz bilanoq mavjud bo'ladigan, dastur boshida ko'rinmaydigan modullar to'plami; len va list kabi ichki xususiyatlar shu yerdan keladi.",
      lesson: { title: "Modullar, paketlar va Python standart kutubxonasi", href: "02-Modules-Packages-Standard-Library.md" }
    },
    {
      q: "Paket va kutubxona (library) atamalari o'zaro almashtiriladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Paket — bog'liq modullar to'plami, ba'zan uni kutubxona deb ham atashadi va darsga ko'ra bu ikkala atama o'zaro almashtiriladi.",
      lesson: { title: "Modullar, paketlar va Python standart kutubxonasi", href: "02-Modules-Packages-Standard-Library.md" }
    },
    {
      q: "Darsga ko'ra pandas paketi qanday paydo bo'lgan?",
      type: "single",
      options: [
        "Python ishlab chiquvchilari uni standart kutubxonaning bir qismi sifatida qo'shgan",
        "2008-yilda Wes McKinney kapital boshqaruvida miqdoriy tahlil vositasi sifatida boshlagan",
        "U pullik tijorat mahsuloti sifatida chiqib, keyinchalik bepul qilingan",
        "Statistiklar uchun bitta modul sifatida yaratilgan va hozir ham o'zgartirilmaydi"
      ],
      answer: [1],
      explain: "Ko'p mashhur paketlar bitta shaxsning loyihasi sifatida boshlanadi: pandas'ni Wes McKinney 2008-yilda yaratgan, u bepul va hamjamiyat tomonidan doim yaxshilanadi.",
      lesson: { title: "Modullar, paketlar va Python standart kutubxonasi", href: "02-Modules-Packages-Standard-Library.md" }
    },
    {
      q: "Bu kod nima bilan tugaydi?",
      code: "from math import sqrt\nprint(math.sqrt(16))",
      type: "single",
      options: [
        "NameError: name 'math' is not defined",
        "4.0 chop etiladi",
        "4 chop etiladi",
        "ModuleNotFoundError: No module named 'math'"
      ],
      answer: [0],
      explain: "from math import sqrt faqat sqrt nomini keltiradi, math nomi esa aniqlanmaydi. Bu holda to'g'ri chaqiruv — shunchaki sqrt(16).",
      lesson: { title: "Modullarni import qilish", href: "03-Importing-Modules.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "import math as m\nfrom math import sqrt as s\nprint(m.sqrt(49), s(36))",
      type: "single",
      options: [
        "7 6",
        "NameError, chunki math nomi aniqlanmagan",
        "7.0 6.0",
        "49 36"
      ],
      answer: [2],
      explain: "as bilan modul (m) va funksiya (s) qayta nomlanadi, ular asl nomlar o'rnida ishlaydi. sqrt kasr son qaytaradi, shuning uchun 7.0 va 6.0 chiqadi.",
      lesson: { title: "Modullarni import qilish", href: "03-Importing-Modules.md" }
    },
    {
      q: "Nega ekspertlar uzun fayllarda from math import * dan qochishadi?",
      type: "single",
      options: [
        "Chunki u math modulidan faqat sqrt funksiyasini import qiladi",
        "Chunki u faqat Python 2 da ishlaydi",
        "Chunki bu usul dasturni sezilarli sekinlashtiradi",
        "Chunki boshqa modulda ham sqrt bo'lsa, Python birini tanlaydi, siz esa tanlay olmaysiz"
      ],
      answer: [3],
      explain: "import * hamma narsani keltiradi; ikkinchi modulda ham bir xil nomli funksiya bo'lsa to'qnashuv yuzaga keladi. Bu noprofessional kodlash belgisi, lekin interaktiv sessiyalarda qo'llash mumkin.",
      lesson: { title: "Modullarni import qilish", href: "03-Importing-Modules.md" }
    },
    {
      q: "math modulidagi faqat sqrt funksiyasining tavsifini o'qimoqchisiz. Qaysi buyruq mos?",
      type: "single",
      options: [
        "help(math)",
        "math.help(sqrt)",
        "help(math.sqrt)",
        "sqrt.help()"
      ],
      answer: [2],
      explain: "help(math.sqrt) bitta funksiya haqida ma'lumot beradi (Return the square root of x). help(math) esa butun modulning barcha funksiyalarini tavsiflaydi.",
      lesson: { title: "Modullarni import qilish", href: "03-Importing-Modules.md" }
    },
    {
      q: "Hujjatlar vosita haqidagi eng katta ma'lumotlar to'plami bo'lsa ham, nega faqat ularning o'zi yetarli emas? (bir nechta javob)",
      type: "multi",
      options: [
        "Boshlovchiga vositaga tushunarli, oddiy tilda kirish kerak",
        "Hujjatlardagi ma'lumot ko'pincha noto'g'ri bo'ladi",
        "Hujjatlar freymvorkdan foydalanishning amaliy jihati haqida kam gapiradi",
        "Tezlik, xotira va ma'lumot yo'qotish xavfi o'rtasidagi muvozanat kabi narsalar ularda bo'lmasligi mumkin",
        "Hujjatlarni faqat vositaning yaratuvchilari o'qiy oladi"
      ],
      answer: [0, 2, 3],
      explain: "Darsdagi uch sabab: oddiy tilda kirish kerak, amaliy jihat kam yoritilgan va ba'zi kuchli vositalar umuman yo'q. Hujjatlar noto'g'ri emas — aksincha, ziddiyatda ular ustunlik qiladi.",
      lesson: { title: "Dasturiy ta'minot hujjatlari nima?", href: "04-What-is-Software-Documentation.md" }
    },
    {
      q: "Stack Overflow'dagi javob rasmiy hujjatlardagi ma'lumotga zid kelib qoldi. Qaysi biriga tayanish kerak?",
      type: "single",
      options: [
        "Rasmiy hujjatlarga, chunki ularni vositaning yaratuvchilari yozgan",
        "Stack Overflow'ga, chunki u amaliy va tezroq javob beradi",
        "Ko'proq ovoz olgan javobga, chunki uni ko'p odam tasdiqlagan",
        "Ikkalasiga ham emas, faqat AI assistent javobiga"
      ],
      answer: [0],
      explain: "Stack Overflow aniq yechimlar va sezgi berishda foydali, lekin ziddiyat holatida vosita yaratuvchilari yozgan hujjatlar ustunlik qiladi.",
      lesson: { title: "Dasturiy ta'minot hujjatlari nima?", href: "04-What-is-Software-Documentation.md" }
    },
    {
      q: "docs.python.org da hujjatlarning qaysi versiyasini odatda tanlash tavsiya etiladi?",
      type: "single",
      options: [
        "In development — chunki unda eng yangi imkoniyatlar bor",
        "Security fixes — chunki u eng xavfsiz",
        "Eng so'nggi stable (barqaror) versiya",
        "Eng eski versiya — chunki u to'liq sinalgan"
      ],
      answer: [2],
      explain: "In development versiya hali yakunlanmagan, shuning uchun kelajakka nazar tashlash kerak bo'lmasa, odatda eng so'nggi barqaror (stable) versiya ishlatiladi.",
      lesson: { title: "Python hujjatlari", href: "05-The-Python-Documentation.md" }
    },
    {
      q: "Quick Search orqali ro'yxatlarning extend metodi haqida aniq tavsif topmoqchisiz. Qanday yozish kerak?",
      type: "single",
      options: [
        "extend",
        "list.extend",
        "extend(list)",
        "Python extend method"
      ],
      answer: [1],
      explain: "Metod list sinfiga qo'llangani uchun uni sinf.metod shaklida — list.extend deb qidirish kerak; xuddi shunday str.upper yoki dict.get.",
      lesson: { title: "Python hujjatlari", href: "05-The-Python-Documentation.md" }
    },
    {
      q: "Jupyter'da Shift + Tab ko'rsatadigan hujjat rasmiy Python veb-saytidagi kabi to'liq bo'ladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Jupyter hujjati rasmiy saytdagidek to'liq emas, lekin u juda foydali: har safar internetga kirmasdan metod yoki funksiya haqida tez ma'lumot beradi.",
      lesson: { title: "Python hujjatlari", href: "05-The-Python-Documentation.md" }
    }
  ]
};
