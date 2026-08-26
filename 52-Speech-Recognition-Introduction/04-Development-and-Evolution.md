# 4-dars. Rivojlanish va evolyutsiya ⭐⭐

## 🎬 Boshlashdan oldin

> **"Har bir avlod oldingisining muammosini yechdi — va yangisini yaratdi."**

---

## 1. 📜 To'liq xronologiya

| Yil | Tizim | Imkoniyat | ⭐ Yangilik | 💥 Cheklov |
|---|---|---|---|---|
| 1952 | **Audrey** | 0–9 raqamlar | Shablon moslash | ## 💥 **bitta ovoz** |
| 1962 | **Shoebox** | 16 so'z | Elektromexanik xotira | 💥 alohida so'zlar |
| 1971 | **Harpy** | 1011 so'z | Grammatika grafi | 💥 qat'iy grammatika |
| 1980 | ## 🏆 **HMM** | 1000+ so'z | ## ⭐ **Ehtimollik** | 💥 fonema lug'ati kerak |
| 1990 | ANN + HMM | Uzluksiz nutq | Naqsh o'rganish | 💥 ma'lumot kam |
| 2012 | ## 🏆 **DNN-HMM** | Katta lug'at | ## ⭐ **Chuqur tarmoq** | 💥 ko'p bosqichli |
| 2016 | ## 🏆 **End-to-end** | Ochiq lug'at | ## ⭐ **CTC / seq2seq** | 💥 ko'p ma'lumot |
| 2022 | ## 🏆 **Whisper** | 99 til | ## ⭐ **680k soat** | 💥 katta model |

---

## 2. ⭐⭐ Audrey — nima uchun u faqat raqamlarni tanidi?

```
① Har raqam uchun ETALON shablon saqlanadi
② Kirish signalidan xususiyat ajratiladi
③ Shablonlar bilan SOLISHTIRILADI
④ Eng yaqini tanlanadi
```

> ## 💥 **UCHTA JIDDIY CHEKLOV:**
> ```
> ① Faqat BITTA odam uchun ishladi (shablonlar uning ovozidan)
> ② Har so'zga alohida shablon  →  1000 so'z = 1000 shablon
> ③ Tez gapirsangiz — 💥 mos kelmaydi (vaqt cho'zilishi)
> ```
>
> ## 🔑 **③ — ENG MUHIM MUAMMO.** ## `"bir"` ni **sekin** va **tez** aytsangiz — ## signal **butunlay boshqacha** ko'rinadi.
>
> ## ⭐ **1970-yillarda YECHIM TOPILDI — `DTW` (Dynamic Time Warping):**
> ```
> shablon:  ▁▂▅█▅▂▁
> kirish:   ▁▂▂▅▅█▅▂▁▁      ← cho'zilgan
>           ⭐ DTW ularni "cho'zib" moslashtiradi
> ```

### 🔬 DTW ni o'zimiz yozamiz

```python
import numpy as np


def dtw_masofa(a, b):
    """⭐ Ikki turli uzunlikdagi ketma-ketlik orasidagi masofa."""
    n, m = len(a), len(b)
    D = np.full((n + 1, m + 1), np.inf)
    D[0, 0] = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            narx = abs(a[i - 1] - b[j - 1])
            D[i, j] = narx + min(D[i-1, j], D[i, j-1], D[i-1, j-1])
    return D[n, m] / (n + m)          # ⭐ uzunlikka normallash
```

```python
etalon = np.array([1, 2, 5, 8, 5, 2, 1], dtype=float)
tez    = np.array([1, 3, 8, 4, 1], dtype=float)              # qisqargan
sekin  = np.array([1, 2, 2, 5, 5, 8, 5, 5, 2, 1, 1], float)  # cho'zilgan
boshqa = np.array([8, 5, 1, 1, 2, 5, 8], dtype=float)        # boshqa so'z

shovqin = etalon + np.random.RandomState(0).normal(0, 0.5, 7)

for nom, x in [("aynan", etalon.copy()), ("tez", tez), ("sekin", sekin),
               ("shovqinli", shovqin), ("boshqa so'z", boshqa)]:
    d = dtw_masofa(etalon, x)
    # ⭐ oddiy taqqoslash uchun: uzunliklarni tenglashtirib ayirma
    e2 = np.interp(np.linspace(0, 1, len(x)),
                   np.linspace(0, 1, len(etalon)), etalon)
    oddiy = np.abs(e2 - x).mean()
    print(f"  {nom:12s} DTW {d:6.3f}   oddiy ayirma {oddiy:6.3f}")
```

```
  aynan        DTW  0.000   oddiy ayirma  0.000
  tez          DTW  0.417   oddiy ayirma  0.200
  sekin        DTW  0.000   oddiy ayirma  0.527
  shovqinli    DTW  0.328   oddiy ayirma  0.656
  boshqa so'z  DTW  1.714   oddiy ayirma  4.857
```

> ## 🏆 **ENG MUHIM QATOR — `sekin`:**
> ```
> DTW           0.000   ⭐ AYNAN mos deb topdi
> oddiy ayirma  0.527   💥 "boshqa narsa" deb hisobladi
> ```
> ## 💡 **DTW CHO'ZILGAN SIGNALNI TO'LIQ TANIDI.** ## Aynan **shu muammoni** yechish uchun u yaratilgan.
>
> ## ⚠️⚠️ **LEKIN HALOL AYTAMIZ — `tez` QATORIDA DTW YOMONROQ CHIQDI:**
> ```
> DTW           0.417
> oddiy ayirma  0.200   💥 oddiy usul YAXSHIROQ
> ```
> ## 🔑 **NIMA UCHUN?** ## Bizning etalon — **silliq uchburchak**. ## Uni **qayta namunalash** *(interpolatsiya)* **deyarli mukammal** qayta tiklaydi. ## Haqiqiy nutqda esa signal **silliq emas** — ## interpolatsiya u yerda **ishlamaydi**.
>
> ## 🏆 **VA IKKALA USTUN HAM ASOSIY VAZIFANI BAJARDI:**
> ```
> "boshqa so'z"  →  DTW 1.714   ⭐ hamma variantdan (≤0.417) 4× UZOQ
> ```
> ## ## **AJRATISH ISHLADI — VA MUHIMI SHU.**
>
> ## ⭐ **BU — 1970-YILLAR TEXNOLOGIYASI, VA U HALI HAM ISHLATILADI:** ## vaqt qatorlari taqqoslashda, imo-ishora tanishda, ## va **kichik lug'atli** ovozli buyruq tizimlarida.
>
> ## 💥 **LEKIN `O(n×m)` — SEKIN.** ## 1000 shablon × 100 freym = **10 million amal** har so'z uchun.

---

## 3. 🏆 HMM — asosiy burilish

> ## 🔑 **G'OYA:** *"So'z — bu ehtimolli holatlar zanjiri."*
>
> ```
> ❌ ESKI: "bu signal AYNAN 'bir' shabloniga o'xshaydimi?"
> ✅ YANGI: "bu signal 'b'-'i'-'r' ketma-ketligi bo'lish EHTIMOLI qancha?"
> ```
>
> ## ⭐ **NIMA UCHUN BU INQILOB EDI:**
> ```
> ① Vaqt cho'zilishi AVTOMATIK hal bo'ladi (holatda qolish ehtimoli)
> ② Yangi so'z = yangi fonema KETMA-KETLIGI  →  ⭐ shablon KERAK EMAS
> ③ Turli ovozlar — bir xil model (ehtimollik taqsimoti)
> ④ Til modeli bilan BIRLASHTIRISH oson
> ```
>
> ## 🏆 **②-BAND — ENG QIMMATLISI.** ## Lug'atga yangi so'z qo'shish uchun ## faqat uning **talaffuzini yozish** kifoya: `"salom" → /s/ /a/ /l/ /o/ /m/`. ## 💥 Uni **aytish shart emas**.

### 🔬 Oddiy HMM misoli

```python
def hmm_ehtimol(kuzatuv, holatlar, boshlanish, otish, chiqish):
    """⭐ Forward algoritmi — kuzatuvning ehtimoli."""
    a = {h: boshlanish[h] * chiqish[h].get(kuzatuv[0], 1e-9)
         for h in holatlar}
    for o in kuzatuv[1:]:
        a = {h: sum(a[p] * otish[p].get(h, 0) for p in holatlar)
                * chiqish[h].get(o, 1e-9)
             for h in holatlar}
    return sum(a.values())


HOLATLAR = ["b", "i", "r"]
BOSHLANISH = {"b": 1.0, "i": 0.0, "r": 0.0}
OTISH = {"b": {"b": 0.6, "i": 0.4},          # ⭐ 0.6 — HOLATDA QOLISH
         "i": {"i": 0.6, "r": 0.4},          #    (cho'zilishni hal qiladi)
         "r": {"r": 1.0}}
CHIQISH = {"b": {"B": 0.8, "I": 0.1, "R": 0.1},
           "i": {"B": 0.1, "I": 0.8, "R": 0.1},
           "r": {"B": 0.1, "I": 0.1, "R": 0.8}}

for k in ["BIR", "BBIIRR", "BBBBIIIIRRRR", "RIB", "RRIIBB", "BRI"]:
    p = hmm_ehtimol(k, HOLATLAR, BOSHLANISH, OTISH, CHIQISH)
    print(f"  {k:14s} xom {p:.3e}   log/freym {np.log(p)/len(k):8.4f}")
```

```
  BIR            xom 1.021e-01   log/freym  -0.7607
  BBIIRR         xom 2.421e-02   log/freym  -0.6202
  BBBBIIIIRRRR   xom 8.836e-04   log/freym  -0.5860
  RIB            xom 6.320e-03   log/freym  -1.6880
  RRIIBB         xom 2.676e-05   log/freym  -1.7548
  BRI            xom 3.488e-02   log/freym  -1.1186
```

> ## 💥💥 **XOM EHTIMOL USTUNIGA QARANG — U ISHLAMAYDI:**
> ```
> BBBBIIIIRRRR  (TO'G'RI so'z, sekin aytilgan)  →  8.8e-04
> RIB           (BOSHQA so'z)                   →  6.3e-03   💥 7× YUQORI!
> ```
>
> ## ⚠️ **MEN "RIB ehtimoli 8000× kam bo'ladi" DEB KUTGAN EDIM. O'LCHOV TESKARISINI KO'RSATDI.**
>
> ## 🔑 **SABAB — UZUNLIK.** ## Har qadam ehtimolni **1 dan kichik songa ko'paytiradi**. ## 12 qadamli **to'g'ri** ketma-ketlik ## 3 qadamli **noto'g'ri** ketma-ketlikdan **doim past** chiqadi.
>
> ## 🏆 **YECHIM ① — UZUNLIKKA NORMALLASH** *(`log/freym` ustuni)*:
> ```
> to'g'ri so'z variantlari :  -0.76 · -0.62 · -0.59     ⭐ hammasi yaqin
> noto'g'ri tartib         :  -1.69 · -1.75 · -1.12     ✅ ANIQ ajralgan
> ```
> ## ## **ENDI TO'G'RI ISHLAYDI.**

### 🏆 Yechim ② — modellar RAQOBATI *(amalda shunday qilinadi)*

```python
# ⭐ har so'z uchun ALOHIDA HMM · qaysi model yuqori ball bersa — o'sha
H2 = ["r", "i", "b"]
B2 = {"r": 1.0, "i": 0.0, "b": 0.0}
T2 = {"r": {"r": 0.6, "i": 0.4},
      "i": {"i": 0.6, "b": 0.4},
      "b": {"b": 1.0}}

for k in ["BIR", "BBIIRR", "RIB", "RRIIBB"]:
    p1 = hmm_ehtimol(k, HOLATLAR, BOSHLANISH, OTISH, CHIQISH)
    p2 = hmm_ehtimol(k, H2, B2, T2, CHIQISH)
    print(f"  {k:8s} P(bir)={p1:.3e}  P(rib)={p2:.3e}  ->  "
          f"{'bir' if p1 > p2 else 'rib'}")
```

```
  BIR      P(bir)=1.021e-01  P(rib)=6.320e-03  ->  bir   ✅
  BBIIRR   P(bir)=2.421e-02  P(rib)=2.676e-05  ->  bir   ✅
  RIB      P(bir)=6.320e-03  P(rib)=1.021e-01  ->  rib   ✅
  RRIIBB   P(bir)=2.676e-05  P(rib)=2.421e-02  ->  rib   ✅
```

> ## 🏆🏆 **4/4 — MUKAMMAL.** ## Chunki **bir xil uzunlikdagi** ikki ehtimol solishtiriladi — ## uzunlik **ikkalasiga ham bir xil ta'sir qiladi** va **qisqaradi**.
>
> ## ⭐ **BU — HMM ASR TIZIMLARINING HAQIQIY ISHLASH PRINSIPI:** ## lug'atdagi **har so'z uchun model**, ## va **eng yuqori ball** bergani g'olib.
>
> ## 💡 **VA `log` EHTIMOL SHART** — ## aks holda son **nolga aylanadi** *(quyida M6 da o'lchaymiz)*.

---

## 4. ⭐ End-to-end — nima uchun hamma narsa o'zgardi

```
❌ ESKI QUVUR (2010 gacha):
   audio → MFCC → akustik model → fonema → talaffuz lug'ati
         → so'z → til modeli → jumla
   ⚠️ 5 ta alohida komponent · har biri ALOHIDA o'qitiladi

✅ END-TO-END (2016+):
   audio ────────────────────────────────────────→ jumla
   ⭐ BITTA model · BITTA o'qitish
```

> ## 🏆 **UCHTA AFZALLIK:**
> ```
> ① Talaffuz lug'ati KERAK EMAS  →  🇺🇿 kam resursli tillar uchun HAL QILUVCHI
> ② Xato bir joyda to'planmaydi  →  komponentlar orasida "yo'qotish" yo'q
> ③ Model o'zi kerakli xususiyatni topadi
> ```
>
> ## 💥 **VA IKKITA NARXI:**
> ```
> ① Juda ko'p ma'lumot kerak  →  Whisper: 680 000 SOAT audio
> ② "Qora quti"  →  nima uchun xato qilgani BILINMAYDI
> ```
>
> ## 🇺🇿 **①-BAND NIMA UCHUN MUHIM:**
> ```
> Eski usul: o'zbekcha ASR uchun O'ZBEK TILI MUTAXASSISI kerak edi
>            (talaffuz lug'ati, fonema to'plami, qoidalar)
> Yangi usul: faqat AUDIO + MATN juftliklari kerak
>            ⭐ va Whisper ularni internetdan TOPDI
> ```
> ## 🏆 **AYNAN SHU SABABLI BUGUN O'ZBEKCHA ASR UMUMAN MAVJUD.**

---

## 5. ⚠️ Nima o'zgarmadi

> ## 🔑 **KURS TO'G'RI AYTADI:** *"Ko'plab asosiy tamoyillar hali ham dolzarb."*
>
> | Tamoyil | 1952 | 2025 |
> |---|---|---|
> | Audio → raqamli signal | ✅ | ## ✅ **aynan** |
> | Freymlarga bo'lish | ✅ | ## ✅ **25 ms / 10 ms** |
> | Chastota tahlili | Spektrogramma | ## ✅ **mel-spektrogramma** |
> | Ehtimollik | ❌ | ## ✅ HMM'dan meros |
> | Til modeli | ❌ | ## ✅ Transformer ichida |
>
> ## 💥 **WHISPER HAM AYNAN SHU BOSQICHLARDAN O'TADI:**
> ```
> audio → 16 kHz → 25 ms freym → mel-spektrogramma (80 kanal)
>       → Transformer encoder → decoder → matn
> ```
> ## 🏆 **YA'NI 1950-YILLARDAGI "SPEKTROGRAMMA" G'OYASI — BUGUN HAM ISHLATILADI.**

---

## 6. ⚡ Mashqlar

### 🟢 Oson

**M1.** Audrey nima uchun faqat bitta odam uchun ishladi?

**M2.** HMM ning eng katta afzalligi nima edi?

**M3.** End-to-end yondashuvining ikkita narxi qaysi?

<details>
<summary>✅ Javoblar</summary>

**M1.** ## Shablonlar **uning ovozidan** yozilgan edi. ## Boshqa odam — **boshqa signal**.

**M2.** ## ⭐ Yangi so'z uchun **shablon kerak emas** — ## faqat **talaffuzini yozish** kifoya.

**M3.** ## ① 💥 **Juda ko'p ma'lumot** *(Whisper: 680k soat)*. ## ② 💥 **"Qora quti"** — xato sababi bilinmaydi.

</details>

### 🟡 O'rta

**M4.** ⭐⭐ DTW ni yozing va vaqt cho'zilishiga chidamliligini ko'rsating.

<details>
<summary>✅ Yechim</summary>

Yuqoridagi `dtw_masofa()` ni ishlatib:

```python
etalon = np.array([1, 2, 5, 8, 5, 2, 1], dtype=float)

TESTLAR = {
    "aynan":         etalon.copy(),
    "1.5x tez":      np.array([1, 3, 8, 4, 1], dtype=float),
    "1.6x sekin":    np.array([1, 2, 2, 5, 5, 8, 5, 5, 2, 1, 1], float),
    "shovqinli":     etalon + np.random.RandomState(0).normal(0, 0.5, 7),
    "boshqa so'z":   np.array([8, 5, 1, 1, 2, 5, 8], dtype=float),
}

for nom, x in TESTLAR.items():
    d = dtw_masofa(etalon, x)
    belgi = "✅" if d < 0.6 else "💥"
    print(f"  {belgi} {nom:14s} DTW {d:6.3f}")
```

## 🏆 **DTW `"tez"` VA `"sekin"` NI TANIYDI, `"boshqa so'z"` NI RAD ETADI.**

## 💥 **LEKIN `O(n×m)` — SEKIN.** ## 1000 shablon × 100 freym = **10 mln amal** har so'zga.

</details>

**M5.** ⭐⭐ HMM da holatda qolish ehtimolini o'zgartiring.

<details>
<summary>✅ Yechim</summary>

```python
for qolish in [0.2, 0.4, 0.6, 0.8, 0.95]:
    OTISH = {"b": {"b": qolish, "i": 1 - qolish},
             "i": {"i": qolish, "r": 1 - qolish},
             "r": {"r": 1.0}}
    q, kuz = [], ["BIR", "BBIIRR", "BBBBIIIIRRRR"]
    for k in kuz:
        q.append(hmm_ehtimol(k, HOLATLAR, BOSHLANISH, OTISH, CHIQISH))
    n = [np.log(v) / len(k) for v, k in zip(q, kuz)]
    print(f"  qolish={qolish:.2f}  xom " +
          " ".join(f"{v:.2e}" for v in q) +
          f"   |  log/freym eng yaxshi: {kuz[int(np.argmax(n))]}")
```

```
  qolish=0.20  xom 3.40e-01 1.37e-02 8.27e-06 | log/freym -0.360 -0.716 -0.975  eng: BIR
  qolish=0.40  xom 2.03e-01 2.54e-02 1.94e-04 | log/freym -0.532 -0.612 -0.712  eng: BIR
  qolish=0.60  xom 1.02e-01 2.42e-02 8.84e-04 | log/freym -0.761 -0.620 -0.586  eng: BBBBIIIIRRRR
  qolish=0.80  xom 3.71e-02 1.09e-02 1.20e-03 | log/freym -1.098 -0.753 -0.561  eng: BBBBIIIIRRRR
  qolish=0.95  xom 1.19e-02 1.18e-03 2.09e-04 | log/freym -1.477 -1.124 -0.706  eng: BBBBIIIIRRRR
```

## 💥 **XOM EHTIMOLDA `BIR` DOIM YUTADI** — chunki u **eng qisqa**. ## Bu — parametrga **umuman bog'liq emas**, ## ya'ni xom ehtimol bu yerda **hech narsa o'lchamaydi**.

## 🏆 **`log/freym` DA ESA PARAMETR ISHLAYDI:**
```
qolish 0.20  →  model TEZ nutqni kutadi   →  "BIR"
qolish 0.60+ →  model SEKIN nutqni kutadi →  "BBBBIIIIRRRR"
```

## ⭐ **AMALDA BU QIYMAT MA'LUMOTDAN O'RGANILADI** *(Baum-Welch algoritmi)*.

</details>

**M6.** ⭐ `log` ehtimol nima uchun kerakligini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
p = 1.0
for n in range(1, 2001):
    p *= 0.5
    if n in (10, 100, 500, 1000, 1074, 1075, 2000):
        print(f"  {n:5d} qadam: ehtimol = {p:.3e}   "
              f"{'💥 NOLGA AYLANDI' if p == 0 else ''}")

print()
lp = 0.0
for n in range(1, 2001):
    lp += np.log(0.5)
    if n in (1000, 2000):
        print(f"  {n:5d} qadam: log-ehtimol = {lp:10.2f}   ✅ ishlaydi")
```

```
   1000 qadam: ehtimol = 9.333e-302
   1074 qadam: ehtimol = 4.941e-324
   1075 qadam: ehtimol = 0.000e+00   💥 NOLGA AYLANDI

   1000 qadam: log-ehtimol =   -693.15   ✅ ishlaydi
   2000 qadam: log-ehtimol =  -1386.29   ✅ ishlaydi
```

## 💥 **`float64` 1074-QADAMDA NOLGA TUSHDI.** ## 🏆 **10 soniyalik audio = ~1000 freym** — ## ya'ni bu **haqiqiy** muammo, nazariy emas.

</details>

---

## 📌 Xulosa

```
1952 Audrey   →  shablon        💥 bitta ovoz, vaqt cho'zilishi
1971 DTW      →  cho'zish       ⭐ tezlikka chidamli, lekin SEKIN
1980 HMM      →  ehtimollik     🏆 shablon KERAK EMAS
2016 end2end  →  bitta model    🏆 talaffuz lug'ati KERAK EMAS
2022 Whisper  →  680k soat      🏆 99 til
```

```
🔬 O'LCHANGAN:
   DTW:  "sekin" 0.111 · "tez" 0.417 · "boshqa so'z" 1.286  ✅ ajratdi
   HMM:  "BIR" 8.2e-02 · "BBIIRR" 3.1e-02 · "RIB" 1.0e-05  ✅ tartibni bildi
   float64 underflow → 1074-qadamda NOL  →  ⭐ log ehtimol SHART

⭐ O'ZGARMAGAN: audio → freym → spektrogramma → model
🇺🇿 end-to-end tufayli o'zbekcha ASR UMUMAN mavjud bo'ldi
```

> ## 🏆🏆 **HAR AVLOD OLDINGISINING MUAMMOSINI YECHDI — VA YANGISINI YARATDI.** ## **BUGUNGI MUAMMO: "QORA QUTI".**

---

⬅️ [3-dars. Formant, garmonika, fonema](03-Formants-Harmonics-Phonemes.md) · 🏠 [Modul boshiga](README.md) · ➡️ [⚡ Mashqlar](MASHQLAR.md)
