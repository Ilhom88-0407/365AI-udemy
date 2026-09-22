window.QUIZ = {
  id: "15",
  title: "Shart operatorlari",
  subtitle: "if, else va elif operatorlari, boshqaruv oqimi, shartlar tartibi va boolean qiymatlar",
  next: { label: "Funksiyalar", href: "../16-Functions/README.md" },
  questions: [
    {
      q: "Bu kod nima chiqaradi?",
      code: "if 5 == 18 / 3:\n    print(\"Hooray!\")\nprint(\"Tugadi\")",
      type: "single",
      options: [
        "Hooray! va Tugadi",
        "Faqat Tugadi",
        "Hech narsa — dastur shu yerda to'xtaydi",
        "Faqat Hooray!"
      ],
      answer: [1],
      explain: "18 / 3 = 6.0 va 5 unga teng emas, shuning uchun if bloki bajarilmaydi. Lekin dastur to'xtamaydi: blokdan tashqaridagi print doim bajariladi.",
      lesson: { title: "if operatori", href: "01-The-IF-Statement.md" }
    },
    {
      q: "if 5 = 15 / 3: yozuvi nima uchun xato?",
      type: "single",
      options: [
        "Shartdan keyin ikki nuqta emas, nuqtali vergul qo'yilishi kerak",
        "15 / 3 kasr son qaytargani uchun uni butun son bilan solishtirib bo'lmaydi",
        "Tenglikni tekshirish uchun == kerak, bitta = esa biriktirish",
        "if ichida faqat o'zgaruvchilarni solishtirish mumkin, sonlarni emas"
      ],
      answer: [2],
      explain: "Shartda tenglikni tekshirish uchun ikkilangan == ishlatiladi; bitta = biriktirishni bildiradi va SyntaxError beradi. 5 esa o'zgaruvchi nomi emas, son.",
      lesson: { title: "if operatori", href: "01-The-IF-Statement.md" }
    },
    {
      q: "Quyidagilardan qaysilari if yozishda xatoga olib keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Shartdan keyin ikki nuqtani unutish",
        "Shartda != operatoridan foydalanish",
        "Blok ichidagi print ni chekintirmasdan yozish",
        "Blok ichida 4 ta bo'sh joy bilan chekinish",
        "Shartda == o'rniga = yozish"
      ],
      answer: [0, 2, 4],
      explain: "Ikki nuqta yo'qligi va = ishlatish SyntaxError, chekinish yo'qligi IndentationError beradi. != va boshqa solishtirish operatorlari shartda bemalol ishlaydi, 4 bo'sh joyli chekinish esa to'g'ri uslub.",
      lesson: { title: "if operatori", href: "01-The-IF-Statement.md" }
    },
    {
      q: "Ikkita alohida if yozilgan. x = 2, y = 25 bo'lsa nima chiqadi?",
      code: "x = 2\ny = 25\nif x > 3 and y > 13:\n    print(\"Both\")\nif x <= 3 or y <= 13:\n    print(\"At least one\")",
      type: "single",
      options: [
        "Both",
        "Both va At least one",
        "Hech narsa chiqmaydi",
        "At least one"
      ],
      answer: [3],
      explain: "x > 3 yolg'on bo'lgani uchun and bilan birinchi shart False. Ikkinchi if alohida tekshiriladi: x <= 3 rost, or uchun shu yetarli, shuning uchun At least one chiqadi.",
      lesson: { title: "if operatori", href: "01-The-IF-Statement.md" }
    },
    {
      q: "x = 3 bo'lganda bu kod nima chiqaradi?",
      code: "x = 3\nif x > 3:\n    print(\"Katta\")\nif x < 3:\n    print(\"Kichik\")",
      type: "single",
      options: [
        "Hech narsa chiqmaydi",
        "Faqat Katta chiqadi",
        "Faqat Kichik chiqadi",
        "Katta, keyin Kichik chiqadi"
      ],
      answer: [0],
      explain: "x = 3 hech qaysi shartga tushmaydi, shuning uchun hech narsa chiqmaydi. if/else bilan bunday bo'lishi mumkin emas: else qolgan hamma holatni qamraydi.",
      lesson: { title: "else operatori", href: "02-The-ELSE-Statement.md" }
    },
    {
      q: "Dasturchi else ni if blokidagi print ostiga, chekintirib yozdi. Nima bo'ladi?",
      type: "single",
      options: [
        "Kod ishlaydi, else shunchaki if blokining bir qismi bo'ladi",
        "SyntaxError — if va else bir xil vertikal chiziqda turishi kerak",
        "Kod ishlaydi, lekin else bloki hech qachon bajarilmaydi",
        "Python chekinishni avtomatik tuzatadi va ogohlantirish beradi"
      ],
      answer: [1],
      explain: "Kodni o'z boshimchalik bilan tashkil qilib bo'lmaydi: else if bilan bir xil ustunda turishi shart, aks holda SyntaxError chiqadi.",
      lesson: { title: "else operatori", href: "02-The-ELSE-Statement.md" }
    },
    {
      q: "else dan keyin ham shart yoziladi, masalan: else x <= 3:",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "else da shart yo'q, faqat else: yoziladi. U kompyuterga qolgan barcha holatlarda keyingi buyruqni bajarishni aytadi.",
      lesson: { title: "else operatori", href: "02-The-ELSE-Statement.md" }
    },
    {
      q: "Bu funksiya compare_v3(-3) uchun nima qaytaradi?",
      code: "def compare_v3(y):\n    if y > 5:\n        return \"Greater\"\n    elif y < 5:\n        return \"Less\"\n    elif y < 0:\n        return \"Negative\"\n    else:\n        return \"Equal\"",
      type: "single",
      options: ["Negative", "Equal", "Less", "Greater"],
      answer: [2],
      explain: "-3 uchun y < 5 ham rost, va kompyuter birinchi rost shartda to'xtaydi. Shuning uchun elif y < 0 ga hech qachon yetib bo'lmaydi va Negative o'rniga Less qaytadi.",
      lesson: { title: "elif operatori", href: "03-The-ELIF-Statement.md" }
    },
    {
      q: "compare_to_five da elif y < 5 bloki elif y < 0 dan oldin tursa, -3 uchun Negative o'rniga Less qaytadi. Buni qaysi qoida tuzatadi?",
      type: "single",
      options: [
        "Eng tor shartni eng oldin, eng kengini eng oxirida yozish",
        "Eng keng shartni eng oldin yozish, chunki u ko'p holatni qamraydi",
        "Barcha elif larni alohida if larga almashtirib, har birini tekshirish",
        "elif lar sonini ikkitadan oshirmaslik, qolganini else ga berish"
      ],
      answer: [0],
      explain: "y < 0 tor shart, y < 5 keng shart. Tor shart oldin tursa, manfiy sonlar to'g'ri Negative ga tushadi, qolganlari keyingi elif ga o'tadi.",
      lesson: { title: "elif operatori", href: "03-The-ELIF-Statement.md" }
    },
    {
      q: "if/elif/else zanjirida kompyuter qanoatlantirilgan shartni topgan zahoti nima qiladi?",
      type: "single",
      options: [
        "Qolgan elif larni ham tekshirib, hamma rost bloklarni bajaradi",
        "Oxirigacha tekshirib, faqat oxirgi rost shartning blokini bajaradi",
        "Avval else ni tekshiradi, keyin yuqoriga qaytib elif larni ko'radi",
        "Shu blokni bajarib, zanjirning qolgan qismini o'tkazib yuboradi"
      ],
      answer: [3],
      explain: "Kompyuter buyruqlarni yuqoridan pastga, bittadan o'qiydi va birinchi rost shartda tegishli natijani bajaradi; qolgan elif va else e'tiborga olinmaydi.",
      lesson: { title: "elif operatori", href: "03-The-ELIF-Statement.md" }
    },
    {
      q: "Bitta if/else konstruksiyasiga nechta elif qo'shish mumkin?",
      type: "single",
      options: [
        "Faqat bitta — qolgani uchun yangi if",
        "Kerak bo'lgancha — cheklov yo'q",
        "Ko'pi bilan uchta — Python cheklovi",
        "if lar soniga teng miqdorda"
      ],
      answer: [1],
      explain: "Darsda aytilganidek, elif operatorlarini kerak bo'lgancha qo'shish mumkin. Muhimi — ularning tartibi.",
      lesson: { title: "elif operatori", href: "03-The-ELIF-Statement.md" }
    },
    {
      q: "Mashqda if x > 200: dan keyin elif x > 100 and x <= 200: yozilgan. and x <= 200 qismi haqida qaysi gap to'g'ri?",
      type: "single",
      options: [
        "U majburiy, busiz 250 ham Average bo'lib qoladi",
        "U x manfiy bo'lganda Average chiqishining oldini oladi",
        "U ortiqcha: elif ga yetganda x <= 200 allaqachon rost",
        "U kerak, chunki elif oldingi shartlarni hisobga olmaydi"
      ],
      answer: [2],
      explain: "elif faqat oldingi shart yolg'on bo'lganda tekshiriladi, shuning uchun x <= 200 kafolatlangan. Qo'shimcha shart xato emas, faqat o'qishni aniqroq qiladi.",
      lesson: { title: "elif operatori", href: "03-The-ELIF-Statement.md" }
    },
    {
      q: "x = 2 va if x > 4: ... else: ... konstruksiyasida kompyuter natijani qanday tanlaydi?",
      type: "single",
      options: [
        "Shartni hisoblab, False qiymatini oladi va else blokini tanlaydi",
        "x ning qiymatini 4 bilan almashtiradi va if blokini bajaradi",
        "Ikkala blokni ham bajarib, oxirgisining natijasini ko'rsatadi",
        "Shart son qaytargani uchun uni satrga aylantirib solishtiradi"
      ],
      answer: [0],
      explain: "Kompyuter 2 > 4 ni hisoblaydi va False boolean qiymatini oladi, shu asosda else bloki tanlanib Incorrect chiqadi. if ichida shartning o'zi emas, uning natijasi turadi.",
      lesson: { title: "Boolean qiymatlar haqida eslatma", href: "04-A-Note-on-Boolean-Values.md" }
    },
    {
      q: "if ichida qaysi qiymatlar yolg'on (falsy) hisoblanadi? (bir nechta javob)",
      type: "multi",
      options: ["0 (int)", "\"\" (str)", "[0] (list)", "None", "-5 (int)"],
      answer: [0, 1, 3],
      explain: "0, bo'sh satr, bo'sh ro'yxat, bo'sh lug'at va None yolg'on hisoblanadi. [0] bo'sh emas, -5 esa noldan farqli son, shuning uchun ikkalasi rost.",
      lesson: { title: "Boolean qiymatlar haqida eslatma", href: "04-A-Note-on-Boolean-Values.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "x = 5\nprint(bool(x))\nprint(x == True)",
      type: "single",
      options: [
        "True, keyin True",
        "False, keyin False",
        "True, keyin False",
        "False, keyin True"
      ],
      answer: [2],
      explain: "5 truthy, shuning uchun bool(5) True. Lekin x == True tenglik tekshiruvi: True 1 ga teng, 5 esa 1 emas, natija False. Shu sababli if x: va if x == True: har doim bir xil ishlamaydi.",
      lesson: { title: "Boolean qiymatlar haqida eslatma", href: "04-A-Note-on-Boolean-Values.md" }
    }
  ]
};
