# 🚀 33-modul mini-loyihalari

> **6 ta tayyor loyiha.** Hammasi **BEPUL** — API kaliti kerak emas.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install transformers torch pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import torch, json, time
import pandas as pd
from pathlib import Path
from transformers import (BertForQuestionAnswering, BertTokenizer,
                          AutoTokenizer, AutoModel, pipeline)

QA_MODEL = "bert-large-uncased-whole-word-masking-finetuned-squad"
```

---

# 🏢 1-loyiha. Korporativ FAQ-bot

> **Maqsad:** kompaniya hujjatlaridan **iqtibos bilan** javob beradigan xizmat.

```python
class FAQBot:
    """Ko'p hujjatli QA — ishonch chegarasi va IQTIBOS bilan."""

    def __init__(self, model=QA_MODEL, chegara=0.30):
        self.qa = pipeline("question-answering", model=model)
        self.chegara = chegara
        self.hujjatlar = {}
        self.jurnal = []

    def qosh(self, nom, matn):
        self.hujjatlar[nom] = " ".join(matn.split())
        return self

    def _iqtibos(self, matn, b, x, atrof=60):
        i, j = max(0, b - atrof), min(len(matn), x + atrof)
        return ("…" if i else "") + matn[i:b] + "⟪" + matn[b:x] + "⟫" + matn[x:j] + ("…" if j < len(matn) else "")

    def sora(self, savol):
        nomzodlar = []
        for nom, m in self.hujjatlar.items():
            try:
                r = self.qa(question=savol, context=m, max_answer_len=40)
                nomzodlar.append((r["score"], nom, r))
            except Exception as e:
                print(f"⚠️ {nom}: {type(e).__name__}")

        if not nomzodlar:
            javob = {"ok": False, "sabab": "hujjat yo'q"}
        else:
            s, nom, r = max(nomzodlar, key=lambda z: z[0])
            if s < self.chegara:
                javob = {"ok": False, "sabab": f"past ishonch ({s:.3f})",
                         "eng_yaqin": r["answer"], "manba": nom}
            else:
                javob = {"ok": True, "javob": r["answer"], "manba": nom,
                         "ishonch": round(s, 4),
                         "iqtibos": self._iqtibos(self.hujjatlar[nom], r["start"], r["end"])}
        self.jurnal.append({"savol": savol, **javob})
        return javob

    def hisobot(self):
        d = pd.DataFrame(self.jurnal)
        ok = d["ok"].sum()
        print(f"savollar: {len(d)}   javob berilgan: {ok} ({ok/len(d):.0%})")
        for r in self.jurnal:
            if r["ok"]:
                print(f"\n✅ {r['savol']}\n   → {r['javob']}   [{r['manba']}, {r['ishonch']}]")
                print(f"   {r['iqtibos']}")
            else:
                print(f"\n❌ {r['savol']}\n   → {r['sabab']}")
```

**Ishlatish:**

```python
bot = (FAQBot()
  .qosh("sotuv", """Sunset Motors is a family-owned car dealership that opened its
        doors in 1978. The dealership is located in Crestwood and covers an area of
        ten acres. Sunset Motors sells Ford, Toyota, Honda, Chevrolet and BMW.""")
  .qosh("servis", """The Sunset Motors service centre is open 24 hours a day. An oil
        change costs 45 dollars and takes 30 minutes. The centre employs 45 certified
        technicians. Every used vehicle comes with a 12-month warranty."""))

for s in ["Where is the dealership located?",
          "How much does an oil change cost?",
          "How long is the warranty?",
          "What is the capital of France?"]:
    bot.sora(s)
bot.hisobot()
```

> ## 🏆 **ENG QIMMATLI QISMI — `iqtibos`.** Foydalanuvchi javobning **qayerdan** kelganini ko'radi. Bu — **ishonch** va **audit** uchun **majburiy**.
>
> ## ⚖️ **BERT-QA'ning ustunligi:** iqtibos **har doim aniq** — chunki javob matnning **haqiqiy kesmasi**. GPT'da bunday kafolat **yo'q**.

---

# 📊 2-loyiha. QA-baholash paneli

> **Maqsad:** "oltin to'plam"da modelni **o'lchash** va **chegarani tanlash**.

```python
class QABaholovchi:
    """Oltin to'plamda QA modelini baholash + chegara optimizatsiyasi."""

    def __init__(self, model=QA_MODEL):
        self.qa = pipeline("question-answering", model=model)
        self.oltin = []

    def qosh(self, savol, kontekst, kutilgan=None):
        """kutilgan=None → savol JAVOBSIZ bo'lishi kerak."""
        self.oltin.append((savol, kontekst, kutilgan))
        return self

    def _mos(self, olingan, kutilgan):
        a = "".join(c for c in olingan.lower() if c.isalnum() or c == " ").split()
        b = "".join(c for c in kutilgan.lower() if c.isalnum() or c == " ").split()
        return len(set(a) & set(b)) / max(1, len(set(b)))     # token-recall

    def baho(self, chegara=0.30):
        n = []
        for s, k, kut in self.oltin:
            r = self.qa(question=s, context=k)
            javob_berdi = r["score"] >= chegara
            if kut is None:
                ok = not javob_berdi
                mos = None
            else:
                mos = self._mos(r["answer"], kut)
                ok = javob_berdi and mos >= 0.7
            n.append({"savol": s[:36], "olingan": r["answer"][:22],
                      "kutilgan": (kut or "—")[:18], "ball": round(r["score"], 4),
                      "mos": None if mos is None else round(mos, 2), "OK": ok})
        return pd.DataFrame(n)

    def chegara_izla(self, oraliq=(0.05, 0.15, 0.25, 0.35, 0.50, 0.70)):
        qatorlar = []
        for c in oraliq:
            d = self.baho(c)
            qatorlar.append({"chegara": c, "aniqlik": round(d["OK"].mean(), 3),
                             "to'g'ri": int(d["OK"].sum()), "jami": len(d)})
        d = pd.DataFrame(qatorlar)
        eng = d.loc[d["aniqlik"].idxmax()]
        print(d.to_string(index=False))
        print(f"\n🏆 ENG YAXSHI chegara: {eng['chegara']}  →  {eng['aniqlik']:.0%}")
        return d
```

**Ishlatish:**

```python
K = ("Sunset Motors opened in 1978. It is located in Crestwood and covers ten acres. "
     "The service centre employs 45 certified technicians.")

b = (QABaholovchi()
     .qosh("When did Sunset Motors open?", K, "1978")
     .qosh("Where is it located?", K, "Crestwood")
     .qosh("How many technicians?", K, "45")
     .qosh("How large is it?", K, "ten acres")
     .qosh("What is the capital of France?", K, None)      # ← javob BO'LMASLIGI kerak
     .qosh("Who is the CEO?", K, None))

print(b.baho(0.30).to_string(index=False))
b.chegara_izla()
```

> ## 🔑 **`kutilgan=None` QATORLARI — LOYIHANING YURAGI.** Ular modelning **"bilmayman" deya olishini** tekshiradi. Ko'p jamoalar buni **unutadi** va bot **hamma narsaga** javob berib qoladi.
>
> ## ⚠️ **Chegarani `chegara_izla()` bilan tanlang** — "0.5 yaxshi ko'rinadi" **emas**.

---

# ⚖️ 3-loyiha. Model taqqoslash stendi

> **Maqsad:** BERT · RoBERTa · DistilBERT'ni **bir xil savollarda** o'lchash.

```python
QA_MODELLAR = {
    "BERT-large":  "bert-large-uncased-whole-word-masking-finetuned-squad",
    "RoBERTa":     "deepset/roberta-base-squad2",
    "DistilBERT":  "distilbert-base-cased-distilled-squad",
}

class ModelStend:
    """Bir nechta QA modelini SIFAT va TEZLIK bo'yicha solishtirish."""

    def __init__(self, modellar=QA_MODELLAR):
        self.qa = {}
        for nom, m in modellar.items():
            try:
                self.qa[nom] = pipeline("question-answering", model=m)
                print(f"✅ {nom}")
            except Exception as e:
                print(f"❌ {nom}: {type(e).__name__}")

    def sinov(self, savollar, kontekst, takror=5):
        n = []
        for nom, qa in self.qa.items():
            for s in savollar:
                qa(question=s, context=kontekst)          # isitish
                t0 = time.perf_counter()
                for _ in range(takror):
                    r = qa(question=s, context=kontekst)
                ms = (time.perf_counter() - t0) / takror * 1000
                n.append({"model": nom, "savol": s[:30], "javob": r["answer"][:24],
                          "ball": round(r["score"], 4), "ms": round(ms, 1)})
        return pd.DataFrame(n)

    def xulosa(self, d):
        x = d.groupby("model").agg(o_rtacha_ball=("ball", "mean"),
                                   o_rtacha_ms=("ms", "mean")).round(3)
        x["ball/ms"] = (x["o_rtacha_ball"] / x["o_rtacha_ms"] * 1000).round(2)
        print(x.sort_values("ball/ms", ascending=False).to_string())
        print("\n💡 'ball/ms' — SIFAT/NARX nisbati. Prototip uchun eng muhim ustun.")
```

**Ishlatish:**

```python
K = ("The DVD is a digital optical disc storage format. It was invented in 1995 "
     "and first released on November 1, 1996 in Japan. The first DVD player and "
     "disc were released in the United States on March 24, 1997.")

st = ModelStend()
d = st.sinov(["When was the DVD invented?",
              "When was the first DVD released?",
              "Where was the DVD first released?"], K)
print(d.to_string(index=False))
st.xulosa(d)
```

> ## ⚠️ **`roberta-base-squad2` — MUHIM NOZIKLIK.** Toza `roberta-base` QA qila **olmaydi** *(unda `qa_outputs` boshi yo'q)*. **`squad2`** varianti esa **javobsiz savollarni** ham tanishga o'qitilgan — ya'ni u `""` qaytarishi mumkin.
>
> ## 💡 **SQuAD 1.1 vs SQuAD 2.0:**
> ```
> SQuAD 1.1  →  javob HAR DOIM bor deb faraz qiladi
> SQuAD 2.0  →  "javob YO'Q" ni ham o'rgangan  ⭐ ishonchliroq
> ```

---

# 📄 4-loyiha. Uzun hujjat qidiruvchisi

> **Maqsad:** 512 token cheklovini **sliding window** bilan aylanib o'tish.

```python
class UzunHujjatQA:
    """Uzun matnni OYNALARGA bo'lib eng ishonchli javobni topadi."""

    def __init__(self, model=QA_MODEL, oyna=1200, ustma_ust=300):
        self.qa = pipeline("question-answering", model=model)
        self.oyna, self.ustma_ust = oyna, ustma_ust

    def _bolaklar(self, matn):
        qadam = self.oyna - self.ustma_ust
        for i in range(0, max(1, len(matn) - self.ustma_ust), qadam):
            yield i, matn[i:i + self.oyna]

    def sora(self, savol, matn, chegara=0.20, top=3):
        n = []
        for ofset, b in self._bolaklar(matn):
            try:
                r = self.qa(question=savol, context=b)
                n.append({"ofset": ofset, "javob": r["answer"],
                          "ball": round(r["score"], 4),
                          "belgi": ofset + r["start"]})
            except Exception:
                pass
        n.sort(key=lambda z: -z["ball"])
        yuqori = [x for x in n if x["ball"] >= chegara][:top]
        return {"eng_yaxshi": yuqori[0] if yuqori else None,
                "bo_laklar": len(n), "top": yuqori}
```

**Ishlatish:**

```python
BAZA = ("Sunset Motors is a family-owned car dealership that opened in 1978. " * 3 +
        "The service centre employs 45 certified technicians and offers a free "
        "multi-point inspection. " * 3 +
        "Every used vehicle comes with a 12-month warranty and a 30-day exchange "
        "policy. Financing terms extend up to 72 months. " * 3)

u = UzunHujjatQA()
r = u.sora("How long is the warranty?", BAZA)
print(f"bo'laklar: {r['bo_laklar']}")
for t in r["top"]:
    print(f"   {t['ball']:.4f}  belgi {t['belgi']:5d}  {t['javob']}")
```

> ## 🔑 **`ustma_ust` (overlap) NIMA UCHUN KERAK?**
> ```
> Ustma-ustliksiz:  [....javob ke|sildi....]   ❌ javob CHEGARADA qolib ketdi
> Ustma-ustlik bilan: [....javob kesildi..]
>                          [..javob kesildi....]   ✅ birida BUTUN
> ```
> ## ⚠️ **Qoida:** `ustma_ust` ≈ eng uzun kutilayotgan javobning **2 baravari**.
>
> ## 💡 **`pipeline` da bu `doc_stride` deb ataladi** va `handle_impossible_answer=True` bilan birga ishlaydi.

---

# 🔬 5-loyiha. Ishonch tahlilchisi

> **Maqsad:** model **qachon ikkilanayotganini** aniqlash.

```python
class IshonchTahlil:
    """start/end logitlarini ochib, modelning IKKILANISHINI o'lchaydi."""

    def __init__(self, model_nomi=QA_MODEL):
        self.m = BertForQuestionAnswering.from_pretrained(model_nomi)
        self.t = BertTokenizer.from_pretrained(model_nomi)
        self.m.eval()

    def _oqim(self, savol, kontekst):
        ids = self.t.encode(savol, kontekst, truncation=True, max_length=512)
        tkn = self.t.convert_ids_to_tokens(ids)
        sep = ids.index(self.t.sep_token_id); n_a = sep + 1
        seg = [0]*n_a + [1]*(len(ids) - n_a)
        with torch.no_grad():
            o = self.m(torch.tensor([ids]), token_type_ids=torch.tensor([seg]))
        return ids, tkn, o

    def tahlil(self, savol, kontekst, top=5):
        ids, tkn, o = self._oqim(savol, kontekst)
        sp = torch.softmax(o.start_logits, -1)[0]
        ep = torch.softmax(o.end_logits,   -1)[0]
        b, x = int(sp.argmax()), int(ep.argmax())

        s_top = torch.topk(sp, top)
        farq  = float(s_top.values[0] - s_top.values[1])           # ikkilanish
        entr  = float(-(sp * (sp + 1e-12).log()).sum())            # tarqoqlik

        return {
            "javob":    self.t.decode(ids[b:x+1]) if x >= b else None,
            "ishonch":  round(float(sp[b] * ep[x]), 4),
            "start":    b, "end": x,
            "zid":      x < b,
            "farq_1_2": round(farq, 4),
            "entropiya": round(entr, 3),
            "top_start": [(tkn[int(i)], round(float(v), 4))
                          for v, i in zip(s_top.values, s_top.indices)],
        }

    def hisobot(self, savollar, kontekst):
        n = []
        for s in savollar:
            r = self.tahlil(s, kontekst)
            bayroq = ("🔴 ZID" if r["zid"] else
                      "🔴 PAST" if r["ishonch"] < 0.30 else
                      "🟡 IKKILANISH" if r["farq_1_2"] < 0.20 else "🟢 ISHONCHLI")
            n.append({"savol": s[:34], "javob": str(r["javob"])[:20],
                      "ishonch": r["ishonch"], "farq": r["farq_1_2"],
                      "entropiya": r["entropiya"], "holat": bayroq})
        print(pd.DataFrame(n).to_string(index=False))
```

**Ishlatish:**

```python
K = ("Sunset Motors opened in 1978 in Crestwood and covers ten acres. "
     "The service centre employs 45 certified technicians.")

t = IshonchTahlil()
t.hisobot(["When did Sunset Motors open?",
           "Where is it located?",
           "How many technicians work there?",
           "What is the capital of France?",
           "Do you sell electric cars?"], K)

print("\n" + "="*60)
print(t.tahlil("What is the capital of France?", K))
```

> ## 🔑 **UCHTA SIGNALNI BIRGA O'QING:**
> ```
> ishonch   past    →  model javobni TOPMADI
> farq_1_2  kichik  →  model IKKI nomzod orasida IKKILANMOQDA
> entropiya yuqori  →  ehtimollik BUTUN matnga TARQALGAN  ← eng yomon belgi
> zid       True    →  end < start, javob YO'Q
> ```
>
> ## 💡 **`entropiya` — eng nozik ko'rsatkich.** Ishonch o'rtacha bo'lsa ham, entropiya yuqori bo'lsa — model **taxmin qilyapti**. 30-modul 9-darsdagi e'tibor entropiyasi bilan **bir xil g'oya**.

---

# 🇺🇿 6-loyiha. O'zbekcha gibrid QA

> **Maqsad:** ingliz tilidagi **kuchli** modelni o'zbekcha savollar uchun ishlatish.

```python
class OzbekQA:
    """IKKI STRATEGIYA: to'g'ridan-to'g'ri ko'p tilli vs GIBRID tarjima."""

    LUGAT = {   # demo uchun mini-lug'at; amalda tarjima xizmati ishlatiladi
        "qachon": "when", "qayerda": "where", "nechta": "how many",
        "qancha": "how much", "kim": "who", "nima": "what",
        "ochilgan": "opened", "joylashgan": "located", "ishlaydi": "work",
        "salon": "dealership", "narxi": "cost", "kafolat": "warranty",
    }

    def __init__(self):
        self.ing = pipeline("question-answering", model=QA_MODEL)
        try:
            self.kop = pipeline("question-answering",
                                model="deepset/xlm-roberta-base-squad2")
        except Exception as e:
            self.kop = None
            print(f"⚠️ ko'p tilli model yuklanmadi: {type(e).__name__}")

    def sodda_tarjima(self, savol):
        """⚠️ DEMO — haqiqiy loyihada tarjima API ishlating."""
        soz = ["".join(c for c in w.lower() if c.isalnum() or c in "'ʻ’")
               for w in savol.split()]
        return " ".join(self.LUGAT.get(w, w) for w in soz if w) + "?"

    def solishtir(self, savol_uz, kontekst_uz, kontekst_en):
        n = []
        if self.kop:
            r = self.kop(question=savol_uz, context=kontekst_uz)
            n.append({"usul": "① to'g'ridan-to'g'ri (xlm-r)", "savol": savol_uz[:30],
                      "javob": r["answer"][:26], "ball": round(r["score"], 4)})
        savol_en = self.sodda_tarjima(savol_uz)
        r = self.ing(question=savol_en, context=kontekst_en)
        n.append({"usul": "② GIBRID (tarjima + bert-large)", "savol": savol_en[:30],
                  "javob": r["answer"][:26], "ball": round(r["score"], 4)})
        return pd.DataFrame(n)
```

**Ishlatish:**

```python
UZ = ("Sunset Motors — 1978-yilda ochilgan oilaviy avtosalon. Salon Crestwood "
      "shahrida joylashgan va o'n akr maydonni egallaydi. Servis markazida "
      "45 nafar sertifikatlangan usta ishlaydi.")
EN = ("Sunset Motors is a family-owned car dealership that opened in 1978. "
      "The dealership is located in Crestwood and covers ten acres. "
      "The service centre employs 45 certified technicians.")

o = OzbekQA()
for s in ["Salon qachon ochilgan?", "Salon qayerda joylashgan?", "Nechta usta ishlaydi?"]:
    print(o.solishtir(s, UZ, EN).to_string(index=False), "\n")
```

> ## ⚠️⚠️ **HALOL OGOHLANTIRISH — BU LOYIHA "SEHRLI YECHIM" EMAS.**
>
> ```
> ① TO'G'RIDAN-TO'G'RI  →  xlm-roberta o'zbekchani QISMAN tushunadi.
>                          Sana va atoqli otda odatda ishlaydi,
>                          murakkab savolda XATO QILADI.
>
> ② GIBRID              →  yuqori ishonch, LEKIN tarjima sifatiga BOG'LIQ.
>                          Yuqoridagi mini-lug'at — DEMO, ishlab chiqarish
>                          uchun HAQIQIY tarjima xizmati kerak.
> ```
>
> ## 🔑 **AMALIY TAVSIYA:** kontekst **kichik** va **o'zgarmas** bo'lsa — uni **bir marta qo'lda** inglizchaga tarjima qiling. Bu **eng arzon** va **eng ishonchli** yo'l.
>
> ## 💡 **Ikkala usulni ham `QABaholovchi` (2-loyiha) bilan O'LCHANG.** Taxmin qilmang — **raqamga qarang**.

---

## 🎯 Loyihalarni birlashtirish

```
1-loyiha (FAQ-bot)          →  asos: ko'p hujjat + iqtibos
        +
2-loyiha (baholovchi)       →  chegarani O'LCHAB tanlash
        +
4-loyiha (uzun hujjat)      →  512 token cheklovidan chiqish
        +
5-loyiha (ishonch tahlili)  →  ikkilanishni ANIQLASH
        ↓
    ⭐ ishlab chiqarishga TAYYOR QA xizmati
```

> ## 🚀 **KEYINGI QADAM:** 48–51-modulda **vektor bazasi** qo'shiladi — shunda 100 ta hujjatni **100 marta** modelga bermaysiz, balki **eng mos 3 tasini** oldindan topasiz.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
