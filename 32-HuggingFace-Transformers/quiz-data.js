window.QUIZ = {
  id: "32",
  title: "Hugging Face Transformers",
  subtitle: "pipeline, tokenizatorlar, maxsus tokenlar, PyTorch bilan qo'lda inferens va modellarni saqlash",
  next: { label: "BERT bilan savol-javob modellari", href: "../33-BERT-Question-Answering/README.md" },
  questions: [
    {
      q: "Bank mijozlar shikoyatlarini tahlil qilmoqchi, lekin ma'lumot bank serverlaridan tashqariga chiqmasligi shart. Qaysi yondashuv bu talabga mos?",
      type: "single",
      options: [
        "OpenAI API — chunki u eng yuqori sifatni beradi va tez ishlaydi",
        "Hugging Face modelini o'z kompyuterida ishlatish — ma'lumot hech qayerga chiqmaydi",
        "OpenAI API — chunki model faqat birinchi marta internetga ulanadi",
        "Istalgan bulutli API — chunki ular ma'lumotni saqlab qolmaydi"
      ],
      answer: [1],
      explain: "Hugging Face modeli sizning kompyuteringizda ishlaydi, shuning uchun tibbiy, moliyaviy yoki korporativ ma'lumot tashqi serverga yuborilmaydi. OpenAI API esa ma'lumotni ularning serveriga yuboradi.",
      lesson: { title: "Hugging Face paketi", href: "01-Hugging-Face-Package.md" }
    },
    {
      q: "HF_HUB_OFFLINE=1 o'zgaruvchisini transformers import qilingandan keyin o'rnatsangiz ham, u offline rejimni to'liq yoqadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Darsda ta'kidlanganidek, HF_HUB_OFFLINE=1 ni ishga tushirishdan oldin o'rnatish kerak — transformers importidan keyin u ta'sir qilmaydi.",
      lesson: { title: "Hugging Face paketi", href: "01-Hugging-Face-Package.md" }
    },
    {
      q: "pipeline(\"sentiment-analysis\") ni model ko'rsatmasdan chaqirganda \"No model was supplied\" xabari chiqdi. Nega ishlab chiqarishda modelni doim ko'rsatish tavsiya etiladi?",
      type: "single",
      options: [
        "Model ko'rsatilmasa pipeline umuman ishlamaydi va xato qaytaradi",
        "Model ko'rsatilmasa pipeline internetsiz ishlay olmaydi",
        "Standart model paket versiyasi bilan o'zgarishi va natija boshqacha chiqishi mumkin",
        "Standart model faqat TensorFlow bilan ishlaydi, PyTorch bilan emas"
      ],
      answer: [2],
      explain: "Pipeline ishlaydi, lekin o'zining standart modeliga o'tadi. Bu model versiya bilan o'zgarishi mumkin, shuning uchun bugun ishlagan kod ertaga boshqa natija beradi — model=\"...\" yozish natijani barqaror qiladi.",
      lesson: { title: "Transformer pipeline", href: "02-The-Transformer-Pipeline.md" }
    },
    {
      q: "Quyidagi NER kodi aggregation_strategy parametrisiz ishlatildi. Natijada \"New York City\" qanday qaytadi?",
      code: "ner2 = pipeline('ner', model='dbmdz/bert-large-cased-finetuned-conll03-english')\nmatn = 'Her name is Anna and she works in New York City for Morgan Stanley.'\nfor r in ner2(matn):\n    print(r['entity'], r['word'])",
      type: "single",
      options: [
        "Bitta LOC obyekti sifatida: New York City",
        "Umuman topilmaydi, chunki model faqat shaxslarni aniqlaydi",
        "Bitta ORG obyekti sifatida: New York City",
        "Uchta alohida I-LOC natijasi: New, York, City"
      ],
      answer: [3],
      explain: "aggregation_strategy=\"simple\" bo'lmasa, NER har bir so'z yoki bo'lakni alohida qaytaradi: I-LOC New, I-LOC York, I-LOC City. \"simple\" bilan esa ular bitta New York City obyektiga birlashadi.",
      lesson: { title: "Transformer pipeline", href: "02-The-Transformer-Pipeline.md" }
    },
    {
      q: "facebook/bart-large-mnli zero-shot modeli \"Mahsulot juda sifatsiz, pulimni qaytaring\" matnini \"maqtov\" deb belgiladi. Darsga ko'ra o'zbekcha shikoyatlarni saralash uchun eng ishonchli yechim qaysi?",
      type: "single",
      options: [
        "50–100 ta yorliqli misol yig'ib, sklearn modelini o'qitish",
        "Yorliqlarni inglizcha yozib, zero-shot natijasiga to'liq ishonish",
        "Kichikroq distilbart-mnli modeliga o'tib, yuklashni tezlashtirish",
        "Nomzod yorliqlar sonini oshirib, eng yuqori ballni tanlash"
      ],
      answer: [0],
      explain: "Inglizcha yorliqlar biroz yordam berishi mumkin, lekin matn o'zbekcha qolgani uchun kafolat yo'q. Ishonchli yechim — 50–100 ta yorliqli misol yig'ib, 28-moduldagi kabi sklearn modelini o'qitish.",
      lesson: { title: "Transformer pipeline", href: "02-The-Transformer-Pipeline.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "from transformers import AutoTokenizer\ntokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')\nprint(tokenizer.decode(101), tokenizer.decode(102))",
      type: "single",
      options: [
        "[SEP] [CLS]",
        "[CLS] [SEP]",
        "[PAD] [UNK]",
        "<cls> <sep>"
      ],
      answer: [1],
      explain: "BERT tokenizatorida 101 — [CLS], 102 — [SEP]. Bu maxsus tokenlarni tokenizator input_ids ning boshiga va oxiriga o'zi qo'shadi; <cls> va <sep> esa XLNet tokenlari.",
      lesson: { title: "Oldindan o'qitilgan tokenizatorlar", href: "03-Pre-trained-Tokenizers.md" }
    },
    {
      q: "Bir xil jumlani bert-base-uncased va xlnet-base-cased tokenizatorlarida solishtirdingiz. Qaysi farqlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "XLNet tokenlari oldida so'z oldidagi bo'shliqni bildiruvchi ▁ belgisi bor",
        "XLNet harf registrini saqlaydi (▁I), BERT esa hammasini kichik harfga o'tkazadi (i)",
        "XLNet ham [CLS] ga o'xshash tokenni input_ids ning boshiga qo'yadi",
        "XLNet maxsus tokenlari (<sep>, <cls>) ikkalasi ham oxirida turadi",
        "Ikkala tokenizator bir xil so'z uchun bir xil ID beradi"
      ],
      answer: [0, 1, 3],
      explain: "Uchta farq: ▁ belgisi (SentencePiece), harf registri (uncased vs cased) va maxsus tokenlar joyi — BERT'da [CLS] boshida, XLNet'da <sep> va <cls> ikkalasi oxirida. ID'lar esa butunlay boshqacha.",
      lesson: { title: "Oldindan o'qitilgan tokenizatorlar", href: "03-Pre-trained-Tokenizers.md" }
    },
    {
      q: "Dasturchi BERT tokenizatori bilan olingan input_ids ni XLNet modeliga berdi. Nima uchun bu jiddiy xato?",
      type: "single",
      options: [
        "XLNet modeli PyTorch tenzorlarini umuman qabul qilmaydi",
        "BERT tokenizatori attention_mask qaytarmaydi, XLNet esa uni talab qiladi",
        "Har modelning o'z lug'ati bor: masalan 102 BERT'da [SEP], XLNet'da esa ▁so",
        "BERT ID'lari XLNet uchun juda katta, shuning uchun model xotirasi to'lib qoladi"
      ],
      answer: [2],
      explain: "Tokenizator va model juftlik: bir xil raqam turli modellarda turli so'zni anglatadi. Aralashtirsangiz, model butunlay boshqa matnni ko'radi va natija ma'nosiz bo'ladi.",
      lesson: { title: "Oldindan o'qitilgan tokenizatorlar", href: "03-Pre-trained-Tokenizers.md" }
    },
    {
      q: "Bu kod qanday token_type_ids chop etadi?",
      code: "tok = AutoTokenizer.from_pretrained('bert-base-uncased')\ne = tok('The cat sat.', 'It was sleepy.')\nprint(e['token_type_ids'])",
      type: "single",
      options: [
        "[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
        "[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]",
        "[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]",
        "[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]"
      ],
      answer: [3],
      explain: "Tokenlar: [CLS] the cat sat . [SEP] it was sleepy . [SEP]. Birinchi jumla va uning [SEP] i 0 oladi (6 ta), ikkinchi jumla va oxirgi [SEP] esa 1 oladi (5 ta).",
      lesson: { title: "Maxsus tokenlar", href: "04-Special-Tokens.md" }
    },
    {
      q: "all_special_tokens ni chop etganda BERT'da 5 ta, distilgpt2 da esa atigi bitta (<|endoftext|>) maxsus token chiqdi. Buning sababi nima?",
      type: "single",
      options: [
        "GPT faqat decoder: u matnni davom ettiradi, shuning uchun [CLS] va [MASK] kerak emas",
        "distilgpt2 kichik model bo'lgani uchun maxsus tokenlar siqib tashlangan",
        "GPT tokenizatori maxsus tokenlarni lug'atning oxiriga yashirib qo'yadi",
        "distilgpt2 faqat bitta jumla bilan ishlaydi, shuning uchun unga [PAD] yetarli"
      ],
      answer: [0],
      explain: "GPT — faqat decoder model: u tasniflamaydi ([CLS] kerak emas) va o'rtadagi bo'sh joyni emas, keyingi so'zni bashorat qiladi ([MASK] kerak emas). Unga faqat \"matn tugadi\" belgisi kerak.",
      lesson: { title: "Maxsus tokenlar", href: "04-Special-Tokens.md" }
    },
    {
      q: "fill-mask bilan \"The doctor said [MASK] would be late.\" va \"The nurse said [MASK] would be late.\" sinaldi: nurse uchun she 0.5556, he 0.1442 chiqdi. Bu sinov nimani ko'rsatadi?",
      type: "single",
      options: [
        "BERT grammatikani yaxshi bilmasligini, chunki u ikki tomonlama emas",
        "Model ma'lumotdagi gender stereotipini o'rganib, uni takrorlashini",
        "[MASK] tokeni faqat olmoshlarni bashorat qila olishini",
        "Model hamshira so'zini lug'atida umuman topa olmaganini"
      ],
      answer: [1],
      explain: "Bu gender tarafkashligining o'lchangan isboti: \"hamshira = ayol\" stereotipi kuchli. [MASK] — tarafkashlikni topishning eng sodda usuli, uni ishlab chiqarishdan oldin o'tkazish kerak.",
      lesson: { title: "Maxsus tokenlar", href: "04-Special-Tokens.md" }
    },
    {
      q: "Model logits = tensor([[-3.9707, 4.2408]]) qaytardi va model.config.id2label = {0: 'NEGATIVE', 1: 'POSITIVE'}. Oxirgi qator nimani chop etadi?",
      code: "with torch.no_grad():\n    logits = model(**ids).logits\npred_id = logits.argmax().item()\nprint(model.config.id2label[pred_id])",
      type: "single",
      options: [
        "NEGATIVE",
        "1",
        "POSITIVE",
        "4.2408"
      ],
      answer: [2],
      explain: "argmax eng katta xom ball indeksini beradi — 4.2408 ga mos 1. id2label[1] esa uni POSITIVE yorlig'iga aylantiradi. Aynan shu natijani pipeline ham beradi.",
      lesson: { title: "Hugging Face va PyTorch/TensorFlow", href: "05-PyTorch-TensorFlow.md" }
    },
    {
      q: "torch.no_grad() haqida qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "Gradientlar saqlanmagani uchun xotira tejaladi",
        "Ortga tarqalish grafigi qurilmagani uchun tezroq ishlaydi",
        "Uni modelni o'qitayotganda ham ishlatish kerak",
        "U logitlarni avtomatik ravishda ehtimolliklarga aylantiradi",
        "U faqat inferens (bashorat) uchun mo'ljallangan"
      ],
      answer: [0, 1, 4],
      explain: "no_grad() gradientlarni hisoblamaydi: xotira tejaladi va tezroq ishlaydi. Bu faqat inferens uchun — o'qitishda gradientlar kerak. Logitlarni ehtimollikka softmax aylantiradi, no_grad emas.",
      lesson: { title: "Hugging Face va PyTorch/TensorFlow", href: "05-PyTorch-TensorFlow.md" }
    },
    {
      q: "save_pretrained dan keyin katalogda model.safetensors paydo bo'ldi, pytorch_model.bin emas. Nega safetensors formati afzal?",
      type: "single",
      options: [
        "U og'irliklarni siqib, model hajmini o'n barobar kamaytiradi",
        "U lug'at va tokenizatsiya qoidalarini ham o'z ichiga oladi",
        "U modelni TensorFlow'da ham ochishning yagona usuli",
        "U faqat raqamlarni saqlaydi, .bin (pickle) esa yuklashda kod bajarishi mumkin"
      ],
      answer: [3],
      explain: "pytorch_model.bin Python pickle formatida — notanish manbadan yuklanganda zararli kod ishga tushishi mumkin. safetensors faqat raqamlarni saqlaydi, shuning uchun xavfsiz. Lug'at esa tokenizer.json da.",
      lesson: { title: "Modellarni saqlash va yuklash", href: "06-Saving-and-Loading-Models.md" }
    },
    {
      q: "from_pretrained Hub'dan modelni istalgan vaqtda yuklab bera oladi. Unda nima uchun ishlab chiqarishda modelni o'zingizda saqlash tavsiya etiladi?",
      type: "single",
      options: [
        "Hub'dan yuklangan model har safar qayta o'qitilishi kerak",
        "Hub'dagi model muallif tomonidan yangilanishi yoki o'chirilishi mumkin",
        "Hub'dan yuklangan model diskdagidan boshqacha logit beradi",
        "from_pretrained disk yo'lini qabul qilmaydi, faqat Hub nomini"
      ],
      answer: [1],
      explain: "Barqarorlik — eng ko'p unutiladigan sabab: Hub'dagi model o'zgarsa yoki o'chirilsa, undan to'g'ridan-to'g'ri yuklaydigan tizim ishlamay qoladi. from_pretrained esa disk yo'lini ham qabul qiladi.",
      lesson: { title: "Modellarni saqlash va yuklash", href: "06-Saving-and-Loading-Models.md" }
    }
  ]
};
