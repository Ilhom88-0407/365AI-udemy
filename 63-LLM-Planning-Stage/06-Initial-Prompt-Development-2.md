# 6-dars. Boshlang'ich prompt ishlab chiqish — 2-qism ⭐⭐

## 🎬 Boshlashdan oldin

> **"Kursning baholash shkalasi: 1–4, 5–6, 7–8, 9–10. Bandlar teng emas — 4, 2, 2, 2. Ya'ni shkalaning 40% i 'yomon' degan yagona ma'noni bildiradi."**

---

## 1. Kursning baholash tizimi

> ## 🔑 **KURS AYTADI:** ## *"1 dan 10 gacha umumiy ball bering. ## 1–4 — nomzod ko'rib chiqilmasligi mumkin. ## 5–6 — yollanish ehtimoli past. ## 7–8 — istiqbolli nomzod. ## 9–10 — eng kuchli talabgor."*

### 📊 Bandlarni o'lchaymiz

| Band | Kenglik | Ma'nosi |
|---|---|---|
| ## **1–4** | ## 💥 **4** | *ko'rib chiqilmaydi* |
| 5–6 | 2 | *ehtimol past* |
| 7–8 | 2 | *istiqbolli* |
| 9–10 | 2 | *eng kuchli* |

> ## 💥 **BANDLAR TENG EMAS: 4, 2, 2, 2.**
>
> ## ## 🔑 **YA'NI SHKALANING 40% I — BITTA MA'NO** *("yomon")*, ## qolgan 60% i **uchta bandga** bo'lingan.

### ⚠️ Nima uchun bu muammo?

```
   Model 1, 2, 3 yoki 4 bersa — foydalanuvchi UCHUN farq YO'Q.
   Lekin model UCHUN farq bor: u 4 ta variantdan birini tanlaydi.

   Natija: bir xil javob bugun 2, ertaga 4 ball olishi mumkin —
           va foydalanuvchi "ball o'zgardi" deb o'ylaydi,
           aslida ma'no o'zgarmagan.
```

> ## ⭐ **YAXSHIROQ YECHIM — TENG BANDLAR:**
>
> | Band | Kenglik | Ma'nosi |
> |---|---|---|
> | 1–3 | 3 | zaif |
> | 4–6 | 3 | o'rtacha |
> | 7–8 | 2 | yaxshi |
> | 9–10 | 2 | a'lo |
>
> ## ## 💡 **YOKI — UMUMAN BANDSIZ:** ## faqat 1–10 ball + **matnli izoh**.

---

## 2. ⭐⭐ Kursning ikkita yondashuvi

> ## 🔑 **KURS AYTADI:** ## *"Birinchi usul — prompt shablonini kengaytirish: ## 'olti savol va javobdan keyin baholang...'. "*

| Usul | Qanday | Afzalligi | Kamchiligi |
|---|---|---|---|
| ## ① **Bitta prompt** | Baholash **shu promptda** | ⭐ oddiy | ## 💥 **model unutadi** |
| ## ② **Ikkinchi so'rov** | Tarix → **alohida** prompt | ## ⭐ **ishonchli** | ⚠️ qo'shimcha narx |

### 🔬 Narxini o'lchaymiz

```python
def baholash_narxi(usul, tizim_tok=212, navbatlar=6,
                   savol_tok=40, javob_tok=120, baho_tok=400):
    kirish, tarix = 0, tizim_tok
    for _ in range(navbatlar):
        kirish += tarix
        tarix += savol_tok + javob_tok

    chiqish = navbatlar * (savol_tok + javob_tok)
    if usul == "ikkinchi_sorov":
        kirish += tarix + 120          # ⭐ butun tarix + baholash ko'rsatmasi
        chiqish += baho_tok
    else:
        chiqish += baho_tok            # oxirgi javobga qo'shiladi

    narx = (kirish * 0.150 + chiqish * 0.600) / 1e6
    return kirish, chiqish, narx
```

```python
for u in ["bitta_prompt", "ikkinchi_sorov"]:
    k, c, n = baholash_narxi(u)
    print(f"{u:16s} kirish {k:>6,} · chiqish {c:>5,} · "
          f"${n:.6f} · 10k ${n*10000:>7,.2f}")
```

### ✅ Haqiqiy natija

```
bitta_prompt     kirish  3,672 · chiqish 1,360 · $0.001367 · 10k $  13.67
ikkinchi_sorov   kirish  4,964 · chiqish 1,360 · $0.001561 · 10k $  15.61
```

> ## ⭐ **IKKINCHI SO'ROV ATIGI 14.2% QIMMAT.**
>
> ## ## 🏆 **VA U ANCHA ISHONCHLIROQ:** ## model **6 navbat davomida** ko'rsatmani eslab qolishi shart emas.

> ## 💡 **VA YANA BIR AFZALLIK:** ## baholash promptini **alohida sinash va yaxshilash** mumkin — ## intervyu promptiga **tegmasdan**.

---

## 3. 💥 Chiqish formati — kursning eng katta bo'shlig'i

Kurs baholashni **erkin matn** sifatida so'raydi. Dasturda esa **ball kerak** — raqam sifatida.

```
   Model qaytarishi mumkin:
     "Overall score: 7/10"
     "I would rate this candidate 7 out of 10."
     "**Score:** 7"
     "Score: seven"                      💥
     "Based on the interview, 7-8."      💥 ikkita raqam
```

> ## 💥 **BULARNING HAMMASINI PARSE QILISH — ISHONCHSIZ.**

### ✅ Yechim — **JSON** so'rash

```python
JSON_FORMAT = """Return ONLY valid JSON, no markdown fences, in this exact shape:
{
  "overall_score": <integer 1-10>,
  "criteria": {
    "communication": <integer 1-10>,
    "technical_depth": <integer 1-10>,
    "structure": <integer 1-10>,
    "cultural_fit": <integer 1-10>
  },
  "strengths": [<string>, ...],
  "improvements": [<string>, ...]
}"""
```

### 🔬 Mahalliy model bilan sinaymiz

```python
o = llm([{"role": "system", "content": BAHO_PROMPT + "\n\n" + JSON_FORMAT},
         {"role": "user", "content": SUHBAT}],
        max_new_tokens=300, do_sample=False)
xom = o[0]["generated_text"][-1]["content"].strip()
print(xom[:400])
```

### 💥 Haqiqiy natija

```
{
  "overall_score": 7,
  "criteria": {
    "communication": 5,
    "technical_depth": 8,
    "structure": 9,
    "cultural_fit": 8
  },
  "strengths": [
    "I asked what decision the result will change",
    "I explained the trade-offs to the product team"
  ],
  "improvements": [
    "I should have asked more specific questions about the results"
  ]
}
```

> ## 🏆🏆 **JSON TO'G'RI CHIQDI — 0.5B MODELDA, FENCE SIZ.**
>
> ## ## 🔧 **MEN "MARKDOWN FENCE QO'SHADI" DEB KUTGAN EDIM.** ## Haqiqat: model *"no markdown fences"* ko'rsatmasini ## **to'liq bajardi**.

### 💥 Lekin uchta jiddiy muammo bor

| # | Muammo | Isbot |
|---|---|---|
| ## ① | ## **`improvements` — 1 ta, 2 talab qilingan** | promptda *"at least 2 improvements"* |
| ## ② | ## **Roli almashib ketgan** | *"**I** asked..."*, *"**I** explained..."* — ## bu **nomzodning** so'zlari, baholovchining emas |
| ## ③ | ## **Ballar mos emas** | `communication` **5**, lekin `structure` **9** ## va `strengths` da *"clear communication"* yo'q |

> ## 💥💥 **② — ENG XAVFLISI.** ## Model **nomzod nuqtai nazaridan** yozdi. ## Foydalanuvchi *"men nima qilishim kerak"* deb o'qiydi, ## aslida bu — **nomzodning o'z gaplari**.
>
> ## ## 🔑 **VA BU — 0.5B MODELNING CHEKLOVI.** ## Katta modelda bunday xato **kamdan-kam**.

> ## 🏆 **XULOSA:** ## JSON **strukturasi** — ✅ ishonchli. ## JSON **mazmuni** — ⚠️ **tekshirish kerak**. ## ## ⭐ Shuning uchun `baho_tekshir()` **sxemani ham, mantiqni ham** tekshirishi kerak.

### ✅ Shuning uchun — **himoyalangan parser**

```python
import json, re


def json_ajrat(xom):
    """LLM chiqishidan JSON ni ishonchli ajratadi."""
    if not xom:
        return None, "bo'sh javob"

    # ① markdown fence ni olib tashlash (backtick literal yozilmagan)
    BT = chr(96) * 3
    m = re.search(BT + r"(?:json)?\s*(.*?)" + BT, xom, re.S)
    matn = m.group(1) if m else xom

    # ② birinchi { dan oxirgi } gacha
    a, b = matn.find("{"), matn.rfind("}")
    if a == -1 or b == -1 or b < a:
        return None, "JSON topilmadi"
    matn = matn[a:b + 1]

    try:
        return json.loads(matn), "ok"
    except json.JSONDecodeError as e:
        # ③ oxirgi vergulni tuzatish
        tuzatilgan = re.sub(r",(\s*[}\]])", r"\1", matn)
        try:
            return json.loads(tuzatilgan), "vergul tuzatildi"
        except json.JSONDecodeError:
            return None, f"JSON xato: {e}"


def baho_tekshir(d):
    """Sxemani tekshiradi."""
    xato = []
    if not isinstance(d, dict):
        return ["dict emas"]
    s = d.get("overall_score")
    if not isinstance(s, int) or not 1 <= s <= 10:
        xato.append(f"overall_score noto'g'ri: {s!r}")
    kr = d.get("criteria")
    if not isinstance(kr, dict):
        xato.append("criteria yo'q")
    else:
        for k in ["communication", "technical_depth", "structure", "cultural_fit"]:
            v = kr.get(k)
            if not isinstance(v, int) or not 1 <= v <= 10:
                xato.append(f"criteria.{k} noto'g'ri: {v!r}")
    for k in ["strengths", "improvements"]:
        v = d.get(k)
        if not isinstance(v, list):
            xato.append(f"{k} ro'yxat emas")
        elif len(v) < 2:                       # ⭐ promptda "at least 2"
            xato.append(f"{k}: {len(v)} ta, kamida 2 ta kerak")
        elif any(str(x).strip().lower().startswith(("i ", "i'"))
                 for x in v):                  # ⚠️ rol almashinuvi
            xato.append(f"{k}: nomzod nuqtai nazaridan yozilgan ('I ...')")
    return xato
```

```python
d, holat = json_ajrat(xom)
print(f"ajratish: {holat}")
print(f"tekshiruv: {baho_tekshir(d) or '✅ sxema to`g`ri'}")
print(f"ball: {d['overall_score']}/10")
```

```
ajratish : ok
tekshiruv: ["strengths: nomzod nuqtai nazaridan yozilgan ('I ...')",
            'improvements: 1 ta, kamida 2 ta kerak']
ball     : 7/10
```

> ## 🏆🏆 **TEKSHIRUVCHI IKKALA MUAMMONI HAM TUTDI.**
>
> ## ## ⭐ **VA MANA NEGA U KERAK:** ## JSON **sintaktik jihatdan to'g'ri** edi — ## `json.loads()` hech qanday xato bermadi. ## ## 💥 **Muammo mazmunda edi.**

> ## 🔑 **IKKI DARAJALI TEKSHIRUV:**
>
> | Daraja | Nima tekshiradi | Vosita |
> |---|---|---|
> | ## ① **Sintaksis** | JSON buzilmaganmi | `json.loads()` |
> | ## ② **Sxema** | Maydonlar bormi, tur to'g'rimi | qo'lda |
> | ## ③ **Mantiq** | Mazmun **mos**mi | ## ⭐ **qo'lda — eng muhimi** |
>
> ## ## 💥 **Ko'pchilik faqat ① ni qiladi.**

---

## 4. ⭐ Baholash promptining to'liq shakli

```python
BAHO_PROMPT = """You are an expert interview assessor.

You will receive the full transcript of a job interview for the position of
{position} at {company}.

Evaluate the candidate on four criteria, each scored 1-10:
- communication: clarity, structure, conciseness
- technical_depth: correctness and depth of technical content
- structure: use of frameworks such as STAR
- cultural_fit: motivation and alignment with the company

Scoring bands (apply to overall_score):
  1-3  weak        — not competitive for this role
  4-6  average     — some gaps, would need a second round
  7-8  strong      — competitive candidate
  9-10 exceptional — top of the pool

Rules:
- Base every score ONLY on what the candidate actually said.
- If the transcript is too short to judge a criterion, score it 5 and say so.
- Give at least 2 strengths and at least 2 improvements.
- Each improvement must be actionable."""
```

> ## ⭐ **UCHTA MUHIM QATOR:**
>
> ## ① *"Base every score ONLY on what the candidate actually said"* ## → **gallyutsinatsiyaga qarshi** *(67-modul)*
> ## ② *"If the transcript is too short... score it 5 and say so"* ## → **noaniqlikni tan olishga ruxsat**
> ## ③ *"Each improvement must be actionable"* ## → **foydali chiqish**

### 🔬 O'lchaymiz

| | Tokenlar |
|---|---|
| `BAHO_PROMPT` *(to'ldirilgan)* | 205 |
| `JSON_FORMAT` | 104 |
| ## **JAMI** | ## **309** |

> ## 💰 **309 TOKEN — BITTA SO'ROVDA, BIR MARTA.** ## `gpt-4o-mini` da **$0.000046**. ## ## 🏆 **10 000 baholash uchun $0.46.** ## Ishonchlilik uchun — **arzon narx**.

---

## 🎯 Nazorat savollari

1. Kursning baholash bandlari teng-mi?
2. Nima uchun teng bo'lmagan bandlar muammo?
3. Bitta prompt va ikkinchi so'rov — qaysi biri qimmat va qanchaga?
4. Nega baholashni JSON da so'rash kerak?
5. Model *"no markdown fences"* ko'rsatmasini bajardimi?
6. `json_ajrat()` funksiyasining uch qatlami nima?

<details>
<summary>Javoblar</summary>

1. ## **Yo'q: 4, 2, 2, 2.** Shkalaning **40%** i (1–4) bitta ma'noni bildiradi, qolgan 60% i uchta bandga bo'lingan.
2. Model 1, 2, 3 yoki 4 bersa — foydalanuvchi uchun **farq yo'q**, lekin **ball o'zgarib turadi**. Bu *"natija beqaror"* taassurotini beradi. Yaxshiroq: **3, 3, 2, 2**.
3. **Ikkinchi so'rov** qimmat — lekin atigi **14.2%** ($15.61 vs $13.67, 10 000 suhbat uchun). Evaziga model **6 navbat davomida ko'rsatmani eslab qolishi shart emas**.
4. Chunki erkin matnda ball **beshta xil ko'rinishda** kelishi mumkin (`"7/10"`, `"seven"`, `"7-8"`...) — **parse qilish ishonchsiz**.
5. ## **Ha, bajardi** — fence umuman qo'shmadi. Men **teskarisini kutgan edim**. ## 💥 **Lekin mazmunda ikkita xato bor edi:** `improvements` **1 ta** (2 talab qilingan) va `strengths` **nomzod nuqtai nazaridan** yozilgan (*"I asked..."*).
6. ## ① markdown fence ni olib tashlash · ② birinchi `{` dan oxirgi `}` gacha kesish · ③ oxirgi vergulni tuzatib qayta urinish. Keyin **sxema tekshiruvi**.

</details>

---

⬅️ [5-dars](05-Initial-Prompt-Development-1.md) · 🏠 [Modul](README.md) · ➡️ [7-dars](07-Database-Design.md)
