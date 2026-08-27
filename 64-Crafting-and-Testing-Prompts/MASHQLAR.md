# 📝 64-modul. Mashqlar

> **18 ta mashq.** 🟢 oson · 🟡 o'rta · 🔴 qiyin
> Kalit **kerak emas** — mahalliy model va `tiktoken`.

---

## 🟢 1-mashq. Kalitni xavfsiz o'qish

Kalit topilmasa yiqilmaydigan funksiya yozing.

<details><summary>Yechim</summary>

```python
import os

def kalit_ol(nom="OPENAI_API_KEY", majburiy=False):
    k = os.environ.get(nom)
    if not k and majburiy:
        raise RuntimeError(f"💥 {nom} topilmadi")
    if k and (not k.startswith("sk-") or len(k) < 20):
        raise ValueError(f"💥 shakl noto'g'ri: {k[:6]}...")
    return k

k = kalit_ol()
print(f"rejim: {'OpenAI' if k else 'MAHALLIY (kalitsiz)'}")
```

```
rejim: MAHALLIY (kalitsiz)
```
</details>

---

## 🟢 2-mashq. Prompt ishlab chiqish narxi

7 million token qancha turadi?

<details><summary>Yechim</summary>

```python
TOK = 7_000_000
for m, (ki, ch) in [("gpt-4o-mini", (0.150, 0.600)), ("gpt-4o", (2.5, 10.0))]:
    print(f"{m:14s} ${(TOK*0.6*ki + TOK*0.4*ch)/1e6:8.2f}")
```

```
gpt-4o-mini    $    2.31
gpt-4o         $   38.50
```

$5 minimal to'ldirish **arzon modelda yetadi**.
</details>

---

## 🟡 3-mashq. 💥 `temperature=2` ni sinang

Matn buziladimi? Uch o'lchov bilan tekshiring.

<details><summary>Yechim</summary>

```python
for t in [0.0, 1.0, 1.5, 2.0]:
    torch.manual_seed(0)
    txt = gen(SAVOL, do_sample=t > 0, temperature=t or None, top_p=1.0, top_k=0)
    w = txt.split()
    ascii_ = sum(1 for c in txt if ord(c) < 128) / len(txt)
    print(f"{t}: noyob {len(set(w))/len(w)*100:.1f}%  ASCII {ascii_*100:.1f}%  "
          f"o'rt.so'z {sum(len(x) for x in w)/len(w):.2f}")
```

```
0.0: noyob  78.5%  ASCII 100.0%  o'rt.so'z  4.48
1.5: noyob 100.0%  ASCII  86.3%  o'rt.so'z  8.53
2.0: noyob 100.0%  ASCII  69.7%  o'rt.so'z 12.74      💥
```
</details>

---

## 🟡 4-mashq. `temperature` va takrorlanuvchanlik

`0.3` deterministikmi?

<details><summary>Yechim</summary>

```
temperature=0.0: 1/5 turli natija      ⭐ DETERMINISTIK
temperature=0.3: 5/5 turli natija      💥
temperature=1.5: 5/5 turli natija
```

## 🔑 **Faqat `temperature=0`** deterministik.
</details>

---

## 🟡 5-mashq. ⭐ `top_p` qattiqroq nazorat

`temperature=1.0` bo'lsa ham barqarorlikni oling.

<details><summary>Yechim</summary>

```
top_p=0.1: 1/5 turli      ⭐ temperature=1.0 bo'lsa ham!
top_p=0.6: 5/5 turli
top_p=1.0: 5/5 turli
```

`top_p` ro'yxatni **bitta tokengacha** qisqartiradi.
</details>

---

## 🟡 6-mashq. Kursning sozlamalar jadvali

Oltita holatni sinang.

<details><summary>Yechim</summary>

```
kod (0.3/0.3)              1/3 turli   ⭐ barqaror
ma'lumot tahlili (0.2/0.1) 1/3 turli   ⭐
kampaniya g'oyalari (1.1/1.0) 3/3      💥 o'zgaruvchan
chatbot (1.0/1.0)          3/3         💥
```

Kursning mantiqi **ishlaydi**.
</details>

---

## 🟡 7-mashq. 💥 Bir xil sozlama, turli natija

`marketing matni` va `hisobot` — ikkalasi `0.3/0.5`. Nega farq qildi?

<details><summary>Yechim</summary>

```
marketing matni  3/3 turli   💥
hisobot          1/3 turli   ✅
```

## 🔑 **Vazifaning o'zi:** *"shior yozing"* — ko'p teng variant, *"xulosalang"* — bitta to'g'ri javob.
</details>

---

## 🟡 8-mashq. 💥💥 `temp=0.8` da baholash

Ball barqarormi?

<details><summary>Yechim</summary>

```
temp=0.0: ballar [8, 8, 8, 8, 8]  parse xatolari 0/5
temp=0.8: ballar [8, 0, 8, 8, 7]  parse xatolari 0/5
```

## 💥 **Ikkinchi qiymat — `0`**, promptdagi `1-10` diapazondan **tashqarida**.
JSON parse esa **o'tdi** — kod buni **sezmaydi**.
</details>

---

## 🟡 9-mashq. Sozlama profillari

Vazifa turiga qarab sozlama beradigan funksiya yozing.

<details><summary>Yechim</summary>

```python
PROFILLAR = {"deterministik": {"temperature": 0.0},
             "aniq": {"temperature": 0.2, "top_p": 0.3, "top_k": 0},
             "ijodiy": {"temperature": 1.0, "top_p": 1.0, "top_k": 0}}
VAZIFA_PROFIL = {"json": "deterministik", "kod": "aniq", "chatbot": "ijodiy"}
```

⚠️ `do_sample=False` bo'lganda `temperature` ni **olib tashlang**.
</details>

---

## 🔴 10-mashq. 🏆 Few-shot 62-modul muammosini tuzating

`kod` kategoriyasini sinang.

<details><summary>Yechim</summary>

```
zero-shot (45 tok) 💥 "What is the purpose of using the pandas library?"
few-shot  (97 tok) 🏆 "Write a Python function to find the second largest..."
```

Narxi: **+52 token** = `$0.0000078`/so'rov.
</details>

---

## 🔴 11-mashq. 💥 Baholovchining o'zini tekshiring

Kalit so'zli heuristika qanday xato qiladi?

<details><summary>Yechim</summary>

```python
if kat == "kod":
    return any(x in s for x in ["write", "function", "python", ...])
```

*"What is the purpose of using the `pandas` library in **Python**?"*
→ `"python"` bor → **"✅ kod savoli"**

## 💥 **Aslida bu nazariy savol.** Kalit so'z — **zaif signal**.
</details>

---

## 🔴 12-mashq. ⭐⭐ Qadamli prompt

Elektron xat javobini qadamlab so'rang.

<details><summary>Yechim</summary>

```
[qadamsiz] 37 tok · JSON: 💥 xato: Invalid control character
[qadamli ] 90 tok · JSON: ✅ ok · imzo ✓ · 3 jumla ✓ · request ✓
```

## 🏆 **+53 token — va hamma talab bajarildi.**
</details>

---

## 🔴 13-mashq. Prompt kutubxonasi

Versiyalaydigan va o'lchaydigan sinf yozing.

<details><summary>Yechim</summary>

```
intervyu   v1   11 token   0 o'rin
intervyu   v2   27 token   2 o'rin
intervyu   v3   41 token   4 o'rin

💥 to'ldirilmagan o'rinlar: ['kategoriya', 'misollar', 'position']
```

To'liq kod — [4-dars](04-Prompt-Engineering.md).
</details>

---

## 🔴 14-mashq. ⭐⭐ Avtomatik prompt sinovchisi

Beshta versiyani `n=12` da o'lchang.

<details><summary>Yechim</summary>

```
v1 oddiy      0.71 ±0.093
v2 rol        0.77 ±0.190
v3 cheklov    0.75 ±0.250
v4 KURSNIKI   0.58 ±0.186      💥 eng yomon
v5 few-shot   0.77 ±0.069      ⭐ eng barqaror
```
</details>

---

## 🔴 15-mashq. 💥💥 Kursning qo'shimchasi nega yomonlashtirdi?

`v3` va `v4` ni tekshiruvlar bo'yicha solishtiring.

<details><summary>Yechim</summary>

```
             preambulasiz
v3 cheklov      10/12
v4 kursniki      3/12      💥
```

Qo'shimchadagi *"creating a conversational flow"* modelni
`"Great! Let's get started..."` deb boshlashga **undadi**.
</details>

---

## 🔴 16-mashq. 💥 Few-shot ning yashirin narxi

`v5` qaysi tekshiruvdan yiqildi?

<details><summary>Yechim</summary>

```
             kontekstda
v2 rol          9/12      ⭐
v5 few-shot     1/12      💥
```

## 🔑 **Few-shot misollari modelni O'ZIGA tortadi.** Misollar tor bo'lsa — natija ham tor.
</details>

---

## 🔴 17-mashq. Statistik ishonchlilik

G'olib ishonchlimi?

<details><summary>Yechim</summary>

```
farq 0.000  <=  shovqin 0.500      ⚠️ G'OLIB ISHONCHLI EMAS
```

`v2` va `v5` — **teng** (0.77). `n` ni 4→12 oshirish **yordam bermadi**.

## ⭐ To'g'ri yo'l: **o'rtachaga emas, har bir tekshiruvga alohida** qarash.
</details>

---

## 🔴 18-mashq. ⭐⭐ Prompt sinovining to'g'ri tartibi

Beshta qadamni yozing.

<details><summary>Yechim</summary>

```
① Tekshiruvlarni YOZING (prompt yozishdan OLDIN)
② Bazaviy promptni o'lchang
③ BITTA narsani o'zgartiring
④ Qayta o'lchang — n >= 20
⑤ Farq > 2×std bo'lsa QABUL QILING, aks holda TASODIF
```

## 💥 **Eng ko'p qilinadigan xato — ① ni tashlab ketish.**
</details>

---

🏠 [Modul](README.md) · 🚀 [Loyihalar](LOYIHALAR.md)
