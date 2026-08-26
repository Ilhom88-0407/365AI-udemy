# 🚀 42-modul mini-loyihalari

> **5 ta tayyor loyiha.** ## ⭐ **Indekslash va qidiruv — to'liq API kalitisiz.** Faqat 5-loyihaning generatsiya qismi model talab qiladi *(mahalliy model ham bo'ladi)*.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langchain langchain-core langchain-community langchain-chroma
pip install langchain-huggingface sentence-transformers
pip install pypdf docx2txt tiktoken pandas
# generatsiya uchun (ixtiyoriy):
pip install transformers torch          # mahalliy model
# yoki: pip install langchain-openai python-dotenv
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, copy, shutil, hashlib, json, re
from pathlib import Path
from collections import Counter, defaultdict
import numpy as np, pandas as pd, tiktoken

from langchain_community.document_loaders import (PyPDFLoader, Docx2txtLoader,
                                                  TextLoader)
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_text_splitters.markdown import MarkdownHeaderTextSplitter
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import (RunnableLambda, RunnablePassthrough,
                                      RunnableParallel)
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

EMBEDDING_NOMI = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
embedding = HuggingFaceEmbeddings(model_name=EMBEDDING_NOMI)
ENC = tiktoken.get_encoding("cl100k_base")
```

---

# 📚 1-loyiha. Hujjat indekslovchi quvur

> **Maqsad:** papkadagi **hamma hujjatni** yuklab, bo'laklab, indekslash — **xatosiz, dublikatsiz, tekshirilgan**.

```python
class IndekslashQuvuri:
    """Yuklash → tozalash → bo'laklash → barqaror ID → Chroma → TASHXIS."""

    YUKLOVCHILAR = {".pdf": PyPDFLoader, ".docx": Docx2txtLoader,
                    ".txt": TextLoader, ".md": TextLoader}

    def __init__(self, embedding, yol="./index-db", chunk=500, overlap=50,
                 embedding_nomi=EMBEDDING_NOMI):
        self.embedding = embedding
        self.embedding_nomi = embedding_nomi
        self.yol = yol
        self.bolakchi = RecursiveCharacterTextSplitter(
            chunk_size=chunk, chunk_overlap=overlap)
        self.chunk = chunk
        self.xatolar = []
        self.statistika = {}

    # ───── ① YUKLASH ─────
    def _yukla_fayl(self, p: Path):
        L = self.YUKLOVCHILAR.get(p.suffix.lower())
        if L is None:
            raise ValueError(f"qo'llab-quvvatlanmaydi: {p.suffix}")
        d = L(str(p)).load()
        for x in d:
            x.page_content = " ".join(x.page_content.split())
            x.metadata["source"] = str(p)
            x.metadata["fayl"] = p.name
            x.metadata["fayl_turi"] = p.suffix.lower()
        return d

    def yukla(self, papka, naqsh="*"):
        hujjatlar = []
        for f in sorted(Path(papka).rglob(naqsh)):
            if not f.is_file() or f.suffix.lower() not in self.YUKLOVCHILAR:
                continue
            try:
                d = self._yukla_fayl(f)
                bosh = sum(1 for x in d if len(x.page_content.strip()) < 50)
                hujjatlar.extend(d)
                belgi = f"  ⚠️ {bosh} bo'sh sahifa" if bosh else ""
                print(f"  ✅ {f.name:44s} {len(d):3d} hujjat{belgi}")
            except Exception as e:
                self.xatolar.append((f.name, type(e).__name__, str(e)[:70]))
                print(f"  ❌ {f.name:44s} {type(e).__name__}")
        return hujjatlar

    # ───── ② BO'LAKLASH ─────
    def bolakla(self, hujjatlar):
        b = self.bolakchi.split_documents(hujjatlar)
        uz = [len(x.page_content) for x in b]
        self.statistika["bolak"] = len(b)
        self.statistika["min"] = min(uz) if uz else 0
        self.statistika["max"] = max(uz) if uz else 0
        self.statistika["ortacha"] = sum(uz) // len(uz) if uz else 0

        oshgan = sum(1 for x in uz if x > self.chunk)
        qisqa = sum(1 for x in uz if x < self.chunk * 0.2)
        if oshgan:
            print(f"💥 {oshgan} bo'lak {self.chunk} dan OSHGAN "
                  f"(eng kattasi {max(uz)})")
        if qisqa:
            print(f"⚠️ {qisqa} bo'lak JUDA QISQA (<{int(self.chunk*0.2)}) — shovqin")
        return b

    # ───── ③ BARQAROR ID ─────
    @staticmethod
    def _id(d):
        kalit = f"{d.metadata.get('source','')}|{d.page_content}"
        return hashlib.sha256(kalit.encode("utf-8")).hexdigest()[:32]

    # ───── ④ INDEKSLASH ─────
    def indeksla(self, bolaklar, batch=500):
        ids = [self._id(d) for d in bolaklar]
        dub = len(ids) - len(set(ids))
        if dub:
            print(f"⚠️ {dub} DUBLIKAT bo'lak — barqaror ID birlashtiradi")
        self.statistika["dublikat"] = dub

        vs = Chroma(persist_directory=self.yol, embedding_function=self.embedding)
        t0 = time.perf_counter()
        for i in range(0, len(bolaklar), batch):
            vs.add_documents(bolaklar[i:i + batch], ids=ids[i:i + batch])
            print(f"  {min(i+batch, len(bolaklar))}/{len(bolaklar)}  "
                  f"({time.perf_counter()-t0:.0f}s)")
        self.statistika["indekslash_s"] = round(time.perf_counter() - t0, 1)

        # embedding modelini QAYD QILAMIZ — 12-darsdagi tuzoq
        Path(self.yol).mkdir(parents=True, exist_ok=True)
        (Path(self.yol) / "embedding.json").write_text(
            json.dumps({"model": self.embedding_nomi,
                        "olcham": len(self.embedding.embed_query("x"))},
                       ensure_ascii=False), encoding="utf-8")
        return vs

    # ───── ⑤ TO'LIQ QUVUR ─────
    def ishga_tushir(self, papka, naqsh="*"):
        print("① YUKLASH")
        h = self.yukla(papka, naqsh)
        if not h:
            print("💥 hech narsa yuklanmadi")
            return None
        print(f"\n② BO'LAKLASH  ({len(h)} hujjat)")
        b = self.bolakla(h)
        print(f"\n③ INDEKSLASH  ({len(b)} bo'lak)")
        vs = self.indeksla(b)
        print("\n④ HISOBOT")
        self.hisobot(vs)
        return vs

    def hisobot(self, vs):
        d = vs.get()
        print(f"  bazadagi hujjatlar : {len(d['documents'])}")
        for k, v in self.statistika.items():
            print(f"  {k:20s}: {v}")
        c = Counter(m.get("fayl", "?") for m in d["metadatas"])
        print("  fayl bo'yicha:")
        for k, v in c.most_common(8):
            print(f"    {v:4d}  {k[:48]}")
        if self.xatolar:
            print(f"\n  ⚠️ {len(self.xatolar)} fayl YUKLANMADI:")
            for f, t, m in self.xatolar:
                print(f"    {f}: {t} — {m}")


# ─── ishlatish ───
# quvur = IndekslashQuvuri(embedding, yol="./hujjatlar-db")
# vs = quvur.ishga_tushir("./hujjatlarim")
```

> ## 🏆 **NIMA UCHUN BU LOYIHA MUHIM?**
> ```
> ✅ Bitta buzuq fayl BUTUN indekslashni to'xtatmaydi
> ✅ Barqaror ID  →  qayta ishga tushirsangiz DUBLIKAT bo'lmaydi
> ✅ embedding.json →  12-darsdagi "jim ma'nosiz natijalar" tuzog'i yo'q
> ✅ Tashxis      →  oshgan/qisqa/bo'sh bo'laklar DARHOL ko'rinadi
> ```

---

# 🎯 2-loyiha. Retriever sozlagichi

> **Maqsad:** `k`, `λ`, `chunk_size` va **chegara** ni **taxmin qilmasdan**, **o'lchab** tanlash.

```python
class RetrieverSozlagich:
    """Sinov savollari asosida eng yaxshi sozlamani TOPADI."""

    def __init__(self, embedding, hujjatlar, sinovlar,
                 chunk_lar=(300, 500, 800), k_lar=(2, 3, 5),
                 lambda_lar=(0.5, 0.7, 1.0)):
        """sinovlar = [(savol, kutilgan_matn_parchasi | None), ...]
        None → bu savolga javob YO'Q (chegara sinovi)"""
        self.embedding = embedding
        self.hujjatlar = hujjatlar
        self.sinovlar = sinovlar
        self.chunk_lar, self.k_lar, self.lambda_lar = chunk_lar, k_lar, lambda_lar
        self.natijalar = []

    def _baza(self, chunk):
        yol = f"./sozlash-{chunk}"
        shutil.rmtree(yol, ignore_errors=True)
        b = RecursiveCharacterTextSplitter(
            chunk_size=chunk, chunk_overlap=int(chunk * 0.1)
        ).split_documents(self.hujjatlar)
        vs = Chroma.from_documents(b, self.embedding, persist_directory=yol,
                                   collection_metadata={"hnsw:space": "cosine"})
        return vs, len(b)

    @staticmethod
    def _topdimi(docs, kutilgan):
        """Kutilgan parcha topilgan bo'laklardan BIRIDA bormi?"""
        n = " ".join(d.page_content.lower() for d in docs)
        return kutilgan.lower() in n

    def ishga_tushir(self):
        for chunk in self.chunk_lar:
            vs, nb = self._baza(chunk)
            print(f"\n═══ chunk={chunk} ({nb} bo'lak)")
            for k in self.k_lar:
                for lam in self.lambda_lar:
                    r = vs.as_retriever(
                        search_type="mmr",
                        search_kwargs={"k": k, "lambda_mult": lam})
                    togri, ballar_bor, ballar_yoq, jami_token = 0, [], [], 0
                    javobli = 0
                    for savol, kutilgan in self.sinovlar:
                        t0 = time.perf_counter()
                        docs = r.invoke(savol)
                        jami_token += sum(
                            len(ENC.encode(d.page_content)) for d in docs)
                        eng = vs.similarity_search_with_relevance_scores(
                            savol, k=1)
                        ball = eng[0][1] if eng else 0.0
                        if kutilgan is None:
                            ballar_yoq.append(ball)
                        else:
                            javobli += 1
                            ballar_bor.append(ball)
                            if self._topdimi(docs, kutilgan):
                                togri += 1
                    self.natijalar.append({
                        "chunk": chunk, "k": k, "lambda": lam,
                        "bolak": nb,
                        "aniqlik": round(togri / max(1, javobli), 3),
                        "ball_bor": round(np.mean(ballar_bor), 4)
                                    if ballar_bor else None,
                        "ball_yoq": round(np.mean(ballar_yoq), 4)
                                    if ballar_yoq else None,
                        "token": jami_token // len(self.sinovlar)})
        return self.hisobot()

    def hisobot(self):
        d = pd.DataFrame(self.natijalar)
        if d.empty:
            print("natija yo'q")
            return d
        # oraliq = javobi bor va yo'q savollar ballari farqi
        if d.ball_bor.notna().any() and d.ball_yoq.notna().any():
            d["oraliq"] = (d.ball_bor - d.ball_yoq).round(4)
        print(d.to_string(index=False))

        eng = d.sort_values(["aniqlik", "token"], ascending=[False, True]).iloc[0]
        print(f"\n🏆 ENG YAXSHI: chunk={eng.chunk} k={eng.k} "
              f"lambda={eng['lambda']}")
        print(f"   aniqlik {eng.aniqlik} · {eng.token} token/so'rov")
        if "oraliq" in d and eng.get("oraliq", 0) and eng["oraliq"] > 0:
            print(f"   🛡️ tavsiya etilgan chegara ≈ "
                  f"{(eng.ball_bor + eng.ball_yoq)/2:.4f}")

        # ⚠️ ogohlantirishlar
        if d.aniqlik.max() < 0.8:
            print("\n⚠️ ENG YAXSHI ANIQLIK 0.8 DAN PAST:")
            print("   → embedding modelini almashtiring (M7, 11-dars)")
            print("   → yoki hujjatlarda javob umuman yo'qmi, tekshiring")
        if "oraliq" in d and d.oraliq.max() <= 0:
            print("\n💥 ORALIQ YO'Q — javobi bor va yo'q savollar BIR XIL ball "
                  "olmoqda. Chegara HIMOYA QILA OLMAYDI.")
        return d


# ─── ishlatish ───
# SINOVLAR = [
#     ("What programming languages do data scientists use?", "Python"),
#     ("What software is used for big data?",                "Hadoop"),
#     ("What is the weather in Tashkent?",                   None),   # javob YO'Q
#     ("How do I cook pasta?",                               None),   # javob YO'Q
# ]
# s = RetrieverSozlagich(embedding, hujjatlar, SINOVLAR)
# s.ishga_tushir()
```

> ## 🏆 **BU LOYIHA UCHTA QARORNI BIR VAQTDA HAL QILADI:** `chunk_size` · `k` · `λ` — va **chegarani ham** taklif qiladi.
>
> ## 💥 **`oraliq ≤ 0` OGOHLANTIRISHI — ENG MUHIM SIGNAL.** Agar javobi bor va yo'q savollar **bir xil ball** olsa, **hech qanday chegara** yordam bermaydi — **embedding modelini** almashtirish kerak.

---

# 🛡️ 3-loyiha. Yolg'on to'qishga qarshi qalqon

> **Maqsad:** 18-darsdagi **"qualitative analytics"** to'qimasini **takrorlab ko'rsatish** va **to'xtatish**.

```python
class Qalqon:
    """Uch qavatli himoya: chegara · qattiq prompt · javobni TEKSHIRISH."""

    RAD = "Hujjatlarimda bu savolga javob topilmadi."

    QATTIQ = """Use ONLY the context below to answer the question.

RULES:
- If the context does not contain the answer, reply EXACTLY:
  "I don't know based on the provided documents."
- Do NOT use outside knowledge.
- Cite the source number in brackets, e.g. [1].

Context:
{context}

Question: {question}
Answer:"""

    def __init__(self, vs, llm=None, min_ball=0.3, k=3, qoplama_chegara=0.25):
        self.vs, self.llm = vs, llm
        self.min_ball, self.k = min_ball, k
        self.qoplama_chegara = qoplama_chegara
        self.pt = PromptTemplate.from_template(self.QATTIQ)
        self.jurnal = []

    # ─── ③ JAVOBNI KONTEKSTGA SOLISHTIRISH ───
    @staticmethod
    def _sozlar(matn):
        return {w for w in re.findall(r"[a-zA-ZЀ-ӿ']{4,}", matn.lower())}

    def _qoplama(self, javob, kontekst):
        """Javobdagi so'zlarning qanchasi KONTEKSTDA bor?"""
        j, k = self._sozlar(javob), self._sozlar(kontekst)
        if not j:
            return 1.0
        return len(j & k) / len(j)

    def sora(self, savol):
        t0 = time.perf_counter()
        n = self.vs.similarity_search_with_relevance_scores(savol, k=self.k)
        eng = max((s for _, s in n), default=0.0)
        yaxshi = [(d, s) for d, s in n if s >= self.min_ball]

        # ─── ① CHEGARA ───
        if not yaxshi:
            r = {"savol": savol[:34], "javob": self.RAD, "himoya": "① chegara",
                 "ball": round(eng, 4), "qoplama": None,
                 "ms": round((time.perf_counter() - t0) * 1000)}
            self.jurnal.append(r)
            return r

        kontekst = "\n\n".join(f"[{i}] {d.page_content}"
                               for i, (d, _) in enumerate(yaxshi, 1))
        if self.llm is None:
            r = {"savol": savol[:34], "javob": "(model yo'q — faqat qidiruv)",
                 "himoya": "—", "ball": round(eng, 4), "qoplama": None,
                 "ms": round((time.perf_counter() - t0) * 1000),
                 "manba": [d.metadata for d, _ in yaxshi]}
            self.jurnal.append(r)
            return r

        javob = (self.pt | self.llm | StrOutputParser()).invoke(
            {"context": kontekst, "question": savol}).strip()

        # ─── ② QATTIQ PROMPT ISHLADIMI ───
        if "don't know" in javob.lower() or "i dont know" in javob.lower():
            himoya = "② prompt"
        else:
            himoya = "yo'q"

        # ─── ③ QOPLAMA TEKSHIRUVI ───
        qop = self._qoplama(javob, kontekst)
        if himoya == "yo'q" and qop < self.qoplama_chegara:
            javob = (f"{self.RAD}\n(model javob berdi, lekin uning atigi "
                     f"{qop:.0%} so'zi kontekstda bor — TO'QIMA deb baholandi)")
            himoya = "③ qoplama"

        r = {"savol": savol[:34], "javob": javob, "himoya": himoya,
             "ball": round(eng, 4), "qoplama": round(qop, 3),
             "ms": round((time.perf_counter() - t0) * 1000),
             "manba": [d.metadata for d, _ in yaxshi]}
        self.jurnal.append(r)
        return r

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal).drop(columns=["javob", "manba"],
                                           errors="ignore")
        print(d.to_string(index=False))
        c = Counter(x["himoya"] for x in self.jurnal)
        print("\nhimoya qavatlari:")
        for k, v in c.most_common():
            print(f"  {k:14s} {v}")
        rad = 1 - c.get("yo'q", 0) / len(self.jurnal)
        if rad == 0:
            print("⚠️ HECH BIR SAVOL RAD ETILMADI — javobi YO'Q savol bilan sinang")
        if d.qoplama.notna().any() and d.qoplama.min() < 0.15:
            print("💥 JUDA PAST QOPLAMA UCHRADI — model kontekstdan "
                  "TASHQARIDA javob bermoqda")
        return d


# ─── ishlatish ───
# q = Qalqon(cos_vs, llm, min_ball=0.3)
# for s in ["What software do data scientists use?",
#           "What is analysis vs analytics?",
#           "What is the weather in Tashkent today?",   # ← 18-darsdagi TO'QIMA
#           "How do I cook pasta?"]:
#     r = q.sora(s)
#     print(f"\n[{r['himoya']}] {s}\n  {r['javob'][:150]}")
# q.hisobot()
```

> ## 🏆 **UCH QAVAT — CHUNKI HAR BIRI BOSHQA XATONI USHLAYDI:**
> ```
> ① CHEGARA   →  retriever HECH NARSA topmagan holat      (eng ishonchli)
> ② PROMPT    →  model o'zi "bilmayman" degan holat        (arzon)
> ③ QOPLAMA   →  💥 model KONTEKSTDAN TASHQARI javob bergan holat
> ```
>
> ## 💥 **③ — 18-DARSDAGI HOLATNI AYNAN USHLAYDI:** retriever bo'lak topdi *(chegara o'tdi)*, model "bilmayman" demadi *(prompt o'tdi)* — lekin javobdagi so'zlar **kontekstda yo'q**.
>
> ## ⚠️ **QOPLAMA — TAXMINIY O'LCHOV.** Modelning parafrazi ham past ball olishi mumkin. `qoplama_chegara` ni **o'z ma'lumotingizda sozlang** *(0.15–0.35)*.

---

# 📊 4-loyiha. RAG sifat panelini qurish

> **Maqsad:** RAG tizimingiz **yaxshilanayotganini** yoki **buzilayotganini** raqamlar bilan ko'rish.

```python
class SifatPaneli:
    """Sinov to'plamida RAG ni baholaydi va TARIXNI saqlaydi."""

    def __init__(self, tarix_fayli="rag-tarix.json"):
        self.tarix_fayli = Path(tarix_fayli)
        self.tarix = (json.loads(self.tarix_fayli.read_text(encoding="utf-8"))
                      if self.tarix_fayli.exists() else [])

    # ─── o'lchovlar ───
    @staticmethod
    def _hit_rate(docs, kutilgan):
        n = " ".join(d.page_content.lower() for d in docs)
        return 1.0 if kutilgan.lower() in n else 0.0

    @staticmethod
    def _mrr(docs, kutilgan):
        """Kutilgan parcha NECHANCHI bo'lakda? 1/o'rin."""
        for i, d in enumerate(docs, 1):
            if kutilgan.lower() in d.page_content.lower():
                return 1.0 / i
        return 0.0

    def bahola(self, vs, sinovlar, k=3, lambda_mult=0.7, min_ball=0.3,
               teg="sinov"):
        """sinovlar = [(savol, kutilgan_parcha | None), ...]"""
        r = vs.as_retriever(search_type="mmr",
                            search_kwargs={"k": k, "lambda_mult": lambda_mult})
        hit, mrr, token, vaqt = [], [], [], []
        togri_rad, notogri_rad, otkazib = 0, 0, 0

        for savol, kutilgan in sinovlar:
            t0 = time.perf_counter()
            docs = r.invoke(savol)
            vaqt.append((time.perf_counter() - t0) * 1000)
            token.append(sum(len(ENC.encode(d.page_content)) for d in docs))

            eng = vs.similarity_search_with_relevance_scores(savol, k=1)
            ball = eng[0][1] if eng else 0.0
            rad_etildi = ball < min_ball

            if kutilgan is None:                   # javob YO'Q bo'lishi kerak
                if rad_etildi:
                    togri_rad += 1
                else:
                    otkazib += 1                   # 💥 TO'QIMA XAVFI
            else:
                if rad_etildi:
                    notogri_rad += 1               # 💥 YAXSHI SAVOL RAD ETILDI
                hit.append(self._hit_rate(docs, kutilgan))
                mrr.append(self._mrr(docs, kutilgan))

        yozuv = {"teg": teg, "k": k, "lambda": lambda_mult,
                 "min_ball": min_ball, "sinov": len(sinovlar),
                 "hit_rate": round(float(np.mean(hit)), 3) if hit else None,
                 "mrr": round(float(np.mean(mrr)), 3) if mrr else None,
                 "to'g'ri_rad": togri_rad, "noto'g'ri_rad": notogri_rad,
                 "o'tkazib_yubordi": otkazib,
                 "token": int(np.mean(token)), "ms": round(float(np.mean(vaqt)))}
        self.tarix.append(yozuv)
        self.tarix_fayli.write_text(
            json.dumps(self.tarix, ensure_ascii=False, indent=1),
            encoding="utf-8")
        return yozuv

    def panel(self):
        if not self.tarix:
            print("tarix bo'sh")
            return
        d = pd.DataFrame(self.tarix)
        print(d.to_string(index=False))

        oxirgi = d.iloc[-1]
        print("\n─── OXIRGI O'LCHOV ───")
        print(f"  hit_rate        : {oxirgi.hit_rate}   "
              f"(kerakli bo'lak topilgan savollar ulushi)")
        print(f"  MRR             : {oxirgi.mrr}   "
              f"(kerakli bo'lak nechanchi o'rinda: 1.0 = doim birinchi)")
        togri_rad = oxirgi["to'g'ri_rad"]
        otkazib   = oxirgi["o'tkazib_yubordi"]
        notogri   = oxirgi["noto'g'ri_rad"]
        print(f"  ✅ to'g'ri rad  : {togri_rad}")
        print(f"  💥 o'tkazib yub.: {otkazib}  ← TO'QIMA XAVFI")
        print(f"  ⚠️ noto'g'ri rad: {notogri}  ← foydali savol rad etildi")

        if len(d) > 1:
            oldingi = d.iloc[-2]
            for m in ["hit_rate", "mrr"]:
                if oxirgi[m] is None or oldingi[m] is None:
                    continue
                farq = oxirgi[m] - oldingi[m]
                belgi = "📈" if farq > 0 else ("📉" if farq < 0 else "➡️")
                print(f"  {belgi} {m}: {oldingi[m]} → {oxirgi[m]} "
                      f"({farq:+.3f})")
            if oxirgi.token > oldingi.token * 1.2:
                print(f"  💰 token {oldingi.token} → {oxirgi.token} — "
                      f"narx {oxirgi.token/oldingi.token:.1f}× oshdi")

        if oxirgi["o'tkazib_yubordi"]:
            print("\n💥 CHEGARANI OSHIRING — javobi yo'q savollar o'tib ketmoqda")
        if notogri:
            print("⚠️ CHEGARANI PASAYTIRING — foydali savollar rad etilmoqda")
        return d


# ─── ishlatish ───
# SINOVLAR = [("What programming languages...?", "Python"),
#             ("What software for big data?",    "Hadoop"),
#             ("What is the weather in Tashkent?", None),
#             ("How do I cook pasta?",            None)]
# p = SifatPaneli()
# p.bahola(cos_vs, SINOVLAR, k=3, lambda_mult=0.7, min_ball=0.3, teg="asos")
# p.bahola(cos_vs, SINOVLAR, k=5, lambda_mult=0.5, min_ball=0.4, teg="k=5")
# p.panel()
```

> ## 🏆 **IKKI XIL XATO — IKKI XIL YECHIM:**
> ```
> 💥 o'tkazib yubordi  →  chegarani OSHIRING     (to'qima xavfi)
> ⚠️ noto'g'ri rad     →  chegarani PASAYTIRING  (foydali savol yo'qoldi)
> ```
> ## 🔑 **IKKALASI BIR VAQTDA CHIQSA** — chegara **yordam bermaydi**, **retriever sifati** past. `chunk_size` yoki **embedding modelini** o'zgartiring.
>
> ## 💡 **`MRR`** *(Mean Reciprocal Rank)* — kerakli bo'lak **nechanchi o'rinda**. `1.0` = doim **birinchi**, `0.33` = o'rtacha **uchinchi**.

---

# 🇺🇿 5-loyiha. O'zbekcha bilim bazasi bot

> **Maqsad:** o'zbekcha hujjatlardan **to'liq ishlaydigan**, **manbali**, **himoyalangan** savol-javob tizimi.

```python
class OzbekBilimBazasi:
    """🇺🇿 Mahalliy indeks + chegara + manba + jurnal."""

    RAD = "Kechirasiz, hujjatlarimda bu savolga javob yo'q."

    SHABLON = """Siz — kompaniya hujjatlari asosida javob beruvchi yordamchisiz.

QOIDALAR:
- FAQAT quyidagi kontekstdan foydalaning.
- Kontekstda javob bo'lmasa, AYNAN shunday yozing: "Hujjatlarda javob yo'q."
- Javobni O'ZBEK TILIDA yozing.
- Manba raqamini qavsda ko'rsating, masalan [1].

Kontekst:
{context}

Savol: {question}
Javob:"""

    def __init__(self, embedding, llm=None, yol="./uz-bilim",
                 min_ball=0.3, k=3, maks_token=2000):
        self.embedding, self.llm = embedding, llm
        self.yol = yol
        self.min_ball, self.k, self.maks_token = min_ball, k, maks_token
        self.pt = PromptTemplate.from_template(self.SHABLON)
        self.vs = None
        self.jurnal = []

    # ─── indekslash ───
    def indeksla(self, hujjatlar, chunk=400):
        """🇺🇿 chunk KICHIKROQ — o'zbekcha token 1.88× qimmat (36-modul)."""
        shutil.rmtree(self.yol, ignore_errors=True)
        b = RecursiveCharacterTextSplitter(
            chunk_size=chunk, chunk_overlap=int(chunk * 0.12),
            separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""]
        ).split_documents(hujjatlar)

        for x in b:
            x.metadata.setdefault("til", "uz")
        ids = [hashlib.sha256(
            f"{d.metadata.get('source','')}|{d.page_content}".encode()
        ).hexdigest()[:32] for d in b]

        t0 = time.perf_counter()
        self.vs = Chroma.from_documents(
            b, self.embedding, ids=ids, persist_directory=self.yol,
            collection_metadata={"hnsw:space": "cosine"})   # ⭐ kosinus SHART
        print(f"✅ {len(b)} bo'lak · {time.perf_counter()-t0:.1f}s")

        uz_t = [len(ENC.encode(x.page_content)) for x in b]
        print(f"   token: min {min(uz_t)} max {max(uz_t)} "
              f"o'rt {sum(uz_t)//len(uz_t)}")
        print(f"   🇺🇿 k={self.k} da kontekst ≈ "
              f"{self.k * (sum(uz_t)//len(uz_t))} token")
        return self.vs

    # ─── kontekst ───
    def _kontekst(self, juftlar):
        q, jami = [], 0
        for i, (d, _) in enumerate(juftlar, 1):
            t = len(ENC.encode(d.page_content))
            if jami + t > self.maks_token:
                break
            manba = d.metadata.get("bolim", d.metadata.get("fayl", "?"))
            q.append(f"[{i}] ({manba})\n{d.page_content}")
            jami += t
        return "\n\n".join(q), jami

    # ─── savol ───
    def sora(self, savol, bolim=None):
        if self.vs is None:
            raise RuntimeError("avval indeksla() ni chaqiring")
        t0 = time.perf_counter()
        kw = {"filter": {"bolim": bolim}} if bolim else {}
        n = self.vs.similarity_search_with_relevance_scores(
            savol, k=self.k, **kw)
        eng = max((s for _, s in n), default=0.0)
        yaxshi = [(d, s) for d, s in n if s >= self.min_ball]

        if not yaxshi:
            r = {"savol": savol, "javob": self.RAD, "ball": round(eng, 4),
                 "manba": [], "himoya": "chegara",
                 "ms": round((time.perf_counter() - t0) * 1000)}
            self.jurnal.append(r)
            return r

        kontekst, token = self._kontekst(yaxshi)
        manbalar = [d.metadata.get("bolim", "?") for d, _ in yaxshi]

        if self.llm is None:
            r = {"savol": savol, "javob": "(model ulanmagan — faqat qidiruv)",
                 "ball": round(eng, 4), "manba": manbalar, "himoya": "—",
                 "kontekst": kontekst[:300], "token": token,
                 "ms": round((time.perf_counter() - t0) * 1000)}
            self.jurnal.append(r)
            return r

        javob = (self.pt | self.llm | StrOutputParser()).invoke(
            {"context": kontekst, "question": savol}).strip()
        himoya = "prompt" if "javob yo'q" in javob.lower() else "yo'q"

        r = {"savol": savol, "javob": javob, "ball": round(eng, 4),
             "manba": manbalar, "himoya": himoya, "token": token,
             "ms": round((time.perf_counter() - t0) * 1000)}
        self.jurnal.append(r)
        return r

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)[
            ["savol", "ball", "himoya", "ms"]].copy()
        d["savol"] = d.savol.str[:34]
        print(d.to_string(index=False))
        rad = (pd.DataFrame(self.jurnal).himoya == "chegara").mean()
        print(f"\nrad etilgan: {rad:.0%}")
        if rad == 0 and len(d) > 3:
            print("⚠️ hech biri rad etilmadi — chegara past bo'lishi mumkin")
        if rad > 0.5:
            print("⚠️ ko'p rad etilmoqda — hujjatlarni to'ldiring")
        return d


# ─── ishlatish ───
HUJJATLAR = [
    Document(page_content="Muddatli depozit yillik 18% dan 22% gacha foiz "
                          "keltiradi. Minimal summa 1 000 000 so'm. Muddat "
                          "6 oydan 36 oygacha. Muddatdan oldin yechib olinsa "
                          "foiz 4% gacha kamayadi.",
             metadata={"bolim": "depozit", "fayl": "depozit.docx"}),
    Document(page_content="Debet karta 3 ish kunida tayyorlanadi. Yillik "
                          "xizmat haqi 50 000 so'm. Bepul yetkazib berish "
                          "Toshkent shahri bo'ylab amal qiladi.",
             metadata={"bolim": "karta", "fayl": "karta.docx"}),
    Document(page_content="Iste'mol krediti 24 oygacha beriladi. Yillik "
                          "stavka 24% dan boshlanadi. Daromad spravkasi va "
                          "pasport nusxasi talab qilinadi.",
             metadata={"bolim": "kredit", "fayl": "kredit.docx"}),
]

# bot = OzbekBilimBazasi(embedding, llm=None)     # ⭐ modelsiz ham ishlaydi
# bot.indeksla(HUJJATLAR, chunk=400)
# for s in ["Depozit foizi qancha?",
#           "Karta necha kunda tayyor bo'ladi?",
#           "Kredit uchun qanday hujjat kerak?",
#           "Toshkentda ob-havo qanday?"]:        # ← javobi YO'Q
#     r = bot.sora(s)
#     print(f"\n[{r['ball']:.3f}] {s}")
#     print(f"  manba: {r['manba']}")
#     print(f"  {r['javob'][:160]}")
# bot.hisobot()
```

> ## 🏆 **BU BOT — ARXITEKTURA JIHATIDAN TO'G'RI:**
> ```
> 🇺🇿 chunk=400 (500 emas)  →  o'zbekcha token 1.88× qimmat
> ⭐ hnsw:space="cosine"    →  chegara ISHLAYDI
> ⭐ separators=[". ", ...] →  jumla o'rtasidan kesmaydi
> ⭐ filter={"bolim": ...}  →  bo'limga cheklash
> ⭐ manba DOIM qaytadi     →  javobni tekshirsa bo'ladi
> ✅ llm=None bilan ham ishlaydi → indeksni API kalitisiz sinash
> ```
>
> ## ⚠️⚠️ **VA HALOL OGOHLANTIRISH:**
> ```
> RETRIEVAL  →  ✅ mahalliy embedding YETARLI  (bank↔kredit 0.6898)
> GENERATION →  ⚠️ Qwen2.5-0.5B o'zbekchada ZAIF (18-darsda o'lchandi)
>               → GPT-4o · Claude · Gemini  yoki  Ollama'da 7B+ model
> ```
> ## 🔑 **BAZA MAHALLIY QOLADI** *(ma'lumot suvereniteti — 12-dars)*, **faqat yakuniy prompt** modelga boradi.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 📚 **Indekslash quvuri** | Xato, dublikat, tashxis | ## Barqaror ID + `embedding.json` |
| 2 | 🎯 **Retriever sozlagichi** | `chunk` · `k` · `λ` · chegara | ## O'lchash, taxmin emas |
| 3 | 🛡️ **Qalqon** | Yolg'on to'qish | ## ⭐ **Uch qavat** |
| 4 | 📊 **Sifat paneli** | Yaxshilanmoqdami? | ## `hit_rate` · `MRR` · tarix |
| 5 | 🇺🇿 **O'zbekcha bot** | Amaliy tizim | ## Mahalliy · manbali · himoyali |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
