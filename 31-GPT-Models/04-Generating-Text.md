# 4-dars. Matn yaratish

## 🎬 Boshlashdan oldin

> **"GPT dagi G GENERATIV degani ekanini eslaysizmi — chunki u inson kabi matn yarata oladi."**
>
> **"Buni API orqali GPT modelidan foydalanib, matn generatsiyasi uchun ODDIY FUNKSIYA yaratish orqali sinab ko'rishimiz mumkin."**

---

## 1. Prompt nima?

> ## **"PROMPT — bu, mohiyatan, siz modelga beradigan MATN."**
>
> ## **"U model tugallashi kerak bo'lgan JUMLA, javob berish kerak bo'lgan SAVOL yoki amal qilish kerak bo'lgan KO'RSATMALAR TO'PLAMI bo'lishi mumkin."**

```
PROMPT — uch xil bo'lishi mumkin:

  ① TUGALLASH    "Once upon a time"
  ② SAVOL        "When was Google founded?"
  ③ KO'RSATMA    "Translate to French: The book was good"
```

> ## 💡 **3-darsni eslang:** `distilgpt2` faqat ① ni yaxshi bajaradi, `flan-t5` esa ② va ③ ni.

---

## 2. 🎬 Kursdagi kod *(eskirgan)*

> **"Funksiyamizni aniqlaymiz — `generate_text`, va bu funksiyaga kirish bizning promptimiz bo'ladi."**
>
> **"Keyin funksiyamiz ichida OpenAI `Completion.create` funksiyasini chaqirmoqchimiz. Bu yerda ishlatmoqchi bo'lgan modelimizni ko'rsatamiz — bu yerda biz DAVINCI-2 dan foydalanamiz."**

```python
# ❌ ESKIRGAN — bugun ISHLAMAYDI
def generate_text(prompt):
    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=prompt,
        max_tokens=50,
        temperature=0.7,
    )
    return response.choices[0].text.strip()


prompt = "Once upon a time"
generated_text = generate_text(prompt)
print(prompt + generated_text)
```

> ## ❌ **Ikkita sabab bilan ishlamaydi:**
> ```
> ① openai.Completion.create  →  v1.0 da OLIB TASHLANDI
> ② text-davinci-002          →  2024-yil yanvarda YOPILDI
> ```

---

## 3. ✅ Zamonaviy OpenAI kodi

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def matn_yarat(prompt, maks_token=50, temperatura=0.7):
    javob = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=maks_token,
        temperature=temperatura,
    )
    return javob.choices[0].message.content.strip()


print(matn_yarat("Once upon a time"))
```

> ⚠️ **Bu kod API kaliti va PUL talab qiladi.** Keyingi bo'lim — **bepul** muqobil.

---

## 4. ⭐⭐ BEPUL MAHALLIY VERSIYA

Bir xil funksiya, **hech qanday to'lovsiz**:

```python
import warnings; warnings.filterwarnings("ignore")
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

tok = AutoTokenizer.from_pretrained("distilgpt2")
model = AutoModelForCausalLM.from_pretrained("distilgpt2")


def matn_yarat(prompt, maks_token=50, temperatura=None, seed=42):
    """OpenAI generate_text funksiyasining BEPUL mahalliy analogi."""
    torch.manual_seed(seed)
    kirish = tok(prompt, return_tensors="pt")

    kw = dict(max_new_tokens=maks_token, pad_token_id=tok.eos_token_id)
    if temperatura is None:
        kw["do_sample"] = False                 # temperature = 0 ga teng
    else:
        kw.update(do_sample=True, temperature=temperatura, top_k=0)

    with torch.no_grad():
        chiqish = model.generate(**kirish, **kw)
    return tok.decode(chiqish[0], skip_special_tokens=True)


prompt = "Once upon a time"
print(repr(matn_yarat(prompt, maks_token=20)))
```

```
'Once upon a time of war, the United States was the only country in the world to have a military presence. The'
```

> ## 🎯 **BIR NECHA QATOR KODDA — VA PULSIZ.**
>
> ## 💡 **Kursdagi natija ham mukammal emas edi.** O'qituvchi ham aytadi: *"Ravshanki, bu mukammal natija emas"*. Bizniki ham shunday — lekin **g'oya bir xil**.

---

## 5. 🤔 Natijani tahlil qilamiz

```
Prompt:  "Once upon a time"
Natija:  "...of war, the United States was the only country in the world
          to have a military presence. The"
```

> ## 🤔 **"Once upon a time" — ERTAK boshlanishi. Nima uchun model URUSH haqida yozdi?**

### Javob — o'quv ma'lumotida

```
distilgpt2  →  internetdan olingan matn (WebText)
                 ↑
    U yerda "once upon a time" iborasi ko'proq
    TARIXIY/SIYOSIY kontekstda uchragan bo'lishi mumkin,
    ertaklardan ko'ra.

29-MODUL SABOG'I:
    "Ma'lumotda nima bo'lsa — model SHUNI o'rganadi"
```

> ## 🔑 **Bu — kamchilik emas, MA'LUMOTNING KO'ZGUSI.** 27-moduldagi *"Reuters"* shipchasi bilan **bir xil hodisa**.

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Prompt nima?

**M2.** Prompt qanday uch xil bo'lishi mumkin?

**M3.** Kursdagi funksiya nima uchun ishlamaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** Modelga beriladigan **matn** — tugallanadigan jumla, savol yoki ko'rsatma.

**M2.** ① **Tugallash** *("Once upon a time")* · ② **savol** *("When was...?")* · ③ **ko'rsatma** *("Translate to French:")*.

**M3.** `openai.Completion.create` **olib tashlangan** *(v1.0)* va `text-davinci-002` modeli **yopilgan** *(2024-yanvar)*.

</details>

### 🟡 O'rta

**M4.** ⭐ Mahalliy `matn_yarat` funksiyasini yozing va uchta turli promptda sinang.

<details>
<summary>✅ Yechim</summary>

```python
promptlar = [
    "Once upon a time",                          # tugallash
    "The capital of Uzbekistan is",              # fakt
    "Translate English to French: Good morning", # ko'rsatma
]
for p in promptlar:
    print(f">>> {p}")
    print(f"    {matn_yarat(p, maks_token=15)!r}\n")
```

> ## 🔑 **Kutilgan naqsh:**
> ```
> ① tugallash  →  ✅ ishlaydi (bu uning asosiy vazifasi)
> ② fakt       →  ⚠️ ishonchsiz (82M juda kichik)
> ③ ko'rsatma  →  ❌ ISHLAMAYDI (u instruction-tuned EMAS)
> ```
> Ko'rsatmalar uchun `flan-t5` kerak — **3-darsni** eslang.

</details>

**M5.** ⭐ Model nima uchun *"Once upon a time"* ni urush bilan davom ettirdi?

<details>
<summary>✅ Javob</summary>

**O'quv ma'lumoti** tufayli. `distilgpt2` internetdan olingan matnda *(WebText)* o'qitilgan — u yerda bu ibora **ertaklardan ko'ra** boshqa kontekstlarda ko'proq uchragan bo'lishi mumkin.

> ## 🔑 **29-modul saboqi:** *"Ma'lumotda nima bo'lsa — model shuni o'rganadi."*
>
> Bu — 27-moduldagi **"Reuters" shipchasi** bilan bir xil hodisa: model **ma'lumotdagi naqshni** takrorlaydi, "to'g'ri" javobni emas.

</details>

### 🔴 Qiyin

**M6.** ⭐⭐ 🇺🇿 O'zbekcha promptda sinab ko'ring. Natija qanday?

<details>
<summary>✅ Yechim</summary>

```python
uz = [
    "Bir bor ekan, bir yo'q ekan",
    "O'zbekiston poytaxti",
    "Kitob o'qish foydali, chunki",
]
for p in uz:
    print(f">>> {p}")
    print(f"    {matn_yarat(p, maks_token=15)!r}")
    print(f"    tokenlar: {len(tok.encode(p))}\n")
```

> ## ❌ **KUTILGAN NATIJA — YOMON.**
>
> ```
> ① distilgpt2 INGLIZ matnida o'qitilgan  →  o'zbekchani BILMAYDI
> ② Tokenizatsiya matnni MAYDALAYDI       →  30-modul, 5-loyiha
> ③ Natija ma'nosiz yoki inglizchaga o'tib ketadi
> ```
>
> ## 💡 **Bu — 29-modulda o'lchagan 0.500 natijaning davomi.** Kichik ingliz modellari o'zbekchada **ishlamaydi**.
>
> ## ✅ **O'ZBEKCHA UCHUN NIMA ISHLAYDI?**
> ```
> ① KATTA modellar (GPT-4, Claude, Gemini)  →  ✅ yaxshi, lekin PULLIK
> ② Ko'p tilli ochiq modellar (Qwen, mT5)   →  ⚠️ o'rtacha, bepul
> ③ O'Z modelingiz (28-modul uznlp)         →  ✅ aniq vazifa uchun ENG YAXSHI
> ```

</details>

---

## 🧠 O'zini tekshirish savollari

1. Prompt nima?
2. `generate_text` funksiyasi nima qiladi?
3. Kursdagi kodni qanday yangilash kerak?
4. Mahalliy muqobil qaysi model bilan ishlaydi?
5. Model nima uchun kutilmagan natija berdi?

<details>
<summary>✅ Javoblar</summary>

1. Modelga beriladigan **matn** — jumla, savol yoki ko'rsatma.
2. Promptni modelga yuboradi va **yaratilgan matnni** qaytaradi.
3. `client.chat.completions.create(...)` + `messages=[{"role":"user",...}]` + zamonaviy model.
4. ## **`distilgpt2`** *(matn davom ettirish uchun)*.
5. **O'quv ma'lumoti** tufayli — model internetdagi naqshni takrorlaydi.

</details>

---

## 📌 Xulosa

```
PROMPT = modelga beriladigan matn
  ① tugallash  ② savol  ③ ko'rsatma


❌ KURSDAGI KOD
   openai.Completion.create(model="text-davinci-002", ...)
        ↑                          ↑
   OLIB TASHLANDI              YOPILDI (2024-yanvar)

✅ ZAMONAVIY
   client.chat.completions.create(
       model="gpt-4o-mini",
       messages=[{"role":"user","content":prompt}])

⭐ BEPUL MAHALLIY
   model.generate(**tok(prompt, return_tensors="pt"),
                  max_new_tokens=50)


O'LCHANGAN NATIJA
  "Once upon a time"
     →  "...of war, the United States was the only country..."

  🤔 Nima uchun URUSH? →  O'QUV MA'LUMOTI shunday
     (27-moduldagi "Reuters" shipchasi bilan bir xil hodisa)
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Prompt | *prompt* | Modelga beriladigan matn |
| Matn tugallash | *text completion* | Boshlangan matnni davom ettirish |
| `max_tokens` | *max tokens* | Natijaning maksimal uzunligi |
| `generate` | *generate* | Matn yaratish metodi |

---

⬅️ [Oldingi: OpenAI API](03-OpenAI-API.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: GPT natijasini sozlash](05-Customizing-GPT-Output.md)
