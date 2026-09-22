window.QUIZ = {
  id: "21",
  title: "Matnni oldindan qayta ishlash",
  subtitle: "Kichik harf, to'xtatish so'zlari, regex, tokenizatsiya, stemming, lemmatization va n-grammalar",
  next: { label: "POS teglash va NER", href: "../22-POS-and-NER/README.md" },
  questions: [
    {
      q: "Darsdagi uch bosqichdan ikkinchisi — shovqinni olib tashlash — nimani anglatadi?",
      type: "single",
      options: [
        "Ma'lumotni ML algoritmi kutgan formatga, masalan, vektorga aylantirishni",
        "Xato beradigan qatorlar va noto'g'ri belgilarni topib tuzatishni",
        "Qiymat qo'shmaydigan, faqat xotirada joy egallaydigan qismlarni olib tashlashni",
        "Barcha so'zlarni lug'atdagi asos shakliga keltirishni"
      ],
      answer: [2],
      explain: "Shovqinni olib tashlash — ma'no qo'shmaydigan va faqat joy egallaydigan qismlarni olib tashlab, kichikroq va tozaroq ma'lumot to'plamiga ega bo'lish. Xatolarni tuzatish birinchi, formatga keltirish esa uchinchi bosqich.",
      lesson: { title: "Ma'lumot tayyorlashning ahamiyati", href: "01-The-Importance-of-Data-Preparation.md" }
    },
    {
      q: "Matnni kichik harfga o'girish hech qachon so'zning ma'nosini o'zgartirmaydi, shuning uchun uni ko'r-ko'rona qo'llash xavfsiz.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Kichik harf ba'zan ma'noni o'zgartiradi: \"US\" (AQSh) \"us\" (biz) ga, \"Apple\" (kompaniya) \"apple\" (olma) ga aylanadi. Bu izchillik va ma'no orasidagi tanlov.",
      lesson: { title: "Kichik harfga o'girish", href: "02-Lowercase.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "from nltk.corpus import stopwords\nsw = stopwords.words('english')\n\ns = \"The food was not good\"\nprint(\" \".join([w for w in s.split() if w not in sw]))",
      type: "single",
      options: ["food good", "The food not good", "The food good", "food not good"],
      answer: [2],
      explain: "Ro'yxatda \"the\" bor, lekin bosh harfli \"The\" yo'q, shuning uchun u qoladi. \"not\" esa ro'yxatda bor va o'chiriladi — ikki tuzoq birdan: lowercase qilinmagan va inkor yo'qolgan.",
      lesson: { title: "To'xtatish so'zlarini olib tashlash", href: "03-Removing-Stop-Words.md" }
    },
    {
      q: "Sentiment tahlili uchun to'xtatish so'zlari ro'yxatini moslashtiryapsiz. Qaysi so'zlarni ro'yxatdan olib tashlab, matnda saqlash kerak? (bir nechta javob)",
      type: "multi",
      options: ["the", "not", "of", "but", "very"],
      answer: [1, 3, 4],
      explain: "\"not\" inkorni bildiradi, \"very\" kuchaytiradi (\"very bad\"), \"but\" qarama-qarshilikni ko'rsatadi (\"good but expensive\"). \"the\" va \"of\" esa haqiqatan ma'no tashimaydi.",
      lesson: { title: "To'xtatish so'zlarini olib tashlash", href: "03-Removing-Stop-Words.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "import re\nr = [\"Apple is good\", \"Good apple\", \"Great service\", \"Bad apple\"]\nprint([s for s in r if re.search(r\"e$\", s)])",
      type: "single",
      options: [
        "['Apple is good', 'Good apple', 'Bad apple']",
        "['Good apple', 'Bad apple']",
        "['Apple is good']",
        "['Good apple', 'Great service', 'Bad apple']"
      ],
      answer: [3],
      explain: "$ satr oxirini bildiradi: r\"e$\" \"e\" bilan tugaydigan satrlarni topadi. \"Great service\" ham e bilan tugaydi, \"Apple is good\" esa d bilan tugaydi.",
      lesson: { title: "Regular expressions (regex)", href: "04-Regular-Expressions.md" }
    },
    {
      q: "re.sub(r\"[^\\w\\s]\", \"\", matn) chaqiruvi matndan nimani olib tashlaydi?",
      type: "single",
      options: [
        "So'z belgisi ham, bo'sh joy ham bo'lmagan hamma narsani — ya'ni tinish belgilarni",
        "Satr boshidagi barcha harf va raqamlarni, bo'sh joylarni qoldirib",
        "Faqat bo'sh joylarni, so'zlarni bir-biriga yopishtirib",
        "Barcha so'zlarni, faqat tinish belgilar va bo'sh joylarni qoldirib"
      ],
      answer: [0],
      explain: "Kvadrat qavs ichidagi ^ inkor: \"\\w ham, \\s ham emas\". Bunday belgilar (. , ! ? kabi) bo'sh satrga almashtiriladi, ya'ni o'chiriladi. Bu yerdagi ^ satr boshini emas, inkorni bildiradi.",
      lesson: { title: "Regular expressions (regex)", href: "04-Regular-Expressions.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "from nltk.tokenize import word_tokenize\n\ns = \"Her cat's name is Luna.\"\nprint(len(s.split()), len(word_tokenize(s)))",
      type: "single",
      options: ["5 5", "5 7", "7 5", "5 6"],
      answer: [1],
      explain: "split() 5 ta bo'lak beradi (\"cat's\" va \"Luna.\" butunicha). word_tokenize esa \"cat\" + \"'s\" ga ajratadi va nuqtani alohida token qiladi: jami 7 ta.",
      lesson: { title: "Tokenizatsiya", href: "05-Tokenization.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "from nltk.stem import PorterStemmer\nps = PorterStemmer()\n\nprint([ps.stem(t) for t in ['likes', 'better', 'worse']])",
      type: "single",
      options: [
        "['like', 'good', 'bad']",
        "['like', 'better', 'worse']",
        "['like', 'better', 'wors']",
        "['lik', 'bett', 'wors']"
      ],
      answer: [2],
      explain: "Porter stemmer qo'shimchalarni kesadi: \"likes\" → \"like\", \"worse\" → \"wors\" (haqiqiy so'z emas). \"better\" → \"good\" ni esa faqat lug'atga qaraydigan lemmatizer pos=\"a\" bilan qila oladi.",
      lesson: { title: "Stemming (o'zak topish)", href: "06-Stemming.md" }
    },
    {
      q: "Porter stemmer \"universe\" va \"university\" so'zlarini bitta \"univers\" o'zagiga keltiradi. Buning sababi nima?",
      type: "single",
      options: [
        "Stemmer ikkala so'zni WordNet lug'atida sinonim deb topadi",
        "Stemmer lug'atga murojaat qilmaydi, faqat qoidalar bo'yicha oxirini kesadi",
        "Stemmer standart holatda har bir so'zni ot deb hisoblaydi",
        "Stemmer so'zlarni kontekstga qarab bir ma'noga birlashtiradi"
      ],
      answer: [1],
      explain: "Stemming — harf kesish qoidalari to'plami; u so'z ma'nosini bilmaydi. Shuning uchun koinot va universitet bir o'zakka tushadi — bu noto'g'ri birlashtirish (false merge).",
      lesson: { title: "Stemming (o'zak topish)", href: "06-Stemming.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "from nltk.stem import WordNetLemmatizer\nlem = WordNetLemmatizer()\n\nprint(lem.lemmatize(\"better\"), lem.lemmatize(\"better\", pos=\"a\"))",
      type: "single",
      options: ["good good", "better better", "good better", "better good"],
      answer: [3],
      explain: "Standart holatda lemmatizer so'zni ot deb hisoblaydi va \"better\" o'zgarmaydi. pos=\"a\" (sifat) berilganda lug'atdan \"good\" asos shakli topiladi — buni stemming hech qachon qila olmaydi.",
      lesson: { title: "Lemmatization (lug'at shakliga keltirish)", href: "07-Lemmatization.md" }
    },
    {
      q: "WordNetLemmatizer 'connecting', 'connected', 'connects' so'zlarini deyarli o'zgartirmadi, stemming esa hammasini 'connect' ga keltirgan edi. Buning asosiy sababi nima?",
      type: "single",
      options: [
        "Lemmatizer standart holatda so'zni ot deb qabul qiladi, bular esa fe'l shakllari",
        "WordNet lug'atida \"connect\" so'zi umuman mavjud emas",
        "Lemmatizer faqat ko'plikdagi so'zlarni qayta ishlay oladi",
        "Lemmatizer faqat oldin stemlangan so'zlar bilan ishlaydi"
      ],
      answer: [0],
      explain: "WordNetLemmatizer standart pos=\"n\" bilan ishlaydi. lemmatize(\"connecting\", pos=\"v\") esa \"connect\" beradi. Natijada lemmatization ma'noni saqlaydi, lekin lug'at kattaroq qoladi.",
      lesson: { title: "Lemmatization (lug'at shakliga keltirish)", href: "07-Lemmatization.md" }
    },
    {
      q: "Bu kod nimani chiqaradi?",
      code: "import nltk\n\nt = \"the cat sat on the mat the cat ate the rat\".split()\nprint(len(list(nltk.ngrams(t, 2))))",
      type: "single",
      options: ["10", "11", "5", "9"],
      answer: [0],
      explain: "Matnda 11 ta token bor; n-grammalar soni len(tokens) - n + 1 = 11 - 2 + 1 = 10. Takrorlanuvchi bigrammalar ham alohida sanaladi.",
      lesson: { title: "N-grammalar", href: "08-N-grams.md" }
    },
    {
      q: "Darsga ko'ra, n-grammalarni hisoblash qaysi maqsadlarga xizmat qiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Oldindan qayta ishlash to'g'ri bajarilganini tekshirish",
        "So'zlarni lug'aviy asos shakliga keltirish",
        "Ma'lumot mazmuni va undagi mavzularni o'rganish",
        "Tinish belgilarni matndan olib tashlash",
        "Mashinali o'rganish uchun yangi xususiyatlar yaratish"
      ],
      answer: [0, 2, 4],
      explain: "Ma'ruzachi uchta maqsadni aytadi: tozalashni tekshirish, mazmunni o'rganish va ML uchun yangi xususiyatlar yaratish. Asos shaklga keltirish — lemmatization, tinish belgilar esa regex ishi.",
      lesson: { title: "N-grammalar", href: "08-N-grams.md" }
    },
    {
      q: "109 ta sharhni tozalagach, unigrammalar orasida 'nt' tokeni 81 marta uchradi. Bu nimani bildiradi va nima qilish kerak?",
      type: "single",
      options: [
        "Bu \"not\" so'zining stemlangan shakli — uni shunday qoldirish kerak",
        "Bu Sietldagi joy nomining qisqartmasi — uni alohida tahlil qilish kerak",
        "Bu lemmatizer xatosi — lemmatization o'rniga stemming ishlatish kerak",
        "Bu \"don't\" dan qolgan ma'nosiz bo'lak — uni to'xtatish so'zlariga qo'shish kerak"
      ],
      answer: [3],
      explain: "\"n't\" dagi apostrof o'chirilgach, ma'nosiz \"nt\" qoladi. Bu quvurdagi xato bo'lib, \"nt\" ni to'xtatish so'zlariga qo'shib tuzatiladi. N-grammalarga qarash aynan shunday xatolarni topishga yordam beradi.",
      lesson: { title: "Amaliy vazifa — to'liq quvur", href: "09-Practical-Task.md" }
    },
    {
      q: "Amaliy vazifada tinish belgilarni o'chirishdan oldin nega avval re.sub(r\"\\*\", \"star\", ...) qo'llanadi?",
      type: "single",
      options: [
        "Chunki regex yulduzchani tinish belgi deb tanimaydi va xato beradi",
        "Chunki \"4*\" reytingni bildiradi — o'chirilsa, bu ma'no yo'qoladi",
        "Chunki word_tokenize yulduzcha bor matnni tokenlarga ajrata olmaydi",
        "Chunki \"star\" so'zi to'xtatish so'zlari ro'yxatiga kirmasligi uchun"
      ],
      answer: [1],
      explain: "\"not 4* experience\" dagi 4* — 4 yulduz degani. Uni \"4star\" ga aylantirish reytingni saqlaydi; shunchaki o'chirilsa, \"4\" ma'nosiz qoladi. Ma'lumotni ko'rmasdan tozalash xato.",
      lesson: { title: "Amaliy vazifa — to'liq quvur", href: "09-Practical-Task.md" }
    }
  ]
};
