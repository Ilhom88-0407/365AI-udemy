window.QUIZ = {
  id: "64",
  title: "AI promptlarini yaratish va sinash",
  subtitle: "API kaliti va byudjet, temperature va top_p o'lchovlari, vazifaga mos sozlamalar, few-shot va qadamli promptlar, avtomatik prompt sinovi",
  next: { label: "Streamlit bilan tanishuv", href: "../65-Getting-to-Know-Streamlit/README.md" },
  questions: [
    {
      q: "Kurs prompt ishlab chiqishga 7 million token sarflaganini aytadi. Darsdagi hisobga ko'ra qaysi xulosa to'g'ri?",
      type: "single",
      options: [
        "$5 minimal to'ldirish yetmaydi, chunki 7 mln token har qanday modelda $38.50 turadi",
        "gpt-4o-mini da ~$2.31 — sinov arzon modelda, yakuniy tekshiruv qimmatida",
        "Model tanlovi prototip narxiga ta'sir qilmaydi, faqat ishlab chiqarishga ta'sir qiladi",
        "Sinovlarni darhol gpt-4o da qilish kerak, aks holda natijalar ishonchsiz bo'ladi"
      ],
      answer: [1],
      explain: "60/40 kirish-chiqish nisbatida 7 mln token gpt-4o-mini da $2.31, gpt-4o da $38.50 turadi. Demak $5 butun prompt ishlab chiqish uchun yetadi — arzon modelda.",
      lesson: { title: "OpenAI API hisobiga pul qo'shish", href: "01-Adding-Funds.md" }
    },
    {
      q: "kalit_ol() ning soddalashtirilgan varianti. Kod nima qiladi?",
      code: "import os\ndef kalit_ol(nom=\"OPENAI_API_KEY\", majburiy=False):\n    k = os.environ.get(nom)\n    if not k:\n        if majburiy:\n            raise RuntimeError(f\"{nom} topilmadi\")\n        return None\n    if not k.startswith(\"sk-\") or len(k) < 20:\n        raise ValueError(\"shakli noto'g'ri\")\n    return k\nos.environ[\"OPENAI_API_KEY\"] = \"sk-abc\"\nprint(kalit_ol())",
      type: "single",
      options: [
        "sk-abc ni chiqaradi, chunki kalit sk- bilan boshlanadi",
        "None ni chiqaradi va kod mahalliy rejimga o'tadi",
        "ValueError: shakli noto'g'ri — print bajarilmaydi",
        "RuntimeError: OPENAI_API_KEY topilmadi"
      ],
      answer: [2],
      explain: "Kalit topildi va sk- bilan boshlanadi, lekin uzunligi 6 < 20, shuning uchun ValueError ko'tariladi. Shakl tekshiruvi xato kalitni erta tutadi; kalit umuman bo'lmasa va majburiy=False bo'lsa, None qaytib, mahalliy rejimga o'tiladi.",
      lesson: { title: "OpenAI API hisobiga pul qo'shish", href: "01-Adding-Funds.md" }
    },
    {
      q: "Tizim promptini sinashda nega ChatGPT emas, Playground (yoki API) ishlatish tavsiya etiladi?",
      type: "single",
      options: [
        "Playground tekin, ChatGPT esa har bir so'rov uchun alohida va qimmat pul oladi",
        "ChatGPT tizim promptini umuman qabul qilmaydi va uni e'tiborsiz qoldiradi",
        "Playground kalitsiz ishlaydi, shuning uchun uni hamma sinab ko'ra oladi",
        "ChatGPT ning yashirin tizim prompti bor, natija API dagidan farq qiladi"
      ],
      answer: [3],
      explain: "Sizning promptingiz ChatGPT ning yashirin tizim prompti ustiga qo'shiladi, Playground esa API kabi ishlaydi. Playground ham kalit talab qiladi — shuning uchun darsda mahalliy model ishlatiladi.",
      lesson: { title: "OpenAI Playground va model sozlamalari", href: "02-The-OpenAI-Playground.md" }
    },
    {
      q: "temperature=2.0 da matn buzilganini qaysi o'lchovlar ko'rsatdi? (bir nechta javob)",
      type: "multi",
      options: [
        "ASCII belgilar ulushi 100% dan 69.7% ga tushdi",
        "Noyob so'zlar ulushi 100% ga chiqdi — hech narsa takrorlanmaydi",
        "Javob butunlay bo'sh qaytdi",
        "O'rtacha so'z uzunligi 4.48 dan 12.74 ga oshdi",
        "Noyob so'zlar 20% ga tushib, bitta so'z takrorlanaverdi"
      ],
      answer: [0, 1, 3],
      explain: "Uchta signal: boshqa alifbolar aralashuvi (ASCII 69.7%), tasodifiylik (noyob so'z 100%) va yopishib ketgan so'zlar (12.74). Buzilish 1.5 dan boshlanadi, shuning uchun amaliy qoida — temperature ≤ 1.2.",
      lesson: { title: "OpenAI Playground va model sozlamalari", href: "02-The-OpenAI-Playground.md" }
    },
    {
      q: "temperature=1.0 va top_p=0.1 bilan 5 xil urug' (seed) sinaldi. Qanday natija chiqdi va nega?",
      type: "single",
      options: [
        "1/5 — deterministik: top_p=0.1 ro'yxatni bitta tokengacha qisqartiradi",
        "5/5 turli natija, chunki temperature=1.0 har doim tasodifiylik beradi",
        "Matn buzildi, chunki top_p kichik bo'lsa, model boshqa alifboga o'tadi",
        "3/5 turli natija, chunki top_p va temperature bir-birini yarmiga kamaytiradi"
      ],
      answer: [0],
      explain: "temperature ro'yxatdan qanchalik tasodifiy tanlashni, top_p esa ro'yxat uzunligini belgilaydi. top_p=0.1 da ro'yxatda faqat bitta token qoladi, shuning uchun temperature=1.0 bo'lsa ham natija bir xil — top_p qattiqroq nazorat.",
      lesson: { title: "OpenAI Playground va model sozlamalari", href: "02-The-OpenAI-Playground.md" }
    },
    {
      q: "Bir xil sozlama (temperature=0.3, top_p=0.5) har qanday vazifada bir xil darajadagi barqarorlik beradi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Marketing shiori 3/3 turli, hisobot xulosasi 1/3 turli natija berdi — sozlama bir xil edi. \"Shior yozing\" da ko'p teng variant bor, \"xulosalang\" da bitta to'g'ri javob — vazifaning o'zi ham muhim omil.",
      lesson: { title: "Turli vazifalar uchun temperature va top_p", href: "03-Optimizing-Temperature-and-Top-P.md" }
    },
    {
      q: "Baholash promptida \"Score 1-10\" deyilgan. temperature=0.8 da 5 urinish [8, 0, 8, 8, 7] ball berdi, parse xatolari 0/5. Bu yerda asosiy xavf nima?",
      type: "single",
      options: [
        "JSON parse xatolari ko'payadi va dastur ishdan chiqadi",
        "Ball beqaror va 0 diapazondan tashqarida, lekin json.loads buni sezmaydi",
        "Model har safar bir xil ball beradi va foydalanuvchi zerikadi",
        "Hech qanday xavf yo'q, chunki barcha javoblar muvaffaqiyatli parse qilindi"
      ],
      answer: [1],
      explain: "json.loads faqat sintaksisni tekshiradi, ma'noni emas. Baholash uchun temperature=0 kerak (ballar 8, 8, 8, 8, 8 chiqdi), diapazonni esa kodda alohida tekshirish shart.",
      lesson: { title: "Turli vazifalar uchun temperature va top_p", href: "03-Optimizing-Temperature-and-Top-P.md" }
    },
    {
      q: "Sozlama profillari funksiyasining qisqartirilgan varianti. Kod nimani chiqaradi?",
      code: "PROFILLAR = {\"deterministik\": {\"temperature\": 0.0},\n             \"aniq\": {\"temperature\": 0.2, \"top_p\": 0.3}}\nVAZIFA_PROFIL = {\"json\": \"deterministik\", \"kod\": \"aniq\"}\ndef sozlama(vazifa, max_tokens=200):\n    gk = dict(PROFILLAR[VAZIFA_PROFIL[vazifa]])\n    gk[\"max_new_tokens\"] = max_tokens\n    gk[\"do_sample\"] = gk.get(\"temperature\", 0.0) > 0\n    if not gk[\"do_sample\"]:\n        gk.pop(\"temperature\", None)\n    return gk\nprint(sozlama(\"json\"))",
      type: "single",
      options: [
        "{'temperature': 0.0, 'max_new_tokens': 200, 'do_sample': False}",
        "{'temperature': 0.0, 'max_new_tokens': 200, 'do_sample': True}",
        "{'max_new_tokens': 200, 'do_sample': False}",
        "{'temperature': 0.2, 'top_p': 0.3, 'max_new_tokens': 200, 'do_sample': True}"
      ],
      answer: [2],
      explain: "json deterministik profilga tushadi: 0.0 > 0 yolg'on, shuning uchun do_sample=False va temperature olib tashlanadi — do_sample=False da u keraksiz. Aniq profil (0.2, 0.3) faqat kod uchun.",
      lesson: { title: "Turli vazifalar uchun temperature va top_p", href: "03-Optimizing-Temperature-and-Top-P.md" }
    },
    {
      q: "62-moduldagi muvaffaqiyatsiz kategoriyalar few-shot bilan qayta sinaldi. Darsdagi halol baho qanday?",
      type: "single",
      options: [
        "Uchala kategoriya to'liq tuzatildi — 3/3, qo'shimcha tekshiruv kerak emas",
        "Few-shot hech narsani o'zgartirmadi, model yana \"primary goal\" qolipida yozdi",
        "Few-shot natijani yomonlashtirdi va prompt narxini 10 barobar oshirdi",
        "kod to'liq tuzatildi, boshqotirma va database esa qisman — taxminan 2/3"
      ],
      answer: [3],
      explain: "kod da haqiqiy \"Write a Python function...\" vazifasi chiqdi, database da esa mavzu to'g'ri, lekin SQL yozish vazifasi emas. Few-shot mavzuni tuzatdi, vazifa shaklini to'liq emas; narxi +39–52 token, ya'ni arzon.",
      lesson: { title: "Dasturiy ta'minot uchun prompt muhandisligi", href: "04-Prompt-Engineering.md" }
    },
    {
      q: "Email yordamchisi uchun qadamsiz prompt JSON da \"Invalid control character\" xatosini berdi, 5 qadamli prompt esa to'g'ri JSON berdi. Darsga ko'ra qadamlar nega yordam berdi?",
      type: "single",
      options: [
        "Qadamli prompt qisqaroq bo'lgani uchun model kamroq xato qildi",
        "Qadamlar generatsiya paytida temperature ni avtomatik 0 ga tushirib qo'ydi",
        "To'rtta ish ketma-ket bo'ldi va model har birini alohida bajardi",
        "Qadamli promptda JSON o'rniga oddiy matn so'ralgani uchun xato bo'lmadi"
      ],
      answer: [2],
      explain: "Model bir vaqtda o'qish, mavzu tanlash, javob yozish va JSON ga joylashni qilishi kerak edi. Qadamsiz u hammasini birdaniga qilib, satr ichiga xom qator uzilishi qo'ydi; qadamli prompt esa 90 token bo'lsa ham barcha talablarni bajardi.",
      lesson: { title: "Dasturiy ta'minot uchun prompt muhandisligi", href: "04-Prompt-Engineering.md" }
    },
    {
      q: "PromptKutubxona.toldir() dagi o'rinlarni tekshirish mantig'i. Kod nimani chiqaradi?",
      code: "import re\n\nmatn = \"HR interviewer at {company} hiring a {position}. Type: {kategoriya}.\"\norinlar = sorted(set(re.findall(r\"\\{(\\w+)\\}\", matn)))\nkw = {\"company\": \"Google\"}\nyoq = [o for o in orinlar if o not in kw]\nprint(yoq)",
      type: "single",
      options: [
        "['position', 'kategoriya']",
        "['company']",
        "['kategoriya', 'position']",
        "[]"
      ],
      answer: [2],
      explain: "findall uchta nomni topadi, sorted ularni alifbo tartibiga qo'yadi: company, kategoriya, position. company berilgan, qolgan ikkitasi ro'yxatda qoladi — toldir() shu sabab ValueError bilan to'ldirilmagan o'rinlarni erta tutadi.",
      lesson: { title: "Dasturiy ta'minot uchun prompt muhandisligi", href: "04-Prompt-Engineering.md" }
    },
    {
      q: "v3 promptga kursning \"Ask each question individually, creating a conversational flow...\" qo'shimchasi qo'shildi (v4). n=12 sinovda o'rtacha ball 0.75 dan 0.58 ga tushdi. Sabab qaysi tekshiruvda ko'rindi?",
      type: "single",
      options: [
        "\"bitta savol\" — model har safar bir nechta savolni birdaniga, ro'yxat ko'rinishida berdi",
        "\"preambulasiz\" — 10/12 dan 3/12 ga tushdi, javoblar \"Great!...\" bilan boshlandi",
        "\"savol bilan\" — javoblar savol belgisi bilan tugamay qoldi",
        "\"kontekstda\" — model data, Python va project so'zlarini umuman ishlatmay qo'ydi"
      ],
      answer: [1],
      explain: "\"Conversational flow\" iborasi modelni suhbat boshlashga undadi, natijada preambula paydo bo'ldi. Qo'lda 2–3 marta ko'rganda bu sezilmasdi — shuning uchun avtomatik sinov kerak.",
      lesson: { title: "Prompt shablonini qanday sinash kerak", href: "05-How-to-Test-a-Prompt-Template.md" }
    },
    {
      q: "n=12 bilan v2 rol va v5 few-shot bir xil 0.77 ball oldi, sinovchi \"farq 0.000 <= shovqin 0.500 — G'OLIB ISHONCHLI EMAS\" dedi. Darsga ko'ra keyingi to'g'ri qadam qaysi?",
      type: "single",
      options: [
        "Alifbo bo'yicha birinchisini, ya'ni v2 ni g'olib deb qabul qilish",
        "Har bir tekshiruvga alohida qarab, qaysi versiya nimada kuchli ekanini ko'rish",
        "Tekshiruvlarni olib tashlab, javoblarni ko'z bilan \"yaxshi ko'rinadi\" deb baholab chiqish",
        "temperature ni 2.0 ga oshirib, farqni sun'iy ravishda kattalashtirish"
      ],
      answer: [1],
      explain: "Tekshiruvlar bir-biriga qarshi ishlagani uchun o'rtacha farqni yashiradi: v5 format bo'yicha 12/12 va eng barqaror (±std 0.069), lekin kontekstda 1/12, v2 esa kontekstda 9/12. Few-shot misollari tor bo'lsa, natija ham tor bo'ladi.",
      lesson: { title: "Prompt shablonini qanday sinash kerak", href: "05-How-to-Test-a-Prompt-Template.md" }
    },
    {
      q: "PromptSinov dagi tekshiruvlar bitta javobga qo'llanildi. Kod nimani chiqaradi?",
      code: "import re\n\nT = {\n    \"bitta savol\": lambda s: s.count(\"?\") == 1,\n    \"preambulasiz\": lambda s: not re.match(r\"^\\s*(sure|great|certainly)\", s, re.I),\n    \"savol bilan\": lambda s: s.rstrip().endswith(\"?\"),\n}\ns = \"Great! What brings you to this role?\"\nprint(sum(1 for f in T.values() if f(s)) / len(T))",
      type: "single",
      options: ["1.0", "0.3333333333333333", "0.5", "0.6666666666666666"],
      answer: [3],
      explain: "Savol belgisi bitta va javob \"?\" bilan tugaydi — 2 ta tekshiruv o'tadi. \"Great\" re.I tufayli katta harf bilan ham mos keladi, shuning uchun preambulasiz tekshiruvi yiqiladi: 2/3.",
      lesson: { title: "Prompt shablonini qanday sinash kerak", href: "05-How-to-Test-a-Prompt-Template.md" }
    },
    {
      q: "Darsdagi prompt sinovining to'g'ri tartibiga qaysi qadamlar kiradi? (bir nechta javob)",
      type: "multi",
      options: [
        "Tekshiruv funksiyalarini prompt yozishdan oldin yozish",
        "Vaqt tejash uchun bir vaqtda bir nechta narsani o'zgartirish",
        "Har safar faqat bitta narsani o'zgartirib, qayta o'lchash",
        "Farq 2×std dan katta bo'lsagina yangi versiyani qabul qilish",
        "2–3 marta qo'lda ko'rib, yaxshi ko'rinsa qabul qilish"
      ],
      answer: [0, 2, 3],
      explain: "Tartib: tekshiruvlar → bazaviy o'lchov → bitta o'zgarish → n ≥ 20 bilan qayta o'lchash → farq > 2×std bo'lsa qabul → versiyani saqlash. Eng ko'p xato — birinchi qadamni tashlab ketish: tekshiruvsiz baho o'lchov emas, taassurot.",
      lesson: { title: "Prompt shablonini qanday sinash kerak", href: "05-How-to-Test-a-Prompt-Template.md" }
    }
  ]
};
