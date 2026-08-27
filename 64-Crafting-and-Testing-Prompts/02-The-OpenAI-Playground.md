# 2-dars. OpenAI Playground va model sozlamalari ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs aytadi: `temperature=2` da model o'qib bo'lmaydigan matn beradi. Biz o'lchadik — ASCII belgilar 100% dan 69.7% ga tushdi, va chiqishda ruscha va xitoycha so'zlar paydo bo'ldi."**

---

## 1. Playground nima?

**OpenAI Playground** — brauzerdagi sinov muhiti: kod yozmasdan model va parametrlarni sinash.

> ## ✅ **KURS MUHIM GAPNI AYTADI:** ## *"Tizim promptini sinashda **ChatGPT emas, Playground** ishlating — ## chunki Playground **API kabi** ishlaydi."*
>
> ## ## 🔑 **NEGA MUHIM?** ## ChatGPT ning **o'z yashirin tizim prompti** bor. ## Sizning promptingiz uning **ustiga** qo'shiladi. ## ## 💥 **Natija — API dagidan boshqacha.**

### ⚠️ Lekin Playground ham **kalit talab qiladi**

| Muhit | Kalit | Bizning yo'l |
|---|---|---|
| Playground | ## 💥 **kerak** | — |
| API | ## 💥 **kerak** | — |
| ## **Mahalliy model** | ## ✅ **kerak emas** | ## ⭐ **shuni ishlatamiz** |

> ## 🏆 **BARCHA PARAMETRLAR MAHALLIY MODELDA HAM BOR.** ## Nomlari biroz boshqacha, lekin **ma'nosi bir xil**.

| OpenAI | `transformers` |
|---|---|
| `temperature` | `temperature` |
| `top_p` | `top_p` |
| `max_tokens` | `max_new_tokens` |
| `stop` | `stop_strings` |
| `frequency_penalty` | `repetition_penalty` |
| `presence_penalty` | *(to'g'ridan-to'g'ri yo'q)* |

---

## 2. 🔬 `temperature` — kursning da'vosini tekshiramiz

> ## 🔑 **KURS AYTADI:** ## *"Agar temperaturani maksimalga oshirsangiz, ## model **o'qib bo'lmaydigan** natija berishi mumkin. ## Shuning uchun uni **2 dan past** saqlang."*

```python
import torch
from transformers import pipeline

llm = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct",
               device=-1, dtype="auto")

SAVOL = "Tell me about a typical day for a data scientist."

for t in [0.0, 0.3, 0.7, 1.0, 1.5, 2.0]:
    torch.manual_seed(0)
    gk = {"do_sample": t > 0}
    if t > 0:
        gk.update({"temperature": t, "top_p": 1.0, "top_k": 0})
    txt = gen(SAVOL, **gk)
    w = txt.split()
    ascii_ = sum(1 for c in txt if ord(c) < 128) / len(txt)
    print(f"{t:.1f}  noyob {len(set(w))/len(w)*100:.1f}%  "
          f"ASCII {ascii_*100:.1f}%  {txt[:44]!r}")
```

### 📊 Natija

| `temperature` | Noyob so'z | ## ASCII | O'rt. so'z uzunligi | Namuna |
|---|---|---|---|---|
| ## **0.0** | 78.5% | ## ✅ **100.0%** | 4.48 | `'A typical day for a data scientist can vary '` |
| 0.3 | 81.2% | ✅ 100.0% | 4.23 | `'A typical day for a data scientist can vary '` |
| 0.7 | 89.2% | ✅ 100.0% | 5.16 | `'Data scientists have a typical workday that '` |
| 1.0 | 83.1% | ✅ 100.0% | 5.21 | `'Data scientists have a typical workday that '` |
| ## **1.5** | 100.0% | ## ⚠️ **86.3%** | 8.53 | `'Data scientists develop custom solutions by '` |
| ## **2.0** | 100.0% | ## 💥 **69.7%** | ## 💥 **12.74** | ## 💥 `'Data culture меняключения истории Д deform品尝'` |

> ## 💥💥💥 **KURS HAQ — VA BIZ BUNI SON BILAN KO'RSATDIK.**
>
> ## `temperature=2.0` da: ## **ASCII 69.7%** *(ruscha, xitoycha so'zlar)*, ## **noyob so'zlar 100%** *(hech narsa takrorlanmaydi)*, ## **o'rtacha so'z uzunligi 12.74** *(normal 4.48)*.

### 🔑 Uchta o'lchov — uchta signal

| O'lchov | Normal | Buzilgan | Nima ko'rsatadi |
|---|---|---|---|
| ## **ASCII ulushi** | 100% | ## 💥 **69.7%** | Boshqa alifbolar aralashuvi |
| Noyob so'zlar | 78–89% | 100% | Hech narsa takrorlanmaydi = **tasodifiy** |
| ## **So'z uzunligi** | 4.2–5.2 | ## 💥 **12.74** | So'zlar **yopishib** ketgan |

> ## ⭐ **VA `1.5` DAN BOSHLAB BUZILISH KO'RINADI** *(ASCII 86.3%)*. ## ## 🏆 **AMALIY QOIDA: `temperature ≤ 1.2`.**

---

## 3. ⭐⭐ `temperature` va takrorlanuvchanlik

```
for t in [0.0, 0.3, 0.7, 1.0, 1.5]:
    h = set()
    for i in range(5):
        torch.manual_seed(i)          # ⚠️ har safar BOSHQA urug'
        h.add(hash(gen(SAVOL, temperature=t, ...)))
    print(f"temperature={t}: {len(h)}/5 turli natija")
```

```
temperature=0.0: 1/5 turli natija      ⭐ DETERMINISTIK
temperature=0.3: 5/5 turli natija
temperature=0.7: 5/5 turli natija
temperature=1.0: 5/5 turli natija
temperature=1.5: 5/5 turli natija
```

> ## 💥💥 **`temperature=0.3` DA HAM — 5/5 TURLI NATIJA.**
>
> ## ## 🔧 **MEN "0.3 DA DEYARLI BARQAROR" DEB KUTGAN EDIM.** ## Haqiqat: **har qanday `temperature > 0`** ## turli urug' bilan **turli natija** beradi.
>
> ## ## 🔑 **FAQAT `temperature=0` DETERMINISTIK** ## *(aslida `do_sample=False`)*.

> ## ⚠️ **VA BU — 60-MODULDAGI WHISPER XULOSASINI TAKRORLAYDI:** ## tasodifiylik **modeldan emas, DEKODLASHDAN** keladi.

---

## 4. 🔬 `top_p` — "ro'yxat uzunligi"

> ## 🔑 **KURS TUSHUNTIRADI:** ## *"`temperature` model ro'yxatdan **qanday tasodifiy** tanlashini belgilaydi, ## `top_p` esa **ro'yxat qanchalik uzun** bo'lishini."*

```
   "The sky is ___"

   top_p = 1.0  →  [blue, clear, falling, purple, angry, banana, ...]  hammasi
   top_p = 0.6  →  [blue, clear, falling]                              qisqartirilgan
   top_p = 0.1  →  [blue]                                              faqat bittasi
```

### 🔬 O'lchaymiz *(`temperature=1.0` doimiy)*

```python
for tp in [0.1, 0.3, 0.6, 0.9, 1.0]:
    h = set()
    for i in range(5):
        torch.manual_seed(i)
        h.add(hash(gen(SAVOL, temperature=1.0, top_p=tp, top_k=0)))
    print(f"top_p={tp}: {len(h)}/5 turli natija")
```

```
top_p=0.1: 1/5 turli natija      ⭐ DETERMINISTIK — temperature=1.0 bo'lsa ham!
top_p=0.3: 4/5 turli natija
top_p=0.6: 5/5 turli natija
top_p=0.9: 5/5 turli natija
top_p=1.0: 5/5 turli natija
```

> ## 🏆🏆 **KURSNING TUSHUNTIRISHI TASDIQLANDI.**
>
> ## `top_p=0.1` da **`temperature=1.0` bo'lsa ham** natija **deterministik** — ## chunki ro'yxatda **faqat bitta token** qoladi.
>
> ## ## 🔑 **YA'NI `top_p` — QATTIQROQ NAZORAT.**

| Nima kerak | Sozlama |
|---|---|
| To'liq barqarorlik | ## ⭐ **`temperature=0`** |
| Barqaror, lekin biroz o'zgaruvchan | `top_p=0.1–0.3` |
| Muvozanat | `temp=0.7, top_p=0.9` |
| Ijodiy | `temp=1.0–1.2, top_p=1.0` |
| ## Buzilgan | ## 💥 **`temp ≥ 1.5`** |

---

## 5. ⭐ Qolgan parametrlar

| Parametr | Nima qiladi | Amaliy maslahat |
|---|---|---|
| ## `max_tokens` | Chiqish uzunligi chegarasi | ## ⭐ **HAR DOIM qo'ying** |
| `stop` | Ko'rsatilgan qatorda **to'xtaydi** | Format nazorati uchun |
| `frequency_penalty` | Takrorlanishni **kamaytiradi** | 0.0–0.5 |
| `presence_penalty` | Yangi mavzularga **undaydi** | 0.0–0.5 |
| `seed` *(OpenAI)* | Takrorlanuvchanlik | ## ⚠️ **kafolat emas** |

### 💥 `max_tokens` — eng ko'p unutiladigan parametr

```
   max_tokens SIZ:
     · javob 4 000 token bo'lishi mumkin
     · narx 4× oshadi  (chiqish qimmat!)
     · kechikish 4× oshadi
     · foydalanuvchi 20 soniya kutadi

   max_tokens = 150:
     · javob qisqa va aniq
     · narx bashoratli
     ⚠️ lekin javob YARIM KESILISHI mumkin
```

> ## ⭐ **YECHIM:** `max_tokens` + promptda **uzunlik ko'rsatmasi**: ## *"Answer in at most 3 sentences."*

### ⚠️ `stop` haqida nozik gap

```python
# ❌ XATO — stop ketma-ketligi CHIQISHDA QOLMAYDI
gen(..., stop=["\n\n"])         # javob "\n\n" gacha keladi, o'zi YO'Q

# ✅ Agar ajratgich kerak bo'lsa, uni O'ZINGIZ qo'shing
javob = gen(..., stop=["\n\n"]) + "\n\n"
```

---

## 🎯 Nazorat savollari

1. Nega ChatGPT emas, Playground ishlatish kerak?
2. `temperature=2` da nima bo'ladi? Uch o'lchov bilan ayting.
3. `temperature=0.3` deterministikmi?
4. `top_p=0.1` va `temperature=1.0` — natija qanday bo'ladi?
5. `max_tokens` ni unutsangiz nima bo'ladi?

<details>
<summary>Javoblar</summary>

1. ChatGPT ning **o'z yashirin tizim prompti** bor — sizning promptingiz uning **ustiga** qo'shiladi. Playground esa **API kabi** ishlaydi.
2. ## **ASCII 100% → 69.7%** *(ruscha/xitoycha so'zlar)*, **noyob so'zlar 100%** *(hech narsa takrorlanmaydi)*, **o'rtacha so'z uzunligi 4.48 → 12.74**. ⚠️ Buzilish **`1.5` dan** boshlanadi (ASCII 86.3%).
3. ## **Yo'q.** 5/5 turli natija. **Faqat `temperature=0`** deterministik (1/5). Men bu yerda **xato kutgan edim**.
4. ## **Deterministik** (1/5) — `temperature=1.0` bo'lsa ham. Chunki `top_p=0.1` ro'yxatni **bitta tokengacha** qisqartiradi. ## **`top_p` — qattiqroq nazorat.**
5. Javob **4 000 token** bo'lishi mumkin → **narx 4×**, **kechikish 4×**, foydalanuvchi **20 soniya kutadi**. Yechim: `max_tokens` + promptda uzunlik ko'rsatmasi.

</details>

---

⬅️ [1-dars](01-Adding-Funds.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-Optimizing-Temperature-and-Top-P.md)
