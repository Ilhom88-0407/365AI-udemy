# 3-dars. LDA — Latent Dirichlet Allocation

## 🎬 Boshlashdan oldin

> **"Keling, endi Latent Dirichlet Allocation va bu algoritm AYNAN QANDAY ishlashini muhokama qilaylik."**

---

## 1. Muammoni qo'yamiz

> **"Oxirgi darsdan misol olaylik. Bizda turli mavzularga tasniflashni xohlagan yangilik maqolalari to'plami bor. Ya'ni bu siyosat yangiliklari, sport yangiliklari, biznes yangiliklari va hokazo bo'lishi mumkin."**
>
> ## **"Qaysi hujjat qaysi mavzu haqida ekanini QANDAY hal qilamiz?"**

---

## 2. So'zlarga qaraymiz

> **"Xo'sh, biz ular ishlatadigan SO'ZLARGA qarashimiz mumkin."**
>
> **"Masalan, `ball`, `player`, `match`, `game` kabi so'zlar. Agar bu so'zlar hujjatda KO'P MARTA paydo bo'lsa, biz bu maqola SPORT yangiliklari haqida bo'lishini taxmin qila olamiz."**

```
Maqola: "... ball ... player ... match ... game ... team ..."
                ↑        ↑        ↑        ↑       ↑
        Bu so'zlar KO'P MARTA uchraydi
                        ↓
             ⚽ Bu — SPORT yangiligi
```

---

## 3. ⚠️ Lekin so'zlar BIR NECHTA mavzuga tegishli

> **"Ba'zi so'zlar mavzuga ko'proq mos keladi, ba'zi so'zlar esa BIR NECHTA mavzuda uchrashi mumkin."**
>
> **"Masalan, `crash` so'zi TRAFIK yangiliklariga yoki MOLIYA yangiliklariga tegishli bo'lishi mumkin."**

```
        "crash"
       ╱        ╲
      ╱          ╲
  🚗 TRAFIK    📉 MOLIYA
  "avtohalokat"  "birja qulashi"
```

**Yana misollar:**

| So'z | Mavzu 1 | Mavzu 2 |
|---|---|---|
| `bank` | 💰 Moliya | 🏞️ Daryo qirg'og'i |
| `court` | ⚖️ Sud | 🎾 Tennis korti |
| `strike` | ✊ Ish tashlash | ⚾ Beysbol |
| `run` | 🏃 Yugurish | 🗳️ Saylovda nomzod |
| `virus` | 🦠 Tibbiyot | 💻 Kompyuter |

> ## 💡 **Bu — muammo EMAS, bu — MODEL DIZAYNI.** LDA'da har bir so'z **bir nechta mavzuga** turli **ehtimol** bilan tegishli bo'lishi mumkin.

---

## 4. `Latent` — yashirin

> ## **"Biz mavzu hujjat ichida YASHIRIN (latent) deb aytamiz. O'sha matn bo'lagining mavzusini kashf qilish uchun uning ichidagi SO'ZLARNI tekshirishimiz kerak."**

```
   ┌────────────────────────────────┐
   │  MAQOLA                        │
   │                                │
   │  ball ... player ... match ... │
   │  ... game ... team ... goal    │
   │                                │
   │  ⚠️ Hech qayerda "SPORT"       │
   │     deb YOZILMAGAN!            │
   └────────────────────────────────┘
              ↓
      Mavzu YASHIRIN (latent)
              ↓
      So'zlar orqali TOPAMIZ
```

---

## 5. `Dirichlet` — taqsimot

> **"Hujjat, albatta, BIR NECHTA mavzudan so'zlarni o'z ichiga olishi mumkin — lekin biz uni asosan BITTA mavzuga qaratilgan deb faraz qilamiz, faqat bir nechta so'z boshqa turli mavzularga tegishli."**
>
> ## **"Bu — bizning DIRICHLET TAQSIMOTIMIZ."**

```
❌ TEKIS taqsimot (bu FARAZ EMAS)
   sport 25% · siyosat 25% · moliya 25% · madaniyat 25%
   → hujjat HECH NIMA haqida emas

✅ DIRICHLET taqsimoti (BIZNING FARAZ)
   sport 85% · siyosat 8% · moliya 5% · madaniyat 2%
   → hujjat ASOSAN sport haqida  ⭐
```

### 🔑 Nima uchun bu faraz muhim?

```
Haqiqiy matnlar SHUNDAY yozilgan!

Hech kim to'rtta mavzu haqida BAROBAR yozmaydi.
Odam BIR mavzuni tanlaydi va u haqida yozadi —
yo'l-yo'lakay boshqa narsalarni tilga oladi.

LDA aynan shu tabiiy holatni MODELLASHTIRADI.
```

> 💡 **Dirichlet taqsimoti** — matematik atama. Sodda tilda: *"ulushlar TENG BO'LMASIN, biri USTUN kelsin"* degan qoida.

**Bu ikkala tomonga ham qo'llanadi:**

```
① HUJJAT → MAVZULAR
   Har hujjat ASOSAN bitta mavzu haqida

② MAVZU → SO'ZLAR
   Har mavzuda bir nechta so'z USTUN
   (sport: ball, player, match — juda ko'p;
           the, is, and — bor, lekin muhim emas)
```

---

## 6. ⭐ Algoritm — qadamma-qadam

> **"Demak, biz yashirin mavzular va Dirichlet taqsimoti deganda nimani nazarda tutayotganimizni tushunamiz. LDA keyin ITERATIV JARAYON sifatida ishlaydi."**

![LDA algoritmi](assets/02-lda-algorithm.svg)

### 0-qadam — K ni tanlaymiz

> **"Bu yerda biz avval xohlagan mavzular sonini `k` deb ko'rsatamiz."**

```
k = 3      ← SIZ tanlaysiz!
              (7-darsda buni QANDAY tanlashni o'rganamiz)
```

> ## ⚠️ **Bu — LDA'ning eng katta zaifligi.** Model **o'zi** nechta mavzu borligini **topa olmaydi**. Siz aytishingiz kerak.

### 1-qadam — TASODIFIY tayinlash

> **"Algoritmning birinchi iteratsiyasi — bu hujjatdagi so'zlar `k` mavzulardan biriga TASODIFIY tayinlanadi."**

```
"ball player match vote party goal"
   ↓     ↓      ↓     ↓     ↓     ↓
   M2    M1     M3    M2    M1    M3
   ↑
TASODIFIY! Hech qanday mantiq yo'q.
```

> 💡 **G'alati tuyuladi?** Ha — bu **ataylab**. Algoritm **noldan** boshlaydi va **asta-sekin** tuzatadi.

### 2-qadam — TUZATISH (ko'p marta takrorlanadi)

> **"Keyin ikkinchi iteratsiyaga o'tamiz — bu yerda biz hujjatdagi HAR BIR alohida so'zdan o'tamiz."**
>
> ## **"Biz BOSHQA barcha so'zlar TO'G'RI tayinlangan deb FARAZ qilamiz va hozir qarayotgan so'zimizning mavzu tayinlanishini TUZATISHGA harakat qilamiz."**

```
"ball player match vote party goal"
   ?     M1     M3    M2    M1    M3
   ↑
Faqat SHU so'zni qayta ko'rib chiqamiz.
Qolganlari TO'G'RI deb faraz qilinadi.
```

### 🔑 Tuzatish IKKI savolga qaraydi

> **"LDA tayinlashni shunday tuzatadi: JORIY HUJJATDA mavzuga tayinlangan so'zlar ULUSHIGA qarab, va bu so'z BOSHQA HUJJATLARDA ma'lum bir mavzuga necha marta tayinlanganiga qarab."**

```
┌─────────────────────────────────────────────────┐
│ SAVOL 1 — BU HUJJATDA                           │
│                                                 │
│ "Bu hujjatdagi boshqa so'zlar qaysi mavzuda?"   │
│                                                 │
│ player→M1  party→M1   match→M3   goal→M3        │
│         ↑                                       │
│  M1 da 2 ta, M3 da 2 ta, M2 da 1 ta            │
│  → "ball" ehtimol M1 yoki M3 da                │
├─────────────────────────────────────────────────┤
│ SAVOL 2 — BOSHQA HUJJATLARDA                    │
│                                                 │
│ "'ball' so'zi boshqa maqolalarda qaysi mavzuda?"│
│                                                 │
│ 47 marta → M3                                   │
│  3 marta → M1                                   │
│  0 marta → M2                                   │
│  → "ball" deyarli DOIM M3 da!                   │
└─────────────────────────────────────────────────┘
                    ↓
        IKKALASI birlashadi  →  "ball" = M3 ✅
```

### 3-qadam — Takrorlash

> **"Algoritm bu jarayondan BIR NECHA MARTA o'tadi — u BARQAROR HOLATGA yetguncha."**

```
1-iteratsiya:   tasodifiy aralashma       😵
10-iteratsiya:  naqshlar ko'rina boshladi  🤔
50-iteratsiya:  mavzular aniq             😊
100-iteratsiya: deyarli o'zgarmayapti     ✅  ← BARQAROR HOLAT
```

> **"Keyin u bizga TEKSHIRISH uchun YAKUNIY mavzu tayinlashlarini beradi."**

---

## 7. 🎬 To'liq misol

```
3 ta hujjat, k=2

D1: "ball player match"
D2: "vote party election"
D3: "ball goal player"

═══ 1-ITERATSIYA (tasodifiy) ═══
D1: ball→A  player→B  match→A
D2: vote→B  party→A   election→B
D3: ball→B  goal→A    player→A

  Mavzu A: ball, match, party, goal, player
  Mavzu B: player, vote, election, ball
     ↑ ARALASHMA — hech qanday ma'no yo'q

═══ KO'P ITERATSIYADAN KEYIN ═══
D1: ball→A  player→A  match→A
D2: vote→B  party→B   election→B
D3: ball→A  goal→A    player→A

  Mavzu A: ball, player, match, goal   ⚽ SPORT
  Mavzu B: vote, party, election       🏛️ SIYOSAT
     ↑ MANA ENDI MA'NO BOR!
```

> ## 🎯 **Hech kim algoritmga "sport" va "siyosat" demadi.** U shunchaki **qaysi so'zlar birga uchrashini** sanadi — va **o'zi** ikkita guruh topdi.

---

## 8. LDA nima qaytaradi?

```
① HUJJAT → MAVZU ehtimollari

   D1:  A 92%  ·  B 8%
   D2:  A 5%   ·  B 95%
   D3:  A 88%  ·  B 12%

② MAVZU → SO'Z ehtimollari

   Mavzu A:  0.31*"ball" + 0.28*"player" + 0.19*"match" + ...
   Mavzu B:  0.35*"vote" + 0.30*"party" + 0.22*"election" + ...
```

> 💡 **Har ikkala natija ham foydali:**
> - **①** — hujjatlarni **guruhlash** uchun
> - **②** — mavzuga **nom berish** uchun *(bu "sport" ekanini shundan bilamiz)*

---

## 9. ⚠️ LDA'ning cheklovlari

| Cheklov | Izoh |
|---|---|
| **K ni SIZ tanlaysiz** | Model o'zi topa olmaydi *(7-dars)* |
| **Tasodifiylik** | Har safar **biroz boshqa** natija → `random_state` qo'ying |
| **Qisqa matn** | Tvitda naqsh **yetarli emas** |
| **Mavzuga nom yo'q** | Model `M0`, `M1` beradi — **nomni siz** qo'yasiz |
| **So'z tartibi** | Bag of Words → tartib **yo'qoladi** |
| **Tozalash muhim** | Iflos ma'lumot → `the`, `said`, `mr` mavzulari 😖 |

> ## 💡 **Oxirgi punkt eng muhim.** 4-darsda buni **o'z ko'zingiz bilan** ko'rasiz — va **qanday tuzatishni** ham.

---

## 10. ⚡ Mashqlar

### 🟢 Oson

**M1.** `latent` nimani anglatadi?

**M2.** LDA'ning 3 qadamini ayting.

**M3.** `k` nima va kim tanlaydi?

<details>
<summary>✅ Javoblar</summary>

**M1.** **Yashirin.** Mavzu matnda **yozilmagan** — uni so'zlardan topamiz.

**M2.**
```
1 · So'zlar mavzularga TASODIFIY tayinlanadi
2 · Har bir so'z QAYTA ko'rib chiqiladi (ikki savol asosida)
3 · BARQAROR HOLATGA yetguncha TAKRORLANADI
```

**M3.** **Mavzular soni.** ## **SIZ tanlaysiz** — model o'zi topa olmaydi.

</details>

### 🟡 O'rta

**M4.** Tuzatish bosqichida qaysi **ikki savol** so'raladi?

**M5.** Bir nechta mavzuga tegishli 3 ta so'z ayting.

**M6.** Dirichlet farazi nima?

<details>
<summary>✅ Javoblar</summary>

**M4.**
```
1 · "BU HUJJATDAGI boshqa so'zlar qaysi mavzuda?"
2 · "BU SO'Z boshqa hujjatlarda qaysi mavzuda?"
```

**M5.** `crash` *(trafik/moliya)*, `bank` *(moliya/daryo)*, `court` *(sud/tennis)*, `virus` *(tibbiyot/kompyuter)*.

**M6.** Hujjat **asosan BITTA** mavzu haqida, faqat **bir nechta** so'z boshqa mavzularga tegishli. Ya'ni ulushlar **teng emas** — biri **ustun** keladi.

</details>

### 🔴 Qiyin

**M7.** Nima uchun boshlanish **tasodifiy**?

**M8.** LDA ikki xil ishga tushirishda **turli** natija berishi mumkinmi?

<details>
<summary>✅ Javoblar</summary>

**M7.** Chunki algoritmda **boshlang'ich nuqta yo'q** — u mavzular haqida **hech narsa bilmaydi**. Tasodifiy boshlanish unga **noldan** boshlab, ma'lumotdan **o'zi** o'rganish imkonini beradi.

> 💡 Bu — **Gibbs sampling** deb ataladigan usul. Tasodifiy boshlanib, **asta-sekin** to'g'ri javobga **yaqinlashadi**.

**M8.** ## **HA!** Chunki boshlanish **tasodifiy**.

```python
# Har safar BOSHQA natija
LatentDirichletAllocation(n_components=5)

# Har safar BIR XIL natija ✅
LatentDirichletAllocation(n_components=5, random_state=42)
```

> ## ⚠️ **`random_state` ni DOIM qo'ying** — aks holda natijangizni **takrorlab bo'lmaydi**, va hamkasbingiz boshqa natija oladi.

</details>

---

## 🧠 O'zini tekshirish savollari

1. `latent` va `Dirichlet` nimani anglatadi?
2. `k` kim tomonidan tanlanadi?
3. Birinchi iteratsiyada nima bo'ladi?
4. Tuzatish qaysi ikki narsaga qaraydi?
5. Algoritm qachon to'xtaydi?
6. LDA nima qaytaradi?
7. LDA'ning 3 ta chekloviI?

<details>
<summary>✅ Javoblar</summary>

1. **`latent`** = yashirin *(mavzu yozilmagan)*. **`Dirichlet`** = taqsimot farazi *(hujjat asosan bitta mavzu haqida)*.
2. ## **SIZ.** Model o'zi topa olmaydi.
3. So'zlar mavzularga **TASODIFIY** tayinlanadi.
4. ① **Bu hujjatdagi** boshqa so'zlarning mavzusi ② **Bu so'zning** boshqa hujjatlardagi mavzusi.
5. **Barqaror holatga** yetganda — tayinlashlar deyarli **o'zgarmay qolganda**.
6. ① Hujjat→mavzu **ehtimollari** ② Mavzu→so'z **ehtimollari**.
7. K ni o'zi topmaydi · Tasodifiy · Mavzuga nom bermaydi · So'z tartibini yo'qotadi *(istalgan 3 tasi)*.

</details>

---

## 📌 Xulosa

```
LDA = Latent Dirichlet Allocation

  latent    = YASHIRIN (mavzu matnda yozilmagan)
  Dirichlet = hujjat ASOSAN BITTA mavzu haqida


ALGORITM

  0 · k ni tanlang              ← SIZ! (7-dars)
  1 · So'zlarni TASODIFIY tayinlang
  2 · Har so'zni QAYTA ko'ring:
        ① bu hujjatdagi boshqa so'zlar qaysi mavzuda?
        ② bu so'z boshqa hujjatlarda qaysi mavzuda?
  3 · BARQAROR HOLATGACHA takrorlang


MISOL

  Boshida (tasodifiy):
    A: ball, match, party, goal, player    😵
    B: player, vote, election, ball

  Oxirida:
    A: ball, player, match, goal      ⚽ SPORT
    B: vote, party, election          🏛️ SIYOSAT   ✅


NATIJA — IKKITA jadval

  ① D1: A 92% · B 8%          (hujjat → mavzu)
  ② A: 0.31*"ball" + ...      (mavzu → so'z)


⚠️ CHEKLOVLAR
  · k ni SIZ tanlaysiz
  · TASODIFIY → random_state=42 qo'ying!
  · Mavzuga NOM bermaydi
  · So'z tartibini yo'qotadi
  · TOZALASH juda muhim (4-darsda ko'ramiz)
```

---

## 🔖 Atamalar

| Atama | Inglizcha | Izoh |
|---|---|---|
| LDA | *Latent Dirichlet Allocation* | Ehtimollik asosidagi mavzu modeli |
| Yashirin | *latent* | Ko'rinmaydigan |
| Dirichlet taqsimoti | *Dirichlet distribution* | Ulushlar teng bo'lmasin farazi |
| Iteratsiya | *iteration* | Takroriy qadam |
| Barqaror holat | *steady state* | O'zgarish to'xtagan holat |
| Tayinlash | *assignment* | So'zni mavzuga biriktirish |
| `k` / `n_components` | *number of topics* | Mavzular soni |

---

⬅️ [Oldingi: Qachon ishlatiladi](02-When-to-Use-Topic-Modelling.md) · 🏠 [Modul boshiga](README.md) · ➡️ [Keyingi: LDA Python'da](04-LDA-in-Python.md)
