# 7-dars. Few-shot chat xabar shablonlari ⭐⭐

## 🎬 Boshlashdan oldin

> **"Bu oldingi few-shot prompting implementatsiyasi biroz QO'POL edi. Bizning yondashuvimiz har bir misol uchun alohida human-AI xabarlar juftligini aniqlash edi. Bu kodni keraksiz to'ldirdi va aniqki MIQYOSLANMAYDI."**

---

## 1. Muammo va yechim

```
❌ 4-DARSDAGI YONDASHUV                ✅ BU YERDA
   message_h_dog  = HumanMessage(...)     examples = [
   message_ai_dog = AIMessage(...)            {"pet": "dog",  "response": "..."},
   message_h_cat  = HumanMessage(...)         {"pet": "cat",  "response": "..."},
   message_ai_cat = AIMessage(...)            {"pet": "fish", "response": "..."},
   message_h_fish = HumanMessage(...)     ]
   # 10 misol → 20 o'zgaruvchi 😱        # 10 misol → ro'yxatga 10 ta lug'at ⭐
```

---

## 2. Kod

```python
from langchain_core.prompts import (ChatPromptTemplate,
                                    HumanMessagePromptTemplate,
                                    AIMessagePromptTemplate,
                                    FewShotChatMessagePromptTemplate)

# ① Bitta misolning SHABLONI
TEMPLATE_H = "I've recently adopted a {pet}. Could you suggest some {pet} names?"
TEMPLATE_AI = "{response}"

message_template_h  = HumanMessagePromptTemplate.from_template(TEMPLATE_H)
message_template_ai = AIMessagePromptTemplate.from_template(TEMPLATE_AI)

example_template = ChatPromptTemplate.from_messages([message_template_h,
                                                     message_template_ai])

# ② Misollar RO'YXATI
examples = [
    {"pet": "dog",  "response": 'Oh, absolutely. ... How about "Bark Twain"?'},
    {"pet": "cat",  "response": 'Oh, absolutely. ... "Sir Meowsalot"?'},
    {"pet": "fish", "response": 'Oh, absolutely. ... "Fin Diesel"?'},
]

# ③ Few-shot blok
few_shot_prompt = FewShotChatMessagePromptTemplate(
    examples=examples,
    example_prompt=example_template,
    input_variables=["pet"])

# ④ Yakuniy shablon
chat_template = ChatPromptTemplate.from_messages([few_shot_prompt,
                                                  message_template_h])

chat_value = chat_template.invoke({"pet": "rabbit"})
for m in chat_value.messages:
    print(f"{m.type}: {m.content}\n")
```

Biz **ishga tushirdik**:

```
human  : Classify: This movie is extraordinary
ai     : positive
human  : Classify: This album is all right
ai     : neutral
human  : Classify: Could not have been written worse
ai     : negative
human  : Classify: This new song blew my mind        ← ⭐ yangi savol
```

> ## ✅ **UCHTA MISOL + BITTA SAVOL = 7 TA XABAR.** Kod esa **bitta ro'yxat**.

---

## 3. Yangi misol qo'shish — bir satr

> **"Ko'proq misol uzatish qanchalik oson ekanini ko'rasiz. Siz shunchaki misollar ro'yxatiga yangi lug'at qo'shishingiz kerak."**

```python
examples.append({"pet": "parrot", "response": 'Oh, absolutely. ... "Polly Pocket"?'})
```

> ## ⭐ **BU — KURSNING ENG YAXSHI DARSLARIDAN BIRI.** Yondashuv **to'g'ri** va **bugun ham ishlaydi** *(biz tekshirdik: `FewShotChatMessagePromptTemplate` `langchain-core 1.6.0` da **bor**)*.

---

## 4. ⚠️ Sistem xabari bu yerda YO'Q — va bu ATAYLAB emas

Kursning kodida `chat_template` da **faqat** `few_shot_prompt` va `message_template_h` bor. **Sistem xabari yo'q.**

```python
# ✅ TAVSIYA — sistem xabarini QO'SHING
chat_template = ChatPromptTemplate.from_messages([
    ("system", "You reluctantly answer questions with sarcastic responses. "
               "Always suggest exactly 3 names."),          # ⭐
    few_shot_prompt,
    message_template_h,
])
```

> ## 🔑 **4-DARSDAGI O'LCHOVIMIZNI ESLANG:**
> ```
> Aniq sistem xabari BOR   →  few-shot ORTIQCHA bo'ldi
> Sistem xabari YO'Q       →  few-shot SHART edi
> ```
> ## 🏆 **IKKALASI BIRGA — ENG YAXSHI.** Kurs ham 4-darsda buni aytadi, lekin **kodda qo'llamaydi**.

---

## 5. ⭐⭐ `ExampleSelector` — misollarni TANLASH

Kurs *"example selectors kurs doirasidan tashqarida"* deydi. Lekin bu — **narx muammosining yechimi**.

```
MUAMMO:  20 ta misol × har chaqiruv = KO'P TOKEN
YECHIM:  savolga ENG O'XSHASH 3 tasini tanlash
```

```python
from langchain_core.example_selectors import LengthBasedExampleSelector

selector = LengthBasedExampleSelector(
    examples=examples,
    example_prompt=example_template,
    max_length=200)                        # tokenlar emas, SO'ZLAR

few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_selector=selector,             # ⭐ examples= O'RNIGA
    example_prompt=example_template)
```

> ## 🔑 **IKKI XIL SELEKTOR:**
> ```
> LengthBasedExampleSelector    →  UZUNLIK chegarasiga sig'ganicha
> SemanticSimilarityExampleSelector →  ⭐ savolga O'XSHASH misollarni tanlaydi
>                                       (embedding kerak — 42-modul)
> ```
>
> ## 💡 **SEMANTIK SELEKTOR — ENG KUCHLISI.** 100 ta misol saqlaysiz, har chaqiruvda **eng mos 3 tasi** yuboriladi. **Sifat yuqori, narx past.**

---

## 6. 🇺🇿 O'zbekcha few-shot

```python
UZ_MISOLLAR = [
    {"matn": "Bu film ajoyib edi, juda yoqdi",           "yorliq": "ijobiy"},
    {"matn": "Oddiy, hech qanday taassurot qoldirmadi",  "yorliq": "neytral"},
    {"matn": "Pulimni behuda sarfladim, juda yomon",     "yorliq": "salbiy"},
]

ex_h = HumanMessagePromptTemplate.from_template("{matn}")
ex_a = AIMessagePromptTemplate.from_template("{yorliq}")
ex_t = ChatPromptTemplate.from_messages([ex_h, ex_a])

fs = FewShotChatMessagePromptTemplate(examples=UZ_MISOLLAR,
                                      example_prompt=ex_t,
                                      input_variables=["matn"])

uz_template = ChatPromptTemplate.from_messages([
    ("system", "Classify the sentiment of an Uzbek comment as exactly one "
               "word: ijobiy, neytral, or salbiy. Output nothing else."),
    fs,
    ("human", "{matn}"),
])

print(uz_template.invoke({"matn": "Juda mamnunman"}).messages)
```

> ## 🔑 **NAQSH — 38-MODULDAN:**
> ```
> Sistem ko'rsatmasi  →  INGLIZCHA   (model unga yaxshiroq bo'ysunadi)
> Misollar va yorliqlar →  O'ZBEKCHA  (chiqish sizga kerakli shaklda)
> ```

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Kursning 4-darsdagi yondashuvi nima uchun yomon?

**M2.** `FewShotChatMessagePromptTemplate` ga nima beriladi?

**M3.** Yangi misol qanday qo'shiladi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Har misol uchun **ikkita o'zgaruvchi** — **miqyoslanmaydi**.

**M2.** ## `examples` *(lug'atlar ro'yxati)* + `example_prompt` *(bitta misolning shabloni)*.

**M3.** ## **Ro'yxatga bitta lug'at** qo'shiladi.

</details>

### 🟡 O'rta

**M4.** ⭐ Few-shot shablonini qurib, natijani ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
th = HumanMessagePromptTemplate.from_template("Classify: {matn}")
ta = AIMessagePromptTemplate.from_template("{yorliq}")
ex_t = ChatPromptTemplate.from_messages([th, ta])

examples = [{"matn": "This movie is extraordinary", "yorliq": "positive"},
            {"matn": "This album is all right", "yorliq": "neutral"},
            {"matn": "Could not have been written worse", "yorliq": "negative"}]

fs = FewShotChatMessagePromptTemplate(examples=examples, example_prompt=ex_t,
                                      input_variables=["matn"])
ct = ChatPromptTemplate.from_messages([
    ("system", "Classify sentiment as exactly one word."), fs, th])

for m in ct.invoke({"matn": "This new song blew my mind"}).messages:
    print(f"{m.type:7s}: {m.content}")
```

</details>

**M5.** ⭐ Misollar sonining token narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")

def narx(n_misol):
    fs = FewShotChatMessagePromptTemplate(
        examples=examples[:n_misol], example_prompt=ex_t,
        input_variables=["matn"])
    ct = ChatPromptTemplate.from_messages([("system", "..."), fs, th])
    cv = ct.invoke({"matn": "test"})
    return sum(len(enc.encode(m.content)) + 4 for m in cv.messages)

for n in range(len(examples) + 1):
    print(f"{n} misol → {narx(n):3d} token")
```

## 💡 **HAR MISOL DOIMIY XARAJAT** — u **har chaqiruvda** yuboriladi.

</details>

**M6.** ⭐⭐ Sistem xabari qo'shing va farqni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
OLTIN = [("This new song blew my mind", "positive"),
         ("It was fine, nothing special", "neutral"),
         ("Worst purchase I've ever made", "negative")]

def baho(shablon, nom):
    tog = sum(chat.invoke(shablon.invoke({"matn": m})).content
              .strip().lower() == k for m, k in OLTIN)
    print(f"{nom:34s} {tog}/{len(OLTIN)}")

baho(ChatPromptTemplate.from_messages([fs, th]), "few-shot, sistemsiz")
baho(ChatPromptTemplate.from_messages([
        ("system", "Classify sentiment as exactly one word: "
                   "positive, neutral, or negative."), fs, th]),
     "few-shot + aniq sistem")
```

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ `LengthBasedExampleSelector` ni sinang.

<details>
<summary>✅ Yechim</summary>

```python
from langchain_core.example_selectors import LengthBasedExampleSelector

for lim in [30, 80, 300]:
    sel = LengthBasedExampleSelector(examples=examples,
                                     example_prompt=ex_t, max_length=lim)
    fs2 = FewShotChatMessagePromptTemplate(example_selector=sel,
                                           example_prompt=ex_t)
    ct2 = ChatPromptTemplate.from_messages([fs2, th])
    n = len(ct2.invoke({"matn": "test"}).messages)
    print(f"max_length={lim:3d} → {n} xabar ({(n-1)//2} misol)")
```

## 🔑 **`max_length` — TOKEN EMAS, SO'Z.** Buni **chalkashtirmang**.

</details>

**M8.** ⭐⭐⭐ Misol bazasi sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import tiktoken, pandas as pd

class MisolBazasi:
    """Few-shot misollarni boshqarish, o'lchash va BAHOLASH."""

    def __init__(self, kirish_kalit, chiqish_kalit, enc="o200k_base"):
        self.ki, self.ch = kirish_kalit, chiqish_kalit
        self.misollar = []
        self.enc = tiktoken.get_encoding(enc)

    def qosh(self, kirish, chiqish):
        self.misollar.append({self.ki: kirish, self.ch: chiqish})
        return self

    def shablon(self, sistem, n=None):
        eh = HumanMessagePromptTemplate.from_template("{%s}" % self.ki)
        ea = AIMessagePromptTemplate.from_template("{%s}" % self.ch)
        et = ChatPromptTemplate.from_messages([eh, ea])
        fs = FewShotChatMessagePromptTemplate(
            examples=self.misollar[:n], example_prompt=et,
            input_variables=[self.ki])
        return ChatPromptTemplate.from_messages([("system", sistem), fs, eh])

    def narx(self, sistem, namuna, n=None):
        cv = self.shablon(sistem, n).invoke({self.ki: namuna})
        return sum(len(self.enc.encode(m.content)) + 4 for m in cv.messages)

    def egri_chiziq(self, chat, sistem, oltin):
        """Misollar sonini oshirib, aniqlik va narxni o'lchaydi."""
        q = []
        for n in range(0, len(self.misollar) + 1):
            sh = self.shablon(sistem, n)
            tog = sum(chat.invoke(sh.invoke({self.ki: m})).content
                      .strip().lower() == k for m, k in oltin)
            q.append({"misollar": n, "aniqlik": round(tog/len(oltin), 2),
                      "token": self.narx(sistem, oltin[0][0], n)})
        d = pd.DataFrame(q)
        d["aniqlik/100tok"] = (d.aniqlik / d.token * 100).round(3)
        print(d.to_string(index=False))
        print("\n🏆 EGRI CHIZIQ YASSILANGAN NUQTANI TANLANG — "
              "undan keyingi misollar faqat pul yeydi.")
        return d
```

## 🏆 **`egri_chiziq()` — 34-MODULDAGI "O'RGANISH EGRI CHIZIG'I" NING FEW-SHOT VARIANTI.**

</details>

---

## 📌 Xulosa

```
example_template = ChatPromptTemplate.from_messages([human_t, ai_t])
                                ↓
examples = [{"pet": "dog", "response": "..."}, ...]
                                ↓
few_shot = FewShotChatMessagePromptTemplate(
               examples=..., example_prompt=example_template)
                                ↓
chat_template = ChatPromptTemplate.from_messages([
    ("system", "..."),      ⭐ KURSDA YO'Q — QO'SHING
    few_shot,
    human_t])
```

| | Kurs | Biz qo'shdik |
|---|---|---|
| `FewShotChatMessagePromptTemplate` | ✅ | ✅ *(bugun ham ishlaydi)* |
| Sistem xabari | ## ❌ kodda yo'q | ## ⭐ **qo'shing** |
| `ExampleSelector` | ## ❌ "doiradan tashqari" | ## ⭐ **narx yechimi** |
| Misol soni ↔ aniqlik | ❌ | ✅ **egri chiziq** |
| 🇺🇿 O'zbekcha | ❌ | ✅ **inglizcha sistem + o'zbekcha misol** |

---

⬅️ [6-dars. Chat prompt shablonlari](06-Chat-Prompt-Templates.md) · 🏠 [Modul boshiga](README.md) · ➡️ [40-modul. Chiqish parserlari](../40-LangChain-Output-Parsers/README.md)
