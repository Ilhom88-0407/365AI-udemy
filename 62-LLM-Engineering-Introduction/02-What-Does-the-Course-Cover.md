# 2-dars. Kurs nimalarni qamrab oladi ⭐

## 🎬 Boshlashdan oldin

> **"Kurs OpenAI API ni talab qiladi — pullik. Biz mahalliy modelni sinadik: 494 M parametr, 3.1 soniyada yuklandi, 0.8 soniyada javob berdi. Kalitsiz, bepul, offline."**

---

## 1. Kursning yo'l xaritasi

```
   ┌────────────────────────────────────────────────────────────┐
   │  ① REJALASHTIRISH  (63-modul)                              │
   │     · hosting vs API                                       │
   │     · ochiq vs yopiq kodli modellar                        │
   │     · tokenlar va narx                                     │
   │     · MB sxemasi + faoliyat diagrammasi                    │
   └────────────────────────┬───────────────────────────────────┘
                            ↓
   ┌────────────────────────────────────────────────────────────┐
   │  ② PROTOTIP  (64–66-modullar)                              │
   │     · model sozlamalari (temperature, top_p)               │
   │     · prompt muhandisligi                                  │
   │     · Streamlit                                            │
   │     · GitHub + deploy                                      │
   └────────────────────────┬───────────────────────────────────┘
                            ↓
   ┌────────────────────────────────────────────────────────────┐
   │  ③ ILG'OR  (67-modul)                                      │
   │     · gallyutsinatsiya                                     │
   │     · prompt injection                                     │
   │     · token sanash, narxni kamaytirish, masshtablash       │
   └────────────────────────────────────────────────────────────┘
```

> ## ✅ **BU TUZILISH — TO'G'RI.** ## *Rejalashtirish → prototip → ilg'or* — ## bu **haqiqiy** dasturiy ta'minot ishlab chiqish tartibi.

---

## 2. 💥 Lekin bitta to'siq bor: **OpenAI API pullik**

| Kursning talabi | Narx |
|---|---|
| OpenAI hisobi | ## ⚠️ **hisobga pul qo'shish** |
| Minimal to'ldirish | ## 💥 **$5** *(qaytarilmaydi)* |
| Bank kartasi | ## ⚠️ **xalqaro karta kerak** |

> ## 💥 **VA BU — O'ZBEKISTONDAN O'RGANAYOTGAN KO'PCHILIK UCHUN TO'SIQ.**
>
> ## ## 🏆 **SHUNING UCHUN BIZ IKKI YO'LNI KO'RSATAMIZ.**

---

## 3. 🏆🏆 Kalitsiz yo'l — **mahalliy model**

56–60-modullarda Whisper ni mahalliy ishlatgan edik. **LLM ham xuddi shunday**:

```python
import time
from transformers import pipeline

M = "Qwen/Qwen2.5-0.5B-Instruct"

t0 = time.perf_counter()
llm = pipeline("text-generation", model=M, device=-1, dtype="auto")
print(f"yuklash: {time.perf_counter()-t0:.1f} s")
print(f"parametrlar: {sum(x.numel() for x in llm.model.parameters())/1e6:.0f} M")

msgs = [
    {"role": "system",
     "content": "You are an HR interviewer for a Data Scientist role. "
                "Ask exactly one question."},
    {"role": "user", "content": "Let's start the interview."},
]
t0 = time.perf_counter()
o = llm(msgs, max_new_tokens=60, do_sample=False)
print(f"generatsiya: {time.perf_counter()-t0:.1f} s")
print(o[0]["generated_text"][-1]["content"])
```

### ✅ Haqiqiy natija

```
yuklash: 3.1 s
parametrlar: 494 M
generatsiya: 0.8 s
Great! What specific aspect of data science would you like to discuss in detail?
```

> ## 🏆🏆 **ISHLADI. KALITSIZ. BEPUL. OFFLINE.**
>
> ## ## ⭐ **494 M PARAMETR** — Whisper `small` dan (241.7 M) ikki barobar katta, ## lekin **oddiy noutbukda** ishlaydi.

### ⚠️ Lekin **halol** bo'laylik

| | GPT-4o | ## Qwen2.5-0.5B |
|---|---|---|
| Parametrlar | ~1 000 000 M *(taxminiy)* | ## **494 M** |
| Sifat | ## 🏆 **yuqori** | ## ⚠️ **oddiy** |
| Narx | ## 💥 **token bo'yicha** | ## 🏆 **0** |
| Internet | ## 💥 **shart** | ## 🏆 **kerak emas** |
| Maxfiylik | ## 💥 **ma'lumot ketadi** | ## 🏆 **hech qayerga** |
| Kechikish | 1–3 s *(tarmoq)* | ## ⭐ **0.8 s** |
| ## O'zbek tili | ## ⭐ **yaxshi** | ## 💥 **zaif** |

> ## 💥 **YUQORIDAGI JAVOBGA E'TIBOR BERING:** ## *"What specific aspect of data science would you like to discuss?"* ## ## ⚠️ Bu — **intervyu savoli emas**. ## Model *"bitta savol ber"* buyrug'ini bajardi, ## lekin **HR intervyusi rolini tushunmadi**.
>
> ## ## 🔑 **VA BU — 64-MODULNING BUTUN MAVZUSI:** ## **prompt muhandisligi kichik modellarda MUHIMROQ.**

---

## 4. ⭐ Ikki yo'lning taqqoslanishi

| Nima o'rganamiz | Kalitsiz yo'l | OpenAI yo'li |
|---|---|---|
| Prompt tuzilishi | ## ✅ **bir xil** | ✅ |
| `temperature`, `top_p` | ## ✅ **bir xil** | ✅ |
| Token sanash | ## ✅ **`tiktoken`** | ✅ |
| Narx hisoblash | ## ✅ **simulyatsiya** | ✅ real |
| Streamlit | ## ✅ **bir xil** | ✅ |
| Suhbat xotirasi | ## ✅ **bir xil** | ✅ |
| Prompt injection | ## ✅ **bir xil** | ✅ |
| Gallyutsinatsiya | ## ⭐ **kichik modelda KO'PROQ** | ✅ |
| Javob sifati | ## 💥 **pastroq** | ## 🏆 **yuqori** |

> ## 🏆 **ARXITEKTURA — BIR XIL.** ## Kodni keyinchalik OpenAI ga o'tkazish — ## **uch qator o'zgarish**.

### ⭐ Va biz shunday yozamiz

```python
class LLMAdapter:
    """Bitta interfeys — ikkita orqa tomon.

    Kod O'ZGARMAYDI, faqat `backend` almashadi.
    """

    def __init__(self, backend="mahalliy", model=None, api_key=None):
        self.backend = backend
        if backend == "mahalliy":
            from transformers import pipeline
            self.model = model or "Qwen/Qwen2.5-0.5B-Instruct"
            self._p = pipeline("text-generation", model=self.model,
                               device=-1, dtype="auto")
        elif backend == "openai":
            from openai import OpenAI
            self.model = model or "gpt-4o-mini"
            self._c = OpenAI(api_key=api_key)      # ⚠️ kalit kerak
        else:
            raise ValueError(f"noma'lum backend: {backend}")

    def javob(self, xabarlar, max_tokens=200, temperature=0.0):
        if self.backend == "mahalliy":
            o = self._p(xabarlar, max_new_tokens=max_tokens,
                        do_sample=temperature > 0,
                        temperature=temperature if temperature > 0 else None)
            return o[0]["generated_text"][-1]["content"].strip()
        r = self._c.chat.completions.create(
            model=self.model, messages=xabarlar,
            max_tokens=max_tokens, temperature=temperature)
        return r.choices[0].message.content.strip()
```

```python
llm = LLMAdapter("mahalliy")             # ⭐ kalitsiz
# llm = LLMAdapter("openai", api_key="sk-...")   # kalit bilan

print(llm.javob([
    {"role": "system", "content": "Siz HR mutaxassisisiz."},
    {"role": "user", "content": "Salom!"},
]))
```

```
Sizhi salom! Qaysiz mumkin?
```

> ## 💥💥 **VA MANA — O'ZBEK TILIDAGI HAQIQIY NATIJA.**
>
> ## `"Sizhi salom! Qaysiz mumkin?"` — ## bu **o'zbekcha emas**. ## Model o'zbekcha so'zlarni **taniydi**, ## lekin **grammatikani bilmaydi**.
>
> ## ## 🔑 **SABAB — 1-DARSDA O'LCHAGANIMIZ:** ## o'zbekcha matn **2.30× ko'proq token** oladi, ## ya'ni model uni **bo'lak-bo'lak** ko'radi. ## Va o'quv ma'lumotida o'zbek tili **juda kam**.
>
> ## ⭐ **AMALIY XULOSA:** ## **kichik mahalliy model bilan — INGLIZ TILIDA ishlang.** ## O'zbekcha interfeys kerak bo'lsa — ## **tarjima qatlamini alohida** qo'ying.

> ## 🏆 **BIR XIL KOD — IKKITA ORQA TOMON.** ## ## ⭐ Bu — **Adapter** naqshi, va u ## LLM loyihalarida **eng foydali** naqshlardan biri.
>
> ## ## 💡 **NEGA?** ## Modellar **tez o'zgaradi**. ## Bugun GPT-4o, ertaga boshqasi. ## Adapter bilan — **bitta fayl** o'zgaradi.

---

## 5. ⚠️ Kurs nimani o'rgatmaydi

| Mavzu | Nega muhim |
|---|---|
| ## **Testlash** | LLM javoblarini qanday **avtomatik** tekshirish? |
| ## **Versiyalash** | Prompt o'zgarsa, natija o'zgaradi — **qanday kuzatish?** |
| ## **Baholash** *(eval)* | Yangi prompt **yaxshiroqmi**? Qanday bilasiz? |
| **Kuzatuv** *(observability)* | Ishlab chiqarishda nima bo'layapti? |
| **Fallback** | Model ishlamasa nima bo'ladi? |
| ## **Ma'lumot maxfiyligi** | Foydalanuvchi rezyumesi **qayerga ketadi**? |

> ## 🔑 **BULARNING BARCHASI — "ISHLAYDIGAN PROTOTIP" DAN ## "ISHLAB CHIQARISH TIZIMI" GA O'TISHDA KERAK.**
>
> ## ## ⭐ **BIZ ULARNI 64–67-MODULLARGA QO'SHAMIZ.**

---

## 🎯 Nazorat savollari

1. Kurs qanday uch bosqichga bo'lingan?
2. Mahalliy model qancha vaqtda yuklandi va javob berdi?
3. Mahalliy modelning birinchi javobida qanday muammo bor edi?
4. `LLMAdapter` naqshi nega foydali?
5. Kurs qaysi muhim mavzularni o'rgatmaydi?

<details>
<summary>Javoblar</summary>

1. **Rejalashtirish** (63) → **Prototip** (64–66) → **Ilg'or** (67). Bu — to'g'ri dasturiy ta'minot ishlab chiqish tartibi.
2. `Qwen2.5-0.5B-Instruct` (**494 M** parametr): yuklash **3.1 s**, generatsiya **0.8 s**. Kalitsiz, bepul, offline.
3. Javob *"What specific aspect of data science would you like to discuss?"* — bu **intervyu savoli emas**. Model *"bitta savol ber"* buyrug'ini bajardi, lekin **HR intervyusi rolini tushunmadi**. Kichik modellarda **prompt muhandisligi muhimroq**.
4. **Modellar tez o'zgaradi.** Adapter bilan orqa tomonni almashtirish — **bitta fayl** o'zgarishi. Qolgan kod **tegilmaydi**.
5. **Testlash, versiyalash, baholash (eval), kuzatuv, fallback, ma'lumot maxfiyligi.** Bularsiz prototip **ishlab chiqarish tizimiga** aylanmaydi.

</details>

---

⬅️ [1-dars](01-Introduction-to-the-Course.md) · 🏠 [Modul](README.md) · ➡️ [3-dars](03-The-Interview-Tools-Specifics.md)
