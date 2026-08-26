# 5-dars. Nutqni tanish modelini qurish ⭐⭐

## 🎬 Boshlashdan oldin

> **"Noldan qurish kerak emas. Lekin nima uchun kerak emasligini bilish — kerak."**

---

## 1. To'liq quvur — sakkiz bosqich

| # | Bosqich | Vaqtning ulushi |
|---|---|---|
| 1 | ## 📊 **Ma'lumot to'plash** | ## 🏆 **~50%** |
| 2 | Pre-processing | ~10% |
| 3 | Xususiyat ajratish | ~5% |
| 4 | Arxitektura tanlash | ~5% |
| 5 | ## 🎓 **O'qitish** | ~15% |
| 6 | Baholash | ~5% |
| 7 | Post-processing | ~5% |
| 8 | ## 🚀 **Joylashtirish** | ~5% |

> ## 🔑 **KURS TO'G'RI URG'U BERADI:** *"Ma'lumot to'plami turli aksentlarni, gapirish uslublarini va muhitlarni qamrab olishi shart."*
>
> ## ⭐ **VA KURSNING MISOLI ANIQ:** *"Faqat Texasda yozilgan audioda o'qitilgan model boshqa shtat odamini tushunmaydi."*
>
> ## 🏆 **BU — ASR DAGI ENG KATTA XATO MANBAI.** ## Model **o'quv ma'lumotining oynasi**.

---

## 2. ⭐⭐ Ma'lumot bo'lish — va bitta jiddiy tuzoq

```python
# ❌ 💥 NOTO'G'RI — tasodifiy bo'lish
from sklearn.model_selection import train_test_split
tr, te = train_test_split(hamma_fayllar, test_size=0.2)
```

> ## 💥💥 **NIMA UCHUN BU XATO?**
> ```
> Bir gapiruvchining 100 ta yozuvi bor
>    →  tasodifiy bo'lishda 80 tasi o'qitishda, 20 tasi sinovda
>    →  💥 model uning OVOZINI yodlab oladi
>    →  💥 sinov natijasi HAQIQIY emas
> ```
>
> ## ✅ **TO'G'RI — GAPIRUVCHI BO'YICHA BO'LISH:**
> ```python
> from sklearn.model_selection import GroupShuffleSplit
>
> gss = GroupShuffleSplit(test_size=0.2, random_state=0)
> tr, te = next(gss.split(X, y, groups=gapiruvchi_id))
> # ⭐ bir gapiruvchi FAQAT bitta to'plamda bo'ladi
> ```
>
> ## 🏆 **BU — ASR DA "MA'LUMOT SIZIB CHIQISHI" NING ENG KO'P UCHRAYDIGAN SHAKLI.**

### 🔬 Ta'sirini o'lchaymiz

```python
import numpy as np, torch, torch.nn as nn


def tajriba(iz, signal=0.4, urug=0):
    """⭐ Har gapiruvchining O'Z 'izi' va O'Z belgi moyilligi bor."""
    r = np.random.RandomState(urug)
    X, Y, G = [], [], []
    for g in range(10):
        siljish = r.randn(26) * iz              # ⭐ gapiruvchining "izi"
        moyillik = 0.15 + 0.7 * (g % 2)         # ⭐ juft/toq — turli moyillik
        for i in range(40):
            b = r.rand() < moyillik
            X.append(r.randn(26) * 1.0 + siljish + (signal if b else -signal))
            Y.append(float(b))
            G.append(g)
    return (np.array(X, dtype=np.float32),
            np.array(Y, dtype=np.float32), np.array(G))


def bahola(X, Y, tr, te):
    torch.manual_seed(0)
    m = nn.Sequential(nn.Linear(26, 32), nn.ReLU(), nn.Linear(32, 1))
    opt = torch.optim.Adam(m.parameters(), lr=3e-3)
    lf = nn.BCEWithLogitsLoss()
    Xt, Yt = torch.tensor(X[tr]), torch.tensor(Y[tr])[:, None]
    for _ in range(400):
        opt.zero_grad()
        lf(m(Xt), Yt).backward()
        opt.step()
    with torch.no_grad():
        p = (torch.sigmoid(m(torch.tensor(X[te]))) > 0.5).float()
    return float((p[:, 0].numpy() == Y[te]).mean())


print("  iz    tasodifiy  gapiruvchi   farq")
for iz in [0.0, 1.0, 2.0, 4.0]:
    X, Y, G = tajriba(iz)
    r = np.random.RandomState(0)
    idx = r.permutation(len(X))
    a1 = bahola(X, Y, idx[:320], idx[320:])          # 💥 tasodifiy
    te = np.isin(G, [8, 9])                          # ✅ 2 gapiruvchi sinovda
    a2 = bahola(X, Y, np.where(~te)[0], np.where(te)[0])
    print(f"  {iz:4.1f}   {a1:8.1%}  {a2:9.1%}  {(a1-a2)*100:+6.1f} punkt")
```

```
  iz    tasodifiy  gapiruvchi   farq
   0.0      98.8%      97.5%    +1.3 punkt
   1.0      93.8%      65.0%   +28.7 punkt
   2.0      98.8%      53.8%   +45.0 punkt
   4.0      97.5%      53.8%   +43.8 punkt
```

> ## 💥💥💥 **`iz = 2.0` DA FARQ — 45 PUNKT.**
>
> ## 🔑 **TASODIFIY BO'LISHDA MODEL `98.8%` KO'RSATDI.** ## Haqiqiy natija — **53.8%**, ya'ni ## ## **tanga tashlashdan deyarli farq qilmaydi**.
>
> ## ⭐ **VA `iz = 0.0` QATORI — NAZORAT TAJRIBASI:**
> ```
> gapiruvchilarning "izi" YO'Q  →  farq atigi 1.3 punkt  ✅
> ```
> ## 💡 Ya'ni muammo **bo'lish usulida emas** — ## **gapiruvchining individual xususiyatlarida**.
>
> ## 🏆 **QANDAY ISHLAYDI?**
> ```
> ① Har gapiruvchining O'Z "izi" bor (ovoz, aksent, mikrofon)
> ② Har gapiruvchining O'Z belgi moyilligi bor
> ③ Tasodifiy bo'lishda model IZNI o'rganadi va undan BELGINI taxmin qiladi
> ④ 💥 Yangi gapiruvchida bu bilim BEHUDA
> ```
>
> ## ⚠️ **VA BU — SUN'IY MISOL EMAS.** ## Haqiqiy ASR datasetlarida:
> ```
> bir gapiruvchi → bir mavzu → bir lug'at
>    →  model "kim gapiryapti" dan "nima deyilyapti" ni taxmin qiladi
> ```

---

## 3. ⭐ Arxitektura tanlash — kursning jadvali

| Arxitektura | Qachon | Misol |
|---|---|---|
| **HMM** | ## ⚠️ Bugun **kam** | Kichik buyruq to'plami |
| **RNN** | Qisqa ketma-ketlik | Ovozli xabar |
| **LSTM** | Uzoq kontekst | Real vaqtli transkripsiya |
| **CNN** | ## ⭐ Spektrogramma · shovqin | Xususiyat ajratish |
| ## 🏆 **Transformer** | ## Uzoq bog'liqlik · katta ma'lumot | ## Siri · Alexa · Whisper |

> ## ⭐ **KURS TO'G'RI AYTADI:** *"Bir necha arxitekturani birgalikda ishlatish keng tarqalgan."*
>
> ## 🔬 **VA WHISPER AYNAN SHUNDAY:**
> ```
> CNN         →  2 ta Conv1d (kirishda, 3000 → 1500 siqish)
> Transformer →  4–32 encoder + decoder qatlam
> ```
> ## 💡 **Ya'ni Whisper — `CNN + Transformer` gibridi.**
>
> ## ⚠️ **VA 2-DARSDA O'LCHAGAN EDIK:** ## kichik ma'lumotda **`RNN` yutdi** *(84.6%)*, ## `Transformer` — **eng past** *(80.4%)*. ## 🏆 **Arxitekturani MA'LUMOT tanlaydi.**

---

## 4. 🏆 Noldan qurish kerakmi?

> ## 🔑 **KURSNING JAVOBI TO'G'RI:** *"Qisqa javob — yo'q."*
>
> ## ⭐ **UCH VARIANT:**
> ```
> ① NOLDAN o'qitish
>    💰 680 000 soat audio · minglab GPU-soat · $100 000+
>    ⏱️ oylar
>    ✅ faqat: yangi til, maxsus domen, tadqiqot
>
> ② FINE-TUNING
>    💰 10–100 soat audio · 1 GPU · $50–500
>    ⏱️ kunlar
>    ✅ ⭐ aksent, domen atamalari, kam resursli til
>
> ③ TAYYORNI ISHLATISH
>    💰 $0 (mahalliy) yoki $0.36/soat (API)
>    ⏱️ daqiqalar
>    ✅ 🏆 HOLATLARNING 90% I
> ```
>
> ## 🇺🇿 **VA O'ZBEK TILI UCHUN ② — ENG MANTIQIY:**
> ```
> Whisper o'zbekchani BILADI, lekin yomon
>    →  10–50 soat o'zbekcha audio + transkripsiya
>    →  fine-tuning
>    →  ⭐ aniqlik SEZILARLI oshadi
> ```
> ## 💡 **VA BUNDAY DATASETLAR BOR:** ## `Common Voice` *(Mozilla)* da o'zbekcha bo'limi mavjud.

---

## 5. ⭐⭐ Baholash — WER va CER

```
WER = (almashtirish + o'chirish + qo'shish) / etalondagi so'zlar soni
CER = xuddi shu, lekin BELGILAR bo'yicha
```

> ## ⚠️ **VA BU — 58-MODULNING MAVZUSI**, ## u yerda **haqiqiy transkripsiyada** o'lchaymiz.
>
> ## 💥 **HOZIRCHA BITTA OGOHLANTIRISH:**
> ```
> WER > 1.0 BO'LISHI MUMKIN
>    →  model etalondan KO'PROQ so'z yozsa
>    →  💥 gallyutsinatsiya holatida WER = 3.0 ham bo'ladi
> ```

---

## 6. ⚠️ Joylashtirish — kursda yuzaki, amalda muhim

```
🚀 JOYLASHTIRISHDAN OLDIN:

① KVANTLASH (quantization)
   float32 → int8   →  ⭐ 4× kichik, 2–3× tez
   ⚠️ aniqlik biroz tushadi

② FORMAT
   PyTorch → ONNX / CoreML / TFLite
   ⭐ qurilmaga moslashtirish

③ BATCHING
   bir nechta so'rovni BIRGA ishlash
   ⭐ GPU da 5–10× o'tkazuvchanlik

④ MONITORING
   💥 model "eskiradi" — yangi slang, yangi atamalar
   ⭐ topilmagan so'zlarni LOGGA yozing (51-modul)
```

> ## 🏆 **VA ENG MUHIM AMALIY MASLAHAT:** ## **eng katta modelni tanlamang — YETARLISINI tanlang.**
> ```
> whisper-tiny   37.8M   ⭐ RTF 0.08 — real vaqtdan 12× tez
> whisper-small 241.7M   ⚠️ RTF 0.23 — hali ham tez
> whisper-large  1550M   💥 GPU shart
> ```

---

## 7. ⚡ Mashqlar

### 🟢 Oson

**M1.** Nima uchun tasodifiy bo'lish ASR da xato?

**M2.** Uch variant *(noldan / fine-tune / tayyor)* dan qaysi biri eng ko'p ishlatiladi?

**M3.** Whisper qaysi ikki arxitekturaning gibridi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Bir gapiruvchi **ikkala to'plamda** bo'ladi → ## model uning **ovozini yodlaydi**. ## O'lchandi: **98.8%** vs haqiqiy **53.8%** — **45 punkt**.

**M2.** ## **Tayyorni ishlatish** — holatlarning **~90%** ida.

**M3.** ## **CNN** *(kirishda 2 ta `Conv1d`)* + **Transformer**.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ Ma'lumot sizib chiqishini o'lchang.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi 2-bo'limdagi kodni ishga tushiring, so'ng **gapiruvchi izining kuchini** o'zgartiring:

```python
def tajriba(iz_kuchi):
    r = np.random.RandomState(0)
    X, Y, G = [], [], []
    for g in range(10):
        siljish = r.randn(26) * iz_kuchi
        for i in range(40):
            b = r.rand() > 0.5
            X.append(r.randn(26) * 0.5 + siljish + (1.5 if b else -1.5))
            Y.append(float(b))
            G.append(g)
    return (np.array(X, dtype=np.float32),
            np.array(Y, dtype=np.float32), np.array(G))


for iz in [0.0, 0.5, 1.0, 2.0, 4.0, 8.0]:
    X, Y, G = tajriba(iz)
    r = np.random.RandomState(0)
    idx = r.permutation(len(X))
    a1 = bahola(X, Y, idx[:320], idx[320:])
    te = np.isin(G, [8, 9])
    a2 = bahola(X, Y, np.where(~te)[0], np.where(te)[0])
    print(f"  iz={iz:4.1f}  tasodifiy {a1:.1%} · gapiruvchi {a2:.1%} "
          f"· farq {(a1-a2)*100:+.1f} punkt")
```

## ✅ **`iz=0` DA FARQ ATIGI 1.3 PUNKT** — gapiruvchilar **bir xil**.

## 💥 **`iz=2.0` DA FARQ 45 PUNKT** — ## ya'ni **individual xususiyatlar** qanchalik kuchli bo'lsa, ## sizib chiqish **shunchalik xavfli**.

## ⚠️ **VA `iz=4.0` DA FARQ BIROZ KAMAYDI** *(43.8)* — ## juda kuchli iz **belgini ham ko'mib** yuboradi, ## shuning uchun **tasodifiy** natija ham tushadi.

</details>

**M5.** ⭐ Kvantlashning ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time, torch, librosa
from transformers import pipeline

y, sr = librosa.load("speech_01.wav", sr=16000)

asr = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")
t0 = time.perf_counter()
r1 = asr(y.copy(), generate_kwargs={"language": "en"})["text"].strip()
t1 = time.perf_counter() - t0

# ⭐ dinamik kvantlash — faqat Linear qatlamlar
q = torch.ao.quantization.quantize_dynamic(
    asr.model, {torch.nn.Linear}, dtype=torch.qint8)
asr.model = q
t0 = time.perf_counter()
r2 = asr(y.copy(), generate_kwargs={"language": "en"})["text"].strip()
t2 = time.perf_counter() - t0

print(f"  float32: {t1*1000:7.1f} ms")
print(f"  int8   : {t2*1000:7.1f} ms  ({t1/t2:.2f}× tez)")
print(f"  matn bir xilmi: {'✅' if r1 == r2 else '💥 FARQ BOR'}")
if r1 != r2:
    print(f"    f32: {r1[:80]}")
    print(f"    i8 : {r2[:80]}")
```

## ⚠️ **CPU DA KVANTLASH DOIM TEZLASHTIRMAYDI** — ## bu **apparatga** bog'liq.

## 🏆 **VA MATN O'ZGARSA — BU MUHIM SIGNAL:** ## kvantlash **aniqlikni** o'zgartirdi.

</details>

**M6.** ⭐⭐ Model o'lchamini tanlash mezonini yozing.

<details>
<summary>✅ Yechim</summary>

```python
import time
from transformers import pipeline

MODELLAR = ["openai/whisper-tiny", "openai/whisper-base",
            "openai/whisper-small"]

q = []
for nom in MODELLAR:
    t0 = time.perf_counter()
    asr = pipeline("automatic-speech-recognition", model=nom)
    yuk = time.perf_counter() - t0

    t0 = time.perf_counter()
    matn = asr(y.copy(), generate_kwargs={"language": "en"})["text"].strip()
    dt = time.perf_counter() - t0

    par = sum(p.numel() for p in asr.model.parameters())
    q.append({"model": nom.split("/")[-1], "parametr_M": round(par/1e6, 1),
              "yuklash_s": round(yuk, 1), "transkripsiya_s": round(dt, 1),
              "RTF": round(dt/(len(y)/sr), 3), "belgi": len(matn)})
    print(f"  {q[-1]}")
    del asr

print("\n  💡 TANLASH MEZONI:")
print("     RTF < 0.3  →  real vaqtli tizim uchun yaroqli")
print("     RTF < 1.0  →  batch qayta ishlash uchun yaroqli")
print("     RTF > 1.0  →  💥 audiodan sekinroq")
```

## 🏆 **`RTF` — ENG MUHIM AMALIY KO'RSATKICH.** ## O'lchandi *(52–55-modullar)*: `whisper-tiny` **RTF 0.08**.

</details>

---

## 📌 Xulosa

```
① ma'lumot (50%)  ② pre-process  ③ xususiyat  ④ arxitektura
⑤ o'qitish        ⑥ baholash     ⑦ post       ⑧ joylashtirish
```

```
🔬 O'LCHANGAN — MA'LUMOT SIZIB CHIQISHI:
   iz    tasodifiy  gapiruvchi   farq
   0.0      98.8%      97.5%    +1.3 punkt   ✅ nazorat
   1.0      93.8%      65.0%   +28.7 punkt
   2.0      98.8%      53.8%   +45.0 punkt   💥
   4.0      97.5%      53.8%   +43.8 punkt

🏆 UCH VARIANT:
   noldan       $100 000+ · oylar     →  faqat yangi til/domen
   fine-tuning  $50–500 · kunlar      →  ⭐ aksent, atama, 🇺🇿 o'zbekcha
   tayyor       $0 · daqiqalar        →  🏆 holatlarning 90% i

⭐ Whisper = CNN (2 Conv1d) + Transformer
💥 eng katta modelni emas — YETARLISINI tanlang
```

> ## 🏆🏆 **GAPIRUVCHI BO'YICHA BO'LMASANGIZ — SINOV NATIJANGIZ YOLG'ON.**

---

⬅️ [4-dars. Transformerlar](04-Transformers.md) · 🏠 [Modul boshiga](README.md) · ➡️ [6-dars. Vosita tanlash](06-Selecting-the-Tool.md)
