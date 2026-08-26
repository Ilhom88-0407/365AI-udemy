# 🚀 36-modul mini-loyihalari

> **4 ta tayyor loyiha.** Hammasi **API kalitisiz** — `tiktoken` mahalliy ishlaydi.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import tiktoken, re, json, statistics as st
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone
```

---

# 🔬 1-loyiha. Token profileri

> **Maqsad:** loyihangizning **haqiqiy** token profilini o'lchash — taxmin qilmaslik.

```python
class TokenProfiler:
    """Matn to'plamining token xususiyatlarini o'lchaydi."""

    ENCODINGLAR = {
        "cl100k_base": "gpt-4 · gpt-3.5-turbo · text-embedding-3",
        "o200k_base":  "gpt-4o · gpt-4o-mini",
    }

    APOSTROFLAR = "'ʻ’ʼ"          # ' ʻ ’ ʼ

    def __init__(self, encoding="o200k_base"):
        self.enc_nomi = encoding
        self.enc = tiktoken.get_encoding(encoding)
        self.yozuvlar = []

    def qayd(self, tur, matn, izoh=""):
        ids = self.enc.encode(matn)
        self.yozuvlar.append({
            "tur": tur, "izoh": izoh[:24],
            "belgi": len(matn), "so'z": len(matn.split()), "token": len(ids),
            "apostrof": sum(matn.count(a) for a in self.APOSTROFLAR),
            "raqam": sum(c.isdigit() for c in matn),
            "katta": sum(c.isupper() for c in matn),
        })
        return self

    def bolaklar(self, matn, n=12):
        """Matn QANDAY bo'linganini ko'rsatadi."""
        ids = self.enc.encode(matn)
        return [self.enc.decode([i]) for i in ids[:n]]

    def eng_qimmat_sozlar(self, matn, top=10):
        """Qaysi so'zlar eng ko'p token yeyapti?"""
        n = [(len(self.enc.encode(w)), w) for w in set(matn.split())]
        return sorted(n, reverse=True)[:top]

    def hisobot(self):
        d = pd.DataFrame(self.yozuvlar)
        d["so'z/token"] = (d["so'z"] / d.token).round(3)
        d["token/belgi"] = (d.token / d.belgi).round(3)
        print(f"=== ENCODING: {self.enc_nomi} "
              f"({self.ENCODINGLAR.get(self.enc_nomi, '?')}) ===\n")
        print(d.to_string(index=False))

        print("\n=== TUR BO'YICHA O'RTACHA ===")
        print(d.groupby("tur")[["token", "so'z/token", "apostrof"]]
                .mean().round(3).to_string())

        if d.apostrof.std() > 0:
            k = d[["apostrof", "token/belgi"]].corr().iloc[0, 1]
            print(f"\napostrof ↔ token/belgi korrelyatsiyasi: {k:.3f}")
            if k > 0.4:
                print("💥 APOSTROF TOKEN ZICHLIGINI SEZILARLI OSHIRMOQDA")
        return d

    def encoding_solishtir(self, matnlar):
        """Bir xil matnni turli encodinglarda o'lchaydi."""
        q = []
        for nom in self.ENCODINGLAR:
            e = tiktoken.get_encoding(nom)
            jami = sum(len(e.encode(m)) for m in matnlar)
            q.append({"encoding": nom, "jami_token": jami,
                      "modellar": self.ENCODINGLAR[nom]})
        d = pd.DataFrame(q)
        eng = d.jami_token.min()
        d["ustama"] = ((d.jami_token / eng - 1) * 100).round(1).astype(str) + "%"
        print(d.to_string(index=False))
        return d
```

**Ishlatish:**

```python
UZ = ["Sun'iy intellekt sohasidagi so'nggi yutuqlar tibbiyot va ta'lim "
      "sohalarini tubdan o'zgartirmoqda.",
      "Kompaniyamiz 1978-yilda Toshkentda tashkil etilgan bo'lib, bugungi "
      "kunda 450 nafar xodimga ega.",
      "Iltimos, hisobotni ertaga ertalabgacha yuboring."]
EN = ["Recent advances in artificial intelligence are fundamentally "
      "transforming medicine and education.",
      "Our company was founded in 1978 in Tashkent and today employs "
      "450 people.",
      "Please send me the report by tomorrow morning."]

p = TokenProfiler("o200k_base")
for s in EN: p.qayd("ingliz", s)
for s in UZ: p.qayd("o'zbek", s)
p.hisobot()

print("\n=== ENCODING TAQQOSLASH (o'zbekcha) ===")
p.encoding_solishtir(UZ)

print("\n=== ENG QIMMAT SO'ZLAR ===")
for n, w in p.eng_qimmat_sozlar(" ".join(UZ)):
    print(f"  {n} token  {w}")

print("\n=== BO'LAKLAR ===")
print(p.bolaklar("o'zgartirmoqda"))
```

> ## 🏆 **`eng_qimmat_sozlar` — LOYIHANING ENG FOYDALI METODI.**
>
> U sizga **aynan qaysi so'zlar** byudjetingizni yeyayotganini ko'rsatadi. Bizning o'lchovimizda `o'zgartirmoqda` — **8 token** *(cl100k)*.
>
> ## 💡 **AMALIY QO'LLANMA:** agar bir so'z **6+ token** olsa va u promptingizda **tez-tez** uchrasa — **sinonimini** o'ylab ko'ring. *(Lekin ma'noni buzmang!)*

> ## ⚠️ **`encoding_solishtir` NI ALBATTA ISHGA TUSHIRING.** Bizda `o200k` o'zbekcha uchun **12% arzon** chiqdi. Sizning matningizda farq **boshqacha** bo'lishi mumkin.

---

# 💰 2-loyiha. Loyiha byudjeti rejalashtiruvchisi

> **Maqsad:** loyiha boshlanishidan **oldin** *"bu qancha turadi?"* savoliga **raqam** bilan javob berish.

```python
class LoyihaByudjet:
    """Uch senariy: prototip · pilot · ishlab chiqarish."""

    NARX = {                          # $ / 1M token (2025)
        "gpt-4o-mini":            (0.15,  0.60),
        "gpt-4o":                 (2.50, 10.00),
        "gpt-4-turbo":           (10.00, 30.00),
        "text-embedding-3-small": (0.02,  0.00),
        "text-embedding-3-large": (0.13,  0.00),
    }
    ENC = {"gpt-4o-mini": "o200k_base", "gpt-4o": "o200k_base",
           "gpt-4-turbo": "cl100k_base"}

    def __init__(self, chat="gpt-4o-mini", emb="text-embedding-3-small"):
        self.chat, self.emb = chat, emb
        self.enc = tiktoken.get_encoding(self.ENC.get(chat, "o200k_base"))

    def t(self, s):
        return len(self.enc.encode(s))

    def sorov_narxi(self, sistem, savol, kontekst="", javob_token=300):
        ki = self.t(sistem) + self.t(savol) + self.t(kontekst)
        k1, c1 = self.NARX[self.chat]
        return {"kirish_token": ki, "chiqish_token": javob_token,
                "usd": round((ki*k1 + javob_token*c1) / 1e6, 6)}

    def senariylar(self, sistem, savol, kontekst="", javob_token=300):
        bir = self.sorov_narxi(sistem, savol, kontekst, javob_token)["usd"]
        q = []
        for nom, kunlik in [("prototip", 20), ("pilot", 500),
                            ("ishlab chiqarish", 10000)]:
            q.append({"senariy": nom, "kunlik_so'rov": kunlik,
                      "kunlik_usd": round(bir*kunlik, 3),
                      "oylik_usd": round(bir*kunlik*30, 2),
                      "yillik_usd": round(bir*kunlik*365, 2)})
        d = pd.DataFrame(q)
        print(f"bir so'rov: ${bir:.6f}   (model: {self.chat})\n")
        print(d.to_string(index=False))
        return d

    def indekslash(self, hujjat_matni, yangilash_oyda=1):
        t = self.t(hujjat_matni)
        n = t / 1e6 * self.NARX[self.emb][0]
        print(f"indekslash: {t:,} token → ${n:.4f} (bir marta)")
        print(f"oylik yangilash ×{yangilash_oyda}: ${n*yangilash_oyda:.4f}")
        return n

    def modellar_solishtir(self, sistem, savol, kontekst="",
                           javob_token=300, kunlik=1000):
        q = []
        for m in ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"]:
            e = tiktoken.get_encoding(self.ENC[m])
            ki = len(e.encode(sistem + savol + kontekst))
            k1, c1 = self.NARX[m]
            bir = (ki*k1 + javob_token*c1) / 1e6
            q.append({"model": m, "kirish_token": ki,
                      "1_so'rov": round(bir, 6),
                      "oylik": round(bir*kunlik*30, 2)})
        d = pd.DataFrame(q)
        d["nisbiy"] = (d.oylik / d.oylik.min()).round(1)
        print(d.to_string(index=False))
        return d
```

**Ishlatish:**

```python
SISTEM = ("Siz O'zbekiston bankining yordamchisisiz. Faqat berilgan hujjatga "
          "asoslanib javob bering. Bilmasangiz 'operatorga murojaat qiling' deng.")
SAVOL = "Muddatli depozitning yillik foizi qancha?"
KONTEKST = "Bank hujjati bo'lagi. " * 60          # ~4 ta bo'lak

b = LoyihaByudjet("gpt-4o-mini")
print("=== SENARIYLAR ===")
b.senariylar(SISTEM, SAVOL, KONTEKST)

print("\n=== INDEKSLASH ===")
b.indekslash("Bank hujjatlari matni. " * 5000)

print("\n=== MODELLAR ===")
b.modellar_solishtir(SISTEM, SAVOL, KONTEKST, kunlik=1000)
```

> ## 🔑 **UCHTA SENARIY — CHUNKI NARX CHIZIQLI O'SADI, QAROR ESA YO'Q.**
>
> ```
> prototip  (20/kun)   →  narx AHAMIYATSIZ  →  eng yaxshi modelni oling
> pilot     (500/kun)  →  narx SEZILADI     →  o'lchay boshlang
> ishlab ch (10k/kun)  →  narx ASOSIY       →  har token muhim
> ```
>
> ## 💡 **KO'P JAMOA PROTOTIPDA `gpt-4o` BILAN BOSHLAB, ISHLAB CHIQARISHDA `mini` GA O'TADI.** Bu — **to'g'ri** strategiya, agar siz sifatni **o'lchagan** bo'lsangiz.

> ## ⚠️ **`modellar_solishtir` NATIJASIGA E'TIBOR BERING** — `nisbiy` ustuni. `gpt-4-turbo` **56×** qimmat. Bu farqni **oqlash uchun** sifat **56× yaxshi** bo'lishi kerak.

---

# 🇺🇿 3-loyiha. O'zbekcha ustama tahlilchisi

> **Maqsad:** o'zbekcha loyihangizning **haqiqiy** ustamasini o'lchash va **kamaytirish** yo'llarini topish.

```python
class UzbekUstama:
    """O'zbekcha matnning token ustamasini o'lchaydi va SABABINI topadi."""

    APOSTROFLAR = "'ʻ’ʼ"

    def __init__(self):
        self.encs = {n: tiktoken.get_encoding(n)
                     for n in ["cl100k_base", "o200k_base"]}
        self.juftliklar = []

    def qosh(self, ingliz, ozbek):
        self.juftliklar.append((ingliz, ozbek))
        return self

    def ustama(self):
        q = []
        for nom, e in self.encs.items():
            n = [len(e.encode(uz)) / len(e.encode(en))
                 for en, uz in self.juftliklar]
            q.append({"encoding": nom,
                      "o'rtacha": round(st.mean(n), 3),
                      "median": round(st.median(n), 3),
                      "eng_yomon": round(max(n), 3),
                      "eng_yaxshi": round(min(n), 3),
                      "ustama_%": f"+{(st.mean(n)-1)*100:.0f}%"})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        eng = d.loc[d["o'rtacha"].idxmin()]
        print(f"\n⭐ ENG ARZON: {eng.encoding}  ({eng['ustama_%']})")
        return d

    def sabab_tahlili(self, e="cl100k_base"):
        """Ustama QAYERDAN kelayotganini ochib beradi."""
        enc = self.encs[e]
        q = []
        for _, uz in self.juftliklar:
            for w in uz.split():
                w = w.strip(".,!?;:—")
                if not w:
                    continue
                t = len(enc.encode(w))
                q.append({"so'z": w, "token": t, "belgi": len(w),
                          "apostrof": sum(w.count(a) for a in self.APOSTROFLAR),
                          "token/belgi": round(t/len(w), 3)})
        d = pd.DataFrame(q).drop_duplicates("so'z")

        print("=== ENG QIMMAT SO'ZLAR ===")
        print(d.nlargest(8, "token").to_string(index=False))

        bor = d[d.apostrof > 0]
        yoq = d[d.apostrof == 0]
        if len(bor) and len(yoq):
            print(f"\napostrofli so'zlar : {bor['token/belgi'].mean():.3f} token/belgi "
                  f"({len(bor)} ta)")
            print(f"apostrofsizlar     : {yoq['token/belgi'].mean():.3f} token/belgi "
                  f"({len(yoq)} ta)")
            f = bor['token/belgi'].mean() / yoq['token/belgi'].mean()
            print(f"→ apostrofli so'zlar {f:.2f}× QIMMATROQ")
        return d

    def bolaklar_ko(self, sozlar):
        for s in sozlar:
            print(f"{s:18s}", end="")
            for nom, e in self.encs.items():
                b = [e.decode([i]) for i in e.encode(s)]
                print(f"  {nom[:6]} {len(b)}: {b}", end="")
            print()
```

**Ishlatish:**

```python
u = (UzbekUstama()
     .qosh("Machine learning is a field of artificial intelligence.",
           "Mashinali o'rganish — sun'iy intellekt sohasidir.")
     .qosh("The weather in Tashkent is warm today.",
           "Bugun Toshkentda ob-havo issiq.")
     .qosh("Please send me the report by tomorrow morning.",
           "Iltimos, hisobotni ertaga ertalabgacha yuboring.")
     .qosh("Artificial intelligence is changing the world rapidly.",
           "Sun'iy intellekt dunyoni tez o'zgartirmoqda.")
     .qosh("Our company was founded in 1978 in Tashkent.",
           "Kompaniyamiz 1978-yilda Toshkentda tashkil etilgan."))

print("=== USTAMA ===");        u.ustama()
print("\n=== SABAB ===");        u.sabab_tahlili()
print("\n=== BO'LAKLAR ===")
u.bolaklar_ko(["Toshkentda", "o'zgartirmoqda", "sun'iy", "hisobot"])
```

> ## 💥 **BIZNING O'LCHOVIMIZ:**
> ```
> cl100k_base  →  1.88×   (+88%)
> o200k_base   →  1.66×   (+66%)   ⭐ gpt-4o oilasi
> ```
>
> ## 🔑 **`sabab_tahlili` UCHTA SABABNI KO'RSATADI:**
> ```
> ① apostrof alohida token       "sun'iy" → ['sun', "'", 'iy']
> ② agglutinatsiya               "Toshkent"+"da" → 5 bo'lak
> ③ lug'atda o'zbekcha yo'q
> ```

> ## ⚠️⚠️ **VA MANA MUHIM OGOHLANTIRISH — USTAMANI "TUZATISHGA" URINMANG.**
>
> ```
> ❌ apostrofni o'chirish     →  imlo BUZILADI, sifat TUSHADI
> ❌ so'zlarni qisqartirish   →  ma'no YO'QOLADI
> ❌ inglizchada yozish       →  foydalanuvchi TUSHUNMAYDI
>
> ✅ gpt-4o oilasini tanlash  →  12% BEPUL tejash
> ✅ sistem promptni QISQARTIRISH  →  u HAR chaqiruvda ketadi
> ✅ RAG bo'laklarini KICHIKROQ qilish
> ✅ max_tokens ni belgilash
> ```
>
> ## 🏆 **O'ZBEK TILI QIMMAT — BU FAKT, MUAMMO EMAS.** Uni **hisobga oling**, unga **qarshi kurashmang**.

---

# 🛡️ 4-loyiha. Narx nazorati qatlami

> **Maqsad:** ishlab chiqarishda **kutilmagan hisob** kelmasligini kafolatlash.

```python
class NarxNazorat:
    """Har chaqiruvni hisoblaydi, chegaradan oshsa TO'XTATADI, jurnal yuritadi."""

    def __init__(self, model_obj, kunlik_limit_usd=5.0,
                 sorov_limit_usd=0.05, narx=(0.15, 0.60),
                 encoding="o200k_base", jurnal_fayli=None):
        self.m = model_obj
        self.kunlik_limit = kunlik_limit_usd
        self.sorov_limit = sorov_limit_usd
        self.k1, self.c1 = narx
        self.enc = tiktoken.get_encoding(encoding)
        self.jurnal_fayli = jurnal_fayli
        self.sarf = 0.0
        self.kun = datetime.now(timezone.utc).date()
        self.jurnal = []

    def _yangi_kun(self):
        b = datetime.now(timezone.utc).date()
        if b != self.kun:
            self.kun, self.sarf = b, 0.0

    def _narx(self, ki, ch):
        return (ki*self.k1 + ch*self.c1) / 1e6

    def taxmin(self, prompt, max_tokens=400):
        return self._narx(len(self.enc.encode(prompt)), max_tokens)

    def invoke(self, prompt, max_tokens=400, **kw):
        self._yangi_kun()
        ki = len(self.enc.encode(prompt))
        t = self._narx(ki, max_tokens)

        if t > self.sorov_limit:
            raise RuntimeError(
                f"💥 SO'ROV JUDA QIMMAT: ${t:.5f} > ${self.sorov_limit}\n"
                f"   kirish {ki:,} token — promptni QISQARTIRING yoki "
                f"max_tokens ni kamaytiring")
        if self.sarf + t > self.kunlik_limit:
            raise RuntimeError(
                f"💥 KUNLIK LIMIT: ${self.sarf:.4f} + ${t:.5f} "
                f"> ${self.kunlik_limit}")

        javob = self.m.invoke(prompt, **kw)
        chi = len(self.enc.encode(getattr(javob, "content", str(javob))))
        h = self._narx(ki, chi)
        self.sarf += h

        yozuv = {"vaqt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                 "kirish": ki, "chiqish": chi, "taxmin": round(t, 6),
                 "haqiqiy": round(h, 6), "kunlik_jami": round(self.sarf, 6)}
        self.jurnal.append(yozuv)
        if self.jurnal_fayli:
            with open(self.jurnal_fayli, "a", encoding="utf-8") as f:
                f.write(json.dumps(yozuv, ensure_ascii=False) + "\n")
        return javob

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print(f"\nJAMI ${self.sarf:.4f} / ${self.kunlik_limit}  "
              f"({self.sarf/self.kunlik_limit:.0%})")
        print(f"o'rtacha so'rov: ${d.haqiqiy.mean():.6f}")
        xato = (d.haqiqiy / d.taxmin - 1).mean()
        print(f"taxmin xatosi: {xato:+.1%}  "
              f"({'taxmin ORTIQCHA' if xato < 0 else '⚠️ taxmin KAM'})")
```

**Ishlatish (soxta model bilan — API kalitisiz):**

```python
class SoxtaModel:
    """Sinov uchun — LLM o'rniga."""
    class J:
        def __init__(self, c): self.content = c
    def invoke(self, p, **kw):
        return self.J("Bu soxta javob. " * 20)

n = NarxNazorat(SoxtaModel(), kunlik_limit_usd=0.001,
                jurnal_fayli="narx_jurnali.jsonl")

for i in range(5):
    try:
        n.invoke(f"Bu {i}-savolim. " + "Kontekst matni. " * 50)
    except RuntimeError as e:
        print(e)
        break
n.hisobot()
```

> ## 🏆 **UCHTA HIMOYA QATLAMI:**
> ```
> ① sorov_limit    →  bitta QIMMAT so'rovni to'xtatadi
> ② kunlik_limit   →  kunlik byudjetni himoya qiladi
> ③ jurnal_fayli   →  ⭐ nima sarflanganini QAYTA TIKLASH mumkin
> ```
>
> ## 💥 **HAQIQIY XAVF — CHEKSIZ SIKL.** Agent noto'g'ri vosita tanlab, o'zini **qayta-qayta** chaqirsa, bir kechada **yuzlab dollar** ketishi mumkin. `max_iterations` **va** narx limiti — **ikkalasi ham** kerak.
>
> ## ⚠️ **`taxmin xatosi` NI KUZATIB BORING.** Agar u **doim manfiy** bo'lsa *(taxmin ortiqcha)* — `max_tokens` ni **kamaytiring**, chunki siz **haddan tashqari ehtiyot** qilyapsiz va so'rovlar **behuda rad etilmoqda**.

---

## 🎯 Loyihalarni birlashtirish

```
1-loyiha (profiler)      →  matningiz QANDAY tokenlanadi?
        ↓
3-loyiha (uz ustama)     →  o'zbekcha necha % qimmat?
        ↓
2-loyiha (byudjet)       →  loyiha qancha turadi?
        ↓
4-loyiha (nazorat)       →  ⭐ byudjetdan OSHMASLIK kafolati
```

> ## 🚀 **BU TO'RTTASINI `narx_asos.py` GA YIG'ING** va 37–42-modullarda **import qilib** ishlating.

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
