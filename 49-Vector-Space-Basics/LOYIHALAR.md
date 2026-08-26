# 🚀 49-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham API kalitisiz.**

## ⚙️ Umumiy tayyorgarlik

```bash
pip install sentence-transformers numpy pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, json
from pathlib import Path
import numpy as np, pandas as pd
from sentence_transformers import SentenceTransformer

BOLIMLAR = "../51-Semantic-Search-Case-Study/course_section_descriptions.csv"


def tozala(s):
    return " ".join(str(s).replace("\r", " ").replace("\n", " ").split())
```

---

# 🧭 1-loyiha. Metrika va model tanlovchi

> **Maqsad:** *"Qaysi model va qaysi metrika MENING ma'lumotimda ishlaydi?"* — **taxmin qilmasdan**, **o'lchab** javob berish.

```python
class QidiruvSozlagich:
    """Model × metrika kombinatsiyalarini SIZNING ma'lumotingizda sinaydi."""

    METRIKALAR = {
        "kosinus":   (lambda E, q: E @ q, True),          # normallashgan
        "skalyar":   (lambda E, q: E @ q, True),          # xom (norm yo'q)
        "evklid":    (lambda E, q: -np.linalg.norm(E - q, axis=1), True),
        "manhetten": (lambda E, q: -np.sum(np.abs(E - q), axis=1), True),
    }

    def __init__(self, sinovlar, til="uz"):
        """sinovlar = [(savol, mos_matn, [nomos_matnlar]), ...]"""
        self.sinovlar = sinovlar
        self.til = til
        self.natijalar = []

    # ══════ MODEL DIAGNOSTIKASI ══════
    def _model_info(self, m, nom):
        v = m.encode("test")
        norma = float(np.linalg.norm(v))
        return {"model": nom.split("/")[-1][:34],
                "o'lcham": len(v),
                "maks_tok": getattr(m, "max_seq_length", "?"),
                "norma": round(norma, 4),
                "normallashgan": abs(norma - 1) < 0.01}

    # ══════ BITTA KOMBINATSIYA ══════
    def _sinov(self, m, metrika, normallash):
        f, _ = self.METRIKALAR[metrika]
        togri, farqlar, mos_ballar, nomos_ballar = 0, [], [], []
        for savol, mos, nomoslar in self.sinovlar:
            matnlar = [mos] + list(nomoslar)
            E = m.encode(matnlar, show_progress_bar=False)
            q = m.encode(savol)
            if normallash:
                E = E / np.linalg.norm(E, axis=1, keepdims=True)
                q = q / np.linalg.norm(q)
            ballar = f(E, q)
            mos_b, nomos_b = float(ballar[0]), ballar[1:]
            mos_ballar.append(mos_b)
            nomos_ballar += [float(x) for x in nomos_b]
            togri += int(mos_b > max(nomos_b))
            farqlar.append(float(mos_b - max(nomos_b)))
        return {"aniqlik": round(togri / len(self.sinovlar), 3),
                "mos_o'rt": round(float(np.mean(mos_ballar)), 4),
                "nomos_o'rt": round(float(np.mean(nomos_ballar)), 4),
                "ajratish": round(float(np.mean(farqlar)), 4),
                "eng_yomon": round(float(np.min(farqlar)), 4)}

    # ══════ TO'LIQ SINOV ══════
    def ishga_tushir(self, modellar):
        for nom in modellar:
            print(f"⏳ {nom[:46]} ...")
            try:
                t0 = time.perf_counter()
                m = SentenceTransformer(nom)
                yuk = time.perf_counter() - t0
            except Exception as e:
                print(f"   ❌ {type(e).__name__}: {str(e)[:60]}")
                continue

            info = self._model_info(m, nom)
            for metrika in self.METRIKALAR:
                # skalyar — ATAYLAB normallashtirmaymiz (farqni ko'rish uchun)
                normallash = (metrika != "skalyar")
                t0 = time.perf_counter()
                r = self._sinov(m, metrika, normallash)
                r.update(info)
                r["metrika"] = metrika
                r["normallash"] = "✅" if normallash else "❌"
                r["sinov_s"] = round(time.perf_counter() - t0, 2)
                r["yuk_s"] = round(yuk, 1)
                self.natijalar.append(r)
        return self.hisobot()

    # ══════ HISOBOT ══════
    def hisobot(self):
        if not self.natijalar:
            print("natija yo'q")
            return
        d = pd.DataFrame(self.natijalar)
        ustunlar = ["model", "metrika", "normallash", "aniqlik", "ajratish",
                    "eng_yomon", "mos_o'rt", "nomos_o'rt", "norma", "maks_tok"]
        print()
        print(d[ustunlar].to_string(index=False))

        # ── ⭐ ENG YAXSHI ──
        d2 = d.sort_values(["aniqlik", "ajratish"], ascending=[False, False])
        eng = d2.iloc[0]
        print(f"\n🏆 ENG YAXSHI: {eng.model} + {eng.metrika}")
        print(f"   aniqlik {eng.aniqlik} · ajratish {eng.ajratish} · "
              f"eng yomon holat {eng.eng_yomon}")

        # ── MODEL bo'yicha ──
        print("\n── model bo'yicha (eng yaxshi metrika) ──")
        for model in d.model.unique():
            dm = d[d.model == model].sort_values(
                ["aniqlik", "ajratish"], ascending=[False, False]).iloc[0]
            belgi = "✅" if dm.aniqlik >= 0.8 else "💥"
            print(f"  {belgi} {model[:34]:34s} {dm.metrika:10s} "
                  f"aniqlik {dm.aniqlik} · ajratish {dm.ajratish}")

        # ── TASHXIS ──
        print("\n── 🔍 TASHXIS ──")
        if d.aniqlik.max() < 0.8:
            print("  💥 HECH BIR kombinatsiya 80% ga yetmadi")
            print("     → muammo METRIKADA emas, MODELDA yoki MA'LUMOTDA")
            print(f"     → 🇺🇿 {self.til} tili uchun kuchliroq model sinang:")
            print("        multilingual-e5-large · LaBSE · bge-m3")
        if (d.eng_yomon < 0).any():
            yomon = d[d.eng_yomon < 0]
            print(f"  ⚠️ {len(yomon)} kombinatsiyada kamida bitta sinov "
                  f"MANFIY ajratish berdi (nomos javob YUTDI)")
        # normallashtirish ta'siri
        for model in d.model.unique():
            kos = d[(d.model == model) & (d.metrika == "kosinus")]
            ska = d[(d.model == model) & (d.metrika == "skalyar")]
            if len(kos) and len(ska):
                fark = kos.aniqlik.iloc[0] - ska.aniqlik.iloc[0]
                if abs(fark) > 0.01:
                    print(f"  📏 {model[:30]}: normallashtirish aniqlikni "
                          f"{fark:+.3f} ga o'zgartirdi")
                elif not kos.normallashgan.iloc[0]:
                    print(f"  💡 {model[:30]}: normallashtirish bu sinovda "
                          f"farq qilmadi, lekin BOSHQA ma'lumotda qilishi "
                          f"mumkin — DOIM normallashtiring")
        return d

    def json_saqla(self, yol="sozlash.json"):
        Path(yol).write_text(
            json.dumps(self.natijalar, ensure_ascii=False, indent=1,
                       default=str), encoding="utf-8")
        print(f"\n💾 {yol}")


# ─── 🇺🇿 O'ZBEKCHA sinov to'plami ───
SINOVLAR_UZ = [
    ("uy sotib olish uchun kredit kerak",
     "Ipoteka krediti yillik 18% dan boshlanadi, 20 yilgacha, "
     "uy va kvartira sotib olish uchun",
     ["Debet karta 3 ish kunida tayyorlanadi, yillik 50 000 so'm",
      "Muddatli depozit yillik 18-22% foiz keltiradi"]),
    ("pulimni jamg'armoqchiman, foiz olay",
     "Muddatli depozit yillik 18-22% foiz keltiradi, minimal 1 mln so'm",
     ["Iste'mol krediti yillik 24% dan boshlanadi",
      "Avtomobil krediti 5 yilgacha beriladi"]),
    ("plastik karta ochmoqchiman",
     "Debet karta 3 ish kunida tayyorlanadi, UzCard va Humo tizimlari",
     ["Ipoteka krediti 20 yilgacha beriladi",
      "Muddatli depozit foizi 18-22%"]),
    ("avtomobil sotib olish uchun qarz",
     "Avtomobil krediti yillik 21% dan, 5 yilgacha, yangi va eski avtolar",
     ["Debet karta yillik xizmat haqi 50 000 so'm",
      "Muddatli depozit 6 oydan 36 oygacha"]),
]

qs = QidiruvSozlagich(SINOVLAR_UZ, til="o'zbek")
qs.ishga_tushir([
    "all-MiniLM-L6-v2",                          # 🇬🇧 faqat inglizcha
    "paraphrase-multilingual-MiniLM-L12-v2",     # 🌍 ko'p tilli
])
qs.json_saqla()
```

> ## 🏆 **UCHTA O'LCHOV — VA HAR BIRI BOSHQA SAVOLGA JAVOB BERADI:**
> ```
> aniqlik    →  "mos javob NOMOSDAN ustunmi?"
> ajratish   →  ⭐ "qanchalik ustun?" (chegara qo'yish oson-qiyinligi)
> eng_yomon  →  💥 "ENG YOMON holatda nima bo'ladi?"
> ```
>
> ## 💥 **`eng_yomon < 0` — DEMAK KAMIDA BITTA SINOVDA NOMOS JAVOB YUTGAN.** O'rtacha yaxshi bo'lsa ham, bu **jiddiy signal**.
>
> ## 🔑 **VA ENG MUHIM TASHXIS:**
> ```
> "HECH BIR kombinatsiya 80% ga yetmadi"
>   →  💥 muammo METRIKADA emas
>   →  MODEL yoki MA'LUMOT sifatida
> ```
>
> ## 🇺🇿 **BIZNING O'LCHOVIMIZDA** *(49-modul, 2-dars)*: `"uy sotib olish uchun pul kerak"` so'roviga **uchala metrika ham** noto'g'ri javob berdi. Bu — **modelning** kamchiligi.

---

# 🔍 2-loyiha. Embedding tashxis vositasi

> **Maqsad:** *"Embedding modelim MENING ma'lumotimda ishlayaptimi?"* — **sinov juftliklarisiz** tekshirish.

```python
class EmbeddingTashxis:
    """Embedding sifatini SINOV JUFTLIKLARISIZ baholaydi."""

    def __init__(self, matnlar, model_nomi="all-MiniLM-L6-v2",
                 guruhlar=None):
        """guruhlar: har matn qaysi guruhga tegishli (ixtiyoriy).
        Berilsa — guruh ichi/tashqi tarqalish ham o'lchanadi."""
        self.matnlar = list(matnlar)
        self.guruhlar = list(guruhlar) if guruhlar is not None else None
        self.model_nomi = model_nomi
        self.model = None
        self.E = None
        self.n = {}

    # ══════ ① TAYYORLASH ══════
    def tayyorla(self):
        t0 = time.perf_counter()
        self.model = SentenceTransformer(self.model_nomi)
        yuk = time.perf_counter() - t0
        v = self.model.encode("test")
        norma = float(np.linalg.norm(v))

        t0 = time.perf_counter()
        E = self.model.encode(self.matnlar, show_progress_bar=False,
                              batch_size=64)
        emb_s = time.perf_counter() - t0
        self.E = E / np.linalg.norm(E, axis=1, keepdims=True)

        self.n["model"] = {
            "nom": self.model_nomi.split("/")[-1],
            "o'lcham": len(v), "norma": round(norma, 4),
            "normallashgan": abs(norma - 1) < 0.01,
            "maks_token": getattr(self.model, "max_seq_length", "?"),
            "yuklash_s": round(yuk, 1),
            "embedding_s": round(emb_s, 1),
            "tezlik": round(len(self.matnlar) / emb_s)}
        return self

    # ══════ ② KONTEKST OYNASI ══════
    def kontekst(self):
        maks = self.n["model"]["maks_token"]
        uz = np.array([len(m) for m in self.matnlar])
        tok = uz / 4                                # taxminiy
        r = {"min_belgi": int(uz.min()), "maks_belgi": int(uz.max()),
             "ort_belgi": int(uz.mean()), "ort_token": int(tok.mean())}
        if isinstance(maks, int):
            oshgan = int((tok > maks).sum())
            r["chegara"] = maks
            r["oshgan"] = oshgan
            r["oshgan_%"] = round(oshgan / len(uz) * 100, 1)
            # ⭐ qancha matn KESILADI
            kesilgan = float(np.clip(tok - maks, 0, None).sum())
            r["kesilgan_token"] = int(kesilgan)
            r["kesilgan_%"] = round(kesilgan / tok.sum() * 100, 1)
        self.n["kontekst"] = r
        return self

    # ══════ ③ TARQALISH ══════
    def tarqalish(self, namuna=500):
        n = min(namuna, len(self.E))
        idx = np.random.default_rng(365).choice(len(self.E), n, replace=False)
        M = self.E[idx] @ self.E[idx].T
        np.fill_diagonal(M, np.nan)

        R = np.random.default_rng(365).normal(size=(n, self.E.shape[1]))
        R /= np.linalg.norm(R, axis=1, keepdims=True)
        MR = R @ R.T
        np.fill_diagonal(MR, np.nan)

        self.n["tarqalish"] = {
            "o'rtacha": round(float(np.nanmean(M)), 4),
            "std": round(float(np.nanstd(M)), 4),
            "maks": round(float(np.nanmax(M)), 4),
            "min": round(float(np.nanmin(M)), 4),
            "tasodifiy_std": round(float(np.nanstd(MR)), 4),
            "nisbat": round(float(np.nanstd(M) / np.nanstd(MR)), 2)}
        return self

    # ══════ ④ DUBLIKATLAR ══════
    def dublikatlar(self, chegara=0.97, namuna=500):
        n = min(namuna, len(self.E))
        M = self.E[:n] @ self.E[:n].T
        np.fill_diagonal(M, 0)
        juftlar = np.argwhere(M > chegara)
        juftlar = [(int(i), int(j)) for i, j in juftlar if i < j]
        self.n["dublikat"] = {
            "chegara": chegara, "soni": len(juftlar),
            "namunalar": [(self.matnlar[i][:40], self.matnlar[j][:40],
                           round(float(M[i, j]), 4))
                          for i, j in juftlar[:3]]}
        return self

    # ══════ ⑤ GURUHLAR (agar berilgan bo'lsa) ══════
    def guruh_tahlili(self):
        if self.guruhlar is None:
            return self
        g = np.array(self.guruhlar)
        ich, tash = [], []
        for guruh in np.unique(g):
            mask = g == guruh
            if mask.sum() < 2:
                continue
            Ei = self.E[mask]
            Mi = Ei @ Ei.T
            np.fill_diagonal(Mi, np.nan)
            ich.append(float(np.nanmean(Mi)))
            Et = self.E[~mask]
            if len(Et):
                tash.append(float((Ei @ Et.T).mean()))
        self.n["guruh"] = {
            "guruhlar": int(len(np.unique(g))),
            "ich_ort": round(float(np.mean(ich)), 4),
            "tash_ort": round(float(np.mean(tash)), 4),
            "ajratish": round(float(np.mean(ich) - np.mean(tash)), 4)}
        return self

    # ══════ HISOBOT ══════
    def hisobot(self):
        n = self.n
        print("═" * 62)
        print(f"🔍 EMBEDDING TASHXISI — {n['model']['nom']}")
        print("═" * 62)

        print("\n📊 MODEL")
        for k, v in n["model"].items():
            print(f"   {k:16s} {v}")
        if not n["model"]["normallashgan"]:
            print("   💥 NORMALLASHMAGAN → np.dot ≠ kosinus, normaga BO'LING")

        print("\n📏 KONTEKST OYNASI")
        for k, v in n["kontekst"].items():
            print(f"   {k:18s} {v}")
        k = n["kontekst"]
        if k.get("oshgan_%", 0) > 20:
            print(f"   💥 matnlarning {k['oshgan_%']}% qismi chegaradan oshadi")
            print(f"      {k['kesilgan_token']:,} token ({k['kesilgan_%']}%) "
                  f"JIMGINA TASHLANADI")
            print("      ✅ eng muhim matnni OLDINGA · yoki BO'LAKLANG")

        print("\n📐 TARQALISH")
        t = n["tarqalish"]
        for kk, vv in t.items():
            print(f"   {kk:16s} {vv}")
        if t["nisbat"] < 1.5:
            print("   💥 tasodifiy vektorlardan deyarli FARQ QILMAYDI")
            print("      → MODEL SIZNING MA'LUMOTINGIZNI TUSHUNMAYAPTI")
        else:
            print(f"   ✅ tasodifiydan {t['nisbat']}× kengroq — model ISHLAYAPTI")
        if t["o'rtacha"] > 0.5:
            ort = t["o'rtacha"]
            print(f"   ⚠️ o'rtacha o'xshashlik {ort} — JUDA YUQORI")
            print("      → matnlar bir-biriga o'xshash yoki model "
                  "ularni ajratmayapti")

        print("\n👯 DUBLIKATLAR")
        dd = n["dublikat"]
        print(f"   chegara {dd['chegara']} → {dd['soni']} juftlik")
        for a, b, s in dd["namunalar"]:
            print(f"      {s}  {a} ≈ {b}")
        if dd["soni"] > len(self.matnlar) * 0.05:
            print("   ⚠️ ko'p dublikat — bazani tozalash foydali bo'ladi")

        if "guruh" in n:
            print("\n🗂️ GURUHLAR")
            g = n["guruh"]
            for kk, vv in g.items():
                print(f"   {kk:16s} {vv}")
            if g["ajratish"] < 0.05:
                print("   💥 guruhlar AJRALMAYAPTI — model turkumlarni "
                      "farqlay olmaydi")
            else:
                print(f"   ✅ guruh ichi tashqarisidan {g['ajratish']} ga "
                      f"yuqori — model turkumlarni AJRATADI")

        print("\n" + "═" * 62)
        print("🎯 XULOSA")
        muammo = 0
        if t["nisbat"] < 1.5:
            print("   💥 MODEL YARAMAYDI — boshqasini tanlang"); muammo += 1
        if n["kontekst"].get("oshgan_%", 0) > 50:
            print("   💥 MATNLAR JUDA UZUN — bo'laklash SHART"); muammo += 1
        if "guruh" in n and n["guruh"]["ajratish"] < 0.05:
            print("   💥 TURKUMLAR AJRALMAYAPTI"); muammo += 1
        if not muammo:
            print("   ✅ jiddiy muammo topilmadi — davom eting")
        return n


# ─── ishlatish: 365 ma'lumoti ───
b = pd.read_csv(BOLIMLAR, encoding="cp1252")
matnlar = b.apply(lambda r: tozala(
    f'{r.section_name}. {r.course_name}. {r.course_technology}. '
    f'{r.section_description}'), axis=1).tolist()

print("═══ 🇬🇧 INGLIZCHA MODEL ═══")
(EmbeddingTashxis(matnlar, "all-MiniLM-L6-v2",
                  guruhlar=b.course_technology.tolist())
 .tayyorla().kontekst().tarqalish().dublikatlar().guruh_tahlili().hisobot())

print("\n\n═══ 🌍 KO'P TILLI MODEL ═══")
(EmbeddingTashxis(matnlar, "paraphrase-multilingual-MiniLM-L12-v2",
                  guruhlar=b.course_technology.tolist())
 .tayyorla().kontekst().tarqalish().dublikatlar().guruh_tahlili().hisobot())
```

> ## 🏆 **BESH TEKSHIRUV — VA HECH BIRI SINOV JUFTLIGI TALAB QILMAYDI:**
> ```
> 📊 MODEL      →  normallashganmi? o'lchami? tezligi?
> 📏 KONTEKST   →  💥 qancha token JIMGINA tashlanadi?
> 📐 TARQALISH  →  ⭐ model ma'lumotni tushunadimi? (tasodifiyga nisbatan)
> 👯 DUBLIKAT   →  bazada takroriy yozuvlar bormi?
> 🗂️ GURUHLAR   →  ⭐ turkumlar (python/sql/tableau) AJRALADIMI?
> ```
>
> ## 💥 **`GURUHLAR.ajratish` — ENG QIMMATLI O'LCHOV.** Agar `python` va `tableau` bo'limlari **ajralmasa**, model **domenni tushunmayapti**.
>
> ## 💡 **VA BU O'LCHOV BEPUL:** sizda **allaqachon** turkum ustuni bor *(`course_technology`)*. Sinov juftliklari **yozish shart emas**.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🧭 **Sozlagich** | Model × metrika tanlovi | ## ⭐ `ajratish` va `eng_yomon` |
| 2 | 🔍 **Tashxis** | *"Model ishlayaptimi?"* | ## ⭐ `tarqalish.nisbat` · `guruh.ajratish` |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
