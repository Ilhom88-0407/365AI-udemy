window.QUIZ = {
  id: "68",
  title: "AI va ma'lumot etikasiga kirish",
  subtitle: "Kurs rejasi, AI hayot sikli va etik audit, nega etika muhim, etika va qonun farqi",
  next: { label: "AI etikasining asosiy prinsiplari", href: "../69-Core-Principles-of-AI-Ethics/README.md" },
  questions: [
    {
      q: "Nega AI etikasi bo'limi kursning oxirida, ilova qurilgandan keyin turadi?",
      type: "single",
      options: [
        "Chunki etika texnik bo'lmagan mavzu va uni o'tkazib yuborsa ham bo'ladi",
        "Chunki endi nimani qurayotganingizni bilasiz va oqibatlarini ham tushunasiz",
        "Chunki etik qoidalar faqat ilova joylashtirilgandan keyin kuchga kiradi",
        "Chunki etika bo'yicha qonunlar faqat tayyor mahsulotlarga taalluqli"
      ],
      answer: [1],
      explain: "Oldingi modullarda ishlaydigan ilova qurildi; endi siz nimani qurganingizni bilasiz, shuning uchun oqibatlarini tushunib, o'sha ilovani audit qila olasiz.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "01-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Ulrich Bekning \"etika — kontinentlararo samolyotdagi velosiped tormozi\" degan metaforasi nimani anglatadi?",
      type: "single",
      options: [
        "Etika texnologiyani butunlay to'xtatib qo'yadigan kuchli vosita",
        "Etika faqat kichik va sekin loyihalar uchun kerak bo'ladi",
        "Texnologiya juda tez harakatlanadi, etika esa uni to'xtatishga ojiz",
        "Samolyot kabi katta tizimlarda etik qoidalar keraksiz bo'lib qoladi"
      ],
      answer: [2],
      explain: "Texnologiya samolyot tezligida rivojlanadi, etik cheklovlar esa velosiped tormozi kabi zaif. Kurs buni keyinchalik 7.5 yillik qonun bo'shlig'i bilan tasdiqlaydi.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "01-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Etik risk registrida risk darajasi qanday chiqadi?",
      code: "r = EtikRisk(\"to'plash\", \"Ism promptga tushadi\", 3, 4, \"adolat\")\n# ball = ehtimol * ta_sir\n# >=16 KRITIK, >=9 YUQORI, >=4 O'RTA, aks holda PAST\nprint(r.ball, r.daraja)",
      type: "single",
      options: [
        "7 ⭐ O'RTA",
        "12 💥 KRITIK",
        "12 ⚠️ YUQORI",
        "16 💥 KRITIK"
      ],
      answer: [2],
      explain: "Ball ehtimol va ta'sir ko'paytmasi: 3 × 4 = 12. Bu 9 dan katta, lekin 16 dan kichik, shuning uchun daraja YUQORI bo'ladi.",
      lesson: { title: "Kurs nimalarni qamrab oladi", href: "01-What-Does-the-Course-Cover.md" }
    },
    {
      q: "Kurs AI hayot siklining olti bosqichini uchta etik toifaga guruhlaydi. Qaysi moslik to'g'ri?",
      type: "single",
      options: [
        "Etik to'plash — to'plash va o'qitish; etik ishlab chiqish — baholash va joylashtirish",
        "Etik to'plash — faqat to'plash; etik joylashtirish — qolgan besh bosqich",
        "Etik ishlab chiqish — tayyorlash va o'qitish; etik joylashtirish — baholash va monitoring",
        "Etik to'plash — to'plash va tayyorlash; etik ishlab chiqish — o'qitish va baholash"
      ],
      answer: [3],
      explain: "Etik to'plash 1+2 bosqich, etik ishlab chiqish 3+4, etik joylashtirish esa 5+6 (joylashtirish va monitoring). Har bir toifa alohida modulda ko'riladi: 70, 71, 72.",
      lesson: { title: "AI hayot sikli", href: "02-The-AI-Lifecycle.md" }
    },
    {
      q: "Uchta etik toifa har biri qaysi asosiy savolga javob izlaydi? (bir nechta javob)",
      type: "multi",
      options: [
        "Etik ma'lumot to'plash — ma'lumot qayerdan?",
        "Etik ishlab chiqish — kimga zarar?",
        "Etik joylashtirish — kim javobgar?",
        "Etik joylashtirish — ma'lumot qayerdan?",
        "Etik ishlab chiqish — kim javobgar?"
      ],
      answer: [0, 1, 2],
      explain: "Darsdagi jadvalga ko'ra: to'plash — \"qayerdan?\", ishlab chiqish — \"kimga zarar?\", joylashtirish — \"kim javobgar?\".",
      lesson: { title: "AI hayot sikli", href: "02-The-AI-Lifecycle.md" }
    },
    {
      q: "Etik auditda ✅ 3, 💥 9, ⚠️ 4 chiqdi. Darsga ko'ra nega ⚠️ belgisi 💥 dan ham xavfliroq?",
      type: "single",
      options: [
        "⚠️ da muammo bor-yo'qligi ham noma'lum, 💥 da esa kamida muammoni bilasiz",
        "⚠️ qonun buzilganini bildiradi, 💥 esa faqat etik kamchilikni ko'rsatadi",
        "⚠️ tuzatib bo'lmaydigan, 💥 esa oson tuzatiladigan muammolarga qo'yiladi",
        "⚠️ tayyorlik foizini 💥 dan ikki barobar ko'p kamaytiradi, shuning uchun og'irroq"
      ],
      answer: [0],
      explain: "⚠️ — \"bilmaymiz\" degani. Birinchi qadam uni o'lchab, ✅ yoki 💥 ga aylantirish.",
      lesson: { title: "AI hayot sikli", href: "02-The-AI-Lifecycle.md" }
    },
    {
      q: "67-modulda \"ishonchli\" deb atalgan ilova etik auditda 16 savoldan atigi 3 tasidan o'tdi (18.8%). Bu qanday xulosaga olib keladi?",
      type: "single",
      options: [
        "JSON va injection tuzatishlari noto'g'ri bajarilgan",
        "Texnik ishonchlilik etik tayyorlik degani emas",
        "Audit savollari juda qattiq tanlangan, ularni kamaytirish kerak",
        "Ilova faqat monitoring bosqichida muammoli"
      ],
      answer: [1],
      explain: "JSON tuzatildi, injection bloklandi, zaxira qo'yildi — lekin \"qaror ustidan shikoyat qilish mumkinmi?\" kabi savollar umuman berilmagan edi. Muammolar barcha bosqichlarda chiqdi.",
      lesson: { title: "AI hayot sikli", href: "02-The-AI-Lifecycle.md" }
    },
    {
      q: "Monitoring hayot siklining alohida bosqichi. Buning asosiy sababi — model drift: vaqt o'tishi bilan model eskirib, hatto zarar keltirishi mumkin.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Kurs ta'kidlaydi: sikl joylashtirish bilan tugamaydi. Bozor va texnologiya o'zgaradi, shuning uchun har model uchun \"qachon qayta ko'rib chiqamiz?\" sanasi bo'lishi kerak.",
      lesson: { title: "AI hayot sikli", href: "02-The-AI-Lifecycle.md" }
    },
    {
      q: "Grok chatboti basketbol jargonidagi \"throwing bricks\" iborasini so'zma-so'z tushunib, Klay Thompsonni uylarni g'isht bilan buzganlikda aybladi. Bu qanday muammo?",
      type: "single",
      options: [
        "Rozilikning vaqt bilan eskirish muammosi",
        "Ma'lumotni rozilliksiz yig'ish (scraping)",
        "Ish o'rinlarining AI tufayli yo'qolishi",
        "Kontekstni yo'qotish (gallyutsinatsiya)"
      ],
      answer: [3],
      explain: "Chatbot o'yin haqidagi iborani jinoyat haqida deb tushundi. Bu real odam haqida yolg'on ayblov bo'lgani uchun kulgili emas, jiddiy muammo.",
      lesson: { title: "Nega AI etikasi hozir muhimroq", href: "03-Why-AI-Ethics-Matter.md" }
    },
    {
      q: "Greg Marston 2003-yilda IBM bilan shartnoma imzolagan, yillar keyin o'z ovozining AI klonini topgan. Bu hodisa qanday tamoyilni ko'rsatadi?",
      type: "single",
      options: [
        "Ovoz aktyorlari shartnomani o'qimasdan imzolaydi",
        "Rozilik kelajakdagi texnologiyalarni qamrab ololmaydi",
        "AI klonlari har doim sifatsiz bo'ladi",
        "Kompaniyalar huquqlarni sotishi qonun bilan taqiqlangan"
      ],
      answer: [1],
      explain: "Shartnoma imzolanganda ovoz klonlash texnologiyasi mavjud emas edi. Yechim — yangi maqsad uchun qayta rozilik so'rash.",
      lesson: { title: "Nega AI etikasi hozir muhimroq", href: "03-Why-AI-Ethics-Matter.md" }
    },
    {
      q: "Clearview AI Fransiya, Italiya va Niderlandiyadan $30 mln dan ortiq jarima oldi. Darsga ko'ra jarima aslida nima uchun solingan?",
      type: "single",
      options: [
        "Ma'lumot uchun — rasmlar rozilliksiz, sayt siyosatiga zid yig'ilgan",
        "Model yomon ishlagani va odamlarni noto'g'ri tanigani uchun",
        "Kompaniya Yevropadagi daromadidan soliq to'lamagani uchun",
        "Yuz tanish texnologiyasining o'zi Yevropada taqiqlangani uchun"
      ],
      answer: [0],
      explain: "Model ishlagan edi — jarima ma'lumot uchun. Bu 70-modul mavzusiga olib keladi: AI ni etik ishlatish uni etik qurishdan boshlanadi.",
      lesson: { title: "Nega AI etikasi hozir muhimroq", href: "03-Why-AI-Ethics-Matter.md" }
    },
    {
      q: "Rozilik siyosati auditi nima chiqaradi?",
      code: "TALAB = [\"saqlash_muddati\", \"maqsad\", \"taqiqlangan\",\n         \"o'chirish_huquqi\", \"yangi_maqsad_uchun\",\n         \"uchinchi_tomonlar\", \"bolalar_uchun\"]\nsiyosat = {\"saqlash_muddati\": \"30 kun\", \"maqsad\": [],\n           \"taqiqlangan\": [], \"o'chirish_huquqi\": True,\n           \"yangi_maqsad_uchun\": \"QAYTA rozilik so'raladi\"}\nyo_q = [t for t in TALAB if t not in siyosat]\nball = (len(TALAB) - len(yo_q)) / len(TALAB) * 100\nprint(f\"{ball:.0f}%\", yo_q)",
      type: "single",
      options: [
        "100% []",
        "71% ['uchinchi_tomonlar', 'bolalar_uchun']",
        "29% ['uchinchi_tomonlar', 'bolalar_uchun']",
        "43% ['maqsad', 'taqiqlangan', 'uchinchi_tomonlar', 'bolalar_uchun']"
      ],
      answer: [1],
      explain: "Yettita talabdan beshtasi bor: 5/7 × 100 ≈ 71%. Kim bilan bo'lishilishi va 18 yoshgacha bo'lganlar uchun qoida yetishmaydi.",
      lesson: { title: "Nega AI etikasi hozir muhimroq", href: "03-Why-AI-Ethics-Matter.md" }
    },
    {
      q: "Qonun va etikaning farqi haqida qaysi gaplar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Qonun majburiy, etika majburiy emas",
        "Qonun sekin o'zgaradi, etika tezroq moslashadi",
        "Etika davlat tomonidan yaratiladi, qonun esa kasb hamjamiyati tomonidan",
        "Qonun bo'shlig'ida etika yo'l ko'rsatadi",
        "GDPR ga rioya qilish avtomatik ravishda etik bo'lishni anglatadi"
      ],
      answer: [0, 1, 3],
      explain: "Qonunni davlat yaratadi, u majburiy, lekin sekin. Etika tezroq va nozik holatlarni qamraydi. Qonun minimal daraja, shuning uchun GDPR ga rioya qilish hali etik bo'lish degani emas.",
      lesson: { title: "Etika va qonun", href: "04-Ethics-vs-Laws.md" }
    },
    {
      q: "Quyidagi kod nima chiqaradi?",
      code: "def qaysi_ramka(v):\n    if v.get(\"qonun_bor\"):\n        return \"QONUN\"\n    if v.get(\"sanoat_standarti\"):\n        return \"STANDART\"\n    return \"ETIKA\"\n\nprint(qaysi_ramka({}), qaysi_ramka({\"sanoat_standarti\": True}))",
      type: "single",
      options: [
        "QONUN STANDART",
        "STANDART ETIKA",
        "ETIKA ETIKA",
        "ETIKA STANDART"
      ],
      answer: [3],
      explain: "Bo'sh lug'atda hech qanday kalit yo'q, shuning uchun ETIKA qaytadi (O'zbekistondagi intervyu boti holati). Ikkinchisida faqat sanoat standarti bor — STANDART.",
      lesson: { title: "Etika va qonun", href: "04-Ethics-vs-Laws.md" }
    },
    {
      q: "\"I, Robot\" filmida robot omon qolish ehtimoli yuqori bo'lgan Spoonerni qutqaradi, inson esa bolani birinchi qo'yardi. Dars bu sahnadan qanday xulosa chiqaradi?",
      type: "single",
      options: [
        "Robot to'g'ri qildi, chunki ehtimolni maksimallashtirish yagona to'g'ri yo'l",
        "Inson to'g'ri, chunki deontologiya bunday holatda utilitarizmdan ustun turadi",
        "Noto'g'ri javob yo'q — utilitarizm va deontologiya turli qadriyatlarni ifodalaydi",
        "Robot qonunni buzdi, chunki bolalarni birinchi qutqarish qonunda belgilangan"
      ],
      answer: [2],
      explain: "\"Ehtimolni maksimallashtir\" va \"zaifni himoya qil\" — ikki xil qadriyat. Ilovadagi teng muomala va teng imkoniyat tanlovi ham shunday: u ongli qaror bo'lishi kerak.",
      lesson: { title: "Etika va qonun", href: "04-Ethics-vs-Laws.md" }
    }
  ]
};
