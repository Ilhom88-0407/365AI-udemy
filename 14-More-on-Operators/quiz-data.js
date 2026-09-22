window.QUIZ = {
  id: "14",
  title: "Operatorlar haqida ko'proq",
  subtitle: "Solishtirish operatorlari, mantiqiy operatorlar (not, and, or), muhimlik tartibi va ayniyat operatorlari (is, is not)",
  next: { label: "Shart operatorlari", href: "../15-Conditional-Statements/README.md" },
  questions: [
    {
      q: "15 >= 10 + 10 ifodasi nima qaytaradi va nima uchun?",
      type: "single",
      options: [
        "True — chunki Python avval 15 >= 10 ni tekshiradi, keyin 10 qo'shadi",
        "False — chunki avval 10 + 10 = 20 hisoblanadi, 15 >= 20 esa yolg'on",
        "TypeError — chunki o'ng tomonda son emas, ifoda turibdi",
        "20 — chunki Python arifmetik natijani qaytaradi"
      ],
      answer: [1],
      explain: "Arifmetika har doim solishtirishdan oldin bajariladi: 10 + 10 = 20, keyin 15 >= 20 tekshiriladi va False chiqadi. O'ng tomonda ifoda bo'lishi mutlaqo normal, qavs shart emas.",
      lesson: { title: "Solishtirish operatorlari", href: "01-Comparison-Operators.md" }
    },
    {
      q: "Quyidagi yozuvlardan qaysilari Python'da to'g'ri solishtirish operatori hisoblanadi? (bir nechta javob)",
      type: "multi",
      options: [">=", "=>", "!=", "=<", "<="],
      answer: [0, 2, 4],
      explain: "To'g'ri yozuv: avval taqqoslash belgisi (> yoki <), keyin tenglik (=). => va =< Python'da yo'q va SyntaxError beradi; != esa teng emaslikni tekshiradi.",
      lesson: { title: "Solishtirish operatorlari", href: "01-Comparison-Operators.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "x = 5\nprint(x == 10)\nprint(x)",
      type: "single",
      options: [
        "True, keyin 10",
        "False, keyin 10",
        "False, keyin 5",
        "SyntaxError"
      ],
      answer: [2],
      explain: "== faqat tekshiradi va x ning qiymatini o'zgartirmaydi: 5 == 10 yolg'on, x esa 5 bo'lib qoladi. Qiymat biriktirish = belgisi bilan qilinadi.",
      lesson: { title: "Solishtirish operatorlari", href: "01-Comparison-Operators.md" }
    },
    {
      q: "Quyidagi kod qanday ishlaydi?",
      code: "print(\"5\" == 5)\nprint(\"5\" > 5)",
      type: "single",
      options: [
        "Avval True chiqadi, keyin False chiqadi",
        "Ikkala qator ham TypeError beradi",
        "Avval False chiqadi, keyin ikkinchi qator TypeError beradi",
        "Avval False, keyin True chiqadi"
      ],
      answer: [2],
      explain: "Turlar mos kelmaganda == va != shunchaki False/True qaytaradi: satr va son teng emas. >, <, >=, <= esa str va int orasida TypeError beradi.",
      lesson: { title: "Solishtirish operatorlari", href: "01-Comparison-Operators.md" }
    },
    {
      q: "0.1 + 0.2 == 0.3 ifodasi Python'da True qaytaradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "0.1 + 0.2 aslida 0.30000000000000004 bo'ladi, shuning uchun natija False. Kasr sonlarni solishtirishda farqni tekshirish kerak: abs(0.1 + 0.2 - 0.3) < 0.000001.",
      lesson: { title: "Solishtirish operatorlari", href: "01-Comparison-Operators.md" }
    },
    {
      q: "Zanjirli solishtirish 10 < 20 < 5 nima beradi?",
      type: "single",
      options: [
        "False — Python buni (10 < 20) and (20 < 5) deb o'qiydi",
        "True — chunki birinchi solishtirish 10 < 20 rost",
        "SyntaxError — bir ifodada ikkita < yozib bo'lmaydi",
        "True — chunki True < 5, ya'ni 1 < 5 rost"
      ],
      answer: [0],
      explain: "Python zanjirli solishtirishni and bilan bog'langan ikki solishtirish deb o'qiydi: 10 < 20 rost, lekin 20 < 5 yolg'on, shuning uchun natija False.",
      lesson: { title: "Solishtirish operatorlari", href: "01-Comparison-Operators.md" }
    },
    {
      q: "Bir ifodada not, and va or birga kelsa, qaysi tartibda bajariladi?",
      type: "single",
      options: [
        "Chapdan o'ngga, yozilgan tartibda",
        "or → and → not",
        "and → or → not",
        "not → and → or"
      ],
      answer: [3],
      explain: "Muhimlik tartibi: birinchi not, keyin and, eng oxirida or. Chapdan o'ngga o'qish ko'p hollarda noto'g'ri natija beradi.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "print(False or not True and True)",
      type: "single",
      options: ["True", "False", "None", "SyntaxError"],
      answer: [1],
      explain: "Avval not True → False, keyin and: False and True → False, oxirida or: False or False → False.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "Talaba ifodani chapdan o'ngga o'qib, natija False deb o'yladi. Aslida kod nima chiqaradi?",
      code: "print(True or False and False)",
      type: "single",
      options: [
        "True — chunki avval False and False hisoblanadi",
        "False — chunki (True or False) and False = False",
        "False — chunki ifodada ikkita False bor",
        "True — chunki or doim True qaytaradi"
      ],
      answer: [0],
      explain: "and or dan muhimroq: avval False and False → False, keyin True or False → True. False olish uchun qavs kerak: (True or False) and False.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "Do'konda chegirma olish uchun talaba yoki nafaqaxo'r bo'lish yetarli. Bu shartni qaysi operator to'g'ri ifodalaydi?",
      type: "single",
      options: [
        "talaba and nafaqaxor",
        "not talaba and nafaqaxor",
        "talaba or nafaqaxor",
        "talaba is nafaqaxor"
      ],
      answer: [2],
      explain: "or kamida bittasi rostligini tekshiradi, shuning uchun bitta shart bajarilsa yetarli. and esa ikkalasi ham rost bo'lishini talab qilardi.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "3 > 5 and 10 <= 20 ifodasi nima uchun False beradi?",
      type: "single",
      options: [
        "and faqat True/False qiymatlar bilan ishlaydi, solishtirish bilan emas",
        "Avval solishtirishlar hisoblanadi: False and True, bu esa False",
        "Python avval 5 and 10 ni hisoblaydi, keyin solishtiradi",
        "10 <= 20 yolg'on bo'lgani uchun butun ifoda yolg'on"
      ],
      answer: [1],
      explain: "Solishtirish operatorlari mantiqiy operatorlardan oldin bajariladi: 3 > 5 → False, 10 <= 20 → True, False and True → False.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "or operatorida ikki gapning tartibi muhim: False or True va True or False turli natija beradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "or da tartib ahamiyatsiz: kamida bittasi rost bo'lsa, natija True. Shuning uchun False or True ham, True or False ham True beradi.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "a = 1000\nb = int(\"1000\")\nprint(a == b)\nprint(a is b)",
      type: "single",
      options: [
        "True, keyin True",
        "False, keyin False",
        "False, keyin True",
        "True, keyin False"
      ],
      answer: [3],
      explain: "== qiymatni tekshiradi, qiymatlar bir xil — True. is esa xotiradagi bitta obyektmi degan savolni beradi; bu yerda ikki alohida obyekt, shuning uchun False.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "is va == haqidagi qaysi gaplar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "== ikki qiymat bir xilligini tekshiradi",
        "Sonlar va satrlarni solishtirishda is ishlatish tavsiya etiladi",
        "is ikkala tomon xotiradagi bitta obyekt ekanini tekshiradi",
        "Zamonaviy Python 5 is 6 kabi literal bilan is uchun SyntaxWarning beradi",
        "l1 = [1, 2, 3] va l2 = [1, 2, 3] bo'lsa, l1 is l2 True bo'ladi"
      ],
      answer: [0, 2, 3],
      explain: "== qiymatni, is esa obyektning o'zini tekshiradi; literal bilan is ishlatilsa SyntaxWarning chiqadi. Mazmuni bir xil ikki ro'yxat alohida obyektlar, shuning uchun l1 is l2 False; sonlar va satrlar uchun doim == ishlatiladi.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    },
    {
      q: "Darsdagi qoidaga ko'ra, is operatorini qaysi holatda ishlatish to'g'ri?",
      type: "single",
      options: [
        "soni is 5 — sonni tekshirishda",
        "x is None — qiymat None ekanini tekshirishda",
        "ism is \"Ali\" — satrni tekshirishda",
        "l1 is [1, 2, 3] — ro'yxat mazmunini tekshirishda"
      ],
      answer: [1],
      explain: "is ni faqat None, True, False bilan ishlatish tavsiya etiladi, masalan x is None yoki x is not None. Sonlar, satrlar va ro'yxatlar uchun == va != ishlatiladi.",
      lesson: { title: "Mantiqiy va ayniyat operatorlari", href: "02-Logical-and-Identity-Operators.md" }
    }
  ]
};
