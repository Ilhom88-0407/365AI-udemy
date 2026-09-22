window.QUIZ = {
  id: "30",
  title: "Transformer arxitekturasi",
  subtitle: "RNN muammosi, e'tibor mexanizmi, embeddinglar, ko'p boshli va niqoblangan e'tibor, feed-forward va keyingi so'z bashorati",
  next: { label: "GPT modellari bilan ishlash", href: "../31-GPT-Models/README.md" },
  questions: [
    {
      q: "Chuqur o'qitishda \"optimallashtirish\" deganda nima tushuniladi?",
      type: "single",
      options: [
        "Model hajmini kamaytirish uchun qatlamlarni olib tashlash",
        "Og'irliklarni bashorat xatosini kamaytiradigan qilib yangilash",
        "Kirish matnini tozalab, stop so'zlar va shovqindan xalos qilish",
        "Gul turini aniqlash uchun qoidalarni qo'lda yozib, sozlab chiqish"
      ],
      answer: [1],
      explain: "O'qitish davomida og'irliklar bashorat va haqiqat o'rtasidagi farqni minimallashtirish uchun millionlab marta sozlanadi. SGDClassifier dagi SGD ham aynan shu jarayon.",
      lesson: { title: "Chuqur o'qitishni takrorlash", href: "01-Deep-Learning-Recap.md" }
    },
    {
      q: "Darsdagi soddalashtirilgan RNN g'oyasi asosida quyidagi kod nimani chop etadi?",
      code: "def rnn(sozlar, unutish=0.5):\n    xotira = {}\n    for s in sozlar:\n        for k in xotira:\n            xotira[k] *= unutish\n        xotira[s] = 1.0\n    return xotira\n\nx = rnn([\"a\", \"b\", \"c\"])\nprint(x[\"a\"], x[\"c\"])",
      type: "single",
      options: [
        "0.5 1.0",
        "1.0 0.25",
        "0.25 1.0",
        "0.125 0.5"
      ],
      answer: [2],
      explain: "\"a\" dan keyin ikki qadam o'tdi, har birida 0.5 ga ko'paydi: 1.0 → 0.5 → 0.25. Oxirgi \"c\" esa to'liq kuch 1.0 bilan qoladi — uzoqdagi so'z so'nadi.",
      lesson: { title: "RNN muammosi", href: "02-The-Problem-with-RNNs.md" }
    },
    {
      q: "Darsga ko'ra RNN'ning qaysi kamchiliklari transformer paydo bo'lishiga sabab bo'lgan? (bir nechta javob)",
      type: "multi",
      options: [
        "Uzun matnda boshida aytilgan narsani unutadi",
        "So'z tartibini saqlay olmaydi, jumlani so'zlar to'plami deb ko'radi",
        "Ketma-ket ishlagani uchun uni parallellashtirib bo'lmaydi",
        "Faqat rasmlar bilan ishlashga mo'ljallangan, matn uchun emas",
        "Sekin o'qitiladi, ulkan ma'lumotlarni uddalay olmaydi"
      ],
      answer: [0, 2, 4],
      explain: "RNN tartibni saqlaydi, lekin uzoq kontekstni unutadi va ketma-ket ishlagani uchun sekin — shu sababli LLM hajmidagi ma'lumotda o'qitib bo'lmasdi. Rasm uchun esa CNN mo'ljallangan.",
      lesson: { title: "RNN muammosi", href: "02-The-Problem-with-RNNs.md" }
    },
    {
      q: "\"zone économique européenne\" ni so'zma-so'z tarjima qilish nima uchun \"area economic European\" kabi noto'g'ri natija beradi?",
      type: "single",
      options: [
        "Fransuz va ingliz tillarida so'zlar tartibi farq qiladi",
        "Fransuzcha so'zlarning inglizcha tarjimasi mavjud emas",
        "Model \"économique\" so'zini lug'atda topa olmaydi",
        "Tarjima uchun encoder emas, faqat decoder kerak"
      ],
      answer: [0],
      explain: "Tarjima birga-bir munosabat emas: to'g'ri variant \"European Economic Area\". Model boshqa so'zlarga ham e'tibor bera olishi kerak — o'zbekcha SOV tartibida ham xuddi shunday.",
      lesson: { title: "Yechim — \"Attention is All You Need\"", href: "03-Attention-is-All-You-Need.md" }
    },
    {
      q: "E'tibor formulasida Q·Kᵀ ballari nima uchun √d_k ga bo'linadi?",
      type: "single",
      options: [
        "Og'irliklar yig'indisini softmax'dan oldin aniq 1 ga keltirish uchun",
        "Kelajakdagi tokenlarni modeldan yashirish (niqoblash) uchun",
        "Katta d_k da ballar ulkanlashib, softmax bitta tokenga yopishmasin",
        "Parametrlar sonini d_k baravar kamaytirib, hisobni tezlatish uchun"
      ],
      answer: [2],
      explain: "Q·Kᵀ — d_k ta ko'paytmaning yig'indisi, shuning uchun o'lcham oshsa ballar o'sadi. Masshtabsiz softmax bitta tokenga yopishadi va gradiyent yo'qoladi. Yig'indini 1 ga keltirish esa softmax ning ishi.",
      lesson: { title: "Yechim — \"Attention is All You Need\"", href: "03-Attention-is-All-You-Need.md" }
    },
    {
      q: "Darsdagi uchta oila bo'yicha qaysi moslashtirish to'g'ri?",
      type: "single",
      options: [
        "BERT — faqat decoder, GPT — faqat encoder, T5 — ikkalasi",
        "BERT — faqat encoder, GPT — faqat decoder, T5 — encoder + decoder",
        "BERT va GPT — ikkalasi ham encoder + decoder, T5 — faqat encoder",
        "BERT — encoder + decoder, GPT — faqat decoder, T5 — faqat encoder"
      ],
      answer: [1],
      explain: "Encoder tushunish uchun (BERT, DistilBERT), decoder yaratish uchun (GPT, LLaMA), ikkalasi birga tarjima va xulosalash uchun (T5, BART).",
      lesson: { title: "Transformer arxitekturasi", href: "04-The-Transformer-Architecture.md" }
    },
    {
      q: "distilbert tokenizatori \"I love NLP\" jumlasini qayta ishlaydi. So'z embeddingi tensorining shakli qanday bo'ladi?",
      code: "ids_t = torch.tensor([tok.encode(\"I love NLP\")])\nw = mod.embeddings.word_embeddings(ids_t)\nprint(tuple(w.shape))",
      type: "single",
      options: [
        "(1, 3, 768)",
        "(1, 5, 768)",
        "(3, 768)",
        "(1, 6, 768)"
      ],
      answer: [3],
      explain: "Tokenlar: [CLS], i, love, nl, ##p, [SEP] — jami 6 ta. \"NLP\" lug'atda yo'q, shuning uchun ikkiga bo'lindi, [CLS] va [SEP] esa avtomatik qo'shiladi.",
      lesson: { title: "Kirish embeddinglari", href: "05-Input-Embeddings.md" }
    },
    {
      q: "Kirish embeddingida cos(good, great) = 0.526, cos(good, bad) = 0.528 chiqdi. Dars bundan qanday xulosa chiqaradi?",
      type: "single",
      options: [
        "Embedding matritsasi noto'g'ri o'qitilgan va uni qayta o'qitish kerak",
        "Kirish embeddingi kontekstsiz; sentimentni keyingi e'tibor qatlamlari quradi",
        "\"good\" va \"bad\" aslida sinonim so'zlar, shuning uchun vektorlari yaqin",
        "Kosinus o'xshashligi so'zlarni solishtirish uchun yaroqsiz o'lchov"
      ],
      answer: [1],
      explain: "Ikkalasi ham sifat va bir xil joyga tushadi, shuning uchun kirish embeddingi ularni yaqin qo'yadi. Kontekstga moslashgan ma'noni keyingi e'tibor qatlamlari hosil qiladi.",
      lesson: { title: "Kirish embeddinglari", href: "05-Input-Embeddings.md" }
    },
    {
      q: "distilbert'da yashirin o'lcham 768 va boshlar soni 12. Bitta boshning d_k qiymati qancha?",
      code: "hidden = 768\nn_heads = 12\nd_k = hidden // n_heads\nprint(d_k)",
      type: "single",
      options: [
        "64",
        "9216",
        "768",
        "12"
      ],
      answer: [0],
      explain: "768 / 12 = 64. O'lcham boshlar orasida bo'linadi, ko'paytirilmaydi — shuning uchun 12 bosh qo'shimcha o'lcham xarajati keltirmaydi.",
      lesson: { title: "Ko'p boshli e'tibor", href: "06-Multi-Headed-Attention.md" }
    },
    {
      q: "\"it\" → \"times\" bog'lanishini qidirishda 12 boshning o'rtachasi faqat 0.081 berdi, qatlam 5, bosh 5 esa 0.584. Nima uchun o'rtacha olish xato?",
      type: "single",
      options: [
        "O'rtacha olishda softmax qayta qo'llanmagani uchun qiymatlar buziladi",
        "Faqat oxirgi qatlamni ko'rish kerak, o'rtacha esa barcha qatlamlarni aralashtiradi",
        "Har bosh boshqa narsani o'rganadi, o'rtacha esa signallarni yo'qotadi",
        "O'rtacha olish [CLS] va [SEP] tokenlarini hisobdan chiqarib yuboradi"
      ],
      answer: [2],
      explain: "Masalan, qatlam 1 bosh 0 faqat keyingi so'zga qaraydi, qatlam 5 bosh 5 esa koreferensiyani topadi. Ularni o'rtacha qilish \"multi-head\" ma'nosini yo'q qiladi.",
      lesson: { title: "Ko'p boshli e'tibor", href: "06-Multi-Headed-Attention.md" }
    },
    {
      q: "\"very good\" va \"not good\" jumlalaridagi \"good\" vektorlari 0-qatlamda cos = 1.0000, 6-qatlamda esa cos = -0.1150 berdi. Bu nimani isbotlaydi?",
      type: "single",
      options: [
        "Model 6-qatlamda \"good\" so'zining token ID sini boshqasiga almashtiradi",
        "Pozitsion kodlash ikki jumlada turlicha bo'lgani uchun vektorlar farqlanadi",
        "Chuqur qatlamlarda vektorlar ma'nosiz tasodifiy shovqinga aylanadi",
        "E'tibor qatlamlari kontekstga (\"not\" ga) qarab so'z vektorini o'zgartiradi"
      ],
      answer: [3],
      explain: "Bir xil so'z, bir xil ID, bir xil boshlang'ich vektor — lekin model \"not\" ni ko'rib \"good\" ma'nosini o'zgartirdi. Bu kontekstual embeddingning mohiyati.",
      lesson: { title: "Ko'p boshli e'tibor", href: "06-Multi-Headed-Attention.md" }
    },
    {
      q: "Feed-forward qatlamidagi GELU kabi aktivatsiya funksiyasi olib tashlansa (lin2(lin1(x))), nima bo'ladi?",
      type: "single",
      options: [
        "Ikki chiziqli qatlam bitta chiziqli qatlamga teng bo'lib qoladi",
        "Model faqat manfiy qiymatlarni o'tkazadigan bo'lib qoladi",
        "Tokenlar endi parallel emas, bittalab ketma-ket qayta ishlanadi",
        "Qatlam 768 → 3072 o'rniga 768 → 768 o'lchamga o'tib qoladi"
      ],
      answer: [0],
      explain: "W₂·(W₁·x) = (W₂·W₁)·x = W·x — chiziqsizliksiz 6 qatlam ham bitta qatlamga teng bo'lardi. O'lchamlar va parallellik esa aktivatsiyaga bog'liq emas.",
      lesson: { title: "Feed-forward qatlam", href: "07-Feed-Forward-Layer.md" }
    },
    {
      q: "Quyidagi kod nimani chop etadi?",
      code: "import torch\nn = 3\nballar = torch.zeros(n, n)\nniqob = torch.triu(torch.ones(n, n), diagonal=1).bool()\nw = torch.softmax(ballar.masked_fill(niqob, float(\"-inf\")), dim=-1)\nprint(w[1].tolist())",
      type: "single",
      options: [
        "[0.3333, 0.3333, 0.3333]",
        "[1.0, 0.0, 0.0]",
        "[0.5, 0.5, 0.0]",
        "[0.0, 0.5, 0.5]"
      ],
      answer: [2],
      explain: "1-qatorda faqat 2-ustun (kelajak) -inf bilan niqoblanadi. Qolgan ikkita teng ball (0 va 0) softmax'dan keyin 0.5 va 0.5 bo'ladi, exp(-inf) esa aniq 0.",
      lesson: { title: "Niqoblangan ko'p boshli e'tibor", href: "08-Masked-Multihead-Attention.md" }
    },
    {
      q: "Decoder'dagi niqoblangan e'tibor haqida qaysi fikrlar dars bilan mos keladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Niqobsiz model keyingi so'zni ko'rib turib, o'rganish o'rniga nusxa ko'chirardi",
        "Niqob o'qitish davomida o'rganiladi va model uni kerak bo'lsa buzishi mumkin",
        "distilgpt2 ning e'tibor matritsasi pastki uchburchak — yuqori qismi aniq nol",
        "BERT ham xuddi shunday niqob ishlatgani uchun matn yaxshi yoza oladi",
        "Niqob softmax'dan oldin kelajak pozitsiyalariga -inf qo'yish orqali qo'llanadi"
      ],
      answer: [0, 2, 4],
      explain: "Niqob arxitekturaga qattiq kiritilgan, o'rganilmaydi — 72/72 bosh uni to'g'ri qo'llaydi. BERT esa to'liq matritsadan foydalanadi va kelajakni ko'radi, shuning uchun u tushunish uchun mo'ljallangan.",
      lesson: { title: "Niqoblangan ko'p boshli e'tibor", href: "08-Masked-Multihead-Attention.md" }
    },
    {
      q: "distilgpt2 \"The cat sat on the\" uchun eng yuqori ehtimolni \"floor\" ga atigi 0.065 berdi. Tasdiq: \"Bu past ehtimol model jumlani tushunmaganini ko'rsatadi.\"",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "floor, bed, couch, table kabi o'nlab to'g'ri javob bor — model ehtimolni to'g'ri tarqatgan. floor ga 0.99 berilsa, bu haddan tashqari ishonch bo'lardi.",
      lesson: { title: "Yakuniy natijalarni bashorat qilish", href: "09-Predicting-the-Final-Outputs.md" }
    }
  ]
};
