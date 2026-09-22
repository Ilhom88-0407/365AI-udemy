window.QUIZ = {
  id: "34",
  title: "XLNet bilan matn tasnifi",
  subtitle: "Permutatsiya g'oyasi, ma'lumotni tayyorlash, XLNet tokenlash, Trainer bilan fine-tuning va baholash",
  next: { label: "LangChain'ga kirish", href: "../35-LangChain-Introduction/README.md" },
  questions: [
    {
      q: "XLNet'ning permutatsiyaga asoslangan o'qitishida aslida nima aralashtiriladi?",
      type: "single",
      options: [
        "Jumladagi so'zlarning o'zi — ular tasodifiy joylarga ko'chiriladi",
        "Pozitsion embeddinglar — har epoxada so'zlarga yangi raqamlar beriladi",
        "Bashorat tartibi — so'zlar joyida qoladi, kim kimni ko'rishi o'zgaradi",
        "Lug'at — har batch uchun boshqa tokenlar to'plami tasodifan tanlanadi"
      ],
      answer: [2],
      explain: "Eng ko'p uchraydigan noto'g'ri tushuncha — \"XLNet so'zlarni aralashtiradi\". Aslida so'zlar va pozitsion embeddinglar joyida qoladi; o'zgaradigan narsa — e'tibor maskasi, ya'ni bashorat tartibi.",
      lesson: { title: "GPT, BERT va XLNet", href: "01-GPT-vs-BERT-vs-XLNet.md" }
    },
    {
      q: "XLNet ham BERT kabi oldindan o'qitishda [MASK] tokenidan foydalanadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "XLNet [MASK] ni umuman ishlatmaydi — bu uning BERT'dan asosiy farqi. Shu bilan u o'qitish va ishlatish sharoiti turlicha bo'lish muammosini ham, BERT'ning mustaqillik farazini ham bartaraf qiladi.",
      lesson: { title: "GPT, BERT va XLNet", href: "01-GPT-vs-BERT-vs-XLNet.md" }
    },
    {
      q: "Hissiyotlar to'plamida 7102 ta matndan 2252 tasi fear. Muvozanatlashtirishdan oldin o'qitilgan model 30% aniqlik ko'rsatdi. Bu natija haqida to'g'ri xulosa qaysi?",
      type: "single",
      options: [
        "Yaxshi natija, chunki u tasodifiy tanlashdan (25%) yuqori",
        "Yomon natija, chunki har doim fear deydigan model ham 31.7% oladi",
        "Yaxshi natija, chunki 4 sinfli vazifada 30% odatiy chegara",
        "Baholab bo'lmaydi, chunki aniqlik muvozanatsiz to'plamda hisoblanmaydi"
      ],
      answer: [1],
      explain: "Bazaviy chiziq: \"hech nima o'rganmagan\" va doim fear deydigan model 2252/7102 = 31.7% oladi. 30% undan past, demak model foydali narsa o'rganmagan. Bu raqamni har doim hisoblash kerak.",
      lesson: { title: "Ma'lumotni tayyorlash", href: "02-Preprocessing-Our-Data.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "from sklearn.preprocessing import LabelEncoder\nle = LabelEncoder()\ny = le.fit_transform(['joy', 'fear', 'anger', 'sadness', 'joy'])\nprint(y)",
      type: "single",
      options: [
        "[0 1 2 3 0]",
        "[1 2 0 3 1]",
        "[2 1 0 3 2]",
        "[3 1 0 2 3]"
      ],
      answer: [2],
      explain: "LabelEncoder alifbo tartibida raqamlaydi: anger=0, fear=1, joy=2, sadness=3. Shuning uchun joy → 2, fear → 1, anger → 0, sadness → 3. Aynan shu xarita keyin id2label ga yoziladi.",
      lesson: { title: "Ma'lumotni tayyorlash", href: "02-Preprocessing-Our-Data.md" }
    },
    {
      q: "cleaner(t, no_emoji=True) \"AMAZING!!\" ni \"amazing\" ga aylantirdi. Nega bu xlnet-base-cased bilan ishlaganda muammo va qanday tuzatiladi?",
      type: "single",
      options: [
        "cleaner emojilarni matnda qoldiradi; tuzatish — no_emoji=False berish",
        "cased model registrni biladi, cleaner esa uni yo'qotdi; tuzatish — lower=False",
        "cased model faqat kichik harflarni tushunadi; tuzatish — matnni oldindan kichik qilish",
        "cleaner @ belgisini qoldiradi; tuzatish — re.sub bilan @ ni ham olib tashlash"
      ],
      answer: [1],
      explain: "cleaner emojidan tashqari hamma harfni kichik qildi va cased modelning ustunligi yo'qoldi — katta harf (baqirish) hissiyot vazifasida muhim signal. Tuzatish: cleaner(t, no_emoji=True, lower=False).",
      lesson: { title: "Ma'lumotni tayyorlash", href: "02-Preprocessing-Our-Data.md" }
    },
    {
      q: "Train, val va test to'plamlari haqida qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Model og'irliklarini faqat train to'plamida yangilaydi",
        "Val — giperparametr tanlash uchun, unga ko'p marta qarash mumkin",
        "Test — yakuniy baho uchun, oxirida bir marta ishlatiladi",
        "Test eng katta to'plam bo'lgani uchun giperparametrlarni unga qarab sozlash kerak",
        "random_state faqat chiroyli natija uchun, takrorlanuvchanlikka ta'siri yo'q"
      ],
      answer: [0, 1, 2],
      explain: "TRAIN — o'rganish, VAL — sozlash (ko'p marta), TEST — bir marta, oxirida. Testga qarab sozlasangiz u buziladi va baho ishonchsiz bo'ladi. random_state=42 esa har safar bir xil bo'linish uchun shart.",
      lesson: { title: "Ma'lumotni tayyorlash", href: "02-Preprocessing-Our-Data.md" }
    },
    {
      q: "xlnet-base-cased tokenizatori (padding_side='left') bilan bu kod qanday tokenlar ro'yxatini chop etadi?",
      code: "tokenizer = XLNetTokenizer.from_pretrained('xlnet-base-cased')\ne = tokenizer('I love it', padding='max_length', max_length=8)\nprint(tokenizer.convert_ids_to_tokens(e['input_ids']))",
      type: "single",
      options: [
        "['<cls>', '▁I', '▁love', '▁it', '<sep>', '<pad>', '<pad>', '<pad>']",
        "['<pad>', '<pad>', '<pad>', '<cls>', '▁I', '▁love', '▁it', '<sep>']",
        "['▁I', '▁love', '▁it', '<sep>', '<cls>', '<pad>', '<pad>', '<pad>']",
        "['<pad>', '<pad>', '<pad>', '▁I', '▁love', '▁it', '<sep>', '<cls>']"
      ],
      answer: [3],
      explain: "XLNet chapdan to'ldiradi, <sep> va <cls> esa oxirida turadi. Shuning uchun <pad> lar boshida, <cls> doim oxirgi pozitsiyada bo'ladi — BERT'da esa [CLS] boshida va [PAD] oxirida.",
      lesson: { title: "XLNet embeddinglari", href: "03-XLNet-Embeddings.md" }
    },
    {
      q: "O'lchov ko'rsatdiki, to'plamdagi eng uzun matn 51 token, max_length=128 da esa hisoblashning 81% i <pad> ga ketmoqda. Darsga ko'ra qanday qaror to'g'ri?",
      type: "single",
      options: [
        "max_length=64 — hech narsa kesilmaydi, e'tibor O(n²) bo'lgani uchun ~4× tezroq",
        "max_length=32 — o'rtacha uzunlik 24 bo'lgani uchun eng tez va eng aniq variant",
        "max_length=128 qoldirish — 128 transformerlar uchun standart va xavfsiz qiymat",
        "max_length=256 — kattaroq qiymat modelga ko'proq kontekst berib, aniqlikni oshiradi"
      ],
      answer: [0],
      explain: "Qoida: max_length ni 99-protsentildan biroz yuqori oling. 64 ≥ 51, ya'ni hech bir matn kesilmaydi, (128/64)² = 4× tezlanish esa bepul. 32 da uzun matnlar kesilib ketadi.",
      lesson: { title: "XLNet embeddinglari", href: "03-XLNet-Embeddings.md" }
    },
    {
      q: "BERT uchun yozilgan kod tasnif vektori sifatida input_ids[0] pozitsiyasini oladi. Bu kodni XLNet'ga ko'chirsangiz nima bo'ladi?",
      type: "single",
      options: [
        "Hech narsa o'zgarmaydi, chunki XLNet'da ham <cls> boshida turadi",
        "Kod IndexError beradi, chunki XLNet'da input_ids[0] pozitsiyasi mavjud emas",
        "Jim noto'g'ri ishlaydi: indeks 0 da <pad>, <cls> esa oxirida",
        "Kod xatosiz ishlaydi, faqat <cls> o'rniga qo'shni <sep> vektori olinadi"
      ],
      answer: [2],
      explain: "XLNet chapdan to'ldiradi va <cls> oxirida turadi, shuning uchun input_ids[0] odatda <pad>. Xato chiqmaydi, lekin natija noto'g'ri — BERT'dan ko'chirilgan kod bu yerda jim noto'g'ri ishlaydi.",
      lesson: { title: "XLNet embeddinglari", href: "03-XLNet-Embeddings.md" }
    },
    {
      q: "Kursdagi bu kod transformers 5.x da TypeError beradi. Qaysi tuzatish to'g'ri?",
      code: "training_args = TrainingArguments(output_dir='test_trainer',\n                                  evaluation_strategy='epoch',\n                                  num_train_epochs=3)\ntrainer = Trainer(model=model, args=training_args,\n                  train_dataset=small_train_dataset,\n                  eval_dataset=small_eval_dataset,\n                  compute_metrics=compute_metrics,\n                  tokenizer=tokenizer)",
      type: "single",
      options: [
        "evaluation_strategy → eval_strategy va tokenizer= → processing_class=",
        "evaluation_strategy → eval_epoch va tokenizer= → processor=",
        "evaluation_strategy ni olib tashlash va tokenizer= ni TrainingArguments ga ko'chirish",
        "evaluation_strategy='epoch' → 'steps' va tokenizer= → tokenizer_class="
      ],
      answer: [0],
      explain: "5.x da evaluation_strategy olib tashlangan — yangi nomi eval_strategy. Trainer'da esa tokenizer= o'rniga processing_class= ishlatiladi, chunki Trainer endi rasm va audio bilan ham ishlaydi.",
      lesson: { title: "XLNet'ni fine-tune qilamiz", href: "04-Fine-Tuning-XLNet.md" }
    },
    {
      q: "XLNetForSequenceClassification.from_pretrained(\"xlnet-base-cased\", num_labels=4, ...) LOAD REPORT'da lm_loss.* — UNEXPECTED, logits_proj.* — MISSING deb chiqdi. Bu nimani bildiradi?",
      type: "single",
      options: [
        "Model fayli yuklashda buzilgan, uni keshdan o'chirib qayta yuklash kerak",
        "Normal holat: til modeli boshi tashlandi, tasnif boshi tasodifiy yaratildi",
        "num_labels noto'g'ri berilgan: XLNet uchun u 2 bo'lishi kerak edi",
        "Tokenizator va model mos kelmayapti, shuning uchun og'irliklar topilmadi"
      ],
      answer: [1],
      explain: "Bu fine-tuningning mohiyati: eski lm_loss boshi kerak emas va tashlanadi, yangi logits_proj boshi checkpointda yo'q, shuning uchun tasodifiy yaratiladi va o'qitishda o'rganiladi. Ogohlantirish — hammasi to'g'ri ketayotgani belgisi.",
      lesson: { title: "XLNet'ni fine-tune qilamiz", href: "04-Fine-Tuning-XLNet.md" }
    },
    {
      q: "100 namuna bilan 3 epoxa o'qitishda eval_accuracy 0.21 → 0.18 → 0.18, eval_loss esa 1.424 → 1.437 → 1.460 bo'ldi. Darsga ko'ra buning sabablari qaysilar? (bir nechta javob)",
      type: "multi",
      options: [
        "Namuna juda kichik: har sinfga ~25 ta misol 110M parametrli modelga yetmaydi",
        "id2label berilmagani uchun model sinf yorliqlarini o'zaro aralashtirib yubordi",
        "Tasodifiy yaratilgan tasnif boshini sozlashga 39 qadam yetmaydi",
        "Oxirida learning rate 0 ga tushib, model tasodifiy boshdan chiqolmaydi",
        "max_length=128 matnlarning yarmini kesib, muhim so'zlarni yo'qotdi"
      ],
      answer: [0, 2, 3],
      explain: "Model tasodifiy tanlashdan (0.25) yomonroq va loss o'smoqda — bu yomonlashish. Sabablar: juda kichik namuna, sozlanmagan tasodifiy bosh va lr jadvali. id2label berilgan edi, 128 esa hech narsani kesmaydi (eng uzun matn 51 token).",
      lesson: { title: "XLNet'ni fine-tune qilamiz", href: "04-Fine-Tuning-XLNet.md" }
    },
    {
      q: "Chalkashlik matritsasida joy 82% to'g'ri topildi, anger esa 52%; eng ko'p xatolar anger → sadness va fear → sadness. Darsga ko'ra bu nimani ko'rsatadi?",
      type: "single",
      options: [
        "Model joy sinfini yodlab olgan, chunki to'plamda unda eng ko'p misol bor",
        "Model butunlay tasodifiy ishlaydi, chunki xatolar hamma sinflarga teng tarqalgan",
        "anger yorliqlari noto'g'ri qo'yilgan, shuning uchun model uni o'rgana olmagan",
        "Model ijobiyni salbiydan ajratadi, lekin salbiy hissiyotlarni o'zaro chalkashtiradi"
      ],
      answer: [3],
      explain: "Xatolar ma'noli: anger, fear va sadness — hammasi salbiy va bir-biri bilan chalkashadi, joy esa yagona ijobiy sinf. O'rtacha 0.645 aniqlik bu farqni yashirgan edi.",
      lesson: { title: "Modelni baholaymiz", href: "05-Evaluating-Our-Model.md" }
    },
    {
      q: "Model tozalangan matnda o'qitildi, pipeline'ga esa \"I am so happy today, everything went perfectly! 😊\" kabi xom matn berilmoqda. Darsga ko'ra qanday qoida kerak?",
      type: "single",
      options: [
        "Bashoratda tozalash shart emas, chunki transformer xom matnni o'zi tushunadi",
        "Faqat emojilarni olib tashlash yetarli, katta harf va tinish belgilari ahamiyatsiz",
        "Bitta tozalash funksiyasi yozilib, u o'qitishda ham, bashoratda ham chaqirilsin",
        "Bashorat uchun alohida, yanada kuchliroq tozalash funksiyasi yozish kerak"
      ],
      answer: [2],
      explain: "Tozalanmagan matn — model ko'rmagan boshqa taqsimot: aniqlik sezilarli tushadi va sababi topilmaydi. Shuning uchun bitta tozala() funksiyasi ikkala joyda ham aynan bir xil ishlatiladi.",
      lesson: { title: "Modelni baholaymiz", href: "05-Evaluating-Our-Model.md" }
    },
    {
      q: "Darsdagi ishonchli tasniflagich mantig'iga asoslangan bu kod nimani chop etadi?",
      code: "def qaror(ballar, chegara=0.50, min_farq=0.15):\n    r = sorted(ballar.items(), key=lambda x: -x[1])\n    (l1, s1), (l2, s2) = r[0], r[1]\n    if s1 < chegara:\n        return 'noaniq'\n    if s1 - s2 < min_farq:\n        return 'ikkilanish'\n    return l1\n\nprint(qaror({'anger': 0.55, 'fear': 0.43, 'joy': 0.01, 'sadness': 0.01}))",
      type: "single",
      options: [
        "anger — eng yuqori ball 0.55 chegaradan o'tdi",
        "noaniq — 0.55 ball chegaraga yetmagani uchun",
        "fear — l2 ikkinchi nomzod qaytarilgani uchun",
        "ikkilanish — farq 0.12 < 0.15 bo'lgani uchun"
      ],
      answer: [3],
      explain: "Eng yuqori ball 0.55 chegaradan (0.50) o'tadi, lekin 1- va 2-nomzod farqi 0.55 − 0.43 = 0.12 < 0.15. Demak model ikkilanmoqda va javob 'ikkilanish' bo'ladi.",
      lesson: { title: "Modelni baholaymiz", href: "05-Evaluating-Our-Model.md" }
    }
  ]
};
