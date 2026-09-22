window.QUIZ = {
  id: "18",
  title: "Iteratsiya",
  subtitle: "for va while sikllari, range(), sikl ichida shartlar, yig'uvchi o'zgaruvchi, lug'atlar bo'ylab aylanish va Anaconda Assistant",
  next: { label: "Bir necha muhim Python tushunchasi va atamasi", href: "../19-Important-Python-Concepts/README.md" },
  questions: [
    {
      q: "Bu kod nima chiqaradi?",
      code: "for n in [1, 2, 3]:\n    print(n, end=\" \")\nprint(\"Tugadi\")",
      type: "single",
      options: [
        "1 2 3 Tugadi — hammasi bitta qatorda",
        "Uch qator: 1 Tugadi, 2 Tugadi, 3 Tugadi",
        "Har bir son alohida qatorda, oxirida Tugadi",
        "IndentationError, chunki oxirgi print chekintirilmagan"
      ],
      answer: [0],
      explain: "end=\" \" sonlarni bitta qatorda bo'sh joy bilan chiqaradi, oxirgi print esa chekintirilmagani uchun sikldan tashqarida va faqat bir marta bajariladi. Uch marta Tugadi chiqishi uchun u sikl ichida chekintirilgan bo'lishi kerak edi.",
      lesson: { title: "for sikllari", href: "01-For-Loops.md" }
    },
    {
      q: "for sikli haqida qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Sikl o'zgaruvchisini n deb atash shart emas — istalgan nom ishlaydi",
        "Sikl tanasi to'g'ri ishlashi uchun chekintirilgan bo'lishi kerak",
        "Sikl tanasi ketma-ketlikdagi har bir element uchun bir marta bajariladi",
        "for ... in ... dan keyingi ikki nuqta ixtiyoriy",
        "for faqat ro'yxatlar bo'ylab aylana oladi, satr yoki tuple bo'ylab emas"
      ],
      answer: [0, 1, 2],
      explain: "Nom istalgan, tana chekintiriladi va har bir element uchun bir marta bajariladi. Ikki nuqtasiz SyntaxError chiqadi, for esa satr, tuple va range bo'ylab ham aylanadi.",
      lesson: { title: "for sikllari", href: "01-For-Loops.md" }
    },
    {
      q: "Bu kod ishga tushirilsa nima bo'ladi?",
      code: "x = 0\nwhile x <= 20:\n    print(x)\nx += 2",
      type: "single",
      options: [
        "0 dan 20 gacha juft sonlar chiqadi va sikl tugaydi",
        "Faqat 0 chiqadi, keyin sikl o'z-o'zidan to'xtaydi",
        "Cheksiz sikl: x += 2 sikl tanasiga kirmagan",
        "SyntaxError, chunki while dan keyin qavs kerak"
      ],
      answer: [2],
      explain: "x += 2 chekintirilmagan, demak u sikl ichida emas. x doim 0 bo'lib qoladi, shart hech qachon buzilmaydi — bu cheksiz siklning uchinchi sababi.",
      lesson: { title: "while sikllari va inkrementlash", href: "02-While-Loops.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "x = 1\nwhile x <= 100:\n    print(x, end=\" \")\n    x *= 2",
      type: "single",
      options: [
        "1 2 4 8 16 32 64 128",
        "1 2 4 8 16 32 64",
        "2 4 8 16 32 64 128",
        "1 3 5 7 9 ... 99"
      ],
      answer: [1],
      explain: "x *= 2 bu x = x * 2 ning qisqa yozuvi. 64 chop etilgach x 128 ga teng bo'ladi, 128 <= 100 esa noto'g'ri — sikl tugaydi, shuning uchun 128 chiqmaydi.",
      lesson: { title: "while sikllari va inkrementlash", href: "02-While-Loops.md" }
    },
    {
      q: "range() yordamida 1 dan 10 gacha (10 ham kiradi) sonlar ro'yxati kerak. Qaysi yozuv to'g'ri?",
      type: "single",
      options: [
        "list(range(1, 10))",
        "list(range(10))",
        "list(range(0, 10, 1))",
        "list(range(1, 11))"
      ],
      answer: [3],
      explain: "stop qiymati kirmaydi — u oxirgi son plyus bir: 10 + 1 = 11. list(range(1, 10)) 9 da tugaydi, range(10) esa 0 dan boshlanadi.",
      lesson: { title: "range() funksiyasi bilan ro'yxat yaratish", href: "03-The-range-Function.md" }
    },
    {
      q: "Python 3 da list(range(10, 0)) nima qaytaradi?",
      type: "single",
      options: [
        "[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]",
        "[]",
        "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]",
        "ValueError, chunki start stop dan katta"
      ],
      answer: [1],
      explain: "step berilmaganda u 1 ga teng: 10 dan 0 gacha oshib borib bo'lmaydi, shuning uchun bo'sh ro'yxat chiqadi. Teskari sanoq uchun range(10, 0, -1) kerak.",
      lesson: { title: "range() funksiyasi bilan ro'yxat yaratish", href: "03-The-range-Function.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "r = [1, 2, 3]\nfor x in r:\n    x = x * 2\nprint(r)",
      type: "single",
      options: [
        "[2, 4, 6]",
        "[1, 2, 3]",
        "[1, 2, 3, 2, 4, 6]",
        "TypeError"
      ],
      answer: [1],
      explain: "x — elementning nusxasi, unga yangi qiymat berish ro'yxatni o'zgartirmaydi. Ro'yxatni o'zgartirish uchun indeks bo'ylab aylanish kerak: for i in range(len(r)): r[i] = r[i] * 2.",
      lesson: { title: "Shartlar va sikllarni birga ishlatish", href: "04-Conditionals-and-Loops.md" }
    },
    {
      q: "talabalar = [\"Ali\", \"Vali\", \"Hasan\"] va ballar = [87, 65, 92] parallel ro'yxatlaridan \"Ali - 87\" kabi juftliklarni chiqarish kerak. Qaysi yondashuv eng mos?",
      type: "single",
      options: [
        "for t in talabalar: print(t, \"-\", ballar) — har bir ism bilan butun ballar ro'yxati",
        "for i in range(len(talabalar)): print(talabalar[i], \"-\", ballar[i]) — indeks bo'ylab",
        "for b in ballar: print(talabalar, \"-\", b) — har bir ball bilan butun ismlar ro'yxati",
        "while talabalar: print(talabalar[0], \"-\", ballar[0]) — birinchi elementni takrorlab"
      ],
      answer: [1],
      explain: "Ikkinchi usul range(len(x)) bilan pozitsiya bo'ylab aylanadi va bir xil indeks i orqali ikkala ro'yxatdan mos elementni oladi — parallel ro'yxatlar uchun aynan shu kerak.",
      lesson: { title: "Shartlar va sikllarni birga ishlatish", href: "04-Conditionals-and-Loops.md" }
    },
    {
      q: "Bu funksiya nima qaytaradi?",
      code: "def count(numbers):\n    total = 0\n    for x in numbers:\n        if x < 20:\n            total += 1\n        return total\n\nprint(count([1, 3, 7, 15, 23]))",
      type: "single",
      options: [
        "4",
        "5",
        "0",
        "1"
      ],
      answer: [3],
      explain: "return total sikl ichida chekintirilgan, shuning uchun funksiya birinchi aylanishda (x = 1, total = 1) tugaydi. To'g'ri javob 4 bo'lishi uchun return sikldan tashqarida turishi kerak.",
      lesson: { title: "Shartlar, funksiyalar va sikllar", href: "05-Conditionals-Functions-and-Loops.md" }
    },
    {
      q: "count funksiyasidagi total = 0 kabi noldan boshlanib, shart bajarilganda o'z qiymatini o'zgartiradigan o'zgaruvchi darsda qanday ataladi?",
      type: "single",
      options: [
        "Inkrement (increment)",
        "Sikl o'zgaruvchisi (iterator)",
        "Yig'uvchi summa (rolling sum)",
        "Range obyekti (range object)"
      ],
      answer: [2],
      explain: "Bu yig'uvchi summa (rolling sum): noldan boshlanadi, sikl ichida shart bajarilganda o'sadi va sikldan keyin qaytariladi. Inkrement esa har safar qo'shiladigan miqdorning o'zi.",
      lesson: { title: "Shartlar, funksiyalar va sikllar", href: "05-Conditionals-Functions-and-Loops.md" }
    },
    {
      q: "Anaconda Assistant'ga bir xil noaniq savolni ko'p marta bergansiz va javoblar bir-biriga zid bo'la boshladi. Darsga ko'ra nima qilish to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Taklif qilingan narsalarni diqqat bilan o'qib, ehtimoliy xatolarni qidirish",
        "Yangi suhbat boshlash yoki savat belgisi bilan bir necha qadam orqaga qaytish",
        "Javoblar bir xil bo'lguncha o'sha noaniq savolni takrorlayverish",
        "AI kodni o'zi tekshirgani uchun oxirgi javobni ko'r-ko'rona qabul qilish",
        "To'g'ri atamalardan foydalanib aniq va ixcham so'rov yozish"
      ],
      answer: [0, 1, 4],
      explain: "Juda ko'p va noaniq savol AI ni o'ziga zid qiladi, shuning uchun dasturchi tajribasi bilan javobni tekshirish, kerak bo'lsa orqaga qaytish va aniq so'rov berish lozim. Savolni takrorlash yoki ko'r-ko'rona qabul qilish xavfli.",
      lesson: { title: "Anaconda Assistant — Python vositalari", href: "06-Anaconda-Assistant-Python-Tools.md" }
    },
    {
      q: "Darsda iterator o'zgaruvchi nomini x ga va count o'zgaruvchisini total ga o'zgartirish bitta so'rov bilan bajarildi. Bunga nima yordam berdi?",
      type: "single",
      options: [
        "So'rovni javob o'zgarguncha bir necha marta qayta yuborish",
        "To'g'ri atamalardan (iterator, parametr, funksiya) foydalanish",
        "Kodni avval Refactor tugmasi orqali soddalashtirib olish",
        "So'rovni imkon qadar uzun va batafsil, misollar bilan yozish"
      ],
      answer: [1],
      explain: "To'g'ri atamalarni bilish AI bilan tezroq va aniqroq ishlashga yordam beradi — bitta aniq so'rovda bir nechta o'zgartirishni so'rash mumkin bo'ldi.",
      lesson: { title: "Anaconda Assistant — Python vositalari", href: "06-Anaconda-Assistant-Python-Tools.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "prices = {\"spaghetti\": 4, \"lasagna\": 5, \"hamburger\": 2}\nquantity = {\"spaghetti\": 6, \"lasagna\": 10, \"hamburger\": 0}\nmoney_spent = 0\nfor i in prices:\n    money_spent += prices[i] * quantity[i]\nprint(money_spent)",
      type: "single",
      options: [
        "11",
        "16",
        "KeyError",
        "74"
      ],
      answer: [3],
      explain: "i har safar kalitni oladi, prices[i] * quantity[i] esa narx va miqdor ko'paytmasi: 4×6 + 5×10 + 2×0 = 74. 11 — faqat narxlar, 16 — faqat miqdorlar yig'indisi.",
      lesson: { title: "Lug'atlar bo'ylab iteratsiya", href: "07-Iterating-over-Dictionaries.md" }
    },
    {
      q: "for i in prices: siklida i har bir mahsulotning narxini (qiymatini) oladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Lug'at bo'ylab to'g'ridan-to'g'ri aylanganda i — kalit, qiymat emas. Narxni olish uchun prices[i] yoziladi; qiymatlar kerak bo'lsa .values(), ikkalasi uchun .items() ishlatiladi.",
      lesson: { title: "Lug'atlar bo'ylab iteratsiya", href: "07-Iterating-over-Dictionaries.md" }
    },
    {
      q: "Anaconda Assistant'ning \"Refactor the selected code\" variantidagi yashirin xavf nimada?",
      type: "single",
      options: [
        "U kodga ortiqcha izohlar qo'shib, uni o'qishni qiyinlashtiradi",
        "U ishlayotgan kodni so'ramasdan o'chirib, o'rniga yangisini yozadi",
        "U siz bilmagan vositalarni (list comprehension) taklif qilishi mumkin",
        "U faqat Python 2 sintaksisida javob beradi, Python 3 da ishlamaydi"
      ],
      answer: [2],
      explain: "Refactor kodni soddalashtirish takliflarini beradi, lekin ularda notanish vositalar bo'lishi mumkin. Shuning uchun oltin qoida: tushunmagan kodni qabul qilmang.",
      lesson: { title: "Anaconda Assistant — lug'atlar", href: "08-Anaconda-Assistant-Dictionaries.md" }
    }
  ]
};
