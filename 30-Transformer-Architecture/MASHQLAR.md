# 📝 30-modul mashqlari

> **44 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> Bu modul nazariy, lekin **hamma nazariya HAQIQIY MODELDA tekshiriladi**.
> Bu — butun darslikdagi eng texnik blok.

## ⚙️ Tayyorgarlik

```python
import warnings; warnings.filterwarnings("ignore")
import torch
import torch.nn.functional as F
import numpy as np
import pandas as pd
from transformers import (AutoTokenizer, AutoModel,
                          AutoModelForCausalLM, AutoConfig)

M = "distilbert-base-uncased-finetuned-sst-2-english"
tok = AutoTokenizer.from_pretrained(M)
mod = AutoModel.from_pretrained(M, attn_implementation="eager")

JUMLA = "The New York Times is a daily newspaper. It was first issued in 1851."
enc = tok(JUMLA, return_tensors="pt")
toks = tok.convert_ids_to_tokens(enc["input_ids"][0])
with torch.no_grad():
    out = mod(**enc, output_attentions=True, output_hidden_states=True)
A = out.attentions
```

---

# 🟢 OSON *(1–15)*

**M1.** Transformer qachon va kim tomonidan ishlab chiqilgan?

**M2.** RNN ning ikkita asosiy muammosi?

**M3.** 2017-yilgi maqola nomi?

**M4.** Q, K, V nimani anglatadi?

**M5.** E'tibor formulasini yozing.

**M6.** Transformer qaysi ikki blokdan iborat?

**M7.** Self-attention nima?

**M8.** Nima uchun "niqoblangan" e'tibor kerak?

<details>
<summary>✅ Javoblar M1–M8</summary>

**M1.** ## **2017-yil**, **Google Brain**.

**M2.** ① **Uzoq matnni unutadi** · ② **parallellashtirib bo'lmaydi**.

**M3.** ## **"Attention Is All You Need"**.

**M4.** **Query** *(so'rov/savol)* · **Key** *(kalit/sarlavha)* · **Value** *(qiymat/mazmun)*.

**M5.**
```
Attention(Q, K, V) = softmax( Q·Kᵀ / √d_k ) · V
```

**M6.** **Encoder** *(tushunish)* va **decoder** *(yaratish)*.

**M7.** **Bitta ketma-ketlik ichidagi** e'tibor — jumla **o'ziga** qaraydi.

**M8.** Model **javobni ko'rmasligi** uchun — aks holda u o'rganmay, **nusxa ko'chirardi**.

</details>

**M9.** `distilbert` da nechta qatlam va bosh bor?

**M10.** `d_k` qanday hisoblanadi?

**M11.** Embedding matritsasining o'lchami?

**M12.** Nima uchun `maks_uzunlik = 512`?

**M13.** `[CLS]` va `[SEP]` nima?

**M14.** Feed-forward qatlamda o'lcham qanday o'zgaradi?

**M15.** Linear qatlam nechta chiqish beradi?

<details>
<summary>✅ Javoblar M9–M15</summary>

**M9.** ## **6 qatlam × 12 bosh = 72** ta e'tibor matritsasi.

**M10.** `d_k = 768 / 12 =` ## **64**.

**M11.** ## **(30522, 768)** = 23 440 896 parametr.

**M12.** Chunki `position_embeddings` — **(512, 768)**. Modelda **512 tadan ortiq** pozitsiya vektori **yo'q**.

**M13.** `[CLS]`=101 *(jumla boshi, tasniflash uchun)* · `[SEP]`=102 *(oxiri)*.

**M14.** ## **768 → 3072 → 768** *(4× kengayish)*.

**M15.** **Lug'at hajmicha** — `distilgpt2` da **50 257**.

</details>

---

# 🟡 O'RTA *(16–32)*

### Modelni o'lchash

**M16.** Modelning har komponentiga tegishli parametr ulushini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
qatorlar = []
for nom, p in mod.named_parameters():
    g = ("① Embeddinglar" if "embeddings" in nom else
         "② E'tibor" if "attention" in nom else
         "③ Feed-Forward" if "ffn" in nom else "④ LayerNorm")
    qatorlar.append({"guruh": g, "soni": p.numel()})
df = (pd.DataFrame(qatorlar).groupby("guruh")["soni"].sum()
      .reset_index().sort_values("soni", ascending=False))
df["ulush_%"] = (100 * df.soni / df.soni.sum()).round(1)
print(df.to_string(index=False))
```
```
        guruh     soni  ulush_%
③ Feed-Forward 28334592     42.7
① Embeddinglar 23835648     35.9
     ② E'tibor 14174208     21.4
   ④ LayerNorm    18432      0.0
```
> ## 😲 **"Attention Is All You Need" — lekin e'tibor atigi 21.4%!**
>
> **YANGILIK** e'tiborda, **HAJM** esa feed-forward va embeddinglarda. Muhimlik ≠ hajm.

</details>

**M17.** ⭐ RNN "unutish" muammosini soddalashtirilgan modelda ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
def rnn_xotira(sozlar, unutish=0.7):
    x = {}
    for s in sozlar:
        for k in x:
            x[k] *= unutish
        x[s] = 1.0
    return x

matn = "The New York Times is a daily newspaper . It was first issued in 1851 .".split()
x = rnn_xotira(matn)
for s in ["Times", "newspaper", "It", "1851"]:
    print(f"{s:<12} {x[s]:>10.4f}")
```
```
Times            0.0138
newspaper        0.0576
It               0.1176
1851             0.7000
```
> 🔑 `"Times"` — `"1851"` dan **50 baravar** zaif. Va aynan `"Times"` — `"It"` ni tushunish uchun **eng kerakli** so'z.

</details>

**M18.** E'tiborni **noldan** yozing va og'irliklar yig'indisi 1 ekanini isbotlang.

<details>
<summary>✅ Yechim</summary>

```python
def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def etibor(Q, K, V):
    d_k = K.shape[-1]
    w = softmax(Q @ K.T / np.sqrt(d_k))
    return w @ V, w

rng = np.random.default_rng(0)
Q = K = V = rng.normal(size=(4, 8))
natija, W = etibor(Q, K, V)
assert np.allclose(W.sum(axis=1), 1.0)
print("✅ har qator yig'indisi = 1.0")
print("og'irlangan yig'indimi?",
      np.allclose(natija[0], sum(W[0, j] * V[j] for j in range(4))))
```
```
✅ har qator yig'indisi = 1.0
og'irlangan yig'indimi? True
```

</details>

**M19.** ⭐ `√d_k` ga bo'lish nima uchun kerak? O'lchang.

<details>
<summary>✅ Yechim</summary>

```python
rng = np.random.default_rng(1)
for d_k in [8, 64, 512]:
    Q = rng.normal(size=(1, d_k)); K = rng.normal(size=(4, d_k))
    xom = (Q @ K.T)[0]; ms = xom / np.sqrt(d_k)
    print(f"d_k={d_k:4d} xom maks={softmax(xom).max():.4f}  "
          f"masshtabli maks={softmax(ms).max():.4f}")
```
```
d_k=   8 xom maks=0.3485  masshtabli maks=0.3064
d_k=  64 xom maks=0.9544  masshtabli maks=0.4822
d_k= 512 xom maks=0.8879  masshtabli maks=0.3298
```
> ## 🔑 **`d_k=64` da: 0.9544 → 0.4822.** Masshtablashsiz model **deyarli faqat bitta** tokenga qaraydi — gradiyent yo'qoladi, o'qitish **to'xtaydi**.

</details>

### Tokenizatsiya va embedding

**M20.** ⭐ Subword tokenizatsiya qanday muammoni hal qiladi?

**M21.** 🇺🇿 O'zbekcha so'zlar qanday bo'linadi?

**M22.** ⭐⭐ *"Yaqin so'zlar yaqin joylashadi"* da'vosini tekshiring.

<details>
<summary>✅ Javoblar M20–M22</summary>

**M20.** ## **OOV** — 24-moduldagi *"lug'atda yo'q so'z yo'qoladi"* muammosi.
```python
for w in ["tokenization", "antidisestablishmentarianism"]:
    print(f"{w:30s} → {tok.tokenize(w)}")
```
```
tokenization                   → ['token', '##ization']
antidisestablishmentarianism   → ['anti', '##dis', '##est', '##ab', '##lish', '##ment', '##arian', '##ism']
```

**M21.**
```python
for w in ["kitob", "uylarimizda", "o'zbekiston", "toshkent"]:
    print(f"{w:14s} → {tok.tokenize(w)}")
```
```
kitob          → ['kit', '##ob']
uylarimizda    → ['u', '##yla', '##rim', '##iz', '##da']
o'zbekiston    → ['o', "'", 'z', '##bek', '##isto', '##n']
toshkent       → ['to', '##sh', '##ken', '##t']
```
> ## ❌ **`uzbekistan` = 1 token, `o'zbekiston` = 6 token!**
>
> Apostrof **alohida token** bo'lib chiqdi — **28-moduldagi apostrof muammosi**, endi model **ichida**. Uni tuzatib bo'lmaydi.

**M22.**
```python
E = mod.embeddings.word_embeddings.weight
def vec(w): return E[tok.convert_tokens_to_ids(w)]
for a, b in [("king","queen"), ("king","banana"), ("good","great"), ("good","bad")]:
    print(f"cos({a},{b}) = {float(F.cosine_similarity(vec(a),vec(b),dim=0)):.3f}")
```
```
cos(king,queen) = 0.654
cos(king,banana) = 0.318
cos(good,great) = 0.526
cos(good,bad) = 0.528
```
> ## 🔑 **DA'VO YARIM TO'G'RI:**
> ```
> ✅ MAVZU ni ajratadi     king↔queen 0.654  vs  king↔banana 0.318
> ❌ SENTIMENT ni ajratmaydi  good↔great 0.526  vs  good↔bad 0.528
> ```
> Kirish embeddingi **grammatikani** ko'radi, **ma'noni** emas.

</details>

### E'tibor

**M23.** ⭐⭐ `"it"` qaysi so'zga qaraydi? Boshlarning **o'rtachasi** bilan sinang.

**M24.** ⭐⭐ Endi **har bir boshni alohida** ko'ring. Farq nimada?

<details>
<summary>✅ Javoblar M23–M24</summary>

**M23.**
```python
i = toks.index("it")
for L in [0, 3, 5]:
    w = A[L][0].mean(0)[i].numpy()
    print(f"qatlam {L}:", [(toks[j], round(float(w[j]),3)) for j in w.argsort()[::-1][:4]])
```
```
qatlam 5: [('.', 0.289), ('.', 0.136), ('[SEP]', 0.084), ('times', 0.081)]
```
> ## 😞 `times` atigi **0.081** — arang ko'rinadi.

**M24.**
```python
nyt = [toks.index(x) for x in ["new","york","times"]]
r = []
for L in range(len(A)):
    for H in range(A[L].shape[1]):
        w = A[L][0,H,i]
        r.append((float(w[nyt].sum()), L, H,
                  [(toks[j], round(float(w[j]),3)) for j in w.argsort(descending=True)[:4]]))
r.sort(reverse=True)
for s_,L,H,top in r[:3]:
    print(f"qatlam {L} bosh {H:2d} | NYT={s_:.3f} | {top}")
```
```
qatlam 5 bosh  5 | NYT=0.684 | [('times', 0.584), ('.', 0.081), ('york', 0.05), ('new', 0.049)]
qatlam 4 bosh  1 | NYT=0.513 | [('times', 0.402), ('newspaper', 0.146), ('york', 0.09), ('the', 0.08)]
qatlam 2 bosh  1 | NYT=0.353 | [('times', 0.241), ('the', 0.141), ('newspaper', 0.125), ('.', 0.093)]
```
> ## 🎉 **0.081 → 0.584 — 7 BARAVAR farq!**
>
> ## 🔑 **Boshlarni o'rtacha qilish = ma'lumotni yo'q qilish.** Har bosh **boshqa** narsani o'rganadi.

</details>

**M25.** ⭐⭐ E'tibor og'irliklarini **qo'lda** hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
L, H = 5, 5
layer = mod.transformer.layer[L].attention
X = out.hidden_states[L]
with torch.no_grad():
    Q, K = layer.q_lin(X), layer.k_lin(X)
n, d_k = layer.n_heads, Q.shape[-1] // layer.n_heads
sp = lambda t: t.view(1, -1, n, d_k).transpose(1, 2)
w = torch.softmax((sp(Q)[0,H] @ sp(K)[0,H].T) / np.sqrt(d_k), dim=-1)
print("maks farq:", float((w - A[L][0,H]).abs().max()))
```
```
maks farq: 0.0
```
> ## 🏆 **BIT-DARAJADA BIR XIL.** Transformer — sehr emas, matematika.

</details>

**M26.** ⭐⭐ Har bir boshning "ixtisosligini" aniqlang.

<details>
<summary>✅ Yechim natijasi</summary>

```
naqsh
[SEP] ga          37
[CLS] ga          15
o'ziga            12
OLDINGI so'zga     4
KEYINGI so'zga     4
```
> ## 🔑 **72 boshning YARMI `[SEP]` ga qaraydi** — bular **"NO-OP"** boshlar: bu jumlada **kerak emas**.
>
> Shuning uchun ham o'rtacha olish shunchalik yomon ishlaydi — **haqiqiy signal cho'kib ketadi**.

</details>

### Feed-forward va niqob

**M27.** FFN ni qo'lda hisoblang.

**M28.** GELU va ReLU ni solishtiring.

**M29.** ⭐ Chiziqsizlik bo'lmasa nima bo'lardi?

**M30.** ⭐⭐ Niqobning ishlashini isbotlang.

<details>
<summary>✅ Javoblar M27–M30</summary>

**M27.**
```python
ffn = mod.transformer.layer[0].ffn
x = torch.randn(1, 5, 768)
with torch.no_grad():
    print("maks farq:", float((ffn(x) - ffn.lin2(F.gelu(ffn.lin1(x)))).abs().max()))
```
> Butun FFN — bitta ifoda: `lin2(gelu(lin1(x)))`.

**M28.**
```python
x = torch.tensor([-3., -1., -0.5, 0., 0.5, 1., 3.])
print("GELU:", [round(float(v),4) for v in F.gelu(x)])
print("ReLU:", [round(float(v),4) for v in F.relu(x)])
```
```
GELU: [-0.004, -0.1587, -0.1543, 0.0, 0.3457, 0.8413, 2.996]
ReLU: [0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 3.0]
```
> 🔑 GELU manfiy signalni **saqlaydi** *(zaiflashtirib)*, ReLU **butunlay o'chiradi**.

**M29.**
```
W₂ · (W₁ · x) = (W₂ · W₁) · x = W · x
```
> ## **6 qatlam ham 1 qatlamga teng bo'lardi** — model "chuqur" bo'lmasdi.

**M30.**
```python
g = AutoModelForCausalLM.from_pretrained("distilgpt2", attn_implementation="eager")
tok2 = AutoTokenizer.from_pretrained("distilgpt2")
e = tok2("The cat sat on the", return_tensors="pt")
with torch.no_grad():
    Ag = g(**e, output_attentions=True).attentions
W = Ag[0][0,0].numpy()
print(W.round(3))
print("yuqori uchburchak nolmi?", bool(np.allclose(np.triu(W,1), 0)))
```
```
[[1.    0.    0.    0.    0.   ]
 [0.612 0.388 0.    0.    0.   ]
 [0.567 0.154 0.279 0.    0.   ]
 [0.44  0.225 0.287 0.048 0.   ]
 [0.456 0.195 0.224 0.064 0.06 ]]
yuqori uchburchak nolmi? True
```
> ## ✅ **MUKAMMAL PASTKI UCHBURCHAK** — kelajak **butunlay** yashiringan.

</details>

**M31.** BERT va GPT ning e'tibor matritsasi farqi?

**M32.** Avtoregressiv generatsiya nima?

<details>
<summary>✅ Javoblar</summary>

**M31.** **BERT** — to'liq matritsa *(kelajakni ko'radi → tushunish)* · **GPT** — pastki uchburchak *(kelajak yashirin → yaratish)*.

**M32.** Model **o'z natijasini** keyingi kirish sifatida ishlatib, so'zma-so'z davom etishi.

</details>

---

# 🔴 QIYIN *(33–44)*

**M33.** ⭐⭐⭐ **ENG MUHIM MASHQ.** Kontekst so'z vektorini o'zgartirishini isbotlang.

<details>
<summary>✅ Yechim</summary>

```python
def kontekst_vektori(jumla, soz, qatlam):
    e = tok(jumla, return_tensors="pt")
    t = tok.convert_ids_to_tokens(e["input_ids"][0])
    with torch.no_grad():
        o = mod(**e, output_hidden_states=True)
    return o.hidden_states[qatlam][0, t.index(soz)]

a, b = "The food was very good", "The food was not good"
for L in [0, 1, 3, 6]:
    c = float(F.cosine_similarity(kontekst_vektori(a, "good", L),
                                  kontekst_vektori(b, "good", L), dim=0))
    print(f"qatlam {L}: cos = {c:>7.4f}")
```

```
qatlam 0: cos =  1.0000
qatlam 1: cos =  0.9454
qatlam 3: cos =  0.9154
qatlam 6: cos = -0.1150
```

> ## 🏆 **BUTUN MODULNING MOHIYATI SHU YERDA.**
>
> ```
> qatlam 0  →  1.0000    "good" IKKI JUMLADA MUTLAQO BIR XIL
> qatlam 6  → -0.1150    DEYARLI QARAMA-QARSHI
> ```
>
> ## 🔑 **Bir xil so'z. Bir xil ID. Bir xil boshlang'ich vektor.**
> ## **Model `"not"` ni ko'rdi va `"good"` ning ma'nosini O'ZGARTIRDI.**
>
> **Uch modulni bog'laydi:**
> ```
> 26-modul:  "not" ni olib tashlash  →  aniqlik 0.869 → 0.784  ❌
> 29-modul:  "It wasn't terrible" → POSITIVE  ✅ (ikki karra inkor)
> 30-modul:  NIMA UCHUN — mana shu o'lchov
> ```

</details>

**M34.** ⭐⭐ Bir nechta omonim so'zda M33 ni takrorlang.

<details>
<summary>✅ Yechim g'oyasi</summary>

```python
juftliklar = [
    ("I went to the river bank",  "I went to the money bank",  "bank"),
    ("The bat flew away",         "He swung the bat",          "bat"),
    ("She read the book",         "Please book a table",       "book"),
]
for a, b, s in juftliklar:
    print(f"\n--- '{s}' ---")
    for L in [0, 6]:
        c = float(F.cosine_similarity(kontekst_vektori(a, s, L),
                                      kontekst_vektori(b, s, L), dim=0))
        print(f"  qatlam {L}: cos = {c:>7.4f}")
```
> ## 🎯 **Kutilgan naqsh — hamma juftlikda BIR XIL:**
> ```
> qatlam 0  →  1.0000   (kirish embeddingi DOIM bir xil)
> qatlam 6  →  ancha past
> ```
> Kirish embeddingi omonimlarni **ajrata olmaydi**, e'tibor qatlamlari **ajratadi**. Mana nima uchun **"kontekstual embedding"** deyiladi.

</details>

**M35.** ⭐⭐ Barcha 72 boshni **issiqlik xaritasi** sifatida ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
i = toks.index("it")
t_idx = toks.index("times")
xarita = np.zeros((len(A), A[0].shape[1]))
for L in range(len(A)):
    for H in range(A[L].shape[1]):
        xarita[L, H] = float(A[L][0, H, i, t_idx])

print("it → times og'irligi (qator=qatlam, ustun=bosh):")
print(f"{'':>8}" + "".join(f"{h:>7}" for h in range(A[0].shape[1])))
for L in range(len(A)):
    belgi = "".join(f"{xarita[L,h]:>7.3f}" for h in range(A[0].shape[1]))
    print(f"qatlam{L:>2}{belgi}")
print(f"\nENG YUQORI: qatlam {xarita.argmax()//12}, bosh {xarita.argmax()%12} "
      f"= {xarita.max():.3f}")
```
> ## 🔑 **Bu xarita modelning "miya kartasi".** Aksariyat katak **nolga yaqin**, bittasi esa **yorqin** *(0.584)*.
>
> 💡 Bu — **interpretability** *(tushuntirib berish)* sohasining asosiy usuli. Tadqiqotchilar aynan shunday **"induction heads"**, **"name mover heads"** kabi ixtisoslashgan boshlarni topishgan.

</details>

**M36.** ⭐⭐ Niqobni qo'lda yasang va `softmax` ga ta'sirini ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
n = 5
ballar = torch.randn(n, n)
niqob = torch.triu(torch.ones(n, n), diagonal=1).bool()
niqoblangan = ballar.masked_fill(niqob, float("-inf"))
print("NIQOBSIZ:", torch.softmax(ballar, -1)[0].round(decimals=3).tolist())
print("NIQOBLI :", torch.softmax(niqoblangan, -1)[0].round(decimals=3).tolist())
```
> ## 🔑 **Nima uchun `-inf`, `0` emas?**
> ```
> exp(-inf) = 0   →  softmax'dan keyin ANIQ 0        ✅
> exp(0)    = 1   →  softmax'dan keyin katta ulush   ❌
> ```
> Niqob `softmax` dan **oldin** qo'llanishi **shart**.

</details>

**M37.** ⭐⭐ Matn generatsiyasida `argmax` va `sampling` ni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
def yarat(bosh, n=10, usul="argmax", temp=1.0, seed=0):
    torch.manual_seed(seed)
    matn = bosh
    for _ in range(n):
        e = tok2(matn, return_tensors="pt")
        with torch.no_grad():
            lg = g(**e).logits[0, -1]
        idx = lg.argmax() if usul == "argmax" else \
              torch.multinomial(torch.softmax(lg / temp, -1), 1)[0]
        matn += tok2.decode(idx)
    return matn

for u, t_ in [("argmax", 1.0), ("sample", 0.7), ("sample", 1.5)]:
    print(f"{u} t={t_}: {yarat('The cat sat on the', usul=u, temp=t_)!r}")
```
> ## 🔑 **TEMPERATURA:**
> ```
> temp → 0    o'tkirlashadi  →  argmax  →  TAKRORLANISH xavfi
> temp = 1.0  asl taqsimot
> temp → ∞    tekislashadi   →  tasodif →  MA'NOSIZLIK xavfi
> ```
> Amalda **0.7–0.9** — keng tarqalgan muvozanat.
>
> 💡 29-moduldagi *"a man in a black robe, a man in a black robe"* takrorlanishining sababi — **`do_sample=False`** *(ya'ni `argmax`)*.

</details>

**M38.** ⭐⭐ Har bir pozitsiya uchun bashoratni ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
e = tok2("The cat sat on the", return_tensors="pt")
tk = tok2.convert_ids_to_tokens(e["input_ids"][0])
with torch.no_grad():
    lg = g(**e).logits[0]
for i_, t_ in enumerate(tk):
    p = torch.softmax(lg[i_], -1)
    print(f"{t_:>12} → {tok2.decode(p.argmax()):>12} {float(p.max()):>8.4f}")
```
```
         The →          The    0.0443
        Ġcat →           is    0.0512
        Ġsat →           in    0.1362
         Ġon →          the    0.4105
        Ġthe →        floor    0.0650
```
> ## 🔑 **NOZIK XULOSA:**
> ```
> "on" → "the"    0.4105   GRAMMATIK bashorat  →  ishonch YUQORI
> "the" → "floor" 0.0650   SEMANTIK bashorat   →  ishonch PAST
> ```
> **Past ehtimol ≠ "model bilmaydi".** Ko'pincha u **"ko'p to'g'ri javob bor"** degani.

</details>

**M39.** ⭐⭐⭐ E'tibor **entropiyasini** qatlamlar bo'yicha o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def entropiya(w):
    return float(-(w * np.log(w + 1e-12)).sum(-1).mean())

qatorlar = []
for L in range(len(A)):
    for H in range(A[L].shape[1]):
        qatorlar.append({"qatlam": L, "entropiya": entropiya(A[L][0, H].numpy())})
df = pd.DataFrame(qatorlar)
print(df.groupby("qatlam")["entropiya"].agg(["mean", "min", "max"]).round(3).to_string())
print(f"\nmaksimal mumkin (18 token): {np.log(len(toks)):.3f}")
```
```
         mean    min    max
qatlam
0       1.821  0.504  2.666
1       1.604  0.047  2.299
2       1.288  0.404  2.390
3       1.063  0.498  1.578
4       1.555  0.794  2.253
5       1.930  1.555  2.474

maksimal mumkin (18 token): 2.890
```

> ## 🔑 **Entropiya nimani anglatadi?**
> ```
> YUQORI (≈ log N = 2.89)  →  e'tibor HAMMAGA tarqalgan  ("qaramayapti")
> PAST  (≈ 0)              →  BITTA tokenga yopishgan    ("aniq qaraydi")
> ```

### 😲 KUTILGAN NAQSH CHIQMADI — VA BU QIZIQ

Men *"quyi qatlamlarda yuqori, yuqori qatlamlarda pastroq"* deb kutgandim. **Haqiqiy natija — U SHAKLIDA:**

```
qatlam 0   1.821   ┐
qatlam 1   1.604   │  PASAYADI
qatlam 2   1.288   │
qatlam 3   1.063   ┘  ← ENG PAST (eng "aniq" e'tibor)
qatlam 4   1.555   ┐  KO'TARILADI
qatlam 5   1.930   ┘  ← eng yuqori
```

> ## 🔑 **TALQIN — uch bosqich:**
> ```
> qatlam 0-1  →  KENG qarash    "atrofda nima bor?"
> qatlam 2-3  →  FOKUS          "aynan SHU bog'lanish muhim"
> qatlam 4-5  →  YANA KENG      "hamma narsani JAMLAB, xulosa qilaman"
> ```
>
> ## 💡 **Bu mantiqiy:** oxirgi qatlamlar **yakuniy vakillikni** quradi — ular bitta so'zga emas, **butun jumlaga** qarashi kerak.
>
> ⚠️ **Halol eslatma:** bu — **bitta jumla** bo'yicha o'lchov. Boshqa jumlada naqsh **boshqacha** bo'lishi mumkin. Ishonchli xulosa uchun **yuzlab** jumlada o'lchash kerak.
>
> 💡 **Diqqat: `qatlam 1, min = 0.047`** — bu deyarli **nol** entropiya, ya'ni o'sha bosh **mutlaqo bitta** tokenga qaraydi. Bu — 4-bo'limda topgan `it → "was" = 1.0000` boshi!

</details>

**M40.** ⭐⭐ Kengaytirish koeffitsienti turli modellarda bir xilmi?

<details>
<summary>✅ Yechim</summary>

```python
for m in [M, "cardiffnlp/twitter-roberta-base-sentiment-latest",
          "nlptown/bert-base-multilingual-uncased-sentiment"]:
    c = AutoConfig.from_pretrained(m)
    h = getattr(c, "hidden_size", getattr(c, "dim", None))
    f = getattr(c, "intermediate_size", getattr(c, "hidden_dim", None))
    print(f"{m.split('/')[-1][:34]:36s} {h} → {f}  ({f/h:.1f}×)")
```
> 🔑 **Kutilgan: uchalasida ham 4.0×** — bu 2017-maqoladan kelgan **konventsiya** *(`d_ff = 4·d_model`)*, matematik qonun emas.
>
> 💡 Yangi modellar *(LLaMA, Mistral)* `SwiGLU` bilan `~2.7×` ishlatadi.

</details>

**M41.** ⭐⭐⭐ 🇺🇿 O'zbekcha jumlada e'tibor qanday ishlaydi?

<details>
<summary>✅ Yechim</summary>

```python
uz = "Toshkent O'zbekiston poytaxti. U juda go'zal shahar."
e = tok(uz, return_tensors="pt")
t = tok.convert_ids_to_tokens(e["input_ids"][0])
print("tokenlar:", t)
print("tokenlar soni:", len(t))
```
> ## ⚠️ **KUTILGAN MUAMMO:**
> ```
> "Toshkent"     →  ['to','##sh','##ken','##t']       4 bo'lak
> "O'zbekiston"  →  ['o',"'",'z','##bek','##isto','##n']  6 bo'lak
> ```
>
> ## 🔑 **E'tibor MA'NOSIZ bo'laklar orasida ishlaydi.**
> ```
> Ingliz jumlada:  "it" → "times"      (ikkalasi ham TO'LIQ so'z)
> O'zbek jumlada:  "u"  → "##sh"?      (bo'lak — nimani anglatadi?)
> ```
>
> ## 💡 **MANA 29-MODULDAGI 0.500 NATIJANING CHUQUR SABABI.** Muammo e'tibor mexanizmida **emas** — u **tildan mustaqil** va **mukammal** ishlaydi. Muammo **tokenizatsiyada**: model o'zbekcha so'zlarni **bo'laklarga** maydalaydi va e'tibor **ma'nosiz bo'laklar** orasida ishlashga majbur bo'ladi.
>
> ✅ **Yechim:** ko'p tilli tokenizator *(XLM-R)* yoki **28-moduldagi** `uznlp` yondashuvi.

</details>

**M42.** ⭐⭐⭐ **Mini-transformer** ni noldan yozing *(bitta qatlam, bitta bosh)*.

<details>
<summary>✅ Yechim</summary>

```python
class MiniTransformer(torch.nn.Module):
    def __init__(self, d=64, d_ff=256):
        super().__init__()
        self.q = torch.nn.Linear(d, d)
        self.k = torch.nn.Linear(d, d)
        self.v = torch.nn.Linear(d, d)
        self.out = torch.nn.Linear(d, d)
        self.norm1 = torch.nn.LayerNorm(d)
        self.lin1 = torch.nn.Linear(d, d_ff)
        self.lin2 = torch.nn.Linear(d_ff, d)
        self.norm2 = torch.nn.LayerNorm(d)
        self.d = d

    def forward(self, x):
        Q, K, V = self.q(x), self.k(x), self.v(x)
        w = torch.softmax(Q @ K.transpose(-2, -1) / self.d ** 0.5, dim=-1)
        x = self.norm1(x + self.out(w @ V))          # e'tibor + Add&Norm
        x = self.norm2(x + self.lin2(F.gelu(self.lin1(x))))  # FFN + Add&Norm
        return x, w

m = MiniTransformer()
x = torch.randn(1, 6, 64)
y, w = m(x)
print("kirish :", tuple(x.shape))
print("chiqish:", tuple(y.shape))
print("e'tibor:", tuple(w.shape))
print("yig'indi = 1?", bool(torch.allclose(w.sum(-1), torch.ones(1, 6))))
print("parametr:", sum(p.numel() for p in m.parameters()))
```

```
kirish : (1, 6, 64)
chiqish: (1, 6, 64)
e'tibor: (1, 6, 6)
yig'indi = 1? True
parametr: 49984
```

> ## 🏆 **MANA — TRANSFORMER BLOKI, 20 QATOR KODDA.**
>
> Atigi **49 984** parametr — `distilbert` dan **1300 baravar** kichik, lekin **arxitekturasi bir xil**.
>
> `distilbert` — **aynan shu** blok, faqat:
> ```
> d = 768 (64 emas)  ·  12 bosh (1 emas)  ·  6 qatlam (1 emas)
> ```
>
> 💡 **`x + ...` ga e'tibor bering** — bu **qoldiq bog'lanish** *(residual connection)*. Diagrammadagi `"Add & Norm"` ning `"Add"` qismi. Usiz chuqur tarmoqlarni o'qitib **bo'lmaydi**.

</details>

**M43.** ⭐⭐ Modelning **har qatlamida** vektorlar qanchalik o'zgarishini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
hs = out.hidden_states
for L in range(1, len(hs)):
    c = float(F.cosine_similarity(hs[L-1][0], hs[L][0], dim=-1).mean())
    print(f"qatlam {L-1} → {L}: o'rtacha cos = {c:.4f}")
```
```
qatlam 0 → 1: o'rtacha cos = 0.7894
qatlam 1 → 2: o'rtacha cos = 0.8376
qatlam 2 → 3: o'rtacha cos = 0.8636
qatlam 3 → 4: o'rtacha cos = 0.8502
qatlam 4 → 5: o'rtacha cos = 0.7764
qatlam 5 → 6: o'rtacha cos = 0.7129
```

> ## 😲 **YANA U SHAKLI — LEKIN TESKARI TOMONGA:**
>
> ```
> 0→1   0.7894   ← KATTA o'zgarish
> 1→2   0.8376
> 2→3   0.8636   ← ENG KICHIK o'zgarish
> 3→4   0.8502
> 4→5   0.7764
> 5→6   0.7129   ← ENG KATTA o'zgarish
> ```
>
> ## 🔑 **TALQIN:**
> ```
> BIRINCHI qatlam  →  katta o'zgarish
>      "xom" embeddingga kontekst BIRINCHI MARTA qo'shiladi
>
> O'RTA qatlamlar  →  kichik o'zgarish
>      nozik sozlash
>
> OXIRGI qatlam    →  ENG KATTA o'zgarish
>      yakuniy vazifaga (bu modelda — SENTIMENT) moslashish
> ```
>
> ## 💡 **M33 bilan mukammal mos keladi:** `good` uchun `0.9154 → -0.1150` sakrashi aynan **oxirgi** qatlamlarda sodir bo'lgandi. Mana **nima uchun**: oxirgi qatlam **eng ko'p** o'zgartiradi.
>
> ⚠️ **Halol eslatma:** *"model asta-sekin quradi"* degan sodda tasavvur **noto'g'ri** bo'lib chiqdi. O'zgarish **tekis emas** — u **boshida** va **oxirida** kuchli, **o'rtada** zaif.

</details>

**M44.** ⭐⭐⭐ **Yakuniy sintez.** Transformerning har komponentini, uning vazifasini va **o'lchangan** dalilini bitta jadvalga jamlang.

<details>
<summary>✅ Namuna javob</summary>

| # | Komponent | Vazifasi | Parametr | O'lchangan dalil |
|---|---|---|---|---|
| 1 | **Tokenizatsiya** | Matn → tokenlar | — | `tokenization → token + ##ization` *(OOV hal bo'ldi)* |
| 2 | **Word embedding** | Token → 768D vektor | 23 440 896 | `cos(king,queen)=0.654` ✅ · `cos(good,bad)=0.528` ❌ |
| 3 | **Pozitsion embedding** | Tartib ma'lumoti | 393 216 | `(512, 768)` → **maks_uzunlik = 512** |
| 4 | **Multi-head attention** | So'zlarni BOG'LASH | 14 174 208 | `it → times = 0.584` *(qatlam 5, bosh 5)* |
| 5 | **Add & Norm** | Barqarorlashtirish | 18 432 | 0.03% — lekin **usiz o'qitib bo'lmaydi** |
| 6 | **Feed-forward** | Xulosa chiqarish | 28 334 592 | **42.7%** — eng katta qism! `768→3072→768` |
| 7 | **Masked attention** | Kelajakni yashirish | *(decoder)* | `np.triu(W,1) == 0` → **True** |
| 8 | **Linear + Softmax** | Keyingi so'z | *(decoder)* | `floor 0.065, bed 0.064, couch 0.055` |

```
🏆 BUTUN MODULNING ENG MUHIM RAQAMI:

   "very good" dagi "good"  vs  "not good" dagi "good"

      qatlam 0:  cos =  1.0000     (bir xil)
      qatlam 6:  cos = -0.1150     (qarama-qarshi)

   ↑
   MANA transformer NIMA QILADI.
   Qolgan hamma narsa — buning tafsiloti.
```

</details>

---

## 🎯 Yakuniy tekshirish

- [ ] E'tibor formulasini yodda yoza olasizmi?
- [ ] Q, K, V ni o'z so'zingiz bilan tushuntira olasizmi?
- [ ] Nima uchun boshlarni o'rtacha qilish xato ekanini bilasizmi?
- [ ] E'tiborni qo'lda hisoblab, model bilan solishtira olasizmi?
- [ ] `cos = 1.0000 → -0.1150` nimani anglatishini tushuntira olasizmi?
- [ ] Niqob nima uchun kerakligini bilasizmi?
- [ ] 🇺🇿 O'zbekcha matnda muammo QAYERDA ekanini bilasizmi?

---

⬅️ [9-dars](09-Predicting-the-Final-Outputs.md) · 🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
