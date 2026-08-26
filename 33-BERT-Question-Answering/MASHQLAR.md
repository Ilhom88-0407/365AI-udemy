# 📝 33-modul mashqlari

> **42 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **HAMMASI BEPUL** — API kaliti kerak emas.

## ⚙️ Tayyorgarlik

```bash
pip install transformers torch pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import torch, pandas as pd
from transformers import (BertForQuestionAnswering, BertTokenizer,
                          AutoTokenizer, AutoModel, pipeline)

M = "bert-large-uncased-whole-word-masking-finetuned-squad"
model = BertForQuestionAnswering.from_pretrained(M)
tok   = BertTokenizer.from_pretrained(M)

HUJJAT = (
    "The DVD (common abbreviation for Digital Video Disc or Digital "
    "Versatile Disc) is a digital optical disc data storage format. "
    "It was invented and developed in 1995 and first released on "
    "November 1, 1996 in Japan. The medium can store any kind of digital "
    "data and has been widely used to store video programs. The first DVD "
    "player and disc were released in the United States on March 24, 1997."
)

SUNSET = (
    "Sunset Motors is a family-owned car dealership that opened its doors in 1978. "
    "The dealership is located in Crestwood, on the outskirts of the city, and covers "
    "an area of ten acres. Sunset Motors sells a wide range of makes, including Ford, "
    "Toyota, Honda, Chevrolet and BMW. The showroom is open from Monday to Saturday, "
    "from 9 a.m. to 7 p.m., and closed on Sundays. The service centre employs 45 "
    "certified technicians and offers a free multi-point inspection with every service. "
    "Customers can finance their purchase through the in-house finance department, "
    "which offers terms of up to 72 months. Every used vehicle comes with a 12-month "
    "warranty and a 30-day exchange policy."
)
```

> ## 💡 **Yordamchi funksiya** — ko'p mashqlarda kerak bo'ladi:

```python
def javob_ber(savol, kontekst=SUNSET):
    ids = tok.encode(savol, kontekst)
    tkn = tok.convert_ids_to_tokens(ids)
    sep = ids.index(tok.sep_token_id); n_a = sep + 1
    seg = [0]*n_a + [1]*(len(ids) - n_a)
    with torch.no_grad():
        o = model(torch.tensor([ids]), token_type_ids=torch.tensor([seg]))
    sp = torch.softmax(o.start_logits, -1)[0]
    ep = torch.softmax(o.end_logits,   -1)[0]
    b, x = int(torch.argmax(o.start_logits)), int(torch.argmax(o.end_logits))
    return {"javob": tok.decode(ids[b:x+1]) if x >= b else None,
            "ishonch": float(sp[b]*ep[x]), "start": b, "end": x}
```

---

# 🟢 OSON *(1–14)*

**M1.** GPT va BERT — qaysi biri matn **yozadi**, qaysi biri **tushunadi**?

**M2.** BERT nima uchun qisqartma?

**M3.** MLM nima?

**M4.** NSP nima?

**M5.** `[CLS]` va `[SEP]` ID'lari nechchi?

**M6.** `bert-large` da nechta enkoder qatlami bor?

**M7.** BERT **generativ**mi?

<details>
<summary>✅ Javoblar M1–M7</summary>

**M1.** ## GPT — **yozadi** *(dekoder)*. BERT — **tushunadi** *(enkoder)*.

**M2.** ## **B**idirectional **E**ncoder **R**epresentations from **T**ransformers.

**M3.** **Masked Language Modeling** — jumladagi ~15% so'z `[MASK]` bilan yopiladi, model uni **tiklaydi**.

**M4.** **Next Sentence Prediction** — ikki jumla **ketma-ket**mi yoki **yo'q**mi.

**M5.** ## `[CLS]` = **101**, `[SEP]` = **102**.

**M6.** ## **24 ta** *(`bert-base` da 12 ta)*.

**M7.** ## **Yo'q.** U faqat mavjud matndan **kesma** oladi.

</details>

**M8.** `qa_outputs` qatlamining chiqishi nechta?

**M9.** `token_type_ids` da 0 va 1 nimani anglatadi?

**M10.** `argmax` nima qaytaradi?

**M11.** Nima uchun `end_index + 1`?

**M12.** `##wood` nimani bildiradi?

**M13.** RoBERTa qaysi vazifani olib tashlagan?

**M14.** DistilBERT necha qatlamli?

<details>
<summary>✅ Javoblar M8–M14</summary>

**M8.** ## **Ikkita** — `start_logit` va `end_logit`, har token uchun.

**M9.** ## `0` = **savol**, `1` = **kontekst**.

**M10.** **Eng yuqori** qiymatga ega elementning **indeksi** *(qiymatning o'zi emas)*.

**M11.** Python kesmasi **oxirgi elementni qo'shmaydi**. `+1` bo'lmasa javobning **oxirgi tokeni yo'qoladi**.

**M12.** WordPiece bo'lagi — **oldingi tokenga yopishadi**. `crest` + `##wood` = `crestwood`.

**M13.** ## **NSP** — chunki u foyda bermagani **o'lchab isbotlangan**.

**M14.** ## **6 ta**.

</details>

---

# 🟡 O'RTA *(15–32)*

**M15.** ⭐ Modelning parametrlari sonini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
print(f"{sum(p.numel() for p in model.parameters()):,}")
```

```
334,094,338
```

1-darsdagi *"340 million"* da'vosi **tasdiqlandi**.

</details>

**M16.** ⭐ `qa_outputs` qatlamida nechta parametr bor?

<details>
<summary>✅ Yechim</summary>

```python
qa = sum(p.numel() for p in model.qa_outputs.parameters())
jami = sum(p.numel() for p in model.parameters())
print(f"qa_outputs : {qa:,}")
print(f"ulush      : {qa/jami:.6%}")
```

```
qa_outputs : 2,050
ulush      : 0.000614%
```

## 💥 **1024×2 + 2 = 2050.** Butun QA qobiliyati — **0.0006%** parametrda. Qolgan hammasi — **til tushunchasi**.

</details>

**M17.** Tokenlar sonini va segment chegarasini toping.

<details>
<summary>✅ Yechim</summary>

```python
e = tok("When was the first DVD released?", HUJJAT)
print("jami    :", len(e["input_ids"]))
print("segment0:", e["token_type_ids"].count(0))
print("segment1:", e["token_type_ids"].count(1))
```

```
jami    : 88
segment0: 9
segment1: 79
```

</details>

**M18.** ⭐ TOP-5 start nomzodini chiqaring.

<details>
<summary>✅ Yechim</summary>

```python
import numpy as np
ids = tok.encode("When was the first DVD released?", HUJJAT)
tkn = tok.convert_ids_to_tokens(ids)
sep = ids.index(tok.sep_token_id); n_a = sep+1
seg = [0]*n_a + [1]*(len(ids)-n_a)
with torch.no_grad():
    o = model(torch.tensor([ids]), token_type_ids=torch.tensor([seg]))
b = o.start_logits[0].numpy()
for i in np.argsort(b)[::-1][:5]:
    print(f"{i:4d}  {tkn[i]:12s} {b[i]:6.2f}")
```

Kutilgan: `november` birinchi, `march` — beshinchi. **5-darsdagi jadval**.

</details>

**M19.** ⭐ `encode_plus` ni chaqirib ko'ring — nima bo'ladi?

<details>
<summary>✅ Yechim</summary>

```python
try:
    tok.encode_plus("a", "b")
except AttributeError as e:
    print("AttributeError:", e)
```

`transformers` 5.x da `encode_plus` **olib tashlangan**. To'g'ri usul — `tok("a", "b")`.

</details>

**M20.** Savol va kontekstni **teskari** tartibda bering. Natija o'zgaradimi?

<details>
<summary>✅ Yechim</summary>

```python
t = tok("When was the first DVD released?", HUJJAT)
r = tok(HUJJAT, "When was the first DVD released?")
print("to'g'ri :", tok.convert_ids_to_tokens(t["input_ids"])[:8])
print("teskari :", tok.convert_ids_to_tokens(r["input_ids"])[:8])
```

## ⚠️ **Tartib MUHIM.** SQuAD'da model **doim** `savol [SEP] kontekst` tartibida o'qitilgan. Teskarisi — **sifatni buzadi**.

</details>

**M21.** ⭐ Beshta savolni jadval qilib sinang.

<details>
<summary>✅ Yechim</summary>

```python
savollar = ["Where is the dealership located?",
            "What make of cars are available?",
            "How large is the dealership?",
            "When did Sunset Motors open?",
            "How many technicians work there?"]
print(pd.DataFrame([{"savol": s[:34], **javob_ber(s)} for s in savollar]).to_string(index=False))
```

Kutilgan: `crestwood`, markalar, `ten acres`, `1978`, `45` — **beshtasi ham to'g'ri**.

</details>

**M22.** ⭐⭐ Kontekstda **yo'q** savol bering va ishonchni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
print(javob_ber("What is the capital of France?"))
```

```
{'javob': 'what', 'ishonch': 0.1143, 'start': 1, 'end': 1}
```

## 💥 Model savolning **o'z so'zini** qaytardi. Ishonch **0.11** — bu **signal**.

</details>

**M23.** `end < start` holatini toping.

<details>
<summary>✅ Yechim</summary>

```python
print(javob_ber("Do you sell electric cars?"))
```

```
{'javob': None, 'ishonch': 0.1842, 'start': 49, 'end': 9}
```

`start=49`, `end=9` — **zid**. Kursdagi `if` aynan shuni ushlaydi.

</details>

**M24.** ⭐ Ishonch chegarasi qo'shilgan botni yozing.

<details>
<summary>✅ Yechim</summary>

```python
def bot(savol, chegara=0.30):
    r = javob_ber(savol)
    if r["javob"] is None:  return "❓ start/end zid"
    if r["ishonch"] < chegara: return f"❓ bilmayman ({r['ishonch']:.3f})"
    return r["javob"]

for s in ["When did Sunset Motors open?", "What is the capital of France?"]:
    print(f"{s:36s} → {bot(s)}")
```

</details>

**M25.** ⭐ `##` ni **qo'lda** va `decode()` bilan tozalab solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
ids = tok.encode("Where is the dealership located?", SUNSET)
tkn = tok.convert_ids_to_tokens(ids)
b, x = 32, 33
q = ""
for s in " ".join(tkn[b:x+1]).split():
    q += s[2:] if s[:2] == "##" else " " + s
print("qo'lda :", repr(q.strip()), " decode:", repr(tok.decode(ids[b:x+1])))
```

```
qo'lda : 'crestwood'  decode: 'crestwood'
```

</details>

**M26.** Uchala modelning parametr va qatlam sonini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
for n in ["bert-base-uncased", "roberta-base", "distilbert-base-uncased"]:
    m = AutoModel.from_pretrained(n)
    print(f"{n:26s} {sum(p.numel() for p in m.parameters()):>12,}")
```

```
bert-base-uncased          109,482,240
roberta-base               124,645,632
distilbert-base-uncased     66,362,880
```

</details>

**M27.** ⭐ Uchala tokenizatorni bir jumlada solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
s = "Machine learning is unbelievably powerful."
for n in ["bert-base-uncased", "roberta-base", "distilbert-base-uncased"]:
    print(f"{n:26s} {AutoTokenizer.from_pretrained(n).tokenize(s)}")
```

RoBERTa `unbelievably` ni **butun** saqlaydi *(50k lug'at)*, BERT esa **5 bo'lakka** ajratadi.

</details>

**M28.** ⭐⭐ RoBERTa tokenizatorining kalitlarini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
print(list(AutoTokenizer.from_pretrained("roberta-base")("a", "b").keys()))
print(list(AutoTokenizer.from_pretrained("distilbert-base-uncased")("a", "b").keys()))
```

```
['input_ids', 'attention_mask']
['input_ids', 'token_type_ids', 'attention_mask']
```

## 💥 RoBERTa `token_type_ids` **bermaydi**. DistilBERT **beradi**, lekin modeli uni **jim tashlab yuboradi**.

</details>

**M29.** Uchala modelning inferens tezligini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
import time
torch.set_num_threads(4)
s = "Machine learning is unbelievably powerful and it changes everything we do."
for n in ["bert-base-uncased", "roberta-base", "distilbert-base-uncased"]:
    t = AutoTokenizer.from_pretrained(n); m = AutoModel.from_pretrained(n); m.eval()
    e = t(s, return_tensors="pt")
    with torch.no_grad():
        for _ in range(3): m(**e)
        t0 = time.perf_counter()
        for _ in range(30): m(**e)
    print(f"{n:26s} {(time.perf_counter()-t0)/30*1000:7.2f} ms")
```

Bizda: **115.6 · 63.2 · 34.8 ms** → DistilBERT **69.9% tezroq**.

</details>

**M30.** ⭐ `pipeline("question-answering")` bilan bir xil natijani oling.

<details>
<summary>✅ Yechim</summary>

```python
qa = pipeline("question-answering", model=M)
print(qa(question="Where is the dealership located?", context=SUNSET))
```

`pipeline` `##` ni **o'zi** tozalaydi va `start`/`end` ni **belgi** o'rnida qaytaradi *(token emas)*.

</details>

**M31.** Uzun kontekstda nima bo'ladi?

<details>
<summary>✅ Yechim</summary>

```python
uzun = SUNSET * 5
ids = tok.encode("Where is the dealership located?", uzun)
print("tokenlar:", len(ids), " limit:", tok.model_max_length)
```

## ⚠️ **512 dan oshsa model XATO beradi.** Yechim — `truncation=True` yoki matnni **bo'laklash** *(48–51-modul)*.

</details>

**M32.** ⭐ `attention_mask` qachon kerak?

<details>
<summary>✅ Yechim</summary>

```python
e = tok(["Q1?", "A much longer question here?"], [SUNSET, SUNSET],
        padding=True, truncation=True, return_tensors="pt")
print(e["attention_mask"][0][:20])
```

**To'ldirish** *(padding)* bo'lganda `attention_mask` **shart** — aks holda model `[PAD]` tokenlariga e'tibor beradi.

</details>

---

# 🔴 QIYIN *(33–42)*

**M33.** ⭐⭐ Ikkita modelni bir savolda solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
for m in [M, "distilbert-base-cased-distilled-squad"]:
    qa = pipeline("question-answering", model=m)
    r = qa(question="When was the first DVD released?", context=HUJJAT)
    print(f"{m[:42]:44s} {r['answer']:22s} {r['score']:.4f}")
```

Bizda **ikkalasi ham** `November 1, 1996` — kursning `March 24, 1997` javobiga **zid**. Sabab: savol **noaniq** *(5-dars)*.

</details>

**M34.** ⭐⭐ Savolni **aniqlashtiring** va javob o'zgarishini kuzating.

<details>
<summary>✅ Yechim</summary>

```python
for s in ["When was the first DVD released?",
          "When was the first DVD player released in the United States?",
          "When was the DVD format first released in Japan?"]:
    r = javob_ber(s, HUJJAT)
    print(f"{s[:56]:58s} {str(r['javob'])[:20]:22s} {r['ishonch']:.4f}")
```

## 🔑 **SABOQ:** savolni aniqlashtirish — modelni almashtirishdan **arzonroq** va ko'pincha **samaraliroq**.

</details>

**M35.** ⭐⭐ Bir nechta kontekstdan **eng mos**ini tanlovchi bot.

<details>
<summary>✅ Yechim</summary>

```python
BAZA = {"sotuv": SUNSET,
        "servis": ("The Sunset Motors service centre is open 24 hours a day. "
                   "An oil change costs 45 dollars and takes 30 minutes.")}

def kop_bot(savol, chegara=0.30):
    n = [(javob_ber(savol, k)["ishonch"], nom, javob_ber(savol, k)["javob"])
         for nom, k in BAZA.items()]
    n = [x for x in n if x[2] is not None]
    if not n: return "❓ yo'q"
    i, nom, j = max(n)
    return f"[{nom}] {j} ({i:.3f})" if i >= chegara else "❓ yo'q"

print(kop_bot("How much is an oil change?"))
```

⚠️ **Miqyoslanmaydi** — 100 hujjatda 100 marta model chaqiriladi. Yechim: **vektor bazasi** *(48–51-modul)*.

</details>

**M36.** ⭐⭐ Ishonch chegarasini **o'lchab** tanlang.

<details>
<summary>✅ Yechim</summary>

```python
TEST = [("When did Sunset Motors open?", True),
        ("Where is the dealership located?", True),
        ("How large is the dealership?", True),
        ("What is the capital of France?", False),
        ("Who won the World Cup in 2018?", False),
        ("Do you sell electric cars?", False)]

for ch in [0.10, 0.20, 0.30, 0.50, 0.70]:
    tp = sum(1 for s, y in TEST if y and (javob_ber(s)["javob"] and javob_ber(s)["ishonch"] >= ch))
    fp = sum(1 for s, y in TEST if not y and (javob_ber(s)["javob"] and javob_ber(s)["ishonch"] >= ch))
    print(f"chegara {ch:.2f}  to'g'ri qabul: {tp}/3   noto'g'ri qabul: {fp}/3")
```

## 🔑 **Chegara — GIPERPARAMETR.** Uni **o'lchab** tanlang, ko'chirib **olmang**.

</details>

**M37.** ⭐⭐ Uzun hujjatni **oynalarga** bo'lib qidiring.

<details>
<summary>✅ Yechim</summary>

```python
def oynali_javob(savol, matn, oyna=350, qadam=250):
    eng = None
    for i in range(0, max(1, len(matn)-oyna+qadam), qadam):
        r = javob_ber(savol, matn[i:i+oyna])
        if r["javob"] and (eng is None or r["ishonch"] > eng["ishonch"]):
            eng = r
    return eng

print(oynali_javob("How many technicians work there?", SUNSET * 3))
```

## 🔑 **Sliding window** — 512 token cheklovini aylanib o'tishning **standart** usuli. `pipeline` da bu `doc_stride` parametri.

</details>

**M38.** ⭐⭐ QA botini **baholash** funksiyasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
OLTIN = [("When did Sunset Motors open?", "1978"),
         ("Where is the dealership located?", "crestwood"),
         ("How large is the dealership?", "ten acres"),
         ("How many technicians work there?", "45")]

def baholash(chegara=0.30):
    tog = 0
    for s, kutilgan in OLTIN:
        r = javob_ber(s)
        olingan = (r["javob"] or "").lower().strip()
        ok = kutilgan.lower() in olingan and r["ishonch"] >= chegara
        tog += ok
        print(f"{'✅' if ok else '❌'} {s[:34]:36s} {olingan[:20]:22s} {r['ishonch']:.3f}")
    print(f"\nANIQLIK: {tog}/{len(OLTIN)} = {tog/len(OLTIN):.0%}")

baholash()
```

## 🔑 **"Oltin to'plam" (gold set) — har QA loyihasining BIRINCHI qadami.** Usiz siz yaxshilanayotganingizni **bila olmaysiz**.

</details>

**M39.** ⭐⭐ Javobning **manba pozitsiyasini** matnda ko'rsating.

<details>
<summary>✅ Yechim</summary>

```python
qa = pipeline("question-answering", model=M)
r = qa(question="Where is the dealership located?", context=SUNSET)
b, x = r["start"], r["end"]
print(SUNSET[:b] + " ⟪" + SUNSET[b:x] + "⟫ " + SUNSET[x:x+60] + " ...")
```

## 💡 **`pipeline` `start`/`end` ni BELGI indeksida beradi** — bu **iqtibos keltirish** uchun **zarur**. Qo'lda yozgan kodimiz esa **token** indeksini beradi.

</details>

**M40.** ⭐⭐ O'zbekcha QA'ni ko'p tilli modelda sinang.

<details>
<summary>✅ Yechim</summary>

```python
uz = pipeline("question-answering", model="deepset/xlm-roberta-base-squad2")
k = ("Sunset Motors — 1978-yilda ochilgan oilaviy avtosalon. "
     "Salon Crestwood shahrida joylashgan va o'n akr maydonni egallaydi.")
for s in ["Salon qachon ochilgan?", "Salon qayerda joylashgan?"]:
    print(s, "→", uz(question=s, context=k))
```

⚠️ **Realistik kutish:** sana va atoqli otda ishlaydi, murakkab savolda **xato qiladi**. Gibrid yondashuv — 6-dars, 9-bo'lim.

</details>

**M41.** ⭐⭐ DistilBERT'ga `token_type_ids` uzatib, natija o'zgarishini tekshiring.

<details>
<summary>✅ Yechim</summary>

```python
from transformers import DistilBertModel
t = AutoTokenizer.from_pretrained("distilbert-base-uncased")
m = DistilBertModel.from_pretrained("distilbert-base-uncased"); m.eval()
e = t("hello world", return_tensors="pt")
with torch.no_grad():
    a = m(**e).last_hidden_state
    e2 = {k: v for k, v in e.items() if k != "token_type_ids"}
    b = m(**e2).last_hidden_state
print("bir xilmi:", torch.allclose(a, b))
```

```
bir xilmi: True
```

## 💥 **Bir xil — chunki DistilBERT `token_type_ids` ni UMUMAN ISHLATMAYDI.** Xato ham, ogohlantirish ham yo'q. Bu — **jim xato**.

</details>

**M42.** ⭐⭐⭐ To'liq **QA xizmati** sinfini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class QAXizmat:
    def __init__(self, model_nomi=M, chegara=0.30):
        self.qa = pipeline("question-answering", model=model_nomi)
        self.chegara = chegara
        self.baza, self.log = {}, []

    def hujjat_qosh(self, nom, matn):
        self.baza[nom] = matn
        return self

    def sora(self, savol):
        n = []
        for nom, m in self.baza.items():
            try:
                r = self.qa(question=savol, context=m)
                n.append((r["score"], nom, r))
            except Exception:
                pass
        if not n:
            javob = {"ok": False, "sabab": "hujjat yo'q"}
        else:
            s, nom, r = max(n, key=lambda z: z[0])
            javob = ({"ok": True, "javob": r["answer"], "manba": nom,
                      "ishonch": round(s, 4), "iqtibos": self.baza[nom][r["start"]:r["end"]]}
                     if s >= self.chegara else
                     {"ok": False, "sabab": f"past ishonch {s:.3f}"})
        self.log.append({"savol": savol, **javob})
        return javob

    def hisobot(self):
        d = pd.DataFrame(self.log)
        print(d.to_string(index=False))
        print(f"\njavob berilgan: {d.ok.sum()}/{len(d)} ({d.ok.mean():.0%})")

x = (QAXizmat()
     .hujjat_qosh("sotuv", SUNSET)
     .hujjat_qosh("dvd", HUJJAT))
for s in ["Where is the dealership located?", "When was the DVD invented?",
          "What is the capital of France?"]:
    x.sora(s)
x.hisobot()
```

## 🏆 **Bu sinfda ishlab chiqarish uchun kerakli HAMMA narsa bor:** ko'p hujjat, ishonch chegarasi, **iqtibos**, jurnal va **hisobot**.

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
