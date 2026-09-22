window.QUIZ = {
  id: "13",
  title: "Python ning asosiy sintaksisi",
  subtitle: "Arifmetik operatorlar, = va == farqi, qayta biriktirish, izohlar, qator davomi, indekslash va chekinish",
  next: { label: "Operatorlar haqida ko'proq", href: "../14-More-on-Operators/README.md" },
  questions: [
    {
      q: "Python 3 da bu kod nima chiqaradi?",
      code: "print(15 / 3)\nprint(16 % 3)",
      type: "single",
      options: ["5 va 1", "5.0 va 5", "5.0 va 1", "5 va 5.333333333333333"],
      answer: [2],
      explain: "Python 3 da / operatori doim float qaytaradi, hatto qoldiqsiz bo'linishda ham — 5.0. % esa bo'lish qoldig'ini beradi: 16 = 5 × 3 + 1.",
      lesson: { title: "Arifmetik operatorlar", href: "01-Arithmetic-Operators.md" }
    },
    {
      q: "Qaysi operator tavsiflari to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "// — butun bo'lish: 16 // 3 natijasi 5",
        "% — foizni hisoblaydi: 16 % 3 natijasi 0.16",
        "** — darajaga ko'tarish: 5 ** 3 natijasi 125",
        "/ — Python 3 da 15 / 3 natijasi int turidagi 5"
      ],
      answer: [0, 2],
      explain: "// butun qismni, ** darajani beradi. % foiz emas, qoldiq operatori; / esa Python 3 da doim float qaytaradi (5.0).",
      lesson: { title: "Arifmetik operatorlar", href: "01-Arithmetic-Operators.md" }
    },
    {
      q: "Eski Python 2 kodida float(16) / 3 deb yozilgan. Python 3 uchun qaysi gap to'g'ri?",
      type: "single",
      options: [
        "float() shart emas: 16 / 3 ning o'zi ham 5.333333333333333 beradi",
        "float() majburiy, aks holda 16 / 3 natijasi 5 bo'ladi",
        "float(16) / 3 Python 3 da SyntaxError beradi",
        "16 / 3 faqat 16.0 / 3 ko'rinishida yozilsa float bo'ladi"
      ],
      answer: [0],
      explain: "Python 2 da 16 / 3 qoldiqsiz 5 berardi, shuning uchun float() qo'shilgan. Python 3 da / darrov float natija beradi, float(16) / 3 esa xuddi shu natijani beradi.",
      lesson: { title: "Arifmetik operatorlar", href: "01-Arithmetic-Operators.md" }
    },
    {
      q: "y = 5 ** 3 dan keyin y == 125 bajarildi. Kompyuter bu buyruqni qanday tushunadi?",
      type: "single",
      options: [
        "y ga 125 qiymatini qayta biriktirish buyrug'i sifatida",
        "\"y rostdan 125 ga tengmi?\" degan savol sifatida — javobi True yoki False",
        "y ning turini tekshirish buyrug'i sifatida — javobi int",
        "5 ** 3 ni qayta hisoblash va natijani chop etish sifatida"
      ],
      answer: [1],
      explain: "== qiymatlar tengligini tekshiradi va doim Boolean qiymat — True yoki False — qaytaradi. Biriktirish uchun bitta = ishlatiladi.",
      lesson: { title: "Ikki tenglik belgisi ==", href: "02-The-Double-Equality-Sign.md" }
    },
    {
      q: "Bu kod oxirida nimani chop etadi?",
      code: "narx = 5000\nnarx == 6000\nprint(narx)",
      type: "single",
      options: ["6000", "False", "True", "5000"],
      answer: [3],
      explain: "narx == 6000 faqat savol beradi (natijasi False), lekin narx ni o'zgartirmaydi. Yangi qiymat berish uchun narx = 6000 yozish kerak edi.",
      lesson: { title: "Ikki tenglik belgisi ==", href: "02-The-Double-Equality-Sign.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "z = 1\nz = 3\nprint(z + 5)\nprint(z)",
      type: "single",
      options: ["6 va 1", "8 va 8", "6 va 3", "8 va 3"],
      answer: [3],
      explain: "Oxirgi buyruq amal qiladi: z endi 3, shuning uchun z + 5 = 8. Lekin z + 5 faqat hisoblaydi, z ni o'zgartirmaydi — z hali ham 3.",
      lesson: { title: "Qiymatlarni qayta biriktirish", href: "03-Reassign-Values.md" }
    },
    {
      q: "Jupyter'da [1] yacheykada z = 1, [2] yacheykada z = 3 bajarildi. Keyin [1] yacheyka qayta ishga tushirildi. Endi print(z) nima beradi?",
      type: "single",
      options: [
        "3, chunki fayldagi oxirgi qator z = 3",
        "1, chunki oxirgi bajarilgan buyruq z = 1",
        "4, chunki ikkala qiymat qo'shiladi",
        "NameError, chunki z ikki marta biriktirilgan"
      ],
      answer: [1],
      explain: "Jupyter'da \"oxirgi buyruq\" — fayldagi oxirgi qator emas, bajarilgan oxirgi qator. Shu sabab Restart & Run All muhim.",
      lesson: { title: "Qiymatlarni qayta biriktirish", href: "03-Reassign-Values.md" }
    },
    {
      q: "Qo'shtirnoq ichidagi # belgisi ham izoh boshlaydi, shuning uchun print(\"# Bu-chi?\") hech narsa chiqarmaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "# faqat kod ichida izoh boshlaydi. Qo'shtirnoq ichidagi # — satrning oddiy belgisi, shuning uchun # Bu-chi? chop etiladi.",
      lesson: { title: "Izohlar qo'shish", href: "04-Add-Comments.md" }
    },
    {
      q: "Darsdagi qoidaga ko'ra qaysi izoh yaxshi izoh hisoblanadi?",
      type: "single",
      options: [
        "narx = 5000  # narx 5000 ga teng",
        "soni = soni + 1  # soni ga 1 qo'shamiz",
        "chegirma = narx * 0.15  # doimiy mijozlar uchun 15% chegirma",
        "chegirma = narx * 0.15  # narxni 0.15 ga ko'paytiramiz"
      ],
      answer: [2],
      explain: "Kod NIMA qilishini o'zi ko'rsatadi, izoh esa NIMA UCHUN qilinayotganini tushuntirishi kerak. Qolgan izohlar kodni shunchaki takrorlaydi.",
      lesson: { title: "Izohlar qo'shish", href: "04-Add-Comments.md" }
    },
    {
      q: "Jupyter yacheykasida bu kod bajarilsa, chiqishda nima ko'rinadi?",
      code: "15 + 31\n- 26",
      type: "single",
      options: ["20", "46", "-26", "SyntaxError"],
      answer: [2],
      explain: "Backslash bo'lmagani uchun Python buni ikkita alohida ifoda deb o'qiydi va Jupyter oxirgisini (-26) ko'rsatadi. 15 + 31 \\ deb yozilsa, bitta ifoda bo'lib 20 chiqadi.",
      lesson: { title: "Qator davomi (line continuation)", href: "05-Line-Continuation.md" }
    },
    {
      q: "Qator oxiridagi backslash (\\) dan keyin tasodifan bitta bo'sh joy qoldi. Nima bo'ladi va darsda qaysi muqobil tavsiya etiladi?",
      type: "single",
      options: [
        "Python bo'sh joyni e'tiborsiz qoldiradi; muqobil kerak emas",
        "SyntaxError chiqadi; ifodani qavslar ichiga olish xavfsizroq",
        "Ikkinchi qator izohga aylanadi; # qo'yish tavsiya etiladi",
        "IndentationError chiqadi; tab ishlatish tavsiya etiladi"
      ],
      answer: [1],
      explain: "\\ qator oxiridagi eng oxirgi belgi bo'lishi shart, aks holda SyntaxError. Qavslar (), [], {} ichida qator davomi avtomatik ishlaydi va ko'rinmas bo'sh joy xavfli emas.",
      lesson: { title: "Qator davomi (line continuation)", href: "05-Line-Continuation.md" }
    },
    {
      q: "soz = \"Friday\" bo'lsa, qaysi ifodalar 'F' qaytaradi? (bir nechta javob)",
      type: "multi",
      options: ["soz[0]", "soz[1]", "soz[-6]", "soz[6]", "soz[-1]"],
      answer: [0, 2],
      explain: "Python'da sanash noldan boshlanadi, shuning uchun birinchi belgi soz[0]. Manfiy indeks oxiridan sanaydi: 6 belgili satrda soz[-6] ham birinchi belgi. soz[-1] — 'y', soz[6] esa IndexError.",
      lesson: { title: "Elementlarni indekslash", href: "06-Indexing-Elements.md" }
    },
    {
      q: "soz = \"Salom\" uchun print(soz[5]) IndexError berdi. Sababi nima?",
      type: "single",
      options: [
        "Satrlarni indekslab bo'lmaydi, faqat ro'yxatlarni",
        "Indeks kvadrat emas, oddiy qavsda yozilishi kerak",
        "5 ta belgi bor, indekslar 0 dan 4 gacha — 5 chegaradan tashqarida",
        "Manfiy indeks ishlatilmagani uchun"
      ],
      answer: [2],
      explain: "n ta belgili satrda oxirgi indeks n - 1. \"Salom\" ning oxirgi belgisi soz[4] yoki soz[-1] bilan olinadi.",
      lesson: { title: "Elementlarni indekslash", href: "06-Indexing-Elements.md" }
    },
    {
      q: "Bu kod bajarilganda nima chiqadi?",
      code: "def five(x):\n    x = 5\n    return x\n    print(five(3))",
      type: "single",
      options: [
        "5",
        "3",
        "IndentationError",
        "Hech narsa chiqmaydi"
      ],
      answer: [3],
      explain: "print chekinish bilan funksiya ichida turibdi (yana return'dan keyin), shuning uchun u faqat funksiya chaqirilganda bajarilishi mumkin edi. print ni def bilan tekislab chiqarsangiz, 5 chiqadi.",
      lesson: { title: "Chekinish (indentation)", href: "07-Indentation.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "def test(x):\n    x = 100\n    return x\n\nprint(test(5))",
      type: "single",
      options: ["5", "100", "105", "Hech narsa chiqmaydi"],
      answer: [1],
      explain: "print chekinishsiz — u funksiyadan tashqarida o'zicha bajariladi. Funksiya ichida x = 100 kelgan argumentni qayta biriktirib ustiga yozadi, shuning uchun natija 100.",
      lesson: { title: "Chekinish (indentation)", href: "07-Indentation.md" }
    }
  ]
};
