# 1-dars. Modelga o'z ma'lumotingizni qanday qo'shish mumkin

## 🎬 Boshlashdan oldin

> **"Modellarni o'qitish ko'p vaqt oladi, shuning uchun LLM'larga mavjud ma'lumot muqarrar ravishda CUT-OFF SANASIGA ega. Bundan tashqari, tayyor modellar kompaniyangiz ma'lumoti kabi XUSUSIY ma'lumot bo'yicha savollarga javob bera olmaydi."**

---

## 1. Uchta yo'l

![Uchta yo'l](assets/01-uch-yol.svg)

| | **① Prompting** | **② Fine-tuning** | **③ RAG** |
|---|---|---|---|
| Nima qiladi | Ma'lumotni **promptga** qo'yish | Model **og'irliklarini** o'zgartirish | Kerakli qismini **topib**, promptga qo'shish |
| Tayyorgarlik | ## ✅ **0 daqiqa** | ⚠️ soatlar–kunlar | ⚠️ indekslash *(bir marta)* |
| Ma'lumot hajmi | ## ⚠️ **kichik** | ## ⚠️ **katta kerak** | ## ✅ **cheksiz** |
| Har so'rov narxi | ## ⚠️ **yuqori** | ## ✅ **past** | ## ✅ **o'rtacha** |
| Yangilanish | ✅ darhol | ## ❌ qayta o'qitish | ## ✅ **darhol** |
| Manba ko'rsatish | ⚠️ qo'lda | ## ❌ **imkonsiz** | ## ✅ **oson** |

---

## 2. ① Prompting

> **"Modelga shaxsiy ma'lumot berishning eng oddiy yo'li — ma'lumotni PROMPT orqali to'g'ridan-to'g'ri berish."**

```python
SISTEM = f"""Siz bank yordamchisisiz.

MA'LUMOT:
{butun_faq_matni}

Faqat shu ma'lumotga asoslanib javob bering."""
```

> **"Uzun paragraflarni har safar model chaqirilganda berish VAQT JIHATIDAN SAMARASIZ va TOKEN ISTE'MOL QILADIGAN ilovaga olib kelishi mumkin."**

> ## 💰 **VA BU RAQAMLARDA KO'RINADI** *(36-modul)*:
> ```
> 10 sahifalik FAQ  ≈  5000 token
> Kuniga 1000 so'rov →  5 000 000 token/kun  →  ~$22/oy  (faqat KIRISH)
> 🇺🇿 O'zbekcha bo'lsa  →  ~$41/oy   (1.88× ustama)
> ```
>
> ## ⚠️ **VA YANA BIR MUAMMO — SIFAT.** Uzun kontekstda model **o'rtadagi** ma'lumotni **e'tibordan chetda** qoldiradi *("lost in the middle" hodisasi)*.
>
> ## ✅ **QACHON YARAYDI:** ma'lumot **kichik** *(< 2000 token)* va **o'zgarmas** bo'lsa.

---

## 3. ② Fine-tuning

> **"Fine-tuning modelning ICHKI ISHLASHIGA to'g'ridan-to'g'ri aralashadi — neyron tarmoq bog'lanishlarining OG'IRLIKLARINI sozlaydi."**

> ## ✅ **34-MODULDA BUNI HAQIQATAN QILGAN EDIK.** Va o'sha yerda **halol** natijalarni ko'rgan edik:
> ```
> Kurs retsepti (100 namuna)  →  aniqlik 0.18   💥 tasodifdan YOMON
> Tuzatilgan (1200 namuna)    →  aniqlik 0.645  ✅
> ```
>
> ## 🔑 **KURSNING RO'YXATI TO'G'RI:**
> ```
> ⚠️ Vaqt va hisoblash quvvati  →  bizda 11 daqiqa (kichik namunada!)
> ⚠️ Katta ma'lumot to'plami    →  100 ta yetmadi, 1200 ta kerak bo'ldi
> ⚠️ ML/DL bo'yicha tajriba     →  eval_strategy, processing_class, ...
> ```

> ## 💥💥 **VA KURS AYTMAGAN ENG MUHIM CHEKLOV — FINE-TUNING FAKTLARNI QO'SHMAYDI.**
>
> ```
> Fine-tuning O'RGATADI  →  USLUB, FORMAT, VAZIFA
> Fine-tuning O'RGATMAYDI →  YANGI FAKTLAR
> ```
>
> **"Bizning depozit foizimiz 18%"** ni fine-tuning bilan o'rgatish — **noto'g'ri vosita**. Model buni **eslamaydi**, u **yolg'on to'qiydi**.
>
> ## 🏆 **QOIDA:**
> ```
> "Model qanday JAVOB BERSIN?"   →  fine-tuning yoki few-shot
> "Model NIMANI bilsin?"          →  ⭐ RAG
> ```

---

## 4. ③ RAG

> **"Bu — katta hajmdagi embeddinglangan ma'lumotni ma'lumotlar bazasida saqlab, aniq foydalanuvchi savoliga javob berish uchun FAQAT KERAKLI QISMINI olib chiqadigan yondashuv."**

```
BUTUN MA'LUMOT  (1000 sahifa)
        ↓  indekslash (bir marta)
   VEKTOR BAZASI
        ↓  savol keladi
   ENG MOS 3 BO'LAK  (~1500 token)
        ↓
   PROMPT + LLM  →  javob
```

> ## 🏆 **BU — 31-MODUL 10-DARSIDA QO'LDA YOZGAN NARSAMIZ.** U yerda `TfidfVectorizer` + `cosine_similarity` bilan **20 satrda** qilgan edik.
>
> ## ⚠️ **VA O'SHA YERDAGI TOPILMAMIZNI ESLANG:**
> > *"What is the weather in Tashkent?"* savoli **0.487** ball bilan **noto'g'ri** hujjatni topgan va model **`'rainy'` deb yolg'on javob bergan** edi.
>
> **Uchta himoya bilan tuzatgan edik:** `stop_words='english'` · `min_ball=0.15` · `"reply exactly: NOT FOUND"`.
>
> ## 🔑 **BU MODULDA HAM SHU MUAMMO QAYTADI** — va biz uni **yana** hal qilamiz.

---

## 5. ⭐⭐ Kurs aytmagan to'rtinchi yo'l — GIBRID

Amalda **eng yaxshi tizimlar** bir nechta yondashuvni **birlashtiradi**:

```
SISTEM PROMPT (doimiy)     →  rol, format, cheklovlar        ← prompting
   +
FEW-SHOT (2–3 misol)       →  javob USLUBI                    ← prompting
   +
RAG (dinamik)              →  ⭐ FAKTLAR                       ← retrieval
   +
Fine-tuning (ixtiyoriy)    →  domen tili, qisqa promptlar     ← fine-tuning
```

> ## 🏆 **AMALIY TARTIB — ARZONDAN QIMMATGA:**
> ```
> ① Aniq sistem prompt                  ← BEPUL
> ② + few-shot (2–3 misol)              ← har chaqiruvda token
> ③ + RAG                                ← indekslash + qidiruv
> ④ + fine-tuning                        ← faqat KO'P so'rovda
> ```
>
> ## 💡 **39-MODULDA O'LCHAGAN EDIK:** aniq sistem prompt bo'lganda **few-shot ortiqcha** bo'lib chiqdi. **Har qadamni o'lchang.**

---

## 6. 🇺🇿 O'zbekiston uchun qaysi biri?

| Vazifa | Tavsiya |
|---|---|
| Bank FAQ chatbot | ## ⭐ **RAG** |
| Hujjatlar bo'yicha savol-javob | ## ⭐ **RAG** |
| Chiptalarni yo'naltirish | ## **Few-shot** *(34-modul: fine-tuning ham mumkin)* |
| Doimiy qisqa ko'rsatma | Sistem prompt |
| O'zbekcha uslubni o'rgatish | ⚠️ Fine-tuning *(ma'lumot kerak)* |

> ## ⚠️⚠️ **VA MA'LUMOT SUVERENITETI** *(35-modul, 2-dars)*:
> ```
> RAG'da hujjatlaringiz  →  EMBEDDING uchun API'ga yuboriladi
>                        →  ⚠️ ma'lumot chet elga CHIQADI
> ```
> ## ✅ **YECHIM — MAHALLIY EMBEDDING** *(bu modulda ko'rsatamiz)*:
> ```python
> from langchain_huggingface import HuggingFaceEmbeddings
> emb = HuggingFaceEmbeddings(
>     model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
> ```
> **Bepul · mahalliy · 50 tilda · ma'lumot chiqmaydi.**

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Uchta yo'l qaysilar?

**M2.** Fine-tuning yangi faktlarni o'rgatadimi?

**M3.** RAG ning asosiy g'oyasi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Prompting** · **fine-tuning** · **RAG**.

**M2.** ## ❌ **Yo'q** — u **uslub va formatni** o'rgatadi. Faktlar uchun — **RAG**.

**M3.** **Butun ma'lumot** o'rniga **eng mos bo'lakni** topib, promptga qo'shish.

</details>

### 🟡 O'rta

**M4.** ⭐ Uch yondashuvning narxini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

HUJJAT_TOKEN = 5000        # 10 sahifalik FAQ
RAG_TOKEN = 1500           # 3 bo'lak
KI, CH = 0.15, 0.60        # gpt-4o-mini
UZ = 1.88

for kunlik in [100, 1000, 10000]:
    p = kunlik * 30 * (HUJJAT_TOKEN * KI + 200 * CH) / 1e6
    r = kunlik * 30 * (RAG_TOKEN * KI + 200 * CH) / 1e6
    print(f"{kunlik:6d}/kun  prompting ${p*UZ:7.2f}/oy   "
          f"RAG ${r*UZ:7.2f}/oy   tejash {(1-r/p):.0%}")
```

## 🔑 **RAG ODATDA 3–4× ARZON** — chunki promptga **butun hujjat** emas, **bo'laklar** ketadi.

</details>

**M5.** ⭐ Qaysi vazifaga qaysi yondashuv?

<details>
<summary>✅ Javob</summary>

```
"Javob DOIM JSON bo'lsin"           →  sistem prompt
"Javob uslubi shunday bo'lsin"      →  few-shot
"Depozit foizimiz 18%"              →  ⭐ RAG
"Model o'zbekcha bank atamalarini
 yaxshiroq tushunsin"                →  fine-tuning (ma'lumot kerak)
```

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Gibrid arxitekturani loyihalang.

<details>
<summary>✅ Javob</summary>

```
FOYDALANUVCHI SAVOLI (o'zbekcha)
        ↓
① PII maskalash                     (35-modul)
        ↓
② RAG: eng mos 3 bo'lak topish      ⭐ FAKTLAR
        ↓
③ PROMPT:
   sistem  →  rol + format + "kontekstda yo'q bo'lsa: BILMAYMAN"
   few-shot →  2 ta misol (javob uslubi)
   kontekst →  RAG bo'laklari
   savol    →  foydalanuvchi savoli
        ↓
④ MODEL
        ↓
⑤ Javobda MANBA ko'rsatilganmi? tekshirish
        ↓
⑥ Ishonch past bo'lsa → OPERATORGA
```

## 🔑 **HAR QATLAM ALOHIDA MUAMMONI HAL QILADI** — birortasi **ortiqcha emas**.

</details>

---

## 📌 Xulosa

```
① PROMPTING     →  kichik, o'zgarmas ma'lumot        (0 tayyorgarlik, qimmat)
② FINE-TUNING   →  USLUB va FORMAT                    (faktlar UCHUN EMAS!)
③ RAG           →  ⭐ FAKTLAR, cheksiz hajm, manba ko'rsatish
④ GIBRID        →  🏆 amalda ENG YAXSHI

"Model qanday JAVOB BERSIN?"  →  fine-tuning / few-shot
"Model NIMANI bilsin?"         →  ⭐ RAG
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Cut-off sana | Knowledge cut-off | Model **qachongacha** ma'lumot ko'rgan |
| RAG | Retrieval Augmented Generation | Topib, **promptga qo'shish** |
| Indekslash | Indexing | Ma'lumotni **qidiruvga tayyorlash** |
| Ma'lumot suvereniteti | Data sovereignty | Ma'lumot **qayerda** saqlanadi |

---

⬅️ [41-modul. LCEL](../41-LangChain-LCEL/README.md) · 🏠 [Modul boshiga](README.md) · ➡️ [2-dars. RAG'ga kirish](02-Introduction-to-RAG.md)
