# 5-dars. Hugging Face

## 🎬 Boshlashdan oldin

Sizda **$100 million yo'q**. Demak, o'z LLM ingizni noldan o'qita olmaysiz.

Unda AI mahsulot qurish faqat gigantlar uchunmi?

> **Yo'q.** Va bu darsdagi platforma aynan shuning uchun mavjud.

---

## 1. Hugging Face nima

> **Hugging Face — open source AI ning YETAKCHI HIMOYACHISI.** U machine learning hamjamiyati ichida **modellar, datasetlar va ilovalar** bo'yicha hamkorlikni rivojlantiradi.

### Laqabi

> ## **Hugging Face ni ko'pincha "MACHINE LEARNING NING GITHUB'I" deb atashadi**
>
> chunki u **open source ML va AI ni targ'ib qilishni** maqsad qiladi.

---

## 2. 🎯 Muammo va yechim

### Muammo

> **Zamonaviy NLP transformer modelini o'qitish uchun sezilarli mablag' sarflashingiz kerak** — bu, avval aytganimizdek, **startaplar va kichik bizneslar uchun amaliy emas**.

*(06-modulning 2-darsini eslang: GPT-4 = **$100 mln+**.)*

### Yechim

> ## **Hugging Face jarayonni DEMOKRATLASHTIRISHGA yordam beradi —**
> **hammaga o'z platformasida topish mumkin bo'lgan PRE-TRAINED MODELLARGA kirish imkonini berish orqali.**
>
> **Bunday modellar BEPUL mavjud va proprietary AI ishlab chiqish uchun ishlatilishi mumkin —**
> **LLM ni NOLDAN o'qitish uchun kerak bo'lgan ULKAN xarajatlardan qochib.**

> 💡 **Bu — 05-modulning 10-darsidagi "Buy vs Make" ga uchinchi javob.** Sotib olish shart emas, noldan qurish ham shart emas — **tayyor ochiq modelni olib, o'zingizga moslashtirasiz**.

---

## 3. 🐍 Transformers kutubxonasi

> **Bundan tashqari, Hugging Face TRANSFORMERS Python kutubxonasini taqdim etdi** — bu juda foydali, chunki:

| Nima beradi |
|---|
| AI ishlab chiquvchilariga **API orqali pre-trained modellarga OSON kirish** |
| **Machine learning pipeline lari** yaratishning samarali usuli |

---

## 4. Platformada nima qilish mumkin

> **Hugging Face bilan foydalanuvchilar quyidagilarni qila oladi:**

| № | Imkoniyat |
|---|---|
| 1 | **ML modellarni ULASHISH** |
| 2 | **Pre-trained modellardan FOYDALANISH** |
| 3 | **ML modellarni FINE-TUNE qilish** |
| 4 | **Demolarni HOSTLASH** |
| 5 | **ML modellarni BAHOLASH** |

---

## 5. 💼 Biznes tomoni

> **2016-yilda tashkil etilgan Hugging Face bugun $4.5 MILLIARDDAN ORTIQ baholanadi** — bu **sezilarli resurslar va tijorat maqomini** ko'rsatadi.

### ⚠️ Muhim nuans

> **Microsoft ga tegishli GitHub kabi, Hugging Face ning INFRATUZILMASI OPEN SOURCE EMAS —**
> **garchi foydalanuvchilar yuklagan MODELLAR va DATASETLAR ochiq bo'lsa ham.**

> 🧐 **Bu — nozik farq va uni tushunish muhim:**
>
> ```
> ✅ OCHIQ:  platformadagi modellar va datasetlar
> ❌ YOPIQ:  platformaning O'ZI (kod, serverlar, infratuzilma)
> ```
>
> Xuddi GitHub kabi: sizning kodingiz ochiq, lekin **GitHub ning o'zi** — Microsoft ning yopiq mahsuloti.
>
> *(Oldingi darsdagi **Pinecone** misolini eslang — u ham shunday.)*

---

## 6. 📊 Nima uchun bu AI muhandisi uchun muhim

| Vazifa | Hugging Face'siz | Hugging Face bilan |
|---|---|---|
| Model topish | Har bir tadqiqot maqolasini o'qish | **Qidiruv orqali** |
| Modelni ishga tushirish | Kodni noldan yozish | **Transformers kutubxonasi** |
| Fine-tuning | O'z infratuzilmangiz | **Tayyor vositalar** |
| Demo ko'rsatish | Server sozlash | **Hosting platformada** |
| Dataset topish | Qidirish va tozalash | **Tayyor datasetlar** |
| Narxi | $$$ | **Bepul (asosiy)** |

---

## 7. ⚡ Amaliy topshiriqlar

### 🟢 Oson — 15 daqiqa · **Platformani o'rganing**

[huggingface.co](https://huggingface.co) ga kiring (ro'yxatdan o'tish shart emas) va toping:

| Nimani izlaysiz | Nima topdingiz? |
|---|---|
| Jami modellar soni | |
| Jami datasetlar soni | |
| "text-classification" bo'yicha nechta model | |
| Eng ko'p yuklab olingan model | |
| O'zbek tilini qo'llab-quvvatlaydigan biror model | |

**Xulosa savoli:** bu modellarning barchasini **o'zingiz** o'qitsangiz, qancha pul kerak bo'lardi?

### 🟡 O'rta — 25 daqiqa · **Modelni tanlang**

Aniq vazifa uchun mos modelni toping:

```
VAZIFA: ______________________________________
(masalan: mijoz sharhlarining kayfiyatini aniqlash)

1 · Qidiruv so'zi: ______________________________
2 · Topilgan 3 ta nomzod:

   Model nomi          Yuklab olishlar   Hajmi   Litsenziya
   ________________    _____________     _____   __________
   ________________    _____________     _____   __________
   ________________    _____________     _____   __________

3 · Qaysi birini tanlaysiz? Nega?
   ______________________________________________

4 · LITSENZIYASINI o'qing. Tijorat maqsadida ishlatish mumkinmi?
   ______________________________________________

5 · Model kartochkasida (model card) qanday OGOHLANTIRISHLAR bor?
   (bias, cheklovlar, mo'ljallanmagan foydalanish)
   ______________________________________________
```

> ⚖️ 4 va 5-savollar juda muhim. **Bepul ≠ cheksiz ruxsat.** Har bir modelning o'z litsenziyasi va cheklovlari bor.

### 🔴 Qiyin — reja · **O'z modelingizni tanlash strategiyasi**

```
LOYIHA: ______________________________________

1 · UCHTA YO'LNI SOLISHTIRING:

   a) OpenAI API (closed)
      Narxi/oy:        $______
      Sozlash vaqti:   ___ kun
      Sifat:           ___/10

   b) Hugging Face pre-trained model (o'z serveringizda)
      Server narxi/oy: $______
      Sozlash vaqti:   ___ kun
      Sifat:           ___/10

   c) Hugging Face model + FINE-TUNING
      Server + fine-tuning: $______
      Sozlash vaqti:   ___ kun
      Sifat:           ___/10

2 · QAROR: ______  Sabab: ______________________

3 · Agar loyiha 10 barobar o'ssa, qaror o'zgaradimi?
   ______________________________________________
```

---

## 8. 🧠 O'zini tekshirish savollari

1. Hugging Face nimaning yetakchi himoyachisi?
2. Nima bo'yicha hamkorlikni rivojlantiradi?
3. Uni qanday laqab bilan atashadi va nima uchun?
4. Qanday muammoni hal qiladi?
5. Jarayonni qanday demokratlashtiradi?
6. Transformers kutubxonasi nima beradi?
7. Platformada foydalanuvchilar nima qila oladi? 5 tasini sanang.
8. Qachon tashkil etilgan va qancha baholanadi?
9. Infratuzilmasi open source mi? Nima ochiq?

<details>
<summary>✅ Javoblar</summary>

1. **Open source AI** ning.
2. **Modellar, datasetlar va ilovalar** bo'yicha — machine learning hamjamiyati ichida.
3. **"Machine learning ning GitHub'i"** — chunki u **open source ML va AI ni targ'ib qilishni** maqsad qiladi.
4. Zamonaviy **NLP transformer modelini o'qitish sezilarli mablag'** talab qiladi — bu **startaplar va kichik bizneslar** uchun amaliy emas.
5. Hammaga **pre-trained modellarga bepul kirish** imkonini berish orqali — LLM ni **noldan o'qitish xarajatlaridan qochib**.
6. **API orqali pre-trained modellarga oson kirish** va **ML pipeline lari** yaratishning samarali usuli.
7. **Modellarni ulashish, pre-trained modellardan foydalanish, fine-tune qilish, demolarni hostlash, modellarni baholash.**
8. **2016-yilda**; **$4.5 milliarddan ortiq**.
9. **Yo'q** — infratuzilmasi open source emas (GitHub kabi). **Foydalanuvchilar yuklagan modellar va datasetlar** ochiq.

</details>

---

## 📌 Xulosa

```
Muammo:  transformer o'qitish = ulkan pul
                ↓
HUGGING FACE = "ML ning GitHub'i"
                ↓
   pre-trained modellar  →  BEPUL
   Transformers kutubxonasi  →  API orqali oson kirish
                ↓
   ulashish · foydalanish · fine-tune · hosting · baholash

2016-yil · $4.5 mlrd+
⚠️ infratuzilma YOPIQ, modellar va datasetlar OCHIQ
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Hugging Face | *Hugging Face* | Open source AI platformasi |
| Pre-trained model | *pre-trained model* | Oldindan o'qitilgan tayyor model |
| Demokratlashtirish | *democratize* | Hammaga ochiq qilish |
| Transformers kutubxonasi | *Transformers library* | HF ning Python kutubxonasi |
| Pipeline | *pipeline* | Ketma-ket qayta ishlash zanjiri |
| Model kartochkasi | *model card* | Model haqidagi hujjat va ogohlantirishlar |
| Baholash | *valuation* | Kompaniyaning bozor qiymati |

---

⬅️ [Oldingi: Open source ning ahamiyati](04-The-importance-of-open-source.md) · ➡️ [Keyingi: LangChain](06-LangChain.md)
