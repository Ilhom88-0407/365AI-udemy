# 3-dars. Hujjat yuklash va bo'laklash — nazariya

## 🎬 Boshlashdan oldin

> **"`Document` — LangChain'dagi sinf bo'lib, matn bo'lagini va u bilan bog'liq METAMA'LUMOTNI saqlaydi."**

---

## 1. `Document` — yagona format

```python
Document(
    page_content="matn...",
    metadata={"source": "hisobot.pdf", "page": 3})
```

> ## 🔑 **HAR FORMAT — PDF, DOCX, CSV, HTML, JSON — `Document` GA AYLANADI.** Keyingi hamma qadam **format haqida o'ylamaydi**.

---

## 2. Nima uchun bo'laklash kerak?

> **"Birinchidan, bitta hujjat qancha kontent saqlashiga CHEKLOV YO'Q. Bu keyinroq muammo tug'diradi, chunki katta til modeliga uzatishimiz mumkin bo'lgan kontentga cheklov bor."**

```
① KONTEKST OYNASI     →  128k token cheklovi  (36-modul)
② TOKEN NARXI         →  butun hujjat har chaqiruvda = QIMMAT
③ ⭐ SIFAT             →  model BITTA mavzudagi bo'lakda yaxshiroq ishlaydi
```

> **"Tadqiqotlar ko'rsatdiki, til modellari turli mavzularni qamrab olgan katta matnlar o'rniga, BITTA MAVZUNI qamrab olgan hujjat bo'laklari berilganda YAXSHIROQ ishlaydi."**

> ## 🔑 **③ — ENG MUHIMI, VA U KO'PINCHA UNUTILADI.**
>
> Bo'laklash **faqat** hajm masalasi emas — u **sifat** masalasi. Bir bo'lakda **ikki mavzu** bo'lsa, embedding **ikkalasining o'rtasida** turadi va **hech biriga** yaqin bo'lmaydi.

---

## 3. ⭐⭐ Bo'lak hajmi — asosiy almashuv

```
KICHIK bo'lak (200 belgi)          KATTA bo'lak (2000 belgi)
──────────────────────             ────────────────────────
✅ aniq mavzu                       ⚠️ bir necha mavzu
✅ embedding ANIQ                   ⚠️ embedding "o'rtacha"
❌ kontekst YETMAYDI                ✅ to'liq kontekst
❌ ko'p bo'lak → ko'p qidiruv       ✅ kam bo'lak
```

> ## 🏆 **AMALIY QIYMATLAR:**
> ```
> 300–500 belgi   →  FAQ, qisqa javoblar
> 500–1000 belgi  →  ⭐ umumiy holat (kurs 500 ni tanlaydi)
> 1000–2000 belgi →  texnik hujjatlar, kod
> ```
>
> ## 💡 **VA `chunk_overlap` — 10–20%.** U bo'laklar orasidagi **uzilishni** yumshatadi.

---

## 4. ⚠️ Kursda aytilmagan — bo'laklash SIFAT masalasi

```
❌ YOMON BO'LAK:
   "...foizi 18% dan boshlanadi. Karta buyurtmasi uchun esa..."
        ↑ depozit mavzusi tugadi        ↑ karta mavzusi boshlandi
   →  embedding IKKALASIGA ham yaqin emas

✅ YAXSHI BO'LAK:
   "Muddatli depozit yillik 18% dan 22% gacha foiz keltiradi.
    Minimal summa 1 000 000 so'm. Muddati 6 oydan 36 oygacha."
   →  BITTA mavzu, embedding ANIQ
```

> ## ✅ **SHUNING UCHUN `MarkdownHeaderTextSplitter` KUCHLI** *(10-dars)* — u **sarlavhalar** bo'yicha bo'ladi, ya'ni **mavzu chegaralarini** hurmat qiladi.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** `Document` da nechta maydon bor?

**M2.** Nima uchun bo'laklash kerak?

**M3.** `chunk_overlap` nima uchun?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Ikkita** — `page_content` va `metadata`.

**M2.** ① kontekst oynasi · ② narx · ## ③ **sifat** *(bitta mavzu)*.

**M3.** Bo'laklar orasidagi **uzilishni yumshatish** — oldingi bo'lakning oxiri keyingisining boshiga qo'shiladi.

</details>

### 🟡 O'rta

**M4.** ⭐ Bo'lak hajmini tanlash mezonlarini yozing.

<details>
<summary>✅ Javob</summary>

```python
def bolak_hajmi_maslahati(hujjat_turi, o_rt_savol_uzunligi=60):
    XARITA = {
        "faq":       (300, 50,  "qisqa savol-javob"),
        "maqola":    (700, 100, "bir mavzuli paragraflar"),
        "texnik":    (1200, 200, "kod va ta'riflar birga"),
        "shartnoma": (1000, 150, "bandlar butun qolsin"),
    }
    hajm, ust, izoh = XARITA.get(hujjat_turi, (500, 50, "umumiy"))
    print(f"{hujjat_turi:12s} → chunk_size={hajm}  overlap={ust}  ({izoh})")
    return hajm, ust

for t in ["faq", "maqola", "texnik", "shartnoma"]:
    bolak_hajmi_maslahati(t)
```

## ⚠️ **BU — BOSHLANG'ICH NUQTA.** Haqiqiy qiymatni **o'lchab** toping *(LOYIHALAR.md, 2-loyiha)*.

</details>

---

## 📌 Xulosa

```
HAR FORMAT  →  Document(page_content, metadata)  →  BO'LAKLAR

Bo'laklash SABABLARI:
  ① kontekst oynasi     (36-modul)
  ② token narxi         (36-modul)
  ③ ⭐ SIFAT — BITTA mavzu = ANIQ embedding
```

---

⬅️ [2-dars. RAG'ga kirish](02-Introduction-to-RAG.md) · 🏠 [Modul boshiga](README.md) · ➡️ [4-dars. Embedding nazariyasi](04-Document-Embedding.md)
