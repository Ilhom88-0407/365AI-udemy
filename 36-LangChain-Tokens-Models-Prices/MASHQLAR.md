# 📝 36-modul mashqlari

> **30 ta mashq** — 🟢 Oson · 🟡 O'rta · 🔴 Qiyin
>
> ## ⭐ **HAMMASI API KALITISIZ** — `tiktoken` mahalliy ishlaydi.

## ⚙️ Tayyorgarlik

```bash
pip install tiktoken pandas
```

```python
import tiktoken, pandas as pd, re, statistics as st

enc  = tiktoken.get_encoding("cl100k_base")   # gpt-4, gpt-3.5
o200 = tiktoken.get_encoding("o200k_base")    # gpt-4o oilasi

NARX = {"gpt-4o-mini": (0.15, 0.60),
        "gpt-4o":      (2.50, 10.00),
        "gpt-4-turbo": (10.00, 30.00),
        "text-embedding-3-small": (0.02, 0.0)}

JUFTLIKLAR = [
    ("Machine learning is a field of artificial intelligence.",
     "Mashinali o'rganish — sun'iy intellekt sohasidir."),
    ("The weather in Tashkent is warm today.",
     "Bugun Toshkentda ob-havo issiq."),
    ("Please send me the report by tomorrow morning.",
     "Iltimos, hisobotni ertaga ertalabgacha yuboring."),
    ("Artificial intelligence is changing the world rapidly.",
     "Sun'iy intellekt dunyoni tez o'zgartirmoqda."),
    ("Our company was founded in 1978 in Tashkent.",
     "Kompaniyamiz 1978-yilda Toshkentda tashkil etilgan."),
]
```

---

# 🟢 OSON *(1–10)*

**M1.** Token so'zning qanchasi?

**M2.** `?` tokenining ID'si nechchi?

**M3.** Past ID nimani anglatadi?

**M4.** Kirish va chiqish — qaysi biri qimmat?

**M5.** `gpt-4o` kontekst oynasi qancha?

<details>
<summary>✅ Javoblar M1–M5</summary>

**M1.** ## **~3/4**. Kurs *"100 token ≈ 75 so'z"*; biz **90 so'z** o'lchadik *(inglizcha ilmiy matn)*.

**M2.** ## **30**.

**M3.** Token **tez-tez uchraydi** — BPE lug'ati **chastota** bo'yicha quriladi.

**M4.** ## **Chiqish** — 3–4× qimmat.

**M5.** ## **128 000 token** — kirish va chiqish **birgalikda**.

</details>

**M6.** `cl100k_base` va `o200k_base` lug'ati necha?

**M7.** O'zbekcha ustama necha baravar?

**M8.** `text-embedding-3-small` narxi?

**M9.** Nima uchun o'zbekcha ko'proq token oladi?

**M10.** Kurs qaysi modelni tavsiya qiladi va bu bugun to'g'rimi?

<details>
<summary>✅ Javoblar M6–M10</summary>

**M6.** ## **100,277** va **200,019**.

**M7.** ## **1.88×** *(cl100k)* · ## **1.66×** *(o200k)* — o'lchangan.

**M8.** ## **$0.02 / 1M** — chat modelidan **7.5× arzon**.

**M9.** ① **apostrof** alohida token · ② **agglutinatsiya** · ③ lug'atda o'zbekcha **yo'q**.

**M10.** Kurs `gpt-4` deydi. ## **Bugun noto'g'ri** — `gpt-4o-mini` **56× arzon**, oynasi **16× katta**, tezroq.

</details>

---

# 🟡 O'RTA *(11–22)*

**M11.** ⭐ O'z matningizni tokenlarga bo'lib ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
def tahlil(matn, e=enc, n=20):
    ids = e.encode(matn)
    print(f"belgilar {len(matn)}  so'zlar {len(matn.split())}  tokenlar {len(ids)}")
    print(f"so'z/token = {len(matn.split())/len(ids):.3f}")
    for i in ids[:n]:
        print(f"  {i:6d}  {e.decode([i])!r}")

tahlil("Sun'iy intellekt dunyoni o'zgartirmoqda.")
```

</details>

**M12.** ⭐ Kursning `what` misolini takrorlang.

<details>
<summary>✅ Yechim</summary>

```python
for s in ["What would you like to have for dinner?",
          "I don't mind what we have for dinner.",
          "Have you listened to What a Wonderful World by Louis Armstrong?"]:
    ids = enc.encode(s)
    w = [(i, enc.decode([i])) for i in ids if "hat" in enc.decode([i]).lower()]
    print(f"{len(ids):3d} token   {w}")
```

```
  9 token   [(3923, 'What')]
 10 token   [(1148, ' what')]
 12 token   [(3639, ' What')]
```

## ✅ **KURS DA'VOSI TASDIQLANDI** — uchta turli ID.

</details>

**M13.** ⭐⭐ O'zbekcha ustamani o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
q = []
for en, uz in JUFTLIKLAR:
    q.append({"cl_en": len(enc.encode(en)),   "cl_uz": len(enc.encode(uz)),
              "cl":  round(len(enc.encode(uz))/len(enc.encode(en)), 2),
              "o2_en": len(o200.encode(en)),  "o2_uz": len(o200.encode(uz)),
              "o2": round(len(o200.encode(uz))/len(o200.encode(en)), 2)})
d = pd.DataFrame(q)
print(d.to_string(index=False))
print(f"\nO'RTACHA  cl100k {d.cl.mean():.2f}×   o200k {d.o2.mean():.2f}×")
print(f"→ gpt-4o oilasi {(1 - d.o2.mean()/d.cl.mean()):.0%} arzonroq")
```

```
O'RTACHA  cl100k 1.88×   o200k 1.66×
→ gpt-4o oilasi 12% arzonroq
```

</details>

**M14.** ⭐ O'zbekcha so'zlar qanday bo'linishini ko'ring.

<details>
<summary>✅ Yechim</summary>

```python
for s in ["xursandman", "o'zgartirmoqda", "Toshkentda", "kompaniyamiz",
          "sun'iy", "hisobot"]:
    a = [enc.decode([i]) for i in enc.encode(s)]
    b = [o200.decode([i]) for i in o200.encode(s)]
    print(f"{s:18s} cl100k {len(a)}: {a}")
    print(f"{'':18s} o200k  {len(b)}: {b}")
```

## 💥 **`Toshkentda`:** `cl100k` → 5 token, `o200k` → **4 token** *(`kent` **butun**!)*.

</details>

**M15.** ⭐ Apostrof narxini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
for a, b in [("o'zbek","ozbek"), ("sun'iy","suniy"),
             ("g'alaba","galaba"), ("ma'lumot","malumot")]:
    print(f"{a:12s} {len(enc.encode(a))} token   "
          f"{b:12s} {len(enc.encode(b))} token   "
          f"farq +{len(enc.encode(a))-len(enc.encode(b))}")
```

## ⚠️ **APOSTROFNI O'CHIRMANG.** Tejash **arzimas**, imlo **buziladi**, model ma'noni **yomonroq** tushunadi.

</details>

**M16.** Turli matn turlarida nisbatni o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
NAMUNALAR = {
    "ilmiy (en)": "Machine learning algorithms generalize from data.",
    "oddiy (en)": "Hey how are you doing today my friend",
    "kod":        "def hello(name): return f'Hello, {name}!'",
    "URL":        "https://github.com/langchain-ai/langchain/blob/master/README.md",
    "emoji":      "Salom 😊 bugun ajoyib kun 🌞🎉",
    "o'zbekcha":  "Sun'iy intellekt dunyoni o'zgartirmoqda",
}
for nom, s in NAMUNALAR.items():
    t, w = len(enc.encode(s)), len(s.split())
    print(f"{nom:12s} so'z {w:2d}  token {t:3d}  100 token ≈ {100*w/t:5.1f} so'z")
```

## 🔑 ***"75 so'z"* — faqat inglizcha ODDIY matn uchun.**

</details>

**M17.** ⭐ Loyihangiz narxini hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
def narx(kunlik, kir_tok, chi_tok, model="gpt-4o-mini", uz=False):
    ki, ch = NARX[model]
    u = 1.88 if uz else 1.0
    k = kunlik * u * (kir_tok*ki + chi_tok*ch) / 1e6
    return {"kunlik": round(k, 4), "oylik": round(k*30, 2),
            "yillik": round(k*365, 2)}

print("ingliz :", narx(500, 800, 300))
print("o'zbek :", narx(500, 800, 300, uz=True))
```

</details>

**M18.** ⭐⭐ Uch modelni solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
d = pd.DataFrame([
    {"model": m, "kir": ki, "chi": ch}
    for m, (ki, ch) in NARX.items() if m.startswith("gpt")])
d["1k_en"] = (1000*(500*d.kir + 200*d.chi)/1e6).round(3)
d["1k_uz"] = (d["1k_en"] * 1.88).round(3)
d["nisbiy"] = (d["1k_en"] / d["1k_en"].min()).round(1)
print(d.to_string(index=False))
```

## 💥 **`gpt-4-turbo` — `gpt-4o-mini` dan 56× QIMMAT.**

</details>

**M19.** Kontekst oynasini so'zlarda hisoblang.

<details>
<summary>✅ Yechim</summary>

```python
SW = 0.90        # so'z/token, inglizcha (o'lchangan)
UZ = 1.88
for m, n in [("gpt-4o", 128000), ("gpt-4o-mini", 128000), ("gpt-4", 8192)]:
    print(f"{m:14s} {n:>7,} token ≈ {n*SW:>8,.0f} en so'z "
          f"≈ {n*SW/UZ:>8,.0f} uz so'z")
```

## 💥 **O'zbekcha oynada deyarli YARIM baravar kam matn sig'adi.**

</details>

**M20.** ⭐ Matn kontekstga sig'adimi?

<details>
<summary>✅ Yechim</summary>

```python
def sigadimi(matn, oyna=128000, javob=4000, e=o200):
    t = len(e.encode(matn))
    q = oyna - javob - t
    print(f"matn {t:,}   javob uchun {javob:,}   qoldiq {q:,}")
    print("✅ sig'adi" if q > 0 else "❌ SIG'MAYDI — RAG kerak")
    return q > 0

sigadimi("Salom dunyo " * 20000)
```

## ⚠️ **`javob` uchun joy AJRATING** — oyna kirish **va** chiqish uchun umumiy.

</details>

**M21.** ⭐ Embedding va chat narxini solishtiring.

<details>
<summary>✅ Yechim</summary>

```python
matn = "Bank hujjati matni. " * 5000
t = len(o200.encode(matn))
emb = t/1e6 * NARX["text-embedding-3-small"][0]
chat = t/1e6 * NARX["gpt-4o-mini"][0]
print(f"{t:,} token")
print(f"embedding: ${emb:.4f}")
print(f"chat kirish: ${chat:.4f}   → {chat/emb:.1f}× qimmat")
```

## 🔑 **INDEKSLASH DEYARLI BEPUL.** Xarajat — **javob yaratishda**.

</details>

**M22.** ⭐ Ortiqcha bo'shliqni tozalashning ta'sirini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
MATN = ("Sun'iy   intellekt,  ayniqsa  mashinali  o'rganish,   "
        "tibbiyot va ta'lim sohalarini  tubdan o'zgartirmoqda.")
asos = len(enc.encode(MATN))
tozalangan = len(enc.encode(" ".join(MATN.split())))
print(f"asl {asos}  tozalangan {tozalangan}  tejash {(1-tozalangan/asos):.1%}")
```

## ✅ **BU TOZALASH XAVFSIZ** — ma'no **o'zgarmaydi**.
## ❌ **Kichik harf yoki tinish belgisini o'chirish — QILMANG** *(34-moduldagi `cleaner` xatosining takrori)*.

</details>

---

# 🔴 QIYIN *(23–30)*

**M23.** ⭐⭐ Token byudjeti kalkulyatorini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class TokenByudjet:
    ENC = {"gpt-4o-mini": "o200k_base", "gpt-4o": "o200k_base",
           "gpt-4": "cl100k_base", "gpt-4-turbo": "cl100k_base"}

    def __init__(self, model="gpt-4o-mini"):
        self.model = model
        self.enc = tiktoken.get_encoding(self.ENC[model])

    def hisobla(self, prompt, javob, kunlik):
        ki, ch = len(self.enc.encode(prompt)), len(self.enc.encode(javob))
        k1, c1 = NARX[self.model]
        kunlik_usd = kunlik * (ki*k1 + ch*c1) / 1e6
        return {"kirish": ki, "chiqish": ch,
                "kunlik": round(kunlik_usd, 4),
                "oylik": round(kunlik_usd*30, 2),
                "yillik": round(kunlik_usd*365, 2)}

b = TokenByudjet()
print(b.hisobla("Siz bank yordamchisisiz. Savol: Depozit foizi qancha?",
                "Muddatli depozit yillik 18% dan 22% gacha foiz keltiradi.",
                kunlik=500))
```

## 🏆 **LOYIHANI BOSHLASHDAN OLDIN SHU HISOBNI QILING.**

</details>

**M24.** ⭐⭐ O'z domeningizda ustamani o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
def uz_ustama(juftliklar, e=enc):
    n = [len(e.encode(uz))/len(e.encode(en)) for en, uz in juftliklar]
    print(f"o'rtacha {st.mean(n):.2f}×  median {st.median(n):.2f}×  "
          f"eng yomon {max(n):.2f}×  eng yaxshi {min(n):.2f}×")
    print(f"→ o'zbekcha loyiha {(st.mean(n)-1)*100:.0f}% QIMMATROQ")
    return n

uz_ustama(JUFTLIKLAR)
uz_ustama(JUFTLIKLAR, o200)
```

## ⚠️ **BIZNING `1.88×` — 5 ta jumla bo'yicha.** O'z domeningizda **o'lchang** — texnik matnda nisbat **boshqacha** bo'lishi mumkin.

</details>

**M25.** ⭐⭐ RAG loyihasining to'liq byudjetini rejalashtiring.

<details>
<summary>✅ Yechim</summary>

```python
class RagByudjet:
    def __init__(self, e="o200k_base"):
        self.enc = tiktoken.get_encoding(e)

    def hisobla(self, hujjatlar, kunlik, bolak=1000, top_k=4,
                javob=300, chat="gpt-4o-mini", yangilash_oyda=1):
        emb_t = len(self.enc.encode(hujjatlar))
        emb = emb_t/1e6 * NARX["text-embedding-3-small"][0]
        ki, ch = NARX[chat]
        kirish = top_k*bolak + 120
        sorov = (kirish*ki + javob*ch) / 1e6
        return {"indeks_token": emb_t, "indeks_usd": round(emb, 4),
                "1_sorov_usd": round(sorov, 6),
                "oylik_chat": round(sorov*kunlik*30, 2),
                "oylik_emb": round(emb*yangilash_oyda, 4),
                "oylik_jami": round(sorov*kunlik*30 + emb*yangilash_oyda, 2)}

print(RagByudjet().hisobla("Bank hujjati matni. " * 5000, kunlik=300))
```

## 💡 **XULOSA:** hujjatlarni **ko'proq** bo'laklang — bu arzon. Tejashni **javob uzunligida** qidiring.

</details>

**M26.** ⭐⭐ OpenAI vs Ollama — tenglashuv nuqtasini toping.

<details>
<summary>✅ Yechim</summary>

```python
def tenglashuv(server=1200, elektr_oy=15, yillar=3,
               kir_tok=800, chi_tok=300, uz=1.88):
    ki, ch = NARX["gpt-4o-mini"]
    bir_sorov = uz * (kir_tok*ki + chi_tok*ch) / 1e6
    ollama_jami = server + elektr_oy*12*yillar
    sorovlar = ollama_jami / bir_sorov
    kunlik = sorovlar / (365*yillar)
    print(f"Ollama {yillar} yilda: ${ollama_jami:,.0f}")
    print(f"Shu pulga OpenAI: {sorovlar:,.0f} so'rov = {kunlik:,.0f} so'rov/kun")
    print(f"→ kuniga {kunlik:,.0f} dan KO'P bo'lsa — Ollama arzonroq")

tenglashuv()
```

## ⚠️ **HISOBGA OLINMAGAN:** dasturchi vaqti, sifat farqi, va ## ⭐ **ma'lumot chiqmasligi** *(ba'zan baholab bo'lmaydi)*.

</details>

**M27.** ⭐⭐ Narx nazorati qatlamini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class NarxNazorat:
    def __init__(self, model_obj, kunlik_limit=5.0,
                 narx=(0.15, 0.60), e="o200k_base"):
        self.m, self.limit = model_obj, kunlik_limit
        self.k1, self.c1 = narx
        self.enc = tiktoken.get_encoding(e)
        self.sarf, self.jurnal = 0.0, []

    def _n(self, ki, ch):
        return (ki*self.k1 + ch*self.c1) / 1e6

    def invoke(self, prompt, max_tokens=400):
        ki = len(self.enc.encode(prompt))
        taxmin = self._n(ki, max_tokens)
        if self.sarf + taxmin > self.limit:
            raise RuntimeError(f"💥 LIMIT: ${self.sarf:.4f}+${taxmin:.4f}"
                               f" > ${self.limit}")
        r = self.m.invoke(prompt)
        chi = len(self.enc.encode(r.content))
        h = self._n(ki, chi)
        self.sarf += h
        self.jurnal.append({"kir": ki, "chi": chi, "usd": round(h, 6),
                            "jami": round(self.sarf, 6)})
        return r

    def hisobot(self):
        print(pd.DataFrame(self.jurnal).to_string(index=False))
        print(f"\nJAMI ${self.sarf:.4f}/${self.limit} "
              f"({self.sarf/self.limit:.0%})")
```

## 💥 **HAQIQIY XAVF:** cheksiz siklga tushgan agent bir kechada **yuzlab dollar** sarflashi mumkin.

</details>

**M28.** ⭐⭐ Prompt siqish strategiyalarini o'lchang.

<details>
<summary>✅ Yechim</summary>

```python
PROMPT = """Siz professional bank yordamchisisiz. Sizning vazifangiz mijozlarga
yordam berishdir. Iltimos, har doim xushmuomala bo'ling. Javoblaringiz aniq va
tushunarli bo'lishi kerak. Agar savolga javob bilmasangiz, operatorga
yo'naltiring. Mijoz savoli: {savol}"""

QISQA = """Siz bank yordamchisisiz. Aniq va xushmuomala javob bering.
Bilmasangiz operatorga yo'naltiring. Savol: {savol}"""

for nom, p in [("to'liq", PROMPT), ("qisqa", QISQA)]:
    print(f"{nom:8s} {len(o200.encode(p)):3d} token")
t1, t2 = len(o200.encode(PROMPT)), len(o200.encode(QISQA))
print(f"\ntejash: {(1-t2/t1):.0%}  →  1000 so'rov/kun da "
      f"${(t1-t2)*1000*30*0.15/1e6:.2f}/oy")
```

## 🔑 **SISTEM PROMPT HAR CHAQIRUVDA YUBORILADI.** 50 token tejash — kuniga 1000 so'rovda **yiliga sezilarli**.
## ⚠️ **LEKIN SIFATNI O'LCHANG** — qisqa prompt yomonroq javob bersa, tejash **ma'nosiz**.

</details>

**M29.** ⭐⭐⭐ Model tanlash matritsasini yozing.

<details>
<summary>✅ Yechim</summary>

```python
MODELLAR = [
    {"model":"gpt-4o-mini","kir":0.15,"chi":0.60,"oyna":128000,
     "tezlik":1.0,"sifat":7,"uz_tok":1.66},
    {"model":"gpt-4o","kir":2.50,"chi":10.00,"oyna":128000,
     "tezlik":2.5,"sifat":9,"uz_tok":1.66},
    {"model":"gpt-4","kir":30.00,"chi":60.00,"oyna":8192,
     "tezlik":5.0,"sifat":8,"uz_tok":1.88},
]
d = pd.DataFrame(MODELLAR)
d["1k_uz_usd"] = (1000*(500*d.kir + 200*d.chi)/1e6 * d.uz_tok).round(3)
d["sifat/narx"] = (d.sifat / d["1k_uz_usd"]).round(1)
d["sifat/tezlik"] = (d.sifat / d.tezlik).round(1)
print(d[["model","1k_uz_usd","oyna","tezlik","sifat",
         "sifat/narx","sifat/tezlik"]].to_string(index=False))
print("\n🏆 sifat/narx bo'yicha eng yaxshi:",
      d.loc[d["sifat/narx"].idxmax(), "model"])
```

## ⚠️ **`sifat` USTUNI — SUBYEKTIV.** Uni **o'z vazifangizda o'lchang** *(34-moduldagi "oltin to'plam" usuli)*.

</details>

**M30.** ⭐⭐⭐ To'liq token profilerini yozing.

<details>
<summary>✅ Yechim</summary>

```python
class TokenProfiler:
    """Loyihangizning HAQIQIY token profilini chiqaradi."""

    def __init__(self, e="o200k_base"):
        self.enc = tiktoken.get_encoding(e)
        self.yozuvlar = []

    def qayd(self, tur, matn):
        self.yozuvlar.append({
            "tur": tur, "belgi": len(matn), "so'z": len(matn.split()),
            "token": len(self.enc.encode(matn)),
            "apostrof": matn.count("'") + matn.count("ʻ") + matn.count("’"),
        })
        return self

    def hisobot(self):
        d = pd.DataFrame(self.yozuvlar)
        d["so'z/token"] = (d["so'z"] / d.token).round(3)
        d["token/belgi"] = (d.token / d.belgi).round(3)
        print(d.to_string(index=False))
        print("\n=== TUR BO'YICHA ===")
        print(d.groupby("tur")[["token", "so'z/token"]].mean().round(3).to_string())
        korr = d[["apostrof", "token"]].corr().iloc[0, 1]
        print(f"\napostrof ↔ token korrelyatsiyasi: {korr:.3f}")
        if korr > 0.5:
            print("💥 APOSTROF TOKEN SONINI SEZILARLI OSHIRMOQDA")
        return d

p = TokenProfiler()
for en, uz in JUFTLIKLAR:
    p.qayd("ingliz", en).qayd("o'zbek", uz)
p.hisobot()
```

## 🏆 **BU PROFILERNI HAQIQIY MA'LUMOTINGIZDA ISHLATING** — sistem promptlar, foydalanuvchi savollari, hujjat bo'laklari. Byudjetni **taxmin** emas, **o'lchov** asosida tuzasiz.

</details>

---

🏠 [Modul boshiga](README.md) · 🚀 [Mini-loyihalar](LOYIHALAR.md)
