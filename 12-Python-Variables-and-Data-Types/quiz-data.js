window.QUIZ = {
  id: "12",
  title: "Python o'zgaruvchilari va ma'lumot turlari",
  subtitle: "O'zgaruvchilar va biriktirish, kodlash mashqlari, int, float, bool, satrlar va Anaconda Assistant bilan ishlash",
  next: { label: "Python ning asosiy sintaksisi", href: "../13-Basic-Python-Syntax/README.md" },
  questions: [
    {
      q: "Python'da x = 5 qatoridagi = belgisi matematikadagi kabi ikki tomonning tengligini bildiradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Dasturlashda = \"biriktir\" yoki \"bog'la\" (assign / bind to) degani: x nomli o'zgaruvchiga 5 qiymati beriladi. Bu fakt emas, buyruq.",
      lesson: { title: "Python o'zgaruvchilari", href: "01-Python-Variables.md" }
    },
    {
      q: "Bu kod bitta Jupyter yacheykasida bajarilsa, chiqish maydonida nima ko'rinadi?",
      code: "x = 5\ny = 8\nx\ny",
      type: "single",
      options: [
        "5 va 8 — ikki alohida qatorda",
        "Faqat 5",
        "Hech narsa, chunki print ishlatilmagan",
        "Faqat 8"
      ],
      answer: [3],
      explain: "Yalang'och o'zgaruvchi yozilganda Jupyter faqat yacheykadagi oxirgi ifodani ko'rsatadi. Ikkala qiymatni ko'rish uchun print(x) va print(y) kerak.",
      lesson: { title: "Python o'zgaruvchilari", href: "01-Python-Variables.md" }
    },
    {
      q: "Quyidagi qator bajarilganda nima bo'ladi?",
      code: "x, y = (1, 2, 3)",
      type: "single",
      options: [
        "ValueError: too many values to unpack (expected 2)",
        "x = 1 va y = (2, 3) bo'ladi — qolgani y ga yig'iladi",
        "x = 1, y = 2 bo'ladi, 3 esa tashlab yuboriladi",
        "SyntaxError, chunki qavslarni ishlatib bo'lmaydi"
      ],
      answer: [0],
      explain: "Bir qatorda biriktirishda o'zgaruvchilar soni qiymatlar soniga teng bo'lishi shart. Qavslar esa ixtiyoriy — ular faqat o'qilishni yaxshilaydi.",
      lesson: { title: "Python o'zgaruvchilari", href: "01-Python-Variables.md" }
    },
    {
      q: "Vazifa: Click \"OK\" natijasini chiqarish. Siz 'Click \"OK\"' deb yozdingiz: Run Code muvaffaqiyatli o'tdi, lekin Run Tests yiqildi. Nega?",
      type: "single",
      options: [
        "Bitta qo'shtirnoq o'rniga ikkita qo'shtirnoq ishlatish shart edi",
        "print ishlatilmagani uchun natijada qo'shtirnoqlar qolib ketgan",
        "Python sintaksisi buzilgan, lekin Run Code buni payqamagan",
        "Testlar Click so'zi kichik harf bilan yozilishini kutgan"
      ],
      answer: [1],
      explain: "Run Code faqat sintaksisni tekshiradi, Run Tests esa vazifa yechilganini. print('Click \"OK\"') satrni qo'shtirnoqlardan xalos qilib, aynan kerakli natijani beradi.",
      lesson: { title: "Kodlash mashqlari haqida", href: "02-Python-Coding-Exercises.md" }
    },
    {
      q: "Vazifa: \"5 va 3 sonlarining yig'indisini chop eting\". Kimdir print(8) deb yozdi va natija 8 chiqdi. Darsga ko'ra bu nima uchun yomon yechim?",
      type: "single",
      options: [
        "print(8) SyntaxError beradi, chunki son qo'shtirnoqsiz yozilgan",
        "Natija 8 matn sifatida chiqadi, test esa int turini kutadi",
        "Javob qo'lda hisoblangan: sonlar o'zgarsa, kod xato bo'lib qoladi",
        "print faqat satrlar bilan ishlaydi, sonni avval str() qilish kerak"
      ],
      answer: [2],
      explain: "\"Ishladi\" hali \"to'g'ri\" degani emas: natija olish analitik savolga to'g'ri javob berganingizni anglatmaydi. Dastur hisoblashi kerak — print(5 + 3).",
      lesson: { title: "Kodlash mashqlari haqida", href: "02-Python-Coding-Exercises.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "print(int(0.99))\nprint(int(4.75))",
      type: "single",
      options: ["1 va 5", "1 va 4", "0 va 4", "0 va 5"],
      answer: [2],
      explain: "int() yaxlitlamaydi — kasr qismini tashlab yuboradi. Shuning uchun int(0.99) → 0, int(4.75) → 4. Yaxlitlash uchun round() kerak.",
      lesson: { title: "Ma'lumot turlari — sonlar va Boolean qiymatlar", href: "03-Numbers-and-Boolean-Values.md" }
    },
    {
      q: "Quyidagi kod bajarilganda nima bo'ladi?",
      code: "javob = true\nprint(type(javob))",
      type: "single",
      options: [
        "<class 'bool'> — true ham Boolean qiymat",
        "<class 'str'> — true satr sifatida o'qiladi",
        "SyntaxError: invalid syntax — 1-qatorda",
        "NameError: name 'true' is not defined"
      ],
      answer: [3],
      explain: "Boolean qiymatlar bosh harf bilan yoziladi: True va False. Kichik harfli true Python uchun aniqlanmagan o'zgaruvchi nomi, shuning uchun NameError.",
      lesson: { title: "Ma'lumot turlari — sonlar va Boolean qiymatlar", href: "03-Numbers-and-Boolean-Values.md" }
    },
    {
      q: "type() funksiyasi quyidagi qiymatlardan qaysilari uchun int qaytaradi? (bir nechta javob)",
      type: "multi",
      options: ["-6", "100.0", "0", "True", "5"],
      answer: [0, 2, 4],
      explain: "Integer — kasr nuqtasiz musbat yoki manfiy butun son, shu jumladan 0. 100.0 da kasr nuqtasi bor, demak float; True ning turi esa bool.",
      lesson: { title: "Ma'lumot turlari — sonlar va Boolean qiymatlar", href: "03-Numbers-and-Boolean-Values.md" }
    },
    {
      q: "Quyidagi kod TypeError beradi. Qaysi variantlar uni tuzatib, 10 Dollars chiqaradi? (bir nechta javob)",
      code: "y = 10\nprint(y + \" Dollars\")",
      type: "multi",
      options: [
        "print(str(y) + \" Dollars\")",
        "print(int(y) + \" Dollars\")",
        "print(y, \"Dollars\")",
        "print(y + str(\" Dollars\"))"
      ],
      answer: [0, 2],
      explain: "Turli turdagi qiymatlarni + bilan bir ifodaga qo'yib bo'lmaydi: str(y) sonni matnga aylantiradi, vergul esa har qanday turni bo'sh joy bilan chop etadi. Qolgan ikkitasida baribir int + str qoladi.",
      lesson: { title: "Ma'lumot turlari — satrlar (Strings)", href: "04-Strings.md" }
    },
    {
      q: "Bu ikki qator nima chiqaradi?",
      code: "print('Red' 'car')\nprint('Red', 'car')",
      type: "single",
      options: [
        "Red car va Red car",
        "Redcar va Red car",
        "Redcar va Redcar",
        "Birinchi qator SyntaxError, ikkinchisi Red car"
      ],
      answer: [1],
      explain: "Yonma-yon turgan satrlar bo'shliqsiz yopishadi — Redcar. print ichidagi vergul (trailing comma) esa qiymatlarni avtomatik bo'sh joy bilan ajratadi.",
      lesson: { title: "Ma'lumot turlari — satrlar (Strings)", href: "04-Strings.md" }
    },
    {
      q: "Quyidagi satrlardan qaysi biri SyntaxError beradi?",
      type: "single",
      options: [
        "\"I'm fine\"",
        "'I\\'m fine'",
        "'Press \"Enter\"'",
        "'I'm fine'"
      ],
      answer: [3],
      explain: "'I'm fine' da ichki apostrof satrni erta yopadi. Yechim — tashqi belgi ichkisidan farq qilishi (\"I'm fine\") yoki backslash escape belgisi ('I\\'m fine').",
      lesson: { title: "Ma'lumot turlari — satrlar (Strings)", href: "04-Strings.md" }
    },
    {
      q: "Yacheykaga qo'shtirnoqsiz George yozib bajarganda nima uchun NameError chiqadi?",
      type: "single",
      options: [
        "Python uni qiymati yo'q o'zgaruvchi nomi deb o'qiydi",
        "Python katta harf bilan boshlangan so'zlarni qabul qilmaydi",
        "Python'da satr turini avval str deb e'lon qilish shart",
        "Matnni faqat print() ichida yozish mumkin, yacheykada emas"
      ],
      answer: [0],
      explain: "Qo'shtirnoqsiz so'zni Python o'zgaruvchi nomi deb o'qiydi. 'George' yoki \"George\" deb yozilsa, u satr bo'ladi. Python'da turlarni e'lon qilish shart emas — u turni o'zi aniqlaydi.",
      lesson: { title: "Ma'lumot turlari — satrlar (Strings)", href: "04-Strings.md" }
    },
    {
      q: "Anaconda Assistant'ni ChatGPT bilan solishtirganda darsda qaysi farq aytilgan?",
      type: "single",
      options: [
        "U OpenAI modellaridan emas, Anaconda'ning o'z modelidan foydalanadi",
        "U faqat ingliz tilidagi savollarni tushunib, javob bera oladi",
        "U umumiy bilim va matn yechimlarida ChatGPT'dan kuchliroq",
        "U Python kod yaratish, tushuntirish va debug qilishga ixtisoslashgan"
      ],
      answer: [3],
      explain: "Assistant ChatGPT yaratishda ishlatiladigan til modellaridan foydalanadi, lekin Python'ga ixtisoslashgan va umumiy bilimni kamroq beradi. Unga ingliz va boshqa ko'plab tillarda yozish mumkin.",
      lesson: { title: "Anaconda AI — kirish", href: "05-Anaconda-AI-Introduction.md" }
    },
    {
      q: "George xatosi uchun \"Debug the active code cell\" bosilgach, Assistant qanday yechim taklif qildi?",
      type: "single",
      options: [
        "George o'zgaruvchisini yaratib, unga bo'sh qiymat berdi",
        "Satrni qo'shtirnoqqa olib, name o'zgaruvchisiga biriktirdi",
        "Satrni print(George) ichiga olib chiqarishni tavsiya qildi",
        "Kernel'ni qayta ishga tushirib, yacheykani qayta bajarishni aytdi"
      ],
      answer: [1],
      explain: "AI George matn qiymati ekanini tushunib, qo'shtirnoq qo'ydi va yaxshi amaliyot sifatida mazmunini ko'rsatuvchi name o'zgaruvchisiga bog'ladi: name = \"George\".",
      lesson: { title: "Anaconda Assistant bilan ishlash — satrlar misolida", href: "06-Using-the-Anaconda-Assistant.md" }
    },
    {
      q: "Assistant so'rovlarni har doim ham tushunavermaydi. Darsga ko'ra qaysi so'rov samaraliroq?",
      type: "single",
      options: [
        "\"Mening butun dasturim ishlamayapti, tuzatib ber\" va 30 qatorli kod",
        "\"Menga to'liq chek dasturini noldan yozib ber\" va talablar ro'yxati",
        "\"Bu 3 qatorda nima uchun TypeError chiqyapti?\" va o'sha fragment",
        "\"Python'dagi barcha xato turlarini birma-bir tushuntir\""
      ],
      answer: [2],
      explain: "Darsda qadamma-qadam yondashuv tavsiya etiladi: kodning aniq fragmenti haqida so'rash kerak. Butun dasturni tashlab yuborish AI'ning xato tushunish ehtimolini oshiradi.",
      lesson: { title: "Anaconda Assistant bilan ishlash — satrlar misolida", href: "06-Using-the-Anaconda-Assistant.md" }
    }
  ]
};
