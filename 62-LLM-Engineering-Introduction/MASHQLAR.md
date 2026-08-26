# 📝 62-modul. Mashqlar

> **14 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Kalit **kerak emas** — `tiktoken` va mahalliy model.

---

## 🟢 1-mashq. Birinchi token sanash

Matnning token sonini hisoblang.

<details><summary>Yechim</summary>

```python
import tiktoken

enc = tiktoken.get_encoding("o200k_base")
t = "Machine learning models require large amounts of training data."
print(f"{len(t)} belgi -> {len(enc.encode(t))} token")
```

```
63 belgi -> 10 token
```
</details>

---

## 🟢 2-mashq. Tokenlarni ko'ring

Har bir token nima ekanini chiqaring.

<details><summary>Yechim</summary>

```python
for tok in enc.encode("Machine learning models"):
    print(f"{tok:>7}  {enc.decode([tok])!r}")
```

```
  25519  'Machine'
   7524  ' learning'
   7015  ' models'
```

Tokenlar — **so'zlar emas**. Ular **bo'shliq bilan** boshlanadi.
</details>

---

## 🟡 3-mashq. 💥 O'zbekcha necha token?

Bir xil ma'noli inglizcha va o'zbekcha matnni solishtiring.

<details><summary>Yechim</summary>

```python
E = "Machine learning models require large amounts of training data."
U = "Mashinali o'rganish modellari katta hajmdagi o'quv ma'lumotlarini talab qiladi."

for til, t in [("ingliz", E), ("o'zbek", U)]:
    n = len(enc.encode(t))
    print(f"{til:8s} {len(t):3d} belgi -> {n:3d} token  ({len(t)/n:.2f} belgi/token)")
```

```
ingliz    63 belgi ->  10 token  (6.30 belgi/token)
o'zbek    79 belgi ->  23 token  (3.43 belgi/token)      💥 2.30×
```
</details>

---

## 🟡 4-mashq. Tokenizatorlar farqi

`cl100k_base` va `o200k_base` ni solishtiring.

<details><summary>Yechim</summary>

```python
for e in ["cl100k_base", "o200k_base"]:
    enc = tiktoken.get_encoding(e)
    print(f"{e:14s} ingliz {len(enc.encode(E)):3d}  o'zbek {len(enc.encode(U)):3d}")
```

```
cl100k_base    ingliz  10  o'zbek  33
o200k_base     ingliz  10  o'zbek  23      ⭐ 1.43× tejamli
```

O'zbek tilida ishlasangiz — **`o200k` li modellarni** tanlang.
</details>

---

## 🟡 5-mashq. O'zbekcha tokenlarni ko'ring

Nega o'zbekcha ko'p token oladi?

<details><summary>Yechim</summary>

```python
enc = tiktoken.get_encoding("o200k_base")
for tok in enc.encode("Mashinali o'rganish"):
    print(f"{tok:>7}  {enc.decode([tok])!r}")
```

```
 193514  'Mash'
 168152  'inali'
    293  ' o'
  15770  "'r"
   5976  'gan'
   1109  'ish'
```

💥 **`"Mashinali o'rganish"` — ikkita so'z, LEKIN 6 ta token.**
Inglizcha `"Machine learning"` esa **2 ta token**.

🔑 Sabab: o'zbekcha so'zlar **bo'lak-bo'lak** kodlanadi —
`Mash` + `inali`, `o` + `'r` + `gan` + `ish`.
Apostrof (`'`) **alohida token** ichiga tushadi.
</details>

---

## 🟡 6-mashq. CAGR hisoblang

Kursning bozor prognozini tekshiring.

<details><summary>Yechim</summary>

```python
b0, b1, yil = 6.4, 140.8, 9
cagr = (b1 / b0) ** (1 / yil) - 1
print(f"o'sish {b1/b0:.1f}×  CAGR {cagr*100:.1f}%")

for c in [0.20, 0.30, 0.41]:
    print(f"  CAGR {c*100:4.1f}% -> ${b0*(1+c)**yil:6.1f} mlrd")
```

```
o'sish 22.0×  CAGR 41.0%
  CAGR 20.0% -> $  33.0 mlrd
  CAGR 30.0% -> $  67.9 mlrd
  CAGR 41.0% -> $ 141.0 mlrd
```
</details>

---

## 🟡 7-mashq. Narx kalkulyatori

Prompt narxini hisoblang.

<details><summary>Yechim</summary>

```python
NARX = {"kirish": 0.150, "chiqish": 0.600}     # $/1M — TEKSHIRING!

def narx(matn, chiqish=150):
    k = len(enc.encode(matn))
    n = (k * NARX["kirish"] + chiqish * NARX["chiqish"]) / 1_000_000
    return k, n, n * 10_000

k, n, n10k = narx("Siz tajribali HR mutaxassisisiz. Intervyu o'tkazing.")
print(f"{k} token · ${n:.8f} · 10 000 marta ${n10k:.2f}")
```
</details>

---

## 🔴 8-mashq. 🏆 Mahalliy modelni ishga tushiring

Kalitsiz LLM javob olsin.

<details><summary>Yechim</summary>

```python
import time
from transformers import pipeline

t0 = time.perf_counter()
llm = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct",
               device=-1, dtype="auto")
print(f"yuklash {time.perf_counter()-t0:.1f} s · "
      f"{sum(x.numel() for x in llm.model.parameters())/1e6:.0f} M parametr")

o = llm([{"role": "user", "content": "Say hello in one sentence."}],
        max_new_tokens=30, do_sample=False)
print(o[0]["generated_text"][-1]["content"])
```

```
yuklash 3.1 s · 494 M parametr
```
</details>

---

## 🔴 9-mashq. 💥 O'zbekcha javob so'rang

Mahalliy modeldan o'zbekcha javob oling.

<details><summary>Yechim</summary>

```python
o = llm([{"role": "system", "content": "Siz HR mutaxassisisiz."},
         {"role": "user", "content": "Salom!"}],
        max_new_tokens=40, do_sample=False)
print(o[0]["generated_text"][-1]["content"])
```

```
Sizhi salom! Qaysiz mumkin?        💥 bu o'zbekcha emas
```

## 🔑 **Kichik mahalliy model bilan — ingliz tilida ishlang.**
</details>

---

## 🔴 10-mashq. ⭐⭐ Prompt sifatga qanchalik ta'sir qiladi?

Ikki xil promptni solishtiring.

<details><summary>Yechim</summary>

```python
P1 = "Ask exactly one question."
P2 = ("You are an experienced HR interviewer at Google, hiring for a "
      "Data Scientist role.\nQuestion type: Past behavior in a work situation "
      "(STAR format expected).\nAsk EXACTLY ONE question. Do not answer it. "
      "Do not add commentary. Output only the question.")

for nom, p in [("qisqa", P1), ("to'liq", P2)]:
    o = llm([{"role": "system", "content": p},
             {"role": "user", "content": "Begin."}],
            max_new_tokens=60, do_sample=False)
    print(f"[{nom}, {len(enc.encode(p))} token] "
          f"{o[0]['generated_text'][-1]['content'][:70]}")
```

```
[qisqa, 5 token]  What specific aspect of data science would you like to discuss?
                                                                   💥 savol emas
[to'liq, 51 token] What specific challenges have you faced while working on
                   data analysis projects and how did you overcome them?  ✅
```
</details>

---

## 🔴 11-mashq. 💥 Kategoriyalar bo'yicha sinov

To'rtta kategoriyani sinang. Nechtasi to'g'ri chiqadi?

<details><summary>Yechim</summary>

```
[hr/xulq]         "What specific challenges have you faced..."          ✅
[hr/boshqotirma]  "What is the primary goal of data science?"           💥
[texnik/kod]      "What is the purpose of using pandas?"                💥
[texnik/database] "What is the primary goal of using a database?"       💥
```

## 💥 **4 tadan 1 tasi.** Model `kod` va `database` ni **vazifa emas, mavzu** deb tushundi.
Tuzatish uchun **few-shot misollar** kerak (64-modul).
</details>

---

## 🔴 12-mashq. ⭐ `LLMAdapter` yozing

Bitta interfeys — ikkita orqa tomon.

<details><summary>Yechim</summary>

To'liq kod — [2-dars, 4-bo'lim](02-What-Does-the-Course-Cover.md).

Asosiy g'oya:

```
def javob(self, xabarlar, max_tokens=200, temperature=0.0):
    if self.backend == "mahalliy":
        ...transformers...
    return ...openai...
```

## 🔑 **Modellar tez o'zgaradi. Adapter bilan — bitta fayl o'zgaradi.**
</details>

---

## 🔴 13-mashq. Talabni o'lchanadigan qiling

*"Ilova tez ishlashi kerak"* ni tuzating.

<details><summary>Yechim</summary>

| Yomon | Yaxshi |
|---|---|
| *"tez ishlasin"* | **"95-protsentil < 3 s"** |
| *"arzon bo'lsin"* | **"bitta intervyu < $0.05"** |
| *"real bo'lsin"* | **"10 sinovdan ≥8 tasi 5 balldan ≥4"** |

## 🏆 **Har bir talab SON bilan tugashi kerak.**
</details>

---

## 🔴 14-mashq. ⭐⭐ MoSCoW hisoboti

Talablarni tasniflab, hisobot chiqaring.

<details><summary>Yechim</summary>

```python
def hisobot(talablar):
    n = len(talablar)
    o = sum(1 for t in talablar if t.olchanadi)
    m = sum(1 for t in talablar if t.ustuvorlik == "M")
    print(f"{n} talab · {o} o'lchanadi ({o/n*100:.0f}%)")
    if m > n * 0.6:
        print(f"⚠️ 'Must' {m}/{n} — juda ko'p, birinchi versiya kechikadi")
```

```
10 talab · 9 o'lchanadi (90%)
MoSCoW: M=5 S=3 C=1 W=1
```

## ⚠️ **Hamma narsa "Must" bo'lsa — hech narsa "Must" emas.**
</details>

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
