window.QUIZ = {
  id: "47",
  title: "Thread-level persistence",
  subtitle: "Checkpointer, thread_id, InMemorySaver, StateSnapshot tarixi va SqliteSaver bilan davomiy xotira",
  next: { label: "Vektor bazalari — kirish", href: "../48-Vector-Databases-Introduction/README.md" },
  questions: [
    {
      q: "Bank Telegram botini yozyapsiz. thread_id ni qanday hosil qilish darsdagi xavfsizlik tavsiyasiga mos keladi?",
      type: "single",
      options: [
        "Foydalanuvchi so'rovidagi thread_id maydonini to'g'ridan-to'g'ri config'ga qo'yish",
        "Serverda msg.from_user.id asosida f\"tg-{id}\" ko'rinishida yasash va ID ni tozalash",
        "Har bir xabar uchun yangi tasodifiy thread_id yaratib, uni foydalanuvchiga qaytarish",
        "Barcha foydalanuvchilar uchun bitta umumiy thread_id ishlatib, xabarlarni ism bilan ajratish"
      ],
      answer: [1],
      explain: "thread_id serverda yasaladi, kanal prefiksi (tg-) qo'shiladi va ID tozalanadi. Uni foydalanuvchi so'rovidan olsangiz, u boshqa odamning suhbatini o'qiy oladi.",
      lesson: { title: "Checkpointer va threadlar", href: "01-Checkpointers-and-Threads.md" }
    },
    {
      q: "Graf checkpointer bilan kompilyatsiya qilingan. Quyidagi chaqiruv nima bilan tugaydi?",
      code: "gc = g.compile(checkpointer=InMemorySaver())\ngc.invoke(S(messages=[]))",
      type: "single",
      options: [
        "Graf ishlaydi, holat esa avtomatik yaratilgan \"default\" threadga saqlanadi",
        "Graf ishlaydi, lekin checkpointer bu chaqiruvda hech narsa saqlamaydi",
        "ValueError: checkpointer configurable ichida thread_id kabi kalitni talab qiladi",
        "KeyError: 'messages' — chunki bo'sh ro'yxat reducer'dan o'tmaydi"
      ],
      answer: [2],
      explain: "Config berilmasa LangGraph ValueError chiqaradi: checkpointer 'configurable' ichida thread_id, checkpoint_ns yoki checkpoint_id kalitlaridan birini talab qiladi. Xato xabari aniq va foydali.",
      lesson: { title: "Checkpointer va threadlar", href: "01-Checkpointers-and-Threads.md" }
    },
    {
      q: "Checkpointer grafga qanday imkoniyatlarni beradi? (bir nechta javob)",
      type: "multi",
      options: [
        "Suhbatni invoke() chaqiruvlari orasida davom ettirish",
        "Xabarlar tarixini o'zi qisqartirib, token sarfini kamaytirish",
        "Odam holatni ko'rib, uni o'zgartirishi (human-in-the-loop)",
        "Eski checkpointga qaytib, o'sha joydan davom etish",
        "Bir nechta serverdagi grafni avtomatik sinxronlash"
      ],
      answer: [0, 2, 3],
      explain: "Checkpointer har tugundan keyin holatni saqlaydi: bu suhbatni davom ettirish, human-in-the-loop va vaqt bo'yicha orqaga qaytishga imkon beradi. Xabarlarni qisqartirish esa 46-moduldagi trim/xulosalash vazifasi.",
      lesson: { title: "Checkpointer va threadlar", href: "01-Checkpointers-and-Threads.md" }
    },
    {
      q: "bot tuguni har chaqiruvda 2 ta xabar (savol va javob) qaytaradi. Kod nimani chop etadi?",
      code: "gc2 = g.compile(checkpointer=InMemorySaver())\ncfg = {'configurable': {'thread_id': '1'}}\nfor i in range(3):\n    o = gc2.invoke(S(messages=[]), cfg)\n    print(len(o['messages']), end=' ')",
      type: "single",
      options: [
        "2 2 2",
        "0 2 4",
        "6 6 6",
        "2 4 6"
      ],
      answer: [3],
      explain: "Bir xil thread_id bilan checkpointer oxirgi holatni topadi va yangi xabarlar unga qo'shiladi: 2, 4, 6. Checkpointersiz esa har chaqiruv noldan boshlanib, 2 · 2 · 2 bo'lardi.",
      lesson: { title: "InMemorySaver bilan qisqa muddatli xotira", href: "02-Short-Term-Memory-with-InMemorySaver.md" }
    },
    {
      q: "Xuddi shu grafda (har chaqiruvda +2 xabar) quyidagi kod ishga tushdi. Oxirgi qator nimani chop etadi?",
      code: "c1 = {'configurable': {'thread_id': 'oybek'}}\nc2 = {'configurable': {'thread_id': 'dilnoza'}}\nfor i in range(3):\n    gc2.invoke(S(messages=[]), c1)\ngc2.invoke(S(messages=[]), c2)\nprint(len(gc2.get_state(c2).values['messages']))",
      type: "single",
      options: [
        "2",
        "8",
        "6",
        "0"
      ],
      answer: [0],
      explain: "Threadlar to'liq mustaqil: 'oybek' da 6 ta xabar to'plangan, 'dilnoza' esa faqat bir marta chaqirilgani uchun 2 ta xabarga ega.",
      lesson: { title: "InMemorySaver bilan qisqa muddatli xotira", href: "02-Short-Term-Memory-with-InMemorySaver.md" }
    },
    {
      q: "InMemorySaver eski threadlarni avtomatik tozalaydi, shuning uchun uni ko'p foydalanuvchili serverda xavfsiz ishlatish mumkin.",
      type: "single",
      options: ["To'g'ri", "Noto'g'ri"],
      answer: [1],
      explain: "InMemorySaver'da avtomatik tozalash yo'q: har thread RAMda qoladi va server asta-sekin to'ladi. Ustiga-ustak, dastur qayta ishga tushsa, hamma suhbat yo'qoladi — u faqat sinov va prototip uchun.",
      lesson: { title: "InMemorySaver bilan qisqa muddatli xotira", href: "02-Short-Term-Memory-with-InMemorySaver.md" }
    },
    {
      q: "Bot mijozga noto'g'ri javob berdi, operator esa uni tuzatib, suhbatni davom ettirmoqchi. Qaysi yondashuv darsga mos?",
      type: "single",
      options: [
        "Threadni o'chirib, suhbatni yangi thread_id bilan noldan boshlash",
        "gc.update_state(cfg, {...}) bilan holatga tuzatilgan xabarni qo'shish",
        "Checkpointer'ni InMemorySaver'dan SqliteSaver'ga almashtirish",
        "Grafni qayta kompilyatsiya qilib, xabarni qo'lda invoke() ga yuborish"
      ],
      answer: [1],
      explain: "update_state — human-in-the-loop ning kaliti: operator holatga tuzatilgan xabarni yozadi. as_node= bilan esa buni go'yo ma'lum tugun bajargandek qilish mumkin.",
      lesson: { title: "InMemorySaver bilan qisqa muddatli xotira", href: "02-Short-Term-Memory-with-InMemorySaver.md" }
    },
    {
      q: "graph_states = list(gc.get_state_history(config1)) bajarildi. graph_states[0] nimani bildiradi?",
      type: "single",
      options: [
        "Eng oxirgi olingan snapshot — ro'yxat teskari tartibda keladi",
        "Eng birinchi, step -1 dagi kirish holati",
        "START tugunidan keyingi step 0 holati",
        "Faqat summary maydoni bor checkpointlardan birinchisi"
      ],
      answer: [0],
      explain: "get_state_history generator qaytaradi va ro'yxat teskari tartibda: birinchi element — oxirgi snapshot. Boshidan o'qish uchun graph_states[::-1] ishlatiladi.",
      lesson: { title: "StateSnapshot sinfi", href: "03-The-StateSnapshot-Class.md" }
    },
    {
      q: "Quyidagilardan qaysilari StateSnapshot maydonlari? (bir nechta javob)",
      type: "multi",
      options: [
        "values",
        "thread_history",
        "parent_config",
        "interrupts",
        "message_count"
      ],
      answer: [0, 2, 3],
      explain: "snap._fields: values, next, config, metadata, created_at, parent_config, tasks, interrupts. thread_history va message_count degan maydon yo'q.",
      lesson: { title: "StateSnapshot sinfi", href: "03-The-StateSnapshot-Class.md" }
    },
    {
      q: "Operator paneli tarixdagi snapshotlarni ko'rib chiqyapti. Qaysi talqin to'g'ri?",
      type: "single",
      options: [
        "next=() — graf hali boshlanmagan, step -1 esa graf tugaganini bildiradi",
        "next=() — graf tugagan; metadata source == \"update\" esa holat qo'lda o'zgartirilganini bildiradi",
        "next=() — xato yuz bergan; source == \"loop\" operator aralashuvini bildiradi",
        "next=() — interrupt kutilmoqda; source == \"input\" tugun bajarilganini bildiradi"
      ],
      answer: [1],
      explain: "next=() — bajariladigan tugun qolmagan, graf tugagan. source \"update\" update_state() bilan qo'lda kiritilgan o'zgarishni ko'rsatadi, shuning uchun u audit uchun muhim.",
      lesson: { title: "StateSnapshot sinfi", href: "03-The-StateSnapshot-Class.md" }
    },
    {
      q: "Quyidagi kod nima qiladi?",
      code: "tarix = list(gc.get_state_history(cfg))\neski = tarix[3]\ngc.invoke(None, eski.config)",
      type: "single",
      options: [
        "Threadning butun tarixini o'chirib, uni 3-qadamdan qayta yozadi",
        "Hech narsa qilmaydi, chunki kirish None bo'lsa invoke() darhol qaytadi",
        "Yangi thread yaratib, unga eski holatning nusxasini ko'chiradi",
        "Grafni o'sha eski checkpointdan davom ettiradi, chunki eski.config ichida checkpoint_id bor"
      ],
      answer: [3],
      explain: "eski.config tarkibida checkpoint_id bor, shuning uchun LangGraph aynan o'sha nuqtadan davom etadi. Bu \"bekor qilish\" tugmasi va A/B sinovining asosi.",
      lesson: { title: "StateSnapshot sinfi", href: "03-The-StateSnapshot-Class.md" }
    },
    {
      q: "FastAPI'da SqliteSaver uchun sqlite3.connect(..., check_same_thread=False) yozildi. Bu parametr haqida qaysi gap to'g'ri?",
      type: "single",
      options: [
        "U ulanishga bir necha threaddan murojaat qilishga ruxsat beradi, lekin sinxronlashni o'zingiz ta'minlashingiz kerak",
        "U bir vaqtda bir necha yozuvchini to'liq xavfsiz qiladi va \"database is locked\" xatosini yo'qotadi",
        "U SQLite faylini RAMda saqlab, ishni InMemorySaver kabi tezlashtiradi",
        "U har bir thread uchun alohida .db fayl yaratib, yozuvlar to'qnashuvining oldini oladi"
      ],
      answer: [0],
      explain: "check_same_thread=False ulanishni boshqa threadlardan ishlatishga ruxsat beradi, ammo xavfsizlik kafolatini olib tashlaydi. Bir necha jarayon yoki serverda muammo chiqadi, ishlab chiqarish uchun esa PostgresSaver tavsiya etiladi.",
      lesson: { title: "SQLite bilan uzoq muddatli xotira", href: "04-Long-Term-Memory-with-SQLite.md" }
    },
    {
      q: "SqliteSaver'li bot bir necha foydalanuvchi bir vaqtda yozganda \"database is locked\" xatosi bilan yiqilyapti. Darsdagi qaysi PRAGMA bot xato berish o'rniga kutishini ta'minlaydi?",
      type: "single",
      options: [
        "PRAGMA synchronous=NORMAL",
        "PRAGMA busy_timeout=5000",
        "PRAGMA journal_mode=WAL",
        "PRAGMA table_info(checkpoints)"
      ],
      answer: [1],
      explain: "busy_timeout=5000 baza band bo'lsa 5 soniyagacha kutadi. WAL o'qish va yozishni parallel qiladi, synchronous=NORMAL esa tezlik uchun — lekin \"database is locked\" o'rniga kutishni aynan busy_timeout beradi.",
      lesson: { title: "SQLite bilan uzoq muddatli xotira", href: "04-Long-Term-Memory-with-SQLite.md" }
    },
    {
      q: "Siz checkpoints va writes jadvallaridan eski threadlarni DELETE bilan o'chirib, commit() qildingiz, lekin .db fayl hajmi kamaymadi. Nima yetishmayapti?",
      type: "single",
      options: [
        "PRAGMA journal_mode=WAL ni yoqish",
        "Ulanishni check_same_thread=True bilan qayta ochish",
        "con.execute(\"VACUUM\") ni bajarish",
        "con.backup() bilan zaxira nusxa olish"
      ],
      answer: [2],
      explain: "VACUUMsiz yozuvlarni o'chirsangiz ham fayl kichraymaydi. WAL parallel o'qish uchun, backup() esa zaxira nusxa uchun — ular hajmni kamaytirmaydi.",
      lesson: { title: "SQLite bilan uzoq muddatli xotira", href: "04-Long-Term-Memory-with-SQLite.md" }
    },
    {
      q: "Bot mijoz Oybekning VIP ekanini va tilini boshqa, yangi suhbatlarda ham eslashi kerak. Darsga ko'ra bu uchun nima to'g'ri keladi?",
      type: "single",
      options: [
        "Faqat SqliteSaver — u barcha threadlardagi faktlarni avtomatik birlashtiradi",
        "Store (masalan, InMemoryStore / PostgresStore) — threadlar orasidagi faktlar uchun",
        "InMemorySaver — u RAMda bo'lgani uchun threadlar orasida tezroq ulashadi",
        "get_state_history — u boshqa threadlarning tarixini ham qaytaradi"
      ],
      answer: [1],
      explain: "Checkpointer \"bu suhbatda nima bo'ldi?\" degan savolga javob beradi va bitta thread_id bilan cheklanadi. \"Bu odam haqida nima bilaman?\" uchun esa threadlar orasida ishlaydigan Store kerak.",
      lesson: { title: "SQLite bilan uzoq muddatli xotira", href: "04-Long-Term-Memory-with-SQLite.md" }
    }
  ]
};
