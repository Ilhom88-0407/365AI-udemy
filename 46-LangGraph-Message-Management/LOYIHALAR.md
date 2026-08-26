# 🚀 46-modul mini-loyihalari

> **3 ta tayyor loyiha.** ## ⭐⭐ **Hammasi API kalitisiz.**

## ⚙️ Umumiy tayyorgarlik

```bash
pip install langgraph langchain-core tiktoken pandas
```

```python
import warnings; warnings.filterwarnings("ignore")
import time, json, operator
from pathlib import Path
from typing import Literal, Annotated
from typing_extensions import TypedDict
from collections.abc import Sequence
import tiktoken, pandas as pd

from langgraph.graph import START, END, StateGraph, add_messages, MessagesState
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.messages import (AIMessage, HumanMessage, BaseMessage,
                                     SystemMessage, RemoveMessage,
                                     trim_messages as lc_trim)
from langchain_core.language_models.fake_chat_models import FakeListChatModel

ENC = tiktoken.get_encoding("cl100k_base")
tok = lambda ms: sum(len(ENC.encode(str(m.content))) for m in ms)

chat = FakeListChatModel(responses=[
    "Iste'mol krediti yillik 24% dan boshlanadi, 24 oygacha beriladi.",
    "Daromad spravkasi va pasport nusxasi talab qilinadi.",
    "Foydalanuvchi kredit shartlari bilan qiziqmoqda."] * 80)
```

---

# 🧠 1-loyiha. Universal xotira menejeri

> **Maqsad:** uchala strategiyani **bitta sinfda** birlashtirib, **avtomatik tanlash** va **o'lchash**.

```python
class XotiraMenejeri:
    """qo'shish / trim / xulosalash / gibrid — bitta interfeys, to'liq o'lchov."""

    NARX = {"gpt-4o-mini": (0.15, 0.60), "gpt-4o": (2.50, 10.00),
            "ollama": (0.0, 0.0)}

    def __init__(self, chat, strategiya="gibrid", chegara_token=1500,
                 sozma_soz=6, maks_xulosa_token=200,
                 model="gpt-4o-mini", til="uz"):
        self.chat = chat
        self.strategiya = strategiya
        self.chegara = chegara_token
        self.sozma_soz = sozma_soz
        self.maks_xulosa = maks_xulosa_token
        self.model = model
        self.koef = 1.88 if til == "uz" else 1.0
        self.jurnal = []
        self.llm_chaqiruv = 0

    # ══════ STRATEGIYALAR ══════

    def _qoshish(self, state):
        """Hech narsa qilmaydi — hamma xabar saqlanadi."""
        return {"messages": []}, 0

    def _trim(self, state):
        """⭐ langchain_core.trim_messages — system saqlanadi, juftlik butun."""
        xs = list(state["messages"])
        try:
            saqlanadi = lc_trim(xs, max_tokens=self.chegara, strategy="last",
                                token_counter=tok, include_system=True,
                                start_on="human")
        except Exception as e:
            print(f"  ⚠️ lc_trim: {type(e).__name__} → oddiy usulga o'tdik")
            saqlanadi = self._oddiy_token_trim(xs)
        sid = {m.id for m in saqlanadi}
        rm = [RemoveMessage(id=m.id) for m in xs if m.id and m.id not in sid]
        return {"messages": rm}, 0

    def _oddiy_token_trim(self, xs):
        saqla, jami = [], 0
        for m in reversed(xs):
            t = len(ENC.encode(str(m.content)))
            if jami + t > self.chegara:
                break
            saqla.append(m); jami += t
        return list(reversed(saqla))

    def _xulosalash(self, state):
        """Hamma xabarni xulosaga siqadi."""
        xs = list(state["messages"])
        if not xs:
            return {"messages": []}, 0
        yangi, n = self._xulosa_yarat(xs, state.get("summary", ""))
        return ({"messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES)],
                 "summary": yangi}, n)

    def _gibrid(self, state):
        """🏆 Oxirgi N so'zma-so'z, eskisi xulosada."""
        xs = list(state["messages"])
        saqlanadi = xs[-self.sozma_soz:]
        xulosalanadi = xs[:-self.sozma_soz]
        if not xulosalanadi:
            return {"messages": []}, 0
        yangi, n = self._xulosa_yarat(xulosalanadi, state.get("summary", ""))
        rm = [RemoveMessage(id=m.id) for m in xulosalanadi if m.id]
        return {"messages": rm, "summary": yangi}, n

    # ══════ XULOSA YARATISH ══════

    def _xulosa_yarat(self, xabarlar, oldingi):
        matn = "".join(f"{m.type}: {m.content}\n" for m in xabarlar)
        kursatma = (
            f"Oldingi xulosani YANGILANG — takrorlamang, RIVOJLANTIRING.\n"
            f"Xulosada ALBATTA saqlang: ismlar, RAQAMLAR, summalar, "
            f"muddatlar, foizlar, qabul qilingan qarorlar.\n"
            f"Maksimal {self.maks_xulosa // 2} so'z.\n\n"
            f"Oldingi xulosa:\n{oldingi or '(hali yo‘q)'}\n\n"
            f"Yangi suhbat:\n{matn}")
        yangi = self.chat.invoke([HumanMessage(kursatma)]).content
        self.llm_chaqiruv += 1
        n = 1

        # ⭐ xulosa cheksiz o'smasin
        xt = len(ENC.encode(yangi))
        if xt > self.maks_xulosa:
            print(f"  ⚠️ xulosa {xt} token > {self.maks_xulosa} — qisqartirildi")
            yangi = self.chat.invoke([HumanMessage(
                f"Quyidagi xulosani {self.maks_xulosa // 3} so'zgacha "
                f"qisqartir, FAKTLARNI saqlab:\n{yangi}")]).content
            self.llm_chaqiruv += 1
            n += 1
        return yangi, n

    # ══════ TUGUN ══════

    def __call__(self, state):
        xs = list(state["messages"])
        oldin_n, oldin_t = len(xs), tok(xs)

        # ⭐ chegaradan oshmasa — hech narsa qilmaymiz
        if self.strategiya != "qo'shish" and oldin_t < self.chegara:
            self._yoz(oldin_n, oldin_t, oldin_n, oldin_t, 0, "o'tkazildi")
            return {"messages": []}

        f = {"qo'shish": self._qoshish, "trim": self._trim,
             "xulosalash": self._xulosalash, "gibrid": self._gibrid}
        natija, llm = f[self.strategiya](state)

        # keyingi holatni hisoblaymiz
        ochirilgan = {m.id for m in natija.get("messages", [])
                      if isinstance(m, RemoveMessage)}
        if REMOVE_ALL_MESSAGES in ochirilgan:
            qolgan = []
        else:
            qolgan = [m for m in xs if m.id not in ochirilgan]
        keyin_t = tok(qolgan) + len(ENC.encode(natija.get("summary", "")))

        # ── sifat tekshiruvlari ──
        if qolgan and qolgan[0].type == "ai":
            print("  ⚠️ birinchi xabar AI — juftlik BUZILGAN")
        if any(m.type == "system" for m in xs) and \
                not any(m.type == "system" for m in qolgan) and \
                not natija.get("summary"):
            print("  💥 SystemMessage O'CHIRILDI va xulosa YO'Q — "
                  "🇺🇿 model tilni unutadi!")

        if oldin_t != keyin_t:
            print(f"  ✂️ {oldin_n}→{len(qolgan)} xabar · "
                  f"{oldin_t}→{keyin_t} token")
        self._yoz(oldin_n, oldin_t, len(qolgan), keyin_t, llm,
                  self.strategiya)
        return natija

    def _yoz(self, on, ot, kn, kt, llm, harakat):
        self.jurnal.append({"oldin_n": on, "oldin_tok": ot, "keyin_n": kn,
                            "keyin_tok": kt, "llm": llm, "harakat": harakat})

    # ══════ CHATBOT UCHUN KONTEKST ══════

    def kontekst(self, state):
        """⭐ Xulosa BO'LSAGINA SystemMessage qo'shadi."""
        xul = state.get("summary", "")
        return (([SystemMessage(f"Suhbatning oldingi qismi xulosasi: {xul}")]
                 if xul else []) + list(state["messages"]))

    # ══════ HISOBOT ══════

    def hisobot(self, kunlik_suhbat=1000):
        if not self.jurnal:
            print("jurnal bo'sh")
            return
        d = pd.DataFrame(self.jurnal)
        print(d.to_string(index=False))

        otk = (d.harakat == "o'tkazildi").sum()
        print(f"\n📊 strategiya: {self.strategiya}")
        print(f"   {len(d)} chaqiruv · {otk} o'tkazildi "
              f"({otk/len(d):.0%}) · {self.llm_chaqiruv} LLM chaqiruvi")

        maks_kontekst = d.keyin_tok.max()
        nk, nc = self.NARX[self.model]
        # taxminiy: har burilishda keyin_tok kirish sifatida ketadi
        jami_kirish = d.keyin_tok.sum()
        narx = jami_kirish / 1e6 * nk
        print(f"\n💰 jami kirish ≈ {jami_kirish} token")
        print(f"   1 suhbat : ${narx:.6f}")
        print(f"   🇺🇿 yillik : ${narx*kunlik_suhbat*365*self.koef:,.0f}")
        print(f"   maks kontekst: {maks_kontekst} token")

        # ── tashxis ──
        print()
        if maks_kontekst > self.chegara * 1.2:
            print(f"  💥 kontekst chegaradan {maks_kontekst/self.chegara:.1f}× "
                  f"oshdi — strategiya ISHLAMAYAPTI")
        if otk == 0 and self.strategiya != "qo'shish":
            print("  ⚠️ HAR SAFAR ishladi — chegara juda PAST (💰 isrof)")
        if otk == len(d) and self.strategiya != "qo'shish":
            print("  ⚠️ HECH QACHON ishlamadi — chegara juda YUQORI")
        if self.llm_chaqiruv > len(d):
            print(f"  💰 {self.llm_chaqiruv} qo'shimcha LLM chaqiruvi — "
                  f"kechikish {self.llm_chaqiruv/len(d):.1f}× oshdi")
        return d


# ═══ TO'RT STRATEGIYANI SOLISHTIRAMIZ ═══

class S(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]


SAVOL = ("Kredit shartlarini batafsil tushuntiring: foiz stavkasi, muddat, "
         "kerakli hujjatlar, kafil talablari va erta to'lash imkoniyati.")


def qur(menejer, burilish=8):
    def ask(s: S) -> S:
        return {"messages": [AIMessage("Savolingiz?"), HumanMessage(SAVOL)],
                "burilish": 1}

    def bot(s: S) -> S:
        return {"messages": [chat.invoke(menejer.kontekst(s))]}

    def yol(s: S) -> Literal["xotira", "__end__"]:
        return "__end__" if s.get("burilish", 0) >= burilish else "xotira"

    g = StateGraph(S)
    g.add_node("ask", ask); g.add_node("bot", bot)
    g.add_node("xotira", menejer)
    g.add_edge(START, "ask"); g.add_edge("ask", "bot")
    g.add_conditional_edges("bot", yol)
    g.add_edge("xotira", "ask")
    return g.compile()


natijalar = []
for strat in ["qo'shish", "trim", "xulosalash", "gibrid"]:
    print(f"\n{'═' * 56}\n  {strat.upper()}\n{'═' * 56}")
    m = XotiraMenejeri(chat, strategiya=strat, chegara_token=200,
                       sozma_soz=4, maks_xulosa_token=80)
    o = qur(m).invoke(S(messages=[], summary="", burilish=0),
                      {"recursion_limit": 60})
    d = m.hisobot()
    natijalar.append({"strategiya": strat,
                      "yakuniy_xabar": len(o["messages"]),
                      "maks_kontekst": d.keyin_tok.max(),
                      "jami_kirish": d.keyin_tok.sum(),
                      "llm_qoshimcha": m.llm_chaqiruv})

print(f"\n\n{'═' * 56}\n  YAKUNIY TAQQOSLASH\n{'═' * 56}")
t = pd.DataFrame(natijalar)
t["🇺🇿 yillik_$"] = (t.jami_kirish / 1e6 * 0.15 * 1000 * 365 * 1.88).round()
print(t.to_string(index=False))
print("\n🏆 QAROR QOIDASI:")
print("   suhbat < 10 burilish   →  qo'shish (eng sodda)")
print("   suhbat 10–50 burilish  →  ⭐ trim")
print("   suhbat > 50 burilish   →  ⭐⭐ gibrid")
```

> ## 🏆 **NIMA UCHUN BU LOYIHA MUHIM?**
> ```
> ✅ To'rt strategiya — BITTA interfeys → almashtirish oson
> ⭐ Chegaradan oshmasa — LLM CHAQIRILMAYDI (💰 chaqiruvlar yarmiga)
> ⭐ Xulosa cheksiz o'smaydi — avtomatik qisqartiriladi
> 💥 SystemMessage o'chsa — OGOHLANTIRADI (🇺🇿 til yo'qolishi)
> ```

---

# 🔬 2-loyiha. Xotira sifat sinovchisi

> **Maqsad:** *"Trim yoki xulosalash suhbat SIFATINI qanchalik buzadi?"* — buni **o'lchash**.

```python
class XotiraSifatSinov:
    """Xotira strategiyasi ma'lumotni QANCHALIK yo'qotayotganini o'lchaydi."""

    def __init__(self, chat, til="uz"):
        self.chat = chat
        self.koef = 1.88 if til == "uz" else 1.0
        self.natijalar = []

    # ── suhbat yaratamiz: har burilishda YANGI FAKT kiritamiz ──
    @staticmethod
    def suhbat_yarat(faktlar):
        """faktlar = [("savol", "javob", "tekshiriladigan_fakt"), ...]"""
        xs = [SystemMessage("Siz bank yordamchisisiz. "
                            "FAQAT O'ZBEK TILIDA javob bering.")]
        for savol, javob, _ in faktlar:
            xs += [HumanMessage(savol), AIMessage(javob)]
        return add_messages([], xs)

    # ── strategiyalar: SAQLANADIGAN xabarlarni qaytaradi ──
    def _qoshish(self, xs, chegara):
        return list(xs), ""

    def _trim_son(self, xs, chegara, n=5):
        return list(xs[-n:]), ""

    def _trim_token(self, xs, chegara):
        try:
            return list(lc_trim(xs, max_tokens=chegara, strategy="last",
                                token_counter=tok, include_system=True,
                                start_on="human")), ""
        except Exception:
            saqla, jami = [], 0
            for m in reversed(xs):
                t = len(ENC.encode(str(m.content)))
                if jami + t > chegara:
                    break
                saqla.append(m); jami += t
            return list(reversed(saqla)), ""

    def _xulosa(self, xs, chegara):
        matn = "".join(f"{m.type}: {m.content}\n" for m in xs)
        xul = self.chat.invoke([HumanMessage(
            "Suhbatni xulosalang. Ismlar, RAQAMLAR, summalar, muddatlarni "
            f"ALBATTA saqlang.\n\n{matn}")]).content
        return [], xul

    def _gibrid(self, xs, chegara, sozma_soz=4):
        saqlanadi = list(xs[-sozma_soz:])
        eski = list(xs[:-sozma_soz])
        if not eski:
            return saqlanadi, ""
        matn = "".join(f"{m.type}: {m.content}\n" for m in eski)
        xul = self.chat.invoke([HumanMessage(
            "Suhbatni xulosalang. Ismlar, RAQAMLAR, summalar, muddatlarni "
            f"ALBATTA saqlang.\n\n{matn}")]).content
        return saqlanadi, xul

    # ── baholash ──
    @staticmethod
    def _norm(s):
        return "".join(str(s).lower().split()).replace("'", "").replace("’", "")

    def _fakt_saqlandi(self, saqlanadi, xulosa, faktlar):
        matn = self._norm("".join(str(m.content) for m in saqlanadi) + xulosa)
        return [f for _, _, f in faktlar if self._norm(f) in matn]

    def sinov(self, faktlar, chegara=120):
        xs = self.suhbat_yarat(faktlar)
        asl_tok = tok(xs)
        jami_fakt = len(faktlar)

        print(f"asl suhbat: {len(xs)} xabar · {asl_tok} token · "
              f"{jami_fakt} tekshiriladigan fakt")
        print(f"chegara: {chegara} token\n")

        for nom, f in [("qo'shish", self._qoshish),
                       ("trim (son -5)", self._trim_son),
                       ("trim (token)", self._trim_token),
                       ("xulosalash", self._xulosa),
                       ("gibrid", self._gibrid)]:
            saqlanadi, xulosa = f(xs, chegara)
            topildi = self._fakt_saqlandi(saqlanadi, xulosa, faktlar)
            yakuniy_tok = tok(saqlanadi) + len(ENC.encode(xulosa))
            self.natijalar.append({
                "strategiya": nom,
                "xabar": len(saqlanadi),
                "token": yakuniy_tok,
                "tejaldi_%": round((1 - yakuniy_tok / asl_tok) * 100, 1),
                "fakt": f"{len(topildi)}/{jami_fakt}",
                "fakt_%": round(len(topildi) / jami_fakt * 100),
                "system": "✅" if any(m.type == "system" for m in saqlanadi)
                          else ("📝" if xulosa else "💥"),
                "yoqolgan": [f for _, _, f in faktlar
                             if f not in topildi][:2]})
        return self.hisobot(asl_tok)

    def hisobot(self, asl_tok, burilish=20, kunlik=1000):
        d = pd.DataFrame(self.natijalar)
        print(d.to_string(index=False))

        print(f"\n── 💰 🇺🇿 yillik narx ({kunlik}/kun × {burilish} burilish) ──")
        for _, r in d.iterrows():
            y = r.token * burilish / 1e6 * 0.15 * kunlik * 365 * self.koef
            print(f"  {r.strategiya:16s} ${y:9,.0f}")

        # ── ⭐ ASOSIY O'LCHOV: samaradorlik ──
        d["samaradorlik"] = (d["fakt_%"] / d.token.clip(lower=1) * 100).round(2)
        print("\n── ⭐ SAMARADORLIK (fakt% / token) ──")
        print(d[["strategiya", "fakt_%", "token",
                 "samaradorlik"]].sort_values("samaradorlik",
                                              ascending=False).to_string(
                                                  index=False))
        eng = d.loc[d.samaradorlik.idxmax()]
        print(f"\n🏆 ENG SAMARALI: {eng.strategiya} — "
              f"{eng['fakt_%']}% fakt, {eng.token} token")

        # ── ogohlantirishlar ──
        print()
        for _, r in d.iterrows():
            if r.system == "💥":
                print(f"  💥 '{r.strategiya}': SystemMessage YO'QOLDI — "
                      f"🇺🇿 model tilni unutadi")
            if r["fakt_%"] < 60 and r.strategiya != "qo'shish":
                print(f"  💥 '{r.strategiya}': faqat {r['fakt_%']}% fakt "
                      f"saqlandi. Yo'qolgan: {r.yoqolgan}")
            elif r["fakt_%"] < 90 and r.strategiya != "qo'shish":
                print(f"  ⚠️ '{r.strategiya}': {r['fakt_%']}% fakt · "
                      f"yo'qolgan: {r.yoqolgan}")
        print("\n💡 ESLATMA: soxta model bilan xulosalash natijalari MA'NOSIZ.")
        print("   Haqiqiy model bilan ishga tushiring.")
        print("🏆 ENG ISHONCHLI YECHIM — faktlarni state MAYDONIDA saqlash:")
        print("     class State(MessagesState):")
        print("         summa: int      # ⭐ xotira strategiyasi TEGMAYDI")
        return d


FAKTLAR = [
    ("Salom, men Oybek.", "Salom Oybek! Qanday yordam bera olaman?", "Oybek"),
    ("50 000 000 so'm kredit kerak.",
     "Tushundim, 50 000 000 so'm. Muddat qancha?", "50 000 000"),
    ("24 oyga.", "24 oy uchun yillik stavka 24%.", "24%"),
    ("Oylik to'lov qancha?", "Oylik to'lov 2 643 555 so'm.", "2 643 555"),
    ("Qanday hujjat kerak?",
     "Pasport va daromad spravkasi kerak.", "spravka"),
    ("Kafil kerakmi?", "10 mln dan yuqori summada kafil kerak.", "kafil"),
]

XotiraSifatSinov(chat, til="uz").sinov(FAKTLAR, chegara=120)
```

> ## 🏆 **ASOSIY O'LCHOV — `samaradorlik = fakt% / token`:**
> ```
> Ko'p fakt + kam token  →  ⭐ YUQORI samaradorlik
> Ko'p fakt + ko'p token →  qo'shish (qimmat)
> Kam fakt + kam token   →  💥 arzon, LEKIN FOYDASIZ
> ```
>
> ## 💥 **BU LOYIHA KO'RSATADIGAN ENG MUHIM NARSA:** trim va xulosalash **narxni tejaydi**, lekin **ma'lumotni yo'qotadi**. Savol — **qanchasini**.
>
> ## 🇺🇿 **VA `system` USTUNI:** `💥` bo'lsa — o'zbekcha ko'rsatma **o'chgan**, model **inglizchaga o'tadi**.

---

# 📊 3-loyiha. Suhbat jurnali va tahlilchi

> **Maqsad:** haqiqiy suhbatlarni **yozib borish** va *"strategiyani qayerda o'zgartirish kerak?"* degan savolga **raqam bilan** javob berish.

```python
class SuhbatJurnali:
    """Har suhbatni JSON'ga yozadi va statistik tahlil beradi."""

    def __init__(self, fayl="suhbatlar.jsonl", til="uz"):
        self.fayl = Path(fayl)
        self.koef = 1.88 if til == "uz" else 1.0
        self.joriy = None

    # ── suhbat boshlash ──
    def boshla(self, suhbat_id, strategiya):
        self.joriy = {"id": str(suhbat_id), "strategiya": strategiya,
                      "burilishlar": [], "boshlandi": time.time()}
        return self

    # ── har burilishni yozish ──
    def burilish(self, state, llm_chaqiruv=1, ms=0):
        if self.joriy is None:
            raise RuntimeError("avval boshla() ni chaqiring")
        xs = list(state.get("messages", []))
        self.joriy["burilishlar"].append({
            "n": len(self.joriy["burilishlar"]) + 1,
            "xabar": len(xs),
            "kontekst_tok": tok(xs),
            "xulosa_tok": len(ENC.encode(state.get("summary", ""))),
            "llm": llm_chaqiruv,
            "ms": round(ms),
            "turlar": {t: sum(1 for m in xs if m.type == t)
                       for t in ("system", "human", "ai")},
        })
        return self

    # ── yakunlash ──
    def yakunla(self, muvaffaqiyat=True, izoh=""):
        if self.joriy is None:
            return
        self.joriy["muvaffaqiyat"] = muvaffaqiyat
        self.joriy["izoh"] = izoh
        self.joriy["davomiylik_s"] = round(time.time()
                                           - self.joriy["boshlandi"], 2)
        b = self.joriy["burilishlar"]
        self.joriy["jami_kirish_tok"] = sum(x["kontekst_tok"] for x in b)
        self.joriy["maks_kontekst"] = max((x["kontekst_tok"] for x in b),
                                          default=0)
        self.joriy["jami_llm"] = sum(x["llm"] for x in b)
        self.joriy["burilish_soni"] = len(b)

        with self.fayl.open("a", encoding="utf-8") as f:
            f.write(json.dumps(self.joriy, ensure_ascii=False) + "\n")
        r = self.joriy
        self.joriy = None
        return r

    # ══════ TAHLIL ══════

    def yukla(self):
        if not self.fayl.exists():
            print("jurnal fayli yo'q")
            return pd.DataFrame()
        q = [json.loads(l) for l in
             self.fayl.read_text(encoding="utf-8").splitlines() if l.strip()]
        return pd.DataFrame([{k: v for k, v in x.items()
                              if k != "burilishlar"} for x in q])

    def tahlil(self, kunlik_suhbat=1000, model_narx=0.15):
        d = self.yukla()
        if d.empty:
            return d

        print("── SUHBATLAR ──")
        print(d.to_string(index=False))

        print("\n── STRATEGIYA BO'YICHA ──")
        j = d.groupby("strategiya").agg(
            suhbat=("id", "size"),
            ort_burilish=("burilish_soni", "mean"),
            ort_kirish_tok=("jami_kirish_tok", "mean"),
            maks_kontekst=("maks_kontekst", "max"),
            ort_llm=("jami_llm", "mean"),
            muvaffaqiyat=("muvaffaqiyat", "mean")).round(1)
        j["🇺🇿 yillik_$"] = (j.ort_kirish_tok / 1e6 * model_narx
                            * kunlik_suhbat * 365 * self.koef).round()
        print(j.to_string())

        # ── ⭐ TAVSIYA ──
        print("\n── 🏆 TAVSIYA ──")
        yaxshi = j[j.muvaffaqiyat >= 0.9]
        if yaxshi.empty:
            print("  💥 HECH BIR strategiya 90% muvaffaqiyatga yetmadi")
            print("     → xotira emas, PROMPT yoki MODEL muammosi bo'lishi mumkin")
        else:
            eng = yaxshi["🇺🇿 yillik_$"].idxmin()
            print(f"  ⭐ {eng}: {yaxshi.loc[eng, 'muvaffaqiyat']:.0%} "
                  f"muvaffaqiyat · ${yaxshi.loc[eng, '🇺🇿 yillik_$']:,.0f}/yil")
            qimmat = j["🇺🇿 yillik_$"].max()
            print(f"  💰 eng qimmatidan ${qimmat - yaxshi.loc[eng, '🇺🇿 yillik_$']:,.0f}"
                  f"/yil arzon")

        # ── ogohlantirishlar ──
        print()
        uzun = d[d.burilish_soni > 20]
        if len(uzun) / len(d) > 0.3:
            print(f"  ⚠️ suhbatlarning {len(uzun)/len(d):.0%} qismi 20+ burilish "
                  f"→ xulosalash yoki gibrid tavsiya etiladi")
        katta = d[d.maks_kontekst > 4000]
        if len(katta):
            print(f"  💥 {len(katta)} suhbatda kontekst 4000 tokendan oshdi "
                  f"(maks {d.maks_kontekst.max()})")
        past = d[~d.muvaffaqiyat]
        if len(past):
            print(f"  ⚠️ {len(past)} muvaffaqiyatsiz suhbat:")
            for _, r in past.head(3).iterrows():
                print(f"      {r.id} ({r.strategiya}): {r.izoh}")
        return j


# ─── ishlatish ───
jurnal = SuhbatJurnali("suhbatlar.jsonl", til="uz")


class S(MessagesState):
    summary: str
    burilish: Annotated[int, operator.add]


SAVOL = ("Kredit shartlarini tushuntiring: foiz, muddat, hujjatlar, "
         "kafil talablari.")


def suhbat_otkaz(strategiya, suhbat_id, burilish=6, chegara=200):
    m = XotiraMenejeri(chat, strategiya=strategiya, chegara_token=chegara,
                       sozma_soz=4, maks_xulosa_token=80)
    jurnal.boshla(suhbat_id, strategiya)

    def ask(s: S) -> S:
        return {"messages": [AIMessage("Savolingiz?"), HumanMessage(SAVOL)],
                "burilish": 1}

    def bot(s: S) -> S:
        t0 = time.perf_counter()
        r = chat.invoke(m.kontekst(s))
        jurnal.burilish(s, llm_chaqiruv=1,
                        ms=(time.perf_counter() - t0) * 1000)
        return {"messages": [r]}

    def yol(s: S) -> Literal["xotira", "__end__"]:
        return "__end__" if s.get("burilish", 0) >= burilish else "xotira"

    g = StateGraph(S)
    g.add_node("ask", ask); g.add_node("bot", bot); g.add_node("xotira", m)
    g.add_edge(START, "ask"); g.add_edge("ask", "bot")
    g.add_conditional_edges("bot", yol)
    g.add_edge("xotira", "ask")

    o = g.compile().invoke(S(messages=[], summary="", burilish=0),
                           {"recursion_limit": 60})
    # muvaffaqiyat mezoni: kontekst chegaradan oshmadimi
    ok = tok(o["messages"]) <= chegara * 1.2
    jurnal.yakunla(muvaffaqiyat=ok,
                   izoh="" if ok else f"kontekst {tok(o['messages'])} > "
                                      f"{int(chegara*1.2)}")
    return o


# eski jurnalni tozalaymiz
Path("suhbatlar.jsonl").unlink(missing_ok=True)

for i, strat in enumerate(["qo'shish", "trim", "gibrid"] * 3, 1):
    suhbat_otkaz(strat, f"suhbat-{i:02d}", burilish=6 + i % 4)

jurnal.tahlil(kunlik_suhbat=1000)
```

> ## 🏆 **NIMA UCHUN JURNAL SHART?**
> ```
> ✅ Haqiqiy suhbatlar — sintetik sinovdan ISHONCHLIROQ
> ✅ Strategiyani ALMASHTIRISH qarori — raqam bilan
> ⭐ "suhbatlarning 30% qismi 20+ burilish" — bu SIGNAL
> 💥 "kontekst 4000 tokendan oshdi" — bu MUAMMO
> ```
>
> ## 💡 **`.jsonl` FORMATI — HAR SATR BITTA JSON.** Fayl **o'sib boraveradi**, va **qismlab o'qish** oson.
>
> ## ⚠️ **`ensure_ascii=False` SHART** — 🇺🇿 o'zbekcha matn **o'qiladigan** bo'lsin *(44-modul)*.

---

## 📌 Loyihalar xaritasi

| # | Loyiha | Nima hal qiladi | Kalit |
|---:|---|---|---|
| 1 | 🧠 **Xotira menejeri** | To'rt strategiya, bitta interfeys | ## ⭐ **chegaradan oshmasa — chaqirmaydi** |
| 2 | 🔬 **Sifat sinovchisi** | *"Qancha ma'lumot yo'qoladi?"* | ## ⭐ `samaradorlik = fakt% / token` |
| 3 | 📊 **Suhbat jurnali** | Strategiyani **raqam bilan** tanlash | ## `.jsonl` + `ensure_ascii=False` |

---

⬅️ [Modul boshiga](README.md) · 📝 [Mashqlar](MASHQLAR.md)
