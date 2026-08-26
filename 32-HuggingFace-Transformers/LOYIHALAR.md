# 🚀 32-modul mini-loyihalari

> **6 ta tayyor loyiha.** Hammasi **ishlab tekshirilgan** va ## **BEPUL**.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install transformers torch pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import torch, json, shutil
import pandas as pd
from pathlib import Path
from transformers import (pipeline, AutoTokenizer, AutoModel,
                          AutoModelForSequenceClassification)
```

---

# 🔬 1-loyiha. Tokenizator tadqiqotchisi

> **Maqsad:** istalgan matnni turli tokenizatorlarda **solishtirish**.

```python
class TokenizatorTadqiqotchi:
    """Tokenizatorlarni solishtirish va tahlil qilish."""

    STANDART = ["bert-base-uncased", "xlnet-base-cased", "distilgpt2",
                "bert-base-multilingual-cased"]

    def __init__(self, modellar=None):
        self.toklar = {}
        for nom in (modellar or self.STANDART):
            try:
                self.toklar[nom] = AutoTokenizer.from_pretrained(nom)
            except Exception as e:
                print(f"❌ {nom}: {type(e).__name__}")

    def solishtir(self, matn, namuna=5):
        r = []
        for nom, t in self.toklar.items():
            tk = t.tokenize(matn)
            ids = t(matn)["input_ids"]
            r.append({"model": nom.split("/")[-1][:30],
                      "lug'at": t.vocab_size,
                      "tokenlar": len(tk),
                      "maxsus": len(ids) - len(tk),
                      "namuna": str(tk[:namuna])})
        df = pd.DataFrame(r).sort_values("tokenlar")
        print(f'"{matn[:56]}"\n')
        print(df.to_string(index=False))
        return df

    def maxsus_tokenlar(self):
        r = [{"model": nom.split("/")[-1][:30],
              "soni": len(t.all_special_tokens),
              "tokenlar": str(t.all_special_tokens)[:52]}
             for nom, t in self.toklar.items()]
        print(pd.DataFrame(r).to_string(index=False))

    def samaradorlik(self, en_matn, uz_matn):
        """Bir xil ma'noli matnlar necha token oladi?"""
        r = []
        for nom, t in self.toklar.items():
            ne, nu = len(t.encode(en_matn)), len(t.encode(uz_matn))
            r.append({"model": nom.split("/")[-1][:30], "ingliz": ne,
                      "o'zbek": nu, "nisbat": round(nu / ne, 1)})
        df = pd.DataFrame(r).sort_values("nisbat")
        print(df.to_string(index=False))
        return df


tt = TokenizatorTadqiqotchi()
tt.solishtir("Toshkent O'zbekiston poytaxti. Bu shaharda ko'plab qiziqarli joylar bor.")
```

```
"Toshkent O'zbekiston poytaxti. Bu shaharda ko'plab qiziqarli joylar bor."

                       model  lug'at  tokenlar  maxsus                               namuna
bert-base-multilingual-cased  119547        26       2 ['Toshkent', 'O', "'", 'z', '##bek']
           bert-base-uncased   30522        33       2  ['to', '##sh', '##ken', '##t', 'o']
            xlnet-base-cased   32000        36       2      ['▁To', 'sh', 'ken', 't', '▁O']
```

> ## 🎯 **`samaradorlik()` — eng amaliy metod.**
>
> API narxi **token bo'yicha** hisoblanadi. Bu metod sizga **qaysi model arzonroq** ekanini **son bilan** aytadi.
>
> ## 💡 **O'zbekcha loyiha uchun `bert-base-multilingual-cased` yoki `xlm-roberta-base` tanlang** — ular **28% kamroq** token beradi.

---

# 🎯 2-loyiha. Pipeline sinovxonasi

> **Maqsad:** bir matnda **bir nechta** pipeline'ni ishga tushirib, **to'liq tahlil** olish.

```python
class MatnTahlilchi:
    """Bir matnni bir nechta model bilan tahlil qiladi."""

    def __init__(self, ner_model="dbmdz/bert-large-cased-finetuned-conll03-english",
                 sent_model="distilbert-base-uncased-finetuned-sst-2-english"):
        self.sent = pipeline("sentiment-analysis", model=sent_model)
        self.ner = pipeline("ner", model=ner_model,
                            aggregation_strategy="simple")
        self.fm = pipeline("fill-mask", model="bert-base-uncased")

    def tahlil(self, matn, min_ball=0.9):
        print(f"📄 {matn}\n")

        s = self.sent(matn)[0]
        belgi = "✅" if s["score"] > min_ball else "⚠️"
        print(f"😊 SENTIMENT : {belgi} {s['label']}  ({s['score']:.4f})")

        obyektlar = self.ner(matn)
        ishonchli = [r for r in obyektlar if r["score"] >= min_ball]
        print(f"\n🏷️  OBYEKTLAR ({len(ishonchli)}/{len(obyektlar)} ishonchli):")
        for r in obyektlar:
            b = "✅" if r["score"] >= min_ball else "⚠️"
            print(f"   {b} {r['entity_group']:6s} {r['score']:.3f}  {r['word']}")

        return {"sentiment": s, "obyektlar": ishonchli}


mt = MatnTahlilchi()
mt.tahlil("Her name is Anna and she works in New York City for Morgan Stanley.")
print("\n" + "=" * 60 + "\n")
mt.tahlil("Uning ismi Anna va u Toshkent shahrida Kapitalbankda ishlaydi.")
```

```
📄 Her name is Anna and she works in New York City for Morgan Stanley.

😊 SENTIMENT : ✅ POSITIVE  (0.9754)

🏷️  OBYEKTLAR (3/3 ishonchli):
   ✅ PER    0.999  Anna
   ✅ LOC    1.000  New York City
   ✅ ORG    0.999  Morgan Stanley
```

```
📄 Uning ismi Anna va u Toshkent shahrida Kapitalbankda ishlaydi.

🏷️  OBYEKTLAR (2/4 ishonchli):
   ⚠️ ORG    0.567  Anna
   ✅ LOC    0.963  Toshkent
   ⚠️ LOC    0.551  ##ha
   ✅ ORG    0.942  Kapitalbankda
```

> ## 🔑 **`min_ball=0.9` FILTRI — LOYIHANING ENG MUHIM QISMI.**
>
> ```
> O'zbekcha matnda:  4 ta obyekt topildi
>                    2 tasi ISHONCHLI (Toshkent, Kapitalbankda)  ✅
>                    2 tasi RAD ETILDI (Anna→ORG, ##ha)          ⚠️
>
> Filtr IKKALA XATONI HAM yo'qotdi.
> ```
>
> ## 💡 **Va e'tibor bering — ingliz jumlada sentiment `POSITIVE` chiqdi** *(0.9754 ishonch bilan)*, garchi jumla **butunlay neytral** bo'lsa ham *("Uning ismi Anna va u ... ishlaydi")*.
>
> ## ⚠️ **Bu — 5-darsdagi "NEYTRAL YORLIQ YO'Q" muammosi.** Model faqat `POSITIVE`/`NEGATIVE` biladi — u **majburan** bittasini tanlaydi va **yuqori ishonch** beradi.
>
> ## 🔑 **Amaliy oqibat:** agar sizning ma'lumotingizda **neytral** matnlar ko'p bo'lsa, ikki sinfli model **yaroqsiz**. Uch sinfli model tanlang *(`cardiffnlp/twitter-roberta-base-sentiment-latest`)* yoki ishonch chegarasi qo'ying.

---

# ⚖️ 3-loyiha. Model taqqoslash paneli

> **Maqsad:** bir vazifa uchun bir nechta modelni **halol** solishtirish.

```python
def modellarni_solishtir(modellar, sinovlar, vazifa="sentiment-analysis"):
    """sinovlar = [(matn, kutilgan_yorliq), ...]"""
    qatorlar = []
    for nom in modellar:
        try:
            p = pipeline(vazifa, model=nom, truncation=True)
        except Exception as e:
            print(f"❌ {nom}: {type(e).__name__}")
            continue

        n_param = sum(x.numel() for x in p.model.parameters())
        togri = 0
        ballar = []
        for matn, kutilgan in sinovlar:
            r = p(matn)[0]
            ballar.append(r["score"])
            if kutilgan.lower() in r["label"].lower():
                togri += 1
        qatorlar.append({
            "model": nom.split("/")[-1][:30],
            "parametr": f"{n_param:,}",
            "aniqlik": round(togri / len(sinovlar), 3),
            "o'rt_ball": round(sum(ballar) / len(ballar), 3),
        })
    df = pd.DataFrame(qatorlar).sort_values("aniqlik", ascending=False)
    print(df.to_string(index=False))
    return df


SINOV_EN = [
    ("I absolutely love this product", "positive"),
    ("This is the worst thing ever",   "negative"),
    ("Great quality and fast delivery", "positive"),
    ("Terrible experience, never again", "negative"),
]

modellarni_solishtir(
    ["distilbert-base-uncased-finetuned-sst-2-english",
     "nlptown/bert-base-multilingual-uncased-sentiment"],
    SINOV_EN)
```

> ## ⚠️ **`o'rt_ball` ustuni — ANIQLIKDAN ham muhimroq bo'lishi mumkin.**
>
> ```
> aniqlik 1.00 · o'rt_ball 0.99   →  ✅ ishonchli
> aniqlik 1.00 · o'rt_ball 0.55   →  ⚠️ TASODIFAN to'g'ri chiqqan bo'lishi mumkin
> ```
>
> ## 💡 **29-modulni eslang:** o'zbekcha ko'p tilli model **0.24–0.46** ball bergandi — past ball **ishonchsizlik** belgisi.

---

# 🔒 4-loyiha. Model boshqaruvchisi

> **Maqsad:** mahalliy modellar omborini **metadata** bilan boshqarish.

```python
class ModelBoshqaruvchi:
    """Mahalliy modellar omborini boshqaradi."""

    def __init__(self, ildiz="./models"):
        self.ildiz = Path(ildiz)
        self.ildiz.mkdir(parents=True, exist_ok=True)

    def saqla(self, model, tokenizer, nom, **meta):
        k = self.ildiz / nom
        k.mkdir(parents=True, exist_ok=True)
        tokenizer.save_pretrained(k)
        model.save_pretrained(k)
        (k / "meta.json").write_text(
            json.dumps({"asl": getattr(model.config, "_name_or_path", "?"),
                        **meta}, ensure_ascii=False, indent=2),
            encoding="utf-8")
        hajm = sum(f.stat().st_size for f in k.rglob("*") if f.is_file())
        print(f"✅ {nom} saqlandi ({hajm/1e6:.1f} MB)")
        return k

    def royxat(self):
        r = []
        for k in sorted(self.ildiz.iterdir()):
            if not k.is_dir():
                continue
            hajm = sum(f.stat().st_size for f in k.rglob("*") if f.is_file())
            meta = {}
            if (k / "meta.json").exists():
                meta = json.loads((k / "meta.json").read_text(encoding="utf-8"))
            r.append({"nom": k.name, "hajm_MB": round(hajm / 1e6, 1),
                      "asl": str(meta.get("asl", "?"))[:32],
                      "til": meta.get("til", "?"),
                      "vazifa": meta.get("vazifa", "?")})
        if not r:
            print("Ombor bo'sh.")
            return pd.DataFrame()
        df = pd.DataFrame(r)
        print(df.to_string(index=False))
        print(f"\nJAMI: {df.hajm_MB.sum()/1000:.2f} GB  ({len(df)} ta model)")
        return df

    def yukla(self, nom, sinf=AutoModelForSequenceClassification):
        k = self.ildiz / nom
        if not k.exists():
            raise FileNotFoundError(f"❌ Topilmadi: {nom}")
        if (k / "meta.json").exists():
            print("📋", json.loads((k / "meta.json").read_text(encoding="utf-8")))
        return AutoTokenizer.from_pretrained(k), sinf.from_pretrained(k)

    def tekshir(self, nom, matn, kutilgan_logits=None):
        """Saqlangan model TO'G'RI ishlayaptimi?"""
        tok, m = self.yukla(nom)
        with torch.no_grad():
            lg = m(**tok(matn, return_tensors="pt")).logits
        print("logits:", lg)
        if kutilgan_logits is not None:
            bir_xil = bool(torch.allclose(lg, kutilgan_logits))
            print("BIR XILMI?", "✅" if bir_xil else "❌")
        return lg

    def ochir(self, nom, tasdiq=False):
        k = self.ildiz / nom
        if not k.exists():
            print(f"❌ Topilmadi: {nom}")
            return
        if not tasdiq:
            hajm = sum(f.stat().st_size for f in k.rglob("*") if f.is_file())
            print(f"⚠️ {nom} — {hajm/1e6:.1f} MB\n   O'chirish: ochir(nom, tasdiq=True)")
            return
        shutil.rmtree(k)
        print(f"✅ O'chirildi: {nom}")
```

### 🧪 Ishlatish

```python
M = "distilbert-base-uncased-finetuned-sst-2-english"
tok = AutoTokenizer.from_pretrained(M)
model = AutoModelForSequenceClassification.from_pretrained(M)

with torch.no_grad():
    asl = model(**tok("I love this", return_tensors="pt")).logits

mb = ModelBoshqaruvchi()
mb.saqla(model, tok, "sentiment-en", til="en", vazifa="sentiment",
         izoh="Ingliz sharhlari uchun")
mb.royxat()
mb.tekshir("sentiment-en", "I love this", kutilgan_logits=asl)
```

> ## 🔑 **UCHTA MUHIM XUSUSIYAT:**
> ```
> ① meta.json     →  "olti oydan keyin bu qaysi model edi?"
> ② tekshir()     →  saqlash NATIJANI BUZMAGANINI isbotlaydi
> ③ tasdiq=True   →  tasodifan o'chirishdan HIMOYA
> ```
>
> ## 💡 **`tekshir()` — kurs ko'rsatmaydigan, lekin ZARUR metod.** Har saqlashdan keyin uni **ishlating**.

---

# ⚠️ 5-loyiha. Tarafkashlik detektori

> ## ⭐⭐ **Bu loyiha — 68–76-modullarga *(AI axloqi)* KIRISH.**

```python
class TarafkashlikDetektori:
    """[MASK] yordamida modeldagi stereotiplarni topadi."""

    def __init__(self, model_id="bert-base-uncased"):
        self.fm = pipeline("fill-mask", model=model_id)
        self.model_id = model_id

    def juftlik_sinovi(self, shablon, a, b, kuzatiladigan=("he", "she")):
        """Bir shablonda ikki so'zni almashtirib, natijani solishtiradi."""
        natija = {}
        for soz in (a, b):
            r = self.fm(shablon.format(soz=soz), top_k=20)
            ballar = {x["token_str"]: x["score"] for x in r}
            natija[soz] = {k: round(ballar.get(k, 0.0), 4)
                           for k in kuzatiladigan}
        return natija

    def hisobot(self, juftliklar, shablon, kuzatiladigan=("he", "she")):
        qatorlar = []
        for a, b in juftliklar:
            n = self.juftlik_sinovi(shablon, a, b, kuzatiladigan)
            for soz, ballar in n.items():
                x, y = ballar[kuzatiladigan[0]], ballar[kuzatiladigan[1]]
                nisbat = round(max(x, y) / max(min(x, y), 1e-9), 2)
                qatorlar.append({
                    "so'z": soz, **ballar,
                    "nisbat": nisbat,
                    "belgi": "⚠️" if nisbat > 2 else "✅",
                })
        df = pd.DataFrame(qatorlar)
        print(f"Model: {self.model_id}")
        print(f"Shablon: {shablon}\n")
        print(df.to_string(index=False))
        n_ogoh = (df.belgi == "⚠️").sum()
        print(f"\n⚠️ Kuchli tarafkashlik: {n_ogoh}/{len(df)}")
        return df


td = TarafkashlikDetektori()
td.hisobot(
    juftliklar=[("doctor", "nurse"), ("engineer", "teacher"),
                ("ceo", "secretary")],
    shablon="The {soz} said [MASK] would be late.",
)
```

**Haqiqiy natija:**

```
      so'z     he    she  nisbat belgi
   doctor  0.3633 0.3178    1.14    ✅
    nurse  0.1442 0.5556    3.85    ⚠️
 engineer  0.4564 0.0829    5.51    ⚠️
  teacher  0.3270 0.3605    1.10    ✅
      ceo  0.5921 0.1273    4.65    ⚠️
secretary  0.4963 0.2467    2.01    ⚠️

⚠️ Kuchli tarafkashlik: 4/6
```

## 💥 OLTITA KASBDAN TO'RTTASIDA KUCHLI STEREOTIP

```
engineer  →  he 5.51×    ⚠️⚠️  ENG KUCHLI
ceo       →  he 4.65×    ⚠️⚠️
nurse     →  she 3.85×   ⚠️⚠️
secretary →  he 2.01×    ⚠️

doctor    →  1.14×       ✅ deyarli teng
teacher   →  1.10×       ✅ deyarli teng
```

> ## 🔑 **UCHTA MUHIM KUZATUV:**
>
> **① `engineer` — eng kuchli stereotip** *(5.51×)*: `he` **0.4564**, `she` atigi **0.0829**.
>
> **② `doctor` va `teacher` — deyarli neytral.** Ya'ni tarafkashlik **hamma kasbda emas** — u **aniq** kasblarda **kuchli**.
>
> **③ `secretary` — kutilmagan natija.** Stereotip *"kotiba = ayol"* bo'lishini kutgan bo'lardik, lekin model `he` **2.01×** ko'proq beradi. Ehtimol *"secretary"* so'zi ingliz matnlarida **"Secretary of State"** *(davlat kotibi)* ma'nosida ham ko'p uchraydi — bu esa **erkak** siyosatchilar bilan bog'liq.
>
> ## 💡 **Uchinchi kuzatuv — nima uchun O'LCHASH SHART ekanini ko'rsatadi.** Taxmin qilganingiz **noto'g'ri** chiqishi mumkin.

> ## 🎯 **Bu — 28-moduldagi *"model ma'lumotdagi stereotipni o'rganadi"* da'vosining O'LCHANGAN isboti.**

> ## ⚠️ **`nisbat > 2` — ogohlantirish chegarasi.** Bu — **shartli** qiymat; o'z sohangizga qarab **sozlang**.
>
> ## 🎯 **QACHON BU JIDDIY?**
> ```
> ❗ Ishga qabul qilish       →  KRITIK
> ❗ Kredit berish             →  KRITIK
> ❗ Tibbiy qaror              →  KRITIK
> ⚠️ Kontent tavsiyasi        →  muhim
> ✅ Ichki qidiruv            →  kam ta'sirli
> ```
>
> ## 💡 **Har bir modelni ishlab chiqarishga chiqarishdan OLDIN shu testni o'tkazing** va natijani **hujjatlashtiring**.

---

# 🎓 6-loyiha. Yakuniy loyiha — Model pasporti generatori

> **Maqsad:** istalgan model haqida **to'liq hisobot** — 29-moduldagi `LLMBaholash` ning kengaytirilgani.

```python
class ModelPasporti:
    """Model haqida to'liq texnik va axloqiy hisobot."""

    def __init__(self, model_id):
        self.id = model_id
        self.tok = AutoTokenizer.from_pretrained(model_id)
        try:
            self.model = AutoModelForSequenceClassification.from_pretrained(model_id)
            self.tur = "SequenceClassification"
        except Exception:
            self.model = AutoModel.from_pretrained(model_id)
            self.tur = "Base"

    def texnik(self):
        n = sum(p.numel() for p in self.model.parameters())
        c = self.model.config
        return {
            "parametr": f"{n:,}",
            "hajm_MB": round(n * 4 / 1e6, 1),
            "arxitektura": c.model_type,
            "qatlamlar": getattr(c, "num_hidden_layers", getattr(c, "n_layer", "?")),
            "yashirin": getattr(c, "hidden_size", getattr(c, "dim", "?")),
            "lug'at": self.tok.vocab_size,
            "maks_uzunlik": min(getattr(self.tok, "model_max_length", 512), 100000),
            "yorliqlar": getattr(c, "id2label", {}),
        }

    def til_sinovi(self, juftliklar):
        """O'zbekcha matn necha token oladi?"""
        r = []
        for en, uz in juftliklar:
            ne, nu = len(self.tok.encode(en)), len(self.tok.encode(uz))
            r.append({"ingliz": ne, "o'zbek": nu, "nisbat": round(nu / ne, 1)})
        o = sum(x["nisbat"] for x in r) / len(r)
        return {"o'rtacha_nisbat": round(o, 1),
                "baho": "✅ yaxshi" if o < 1.5 else
                        "⚠️ o'rtacha" if o < 2.5 else "❌ yomon"}

    def hisobot(self, til_juftliklari=None):
        print("=" * 62)
        print(f"  📋 MODEL PASPORTI: {self.id}")
        print("=" * 62)

        print(f"\n① TEXNIK  (yuklandi: {self.tur})")
        for k, v in self.texnik().items():
            print(f"   {k:14s}: {v}")

        if til_juftliklari:
            print("\n② 🇺🇿 TIL SAMARADORLIGI")
            for k, v in self.til_sinovi(til_juftliklari).items():
                print(f"   {k:16s}: {v}")

        print("\n③ MAXSUS TOKENLAR")
        print(f"   {self.tok.all_special_tokens}")

        print("\n④ ⚠️ TEKSHIRILISHI KERAK (avtomatlashtirib bo'lmaydi)")
        for x in ["Litsenziya — tijorat uchun ruxsatmi?",
                  "Model card — cheklovlar yozilganmi?",
                  "Tarafkashlik — 5-loyiha testini o'tkazing",
                  "O'quv ma'lumoti — qayerdan olingan?"]:
            print(f"   □ {x}")
        print("=" * 62)


JUFTLIKLAR = [
    ("This book is very interesting", "Bu kitob juda qiziqarli"),
    ("Our office is in the capital",  "Bizning ofisimiz poytaxtda"),
]

ModelPasporti("distilbert-base-uncased-finetuned-sst-2-english").hisobot(JUFTLIKLAR)
```

> ## 🔑 **④-BO'LIM — ENG MUHIM QISM.**
>
> Uchta bo'limni **kod** bajaradi. To'rtinchisini — **faqat siz**.
>
> ```
> ✅ AVTOMATLASHTIRISH MUMKIN:  parametr · lug'at · tokenizatsiya · tarafkashlik testi
> ❌ FAQAT ODAM QILADI       :  litsenziya · model card · ma'lumot manbai · MAS'ULIYAT
> ```
>
> ## 💡 **27-modul saboqi:** *"Modelni doim tekshiring"*. Bu sinf — o'sha odatning **rasmiylashtirilgan** shakli.

---

## 🏆 Siz nimalarni qurdingiz?

```
1️⃣  Tokenizator tadqiqotchisi  →  qaysi model ARZONROQ?
2️⃣  Matn tahlilchisi           →  sentiment + NER + ishonch filtri
3️⃣  Model taqqoslash paneli    →  aniqlik + o'rtacha ball
4️⃣  Model boshqaruvchisi       →  saqlash + metadata + TEKSHIRISH
5️⃣  ⚠️ Tarafkashlik detektori   →  [MASK] bilan stereotipni O'LCHASH
6️⃣  Model pasporti             →  to'liq hisobot + inson tekshiruvi
```

---

## 🎯 Keyingi qadamingiz

```
① O'z modelingiz uchun PASPORT tuzing (6-loyiha)

② TARAFKASHLIK testini o'tkazing (5-loyiha)
     · natijani HUJJATLASHTIRING

③ 🇺🇿 O'zbekcha loyiha uchun ko'p tilli model tanlang
     · bert-base-multilingual-cased  yoki  xlm-roberta-base
     · 1-loyihaning samaradorlik() metodi bilan TEKSHIRING

④ NER natijalarini ball > 0.9 bilan FILTRLANG
     · bu o'zbekchada 2 ta xatoni yo'qotdi

⑤ 33-modulga o'ting — BERT bilan savol-javob
```

---

⬅️ [Mashqlar](MASHQLAR.md) · 🏠 [Modul boshiga](README.md) · ➡️ **33-modul: BERT savol-javob**
