window.QUIZ = {
  id: "36",
  title: "Tokenlar, modellar va narxlar",
  subtitle: "BPE tokenlar va tiktoken, o'zbekcha token ustamasi, kirish/chiqish narxi, kontekst oynasi va embedding",
  next: { label: "Muhitni sozlash", href: "../37-LangChain-Setting-Up-Environment/README.md" },
  questions: [
    {
      q: "Kod nima chiqaradi va nega bu raqam kichik?",
      code: "import tiktoken\nenc = tiktoken.get_encoding(\"cl100k_base\")\nprint(enc.encode(\"?\"))",
      type: "single",
      options: [
        "[30] — \"?\" ko'p uchraydi, BPE uni lug'atga erta qo'shgan",
        "[63] — \"?\" ning ASCII kodi to'g'ridan-to'g'ri token ID bo'ladi",
        "[30] — tinish belgilari lug'atda alifbo bo'yicha birinchi turadi",
        "[] — tinish belgilari BPE'da alohida tokenga aylantirilmaydi"
      ],
      answer: [0],
      explain: "\"?\" ning ID'si 30. BPE lug'atida eng ko'p uchraydigan bo'laklar avval qo'shiladi va past ID oladi; ID qanchalik katta bo'lsa, bo'lak shunchalik noyob.",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "cl100k_base da 'What' (3923), ' what' (1148) va ' What' (3639) — uchta turli token. Bundan qanday amaliy xulosa chiqadi?",
      type: "single",
      options: [
        "Katta harflarni kichikka o'tkazish token tejaydi va sifatga ta'sir qilmaydi",
        "GPT tokenizatori bo'shliqlarni tashlab yuboradi, shuning uchun ular muhim emas",
        "Bo'shliq va katta harf token qismi, shuning uchun ortiqcha bo'shliq qo'ymang",
        "Bir so'zning ID'si jumladagi o'rniga qarab har safar tasodifiy tanlanadi"
      ],
      answer: [2],
      explain: "GPT ning BPE tokenizatorida bo'shliq token ichida turadi va katta harf ham hisobga olinadi. Shuning uchun bir xil so'z turli ID oladi va promptda ortiqcha bo'shliq qo'ymaslik kerak.",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "Kurs \"100 token ≈ 75 so'z\" deydi, darsdagi inglizcha ilmiy matnda esa 90 so'z chiqdi. Dars bu farqni qanday baholaydi?",
      type: "single",
      options: [
        "Kurs xato qilgan: narx hisobida doim 90 raqamini olish to'g'riroq",
        "Kurs ehtiyotkor: narxni kam emas, ko'proq baholash xavfsizroq",
        "Farq tiktoken xatosidan chiqqan, haqiqiy nisbat esa doim 75 ga teng",
        "Nisbat faqat modelga bog'liq, matn turi va tiliga bog'liq emas"
      ],
      answer: [1],
      explain: "75 raqami ehtiyotkor taxmin — narxni ko'proq baholash xavfsizroq. Lekin nisbat matnga bog'liq (kod, emoji, o'zbekcha boshqacha), shuning uchun taxmin qilmay, tiktoken bilan o'lchash kerak.",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "Nima uchun GPT tokenlari na harf, na butun so'z darajasida emas, balki BPE bo'laklari? To'g'ri fikrlarni tanlang. (bir nechta javob)",
      type: "multi",
      options: [
        "Harf darajasida ketma-ketlik juda uzun, e'tibor narxi esa O(n²) o'sadi",
        "So'z darajasida lug'at ulkan, noma'lum so'z esa <unk> ga aylanadi",
        "BPE lug'at hajmi va ketma-ketlik uzunligi orasida muvozanat beradi",
        "Harf darajasida lug'atda yo'q ko'p so'zlar <unk> bo'lib qoladi",
        "So'z darajasida ketma-ketlik eng uzun bo'lib, e'tibor narxi oshadi"
      ],
      answer: [0, 1, 2],
      explain: "Harf darajasida <unk> hech qachon bo'lmaydi, lekin ketma-ketlik uzun; so'z darajasida ketma-ketlik qisqa, lekin lug'at ulkan va <unk> muammosi bor. BPE — o'rtacha yo'l, tokenizatsiya aslida siqish.",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "Kod nima chiqaradi?",
      code: "import tiktoken\nenc = tiktoken.get_encoding(\"cl100k_base\")\no200 = tiktoken.get_encoding(\"o200k_base\")\nfor e in [enc, o200]:\n    print([e.decode([i]) for i in e.encode(\"Toshkentda\")])",
      type: "single",
      options: [
        "['T', 'osh', 'kent', 'da'] keyin ['T', 'osh', 'kent', 'da']",
        "['T', 'osh', 'kent', 'da'] keyin ['T', 'osh', 'k', 'ent', 'da']",
        "['T', 'osh', 'k', 'ent', 'da'] keyin ['T', 'osh', 'kent', 'da']",
        "['Tosh', 'k', 'ent', 'da'] keyin ['Tosh', 'kent', 'da']"
      ],
      answer: [2],
      explain: "cl100k 5 ta tokenga bo'ladi, o200k esa 4 taga: uning lug'atida 'kent' butun bor, chunki u ko'p tilli matnda tez-tez uchraydi. o200k ning o'zbekchada tejami shundan keladi.",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "Beshta jumla juftligida o'zbekcha matn inglizchaga nisbatan necha baravar ko'p token oldi?",
      type: "single",
      options: [
        "cl100k da 1.66×, o200k da 1.88× — gpt-4o tokenizatori qimmatroq",
        "Ikkalasida ham taxminan 1.1× — til deyarli farq qilmaydi",
        "cl100k da 2.5×, o200k da 2.5× — lug'at hajmi ta'sir qilmaydi",
        "cl100k da 1.88×, o200k da 1.66× — gpt-4o o'zbekchaga arzonroq"
      ],
      answer: [3],
      explain: "O'lchov: cl100k (gpt-4, gpt-3.5) 1.88×, o200k (gpt-4o oilasi) 1.66× — taxminan 12% tejash. Sababi o200k lug'ati ikki baravar katta va unda ko'p tilli bo'laklar ko'proq.",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "O'zbekcha matn nega ko'proq token oladi? Darsda ko'rsatilgan sabablarni tanlang. (bir nechta javob)",
      type: "multi",
      options: [
        "Apostrof (o', g', sun'iy) har safar alohida token bo'ladi",
        "Agglutinatsiya: qo'shimchalar yopishib, so'z noyob bo'ladi",
        "Lug'atda o'zbekcha bo'laklar deyarli yo'q",
        "Tokenizator lotin yozuvini emas, faqat kirill yozuvini taniydi",
        "o200k lug'ati cl100k dan kichikroq, shuning uchun so'zlar ko'p bo'linadi"
      ],
      answer: [0, 1, 2],
      explain: "Masalan, \"sun'iy\" → ['sun', \"'\", 'iy'], \"kompaniyamiz\" → 5 token. o200k lug'ati esa aksincha kattaroq (200 019 va 100 277).",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "Token tejash uchun o'zbekcha matnni apostrofsiz yozish (ozbek, suniy) tavsiya etiladi.",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "Tejash arzimas, lekin bu imlo xatosi va model ma'noni yomonroq tushunadi. To'g'ri yechim — gpt-4o tokenizatorli modelni tanlash, apostrofni o'chirmaslik.",
      lesson: { title: "Tokenlar", href: "01-Tokens.md" }
    },
    {
      q: "gpt-4o-mini narxlari bilan (kirish $0.15, chiqish $0.60 — 1M token uchun) 1000 ta so'rov qancha turadi? Har so'rovda 500 kirish va 200 chiqish tokeni.",
      code: "ki, ch = 0.15, 0.60\nnarx = 1000 * (500*ki + 200*ch) / 1e6\nprint(f\"{narx:.3f}\")",
      type: "single",
      options: [
        "0.375",
        "0.075",
        "0.195",
        "0.750"
      ],
      answer: [2],
      explain: "500 × 0.15 + 200 × 0.60 = 75 + 120 = 195; 1000 × 195 / 1 000 000 = 0.195 dollar. Chiqish tokenlari kamroq bo'lsa ham narxning kattaroq qismini beradi.",
      lesson: { title: "Modellar va narxlar", href: "02-Models-and-Prices.md" }
    },
    {
      q: "Chiqish tokenlari kirishdan 3–4× qimmat. Qaysi foydalanish usuli nisbatan arzonroq tushadi?",
      type: "single",
      options: [
        "Qisqa prompt berib, modeldan uzun maqola yozdirish",
        "Uzun hujjatni yuborib, qisqa javob so'rash — RAG kabi",
        "max_tokens ni belgilamasdan, modelga erkin yozdirish",
        "Har savolga kirish va chiqish teng bo'lishini ta'minlash"
      ],
      answer: [1],
      explain: "Kirish arzon (model faqat o'qiydi), chiqish qimmat (har token alohida yaratiladi). Shuning uchun uzun kontekst + qisqa javob arzonroq; max_tokens ni doim belgilash tavsiya etiladi.",
      lesson: { title: "Modellar va narxlar", href: "02-Models-and-Prices.md" }
    },
    {
      q: "128 000 tokenlik kontekst oynasiga o'zbekcha matnda taxminan qancha so'z sig'adi va bundan qanday xulosa chiqadi?",
      type: "single",
      options: [
        "~61 ming so'z — inglizchaning deyarli yarmi, shuning uchun RAG kerak",
        "~115 ming so'z — til oyna hajmiga ham, so'z soniga ham ta'sir qilmaydi",
        "~230 ming so'z — o'zbekcha so'zlar qisqa bo'lgani uchun ko'proq sig'adi",
        "~8 ming so'z — oynaning asosiy qismi javob yaratish uchun ajratilgan"
      ],
      answer: [0],
      explain: "128k token ≈ 115 200 inglizcha so'z, lekin o'zbekchada ≈ 61 ming so'z — deyarli yarmi. O'zbekcha hujjat tezroq sig'may qoladi, shuning uchun butun hujjat o'rniga mos bo'laklarni topib yuborish (RAG) kerak.",
      lesson: { title: "Modellar va narxlar", href: "02-Models-and-Prices.md" }
    },
    {
      q: "Kurs model tanlashda qaysi uchta mezonni sanab o'tadi? (bir nechta javob)",
      type: "multi",
      options: [
        "Kirish va chiqish tokenlari narxi",
        "Ma'lumotlarning cut-off sanasi",
        "Kontekst oynasi chegarasi",
        "Modeldagi parametrlar umumiy soni",
        "Modelni o'qitgan jamoa hajmi"
      ],
      answer: [0, 1, 2],
      explain: "Kurs narx, cut-off sana va kontekst oynasini aytadi. Dars bunga tezlik, o'zbek tilini qo'llab-quvvatlash va ma'lumot qayerga borishini qo'shadi.",
      lesson: { title: "Modellar va narxlar", href: "02-Models-and-Prices.md" }
    },
    {
      q: "Dars nega RAG'da hujjatlarni indekslash deyarli bepul deydi?",
      type: "single",
      options: [
        "Chunki OpenAI embedding so'rovlari uchun umuman pul olmaydi",
        "Chunki embedding faqat kirish emas, chiqish tokeni sifatida hisoblanadi",
        "Chunki embedding modeli faqat birinchi 1000 tokenni o'qiydi",
        "Chunki embedding arzon ($0.02) va bir marta hisoblanib saqlanadi"
      ],
      answer: [3],
      explain: "text-embedding-3-small 1M token uchun $0.02 — chat modelidan 7.5× arzon, va u bir marta hisoblanib saqlanadi. Asosiy xarajat esa har safar bajariladigan javob yaratishda.",
      lesson: { title: "Modellar va narxlar", href: "02-Models-and-Prices.md" }
    },
    {
      q: "Kod nima chiqaradi?",
      code: "def sigadimi(t, oyna=128000, javob_uchun=4000):\n    qoldiq = oyna - javob_uchun - t\n    return qoldiq > 0\n\nprint(sigadimi(124000), sigadimi(123000))",
      type: "single",
      options: [
        "True True",
        "False True",
        "True False",
        "False False"
      ],
      answer: [1],
      explain: "124 000 da qoldiq 128 000 − 4 000 − 124 000 = 0, 0 > 0 esa False. 123 000 da qoldiq 1 000 — True. Kontekst oynasi kirish va chiqish uchun umumiy, shuning uchun javobga joy ajratiladi.",
      lesson: { title: "Modellar va narxlar", href: "02-Models-and-Prices.md" }
    },
    {
      q: "Kurs tavsiya qilgan gpt-4 ning kontekst oynasi 8k token, gpt-4o-mini niki esa 128k token.",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [0],
      explain: "Darsdagi jadvalda gpt-4 — 8 192, gpt-4o va gpt-4o-mini — 128 000 token. gpt-4 ning kichik oynasi, yuqori narxi va sekinligi — bugun uni tanlamaslik sabablari.",
      lesson: { title: "Modellar va narxlar", href: "02-Models-and-Prices.md" }
    }
  ]
};
