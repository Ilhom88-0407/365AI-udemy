# 11-Modul · Muhitni sozlash

## 🛠 Bir jumlada

> **Bu modul yakunida sizning kompyuteringizda Python ishlaydi va siz Jupyter'da erkin harakat qilasiz.**

Nazariya emas — **amaliyot**. Har bir darsni **bajarib** chiqing.

---

## 🗺 Jupyter arxitekturasi

![Jupyter arxitekturasi](assets/01-jupyter-architecture.svg)

---

## 📚 Darslar

| № | Dars | Asosiy g'oya |
|---|---|---|
| 1 | [Jupyter bilan tanishuv](01-Jupyter-Introduction.md) | Python = **til**, Jupyter = **ilova**, kernel = **bajaruvchi** |
| 2 | [Anaconda o'rnatish](02-Installing-Anaconda.md) 🔧 | Python + Jupyter + kutubxonalar — bitta paketda |
| 3 | [Jupyter'dan foydalanish](03-Introduction-to-Using-Jupyter.md) | Dashboard: Files, Running, New, Upload |
| 4 | [Notebook fayllari](04-Working-with-Notebook-Files.md) ⭐ | **Command mode ⟷ Edit mode** · 4 xil ishga tushirish |
| 5 | [Tezkor tugmalar](05-Using-Shortcuts.md) | A · B · D D · M · Y · Shift+L |
| 6 | [Xato xabarlari](06-Handling-Error-Messages.md) ⭐ | **Oxirgi qator** muammoni ko'rsatadi |
| 7 | [Kernel'ni qayta ishga tushirish](07-Restarting-the-Kernel.md) | **Restart & Run All** — ishni tekshirishning yagona yo'li |

🔧 = kompyuterda amal bajarish shart · ⭐ = eng muhim

---

## 🎯 Modul yakunida siz bilasiz

**Tushunchalar:**
- [ ] **Python**, **Jupyter**, **kernel**, **Anaconda** — har birining rolini aytasiz
- [ ] Jupyter'ning **server-klient** arxitekturasini tushuntirasiz
- [ ] Nima uchun yirik korporatsiyalar Jupyter'ni tanlaganini bilasiz

**Amaliy:**
- [ ] 🔧 **Anaconda o'rnatilgan** va Jupyter ishlaydi
- [ ] Dashboard'da papka va fayl yaratasiz, o'chirasiz, nomini o'zgartirasiz
- [ ] **Running** tabidan kernel'ni to'xtatasiz
- [ ] `.ipynb` faylni **yuklaysiz** (upload)

**Kodlash:**
- [ ] **Command** va **Edit** rejimlarni farqlaysiz (kursor bo'yicha)
- [ ] To'rtta ishga tushirish usulini va farqini bilasiz
- [ ] **Input/Output raqamlari** nimani bildirishini aytasiz
- [ ] **Markdown** yacheykasi yaratasiz
- [ ] Kamida **10 ta tezkor tugmani** yoddan bilasiz

**Xatolar:**
- [ ] Xato xabarining **oxirgi qatoriga** qarashni bilasiz
- [ ] 6 ta keng tarqalgan xato turini taniysiz
- [ ] Xatoni **Google'ga qanday qo'yishni** bilasiz
- [ ] **Restart & Run All** nima uchun majburiy ekanini tushuntirasiz

---

## 🖼 Modul grafikalari

| Fayl | Nima ko'rsatadi |
|---|---|
| [`01-jupyter-architecture.svg`](assets/01-jupyter-architecture.svg) | Klient ⟷ server ⟷ kernel |
| [`04-cell-modes.svg`](assets/04-cell-modes.svg) | Ikki rejim + 4 xil ishga tushirish |
| [`05-shortcuts.svg`](assets/05-shortcuts.svg) | To'liq tezkor tugmalar shpargalkasi |
| [`06-error-anatomy.svg`](assets/06-error-anatomy.svg) | Xato xabarini o'qish |

---

## ⌨️ Eng kerakli 12 ta tugma

⚠️ Avval **`Esc`** — command mode.

| Tugma | Amal |
|---|---|
| `Enter` / `Esc` | Edit ⟷ Command |
| `Ctrl + Enter` | Bajarish, shu yerda qolish |
| `Shift + Enter` | Bajarish, keyingisiga o'tish |
| `Alt + Enter` | Bajarish + yangi yacheyka |
| `A` / `B` | Yuqorida / pastda yangi yacheyka |
| `D` `D` | O'chirish |
| `X` / `C` / `V` | Kes / nusxa / qo'y |
| `M` / `Y` | Markdown / Kod |
| `Shift + L` | Qator raqamlari |
| `Ctrl + Shift + H` | Barcha tugmalar |

---

## ⚡ Amaliy topshiriqlar

| Dars | 🟢 Oson | 🟡 O'rta | 🔴 Qiyin |
|---|---|---|---|
| 1 | Kim kim? | Jupyter afzalligini isbotlang | Nima uchun bitta dastur yo'q? |
| 2 | 🔧 **O'rnating** | Ikkinchi yo'lni sinang | Ish maydonini tashkil qiling |
| 3 | Dashboard'ni sinang | Fayl yuklash mashqi | Ish maydonini loyihalang |
| 4 | To'rtta usulni sinang | Input/Output raqamlari | Yulduzchani ko'ring |
| 5 | **Sichqonchasiz ishlang** | Markdown hujjat | Kodlash tezligingizni o'lchang |
| 6 | Xatoni Google'ga qo'ying | Qatlamli xatoni yeching | Savol berish shabloni |
| 7 | Ikkala variantni sinang | **Yashirin holat tuzog'i** | O'z ish protokolingiz |

> 🎯 **Eng qimmatli topshiriq:** 7-darsdagi 🟡 **"Yashirin holat tuzog'ini yarating"**. U Jupyter'ning eng katta xavfini **o'z ko'zingiz bilan** ko'rsatadi.

---

## 🔗 Bog'liqlik

```
10-modul  ─  nima uchun Python
    ↓
11-modul  ─  MUHITNI SOZLASH                    ← siz shu yerdasiz
    ↓          Anaconda + Jupyter + xatolar
    ↓
12-modul  ─  O'zgaruvchilar va ma'lumot turlari  ← HAQIQIY KOD
13-modul  ─  Asosiy sintaksis
...
```

> 💡 **Bu modul "ko'rinmas" ko'nikma beradi.** Uni yaxshi o'zlashtirsangiz — keyingi 8 ta modulda **vositaga emas, KODGA** e'tibor qaratasiz.

---

## 📖 Atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Kernel | *kernel* | Kodni bajaruvchi dastur |
| Klient | *client* | Kod yoziladigan interfeys |
| Anaconda | *Anaconda* | Python + Jupyter + paketlar |
| Dashboard | *dashboard* | Jupyter bosh sahifasi |
| Yacheyka | *cell* | Kod yoki matn maydoni |
| Command mode | *command mode* | Notebook'ni boshqarish rejimi |
| Edit mode | *edit mode* | Yozish rejimi |
| Input / Output | *input / output* | Kirish va chiqish maydonlari |
| Markdown | *Markdown* | Matn formatlash tili |
| Tezkor tugma | *shortcut* | Klaviatura kombinatsiyasi |
| Xato xabari | *error message* | Python ning xato javobi |
| Interpretator | *interpreter* | Kodni o'qib bajaruvchi |
| Typo | *typo* | Yozuv xatosi |
| Yashirin holat | *hidden state* | Kernel xotirasidagi ko'rinmas qiymatlar |
| Takrorlanuvchanlik | *reproducibility* | Boshqa joyda ham ishlashi |

---

## ✅ Yakuniy tekshiruv

Modulni tugatganingizni **shu tarzda** isbotlang:

```
☐ 1. Yangi notebook yarating
☐ 2. Markdown sarlavha qo'shing (M tugmasi)
☐ 3. Uchta kod yacheykasi yozing
☐ 4. Faqat KLAVIATURA bilan ularni ko'chiring va nusxalang
☐ 5. Ataylab xato qiling va oxirgi qatordan tuzating
☐ 6. Kernel → Restart & Run All
☐ 7. Toza o'tdimi?  ha / yo'q
☐ 8. Running → Shutdown Kernel
```

Hammasi ✅ bo'lsa — **12-modulga tayyorsiz**.

---

## ➡️ Keyingi qadam

**12-modul: Python o'zgaruvchilari va ma'lumot turlari**

Nazariya va sozlash tugadi. **Endi kod yozamiz.**
