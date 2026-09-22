window.QUIZ = {
  id: "33",
  title: "BERT bilan savol-javob modellari",
  subtitle: "BERT arxitekturasi, segment embeddinglari, start/end logitlar, FAQ-bot va BERT oilasi",
  next: { label: "XLNet bilan matn tasnifi", href: "../34-Text-Classification-XLNet/README.md" },
  questions: [
    {
      q: "Quyidagi vazifalardan qaysi biri uchun darsga ko'ra BERT GPT'dan ko'ra mosroq?",
      type: "single",
      options: [
        "Mijoz bilan erkin suhbat quradigan chatbot yaratish",
        "Shartnoma matnidan savolga javob bo'lagini topish",
        "Berilgan boshlanishdan hikoyani davom ettirish",
        "Reklama uchun yangi marketing matnini yozish"
      ],
      answer: [1],
      explain: "GPT suhbat va matn yaratishda kuchli, BERT esa matnni tushunish vazifalarida — sentiment, NER va savol-javobda. Savol-javobda javob kontekst ichida turadi, uni topish uchun butun matnni ko'rish kerak.",
      lesson: { title: "GPT va BERT", href: "01-GPT-vs-BERT.md" }
    },
    {
      q: "30-modulda distilgpt2 da 72/72 e'tibor boshi niqoblangan, distilbert da esa 0/72 chiqqan edi. Bu BERT nomidagi qaysi xususiyatning texnik isboti?",
      type: "single",
      options: [
        "Encoder — model faqat kodlaydi, shuning uchun niqobga ehtiyoj yo'q",
        "Representations — model har bir so'z uchun vektor yaratadi",
        "Bidirectional — niqob yo'q, model chapga ham, o'ngga ham qaraydi",
        "Transformers — model e'tibor mexanizmiga asoslangan"
      ],
      answer: [2],
      explain: "B = Bidirectional: BERT'da niqob umuman yo'q, u maqsad so'zning ham chapidagi, ham o'ngidagi kontekstni ko'radi. GPT esa avtoregressiv — faqat oldingi so'zlarga qaraydi.",
      lesson: { title: "GPT va BERT", href: "01-GPT-vs-BERT.md" }
    },
    {
      q: "BERT kirishini qaysi embeddinglarning yig'indisi sifatida quradi? (bir nechta javob)",
      type: "multi",
      options: [
        "Token embeddinglari — bu qaysi so'z",
        "Attention embeddinglari — qaysi tokenga e'tibor berish",
        "Segment embeddinglari — qaysi jumlaga tegishli",
        "Pozitsion embeddinglari — nechanchi o'rinda turadi",
        "NSP embeddinglari — keyingi jumla qaysi"
      ],
      answer: [0, 2, 3],
      explain: "KIRISH = token + segment + pozitsion embedding. Segment embeddinglari 32-moduldagi token_type_ids ga mos keladi va BERT'ga xos; NSP esa embedding emas, oldindan o'qitish vazifasi.",
      lesson: { title: "BERT arxitekturasi", href: "02-BERT-Architecture.md" }
    },
    {
      q: "BERT NSP (Next Sentence Prediction) vazifasida qanday o'qitiladi va keyinchalik bu vazifa haqida nima aniqlangan?",
      type: "single",
      options: [
        "Juftliklarning 50% i asl keyingi jumla, 50% i tasodifiy; RoBERTa NSP'ni olib tashlab, yaxshiroq natija oldi",
        "Juftliklarning hammasi asl keyingi jumla; RoBERTa NSP'ni ikki baravar kuchaytirib, yaxshiroq natija oldi",
        "Juftliklarning 50% i asl keyingi jumla, 50% i tasodifiy; bu BERT'ning eng kuchli tomoni deb tan olingan",
        "Model keyingi jumlani so'zma-so'z yaratadi; shuning uchun BERT'ga decoder qo'shilgan"
      ],
      answer: [0],
      explain: "NSP'da jumlalarning yarmi asl keyingi jumla bilan, yarmi tasodifiy jumla bilan juftlanadi. RoBERTa NSP'ni butunlay olib tashladi va natija yaxshilandi — ya'ni NSP BERT'ning eng kuchli tomoni emas.",
      lesson: { title: "BERT arxitekturasi", href: "02-BERT-Architecture.md" }
    },
    {
      q: "SQuAD'da sozlangan BERT QA modeli kontekstda yo'q javobni ham o'z bilimidan yaratib bera oladi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "BERT QA extractive: u javobni faqat berilgan matndan ajratib oladi va o'ylab topa olmaydi. Shuning uchun u yolg'on to'qimaydi, lekin kontekstda yo'q javobni ham topa olmaydi.",
      lesson: { title: "Modelni va tokenizatorni yuklash", href: "03-Loading-Model-and-Tokenizer.md" }
    },
    {
      q: "print(model.qa_outputs) natijasi Linear(in_features=1024, out_features=2, bias=True). Bu ikki chiqish nimani bildiradi?",
      type: "single",
      options: [
        "Javob ijobiy yoki salbiy ekanini bildiruvchi ikki ball",
        "Tokenning savol yoki kontekst segmentiga tegishliligini",
        "Kontekstda javob bor yoki yo'qligini bildiruvchi ball",
        "Javob boshlanishi (START) va tugashi (END) ballarini"
      ],
      answer: [3],
      explain: "qa_outputs — vazifaga xos chiqish qatlami. U har bir token uchun ikkita ball beradi: javob shu yerda boshlanadimi (START) va shu yerda tugaydimi (END).",
      lesson: { title: "Modelni va tokenizatorni yuklash", href: "03-Loading-Model-and-Tokenizer.md" }
    },
    {
      q: "Kursdagi tokenizer.encode_plus(savol, hujjat) transformers 5.x da AttributeError berdi. Qaysi qator uning o'rnini to'g'ri bosadi?",
      code: "savol = 'When was the first DVD released?'\nhujjat = 'The DVD is a digital optical disc data storage format.'\nkodlash = ...  # qaysi variant?\nprint(list(kodlash.keys()))",
      type: "single",
      options: [
        "kodlash = tokenizer(savol, hujjat)",
        "kodlash = tokenizer(savol + hujjat)",
        "kodlash = tokenizer.encode(savol)",
        "kodlash = tokenizer.tokenize(savol, hujjat)"
      ],
      answer: [0],
      explain: "Zamonaviy sintaksis — tokenizatorni ikki argument bilan to'g'ridan-to'g'ri chaqirish. U [CLS] savol [SEP] kontekst [SEP] ni yasaydi va input_ids, token_type_ids, attention_mask qaytaradi. Matnlarni qo'shib yuborish esa segmentlarni ajratmaydi.",
      lesson: { title: "BERT embeddinglari", href: "04-BERT-Embeddings.md" }
    },
    {
      q: "10 000 so'zli hujjat BERT QA ga berildi, javob esa taxminan 500-so'zda turibdi. Darsga ko'ra nima bo'ladi va qanday yechim tavsiya etiladi?",
      type: "single",
      options: [
        "Model hujjatni o'zi 512 tokenli bo'laklarga bo'lib, javobni baribir topadi",
        "512 token chegarasi sabab javob ko'rinmaydi; mos bo'lakni ajratib berish kerak",
        "attention_mask to'g'ri qo'shilsa, model butun hujjatni bir marta o'qiy oladi",
        "Model xato beradi; yagona yechim — BERT Large o'rniga BERT Base ishlatish"
      ],
      answer: [1],
      explain: "BERT QA 512 token bilan cheklangan va uzun hujjatning faqat boshini ko'radi. Yechim — RAG: hujjatni bo'laklarga bo'lish, eng mos bo'lakni topish va faqat uni BERT QA ga berish.",
      lesson: { title: "BERT embeddinglari", href: "04-BERT-Embeddings.md" }
    },
    {
      q: "Bu kod nimani chop etadi?",
      code: "tokenlar = ['[CLS]', 'when', '?', '[SEP]', 'on', 'march', '24', ',', '1997', '.', '[SEP]']\nstart_index = 5\nend_index = 8\nprint(' '.join(tokenlar[start_index : end_index]))",
      type: "single",
      options: [
        "march 24 , 1997",
        "on march 24 ,",
        "march 24 ,",
        "march 24 , 1997 ."
      ],
      answer: [2],
      explain: "Python kesmasi oxirgi elementni qo'shmaydi, shuning uchun 5 dan 7 gacha — march 24 , — olinadi va 1997 yo'qoladi. To'g'ri kesma tokenlar[start_index : end_index + 1].",
      lesson: { title: "Javobni hisoblash", href: "05-Calculating-the-Response.md" }
    },
    {
      q: "DVD matnida ikkita sana bor edi. Model \"november 1 , 1996\" ni qaytardi, kurs esa \"March 24, 1997\" ni aytgan; top-5 da march 1.95 ball bilan 5-o'rinda (november 7.89). Darsga ko'ra to'g'ri xulosa qaysi?",
      type: "single",
      options: [
        "Model xato qildi, chunki u march tokenini kontekstda umuman ko'rmagan",
        "Model xato qildi, chunki start_logits noto'g'ri tokenlar uchun hisoblangan",
        "Kurs xato qildi, chunki matnda faqat bitta to'g'ri sana — november bor",
        "Savol noaniq: model ikkala sanani ko'rib, himoyalanadigan javobni tanlagan"
      ],
      answer: [3],
      explain: "\"First DVD\" formatmi yoki pleyer va diskmi — savol noaniq. march ro'yxatda bor, lekin model november ni ancha ishonchli deb topgan. Ko'p \"model xatosi\" aslida noaniq savol bo'lib chiqadi.",
      lesson: { title: "Javobni hisoblash", href: "05-Calculating-the-Response.md" }
    },
    {
      q: "FAQ-botdagi segment ID'larni qo'lda yasash kodi. Bu yerda 102 — [SEP] tokenining ID'si. Nima chop etiladi?",
      code: "input_ids = [101, 2073, 2003, 2009, 1029, 102, 5000, 6000, 102]\nsep_idx = input_ids.index(102)\nn_a = sep_idx + 1\nsegment_ids = [0] * n_a + [1] * (len(input_ids) - n_a)\nprint(segment_ids)",
      type: "single",
      options: [
        "[0, 0, 0, 0, 0, 0, 1, 1, 1]",
        "[0, 0, 0, 0, 0, 1, 1, 1, 1]",
        "[0, 0, 0, 0, 0, 0, 1, 1, 0]",
        "[0, 0, 0, 0, 0, 0, 0, 0, 1]"
      ],
      answer: [0],
      explain: ".index() birinchi mosni qaytaradi: sep_idx = 5. Segment A = [CLS] + savol + birinchi [SEP] = 6 ta nol, qolgan 3 ta token esa 1. Uzunlik input_ids bilan teng bo'lishi shart.",
      lesson: { title: "QA-bot yaratamiz", href: "06-Creating-a-QA-Bot.md" }
    },
    {
      q: "Bot javobidagi WordPiece bo'laklarini tozalash kodi nimani chop etadi?",
      code: "javob = 'crest ##wood'\ntuzatilgan = ''\nfor soz in javob.split():\n    if soz[:2] == '##':\n        tuzatilgan += soz[2:]\n    else:\n        tuzatilgan += ' ' + soz\nprint(repr(tuzatilgan.strip()))",
      type: "single",
      options: [
        "'crest wood'",
        "'crest ##wood'",
        "' crestwood'",
        "'crestwood'"
      ],
      answer: [3],
      explain: "## bilan boshlangan bo'lak oldingisiga bo'shliqsiz yopishtiriladi: crest + wood = crestwood, strip() esa boshidagi bo'shliqni olib tashlaydi. Amalda tokenizer.decode() buni o'zi qiladi.",
      lesson: { title: "QA-bot yaratamiz", href: "06-Creating-a-QA-Bot.md" }
    },
    {
      q: "Sunset Motors botiga \"What is the capital of France?\" berildi va u 'what' ni 0.1143 ishonch bilan qaytardi (to'g'ri javoblar 0.60–0.99 oralig'ida). Botni qanday himoyalash kerak? (bir nechta javob)",
      type: "multi",
      options: [
        "Ishonch (start × end) chegaradan, masalan 0.30 dan, past bo'lsa javobni rad etish",
        "end < start bo'lsa, javob o'rniga \"javob topa olmadim\" xabarini chiqarish",
        "argmax o'rniga argmin ishlatib, eng past ballli tokenni javob sifatida olish",
        "Kontekstni olib tashlab, modelga faqat savolni berib, o'z bilimidan javob olish"
      ],
      answer: [0, 1],
      explain: "Model \"bilmayman\" deya olmaydi — argmax doim biror indeks qaytaradi. Ikki himoya ishlaydi: ishonch chegarasi (0.1143 vs 0.9479 kabi farqni ushlaydi) va end < start tekshiruvi (zid natijalar).",
      lesson: { title: "QA-bot yaratamiz", href: "06-Creating-a-QA-Bot.md" }
    },
    {
      q: "RoBERTa BERT'dan nimasi bilan farq qiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Oldindan o'qitishda NSP vazifasi olib tashlangan",
        "Dinamik maskalash — maska naqshi har batch uchun o'zgaradi",
        "Qatlamlar soni 12 dan 6 ga qisqartirilib, model tezlashtirilgan",
        "Ancha ko'p ma'lumot (160 GB) va kattaroq batch bilan o'qitilgan",
        "Segment embeddinglari butunlay o'chirilib, faqat token va pozitsiya qolgan"
      ],
      answer: [0, 1, 3],
      explain: "RoBERTa — yaxshiroq o'qitilgan BERT: 10× ko'p ma'lumot, katta batch, NSP'siz va dinamik maskalash bilan. 6 qatlam va segment embeddinglarining yo'qligi esa DistilBERT'ga xos.",
      lesson: { title: "BERT, RoBERTa, DistilBERT", href: "07-BERT-RoBERTa-DistilBERT.md" }
    },
    {
      q: "DistilBERT tokenizatori token_type_ids qaytaradi. Bu kod ishga tushganda nima bo'ladi?",
      code: "from transformers import AutoTokenizer, DistilBertModel\nt = AutoTokenizer.from_pretrained('distilbert-base-uncased')\nm = DistilBertModel.from_pretrained('distilbert-base-uncased')\no = m(**t('hello world', return_tensors='pt'))\nprint(o.last_hidden_state.shape)",
      type: "single",
      options: [
        "TypeError: model token_type_ids argumentini qabul qilmaydi",
        "Ogohlantirish chiqadi, keyin torch.Size([1, 2, 768])",
        "Xato ham, ogohlantirish ham yo'q: torch.Size([1, 4, 768])",
        "Segment ma'lumoti hisobga olinadi va torch.Size([1, 4, 1536]) chiqadi"
      ],
      answer: [2],
      explain: "DistilBERT'da segment embeddinglari yo'q, lekin model token_type_ids ni jim e'tiborsiz qoldiradi — natija chiqadi, segment ma'lumoti esa yo'qoladi. Bu eng xavfli tur — jim xato.",
      lesson: { title: "BERT, RoBERTa, DistilBERT", href: "07-BERT-RoBERTa-DistilBERT.md" }
    }
  ]
};
