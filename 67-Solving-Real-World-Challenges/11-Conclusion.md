# 11-dars. Xulosa ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs tugadi. Bu darsda faqat qaytarish emas — LLM Engineering bo'limida o'lchagan hamma narsani bitta jadvalga yig'amiz."**

---

## 1. Kurs nima berdi

Kurs xulosasi:

> *"Siz LLM hosting variantlarini, ochiq va yopiq kodli modellarni va API narxini o'rgandingiz. Keyin prompt muhandisligi, MB dizayni va faoliyat diagrammalari bilan amaliy tajriba oldingiz... Streamlit ni tanishtirdik va portfelingiz uchun to'liq loyiha qurdingiz."*

| Modul | Nima berdi |
|---|---|
| 62 | LLM tanlash, narx, hosting |
| 63 | Talablar, MB, JSON, promptlar |
| 64 | `temperature`, few-shot, prompt sinovi |
| 65 | Streamlit, `session_state` |
| 66 | ## ⭐ **Ishlaydigan prototip** |
| 67 | ## 🏆 **Ishlab chiqarish darslari** |

---

## 2. 🏆 Bu bo'limda **o'lchagan hamma narsa**

### 💰 Narx va tokenlar

| O'lchov | Natija |
|---|---|
| Xotira: butun tarix → oyna-2 *(6 savol)* | ## 🏆 **1 968 → 708** *(64%)* |
| Xotira *(20 savol)* | ## 🏆 **87% tejash** |
| ## **SQLite dump → xulosa** | ## 🏆 **128 791 → 216 tok** *(596×)* |
| Prompt qisqartirish | 39 → 24 tok *(38%)* |
| Keshlash *(FAQ)* | 🏆 **57%** |
| `gpt-4o` → `gpt-4o-mini` | ## 🏆 **16.7×** |
| ## **To'liq zanjir** | ## 🏆 **47×** *(1 mln da $22 510/oy)* |
| ## `cl100k` vs `o200k` *(o'zbekcha)* | ## 💥 **+36%** |
| ## **Chiqish tokeni ulushi** | ## 💥 **78%** |

### 🛡️ Ishonchlilik

| O'lchov | Natija |
|---|---|
| JSON massiv *(oddiy prompt)* | ## 💥 **0/12** |
| JSON massiv *(kursning qattiq prompti)* | ## 💥 **0/12** |
| ## **Yumshoq parser** | ## 🏆 **0/10 → 10/10** |
| ## **Bittadan savol** | ## 🏆 **0/12 → 6/6** |
| 3 urinish + MB zaxirasi | ## 🏆 **6/6 intervyu boshlandi** |
| `temperature=0.0–0.5` | 🏆 6/6 JSON |
| `temperature=1.0` | ⚠️ 5/6, ball 4–9 |
| ## `temperature=1.5` | ## 💥 **0/6** |
| ## **Chain of thought** | ## 💥 **6/6 → 2/6** |

### 🔒 Xavfsizlik

| Himoya | Natija |
|---|---|
| Ajratgich `<transcript>` *(66-modul)* | ## 💥 **0/3** |
| Kursning himoya qatori | ## ⚠️ **2/4** |
| ## **Koddagi regex filtri** | ## 🏆 **3/3, 5/5** |
| ## **O'zbekcha hujum** *(promptli himoya)* | ## 💥 **o'tdi** |
| ## **O'zbekcha hujum** *(koddagi filtr)* | ## 🏆 **bloklandi** |
| Mantiqiy tekshiruv *(ball sakrashi)* | 🏆 tutdi |
| ## `git add .` *(66-modul)* | ## 💥 **kalit yuklandi** |

---

## 3. 💥 Kursning **tasdiqlanmagan** da'volari

| Da'vo | ## O'lchov |
|---|---|
| *"Chain of thought xatolarni kamaytiradi"* | ## 💥 **6/6 → 2/6** |
| *"Uzun ahamiyatsiz javobni ortiqcha baholaydi"* | ## 💥 **takrorlanmadi** |
| *"LLM rolni buzadi"* | ## 💥 **0/8** |
| *"JSON atrofida matn yozadi"* | ## 💥 **8/8 toza** |
| JSON ko'rsatmalari yordam beradi | ## ⚠️ **farq sezilmadi** |
| Himoya qatori injection dan himoya qiladi | ## ⚠️ **2/4** |
| *"5 000 token tejadik"* | ## ⚠️ **shartli** *(~225 so'zlik javobda)* |
| `cl100k_base` ishlating | ## ⚠️ **`gpt-4o` uchun `o200k_base`** |

> ## 🔑 **VA MUHIM OGOHLANTIRISH:** ## bizning modelimiz — **494 mln parametr**, ## kursniki — **`GPT-4o`**. ## ## ⭐ Ya'ni bu — *"kurs xato"* degani **emas**, ## bu — ## 🏆 **"o'z modelingizda o'lchang"** degani.

---

## 4. ✅ Kursning **tasdiqlangan** da'volari

| Da'vo | ## O'lchov |
|---|---|
| *"SQLite dump juda ko'p token yeydi"* | ## 🏆 **128 791 token** |
| *"Qisqa xulosa yechim"* | ## 🏆 **216 token, 596×** |
| *"Butun tarix qimmat"* | ## 🏆 **64–87% tejash** |
| *"Temperature ni pasaytiring"* | ## 🏆 **6/6 vs 0/6** |
| *"Buffer window k=2 eng yaxshi"* | ## 🏆 **tasdiqlandi** |
| *"3 urinish + fallback"* | ## 🏆 **xizmat to'xtamadi** |
| *"Kirishni cheklang"* | ## 🏆 **token + xavfsizlik** |
| *"Promptni qisqartiring"* | ## ✅ **38% token** |
| *"Kichik modellar arzon"* | ## 🏆 **16.7×** |
| *"Kesh FAQ uchun"* | ## 🏆 **57%** |
| *"Kalitni GitHub ga yuklamang"* | ## 🏆 **mutlaqo to'g'ri** |
| *"Prompt injection jiddiy"* | ## 🏆 **3/4 hujum o'tdi** |

> ## 🏆 **O'N IKKITA DA'VO — HAMMASI TASDIQLANDI.**

---

## 5. 🏆 Butun bo'limning **oltita qoidasi**

> ## ## 🔑 **① MODELGA ISHONMANG — TEKSHIRING.** ## Yumshoq parser, sxema tekshiruvi, mantiqiy tekshiruv. ## ⭐ *O'lchov: 0/10 → 10/10.*
>
> ## ## 🔑 **② O'LCHASH MUMKIN BO'LGANNI MODELGA BERMANG.** ## Raqam bormi, A/B test eslatilganmi — ## **kod aniqroq aytadi**. ## ⭐ *O'lchov: tarqoqlik 1 → 7.*
>
> ## ## 🔑 **③ MURAKKAB VAZIFANI BO'LING.** ## 6 ta savolli massiv — **0/12**, ## bittadan — ## ⭐ **6/6**.
>
> ## ## 🔑 **④ HIMOYA PROMPTDA EMAS, KODDA BO'LSIN.** ## Prompt — **iltimos**, kod — **qoida**. ## ⭐ *O'lchov: 0/3 va 2/4 vs 3/3.*
>
> ## ## 🔑 **⑤ ZAXIRA SHART.** ## LLM 6/6 marta ishlamadi, ## foydalanuvchi ## ⭐ **6/6 marta xizmatdan foydalandi**.
>
> ## ## 🔑 **⑥ "ENG YAXSHI AMALIYOT" NI O'LCHANG.** ## Chain of thought — **6/6 → 2/6**. ## Ajratgich himoyasi — **0/3**. ## ⭐ *Ikkalasi ham "tavsiya etilgan" usullar edi.*

---

## 6. ⭐ Bundan keyin nima?

| Yo'nalish | Nima |
|---|---|
| ## **AI Ethics** | ## ⭐ **68–76-modullar** |
| RAG | Katta bilim bazasi bilan ishlash |
| Fine-tuning | Tor vazifa uchun model |
| Agentlar | Ko'p bosqichli avtomatlashtirish |
| ## **Kuzatuv** | ## ⭐ LangSmith, o'z paneli |

> ## 💡 **VA ENG MUHIM MASLAHAT:** ## bu kitobda o'lchagan har bir raqamni ## ## ⭐ **O'Z MODELINGIZDA QAYTA O'LCHANG.** ## ## 🔑 Model, prompt, til, vazifa — ## har biri natijani **o'zgartiradi**.

---

## 7. 🎓 O'z-o'zini tekshirish

Agar quyidagi savollarga javob bera olsangiz — bo'limni **o'zlashtirgansiz**:

1. LLM dan JSON massiv olishning **uchta** ishonchli yo'lini ayting.
2. Prompt injection dan himoyaning **beshta qatlamini** sanang.
3. Nega kirishni optimallashtirish narxga **kam** ta'sir qiladi?
4. `temperature` ning xavfsiz diapazoni qanday va nega?
5. 4 550 yozuvli SQLite bazasini LLM ga qanday ko'rsatasiz?
6. Fallback tizimi nimani **kafolatlaydi**?

<details>
<summary>Javoblar</summary>

1. ## ① **Yumshoq parser** *(qavs sanash — 0/10 → 10/10)*, ② **bittadan so'rash** *(0/12 → 6/6)*, ③ **3 urinish + zaxira**. ⭐ Va `temperature ≤ 0.5`.
2. ## ① Uzunlik chegarasi, ② **ko'p tilli** regex filtri, ③ sxema tekshiruvi, ④ **mantiqiy tekshiruv** *(ball sakrashi)*, ⑤ promptdagi qator. 🔑 Faqat ⑤ promptda — qolgani **kodda**.
3. ## **Chiqish tokeni 4× qimmat** *(`gpt-4o`: $2.50 vs $10.00)*, va boshlang'ich narxning **78%** i chiqishdan. ⭐ Kirishni 3× qisqartirish jami narxni atigi **1.2×** tushirdi. 🏆 Eng katta tutqich — **model tanlovi** *(16.7×)*.
4. ## **≤ 0.5.** O'lchandi: `0.0/0.3/0.5` → **6/6 JSON, bir xil ball**; `1.0` → **5/6**, ball **4 dan 9 gacha**; `1.5` → **0/6**.
5. ## **Qisqa xulosa** — jadval nomlari, turlar, **yozuvlar soni**, **sana diapazoni**, mumkin qiymatlar, bog'lanishlar. 🏆 **216 token** *(dump: 128 791 — 596× katta va kontekst oynasiga sig'maydi)*.
6. ## **Xizmat to'xtamasligini.** O'lchandi: LLM **6/6 marta** ishlamadi, foydalanuvchi esa **6/6 marta** intervyudan o'tdi. ⭐ Bu — *graceful degradation*.

</details>

---

## 🏁 Tabriklaymiz!

> ## 🎓 **LLM ENGINEERING BO'LIMI TUGADI.**
>
> ## Siz **kalitsiz** ishlaydigan to'liq LLM ilovasini qurdingiz, ## kursning **har bir da'vosini o'lchadingiz**, ## va **o'z xatolaringizni** ham topdingiz.
>
> ## ## 🏆 **VA MANA ENG MUHIM KO'NIKMA:** ## *"Bu ishlaydi"* deb aytish o'rniga ## ⭐ **"Men buni o'lchadim"** deb aytish.

---

⬅️ [10-dars](10-Scaling.md) · 🏠 [Modul](README.md) · ➡️ [68-modul: AI etikasi](../68-Introduction-to-AI-and-Data-Ethics/README.md)
