# 4-dars. AI xabarlar — few-shot prompting ⭐

## 🎬 Boshlashdan oldin

> **"AI xabarlar — model tomonidan yaratilgan xabarlar. Ular FEW-SHOT PROMPTINGDA ham ishlatilishi mumkin."**

---

## 1. Kursning yondashuvi

> **"Sistem xabarini olib tashlaymiz. Shu tarzda biz modelga QANDAY xatti-harakat qilishni AYTMAYMIZ. Buning o'rniga uni few-shot prompting orqali sarkastik javob berishga O'RGATAMIZ."**

```python
from langchain_core.messages import HumanMessage, AIMessage

message_h_dog = HumanMessage(content="I've recently adopted a dog. "
                                     "Can you suggest some dog names?")
message_ai_dog = AIMessage(content='Oh, absolutely. Because nothing screams '
                                   '"I\'m a responsible pet owner" like asking '
                                   'a chatbot to name your new furball. '
                                   'How about "Bark Twain"?')

message_h_cat = HumanMessage(content="I've recently adopted a cat. "
                                     "Can you suggest some cat names?")
message_ai_cat = AIMessage(content='Oh, absolutely. ... "Furry McFurFace", '
                                   '"Sir Meowsalot", or "Catastrophe"?')

message_h_fish = HumanMessage(content="I've recently adopted a fish. "
                                      "Can you suggest some fish names?")

response = chat.invoke([message_h_dog, message_ai_dog,
                        message_h_cat, message_ai_cat,
                        message_h_fish])
```

> **"Model bizning sarkastik ohang niyatimizni sezmaganga o'xshaydi. Balki qo'shimcha misollar aniqlik kiritar."**
>
> *(ikkinchi misol qo'shilgandan keyin)*
>
> **"Mana bizga kerak bo'lgan sarkastik ohang."**

> ## ✅ **KURS TO'G'RI KUZATISH QILADI:** **bitta** misol yetmadi, **ikkitasi** ishladi.
>
> ## 💡 **VA U TO'G'RI OGOHLANTIRADI:** *"umuman olganda, optimal ish uchun HAM sistem xabari, HAM anchagina misolga ega bo'lish ideal"*.

---

## 2. ⚠️⚠️ Bu yondashuv MIQYOSLANMAYDI

```python
message_h_dog   = HumanMessage(...)
message_ai_dog  = AIMessage(...)
message_h_cat   = HumanMessage(...)
message_ai_cat  = AIMessage(...)
message_h_fish  = HumanMessage(...)
message_ai_fish = AIMessage(...)
# ... 10 ta misol uchun 20 ta o'zgaruvchi 😱
```

> ## 💥 **KURSNING O'ZI HAM SHUNI TAN OLADI** *(7-darsda)*: *"bu oldingi implementatsiya biroz QO'POL edi... kodni keraksiz to'ldiradi va MIQYOSLANMAYDI"*.
>
> ## ⭐ **YECHIM — `FewShotChatMessagePromptTemplate`** *(7-dars)*.

---

## 3. 🔬 Biz O'LCHADIK — few-shot HAQIQATAN kerakmi?

**38-modulda** *(sistem xabarisiz)* farq **hayratlanarli** edi:
```
few-shot BILAN : 'positive'
few-shot SIZ   : "I'm sorry, but I can't assist with that request..."
```

Bu yerda **sistem xabari BILAN** qayta o'lchadik *(`Qwen2.5-0.5B-Instruct`)*:

```python
ct_fewshot = ChatPromptTemplate.from_messages([
    ("system", "Classify sentiment as exactly one word: positive, neutral, or negative."),
    few_shot_prompt,                      # 3 ta misol
    ("human", "Classify: {matn}")])

ct_zeroshot = ChatPromptTemplate.from_messages([
    ("system", "Classify sentiment as exactly one word: positive, neutral, or negative."),
    ("human", "Classify: {matn}")])
```

```
few-shot BILAN : 'positive'
few-shot SIZ   : 'positive'          ← ⚠️ BIR XIL!
```

> ## 💥💥 **ANIQ SISTEM XABARI BO'LGANDA — FEW-SHOT KERAK BO'LMADI.**
>
> ## 🔑 **VA BU 38-MODUL BILAN ZID EMAS, UNI TO'LDIRADI:**
> ```
> 38-modul: sistem xabari YO'Q  →  few-shot SHART edi
> Bu yerda: sistem xabari ANIQ  →  few-shot ORTIQCHA bo'ldi
> ```
>
> ## 🏆 **AMALIY XULOSA — ARZONDAN QIMMATGA:**
> ```
> ① ANIQ sistem prompt bilan boshlang       ← BEPUL
> ② Yetmasa — 2–3 misol qo'shing            ← har chaqiruvda TOKEN
> ③ Yetmasa — misollar sonini oshiring
> ④ Kuniga minglab so'rov bo'lsa — fine-tuning (34-modul)
> ```
>
> ## 💡 **KO'P DASTURCHI ② DAN BOSHLAYDI VA ① NI TASHLAB KETADI.** Bu — **behuda token**.

---

## 4. ⭐ AI xabar modelning javobi hamdir

```python
response = chat.invoke([("human", "Salom")])
print(type(response).__name__)          # AIMessage
```

Shuning uchun uni **to'g'ridan-to'g'ri** tarixga qo'shish mumkin:

```python
tarix = [("system", "Siz yordamchisiz.")]

def sora(savol):
    tarix.append(("human", savol))
    javob = chat.invoke(tarix)
    tarix.append(javob)                  # ⭐ AIMessage — o'zgartirmasdan
    return javob.content
```

> ## 🔑 **"XOTIRA" — SHUNCHAKI RO'YXATGA QO'SHISH.** LangChain'ning butun `memory` moduli *(35-modulda ko'rganimizdek — endi `langchain-classic` da)* — **shu g'oyaning** o'ramlari.
>
> ## ⚠️ **VA NARXI `O(n²)`** *(35-modul, 3-dars)*.

---

## 5. ⚡ Mashqlar

### 🟢 Oson

**M1.** `AIMessage` nima uchun ishlatiladi?

**M2.** Kursning yondashuvi nima uchun miqyoslanmaydi?

**M3.** Modelning javobi qaysi sinf?

<details>
<summary>✅ Javoblar</summary>

**M1.** ① Modelning **javobi** · ② few-shot **misoli**.

**M2.** Har misol uchun **ikkita o'zgaruvchi**. 10 misol → **20 o'zgaruvchi**.

**M3.** ## **`AIMessage`**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Few-shot va aniq sistem promptni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
SINOVLAR = ["This new song blew my mind",
            "It was fine, nothing special",
            "Worst purchase I've ever made",
            "The train leaves at 7pm"]

def sinov(msgs_fn, nom):
    tog = 0
    for m in SINOVLAR:
        r = chat.invoke(msgs_fn(m)).content.strip().lower()
        print(f"  {m[:32]:34s} → {r}")
    print()

sinov(lambda m: [("system", "Classify sentiment as exactly one word: "
                            "positive, neutral, or negative."),
                 ("human", m)], "zero-shot + aniq sistem")

sinov(lambda m: [("system", "Classify sentiment."),
                 ("human", "This movie is extraordinary"), ("ai", "positive"),
                 ("human", "This album is all right"), ("ai", "neutral"),
                 ("human", m)], "few-shot + noaniq sistem")
```

## 🔑 **QAYSI BIRI ARZONROQ VA ANIQROQ?** — **o'lchang**, taxmin qilmang.

</details>

**M5.** ⭐ Few-shot misollarining token narxini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

MISOLLAR = [("This movie is extraordinary", "positive"),
            ("This album is all right", "neutral"),
            ("Could not have been written worse", "negative")]
qoshimcha = sum(len(enc.encode(h)) + len(enc.encode(a)) + 8
                for h, a in MISOLLAR)
print(f"few-shot ustamasi: {qoshimcha} token / chaqiruv")
for kunlik in [100, 1000, 10000]:
    print(f"{kunlik:6d} so'rov/kun → "
          f"${kunlik*30*qoshimcha/1e6*0.15:7.2f}/oy")
```

## 💡 **MISOLLAR HAR CHAQIRUVDA YUBORILADI** — ular **doimiy** xarajat.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ Misollar sonining aniqlikka ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd

BARCHA = [("This movie is extraordinary", "positive"),
          ("Absolutely loved it", "positive"),
          ("This album is all right", "neutral"),
          ("It exists, I guess", "neutral"),
          ("Could not have been written worse", "negative"),
          ("Complete waste of money", "negative")]

OLTIN = [("This new song blew my mind", "positive"),
         ("It was fine, nothing special", "neutral"),
         ("Worst purchase I've ever made", "negative"),
         ("The train leaves at 7pm", "neutral")]

n = []
for k in [0, 2, 4, 6]:
    msgs_bosh = [("system", "Classify sentiment as exactly one word: "
                            "positive, neutral, or negative.")]
    for h, a in BARCHA[:k]:
        msgs_bosh += [("human", h), ("ai", a)]
    tog = 0
    for m, kut in OLTIN:
        r = chat.invoke(msgs_bosh + [("human", m)]).content.strip().lower()
        tog += (r == kut)
    n.append({"misollar": k, "aniqlik": f"{tog}/{len(OLTIN)}",
              "nisbat": round(tog/len(OLTIN), 2)})

print(pd.DataFrame(n).to_string(index=False))
print("bazaviy (3 sinf): 0.33")
```

## 🏆 **EGRI CHIZIQ YASSILANGAN NUQTANI TOPING** — undan keyingi misollar **faqat pul** yeydi.

</details>

---

## 📌 Xulosa

```
AIMessage
├── ① modelning JAVOBI          →  chat.invoke(...) natijasi
└── ② few-shot MISOLI           →  [human, ai, human, ai, human]

⚠️ Kursning yondashuvi MIQYOSLANMAYDI  →  7-darsda FewShotChatMessagePromptTemplate

🏆 ARZONDAN QIMMATGA:
   ① aniq sistem prompt   (BEPUL)
   ② 2–3 misol            (har chaqiruvda token)
   ③ ko'proq misol
   ④ fine-tuning          (34-modul)
```

> ## 💥 **BIZNING O'LCHOVIMIZ: ANIQ SISTEM XABARI BO'LGANDA FEW-SHOT KERAK BO'LMADI** — ikkalasi ham `'positive'` berdi.

---

⬅️ [3-dars. System va human xabarlar](03-System-and-Human-Messages.md) · 🏠 [Modul boshiga](README.md) · ➡️ [5-dars. Prompt shablonlari](05-Prompt-Templates-and-Prompt-Values.md)
