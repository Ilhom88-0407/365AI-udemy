# 02-Modul · Ma'lumot — AI ning asosiy ingredienti

## 🍲 Bir jumlada

> **AI model — bu taom. Algoritm — retsept. Ma'lumot esa — mahsulotlar.**
> Retsept qanchalik zo'r bo'lmasin, buzilgan mahsulotdan mazali taom chiqmaydi.

Shu modul aynan **mahsulotlar** haqida.

---

## 🗺 Modul xaritasi

![Modul xaritasi](assets/00-module-map.svg)

---

## 📚 Darslar

| № | Dars | Vaqt | Asosiy g'oya | Amaliyot |
|---|---|---|---|---|
| 1 | [Strukturalangan va strukturalanmagan ma'lumot](01-Structured-vs-unstructured-data.md) | ~10 daq | Dunyodagi ma'lumotning **80–90%** i strukturalanmagan | 3 ta topshiriq |
| 2 | [Ma'lumotni qanday to'playmiz](02-How-we-collect-data.md) | ~15 daq | MNIST · piksel `0–255` · binar kod · **"Garbage in, garbage out"** | 💻 Python + 3 ta topshiriq |
| 3 | [Belgilangan va belgilanmagan ma'lumot](03-Labelled-and-unlabelled-data.md) | ~12 daq | Aniqlik ⟷ belgilash narxi **trade-off** i | 💻 Python + 3 ta topshiriq |
| 4 | [Metadata — ma'lumotni tavsiflovchi ma'lumot](04-Metadata-Data-that-describes-data.md) | ~12 daq | Har bir dataset metadata ga ega bo'lishi shart | 💻 Python + 🔒 xavfsizlik |

---

## 🎯 Modul yakunida siz bilasiz

- [ ] Structured va unstructured ma'lumotni **misol keltirib** ajrata olasiz
- [ ] Rasm, video va ovoz kompyuter uchun **nima ekanini** tushuntira olasiz
- [ ] MNIST nima ekanini va nega u "hello world" ekanini bilasiz
- [ ] Piksel qiymati `0` va `255` nimani bildirishini aytasiz
- [ ] Labelled va unlabelled datasetni farqlaysiz va **qachon qaysi biri kerakligini** bilasiz
- [ ] "Garbage in, garbage out" ni **o'z misolingiz** bilan tushuntirasiz
- [ ] Metadata ta'rifini beradi va uning maydonlarini sanaysiz
- [ ] Metadata bilan bog'liq **shaxsiy xavfsizlik** xavfini bilasiz
- [ ] 💻 Uchta Python skriptini o'zingiz ishga tushirgansiz

---

## 🖼 Modul grafikalari

Barchasi `assets/` papkasida, `.svg` formatda (istalgan brauzer yoki VS Code ochadi):

| Fayl | Nima ko'rsatadi |
|---|---|
| [`00-module-map.svg`](assets/00-module-map.svg) | Modulning 4 ta savoli |
| [`01-structured-vs-unstructured.svg`](assets/01-structured-vs-unstructured.svg) | Excel jadvali ⟷ rasm/video/audio |
| [`01-data-iceberg.svg`](assets/01-data-iceberg.svg) | 80–90% aysberg analogiyasi |
| [`02-pixel-to-binary.svg`](assets/02-pixel-to-binary.svg) | Raqam → piksel → son → binar |
| [`02-data-pipeline.svg`](assets/02-data-pipeline.svg) | Manba → yig'ish → model |
| [`03-labelled-vs-unlabelled.svg`](assets/03-labelled-vs-unlabelled.svg) | 10 000 rasm, ikki xil yo'l |
| [`03-tradeoff.svg`](assets/03-tradeoff.svg) | Narx ⟷ aniqlik egri chizig'i |
| [`04-metadata-card.svg`](assets/04-metadata-card.svg) | Rasm va uning metadatasi |

---

## 💻 Python amaliyotlari

Uchala skript ham **hech qanday kutubxona o'rnatmasdan** ishlaydi — faqat Python kerak.

| Dars | Skript nima qiladi | Nima o'rgatadi |
|---|---|---|
| 2 | Rasmni son va binar ko'rinishda chiqaradi | Rasm = sonlar jadvali |
| 3 | Izohlarni belgilaydi va aniqlikni o'lchaydi | Belgisiz aniqlikni o'lchab bo'lmaydi |
| 4 | Metadata bo'yicha datasetni filtrlaydi | Fayllarni ochmasdan boshqarish |

Python o'rnatilganini tekshirish:

```bash
python --version
```

---

## 🔗 Modullar orasidagi bog'liqlik

```
01-modul  ─  AI nima?  Tarix, ta'riflar, AGI
    ↓
02-modul  ─  MA'LUMOT  ← siz shu yerdasiz
    ↓          (AI ning yoqilg'isi)
03-modul  ─  Key AI techniques  (bu yoqilg'i qanday yoqiladi)
    ↓
Python moduli  ─  Endi buni kodda qilamiz
```

> **Nega ma'lumot 2-modulda?** Chunki keyingi hamma narsa — machine learning, neyron tarmoqlar, LLM lar — **ma'lumot ustida** quriladi. Bu poydevor.

---

## 📖 Umumiy atamalar lug'ati

| Atama | Inglizcha | Izoh |
|---|---|---|
| Strukturalangan ma'lumot | *structured data* | Satr-ustunga tartiblangan (Excel, SQL) |
| Strukturalanmagan ma'lumot | *unstructured data* | Strukturasiz: matn, rasm, video, audio — **80–90%** |
| Insight | *insight* | Ma'lumotdan chiqarilgan qimmatli xulosa |
| MNIST | *MNIST* | 70 000 ta 28×28 px qo'lyozma raqam dataseti |
| Piksel | *pixel* | Rasmning eng kichik nuqtasi, `0` (oq) – `255` (qora) |
| Grayscale | *grayscale* | Kul rang shkalasi |
| Binar shakl | *binary form* | 0 va 1 lar ketma-ketligi |
| Naqsh | *pattern* | Ma'lumotdagi takrorlanuvchi qonuniyat |
| Web scraping | *web scraping* | Saytdan ma'lumot yig'ish |
| API | *API* | Rasmiy dasturiy so'rov interfeysi |
| Garbage in, garbage out | — | Sifatsiz kirish → sifatsiz natija |
| Belgilangan ma'lumot | *labelled data* | Har bir elementga toifa berilgan |
| Belgilanmagan ma'lumot | *unlabelled data* | Toifa berilmagan |
| Belgilash | *labelling / annotation* | Toifa qo'yish jarayoni |
| Aniqlik | *accuracy* | To'g'ri bashoratlar ulushi |
| Trade-off | *trade-off* | Ikki foyda o'rtasidagi kelishuv |
| Kamayib boruvchi foyda | *diminishing returns* | Har qo'shimcha harakatdan foyda kamayishi |
| Bias | *bias* | Modelning bir tomonlama xatosi |
| Metadata | *metadata* | Ma'lumot haqidagi ma'lumot |
| EXIF | *EXIF* | Kamera rasm fayliga yozadigan metadata |
| Raqamlashuv | *digitalization* | Hayotning raqamli shaklga o'tishi |
| IoT | *Internet of Things* | Internetga ulangan qurilmalar |
| Muvozanat | *class balance* | Datasetdagi toifalar nisbati |

---

## ✅ Yakuniy test — o'zingizni sinang

Har bir darsdagi **"O'zini tekshirish savollari"** ni javobsiz o'qib chiqing. Agar **hammasiga** javob bera olsangiz — **Quiz 2** ga tayyorsiz.

Qiynalgan savol bo'lsa → o'sha darsga qayting.

---

## ➡️ Keyingi qadam

1. **Quiz 2** ni yeching (`5.2 Quiz 2.html`)
2. **03-modul: Key AI techniques** ga o'ting

