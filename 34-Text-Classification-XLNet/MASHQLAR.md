# 📝 34-modul mashqlari

> **40 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **HAMMASI BEPUL** — API kaliti kerak emas.

## ⚙️ Tayyorgarlik

```bash
pip install transformers torch pandas numpy scikit-learn
pip install datasets evaluate clean-text sentencepiece accelerate
```

```python
import warnings; warnings.filterwarnings("ignore")
import re, time, inspect, numpy as np, pandas as pd
import torch, datasets, evaluate
from cleantext import clean as cleaner
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from transformers import (XLNetTokenizer, XLNetForSequenceClassification,
                          AutoTokenizer, AutoModel,
                          TrainingArguments, Trainer, pipeline)

MODEL = "xlnet-base-cased"
ID2LABEL = {0: "anger", 1: "fear", 2: "joy", 3: "sadness"}
LABEL2ID = {v: k for k, v in ID2LABEL.items()}
```

> ## 💡 **Ma'lumot yo'li** — kursning ko'rsatmasi bo'yicha `emotions_data/` papkasida:

```python
data_train = pd.read_csv("emotions_data/emotion-labels-train.csv")
data_test  = pd.read_csv("emotions_data/emotion-labels-test.csv")
data_val   = pd.read_csv("emotions_data/emotion-labels-val.csv")
data = pd.concat([data_train, data_test, data_val], ignore_index=True)
```

---

# 🟢 OSON *(1–13)*

**M1.** XLNet qachon va kim tomonidan yaratilgan?

**M2.** XLNet-base nechta parametr va qatlamga ega?

**M3.** XLNet `[MASK]` ishlatadimi?

**M4.** XLNet'ning asosiy g'oyasi nima?

**M5.** Nechta hissiyot sinfi bor?

**M6.** `pad_token_id` XLNet'da nechchi?

**M7.** XLNet to'ldirishni qaysi tomondan qo'yadi?

<details>
<summary>✅ Javoblar M1–M7</summary>

**M1.** ## **2019**, **Google AI** *(universitetlar bilan)*.

**M2.** ## **110M** parametr, **12** qatlam — `bert-base` bilan **aynan bir xil**.

**M3.** ## **Yo'q** — bu uning **asosiy farqi**.

**M4.** ## **Permutatsiya** — bashorat **tartibi** har safar o'zgaradi *(so'zlar emas!)*.

**M5.** ## **To'rtta** — `anger`, `fear`, `joy`, `sadness`.

**M6.** ## **5** *(BERT'da 0)*.

**M7.** ## **CHAPDAN** *(`padding_side='left'`)*.

</details>

**M8.** `<cls>` qayerda turadi?

**M9.** `▁` belgisi nimani anglatadi?

**M10.** `MISSING` ogohlantirishi nimani bildiradi?

**M11.** `evaluation_strategy` ning yangi nomi?

**M12.** `Trainer(tokenizer=)` o'rniga nima?

**M13.** 4 sinf uchun bazaviy chiziq nechchi?

<details>
<summary>✅ Javoblar M8–M13</summary>

**M8.** ## **OXIRIDA**. BERT'da `[CLS]` — boshida.

**M9.** **"Bu so'zdan oldin bo'shliq bor"** — SentencePiece'da **so'z boshi** belgisi.

**M10.** Tasnif boshi checkpointda **yo'q** edi, **tasodifiy** yaratildi. Bu — **normal**.

**M11.** ## **`eval_strategy`**.

**M12.** ## **`processing_class=`**.

**M13.** ## **25%** *(1/4)*. Muvozanatsiz asl to'plamda esa **31.7%** *(har doim `fear`)*.

</details>

---

# 🟡 O'RTA *(14–30)*

**M14.** ⭐ Uchala modelning parametrlarini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
for n in ["bert-base-cased", "roberta-base", "xlnet-base-cased"]:
    m = AutoModel.from_pretrained(n)
    print(f"{n:20s} {sum(p.numel() for p in m.parameters()):>12,}")
```

⚠️ `xlnet-base-cased` uchun `sentencepiece` **shart**.

</details>

**M15.** ⭐ Bazaviy chiziqni hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
v = data.label.value_counts()
print(v.to_string())
print(f"\ntasodifiy      : {1/len(v):.1%}")
print(f"har doim '{v.idxmax()}' : {v.max()/len(data):.1%}")
```

```
fear       2252
anger      1701
joy        1616
sadness    1533

tasodifiy      : 25.0%
har doim 'fear' : 31.7%
```

## 🔑 **31.7% — bu "hech nima o'rganmagan" modelning natijasi.** Aniqlikni **shu bilan** solishtiring.

</details>

**M16.** ⭐⭐ `cleaner` nimani yashirincha qilishini toping.

<details>
<summary>✅ Yechim</summary>

```python
s = "Just got back from seeing @GaryDelaney in Burslem. AMAZING!! 😂 #hilarious"
print("asl        :", repr(s))
print("no_emoji   :", repr(cleaner(s, no_emoji=True)))
print("lower=False:", repr(cleaner(s, no_emoji=True, lower=False)))
```

## 💥 **`cleaner` HAMMA HARFNI KICHIK QILADI.** Biz `xlnet-base-CASED` ishlatamiz — ya'ni **cased modelning ustunligi yo'qoladi**. `lower=False` bering.

</details>

**M17.** ⭐⭐ Kursdagi `groupby.apply` xatosini takrorlang.

<details>
<summary>✅ Yechim</summary>

```python
k = data.label.value_counts().min()
t = (data.groupby("label").apply(lambda x: x.sample(k, random_state=42))
         .reset_index(drop=True))
print("kurs usuli ustunlari:", list(t.columns))

d = data.groupby("label", group_keys=False).sample(n=k, random_state=42).reset_index(drop=True)
print("to'g'ri usul       :", list(d.columns))
```

```
kurs usuli ustunlari: ['text']
to'g'ri usul       : ['text', 'label']
```

## 💥 pandas 3 da `groupby.apply` **guruhlash ustunini qaytarmaydi**. Keyingi `t.label` — `AttributeError`.

</details>

**M18.** ⭐ Emoji necha foiz qatorda bor?

<details>
<summary>✅ Yechim</summary>

```python
EMO = re.compile("[\U0001F300-\U0001FAFF☀-➿⬀-⯿️]")
e = data.text.map(lambda s: bool(EMO.search(str(s))))
print(f"{int(e.sum())} qator ({e.mean():.1%})")
```

⚠️ `data.text.str.contains(r"[\U0001F300-...]")` — pandas 3 da **`ArrowInvalid`**. `.map()` ishlating.

</details>

**M19.** ⭐ Tokenizatorlarni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
s = "Machine learning is unbelievably powerful."
for n in ["bert-base-cased", "xlnet-base-cased"]:
    t = AutoTokenizer.from_pretrained(n)
    print(f"{n:18s} {t.tokenize(s)}")
    print(f"{'':18s} kalitlar={list(t(s).keys())} padding_side={t.padding_side}")
```

BERT `##` bilan **davomni**, XLNet `▁` bilan **boshni** belgilaydi.

</details>

**M20.** ⭐⭐ `max_length` ni o'lchab tanlang.

<details>
<summary>✅ Yechim</summary>

```python
tok = XLNetTokenizer.from_pretrained(MODEL)
uz = np.array([len(tok(t)["input_ids"]) for t in data.text[:1000]])
for p in [50, 90, 95, 99, 100]:
    print(f"{p:3d}-protsentil: {int(np.percentile(uz, p)):3d}")
for L in [32, 64, 128]:
    print(f"max_length={L:3d}  kesilgan={(uz > L).mean():.2%}"
          f"  isrof={1 - uz.clip(max=L).mean()/L:.1%}  tezlik={((128/L)**2):.1f}×")
```

## 🔑 **`kesilgan` 0% bo'lgan eng kichik `L` ni tanlang.** Bizda — **64**.

</details>

**M21.** `<cls>` pozitsiyasini toping.

<details>
<summary>✅ Yechim</summary>

```python
tok = XLNetTokenizer.from_pretrained(MODEL)
e = tok("qisqa matn", padding="max_length", max_length=32, truncation=True)
print("cls indeksi:", e["input_ids"].index(tok.cls_token_id), "/ 32")
```

```
cls indeksi: 31 / 32
```

## 💥 **HAR DOIM OXIRGI POZITSIYA.** BERT'da esa **0**.

</details>

**M22.** ⭐ API o'zgarishini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
a = list(inspect.signature(TrainingArguments.__init__).parameters)
t = list(inspect.signature(Trainer.__init__).parameters)
for nom, bor in [("eval_strategy", "eval_strategy" in a),
                 ("evaluation_strategy", "evaluation_strategy" in a),
                 ("Trainer.tokenizer", "tokenizer" in t),
                 ("Trainer.processing_class", "processing_class" in t)]:
    print(f"{nom:26s} {'✅' if bor else '❌'}")
```

## 🔑 **Har qanday API o'zgarishini shu yo'l bilan hujjatsiz tekshiring.**

</details>

**M23.** ⭐ `id2label` xaritasini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
le = LabelEncoder(); le.fit(data["label"])
assert list(le.classes_) == [ID2LABEL[i] for i in range(4)], "XARITA CHALKASH!"
print("✅ xarita to'g'ri:", dict(enumerate(le.classes_)))
```

## ⚠️ **Bu `assert` ni har loyihaga yozing.** Chalkash xarita — **jim xato**: aniqlik yuqori, javoblar noto'g'ri.

</details>

**M24.** ⭐ Tasnif boshida nechta parametr?

<details>
<summary>✅ Yechim</summary>

```python
m = XLNetForSequenceClassification.from_pretrained(
    MODEL, num_labels=4, id2label=ID2LABEL, label2id=LABEL2ID)
yangi = sum(p.numel() for n, p in m.named_parameters()
            if "logits_proj" in n or "sequence_summary" in n)
jami = sum(p.numel() for p in m.parameters())
print(f"yangi bosh: {yangi:,}   jami: {jami:,}   ulush: {yangi/jami:.4%}")
```

</details>

**M25.** `f1` metrikasini qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
acc, f1 = evaluate.load("accuracy"), evaluate.load("f1")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    p = np.argmax(logits, axis=-1)
    return {**acc.compute(predictions=p, references=labels),
            **f1.compute(predictions=p, references=labels, average="macro")}
```

</details>

**M26.** ⭐ Stratifikatsiyalangan bo'linish yasang.

<details>
<summary>✅ Yechim</summary>

```python
d = data.groupby("label", group_keys=False).sample(
        n=data.label.value_counts().min(), random_state=42).reset_index(drop=True)
d["y"] = LabelEncoder().fit_transform(d["label"])
tr, te = train_test_split(d, test_size=0.2, random_state=42, stratify=d["y"])
for n, x in [("train", tr), ("test", te)]:
    print(n, x.y.value_counts(normalize=True).sort_index().round(3).to_dict())
```

## 🔑 **`stratify` sinf nisbatini KAFOLATLAYDI.** Kurs buni **qilmagan**.

</details>

**M27.** ⭐ Bazaviy chiziq bilan solishtiruvchi funksiya.

<details>
<summary>✅ Yechim</summary>

```python
def baho(aniqlik, n_sinf=4):
    b = 1 / n_sinf
    if aniqlik < b:        return f"💥 {aniqlik:.3f} < {b:.3f} — TASODIFDAN YOMON"
    if aniqlik < b * 1.2:  return f"⚠️ {aniqlik:.3f} ≈ {b:.3f} — deyarli o'rganmagan"
    return f"✅ {aniqlik:.3f} — {aniqlik/b:.1f}× bazaviydan yaxshi"

for a in [0.18, 0.26, 0.55, 0.82]: print(baho(a))
```

</details>

**M28.** Tokenlash keshlanishini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
t0 = time.perf_counter(); dd.map(tokenize, batched=True)
print(f"1-marta: {time.perf_counter()-t0:.2f}s")
t0 = time.perf_counter(); dd.map(tokenize, batched=True)
print(f"2-marta: {time.perf_counter()-t0:.2f}s  ← keshdan")
```

</details>

**M29.** ⭐ Sinf og'irliklarini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
from sklearn.utils.class_weight import compute_class_weight
y = LabelEncoder().fit_transform(data["label"])
w = compute_class_weight("balanced", classes=np.unique(y), y=y)
print(dict(zip(sorted(data.label.unique()), w.round(3))))
```

**Og'irlik** yondashuvi **970 qatorni saqlaydi** — muvozanatlashtirish shart emas.

</details>

**M30.** ⭐ Matn uzunligi va sinf orasida bog'liqlik bormi?

<details>
<summary>✅ Yechim</summary>

```python
data["uz"] = data.text.str.split().str.len()
print(data.groupby("label")["uz"].describe()[["mean", "50%", "max"]].round(1).to_string())
```

⚠️ Agar bitta sinf **sezilarli uzun** bo'lsa — model **uzunlikni** o'rganib qo'yishi mumkin, **mazmunni emas**. Bu — **yashirin qisqa yo'l** *(shortcut learning)*.

</details>

---

# 🔴 QIYIN *(31–40)*

**M31.** ⭐⭐ Kurs retseptini takrorlang va bazaviy chiziq bilan solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
tr = tds["train"].shuffle(seed=42).select(range(100))
ev = tds["test"].shuffle(seed=42).select(range(100))
# ... Trainer sozlang, train() qiling ...
```

Bizning natijamiz:
```
100 namuna · 3 epoxa  →  aniqlik 0.18   loss 1.46 (O'SIB bordi)
tasodifiy             →  aniqlik 0.25
```

## 💥 **MODEL TASODIFDAN YOMONROQ.** Kurs bu raqamni **ko'rsatmaydi**.

</details>

**M32.** ⭐⭐ Namuna hajmini oshirib qayta sinang.

<details>
<summary>✅ Yechim</summary>

```python
for n in [100, 400, 1200]:
    print(f"n_train={n}: ...")     # har birini alohida ishga tushiring
```

## 🔑 **O'RGANISH EGRI CHIZIG'I (learning curve).** U sizga *"ko'proq ma'lumot yig'ish foydalimi?"* degan savolga **javob beradi**.

</details>

**M33.** ⭐⭐ `max_length=64` bilan tezlikni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time
tok = XLNetTokenizer.from_pretrained(MODEL)
m = XLNetForSequenceClassification.from_pretrained(MODEL, num_labels=4); m.eval()
for L in [64, 128]:
    e = tok("qisqa matn", padding="max_length", max_length=L, return_tensors="pt")
    with torch.no_grad():
        for _ in range(3): m(**e)
        t0 = time.perf_counter()
        for _ in range(20): m(**e)
    print(f"max_length={L:3d}  {(time.perf_counter()-t0)/20*1000:7.2f} ms")
```

E'tibor **O(n²)** — nazariy nisbat **4×**.

</details>

**M34.** ⭐⭐ Chalkashlik matritsasini chizing.

<details>
<summary>✅ Yechim</summary>

```python
from sklearn.metrics import confusion_matrix, classification_report

pred = trainer.predict(eval_ds)
y_true, y_pred = pred.label_ids, np.argmax(pred.predictions, axis=-1)

cm = confusion_matrix(y_true, y_pred)
print(pd.DataFrame(cm, index=[ID2LABEL[i] for i in range(4)],
                   columns=[ID2LABEL[i] for i in range(4)]).to_string())
print("\n" + classification_report(y_true, y_pred,
      target_names=[ID2LABEL[i] for i in range(4)]))
```

## 🏆 **CHALKASHLIK MATRITSASI YALANG'OCH ANIQLIKDAN KO'RA FOYDALIROQ** — u **qaysi juftlik** chalkashayotganini ko'rsatadi *(masalan `fear` ↔ `sadness`)*.

</details>

**M35.** ⭐⭐⭐ Og'irlikli `Trainer` yozing.

<details>
<summary>✅ Yechim</summary>

```python
from torch.nn import CrossEntropyLoss

class OgirlikliTrainer(Trainer):
    def __init__(self, *a, class_weights=None, **kw):
        super().__init__(*a, **kw)
        self.cw = None if class_weights is None else torch.tensor(
            class_weights, dtype=torch.float)

    def compute_loss(self, model, inputs, return_outputs=False, **kw):
        labels = inputs.pop("labels")
        out = model(**inputs)
        loss = CrossEntropyLoss(weight=self.cw)(
            out.logits.view(-1, self.model.config.num_labels), labels.view(-1))
        return (loss, out) if return_outputs else loss
```

⚠️ `compute_loss` imzosi versiyalar orasida o'zgargan — `**kw` uni **moslashuvchan** qiladi.

</details>

**M36.** ⭐⭐ Modelni saqlang va qayta yuklang.

<details>
<summary>✅ Yechim</summary>

```python
trainer.save_model("xlnet_emotions")
tokenizer.save_pretrained("xlnet_emotions")

m2 = XLNetForSequenceClassification.from_pretrained("xlnet_emotions")
t2 = XLNetTokenizer.from_pretrained("xlnet_emotions")
print("id2label saqlandimi:", m2.config.id2label)
```

## ⚠️ **TOKENIZATORNI HAM SAQLANG.** Faqat modelni saqlasangiz — keyin **noto'g'ri tokenizator** bilan yuklash xavfi bor *(32-modul, 6-dars)*.

</details>

**M37.** ⭐⭐ `pipeline` bilan bashorat qiling.

<details>
<summary>✅ Yechim</summary>

```python
clf = pipeline("text-classification", model="xlnet_emotions",
               tokenizer="xlnet_emotions")
for s in ["I am so happy today", "This makes me furious",
          "I am terrified of what comes next", "I miss them so much"]:
    r = clf(s, top_k=None)
    eng = max(r, key=lambda x: x["score"])
    print(f"{s[:34]:36s} → {eng['label']:9s} {eng['score']:.4f}")
```

</details>

**M38.** ⭐⭐ Ishonch chegarasini qo'shing.

<details>
<summary>✅ Yechim</summary>

```python
def hissiyot(matn, chegara=0.50):
    r = clf(matn, top_k=None)
    eng = max(r, key=lambda x: x["score"])
    if eng["score"] < chegara:
        return f"❓ noaniq ({eng['label']} {eng['score']:.3f})"
    return f"{eng['label']} ({eng['score']:.3f})"
```

## 🔑 **33-moduldagi bilan BIR XIL g'oya.** Past ishonch — **javob bermang**.

</details>

**M39.** ⭐⭐⭐ O'zbekcha hissiyot tasnifi.

<details>
<summary>✅ Yechim</summary>

```python
UZ = ["Bugun juda xursandman", "Bu meni g'azablantirdi",
      "Kelajakdan qo'rqaman", "Ularni juda sog'indim"]
for s in UZ:
    r = clf(s, top_k=None)
    eng = max(r, key=lambda x: x["score"])
    print(f"{s:34s} → {eng['label']:9s} {eng['score']:.4f}")
```

## ⚠️ **KUTILGAN NATIJA — ISHLAMAYDI.** `xlnet-base-cased` **faqat inglizcha** o'qitilgan, o'zbekcha so'zlar `<unk>` yoki ma'nosiz bo'laklarga bo'linadi.
>
> ✅ **YECHIM:** `xlm-roberta-base` ni **aynan shu oqim bilan** fine-tune qiling — u 100 tilda oldindan o'qitilgan. Kod **bir xil**, faqat model nomi o'zgaradi.

</details>

**M40.** ⭐⭐⭐ O'rganish egri chizig'ini chizing.

<details>
<summary>✅ Yechim</summary>

```python
import matplotlib.pyplot as plt

# har bir n uchun alohida o'qiting va natijalarni yig'ing
natijalar = {100: 0.18, 400: None, 1200: None}    # o'zingiz to'ldiring

n = [k for k, v in natijalar.items() if v is not None]
a = [natijalar[k] for k in n]
plt.plot(n, a, "o-", label="model")
plt.axhline(0.25, color="r", ls="--", label="bazaviy (tasodifiy)")
plt.xlabel("o'quv namunalari"); plt.ylabel("aniqlik"); plt.legend(); plt.grid(alpha=.3)
plt.show()
```

## 🏆 **EGRI CHIZIQ SIZGA IKKI NARSANI AYTADI:**
```
① Yassi bo'lsa   →  ko'proq MA'LUMOT foyda bermaydi, MODELNI o'zgartiring
② Ko'tarilsa     →  ⭐ ko'proq ma'lumot YIG'ING — bu eng arzon yaxshilanish
```

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
