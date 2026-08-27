# 10-dars. Masshtablash ⭐⭐⭐

## 🎬 Boshlashdan oldin

> **"Kurs TPM va RPM chegaralari haqida gapiradi. Biz ularni taqlid qiluvchi token bucket qurdik — va 'TPM yetarli, lekin RPM tugagan' holatini ko'rdik."**

---

## 1. API chegaralari

| Chegara | Ma'nosi |
|---|---|
| ## **TPM** | ## Daqiqasiga **token** |
| ## **RPM** | ## Daqiqasiga **so'rov** |
| RPD | Kuniga so'rov |
| IPM | Daqiqasiga rasm |
| Batch queue | Navbat hajmi |

> ## 🔑 **KURS AYTADI:** ## *"Bu cheklovlar suiiste'molning oldini olish va ## barcha foydalanuvchilar uchun **adolatli kirish** uchun."*

> ## ⚠️ **VA YANA BIR CHEGARA BOR — PUL:** ## hisobingizdagi mablag' ## **sarflay oladigan miqdorni** cheklaydi.

### ⭐ Tier tizimi

> *"Hozirda **oltita** tier bor... OpenAI API dagi sarfingiz oshgani sayin siz avtomatik keyingi tierga o'tasiz."*

| | Nima o'zgaradi |
|---|---|
| Tier ↑ | ## ⭐ **TPM va RPM oshadi** |
| Tier ↓ | — *(avtomatik tushmaydi)* |

---

## 2. 🔬 Token bucket — chegarani **taqlid qilamiz**

```python
class TokenBucket:
    """OpenAI TPM/RPM chegarasini mahalliy taqlid qiladi."""

    def __init__(self, tpm, rpm):
        self.tpm, self.rpm = tpm, rpm
        self.tokens, self.sorovlar = tpm, rpm
        self.vaqt = 0.0

    def _tikla(self, hozir):
        """Vaqt o'tgani sayin chelak TO'LADI."""
        dt = hozir - self.vaqt
        self.tokens = min(self.tpm, self.tokens + self.tpm * dt / 60)
        self.sorovlar = min(self.rpm, self.sorovlar + self.rpm * dt / 60)
        self.vaqt = hozir

    def sora(self, n_tok, hozir):
        self._tikla(hozir)
        if self.sorovlar < 1:
            return False, "RPM chegarasi"
        if self.tokens < n_tok:
            return False, "TPM chegarasi"
        self.tokens -= n_tok
        self.sorovlar -= 1
        return True, "ok"
```

### ✅ Haqiqiy natija — `TPM=10 000, RPM=5`

```
so'rov 1: ✅ ok  (qolgan: 8,000 tok, 4.0 so'rov)
so'rov 2: ✅ ok  (qolgan: 6,000 tok, 3.0 so'rov)
so'rov 3: ✅ ok  (qolgan: 4,000 tok, 2.0 so'rov)
so'rov 4: ✅ ok  (qolgan: 2,000 tok, 1.0 so'rov)
so'rov 5: ✅ ok  (qolgan: 0 tok, 0.0 so'rov)
so'rov 6: 💥 RPM chegarasi
so'rov 7: 💥 RPM chegarasi
so'rov 8: 💥 RPM chegarasi

30 soniyadan keyin:
so'rov 1: ✅ ok  (qolgan: 3,000 tok)
so'rov 2: ✅ ok  (qolgan: 1,000 tok)
so'rov 3: 💥 RPM chegarasi
```

> ## 🏆 **CHELAK 30 SONIYADA YARIM TO'LDI** — ## `5 000` token, `2.5` so'rov.
>
> ## ## 💥 **VA E'TIBOR BERING — UCHINCHI SO'ROV ## `RPM` SABABLI RAD ETILDI,** ## garchi **1 000 token** qolgan bo'lsa ham.

> ## 🔑 **YA'NI IKKITA CHEGARA MUSTAQIL:** ## sizda token bo'lishi mumkin, ## **so'rov esa yo'q**.
>
> ## ## ⭐ **AMALIY XULOSA:** ## agar sizda **ko'p kichik so'rov** bo'lsa — ## **RPM** to'sqinlik qiladi. ## Ko'p **katta** so'rov bo'lsa — **TPM**.

---

## 3. 🔧 Chegara bilan **to'g'ri ishlash**

```python
import time
import random


def qayta_urin(f, max_urinish=5, asos=1.0, maksimal=30.0):
    """Eksponensial kutish + tasodifiy siljish (jitter)."""
    for k in range(max_urinish):
        try:
            return f()
        except RateLimitError as e:
            if k == max_urinish - 1:
                raise
            kutish = min(maksimal, asos * (2 ** k))
            kutish += random.uniform(0, kutish * 0.25)     # ⭐ JITTER
            time.sleep(kutish)
```

| Urinish | Kutish |
|---|---|
| 1 | ~1.0 s |
| 2 | ~2.0 s |
| 3 | ~4.0 s |
| 4 | ~8.0 s |
| 5 | ~16.0 s |

> ## ⭐ **NEGA `jitter` KERAK?** ## Agar 1 000 mijoz **bir vaqtda** xato olsa ## va **aynan** 2 soniya kutsa — ## 💥 ular **yana bir vaqtda** urinadi. ## ## 🏆 Tasodifiy siljish **to'lqinni yoyadi**.

> ## ⚠️ **VA `Retry-After` SARLAVHASINI HURMAT QILING** — ## agar server aytsa, ## **o'z formulangizdan ustun** qo'ying.

---

## 4. ⭐ Gorizontal va vertikal masshtablash

| | Gorizontal *(scale out)* | Vertikal *(scale up)* |
|---|---|---|
| Nima | ## ⭐ **Ko'proq server** | Kuchliroq server |
| Yaxshi tomoni | ## 🏆 **Bittasi ishlamasa — qolganlari ishlaydi** | Arxitektura o'zgarmaydi |
| Cheklov | ## ⚠️ Murakkab | ## 💥 **Bitta mashinaning chegarasi bor** |
| Qachon | Ko'p bir vaqtli so'rov | Bashorat qilinadigan yuk |

> ## 💡 **KURS TO'G'RI AYTADI:** ## *"Vertikal masshtablashning **maksimal quvvati** bor, ## undan keyin **gorizontal** kerak."*

### ⭐ Va OpenAI API bilan — bu **muammo emas**

> ## 🏆 **API ISHLATSANGIZ, INFRATUZILMA — OpenAI DA.** ## Siz faqat ## ⭐ **tier** va **chegaralar** bilan ishlaysiz.
>
> ## ## 💥 **O'Z MODELINGIZNI HOSTLASANGIZ:** ## GPU, xotira, navbat, monitoring — ## **hammasi sizda**.

---

## 5. 💰 Masshtab — **narx jadvali**

Bitta intervyu: **1 558 token**, `gpt-4o-mini` *(8-darsda o'lchangan)*

```
optimallashtirilgan  : 1,558 tok  $0.000485/intervyu   (gpt-4o-mini, oyna-2)
optimallashtirilmagan: 3,798 tok  $0.022995/intervyu   (gpt-4o, butun tarix)
nisbat: 47x
```

| Foydalanuvchilar/oy | Tokenlar | ## Optimal | Optimalsiz |
|---|---|---|---|
| 1 000 | 1.56 mln | ## ⭐ **$0.48** | $23.00 |
| 10 000 | 15.58 mln | ## **$4.85** | $229.95 |
| 100 000 | 155.80 mln | ## **$48.48** | $2 299.50 |
| ## **1 mln** | ## **1.56 mlrd** | ## 🏆 **$484.80** | ## 💥 **$22 995.00** |

> ## 🏆🏆🏆 **1 MLN FOYDALANUVCHIDA — ## $22 510 TEJASH, HAR OY.**
>
> ## ## ⭐ **VA E'TIBOR BERING — 1 000 FOYDALANUVCHIDA ## FARQ ATIGI $22.50.** ## 🔑 Ya'ni **prototipda optimallashtirmaslik — to'g'ri qaror**; ## masshtabda esa — ## 💥 **hayotiy zarurat**.

---

## 6. ⚠️ Kurs aytmagan uchta narsa

### ① Bir vaqtda ishlash — **bir foydalanuvchiga chegara**

```python
from collections import defaultdict


class FoydalanuvchiChegarasi:
    """Bitta foydalanuvchi butun kvotani yeb qo'ymasin."""

    def __init__(self, kunlik=5):
        self.kunlik = kunlik
        self.hisob = defaultdict(int)

    def mumkinmi(self, foydalanuvchi_id):
        if self.hisob[foydalanuvchi_id] >= self.kunlik:
            return False, f"kunlik chegara: {self.kunlik}"
        self.hisob[foydalanuvchi_id] += 1
        return True, "ok"
```

> ## 🔑 **7-DARS BILAN BOG'LIQ:** ## hujumchi **1 000 ta intervyu** boshlab, ## sizni ## 💥 **pulsiz qoldirishi** mumkin.

### ② Kutish — **foydalanuvchiga ko'rsating**

> ## ⚠️ **KURS O'ZI AYTADI:** ## *"Baholovchi eng ko'p ma'lumotni qayta ishlaydi, ## shuning uchun oxirgi savol bilan fikr-mulohaza orasida ## **uzoqroq yuklash** bor."*
>
> ## ## ⭐ **YECHIM — `st.spinner` yoki progress:** ## foydalanuvchi **kutayotganini bilsin**.

### ③ Zaxira model

```python
MODELLAR = ["gpt-4o-mini", "gpt-4o", "mahalliy"]

for m in MODELLAR:
    try:
        return chaqir(m, msgs)
    except (RateLimitError, APIError):
        continue                     # ⭐ keyingisiga o'tamiz
raise RuntimeError("💥 hamma model ishlamadi")
```

> ## 🏆 **5-DARSDAGI FALLBACK G'OYASINING TAKRORI** — ## endi **model darajasida**.

---

## 🎯 Nazorat savollari

1. TPM va RPM farqi nima?
2. Nega `jitter` kerak?
3. Gorizontal masshtablashning asosiy afzalligi nima?
4. 1 mln foydalanuvchida optimallashtirish qancha tejaydi?
5. Bir foydalanuvchiga chegara nega kerak?

<details>
<summary>Javoblar</summary>

1. ## **TPM — daqiqasiga token**, **RPM — daqiqasiga so'rov.** ⭐ Ular **mustaqil**: o'lchandi — 1 000 token qolgan, lekin so'rov **rad etildi** (RPM tugagan). 🔑 Ko'p kichik so'rov → RPM to'sadi; ko'p katta so'rov → TPM.
2. ## 1 000 mijoz bir vaqtda xato olib, **aynan bir xil** kutsa — ular **yana bir vaqtda** urinadi. ⭐ Tasodifiy siljish to'lqinni **yoyadi**.
3. ## **Xatolarga chidamlilik** — bitta server ishlamasa, qolganlari **ishlashda davom etadi**. ⚠️ Vertikal masshtablashning **maksimal quvvati** bor.
4. ## **$22 510/oy** *($22 995 → $484.80, 47×)*. 🔑 Asosiy hissa — **model tanlovi** *(16.7×)* va **xotira oynasi**. ⭐ 1 000 foydalanuvchida esa farq atigi **$22.50** — ya'ni prototipda optimallashtirmaslik **to'g'ri qaror**.
5. ## Hujumchi *(yoki bitta faol foydalanuvchi)* **butun kvotani** yeb qo'yishi mumkin. 💥 7-dars bilan bog'liq: bu — **xizmatni rad etish** hujumi.

</details>

---

⬅️ [9-dars](09-Cost-Reduction.md) · 🏠 [Modul](README.md) · ➡️ [11-dars](11-Conclusion.md)
