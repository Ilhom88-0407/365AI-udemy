# 🚀 34-modul mini-loyihalari

> **6 ta tayyor loyiha.** Hammasi **BEPUL** — API kaliti kerak emas.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install transformers torch pandas numpy scikit-learn matplotlib
pip install datasets evaluate clean-text sentencepiece accelerate
```

```python
import warnings; warnings.filterwarnings("ignore")
import re, json, time, numpy as np, pandas as pd
import torch, datasets, evaluate
from pathlib import Path
from cleantext import clean as cleaner
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import confusion_matrix, classification_report
from transformers import (AutoTokenizer, AutoModelForSequenceClassification,
                          TrainingArguments, Trainer, pipeline)
```

---

# 🧹 1-loyiha. Tozalash tadqiqotchisi

> **Maqsad:** tozalash qadamlarining **haqiqiy ta'sirini** o'lchash — taxmin qilmaslik.

```python
class TozalashTadqiqotchi:
    """Har bir tozalash qadami MATNGA nima qilishini ochib beradi."""

    QADAMLAR = {
        "asl":          lambda t: t,
        "no_emoji":     lambda t: cleaner(t, no_emoji=True),
        "no_emoji_cased": lambda t: cleaner(t, no_emoji=True, lower=False),
        "tinishsiz":    lambda t: re.sub(r"[^\w\s]", "", t),
        "to_liq":       lambda t: re.sub(r"[^\w\s]", "", cleaner(t, no_emoji=True)),
        "yumshoq":      lambda t: re.sub(r"[^\w\s!?']", "",
                                         cleaner(t, no_emoji=True, lower=False)),
    }

    def __init__(self, matnlar):
        self.matnlar = list(matnlar)

    def namuna(self, i=0):
        t = self.matnlar[i]
        for nom, f in self.QADAMLAR.items():
            print(f"{nom:16s} {f(t)[:72]!r}")

    def statistika(self, n=1000):
        qator = []
        for nom, f in self.QADAMLAR.items():
            x = [f(t) for t in self.matnlar[:n]]
            qator.append({
                "qadam": nom,
                "o'rt_uzunlik": round(np.mean([len(s) for s in x]), 1),
                "o'rt_so'z":    round(np.mean([len(s.split()) for s in x]), 1),
                "katta_harf_%": round(100 * np.mean(
                    [sum(c.isupper() for c in s) / max(1, len(s)) for s in x]), 2),
                "'!'_bor_%":    round(100 * np.mean(["!" in s for s in x]), 1),
                "noyob_so'z":   len({w for s in x for w in s.split()}),
            })
        return pd.DataFrame(qator)
```

**Ishlatish:**

```python
data = pd.concat([pd.read_csv(f"emotions_data/emotion-labels-{s}.csv")
                  for s in ["train", "test", "val"]], ignore_index=True)

t = TozalashTadqiqotchi(data.text)
t.namuna(0)
print()
print(t.statistika().to_string(index=False))
```

> ## 🔑 **`katta_harf_%` USTUNIGA QARANG.**
> ```
> asl              →  katta harf BOR
> no_emoji         →  0.00   💥 cleaner HAMMASINI kichik qildi
> no_emoji_cased   →  saqlandi   ✅
> ```
>
> ## 💥 **HISSIYOT vazifasida `AMAZING!!` ≠ `amazing`.** Biz `xlnet-base-**cased**` ishlatamiz — ya'ni model katta harfni **tushunadi**, lekin biz uni **o'chirib** tashladik.
>
> ## ⚠️ **`'!'_bor_%` USTUNI HAM MUHIM** — `re.sub(r"[^\w\s]", "")` undov belgisini **butunlay** yo'q qiladi. `yumshoq` varianti `!`, `?` va apostrofni **saqlaydi**.

---

# 📊 2-loyiha. O'rganish egri chizig'i

> **Maqsad:** *"Ko'proq ma'lumot yig'ish foydalimi?"* degan savolga **raqam bilan** javob berish.

```python
class OrganishEgrisi:
    """Turli namuna hajmlarida fine-tune qilib, aniqlikni kuzatadi."""

    def __init__(self, tds, model_nomi, id2label, maxlen=64):
        self.tds, self.model_nomi = tds, model_nomi
        self.id2label = id2label
        self.label2id = {v: k for k, v in id2label.items()}
        self.tok = AutoTokenizer.from_pretrained(model_nomi)
        self.maxlen = maxlen
        self.acc = evaluate.load("accuracy")
        self.f1  = evaluate.load("f1")
        self.natijalar = []

    def _metrics(self, ep):
        logits, labels = ep
        p = np.argmax(logits, axis=-1)
        return {**self.acc.compute(predictions=p, references=labels),
                **self.f1.compute(predictions=p, references=labels, average="macro")}

    def bir_nuqta(self, n_train, n_eval=400, epochs=3, lr=2e-5, bs=8):
        tr = self.tds["train"].shuffle(seed=42).select(range(n_train))
        ev = self.tds["test"].shuffle(seed=42).select(range(n_eval))
        model = AutoModelForSequenceClassification.from_pretrained(
            self.model_nomi, num_labels=len(self.id2label),
            id2label=self.id2label, label2id=self.label2id)
        args = TrainingArguments(
            output_dir=f"egri_{n_train}", eval_strategy="epoch",
            num_train_epochs=epochs, per_device_train_batch_size=bs,
            per_device_eval_batch_size=bs, learning_rate=lr,
            save_strategy="no", report_to=[], disable_tqdm=True)
        tr_obj = Trainer(model=model, args=args, train_dataset=tr, eval_dataset=ev,
                         compute_metrics=self._metrics, processing_class=self.tok)
        t0 = time.perf_counter()
        tr_obj.train()
        m = tr_obj.evaluate()
        r = {"n_train": n_train, "aniqlik": round(m["eval_accuracy"], 4),
             "f1": round(m["eval_f1"], 4), "loss": round(m["eval_loss"], 4),
             "daqiqa": round((time.perf_counter() - t0) / 60, 1)}
        self.natijalar.append(r)
        print(r, flush=True)
        return r, tr_obj

    def chiz(self, n_sinf=4):
        import matplotlib.pyplot as plt
        d = pd.DataFrame(self.natijalar).sort_values("n_train")
        plt.figure(figsize=(8, 4.5))
        plt.plot(d.n_train, d.aniqlik, "o-", label="aniqlik")
        plt.plot(d.n_train, d.f1, "s--", label="macro F1")
        plt.axhline(1 / n_sinf, color="r", ls=":", label=f"bazaviy {1/n_sinf:.0%}")
        plt.xlabel("o'quv namunalari"); plt.ylabel("ball")
        plt.legend(); plt.grid(alpha=.3); plt.tight_layout(); plt.show()
        return d
```

**Ishlatish:**

```python
e = OrganishEgrisi(tds, "xlnet-base-cased",
                   {0: "anger", 1: "fear", 2: "joy", 3: "sadness"})
for n in [100, 400, 1200]:
    e.bir_nuqta(n)
print(e.chiz().to_string(index=False))
```

> ## 🏆 **EGRI CHIZIQ IKKI SAVOLGA JAVOB BERADI:**
> ```
> ① Yassilanib qoldimi?  →  ko'proq MA'LUMOT foyda bermaydi
>                            MODELNI yoki VAZIFANI o'zgartiring
> ② Hali ko'tarilyaptimi? →  ⭐ MA'LUMOT YIG'ING
>                            bu — eng ARZON yaxshilanish
> ```
>
> ## ⚠️ **BAZAVIY CHIZIQ (qizil) — ENG MUHIM ELEMENT.** Usiz `0.42` aniqlik *"yomon emas"* ko'rinadi. U bilan esa siz **1.7× bazaviydan yaxshi** deb aniq aytasiz.
>
> ## 💥 **Bizning o'lchovimizda `n=100` nuqtasi qizil chiziqdan PASTDA** — kursning aynan shu sozlamasi.

---

# 🔬 3-loyiha. Xatolar tahlilchisi

> **Maqsad:** *"Model qayerda va NIMA UCHUN xato qiladi?"*

```python
class XatoTahlil:
    """Chalkashlik matritsasi + eng yomon xatolarni ochib berish."""

    def __init__(self, trainer, eval_ds, id2label, matnlar=None):
        self.id2label = id2label
        self.nomlar = [id2label[i] for i in range(len(id2label))]
        p = trainer.predict(eval_ds)
        self.logits = p.predictions
        self.y = p.label_ids
        self.p = np.argmax(self.logits, axis=-1)
        e = np.exp(self.logits - self.logits.max(-1, keepdims=True))
        self.prob = e / e.sum(-1, keepdims=True)
        self.matnlar = matnlar if matnlar is not None else eval_ds["text"]

    def matritsa(self):
        cm = confusion_matrix(self.y, self.p)
        d = pd.DataFrame(cm, index=self.nomlar, columns=self.nomlar)
        d["JAMI"] = d.sum(1)
        d["to'g'ri_%"] = (np.diag(cm) / cm.sum(1) * 100).round(1)
        print(d.to_string())
        return d

    def hisobot(self):
        print(classification_report(self.y, self.p, target_names=self.nomlar,
                                    digits=3, zero_division=0))

    def eng_yomon_juftlik(self, top=3):
        cm = confusion_matrix(self.y, self.p)
        np.fill_diagonal(cm, 0)
        juft = [(cm[i, j], self.nomlar[i], self.nomlar[j])
                for i in range(len(cm)) for j in range(len(cm)) if cm[i, j]]
        for n, haq, bash in sorted(juft, reverse=True)[:top]:
            print(f"{n:4d} marta:  {haq:9s} → {bash:9s} deb xato qilindi")

    def ishonchli_xatolar(self, top=5):
        """Model ISHONCH bilan XATO qilgan holatlar — eng qimmatli signal."""
        xato = np.where(self.y != self.p)[0]
        ball = self.prob[xato, self.p[xato]]
        for i in xato[np.argsort(-ball)][:top]:
            print(f"  ishonch {self.prob[i, self.p[i]]:.3f}  "
                  f"HAQIQIY={self.nomlar[self.y[i]]:8s} "
                  f"BASHORAT={self.nomlar[self.p[i]]:8s}")
            print(f"     {self.matnlar[int(i)][:88]}")

    def ikkilanish(self, top=5):
        """1- va 2-nomzod ballari YAQIN bo'lgan holatlar."""
        s = np.sort(self.prob, axis=1)
        farq = s[:, -1] - s[:, -2]
        for i in np.argsort(farq)[:top]:
            j = np.argsort(-self.prob[i])[:2]
            print(f"  farq {farq[i]:.3f}  {self.nomlar[j[0]]} {self.prob[i,j[0]]:.3f}"
                  f"  vs  {self.nomlar[j[1]]} {self.prob[i,j[1]]:.3f}")
            print(f"     {self.matnlar[int(i)][:88]}")
```

**Ishlatish:**

```python
x = XatoTahlil(trainer, eval_ds, {0: "anger", 1: "fear", 2: "joy", 3: "sadness"})
print("=== CHALKASHLIK MATRITSASI ===");   x.matritsa()
print("\n=== SINF BO'YICHA ===");           x.hisobot()
print("\n=== ENG YOMON JUFTLIKLAR ===");    x.eng_yomon_juftlik()
print("\n=== ISHONCHLI XATOLAR ===");       x.ishonchli_xatolar()
print("\n=== MODEL IKKILANGAN ===");        x.ikkilanish()
```

> ## 🏆 **`ishonchli_xatolar` — LOYIHANING ENG QIMMATLI QISMI.**
>
> ```
> Ishonchsiz xato (0.30)  →  model IKKILANDI, tushunarli
> Ishonchli xato (0.95)   →  ⚠️ jiddiy muammo:
>                             ① YORLIQ noto'g'ri qo'yilgan bo'lishi mumkin
>                             ② model yashirin QISQA YO'L o'rgangan
> ```
>
> ## 💡 **Amaliyotda ishonchli xatolarni O'QIB CHIQING.** Ko'pincha ular **ma'lumotdagi xatoni** fosh qiladi, modeldagini emas.
>
> ## 🔑 **`eng_yomon_juftlik`** sizga qaysi ikki hissiyot **chalkashayotganini** aytadi — masalan `fear` ↔ `sadness`. Bu **kutilgan**, chunki ular **semantik yaqin**.

---

# ⚖️ 4-loyiha. Model tanlash stendi

> **Maqsad:** **bir xil ma'lumotda** bir nechta modelni **halol** solishtirish.

```python
NOMZODLAR = {
    "XLNet":      "xlnet-base-cased",
    "BERT":       "bert-base-cased",
    "DistilBERT": "distilbert-base-cased",
    "RoBERTa":    "roberta-base",
}

class ModelStend:
    """Bir xil ma'lumot, bir xil giperparametr — faqat MODEL o'zgaradi."""

    def __init__(self, dd, id2label, n_train=600, n_eval=300, maxlen=64, epochs=2):
        self.dd, self.id2label = dd, id2label
        self.label2id = {v: k for k, v in id2label.items()}
        self.n_train, self.n_eval = n_train, n_eval
        self.maxlen, self.epochs = maxlen, epochs
        self.acc, self.f1 = evaluate.load("accuracy"), evaluate.load("f1")
        self.natijalar = []

    def _metrics(self, ep):
        logits, labels = ep
        p = np.argmax(logits, axis=-1)
        return {**self.acc.compute(predictions=p, references=labels),
                **self.f1.compute(predictions=p, references=labels, average="macro")}

    def sinov(self, nom, model_nomi):
        try:
            tok = AutoTokenizer.from_pretrained(model_nomi)
            d = self.dd.map(lambda e: tok(e["text"], padding="max_length",
                                          max_length=self.maxlen, truncation=True),
                            batched=True)
            tr = d["train"].shuffle(seed=42).select(range(self.n_train))
            ev = d["test"].shuffle(seed=42).select(range(self.n_eval))
            model = AutoModelForSequenceClassification.from_pretrained(
                model_nomi, num_labels=len(self.id2label),
                id2label=self.id2label, label2id=self.label2id)
            args = TrainingArguments(
                output_dir=f"stend_{nom}", eval_strategy="no",
                num_train_epochs=self.epochs, per_device_train_batch_size=8,
                per_device_eval_batch_size=8, learning_rate=2e-5,
                save_strategy="no", report_to=[], disable_tqdm=True)
            t = Trainer(model=model, args=args, train_dataset=tr, eval_dataset=ev,
                        compute_metrics=self._metrics, processing_class=tok)
            t0 = time.perf_counter(); t.train(); daq = (time.perf_counter()-t0)/60
            m = t.evaluate()
            r = {"model": nom, "parametr_M": round(sum(p.numel() for p in
                                                       model.parameters())/1e6, 1),
                 "aniqlik": round(m["eval_accuracy"], 4),
                 "f1": round(m["eval_f1"], 4), "daqiqa": round(daq, 1)}
        except Exception as e:
            r = {"model": nom, "xato": f"{type(e).__name__}: {e}"[:60]}
        self.natijalar.append(r); print(r, flush=True)
        return r

    def hammasi(self, nomzodlar=NOMZODLAR):
        for nom, m in nomzodlar.items():
            self.sinov(nom, m)
        d = pd.DataFrame(self.natijalar)
        if "aniqlik" in d:
            d = d.sort_values("aniqlik", ascending=False)
            d["ball/daqiqa"] = (d.aniqlik / d.daqiqa).round(3)
        print("\n" + d.to_string(index=False))
        return d
```

**Ishlatish:**

```python
s = ModelStend(dataset_dict, {0: "anger", 1: "fear", 2: "joy", 3: "sadness"})
s.hammasi()
```

> ## ⚠️ **HALOL TAQQOSLASHNING UCHTA SHARTI:**
> ```
> ① BIR XIL ma'lumot va BIR XIL bo'linish  (shuffle(seed=42))
> ② BIR XIL giperparametr (lr, epochs, batch)
> ③ BIR XIL max_length
> ```
> Bulardan biri o'zgarsa — taqqoslash **ma'nosiz** bo'ladi.
>
> ## 💡 **`ball/daqiqa` USTUNI — AMALIY TANLOV.** Eng yuqori aniqlik har doim ham **to'g'ri tanlov emas**: DistilBERT 2% pastroq bo'lsa-yu, **3× tez** o'qitilsa — prototip uchun **u afzal**.
>
> ## 🇺🇿 **O'zbekcha uchun `xlm-roberta-base` ni ro'yxatga qo'shing** — u **100 tilda** oldindan o'qitilgan.

---

# 🎯 5-loyiha. Ishlab chiqarish uchun tasniflagich

> **Maqsad:** saqlash, yuklash, **ishonch chegarasi** va **jurnal** bilan to'liq xizmat.

```python
class HissiyotXizmat:
    """Fine-tune qilingan modelni ISHONCHLI ishlatish."""

    def __init__(self, model_yoli, chegara=0.50, ikkilanish_farqi=0.15):
        self.clf = pipeline("text-classification", model=model_yoli,
                            tokenizer=model_yoli, top_k=None)
        self.chegara = chegara
        self.farq = ikkilanish_farqi
        self.jurnal = []

    def _tozala(self, matn):
        """⚠️ O'QITISHDAGI BILAN AYNAN BIR XIL bo'lishi SHART."""
        return re.sub(r"[^\w\s]", "", cleaner(matn, no_emoji=True))

    def bashorat(self, matn):
        t = self._tozala(matn)
        if not t.strip():
            r = {"ok": False, "sabab": "bo'sh matn"}
        else:
            b = sorted(self.clf(t)[0], key=lambda x: -x["score"])
            eng, ikki = b[0], b[1]
            farq = eng["score"] - ikki["score"]
            if eng["score"] < self.chegara:
                r = {"ok": False, "sabab": f"past ishonch {eng['score']:.3f}",
                     "eng_yaqin": eng["label"]}
            elif farq < self.farq:
                r = {"ok": False, "sabab": f"ikkilanish {eng['label']}/{ikki['label']}"
                                           f" farq={farq:.3f}"}
            else:
                r = {"ok": True, "hissiyot": eng["label"],
                     "ishonch": round(eng["score"], 4),
                     "farq": round(farq, 4),
                     "hammasi": {x["label"]: round(x["score"], 3) for x in b}}
        self.jurnal.append({"matn": matn[:44], **r})
        return r

    def paket(self, matnlar):
        return [self.bashorat(m) for m in matnlar]

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        ok = int(d["ok"].sum())
        print(f"jami {len(d)}   javob berilgan {ok} ({ok/len(d):.0%})")
        print(d.to_string(index=False))
        if ok:
            print("\nhissiyot taqsimoti:")
            print(d[d.ok]["hissiyot"].value_counts().to_string())
```

**Ishlatish:**

```python
x = HissiyotXizmat("xlnet_emotions", chegara=0.50)
x.paket([
    "I am so happy today, everything went perfectly",
    "This makes me absolutely furious",
    "I am terrified of what comes next",
    "I miss them so much it hurts",
    "The train leaves at 7pm",              # ← neytral, hissiyot YO'Q
    "",                                     # ← bo'sh
])
x.hisobot()
```

> ## ⚠️⚠️ **`_tozala` METODI — ENG KO'P UNUTILADIGAN QISM.**
>
> ```
> O'QITISHDA:  cleaner + re.sub qo'llanilgan
> ISHLATISHDA: agar QO'LLANILMASA  →  model BOSHQA TAQSIMOTNI ko'radi
>
> 💥 Natija: aniqlik SEZILARLI tushadi, sabab esa TOPILMAYDI
> ```
>
> ## 🔑 **QOIDA:** tozalash kodi **bitta funksiyada** bo'lsin va **ikkala joyda** ham **o'sha** funksiya chaqirilsin.
>
> ## 💡 **`ikkilanish` tekshiruvi — chegaradan ham nozikroq.** `joy 0.52` va `anger 0.48` — ishonch chegaradan **yuqori**, lekin model aslida **tanga tashlayapti**.
>
> ## ⚠️ **NEYTRAL MATN MUAMMOSI:** *"The train leaves at 7pm"* — bu **hech qanday** hissiyot emas. Lekin model **4 ta** sinfdan **birini** tanlashga **majbur**. Chegara buni **ushlaydi**.

---

# 🇺🇿 6-loyiha. O'zbekcha hissiyot tasniflagichi

> **Maqsad:** aynan shu **oqim** bilan **o'zbekcha** model yaratish.

```python
class OzbekHissiyot:
    """xlm-roberta bilan o'zbekcha tasnif — TO'LIQ oqim."""

    # ⚠️ DEMO to'plami. Haqiqiy loyihada KAMIDA 200 misol/sinf kerak.
    NAMUNA = [
        ("Bugun juda xursandman, hammasi ajoyib o'tdi",        "joy"),
        ("Nihoyat orzuimga erishdim, baxtliman",               "joy"),
        ("Do'stlarim bilan uchrashuv zo'r bo'ldi",             "joy"),
        ("Bu meni juda g'azablantirdi, chidab bo'lmaydi",      "anger"),
        ("Yana aldashdi, jahlim chiqdi",                       "anger"),
        ("Bunday munosabatga toqatim yo'q",                    "anger"),
        ("Kelajakdan qo'rqaman, nima bo'lishini bilmayman",    "fear"),
        ("Imtihondan juda hadiksirayapman",                    "fear"),
        ("Tunda yolg'iz qolishdan qo'rqaman",                  "fear"),
        ("Ularni juda sog'indim, yuragim ezildi",              "sadness"),
        ("Bu yo'qotishdan keyin o'zimga kelolmayapman",        "sadness"),
        ("Kayfiyatim yo'q, hech narsa qilgim kelmayapti",      "sadness"),
    ]

    MODEL = "xlm-roberta-base"      # ⭐ 100 tilda oldindan o'qitilgan

    def __init__(self, namunalar=None, model_nomi=None):
        self.model_nomi = model_nomi or self.MODEL
        d = pd.DataFrame(namunalar or self.NAMUNA, columns=["text", "label"])
        self.le = LabelEncoder()
        d["y"] = self.le.fit_transform(d["label"])
        self.id2label = {i: c for i, c in enumerate(self.le.classes_)}
        self.label2id = {v: k for k, v in self.id2label.items()}
        self.d = d
        self.tok = AutoTokenizer.from_pretrained(self.model_nomi)

    def tokenlar_tekshir(self):
        """O'zbekcha so'zlar qanday bo'linayotganini KO'RING."""
        for s in ["xursandman", "g'azablantirdi", "qo'rqaman", "sog'indim"]:
            print(f"{s:18s} → {self.tok.tokenize(s)}")

    def tayyorla(self, maxlen=48, test_ulush=0.25):
        tr, te = train_test_split(self.d, test_size=test_ulush,
                                  random_state=42, stratify=self.d["y"])
        mk = lambda x: datasets.Dataset.from_dict(
            {"label": list(x["y"]), "text": list(x["text"])})
        dd = datasets.DatasetDict({"train": mk(tr), "test": mk(te)})
        return dd.map(lambda e: self.tok(e["text"], padding="max_length",
                                         max_length=maxlen, truncation=True),
                      batched=True)

    def oqit(self, tds, epochs=8, lr=3e-5):
        acc = evaluate.load("accuracy")
        model = AutoModelForSequenceClassification.from_pretrained(
            self.model_nomi, num_labels=len(self.id2label),
            id2label=self.id2label, label2id=self.label2id)
        args = TrainingArguments(
            output_dir="uz_hissiyot", eval_strategy="epoch",
            num_train_epochs=epochs, per_device_train_batch_size=4,
            learning_rate=lr, save_strategy="no", report_to=[], disable_tqdm=True)
        t = Trainer(model=model, args=args,
                    train_dataset=tds["train"], eval_dataset=tds["test"],
                    compute_metrics=lambda ep: acc.compute(
                        predictions=np.argmax(ep[0], -1), references=ep[1]),
                    processing_class=self.tok)
        t.train()
        print("\nYAKUNIY:", t.evaluate())
        t.save_model("uz_hissiyot"); self.tok.save_pretrained("uz_hissiyot")
        return t
```

**Ishlatish:**

```python
o = OzbekHissiyot()
print("=== O'ZBEKCHA TOKENLAR ==="); o.tokenlar_tekshir()

tds = o.tayyorla()
t = o.oqit(tds)

clf = pipeline("text-classification", model="uz_hissiyot", tokenizer="uz_hissiyot")
for s in ["Juda quvondim bugun", "Bu holat meni asabiylashtirdi",
          "Ertaga nima bo'lishidan xavotirdaman", "Judayam qayg'uliman"]:
    print(f"{s:36s} → {clf(s)[0]}")
```

> ## ⚠️⚠️ **HALOL OGOHLANTIRISH — 12 TA NAMUNA HECH NARSA EMAS.**
>
> ```
> 12 namuna · 4 sinf  =  har sinfga 3 ta
> 💥 4-darsda ko'rgan edik: 100 ta ham YETMAGAN (aniqlik 0.18)
> ```
>
> ## 🔑 **BU LOYIHA — KOD SHABLONI**, tayyor model **emas**. Uni ishlatish uchun sizga **kamida 200 misol/sinf** kerak.
>
> ## ✅ **NIMA UCHUN BARIBIR QIMMATLI?**
> ```
> ① O'zbekcha ma'lumot YIG'ISHNI boshlash uchun TAYYOR shablon
> ② tokenlar_tekshir() — xlm-roberta o'zbekchani QANDAY bo'lishini KO'RSATADI
> ③ Kod XLNet oqimi bilan AYNAN BIR XIL — faqat MODEL nomi boshqa
> ```
>
> ## 💡 **`tokenlar_tekshir()` NI ALBATTA ISHGA TUSHIRING.** Agar so'zlar **juda mayda** bo'laklarga bo'linsa — model o'sha tilni **yomon biladi**, va sizga **ko'proq** ma'lumot kerak bo'ladi.
>
> ## 🇺🇿 **QAYERDAN MA'LUMOT OLISH:** o'zbekcha ijtimoiy tarmoq izohlari, mahsulot sharhlari, forum postlari. **Qo'lda yorliqlash** — 200×4 = 800 misol, ikki kishi bir hafta ichida ulguradi.

---

## 🎯 Loyihalarni birlashtirish

```
1-loyiha (tozalash)      →  tozalash strategiyasini TANLASH
        ↓
2-loyiha (egri chiziq)   →  KERAKLI ma'lumot hajmini aniqlash
        ↓
4-loyiha (model stendi)  →  ENG MOS modelni tanlash
        ↓
3-loyiha (xato tahlili)  →  ZAIF joylarni topish
        ↓
5-loyiha (xizmat)        →  ⭐ ISHLAB CHIQARISHGA chiqarish
```

> ## 🚀 **KEYINGI QADAM:** 62–67-modulda (LLM Engineering) shu modelni **Streamlit** interfeysi bilan **haqiqiy ilovaga** aylantirasiz.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
