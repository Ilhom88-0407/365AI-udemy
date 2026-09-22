window.QUIZ = {
  id: "17",
  title: "Ketma-ketliklar",
  subtitle: "Ro'yxatlar, metodlar, kesish (slicing), tuple lar va lug'atlar",
  next: { label: "Iteratsiya", href: "../18-Iteration/README.md" },
  questions: [
    {
      q: "Bu kod nima chiqaradi?",
      code: "P = ['John', 'Leila', 'Gregory', 'Maria']\ndel P[2]\nprint(P[2])",
      type: "single",
      options: [
        "Gregory",
        "Maria",
        "IndexError: list index out of range",
        "Leila"
      ],
      answer: [1],
      explain: "del elementni o'chirgach, keyingi elementlarning indekslari chapga suriladi: Maria 3-pozitsiyadan 2-pozitsiyaga o'tadi, shuning uchun P[2] endi Maria.",
      lesson: { title: "Ro'yxatlar (lists)", href: "01-Lists.md" }
    },
    {
      q: "P = ['John', 'Leila', 'Gregory', 'Cate'] ro'yxatida qaysi yozuvlar 'Gregory' ni qaytaradi? (bir nechta javob)",
      type: "multi",
      options: [
        "P[2]",
        "P[-2]",
        "P[-3]",
        "P[3]",
        "P[-1]"
      ],
      answer: [0, 1],
      explain: "Musbat sanoq 0 dan boshlanadi (Gregory — 2), manfiy sanoq esa -1 dan (Cate — -1, Gregory — -2). P[-3] Leila ni, P[3] va P[-1] Cate ni beradi.",
      lesson: { title: "Ro'yxatlar (lists)", href: "01-Lists.md" }
    },
    {
      q: "Ro'yxatdagi kabi satrdagi harfni ham almashtirish mumkin: soz = \"Friday\" bo'lsa, soz[0] = \"M\" xatosiz ishlaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Ro'yxat o'zgaruvchan (mutable), satr esa o'zgarmas (immutable): soz[0] = \"M\" TypeError beradi — 'str' object does not support item assignment.",
      lesson: { title: "Ro'yxatlar (lists)", href: "01-Lists.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "a = ['John', 'Leila']\na.append(['George', 'Catherine'])\nprint(len(a))",
      type: "single",
      options: [
        "4",
        "2",
        "3",
        "TypeError"
      ],
      answer: [2],
      explain: "append berilgan narsani butunicha bitta element qilib qo'shadi, shuning uchun ro'yxat ichida ro'yxat paydo bo'ladi va elementlar soni 3 ta. 4 ta bo'lishi uchun extend kerak edi.",
      lesson: { title: "Metodlardan foydalanish", href: "02-Using-Methods.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "b = [1, 2]\nb.extend(\"abc\")\nprint(b)",
      type: "single",
      options: [
        "[1, 2, 'abc']",
        "[1, 2, 'a', 'b', 'c']",
        "[1, 2, ['a', 'b', 'c']]",
        "TypeError: extend faqat ro'yxat qabul qiladi"
      ],
      answer: [1],
      explain: "extend ichini ochib qo'shadi, satr esa ham ketma-ketlik — shuning uchun u harflarga ajraladi. [1, 2, 'abc'] natijani append beradi.",
      lesson: { title: "Metodlardan foydalanish", href: "02-Using-Methods.md" }
    },
    {
      q: "len(Participants) va Participants.append(\"Dwayne\") yozuvlarida funksiya va metodni sintaksis bo'yicha qanday farqlaysiz?",
      type: "single",
      options: [
        "Funksiya obyektni qavs ichida oladi, metod esa nuqta orqali qo'llanadi",
        "Metod obyektni qavs ichida oladi, funksiya esa nuqta orqali qo'llanadi",
        "Farq yo'q: ikkalasi ham faqat ro'yxatlar bilan ishlaydi va bir xil yoziladi",
        "Funksiya faqat satrlarga, metod esa faqat ro'yxatlarga qo'llanadi"
      ],
      answer: [0],
      explain: "Umumiy tuzilma: funksiya(obyekt) va obyekt.metod(argument). Masalan, len() satrda ham, ro'yxatda ham ishlaydi, demak u faqat bitta turga bog'liq emas.",
      lesson: { title: "Metodlardan foydalanish", href: "02-Using-Methods.md" }
    },
    {
      q: "P = ['John', 'Leila', 'Maria', 'Dwayne', 'George', 'Catherine'] ro'yxatidan faqat Leila va Maria ni (1 va 2-pozitsiyalar) olish kerak. Qaysi kesim to'g'ri?",
      type: "single",
      options: [
        "P[1:2]",
        "P[0:3]",
        "P[2:3]",
        "P[1:3]"
      ],
      answer: [3],
      explain: "Ikkinchi raqam kerakli oxirgi pozitsiyadan bitta yuqori bo'ladi: 2 + 1 = 3. P[1:2] faqat ['Leila'] ni beradi.",
      lesson: { title: "Ro'yxatni kesish (slicing)", href: "03-List-Slicing.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "r = [3, 1, 2]\nyangi = r.sort()\nprint(yangi, r)",
      type: "single",
      options: [
        "[1, 2, 3] [3, 1, 2]",
        "[1, 2, 3] [1, 2, 3]",
        "None [1, 2, 3]",
        "None [3, 1, 2]"
      ],
      answer: [2],
      explain: "sort() ro'yxatning o'zini tartiblaydi va None qaytaradi. Asl ro'yxatni o'zgartirmasdan yangi tartiblangan ro'yxat olish uchun sorted(r) ishlatiladi.",
      lesson: { title: "Ro'yxatni kesish (slicing)", href: "03-List-Slicing.md" }
    },
    {
      q: "P = ['a', 'b', 'c', 'd', 'e'] uchun qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "P[10:20] xato bermaydi va bo'sh ro'yxat qaytaradi",
        "P[10] IndexError beradi",
        "P[1] satr 'b' ni, P[1:2] esa ro'yxat ['b'] ni beradi",
        "P[:3] + P[3:] da 'd' elementi ikki marta takrorlanadi",
        "nusxa = P yozuvi P ning mustaqil nusxasini yaratadi"
      ],
      answer: [0, 1, 2],
      explain: "Kesish chegaradan chiqsa bo'sh ro'yxat beradi, indekslash esa xato. P[:3] + P[3:] butun ro'yxatni hech narsa takrorlanmasdan beradi; mustaqil nusxa P[:] bilan olinadi, nusxa = P esa bir obyektga ikkinchi nom.",
      lesson: { title: "Ro'yxatni kesish (slicing)", href: "03-List-Slicing.md" }
    },
    {
      q: "y = 50, 51, 52 yozuvi qavslarsiz berilgan. Python y ni qaysi tur deb qabul qiladi?",
      type: "single",
      options: [
        "list — chunki qiymatlar vergul bilan ajratilgan",
        "tuple — Python'ning standart ketma-ketlik turi",
        "Hech qaysi: qavssiz yozuv SyntaxError beradi",
        "str — chunki qiymatlar bitta satrga birlashadi"
      ],
      answer: [1],
      explain: "Tuple — standart ketma-ketlik turi: uchta qiymat tuple'ga qadoqlanadi va (50, 51, 52) hosil bo'ladi. Qavslar shart emas, vergul yetarli.",
      lesson: { title: "Tuple lar", href: "04-Tuples.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "(age, years_of_school) = \"30,17\".split(',')\nprint(age + years_of_school)",
      type: "single",
      options: [
        "47",
        "('30', '17')",
        "3017",
        "TypeError"
      ],
      answer: [2],
      explain: "split(',') satrlar ro'yxatini qaytaradi, ya'ni age = '30' va years_of_school = '17' — son emas, satr. Satrlarni + qo'shganda ular ulanadi; 47 olish uchun int() kerak.",
      lesson: { title: "Tuple lar", href: "04-Tuples.md" }
    },
    {
      q: "x = (40, 41, 42) tuple'i bilan qaysi amallar xato beradi? (bir nechta javob)",
      type: "multi",
      options: [
        "x.append(43)",
        "y = x[0:2]",
        "x[0] = 99",
        "x.count(40)",
        "del x[0]"
      ],
      answer: [0, 2, 4],
      explain: "Tuple o'zgarmas: element qo'shib, almashtirib yoki o'chirib bo'lmaydi. Indekslash, kesish (y = x[0:2] → (40, 41)), count() va len() esa ishlaydi.",
      lesson: { title: "Tuple lar", href: "04-Tuples.md" }
    },
    {
      q: "Dasturingiz foydalanuvchi kiritgan lavozim nomi bo'yicha Team lug'atidan o'yinchini topadi. Lavozim lug'atda bo'lmasligi mumkin, lekin dastur to'xtab qolmasligi kerak. Qaysi yozuv mos?",
      type: "single",
      options: [
        "Team['Coach'] — kalit yo'q bo'lsa bo'sh satr qaytaradi",
        "Team('Coach') — lug'atga oddiy qavslar bilan murojaat qilinadi",
        "Team.get('Coach') — kalit yo'q bo'lsa None qaytaradi",
        "Team[0] — birinchi kalitning qiymatini qaytaradi"
      ],
      answer: [2],
      explain: "get() kalit yo'q bo'lsa xato bermay None qaytaradi. Team['Coach'] esa KeyError beradi va dastur to'xtaydi; lug'atda murojaat indeks bilan emas, kalit bilan bo'ladi.",
      lesson: { title: "Lug'atlar (dictionaries)", href: "05-Dictionaries.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "d = {'k1': 'cat', 'k2': 'dog'}\nd['k2'] = 'squirrel'\nd['k3'] = 'mouse'\nprint(len(d), d['k2'])",
      type: "single",
      options: [
        "3 squirrel",
        "4 squirrel",
        "3 dog",
        "KeyError: 'k3'"
      ],
      answer: [0],
      explain: "Bitta sintaksis ikki ma'noda ishlaydi: kalit bor bo'lsa ('k2') qiymat almashtiriladi, yo'q bo'lsa ('k3') yangi juftlik qo'shiladi. Natijada 3 juftlik va 'k2' ning qiymati squirrel.",
      lesson: { title: "Lug'atlar (dictionaries)", href: "05-Dictionaries.md" }
    },
    {
      q: "Nega {[1, 2]: 'qiymat'} TypeError beradi, {(1, 2): 'qiymat'} esa ishlaydi?",
      type: "single",
      options: [
        "Chunki lug'at kaliti faqat ikki elementli ketma-ketlik bo'la oladi",
        "Chunki ro'yxat o'zgaruvchan, tuple esa o'zgarmas va kalit bo'la oladi",
        "Chunki kvadrat qavslar lug'at ichida umuman ishlatilmaydi",
        "Chunki tuple ro'yxatdan tezroq, lug'at esa faqat tez turlarni qabul qiladi"
      ],
      answer: [1],
      explain: "Ro'yxat o'zgaruvchan bo'lgani uchun kalit bo'la olmaydi (unhashable type: 'list'), tuple esa o'zgarmas — shuning uchun lug'at kaliti bo'la oladi.",
      lesson: { title: "Lug'atlar (dictionaries)", href: "05-Dictionaries.md" }
    }
  ]
};
