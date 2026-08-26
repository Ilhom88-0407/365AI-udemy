# 🚀 41-modul mini-loyihalari

> **4 ta tayyor loyiha.** ## ⭐ **Hammasi API kalitisiz sinaladi** — LCEL `RunnableLambda` bilan to'liq ishlaydi.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langchain langchain-core grandalf pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, re, json, os, importlib.util
from pathlib import Path
from datetime import datetime, timezone
from operator import itemgetter
import pandas as pd

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import (Runnable, RunnableLambda,
                                      RunnablePassthrough, RunnableParallel,
                                      chain)
```

---

# 🔬 1-loyiha. Zanjir profileri

> **Maqsad:** zanjirning **qaysi qadami sekin** va **nima qaytarayotganini** ko'rish.

```python
class ZanjirProfiler:
    """Zanjirning har qadamini vaqt, tur va hajm bo'yicha o'lchaydi."""

    def __init__(self, nom="zanjir"):
        self.nom = nom
        self.yozuvlar = []
        self.ishga_tushirish = 0

    # ── kuzatuv nuqtasi ──
    def nuqta(self, qadam):
        def f(x):
            self.yozuvlar.append({
                "ishga_tushirish": self.ishga_tushirish,
                "qadam": qadam,
                "vaqt": time.perf_counter(),
                "tur": type(x).__name__,
                "hajm": len(str(x)),
                "namuna": str(x)[:44].replace("\n", " ")})
            return x
        return RunnableLambda(f)

    # ── zanjirni AVTOMATIK o'rash ──
    def orab(self, *qadamlar):
        """[r1, r2, r3] → nuqta | r1 | nuqta | r2 | nuqta | r3 | nuqta"""
        z = self.nuqta("kirish")
        for i, q in enumerate(qadamlar):
            nom = getattr(q, "name", None) or type(q).__name__
            z = z | q | self.nuqta(f"{i+1}. {nom}")
        return z

    def invoke(self, z, kirish):
        self.ishga_tushirish += 1
        return z.invoke(kirish)

    def hisobot(self):
        if len(self.yozuvlar) < 2:
            print("kam ma'lumot")
            return
        d = pd.DataFrame(self.yozuvlar)
        d["soniya"] = d.groupby("ishga_tushirish").vaqt.diff().round(4)
        d = d.drop(columns=["vaqt"])
        print(d.to_string(index=False))

        x = d.dropna(subset=["soniya"]).groupby("qadam").agg(
            o_rtacha_s=("soniya", "mean"),
            jami_s=("soniya", "sum"),
            o_rt_hajm=("hajm", "mean")).round(4)
        x["ulush_%"] = (x.jami_s / x.jami_s.sum() * 100).round(1)
        print("\n=== QADAM BO'YICHA ===")
        print(x.sort_values("jami_s", ascending=False).to_string())

        eng = x.jami_s.idxmax()
        print(f"\n🐌 ENG SEKIN QADAM: {eng} "
              f"({x.loc[eng, 'ulush_%']}% umumiy vaqtdan)")
        return d
```

**Ishlatish (modelsiz):**

```python
p = ZanjirProfiler("matn tahlili")

z = p.orab(
    RunnableLambda(lambda s: s.strip()),
    RunnableLambda(lambda s: (time.sleep(0.15), s.lower())[1]),   # ⚠️ sekin
    RunnableLambda(lambda s: s.split()),
    RunnableLambda(lambda w: {"soni": len(w), "noyob": len(set(w))}))

for matn in ["  Salom dunyo salom LangChain  ",
             "  Bir ikki uch to'rt besh  "]:
    print("natija:", p.invoke(z, matn))

print()
p.hisobot()
```

> ## 🏆 **`ulush_%` USTUNI — LOYIHANING ASOSIY QIYMATI.**
>
> U sizga **aynan qaysi qadam** vaqtni yeyayotganini ko'rsatadi. Odatda bu — **model chaqiruvi**, lekin ba'zan **kutilmagan joy** *(masalan hujjat yuklash yoki regex)*.
>
> ## 💡 **`orab()` METODI — ENG QULAY QISMI.** Siz zanjirni **odatdagidek** yozasiz, u esa **avtomatik** kuzatuv nuqtalarini qo'yadi.
>
> ## ⚠️ **`astream_events` DAN FARQI:** bu — **sinxron**, **oddiy**, va **hech qanday qo'shimcha paket** kerak emas *(3-dars)*.

---

# 🛡️ 2-loyiha. Ishonchli zanjir quruvchisi

> **Maqsad:** `retry` + `fallback` + `narx nazorati` + `jurnal` — **bir joyda**.

```python
class IshonchliZanjir:
    """Ishlab chiqarishga tayyor zanjir o'rovchisi."""

    def __init__(self, nom="zanjir", urinish=3, max_concurrency=5,
                 kunlik_limit=None):
        self.nom = nom
        self.urinish = urinish
        self.max_concurrency = max_concurrency
        self.kunlik_limit = kunlik_limit
        self.jurnal = []
        self.sarf = 0.0

    # ── qurish ──
    def qur(self, asosiy_qadamlar, zaxira_qadamlar=None):
        """asosiy_qadamlar: [prompt, chat, parser]"""
        asosiy = self._zanjir(asosiy_qadamlar, self.urinish)
        if zaxira_qadamlar:
            asosiy = asosiy.with_fallbacks([self._zanjir(zaxira_qadamlar, 2)])
        return asosiy.with_config({"max_concurrency": self.max_concurrency,
                                   "run_name": self.nom})

    @staticmethod
    def _zanjir(qadamlar, urinish):
        z = None
        for q in qadamlar:
            # model bo'lsa — retry qo'shamiz
            if hasattr(q, "with_retry") and "Chat" in type(q).__name__:
                q = q.with_retry(stop_after_attempt=urinish,
                                 wait_exponential_jitter=True)
            z = q if z is None else z | q
        return z

    # ── kuzatuv ──
    def kuzatuvchi(self, narx_1k=None):
        """Zanjirga qo'shiladigan qayd nuqtasi."""
        def f(r):
            u = getattr(r, "usage_metadata", None) or {}
            tok = u.get("total_tokens")
            narx = (tok / 1000 * narx_1k) if (tok and narx_1k) else 0.0
            self.sarf += narx
            yozuv = {"vaqt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                     "tokenlar": tok, "usd": round(narx, 6),
                     "sabab": getattr(r, "response_metadata", {}).get("finish_reason"),
                     "jami_usd": round(self.sarf, 6)}
            self.jurnal.append(yozuv)
            if yozuv["sabab"] == "length":
                print("⚠️ JAVOB KESILGAN")
            if self.kunlik_limit and self.sarf > self.kunlik_limit:
                raise RuntimeError(f"💥 KUNLIK LIMIT: ${self.sarf:.4f} "
                                   f"> ${self.kunlik_limit}")
            return r
        return RunnableLambda(f)

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print(f"\nchaqiruvlar: {len(d)}   jami: ${self.sarf:.6f}")
        kes = (d.sabab == "length").mean()
        if kes:
            print(f"💥 {kes:.0%} javob KESILGAN — max_tokens ni oshiring")
```

**Ishlatish (modelsiz — mexanizmni sinash):**

```python
iz = IshonchliZanjir("sinov", urinish=3)

sanoq = {"n": 0}
def notekis(x):
    sanoq["n"] += 1
    if sanoq["n"] < 3:
        raise ConnectionError("tarmoq xatosi")
    return f"ok (urinish {sanoq['n']})"

asosiy = RunnableLambda(notekis).with_retry(
    stop_after_attempt=3, wait_exponential_jitter=True)
zaxira = RunnableLambda(lambda x: "ZAXIRA javob")

z = asosiy.with_fallbacks([zaxira])
print("natija:", z.invoke(None))

# butunlay sinadigan zanjir
buzuq = RunnableLambda(lambda x: 1 / 0).with_retry(stop_after_attempt=2)
print("zaxira bilan:", buzuq.with_fallbacks([zaxira]).invoke(None))
```

**Ishlatish (model bilan):**

```python
from langchain_openai import ChatOpenAI

iz = IshonchliZanjir("bank_bot", kunlik_limit=1.0)
shablon = ChatPromptTemplate.from_messages([
    ("system", "Answer in Uzbek, at most 2 sentences."),
    ("human", "{savol}")])

z = (shablon
     | ChatOpenAI(model="gpt-4o-mini", temperature=0, max_tokens=120)
        .with_retry(stop_after_attempt=3, wait_exponential_jitter=True)
     | iz.kuzatuvchi(narx_1k=0.0006)           # ⭐ narx qaydi
     | StrOutputParser())

for q in ["Depozit nima?", "Karta qancha vaqtda tayyorlanadi?"]:
    print(f"\n❓ {q}\n➡️  {z.invoke({'savol': q})}")

print()
iz.hisobot()
```

> ## 🏆 **TO'RTTA HIMOYA BIR ZANJIRDA:**
> ```
> ① with_retry            →  tarmoq / rate limit xatolari
> ② with_fallbacks        →  model butunlay ishlamasa
> ③ max_concurrency       →  batch'da rate limit
> ④ kuzatuvchi + limit    →  ⭐ kutilmagan hisob KELMAYDI
> ```
>
> ## ⚠️ **`kuzatuvchi` NI PARSERDAN OLDIN QO'YING** — `StrOutputParser` `usage_metadata` ni **yo'qotadi** *(40-modul)*.

---

# 🔀 3-loyiha. Marshrutlovchi zanjir

> **Maqsad:** savol turiga qarab **turli zanjirga** yo'naltirish — arzon savolga arzon model.

```python
class Marshrutlovchi:
    """Kirishga qarab MOS zanjirni tanlaydi."""

    def __init__(self, standart, nom="marshrutlovchi"):
        self.standart = standart
        self.nom = nom
        self.yollar = []          # [(shart_fn, zanjir, nom), ...]
        self.jurnal = []

    def yol(self, nom, shart, zanjir):
        self.yollar.append((shart, zanjir, nom))
        return self

    def _tanla(self, kirish):
        for shart, z, nom in self.yollar:
            try:
                if shart(kirish):
                    return z, nom
            except Exception:
                continue
        return self.standart, "standart"

    def zanjir(self):
        def marshrut(kirish):
            z, nom = self._tanla(kirish)
            self.jurnal.append({"kirish": str(kirish)[:40], "yo'l": nom})
            return z
        return RunnableLambda(marshrut)

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print("\n=== YO'LLAR BO'YICHA ===")
        print(d["yo'l"].value_counts().to_string())
        st = (d["yo'l"] == "standart").mean()
        if st > 0.5:
            print(f"\n⚠️ {st:.0%} so'rov STANDART yo'lga tushdi — "
                  f"shartlarni qayta ko'ring")
```

**Ishlatish (modelsiz):**

```python
qisqa_z  = RunnableLambda(lambda d: f"[QISQA] {d['savol']}")
uzun_z   = RunnableLambda(lambda d: f"[UZUN] {len(d['savol'])} belgi")
raqam_z  = RunnableLambda(lambda d: f"[RAQAM] {re.findall(r'\d+', d['savol'])}")

m = (Marshrutlovchi(standart=qisqa_z)
     .yol("raqamli", lambda d: bool(re.search(r"\d", d["savol"])), raqam_z)
     .yol("uzun",    lambda d: len(d["savol"]) > 40, uzun_z))

z = m.zanjir()
for q in ["Salom",
          "Depozit foizi 18% mi yoki 22% mi?",
          "Bu juda uzun savol bo'lib, u qirq belgidan oshadi albatta"]:
    print(f"{q[:44]:46s} → {z.invoke({'savol': q})}")

print()
m.hisobot()
```

**Ishlatish (model bilan — narx tejash):**

```python
from langchain_openai import ChatOpenAI

arzon  = shablon | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()
kuchli = shablon | ChatOpenAI(model="gpt-4o")      | StrOutputParser()

MURAKKAB = ["tahlil", "solishtir", "hisobla", "nima uchun", "isbotla"]

m = (Marshrutlovchi(standart=arzon)
     .yol("kuchli",
          lambda d: any(k in d["savol"].lower() for k in MURAKKAB),
          kuchli))
```

> ## 🏆 **BU — HAQIQIY NARX TEJASH NAQSHI.**
>
> ```
> Oddiy savol   →  gpt-4o-mini   ($0.15/1M)
> Murakkab savol →  gpt-4o        ($2.50/1M)  ← 17× qimmat, lekin KAM uchraydi
> ```
>
> ## 💡 **AGAR SO'ROVLARNING 90% I ODDIY BO'LSA — TEJASH ~15×.**
>
> ## ⚠️ **`hisobot()` DAGI OGOHLANTIRISHGA E'TIBOR BERING:** agar ko'p so'rov **standart** yo'lga tushsa — shartlaringiz **ishlamayapti**.
>
> ## 🔑 **VA MAVJUD MUQOBIL:** marshrutlashni **model** ham qila oladi *(kichik model savolni tasniflaydi)* — lekin bu **qo'shimcha chaqiruv**. **O'lchang.**

---

# 📊 4-loyiha. Zanjir sinov to'plami

> **Maqsad:** zanjirlarni **model chaqirmasdan** sinash — **bepul**, **tez**, **CI'ga mos**.

```python
class ZanjirSinov:
    """Zanjirlarni MODELSIZ sinash — soxta model bilan."""

    def __init__(self):
        self.sinovlar = []

    # ── Soxta model ──
    @staticmethod
    def soxta_model(javob="soxta javob", tokenlar=42, sabab="stop",
                    xato=None, kechikish=0.0):
        """ChatOpenAI o'rniga qo'yiladigan Runnable."""
        class SoxtaAI:
            def __init__(self, c):
                self.content = c
                self.response_metadata = {"finish_reason": sabab}
                self.usage_metadata = {"total_tokens": tokenlar,
                                       "input_tokens": tokenlar // 2,
                                       "output_tokens": tokenlar // 2}

        def f(x):
            if kechikish:
                time.sleep(kechikish)
            if xato:
                raise xato
            matn = javob(x) if callable(javob) else javob
            return SoxtaAI(matn)
        return RunnableLambda(f)

    # ── sinovlar ──
    def sinov(self, nom, zanjir, kirish, tekshiruv):
        self.sinovlar.append((nom, zanjir, kirish, tekshiruv))
        return self

    def otkaz(self):
        q = []
        for nom, z, kirish, tekshir in self.sinovlar:
            t0 = time.perf_counter()
            try:
                r = z.invoke(kirish)
                ok, izoh = tekshir(r)
                xato = None
            except Exception as e:
                r, ok, izoh, xato = None, False, "istisno", type(e).__name__
            q.append({"sinov": nom, "ok": ok, "izoh": izoh, "xato": xato,
                      "soniya": round(time.perf_counter() - t0, 3),
                      "natija": str(r)[:36]})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        print(f"\n{int(d.ok.sum())}/{len(d)} sinov o'tdi")
        if not d.ok.all():
            print("\n❌ O'TMAGANLAR:")
            print(d[~d.ok][["sinov", "izoh", "xato"]].to_string(index=False))
        return d
```

**Ishlatish:**

```python
shablon = ChatPromptTemplate.from_messages([
    ("system", "Answer in Uzbek."), ("human", "{savol}")])

# ① Oddiy zanjir
z_oddiy = shablon | ZanjirSinov.soxta_model("Depozit — bankdagi omonat.") \
          | StrOutputParser()

# ② Kesilgan javob
z_kesilgan = shablon | ZanjirSinov.soxta_model("Yarim jav", sabab="length") \
             | StrOutputParser()

# ③ Xato + zaxira
z_zaxira = (shablon
            | ZanjirSinov.soxta_model(xato=ConnectionError("tarmoq"))
              .with_fallbacks([ZanjirSinov.soxta_model("ZAXIRA javob")])
            | StrOutputParser())

# ④ Kesilganni USHLAYDIGAN zanjir
def kesilgan_tekshir(r):
    if r.response_metadata.get("finish_reason") == "length":
        raise ValueError("Javob kesilgan")
    return r

z_himoyalangan = (shablon | ZanjirSinov.soxta_model("Yarim jav", sabab="length")
                  | RunnableLambda(kesilgan_tekshir) | StrOutputParser())

(ZanjirSinov()
 .sinov("oddiy javob", z_oddiy, {"savol": "Depozit nima?"},
        lambda r: ("Depozit" in r, "matn to'g'ri"))
 .sinov("kesilgan (ushlanmagan)", z_kesilgan, {"savol": "x"},
        lambda r: (len(r) > 50, "javob to'liq bo'lishi kerak edi"))
 .sinov("zaxira ishladi", z_zaxira, {"savol": "x"},
        lambda r: ("ZAXIRA" in r, "fallback"))
 .sinov("kesilgan USHLANDI", z_himoyalangan, {"savol": "x"},
        lambda r: (False, "istisno kutilgan edi"))
 .otkaz())
```

> ## 🏆 **`soxta_model` — LOYIHANING YURAGI.**
>
> ```
> ✅ BEPUL          →  API chaqiruvi yo'q
> ✅ TEZ            →  millisekundlar
> ✅ TAKRORLANUVCHI →  javob DOIM bir xil
> ✅ Xato SIMULYATSIYASI  →  tarmoq xatosi, kesilgan javob, rad etish
> ```
>
> ## 💡 **BU — CI/CD UCHUN.** Har commit'da zanjirlaringiz **avtomatik** sinaladi — **pul sarflamasdan**.
>
> ## ⚠️ **NIMANI SINAMAYDI:** modelning **javob sifatini**. U uchun **oltin to'plam** kerak *(34-modul)* va **haqiqiy** model chaqiruvi.
>
> ## 🔑 **IKKALASI HAM KERAK:**
> ```
> Soxta model  →  ZANJIR MANTIG'I to'g'rimi?     (har commit'da)
> Oltin to'plam →  MODEL SIFATI to'g'rimi?        (haftada bir marta)
> ```

---

## 🎯 Loyihalarni birlashtirish

```
4-loyiha (sinov)        →  zanjir MANTIG'I to'g'rimi?  (bepul, CI'da)
        ↓
1-loyiha (profiler)     →  qaysi qadam SEKIN?
        ↓
3-loyiha (marshrutlovchi) →  arzon savolga ARZON model
        ↓
2-loyiha (ishonchli)    →  ⭐ retry + fallback + narx limiti
```

> ## 🚀 **42-MODULDA (RAG) BU NAQSHLAR RETRIEVER BILAN BIRLASHADI.**

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
