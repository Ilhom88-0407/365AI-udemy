window.QUIZ = {
  id: "06",
  title: "Generativ AI dagi amaliy qiyinchiliklar",
  subtitle: "Gallyutsinatsiya va izchilsizlik, budjet va API narxlari, latency hamda ma'lumot tugab qolishi muammosi",
  next: { label: "AI tech stack", href: "../07-The-AI-tech-stack/README.md" },
  questions: [
    {
      q: "Siz ChatGPT'ga bir xil savolni ikki xil sessiyada berdingiz: birida aqlli, ikkinchisida ancha zaif javob oldingiz. Darsga ko'ra bu qanday hodisa va uning sababi nima?",
      type: "single",
      options: [
        "Gallyutsinatsiya — model boshidanoq faktik noto'g'ri ma'lumotda o'qitilgani uchun",
        "Izchilsizlik — tashqi hostlangan modelni ishlatuvchi apparat farqlari tufayli",
        "Gallyutsinatsiya — model keyingi so'zni bashorat qilishda adashgani uchun",
        "Izchilsizlik — foydalanuvchi promptni ikki marta bir xil yoza olmagani uchun"
      ],
      answer: [1],
      explain: "Bir xil savolga juda farqli javoblar — bu inconsistency. Uning sababi modelni ishlatuvchi apparatdagi farqlar yoki boshqa nazoratsiz omillar, ayniqsa model tashqarida hostlanganda. Gallyutsinatsiya esa noto'g'ri chiqishning o'zi.",
      lesson: { title: "Izchilsizlik va gallyutsinatsiya", href: "01-Inconsistency-and-hallucination.md" }
    },
    {
      q: "Darsga ko'ra gallyutsinatsiyalarga qarshi qaysi prompt engineering taktikasi qonuniy va ba'zan foydali hisoblanadi?",
      type: "single",
      options: [
        "\"Vaqt ol, javob berishga shoshilma\" deb ko'rsatma berish",
        "Bir xil savolni javob o'zgarmaguncha qayta-qayta yuborish",
        "\"Faqat javobni bilsang, javob ber\" deb ko'rsatma berish",
        "Modeldan javobni imkon qadar uzun va batafsil yozishni so'rash"
      ],
      answer: [2],
      explain: "\"Provide an answer only if you know the answer\" ko'rsatmasi gallyutsinatsiyaga qarshi taktika sifatida keltiriladi. \"Vaqt ol\" esa izchilsizlik uchun aytilgan va isbotlanmagan usul.",
      lesson: { title: "Izchilsizlik va gallyutsinatsiya", href: "01-Inconsistency-and-hallucination.md" }
    },
    {
      q: "Darsda gallyutsinatsiyaning qaysi sabablari keltirilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "Model keyingi so'zni ehtimollik bilan bashorat qiladi va ba'zan adashadi",
        "Modelni ishlatuvchi serverlar va apparat har bir sessiyada bir xil bo'lmaydi",
        "Foydalanuvchi modelga \"vaqt ol, shoshilma\" deb ko'rsatma bermagan bo'ladi",
        "Model boshidanoq faktik noto'g'ri ma'lumotda o'qitilgan bo'lishi mumkin",
        "Model internetsiz, faqat mahalliy kompyuterda ishga tushirilgan bo'ladi"
      ],
      answer: [0, 3],
      explain: "Gallyutsinatsiyaning ikki sababi: keyingi so'z bashorati kafolat emas va noto'g'ri training data (garbage in, garbage out). Apparat farqlari va tashqi hosting esa izchilsizlik sabablari.",
      lesson: { title: "Izchilsizlik va gallyutsinatsiya", href: "01-Inconsistency-and-hallucination.md" }
    },
    {
      q: "To'g'rimi: AI ga \"vaqt ol\" deb ko'rsatma berish izchilsizlikni yo'qotishning isbotlangan usuli hisoblanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Ma'ruzachi bu usulni ochiqchasiga isbotlanmagan (unproven) deb ataydi: faqat model shoshilmaydi va har bir promptga ko'proq apparat resursi ajraladi, degan umid bor.",
      lesson: { title: "Izchilsizlik va gallyutsinatsiya", href: "01-Inconsistency-and-hallucination.md" }
    },
    {
      q: "Darsdagi kutubxona analogiyasida kutubxona va o'quvchining o'rganish quvvati nimani ifodalaydi?",
      type: "single",
      options: [
        "Kutubxona — hisoblash quvvati, o'quvchining quvvati — budjet",
        "Kutubxona — model hajmi, o'quvchining quvvati — dataset",
        "Kutubxona — API narxi, o'quvchining quvvati — latency",
        "Kutubxona — katta dataset, o'quvchining quvvati — model hajmi"
      ],
      answer: [3],
      explain: "Sifatli kitoblar ko'p bo'lsa, ko'proq o'rganish mumkin — bu dataset. Ko'proq eslab qola oladigan o'quvchi esa ko'p parametrli kattaroq model: u murakkabroq naqshlarni ushlaydi.",
      lesson: { title: "Budjetlashtirish va API narxlari", href: "02-Budgeting-and-API-costs.md" }
    },
    {
      q: "Jamoangiz yangi AI model qurmoqchi. Darsga ko'ra budjetlashtirishning to'g'ri yo'li qaysi va nega?",
      type: "single",
      options: [
        "Budjetni oldindan ma'lumot va hisoblash quvvatiga taqsimlash, chunki ko'pchilik qayta urinishga qodir emas",
        "Avval modelni qurib, hajm va narxni o'qitish davomida aniqlash, chunki natijani oldindan bilib bo'lmaydi",
        "Butun budjetni eng katta modelga sarflash, chunki parametri ko'p model har doim eng yaxshi natija beradi",
        "Butun budjetni faqat hisoblash quvvatiga sarflash, chunki o'quv ma'lumotini har doim bepul topish mumkin"
      ],
      answer: [0],
      explain: "GPT-4 ni o'qitish $100 milliondan ortiq turgan, shuning uchun ko'p tashkilot birinchi urinishda muvaffaqiyat qozonishi shart. Budjetni oldindan ko'rib, ma'lumot sotib olish va hisoblash quvvatiga taqsimlash kerak.",
      lesson: { title: "Budjetlashtirish va API narxlari", href: "02-Budgeting-and-API-costs.md" }
    },
    {
      q: "Katta model narxlari bo'yicha ishlatish (inference) xarajatini hisoblovchi bu kod nima chiqaradi?",
      code: "KIRISH_TOKEN = 500\nCHIQISH_TOKEN = 300\nk_narx, ch_narx = 0.030, 0.060   # $ / 1000 token\nbitta = (KIRISH_TOKEN/1000)*k_narx + (CHIQISH_TOKEN/1000)*ch_narx\njami = bitta * 1_000_000\nprint(f\"{jami:,.0f}\")",
      type: "single",
      options: [
        "90,000",
        "33,000",
        "3,300",
        "15,000"
      ],
      answer: [1],
      explain: "Bitta so'rov: 0.5 × 0.030 + 0.3 × 0.060 = 0.015 + 0.018 = $0.033. Million so'rovda bu $33,000 — model bir marta o'qitiladi, lekin millionlab marta ishlatiladi va har bir so'rov pul turadi.",
      lesson: { title: "Budjetlashtirish va API narxlari", href: "02-Budgeting-and-API-costs.md" }
    },
    {
      q: "Darsga ko'ra qaysi holatda kichikroq model qurish mantiqiyroq?",
      type: "single",
      options: [
        "Model iloji boricha ko'p sohada umumiy maqsadli, universal ishlashi kerak bo'lganda",
        "Kompaniya birinchi urinishdayoq eng yuqori unumdorlik va aniqlikka erishmoqchi bo'lganda",
        "Tor vazifa uchun model tez-tez qayta o'qitilishi va fine-tune qilinishi kerak bo'lganda",
        "Tashkilotda ma'lumot va hisoblash quvvati uchun deyarli cheklanmagan budjet bo'lganda"
      ],
      answer: [2],
      explain: "Katta model faqat maqsad va resurslarga mos sezilarli samaradorlik o'sishi bersa oqlanadi. Cheklangan qo'llanishlar uchun kichik ixtisoslashgan modellarni o'qitish arzonroq va tezroq.",
      lesson: { title: "Budjetlashtirish va API narxlari", href: "02-Budgeting-and-API-costs.md" }
    },
    {
      q: "Latency nuqtai nazaridan bugungi LLM larning eng katta muammosi nimada?",
      type: "single",
      options: [
        "Ular so'rovni ko'p serverlar orasida parallel bo'lib, natijani kechiktiradi",
        "Ular avval butun javobni tayyorlab, keyin uni bir yo'la yuboradi",
        "Ular har bir so'rovda butun training data'ni qaytadan o'qib chiqadi",
        "Autoregressive arxitekturada har bir so'z oldingi so'zlar tugashini kutadi"
      ],
      answer: [3],
      explain: "Autoregressive modelda har bir generatsiya qilingan so'z o'zidan oldingi so'zlarga bog'liq, shuning uchun jarayon ketma-ket bo'ladi va tezlik cheklanadi. Parallel hisoblash aksincha yechim sifatida o'rganilmoqda.",
      lesson: { title: "Latency (kechikish)", href: "03-Latency.md" }
    },
    {
      q: "So'ziga 0.2 soniya ketadigan autoregressive generatsiyani simulyatsiya qiluvchi bu kod nima chiqaradi?",
      code: "sozlar = \"my favorite sport is basketball\".split()\nvaqt = 0.0\nfor s in sozlar:\n    vaqt += 0.2\nprint(f\"{vaqt:.1f}\")",
      type: "single",
      options: [
        "0.2",
        "0.8",
        "1.0",
        "5.0"
      ],
      answer: [2],
      explain: "Jumlada 5 so'z bor va har biri ketma-ket 0.2 soniya qo'shadi: 5 × 0.2 = 1.0 soniya. Ma'ruzadagi hisob ham aynan shu — 500 so'zli javob esa 100 soniya olardi.",
      lesson: { title: "Latency (kechikish)", href: "03-Latency.md" }
    },
    {
      q: "AI ilovangiz javobni juda sekin beryapti. Darsga ko'ra darhol amal qiladigan samarali strategiya qaysi?",
      type: "single",
      options: [
        "Model hajmini kamaytirib, kichikroq va tezroq modelga o'tish",
        "Yangi turdagi tezkor arxitekturani noldan ishlab chiqishni boshlash",
        "Modelni kattaroq qilib, unga ko'proq parametr va qatlam qo'shish",
        "Promptga \"tezroq va qisqaroq javob ber\" degan ko'rsatmani qo'shish"
      ],
      answer: [0],
      explain: "Kichikroq modellar ko'pincha kattaroq hamkasblaridan tezroq, bu darhol ishlaydigan yechim. Yangi arxitekturalar va parallel hisoblash esa tadqiqot bosqichida va yillar oladi.",
      lesson: { title: "Latency (kechikish)", href: "03-Latency.md" }
    },
    {
      q: "To'g'rimi: streaming (javobni bo'lak-bo'lak ko'rsatish) modelning javobni generatsiya qilish vaqtini haqiqatda qisqartiradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Streaming — psixologik yechim: foydalanuvchi birinchi so'zni darrov ko'radi va kutish yengilroq tuyuladi, lekin umumiy generatsiya vaqti o'zgarmaydi. Uning ta'siri faktik emas, his qilinadigan.",
      lesson: { title: "Latency (kechikish)", href: "03-Latency.md" }
    },
    {
      q: "Internetdagi yangi maqolalarning katta qismi AI yordamida yozila boshlasa, bu kelajakdagi LLM lar uchun nega xavfli?",
      type: "single",
      options: [
        "AI yozgan matnlar juda qisqa bo'lgani uchun ularni tokenlarga bo'lib bo'lmaydi",
        "Modellar oldingi modellar yozganini qaytaradi va gallyutsinatsiya, bias, noaniqlik ortadi",
        "AI yozgan kontentni scraping qilish barcha mamlakatlarda qonun bilan taqiqlangan",
        "AI matnlari juda xilma-xil bo'lib, modelning o'qitilishini haddan tashqari sekinlashtiradi"
      ],
      answer: [1],
      explain: "Kelajakdagi modellar takroriy yoki hosila kontentga duch keladi va yangi, nozik ma'lumot o'rganishi qiyinlashadi. Bu model collapse deb ham ataladi: nusxadan nusxa olganda xatolar to'planib boradi.",
      lesson: { title: "Ma'lumot tugab qolishi", href: "04-Running-out-of-data.md" }
    },
    {
      q: "Darsga ko'ra LLM lar uchun yangi o'quv ma'lumoti topishni qaysi omillar qiyinlashtirmoqda? (bir nechta javob)",
      type: "multi",
      options: [
        "The New York Times, Shutterstock va John Grisham qo'zg'atgan sud da'volari",
        "OpenAI noshirlarga arxivlar uchun pul to'lashdan butunlay bosh tortgani",
        "Reddit va Quora o'z ma'lumotini scraping qilishni noqonuniy qilgani",
        "GPT-4 internetdagi ochiq ma'lumotning sezilarli qismini allaqachon o'qib bo'lgani",
        "Le Monde va AP o'z arxivlarini barcha AI kompaniyalariga bepul ochgani"
      ],
      answer: [0, 2, 3],
      explain: "Ochiq ma'lumot tugab bormoqda, sud da'volari va Reddit, Quora siyosati esa eshiklarni yopmoqda. OpenAI aksincha noshirlarga yiliga $1–5 million taklif qilib, Le Monde, AP kabi tashkilotlar bilan litsenziya shartnomalari imzolagan.",
      lesson: { title: "Ma'lumot tugab qolishi", href: "04-Running-out-of-data.md" }
    },
    {
      q: "OpenAI ma'lumot taqchilligiga qanday javob berdi va dars kelajakda qanday oqibatni kutadi?",
      type: "single",
      options: [
        "Scraping'ni kuchaytirdi; natijada ochiq ma'lumot yana ko'payib ketadi",
        "Faqat sintetik ma'lumotga o'tdi; natijada litsenziyalar keraksiz bo'ladi",
        "Kontent litsenziyalash dasturini boshladi; proprietary datasetlar narxi oshadi",
        "Model o'qitishni to'xtatdi; natijada GPT-5 umuman chiqarilmaydi"
      ],
      answer: [2],
      explain: "OpenAI yirik proprietary datasetlar egalari bilan litsenziya shartnomalari tuzdi (yiliga $1–5 mln). Big tech o'rtasidagi raqobat esa katta proprietary datasetlar narxini sezilarli oshirishi kutilmoqda.",
      lesson: { title: "Ma'lumot tugab qolishi", href: "04-Running-out-of-data.md" }
    }
  ]
};
