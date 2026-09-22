window.QUIZ = {
  id: "53",
  title: "Tovush va nutq asoslari",
  subtitle: "Koxlea va mel shkalasi, tovush to'lqini va so'nish, dB, faza, grebenka filtri va nutq energiyasi taqsimoti",
  next: { label: "Analogdan raqamliga", href: "../54-Analog-to-Digital-Conversion/README.md" },
  questions: [
    {
      q: "Darsda koxlea \"tabiiy spektrogramma\" deb ataladi. Buning sababi nima?",
      type: "single",
      options: [
        "U tovushni kuchaytirib, nog'ora pardaga uzatadigan yagona organ",
        "Bazilyar membrananing har bir joyi o'z chastotasiga javob beradi",
        "U to'lqin shaklini o'zgarishsiz miyaga yetkazib beradi",
        "U faqat 2–4 kHz oralig'idagi tovushlarni ajrata oladi"
      ],
      answer: [1],
      explain: "Koxlea boshida (tor, qattiq) yuqori, oxirida (keng, yumshoq) past chastotalarga javob beradi, ya'ni tovushni chastotalarga ajratadi. Miya to'lqin shaklini emas, chastota taqsimotini oladi; 2–4 kHz ni kuchaytirish esa quloq yo'lining ishi.",
      lesson: { title: "Odam nutqni qanday tanidi?", href: "01-How-Humans-Recognize-Speech.md" }
    },
    {
      q: "Darsdagi HTK mel formulasi bilan quyidagi kod nima chiqaradi?",
      code: "import numpy as np\n\ndef hz2mel(f):\n    return 2595 * np.log10(1 + f / 700)\n\nprint(f'{hz2mel(1000):.1f}')",
      type: "single",
      options: ["700.0", "2595.0", "1000.0", "1428.6"],
      answer: [2],
      explain: "2595 · log10(1 + 1000/700) ≈ 999.98, ya'ni 1000.0 mel. Darsdagi jadvalda ham 1000 Hz aynan 1000.0 mel ga to'g'ri keladi.",
      lesson: { title: "Odam nutqni qanday tanidi?", href: "01-How-Humans-Recognize-Speech.md" }
    },
    {
      q: "O'lchovda 100 Hz ga +100 Hz qo'shish 132.74 mel, 16 000 Hz ga +100 Hz qo'shish esa atigi 6.73 mel berdi. Bundan qanday amaliy xulosa kelib chiqadi?",
      type: "single",
      options: [
        "Mel filtrlar past chastotalarda tor va zich, yuqorida esa keng joylashadi",
        "Mel filtrlar butun diapazonda teng kenglikda joylashishi kerak",
        "Quloq yuqori chastotalarda taxminan 20 marta sezgirroq ishlaydi",
        "Mel shkalasi faqat 16 kHz dan yuqori chastotalar uchun kerak"
      ],
      answer: [0],
      explain: "Quloq past chastotalarda ~20× sezgirroq, shuning uchun mel filtrlar teng emas: eng tor filtr 44.4 Hz, eng kengi 518.6 Hz (11.7× farq). Past chastotalarga ko'proq e'tibor beriladi.",
      lesson: { title: "Odam nutqni qanday tanidi?", href: "01-How-Humans-Recognize-Speech.md" }
    },
    {
      q: "Ikki quloq bilan fazoviy eshitish haqida qaysi fikrlar darsga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "ITD (vaqt farqi) asosan 1.5 kHz dan past chastotalarda ishlaydi",
        "ILD (daraja farqi) yuqori chastotalarda ishlaydi, chunki bosh to'lqinni to'sadi",
        "ITD 1.5 kHz dan yuqorida eng aniq ishlaydi, chunki to'lqin qisqa",
        "Boshning kengligi ~22 sm bo'lganda maksimal vaqt farqi taxminan 0.82 ms",
        "ILD past chastotalarda kuchli, chunki uzun to'lqin boshda to'xtaydi"
      ],
      answer: [0, 1, 3],
      explain: "200 Hz da to'lqin uzunligi (1.72 m) boshdan ancha katta, bosh to'smaydi va ITD ishlaydi; 4000 Hz da (0.086 m) bosh to'sadi va ILD ishlaydi. 1.5 kHz dan yuqorida ITD faza noaniq bo'lgani uchun ishlamaydi; maksimal ITD 824.5 µs o'lchangan.",
      lesson: { title: "Odam nutqni qanday tanidi?", href: "01-How-Humans-Recognize-Speech.md" }
    },
    {
      q: "To'g'rimi: darsning xulosasiga ko'ra ASR ning qiymati odamdan aniqroq ekanida emas, balki charchamasligi va miqyoslanishida (bir vaqtda 1000 oqim).",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [0],
      explain: "Shovqinda va \"kokteyl bazmi\" holatida odam hali ham ancha ustun. Dars xulosasi: ASR odamdan yaxshiroq emas, u boshqacha — charchamaydi va miqyoslanadi, qiymati shunda.",
      lesson: { title: "Odam nutqni qanday tanidi?", href: "01-How-Humans-Recognize-Speech.md" }
    },
    {
      q: "Nima uchun kosmosda tovush tarqalmaydi, yorug'lik esa tarqaladi?",
      type: "single",
      options: [
        "Kosmosda harorat juda past bo'lgani uchun tovush tezligi nolga tushadi",
        "Tovush ko'ndalang to'lqin bo'lgani uchun uni vakuum yutib yuboradi",
        "Tovush chastotasi kosmosda keskin pasayib, eshitilmay qoladi",
        "Tovush mexanik to'lqin va unga zarralardan iborat muhit kerak"
      ],
      answer: [3],
      explain: "Tovush — mexanik (bo'ylama) to'lqin, u zarralar orqali uzatiladi; vakuumda zarra yo'q. Yorug'lik esa elektromagnit to'lqin, unga muhit kerak emas.",
      lesson: { title: "Tovush to'lqinlarining asoslari", href: "02-Fundamentals-of-Sound-Waves.md" }
    },
    {
      q: "Geometrik yoyilish uchun darsdagi hisobni takrorlaymiz. Oxirgi qatorda nima chiqadi?",
      code: "import numpy as np\n\nfor d in [1, 2, 4]:\n    print(f'{d} m -> {20*np.log10(1/d):+.2f} dB')",
      type: "single",
      options: ["4 m -> -6.02 dB", "4 m -> -12.04 dB", "4 m -> -24.08 dB", "4 m -> -4.00 dB"],
      answer: [1],
      explain: "Masofa har 2 baravar ortganda daraja 6.02 dB pasayadi: 2 m da −6.02, 4 m da −12.04 dB. Bu geometrik so'nish chastotaga bog'liq emas.",
      lesson: { title: "Tovush to'lqinlarining asoslari", href: "02-Fundamentals-of-Sound-Waves.md" }
    },
    {
      q: "Uzoqdagi konsertdan faqat bas eshitiladi. Darsga ko'ra buning asosiy sababi nima?",
      type: "single",
      options: [
        "Geometrik yoyilish yuqori chastotalarni pastlaridan ko'proq so'ndiradi",
        "Faqat difraksiya: uzun to'lqinlar to'siqni aylanib o'tadi",
        "Havoda yutilish: 8 kHz 125 Hz dan taxminan 292× tez yutiladi",
        "Havo harorati pasayganda yuqori chastotalar tezligi kamayadi"
      ],
      answer: [2],
      explain: "Dars ta'kidlaydi: kurs buni difraksiya bilan tushuntirgandek qoldiradi, lekin asosiy sabab — havoda yutilish (125 Hz 0.4, 8 kHz 117 dB/km). Geometrik yoyilish esa hamma chastota uchun bir xil.",
      lesson: { title: "Tovush to'lqinlarining asoslari", href: "02-Fundamentals-of-Sound-Waves.md" }
    },
    {
      q: "Tovush to'lqinining tarqalishi haqida qaysi fikrlar to'g'ri? (bir nechta javob)",
      type: "multi",
      options: [
        "Havo zarralari joyida tebranadi, ilgarilaydigan narsa — energiya",
        "Suvda tezlik ortgani uchun ovoz yuqoriroq ohangda eshitiladi",
        "Tezlik o'zgarganda chastota emas, to'lqin uzunligi o'zgaradi",
        "Harorat −20 dan +40 °C gacha o'zgarsa, tezlik atigi ~11% o'zgaradi",
        "Gapirganda havo oqimi hosil bo'lib, sham alangasi tebranadi"
      ],
      answer: [0, 2, 3],
      explain: "Zarralar ~10 nm tebranadi, to'lqin esa 343 m/s da ilgarilaydi. λ = v/f bo'lgani uchun muhitda chastota o'zgarmaydi, shuning uchun suv ostida ham ovoz o'sha ohangda eshitiladi; havo oqimi hosil bo'lmaydi.",
      lesson: { title: "Tovush to'lqinlarining asoslari", href: "02-Fundamentals-of-Sound-Waves.md" }
    },
    {
      q: "Quyidagi kod nima chiqaradi?",
      code: "import numpy as np\n\na = 20 * np.log10(2)\nb = 10 * np.log10(2)\nprint(f'{a:.2f} {b:.2f}')",
      type: "single",
      options: ["3.01 6.02", "6.02 6.02", "2.00 1.00", "6.02 3.01"],
      answer: [3],
      explain: "Amplituda uchun 20·log10, quvvat uchun 10·log10 ishlatiladi: amplituda 2× — 6.02 dB, quvvat 2× — 3.01 dB. Audio namunalar amplituda bo'lgani uchun 20·log10 qo'llanadi.",
      lesson: { title: "Tovush to'lqinining xossalari", href: "03-Properties-of-Sound-Waves.md" }
    },
    {
      q: "Ikki bir xil 440 Hz to'lqin qo'shiladi, ikkinchisi 180° ga surilgan. Kod nima chiqaradi?",
      code: "import numpy as np\n\nt = np.linspace(0, 0.01, 441, endpoint=False)\na = np.sin(2 * np.pi * 440 * t)\nb = np.sin(2 * np.pi * 440 * t + np.deg2rad(180))\nprint(f'{np.abs(a + b).max():.4f}')",
      type: "single",
      options: ["0.0000", "2.0000", "1.0000", "1.4142"],
      answer: [0],
      explain: "180° faza farqida ikki to'lqin bir-birini to'liq bekor qiladi, amplituda 0.0000. ANC quloqchinlari aynan shu prinsipda ishlaydi; 2.0000 esa 0° holatiga tegishli.",
      lesson: { title: "Tovush to'lqinining xossalari", href: "03-Properties-of-Sound-Waves.md" }
    },
    {
      q: "Yozuvning krest-faktori 5 dB chiqdi (nutq uchun odatda 12–20 dB). Bu nimani bildiradi?",
      type: "single",
      options: [
        "Yozuv juda jim, RMS darajasini oshirish kifoya",
        "Audio siqilgan yoki buzilgan bo'lishi mumkin",
        "Yozuvda yuqori chastotalar juda ko'p saqlangan",
        "Bu toza studiya yozuvining odatiy belgisi"
      ],
      answer: [1],
      explain: "Krest-faktor — cho'qqi va RMS orasidagi masofa. Nutqda u odatda 12–20 dB; 6 dB dan past bo'lsa, audio siqilgan yoki buzilgan.",
      lesson: { title: "Tovush to'lqinining xossalari", href: "03-Properties-of-Sound-Waves.md" }
    },
    {
      q: "Aks-sadoli xonada ASR yomon ishlaydi. Darsdagi grebenka filtri tajribasi buni qanday tushuntiradi?",
      type: "single",
      options: [
        "Xona fon shovqinini ko'paytiradi va u nutqni to'liq bosib ketadi",
        "Aks-sado faqat 4 kHz dan yuqori chastotalarni yo'q qiladi",
        "Kechikkan nusxa qo'shilib, interferensiya tufayli ayrim chastotalar yo'qoladi",
        "Aks-sado nutqning asosiy chastotasini ikki baravar oshirib yuboradi"
      ],
      answer: [2],
      explain: "2 ms kechikish (68.6 sm) nutq diapazonida 247, 748, 1248 ... Hz kabi 6 ta chuqurlik hosil qiladi. Muammo shovqinda emas, interferensiyada.",
      lesson: { title: "Tovush to'lqinining xossalari", href: "03-Properties-of-Sound-Waves.md" }
    },
    {
      q: "Nutq faqat 0–300 Hz qoldirilib filtrlandi: energiyaning 59% i saqlandi, lekin so'zlar tushunarsiz. Faqat 800–2500 Hz qoldirilganda esa so'zlar tushunarli. Bu nimani ko'rsatadi?",
      type: "single",
      options: [
        "Energiya ≠ ma'lumot: 0–300 Hz kim gapirayotganini, F1/F2 esa ma'noni tashiydi",
        "Past chastotalar eng ko'p energiyaga ega, demak fonemani ham ular belgilaydi",
        "Filtr noto'g'ri ishlagan, chunki 59% energiya so'zlarni saqlashi kerak edi",
        "Nutqning ma'nosi asosan 4000–8000 Hz dagi s, sh, f, t da joylashgan"
      ],
      answer: [0],
      explain: "Energiyaning 59.12% i f0 va garmonikalarda — u gapiruvchini ko'rsatadi, fonemani emas. Ma'noni tashiydigan 300–2500 Hz oralig'ida atigi 29.39% energiya bor.",
      lesson: { title: "Tovush to'lqinining xossalari", href: "03-Properties-of-Sound-Waves.md" }
    },
    {
      q: "To'g'rimi: telefon yozuvida (4 kHz dan yuqorisi kesilgan) yo'qolgan s, sh, f, t chastotalarini keyinchalik qayta ishlash bilan qaytarib olish mumkin.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Telefon kanalidan keyin 4 kHz dan yuqoridagi energiya 9.30% dan 0.00% ga tushadi, yo'qolgan chastotalarni qaytarib bo'lmaydi. Shuning uchun modelni aynan telefon audiosida sinash kerak.",
      lesson: { title: "Tovush to'lqinining xossalari", href: "03-Properties-of-Sound-Waves.md" }
    }
  ]
};
