# 🚀 40-modul mini-loyihalari

> **3 ta tayyor loyiha.** Parser sinovlari **API kalitisiz** ishlaydi.

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langchain langchain-core langchain-classic
pip install pydantic python-dateutil pandas python-dotenv
```

```python
import warnings; warnings.filterwarnings("ignore")
import re, json, importlib.util, os
from datetime import date, datetime
from typing import Literal, Optional
import pandas as pd
from pydantic import BaseModel, Field, ValidationError
from dateutil import parser as dparser

from langchain_core.output_parsers import (StrOutputParser,
                                           CommaSeparatedListOutputParser,
                                           NumberedListOutputParser,
                                           MarkdownListOutputParser,
                                           JsonOutputParser,
                                           PydanticOutputParser)
```

---

# 🛡️ 1-loyiha. Xavfsiz parser qatlami

> **Maqsad:** har qanday parserni **himoya**, **tozalash**, **tekshiruv** va **statistika** bilan o'rash.

```python
class XavfsizParser:
    """Parser + tozalash + tekshiruv + qayta urinish + statistika."""

    def __init__(self, parser, nom="", tozalovchi=None, tekshiruv=None,
                 zaxira_parser=None):
        self.p = parser
        self.nom = nom or type(parser).__name__
        self.tozala = tozalovchi
        self.tekshir = tekshiruv
        self.zaxira = zaxira_parser
        self.jurnal = []

    def _qayd(self, holat, izoh=""):
        self.jurnal.append({"holat": holat, "izoh": izoh[:60]})

    def invoke(self, kirish):
        matn = getattr(kirish, "content", kirish)

        # ① asosiy parser
        try:
            n = self.p.invoke(kirish)
            manba = "asosiy"
        except Exception as e:
            # ② zaxira parser
            if self.zaxira:
                try:
                    n = self.zaxira.invoke(kirish)
                    manba = "zaxira"
                    self._qayd("zaxira", type(e).__name__)
                except Exception as e2:
                    self._qayd("xato", f"{type(e2).__name__}")
                    return {"ok": False, "sabab": f"{type(e2).__name__}: {str(e2)[:90]}",
                            "xom": matn[:120]}
            else:
                self._qayd("xato", type(e).__name__)
                return {"ok": False, "sabab": f"{type(e).__name__}: {str(e)[:90]}",
                        "xom": matn[:120]}

        # ③ tozalash
        if self.tozala:
            asl = n
            n = self.tozala(n)
            if n != asl:
                self._qayd("tozalandi")

        # ④ tekshiruv
        if self.tekshir:
            ok, sabab = self.tekshir(n)
            if not ok:
                self._qayd("tekshiruv_xato", sabab)
                return {"ok": False, "sabab": sabab, "xom": n}

        self._qayd("ok", manba)
        return {"ok": True, "natija": n, "manba": manba}

    def hisobot(self):
        if not self.jurnal:
            print(f"{self.nom}: jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        n = len(d)
        ok = (d.holat == "ok").sum()
        print(f"{self.nom:32s} {ok}/{n} ({ok/n:.0%})")
        print(d.holat.value_counts().to_string())
        if (d.holat == "zaxira").any():
            print(f"⚠️ {int((d.holat=='zaxira').sum())} marta ZAXIRA parser ishladi "
                  f"— asosiy parserni qayta ko'ring")
        return d


# ── Tayyor tozalovchilar va tekshiruvlar ──
RUXSATSIZ = {"and", "va", "or", "yoki", ""}

def royxat_tozala(elementlar, max_uzunlik=60):
    toza = []
    for x in elementlar:
        x = re.sub(r"^\s*\d+[\.\)]\s*", "", str(x)).strip(" .\n-•")
        x = re.sub(r"^(and|va|or|yoki)\s+", "", x, flags=re.I).strip()
        if x.lower() not in RUXSATSIZ and len(x) <= max_uzunlik:
            toza.append(x)
    return toza


def son_tekshiruv(n):
    def f(x):
        return (len(x) == n, f"{n} ta kutilgan, {len(x)} olindi")
    return f


def oq_royxat_tekshiruv(ruxsat):
    def f(x):
        y = str(x).strip().lower().strip(".")
        return (y in ruxsat, f"kutilmagan qiymat: {y[:30]!r}")
    return f
```

**Ishlatish:**

```python
xp = XavfsizParser(
    CommaSeparatedListOutputParser(),
    nom="ro'yxat(3)",
    tozalovchi=royxat_tozala,
    tekshiruv=son_tekshiruv(3),
    zaxira_parser=NumberedListOutputParser())

SINOVLAR = ["Bark Twain, Sir Waggington, Chewbarka",
            "Bark Twain, Sir Waggington, and Chewbarka",
            "1. Bark Twain\n2. Sir Waggington\n3. Chewbarka",
            "Here are some names: Bark Twain, Sir Waggington.",
            "faqat bitta"]

for s in SINOVLAR:
    r = xp.invoke(s)
    belgi = "✅" if r["ok"] else "❌"
    print(f"{belgi} {s[:40]!r:44s} → {r.get('natija', r.get('sabab'))}")

print()
xp.hisobot()
```

> ## 🏆 **`hisobot()` — ISHLAB CHIQARISHDA MAJBURIY.**
>
> U sizga **aynan qanchalik tez-tez** parser sinayotganini ko'rsatadi. Bu — 2-darsdagi **jim xato** muammosining **yechimi**.
>
> ## ⭐ **`zaxira_parser` — ENG FOYDALI XUSUSIYAT.** Model ba'zan vergul, ba'zan raqamli ro'yxat yozadi. Zaxira parser **ikkalasini ham** qamrab oladi.
>
> ## ⚠️ **AGAR ZAXIRA TEZ-TEZ ISHLASA** — bu **signal**: promptingiz **yetarli aniq emas**.

---

# 📊 2-loyiha. Parser turnir jadvali

> **Maqsad:** *"Qaysi parser mening vazifam uchun yaxshi?"* savoliga **o'lchov** bilan javob.

```python
class ParserTurnir:
    """Bir xil sinovlarda bir necha parserni solishtiradi."""

    def __init__(self):
        self.sinovlar = []
        self.ishtirokchilar = {}

    def sinov_qosh(self, kirish, kutilgan):
        self.sinovlar.append((kirish, kutilgan))
        return self

    def ishtirokchi(self, nom, fn):
        self.ishtirokchilar[nom] = fn
        return self

    def otkaz(self):
        q = []
        for nom, fn in self.ishtirokchilar.items():
            tog, xato, notogri = 0, 0, 0
            for kirish, kutilgan in self.sinovlar:
                try:
                    olingan = fn(kirish)
                except Exception:
                    xato += 1
                    continue
                if olingan == kutilgan:
                    tog += 1
                else:
                    notogri += 1
            n = len(self.sinovlar)
            q.append({"parser": nom, "to'g'ri": tog, "noto'g'ri": notogri,
                      "xato": xato, "aniqlik": round(tog / n, 2),
                      "jim_xato": round(notogri / n, 2)})
        d = pd.DataFrame(q).sort_values("aniqlik", ascending=False)
        print(d.to_string(index=False))
        print("\n💡 'jim_xato' — parser XATO BERMASDAN noto'g'ri natija qaytargan holat.")
        print("   Bu ustun QANCHALIK PAST bo'lsa — parser shunchalik XAVFSIZ.")
        eng = d.iloc[0]
        print(f"\n🏆 {eng.parser}  (aniqlik {eng.aniqlik}, "
              f"jim xato {eng.jim_xato})")
        return d

    def tafsilot(self, nom):
        fn = self.ishtirokchilar[nom]
        q = []
        for kirish, kutilgan in self.sinovlar:
            try:
                olingan, xato = fn(kirish), None
            except Exception as e:
                olingan, xato = None, type(e).__name__
            q.append({"kirish": str(kirish)[:34], "kutilgan": str(kutilgan)[:26],
                      "olingan": str(olingan)[:26], "xato": xato,
                      "ok": olingan == kutilgan})
        print(pd.DataFrame(q).to_string(index=False))
```

**Ishlatish:**

```python
lp, np_ = CommaSeparatedListOutputParser(), NumberedListOutputParser()
mp = MarkdownListOutputParser()

t = (ParserTurnir()
     .sinov_qosh("a, b, c",                    ["a", "b", "c"])
     .sinov_qosh("a,b,c",                      ["a", "b", "c"])
     .sinov_qosh("1. a\n2. b\n3. c",           ["a", "b", "c"])
     .sinov_qosh("- a\n- b\n- c",              ["a", "b", "c"])
     .sinov_qosh("Here are: a, b, c.",         ["a", "b", "c"])
     .sinov_qosh("a, b, and c",                ["a", "b", "c"])
     .sinov_qosh("a | b | c",                  ["a", "b", "c"])
     .ishtirokchi("Comma",            lambda s: lp.invoke(s))
     .ishtirokchi("Comma + tozalash", lambda s: royxat_tozala(lp.invoke(s)))
     .ishtirokchi("Numbered",         lambda s: np_.invoke(s))
     .ishtirokchi("Markdown",         lambda s: mp.invoke(s))
     .ishtirokchi("Quvur ' | '",      lambda s: [x.strip() for x in s.split("|") if x.strip()])
     .ishtirokchi("Universal",        lambda s: royxat_tozala(
         np_.invoke(s) if re.search(r"^\s*\d+[\.\)]", s, re.M)
         else mp.invoke(s) if re.search(r"^\s*[-*•]", s, re.M)
         else [x.strip() for x in s.split("|")] if "|" in s
         else lp.invoke(s))))

t.otkaz()
print("\n=== TAFSILOT: Comma ===")
t.tafsilot("Comma")
```

> ## 🏆 **`jim_xato` USTUNI — LOYIHANING ASOSIY QIYMATI.**
>
> ```
> xato      →  parser TO'XTADI  →  siz BILASIZ           ✅ arzon
> jim_xato  →  parser NOTO'G'RI natija berdi  →  ⚠️ siz BILMAYSIZ   💥 qimmat
> ```
>
> ## 🔑 **XATO BERADIGAN PARSER — XATO BERMAYDIGANIDAN YAXSHIROQ.** Bu — butun modulning **asosiy saboqi**.
>
> ## 💡 **`Universal` ISHTIROKCHISI — AMALIY YECHIM:** u formatni **aniqlaydi** va **mos parserni** tanlaydi.

---

# 🇺🇿 3-loyiha. O'zbekcha strukturali ekstraktor

> **Maqsad:** o'zbekcha matndan **tipli, tekshirilgan** ma'lumot olish.

```python
class UzEkstraktor:
    """O'zbekcha matndan strukturali ma'lumot — Pydantic bilan."""

    def __init__(self, chat=None):
        self.chat = chat
        self.jurnal = []

    # ── Sxemalar ──
    class Murojaat(BaseModel):
        """Bank mijozining murojaati."""
        bolim: Literal["karta", "depozit", "kredit", "boshqa"] = Field(
            description="qaysi bo'limga tegishli")
        shoshilinch: bool = Field(description="shoshilinch murojaatmi")
        kayfiyat: Literal["ijobiy", "neytral", "salbiy"] = Field(
            description="mijozning kayfiyati")
        xulosa: str = Field(description="bir jumlali xulosa, o'zbekcha",
                            max_length=140)

    class Tadbir(BaseModel):
        """Matndagi tadbir haqida ma'lumot."""
        nom: str = Field(description="tadbir nomi")
        sana: Optional[date] = Field(default=None,
                                     description="sana, YYYY-MM-DD")
        joy: Optional[str] = Field(default=None, description="o'tkaziladigan joy")
        ishtirokchilar: Optional[int] = Field(default=None, ge=0,
                                              description="ishtirokchilar soni")

    class Mahsulot(BaseModel):
        """Mahsulot sharhi."""
        mahsulot: str = Field(description="mahsulot nomi")
        baho: int = Field(description="1 dan 5 gacha baho", ge=1, le=5)
        ijobiy: list[str] = Field(default_factory=list,
                                  description="ijobiy jihatlar")
        salbiy: list[str] = Field(default_factory=list,
                                  description="salbiy jihatlar")

    # ── Ekstraksiya ──
    def parser(self, sxema):
        return PydanticOutputParser(pydantic_object=sxema)

    def ajrat(self, matn, sxema, urinish=2):
        p = self.parser(sxema)
        SISTEM = ("You extract structured data from Uzbek text. "
                  "Output ONLY valid JSON, no explanation, no markdown fence.\n\n"
                  + p.get_format_instructions())
        oxirgi = None
        for i in range(urinish):
            msgs = [("system", SISTEM), ("human", matn)]
            if oxirgi:
                msgs.append(("human",
                             f"Oldingi javob parse qilinmadi: {oxirgi}. "
                             f"Faqat to'g'ri JSON qaytaring."))
            try:
                r = self.chat.invoke(msgs)
                natija = p.invoke(r)
                self.jurnal.append({"sxema": sxema.__name__, "matn": matn[:32],
                                    "ok": True, "urinish": i + 1})
                return {"ok": True, "natija": natija, "urinish": i + 1}
            except Exception as e:
                oxirgi = f"{type(e).__name__}: {str(e)[:100]}"
        self.jurnal.append({"sxema": sxema.__name__, "matn": matn[:32],
                            "ok": False, "urinish": urinish})
        return {"ok": False, "sabab": oxirgi}

    # ── Offline sinov (modelsiz) ──
    def sxema_sinov(self, sxema, namunalar):
        """Model chaqirmasdan — parserning O'ZINI sinash."""
        p = self.parser(sxema)
        q = []
        for s, kutilgan_ok in namunalar:
            try:
                p.invoke(s); ok = True; xato = None
            except Exception as e:
                ok = False; xato = type(e).__name__
            q.append({"kirish": s[:40], "kutilgan": kutilgan_ok,
                      "olingan": ok, "xato": xato, "togri": ok == kutilgan_ok})
        d = pd.DataFrame(q)
        print(d.to_string(index=False))
        print(f"\n{int(d.togri.sum())}/{len(d)} to'g'ri")
        return d

    def hisobot(self):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))
        print(f"\nmuvaffaqiyat: {int(d.ok.sum())}/{len(d)} ({d.ok.mean():.0%})")
        qayta = (d.urinish > 1).sum()
        if qayta:
            print(f"⚠️ {qayta} marta QAYTA urinish kerak bo'ldi — "
                  f"sistem promptni aniqroq qiling")
```

**Ishlatish (modelsiz — sxemani sinash):**

```python
e = UzEkstraktor()

print("=== Murojaat sxemasi ===")
e.sxema_sinov(UzEkstraktor.Murojaat, [
    ('{"bolim":"karta","shoshilinch":true,"kayfiyat":"salbiy",'
     '"xulosa":"Karta bloklangan"}', True),
    ('{"bolim":"ipoteka","shoshilinch":true,"kayfiyat":"salbiy",'
     '"xulosa":"x"}', False),                       # bolim ro'yxatda YO'Q
    ('{"bolim":"karta","shoshilinch":"ha","kayfiyat":"salbiy",'
     '"xulosa":"x"}', False),                       # bool EMAS
    ('{"bolim":"karta","shoshilinch":true,"kayfiyat":"salbiy"}', False),  # xulosa YO'Q
])

print("\n=== Mahsulot sxemasi ===")
e.sxema_sinov(UzEkstraktor.Mahsulot, [
    ('{"mahsulot":"Telefon","baho":5,"ijobiy":["tez"],"salbiy":[]}', True),
    ('{"mahsulot":"Telefon","baho":9}', False),      # baho > 5
    ('{"mahsulot":"Telefon","baho":3}', True),       # ro'yxatlar ixtiyoriy
])
```

**Ishlatish (model bilan):**

```python
from langchain_openai import ChatOpenAI
e = UzEkstraktor(ChatOpenAI(model="gpt-4o-mini", temperature=0))

for m in ["Kartam bloklandi, pul yechib ololmayapman, juda shoshilinch!",
          "Depozit foizlari haqida ma'lumot bering, iltimos.",
          "Kredit to'lovim kechikdi, jarima solindimi? Juda xafaman."]:
    r = e.ajrat(m, UzEkstraktor.Murojaat)
    print(f"{'✅' if r['ok'] else '❌'} {m[:38]:40s} → "
          f"{r.get('natija', r.get('sabab'))}")

print()
e.hisobot()
```

> ## 🏆 **`sxema_sinov()` — MODELSIZ SINOV.**
>
> Siz sxemangizni **API chaqirmasdan** sinaysiz. Bu:
> ```
> ✅ BEPUL
> ✅ TEZ (bir soniya)
> ✅ Sxemadagi xatoni DARHOL topadi
> ```
>
> ## 🔑 **UCHTA `Literal` — UCHTA OQ RO'YXAT.** Model `"ipoteka"` qaytarsa — **darhol xato**, jim o'tib **ketmaydi**.
>
> ## ⚠️ **`urinish > 1` USTUNI — SIGNAL.** Agar model tez-tez qayta so'rashga majbur bo'lsa:
> ```
> ① Sistem promptni ANIQROQ qiling ("Output ONLY valid JSON")
> ② temperature=0 ekanini tekshiring
> ③ ⭐ with_structured_output ga o'ting  —  kafolat beradi
> ```
>
> ## 💡 **`Optional[date]` VA `default=None`** — matnda sana **bo'lmasligi** mumkin. Uni **majburiy** qilsangiz — model **o'ylab topadi** *(gallyutsinatsiya!)*.

---

## 🎯 Loyihalarni birlashtirish

```
2-loyiha (turnir)     →  vazifangizga QAYSI parser mos?
        ↓
1-loyiha (xavfsiz)    →  tanlangan parserni HIMOYALASH
        ↓
3-loyiha (uz ekstraktor) →  ⭐ tipli, tekshirilgan chiqish
```

> ## 🚀 **41-MODULDA BULAR `|` BILAN ZANJIRGA ULANADI:**
> ```python
> zanjir = prompt | chat | XavfsizParser(...)
> ```

---

🏠 [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
