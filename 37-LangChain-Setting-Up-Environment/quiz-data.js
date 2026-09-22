window.QUIZ = {
  id: "37",
  title: "Muhitni sozlash",
  subtitle: "conda, venv va uv muhitlari, kernel va versiya qotirish, API kaliti xavfsizligi va python-dotenv",
  next: { label: "OpenAI API", href: "../38-LangChain-OpenAI-API/README.md" },
  questions: [
    {
      q: "Nega bu kurs uchun alohida virtual muhit ayniqsa muhim?",
      type: "single",
      options: [
        "Chunki Jupyter kernel faqat alohida conda muhitida ishga tushadi",
        "Chunki OpenAI API kaliti faqat alohida muhit ichida saqlanadi",
        "Chunki alohida muhitda kod tezroq ishlaydi va xotira kam ketadi",
        "Chunki kurs langchain 0.1/0.2 ni, yangi loyiha esa 1.3 ni kutadi"
      ],
      answer: [3],
      explain: "Muhit paket versiyalarini izolyatsiya qiladi. Kurs kodi va yangi loyiha langchain ning turli versiyalarini talab qiladi, ularni bitta muhitda saqlab bo'lmaydi.",
      lesson: { title: "Anaconda muhitini sozlash", href: "01-Setting-Up-Anaconda-Environment.md" }
    },
    {
      q: "Terminalda pip install qildingiz, lekin notebook ModuleNotFoundError beryapti. Nega quyidagi usul muammoni hal qiladi?",
      code: "import sys\n!{sys.executable} -m pip install langchain-openai",
      type: "single",
      options: [
        "Chunki u paketni aynan joriy kernel ishlatayotgan Python'ga o'rnatadi",
        "Chunki u paketni kompyuterdagi barcha muhitlarga bir vaqtda o'rnatadi",
        "Chunki u kernelni avtomatik ravishda langchain_env ga almashtiradi",
        "Chunki ! belgisi pip ni conda install bilan almashtirib yuboradi"
      ],
      answer: [0],
      explain: "Eng ko'p uchraydigan xato — noto'g'ri kernel: paket bir muhitga o'rnatilgan, notebook esa boshqa Python'da ishlaydi. {sys.executable} aynan joriy kernel Python'ini ko'rsatadi.",
      lesson: { title: "Anaconda muhitini sozlash", href: "01-Setting-Up-Anaconda-Environment.md" }
    },
    {
      q: "2024-yilda kurs kodi ishlagan, 2026-yilda o'sha pip install langchain buyrug'i bilan o'rnatgan talabada kod ishlamayapti. Dars qanday oldini olishni tavsiya qiladi?",
      type: "single",
      options: [
        "Har safar eng yangi versiyani o'rnatish uchun pip install -U langchain",
        "Versiyalarni requirements.txt da qotirish, masalan langchain==1.3.17",
        "Python ni eng so'nggi 3.14 versiyaga yangilab, hammasini qayta o'rnatish",
        "conda o'rniga faqat global Python'dan foydalanib, muhitni soddalashtirish"
      ],
      answer: [1],
      explain: "Kurs versiyani ko'rsatmaydi, shuning uchun turli vaqtda o'rnatganlar turli versiya oladi. requirements.txt da versiyani qotirish takrorlanuvchanlikni ta'minlaydi; Python 3.14 kabi eng yangi versiyada esa ko'p paket ishlamaydi.",
      lesson: { title: "Anaconda muhitini sozlash", href: "01-Setting-Up-Anaconda-Environment.md" }
    },
    {
      q: "venv va uv haqida qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "venv Python bilan birga keladi, Anaconda o'rnatish shart emas",
        "uv Rust'da yozilgan va pip dan 10–100× tez",
        "uv pip install sintaksisi pip bilan bir xil",
        "venv numpy, scipy kabi ilmiy paketlarni conda kabi tayyor holda beradi",
        "uv faqat conda muhiti ichida ishlaydi"
      ],
      answer: [0, 1, 2],
      explain: "venv yengil va Python bilan keladi, lekin ilmiy paketlarni kompilyatsiya qilishi mumkin — conda ularni tayyor beradi. uv esa mustaqil va juda tez, sintaksisi pip bilan bir xil.",
      lesson: { title: "Anaconda muhitini sozlash", href: "01-Setting-Up-Anaconda-Environment.md" }
    },
    {
      q: "API kalitini yaratdingiz, nusxalamasdan oynani yopdingiz. Endi nima qilasiz?",
      type: "single",
      options: [
        "Settings bo'limidan kalitni qayta ko'rsatishni bosasiz",
        "OpenAI qo'llab-quvvatlash xizmatidan kalitni qayta yuborishni so'raysiz",
        "Yangi kalit yaratasiz, eskisini bekor qilishni unutmaysiz",
        "Kalit Billing sahifasida saqlanadi, o'sha yerdan olasiz"
      ],
      answer: [2],
      explain: "Kalit faqat bir marta, yaratilgan paytda ko'rsatiladi. Yo'qotsangiz, yangisini yaratasiz va eskisini bekor qilasiz.",
      lesson: { title: "OpenAI API kalitini olish", href: "02-Obtaining-an-OpenAI-API-Key.md" }
    },
    {
      q: "ChatGPT Plus obunasi ($20/oy) OpenAI API'dan foydalanish imkonini ham beradi.",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "ChatGPT Plus va API — alohida xizmatlar. API uchun alohida kredit ($5 dan) kerak; ko'p odam Plus'ni API deb o'ylab pul sarflaydi.",
      lesson: { title: "OpenAI API kalitini olish", href: "02-Obtaining-an-OpenAI-API-Key.md" }
    },
    {
      q: "Kalit sizib chiqishining eng ko'p uchraydigan sababi va unga qarshi eng muhim himoya qaysi?",
      type: "single",
      options: [
        "Skrinshot — himoya: ekran ulashishda kalitni yashirish",
        "GitHub'ga yuklash — himoya: .env ni .gitignore ga qo'shish",
        "Log fayllar — himoya: jurnal yozishni butunlay o'chirish",
        "Chatga nusxalash — himoya: kalitni to'g'ridan-to'g'ri kodda saqlash"
      ],
      answer: [1],
      explain: "Eng ko'p uchraydigani — GitHub'ga yuklash: botlar GitHub'ni doimiy skanerlaydi. Eng muhim himoya — .gitignore ga .env ni qo'shish; kurs buni umuman eslatmaydi.",
      lesson: { title: "OpenAI API kalitini olish", href: "02-Obtaining-an-OpenAI-API-Key.md" }
    },
    {
      q: "Kalitingiz .env bilan birga GitHub'ga tushib qoldi. Dars bo'yicha qaysi qadamlar kerak? (bir nechta javob)",
      type: "multi",
      options: [
        "Kalitni darhol platform.openai.com da bekor qilish (Revoke)",
        "Usage sahifasida g'ayrioddiy sarfni tekshirish",
        ".env ni git filter-repo bilan git tarixidan o'chirish",
        "git rm .env qilish yetarli — fayl tarixdan ham yo'qoladi",
        "Kalitni bekor qilmasdan, faqat repozitoriyni private qilish"
      ],
      answer: [0, 1, 2],
      explain: "Bekor qilish, yangi kalit, Usage tekshiruvi, tarixdan o'chirish va .gitignore ni to'g'rilash kerak. git rm faylni faqat hozirgi holatdan o'chiradi — u tarixda qoladi va hamma ko'ra oladi.",
      lesson: { title: "OpenAI API kalitini olish", href: "02-Obtaining-an-OpenAI-API-Key.md" }
    },
    {
      q: "Kod nima chiqaradi?",
      code: "import re\nNAQSH = r\"sk-[A-Za-z0-9_-]{20,}\"\nmatn = 'client = OpenAI(api_key=\"sk-proj-abcdefghij1234567890KLMNOP\")'\nm = re.findall(NAQSH, matn)[0]\nprint(m[:8] + \"...\" + m[-4:])",
      type: "single",
      options: [
        "sk-proj...MNOP",
        "Hech narsa — naqsh \"proj-\" dagi chiziqcha tufayli mos kelmaydi",
        "sk-proj-abcdefghij...",
        "sk-proj-...MNOP"
      ],
      answer: [3],
      explain: "Naqsh sk- dan keyingi harf, raqam, _ va - belgilarini qo'shtirnoqqacha oladi. m[:8] — \"sk-proj-\" (8 belgi), m[-4:] — \"MNOP\", natija sk-proj-...MNOP.",
      lesson: { title: "OpenAI API kalitini olish", href: "02-Obtaining-an-OpenAI-API-Key.md" }
    },
    {
      q: ".env faylida MENING_KALITIM=oddiy yozilgan. Kod nima chiqaradi?",
      code: "import os\nfrom dotenv import load_dotenv\n\nos.environ[\"MENING_KALITIM\"] = \"ESKI\"\nload_dotenv()\nprint(os.getenv(\"MENING_KALITIM\"))",
      type: "single",
      options: [
        "oddiy",
        "ESKI",
        "None",
        "KeyError xatosi"
      ],
      answer: [1],
      explain: "load_dotenv() da override standart holda False: o'zgaruvchi allaqachon mavjud bo'lsa, .env uni almashtirmaydi va ogohlantirish ham chiqmaydi. .env ustun bo'lishi uchun load_dotenv(override=True) kerak.",
      lesson: { title: "Kalitni muhit o'zgaruvchisi qilish", href: "03-Setting-the-API-Key-as-Environment-Variable.md" }
    },
    {
      q: "Kursdagi %load_ext dotenv va %dotenv buyruqlarini oddiy skript.py fayliga ko'chirdingiz. Nima bo'ladi va nima qilish kerak?",
      type: "single",
      options: [
        "Xato beradi — bu IPython buyruqlari; .py da load_dotenv() ishlatiladi",
        "Ishlaydi, lekin sekinroq — .py da ham shu ikki buyruq yetarli bo'ladi",
        "Xato beradi — .py da .env o'qilmaydi, kalitni kodda yozish kerak",
        "Ishlaydi — Python % bilan boshlangan satrlarni izoh deb o'tkazib yuboradi"
      ],
      answer: [0],
      explain: "% bilan boshlanadigan buyruqlar faqat Jupyter'da ishlaydi. load_dotenv() esa .py da ham, .ipynb da ham ishlaydigan universal usul.",
      lesson: { title: "Kalitni muhit o'zgaruvchisi qilish", href: "03-Setting-the-API-Key-as-Environment-Variable.md" }
    },
    {
      q: "os.environ[\"OPENAI_API_KEY\"] = \"sk-...\" bilan qo'yilgan o'zgaruvchi kernel qayta ishga tushirilgandan keyin ham saqlanib qoladi.",
      type: "single",
      options: [
        "To'g'ri",
        "Noto'g'ri"
      ],
      answer: [1],
      explain: "Muhit o'zgaruvchisi jarayon ichida yashaydi: kernel qayta ishga tushsa, u yo'qoladi. Bundan tashqari kalit kodda turgani uchun bu usul tavsiya etilmaydi.",
      lesson: { title: "Kalitni muhit o'zgaruvchisi qilish", href: "03-Setting-the-API-Key-as-Environment-Variable.md" }
    },
    {
      q: "Windows'da Notepad bilan .env yaratdingiz, lekin load_dotenv() kalitni topmayapti. Eng ehtimolli sabab va dars tavsiya qilgan eng ishonchli yo'l qaysi?",
      type: "single",
      options: [
        "Windows .env fayllarni yashiradi — Explorer'da faylni ko'rinadigan qilish kifoya",
        "Fayl ANSI kodlashda saqlangan — faqat PYTHONIOENCODING ni o'rnatish kerak",
        "Fayl .env.txt bo'lib qolgan — uni Python'da Path(\".env\").write_text() bilan yarating",
        "load_dotenv() faqat Linux'da ishlaydi — Windows'da os.environ ishlatish kerak"
      ],
      answer: [2],
      explain: "Notepad avtomatik .txt qo'shadi va fayl .env.txt bo'lib qoladi. Python orqali Path(\".env\").write_text(..., encoding=\"utf-8\") bilan yaratish — eng ishonchli yo'l; keyin fayl nomini tekshirish kerak.",
      lesson: { title: "Kalitni muhit o'zgaruvchisi qilish", href: "03-Setting-the-API-Key-as-Environment-Variable.md" }
    },
    {
      q: "Kod nima chiqaradi?",
      code: "def maskala(v, b=7, o=4):\n    return \"***\" if not v or len(v) < b+o+3 else f\"{v[:b]}...{v[-o:]}\"\n\nprint(maskala(\"sk-proj-abcdef123456\"), maskala(\"sk-123\"))",
      type: "single",
      options: [
        "sk-proj-...3456 sk-123",
        "*** ***",
        "sk-proj...3456 ***",
        "sk-proj...3456 sk-...123"
      ],
      answer: [2],
      explain: "Birinchi kalit 20 belgi (14 dan uzun): v[:7] = \"sk-proj\", v[-4:] = \"3456\". \"sk-123\" esa 6 belgi, 14 dan qisqa — \"***\" qaytadi. Jurnal va xato xabarlarida kalit doim maskalanadi.",
      lesson: { title: "Kalitni muhit o'zgaruvchisi qilish", href: "03-Setting-the-API-Key-as-Environment-Variable.md" }
    },
    {
      q: "Nosozlik tuzatishda .env faylida qaysi o'zgaruvchi nomlari borligini xavfsiz ko'rmoqchisiz. Qaysi usul darsga mos?",
      type: "single",
      options: [
        "print(os.environ) — hamma o'zgaruvchilarni bir yo'la ko'rish",
        "print(os.environ.items()) — kurs taklif qilgan qulay usul",
        "load_dotenv(override=True) va keyin print(os.environ)",
        "print(list(dotenv_values(\".env\").keys())) — faqat nomlar"
      ],
      answer: [3],
      explain: "dotenv_values() faylni muhitni o'zgartirmasdan o'qiydi, keys() esa faqat nomlarni beradi. print(os.environ) qiymatlarni ham chiqaradi va notebook commit qilinsa kalit GitHub'ga tushadi.",
      lesson: { title: "Kalitni muhit o'zgaruvchisi qilish", href: "03-Setting-the-API-Key-as-Environment-Variable.md" }
    }
  ]
};
