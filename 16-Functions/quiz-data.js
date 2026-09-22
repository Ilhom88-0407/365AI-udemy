window.QUIZ = {
  id: "16",
  title: "Funksiyalar",
  subtitle: "def bilan funksiya e'lon qilish, parametr va argument, print va return farqi, funksiya ichida funksiya, shartlar va ichki funksiyalar",
  next: { label: "Ketma-ketliklar", href: "../17-Sequences/README.md" },
  questions: [
    {
      q: "Darsga ko'ra, def nima?",
      type: "single",
      options: [
        "Funksiyani darrov bajaradigan buyruq",
        "Python'ning ichki funksiyasi",
        "Kalit so'z — u buyruq ham, funksiya ham emas",
        "Funksiya natijasini qaytaradigan operator"
      ],
      answer: [2],
      explain: "def — kalit so'z: u kompyuterga funksiya yaratmoqchi ekaningizni bildiradi. Jupyter uni yashil rangda belgilaydi; natija qaytarish esa return ning ishi.",
      lesson: { title: "Python'da funksiya e'lon qilish", href: "01-Defining-a-Function.md" }
    },
    {
      q: "Bu kod ishga tushirilsa nima bo'ladi?",
      code: "simple()\n\ndef simple():\n    print(\"Salom\")",
      type: "single",
      options: [
        "Salom chiqadi, chunki Python avval barcha def larni o'qib chiqadi",
        "NameError — funksiya chaqirilgan paytda hali e'lon qilinmagan",
        "Hech narsa chiqmaydi, chunki e'lon qilish bajarish emas",
        "IndentationError — chaqiruv chekintirilmagan"
      ],
      answer: [1],
      explain: "Python yuqoridan pastga o'qiydi: simple() qatoriga yetganda bunday nom hali yo'q, shuning uchun NameError chiqadi. Funksiya avval e'lon qilinib, keyin chaqirilishi kerak.",
      lesson: { title: "Python'da funksiya e'lon qilish", href: "01-Defining-a-Function.md" }
    },
    {
      q: "def plus_ten(a): va plus_ten(2) da a va 2 qanday ataladi?",
      type: "single",
      options: [
        "a — argument, 2 — parametr",
        "Ikkalasi ham parametr",
        "Ikkalasi ham argument",
        "a — parametr, 2 — argument"
      ],
      answer: [3],
      explain: "E'londa qavs ichida ko'rsatilgan a — parametr (reja), chaqiruvda beriladigan haqiqiy qiymat 2 — argument.",
      lesson: { title: "Parametrli funksiya yaratish", href: "02-Function-with-a-Parameter.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "def salom(ism):\n    print(\"Salom,\", ism)\n\na = salom(\"Ali\")\nprint(a)",
      type: "single",
      options: [
        "Salom, Ali va keyin None",
        "Salom, Ali va keyin yana Salom, Ali",
        "Faqat None",
        "Faqat Salom, Ali"
      ],
      answer: [0],
      explain: "salom(\"Ali\") chaqirilganda print matnni darrov chiqaradi, lekin funksiyada return yo'q, shuning uchun u None qaytaradi va a ga None tushadi.",
      lesson: { title: "Parametrli funksiya yaratish", href: "02-Function-with-a-Parameter.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "def plus_ten(a):\n    result = a + 10\n    return \"Outcome:\"\n    return result\n\nprint(plus_ten(2))",
      type: "single",
      options: ["12", "Outcome: 12", "Outcome:", "None"],
      answer: [2],
      explain: "return funksiyani darrov tugatadi, shuning uchun faqat birinchi return bajariladi, ikkinchisi o'lik kod. Ikkalasini ham ko'rish uchun print(\"Outcome:\") va keyin return result yozish kerak.",
      lesson: { title: "Funksiyani e'lon qilishning boshqa usuli", href: "03-Another-Way-to-Define-a-Function.md" }
    },
    {
      q: "print va return haqidagi qaysi gaplar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "return bajarilganda funksiya darrov tugaydi",
        "print ning natijasini o'zgaruvchiga saqlab, keyin hisobda ishlatish mumkin",
        "print chiqishning hisoblanishiga ta'sir qilmaydi, u faqat dasturchiga ko'rsatadi",
        "return chiqishni ekranda vizuallashtiradi",
        "Katta kodda oraliq qadamlarni kuzatish uchun print qulay"
      ],
      answer: [0, 2, 4],
      explain: "return qiymatni dasturga qaytaradi va funksiyani tugatadi, lekin uni vizuallashtirmaydi. print esa faqat dasturchiga ko'rsatadi, hisobga ta'sir qilmaydi va uning natijasi None — saqlab bo'lmaydi.",
      lesson: { title: "Funksiyani e'lon qilishning boshqa usuli", href: "03-Another-Way-to-Define-a-Function.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "def wage(w_hours):\n    return w_hours * 25\n\ndef with_bonus(w_hours):\n    return wage(w_hours) + 50\n\nprint(wage(8), with_bonus(8))",
      type: "single",
      options: ["200 250", "200 50", "250 250", "200 200"],
      answer: [0],
      explain: "wage(8) = 8 * 25 = 200. with_bonus(8) avval wage(8) ni chaqiradi va natijaga 50 qo'shadi: 200 + 50 = 250.",
      lesson: { title: "Funksiya ichida funksiya", href: "04-Using-a-Function-in-Another-Function.md" }
    },
    {
      q: "Bir nechta funksiya (bonus, ikki barobar bonus, qo'shimcha ish) wage() ni chaqirib quriladi. Soatlik stavka $25 dan $30 ga o'zgarsa, bu yondashuvning afzalligi nimada?",
      type: "single",
      options: [
        "Funksiyalar avtomatik ravishda yangi stavkani internetdan oladi",
        "Faqat wage funksiyasini tuzatish yetarli — mantiq bir joyda saqlanadi",
        "Har bir funksiyada stavkani alohida o'zgartirish osonroq bo'ladi",
        "Stavka o'zgarsa ham natijalar o'zgarmaydi"
      ],
      answer: [1],
      explain: "Bu DRY (O'zingizni takrorlamang) tamoyili: har bir funksiyada w_hours * 25 ni takrorlasangiz, uchta joyni tuzatishga to'g'ri kelardi.",
      lesson: { title: "Funksiya ichida funksiya", href: "04-Using-a-Function-in-Another-Function.md" }
    },
    {
      q: "Darsdagi add_10(m) funksiyasi m >= 100 bo'lsa m = m + 10 qilib m ni qaytaradi, aks holda \"Save more!\" qaytaradi. add_10(100) nima qaytaradi?",
      type: "single",
      options: ["100", "\"Save more!\"", "120", "110"],
      answer: [3],
      explain: "Shart >= bo'lgani uchun 100 ham chegaraga kiradi: m = 100 + 10 = 110 qaytariladi. \"Save more!\" faqat 100 dan kichik summalarda chiqadi.",
      lesson: { title: "Shartlar va funksiyalarni birlashtirish", href: "05-Combining-Conditionals-and-Functions.md" }
    },
    {
      q: "add_10 ichidagi m = m + 10 qatori haqida qaysi gap to'g'ri?",
      type: "single",
      options: [
        "Bu tenglama, shuning uchun uning yechimi yo'q va xato chiqadi",
        "Bu solishtirish: m va m + 10 teng ekanini tekshiradi",
        "Bu biriktirish: o'ng tomon hisoblanib, natija m ga yoziladi",
        "Bu faqat funksiyadan tashqarida ishlaydi"
      ],
      answer: [2],
      explain: "Tenglik belgisi o'ng tomondagi ifodani chap tomonga biriktiradi: m = 110 bo'lsa, avval 110 + 10 = 120 hisoblanadi, keyin m = 120 bo'ladi.",
      lesson: { title: "Shartlar va funksiyalarni birlashtirish", href: "05-Combining-Conditionals-and-Functions.md" }
    },
    {
      q: "Argumentlar tartibi almashtirilsa nima chiqadi?",
      code: "def subtract_bc(a, b, c):\n    return a - b*c\n\nprint(subtract_bc(2, 3, 10))",
      type: "single",
      options: ["4", "-28", "-4", "TypeError"],
      answer: [1],
      explain: "Pozitsiya bo'yicha a=2, b=3, c=10 bo'ladi: 2 - 3*10 = -28. 4 faqat subtract_bc(10, 3, 2) yoki nomli argumentlar bilan chiqadi.",
      lesson: { title: "Bir necha argumentli funksiyalar", href: "06-Functions-with-a-Few-Arguments.md" }
    },
    {
      q: "def bolish(a, b): return a / b berilgan. Qaysi chaqiruvlar xatosiz ishlaydi? (bir nechta javob)",
      type: "multi",
      options: [
        "bolish(10, 2)",
        "bolish(a=10, 2)",
        "bolish(b=2, a=10)",
        "bolish(10, b=2)",
        "bolish(10, a=2)"
      ],
      answer: [0, 2, 3],
      explain: "Nomli argumentlarda tartib ahamiyatsiz, aralash chaqiruvda esa pozitsiyali argumentlar nomlilardan oldin turishi kerak. bolish(a=10, 2) SyntaxError, bolish(10, a=2) esa a ga ikki qiymat berib TypeError beradi.",
      lesson: { title: "Bir necha argumentli funksiyalar", href: "06-Functions-with-a-Few-Arguments.md" }
    },
    {
      q: "Python 3 da round(2.5) natijasi 3 bo'ladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Python .5 ni eng yaqin juft songa yaxlitlaydi (bankir yaxlitlashi), shuning uchun round(2.5) → 2. Bu ko'p yaxlitlashda xatolik to'planib ketmasligi uchun qilinadi.",
      lesson: { title: "Python'ning muhim ichki funksiyalari", href: "07-Notable-Built-in-Functions.md" }
    },
    {
      q: "Bu kod nima chiqaradi?",
      code: "def distance_from_zero(x):\n    if type(x) == int or type(x) == float:\n        return abs(x)\n    else:\n        print(\"Not possible\")\n\nprint(distance_from_zero(\"cat\"))",
      type: "single",
      options: [
        "Not possible",
        "Not possible va keyin None",
        "TypeError, chunki abs satr bilan ishlamaydi",
        "cat"
      ],
      answer: [1],
      explain: "\"cat\" son emas, shuning uchun else bloki Not possible ni chop etadi. Lekin bu shoxda return yo'q, funksiya None qaytaradi va tashqi print uni ham chiqaradi.",
      lesson: { title: "Python'ning muhim ichki funksiyalari", href: "07-Notable-Built-in-Functions.md" }
    },
    {
      q: "Python 3 da round(3.2) nima qaytaradi?",
      type: "single",
      options: ["3.0", "4", "3", "3.2"],
      answer: [2],
      explain: "Raqamlar soni ko'rsatilmasa u nolga sozlanadi va ikkinchi argumentsiz round() int qaytaradi — 3, 3.0 emas. Kasr natija uchun round(3.555, 2) kabi raqamlar sonini berish kerak.",
      lesson: { title: "Python'ning muhim ichki funksiyalari", href: "07-Notable-Built-in-Functions.md" }
    }
  ]
};
