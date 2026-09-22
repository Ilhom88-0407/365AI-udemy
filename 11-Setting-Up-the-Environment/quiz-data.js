window.QUIZ = {
  id: "11",
  title: "Muhitni sozlash",
  subtitle: "Jupyter arxitekturasi, Anaconda o'rnatish, dashboard, yacheyka rejimlari, tezkor tugmalar, xato xabarlari va kernel'ni qayta ishga tushirish",
  next: { label: "Python o'zgaruvchilari va ma'lumot turlari", href: "../12-Python-Variables-and-Data-Types/README.md" },
  questions: [
    {
      q: "Jupyter arxitekturasida Jupyter server qanday vazifani bajaradi?",
      type: "single",
      options: [
        "Python kodini o'qib bajaradi va natijani hisoblab beradi",
        "Notebook fayllarini .ipynb formatiga o'girib, diskka saqlaydi",
        "Klient mos keluvchi til kerneli bilan bog'lanadigan muhitni taqdim etadi",
        "Veb-brauzer o'rnida kod yoziladigan interfeysni ko'rsatadi"
      ],
      answer: [2],
      explain: "Server klient (veb-brauzer) va kernel o'rtasida turadi va ularni bog'laydi. Kodni o'qib bajarish esa kernelning ishi, kod yozish interfeysi — klientning.",
      lesson: { title: "Jupyter bilan tanishuv", href: "01-Jupyter-Introduction.md" }
    },
    {
      q: "Darsga ko'ra bitta Jupyter notebook faylida nimalar birga turishi mumkin? (bir nechta javob)",
      type: "multi",
      options: [
        "O'quvchiga xabar yetkazuvchi toza matn",
        "Python kabi kompyuter kodi",
        "Natijalar: figuralar, grafiklar, rasmlar",
        "Kodni bajaradigan kernel dasturining o'zi",
        "Anaconda distributivining o'rnatuvchisi"
      ],
      answer: [0, 1, 2],
      explain: "Bitta faylda matn, kod va natija birga turadi — bu ish oqimini soddalashtiradi. Kernel esa faylga emas, alohida dastur sifatida ishlaydi.",
      lesson: { title: "Jupyter bilan tanishuv", href: "01-Jupyter-Introduction.md" }
    },
    {
      q: "Anaconda saytida yuklab olishdan oldin elektron pochtangiz so'raldi. Darsga ko'ra nima qilish mumkin?",
      type: "single",
      options: [
        "\"Skip registration\" ni tanlab, to'g'ridan-to'g'ri yuklab olish sahifasiga o'tish",
        "Pochtasiz yuklab bo'lmaydi, shuning uchun ro'yxatdan o'tish majburiy",
        "Ro'yxatsiz beriladigan pullik versiyani tanlash kerak",
        "Anaconda o'rniga faqat Miniconda'ni o'rnatish kerak bo'ladi"
      ],
      answer: [0],
      explain: "Ro'yxatdan o'tish majburiy emas: \"Skip registration\" sizni \"Download\" tugmali sahifaga olib boradi. Doim bepul Individual Edition'ni qidiring.",
      lesson: { title: "Anaconda o'rnatish", href: "02-Installing-Anaconda.md" }
    },
    {
      q: "Anaconda Navigator'da Jupyter Notebook tugmasini bosdingiz. Nima sodir bo'lishi kerak?",
      type: "single",
      options: [
        "Alohida oynada Python terminali ochilib, kod kutadi",
        "Anaconda saytidagi onlayn muharrir ochiladi",
        "Ish stolida bo'sh .ipynb fayl avtomatik yaratiladi",
        "Brauzerda yangi tab ochiladi — foydalanuvchi papkasini ko'rsatuvchi Jupyter Dashboard"
      ],
      answer: [3],
      explain: "Jupyter brauzerda yangi tab ochadi va u yerda standart holatda foydalanuvchi papkangizni ko'rsatuvchi Dashboard bo'ladi.",
      lesson: { title: "Anaconda o'rnatish", href: "02-Installing-Anaconda.md" }
    },
    {
      q: "Dashboard'ning Files tabida bir notebook ikonkasi bilan checkbox orasida kichik yashil nuqta bor. Bu nimani bildiradi?",
      type: "single",
      options: [
        "Fayl yaqinda Upload tugmasi orqali yuklangan",
        "Bu notebook hozir ishlab turibdi",
        "Fayl Selection menyusi orqali belgilangan",
        "Notebook xatosiz saqlangan va ulashishga tayyor"
      ],
      answer: [1],
      explain: "Yashil nuqta faylning hozir ishlayotganini bildiradi. Ishlab turgan barcha jarayonlarni Running tabida ham ko'rish mumkin.",
      lesson: { title: "Jupyter'dan foydalanishga kirish", href: "03-Introduction-to-Using-Jupyter.md" }
    },
    {
      q: "Kun oxirida 10 ta notebook ochiq qoldi va kompyuter sekinlashdi. Darsga ko'ra ishni qanday to'g'ri tugatish kerak?",
      type: "single",
      options: [
        "Files tabida notebook'larni belgilab, Delete tugmasini bosish",
        "Har bir notebook'da Ctrl + Enter bosib, keyin brauzer tabini yopish",
        "Running tabida jarayonga o'ng tugma bosib, Shutdown Kernel ni tanlash",
        "Hech narsa qilmaslik — kernel'lar xotira egallamaydi"
      ],
      answer: [2],
      explain: "Har bir ishlab turgan kernel operativ xotira egallaydi, shuning uchun Running tabidan Shutdown Kernel qilinadi. Delete esa faylni butunlay o'chiradi.",
      lesson: { title: "Jupyter'dan foydalanishga kirish", href: "03-Introduction-to-Using-Jupyter.md" }
    },
    {
      q: "Hech bir yacheykada kursor miltillamayotgan bo'lsa, siz edit mode'dasiz.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Miltillayotgan kursor — edit mode belgisi. Kursor ko'rinmasa (masalan, Escape bosgandan keyin), siz command mode'dasiz.",
      lesson: { title: "Notebook fayllari bilan ishlash", href: "04-Working-with-Notebook-Files.md" }
    },
    {
      q: "Siz 2-yacheykada kod yozyapsiz, pastda allaqachon 3-yacheyka bor. Shift + Enter bossangiz nima bo'ladi?",
      type: "single",
      options: [
        "Kod bajariladi va 2-yacheyka bilan 3-yacheyka orasida yangi bo'sh yacheyka paydo bo'ladi",
        "Kod bajariladi va Jupyter sizni 3-yacheykaga command mode'da olib o'tadi",
        "Kod bajariladi, lekin kursor 2-yacheykada edit mode'da qoladi",
        "Kod bajarilmaydi, chunki keyingi yacheyka band"
      ],
      answer: [1],
      explain: "Shift + Enter yangi yacheykani faqat keyin boshqa yacheyka bo'lmasa yaratadi. Aks holda keyingi yacheykaga command mode'da o'tadi. Doim yangi yacheyka qo'shadigani — Alt + Enter.",
      lesson: { title: "Notebook fayllari bilan ishlash", href: "04-Working-with-Notebook-Files.md" }
    },
    {
      q: "Uchta yacheyka tartib bilan bajarildi va In [1], In [2], In [3] raqamlarini oldi. Keyin birinchi yacheyka qayta ishga tushirildi. Uning raqami qanday bo'ladi?",
      code: "# 1-yacheyka\na = 10\n# 2-yacheyka\nb = 20\n# 3-yacheyka\na + b",
      type: "single",
      options: ["In [1] — joylashuvi o'zgarmagani uchun", "In [3] — oxirgi raqam takrorlanadi", "In [4]", "In [*] — doim yulduzcha qoladi"],
      answer: [2],
      explain: "Raqamlar yacheyka joylashuvini emas, bajarilish tartibini ko'rsatadi: har safar qayta ishga tushirilganda raqam oshadi. [*] esa faqat kod ishlayotgan paytda ko'rinadi.",
      lesson: { title: "Notebook fayllari bilan ishlash", href: "04-Working-with-Notebook-Files.md" }
    },
    {
      q: "Command mode'dagi qaysi tugma va amal juftliklari to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "A — tanlangan yacheykadan yuqorida yangi yacheyka",
        "D D — yacheykani o'chirish",
        "B — tanlangan yacheykani nusxalash",
        "M — yacheykani Markdown'ga aylantirish",
        "Y — yacheykani kesib olish"
      ],
      answer: [0, 1, 3],
      explain: "A — Above (yuqorida), B — Below (pastda) yangi yacheyka, D D — o'chirish, M — Markdown. Nusxalash C, kesish X bilan; Y esa yacheykani kodga qaytaradi.",
      lesson: { title: "Tezkor tugmalardan foydalanish", href: "05-Using-Shortcuts.md" }
    },
    {
      q: "Notebook'ni rahbarga ko'rsatmoqchisiz: kod chalg'itmasin, faqat izoh va natija ko'rinsin. Darsga ko'ra qaysi usul mos?",
      type: "single",
      options: [
        "Shift + L bilan qator raqamlarini yashirish",
        "D D bilan barcha kod yacheykalarini o'chirib yuborish",
        "Ctrl + Shift + H bilan tezkor tugmalar oynasini ochish",
        "View menyusidan Collapse Selected Code ni tanlash"
      ],
      answer: [3],
      explain: "Collapse Selected Code kodni yashiradi, izoh va natija qoladi; Expand Selected Code bilan qaytariladi. Shift + L faqat qator raqamlarini boshqaradi.",
      lesson: { title: "Tezkor tugmalardan foydalanish", href: "05-Using-Shortcuts.md" }
    },
    {
      q: "Oldingi yacheykada x = 5 + 3 bajarilgan. Quyidagi kodda prnt ni print ga tuzatib, qayta ishga tushirsangiz nima bo'ladi?",
      code: "prnt(y)",
      type: "single",
      options: [
        "8 chiqadi, chunki xato faqat yozuv xatosi edi",
        "SyntaxError chiqadi, chunki qavs ichida o'zgaruvchi bor",
        "Yana NameError chiqadi — endi y aniqlanmagani uchun",
        "Hech narsa chiqmaydi, chunki y bo'sh qiymatga ega"
      ],
      answer: [2],
      explain: "Muammo uchun bitta sabab bo'lishi kafolatlanmagan: typo tuzatilgach, y aniqlanmaganligi sababli yana NameError chiqadi. y ni x bilan almashtirish nihoyat 8 beradi.",
      lesson: { title: "Xato xabarlari bilan ishlash", href: "06-Handling-Error-Messages.md" }
    },
    {
      q: "Uzun xato xabari chiqdi. Darsga ko'ra muammo qayerdaligini bilish va Google'da qidirish uchun avvalo nimaga qarash kerak?",
      type: "single",
      options: [
        "Xato xabarining oxirgi qatoriga",
        "Xato xabarining birinchi qatoriga",
        "Yacheyka yonidagi In raqamiga",
        "Traceback'dagi eng uzun qatorga"
      ],
      answer: [0],
      explain: "Ko'p hollarda xato xabarining oxirgi qatori muammo qayerdan kelayotganini ko'rsatadi — aynan uni Google'ga qo'yish yoki Q&A savolida berish tavsiya etiladi.",
      lesson: { title: "Xato xabarlari bilan ishlash", href: "06-Handling-Error-Messages.md" }
    },
    {
      q: "Birinchi yacheykada maxfiy_son = 42 bajarildi, keyin bu yacheyka D D bilan o'chirildi. Endi Kernel → Restart Kernel and Run All Cells tanlansa, qolgan yacheyka nima beradi?",
      code: "print(\"Son:\", maxfiy_son)",
      type: "single",
      options: [
        "Son: 42 — qiymat kernel xotirasida saqlanib qolgan",
        "NameError: name 'maxfiy_son' is not defined",
        "Son: None — o'chirilgan qiymat bo'sh bo'ladi",
        "Hech narsa — bu buyruq faqat natijalarni tozalaydi"
      ],
      answer: [1],
      explain: "Restart kernel xotirasini tozalaydi, kodda esa maxfiy_son ni aniqlaydigan qator qolmagan — NameError. Restart'siz qayta ishga tushirilganda 42 chiqardi: bu yashirin holat tuzog'i.",
      lesson: { title: "Kernel'ni qayta ishga tushirish", href: "07-Restarting-the-Kernel.md" }
    },
    {
      q: "Restart Kernel and Run All Cells biror yacheykada xatoga duch kelsa, uni o'tkazib yuborib, qolgan yacheykalarni bajarishda davom etadi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Agar yacheykalardan birida xato bo'lsa, Python shunchaki o'sha yerda to'xtaydi. Shuning uchun toza o'tgan Run All notebook boshidan oxirigacha ishlashini isbotlaydi.",
      lesson: { title: "Kernel'ni qayta ishga tushirish", href: "07-Restarting-the-Kernel.md" }
    }
  ]
};
