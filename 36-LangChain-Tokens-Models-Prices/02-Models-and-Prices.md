# 2-dars. Modellar va narxlar ⭐⭐

## 🎬 Boshlashdan oldin

> **"OpenAI'ning katta til modellari narxlari TOKEN ISTE'MOLIGA asoslanadi. Kirish sifatida beradigan yoki chiqish sifatida talab qiladigan matn qanchalik katta bo'lsa, narx shunchalik oshadi."**

---

## 1. ⚠️ Narxlar — kurs davri va bugun

> **"GPT-4 Omni — OpenAI'ning eng samarali, arzon va ilg'or modeli. Kirish tokenlari uchun million tokenga 5 dollar. Chiqish tokenlari biroz yuqoriroq — million tokenga 15 dollar."**

```
KURS AYTGAN (2024)        →  gpt-4o:  $5 / $15  (kirish / chiqish, 1M token)
```

> ## ⚠️⚠️ **NARXLAR O'ZGARDI — VA SEZILARLI ARZONLASHDI.**
>
> ```
> gpt-4o        →  $2.50 / $10.00      (kursda aytilgandan 2× arzon)
> gpt-4o-mini   →  $0.15 /  $0.60      ⭐ 17× ARZONROQ
> ```
>
> ## 🔑 **NARXLARNI HAR DOIM RASMIY SAHIFADAN TEKSHIRING:** `platform.openai.com/docs/pricing`. Kitobdagi *(shu jumladan bizniki)* raqamlar **eskiradi**.
>
> ## 💡 **NARX TENDENSIYASI — HAR DOIM PASTGA.** LLM narxlari **har yili taxminan 5–10×** arzonlashmoqda. Loyiha rejalashtirayotganda buni **hisobga oling**.

---

## 2. Kirish va chiqish — turlicha narxlanadi

> **"Intuitiv ravishda, kirish tokenlari modelga prompt sifatida uzatiladi. Chiqish tokenlari til modeli tomonidan javob sifatida qaytariladi."**

```
KIRISH (prompt)   →  ARZONROQ    (model faqat O'QIYDI)
CHIQISH (javob)   →  QIMMATROQ   (model YARATADI — har token alohida hisob)
```

| Model | Kirish 1M | Chiqish 1M | Nisbat |
|---|---:|---:|---:|
| `gpt-4o-mini` | ## **$0.15** | ## **$0.60** | 4× |
| `gpt-4o` | $2.50 | $10.00 | 4× |
| `gpt-4-turbo` | $10.00 | $30.00 | 3× |

> ## 🔑 **CHIQISH 3–4× QIMMAT — VA BU LOYIHA QARORLARIGA TA'SIR QILADI:**
> ```
> ✅ ARZON  →  uzun hujjat yuborib, QISQA javob so'rash   (RAG!)
> ❌ QIMMAT →  qisqa prompt berib, UZUN matn yozdirish    (generatsiya)
> ```
>
> ## 💡 **AMALIY MASLAHAT:** promptda **`max_tokens`** ni **doim** belgilang. Usiz model **kutilganidan uzun** javob yozib, byudjetingizni **yeyishi** mumkin.

---

## 3. ⭐⭐ Narxni HISOBLAYMIZ — o'zbekcha ustama bilan

1-darsda o'lchaganimiz: o'zbekcha matn **1.88× ko'proq** token oladi.

```python
import tiktoken, pandas as pd
enc = tiktoken.get_encoding("cl100k_base")

NARX = {"gpt-4o-mini": (0.15, 0.60),
        "gpt-4o":      (2.50, 10.00),
        "gpt-4-turbo": (10.00, 30.00)}
UZ_USTAMA = 1.88                     # 1-darsda O'LCHANGAN

for m, (ki, ch) in NARX.items():
    en_narx = 1000 * (500*ki + 200*ch) / 1e6       # 1000 so'rov
    uz_narx = en_narx * UZ_USTAMA
    print(f"{m:14s} 1000 so'rov: ingliz ${en_narx:6.3f}  "
          f"o'zbek ${uz_narx:6.3f}  (+{(UZ_USTAMA-1)*100:.0f}%)")
```

```
gpt-4o-mini    1000 so'rov: ingliz $ 0.195  o'zbek $ 0.367  (+88%)
gpt-4o         1000 so'rov: ingliz $ 3.250  o'zbek $ 6.117  (+88%)
gpt-4-turbo    1000 so'rov: ingliz $11.000  o'zbek $20.702  (+88%)
```

> ## 💥 **`gpt-4o-mini` va `gpt-4-turbo` ORASIDA 56× FARQ BOR.**
>
> ```
> gpt-4o-mini   $0.367     ← ⭐ o'rganish va prototip uchun
> gpt-4-turbo  $20.702     ← ESKI va QIMMAT, ishlatmang
> ```
>
> ## 🔑 **KURS `gpt-4` NI TAVSIYA QILADI — BU BUGUN NOTO'G'RI.** `gpt-4o-mini` **arzonroq**, **tezroq** va bu kursdagi hamma vazifa uchun **yetarli**.

> ## 🇺🇿 **VA ESLANG — `gpt-4o` OILASI O'ZBEKCHA UCHUN QO'SHIMCHA 12% TEJAYDI** *(1-dars, 5-bo'lim: `o200k` 1.66× vs `cl100k` 1.88×)*. Ya'ni haqiqiy ustama `gpt-4o-mini` uchun **+88% emas, +66%**.

---

## 4. Kontekst oynasi

> **"Biz Uzuklar Hukmdori romani kabi katta narsani til modeliga prompt qila olmaymiz, chunki har bir modelning KONTEKST OYNASI CHEGARASI bor. GPT-4 holatida biz 128 000 tokenlik kontekst oynasi bilan cheklanganmiz — kirish va chiqish tokenlari ORASIDA taqsimlangan."**

```python
n_w_per_token = 0.90          # 1-darsda o'lchangan (inglizcha)
UZ_USTAMA = 1.88

for m, n in [("gpt-4o", 128000), ("gpt-4o-mini", 128000), ("gpt-4", 8192)]:
    en = n * n_w_per_token
    uz = en / UZ_USTAMA
    print(f"{m:14s} {n:>7,} token ≈ {en:>8,.0f} inglizcha so'z "
          f"≈ {uz:>8,.0f} o'zbekcha so'z")
```

```
gpt-4o         128,000 token ≈  115,200 inglizcha so'z ≈   61,211 o'zbekcha so'z
gpt-4o-mini    128,000 token ≈  115,200 inglizcha so'z ≈   61,211 o'zbekcha so'z
gpt-4            8,192 token ≈    7,373 inglizcha so'z ≈    3,918 o'zbekcha so'z
```

> ## 💥 **O'ZBEKCHA MATNDA KONTEKST OYNASI DEYARLI YARIM BARAVAR KICHIK.**
>
> ```
> 128k token  →  115 200 inglizcha so'z   (~460 sahifalik kitob)
>             →   61 211 o'zbekcha so'z   (~245 sahifa)     💥 YARIM!
> ```
>
> ## 🔑 **BU FAQAT NARX MASALASI EMAS — BU IMKONIYAT MASALASI.** O'zbekcha hujjat **ikki baravar tezroq** kontekstga **sig'may qoladi**.
>
> ## ✅ **SHUNING UCHUN RAG SHART** *(42-modul)*: butun hujjatni yuborish o'rniga — **eng mos bo'laklarni** topib yuborasiz.

> ## ⚠️ **`gpt-4` NING 8k OYNASI — BUGUN JUDA KICHIK.** Bu — kurs `gpt-4` ni tavsiya qilishining **yana bir kamchiligi**.

---

## 5. Model tanlashning UCHTA mezoni

> **"Loyihangiz uchun mos til modelini tanlashda hisobga olish kerak bo'lgan bir necha nuqta bor: kirish va chiqish tokenlari narxi, o'qitish ma'lumotining cut-off sanasi va kontekst oynasi chegarasi."**

| Mezon | Nima uchun muhim |
|---|---|
| **Narx** | ## Ishlab chiqarishda **eng katta** xarajat |
| **Cut-off sana** | Model **qachongacha** ma'lumot ko'rgan |
| **Kontekst oynasi** | Bir chaqiruvda **qancha** matn sig'adi |

> ## ⭐⭐ **BIZ TO'RTINCHI VA BESHINCHI MEZONNI QO'SHAMIZ:**
>
> ### ④ TEZLIK *(latency)*
> ```
> gpt-4o-mini   →  ~1 soniya    ⭐ chatbot uchun MUHIM
> gpt-4o        →  ~2–3 soniya
> gpt-4-turbo   →  ~5+ soniya   ❌ foydalanuvchi KUTMAYDI
> ```
>
> ### ⑤ 🇺🇿 TIL QO'LLAB-QUVVATLASHI
> ```
> Tokenizator   →  o'zbekcha necha token oladi?     (1-darsda O'LCHADIK)
> Sifat         →  o'zbekcha javob TO'G'RIMI?       (o'zingiz sinang)
> ```
>
> ## 🔑 **VA OLTINCHI — ENG MUHIMI:**
> ```
> ⑥ MA'LUMOT QAYERGA BORADI?
>    OpenAI API  →  AQSh serverlari
>    Ollama      →  ⭐ SIZNING kompyuteringiz
> ```
> *(35-modul, 2-dars: O'zbekistondagi bank/tibbiy loyihalar uchun bu — **hal qiluvchi**.)*

---

## 6. Embedding modellari

> **"Keyingi navbatda mavjud EMBEDDING MODELLARINI ko'ramiz — matnni uning semantik ma'nosini ifodalovchi raqamli vektorlar sifatida tasvirlaydi. Ro'yxatdagi birinchi embedding modelidan foydalanamiz — text-embedding-3-small."**

| Model | Narx 1M | O'lcham |
|---|---:|---:|
| `text-embedding-3-small` | ## **$0.02** | 1536 |
| `text-embedding-3-large` | $0.13 | 3072 |

> ## 💥 **EMBEDDING JUDA ARZON — CHAT MODELIDAN 7.5× ARZON** *(`$0.02` vs `$0.15`)*.
>
> ## 🔑 **SABAB:** embedding — **bir marta** hisoblanadi va **saqlanadi**. Chat — **har safar** hisoblanadi.
>
> ## 💡 **AMALIY OQIBAT:** RAG'da **hujjatlarni indekslash** deyarli **bepul**. Asosiy xarajat — **javob yaratish**.

> ## ⚠️ **AMMO O'ZBEKCHA UCHUN ALOHIDA SAVOL:** `text-embedding-3-small` o'zbekchani **qanchalik yaxshi** tushunadi?
>
> ## ✅ **BEPUL MUQOBIL — 42-MODULDA KO'RSATAMIZ:**
> ```python
> from langchain_huggingface import HuggingFaceEmbeddings
> emb = HuggingFaceEmbeddings(
>     model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
> ```
> ✅ Bepul · mahalliy · **50 tilda** o'qitilgan.

> ## 💡 **49–51-MODULLAR EMBEDDING VA VEKTOR BAZALARI HAQIDA** — u yerda batafsil ko'ramiz.

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Kirish va chiqish — qaysi biri qimmat?

**M2.** `gpt-4o` ning kontekst oynasi qancha?

**M3.** Model tanlashning uchta mezoni?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## **Chiqish** — 3–4× qimmat, chunki model uni **yaratadi**.

**M2.** ## **128 000 token** — kirish va chiqish **birgalikda**.

**M3.** ## **Narx** · **cut-off sana** · **kontekst oynasi**. *(Biz **tezlik**, **til** va **ma'lumot suvereniteti**ni ham qo'shdik.)*

</details>

### 🟡 O'rta

**M4.** ⭐ Loyihangiz narxini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
def narx(kunlik_sorov, kirish_token, chiqish_token,
         model="gpt-4o-mini", uz=False):
    ki, ch = NARX[model]
    ustama = 1.88 if uz else 1.0
    kunlik = kunlik_sorov * ustama * (kirish_token*ki + chiqish_token*ch) / 1e6
    return {"kunlik": round(kunlik, 4), "oylik": round(kunlik*30, 2),
            "yillik": round(kunlik*365, 2)}

print("inglizcha:", narx(500, 800, 300))
print("o'zbekcha:", narx(500, 800, 300, uz=True))
```

</details>

**M5.** ⭐⭐ Uch modelni narx va tezlik bo'yicha solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
import pandas as pd
MODELLAR = [
    {"model": "gpt-4o-mini", "kir": 0.15, "chi": 0.60,
     "oyna": 128000, "tezlik_s": 1.0},
    {"model": "gpt-4o",      "kir": 2.50, "chi": 10.00,
     "oyna": 128000, "tezlik_s": 2.5},
    {"model": "gpt-4-turbo", "kir": 10.00, "chi": 30.00,
     "oyna": 128000, "tezlik_s": 5.0},
]
d = pd.DataFrame(MODELLAR)
d["1k_sorov_usd"] = (1000*(500*d.kir + 200*d.chi)/1e6).round(3)
d["uz_usd"] = (d["1k_sorov_usd"] * 1.88).round(3)
d["nisbiy_narx"] = (d["1k_sorov_usd"] / d["1k_sorov_usd"].min()).round(1)
print(d.to_string(index=False))
```

## 🔑 **`nisbiy_narx` USTUNIGA QARANG.** `gpt-4-turbo` — **56×** qimmat. Bu farqni **oqlash uchun** sifat **56× yaxshi** bo'lishi kerak — u esa emas.

</details>

**M6.** ⭐ Kontekst oynasiga nima sig'adi?

<details>
<summary>✅ Yechim</summary>

```python
def sigadimi(matn, oyna=128000, javob_uchun=4000, enc=enc):
    t = len(enc.encode(matn))
    qoldiq = oyna - javob_uchun - t
    print(f"matn {t:,} token   javob uchun {javob_uchun:,}   "
          f"qoldiq {qoldiq:,}")
    print("✅ sig'adi" if qoldiq > 0 else "❌ SIG'MAYDI — RAG kerak")
    return qoldiq > 0

sigadimi("Salom dunyo " * 20000)
```

## ⚠️ **`javob_uchun` NI DOIM AJRATING.** Kontekst oynasi kirish **va** chiqish uchun **umumiy**.

</details>

### 🔴 Qiyin

**M7.** ⭐⭐ To'liq byudjet rejalashtiruvchi yozing.

<details>
<summary>✅ Yechim</summary>

```python
class ByudjetRejalashtiruvchi:
    NARX = {"gpt-4o-mini": (0.15, 0.60), "gpt-4o": (2.50, 10.00),
            "text-embedding-3-small": (0.02, 0.0)}

    def __init__(self, enc_nomi="o200k_base"):
        self.enc = tiktoken.get_encoding(enc_nomi)

    def _t(self, s):
        return len(self.enc.encode(s))

    def rag_loyiha(self, hujjatlar_matni, kunlik_sorov,
                   bolak=1000, top_k=4, javob_token=300,
                   chat="gpt-4o-mini", yangilanish_oyda=1):
        # ① indekslash (bir marta + yangilanishlar)
        emb_token = self._t(hujjatlar_matni)
        emb_narx = emb_token / 1e6 * self.NARX["text-embedding-3-small"][0]

        # ② har so'rov
        kirish = top_k * bolak + 120        # bo'laklar + savol + ko'rsatma
        ki, ch = self.NARX[chat]
        sorov_narx = (kirish * ki + javob_token * ch) / 1e6

        oylik_chat = sorov_narx * kunlik_sorov * 30
        oylik_emb = emb_narx * yangilanish_oyda
        return {
            "indekslash_token": emb_token,
            "indekslash_usd": round(emb_narx, 4),
            "1_sorov_usd": round(sorov_narx, 6),
            "oylik_chat_usd": round(oylik_chat, 2),
            "oylik_embedding_usd": round(oylik_emb, 4),
            "oylik_jami_usd": round(oylik_chat + oylik_emb, 2),
        }

b = ByudjetRejalashtiruvchi()
print(b.rag_loyiha("Bank hujjati matni. " * 5000, kunlik_sorov=300))
```

## 🔑 **NATIJAGA E'TIBOR BERING — INDEKSLASH DEYARLI BEPUL.** Butun xarajat **chat chaqiruvlarida**.

## 💡 **BU DEGANI:** hujjatlaringizni **ko'proq** va **mayda** bo'laklang — bu **arzon**. Tejashni **javob uzunligida** qidiring.

</details>

**M8.** ⭐⭐ OpenAI va Ollama'ning **to'liq** narxini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def taqqoslash(kunlik_sorov, yillar=3,
               server_narxi=1200, elektr_oylik=15):
    """Ollama 'bepul' emas — apparat va elektr turadi."""
    openai_oylik = kunlik_sorov * 30 * (800*0.15 + 300*0.60) / 1e6 * 1.88
    openai_jami = openai_oylik * 12 * yillar
    ollama_jami = server_narxi + elektr_oylik * 12 * yillar
    print(f"{kunlik_sorov:6d} so'rov/kun, {yillar} yil:")
    print(f"   OpenAI  ${openai_jami:9,.0f}")
    print(f"   Ollama  ${ollama_jami:9,.0f}  (server ${server_narxi} + elektr)")
    print(f"   → {'OLLAMA' if ollama_jami < openai_jami else 'OPENAI'} arzonroq\n")

for n in [100, 1000, 10000, 100000]:
    taqqoslash(n)
```

## 🔑 **TENGLASHUV NUQTASINI TOPING.** Kichik hajmda OpenAI **arzon**, katta hajmda **Ollama**.

## ⚠️ **VA HISOBGA OLINMAGAN OMILLAR:**
```
Ollama  →  + dasturchi vaqti (sozlash, kuzatuv)
        →  + sifat pastroq  →  ko'proq xato  →  qo'shimcha xarajat
        →  ⭐ + MA'LUMOT CHIQMAYDI  ←  ba'zan BAHOLAB BO'LMAYDI
```

</details>

**M9.** ⭐⭐⭐ Narx nazorati qatlamini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class NarxNazorat:
    """Har chaqiruvni hisoblaydi va CHEGARADAN oshsa TO'XTATADI."""

    def __init__(self, model, kunlik_limit_usd=5.0,
                 narx=(0.15, 0.60), enc="o200k_base"):
        self.model = model
        self.limit = kunlik_limit_usd
        self.ki_1m, self.ch_1m = narx
        self.enc = tiktoken.get_encoding(enc)
        self.sarflangan = 0.0
        self.jurnal = []

    def _narx(self, kirish, chiqish):
        return (kirish*self.ki_1m + chiqish*self.ch_1m) / 1e6

    def invoke(self, prompt, max_tokens=400):
        kir = len(self.enc.encode(prompt))
        taxmin = self._narx(kir, max_tokens)
        if self.sarflangan + taxmin > self.limit:
            raise RuntimeError(
                f"💥 KUNLIK LIMIT: ${self.sarflangan:.4f} + ${taxmin:.4f} "
                f"> ${self.limit}")
        javob = self.model.invoke(prompt)
        chi = len(self.enc.encode(javob.content))
        haqiqiy = self._narx(kir, chi)
        self.sarflangan += haqiqiy
        self.jurnal.append({"kirish": kir, "chiqish": chi,
                            "usd": round(haqiqiy, 6),
                            "jami": round(self.sarflangan, 6)})
        return javob

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print(f"\nJAMI ${self.sarflangan:.4f} / ${self.limit}  "
              f"({self.sarflangan/self.limit:.0%})")
```

## 🏆 **HAR ISHLAB CHIQARISH LOYIHASIGA SHU QATLAMNI QO'YING.**

## 💥 **HAQIQIY HODISA:** cheksiz siklga tushgan agent bir kechada **yuzlab dollar** sarflashi mumkin. `max_iterations` **va** narx limiti — **ikkalasi ham** kerak.

</details>

---

## 🧠 O'zini tekshirish

<details>
<summary>❓ Nima uchun chiqish qimmat?</summary>

Model uni **yaratadi** — har token uchun **alohida** to'liq forward-pass. Kirish esa **parallel** o'qiladi.
</details>

<details>
<summary>❓ Kontekst oynasi o'zbekchada qancha?</summary>

`128k` token ≈ **115 200 inglizcha** so'z ≈ **61 211 o'zbekcha** so'z — deyarli **yarim baravar kichik**.
</details>

<details>
<summary>❓ Kurs `gpt-4` ni tavsiya qiladi. To'g'rimi?</summary>

**Bugun yo'q.** `gpt-4` ning oynasi **8k** *(kichik)*, narxi **yuqori**, tezligi **past**. `gpt-4o-mini` — **56× arzon** va o'zbekcha uchun **tokenizatori ham yaxshiroq**.
</details>

---

## 📌 Xulosa

```
NARX = kirish_token × kirish_narx  +  chiqish_token × chiqish_narx
                                       ↑
                                  3–4× QIMMAT
```

| Model | Kirish 1M | Chiqish 1M | 1000 so'rov 🇺🇿 | Nisbiy |
|---|---:|---:|---:|---:|
| ## `gpt-4o-mini` | ## **$0.15** | ## **$0.60** | ## **$0.37** | ## **1×** |
| `gpt-4o` | $2.50 | $10.00 | $6.12 | 17× |
| `gpt-4-turbo` | $10.00 | $30.00 | $20.70 | ## **56×** |
| `text-embedding-3-small` | $0.02 | — | — | ## **0.13×** |

```
🇺🇿 O'ZBEKCHA USTAMA:  +88%  (cl100k)   ·   +66%  (o200k, gpt-4o) ⭐

KONTEKST OYNASI:
   128k token  →  115 200 inglizcha so'z
               →   61 211 o'zbekcha so'z     💥 YARIM
```

> ## 🏆 **UCHTA QAROR:**
> ```
> ① gpt-4o-mini ni tanlang         (gpt-4 EMAS)
> ② max_tokens ni DOIM belgilang   (chiqish qimmat)
> ③ narx nazorati qatlamini qo'ying (agent siklga tushishi mumkin)
> ```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| Kontekst oynasi | Context window | Bir chaqiruvda **sig'adigan** token |
| Cut-off sana | Knowledge cut-off | Model **qachongacha** ma'lumot ko'rgan |
| Kechikish | Latency | Javob kutish **vaqti** |
| Embedding | Embedding | Matnning **raqamli vektori** |
| Narx nazorati | Rate/cost limiting | Xarajatni **chegaralash** |

---

⬅️ [1-dars. Tokenlar](01-Tokens.md) · 🏠 [Modul boshiga](README.md) · ➡️ [37-modul. Muhitni sozlash](../37-LangChain-Setting-Up-Environment/README.md)
