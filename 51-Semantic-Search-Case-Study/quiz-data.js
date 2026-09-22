window.QUIZ = {
  id: "51",
  title: "Semantik qidiruv — amaliy loyiha",
  subtitle: "365 kurslari uchun semantik qidiruv: ma'lumotni tayyorlash, model tanlash, chegara, sinxronlash, bo'lim darajasi va qo'llanishlar",
  next: { label: "Nutqni tanish — kirish", href: "../52-Speech-Recognition-Introduction/README.md" },
  questions: [
    {
      q: "Kurs case study'da faqat vektor bazasi qismini ishlatib, hech qanday generativ javob qo'shmagan. Darsga ko'ra bu qaror nega to'g'ri?",
      type: "single",
      options: [
        "Generativ model qidiruvdan ancha tez ishlagani uchun uni keyinga qoldirish mumkin",
        "Qidiruv haqiqiy kurs nomlarini beradi, generativ xulosa esa yolg'on to'qishi mumkin",
        "Vektor bazasi generativ model bilan texnik jihatdan birga ishlay olmaydi, API mos emas",
        "Generativ qism faqat o'zbekcha so'rovlarni inglizchaga tarjima qilish uchun kerak"
      ],
      answer: [1],
      explain: "Qidiruv natijasini tekshirish mumkin — bu real kurs nomlari. Generativ xulosa esa \"faqat kontekstdan foydalan\" deyilsa ham yolg'on to'qishi mumkin.",
      lesson: { title: "Semantik qidiruvga kirish", href: "01-Introduction-to-Semantic-Search.md" }
    },
    {
      q: "\"clustering\" so'rovi natija beradi, lekin \"clustering in Python\" 0 natija beradi, garchi Machine Learning in Python kursida clustering bo'limi bo'lsa ham. Sababi nima?",
      type: "single",
      options: [
        "CSV fayl cp1252 kodlashda bo'lgani uchun \"Python\" so'zi to'g'ri o'qilmaydi",
        "Machine Learning in Python kursida aslida clustering degan bo'lim umuman yo'q",
        "An'anaviy qidiruv butun iborani izlaydi, kurs va bo'lim nomini birga ko'rmaydi",
        "Qidiruv katta-kichik harfni farqlagani uchun \"Python\" so'zi topilmaydi"
      ],
      answer: [2],
      explain: "LIKE '%clustering in Python%' butun iborani talab qiladi: Python kurs nomida, clustering bo'lim nomida, lekin birga hech qayerda yo'q. Semantik qidiruvda ikkalasi bitta vektorda birlashadi.",
      lesson: { title: "Case study muammosi — 365 kurslari uchun aqlli qidiruv", href: "02-Case-Study-Problem.md" }
    },
    {
      q: "pd.read_csv(\"course_descriptions.csv\") standart UTF-8 bilan UnicodeDecodeError (byte 0x92) berdi. To'g'ri yechim qaysi?",
      type: "single",
      options: [
        "encoding=\"cp1252\" berish, chunki faylda Windows'ga xos belgilar bor",
        "encoding=\"ascii\" berish, chunki fayl faqat lotin harflaridan iborat",
        "errors=\"ignore\" bilan 0x92 baytini o'chirib, UTF-8 da o'qish",
        "Faylni Excel'da ochib, qayta saqlamasdan pandas bilan o'qish"
      ],
      answer: [0],
      explain: "0x92 — Windows'ning qiyshiq apostrofi. Kurs uni \"ANSI\" deb ataydi, bu Windows-1252, pandas'da encoding=\"cp1252\".",
      lesson: { title: "Case study ma'lumoti bilan tanishish", href: "03-Getting-to-Know-the-Data.md" }
    },
    {
      q: "Darsdagi tozala() funksiyasi bu satrni qanday qaytaradi?",
      code: "def tozala(s):\n    return \" \".join(str(s).replace(\"\\r\", \" \").replace(\"\\n\", \" \").split())\n\nprint(repr(tozala(\"Tableau\\r\\r\\n  free version.\")))",
      type: "single",
      options: [
        "'Tableau\\n free version.'",
        "'Tableau   free version.'",
        "'Tableaufree version.'",
        "'Tableau free version.'"
      ],
      answer: [3],
      explain: "\\r va \\n bo'sh joyga almashtiriladi, keyin split() va \" \".join() hamma ortiqcha bo'sh joyni bitta probelga aylantiradi. Faylda jami 3848 ta \\r bor edi.",
      lesson: { title: "Case study ma'lumoti bilan tanishish", href: "03-Getting-to-Know-the-Data.md" }
    },
    {
      q: "Kurs tartibida matnlarning 52% qismi 256 token chegarasidan oshardi. Bo'lim nomini oldinga qo'yib qisqartirilganda (0% kesilish) aniqlik qanday o'zgardi?",
      type: "single",
      options: [
        "7/8 dan 8/8 ga oshdi — kesilish yo'qolgani uchun",
        "7/8 dan 6/8 ga tushdi — qisqaroq matn aniqlikni oshirmadi",
        "O'zgarmadi — ikkala tartibda ham 7/8 bo'lib qoldi",
        "6/8 dan 7/8 ga oshdi — bo'lim nomi eng muhim signal ekan"
      ],
      answer: [1],
      explain: "Kurs tartibida course_description oldinda turib, mavzuni yaxshi tavsiflaydi va aynan u embeddingga kiradi. Bo'lim nomi esa ba'zan juda qisqa (\"Conclusion\"). Xulosa: muhimi qaysi matn kesilishi, taxmin qilmay o'lchash kerak.",
      lesson: { title: "Ma'lumotni tayyorlash", href: "04-Data-Preprocessing.md" }
    },
    {
      q: "Darsda ajratish (ajratish = mos_o'rt − nomos_o'rt) eng muhim ko'rsatkich deyiladi. Katta ajratish nimani bildiradi?",
      type: "single",
      options: [
        "Model vektorlari kattaroq o'lchamli bo'lib, ko'proq ma'no sig'dirishini",
        "Model matnni tezroq embedding qilib, so'rovga tez javob berishini",
        "Mos va nomos savollar ballari yaxshi ajralib, chegara qo'yish osonligini",
        "Model uzun matnda ham ko'proq tokenni kesmasdan qabul qilishini"
      ],
      answer: [2],
      explain: "Ajratish katta bo'lsa mos va nomos ballar aralashmaydi, chegara ishonchli bo'ladi. Masalan, all-mpnet-base-v2 da ajratish 0.4988 — uch modelning eng yaxshisi.",
      lesson: { title: "Embedding algoritmlarini tanlash", href: "05-Embedding-Algorithms.md" }
    },
    {
      q: "paraphrase-multilingual-MiniLM-L12-v2 modeli haqida darsda qaysi o'lchovlar keltirilgan? (bir nechta javob)",
      type: "multi",
      options: [
        "O'zbekcha so'rovlarda UZ/EN nisbati 0.80 (all-MiniLM-L6-v2 da 0.39)",
        "Maksimal kontekst atigi 128 token",
        "Vektor normasi 5.083 — ya'ni normallashtirish kerak",
        "Uchala model ichida eng katta ajratishga ega — 0.4988, shuning uchun tanlangan",
        "Vektor o'lchami 768, ya'ni all-mpnet-base-v2 bilan bir xil"
      ],
      answer: [0, 1, 2],
      explain: "Ko'p tilli modelda UZ/EN 0.80, kontekst 128 token, norma 5.083. Eng katta ajratish (0.4988) va 768 o'lcham esa all-mpnet-base-v2 ga tegishli.",
      lesson: { title: "Embedding algoritmlarini tanlash", href: "05-Embedding-Algorithms.md" }
    },
    {
      q: "numpy embedding'larni Pinecone'ga yuklashda \"TypeError: Object of type float32 is not JSON serializable\" chiqdi. Qaysi yozuv bu xatoni tuzatadi?",
      code: "for b in range(0, len(ids), 100):\n    s = slice(b, b + 100)\n    indeks.upsert(vectors=[\n        {\"id\": i, \"values\": ???, \"metadata\": m}\n        for i, v, m in zip(ids[s], E[s], M[s])])",
      type: "single",
      options: [
        "np.asarray(v)",
        "list(map(float, v))",
        "v.astype(\"float32\")",
        "v / np.linalg.norm(v)"
      ],
      answer: [1],
      explain: "numpy.float32 JSON'ga serializatsiya bo'lmaydi, shuning uchun har qiymatni oddiy Python float'ga o'tkazish kerak: list(map(float, v)). np.asarray(v) va v / norm(v) esa baribir numpy float32 massiv bo'lib qoladi.",
      lesson: { title: "Vektorlash va bazaga yuklash", href: "06-Embedding-and-Upserting.md" }
    },
    {
      q: "Sinov to'plamida javobi bor savollarning eng past balli va javobi yo'q savollarning eng yuqori balli olindi. Kod nima chop etadi?",
      code: "bor_min, yoq_maks = 0.5326, 0.2190\nchegara = (bor_min + yoq_maks) / 2\nprint(round(chegara, 4))",
      type: "single",
      options: [
        "0.3136",
        "0.4000",
        "0.3758",
        "0.2190"
      ],
      answer: [2],
      explain: "(0.5326 + 0.2190) / 2 = 0.3758 — darsda o'lchangan chegara, kursning 0.4 si bilan deyarli bir xil. 0.3136 esa oraliq (0.5326 − 0.2190).",
      lesson: { title: "O'xshashlik qidiruvi va chegara", href: "07-Similarity-Search.md" }
    },
    {
      q: "\"how to cook pasta\" so'roviga 0.1743 ball bilan baribir kurs qaytdi. Darsga ko'ra buning sababi va yechimi qanday?",
      type: "single",
      options: [
        "Baza doim eng yaqin k ta vektorni qaytaradi; \"topilmadi\"ni chegara bilan siz hal qilasiz",
        "Model pasta haqidagi kurslarni noto'g'ri indekslagan; bazani qayta indekslash kerak",
        "top_k juda kichik tanlangan; top_k=100 qilinsa baza bo'sh natija qaytaradi",
        "Chroma ball emas, masofa qaytaradi; 1 − masofa qilinsa bu natija yo'qoladi"
      ],
      answer: [0],
      explain: "Vektor baza hech qachon \"topilmadi\" demaydi — u qanchalik uzoq bo'lsa ham eng yaqinlarini beradi. O'lchangan 0.3758 chegarasi bu natijani kesadi.",
      lesson: { title: "O'xshashlik qidiruvi va chegara", href: "07-Similarity-Search.md" }
    },
    {
      q: "Bazada 1, 2, 3 ID'lari bor. Yangi CSV'da 1 o'zgarmagan, 2 o'zgargan, 3 olib tashlangan, 4 yangi. Sinxronlash kodi nima chop etadi?",
      code: "eski  = {\"1\": \"a\", \"2\": \"b\", \"3\": \"c\"}\nyangi = {\"1\": \"a\", \"2\": \"x\", \"4\": \"d\"}\nqoshish   = [i for i in yangi if i not in eski]\nyangilash = [i for i in yangi if i in eski and eski[i] != yangi[i]]\nochirish  = [i for i in eski if i not in yangi]\nprint(qoshish, yangilash, ochirish)",
      type: "single",
      options: [
        "['4'] ['1', '2'] ['3']",
        "['4'] ['2'] []",
        "['4'] ['2'] ['3']",
        "['2', '4'] [] ['3']"
      ],
      answer: [2],
      explain: "4 yangi — qo'shiladi, 2 ning xeshi o'zgargan — yangilanadi, 3 yangi ro'yxatda yo'q — o'chiriladi. 1 o'zgarmagan, qayta vektorlanmaydi.",
      lesson: { title: "Bazani yangilash", href: "08-Updating-the-Database.md" }
    },
    {
      q: "Kurs bazani yangi CSV'dan oddiy upsert bilan yangilaydi. Darsga ko'ra bu usulda qaysi holatlar qoplanmagan? (bir nechta javob)",
      type: "multi",
      options: [
        "Yangi qo'shilgan kurs bazaga umuman yozilmaydi va qidiruvda chiqmaydi",
        "Katalogdan o'chirilgan kurs bazada arvoh yozuv bo'lib qoladi",
        "O'zgarmagan kurslar ham behuda qayta vektorlanadi",
        "Mavjud kursning matni o'zgarsa, bazadagi vektori yangilanmaydi",
        "Yangilash yarim yo'lda uzilsa, baza nomuvofiq holatda qoladi"
      ],
      answer: [1, 2, 4],
      explain: "Upsert yangini qo'shadi va mavjudini yangilaydi, lekin CSV'da yo'q yozuvni ko'rmaydi, o'zgarmaganni ham qayta hisoblaydi va uzilishdan himoya qilmaydi. Yechim — xesh va o'chirish to'plami bilan sinxronlash.",
      lesson: { title: "Bazani yangilash", href: "08-Updating-the-Database.md" }
    },
    {
      q: "Bo'lim natijalarini kurs bo'yicha guruhlashda quyidagi kod ishlatildi. U nima chop etadi va bu nega muammo?",
      code: "natija = [(\"A\", 0.70), (\"B\", 0.50), (\"B\", 0.45), (\"B\", 0.40)]\nkurslar = {}\nfor nom, ball in natija:\n    kurslar[nom] = kurslar.get(nom, 0) + ball\nprint(max(kurslar, key=kurslar.get))",
      type: "single",
      options: [
        "A — eng mos bo'lim A kursida bo'lgani uchun to'g'ri natija",
        "B — ko'p bo'limli kurs ballar yig'indisi hisobiga yutadi",
        "A — chunki get() faqat birinchi ballni saqlaydi",
        "B — chunki B ning har bir bo'limi A dan mosroq"
      ],
      answer: [1],
      explain: "+= bilan B ning yig'indisi 1.35 bo'lib, 0.70 li A dan oshadi, garchi har bir bo'limi kamroq mos bo'lsa ham. Darsda max() tavsiya qilinadi — shunda A (0.70) yutadi.",
      lesson: { title: "Bo'lim darajasidagi qidiruv", href: "09-Section-Level-Search.md" }
    },
    {
      q: "Og'irlikli embedding bo'yicha 8 ta tajribada kamida bittasi aniqlikni 7/8 dan 8/8 ga oshirdi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "Sakkizala tajriba 7/8 berdi — aniqlik umuman o'zgarmadi, hisob esa 3 baravar ko'paydi. Faqat ajratish o'zgardi: course_technology olib tashlanganda eng yaxshisi (0.4935), texnologiya ×3 da eng yomoni (0.3982).",
      lesson: { title: "Og'irlikli embedding (kursning topshirig'i)", href: "10-Weighted-Embeddings.md" }
    },
    {
      q: "Qidiruv tizimiga \"shunga o'xshash kurslar\" tavsiyasini qo'shish kerak. Darsga ko'ra nimani o'zgartirish yetarli?",
      type: "single",
      options: [
        "Yangi tavsiya modelini o'qitib, kurslar uchun alohida vektor baza qurish kerak",
        "E @ E.T matritsasini hisoblab, eng past ballli kurslarni tavsiya qilish kerak",
        "BM25 bilan kalit so'zlarni solishtirib, RRF bilan birlashtirish kerak",
        "Mavjud kursning o'z vektori E[i] so'rov vektori qilinadi, qolgan kod o'zgarmaydi"
      ],
      answer: [3],
      explain: "Tavsiya — qidiruvning o'zi: q = model.encode(savol) o'rniga q = E[i]. Eng past eng yaqin ball esa anomaliya aniqlashga tegishli.",
      lesson: { title: "Vektor bazalarining qo'llanishlari", href: "11-Applications.md" }
    }
  ]
};
