window.QUIZ = {
  id: "23",
  title: "Sentiment tahlili",
  subtitle: "Uchta sentiment, TextBlob va VADER, transformer modellari va 100 ta kitob sharhida aniqlikni o'lchash",
  next: { label: "Matnni vektorlashtirish", href: "../24-Vectorizing-Text/README.md" },
  questions: [
    {
      q: "Uchta jumla: \"Urush tugadi! Odamlar quvonmoqda.\", \"Urush boshlandi. Dahshatli.\", \"Urush 1939-yilda boshlangan.\" Darsdagi asosiy qoidaga ko'ra bu misol nimani ko'rsatadi?",
      type: "single",
      options: [
        "Urush mavzusi doim salbiy sentiment beradi, faqat kuchi farq qiladi",
        "Sentiment mavzuga emas, ifodalangan hissiyotga bog'liq",
        "Tarixiy faktlar har doim ijobiy sentiment deb tasniflanadi",
        "Bir mavzuda faqat bitta sentiment bo'lishi mumkin"
      ],
      answer: [1],
      explain: "Bir mavzu — uchta har xil sentiment: ijobiy, salbiy va neytral (fakt). Sentiment — mavzu emas, hissiyot.",
      lesson: { title: "Sentiment tahlili nima?", href: "01-What-is-Sentiment-Analysis.md" }
    },
    {
      q: "\"Bu telefon 700 dollar turadi.\" jumlasi qaysi sentimentga kiradi?",
      type: "single",
      options: [
        "Salbiy — narx yuqori bo'lgani uchun",
        "Ijobiy — mahsulot haqida gapirilgani uchun",
        "Neytral — bu hissiyotsiz, shunchaki fakt",
        "Aralash — narx ham yaxshi, ham yomon bo'lishi mumkin"
      ],
      answer: [2],
      explain: "Jumlada hech qanday hissiy so'z yo'q, faqat narx fakti bor. \"o'g'rilik\" yoki \"arzonlik\" so'zi qo'shilgandagina salbiy yoki ijobiy bo'ladi.",
      lesson: { title: "Sentiment tahlili nima?", href: "01-What-is-Sentiment-Analysis.md" }
    },
    {
      q: "Darsda sentiment tahlilining qaysi cheklovlari sanab o'tilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "Kinoya (sarkazm)",
        "Inkor (\"yaxshi emas\")",
        "Matnning juda qisqa bo'lishi",
        "Kontekstga bog'liq so'zlar",
        "Madaniyat va til farqlari"
      ],
      answer: [0, 1, 3, 4],
      explain: "Darsda kinoya, inkor, kontekst, solishtirish va madaniyat sanalgan. Shu sababli sentiment tahlili 100% aniq bo'lmaydi.",
      lesson: { title: "Sentiment tahlili nima?", href: "01-What-is-Sentiment-Analysis.md" }
    },
    {
      q: "Qoidaga asoslangan (leksikaga asoslangan) sentiment qanday ishlaydi?",
      type: "single",
      options: [
        "Belgilangan sharhlar ustida modelni o'qitib, keyin yangi matnni baholaydi",
        "So'zlar o'zaro qanday bog'langanini attention yordamida hisoblaydi",
        "Matnni ijobiy va salbiy guruhlarga klasterlab, markazga qarab baho beradi",
        "Odamlar yozgan lug'atdagi so'z ballarini olib, ularni umumlashtiradi"
      ],
      answer: [3],
      explain: "Bu usul mashinali o'qitishdan foydalanmaydi: har bir so'z lug'atdan qutblilik ballini oladi va ular butun jumla bo'yicha umumlashtiriladi.",
      lesson: { title: "Qoidaga asoslangan sentiment", href: "02-Rule-Based-Sentiment.md" }
    },
    {
      q: "Darsdagi natijaga ko'ra bu kod nima chop etadi?",
      code: "from textblob import TextBlob\n\ns = \"I had a great time at the movie but the parking wasn't great.\"\nprint(TextBlob(s).sentiment.polarity)",
      type: "single",
      options: ["0.8", "-0.4387", "0.0", "-0.1"],
      answer: [0],
      explain: "TextBlob \"great\" so'zini ko'rdi, \"wasn't\" inkorini esa e'tiborga olmadi, shuning uchun eng ijobiy ball 0.8 chiqdi. -0.4387 — VADER'ning compound balli.",
      lesson: { title: "Qoidaga asoslangan sentiment", href: "02-Rule-Based-Sentiment.md" }
    },
    {
      q: "VADER'ning polarity_scores() natijasi haqida qaysi gaplar to'g'ri? (bir nechta javob)",
      code: "{'neg': 0.0, 'neu': 0.578, 'pos': 0.422, 'compound': 0.807}",
      type: "multi",
      options: [
        "neg + neu + pos yig'indisi doim 1.0 ga teng",
        "compound — matn uchun umumiy ball, -1 dan +1 gacha",
        "compound — neg, neu va pos ning oddiy yig'indisi",
        "neu = 0.578 jumlaning 57.8% qismi salbiy ekanini bildiradi"
      ],
      answer: [0, 1],
      explain: "neg, neu, pos — ulushlar, jami 1.0. compound esa alohida hisoblanadigan umumiy ball (-1…+1); neu salbiy emas, neytral ulushdir.",
      lesson: { title: "Qoidaga asoslangan sentiment", href: "02-Rule-Based-Sentiment.md" }
    },
    {
      q: "\"The food was great but the service was terrible.\" va \"The service was terrible but the food was great.\" — VADER bu ikkisiga har xil ball berdi. Sababi nima?",
      type: "single",
      options: [
        "VADER \"but\" dan keyingi qismga ko'proq vazn beradi",
        "VADER jumladagi birinchi so'zga eng katta vazn beradi",
        "Ikkinchi jumlada undov belgisi borligi uchun ball kuchaygan",
        "VADER so'zlar tartibini inobatga olmaydi, bu tasodifiy farq"
      ],
      answer: [0],
      explain: "Bir xil so'zlar, boshqa tartib: \"but\" qoidasi tufayli A -0.3818, B esa +0.6808 oldi — VADER oxirgi aytilgan qismga ko'proq e'tibor beradi.",
      lesson: { title: "Qoidaga asoslangan sentiment", href: "02-Rule-Based-Sentiment.md" }
    },
    {
      q: "Bu kod nima chop etadi?",
      code: "from transformers import pipeline\n\np = pipeline(\"sentiment-analysis\")\nn = p(\"I had a great time at the movie but the parking was terrible.\")[0]\nprint(n['label'], n['score'] > 0)",
      type: "single",
      options: ["NEGATIVE False", "POSITIVE True", "NEGATIVE True", "negative False"],
      answer: [2],
      explain: "Standart model 2-jumlani NEGATIVE deb baholadi (0.998). score — ishonch balli, u 0 dan 1 gacha va doim musbat, shuning uchun True.",
      lesson: { title: "Oldindan o'qitilgan transformer modellari", href: "03-Pre-trained-Transformer-Models.md" }
    },
    {
      q: "Standart model \"I went to see a movie.\" jumlasini 98.6% ishonch bilan POSITIVE deb baholadi. Buning asosiy sababi nima?",
      type: "single",
      options: [
        "Jumla juda qisqa bo'lgani uchun model uni to'liq o'qiy olmadi",
        "Model SST-2 da o'qitilgan, u yerda neytral yorlig'i yo'q",
        "\"movie\" so'zi lug'atda kuchli ijobiy ball bilan yozilgan",
        "Model inkor so'zlarini bilmagani uchun faktni ijobiy deb oldi"
      ],
      answer: [1],
      explain: "SST-2 da faqat POSITIVE va NEGATIVE bor, shuning uchun model neytral jumlada ham majburan ikkitadan birini tanlaydi. Yuqori ishonch to'g'ri javob degani emas.",
      lesson: { title: "Oldindan o'qitilgan transformer modellari", href: "03-Pre-trained-Transformer-Models.md" }
    },
    {
      q: "Neytral jumlalarni ham to'g'ri aniqlash kerak. Darsga ko'ra qaysi chaqiruv mos keladi?",
      type: "single",
      options: [
        "pipeline(\"sentiment-analysis\", num_labels=3, neutral=True)",
        "pipeline(\"sentiment-analysis\", top_k=3)(matn[:512])",
        "pipeline(model=\"distilbert-base-uncased-finetuned-sst-2-english\")",
        "pipeline(model=\"cardiffnlp/twitter-roberta-base-sentiment-latest\")"
      ],
      answer: [3],
      explain: "twitter-roberta modeli uchta yorliqqa ega: negative, neutral, positive. U \"I went to see a movie.\" ni neutral deb topdi; distilbert-sst-2 esa standart, 2 yorliqli model.",
      lesson: { title: "Oldindan o'qitilgan transformer modellari", href: "03-Pre-trained-Transformer-Models.md" }
    },
    {
      q: "Twitter modeli \"-latest\" nomli bo'lgani uchun uning natijalari o'qituvchi videosidagidan farq qildi. Ishlab chiqarishda nima qilish tavsiya etiladi?",
      type: "single",
      options: [
        "Modelni aniq versiyaga qadab qo'yish (pin qilish)",
        "Har safar eng yangi versiyani yuklab olish",
        "Faqat standart modeldan foydalanish",
        "Ishonch balli 99% dan past natijalarni tashlab yuborish"
      ],
      answer: [0],
      explain: "Modellar vaqt o'tishi bilan yangilanadi, shuning uchun natija versiyaga bog'liq. Versiyani qadab qo'ymasangiz, natija bir kunda o'zgarishi mumkin.",
      lesson: { title: "Oldindan o'qitilgan transformer modellari", href: "03-Pre-trained-Transformer-Models.md" }
    },
    {
      q: "Kitob sharhlarini sentiment uchun tozalashda nega to'xtatish so'zlar olib tashlanmadi?",
      type: "single",
      options: [
        "Chunki VADER to'xtatish so'zlarni o'zi avtomatik o'chiradi",
        "Chunki sharhlarda to'xtatish so'zlar deyarli uchramaydi",
        "Chunki ro'yxatda not, no, never kabi inkor so'zlari bor",
        "Chunki to'xtatish so'zlarni o'chirish juda sekin ishlaydi"
      ],
      answer: [2],
      explain: "Inkor so'zlari o'chirilsa \"not good\" \"good\" ga aylanib, ma'no teskari bo'ladi. Xuddi shu sababdan lemmatizatsiya va stemming ham qilinmadi.",
      lesson: { title: "Amaliy vazifa — 100 ta kitob sharhi", href: "04-Practical-Task.md" }
    },
    {
      q: "Bu kod qanday yorliqlar chiqaradi?",
      code: "import pandas as pd\n\nballar = pd.Series([0.674, -0.05, -0.5])\nprint(pd.cut(ballar, bins=[-1, -0.1, 0.1, 1],\n             labels=[\"negative\", \"neutral\", \"positive\"]).tolist())",
      type: "single",
      options: [
        "['positive', 'negative', 'negative']",
        "['positive', 'neutral', 'negative']",
        "['neutral', 'neutral', 'negative']",
        "['positive', 'neutral', 'neutral']"
      ],
      answer: [1],
      explain: "0.674 (0.1, 1] oralig'iga — positive, -0.05 (-0.1, 0.1] ga — neutral, -0.5 (-1, -0.1] ga — negative tushadi.",
      lesson: { title: "Amaliy vazifa — 100 ta kitob sharhi", href: "04-Practical-Task.md" }
    },
    {
      q: "Amaliy vazifada transformer sharhlarni review[:512] ko'rinishida oldi. To'g'rimi: bu uzunlik chegarasi tufayli xatoning oldini olish uchun qilingan?",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Transformerlarning uzunlik chegarasi bor (odatda 512 token); uzun matn berilsa xato chiqadi, shuning uchun matn kesiladi.",
      lesson: { title: "Amaliy vazifa — 100 ta kitob sharhi", href: "04-Practical-Task.md" }
    },
    {
      q: "100 ta sharhda neytralsiz aniqlik: Transformer 95.2%, VADER 72.3%. Millionlab tvitni real vaqtda arzon tahlil qilish kerak. Darsga ko'ra qaysi yondashuv eng mos?",
      type: "single",
      options: [
        "Faqat transformer — chunki u eng aniq natija beradi",
        "Faqat TextBlob — chunki u subjectivity ham beradi",
        "Standart transformer — chunki u neytralni ham topadi",
        "VADER — tez, kichik va internet talab qilmaydi"
      ],
      answer: [3],
      explain: "Millionlab tvit va real vaqt uchun VADER tavsiya etiladi (~1 MB, juda tez). Transformer aniqroq, lekin sekin va katta; eng yaxshisi — VADER filtrlaydi, shubhalilarni transformer hal qiladi.",
      lesson: { title: "Amaliy vazifa — 100 ta kitob sharhi", href: "04-Practical-Task.md" }
    }
  ]
};
