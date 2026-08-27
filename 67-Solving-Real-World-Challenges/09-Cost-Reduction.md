# 9-dars. Xarajatni kamaytirish ⭐⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs sakkizta strategiya beradi va oltitasi KIRISHGA qaratilgan. Biz hammasini o'lchadik — va kutilmagan narsa chiqdi: narxning 78% i CHIQISH tokenlaridan. Kirishni 3 barobar qisqartirish jami narxni atigi 1.2 barobar tushirdi."**

---

## 1. Sakkizta strategiya — **umumiy ko'rinish**

| # | Strategiya | ## O'lchandimi |
|---|---|---|
| ① | Foydalanuvchi kirishini cheklash | ## ✅ **66-modul** |
| ② | ## **Promptni qisqartirish** | ## ⚠️ **38% token, jami narxda 1.0×** |
| ③ | ## **Xotirani optimallashtirish** | ## ⚠️ **64% token, jami narxda 1.2×** |
| ④ | ## **Kichik ixtisoslashgan modellar** | ## 🏆 **16.7× — ENG KATTA TA'SIR** |
| ⑤ | ## **Javoblarni keshlash** | ## 🏆 **57% tejash** |
| ⑥ | Fine-tuning | ⚠️ o'lchanmagan |
| ⑦ | RAG | ⚠️ o'lchanmagan |
| ⑧ | Batch + erta to'xtash | ## ✅ **o'lchandi** |

---

## 2. ⭐ ① Kirishni cheklash

> *"Foydalanuvchi kiritgan har bir belgi tokenga aylanadi... Kirish maydonlariga **belgi chegarasi** qo'yamiz."*

> ## ✅ **66-MODULDA O'LCHAGAN EDIK:** ## `st.chat_input(max_chars=50)` ga **200 belgi o'tdi**. ## ## 🔑 Ya'ni chegara **kodda** bo'lishi shart.

> ## 💡 **VA KURS YANA BIR NARSANI TO'G'RI AYTADI:** ## *"Bu token sarfini kamaytiradi **va** ## prompt injection dan himoya qiladi"*. ## ## ⭐ **Bitta chora — ikkita foyda.**

---

## 3. 🏆 ② Promptni qisqartirish

Kursning misoli:

```
UZUN:  "Can you please assist the user with any issues they might be
        experiencing with our software product, including troubleshooting
        steps, explanations of features, and any other relevant information
        that might help them resolve their problem."

QISQA: "You are a helpful tool that assists users with software issues.
        Provide troubleshooting steps and explanations of features to
        resolve the problems."
```

### ✅ Haqiqiy natija

```
uzun : 39 tok
qisqa: 24 tok
tejash: 15 tok (38%)

💰 1 mln so'rovda (gpt-4o kirish $2.50/1M):
   uzun : $   97.50
   qisqa: $   60.00
   tejaldi: $   37.50
```

> ## 🏆 **38% — VA MAZMUN O'ZGARMADI.**

> ## 💡 **VA 8-DARSDAGI TOPILMANI ESLANG:** ## Humanizer **6 marta** chaqiriladi. ## ## ⭐ Uning promptini 15 token qisqartirish — ## **90 token** tejash *(bitta intervyuga)*.

> ## ⚠️ **CHEGARA BOR:** ## promptni **haddan tashqari** qisqartirsangiz, ## sifat tushadi. ## ## 🔑 **64-modulda o'lchagan edik:** ## eng qisqa prompt (`v1`, 5 token) — **0.71**, ## few-shot (`v5`, 70 token) — ## 🏆 **0.85**. ## ## ⭐ Ya'ni **qisqalik — maqsad emas**, ## **ortiqchani olib tashlash** — maqsad.

---

## 4. 🏆 ③ Xotirani optimallashtirish

Kurs LangChain ning uchta sinfini sanaydi:

| Sinf | Nima qiladi | Narx |
|---|---|---|
| `ConversationBufferMemory` | Butun tarix | ## 💥 **eng qimmat** |
| `ConversationSummaryBufferMemory` | Eskisini **siqadi** | o'rtacha |
| ## `ConversationBufferWindowMemory` | ## Oxirgi **k** ta | ## 🏆 **eng arzon** |

### ✅ Haqiqiy natija

| Strategiya | 6 savol | 20 savol |
|---|---|---|
| ## buffer *(butun tarix)* | ## 💥 **1 968** | ## 💥 **18 320** |
| summary buffer | 908 | 3 120 |
| window k=2 | 1 128 | 3 956 |
| ## **window k=1** *(kursniki)* | ## 🏆 **708** | ## 🏆 **2 360** |

```
6 savolda: buffer 1,968 -> window k=1 708  (64% tejash)
20 savolda: buffer 18,320 -> window k=1 2,360  (87% tejash)
```

> ## ✅ **KURS HAQ:** ## *"Bizning ilovamizda **buffer window** usuli ## chegarasi **2** bilan eng yaxshi ishladi"*.
>
> ## ## 🔑 **VA E'TIBOR BERING — SUHBAT UZAYGAN SAYIN ## FARQ KATTALASHADI:** ## 64% → 87%.

### ⚠️ Lekin xotira **cheklash — yo'qotish** ham

| | Nima yo'qoladi |
|---|---|
| `window k=1` | ## 💥 3-savoldagi ma'lumot **6-savolda yo'q** |
| `summary` | ## ⚠️ Tafsilotlar **siqilib ketadi** |
| `buffer` | ## ✅ Hech narsa |

> ## 💡 **KURSNING ILOVASIDA BU MUAMMO EMAS,** ## chunki har savol **mustaqil**. ## ## 💥 **Lekin qo'llab-quvvatlash botida** ## foydalanuvchi *"yuqorida aytganimdek..."* desa — ## ⭐ **model bilmaydi**.

---

## 5. ✅ ④ Kichik ixtisoslashgan modellar

Kursning misoli — e-commerce yordam xizmati:

| Vazifa | Kurs tavsiyasi | Nega |
|---|---|---|
| Mahsulot tavsiyasi | ## ⭐ **kichik** | Suhbat kam |
| Shikoyatlarni qayta ishlash | ## ⭐ **kichik** | Oddiy almashinuv |
| ## **FAQ chatbot** | ## **katta** | ## Suhbat **ko'p** |

### 💰 O'lchaymiz

1 500 token kirish + 300 token chiqish:

| Model | 1 so'rov | 1 mln so'rov |
|---|---|---|
| `gpt-4o` | $0.006750 | ## 💥 **$6 750.00** |
| ## `gpt-4o-mini` | ## $0.000405 | ## 🏆 **$405.00** |
| Mahalliy | $0 | ## ⭐ **$0** *(+ server)* |

```
nisbat: 16.7x
```

> ## 🏆 **16.7× — VA BU FAQAT NARX.**
>
> ## ## ⚠️ **SIFAT FARQI VAZIFAGA BOG'LIQ:** ## 64-modulda ko'rdik — ## `Qwen2.5-0.5B` (494 mln) ham ## **HR savol berishni** uddaladi. ## ## 💥 Lekin 5-darsda ko'rdik — ## u **JSON massiv** yozolmadi.

> ## 💡 **AMALIY QOIDA:** ## ## ⭐ **struktura → katta model,** ## ## ⭐ **matn → kichik model yetarli.**

---

## 6. 🏆 ⑤ Javoblarni keshlash

```python
import hashlib


class Kesh:
    def __init__(self):
        self.d = {}
        self.hit = self.miss = 0

    def _k(self, s):
        return hashlib.sha256(s.strip().lower().encode()).hexdigest()[:16]

    def ol(self, savol, hisobla):
        k = self._k(savol)
        if k in self.d:
            self.hit += 1
            return self.d[k], True
        self.miss += 1
        v = hisobla(savol)
        self.d[k] = v
        return v, False
```

### ✅ Haqiqiy natija

```
LLM  'What is your return policy?'
KESH 'what is your return policy?'          ← ⭐ kichik harf
KESH '  What is your RETURN policy?  '      ← ⭐ probellar
LLM  'How do I reset my password?'
KESH 'What is your return policy?'
KESH 'How do I reset my password?'
LLM  'Where is my order?'

hit=4  miss=3  LLM chaqiruvlari=3
⭐ 7 so'rov -> 3 chaqiruv (57% tejash)
```

> ## 🏆🏆 **57% — VA `strip().lower()` TUFAYLI ## UCHTA TURLI YOZUV BIR XIL KALIT BO'LDI.**

### ⚠️ Kesh **qachon ishlamaydi**

| Holat | Nega |
|---|---|
| ## **Shaxsiylashtirilgan javob** | ## 💥 Har foydalanuvchi **boshqacha** |
| Vaqtga bog'liq | ## 💥 *"Buyurtmam qayerda?"* |
| ## **Bizning intervyu ilovamiz** | ## 💥 Har savol **noyob** |

> ## 🔑 **KURS BUNI TO'G'RI CHEKLAGAN:** ## *"tez-tez beriladigan savollar"* uchun. ## ## ⚠️ **Ace Interview da kesh deyarli foydasiz** — ## har intervyu **noyob**.

### ⭐ Lekin bitta joyda **juda foydali**

```python
@kesh_qil
def mb_xulosasi(mb_nomi):
    """4-darsdagi 216 tokenli xulosa — HAR SAFAR bir xil."""
    return xulosa_yasa(...)
```

> ## 🏆 **MB XULOSASI — 10 000 INTERVYUDA BIR XIL.** ## ⭐ Uni **bir marta** hisoblab, keshlab qo'yish mumkin.

---

## 7. ⚠️ ⑥ Fine-tuning va ⑦ RAG

> ## ⚠️ **BULARNI O'LCHAY OLMADIK** — ## ikkalasi ham **API kaliti** yoki ## **katta hisoblash resursi** talab qiladi.

### Kurs nima aytadi

| | Fine-tuning | RAG |
|---|---|---|
| Nima qiladi | Modelni **o'rgatadi** | Kerakli hujjatni **topadi** |
| Token tejaydi | ⭐ prompt qisqaradi | ⭐ hammasini yubormaydi |
| Boshlang'ich narx | ## 💥 **yuqori** | o'rtacha |
| Qachon | Barqaror, tor vazifa | ## ⭐ **Katta bilim bazasi** |

> ## 💡 **VA BIZ 4-DARSDA RAG NING SODDA SHAKLINI QURDIK:** ## butun MB ni yuborish o'rniga ## ⭐ **216 tokenli xulosa**. ## ## 🔑 Bu — *"kerakli qismini top va yubor"* — ## RAG ning asosiy g'oyasi.

---

## 8. ✅ ⑧ Batch va **erta to'xtash**

### Erta to'xtash — **o'lchaymiz**

```python
o = p(msgs, max_new_tokens=N, do_sample=False)
```

| `max_new_tokens` | Chiqish | Vaqt |
|---|---|---|
| 400 | to'liq | 100% |
| 150 | ## ⚠️ **kesilishi mumkin** | ~40% |

> ## 💥 **VA 5-DARSDA BUNI KO'RDIK:** ## yumshoq parser **6 emas, 5 ta** savol topdi — ## oxirgisi `max_new_tokens` bilan **kesilgan**.
>
> ## ## ⚠️ **YA'NI ERTA TO'XTASH — TEJASH, LEKIN XAVF HAM.**

### ✅ To'g'ri yo'l — **`stop` ketma-ketligi**

```python
r = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=msgs,
    max_tokens=300,
    stop=["\n\n\n", "</json>"])      # ⭐ KERAKLI joyda to'xtaydi
```

> ## 🏆 **`max_tokens` — QO'POL CHEGARA,** ## `stop` — ## ⭐ **aniq to'xtash nuqtasi**.

---

## 9. 🏆 Hammasi birga — **qancha tejaladi?**

6 savolli intervyu, har javob 300 token chiqish:

```
   qadam                                      tokenlar     narx    tejash
   ------------------------------------------------------------------------
   boshlang'ich (butun tarix, uzun prompt)      1,998 tok  $0.02300   1.0x
   + prompt qisqartirildi                       1,908 tok  $0.02277   1.0x
   + xotira oynasi                                648 tok  $0.01962   1.2x
   + gpt-4o -> gpt-4o-mini                        648 tok  $0.00118  19.5x

   10 000 intervyu: $229.95 -> $11.77
```

> ## 🔧 **MEN "≈ 46 BAROBAR" DEB KUTGAN EDIM — ## HAQIQIY RAQAM 19.5×.**

### 💥💥 Va eng kutilmagan natija

> ## 💥 **PROMPTNI QISQARTIRISH — JAMI NARXGA DEYARLI TA'SIR QILMADI** ## *(1.0×)*. ## ## 💥 **XOTIRA OYNASI HAM ATIGI 1.2× BERDI,** ## garchi u **tokenlarni 3× kamaytirgan** bo'lsa ham ## *(1 908 → 648)*.

### 🔑 Sabab — **chiqish tokeni qimmatroq**

| | `gpt-4o` narxi |
|---|---|
| Kirish | $2.50 / 1M |
| ## **Chiqish** | ## 💥 **$10.00 / 1M — 4× qimmat** |

```
boshlang'ich taqsimot:
  kirish : 1,998 tok x $2.50 = $0.0050   (22%)
  chiqish: 1,800 tok x $10.0 = $0.0180   (78%)   <- 💥 HUKMRON
```

> ## 🏆🏆 **VA MANA ENG MUHIM XULOSA:** ## kirishni optimallashtirish ## ⭐ **narxning atigi 22% iga** ta'sir qiladi.
>
> ## ## 🔑 **KATTA TA'SIR IKKI JOYDA:** ## ① **modelni almashtirish** *(16.7×)*, ## ② **chiqish uzunligini** kamaytirish.

> ## ⚠️ **KURS SAKKIZTA STRATEGIYADAN ## OLTITASINI KIRISHGA BAG'ISHLAYDI.** ## ## ⭐ O'lchov ko'rsatadiki, ## **eng katta tutqich — model tanlovi**.

> ## 💡 **LEKIN KIRISHNI OPTIMALLASHTIRISH BARIBIR KERAK:** ## ① u **kontekst chegarasidan** oshib ketmaslikni ta'minlaydi ## *(4-dars: 128 791 token — oyna 128 000)*, ## ② va **kechikishni** kamaytiradi.

---

## 🎯 Nazorat savollari

1. Promptni qisqartirish qancha tejadi?
2. Qaysi xotira strategiyasi eng arzon va nimani yo'qotadi?
3. Keshlash Ace Interview da foydalimi?
4. `max_tokens` va `stop` farqi nima?
5. Qaysi ikki strategiya o'lchanmadi va nega?
6. Nega kirishni optimallashtirish kutilganidan kam ta'sir qildi?

<details>
<summary>Javoblar</summary>

1. ## **38%** *(39 → 24 token)*. 💰 1 mln so'rovda **$37.50**. ⚠️ Lekin haddan tashqari qisqartirmang — 64-modulda few-shot (70 token) eng **yuqori sifat** bergan edi.
2. ## **`window k=1`** — 6 savolda **64%**, 20 savolda **87%** tejaydi. 💥 Yo'qotadigani: 3-savoldagi ma'lumot 6-savolda **mavjud emas**.
3. ## **Deyarli yo'q** — har intervyu **noyob**. ⭐ Lekin **MB xulosasi** *(4-dars, 216 token)* har intervyuda **bir xil** — uni keshlash foydali.
4. ## `max_tokens` — **qo'pol chegara** *(matn o'rtada kesiladi)*, `stop` — **aniq to'xtash nuqtasi**. 💥 5-darsda ko'rdik: `max_new_tokens` 6 emas, **5 ta** savol qoldirdi.
5. ## **Fine-tuning va RAG** — ikkalasi ham **API kaliti** yoki **katta hisoblash resursi** talab qiladi. ⭐ Lekin 4-darsda RAG ning sodda shaklini qurdik: MB ning **216 tokenli xulosasi**.
6. ## **Chiqish tokeni — 4× qimmat** (`gpt-4o`: kirish $2.50, chiqish $10.00). 💥 O'lchandi: boshlang'ich narxning **78%** i chiqishdan. ⭐ Shuning uchun **model tanlovi** (16.7×) kirishni optimallashtirishdan (1.2×) **ancha kuchli**.

</details>

---

⬅️ [8-dars](08-Counting-Tokens.md) · 🏠 [Modul](README.md) · ➡️ [10-dars](10-Scaling.md)
