window.QUIZ = {
  id: "65",
  title: "Streamlit bilan tanishuv",
  subtitle: "venv va AppTest, Streamlit afzallik-kamchiliklari, formatlash, st.write, chat elementlari va session_state",
  next: { label: "Prototipni ishlab chiqish", href: "../66-Developing-the-Prototype/README.md" },
  questions: [
    {
      q: "Kurs VS Code, Python, Anaconda va Streamlit o'rnatishni talab qiladi. Darsga ko'ra ulardan qaysi biri haqiqatan kerak emas va nega?",
      type: "single",
      options: [
        "Python — chunki Streamlit o'z ichida alohida Python interpretatorini olib keladi",
        "Anaconda — chunki u 3–5 GB joy oladi, ~50 MB li venv esa yetarli",
        "Streamlit — chunki uni Anaconda ichidan to'g'ridan-to'g'ri chaqirish mumkin",
        "venv — chunki Streamlit faqat global muhitda to'g'ri ishlaydi"
      ],
      answer: [1],
      explain: "Faqat Python va Streamlit shart. Anaconda 3–5 GB, venv esa ~50 MB va yetarli; VS Code ham majburiy emas, istalgan muharrir bo'ladi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-Environment.md" }
    },
    {
      q: "Streamlit ilovasini CI da, brauzer ochmasdan avtomatik sinash kerak. Darsdagi qaysi yondashuvlar bunga mos? (bir nechta javob)",
      type: "multi",
      options: [
        "streamlit.testing.v1 dagi AppTest bilan skriptni kodda ishga tushirish",
        "at.button[0].click().run() bilan tugma bosishni taqlid qilish",
        "at.session_state orqali ilova holatini o'qib tekshirish",
        "Brauzerda R tugmasini bosib, natijani ko'z bilan solishtirish",
        ".streamlit/config.toml da gatherUsageStats = true qilib qo'yish"
      ],
      answer: [0, 1, 2],
      explain: "AppTest — brauzersiz sinashning rasmiy vositasi: u bilan tugma bosiladi, session_state o'qiladi va CI da test yoziladi. gatherUsageStats esa telemetriya sozlamasi, uni false qilish tavsiya etiladi.",
      lesson: { title: "Muhitni sozlash", href: "01-Setting-Up-Environment.md" }
    },
    {
      q: "Darsdagi o'lchovda st.dataframe bilan 1 000 dan 500 000 qatorgacha DataFrame ko'rsatildi. Qanday xulosa qilindi?",
      type: "single",
      options: [
        "Vaqt ma'lumot hajmiga chiziqli bog'liq bo'lib, 500 000 qatorda bir necha soniyaga yetdi",
        "500 000 qatorda Streamlit xotira xatosi berdi, shuning uchun kursning da'vosi to'g'ri",
        "Vaqt deyarli tekis qoldi: ma'lumot 500× oshdi, vaqt atigi ~1.15× oshdi",
        "1 000 qator eng sekin chiqdi, chunki kichik jadvallar keshlanmaydi"
      ],
      answer: [2],
      explain: "Isitishdan keyingi mediana 457 ms dan 524 ms gacha bo'ldi — ~440 ms AppTest ning doimiy narxi. Isitishsiz birinchi o'lchovdagi 1 151.8 ms esa import narxi edi, keshlash bilan bog'liq emas.",
      lesson: { title: "Streamlit — afzalliklari va kamchiliklari", href: "02-Streamlit-Pros-and-Cons.md" }
    },
    {
      q: "Kurs 'har o'zaro ta'sirda butun skript qayta ishga tushadi' degan narsani kamchilik deydi. Dars nega buni aslida afzallik deb hisoblaydi?",
      type: "single",
      options: [
        "Chunki qayta ishga tushish faqat tugma bosilganda bo'ladi, slayderda esa bo'lmaydi",
        "Chunki UI skriptning joriy natijasi bo'ladi va holatni sinxronlash muammosi yo'qoladi",
        "Chunki Streamlit qayta ishga tushishda barcha hisob-kitoblarni avtomatik keshlaydi",
        "Chunki qayta ishga tushish React dagi useEffect bilan bir xil ishlaydi va tanish"
      ],
      answer: [1],
      explain: "Skript yuqoridan pastga ishlaydi va nima ko'rinsa, shu holat — 'state management' kerak emas. Narxi bor: qimmat hisob uchun cache_data, model uchun cache_resource, holat uchun session_state kerak bo'ladi.",
      lesson: { title: "Streamlit — afzalliklari va kamchiliklari", href: "02-Streamlit-Pros-and-Cons.md" }
    },
    {
      q: "Quyidagi kod ishga tushirilsa, AppTest nima ko'rsatadi?",
      code: "at = AppTest.from_string('import streamlit as st\\nst.write(\":purple[matn]\")')\nat.run()\nprint(len(at.exception))\nprint([m.value for m in at.markdown])",
      type: "single",
      options: [
        "1 va [] — purple rangi uchun StreamlitAPIException chiqadi",
        "0 va ['matn'] — noma'lum rang teglari jimgina olib tashlanadi",
        "0 va [':violet[matn]'] — purple avtomatik violet ga almashtiriladi",
        "0 va [':purple[matn]'] — xato yo'q, matn xom holda qoladi"
      ],
      answer: [3],
      explain: "purple qo'llab-quvvatlanmaydi (violet bor), lekin Streamlit xato bermaydi: foydalanuvchi ekranda :purple[matn] ni xom holda ko'radi. Bu — jimgina xato.",
      lesson: { title: "Sarlavhalar va formatlash", href: "03-Titles-Headers-Formatting.md" }
    },
    {
      q: "Formatlash bo'yicha qaysi tavsiya darsga mos keladi?",
      type: "single",
      options: [
        "st.title ni sahifada bitta ishlatish, bo'limlar uchun st.header va st.subheader olish",
        "st.latex da oddiy satr ishlatish, chunki xom satr formulani noto'g'ri chizadi",
        "Emoji o'rniga har doim :wave: kabi shortcode yozish, chunki u barqarorroq",
        "Har bir bo'lim boshida st.title qo'yish, chunki u eng katta va ko'zga tashlanadi"
      ],
      answer: [0],
      explain: "st.title — sahifaning nomi, shuning uchun bitta bo'ladi. st.latex da r\"...\" shart (aks holda \\f escape deb o'qiladi), to'g'ridan-to'g'ri Unicode emoji esa shortcode'dan xavfsizroq.",
      lesson: { title: "Sarlavhalar va formatlash", href: "03-Titles-Headers-Formatting.md" }
    },
    {
      q: "Bu skript AppTest da ishlatilsa, at.markdown da qaysi qiymat bo'ladi?",
      code: "import streamlit as st\njavob = None\nst.write(\"Natija:\", javob)",
      type: "single",
      options: [
        "'Natija:' — None jimgina yo'qoladi",
        "'Natija: `None`' — None bektik ichida ko'rinadi",
        "Hech narsa — st.write None uchun TypeError beradi",
        "'Natija: null' — None JSON ko'rinishiga o'giriladi"
      ],
      answer: [1],
      explain: "Bir nechta argument bitta qatorga qo'shiladi, None esa kod (bektik) sifatida ko'rinadi. Foydalanuvchiga bu texnik nosozlikdek tuyuladi, shuning uchun None ni oldindan tekshirish kerak.",
      lesson: { title: "Matn metodlari", href: "04-Text-Methods.md" }
    },
    {
      q: "Ilova foydalanuvchi yozgan matnni ekranga chiqaradi. Kimdir '# MEN SARLAVHAMAN' deb yozib, sahifa ko'rinishini buzmoqchi. Darsga ko'ra qaysi metod xavfsiz?",
      type: "single",
      options: [
        "st.write — u matn turini o'zi aniqlaydi va markdownni ishlamaydi",
        "st.markdown(..., unsafe_allow_html=True) — HTML ni to'g'ri qochiradi",
        "st.text — u hech narsani ishlamaydi va matnni xom holda chiqaradi",
        "st.title — sarlavha ichidagi markdown avtomatik o'chiriladi"
      ],
      answer: [2],
      explain: "st.write foydalanuvchi yozgan # ni haqiqiy sarlavha qilib chizadi. unsafe_allow_html=True esa foydalanuvchi matni bilan XSS zaifligini ochadi; st.text esa hech narsani formatlamaydi.",
      lesson: { title: "Matn metodlari", href: "04-Text-Methods.md" }
    },
    {
      q: "Bu kod AppTest da bir marta ishga tushirilsa, oxirgi qatorda nima chiqadi?",
      code: "@st.cache_data\ndef qimmat_hisob(n):\n    st.session_state.chaqiruvlar += 1\n    return sum(range(n))\n\nst.write(qimmat_hisob(100_000))\nst.write(qimmat_hisob(100_000))\nst.write(qimmat_hisob(200_000))\nst.write(f\"funksiya {st.session_state.chaqiruvlar} marta bajarildi\")",
      type: "single",
      options: [
        "funksiya 1 marta bajarildi",
        "funksiya 3 marta bajarildi",
        "funksiya 0 marta bajarildi",
        "funksiya 2 marta bajarildi"
      ],
      answer: [3],
      explain: "Ikkinchi qimmat_hisob(100_000) bir xil argument bilan keshdan olindi, 200_000 esa yangi argument bo'lgani uchun bajarildi: uchta chaqiruv — ikkita bajarilish.",
      lesson: { title: "Matn metodlari", href: "04-Text-Methods.md" }
    },
    {
      q: "st.chat_message ga turli rollar berildi. Qaysi rollarda xato chiqmaydi, lekin avatar bo'sh ('') qoladi? (bir nechta javob)",
      type: "multi",
      options: [
        "\"system\"",
        "\"ai\"",
        "\"Aziz\"",
        "\"human\"",
        "\"\""
      ],
      answer: [0, 2, 4],
      explain: "ai taxallus sifatida assistant avatarini, human esa user avatarini oladi. system, Aziz va bo'sh satr xatosiz o'tadi, ammo avatarsiz qoladi — jimgina xato.",
      lesson: { title: "Chat elementlari", href: "05-Chat-Elements.md" }
    },
    {
      q: "Chat ilovasida st.chat_input(\"...\", max_chars=500) ishlatilgan. Darsga ko'ra LLM ga juda uzun matn yuborilishining oldini olish uchun nima qilish kerak?",
      type: "single",
      options: [
        "Hech narsa — max_chars serverda ham matnni avtomatik 500 belgida kesadi",
        "chat_input o'rniga st.text_area ishlatish kifoya, boshqa tekshiruv kerak emas",
        "Python tomonda len(prompt) > 500 ni tekshirib, st.error va st.stop() chaqirish",
        "max_chars ni 50 ga tushirish — kichik chegara brauzerda chetlab o'tilmaydi"
      ],
      answer: [2],
      explain: "chat_input dagi max_chars faqat brauzerdagi HTML maxlength: 200 belgi 50 lik chegaradan xatosiz o'tdi. Shuning uchun ikkinchi qavat — serverdagi Python tekshiruvi shart.",
      lesson: { title: "Chat elementlari", href: "05-Chat-Elements.md" }
    },
    {
      q: "st.write_stream(oqim()) chaqiruvi haqida qaysi gap to'g'ri?",
      type: "single",
      options: [
        "U to'plangan to'liq matnni str sifatida qaytaradi, uni saqlab qo'yish mumkin",
        "U hech narsa qaytarmaydi, javobni saqlash uchun generatorni qayta ishga tushirish kerak",
        "U oddiy satrni ham qabul qiladi va uni so'zma-so'z oqim qilib chiqaradi",
        "U asinxron ishlaydi: skript oqim tugashini kutmasdan keyingi qatorga o'tadi"
      ],
      answer: [0],
      explain: "write_stream matnni chizadi va to'plangan str ni qaytaradi. Satr berilsa StreamlitAPIException chiqadi, va u sinxron — skript oqim tugaguncha kutadi.",
      lesson: { title: "Chat elementlari", href: "05-Chat-Elements.md" }
    },
    {
      q: "Kursning nested buttons misolida 2-tugma bosilganda 'ikkinchi tugma bosildi' yozuvi hech qachon ko'rinmaydi. Buning sababi nima?",
      code: "if st.button(\"Birinchi tugma\", key=\"b1\"):\n    st.write(\"ochildi\")\n    if st.button(\"Ikkinchi tugma\", key=\"b2\"):\n        st.write(\"ikkinchi tugma bosildi\")",
      type: "single",
      options: [
        "Ikkala tugmada key bir xil bo'lgani uchun Streamlit ularni birlashtirib yuboradi",
        "2-tugma bosilgan rerunda 1-tugma False bo'ladi va uning if bloki bajarilmaydi",
        "Ichki st.button faqat st.form ichida ishlaydi, aks holda doim False qaytaradi",
        "st.write chiqishi faqat keyingi rerunda ko'rinadi, u esa hech qachon sodir bo'lmaydi"
      ],
      answer: [1],
      explain: "st.button faqat bosilgan rerunda True. 2-tugma bosilganda 1-tugma yana False bo'lib, ichki blok umuman ishlamaydi — tugmalar 2 dan 1 ga tushdi, matnlar yo'qoldi. Yechim — holatni session_state ga yozish.",
      lesson: { title: "Session State", href: "06-Session-State.md" }
    },
    {
      q: "Tugma bosilgandan keyin ekranda nima chiqadi?",
      code: "if \"log\" not in st.session_state:\n    st.session_state.log = []\n\ndef qayta_ishlash():\n    st.session_state.log.append(\"CALLBACK\")\n\nst.session_state.log.append(\"SKRIPT\")\nst.button(\"Bos\", on_click=qayta_ishlash, key=\"b\")\nst.write(\" -> \".join(st.session_state.log))",
      type: "single",
      options: [
        "SKRIPT -> SKRIPT -> CALLBACK",
        "SKRIPT -> CALLBACK",
        "SKRIPT -> CALLBACK -> SKRIPT",
        "CALLBACK -> SKRIPT -> SKRIPT"
      ],
      answer: [2],
      explain: "Birinchi ishga tushishda log = ['SKRIPT']. Tugma bosilganda callback rerundan OLDIN ishlaydi, keyin skript boshidan yana SKRIPT qo'shadi. Shuning uchun callback ichidagi o'zgarish uchun st.rerun() kerak emas.",
      lesson: { title: "Session State", href: "06-Session-State.md" }
    },
    {
      q: "Katta modelni st.session_state ga saqlash, @st.cache_resource ishlatishdan yaxshiroq, chunki session_state ham barcha foydalanuvchilar uchun bitta obyekt saqlaydi.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "session_state har foydalanuvchiga alohida: 100 ta foydalanuvchi — xotirada 100 ta model nusxasi. cache_resource esa hammaga bitta obyekt beradi, model uchun aynan u afzal.",
      lesson: { title: "Session State", href: "06-Session-State.md" }
    }
  ]
};
