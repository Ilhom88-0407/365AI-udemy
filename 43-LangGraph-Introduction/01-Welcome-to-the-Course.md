# 1-dars. LangGraph nima? ⭐⭐

## 🎬 Boshlashdan oldin

> **"LangGraph — bu til modellari bilan ishlaydigan HOLATLI (stateful), KO'P BOSQICHLI ilovalar qurish uchun freymvork."**

---

## 1. 💥 Muammo: modellar XOTIRASIZ

> **"Agar siz oddiy chatbot qurgan bo'lsangiz, standart cheklovni sezgansiz: u ikki xabar oldin nima deganingizni ESLAMAYDI."**

```
Foydalanuvchi:  Salom, men Oybek.
Model:          Salom Oybek! Qanday yordam bera olaman?
Foydalanuvchi:  Mening ismim nima?
Model:          Kechirasiz, ismingizni bilmayman.       ← 💥
```

> ## 🔑 **SABAB: LLM — STATELESS.** Har chaqiruv — **mustaqil**. Model **hech narsa eslamaydi**.
>
> ## 💡 **VA BU — 39-MODULDA KO'RGAN NARSAMIZ:**
> ```python
> chat.invoke([HumanMessage("Salom, men Oybek")])       # 1-chaqiruv
> chat.invoke([HumanMessage("Ismim nima?")])            # 2-chaqiruv — BOG'LIQ EMAS
> ```
>
> ## ✅ **"XOTIRA" — BU FAQAT XABARLAR RO'YXATINI QAYTA YUBORISH:**
> ```python
> chat.invoke([HumanMessage("Salom, men Oybek"),
>              AIMessage("Salom Oybek!"),
>              HumanMessage("Ismim nima?")])            # ⭐ hammasi birga
> ```
> ## 💥 **LEKIN SHUNDA — RO'YXAT CHEKSIZ O'SADI.** Va **har token uchun pul to'laysiz**.

---

## 2. ⭐⭐ LangGraph nima hal qiladi?

> **"LangGraph bizga grafning HOLATINI (state) boshqarish yo'lini beradi."**

```
State  =  tugundan tugunga o'tuvchi va yo'lda YANGILANUVCHI ma'lumot to'plami
```

| LangGraph nima beradi | Nima uchun |
|---|---|
| ## **Holat** *(state)* | Suhbat tarixi bir joyda, avtomatik uzatiladi |
| ## **Tugunlar** *(nodes)* | Har biri **bitta** vazifa — sinash va tuzatish oson |
| ## **Qirralar** *(edges)* | Oqim **kod bilan** boshqariladi |
| ## ⭐ **Shartli qirralar** | **Qaror** va **sikl** — LCEL da bu **yo'q** |
| ## ⭐⭐ **Checkpointer** | Ishga tushirishlar **orasida** xotira |

> ## 🏆🏆 **41-MODUL (LCEL) BILAN FARQI — BITTA SO'ZDA: SIKL.**
> ```
> LCEL       →  chiziqli: a | b | c        (DAG, orqaga qaytish YO'Q)
> LangGraph  →  graf: a → b → a → b → c    (⭐ SIKL BOR)
> ```
>
> ## 🔑 **SUHBAT — TABIATAN SIKL:**
> ```
> savol bering → javob → yana savolmi? → ha → savol bering → ...
> ```
> **LCEL bilan buni yozib bo'lmaydi.** LangGraph bilan — **to'rt satr**.

---

## 3. ⭐ Ish bo'yicha misol — yangi xodim yordamchisi

Kursning misoli:

```
[START]
   ↓
[Salomlashish]      "Salom! Qanday yordam bera olaman?"
   ↓
[Chatbot]           "Ta'til siyosati qanday?" → LLM javob beradi
   ↓
[Xulosalash]        suhbatni qisqartiradi
   ↓
[Yana savolmi?]  ── ha ──→  [Salomlashish]     ⭐ SIKL
   │
   yo'q
   ↓
[END]
```

> ## 🔑 **HAR TUGUN — BITTA ANIQ VAZIFA.** Bu — **qurish, sinash va tuzatishni osonlashtiradi**.
>
> ## 💡 **VA BU — DASTURLASHNING ESKI QOIDASI** *(single responsibility)*. LangGraph uni **LLM ilovalariga** olib keladi.

---

## 4. 🇺🇿 Bu bizga nima uchun kerak?

```
🏦 Bank chatboti      →  "Kredit olmoqchiman" → savollar KETMA-KET beriladi
                          (summa? muddat? daromad?) — har biri ALOHIDA tugun

🏥 Klinika yozilishi  →  shifokor → sana → vaqt → tasdiqlash
                          (har qadamda ORQAGA qaytish mumkin)

🏢 Ichki yordamchi    →  savol → hujjat topish (42-modul!) → javob → yana savolmi?

📞 Call-markaz        →  bo'lim aniqlash → shartli qirra → tegishli tugunga
```

> ## 🏆 **HAMMASIDA UMUMIY NARSA: KO'P QADAM + QAROR + XOTIRA.** Aynan **LangGraph** shu uchun.

---

## 5. ⚠️ Kurs aytmagan narsa — bu kurs KICHIK kurs

> ## 🔑 **BU BO'LIM 43–47-MODULLARDAN IBORAT** *(jami 20 dars)* va **LangGraph'ning ASOSLARINI** beradi:
> ```
> ✅ State · Node · Edge · shartli qirra
> ✅ Xabarlarni boshqarish (qo'shish, o'chirish, xulosalash)
> ✅ Checkpointer (qisqa va uzoq muddatli xotira)
> ```
>
> ## ⚠️ **KURSDA YO'Q, LEKIN AMALDA KERAK:**
> ```
> ⭐ interrupt / Command    →  odam bilan muloqot (input() O'RNIGA)
> ⭐ Send                   →  dinamik parallellik
> ⭐ Subgraph               →  grafni grafga joylash
> ⭐ Tool calling / ReAct   →  agentlar
> ⭐ recursion_limit        →  💥 sikl to'xtamasa NIMA BO'LADI
> ⭐ Postgres checkpointer  →  ishlab chiqarish uchun
> ```
> ## 💡 **BULARNING MUHIMLARINI BIZ QO'SHAMIZ** — ayniqsa `interrupt` va `recursion_limit`.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** LLM nima uchun "eslamaydi"?

**M2.** LangGraph'ning asosiy tushunchasi nima?

**M3.** LCEL va LangGraph orasidagi asosiy farq?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Chunki u **stateless** — har chaqiruv **mustaqil**.

**M2.** ## **State** — tugundan tugunga o'tuvchi va **yangilanuvchi** ma'lumot.

**M3.** ## **SIKL.** LCEL — chiziqli *(DAG)*, LangGraph — **orqaga qaytish** mumkin.

</details>

### 🟡 O'rta

**M4.** ⭐ "Xotirasizlik"ni o'zingiz ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.messages import HumanMessage, AIMessage

# ⭐ API kalitisiz sinov modeli
chat = FakeListChatModel(responses=["Salom Oybek!", "Ismingizni bilmayman."])

# ── XOTIRASIZ ──
r1 = chat.invoke([HumanMessage("Salom, men Oybek.")])
r2 = chat.invoke([HumanMessage("Mening ismim nima?")])
print("1:", r1.content)
print("2:", r2.content, "  ← model 1-xabarni KO'RMADI")

# ── XOTIRA BILAN (qo'lda) ──
tarix = [HumanMessage("Salom, men Oybek."), AIMessage("Salom Oybek!"),
         HumanMessage("Mening ismim nima?")]
print("\nqo'lda tarix:", len(tarix), "xabar modelga yuboriladi")
```

## 🔑 **HAQIQIY MODELDA IKKINCHI JAVOB "Oybek" BO'LADI** — chunki tarix **yuborildi**.

</details>

**M5.** ⭐⭐ Suhbat tarixining o'sishini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")

SAVOL = "Bank kreditining foiz stavkasi qancha va qanday hujjat kerak?"
JAVOB = ("Iste'mol krediti yillik 24% dan boshlanadi, muddati 24 oygacha. "
         "Daromad spravkasi va pasport nusxasi talab qilinadi.")

tarix, q = [], []
for burilish in range(1, 21):
    tarix += [{"rol": "human", "matn": SAVOL}, {"rol": "ai", "matn": JAVOB}]
    t = sum(len(enc.encode(x["matn"])) for x in tarix)
    if burilish in (1, 5, 10, 20):
        q.append((burilish, len(tarix), t))

for b, n, t in q:
    print(f"  {b:2d}-burilish: {n:3d} xabar · {t:5d} token")

narx = q[-1][2] * 20 / 2 / 1_000_000 * 0.15    # o'rtacha × 20 burilish
print(f"\n💰 20 burilishlik BITTA suhbat ≈ ${narx:.4f} (gpt-4o-mini)")
print(f"💰 kuniga 1000 suhbat        ≈ ${narx*1000:.2f}")
```

## 💥 **TARIX CHIZIQLI O'SADI, NARX ESA — KVADRATIK** *(har burilishda BUTUN tarix qayta yuboriladi)*.

</details>

**M6.** ⭐ Grafni qog'ozda chizing.

<details>
<summary>✅ Yechim</summary>

O'z loyihangiz uchun:

```
① Qanday TUGUNLAR kerak?     (har biri BITTA vazifa)
② Qanday QIROR kerak?        (kim kimga o'tadi)
③ Qayerda QAROR bor?         (shartli qirra)
④ Qayerda SIKL bor?          (orqaga qaytish)
⑤ STATE'da nima saqlanadi?   (xabarlar? xulosa? foydalanuvchi ma'lumoti?)
```

**🇺🇿 Misol — bank kredit yordamchisi:**
```
[START] → [salomlash] → [summa so'rash] → [muddat so'rash]
        → [hisoblash] → [tasdiqlash?] ──ha──→ [ariza yuborish] → [END]
                              │
                            yo'q
                              ↓
                        [summa so'rash]     ⭐ SIKL
```

## 🏆 **GRAFNI OLDIN QOG'OZDA CHIZING** — kod **keyin** yoziladi.

</details>

---

## 📌 Xulosa

```
💥 LLM — STATELESS: hech narsa eslamaydi
✅ "Xotira" = xabarlar ro'yxatini QAYTA YUBORISH
💥 Lekin ro'yxat CHEKSIZ o'sadi → narx va kontekst muammosi

⭐ LangGraph:  State · Node · Edge · shartli qirra · checkpointer
🏆 LCEL'dan asosiy farqi — SIKL
```

> ## 🔑 **HAR TUGUN — BITTA VAZIFA.** Qurish, sinash va tuzatish **oson bo'ladi**.

---

🏠 [Modul boshiga](README.md) · ➡️ [2-dars. Kurs nimani qamraydi](02-What-Does-the-Course-Cover.md)
