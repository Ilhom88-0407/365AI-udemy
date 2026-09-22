window.QUIZ = {
  id: "29",
  title: "Katta til modellariga kirish",
  subtitle: "LLM nima, qanchalik katta, umumiy maqsadlilik, pre-training va fine-tuning, zero-shot va qo'llanishlar",
  next: { label: "Transformer arxitekturasi", href: "../30-Transformer-Architecture/README.md" },
  questions: [
    {
      q: "Darsga ko'ra 23-modulda pipeline(\"sentiment-analysis\") bilan ishlatgan modelingiz aslida nima edi?",
      type: "single",
      options: [
        "VADER kabi lug'atga asoslangan oddiy sentiment vositasi",
        "Taxminan 67 million parametrli transformer modeli",
        "TF-IDF va logistik regressiyadan iborat sklearn quvuri",
        "Faqat ijobiy va salbiy so'zlarni sanaydigan qoida tizimi"
      ],
      answer: [1],
      explain: "U distilbert-base-uncased-finetuned-sst-2-english edi — 66,955,010 parametrli transformer. Ya'ni siz transformerni allaqachon uch qator kodda ishlatgansiz.",
      lesson: { title: "LLM kursiga kirish", href: "01-Introduction-to-the-Course.md" }
    },
    {
      q: "OpenAI API kalitini kodda ishlatishning qaysi usuli darsda to'g'ri deb ko'rsatilgan?",
      type: "single",
      options: [
        "import os\napi_key = os.environ.get(\"OPENAI_API_KEY\")",
        "api_key = \"sk-proj-abc123...\"  # kod ichida saqlash",
        "api_key = input(\"Kalitni kiriting: \") va uni notebookda chop etish",
        "Kalitni README.md fayliga yozib, GitHub'ga yuklash"
      ],
      answer: [0],
      explain: "Kalit muhit o'zgaruvchisidan os.environ.get() orqali olinadi. Kod ichidagi ochiq kalit GitHub'ga tushib qolsa, botlar uni tez topadi va hisobingizdan pul yechiladi.",
      lesson: { title: "Kurs materiallari va noutbuklar", href: "02-Course-Materials.md" }
    },
    {
      q: "API kaliti tasodifan GitHub'ga yuklanib ketdi. Darsga ko'ra yagona to'g'ri yo'l qaysi?",
      type: "single",
      options: [
        "git rm bilan faylni o'chirib, yangi commit qilish",
        "Repozitoriyni vaqtincha private qilib qo'yish",
        "Kalitni bekor qilib, yangisini olish",
        "Faylni .gitignore ga qo'shib, qayta push qilish"
      ],
      answer: [2],
      explain: "git rm yetarli emas — kalit git tarixida qoladi. Shuning uchun uni bekor qilib, yangi kalit olish kerak.",
      lesson: { title: "Kurs materiallari va noutbuklar", href: "02-Course-Materials.md" }
    },
    {
      q: "Ma'lumotlar bazasi ham ko'p narsani \"biladi\". Darsga ko'ra LLM'ning undan asosiy farqi nimada?",
      type: "single",
      options: [
        "LLM har doim aniq va xatosiz javob beradi",
        "LLM ma'lumotni tezroq va arzonroq saqlaydi",
        "LLM faqat raqamli ma'lumot bilan ishlay oladi",
        "LLM savolni tushunib, tabiiy tilda gaplasha oladi"
      ],
      answer: [3],
      explain: "LLM — bilim va muloqot: u savolni tushunadi va tabiiy tilda javob beradi. Aniqlik esa kafolatlanmagan — u ba'zan gallyutsinatsiya qiladi.",
      lesson: { title: "LLM nima?", href: "03-What-are-LLMs.md" }
    },
    {
      q: "distilgpt2 \"The capital of France is\" ga Parijni aytmay, o'zini takrorladi, lekin grammatik to'g'ri gap tuzdi. Dars buni qanday izohlaydi?",
      type: "single",
      options: [
        "Model grammatikani o'rgangan, faktlar uchun esa hajmi yetmaydi",
        "Model faktlarni biladi, lekin do_sample=False uni yashiradi",
        "Model fransuz tilida o'qitilgani uchun inglizcha savolni tushunmadi",
        "Model internetdan emas, faqat Wikipedia'dan o'qitilgan"
      ],
      answer: [0],
      explain: "Grammatika naqsh bo'lib, kichik modelda ham o'rganiladi; faktlar esa parametrlarda joy talab qiladi. distilgpt2 (82M) GPT-4 dan taxminan 20 000 baravar kichik.",
      lesson: { title: "LLM nima?", href: "03-What-are-LLMs.md" }
    },
    {
      q: "LLM'ning hajmi darsda nima bilan o'lchanadi?",
      type: "single",
      options: [
        "Model fayli diskda egallagan jismoniy joy bilan",
        "O'qitish uchun ishlatilgan GPU'lar soni bilan",
        "Parametrlar soni bilan",
        "Lug'atidagi so'zlar soni bilan"
      ],
      answer: [2],
      explain: "Hajm deganda jismoniy joy emas, parametrlar soni nazarda tutiladi. Parametrlar — modelga tilni tushunishga yordam beradigan mayda \"g'ishtchalar\".",
      lesson: { title: "LLM qanchalik katta?", href: "04-How-Large-is-an-LLM.md" }
    },
    {
      q: "Quyidagi kod nimani chop etadi?",
      code: "def yulduz(l):\n    n = int(l.split()[0])\n    return \"ijobiy\" if n >= 4 else (\"salbiy\" if n <= 2 else \"?\")\n\nprint(yulduz(\"4 stars\"), yulduz(\"3 stars\"), yulduz(\"1 star\"))",
      type: "single",
      options: [
        "ijobiy salbiy salbiy",
        "ijobiy ? salbiy",
        "ijobiy ijobiy salbiy",
        "? ? salbiy"
      ],
      answer: [1],
      explain: "4 >= 4 bo'lgani uchun \"ijobiy\", 3 ikkala shartga ham mos kelmaydi va \"?\" qaytadi, 1 <= 2 esa \"salbiy\".",
      lesson: { title: "LLM qanchalik katta?", href: "04-How-Large-is-an-LLM.md" }
    },
    {
      q: "O'zbekcha sentiment sinovida 167 millionlik ko'p tilli bert 0.500, 16 jumlada o'qitilgan sklearn modeli esa 0.625 oldi. Buning asosiy sababi nima?",
      type: "single",
      options: [
        "Ko'p tilli model juda katta bo'lgani uchun o'zbekchada overfitting bo'ldi",
        "sklearn modeli kichik ma'lumotda har doim transformerlardan aniqroq",
        "Model sentimentni faqat 6 tilda o'rgangan, o'zbek ular orasida yo'q",
        "Sinovda cross-validation ishlatilmagani uchun natija tasodifan buzildi"
      ],
      answer: [2],
      explain: "mBERT asosi 104 tilni biladi, lekin nlptown modeli atigi 6 tilda sozlangan. Model o'zbek so'zlarini ko'radi, lekin ularning sentimentini hech qachon o'rganmagan.",
      lesson: { title: "LLM qanchalik katta?", href: "04-How-Large-is-an-LLM.md" }
    },
    {
      q: "Nima uchun nlptown/bert-base-multilingual modeli ingliz distilbert modelidan kattaroq?",
      type: "single",
      options: [
        "Unda transformer qatlamlari soni ikki baravar ko'p bo'lgani uchun",
        "U ko'proq sentiment misollarida va uzoqroq vaqt o'qitilgani uchun",
        "U 5 yulduzli baho chiqargani uchun qo'shimcha qatlam talab qiladi",
        "104 tilning lug'ati sig'ishi uchun embedding qatlami kattaroq"
      ],
      answer: [3],
      explain: "Qo'shimcha parametrlar aql uchun emas, lug'at uchun ketgan: ko'p tilli lug'at ~105 000 token, bu esa embedding qatlamini kattalashtiradi.",
      lesson: { title: "LLM qanchalik katta?", href: "04-How-Large-is-an-LLM.md" }
    },
    {
      q: "26-modulda qurgan SGDClassifier sentiment modelingiz \"umumiy maqsadli\" modelmi?",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "U faqat bitta vazifa — sentiment tasniflash uchun o'qitilgan; tarjima yoki xulosalashni bilmaydi, hatto boshqa sentiment vazifasi uchun ham qayta o'qitish kerak.",
      lesson: { title: "Umumiy maqsadli modellar", href: "05-General-Purpose-Models.md" }
    },
    {
      q: "Darsdagi taqqoslashga ko'ra umumiy maqsadli model maxsus sklearn modeliga nisbatan qaysi jihatlarda yutqazadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Tezlik — 1M sharhni tasniflash ancha sekin",
        "Bir nechta turli vazifani bitta model bilan bajarish",
        "Qarorni tushuntirish — coef_ kabi vosita yo'q",
        "Xotira va narx — 250 MB–100 GB joy, qimmatroq",
        "Yorliqli ma'lumotsiz (zero-shot) ishlay olish"
      ],
      answer: [0, 2, 3],
      explain: "Umumiy model sekin, qimmat, ko'p xotira oladi va tushuntirish qiyin. Ko'p vazifa va yorliqsiz ishlash esa aynan uning afzalliklari.",
      lesson: { title: "Umumiy maqsadli modellar", href: "05-General-Purpose-Models.md" }
    },
    {
      q: "Oldindan o'qitish (pre-training) bosqichida nima uchun qo'lda yorliq qo'yish kerak emas?",
      type: "single",
      options: [
        "Chunki model keyingi so'zni bashorat qiladi va javob matnning o'zida bor",
        "Chunki yorliqlarni internet foydalanuvchilari avval qo'yib chiqqan",
        "Chunki pre-training faqat kichik, tayyor yorliqli to'plamda o'tkaziladi",
        "Chunki model yorliqni sozlash bosqichida o'zi qo'yib oladi"
      ],
      answer: [0],
      explain: "Model gaplarda keyingi so'zni bashorat qiladi — to'g'ri javob allaqachon matnda yozilgan (self-supervised). Shuning uchun butun internetni ishlatish mumkin.",
      lesson: { title: "Oldindan o'qitish va sozlash", href: "06-Pre-training-and-Fine-tuning.md" }
    },
    {
      q: "Pre-training va fine-tuning haqidagi qaysi fikrlar dars bilan mos keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Pre-training butun internet hajmidagi ma'lumotda, oylar davomida o'tadi",
        "Fine-tuning kichik ixtisoslashgan to'plamda o'tadi va yorliq talab qiladi",
        "Fine-tuning paytida model pre-training bilimini unutib, noldan o'rganadi",
        "Pre-training odatda Google, OpenAI, Meta kabi kompaniyalar tomonidan qilinadi"
      ],
      answer: [0, 1, 3],
      explain: "Maktab o'xshatishida bo'lgani kabi, dastlabki bilim yo'qolmaydi — fine-tuning uning ustiga quriladi. Qolgan uchta fikr darsdagi taqqoslash jadvaliga mos.",
      lesson: { title: "Oldindan o'qitish va sozlash", href: "06-Pre-training-and-Fine-tuning.md" }
    },
    {
      q: "Kino sharhlarida sozlangan distilbert ingliz kitob sharhlarida 0.976, o'zbekcha sharhlarda esa ancha past natija berdi. Yangi loyihada darsdagi amaliy qoida qaysi?",
      type: "single",
      options: [
        "Darhol fine-tuning qilish, chunki zero-shot natijasi doim ishonchsiz",
        "Inglizchada avval zero-shot'ni sinash, boshqa tilda o'lchab keyin ishonish",
        "Til qanday bo'lishidan qat'i nazar eng katta ko'p tilli modelni tanlash",
        "Zero-shot natijasi yuqori bo'lsa ham baribir sklearn modelini qurish shart"
      ],
      answer: [1],
      explain: "Bir xil model, bir xil vazifa, teskari natija — yagona farq til. Ingliz tilida zero-shot'ni 10 daqiqada sinab ko'rish haftalab ish tejashi mumkin, boshqa tilda esa avval o'lchash kerak.",
      lesson: { title: "Oldindan o'qitish va sozlash", href: "06-Pre-training-and-Fine-tuning.md" }
    },
    {
      q: "Darsga ko'ra LLM tibbiyot, huquq va marketing sohalarida qanday rol o'ynashi kerak, va o'zbek tilida qaysi vazifada eng yaxshi ishlaydi?",
      type: "single",
      options: [
        "Qaror qabul qiluvchi; o'zbek tilida eng yaxshisi — sentiment tahlili",
        "Yordamchi; o'zbek tilida eng yaxshisi — NER",
        "Yordamchi; o'zbek tilida eng yaxshisi — tarjima",
        "Qaror qabul qiluvchi; o'zbek tilida eng yaxshisi — kontent yaratish"
      ],
      answer: [2],
      explain: "Bu sohalarda xato narxi juda qimmat, shuning uchun LLM faqat yordamchi. Tarjima o'zbekchada eng yaxshi ishlaydi, chunki parallel matnlar mavjud, sentiment lug'ati esa yo'q.",
      lesson: { title: "LLM nima uchun ishlatiladi?", href: "07-What-can-LLMs-be-used-for.md" }
    }
  ]
};
