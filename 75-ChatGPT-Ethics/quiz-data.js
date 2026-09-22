window.QUIZ = {
  id: "75",
  title: "ChatGPT etikasi",
  subtitle: "Tokenlar, maxfiylik va tahrirlovchi, OpenAI sozlamalari, soxta manbalar, plagiat detektorlari va energiya iste'moli",
  next: { label: "Ma'lumot va AI regulyatsiyasi asoslari", href: "../76-Data-and-AI-Regulatory-Frameworks/README.md" },
  questions: [
    {
      q: "Quyidagi kod nima chiqaradi (darsdagi haqiqiy natijaga ko'ra)?",
      code: "import tiktoken\n\nenc = tiktoken.get_encoding(\"o200k_base\")\ntokenlar = enc.encode(\"o'zbekcha\")\nqismlar = [enc.decode([t]) for t in tokenlar]\nprint(len(tokenlar), qismlar)",
      type: "single",
      options: [
        "1 [\"o'zbekcha\"]",
        "5 ['o', \"'\", 'z', 'bek', 'cha']",
        "4 ['o', \"'z\", 'bek', 'cha']",
        "3 [\"o'z\", 'bek', 'cha']"
      ],
      answer: [2],
      explain: "Darsda o'zbekcha so'zi 4 tokenga bo'lindi va apostrof alohida token bo'lib qoldi. Shuning uchun o' va g' harflari har safar qo'shimcha token yeydi.",
      lesson: { title: "ChatGPT ni tushunish", href: "01-Understanding-ChatGPT.md" }
    },
    {
      q: "Alohida so'zlarda o'zbekcha jarima 2.14x, butun jumlada esa 1.79x chiqdi. Farqning sababi nima?",
      type: "single",
      options: [
        "Jumlada model o'zbekcha so'zlarni kontekstdan taniydi va kamroq bo'ladi",
        "Jumlada nuqta, vergul, bo'sh joy kabi \"arzon\" tokenlar jarimani suyultiradi",
        "Alohida so'zlar boshqa tokenizator bilan o'lchangani uchun natija farq qildi",
        "Jumlada inglizcha so'zlar ham ko'p token olgani uchun nisbat tenglashdi"
      ],
      answer: [1],
      explain: "Tinish belgilari va bo'sh joylar barcha tillarda arzon, ular jarimani suyultiradi. Shuning uchun alohida so'z — kalit so'zlar, teglar, qisqa buyruqlar — eng yomon holat.",
      lesson: { title: "ChatGPT ni tushunish", href: "01-Understanding-ChatGPT.md" }
    },
    {
      q: "So'z qancha uzun bo'lsa, u shuncha ko'p token oladi — 28 harfli antidisestablishmentarianism bunga yaqqol misol.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "28 harfli bu so'z atigi 6 token. Uzunlik ≠ token soni: tokenizator o'quv ma'lumotida ko'p uchragan bo'laklarni (ant, ablishment, ism) birlashtiradi.",
      lesson: { title: "ChatGPT ni tushunish", href: "01-Understanding-ChatGPT.md" }
    },
    {
      q: "Xodim ChatGPT ga mijoz ma'lumoti bor matnni yubordi, so'ng suhbatni o'chirib tashladi. Darsga ko'ra bu yetarlimi?",
      type: "single",
      options: [
        "Ha, suhbat o'chirilgach unga tegishli barcha promptlar ham darhol o'chadi",
        "Ha, agar keyin model o'qitishga ruxsat ham sozlamalardan o'chirilsa",
        "Yo'q, lekin xotira ham tozalansa, prompt izi to'liq yo'qoladi",
        "Yo'q — yuborilgan promptni o'chirib bo'lmaydi, himoya Enter'dan oldin"
      ],
      answer: [3],
      explain: "OpenAI FAQ: tarixdan aniq promptlarni o'chira olmaymiz. Yuborilgan narsa yuborilgan, shuning uchun yagona ishonchli nazorat nuqtasi — Enter tugmasidan oldin.",
      lesson: { title: "ChatGPT va maxfiylik", href: "02-Privacy-Concerns.md" }
    },
    {
      q: "Nega darsda nozik so'rovni bloklash o'rniga tahrirlash (redaction) yaxshiroq yo'l deb hisoblanadi?",
      type: "single",
      options: [
        "Bloklansa odam boshqa vositaga o'tadi, tahrirlangan savolga esa hamon javob bor",
        "Tahrirlash nozik ma'lumotni shifrlaydi, shuning uchun OpenAI uni o'qiy olmaydi",
        "Bloklash qonun bilan taqiqlangan, tahrirlash esa GDPR ning bevosita talabi",
        "Tahrirlash regex ishlatmaydi, shuning uchun hech narsani o'tkazib yubormaydi"
      ],
      answer: [0],
      explain: "8/8 tahrirlangan so'rov hamon javob beriladigan bo'lib qoldi, chunki nozik qism savolning ma'nosiga kirmaydi. Tahrirlovchi ham regex asosida ishlaydi va mukammal emas.",
      lesson: { title: "ChatGPT va maxfiylik", href: "02-Privacy-Concerns.md" }
    },
    {
      q: "Tahrirlovchi quyidagi matnni qanday qaytaradi?",
      code: "import re\n\nQOIDALAR = [(\"ichki URL\", r\"\\bhttps?://[\\w.-]*\\.(internal|local|corp)\\b\")]\n\ndef tahrirlash(matn):\n    for nom, naqsh in QOIDALAR:\n        matn = re.sub(naqsh, f\"[{nom.upper()}]\", matn, flags=re.I)\n    return matn\n\nprint(tahrirlash(\"Review this: https://wiki.acme.internal/roadmap-2026\"))",
      type: "single",
      options: [
        "Review this: [ICHKI URL]",
        "Review this: [ICHKI URL]/roadmap-2026",
        "Review this: https://[ICHKI URL]/roadmap-2026",
        "Review this: [ichki URL]/roadmap-2026"
      ],
      answer: [1],
      explain: "Regex faqat domen qismini (https://wiki.acme.internal) tutadi, yo'l qismi /roadmap-2026 qoladi — u ham ma'lumot bo'lishi mumkin. nom.upper() esa [ICHKI URL] beradi.",
      lesson: { title: "ChatGPT va maxfiylik", href: "02-Privacy-Concerns.md" }
    },
    {
      q: "Bepul/Plus hisobda qaysi mexanizmlar standart holatda YOQILGAN? (bir nechta javob)",
      type: "multi",
      options: [
        "Suhbat tarixi",
        "Vaqtinchalik suhbat",
        "Model o'qitishga ruxsat",
        "Xotira (Memory)"
      ],
      answer: [0, 2, 3],
      explain: "To'rttadan uchtasi — o'qitishga ruxsat, tarix va xotira — standartda yoqilgan. Ya'ni hech narsa qilmasangiz, eng ko'p ma'lumot saqlanadi. Vaqtinchalik suhbat standartda o'chirilgan.",
      lesson: { title: "OpenAI siyosatlari va ma'lumotni boshqarish", href: "03-OpenAI-Policies.md" }
    },
    {
      q: "Foydalanuvchi \"model o'qitishga ruxsat\"ni o'chirdi va endi suhbatlarim hech qayerda qolmaydi, deb o'ylaydi. Dars bo'yicha haqiqatda nima bo'ladi?",
      type: "single",
      options: [
        "Tarix darhol o'chadi, lekin xotira va serverdagi nusxa qoladi",
        "Hamma narsa o'chadi, faqat xotira funksiyasi saqlanib qoladi",
        "Faqat o'qitish to'xtaydi; tarix, xotira va server nusxasi qoladi",
        "Suhbatlar vaqtinchalik suhbat rejimiga o'tadi va saqlanmaydi"
      ],
      answer: [2],
      explain: "Bu eng ko'p yanglishiladigan joy: opt-out faqat o'qitishni to'xtatadi. Qaror jadvalida \"serverda qoladimi?\" ustuni hamma holatda True.",
      lesson: { title: "OpenAI siyosatlari va ma'lumotni boshqarish", href: "03-OpenAI-Policies.md" }
    },
    {
      q: "Siz ChatGPT ga hamkasbingiz haqida gapirib, so'ng o'sha suhbatni o'chirdingiz. Nega bu ma'lumot hali ham saqlanib qolishi mumkin?",
      type: "single",
      options: [
        "Chunki xotira suhbatlar orasida ishlaydi va alohida o'chirilishi kerak",
        "Chunki o'chirilgan suhbatlar avtomatik vaqtinchalik suhbatga ko'chadi",
        "Chunki AES shifrlash o'chirilgan ma'lumotni zaxiradan qayta tiklaydi",
        "Chunki o'chirish tugmasi faqat mobil ilovada to'liq ishlaydi"
      ],
      answer: [0],
      explain: "Suhbatni o'chirsangiz ham xotira qoladi. Xotira auditida eng muhim qadam — boshqa odam haqidagi ma'lumotni tekshirish, chunki ular rozilik bermagan.",
      lesson: { title: "OpenAI siyosatlari va ma'lumotni boshqarish", href: "03-OpenAI-Policies.md" }
    },
    {
      q: "Kurs maslahatiga amal qilib, modeldan manba so'raldi va u muallif, yil, sarlavha bilan 8 ta manba berdi. Darsning asosiy xulosasi nima?",
      type: "single",
      options: [
        "Formati mukammal bo'lgani uchun bu 8 ta manbaga bemalol ishonish mumkin",
        "Maslahat muammoni hal qilmaydi, ko'chiradi: endi 8 ta tekshirilmagan da'vo",
        "Model manbalarni to'qiy olmaydi, faqat nashr yillarida ba'zan adashadi",
        "Manba so'rash ham, har birini tekshirish ham taxminan bir xil vaqt oladi"
      ],
      answer: [1],
      explain: "So'rash 5 soniya, yaratish model uchun bepul, tekshirish esa har biri uchun bir necha daqiqa. Tekshirilmasa ahvol yomonlashadi, chunki manbali matn ishonchliroq ko'rinadi.",
      lesson: { title: "Dezinformatsiya va AI kontenti", href: "04-Misinformation.md" }
    },
    {
      q: "Model yollash algoritmlari haqidagi ish muallifi sifatida David M. Blei ni ko'rsatdi. Bu misol nimani ko'rsatadi va qaysi tekshiruv eng muhim?",
      type: "single",
      options: [
        "Model mavjud bo'lmagan ismlarni to'qiydi; faqat yilni tekshirish kifoya",
        "Model faqat mashhur olimlarni tilga oladi; demak manbaning o'zi haqiqiy",
        "Haqiqiy ism + mavjud bo'lmagan ish; muallif–mavzu mosligini tekshirish kerak",
        "Blei haqiqatda shu mavzuda yozgan; sarlavhani alohida qidirish ortiqcha"
      ],
      answer: [2],
      explain: "Blei — mavzuli modellashtirish (LDA) olimi, yollash algoritmlari uning sohasi emas. Ismni qidirsangiz topasiz, shuning uchun bunday gallyutsinatsiya eng ishonchli ko'rinadi.",
      lesson: { title: "Dezinformatsiya va AI kontenti", href: "04-Misinformation.md" }
    },
    {
      q: "Quyidagi n-gramma kodi nima chiqaradi? (b — a ning parafrazi)",
      code: "import re\n\ndef ngramma(matn, n=5):\n    sozlar = re.findall(r\"[a-z']+\", matn.lower())\n    return {tuple(sozlar[i:i+n]) for i in range(len(sozlar) - n + 1)}\n\ndef ustma_ust(a, b, n=5):\n    A, B = ngramma(a, n), ngramma(b, n)\n    return len(A & B) / len(A) if A else 0.0\n\na = \"The cat sat on the mat\"\nb = \"A feline rested upon a rug\"\nprint(ustma_ust(a, a, 3), ustma_ust(a, b, 3))",
      type: "single",
      options: [
        "1.0 0.5",
        "0.0 0.0",
        "1.0 1.0",
        "1.0 0.0"
      ],
      answer: [3],
      explain: "Aynan nusxa 1.0 beradi, parafrazda umumiy 3-gramma yo'q — 0.0. Butunlay begona matn ham 0.0 berganini darsda ko'rdik, ya'ni detektor parafrazni begona matndan ajrata olmaydi.",
      lesson: { title: "ChatGPT va plagiat", href: "05-Plagiarism.md" }
    },
    {
      q: "Talaba o'z inshosi noto'g'ri \"AI\" deb belgilanishidan qo'rqadi. Darsga ko'ra eng kuchli himoya qaysi?",
      type: "single",
      options: [
        "Inshoni yuborishdan oldin GPTZero kabi detektordan o'tkazib olish",
        "Matnni qisqaroq yozish, chunki uzun matn AI deb belgilanadi",
        "Qoralamalar tarixini (versiyalar ketma-ketligini) saqlab borish",
        "n-gramma detektorida n ni 3 ga tushirib tekshirish"
      ],
      answer: [2],
      explain: "Qoralamalar ketma-ketligi ish sizniki ekanini ko'rsatadi va uni soxtalashtirish qiyin. U detektorga umuman bog'liq emas — detektorlar esa 67% / 50% aniqlik ko'rsatgan.",
      lesson: { title: "ChatGPT va plagiat", href: "05-Plagiarism.md" }
    },
    {
      q: "0.3 Wh/so'rov — taxmin. Shunga qaramay, nega \"yillik ishlatish o'qitishdan katta\" degan xulosaga ishonish mumkin?",
      type: "single",
      options: [
        "Chunki 0.3 Wh qiymati OpenAI tomonidan rasman o'lchanib tasdiqlangan",
        "Chunki eng past taxminda (0.1 Wh) ham ishlatish 29.2 barobar katta",
        "Chunki kurs ham aynan shu 87.6 barobar raqamini o'z hisobida keltiradi",
        "Chunki o'qitish emissiyasi aslida 500 t emas, bir necha barobar kam"
      ],
      answer: [1],
      explain: "Sezgirlik tahlilida 0.1 Wh da 29.2x, 3.0 Wh da 876x chiqdi — har taxminda ishlatish g'olib. Kurs bu taqqoslashni umuman qilmaydi, u faqat o'qitishga urg'u beradi.",
      lesson: { title: "ChatGPT va atrof-muhit", href: "06-Environment.md" }
    },
    {
      q: "Darsga ko'ra ChatGPT ning uglerod iziga qaysi omillar KATTA ta'sir qiladi? (bir nechta javob)",
      type: "multi",
      options: [
        "Ma'lumot markazi joylashuvi va energiya manbasi",
        "Bitta foydalanuvchi kunlik so'rovlarini 20 dan 10 ga tushirishi",
        "Vazifa uchun kichikroq modelni tanlash",
        "Shablon bilan hal bo'ladigan savollarda AI ni umuman ishlatmaslik",
        "Suhbat tarixini muntazam o'chirib turish"
      ],
      answer: [0, 2, 3],
      explain: "Joylashuv 26.7x farq beradi, kichik model va shablon (0 Wh) ham katta ta'sirli. Shaxsiy so'rovlarni kamaytirish yiliga atigi ~0.4 kg CO2 tejaydi — matematik jihatdan kichik rol.",
      lesson: { title: "ChatGPT va atrof-muhit", href: "06-Environment.md" }
    }
  ]
};
