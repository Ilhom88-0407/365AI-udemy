# 2-dars. RAG'ga kirish ⭐

## 🎬 Boshlashdan oldin

> **"RAG ilovasi odatda uchta asosiy qismdan iborat: INDEKSLASH, RETRIEVAL va GENERATSIYA."**

---

## 1. Uchta qism

![RAG oqimi](assets/02-rag-oqim.svg)

```
┌─── ① INDEKSLASH (bir marta) ────────────────────────────────┐
│  yuklash  →  bo'laklash  →  embedding  →  vektor bazasi     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─── ② RETRIEVAL (har savolda) ───────────────────────────────┐
│  savol  →  embedding  →  eng mos K bo'lak                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─── ③ GENERATSIYA ───────────────────────────────────────────┐
│  savol + bo'laklar  →  prompt  →  LLM  →  javob             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. ⚠️ Kursning halol ogohlantirishi

> **"Bu usulning kamchiligi — ma'lumotni real vaqtda olish tufayli javob KECHIKISHINING oshishi. Bundan tashqari, olingan hujjatlar SIFATI modelning javobiga kuchli ta'sir qiladi. Agar retriever tegishli ma'lumotni topa olmasa, model YOMON javob beradi — HATTOKI JAVOB MA'LUMOTDA BO'LSA HAM."**

> ## ✅✅ **BU — KURSNING ENG MUHIM JUMLASI.**
>
> ## 🔑 **RAG'DA ENG ZAIF HALQA — RETRIEVER, MODEL EMAS.**
>
> ```
> Retriever noto'g'ri hujjat topdi  →  ⭐ MODEL AYBDOR EMAS
>                                    →  lekin javob NOTO'G'RI
> ```

> ## 💥 **31-MODUL 10-DARSIDA BUNI O'LCHAGAN EDIK:**
> ```
> Savol : "What is the weather in Tashkent?"
> Topildi: 0.487 ball bilan NOTO'G'RI hujjat
> Javob : 'rainy'          ← MODEL YOLG'ON TO'QIDI
> ```
>
> ## ✅ **UCHTA HIMOYA BILAN TUZATGAN EDIK:**
> ```
> ① stop_words='english'  →  ball 0.487 → 0.000
> ② min_ball = 0.15       →  past ballni RAD ETISH
> ③ "reply exactly: NOT FOUND"  →  model YOLG'ON TO'QIMASIN
> ```
>
> ## 🏆 **BU MODULDA UCHALASINI HAM QAYTA QURAMIZ** — professional vositalar bilan.

---

## 3. ⭐ Indekslashning to'rt qadami

| # | Qadam | Nima qiladi | Dars |
|---|---|---|---|
| ① | **Loading** | Fayl → `Document` | 6–7 |
| ② | **Splitting** | Katta matn → bo'laklar | 8–10 |
| ③ | **Embedding** | Matn → vektor | 11 |
| ④ | **Storing** | Vektorlarni saqlash | 12–13 |

> ## 💡 **INDEKSLASH — BIR MARTA.** Keyin faqat **yangi hujjat** qo'shilganda takrorlanadi.
>
> ## 💰 **VA U ARZON** *(36-modul)*: `text-embedding-3-small` — **$0.02/1M**, chat modelidan **7.5× arzon**. Mahalliy embedding esa — ## **bepul**.

---

## 4. ⚠️ RAG NIMANI HAL QILMAYDI

Kurs faqat kechikish va retriever sifatini eslatadi. **Yana beshta cheklov bor:**

```
❌ HISOB-KITOB
   "2023-yilda jami savdo qancha bo'ldi?"
   →  RAG bo'laklarni topadi, lekin QO'SHISHNI bilmaydi

❌ BUTUN HUJJAT BO'YICHA XULOSA
   "Bu hisobotning asosiy g'oyasi nima?"
   →  RAG 3 ta bo'lak beradi, BUTUN hujjatni emas

❌ SANOQ VA TAQQOSLASH
   "Nechta mijoz shikoyat qilgan?"
   →  bu SQL vazifasi, RAG emas

❌ VAQT BO'YICHA SO'ROV
   "Oxirgi oyda nima o'zgardi?"
   →  metadata bilan FILTR kerak

⚠️ QARAMA-QARSHI MA'LUMOT
   Ikki hujjatda turli javob bo'lsa — model QAYSI BIRINI tanlaydi?
```

> ## 🔑 **RAG — "MATNDAN MATN TOPISH" VOSITASI.** Hisob, sanoq va agregatsiya uchun — **boshqa vosita** kerak *(SQL, kod, agent)*.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** RAG ning uchta qismi?

**M2.** Indekslashning to'rt qadami?

**M3.** RAG'da eng zaif halqa qaysi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Indekslash** · **retrieval** · **generatsiya**.

**M2.** ## **Yuklash** · **bo'laklash** · **embedding** · **saqlash**.

**M3.** ## **Retriever** — noto'g'ri hujjat topsa, model **aybdor emas**, lekin javob **noto'g'ri**.

</details>

### 🟡 O'rta

**M4.** ⭐ Qaysi savollarga RAG javob BERA OLMAYDI?

<details>
<summary>✅ Javob</summary>

```
❌ "Jami savdo qancha?"          →  hisob-kitob (SQL / kod)
❌ "Hisobotning asosiy g'oyasi?" →  butun hujjat kerak
❌ "Nechta shikoyat bor?"        →  sanoq (SQL)
⚠️ "Oxirgi oyda nima o'zgardi?"  →  metadata FILTRI kerak
```

## 🔑 **RAG — "MATNDAN MATN TOPISH".**

</details>

**M5.** ⭐⭐ 31-moduldagi muammoni eslang va yechimini yozing.

<details>
<summary>✅ Javob</summary>

```
MUAMMO:  savol ma'lumotda YO'Q, lekin retriever baribir hujjat qaytardi
         (0.487 ball) va model 'rainy' deb YOLG'ON to'qidi

YECHIM:
  ① Ball CHEGARASI      →  min_ball dan past bo'lsa — hujjat YO'Q deb hisobla
  ② Prompt CHEKLOVI     →  "kontekstda yo'q bo'lsa aynan 'BILMAYMAN' deb yoz"
  ③ Javobni TEKSHIRISH  →  manba ko'rsatilganmi?
```

</details>

---

## 📌 Xulosa

```
① INDEKSLASH  (bir marta)  →  yuklash · bo'laklash · embedding · saqlash
② RETRIEVAL   (har savol)  →  ⚠️ ENG ZAIF HALQA
③ GENERATSIYA              →  savol + bo'laklar → LLM
```

> ## 💥 **"Agar retriever tegishli ma'lumotni topa olmasa, model yomon javob beradi — HATTOKI JAVOB MA'LUMOTDA BO'LSA HAM."**

---

⬅️ [1-dars. O'z ma'lumotingizni qo'shish](01-How-to-Integrate-Custom-Data.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Hujjat yuklash va bo'laklash](03-Document-Loading-and-Splitting.md)
