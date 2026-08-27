# 📝 63-modul. Mashqlar

> **22 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Kalit **kerak emas** — `tiktoken`, `sqlite3`, mahalliy model.

---

## 🟢 1-mashq. Hosting narxi

4 va 6 ta A100 uchun haftalik narxni hisoblang.

<details><summary>Yechim</summary>

```python
for n in [4, 6]:
    h = 2.50 * n * 24 * 7
    print(f"{n} × A100: ${h:,.0f}/hafta = ${h*52:,.0f}/yil")
```

```
4 × A100: $1,680/hafta = $87,360/yil
6 × A100: $2,520/hafta = $131,040/yil
```
</details>

---

## 🟢 2-mashq. Model xotirasi

180B model `fp16` va `int4` da qancha xotira oladi?

<details><summary>Yechim</summary>

```python
import math
def xotira(p_mlrd, bayt):
    g = p_mlrd * 1e9 * bayt / 1024**3
    return round(g, 2), round(g*1.4, 2), math.ceil(g*1.4/80)

for a, b in [("fp16", 2), ("int4", 0.5)]:
    o, am, n = xotira(180, b)
    print(f"{a}: {o} GB og'irlik · {am} GB amaliy · {n} × A100")
```

```
fp16: 335.28 GB og'irlik · 469.39 GB amaliy · 6 × A100
int4: 83.82 GB og'irlik · 117.35 GB amaliy · 2 × A100
```
</details>

---

## 🟡 3-mashq. 💥 "1 token ≈ 4 belgi" qoidasi

98 so'zlik inglizcha matnda tekshiring.

<details><summary>Yechim</summary>

```python
import tiktoken
enc = tiktoken.get_encoding("o200k_base")
n = len(enc.encode(MATN))
print(f"{len(MATN)} belgi / {n} token = {len(MATN)/n:.2f} belgi/token")
```

```
753 belgi / 112 token = 6.72 belgi/token      💥 kutilgan 4.00
```
</details>

---

## 🟡 4-mashq. Qoida matn turiga bog'liqmi?

Beshta turdagi matnni solishtiring.

<details><summary>Yechim</summary>

```
oddiy nasr    6.72 belgi/token
texnik matn   4.70
kod           3.73
o'zbekcha     3.16
URL/JSON      2.48
raqamlar      2.00      💥 3.4× diapazon
```
</details>

---

## 🟡 5-mashq. Chat formatining qo'shimcha tokenlari

Sof matn va chat formatidagi farqni o'lchang.

<details><summary>Yechim</summary>

```python
xab = [{"role": "system", "content": "You are an HR interviewer at Google."},
       {"role": "user", "content": "Hello, I'm ready to start."}]
sof = sum(len(enc.encode(m["content"])) for m in xab)
toliq = sum(3 + sum(len(enc.encode(str(v))) for v in m.values()) for m in xab) + 3
print(f"{sof} -> {toliq} token (+{toliq-sof}, {(toliq/sof-1)*100:.0f}%)")
```

```
15 -> 26 token (+11, 73%)
```
</details>

---

## 🟡 6-mashq. Kursning narx misoli

7000 bajarilish, 3000 kirish, 2000 chiqish — uchta modelda.

<details><summary>Yechim</summary>

```
gpt-4o-mini    $ 11.55      🏆
gpt-3.5-turbo  $ 31.50
gpt-4o         $192.50      💥 16.7×
```
</details>

---

## 🟡 7-mashq. Teng nuqta

Necha so'rovdan keyin API hostingdan qimmat bo'ladi?

<details><summary>Yechim</summary>

```python
H = 2.50 * 6 * 24 * 7
for m, (ki, ch) in NARXLAR.items():
    n1 = (3000*ki + 2000*ch) / 1e6
    n = H / n1
    print(f"{m:16s} haftasiga {n:>12,.0f} = sekundiga {n/(24*7)/3600:.1f}")
```

`gpt-4o-mini` → sekundiga **2.5** so'rov *(6 A100 bilan)*.
</details>

---

## 🟡 8-mashq. Tarixni qisqartirish

20 navbatli suhbatda oynani kamaytiring.

<details><summary>Yechim</summary>

```
butun tarix      $66.00 / 10k
oxirgi 6 navbat  $44.16
oxirgi 4 navbat  $37.20
oxirgi 2 navbat  $29.28      ⭐ 2.3× tejash
```
</details>

---

## 🟡 9-mashq. Byudjet nazoratchisi

Kunlik va so'rov chegarasi bilan sinf yozing.

<details><summary>Yechim</summary>

To'liq kod — [4-dars](04-Pricing.md).

⚠️ **Chegarani model narxiga qarab qo'ying**: `gpt-4o-mini` da 60 000 token atigi **$0.0093**.
</details>

---

## 🟡 10-mashq. Kursning tizim prompti

Uni o'lchang va o'rin egallovchilarni toping.

<details><summary>Yechim</summary>

```python
import re
print(len(enc.encode(KURS_PROMPT)), "token")
print(sorted(set(re.findall(r"\{(\w+)\}", KURS_PROMPT))))
```

```
183 token
['company', 'experience', 'name', 'position', 'question_1', 'question_2', 'skills']
```
</details>

---

## 🔴 11-mashq. ⭐⭐ Prompt sifatga ta'siri

To'rt bosqichli promptni mahalliy modelda sinang.

<details><summary>Yechim</summary>

```
A  5 tok  "Sure! What's your question?"                   💥
B 17 tok  "Great! What's your background in data..."      ⚠️
C 33 tok  "What is your experience with data analysis..." ✅
D 44 tok  "Q: " prefiksi BAJARILMADI                      💥
```

## 🔑 **Ko'proq ko'rsatma ≠ yaxshiroq natija.**
</details>

---

## 🔴 12-mashq. Prompt quruvchi

Beshta qismli promptni quradigan sinf yozing.

<details><summary>Yechim</summary>

`rol` → `kontekst` → `vazifa` → `cheklov` → `format`.
To'liq kod — [5-dars](05-Initial-Prompt-Development-1.md). Natija: **138 token**.
</details>

---

## 🔴 13-mashq. 💥 Baholash bandlari

Kursning 1–4, 5–6, 7–8, 9–10 shkalasini tahlil qiling.

<details><summary>Yechim</summary>

```
1-4  kenglik 4      💥 shkalaning 40% i
5-6  kenglik 2
7-8  kenglik 2
9-10 kenglik 2
```

Yaxshiroq: **3, 3, 2, 2**.
</details>

---

## 🔴 14-mashq. Bitta prompt vs ikkinchi so'rov

Narx farqini hisoblang.

<details><summary>Yechim</summary>

```
bitta_prompt     $13.67 / 10k
ikkinchi_sorov   $15.61 / 10k      ⭐ atigi 14.2% qimmat
```
</details>

---

## 🔴 15-mashq. ⭐ Himoyalangan JSON parser

Markdown fence, ortiqcha matn va oxirgi vergulga chidamli parser yozing.

<details><summary>Yechim</summary>

Uch qatlam: ① fence olib tashlash · ② `{...}` kesish · ③ vergul tuzatish.
To'liq kod — [6-dars](06-Initial-Prompt-Development-2.md).
</details>

---

## 🔴 16-mashq. 💥 JSON mazmunini tekshiring

Model JSON to'g'ri berdi. Mazmuni-chi?

<details><summary>Yechim</summary>

```
tekshiruv: ["strengths: nomzod nuqtai nazaridan yozilgan ('I ...')",
            'improvements: 1 ta, kamida 2 ta kerak']
```

## 🔑 **Sintaksis ✅ ≠ mazmun ✅.**
</details>

---

## 🔴 17-mashq. MB sxemasini quring

6 ta jadval, 2 ta N:M bog'liqlik.

<details><summary>Yechim</summary>

```python
db = sqlite3.connect(":memory:")
db.executescript(SXEMA)
for j in [r[0] for r in db.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]:
    print(j, len(db.execute(f"PRAGMA foreign_key_list({j})").fetchall()), "FK")
```
</details>

---

## 🔴 18-mashq. 💥💥 SQLite FK tuzog'i

`PRAGMA foreign_keys` qachon ishlamaydi?

<details><summary>Yechim</summary>

```python
d = sqlite3.connect(":memory:")
d.executescript(S)
d.execute("INSERT INTO positions VALUES (1,'DS')")   # tranzaksiya ochiladi
d.execute("PRAGMA foreign_keys = ON")                # 💥 e'tiborsiz
print(d.execute("PRAGMA foreign_keys").fetchone()[0])
```

```
0        💥 yoqilmadi
```

**Yechim:** pragmani **ulanishdan keyin darrov** qo'ying.
</details>

---

## 🔴 19-mashq. Savol tanlash mantiqi

Uch bosqichli kengaytirish yozing.

<details><summary>Yechim</summary>

① lavozim + kompaniya → ② faqat lavozim → ③ umumiy.
Kengaytirishsiz **yangi kompaniyada bo'sh prompt** chiqadi.
</details>

---

## 🔴 20-mashq. ⭐ Diagramma yo'llarini sanang

Tsikli bor grafda yo'llar sonini hisoblang.

<details><summary>Yechim</summary>

```
max_tsikl=1: 2 yo'l     (tsikl aylanmaydi)
max_tsikl=2: 4 yo'l     ⭐ tsikl 1 marta
max_tsikl=3: 6 yo'l
```

## ⚠️ Tsikli bor diagrammada yo'llar **cheksiz** — chegara shart.
</details>

---

## 🔴 21-mashq. ⭐⭐ Mermaid parseri

Diagrammani parse qilib, tuzilish xatolarini toping.

<details><summary>Yechim</summary>

```
💥 boshlanish tugunlari: ['A', 'F'] (1 ta bo'lishi kerak)
💥 C — qaror, lekin 1 chiqish
⚠️ E — chiqishsiz faoliyat
```

## ⭐ Bu CI da ishlashi mumkin — diagramma buzilsa **build yiqiladi**.
</details>

---

## 🔴 22-mashq. ⭐⭐ Reja hisoboti

Butun rejalashtirishni bitta funksiyaga yig'ing.

<details><summary>Yechim</summary>

```
300 suhbat/kun     -> $14.05/oy   -> API
500 000 suhbat/kun -> $23 409/oy  -> HOSTING
teng nuqta: 230 681 suhbat/kun
```

## 🔑 **Teng nuqta suhbat shakliga bog'liq** — 1-darsdagi 147 000 dan farq qiladi.
</details>

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
