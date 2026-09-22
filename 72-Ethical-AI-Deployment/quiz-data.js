window.QUIZ = {
  id: "72",
  title: "Etik AI joylashtirish",
  subtitle: "Rozilik va litsenziya, model karta, guruh bo'yicha kalibrlash, nomuvofiqlik, gallyutsinatsiya va AI sudya monitoringi",
  next: { label: "Biznes foydalanuvchilar uchun etik AI", href: "../73-Ethical-AI-for-Businesses/README.md" },
  questions: [
    {
      q: "Kompaniyaning rozilik matni Flesch Reading Ease bo'yicha 45 ball oldi. Darsdagi amaliy qoidaga ko'ra nima qilish kerak?",
      type: "single",
      options: [
        "Hech narsa: 0 dan yuqori har qanday ball matn tushunarli ekanini bildiradi",
        "Matnni qayta yozish: 60 dan past ball olgan rozilik matni qayta yoziladi",
        "Matnga yana huquqiy izohlar qo'shib, uni to'liqroq qilish kerak",
        "Faqat so'zlar sonini kamaytirish, jumlalar sonini esa o'zgartirmaslik"
      ],
      answer: [1],
      explain: "Qoida: rozilik matnini oqilish() dan o'tkazing, 60 dan past bo'lsa — qayta yozing. Darsda 45 so'zli bitta jumlali huquqiy matn -9.9, bir xil ma'noli 4 jumlali oddiy matn esa 101.7 ball oldi.",
      lesson: { title: "Intellektual mulk va foydalanuvchi roziligi", href: "01-IP-and-Consent.md" }
    },
    {
      q: "Uchta manba litsenziyasi aralashtirildi. Kod nima chop etadi?",
      code: "L = {\"CC-BY\":    {\"tijorat\": True,  \"share_alike\": False},\n     \"CC-BY-NC\": {\"tijorat\": False, \"share_alike\": False},\n     \"CC-BY-SA\": {\"tijorat\": True,  \"share_alike\": True}}\nh = {\"tijorat\": True, \"share_alike\": False}\nfor m in [\"CC-BY\", \"CC-BY-NC\", \"CC-BY-SA\"]:\n    h[\"tijorat\"] &= L[m][\"tijorat\"]\n    h[\"share_alike\"] |= L[m][\"share_alike\"]\nprint(h)",
      type: "single",
      options: [
        "{'tijorat': True, 'share_alike': True}",
        "{'tijorat': False, 'share_alike': False}",
        "{'tijorat': False, 'share_alike': True}",
        "{'tijorat': True, 'share_alike': False}"
      ],
      answer: [2],
      explain: "Ruxsatlar VA (&=) bilan birlashadi: bitta NC manba butun aralashmani notijorat qiladi. Majburiyatlar YOKI (|=) bilan: bitta SA manba butun chiqishni share-alike qiladi.",
      lesson: { title: "Intellektual mulk va foydalanuvchi roziligi", href: "01-IP-and-Consent.md" }
    },
    {
      q: "Qwen2.5-0.5B to'rtta klassik matn boshlanishidan birortasini ham so'zma-so'z davom ettirmadi (0/4). Bundan qanday xulosa chiqarish to'g'ri?",
      type: "single",
      options: [
        "IP xavfi yo'q: model o'quv matnini hech qachon yodlab qolmaydi",
        "Yodlash faqat eski asarlarda uchraydi, yangi matnlarda emas",
        "Model hajmi IP xavfiga hech qanday ta'sir qilmaydi",
        "Kichik model to'qiydi, katta model esa so'zma-so'z qaytarishi mumkin"
      ],
      answer: [3],
      explain: "0/4 \"xavf yo'q\" degani emas. Kichik model o'zi to'qib chiqardi (yechim — faktni tekshirish), katta modellarda esa asosiy xavf so'zma-so'z qaytarish (yechim — chiqish filtri).",
      lesson: { title: "Intellektual mulk va foydalanuvchi roziligi", href: "01-IP-and-Consent.md" }
    },
    {
      q: "Ilovangiz model kartasiga bitta band qo'shmoqchisiz va u \"eng arzon xavfsizlik vositasi\" bo'lishi kerak. Darsga ko'ra qaysi bandni tanlaysiz?",
      type: "single",
      options: [
        "Mo'ljallanmagan foydalanish, masalan \"tibbiy tashxis uchun ishlatmang\"",
        "Mo'ljallangan foydalanish, ya'ni mahsulotning marketing tavsifi",
        "Modelning parametrlari soni, qatlamlari va arxitektura tafsilotlari",
        "Ilova ishlab chiqilgan sana va jamoa a'zolari ro'yxati"
      ],
      answer: [0],
      explain: "\"Mo'ljallanmagan foydalanish\" — bir necha qator matn, lekin javobgarlik chegarasini belgilaydi; uni yozmasangiz, kimdir ishlatadi. Bizning ilovada bajarilgan yagona band esa mo'ljallangan foydalanish, ya'ni marketing matni edi (1/8).",
      lesson: { title: "Asos modellar ishlab chiquvchilarining javobgarligi", href: "02-Foundation-Model-Responsibilities.md" }
    },
    {
      q: "Ilova faqat asos model API sini chaqirgani uchun bias, gallyutsinatsiya va mualliflik huquqi uchun javobgarlik asos model ishlab chiquvchisida qoladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Xavflar asos modeldan keladi, lekin javobgarlik sizda qoladi: foydalanuvchi OpenAI ni emas, sizning ilovangizni ko'radi. \"Biz faqat API chaqiramiz\" — himoya emas.",
      lesson: { title: "Asos modellar ishlab chiquvchilarining javobgarligi", href: "02-Foundation-Model-Responsibilities.md" }
    },
    {
      q: "Model B guruhida 0.93 ishonch bildirganda haqiqiy aniqlik 0.69 edi, A guruhida esa ishonch va aniqlik deyarli teng. Jamoa \"ishonch > 0.90 bo'lsa avtomatik tasdiqlash\" qoidasini qo'ysa nima bo'ladi?",
      type: "single",
      options: [
        "Ikkala guruhda xato bir xil bo'ladi, chunki chegara hammaga teng",
        "B guruhida xato kamayadi, chunki yuqori ishonch doim aniqroq",
        "A guruhida taxminan 6%, B guruhida esa taxminan 31% xato bo'ladi",
        "Qoida faqat A guruhiga zarar qiladi, chunki u ko'proq tasdiqlanadi"
      ],
      answer: [2],
      explain: "Kalibrlash B guruhida adolatsiz: o'rtacha ortiqcha ishonch +0.216, va farq ishonch oshgani sari kattalashadi. Umumiy aniqlik yaxshi ko'rinadi, shuning uchun buni hech kim sezmaydi.",
      lesson: { title: "Ochiq manbali ma'lumot muammolari", href: "03-Open-Source-Data.md" }
    },
    {
      q: "Nomutanosib ta'sir (0.747) va guruh bo'yicha kalibrlash (+0.216) haqida qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Nomutanosib ta'sir \"kimga nima berildi\" ni tekshiradi",
        "Kalibrlash \"model o'zini biladimi\" ni tekshiradi",
        "Chegarani sozlash kalibrlash muammosini ham tuzatadi",
        "Kalibrlash muammosi qayta o'qitishni talab qiladi",
        "CI/CD uchun grafik va vizualizatsiya sondan ko'ra foydaliroq"
      ],
      answer: [0, 1, 3],
      explain: "Chegarani sozlash ko'proq B ni tasdiqlaydi, lekin model hali ham qaysi biri to'g'ri ekanini bilmaydi — kalibrlash qayta o'qitishni talab qiladi. Grafik muammoni ko'rsatadi, lekin testdan o'tmaydi: CI/CD ga son kerak.",
      lesson: { title: "Ochiq manbali ma'lumot muammolari", href: "03-Open-Source-Data.md" }
    },
    {
      q: "Jamoa nomuvofiqlikni yo'qotish uchun generatsiyani do_sample=False bilan ishga tushirdi, lekin 8 ta ifodada baribir 37.5% nomuvofiqlik chiqdi. Nega?",
      type: "single",
      options: [
        "do_sample=False faqat inglizcha savollarda ishlaydi",
        "Manba tasodifiylik emas, savolning ifodasi edi",
        "Model har ishga tushirishda boshqa urug' bilan ishladi",
        "8 ta ifoda juda kam, natija tasodifiy shovqin xolos"
      ],
      answer: [1],
      explain: "do_sample=False bilan tasodifiylik umuman yo'q edi. Savolning ma'nosi o'zgarmadi, faqat so'zlari o'zgardi — va javob ham o'zgardi. Harorat 0 yordam beradi, lekin yetmaydi.",
      lesson: { title: "Nomuvofiqlik", href: "04-Inconsistency.md" }
    },
    {
      q: "Muvofiqlik auditi beshta ifodaga berilgan javoblarni tekshiradi. Kod nima chop etadi?",
      code: "import collections\n\njavoblar = {\"v1\": \"HA\", \"v2\": \"YO'Q\", \"v3\": \"YO'Q\", \"v4\": \"HA\", \"v5\": \"YO'Q\"}\ns = collections.Counter(javoblar.values())\nkop, kop_n = s.most_common(1)[0]\nnomuvofiqlik = 1 - kop_n / len(javoblar)\nprint(kop, nomuvofiqlik, \"YIQILDI\" if nomuvofiqlik > 0.10 else \"o'tdi\")",
      type: "single",
      options: [
        "YO'Q 0.4 YIQILDI",
        "YO'Q 0.6 YIQILDI",
        "HA 0.4 o'tdi",
        "YO'Q 0.4 o'tdi"
      ],
      answer: [0],
      explain: "Ko'pchilik javob YO'Q (3/5), nomuvofiqlik 1 - 3/5 = 0.4. Bu 10% chegaradan yuqori, shuning uchun YIQILDI — darsga ko'ra bunday holatda reliz to'xtaydi.",
      lesson: { title: "Nomuvofiqlik", href: "04-Inconsistency.md" }
    },
    {
      q: "Chatbot \"30 kundan keyin qaytarish mumkinmi?\" savoliga turli mijozlarga turlicha javob beryapti. Darsga ko'ra eng to'g'ri yechim qaysi?",
      type: "single",
      options: [
        "Tizim ko'rsatmasiga qaytarish siyosatini batafsilroq yozish",
        "Modelni kattaroq versiyaga almashtirib, haroratni 0 qilish",
        "Mijozlarga \"javoblar farq qilishi mumkin\" deb ogohlantirish yetarli",
        "Qoidani kodga ko'chirish: if sana_farqi <= 30, model emas"
      ],
      answer: [3],
      explain: "Qaytarish siyosati — model savoli emas, aniq qoida. Bir xil holatga boshqa natija berish shunchaki xato emas, adolatsizlik; qoidani kodga ko'chirish uni butunlay yo'qotadi.",
      lesson: { title: "Nomuvofiqlik", href: "04-Inconsistency.md" }
    },
    {
      q: "\"Nega Meksika mango ishlab chiqarishda yetakchi?\" savoliga model \"dunyo mangosining 90% dan ortig'i\" raqamini qo'shdi. Nega bu gallyutsinatsiyaning eng xavfli turi?",
      type: "single",
      options: [
        "Model soxta asosni qabul qilibgina qolmay, unga yangi \"dalil\" qo'shdi",
        "Model savolga javob berishdan butunlay bosh tortdi",
        "Model to'g'ri raqamni aytdi, lekin savoldagi noto'g'ri mamlakatni tanladi",
        "Model ochiq savolga ham xuddi shu noto'g'ri javobni berdi"
      ],
      answer: [0],
      explain: "90% raqami savolda yo'q edi — model uni o'zi to'qidi (haqiqatda Meksika taxminan 5%). Ochiq savolga esa u to'g'ri javob berdi: Hindiston.",
      lesson: { title: "Gallyutsinatsiya", href: "05-Hallucination.md" }
    },
    {
      q: "\"Asosni tekshir\" tizim ko'rsatmasi bilan model: \"Uzbekistan does have the largest ocean coastline... but this information is incorrect\" deb javob berdi. Bu nimani ko'rsatadi?",
      type: "single",
      options: [
        "Tizim ko'rsatmasi modelning fikrlashini to'liq o'zgartirdi",
        "Model soxta asosni aniqlab, uni to'g'ri va izchil ravishda tuzatib berdi",
        "Ko'rsatma \"rad et\" so'zlarini qo'shtirdi, lekin fikrlashni o'zgartirmadi",
        "Model savolni tushunmadi, chunki u o'zbekcha berilgan edi"
      ],
      answer: [2],
      explain: "Model bir jumlada ham tasdiqladi, ham rad etdi. Tizim ko'rsatmasi rad etish ulushini 12% dan 62% ga oshirdi, lekin 8 tadan 3 tasi baribir o'tib ketdi.",
      lesson: { title: "Gallyutsinatsiya", href: "05-Hallucination.md" }
    },
    {
      q: "Darsdagi xavfsiz_javob() himoyasi tizim ko'rsatmasidan kuchliroq, chunki u savoldagi asosni ajratib, alohida tekshiradi va modelning fikriga bog'liq emas.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Kod \"Explain why X\" dan X ni ajratib, uni RAG, baza yoki qidiruv bilan tekshiradi. Tekshiruv natijasi noma'lum bo'lsa (hukm is None), tizim javob bermaydi — bu eng muhim holat.",
      lesson: { title: "Gallyutsinatsiya", href: "05-Hallucination.md" }
    },
    {
      q: "AI sudyaning to'rtta nazorat da'vosiga bergan hukmlari tekshirilmoqda. Kod nima chop etadi va qanday xulosa chiqadi?",
      code: "hukmlar  = [\"TRUE\", \"TRUE\", \"TRUE\", \"TRUE\"]\nkutilgan = [\"FALSE\", \"TRUE\", \"FALSE\", \"TRUE\"]\naniqlik = sum(h == k for h, k in zip(hukmlar, kutilgan)) / len(kutilgan)\nprint(aniqlik, len(set(hukmlar)) == 1)",
      type: "single",
      options: [
        "0.5 False — sudya tanga tashlash darajasida, lekin ishlayapti",
        "0.5 True — sudya buzuq: hammaga bir xil javob beryapti",
        "1.0 True — sudya hamma da'voni to'g'ri baholadi",
        "0.5 True — sudya o'rtacha, ifodani o'zgartirish yetarli"
      ],
      answer: [1],
      explain: "Sudya hammaga TRUE dedi: aniqlik 50%, lekin yolg'onni topish 0%. len(set(hukmlar)) == 1 — buzuq sudyani aniqlaydigan qator; darsda uchta ifodaning uchalasi ham doimiy javob qaytarib, aynan 50% berdi.",
      lesson: { title: "Doimiy monitoring va xavfni kamaytirish", href: "06-Monitoring.md" }
    },
    {
      q: "Darsga ko'ra model hajmidan qat'i nazar qaysi monitoring qoidalari to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Sudyani har relizda nazorat misollari bilan sinash",
        "Umumiy aniqlik 50% dan yuqori bo'lsa, sudyaga ishonish mumkin",
        "Aniqlik o'rniga recall va javoblar taqsimotiga ham qarash",
        "Sudya javob beruvchi modelning o'zi bo'lmasligi",
        "Monitoring paneli yashil bo'lsa, sudya sog'lig'ini tekshirish shart emas"
      ],
      answer: [0, 2, 3],
      explain: "Uchta xulosa hajmdan qat'i nazar to'g'ri: nazorat misollari, recall va taqsimot, sudya boshqa model bo'lishi. Sudya sog'lig'i panelda bo'lishi shart — aks holda buzuq sudya hammaga TRUE deydi va panel yashil turadi.",
      lesson: { title: "Doimiy monitoring va xavfni kamaytirish", href: "06-Monitoring.md" }
    }
  ]
};
