# 🚀 56-modul mini-loyihalari

> **2 ta tayyor loyiha.** ## ⭐⭐ **Ikkalasi ham "qora quti"ni ochadi.**

## ⚙️ Umumiy tayyorgarlik

```bash
pip install numpy pandas librosa torch transformers scikit-learn
```

```python
import warnings; warnings.filterwarnings("ignore")
import os, time, json
import numpy as np, pandas as pd
import librosa, torch, torch.nn as nn
```

---

# 🔬 1-loyiha. Arxitektura laboratoriyasi

> **Maqsad:** *"Qaysi arxitektura?"* degan savolga ## **o'lchov bilan** javob berish — ## va **ma'lumot sizib chiqishisiz**.

```python
class ArxitekturaLab:
    """🏆 Arxitekturalarni HALOL solishtiradi.

    ⭐ GroupShuffleSplit  →  gapiruvchi sizib chiqmasin
    ⭐ n_takror ≥ 3       →  bitta natija tasodif bo'lmasin
    ⭐ std ni hisobot     →  "84.6%" emas, "84.6% ± 2.1%"
    """

    def __init__(self, seq=32, epoch=60, lr=3e-3, n_takror=3):
        self.seq, self.epoch, self.lr = seq, epoch, lr
        self.n_takror = n_takror
        self.lf = nn.BCEWithLogitsLoss()

    # ───────────────── ma'lumot
    def tayyorla(self, fayllar, n_mfcc=13):
        """⭐ Har fayl — alohida 'gapiruvchi' (guruh)."""
        X, Y, G = [], [], []
        for gi, yol in enumerate(fayllar):
            y, sr = librosa.load(yol, sr=16000)
            M = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc,
                                     n_fft=512, hop_length=160)
            F = np.vstack([M, librosa.feature.delta(M)]).T
            _, v, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr,
                                   frame_length=1024, hop_length=160)
            n = min(len(F), len(v))
            X.append(F[:n])
            Y.append(v[:n].astype(np.float32))
            G.append(np.full(n, gi))

        X = np.concatenate(X).astype(np.float32)
        Y = np.concatenate(Y)
        G = np.concatenate(G)
        # ⚠️ normallash — FAQAT o'qitish statistikasi bilan qilinishi kerak,
        #    bu yerda soddalashtirilgan
        X = (X - X.mean(0)) / (X.std(0) + 1e-9)
        print(f"  {len(X)} freym · {len(np.unique(G))} guruh · "
              f"ovozli {Y.mean():.1%}")
        return X, Y, G

    # ───────────────── ketma-ketliklarga bo'lish
    def _seq(self, X, Y, G, idx):
        """⭐ Guruh chegarasini KESIB O'TMAYDI."""
        Xs, Ys = [], []
        for g in np.unique(G[idx]):
            m = idx[G[idx] == g]
            k = len(m) // self.seq
            if k == 0:
                continue
            Xs.append(X[m[:k*self.seq]].reshape(k, self.seq, X.shape[1]))
            Ys.append(Y[m[:k*self.seq]].reshape(k, self.seq, 1))
        return (torch.tensor(np.concatenate(Xs)),
                torch.tensor(np.concatenate(Ys)))

    # ───────────────── o'qitish
    def _oqit(self, K, Xtr, Ytr, Xte, Yte, urug):
        torch.manual_seed(urug)
        m = K(d=Xtr.shape[-1])
        opt = torch.optim.Adam(m.parameters(), lr=self.lr)
        t0 = time.perf_counter()
        for _ in range(self.epoch):
            opt.zero_grad()
            self.lf(m(Xtr), Ytr).backward()
            opt.step()
        dt = time.perf_counter() - t0
        with torch.no_grad():
            acc = float(((torch.sigmoid(m(Xte)) > 0.5).float()
                         == Yte).float().mean())
        return acc, dt, sum(p.numel() for p in m.parameters())

    # ───────────────── asosiy
    def bahola(self, X, Y, G, modellar):
        from sklearn.model_selection import GroupShuffleSplit

        q = []
        for nom, K in modellar.items():
            ballar, vaqtlar, par = [], [], 0
            for u in range(self.n_takror):
                gss = GroupShuffleSplit(n_splits=1, test_size=0.3,
                                        random_state=u)
                tr, te = next(gss.split(X, Y, groups=G))
                Xtr, Ytr = self._seq(X, Y, G, tr)
                Xte, Yte = self._seq(X, Y, G, te)
                a, dt, par = self._oqit(K, Xtr, Ytr, Xte, Yte, u)
                ballar.append(a)
                vaqtlar.append(dt)

            q.append({"model": nom, "parametr": par,
                      "aniqlik": round(float(np.mean(ballar)), 4),
                      "std": round(float(np.std(ballar)), 4),
                      "min": round(min(ballar), 4),
                      "maks": round(max(ballar), 4),
                      "vaqt_s": round(float(np.mean(vaqtlar)), 2)})

        d = pd.DataFrame(q).sort_values("aniqlik", ascending=False)
        print(d.to_string(index=False))

        eng = d.iloc[0]
        # ⚠️ eng.std — pandas METODI! eng["std"] yozing
        print(f"\n  🏆 {eng['model']}: "
              f"{eng['aniqlik']:.1%} ± {eng['std']:.1%}")
        # ⭐ farq STATISTIK jihatdan MA'NOLIMI?
        if len(d) > 1:
            ikki = d.iloc[1]
            farq = eng["aniqlik"] - ikki["aniqlik"]
            chegara = 2 * max(eng["std"], ikki["std"])
            print(f"  {'⚠️' if farq < chegara else '✅'} "
                  f"{eng['model']} ↔ {ikki['model']} farqi {farq:.1%}, "
                  f"shovqin chegarasi {chegara:.1%}")
            if farq < chegara:
                print("     💥 FARQ SHOVQIN ICHIDA — xulosa chiqarmang!")
        return d

    # ───────────────── sizib chiqishni ko'rsatish
    def sizib_chiqish(self, X, Y, G, K):
        """💥 Tasodifiy bo'lish vs guruh bo'yicha bo'lish."""
        from sklearn.model_selection import GroupShuffleSplit

        r = np.random.RandomState(0)
        idx = r.permutation(len(X))
        bol = int(len(X) * 0.7)
        a1 = self._oqit(K, *self._seq(X, Y, G, idx[:bol]),
                        *self._seq(X, Y, G, idx[bol:]), 0)[0]

        gss = GroupShuffleSplit(n_splits=1, test_size=0.3, random_state=0)
        tr, te = next(gss.split(X, Y, groups=G))
        a2 = self._oqit(K, *self._seq(X, Y, G, tr),
                        *self._seq(X, Y, G, te), 0)[0]

        print(f"  💥 tasodifiy bo'lish : {a1:.1%}")
        print(f"  ✅ guruh bo'yicha    : {a2:.1%}")
        print(f"  ⚠️ farq: {(a1-a2)*100:+.1f} punkt")
        return a1, a2
```

### 📦 Model sinflari

```python
class MLP(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.f = nn.Sequential(nn.Linear(d, h), nn.ReLU(), nn.Linear(h, 1))

    def forward(s, x):
        return s.f(x)


class CNN(nn.Module):
    def __init__(s, d=26, h=64, k=5):
        super().__init__()
        s.c = nn.Sequential(nn.Conv1d(d, h, k, padding=k//2), nn.ReLU(),
                            nn.Conv1d(h, h, k, padding=k//2), nn.ReLU(),
                            nn.Conv1d(h, 1, 1))

    def forward(s, x):
        return s.c(x.transpose(1, 2)).transpose(1, 2)


class RNN(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.r = nn.RNN(d, h, batch_first=True)
        s.o = nn.Linear(h, 1)

    def forward(s, x):
        return s.o(s.r(x)[0])


class LSTM(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.r = nn.LSTM(d, h, batch_first=True)
        s.o = nn.Linear(h, 1)

    def forward(s, x):
        return s.o(s.r(x)[0])


class TRF(nn.Module):
    def __init__(s, d=26, h=64):
        super().__init__()
        s.p = nn.Linear(d, h)
        s.t = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(h, 4, h*2, batch_first=True,
                                       dropout=0.0), 2)
        s.o = nn.Linear(h, 1)

    def forward(s, x):
        return s.o(s.t(s.p(x)))


MODELLAR = {"MLP": MLP, "CNN": CNN, "RNN": RNN,
            "LSTM": LSTM, "Transformer": TRF}
```

### ▶️ Ishga tushirish

```python
# ⭐ bir necha fayl kerak — 53-modulda yaratganlaringizni ishlating
FAYLLAR = ["speech_01.wav", "telefon.wav", "xona_vannaxona.wav",
           "xona_katta.wav", "buzuq_guvillash.wav"]
FAYLLAR = [f for f in FAYLLAR if os.path.exists(f)]

lab = ArxitekturaLab(n_takror=3)
X, Y, G = lab.tayyorla(FAYLLAR)

print("\n① ARXITEKTURALAR")
lab.bahola(X, Y, G, MODELLAR)

print("\n② MA'LUMOT SIZIB CHIQISHI")
lab.sizib_chiqish(X, Y, G, MLP)
```

```
      model  parametr  aniqlik    std    min   maks  vaqt_s
        RNN      5953   0.6048 0.0644 0.5334 0.6894    0.24
       LSTM     23617   0.5939 0.0720 0.4938 0.6603    0.34
        MLP      1793   0.5823 0.0433 0.5396 0.6417    0.05
        CNN     28993   0.5797 0.0536 0.5208 0.6505    0.22
Transformer     68737   0.5782 0.0895 0.4673 0.6864    0.87

  🏆 RNN: 60.5% ± 6.4%
  ⚠️ RNN ↔ LSTM farqi 1.1%, shovqin chegarasi 14.4%
     💥 FARQ SHOVQIN ICHIDA — xulosa chiqarmang!

② MA'LUMOT SIZIB CHIQISHI
  💥 tasodifiy bo'lish : 72.3%
  ✅ guruh bo'yicha    : 64.2%
  ⚠️ farq: +8.2 punkt
```

> ## 💥💥 **HAMMA ANIQLIK 58–60% GA TUSHDI** — ## 2-darsda **81–85%** edi.
>
> ## 🔑 **NIMA UCHUN? — ENDI SINOV *YANGI FAYLLARDA*.** ## 2-darsda bir faylning **oxirgi 20%** i sinov edi, ## bu yerda — **butunlay boshqa yozuvlar** *(telefon, aks-sado, guvillash)*.
>
> ## 🏆🏆 **VA `shovqin chegarasi` TEKSHIRUVI ISHLADI:**
> ```
> RNN 60.5% · LSTM 59.4%  →  farq 1.1%
> std 6.4% va 7.2%        →  shovqin chegarasi 14.4%
> 💥 FARQ SHOVQIN ICHIDA — "RNN yaxshiroq" deb AYTIB BO'LMAYDI
> ```
>
> ## ⚠️ **YA'NI 2-DARSDAGI "RNN YUTDI" XULOSASI — ISHONCHSIZ.** ## U **bitta** o'lchovga asoslangan edi.
>
> ## ⭐ **VA SIZIB CHIQISH BU YERDA HAM KO'RINDI:** ## tasodifiy **72.3%** vs guruh bo'yicha **64.2%** — **8.2 punkt**.

> ## 🏆 **BU LOYIHANING QIYMATI — `std` VA "SHOVQIN CHEGARASI" TEKSHIRUVIDA.**
>
> ## 💥 **ENG KO'P UCHRAYDIGAN XATO:**
> ```
> "Model A 84.6%, model B 82.5% → A YAXSHIROQ"
>
> ⚠️ Lekin agar std = 2.1% bo'lsa:
>    farq 2.1 punkt · shovqin chegarasi 4.2 punkt
>    →  💥 FARQ SHOVQIN ICHIDA
>    →  💥 xulosa NOTO'G'RI
> ```
>
> ## ⭐ **VA `_seq()` METODI — MUHIM DETAL:** ## u ketma-ketliklarni **guruh chegarasidan o'tkazmaydi**. ## 💥 Aks holda bitta ketma-ketlik **ikki gapiruvchidan** iborat bo'ladi.

---

# 🎯 2-loyiha. Whisper ichini ochish

> **Maqsad:** "qora quti"ni **ko'rinadigan** qilish — ## qatlamlar, e'tibor, tokenlar, ishonch.

```python
class WhisperTahlilchi:
    """🔬 Whisper ning ICHIDA nima bo'layotganini ko'rsatadi."""

    def __init__(self, model="openai/whisper-tiny"):
        from transformers import (WhisperForConditionalGeneration,
                                  WhisperProcessor)
        self.proc = WhisperProcessor.from_pretrained(model)
        # ⭐ eager — usiz output_attentions JIM ravishda bo'sh qaytadi
        self.m = WhisperForConditionalGeneration.from_pretrained(
            model, attn_implementation="eager")
        self.m.eval()
        self.nom = model.split("/")[-1]

    # ───────────────── tuzilish
    def tuzilish(self):
        c = self.m.config
        enc = sum(p.numel() for p in self.m.model.encoder.parameters())
        dec = sum(p.numel() for p in self.m.model.decoder.parameters())
        print(f"  📦 {self.nom}")
        print(f"     jami     {sum(p.numel() for p in self.m.parameters())/1e6:7.1f}M")
        print(f"     encoder  {enc/1e6:7.1f}M  ({c.encoder_layers} qatlam · "
              f"{c.encoder_attention_heads} bosh)")
        print(f"     decoder  {dec/1e6:7.1f}M  ({c.decoder_layers} qatlam)  "
              f"⭐ {dec/enc:.2f}× katta")
        print(f"     d_model {c.d_model} · mel {c.num_mel_bins} · "
              f"lug'at {c.vocab_size:,}")
        return {"jami": sum(p.numel() for p in self.m.parameters()),
                "encoder": enc, "decoder": dec}

    # ───────────────── kirish
    def kirish(self, y, sr=16000):
        f = self.proc.feature_extractor(y, sampling_rate=sr,
                                        return_tensors="pt")
        print(f"  🎧 audio {len(y)/sr:.2f} s  ->  "
              f"kirish {tuple(f.input_features.shape)}")
        print(f"     ⚠️ {f.input_features.shape[-1]*0.01:.0f} s ga "
              f"TO'LDIRILDI  ->  "
              f"{(1 - len(y)/sr/30)*100:.0f}% bekorga")
        return f

    # ───────────────── encoder
    def encoder(self, f):
        with torch.no_grad():
            eo = self.m.model.encoder(f.input_features,
                                      output_attentions=True)
        print(f"  🧠 encoder chiqishi {tuple(eo.last_hidden_state.shape)}")
        print(f"     e'tibor: {len(eo.attentions)} qatlam × "
              f"{tuple(eo.attentions[0].shape)}")

        for L, A in enumerate(eo.attentions):
            a = A[0]
            H = float(-(a * torch.log(a + 1e-12)).sum(-1).mean())
            dg = float(np.mean([np.trace(a[h].numpy()) / a.shape[-1]
                                for h in range(a.shape[0])]))
            print(f"     qatlam {L}: entropiya {H:5.3f} "
                  f"(maks {np.log(a.shape[-1]):.3f}) · "
                  f"diagonal {dg:.4f} ({dg*a.shape[-1]:.0f}×)")
        return eo

    # ───────────────── tokenlar va ishonch
    def tokenlar(self, y, sr=16000, til="en", top=8):
        """🏆 Har token uchun model QANCHALIK ishonchli?"""
        f = self.proc.feature_extractor(y, sampling_rate=sr,
                                        return_tensors="pt")
        with torch.no_grad():
            g = self.m.generate(f.input_features, language=til,
                                task="transcribe",
                                output_scores=True,
                                return_dict_in_generate=True,
                                max_new_tokens=200)

        tok = self.proc.tokenizer
        ids = g.sequences[0]
        print(f"  📝 {tok.decode(ids, skip_special_tokens=True).strip()[:100]}")
        print(f"\n  {'token':>14s} {'ishonch':>9s}  ⚠️ past ishonch = xavf")

        # 💥 MUHIM: sequences PREFIKS tokenlarni ham o'z ichiga oladi,
        #    scores esa — faqat GENERATSIYA qadamlarini. Ularni moslash SHART.
        off = len(ids) - len(g.scores)

        past = []
        for i, s in enumerate(g.scores):
            p = torch.softmax(s[0], dim=-1)
            tid = int(ids[off + i])
            ish = float(p[tid])
            matn = tok.decode([tid])
            if not matn.strip() or matn.startswith("<|"):
                continue
            past.append((ish, matn))

        past.sort()
        for ish, matn in past[:top]:
            belgi = "💥" if ish < 0.5 else ("⚠️" if ish < 0.8 else "✅")
            print(f"  {belgi} {matn!r:>12s} {ish:9.4f}")

        o = float(np.mean([x[0] for x in past])) if past else 0.0
        print(f"\n  o'rtacha ishonch: {o:.4f} · "
              f"0.5 dan past: {sum(1 for x in past if x[0] < 0.5)}/{len(past)}")
        return past

    # ───────────────── hammasi
    def toliq(self, y, sr=16000):
        self.tuzilish()
        print()
        f = self.kirish(y, sr)
        print()
        self.encoder(f)
        print()
        return self.tokenlar(y, sr)
```

### ▶️ Ishga tushirish

```python
y, sr = librosa.load("speech_01.wav", sr=16000)
WhisperTahlilchi().toliq(y, sr)
```

```
  📦 whisper-tiny
     jami        37.8M
     encoder      8.2M  (4 qatlam · 6 bosh)
     decoder     29.6M  (4 qatlam)  ⭐ 3.60× katta
     d_model 384 · mel 80 · lug'at 51,865

  🎧 audio 23.51 s  ->  kirish (1, 80, 3000)
     ⚠️ 30 s ga TO'LDIRILDI  ->  22% bekorga

  🧠 encoder chiqishi (1, 1500, 384)
     qatlam 0: entropiya 2.857 · diagonal 0.0102 (15×)
     qatlam 1: entropiya 5.217 · diagonal 0.0243 (36×)
     qatlam 2: entropiya 3.957 · diagonal 0.0269 (40×)
     qatlam 3: entropiya 3.659 · diagonal 0.0128 (19×)

  📝 My name is Iván and I am excited to have you as part of our
     learning community. Before we get started, I'd like to tell you...

           token   ishonch
  💥       ' data'  0.3547
  💥        ' Iv'   0.3572
  ⚠️           '.'  0.4151
  ⚠️    ' curious'  0.4833
  ⚠️   ' learning'  0.4960
  ⚠️ ' professional' 0.5751
  ⚠️          'án'  0.5757
  ⚠️       ' Like'  0.5898

  o'rtacha ishonch: 0.8904 · 0.5 dan past: 5/71
```

> ## 🏆🏆🏆 **BU NATIJA — BUTUN MODULNING ENG YAXSHI TASDIQI.**
>
> ## 🔑 **ENG PAST ISHONCHLI IKKI TOKEN:**
> ```
> ' data'  →  0.3547
> ' Iv'    →  0.3572     ← ISMNING boshlanishi
> ```
>
> ## 💥💥 **VA KURSNING O'Z IZOHIDA AYNAN SHU IKKI SO'Z HAQIDA YOZILGAN:** ## *"Ism noto'g'ri transkripsiya qilindi, va `data scientist` iborasida `data` so'zi ham tushib qolgan."*
>
> ## ✅ **YA'NI MODELNING ISHONCH KO'RSATKICHI XATOLARNI *OLDINDAN* TOPDI.** ## Transkripsiyani **o'qimasdan ham** — ## qaysi joyda muammo borligini **aniqlash mumkin**.
>
> ## ⭐ **VA O'RTACHA ISHONCH `0.8904` — YUQORI:** ## faqat **5/71** token `0.5` dan past. ## 💡 Ya'ni model **umuman ishonchli**, ## muammo — **aniq ikki joyda**.

### 💥 Va bitta hayratlanarli topilma — ism har safar boshqacha

```
pipeline(...)  →  "My name is Yvonne ..."
generate(...)  →  "My name is Iván ..."
Google API     →  "my name is Yvonne ..."
kursning etaloni →  "My name is Ivan ..."
```

> ## 💥💥 **BIR XIL MODEL, BIR XIL AUDIO — IKKI XIL ISM.**
>
> ## 🔑 **SABAB — DEKODLASH YO'LI:** ## `pipeline` va to'g'ridan-to'g'ri `generate()` ## **turli sozlamalar** bilan ishlaydi *(chunking, timestamps, `forced_decoder_ids`)*.
>
> ## ⭐ **VA ISHONCH KO'RSATKICHI BUNI OLDINDAN AYTGAN EDI:** ## `' Iv'` tokeni **0.3572** — ya'ni model **o'zi ham ishonmagan**.
>
> ## 🏆🏆 **AMALIY XULOSA — IKKI QOIDA:**
> ```
> ① Past ishonchli tokenlarni BELGILANG
>    →  ular ko'pincha ismlar, atamalar, raqamlar
>    →  ⭐ ularni QO'LDA tekshiring
>
> ② Bitta transkripsiyaga ISHONMANG
>    →  turli dekodlash yo'llari turli natija beradi
>    →  ⭐ muhim matnlarda IKKI MARTA yuriting va solishtiring
> ```
>
> ## 🇺🇿 **VA BU — O'ZBEKCHA ISMLAR UCHUN AYNIQSA MUHIM:** ## `Ulug'bek`, `G'ulomjon`, `Shahnoza` — ## model ularni **kam ko'rgan**, ## demak **past ishonch** va **yuqori xato**.

---

## 📌 Ikki loyihaning bog'lanishi

```
① ArxitekturaLab    →  O'Z modelingizni HALOL baholash
② WhisperTahlilchi  →  TAYYOR modelning ichini ko'rish

🏆 Amalda ② dan boshlaysiz — ① faqat fine-tuning qilsangiz kerak
```

> ## 🏆 **VA IKKALASINING UMUMIY DARSI:**
> ```
> ⭐ har o'lchovni TAKRORLANG (n ≥ 3) va std ni hisobot qiling
> ⭐ guruh bo'yicha bo'ling — gapiruvchi sizib chiqmasin
> ⭐ farq shovqin ichida bo'lsa — XULOSA CHIQARMANG
> ⭐ model ishonchini o'lchang — u xatolarni oldindan ko'rsatadi
> ```

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
