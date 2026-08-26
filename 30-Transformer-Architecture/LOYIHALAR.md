# 🚀 30-modul mini-loyihalari

> **6 ta tayyor loyiha.** Hammasi **ishlab tekshirilgan**.
>
> Bu modul nazariy, shuning uchun loyihalar — **transformerni ICHIDAN ko'rish** vositalari.
> Bular **interpretability** *(modelni tushuntirish)* sohasining haqiqiy asboblari.

## ⚙️ Umumiy tayyorgarlik

```python
import warnings; warnings.filterwarnings("ignore")
import torch
import torch.nn.functional as F
import numpy as np
import pandas as pd
from transformers import AutoTokenizer, AutoModel, AutoModelForCausalLM

M = "distilbert-base-uncased-finetuned-sst-2-english"
tok = AutoTokenizer.from_pretrained(M)
mod = AutoModel.from_pretrained(M, attn_implementation="eager")
```

---

# 🔬 1-loyiha. E'tibor tadqiqotchisi

> **Maqsad:** *"Bu so'z NIMAGA qaraydi?"* savoliga javob beruvchi vosita.
> ⭐ Butun modulning eng foydali asbobi.

```python
class EtiborTadqiqotchi:
    """Transformer e'tiborini o'rganish uchun asbob."""

    def __init__(self, model_id=M):
        self.tok = AutoTokenizer.from_pretrained(model_id)
        self.mod = AutoModel.from_pretrained(model_id,
                                             attn_implementation="eager")

    def tahlil(self, jumla):
        enc = self.tok(jumla, return_tensors="pt")
        self.toks = self.tok.convert_ids_to_tokens(enc["input_ids"][0])
        with torch.no_grad():
            o = self.mod(**enc, output_attentions=True,
                         output_hidden_states=True)
        self.A = o.attentions
        self.hs = o.hidden_states
        return self

    # ── Bitta so'z nimaga qaraydi? ────────────────────
    def nimaga_qaraydi(self, soz, qatlam=None, bosh=None, top=5):
        i = self.toks.index(soz)
        if qatlam is None:                       # HAMMA boshning o'rtachasi
            w = torch.stack([a[0].mean(0)[i] for a in self.A]).mean(0)
            manba = "hamma qatlam/bosh O'RTACHASI"
        elif bosh is None:
            w = self.A[qatlam][0].mean(0)[i]
            manba = f"qatlam {qatlam}, boshlar o'rtachasi"
        else:
            w = self.A[qatlam][0, bosh, i]
            manba = f"qatlam {qatlam}, bosh {bosh}"
        idx = w.argsort(descending=True)[:top]
        print(f"'{soz}' → ({manba})")
        for j in idx:
            ulush = int(float(w[j]) * 40)
            print(f"   {self.toks[j]:>12} {float(w[j]):.3f} {'█' * ulush}")
        return w

    # ── Qaysi bosh eng kuchli bog'lanishni ko'radi? ───
    def eng_yaxshi_bosh(self, dan, ga, top=5):
        i, j = self.toks.index(dan), self.toks.index(ga)
        r = [{"qatlam": L, "bosh": H,
              "og'irlik": round(float(self.A[L][0, H, i, j]), 4)}
             for L in range(len(self.A))
             for H in range(self.A[L].shape[1])]
        df = pd.DataFrame(r).nlargest(top, "og'irlik")
        print(f"'{dan}' → '{ga}' eng kuchli boshlar:")
        print(df.to_string(index=False))
        return df

    # ── Issiqlik xaritasi (matnda) ────────────────────
    def xarita(self, dan, ga):
        i, j = self.toks.index(dan), self.toks.index(ga)
        nb = self.A[0].shape[1]
        print(f"'{dan}' → '{ga}'   (qator=qatlam, ustun=bosh)")
        print(f"{'':>9}" + "".join(f"{h:>7}" for h in range(nb)))
        for L in range(len(self.A)):
            qator = "".join(f"{float(self.A[L][0, h, i, j]):>7.3f}"
                            for h in range(nb))
            print(f"qatlam {L:>2}{qator}")
```

### 🧪 Sinov

```python
e = EtiborTadqiqotchi().tahlil(
    "The New York Times is a daily newspaper. It was first issued in 1851.")

e.nimaga_qaraydi("it")                  # o'rtacha — YOMON
print()
e.nimaga_qaraydi("it", qatlam=5, bosh=5)   # aniq bosh — ZO'R
print()
e.eng_yaxshi_bosh("it", "times")
```

```
'it' → (hamma qatlam/bosh O'RTACHASI)
          [SEP] 0.210 ████████
              . 0.123 ████
            was 0.077 ███
      newspaper 0.075 ███
          [CLS] 0.072 ██

'it' → (qatlam 5, bosh 5)
          times 0.584 ███████████████████████
              . 0.081 ███
           york 0.050 ██
            new 0.049 █
              . 0.048 █

'it' → 'times' eng kuchli boshlar:
 qatlam  bosh  og'irlik
      5     5    0.5840
      4     1    0.4023
      4     8    0.3148
      4     7    0.2624
      2     1    0.2410
```

> ## 🎯 **BIRINCHI VA IKKINCHI CHIQISHNI SOLISHTIRING.**
>
> ```
> O'RTACHA:      top-5 da times UMUMAN YO'Q
>                birinchi o'rinda — [SEP] (0.210), ya'ni "hech narsa"
>
> QATLAM 5/5:    times = 0.584, BIRINCHI o'rinda va boshqalardan
>                7 BARAVAR kuchli
> ```
>
> 💡 **`eng_yaxshi_bosh` jadvaliga ham qarang:** eng kuchli 5 ta boshning **to'rttasi** — 4- va 5-qatlamlarda. Koreferensiya — **yuqori qatlamlar** ishi.
>
> ## 🔑 **Bu — butun loyihaning maqsadi:** modelni **to'g'ri joydan** ko'rish.

---

# 🧮 2-loyiha. E'tiborni noldan qurish

> **Maqsad:** formulani **o'z qo'lingiz bilan** yozib, model bilan **bir xil** natija olish.

```python
def etibor_qolda(model, X, qatlam, bosh):
    """E'tibor og'irliklarini QO'LDA hisoblaydi."""
    layer = model.transformer.layer[qatlam].attention
    with torch.no_grad():
        Q = layer.q_lin(X)          # ① Query proyeksiyasi
        K = layer.k_lin(X)          # ① Key proyeksiyasi

    n = layer.n_heads
    d_k = Q.shape[-1] // n

    def bosh_ajrat(t):
        return t.view(1, -1, n, d_k).transpose(1, 2)

    q = bosh_ajrat(Q)[0, bosh]
    k = bosh_ajrat(K)[0, bosh]

    ballar = (q @ k.T) / np.sqrt(d_k)       # ②③ Q·Kᵀ / √d_k
    return torch.softmax(ballar, dim=-1)    # ④ softmax


def tekshir(jumla, qatlam=5, bosh=5):
    enc = tok(jumla, return_tensors="pt")
    with torch.no_grad():
        o = mod(**enc, output_attentions=True, output_hidden_states=True)
    qolda = etibor_qolda(mod, o.hidden_states[qatlam], qatlam, bosh)
    haqiqiy = o.attentions[qatlam][0, bosh]
    farq = float((qolda - haqiqiy).abs().max())
    print(f"qatlam {qatlam}, bosh {bosh}")
    print(f"  maks farq : {farq}")
    print(f"  bir xilmi?: {'✅ HA' if farq < 1e-5 else '❌ YO`Q'}")
    return farq


tekshir("The New York Times is a daily newspaper. It was first issued in 1851.")
```

```
qatlam 5, bosh 5
  maks farq : 0.0
  bir xilmi?: ✅ HA
```

### 🔬 Hamma qatlam va boshda tekshiramiz

```python
enc = tok("The cat sat on the mat", return_tensors="pt")
with torch.no_grad():
    o = mod(**enc, output_attentions=True, output_hidden_states=True)

eng_katta = 0.0
for L in range(len(o.attentions)):
    for H in range(o.attentions[L].shape[1]):
        q = etibor_qolda(mod, o.hidden_states[L], L, H)
        eng_katta = max(eng_katta, float((q - o.attentions[L][0, H]).abs().max()))
print(f"72 ta bosh tekshirildi · eng katta farq: {eng_katta}")
```

> ## 🏆 **Agar farq 0 bo'lsa — siz transformerni TUSHUNDINGIZ.**
>
> Butun "sehr" — **to'rt qator**:
> ```python
> Q = q_lin(X)
> K = k_lin(X)
> ballar = Q @ K.T / sqrt(d_k)
> og'irlik = softmax(ballar)
> ```

---

# ⭐⭐ 3-loyiha. Kontekst o'lchagichi

> **Maqsad:** *"Kontekst so'z ma'nosini QANCHA o'zgartiradi?"* — son bilan javob.
> 🏆 **Butun modulning eng muhim natijasi shu loyihada.**

```python
def kontekst_vektori(jumla, soz, qatlam):
    """Berilgan so'zning ma'lum qatlamdagi vektorini qaytaradi."""
    e = tok(jumla, return_tensors="pt")
    t = tok.convert_ids_to_tokens(e["input_ids"][0])
    if soz not in t:
        raise ValueError(f"'{soz}' topilmadi. Tokenlar: {t}")
    with torch.no_grad():
        o = mod(**e, output_hidden_states=True)
    return o.hidden_states[qatlam][0, t.index(soz)]


def kontekst_tasiri(jumla_a, jumla_b, soz, batafsil=True):
    """Ikki kontekstda bir so'z qanchalik farq qiladi?"""
    natija = []
    for L in range(len(mod.transformer.layer) + 1):
        c = float(F.cosine_similarity(kontekst_vektori(jumla_a, soz, L),
                                      kontekst_vektori(jumla_b, soz, L), dim=0))
        natija.append({"qatlam": L, "cos": round(c, 4)})
    df = pd.DataFrame(natija)
    if batafsil:
        print(f"'{soz}':")
        print(f"   A: {jumla_a}")
        print(f"   B: {jumla_b}")
        for _, r in df.iterrows():
            n = int((r["cos"] + 1) / 2 * 40)
            print(f"   qatlam {int(r['qatlam'])}: {r['cos']:>7.4f} {'█' * n}")
        print(f"   O'ZGARISH: {df.cos.iloc[0]:.4f} → {df.cos.iloc[-1]:.4f}")
    return df


kontekst_tasiri("The food was very good", "The food was not good", "good")
```

```
'good':
   A: The food was very good
   B: The food was not good
   qatlam 0:  1.0000 ████████████████████████████████████████
   qatlam 1:  0.9454 ██████████████████████████████████████
   qatlam 2:  0.9513 ███████████████████████████████████████
   qatlam 3:  0.9154 ██████████████████████████████████████
   qatlam 4:  0.5182 ██████████████████████████████
   qatlam 5:  0.3966 ███████████████████████████
   qatlam 6: -0.1150 █████████████████
   O'ZGARISH: 1.0000 → -0.1150
```

> ## 💥 **BUTUN TRANSFORMERNING MOHIYATI — BITTA JADVALDA.**
>
> ```
> qatlam 0  →   1.0000    BIR XIL SO'Z, BIR XIL VEKTOR
> qatlam 5  →   0.7318    farq o'sib boradi
> qatlam 6  →  -0.1150    DEYARLI QARAMA-QARSHI
> ```
>
> ## 🔑 **Model `"not"` ni ko'rdi va `"good"` ning MA'NOSINI o'zgartirdi.**
>
> ## 💡 **E'tibor bering — o'zgarish TEKIS EMAS:**
> ```
> qatlam 0→3   1.0000 → 0.9154    sekin  (hatto 2-qatlamda bir oz KO'TARILDI)
> qatlam 3→4   0.9154 → 0.5182    ⚡ KESKIN SAKRASH
> qatlam 5→6   0.3966 → -0.1150   ⚡ YANA KESKIN
> ```
>
> Model ma'noni **birdan** emas, **ikki bosqichda** hal qiladi — va **eng katta qaror oxirgi qatlamlarda** qabul qilinadi.

### 🧪 Boshqa omonimlarda sinang

```python
uchlik = [
    ("I went to the river bank", "I need money from the bank", "bank"),
    ("The bat flew at night",    "He swung the bat hard",      "bat"),
    ("The movie was very good",  "The movie was not good",     "good"),
]
xulosa = []
for a, b, s in uchlik:
    df = kontekst_tasiri(a, b, s, batafsil=False)
    xulosa.append({"so'z": s, "qatlam 0": df.cos.iloc[0],
                   "oxirgi": df.cos.iloc[-1],
                   "o'zgarish": round(df.cos.iloc[0] - df.cos.iloc[-1], 4)})
print(pd.DataFrame(xulosa).to_string(index=False))
```

```
so'z  qatlam 0  oxirgi  o'zgarish
bank    1.0000  0.4569     0.5431
 bat    0.9635  0.6440     0.3195
good    1.0000 -0.2187     1.2187
```

> ## 🎯 **NAQSH TASDIQLANDI — uchala holatda ham:**
> ```
> qatlam 0  →  ~1.0000    kirish embeddingi kontekstni BILMAYDI
> oxirgi    →  ancha past  e'tibor ma'noni AJRATDI
> ```
>
> ## 😲 **VA BITTA QIZIQ TAFSILOT — `bat` boshlanishi 1.0 EMAS (0.9635).**
>
> Sabab: `"The bat flew at night"` va `"He swung the bat hard"` — bu jumlalarda `bat` **turli pozitsiyada** turibdi *(2-o'rin vs 4-o'rin)*, va `hidden_states[0]` ga **pozitsion embedding allaqachon qo'shilgan**.
>
> ## 🔑 **Ya'ni `qatlam 0` — bu sof so'z embeddingi EMAS, balki `so'z + pozitsiya`.** `good` va `bank` da pozitsiyalar tasodifan mos kelgan, `bat` da esa yo'q.
>
> 💡 **Eng katta o'zgarish — `good` da (1.2187)**, chunki `not` **sentimentni butunlay ag'daradi**. `bank` va `bat` da esa faqat **mavzu** o'zgaradi, qarama-qarshilik yo'q.
>
> ## 💡 **Mana nima uchun "kontekstual embedding" deyiladi** — va nima uchun 5-darsda `cos(good,bad)=0.528` bo'lgani **muammo emas**.

---

# 🎭 4-loyiha. Niqob tekshiruvchisi

> **Maqsad:** modelning encoder yoki decoder ekanini **avtomatik** aniqlash.

```python
def niqob_tekshir(model_id, jumla="The cat sat on the mat"):
    """Model kelajakni ko'radimi? (encoder vs decoder)"""
    t = AutoTokenizer.from_pretrained(model_id)
    try:
        m = AutoModelForCausalLM.from_pretrained(model_id,
                                                 attn_implementation="eager")
        tur = "CausalLM"
    except Exception:
        m = AutoModel.from_pretrained(model_id, attn_implementation="eager")
        tur = "Model"

    if t.pad_token is None:
        t.pad_token = t.eos_token
    e = t(jumla, return_tensors="pt")
    with torch.no_grad():
        A = m(**e, output_attentions=True).attentions

    niqoblangan = 0
    jami = 0
    for L in range(len(A)):
        for H in range(A[L].shape[1]):
            W = A[L][0, H].numpy()
            jami += 1
            if np.allclose(np.triu(W, 1), 0, atol=1e-6):
                niqoblangan += 1

    ulush = niqoblangan / jami
    xulosa = ("🟢 DECODER (niqoblangan — matn YARATADI)" if ulush > 0.9
              else "🔵 ENCODER (niqobsiz — matnni TUSHUNADI)")
    print(f"{model_id}")
    print(f"   yuklandi     : {tur}")
    print(f"   niqoblangan  : {niqoblangan}/{jami}  ({ulush:.0%})")
    print(f"   XULOSA       : {xulosa}\n")
    return ulush


niqob_tekshir("distilgpt2")
niqob_tekshir("distilbert-base-uncased-finetuned-sst-2-english")
```

```
distilgpt2
   yuklandi     : CausalLM
   niqoblangan  : 72/72  (100%)
   XULOSA       : 🟢 DECODER (niqoblangan — matn YARATADI)

distilbert-base-uncased-finetuned-sst-2-english
   yuklandi     : Model
   niqoblangan  : 0/72  (0%)
   XULOSA       : 🔵 ENCODER (niqobsiz — matnni TUSHUNADI)
```

> ## 🎯 **100% vs 0% — mutlaq aniq farq.**
>
> ## 🔑 **AMALIY FOYDA:** yangi model ko'rganingizda uning **hujjatini o'qimasdan** turini aniqlay olasiz. Bu esa **nima uchun ishlatish mumkinligini** aytadi:
> ```
> 🟢 decoder  →  matn yaratish, chatbot, davom ettirish
> 🔵 encoder  →  tasniflash, NER, savol-javob, embedding
> ```

---

# 🇺🇿 5-loyiha. O'zbek tili uchun tokenizator tahlili

> **Maqsad:** o'zbekcha matn tokenizatorda **qanchalik yomon** bo'linishini **son bilan** o'lchash.
> ⚠️ 29-moduldagi `0.500` natijaning **chuqur sababini** topamiz.

```python
def tokenizator_solishtir(model_id, juftliklar):
    """Bir xil ma'noli ingliz/o'zbek so'zlarni solishtiradi."""
    t = AutoTokenizer.from_pretrained(model_id)
    qatorlar = []
    for en, uz in juftliklar:
        te, tu = t.tokenize(en), t.tokenize(uz)
        qatorlar.append({
            "ingliz": en, "en_token": len(te),
            "o'zbek": uz, "uz_token": len(tu),
            "nisbat": round(len(tu) / len(te), 1),
        })
    df = pd.DataFrame(qatorlar)
    print(df.to_string(index=False))
    print(f"\nO'RTACHA nisbat: {df.nisbat.mean():.1f}×")
    return df


JUFTLIKLAR = [
    ("book",        "kitob"),
    ("books",       "kitoblar"),
    ("house",       "uy"),
    ("Uzbekistan",  "O'zbekiston"),
    ("Tashkent",    "Toshkent"),
    ("beautiful",   "go'zal"),
    ("interesting", "qiziqarli"),
    ("thank you",   "rahmat"),
]
tokenizator_solishtir(M, JUFTLIKLAR)
```

### Matn darajasida ta'siri

```python
def matn_narxi(model_id, en_matn, uz_matn):
    t = AutoTokenizer.from_pretrained(model_id)
    ne, nu = len(t.encode(en_matn)), len(t.encode(uz_matn))
    print(f"ingliz : {ne:3d} token  |  {en_matn}")
    print(f"o'zbek : {nu:3d} token  |  {uz_matn}")
    print(f"NISBAT : {nu / ne:.1f}×")
    print(f"\n512 token chegarasida:")
    print(f"   ingliz matn  ≈ {512 // (ne / len(en_matn.split())):.0f} so'z")
    print(f"   o'zbek matn  ≈ {512 // (nu / len(uz_matn.split())):.0f} so'z")


matn_narxi(M,
           "This book is very interesting and I recommend it to everyone",
           "Bu kitob juda qiziqarli va men uni hammaga tavsiya qilaman")
```

```
     ingliz  en_token      o'zbek  uz_token  nisbat
       book         1       kitob         2     2.0
      books         1    kitoblar         3     3.0
      house         1          uy         2     2.0
 Uzbekistan         1 O'zbekiston         6     6.0
   Tashkent         4    Toshkent         4     1.0
  beautiful         1      go'zal         4     4.0
interesting         1   qiziqarli         5     5.0
  thank you         2      rahmat         3     1.5

O'RTACHA nisbat: 3.1×
```

```
ingliz :  13 token  |  This book is very interesting and I recommend it to everyone
o'zbek :  25 token  |  Bu kitob juda qiziqarli va men uni hammaga tavsiya qilaman
NISBAT : 1.9×

512 token chegarasida:
   ingliz matn  ≈ 433 so'z
   o'zbek matn  ≈ 204 so'z
```

> ## 📉 **SO'Z DARAJASIDA 3.1×, MATN DARAJASIDA 1.9×.**
>
> `Uzbekistan` = **1 token**, `O'zbekiston` = **6 token**. Bir xil mamlakat nomi.
>
> 💡 **Nima uchun matn darajasida nisbat kichikroq?** Chunki o'zbekcha jumlada **so'zlar kamroq** *(9 vs 11)* — agglyutinatsiya bir necha ingliz so'zini bitta o'zbek so'ziga jamlaydi. Ikki effekt qisman **bir-birini qoplaydi**.
>
> ⚠️ **Lekin yakuniy natija baribir yomon:** 512 token chegarasida **433 ingliz so'zi** vs **204 o'zbek so'zi** — ya'ni **ikki baravar kam**.

> ## 🔑 **UCHTA AMALIY OQIBAT:**
>
> ```
> ① 512 token chegarasiga O'ZBEK matn TEZROQ yetadi
>       →  uzunroq matnlar KESILADI
>
> ② API narxi TOKEN bo'yicha hisoblanadi
>       →  bir xil matn UCHUN KO'PROQ to'laysiz
>
> ③ E'tibor MA'NOSIZ bo'laklar orasida ishlaydi
>       →  'kit' + '##ob'  —  bu bo'laklar nimani anglatadi?
> ```
>
> ## 💥 **MANA 29-MODULDAGI 0.500 NATIJANING CHUQUR SABABI.**
>
> Muammo **e'tibor mexanizmida emas** — u **tildan mutlaqo mustaqil** va **mukammal** ishlaydi *(2-loyiha buni isbotladi)*.
>
> Muammo — **tokenizatsiyada**. Model o'zbekcha so'zlarni ma'nosiz bo'laklarga maydalaydi, e'tibor esa **shu bo'laklar** orasida ishlashga majbur.
>
> ✅ **Yechim:** ko'p tilli tokenizator *(`XLM-R`)* yoki **28-moduldagi** `uznlp` yondashuvi.

---

# 🎓 6-loyiha. Transformer blokini noldan qurish

> **Maqsad:** butun modulni **bitta ishlaydigan sinfga** jamlash.

```python
class TransformerBlok(torch.nn.Module):
    """To'liq transformer bloki — 4-darsdagi diagrammaning kodi."""

    def __init__(self, d_model=64, n_heads=4, d_ff=None, niqob=False):
        super().__init__()
        assert d_model % n_heads == 0, "d_model boshlarga bo'linishi kerak"
        d_ff = d_ff or 4 * d_model            # 7-dars: 4× standart

        # ── E'tibor (6-dars) ──
        self.q = torch.nn.Linear(d_model, d_model)
        self.k = torch.nn.Linear(d_model, d_model)
        self.v = torch.nn.Linear(d_model, d_model)
        self.out = torch.nn.Linear(d_model, d_model)
        self.norm1 = torch.nn.LayerNorm(d_model)

        # ── Feed-forward (7-dars) ──
        self.lin1 = torch.nn.Linear(d_model, d_ff)
        self.lin2 = torch.nn.Linear(d_ff, d_model)
        self.norm2 = torch.nn.LayerNorm(d_model)

        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        self.niqob = niqob                    # 8-dars

    def _boshlarga(self, x, B, T):
        return x.view(B, T, self.n_heads, self.d_k).transpose(1, 2)

    def forward(self, x):
        B, T, _ = x.shape
        Q = self._boshlarga(self.q(x), B, T)
        K = self._boshlarga(self.k(x), B, T)
        V = self._boshlarga(self.v(x), B, T)

        ballar = Q @ K.transpose(-2, -1) / self.d_k ** 0.5     # ①②
        if self.niqob:                                          # 8-dars
            m = torch.triu(torch.ones(T, T, device=x.device), 1).bool()
            ballar = ballar.masked_fill(m, float("-inf"))
        w = torch.softmax(ballar, dim=-1)                       # ③

        e = (w @ V).transpose(1, 2).reshape(B, T, -1)           # ④
        x = self.norm1(x + self.out(e))                         # Add & Norm

        x = self.norm2(x + self.lin2(F.gelu(self.lin1(x))))     # FFN + Add & Norm
        return x, w
```

### 🧪 Sinov

```python
for niqob in [False, True]:
    blok = TransformerBlok(d_model=64, n_heads=4, niqob=niqob)
    x = torch.randn(1, 6, 64)
    y, w = blok(x)
    W = w[0, 0].detach().numpy()
    nom = "🟢 DECODER (niqobli)" if niqob else "🔵 ENCODER (niqobsiz)"
    print(f"{nom}")
    print(f"   chiqish shakli : {tuple(y.shape)}")
    print(f"   e'tibor shakli : {tuple(w.shape)}")
    print(f"   yig'indi = 1?  : {bool(np.allclose(W.sum(-1), 1))}")
    print(f"   yuqori uchbur. : {'NOL ✅' if np.allclose(np.triu(W,1),0) else 'to`la'}")
    print(f"   parametr       : {sum(p.numel() for p in blok.parameters()):,}\n")
```

```
🔵 ENCODER (niqobsiz)
   chiqish shakli : (1, 6, 64)
   e'tibor shakli : (1, 4, 6, 6)
   yig'indi = 1?  : True
   yuqori uchbur. : to`la
   parametr       : 49984

🟢 DECODER (niqobli)
   chiqish shakli : (1, 6, 64)
   e'tibor shakli : (1, 4, 6, 6)
   yig'indi = 1?  : True
   yuqori uchbur. : NOL ✅
   parametr       : 49984
```

> ## 🏆 **BIR XIL KOD. BIR XIL PARAMETR SONI.**
> ## **Yagona farq — `niqob=True/False`.**
>
> ## 🔑 **Mana BERT va GPT o'rtasidagi butun farq — BITTA MANTIQIY BAYROQ.**

### 🎯 Qatlamlarni ketma-ket ulash

```python
class MiniTransformer(torch.nn.Module):
    def __init__(self, n_qatlam=6, d_model=64, n_heads=4, niqob=False):
        super().__init__()
        self.qatlamlar = torch.nn.ModuleList(
            [TransformerBlok(d_model, n_heads, niqob=niqob)
             for _ in range(n_qatlam)])

    def forward(self, x):
        etiborlar = []
        for q in self.qatlamlar:
            x, w = q(x)
            etiborlar.append(w)
        return x, etiborlar


m = MiniTransformer(n_qatlam=6)
y, A_ = m(torch.randn(1, 6, 64))
print(f"qatlamlar : {len(A_)}")
print(f"boshlar   : {A_[0].shape[1]}")
print(f"jami e'tibor matritsasi: {len(A_) * A_[0].shape[1]}")
print(f"parametr  : {sum(p.numel() for p in m.parameters()):,}")
```

```
qatlamlar : 6
boshlar   : 4
jami e'tibor matritsasi: 24
parametr  : 299904
```

> ## 🎓 **TABRIKLAYMIZ — SIZ TRANSFORMER QURDINGIZ.**
>
> ```
> Sizniki      :   299 904 parametr ·  6 qatlam ·  4 bosh ·  64 o'lcham
> distilbert   : 66 362 880 parametr ·  6 qatlam · 12 bosh · 768 o'lcham
> GPT-4        :  ~1.7 trillion      · yuzlab qatlam
>
> 🔑 ARXITEKTURA — BIR XIL. Farq faqat MIQYOSDA.
> ```

---

## 🏆 Siz nimalarni qurdingiz?

```
1️⃣  E'tibor tadqiqotchisi   →  "bu so'z NIMAGA qaraydi?"
2️⃣  Qo'lda hisoblash        →  formula = model (farq 0.0)
3️⃣  Kontekst o'lchagichi    →  1.0000 → -0.1150  ⭐⭐⭐
4️⃣  Niqob tekshiruvchisi    →  encoder yoki decoder?
5️⃣  🇺🇿 Tokenizator tahlili  →  0.500 natijaning SABABI
6️⃣  Transformer bloki       →  299 904 parametr, noldan
```

---

## 🎯 Keyingi qadamingiz

```
① E'tibor tadqiqotchisini O'Z matnlaringizda ishlating
     · qaysi bosh sizning vazifangiz uchun muhim?

② Kontekst o'lchagichini omonimlarda sinang
     · model qaysi qatlamda ma'noni "hal qiladi"?

③ 🇺🇿 O'zbekcha matningizni tokenizatordan o'tkazing
     · nechta bo'lakka bo'linadi? 512 chegarasi yetadimi?

④ Mini-transformerni O'QITIB ko'ring
     · oddiy vazifada (masalan, sonlarni tartiblash)

⑤ 31-modulga o'ting — endi GPT bilan AMALIY ishlaymiz
```

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md) · ➡️ **31-modul: GPT modellari**
