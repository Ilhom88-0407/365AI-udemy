# 1-dars. Python dasturlash

## 🎬 Boshlashdan oldin

Internetda ko'p reklama: **"Kod yozmasdan AI ilova quring!"**

Bu rost. Va bu — yetarli emas.

> Bu dars sizga aniq aytadi: **qayerda no-code yetadi va qayerda kod SHART**.

---

## 1. No-code vositalari

> **No-code va low-code vositalari AI bilan tanishishning ommabop yo'li.**
>
> **Ular so'nggi yillarda ommalashdi va, albatta, moda.**

**Nima qila olasiz:**
- **Chatbotlar** ishlab chiqish
- O'z AI mahsulotingizni qanday qurish mumkinligi haqida **dastlabki tasavvur** hosil qilish
- Ba'zi hollarda hatto **real mahsulotlar** qurish

---

## 2. ⚠️ Lekin: kod bilishingiz SHART

> **Ajoyib no-code vositalari bo'lsa-da, agar siz AI bilan ishlashni va AI ni o'z ichiga olgan ilovalar ishlab chiqishni JIDDIY o'rganmoqchi bo'lsangiz —**
>
> ## **kod yozishni BILISHINGIZ SHART.**

### Nima uchun?

> **Kod yozishni o'rganish AI bilan CHUQUR shug'ullanish uchun zarur, chunki u sizga yirik AI provayderlarining API laridan foydalanish imkonini beradi:**
>
> **OpenAI · Llama · Anthropic**

### Kod nima beradi — no-code bera olmaydigan

> **Kod yozish ko'nikmalari sizga imkon beradi:**

| Imkoniyat | Izoh |
|---|---|
| **Prompt engineering orqali AI xulqini moslashtirish** | *(05-modulning 8-darsi)* |
| **Ma'lumotlar bazalarini integratsiya qilish** | RAG uchun asos |
| **Model parametrlarini o'zgartirish** | `temperature`, `max_tokens` va h.k. |

> **Bu imkoniyatlar hozircha no-code vositalari yeta olmaydigan darajada va MUKAMMAL AI ilovalar yaratish uchun HAL QILUVCHI.**

---

## 3. 🐍 Nima uchun aynan Python

> ## **Python — data science va AI uchun YETAKCHI dasturlash tili.**
>
> **TIOBE indeksiga ko'ra, uning keng qamrovli kutubxonalari va mustahkam infratuzilmasi AI muhandislari va ishlab chiquvchilari uchun masshtablilikni oshiradi.**

### Asosiy kutubxonalar

> **Foydalanishingiz mumkin bo'lgan open source vositalar va kutubxonalar soni juda katta. Eng mashhurlari:**

| Kutubxona | Nima uchun |
|---|---|
| **NumPy** | Ko'p o'lchamli massivlar, matritsalar va matematik funksiyalar |
| **pandas** | Ma'lumotni oldindan tayyorlash (preprocessing) |
| **matplotlib** | Ma'lumotni vizuallashtirish |

---

## 4. 🛠 Qayerdan boshlash

> **Python'da boshlash uchun IDE o'rnating:**

| Vosita | Xususiyati |
|---|---|
| **Jupyter Notebook** | Kodni bo'lak-bo'lak ishga tushirish — o'rganish uchun ideal |
| **Google Colab** | Brauzerda ishlaydi, o'rnatish shart emas, bepul GPU |
| **Spyder** | Ilmiy hisob-kitoblar uchun |
| **PyCharm** | Professional loyihalar uchun to'liq IDE |

> *(01-modulning 1-darsidagi demo **Jupyter Notebook**da qilingan edi.)*

---

## 5. Yakuniy fikr

> **Xulosa qilib aytganda, AI ishlab chiqishning kod yozish jihatlarini o'rganish SEZILARLI SA'Y-HARAKAT talab qiladi, ayniqsa boshlovchilar uchun —**
>
> ## **lekin bu ISHONCHLI ILOVALAR yaratish uchun ZARUR.**

> 💪 **Ma'ruzachi shirin so'z aytmaydi.** "Considerable effort" — bu **ko'p mehnat** degani. Lekin kursning keyingi moduli aynan shu — **Python moduli**, noldan.

---

## 6. 📊 No-code vs Kod

| Mezon | No-code | Python kodi |
|---|---|---|
| **Boshlash tezligi** | ✅ Juda tez | ⚠️ Sekin |
| **O'rganish egri chizig'i** | ✅ Past | ❌ Yuqori |
| **Prototip qurish** | ✅ Ideal | ⚠️ Sekinroq |
| **API larga to'liq kirish** | ❌ Cheklangan | ✅ **To'liq** |
| **Prompt engineering** | ⚠️ Yuzaki | ✅ **Chuqur** |
| **Ma'lumotlar bazasi integratsiyasi** | ❌ | ✅ |
| **Model parametrlarini o'zgartirish** | ❌ | ✅ |
| **Mukammal ilovalar** | ❌ | ✅ |

---

## 7. ⚡ Amaliy topshiriqlar

### 🟢 Oson — 15 daqiqa · **Python o'rnating va ishga tushiring**

```bash
python --version
```

Chiqmasa: [python.org](https://www.python.org/downloads/) → yuklab oling → **"Add Python to PATH"** ni belgilang.

Keyin birinchi skriptni yozing:

```python
print("Salom, men AI muhandisi bo'laman!")

# Uchta asosiy kutubxona haqida
kutubxonalar = {
    "NumPy":      "massivlar, matritsalar, matematika",
    "pandas":     "ma'lumotni tayyorlash",
    "matplotlib": "vizualizatsiya",
}
for nom, vazifa in kutubxonalar.items():
    print(f"  {nom:<12} -> {vazifa}")

# IDE variantlari
print("\nIDE tanlovi:")
for ide in ["Jupyter Notebook", "Google Colab", "Spyder", "PyCharm"]:
    print(f"  - {ide}")
```

### 🟡 O'rta — 25 daqiqa · **No-code chegarasini toping**

1. Istalgan **no-code AI chatbot** vositasini toping va bepul chatbot yarating.
2. Endi **shu 4 ta narsani** qilishga urinib ko'ring:

| № | Vazifa | Bajarildimi? |
|---|---|---|
| 1 | `temperature` ni `0` ga sozlash | |
| 2 | Javob uzunligini aniq tokenda cheklash | |
| 3 | O'z PDF hujjatingizni ulash (RAG) | |
| 4 | Modelni GPT dan boshqasiga almashtirish | |

3. **Xulosa:** nechtasi bajarildi? Qaysilari **faqat kod bilan** mumkin?

### 🔴 Qiyin — reja · **90 kunlik Python rejasi**

```
Hozirgi darajam: [ ] hech narsa  [ ] asoslar  [ ] o'rtacha

30 KUN — asoslar
   Nimani o'rganaman: ______________________________
   Kuniga necha daqiqa: ______
   Qanday tekshiraman: ______________________________

60 KUN — kutubxonalar
   NumPy dan:      ______________________________
   pandas dan:     ______________________________
   matplotlib dan: ______________________________

90 KUN — birinchi AI loyiha
   Loyiha nomi:    ______________________________
   Qanday API:     ______________________________
   Natija:         ______________________________
```

> 💡 Kursning **Python moduli** (10–19-bo'limlar) aynan shu yo'lni bosqichma-bosqich yopadi.

---

## 8. 🧠 O'zini tekshirish savollari

1. No-code vositalari nima qila oladi?
2. Nima uchun baribir kod bilish shart?
3. Kod yozish qaysi provayderlarning API laridan foydalanish imkonini beradi?
4. Kod qanday uchta imkoniyat beradi?
5. Qaysi til data science va AI uchun yetakchi va nima uchun?
6. Uchta asosiy Python kutubxonasini va ularning vazifasini ayting.
7. Qanday IDE lar tavsiya qilinadi?
8. Ma'ruzaning yakuniy xulosasi nima?

<details>
<summary>✅ Javoblar</summary>

1. **Chatbotlar** ishlab chiqish, AI mahsulot qurish haqida **dastlabki tasavvur** hosil qilish, ba'zan **real mahsulotlar** qurish.
2. AI bilan **chuqur** shug'ullanish uchun — u **API lardan foydalanish** imkonini beradi.
3. **OpenAI, Llama, Anthropic.**
4. **Prompt engineering orqali AI xulqini moslashtirish**, **ma'lumotlar bazalarini integratsiya qilish**, **model parametrlarini o'zgartirish**.
5. **Python** — TIOBE indeksiga ko'ra; **keng qamrovli kutubxonalari** va **mustahkam infratuzilmasi** masshtablilikni oshiradi.
6. **NumPy** (massivlar, matritsalar, matematik funksiyalar), **pandas** (ma'lumotni tayyorlash), **matplotlib** (vizualizatsiya).
7. **Jupyter Notebook, Google Colab, Spyder, PyCharm.**
8. Kod o'rganish **sezilarli sa'y-harakat** talab qiladi, lekin **ishonchli ilovalar** yaratish uchun **zarur**.

</details>

---

## 📌 Xulosa

```
NO-CODE  →  tez boshlash, prototip, ba'zi real mahsulotlar
             ❌ API to'liq emas · ❌ parametrlar · ❌ DB integratsiya

KOD (Python)  →  OpenAI, Llama, Anthropic API lari
                 ✅ prompt engineering
                 ✅ ma'lumotlar bazasi
                 ✅ model parametrlari

Kutubxonalar:  NumPy · pandas · matplotlib
IDE:           Jupyter · Colab · Spyder · PyCharm
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| No-code / low-code | *no-code / low-code* | Kodsiz yoki kam kodli vositalar |
| API | *API* | Dasturiy so'rov interfeysi |
| IDE | *IDE* | Kod yozish muhiti |
| Kutubxona | *library* | Tayyor funksiyalar to'plami |
| Preprocessing | *preprocessing* | Ma'lumotni oldindan tayyorlash |
| Masshtablilik | *scalability* | Hajm oshganda ishlay olish |
| TIOBE indeksi | *TIOBE index* | Dasturlash tillari ommaboplik reytingi |

---

🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: API bilan ishlash](02-Working-with-APIs.md)
