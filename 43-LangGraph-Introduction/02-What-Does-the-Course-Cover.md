# 2-dars. Bo'lim nimani qamraydi ⭐

## 🎬 Boshlashdan oldin

> **"Nima o'rganasiz, nima quramiz va nimani o'rganib chiqamiz."**

---

## 1. Yo'l xaritasi

| Modul | Mavzu | Nima olasiz |
|---|---|---|
| ## **43** | Kirish | LangGraph **nima** va **nima uchun** |
| ## **44** | Muhitni sozlash | Paketlar · ## ⭐ **kalitsiz variant** |
| ## **45** | Graf komponentlari | ## **State · Node · Edge** · shartli qirra |
| ## **46** | Xabarlarni boshqarish | ## ⭐ **reducer** · trim · xulosalash |
| ## **47** | Thread-level persistence | ## ⭐⭐ **Checkpointer** · SQLite |

---

## 2. ⭐⭐ Uchta asosiy muammo va ularning yechimi

> **"Xabarlarni ro'yxatga qo'shishni o'rganasiz. Keyin eski xabarlarni QIRQISHNI. Lekin qirqganda MUHIM KONTEKSTNI yo'qotish xavfi bor. Aynan shu yerda XULOSALASH kerak bo'ladi."**

```
① QO'SHISH   →  suhbat o'sadi        →  ✅ kontekst bor
                                      →  💥 narx va kontekst oynasi

② QIRQISH    →  faqat oxirgi N ta    →  ✅ arzon va barqaror
                                      →  💥 eski KONTEKST YO'QOLADI

③ XULOSALASH →  eskini SIQIB saqlash →  ✅ kontekst + arzon
                                      →  💥 2× LLM chaqiruvi (o'lchandi)
```

> ## 🔬 **BIZ BULARNI O'LCHADIK:**
> ```
> 10-burilishda:
>   trim YO'Q  →  30 xabar · 590 token
>   trim=5     →   5 xabar · 113 token      ⭐ 5.2× farq
>
> Xulosalash  →  5 burilish = 10 ta LLM chaqiruvi  (2× har burilishda)
> ```
>
> ## 🔑 **YA'NI: XULOSALASH — TOKENNI TEJAYDI, LEKIN CHAQIRUVNI IKKILANTIRADI.** Bu **savdo**, **bepul yaxshilanish emas**.

---

## 3. ⭐ Nimani QURAMIZ

Bo'lim oxirida sizda **ishlaydigan prototip** bo'ladi:

```
[START]
   ↓
[ask_question]        foydalanuvchidan savol oladi
   ↓
[chatbot]             LLM javob beradi (⭐ xulosani kontekst sifatida ko'radi)
   ↓
[summarize_messages]  suhbatni siqadi va eskisini o'chiradi
   ↓
[END]
   ↕
[checkpointer]        ⭐ ishga tushirishlar ORASIDA holat saqlanadi
   ↓
[SQLite]              ⭐⭐ DASTUR YOPILSA HAM saqlanadi
```

> ## 🏆 **BU — HAQIQIY CHATBOT ARXITEKTURASI.** Ko'p "AI startap" mahsulotlari **aynan shu** tuzilishda.

---

## 4. ⚠️ Ogohlantirish — kursning kodi ISHLAB CHIQARISHGA TAYYOR EMAS

Biz buni har darsda ko'rsatamiz. Qisqacha:

| Kursda | Muammo | Bizning yechim |
|---|---|---|
| `input()` tugun ichida | ## 💥 **Faqat notebookda ishlaydi** | ## ⭐ `interrupt` |
| `Annotated` yo'q *(45-modul)* | ## 💥 **Savol YO'QOLADI** *(o'lchandi)* | ## ⭐ `add_messages` |
| `recursion_limit` aytilmagan | ## 💥 **Sikl 5000 marta aylandi** | ## ⭐ `{"recursion_limit": 20}` |
| `state["messages"][0]` | Reducer bilan **noto'g'ri** | `[-1]` |
| `trim_messages` nomi | ## ⚠️ **`langchain_core` funksiyasini BERKITADI** | Boshqa nom |
| API kaliti majburiy | Kalitsiz **umuman ishlamaydi** | ## ⭐ `FakeListChatModel` |

> ## 🔑 **BULARNING HAMMASI O'LCHANDI VA HUJJATLASHTIRILDI** — har darsda **haqiqiy chiqish** bilan.

---

## 5. 🇺🇿 Bo'limdan keyin nima qura olasiz

```
🏦 Ko'p qadamli bank yordamchisi
      salomlash → ehtiyoj → summa → muddat → hisoblash → tasdiqlash
      ⭐ har qadamda ORQAGA qaytish mumkin

🏥 Yozilish boti
      shifokor → sana → vaqt → tasdiq → SQLite'ga yozish

📚 42-modul (RAG) + 43–47 (LangGraph)
      ⭐⭐ ENG KUCHLI KOMBINATSIYA:
      savol → hujjat topish → javob → xulosalash → yana savolmi?

📞 Marshrutlovchi
      "Bu savol qaysi bo'limga?" → shartli qirra → tegishli tugun
```

> ## 🏆 **42 + 43–47 = HUJJATLARINGIZ BO'YICHA XOTIRALI SUHBAT.** Bu — amaliy AI ilovalarining **eng ko'p uchraydigan** shakli.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Xabarlarni boshqarishning uch usuli qaysi?

**M2.** Xulosalashning narxi nima?

**M3.** Checkpointer nima uchun kerak?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Qo'shish** · **qirqish** *(trim)* · **xulosalash**.

**M2.** ## **2× LLM chaqiruvi** har burilishda *(o'lchandi: 5 burilish → 10 chaqiruv)*.

**M3.** ## Ishga tushirishlar **orasida** holatni saqlash uchun.

</details>

### 🟡 O'rta

**M4.** ⭐ Uch usulning narxini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, pandas as pd
enc = tiktoken.get_encoding("cl100k_base")

SAVOL = "Kredit foizi qancha va qanday hujjat kerak?"
JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi. "
         "Daromad spravkasi va pasport nusxasi kerak.")
XULOSA = "Foydalanuvchi kredit shartlari bilan qiziqmoqda."

BURILISH = 20
q = []
for usul in ["qo'shish", "trim=5", "xulosalash"]:
    tarix, jami_kirish, chaqiruv = [], 0, 0
    for b in range(BURILISH):
        tarix += [SAVOL, JAVOB]
        if usul == "trim=5":
            tarix = tarix[-5:]
        elif usul == "xulosalash":
            tarix = [XULOSA]
        jami_kirish += sum(len(enc.encode(x)) for x in tarix)
        chaqiruv += 2 if usul == "xulosalash" else 1
    q.append({"usul": usul, "chaqiruv": chaqiruv,
              "jami_kirish_token": jami_kirish})

d = pd.DataFrame(q)
d["narx_$"] = (d.jami_kirish_token / 1e6 * 0.15).round(5)
print(d.to_string(index=False))
```

## 🔑 **XULOSALASH TOKENNI KESKIN KAMAYTIRADI, LEKIN CHAQIRUVNI IKKILANTIRADI.**

## 💡 **HAQIQIY QAROR — SUHBAT UZUNLIGIGA BOG'LIQ.** Qisqa suhbatda **qo'shish** yetadi.

</details>

**M5.** ⭐ O'z loyihangizning grafini rejalashtiring.

<details>
<summary>✅ Yechim</summary>

```python
LOYIHA = {
    "nom": "Bank kredit yordamchisi",
    "tugunlar": ["salomlash", "ehtiyoj_aniqlash", "summa_sorash",
                 "muddat_sorash", "hisoblash", "tasdiqlash"],
    "shartli": {"tasdiqlash": {"ha": "ariza_yuborish",
                               "yoq": "summa_sorash"}},
    "state": ["messages", "summa", "muddat", "foiz", "oylik_tolov"],
    "xotira": "SQLite (foydalanuvchi qaytib kelsa davom etsin)",
}

print(f"📋 {LOYIHA['nom']}")
print(f"  tugunlar : {len(LOYIHA['tugunlar'])}")
print(f"  state    : {LOYIHA['state']}")
print(f"  sikl     : {'BOR' if LOYIHA['shartli'] else 'yo‘q'}")
for manba, yollar in LOYIHA["shartli"].items():
    for shart, maqsad in yollar.items():
        belgi = "⭐ SIKL" if maqsad in LOYIHA["tugunlar"] else ""
        print(f"    {manba} --{shart}--> {maqsad}  {belgi}")
```

## 🏆 **`state` DA NIMA BO'LISHINI OLDIN HAL QILING** — u butun grafni **belgilaydi**.

</details>

**M6.** ⭐⭐ Qaysi holatda LCEL, qaysida LangGraph?

<details>
<summary>✅ Javob</summary>

| Vazifa | Tanlov |
|---|---|
| Matnni tarjima qilish | ## **LCEL** — chiziqli |
| RAG *(savol → hujjat → javob)* | ## **LCEL** yetadi |
| Suhbat + xotira | ## ⭐ **LangGraph** |
| "Yana savolingiz bormi?" sikli | ## ⭐ **LangGraph** *(LCEL da IMKONSIZ)* |
| Bir necha bo'limga marshrutlash | ## LCEL `RunnableBranch` **yoki** LangGraph |
| Ko'p qadamli forma to'ldirish | ## ⭐ **LangGraph** |
| Agent *(vosita chaqirish sikli)* | ## ⭐⭐ **LangGraph** |

## 🔑 **QOIDA: SIKL YOKI HOLAT KERAKMI? → LANGGRAPH. AKS HOLDA → LCEL** *(soddaroq)*.

## ⚠️ **LANGGRAPH — LCEL O'RNIGA EMAS, USTIGA.** Tugun ichida **LCEL zanjiri** ishlatiladi.

</details>

---

## 📌 Xulosa

```
43  →  nima va nima uchun
44  →  muhit (⭐ kalitsiz variant ham)
45  →  State · Node · Edge · shartli qirra
46  →  reducer · trim · xulosalash
47  →  Checkpointer · thread · SQLite
```

```
🔬 O'LCHANGAN:
   trim yo'q 590 token  →  trim=5 113 token       (5.2× farq)
   xulosalash: 5 burilish → 10 LLM chaqiruvi      (2× narx)
```

> ## 🏆 **42-MODUL (RAG) + 43–47 (LANGGRAPH) = XOTIRALI HUJJAT YORDAMCHISI.**

---

⬅️ [1-dars. LangGraph nima](01-Welcome-to-the-Course.md) · 🏠 [Modul boshiga](README.md) · ➡️ [3-dars. Talablar](03-Course-Prerequisites.md)
