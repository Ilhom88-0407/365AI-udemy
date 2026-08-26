# 🚀 48-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham API kalitisiz.**

## ⚙️ Umumiy tayyorgarlik

```bash
pip install sentence-transformers chromadb pandas numpy
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, shutil, json
from pathlib import Path
import numpy as np, pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb

KURSLAR = "../51-Semantic-Search-Case-Study/course_descriptions.csv"
BOLIMLAR = "../51-Semantic-Search-Case-Study/course_section_descriptions.csv"


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
```

---

# 🔬 1-loyiha. Vektor yechimi tanlovchisi

> **Maqsad:** *"Menga vektor bazasi kerakmi? Qaysi biri?"* — bu savolga **o'lchov bilan** javob berish.

```python
class VektorYechimTanlovchi:
    """Ma'lumot va talablar asosida TO'G'RI yechimni tavsiya qiladi
    va uni HAQIQATDA sinab ko'radi."""

    def __init__(self, matnlar, metadata=None, model_nomi="all-MiniLM-L6-v2"):
        self.matnlar = list(matnlar)
        self.metadata = metadata
        self.model_nomi = model_nomi
        self.model = None
        self.E = None
        self.natijalar = {}

    # ══════ ① MODELNI TAYYORLASH ══════
    def tayyorla(self):
        t0 = time.perf_counter()
        self.model = SentenceTransformer(self.model_nomi)
        yuk = time.perf_counter() - t0

        v = self.model.encode("test")
        norma = float(np.linalg.norm(v))
        self.natijalar["model"] = {
            "nom": self.model_nomi, "o'lcham": len(v),
            "norma": round(norma, 4),
            "normallashgan": abs(norma - 1) < 0.01,
            "maks_token": getattr(self.model, "max_seq_length", "?"),
            "yuklash_s": round(yuk, 1)}

        t0 = time.perf_counter()
        self.E = self.model.encode(self.matnlar, show_progress_bar=False,
                                   batch_size=64)
        emb_s = time.perf_counter() - t0
        self.E = self.E / np.linalg.norm(self.E, axis=1, keepdims=True)

        self.natijalar["embedding"] = {
            "yozuvlar": len(self.matnlar),
            "soniya": round(emb_s, 1),
            "tezlik": round(len(self.matnlar) / emb_s, 0),
            "1M_uchun_soat": round(1_000_000 / (len(self.matnlar) / emb_s)
                                   / 3600, 1)}

        # ⭐ matn uzunligi va kontekst oynasi
        uz = [len(m) for m in self.matnlar]
        maks_tok = self.natijalar["model"]["maks_token"]
        if isinstance(maks_tok, int):
            oshgan = sum(1 for x in uz if x / 4 > maks_tok)
            self.natijalar["matn"] = {
                "min_belgi": min(uz), "maks_belgi": max(uz),
                "ort_belgi": int(np.mean(uz)),
                "ort_token": int(np.mean(uz) / 4),
                "chegaradan_oshgan": oshgan,
                "oshgan_%": round(oshgan / len(uz) * 100, 1)}
        return self

    # ══════ ② TARQALISHNI TEKSHIRISH ══════
    def tarqalish(self):
        n = min(500, len(self.E))
        M = self.E[:n] @ self.E[:n].T
        np.fill_diagonal(M, np.nan)

        rng = np.random.default_rng(365)
        R = rng.normal(size=(n, self.E.shape[1]))
        R /= np.linalg.norm(R, axis=1, keepdims=True)
        MR = R @ R.T
        np.fill_diagonal(MR, np.nan)

        self.natijalar["tarqalish"] = {
            "haqiqiy_ort": round(float(np.nanmean(M)), 4),
            "haqiqiy_std": round(float(np.nanstd(M)), 4),
            "haqiqiy_maks": round(float(np.nanmax(M)), 4),
            "tasodifiy_std": round(float(np.nanstd(MR)), 4),
            "nisbat": round(float(np.nanstd(M) / np.nanstd(MR)), 2)}
        return self

    # ══════ ③ TEZLIKNI O'LCHASH ══════
    def tezlik(self, k=10):
        q = self.E[0]

        t0 = time.perf_counter()
        for _ in range(20):
            top_bf = np.argsort(-(self.E @ q))[:k]
        bf = (time.perf_counter() - t0) / 20 * 1000

        shutil.rmtree("./tanlov-db", ignore_errors=True)
        c = chromadb.PersistentClient(path="./tanlov-db")
        coll = c.create_collection("tanlov-coll",
                                   metadata={"hnsw:space": "cosine"})
        t0 = time.perf_counter()
        for i in range(0, len(self.E), 5000):
            coll.add(ids=[str(x) for x in
                          range(i, min(i + 5000, len(self.E)))],
                     embeddings=self.E[i:i + 5000].tolist())
        idx_s = time.perf_counter() - t0

        t0 = time.perf_counter()
        for _ in range(20):
            r = coll.query(query_embeddings=[q.tolist()], n_results=k)
        hn = (time.perf_counter() - t0) / 20 * 1000
        mos = len(set(top_bf.tolist()) & {int(x) for x in r["ids"][0]})

        self.natijalar["tezlik"] = {
            "brute_ms": round(bf, 2), "hnsw_ms": round(hn, 2),
            "tezlanish": round(bf / max(hn, 1e-9), 1),
            "indekslash_s": round(idx_s, 1),
            "aniqlik": f"{mos}/{k}", "aniqlik_%": round(mos / k * 100)}
        return self

    # ══════ ④ HAJM BASHORATI ══════
    def hajm(self):
        o = self.E.shape[1]
        q = {}
        for n in (len(self.E), 100_000, 1_000_000, 10_000_000):
            q[f"{n:,}"] = {
                "f32_GB": round(n * o * 4 / 1024**3, 3),
                "f16_GB": round(n * o * 2 / 1024**3, 3),
                "int8_GB": round(n * o * 1 / 1024**3, 3)}
        self.natijalar["hajm"] = q
        return self

    # ══════ HISOBOT VA TAVSIYA ══════
    def hisobot(self, maxfiylik=False, tez_ozgaradi=False,
                kelajakdagi_hajm=None):
        n = self.natijalar

        print("═" * 62)
        print("📊 MODEL")
        for k, v in n["model"].items():
            print(f"   {k:16s} {v}")
        if not n["model"]["normallashgan"]:
            print("   💥 NORMALLASHMAGAN — np.dot ≠ kosinus, normaga BO'LING")

        print("\n📝 MATN")
        for k, v in n.get("matn", {}).items():
            print(f"   {k:20s} {v}")
        if n.get("matn", {}).get("oshgan_%", 0) > 20:
            print(f"   💥 matnlarning {n['matn']['oshgan_%']}% qismi "
                  f"kontekst oynasidan OSHADI → oxirgi qismi TASHLANADI")
            print("      ✅ eng muhim matnni OLDINGA qo'ying yoki BO'LAKLANG")

        print("\n⚡ EMBEDDING")
        for k, v in n["embedding"].items():
            print(f"   {k:16s} {v}")

        print("\n📐 TARQALISH")
        t = n["tarqalish"]
        for k, v in t.items():
            print(f"   {k:16s} {v}")
        if t["nisbat"] < 1.5:
            print("   💥 haqiqiy va tasodifiy tarqalish YAQIN — "
                  "MODEL SIZNING MA'LUMOTINGIZNI TUSHUNMAYAPTI")
        else:
            print(f"   ✅ haqiqiy tarqalish tasodifiydan {t['nisbat']}× keng "
                  f"— model ISHLAYAPTI")

        print("\n🏁 TEZLIK")
        for k, v in n["tezlik"].items():
            print(f"   {k:16s} {v}")

        print("\n💾 HAJM (f32 / f16 / int8, GB)")
        for k, v in n["hajm"].items():
            print(f"   {k:>14s}  {v['f32_GB']:8.3f} / "
                  f"{v['f16_GB']:8.3f} / {v['int8_GB']:8.3f}")

        # ══════ TAVSIYA ══════
        print("\n" + "═" * 62)
        print("🎯 TAVSIYA")
        N = kelajakdagi_hajm or len(self.E)
        if N < 1_000:
            print(f"   ⭐ numpy (E @ q) — {N:,} yozuv uchun vektor DB ORTIQCHA")
            print(f"      brute force {n['tezlik']['brute_ms']} ms · "
                  f"100% ANIQ · hech qanday bog'liqlik yo'q")
        elif N < 1_000_000:
            if maxfiylik:
                print(f"   ⭐ Chroma / FAISS (MAHALLIY) — {N:,} yozuv")
                print("      🔒 maxfiylik talab qilinadi → bulut YARAMAYDI")
            else:
                print(f"   ⭐ Chroma / FAISS — {N:,} yozuv")
            print(f"      indekslash {n['tezlik']['indekslash_s']} s · "
                  f"qidiruv {n['tezlik']['hnsw_ms']} ms")
        else:
            print(f"   ⭐ Qdrant / Milvus"
                  + ("" if maxfiylik else " / Pinecone") + f" — {N:,} yozuv")
            gb = N * self.E.shape[1] * 4 / 1024**3
            if gb > 8:
                print(f"      ⚠️ {gb:.1f} GB — kvantlash (int8) yoki "
                      f"diskli indeks kerak")

        if n["tezlik"]["tezlanish"] < 3:
            print(f"\n   ⚠️ HNSW atigi {n['tezlik']['tezlanish']}× tez — "
                  f"bu hajmda brute force ham YETARLI")
        if n["tezlik"]["aniqlik_%"] < 90:
            print(f"   ⚠️ HNSW aniqligi {n['tezlik']['aniqlik_%']}% — "
                  f"100% kerak bo'lsa brute force ishlating")
        if tez_ozgaradi:
            soat = n["embedding"]["1M_uchun_soat"]
            print(f"\n   💰 ma'lumot tez o'zgaradi → qayta embedding "
                  f"({soat} soat / 1M yozuv)")
            print("      ✅ faqat O'ZGARGAN yozuvlarni qayta embedding qiling")
        return n

    def json_saqla(self, yol="tanlov.json"):
        Path(yol).write_text(json.dumps(self.natijalar, ensure_ascii=False,
                                        indent=1, default=str),
                             encoding="utf-8")
        print(f"\n💾 {yol}")


# ─── ishlatish: 365 ma'lumoti ───
b = pd.read_csv(BOLIMLAR, encoding="cp1252")
matnlar = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1).tolist()

vt = (VektorYechimTanlovchi(matnlar)
      .tayyorla()
      .tarqalish()
      .tezlik()
      .hajm())
vt.hisobot(maxfiylik=False, tez_ozgaradi=False)
vt.json_saqla()

# ─── 🇺🇿 maxfiylik talab qiladigan stsenariy ───
print("\n\n═══ 🏦 BANK STSENARIYSI (maxfiylik + o'sish) ═══")
vt.hisobot(maxfiylik=True, tez_ozgaradi=True, kelajakdagi_hajm=500_000)
```

> ## 🏆 **TO'RTTA O'LCHOV — TO'RTTA QAROR:**
> ```
> 📝 MATN       →  kontekst oynasidan oshadimi? (jim ma'lumot yo'qolishi)
> 📐 TARQALISH  →  ⭐ model ma'lumotni TUSHUNADIMI?
> 🏁 TEZLIK     →  HNSW kerakmi yoki numpy yetadimi?
> 💾 HAJM       →  RAMga sig'adimi? kvantlash kerakmi?
> ```
>
> ## 💥 **ENG MUHIM O'LCHOV — `TARQALISH.nisbat`:**
> ```
> nisbat > 1.5  →  ✅ model ma'lumotni tushunadi
> nisbat ≈ 1.0  →  💥 embeddinglar TASODIFIY vektorlardan farq qilmaydi
>                  →  model YARAMAYDI, boshqasini tanlang
> ```

---

# 📊 2-loyiha. Vektor infratuzilma kalkulyatori

> **Maqsad:** loyihani boshlashdan **oldin** narx, vaqt va resursni **hisoblash**.

```python
class InfraKalkulyator:
    """Vektor qidiruv tizimining NARXI, VAQTI va RESURSINI hisoblaydi."""

    # $/1M token (embedding)
    EMBEDDING_NARX = {
        "mahalliy (sentence-transformers)": 0.0,
        "text-embedding-3-small": 0.02,
        "text-embedding-3-large": 0.13,
    }
    # $/oy (vektor DB)
    DB_NARX = {
        "numpy (RAM)": 0.0,
        "Chroma (o'z server)": 0.0,        # server narxi alohida
        "Qdrant Cloud (1M vektor)": 60.0,
        "Pinecone Serverless (1M)": 70.0,
    }
    TIL_KOEF = {"en": 1.00, "uz": 1.88, "ru": 1.75}

    def __init__(self, yozuvlar, ort_belgi, olcham=384, til="uz",
                 kunlik_sorov=1000, yillik_osish=2.0,
                 embedding_tezligi=113):
        self.n = yozuvlar
        self.belgi = ort_belgi
        self.o = olcham
        self.til = til
        self.koef = self.TIL_KOEF[til]
        self.sorov = kunlik_sorov
        self.osish = yillik_osish
        self.tezlik = embedding_tezligi

    # ── token hisobi ──
    def tokenlar(self):
        # taxminan 4 belgi = 1 token (inglizcha), 🇺🇿 uchun koef
        return self.n * (self.belgi / 4) * self.koef

    # ── ① dastlabki indekslash ──
    def dastlabki(self):
        tok = self.tokenlar()
        print(f"📥 DASTLABKI INDEKSLASH ({self.n:,} yozuv, "
              f"{self.belgi} belgi, 🌐 {self.til})")
        print(f"   jami tokenlar: {tok/1e6:.2f}M")
        print(f"   mahalliy vaqt: {self.n/self.tezlik/3600:.2f} soat "
              f"(CPU, {self.tezlik}/s)")
        q = []
        for nom, narx in self.EMBEDDING_NARX.items():
            q.append({"usul": nom[:34], "narx_$": round(tok / 1e6 * narx, 2)})
        print(pd.DataFrame(q).to_string(index=False))
        return tok

    # ── ② so'rovlar narxi ──
    def sorovlar(self):
        # har so'rov ~15 token
        yillik_tok = self.sorov * 365 * 15 * self.koef
        print(f"\n🔍 SO'ROVLAR ({self.sorov:,}/kun)")
        print(f"   yillik tokenlar: {yillik_tok/1e6:.2f}M")
        q = []
        for nom, narx in self.EMBEDDING_NARX.items():
            q.append({"usul": nom[:34],
                      "yillik_$": round(yillik_tok / 1e6 * narx, 2)})
        print(pd.DataFrame(q).to_string(index=False))

    # ── ③ saqlash ──
    def saqlash(self):
        print(f"\n💾 SAQLASH ({self.o} o'lcham)")
        q = []
        for yil in (0, 1, 3, 5):
            n = self.n * (self.osish ** yil)
            q.append({"yil": yil, "yozuvlar": f"{int(n):,}",
                      "f32_GB": round(n * self.o * 4 / 1024**3, 2),
                      "int8_GB": round(n * self.o / 1024**3, 2)})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        if d.f32_GB.iloc[-1] > 16:
            print(f"   💥 5-yilda {d.f32_GB.iloc[-1]:.1f} GB — "
                  f"kvantlash yoki diskli indeks SHART")
        elif d.f32_GB.iloc[-1] > 4:
            print(f"   ⚠️ 5-yilda {d.f32_GB.iloc[-1]:.1f} GB — "
                  f"RAM rejalashtirilsin")

    # ── ④ DB narxi ──
    def db_narxi(self):
        print("\n🗄️ VEKTOR DB (oylik)")
        q = []
        for nom, narx in self.DB_NARX.items():
            # 1M vektorga nisbatan miqyoslaymiz
            oylik = narx * max(1, self.n / 1_000_000)
            q.append({"yechim": nom[:30], "oylik_$": round(oylik, 2),
                      "yillik_$": round(oylik * 12, 2)})
        print(pd.DataFrame(q).to_string(index=False))
        print("   💡 'o'z server' variantida server narxi ALOHIDA "
              "(~$20–200/oy)")

    # ── ⑤ qayta indekslash ──
    def qayta_indekslash(self, marta_yiliga=2):
        tok = self.tokenlar()
        print(f"\n🔄 QAYTA INDEKSLASH (yiliga {marta_yiliga} marta)")
        print("   sabab: embedding modeli yangilandi / matn o'zgardi")
        print(f"   vaqt : {self.n/self.tezlik/3600*marta_yiliga:.2f} soat/yil")
        for nom, narx in self.EMBEDDING_NARX.items():
            if narx:
                print(f"   {nom[:34]:34s} "
                      f"${tok/1e6*narx*marta_yiliga:.2f}/yil")

    def toliq(self):
        print("═" * 62)
        self.dastlabki()
        self.sorovlar()
        self.saqlash()
        self.db_narxi()
        self.qayta_indekslash()
        print("\n" + "═" * 62)
        print("🏆 XULOSA")
        if self.n < 100_000:
            print("   ⭐ MAHALLIY yechim: sentence-transformers + Chroma")
            print("      narx ≈ $0 (faqat server)")
        else:
            print("   ⭐ Mahalliy embedding + Qdrant/Milvus")
            print("      💰 API embedding bu hajmda QIMMAT")
        if self.til != "en":
            print(f"   🌐 {self.til} tili koeffitsienti {self.koef}× — "
                  f"narx shuncha yuqori")
        print("   💡 ENG KATTA TEJASH: mahalliy embedding (API o'rniga)")


print("═══ 🎓 365 KURSLARI (kichik loyiha) ═══")
InfraKalkulyator(yozuvlar=680, ort_belgi=1255, til="en",
                 kunlik_sorov=1000).toliq()

print("\n\n═══ 🏦 🇺🇿 BANK BILIM BAZASI (o'rta loyiha) ═══")
InfraKalkulyator(yozuvlar=500_000, ort_belgi=800, til="uz",
                 kunlik_sorov=50_000, yillik_osish=1.5).toliq()
```

> ## 🏆 **BESH HISOB — BESH QAROR:**
> ```
> 📥 dastlabki indekslash  →  bir martalik vaqt va narx
> 🔍 so'rovlar             →  ⭐ yillik takrorlanuvchi narx
> 💾 saqlash               →  5 yilga RAM rejasi
> 🗄️ DB narxi              →  bulut yoki o'z serveri
> 🔄 qayta indekslash      →  💥 ko'pincha UNUTILADI
> ```
>
> ## 💥 **⑤ — ENG KO'P UNUTILADIGAN XARAJAT.** Embedding modeli **yangilanadi**, matnlar **o'zgaradi** — va **hammasi qaytadan** indekslanadi.
>
> ## 🇺🇿 **VA `TIL_KOEF` — O'ZBEKCHA LOYIHALARDA 1.88× QIMMAT** *(36-modulda o'lchangan)*.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🔬 **Yechim tanlovchi** | *"Vektor DB kerakmi?"* | ## ⭐ `tarqalish.nisbat` |
| 2 | 📊 **Infra kalkulyator** | Narx va resurs rejasi | ## 🇺🇿 **1.88× koef** · qayta indekslash |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
